
// @from(Ln 18189, Col 4)
SQ1 = E(() => {
    Sp = [{
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
// @from(Ln 18645, Col 4)
P9
// @from(Ln 18645, Col 8)
CQ1
// @from(Ln 18645, Col 13)
f7
// @from(Ln 18645, Col 17)
ux = (A) => {
    switch (typeof A) {
        case "undefined":
            return f7.undefined;
        case "string":
            return f7.string;
        case "number":
            return Number.isNaN(A) ? f7.nan : f7.number;
        case "boolean":
            return f7.boolean;
        case "function":
            return f7.function;
        case "bigint":
            return f7.bigint;
        case "symbol":
            return f7.symbol;
        case "object":
            if (Array.isArray(A)) return f7.array;
            if (A === null) return f7.null;
            if (A.then && typeof A.then === "function" && A.catch && typeof A.catch === "function") return f7.promise;
            if (typeof Map < "u" && A instanceof Map) return f7.map;
            if (typeof Set < "u" && A instanceof Set) return f7.set;
            if (typeof Date < "u" && A instanceof Date) return f7.date;
            return f7.object;
        default:
            return f7.unknown
    }
}
// @from(Ln 18673, Col 4)
ky6 = E(() => {
    (function(A) {
        A.assertEqual = (z) => {};

        function q(z) {}
        A.assertIs = q;

        function K(z) {
            throw Error()
        }
        A.assertNever = K, A.arrayToEnum = (z) => {
            let _ = {};
            for (let w of z) _[w] = w;
            return _
        }, A.getValidEnumValues = (z) => {
            let _ = A.objectKeys(z).filter((O) => typeof z[z[O]] !== "number"),
                w = {};
            for (let O of _) w[O] = z[O];
            return A.objectValues(w)
        }, A.objectValues = (z) => {
            return A.objectKeys(z).map(function(_) {
                return z[_]
            })
        }, A.objectKeys = typeof Object.keys === "function" ? (z) => Object.keys(z) : (z) => {
            let _ = [];
            for (let w in z)
                if (Object.prototype.hasOwnProperty.call(z, w)) _.push(w);
            return _
        }, A.find = (z, _) => {
            for (let w of z)
                if (_(w)) return w;
            return
        }, A.isInteger = typeof Number.isInteger === "function" ? (z) => Number.isInteger(z) : (z) => typeof z === "number" && Number.isFinite(z) && Math.floor(z) === z;

        function Y(z, _ = " | ") {
            return z.map((w) => typeof w === "string" ? `'${w}'` : w).join(_)
        }
        A.joinValues = Y, A.jsonStringifyReplacer = (z, _) => {
            if (typeof _ === "bigint") return _.toString();
            return _
        }
    })(P9 || (P9 = {}));
    (function(A) {
        A.mergeShapes = (q, K) => {
            return {
                ...q,
                ...K
            }
        }
    })(CQ1 || (CQ1 = {}));
    f7 = P9.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"])
})
// @from(Ln 18725, Col 4)
pA
// @from(Ln 18725, Col 8)
Qeq = (A) => {
        return JSON.stringify(A, null, 2).replace(/"([^"]+)":/g, "$1:")
    }
// @from(Ln 18728, Col 4)
GT
// @from(Ln 18729, Col 4)
R61 = E(() => {
    ky6();
    pA = P9.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]);
    GT = class GT extends Error {
        get errors() {
            return this.issues
        }
        constructor(A) {
            super();
            this.issues = [], this.addIssue = (K) => {
                this.issues = [...this.issues, K]
            }, this.addIssues = (K = []) => {
                this.issues = [...this.issues, ...K]
            };
            let q = new.target.prototype;
            if (Object.setPrototypeOf) Object.setPrototypeOf(this, q);
            else this.__proto__ = q;
            this.name = "ZodError", this.issues = A
        }
        format(A) {
            let q = A || function(z) {
                    return z.message
                },
                K = {
                    _errors: []
                },
                Y = (z) => {
                    for (let _ of z.issues)
                        if (_.code === "invalid_union") _.unionErrors.map(Y);
                        else if (_.code === "invalid_return_type") Y(_.returnTypeError);
                    else if (_.code === "invalid_arguments") Y(_.argumentsError);
                    else if (_.path.length === 0) K._errors.push(q(_));
                    else {
                        let w = K,
                            O = 0;
                        while (O < _.path.length) {
                            let $ = _.path[O];
                            if (O !== _.path.length - 1) w[$] = w[$] || {
                                _errors: []
                            };
                            else w[$] = w[$] || {
                                _errors: []
                            }, w[$]._errors.push(q(_));
                            w = w[$], O++
                        }
                    }
                };
            return Y(this), K
        }
        static assert(A) {
            if (!(A instanceof GT)) throw Error(`Not a ZodError: ${A}`)
        }
        toString() {
            return this.message
        }
        get message() {
            return JSON.stringify(this.issues, P9.jsonStringifyReplacer, 2)
        }
        get isEmpty() {
            return this.issues.length === 0
        }
        flatten(A = (q) => q.message) {
            let q = {},
                K = [];
            for (let Y of this.issues)
                if (Y.path.length > 0) {
                    let z = Y.path[0];
                    q[z] = q[z] || [], q[z].push(A(Y))
                } else K.push(A(Y));
            return {
                formErrors: K,
                fieldErrors: q
            }
        }
        get formErrors() {
            return this.flatten()
        }
    };
    GT.create = (A) => {
        return new GT(A)
    }
})
// @from(Ln 18811, Col 4)
Ueq = (A, q) => {
        let K;
        switch (A.code) {
            case pA.invalid_type:
                if (A.received === f7.undefined) K = "Required";
                else K = `Expected ${A.expected}, received ${A.received}`;
                break;
            case pA.invalid_literal:
                K = `Invalid literal value, expected ${JSON.stringify(A.expected,P9.jsonStringifyReplacer)}`;
                break;
            case pA.unrecognized_keys:
                K = `Unrecognized key(s) in object: ${P9.joinValues(A.keys,", ")}`;
                break;
            case pA.invalid_union:
                K = "Invalid input";
                break;
            case pA.invalid_union_discriminator:
                K = `Invalid discriminator value. Expected ${P9.joinValues(A.options)}`;
                break;
            case pA.invalid_enum_value:
                K = `Invalid enum value. Expected ${P9.joinValues(A.options)}, received '${A.received}'`;
                break;
            case pA.invalid_arguments:
                K = "Invalid function arguments";
                break;
            case pA.invalid_return_type:
                K = "Invalid function return type";
                break;
            case pA.invalid_date:
                K = "Invalid date";
                break;
            case pA.invalid_string:
                if (typeof A.validation === "object")
                    if ("includes" in A.validation) {
                        if (K = `Invalid input: must include "${A.validation.includes}"`, typeof A.validation.position === "number") K = `${K} at one or more positions greater than or equal to ${A.validation.position}`
                    } else if ("startsWith" in A.validation) K = `Invalid input: must start with "${A.validation.startsWith}"`;
                else if ("endsWith" in A.validation) K = `Invalid input: must end with "${A.validation.endsWith}"`;
                else P9.assertNever(A.validation);
                else if (A.validation !== "regex") K = `Invalid ${A.validation}`;
                else K = "Invalid";
                break;
            case pA.too_small:
                if (A.type === "array") K = `Array must contain ${A.exact?"exactly":A.inclusive?"at least":"more than"} ${A.minimum} element(s)`;
                else if (A.type === "string") K = `String must contain ${A.exact?"exactly":A.inclusive?"at least":"over"} ${A.minimum} character(s)`;
                else if (A.type === "number") K = `Number must be ${A.exact?"exactly equal to ":A.inclusive?"greater than or equal to ":"greater than "}${A.minimum}`;
                else if (A.type === "bigint") K = `Number must be ${A.exact?"exactly equal to ":A.inclusive?"greater than or equal to ":"greater than "}${A.minimum}`;
                else if (A.type === "date") K = `Date must be ${A.exact?"exactly equal to ":A.inclusive?"greater than or equal to ":"greater than "}${new Date(Number(A.minimum))}`;
                else K = "Invalid input";
                break;
            case pA.too_big:
                if (A.type === "array") K = `Array must contain ${A.exact?"exactly":A.inclusive?"at most":"less than"} ${A.maximum} element(s)`;
                else if (A.type === "string") K = `String must contain ${A.exact?"exactly":A.inclusive?"at most":"under"} ${A.maximum} character(s)`;
                else if (A.type === "number") K = `Number must be ${A.exact?"exactly":A.inclusive?"less than or equal to":"less than"} ${A.maximum}`;
                else if (A.type === "bigint") K = `BigInt must be ${A.exact?"exactly":A.inclusive?"less than or equal to":"less than"} ${A.maximum}`;
                else if (A.type === "date") K = `Date must be ${A.exact?"exactly":A.inclusive?"smaller than or equal to":"smaller than"} ${new Date(Number(A.maximum))}`;
                else K = "Invalid input";
                break;
            case pA.custom:
                K = "Invalid input";
                break;
            case pA.invalid_intersection_types:
                K = "Intersection results could not be merged";
                break;
            case pA.not_multiple_of:
                K = `Number must be a multiple of ${A.multipleOf}`;
                break;
            case pA.not_finite:
                K = "Number must be finite";
                break;
            default:
                K = q.defaultError, P9.assertNever(A)
        }
        return {
            message: K
        }
    }
// @from(Ln 18887, Col 4)
Cp
// @from(Ln 18888, Col 4)
IQ1 = E(() => {
    R61();
    ky6();
    Cp = Ueq
})
// @from(Ln 18894, Col 0)
function deq(A) {
    CKA = A
}
// @from(Ln 18898, Col 0)
function kO6() {
    return CKA
}
// @from(Ln 18901, Col 4)
CKA
// @from(Ln 18902, Col 4)
h61 = E(() => {
    IQ1();
    CKA = Cp
})
// @from(Ln 18907, Col 0)
function o7(A, q) {
    let K = kO6(),
        Y = Ey6({
            issueData: q,
            data: A.data,
            path: A.path,
            errorMaps: [A.common.contextualErrorMap, A.schemaErrorMap, K, K === Cp ? void 0 : Cp].filter((z) => !!z)
        });
    A.common.issues.push(Y)
}
// @from(Ln 18917, Col 0)
class jP {
    constructor() {
        this.value = "valid"
    }
    dirty() {
        if (this.value === "valid") this.value = "dirty"
    }
    abort() {
        if (this.value !== "aborted") this.value = "aborted"
    }
    static mergeArray(A, q) {
        let K = [];
        for (let Y of q) {
            if (Y.status === "aborted") return PK;
            if (Y.status === "dirty") A.dirty();
            K.push(Y.value)
        }
        return {
            status: A.value,
            value: K
        }
    }
    static async mergeObjectAsync(A, q) {
        let K = [];
        for (let Y of q) {
            let z = await Y.key,
                _ = await Y.value;
            K.push({
                key: z,
                value: _
            })
        }
        return jP.mergeObjectSync(A, K)
    }
    static mergeObjectSync(A, q) {
        let K = {};
        for (let Y of q) {
            let {
                key: z,
                value: _
            } = Y;
            if (z.status === "aborted") return PK;
            if (_.status === "aborted") return PK;
            if (z.status === "dirty") A.dirty();
            if (_.status === "dirty") A.dirty();
            if (z.value !== "__proto__" && (typeof _.value < "u" || Y.alwaysSet)) K[z.value] = _.value
        }
        return {
            status: A.value,
            value: K
        }
    }
}
// @from(Ln 18970, Col 4)
Ey6 = (A) => {
        let {
            data: q,
            path: K,
            errorMaps: Y,
            issueData: z
        } = A, _ = [...K, ...z.path || []], w = {
            ...z,
            path: _
        };
        if (z.message !== void 0) return {
            ...z,
            path: _,
            message: z.message
        };
        let O = "",
            $ = Y.filter((H) => !!H).slice().reverse();
        for (let H of $) O = H(w, {
            data: q,
            defaultError: O
        }).message;
        return {
            ...z,
            path: _,
            message: O
        }
    }
// @from(Ln 18997, Col 4)
ceq
// @from(Ln 18997, Col 9)
PK
// @from(Ln 18997, Col 13)
kA6 = (A) => ({
        status: "dirty",
        value: A
    })
// @from(Ln 19001, Col 4)
XW = (A) => ({
        status: "valid",
        value: A
    })
// @from(Ln 19005, Col 4)
S61 = (A) => A.status === "aborted"
// @from(Ln 19006, Col 4)
C61 = (A) => A.status === "dirty"
// @from(Ln 19007, Col 4)
mn = (A) => A.status === "valid"
// @from(Ln 19008, Col 4)
EO6 = (A) => typeof Promise < "u" && A instanceof Promise
// @from(Ln 19009, Col 4)
bQ1 = E(() => {
    h61();
    IQ1();
    ceq = [];
    PK = Object.freeze({
        status: "aborted"
    })
})
// @from(Ln 19017, Col 4)
IKA = () => {}
// @from(Ln 19018, Col 4)
Yq
// @from(Ln 19019, Col 4)
bKA = E(() => {
    (function(A) {
        A.errToObj = (q) => typeof q === "string" ? {
            message: q
        } : q || {}, A.toString = (q) => typeof q === "string" ? q : q?.message
    })(Yq || (Yq = {}))
})
// @from(Ln 19026, Col 0)
class TS {
    constructor(A, q, K, Y) {
        this._cachedPath = [], this.parent = A, this.data = q, this._path = K, this._key = Y
    }
    get path() {
        if (!this._cachedPath.length)
            if (Array.isArray(this._key)) this._cachedPath.push(...this._path, ...this._key);
            else this._cachedPath.push(...this._path, this._key);
        return this._cachedPath
    }
}
// @from(Ln 19038, Col 0)
function A3(A) {
    if (!A) return {};
    let {
        errorMap: q,
        invalid_type_error: K,
        required_error: Y,
        description: z
    } = A;
    if (q && (K || Y)) throw Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    if (q) return {
        errorMap: q,
        description: z
    };
    return {
        errorMap: (w, O) => {
            let {
                message: $
            } = A;
            if (w.code === "invalid_enum_value") return {
                message: $ ?? O.defaultError
            };
            if (typeof O.data > "u") return {
                message: $ ?? Y ?? O.defaultError
            };
            if (w.code !== "invalid_type") return {
                message: O.defaultError
            };
            return {
                message: $ ?? K ?? O.defaultError
            }
        },
        description: z
    }
}
// @from(Ln 19072, Col 0)
class U3 {
    get description() {
        return this._def.description
    }
    _getType(A) {
        return ux(A.data)
    }
    _getOrReturnCtx(A, q) {
        return q || {
            common: A.parent.common,
            data: A.data,
            parsedType: ux(A.data),
            schemaErrorMap: this._def.errorMap,
            path: A.path,
            parent: A.parent
        }
    }
    _processInputParams(A) {
        return {
            status: new jP,
            ctx: {
                common: A.parent.common,
                data: A.data,
                parsedType: ux(A.data),
                schemaErrorMap: this._def.errorMap,
                path: A.path,
                parent: A.parent
            }
        }
    }
    _parseSync(A) {
        let q = this._parse(A);
        if (EO6(q)) throw Error("Synchronous parse encountered promise.");
        return q
    }
    _parseAsync(A) {
        let q = this._parse(A);
        return Promise.resolve(q)
    }
    parse(A, q) {
        let K = this.safeParse(A, q);
        if (K.success) return K.data;
        throw K.error
    }
    safeParse(A, q) {
        let K = {
                common: {
                    issues: [],
                    async: q?.async ?? !1,
                    contextualErrorMap: q?.errorMap
                },
                path: q?.path || [],
                schemaErrorMap: this._def.errorMap,
                parent: null,
                data: A,
                parsedType: ux(A)
            },
            Y = this._parseSync({
                data: A,
                path: K.path,
                parent: K
            });
        return xKA(K, Y)
    }
    "~validate"(A) {
        let q = {
            common: {
                issues: [],
                async: !!this["~standard"].async
            },
            path: [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data: A,
            parsedType: ux(A)
        };
        if (!this["~standard"].async) try {
            let K = this._parseSync({
                data: A,
                path: [],
                parent: q
            });
            return mn(K) ? {
                value: K.value
            } : {
                issues: q.common.issues
            }
        } catch (K) {
            if (K?.message?.toLowerCase()?.includes("encountered")) this["~standard"].async = !0;
            q.common = {
                issues: [],
                async: !0
            }
        }
        return this._parseAsync({
            data: A,
            path: [],
            parent: q
        }).then((K) => mn(K) ? {
            value: K.value
        } : {
            issues: q.common.issues
        })
    }
    async parseAsync(A, q) {
        let K = await this.safeParseAsync(A, q);
        if (K.success) return K.data;
        throw K.error
    }
    async safeParseAsync(A, q) {
        let K = {
                common: {
                    issues: [],
                    contextualErrorMap: q?.errorMap,
                    async: !0
                },
                path: q?.path || [],
                schemaErrorMap: this._def.errorMap,
                parent: null,
                data: A,
                parsedType: ux(A)
            },
            Y = this._parse({
                data: A,
                path: K.path,
                parent: K
            }),
            z = await (EO6(Y) ? Y : Promise.resolve(Y));
        return xKA(K, z)
    }
    refine(A, q) {
        let K = (Y) => {
            if (typeof q === "string" || typeof q > "u") return {
                message: q
            };
            else if (typeof q === "function") return q(Y);
            else return q
        };
        return this._refinement((Y, z) => {
            let _ = A(Y),
                w = () => z.addIssue({
                    code: pA.custom,
                    ...K(Y)
                });
            if (typeof Promise < "u" && _ instanceof Promise) return _.then((O) => {
                if (!O) return w(), !1;
                else return !0
            });
            if (!_) return w(), !1;
            else return !0
        })
    }
    refinement(A, q) {
        return this._refinement((K, Y) => {
            if (!A(K)) return Y.addIssue(typeof q === "function" ? q(K, Y) : q), !1;
            else return !0
        })
    }
    _refinement(A) {
        return new vS({
            schema: this,
            typeName: SK.ZodEffects,
            effect: {
                type: "refinement",
                refinement: A
            }
        })
    }
    superRefine(A) {
        return this._refinement(A)
    }
    constructor(A) {
        this.spa = this.safeParseAsync, this._def = A, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
            version: 1,
            vendor: "zod",
            validate: (q) => this["~validate"](q)
        }
    }
    optional() {
        return fS.create(this, this._def)
    }
    nullable() {
        return bp.create(this, this._def)
    }
    nullish() {
        return this.nullable().optional()
    }
    array() {
        return GS.create(this)
    }
    promise() {
        return RA6.create(this, this._def)
    }
    or(A) {
        return CO6.create([this, A], this._def)
    }
    and(A) {
        return IO6.create(this, A, this._def)
    }
    transform(A) {
        return new vS({
            ...A3(this._def),
            schema: this,
            typeName: SK.ZodEffects,
            effect: {
                type: "transform",
                transform: A
            }
        })
    }
    default (A) {
        let q = typeof A === "function" ? A : () => A;
        return new mO6({
            ...A3(this._def),
            innerType: this,
            defaultValue: q,
            typeName: SK.ZodDefault
        })
    }
    brand() {
        return new b61({
            typeName: SK.ZodBranded,
            type: this,
            ...A3(this._def)
        })
    } catch (A) {
        let q = typeof A === "function" ? A : () => A;
        return new BO6({
            ...A3(this._def),
            innerType: this,
            catchValue: q,
            typeName: SK.ZodCatch
        })
    }
    describe(A) {
        return new this.constructor({
            ...this._def,
            description: A
        })
    }
    pipe(A) {
        return Cy6.create(this, A)
    }
    readonly() {
        return gO6.create(this)
    }
    isOptional() {
        return this.safeParse(void 0).success
    }
    isNullable() {
        return this.safeParse(null).success
    }
}
// @from(Ln 19326, Col 0)
function BKA(A) {
    let q = "[0-5]\\d";
    if (A.precision) q = `${q}\\.\\d{${A.precision}}`;
    else if (A.precision == null) q = `${q}(\\.\\d+)?`;
    let K = A.precision ? "+" : "?";
    return `([01]\\d|2[0-3]):[0-5]\\d(:${q})${K}`
}
// @from(Ln 19334, Col 0)
function O6K(A) {
    return new RegExp(`^${BKA(A)}$`)
}
// @from(Ln 19338, Col 0)
function gKA(A) {
    let q = `${mKA}T${BKA(A)}`,
        K = [];
    if (K.push(A.local ? "Z?" : "Z"), A.offset) K.push("([+-]\\d{2}:?\\d{2})");
    return q = `${q}(${K.join("|")})`, new RegExp(`^${q}$`)
}
// @from(Ln 19345, Col 0)
function $6K(A, q) {
    if ((q === "v4" || !q) && A6K.test(A)) return !0;
    if ((q === "v6" || !q) && K6K.test(A)) return !0;
    return !1
}
// @from(Ln 19351, Col 0)
function H6K(A, q) {
    if (!aeq.test(A)) return !1;
    try {
        let [K] = A.split(".");
        if (!K) return !1;
        let Y = K.replace(/-/g, "+").replace(/_/g, "/").padEnd(K.length + (4 - K.length % 4) % 4, "="),
            z = JSON.parse(atob(Y));
        if (typeof z !== "object" || z === null) return !1;
        if ("typ" in z && z?.typ !== "JWT") return !1;
        if (!z.alg) return !1;
        if (q && z.alg !== q) return !1;
        return !0
    } catch {
        return !1
    }
}
// @from(Ln 19368, Col 0)
function j6K(A, q) {
    if ((q === "v4" || !q) && q6K.test(A)) return !0;
    if ((q === "v6" || !q) && Y6K.test(A)) return !0;
    return !1
}
// @from(Ln 19374, Col 0)
function J6K(A, q) {
    let K = (A.toString().split(".")[1] || "").length,
        Y = (q.toString().split(".")[1] || "").length,
        z = K > Y ? K : Y,
        _ = Number.parseInt(A.toFixed(z).replace(".", "")),
        w = Number.parseInt(q.toFixed(z).replace(".", ""));
    return _ % w / 10 ** z
}
// @from(Ln 19383, Col 0)
function yO6(A) {
    if (A instanceof C$) {
        let q = {};
        for (let K in A.shape) {
            let Y = A.shape[K];
            q[K] = fS.create(yO6(Y))
        }
        return new C$({
            ...A._def,
            shape: () => q
        })
    } else if (A instanceof GS) return new GS({
        ...A._def,
        type: yO6(A.element)
    });
    else if (A instanceof fS) return fS.create(yO6(A.unwrap()));
    else if (A instanceof bp) return bp.create(yO6(A.unwrap()));
    else if (A instanceof Bx) return Bx.create(A.items.map((q) => yO6(q)));
    else return A
}
// @from(Ln 19404, Col 0)
function uQ1(A, q) {
    let K = ux(A),
        Y = ux(q);
    if (A === q) return {
        valid: !0,
        data: A
    };
    else if (K === f7.object && Y === f7.object) {
        let z = P9.objectKeys(q),
            _ = P9.objectKeys(A).filter((O) => z.indexOf(O) !== -1),
            w = {
                ...A,
                ...q
            };
        for (let O of _) {
            let $ = uQ1(A[O], q[O]);
            if (!$.valid) return {
                valid: !1
            };
            w[O] = $.data
        }
        return {
            valid: !0,
            data: w
        }
    } else if (K === f7.array && Y === f7.array) {
        if (A.length !== q.length) return {
            valid: !1
        };
        let z = [];
        for (let _ = 0; _ < A.length; _++) {
            let w = A[_],
                O = q[_],
                $ = uQ1(w, O);
            if (!$.valid) return {
                valid: !1
            };
            z.push($.data)
        }
        return {
            valid: !0,
            data: z
        }
    } else if (K === f7.date && Y === f7.date && +A === +q) return {
        valid: !0,
        data: A
    };
    else return {
        valid: !1
    }
}
// @from(Ln 19456, Col 0)
function FKA(A, q) {
    return new pn({
        values: A,
        typeName: SK.ZodEnum,
        ...A3(q)
    })
}
// @from(Ln 19464, Col 0)
function uKA(A, q) {
    let K = typeof A === "function" ? A(q) : typeof A === "string" ? {
        message: A
    } : A;
    return typeof K === "string" ? {
        message: K
    } : K
}
// @from(Ln 19473, Col 0)
function pKA(A, q = {}, K) {
    if (A) return yA6.create().superRefine((Y, z) => {
        let _ = A(Y);
        if (_ instanceof Promise) return _.then((w) => {
            if (!w) {
                let O = uKA(q, Y),
                    $ = O.fatal ?? K ?? !0;
                z.addIssue({
                    code: "custom",
                    ...O,
                    fatal: $
                })
            }
        });
        if (!_) {
            let w = uKA(q, Y),
                O = w.fatal ?? K ?? !0;
            z.addIssue({
                code: "custom",
                ...w,
                fatal: O
            })
        }
        return
    });
    return yA6.create()
}
// @from(Ln 19500, Col 4)
xKA = (A, q) => {
        if (mn(q)) return {
            success: !0,
            data: q.value
        };
        else {
            if (!A.common.issues.length) throw Error("Validation failed but no issues detected.");
            return {
                success: !1,
                get error() {
                    if (this._error) return this._error;
                    let K = new GT(A.common.issues);
                    return this._error = K, this._error
                }
            }
        }
    }
// @from(Ln 19517, Col 4)
leq
// @from(Ln 19517, Col 9)
ieq
// @from(Ln 19517, Col 14)
neq
// @from(Ln 19517, Col 19)
req
// @from(Ln 19517, Col 24)
oeq
// @from(Ln 19517, Col 29)
aeq
// @from(Ln 19517, Col 34)
seq
// @from(Ln 19517, Col 39)
teq
// @from(Ln 19517, Col 44)
eeq = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$"
// @from(Ln 19518, Col 4)
xQ1
// @from(Ln 19518, Col 9)
A6K
// @from(Ln 19518, Col 14)
q6K
// @from(Ln 19518, Col 19)
K6K
// @from(Ln 19518, Col 24)
Y6K
// @from(Ln 19518, Col 29)
z6K
// @from(Ln 19518, Col 34)
_6K
// @from(Ln 19518, Col 39)
mKA = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))"
// @from(Ln 19519, Col 4)
w6K
// @from(Ln 19519, Col 9)
ZS
// @from(Ln 19519, Col 13)
gn
// @from(Ln 19519, Col 17)
Fn
// @from(Ln 19519, Col 21)
RO6
// @from(Ln 19519, Col 26)
EA6
// @from(Ln 19519, Col 31)
yy6
// @from(Ln 19519, Col 36)
hO6
// @from(Ln 19519, Col 41)
SO6
// @from(Ln 19519, Col 46)
yA6
// @from(Ln 19519, Col 51)
Bn
// @from(Ln 19519, Col 55)
mx
// @from(Ln 19519, Col 59)
Ly6
// @from(Ln 19519, Col 64)
GS
// @from(Ln 19519, Col 68)
C$
// @from(Ln 19519, Col 72)
CO6
// @from(Ln 19519, Col 77)
Ip = (A) => {
        if (A instanceof bO6) return Ip(A.schema);
        else if (A instanceof vS) return Ip(A.innerType());
        else if (A instanceof xO6) return [A.value];
        else if (A instanceof pn) return A.options;
        else if (A instanceof uO6) return P9.objectValues(A.enum);
        else if (A instanceof mO6) return Ip(A._def.innerType);
        else if (A instanceof hO6) return [void 0];
        else if (A instanceof SO6) return [null];
        else if (A instanceof fS) return [void 0, ...Ip(A.unwrap())];
        else if (A instanceof bp) return [null, ...Ip(A.unwrap())];
        else if (A instanceof b61) return Ip(A.unwrap());
        else if (A instanceof gO6) return Ip(A.unwrap());
        else if (A instanceof BO6) return Ip(A._def.innerType);
        else return []
    }
