# Chrome/Browser Integration (2.1.7)

> **NEW in 2.0.72** - "Claude in Chrome" browser automation feature
> Uses Chrome extension + MCP tools for browser control

---

## Overview

The Chrome integration allows Claude Code to:
- Click elements on web pages
- Fill forms
- Capture screenshots
- Read console logs
- Navigate sites
- Manage browser tabs
- Execute JavaScript in page context
- Record GIF animations of interactions
- Monitor network requests

This is implemented as a **skill** that enables MCP-based browser automation tools.

---

## Architecture

### Three-Process Model

The browser automation uses a three-process architecture for communication:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           Claude Code CLI                                   │
│                        (Main Process)                                       │
│                                                                             │
│  ┌──────────────────┐    ┌─────────────────────────────┐                   │
│  │ /claude-in-chrome│    │ mcp__claude-in-chrome__*    │                   │
│  │      Skill       │───>│         MCP Tools           │                   │
│  └──────────────────┘    └─────────────────────────────┘                   │
│                                    │                                        │
│                          ┌─────────┴─────────┐                              │
│                          │   SocketClient    │                              │
│                          │      (AZ9)        │                              │
│                          └─────────┬─────────┘                              │
└────────────────────────────────────│────────────────────────────────────────┘
                                     │
                          Socket IPC │ (Unix domain socket / Windows named pipe)
                                     │
┌────────────────────────────────────│────────────────────────────────────────┐
│                                    v                                        │
│                     Native Host Bridge Server                               │
│                     (--chrome-native-host flag)                             │
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   StdinReader   │───>│ NativeHostServer│<──>│   MCP Clients   │         │
│  │     (BI9)       │    │     (QI9)       │    │   (via socket)  │         │
│  └─────────────────┘    └────────┬────────┘    └─────────────────┘         │
└──────────────────────────────────│──────────────────────────────────────────┘
                                   │
                    Native Messaging│ (stdin/stdout, 4-byte length prefix)
                                   │
                          ┌────────v────────┐
                          │ Chrome Extension │
                          │ (claude-in-chrome)│
                          └────────┬────────┘
                                   │
                                   v
                          ┌──────────────────┐
                          │  Chrome Browser  │
                          │   (Web Pages)    │
                          └──────────────────┘
```

### Communication Flow

1. **Claude Code CLI** invokes MCP tool via skill
2. **SocketClient** (`AZ9`) sends request to Native Host Bridge via socket
3. **NativeHostServer** (`QI9`) receives request and forwards via Native Messaging
4. **Chrome Extension** receives request, executes action, returns result
5. Response flows back through the same path

### Message Format

All socket communication uses a **4-byte little-endian length prefix** followed by JSON payload:

```
┌──────────────────┬────────────────────────────────────┐
│ Length (4 bytes) │ JSON Payload (variable length)     │
│ Little-Endian    │ UTF-8 encoded                      │
└──────────────────┴────────────────────────────────────┘
```

---

## Skill Definition

```javascript
// ============================================
// registerClaudeInChromeSkill - Skill registration
// Location: chunks.149.mjs:2633-2654
// ============================================

// ORIGINAL (for source lookup):
function TI9() {
  sz1({
    name: "claude-in-chrome",
    description: "Automates your Chrome browser to interact with web pages - clicking elements, filling forms, capturing screenshots, reading console logs, and navigating sites. Opens pages in new tabs within your existing Chrome session. Requires site-level permissions before executing (configured in the extension).",
    whenToUse: "When the user wants to interact with web pages, automate browser tasks, capture screenshots, read console logs, or perform any browser-based actions. Always invoke BEFORE attempting to use any mcp__claude-in-chrome__* tools.",
    allowedTools: Vq7,
    userInvocable: !0,
    isEnabled: () => I$A(),
    async getPromptForCommand(A) {
      ...
    }
  })
}

// READABLE (for understanding):
function registerClaudeInChromeSkill() {
  registerSkill({
    name: "claude-in-chrome",
    description: "Automates your Chrome browser to interact with web pages...",
    whenToUse: "When the user wants to interact with web pages...",
    allowedTools: CHROME_MCP_TOOLS,
    userInvocable: true,
    isEnabled: () => isClaudeInChromeEnabled(),
    async getPromptForCommand(args) { ... }
  });
}

// Mapping: TI9→registerClaudeInChromeSkill, sz1→registerSkill, Vq7→CHROME_MCP_TOOLS, I$A→isClaudeInChromeEnabled
```

---

## Skill Prompt

```javascript
// ============================================
// chromeSkillPrompt - Skill activation prompt
// Location: chunks.149.mjs:2658-2662
// ============================================

// ORIGINAL:
Fq7 = `
Now that this skill is invoked, you have access to Chrome browser automation tools. You can now use the mcp__claude-in-chrome__* tools to interact with web pages.

IMPORTANT: Start by calling mcp__claude-in-chrome__tabs_context_mcp to get information about the user's current browser tabs.
`

// READABLE:
chromeSkillPrompt = `
Now that this skill is invoked, you have access to Chrome browser automation tools...
IMPORTANT: Start by calling mcp__claude-in-chrome__tabs_context_mcp...
`

// Mapping: Fq7→chromeSkillPrompt
```

---

## MCP Tools (Complete List - 18 Tools)

All tools are defined in `Pe` array (chunks.145.mjs:4-445).

### Tab Management

#### tabs_context_mcp

```javascript
// ============================================
// tabs_context_mcp - Get tab group info
// Location: chunks.145.mjs:312-324
// ============================================

{
  name: "tabs_context_mcp",
  title: "Tabs Context",
  description: "Get context information about the current MCP tab group. Returns all tab IDs inside the group if it exists. CRITICAL: You must get the context at least once before using other browser automation tools so you know what tabs exist. Each new conversation should create its own new tab (using tabs_create_mcp) rather than reusing existing tabs, unless the user explicitly asks to use an existing tab.",
  inputSchema: {
    type: "object",
    properties: {
      createIfEmpty: {
        type: "boolean",
        description: "Creates a new MCP tab group if none exists"
      }
    },
    required: []
  }
}
```

#### tabs_create_mcp

```javascript
// ============================================
// tabs_create_mcp - Create new tab
// Location: chunks.145.mjs:325-333
// ============================================

{
  name: "tabs_create_mcp",
  title: "Tabs Create",
  description: "Creates a new empty tab in the MCP tab group. CRITICAL: You must get the context using tabs_context_mcp at least once before using other browser automation tools.",
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  }
}
```

### Navigation & Window

#### navigate

```javascript
// ============================================
// navigate - URL navigation
// Location: chunks.145.mjs:173-188
// ============================================

{
  name: "navigate",
  description: "Navigate to a URL, or go forward/back in browser history.",
  inputSchema: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: 'URL to navigate to. Can use "forward" or "back" for history navigation.'
      },
      tabId: {
        type: "number",
        description: "Tab ID to navigate. Must be in current group."
      }
    },
    required: ["url", "tabId"]
  }
}
```

#### resize_window

```javascript
// ============================================
// resize_window - Browser window resizing
// Location: chunks.145.mjs:190-209
// ============================================

