# WebFetch and WebSearch Tools - Deep Analysis (Claude Code 2.1.76)

> Complete analysis of web interaction tools: URL fetching, content extraction, and web search capabilities.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `WebFetchTool` (`BX`) - WebFetch tool definition - chunks.143.mjs:1308
- `WebSearchTool` (`lk1`) - WebSearch tool definition - chunks.143.mjs:2393
- `TOOL_NAME_WEB_FETCH` (`sO`) - chunks.56.mjs:80
- `TOOL_NAME_WEB_SEARCH` (`jv`) - chunks.56.mjs:1287

---

## Architecture Overview

```
WebFetch Tool
LLM generates tool_use { url, prompt }
         │
         ▼
 validateInput()
 ├── URL format validation
 ├── Protocol check (http/https only)
 └── Redirect policy check
         │
         ▼
 checkPermissions()
 ├── Preapproved hosts check (eV1 list)
 ├── Path-based preapproval
 └── Permission rules lookup
         │
         ▼
 call() execution
 ├── HTTP request with timeout
 ├── Content-Type detection
 ├── HTML → Markdown conversion
 ├── Prompt-based extraction
 └── Return extracted content
         │
         ▼
 Return { data: { content, ... } }

---

WebSearch Tool
LLM generates tool_use { query }
         │
         ▼
 validateInput()
 ├── Query validation (non-empty)
 └── Domain filter exclusivity check
         │
         ▼
 isEnabled() check
 ├── First-party: always enabled
 ├── Vertex: enabled for Claude 4 models
 └── Foundry: always enabled
         │
         ▼
 call() execution
 ├── Build search request
 ├── Execute search API call
 ├── Parse search results
 └── Format with sources
         │
         ▼
 Return { data: { results, ... } }
```

---

## 1. WebFetch Tool Definition

### WebFetchTool - URL content extraction

**What it does:** Fetches content from URLs, converts HTML to markdown, and optionally extracts specific information based on a prompt.

```javascript
// ============================================
// WebFetchTool - URL content fetching tool
// Location: chunks.143.mjs:1308-1384
// ============================================

// ORIGINAL (for source lookup):
    BX = {
        name: sO,
        searchHint: "fetch and extract content from a URL",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        async description(A) {
            let { url: q } = A;
            try {
                return `Claude wants to fetch content from ${new URL(q).hostname}`
            } catch {
                return "Claude wants to fetch content from this URL"
            }
        },
        userFacingName() {
            return "Fetch"
        },
        getToolUseSummary: pg8,
        getActivityDescription(A) {
            let q = pg8(A);
            return q ? `Fetching ${q}` : "Fetching web page"
        },
        isEnabled() {
            return !0
        },
        get inputSchema() {
            return hCY()
        },
        get outputSchema() {
            return SCY()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(A) {
            return A.url
        },
        async checkPermissions(A, q) {
            // Permission checking logic with preapproved hosts
            // ...
        }
        // ... more methods
    }

// READABLE (for understanding):
const WebFetchTool = {
    name: "WebFetch",
    searchHint: "fetch and extract content from a URL",
    maxResultSizeChars: 100000,
    shouldDefer: true,  // Deferred tool - loaded on demand

    async description(input) {
        try {
            return `Claude wants to fetch content from ${new URL(input.url).hostname}`;
        } catch {
            return "Claude wants to fetch content from this URL";
        }
    },

    userFacingName() {
        return "Fetch";
    },

    isEnabled() {
        return true;  // Always enabled
    },

    isConcurrencySafe() {
        return true;  // Multiple fetches can run in parallel
    },

    isReadOnly() {
        return true;  // Read-only operation
    },

    toAutoClassifierInput(input) {
        return input.url;  // URL used for auto-classification
    },

    async checkPermissions(input, context) {
        let permissionContext = context.getAppState().toolPermissionContext;
        try {
            let { url } = input;
            let parsedUrl = new URL(url);
            let hostname = parsedUrl.hostname;
            let pathname = parsedUrl.pathname;

            // Check preapproved hosts (eV1 list)
            for (let preapproved of PREAPPROVED_HOSTS) {
                if (preapproved.includes("/")) {
                    // Host and path match
                    let [host, ...pathParts] = preapproved.split("/");
                    let path = "/" + pathParts.join("/");
                    if (hostname === host && pathname.startsWith(path)) {
                        return {
                            behavior: "allow",
                            updatedInput: input,
                            decisionReason: {
                                type: "other",
                                reason: "Preapproved host and path"
                            }
                        };
                    }
                } else if (hostname === preapproved) {
                    return {
                        behavior: "allow",
                        updatedInput: input,
                        decisionReason: {
                            type: "other",
                            reason: "Preapproved host"
                        }
                    };
                }
            }
        } catch {}
        // Check permission rules...
    }
};

// Mapping: BX→WebFetchTool, sO→TOOL_NAME_WEB_FETCH, hCY→webFetchInputSchema, SCY→webFetchOutputSchema
```

