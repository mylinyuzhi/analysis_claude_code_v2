
// @from(Ln 475342, Col 4)
zRq = `# Tool Use — TypeScript

For conceptual overview (tool definitions, tool choice, tips), see [shared/tool-use-concepts.md](../../shared/tool-use-concepts.md).

## Tool Runner (Recommended)

**Beta:** The tool runner is in beta in the TypeScript SDK.

Use \`betaZodTool\` with Zod schemas to define tools with a \`run\` function, then pass them to \`client.beta.messages.toolRunner()\`:

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
    unit: z.enum(["celsius", "fahrenheit"]).optional(),
  }),
  run: async (input) => {
    // Your implementation here
    return \`72°F and sunny in \${input.location}\`;
  },
});

// The tool runner handles the agentic loop and returns the final message
const finalMessage = await client.beta.messages.toolRunner({
  model: "{{OPUS_ID}}",
  max_tokens: 4096,
  tools: [getWeather],
  messages: [{ role: "user", content: "What's the weather in Paris?" }],
});

console.log(finalMessage.content);
\`\`\`

**Key benefits of the tool runner:**

- No manual loop — the SDK handles calling tools and feeding results back
- Type-safe tool inputs via Zod schemas
- Tool schemas are generated automatically from Zod definitions
- Iteration stops automatically when Claude has no more tool calls

---

## Manual Agentic Loop

Use this when you need fine-grained control (custom logging, conditional tool execution, streaming individual iterations, human-in-the-loop approval):

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const tools: Anthropic.Tool[] = [...]; // Your tool definitions
let messages: Anthropic.MessageParam[] = [{ role: "user", content: userInput }];

while (true) {
  const response = await client.messages.create({
    model: "{{OPUS_ID}}",
    max_tokens: 4096,
    tools: tools,
    messages: messages,
  });

  if (response.stop_reason === "end_turn") break;

  // Server-side tool hit iteration limit; append assistant turn and re-send to continue
  if (response.stop_reason === "pause_turn") {
    messages.push({ role: "assistant", content: response.content });
    continue;
  }

  const toolUseBlocks = response.content.filter(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
  );

  messages.push({ role: "assistant", content: response.content });

  const toolResults: Anthropic.ToolResultBlockParam[] = [];
  for (const tool of toolUseBlocks) {
    const result = await executeTool(tool.name, tool.input);
    toolResults.push({
      type: "tool_result",
      tool_use_id: tool.id,
      content: result,
    });
  }

  messages.push({ role: "user", content: toolResults });
}
\`\`\`

### Streaming Manual Loop

Use \`client.messages.stream()\` + \`finalMessage()\` instead of \`.create()\` when you need streaming within a manual loop. Text deltas are streamed on each iteration; \`finalMessage()\` collects the complete \`Message\` so you can inspect \`stop_reason\` and extract tool-use blocks:

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const tools: Anthropic.Tool[] = [...];
let messages: Anthropic.MessageParam[] = [{ role: "user", content: userInput }];

while (true) {
  const stream = client.messages.stream({
    model: "{{OPUS_ID}}",
    max_tokens: 4096,
    tools,
    messages,
  });

  // Stream text deltas on each iteration
  stream.on("text", (delta) => {
    process.stdout.write(delta);
  });

  // finalMessage() resolves with the complete Message — no need to
  // manually wire up .on("message") / .on("error") / .on("abort")
  const message = await stream.finalMessage();

  if (message.stop_reason === "end_turn") break;

  // Server-side tool hit iteration limit; append assistant turn and re-send to continue
  if (message.stop_reason === "pause_turn") {
    messages.push({ role: "assistant", content: message.content });
    continue;
  }

  const toolUseBlocks = message.content.filter(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
  );

  messages.push({ role: "assistant", content: message.content });

  const toolResults: Anthropic.ToolResultBlockParam[] = [];
  for (const tool of toolUseBlocks) {
    const result = await executeTool(tool.name, tool.input);
    toolResults.push({
      type: "tool_result",
      tool_use_id: tool.id,
      content: result,
    });
  }

  messages.push({ role: "user", content: toolResults });
}
\`\`\`

> **Important:** Don't wrap \`.on()\` events in \`new Promise()\` to collect the final message — use \`stream.finalMessage()\` instead. The SDK handles all error/abort/completion states internally.

> **Error handling in the loop:** Use the SDK's typed exceptions (e.g., \`Anthropic.RateLimitError\`, \`Anthropic.APIError\`) — see [Error Handling](./README.md#error-handling) for examples. Don't check error messages with string matching.

> **SDK types:** Use \`Anthropic.MessageParam\`, \`Anthropic.Tool\`, \`Anthropic.ToolUseBlock\`, \`Anthropic.ToolResultBlockParam\`, \`Anthropic.Message\`, etc. for all API-related data structures. Don't redefine equivalent interfaces.

---

## Handling Tool Results

\`\`\`typescript
const response = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  tools: tools,
  messages: [{ role: "user", content: "What's the weather in Paris?" }],
});

for (const block of response.content) {
  if (block.type === "tool_use") {
    const result = await executeTool(block.name, block.input);

    const followup = await client.messages.create({
      model: "{{OPUS_ID}}",
      max_tokens: 1024,
      tools: tools,
      messages: [
        { role: "user", content: "What's the weather in Paris?" },
        { role: "assistant", content: response.content },
        {
          role: "user",
          content: [
            { type: "tool_result", tool_use_id: block.id, content: result },
          ],
        },
      ],
    });
  }
}
\`\`\`

---

## Tool Choice

\`\`\`typescript
const response = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  tools: tools,
  tool_choice: { type: "tool", name: "get_weather" },
  messages: [{ role: "user", content: "What's the weather in Paris?" }],
});
\`\`\`

---

## Server-Side Tools

Version-suffixed \`type\` literals; \`name\` is fixed per interface. Pass plain object literals — the \`ToolUnion\` type is satisfied structurally. **The \`name\`/\`type\` pair must match the interface**: mixing \`str_replace_based_edit_tool\` (20250728 name) with \`text_editor_20250124\` (which expects \`str_replace_editor\`) is a TS2322.

**Don't type-annotate as \`Tool[]\`** — \`Tool\` is just the custom-tool variant. Let structural typing infer from the \`tools\` param, or annotate as \`Anthropic.Messages.ToolUnion[]\` if you must:

\`\`\`typescript
// ✓ let inference work — no annotation
const response = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  tools: [
    { type: "text_editor_20250728", name: "str_replace_based_edit_tool" },
    { type: "bash_20250124", name: "bash" },
    { type: "web_search_20260209", name: "web_search" },
    { type: "code_execution_20260120", name: "code_execution" },
  ],
  messages: [{ role: "user", content: "..." }],
});

// ✗ this is a TS2352 — Tool is the CUSTOM tool variant only
// const tools: Anthropic.Tool[] = [{ type: "text_editor_20250728", ... }]
\`\`\`

| Interface | \`name\` | \`type\` |
|---|---|---|
| \`ToolTextEditor20250124\` | \`str_replace_editor\` | \`text_editor_20250124\` |
| \`ToolTextEditor20250429\` | \`str_replace_based_edit_tool\` | \`text_editor_20250429\` |
| \`ToolTextEditor20250728\` | \`str_replace_based_edit_tool\` | \`text_editor_20250728\` |
| \`ToolBash20250124\` | \`bash\` | \`bash_20250124\` |
| \`WebSearchTool20260209\` | \`web_search\` | \`web_search_20260209\` |
| \`WebFetchTool20260209\` | \`web_fetch\` | \`web_fetch_20260209\` |
| \`CodeExecutionTool20260120\` | \`code_execution\` | \`code_execution_20260120\` |

**Don't mix beta and non-beta types**: if you call \`client.beta.messages.create()\`, the response \`content\` is \`BetaContentBlock[]\` — you cannot pass that to a non-beta \`ContentBlockParam[]\` without narrowing each element.

---


## Code Execution

### Basic Usage

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content:
        "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
    },
  ],
  tools: [{ type: "code_execution_20260120", name: "code_execution" }],
});
\`\`\`

### Reading Local Files (ESM note)

\`__dirname\` doesn't exist in ES modules. For script-relative paths use \`import.meta.url\`:

\`\`\`typescript
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pdfBytes = readFileSync(join(__dirname, "sample.pdf"));
\`\`\`

Or use a CWD-relative path if the script runs from a known directory: \`readFileSync("./sample.pdf")\`.

### Upload Files for Analysis

\`\`\`typescript
import Anthropic, { toFile } from "@anthropic-ai/sdk";
import { createReadStream } from "fs";

const client = new Anthropic();

// 1. Upload a file
const uploaded = await client.beta.files.upload({
  file: await toFile(createReadStream("sales_data.csv"), undefined, {
    type: "text/csv",
  }),
  betas: ["files-api-2025-04-14"],
});

// 2. Pass to code execution
// Code execution is GA; Files API is still beta (pass via RequestOptions)
const response = await client.messages.create(
  {
    model: "{{OPUS_ID}}",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this sales data. Show trends and create a visualization.",
          },
          { type: "container_upload", file_id: uploaded.id },
        ],
      },
    ],
    tools: [{ type: "code_execution_20260120", name: "code_execution" }],
  },
  { headers: { "anthropic-beta": "files-api-2025-04-14" } },
);
\`\`\`

### Retrieve Generated Files

\`\`\`typescript
import path from "path";
import fs from "fs";

const OUTPUT_DIR = "./claude_outputs";
await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });

for (const block of response.content) {
  if (block.type === "bash_code_execution_tool_result") {
    const result = block.content;
    if (result.type === "bash_code_execution_result" && result.content) {
      for (const fileRef of result.content) {
        if (fileRef.type === "bash_code_execution_output") {
          const metadata = await client.beta.files.retrieveMetadata(
            fileRef.file_id,
          );
          const downloadResponse = await client.beta.files.download(fileRef.file_id);
          const fileBytes = Buffer.from(await downloadResponse.arrayBuffer());
          const safeName = path.basename(metadata.filename);
          if (!safeName || safeName === "." || safeName === "..") {
            console.warn(\`Skipping invalid filename: \${metadata.filename}\`);
            continue;
          }
          const outputPath = path.join(OUTPUT_DIR, safeName);
          await fs.promises.writeFile(outputPath, fileBytes);
          console.log(\`Saved: \${outputPath}\`);
        }
      }
    }
  }
}
\`\`\`

### Container Reuse

\`\`\`typescript
// First request: set up environment
const response1 = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Install tabulate and create data.json with sample user data",
    },
  ],
  tools: [{ type: "code_execution_20260120", name: "code_execution" }],
});

// Reuse container
// container is nullable — set only when using server-side code execution
const containerId = response1.container!.id;

const response2 = await client.messages.create({
  container: containerId,
  model: "{{OPUS_ID}}",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Read data.json and display as a formatted table",
    },
  ],
  tools: [{ type: "code_execution_20260120", name: "code_execution" }],
});
\`\`\`

---

## Memory Tool

### Basic Usage

\`\`\`typescript
const response = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 2048,
  messages: [
    {
      role: "user",
      content: "Remember that my preferred language is TypeScript.",
    },
  ],
  tools: [{ type: "memory_20250818", name: "memory" }],
});
\`\`\`

### SDK Memory Helper

Use \`betaMemoryTool\` with a \`MemoryToolHandlers\` implementation:

\`\`\`typescript
import {
  betaMemoryTool,
  type MemoryToolHandlers,
} from "@anthropic-ai/sdk/helpers/beta/memory";

const handlers: MemoryToolHandlers = {
  async view(command) { ... },
  async create(command) { ... },
  async str_replace(command) { ... },
  async insert(command) { ... },
  async delete(command) { ... },
  async rename(command) { ... },
};

const memory = betaMemoryTool(handlers);

const runner = client.beta.messages.toolRunner({
  model: "{{OPUS_ID}}",
  max_tokens: 2048,
  tools: [memory],
  messages: [{ role: "user", content: "Remember my preferences" }],
});

for await (const message of runner) {
  console.log(message);
}
\`\`\`

For full implementation examples, use WebFetch:

- \`https://github.com/anthropics/anthropic-sdk-typescript/blob/main/examples/tools-helpers-memory.ts\`

---

## Structured Outputs

### JSON Outputs (Zod — Recommended)

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const ContactInfoSchema = z.object({
  name: z.string(),
  email: z.string(),
  plan: z.string(),
  interests: z.array(z.string()),
  demo_requested: z.boolean(),
});

const client = new Anthropic();

const response = await client.messages.parse({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content:
        "Extract: Jane Doe (jane@co.com) wants Enterprise, interested in API and SDKs, wants a demo.",
    },
  ],
  output_config: {
    format: zodOutputFormat(ContactInfoSchema),
  },
});

// parsed_output is null if parsing failed — assert or guard
console.log(response.parsed_output!.name); // "Jane Doe"
\`\`\`

### Strict Tool Use

\`\`\`typescript
const response = await client.messages.create({
  model: "{{OPUS_ID}}",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "Book a flight to Tokyo for 2 passengers on March 15",
    },
  ],
  tools: [
    {
      name: "book_flight",
      description: "Book a flight to a destination",
      strict: true,
      input_schema: {
        type: "object",
        properties: {
          destination: { type: "string" },
          date: { type: "string", format: "date" },
          passengers: {
            type: "integer",
            enum: [1, 2, 3, 4, 5, 6, 7, 8],
          },
        },
        required: ["destination", "date", "passengers"],
        additionalProperties: false,
      },
    },
  ],
});
\`\`\`
`
// @from(Ln 475870, Col 4)
YRq = () => {}
// @from(Ln 475871, Col 4)
_Rq
// @from(Ln 475871, Col 9)
wRq
// @from(Ln 475871, Col 14)
cC1
// @from(Ln 475872, Col 4)
ORq = E(() => {
    HLq();
    JLq();
    DLq();
    PLq();
    ZLq();
    fLq();
    vLq();
    VLq();
    ELq();
    LLq();
    hLq();
    CLq();
    bLq();
    uLq();
    BLq();
    FLq();
    QLq();
    dLq();
    lLq();
    nLq();
    oLq();
    sLq();
    eLq();
    qRq();
    YRq();
    _Rq = {
        OPUS_ID: "claude-opus-4-6",
        OPUS_NAME: "Claude Opus 4.6",
        SONNET_ID: "claude-sonnet-4-6",
        SONNET_NAME: "Claude Sonnet 4.6",
        HAIKU_ID: "claude-haiku-4-5",
        HAIKU_NAME: "Claude Haiku 4.5",
        PREV_SONNET_ID: "claude-sonnet-4-5"
    }, wRq = jLq, cC1 = {
        "csharp/claude-api.md": MLq,
        "curl/examples.md": XLq,
        "go/claude-api.md": WLq,
        "java/claude-api.md": GLq,
        "php/claude-api.md": TLq,
        "python/agent-sdk/README.md": NLq,
        "python/agent-sdk/patterns.md": kLq,
        "python/claude-api/README.md": yLq,
        "python/claude-api/batches.md": RLq,
        "python/claude-api/files-api.md": SLq,
        "python/claude-api/streaming.md": ILq,
        "python/claude-api/tool-use.md": xLq,
        "ruby/claude-api.md": mLq,
        "shared/error-codes.md": gLq,
        "shared/live-sources.md": pLq,
        "shared/models.md": ULq,
        "shared/tool-use-concepts.md": cLq,
        "typescript/agent-sdk/README.md": iLq,
        "typescript/agent-sdk/patterns.md": rLq,
        "typescript/claude-api/README.md": aLq,
        "typescript/claude-api/batches.md": tLq,
        "typescript/claude-api/files-api.md": ARq,
        "typescript/claude-api/streaming.md": KRq,
        "typescript/claude-api/tool-use.md": zRq
    }
})
// @from(Ln 475933, Col 4)
JRq = {}
// @from(Ln 475940, Col 0)
async function MMz() {
    let A = G1(),
        q;
    try {
        q = await jMz(A)
    } catch {
        return null
    }
    for (let [K, Y] of Object.entries(JMz)) {
        if (Y.length === 0) continue;
        for (let z of Y)
            if (z.startsWith(".")) {
                if (q.some((_) => _.endsWith(z))) return K
            } else if (q.includes(z)) return K
    }
    return null
}
// @from(Ln 475958, Col 0)
function DMz(A) {
    return Object.keys(cC1).filter((q) => q.startsWith(`${A}/`) || q.startsWith("shared/"))
}
// @from(Ln 475962, Col 0)
function jRq(A) {
    let q = A,
        K;
    do K = q, q = q.replace(/<!--[\s\S]*?-->\n?/g, ""); while (q !== K);
    return q = q.replace(/\{\{(\w+)\}\}/g, (Y, z) => _Rq[z] ?? Y), q
}
// @from(Ln 475969, Col 0)
function $Rq(A) {
    let q = [];
    for (let K of A.sort()) {
        let Y = cC1[K];
        if (!Y) continue;
        q.push(`<doc path="${K}">
${jRq(Y).trim()}
</doc>`)
    }
    return q.join(`

`)
}
// @from(Ln 475983, Col 0)
function XMz(A, q) {
    let K = jRq(wRq),
        Y = K.indexOf("## Reading Guide"),
        _ = [Y !== -1 ? K.slice(0, Y).trimEnd() : K];
    if (A) {
        let O = DMz(A),
            $ = HRq.replace(/\{lang\}/g, A);
        _.push($), _.push(`---

## Included Documentation

` + $Rq(O))
    } else _.push(HRq.replace(/\{lang\}/g, "unknown")), _.push("No project language was auto-detected. Ask the user which language they are using, then refer to the matching docs below."), _.push(`---

## Included Documentation

` + $Rq(Object.keys(cC1)));
    let w = K.indexOf("## When to Use WebFetch");
    if (w !== -1) _.push(K.slice(w).trimEnd());
    if (q) _.push(`## User Request

${q}`);
    return _.join(`

`)
}
// @from(Ln 476010, Col 0)
function PMz() {
    rw({
        name: "claude-api",
        description: "Build apps with the Claude API or Anthropic SDK.\nTRIGGER when: code imports `anthropic`/`@anthropic-ai/sdk`/`claude_agent_sdk`, or user asks to use Claude API, Anthropic SDKs, or Agent SDK.\nDO NOT TRIGGER when: code imports `openai`/other AI SDK, general programming, or ML/data-science tasks.",
        allowedTools: ["Read", "Grep", "Glob", "WebFetch"],
        userInvocable: !0,
        async getPromptForCommand(A) {
            let q = await MMz();
            return [{
                type: "text",
                text: XMz(q, A)
            }]
        }
    })
}
// @from(Ln 476025, Col 4)
JMz
// @from(Ln 476025, Col 9)
HRq = "## Reference Documentation\n\nThe relevant documentation for your detected language is included below in `<doc>` tags. Each tag has a `path` attribute showing its original file path. Use this to find the right section:\n\n### Quick Task Reference\n\n**Single text classification/summarization/extraction/Q&A:**\n→ Refer to `{lang}/claude-api/README.md`\n\n**Chat UI or real-time response display:**\n→ Refer to `{lang}/claude-api/README.md` + `{lang}/claude-api/streaming.md`\n\n**Long-running conversations (may exceed context window):**\n→ Refer to `{lang}/claude-api/README.md` — see Compaction section\n\n**Function calling / tool use / agents:**\n→ Refer to `{lang}/claude-api/README.md` + `shared/tool-use-concepts.md` + `{lang}/claude-api/tool-use.md`\n\n**Batch processing (non-latency-sensitive):**\n→ Refer to `{lang}/claude-api/README.md` + `{lang}/claude-api/batches.md`\n\n**File uploads across multiple requests:**\n→ Refer to `{lang}/claude-api/README.md` + `{lang}/claude-api/files-api.md`\n\n**Agent with built-in tools (file/web/terminal) (Python & TypeScript only):**\n→ Refer to `{lang}/agent-sdk/README.md` + `{lang}/agent-sdk/patterns.md`\n\n**Error handling:**\n→ Refer to `shared/error-codes.md`\n\n**Latest docs via WebFetch:**\n→ Refer to `shared/live-sources.md` for URLs"
// @from(Ln 476026, Col 4)
MRq = E(() => {
    nf();
    lA();
    ORq();
    JMz = {
        python: [".py", "requirements.txt", "pyproject.toml", "setup.py", "Pipfile"],
        typescript: [".ts", ".tsx", "tsconfig.json", "package.json"],
        java: [".java", "pom.xml", "build.gradle"],
        go: [".go", "go.mod"],
        ruby: [".rb", "Gemfile"],
        csharp: [".cs", ".csproj"],
        php: [".php", "composer.json"],
        curl: []
    }
})
// @from(Ln 476042, Col 0)
function DRq() {
    uyq(), Fyq(), Qyq(), dyq(), nyq(), oyq(), syq(), eyq(), YLq(), _Lq();
    {
        let {
            registerLoopSkill: A
        } = ($Lq(), k4(OLq));
        A()
    } {
        let {
            registerClaudeApiSkill: A
        } = (MRq(), k4(JRq));
        A()
    }
    if (kN6()) byq()
}
// @from(Ln 476057, Col 4)
XRq = E(() => {
    xyq();
    myq();
    pyq();
    Uyq();
    cyq();
    ryq();
    ayq();
    tyq();
    ALq();
    zLq();
    wLq();
    R_6()
})
// @from(Ln 476072, Col 0)
function PRq() {}
// @from(Ln 476084, Col 0)
function lC1() {
    d1((A) => ({
        ...A,
        iterm2SetupInProgress: !1
    }))
}
// @from(Ln 476091, Col 0)
function TMz() {
    let A = X1();
    return {
        inProgress: A.iterm2SetupInProgress ?? !1,
        backupPath: A.iterm2BackupPath || null
    }
}
// @from(Ln 476099, Col 0)
function vMz() {
    return ZMz(WMz(), "Library", "Preferences", "com.googlecode.iterm2.plist")
}
// @from(Ln 476102, Col 0)
async function WRq() {
    let {
        inProgress: A,
        backupPath: q
    } = TMz();
    if (!A) return {
        status: "no_backup"
    };
    if (!q) return lC1(), {
        status: "no_backup"
    };
    try {
        await GMz(q)
    } catch {
        return lC1(), {
            status: "no_backup"
        }
    }
    try {
        return await fMz(q, vMz()), lC1(), {
            status: "restored"
        }
    } catch (K) {
        return _6(Error(`Failed to restore iTerm2 settings with: ${K}`)), lC1(), {
            status: "failed",
            backupPath: q
        }
    }
}
// @from(Ln 476131, Col 4)
ZRq = E(() => {
    k1();
    k8()
})
// @from(Ln 476135, Col 4)
iC1 = {}
// @from(Ln 476139, Col 0)
async function NMz(A, q, K, Y, z, _, w, O, $) {
    U1("info", "setup_started");
    let H = process.version.match(/^v(\d+)\./)?.[1];
    if (!H || parseInt(H) < 18) console.error(O1.bold.red("Error: Claude Code requires Node.js version 18 or higher.")), process.exit(1);
    if (w) _P(eJ(w));
    if (E7()) {
        let {
            captureTeammateModeSnapshot: X
        } = await Promise.resolve().then(() => (Bf6(), wu8));
        X()
    }
    if (E7()) {
        let X = await WRq();
        if (X.status === "restored") console.log(O1.yellow("Detected an interrupted iTerm2 setup. Your original settings have been restored. You may need to restart iTerm2 for the changes to take effect."));
        else if (X.status === "failed") console.error(O1.red(`Failed to restore iTerm2 settings. Please manually restore your original settings with: defaults import com.googlecode.iterm2 ${X.backupPath}.`))
    }
    try {
        let X = await wX1();
        if (X.status === "restored") console.log(O1.yellow("Detected an interrupted Terminal.app setup. Your original settings have been restored. You may need to restart Terminal.app for the changes to take effect."));
        else if (X.status === "failed") console.error(O1.red(`Failed to restore Terminal.app settings. Please manually restore your original settings with: defaults import com.apple.Terminal ${X.backupPath}.`))
    } catch (X) {
        _6(X)
    }
    VO(A);
    let j = Date.now();
    if (hz8(), U1("info", "setup_hooks_captured", {
            duration_ms: Date.now() - j
        }), Y) {
        if (!await IH()) process.stderr.write(O1.red(`Error: Can only use --worktree in a git repository, but ${O1.bold(A)} is not a git repository
`)), process.exit(1);
        let X = LJ(G1());
        if (!X) process.stderr.write(O1.red(`Error: Could not determine the main git repository root.
`)), process.exit(1);
        if (X !== (H_(G1()) ?? G1())) U1("info", "worktree_resolved_to_main_repo"), process.chdir(X), VO(X);
        d("tengu_worktree_created", {
            tmux_enabled: _
        });
        let P = X,
            W = O ? `pr-${O}` : z ?? bB(),
            Z = `worktree-${W}`,
            G = _ ? Iu8(P, Z) : void 0,
            f = await Yl6(R1(), W, G, O ? {
                prNumber: O
            } : void 0);
        if (_ && G) {
            let v = await gu8(G, f.worktreePath);
            if (v.created) console.log(O1.green(`Created tmux session: ${O1.bold(G)}
To attach: ${O1.bold(`tmux attach -t ${G}`)}`));
            else console.error(O1.yellow(`Warning: Failed to create tmux session: ${v.error}`))
        }
        process.chdir(f.worktreePath), VO(f.worktreePath), Jp(G1()), _A6(!0), vO.cache.clear?.()
    }
    if (U1("info", "setup_background_jobs_starting"), !t6(process.env.CLAUDE_CODE_SIMPLE)) {
        if (process.env.CLAUDE_CODE_ENTRYPOINT !== "local-agent") PRq(), DRq();
        Cyq()
    }
    lb8(), U1("info", "setup_background_jobs_launched"), Zq("setup_before_prefetch"), U1("info", "setup_prefetch_starting");
    let J = q7() && t6(process.env.CLAUDE_CODE_SYNC_PLUGIN_INSTALL);
    if (!J) I0(qY());
    Promise.resolve().then(() => (O96(), Ck8)).then((X) => {
        if (!J) X.loadPluginHooks(), X.setupPluginHookHotReload()
    }), Promise.resolve().then(() => (dQ8(), Q3q)).then((X) => X.registerSessionFileAccessHooks()), Promise.resolve().then(() => (pQ8(), FQ8)).then((X) => X.startTeamMemoryWatcher()), Uo8(), o_6(), d("tengu_started", {}), yo8(q7()), Zq("setup_after_prefetch");
    let {
        hasReleaseNotes: M
    } = await NHq(X1().lastReleaseNotesSeen);
    if (M) await eHq();
    if (q === "bypassPermissions" || K) {
        if (process.platform !== "win32" && typeof process.getuid === "function" && process.getuid() === 0 && process.env.IS_SANDBOX !== "1" && process.env.CLAUDE_CODE_BUBBLEWRAP !== "1") console.error("--dangerously-skip-permissions cannot be used with root/sudo privileges for security reasons"), process.exit(1)
    }
    let D = d2();
    if (D.lastCost !== void 0 && D.lastDuration !== void 0) d("tengu_exit", {
        last_session_cost: D.lastCost,
        last_session_api_duration: D.lastAPIDuration,
        last_session_tool_duration: D.lastToolDuration,
        last_session_duration: D.lastDuration,
        last_session_lines_added: D.lastLinesAdded,
        last_session_lines_removed: D.lastLinesRemoved,
        last_session_total_input_tokens: D.lastTotalInputTokens,
        last_session_total_output_tokens: D.lastTotalOutputTokens,
        last_session_total_cache_creation_input_tokens: D.lastTotalCacheCreationInputTokens,
        last_session_total_cache_read_input_tokens: D.lastTotalCacheReadInputTokens,
        last_session_fps_average: D.lastFpsAverage,
        last_session_fps_low_1_pct: D.lastFpsLow1Pct,
        last_session_id: D.lastSessionId,
        ...D.lastSessionMetrics
    })
}
// @from(Ln 476226, Col 4)
nC1 = E(() => {
    Iyq();
    d3();
    A8();
    Zr();
    XS();
    aK();
    V1();
    Lo6();
    WR();
    lA();
    WC1();
    _N6();
    T1();
    D$();
    XRq();
    Qz();
    MT8();
    fA();
    lM();
    k8();
    u_();
    $5();
    tI6();
    ZRq();
    k1();
    wR1();
    Pb();
    rH();
    jN()
})
// @from(Ln 476257, Col 4)
GRq = {}
// @from(Ln 476262, Col 0)
function VMz(A) {
    let q = A6(13),
        {
            settingsErrors: K,
            onContinue: Y,
            onExit: z
        } = A,
        _;
    if (q[0] !== Y || q[1] !== z) _ = function(D) {
        if (D === "exit") z();
        else Y()
    }, q[0] = Y, q[1] = z, q[2] = _;
    else _ = q[2];
    let w = _,
        O;
    if (q[3] !== K) O = ro6.default.createElement(iy1, {
        errors: K
    }), q[3] = K, q[4] = O;
    else O = q[4];
    let $;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) $ = ro6.default.createElement(T, {
        dimColor: !0
    }, "Files with errors are skipped entirely, not just the invalid settings."), q[5] = $;
    else $ = q[5];
    let H;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) H = [{
        label: "Exit and fix manually",
        value: "exit"
    }, {
        label: "Continue without these settings",
        value: "continue"
    }], q[6] = H;
    else H = q[6];
    let j;
    if (q[7] !== w) j = ro6.default.createElement(T8, {
        options: H,
        onChange: w
    }), q[7] = w, q[8] = j;
    else j = q[8];
    let J;
    if (q[9] !== z || q[10] !== O || q[11] !== j) J = ro6.default.createElement(m8, {
        title: "Settings Error",
        onCancel: z,
        color: "warning"
    }, O, $, j), q[9] = z, q[10] = O, q[11] = j, q[12] = J;
    else J = q[12];
    return J
}
// @from(Ln 476310, Col 4)
ro6
// @from(Ln 476311, Col 4)
fRq = E(() => {
    e6();
    i6();
    o9();
    DU8();
    wq();
    ro6 = t(P6(), 1)
})
// @from(Ln 476319, Col 4)
TRq = E(() => {
    gw();
    U$();
    k1()
})
// @from(Ln 476325, Col 0)
function vRq() {}
// @from(Ln 476326, Col 0)
async function NRq(A, q) {
    if (!A) return;
    let {
        join: K
    } = await import("path"), Y = await import("fs/promises"), z = K(G1(), ".claude", "skills", A, "SKILL.md"), _;
    try {
        _ = await Y.readFile(z, "utf-8")
    } catch {
        _6(Error(`Failed to read skill file for improvement: ${z}`));
        return
    }
    let w = q.map((j) => `- ${j.section}: ${j.change}`).join(`
`),
        $ = (await _i({
            messages: [p1({
                content: `You are editing a skill definition file. Apply the following improvements to the skill.

<current_skill_file>
${_}
</current_skill_file>

<improvements>
${w}
</improvements>

Rules:
- Integrate the improvements naturally into the existing structure
- Preserve frontmatter (--- block) exactly as-is
- Preserve the overall format and style
- Do not remove existing content unless an improvement explicitly replaces it
- Output the complete updated file inside <updated_file> tags`
            })],
            systemPrompt: uq(["You edit skill definition files to incorporate user preferences. Output only the updated file content."]),
            thinkingConfig: {
                type: "disabled"
            },
            tools: [],
            signal: sK().signal,
            options: {
                getToolPermissionContext: async () => xM(),
                model: lH(),
                toolChoice: void 0,
                isNonInteractiveSession: !1,
                hasAppendSystemPrompt: !1,
                temperatureOverride: 0,
                agents: [],
                querySource: "skill_improvement_apply",
                mcpTools: []
            }
        })).message.content.filter((j) => j.type === "text").map((j) => j.text).join("").trim(),
        H = d4($, "updated_file");
    if (!H) {
        _6(Error("Skill improvement apply: no updated_file tag in response"));
        return
    }
    try {
        await Y.writeFile(z, H, "utf-8")
    } catch (j) {
        _6(j instanceof Error ? j : Error(`Failed to write skill file: ${z}`))
    }
}
// @from(Ln 476387, Col 4)
Fa8 = E(() => {
    TRq();
    xi6();
    T1();
    JA();
    z4();
    V1();
    g1();
    gw();
    U$();
    k1();
    lA();
    HA()
})
// @from(Ln 476405, Col 0)
function O86() {
    let K = ((PA() || {}).cleanupPeriodDays ?? kMz) * 24 * 60 * 60 * 1000;
    return new Date(Date.now() - K)
}
// @from(Ln 476410, Col 0)
function EMz(A, q) {
    return {
        messages: A.messages + q.messages,
        errors: A.errors + q.errors
    }
}
// @from(Ln 476417, Col 0)
function yMz(A) {
    let q = A.split(".")[0].replace(/T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/, "T$1:$2:$3.$4Z");
    return new Date(q)
}
// @from(Ln 476421, Col 0)
async function VRq(A, q, K) {
    let Y = {
        messages: 0,
        errors: 0
    };
    try {
        let z = await $1().readdir(A);
        for (let _ of z) try {
            if (yMz(_.name) < q)
                if (await $1().unlink(nZ(A, _.name)), K) Y.messages++;
                else Y.errors++
        } catch (w) {
            _6(w)
        }
    } catch (z) {
        if (z instanceof Error && "code" in z && z.code !== "ENOENT") _6(z)
    }
    return Y
}
// @from(Ln 476440, Col 0)
async function LMz() {
    let A = $1(),
        q = O86(),
        K = rA6.errors(),
        Y = rA6.baseLogs(),
        z = await VRq(K, q, !1);
    try {
        let _;
        try {
            _ = await A.readdir(Y)
        } catch {
            return z
        }
        let w = _.filter((O) => O.isDirectory() && O.name.startsWith("mcp-logs-")).map((O) => nZ(Y, O.name));
        for (let O of w) z = EMz(z, await VRq(O, q, !0)), await mi(O, A)
    } catch (_) {
        if (_ instanceof Error && "code" in _ && _.code !== "ENOENT") _6(_)
    }
    return z
}
// @from(Ln 476460, Col 0)
async function rC1(A, q, K) {
    if ((await K.stat(A)).mtime < q) return await K.unlink(A), !0;
    return !1
}
// @from(Ln 476464, Col 0)
async function mi(A, q) {
    try {
        await q.rmdir(A)
    } catch {}
}
// @from(Ln 476469, Col 0)
async function RMz() {
    let A = O86(),
        q = {
            messages: 0,
            errors: 0
        },
        K = sb(),
        Y = $1(),
        z;
    try {
        z = await Y.readdir(K)
    } catch {
        return q
    }
    for (let _ of z) {
        if (!_.isDirectory()) continue;
        let w = nZ(K, _.name),
            O;
        try {
            O = await Y.readdir(w)
        } catch {
            q.errors++;
            continue
        }
        for (let $ of O)
            if ($.isFile()) {
                if (!$.name.endsWith(".jsonl") && !$.name.endsWith(".cast")) continue;
                try {
                    if (await rC1(nZ(w, $.name), A, Y)) q.messages++
                } catch {
                    q.errors++
                }
            } else if ($.isDirectory()) {
            let H = nZ(w, $.name),
                j = nZ(H, gN8),
                J;
            try {
                J = await Y.readdir(j)
            } catch {
                await mi(H, Y);
                continue
            }
            for (let M of J) {
                if (!M.isDirectory()) continue;
                let D = nZ(j, M.name),
                    X;
                try {
                    X = await Y.readdir(D)
                } catch {
                    continue
                }
                for (let P of X) {
                    if (!P.isFile()) continue;
                    try {
                        if (await rC1(nZ(D, P.name), A, Y)) q.messages++
                    } catch {
                        q.errors++
                    }
                }
                await mi(D, Y)
            }
            await mi(j, Y), await mi(H, Y)
        }
        await mi(w, Y)
    }
    return q
}
// @from(Ln 476536, Col 0)
async function hMz(A, q, K = !0) {
    let Y = O86(),
        z = {
            messages: 0,
            errors: 0
        },
        _ = $1(),
        w;
    try {
        w = await _.readdir(A)
    } catch {
        return z
    }
    for (let O of w) {
        if (!O.isFile() || !O.name.endsWith(q)) continue;
        try {
            if (await rC1(nZ(A, O.name), Y, _)) z.messages++
        } catch {
            z.errors++
        }
    }
    if (K) await mi(A, _);
    return z
}
// @from(Ln 476561, Col 0)
function SMz() {
    let A = nZ(c8(), "plans");
    return hMz(A, ".md")
}
// @from(Ln 476565, Col 0)
async function CMz() {
    let A = O86(),
        q = {
            messages: 0,
            errors: 0
        },
        K = $1();
    try {
        let Y = c8(),
            z = nZ(Y, "file-history"),
            _;
        try {
            _ = await K.readdir(z)
        } catch {
            return q
        }
        let w = _.filter((O) => O.isDirectory()).map((O) => nZ(z, O.name));
        for (let O of w) try {
            if ((await K.stat(O)).mtime < A) await K.rm(O, {
                recursive: !0,
                force: !0
            }), q.messages++
        } catch {
            q.errors++
        }
        await mi(z, K)
    } catch (Y) {
        _6(Y)
    }
    return q
}
// @from(Ln 476596, Col 0)
async function IMz() {
    let A = O86(),
        q = {
            messages: 0,
            errors: 0
        },
        K = $1();
    try {
        let Y = c8(),
            z = nZ(Y, "session-env"),
            _;
        try {
            _ = await K.readdir(z)
        } catch {
            return q
        }
        let w = _.filter((O) => O.isDirectory()).map((O) => nZ(z, O.name));
        for (let O of w) try {
            if ((await K.stat(O)).mtime < A) await K.rm(O, {
                recursive: !0,
                force: !0
            }), q.messages++
        } catch {
            q.errors++
        }
        await mi(z, K)
    } catch (Y) {
        _6(Y)
    }
    return q
}
// @from(Ln 476627, Col 0)
async function bMz() {
    let A = O86(),
        q = {
            messages: 0,
            errors: 0
        },
        K = $1(),
        Y = nZ(c8(), "debug"),
        z;
    try {
        z = await K.readdir(Y)
    } catch {
        return q
    }
    for (let _ of z) {
        if (!_.isFile() || !_.name.endsWith(".txt") || _.name === "latest") continue;
        try {
            if (await rC1(nZ(Y, _.name), A, K)) q.messages++
        } catch {
            q.errors++
        }
    }
    return q
}
// @from(Ln 476651, Col 0)
async function ERq() {
    let {
        errors: A
    } = Kl();
    if (A.length > 0 && Cvq("cleanupPeriodDays")) {
        k("Skipping cleanup: settings have validation errors but cleanupPeriodDays was explicitly set. Fix settings errors to enable cleanup.");
        return
    }
    await LMz(), await RMz(), await SMz(), await CMz(), await IMz(), await bMz(), await qT4(), await I84(O86());
    let q = await Fu8(O86());
    if (q > 0) d("tengu_worktree_cleanup", {
        removed: q
    })
}
// @from(Ln 476665, Col 4)
kRq
// @from(Ln 476665, Col 9)
kMz = 30
// @from(Ln 476666, Col 4)
yRq = E(() => {
    ZR();
    k1();
    R81();
    SA();
    i8();
    zc6();
    Oq();
    A8();
    H1();
    V1();
    Sc();
    RT8();
    Pb();
    jN();
    kRq = t(nx(), 1)
})
// @from(Ln 476683, Col 4)
RRq = {}
// @from(Ln 476688, Col 0)
function Qa8() {
    G3q(), vRq(), xMz.initExtractMemories(), Twq();
    let A = !0;
    async function q() {
        if (DW() && yx() > Date.now() - 60000) {
            setTimeout(q, pa8).unref();
            return
        }
        if (A) A = !1, await ERq();
        if (DW() && yx() > Date.now() - 60000) {
            setTimeout(q, pa8).unref();
            return
        }
        await Ac6()
    }
    setTimeout(q, pa8).unref()
}
// @from(Ln 476705, Col 4)
xMz
// @from(Ln 476705, Col 9)
pa8 = 600000
// @from(Ln 476706, Col 4)
Ua8 = E(() => {
    NQ8();
    Fa8();
    yRq();
    Pb();
    hL1();
    T1();
    xMz = (kp8(), k4(Vp8))
})
// @from(Ln 476715, Col 4)
uMz
// @from(Ln 476715, Col 9)
hRq
// @from(Ln 476715, Col 14)
oo6
// @from(Ln 476716, Col 4)
SRq = E(() => {
    t46();
    uMz = F6(() => K4.object({
        entries: K4.record(K4.string(), K4.string())
    })), hRq = F6(() => K4.object({
        userId: K4.string(),
        version: K4.number(),
        lastModified: K4.string(),
        checksum: K4.string(),
        content: uMz()
    })), oo6 = {
        USER_SETTINGS: "~/.claude/settings.json",
        USER_MEMORY: "~/.claude/CLAUDE.md",
        projectSettings: (A) => `projects/${A}/.claude/settings.local.json`,
        projectMemory: (A) => `projects/${A}/CLAUDE.local.md`
    }
})
// @from(Ln 476742, Col 0)
async function IRq() {
    try {
        if (!pMz()) return U1("info", "settings_sync_download_skipped"), d("tengu_settings_sync_download_skipped", {}), !1;
        U1("info", "settings_sync_download_starting");
        let A = await cMz();
        if (!A.success) return U1("warn", "settings_sync_download_fetch_failed"), d("tengu_settings_sync_download_fetch_failed", {}), !1;
        if (A.isEmpty) return U1("info", "settings_sync_download_empty"), d("tengu_settings_sync_download_empty", {}), !1;
        let q = A.data.content.entries,
            K = await FC6();
        return U1("info", "settings_sync_download_applying", {
            entryCount: Object.keys(q).length
        }), await lMz(q, K), d("tengu_settings_sync_download_success", {
            entryCount: Object.keys(q).length
        }), !0
    } catch {
        return U1("error", "settings_sync_download_error"), d("tengu_settings_sync_download_error", {}), !1
    }
}
// @from(Ln 476761, Col 0)
function pMz() {
    if (QA() !== "firstParty" || !ax()) return !1;
    let A = sA();
    return Boolean(A?.accessToken && A.scopes?.includes(ZV) && A.scopes.includes(pp))
}
// @from(Ln 476767, Col 0)
function QMz() {
    return `${P7().BASE_API_URL}/api/claude_code/user_settings`
}
// @from(Ln 476771, Col 0)
function UMz() {
    let A = sA();
    if (A?.accessToken) return {
        headers: {
            Authorization: `Bearer ${A.accessToken}`,
            "anthropic-beta": DP
        }
    };
    return {
        headers: {},
        error: "No OAuth token available"
    }
}
// @from(Ln 476784, Col 0)
async function dMz() {
    try {
        await dz();
        let A = UMz();
        if (A.error) return {
            success: !1,
            error: A.error,
            skipRetry: !0
        };
        let q = {
                ...A.headers,
                "User-Agent": pO()
            },
            K = QMz(),
            Y = await X8.get(K, {
                headers: q,
                timeout: FMz,
                validateStatus: (_) => _ === 200 || _ === 404
            });
        if (Y.status === 404) return U1("info", "settings_sync_fetch_empty"), {
            success: !0,
            isEmpty: !0
        };
        let z = hRq().safeParse(Y.data);
        if (!z.success) return U1("warn", "settings_sync_fetch_invalid_format"), {
            success: !1,
            error: "Invalid settings sync response format"
        };
        return U1("info", "settings_sync_fetch_success"), {
            success: !0,
            data: z.data,
            isEmpty: !1
        }
    } catch (A) {
        if (X8.isAxiosError(A)) {
            if (A.response?.status === 401 || A.response?.status === 403) return {
                success: !1,
                error: "Not authorized for settings sync",
                skipRetry: !0
            };
            if (A.code === "ECONNABORTED") return {
                success: !1,
                error: "Settings sync request timeout"
            };
            if (A.code === "ECONNREFUSED" || A.code === "ENOTFOUND") return {
                success: !1,
                error: "Cannot connect to server"
            }
        }
        return {
            success: !1,
            error: A instanceof Error ? A.message : "Unknown error"
        }
    }
}
// @from(Ln 476839, Col 0)
async function cMz() {
    let A = null;
    for (let q = 1; q <= da8 + 1; q++) {
        if (A = await dMz(), A.success) return A;
        if (A.skipRetry) return A;
        if (q > da8) return A;
        let K = VI(q);
        U1("info", "settings_sync_retry", {
            attempt: q,
            maxRetries: da8,
            delayMs: K
        }), await uk(K)
    }
    return A
}
// @from(Ln 476854, Col 0)
async function oC1(A, q) {
    try {
        let K = gMz(A);
        if (K) await mMz(K, {
            recursive: !0
        });
        return await BMz(A, q, "utf8"), U1("info", "settings_sync_file_written"), !0
    } catch {
        return U1("warn", "settings_sync_file_write_failed"), !1
    }
}
// @from(Ln 476865, Col 0)
async function lMz(A, q) {
    let K = 0,
        Y = !1,
        z = !1,
        _ = ($, H) => {
            let j = Buffer.byteLength($, "utf8");
            if (j > CRq) return U1("info", "settings_sync_file_too_large", {
                sizeBytes: j,
                maxBytes: CRq
            }), !0;
            return !1
        },
        w = A[oo6.USER_SETTINGS];
    if (w) {
        let $ = F_("userSettings");
        if ($ && !_(w, $)) {
            if (tO.markInternalWrite("userSettings"), await oC1($, w)) K++, Y = !0
        }
    }
    let O = A[oo6.USER_MEMORY];
    if (O) {
        let $ = PI("User");
        if (!_(O, $)) {
            if (await oC1($, O)) K++, z = !0
        }
    }
    if (q) {
        let $ = oo6.projectSettings(q),
            H = A[$];
        if (H) {
            let M = F_("localSettings");
            if (M && !_(H, M)) {
                if (tO.markInternalWrite("localSettings"), await oC1(M, H)) K++, Y = !0
            }
        }
        let j = oo6.projectMemory(q),
            J = A[j];
        if (J) {
            let M = PI("Local");
            if (!_(J, M)) {
                if (await oC1(M, J)) K++, z = !0
            }
        }
    }
    if (Y) zP();
    if (z) vO.cache.clear?.();
    U1("info", "settings_sync_applied", {
        appliedCount: K
    })
}
// @from(Ln 476915, Col 4)
FMz = 1e4
// @from(Ln 476916, Col 4)
da8 = 3
// @from(Ln 476917, Col 4)
CRq = 512000
// @from(Ln 476918, Col 4)
bRq = E(() => {
    kK();
    HA();
    RM();
    u_();
    V1();
    F5();
    fA();
    Nz();
    $5();
    i8();
    Hm();
    k8();
    lM();
    SRq();
    Ud();
    uv();
    T1()
})
// @from(Ln 476938, Col 0)
function JV6(A, q, K, Y) {
    let z = {
        type: "permissionPromptTool",
        permissionPromptToolName: q.name,
        toolResult: A
    };
    if (A.behavior === "allow") {
        let _ = A.updatedPermissions;
        if (_) Y.setAppState((w) => ({
            ...w,
            toolPermissionContext: _v(w.toolPermissionContext, _)
        })), NC(_);
        return {
            ...A,
            decisionReason: z
        }
    } else if (A.behavior === "deny" && A.interrupt) k(`SDK permission prompt deny+interrupt: tool=${q.name} message=${A.message}`), Y.abortController.abort();
    return {
        ...A,
        decisionReason: z
    }
}
// @from(Ln 476960, Col 4)
Ob$
// @from(Ln 476960, Col 9)
iMz
// @from(Ln 476960, Col 14)
nMz
// @from(Ln 476960, Col 19)
ao6
// @from(Ln 476961, Col 4)
ca8 = E(() => {
    K7();
    Tr8();
    F$();
    H1();
    Ob$ = F6(() => y4.object({
        tool_name: y4.string().describe("The name of the tool requesting permission"),
        input: y4.record(y4.string(), y4.unknown()).describe("The input for the tool"),
        tool_use_id: y4.string().optional().describe("The unique tool use request ID")
    })), iMz = F6(() => y4.object({
        behavior: y4.literal("allow"),
        updatedInput: y4.record(y4.string(), y4.unknown()),
        updatedPermissions: y4.array(PS1()).optional().catch((A) => {
            k(`Malformed updatedPermissions from SDK host ignored: ${A.error.issues[0]?.message??"unknown"}`, {
                level: "warn"
            });
            return
        }),
        toolUseID: y4.string().optional()
    })), nMz = F6(() => y4.object({
        behavior: y4.literal("deny"),
        message: y4.string(),
        interrupt: y4.boolean().optional(),
        toolUseID: y4.string().optional()
    })), ao6 = F6(() => y4.union([iMz(), nMz()]))
})
// @from(Ln 476987, Col 4)
rMz
// @from(Ln 476987, Col 9)
oMz
// @from(Ln 476987, Col 14)
aMz
// @from(Ln 476987, Col 19)
Mb$
// @from(Ln 476987, Col 24)
sMz
// @from(Ln 476987, Col 29)
tMz
// @from(Ln 476987, Col 34)
eMz
// @from(Ln 476987, Col 39)
ADz
// @from(Ln 476987, Col 44)
qDz
// @from(Ln 476987, Col 49)
KDz
// @from(Ln 476987, Col 54)
Db$
// @from(Ln 476987, Col 59)
YDz
// @from(Ln 476987, Col 64)
Xb$
// @from(Ln 476987, Col 69)
zDz
// @from(Ln 476987, Col 74)
Pb$
// @from(Ln 476987, Col 79)
_Dz
// @from(Ln 476987, Col 84)
wDz
// @from(Ln 476987, Col 89)
ODz
// @from(Ln 476987, Col 94)
Wb$
// @from(Ln 476987, Col 99)
$Dz
// @from(Ln 476987, Col 104)
HDz
// @from(Ln 476987, Col 109)
jDz
// @from(Ln 476987, Col 114)
JDz
// @from(Ln 476987, Col 119)
MDz
// @from(Ln 476987, Col 124)
Zb$
// @from(Ln 476987, Col 129)
DDz
// @from(Ln 476987, Col 134)
xRq
// @from(Ln 476987, Col 139)
XDz
// @from(Ln 476987, Col 144)
la8
// @from(Ln 476987, Col 149)
PDz
// @from(Ln 476987, Col 154)
WDz
// @from(Ln 476987, Col 159)
uRq
// @from(Ln 476987, Col 164)
ZDz
// @from(Ln 476987, Col 169)
mRq
// @from(Ln 476987, Col 174)
GDz
// @from(Ln 476987, Col 179)
Gb$
// @from(Ln 476987, Col 184)
fb$
// @from(Ln 476988, Col 4)
BRq = E(() => {
    K7();
    Mx8();
    rMz = F6(() => C.unknown()), oMz = F6(() => C.object({
        matcher: C.string().optional(),
        hookCallbackIds: C.array(C.string()),
        timeout: C.number().optional()
    }).describe("Configuration for matching and routing hook callbacks.")), aMz = F6(() => C.object({
        subtype: C.literal("initialize"),
        hooks: C.record(vd4(), C.array(oMz())).optional(),
        sdkMcpServers: C.array(C.string()).optional(),
        jsonSchema: C.record(C.string(), C.unknown()).optional(),
        systemPrompt: C.string().optional(),
        appendSystemPrompt: C.string().optional(),
        agents: C.record(C.string(), Ld4()).optional(),
        promptSuggestions: C.boolean().optional(),
        agentProgressSummaries: C.boolean().optional()
    }).describe("Initializes the SDK session with hooks, MCP servers, and agent configuration.")), Mb$ = F6(() => C.object({
        commands: C.array(Vd4()),
        agents: C.array(kd4()),
        output_style: C.string(),
        available_output_styles: C.array(C.string()),
        models: C.array(Ed4()),
        account: yd4(),
        pid: C.number().optional().describe("@internal CLI process PID for tmux socket isolation"),
        fast_mode_state: vc6().optional()
    }).describe("Response from session initialization with available commands, models, and account info.")), sMz = F6(() => C.object({
        subtype: C.literal("interrupt")
    }).describe("Interrupts the currently running conversation turn.")), tMz = F6(() => C.object({
        subtype: C.literal("can_use_tool"),
        tool_name: C.string(),
        input: C.record(C.string(), C.unknown()),
        permission_suggestions: C.array(Tc6()).optional(),
        blocked_path: C.string().optional(),
        decision_reason: C.string().optional(),
        tool_use_id: C.string(),
        agent_id: C.string().optional(),
        description: C.string().optional()
    }).describe("Requests permission to use a tool with the given input.")), eMz = F6(() => C.object({
        subtype: C.literal("set_permission_mode"),
        mode: J66()
    }).describe("Sets the permission mode for tool execution handling.")), ADz = F6(() => C.object({
        subtype: C.literal("set_model"),
        model: C.string().optional()
    }).describe("Sets the model to use for subsequent conversation turns.")), qDz = F6(() => C.object({
        subtype: C.literal("set_max_thinking_tokens"),
        max_thinking_tokens: C.number().nullable()
    }).describe("Sets the maximum number of thinking tokens for extended thinking.")), KDz = F6(() => C.object({
        subtype: C.literal("mcp_status")
    }).describe("Requests the current status of all MCP server connections.")), Db$ = F6(() => C.object({
        mcpServers: C.array(Td4())
    }).describe("Response containing the current status of all MCP server connections.")), YDz = F6(() => C.object({
        subtype: C.literal("rewind_files"),
        user_message_id: C.string(),
        dry_run: C.boolean().optional()
    }).describe("Rewinds file changes made since a specific user message.")), Xb$ = F6(() => C.object({
        canRewind: C.boolean(),
        error: C.string().optional(),
        filesChanged: C.array(C.string()).optional(),
        insertions: C.number().optional(),
        deletions: C.number().optional()
    }).describe("Result of a rewindFiles operation.")), zDz = F6(() => C.object({
        subtype: C.literal("cancel_async_message"),
        message_uuid: C.string()
    }).describe("Drops a pending async user message from the command queue by uuid. No-op if already dequeued for execution.")), Pb$ = F6(() => C.object({
        cancelled: C.boolean()
    }).describe("Result of a cancel_async_message operation. cancelled=false means the message was not in the queue (already dequeued or never enqueued).")), _Dz = F6(() => C.object({
        subtype: C.literal("hook_callback"),
        callback_id: C.string(),
        input: Nd4(),
        tool_use_id: C.string().optional()
    }).describe("Delivers a hook callback with its input data.")), wDz = F6(() => C.object({
        subtype: C.literal("mcp_message"),
        server_name: C.string(),
        message: rMz()
    }).describe("Sends a JSON-RPC message to a specific MCP server.")), ODz = F6(() => C.object({
        subtype: C.literal("mcp_set_servers"),
        servers: C.record(C.string(), lv1())
    }).describe("Replaces the set of dynamically managed MCP servers.")), Wb$ = F6(() => C.object({
        added: C.array(C.string()),
        removed: C.array(C.string()),
        errors: C.record(C.string(), C.string())
    }).describe("Result of replacing the set of dynamically managed MCP servers.")), $Dz = F6(() => C.object({
        subtype: C.literal("mcp_reconnect"),
        serverName: C.string()
    }).describe("Reconnects a disconnected or failed MCP server.")), HDz = F6(() => C.object({
        subtype: C.literal("mcp_toggle"),
        serverName: C.string(),
        enabled: C.boolean()
    }).describe("Enables or disables an MCP server.")), jDz = F6(() => C.object({
        subtype: C.literal("stop_task"),
        task_id: C.string()
    }).describe("Stops a running task.")), JDz = F6(() => C.object({
        subtype: C.literal("apply_flag_settings"),
        settings: C.record(C.string(), C.unknown())
    }).describe("Merges the provided settings into the flag settings layer, updating the active configuration.")), MDz = F6(() => C.object({
        subtype: C.literal("get_settings")
    }).describe("Returns the effective merged settings and the raw per-source settings.")), Zb$ = F6(() => C.object({
        effective: C.record(C.string(), C.unknown()),
        sources: C.array(C.object({
            source: C.enum(["userSettings", "projectSettings", "localSettings", "flagSettings", "policySettings"]),
            settings: C.record(C.string(), C.unknown())
        })).describe("Ordered low-to-high priority — later entries override earlier ones."),
        applied: C.object({
            model: C.string(),
            effort: C.enum(["low", "medium", "high", "max"]).nullable()
        }).optional().describe("Runtime-resolved values after env overrides, session state, and model-specific defaults are applied. Unlike `effective` (disk merge), these reflect what will actually be sent to the API.")
    }).describe("Effective merged settings plus raw per-source settings in merge order.")), DDz = F6(() => C.object({
        subtype: C.literal("elicitation"),
        mcp_server_name: C.string(),
        message: C.string(),
        mode: C.enum(["form", "url"]).optional(),
        url: C.string().optional(),
        elicitation_id: C.string().optional(),
        requested_schema: C.record(C.string(), C.unknown()).optional()
    }).describe("Requests the SDK consumer to handle an MCP elicitation (user input request).")), xRq = F6(() => C.object({
        action: C.enum(["accept", "decline", "cancel"]),
        content: C.record(C.string(), C.unknown()).optional()
    }).describe("Response from the SDK consumer for an elicitation request.")), XDz = F6(() => C.union([sMz(), tMz(), aMz(), eMz(), ADz(), qDz(), KDz(), _Dz(), wDz(), YDz(), zDz(), ODz(), $Dz(), HDz(), jDz(), JDz(), MDz(), DDz()])), la8 = F6(() => C.object({
        type: C.literal("control_request"),
        request_id: C.string(),
        request: XDz()
    })), PDz = F6(() => C.object({
        subtype: C.literal("success"),
        request_id: C.string(),
        response: C.record(C.string(), C.unknown()).optional()
    })), WDz = F6(() => C.object({
        subtype: C.literal("error"),
        request_id: C.string(),
        error: C.string(),
        pending_permission_requests: C.array(C.lazy(() => la8())).optional()
    })), uRq = F6(() => C.object({
        type: C.literal("control_response"),
        response: C.union([PDz(), WDz()])
    })), ZDz = F6(() => C.object({
        type: C.literal("control_cancel_request"),
        request_id: C.string()
    }).describe("Cancels a currently open control request.")), mRq = F6(() => C.object({
        type: C.literal("keep_alive")
    }).describe("Keep-alive message to maintain WebSocket connection.")), GDz = F6(() => C.object({
        type: C.literal("update_environment_variables"),
        variables: C.record(C.string(), C.string())
    }).describe("Updates environment variables at runtime.")), Gb$ = F6(() => C.union([bd4(), Sd4(), Cd4(), uRq(), la8(), ZDz(), mRq()])), fb$ = F6(() => C.union([Jx8(), la8(), uRq(), mRq(), GDz()]))
})
// @from(Ln 477133, Col 0)
function TDz(A) {
    return A.replace(fDz, (q) => q === "\u2028" ? "\\u2028" : "\\u2029")
}
// @from(Ln 477137, Col 0)
function aC1(A) {
    return TDz(B6(A))
}
// @from(Ln 477140, Col 4)
fDz
// @from(Ln 477141, Col 4)
ia8 = E(() => {
    g1();
    fDz = /\u2028|\u2029/g
})
// @from(Ln 477146, Col 0)
function sC1(A) {
    if (A === null || typeof A !== "object") return A;
    let q = A;
    if ("requestId" in q && !("request_id" in q)) q.request_id = q.requestId, delete q.requestId;
    if ("response" in q && q.response !== null && typeof q.response === "object") {
        let K = q.response;
        if ("requestId" in K && !("request_id" in K)) K.request_id = K.requestId, delete K.requestId
    }
    return A
}
// @from(Ln 477160, Col 0)
function VDz(A) {
    if (!A) return;
    if (A.type === "classifier") return A.reason;
    switch (A.type) {
        case "rule":
        case "mode":
        case "subcommandResults":
        case "permissionPromptTool":
            return;
        case "hook":
        case "asyncAgent":
        case "sandboxOverride":
        case "workingDir":
        case "other":
            return A.reason
    }
}
// @from(Ln 477177, Col 0)
class so6 {
    input;
    replayUserMessages;
    structuredInput;
    pendingRequests = new Map;
    inputClosed = !1;
    unexpectedResponseCallback;
    resolvedToolUseIds = new Set;
    onControlRequestSent;
    onControlRequestResolved;
    outbound = new Pi6;
    constructor(A, q) {
        this.input = A;
        this.replayUserMessages = q;
        this.input = A, this.structuredInput = this.read()
    }
    trackResolvedToolUseId(A) {
        if (A.request.subtype === "can_use_tool") {
            if (this.resolvedToolUseIds.add(A.request.tool_use_id), this.resolvedToolUseIds.size > kDz) {
                let q = this.resolvedToolUseIds.values().next().value;
                if (q !== void 0) this.resolvedToolUseIds.delete(q)
            }
        }
    }
    flushInternalEvents() {
        return Promise.resolve()
    }
    async * read() {
        let A = "";
        for await (let q of this.input) {
            A += q;
            let K;
            while ((K = A.indexOf(`
`)) !== -1) {
                let Y = A.slice(0, K);
                A = A.slice(K + 1);
                let z = await this.processLine(Y);
                if (z) U1("info", "cli_stdin_message_parsed", {
                    type: z.type
                }), yield z
            }
        }
        if (A) {
            let q = await this.processLine(A);
            if (q) yield q
        }
        this.inputClosed = !0;
        for (let q of this.pendingRequests.values()) q.reject(Error("Tool permission stream closed before response received"))
    }
    getPendingPermissionRequests() {
        return Array.from(this.pendingRequests.values()).map((A) => A.request).filter((A) => A.request.subtype === "can_use_tool")
    }
    setUnexpectedResponseCallback(A) {
        this.unexpectedResponseCallback = A
    }
    injectControlResponse(A) {
        let q = A.response?.request_id;
        if (!q) return;
        let K = this.pendingRequests.get(q);
        if (!K) return;
        if (this.trackResolvedToolUseId(K.request), this.pendingRequests.delete(q), this.write({
                type: "control_cancel_request",
                request_id: q
            }), A.response.subtype === "error") K.reject(Error(A.response.error));
        else {
            let Y = A.response.response;
            if (K.schema) try {
                K.resolve(K.schema.parse(Y))
            } catch (z) {
                K.reject(z)
            } else K.resolve({})
        }
    }
    setOnControlRequestSent(A) {
        this.onControlRequestSent = A
    }
    setOnControlRequestResolved(A) {
        this.onControlRequestResolved = A
    }
    async processLine(A) {
        if (!A) return;
        try {
            let q = sC1(i1(A));
            if (q.type === "keep_alive") return;
            if (q.type === "update_environment_variables") {
                for (let [K, Y] of Object.entries(q.variables)) process.env[K] = Y;
                return
            }
            if (q.type === "control_response") {
                let K = "uuid" in q && typeof q.uuid === "string" ? q.uuid : void 0;
                if (K) pb(K, "started"), pb(K, "completed");
                let Y = this.pendingRequests.get(q.response.request_id);
                if (!Y) {
                    let w = (q.response.subtype === "success" ? q.response.response : void 0)?.toolUseID;
                    if (typeof w === "string" && this.resolvedToolUseIds.has(w)) {
                        k(`Ignoring duplicate control_response for already-resolved toolUseID=${w} request_id=${q.response.request_id}`);
                        return
                    }
                    if (this.unexpectedResponseCallback) await this.unexpectedResponseCallback(q);
                    return
                }
                if (this.trackResolvedToolUseId(Y.request), this.pendingRequests.delete(q.response.request_id), Y.request.request.subtype === "can_use_tool" && this.onControlRequestResolved) this.onControlRequestResolved(q.response.request_id);
                if (q.response.subtype === "error") {
                    Y.reject(Error(q.response.error));
                    return
                }
                let z = q.response.response;
                if (Y.schema) try {
                    Y.resolve(Y.schema.parse(z))
                } catch (_) {
                    Y.reject(_)
                } else Y.resolve({});
                if (this.replayUserMessages) return q;
                return
            }
            if (q.type !== "user" && q.type !== "control_request" && q.type !== "assistant" && q.type !== "system") {
                k(`Ignoring unknown message type: ${q.type}`, {
                    level: "warn"
                });
                return
            }
            if (q.type === "control_request") {
                if (!q.request) FRq("Error: Missing request on control_request");
                return q
            }
            if (q.type === "assistant" || q.type === "system") return q;
            if (q.message.role !== "user") FRq(`Error: Expected message role 'user', got '${q.message.role}'`);
            return q
        } catch (q) {
            console.error(`Error parsing streaming input line: ${A}: ${q}`), process.exit(1)
        }
    }
    async write(A) {
        Z4(aC1(A) + `
`)
    }
    async sendRequest(A, q, K) {
        let Y = gRq(),
            z = {
                type: "control_request",
                request_id: Y,
                request: A
            };
        if (this.inputClosed) throw Error("Stream closed");
        if (K?.aborted) throw Error("Request aborted");
        if (this.outbound.enqueue(z), A.subtype === "can_use_tool" && this.onControlRequestSent) this.onControlRequestSent(z);
        let _ = () => {
            this.outbound.enqueue({
                type: "control_cancel_request",
                request_id: Y
            });
            let w = this.pendingRequests.get(Y);
            if (w) this.trackResolvedToolUseId(w.request), w.reject(new oY)
        };
        if (K) K.addEventListener("abort", _, {
            once: !0
        });
        try {
            return await new Promise((w, O) => {
                this.pendingRequests.set(Y, {
                    request: {
                        type: "control_request",
                        request_id: Y,
                        request: A
                    },
                    resolve: ($) => {
                        w($)
                    },
                    reject: O,
                    schema: q
                })
            })
        } finally {
            if (K) K.removeEventListener("abort", _);
            this.pendingRequests.delete(Y)
        }
    }
    createCanUseTool(A) {
        return async (q, K, Y, z, _) => {
            let w = await tJ(q, K, Y, z, _);
            if (w.behavior === "allow" || w.behavior === "deny") return w;
            let O = new AbortController,
                $ = Y.abortController.signal,
                H = () => O.abort();
            $.addEventListener("abort", H, {
                once: !0
            });
            try {
                let j = EDz(q.name, _, K, Y, w.suggestions).then((D) => ({
                    source: "hook",
                    decision: D
                }));
                A?.();
                let J = this.sendRequest({
                        subtype: "can_use_tool",
                        tool_name: q.name,
                        input: K,
                        permission_suggestions: w.suggestions,
                        blocked_path: w.blockedPath,
                        decision_reason: VDz(w.decisionReason),
                        tool_use_id: _,
                        agent_id: Y.agentId
                    }, ao6(), O.signal).then((D) => ({
                        source: "sdk",
                        result: D
                    })),
                    M = await Promise.race([j, J]);
                if (M.source === "hook") {
                    if (M.decision) return J.catch(() => {}), O.abort(), M.decision;
                    let D = await J;
                    return JV6(D.result, q, K, Y)
                }
                return JV6(M.result, q, K, Y)
            } catch (j) {
                return JV6({
                    behavior: "deny",
                    message: `Tool permission request failed: ${j}`,
                    toolUseID: _
                }, q, K, Y)
            } finally {
                if (this.getPendingPermissionRequests().length === 0) zV6("running");
                $.removeEventListener("abort", H)
            }
        }
    }
    createHookCallback(A, q) {
        return {
            type: "callback",
            timeout: q,
            callback: async (K, Y, z) => {
                try {
                    return await this.sendRequest({
                        subtype: "hook_callback",
                        callback_id: A,
                        input: K,
                        tool_use_id: Y || void 0
                    }, gN6(), z)
                } catch (_) {
                    return console.error(`Error in hook callback ${A}:`, _), {}
                }
            }
        }
    }
    async handleElicitation(A, q, K, Y, z, _, w) {
        try {
            return await this.sendRequest({
                subtype: "elicitation",
                mcp_server_name: A,
                message: q,
                mode: z,
                url: _,
                elicitation_id: w,
                requested_schema: K
            }, NDz, Y)
        } catch {
            return {
                action: "cancel"
            }
        }
    }
    createSandboxAskCallback() {
        return async (A) => {
            try {
                return (await this.sendRequest({
                    subtype: "can_use_tool",
                    tool_name: na8,
                    input: {
                        host: A.host
                    },
                    tool_use_id: gRq(),
                    description: `Allow network connection to ${A.host}?`
                }, ao6())).behavior === "allow"
            } catch {
                return !1
            }
        }
    }
    async sendMcpMessage(A, q) {
        return (await this.sendRequest({
            subtype: "mcp_message",
            server_name: A,
            message: q
        }, C.object({
            mcp_response: C.any()
        }))).mcp_response
    }
}
// @from(Ln 477465, Col 0)
function FRq(A) {
    console.error(A), process.exit(1)
}
// @from(Ln 477468, Col 0)
async function EDz(A, q, K, Y, z) {
    let w = Y.getAppState().toolPermissionContext.mode,
        O = b_6(A, q, K, Y, w, z, Y.abortController.signal);
    for await (let $ of O) if ($.permissionRequestResult && ($.permissionRequestResult.behavior === "allow" || $.permissionRequestResult.behavior === "deny")) {
        let H = $.permissionRequestResult;
        if (H.behavior === "allow") {
            let j = H.updatedInput || K,
                J = H.updatedPermissions ?? [];
            if (J.length > 0) {
                NC(J);
                let M = Y.getAppState(),
                    D = _v(M.toolPermissionContext, J);
                Y.setAppState((X) => {
                    if (X.toolPermissionContext === D) return X;
                    return {
                        ...X,
                        toolPermissionContext: D
                    }
                })
            }
            return {
                behavior: "allow",
                updatedInput: j,
                userModified: !1,
                decisionReason: {
                    type: "hook",
                    hookName: "PermissionRequest"
                }
            }
        } else return {
            behavior: "deny",
            message: H.message || "Permission denied by PermissionRequest hook",
            decisionReason: {
                type: "hook",
                hookName: "PermissionRequest"
            }
        }
    }
    return
}
// @from(Ln 477508, Col 4)
NDz
// @from(Ln 477508, Col 9)
na8 = "SandboxNetworkAccess"
// @from(Ln 477509, Col 4)
kDz = 1000
// @from(Ln 477510, Col 4)
tC1 = E(() => {
    u_();
    H1();
    Bj();
    K7();
    ca8();
    vr8();
    BRq();
    s8();
    g1();
    ia8();
    VF8();
    hw();
    F$();
    NDz = xRq()
})
// @from(Ln 477526, Col 0)
class to6 {
    ws = null;
    lastSentId = null;
    url;
    state = "idle";
    onData;
    onCloseCallback;
    onConnectCallback;
    headers;
    sessionId;
    autoReconnect;
    reconnectAttempts = 0;
    reconnectStartTime = null;
    reconnectTimer = null;
    lastReconnectAttemptTime = null;
    pingInterval = null;
    pongReceived = !0;
    keepAliveInterval = null;
    messageBuffer;
    isBunWs = !1;
    connectStartTime = 0;
    refreshHeaders;
    constructor(A, q = {}, K, Y, z) {
        this.url = A, this.headers = q, this.sessionId = K, this.refreshHeaders = Y, this.autoReconnect = z?.autoReconnect ?? !0, this.messageBuffer = new nC6(yDz)
    }
    async connect() {
        if (this.state !== "idle" && this.state !== "reconnecting") {
            k(`WebSocketTransport: Cannot connect, current state is ${this.state}`, {
                level: "error"
            }), U1("error", "cli_websocket_connect_failed");
            return
        }
        this.state = "reconnecting", this.connectStartTime = Date.now(), k(`WebSocketTransport: Opening ${this.url.href}`), U1("info", "cli_websocket_connect_opening");
        let A = {
            ...this.headers
        };
        if (this.lastSentId) A["X-Last-Request-Id"] = this.lastSentId, k(`WebSocketTransport: Adding X-Last-Request-Id header: ${this.lastSentId}`);
        if (typeof Bun < "u") {
            let q = new globalThis.WebSocket(this.url.href, {
                headers: A,
                proxy: mQ(this.url.href),
                tls: iS() || void 0
            });
            this.ws = q, this.isBunWs = !0, q.addEventListener("open", this.onBunOpen), q.addEventListener("message", this.onBunMessage), q.addEventListener("error", this.onBunError), q.addEventListener("close", this.onBunClose), q.addEventListener("pong", this.onPong)
        } else {
            let {
                default: q
            } = await Promise.resolve().then(() => (VO6(), V61)), K = new q(this.url.href, {
                headers: A,
                agent: uQ(this.url.href),
                ...iS()
            });
            this.ws = K, this.isBunWs = !1, K.on("open", this.onNodeOpen), K.on("message", this.onNodeMessage), K.on("error", this.onNodeError), K.on("close", this.onNodeClose), K.on("pong", this.onPong)
        }
    }
    onBunOpen = () => {
        if (this.handleOpenEvent(), this.lastSentId) this.replayBufferedMessages("")
    };
    onBunMessage = (A) => {
        let q = typeof A.data === "string" ? A.data : String(A.data);
        if (U1("info", "cli_websocket_message_received", {
                length: q.length
            }), this.onData) this.onData(q)
    };
    onBunError = () => {
        k("WebSocketTransport: Error", {
            level: "error"
        }), U1("error", "cli_websocket_connect_error")
    };
    onBunClose = (A) => {
        let q = A.code === 1000 || A.code === 1001;
        k(`WebSocketTransport: Closed: ${A.code}`, q ? void 0 : {
            level: "error"
        }), U1("error", "cli_websocket_connect_closed"), this.handleConnectionError(A.code)
    };
    onNodeOpen = () => {
        let A = this.ws;
        if (this.handleOpenEvent(), !A) return;
        let K = A.upgradeReq;
        if (K?.headers?.["x-last-request-id"]) {
            let Y = K.headers["x-last-request-id"];
            this.replayBufferedMessages(Y)
        }
    };
    onNodeMessage = (A) => {
        let q = A.toString();
        if (U1("info", "cli_websocket_message_received", {
                length: q.length
            }), this.onData) this.onData(q)
    };
    onNodeError = (A) => {
        k(`WebSocketTransport: Error: ${A.message}`, {
            level: "error"
        }), U1("error", "cli_websocket_connect_error")
    };
    onNodeClose = (A, q) => {
        let K = A === 1000 || A === 1001;
        k(`WebSocketTransport: Closed: ${A}`, K ? void 0 : {
            level: "error"
        }), U1("error", "cli_websocket_connect_closed"), this.handleConnectionError(A)
    };
    onPong = () => {
        this.pongReceived = !0
    };
    handleOpenEvent() {
        let A = Date.now() - this.connectStartTime;
        k("WebSocketTransport: Connected"), U1("info", "cli_websocket_connect_connected", {
            duration_ms: A
        }), this.reconnectAttempts = 0, this.reconnectStartTime = null, this.lastReconnectAttemptTime = null, this.state = "connected", this.onConnectCallback?.(), this.startPingInterval(), this.startKeepaliveInterval(), JE1(() => {
            this.write({
                type: "keep_alive"
            })
        })
    }
    sendLine(A) {
        if (!this.ws || this.state !== "connected") return k("WebSocketTransport: Not connected"), U1("info", "cli_websocket_send_not_connected"), !1;
        try {
            return this.ws.send(A), !0
        } catch (q) {
            return k(`WebSocketTransport: Failed to send: ${q}`, {
                level: "error"
            }), U1("error", "cli_websocket_send_error"), this.handleConnectionError(), !1
        }
    }
    removeWsListeners(A) {
        if (this.isBunWs) {
            let q = A;
            q.removeEventListener("open", this.onBunOpen), q.removeEventListener("message", this.onBunMessage), q.removeEventListener("error", this.onBunError), q.removeEventListener("close", this.onBunClose), q.removeEventListener("pong", this.onPong)
        } else {
            let q = A;
            q.off("open", this.onNodeOpen), q.off("message", this.onNodeMessage), q.off("error", this.onNodeError), q.off("close", this.onNodeClose), q.off("pong", this.onPong)
        }
    }
    doDisconnect() {
        if (this.stopPingInterval(), this.stopKeepaliveInterval(), gT6(), this.ws) this.removeWsListeners(this.ws), this.ws.close(), this.ws = null
    }
    handleConnectionError(A) {
        if (k(`WebSocketTransport: Disconnected from ${this.url.href}` + (A != null ? ` (code ${A})` : "")), U1("info", "cli_websocket_disconnected"), this.doDisconnect(), this.state === "closing" || this.state === "closed") return;
        let q = !1;
        if (A === 4003 && this.refreshHeaders) {
            let z = this.refreshHeaders();
            if (z.Authorization !== this.headers.Authorization) Object.assign(this.headers, z), q = !0, k("WebSocketTransport: 4003 received but headers refreshed, scheduling reconnect"), U1("info", "cli_websocket_4003_token_refreshed")
        }
        if (A != null && CDz.has(A) && !q) {
            k(`WebSocketTransport: Permanent close code ${A}, not reconnecting`, {
                level: "error"
            }), U1("error", "cli_websocket_permanent_close", {
                closeCode: A
            }), this.state = "closed", this.onCloseCallback?.(A);
            return
        }
        if (!this.autoReconnect) {
            this.state = "closed", this.onCloseCallback?.(A);
            return
        }
        let K = Date.now();
        if (!this.reconnectStartTime) this.reconnectStartTime = K;
        if (this.lastReconnectAttemptTime !== null && K - this.lastReconnectAttemptTime > pRq) k(`WebSocketTransport: Detected system sleep (${Math.round((K-this.lastReconnectAttemptTime)/1000)}s gap), resetting reconnection budget`), U1("info", "cli_websocket_sleep_detected", {
            gapMs: K - this.lastReconnectAttemptTime
        }), this.reconnectStartTime = K, this.reconnectAttempts = 0;
        this.lastReconnectAttemptTime = K;
        let Y = K - this.reconnectStartTime;
        if (Y < RDz) {
            if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
            if (!q && this.refreshHeaders) {
                let w = this.refreshHeaders();
                Object.assign(this.headers, w), k("WebSocketTransport: Refreshed headers for reconnect")
            }
            this.state = "reconnecting", this.reconnectAttempts++;
            let z = Math.min(LDz * Math.pow(2, this.reconnectAttempts - 1), QRq),
                _ = Math.max(0, z + z * 0.25 * (2 * Math.random() - 1));
            k(`WebSocketTransport: Reconnecting in ${Math.round(_)}ms (attempt ${this.reconnectAttempts}, ${Math.round(Y/1000)}s elapsed)`), U1("error", "cli_websocket_reconnect_attempt", {
                reconnectAttempts: this.reconnectAttempts
            }), this.reconnectTimer = setTimeout(() => {
                this.reconnectTimer = null, this.connect()
            }, _)
        } else if (k(`WebSocketTransport: Reconnection time budget exhausted after ${Math.round(Y/1000)}s for ${this.url.href}`, {
                level: "error"
            }), U1("error", "cli_websocket_reconnect_exhausted", {
                reconnectAttempts: this.reconnectAttempts,
                elapsedMs: Y
            }), this.state = "closed", this.onCloseCallback) this.onCloseCallback(A)
    }
    close() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
        this.stopPingInterval(), this.stopKeepaliveInterval(), gT6(), this.state = "closing", this.doDisconnect()
    }
    replayBufferedMessages(A) {
        let q = this.messageBuffer.toArray();
        if (q.length === 0) return;
        let K = 0;
        if (A) {
            let z = q.findIndex((_) => ("uuid" in _) && _.uuid === A);
            if (z >= 0) {
                K = z + 1;
                let _ = q.slice(K);
                if (this.messageBuffer.clear(), this.messageBuffer.addAll(_), _.length === 0) this.lastSentId = null;
                k(`WebSocketTransport: Evicted ${K} confirmed messages, ${_.length} remaining`), U1("info", "cli_websocket_evicted_confirmed_messages", {
                    evicted: K,
                    remaining: _.length
                })
            }
        }
        let Y = q.slice(K);
        if (Y.length === 0) {
            k("WebSocketTransport: No new messages to replay"), U1("info", "cli_websocket_no_messages_to_replay");
            return
        }
        k(`WebSocketTransport: Replaying ${Y.length} buffered messages`), U1("info", "cli_websocket_messages_to_replay", {
            count: Y.length
        });
        for (let z of Y) {
            let _ = B6(z) + `
`;
            if (!this.sendLine(_)) {
                this.handleConnectionError();
                break
            }
        }
    }
    isConnectedStatus() {
        return this.state === "connected"
    }
    isClosedStatus() {
        return this.state === "closed"
    }
    setOnData(A) {
        this.onData = A
    }
    setOnConnect(A) {
        this.onConnectCallback = A
    }
    setOnClose(A) {
        this.onCloseCallback = A
    }
    getStateLabel() {
        return this.state
    }
    async write(A) {
        if ("uuid" in A && typeof A.uuid === "string") this.messageBuffer.add(A), this.lastSentId = A.uuid;
        let q = B6(A) + `
`;
        if (this.state !== "connected") return;
        let K = this.sessionId ? ` session=${this.sessionId}` : "",
            Y = this.getControlMessageDetailLabel(A);
        k(`WebSocketTransport: Sending message type=${A.type}${K}${Y}`), this.sendLine(q)
    }
    getControlMessageDetailLabel(A) {
        if (A.type === "control_request") {
            let {
                request_id: q,
                request: K
            } = A, Y = K.subtype === "can_use_tool" ? K.tool_name : "";
            return ` subtype=${K.subtype} request_id=${q}${Y?` tool=${Y}`:""}`
        }
        if (A.type === "control_response") {
            let {
                subtype: q,
                request_id: K
            } = A.response;
            return ` subtype=${q} request_id=${K}`
        }
        return ""
    }
    startPingInterval() {
        this.stopPingInterval(), this.pongReceived = !0;
        let A = Date.now();
        this.pingInterval = setInterval(() => {
            if (this.state === "connected" && this.ws) {
                let q = Date.now(),
                    K = q - A;
                if (A = q, K > pRq) {
                    k(`WebSocketTransport: ${Math.round(K/1000)}s tick gap detected — process was suspended, forcing reconnect`), U1("info", "cli_websocket_sleep_detected_on_ping", {
                        gapMs: K
                    }), this.handleConnectionError();
                    return
                }
                if (!this.pongReceived) {
                    k("WebSocketTransport: No pong received, connection appears dead", {
                        level: "error"
                    }), U1("error", "cli_websocket_pong_timeout"), this.handleConnectionError();
                    return
                }
                this.pongReceived = !1;
                try {
                    this.ws.ping?.()
                } catch (Y) {
                    k(`WebSocketTransport: Ping failed: ${Y}`, {
                        level: "error"
                    }), U1("error", "cli_websocket_ping_failed")
                }
            }
        }, hDz)
    }
    stopPingInterval() {
        if (this.pingInterval) clearInterval(this.pingInterval), this.pingInterval = null
    }
    startKeepaliveInterval() {
        if (this.stopKeepaliveInterval(), t6(process.env.CLAUDE_CODE_REMOTE)) return;
        this.keepAliveInterval = setInterval(() => {
            if (this.state === "connected" && this.ws) try {
                this.ws.send(B6({
                    type: "keep_alive"
                }) + `
`), k("WebSocketTransport: Sent periodic keep_alive data frame")
            } catch (A) {
                k(`WebSocketTransport: Periodic keep_alive failed: ${A}`, {
                    level: "error"
                }), U1("error", "cli_websocket_keepalive_failed")
            }
        }, SDz)
    }
    stopKeepaliveInterval() {
        if (this.keepAliveInterval) clearInterval(this.keepAliveInterval), this.keepAliveInterval = null
    }
}
// @from(Ln 477842, Col 4)
yDz = 1000
// @from(Ln 477843, Col 4)
LDz = 1000
// @from(Ln 477844, Col 4)
QRq = 30000
// @from(Ln 477845, Col 4)
RDz = 600000
// @from(Ln 477846, Col 4)
hDz = 1e4
// @from(Ln 477847, Col 4)
SDz = 300000
// @from(Ln 477848, Col 4)
pRq
// @from(Ln 477848, Col 9)
CDz
// @from(Ln 477849, Col 4)
ra8 = E(() => {
    H1();
    dV();
    Mu();
    u_();
    FT6();
    g1();
    A8();
    pRq = QRq * 2, CDz = new Set([1002, 4001, 4003])
})
// @from(Ln 477859, Col 0)
class Y26 {
    pending = [];
    draining = !1;
    closed = !1;
    backpressureResolvers = [];
    sleepResolve = null;
    flushResolvers = [];
    droppedBatches = 0;
    config;
    constructor(A) {
        this.config = A
    }
    get droppedBatchCount() {
        return this.droppedBatches
    }
    async enqueue(A) {
        if (this.closed) return;
        let q = Array.isArray(A) ? A : [A];
        if (q.length === 0) return;
        while (this.pending.length + q.length > this.config.maxQueueSize && !this.closed) await new Promise((K) => {
            this.backpressureResolvers.push(K)
        });
        if (this.closed) return;
        this.pending.push(...q), this.drain()
    }
    flush() {
        if (this.pending.length === 0 && !this.draining) return Promise.resolve();
        return this.drain(), new Promise((A) => {
            this.flushResolvers.push(A)
        })
    }
    close() {
        this.closed = !0, this.pending = [], this.sleepResolve?.(), this.sleepResolve = null;
        for (let A of this.backpressureResolvers) A();
        this.backpressureResolvers = [];
        for (let A of this.flushResolvers) A();
        this.flushResolvers = []
    }
    async drain() {
        if (this.draining || this.closed) return;
        this.draining = !0;
        let A = 0;
        try {
            while (this.pending.length > 0 && !this.closed) {
                let q = this.pending.splice(0, this.config.maxBatchSize);
                try {
                    await this.config.send(q), A = 0
                } catch (K) {
                    if (A++, this.config.maxConsecutiveFailures !== void 0 && A >= this.config.maxConsecutiveFailures) {
                        this.droppedBatches++, this.config.onBatchDropped?.(q.length, A), A = 0, this.releaseBackpressure();
                        continue
                    }
                    this.pending = q.concat(this.pending);
                    let Y = K instanceof MV6 ? K.retryAfterMs : void 0;
                    await this.sleep(this.retryDelay(A, Y));
                    continue
                }
                this.releaseBackpressure()
            }
        } finally {
            if (this.draining = !1, this.pending.length === 0) {
                for (let q of this.flushResolvers) q();
                this.flushResolvers = []
            }
        }
    }
    retryDelay(A, q) {
        if (q !== void 0) return Math.max(this.config.baseDelayMs, Math.min(q, this.config.maxDelayMs));
        let K = Math.min(this.config.baseDelayMs * 2 ** (A - 1), this.config.maxDelayMs),
            Y = Math.random() * this.config.jitterMs;
        return K + Y
    }
    releaseBackpressure() {
        let A = this.backpressureResolvers;
        this.backpressureResolvers = [];
        for (let q of A) q()
    }
    sleep(A) {
        return new Promise((q) => {
            this.sleepResolve = q, setTimeout((K, Y) => {
                K.sleepResolve = null, Y()
            }, A, this, q)
        })
    }
}
// @from(Ln 477944, Col 4)
MV6
// @from(Ln 477945, Col 4)
oa8 = E(() => {
    MV6 = class MV6 extends Error {
        retryAfterMs;
        constructor(A, q) {
            super(A);
            this.retryAfterMs = q
        }
    }
})
// @from(Ln 477955, Col 0)
function uDz(A) {
    let q = A.protocol === "wss:" ? "https:" : "http:",
        K = A.pathname;
    if (K = K.replace("/ws/", "/session/"), !K.endsWith("/events")) K = K.endsWith("/") ? K + "events" : K + "/events";
    return `${q}//${A.host}${K}${A.search}`
}
// @from(Ln 477961, Col 4)
IDz = 100
// @from(Ln 477962, Col 4)
bDz = 15000
// @from(Ln 477963, Col 4)
xDz = 3000
// @from(Ln 477964, Col 4)
eo6
// @from(Ln 477965, Col 4)
aa8 = E(() => {
    kK();
    ra8();
    oa8();
    H1();
    u_();
    gL();
    eo6 = class eo6 extends to6 {
        postUrl;
        uploader;
        streamEventBuffer = [];
        streamEventTimer = null;
        constructor(A, q = {}, K, Y, z) {
            super(A, q, K, Y, z);
            let {
                maxConsecutiveFailures: _,
                onBatchDropped: w
            } = z ?? {};
            this.postUrl = uDz(A), this.uploader = new Y26({
                maxBatchSize: 500,
                maxQueueSize: 1e5,
                baseDelayMs: 500,
                maxDelayMs: 8000,
                jitterMs: 1000,
                maxConsecutiveFailures: _,
                onBatchDropped: (O, $) => {
                    U1("error", "cli_hybrid_batch_dropped_max_failures", {
                        batchSize: O,
                        failures: $
                    }), w?.(O, $)
                },
                send: (O) => this.postOnce(O)
            }), k(`HybridTransport: POST URL = ${this.postUrl}`), U1("info", "cli_hybrid_transport_initialized")
        }
        async write(A) {
            if (A.type === "stream_event") {
                if (this.streamEventBuffer.push(A), !this.streamEventTimer) this.streamEventTimer = setTimeout(() => this.flushStreamEvents(), IDz);
                return
            }
            return await this.uploader.enqueue([...this.takeStreamEvents(), A]), this.uploader.flush()
        }
        async writeBatch(A) {
            return await this.uploader.enqueue([...this.takeStreamEvents(), ...A]), this.uploader.flush()
        }
        get droppedBatchCount() {
            return this.uploader.droppedBatchCount
        }
        flush() {
            return this.uploader.enqueue(this.takeStreamEvents()), this.uploader.flush()
        }
        takeStreamEvents() {
            if (this.streamEventTimer) clearTimeout(this.streamEventTimer), this.streamEventTimer = null;
            let A = this.streamEventBuffer;
            return this.streamEventBuffer = [], A
        }
        flushStreamEvents() {
            this.streamEventTimer = null, this.uploader.enqueue(this.takeStreamEvents())
        }
        close() {
            if (this.streamEventTimer) clearTimeout(this.streamEventTimer), this.streamEventTimer = null;
            this.streamEventBuffer = [];
            let A = this.uploader,
                q;
            Promise.race([A.flush(), new Promise((K) => {
                q = setTimeout(K, xDz)
            })]).finally(() => {
                clearTimeout(q), A.close()
            }), super.close()
        }
        async postOnce(A) {
            let q = UW();
            if (!q) {
                k("HybridTransport: No session token available for POST"), U1("warn", "cli_hybrid_post_no_token");
                return
            }
            let K = {
                    Authorization: `Bearer ${q}`,
                    "Content-Type": "application/json"
                },
                Y;
            try {
                Y = await X8.post(this.postUrl, {
                    events: A
                }, {
                    headers: K,
                    validateStatus: () => !0,
                    timeout: bDz
                })
            } catch (z) {
                throw k(`HybridTransport: POST error: ${z.message}`), U1("warn", "cli_hybrid_post_network_error"), z
            }
            if (Y.status >= 200 && Y.status < 300) {
                k(`HybridTransport: POST success count=${A.length}`);
                return
            }
            if (Y.status >= 400 && Y.status < 500 && Y.status !== 429) {
                k(`HybridTransport: POST returned ${Y.status} (permanent), dropping`), U1("warn", "cli_hybrid_post_client_error", {
                    status: Y.status
                });
                return
            }
            throw k(`HybridTransport: POST returned ${Y.status} (retryable)`), U1("warn", "cli_hybrid_post_retryable_error", {
                status: Y.status
            }), Error(`POST failed with ${Y.status}`)
        }
    }
})
// @from(Ln 478073, Col 0)
function dDz(A) {
    let q = [],
        K = A,
        Y;
    while ((Y = K.indexOf(`

`)) !== -1) {
        let z = K.slice(0, Y);
        if (K = K.slice(Y + 2), !z.trim()) continue;
        let _ = {},
            w = !1;
        for (let O of z.split(`
`)) {
            if (O.startsWith(":")) {
                w = !0;
                continue
            }
            let $ = O.indexOf(":");
            if ($ === -1) continue;
            let H = O.slice(0, $),
                j = O[$ + 1] === " " ? O.slice($ + 2) : O.slice($ + 1);
            switch (H) {
                case "event":
                    _.event = j;
                    break;
                case "id":
                    _.id = j;
                    break;
                case "data":
                    _.data = _.data ? _.data + `
` + j : j;
                    break
            }
        }
        if (_.data || w) q.push(_)
    }
    return {
        frames: q,
        remaining: K
    }
}