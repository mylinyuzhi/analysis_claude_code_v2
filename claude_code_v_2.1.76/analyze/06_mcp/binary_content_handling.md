# MCP Binary Content Handling (Claude Code 2.1.76)

> Analysis of binary content handling in MCP tool responses - PDFs, images, audio files saved to disk.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP section)

---

## Overview

MCP tools can return binary content (PDFs, images, audio) which requires special handling. Binary content is saved to temporary files on disk rather than being passed directly in the conversation.

---

## Binary Content Types

| MIME Type | Extension | Handling |
|-----------|-----------|----------|
| `application/pdf` | `.pdf` | Save to temp, return path |
| `image/png` | `.png` | Save to temp, return path |
| `image/jpeg` | `.jpg` | Save to temp, return path |
| `audio/wav` | `.wav` | Save to temp, return path |
| `audio/mpeg` | `.mp3` | Save to temp, return path |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                  BINARY CONTENT HANDLING FLOW                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  MCP Tool Execution                                                  │
│       │                                                               │
│       ▼                                                               │
│  Tool Result Contains Binary Content                                 │
│       │                                                               │
│       ├─→ Check content type                                         │
│       │     └─→ MIME type indicates binary                          │
│       │                                                               │
│       ├─→ Generate temp file path                                    │
│       │     └─→ /tmp/claude-mcp-<id>.<ext>                          │
│       │                                                               │
│       ├─→ Write binary to disk                                       │
│       │     └─→ Write file with proper encoding                     │
│       │                                                               │
│       └─→ Return path reference                                      │
│             └─→ "Binary content saved to: /tmp/..."                  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Response Format

### Binary Content Response

```javascript
// MCP tool returns binary content
{
    content: [
        {
            type: "resource",
            resource: {
                mimeType: "application/pdf",
                blob: "base64-encoded-content..."
            }
        }
    ]
}

// Transformed to file reference
{
    data: [
        {
            type: "text",
            text: "Binary content (PDF) saved to: /tmp/claude-mcp-abc123.pdf"
        }
    ]
}
```

---

## Implementation Details

### Content Detection

```javascript
// ============================================
// Binary content detection and handling
// ============================================

function isBinaryContent(content) {
    return content.type === "resource" &&
        content.resource?.blob !== undefined &&
        isBinaryMimeType(content.resource.mimeType);
}

function isBinaryMimeType(mimeType) {
    const binaryPrefixes = [
        "application/pdf",
        "image/",
        "audio/",
        "video/",
        "application/octet-stream"
    ];
    return binaryPrefixes.some(prefix => mimeType.startsWith(prefix));
}
```

### File Saving

```javascript
// ============================================
// Save binary content to temp file
// ============================================

async function saveBinaryContent(blob, mimeType) {
    const extension = getExtensionForMimeType(mimeType);
    const tempDir = "/tmp";
    const fileName = `claude-mcp-${generateId()}.${extension}`;
    const filePath = path.join(tempDir, fileName);

    // Decode base64 and write to file
    const buffer = Buffer.from(blob, "base64");
    await fs.writeFile(filePath, buffer);

    return filePath;
}
```

---

## Integration Points

### MCP Tool Execution

Binary handling is integrated into the MCP tool execution pipeline:

```javascript
// In executeMcpToolCall
const result = await client.request({
    method: "tools/call",
    params: { name: toolName, arguments: args }
});

// Process result content
for (const content of result.content) {
    if (isBinaryContent(content)) {
        const filePath = await saveBinaryContent(
            content.resource.blob,
            content.resource.mimeType
        );
        // Replace with file reference
        content.text = formatBinaryReference(filePath, content.resource.mimeType);
    }
}
```

---

## User Experience

### Display Format

```
Tool result:
┌─────────────────────────────────────────────┐
│ Binary content (PDF) saved to:              │
│ /tmp/claude-mcp-abc123.pdf                  │
│                                             │
│ You can read this file with the Read tool.  │
└─────────────────────────────────────────────┘
```

---

## Quick Reference

### Supported Binary Types

| Category | MIME Types |
|----------|------------|
| Documents | `application/pdf` |
| Images | `image/png`, `image/jpeg`, `image/gif`, `image/webp` |
| Audio | `audio/wav`, `audio/mpeg`, `audio/ogg`, `audio/webm` |
| Video | `video/mp4`, `video/webm` |
| Generic | `application/octet-stream` |

### Temp File Pattern

```
/tmp/claude-mcp-<random-id>.<extension>
```

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Initial binary content handling |