---

## 2. WebSearch Tool Definition

### WebSearchTool - Web search capability

**What it does:** Performs web searches and returns formatted results with source links.

```javascript
// ============================================
// WebSearchTool - Web search tool definition
// Location: chunks.143.mjs:2393-2469
// ============================================

// ORIGINAL (for source lookup):
    lk1 = {
        name: jv,
        searchHint: "search the web for current information",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        async description(A) {
            return `Claude wants to search the web for: ${A.query}`
        },
        userFacingName() {
            return "Web Search"
        },
        getToolUseSummary: rg8,
        getActivityDescription(A) {
            let q = rg8(A);
            return q ? `Searching for ${q}` : "Searching the web"
        },
        isEnabled() {
            let A = QA(),
                q = cK();
            if (A === "firstParty") return !0;
            if (A === "vertex") return q.includes("claude-opus-4") || q.includes("claude-sonnet-4") || q.includes("claude-haiku-4");
            if (A === "foundry") return !0;
            return !1
        },
        get inputSchema() {
            return QCY()
        },
        get outputSchema() {
            return dCY()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(A) {
            return A.query
        },
        async checkPermissions(A) {
            return {
                behavior: "passthrough",
                message: "WebSearchTool requires permission.",
                suggestions: [{
                    type: "addRules",
                    rules: [{ toolName: jv }],
                    behavior: "allow",
                    destination: "localSettings"
                }]
            }
        },
        async validateInput(A) {
            let { query: q, allowed_domains: K, blocked_domains: Y } = A;
            if (!q.length) return {
                result: !1,
                message: "Error: Missing query",
                errorCode: 1
            };
            if (K?.length && Y?.length) return {
                result: !1,
                message: "Error: Cannot specify both allowed_domains and blocked_domains in the same request",
                errorCode: 2
            };
        }
    }

// READABLE (for understanding):
const WebSearchTool = {
    name: "WebSearch",
    searchHint: "search the web for current information",
    maxResultSizeChars: 100000,
    shouldDefer: true,  // Deferred tool

    async description(input) {
        return `Claude wants to search the web for: ${input.query}`;
    },

    userFacingName() {
        return "Web Search";
    },

    isEnabled() {
        let searchProvider = getSearchProvider();
        let currentModel = getCurrentModel();

        // First-party: always enabled
        if (searchProvider === "firstParty") return true;

        // Vertex: only enabled for Claude 4 models
        if (searchProvider === "vertex") {
            return currentModel.includes("claude-opus-4") ||
                   currentModel.includes("claude-sonnet-4") ||
                   currentModel.includes("claude-haiku-4");
        }

        // Foundry: always enabled
        if (searchProvider === "foundry") return true;

        return false;
    },

    isConcurrencySafe() {
        return true;  // Multiple searches can run in parallel
    },

    isReadOnly() {
        return true;
    },

    toAutoClassifierInput(input) {
        return input.query;
    },

    async checkPermissions(input) {
        return {
            behavior: "passthrough",
            message: "WebSearchTool requires permission.",
            suggestions: [{
                type: "addRules",
                rules: [{ toolName: "WebSearch" }],
                behavior: "allow",
                destination: "localSettings"
            }]
        };
    },

    async validateInput(input) {
        let { query, allowed_domains, blocked_domains } = input;

        if (!query.length) {
            return {
                result: false,
                message: "Error: Missing query",
                errorCode: 1
            };
        }

        // Cannot specify both allow and block lists
        if (allowed_domains?.length && blocked_domains?.length) {
            return {
                result: false,
                message: "Error: Cannot specify both allowed_domains and blocked_domains in the same request",
                errorCode: 2
            };
        }

        return { result: true };
    }
};

// Mapping: lk1→WebSearchTool, jv→TOOL_NAME_WEB_SEARCH, QCY→webSearchInputSchema, dCY→webSearchOutputSchema
```

