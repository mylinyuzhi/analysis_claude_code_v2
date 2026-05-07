
// @from(Ln 11175, Col 0)
class v28 {
    ws = null;
    connected = !1;
    authenticated = !1;
    connecting = !1;
    reconnectTimer = null;
    reconnectAttempts = 0;
    pendingCalls = new Map;
    notificationHandler = null;
    context;
    permissionMode = "ask";
    allowedDomains;
    tabsContextCollectionTimeoutMs = 2000;
    toolCallTimeoutMs = 120000;
    connectionStartTime = null;
    connectionEstablishedTime = null;
    selectedDeviceId;
    discoveryComplete = !1;
    discoveryPromise = null;
    pendingDiscovery = null;
    previousSelectedDeviceId;
    peerConnectedWaiters = [];
    pendingPairingRequestId;
    pairingInProgress = !1;
    persistedDeviceId;
    pendingSwitchResolve = null;
    constructor(q) {
        if (this.context = q, q.initialPermissionMode) this.permissionMode = q.initialPermissionMode
    }
    async ensureConnected() {
        let {
            logger: q,
            serverName: K
        } = this.context;
        if (q.info(`[${K}] ensureConnected called, connected=${this.connected}, authenticated=${this.authenticated}, wsState=${this.ws?.readyState}`), this.connected && this.authenticated && this.ws?.readyState === xZ.OPEN) return q.info(`[${K}] Already connected and authenticated`), !0;
        if (!this.connecting) q.info(`[${K}] Not connecting, starting connection...`), await this.connect();
        else q.info(`[${K}] Already connecting, waiting...`);
        return new Promise((_) => {
            let z = setTimeout(() => {
                    q.info(`[${K}] Connection timeout, connected=${this.connected}, authenticated=${this.authenticated}`), _(!1)
                }, 1e4),
                Y = () => {
                    if (this.connected && this.authenticated) q.info(`[${K}] Connection successful`), clearTimeout(z), _(!0);
                    else if (!this.connecting) q.info(`[${K}] No longer connecting, giving up`), clearTimeout(z), _(!1);
                    else setTimeout(Y, 200)
                };
            Y()
        })
    }
    async callTool(q, K, _) {
        let {
            logger: z,
            serverName: Y,
            trackEvent: A
        } = this.context;
        if (!this.ws || this.ws.readyState !== xZ.OPEN) throw new PV(`[${Y}] Bridge not connected`);
        if (!this.selectedDeviceId && !this.discoveryComplete) this.discoveryPromise ??= this.discoverAndSelectExtension().finally(() => {
            this.discoveryPromise = null
        }), await this.discoveryPromise;
        let O = crypto.randomUUID(),
            w = q === "tabs_context_mcp",
            $ = Date.now(),
            j = w ? this.tabsContextCollectionTimeoutMs : this.toolCallTimeoutMs;
        A?.("chrome_bridge_tool_call_started", {
            tool_name: q,
            tool_use_id: O
        });
        let H = _?.permissionMode ?? this.permissionMode,
            J = _?.allowedDomains ?? this.allowedDomains;
        return new Promise((X, M) => {
            let P = setTimeout(() => {
                let D = this.pendingCalls.get(O);
                if (D) {
                    this.pendingCalls.delete(O);
                    let Z = Date.now() - D.startTime;
                    if (w && D.results.length > 0) A?.("chrome_bridge_tool_call_completed", {
                        tool_name: q,
                        tool_use_id: O,
                        duration_ms: Z
                    }), X(this.mergeTabsResults(D.results));
                    else z.warn(`[${Y}] Tool call timeout: ${q} (${O.slice(0,8)}) after ${Z}ms, pending calls: ${this.pendingCalls.size}`), A?.("chrome_bridge_tool_call_timeout", {
                        tool_name: q,
                        tool_use_id: O,
                        duration_ms: Z,
                        timeout_ms: j
                    }), M(new PV(`[${Y}] Tool call timed out: ${q}`))
                }
            }, j);
            this.pendingCalls.set(O, {
                resolve: X,
                reject: M,
                timer: P,
                results: [],
                isTabsContext: w,
                onPermissionRequest: _?.onPermissionRequest,
                startTime: $,
                toolName: q
            });
            let W = {
                type: "tool_call",
                tool_use_id: O,
                client_type: this.context.clientTypeId,
                tool: q,
                args: K
            };
            if (this.selectedDeviceId) W.target_device_id = this.selectedDeviceId;
            if (H) W.permission_mode = H;
            if (J?.length) W.allowed_domains = J;
            if (_?.onPermissionRequest) W.handle_permission_prompts = !0;
            z.debug(`[${Y}] Sending tool_call: ${q} (${O.slice(0,8)})`), this.ws.send(JSON.stringify(W))
        })
    }
    isConnected() {
        return this.connected && this.authenticated && this.ws?.readyState === xZ.OPEN
    }
    disconnect() {
        this.cleanup()
    }
    setNotificationHandler(q) {
        this.notificationHandler = q
    }
    async setPermissionMode(q, K) {
        this.permissionMode = q, this.allowedDomains = K
    }
    async discoverAndSelectExtension() {
        let {
            logger: q,
            serverName: K
        } = this.context;
        this.persistedDeviceId ??= this.context.getPersistedDeviceId?.();
        let _ = await this.queryBridgeExtensions();
        if (_.length === 0) {
            if (q.info(`[${K}] No extensions connected, waiting up to ${pV7}ms for peer_connected`), await this.waitForPeerConnected(pV7)) _ = await this.queryBridgeExtensions()
        }
        if (this.discoveryComplete = !0, _.length === 0) {
            q.info(`[${K}] No extensions found after waiting`);
            return
        }
        if (_.length === 1) {
            let z = _[0];
            if (!this.isLocalExtension(z)) this.context.onRemoteExtensionWarning?.(z);
            this.selectExtension(z.deviceId);
            return
        }
        if (this.persistedDeviceId) {
            let z = _.find((Y) => Y.deviceId === this.persistedDeviceId);
            if (z) {
                q.info(`[${K}] Auto-connecting to persisted extension: ${z.name||z.deviceId.slice(0,8)}`), this.selectExtension(z.deviceId);
                return
            }
        }
        this.broadcastPairingRequest(), this.pairingInProgress = !0
    }
    async queryBridgeExtensions() {
        let q = await new Promise((_) => {
                let z = setTimeout(() => {
                    this.pendingDiscovery = null, _([])
                }, ZV5);
                this.pendingDiscovery = {
                    resolve: _,
                    timeout: z
                }, this.ws?.send(JSON.stringify({
                    type: "list_extensions"
                }))
            }),
            K = new Map;
        for (let _ of q) {
            let z = K.get(_.deviceId);
            if (!z || _.connectedAt > z.connectedAt) K.set(_.deviceId, _)
        }
        return [...K.values()]
    }
    selectExtension(q) {
        let {
            logger: K,
            serverName: _
        } = this.context;
        this.selectedDeviceId = q, this.previousSelectedDeviceId = void 0, K.info(`[${_}] Selected Chrome extension: ${q.slice(0,8)}...`)
    }
    isLocalExtension(q) {
        if (!q.osPlatform) return !1;
        return q.osPlatform === G28()
    }
    waitForPeerConnected(q) {
        return new Promise((K) => {
            let _ = setTimeout(() => {
                    this.peerConnectedWaiters = this.peerConnectedWaiters.filter((Y) => Y !== z), K(!1)
                }, q),
                z = (Y) => {
                    clearTimeout(_), K(Y)
                };
            this.peerConnectedWaiters.push(z)
        })
    }
    broadcastPairingRequest() {
        let q = crypto.randomUUID();
        this.pendingPairingRequestId = q, this.ws?.send(JSON.stringify({
            type: "pairing_request",
            request_id: q,
            client_type: this.context.clientTypeId
        }))
    }
    async switchBrowser() {
        let q = await this.queryBridgeExtensions(),
            K = this.selectedDeviceId ?? this.previousSelectedDeviceId;
        if (q.length === 0 || q.length === 1 && (!K || q[0].deviceId === K)) return "no_other_browsers";
        this.previousSelectedDeviceId = this.selectedDeviceId, this.selectedDeviceId = void 0, this.discoveryComplete = !1, this.pairingInProgress = !1;
        let _ = crypto.randomUUID();
        if (this.pendingPairingRequestId = _, this.ws?.readyState !== xZ.OPEN) return null;
        if (this.ws.send(JSON.stringify({
                type: "pairing_request",
                request_id: _,
                client_type: this.context.clientTypeId
            })), this.pendingSwitchResolve) this.pendingSwitchResolve(null);
        return new Promise((z) => {
            let Y = setTimeout(() => {
                if (this.pendingPairingRequestId === _) this.pendingPairingRequestId = void 0;
                this.pendingSwitchResolve = null, z(null)
            }, 120000);
            this.pendingSwitchResolve = (A) => {
                clearTimeout(Y), this.pendingSwitchResolve = null, z(A)
            }
        })
    }
    async connect() {
        let {
            logger: q,
            serverName: K,
            bridgeConfig: _,
            trackEvent: z
        } = this.context;
        if (!_) {
            q.error(`[${K}] No bridge config provided`);
            return
        }
        if (this.connecting) return;
        this.connecting = !0, this.authenticated = !1, this.connectionStartTime = Date.now(), this.closeSocket();
        let Y, A;
        if (_.devUserId) Y = _.devUserId, q.debug(`[${K}] Using dev user ID for bridge connection`);
        else {
            q.debug(`[${K}] Fetching user ID for bridge connection`);
            let w = await _.getUserId();
            if (!w) {
                let $ = Date.now() - this.connectionStartTime;
                q.error(`[${K}] No user ID available after ${$}ms`), z?.("chrome_bridge_connection_failed", {
                    duration_ms: $,
                    error_type: "no_user_id",
                    reconnect_attempt: this.reconnectAttempts
                }), this.connecting = !1, this.context.onAuthenticationError?.();
                return
            }
            if (Y = w, q.debug(`[${K}] Fetching OAuth token for bridge connection`), A = await _.getOAuthToken(), !A) {
                let $ = Date.now() - this.connectionStartTime;
                q.error(`[${K}] No OAuth token available after ${$}ms`), z?.("chrome_bridge_connection_failed", {
                    duration_ms: $,
                    error_type: "no_oauth_token",
                    reconnect_attempt: this.reconnectAttempts
                }), this.connecting = !1, this.context.onAuthenticationError?.();
                return
            }
        }
        let O = `${_.url}/chrome/${Y}`;
        q.info(`[${K}] Connecting to bridge: ${O}`), z?.("chrome_bridge_connection_started", {
            bridge_url: O
        });
        try {
            this.ws = new xZ(O)
        } catch (w) {
            let $ = Date.now() - this.connectionStartTime;
            q.error(`[${K}] Failed to create WebSocket after ${$}ms:`, w), z?.("chrome_bridge_connection_failed", {
                duration_ms: $,
                error_type: "websocket_error",
                reconnect_attempt: this.reconnectAttempts
            }), this.connecting = !1, this.scheduleReconnect();
            return
        }
        this.ws.on("open", () => {
            q.info(`[${K}] WebSocket connected, sending connect message`);
            let w = {
                type: "connect",
                client_type: this.context.clientTypeId
            };
            if (_.devUserId) w.dev_user_id = _.devUserId;
            else w.oauth_token = A;
            this.ws?.send(JSON.stringify(w))
        }), this.ws.on("message", (w) => {
            try {
                let $ = JSON.parse(w.toString());
                q.debug(`[${K}] Bridge received: ${JSON.stringify($)}`), this.handleMessage($)
            } catch ($) {
                q.error(`[${K}] Failed to parse bridge message:`, $)
            }
        }), this.ws.on("close", (w) => {
            let $ = this.connectionEstablishedTime ? Date.now() - this.connectionEstablishedTime : 0;
            q.info(`[${K}] Bridge connection closed (code: ${w}, duration: ${$}ms)`), z?.("chrome_bridge_disconnected", {
                close_code: w,
                duration_since_connect_ms: $,
                reconnect_attempt: this.reconnectAttempts + 1
            }), this.connected = !1, this.authenticated = !1, this.connecting = !1, this.connectionEstablishedTime = null, this.scheduleReconnect()
        }), this.ws.on("error", (w) => {
            let $ = this.connectionStartTime ? Date.now() - this.connectionStartTime : 0;
            q.error(`[${K}] Bridge WebSocket error after ${$}ms: ${w.message}`), z?.("chrome_bridge_connection_failed", {
                duration_ms: $,
                error_type: "websocket_error",
                reconnect_attempt: this.reconnectAttempts
            }), this.connected = !1, this.authenticated = !1, this.connecting = !1
        })
    }
    handleMessage(q) {
        let {
            logger: K,
            serverName: _,
            trackEvent: z
        } = this.context;
        switch (q.type) {
            case "paired": {
                let Y = this.connectionStartTime ? Date.now() - this.connectionStartTime : 0;
                K.info(`[${_}] Paired with Chrome extension (duration: ${Y}ms)`), this.connected = !0, this.authenticated = !0, this.connecting = !1, this.reconnectAttempts = 0, this.connectionEstablishedTime = Date.now(), z?.("chrome_bridge_connection_succeeded", {
                    duration_ms: Y,
                    status: "paired"
                });
                break
            }
            case "waiting": {
                let Y = this.connectionStartTime ? Date.now() - this.connectionStartTime : 0;
                K.info(`[${_}] Waiting for Chrome extension to connect (duration: ${Y}ms)`), this.connected = !0, this.authenticated = !0, this.connecting = !1, this.reconnectAttempts = 0, this.connectionEstablishedTime = Date.now(), z?.("chrome_bridge_connection_succeeded", {
                    duration_ms: Y,
                    status: "waiting"
                });
                break
            }
            case "peer_connected":
                if (K.info(`[${_}] Chrome extension connected to bridge`), z?.("chrome_bridge_peer_connected", null), !this.selectedDeviceId) this.discoveryComplete = !1;
                if (this.previousSelectedDeviceId && q.deviceId === this.previousSelectedDeviceId && !this.pendingSwitchResolve) K.info(`[${_}] Previously selected extension reconnected, auto-reselecting`), this.selectExtension(this.previousSelectedDeviceId), this.previousSelectedDeviceId = void 0;
                if (this.peerConnectedWaiters.length > 0) {
                    let Y = this.peerConnectedWaiters;
                    this.peerConnectedWaiters = [];
                    for (let A of Y) A(!0)
                }
                break;
            case "peer_disconnected":
                if (K.info(`[${_}] Chrome extension disconnected from bridge`), z?.("chrome_bridge_peer_disconnected", null), q.deviceId && q.deviceId === this.selectedDeviceId) K.info(`[${_}] Selected extension disconnected, clearing selection`), this.previousSelectedDeviceId = this.selectedDeviceId, this.selectedDeviceId = void 0, this.discoveryComplete = !1;
                break;
            case "extensions_list":
                if (this.pendingDiscovery) clearTimeout(this.pendingDiscovery.timeout), this.pendingDiscovery.resolve(q.extensions ?? []), this.pendingDiscovery = null;
                break;
            case "pairing_response": {
                let {
                    request_id: Y,
                    device_id: A,
                    name: O
                } = q;
                if (this.pendingPairingRequestId === Y && A && O) {
                    if (this.pendingPairingRequestId = void 0, this.pairingInProgress = !1, this.selectExtension(A), this.context.onExtensionPaired?.(A, O), K.info(`[${_}] Paired with "${O}" (${A.slice(0,8)})`), this.pendingSwitchResolve) this.pendingSwitchResolve({
                        deviceId: A,
                        name: O
                    }), this.pendingSwitchResolve = null
                }
                break
            }
            case "ping":
                this.ws?.send(JSON.stringify({
                    type: "pong"
                }));
                break;
            case "pong":
                break;
            case "tool_result":
                this.handleToolResult(q);
                break;
            case "permission_request":
                this.handlePermissionRequest(q);
                break;
            case "notification":
                if (this.notificationHandler) this.notificationHandler({
                    method: q.method,
                    params: q.params
                });
                break;
            case "error":
                if (K.warn(`[${_}] Bridge error: ${q.error}`), this.selectedDeviceId) this.selectedDeviceId = void 0, this.discoveryComplete = !1;
                break;
            default:
                K.warn(`[${_}] Unrecognized bridge message type: ${q.type}`)
        }
    }
    async handlePermissionRequest(q) {
        let {
            logger: K,
            serverName: _
        } = this.context, z = q.tool_use_id, Y = q.request_id;
        if (!z || !Y) {
            K.warn(`[${_}] permission_request missing tool_use_id or request_id`);
            return
        }
        let A = this.pendingCalls.get(z);
        if (!A?.onPermissionRequest) {
            K.debug(`[${_}] Ignoring permission_request for unknown tool_use_id ${z.slice(0,8)} (not our call)`);
            return
        }
        let O = {
            toolUseId: z,
            requestId: Y,
            toolType: q.tool_type ?? "unknown",
            url: q.url ?? "",
            actionData: q.action_data
        };
        try {
            let w = await A.onPermissionRequest(O);
            this.sendPermissionResponse(Y, w)
        } catch (w) {
            K.error(`[${_}] Error handling permission request:`, w), this.sendPermissionResponse(Y, !1)
        }
    }
    sendPermissionResponse(q, K) {
        if (this.ws?.readyState === xZ.OPEN) {
            let _ = {
                type: "permission_response",
                request_id: q,
                allowed: K
            };
            if (this.selectedDeviceId) _.target_device_id = this.selectedDeviceId;
            this.ws.send(JSON.stringify(_))
        }
    }
    handleToolResult(q) {
        let {
            logger: K,
            serverName: _,
            trackEvent: z
        } = this.context, Y = q.tool_use_id;
        if (!Y) {
            K.warn(`[${_}] Received tool_result without tool_use_id`);
            return
        }
        let A = this.pendingCalls.get(Y);
        if (!A) {
            K.debug(`[${_}] Received tool_result for unknown call: ${Y.slice(0,8)}`);
            return
        }
        let O = Date.now() - A.startTime,
            w = this.normalizeBridgeResponse(q),
            $ = Boolean(q.is_error) || "error" in w;
        if (A.isTabsContext && !this.selectedDeviceId) A.results.push(w);
        else {
            if (clearTimeout(A.timer), this.pendingCalls.delete(Y), $) {
                let j = w.error?.content,
                    H = "Unknown error";
                if (Array.isArray(j)) {
                    let J = j.find((X) => typeof X === "object" && X !== null && ("text" in X));
                    if (J?.text) H = J.text.slice(0, 200)
                }
                K.warn(`[${_}] Tool call error: ${A.toolName} (${Y.slice(0,8)}) after ${O}ms`), z?.("chrome_bridge_tool_call_error", {
                    tool_name: A.toolName,
                    tool_use_id: Y,
                    duration_ms: O,
                    error_message: H
                })
            } else K.debug(`[${_}] Tool call completed: ${A.toolName} (${Y.slice(0,8)}) in ${O}ms`), z?.("chrome_bridge_tool_call_completed", {
                tool_name: A.toolName,
                tool_use_id: Y,
                duration_ms: O
            });
            A.resolve(w)
        }
    }
    normalizeBridgeResponse(q) {
        if (q.result || q.error) return q;
        if (q.content) {
            if (q.is_error) return {
                error: {
                    content: q.content
                }
            };
            return {
                result: {
                    content: q.content
                }
            }
        }
        return q
    }
    mergeTabsResults(q) {
        let K = [];
        for (let _ of q) {
            let A = _.result?.content;
            if (!A || !Array.isArray(A)) continue;
            for (let O of A)
                if (O.type === "text" && O.text) try {
                    let w = JSON.parse(O.text);
                    if (Array.isArray(w)) K.push(...w);
                    else if (w?.availableTabs && Array.isArray(w.availableTabs)) K.push(...w.availableTabs)
                } catch {}
        }
        if (K.length > 0) {
            let _ = K.map((z) => {
                let Y = z;
                return `  • tabId ${Y.tabId}: "${Y.title}" (${Y.url})`
            }).join(`
`);
            return {
                result: {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            availableTabs: K
                        })
                    }, {
                        type: "text",
                        text: `

Tab Context:
- Available tabs:
${_}`
                    }]
                }
            }
        }
        return q[0]
    }
    scheduleReconnect() {
        let {
            logger: q,
            serverName: K,
            trackEvent: _
        } = this.context;
        if (this.reconnectTimer) return;
        if (this.reconnectAttempts++, this.reconnectAttempts > 100) {
            q.warn(`[${K}] Giving up bridge reconnection after 100 attempts`), _?.("chrome_bridge_reconnect_exhausted", {
                total_attempts: 100
            }), this.reconnectAttempts = 0;
            return
        }
        let z = Math.min(2000 * Math.pow(1.5, this.reconnectAttempts - 1), 30000);
        if (this.reconnectAttempts <= 10 || this.reconnectAttempts % 10 === 0) q.info(`[${K}] Bridge reconnecting in ${Math.round(z)}ms (attempt ${this.reconnectAttempts})`);
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null, this.connect()
        }, z)
    }
    closeSocket() {
        if (this.ws) this.ws.removeAllListeners(), this.ws.close(), this.ws = null;
        if (this.connected = !1, this.authenticated = !1, this.selectedDeviceId = void 0, this.discoveryComplete = !1, this.pendingPairingRequestId = void 0, this.pairingInProgress = !1, this.pendingSwitchResolve) this.pendingSwitchResolve(null), this.pendingSwitchResolve = null;
        if (this.pendingDiscovery) clearTimeout(this.pendingDiscovery.timeout), this.pendingDiscovery.resolve([]), this.pendingDiscovery = null;
        if (this.peerConnectedWaiters.length > 0) {
            let q = this.peerConnectedWaiters;
            this.peerConnectedWaiters = [];
            for (let K of q) K(!1)
        }
    }
    cleanup() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
        for (let [q, K] of this.pendingCalls) clearTimeout(K.timer), K.reject(new PV("Bridge client disconnected")), this.pendingCalls.delete(q);
        this.closeSocket(), this.reconnectAttempts = 0
    }
}
// @from(Ln 11731, Col 0)
function T28(q) {
    return new v28(q)
}
// @from(Ln 11734, Col 4)
ZV5 = 5000
// @from(Ln 11735, Col 4)
pV7 = 1e4
// @from(Ln 11736, Col 4)
c71 = L(() => {
    xY6();
    GF6()
})
// @from(Ln 11740, Col 4)
ri
// @from(Ln 11741, Col 4)
l71 = L(() => {
    ri = [{
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
// @from(Ln 12197, Col 4)
Nz
// @from(Ln 12197, Col 8)
n71
// @from(Ln 12197, Col 13)
rq
// @from(Ln 12197, Col 17)
tg = (q) => {
    switch (typeof q) {
        case "undefined":
            return rq.undefined;
        case "string":
            return rq.string;
        case "number":
            return Number.isNaN(q) ? rq.nan : rq.number;
        case "boolean":
            return rq.boolean;
        case "function":
            return rq.function;
        case "bigint":
            return rq.bigint;
        case "symbol":
            return rq.symbol;
        case "object":
            if (Array.isArray(q)) return rq.array;
            if (q === null) return rq.null;
            if (q.then && typeof q.then === "function" && q.catch && typeof q.catch === "function") return rq.promise;
            if (typeof Map < "u" && q instanceof Map) return rq.map;
            if (typeof Set < "u" && q instanceof Set) return rq.set;
            if (typeof Date < "u" && q instanceof Date) return rq.date;
            return rq.object;
        default:
            return rq.unknown
    }
}
// @from(Ln 12225, Col 4)
vF6 = L(() => {
    (function(q) {
        q.assertEqual = (Y) => {};

        function K(Y) {}
        q.assertIs = K;

        function _(Y) {
            throw Error()
        }
        q.assertNever = _, q.arrayToEnum = (Y) => {
            let A = {};
            for (let O of Y) A[O] = O;
            return A
        }, q.getValidEnumValues = (Y) => {
            let A = q.objectKeys(Y).filter((w) => typeof Y[Y[w]] !== "number"),
                O = {};
            for (let w of A) O[w] = Y[w];
            return q.objectValues(O)
        }, q.objectValues = (Y) => {
            return q.objectKeys(Y).map(function(A) {
                return Y[A]
            })
        }, q.objectKeys = typeof Object.keys === "function" ? (Y) => Object.keys(Y) : (Y) => {
            let A = [];
            for (let O in Y)
                if (Object.prototype.hasOwnProperty.call(Y, O)) A.push(O);
            return A
        }, q.find = (Y, A) => {
            for (let O of Y)
                if (A(O)) return O;
            return
        }, q.isInteger = typeof Number.isInteger === "function" ? (Y) => Number.isInteger(Y) : (Y) => typeof Y === "number" && Number.isFinite(Y) && Math.floor(Y) === Y;

        function z(Y, A = " | ") {
            return Y.map((O) => typeof O === "string" ? `'${O}'` : O).join(A)
        }
        q.joinValues = z, q.jsonStringifyReplacer = (Y, A) => {
            if (typeof A === "bigint") return A.toString();
            return A
        }
    })(Nz || (Nz = {}));
    (function(q) {
        q.mergeShapes = (K, _) => {
            return {
                ...K,
                ..._
            }
        }
    })(n71 || (n71 = {}));
    rq = Nz.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"])
})
// @from(Ln 12277, Col 4)
Xq
// @from(Ln 12277, Col 8)
fV5 = (q) => {
        return JSON.stringify(q, null, 2).replace(/"([^"]+)":/g, "$1:")
    }
// @from(Ln 12280, Col 4)
BN
// @from(Ln 12281, Col 4)
V28 = L(() => {
    vF6();
    Xq = Nz.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]);
    BN = class BN extends Error {
        get errors() {
            return this.issues
        }
        constructor(q) {
            super();
            this.issues = [], this.addIssue = (_) => {
                this.issues = [...this.issues, _]
            }, this.addIssues = (_ = []) => {
                this.issues = [...this.issues, ..._]
            };
            let K = new.target.prototype;
            if (Object.setPrototypeOf) Object.setPrototypeOf(this, K);
            else this.__proto__ = K;
            this.name = "ZodError", this.issues = q
        }
        format(q) {
            let K = q || function(Y) {
                    return Y.message
                },
                _ = {
                    _errors: []
                },
                z = (Y) => {
                    for (let A of Y.issues)
                        if (A.code === "invalid_union") A.unionErrors.map(z);
                        else if (A.code === "invalid_return_type") z(A.returnTypeError);
                    else if (A.code === "invalid_arguments") z(A.argumentsError);
                    else if (A.path.length === 0) _._errors.push(K(A));
                    else {
                        let O = _,
                            w = 0;
                        while (w < A.path.length) {
                            let $ = A.path[w];
                            if (w !== A.path.length - 1) O[$] = O[$] || {
                                _errors: []
                            };
                            else O[$] = O[$] || {
                                _errors: []
                            }, O[$]._errors.push(K(A));
                            O = O[$], w++
                        }
                    }
                };
            return z(this), _
        }
        static assert(q) {
            if (!(q instanceof BN)) throw Error(`Not a ZodError: ${q}`)
        }
        toString() {
            return this.message
        }
        get message() {
            return JSON.stringify(this.issues, Nz.jsonStringifyReplacer, 2)
        }
        get isEmpty() {
            return this.issues.length === 0
        }
        flatten(q = (K) => K.message) {
            let K = {},
                _ = [];
            for (let z of this.issues)
                if (z.path.length > 0) {
                    let Y = z.path[0];
                    K[Y] = K[Y] || [], K[Y].push(q(z))
                } else _.push(q(z));
            return {
                formErrors: _,
                fieldErrors: K
            }
        }
        get formErrors() {
            return this.flatten()
        }
    };
    BN.create = (q) => {
        return new BN(q)
    }
})
// @from(Ln 12363, Col 4)
GV5 = (q, K) => {
        let _;
        switch (q.code) {
            case Xq.invalid_type:
                if (q.received === rq.undefined) _ = "Required";
                else _ = `Expected ${q.expected}, received ${q.received}`;
                break;
            case Xq.invalid_literal:
                _ = `Invalid literal value, expected ${JSON.stringify(q.expected,Nz.jsonStringifyReplacer)}`;
                break;
            case Xq.unrecognized_keys:
                _ = `Unrecognized key(s) in object: ${Nz.joinValues(q.keys,", ")}`;
                break;
            case Xq.invalid_union:
                _ = "Invalid input";
                break;
            case Xq.invalid_union_discriminator:
                _ = `Invalid discriminator value. Expected ${Nz.joinValues(q.options)}`;
                break;
            case Xq.invalid_enum_value:
                _ = `Invalid enum value. Expected ${Nz.joinValues(q.options)}, received '${q.received}'`;
                break;
            case Xq.invalid_arguments:
                _ = "Invalid function arguments";
                break;
            case Xq.invalid_return_type:
                _ = "Invalid function return type";
                break;
            case Xq.invalid_date:
                _ = "Invalid date";
                break;
            case Xq.invalid_string:
                if (typeof q.validation === "object")
                    if ("includes" in q.validation) {
                        if (_ = `Invalid input: must include "${q.validation.includes}"`, typeof q.validation.position === "number") _ = `${_} at one or more positions greater than or equal to ${q.validation.position}`
                    } else if ("startsWith" in q.validation) _ = `Invalid input: must start with "${q.validation.startsWith}"`;
                else if ("endsWith" in q.validation) _ = `Invalid input: must end with "${q.validation.endsWith}"`;
                else Nz.assertNever(q.validation);
                else if (q.validation !== "regex") _ = `Invalid ${q.validation}`;
                else _ = "Invalid";
                break;
            case Xq.too_small:
                if (q.type === "array") _ = `Array must contain ${q.exact?"exactly":q.inclusive?"at least":"more than"} ${q.minimum} element(s)`;
                else if (q.type === "string") _ = `String must contain ${q.exact?"exactly":q.inclusive?"at least":"over"} ${q.minimum} character(s)`;
                else if (q.type === "number") _ = `Number must be ${q.exact?"exactly equal to ":q.inclusive?"greater than or equal to ":"greater than "}${q.minimum}`;
                else if (q.type === "bigint") _ = `Number must be ${q.exact?"exactly equal to ":q.inclusive?"greater than or equal to ":"greater than "}${q.minimum}`;
                else if (q.type === "date") _ = `Date must be ${q.exact?"exactly equal to ":q.inclusive?"greater than or equal to ":"greater than "}${new Date(Number(q.minimum))}`;
                else _ = "Invalid input";
                break;
            case Xq.too_big:
                if (q.type === "array") _ = `Array must contain ${q.exact?"exactly":q.inclusive?"at most":"less than"} ${q.maximum} element(s)`;
                else if (q.type === "string") _ = `String must contain ${q.exact?"exactly":q.inclusive?"at most":"under"} ${q.maximum} character(s)`;
                else if (q.type === "number") _ = `Number must be ${q.exact?"exactly":q.inclusive?"less than or equal to":"less than"} ${q.maximum}`;
                else if (q.type === "bigint") _ = `BigInt must be ${q.exact?"exactly":q.inclusive?"less than or equal to":"less than"} ${q.maximum}`;
                else if (q.type === "date") _ = `Date must be ${q.exact?"exactly":q.inclusive?"smaller than or equal to":"smaller than"} ${new Date(Number(q.maximum))}`;
                else _ = "Invalid input";
                break;
            case Xq.custom:
                _ = "Invalid input";
                break;
            case Xq.invalid_intersection_types:
                _ = "Intersection results could not be merged";
                break;
            case Xq.not_multiple_of:
                _ = `Number must be a multiple of ${q.multipleOf}`;
                break;
            case Xq.not_finite:
                _ = "Number must be finite";
                break;
            default:
                _ = K.defaultError, Nz.assertNever(q)
        }
        return {
            message: _
        }
    }
// @from(Ln 12439, Col 4)
oi
// @from(Ln 12440, Col 4)
i71 = L(() => {
    V28();
    vF6();
    oi = GV5
})
// @from(Ln 12446, Col 0)
function vV5(q) {
    FV7 = q
}
// @from(Ln 12450, Col 0)
function OZ6() {
    return FV7
}
// @from(Ln 12453, Col 4)
FV7
// @from(Ln 12454, Col 4)
k28 = L(() => {
    i71();
    FV7 = oi
})
// @from(Ln 12459, Col 0)
function R4(q, K) {
    let _ = OZ6(),
        z = TF6({
            issueData: K,
            data: q.data,
            path: q.path,
            errorMaps: [q.common.contextualErrorMap, q.schemaErrorMap, _, _ === oi ? void 0 : oi].filter((Y) => !!Y)
        });
    q.common.issues.push(z)
}
// @from(Ln 12469, Col 0)
class uZ {
    constructor() {
        this.value = "valid"
    }
    dirty() {
        if (this.value === "valid") this.value = "dirty"
    }
    abort() {
        if (this.value !== "aborted") this.value = "aborted"
    }
    static mergeArray(q, K) {
        let _ = [];
        for (let z of K) {
            if (z.status === "aborted") return _3;
            if (z.status === "dirty") q.dirty();
            _.push(z.value)
        }
        return {
            status: q.value,
            value: _
        }
    }
    static async mergeObjectAsync(q, K) {
        let _ = [];
        for (let z of K) {
            let Y = await z.key,
                A = await z.value;
            _.push({
                key: Y,
                value: A
            })
        }
        return uZ.mergeObjectSync(q, _)
    }
    static mergeObjectSync(q, K) {
        let _ = {};
        for (let z of K) {
            let {
                key: Y,
                value: A
            } = z;
            if (Y.status === "aborted") return _3;
            if (A.status === "aborted") return _3;
            if (Y.status === "dirty") q.dirty();
            if (A.status === "dirty") q.dirty();
            if (Y.value !== "__proto__" && (typeof A.value < "u" || z.alwaysSet)) _[Y.value] = A.value
        }
        return {
            status: q.value,
            value: _
        }
    }
}
// @from(Ln 12522, Col 4)
TF6 = (q) => {
        let {
            data: K,
            path: _,
            errorMaps: z,
            issueData: Y
        } = q, A = [..._, ...Y.path || []], O = {
            ...Y,
            path: A
        };
        if (Y.message !== void 0) return {
            ...Y,
            path: A,
            message: Y.message
        };
        let w = "",
            $ = z.filter((j) => !!j).slice().reverse();
        for (let j of $) w = j(O, {
            data: K,
            defaultError: w
        }).message;
        return {
            ...Y,
            path: A,
            message: w
        }
    }
// @from(Ln 12549, Col 4)
TV5
// @from(Ln 12549, Col 9)
_3
// @from(Ln 12549, Col 13)
uY6 = (q) => ({
        status: "dirty",
        value: q
    })
// @from(Ln 12553, Col 4)
qv = (q) => ({
        status: "valid",
        value: q
    })
// @from(Ln 12557, Col 4)
N28 = (q) => q.status === "aborted"
// @from(Ln 12558, Col 4)
E28 = (q) => q.status === "dirty"
// @from(Ln 12559, Col 4)
i86 = (q) => q.status === "valid"
// @from(Ln 12560, Col 4)
wZ6 = (q) => typeof Promise < "u" && q instanceof Promise
// @from(Ln 12561, Col 4)
r71 = L(() => {
    k28();
    i71();
    TV5 = [];
    _3 = Object.freeze({
        status: "aborted"
    })
})
// @from(Ln 12569, Col 4)
gV7 = () => {}
// @from(Ln 12570, Col 4)
BK
// @from(Ln 12571, Col 4)
UV7 = L(() => {
    (function(q) {
        q.errToObj = (K) => typeof K === "string" ? {
            message: K
        } : K || {}, q.toString = (K) => typeof K === "string" ? K : K?.message
    })(BK || (BK = {}))
})
// @from(Ln 12578, Col 0)
class Hm {
    constructor(q, K, _, z) {
        this._cachedPath = [], this.parent = q, this.data = K, this._path = _, this._key = z
    }
    get path() {
        if (!this._cachedPath.length)
            if (Array.isArray(this._key)) this._cachedPath.push(...this._path, ...this._key);
            else this._cachedPath.push(...this._path, this._key);
        return this._cachedPath
    }
}
// @from(Ln 12590, Col 0)
function Y_(q) {
    if (!q) return {};
    let {
        errorMap: K,
        invalid_type_error: _,
        required_error: z,
        description: Y
    } = q;
    if (K && (_ || z)) throw Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    if (K) return {
        errorMap: K,
        description: Y
    };
    return {
        errorMap: (O, w) => {
            let {
                message: $
            } = q;
            if (O.code === "invalid_enum_value") return {
                message: $ ?? w.defaultError
            };
            if (typeof w.data > "u") return {
                message: $ ?? z ?? w.defaultError
            };
            if (O.code !== "invalid_type") return {
                message: w.defaultError
            };
            return {
                message: $ ?? _ ?? w.defaultError
            }
        },
        description: Y
    }
}
// @from(Ln 12624, Col 0)
class o_ {
    get description() {
        return this._def.description
    }
    _getType(q) {
        return tg(q.data)
    }
    _getOrReturnCtx(q, K) {
        return K || {
            common: q.parent.common,
            data: q.data,
            parsedType: tg(q.data),
            schemaErrorMap: this._def.errorMap,
            path: q.path,
            parent: q.parent
        }
    }
    _processInputParams(q) {
        return {
            status: new uZ,
            ctx: {
                common: q.parent.common,
                data: q.data,
                parsedType: tg(q.data),
                schemaErrorMap: this._def.errorMap,
                path: q.path,
                parent: q.parent
            }
        }
    }
    _parseSync(q) {
        let K = this._parse(q);
        if (wZ6(K)) throw Error("Synchronous parse encountered promise.");
        return K
    }
    _parseAsync(q) {
        let K = this._parse(q);
        return Promise.resolve(K)
    }
    parse(q, K) {
        let _ = this.safeParse(q, K);
        if (_.success) return _.data;
        throw _.error
    }
    safeParse(q, K) {
        let _ = {
                common: {
                    issues: [],
                    async: K?.async ?? !1,
                    contextualErrorMap: K?.errorMap
                },
                path: K?.path || [],
                schemaErrorMap: this._def.errorMap,
                parent: null,
                data: q,
                parsedType: tg(q)
            },
            z = this._parseSync({
                data: q,
                path: _.path,
                parent: _
            });
        return QV7(_, z)
    }
    "~validate"(q) {
        let K = {
            common: {
                issues: [],
                async: !!this["~standard"].async
            },
            path: [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data: q,
            parsedType: tg(q)
        };
        if (!this["~standard"].async) try {
            let _ = this._parseSync({
                data: q,
                path: [],
                parent: K
            });
            return i86(_) ? {
                value: _.value
            } : {
                issues: K.common.issues
            }
        } catch (_) {
            if (_?.message?.toLowerCase()?.includes("encountered")) this["~standard"].async = !0;
            K.common = {
                issues: [],
                async: !0
            }
        }
        return this._parseAsync({
            data: q,
            path: [],
            parent: K
        }).then((_) => i86(_) ? {
            value: _.value
        } : {
            issues: K.common.issues
        })
    }
    async parseAsync(q, K) {
        let _ = await this.safeParseAsync(q, K);
        if (_.success) return _.data;
        throw _.error
    }
    async safeParseAsync(q, K) {
        let _ = {
                common: {
                    issues: [],
                    contextualErrorMap: K?.errorMap,
                    async: !0
                },
                path: K?.path || [],
                schemaErrorMap: this._def.errorMap,
                parent: null,
                data: q,
                parsedType: tg(q)
            },
            z = this._parse({
                data: q,
                path: _.path,
                parent: _
            }),
            Y = await (wZ6(z) ? z : Promise.resolve(z));
        return QV7(_, Y)
    }
    refine(q, K) {
        let _ = (z) => {
            if (typeof K === "string" || typeof K > "u") return {
                message: K
            };
            else if (typeof K === "function") return K(z);
            else return K
        };
        return this._refinement((z, Y) => {
            let A = q(z),
                O = () => Y.addIssue({
                    code: Xq.custom,
                    ..._(z)
                });
            if (typeof Promise < "u" && A instanceof Promise) return A.then((w) => {
                if (!w) return O(), !1;
                else return !0
            });
            if (!A) return O(), !1;
            else return !0
        })
    }
    refinement(q, K) {
        return this._refinement((_, z) => {
            if (!q(_)) return z.addIssue(typeof K === "function" ? K(_, z) : K), !1;
            else return !0
        })
    }
    _refinement(q) {
        return new Jm({
            schema: this,
            typeName: R3.ZodEffects,
            effect: {
                type: "refinement",
                refinement: q
            }
        })
    }
    superRefine(q) {
        return this._refinement(q)
    }
    constructor(q) {
        this.spa = this.safeParseAsync, this._def = q, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
            version: 1,
            vendor: "zod",
            validate: (K) => this["~validate"](K)
        }
    }
    optional() {
        return jm.create(this, this._def)
    }
    nullable() {
        return si.create(this, this._def)
    }
    nullish() {
        return this.nullable().optional()
    }
    array() {
        return $m.create(this)
    }
    promise() {
        return FY6.create(this, this._def)
    }
    or(q) {
        return MZ6.create([this, q], this._def)
    }
    and(q) {
        return PZ6.create(this, q, this._def)
    }
    transform(q) {
        return new Jm({
            ...Y_(this._def),
            schema: this,
            typeName: R3.ZodEffects,
            effect: {
                type: "transform",
                transform: q
            }
        })
    }
    default (q) {
        let K = typeof q === "function" ? q : () => q;
        return new fZ6({
            ...Y_(this._def),
            innerType: this,
            defaultValue: K,
            typeName: R3.ZodDefault
        })
    }
    brand() {
        return new L28({
            typeName: R3.ZodBranded,
            type: this,
            ...Y_(this._def)
        })
    } catch (q) {
        let K = typeof q === "function" ? q : () => q;
        return new GZ6({
            ...Y_(this._def),
            innerType: this,
            catchValue: K,
            typeName: R3.ZodCatch
        })
    }
    describe(q) {
        return new this.constructor({
            ...this._def,
            description: q
        })
    }
    pipe(q) {
        return LF6.create(this, q)
    }
    readonly() {
        return vZ6.create(this)
    }
    isOptional() {
        return this.safeParse(void 0).success
    }
    isNullable() {
        return this.safeParse(null).success
    }
}
// @from(Ln 12878, Col 0)
function lV7(q) {
    let K = "[0-5]\\d";
    if (q.precision) K = `${K}\\.\\d{${q.precision}}`;
    else if (q.precision == null) K = `${K}(\\.\\d+)?`;
    let _ = q.precision ? "+" : "?";
    return `([01]\\d|2[0-3]):[0-5]\\d(:${K})${_}`
}
// @from(Ln 12886, Col 0)
function pV5(q) {
    return new RegExp(`^${lV7(q)}$`)
}
// @from(Ln 12890, Col 0)
function nV7(q) {
    let K = `${cV7}T${lV7(q)}`,
        _ = [];
    if (_.push(q.local ? "Z?" : "Z"), q.offset) _.push("([+-]\\d{2}:?\\d{2})");
    return K = `${K}(${_.join("|")})`, new RegExp(`^${K}$`)
}
// @from(Ln 12897, Col 0)
function FV5(q, K) {
    if ((K === "v4" || !K) && CV5.test(q)) return !0;
    if ((K === "v6" || !K) && IV5.test(q)) return !0;
    return !1
}
// @from(Ln 12903, Col 0)
function gV5(q, K) {
    if (!LV5.test(q)) return !1;
    try {
        let [_] = q.split(".");
        if (!_) return !1;
        let z = _.replace(/-/g, "+").replace(/_/g, "/").padEnd(_.length + (4 - _.length % 4) % 4, "="),
            Y = JSON.parse(atob(z));
        if (typeof Y !== "object" || Y === null) return !1;
        if ("typ" in Y && Y?.typ !== "JWT") return !1;
        if (!Y.alg) return !1;
        if (K && Y.alg !== K) return !1;
        return !0
    } catch {
        return !1
    }
}
// @from(Ln 12920, Col 0)
function UV5(q, K) {
    if ((K === "v4" || !K) && bV5.test(q)) return !0;
    if ((K === "v6" || !K) && xV5.test(q)) return !0;
    return !1
}
// @from(Ln 12926, Col 0)
function QV5(q, K) {
    let _ = (q.toString().split(".")[1] || "").length,
        z = (K.toString().split(".")[1] || "").length,
        Y = _ > z ? _ : z,
        A = Number.parseInt(q.toFixed(Y).replace(".", "")),
        O = Number.parseInt(K.toFixed(Y).replace(".", ""));
    return A % O / 10 ** Y
}
// @from(Ln 12935, Col 0)
function $Z6(q) {
    if (q instanceof oH) {
        let K = {};
        for (let _ in q.shape) {
            let z = q.shape[_];
            K[_] = jm.create($Z6(z))
        }
        return new oH({
            ...q._def,
            shape: () => K
        })
    } else if (q instanceof $m) return new $m({
        ...q._def,
        type: $Z6(q.element)
    });
    else if (q instanceof jm) return jm.create($Z6(q.unwrap()));
    else if (q instanceof si) return si.create($Z6(q.unwrap()));
    else if (q instanceof qU) return qU.create(q.items.map((K) => $Z6(K)));
    else return q
}
// @from(Ln 12956, Col 0)
function a71(q, K) {
    let _ = tg(q),
        z = tg(K);
    if (q === K) return {
        valid: !0,
        data: q
    };
    else if (_ === rq.object && z === rq.object) {
        let Y = Nz.objectKeys(K),
            A = Nz.objectKeys(q).filter((w) => Y.indexOf(w) !== -1),
            O = {
                ...q,
                ...K
            };
        for (let w of A) {
            let $ = a71(q[w], K[w]);
            if (!$.valid) return {
                valid: !1
            };
            O[w] = $.data
        }
        return {
            valid: !0,
            data: O
        }
    } else if (_ === rq.array && z === rq.array) {
        if (q.length !== K.length) return {
            valid: !1
        };
        let Y = [];
        for (let A = 0; A < q.length; A++) {
            let O = q[A],
                w = K[A],
                $ = a71(O, w);
            if (!$.valid) return {
                valid: !1
            };
            Y.push($.data)
        }
        return {
            valid: !0,
            data: Y
        }
    } else if (_ === rq.date && z === rq.date && +q === +K) return {
        valid: !0,
        data: q
    };
    else return {
        valid: !1
    }
}
// @from(Ln 13008, Col 0)
function iV7(q, K) {
    return new s86({
        values: q,
        typeName: R3.ZodEnum,
        ...Y_(K)
    })
}
// @from(Ln 13016, Col 0)
function dV7(q, K) {
    let _ = typeof q === "function" ? q(K) : typeof q === "string" ? {
        message: q
    } : q;
    return typeof _ === "string" ? {
        message: _
    } : _
}
// @from(Ln 13025, Col 0)
function rV7(q, K = {}, _) {
    if (q) return BY6.create().superRefine((z, Y) => {
        let A = q(z);
        if (A instanceof Promise) return A.then((O) => {
            if (!O) {
                let w = dV7(K, z),
                    $ = w.fatal ?? _ ?? !0;
                Y.addIssue({
                    code: "custom",
                    ...w,
                    fatal: $
                })
            }
        });
        if (!A) {
            let O = dV7(K, z),
                w = O.fatal ?? _ ?? !0;
            Y.addIssue({
                code: "custom",
                ...O,
                fatal: w
            })
        }
        return
    });
    return BY6.create()
}
// @from(Ln 13052, Col 4)
QV7 = (q, K) => {
        if (i86(K)) return {
            success: !0,
            data: K.value
        };
        else {
            if (!q.common.issues.length) throw Error("Validation failed but no issues detected.");
            return {
                success: !1,
                get error() {
                    if (this._error) return this._error;
                    let _ = new BN(q.common.issues);
                    return this._error = _, this._error
                }
            }
        }
    }
// @from(Ln 13069, Col 4)
VV5
// @from(Ln 13069, Col 9)
kV5
// @from(Ln 13069, Col 14)
NV5
// @from(Ln 13069, Col 19)
EV5
// @from(Ln 13069, Col 24)
yV5
// @from(Ln 13069, Col 29)
LV5
// @from(Ln 13069, Col 34)
hV5
// @from(Ln 13069, Col 39)
RV5
// @from(Ln 13069, Col 44)
SV5 = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$"
// @from(Ln 13070, Col 4)
o71
// @from(Ln 13070, Col 9)
CV5
// @from(Ln 13070, Col 14)
bV5
// @from(Ln 13070, Col 19)
IV5
// @from(Ln 13070, Col 24)
xV5
// @from(Ln 13070, Col 29)
uV5
// @from(Ln 13070, Col 34)
mV5
// @from(Ln 13070, Col 39)
cV7 = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))"
// @from(Ln 13071, Col 4)
BV5
// @from(Ln 13071, Col 9)
wm
// @from(Ln 13071, Col 13)
o86
// @from(Ln 13071, Col 18)
a86
// @from(Ln 13071, Col 23)
HZ6
// @from(Ln 13071, Col 28)
mY6
// @from(Ln 13071, Col 33)
VF6
// @from(Ln 13071, Col 38)
JZ6
// @from(Ln 13071, Col 43)
XZ6
// @from(Ln 13071, Col 48)
BY6
// @from(Ln 13071, Col 53)
r86
// @from(Ln 13071, Col 58)
eg
// @from(Ln 13071, Col 62)
kF6
// @from(Ln 13071, Col 67)
$m
// @from(Ln 13071, Col 71)
oH
// @from(Ln 13071, Col 75)
MZ6
// @from(Ln 13071, Col 80)
ai = (q) => {
        if (q instanceof WZ6) return ai(q.schema);
        else if (q instanceof Jm) return ai(q.innerType());
        else if (q instanceof DZ6) return [q.value];
        else if (q instanceof s86) return q.options;
        else if (q instanceof ZZ6) return Nz.objectValues(q.enum);
        else if (q instanceof fZ6) return ai(q._def.innerType);
        else if (q instanceof JZ6) return [void 0];
        else if (q instanceof XZ6) return [null];
        else if (q instanceof jm) return [void 0, ...ai(q.unwrap())];
        else if (q instanceof si) return [null, ...ai(q.unwrap())];
        else if (q instanceof L28) return ai(q.unwrap());
        else if (q instanceof vZ6) return ai(q.unwrap());
        else if (q instanceof GZ6) return ai(q._def.innerType);
        else return []
    }
