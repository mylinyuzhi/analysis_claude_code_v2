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

## 4. Important Usage Rules

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