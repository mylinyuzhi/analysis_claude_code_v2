
// @from(Ln 557477, Col 4)
l$5 = `# Claude API — Go

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
    MaxTokens: 16000,
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
    MaxTokens: 64000,
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
            MaxTokens: 16000,
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
            MaxTokens: 16000,
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

## Prompt Caching

\`System\` is \`[]TextBlockParam\`; set \`CacheControl\` on the last block to cache tools + system together. For placement patterns and the silent-invalidator audit checklist, see \`shared/prompt-caching.md\`.

\`\`\`go
System: []anthropic.TextBlockParam{{
    Text:         longSystemPrompt,
    CacheControl: anthropic.NewCacheControlEphemeralParam(), // default 5m TTL
}},
\`\`\`

For 1-hour TTL: \`anthropic.CacheControlEphemeralParam{TTL: anthropic.CacheControlEphemeralTTLTTL1h}\`. There's also a top-level \`CacheControl\` on \`MessageNewParams\` that auto-places on the last cacheable block.

Verify hits via \`resp.Usage.CacheCreationInputTokens\` / \`resp.Usage.CacheReadInputTokens\`.

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
    MaxTokens: 16000,
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
// @from(Ln 557899, Col 4)
c$5 = () => {}
// @from(Ln 557900, Col 4)
i$5 = `# Claude API — Java

> **Note:** The Java SDK supports the Claude API and beta tool use with annotated classes. Agent SDK is not yet available for Java.

## Installation

Maven:

\`\`\`xml
<dependency>
    <groupId>com.anthropic</groupId>
    <artifactId>anthropic-java</artifactId>
    <version>2.17.0</version>
</dependency>
\`\`\`

Gradle:

\`\`\`groovy
implementation("com.anthropic:anthropic-java:2.17.0")
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
    .maxTokens(16000L)
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
    .maxTokens(64000L)
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
        .maxTokens(16000L)
        .putAdditionalHeader("anthropic-beta", "structured-outputs-2025-11-13")
        .addTool(GetWeather.class)
        .addUserMessage("What's the weather in San Francisco?")
        .build());

for (BetaMessage message : toolRunner) {
    System.out.println(message);
}
\`\`\`

### Memory Tool

The Java SDK provides \`BetaMemoryToolHandler\` for implementing the memory tool backend. You supply a handler that manages file storage, and the \`BetaToolRunner\` handles memory tool calls automatically.

\`\`\`java
import com.anthropic.helpers.BetaMemoryToolHandler;
import com.anthropic.helpers.BetaToolRunner;
import com.anthropic.models.beta.messages.BetaMemoryTool20250818;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.ToolRunnerCreateParams;

// Implement BetaMemoryToolHandler with your storage backend (e.g., filesystem)
BetaMemoryToolHandler memoryHandler = new FileSystemMemoryToolHandler(sandboxRoot);

MessageCreateParams createParams = MessageCreateParams.builder()
    .model("{{OPUS_ID}}")
    .maxTokens(4096L)
    .addTool(BetaMemoryTool20250818.builder().build())
    .addUserMessage("Remember that my favorite color is blue")
    .build();

BetaToolRunner toolRunner = client.beta().messages().toolRunner(
    ToolRunnerCreateParams.builder()
        .betaMemoryToolHandler(memoryHandler)
        .initialMessageParams(createParams)
        .build());

for (BetaMessage message : toolRunner) {
    System.out.println(message);
}
\`\`\`

See the [shared memory tool concepts](../shared/tool-use-concepts.md) for more details on the memory tool.

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
    .maxTokens(16000L)
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

System message as a list of \`TextBlockParam\` with \`CacheControlEphemeral\`. Use \`.systemOfTextBlockParams(...)\` — the plain \`.system(String)\` overload can't carry cache control. For placement patterns and the silent-invalidator audit checklist, see \`shared/prompt-caching.md\`.

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

Verify hits via \`response.usage().cacheCreationInputTokens()\` / \`response.usage().cacheReadInputTokens()\`.

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
    .maxTokens(16000L)
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
    .maxTokens(16000L)
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
// @from(Ln 558333, Col 4)
n$5 = () => {}
// @from(Ln 558334, Col 4)
o$5 = `# Claude API — PHP