// @from(Ln 13087, Col 4)
y28
// @from(Ln 13087, Col 9)
PZ6
// @from(Ln 13087, Col 14)
qU
// @from(Ln 13087, Col 18)
NF6
// @from(Ln 13087, Col 23)
EF6
// @from(Ln 13087, Col 28)
pY6
// @from(Ln 13087, Col 33)
jZ6
// @from(Ln 13087, Col 38)
WZ6
// @from(Ln 13087, Col 43)
DZ6
// @from(Ln 13087, Col 48)
s86
// @from(Ln 13087, Col 53)
ZZ6
// @from(Ln 13087, Col 58)
FY6
// @from(Ln 13087, Col 63)
Jm
// @from(Ln 13087, Col 67)
jm
// @from(Ln 13087, Col 71)
si
// @from(Ln 13087, Col 75)
fZ6
// @from(Ln 13087, Col 80)
GZ6
// @from(Ln 13087, Col 85)
yF6
// @from(Ln 13087, Col 90)
dV5
// @from(Ln 13087, Col 95)
L28
// @from(Ln 13087, Col 100)
LF6
// @from(Ln 13087, Col 105)
vZ6
// @from(Ln 13087, Col 110)
cV5
// @from(Ln 13087, Col 115)
R3
// @from(Ln 13087, Col 119)
lV5 = (q, K = {
        message: `Input not instance of ${q.name}`
    }) => rV7((_) => _ instanceof q, K)