// @from(Ln 19535, Col 4)
I61
// @from(Ln 19535, Col 9)
IO6
// @from(Ln 19535, Col 14)
Bx
// @from(Ln 19535, Col 18)
Ry6
// @from(Ln 19535, Col 23)
hy6
// @from(Ln 19535, Col 28)
LA6
// @from(Ln 19535, Col 33)
LO6
// @from(Ln 19535, Col 38)
bO6
// @from(Ln 19535, Col 43)
xO6
// @from(Ln 19535, Col 48)
pn
// @from(Ln 19535, Col 52)
uO6
// @from(Ln 19535, Col 57)
RA6
// @from(Ln 19535, Col 62)
vS
// @from(Ln 19535, Col 66)
fS
// @from(Ln 19535, Col 70)
bp
// @from(Ln 19535, Col 74)
mO6
// @from(Ln 19535, Col 79)
BO6
// @from(Ln 19535, Col 84)
Sy6
// @from(Ln 19535, Col 89)
M6K
// @from(Ln 19535, Col 94)
b61
// @from(Ln 19535, Col 99)
Cy6
// @from(Ln 19535, Col 104)
gO6
// @from(Ln 19535, Col 109)
D6K
// @from(Ln 19535, Col 114)
SK
// @from(Ln 19535, Col 118)
X6K = (A, q = {
        message: `Input not instance of ${A.name}`
    }) => pKA((K) => K instanceof A, q)
