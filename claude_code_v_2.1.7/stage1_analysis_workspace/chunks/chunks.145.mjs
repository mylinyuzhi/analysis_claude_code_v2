
// @from(Ln 430088, Col 4)
RT0 = w(() => {
  Pe = [{
    name: "javascript_tool",
    description: "Execute JavaScript code in the context of the current page. The code runs in the page's context and can interact with the DOM, window object, and page variables. Returns the result of the last expression or any thrown errors. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs.",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          description: "Must be set to 'javascript_exec'"
        },
        text: {
          type: "string",
          description: "The JavaScript code to execute. The code will be evaluated in the page context. The result of the last expression will be returned automatically. Do NOT use 'return' statements - just write the expression you want to evaluate (e.g., 'window.myData.value' not 'return window.myData.value'). You can access and modify the DOM, call page functions, and interact with page variables."
        },
        tabId: {
          type: "number",
          description: "Tab ID to execute the code in. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID."
        }
      },
      required: ["action", "text", "tabId"]
    }
  }, {
    name: "read_page",
    description: "Get an accessibility tree representation of elements on the page. By default returns all elements including non-visible ones. Output is limited to 50000 characters. If the output exceeds this limit, you will receive an error asking you to specify a smaller depth or focus on a specific element using ref_id. Optionally filter for only interactive elements. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs.",
    inputSchema: {
      type: "object",
      properties: {
        filter: {
          type: "string",
          enum: ["interactive", "all"],
          description: 'Filter elements: "interactive" for buttons/links/inputs only, "all" for all elements including non-visible ones (default: all elements)'
        },
        tabId: {
          type: "number",
          description: "Tab ID to read from. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID."
        },
        depth: {
          type: "number",
          description: "Maximum depth of the tree to traverse (default: 15). Use a smaller depth if output is too large."
        },
        ref_id: {
          type: "string",
          description: "Reference ID of a parent element to read. Will return the specified element and all its children. Use this to focus on a specific part of the page when output is too large."
        }
      },
      required: ["tabId"]
    }
  }, {
    name: "find",
    description: `Find elements on the page using natural language. Can search for elements by their purpose (e.g., "search bar", "login button") or by text content (e.g., "organic mango product"). Returns up to 20 matching elements with references that can be used with other tools. If more than 20 matches exist, you'll be notified to use a more specific query. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs.`,
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: 'Natural language description of what to find (e.g., "search bar", "add to cart button", "product title containing organic")'
        },
        tabId: {
          type: "number",
          description: "Tab ID to search in. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID."
        }
      },
      required: ["query", "tabId"]
    }
  }, {
    name: "form_input",
    description: "Set values in form elements using element reference ID from the read_page tool. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs.",
    inputSchema: {
      type: "object",
      properties: {
        ref: {
          type: "string",
          description: 'Element reference ID from the read_page tool (e.g., "ref_1", "ref_2")'
        },
        value: {
          type: ["string", "boolean", "number"],
          description: "The value to set. For checkboxes use boolean, for selects use option value or text, for other inputs use appropriate string/number"
        },
        tabId: {
          type: "number",
          description: "Tab ID to set form value in. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID."
        }
      },
      required: ["ref", "value", "tabId"]
    }
  }, {
    name: "computer",
    description: `Use a mouse and keyboard to interact with a web browser, and take screenshots. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs.
* Whenever you intend to click on an element like an icon, you should consult a screenshot to determine the coordinates of the element before moving the cursor.
* If you tried clicking on a program or link but it failed to load, even after waiting, try adjusting your click location so that the tip of the cursor visually falls on the element that you want to click.
* Make sure to click any buttons, links, icons, etc with the cursor tip in the center of the element. Don't click boxes on their edges unless asked.`,
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["left_click", "right_click", "type", "screenshot", "wait", "scroll", "key", "left_click_drag", "double_click", "triple_click", "zoom", "scroll_to", "hover"],
          description: "The action to perform:\n* `left_click`: Click the left mouse button at the specified coordinates.\n* `right_click`: Click the right mouse button at the specified coordinates to open context menus.\n* `double_click`: Double-click the left mouse button at the specified coordinates.\n* `triple_click`: Triple-click the left mouse button at the specified coordinates.\n* `type`: Type a string of text.\n* `screenshot`: Take a screenshot of the screen.\n* `wait`: Wait for a specified number of seconds.\n* `scroll`: Scroll up, down, left, or right at the specified coordinates.\n* `key`: Press a specific keyboard key.\n* `left_click_drag`: Drag from start_coordinate to coordinate.\n* `zoom`: Take a screenshot of a specific region for closer inspection.\n* `scroll_to`: Scroll an element into view using its element reference ID from read_page or find tools.\n* `hover`: Move the mouse cursor to the specified coordinates or element without clicking. Useful for revealing tooltips, dropdown menus, or triggering hover states."
        },
        coordinate: {
          type: "array",
          items: {
            type: "number"
          },
          minItems: 2,
          maxItems: 2,
          description: "(x, y): The x (pixels from the left edge) and y (pixels from the top edge) coordinates. Required for `left_click`, `right_click`, `double_click`, `triple_click`, and `scroll`. For `left_click_drag`, this is the end position."
        },
        text: {
          type: "string",
          description: 'The text to type (for `type` action) or the key(s) to press (for `key` action). For `key` action: Provide space-separated keys (e.g., "Backspace Backspace Delete"). Supports keyboard shortcuts using the platform\'s modifier key (use "cmd" on Mac, "ctrl" on Windows/Linux, e.g., "cmd+a" or "ctrl+a" for select all).'
        },
        duration: {
          type: "number",
          minimum: 0,
          maximum: 30,
          description: "The number of seconds to wait. Required for `wait`. Maximum 30 seconds."
        },
        scroll_direction: {
          type: "string",
          enum: ["up", "down", "left", "right"],
          description: "The direction to scroll. Required for `scroll`."
        },
        scroll_amount: {
          type: "number",
          minimum: 1,
          maximum: 10,
          description: "The number of scroll wheel ticks. Optional for `scroll`, defaults to 3."
        },
        start_coordinate: {
          type: "array",
          items: {
            type: "number"
          },
          minItems: 2,
          maxItems: 2,
          description: "(x, y): The starting coordinates for `left_click_drag`."
        },
        region: {
          type: "array",
          items: {
            type: "number"
          },
          minItems: 4,
          maxItems: 4,
          description: "(x0, y0, x1, y1): The rectangular region to capture for `zoom`. Coordinates define a rectangle from top-left (x0, y0) to bottom-right (x1, y1) in pixels from the viewport origin. Required for `zoom` action. Useful for inspecting small UI elements like icons, buttons, or text."
        },
        repeat: {
          type: "number",
          minimum: 1,
          maximum: 100,
          description: "Number of times to repeat the key sequence. Only applicable for `key` action. Must be a positive integer between 1 and 100. Default is 1. Useful for navigation tasks like pressing arrow keys multiple times."
        },
        ref: {
          type: "string",
          description: 'Element reference ID from read_page or find tools (e.g., "ref_1", "ref_2"). Required for `scroll_to` action. Can be used as alternative to `coordinate` for click actions.'
        },
        modifiers: {
          type: "string",
          description: 'Modifier keys for click actions. Supports: "ctrl", "shift", "alt", "cmd" (or "meta"), "win" (or "windows"). Can be combined with "+" (e.g., "ctrl+shift", "cmd+alt"). Optional.'
        },
        tabId: {
          type: "number",
          description: "Tab ID to execute the action on. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID."
        }
      },
      required: ["action", "tabId"]
    }
  }, {
    name: "navigate",
    description: "Navigate to a URL, or go forward/back in browser history. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: 'The URL to navigate to. Can be provided with or without protocol (defaults to https://). Use "forward" to go forward in history or "back" to go back in history.'
        },
        tabId: {
          type: "number",
          description: "Tab ID to navigate. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID."
        }
      },
      required: ["url", "tabId"]
    }
  }, {
    name: "resize_window",
    description: "Resize the current browser window to specified dimensions. Useful for testing responsive designs or setting up specific screen sizes. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs.",
    inputSchema: {
      type: "object",
      properties: {
        width: {
          type: "number",
          description: "Target window width in pixels"
        },
        height: {
          type: "number",
          description: "Target window height in pixels"
        },
        tabId: {
          type: "number",
          description: "Tab ID to get the window for. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID."
        }
      },
      required: ["width", "height", "tabId"]
    }
  }, {
    name: "gif_creator",
    description: "Manage GIF recording and export for browser automation sessions. Control when to start/stop recording browser actions (clicks, scrolls, navigation), then export as an animated GIF with visual overlays (click indicators, action labels, progress bar, watermark). All operations are scoped to the tab's group. When starting recording, take a screenshot immediately after to capture the initial state as the first frame. When stopping recording, take a screenshot immediately before to capture the final state as the last frame. For export, either provide 'coordinate' to drag/drop upload to a page element, or set 'download: true' to download the GIF.",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["start_recording", "stop_recording", "export", "clear"],
          description: "Action to perform: 'start_recording' (begin capturing), 'stop_recording' (stop capturing but keep frames), 'export' (generate and export GIF), 'clear' (discard frames)"
        },
        tabId: {
          type: "number",
          description: "Tab ID to identify which tab group this operation applies to"
        },
        download: {
          type: "boolean",
          description: "Always set this to true for the 'export' action only. This causes the gif to be downloaded in the browser."
        },
        filename: {
          type: "string",
          description: "Optional filename for exported GIF (default: 'recording-[timestamp].gif'). For 'export' action only."
        },
        options: {
          type: "object",
          description: "Optional GIF enhancement options for 'export' action. Properties: showClickIndicators (bool), showDragPaths (bool), showActionLabels (bool), showProgressBar (bool), showWatermark (bool), quality (number 1-30). All default to true except quality (default: 10).",
          properties: {
            showClickIndicators: {
              type: "boolean",
              description: "Show orange circles at click locations (default: true)"
            },
            showDragPaths: {
              type: "boolean",
              description: "Show red arrows for drag actions (default: true)"
            },
            showActionLabels: {
              type: "boolean",
              description: "Show black labels describing actions (default: true)"
            },
            showProgressBar: {
              type: "boolean",
              description: "Show orange progress bar at bottom (default: true)"
            },
            showWatermark: {
              type: "boolean",
              description: "Show Claude logo watermark (default: true)"
            },
            quality: {
              type: "number",
              description: "GIF compression quality, 1-30 (lower = better quality, slower encoding). Default: 10"
            }
          }
        }
      },
      required: ["action", "tabId"]
    }
  }, {
    name: "upload_image",
    description: "Upload a previously captured screenshot or user-uploaded image to a file input or drag & drop target. Supports two approaches: (1) ref - for targeting specific elements, especially hidden file inputs, (2) coordinate - for drag & drop to visible locations like Google Docs. Provide either ref or coordinate, not both.",
    inputSchema: {
      type: "object",
      properties: {
        imageId: {
          type: "string",
          description: "ID of a previously captured screenshot (from the computer tool's screenshot action) or a user-uploaded image"
        },
        ref: {
          type: "string",
          description: 'Element reference ID from read_page or find tools (e.g., "ref_1", "ref_2"). Use this for file inputs (especially hidden ones) or specific elements. Provide either ref or coordinate, not both.'
        },
        coordinate: {
          type: "array",
          items: {
            type: "number"
          },
          description: "Viewport coordinates [x, y] for drag & drop to a visible location. Use this for drag & drop targets like Google Docs. Provide either ref or coordinate, not both."
        },
        tabId: {
          type: "number",
          description: "Tab ID where the target element is located. This is where the image will be uploaded to."
        },
        filename: {
          type: "string",
          description: 'Optional filename for the uploaded file (default: "image.png")'
        }
      },
      required: ["imageId", "tabId"]
    }
  }, {
    name: "get_page_text",
    description: "Extract raw text content from the page, prioritizing article content. Ideal for reading articles, blog posts, or other text-heavy pages. Returns plain text without HTML formatting. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs.",
    inputSchema: {
      type: "object",
      properties: {
        tabId: {
          type: "number",
          description: "Tab ID to extract text from. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID."
        }
      },
      required: ["tabId"]
    }
  }, {
    name: "tabs_context_mcp",
    title: "Tabs Context",
    description: "Get context information about the current MCP tab group. Returns all tab IDs inside the group if it exists. CRITICAL: You must get the context at least once before using other browser automation tools so you know what tabs exist. Each new conversation should create its own new tab (using tabs_create_mcp) rather than reusing existing tabs, unless the user explicitly asks to use an existing tab.",
    inputSchema: {
      type: "object",
      properties: {
        createIfEmpty: {
          type: "boolean",
          description: "Creates a new MCP tab group if none exists, creates a new Window with a new tab group containing an empty tab (which can be used for this conversation). If a MCP tab group already exists, this parameter has no effect."
        }
      },
      required: []
    }
  }, {
    name: "tabs_create_mcp",
    title: "Tabs Create",
    description: "Creates a new empty tab in the MCP tab group. CRITICAL: You must get the context using tabs_context_mcp at least once before using other browser automation tools so you know what tabs exist.",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  }, {
    name: "update_plan",
    description: "Present a plan to the user for approval before taking actions. The user will see the domains you intend to visit and your approach. Once approved, you can proceed with actions on the approved domains without additional permission prompts.",
    inputSchema: {
      type: "object",
      properties: {
        domains: {
          type: "array",
          items: {
            type: "string"
          },
          description: "List of domains you will visit (e.g., ['github.com', 'stackoverflow.com']). These domains will be approved for the session when the user accepts the plan."
        },
        approach: {
          type: "array",
          items: {
            type: "string"
          },
          description: "High-level description of what you will do. Focus on outcomes and key actions, not implementation details. Be concise - aim for 3-7 items."
        }
      },
      required: ["domains", "approach"]
    }
  }, {
    name: "read_console_messages",
    description: "Read browser console messages (console.log, console.error, console.warn, etc.) from a specific tab. Useful for debugging JavaScript errors, viewing application logs, or understanding what's happening in the browser console. Returns console messages from the current domain only. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs. IMPORTANT: Always provide a pattern to filter messages - without a pattern, you may get too many irrelevant messages.",
    inputSchema: {
      type: "object",
      properties: {
        tabId: {
          type: "number",
          description: "Tab ID to read console messages from. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID."
        },
        onlyErrors: {
          type: "boolean",
          description: "If true, only return error and exception messages. Default is false (return all message types)."
        },
        clear: {
          type: "boolean",
          description: "If true, clear the console messages after reading to avoid duplicates on subsequent calls. Default is false."
        },
        pattern: {
          type: "string",
          description: "Regex pattern to filter console messages. Only messages matching this pattern will be returned (e.g., 'error|warning' to find errors and warnings, 'MyApp' to filter app-specific logs). You should always provide a pattern to avoid getting too many irrelevant messages."
        },
        limit: {
          type: "number",
          description: "Maximum number of messages to return. Defaults to 100. Increase only if you need more results."
        }
      },
      required: ["tabId"]
    }
  }, {
    name: "read_network_requests",
    description: "Read HTTP network requests (XHR, Fetch, documents, images, etc.) from a specific tab. Useful for debugging API calls, monitoring network activity, or understanding what requests a page is making. Returns all network requests made by the current page, including cross-origin requests. Requests are automatically cleared when the page navigates to a different domain. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs.",
    inputSchema: {
      type: "object",
      properties: {
        tabId: {
          type: "number",
          description: "Tab ID to read network requests from. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID."
        },
        urlPattern: {
          type: "string",
          description: "Optional URL pattern to filter requests. Only requests whose URL contains this string will be returned (e.g., '/api/' to filter API calls, 'example.com' to filter by domain)."
        },
        clear: {
          type: "boolean",
          description: "If true, clear the network requests after reading to avoid duplicates on subsequent calls. Default is false."
        },
        limit: {
          type: "number",
          description: "Maximum number of requests to return. Defaults to 100. Increase only if you need more results."
        }
      },
      required: ["tabId"]
    }
  }, {
    name: "shortcuts_list",
    description: "List all available shortcuts and workflows (shortcuts and workflows are interchangeable). Returns shortcuts with their commands, descriptions, and whether they are workflows. Use shortcuts_execute to run a shortcut or workflow.",
    inputSchema: {
      type: "object",
      properties: {
        tabId: {
          type: "number",
          description: "Tab ID to list shortcuts from. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID."
        }
      },
      required: ["tabId"]
    }
  }, {
    name: "shortcuts_execute",
    description: "Execute a shortcut or workflow by running it in a new sidepanel window using the current tab (shortcuts and workflows are interchangeable). Use shortcuts_list first to see available shortcuts. This starts the execution and returns immediately - it does not wait for completion.",
    inputSchema: {
      type: "object",
      properties: {
        tabId: {
          type: "number",
          description: "Tab ID to execute the shortcut on. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID."
        },
        shortcutId: {
          type: "string",
          description: "The ID of the shortcut to execute"
        },
        command: {
          type: "string",
          description: "The command name of the shortcut to execute (e.g., 'debug', 'summarize'). Do not include the leading slash."
        }
      },
      required: ["tabId"]
    }
  }]
})
// @from(Ln 430532, Col 0)
class _T0 {
  constructor(A) {
    this._server = A
  }
  requestStream(A, Q, B) {
    return this._server.requestStream(A, Q, B)
  }
  async getTask(A, Q) {
    return this._server.getTask({
      taskId: A
    }, Q)
  }
  async getTaskResult(A, Q, B) {
    return this._server.getTaskResult({
      taskId: A
    }, Q, B)
  }
  async listTasks(A, Q) {
    return this._server.listTasks(A ? {
      cursor: A
    } : void 0, Q)
  }
  async cancelTask(A, Q) {
    return this._server.cancelTask({
      taskId: A
    }, Q)
  }
}
// @from(Ln 430560, Col 4)
WuA
// @from(Ln 430561, Col 4)
jT0 = w(() => {
  JJ0();
  eK();
  IX0();
  QxA();
  WuA = class WuA extends HxA {
    constructor(A, Q) {
      var B, G;
      super(Q);
      if (this._serverInfo = A, this._loggingLevels = new Map, this.LOG_LEVEL_SEVERITY = new Map(KxA.options.map((Z, Y) => [Z, Y])), this.isMessageIgnored = (Z, Y) => {
          let J = this._loggingLevels.get(Y);
          return J ? this.LOG_LEVEL_SEVERITY.get(Z) < this.LOG_LEVEL_SEVERITY.get(J) : !1
        }, this._capabilities = (B = Q === null || Q === void 0 ? void 0 : Q.capabilities) !== null && B !== void 0 ? B : {}, this._instructions = Q === null || Q === void 0 ? void 0 : Q.instructions, this._jsonSchemaValidator = (G = Q === null || Q === void 0 ? void 0 : Q.jsonSchemaValidator) !== null && G !== void 0 ? G : new hxA, this.setRequestHandler(zY0, (Z) => this._oninitialize(Z)), this.setNotificationHandler(j71, () => {
          var Z;
          return (Z = this.oninitialized) === null || Z === void 0 ? void 0 : Z.call(this)
        }), this._capabilities.logging) this.setRequestHandler(TY0, async (Z, Y) => {
        var J;
        let X = Y.sessionId || ((J = Y.requestInfo) === null || J === void 0 ? void 0 : J.headers["mcp-session-id"]) || void 0,
          {
            level: I
          } = Z.params,
          D = KxA.safeParse(I);
        if (D.success) this._loggingLevels.set(X, D.data);
        return {}
      })
    }
    get experimental() {
      if (!this._experimental) this._experimental = {
        tasks: new _T0(this)
      };
      return this._experimental
    }
    registerCapabilities(A) {
      if (this.transport) throw Error("Cannot register capabilities after connecting to transport");
      this._capabilities = d71(this._capabilities, A)
    }
    setRequestHandler(A, Q) {
      var B, G, Z;
      let Y = RKA(A),
        J = Y === null || Y === void 0 ? void 0 : Y.method;
      if (!J) throw Error("Schema is missing a method literal");
      let X;
      if (Dr(J)) {
        let D = J,
          W = (B = D._zod) === null || B === void 0 ? void 0 : B.def;
        X = (G = W === null || W === void 0 ? void 0 : W.value) !== null && G !== void 0 ? G : D.value
      } else {
        let D = J,
          W = D._def;
        X = (Z = W === null || W === void 0 ? void 0 : W.value) !== null && Z !== void 0 ? Z : D.value
      }
      if (typeof X !== "string") throw Error("Schema method literal must be a string");
      if (X === "tools/call") {
        let D = async (W, K) => {
          let V = lC(n9A, W);
          if (!V.success) {
            let z = V.error instanceof Error ? V.error.message : String(V.error);
            throw new P9(q4.InvalidParams, `Invalid tools/call request: ${z}`)
          }
          let {
            params: F
          } = V.data, H = await Promise.resolve(Q(W, K));
          if (F.task) {
            let z = lC(Kd, H);
            if (!z.success) {
              let $ = z.error instanceof Error ? z.error.message : String(z.error);
              throw new P9(q4.InvalidParams, `Invalid task creation result: ${$}`)
            }
            return z.data
          }
          let E = lC(iC, H);
          if (!E.success) {
            let z = E.error instanceof Error ? E.error.message : String(E.error);
            throw new P9(q4.InvalidParams, `Invalid tools/call result: ${z}`)
          }
          return E.data
        };
        return super.setRequestHandler(A, D)
      }
      return super.setRequestHandler(A, Q)
    }
    assertCapabilityForMethod(A) {
      var Q, B, G;
      switch (A) {
        case "sampling/createMessage":
          if (!((Q = this._clientCapabilities) === null || Q === void 0 ? void 0 : Q.sampling)) throw Error(`Client does not support sampling (required for ${A})`);
          break;
        case "elicitation/create":
          if (!((B = this._clientCapabilities) === null || B === void 0 ? void 0 : B.elicitation)) throw Error(`Client does not support elicitation (required for ${A})`);
          break;
        case "roots/list":
          if (!((G = this._clientCapabilities) === null || G === void 0 ? void 0 : G.roots)) throw Error(`Client does not support listing roots (required for ${A})`);
          break;
        case "ping":
          break
      }
    }
    assertNotificationCapability(A) {
      var Q, B;
      switch (A) {
        case "notifications/message":
          if (!this._capabilities.logging) throw Error(`Server does not support logging (required for ${A})`);
          break;
        case "notifications/resources/updated":
        case "notifications/resources/list_changed":
          if (!this._capabilities.resources) throw Error(`Server does not support notifying about resources (required for ${A})`);
          break;
        case "notifications/tools/list_changed":
          if (!this._capabilities.tools) throw Error(`Server does not support notifying of tool list changes (required for ${A})`);
          break;
        case "notifications/prompts/list_changed":
          if (!this._capabilities.prompts) throw Error(`Server does not support notifying of prompt list changes (required for ${A})`);
          break;
        case "notifications/elicitation/complete":
          if (!((B = (Q = this._clientCapabilities) === null || Q === void 0 ? void 0 : Q.elicitation) === null || B === void 0 ? void 0 : B.url)) throw Error(`Client does not support URL elicitation (required for ${A})`);
          break;
        case "notifications/cancelled":
          break;
        case "notifications/progress":
          break
      }
    }
    assertRequestHandlerCapability(A) {
      if (!this._capabilities) return;
      switch (A) {
        case "completion/complete":
          if (!this._capabilities.completions) throw Error(`Server does not support completions (required for ${A})`);
          break;
        case "logging/setLevel":
          if (!this._capabilities.logging) throw Error(`Server does not support logging (required for ${A})`);
          break;
        case "prompts/get":
        case "prompts/list":
          if (!this._capabilities.prompts) throw Error(`Server does not support prompts (required for ${A})`);
          break;
        case "resources/list":
        case "resources/templates/list":
        case "resources/read":
          if (!this._capabilities.resources) throw Error(`Server does not support resources (required for ${A})`);
          break;
        case "tools/call":
        case "tools/list":
          if (!this._capabilities.tools) throw Error(`Server does not support tools (required for ${A})`);
          break;
        case "tasks/get":
        case "tasks/list":
        case "tasks/result":
        case "tasks/cancel":
          if (!this._capabilities.tasks) throw Error(`Server does not support tasks capability (required for ${A})`);
          break;
        case "ping":
        case "initialize":
          break
      }
    }
    assertTaskCapability(A) {
      var Q, B;
      jG1((B = (Q = this._clientCapabilities) === null || Q === void 0 ? void 0 : Q.tasks) === null || B === void 0 ? void 0 : B.requests, A, "Client")
    }
    assertTaskHandlerCapability(A) {
      var Q;
      if (!this._capabilities) return;
      _G1((Q = this._capabilities.tasks) === null || Q === void 0 ? void 0 : Q.requests, A, "Server")
    }
    async _oninitialize(A) {
      let Q = A.params.protocolVersion;
      return this._clientCapabilities = A.params.capabilities, this._clientVersion = A.params.clientInfo, {
        protocolVersion: O71.includes(Q) ? Q : Wr,
        capabilities: this.getCapabilities(),
        serverInfo: this._serverInfo,
        ...this._instructions && {
          instructions: this._instructions
        }
      }
    }
    getClientCapabilities() {
      return this._clientCapabilities
    }
    getClientVersion() {
      return this._clientVersion
    }
    getCapabilities() {
      return this._capabilities
    }
    async ping() {
      return this.request({
        method: "ping"
      }, Wd)
    }
    async createMessage(A, Q) {
      var B, G;
      if (A.tools || A.toolChoice) {
        if (!((G = (B = this._clientCapabilities) === null || B === void 0 ? void 0 : B.sampling) === null || G === void 0 ? void 0 : G.tools)) throw Error("Client does not support sampling tools capability.")
      }
      if (A.messages.length > 0) {
        let Z = A.messages[A.messages.length - 1],
          Y = Array.isArray(Z.content) ? Z.content : [Z.content],
          J = Y.some((W) => W.type === "tool_result"),
          X = A.messages.length > 1 ? A.messages[A.messages.length - 2] : void 0,
          I = X ? Array.isArray(X.content) ? X.content : [X.content] : [],
          D = I.some((W) => W.type === "tool_use");
        if (J) {
          if (Y.some((W) => W.type !== "tool_result")) throw Error("The last message must contain only tool_result content if any is present");
          if (!D) throw Error("tool_result blocks are not matching any tool_use from the previous message")
        }
        if (D) {
          let W = new Set(I.filter((V) => V.type === "tool_use").map((V) => V.id)),
            K = new Set(Y.filter((V) => V.type === "tool_result").map((V) => V.toolUseId));
          if (W.size !== K.size || ![...W].every((V) => K.has(V))) throw Error("ids of tool_result blocks and tool_use blocks from previous message do not match")
        }
      }
      if (A.tools) return this.request({
        method: "sampling/createMessage",
        params: A
      }, SY0, Q);
      return this.request({
        method: "sampling/createMessage",
        params: A
      }, VxA, Q)
    }
    async elicitInput(A, Q) {
      var B, G, Z, Y, J;
      switch ((B = A.mode) !== null && B !== void 0 ? B : "form") {
        case "url": {
          if (!((Z = (G = this._clientCapabilities) === null || G === void 0 ? void 0 : G.elicitation) === null || Z === void 0 ? void 0 : Z.url)) throw Error("Client does not support url elicitation.");
          let I = A;
          return this.request({
            method: "elicitation/create",
            params: I
          }, TKA, Q)
        }
        case "form": {
          if (!((J = (Y = this._clientCapabilities) === null || Y === void 0 ? void 0 : Y.elicitation) === null || J === void 0 ? void 0 : J.form)) throw Error("Client does not support form elicitation.");
          let I = A.mode === "form" ? A : {
              ...A,
              mode: "form"
            },
            D = await this.request({
              method: "elicitation/create",
              params: I
            }, TKA, Q);
          if (D.action === "accept" && D.content && I.requestedSchema) try {
            let K = this._jsonSchemaValidator.getValidator(I.requestedSchema)(D.content);
            if (!K.valid) throw new P9(q4.InvalidParams, `Elicitation response content does not match requested schema: ${K.errorMessage}`)
          } catch (W) {
            if (W instanceof P9) throw W;
            throw new P9(q4.InternalError, `Error validating elicitation response: ${W instanceof Error?W.message:String(W)}`)
          }
          return D
        }
      }
    }
    createElicitationCompletionNotifier(A, Q) {
      var B, G;
      if (!((G = (B = this._clientCapabilities) === null || B === void 0 ? void 0 : B.elicitation) === null || G === void 0 ? void 0 : G.url)) throw Error("Client does not support URL elicitation (required for notifications/elicitation/complete)");
      return () => this.notification({
        method: "notifications/elicitation/complete",
        params: {
          elicitationId: A
        }
      }, Q)
    }
    async listRoots(A, Q) {
      return this.request({
        method: "roots/list",
        params: A
      }, vY0, Q)
    }
    async sendLoggingMessage(A, Q) {
      if (this._capabilities.logging) {
        if (!this.isMessageIgnored(A.level, Q)) return this.notification({
          method: "notifications/message",
          params: A
        })
      }
    }
    async sendResourceUpdated(A) {
      return this.notification({
        method: "notifications/resources/updated",
        params: A
      })
    }
    async sendResourceListChanged() {
      return this.notification({
        method: "notifications/resources/list_changed"
      })
    }
    async sendToolListChanged() {
      return this.notification({
        method: "notifications/tools/list_changed"
      })
    }
    async sendPromptListChanged() {
      return this.notification({
        method: "notifications/prompts/list_changed"
      })
    }
  }
})
// @from(Ln 430870, Col 0)
function BH7(A) {
  return "result" in A || "error" in A
}
// @from(Ln 430874, Col 0)
function GH7(A) {
  return "method" in A && typeof A.method === "string"
}
// @from(Ln 430877, Col 0)
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
  reconnectTimer = null;
  context;
  constructor(A) {
    this.context = A
  }
  async connect() {
    let {
      serverName: A,
      logger: Q
    } = this.context;
    if (this.connecting) {
      Q.info(`[${A}] Already connecting, skipping duplicate attempt`);
      return
    }
    this.closeSocket(), this.connecting = !0;
    let B = this.context.socketPath;
    Q.info(`[${A}] Attempting to connect to: ${B}`);
    try {
      await this.validateSocketSecurity(B)
    } catch (G) {
      this.connecting = !1, Q.info(`[${A}] Security validation failed:`, G);
      return
    }
    this.socket = QH7(B), this.socket.on("connect", () => {
      this.connected = !0, this.connecting = !1, this.reconnectAttempts = 0, Q.info(`[${A}] Successfully connected to bridge server`)
    }), this.socket.on("data", (G) => {
      this.responseBuffer = Buffer.concat([this.responseBuffer, G]);
      while (this.responseBuffer.length >= 4) {
        let Z = this.responseBuffer.readUInt32LE(0);
        if (this.responseBuffer.length < 4 + Z) break;
        let Y = this.responseBuffer.slice(4, 4 + Z);
        this.responseBuffer = this.responseBuffer.slice(4 + Z);
        try {
          let J = JSON.parse(Y.toString("utf-8"));
          if (GH7(J)) {
            if (Q.info(`[${A}] Received notification: ${J.method}`), this.notificationHandler) this.notificationHandler(J)
          } else if (BH7(J)) Q.info(`[${A}] Received tool response: ${J}`), this.handleResponse(J);
          else Q.info(`[${A}] Received unknown message: ${J}`)
        } catch (J) {
          Q.info(`[${A}] Failed to parse message:`, J)
        }
      }
    }), this.socket.on("error", (G) => {
      if (Q.info(`[${A}] Socket error:`, G), this.connected = !1, this.connecting = !1, G.code && ["ECONNREFUSED", "ECONNRESET", "EPIPE"].includes(G.code)) this.scheduleReconnect()
    }), this.socket.on("close", () => {
      this.connected = !1, this.connecting = !1, this.scheduleReconnect()
    })
  }
  scheduleReconnect() {
    let {
      serverName: A,
      logger: Q
    } = this.context;
    if (this.reconnectTimer) {
      Q.info(`[${A}] Reconnect already scheduled, skipping`);
      return
    }
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      Q.info(`[${A}] Max reconnection attempts reached`), this.cleanup();
      return
    }
    this.reconnectAttempts++;
    let B = Math.min(this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1), 30000);
    Q.info(`[${A}] Reconnecting in ${Math.round(B)}ms (attempt ${this.reconnectAttempts})`), this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null, this.connect()
    }, B)
  }
  handleResponse(A) {
    if (this.responseCallback) {
      let Q = this.responseCallback;
      this.responseCallback = null, Q(A)
    }
  }
  setNotificationHandler(A) {
    this.notificationHandler = A
  }
  async ensureConnected() {
    let {
      serverName: A
    } = this.context;
    if (this.connected && this.socket) return !0;
    if (!this.socket && !this.connecting) await this.connect();
    return new Promise((Q, B) => {
      let G = setTimeout(() => {
          B(new z8A(`[${A}] Connection attempt timed out after 5000ms`))
        }, 5000),
        Z = () => {
          if (this.connected) clearTimeout(G), Q(!0);
          else setTimeout(Z, 100)
        };
      Z()
    })
  }
  async sendRequest(A, Q = 30000) {
    let {
      serverName: B
    } = this.context;
    if (!this.socket) throw new z8A(`[${B}] Cannot send request: not connected`);
    let G = this.socket;
    return new Promise((Z, Y) => {
      let J = setTimeout(() => {
        this.responseCallback = null, Y(new z8A(`[${B}] Tool request timed out after ${Q}ms`))
      }, Q);
      this.responseCallback = (K) => {
        clearTimeout(J), Z(K)
      };
      let X = JSON.stringify(A),
        I = Buffer.from(X, "utf-8"),
        D = Buffer.allocUnsafe(4);
      D.writeUInt32LE(I.length, 0);
      let W = Buffer.concat([D, I]);
      G.write(W)
    })
  }
  async callTool(A, Q) {
    let B = {
      method: "execute_tool",
      params: {
        client_id: this.context.clientTypeId,
        tool: A,
        args: Q
      }
    };
    return this.sendRequestWithRetry(B)
  }
  async sendRequestWithRetry(A) {
    let {
      serverName: Q,
      logger: B
    } = this.context;
    try {
      return await this.sendRequest(A)
    } catch (G) {
      if (!(G instanceof z8A)) throw G;
      return B.info(`[${Q}] Connection error, forcing reconnect and retrying: ${G.message}`), this.closeSocket(), await this.ensureConnected(), await this.sendRequest(A)
    }
  }
  isConnected() {
    return this.connected
  }
  closeSocket() {
    if (this.socket) this.socket.removeAllListeners(), this.socket.end(), this.socket.destroy(), this.socket = null;
    this.connected = !1, this.connecting = !1
  }
  cleanup() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
    this.closeSocket(), this.reconnectAttempts = 0, this.responseBuffer = Buffer.alloc(0), this.responseCallback = null
  }
  disconnect() {
    this.cleanup()
  }
  async validateSocketSecurity(A) {
    let {
      serverName: Q,
      logger: B
    } = this.context;
    if (AH7() === "win32") return;
    try {
      let G = await eF7.stat(A);
      if (!G.isSocket()) throw Error(`[${Q}] Path exists but it's not a socket: ${A}`);
      let Z = G.mode & 511;
      if (Z !== 384) throw Error(`[${Q}] Insecure socket permissions: ${Z.toString(8)} (expected 0600). Socket may have been tampered with. `);
      let Y = process.getuid?.();
      if (Y !== void 0 && G.uid !== Y) throw Error(`Socket not owned by current user (uid: ${Y}, socket uid: ${G.uid}). Potential security risk.`);
      B.info(`[${Q}] Socket security validation passed`)
    } catch (G) {
      if (G.code === "ENOENT") {
        B.info(`[${Q}] Socket not found, will be created by server`);
        return
      }
      throw G
    }
  }
}
// @from(Ln 431062, Col 0)
function QZ9(A) {
  return new AZ9(A)
}
// @from(Ln 431065, Col 4)
z8A
// @from(Ln 431066, Col 4)
TT0 = w(() => {
  z8A = class z8A extends Error {
    constructor(A) {
      super(A);
      this.name = "SocketConnectionError"
    }
  }
})
// @from(Ln 431074, Col 0)
async function ZH7(A, Q, B, G) {
  let Z = await Q.callTool(B, G);
  if (A.logger.info(`[${A.serverName}] Received result from socket bridge: ${JSON.stringify(Z)}`), Z === null || Z === void 0) return {
    content: [{
      type: "text",
      text: "Tool execution completed"
    }]
  };
  let {
    result: Y,
    error: J
  } = Z, X = J || Y, I = !!J;
  if (!X) return {
    content: [{
      type: "text",
      text: "Tool execution completed"
    }]
  };
  if (I && YH7(X.content)) A.onAuthenticationError();
  let {
    content: D
  } = X;
  if (D && Array.isArray(D)) {
    if (I) return {
      content: D.map((K) => {
        if (typeof K === "object" && K !== null && "type" in K) return K;
        return {
          type: "text",
          text: String(K)
        }
      }),
      isError: !0
    };
    return {
      content: D.map((K) => {
        if (typeof K === "object" && K !== null && "type" in K && "source" in K) {
          let V = K;
          if (V.type === "image" && typeof V.source === "object" && V.source !== null && "data" in V.source) return {
            type: "image",
            data: V.source.data,
            mimeType: "media_type" in V.source ? V.source.media_type || "image/png" : "image/png"
          }
        }
        if (typeof K === "object" && K !== null && "type" in K) return K;
        return {
          type: "text",
          text: String(K)
        }
      }),
      isError: I
    }
  }
  if (typeof D === "string") return {
    content: [{
      type: "text",
      text: D
    }],
    isError: I
  };
  return A.logger.warn(`[${A.serverName}] Unexpected result format from socket bridge`, Z), {
    content: [{
      type: "text",
      text: JSON.stringify(Z)
    }],
    isError: I
  }
}
// @from(Ln 431142, Col 0)
function BZ9(A) {
  return {
    content: [{
      type: "text",
      text: A.onToolCallDisconnected()
    }]
  }
}
// @from(Ln 431151, Col 0)
function YH7(A) {
  return (Array.isArray(A) ? A.map((B) => {
    if (typeof B === "string") return B;
    if (typeof B === "object" && B !== null && "text" in B && typeof B.text === "string") return B.text;
    return ""
  }).join(" ") : String(A)).toLowerCase().includes("re-authenticated")
}
// @from(Ln 431158, Col 4)
GZ9 = async (A, Q, B, G) => {
  try {
    let Z = await Q.ensureConnected();
    if (A.logger.info(`[${A.serverName}] Server is connected: ${Z}. Received tool call: ${B} with args: ${JSON.stringify(G)}.`), Z) return await ZH7(A, Q, B, G);
    return BZ9(A)
  } catch (Z) {
    if (A.logger.info(`[${A.serverName}] Error calling tool:`, Z), Z instanceof z8A) return BZ9(A);
    return {
      content: [{
        type: "text",
        text: `Error calling tool, please try again. : ${Z instanceof Error?Z.message:String(Z)}`
      }],
      isError: !0
    }
  }
}
// @from(Ln 431174, Col 4)
ZZ9 = w(() => {
  TT0()
})
// @from(Ln 431178, Col 0)
function PT0(A) {
  let {
    serverName: Q,
    logger: B
  } = A, G = QZ9(A), Z = new WuA({
    name: Q,
    version: "1.0.0"
  }, {
    capabilities: {
      tools: {},
      logging: {}
    }
  });
  return Z.setRequestHandler(DxA, async () => {
    if (A.isDisabled?.()) return {
      tools: []
    };
    return {
      tools: Pe
    }
  }), Z.setRequestHandler(n9A, async (Y) => {
    return B.info(`[${Q}] Executing tool: ${Y.params.name}`), await GZ9(A, G, Y.params.name, Y.params.arguments || {})
  }), G.setNotificationHandler((Y) => {
    B.info(`[${Q}] Forwarding MCP notification: ${Y.method}`), Z.notification({
      method: Y.method,
      params: Y.params
    }).catch((J) => {
      B.info(`[${Q}] Failed to forward MCP notification: ${J.message}`)
    })
  }), G.ensureConnected().catch((Y) => {
    B.info(`[${Q}] Initial socket connection failed:`, Y)
  }), Z
}
// @from(Ln 431211, Col 4)
YZ9 = w(() => {
  jT0();
  eK();
  RT0();
  TT0();
  ZZ9()
})
// @from(Ln 431218, Col 4)
KuA = w(() => {
  RT0();
  YZ9()
})
// @from(Ln 431223, Col 0)
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
// @from(Ln 431273, Col 4)
JZ9 = `
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
// @from(Ln 431321, Col 2)
XZ9 = `
**IMPORTANT: Before using any chrome browser tools, you MUST first load them using MCPSearch.**