{
  name: "resize_window",
  description: "Resize the current browser window to specified dimensions. Useful for testing responsive designs.",
  inputSchema: {
    type: "object",
    properties: {
      width: { type: "number", description: "Target window width in pixels" },
      height: { type: "number", description: "Target window height in pixels" },
      tabId: { type: "number", description: "Tab ID to get window for" }
    },
    required: ["width", "height", "tabId"]
  }
}
```

### Page Interaction

#### computer

```javascript
// ============================================
// computer - Mouse and keyboard control
// Location: chunks.145.mjs:90-171
// ============================================

{
  name: "computer",
  description: "Use a mouse and keyboard to interact with a web browser, and take screenshots.",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: [
          "left_click",      // Click left mouse button
          "right_click",     // Open context menus
          "double_click",    // Double-click
          "triple_click",    // Triple-click (select paragraph)
          "type",            // Type text
          "screenshot",      // Take screenshot
          "wait",            // Wait for seconds (max 30)
          "scroll",          // Scroll direction
          "key",             // Press keyboard key
          "left_click_drag", // Drag from start to end
          "zoom",            // Capture region screenshot
          "scroll_to",       // Scroll element into view
          "hover"            // Move cursor without click
        ]
      },
      coordinate: {
        type: "array",
        items: { type: "number" },
        minItems: 2, maxItems: 2,
        description: "(x, y) coordinates for click/scroll actions"
      },
      text: {
        type: "string",
        description: "Text to type or key(s) to press (space-separated)"
      },
      duration: {
        type: "number",
        minimum: 0, maximum: 30,
        description: "Seconds to wait (for 'wait' action)"
      },
      scroll_direction: {
        type: "string",
        enum: ["up", "down", "left", "right"]
      },
      scroll_amount: {
        type: "number",
        minimum: 1, maximum: 10,
        description: "Scroll wheel ticks (default: 3)"
      },
      start_coordinate: {
        type: "array",
        description: "Starting coordinates for left_click_drag"
      },
      region: {
        type: "array",
        minItems: 4, maxItems: 4,
        description: "(x0, y0, x1, y1) rectangle for 'zoom' action"
      },
      repeat: {
        type: "number",
        minimum: 1, maximum: 100,
        description: "Repeat count for 'key' action"
      },
      ref: {
        type: "string",
        description: "Element reference ID for scroll_to or click"
      },
      modifiers: {
        type: "string",
        description: 'Modifier keys: "ctrl", "shift", "alt", "cmd", combinable with "+"'
      },
      tabId: { type: "number" }
    },
    required: ["action", "tabId"]
  }
}
```

#### read_page

```javascript
// ============================================
// read_page - Accessibility tree extraction
// Location: chunks.145.mjs:26-51
// ============================================

{
  name: "read_page",
  description: "Get an accessibility tree representation of elements on the page. Output limited to 50000 characters.",
  inputSchema: {
    type: "object",
    properties: {
      filter: {
        type: "string",
        enum: ["interactive", "all"],
        description: '"interactive" for buttons/links/inputs, "all" for all elements'
      },
      tabId: { type: "number" },
      depth: {
        type: "number",
        description: "Maximum tree depth (default: 15)"
      },
      ref_id: {
        type: "string",
        description: "Reference ID of parent element to focus on"
      }
    },
    required: ["tabId"]
  }
}
```

#### find

```javascript
// ============================================
// find - Natural language element search
// Location: chunks.145.mjs:52-67
// ============================================

{
  name: "find",
  description: "Find elements using natural language. Returns up to 20 matching elements with references.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: 'Natural language query, e.g., "search bar", "add to cart button"'
      },
      tabId: { type: "number" }
    },
    required: ["query", "tabId"]
  }
}
```

#### form_input

```javascript
// ============================================
// form_input - Set form field values
// Location: chunks.145.mjs:68-88
// ============================================

{
  name: "form_input",
  description: "Set values in form elements using element reference ID from read_page tool.",
  inputSchema: {
    type: "object",
    properties: {
      ref: {
        type: "string",
        description: 'Element reference ID (e.g., "ref_1", "ref_2")'
      },
      value: {
        type: ["string", "boolean", "number"],
        description: "Value to set. Boolean for checkboxes, string for text inputs."
      },
      tabId: { type: "number" }
    },
    required: ["ref", "value", "tabId"]
  }
}
```

#### get_page_text

```javascript
// ============================================
// get_page_text - Extract page text content
// Location: chunks.145.mjs:299-310
// ============================================

{
  name: "get_page_text",
  description: "Extract raw text content from the page, prioritizing article content. Returns plain text without HTML.",
  inputSchema: {
    type: "object",
    properties: {
      tabId: { type: "number" }
    },
    required: ["tabId"]
  }
}
```

### JavaScript Execution

#### javascript_tool

```javascript
// ============================================
// javascript_tool - Execute JS in page context
// Location: chunks.145.mjs:5-24
// ============================================

{
  name: "javascript_tool",
  description: "Execute JavaScript code in the context of the current page. Code runs in page context and can interact with DOM, window object, and page variables.",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        description: "Must be set to 'javascript_exec'"
      },
      text: {
        type: "string",
        description: "JavaScript code to execute. Do NOT use 'return' statements - just write the expression."
      },
      tabId: { type: "number" }
    },
    required: ["action", "text", "tabId"]
  }
}
```

### Debugging

#### read_console_messages

```javascript
// ============================================
// read_console_messages - Read browser console
// Location: chunks.145.mjs:358-385
// ============================================

{
  name: "read_console_messages",
  description: "Read browser console messages (console.log, console.error, etc.). Returns messages from current domain only.",
  inputSchema: {
    type: "object",
    properties: {
      tabId: { type: "number" },
      onlyErrors: {
        type: "boolean",
        description: "If true, only return error/exception messages"
      },
      clear: {
        type: "boolean",
        description: "If true, clear messages after reading"
      },
      pattern: {
        type: "string",
        description: "Regex pattern to filter messages. ALWAYS provide to avoid verbose output."
      },
      limit: {
        type: "number",
        description: "Max messages to return (default: 100)"
      }
    },
    required: ["tabId"]
  }
}
```

#### read_network_requests

```javascript
// ============================================
// read_network_requests - Monitor HTTP requests
// Location: chunks.145.mjs:387-410
// ============================================

{
  name: "read_network_requests",
  description: "Read HTTP network requests (XHR, Fetch, documents, images). Requests cleared on domain navigation.",
  inputSchema: {
    type: "object",
    properties: {
      tabId: { type: "number" },
      urlPattern: {
        type: "string",
        description: "URL pattern to filter requests (e.g., '/api/')"
      },
      clear: {
        type: "boolean",
        description: "Clear requests after reading"
      },
      limit: {
        type: "number",
        description: "Max requests to return (default: 100)"
      }
    },
    required: ["tabId"]
  }
}
```

### Advanced Features

#### gif_creator

```javascript
// ============================================
// gif_creator - Record and export GIF animations
// Location: chunks.145.mjs:211-265
// ============================================

