# WebFetch and WebSearch Tools - Deep Analysis (Claude Code 2.1.38)

> Complete analysis of web interaction tools: URL fetching, content extraction, and web search capabilities.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `WebFetchTool` - WebFetch tool definition - chunks.47.mjs
- `WebSearchTool` - WebSearch tool definition - chunks.46.mjs
- `fetchUrl` - URL fetching implementation
- `webSearch` - Search implementation
- `extractContent` - HTML to markdown conversion

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
 └── Query validation
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
// Location: chunks.47.mjs
// ============================================

// READABLE (for understanding):
const WebFetchTool = {
    name: "WebFetch",
    maxResultSizeChars: 100000,
    strict: true,
    isConcurrencySafe: true,
    isReadOnly: true,

    async description() {
        return "Fetches content from a specified URL and processes it using an AI model";
    },

    get inputSchema() {
        return z.strictObject({
            url: z.string().url()
                .describe("The URL to fetch content from"),

            prompt: z.string()
                .describe("The prompt to run on the fetched content. Describe what information you want to extract from the page.")
        });
    },

    get outputSchema() {
        return z.object({
            content: z.string()
                .describe("The extracted content from the URL based on the prompt"),
            url: z.string()
                .describe("The URL that was fetched"),
            statusCode: z.number()
                .describe("HTTP response status code")
        });
    },

    async call({ url, prompt }, context) {
        // Step 1: Fetch URL with timeout
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Claude Code (claude.com/claude-code)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            redirect: 'follow',
            signal: AbortSignal.timeout(30000)
        });

        // Step 2: Check response
        if (!response.ok) {
            return {
                data: {
                    content: `Failed to fetch URL: HTTP ${response.status}`,
                    url: url,
                    statusCode: response.status
                }
            };
        }

        // Step 3: Get content type
        let contentType = response.headers.get('content-type') || '';

        // Step 4: Read response body
        let rawContent = await response.text();

        // Step 5: Process based on content type
        let processedContent;
        if (contentType.includes('text/html')) {
            processedContent = htmlToMarkdown(rawContent);
        } else if (contentType.includes('application/json')) {
            processedContent = JSON.stringify(JSON.parse(rawContent), null, 2);
        } else {
            processedContent = rawContent;
        }

        // Step 6: Extract based on prompt
        let extractedContent = await extractWithPrompt(processedContent, prompt);

        return {
            data: {
                content: extractedContent,
                url: url,
                statusCode: response.status
            }
        };
    }
};
```

---

## 2. WebSearch Tool Definition

### WebSearchTool - Web search capability

**What it does:** Performs web searches and returns formatted results with source links.

```javascript
// ============================================
// WebSearchTool - Web search tool definition
// Location: chunks.46.mjs
// ============================================

// READABLE (for understanding):
const WebSearchTool = {
    name: "WebSearch",
    maxResultSizeChars: 50000,
    strict: true,
    isConcurrencySafe: true,
    isReadOnly: true,

    async description() {
        return "Search the web for current information";
    },

    get inputSchema() {
        return z.strictObject({
            query: z.string()
                .describe("The search query"),

            allowed_domains: z.array(z.string()).optional()
                .describe("Only include results from these domains"),

            blocked_domains: z.array(z.string()).optional()
                .describe("Exclude results from these domains")
        });
    },

    get outputSchema() {
        return z.object({
            results: z.array(z.object({
                title: z.string(),
                url: z.string().url(),
                snippet: z.string()
            })),
            query: z.string()
        });
    },

    async call({ query, allowed_domains, blocked_domains }, context) {
        // Build search parameters
        let searchParams = {
            query: query,
            max_results: 10
        };

        if (allowed_domains?.length) {
            searchParams.include_domains = allowed_domains;
        }

        if (blocked_domains?.length) {
            searchParams.exclude_domains = blocked_domains;
        }

        // Execute search via API
        let searchResponse = await executeSearch(searchParams);

        return {
            data: {
                results: searchResponse.results,
                query: query
            }
        };
    }
};
```

---

## 3. Important Usage Rules

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

## 4. Error Handling

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

## 5. Key Properties

| Property | WebFetch | WebSearch |
|----------|----------|-----------|
| Purpose | Fetch specific URL content | Search the web |
| Input | URL + prompt | Query + domain filters |
| Output | Extracted content | Search results list |
| Timeout | 30 seconds | 30 seconds |
| Max content size | 50KB before truncation | N/A |
| Read-only | Yes | Yes |
| Concurrency safe | Yes | Yes |