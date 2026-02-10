
// @from(Ln 428296, Col 4)
tuA = v(() => {
    Qe = [{
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
        description: "Get an accessibility tree representation of elements on the page. By default returns all elements including non-visible ones. Output is limited to 50000 characters by default. If the output exceeds this limit, you will receive an error asking you to specify a smaller depth or focus on a specific element using ref_id. Optionally filter for only interactive elements. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs.",
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
                },
                max_chars: {
                    type: "number",
                    description: "Maximum characters for output (default: 50000). Set to a higher value if your client can handle large outputs."
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
    }, {
        name: "switch_browser",
        description: "Switch which Chrome browser is used for browser automation. Call this when the user wants to connect to a different Chrome browser. Broadcasts a connection request to all Chrome browsers with the extension installed — the user clicks 'Connect' in the desired browser.",
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        }
    }]
})
// @from(Ln 428752, Col 0)
class euA {
    constructor(A) {
        this._server = A
    }
    requestStream(A, q, K) {
        return this._server.requestStream(A, q, K)
    }
    async getTask(A, q) {
        return this._server.getTask({
            taskId: A
        }, q)
    }
    async getTaskResult(A, q, K) {
        return this._server.getTaskResult({
            taskId: A
        }, q, K)
    }
    async listTasks(A, q) {
        return this._server.listTasks(A ? {
            cursor: A
        } : void 0, q)
    }
    async cancelTask(A, q) {
        return this._server.cancelTask({
            taskId: A
        }, q)
    }
}
// @from(Ln 428780, Col 4)
Zd1
// @from(Ln 428781, Col 4)
ABA = v(() => {
    k_A();
    gD();
    RJA();
    nx1();
    Zd1 = class Zd1 extends Hb1 {
        constructor(A, q) {
            var K, Y;
            super(q);
            if (this._serverInfo = A, this._loggingLevels = new Map, this.LOG_LEVEL_SEVERITY = new Map(Yb1.options.map((z, w) => [z, w])), this.isMessageIgnored = (z, w) => {
                    let H = this._loggingLevels.get(w);
                    return H ? this.LOG_LEVEL_SEVERITY.get(z) < this.LOG_LEVEL_SEVERITY.get(H) : !1
                }, this._capabilities = (K = q === null || q === void 0 ? void 0 : q.capabilities) !== null && K !== void 0 ? K : {}, this._instructions = q === null || q === void 0 ? void 0 : q.instructions, this._jsonSchemaValidator = (Y = q === null || q === void 0 ? void 0 : q.jsonSchemaValidator) !== null && Y !== void 0 ? Y : new Sb1, this.setRequestHandler(uOA, (z) => this._oninitialize(z)), this.setNotificationHandler(nw6, () => {
                    var z;
                    return (z = this.oninitialized) === null || z === void 0 ? void 0 : z.call(this)
                }), this._capabilities.logging) this.setRequestHandler(rOA, async (z, w) => {
                var H;
                let $ = w.sessionId || ((H = w.requestInfo) === null || H === void 0 ? void 0 : H.headers["mcp-session-id"]) || void 0,
                    {
                        level: O
                    } = z.params,
                    _ = Yb1.safeParse(O);
                if (_.success) this._loggingLevels.set($, _.data);
                return {}
            })
        }
        get experimental() {
            if (!this._experimental) this._experimental = {
                tasks: new euA(this)
            };
            return this._experimental
        }
        registerCapabilities(A) {
            if (this.transport) throw Error("Cannot register capabilities after connecting to transport");
            this._capabilities = HH6(this._capabilities, A)
        }
        setRequestHandler(A, q) {
            var K, Y, z;
            let w = X01(A),
                H = w === null || w === void 0 ? void 0 : w.method;
            if (!H) throw Error("Schema is missing a method literal");
            let $;
            if (oo(H)) {
                let _ = H,
                    J = (K = _._zod) === null || K === void 0 ? void 0 : K.def;
                $ = (Y = J === null || J === void 0 ? void 0 : J.value) !== null && Y !== void 0 ? Y : _.value
            } else {
                let _ = H,
                    J = _._def;
                $ = (z = J === null || J === void 0 ? void 0 : J.value) !== null && z !== void 0 ? z : _.value
            }
            if (typeof $ !== "string") throw Error("Schema method literal must be a string");
            if ($ === "tools/call") {
                let _ = async (J, X) => {
                    let D = GZ(Tq1, J);
                    if (!D.success) {
                        let W = D.error instanceof Error ? D.error.message : String(D.error);
                        throw new Eq(VK.InvalidParams, `Invalid tools/call request: ${W}`)
                    }
                    let {
                        params: j
                    } = D.data, M = await Promise.resolve(q(J, X));
                    if (j.task) {
                        let W = GZ($p, M);
                        if (!W.success) {
                            let G = W.error instanceof Error ? W.error.message : String(W.error);
                            throw new Eq(VK.InvalidParams, `Invalid task creation result: ${G}`)
                        }
                        return W.data
                    }
                    let P = GZ(ZZ, M);
                    if (!P.success) {
                        let W = P.error instanceof Error ? P.error.message : String(P.error);
                        throw new Eq(VK.InvalidParams, `Invalid tools/call result: ${W}`)
                    }
                    return P.data
                };
                return super.setRequestHandler(A, _)
            }
            return super.setRequestHandler(A, q)
        }
        assertCapabilityForMethod(A) {
            var q, K, Y;
            switch (A) {
                case "sampling/createMessage":
                    if (!((q = this._clientCapabilities) === null || q === void 0 ? void 0 : q.sampling)) throw Error(`Client does not support sampling (required for ${A})`);
                    break;
                case "elicitation/create":
                    if (!((K = this._clientCapabilities) === null || K === void 0 ? void 0 : K.elicitation)) throw Error(`Client does not support elicitation (required for ${A})`);
                    break;
                case "roots/list":
                    if (!((Y = this._clientCapabilities) === null || Y === void 0 ? void 0 : Y.roots)) throw Error(`Client does not support listing roots (required for ${A})`);
                    break;
                case "ping":
                    break
            }
        }
        assertNotificationCapability(A) {
            var q, K;
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
                    if (!((K = (q = this._clientCapabilities) === null || q === void 0 ? void 0 : q.elicitation) === null || K === void 0 ? void 0 : K.url)) throw Error(`Client does not support URL elicitation (required for ${A})`);
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
            var q, K;
            iH6((K = (q = this._clientCapabilities) === null || q === void 0 ? void 0 : q.tasks) === null || K === void 0 ? void 0 : K.requests, A, "Client")
        }
        assertTaskHandlerCapability(A) {
            var q;
            if (!this._capabilities) return;
            lH6((q = this._capabilities.tasks) === null || q === void 0 ? void 0 : q.requests, A, "Server")
        }
        async _oninitialize(A) {
            let q = A.params.protocolVersion;
            return this._clientCapabilities = A.params.capabilities, this._clientVersion = A.params.clientInfo, {
                protocolVersion: dw6.includes(q) ? q : ao,
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
            }, Hp)
        }
        async createMessage(A, q) {
            var K, Y;
            if (A.tools || A.toolChoice) {
                if (!((Y = (K = this._clientCapabilities) === null || K === void 0 ? void 0 : K.sampling) === null || Y === void 0 ? void 0 : Y.tools)) throw Error("Client does not support sampling tools capability.")
            }
            if (A.messages.length > 0) {
                let z = A.messages[A.messages.length - 1],
                    w = Array.isArray(z.content) ? z.content : [z.content],
                    H = w.some((J) => J.type === "tool_result"),
                    $ = A.messages.length > 1 ? A.messages[A.messages.length - 2] : void 0,
                    O = $ ? Array.isArray($.content) ? $.content : [$.content] : [],
                    _ = O.some((J) => J.type === "tool_use");
                if (H) {
                    if (w.some((J) => J.type !== "tool_result")) throw Error("The last message must contain only tool_result content if any is present");
                    if (!_) throw Error("tool_result blocks are not matching any tool_use from the previous message")
                }
                if (_) {
                    let J = new Set(O.filter((D) => D.type === "tool_use").map((D) => D.id)),
                        X = new Set(w.filter((D) => D.type === "tool_result").map((D) => D.toolUseId));
                    if (J.size !== X.size || ![...J].every((D) => X.has(D))) throw Error("ids of tool_result blocks and tool_use blocks from previous message do not match")
                }
            }
            if (A.tools) return this.request({
                method: "sampling/createMessage",
                params: A
            }, aOA, q);
            return this.request({
                method: "sampling/createMessage",
                params: A
            }, zb1, q)
        }
        async elicitInput(A, q) {
            var K, Y, z, w, H;
            switch ((K = A.mode) !== null && K !== void 0 ? K : "form") {
                case "url": {
                    if (!((z = (Y = this._clientCapabilities) === null || Y === void 0 ? void 0 : Y.elicitation) === null || z === void 0 ? void 0 : z.url)) throw Error("Client does not support url elicitation.");
                    let O = A;
                    return this.request({
                        method: "elicitation/create",
                        params: O
                    }, M01, q)
                }
                case "form": {
                    if (!((H = (w = this._clientCapabilities) === null || w === void 0 ? void 0 : w.elicitation) === null || H === void 0 ? void 0 : H.form)) throw Error("Client does not support form elicitation.");
                    let O = A.mode === "form" ? A : {
                            ...A,
                            mode: "form"
                        },
                        _ = await this.request({
                            method: "elicitation/create",
                            params: O
                        }, M01, q);
                    if (_.action === "accept" && _.content && O.requestedSchema) try {
                        let X = this._jsonSchemaValidator.getValidator(O.requestedSchema)(_.content);
                        if (!X.valid) throw new Eq(VK.InvalidParams, `Elicitation response content does not match requested schema: ${X.errorMessage}`)
                    } catch (J) {
                        if (J instanceof Eq) throw J;
                        throw new Eq(VK.InternalError, `Error validating elicitation response: ${J instanceof Error?J.message:String(J)}`)
                    }
                    return _
                }
            }
        }
        createElicitationCompletionNotifier(A, q) {
            var K, Y;
            if (!((Y = (K = this._clientCapabilities) === null || K === void 0 ? void 0 : K.elicitation) === null || Y === void 0 ? void 0 : Y.url)) throw Error("Client does not support URL elicitation (required for notifications/elicitation/complete)");
            return () => this.notification({
                method: "notifications/elicitation/complete",
                params: {
                    elicitationId: A
                }
            }, q)
        }
        async listRoots(A, q) {
            return this.request({
                method: "roots/list",
                params: A
            }, eOA, q)
        }
        async sendLoggingMessage(A, q) {
            if (this._capabilities.logging) {
                if (!this.isMessageIgnored(A.level, q)) return this.notification({
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
// @from(Ln 429080, Col 0)
class VHq {
    clients = new Map;
    tabRoutes = new Map;
    context;
    notificationHandler = null;
    constructor(A) {
        this.context = A
    }
    setNotificationHandler(A) {
        this.notificationHandler = A;
        for (let q of this.clients.values()) q.setNotificationHandler(A)
    }
    async ensureConnected() {
        let {
            logger: A,
            serverName: q
        } = this.context;
        this.refreshClients();
        let K = [];
        for (let z of this.clients.values())
            if (!z.isConnected()) K.push(z.ensureConnected().catch(() => !1));
        if (K.length > 0) await Promise.all(K);
        let Y = this.getConnectedClients().length;
        if (Y === 0) return A.info(`[${q}] No connected sockets in pool`), !1;
        return A.info(`[${q}] Socket pool: ${Y} connected`), !0
    }
    async callTool(A, q, K) {
        if (A === "tabs_context_mcp") return this.callTabsContext(q);
        let Y = q.tabId;
        if (Y !== void 0) {
            let w = this.tabRoutes.get(Y);
            if (w) {
                let H = this.clients.get(w);
                if (H?.isConnected()) return H.callTool(A, q)
            }
        }
        let z = this.getConnectedClients();
        if (z.length === 0) throw new Hf(`[${this.context.serverName}] No connected sockets available`);
        return z[0].callTool(A, q)
    }
    async setPermissionMode(A, q) {
        let K = this.getConnectedClients();
        await Promise.all(K.map((Y) => Y.setPermissionMode(A, q)))
    }
    isConnected() {
        return this.getConnectedClients().length > 0
    }
    disconnect() {
        for (let A of this.clients.values()) A.disconnect();
        this.clients.clear(), this.tabRoutes.clear()
    }
    getConnectedClients() {
        return [...this.clients.values()].filter((A) => A.isConnected())
    }
    async callTabsContext(A) {
        let {
            logger: q,
            serverName: K
        } = this.context, Y = this.getConnectedClients();
        if (Y.length === 0) throw new Hf(`[${K}] No connected sockets available`);
        if (Y.length === 1) {
            let H = await Y[0].callTool("tabs_context_mcp", A);
            return this.updateTabRoutes(H, this.getSocketPathForClient(Y[0])), H
        }
        let z = await Promise.allSettled(Y.map(async (H) => {
                let $ = await H.callTool("tabs_context_mcp", A),
                    O = this.getSocketPathForClient(H);
                return {
                    result: $,
                    socketPath: O
                }
            })),
            w = [];
        this.tabRoutes.clear();
        for (let H of z) {
            if (H.status !== "fulfilled") {
                q.info(`[${K}] tabs_context_mcp failed on one socket: ${H.reason}`);
                continue
            }
            let {
                result: $,
                socketPath: O
            } = H.value;
            this.updateTabRoutes($, O);
            let _ = this.extractTabs($);
            if (_) w.push(..._)
        }
        if (w.length > 0) {
            let H = w.map(($) => {
                let O = $;
                return `  • tabId ${O.tabId}: "${O.title}" (${O.url})`
            }).join(`
`);
            return {
                result: {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            availableTabs: w
                        })
                    }, {
                        type: "text",
                        text: `

Tab Context:
- Available tabs:
${H}`
                    }]
                }
            }
        }
        for (let H of z)
            if (H.status === "fulfilled") return H.value.result;
        throw new Hf(`[${K}] All sockets failed for tabs_context_mcp`)
    }
    updateTabRoutes(A, q) {
        let K = this.extractTabs(A);
        if (!K) return;
        for (let Y of K)
            if (typeof Y === "object" && Y !== null && "tabId" in Y) {
                let z = Y.tabId;
                this.tabRoutes.set(z, q)
            }
    }
    extractTabs(A) {
        if (!A || typeof A !== "object") return null;
        let K = A.result?.content;
        if (!K || !Array.isArray(K)) return null;
        for (let Y of K)
            if (Y.type === "text" && Y.text) try {
                let z = JSON.parse(Y.text);
                if (Array.isArray(z)) return z;
                if (z && Array.isArray(z.availableTabs)) return z.availableTabs
            } catch {}
        return null
    }
    getSocketPathForClient(A) {
        for (let [q, K] of this.clients.entries())
            if (K === A) return q;
        return ""
    }
    refreshClients() {
        let A = this.getAvailableSocketPaths(),
            {
                logger: q,
                serverName: K
            } = this.context;
        for (let Y of A)
            if (!this.clients.has(Y)) {
                q.info(`[${K}] Adding socket to pool: ${Y}`);
                let z = {
                        ...this.context,
                        socketPath: Y,
                        getSocketPath: void 0,
                        getSocketPaths: void 0
                    },
                    w = FN6(z);
                if (w.disableAutoReconnect = !0, this.notificationHandler) w.setNotificationHandler(this.notificationHandler);
                this.clients.set(Y, w)
            } for (let [Y, z] of this.clients.entries())
            if (!A.includes(Y)) {
                q.info(`[${K}] Removing stale socket from pool: ${Y}`), z.disconnect(), this.clients.delete(Y);
                for (let [w, H] of this.tabRoutes.entries())
                    if (H === Y) this.tabRoutes.delete(w)
            }
    }
    getAvailableSocketPaths() {
        return this.context.getSocketPaths?.() ?? []
    }
}
// @from(Ln 429251, Col 0)
function NHq(A) {
    return new VHq(A)
}
// @from(Ln 429254, Col 4)
THq = v(() => {
    Gd1()
})
// @from(Ln 429257, Col 0)
async function YKz(A, q, K, Y, z) {
    let w = await q.callTool(K, Y, z);
    if (A.logger.silly(`[${A.serverName}] Received result from socket bridge: ${JSON.stringify(w)}`), w === null || w === void 0) return {
        content: [{
            type: "text",
            text: "Tool execution completed"
        }]
    };
    let {
        result: H,
        error: $
    } = w, O = $ || H, _ = !!$;
    if (!O) return {
        content: [{
            type: "text",
            text: "Tool execution completed"
        }]
    };
    if (_ && HKz(O.content)) A.onAuthenticationError();
    let {
        content: J
    } = O;
    if (J && Array.isArray(J)) {
        if (_) return {
            content: J.map((D) => {
                if (typeof D === "object" && D !== null && "type" in D) return D;
                return {
                    type: "text",
                    text: String(D)
                }
            }),
            isError: !0
        };
        return {
            content: J.map((D) => {
                if (typeof D === "object" && D !== null && "type" in D && "source" in D) {
                    let j = D;
                    if (j.type === "image" && typeof j.source === "object" && j.source !== null && "data" in j.source) return {
                        type: "image",
                        data: j.source.data,
                        mimeType: "media_type" in j.source ? j.source.media_type || "image/png" : "image/png"
                    }
                }
                if (typeof D === "object" && D !== null && "type" in D) return D;
                return {
                    type: "text",
                    text: String(D)
                }
            }),
            isError: _
        }
    }
    if (typeof J === "string") return {
        content: [{
            type: "text",
            text: J
        }],
        isError: _
    };
    return A.logger.warn(`[${A.serverName}] Unexpected result format from socket bridge`, w), {
        content: [{
            type: "text",
            text: JSON.stringify(w)
        }],
        isError: _
    }
}
// @from(Ln 429325, Col 0)
function qBA(A) {
    return {
        content: [{
            type: "text",
            text: A.onToolCallDisconnected()
        }]
    }
}
// @from(Ln 429333, Col 0)
async function zKz(A, q) {
    let K = ["ask", "skip_all_permission_checks", "follow_a_plan"],
        Y = q.mode,
        z = Y && K.includes(Y) ? Y : "ask";
    if (A.setPermissionMode) await A.setPermissionMode(z, q.allowed_domains);
    return {
        content: [{
            type: "text",
            text: `Permission mode set to: ${z}`
        }]
    }
}
// @from(Ln 429345, Col 0)
async function wKz(A, q) {
    if (!A.bridgeConfig) return {
        content: [{
            type: "text",
            text: "Browser switching is only available with bridge connections."
        }],
        isError: !0
    };
    if (!await q.ensureConnected()) return qBA(A);
    let Y = await q.switchBrowser?.() ?? null;
    if (Y === "no_other_browsers") return {
        content: [{
            type: "text",
            text: "No other browsers available to switch to. Open Chrome with the Claude extension in another browser to switch."
        }],
        isError: !0
    };
    if (Y) return {
        content: [{
            type: "text",
            text: `Connected to browser "${Y.name}".`
        }]
    };
    return {
        content: [{
            type: "text",
            text: "No browser responded within the timeout. Make sure Chrome is open with the Claude extension installed, then try again."
        }],
        isError: !0
    }
}
// @from(Ln 429377, Col 0)
function HKz(A) {
    return (Array.isArray(A) ? A.map((K) => {
        if (typeof K === "string") return K;
        if (typeof K === "object" && K !== null && "text" in K && typeof K.text === "string") return K.text;
        return ""
    }).join(" ") : String(A)).toLowerCase().includes("re-authenticated")
}
// @from(Ln 429384, Col 4)
vHq = async (A, q, K, Y, z) => {
    if (K === "set_permission_mode") return zKz(q, Y);
    if (K === "switch_browser") return wKz(A, q);
    try {
        let w = await q.ensureConnected();
        if (A.logger.silly(`[${A.serverName}] Server is connected: ${w}. Received tool call: ${K} with args: ${JSON.stringify(Y)}.`), w) return await YKz(A, q, K, Y, z);
        return qBA(A)
    } catch (w) {
        if (A.logger.info(`[${A.serverName}] Error calling tool:`, w), w instanceof Hf) return qBA(A);
        return {
            content: [{
                type: "text",
                text: `Error calling tool, please try again. : ${w instanceof Error?w.message:String(w)}`
            }],
            isError: !0
        }
    }
}
// @from(Ln 429402, Col 4)
EHq = v(() => {
    Gd1()
})
// @from(Ln 429406, Col 0)
function kHq(A) {
    return A.bridgeConfig ? auA(A) : A.getSocketPaths ? NHq(A) : FN6(A)
}
// @from(Ln 429410, Col 0)
function KBA(A, q) {
    let {
        serverName: K,
        logger: Y
    } = A, z = q ?? kHq(A), w = new Zd1({
        name: K,
        version: "1.0.0"
    }, {
        capabilities: {
            tools: {},
            logging: {}
        }
    });
    return w.setRequestHandler(qb1, async () => {
        if (A.isDisabled?.()) return {
            tools: []
        };
        return {
            tools: A.bridgeConfig ? Qe : Qe.filter((H) => H.name !== "switch_browser")
        }
    }), w.setRequestHandler(Tq1, async (H) => {
        return Y.info(`[${K}] Executing tool: ${H.params.name}`), vHq(A, z, H.params.name, H.params.arguments || {})
    }), z.setNotificationHandler((H) => {
        Y.info(`[${K}] Forwarding MCP notification: ${H.method}`), w.notification({
            method: H.method,
            params: H.params
        }).catch(($) => {
            Y.info(`[${K}] Failed to forward MCP notification: ${$.message}`)
        })
    }), w
}
// @from(Ln 429441, Col 4)
LHq = v(() => {
    ABA();
    gD();
    suA();
    tuA();
    Gd1();
    THq();
    EHq()
})
// @from(Ln 429450, Col 4)
QN6 = v(() => {
    suA();
    tuA();
    LHq()
})
// @from(Ln 429456, Col 0)
function YBA() {
    return `# Claude in Chrome browser automation

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
4. When a tab is closed by the user or a navigation error occurs, call tabs_context_mcp to see what tabs are available`
}
// @from(Ln 429504, Col 4)
RHq = `# Claude in Chrome browser automation

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
4. When a tab is closed by the user or a navigation error occurs, call tabs_context_mcp to see what tabs are available`
// @from(Ln 429550, Col 4)
yHq = `**IMPORTANT: Before using any chrome browser tools, you MUST first load them using ToolSearch.**

Chrome browser tools are MCP tools that require loading before use. Before calling any mcp__claude-in-chrome__* tool:
1. Use ToolSearch with \`select:mcp__claude-in-chrome__<tool_name>\` to load the specific tool
2. Then call the tool

For example, to get tab context:
1. First: ToolSearch with query "select:mcp__claude-in-chrome__tabs_context_mcp"
2. Then: Call mcp__claude-in-chrome__tabs_context_mcp`
// @from(Ln 429559, Col 4)
zBA = '**Browser Automation**: Chrome browser tools are available via the "claude-in-chrome" skill. CRITICAL: Before using any mcp__claude-in-chrome__* tools, invoke the skill by calling the Skill tool with skill: "claude-in-chrome". The skill provides browser automation instructions and enables the tools.'
// @from(Ln 429567, Col 0)
function _Kz() {
    return [OKz]
}
// @from(Ln 429570, Col 0)
async function SHq(A, q) {
    if (A.length === 0) return q?.("[Claude in Chrome] No browser paths to check"), {
        isInstalled: !1,
        browser: null
    };
    let K = _Kz();
    for (let {
            browser: Y,
            path: z
        }
        of A) {
        let w = [];
        try {
            w = await CHq(z, {
                withFileTypes: !0
            })
        } catch ($) {
            let O = $.code;
            if (O === "ENOENT" || O === "EACCES" || O === "EPERM") continue;
            throw $
        }
        let H = w.filter(($) => $.isDirectory()).filter(($) => $.name === "Default" || $.name.startsWith("Profile ")).map(($) => $.name);
        if (H.length > 0) q?.(`[Claude in Chrome] Found ${Y} profiles: ${H.join(", ")}`);
        for (let $ of H)
            for (let O of K) {
                let _ = $Kz(z, $, "Extensions", O);
                try {
                    return await CHq(_), q?.(`[Claude in Chrome] Extension ${O} found in ${Y} ${$}`), {
                        isInstalled: !0,
                        browser: Y
                    }
                } catch {}
            }
    }
    return q?.("[Claude in Chrome] Extension not found in any browser"), {
        isInstalled: !1,
        browser: null
    }
}
// @from(Ln 429609, Col 0)
async function hHq(A, q) {
    return (await SHq(A, q)).isInstalled
}
// @from(Ln 429612, Col 4)
OKz = "fcoeoabgfenejglbffodgkkbkcdhcgfn"
// @from(Ln 429613, Col 4)
IHq = () => {}
// @from(Ln 429630, Col 0)
function UN6(A) {
    if (w4() && A !== !0) return !1;
    if (A === !0) return !0;
    if (A === !1) return !1;
    if (J6(process.env.CLAUDE_CODE_ENABLE_CFC)) return !0;
    if (FY(process.env.CLAUDE_CODE_ENABLE_CFC)) return !1;
    let q = f6();
    if (q.claudeInChromeDefaultEnabled !== void 0) return q.claudeInChromeDefaultEnabled;
    return !1
}
// @from(Ln 429641, Col 0)
function cZ1() {
    if (gN6 !== void 0) return gN6;
    return gN6 = wQ() && WKz() && x8("tengu_chrome_auto_enable", !1), gN6
}
// @from(Ln 429646, Col 0)
function HBA() {
    let A = D9(),
        q = Qe.map((z) => `mcp__claude-in-chrome__${z.name}`),
        K = {};
    if (HQ()) K.CLAUDE_CHROME_PERMISSION_MODE = "skip_all_permission_checks";
    let Y = Object.keys(K).length > 0;
    if (A) {
        let z = `"${process.execPath}" --chrome-native-host`;
        return uHq(z).then((w) => bHq(w)), {
            mcpConfig: {
                [qy]: {
                    type: "stdio",
                    command: process.execPath,
                    args: ["--claude-in-chrome-mcp"],
                    scope: "dynamic",
                    ...Y && {
                        env: K
                    }
                }
            },
            allowedTools: q,
            systemPrompt: YBA()
        }
    } else {
        let z = DKz(import.meta.url),
            w = vc(z, ".."),
            H = vc(w, "cli.js");
        return uHq(`"${process.execPath}" "${H}" --chrome-native-host`).then((O) => bHq(O)), {
            mcpConfig: {
                [qy]: {
                    type: "stdio",
                    command: process.execPath,
                    args: [`${H}`, "--claude-in-chrome-mcp"],
                    scope: "dynamic",
                    ...Y && {
                        env: K
                    }
                }
            },
            allowedTools: q,
            systemPrompt: YBA()
        }
    }
}
// @from(Ln 429691, Col 0)
function MKz() {
    if (eA() === "windows") {
        let q = XKz(),
            K = process.env.APPDATA || vc(q, "AppData", "Local");
        return [vc(K, "Claude Code", "ChromeNativeHost")]
    }
    return fn4().map(({
        path: q
    }) => q)
}
// @from(Ln 429701, Col 0)
async function bHq(A) {
    let q = MKz();
    if (q.length === 0) throw Error("Claude in Chrome Native Host not supported on this platform");
    let K = {
            name: wBA,
            description: "Claude Code Browser Extension Native Host",
            path: A,
            type: "stdio",
            allowed_origins: ["chrome-extension://fcoeoabgfenejglbffodgkkbkcdhcgfn/", ...[]]
        },
        Y = Q1(K, null, 2),
        z = !1;
    for (let w of q) {
        let H = vc(w, xHq);
        if (await mHq(H, "utf-8").catch(() => null) === Y) continue;
        try {
            await BHq(w, {
                recursive: !0
            }), await FHq(H, Y), h(`[Claude in Chrome] Installed native host manifest at: ${H}`), z = !0
        } catch (O) {
            h(`[Claude in Chrome] Failed to install manifest at ${H}: ${O}`)
        }
    }
    if (eA() === "windows") {
        let w = vc(q[0], xHq);
        PKz(w)
    }
    if (z) Ec().then((w) => {
        if (w) h("[Claude in Chrome] First-time install detected, opening reconnect page in browser"), jG6(jKz);
        else h("[Claude in Chrome] First-time install detected, but extension not installed, skipping reconnect")
    })
}
// @from(Ln 429734, Col 0)
function PKz(A) {
    let q = Vn4();
    for (let {
            browser: K,
            key: Y
        }
        of q) {
        let z = `${Y}\\${wBA}`;
        d4("reg", ["add", z, "/ve", "/t", "REG_SZ", "/d", A, "/f"]).then((w) => {
            if (w.code === 0) h(`[Claude in Chrome] Registered native host for ${K} in Windows registry: ${z}`);
            else h(`[Claude in Chrome] Failed to register native host for ${K} in Windows registry: ${w.stderr}`)
        })
    }
}
// @from(Ln 429748, Col 0)
async function uHq(A) {
    let q = eA(),
        K = vc(O8(), "chrome"),
        Y = q === "windows" ? vc(K, "chrome-native-host.bat") : vc(K, "chrome-native-host"),
        z = q === "windows" ? `@echo off
REM Chrome native host wrapper script
REM Generated by Claude Code - do not edit manually
${A}
` : `#!/bin/sh
# Chrome native host wrapper script
# Generated by Claude Code - do not edit manually
exec ${A}
`;
    if (await mHq(Y, "utf-8").catch(() => null) === z) return Y;
    if (await BHq(K, {
            recursive: !0
        }), await FHq(Y, z), q !== "windows") await JKz(Y, 493);
    return h(`[Claude in Chrome] Created Chrome native host wrapper script: ${Y}`), Y
}
// @from(Ln 429768, Col 0)
function WKz() {
    return Ec().then((q) => {
        if (f6().cachedChromeExtensionInstalled !== q) jA((Y) => ({
            ...Y,
            cachedChromeExtensionInstalled: q
        }))
    }), f6().cachedChromeExtensionInstalled ?? !1
}
// @from(Ln 429776, Col 0)
async function Ec() {
    let A = Zn4();
    if (A.length === 0) return h(`[Claude in Chrome] Unsupported platform for extension detection: ${eA()}`), !1;
    return hHq(A, h)
}
// @from(Ln 429781, Col 4)
jKz = "https://clau.de/chrome/reconnect"
// @from(Ln 429782, Col 4)
wBA = "com.anthropic.claude_code_browser_extension"
// @from(Ln 429783, Col 4)
xHq
// @from(Ln 429783, Col 9)
gN6 = void 0
// @from(Ln 429784, Col 4)
r91 = v(() => {
    x3();
    Z6();
    tq();
    hA();
    B6();
    QN6();
    kI();
    cA();
    m6();
    U4();
    IHq();
    xHq = `${wBA}.json`
})
// @from(Ln 429798, Col 4)
QHq = {}
// @from(Ln 429803, Col 0)
function VKz(A) {
    let q = e(41),
        {
            onDone: K,
            isExtensionInstalled: Y,
            configEnabled: z,
            isClaudeAISubscriber: w,
            isWSL: H
        } = A,
        $ = v6(kKz),
        [O, _] = fd1.useState(0),
        [J, X] = fd1.useState(z ?? !1),
        [D, j] = fd1.useState(!1),
        [M, P] = fd1.useState(Y),
        W;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) W = !1, q[0] = W;
    else W = q[0];
    let G = W,
        f;
    if (q[1] !== $) f = $.find(EKz), q[1] = $, q[2] = f;
    else f = q[2];
    let N = f?.type === "connected",
        T;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) T = function(T1) {
        if (G) zY(T1);
        else jG6(T1)
    }, q[3] = T;
    else T = q[3];
    let k = T,
        y;
    if (q[4] !== J) y = function(T1) {
        A: switch (T1) {
            case "install-extension": {
                _(vKz), j(!0), k(GKz);
                break A
            }
            case "reconnect": {
                _(TKz), Ec().then((N1) => {
                    if (P(N1), N1) j(!1)
                }), k(fKz);
                break A
            }
            case "manage-permissions": {
                _(NKz), k(ZKz);
                break A
            }
            case "toggle-default": {
                let N1 = !J;
                jA((j1) => ({
                    ...j1,
                    claudeInChromeDefaultEnabled: N1
                })), X(N1)
            }
        }
    }, q[4] = J, q[5] = y;
    else y = q[5];
    let B = y,
        S;
    if (q[6] !== J || q[7] !== M) {
        S = [];
        let O1 = M ? "" : " (requires extension)";
        if (!M && !G) {
            let D1;
            if (q[9] === Symbol.for("react.memo_cache_sentinel")) D1 = {
                label: "Install Chrome extension",
                value: "install-extension"
            }, q[9] = D1;
            else D1 = q[9];
            S.push(D1)
        }
        let T1;
        if (q[10] === Symbol.for("react.memo_cache_sentinel")) T1 = sY.default.createElement(V, null, "Manage permissions"), q[10] = T1;
        else T1 = q[10];
        let N1;
        if (q[11] !== O1) N1 = {
            label: sY.default.createElement(sY.default.Fragment, null, T1, sY.default.createElement(V, {
                dimColor: !0
            }, O1)),
            value: "manage-permissions"
        }, q[11] = O1, q[12] = N1;
        else N1 = q[12];
        let j1;
        if (q[13] === Symbol.for("react.memo_cache_sentinel")) j1 = sY.default.createElement(V, null, "Reconnect extension"), q[13] = j1;
        else j1 = q[13];
        let q1;
        if (q[14] !== O1) q1 = {
            label: sY.default.createElement(sY.default.Fragment, null, j1, sY.default.createElement(V, {
                dimColor: !0
            }, O1)),
            value: "reconnect"
        }, q[14] = O1, q[15] = q1;
        else q1 = q[15];
        let t = `Enabled by default: ${J?"Yes":"No"}`,
            J1;
        if (q[16] !== t) J1 = {
            label: t,
            value: "toggle-default"
        }, q[16] = t, q[17] = J1;
        else J1 = q[17];
        S.push(N1, q1, J1), q[6] = J, q[7] = M, q[8] = S
    } else S = q[8];
    let m = H || !w,
        b;
    if (q[18] !== K) b = () => K(), q[18] = K, q[19] = b;
    else b = q[19];
    let g;
    if (q[20] === Symbol.for("react.memo_cache_sentinel")) g = sY.default.createElement(V, null, "Claude in Chrome works with the Chrome extension to let you control your browser directly from Claude Code. Navigate websites, fill forms, capture screenshots, record GIFs, and debug with console logs and network requests."), q[20] = g;
    else g = q[20];
    let U;
    if (q[21] !== H) U = H && sY.default.createElement(V, {
        color: "error"
    }, "Claude in Chrome is not supported in WSL at this time."), q[21] = H, q[22] = U;
    else U = q[22];
    let x;
    if (q[23] !== w) x = !w && sY.default.createElement(V, {
        color: "error"
    }, "Claude in Chrome requires a claude.ai subscription."), q[23] = w, q[24] = x;
    else x = q[24];
    let p;
    if (q[25] !== B || q[26] !== N || q[27] !== m || q[28] !== M || q[29] !== S || q[30] !== O || q[31] !== D) p = !m && sY.default.createElement(sY.default.Fragment, null, !G && sY.default.createElement(I, {
        flexDirection: "column"
    }, sY.default.createElement(V, null, "Status:", " ", N ? sY.default.createElement(V, {
        color: "success"
    }, "Enabled") : sY.default.createElement(V, {
        color: "inactive"
    }, "Disabled")), sY.default.createElement(V, null, "Extension:", " ", M ? sY.default.createElement(V, {
        color: "success"
    }, "Installed") : sY.default.createElement(V, {
        color: "warning"
    }, "Not detected"))), sY.default.createElement(kA, {
        key: O,
        options: S,
        onChange: B,
        hideIndexes: !0
    }), D && sY.default.createElement(V, {
        color: "warning"
    }, "Once installed, select ", '"Reconnect extension"', " to connect."), sY.default.createElement(V, null, sY.default.createElement(V, {
        dimColor: !0
    }, "Usage: "), sY.default.createElement(V, null, "claude --chrome"), sY.default.createElement(V, {
        dimColor: !0
    }, " or "), sY.default.createElement(V, null, "claude --no-chrome")), sY.default.createElement(V, {
        dimColor: !0
    }, "Site-level permissions are inherited from the Chrome extension. Manage permissions in the Chrome extension settings to control which sites Claude can browse, click, and type on.")), q[25] = B, q[26] = N, q[27] = m, q[28] = M, q[29] = S, q[30] = O, q[31] = D, q[32] = p;
    else p = q[32];
    let l;
    if (q[33] === Symbol.for("react.memo_cache_sentinel")) l = sY.default.createElement(V, {
        dimColor: !0
    }, "Learn more: https://code.claude.com/docs/en/chrome"), q[33] = l;
    else l = q[33];
    let r;
    if (q[34] !== U || q[35] !== x || q[36] !== p) r = sY.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, g, U, x, p, l), q[34] = U, q[35] = x, q[36] = p, q[37] = r;
    else r = q[37];
    let s;
    if (q[38] !== r || q[39] !== b) s = sY.default.createElement(w8, {
        title: "Claude in Chrome (Beta)",
        onCancel: b,
        color: "chromeYellow"
    }, r), q[38] = r, q[39] = b, q[40] = s;
    else s = q[40];
    return s
}
// @from(Ln 429968, Col 0)
function NKz(A) {
    return A + 1
}
// @from(Ln 429972, Col 0)
function TKz(A) {
    return A + 1
}
// @from(Ln 429976, Col 0)
function vKz(A) {
    return A + 1
}
// @from(Ln 429980, Col 0)
function EKz(A) {
    return A.name === qy
}
// @from(Ln 429984, Col 0)
function kKz(A) {
    return A.mcp.clients
}
// @from(Ln 429987, Col 4)
sY
// @from(Ln 429987, Col 8)
fd1
// @from(Ln 429987, Col 13)
GKz = "https://claude.ai/chrome"
// @from(Ln 429988, Col 4)
ZKz = "https://clau.de/chrome/permissions"
// @from(Ln 429989, Col 4)
fKz = "https://clau.de/chrome/reconnect"
// @from(Ln 429990, Col 4)
LKz = async function(A) {
        u8("chrome");
        let q = await Ec(),
            K = f6(),
            Y = i8(),
            z = xA.isWslEnvironment();
        return sY.default.createElement(VKz, {
            onDone: A,
            isExtensionInstalled: q,
            configEnabled: K.claudeInChromeDefaultEnabled,
            isClaudeAISubscriber: Y,
            isWSL: z
        })
    }