{
  name: "gif_creator",
  description: "Manage GIF recording for browser automation sessions. Control recording, then export with visual overlays.",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["start_recording", "stop_recording", "export", "clear"]
      },
      tabId: { type: "number" },
      download: {
        type: "boolean",
        description: "Set to true for 'export' action to download GIF"
      },
      filename: {
        type: "string",
        description: "Optional filename (default: 'recording-[timestamp].gif')"
      },
      options: {
        type: "object",
        properties: {
          showClickIndicators: { type: "boolean", description: "Orange circles at clicks (default: true)" },
          showDragPaths: { type: "boolean", description: "Red arrows for drags (default: true)" },
          showActionLabels: { type: "boolean", description: "Black action labels (default: true)" },
          showProgressBar: { type: "boolean", description: "Orange progress bar (default: true)" },
          showWatermark: { type: "boolean", description: "Claude logo watermark (default: true)" },
          quality: { type: "number", description: "1-30, lower = better quality (default: 10)" }
        }
      }
    },
    required: ["action", "tabId"]
  }
}
```

#### upload_image

```javascript
// ============================================
// upload_image - Upload images to pages
// Location: chunks.145.mjs:267-297
// ============================================

{
  name: "upload_image",
  description: "Upload a captured screenshot or user image to a file input or drag & drop target.",
  inputSchema: {
    type: "object",
    properties: {
      imageId: {
        type: "string",
        description: "ID of previously captured screenshot or user-uploaded image"
      },
      ref: {
        type: "string",
        description: "Element reference ID for file inputs"
      },
      coordinate: {
        type: "array",
        description: "[x, y] for drag & drop targets"
      },
      tabId: { type: "number" },
      filename: {
        type: "string",
        description: 'Optional filename (default: "image.png")'
      }
    },
    required: ["imageId", "tabId"]
  }
}
```

#### update_plan

```javascript
// ============================================
// update_plan - Plan approval for domain access
// Location: chunks.145.mjs:335-356
// ============================================

{
  name: "update_plan",
  description: "Present a plan to user for approval before taking actions. Approved domains won't need additional permission prompts.",
  inputSchema: {
    type: "object",
    properties: {
      domains: {
        type: "array",
        items: { type: "string" },
        description: "List of domains to visit (e.g., ['github.com', 'stackoverflow.com'])"
      },
      approach: {
        type: "array",
        items: { type: "string" },
        description: "High-level description of what you will do (3-7 items)"
      }
    },
    required: ["domains", "approach"]
  }
}
```

### Shortcuts & Workflows

#### shortcuts_list

```javascript
// ============================================
// shortcuts_list - List available shortcuts
// Location: chunks.145.mjs:412-423
// ============================================

{
  name: "shortcuts_list",
  description: "List all available shortcuts and workflows. Use shortcuts_execute to run a shortcut.",
  inputSchema: {
    type: "object",
    properties: {
      tabId: { type: "number" }
    },
    required: ["tabId"]
  }
}
```

#### shortcuts_execute

```javascript
// ============================================
// shortcuts_execute - Execute shortcuts
// Location: chunks.145.mjs:425-444
// ============================================

{
  name: "shortcuts_execute",
  description: "Execute a shortcut/workflow in a new sidepanel window. Returns immediately, does not wait for completion.",
  inputSchema: {
    type: "object",
    properties: {
      tabId: { type: "number" },
      shortcutId: {
        type: "string",
        description: "ID of shortcut to execute"
      },
      command: {
        type: "string",
        description: "Command name (e.g., 'debug', 'summarize'). No leading slash."
      }
    },
    required: ["tabId"]
  }
}
```

---

## Native Host Bridge

### SocketClient (AZ9)

Manages socket connection from Claude Code CLI to Native Host Bridge.

```javascript
// ============================================
// SocketClient - MCP client socket connection
// Location: chunks.145.mjs:787-970
// ============================================

// ORIGINAL (for source lookup):
class AZ9 {
  socket = null;
  connected = !1;
  connecting = !1;
  responseCallback = null;
  notificationHandler = null;
  responseBuffer = Buffer.alloc(0);
  reconnectAttempts = 0;
  maxReconnectAttempts = 10;
  reconnectDelay = 1000;

  async connect() {
    let B = this.context.socketPath;
    await this.validateSocketSecurity(B);
    this.socket = QH7(B);  // createConnection
    // ... event handlers
  }

  async ensureConnected() {
    if (this.connected && this.socket) return !0;
    if (!this.socket && !this.connecting) await this.connect();
    return new Promise((Q, B) => {
      let G = setTimeout(() => {
        B(new z8A(`Connection attempt timed out after 5000ms`))
      }, 5000);
      // ... polling for connection
    })
  }

  async callTool(A, Q) {
    let B = {
      method: "execute_tool",
      params: { client_id: this.context.clientTypeId, tool: A, args: Q }
    };
    return this.sendRequestWithRetry(B)
  }

  async validateSocketSecurity(A) {
    // Skip on Windows
    if (AH7() === "win32") return;
    let G = await eF7.stat(A);
    let Z = G.mode & 511;
    if (Z !== 384) throw Error(`Insecure socket permissions: ${Z.toString(8)} (expected 0600)`);
    // Verify ownership matches current user
  }
}

// READABLE (for understanding):
class SocketClient {
  socket = null;
  connected = false;
  reconnectAttempts = 0;
  maxReconnectAttempts = 10;  // Exponential backoff, max 10 attempts
  reconnectDelay = 1000;       // Initial 1 second, up to 30 seconds

  async connect() {
    const socketPath = this.context.socketPath;
    await this.validateSocketSecurity(socketPath);
    this.socket = createConnection(socketPath);
    // ... setup event handlers for connect, data, error, close
  }

  async ensureConnected() {
    // Returns true if connected, otherwise waits up to 5 seconds
  }

  async callTool(toolName, args) {
    // Sends tool request via socket with retry logic
  }

  async validateSocketSecurity(path) {
    // Verify socket permissions are 0600 (owner read/write only)
    // Verify socket owned by current user
  }
}

// Mapping: AZ9→SocketClient, QH7→createConnection, z8A→SocketConnectionError
```

**Key Features:**
- **Connection timeout**: 5000ms
- **Reconnection**: Exponential backoff, up to 10 attempts, max 30 second delay
- **Security validation**: Checks socket permissions (0600) and ownership

### NativeHostServer (QI9)

Socket server that listens for MCP client connections and bridges to Chrome extension.

```javascript
// ============================================
// NativeHostServer - Socket server for MCP clients
// Location: chunks.157.mjs:1679-1816
// ============================================

// ORIGINAL (for source lookup):
class QI9 {
  mcpClients = new Map;
  nextClientId = 1;
  server = null;
  running = !1;

  async start() {
    let A = sfA();  // getSocketPath()
    FW(`Creating socket listener: ${A}`);
    if (tP0() !== "win32" && sX9(A)) {
      if (RU7(A).isSocket()) tX9(A);  // Remove existing socket
    }
    this.server = OU7((Q) => this.handleMcpClient(Q));  // createServer
    await new Promise((Q, B) => {
      this.server.listen(A, () => {
        if (tP0() !== "win32") MU7(A, 384);  // chmod 0600
        this.running = !0;
        Q();
      });
    });
  }

  async handleMessage(A) {
    let Q = AQ(A);  // JSON.parse
    switch (Q.type) {
      case "ping":
        C$A(eA({ type: "pong", timestamp: Date.now() }));
        break;
      case "get_status":
        C$A(eA({ type: "status_response", native_host_version: jU7 }));
        break;
      case "tool_response":
        // Forward to all MCP clients
        for (let [X, I] of this.mcpClients) I.socket.write(responseBuffer);
        break;
      case "notification":
        // Forward notifications to MCP clients
        break;
    }
  }