---

## 3. isEnabled() Logic - WebSearch Provider Detection

**What it does:** Determines if WebSearch is available based on the search provider and model.

**How it works:**
1. `QA()` returns the search provider type:
   - `"firstParty"` - Anthropic's built-in search (always enabled)
   - `"vertex"` - Google Vertex AI (only for Claude 4 models)
   - `"foundry"` - Internal foundry (always enabled)

2. `cK()` returns the current model ID

**Why this approach:**
- First-party search is available to all users
- Vertex AI has different availability based on model capabilities
- Foundry is for internal testing/development

---

## 4. WebFetchTool call() Implementation

### WebFetchTool call() - Detailed Execution

**What it does:** Executes the HTTP fetch, handles redirects, converts content, and applies the prompt for extraction.

```javascript
// ============================================
// WebFetchTool.call() - Execution implementation
// Location: chunks.143.mjs:1439-1495
// ============================================

// ORIGINAL (for source lookup):
async call({
    url: A,
    prompt: q
}, {
    abortController: K,
    options: {
        isNonInteractiveSession: Y
    }
}) {
    let z = Date.now(),
        _ = await Bg8(A, K);
    if ("type" in _ && _.type === "redirect") {
        let W = _.statusCode === 301 ? "Moved Permanently" : _.statusCode === 308 ? "Permanent Redirect" : _.statusCode === 307 ? "Temporary Redirect" : "Found",
            Z = `REDIRECT DETECTED: The URL redirects to a different host.

Original URL: ${_.originalUrl}
Redirect URL: ${_.redirectUrl}
Status: ${_.statusCode} ${W}

To complete your request, I need to fetch content from the redirected URL. Please use WebFetch again with these parameters:
- url: "${_.redirectUrl}"
- prompt: "${q}"`;
        return {
            data: {
                bytes: Buffer.byteLength(Z),
                code: _.statusCode,
                codeText: W,
                result: Z,
                durationMs: Date.now() - z,
                url: A
            }
        }
    }
    let {
        content: w,
        bytes: O,
        code: $,
        codeText: H,
        contentType: j,
        persistedPath: J,
        persistedSize: M
    } = _, D = ug8(A), X;
    if (D && j.includes("text/markdown") && w.length < ol6) X = w;
    else X = await gg8(q, w, K.signal, Y, D);
    if (J) X += `

[Binary content (${j}, ${xq(M??O)}) also saved to ${J}]`;
    return {
        data: {
            bytes: O,
            code: $,
            codeText: H,
            result: X,
            durationMs: Date.now() - z,
            url: A
        }
    }
}

// READABLE (for understanding):
async call({ url, prompt }, { abortController, options }) {
    let startTime = Date.now();

    // Step 1: Execute HTTP fetch
    let fetchResult = await fetchUrl(url, abortController);

    // Step 2: Handle cross-host redirects
    if (fetchResult.type === "redirect") {
        // Generate redirect message instead of following automatically
        // This is a SECURITY measure to prevent redirect-based attacks
        let statusText = getHttpStatusText(fetchResult.statusCode);
        let redirectMessage = `REDIRECT DETECTED: The URL redirects to a different host.

Original URL: ${fetchResult.originalUrl}
Redirect URL: ${fetchResult.redirectUrl}
Status: ${fetchResult.statusCode} ${statusText}

To complete your request, I need to fetch content from the redirected URL.`;

        return {
            data: {
                bytes: Buffer.byteLength(redirectMessage),
                code: fetchResult.statusCode,
                codeText: statusText,
                result: redirectMessage,
                durationMs: Date.now() - startTime,
                url: url
            }
        };
    }

    // Step 3: Extract content from response
    let {
        content,
        bytes,
        code,
        codeText,
        contentType,
        persistedPath,   // For binary content
        persistedSize
    } = fetchResult;

    // Step 4: Check if URL is markdown-native (e.g., raw GitHub)
    let isMarkdownUrl = isMarkdownHost(url);

    // Step 5: Process content based on type
    let processedResult;
    if (isMarkdownUrl && contentType.includes("text/markdown") && content.length < MAX_RAW_MARKDOWN_SIZE) {
        // Use raw markdown without conversion
        processedResult = content;
    } else {
        // Convert HTML to markdown and apply prompt extraction
        processedResult = await extractWithPrompt(
            prompt,
            content,
            abortController.signal,
            options.isNonInteractiveSession,
            isMarkdownUrl
        );
    }

    // Step 6: Append binary content info if persisted
    if (persistedPath) {
        processedResult += `