// @from(Ln 430004, Col 4)
gHq = v(() => {
    i1();
    m1();
    r91();
    kI();
    cA();
    Bq();
    U5();
    d8();
    J7();
    G5();
    Oj();
    hA();
    v3();
    sY = o(X1(), 1), fd1 = o(X1(), 1)
})
// @from(Ln 430020, Col 4)
RKz
// @from(Ln 430020, Col 9)
UHq
// @from(Ln 430021, Col 4)
pHq = v(() => {
    B6();
    RKz = {
        name: "chrome",
        description: "Claude in Chrome (Beta) settings",
        isEnabled: () => !w4(),
        isHidden: !1,
        type: "local-jsx",
        load: () => Promise.resolve().then(() => (gHq(), QHq)),
        userFacingName: () => "chrome"
    }, UHq = RKz
})
// @from(Ln 430033, Col 4)
dHq = {}
// @from(Ln 430037, Col 0)
async function yKz() {
    if (await zY("https://www.stickermule.com/claudecode")) return {
        type: "text",
        value: "Opening sticker page in browser…"
    };
    else return {
        type: "text",
        value: "Failed to open browser. Visit: https://www.stickermule.com/claudecode"
    }
}
// @from(Ln 430047, Col 4)
cHq = v(() => {
    Oj()
})
// @from(Ln 430050, Col 4)
CKz
// @from(Ln 430050, Col 9)
$BA
// @from(Ln 430051, Col 4)
lHq = v(() => {
    CKz = {
        type: "local",
        name: "stickers",
        description: "Order Claude Code stickers",
        isEnabled: () => !0,
        isHidden: !1,
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (cHq(), dHq)),
        userFacingName() {
            return "stickers"
        }
    }, $BA = CKz
})
// @from(Ln 430066, Col 0)
function Sj(A) {
    let q = {
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
    iHq.push(q)
}
// @from(Ln 430093, Col 0)
function nHq() {
    return [...iHq]
}
// @from(Ln 430096, Col 4)
iHq
// @from(Ln 430097, Col 4)
nI = v(() => {
    iHq = []
})
// @from(Ln 430100, Col 4)
SKz
// @from(Ln 430100, Col 9)
rHq
// @from(Ln 430101, Col 4)
oHq = v(() => {
    m1();
    U5();
    Et();
    x2();
    VI();
    tq();
    u6();
    Bq();
    SKz = o(X1(), 1), rHq = o(X1(), 1)
})
// @from(Ln 430113, Col 0)
function IKz() {
    return pj(hKz) ?? "Goodbye!"
}
// @from(Ln 430117, Col 0)
function aHq(A) {
    let q = e(5),
        {
            showWorktree: K,
            onDone: Y,
            onCancel: z
        } = A,
        w;
    if (q[0] !== Y) w = async function(O) {
        Y(O ?? IKz()), await nK(0, "prompt_input_exit")
    }, q[0] = Y, q[1] = w;
    else w = q[1];
    let H = w;
    return null
}
// @from(Ln 430132, Col 4)
PP$
// @from(Ln 430132, Col 9)
hKz
// @from(Ln 430133, Col 4)
OBA = v(() => {
    i1();
    gl();
    oHq();
    w$();
    PP$ = o(X1(), 1), hKz = ["Goodbye!", "See ya!", "Bye!", "Catch you later!"]
})
// @from(Ln 430140, Col 4)
sHq = {}
// @from(Ln 430145, Col 0)
function uKz() {
    return pj(bKz) ?? "Goodbye!"
}
// @from(Ln 430148, Col 0)
async function BKz(A) {
    return A(uKz()), await nK(0, "prompt_input_exit"), null
}
// @from(Ln 430151, Col 4)
xKz
// @from(Ln 430151, Col 9)
bKz
// @from(Ln 430152, Col 4)
tHq = v(() => {
    gl();
    w$();
    Et();
    OBA();
    xKz = o(X1(), 1), bKz = ["Goodbye!", "See ya!", "Bye!", "Catch you later!"]
})
// @from(Ln 430159, Col 4)
mKz
// @from(Ln 430159, Col 9)
Vd1
// @from(Ln 430160, Col 4)
_BA = v(() => {
    mKz = {
        type: "local-jsx",
        name: "exit",
        aliases: ["quit"],
        description: "Exit the REPL",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (tHq(), sHq)),
        userFacingName() {
            return "exit"
        }
    }, Vd1 = mKz
})
// @from(Ln 430178, Col 0)
function eHq({
    content: A,
    defaultFilename: q,
    onDone: K
}) {
    let [, Y] = ge.useState(null), [z, w] = ge.useState(q), [H, $] = ge.useState(q.length), [O, _] = ge.useState(!1), {
        columns: J
    } = Z8(), X = ge.useCallback(() => {
        _(!1), Y(null)
    }, []), D = async (G) => {
        if (G === "clipboard")
            if (await l0(A)) K({
                success: !0,
                message: "Conversation copied to clipboard"
            });
            else K({
                success: !1,
                message: xD1()
            });
        else if (G === "file") Y("file"), _(!0)
    }, j = () => {
        let G = z.endsWith(".txt") ? z : z.replace(/\.[^.]+$/, "") + ".txt",
            f = FKz(h6(), G);
        try {
            c8(f, A, {
                encoding: "utf-8",
                flush: !0
            }), K({
                success: !0,
                message: `Conversation exported to: ${G}`
            })
        } catch (Z) {
            K({
                success: !1,
                message: `Failed to export conversation: ${Z instanceof Error?Z.message:"Unknown error"}`
            })
        }
    }, M = ge.useCallback(() => {
        if (O) X();
        else K({
            success: !1,
            message: "Export cancelled"
        })
    }, [O, X, K]), P = [{
        label: "Copy to clipboard",
        value: "clipboard",
        description: "Copy the conversation to your system clipboard"
    }, {
        label: "Save to file",
        value: "file",
        description: "Save the conversation to a file in the current directory"
    }];

    function W(G) {
        if (O) return TE.default.createElement(oA, null, TE.default.createElement(YA, {
            shortcut: "Enter",
            action: "save"
        }), TE.default.createElement(NA, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
        }));
        if (G.pending) return TE.default.createElement(V, null, "Press ", G.keyName, " again to exit");
        return TE.default.createElement(NA, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        })
    }
    return TE.default.createElement(w8, {
        title: "Export Conversation",
        subtitle: "Select export method:",
        color: "permission",
        onCancel: M,
        inputGuide: W
    }, !O ? TE.default.createElement(kA, {
        options: P,
        onChange: D,
        onCancel: M
    }) : TE.default.createElement(I, {
        flexDirection: "column"
    }, TE.default.createElement(V, null, "Enter filename:"), TE.default.createElement(I, {
        flexDirection: "row",
        gap: 1,
        marginTop: 1
    }, TE.default.createElement(V, null, ">"), TE.default.createElement(k3, {
        value: z,
        onChange: w,
        onSubmit: j,
        focus: !0,
        showCursor: !0,
        columns: J,
        cursorOffset: H,
        onChangeCursorOffset: $
    }))))
}
// @from(Ln 430276, Col 4)
TE
// @from(Ln 430276, Col 8)
ge
// @from(Ln 430277, Col 4)
A$q = v(() => {
    m1();
    U5();
    gO();
    N7();
    m6();
    OB();
    wK();
    BK();
    HK();
    mq();
    Bq();
    TE = o(X1(), 1), ge = o(X1(), 1)
})
// @from(Ln 430292, Col 0)
function QKz({
    children: A
}) {
    let {
        bindings: q
    } = YS1(), K = JF.useRef(null), Y = JF.useRef(new Map), z = JF.useRef(new Set).current;
    return JF.default.createElement(A36, {
        bindings: q,
        pendingChordRef: K,
        pendingChord: null,
        setPendingChord: () => {},
        activeContexts: z,
        registerActiveContext: () => {},
        unregisterActiveContext: () => {},
        handlerRegistryRef: Y
    }, A)
}
// @from(Ln 430309, Col 0)
async function q$q(A, q = []) {
    return JZ1(JF.default.createElement(() => {
        let Y = e(5),
            z;
        if (Y[0] === Symbol.for("react.memo_cache_sentinel")) z = [], Y[0] = z;
        else z = Y[0];
        let w;
        if (Y[1] === Symbol.for("react.memo_cache_sentinel")) w = [], Y[1] = w;
        else w = Y[1];
        let H, $;
        if (Y[2] === Symbol.for("react.memo_cache_sentinel")) H = [], $ = new Set, Y[2] = H, Y[3] = $;
        else H = Y[2], $ = Y[3];
        let O;
        if (Y[4] === Symbol.for("react.memo_cache_sentinel")) O = JF.default.createElement(u_, null, JF.default.createElement(QKz, null, JF.default.createElement(g91, {
            messages: A,
            normalizedMessageHistory: z,
            tools: q,
            commands: w,
            verbose: !1,
            toolJSX: null,
            toolUseConfirmQueue: H,
            inProgressToolUseIDs: $,
            isMessageSelectorVisible: !1,
            conversationId: "export",
            screen: "prompt",
            screenToggleId: 0,
            streamingToolUses: [],
            showAllInTranscript: !0,
            isLoading: !1
        }))), Y[4] = O;
        else O = Y[4];
        return O
    }, null))
}
// @from(Ln 430343, Col 4)
JF
// @from(Ln 430344, Col 4)
K$q = v(() => {
    i1();
    fp1();
    Ad1();
    d8();
    eg();
    AU();
    JF = o(X1(), 1)
})
// @from(Ln 430353, Col 4)
H$q = {}
// @from(Ln 430363, Col 0)
function UKz(A) {
    let q = A.getFullYear(),
        K = String(A.getMonth() + 1).padStart(2, "0"),
        Y = String(A.getDate()).padStart(2, "0"),
        z = String(A.getHours()).padStart(2, "0"),
        w = String(A.getMinutes()).padStart(2, "0"),
        H = String(A.getSeconds()).padStart(2, "0");
    return `${q}-${K}-${Y}-${z}${w}${H}`
}
// @from(Ln 430373, Col 0)
function z$q(A) {
    let q = A.find((z) => z.type === "user");
    if (!q || q.type !== "user") return "";
    let K = q.message?.content,
        Y = "";
    if (typeof K === "string") Y = K.trim();
    else if (Array.isArray(K)) {
        let z = K.find((w) => w.type === "text");
        if (z && "text" in z) Y = z.text.trim()
    }
    if (Y = Y.split(`
`)[0] || "", Y.length > 50) Y = Y.substring(0, 50) + "...";
    return Y
}
// @from(Ln 430388, Col 0)
function w$q(A) {
    return A.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}