  handleMcpClient(A) {
    let Q = this.nextClientId++;
    this.mcpClients.set(Q, { id: Q, socket: A, buffer: Buffer.alloc(0) });
    C$A(eA({ type: "mcp_connected" }));

    A.on("data", (G) => {
      // Buffer and parse messages with 4-byte length prefix
      // Forward tool requests to Chrome extension via stdout
    });
  }
}

// READABLE (for understanding):
class NativeHostServer {
  mcpClients = new Map();  // Connected MCP clients
  nextClientId = 1;

  async start() {
    const socketPath = getSocketPath();
    // Remove existing socket if exists
    // Create server and listen
    // Set permissions to 0600 on Unix
  }

  handleMessage(rawMessage) {
    const message = JSON.parse(rawMessage);
    switch (message.type) {
      case "ping": sendResponse({ type: "pong" }); break;
      case "get_status": sendResponse({ native_host_version: "1.0.0" }); break;
      case "tool_response": forwardToAllMcpClients(message); break;
      case "notification": forwardToAllMcpClients(message); break;
    }
  }

  handleMcpClient(socket) {
    // Register new client, forward tool requests to Chrome
  }
}

// Mapping: QI9→NativeHostServer, sfA→getSocketPath, C$A→sendNativeMessage, jU7→NATIVE_HOST_VERSION
```

### StdinReader (BI9)

Reads Native Messaging input from Chrome extension.

```javascript
// ============================================
// StdinReader - Native messaging input handler
// Location: chunks.157.mjs:1818-1858
// ============================================

// ORIGINAL (for source lookup):
class BI9 {
  buffer = Buffer.alloc(0);
  pendingResolve = null;
  closed = !1;

  constructor() {
    process.stdin.on("data", (A) => {
      this.buffer = Buffer.concat([this.buffer, A]);
      this.tryProcessMessage();
    });
    process.stdin.on("end", () => { this.closed = !0; });
  }

  tryProcessMessage() {
    if (!this.pendingResolve) return;
    if (this.buffer.length < 4) return;
    let A = this.buffer.readUInt32LE(0);  // Read 4-byte length
    if (A === 0 || A > eP0) return;       // eP0 = 1048576 (1MB max)
    if (this.buffer.length < 4 + A) return;
    let Q = this.buffer.subarray(4, 4 + A);
    this.buffer = this.buffer.subarray(4 + A);
    this.pendingResolve(Q.toString("utf-8"));
  }

  async read() {
    if (this.closed) return null;
    // Return promise that resolves when message available
  }
}

// READABLE (for understanding):
class StdinReader {
  buffer = Buffer.alloc(0);
  MAX_MESSAGE_SIZE = 1048576;  // 1MB

  async read() {
    // Read 4-byte LE length prefix
    // Read message of that length
    // Return as UTF-8 string
  }
}

// Mapping: BI9→StdinReader, eP0→MAX_MESSAGE_SIZE
```

---

## Platform Configuration

### Socket Paths

```javascript
// ============================================
// getSocketPath - Platform-specific socket paths
// Location: chunks.131.mjs:32-47
// ============================================

// ORIGINAL (for source lookup):
function sfA() {
  if (_B7() === "win32") return `\\\\.\\pipe\\${oo2()}`;
  return PB7(jB7(), oo2())
}

function oo2() {
  return `claude-mcp-browser-bridge-${SB7()}`
}

function SB7() {
  try {
    return TB7().username || "default"
  } catch {
    return process.env.USER || process.env.USERNAME || "default"
  }
}

// READABLE (for understanding):
function getSocketPath() {
  if (platform === "win32") {
    return `\\\\.\\pipe\\claude-mcp-browser-bridge-${username}`;
  }
  return path.join(socketDir, `claude-mcp-browser-bridge-${username}`);
}

// Mapping: sfA→getSocketPath, oo2→getSocketName, SB7→getUsername
```

**Platform Paths:**

| Platform | Socket Path |
|----------|-------------|
| Windows | `\\.\pipe\claude-mcp-browser-bridge-{username}` |
| macOS | `~/.socket/claude-mcp-browser-bridge-{username}` |
| Linux | `~/.socket/claude-mcp-browser-bridge-{username}` |

### Native Host Registration

```javascript
// ============================================
// getNativeHostDir - Native host manifest location
// Location: chunks.145.mjs:1311-1326
// ============================================

// ORIGINAL (for source lookup):
function KH7() {
  let A = $Q(),  // getPlatform
    Q = EZ9();   // getHomeDir
  switch (A) {
    case "macos":
      return xU(Q, "Library", "Application Support", "Google", "Chrome", "NativeMessagingHosts");
    case "linux":
    case "wsl":
      return xU(Q, ".config", "google-chrome", "NativeMessagingHosts");
    case "windows": {
      let B = process.env.APPDATA || xU(Q, "AppData", "Local");
      return xU(B, "Claude Code", "ChromeNativeHost")
    }
    default:
      throw Error(`Unsupported platform: ${A}`)
  }
}

// READABLE (for understanding):
function getNativeHostDir() {
  switch (platform) {
    case "macos":
      return path.join(home, "Library/Application Support/Google/Chrome/NativeMessagingHosts");
    case "linux":
    case "wsl":
      return path.join(home, ".config/google-chrome/NativeMessagingHosts");
    case "windows":
      return path.join(APPDATA, "Claude Code/ChromeNativeHost");
  }
}

// Mapping: KH7→getNativeHostDir, $Q→getPlatform, EZ9→getHomeDir
```

**Platform Paths:**

| Platform | Native Host Manifest Location |
|----------|-------------------------------|
| macOS | `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/claude-in-chrome.json` |
| Linux/WSL | `~/.config/google-chrome/NativeMessagingHosts/claude-in-chrome.json` |
| Windows | `%APPDATA%\Claude Code\ChromeNativeHost\claude-in-chrome.json` |

**Windows Registry:**
```
HKCU\Software\Google\Chrome\NativeMessagingHosts\claude-in-chrome
```

---

## CLI Entry Points

```javascript
// ============================================
// CLI flag handling - Browser mode entry points
// Location: chunks.157.mjs:1879-1884
// ============================================

// ORIGINAL (for source lookup):
if (process.argv[2] === "--claude-in-chrome-mcp") {
  x9("cli_claude_in_chrome_mcp_path"), await oX9();
  return
} else if (process.argv[2] === "--chrome-native-host") {
  x9("cli_chrome_native_host_path"), await AI9();
  return
}

// READABLE (for understanding):
if (process.argv[2] === "--claude-in-chrome-mcp") {
  trackEvent("cli_claude_in_chrome_mcp_path");
  await startMcpClient();  // Connect to native host bridge
  return;
} else if (process.argv[2] === "--chrome-native-host") {
  trackEvent("cli_chrome_native_host_path");
  await startNativeHostBridge();  // Start bridge server
  return;
}

// Mapping: oX9→startMcpClient, AI9→startNativeHostBridge, x9→trackEvent
```

**Entry Points:**

| Flag | Function | Purpose |
|------|----------|---------|
| `--claude-in-chrome-mcp` | `startMcpClient()` | Start MCP client mode, connect to native host bridge |
| `--chrome-native-host` | `startNativeHostBridge()` | Start native host bridge server for Chrome extension |

---

## CLI Flag Handling

The `--chrome` and `--no-chrome` flags control Chrome integration at startup.

```javascript
// ============================================
// shouldEnableChromeIntegration - Determine if Chrome integration should be enabled
// Location: chunks.145.mjs:1259-1268
// ============================================