[Binary content (${contentType}, ${formatBytes(persistedSize ?? bytes)}) also saved to ${persistedPath}]`;
    }

    return {
        data: {
            bytes: bytes,
            code: code,
            codeText: codeText,
            result: processedResult,
            durationMs: Date.now() - startTime,
            url: url
        }
    };
}

// Mapping: Bg8→fetchUrl, gg8→extractWithPrompt, ug8→isMarkdownHost, ol6→MAX_RAW_MARKDOWN_SIZE,
//          xq→formatBytes, K→abortController, Y→isNonInteractiveSession
```

**Why redirect handling is explicit:**
- Prevents redirect-based SSRF attacks
- Gives LLM visibility into where content originates
- Allows user to verify redirect destination
- Follows security best practice of not auto-following cross-host redirects

---

## 5. WebSearchTool call() Implementation

### WebSearchTool call() - Streaming Search Execution

**What it does:** Executes web search via the Claude API's built-in web search tool, streaming results as they arrive.

```javascript
// ============================================
// WebSearchTool.call() - Streaming search execution
// Location: chunks.143.mjs:2474-2560
// ============================================

// ORIGINAL (for source lookup):
async call(A, q, K, Y, z) {
    let _ = performance.now(),
        { query: w } = A,
        O = p1({ content: "Perform a web search for the query: " + w }),
        $ = cCY(A),
        H = w8("tengu_plum_vx3", !1),
        j = q.getAppState(),
        J = NT6({
            messages: [O],
            systemPrompt: uq(["You are an assistant for performing a web search tool use"]),
            thinkingConfig: H ? { type: "disabled" } : q.options.thinkingConfig,
            tools: [],
            signal: q.abortController.signal,
            options: {
                getToolPermissionContext: async () => j.toolPermissionContext,
                model: H ? lH() : q.options.mainLoopModel,
                toolChoice: H ? { type: "tool", name: "web_search" } : void 0,
                isNonInteractiveSession: q.options.isNonInteractiveSession,
                extraToolSchemas: [$],
                querySource: "web_search_tool",
                agents: q.options.agentDefinitions.activeAgents,
                mcpTools: [],
                agentId: q.agentId,
                effortValue: j.effortValue
            }
        }),
        M = [], D = null, X = "", P = 0, W = new Map;
    for await (let V of J) {
        if (M.push(V), V.type === "stream_event" && V.event?.type === "content_block_start") {
            let L = V.event.content_block;
            if (L && L.type === "server_tool_use") {
                D = L.id, X = "";
                continue
            }
        }
        if (D && V.type === "stream_event" && V.event?.type === "content_block_delta") {
            let L = V.event.delta;
            if (L?.type === "input_json_delta" && L.partial_json) {
                X += L.partial_json;
                try {
                    let h = X.match(/"query"\s*:\s*"((?:[^"\\]|\\.)*)"/);
                    if (h && h[1]) {
                        let R = i1('"' + h[1] + '"');
                        if (!W.has(D) || W.get(D) !== R) {
                            if (W.set(D, R), P++, z) z({
                                toolUseID: `search-progress-${P}`,
                                data: { type: "query_update", query: R }
                            })
                        }
                    }
                } catch {}
            }
        }
        // ... result processing
    }
}

// READABLE (for understanding):
async call(input, context, canUseTool, message, progressCallback) {
    let startTime = performance.now();
    let { query } = input;

    // Step 1: Create message for API call
    let userMessage = createUserMessage({
        content: "Perform a web search for the query: " + query
    });

    // Step 2: Build web_search tool schema for API
    let webSearchToolSchema = buildWebSearchSchema(input);

    // Step 3: Check for Plum (Vertex) optimization
    let usePlumOptimization = isFeatureEnabled("tengu_plum_vx3", false);

    // Step 4: Configure API call
    let apiConfig = {
        messages: [userMessage],
        systemPrompt: buildSystemPrompt(["You are an assistant for performing a web search tool use"]),
        thinkingConfig: usePlumOptimization ? { type: "disabled" } : context.options.thinkingConfig,
        tools: [],
        signal: context.abortController.signal,
        options: {
            getToolPermissionContext: async () => appState.toolPermissionContext,
            model: usePlumOptimization ? getVertexModel() : context.options.mainLoopModel,
            toolChoice: usePlumOptimization ? { type: "tool", name: "web_search" } : undefined,
            extraToolSchemas: [webSearchToolSchema],
            querySource: "web_search_tool"
        }
    };

    // Step 5: Stream API response
    let messages = [];
    let currentToolUseId = null;
    let partialJson = "";
    let progressCount = 0;
    let queryByToolUseId = new Map();

    for await (let event of streamApiMessages(apiConfig)) {
        messages.push(event);

        // Track tool use start
        if (event.type === "stream_event" && event.event?.type === "content_block_start") {
            let block = event.event.content_block;
            if (block?.type === "server_tool_use") {
                currentToolUseId = block.id;
                partialJson = "";
                continue;
            }
        }

        // Parse streaming JSON for query updates
        if (currentToolUseId && event.type === "stream_event" && event.event?.type === "content_block_delta") {
            let delta = event.event.delta;
            if (delta?.type === "input_json_delta" && delta.partial_json) {
                partialJson += delta.partial_json;

                // Extract query from partial JSON for progress updates
                try {
                    let queryMatch = partialJson.match(/"query"\s*:\s*"((?:[^"\\]|\\.)*)"/);
                    if (queryMatch && queryMatch[1]) {
                        let extractedQuery = JSON.parse('"' + queryMatch[1] + '"');

                        // Only emit progress if query changed
                        if (!queryByToolUseId.has(currentToolUseId) ||
                            queryByToolUseId.get(currentToolUseId) !== extractedQuery) {

                            queryByToolUseId.set(currentToolUseId, extractedQuery);
                            progressCount++;

                            if (progressCallback) {
                                progressCallback({
                                    toolUseID: `search-progress-${progressCount}`,
                                    data: { type: "query_update", query: extractedQuery }
                                });
                            }
                        }
                    }
                } catch { /* Ignore JSON parse errors during streaming */ }
            }
        }

        // Handle web search results
        if (event.type === "stream_event" && event.event?.type === "content_block_start") {
            let block = event.event.content_block;
            if (block?.type === "web_search_tool_result") {
                let toolUseId = block.tool_use_id;
                let searchQuery = queryByToolUseId.get(toolUseId) || query;
                let results = block.content;
                // ... process results
            }
        }
    }

    // Step 6: Build final result
    let durationSeconds = (performance.now() - startTime) / 1000;
    return {
        data: {
            query: query,
            results: processedResults,
            durationSeconds: durationSeconds
        }
    };
}

// Mapping: p1→createUserMessage, cCY→buildWebSearchSchema, NT6→streamApiMessages,
//          w8→isFeatureEnabled, uq→buildSystemPrompt, lH→getVertexModel,
//          z→progressCallback, i1→JSON.parse
```