> **Note:** The PHP SDK is the official Anthropic SDK for PHP. A beta tool runner is available via \`$client->beta->messages->toolRunner()\`. Structured output helpers are supported via \`StructuredOutputModel\` classes. Agent SDK is not available. Bedrock, Vertex AI, and Foundry clients are supported.

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
    maxTokens: 16000,
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

> **Requires SDK v0.5.0+.** v0.4.0 and earlier used a single \`$params\` array; calling with named parameters throws \`Unknown named parameter $model\`. Upgrade: \`composer require "anthropic-ai/sdk:^0.7"\`

\`\`\`php
use Anthropic\\Messages\\RawContentBlockDeltaEvent;
use Anthropic\\Messages\\TextDelta;

$stream = $client->messages->createStream(
    model: '{{OPUS_ID}}',
    maxTokens: 64000,
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

## Tool Use

### Tool Runner (Beta)

**Beta:** The PHP SDK provides a tool runner via \`$client->beta->messages->toolRunner()\`. Define tools with \`BetaRunnableTool\` — a definition array plus a \`run\` closure:

\`\`\`php
use Anthropic\\Lib\\Tools\\BetaRunnableTool;

$weatherTool = new BetaRunnableTool(
    definition: [
        'name' => 'get_weather',
        'description' => 'Get the current weather for a location.',
        'input_schema' => [
            'type' => 'object',
            'properties' => [
                'location' => ['type' => 'string', 'description' => 'City and state'],
            ],
            'required' => ['location'],
        ],
    ],
    run: function (array $input): string {
        return "The weather in {$input['location']} is sunny and 72°F.";
    },
);

$runner = $client->beta->messages->toolRunner(
    maxTokens: 16000,
    messages: [['role' => 'user', 'content' => 'What is the weather in Paris?']],
    model: '{{OPUS_ID}}',
    tools: [$weatherTool],
);

foreach ($runner as $message) {
    foreach ($message->content as $block) {
        if ($block->type === 'text') {
            echo $block->text;
        }
    }
}
\`\`\`

### Manual Loop

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
    maxTokens: 16000,
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
        maxTokens: 16000,
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

## Prompt Caching

\`system:\` takes an array of text blocks; set \`cacheControl\` on the last block. Array-shape syntax (camelCase keys) is idiomatic. For placement patterns and the silent-invalidator audit checklist, see \`shared/prompt-caching.md\`.

\`\`\`php
$message = $client->messages->create(
    model: '{{OPUS_ID}}',
    maxTokens: 16000,
    system: [
        ['type' => 'text', 'text' => $longSystemPrompt, 'cacheControl' => ['type' => 'ephemeral']],
    ],
    messages: [['role' => 'user', 'content' => 'Summarize the key points']],
);
\`\`\`

For 1-hour TTL: \`'cacheControl' => ['type' => 'ephemeral', 'ttl' => '1h']\`. There's also a top-level \`cacheControl:\` on \`messages->create(...)\` that auto-places on the last cacheable block.

Verify hits via \`$message->usage->cacheCreationInputTokens\` / \`$message->usage->cacheReadInputTokens\`.

---

## Structured Outputs

### Using StructuredOutputModel (Recommended)

Define a PHP class implementing \`StructuredOutputModel\` and pass it as \`outputConfig\`:

\`\`\`php
use Anthropic\\Lib\\Contracts\\StructuredOutputModel;
use Anthropic\\Lib\\Concerns\\StructuredOutputModelTrait;
use Anthropic\\Lib\\Attributes\\Constrained;

class Person implements StructuredOutputModel
{
    use StructuredOutputModelTrait;

    #[Constrained(description: 'Full name')]
    public string $name;

    public int $age;

    public ?string $email = null;  // nullable = optional field
}

$message = $client->messages->create(
    model: '{{OPUS_ID}}',
    maxTokens: 16000,
    messages: [['role' => 'user', 'content' => 'Generate a profile for Alice, age 30']],
    outputConfig: ['format' => Person::class],
);

$person = $message->parsedOutput();  // Person instance
echo $person->name;
\`\`\`

Types are inferred from PHP type hints. Use \`#[Constrained(description: '...')]\` to add descriptions. Nullable properties (\`?string\`) become optional fields.

### Raw Schema

\`\`\`php
$message = $client->messages->create(
    model: '{{OPUS_ID}}',
    maxTokens: 16000,
    messages: [['role' => 'user', 'content' => 'Extract: John (john@co.com), Enterprise plan']],
    outputConfig: [
        'format' => [
            'type' => 'json_schema',
            'schema' => [
                'type' => 'object',
                'properties' => [
                    'name' => ['type' => 'string'],
                    'email' => ['type' => 'string'],
                    'plan' => ['type' => 'string'],
                ],
                'required' => ['name', 'email', 'plan'],
                'additionalProperties' => false,
            ],
        ],
    ],
);

// First text block contains valid JSON
foreach ($message->content as $block) {
    if ($block->type === 'text') {
        $data = json_decode($block->text, true);
        break;
    }
}
\`\`\`

---

## Beta Features & Server-Side Tools

**\`betas:\` is NOT a param on \`$client->messages->create()\`** — it only exists on the beta namespace. Use it for features that need an explicit opt-in header:

\`\`\`php
use Anthropic\\Beta\\Messages\\BetaRequestMCPServerURLDefinition;

$response = $client->beta->messages->create(
    model: '{{OPUS_ID}}',
    maxTokens: 16000,
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
// @from(Ln 558710, Col 4)
r$5 = () => {}
// @from(Ln 558711, Col 4)
s$5 = `# Message Batches API — Python

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
                max_tokens=16000,
                messages=[{"role": "user", "content": "Summarize climate change impacts"}]
            )
        ),
        Request(
            custom_id="request-2",
            params=MessageCreateParamsNonStreaming(
                model="{{OPUS_ID}}",
                max_tokens=16000,
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
                max_tokens=16000,
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
// @from(Ln 558897, Col 4)
a$5 = () => {}
// @from(Ln 558898, Col 4)
e$5 = `# Files API — Python

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
    max_tokens=16000,
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
    max_tokens=16000,
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
        max_tokens=16000,
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
// @from(Ln 559064, Col 4)
t$5 = () => {}
// @from(Ln 559065, Col 4)
Kj5 = `# Claude API — Python

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
    max_tokens=16000,
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
    max_tokens=16000,
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
    max_tokens=16000,
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
    max_tokens=16000,
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

Cache large context to reduce costs (up to 90% savings). **Caching is a prefix match** — any byte change anywhere in the prefix invalidates everything after it. For placement patterns, architectural guidance (frozen system prompt, deterministic tool order, where to put volatile content), and the silent-invalidator audit checklist, read \`shared/prompt-caching.md\`.

### Automatic Caching (Recommended)

Use top-level \`cache_control\` to automatically cache the last cacheable block in the request — no need to annotate individual content blocks:

\`\`\`python
response = client.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=16000,
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
    max_tokens=16000,
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
    max_tokens=16000,
    system=[{
        "type": "text",
        "text": "You are an expert on this large document...",
        "cache_control": {"type": "ephemeral", "ttl": "1h"}  # 1 hour TTL
    }],
    messages=[{"role": "user", "content": "Summarize the key points"}]
)
\`\`\`

### Verifying Cache Hits

\`\`\`python
print(response.usage.cache_creation_input_tokens)  # tokens written to cache (~1.25x cost)
print(response.usage.cache_read_input_tokens)      # tokens served from cache (~0.1x cost)
print(response.usage.input_tokens)                 # uncached tokens (full cost)
\`\`\`

If \`cache_read_input_tokens\` is zero across repeated identical-prefix requests, a silent invalidator is at work — \`datetime.now()\` or a UUID in the system prompt, unsorted \`json.dumps()\`, or a varying tool set. See \`shared/prompt-caching.md\` for the full audit table.

---

## Extended Thinking

> **Opus 4.7, Opus 4.6, and Sonnet 4.6:** Use adaptive thinking. \`budget_tokens\` is removed on Opus 4.7 (400 if sent); deprecated on Opus 4.6 and Sonnet 4.6.
> **Older models:** Use \`thinking: {type: "enabled", budget_tokens: N}\` (must be < \`max_tokens\`, min 1024).

\`\`\`python
# Opus 4.7 / 4.6: adaptive thinking (recommended)
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
            max_tokens=kwargs.get("max_tokens", 16000),
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

> **Beta, Opus 4.7, Opus 4.6, and Sonnet 4.6.** When conversations approach the 200K context window, compaction automatically summarizes earlier context server-side. The API returns a \`compaction\` block; you must pass it back on subsequent requests — append \`response.content\`, not just the text.

\`\`\`python
import anthropic

client = anthropic.Anthropic()
messages = []

def chat(user_message: str) -> str:
    messages.append({"role": "user", "content": user_message})

    response = client.beta.messages.create(
        betas=["compact-2026-01-12"],
        model="{{OPUS_ID}}",
        max_tokens=16000,
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
    max_tokens=16000,
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
    max_tokens=16000,
    messages=[{"role": "user", "content": "Explain quantum computing"}]
)

# Use Sonnet for high-volume production workloads
standard_response = client.messages.create(
    model="{{SONNET_ID}}",  # $3.00/$15.00 per 1M tokens
    max_tokens=16000,
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
// @from(Ln 559486, Col 4)
qj5 = () => {}
// @from(Ln 559487, Col 4)
zj5 = `# Streaming — Python

## Quick Start

\`\`\`python
with client.messages.stream(
    model="{{OPUS_ID}}",
    max_tokens=64000,
    messages=[{"role": "user", "content": "Write a story"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
\`\`\`

### Async

\`\`\`python
async with async_client.messages.stream(
    model="{{OPUS_ID}}",
    max_tokens=64000,
    messages=[{"role": "user", "content": "Write a story"}]
) as stream:
    async for text in stream.text_stream:
        print(text, end="", flush=True)
\`\`\`

---

## Handling Different Content Types

Claude may return text, thinking blocks, or tool use. Handle each appropriately:

> **Opus 4.7 / Opus 4.6:** Use \`thinking: {type: "adaptive"}\`. On older models, use \`thinking: {type: "enabled", budget_tokens: N}\` instead.

\`\`\`python
with client.messages.stream(
    model="{{OPUS_ID}}",
    max_tokens=64000,
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
    max_tokens=64000,
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
    max_tokens=64000,
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
        max_tokens=64000,
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
// @from(Ln 559650, Col 4)
_j5 = () => {}
// @from(Ln 559651, Col 4)
Aj5 = `# Tool Use — Python

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
    max_tokens=16000,
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
            max_tokens=16000,
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
    max_tokens=16000,
    messages=[mcp_message(m) for m in prompt.messages],
)
\`\`\`

### MCP Resources as Content

\`\`\`python
from anthropic.lib.tools.mcp import mcp_resource_to_content

resource = await mcp_client.read_resource(uri="file:///path/to/doc.txt")
response = await client.beta.messages.create(
    model="{{OPUS_ID}}",
    max_tokens=16000,
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
        max_tokens=16000,
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
    max_tokens=16000,
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
            max_tokens=16000,
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
        max_tokens=16000,
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
    max_tokens=16000,
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
    max_tokens=16000,
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
    max_tokens=16000,
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
    max_tokens=16000,
    messages=[{"role": "user", "content": "Install tabulate and create data.json with sample data"}],
    tools=[{"type": "code_execution_20260120", "name": "code_execution"}]
)

# Get container ID from response
container_id = response1.container.id

# Second request: reuse the same container
response2 = client.messages.create(
    container=container_id,
    model="{{OPUS_ID}}",
    max_tokens=16000,
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
    max_tokens=16000,
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
    max_tokens=16000,
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
    max_tokens=16000,
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
    max_tokens=16000,
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
    max_tokens=16000,
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
    max_tokens=16000,
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
// @from(Ln 560242, Col 4)
Yj5 = () => {}
// @from(Ln 560243, Col 4)
wj5 = "# Managed Agents — Python\n\n> **Bindings not shown here:** This README covers the most common managed-agents flows for Python. If you need a class, method, namespace, field, or behavior that isn't shown, WebFetch the Python SDK repo **or the relevant docs page** from `shared/live-sources.md` rather than guess. Do not extrapolate from cURL shapes or another language's SDK.\n\n> **Agents are persistent — create once, reference by ID.** Store the agent ID returned by `agents.create` and pass it to every subsequent `sessions.create`; do not call `agents.create` in the request path. The Anthropic CLI is one convenient way to create agents and environments from version-controlled YAML — its URL is in `shared/live-sources.md`. The examples below show in-code creation for completeness; in production the create call belongs in setup, not in the request path.\n\n## Installation\n\n```bash\npip install anthropic\n```\n\n## Client Initialization\n\n```python\nimport anthropic\n\n# Default (uses ANTHROPIC_API_KEY env var)\nclient = anthropic.Anthropic()\n\n# Explicit API key\nclient = anthropic.Anthropic(api_key=\"your-api-key\")\n```\n\n---\n\n## Create an Environment\n\n```python\nenvironment = client.beta.environments.create(\n    name=\"my-dev-env\",\n    config={\n        \"type\": \"cloud\",\n        \"networking\": {\"type\": \"unrestricted\"},\n    },\n)\nprint(environment.id)  # env_...\n```\n\n---\n\n## Create an Agent (required first step)\n\n> ⚠️ **There is no inline agent config.** `model`/`system`/`tools` live on the agent object, not the session. Always start with `agents.create()` — the session only takes `agent={\"type\": \"agent\", \"id\": agent.id}`.\n\n### Minimal\n\n```python\n# 1. Create the agent (reusable, versioned)\nagent = client.beta.agents.create(\n    name=\"Coding Assistant\",\n    model=\"{{OPUS_ID}}\",\n    tools=[{\"type\": \"agent_toolset_20260401\", \"default_config\": {\"enabled\": True}}],\n)\n\n# 2. Start a session\nsession = client.beta.sessions.create(\n    agent={\"type\": \"agent\", \"id\": agent.id, \"version\": agent.version},\n    environment_id=environment.id,\n)\nprint(session.id, session.status)\n```\n\n### With system prompt and custom tools\n\n```python\nimport os\n\nagent = client.beta.agents.create(\n    name=\"Code Reviewer\",\n    model=\"{{OPUS_ID}}\",\n    system=\"You are a senior code reviewer.\",\n    tools=[\n        {\"type\": \"agent_toolset_20260401\"},\n        {\n            \"type\": \"custom\",\n            \"name\": \"run_tests\",\n            \"description\": \"Run the test suite\",\n            \"input_schema\": {\n                \"type\": \"object\",\n                \"properties\": {\n                    \"test_path\": {\"type\": \"string\", \"description\": \"Path to test file\"}\n                },\n                \"required\": [\"test_path\"],\n            },\n        },\n    ],\n)\n\nsession = client.beta.sessions.create(\n    agent={\"type\": \"agent\", \"id\": agent.id, \"version\": agent.version},\n    environment_id=environment.id,\n    title=\"Code review session\",\n    resources=[\n        {\n            \"type\": \"github_repository\",\n            \"url\": \"https://github.com/owner/repo\",\n            \"mount_path\": \"/workspace/repo\",\n            \"authorization_token\": os.environ[\"GITHUB_TOKEN\"],\n            \"branch\": \"main\",\n        }\n    ],\n)\n```\n\n---\n\n## Send a User Message\n\n```python\nclient.beta.sessions.events.send(\n    session_id=session.id,\n    events=[\n        {\n            \"type\": \"user.message\",\n            \"content\": [{\"type\": \"text\", \"text\": \"Review the auth module\"}],\n        }\n    ],\n)\n```\n\n> 💡 **Stream-first:** Open the stream *before* (or concurrently with) sending the message. The stream only delivers events that occur after it opens — stream-after-send means early events arrive buffered in one batch. See [Steering Patterns](../../shared/managed-agents-events.md#steering-patterns).\n\n---\n\n## Stream Events (SSE)\n\n```python\nimport json\n\n# Stream-first: open stream, then send while stream is live\nwith client.beta.sessions.stream(\n    session_id=session.id,\n) as stream:\n    client.beta.sessions.events.send(\n        session_id=session.id,\n        events=[{\"type\": \"user.message\", \"content\": [{\"type\": \"text\", \"text\": \"...\"}]}],\n    )\n    for event in stream:\n        ...  # process events\n\n# Standalone stream iteration:\nwith client.beta.sessions.stream(\n    session_id=session.id,\n) as stream:\n    for event in stream:\n        if event.type == \"agent.message\":\n            for block in event.content:\n                if block.type == \"text\":\n                    print(block.text, end=\"\", flush=True)\n        elif event.type == \"agent.custom_tool_use\":\n            # Custom tool invocation — session is now idle\n            print(f\"\\nCustom tool call: {event.tool_name}\")\n            print(f\"Input: {json.dumps(event.input)}\")\n            # Send result back (see below)\n        elif event.type == \"session.status_idle\":\n            print(\"\\n--- Agent idle ---\")\n        elif event.type == \"session.status_terminated\":\n            print(\"\\n--- Session terminated ---\")\n            break\n```\n\n---\n\n## Provide Custom Tool Result\n\n```python\nclient.beta.sessions.events.send(\n    session_id=session.id,\n    events=[\n        {\n            \"type\": \"user.custom_tool_result\",\n            \"custom_tool_use_id\": \"sevt_abc123\",\n            \"content\": [{\"type\": \"text\", \"text\": \"All 42 tests passed.\"}],\n        }\n    ],\n)\n```\n\n---\n\n## Poll Events\n\n```python\nevents = client.beta.sessions.events.list(\n    session_id=session.id,\n)\nfor event in events.data:\n    print(f\"{event.type}: {event.id}\")\n```\n\n> ⚠️ **Prefer the SDK over raw `requests`/`httpx`.** If you hand-roll a poll loop, don't assume `timeout=(5, 60)` or `httpx.Timeout(120)` caps total call duration — both are **per-chunk** read timeouts (reset on every byte), so a trickling response can block forever. For a hard wall-clock deadline, track `time.monotonic()` at the loop level and bail explicitly, or wrap with `asyncio.wait_for()`. See [Receiving Events](../../shared/managed-agents-events.md#receiving-events).\n\n---\n\n## Full Streaming Loop with Custom Tools\n\n```python\nimport json\n\n\ndef run_custom_tool(tool_name: str, tool_input: dict) -> str:\n    \"\"\"Execute a custom tool and return the result.\"\"\"\n    if tool_name == \"run_tests\":\n        # Your tool implementation here\n        return \"All tests passed.\"\n    return f\"Unknown tool: {tool_name}\"\n\n\ndef run_session(client, session_id: str):\n    \"\"\"Stream events and handle custom tool calls.\"\"\"\n    while True:\n        with client.beta.sessions.stream(\n            session_id=session_id,\n        ) as stream:\n            tool_calls = []\n            for event in stream:\n                if event.type == \"agent.message\":\n                    for block in event.content:\n                        if block.type == \"text\":\n                            print(block.text, end=\"\", flush=True)\n                elif event.type == \"agent.custom_tool_use\":\n                    tool_calls.append(event)\n                elif event.type == \"session.status_idle\":\n                    break\n                elif event.type == \"session.status_terminated\":\n                    return\n\n        if not tool_calls:\n            break\n\n        # Process custom tool calls\n        results = []\n        for call in tool_calls:\n            result = run_custom_tool(call.tool_name, call.input)\n            results.append({\n                \"type\": \"user.custom_tool_result\",\n                \"custom_tool_use_id\": call.id,\n                \"content\": [{\"type\": \"text\", \"text\": result}],\n            })\n\n        client.beta.sessions.events.send(\n            session_id=session_id,\n            events=results,\n        )\n```\n\n---\n\n## Upload a File\n\n```python\nwith open(\"data.csv\", \"rb\") as f:\n    file = client.beta.files.upload(\n        file=f,\n    )\n\n# Use in a session\nsession = client.beta.sessions.create(\n    agent={\"type\": \"agent\", \"id\": agent.id, \"version\": agent.version},\n    environment_id=environment.id,\n    resources=[{\"type\": \"file\", \"file_id\": file.id, \"mount_path\": \"/workspace/data.csv\"}],\n)\n```\n\n---\n\n## List and Download Session Files\n\nList files the agent wrote to `/mnt/session/outputs/` during a session, then download them.\n\n```python\n# List files associated with a session\nfiles = client.beta.files.list(\n    scope_id=session.id,\n    betas=[\"managed-agents-2026-04-01\"],\n)\nfor f in files.data:\n    print(f.filename, f.size_bytes)\n    # Download each file and save to disk\n    file_content = client.beta.files.download(f.id)\n    file_content.write_to_file(f.filename)\n```\n\n> 💡 There's a brief indexing lag (~1–3s) between `session.status_idle` and output files appearing in `files.list`. Retry once or twice if the list is empty.\n\n---\n\n## Session Management\n\n```python\n# Get session details\nsession = client.beta.sessions.retrieve(session_id=\"sesn_011CZxAbc123Def456\")\nprint(session.status, session.usage)\n\n# List sessions\nsessions = client.beta.sessions.list()\n\n# Delete a session\nclient.beta.sessions.delete(session_id=\"sesn_011CZxAbc123Def456\")\n\n# Archive a session\nclient.beta.sessions.archive(session_id=\"sesn_011CZxAbc123Def456\")\n```\n\n---\n\n## MCP Server Integration\n\n```python\n# Agent declares MCP server (no auth here — auth goes in a vault)\nagent = client.beta.agents.create(\n    name=\"MCP Agent\",\n    model=\"{{OPUS_ID}}\",\n    mcp_servers=[\n        {\"type\": \"url\", \"name\": \"my-tools\", \"url\": \"https://my-mcp-server.example.com/sse\"},\n    ],\n    tools=[\n        {\"type\": \"agent_toolset_20260401\", \"default_config\": {\"enabled\": True}},\n        {\"type\": \"mcp_toolset\", \"mcp_server_name\": \"my-tools\"},\n    ],\n)\n\n# Session attaches vault(s) containing credentials for those MCP server URLs\nsession = client.beta.sessions.create(\n    agent=agent.id,\n    environment_id=environment.id,\n    vault_ids=[vault.id],\n)\n```\n\nSee `shared/managed-agents-tools.md` §Vaults for creating vaults and adding credentials.\n"
// @from(Ln 560244, Col 4)
Oj5 = () => {}
// @from(Ln 560245, Col 4)
jj5 = `# Claude API — Ruby

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
  max_tokens: 16000,
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
  max_tokens: 64000,
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
  max_tokens: 16000,
  tools: [GetWeather.new],
  messages: [{ role: "user", content: "What's the weather in San Francisco?" }]
).each_message do |message|
  puts message.content
end
\`\`\`

### Manual Loop

See the [shared tool use concepts](../shared/tool-use-concepts.md) for the tool definition format and agentic loop pattern.

---

## Prompt Caching

\`system_:\` (trailing underscore — avoids shadowing \`Kernel#system\`) takes an array of text blocks; set \`cache_control\` on the last block. Plain hashes work via the \`OrHash\` type alias. For placement patterns and the silent-invalidator audit checklist, see \`shared/prompt-caching.md\`.

\`\`\`ruby
message = client.messages.create(
  model: :"{{OPUS_ID}}",
  max_tokens: 16000,
  system_: [
    { type: "text", text: long_system_prompt, cache_control: { type: "ephemeral" } }
  ],
  messages: [{ role: "user", content: "Summarize the key points" }]
)
\`\`\`

For 1-hour TTL: \`cache_control: { type: "ephemeral", ttl: "1h" }\`. There's also a top-level \`cache_control:\` on \`messages.create\` that auto-places on the last cacheable block.

Verify hits via \`message.usage.cache_creation_input_tokens\` / \`message.usage.cache_read_input_tokens\`.
`
// @from(Ln 560359, Col 4)
$j5 = () => {}