// ORIGINAL (for source lookup):
function az1(A) {
  if (p2() && A !== !0) return !1;
  if (A === !0) return !0;
  if (A === !1) return !1;
  if (a1(process.env.CLAUDE_CODE_ENABLE_CFC)) return !0;
  if (iX(process.env.CLAUDE_CODE_ENABLE_CFC)) return !1;
  let Q = L1();
  if (Q.claudeInChromeDefaultEnabled !== void 0) return Q.claudeInChromeDefaultEnabled;
  return !1
}

// READABLE (for understanding):
function shouldEnableChromeIntegration(cliFlag) {
  // In print mode, only enable if explicitly requested
  if (isPrintMode() && cliFlag !== true) return false;

  // CLI flags take highest precedence
  if (cliFlag === true) return true;
  if (cliFlag === false) return false;

  // Environment variable is next
  if (parseBoolean(process.env.CLAUDE_CODE_ENABLE_CFC)) return true;
  if (parseFalse(process.env.CLAUDE_CODE_ENABLE_CFC)) return false;

  // Settings file is last
  const settings = getSettings();
  if (settings.claudeInChromeDefaultEnabled !== undefined) {
    return settings.claudeInChromeDefaultEnabled;
  }

  // Default: disabled
  return false;
}

// Mapping: az1→shouldEnableChromeIntegration, p2→isPrintMode, a1→parseBoolean, iX→parseFalse, L1→getSettings
```

**Precedence Order:**
```
--chrome/--no-chrome flag  >  CLAUDE_CODE_ENABLE_CFC env var  >  claudeInChromeDefaultEnabled setting  >  false (default)
```

**Usage in CLI (chunks.157.mjs:208-244):**
```javascript
let A1 = az1(I.chrome) && qB();  // Enable if flag allows AND user is subscriber
let n1 = !A1 && I$A();           // Auto-enable if not explicitly enabled but auto-enable conditions met
```

---

## Auto-Enable Logic

Chrome integration can auto-enable when the extension is installed and feature flags allow.

```javascript
// ============================================
// isClaudeInChromeAutoEnabled - Check if auto-enable conditions are met
// Location: chunks.145.mjs:1270-1273
// ============================================

// ORIGINAL (for source lookup):
function I$A() {
  if (iz1 !== void 0) return iz1;
  return iz1 = e5A() && FH7() && ZZ("tengu_chrome_auto_enable", !1), iz1
}

// READABLE (for understanding):
function isClaudeInChromeAutoEnabled() {
  // Return cached result if available
  if (cachedAutoEnableResult !== undefined) {
    return cachedAutoEnableResult;
  }

  // All conditions must be true:
  // 1. Platform is supported (macOS, Windows, Linux)
  // 2. Chrome extension is installed
  // 3. Feature flag is enabled
  cachedAutoEnableResult =
    isPlatformSupported() &&
    getCachedExtensionStatus() &&
    getFeatureFlag("tengu_chrome_auto_enable", false);

  return cachedAutoEnableResult;
}

// Mapping: I$A→isClaudeInChromeAutoEnabled, iz1→cachedAutoEnableResult, e5A→isPlatformSupported, FH7→getCachedExtensionStatus, ZZ→getFeatureFlag
```

**Auto-Enable Conditions:**
1. Platform is supported (macOS, Windows, Linux/WSL)
2. Chrome extension is detected as installed
3. Feature flag `tengu_chrome_auto_enable` is enabled

---

## Extension Detection

The system detects if the Chrome extension is installed by scanning Chrome profiles.

```javascript
// ============================================
// getCachedExtensionStatus - Return cached extension installation status
// Location: chunks.145.mjs:1378-1385
// ============================================

// ORIGINAL (for source lookup):
function FH7() {
  return qp().then((Q) => {
    if (L1().cachedChromeExtensionInstalled !== Q) S0((G) => ({
      ...G,
      cachedChromeExtensionInstalled: Q
    }))
  }), L1().cachedChromeExtensionInstalled ?? !1
}

// READABLE (for understanding):
function getCachedExtensionStatus() {
  // Trigger async detection and cache update
  detectChromeExtension().then((isInstalled) => {
    if (getSettings().cachedChromeExtensionInstalled !== isInstalled) {
      updateLocalState((state) => ({
        ...state,
        cachedChromeExtensionInstalled: isInstalled
      }));
    }
  });

  // Return cached value (async detection updates for next call)
  return getSettings().cachedChromeExtensionInstalled ?? false;
}

// Mapping: FH7→getCachedExtensionStatus, qp→detectChromeExtension, L1→getSettings, S0→updateLocalState
```

```javascript
// ============================================
// detectChromeExtension - Scan Chrome profiles for extension
// Location: chunks.145.mjs:1387-1409
// ============================================

// ORIGINAL (for source lookup):
async function qp() {
  let A = HH7();
  if (!A) return k(`[Claude in Chrome] Unsupported platform: ${$Q()}`), !1;
  let Q = [];
  try {
    await IZ9(A), Q = await XH7(A, { withFileTypes: !0 })
  } catch {
    return k(`[Claude in Chrome] Chrome base path does not exist: ${A}`), !1
  }
  let B = Q.filter((Z) => Z.isDirectory())
    .filter((Z) => Z.name === "Default" || Z.name.startsWith("Profile "))
    .map((Z) => Z.name);
  let G = ["fcoeoabgfenejglbffodgkkbkcdhcgfn"];
  for (let Z of B)
    for (let Y of G) {
      let J = xU(A, Z, "Extensions", Y);
      try {
        await IZ9(J);
        return !0
      } catch {}
    }
  return !1
}

// READABLE (for understanding):
async function detectChromeExtension() {
  const chromeUserDataPath = getChromeUserDataPath();
  if (!chromeUserDataPath) {
    debug(`[Claude in Chrome] Unsupported platform: ${getPlatform()}`);
    return false;
  }

  let entries = [];
  try {
    await access(chromeUserDataPath);
    entries = await readdir(chromeUserDataPath, { withFileTypes: true });
  } catch {
    debug(`[Claude in Chrome] Chrome base path does not exist: ${chromeUserDataPath}`);
    return false;
  }

  // Find all Chrome profiles
  const profiles = entries
    .filter((entry) => entry.isDirectory())
    .filter((entry) => entry.name === "Default" || entry.name.startsWith("Profile "))
    .map((entry) => entry.name);

  // Check for extension in each profile
  const extensionIds = ["fcoeoabgfenejglbffodgkkbkcdhcgfn"];
  for (const profile of profiles) {
    for (const extId of extensionIds) {
      const extensionPath = path.join(chromeUserDataPath, profile, "Extensions", extId);
      try {
        await access(extensionPath);
        debug(`[Claude in Chrome] Extension ${extId} found in ${profile}`);
        return true;
      } catch {}
    }
  }

  debug("[Claude in Chrome] Extension not found in any profile");
  return false;
}

// Mapping: qp→detectChromeExtension, HH7→getChromeUserDataPath, IZ9→access, XH7→readdir
```

**Extension ID**: `fcoeoabgfenejglbffodgkkbkcdhcgfn`

**Chrome User Data Paths (getChromeUserDataPath):**

| Platform | Path |
|----------|------|
| macOS | `~/Library/Application Support/Google/Chrome` |
| Windows | `%LOCALAPPDATA%\Google\Chrome\User Data` |
| Linux/WSL | `~/.config/google-chrome` |

---

## MCP Configuration Generation

When Chrome integration is enabled, the system generates MCP configuration dynamically.

```javascript
// ============================================
// getClaudeInChromeConfig - Generate MCP config for Chrome integration
// Location: chunks.145.mjs:1275-1309
// ============================================