**Key insight - Streaming progress updates:** The call() implementation streams the search query as it's being built, allowing the UI to show real-time progress. The query is extracted from partial JSON using regex matching, which is more resilient than full JSON parsing during streaming.

---

## 6. Output Schemas

### WebFetchTool Output Schema (SCY)

```javascript
// ============================================
// WebFetchTool output schema
// Location: chunks.143.mjs:1300-1307
// ============================================

// ORIGINAL (for source lookup):
SCY = F6(() => C.object({
    bytes: C.number().describe("Size of the fetched content in bytes"),
    code: C.number().describe("HTTP response code"),
    codeText: C.string().describe("HTTP response code text"),
    result: C.string().describe("Processed result from applying the prompt to the content"),
    durationMs: C.number().describe("Time taken to fetch and process the content"),
    url: C.string().describe("The URL that was fetched")
}));

// READABLE (for understanding):
const webFetchOutputSchema = z.object({
    bytes: z.number().describe("Size of the fetched content in bytes"),
    code: z.number().describe("HTTP response code"),
    codeText: z.string().describe("HTTP response code text"),
    result: z.string().describe("Processed result from applying the prompt to the content"),
    durationMs: z.number().describe("Time taken to fetch and process the content"),
    url: z.string().describe("The URL that was fetched")
});

// Mapping: SCY→webFetchOutputSchema, F6→lazySchema, C→zod
```