// @from(Ln 19538, Col 4)
CA
// @from(Ln 19538, Col 8)
Yy
// @from(Ln 19538, Col 12)
P6K
// @from(Ln 19538, Col 17)
W6K
// @from(Ln 19538, Col 22)
CD
// @from(Ln 19538, Col 26)
Z6K
// @from(Ln 19538, Col 31)
G6K
// @from(Ln 19538, Col 36)
f6K
// @from(Ln 19538, Col 41)
T6K
// @from(Ln 19538, Col 46)
v6K
// @from(Ln 19538, Col 51)
N6K
// @from(Ln 19538, Col 56)
V6K
// @from(Ln 19538, Col 61)
k6K
// @from(Ln 19538, Col 66)
VH
// @from(Ln 19538, Col 70)
PV
// @from(Ln 19538, Col 74)
WV
// @from(Ln 19538, Col 78)
hA6
// @from(Ln 19538, Col 83)
E6K
// @from(Ln 19538, Col 88)
y6K
// @from(Ln 19538, Col 93)
L6K
// @from(Ln 19538, Col 98)
NS
// @from(Ln 19538, Col 102)
R6K
// @from(Ln 19538, Col 107)
h6K
// @from(Ln 19538, Col 112)
S6K
// @from(Ln 19538, Col 117)
C6K
// @from(Ln 19538, Col 122)
I6K
// @from(Ln 19538, Col 127)
VS
// @from(Ln 19538, Col 131)
b6K
// @from(Ln 19538, Col 136)
x6K
// @from(Ln 19538, Col 141)
u6K
// @from(Ln 19538, Col 146)
m6K
// @from(Ln 19538, Col 151)
B6K
// @from(Ln 19538, Col 156)
g6K
// @from(Ln 19538, Col 161)
F6K
// @from(Ln 19538, Col 166)
p6K = () => CA().optional()
// @from(Ln 19539, Col 4)
Q6K = () => Yy().optional()
// @from(Ln 19540, Col 4)
U6K = () => CD().optional()
// @from(Ln 19541, Col 4)
d6K
// @from(Ln 19541, Col 9)
c6K