// ORIGINAL (for source lookup):
function oz1() {
  let A = LG(),  // isNativeBinary
    Q = Pe.map((B) => `mcp__claude-in-chrome__${B.name}`);
  if (A) {
    let B = `"${process.execPath}" --chrome-native-host`;
    return KZ9(B).then((G) => WZ9(G)), {
      mcpConfig: {
        [Ej]: {
          type: "stdio",
          command: process.execPath,
          args: ["--claude-in-chrome-mcp"],
          scope: "dynamic"
        }
      },
      allowedTools: Q,
      systemPrompt: ST0()
    }
  } else {
    let B = IH7(import.meta.url),
      G = xU(B, ".."),
      Z = xU(G, "cli.js");
    return KZ9(`"${process.execPath}" "${Z}" --chrome-native-host`).then((J) => WZ9(J)), {
      mcpConfig: {
        [Ej]: {
          type: "stdio",
          command: "node",
          args: [`${Z}`, "--claude-in-chrome-mcp"],
          scope: "dynamic"
        }
      },
      allowedTools: Q,
      systemPrompt: ST0()
    }
  }
}

// READABLE (for understanding):
function getClaudeInChromeConfig() {
  const isNative = isNativeBinary();
  const allowedTools = CHROME_MCP_TOOLS.map((tool) => `mcp__claude-in-chrome__${tool.name}`);

  if (isNative) {
    // Native binary mode - use execPath directly
    const nativeHostCommand = `"${process.execPath}" --chrome-native-host`;
    createNativeHostWrapperScript(nativeHostCommand)
      .then((scriptPath) => installNativeHostManifest(scriptPath));

    return {
      mcpConfig: {
        [CHROME_MCP_SERVER_NAME]: {
          type: "stdio",
          command: process.execPath,
          args: ["--claude-in-chrome-mcp"],
          scope: "dynamic"
        }
      },
      allowedTools: allowedTools,
      systemPrompt: getSystemPrompt()
    };
  } else {
    // Node.js mode - use node with cli.js
    const dirname = fileURLToPath(import.meta.url);
    const cliPath = path.join(dirname, "..", "cli.js");
    const nativeHostCommand = `"${process.execPath}" "${cliPath}" --chrome-native-host`;
    createNativeHostWrapperScript(nativeHostCommand)
      .then((scriptPath) => installNativeHostManifest(scriptPath));

    return {
      mcpConfig: {
        [CHROME_MCP_SERVER_NAME]: {
          type: "stdio",
          command: "node",
          args: [cliPath, "--claude-in-chrome-mcp"],
          scope: "dynamic"
        }
      },
      allowedTools: allowedTools,
      systemPrompt: getSystemPrompt()
    };
  }
}

// Mapping: oz1→getClaudeInChromeConfig, LG→isNativeBinary, Pe→CHROME_MCP_TOOLS, Ej→CHROME_MCP_SERVER_NAME, KZ9→createNativeHostWrapperScript, WZ9→installNativeHostManifest, ST0→getSystemPrompt
```

**Return Value Structure:**
```typescript
{
  mcpConfig: {
    "claude-in-chrome": {
      type: "stdio",
      command: string,
      args: string[],
      scope: "dynamic"
    }
  },
  allowedTools: string[],  // ["mcp__claude-in-chrome__javascript_tool", ...]
  systemPrompt: string     // Browser automation guidelines
}
```

---

## Native Host Wrapper Script

A wrapper script is created to launch the native host from Chrome.

```javascript
// ============================================
// createNativeHostWrapperScript - Create platform-specific wrapper script
// Location: chunks.145.mjs:1358-1376
// ============================================

// ORIGINAL (for source lookup):
async function KZ9(A) {
  let Q = $Q(),
    B = xU(zQ(), "chrome"),
    G = Q === "windows" ? xU(B, "chrome-native-host.bat") : xU(B, "chrome-native-host"),
    Z = Q === "windows" ? `@echo off
REM Chrome native host wrapper script
REM Generated by Claude Code - do not edit manually
${A}
` : `#!/bin/sh
# Chrome native host wrapper script
# Generated by Claude Code - do not edit manually
exec ${A}
`;
  if (await FZ9(G, "utf-8").catch(() => null) === Z) return G;
  if (await VZ9(B, { recursive: !0 }), await HZ9(G, Z), Q !== "windows") await JH7(G, 493);
  return k(`[Claude in Chrome] Created Chrome native host wrapper script: ${G}`), G
}

// READABLE (for understanding):
async function createNativeHostWrapperScript(command) {
  const platform = getPlatform();
  const chromeDir = path.join(getClaudeConfigDir(), "chrome");
  const scriptPath = platform === "windows"
    ? path.join(chromeDir, "chrome-native-host.bat")
    : path.join(chromeDir, "chrome-native-host");

  const scriptContent = platform === "windows"
    ? `@echo off
REM Chrome native host wrapper script
REM Generated by Claude Code - do not edit manually
${command}
`
    : `#!/bin/sh
# Chrome native host wrapper script
# Generated by Claude Code - do not edit manually
exec ${command}
`;

  // Check if script already exists with same content
  if (await readFile(scriptPath, "utf-8").catch(() => null) === scriptContent) {
    return scriptPath;
  }

  // Create directory and write script
  await mkdir(chromeDir, { recursive: true });
  await writeFile(scriptPath, scriptContent);

  // Make executable on Unix
  if (platform !== "windows") {
    await chmod(scriptPath, 0o755);
  }

  debug(`[Claude in Chrome] Created Chrome native host wrapper script: ${scriptPath}`);
  return scriptPath;
}

// Mapping: KZ9→createNativeHostWrapperScript, $Q→getPlatform, zQ→getClaudeConfigDir, FZ9→readFile, VZ9→mkdir, HZ9→writeFile, JH7→chmod
```

**Script Locations:**

| Platform | Path |
|----------|------|
| Windows | `~/.claude/chrome/chrome-native-host.bat` |
| macOS/Linux | `~/.claude/chrome/chrome-native-host` |

---

## Onboarding UI

The Chrome integration setup component provides user-facing configuration options.

```javascript
// ============================================
// ChromeIntegrationSetup - Setup UI component
// Location: chunks.145.mjs:1453-1550+
// ============================================

// ORIGINAL (for source lookup):
function CH7({
  onDone: A,
  isExtensionInstalled: Q,
  configEnabled: B,
  isClaudeAISubscriber: G,
  isWSL: Z
}) {
  let [Y] = a0(), [J, X] = VuA.useState(0), [I, D] = VuA.useState(B ?? !1), [W, K] = VuA.useState(!1), [V, F] = VuA.useState(Q), E = Y.mcp.clients.find((M) => M.name === Ej)?.type === "connected";

  function z(M) {
    switch (M) {
      case "install-extension":
        X((_) => _ + 1), K(!0), mEA(EH7);
        break;
      case "reconnect":
        X((_) => _ + 1), qp().then((_) => {
          if (F(_), _) K(!1)
        }), mEA($H7);
        break;
      case "manage-permissions":
        X((_) => _ + 1), mEA(zH7);
        break;
      case "toggle-default": {
        let _ = !I;
        S0((j) => ({ ...j, claudeInChromeDefaultEnabled: _ })), D(_);
        break
      }
    }
  }
  // ...
}