### WebSearchTool Output Schema (dCY)

```javascript
// ============================================
// WebSearchTool output schema
// Location: chunks.143.mjs:2388-2392
// ============================================

// ORIGINAL (for source lookup):
dCY = F6(() => C.object({
    query: C.string().describe("The search query that was executed"),
    results: C.array(C.union([UCY(), C.string()])).describe("Search results and/or text commentary from the model"),
    durationSeconds: C.number().describe("Time taken to complete the search operation")
}));

// UCY - Individual search result schema
UCY = F6(() => {
    let A = C.object({
        title: C.string().describe("The title of the search result"),
        url: C.string().describe("The URL of the search result")
    });
    return C.object({
        tool_use_id: C.string().describe("ID of the tool use"),
        content: C.array(A).describe("Array of search hits")
    })
});

// READABLE (for understanding):
const searchHitSchema = z.object({
    title: z.string().describe("The title of the search result"),
    url: z.string().describe("The URL of the search result")
});

const searchResultSchema = z.object({
    tool_use_id: z.string().describe("ID of the tool use"),
    content: z.array(searchHitSchema).describe("Array of search hits")
});

const webSearchOutputSchema = z.object({
    query: z.string().describe("The search query that was executed"),
    results: z.array(z.union([searchResultSchema, z.string()]))
        .describe("Search results and/or text commentary from the model"),
    durationSeconds: z.number().describe("Time taken to complete the search operation")
});

// Mapping: dCY→webSearchOutputSchema, UCY→searchResultSchema, F6→lazySchema
```

---

## 7. Preapproved Hosts (eV1)

### What It Does

The `eV1` constant defines hosts that are automatically allowed for WebFetch without requiring explicit permission. This reduces friction for commonly-used, safe domains.

**Host check algorithm:**
1. Parse URL to extract hostname and pathname
2. For each preapproved entry:
   - If entry contains `/`: match both hostname AND path prefix
   - Otherwise: match just the hostname

```javascript
// From checkPermissions (chunks.143.mjs:1355-1373)
for (let preapproved of eV1) {
    if (preapproved.includes("/")) {
        // Host + path preapproval (e.g., "docs.python.org/3/")
        let [host, ...pathParts] = preapproved.split("/");
        let path = "/" + pathParts.join("/");
        if (hostname === host && pathname.startsWith(path)) {
            return { behavior: "allow", ... };
        }
    } else if (hostname === preapproved) {
        // Host-only preapproval (e.g., "github.com")
        return { behavior: "allow", ... };
    }
}
```

**Why this approach:**
- Host-only preapproval is simpler but broader
- Path-based preapproval allows granular control
- Pattern matching is efficient (no regex needed)

---

## 8. Important Usage Rules

### CRITICAL: Source Attribution Required

Per system requirements:

1. **NEVER generate or guess URLs** unless confident they help with programming
2. **Only use URLs provided by the user** in their messages or local files
3. **ALWAYS include Sources section** when answering with web search results

### Required Output Format

```markdown
[Answer content here]

Sources:
- [Title 1](https://example.com/article1)
- [Title 2](https://example.com/article2)
```

---

## 9. Error Handling

### Common Error Cases

```javascript
// Invalid URL format
{ error: "Invalid URL: must be a valid HTTP or HTTPS URL" }

// Timeout
{ error: "Request timed out after 30 seconds" }

// Rate limiting
{ error: "Rate limit exceeded. Please wait before making more requests." }

// Content too large
{ content: "Content truncated due to size limits. First 50KB shown..." }
```

---

## 10. Key Properties

| Property | WebFetch | WebSearch |
|----------|----------|-----------|
| Purpose | Fetch specific URL content | Search the web |
| Input | URL + prompt | Query + domain filters |
| Output | Extracted content | Search results list |
| Timeout | 30 seconds | 30 seconds |
| Max content size | 50KB before truncation | N/A |
| Read-only | Yes | Yes |
| Concurrency safe | Yes | Yes |