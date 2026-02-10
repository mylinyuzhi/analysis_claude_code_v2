
// @from(Ln 206973, Col 0)
class Hb1 {
    constructor(A) {
        if (this._options = A, this._requestMessageId = 0, this._requestHandlers = new Map, this._requestHandlerAbortControllers = new Map, this._notificationHandlers = new Map, this._responseHandlers = new Map, this._progressHandlers = new Map, this._timeoutInfo = new Map, this._pendingDebouncedNotifications = new Set, this._taskProgressTokens = new Map, this._requestResolvers = new Map, this.setNotificationHandler(iw6, (q) => {
                this._oncancel(q)
            }), this.setNotificationHandler(ow6, (q) => {
                this._onprogress(q)
            }), this.setRequestHandler(rw6, (q) => ({})), this._taskStore = A === null || A === void 0 ? void 0 : A.taskStore, this._taskMessageQueue = A === null || A === void 0 ? void 0 : A.taskMessageQueue, this._taskStore) this.setRequestHandler(aw6, async (q, K) => {
            let Y = await this._taskStore.getTask(q.params.taskId, K.sessionId);
            if (!Y) throw new Eq(VK.InvalidParams, "Failed to retrieve task: Task not found");
            return {
                ...Y
            }
        }), this.setRequestHandler(tw6, async (q, K) => {
            let Y = async () => {
                var z;
                let w = q.params.taskId;
                if (this._taskMessageQueue) {
                    let $;
                    while ($ = await this._taskMessageQueue.dequeue(w, K.sessionId)) {
                        if ($.type === "response" || $.type === "error") {
                            let O = $.message,
                                _ = O.id,
                                J = this._requestResolvers.get(_);
                            if (J)
                                if (this._requestResolvers.delete(_), $.type === "response") J(O);
                                else {
                                    let X = O,
                                        D = new Eq(X.error.code, X.error.message, X.error.data);
                                    J(D)
                                }
                            else {
                                let X = $.type === "response" ? "Response" : "Error";
                                this._onerror(Error(`${X} handler missing for request ${_}`))
                            }
                            continue
                        }
                        await ((z = this._transport) === null || z === void 0 ? void 0 : z.send($.message, {
                            relatedRequestId: K.requestId
                        }))
                    }
                }
                let H = await this._taskStore.getTask(w, K.sessionId);
                if (!H) throw new Eq(VK.InvalidParams, `Task not found: ${w}`);
                if (!so(H.status)) return await this._waitForTaskUpdate(w, K.signal), await Y();
                if (so(H.status)) {
                    let $ = await this._taskStore.getTaskResult(w, K.sessionId);
                    return this._clearTaskQueue(w), {
                        ...$,
                        _meta: {
                            ...$._meta,
                            [ZB]: {
                                taskId: w
                            }
                        }
                    }
                }
                return await Y()
            };
            return await Y()
        }), this.setRequestHandler(ew6, async (q, K) => {
            var Y;
            try {
                let {
                    tasks: z,
                    nextCursor: w
                } = await this._taskStore.listTasks((Y = q.params) === null || Y === void 0 ? void 0 : Y.cursor, K.sessionId);
                return {
                    tasks: z,
                    nextCursor: w,
                    _meta: {}
                }
            } catch (z) {
                throw new Eq(VK.InvalidParams, `Failed to list tasks: ${z instanceof Error?z.message:String(z)}`)
            }
        }), this.setRequestHandler(rR7, async (q, K) => {
            try {
                let Y = await this._taskStore.getTask(q.params.taskId, K.sessionId);
                if (!Y) throw new Eq(VK.InvalidParams, `Task not found: ${q.params.taskId}`);
                if (so(Y.status)) throw new Eq(VK.InvalidParams, `Cannot cancel task in terminal status: ${Y.status}`);
                await this._taskStore.updateTaskStatus(q.params.taskId, "cancelled", "Client cancelled task execution.", K.sessionId), this._clearTaskQueue(q.params.taskId);
                let z = await this._taskStore.getTask(q.params.taskId, K.sessionId);
                if (!z) throw new Eq(VK.InvalidParams, `Task not found after cancellation: ${q.params.taskId}`);
                return {
                    _meta: {},
                    ...z
                }
            } catch (Y) {
                if (Y instanceof Eq) throw Y;
                throw new Eq(VK.InvalidRequest, `Failed to cancel task: ${Y instanceof Error?Y.message:String(Y)}`)
            }
        })
    }
    async _oncancel(A) {
        let q = this._requestHandlerAbortControllers.get(A.params.requestId);
        q === null || q === void 0 || q.abort(A.params.reason)
    }
    _setupTimeout(A, q, K, Y, z = !1) {
        this._timeoutInfo.set(A, {
            timeoutId: setTimeout(Y, q),
            startTime: Date.now(),
            timeout: q,
            maxTotalTimeout: K,
            resetTimeoutOnProgress: z,
            onTimeout: Y
        })
    }
    _resetTimeout(A) {
        let q = this._timeoutInfo.get(A);
        if (!q) return !1;
        let K = Date.now() - q.startTime;
        if (q.maxTotalTimeout && K >= q.maxTotalTimeout) throw this._timeoutInfo.delete(A), Eq.fromError(VK.RequestTimeout, "Maximum total timeout exceeded", {
            maxTotalTimeout: q.maxTotalTimeout,
            totalElapsed: K
        });
        return clearTimeout(q.timeoutId), q.timeoutId = setTimeout(q.onTimeout, q.timeout), !0
    }
    _cleanupTimeout(A) {
        let q = this._timeoutInfo.get(A);
        if (q) clearTimeout(q.timeoutId), this._timeoutInfo.delete(A)
    }
    async connect(A) {
        var q, K, Y;
        this._transport = A;
        let z = (q = this.transport) === null || q === void 0 ? void 0 : q.onclose;
        this._transport.onclose = () => {
            z === null || z === void 0 || z(), this._onclose()
        };
        let w = (K = this.transport) === null || K === void 0 ? void 0 : K.onerror;
        this._transport.onerror = ($) => {
            w === null || w === void 0 || w($), this._onerror($)
        };
        let H = (Y = this._transport) === null || Y === void 0 ? void 0 : Y.onmessage;
        this._transport.onmessage = ($, O) => {
            if (H === null || H === void 0 || H($, O), fq1($) || lR7($)) this._onresponse($);
            else if (rx1($)) this._onrequest($, O);
            else if (pR7($)) this._onnotification($);
            else this._onerror(Error(`Unknown message type: ${JSON.stringify($)}`))
        }, await this._transport.start()
    }
    _onclose() {
        var A;
        let q = this._responseHandlers;
        this._responseHandlers = new Map, this._progressHandlers.clear(), this._taskProgressTokens.clear(), this._pendingDebouncedNotifications.clear();
        let K = Eq.fromError(VK.ConnectionClosed, "Connection closed");
        this._transport = void 0, (A = this.onclose) === null || A === void 0 || A.call(this);
        for (let Y of q.values()) Y(K)
    }
    _onerror(A) {
        var q;
        (q = this.onerror) === null || q === void 0 || q.call(this, A)
    }
    _onnotification(A) {
        var q;
        let K = (q = this._notificationHandlers.get(A.method)) !== null && q !== void 0 ? q : this.fallbackNotificationHandler;
        if (K === void 0) return;
        Promise.resolve().then(() => K(A)).catch((Y) => this._onerror(Error(`Uncaught error in notification handler: ${Y}`)))
    }
    _onrequest(A, q) {
        var K, Y, z, w, H, $;
        let O = (K = this._requestHandlers.get(A.method)) !== null && K !== void 0 ? K : this.fallbackRequestHandler,
            _ = this._transport,
            J = (w = (z = (Y = A.params) === null || Y === void 0 ? void 0 : Y._meta) === null || z === void 0 ? void 0 : z[ZB]) === null || w === void 0 ? void 0 : w.taskId;
        if (O === void 0) {
            let P = {
                jsonrpc: "2.0",
                id: A.id,
                error: {
                    code: VK.MethodNotFound,
                    message: "Method not found"
                }
            };
            if (J && this._taskMessageQueue) this._enqueueTaskMessage(J, {
                type: "error",
                message: P,
                timestamp: Date.now()
            }, _ === null || _ === void 0 ? void 0 : _.sessionId).catch((W) => this._onerror(Error(`Failed to enqueue error response: ${W}`)));
            else _ === null || _ === void 0 || _.send(P).catch((W) => this._onerror(Error(`Failed to send an error response: ${W}`)));
            return
        }
        let X = new AbortController;
        this._requestHandlerAbortControllers.set(A.id, X);
        let D = (H = A.params) === null || H === void 0 ? void 0 : H.task,
            j = this._taskStore ? this.requestTaskStore(A, _ === null || _ === void 0 ? void 0 : _.sessionId) : void 0,
            M = {
                signal: X.signal,
                sessionId: _ === null || _ === void 0 ? void 0 : _.sessionId,
                _meta: ($ = A.params) === null || $ === void 0 ? void 0 : $._meta,
                sendNotification: async (P) => {
                    let W = {
                        relatedRequestId: A.id
                    };
                    if (J) W.relatedTask = {
                        taskId: J
                    };
                    await this.notification(P, W)
                },
                sendRequest: async (P, W, G) => {
                    var f, Z;
                    let N = {
                        ...G,
                        relatedRequestId: A.id
                    };
                    if (J && !N.relatedTask) N.relatedTask = {
                        taskId: J
                    };
                    let T = (Z = (f = N.relatedTask) === null || f === void 0 ? void 0 : f.taskId) !== null && Z !== void 0 ? Z : J;
                    if (T && j) await j.updateTaskStatus(T, "input_required");
                    return await this.request(P, W, N)
                },
                authInfo: q === null || q === void 0 ? void 0 : q.authInfo,
                requestId: A.id,
                requestInfo: q === null || q === void 0 ? void 0 : q.requestInfo,
                taskId: J,
                taskStore: j,
                taskRequestedTtl: D === null || D === void 0 ? void 0 : D.ttl,
                closeSSEStream: q === null || q === void 0 ? void 0 : q.closeSSEStream,
                closeStandaloneSSEStream: q === null || q === void 0 ? void 0 : q.closeStandaloneSSEStream
            };
        Promise.resolve().then(() => {
            if (D) this.assertTaskHandlerCapability(A.method)
        }).then(() => O(A, M)).then(async (P) => {
            if (X.signal.aborted) return;
            let W = {
                result: P,
                jsonrpc: "2.0",
                id: A.id
            };
            if (J && this._taskMessageQueue) await this._enqueueTaskMessage(J, {
                type: "response",
                message: W,
                timestamp: Date.now()
            }, _ === null || _ === void 0 ? void 0 : _.sessionId);
            else await (_ === null || _ === void 0 ? void 0 : _.send(W))
        }, async (P) => {
            var W;
            if (X.signal.aborted) return;
            let G = {
                jsonrpc: "2.0",
                id: A.id,
                error: {
                    code: Number.isSafeInteger(P.code) ? P.code : VK.InternalError,
                    message: (W = P.message) !== null && W !== void 0 ? W : "Internal error",
                    ...P.data !== void 0 && {
                        data: P.data
                    }
                }
            };
            if (J && this._taskMessageQueue) await this._enqueueTaskMessage(J, {
                type: "error",
                message: G,
                timestamp: Date.now()
            }, _ === null || _ === void 0 ? void 0 : _.sessionId);
            else await (_ === null || _ === void 0 ? void 0 : _.send(G))
        }).catch((P) => this._onerror(Error(`Failed to send response: ${P}`))).finally(() => {
            this._requestHandlerAbortControllers.delete(A.id)
        })
    }
    _onprogress(A) {
        let {
            progressToken: q,
            ...K
        } = A.params, Y = Number(q), z = this._progressHandlers.get(Y);
        if (!z) {
            this._onerror(Error(`Received a progress notification for an unknown token: ${JSON.stringify(A)}`));
            return
        }
        let w = this._responseHandlers.get(Y),
            H = this._timeoutInfo.get(Y);
        if (H && w && H.resetTimeoutOnProgress) try {
            this._resetTimeout(Y)
        } catch ($) {
            this._responseHandlers.delete(Y), this._progressHandlers.delete(Y), this._cleanupTimeout(Y), w($);
            return
        }
        z(K)
    }
    _onresponse(A) {
        let q = Number(A.id),
            K = this._requestResolvers.get(q);
        if (K) {
            if (this._requestResolvers.delete(q), fq1(A)) K(A);
            else {
                let w = new Eq(A.error.code, A.error.message, A.error.data);
                K(w)
            }
            return
        }
        let Y = this._responseHandlers.get(q);
        if (Y === void 0) {
            this._onerror(Error(`Received a response for an unknown message ID: ${JSON.stringify(A)}`));
            return
        }
        this._responseHandlers.delete(q), this._cleanupTimeout(q);
        let z = !1;
        if (fq1(A) && A.result && typeof A.result === "object") {
            let w = A.result;
            if (w.task && typeof w.task === "object") {
                let H = w.task;
                if (typeof H.taskId === "string") z = !0, this._taskProgressTokens.set(H.taskId, q)
            }
        }
        if (!z) this._progressHandlers.delete(q);
        if (fq1(A)) Y(A);
        else {
            let w = Eq.fromError(A.error.code, A.error.message, A.error.data);
            Y(w)
        }
    }
    get transport() {
        return this._transport
    }
    async close() {
        var A;
        await ((A = this._transport) === null || A === void 0 ? void 0 : A.close())
    }
    async * requestStream(A, q, K) {
        var Y, z, w, H;
        let {
            task: $
        } = K !== null && K !== void 0 ? K : {};
        if (!$) {
            try {
                yield {
                    type: "result",
                    result: await this.request(A, q, K)
                }
            } catch (_) {
                yield {
                    type: "error",
                    error: _ instanceof Eq ? _ : new Eq(VK.InternalError, String(_))
                }
            }
            return
        }
        let O;
        try {
            let _ = await this.request(A, $p, K);
            if (_.task) O = _.task.taskId, yield {
                type: "taskCreated",
                task: _.task
            };
            else throw new Eq(VK.InternalError, "Task creation did not return a task");
            while (!0) {
                let J = await this.getTask({
                    taskId: O
                }, K);
                if (yield {
                        type: "taskStatus",
                        task: J
                    }, so(J.status)) {
                    if (J.status === "completed") yield {
                        type: "result",
                        result: await this.getTaskResult({
                            taskId: O
                        }, q, K)
                    };
                    else if (J.status === "failed") yield {
                        type: "error",
                        error: new Eq(VK.InternalError, `Task ${O} failed`)
                    };
                    else if (J.status === "cancelled") yield {
                        type: "error",
                        error: new Eq(VK.InternalError, `Task ${O} was cancelled`)
                    };
                    return
                }
                if (J.status === "input_required") {
                    yield {
                        type: "result",
                        result: await this.getTaskResult({
                            taskId: O
                        }, q, K)
                    };
                    return
                }
                let X = (w = (Y = J.pollInterval) !== null && Y !== void 0 ? Y : (z = this._options) === null || z === void 0 ? void 0 : z.defaultTaskPollInterval) !== null && w !== void 0 ? w : 1000;
                await new Promise((D) => setTimeout(D, X)), (H = K === null || K === void 0 ? void 0 : K.signal) === null || H === void 0 || H.throwIfAborted()
            }
        } catch (_) {
            yield {
                type: "error",
                error: _ instanceof Eq ? _ : new Eq(VK.InternalError, String(_))
            }
        }
    }
    request(A, q, K) {
        let {
            relatedRequestId: Y,
            resumptionToken: z,
            onresumptiontoken: w,
            task: H,
            relatedTask: $
        } = K !== null && K !== void 0 ? K : {};
        return new Promise((O, _) => {
            var J, X, D, j, M, P, W;
            let G = (B) => {
                _(B)
            };
            if (!this._transport) {
                G(Error("Not connected"));
                return
            }
            if (((J = this._options) === null || J === void 0 ? void 0 : J.enforceStrictCapabilities) === !0) try {
                if (this.assertCapabilityForMethod(A.method), H) this.assertTaskCapability(A.method)
            } catch (B) {
                G(B);
                return
            }(X = K === null || K === void 0 ? void 0 : K.signal) === null || X === void 0 || X.throwIfAborted();
            let f = this._requestMessageId++,
                Z = {
                    ...A,
                    jsonrpc: "2.0",
                    id: f
                };
            if (K === null || K === void 0 ? void 0 : K.onprogress) this._progressHandlers.set(f, K.onprogress), Z.params = {
                ...A.params,
                _meta: {
                    ...((D = A.params) === null || D === void 0 ? void 0 : D._meta) || {},
                    progressToken: f
                }
            };
            if (H) Z.params = {
                ...Z.params,
                task: H
            };
            if ($) Z.params = {
                ...Z.params,
                _meta: {
                    ...((j = Z.params) === null || j === void 0 ? void 0 : j._meta) || {},
                    [ZB]: $
                }
            };
            let N = (B) => {
                var S;
                this._responseHandlers.delete(f), this._progressHandlers.delete(f), this._cleanupTimeout(f), (S = this._transport) === null || S === void 0 || S.send({
                    jsonrpc: "2.0",
                    method: "notifications/cancelled",
                    params: {
                        requestId: f,
                        reason: String(B)
                    }
                }, {
                    relatedRequestId: Y,
                    resumptionToken: z,
                    onresumptiontoken: w
                }).catch((b) => this._onerror(Error(`Failed to send cancellation: ${b}`)));
                let m = B instanceof Eq ? B : new Eq(VK.RequestTimeout, String(B));
                _(m)
            };
            this._responseHandlers.set(f, (B) => {
                var S;
                if ((S = K === null || K === void 0 ? void 0 : K.signal) === null || S === void 0 ? void 0 : S.aborted) return;
                if (B instanceof Error) return _(B);
                try {
                    let m = GZ(q, B.result);
                    if (!m.success) _(m.error);
                    else O(m.data)
                } catch (m) {
                    _(m)
                }
            }), (M = K === null || K === void 0 ? void 0 : K.signal) === null || M === void 0 || M.addEventListener("abort", () => {
                var B;
                N((B = K === null || K === void 0 ? void 0 : K.signal) === null || B === void 0 ? void 0 : B.reason)
            });
            let T = (P = K === null || K === void 0 ? void 0 : K.timeout) !== null && P !== void 0 ? P : tY9,
                k = () => N(Eq.fromError(VK.RequestTimeout, "Request timed out", {
                    timeout: T
                }));
            this._setupTimeout(f, T, K === null || K === void 0 ? void 0 : K.maxTotalTimeout, k, (W = K === null || K === void 0 ? void 0 : K.resetTimeoutOnProgress) !== null && W !== void 0 ? W : !1);
            let y = $ === null || $ === void 0 ? void 0 : $.taskId;
            if (y) {
                let B = (S) => {
                    let m = this._responseHandlers.get(f);
                    if (m) m(S);
                    else this._onerror(Error(`Response handler missing for side-channeled request ${f}`))
                };
                this._requestResolvers.set(f, B), this._enqueueTaskMessage(y, {
                    type: "request",
                    message: Z,
                    timestamp: Date.now()
                }).catch((S) => {
                    this._cleanupTimeout(f), _(S)
                })
            } else this._transport.send(Z, {
                relatedRequestId: Y,
                resumptionToken: z,
                onresumptiontoken: w
            }).catch((B) => {
                this._cleanupTimeout(f), _(B)
            })
        })
    }
    async getTask(A, q) {
        return this.request({
            method: "tasks/get",
            params: A
        }, sw6, q)
    }
    async getTaskResult(A, q, K) {
        return this.request({
            method: "tasks/result",
            params: A
        }, q, K)
    }
    async listTasks(A, q) {
        return this.request({
            method: "tasks/list",
            params: A
        }, AH6, q)
    }
    async cancelTask(A, q) {
        return this.request({
            method: "tasks/cancel",
            params: A
        }, oR7, q)
    }
    async notification(A, q) {
        var K, Y, z, w, H;
        if (!this._transport) throw Error("Not connected");
        this.assertNotificationCapability(A.method);
        let $ = (K = q === null || q === void 0 ? void 0 : q.relatedTask) === null || K === void 0 ? void 0 : K.taskId;
        if ($) {
            let X = {
                ...A,
                jsonrpc: "2.0",
                params: {
                    ...A.params,
                    _meta: {
                        ...((Y = A.params) === null || Y === void 0 ? void 0 : Y._meta) || {},
                        [ZB]: q.relatedTask
                    }
                }
            };
            await this._enqueueTaskMessage($, {
                type: "notification",
                message: X,
                timestamp: Date.now()
            });
            return
        }
        if (((w = (z = this._options) === null || z === void 0 ? void 0 : z.debouncedNotificationMethods) !== null && w !== void 0 ? w : []).includes(A.method) && !A.params && !(q === null || q === void 0 ? void 0 : q.relatedRequestId) && !(q === null || q === void 0 ? void 0 : q.relatedTask)) {
            if (this._pendingDebouncedNotifications.has(A.method)) return;
            this._pendingDebouncedNotifications.add(A.method), Promise.resolve().then(() => {
                var X, D;
                if (this._pendingDebouncedNotifications.delete(A.method), !this._transport) return;
                let j = {
                    ...A,
                    jsonrpc: "2.0"
                };
                if (q === null || q === void 0 ? void 0 : q.relatedTask) j = {
                    ...j,
                    params: {
                        ...j.params,
                        _meta: {
                            ...((X = j.params) === null || X === void 0 ? void 0 : X._meta) || {},
                            [ZB]: q.relatedTask
                        }
                    }
                };
                (D = this._transport) === null || D === void 0 || D.send(j, q).catch((M) => this._onerror(M))
            });
            return
        }
        let J = {
            ...A,
            jsonrpc: "2.0"
        };
        if (q === null || q === void 0 ? void 0 : q.relatedTask) J = {
            ...J,
            params: {
                ...J.params,
                _meta: {
                    ...((H = J.params) === null || H === void 0 ? void 0 : H._meta) || {},
                    [ZB]: q.relatedTask
                }
            }
        };
        await this._transport.send(J, q)
    }
    setRequestHandler(A, q) {
        let K = v_A(A);
        this.assertRequestHandlerCapability(K), this._requestHandlers.set(K, (Y, z) => {
            let w = E_A(A, Y);
            return Promise.resolve(q(w, z))
        })
    }
    removeRequestHandler(A) {
        this._requestHandlers.delete(A)
    }
    assertCanSetRequestHandler(A) {
        if (this._requestHandlers.has(A)) throw Error(`A request handler for ${A} already exists, which would be overridden`)
    }
    setNotificationHandler(A, q) {
        let K = v_A(A);
        this._notificationHandlers.set(K, (Y) => {
            let z = E_A(A, Y);
            return Promise.resolve(q(z))
        })
    }
    removeNotificationHandler(A) {
        this._notificationHandlers.delete(A)
    }
    _cleanupTaskProgressHandler(A) {
        let q = this._taskProgressTokens.get(A);
        if (q !== void 0) this._progressHandlers.delete(q), this._taskProgressTokens.delete(A)
    }
    async _enqueueTaskMessage(A, q, K) {
        var Y;
        if (!this._taskStore || !this._taskMessageQueue) throw Error("Cannot enqueue task message: taskStore and taskMessageQueue are not configured");
        let z = (Y = this._options) === null || Y === void 0 ? void 0 : Y.maxTaskQueueSize;
        await this._taskMessageQueue.enqueue(A, q, K, z)
    }
    async _clearTaskQueue(A, q) {
        if (this._taskMessageQueue) {
            let K = await this._taskMessageQueue.dequeueAll(A, q);
            for (let Y of K)
                if (Y.type === "request" && rx1(Y.message)) {
                    let z = Y.message.id,
                        w = this._requestResolvers.get(z);
                    if (w) w(new Eq(VK.InternalError, "Task cancelled or completed")), this._requestResolvers.delete(z);
                    else this._onerror(Error(`Resolver missing for request ${z} during task ${A} cleanup`))
                }
        }
    }
    async _waitForTaskUpdate(A, q) {
        var K, Y, z;
        let w = (Y = (K = this._options) === null || K === void 0 ? void 0 : K.defaultTaskPollInterval) !== null && Y !== void 0 ? Y : 1000;
        try {
            let H = await ((z = this._taskStore) === null || z === void 0 ? void 0 : z.getTask(A));
            if (H === null || H === void 0 ? void 0 : H.pollInterval) w = H.pollInterval
        } catch (H) {}
        return new Promise((H, $) => {
            if (q.aborted) {
                $(new Eq(VK.InvalidRequest, "Request cancelled"));
                return
            }
            let O = setTimeout(H, w);
            q.addEventListener("abort", () => {
                clearTimeout(O), $(new Eq(VK.InvalidRequest, "Request cancelled"))
            }, {
                once: !0
            })
        })
    }
    requestTaskStore(A, q) {
        let K = this._taskStore;
        if (!K) throw Error("No task store configured");
        return {
            createTask: async (Y) => {
                if (!A) throw Error("No request provided");
                return await K.createTask(Y, A.id, {
                    method: A.method,
                    params: A.params
                }, q)
            },
            getTask: async (Y) => {
                let z = await K.getTask(Y, q);
                if (!z) throw new Eq(VK.InvalidParams, "Failed to retrieve task: Task not found");
                return z
            },
            storeTaskResult: async (Y, z, w) => {
                await K.storeTaskResult(Y, z, w, q);
                let H = await K.getTask(Y, q);
                if (H) {
                    let $ = ex1.parse({
                        method: "notifications/tasks/status",
                        params: H
                    });
                    if (await this.notification($), so(H.status)) this._cleanupTaskProgressHandler(Y)
                }
            },
            getTaskResult: (Y) => {
                return K.getTaskResult(Y, q)
            },
            updateTaskStatus: async (Y, z, w) => {
                let H = await K.getTask(Y, q);
                if (!H) throw new Eq(VK.InvalidParams, `Task "${Y}" not found - it may have been cleaned up`);
                if (so(H.status)) throw new Eq(VK.InvalidParams, `Cannot update task "${Y}" from terminal status "${H.status}" to "${z}". Terminal states (completed, failed, cancelled) cannot transition to other states.`);
                await K.updateTaskStatus(Y, z, w, q);
                let $ = await K.getTask(Y, q);
                if ($) {
                    let O = ex1.parse({
                        method: "notifications/tasks/status",
                        params: $
                    });
                    if (await this.notification(O), so($.status)) this._cleanupTaskProgressHandler(Y)
                }
            },
            listTasks: (Y) => {
                return K.listTasks(Y, q)
            }
        }
    }
}
// @from(Ln 207668, Col 0)
function wy7(A) {
    return A !== null && typeof A === "object" && !Array.isArray(A)
}
// @from(Ln 207672, Col 0)
function HH6(A, q) {
    let K = {
        ...A
    };
    for (let Y in q) {
        let z = Y,
            w = q[z];
        if (w === void 0) continue;
        let H = K[z];
        if (wy7(H) && wy7(w)) K[z] = {
            ...H,
            ...w
        };
        else K[z] = w
    }
    return K
}
// @from(Ln 207689, Col 4)
tY9 = 60000
// @from(Ln 207690, Col 4)
k_A = v(() => {
    nx1();
    gD();
    zy7()
})
// @from(Ln 207695, Col 4)
Ob1 = R((Oy7) => {
    Object.defineProperty(Oy7, "__esModule", {
        value: !0
    });
    Oy7.regexpCode = Oy7.getEsmExportName = Oy7.getProperty = Oy7.safeStringify = Oy7.stringify = Oy7.strConcat = Oy7.addCodeArg = Oy7.str = Oy7._ = Oy7.nil = Oy7._Code = Oy7.Name = Oy7.IDENTIFIER = Oy7._CodeOrName = void 0;
    class $H6 {}
    Oy7._CodeOrName = $H6;
    Oy7.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class P01 extends $H6 {
        constructor(A) {
            super();
            if (!Oy7.IDENTIFIER.test(A)) throw Error("CodeGen: name must be a valid identifier");
            this.str = A
        }
        toString() {
            return this.str
        }
        emptyStr() {
            return !1
        }
        get names() {
            return {
                [this.str]: 1
            }
        }
    }
    Oy7.Name = P01;
    class qh extends $H6 {
        constructor(A) {
            super();
            this._items = typeof A === "string" ? [A] : A
        }
        toString() {
            return this.str
        }
        emptyStr() {
            if (this._items.length > 1) return !1;
            let A = this._items[0];
            return A === "" || A === '""'
        }
        get str() {
            var A;
            return (A = this._str) !== null && A !== void 0 ? A : this._str = this._items.reduce((q, K) => `${q}${K}`, "")
        }
        get names() {
            var A;
            return (A = this._names) !== null && A !== void 0 ? A : this._names = this._items.reduce((q, K) => {
                if (K instanceof P01) q[K.str] = (q[K.str] || 0) + 1;
                return q
            }, {})
        }
    }
    Oy7._Code = qh;
    Oy7.nil = new qh("");

    function Hy7(A, ...q) {
        let K = [A[0]],
            Y = 0;
        while (Y < q.length) R_A(K, q[Y]), K.push(A[++Y]);
        return new qh(K)
    }
    Oy7._ = Hy7;
    var L_A = new qh("+");

    function $y7(A, ...q) {
        let K = [$b1(A[0])],
            Y = 0;
        while (Y < q.length) K.push(L_A), R_A(K, q[Y]), K.push(L_A, $b1(A[++Y]));
        return eY9(K), new qh(K)
    }
    Oy7.str = $y7;

    function R_A(A, q) {
        if (q instanceof qh) A.push(...q._items);
        else if (q instanceof P01) A.push(q);
        else A.push(Kz9(q))
    }
    Oy7.addCodeArg = R_A;

    function eY9(A) {
        let q = 1;
        while (q < A.length - 1) {
            if (A[q] === L_A) {
                let K = Az9(A[q - 1], A[q + 1]);
                if (K !== void 0) {
                    A.splice(q - 1, 3, K);
                    continue
                }
                A[q++] = "+"
            }
            q++
        }
    }

    function Az9(A, q) {
        if (q === '""') return A;
        if (A === '""') return q;
        if (typeof A == "string") {
            if (q instanceof P01 || A[A.length - 1] !== '"') return;
            if (typeof q != "string") return `${A.slice(0,-1)}${q}"`;
            if (q[0] === '"') return A.slice(0, -1) + q.slice(1);
            return
        }
        if (typeof q == "string" && q[0] === '"' && !(A instanceof P01)) return `"${A}${q.slice(1)}`;
        return
    }

    function qz9(A, q) {
        return q.emptyStr() ? A : A.emptyStr() ? q : $y7`${A}${q}`
    }
    Oy7.strConcat = qz9;

    function Kz9(A) {
        return typeof A == "number" || typeof A == "boolean" || A === null ? A : $b1(Array.isArray(A) ? A.join(",") : A)
    }

    function Yz9(A) {
        return new qh($b1(A))
    }
    Oy7.stringify = Yz9;

    function $b1(A) {
        return JSON.stringify(A).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")
    }
    Oy7.safeStringify = $b1;

    function zz9(A) {
        return typeof A == "string" && Oy7.IDENTIFIER.test(A) ? new qh(`.${A}`) : Hy7`[${A}]`
    }
    Oy7.getProperty = zz9;

    function wz9(A) {
        if (typeof A == "string" && Oy7.IDENTIFIER.test(A)) return new qh(`${A}`);
        throw Error(`CodeGen: invalid export name: ${A}, use explicit $id name mapping`)
    }
    Oy7.getEsmExportName = wz9;

    function Hz9(A) {
        return new qh(A.toString())
    }
    Oy7.regexpCode = Hz9
})
// @from(Ln 207837, Col 4)
h_A = R((Dy7) => {
    Object.defineProperty(Dy7, "__esModule", {
        value: !0
    });
    Dy7.ValueScope = Dy7.ValueScopeName = Dy7.Scope = Dy7.varKinds = Dy7.UsedValueState = void 0;
    var gV = Ob1();
    class Jy7 extends Error {
        constructor(A) {
            super(`CodeGen: "code" for ${A} not defined`);
            this.value = A.value
        }
    }
    var _H6;
    (function(A) {
        A[A.Started = 0] = "Started", A[A.Completed = 1] = "Completed"
    })(_H6 || (Dy7.UsedValueState = _H6 = {}));
    Dy7.varKinds = {
        const: new gV.Name("const"),
        let: new gV.Name("let"),
        var: new gV.Name("var")
    };
    class C_A {
        constructor({
            prefixes: A,
            parent: q
        } = {}) {
            this._names = {}, this._prefixes = A, this._parent = q
        }
        toName(A) {
            return A instanceof gV.Name ? A : this.name(A)
        }
        name(A) {
            return new gV.Name(this._newName(A))
        }
        _newName(A) {
            let q = this._names[A] || this._nameGroup(A);
            return `${A}${q.index++}`
        }
        _nameGroup(A) {
            var q, K;
            if (((K = (q = this._parent) === null || q === void 0 ? void 0 : q._prefixes) === null || K === void 0 ? void 0 : K.has(A)) || this._prefixes && !this._prefixes.has(A)) throw Error(`CodeGen: prefix "${A}" is not allowed in this scope`);
            return this._names[A] = {
                prefix: A,
                index: 0
            }
        }
    }
    Dy7.Scope = C_A;
    class S_A extends gV.Name {
        constructor(A, q) {
            super(q);
            this.prefix = A
        }
        setValue(A, {
            property: q,
            itemIndex: K
        }) {
            this.value = A, this.scopePath = gV._`.${new gV.Name(q)}[${K}]`
        }
    }
    Dy7.ValueScopeName = S_A;
    var fz9 = gV._`\n`;
    class Xy7 extends C_A {
        constructor(A) {
            super(A);
            this._values = {}, this._scope = A.scope, this.opts = {
                ...A,
                _n: A.lines ? fz9 : gV.nil
            }
        }
        get() {
            return this._scope
        }
        name(A) {
            return new S_A(A, this._newName(A))
        }
        value(A, q) {
            var K;
            if (q.ref === void 0) throw Error("CodeGen: ref must be passed in value");
            let Y = this.toName(A),
                {
                    prefix: z
                } = Y,
                w = (K = q.key) !== null && K !== void 0 ? K : q.ref,
                H = this._values[z];
            if (H) {
                let _ = H.get(w);
                if (_) return _
            } else H = this._values[z] = new Map;
            H.set(w, Y);
            let $ = this._scope[z] || (this._scope[z] = []),
                O = $.length;
            return $[O] = q.ref, Y.setValue(q, {
                property: z,
                itemIndex: O
            }), Y
        }
        getValue(A, q) {
            let K = this._values[A];
            if (!K) return;
            return K.get(q)
        }
        scopeRefs(A, q = this._values) {
            return this._reduceValues(q, (K) => {
                if (K.scopePath === void 0) throw Error(`CodeGen: name "${K}" has no value`);
                return gV._`${A}${K.scopePath}`
            })
        }
        scopeCode(A = this._values, q, K) {
            return this._reduceValues(A, (Y) => {
                if (Y.value === void 0) throw Error(`CodeGen: name "${Y}" has no value`);
                return Y.value.code
            }, q, K)
        }
        _reduceValues(A, q, K = {}, Y) {
            let z = gV.nil;
            for (let w in A) {
                let H = A[w];
                if (!H) continue;
                let $ = K[w] = K[w] || new Map;
                H.forEach((O) => {
                    if ($.has(O)) return;
                    $.set(O, _H6.Started);
                    let _ = q(O);
                    if (_) {
                        let J = this.opts.es5 ? Dy7.varKinds.var : Dy7.varKinds.const;
                        z = gV._`${z}${J} ${O} = ${_};${this.opts._n}`
                    } else if (_ = Y === null || Y === void 0 ? void 0 : Y(O)) z = gV._`${z}${_}${this.opts._n}`;
                    else throw new Jy7(O);
                    $.set(O, _H6.Completed)
                })
            }
            return z
        }
    }
    Dy7.ValueScope = Xy7
})
// @from(Ln 207974, Col 4)
p5 = R((UV) => {
    Object.defineProperty(UV, "__esModule", {
        value: !0
    });
    UV.or = UV.and = UV.not = UV.CodeGen = UV.operators = UV.varKinds = UV.ValueScopeName = UV.ValueScope = UV.Scope = UV.Name = UV.regexpCode = UV.stringify = UV.getProperty = UV.nil = UV.strConcat = UV.str = UV._ = void 0;
    var MY = Ob1(),
        Kh = h_A(),
        to = Ob1();
    Object.defineProperty(UV, "_", {
        enumerable: !0,
        get: function() {
            return to._
        }
    });
    Object.defineProperty(UV, "str", {
        enumerable: !0,
        get: function() {
            return to.str
        }
    });
    Object.defineProperty(UV, "strConcat", {
        enumerable: !0,
        get: function() {
            return to.strConcat
        }
    });
    Object.defineProperty(UV, "nil", {
        enumerable: !0,
        get: function() {
            return to.nil
        }
    });
    Object.defineProperty(UV, "getProperty", {
        enumerable: !0,
        get: function() {
            return to.getProperty
        }
    });
    Object.defineProperty(UV, "stringify", {
        enumerable: !0,
        get: function() {
            return to.stringify
        }
    });
    Object.defineProperty(UV, "regexpCode", {
        enumerable: !0,
        get: function() {
            return to.regexpCode
        }
    });
    Object.defineProperty(UV, "Name", {
        enumerable: !0,
        get: function() {
            return to.Name
        }
    });
    var PH6 = h_A();
    Object.defineProperty(UV, "Scope", {
        enumerable: !0,
        get: function() {
            return PH6.Scope
        }
    });
    Object.defineProperty(UV, "ValueScope", {
        enumerable: !0,
        get: function() {
            return PH6.ValueScope
        }
    });
    Object.defineProperty(UV, "ValueScopeName", {
        enumerable: !0,
        get: function() {
            return PH6.ValueScopeName
        }
    });
    Object.defineProperty(UV, "varKinds", {
        enumerable: !0,
        get: function() {
            return PH6.varKinds
        }
    });
    UV.operators = {
        GT: new MY._Code(">"),
        GTE: new MY._Code(">="),
        LT: new MY._Code("<"),
        LTE: new MY._Code("<="),
        EQ: new MY._Code("==="),
        NEQ: new MY._Code("!=="),
        NOT: new MY._Code("!"),
        OR: new MY._Code("||"),
        AND: new MY._Code("&&"),
        ADD: new MY._Code("+")
    };
    class eo {
        optimizeNodes() {
            return this
        }
        optimizeNames(A, q) {
            return this
        }
    }
    class My7 extends eo {
        constructor(A, q, K) {
            super();
            this.varKind = A, this.name = q, this.rhs = K
        }
        render({
            es5: A,
            _n: q
        }) {
            let K = A ? Kh.varKinds.var : this.varKind,
                Y = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
            return `${K} ${this.name}${Y};` + q
        }
        optimizeNames(A, q) {
            if (!A[this.name.str]) return;
            if (this.rhs) this.rhs = G01(this.rhs, A, q);
            return this
        }
        get names() {
            return this.rhs instanceof MY._CodeOrName ? this.rhs.names : {}
        }
    }
    class b_A extends eo {
        constructor(A, q, K) {
            super();
            this.lhs = A, this.rhs = q, this.sideEffects = K
        }
        render({
            _n: A
        }) {
            return `${this.lhs} = ${this.rhs};` + A
        }
        optimizeNames(A, q) {
            if (this.lhs instanceof MY.Name && !A[this.lhs.str] && !this.sideEffects) return;
            return this.rhs = G01(this.rhs, A, q), this
        }
        get names() {
            let A = this.lhs instanceof MY.Name ? {} : {
                ...this.lhs.names
            };
            return MH6(A, this.rhs)
        }
    }
    class Py7 extends b_A {
        constructor(A, q, K, Y) {
            super(A, K, Y);
            this.op = q
        }
        render({
            _n: A
        }) {
            return `${this.lhs} ${this.op}= ${this.rhs};` + A
        }
    }
    class Wy7 extends eo {
        constructor(A) {
            super();
            this.label = A, this.names = {}
        }
        render({
            _n: A
        }) {
            return `${this.label}:` + A
        }
    }
    class Gy7 extends eo {
        constructor(A) {
            super();
            this.label = A, this.names = {}
        }
        render({
            _n: A
        }) {
            return `break${this.label?` ${this.label}`:""};` + A
        }
    }
    class Zy7 extends eo {
        constructor(A) {
            super();
            this.error = A
        }
        render({
            _n: A
        }) {
            return `throw ${this.error};` + A
        }
        get names() {
            return this.error.names
        }
    }
    class fy7 extends eo {
        constructor(A) {
            super();
            this.code = A
        }
        render({
            _n: A
        }) {
            return `${this.code};` + A
        }
        optimizeNodes() {
            return `${this.code}` ? this : void 0
        }
        optimizeNames(A, q) {
            return this.code = G01(this.code, A, q), this
        }
        get names() {
            return this.code instanceof MY._CodeOrName ? this.code.names : {}
        }
    }
    class WH6 extends eo {
        constructor(A = []) {
            super();
            this.nodes = A
        }
        render(A) {
            return this.nodes.reduce((q, K) => q + K.render(A), "")
        }
        optimizeNodes() {
            let {
                nodes: A
            } = this, q = A.length;
            while (q--) {
                let K = A[q].optimizeNodes();
                if (Array.isArray(K)) A.splice(q, 1, ...K);
                else if (K) A[q] = K;
                else A.splice(q, 1)
            }
            return A.length > 0 ? this : void 0
        }
        optimizeNames(A, q) {
            let {
                nodes: K
            } = this, Y = K.length;
            while (Y--) {
                let z = K[Y];
                if (z.optimizeNames(A, q)) continue;
                vz9(A, z.names), K.splice(Y, 1)
            }
            return K.length > 0 ? this : void 0
        }
        get names() {
            return this.nodes.reduce((A, q) => Eq1(A, q.names), {})
        }
    }
    class Aa extends WH6 {
        render(A) {
            return "{" + A._n + super.render(A) + "}" + A._n
        }
    }
    class Vy7 extends WH6 {}
    class _b1 extends Aa {}
    _b1.kind = "else";
    class _p extends Aa {
        constructor(A, q) {
            super(q);
            this.condition = A
        }
        render(A) {
            let q = `if(${this.condition})` + super.render(A);
            if (this.else) q += "else " + this.else.render(A);
            return q
        }
        optimizeNodes() {
            super.optimizeNodes();
            let A = this.condition;
            if (A === !0) return this.nodes;
            let q = this.else;
            if (q) {
                let K = q.optimizeNodes();
                q = this.else = Array.isArray(K) ? new _b1(K) : K
            }
            if (q) {
                if (A === !1) return q instanceof _p ? q : q.nodes;
                if (this.nodes.length) return this;
                return new _p(ky7(A), q instanceof _p ? [q] : q.nodes)
            }
            if (A === !1 || !this.nodes.length) return;
            return this
        }
        optimizeNames(A, q) {
            var K;
            if (this.else = (K = this.else) === null || K === void 0 ? void 0 : K.optimizeNames(A, q), !(super.optimizeNames(A, q) || this.else)) return;
            return this.condition = G01(this.condition, A, q), this
        }
        get names() {
            let A = super.names;
            if (MH6(A, this.condition), this.else) Eq1(A, this.else.names);
            return A
        }
    }
    _p.kind = "if";
    class W01 extends Aa {}
    W01.kind = "for";
    class Ny7 extends W01 {
        constructor(A) {
            super();
            this.iteration = A
        }
        render(A) {
            return `for(${this.iteration})` + super.render(A)
        }
        optimizeNames(A, q) {
            if (!super.optimizeNames(A, q)) return;
            return this.iteration = G01(this.iteration, A, q), this
        }
        get names() {
            return Eq1(super.names, this.iteration.names)
        }
    }
    class Ty7 extends W01 {
        constructor(A, q, K, Y) {
            super();
            this.varKind = A, this.name = q, this.from = K, this.to = Y
        }
        render(A) {
            let q = A.es5 ? Kh.varKinds.var : this.varKind,
                {
                    name: K,
                    from: Y,
                    to: z
                } = this;
            return `for(${q} ${K}=${Y}; ${K}<${z}; ${K}++)` + super.render(A)
        }
        get names() {
            let A = MH6(super.names, this.from);
            return MH6(A, this.to)
        }
    }
    class I_A extends W01 {
        constructor(A, q, K, Y) {
            super();
            this.loop = A, this.varKind = q, this.name = K, this.iterable = Y
        }
        render(A) {
            return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(A)
        }
        optimizeNames(A, q) {
            if (!super.optimizeNames(A, q)) return;
            return this.iterable = G01(this.iterable, A, q), this
        }
        get names() {
            return Eq1(super.names, this.iterable.names)
        }
    }
    class JH6 extends Aa {
        constructor(A, q, K) {
            super();
            this.name = A, this.args = q, this.async = K
        }
        render(A) {
            return `${this.async?"async ":""}function ${this.name}(${this.args})` + super.render(A)
        }
    }
    JH6.kind = "func";
    class XH6 extends WH6 {
        render(A) {
            return "return " + super.render(A)
        }
    }
    XH6.kind = "return";
    class vy7 extends Aa {
        render(A) {
            let q = "try" + super.render(A);
            if (this.catch) q += this.catch.render(A);
            if (this.finally) q += this.finally.render(A);
            return q
        }
        optimizeNodes() {
            var A, q;
            return super.optimizeNodes(), (A = this.catch) === null || A === void 0 || A.optimizeNodes(), (q = this.finally) === null || q === void 0 || q.optimizeNodes(), this
        }
        optimizeNames(A, q) {
            var K, Y;
            return super.optimizeNames(A, q), (K = this.catch) === null || K === void 0 || K.optimizeNames(A, q), (Y = this.finally) === null || Y === void 0 || Y.optimizeNames(A, q), this
        }
        get names() {
            let A = super.names;
            if (this.catch) Eq1(A, this.catch.names);
            if (this.finally) Eq1(A, this.finally.names);
            return A
        }
    }
    class DH6 extends Aa {
        constructor(A) {
            super();
            this.error = A
        }
        render(A) {
            return `catch(${this.error})` + super.render(A)
        }
    }
    DH6.kind = "catch";
    class jH6 extends Aa {
        render(A) {
            return "finally" + super.render(A)
        }
    }
    jH6.kind = "finally";
    class Ey7 {
        constructor(A, q = {}) {
            this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = {
                ...q,
                _n: q.lines ? `
` : ""
            }, this._extScope = A, this._scope = new Kh.Scope({
                parent: A
            }), this._nodes = [new Vy7]
        }
        toString() {
            return this._root.render(this.opts)
        }
        name(A) {
            return this._scope.name(A)
        }
        scopeName(A) {
            return this._extScope.name(A)
        }
        scopeValue(A, q) {
            let K = this._extScope.value(A, q);
            return (this._values[K.prefix] || (this._values[K.prefix] = new Set)).add(K), K
        }
        getScopeValue(A, q) {
            return this._extScope.getValue(A, q)
        }
        scopeRefs(A) {
            return this._extScope.scopeRefs(A, this._values)
        }
        scopeCode() {
            return this._extScope.scopeCode(this._values)
        }
        _def(A, q, K, Y) {
            let z = this._scope.toName(q);
            if (K !== void 0 && Y) this._constants[z.str] = K;
            return this._leafNode(new My7(A, z, K)), z
        }
        const (A, q, K) {
            return this._def(Kh.varKinds.const, A, q, K)
        }
        let (A, q, K) {
            return this._def(Kh.varKinds.let, A, q, K)
        }
        var (A, q, K) {
            return this._def(Kh.varKinds.var, A, q, K)
        }
        assign(A, q, K) {
            return this._leafNode(new b_A(A, q, K))
        }
        add(A, q) {
            return this._leafNode(new Py7(A, UV.operators.ADD, q))
        }
        code(A) {
            if (typeof A == "function") A();
            else if (A !== MY.nil) this._leafNode(new fy7(A));
            return this
        }
        object(...A) {
            let q = ["{"];
            for (let [K, Y] of A) {
                if (q.length > 1) q.push(",");
                if (q.push(K), K !== Y || this.opts.es5) q.push(":"), (0, MY.addCodeArg)(q, Y)
            }
            return q.push("}"), new MY._Code(q)
        }
        if (A, q, K) {
            if (this._blockNode(new _p(A)), q && K) this.code(q).else().code(K).endIf();
            else if (q) this.code(q).endIf();
            else if (K) throw Error('CodeGen: "else" body without "then" body');
            return this
        }
        elseIf(A) {
            return this._elseNode(new _p(A))
        } else() {
            return this._elseNode(new _b1)
        }
        endIf() {
            return this._endBlockNode(_p, _b1)
        }
        _for(A, q) {
            if (this._blockNode(A), q) this.code(q).endFor();
            return this
        }
        for (A, q) {
            return this._for(new Ny7(A), q)
        }
        forRange(A, q, K, Y, z = this.opts.es5 ? Kh.varKinds.var : Kh.varKinds.let) {
            let w = this._scope.toName(A);
            return this._for(new Ty7(z, w, q, K), () => Y(w))
        }
        forOf(A, q, K, Y = Kh.varKinds.const) {
            let z = this._scope.toName(A);
            if (this.opts.es5) {
                let w = q instanceof MY.Name ? q : this.var("_arr", q);
                return this.forRange("_i", 0, MY._`${w}.length`, (H) => {
                    this.var(z, MY._`${w}[${H}]`), K(z)
                })
            }
            return this._for(new I_A("of", Y, z, q), () => K(z))
        }
        forIn(A, q, K, Y = this.opts.es5 ? Kh.varKinds.var : Kh.varKinds.const) {
            if (this.opts.ownProperties) return this.forOf(A, MY._`Object.keys(${q})`, K);
            let z = this._scope.toName(A);
            return this._for(new I_A("in", Y, z, q), () => K(z))
        }
        endFor() {
            return this._endBlockNode(W01)
        }
        label(A) {
            return this._leafNode(new Wy7(A))
        }
        break (A) {
            return this._leafNode(new Gy7(A))
        }
        return (A) {
            let q = new XH6;
            if (this._blockNode(q), this.code(A), q.nodes.length !== 1) throw Error('CodeGen: "return" should have one node');
            return this._endBlockNode(XH6)
        }
        try (A, q, K) {
            if (!q && !K) throw Error('CodeGen: "try" without "catch" and "finally"');
            let Y = new vy7;
            if (this._blockNode(Y), this.code(A), q) {
                let z = this.name("e");
                this._currNode = Y.catch = new DH6(z), q(z)
            }
            if (K) this._currNode = Y.finally = new jH6, this.code(K);
            return this._endBlockNode(DH6, jH6)
        }
        throw (A) {
            return this._leafNode(new Zy7(A))
        }
        block(A, q) {
            if (this._blockStarts.push(this._nodes.length), A) this.code(A).endBlock(q);
            return this
        }
        endBlock(A) {
            let q = this._blockStarts.pop();
            if (q === void 0) throw Error("CodeGen: not in self-balancing block");
            let K = this._nodes.length - q;
            if (K < 0 || A !== void 0 && K !== A) throw Error(`CodeGen: wrong number of nodes: ${K} vs ${A} expected`);
            return this._nodes.length = q, this
        }
        func(A, q = MY.nil, K, Y) {
            if (this._blockNode(new JH6(A, q, K)), Y) this.code(Y).endFunc();
            return this
        }
        endFunc() {
            return this._endBlockNode(JH6)
        }
        optimize(A = 1) {
            while (A-- > 0) this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants)
        }
        _leafNode(A) {
            return this._currNode.nodes.push(A), this
        }
        _blockNode(A) {
            this._currNode.nodes.push(A), this._nodes.push(A)
        }
        _endBlockNode(A, q) {
            let K = this._currNode;
            if (K instanceof A || q && K instanceof q) return this._nodes.pop(), this;
            throw Error(`CodeGen: not in block "${q?`${A.kind}/${q.kind}`:A.kind}"`)
        }
        _elseNode(A) {
            let q = this._currNode;
            if (!(q instanceof _p)) throw Error('CodeGen: "else" without "if"');
            return this._currNode = q.else = A, this
        }
        get _root() {
            return this._nodes[0]
        }
        get _currNode() {
            let A = this._nodes;
            return A[A.length - 1]
        }
        set _currNode(A) {
            let q = this._nodes;
            q[q.length - 1] = A
        }
    }
    UV.CodeGen = Ey7;

    function Eq1(A, q) {
        for (let K in q) A[K] = (A[K] || 0) + (q[K] || 0);
        return A
    }

    function MH6(A, q) {
        return q instanceof MY._CodeOrName ? Eq1(A, q.names) : A
    }

    function G01(A, q, K) {
        if (A instanceof MY.Name) return Y(A);
        if (!z(A)) return A;
        return new MY._Code(A._items.reduce((w, H) => {
            if (H instanceof MY.Name) H = Y(H);
            if (H instanceof MY._Code) w.push(...H._items);
            else w.push(H);
            return w
        }, []));

        function Y(w) {
            let H = K[w.str];
            if (H === void 0 || q[w.str] !== 1) return w;
            return delete q[w.str], H
        }

        function z(w) {
            return w instanceof MY._Code && w._items.some((H) => H instanceof MY.Name && q[H.str] === 1 && K[H.str] !== void 0)
        }
    }

    function vz9(A, q) {
        for (let K in q) A[K] = (A[K] || 0) - (q[K] || 0)
    }

    function ky7(A) {
        return typeof A == "boolean" || typeof A == "number" || A === null ? !A : MY._`!${x_A(A)}`
    }
    UV.not = ky7;
    var Ez9 = Ly7(UV.operators.AND);

    function kz9(...A) {
        return A.reduce(Ez9)
    }
    UV.and = kz9;
    var Lz9 = Ly7(UV.operators.OR);

    function Rz9(...A) {
        return A.reduce(Lz9)
    }
    UV.or = Rz9;

    function Ly7(A) {
        return (q, K) => q === MY.nil ? K : K === MY.nil ? q : MY._`${x_A(q)} ${A} ${x_A(K)}`
    }

    function x_A(A) {
        return A instanceof MY.Name ? A : MY._`(${A})`
    }
})
// @from(Ln 208616, Col 4)
dY = R((uy7) => {
    Object.defineProperty(uy7, "__esModule", {
        value: !0
    });
    uy7.checkStrictMode = uy7.getErrorPath = uy7.Type = uy7.useFunc = uy7.setEvaluated = uy7.evaluatedPropsToName = uy7.mergeEvaluated = uy7.eachItem = uy7.unescapeJsonPointer = uy7.escapeJsonPointer = uy7.escapeFragment = uy7.unescapeFragment = uy7.schemaRefOrVal = uy7.schemaHasRulesButRef = uy7.schemaHasRules = uy7.checkUnknownRules = uy7.alwaysValidSchema = uy7.toHash = void 0;
    var Cw = p5(),
        hz9 = Ob1();

    function Iz9(A) {
        let q = {};
        for (let K of A) q[K] = !0;
        return q
    }
    uy7.toHash = Iz9;

    function xz9(A, q) {
        if (typeof q == "boolean") return q;
        if (Object.keys(q).length === 0) return !0;
        return Sy7(A, q), !hy7(q, A.self.RULES.all)
    }
    uy7.alwaysValidSchema = xz9;

    function Sy7(A, q = A.schema) {
        let {
            opts: K,
            self: Y
        } = A;
        if (!K.strictSchema) return;
        if (typeof q === "boolean") return;
        let z = Y.RULES.keywords;
        for (let w in q)
            if (!z[w]) by7(A, `unknown keyword: "${w}"`)
    }
    uy7.checkUnknownRules = Sy7;

    function hy7(A, q) {
        if (typeof A == "boolean") return !A;
        for (let K in A)
            if (q[K]) return !0;
        return !1
    }
    uy7.schemaHasRules = hy7;

    function bz9(A, q) {
        if (typeof A == "boolean") return !A;
        for (let K in A)
            if (K !== "$ref" && q.all[K]) return !0;
        return !1
    }
    uy7.schemaHasRulesButRef = bz9;

    function uz9({
        topSchemaRef: A,
        schemaPath: q
    }, K, Y, z) {
        if (!z) {
            if (typeof K == "number" || typeof K == "boolean") return K;
            if (typeof K == "string") return Cw._`${K}`
        }
        return Cw._`${A}${q}${(0,Cw.getProperty)(Y)}`
    }
    uy7.schemaRefOrVal = uz9;

    function Bz9(A) {
        return Iy7(decodeURIComponent(A))
    }
    uy7.unescapeFragment = Bz9;

    function mz9(A) {
        return encodeURIComponent(B_A(A))
    }
    uy7.escapeFragment = mz9;

    function B_A(A) {
        if (typeof A == "number") return `${A}`;
        return A.replace(/~/g, "~0").replace(/\//g, "~1")
    }
    uy7.escapeJsonPointer = B_A;

    function Iy7(A) {
        return A.replace(/~1/g, "/").replace(/~0/g, "~")
    }
    uy7.unescapeJsonPointer = Iy7;

    function Fz9(A, q) {
        if (Array.isArray(A))
            for (let K of A) q(K);
        else q(A)
    }
    uy7.eachItem = Fz9;

    function yy7({
        mergeNames: A,
        mergeToName: q,
        mergeValues: K,
        resultToName: Y
    }) {
        return (z, w, H, $) => {
            let O = H === void 0 ? w : H instanceof Cw.Name ? (w instanceof Cw.Name ? A(z, w, H) : q(z, w, H), H) : w instanceof Cw.Name ? (q(z, H, w), w) : K(w, H);
            return $ === Cw.Name && !(O instanceof Cw.Name) ? Y(z, O) : O
        }
    }
    uy7.mergeEvaluated = {
        props: yy7({
            mergeNames: (A, q, K) => A.if(Cw._`${K} !== true && ${q} !== undefined`, () => {
                A.if(Cw._`${q} === true`, () => A.assign(K, !0), () => A.assign(K, Cw._`${K} || {}`).code(Cw._`Object.assign(${K}, ${q})`))
            }),
            mergeToName: (A, q, K) => A.if(Cw._`${K} !== true`, () => {
                if (q === !0) A.assign(K, !0);
                else A.assign(K, Cw._`${K} || {}`), m_A(A, K, q)
            }),
            mergeValues: (A, q) => A === !0 ? !0 : {
                ...A,
                ...q
            },
            resultToName: xy7
        }),
        items: yy7({
            mergeNames: (A, q, K) => A.if(Cw._`${K} !== true && ${q} !== undefined`, () => A.assign(K, Cw._`${q} === true ? true : ${K} > ${q} ? ${K} : ${q}`)),
            mergeToName: (A, q, K) => A.if(Cw._`${K} !== true`, () => A.assign(K, q === !0 ? !0 : Cw._`${K} > ${q} ? ${K} : ${q}`)),
            mergeValues: (A, q) => A === !0 ? !0 : Math.max(A, q),
            resultToName: (A, q) => A.var("items", q)
        })
    };

    function xy7(A, q) {
        if (q === !0) return A.var("props", !0);
        let K = A.var("props", Cw._`{}`);
        if (q !== void 0) m_A(A, K, q);
        return K
    }
    uy7.evaluatedPropsToName = xy7;

    function m_A(A, q, K) {
        Object.keys(K).forEach((Y) => A.assign(Cw._`${q}${(0,Cw.getProperty)(Y)}`, !0))
    }
    uy7.setEvaluated = m_A;
    var Cy7 = {};

    function Qz9(A, q) {
        return A.scopeValue("func", {
            ref: q,
            code: Cy7[q.code] || (Cy7[q.code] = new hz9._Code(q.code))
        })
    }
    uy7.useFunc = Qz9;
    var u_A;
    (function(A) {
        A[A.Num = 0] = "Num", A[A.Str = 1] = "Str"
    })(u_A || (uy7.Type = u_A = {}));

    function gz9(A, q, K) {
        if (A instanceof Cw.Name) {
            let Y = q === u_A.Num;
            return K ? Y ? Cw._`"[" + ${A} + "]"` : Cw._`"['" + ${A} + "']"` : Y ? Cw._`"/" + ${A}` : Cw._`"/" + ${A}.replace(/~/g, "~0").replace(/\\//g, "~1")`
        }
        return K ? (0, Cw.getProperty)(A).toString() : "/" + B_A(A)
    }
    uy7.getErrorPath = gz9;

    function by7(A, q, K = A.opts.strictSchema) {
        if (!K) return;
        if (q = `strict mode: ${q}`, K === !0) throw Error(q);
        A.self.logger.warn(q)
    }
    uy7.checkStrictMode = by7
})
// @from(Ln 208783, Col 4)
Jp = R((my7) => {
    Object.defineProperty(my7, "__esModule", {
        value: !0
    });
    var CW = p5(),
        z29 = {
            data: new CW.Name("data"),
            valCxt: new CW.Name("valCxt"),
            instancePath: new CW.Name("instancePath"),
            parentData: new CW.Name("parentData"),
            parentDataProperty: new CW.Name("parentDataProperty"),
            rootData: new CW.Name("rootData"),
            dynamicAnchors: new CW.Name("dynamicAnchors"),
            vErrors: new CW.Name("vErrors"),
            errors: new CW.Name("errors"),
            this: new CW.Name("this"),
            self: new CW.Name("self"),
            scope: new CW.Name("scope"),
            json: new CW.Name("json"),
            jsonPos: new CW.Name("jsonPos"),
            jsonLen: new CW.Name("jsonLen"),
            jsonPart: new CW.Name("jsonPart")
        };
    my7.default = z29
})
// @from(Ln 208808, Col 4)
Jb1 = R((Uy7) => {
    Object.defineProperty(Uy7, "__esModule", {
        value: !0
    });
    Uy7.extendErrors = Uy7.resetErrorsCount = Uy7.reportExtraError = Uy7.reportError = Uy7.keyword$DataError = Uy7.keywordError = void 0;
    var SY = p5(),
        ZH6 = dY(),
        fZ = Jp();
    Uy7.keywordError = {
        message: ({
            keyword: A
        }) => SY.str`must pass "${A}" keyword validation`
    };
    Uy7.keyword$DataError = {
        message: ({
            keyword: A,
            schemaType: q
        }) => q ? SY.str`"${A}" keyword must be ${q} ($data)` : SY.str`"${A}" keyword is invalid ($data)`
    };

    function H29(A, q = Uy7.keywordError, K, Y) {
        let {
            it: z
        } = A, {
            gen: w,
            compositeRule: H,
            allErrors: $
        } = z, O = gy7(A, q, K);
        if (Y !== null && Y !== void 0 ? Y : H || $) Fy7(w, O);
        else Qy7(z, SY._`[${O}]`)
    }
    Uy7.reportError = H29;

    function $29(A, q = Uy7.keywordError, K) {
        let {
            it: Y
        } = A, {
            gen: z,
            compositeRule: w,
            allErrors: H
        } = Y, $ = gy7(A, q, K);
        if (Fy7(z, $), !(w || H)) Qy7(Y, fZ.default.vErrors)
    }
    Uy7.reportExtraError = $29;

    function O29(A, q) {
        A.assign(fZ.default.errors, q), A.if(SY._`${fZ.default.vErrors} !== null`, () => A.if(q, () => A.assign(SY._`${fZ.default.vErrors}.length`, q), () => A.assign(fZ.default.vErrors, null)))
    }
    Uy7.resetErrorsCount = O29;

    function _29({
        gen: A,
        keyword: q,
        schemaValue: K,
        data: Y,
        errsCount: z,
        it: w
    }) {
        if (z === void 0) throw Error("ajv implementation error");
        let H = A.name("err");
        A.forRange("i", z, fZ.default.errors, ($) => {
            if (A.const(H, SY._`${fZ.default.vErrors}[${$}]`), A.if(SY._`${H}.instancePath === undefined`, () => A.assign(SY._`${H}.instancePath`, (0, SY.strConcat)(fZ.default.instancePath, w.errorPath))), A.assign(SY._`${H}.schemaPath`, SY.str`${w.errSchemaPath}/${q}`), w.opts.verbose) A.assign(SY._`${H}.schema`, K), A.assign(SY._`${H}.data`, Y)
        })
    }
    Uy7.extendErrors = _29;

    function Fy7(A, q) {
        let K = A.const("err", q);
        A.if(SY._`${fZ.default.vErrors} === null`, () => A.assign(fZ.default.vErrors, SY._`[${K}]`), SY._`${fZ.default.vErrors}.push(${K})`), A.code(SY._`${fZ.default.errors}++`)
    }

    function Qy7(A, q) {
        let {
            gen: K,
            validateName: Y,
            schemaEnv: z
        } = A;
        if (z.$async) K.throw(SY._`new ${A.ValidationError}(${q})`);
        else K.assign(SY._`${Y}.errors`, q), K.return(!1)
    }
    var kq1 = {
        keyword: new SY.Name("keyword"),
        schemaPath: new SY.Name("schemaPath"),
        params: new SY.Name("params"),
        propertyName: new SY.Name("propertyName"),
        message: new SY.Name("message"),
        schema: new SY.Name("schema"),
        parentSchema: new SY.Name("parentSchema")
    };

    function gy7(A, q, K) {
        let {
            createErrors: Y
        } = A.it;
        if (Y === !1) return SY._`{}`;
        return J29(A, q, K)
    }

    function J29(A, q, K = {}) {
        let {
            gen: Y,
            it: z
        } = A, w = [X29(z, K), D29(A, K)];
        return j29(A, q, w), Y.object(...w)
    }

    function X29({
        errorPath: A
    }, {
        instancePath: q
    }) {
        let K = q ? SY.str`${A}${(0,ZH6.getErrorPath)(q,ZH6.Type.Str)}` : A;
        return [fZ.default.instancePath, (0, SY.strConcat)(fZ.default.instancePath, K)]
    }

    function D29({
        keyword: A,
        it: {
            errSchemaPath: q
        }
    }, {
        schemaPath: K,
        parentSchema: Y
    }) {
        let z = Y ? q : SY.str`${q}/${A}`;
        if (K) z = SY.str`${z}${(0,ZH6.getErrorPath)(K,ZH6.Type.Str)}`;
        return [kq1.schemaPath, z]
    }

    function j29(A, {
        params: q,
        message: K
    }, Y) {
        let {
            keyword: z,
            data: w,
            schemaValue: H,
            it: $
        } = A, {
            opts: O,
            propertyName: _,
            topSchemaRef: J,
            schemaPath: X
        } = $;
        if (Y.push([kq1.keyword, z], [kq1.params, typeof q == "function" ? q(A) : q || SY._`{}`]), O.messages) Y.push([kq1.message, typeof K == "function" ? K(A) : K]);
        if (O.verbose) Y.push([kq1.schema, H], [kq1.parentSchema, SY._`${J}${X}`], [fZ.default.data, w]);
        if (_) Y.push([kq1.propertyName, _])
    }
})
// @from(Ln 208957, Col 4)
iy7 = R((cy7) => {
    Object.defineProperty(cy7, "__esModule", {
        value: !0
    });
    cy7.boolOrEmptySchema = cy7.topBoolOrEmptySchema = void 0;
    var Z29 = Jb1(),
        f29 = p5(),
        V29 = Jp(),
        N29 = {
            message: "boolean schema is false"
        };

    function T29(A) {
        let {
            gen: q,
            schema: K,
            validateName: Y
        } = A;
        if (K === !1) dy7(A, !1);
        else if (typeof K == "object" && K.$async === !0) q.return(V29.default.data);
        else q.assign(f29._`${Y}.errors`, null), q.return(!0)
    }
    cy7.topBoolOrEmptySchema = T29;

    function v29(A, q) {
        let {
            gen: K,
            schema: Y
        } = A;
        if (Y === !1) K.var(q, !1), dy7(A);
        else K.var(q, !0)
    }
    cy7.boolOrEmptySchema = v29;

    function dy7(A, q) {
        let {
            gen: K,
            data: Y
        } = A, z = {
            gen: K,
            keyword: "false schema",
            data: Y,
            schema: !1,
            schemaCode: !1,
            schemaValue: !1,
            params: {},
            it: A
        };
        (0, Z29.reportError)(z, N29, void 0, q)
    }
})
// @from(Ln 209008, Col 4)
Q_A = R((ny7) => {
    Object.defineProperty(ny7, "__esModule", {
        value: !0
    });
    ny7.getRules = ny7.isJSONType = void 0;
    var k29 = ["string", "number", "integer", "boolean", "null", "object", "array"],
        L29 = new Set(k29);

    function R29(A) {
        return typeof A == "string" && L29.has(A)
    }
    ny7.isJSONType = R29;

    function y29() {
        let A = {
            number: {
                type: "number",
                rules: []
            },
            string: {
                type: "string",
                rules: []
            },
            array: {
                type: "array",
                rules: []
            },
            object: {
                type: "object",
                rules: []
            }
        };
        return {
            types: {
                ...A,
                integer: !0,
                boolean: !0,
                null: !0
            },
            rules: [{
                rules: []
            }, A.number, A.string, A.array, A.object],
            post: {
                rules: []
            },
            all: {},
            keywords: {}
        }
    }
    ny7.getRules = y29
})
// @from(Ln 209059, Col 4)
g_A = R((sy7) => {
    Object.defineProperty(sy7, "__esModule", {
        value: !0
    });
    sy7.shouldUseRule = sy7.shouldUseGroup = sy7.schemaHasRulesForType = void 0;

    function S29({
        schema: A,
        self: q
    }, K) {
        let Y = q.RULES.types[K];
        return Y && Y !== !0 && oy7(A, Y)
    }
    sy7.schemaHasRulesForType = S29;

    function oy7(A, q) {
        return q.rules.some((K) => ay7(A, K))
    }
    sy7.shouldUseGroup = oy7;

    function ay7(A, q) {
        var K;
        return A[q.keyword] !== void 0 || ((K = q.definition.implements) === null || K === void 0 ? void 0 : K.some((Y) => A[Y] !== void 0))
    }
    sy7.shouldUseRule = ay7
})
// @from(Ln 209085, Col 4)
Xb1 = R((KC7) => {
    Object.defineProperty(KC7, "__esModule", {
        value: !0
    });
    KC7.reportTypeError = KC7.checkDataTypes = KC7.checkDataType = KC7.coerceAndCheckDataType = KC7.getJSONTypes = KC7.getSchemaTypes = KC7.DataType = void 0;
    var x29 = Q_A(),
        b29 = g_A(),
        u29 = Jb1(),
        b5 = p5(),
        ey7 = dY(),
        Z01;
    (function(A) {
        A[A.Correct = 0] = "Correct", A[A.Wrong = 1] = "Wrong"
    })(Z01 || (KC7.DataType = Z01 = {}));

    function B29(A) {
        let q = AC7(A.type);
        if (q.includes("null")) {
            if (A.nullable === !1) throw Error("type: null contradicts nullable: false")
        } else {
            if (!q.length && A.nullable !== void 0) throw Error('"nullable" cannot be used without "type"');
            if (A.nullable === !0) q.push("null")
        }
        return q
    }
    KC7.getSchemaTypes = B29;

    function AC7(A) {
        let q = Array.isArray(A) ? A : A ? [A] : [];
        if (q.every(x29.isJSONType)) return q;
        throw Error("type must be JSONType or JSONType[]: " + q.join(","))
    }
    KC7.getJSONTypes = AC7;

    function m29(A, q) {
        let {
            gen: K,
            data: Y,
            opts: z
        } = A, w = F29(q, z.coerceTypes), H = q.length > 0 && !(w.length === 0 && q.length === 1 && (0, b29.schemaHasRulesForType)(A, q[0]));
        if (H) {
            let $ = p_A(q, Y, z.strictNumbers, Z01.Wrong);
            K.if($, () => {
                if (w.length) Q29(A, q, w);
                else d_A(A)
            })
        }
        return H
    }
    KC7.coerceAndCheckDataType = m29;
    var qC7 = new Set(["string", "number", "integer", "boolean", "null"]);

    function F29(A, q) {
        return q ? A.filter((K) => qC7.has(K) || q === "array" && K === "array") : []
    }

    function Q29(A, q, K) {
        let {
            gen: Y,
            data: z,
            opts: w
        } = A, H = Y.let("dataType", b5._`typeof ${z}`), $ = Y.let("coerced", b5._`undefined`);
        if (w.coerceTypes === "array") Y.if(b5._`${H} == 'object' && Array.isArray(${z}) && ${z}.length == 1`, () => Y.assign(z, b5._`${z}[0]`).assign(H, b5._`typeof ${z}`).if(p_A(q, z, w.strictNumbers), () => Y.assign($, z)));
        Y.if(b5._`${$} !== undefined`);
        for (let _ of K)
            if (qC7.has(_) || _ === "array" && w.coerceTypes === "array") O(_);
        Y.else(), d_A(A), Y.endIf(), Y.if(b5._`${$} !== undefined`, () => {
            Y.assign(z, $), g29(A, $)
        });

        function O(_) {
            switch (_) {
                case "string":
                    Y.elseIf(b5._`${H} == "number" || ${H} == "boolean"`).assign($, b5._`"" + ${z}`).elseIf(b5._`${z} === null`).assign($, b5._`""`);
                    return;
                case "number":
                    Y.elseIf(b5._`${H} == "boolean" || ${z} === null
              || (${H} == "string" && ${z} && ${z} == +${z})`).assign($, b5._`+${z}`);
                    return;
                case "integer":
                    Y.elseIf(b5._`${H} === "boolean" || ${z} === null
              || (${H} === "string" && ${z} && ${z} == +${z} && !(${z} % 1))`).assign($, b5._`+${z}`);
                    return;
                case "boolean":
                    Y.elseIf(b5._`${z} === "false" || ${z} === 0 || ${z} === null`).assign($, !1).elseIf(b5._`${z} === "true" || ${z} === 1`).assign($, !0);
                    return;
                case "null":
                    Y.elseIf(b5._`${z} === "" || ${z} === 0 || ${z} === false`), Y.assign($, null);
                    return;
                case "array":
                    Y.elseIf(b5._`${H} === "string" || ${H} === "number"
              || ${H} === "boolean" || ${z} === null`).assign($, b5._`[${z}]`)
            }
        }
    }

    function g29({
        gen: A,
        parentData: q,
        parentDataProperty: K
    }, Y) {
        A.if(b5._`${q} !== undefined`, () => A.assign(b5._`${q}[${K}]`, Y))
    }

    function U_A(A, q, K, Y = Z01.Correct) {
        let z = Y === Z01.Correct ? b5.operators.EQ : b5.operators.NEQ,
            w;
        switch (A) {
            case "null":
                return b5._`${q} ${z} null`;
            case "array":
                w = b5._`Array.isArray(${q})`;
                break;
            case "object":
                w = b5._`${q} && typeof ${q} == "object" && !Array.isArray(${q})`;
                break;
            case "integer":
                w = H(b5._`!(${q} % 1) && !isNaN(${q})`);
                break;
            case "number":
                w = H();
                break;
            default:
                return b5._`typeof ${q} ${z} ${A}`
        }
        return Y === Z01.Correct ? w : (0, b5.not)(w);

        function H($ = b5.nil) {
            return (0, b5.and)(b5._`typeof ${q} == "number"`, $, K ? b5._`isFinite(${q})` : b5.nil)
        }
    }
    KC7.checkDataType = U_A;

    function p_A(A, q, K, Y) {
        if (A.length === 1) return U_A(A[0], q, K, Y);
        let z, w = (0, ey7.toHash)(A);
        if (w.array && w.object) {
            let H = b5._`typeof ${q} != "object"`;
            z = w.null ? H : b5._`!${q} || ${H}`, delete w.null, delete w.array, delete w.object
        } else z = b5.nil;
        if (w.number) delete w.integer;
        for (let H in w) z = (0, b5.and)(z, U_A(H, q, K, Y));
        return z
    }
    KC7.checkDataTypes = p_A;
    var U29 = {
        message: ({
            schema: A
        }) => `must be ${A}`,
        params: ({
            schema: A,
            schemaValue: q
        }) => typeof A == "string" ? b5._`{type: ${A}}` : b5._`{type: ${q}}`
    };

    function d_A(A) {
        let q = p29(A);
        (0, u29.reportError)(q, U29)
    }
    KC7.reportTypeError = d_A;

    function p29(A) {
        let {
            gen: q,
            data: K,
            schema: Y
        } = A, z = (0, ey7.schemaRefOrVal)(A, Y, "type");
        return {
            gen: q,
            keyword: "type",
            data: K,
            schema: Y.type,
            schemaCode: z,
            schemaValue: z,
            parentSchema: Y,
            params: {},
            it: A
        }
    }
})
// @from(Ln 209265, Col 4)
$C7 = R((wC7) => {
    Object.defineProperty(wC7, "__esModule", {
        value: !0
    });
    wC7.assignDefaults = void 0;
    var f01 = p5(),
        o29 = dY();

    function a29(A, q) {
        let {
            properties: K,
            items: Y
        } = A.schema;
        if (q === "object" && K)
            for (let z in K) zC7(A, z, K[z].default);
        else if (q === "array" && Array.isArray(Y)) Y.forEach((z, w) => zC7(A, w, z.default))
    }
    wC7.assignDefaults = a29;

    function zC7(A, q, K) {
        let {
            gen: Y,
            compositeRule: z,
            data: w,
            opts: H
        } = A;
        if (K === void 0) return;
        let $ = f01._`${w}${(0,f01.getProperty)(q)}`;
        if (z) {
            (0, o29.checkStrictMode)(A, `default is ignored for: ${$}`);
            return
        }
        let O = f01._`${$} === undefined`;
        if (H.useDefaults === "empty") O = f01._`${O} || ${$} === null || ${$} === ""`;
        Y.if(O, f01._`${$} = ${(0,f01.stringify)(K)}`)
    }
})
// @from(Ln 209302, Col 4)
tL = R((JC7) => {
    Object.defineProperty(JC7, "__esModule", {
        value: !0
    });
    JC7.validateUnion = JC7.validateArray = JC7.usePattern = JC7.callValidateCode = JC7.schemaProperties = JC7.allSchemaProperties = JC7.noPropertyInData = JC7.propertyInData = JC7.isOwnProperty = JC7.hasPropFunc = JC7.reportMissingProp = JC7.checkMissingProp = JC7.checkReportMissingProp = void 0;
    var A$ = p5(),
        c_A = dY(),
        qa = Jp(),
        s29 = dY();

    function t29(A, q) {
        let {
            gen: K,
            data: Y,
            it: z
        } = A;
        K.if(i_A(K, Y, q, z.opts.ownProperties), () => {
            A.setParams({
                missingProperty: A$._`${q}`
            }, !0), A.error()
        })
    }
    JC7.checkReportMissingProp = t29;

    function e29({
        gen: A,
        data: q,
        it: {
            opts: K
        }
    }, Y, z) {
        return (0, A$.or)(...Y.map((w) => (0, A$.and)(i_A(A, q, w, K.ownProperties), A$._`${z} = ${w}`)))
    }
    JC7.checkMissingProp = e29;

    function Aw9(A, q) {
        A.setParams({
            missingProperty: q
        }, !0), A.error()
    }
    JC7.reportMissingProp = Aw9;

    function OC7(A) {
        return A.scopeValue("func", {
            ref: Object.prototype.hasOwnProperty,
            code: A$._`Object.prototype.hasOwnProperty`
        })
    }
    JC7.hasPropFunc = OC7;

    function l_A(A, q, K) {
        return A$._`${OC7(A)}.call(${q}, ${K})`
    }
    JC7.isOwnProperty = l_A;

    function qw9(A, q, K, Y) {
        let z = A$._`${q}${(0,A$.getProperty)(K)} !== undefined`;
        return Y ? A$._`${z} && ${l_A(A,q,K)}` : z
    }
    JC7.propertyInData = qw9;

    function i_A(A, q, K, Y) {
        let z = A$._`${q}${(0,A$.getProperty)(K)} === undefined`;
        return Y ? (0, A$.or)(z, (0, A$.not)(l_A(A, q, K))) : z
    }
    JC7.noPropertyInData = i_A;

    function _C7(A) {
        return A ? Object.keys(A).filter((q) => q !== "__proto__") : []
    }
    JC7.allSchemaProperties = _C7;

    function Kw9(A, q) {
        return _C7(q).filter((K) => !(0, c_A.alwaysValidSchema)(A, q[K]))
    }
    JC7.schemaProperties = Kw9;

    function Yw9({
        schemaCode: A,
        data: q,
        it: {
            gen: K,
            topSchemaRef: Y,
            schemaPath: z,
            errorPath: w
        },
        it: H
    }, $, O, _) {
        let J = _ ? A$._`${A}, ${q}, ${Y}${z}` : q,
            X = [
                [qa.default.instancePath, (0, A$.strConcat)(qa.default.instancePath, w)],
                [qa.default.parentData, H.parentData],
                [qa.default.parentDataProperty, H.parentDataProperty],
                [qa.default.rootData, qa.default.rootData]
            ];
        if (H.opts.dynamicRef) X.push([qa.default.dynamicAnchors, qa.default.dynamicAnchors]);
        let D = A$._`${J}, ${K.object(...X)}`;
        return O !== A$.nil ? A$._`${$}.call(${O}, ${D})` : A$._`${$}(${D})`
    }
    JC7.callValidateCode = Yw9;
    var zw9 = A$._`new RegExp`;

    function ww9({
        gen: A,
        it: {
            opts: q
        }
    }, K) {
        let Y = q.unicodeRegExp ? "u" : "",
            {
                regExp: z
            } = q.code,
            w = z(K, Y);
        return A.scopeValue("pattern", {
            key: w.toString(),
            ref: w,
            code: A$._`${z.code==="new RegExp"?zw9:(0,s29.useFunc)(A,z)}(${K}, ${Y})`
        })
    }
    JC7.usePattern = ww9;

    function Hw9(A) {
        let {
            gen: q,
            data: K,
            keyword: Y,
            it: z
        } = A, w = q.name("valid");
        if (z.allErrors) {
            let $ = q.let("valid", !0);
            return H(() => q.assign($, !1)), $
        }
        return q.var(w, !0), H(() => q.break()), w;

        function H($) {
            let O = q.const("len", A$._`${K}.length`);
            q.forRange("i", 0, O, (_) => {
                A.subschema({
                    keyword: Y,
                    dataProp: _,
                    dataPropType: c_A.Type.Num
                }, w), q.if((0, A$.not)(w), $)
            })
        }
    }
    JC7.validateArray = Hw9;

    function $w9(A) {
        let {
            gen: q,
            schema: K,
            keyword: Y,
            it: z
        } = A;
        if (!Array.isArray(K)) throw Error("ajv implementation error");
        if (K.some((O) => (0, c_A.alwaysValidSchema)(z, O)) && !z.opts.unevaluated) return;
        let H = q.let("valid", !1),
            $ = q.name("_valid");
        q.block(() => K.forEach((O, _) => {
            let J = A.subschema({
                keyword: Y,
                schemaProp: _,
                compositeRule: !0
            }, $);
            if (q.assign(H, A$._`${H} || ${$}`), !A.mergeValidEvaluated(J, $)) q.if((0, A$.not)(H))
        })), A.result(H, () => A.reset(), () => A.error(!0))
    }
    JC7.validateUnion = $w9
})
// @from(Ln 209471, Col 4)
WC7 = R((MC7) => {
    Object.defineProperty(MC7, "__esModule", {
        value: !0
    });
    MC7.validateKeywordUsage = MC7.validSchemaType = MC7.funcKeywordCode = MC7.macroKeywordCode = void 0;
    var VZ = p5(),
        Lq1 = Jp(),
        Vw9 = tL(),
        Nw9 = Jb1();

    function Tw9(A, q) {
        let {
            gen: K,
            keyword: Y,
            schema: z,
            parentSchema: w,
            it: H
        } = A, $ = q.macro.call(H.self, z, w, H), O = jC7(K, Y, $);
        if (H.opts.validateSchema !== !1) H.self.validateSchema($, !0);
        let _ = K.name("valid");
        A.subschema({
            schema: $,
            schemaPath: VZ.nil,
            errSchemaPath: `${H.errSchemaPath}/${Y}`,
            topSchemaRef: O,
            compositeRule: !0
        }, _), A.pass(_, () => A.error(!0))
    }
    MC7.macroKeywordCode = Tw9;

    function vw9(A, q) {
        var K;
        let {
            gen: Y,
            keyword: z,
            schema: w,
            parentSchema: H,
            $data: $,
            it: O
        } = A;
        kw9(O, q);
        let _ = !$ && q.compile ? q.compile.call(O.self, w, H, O) : q.validate,
            J = jC7(Y, z, _),
            X = Y.let("valid");
        A.block$data(X, D), A.ok((K = q.valid) !== null && K !== void 0 ? K : X);

        function D() {
            if (q.errors === !1) {
                if (P(), q.modifying) DC7(A);
                W(() => A.error())
            } else {
                let G = q.async ? j() : M();
                if (q.modifying) DC7(A);
                W(() => Ew9(A, G))
            }
        }

        function j() {
            let G = Y.let("ruleErrs", null);
            return Y.try(() => P(VZ._`await `), (f) => Y.assign(X, !1).if(VZ._`${f} instanceof ${O.ValidationError}`, () => Y.assign(G, VZ._`${f}.errors`), () => Y.throw(f))), G
        }

        function M() {
            let G = VZ._`${J}.errors`;
            return Y.assign(G, null), P(VZ.nil), G
        }

        function P(G = q.async ? VZ._`await ` : VZ.nil) {
            let f = O.opts.passContext ? Lq1.default.this : Lq1.default.self,
                Z = !(("compile" in q) && !$ || q.schema === !1);
            Y.assign(X, VZ._`${G}${(0,Vw9.callValidateCode)(A,J,f,Z)}`, q.modifying)
        }

        function W(G) {
            var f;
            Y.if((0, VZ.not)((f = q.valid) !== null && f !== void 0 ? f : X), G)
        }
    }
    MC7.funcKeywordCode = vw9;

    function DC7(A) {
        let {
            gen: q,
            data: K,
            it: Y
        } = A;
        q.if(Y.parentData, () => q.assign(K, VZ._`${Y.parentData}[${Y.parentDataProperty}]`))
    }

    function Ew9(A, q) {
        let {
            gen: K
        } = A;
        K.if(VZ._`Array.isArray(${q})`, () => {
            K.assign(Lq1.default.vErrors, VZ._`${Lq1.default.vErrors} === null ? ${q} : ${Lq1.default.vErrors}.concat(${q})`).assign(Lq1.default.errors, VZ._`${Lq1.default.vErrors}.length`), (0, Nw9.extendErrors)(A)
        }, () => A.error())
    }

    function kw9({
        schemaEnv: A
    }, q) {
        if (q.async && !A.$async) throw Error("async keyword in sync schema")
    }

    function jC7(A, q, K) {
        if (K === void 0) throw Error(`keyword "${q}" failed to compile`);
        return A.scopeValue("keyword", typeof K == "function" ? {
            ref: K
        } : {
            ref: K,
            code: (0, VZ.stringify)(K)
        })
    }

    function Lw9(A, q, K = !1) {
        return !q.length || q.some((Y) => Y === "array" ? Array.isArray(A) : Y === "object" ? A && typeof A == "object" && !Array.isArray(A) : typeof A == Y || K && typeof A > "u")
    }
    MC7.validSchemaType = Lw9;

    function Rw9({
        schema: A,
        opts: q,
        self: K,
        errSchemaPath: Y
    }, z, w) {
        if (Array.isArray(z.keyword) ? !z.keyword.includes(w) : z.keyword !== w) throw Error("ajv implementation error");
        let H = z.dependencies;
        if (H === null || H === void 0 ? void 0 : H.some(($) => !Object.prototype.hasOwnProperty.call(A, $))) throw Error(`parent schema must have dependencies of ${w}: ${H.join(",")}`);
        if (z.validateSchema) {
            if (!z.validateSchema(A[w])) {
                let O = `keyword "${w}" value is invalid at path "${Y}": ` + K.errorsText(z.validateSchema.errors);
                if (q.validateSchema === "log") K.logger.error(O);
                else throw Error(O)
            }
        }
    }
    MC7.validateKeywordUsage = Rw9
})
// @from(Ln 209609, Col 4)
VC7 = R((ZC7) => {
    Object.defineProperty(ZC7, "__esModule", {
        value: !0
    });
    ZC7.extendSubschemaMode = ZC7.extendSubschemaData = ZC7.getSubschema = void 0;
    var fB = p5(),
        GC7 = dY();

    function hw9(A, {
        keyword: q,
        schemaProp: K,
        schema: Y,
        schemaPath: z,
        errSchemaPath: w,
        topSchemaRef: H
    }) {
        if (q !== void 0 && Y !== void 0) throw Error('both "keyword" and "schema" passed, only one allowed');
        if (q !== void 0) {
            let $ = A.schema[q];
            return K === void 0 ? {
                schema: $,
                schemaPath: fB._`${A.schemaPath}${(0,fB.getProperty)(q)}`,
                errSchemaPath: `${A.errSchemaPath}/${q}`
            } : {
                schema: $[K],
                schemaPath: fB._`${A.schemaPath}${(0,fB.getProperty)(q)}${(0,fB.getProperty)(K)}`,
                errSchemaPath: `${A.errSchemaPath}/${q}/${(0,GC7.escapeFragment)(K)}`
            }
        }
        if (Y !== void 0) {
            if (z === void 0 || w === void 0 || H === void 0) throw Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
            return {
                schema: Y,
                schemaPath: z,
                topSchemaRef: H,
                errSchemaPath: w
            }
        }
        throw Error('either "keyword" or "schema" must be passed')
    }
    ZC7.getSubschema = hw9;

    function Iw9(A, q, {
        dataProp: K,
        dataPropType: Y,
        data: z,
        dataTypes: w,
        propertyName: H
    }) {
        if (z !== void 0 && K !== void 0) throw Error('both "data" and "dataProp" passed, only one allowed');
        let {
            gen: $
        } = q;
        if (K !== void 0) {
            let {
                errorPath: _,
                dataPathArr: J,
                opts: X
            } = q, D = $.let("data", fB._`${q.data}${(0,fB.getProperty)(K)}`, !0);
            O(D), A.errorPath = fB.str`${_}${(0,GC7.getErrorPath)(K,Y,X.jsPropertySyntax)}`, A.parentDataProperty = fB._`${K}`, A.dataPathArr = [...J, A.parentDataProperty]
        }
        if (z !== void 0) {
            let _ = z instanceof fB.Name ? z : $.let("data", z, !0);
            if (O(_), H !== void 0) A.propertyName = H
        }
        if (w) A.dataTypes = w;

        function O(_) {
            A.data = _, A.dataLevel = q.dataLevel + 1, A.dataTypes = [], q.definedProperties = new Set, A.parentData = q.data, A.dataNames = [...q.dataNames, _]
        }
    }
    ZC7.extendSubschemaData = Iw9;

    function xw9(A, {
        jtdDiscriminator: q,
        jtdMetadata: K,
        compositeRule: Y,
        createErrors: z,
        allErrors: w
    }) {
        if (Y !== void 0) A.compositeRule = Y;
        if (z !== void 0) A.createErrors = z;
        if (w !== void 0) A.allErrors = w;
        A.jtdDiscriminator = q, A.jtdMetadata = K
    }
    ZC7.extendSubschemaMode = xw9
})
// @from(Ln 209696, Col 4)
n_A = R((BYw, NC7) => {
    NC7.exports = function A(q, K) {
        if (q === K) return !0;
        if (q && K && typeof q == "object" && typeof K == "object") {
            if (q.constructor !== K.constructor) return !1;
            var Y, z, w;
            if (Array.isArray(q)) {
                if (Y = q.length, Y != K.length) return !1;
                for (z = Y; z-- !== 0;)
                    if (!A(q[z], K[z])) return !1;
                return !0
            }
            if (q.constructor === RegExp) return q.source === K.source && q.flags === K.flags;
            if (q.valueOf !== Object.prototype.valueOf) return q.valueOf() === K.valueOf();
            if (q.toString !== Object.prototype.toString) return q.toString() === K.toString();
            if (w = Object.keys(q), Y = w.length, Y !== Object.keys(K).length) return !1;
            for (z = Y; z-- !== 0;)
                if (!Object.prototype.hasOwnProperty.call(K, w[z])) return !1;
            for (z = Y; z-- !== 0;) {
                var H = w[z];
                if (!A(q[H], K[H])) return !1
            }
            return !0
        }
        return q !== q && K !== K
    }
})
// @from(Ln 209723, Col 4)
vC7 = R((mYw, TC7) => {
    var Ka = TC7.exports = function(A, q, K) {
        if (typeof q == "function") K = q, q = {};
        K = q.cb || K;
        var Y = typeof K == "function" ? K : K.pre || function() {},
            z = K.post || function() {};
        fH6(q, Y, z, A, "", A)
    };
    Ka.keywords = {
        additionalItems: !0,
        items: !0,
        contains: !0,
        additionalProperties: !0,
        propertyNames: !0,
        not: !0,
        if: !0,
        then: !0,
        else: !0
    };
    Ka.arrayKeywords = {
        items: !0,
        allOf: !0,
        anyOf: !0,
        oneOf: !0
    };
    Ka.propsKeywords = {
        $defs: !0,
        definitions: !0,
        properties: !0,
        patternProperties: !0,
        dependencies: !0
    };
    Ka.skipKeywords = {
        default: !0,
        enum: !0,
        const: !0,
        required: !0,
        maximum: !0,
        minimum: !0,
        exclusiveMaximum: !0,
        exclusiveMinimum: !0,
        multipleOf: !0,
        maxLength: !0,
        minLength: !0,
        pattern: !0,
        format: !0,
        maxItems: !0,
        minItems: !0,
        uniqueItems: !0,
        maxProperties: !0,
        minProperties: !0
    };

    function fH6(A, q, K, Y, z, w, H, $, O, _) {
        if (Y && typeof Y == "object" && !Array.isArray(Y)) {
            q(Y, z, w, H, $, O, _);
            for (var J in Y) {
                var X = Y[J];
                if (Array.isArray(X)) {
                    if (J in Ka.arrayKeywords)
                        for (var D = 0; D < X.length; D++) fH6(A, q, K, X[D], z + "/" + J + "/" + D, w, z, J, Y, D)
                } else if (J in Ka.propsKeywords) {
                    if (X && typeof X == "object")
                        for (var j in X) fH6(A, q, K, X[j], z + "/" + J + "/" + Bw9(j), w, z, J, Y, j)
                } else if (J in Ka.keywords || A.allKeys && !(J in Ka.skipKeywords)) fH6(A, q, K, X, z + "/" + J, w, z, J, Y)
            }
            K(Y, z, w, H, $, O, _)
        }
    }

    function Bw9(A) {
        return A.replace(/~/g, "~0").replace(/\//g, "~1")
    }
})
// @from(Ln 209797, Col 4)
Db1 = R((RC7) => {
    Object.defineProperty(RC7, "__esModule", {
        value: !0
    });
    RC7.getSchemaRefs = RC7.resolveUrl = RC7.normalizeId = RC7._getFullPath = RC7.getFullPath = RC7.inlineRef = void 0;
    var mw9 = dY(),
        Fw9 = n_A(),
        Qw9 = vC7(),
        gw9 = new Set(["type", "format", "pattern", "maxLength", "minLength", "maxProperties", "minProperties", "maxItems", "minItems", "maximum", "minimum", "uniqueItems", "multipleOf", "required", "enum", "const"]);

    function Uw9(A, q = !0) {
        if (typeof A == "boolean") return !0;
        if (q === !0) return !r_A(A);
        if (!q) return !1;
        return EC7(A) <= q
    }
    RC7.inlineRef = Uw9;
    var pw9 = new Set(["$ref", "$recursiveRef", "$recursiveAnchor", "$dynamicRef", "$dynamicAnchor"]);

    function r_A(A) {
        for (let q in A) {
            if (pw9.has(q)) return !0;
            let K = A[q];
            if (Array.isArray(K) && K.some(r_A)) return !0;
            if (typeof K == "object" && r_A(K)) return !0
        }
        return !1
    }

    function EC7(A) {
        let q = 0;
        for (let K in A) {
            if (K === "$ref") return 1 / 0;
            if (q++, gw9.has(K)) continue;
            if (typeof A[K] == "object")(0, mw9.eachItem)(A[K], (Y) => q += EC7(Y));
            if (q === 1 / 0) return 1 / 0
        }
        return q
    }

    function kC7(A, q = "", K) {
        if (K !== !1) q = V01(q);
        let Y = A.parse(q);
        return LC7(A, Y)
    }
    RC7.getFullPath = kC7;

    function LC7(A, q) {
        return A.serialize(q).split("#")[0] + "#"
    }
    RC7._getFullPath = LC7;
    var dw9 = /#\/?$/;

    function V01(A) {
        return A ? A.replace(dw9, "") : ""
    }
    RC7.normalizeId = V01;

    function cw9(A, q, K) {
        return K = V01(K), A.resolve(q, K)
    }
    RC7.resolveUrl = cw9;
    var lw9 = /^[a-z_][-a-z0-9._]*$/i;

    function iw9(A, q) {
        if (typeof A == "boolean") return {};
        let {
            schemaId: K,
            uriResolver: Y
        } = this.opts, z = V01(A[K] || q), w = {
            "": z
        }, H = kC7(Y, z, !1), $ = {}, O = new Set;
        return Qw9(A, {
            allKeys: !0
        }, (X, D, j, M) => {
            if (M === void 0) return;
            let P = H + D,
                W = w[M];
            if (typeof X[K] == "string") W = G.call(this, X[K]);
            f.call(this, X.$anchor), f.call(this, X.$dynamicAnchor), w[D] = W;

            function G(Z) {
                let N = this.opts.uriResolver.resolve;
                if (Z = V01(W ? N(W, Z) : Z), O.has(Z)) throw J(Z);
                O.add(Z);
                let T = this.refs[Z];
                if (typeof T == "string") T = this.refs[T];
                if (typeof T == "object") _(X, T.schema, Z);
                else if (Z !== V01(P))
                    if (Z[0] === "#") _(X, $[Z], Z), $[Z] = X;
                    else this.refs[Z] = P;
                return Z
            }

            function f(Z) {
                if (typeof Z == "string") {
                    if (!lw9.test(Z)) throw Error(`invalid anchor "${Z}"`);
                    G.call(this, `#${Z}`)
                }
            }
        }), $;

        function _(X, D, j) {
            if (D !== void 0 && !Fw9(X, D)) throw J(j)
        }

        function J(X) {
            return Error(`reference "${X}" resolves to more than one schema`)
        }
    }
    RC7.getSchemaRefs = iw9
})