// READABLE (for understanding):
function ChromeIntegrationSetup({
  onDone,
  isExtensionInstalled,
  configEnabled,
  isClaudeAISubscriber,
  isWSL
}) {
  const [appState] = useAppState();
  const [clickCount, setClickCount] = useState(0);
  const [isEnabled, setIsEnabled] = useState(configEnabled ?? false);
  const [showReconnect, setShowReconnect] = useState(false);
  const [extensionInstalled, setExtensionInstalled] = useState(isExtensionInstalled);

  const isConnected = appState.mcp.clients
    .find((client) => client.name === CHROME_MCP_SERVER_NAME)?.type === "connected";

  function handleAction(action) {
    switch (action) {
      case "install-extension":
        setClickCount((count) => count + 1);
        setShowReconnect(true);
        openBrowser(CHROME_EXTENSION_INSTALL_URL);
        break;
      case "reconnect":
        setClickCount((count) => count + 1);
        detectChromeExtension().then((installed) => {
          setExtensionInstalled(installed);
          if (installed) setShowReconnect(false);
        });
        openBrowser(CHROME_RECONNECT_URL);
        break;
      case "manage-permissions":
        setClickCount((count) => count + 1);
        openBrowser(CHROME_PERMISSIONS_URL);
        break;
      case "toggle-default": {
        const newEnabled = !isEnabled;
        updateLocalState((state) => ({
          ...state,
          claudeInChromeDefaultEnabled: newEnabled
        }));
        setIsEnabled(newEnabled);
        break;
      }
    }
  }
  // ... render UI with options
}

// Mapping: CH7→ChromeIntegrationSetup, a0→useAppState, Ej→CHROME_MCP_SERVER_NAME, mEA→openBrowser, qp→detectChromeExtension, S0→updateLocalState
```

**Available Actions:**

| Action | Description |
|--------|-------------|
| `install-extension` | Opens Chrome Web Store to install extension |
| `reconnect` | Opens reconnect page and re-detects extension |
| `manage-permissions` | Opens extension permissions page |
| `toggle-default` | Toggles default enabled setting |

**URLs:**

| Constant | URL |
|----------|-----|
| `DH7` (CHROME_RECONNECT_URL) | `https://clau.de/chrome/reconnect` |
| Extension Install | Chrome Web Store link |
| Permissions | Extension options page |

---

## System Prompts

### Browser Automation Guidelines

```javascript
// ============================================
// getSystemPrompt - Browser automation guidelines
// Location: chunks.145.mjs:1140-1188
// ============================================

// ORIGINAL (for source lookup):
function ST0() {
  return `
# Claude in Chrome browser automation

You have access to browser automation tools (mcp__claude-in-chrome__*) for interacting with web pages in Chrome. Follow these guidelines for effective browser automation.

## GIF recording

When performing multi-step browser interactions that the user may want to review or share, use mcp__claude-in-chrome__gif_creator to record them.

You must ALWAYS:
* Capture extra frames before and after taking actions to ensure smooth playback
* Name the file meaningfully to help the user identify it later (e.g., "login_process.gif")

## Console log debugging

You can use mcp__claude-in-chrome__read_console_messages to read console output. Console output may be verbose. If you are looking for specific log entries, use the 'pattern' parameter with a regex-compatible pattern. This filters results efficiently and avoids overwhelming output. For example, use pattern: "[MyApp]" to filter for application-specific logs rather than reading all console output.

## Alerts and dialogs

IMPORTANT: Do not trigger JavaScript alerts, confirms, prompts, or browser modal dialogs through your actions. These browser dialogs block all further browser events and will prevent the extension from receiving any subsequent commands. Instead, when possible, use console.log for debugging and then use the mcp__claude-in-chrome__read_console_messages tool to read those log messages. If a page has dialog-triggering elements:
1. Avoid clicking buttons or links that may trigger alerts (e.g., "Delete" buttons with confirmation dialogs)
2. If you must interact with such elements, warn the user first that this may interrupt the session
3. Use mcp__claude-in-chrome__javascript_tool to check for and dismiss any existing dialogs before proceeding

If you accidentally trigger a dialog and lose responsiveness, inform the user they need to manually dismiss it in the browser.

## Avoid rabbit holes and loops

When using browser automation tools, stay focused on the specific task. If you encounter any of the following, stop and ask the user for guidance:
- Unexpected complexity or tangential browser exploration
- Browser tool calls failing or returning errors after 2-3 attempts
- No response from the browser extension
- Page elements not responding to clicks or input
- Pages not loading or timing out
- Unable to complete the browser task despite multiple approaches

Explain what you attempted, what went wrong, and ask how the user would like to proceed. Do not keep retrying the same failing browser action or explore unrelated pages without checking in first.

## Tab context and session startup

IMPORTANT: At the start of each browser automation session, call mcp__claude-in-chrome__tabs_context_mcp first to get information about the user's current browser tabs. Use this context to understand what the user might want to work with before creating new tabs.

Never reuse tab IDs from a previous/other session. Follow these guidelines:
1. Only reuse an existing tab if the user explicitly asks to work with it
2. Otherwise, create a new tab with mcp__claude-in-chrome__tabs_create_mcp
3. If a tool returns an error indicating the tab doesn't exist or is invalid, call tabs_context_mcp to get fresh tab IDs
4. When a tab is closed by the user or a navigation error occurs, call tabs_context_mcp to see what tabs are available
`
}

// READABLE:
function getSystemPrompt() {
  // Returns comprehensive browser automation guidelines
}

// Mapping: ST0→getSystemPrompt
```

**Critical Guidelines:**
1. **GIF Recording**: Capture extra frames, use meaningful filenames
2. **Console Debugging**: Always use `pattern` parameter to filter output
3. **CRITICAL - Avoid Alerts**: Never trigger browser dialogs (blocks extension)
4. **Loop Detection**: Stop and ask user after 2-3 failures
5. **Tab Management**: Always call `tabs_context_mcp` first, never reuse old tab IDs

---

## Slash Command: /chrome

The `/chrome` command opens the Chrome integration settings UI.

```javascript
// ============================================
// chromeSettingsCommand - /chrome slash command
// Location: chunks.145.mjs:1583-1591
// ============================================

// ORIGINAL (for source lookup):
qH7 = {
  name: "chrome",
  description: "Claude in Chrome (Beta) settings",
  isEnabled: () => !p2(),
  isHidden: !1,
  type: "local-jsx",
  userFacingName: () => "chrome",
  call: UH7
}, zZ9 = qH7

// READABLE (for understanding):
chromeSettingsCommand = {
  name: "chrome",
  description: "Claude in Chrome (Beta) settings",
  isEnabled: () => !isPrintMode(),  // Only available in interactive mode
  isHidden: false,
  type: "local-jsx",
  userFacingName: () => "chrome",
  call: renderChromeSetup
};

// Mapping: qH7/zZ9→chromeSettingsCommand, p2→isPrintMode, UH7→renderChromeSetup
```

---

## Status Line Integration

Chrome extension status is shown in the status line.

