# Browser Control Tool Catalog (Claude Code 2.1.76)

> Complete reference of all 17 MCP tools exposed by the `claude-in-chrome` server.
> Source: `CHROME_TOOLS` (Qe) in `chunks.166.mjs:3-457`

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key symbols in this document:
- `CHROME_TOOLS` (Qe) - Tool definitions array, `chunks.166.mjs:3-457`
- `tuA` - Init function that populates Qe, `chunks.166.mjs:3`

---

## Tool Summary Table

| # | Tool Name | Category | Required Params | Key Optional |
|---|-----------|----------|-----------------|--------------|
| 1 | `javascript_tool` | Execution | action, text, tabId | - |
| 2 | `read_page` | Observation | tabId | filter, depth, ref_id, max_chars |
| 3 | `find` | Observation | query, tabId | - |
| 4 | `form_input` | Interaction | ref, value, tabId | - |
| 5 | `computer` | Interaction | action, tabId | coordinate, text, duration, scroll_*, region, ref, modifiers, repeat |
| 6 | `navigate` | Navigation | url, tabId | - |
| 7 | `resize_window` | Navigation | width, height, tabId | - |
| 8 | `gif_creator` | Recording | action, tabId | download, filename, options |
| 9 | `upload_image` | Interaction | imageId, tabId | ref, coordinate, filename |
| 10 | `get_page_text` | Observation | tabId | - |
| 11 | `tabs_context_mcp` | Tab Mgmt | (none) | createIfEmpty |
| 12 | `tabs_create_mcp` | Tab Mgmt | (none) | - |
| 13 | `update_plan` | Workflow | domains, approach | - |
| 14 | `read_console_messages` | Debugging | tabId | onlyErrors, clear, pattern, limit |
| 15 | `read_network_requests` | Debugging | tabId | urlPattern, clear, limit |
| 16 | `shortcuts_list` | Automation | tabId | - |
| 17 | `shortcuts_execute` | Automation | tabId | shortcutId, command |
| (hidden) | `switch_browser` | Control | (none) | - (cloud bridge only) |

---

## Detailed Tool Specifications

### 1. `javascript_tool`

**Category:** Execution
**Description:** Execute JavaScript code in the context of the current page. Runs in the page's JavaScript environment with access to DOM, window, and page variables.

```json
{
  "action": "javascript_exec",    // required: must be exactly "javascript_exec"
  "text": "document.title",       // required: JS expression (no return statement!)
  "tabId": 123                    // required: from tabs_context_mcp
}
```

**Important:** Do NOT use `return` statements. Write the expression you want evaluated (e.g., `window.myData.value` not `return window.myData.value`).

---

### 2. `read_page`

**Category:** Observation
**Description:** Get an accessibility tree of page elements. Output limited to 50,000 chars by default.

```json
{
  "tabId": 123,
  "filter": "interactive",        // "interactive" | "all" (default: all)
  "depth": 5,                     // max tree depth (default: 15)
  "ref_id": "ref_42",             // focus on subtree of specific element
  "max_chars": 100000             // output character limit
}
```

**Use case:** When `read_page` output is too large, specify a smaller `depth` or use `ref_id` to focus on a specific section.

---

### 3. `find`

**Category:** Observation
**Description:** Natural language element search. Returns up to 20 matching elements with reference IDs usable in other tools.

```json
{
  "query": "search bar",          // required: natural language description
  "tabId": 123
}
```

**Examples:** `"login button"`, `"add to cart button"`, `"product title containing organic"`

---

### 4. `form_input`

**Category:** Interaction
**Description:** Set values in form elements using reference ID from `read_page` or `find`.

```json
{
  "ref": "ref_5",                 // required: from read_page or find
  "value": "hello@example.com",   // string | boolean | number
  "tabId": 123
}
```

**For checkboxes:** use boolean value. **For select:** use option value or visible text.

---

### 5. `computer`

**Category:** Interaction
**Description:** Mouse and keyboard automation. The primary tool for visual interaction.

**Actions:**

| Action | Description | Required Additional Params |
|--------|-------------|---------------------------|
| `left_click` | Click at coordinates | `coordinate: [x, y]` |
| `right_click` | Right-click (context menu) | `coordinate: [x, y]` |
| `double_click` | Double-click | `coordinate: [x, y]` |
| `triple_click` | Triple-click (select all text) | `coordinate: [x, y]` |
| `hover` | Move cursor (reveal tooltips) | `coordinate: [x, y]` or `ref` |
| `type` | Type text | `text: "hello world"` |
| `key` | Press keyboard keys | `text: "ctrl+a"`, optional `repeat` |
| `screenshot` | Capture screenshot | - |
| `zoom` | Capture region (closer look) | `region: [x0, y0, x1, y1]` |
| `scroll` | Scroll page | `coordinate`, `scroll_direction`, optional `scroll_amount` (1-10, default 3) |
| `scroll_to` | Scroll element into view | `ref` |
| `wait` | Wait N seconds | `duration` (0-30s) |
| `left_click_drag` | Drag from start to end | `start_coordinate`, `coordinate` |

**Key format for `key` action:** Space-separated keys, `cmd`/`ctrl` for modifier (e.g., `"cmd+a"`, `"Backspace Backspace"`)

**Modifier keys for clicks:** `ctrl`, `shift`, `alt`, `cmd`/`meta`, `win`/`windows`. Combinable with `+`.

```json
{
  "action": "screenshot",
  "tabId": 123
}
```

---

### 6. `navigate`

**Category:** Navigation
**Description:** Navigate to a URL or go forward/back in browser history.

```json
{
  "url": "https://example.com",  // URL, "forward", or "back"
  "tabId": 123
}
```

URL can be provided without protocol (defaults to `https://`).

---

### 7. `resize_window`