Chrome browser tools are MCP tools that require loading before use. Before calling any mcp__claude-in-chrome__* tool:
1. Use MCPSearch with \`select:mcp__claude-in-chrome__<tool_name>\` to load the specific tool
2. Then call the tool

For example, to get tab context:
1. First: MCPSearch with query "select:mcp__claude-in-chrome__tabs_context_mcp"
2. Then: Call mcp__claude-in-chrome__tabs_context_mcp

`
// @from(Ln 431333, Col 2)
xT0 = `

**Browser Automation**: Chrome browser tools are available via the "claude-in-chrome" skill. CRITICAL: Before using any mcp__claude-in-chrome__* tools, invoke the skill by calling the Skill tool with skill: "claude-in-chrome". The skill provides browser automation instructions and enables the tools.

`
// @from(Ln 431356, Col 0)
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
// @from(Ln 431367, Col 0)
function I$A() {
  if (iz1 !== void 0) return iz1;
  return iz1 = e5A() && FH7() && ZZ("tengu_chrome_auto_enable", !1), iz1
}
// @from(Ln 431372, Col 0)
function oz1() {
  let A = LG(),
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
// @from(Ln 431408, Col 0)
function KH7() {
  let A = $Q(),
    Q = EZ9();
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
      return null
  }
}
// @from(Ln 431425, Col 0)
async function WZ9(A) {
  let Q = KH7();
  if (!Q) throw Error("Claude in Chrome Native Host not supported on this platform");
  let B = xU(Q, WH7),
    G = {
      name: nz1,
      description: "Claude Code Browser Extension Native Host",
      path: A,
      type: "stdio",
      allowed_origins: ["chrome-extension://fcoeoabgfenejglbffodgkkbkcdhcgfn/", ...[]]
    },
    Z = eA(G, null, 2);
  if (await FZ9(B, "utf-8").catch(() => null) === Z) return;
  if (await VZ9(Q, {
      recursive: !0
    }), await HZ9(B, Z), $Q() === "windows") VH7(B);
  k(`[Claude in Chrome] Installed Chrome native host manifest at: ${B}`), qp().then((J) => {
    if (J) k("[Claude in Chrome] First-time install detected, opening reconnect page in Chrome"), mEA(DH7);
    else k("[Claude in Chrome] First-time install detected, but extension not installed, skipping reconnect")
  })
}
// @from(Ln 431447, Col 0)
function VH7(A) {
  J2("reg", ["add", `${DZ9}`, "/ve", "/t", "REG_SZ", "/d", A, "/f"]).then((Q) => {
    if (Q.code === 0) k(`[Claude in Chrome] Registered Chrome native host in Windows registry: ${DZ9}\\${nz1}`);
    else k(`[Claude in Chrome] Failed to register Chrome native host in Windows registry: ${Q.stderr}`)
  })
}
// @from(Ln 431453, Col 0)
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
  if (await VZ9(B, {
      recursive: !0
    }), await HZ9(G, Z), Q !== "windows") await JH7(G, 493);
  return k(`[Claude in Chrome] Created Chrome native host wrapper script: ${G}`), G
}
// @from(Ln 431473, Col 0)
function FH7() {
  return qp().then((Q) => {
    if (L1().cachedChromeExtensionInstalled !== Q) S0((G) => ({
      ...G,
      cachedChromeExtensionInstalled: Q
    }))
  }), L1().cachedChromeExtensionInstalled ?? !1
}
// @from(Ln 431481, Col 0)
async function qp() {
  let A = HH7();
  if (!A) return k(`[Claude in Chrome] Unsupported platform for extension detection: ${$Q()}`), !1;
  let Q = [];
  try {
    await IZ9(A), Q = await XH7(A, {
      withFileTypes: !0
    })
  } catch {
    return k(`[Claude in Chrome] Chrome base path does not exist: ${A}`), !1
  }
  let B = Q.filter((Z) => Z.isDirectory()).filter((Z) => Z.name === "Default" || Z.name.startsWith("Profile ")).map((Z) => Z.name);
  k(`[Claude in Chrome] Found Chrome profiles: ${B.join(", ")}`);
  let G = ["fcoeoabgfenejglbffodgkkbkcdhcgfn"];
  for (let Z of B)
    for (let Y of G) {
      let J = xU(A, Z, "Extensions", Y);
      try {
        return await IZ9(J), k(`[Claude in Chrome] Extension ${Y} found in ${Z}`), !0
      } catch {}
    }
  return k("[Claude in Chrome] Extension not found in any profile"), !1
}
// @from(Ln 431505, Col 0)
function HH7() {
  let A = $Q(),
    Q = EZ9();
  switch (A) {
    case "macos":
      return xU(Q, "Library", "Application Support", "Google", "Chrome");
    case "windows": {
      let B = xU(Q, "AppData", "Local");
      return xU(B, "Google", "Chrome", "User Data")
    }
    case "linux":
    case "wsl":
      return xU(Q, ".config", "google-chrome");
    default:
      return null
  }
}
// @from(Ln 431522, Col 4)
DH7 = "https://clau.de/chrome/reconnect"
// @from(Ln 431523, Col 2)
nz1 = "com.anthropic.claude_code_browser_extension"
// @from(Ln 431524, Col 2)
WH7
// @from(Ln 431524, Col 7)
DZ9
// @from(Ln 431524, Col 12)
iz1 = void 0
// @from(Ln 431525, Col 4)
Se = w(() => {
  c3();
  T1();
  t4();
  fQ();
  C0();
  KuA();
  Ox();
  GQ();
  A0();
  w6();
  WH7 = `${nz1}.json`, DZ9 = `HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${nz1}`
})
// @from(Ln 431539, Col 0)
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
        S0((j) => ({
          ...j,
          claudeInChromeDefaultEnabled: _
        })), D(_);
        break
      }
    }
  }
  let $ = [],
    O = V ? "" : " (requires extension)";
  if (!V) $.push({
    label: "Install Chrome extension",
    value: "install-extension"
  });
  return $.push({
    label: P7.default.createElement(P7.default.Fragment, null, P7.default.createElement(C, null, "Manage permissions"), P7.default.createElement(C, {
      dimColor: !0
    }, O)),
    value: "manage-permissions"
  }, {
    label: P7.default.createElement(P7.default.Fragment, null, P7.default.createElement(C, null, "Reconnect extension"), P7.default.createElement(C, {
      dimColor: !0
    }, O)),
    value: "reconnect"
  }, {
    label: `Enabled by default: ${I?"Yes":"No"}`,
    value: "toggle-default"
  }), P7.default.createElement(o9, {
    title: "Claude in Chrome (Beta)",
    onCancel: () => A(),
    color: "chromeYellow"
  }, P7.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, P7.default.createElement(C, null, "Claude in Chrome works with the Chrome extension to let you control your browser directly from Claude Code. Navigate websites, fill forms, capture screenshots, record GIFs, and debug with console logs and network requests."), Z && P7.default.createElement(C, {
    color: "error"
  }, "Claude in Chrome is not supported in WSL at this time."), !G && P7.default.createElement(C, {
    color: "error"
  }, "Claude in Chrome requires a claude.ai subscription."), !(Z || !G) && P7.default.createElement(P7.default.Fragment, null, P7.default.createElement(T, {
    flexDirection: "column"
  }, P7.default.createElement(C, null, "Status:", " ", E ? P7.default.createElement(C, {
    color: "success"
  }, "Enabled") : P7.default.createElement(C, {
    color: "inactive"
  }, "Disabled")), P7.default.createElement(C, null, "Extension:", " ", V ? P7.default.createElement(C, {
    color: "success"
  }, "Installed") : P7.default.createElement(C, {
    color: "warning"
  }, "Not detected"))), P7.default.createElement(k0, {
    key: J,
    options: $,
    onChange: z,
    hideIndexes: !0
  }), W && P7.default.createElement(C, {
    color: "warning"
  }, "Once installed, select ", '"Reconnect extension"', " to connect."), P7.default.createElement(C, null, P7.default.createElement(C, {
    dimColor: !0
  }, "Usage: "), P7.default.createElement(C, null, "claude --chrome"), P7.default.createElement(C, {
    dimColor: !0
  }, " or "), P7.default.createElement(C, null, "claude --no-chrome")), P7.default.createElement(C, {
    dimColor: !0
  }, "Site-level permissions are inherited from the Chrome extension. Manage permissions in the Chrome extension settings to control which sites Claude can browse, click, and type on.")), P7.default.createElement(C, {
    dimColor: !0
  }, "Learn more: https://code.claude.com/docs/en/chrome")))
}
// @from(Ln 431628, Col 0)
async function UH7(A) {
  let Q = await qp(),
    B = L1(),
    G = qB(),
    Z = l0.isWslEnvironment();
  return P7.default.createElement(CH7, {
    onDone: A,
    isExtensionInstalled: Q,
    configEnabled: B.claudeInChromeDefaultEnabled,
    isClaudeAISubscriber: G,
    isWSL: Z
  })
}
// @from(Ln 431641, Col 4)
P7
// @from(Ln 431641, Col 8)
VuA
// @from(Ln 431641, Col 13)
EH7 = "https://claude.ai/chrome"
// @from(Ln 431642, Col 2)
zH7 = "https://clau.de/chrome/permissions"
// @from(Ln 431643, Col 2)
$H7 = "https://clau.de/chrome/reconnect"
// @from(Ln 431644, Col 2)
qH7
// @from(Ln 431644, Col 7)
zZ9
// @from(Ln 431645, Col 4)
$Z9 = w(() => {
  fA();
  Se();
  Ox();
  GQ();
  C0();
  rY();
  W8();
  hB();
  Q2();
  p3();
  P7 = c(QA(), 1), VuA = c(QA(), 1);
  qH7 = {
    name: "chrome",
    description: "Claude in Chrome (Beta) settings",
    isEnabled: () => !p2(),
    isHidden: !1,
    type: "local-jsx",
    userFacingName: () => "chrome",
    call: UH7
  }, zZ9 = qH7
})
// @from(Ln 431667, Col 4)
NH7
// @from(Ln 431667, Col 9)
CZ9
// @from(Ln 431668, Col 4)
UZ9 = w(() => {
  TN();
  NH7 = {
    type: "local",
    name: "stickers",
    description: "Order Claude Code stickers",
    isEnabled: () => !0,
    isHidden: !1,
    supportsNonInteractive: !1,
    async call() {
      if (await i7("https://www.stickermule.com/claudecode")) return {
        type: "text",
        value: "Opening sticker page in browser…"
      };
      else return {
        type: "text",
        value: "Failed to open browser. Visit: https://www.stickermule.com/claudecode"
      }
    },
    userFacingName() {
      return "stickers"
    }
  }, CZ9 = NH7
})
// @from(Ln 431692, Col 4)
rz1 = () => {}
// @from(Ln 431693, Col 4)
LH7
// @from(Ln 431693, Col 9)
qZ9
// @from(Ln 431694, Col 4)
NZ9 = w(() => {
  fA();
  IY();
  P4();
  E9();
  rz1();
  LH7 = c(QA(), 1), qZ9 = c(QA(), 1)
})
// @from(Ln 431702, Col 4)
MH7
// @from(Ln 431702, Col 9)
wZ9
// @from(Ln 431703, Col 4)
LZ9 = w(() => {
  fA();
  E9();
  rz1();
  G$();
  A0();
  MH7 = c(QA(), 1), wZ9 = c(QA(), 1)
})
// @from(Ln 431711, Col 4)
RH7
// @from(Ln 431711, Col 9)
OZ9
// @from(Ln 431712, Col 4)
yT0 = w(() => {
  fA();
  E9();
  yG();
  QVA();
  Hp();
  Z0();
  RH7 = c(QA(), 1), OZ9 = c(QA(), 1)
})
// @from(Ln 431721, Col 4)
_H7
// @from(Ln 431722, Col 4)
MZ9 = w(() => {
  rz1();
  _H7 = c(QA(), 1)
})
// @from(Ln 431726, Col 4)
TH7
// @from(Ln 431726, Col 9)
RZ9
// @from(Ln 431727, Col 4)
_Z9 = w(() => {
  C0();
  hB();
  Z0();
  NZ9();
  LZ9();
  yT0();
  MZ9();
  TH7 = c(QA(), 1), RZ9 = c(QA(), 1)
})
// @from(Ln 431737, Col 4)
FuA
// @from(Ln 431738, Col 4)
HuA = w(() => {
  FuA = {
    serverNamePatterns: ["figma"],
    screenshotTool: "get_screenshot",
    displayName: "Figma",
    inputPlaceholder: "Paste Figma link with node-id",
    exampleFormat: "https://figma.com/design/.../...?node-id=63-367"
  }
})
// @from(Ln 431747, Col 4)
xH7
// @from(Ln 431747, Col 9)
yH7
// @from(Ln 431748, Col 4)
jZ9 = w(() => {
  fA();
  IY();
  P4();
  E9();
  HuA();
  xH7 = c(QA(), 1), yH7 = c(QA(), 1)
})
// @from(Ln 431756, Col 4)
vH7
// @from(Ln 431756, Col 9)
TZ9
// @from(Ln 431757, Col 4)
PZ9 = w(() => {
  fA();
  E9();
  HuA();
  G$();
  A0();
  vH7 = c(QA(), 1), TZ9 = c(QA(), 1)
})
// @from(Ln 431765, Col 4)
kH7
// @from(Ln 431766, Col 4)
SZ9 = w(() => {
  HuA();
  kH7 = c(QA(), 1)
})
// @from(Ln 431770, Col 4)
bH7
// @from(Ln 431770, Col 9)
xZ9
// @from(Ln 431771, Col 4)
yZ9 = w(() => {
  C0();
  hB();
  Z0();
  jZ9();
  PZ9();
  yT0();
  SZ9();
  bH7 = c(QA(), 1), xZ9 = c(QA(), 1)
})
// @from(Ln 431782, Col 0)
function sz1(A) {
  let Q = {
    type: "prompt",
    name: A.name,
    description: A.description,
    hasUserSpecifiedDescription: !0,
    allowedTools: A.allowedTools ?? [],
    argumentHint: A.argumentHint,
    whenToUse: A.whenToUse,
    model: A.model,
    disableModelInvocation: A.disableModelInvocation ?? !1,
    userInvocable: A.userInvocable ?? !0,
    contentLength: 0,
    source: "bundled",
    loadedFrom: "bundled",
    hooks: A.hooks,
    context: A.context,
    agent: A.agent,
    isEnabled: A.isEnabled ?? (() => !0),
    isHidden: !(A.userInvocable ?? !0),
    progressMessage: "running",
    userFacingName: () => A.name,
    getPromptForCommand: A.getPromptForCommand
  };
  vZ9.push(Q)
}
// @from(Ln 431809, Col 0)
function kZ9() {
  return [...vZ9]
}
// @from(Ln 431812, Col 4)
vZ9
// @from(Ln 431813, Col 4)
tz1 = w(() => {
  vZ9 = []
})
// @from(Ln 431816, Col 4)
fH7
// @from(Ln 431816, Col 9)
bZ9
// @from(Ln 431817, Col 4)
fZ9 = w(() => {
  fA();
  W8();
  zgA();
  yG();
  Vb();
  t4();
  Z0();
  rY();
  fH7 = c(QA(), 1), bZ9 = c(QA(), 1)
})
// @from(Ln 431828, Col 4)
x8J
// @from(Ln 431829, Col 4)
hZ9 = w(() => {
  fZ9();
  yJ();
  x8J = c(QA(), 1)
})
// @from(Ln 431835, Col 0)
function uH7() {
  return Wg(gH7) ?? "Goodbye!"
}
// @from(Ln 431838, Col 4)
hH7
// @from(Ln 431838, Col 9)
gH7
// @from(Ln 431838, Col 14)
mH7
// @from(Ln 431838, Col 19)
ez1
// @from(Ln 431839, Col 4)
vT0 = w(() => {
  HUA();
  yJ();
  zgA();
  hZ9();
  hH7 = c(QA(), 1), gH7 = ["Goodbye!", "See ya!", "Bye!", "Catch you later!"];
  mH7 = {
    type: "local-jsx",
    name: "exit",
    aliases: ["quit"],
    description: "Exit the REPL",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A) {
      return A(uH7()), await w3(0, "prompt_input_exit"), null
    },
    userFacingName() {
      return "exit"
    }
  }, ez1 = mH7
})
// @from(Ln 431864, Col 0)
function gZ9({
  content: A,
  defaultFilename: Q,
  onDone: B
}) {
  let [, G] = $8A.useState(null), [Z, Y] = $8A.useState(Q), [J, X] = $8A.useState(Q.length), [I, D] = $8A.useState(!1), W = MQ(), K = $8A.useCallback(() => {
    if (I) D(!1), G(null);
    else B({
      success: !1,
      message: "Export cancelled"
    })
  }, [I, B]);
  return H2("confirm:no", K, {
    context: "Confirmation"
  }), JJ.default.createElement(T, {
    width: "100%",
    flexDirection: "column"
  }, JJ.default.createElement(T, {
    borderStyle: "round",
    borderColor: "permission",
    flexDirection: "column",
    padding: 1,
    width: "100%"
  }, JJ.default.createElement(T, null, JJ.default.createElement(C, {
    color: "permission",
    bold: !0
  }, "Export Conversation")), !I ? JJ.default.createElement(JJ.default.Fragment, null, JJ.default.createElement(T, {
    marginTop: 1
  }, JJ.default.createElement(C, {
    dimColor: !0
  }, "Select export method:")), JJ.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, JJ.default.createElement(k0, {
    options: [{
      label: "Copy to clipboard",
      value: "clipboard",
      description: "Copy the conversation to your system clipboard"
    }, {
      label: "Save to file",
      value: "file",
      description: "Save the conversation to a file in the current directory"
    }],
    onChange: async (E) => {
      if (E === "clipboard")
        if (await Gp(A)) B({
          success: !0,
          message: "Conversation copied to clipboard"
        });
        else B({
          success: !1,
          message: AgA()
        });
      else if (E === "file") G("file"), D(!0)
    },
    onCancel: () => B({
      success: !1,
      message: "Export cancelled"
    })
  }))) : JJ.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, JJ.default.createElement(C, null, "Enter filename:"), JJ.default.createElement(T, {
    flexDirection: "row",
    gap: 1,
    marginTop: 1
  }, JJ.default.createElement(C, null, ">"), JJ.default.createElement(p4, {
    value: Z,
    onChange: Y,
    onSubmit: () => {
      let E = Z.endsWith(".txt") ? Z : Z.replace(/\.[^.]+$/, "") + ".txt",
        z = dH7(o1(), E);
      try {
        bB(z, A, {
          encoding: "utf-8",
          flush: !0
        }), B({
          success: !0,
          message: `Conversation exported to: ${E}`
        })
      } catch ($) {
        B({
          success: !1,
          message: `Failed to export conversation: ${$ instanceof Error?$.message:"Unknown error"}`
        })
      }
    },
    focus: !0,
    showCursor: !0,
    columns: process.stdout.columns || 80,
    cursorOffset: J,
    onChangeCursorOffset: X
  })))), JJ.default.createElement(T, {
    marginLeft: 2
  }, I ? JJ.default.createElement(C, {
    dimColor: !0
  }, JJ.default.createElement(vQ, null, JJ.default.createElement(F0, {
    shortcut: "Enter",
    action: "save"
  }), JJ.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "go back"
  }))) : JJ.default.createElement(JJ.default.Fragment, null, W.pending ? JJ.default.createElement(C, {
    dimColor: !0
  }, "Press ", W.keyName, " again to exit") : JJ.default.createElement(C, {
    dimColor: !0
  }, JJ.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  })))))
}
// @from(Ln 431979, Col 4)
JJ
// @from(Ln 431979, Col 8)
$8A
// @from(Ln 431980, Col 4)
uZ9 = w(() => {
  fA();
  W8();
  IY();
  E9();
  V2();
  A0();
  OzA();
  e9();
  I3();
  K6();
  c6();
  JJ = c(QA(), 1), $8A = c(QA(), 1)
})
// @from(Ln 431994, Col 0)
async function mZ9(A, Q = []) {
  return xzA(A$1.default.createElement(() => A$1.default.createElement(b5, null, A$1.default.createElement(we, {
    messages: A,
    normalizedMessageHistory: [],
    tools: Q,
    commands: [],
    verbose: !1,
    toolJSX: null,
    toolUseConfirmQueue: [],
    inProgressToolUseIDs: new Set,
    isMessageSelectorVisible: !1,
    conversationId: "export",
    screen: "prompt",
    screenToggleId: 0,
    streamingToolUses: [],
    showAllInTranscript: !0,
    isLoading: !1
  })), null))
}
// @from(Ln 432013, Col 4)
A$1
// @from(Ln 432014, Col 4)
kT0 = w(() => {
  WgA();
  agA();
  hB();
  A$1 = c(QA(), 1)
})
// @from(Ln 432024, Col 0)
function pH7(A) {
  let Q = A.getFullYear(),
    B = String(A.getMonth() + 1).padStart(2, "0"),
    G = String(A.getDate()).padStart(2, "0"),
    Z = String(A.getHours()).padStart(2, "0"),
    Y = String(A.getMinutes()).padStart(2, "0"),
    J = String(A.getSeconds()).padStart(2, "0");
  return `${Q}-${B}-${G}-${Z}${Y}${J}`
}
// @from(Ln 432034, Col 0)
function lH7(A) {
  let Q = A.find((Z) => Z.type === "user");
  if (!Q || Q.type !== "user") return "";
  let B = Q.message?.content,
    G = "";
  if (typeof B === "string") G = B.trim();
  else if (Array.isArray(B)) {
    let Z = B.find((Y) => Y.type === "text");
    if (Z && "text" in Z) G = Z.text.trim()
  }
  if (G = G.split(`
`)[0] || "", G.length > 50) G = G.substring(0, 50) + "...";
  return G
}
// @from(Ln 432049, Col 0)
function iH7(A) {
  return A.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}