// @from(Ln 430391, Col 0)
async function pKz(A) {
    let q = A.options.tools || [];
    return q$q(A.messages, q)
}
// @from(Ln 430395, Col 0)
async function dKz(A, q, K) {
    u8("export");
    let Y = await pKz(q);
    if (K.trim()) {
        let $ = K.trim(),
            O = $.endsWith(".txt") ? $ : $.replace(/\.[^.]+$/, "") + ".txt",
            _ = gKz(h6(), O);
        try {
            return c8(_, Y, {
                encoding: "utf-8",
                flush: !0
            }), A(`Conversation exported to: ${O}`), null
        } catch (J) {
            return A(`Failed to export conversation: ${J instanceof Error?J.message:"Unknown error"}`), null
        }
    }
    let z = z$q(q.messages),
        w = UKz(new Date),
        H;
    if (z) {
        let $ = w$q(z);
        H = $ ? `${w.substring(0,10)}-${$}.txt` : `conversation-${w}.txt`
    } else H = `conversation-${w}.txt`;
    return Y$q.default.createElement(eHq, {
        content: Y,
        defaultFilename: H,
        onDone: ($) => {
            A($.message)
        }
    })
}
// @from(Ln 430426, Col 4)
Y$q
// @from(Ln 430427, Col 4)
$$q = v(() => {
    A$q();
    K$q();
    N7();
    m6();
    v3();
    Y$q = o(X1(), 1)
})
// @from(Ln 430435, Col 4)
cKz
// @from(Ln 430435, Col 9)
O$q
// @from(Ln 430436, Col 4)
_$q = v(() => {
    cKz = {
        type: "local-jsx",
        name: "export",
        description: "Export the current conversation to a file or clipboard",
        isEnabled: () => !0,
        isHidden: !1,
        argumentHint: "[filename]",
        load: () => Promise.resolve().then(() => ($$q(), H$q)),
        userFacingName() {
            return "export"
        }
    }, O$q = cKz
})
// @from(Ln 430450, Col 4)
J$q = {}
// @from(Ln 430455, Col 0)
function lKz(A) {
    let q = e(17),
        {
            onDone: K
        } = A,
        Y = v6(oKz),
        z = v6(rKz),
        w = v6(nKz),
        H = L7(),
        $;
    if (q[0] !== Y || q[1] !== K) $ = function() {
        c("tengu_model_command_menu", {
            action: "cancel"
        });
        let M = Y ?? w71().label;
        K(`Kept model as ${H6.bold(M)}`, {
            display: "system"
        })
    }, q[0] = Y, q[1] = K, q[2] = $;
    else $ = q[2];
    let O = $,
        _;
    if (q[3] !== w || q[4] !== Y || q[5] !== K || q[6] !== H) _ = function(M, P) {
        c("tengu_model_command_menu", {
            action: M,
            from_model: Y,
            to_model: M
        }), H((G) => ({
            ...G,
            mainLoopModel: M,
            mainLoopModelForSession: null
        }));
        let W = `Set model to ${H6.bold(_S(M))}`;
        if (P !== void 0) W = W + ` with ${H6.bold(P)} effort`;
        if (i4()) {
            if (e81(), !x$(M) && w) H(iKz), W = W + " · Fast mode OFF";
            else if (x$(M) && lH() && w) W = W + ` · ${O7A}`
        }
        K(W)
    }, q[3] = w, q[4] = Y, q[5] = K, q[6] = H, q[7] = _;
    else _ = q[7];
    let J = _,
        X;
    if (q[8] !== w || q[9] !== Y) X = i4() && w && x$(Y) && lH(), q[8] = w, q[9] = Y, q[10] = X;
    else X = q[10];
    let D;
    if (q[11] !== O || q[12] !== J || q[13] !== Y || q[14] !== z || q[15] !== X) D = rI.createElement(wZ1, {
        initial: Y,
        sessionModel: z,
        onSelect: J,
        onCancel: O,
        isStandaloneCommand: !0,
        showPenguinsNotice: X
    }), q[11] = O, q[12] = J, q[13] = Y, q[14] = z, q[15] = X, q[16] = D;
    else D = q[16];
    return D
}
// @from(Ln 430513, Col 0)
function iKz(A) {
    return {
        ...A,
        fastMode: !1
    }
}
// @from(Ln 430520, Col 0)
function nKz(A) {
    return A.fastMode
}
// @from(Ln 430524, Col 0)
function rKz(A) {
    return A.mainLoopModelForSession
}
// @from(Ln 430528, Col 0)
function oKz(A) {
    return A.mainLoopModel
}
// @from(Ln 430532, Col 0)
function aKz({
    args: A,
    onDone: q
}) {
    let K = v6((w) => w.fastMode),
        Y = L7(),
        z = A === "default" ? null : A;
    return rI.useEffect(() => {
        async function w() {
            if (z && tKz(z)) {
                let $ = dC() ? "turn on /extra-usage or " : "";
                q(`Your plan doesn't include Opus in Claude Code. You can ${$}/upgrade to Max to access it.`, {
                    display: "system"
                });
                return
            }
            if (z && eKz(z)) {
                q("Opus 4.6 with extended context (1M) is not available on your current plan. Learn more: https://code.claude.com/docs/en/model-config#extended-context-with-1m", {
                    display: "system"
                });
                return
            }
            if (!z) {
                H(null);
                return
            }
            if (sKz(z)) {
                H(z);
                return
            }
            try {
                let {
                    valid: $,
                    error: O
                } = await uW6(z);
                if ($) H(z);
                else q(O || `Model '${z}' not found`, {
                    display: "system"
                })
            } catch ($) {
                q(`Failed to validate model: ${$.message}`, {
                    display: "system"
                })
            }
        }

        function H($) {
            Y((_) => ({
                ..._,
                mainLoopModel: $,
                mainLoopModelForSession: null
            }));
            let O = `Set model to ${H6.bold(_S($))}`;
            if (i4()) {
                if (e81(), !x$($) && K) Y((_) => ({
                    ..._,
                    fastMode: !1
                })), O += " · Fast mode OFF";
                else if (x$($) && K) O += ` · ${O7A}`
            }
            q(O)
        }
        w()
    }, [z, q, Y]), null
}
// @from(Ln 430598, Col 0)
function sKz(A) {
    return g_1.includes(A.toLowerCase().trim())
}
// @from(Ln 430602, Col 0)
function tKz(A) {
    return i8() && !tk() && A.toLowerCase().includes("opus")
}
// @from(Ln 430606, Col 0)
function eKz(A) {
    let q = A.toLowerCase();
    return q.includes("opus") && q.includes("[1m]") && !Q_1().hasAccess
}
// @from(Ln 430611, Col 0)
function A3z(A) {
    let {
        onDone: q
    } = A, K = v6(Y3z), Y = v6(K3z), z = v6(q3z), w = K ?? w71().label, H = z !== void 0 ? ` (effort: ${z})` : "";
    if (Y) q(`Current model: ${H6.bold(_S(Y))} (session override from plan mode)
Base model: ${w}${H}`);
    else q(`Current model: ${w}${H}`);
    return null
}
// @from(Ln 430621, Col 0)
function q3z(A) {
    return A.effortValue
}
// @from(Ln 430625, Col 0)
function K3z(A) {
    return A.mainLoopModelForSession
}
// @from(Ln 430629, Col 0)
function Y3z(A) {
    return A.mainLoopModel
}
// @from(Ln 430632, Col 4)
rI
// @from(Ln 430632, Col 8)
z3z = async (A, q, K) => {
    if (u8("model-picker"), K = K?.trim() || "", Gw1.includes(K)) return c("tengu_model_command_inline_help", {
        args: K
    }), rI.createElement(A3z, {
        onDone: A
    });
    if (Ww1.includes(K)) {
        A("Run /model to open the model selection menu, or /model [modelName] to set the model.", {
            display: "system"
        });
        return
    }
    if (K) return c("tengu_model_command_inline", {
        args: K
    }), rI.createElement(aKz, {
        args: K,
        onDone: A
    });
    return rI.createElement(lKz, {
        onDone: A
    })
}
// @from(Ln 430654, Col 4)
X$q = v(() => {
    i1();
    $V6();
    d8();
    e7();
    URA();
    u6();
    q3();
    J7();
    y7A();
    vz();
    OJ();
    v3();
    rI = o(X1(), 1)
})
// @from(Ln 430669, Col 4)
D$q
// @from(Ln 430670, Col 4)
j$q = v(() => {
    D$q = {
        type: "local-jsx",
        name: "model",
        userFacingName() {
            return "model"
        },
        description: "Set the AI model for Claude Code",
        isEnabled: () => !0,
        isHidden: !1,
        argumentHint: "[model]",
        load: () => Promise.resolve().then(() => (X$q(), J$q))
    }
})
// @from(Ln 430684, Col 4)
P$q = {}
// @from(Ln 430689, Col 0)
function w3z(A) {
    let q = e(11),
        {
            tagName: K,
            onConfirm: Y,
            onCancel: z
        } = A,
        w = `Current tag: #${K}`,
        H;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) H = A_.createElement(V, null, "This will remove the tag from the current session."), q[0] = H;
    else H = q[0];
    let $;
    if (q[1] !== z || q[2] !== Y) $ = (X) => X === "yes" ? Y() : z(), q[1] = z, q[2] = Y, q[3] = $;
    else $ = q[3];
    let O;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) O = [{
        label: "Yes, remove tag",
        value: "yes"
    }, {
        label: "No, keep tag",
        value: "no"
    }], q[4] = O;
    else O = q[4];
    let _;
    if (q[5] !== $) _ = A_.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, H, A_.createElement(kA, {
        onChange: $,
        options: O
    })), q[5] = $, q[6] = _;
    else _ = q[6];
    let J;
    if (q[7] !== z || q[8] !== w || q[9] !== _) J = A_.createElement(w8, {
        title: "Remove tag?",
        subtitle: w,
        onCancel: z,
        color: "warning",
        borderDimColor: !1
    }, _), q[7] = z, q[8] = w, q[9] = _, q[10] = J;
    else J = q[10];
    return J
}
// @from(Ln 430733, Col 0)
function H3z(A) {
    let q = e(17),
        {
            tagName: K,
            onDone: Y
        } = A,
        [z, w] = A_.useState(!1),
        [H, $] = A_.useState(null),
        O;
    if (q[0] !== K) O = _a(K).trim(), q[0] = K, q[1] = O;
    else O = q[1];
    let _ = O,
        J, X;
    if (q[2] !== _ || q[3] !== Y) J = () => {
        let D = U6();
        if (!D) {
            Y("No active session to tag", {
                display: "system"
            });
            return
        }
        if (!_) {
            Y("Tag name cannot be empty", {
                display: "system"
            });
            return
        }
        $(D);
        let j = JBA(D);
        if (j === _) c("tengu_tag_command_remove_prompt", {}), w(!0);
        else c("tengu_tag_command_add", {
            is_replacing: !!j
        }), (async () => {
            let P = dO();
            await pN6(D, _, P), Y(`Tagged session with ${H6.cyan(`#${_}`)}`, {
                display: "system"
            })
        })()
    }, X = [_, Y], q[2] = _, q[3] = Y, q[4] = J, q[5] = X;
    else J = q[4], X = q[5];
    if (A_.useEffect(J, X), z && H) {
        let D;
        if (q[6] !== _ || q[7] !== Y || q[8] !== H) D = async () => {
            c("tengu_tag_command_remove_confirmed", {});
            let P = dO();
            await pN6(H, "", P), Y(`Removed tag ${H6.cyan(`#${_}`)}`, {
                display: "system"
            })
        }, q[6] = _, q[7] = Y, q[8] = H, q[9] = D;
        else D = q[9];
        let j;
        if (q[10] !== _ || q[11] !== Y) j = () => {
            c("tengu_tag_command_remove_cancelled", {}), Y(`Kept tag ${H6.cyan(`#${_}`)}`, {
                display: "system"
            })
        }, q[10] = _, q[11] = Y, q[12] = j;
        else j = q[12];
        let M;
        if (q[13] !== _ || q[14] !== D || q[15] !== j) M = A_.createElement(w3z, {
            tagName: _,
            onConfirm: D,
            onCancel: j
        }), q[13] = _, q[14] = D, q[15] = j, q[16] = M;
        else M = q[16];
        return M
    }
    return null
}