**Category:** Navigation
**Description:** Set browser window dimensions. Useful for responsive design testing.

```json
{
  "width": 1280,
  "height": 720,
  "tabId": 123
}
```

---

### 8. `gif_creator`

**Category:** Recording
**Description:** GIF recording management for browser automation sessions.

```json
{
  "action": "start_recording",   // "start_recording" | "stop_recording" | "export" | "clear"
  "tabId": 123,
  "download": true,              // export only: download in browser
  "filename": "login_flow.gif",  // export only: output filename
  "options": {
    "showClickIndicators": true,  // orange circles at click locations
    "showDragPaths": true,        // red arrows for drag actions
    "showActionLabels": true,     // black action description labels
    "showProgressBar": true,      // orange progress bar at bottom
    "showWatermark": true,        // Claude logo watermark
    "quality": 10                 // 1-30, lower = better quality (slower)
  }
}
```

**Usage pattern:**
1. `start_recording` → take screenshot (first frame)
2. Perform browser actions
3. Take screenshot before stop (last frame)
4. `stop_recording`
5. `export` with `download: true`

---

### 9. `upload_image`

**Category:** Interaction
**Description:** Upload a screenshot or user-uploaded image to a file input or drag & drop target.

```json
{
  "imageId": "screenshot-uuid",  // required: from computer screenshot or user upload
  "tabId": 123,
  "ref": "ref_12",               // for file inputs (especially hidden ones)
  "coordinate": [500, 300],      // for drag & drop targets (e.g., Google Docs)
  "filename": "image.png"        // optional custom filename
}
```

Provide either `ref` or `coordinate`, not both.

---

### 10. `get_page_text`

**Category:** Observation
**Description:** Extract raw text content from the page, prioritizing article content. Returns plain text without HTML.

```json
{
  "tabId": 123
}
```

**Use case:** Reading articles, blog posts, or text-heavy pages faster than parsing the accessibility tree.

---

### 11. `tabs_context_mcp`

**Category:** Tab Management
**Description:** Get context about the current MCP tab group. Returns all tab IDs in the group.

```json
{
  "createIfEmpty": true          // create new tab group if none exists
}
```

**CRITICAL:** Must be called at least once before any other browser tools. Provides the `tabId` values needed by all other tools.

---

### 12. `tabs_create_mcp`

**Category:** Tab Management
**Description:** Create a new empty tab in the MCP tab group.

```json
{}
```

**Usage:** Call after `tabs_context_mcp` when you need a fresh tab for the current conversation.

---

### 13. `update_plan`

**Category:** Workflow
**Description:** Present a plan to the user for approval before taking actions. Pre-approves listed domains.

```json
{
  "domains": ["github.com", "stackoverflow.com"],
  "approach": [
    "Search GitHub for issues matching the error",
    "Read the top 3 results",
    "Check Stack Overflow for similar solutions"
  ]
}
```

**Effect:** Sets permission mode to `follow_a_plan` with the specified `allowed_domains`.
Subsequent tool calls to approved domains skip permission prompts.

---

### 14. `read_console_messages`

**Category:** Debugging
**Description:** Read browser console messages (log, error, warn, etc.) from a tab.

```json
{
  "tabId": 123,
  "onlyErrors": false,            // true = only errors and exceptions
  "clear": true,                  // clear after reading (avoid duplicates)
  "pattern": "[MyApp]",           // regex filter (always use this!)
  "limit": 100                    // max messages (default: 100)
}
```

**Important:** Always use `pattern` to avoid overwhelming output.

---

### 15. `read_network_requests`

**Category:** Debugging
**Description:** Read HTTP network requests from a tab. Includes XHR, Fetch, documents, images.

```json
{
  "tabId": 123,
  "urlPattern": "/api/",          // filter by URL substring
  "clear": true,                  // clear after reading
  "limit": 100                    // max requests (default: 100)
}
```

**Note:** Requests are automatically cleared when the page navigates to a different domain.

---

### 16. `shortcuts_list`

**Category:** Automation
**Description:** List all available shortcuts and workflows defined in the extension.

```json
{
  "tabId": 123
}
```

Returns shortcuts with their IDs, commands, descriptions, and whether they are workflows.

---

### 17. `shortcuts_execute`

**Category:** Automation
**Description:** Execute a shortcut or workflow by ID or command name. Runs in a new sidepanel window. Returns immediately (does not wait for completion).

```json
{
  "tabId": 123,
  "shortcutId": "abc-123",        // preferred: specific ID from shortcuts_list
  "command": "debug"              // alternative: command name without leading slash
}
```

---

### `switch_browser` (Cloud Bridge Only)

**Category:** Control
**Description:** Switch which Chrome browser is used for automation. Broadcasts pairing request to all browsers with the extension installed. User clicks "Connect" in desired browser.

```json
{}
```

**Note:** Only available when using the cloud bridge (`bridgeConfig` present). Not shown in `tools/list` for local socket connections.

---

## Tool Usage Sequence

### Standard Browser Automation Flow

```
1. tabs_context_mcp            → Get tab IDs
2. navigate                    → Go to target URL
3. computer (screenshot)       → See current page state
4. read_page (filter: interactive) → Get interactive elements
5. find ("search box")         → Get specific element ref
6. form_input (ref, "query")   → Fill form
7. computer (left_click)       → Click submit
8. computer (screenshot)       → Verify result
```

### GIF Recording Flow

```
1. gif_creator (start_recording)
2. computer (screenshot)           → First frame
3. [automation actions...]
4. computer (screenshot)           → Last frame
5. gif_creator (stop_recording)
6. gif_creator (export, download: true)
```

### Permission Planning Flow

```
1. update_plan (domains, approach)  → User approves
2. [browser actions on approved domains without additional prompts]
```