```javascript
// ============================================
// Chrome status line display
// Location: chunks.153.mjs:703-709
// ============================================

// Status messages:
// - Extension not installed: "Chrome extension not detected · https://claude.ai/chrome to install"
// - Extension enabled: "Claude in Chrome enabled · /chrome"
```

---

## URL Constants

| Constant | URL | Purpose |
|----------|-----|---------|
| `EH7` | `https://claude.ai/chrome` | Extension install page |
| `DH7` / `$H7` | `https://clau.de/chrome/reconnect` | Reconnect extension |
| `zH7` | `https://clau.de/chrome/permissions` | Manage permissions |
| `wU7` | `https://claude.ai/chrome` | Extension page (from chunks.157.mjs) |
| `LU7` | `https://github.com/anthropics/claude-code/issues/new?labels=bug,claude-in-chrome` | Bug report |
| `dB7` | `https://clau.de/chrome/tab/` | Tab deep link |

---

## Telemetry Events

| Event | When Triggered |
|-------|----------------|
| `tengu_claude_in_chrome_setup` | Chrome integration initialized |
| `tengu_claude_in_chrome_setup_failed` | Setup failed with error |
| `tengu_claude_in_chrome_setting_changed` | User toggles enabled setting |
| `cli_claude_in_chrome_mcp_path` | MCP client mode started |
| `cli_chrome_native_host_path` | Native host bridge started |

---

## Settings

### claudeInChromeDefaultEnabled

```javascript
// ============================================
// Claude in Chrome Setting
// Location: chunks.137.mjs:954-967
// ============================================

// ORIGINAL:
{
  id: "claudeInChromeDefaultEnabled",
  label: "Claude in Chrome enabled by default",
  value: X.claudeInChromeDefaultEnabled ?? !0,
  type: "boolean",
  onChange(t) {
    S0((BA) => ({ ...BA, claudeInChromeDefaultEnabled: t }));
    I({ ...L1(), claudeInChromeDefaultEnabled: t });
    l("tengu_claude_in_chrome_setting_changed", { enabled: t });
  }
}

// READABLE:
claudeInChromeSetting = {
  id: "claudeInChromeDefaultEnabled",
  label: "Claude in Chrome enabled by default",
  value: settings.claudeInChromeDefaultEnabled ?? true,  // Default: enabled
  type: "boolean",
  onChange(enabled) {
    updateLocalState((state) => ({ ...state, claudeInChromeDefaultEnabled: enabled }));
    saveSettings({ ...getSettings(), claudeInChromeDefaultEnabled: enabled });
    trackEvent("tengu_claude_in_chrome_setting_changed", { enabled });
  }
}
```

---

## Usage Flow

1. **Invoke Skill**: User invokes `/claude-in-chrome` or Claude recognizes browser task
2. **Get Context**: Call `mcp__claude-in-chrome__tabs_context_mcp` to get tab info
3. **Create Tab** (if needed): Call `tabs_create_mcp` for new tab
4. **Interact**: Use navigate, click, fill, screenshot tools as needed
5. **Site Permissions**: Extension requires site-level permissions before executing

---

## macOS Code-Sign (2.0.76)

Fixed issue with macOS code-sign warning when using Chrome integration.

---

## Key Files

| File | Content |
|------|---------|
| chunks.145.mjs:4-445 | MCP tool definitions (18 tools) |
| chunks.145.mjs:787-970 | SocketClient class |
| chunks.145.mjs:1093-1125 | MCP server factory |
| chunks.145.mjs:1140-1188 | System prompts |
| chunks.145.mjs:1259-1309 | Chrome enable/config functions (az1, I$A, oz1) |
| chunks.145.mjs:1311-1376 | Native host registration & scripts |
| chunks.145.mjs:1378-1427 | Extension detection (FH7, qp, HH7) |
| chunks.145.mjs:1453-1591 | Onboarding UI & /chrome command |
| chunks.131.mjs:32-47 | Socket path functions |
| chunks.137.mjs:954-967 | Settings UI |
| chunks.149.mjs:2633-2654 | Skill registration |
| chunks.153.mjs:703-709 | Status line integration |
| chunks.155.mjs:2195-2202 | Onboarding welcome UI |
| chunks.157.mjs:208-244 | CLI chrome flag handling |
| chunks.157.mjs:1599-1616 | MCP client entry |
| chunks.157.mjs:1666-1677 | Native host entry |
| chunks.157.mjs:1679-1816 | NativeHostServer class |
| chunks.157.mjs:1818-1858 | StdinReader class |
| chunks.157.mjs:1879-1884 | CLI flag dispatch |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

Key functions in this document:

**Skill & Tools:**
- `registerClaudeInChromeSkill` (TI9) - Skill registration
- `chromeSkillPrompt` (Fq7) - Skill prompt template
- `CHROME_MCP_TOOLS` (Pe) - MCP tool definitions array

**Initialization & Detection:**
- `shouldEnableChromeIntegration` (az1) - Determine if Chrome integration should be enabled
- `isClaudeInChromeAutoEnabled` (I$A) - Check if auto-enable conditions are met
- `getClaudeInChromeConfig` (oz1) - Generate MCP config for Chrome integration
- `detectChromeExtension` (qp) - Scan Chrome profiles for extension
- `getCachedExtensionStatus` (FH7) - Return cached extension installation status
- `getChromeUserDataPath` (HH7) - Get platform-specific Chrome user data path

**Native Host:**
- `createNativeHostWrapperScript` (KZ9) - Create platform-specific wrapper script
- `installNativeHostManifest` (WZ9) - Install native host manifest file
- `getNativeHostDir` (KH7) - Native host manifest location
- `startMcpClient` (oX9) - MCP client entry point
- `startNativeHostBridge` (AI9) - Native host bridge entry
- `NativeHostServer` (QI9) - Socket server for MCP clients
- `StdinReader` (BI9) - Native messaging input handler

**Socket Communication:**
- `SocketClient` (AZ9) - MCP client socket connection
- `createSocketClient` (QZ9) - Socket client factory
- `SocketConnectionError` (z8A) - Connection error class
- `handleToolCall` (GZ9) - Tool call handler
- `createMcpServer` (PT0) - MCP server factory
- `getSocketPath` (sfA) - Platform-specific socket path
- `getSocketName` (oo2) - Socket name generator
- `getUsername` (SB7) - Get current username

**System Prompts:**
- `getSystemPrompt` (ST0) - Browser automation guidelines
- `BROWSER_AUTOMATION_PROMPT` (JZ9) - Full prompt constant
- `CHROME_SKILL_REMINDER` (xT0) - Skill invocation reminder

**UI Components:**
- `ChromeIntegrationSetup` (CH7) - Onboarding setup component
- `renderChromeSetup` (UH7) - Setup component wrapper

**Slash Commands:**
- `chromeSettingsCommand` (qH7/zZ9) - `/chrome` command definition

**URL Constants:**
- `CHROME_EXTENSION_INSTALL_URL` (EH7) - `https://claude.ai/chrome`
- `CHROME_PERMISSIONS_URL` (zH7) - `https://clau.de/chrome/permissions`
- `CHROME_RECONNECT_URL` ($H7/DH7) - `https://clau.de/chrome/reconnect`
- `CHROME_BUG_REPORT_URL` (LU7) - GitHub issues link

---

## See Also

- [../10_skill/](../10_skill/) - Skill system
- [../06_mcp/](../06_mcp/) - MCP protocol integration
