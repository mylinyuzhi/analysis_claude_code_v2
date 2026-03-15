
// @from(Ln 478114, Col 0)
class z26 {
    url;
    state = "idle";
    onData;
    onCloseCallback;
    onEventCallback;
    headers;
    sessionId;
    refreshHeaders;
    abortController = null;
    lastSequenceNum = 0;
    seenSequenceNums = new Set;
    reconnectAttempts = 0;
    reconnectStartTime = null;
    reconnectTimer = null;
    livenessTimer = null;
    postUrl;
    constructor(A, q = {}, K, Y, z) {
        this.url = A;
        if (this.headers = q, this.sessionId = K, this.refreshHeaders = Y, this.postUrl = cDz(A), z !== void 0 && z > 0) this.lastSequenceNum = z;
        k(`SSETransport: SSE URL = ${A.href}`), k(`SSETransport: POST URL = ${this.postUrl}`), U1("info", "cli_sse_transport_initialized")
    }
    getLastSequenceNum() {
        return this.lastSequenceNum
    }
    async connect() {
        if (this.state !== "idle" && this.state !== "reconnecting") {
            k(`SSETransport: Cannot connect, current state is ${this.state}`, {
                level: "error"
            }), U1("error", "cli_sse_connect_failed");
            return
        }
        this.state = "reconnecting";
        let A = Date.now(),
            q = new URL(this.url.href);
        if (this.lastSequenceNum > 0) q.searchParams.set("from_sequence_num", String(this.lastSequenceNum));
        let K = QX6(),
            Y = {
                ...this.headers,
                ...K,
                Accept: "text/event-stream",
                "anthropic-version": "2023-06-01"
            };
        if (K.Cookie) delete Y.Authorization;
        if (this.lastSequenceNum > 0) Y["Last-Event-ID"] = String(this.lastSequenceNum);
        k(`SSETransport: Opening ${q.href}`), U1("info", "cli_sse_connect_opening"), this.abortController = new AbortController;
        try {
            let z = await fetch(q.href, {
                headers: Y,
                signal: this.abortController.signal
            });
            if (!z.ok) {
                let w = pDz.has(z.status);
                if (k(`SSETransport: HTTP ${z.status}${w?" (permanent)":""}`, {
                        level: "error"
                    }), U1("error", "cli_sse_connect_http_error", {
                        status: z.status
                    }), w) {
                    this.state = "closed", this.onCloseCallback?.();
                    return
                }
                this.handleConnectionError();
                return
            }
            if (!z.body) {
                k("SSETransport: No response body"), this.handleConnectionError();
                return
            }
            let _ = Date.now() - A;
            k("SSETransport: Connected"), U1("info", "cli_sse_connect_connected", {
                duration_ms: _
            }), this.state = "connected", this.reconnectAttempts = 0, this.reconnectStartTime = null, this.resetLivenessTimer(), JE1(() => {
                k("SSETransport: Session activity signal (no-op for SSE reads)")
            }), await this.readStream(z.body)
        } catch (z) {
            if (this.abortController?.signal.aborted) return;
            k(`SSETransport: Connection error: ${_1(z)}`, {
                level: "error"
            }), U1("error", "cli_sse_connect_error"), this.handleConnectionError()
        }
    }
    async readStream(A) {
        let q = A.getReader(),
            K = new TextDecoder,
            Y = "";
        try {
            while (!0) {
                let {
                    done: z,
                    value: _
                } = await q.read();
                if (z) break;
                Y += K.decode(_, {
                    stream: !0
                });
                let {
                    frames: w,
                    remaining: O
                } = dDz(Y);
                Y = O;
                for (let $ of w) {
                    if (this.resetLivenessTimer(), $.id) {
                        let H = parseInt($.id, 10);
                        if (!isNaN(H)) {
                            if (this.seenSequenceNums.has(H)) k(`SSETransport: DUPLICATE frame seq=${H} (lastSequenceNum=${this.lastSequenceNum}, seenCount=${this.seenSequenceNums.size})`, {
                                level: "warn"
                            }), U1("warn", "cli_sse_duplicate_sequence");
                            else if (this.seenSequenceNums.add(H), this.seenSequenceNums.size > 1000) {
                                let j = this.lastSequenceNum - 200;
                                for (let J of this.seenSequenceNums)
                                    if (J < j) this.seenSequenceNums.delete(J)
                            }
                            if (H > this.lastSequenceNum) this.lastSequenceNum = H
                        }
                    }
                    if ($.event && $.data) this.handleSSEFrame($.event, $.data);
                    else if ($.data) k("SSETransport: Frame has data: but no event: field — dropped", {
                        level: "warn"
                    }), U1("warn", "cli_sse_frame_missing_event_field")
                }
            }
        } catch (z) {
            if (this.abortController?.signal.aborted) return;
            k(`SSETransport: Stream read error: ${_1(z)}`, {
                level: "error"
            }), U1("error", "cli_sse_stream_read_error")
        } finally {
            q.releaseLock()
        }
        if (this.state !== "closing" && this.state !== "closed") k("SSETransport: Stream ended, reconnecting"), this.handleConnectionError()
    }
    handleSSEFrame(A, q) {
        if (A !== "client_event") {
            k(`SSETransport: Unexpected SSE event type '${A}' on worker stream`, {
                level: "warn"
            }), U1("warn", "cli_sse_unexpected_event_type", {
                event_type: A
            });
            return
        }
        let K;
        try {
            K = i1(q)
        } catch (z) {
            k(`SSETransport: Failed to parse client_event data: ${_1(z)}`, {
                level: "error"
            });
            return
        }
        let Y = K.payload;
        if (Y && typeof Y === "object" && "type" in Y) {
            let z = this.sessionId ? ` session=${this.sessionId}` : "";
            k(`SSETransport: Event seq=${K.sequence_num} event_id=${K.event_id} event_type=${K.event_type} payload_type=${String(Y.type)}${z}`), U1("info", "cli_sse_message_received"), this.onData?.(B6(Y) + `
`)
        } else k(`SSETransport: Ignoring client_event with no type in payload: event_id=${K.event_id}`);
        this.onEventCallback?.(K)
    }
    handleConnectionError() {
        if (this.clearLivenessTimer(), gT6(), this.state === "closing" || this.state === "closed") return;
        this.abortController?.abort(), this.abortController = null;
        let A = Date.now();
        if (!this.reconnectStartTime) this.reconnectStartTime = A;
        let q = A - this.reconnectStartTime;
        if (q < gDz) {
            if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
            if (this.refreshHeaders) {
                let z = this.refreshHeaders();
                Object.assign(this.headers, z), k("SSETransport: Refreshed headers for reconnect")
            }
            this.state = "reconnecting", this.reconnectAttempts++;
            let K = Math.min(mDz * Math.pow(2, this.reconnectAttempts - 1), BDz),
                Y = Math.max(0, K + K * 0.25 * (2 * Math.random() - 1));
            k(`SSETransport: Reconnecting in ${Math.round(Y)}ms (attempt ${this.reconnectAttempts}, ${Math.round(q/1000)}s elapsed)`), U1("error", "cli_sse_reconnect_attempt", {
                reconnectAttempts: this.reconnectAttempts
            }), this.reconnectTimer = setTimeout(() => {
                this.reconnectTimer = null, this.connect()
            }, Y)
        } else k(`SSETransport: Reconnection time budget exhausted after ${Math.round(q/1000)}s`, {
            level: "error"
        }), U1("error", "cli_sse_reconnect_exhausted", {
            reconnectAttempts: this.reconnectAttempts,
            elapsedMs: q
        }), this.state = "closed", this.onCloseCallback?.()
    }
    resetLivenessTimer() {
        this.clearLivenessTimer(), this.livenessTimer = setTimeout(() => {
            this.livenessTimer = null, k("SSETransport: Liveness timeout, reconnecting", {
                level: "error"
            }), U1("error", "cli_sse_liveness_timeout"), this.abortController?.abort(), this.handleConnectionError()
        }, FDz)
    }
    clearLivenessTimer() {
        if (this.livenessTimer) clearTimeout(this.livenessTimer), this.livenessTimer = null
    }
    async write(A) {
        let q = QX6();
        if (Object.keys(q).length === 0) {
            k("SSETransport: No session token available for POST"), U1("warn", "cli_sse_post_no_token");
            return
        }
        let K = {
            ...q,
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01"
        };
        k(`SSETransport: POST body keys=${Object.keys(A).join(",")}`);
        for (let Y = 1; Y <= Aa6; Y++) {
            try {
                let _ = await X8.post(this.postUrl, A, {
                    headers: K,
                    validateStatus: () => !0
                });
                if (_.status === 200 || _.status === 201) {
                    k(`SSETransport: POST success type=${A.type}`);
                    return
                }
                if (k(`SSETransport: POST ${_.status} body=${JSON.stringify(_.data).slice(0,200)}`), _.status >= 400 && _.status < 500 && _.status !== 429) {
                    k(`SSETransport: POST returned ${_.status} (client error), not retrying`), U1("warn", "cli_sse_post_client_error", {
                        status: _.status
                    });
                    return
                }
                k(`SSETransport: POST returned ${_.status}, attempt ${Y}/${Aa6}`), U1("warn", "cli_sse_post_retryable_error", {
                    status: _.status,
                    attempt: Y
                })
            } catch (_) {
                k(`SSETransport: POST error: ${_.message}, attempt ${Y}/${Aa6}`), U1("warn", "cli_sse_post_network_error", {
                    attempt: Y
                })
            }
            if (Y === Aa6) {
                k(`SSETransport: POST failed after ${Aa6} attempts, continuing`), U1("warn", "cli_sse_post_retries_exhausted");
                return
            }
            let z = Math.min(QDz * Math.pow(2, Y - 1), UDz);
            await new Promise((_) => setTimeout(_, z))
        }
    }
    isConnectedStatus() {
        return this.state === "connected"
    }
    isClosedStatus() {
        return this.state === "closed"
    }
    setOnData(A) {
        this.onData = A
    }
    setOnClose(A) {
        this.onCloseCallback = A
    }
    setOnEvent(A) {
        this.onEventCallback = A
    }
    close() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
        this.clearLivenessTimer(), gT6(), this.state = "closing", this.abortController?.abort(), this.abortController = null
    }
}
// @from(Ln 478374, Col 0)
function cDz(A) {
    let q = A.pathname;
    if (q.endsWith("/stream")) q = q.slice(0, -7);
    return `${A.protocol}//${A.host}${q}`
}
// @from(Ln 478379, Col 4)
mDz = 1000
// @from(Ln 478380, Col 4)
BDz = 30000
// @from(Ln 478381, Col 4)
gDz = 600000
// @from(Ln 478382, Col 4)
FDz = 45000
// @from(Ln 478383, Col 4)
pDz
// @from(Ln 478383, Col 9)
Aa6 = 10
// @from(Ln 478384, Col 4)
QDz = 500
// @from(Ln 478385, Col 4)
UDz = 8000
// @from(Ln 478386, Col 4)
eC1 = E(() => {
    kK();
    H1();
    u_();
    gL();
    g1();
    FT6();
    s8();
    pDz = new Set([401, 403, 404])
})
// @from(Ln 478400, Col 0)
function URq(A, q = {}, K, Y) {
    if (t6(process.env.CLAUDE_CODE_USE_CCR_V2)) {
        let z = new lDz(A.href);
        if (z.protocol === "wss:") z.protocol = "https:";
        else if (z.protocol === "ws:") z.protocol = "http:";
        return z.pathname = z.pathname.replace(/\/$/, "") + "/worker/events/stream", new z26(z, q, K, Y)
    }
    if (A.protocol === "ws:" || A.protocol === "wss:") {
        if (t6(process.env.CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2)) return new eo6(A, q, K, Y);
        return new to6(A, q, K, Y)
    } else throw Error(`Unsupported protocol: ${A.protocol}`)
}
// @from(Ln 478412, Col 4)
dRq = E(() => {
    ra8();
    aa8();
    eC1();
    A8()
})
// @from(Ln 478418, Col 0)
class sa8 {
    inflight = null;
    pending = null;
    closed = !1;
    config;
    constructor(A) {
        this.config = A
    }
    enqueue(A) {
        if (this.closed) return;
        this.pending = this.pending ? cRq(this.pending, A) : A, this.drain()
    }
    close() {
        this.closed = !0, this.pending = null
    }
    async drain() {
        if (this.inflight || this.closed) return;
        if (!this.pending) return;
        let A = this.pending;
        this.pending = null, this.inflight = this.sendWithRetry(A).then(() => {
            if (this.inflight = null, this.pending && !this.closed) this.drain()
        })
    }
    async sendWithRetry(A) {
        let q = A,
            K = 0;
        while (!this.closed) {
            if (await this.config.send(q)) return;
            if (K++, await this.sleep(this.retryDelay(K)), this.pending && !this.closed) q = cRq(q, this.pending), this.pending = null
        }
    }
    retryDelay(A) {
        let q = Math.min(this.config.baseDelayMs * 2 ** (A - 1), this.config.maxDelayMs),
            K = Math.random() * this.config.jitterMs;
        return q + K
    }
    sleep(A) {
        return new Promise((q) => setTimeout(q, A))
    }
}
// @from(Ln 478459, Col 0)
function cRq(A, q) {
    let K = {
        ...A
    };
    for (let [Y, z] of Object.entries(q))
        if ((Y === "external_metadata" || Y === "internal_metadata") && K[Y] && typeof K[Y] === "object" && typeof z === "object" && z !== null) K[Y] = {
            ...K[Y],
            ...z
        };
        else K[Y] = z;
    return K
}
// @from(Ln 478474, Col 0)
class qa6 {
    workerEpoch = 0;
    heartbeatTimer = null;
    heartbeatInFlight = !1;
    currentState = null;
    sessionBaseUrl;
    sessionId;
    http = ytA({
        keepAlive: !0
    });
    workerState;
    eventUploader;
    internalEventUploader;
    deliveryUploader;
    onEpochMismatch;
    constructor(A, q, K) {
        if (this.onEpochMismatch = K?.onEpochMismatch ?? (() => {
                process.exit(1)
            }), q.protocol !== "http:" && q.protocol !== "https:") throw Error(`CCRClient: Expected http(s) URL, got ${q.protocol}`);
        let Y = q.pathname.replace(/\/$/, "");
        this.sessionBaseUrl = `${q.protocol}//${q.host}${Y}`, this.sessionId = Y.split("/").pop() || "", this.workerState = new sa8({
            send: (z) => this.request("put", "/worker", {
                worker_epoch: this.workerEpoch,
                ...z
            }, "PUT worker").then((_) => _.ok),
            baseDelayMs: 500,
            maxDelayMs: 30000,
            jitterMs: 500
        }), this.eventUploader = new Y26({
            maxBatchSize: 100,
            maxQueueSize: 50,
            send: async (z) => {
                let _ = await this.request("post", "/worker/events", {
                    worker_epoch: this.workerEpoch,
                    events: z
                }, "client events");
                if (!_.ok) throw new MV6("client event POST failed", _.retryAfterMs)
            },
            baseDelayMs: 500,
            maxDelayMs: 30000,
            jitterMs: 500
        }), this.internalEventUploader = new Y26({
            maxBatchSize: 100,
            maxQueueSize: 200,
            send: async (z) => {
                let _ = await this.request("post", "/worker/internal-events", {
                    worker_epoch: this.workerEpoch,
                    events: z
                }, "internal events");
                if (!_.ok) throw new MV6("internal event POST failed", _.retryAfterMs)
            },
            baseDelayMs: 500,
            maxDelayMs: 30000,
            jitterMs: 500
        }), this.deliveryUploader = new Y26({
            maxBatchSize: 1,
            maxQueueSize: 50,
            send: async ([z]) => {
                let _ = await this.request("post", `/worker/events/${z.eventId}/delivery`, {
                    status: z.status,
                    worker_epoch: this.workerEpoch
                }, `Delivery ${z.eventId}`);
                if (!_.ok) throw new MV6("delivery POST failed", _.retryAfterMs)
            },
            baseDelayMs: 500,
            maxDelayMs: 30000,
            jitterMs: 500
        }), A.setOnEvent((z) => {
            this.reportDelivery(z.event_id, "received")
        })
    }
    async initialize(A) {
        if (A === void 0) {
            let K = process.env.CLAUDE_CODE_WORKER_EPOCH;
            A = K ? parseInt(K, 10) : NaN
        }
        if (isNaN(A)) throw Error("CCRClient: no worker epoch provided and CLAUDE_CODE_WORKER_EPOCH is missing or invalid");
        if (this.workerEpoch = A, !(await this.request("put", "/worker", {
                worker_status: "idle",
                worker_epoch: this.workerEpoch
            }, "PUT worker (init)")).ok) throw Error("CCRClient: initial PUT /worker failed");
        this.currentState = "idle", this.startHeartbeat(), k(`CCRClient: initialized, epoch=${this.workerEpoch}`), U1("info", "cli_worker_lifecycle_initialized")
    }
    async request(A, q, K, Y, {
        timeout: z = 1e4
    } = {}) {
        let _ = QX6();
        if (Object.keys(_).length === 0) return {
            ok: !1
        };
        try {
            let w = await this.http[A](`${this.sessionBaseUrl}${q}`, K, {
                headers: {
                    ..._,
                    "Content-Type": "application/json",
                    "anthropic-version": "2023-06-01"
                },
                validateStatus: () => !0,
                timeout: z
            });
            if (w.status >= 200 && w.status < 300) return {
                ok: !0
            };
            if (w.status === 409) this.handleEpochMismatch();
            if (k(`CCRClient: ${Y} returned ${w.status}`, {
                    level: "warn"
                }), U1("warn", "cli_worker_request_failed", {
                    method: A,
                    path: q,
                    status: w.status
                }), w.status === 429) {
                let O = w.headers?.["retry-after"],
                    $ = typeof O === "string" ? parseInt(O, 10) : NaN;
                if (!isNaN($) && $ >= 0) return {
                    ok: !1,
                    retryAfterMs: $ * 1000
                }
            }
            return {
                ok: !1
            }
        } catch (w) {
            return k(`CCRClient: ${Y} failed: ${_1(w)}`, {
                level: "warn"
            }), U1("warn", "cli_worker_request_error", {
                method: A,
                path: q
            }), {
                ok: !1
            }
        }
    }
    reportState(A) {
        if (A === this.currentState) return;
        this.currentState = A, this.workerState.enqueue({
            worker_status: A
        })
    }
    reportMetadata(A) {
        this.workerState.enqueue({
            external_metadata: A
        })
    }
    handleEpochMismatch() {
        k("CCRClient: Epoch mismatch (409), shutting down", {
            level: "error"
        }), U1("error", "cli_worker_epoch_mismatch"), this.onEpochMismatch()
    }
    startHeartbeat() {
        this.stopHeartbeat(), this.heartbeatTimer = setInterval(() => {
            this.sendHeartbeat()
        }, iDz)
    }
    stopHeartbeat() {
        if (this.heartbeatTimer) clearInterval(this.heartbeatTimer), this.heartbeatTimer = null
    }
    async sendHeartbeat() {
        if (this.heartbeatInFlight) return;
        this.heartbeatInFlight = !0;
        try {
            if ((await this.request("post", "/worker/heartbeat", {
                    session_id: this.sessionId,
                    worker_epoch: this.workerEpoch
                }, "Heartbeat", {
                    timeout: 5000
                })).ok) k("CCRClient: Heartbeat sent")
        } finally {
            this.heartbeatInFlight = !1
        }
    }
    async writeEvent(A) {
        let q = A,
            K = {
                payload: {
                    uuid: q.uuid ?? lRq(),
                    ...q
                }
            };
        await this.eventUploader.enqueue(K)
    }
    async writeInternalEvent(A, q, {
        isCompaction: K = !1,
        agentId: Y
    } = {}) {
        let z = {
            payload: {
                uuid: q.uuid ?? lRq(),
                type: A,
                ...q
            },
            ...K && {
                is_compaction: !0
            },
            ...Y && {
                agent_id: Y
            }
        };
        await this.internalEventUploader.enqueue(z)
    }
    flushInternalEvents() {
        return this.internalEventUploader.flush()
    }
    async readInternalEvents() {
        return this.paginatedGet("/worker/internal-events", {})
    }
    async readSubagentInternalEvents() {
        return this.paginatedGet("/worker/internal-events", {
            subagents: "true"
        })
    }
    async paginatedGet(A, q) {
        let K = QX6();
        if (Object.keys(K).length === 0) return null;
        let Y = [],
            z;
        do {
            let _ = new URL(`${this.sessionBaseUrl}${A}`);
            for (let [O, $] of Object.entries(q)) _.searchParams.set(O, $);
            if (z) _.searchParams.set("cursor", z);
            let w = await this.getWithRetry(_.toString(), K);
            if (!w) return null;
            Y.push(...w.data ?? []), z = w.next_cursor
        } while (z);
        return k(`CCRClient: Read ${Y.length} internal events from ${A}${q.subagents?" (subagents)":""}`), Y
    }
    async getWithRetry(A, q) {
        for (let K = 1; K <= 10; K++) {
            let Y;
            try {
                Y = await this.http.get(A, {
                    headers: {
                        ...q,
                        "anthropic-version": "2023-06-01"
                    },
                    validateStatus: () => !0,
                    timeout: 30000
                })
            } catch (z) {
                if (k(`CCRClient: GET ${A} failed (attempt ${K}/10): ${_1(z)}`, {
                        level: "warn"
                    }), K < 10) {
                    let _ = Math.min(500 * 2 ** (K - 1), 30000) + Math.random() * 500;
                    await new Promise((w) => setTimeout(w, _))
                }
                continue
            }
            if (Y.status >= 200 && Y.status < 300) return Y.data;
            if (Y.status === 409) this.handleEpochMismatch();
            if (k(`CCRClient: GET ${A} returned ${Y.status} (attempt ${K}/10)`, {
                    level: "warn"
                }), K < 10) {
                let z = Math.min(500 * 2 ** (K - 1), 30000) + Math.random() * 500;
                await new Promise((_) => setTimeout(_, z))
            }
        }
        return k("CCRClient: GET retries exhausted", {
            level: "error"
        }), U1("error", "cli_worker_get_retries_exhausted"), null
    }
    reportDelivery(A, q) {
        this.deliveryUploader.enqueue({
            eventId: A,
            status: q
        })
    }
    getWorkerEpoch() {
        return this.workerEpoch
    }
    close() {
        this.stopHeartbeat(), this.workerState.close(), this.eventUploader.close(), this.internalEventUploader.close(), this.deliveryUploader.close()
    }
}
// @from(Ln 478746, Col 4)
iDz = 20000
// @from(Ln 478747, Col 4)
ta8 = E(() => {
    H1();
    u_();
    gL();
    dV();
    s8();
    oa8()
})
// @from(Ln 478761, Col 4)
AI1
// @from(Ln 478762, Col 4)
iRq = E(() => {
    tC1();
    dRq();
    KY();
    gL();
    T1();
    ia8();
    H1();
    k1();
    c_();
    A8();
    Oq();
    ta8();
    eC1();
    s8();
    YC1();
    AI1 = class AI1 extends so6 {
        url;
        transport;
        inputStream;
        isBridge = !1;
        isDebug = !1;
        ccrClient = null;
        keepAliveTimer = null;
        constructor(A, q, K) {
            let Y = new rDz({
                encoding: "utf8"
            });
            super(Y, K);
            this.inputStream = Y, this.url = new nDz(A);
            let z = {},
                _ = UW();
            if (_) z.Authorization = `Bearer ${_}`;
            else k("[remote-io] No session ingress token available", {
                level: "error"
            });
            let w = process.env.CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION;
            if (w) z["x-environment-runner-version"] = w;
            let O = () => {
                let H = {},
                    j = UW();
                if (j) H.Authorization = `Bearer ${j}`;
                let J = process.env.CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION;
                if (J) H["x-environment-runner-version"] = J;
                return H
            };
            if (this.transport = URq(this.url, z, R1(), O), this.isBridge = process.env.CLAUDE_CODE_ENVIRONMENT_KIND === "bridge", this.isDebug = PT(), this.transport.setOnData((H) => {
                    if (this.inputStream.write(H), this.isBridge && this.isDebug) Z4(H.endsWith(`
`) ? H : H + `
`)
                }), this.transport.setOnClose(() => {
                    this.inputStream.end()
                }), t6(process.env.CLAUDE_CODE_USE_CCR_V2)) {
                if (!(this.transport instanceof z26)) throw Error("CCR v2 requires SSETransport; check getTransportForUrl");
                this.ccrClient = new qa6(this.transport, this.url), this.ccrClient.initialize().catch((j) => {
                    _6(Error(`CCRClient initialization failed: ${_1(j)}`)), Vq(1, "other")
                }), E4(async () => this.ccrClient?.close()), _r8((j, J, M) => this.ccrClient.writeInternalEvent(j, J, M)), wr8(() => this.ccrClient.readInternalEvents(), () => this.ccrClient.readSubagentInternalEvents());
                let H = {
                    started: "processing",
                    completed: "processed"
                };
                YKq((j, J) => {
                    this.ccrClient?.reportDelivery(j, H[J])
                }), Ikq((j) => {
                    this.ccrClient?.reportState(j)
                }), bkq((j) => {
                    this.ccrClient?.reportMetadata(j)
                })
            }
            this.transport.connect();
            let $ = IF().session_keepalive_interval_ms;
            if ($ > 0) this.keepAliveTimer = setInterval(() => {
                this.write({
                    type: "keep_alive"
                }).catch((H) => {
                    k(`[remote-io] keep_alive write failed: ${_1(H)}`)
                })
            }, $), this.keepAliveTimer.unref?.();
            if (E4(async () => this.close()), q) {
                let H = this.inputStream;
                (async () => {
                    for await (let j of q) H.write(String(j).replace(/\n$/, "") + `
`)
                })()
            }
        }
        flushInternalEvents() {
            return this.ccrClient?.flushInternalEvents() ?? Promise.resolve()
        }
        async write(A) {
            if (this.ccrClient) await this.ccrClient.writeEvent(A);
            else await this.transport.write(A);
            if (this.isBridge) {
                if (A.type === "control_request" || this.isDebug) Z4(aC1(A) + `
`)
            }
        }
        close() {
            if (this.keepAliveTimer) clearInterval(this.keepAliveTimer), this.keepAliveTimer = null;
            this.transport.close(), this.inputStream.end()
        }
    }
})
// @from(Ln 478865, Col 4)
$u$
// @from(Ln 478866, Col 4)
nRq = E(() => {
    uP();
    cq6();
    J_();
    Q$();
    ZD6();
    $u$ = [...ZU, "Tmux", OC]
})
// @from(Ln 478875, Col 0)
function rRq(A) {
    let q = A.toLowerCase();
    return /\b(wtf|wth|ffs|omfg|shit(ty|tiest)?|dumbass|horrible|awful|piss(ed|ing)? off|piece of (shit|crap|junk)|what the (fuck|hell)|fucking? (broken|useless|terrible|awful|horrible)|fuck you|screw (this|you)|so frustrating|this sucks|damn it)\b/.test(q)
}
// @from(Ln 478880, Col 0)
function oRq(A) {
    let q = A.toLowerCase().trim();
    if (q === "continue") return !0;
    return /\b(keep going|go on)\b/.test(q)
}
// @from(Ln 478889, Col 0)
function aRq(A, q, K, Y, z, _, w) {
    let O = oDz();
    tk6(O);
    let $ = typeof A === "string" ? A : A.find((J) => J.type === "text")?.text || "";
    rz4($);
    let H = {};
    if (typeof A === "string") {
        let J = rRq(A),
            M = oRq(A);
        H = {
            is_negative: J,
            is_keep_going: M
        }, pw("user_prompt", {
            prompt_length: String(A.length),
            prompt: N01(A),
            "prompt.id": O
        })
    }
    if (d("tengu_input_prompt", H), q.length > 0) {
        let J = typeof A === "string" ? A.trim() ? [{
            type: "text",
            text: A
        }] : [] : A;
        return {
            messages: [p1({
                content: [...J, ...q],
                uuid: z,
                imagePasteIds: K.length > 0 ? K : void 0,
                permissionMode: _,
                isMeta: w || void 0
            }), ...Y],
            shouldQuery: !0
        }
    }
    return {
        messages: [p1({
            content: A,
            uuid: z,
            permissionMode: _,
            isMeta: w || void 0
        }), ...Y],
        shouldQuery: !0
    }
}
// @from(Ln 478933, Col 4)
sRq = E(() => {
    T1();
    V1();
    FB();
    Ae();
    JA()
})
// @from(Ln 478941, Col 0)
function ea8(A) {
    let q = A6(8),
        {
            input: K,
            progress: Y,
            verbose: z
        } = A,
        _ = `<bash-input>${K}</bash-input>`,
        w;
    if (q[0] !== _) w = qI1.default.createElement(Qv1, {
        addMargin: !1,
        param: {
            text: _,
            type: "text"
        }
    }), q[0] = _, q[1] = w;
    else w = q[1];
    let O;
    if (q[2] !== Y || q[3] !== z) O = Y ? qI1.default.createElement(ZN1, {
        fullOutput: Y.fullOutput,
        output: Y.output,
        elapsedTimeSeconds: Y.elapsedTimeSeconds,
        totalLines: Y.totalLines,
        verbose: z
    }) : J4.renderToolUseProgressMessage([], {
        verbose: z,
        tools: [],
        terminalSize: void 0
    }), q[2] = Y, q[3] = z, q[4] = O;
    else O = q[4];
    let $;
    if (q[5] !== w || q[6] !== O) $ = qI1.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, w, O), q[5] = w, q[6] = O, q[7] = $;
    else $ = q[7];
    return $
}
// @from(Ln 478979, Col 4)
qI1
// @from(Ln 478980, Col 4)
tRq = E(() => {
    e6();
    i6();
    zx8();
    cx8();
    OZ();
    qI1 = t(P6(), 1)
})
// @from(Ln 478988, Col 4)
eRq = {}
// @from(Ln 478995, Col 0)
async function sDz(A, q, K, Y, z) {
    d("tengu_input_bash", {});
    let _ = p1({
            content: HE({
                inputString: `<bash-input>${A}</bash-input>`,
                precedingInputBlocks: q
            })
        }),
        w;
    z({
        jsx: mF.createElement(ea8, {
            input: A,
            progress: null,
            verbose: Y.options.verbose
        }),
        shouldHidePromptInput: !1
    });
    try {
        let O = {
                ...Y,
                setToolJSX: (X) => {
                    w = X?.jsx
                }
            },
            H = (await J4.call({
                command: A,
                dangerouslyDisableSandbox: !0
            }, O, void 0, void 0, (X) => {
                z({
                    jsx: mF.createElement(mF.Fragment, null, mF.createElement(ea8, {
                        input: A,
                        progress: X.data,
                        verbose: Y.options.verbose
                    }), w),
                    shouldHidePromptInput: !1,
                    showSpinner: !1
                })
            })).data;
        if (!H) throw Error("No result received from bash command");
        let j = H.stderr,
            J = Y.getAppState();
        if (JP1(J.toolPermissionContext)) j = jP1(j);
        let M = await JW6(J4, {
                ...H,
                stderr: ""
            }, aDz()),
            D = typeof M.content === "string" ? M.content : H.stdout;
        return {
            messages: [Ah(), _, ...K, p1({
                content: `<bash-stdout>${D}</bash-stdout><bash-stderr>${j}</bash-stderr>`
            })],
            shouldQuery: !1
        }
    } catch (O) {
        if (O instanceof uS) {
            if (O.interrupted) return {
                messages: [Ah(), _, Ug({
                    toolUse: !1
                }), ...K],
                shouldQuery: !1
            };
            return {
                messages: [Ah(), _, ...K, p1({
                    content: `<bash-stdout>${O.stdout}</bash-stdout><bash-stderr>${O.stderr}</bash-stderr>`
                })],
                shouldQuery: !1
            }
        }
        return {
            messages: [Ah(), _, ...K, p1({
                content: `<bash-stderr>Command failed: ${_1(O)}</bash-stderr>`
            })],
            shouldQuery: !1
        }
    } finally {
        z(null)
    }
}
// @from(Ln 479073, Col 4)
mF
// @from(Ln 479074, Col 4)
Ahq = E(() => {
    V1();
    JA();
    JA();
    tRq();
    OZ();
    qp6();
    qp6();
    s8();
    ZR();
    mF = t(P6(), 1)
})
// @from(Ln 479089, Col 0)
async function KI1({
    input: A,
    mode: q,
    setToolJSX: K,
    context: Y,
    pastedContents: z,
    ideSelection: _,
    messages: w,
    setUserInputOnProcessing: O,
    uuid: $,
    isAlreadyProcessing: H,
    querySource: j,
    canUseTool: J,
    skipSlashCommands: M,
    isMeta: D,
    skipAttachments: X
}) {
    let P = typeof A === "string" ? A : null;
    if (q === "prompt" && P !== null && !D) O?.(P);
    K5("query_process_user_input_base_start");
    let W = Y.getAppState(),
        Z = await eDz(A, q, K, Y, z, _, w, $, H, j, J, W.toolPermissionContext.mode, M, D, X);
    if (K5("query_process_user_input_base_end"), !Z.shouldQuery) return Z;
    K5("query_hooks_start");
    let G = $l(A) || "";
    for await (let f of yr8(G, W.toolPermissionContext.mode, Y, Y.requestPrompt)) {
        if (f.message?.type === "progress") continue;
        if (f.blockingError) {
            let v = Er8(f.blockingError);
            return {
                messages: [P$(`${v}

Original prompt: ${A}`, "warning")],
                shouldQuery: !1,
                allowedTools: Z.allowedTools
            }
        }
        if (f.preventContinuation) {
            let v = f.stopReason ? `Operation stopped by hook: ${f.stopReason}` : "Operation stopped by hook";
            return Z.messages.push(p1({
                content: v
            })), Z.shouldQuery = !1, Z
        }
        if (f.additionalContexts && f.additionalContexts.length > 0) Z.messages.push(f4({
            type: "hook_additional_context",
            content: f.additionalContexts.map(qhq),
            hookName: "UserPromptSubmit",
            toolUseID: `hook-${tDz()}`,
            hookEvent: "UserPromptSubmit"
        }));
        if (f.message) switch (f.message.attachment.type) {
            case "hook_success":
                if (!f.message.attachment.content) break;
                Z.messages.push({
                    ...f.message,
                    attachment: {
                        ...f.message.attachment,
                        content: qhq(f.message.attachment.content)
                    }
                });
                break;
            default:
                Z.messages.push(f.message);
                break
        }
    }
    return K5("query_hooks_end"), Z
}
// @from(Ln 479158, Col 0)
function qhq(A) {
    if (A.length > As8) return `${A.substring(0,As8)}… [output truncated - exceeded ${As8} characters]`;
    return A
}
// @from(Ln 479162, Col 0)
async function eDz(A, q, K, Y, z, _, w, O, $, H, j, J, M, D, X) {
    let P = null,
        W = [],
        Z = [],
        G = A;
    if (typeof A === "string") P = A;
    else if (A.length > 0) {
        K5("query_image_processing_start");
        let R = [];
        for (let I of A)
            if (I.type === "image") {
                let g = await Qd(I);
                if (g.dimensions) {
                    let B = wW6(g.dimensions);
                    if (B) Z.push(B)
                }
                R.push(g.block)
            } else R.push(I);
        G = R, K5("query_image_processing_end");
        let u = R[R.length - 1];
        if (u?.type === "text") P = u.text, W = R.slice(0, -1);
        else W = R
    }
    if (P === null && q !== "prompt") throw Error(`Mode: ${q} requires a string input.`);
    let f = z ? Object.values(z).filter((R) => R.type === "image") : [],
        v = f.map((R) => R.id);
    K5("query_pasted_image_processing_start");
    let N = await Promise.all(f.map(async (R) => {
            let u = {
                type: "image",
                source: {
                    type: "base64",
                    media_type: R.mediaType || "image/png",
                    data: R.content
                }
            };
            return d("tengu_pasted_image_resize_attempt", {
                original_size_bytes: R.content.length
            }), {
                resized: await Qd(u),
                originalDimensions: R.dimensions,
                sourcePath: R.sourcePath
            }
        })),
        V = [];
    for (let {
            resized: R,
            originalDimensions: u,
            sourcePath: I
        }
        of N) {
        if (R.dimensions) {
            let g = wW6(R.dimensions, I);
            if (g) Z.push(g)
        } else if (u) {
            let g = wW6(u, I);
            if (g) Z.push(g)
        } else if (I) Z.push(`[Image source: ${I}]`);
        V.push(R.block)
    }
    if (K5("query_pasted_image_processing_end"), z) await tf4(z);
    let L = !X && P !== null && (q !== "prompt" || M || !P.startsWith("/"));
    K5("query_attachment_loading_start");
    let h = L ? await T01(Vf6(P, Y, _ ?? null, [], w, H)) : [];
    if (K5("query_attachment_loading_end"), P !== null && q === "bash") {
        let {
            processBashCommand: R
        } = await Promise.resolve().then(() => (Ahq(), eRq));
        return qs8(await R(P, W, h, Y, K), Z)
    }
    if (P !== null && !M && P.startsWith("/")) {
        let {
            processSlashCommand: R
        } = await Promise.resolve().then(() => (MN1(), JN1)), u = await R(P, W, V, h, Y, K, O, $, j);
        return qs8(u, Z)
    }
    if (P !== null && q === "prompt") {
        let R = P.trim(),
            u = h.find((I) => I.attachment.type === "agent_mention");
        if (u) {
            let I = `@agent-${u.attachment.agentType}`,
                g = R === I,
                B = R.startsWith(I) && !g;
            d("tengu_subagent_at_mention", {
                is_subagent_only: g,
                is_prefix: B
            })
        }
    }
    return qs8(aRq(G, V, v, h, O, J, D), Z)
}
// @from(Ln 479254, Col 0)
function qs8(A, q) {
    if (q.length > 0) A.messages.push(p1({
        content: q.map((K) => ({
            type: "text",
            text: K
        })),
        isMeta: !0
    }));
    return A
}
// @from(Ln 479264, Col 4)
As8 = 1e4
// @from(Ln 479265, Col 4)
Ks8 = E(() => {
    JA();
    o36();
    M0();
    JA();
    hw();
    sRq();
    jR();
    V1();
    qv6();
    Sc()
})
// @from(Ln 479277, Col 4)
_hq = {}
// @from(Ln 479288, Col 0)
function Yhq(A) {
    return A.type === "text"
}
// @from(Ln 479292, Col 0)
function zs8({
    messages: A,
    onPreRestore: q,
    onRestoreMessage: K,
    onRestoreCode: Y,
    onSummarize: z,
    onClose: _
}) {
    let w = M1((z6) => z6.fileHistory),
        [O, $] = XH.useState(void 0),
        H = iz(),
        j = XH.useMemo(AXz, []),
        J = XH.useMemo(() => [...A.filter(XV6), {
            ...p1({
                content: ""
            }),
            uuid: j
        }], [A, j]),
        [M, D] = XH.useState(J.length - 1),
        X = Math.max(0, Math.min(M - Math.floor(Ys8 / 2), J.length - Ys8)),
        P = J.length > 1,
        [W, Z] = XH.useState(void 0),
        [G, f] = XH.useState(void 0),
        [v, N] = XH.useState(!1),
        [V, L] = XH.useState(null),
        [h, R] = XH.useState("both"),
        [u, I] = XH.useState("");

    function g(z6) {
        let N6 = z6 ? [{
            value: "both",
            label: "Restore code and conversation"
        }, {
            value: "conversation",
            label: "Restore conversation"
        }, {
            value: "code",
            label: "Restore code"
        }] : [{
            value: "conversation",
            label: "Restore conversation"
        }];
        return N6.push({
            value: "summarize",
            label: "Summarize from here",
            type: "input",
            placeholder: "add context (optional)",
            initialValue: "",
            onChange: I,
            allowEmptySubmitToCancel: !0,
            showLabelWithValue: !0,
            labelValueSeparator: ": "
        }), N6.push({
            value: "nevermind",
            label: "Never mind"
        }), N6
    }
    XH.useEffect(() => {
        d("tengu_message_selector_opened", {})
    }, []);
    async function B(z6) {
        q(), N(!0);
        try {
            await K(z6), N(!1), _()
        } catch (N6) {
            _6(N6), N(!1), $(`Failed to restore the conversation:
${N6}`)
        }
    }
    async function b(z6) {
        let N6 = A.indexOf(z6),
            $6 = A.length - 1 - N6;
        if (d("tengu_message_selector_selected", {
                index_from_end: $6,
                message_type: z6.type,
                is_current_prompt: !1
            }), !A.includes(z6)) {
            _();
            return
        }
        if (!H) {
            await B(z6);
            return
        }
        let n = eN1(w, z6.uuid),
            o = !n?.filesChanged || n.filesChanged.length === 0,
            a = YI1(A, N6);
        if (o && a) await B(z6);
        else Z(z6), f(n)
    }
    async function p(z6) {
        if (d("tengu_message_selector_restore_option_selected", {
                option: z6
            }), !W) {
            $("Message not found.");
            return
        }
        if (z6 === "nevermind") {
            Z(void 0);
            return
        }
        if (z6 === "summarize") {
            q(), N(!0), L("summarize"), $(void 0);
            try {
                let n = u.trim() || void 0;
                await z(W, n), N(!1), L(null), Z(void 0), _()
            } catch (n) {
                _6(n), N(!1), L(null), Z(void 0), $(`Failed to summarize:
${n}`)
            }
            return
        }
        q(), N(!0), $(void 0);
        let N6 = null,
            $6 = null;
        if (z6 === "code" || z6 === "both") try {
            await Y(W)
        } catch (n) {
            N6 = n, _6(N6)
        }
        if (z6 === "conversation" || z6 === "both") try {
            await K(W)
        } catch (n) {
            $6 = n, _6($6)
        }
        if (N(!1), Z(void 0), $6 && N6) $(`Failed to restore the conversation and code:
${$6}
${N6}`);
        else if ($6) $(`Failed to restore the conversation:
${$6}`);
        else if (N6) $(`Failed to restore the code:
${N6}`);
        else _()
    }
    let Q = IK(),
        U = XH.useCallback(() => {
            if (W) {
                Z(void 0);
                return
            }
            d("tengu_message_selector_cancelled", {}), _()
        }, [_, W]),
        r = XH.useCallback(() => D((z6) => Math.max(0, z6 - 1)), []),
        e = XH.useCallback(() => D((z6) => Math.min(J.length - 1, z6 + 1)), [J.length]),
        Y6 = XH.useCallback(() => D(0), []),
        H6 = XH.useCallback(() => D(J.length - 1), [J.length]),
        J6 = XH.useCallback(() => {
            let z6 = J[M];
            if (z6) b(z6)
        }, [J, M, b]);
    D8("confirm:no", U, {
        context: "Confirmation",
        isActive: !W
    }), tA({
        "messageSelector:up": r,
        "messageSelector:down": e,
        "messageSelector:top": Y6,
        "messageSelector:bottom": H6,
        "messageSelector:select": J6
    }, {
        context: "MessageSelector",
        isActive: !v && !O && !W && P
    });
    let [K6, s] = XH.useState({});
    XH.useEffect(() => {
        async function z6() {
            if (!H) return;
            Promise.all(J.map(async (N6, $6) => {
                if (N6.uuid !== j) {
                    let n = tN1(w, N6.uuid),
                        o = J.at($6 + 1),
                        a = n ? KXz(A, N6.uuid, o?.uuid !== j ? o?.uuid : void 0) : void 0;
                    if (a !== void 0) s((i) => ({
                        ...i,
                        [$6]: a
                    }));
                    else s((i) => ({
                        ...i,
                        [$6]: void 0
                    }))
                }
            }))
        }
        z6()
    }, [J, A, j, w, H]);
    let X6 = H && G?.filesChanged && G.filesChanged.length > 0;
    return v8.createElement(m, {
        flexDirection: "column",
        width: "100%"
    }, v8.createElement(DD, {
        dividerColor: "suggestion"
    }), v8.createElement(m, {
        flexDirection: "column",
        marginX: 1,
        gap: 1
    }, v8.createElement(T, {
        bold: !0,
        color: "suggestion"
    }, "Rewind"), O && v8.createElement(v8.Fragment, null, v8.createElement(T, {
        color: "error"
    }, "Error: ", O)), !P && v8.createElement(v8.Fragment, null, v8.createElement(T, null, "Nothing to rewind to yet.")), !O && W && P && v8.createElement(v8.Fragment, null, v8.createElement(T, null, "Confirm you want to restore", " ", !G && "the conversation ", "to the point before you sent this message:"), v8.createElement(m, {
        flexDirection: "column",
        paddingLeft: 1,
        borderStyle: "single",
        borderRight: !1,
        borderTop: !1,
        borderBottom: !1,
        borderLeft: !0,
        borderLeftDimColor: !0
    }, v8.createElement(Khq, {
        userMessage: W,
        color: "text",
        isCurrent: !1
    }), v8.createElement(T, {
        dimColor: !0
    }, "(", Q46(new Date(W.timestamp)), ")")), v8.createElement(m, {
        flexDirection: "column"
    }, h === "summarize" ? v8.createElement(T, {
        dimColor: !0
    }, "Messages after this point will be summarized.") : h === "both" || h === "conversation" ? v8.createElement(T, {
        dimColor: !0
    }, "The conversation will be forked.") : v8.createElement(T, {
        dimColor: !0
    }, "The conversation will be unchanged."), h !== "summarize" && (X6 && (h === "both" || h === "code") ? v8.createElement(qXz, {
        diffStatsForRestore: G
    }) : v8.createElement(T, {
        dimColor: !0
    }, "The code will be unchanged."))), v && V === "summarize" ? v8.createElement(m, {
        flexDirection: "row",
        gap: 1
    }, v8.createElement(Wq, null), v8.createElement(T, null, "Summarizing…")) : v8.createElement(T8, {
        isDisabled: v,
        options: g(!!X6),
        defaultFocusValue: X6 ? "both" : "conversation",
        onFocus: (z6) => R(z6),
        onChange: (z6) => p(z6),
        onCancel: () => Z(void 0)
    }), X6 && v8.createElement(m, {
        marginBottom: 1
    }, v8.createElement(T, {
        dimColor: !0
    }, a6.warning, " Rewinding does not affect files edited manually or via bash."))), !O && !W && P && v8.createElement(v8.Fragment, null, H ? v8.createElement(T, null, "Restore the code and/or conversation to the point before…") : v8.createElement(T, null, "Restore and fork the conversation to the point before…"), v8.createElement(m, {
        width: "100%",
        flexDirection: "column"
    }, J.slice(X, X + Ys8).map((z6, N6) => {
        let $6 = X + N6,
            n = $6 === M,
            o = z6.uuid === j,
            a = $6 in K6,
            i = K6[$6],
            l = i?.filesChanged && i.filesChanged.length;
        return v8.createElement(m, {
            key: z6.uuid,
            height: H ? 3 : 2,
            overflow: "hidden",
            width: "100%",
            flexDirection: "row"
        }, v8.createElement(m, {
            width: 2,
            minWidth: 2
        }, n ? v8.createElement(T, {
            color: "permission",
            bold: !0
        }, a6.pointer, " ") : v8.createElement(T, null, "  ")), v8.createElement(m, {
            flexDirection: "column"
        }, v8.createElement(m, {
            flexShrink: 1,
            height: 1,
            overflow: "hidden"
        }, v8.createElement(Khq, {
            userMessage: z6,
            color: n ? "suggestion" : void 0,
            isCurrent: o,
            paddingRight: 10
        })), H && a && v8.createElement(m, {
            height: 1,
            flexDirection: "row"
        }, i ? v8.createElement(v8.Fragment, null, v8.createElement(T, {
            dimColor: !n,
            color: "inactive"
        }, l ? v8.createElement(v8.Fragment, null, l === 1 && i.filesChanged[0] ? `${DV6.basename(i.filesChanged[0])} ` : `${l} files changed `, v8.createElement(zhq, {
            diffStats: i
        })) : v8.createElement(v8.Fragment, null, "No code changes"))) : v8.createElement(T, {
            dimColor: !0,
            color: "warning"
        }, a6.warning, " No code restore"))))
    }))), !W && v8.createElement(T, {
        dimColor: !0,
        italic: !0
    }, Q.pending ? v8.createElement(v8.Fragment, null, "Press ", Q.keyName, " again to exit") : v8.createElement(v8.Fragment, null, !O && P && "Enter to continue · ", "Esc to exit"))))
}
// @from(Ln 479584, Col 0)
function qXz(A) {
    let q = A6(14),
        {
            diffStatsForRestore: K
        } = A;
    if (K === void 0) return;
    if (!K.filesChanged || !K.filesChanged[0]) {
        let O;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = v8.createElement(T, {
            dimColor: !0
        }, "The code has not changed (nothing will be restored)."), q[0] = O;
        else O = q[0];
        return O
    }
    let Y = K.filesChanged.length,
        z;
    if (Y === 1) {
        let O;
        if (q[1] !== K.filesChanged[0]) O = DV6.basename(K.filesChanged[0] || ""), q[1] = K.filesChanged[0], q[2] = O;
        else O = q[2];
        z = O
    } else if (Y === 2) {
        let O;
        if (q[3] !== K.filesChanged[0]) O = DV6.basename(K.filesChanged[0] || ""), q[3] = K.filesChanged[0], q[4] = O;
        else O = q[4];
        let $ = O,
            H;
        if (q[5] !== K.filesChanged[1]) H = DV6.basename(K.filesChanged[1] || ""), q[5] = K.filesChanged[1], q[6] = H;
        else H = q[6];
        z = `${$} and ${H}`
    } else {
        let O;
        if (q[7] !== K.filesChanged[0]) O = DV6.basename(K.filesChanged[0] || ""), q[7] = K.filesChanged[0], q[8] = O;
        else O = q[8];
        z = `${O} and ${K.filesChanged.length-1} other files`
    }
    let _;
    if (q[9] !== K) _ = v8.createElement(zhq, {
        diffStats: K
    }), q[9] = K, q[10] = _;
    else _ = q[10];
    let w;
    if (q[11] !== z || q[12] !== _) w = v8.createElement(v8.Fragment, null, v8.createElement(T, {
        dimColor: !0
    }, "The code will be restored", " ", _, " in ", z, ".")), q[11] = z, q[12] = _, q[13] = w;
    else w = q[13];
    return w
}
// @from(Ln 479633, Col 0)
function zhq(A) {
    let q = A6(7),
        {
            diffStats: K
        } = A;
    if (!K || !K.filesChanged) return;
    let Y;
    if (q[0] !== K.insertions) Y = v8.createElement(T, {
        color: "diffAddedWord"
    }, "+", K.insertions, " "), q[0] = K.insertions, q[1] = Y;
    else Y = q[1];
    let z;
    if (q[2] !== K.deletions) z = v8.createElement(T, {
        color: "diffRemovedWord"
    }, "-", K.deletions), q[2] = K.deletions, q[3] = z;
    else z = q[3];
    let _;
    if (q[4] !== Y || q[5] !== z) _ = v8.createElement(v8.Fragment, null, Y, z), q[4] = Y, q[5] = z, q[6] = _;
    else _ = q[6];
    return _
}
// @from(Ln 479655, Col 0)
function Khq(A) {
    let q = A6(31),
        {
            userMessage: K,
            color: Y,
            dimColor: z,
            isCurrent: _,
            paddingRight: w
        } = A,
        {
            columns: O
        } = KA();
    if (_) {
        let v;
        if (q[0] !== Y || q[1] !== z) v = v8.createElement(m, {
            width: "100%"
        }, v8.createElement(T, {
            italic: !0,
            color: Y,
            dimColor: z
        }, "(current)")), q[0] = Y, q[1] = z, q[2] = v;
        else v = q[2];
        return v
    }
    let $ = K.message.content,
        H = typeof $ === "string" ? null : $[$.length - 1],
        j, J, M, D, X, P, W, Z;
    if (q[3] !== Y || q[4] !== O || q[5] !== $ || q[6] !== z || q[7] !== H || q[8] !== w) {
        Z = Symbol.for("react.early_return_sentinel");
        A: {
            let v = typeof $ === "string" ? $.trim() : H && Yhq(H) ? H.text.trim() : "(no prompt)",
                N = Yr(v);
            if (pv1(N)) {
                let V;
                if (q[17] !== Y || q[18] !== z) V = v8.createElement(m, {
                    flexDirection: "row",
                    width: "100%"
                }, v8.createElement(T, {
                    italic: !0,
                    color: Y,
                    dimColor: z
                }, "((empty message))")), q[17] = Y, q[18] = z, q[19] = V;
                else V = q[19];
                Z = V;
                break A
            }
            if (N.includes("<bash-input>")) {
                let V = d4(N, "bash-input");
                if (V) {
                    let L;
                    if (q[20] === Symbol.for("react.memo_cache_sentinel")) L = v8.createElement(T, {
                        color: "bashBorder"
                    }, "!"), q[20] = L;
                    else L = q[20];
                    Z = v8.createElement(m, {
                        flexDirection: "row",
                        width: "100%"
                    }, L, v8.createElement(T, {
                        color: Y,
                        dimColor: z
                    }, " ", V));
                    break A
                }
            }
            if (N.includes(`<${PP}>`)) {
                let V = d4(N, PP),
                    L = d4(N, "command-args"),
                    h = d4(N, "skill-format") === "true";
                if (V)
                    if (h) {
                        Z = v8.createElement(m, {
                            flexDirection: "row",
                            width: "100%"
                        }, v8.createElement(T, {
                            color: Y,
                            dimColor: z
                        }, "Skill(", V, ")"));
                        break A
                    } else {
                        Z = v8.createElement(m, {
                            flexDirection: "row",
                            width: "100%"
                        }, v8.createElement(T, {
                            color: Y,
                            dimColor: z
                        }, "/", V, " ", L));
                        break A
                    }
            }
            J = m,
            P = "row",
            W = "100%",
            j = T,
            M = Y,
            D = z,
            X = w ? R3(N, O - w, !0) : N.slice(0, 500).split(`
`).slice(0, 4).join(`
`)
        }
        q[3] = Y, q[4] = O, q[5] = $, q[6] = z, q[7] = H, q[8] = w, q[9] = j, q[10] = J, q[11] = M, q[12] = D, q[13] = X, q[14] = P, q[15] = W, q[16] = Z
    } else j = q[9], J = q[10], M = q[11], D = q[12], X = q[13], P = q[14], W = q[15], Z = q[16];
    if (Z !== Symbol.for("react.early_return_sentinel")) return Z;
    let G;
    if (q[21] !== j || q[22] !== M || q[23] !== D || q[24] !== X) G = v8.createElement(j, {
        color: M,
        dimColor: D
    }, X), q[21] = j, q[22] = M, q[23] = D, q[24] = X, q[25] = G;
    else G = q[25];
    let f;
    if (q[26] !== J || q[27] !== P || q[28] !== W || q[29] !== G) f = v8.createElement(J, {
        flexDirection: P,
        width: W
    }, G), q[26] = J, q[27] = P, q[28] = W, q[29] = G, q[30] = f;
    else f = q[30];
    return f
}
// @from(Ln 479772, Col 0)
function KXz(A, q, K) {
    let Y = A.findIndex(($) => $.uuid === q);
    if (Y === -1) return;
    let z = K ? A.findIndex(($) => $.uuid === K) : A.length;
    if (z === -1) z = A.length;
    let _ = [],
        w = 0,
        O = 0;
    for (let $ = Y + 1; $ < z; $++) {
        let H = A[$];
        if (!H || !wl6(H)) continue;
        let j = H.toolUseResult;
        if (!j || !j.filePath || !j.structuredPatch) continue;
        if (!_.includes(j.filePath)) _.push(j.filePath);
        try {
            if ("type" in j && j.type === "create") w += j.content.split(/\r?\n/).length;
            else
                for (let J of j.structuredPatch) {
                    let M = J.lines.filter((X) => X.startsWith("+")).length,
                        D = J.lines.filter((X) => X.startsWith("-")).length;
                    w += M, O += D
                }
        } catch {
            continue
        }
    }
    return {
        filesChanged: _,
        insertions: w,
        deletions: O
    }
}
// @from(Ln 479805, Col 0)
function XV6(A) {
    if (A.type !== "user") return !1;
    if (Array.isArray(A.message.content) && A.message.content[0]?.type === "tool_result") return !1;
    if (Hz6(A)) return !1;
    if (A.isMeta) return !1;
    let q = A.message.content,
        K = typeof q === "string" ? null : q[q.length - 1],
        Y = typeof q === "string" ? q.trim() : K && Yhq(K) ? K.text.trim() : "";
    if (Y.indexOf(`<${WP}>`) !== -1 || Y.indexOf(`<${oA6}>`) !== -1 || Y.indexOf(`<${rHA}>`) !== -1 || Y.indexOf(`<${oHA}>`) !== -1 || Y.indexOf(`<${EH}>`) !== -1 || Y.indexOf(`<${vV}>`) !== -1 || Y.indexOf(`<${fj}`) !== -1) return !1;
    return !0
}
// @from(Ln 479817, Col 0)
function YI1(A, q) {
    for (let K = q + 1; K < A.length; K++) {
        let Y = A[K];
        if (!Y) continue;
        if (Hz6(Y)) continue;
        if (wl6(Y)) continue;
        if (Y.type === "progress") continue;
        if (Y.type === "system") continue;
        if (Y.type === "attachment") continue;
        if (Y.type === "user" && Y.isMeta) continue;
        if (Y.type === "assistant") {
            let z = Y.message.content;
            if (Array.isArray(z)) {
                if (z.some((w) => w.type === "text" && w.text.trim() || w.type === "tool_use")) return !1
            }
            continue
        }
        if (Y.type === "user") return !1
    }
    return !0
}
// @from(Ln 479838, Col 4)
v8
// @from(Ln 479838, Col 8)
XH
// @from(Ln 479838, Col 12)
Ys8 = 7
// @from(Ln 479839, Col 4)
zI1 = E(() => {
    e6();
    i6();
    _7();
    b7();
    LO();
    JA();
    E$6();
    V1();
    PO();
    v3();
    NA();
    k1();
    JN();
    M4();
    _q();
    C16();
    vz();
    v8 = t(P6(), 1), XH = t(P6(), 1)
})
// @from(Ln 479862, Col 0)
class Hhq {
    config;
    mutableMessages;
    abortController;
    permissionDenials;
    totalUsage;
    hasHandledOrphanedPermission = !1;
    readFileState;
    constructor(A) {
        this.config = A, this.mutableMessages = A.initialMessages ?? [], this.abortController = A.abortController ?? sK(), this.permissionDenials = [], this.readFileState = A.readFileCache, this.totalUsage = gZ
    }
    async * submitMessage(A, q) {
        let {
            cwd: K,
            commands: Y,
            tools: z,
            mcpClients: _,
            verbose: w = !1,
            thinkingConfig: O,
            maxTurns: $,
            maxBudgetUsd: H,
            canUseTool: j,
            customSystemPrompt: J,
            appendSystemPrompt: M,
            userSpecifiedModel: D,
            fallbackModel: X,
            jsonSchema: P,
            getAppState: W,
            setAppState: Z,
            replayUserMessages: G = !1,
            includePartialMessages: f = !1,
            agents: v = [],
            setSDKStatus: N,
            orphanedPermission: V
        } = this.config;
        VO(K);
        let L = !jS(),
            h = Date.now(),
            R = async (k6, Z6, u6, C6, o6, V6) => {
                let b6 = await j(k6, Z6, u6, C6, o6, V6);
                if (b6.behavior !== "allow") this.permissionDenials.push({
                    tool_name: Ohq(k6.name),
                    tool_use_id: o6,
                    tool_input: Z6
                });
                return b6
            }, u = W(), I = D ? H5(D) : cK(), g = O ? O : fD6() !== !1 ? {
                type: "adaptive"
            } : {
                type: "disabled"
            }, [B, b, p] = await Promise.all([R0(z, I, Array.from(u.toolPermissionContext.additionalWorkingDirectories.keys()), _), a2(), typeof J === "string" ? Promise.resolve({}) : mw()]), Q = {
                ...b,
                ...YXz(_)
            }, U = typeof J === "string" && Oz1() ? await ID1() : null, r = uq([...typeof J === "string" ? [J] : B, ...U ? [U] : [], ...M ? [M] : []]), e = z.some((k6) => z3(k6, oM));
        if (P && e) ZS1(Z, R1());
        let Y6 = {
            messages: this.mutableMessages,
            setMessages: (k6) => {
                this.mutableMessages = k6(this.mutableMessages)
            },
            onChangeAPIKey: () => {},
            handleElicitation: this.config.handleElicitation,
            options: {
                commands: Y,
                debug: !1,
                tools: z,
                verbose: w,
                mainLoopModel: I,
                thinkingConfig: g,
                mcpClients: _,
                mcpResources: {},
                ideInstallationStatus: null,
                isNonInteractiveSession: !0,
                customSystemPrompt: J,
                appendSystemPrompt: M,
                agentDefinitions: {
                    activeAgents: v,
                    allAgents: []
                },
                theme: km(X1().theme),
                maxBudgetUsd: H
            },
            getAppState: W,
            setAppState: Z,
            abortController: this.abortController,
            readFileState: this.readFileState,
            nestedMemoryAttachmentTriggers: new Set,
            dynamicSkillDirTriggers: new Set,
            discoveredSkillNames: new Set,
            setInProgressToolUseIDs: () => {},
            setResponseLength: () => {},
            updateFileHistoryState: (k6) => {
                Z((Z6) => ({
                    ...Z6,
                    fileHistory: k6(Z6.fileHistory)
                }))
            },
            updateAttributionState: (k6) => {
                Z((Z6) => ({
                    ...Z6,
                    attribution: k6(Z6.attribution)
                }))
            },
            setSDKStatus: N
        };
        if (V && !this.hasHandledOrphanedPermission) {
            this.hasHandledOrphanedPermission = !0;
            for await (let k6 of B4q(V, z, this.mutableMessages, Y6)) yield k6
        }
        let {
            messages: H6,
            shouldQuery: J6,
            allowedTools: K6,
            model: s,
            resultText: X6
        } = await KI1({
            input: A,
            mode: "prompt",
            setToolJSX: () => {},
            context: {
                ...Y6,
                messages: this.mutableMessages
            },
            messages: this.mutableMessages,
            uuid: q?.uuid,
            querySource: "sdk"
        });
        this.mutableMessages.push(...H6);
        let z6 = [...this.mutableMessages];
        if (L && H6.length > 0) {
            if (await _F(z6), t6(process.env.CLAUDE_CODE_EAGER_FLUSH) || t6(process.env.CLAUDE_CODE_IS_COWORK)) await jF()
        }
        let N6 = H6.filter((k6) => k6.type === "user" && !k6.isMeta && !k6.toolUseResult && whq().selectableUserMessagesFilter(k6) || k6.type === "system" && k6.subtype === "compact_boundary"),
            $6 = G ? N6 : [];
        Z((k6) => ({
            ...k6,
            toolPermissionContext: {
                ...k6.toolPermissionContext,
                alwaysAllowRules: {
                    ...k6.toolPermissionContext.alwaysAllowRules,
                    command: K6
                }
            }
        }));
        let n = s ?? I;
        Y6 = {
            messages: z6,
            setMessages: () => {},
            onChangeAPIKey: () => {},
            handleElicitation: this.config.handleElicitation,
            options: {
                commands: Y,
                debug: !1,
                tools: z,
                verbose: w,
                mainLoopModel: n,
                thinkingConfig: g,
                mcpClients: _,
                mcpResources: {},
                ideInstallationStatus: null,
                isNonInteractiveSession: !0,
                customSystemPrompt: J,
                appendSystemPrompt: M,
                theme: km(X1().theme),
                agentDefinitions: {
                    activeAgents: v,
                    allAgents: []
                },
                maxBudgetUsd: H
            },
            getAppState: W,
            setAppState: Z,
            abortController: this.abortController,
            readFileState: this.readFileState,
            nestedMemoryAttachmentTriggers: new Set,
            dynamicSkillDirTriggers: new Set,
            discoveredSkillNames: new Set,
            setInProgressToolUseIDs: () => {},
            setResponseLength: () => {},
            updateFileHistoryState: Y6.updateFileHistoryState,
            updateAttributionState: Y6.updateAttributionState,
            setSDKStatus: N
        };
        let a = PA()?.outputStyle ?? hf,
            [i, {
                enabled: l
            }] = await Promise.all([vp6(G1()), _z()]);
        gC1(K, uM(n, Zj()));
        let q6 = {
            type: "system",
            subtype: "init",
            cwd: K,
            session_id: R1(),
            tools: z.map((k6) => Ohq(k6.name)),
            mcp_servers: _.map((k6) => ({
                name: k6.name,
                status: k6.type
            })),
            model: n,
            permissionMode: u.toolPermissionContext.mode,
            slash_commands: Y.filter((k6) => k6.userInvocable !== !1).map((k6) => k6.name),
            apiKeySource: s2().source,
            betas: Zj(),
            claude_code_version: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.VERSION,
            output_style: a,
            agents: v.map((k6) => k6.agentType),
            skills: i.filter((k6) => k6.userInvocable !== !1).map((k6) => k6.name),
            plugins: l.map((k6) => ({
                name: k6.name,
                path: k6.path
            })),
            uuid: $86()
        };
        if (q6.fast_mode_state = Mm(n, u.fastMode), yield q6, Bz6("system_message_yielded"), !J6) {
            for (let k6 of H6) {
                if (k6.type === "user" && typeof k6.message.content === "string" && (k6.message.content.includes(`<${WP}>`) || k6.message.content.includes(`<${oA6}>`) || k6.isCompactSummary)) yield {
                    type: "user",
                    message: {
                        ...k6.message,
                        content: sY(k6.message.content)
                    },
                    session_id: R1(),
                    parent_tool_use_id: null,
                    uuid: k6.uuid,
                    isReplay: !k6.isCompactSummary,
                    isSynthetic: k6.isMeta || k6.isVisibleInTranscriptOnly
                };
                if (k6.type === "system" && k6.subtype === "local_command" && typeof k6.content === "string" && (k6.content.includes(`<${WP}>`) || k6.content.includes(`<${oA6}>`))) yield sc8(k6.content, k6.uuid);
                if (k6.type === "system" && k6.subtype === "compact_boundary") yield {
                    type: "system",
                    subtype: "compact_boundary",
                    session_id: R1(),
                    uuid: k6.uuid,
                    compact_metadata: RR1(k6.compactMetadata)
                }
            }
            if (L) {
                if (await _F(z6), t6(process.env.CLAUDE_CODE_EAGER_FLUSH) || t6(process.env.CLAUDE_CODE_IS_COWORK)) await jF()
            }
            yield {
                type: "result",
                subtype: "success",
                is_error: !1,
                duration_ms: Date.now() - h,
                duration_api_ms: OV(),
                num_turns: z6.length - 1,
                result: X6 ?? "",
                stop_reason: null,
                session_id: R1(),
                total_cost_usd: LD(),
                usage: this.totalUsage,
                modelUsage: $S(),
                permission_denials: this.permissionDenials,
                fast_mode_state: Mm(n, u.fastMode),
                uuid: $86()
            };
            return
        }
        if (iz() && L) H6.filter(whq().selectableUserMessagesFilter).forEach((k6) => {
            lf6((Z6) => {
                Z((u6) => ({
                    ...u6,
                    fileHistory: Z6(u6.fileHistory)
                }))
            }, k6.uuid)
        });
        let w6 = gZ,
            O6 = 1,
            L6 = !1,
            y6, G6 = null,
            R6 = P ? qr8(this.mutableMessages, oM) : 0;
        for await (let k6 of Yh({
            messages: z6,
            systemPrompt: r,
            userContext: Q,
            systemContext: p,
            canUseTool: R,
            toolUseContext: Y6,
            fallbackModel: X,
            querySource: "sdk",
            maxTurns: $
        })) {
            if (k6.type === "assistant" || k6.type === "user" || k6.type === "system" && k6.subtype === "compact_boundary") {
                if (z6.push(k6), L) await _F(z6);
                if (!L6 && $6.length > 0) {
                    L6 = !0;
                    for (let Z6 of $6)
                        if (Z6.type === "user") yield {
                            type: "user",
                            message: Z6.message,
                            session_id: R1(),
                            parent_tool_use_id: null,
                            uuid: Z6.uuid,
                            isReplay: !0
                        }
                }
            }
            if (k6.type === "user") O6++;
            switch (k6.type) {
                case "tombstone":
                    break;
                case "assistant":
                    if (k6.message.stop_reason != null) G6 = k6.message.stop_reason;
                    this.mutableMessages.push(k6), yield* bF8(k6);
                    break;
                case "progress":
                case "user":
                    this.mutableMessages.push(k6), yield* bF8(k6);
                    break;
                case "stream_event":
                    if (k6.event.type === "message_start") w6 = gZ, w6 = Qz6(w6, k6.event.message.usage);
                    if (k6.event.type === "message_delta") {
                        if (w6 = Qz6(w6, k6.event.usage), k6.event.delta.stop_reason != null) G6 = k6.event.delta.stop_reason
                    }
                    if (k6.event.type === "message_stop") this.totalUsage = qy1(this.totalUsage, w6);
                    if (f) yield {
                        type: "stream_event",
                        event: k6.event,
                        session_id: R1(),
                        parent_tool_use_id: null,
                        uuid: $86()
                    };
                    break;
                case "attachment":
                    if (this.mutableMessages.push(k6), k6.attachment.type === "structured_output") y6 = k6.attachment.data;
                    else if (k6.attachment.type === "max_turns_reached") {
                        if (L) {
                            if (t6(process.env.CLAUDE_CODE_EAGER_FLUSH) || t6(process.env.CLAUDE_CODE_IS_COWORK)) await jF()
                        }
                        yield {
                            type: "result",
                            subtype: "error_max_turns",
                            duration_ms: Date.now() - h,
                            duration_api_ms: OV(),
                            is_error: !1,
                            num_turns: k6.attachment.turnCount,
                            stop_reason: G6,
                            session_id: R1(),
                            total_cost_usd: LD(),
                            usage: this.totalUsage,
                            modelUsage: $S(),
                            permission_denials: this.permissionDenials,
                            fast_mode_state: Mm(n, u.fastMode),
                            uuid: $86(),
                            errors: []
                        };
                        return
                    } else if (G && k6.attachment.type === "queued_command") yield {
                        type: "user",
                        message: {
                            role: "user",
                            content: k6.attachment.prompt
                        },
                        session_id: R1(),
                        parent_tool_use_id: null,
                        uuid: k6.attachment.source_uuid || k6.uuid,
                        isReplay: !0
                    };
                    break;
                case "stream_request_start":
                    break;
                case "system": {
                    let Z6 = this.config.snipReplay?.(k6, this.mutableMessages);
                    if (Z6 !== void 0) {
                        if (Z6.executed) this.mutableMessages.length = 0, this.mutableMessages.push(...Z6.messages);
                        break
                    }
                    if (this.mutableMessages.push(k6), k6.subtype === "compact_boundary" && k6.compactMetadata) {
                        let u6 = this.mutableMessages.length - 1;
                        if (u6 > 0) this.mutableMessages.splice(0, u6);
                        let C6 = z6.length - 1;
                        if (C6 > 0) z6.splice(0, C6);
                        yield {
                            type: "system",
                            subtype: "compact_boundary",
                            session_id: R1(),
                            uuid: k6.uuid,
                            compact_metadata: RR1(k6.compactMetadata)
                        }
                    }
                    break
                }
                case "tool_use_summary":
                    yield {
                        type: "tool_use_summary", summary: k6.summary, preceding_tool_use_ids: k6.precedingToolUseIds, session_id: R1(), uuid: k6.uuid
                    };
                    break
            }
            if (H !== void 0 && LD() >= H) {
                if (L) {
                    if (t6(process.env.CLAUDE_CODE_EAGER_FLUSH) || t6(process.env.CLAUDE_CODE_IS_COWORK)) await jF()
                }
                yield {
                    type: "result",
                    subtype: "error_max_budget_usd",
                    duration_ms: Date.now() - h,
                    duration_api_ms: OV(),
                    is_error: !1,
                    num_turns: O6,
                    stop_reason: G6,
                    session_id: R1(),
                    total_cost_usd: LD(),
                    usage: this.totalUsage,
                    modelUsage: $S(),
                    permission_denials: this.permissionDenials,
                    fast_mode_state: Mm(n, u.fastMode),
                    uuid: $86(),
                    errors: []
                };
                return
            }
            if (k6.type === "user" && P) {
                let u6 = qr8(this.mutableMessages, oM) - R6,
                    C6 = parseInt(process.env.MAX_STRUCTURED_OUTPUT_RETRIES || "5", 10);
                if (u6 >= C6) {
                    if (L) {
                        if (t6(process.env.CLAUDE_CODE_EAGER_FLUSH) || t6(process.env.CLAUDE_CODE_IS_COWORK)) await jF()
                    }
                    yield {
                        type: "result",
                        subtype: "error_max_structured_output_retries",
                        duration_ms: Date.now() - h,
                        duration_api_ms: OV(),
                        is_error: !0,
                        num_turns: O6,
                        stop_reason: G6,
                        session_id: R1(),
                        total_cost_usd: LD(),
                        usage: this.totalUsage,
                        modelUsage: $S(),
                        permission_denials: this.permissionDenials,
                        fast_mode_state: Mm(n, u.fastMode),
                        uuid: $86(),
                        errors: [`Failed to provide valid structured output after ${C6} attempts`]
                    };
                    return
                }
            }
        }
        let T6 = fL(z6);
        if (L) {
            if (t6(process.env.CLAUDE_CODE_EAGER_FLUSH) || t6(process.env.CLAUDE_CODE_IS_COWORK)) await jF()
        }
        if (!m4q(T6)) {
            yield {
                type: "result",
                subtype: "error_during_execution",
                duration_ms: Date.now() - h,
                duration_api_ms: OV(),
                is_error: !1,
                num_turns: O6,
                stop_reason: G6,
                session_id: R1(),
                total_cost_usd: LD(),
                usage: this.totalUsage,
                modelUsage: $S(),
                permission_denials: this.permissionDenials,
                fast_mode_state: Mm(n, u.fastMode),
                uuid: $86(),
                errors: L$6().map((k6) => k6.error)
            };
            return
        }
        let D6 = "",
            Q6 = !1;
        if (T6.type === "assistant") {
            let k6 = fL(T6.message.content);
            if (k6?.type === "text" && !TF6.has(k6.text)) D6 = k6.text;
            Q6 = Boolean(T6.isApiErrorMessage)
        }
        yield {
            type: "result",
            subtype: "success",
            is_error: Q6,
            duration_ms: Date.now() - h,
            duration_api_ms: OV(),
            num_turns: O6,
            result: D6,
            stop_reason: G6,
            session_id: R1(),
            total_cost_usd: LD(),
            usage: this.totalUsage,
            modelUsage: $S(),
            permission_denials: this.permissionDenials,
            structured_output: y6,
            fast_mode_state: Mm(n, u.fastMode),
            uuid: $86()
        }
    }
    interrupt() {
        this.abortController.abort()
    }
    getMessages() {
        return this.mutableMessages
    }
    getReadFileState() {
        return this.readFileState
    }
    getSessionId() {
        return R1()
    }
    setModel(A) {
        this.config.userSpecifiedModel = A
    }
}
// @from(Ln 480374, Col 0)
async function* jhq({
    commands: A,
    prompt: q,
    promptUuid: K,
    cwd: Y,
    tools: z,
    mcpClients: _,
    verbose: w = !1,
    thinkingConfig: O,
    maxTurns: $,
    maxBudgetUsd: H,
    canUseTool: j,
    mutableMessages: J = [],
    getReadFileCache: M,
    setReadFileCache: D,
    customSystemPrompt: X,
    appendSystemPrompt: P,
    userSpecifiedModel: W,
    fallbackModel: Z,
    jsonSchema: G,
    getAppState: f,
    setAppState: v,
    abortController: N,
    replayUserMessages: V = !1,
    includePartialMessages: L = !1,
    handleElicitation: h,
    agents: R = [],
    setSDKStatus: u,
    orphanedPermission: I
}) {
    let g = new Hhq({
        cwd: Y,
        tools: z,
        commands: A,
        mcpClients: _,
        agents: R,
        canUseTool: j,
        getAppState: f,
        setAppState: v,
        initialMessages: J,
        readFileCache: DI(M()),
        customSystemPrompt: X,
        appendSystemPrompt: P,
        userSpecifiedModel: W,
        fallbackModel: Z,
        thinkingConfig: O,
        maxTurns: $,
        maxBudgetUsd: H,
        jsonSchema: G,
        verbose: w,
        handleElicitation: h,
        replayUserMessages: V,
        includePartialMessages: L,
        setSDKStatus: u,
        abortController: N,
        orphanedPermission: I,
        ...{}
    });
    try {
        yield* g.submitMessage(q, {
            uuid: K
        })
    } finally {
        D(g.getReadFileState())
    }
}
// @from(Ln 480441, Col 0)
function Ohq(A) {
    return A === r4 ? I46 : A
}
// @from(Ln 480444, Col 4)
whq = () => (zI1(), k4(_hq))
// @from(Ln 480445, Col 4)
YXz = () => ({})
// @from(Ln 480446, Col 4)
Jhq = E(() => {
    eI6();
    FW();
    jm();
    D$();
    lA();
    jE();
    k06();
    mH();
    bv();
    $k();
    oY6();
    tP();
    WR();
    Oq();
    A8();
    JA();
    BB();
    Ks8();
    T1();
    z4();
    GS1();
    LG();
    vz();
    fA();
    xJ();
    Ii6();
    gi6();
    gw();
    k8();
    EX6();
    U$();
    aB();
    i8();
    tH();
    ka8();
    k1();
    JN();
    fi6();
    jN6()
})
// @from(Ln 480487, Col 4)
Mhq = E(() => {
    k1();
    $a8();
    lA();
    eN8();
    V1();
    gL();
    s8()
})
// @from(Ln 480497, Col 0)
function Dhq(A) {
    let q = process.env.CLAUDE_CODE_EXIT_AFTER_STOP_DELAY,
        K = q ? parseInt(q, 10) : null,
        Y = K && !isNaN(K) && K > 0,
        z = null,
        _ = 0;
    return {
        start() {
            if (z) clearTimeout(z), z = null;
            if (Y) _ = Date.now(), z = setTimeout(() => {
                let w = Date.now() - _;
                if (A() && w >= K) k(`Exiting after ${K}ms of idle time`), fK()
            }, K)
        },
        stop() {
            if (z) clearTimeout(z), z = null
        }
    }
}
// @from(Ln 480516, Col 4)
Xhq = E(() => {
    H1();
    c_()
})
// @from(Ln 480521, Col 0)
function _I1(A) {
    if (A.type !== "user") return;
    let q = A.message?.content;
    if (!q) return;
    if (Array.isArray(q) && q.length === 0) return;
    let K = "uuid" in A && typeof A.uuid === "string" ? A.uuid : void 0;
    return {
        content: q,
        uuid: K
    }
}
// @from(Ln 480532, Col 0)
async function wI1(A, q) {
    let K = A.trim();
    if (!K) return null;
    try {
        let z = (await WX({
                systemPrompt: uq([zXz]),
                userPrompt: K,
                outputFormat: {
                    type: "json_schema",
                    schema: {
                        type: "object",
                        properties: {
                            title: {
                                type: "string"
                            }
                        },
                        required: ["title"],
                        additionalProperties: !1
                    }
                },
                signal: q,
                options: {
                    querySource: "generate_session_title",
                    agents: [],
                    isNonInteractiveSession: q7(),
                    hasAppendSystemPrompt: !1,
                    mcpTools: []
                }
            })).message.content.filter((w) => w.type === "text").map((w) => w.text).join(""),
            _ = _Xz().safeParse(WK(z));
        if (!_.success) return null;
        return _.data.title.trim() || null
    } catch (Y) {
        return k(`generateSessionTitle failed: ${Y}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 480570, Col 4)
zXz = `Generate a concise, sentence-case title (3-7 words) that captures the main topic or goal of this coding session. The title should be clear enough that the user recognizes the session in a list. Use sentence case: capitalize only the first word and proper nouns.

Return JSON with a single "title" field.

Good examples:
{"title": "Fix login button on mobile"}
{"title": "Add OAuth authentication"}
{"title": "Debug failing CI tests"}
{"title": "Refactor API client error handling"}

Bad (too vague): {"title": "Code changes"}
Bad (too long): {"title": "Investigate and fix the issue where the login button does not respond on mobile devices"}
Bad (wrong case): {"title": "Fix Login Button On Mobile"}`
// @from(Ln 480583, Col 4)
_Xz
// @from(Ln 480584, Col 4)
_s8 = E(() => {
    K7();
    gw();
    K_();
    H1();
    T1();
    _Xz = F6(() => C.object({
        title: C.string()
    }))
})
// @from(Ln 480598, Col 0)
function Whq(A) {
    if (A.toLowerCase().endsWith(".jsonl")) return {
        sessionId: Phq(),
        ingressUrl: null,
        isUrl: !1,
        jsonlFile: A,
        isJsonlFile: !0
    };
    if (nk(A)) return {
        sessionId: A,
        ingressUrl: null,
        isUrl: !1,
        jsonlFile: null,
        isJsonlFile: !1
    };
    try {
        let q = new URL(A);
        return {
            sessionId: Phq(),
            ingressUrl: q.href,
            isUrl: !0,
            jsonlFile: null,
            isJsonlFile: !1
        }
    } catch {}
    return null
}
// @from(Ln 480625, Col 4)
Zhq = E(() => {
    xI()
})
// @from(Ln 480629, Col 0)
function wXz() {
    return t6(process.env.CLAUDE_CODE_DISABLE_OFFICIAL_MARKETPLACE_AUTOINSTALL)
}
// @from(Ln 480633, Col 0)
function Ghq(A) {
    let q = OI1.INITIAL_DELAY_MS * Math.pow(OI1.BACKOFF_MULTIPLIER, A);
    return Math.min(q, OI1.MAX_DELAY_MS)
}
// @from(Ln 480638, Col 0)
function OXz(A) {
    if (!A.officialMarketplaceAutoInstallAttempted) return !0;
    if (A.officialMarketplaceAutoInstalled) return !1;
    let q = A.officialMarketplaceAutoInstallFailReason,
        K = A.officialMarketplaceAutoInstallRetryCount || 0,
        Y = A.officialMarketplaceAutoInstallNextRetryTime,
        z = Date.now();
    if (K >= OI1.MAX_ATTEMPTS) return !1;
    if (q === "policy_blocked") return !1;
    if (Y && z < Y) return !1;
    return q === "unknown" || q === "git_unavailable" || q === void 0
}
// @from(Ln 480650, Col 0)
async function $I1() {
    let A = X1();
    if (!OXz(A)) {
        let q = A.officialMarketplaceAutoInstallFailReason ?? "already_attempted";
        return k(`Official marketplace auto-install skipped: ${q}`), {
            installed: !1,
            skipped: !0,
            reason: q
        }
    }
    try {
        if (wXz()) return k("Official marketplace auto-install disabled via env var, skipping"), d1((z) => ({
            ...z,
            officialMarketplaceAutoInstallAttempted: !0,
            officialMarketplaceAutoInstalled: !1,
            officialMarketplaceAutoInstallFailReason: "policy_blocked"
        })), d("tengu_official_marketplace_auto_install", {
            installed: !1,
            skipped: !0,
            policy_blocked: !0
        }), {
            installed: !1,
            skipped: !0,
            reason: "policy_blocked"
        };
        if ((await C3())[db]) return k(`Official marketplace '${db}' already installed, skipping`), d1((z) => ({
            ...z,
            officialMarketplaceAutoInstallAttempted: !0,
            officialMarketplaceAutoInstalled: !0
        })), {
            installed: !1,
            skipped: !0,
            reason: "already_installed"
        };
        if (!Y96(wd8)) return k("Official marketplace blocked by enterprise policy, skipping"), d1((z) => ({
            ...z,
            officialMarketplaceAutoInstallAttempted: !0,
            officialMarketplaceAutoInstalled: !1,
            officialMarketplaceAutoInstallFailReason: "policy_blocked"
        })), d("tengu_official_marketplace_auto_install", {
            installed: !1,
            skipped: !0,
            policy_blocked: !0
        }), {
            installed: !1,
            skipped: !0,
            reason: "policy_blocked"
        };
        if (!await K96()) {
            k("Git not available, skipping official marketplace auto-install");
            let z = (A.officialMarketplaceAutoInstallRetryCount || 0) + 1,
                _ = Date.now(),
                w = Ghq(z),
                O = _ + w,
                $ = !1;
            try {
                d1((H) => ({
                    ...H,
                    officialMarketplaceAutoInstallAttempted: !0,
                    officialMarketplaceAutoInstalled: !1,
                    officialMarketplaceAutoInstallFailReason: "git_unavailable",
                    officialMarketplaceAutoInstallRetryCount: z,
                    officialMarketplaceAutoInstallLastAttemptTime: _,
                    officialMarketplaceAutoInstallNextRetryTime: O
                }))
            } catch (H) {
                $ = !0;
                let j = H instanceof Error ? H : Error(`Failed to save marketplace auto-install git_unavailable state: ${H}`);
                _6(j), k(`Failed to save marketplace auto-install git_unavailable state: ${H}`, {
                    level: "error"
                })
            }
            return d("tengu_official_marketplace_auto_install", {
                installed: !1,
                skipped: !0,
                git_unavailable: !0,
                retry_count: z
            }), {
                installed: !1,
                skipped: !0,
                reason: "git_unavailable",
                configSaveFailed: $
            }
        }
        k("Attempting to auto-install official marketplace"), await sB(wd8), k("Successfully auto-installed official marketplace");
        let Y = A.officialMarketplaceAutoInstallRetryCount || 0;
        return d1((z) => ({
            ...z,
            officialMarketplaceAutoInstallAttempted: !0,
            officialMarketplaceAutoInstalled: !0,
            officialMarketplaceAutoInstallFailReason: void 0,
            officialMarketplaceAutoInstallRetryCount: void 0,
            officialMarketplaceAutoInstallLastAttemptTime: void 0,
            officialMarketplaceAutoInstallNextRetryTime: void 0
        })), d("tengu_official_marketplace_auto_install", {
            installed: !0,
            skipped: !1,
            retry_count: Y
        }), {
            installed: !0,
            skipped: !1
        }
    } catch (q) {
        let K = q instanceof Error ? q.message : String(q);
        if (K.includes("xcrun: error:")) return v_4(), k("Official marketplace auto-install: git is a non-functional macOS xcrun shim, treating as git_unavailable"), d("tengu_official_marketplace_auto_install", {
            installed: !1,
            skipped: !0,
            git_unavailable: !0,
            macos_xcrun_shim: !0
        }), {
            installed: !1,
            skipped: !0,
            reason: "git_unavailable"
        };
        k(`Failed to auto-install official marketplace: ${K}`, {
            level: "error"
        }), _6(q instanceof Error ? q : Error(`Official marketplace auto-install failed: ${K}`));
        let Y = (A.officialMarketplaceAutoInstallRetryCount || 0) + 1,
            z = Date.now(),
            _ = Ghq(Y),
            w = z + _,
            O = !1;
        try {
            d1(($) => ({
                ...$,
                officialMarketplaceAutoInstallAttempted: !0,
                officialMarketplaceAutoInstalled: !1,
                officialMarketplaceAutoInstallFailReason: "unknown",
                officialMarketplaceAutoInstallRetryCount: Y,
                officialMarketplaceAutoInstallLastAttemptTime: z,
                officialMarketplaceAutoInstallNextRetryTime: w
            }))
        } catch ($) {
            O = !0;
            let H = $ instanceof Error ? $ : Error(`Failed to save marketplace auto-install failure state: ${$}`);
            _6(H), k(`Failed to save marketplace auto-install failure state: ${$}`, {
                level: "error"
            })
        }
        return d("tengu_official_marketplace_auto_install", {
            installed: !1,
            skipped: !0,
            failed: !0,
            retry_count: Y
        }), {
            installed: !1,
            skipped: !0,
            reason: "unknown",
            configSaveFailed: O
        }
    }
}
// @from(Ln 480802, Col 4)
OI1
// @from(Ln 480803, Col 4)
ws8 = E(() => {
    lv6();
    m01();
    dB();
    Aw();
    k8();
    H1();
    k1();
    V1();
    A8();
    OI1 = {
        MAX_ATTEMPTS: 10,
        INITIAL_DELAY_MS: 3600000,
        BACKOFF_MULTIPLIER: 2,
        MAX_DELAY_MS: 604800000
    }
})
// @from(Ln 480825, Col 0)
function Os8(A, q, K) {
    let Y = [],
        z = [],
        _ = [];
    for (let [w, O] of Object.entries(A)) {
        let $ = q[w],
            H = fhq(O.source, K?.projectRoot);
        if (!$) Y.push(w);
        else if (!TP(H, $.source)) z.push({
            name: w,
            declaredSource: H,
            materializedSource: $.source
        });
        else _.push(w)
    }
    return {
        missing: Y,
        sourceChanged: z,
        upToDate: _
    }
}
// @from(Ln 480846, Col 0)
async function HI1(A) {
    let q = _e();
    if (Object.keys(q).length === 0) return {
        installed: [],
        updated: [],
        failed: [],
        upToDate: [],
        skipped: []
    };
    let K;
    try {
        K = await C3()
    } catch (j) {
        _6(j), K = {}
    }
    let Y = Os8(q, K, {
            projectRoot: AA()
        }),
        z = [...Y.missing.map((j) => ({
            name: j,
            source: fhq(q[j].source),
            action: "install"
        })), ...Y.sourceChanged.map(({
            name: j,
            declaredSource: J
        }) => ({
            name: j,
            source: J,
            action: "update"
        }))],
        _ = [],
        w = z.filter(({
            name: j,
            source: J
        }) => {
            if (A?.skip?.(j, J)) return _.push(j), !1;
            return !0
        });
    if (w.length === 0) return {
        installed: [],
        updated: [],
        failed: [],
        upToDate: Y.upToDate,
        skipped: _
    };
    k(`[reconcile] ${w.length} marketplace(s): ${w.map((j)=>`${j.name}(${j.action})`).join(", ")}`);
    let O = [],
        $ = [],
        H = [];
    for (let j = 0; j < w.length; j++) {
        let {
            name: J,
            source: M,
            action: D
        } = w[j];
        A?.onProgress?.({
            type: "installing",
            name: J,
            action: D,
            index: j + 1,
            total: w.length
        });
        try {
            let X = await sB(M);
            if (D === "install") O.push(J);
            else $.push(J);
            A?.onProgress?.({
                type: "installed",
                name: J,
                alreadyMaterialized: X.alreadyMaterialized
            })
        } catch (X) {
            let P = _1(X);
            H.push({
                name: J,
                error: P
            }), A?.onProgress?.({
                type: "failed",
                name: J,
                error: P
            }), _6(X)
        }
    }
    return {
        installed: O,
        updated: $,
        failed: H,
        upToDate: Y.upToDate,
        skipped: _
    }
}
// @from(Ln 480938, Col 0)
function fhq(A, q) {
    if ((A.source === "directory" || A.source === "file") && !$Xz(A.path)) return {
        ...A,
        path: HXz(q ?? AA(), A.path)
    };
    return A
}
// @from(Ln 480945, Col 4)
$s8 = E(() => {
    Q$6();
    Aw();
    T1();
    H1();
    k1();
    s8()
})
// @from(Ln 480959, Col 0)
async function jXz() {
    try {
        let A = await Thq(mk8(), "utf-8"),
            q = PJ6().safeParse(i1(A));
        if (!q.success) return k(`Invalid known_marketplaces.json in zip cache: ${q.error.message}`, {
            level: "error"
        }), {};
        return q.data
    } catch {
        return {}
    }
}
// @from(Ln 480971, Col 0)
async function JXz(A) {
    await i01(mk8(), B6(A, null, 2))
}
// @from(Ln 480974, Col 0)
async function MXz(A, q) {
    let K = lp6();
    if (!K) return;
    let Y = await DXz(q);
    if (Y !== null) {
        let z = s_4(A);
        await i01(Hs8(K, z), Y)
    }
}
// @from(Ln 480983, Col 0)
async function DXz(A) {
    let q = [Hs8(A, ".claude-plugin", "marketplace.json"), Hs8(A, "marketplace.json"), A];
    for (let K of q) try {
        return await Thq(K, "utf-8")
    } catch {}
    return null
}
// @from(Ln 480990, Col 0)
async function vhq() {
    let A = await eW6();
    for (let [Y, z] of Object.entries(A)) {
        if (!z.installLocation) continue;
        try {
            await MXz(Y, z.installLocation)
        } catch (_) {
            k(`Failed to save marketplace JSON for ${Y}: ${_}`)
        }
    }
    let K = {
        ...await jXz(),
        ...A
    };
    await JXz(K)
}
// @from(Ln 481006, Col 4)
Nhq = E(() => {
    Aw();
    H1();
    g1();
    IW();
    sW6()
})
// @from(Ln 481013, Col 0)
async function Vhq() {
    let A = pI();
    k(`installPluginsForHeadless: starting${A?" (zip cache mode)":""}`);
    let q = await KW1();
    if (q) QI(), XZ("headlessPluginInstall: seed marketplaces registered");
    if (A) await $1().mkdir(l_4()), await $1().mkdir(i_4());
    let K = Object.keys(_e()).length,
        [Y, z] = await Promise.all([sU8(), EL1()]),
        _ = Y.filter(($) => !z.includes($)),
        w = {
            extra_marketplaces_installed: 0,
            delisted_count: 0
        },
        O = q;
    try {
        if (K === 0 && _.length === 0) k("installPluginsForHeadless: no missing plugins or marketplaces configured");
        if (K > 0 || _.length > 0) {
            if (_.length > 0) {
                if ((await HJ6("headless_official_marketplace_install", () => $I1())).installed) QI(), XZ("headlessPluginInstall: official marketplace installed"), O = !0
            }
            let H = await HJ6("headless_extra_marketplace_install", () => HI1({
                    skip: A ? (J, M) => !t_4(M) : void 0,
                    onProgress: (J) => {
                        if (J.type === "installed") k(`installPluginsForHeadless: installed extra marketplace ${J.name}`);
                        else if (J.type === "failed") k(`installPluginsForHeadless: failed to install extra marketplace ${J.name}: ${J.error}`)
                    }
                }), (J) => ({
                    installed_count: J.installed.length,
                    updated_count: J.updated.length,
                    failed_count: J.failed.length
                })),
                j = H.installed.length + H.updated.length;
            if (j > 0) QI(), XZ("headlessPluginInstall: marketplaces reconciled"), O = !0;
            w.extra_marketplaces_installed = j
        }
        if (A) await vhq();
        let $ = await FL1();
        if (w.delisted_count = $.length, $.length > 0) O = !0;
        if (O) XZ("headlessPluginInstall: plugins changed");
        if (A) E4(r_4);
        return O
    } catch ($) {
        return _6($), !1
    } finally {
        d("tengu_headless_plugin_install", w)
    }
}
// @from(Ln 481060, Col 4)
khq = E(() => {
    SA();
    ws8();
    __6();
    $s8();
    Aw();
    pL1();
    tH();
    H1();
    u_();
    k1();
    V1();
    sW6();
    Nhq();
    KY()
})
// @from(Ln 481087, Col 0)
function Ya6(A) {
    return yhq(A ?? qY(), ZXz)
}