// @from(Ln 13090, Col 4)
Aq
// @from(Ln 13090, Col 8)
IC
// @from(Ln 13090, Col 12)
nV5
// @from(Ln 13090, Col 17)
iV5
// @from(Ln 13090, Col 22)
U0
// @from(Ln 13090, Col 26)
rV5
// @from(Ln 13090, Col 31)
oV5
// @from(Ln 13090, Col 36)
aV5
// @from(Ln 13090, Col 41)
sV5
// @from(Ln 13090, Col 46)
tV5
// @from(Ln 13090, Col 51)
eV5
// @from(Ln 13090, Col 56)
qk5
// @from(Ln 13090, Col 61)
Kk5
// @from(Ln 13090, Col 66)
sJ
// @from(Ln 13090, Col 70)
Yh
// @from(Ln 13090, Col 74)
Ah
// @from(Ln 13090, Col 78)
gY6
// @from(Ln 13090, Col 83)
_k5
// @from(Ln 13090, Col 88)
zk5
// @from(Ln 13090, Col 93)
Yk5
// @from(Ln 13090, Col 98)
Xm
// @from(Ln 13090, Col 102)
Ak5
// @from(Ln 13090, Col 107)
Ok5
// @from(Ln 13090, Col 112)
wk5
// @from(Ln 13090, Col 117)
$k5
// @from(Ln 13090, Col 122)
jk5
// @from(Ln 13090, Col 127)
Mm
// @from(Ln 13090, Col 131)
Hk5
// @from(Ln 13090, Col 136)
Jk5
// @from(Ln 13090, Col 141)
Xk5
// @from(Ln 13090, Col 146)
Mk5
// @from(Ln 13090, Col 151)
Pk5
// @from(Ln 13090, Col 156)
Wk5
// @from(Ln 13090, Col 161)
Dk5
// @from(Ln 13090, Col 166)
Zk5 = () => Aq().optional()
// @from(Ln 13091, Col 4)
fk5 = () => IC().optional()
// @from(Ln 13092, Col 4)
Gk5 = () => U0().optional()
// @from(Ln 13093, Col 4)
vk5
// @from(Ln 13093, Col 9)
Tk5