// @from(Ln 432052, Col 0)
async function nH7(A) {
  let Q = A.options.tools || [];
  return mZ9(A.messages, Q)
}
// @from(Ln 432056, Col 4)
dZ9
// @from(Ln 432056, Col 9)
aH7
// @from(Ln 432056, Col 14)
cZ9
// @from(Ln 432057, Col 4)
pZ9 = w(() => {
  uZ9();
  kT0();
  V2();
  A0();
  JZ();
  dZ9 = c(QA(), 1);
  aH7 = {
    type: "local-jsx",
    name: "export",
    description: "Export the current conversation to a file or clipboard",
    isEnabled: () => !0,
    isHidden: !1,
    argumentHint: "[filename]",
    async call(A, Q, B) {
      T9("export");
      let G = await nH7(Q);
      if (B.trim()) {
        let X = B.trim(),
          I = X.endsWith(".txt") ? X : X.replace(/\.[^.]+$/, "") + ".txt",
          D = cH7(o1(), I);
        try {
          return bB(D, G, {
            encoding: "utf-8",
            flush: !0
          }), A(`Conversation exported to: ${I}`), null
        } catch (W) {
          return A(`Failed to export conversation: ${W instanceof Error?W.message:"Unknown error"}`), null
        }
      }
      let Z = lH7(Q.messages),
        Y = pH7(new Date),
        J;
      if (Z) {
        let X = iH7(Z);
        J = X ? `${Y.substring(0,10)}-${X}.txt` : `conversation-${Y}.txt`
      } else J = `conversation-${Y}.txt`;
      return dZ9.default.createElement(gZ9, {
        content: G,
        defaultFilename: J,
        onDone: (X) => {
          A(X.message)
        }
      })
    },
    userFacingName() {
      return "export"
    }
  }, cZ9 = aH7
})
// @from(Ln 432108, Col 0)
function oH7({
  onDone: A
}) {
  let [{
    mainLoopModel: Q,
    mainLoopModelForSession: B
  }, G] = a0();
  H2("confirm:no", () => {
    l("tengu_model_command_menu", {
      action: "cancel"
    });
    let Y = Q ?? mn().label;
    A(`Kept model as ${I1.bold(Y)}`, {
      display: "system"
    })
  }, {
    context: "Confirmation"
  });

  function Z(Y, J) {
    l("tengu_model_command_menu", {
      action: Y,
      from_model: Q,
      to_model: Y
    }), G((I) => ({
      ...I,
      mainLoopModel: Y,
      mainLoopModelForSession: null
    }));
    let X = `Set model to ${I1.bold(eT(Y))}`;
    if (J !== void 0) X += ` with ${I1.bold(J)} effort`;
    A(X)
  }
  return gx.createElement(jzA, {
    initial: Q,
    sessionModel: B,
    onSelect: Z,
    isStandaloneCommand: !0
  })
}
// @from(Ln 432149, Col 0)
function rH7({
  args: A,
  onDone: Q
}) {
  let [B, G] = a0(), Z = A === "default" ? null : A;
  return gx.useEffect(() => {
    async function Y() {
      if (Z && tH7(Z)) {
        let X = ju() ? "turn on /extra-usage or " : "";
        Q(`Your plan doesn't include Opus in Claude Code. You can ${X}/upgrade to Max to access it.`, {
          display: "system"
        });
        return
      }
      if (!Z) {
        J(null);
        return
      }
      if (sH7(Z)) {
        J(Z);
        return
      }
      try {
        let {
          valid: X,
          error: I
        } = await HK1(Z);
        if (X) J(Z);
        else Q(I || `Model '${Z}' not found`, {
          display: "system"
        })
      } catch (X) {
        Q(`Failed to validate model: ${X.message}`, {
          display: "system"
        })
      }
    }

    function J(X) {
      G((I) => ({
        ...I,
        mainLoopModel: X,
        mainLoopModelForSession: null
      })), Q(`Set model to ${I1.bold(eT(X))}`)
    }
    Y()
  }, [Z, Q, G]), null
}
// @from(Ln 432198, Col 0)
function sH7(A) {
  return nJA.includes(A.toLowerCase().trim())
}
// @from(Ln 432202, Col 0)
function tH7(A) {
  return qB() && !MR() && A.toLowerCase().includes("opus")
}
// @from(Ln 432206, Col 0)
function eH7({
  onDone: A
}) {
  let [{
    mainLoopModel: Q,
    mainLoopModelForSession: B
  }] = a0(), G = Q ?? mn().label, Z = w3A(), Y = Z !== void 0 && Z !== "unset" ? ` (effort: ${Z})` : "";
  if (B) A(`Current model: ${I1.bold(eT(B))} (session override from plan mode)
Base model: ${G}${Y}`);
  else A(`Current model: ${G}${Y}`);
  return null
}
// @from(Ln 432218, Col 4)
gx
// @from(Ln 432218, Col 8)
lZ9
// @from(Ln 432219, Col 4)
iZ9 = w(() => {
  wE1();
  hB();
  l2();
  rEA();
  fU0();
  Z0();
  Z3();
  Q2();
  cD();
  c6();
  gx = c(QA(), 1);
  lZ9 = {
    type: "local-jsx",
    name: "model",
    userFacingName() {
      return "model"
    },
    description: "Set the AI model for Claude Code",
    isEnabled: () => !0,
    isHidden: !1,
    argumentHint: "[model]",
    async call(A, Q, B) {
      if (B = B?.trim() || "", $KA.includes(B)) return l("tengu_model_command_inline_help", {
        args: B
      }), gx.createElement(eH7, {
        onDone: A
      });
      if (zKA.includes(B)) {
        A("Run /model to open the model selection menu, or /model [modelName] to set the model.", {
          display: "system"
        });
        return
      }
      if (B) return l("tengu_model_command_inline", {
        args: B
      }), gx.createElement(rH7, {
        args: B,
        onDone: A
      });
      return gx.createElement(oH7, {
        onDone: A
      })
    }
  }
})
// @from(Ln 432266, Col 0)
function AE7({
  tagName: A,
  onConfirm: Q,
  onCancel: B
}) {
  return qI.createElement(o9, {
    title: "Remove tag?",
    subtitle: `Current tag: #${A}`,
    onCancel: B,
    color: "warning",
    borderDimColor: !1
  }, qI.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, qI.createElement(C, null, "This will remove the tag from the current session."), qI.createElement(k0, {
    onChange: (G) => G === "yes" ? Q() : B(),
    options: [{
      label: "Yes, remove tag",
      value: "yes"
    }, {
      label: "No, keep tag",
      value: "no"
    }]
  })))
}
// @from(Ln 432292, Col 0)
function QE7({
  tagName: A,
  onDone: Q
}) {
  let [B, G] = qI.useState(!1), [Z, Y] = qI.useState(null), J = Nr(A).trim();
  if (qI.useEffect(() => {
      let X = q0();
      if (!X) {
        Q("No active session to tag", {
          display: "system"
        });
        return
      }
      if (!J) {
        Q("Tag name cannot be empty", {
          display: "system"
        });
        return
      }
      Y(X);
      let I = rZ9(X);
      if (I === J) l("tengu_tag_command_remove_prompt", {}), G(!0);
      else l("tengu_tag_command_add", {
        is_replacing: !!I
      }), (async () => {
        let W = uz();
        await bT0(X, J, W), Q(`Tagged session with ${I1.cyan(`#${J}`)}`, {
          display: "system"
        })
      })()
    }, [J, Q]), B && Z) return qI.createElement(AE7, {
    tagName: J,
    onConfirm: async () => {
      l("tengu_tag_command_remove_confirmed", {});
      let X = uz();
      await bT0(Z, "", X), Q(`Removed tag ${I1.cyan(`#${J}`)}`, {
        display: "system"
      })
    },
    onCancel: () => {
      l("tengu_tag_command_remove_cancelled", {}), Q(`Kept tag ${I1.cyan(`#${J}`)}`, {
        display: "system"
      })
    }
  });
  return null
}
// @from(Ln 432340, Col 0)
function nZ9({
  onDone: A
}) {
  return qI.useEffect(() => {
    A(`Usage: /tag <tag-name>

Toggle a searchable tag on the current session.
Run the same command again to remove the tag.
Tags are displayed after the branch name in /resume and can be searched with /.

Examples:
  /tag bugfix        # Add tag
  /tag bugfix        # Remove tag (toggle)
  /tag feature-auth
  /tag wip`, {
      display: "system"
    })
  }, [A]), null
}
// @from(Ln 432359, Col 4)
qI
// @from(Ln 432359, Col 8)
aZ9
// @from(Ln 432360, Col 4)
oZ9 = w(() => {
  fA();
  C0();
  d4();
  Z3();
  cD();
  W8();
  rY();
  Z0();
  qI = c(QA(), 1);
  aZ9 = {
    type: "local-jsx",
    name: "tag",
    userFacingName() {
      return "tag"
    },
    description: "Toggle a searchable tag on the current session",
    isEnabled: () => !1,
    isHidden: !1,
    argumentHint: "<tag-name>",
    async call(A, Q, B) {
      if (B = B?.trim() || "", $KA.includes(B) || zKA.includes(B)) return qI.createElement(nZ9, {
        onDone: A
      });
      if (!B) return qI.createElement(nZ9, {
        onDone: A
      });
      return qI.createElement(QE7, {
        tagName: B,
        onDone: A
      })
    }
  }
})
// @from(Ln 432395, Col 0)
function BE7({
  onDone: A
}) {
  let B = YU().outputStyle ?? vF;
  J0((Y, J) => {
    if (J.escape) {
      l("tengu_output_style_command_menu", {
        action: "cancel"
      }), A(`Kept output style as ${I1.bold(B)}`, {
        display: "system"
      });
      return
    }
  });

  function G(Y) {
    l("tengu_output_style_command_menu", {
      action: Y,
      from_style: B,
      to_style: Y
    }), pB("localSettings", {
      outputStyle: Y
    }), A(`Set output style to ${I1.bold(Y)}`)
  }

  function Z() {
    A(`Kept output style as ${I1.bold(B)}`, {
      display: "system"
    })
  }
  return Np.createElement(OE1, {
    initialStyle: B,
    onComplete: G,
    onCancel: Z,
    isStandaloneCommand: !0
  })
}
// @from(Ln 432433, Col 0)
function GE7(A, Q) {
  if (A in Q) return A;
  let B = A.toLowerCase();
  for (let G of Object.keys(Q))
    if (G.toLowerCase() === B) return G;
  return null
}
// @from(Ln 432441, Col 0)
function ZE7({
  args: A,
  onDone: Q
}) {
  return d3A(o1()).then((B) => {
    let G = GE7(A, B);
    if (!G) {
      Q(`Invalid output style: ${A}`);
      return
    }
    pB("localSettings", {
      outputStyle: G
    }), Q(`Set output style to ${I1.bold(G)}`)
  }), null
}
// @from(Ln 432457, Col 0)
function YE7({
  onDone: A
}) {
  let Q = YU();
  return A(`Current output style: ${Q.outputStyle??vF}`), null
}
// @from(Ln 432463, Col 4)
Np
// @from(Ln 432463, Col 8)
sZ9
// @from(Ln 432464, Col 4)
tZ9 = w(() => {
  _R0();
  fA();
  Z0();
  Z3();
  GB();
  ar();
  Cf();
  V2();
  cD();
  Np = c(QA(), 1);
  sZ9 = {
    type: "local-jsx",
    name: "output-style",
    userFacingName() {
      return "output-style"
    },
    description: "Set the output style directly or from a selection menu",
    isEnabled: () => !0,
    isHidden: !1,
    argumentHint: "[style]",
    async call(A, Q, B) {
      if (B = B?.trim() || "", $KA.includes(B)) return l("tengu_output_style_command_inline_help", {
        args: B
      }), Np.createElement(YE7, {
        onDone: A
      });
      if (zKA.includes(B)) {
        A("Run /output-style to open the output style selection menu, or /output-style [styleName] to set the output style.", {
          display: "system"
        });
        return
      }
      if (B) return l("tengu_output_style_command_inline", {
        args: B
      }), Np.createElement(ZE7, {
        args: B,
        onDone: A
      });
      return Np.createElement(BE7, {
        onDone: A
      })
    }
  }
})
// @from(Ln 432509, Col 0)
async function eZ9() {
  let A = await AEA();
  if (A.length === 0) return {
    availableEnvironments: [],
    selectedEnvironment: null,
    selectedEnvironmentSource: null
  };
  let B = jQ()?.remote?.defaultEnvironmentId,
    G = A[0],
    Z = null;
  if (B) {
    let Y = A.find((J) => J.environment_id === B);
    if (Y) {
      G = Y;
      for (let J = yL.length - 1; J >= 0; J--) {
        let X = yL[J];
        if (!X || X === "flagSettings") continue;
        if (dB(X)?.remote?.defaultEnvironmentId === B) {
          Z = X;
          break
        }
      }
    }
  }
  return {
    availableEnvironments: A,
    selectedEnvironment: G,
    selectedEnvironmentSource: Z
  }
}
// @from(Ln 432539, Col 4)
AY9 = w(() => {
  GB();
  YI();
  UK1()
})
// @from(Ln 432545, Col 0)
function QY9({
  onDone: A
}) {
  let [Q, B] = xe.useState("loading"), [G, Z] = xe.useState([]), [Y, J] = xe.useState(null), [X, I] = xe.useState(null), [D, W] = xe.useState(null);
  xe.useEffect(() => {
    async function V() {
      try {
        let F = await eZ9();
        Z(F.availableEnvironments), J(F.selectedEnvironment), I(F.selectedEnvironmentSource), B(null)
      } catch (F) {
        let H = F instanceof Error ? F.message : String(F);
        e(F instanceof Error ? F : Error(H)), W(H), B(null)
      }
    }
    V()
  }, []);

  function K(V) {
    if (V === "cancel") {
      A();
      return
    }
    B("updating");
    let F = G.find((H) => H.environment_id === V);
    if (!F) {
      A("Error: Selected environment not found");
      return
    }
    pB("localSettings", {
      remote: {
        defaultEnvironmentId: F.environment_id
      }
    }), A(`Set default remote environment to ${I1.bold(F.name)} (${F.environment_id})`)
  }
  if (Q === "loading") return i9.createElement(o9, {
    title: EuA,
    onCancel: A,
    hideInputGuide: !0
  }, i9.createElement(BY9, {
    message: "Loading environments…"
  }));
  if (D) return i9.createElement(o9, {
    title: EuA,
    onCancel: A
  }, i9.createElement(C, {
    color: "error"
  }, "Error: ", D));
  if (!Y) return i9.createElement(o9, {
    title: EuA,
    subtitle: fT0,
    onCancel: A
  }, i9.createElement(C, null, "No remote environments available."));
  if (G.length === 1) return i9.createElement(XE7, {
    environment: Y,
    onDone: A
  });
  return i9.createElement(IE7, {
    environments: G,
    selectedEnvironment: Y,
    selectedEnvironmentSource: X,
    loadingState: Q,
    onSelect: K,
    onCancel: A
  })
}
// @from(Ln 432611, Col 0)
function BY9({
  message: A
}) {
  return i9.createElement(T, {
    flexDirection: "row"
  }, i9.createElement(W9, null), i9.createElement(C, null, A))
}
// @from(Ln 432619, Col 0)
function JE7({
  environment: A
}) {
  return i9.createElement(C, null, tA.tick, " Using ", i9.createElement(C, {
    bold: !0
  }, A.name), " ", i9.createElement(C, {
    dimColor: !0
  }, "(", A.environment_id, ")"))
}
// @from(Ln 432629, Col 0)
function XE7({
  environment: A,
  onDone: Q
}) {
  return J0((B, G) => {
    if (G.return) Q()
  }), i9.createElement(o9, {
    title: EuA,
    subtitle: fT0,
    onCancel: Q
  }, i9.createElement(JE7, {
    environment: A
  }))
}
// @from(Ln 432644, Col 0)
function IE7({
  environments: A,
  selectedEnvironment: Q,
  selectedEnvironmentSource: B,
  loadingState: G,
  onSelect: Z,
  onCancel: Y
}) {
  let J = B && B !== "localSettings" ? ` (from ${Wa(B)} settings)` : "",
    X = i9.createElement(C, null, "Currently using: ", i9.createElement(C, {
      bold: !0
    }, Q.name), J);
  return i9.createElement(o9, {
    title: EuA,
    subtitle: X,
    onCancel: Y,
    hideInputGuide: !0
  }, i9.createElement(C, {
    dimColor: !0
  }, fT0), G === "updating" ? i9.createElement(BY9, {
    message: "Updating…"
  }) : i9.createElement(k0, {
    options: A.map((I) => ({
      label: i9.createElement(C, null, I.name, " ", i9.createElement(C, {
        dimColor: !0
      }, "(", I.environment_id, ")")),
      value: I.environment_id
    })),
    defaultValue: Q.environment_id,
    onChange: Z,
    onCancel: () => Z("cancel"),
    layout: "compact-vertical"
  }), i9.createElement(C, {
    dimColor: !0
  }, i9.createElement(vQ, null, i9.createElement(F0, {
    shortcut: "Enter",
    action: "select"
  }), i9.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  }))))
}
// @from(Ln 432688, Col 4)
i9
// @from(Ln 432688, Col 8)
xe
// @from(Ln 432688, Col 12)
EuA = "Select Remote Environment"
// @from(Ln 432689, Col 2)
fT0 = "Configure environments at: https://claude.ai/code"
// @from(Ln 432690, Col 4)
GY9 = w(() => {
  fA();
  rY();
  W8();
  B2();
  yG();
  AY9();
  GB();
  v1();
  Z3();
  YI();
  e9();
  I3();
  K6();
  i9 = c(QA(), 1), xe = c(QA(), 1)
})
// @from(Ln 432706, Col 4)
hT0
// @from(Ln 432706, Col 9)
ZY9
// @from(Ln 432707, Col 4)
YY9 = w(() => {
  GY9();
  Q2();
  hT0 = c(QA(), 1), ZY9 = {
    type: "local-jsx",
    name: "remote-env",
    userFacingName() {
      return "remote-env"
    },
    description: "Configure the default remote environment for teleport sessions",
    isEnabled: () => qB(),
    get isHidden() {
      return !qB()
    },
    async call(A) {
      return hT0.createElement(QY9, {
        onDone: A
      })
    }
  }
})
// @from(Ln 432728, Col 4)
gT0
// @from(Ln 432728, Col 9)
DE7
// @from(Ln 432728, Col 14)
zuA
// @from(Ln 432729, Col 4)
uT0 = w(() => {
  v1();
  Q2();
  TN();
  WD1();
  ZNA();
  gT0 = c(QA(), 1), DE7 = {
    type: "local-jsx",
    name: "upgrade",
    description: "Upgrade to Max for higher rate limits and more Opus",
    isEnabled: () => !process.env.DISABLE_UPGRADE_COMMAND && !Yk() && N6() !== "enterprise",
    isHidden: !1,
    async call(A, Q) {
      try {
        if (qB()) {
          let G = g4(),
            Z = !1;
          if (G?.subscriptionType && G?.rateLimitTier) Z = G.subscriptionType === "max" && G.rateLimitTier === "default_claude_max_20x";
          else if (G?.accessToken) {
            let Y = await RZA(G.accessToken);
            Z = Y?.organization?.organization_type === "claude_max" && Y?.organization?.rate_limit_tier === "default_claude_max_20x"
          }
          if (Z) return setTimeout(() => {
            A("You are already on the highest Max subscription plan. For additional usage, run /login to switch to an API usage-billed account.")
          }, 0), null
        }
        return await i7("https://claude.ai/upgrade/max"), gT0.createElement(PkA, {
          startingMessage: "Starting new login following /upgrade. Exit with Ctrl-C to use existing account.",
          onDone: (G) => {
            Q.onChangeAPIKey(), A(G ? "Login successful" : "Login interrupted")
          }
        })
      } catch (B) {
        e(B), setTimeout(() => {
          A("Failed to open browser. Please visit https://claude.ai/upgrade/max to upgrade.")
        }, 0)
      }
      return null
    },
    userFacingName() {
      return "upgrade"
    }
  }, zuA = DE7
})
// @from(Ln 432774, Col 0)
function WE7({
  onDone: A,
  context: Q
}) {
  let [B, G] = B$1.useState(null), Z = no(), Y = N6(), J = IXA(), X = v3()?.hasExtraUsageEnabled === !0, I = Y === "pro", D = Y === "max", W = D && J === "default_claude_max_20x", K = Y === "team" || Y === "enterprise", V = (I || D) && HX("hide_overages_option_at_rate_limit_hit", "enabled", !1), F = B$1.useMemo(() => {
    let z = [{
      label: "Stop and wait for limit to reset",
      value: "cancel"
    }];
    if (!V && Wc.isEnabled()) {
      let $ = Xk(),
        O = K && !$,
        L = Z.overageDisabledReason === "out_of_credits" || Z.overageDisabledReason === "org_level_disabled_until" || Z.overageDisabledReason === "org_service_zero_credit_limit";
      if (O && L);
      else {
        let M = Z.overageStatus === "rejected" || Z.overageStatus === "allowed_warning",
          _;
        if (O) _ = M ? "Request more" : "Request extra usage";
        else _ = X ? "Add funds to continue with extra usage" : "Switch to extra usage";
        z.push({
          label: _,
          value: "extra-usage"
        })
      }
    }
    if (!W && !K && zuA.isEnabled()) z.push({
      label: "Upgrade your plan",
      value: "upgrade"
    });
    return z
  }, [W, K, X, V, Z.overageStatus, Z.overageDisabledReason]);

  function H() {
    l("tengu_rate_limit_options_menu_cancel", {}), A(void 0, {
      display: "skip"
    })
  }

  function E(z) {
    if (z === "upgrade") l("tengu_rate_limit_options_menu_select_upgrade", {}), zuA.call(A, Q).then(($) => {
      if ($) G($)
    });
    else if (z === "extra-usage") l("tengu_rate_limit_options_menu_select_extra_usage", {}), Wc.call(A, Q).then(($) => {
      if ($) G($)
    });
    else if (z === "cancel") H()
  }
  if (B) return B;
  return Q$1.default.createElement(o9, {
    title: "What do you want to do?",
    onCancel: H,
    color: "suggestion",
    borderDimColor: !1
  }, Q$1.default.createElement(k0, {
    options: F,
    onChange: E,
    visibleOptionCount: F.length
  }))
}
// @from(Ln 432833, Col 4)
Q$1
// @from(Ln 432833, Col 9)
B$1
// @from(Ln 432833, Col 14)
JY9
// @from(Ln 432834, Col 4)
XY9 = w(() => {
  W8();
  rY();
  Z0();
  Q2();
  uT0();
  ykA();
  BI();
  GQ();
  IS();
  Q$1 = c(QA(), 1), B$1 = c(QA(), 1), JY9 = {
    type: "local-jsx",
    name: "rate-limit-options",
    userFacingName() {
      return "rate-limit-options"
    },
    description: "Show options when rate limit is reached",
    isEnabled: () => {
      if (!qB()) return !1;
      if (ZP()) return !0;
      let A = N6();
      return A === "pro" || A === "max"
    },
    isHidden: !0,
    async call(A, Q) {
      return Q$1.default.createElement(WE7, {
        onDone: A,
        context: Q
      })
    }
  }
})
// @from(Ln 432866, Col 4)
KE7
// @from(Ln 432866, Col 9)
IY9
// @from(Ln 432867, Col 4)
DY9 = w(() => {
  KE7 = {
    type: "prompt",
    description: "Set up Claude Code's status line UI",
    contentLength: 0,
    aliases: [],
    isEnabled: () => !0,
    isHidden: !1,
    name: "statusline",
    progressMessage: "setting up statusLine",
    allowedTools: ["Task", "Read(~/**)", "Edit(~/.claude/settings.json)"],
    source: "builtin",
    disableNonInteractive: !0,
    async getPromptForCommand(A) {
      return [{
        type: "text",
        text: `Create a Task with subagent_type "statusline-setup" and the prompt "${A.trim()||"Configure my statusLine from my shell PS1 configuration"}"`
      }]
    },
    userFacingName() {
      return "statusline"
    }
  }, IY9 = KE7
})
// @from(Ln 432891, Col 4)
WY9 = w(() => {
  rEA();
  GB()
})
// @from(Ln 432895, Col 4)
KY9 = U((G$1) => {
  (function (A) {
    A.black = "\x1B[30m", A.red = "\x1B[31m", A.green = "\x1B[32m", A.yellow = "\x1B[33m", A.blue = "\x1B[34m", A.magenta = "\x1B[35m", A.cyan = "\x1B[36m", A.lightgray = "\x1B[37m", A.default = "\x1B[39m", A.darkgray = "\x1B[90m", A.lightred = "\x1B[91m", A.lightgreen = "\x1B[92m", A.lightyellow = "\x1B[93m", A.lightblue = "\x1B[94m", A.lightmagenta = "\x1B[95m", A.lightcyan = "\x1B[96m", A.white = "\x1B[97m", A.reset = "\x1B[0m";

    function Q(B, G) {
      return G === void 0 ? B : G + B + A.reset
    }
    A.colored = Q, A.plot = function (B, G = void 0) {
      if (typeof B[0] == "number") B = [B];
      G = typeof G < "u" ? G : {};
      let Z = typeof G.min < "u" ? G.min : B[0][0],
        Y = typeof G.max < "u" ? G.max : B[0][0];
      for (let M = 0; M < B.length; M++)
        for (let _ = 0; _ < B[M].length; _++) Z = Math.min(Z, B[M][_]), Y = Math.max(Y, B[M][_]);
      let J = ["┼", "┤", "╶", "╴", "─", "╰", "╭", "╮", "╯", "│"],
        X = Math.abs(Y - Z),
        I = typeof G.offset < "u" ? G.offset : 3,
        D = typeof G.padding < "u" ? G.padding : "           ",
        W = typeof G.height < "u" ? G.height : X,
        K = typeof G.colors < "u" ? G.colors : [],
        V = X !== 0 ? W / X : 1,
        F = Math.round(Z * V),
        H = Math.round(Y * V),
        E = Math.abs(H - F),
        z = 0;
      for (let M = 0; M < B.length; M++) z = Math.max(z, B[M].length);
      z = z + I;
      let $ = typeof G.symbols < "u" ? G.symbols : J,
        O = typeof G.format < "u" ? G.format : function (M) {
          return (D + M.toFixed(2)).slice(-D.length)
        },
        L = Array(E + 1);
      for (let M = 0; M <= E; M++) {
        L[M] = Array(z);
        for (let _ = 0; _ < z; _++) L[M][_] = " "
      }
      for (let M = F; M <= H; ++M) {
        let _ = O(E > 0 ? Y - (M - F) * X / E : M, M - F);
        L[M - F][Math.max(I - _.length, 0)] = _, L[M - F][I - 1] = M == 0 ? $[0] : $[1]
      }
      for (let M = 0; M < B.length; M++) {
        let _ = K[M % K.length],
          j = Math.round(B[M][0] * V) - F;
        L[E - j][I - 1] = Q($[0], _);
        for (let x = 0; x < B[M].length - 1; x++) {
          let b = Math.round(B[M][x + 0] * V) - F,
            S = Math.round(B[M][x + 1] * V) - F;
          if (b == S) L[E - b][x + I] = Q($[4], _);
          else {
            L[E - S][x + I] = Q(b > S ? $[5] : $[6], _), L[E - b][x + I] = Q(b > S ? $[7] : $[8], _);
            let u = Math.min(b, S),
              f = Math.max(b, S);
            for (let AA = u + 1; AA < f; AA++) L[E - AA][x + I] = Q($[9], _)
          }
        }
      }
      return L.map(function (M) {
        return M.join("")
      }).join(`
`)
    }
  })(typeof G$1 > "u" ? G$1.asciichart = {} : G$1)
})
// @from(Ln 432964, Col 0)
async function mT0(A) {
  while (Z$1) await Z$1;
  let Q;
  Z$1 = new Promise((B) => {
    Q = B
  });
  try {
    return await A()
  } finally {
    Z$1 = null, Q?.()
  }
}
// @from(Ln 432977, Col 0)
function VY9() {
  return VE7(zQ(), HE7)
}