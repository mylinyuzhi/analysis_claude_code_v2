# MCP Resources - Complete Analysis (Claude Code 2.1.76)

> Deep analysis of MCP resource discovery, reading, and integration with Claude Code.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - MCP Protocol section

---

## Overview

MCP Resources provide a way for MCP servers to expose files, data, or other content that can be read by Claude Code. Unlike tools (which perform actions), resources are read-only data sources.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      MCP RESOURCES SYSTEM                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  MCP Server                                                          │
│     │                                                                 │
│     ├─→ resources/list                                               │
│     │     └─→ Returns list of available resources                   │
│     │                                                                 │
│     ├─→ resources/read                                               │
│     │     └─→ Returns resource content                              │
│     │                                                                 │
│     └─→ resources/templates/list                                     │
│           └─→ Returns parameterized resource templates               │
│                                                                       │
│  Claude Code Integration                                             │
│     │                                                                 │
│     ├─→ Resource discovery on server connection                      │
│     ├─→ Resource → System reminder attachment                       │
│     └─→ @resource-name syntax for user invocation                   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Resource Discovery

### resources/list Method

Discovers all available resources from an MCP server:

```javascript
// Request
{
  "jsonrpc": "2.0",
  "method": "resources/list",
  "id": 1
}

// Response
{
  "jsonrpc": "2.0",
  "result": {
    "resources": [
      {
        "uri": "file:///path/to/file.txt",
        "name": "config-file",
        "description": "Application configuration",
        "mimeType": "text/plain"
      },
      {
        "uri": "database://schema",
        "name": "db-schema",
        "description": "Database schema",
        "mimeType": "application/json"
      }
    ]
  },
  "id": 1
}
```

### Resource Object Schema

```typescript
interface Resource {
  uri: string;          // Unique identifier
  name: string;         // Human-readable name
  description?: string; // What this resource contains
  mimeType?: string;    // Content type
}
```

---

## Resource Reading

### resources/read Method

Reads the content of a specific resource:

```javascript
// Request
{
  "jsonrpc": "2.0",
  "method": "resources/read",
  "params": {
    "uri": "file:///path/to/file.txt"
  },
  "id": 2
}

// Response
{
  "jsonrpc": "2.0",
  "result": {
    "contents": [
      {
        "uri": "file:///path/to/file.txt",
        "mimeType": "text/plain",
        "text": "File content here..."
      }
    ]
  },
  "id": 2
}
```

### Binary Resources

For binary content (images, PDFs, etc.):

```javascript
// Response with binary content
{
  "jsonrpc": "2.0",
  "result": {
    "contents": [
      {
        "uri": "image://chart.png",
        "mimeType": "image/png",
        "blob": "base64-encoded-data..."
      }
    ]
  },
  "id": 2
}
```

---

## Resource Templates

### Overview

Resource templates are parameterized resources that can generate resources dynamically:

```javascript
// templates/list response
{
  "resourceTemplates": [
    {
      "uriTemplate": "github://repos/{owner}/{repo}",
      "name": "github-repo",
      "description": "GitHub repository information",
      "mimeType": "application/json"
    }
  ]
}
```

### URI Template Resolution

```javascript
// User requests: @github-repo(owner="anthropic", repo="claude-code")
// Resolved to: github://repos/anthropic/claude-code
```

---

## Claude Code Integration

### Resource Discovery on Connect

When an MCP server connects:

```javascript
async function discoverMcpResources(mcpClient) {
  if (!mcpClient.capabilities?.resources) {
    return [];  // Server doesn't support resources
  }

  try {
    const response = await mcpClient.request({
      method: "resources/list"
    }, ResourceListSchema);

    return response.resources || [];
  } catch (error) {
    console.error("Failed to discover resources:", error);
    return [];
  }
}
```

### Resource → System Reminder

Resources can be injected as system reminder attachments:

```javascript
// Resource attachment format
{
  type: "mcp_resource",
  serverName: "sqlite",
  resourceUri: "database://schema",
  content: "...",
  mimeType: "application/json"
}
```

### @-Mention Syntax

Users can reference resources using @-mentions:

```
@sqlite/db-schema
```

This triggers:
1. Resource lookup by name
2. `resources/read` call to MCP server
3. Content injection into conversation

---

## Implementation Details

### Resource Registry

```javascript
// Resource registry in session state
{
  mcp: {
    resources: {
      "sqlite": [
        { uri: "db://schema", name: "schema", ... },
        { uri: "db://tables", name: "tables", ... }
      ],
      "github": [
        { uri: "github://repos/...", name: "repo", ... }
      ]
    }
  }
}
```

### Resource Caching

```javascript
// Resource content is cached to avoid repeated reads
const resourceCache = new Map<string, {
  content: string;
  mimeType: string;
  timestamp: number;
}>();

// Cache TTL: 5 minutes
const CACHE_TTL = 5 * 60 * 1000;

async function readResourceWithCache(uri, serverName) {
  const cacheKey = `${serverName}:${uri}`;
  const cached = resourceCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached;
  }

  const content = await readResourceFromServer(uri, serverName);
  resourceCache.set(cacheKey, {
    ...content,
    timestamp: Date.now()
  });

  return content;
}
```

---

## Resource Change Notifications

### resources/subscribe

Subscribe to resource change notifications:

```javascript
// Subscribe to resource changes
{
  "jsonrpc": "2.0",
  "method": "resources/subscribe",
  "params": {
    "uri": "file:///path/to/file.txt"
  },
  "id": 3
}
```

### notifications/resources/updated

Server sends notification when resource changes:

```javascript
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/updated",
  "params": {
    "uri": "file:///path/to/file.txt"
  }
}
```

### Handling Updates

```javascript
// On resource update notification
mcpClient.on("notifications/resources/updated", async (params) => {
  // Invalidate cache
  resourceCache.delete(`${serverName}:${params.uri}`);

  // Optionally re-read and inject as attachment
  if (isResourceInUse(params.uri)) {
    const content = await readResourceFromServer(params.uri, serverName);
    injectResourceAttachment(content);
  }
});
```

---

## Quick Reference

### MCP Methods

| Method | Purpose |
|--------|---------|
| `resources/list` | List available resources |
| `resources/read` | Read resource content |
| `resources/subscribe` | Subscribe to changes |
| `resources/unsubscribe` | Unsubscribe from changes |
| `resources/templates/list` | List resource templates |

### Resource Content Types

| mimeType | Handling |
|----------|----------|
| `text/*` | Direct text injection |
| `application/json` | Parsed and formatted |
| `image/*` | Base64 blob, saved to temp file |
| `application/pdf` | Base64 blob, PDF extraction |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Binary content saved to disk |
| 2.1.72 | Resource templates |
| 2.1.0 | Initial resource support |