
// @from(Ln 22349, Col 0)
class xy6 {
    constructor(A) {
        if (this._options = A, this._requestMessageId = 0, this._requestHandlers = new Map, this._requestHandlerAbortControllers = new Map, this._notificationHandlers = new Map, this._responseHandlers = new Map, this._progressHandlers = new Map, this._timeoutInfo = new Map, this._pendingDebouncedNotifications = new Set, this._taskProgressTokens = new Map, this._requestResolvers = new Map, this.setNotificationHandler(A61, (q) => {
                this._oncancel(q)
            }), this.setNotificationHandler(Y61, (q) => {
                this._onprogress(q)
            }), this.setRequestHandler(K61, (q) => ({})), this._taskStore = A?.taskStore, this._taskMessageQueue = A?.taskMessageQueue, this._taskStore) this.setRequestHandler(z61, async (q, K) => {
            let Y = await this._taskStore.getTask(q.params.taskId, K.sessionId);
            if (!Y) throw new Aq(Fq.InvalidParams, "Failed to retrieve task: Task not found");
            return {
                ...Y
            }
        }), this.setRequestHandler(w61, async (q, K) => {
            let Y = async () => {
                let z = q.params.taskId;
                if (this._taskMessageQueue) {
                    let w;
                    while (w = await this._taskMessageQueue.dequeue(z, K.sessionId)) {
                        if (w.type === "response" || w.type === "error") {
                            let O = w.message,
                                $ = O.id,
                                H = this._requestResolvers.get($);
                            if (H)
                                if (this._requestResolvers.delete($), w.type === "response") H(O);
                                else {
                                    let j = O,
                                        J = new Aq(j.error.code, j.error.message, j.error.data);
                                    H(J)
                                }
                            else {
                                let j = w.type === "response" ? "Response" : "Error";
                                this._onerror(Error(`${j} handler missing for request ${$}`))
                            }
                            continue
                        }
                        await this._transport?.send(w.message, {
                            relatedRequestId: K.requestId
                        })
                    }
                }
                let _ = await this._taskStore.getTask(z, K.sessionId);
                if (!_) throw new Aq(Fq.InvalidParams, `Task not found: ${z}`);
                if (!Un(_.status)) return await this._waitForTaskUpdate(z, K.signal), await Y();
                if (Un(_.status)) {
                    let w = await this._taskStore.getTaskResult(z, K.sessionId);
                    return this._clearTaskQueue(z), {
                        ...w,
                        _meta: {
                            ...w._meta,
                            [Sn]: {
                                taskId: z
                            }
                        }
                    }
                }
                return await Y()
            };
            return await Y()
        }), this.setRequestHandler(O61, async (q, K) => {
            try {
                let {
                    tasks: Y,
                    nextCursor: z
                } = await this._taskStore.listTasks(q.params?.cursor, K.sessionId);
                return {
                    tasks: Y,
                    nextCursor: z,
                    _meta: {}
                }
            } catch (Y) {
                throw new Aq(Fq.InvalidParams, `Failed to list tasks: ${Y instanceof Error?Y.message:String(Y)}`)
            }
        }), this.setRequestHandler(H61, async (q, K) => {
            try {
                let Y = await this._taskStore.getTask(q.params.taskId, K.sessionId);
                if (!Y) throw new Aq(Fq.InvalidParams, `Task not found: ${q.params.taskId}`);
                if (Un(Y.status)) throw new Aq(Fq.InvalidParams, `Cannot cancel task in terminal status: ${Y.status}`);
                await this._taskStore.updateTaskStatus(q.params.taskId, "cancelled", "Client cancelled task execution.", K.sessionId), this._clearTaskQueue(q.params.taskId);
                let z = await this._taskStore.getTask(q.params.taskId, K.sessionId);
                if (!z) throw new Aq(Fq.InvalidParams, `Task not found after cancellation: ${q.params.taskId}`);
                return {
                    _meta: {},
                    ...z
                }
            } catch (Y) {
                if (Y instanceof Aq) throw Y;
                throw new Aq(Fq.InvalidRequest, `Failed to cancel task: ${Y instanceof Error?Y.message:String(Y)}`)
            }
        })
    }
    async _oncancel(A) {
        if (!A.params.requestId) return;
        this._requestHandlerAbortControllers.get(A.params.requestId)?.abort(A.params.reason)
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
        if (q.maxTotalTimeout && K >= q.maxTotalTimeout) throw this._timeoutInfo.delete(A), Aq.fromError(Fq.RequestTimeout, "Maximum total timeout exceeded", {
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
        if (this._transport) throw Error("Already connected to a transport. Call close() before connecting to a new transport, or use a separate Protocol instance per connection.");
        this._transport = A;
        let q = this.transport?.onclose;
        this._transport.onclose = () => {
            q?.(), this._onclose()
        };
        let K = this.transport?.onerror;
        this._transport.onerror = (z) => {
            K?.(z), this._onerror(z)
        };
        let Y = this._transport?.onmessage;
        this._transport.onmessage = (z, _) => {
            if (Y?.(z, _), ZA6(z) || jqA(z)) this._onresponse(z);
            else if (oE6(z)) this._onrequest(z, _);
            else if (HqA(z)) this._onnotification(z);
            else this._onerror(Error(`Unknown message type: ${JSON.stringify(z)}`))
        }, await this._transport.start()
    }
    _onclose() {
        let A = this._responseHandlers;
        this._responseHandlers = new Map, this._progressHandlers.clear(), this._taskProgressTokens.clear(), this._pendingDebouncedNotifications.clear();
        for (let K of this._requestHandlerAbortControllers.values()) K.abort();
        this._requestHandlerAbortControllers.clear();
        let q = Aq.fromError(Fq.ConnectionClosed, "Connection closed");
        this._transport = void 0, this.onclose?.();
        for (let K of A.values()) K(q)
    }
    _onerror(A) {
        this.onerror?.(A)
    }
    _onnotification(A) {
        let q = this._notificationHandlers.get(A.method) ?? this.fallbackNotificationHandler;
        if (q === void 0) return;
        Promise.resolve().then(() => q(A)).catch((K) => this._onerror(Error(`Uncaught error in notification handler: ${K}`)))
    }
    _onrequest(A, q) {
        let K = this._requestHandlers.get(A.method) ?? this.fallbackRequestHandler,
            Y = this._transport,
            z = A.params?._meta?.[Sn]?.taskId;
        if (K === void 0) {
            let H = {
                jsonrpc: "2.0",
                id: A.id,
                error: {
                    code: Fq.MethodNotFound,
                    message: "Method not found"
                }
            };
            if (z && this._taskMessageQueue) this._enqueueTaskMessage(z, {
                type: "error",
                message: H,
                timestamp: Date.now()
            }, Y?.sessionId).catch((j) => this._onerror(Error(`Failed to enqueue error response: ${j}`)));
            else Y?.send(H).catch((j) => this._onerror(Error(`Failed to send an error response: ${j}`)));
            return
        }
        let _ = new AbortController;
        this._requestHandlerAbortControllers.set(A.id, _);
        let w = wqA(A.params) ? A.params.task : void 0,
            O = this._taskStore ? this.requestTaskStore(A, Y?.sessionId) : void 0,
            $ = {
                signal: _.signal,
                sessionId: Y?.sessionId,
                _meta: A.params?._meta,
                sendNotification: async (H) => {
                    if (_.signal.aborted) return;
                    let j = {
                        relatedRequestId: A.id
                    };
                    if (z) j.relatedTask = {
                        taskId: z
                    };
                    await this.notification(H, j)
                },
                sendRequest: async (H, j, J) => {
                    if (_.signal.aborted) throw new Aq(Fq.ConnectionClosed, "Request was cancelled");
                    let M = {
                        ...J,
                        relatedRequestId: A.id
                    };
                    if (z && !M.relatedTask) M.relatedTask = {
                        taskId: z
                    };
                    let D = M.relatedTask?.taskId ?? z;
                    if (D && O) await O.updateTaskStatus(D, "input_required");
                    return await this.request(H, j, M)
                },
                authInfo: q?.authInfo,
                requestId: A.id,
                requestInfo: q?.requestInfo,
                taskId: z,
                taskStore: O,
                taskRequestedTtl: w?.ttl,
                closeSSEStream: q?.closeSSEStream,
                closeStandaloneSSEStream: q?.closeStandaloneSSEStream
            };
        Promise.resolve().then(() => {
            if (w) this.assertTaskHandlerCapability(A.method)
        }).then(() => K(A, $)).then(async (H) => {
            if (_.signal.aborted) return;
            let j = {
                result: H,
                jsonrpc: "2.0",
                id: A.id
            };
            if (z && this._taskMessageQueue) await this._enqueueTaskMessage(z, {
                type: "response",
                message: j,
                timestamp: Date.now()
            }, Y?.sessionId);
            else await Y?.send(j)
        }, async (H) => {
            if (_.signal.aborted) return;
            let j = {
                jsonrpc: "2.0",
                id: A.id,
                error: {
                    code: Number.isSafeInteger(H.code) ? H.code : Fq.InternalError,
                    message: H.message ?? "Internal error",
                    ...H.data !== void 0 && {
                        data: H.data
                    }
                }
            };
            if (z && this._taskMessageQueue) await this._enqueueTaskMessage(z, {
                type: "error",
                message: j,
                timestamp: Date.now()
            }, Y?.sessionId);
            else await Y?.send(j)
        }).catch((H) => this._onerror(Error(`Failed to send response: ${H}`))).finally(() => {
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
        let _ = this._responseHandlers.get(Y),
            w = this._timeoutInfo.get(Y);
        if (w && _ && w.resetTimeoutOnProgress) try {
            this._resetTimeout(Y)
        } catch (O) {
            this._responseHandlers.delete(Y), this._progressHandlers.delete(Y), this._cleanupTimeout(Y), _(O);
            return
        }
        z(K)
    }
    _onresponse(A) {
        let q = Number(A.id),
            K = this._requestResolvers.get(q);
        if (K) {
            if (this._requestResolvers.delete(q), ZA6(A)) K(A);
            else {
                let _ = new Aq(A.error.code, A.error.message, A.error.data);
                K(_)
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
        if (ZA6(A) && A.result && typeof A.result === "object") {
            let _ = A.result;
            if (_.task && typeof _.task === "object") {
                let w = _.task;
                if (typeof w.taskId === "string") z = !0, this._taskProgressTokens.set(w.taskId, q)
            }
        }
        if (!z) this._progressHandlers.delete(q);
        if (ZA6(A)) Y(A);
        else {
            let _ = Aq.fromError(A.error.code, A.error.message, A.error.data);
            Y(_)
        }
    }
    get transport() {
        return this._transport
    }
    async close() {
        await this._transport?.close()
    }
    async * requestStream(A, q, K) {
        let {
            task: Y
        } = K ?? {};
        if (!Y) {
            try {
                yield {
                    type: "result",
                    result: await this.request(A, q, K)
                }
            } catch (_) {
                yield {
                    type: "error",
                    error: _ instanceof Aq ? _ : new Aq(Fq.InternalError, String(_))
                }
            }
            return
        }
        let z;
        try {
            let _ = await this.request(A, Ep, K);
            if (_.task) z = _.task.taskId, yield {
                type: "taskCreated",
                task: _.task
            };
            else throw new Aq(Fq.InternalError, "Task creation did not return a task");
            while (!0) {
                let w = await this.getTask({
                    taskId: z
                }, K);
                if (yield {
                        type: "taskStatus",
                        task: w
                    }, Un(w.status)) {
                    if (w.status === "completed") yield {
                        type: "result",
                        result: await this.getTaskResult({
                            taskId: z
                        }, q, K)
                    };
                    else if (w.status === "failed") yield {
                        type: "error",
                        error: new Aq(Fq.InternalError, `Task ${z} failed`)
                    };
                    else if (w.status === "cancelled") yield {
                        type: "error",
                        error: new Aq(Fq.InternalError, `Task ${z} was cancelled`)
                    };
                    return
                }
                if (w.status === "input_required") {
                    yield {
                        type: "result",
                        result: await this.getTaskResult({
                            taskId: z
                        }, q, K)
                    };
                    return
                }
                let O = w.pollInterval ?? this._options?.defaultTaskPollInterval ?? 1000;
                await new Promise(($) => setTimeout($, O)), K?.signal?.throwIfAborted()
            }
        } catch (_) {
            yield {
                type: "error",
                error: _ instanceof Aq ? _ : new Aq(Fq.InternalError, String(_))
            }
        }
    }
    request(A, q, K) {
        let {
            relatedRequestId: Y,
            resumptionToken: z,
            onresumptiontoken: _,
            task: w,
            relatedTask: O
        } = K ?? {};
        return new Promise(($, H) => {
            let j = (Z) => {
                H(Z)
            };
            if (!this._transport) {
                j(Error("Not connected"));
                return
            }
            if (this._options?.enforceStrictCapabilities === !0) try {
                if (this.assertCapabilityForMethod(A.method), w) this.assertTaskCapability(A.method)
            } catch (Z) {
                j(Z);
                return
            }
            K?.signal?.throwIfAborted();
            let J = this._requestMessageId++,
                M = {
                    ...A,
                    jsonrpc: "2.0",
                    id: J
                };
            if (K?.onprogress) this._progressHandlers.set(J, K.onprogress), M.params = {
                ...A.params,
                _meta: {
                    ...A.params?._meta || {},
                    progressToken: J
                }
            };
            if (w) M.params = {
                ...M.params,
                task: w
            };
            if (O) M.params = {
                ...M.params,
                _meta: {
                    ...M.params?._meta || {},
                    [Sn]: O
                }
            };
            let D = (Z) => {
                this._responseHandlers.delete(J), this._progressHandlers.delete(J), this._cleanupTimeout(J), this._transport?.send({
                    jsonrpc: "2.0",
                    method: "notifications/cancelled",
                    params: {
                        requestId: J,
                        reason: String(Z)
                    }
                }, {
                    relatedRequestId: Y,
                    resumptionToken: z,
                    onresumptiontoken: _
                }).catch((f) => this._onerror(Error(`Failed to send cancellation: ${f}`)));
                let G = Z instanceof Aq ? Z : new Aq(Fq.RequestTimeout, String(Z));
                H(G)
            };
            this._responseHandlers.set(J, (Z) => {
                if (K?.signal?.aborted) return;
                if (Z instanceof Error) return H(Z);
                try {
                    let G = $G(q, Z.result);
                    if (!G.success) H(G.error);
                    else $(G.data)
                } catch (G) {
                    H(G)
                }
            }), K?.signal?.addEventListener("abort", () => {
                D(K?.signal?.reason)
            });
            let X = K?.timeout ?? A1K,
                P = () => D(Aq.fromError(Fq.RequestTimeout, "Request timed out", {
                    timeout: X
                }));
            this._setupTimeout(J, X, K?.maxTotalTimeout, P, K?.resetTimeoutOnProgress ?? !1);
            let W = O?.taskId;
            if (W) {
                let Z = (G) => {
                    let f = this._responseHandlers.get(J);
                    if (f) f(G);
                    else this._onerror(Error(`Response handler missing for side-channeled request ${J}`))
                };
                this._requestResolvers.set(J, Z), this._enqueueTaskMessage(W, {
                    type: "request",
                    message: M,
                    timestamp: Date.now()
                }).catch((G) => {
                    this._cleanupTimeout(J), H(G)
                })
            } else this._transport.send(M, {
                relatedRequestId: Y,
                resumptionToken: z,
                onresumptiontoken: _
            }).catch((Z) => {
                this._cleanupTimeout(J), H(Z)
            })
        })
    }
    async getTask(A, q) {
        return this.request({
            method: "tasks/get",
            params: A
        }, _61, q)
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
        }, $61, q)
    }
    async cancelTask(A, q) {
        return this.request({
            method: "tasks/cancel",
            params: A
        }, DqA, q)
    }
    async notification(A, q) {
        if (!this._transport) throw Error("Not connected");
        this.assertNotificationCapability(A.method);
        let K = q?.relatedTask?.taskId;
        if (K) {
            let w = {
                ...A,
                jsonrpc: "2.0",
                params: {
                    ...A.params,
                    _meta: {
                        ...A.params?._meta || {},
                        [Sn]: q.relatedTask
                    }
                }
            };
            await this._enqueueTaskMessage(K, {
                type: "notification",
                message: w,
                timestamp: Date.now()
            });
            return
        }
        if ((this._options?.debouncedNotificationMethods ?? []).includes(A.method) && !A.params && !q?.relatedRequestId && !q?.relatedTask) {
            if (this._pendingDebouncedNotifications.has(A.method)) return;
            this._pendingDebouncedNotifications.add(A.method), Promise.resolve().then(() => {
                if (this._pendingDebouncedNotifications.delete(A.method), !this._transport) return;
                let w = {
                    ...A,
                    jsonrpc: "2.0"
                };
                if (q?.relatedTask) w = {
                    ...w,
                    params: {
                        ...w.params,
                        _meta: {
                            ...w.params?._meta || {},
                            [Sn]: q.relatedTask
                        }
                    }
                };
                this._transport?.send(w, q).catch((O) => this._onerror(O))
            });
            return
        }
        let _ = {
            ...A,
            jsonrpc: "2.0"
        };
        if (q?.relatedTask) _ = {
            ..._,
            params: {
                ..._.params,
                _meta: {
                    ..._.params?._meta || {},
                    [Sn]: q.relatedTask
                }
            }
        };
        await this._transport.send(_, q)
    }
    setRequestHandler(A, q) {
        let K = wU1(A);
        this.assertRequestHandlerCapability(K), this._requestHandlers.set(K, (Y, z) => {
            let _ = OU1(A, Y);
            return Promise.resolve(q(_, z))
        })
    }
    removeRequestHandler(A) {
        this._requestHandlers.delete(A)
    }
    assertCanSetRequestHandler(A) {
        if (this._requestHandlers.has(A)) throw Error(`A request handler for ${A} already exists, which would be overridden`)
    }
    setNotificationHandler(A, q) {
        let K = wU1(A);
        this._notificationHandlers.set(K, (Y) => {
            let z = OU1(A, Y);
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
        if (!this._taskStore || !this._taskMessageQueue) throw Error("Cannot enqueue task message: taskStore and taskMessageQueue are not configured");
        let Y = this._options?.maxTaskQueueSize;
        await this._taskMessageQueue.enqueue(A, q, K, Y)
    }
    async _clearTaskQueue(A, q) {
        if (this._taskMessageQueue) {
            let K = await this._taskMessageQueue.dequeueAll(A, q);
            for (let Y of K)
                if (Y.type === "request" && oE6(Y.message)) {
                    let z = Y.message.id,
                        _ = this._requestResolvers.get(z);
                    if (_) _(new Aq(Fq.InternalError, "Task cancelled or completed")), this._requestResolvers.delete(z);
                    else this._onerror(Error(`Resolver missing for request ${z} during task ${A} cleanup`))
                }
        }
    }
    async _waitForTaskUpdate(A, q) {
        let K = this._options?.defaultTaskPollInterval ?? 1000;
        try {
            let Y = await this._taskStore?.getTask(A);
            if (Y?.pollInterval) K = Y.pollInterval
        } catch {}
        return new Promise((Y, z) => {
            if (q.aborted) {
                z(new Aq(Fq.InvalidRequest, "Request cancelled"));
                return
            }
            let _ = setTimeout(Y, K);
            q.addEventListener("abort", () => {
                clearTimeout(_), z(new Aq(Fq.InvalidRequest, "Request cancelled"))
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
                if (!z) throw new Aq(Fq.InvalidParams, "Failed to retrieve task: Task not found");
                return z
            },
            storeTaskResult: async (Y, z, _) => {
                await K.storeTaskResult(Y, z, _, q);
                let w = await K.getTask(Y, q);
                if (w) {
                    let O = Ay6.parse({
                        method: "notifications/tasks/status",
                        params: w
                    });
                    if (await this.notification(O), Un(w.status)) this._cleanupTaskProgressHandler(Y)
                }
            },
            getTaskResult: (Y) => {
                return K.getTaskResult(Y, q)
            },
            updateTaskStatus: async (Y, z, _) => {
                let w = await K.getTask(Y, q);
                if (!w) throw new Aq(Fq.InvalidParams, `Task "${Y}" not found - it may have been cleaned up`);
                if (Un(w.status)) throw new Aq(Fq.InvalidParams, `Cannot update task "${Y}" from terminal status "${w.status}" to "${z}". Terminal states (completed, failed, cancelled) cannot transition to other states.`);
                await K.updateTaskStatus(Y, z, _, q);
                let O = await K.getTask(Y, q);
                if (O) {
                    let $ = Ay6.parse({
                        method: "notifications/tasks/status",
                        params: O
                    });
                    if (await this.notification($), Un(O.status)) this._cleanupTaskProgressHandler(Y)
                }
            },
            listTasks: (Y) => {
                return K.listTasks(Y, q)
            }
        }
    }
}
// @from(Ln 23031, Col 0)
function A5A(A) {
    return A !== null && typeof A === "object" && !Array.isArray(A)
}
// @from(Ln 23035, Col 0)
function F61(A, q) {
    let K = {
        ...A
    };
    for (let Y in q) {
        let z = Y,
            _ = q[z];
        if (_ === void 0) continue;
        let w = K[z];
        if (A5A(w) && A5A(_)) K[z] = {
            ...w,
            ..._
        };
        else K[z] = _
    }
    return K
}
// @from(Ln 23052, Col 4)
A1K = 60000
// @from(Ln 23053, Col 4)
$U1 = E(() => {
    Iy6();
    hD();
    eKA()
})
// @from(Ln 23058, Col 4)
my6 = x((Y5A) => {
    Object.defineProperty(Y5A, "__esModule", {
        value: !0
    });
    Y5A.regexpCode = Y5A.getEsmExportName = Y5A.getProperty = Y5A.safeStringify = Y5A.stringify = Y5A.strConcat = Y5A.addCodeArg = Y5A.str = Y5A._ = Y5A.nil = Y5A._Code = Y5A.Name = Y5A.IDENTIFIER = Y5A._CodeOrName = void 0;
    class p61 {}
    Y5A._CodeOrName = p61;
    Y5A.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class pO6 extends p61 {
        constructor(A) {
            super();
            if (!Y5A.IDENTIFIER.test(A)) throw Error("CodeGen: name must be a valid identifier");
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
    Y5A.Name = pO6;
    class kS extends p61 {
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
                if (K instanceof pO6) q[K.str] = (q[K.str] || 0) + 1;
                return q
            }, {})
        }
    }
    Y5A._Code = kS;
    Y5A.nil = new kS("");

    function q5A(A, ...q) {
        let K = [A[0]],
            Y = 0;
        while (Y < q.length) jU1(K, q[Y]), K.push(A[++Y]);
        return new kS(K)
    }
    Y5A._ = q5A;
    var HU1 = new kS("+");

    function K5A(A, ...q) {
        let K = [uy6(A[0])],
            Y = 0;
        while (Y < q.length) K.push(HU1), jU1(K, q[Y]), K.push(HU1, uy6(A[++Y]));
        return q1K(K), new kS(K)
    }
    Y5A.str = K5A;

    function jU1(A, q) {
        if (q instanceof kS) A.push(...q._items);
        else if (q instanceof pO6) A.push(q);
        else A.push(z1K(q))
    }
    Y5A.addCodeArg = jU1;

    function q1K(A) {
        let q = 1;
        while (q < A.length - 1) {
            if (A[q] === HU1) {
                let K = K1K(A[q - 1], A[q + 1]);
                if (K !== void 0) {
                    A.splice(q - 1, 3, K);
                    continue
                }
                A[q++] = "+"
            }
            q++
        }
    }

    function K1K(A, q) {
        if (q === '""') return A;
        if (A === '""') return q;
        if (typeof A == "string") {
            if (q instanceof pO6 || A[A.length - 1] !== '"') return;
            if (typeof q != "string") return `${A.slice(0,-1)}${q}"`;
            if (q[0] === '"') return A.slice(0, -1) + q.slice(1);
            return
        }
        if (typeof q == "string" && q[0] === '"' && !(A instanceof pO6)) return `"${A}${q.slice(1)}`;
        return
    }

    function Y1K(A, q) {
        return q.emptyStr() ? A : A.emptyStr() ? q : K5A`${A}${q}`
    }
    Y5A.strConcat = Y1K;

    function z1K(A) {
        return typeof A == "number" || typeof A == "boolean" || A === null ? A : uy6(Array.isArray(A) ? A.join(",") : A)
    }

    function _1K(A) {
        return new kS(uy6(A))
    }
    Y5A.stringify = _1K;

    function uy6(A) {
        return JSON.stringify(A).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")
    }
    Y5A.safeStringify = uy6;

    function w1K(A) {
        return typeof A == "string" && Y5A.IDENTIFIER.test(A) ? new kS(`.${A}`) : q5A`[${A}]`
    }
    Y5A.getProperty = w1K;

    function O1K(A) {
        if (typeof A == "string" && Y5A.IDENTIFIER.test(A)) return new kS(`${A}`);
        throw Error(`CodeGen: invalid export name: ${A}, use explicit $id name mapping`)
    }
    Y5A.getEsmExportName = O1K;

    function $1K(A) {
        return new kS(A.toString())
    }
    Y5A.regexpCode = $1K
})
// @from(Ln 23200, Col 4)
XU1 = x((O5A) => {
    Object.defineProperty(O5A, "__esModule", {
        value: !0
    });
    O5A.ValueScope = O5A.ValueScopeName = O5A.Scope = O5A.varKinds = O5A.UsedValueState = void 0;
    var fT = my6();
    class _5A extends Error {
        constructor(A) {
            super(`CodeGen: "code" for ${A} not defined`);
            this.value = A.value
        }
    }
    var U61;
    (function(A) {
        A[A.Started = 0] = "Started", A[A.Completed = 1] = "Completed"
    })(U61 || (O5A.UsedValueState = U61 = {}));
    O5A.varKinds = {
        const: new fT.Name("const"),
        let: new fT.Name("let"),
        var: new fT.Name("var")
    };
    class MU1 {
        constructor({
            prefixes: A,
            parent: q
        } = {}) {
            this._names = {}, this._prefixes = A, this._parent = q
        }
        toName(A) {
            return A instanceof fT.Name ? A : this.name(A)
        }
        name(A) {
            return new fT.Name(this._newName(A))
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
    O5A.Scope = MU1;
    class DU1 extends fT.Name {
        constructor(A, q) {
            super(q);
            this.prefix = A
        }
        setValue(A, {
            property: q,
            itemIndex: K
        }) {
            this.value = A, this.scopePath = fT._`.${new fT.Name(q)}[${K}]`
        }
    }
    O5A.ValueScopeName = DU1;
    var v1K = fT._`\n`;
    class w5A extends MU1 {
        constructor(A) {
            super(A);
            this._values = {}, this._scope = A.scope, this.opts = {
                ...A,
                _n: A.lines ? v1K : fT.nil
            }
        }
        get() {
            return this._scope
        }
        name(A) {
            return new DU1(A, this._newName(A))
        }
        value(A, q) {
            var K;
            if (q.ref === void 0) throw Error("CodeGen: ref must be passed in value");
            let Y = this.toName(A),
                {
                    prefix: z
                } = Y,
                _ = (K = q.key) !== null && K !== void 0 ? K : q.ref,
                w = this._values[z];
            if (w) {
                let H = w.get(_);
                if (H) return H
            } else w = this._values[z] = new Map;
            w.set(_, Y);
            let O = this._scope[z] || (this._scope[z] = []),
                $ = O.length;
            return O[$] = q.ref, Y.setValue(q, {
                property: z,
                itemIndex: $
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
                return fT._`${A}${K.scopePath}`
            })
        }
        scopeCode(A = this._values, q, K) {
            return this._reduceValues(A, (Y) => {
                if (Y.value === void 0) throw Error(`CodeGen: name "${Y}" has no value`);
                return Y.value.code
            }, q, K)
        }
        _reduceValues(A, q, K = {}, Y) {
            let z = fT.nil;
            for (let _ in A) {
                let w = A[_];
                if (!w) continue;
                let O = K[_] = K[_] || new Map;
                w.forEach(($) => {
                    if (O.has($)) return;
                    O.set($, U61.Started);
                    let H = q($);
                    if (H) {
                        let j = this.opts.es5 ? O5A.varKinds.var : O5A.varKinds.const;
                        z = fT._`${z}${j} ${$} = ${H};${this.opts._n}`
                    } else if (H = Y === null || Y === void 0 ? void 0 : Y($)) z = fT._`${z}${H}${this.opts._n}`;
                    else throw new _5A($);
                    O.set($, U61.Completed)
                })
            }
            return z
        }
    }
    O5A.ValueScope = w5A
})
// @from(Ln 23337, Col 4)
y3 = x((TT) => {
    Object.defineProperty(TT, "__esModule", {
        value: !0
    });
    TT.or = TT.and = TT.not = TT.CodeGen = TT.operators = TT.varKinds = TT.ValueScopeName = TT.ValueScope = TT.Scope = TT.Name = TT.regexpCode = TT.stringify = TT.getProperty = TT.nil = TT.strConcat = TT.str = TT._ = void 0;
    var YY = my6(),
        ES = XU1(),
        dn = my6();
    Object.defineProperty(TT, "_", {
        enumerable: !0,
        get: function() {
            return dn._
        }
    });
    Object.defineProperty(TT, "str", {
        enumerable: !0,
        get: function() {
            return dn.str
        }
    });
    Object.defineProperty(TT, "strConcat", {
        enumerable: !0,
        get: function() {
            return dn.strConcat
        }
    });
    Object.defineProperty(TT, "nil", {
        enumerable: !0,
        get: function() {
            return dn.nil
        }
    });
    Object.defineProperty(TT, "getProperty", {
        enumerable: !0,
        get: function() {
            return dn.getProperty
        }
    });
    Object.defineProperty(TT, "stringify", {
        enumerable: !0,
        get: function() {
            return dn.stringify
        }
    });
    Object.defineProperty(TT, "regexpCode", {
        enumerable: !0,
        get: function() {
            return dn.regexpCode
        }
    });
    Object.defineProperty(TT, "Name", {
        enumerable: !0,
        get: function() {
            return dn.Name
        }
    });
    var r61 = XU1();
    Object.defineProperty(TT, "Scope", {
        enumerable: !0,
        get: function() {
            return r61.Scope
        }
    });
    Object.defineProperty(TT, "ValueScope", {
        enumerable: !0,
        get: function() {
            return r61.ValueScope
        }
    });
    Object.defineProperty(TT, "ValueScopeName", {
        enumerable: !0,
        get: function() {
            return r61.ValueScopeName
        }
    });
    Object.defineProperty(TT, "varKinds", {
        enumerable: !0,
        get: function() {
            return r61.varKinds
        }
    });
    TT.operators = {
        GT: new YY._Code(">"),
        GTE: new YY._Code(">="),
        LT: new YY._Code("<"),
        LTE: new YY._Code("<="),
        EQ: new YY._Code("==="),
        NEQ: new YY._Code("!=="),
        NOT: new YY._Code("!"),
        OR: new YY._Code("||"),
        AND: new YY._Code("&&"),
        ADD: new YY._Code("+")
    };
    class cn {
        optimizeNodes() {
            return this
        }
        optimizeNames(A, q) {
            return this
        }
    }
    class H5A extends cn {
        constructor(A, q, K) {
            super();
            this.varKind = A, this.name = q, this.rhs = K
        }
        render({
            es5: A,
            _n: q
        }) {
            let K = A ? ES.varKinds.var : this.varKind,
                Y = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
            return `${K} ${this.name}${Y};` + q
        }
        optimizeNames(A, q) {
            if (!A[this.name.str]) return;
            if (this.rhs) this.rhs = UO6(this.rhs, A, q);
            return this
        }
        get names() {
            return this.rhs instanceof YY._CodeOrName ? this.rhs.names : {}
        }
    }
    class ZU1 extends cn {
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
            if (this.lhs instanceof YY.Name && !A[this.lhs.str] && !this.sideEffects) return;
            return this.rhs = UO6(this.rhs, A, q), this
        }
        get names() {
            let A = this.lhs instanceof YY.Name ? {} : {
                ...this.lhs.names
            };
            return n61(A, this.rhs)
        }
    }
    class j5A extends ZU1 {
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
    class J5A extends cn {
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
    class M5A extends cn {
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
    class D5A extends cn {
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
    class X5A extends cn {
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
            return this.code = UO6(this.code, A, q), this
        }
        get names() {
            return this.code instanceof YY._CodeOrName ? this.code.names : {}
        }
    }
    class o61 extends cn {
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
                E1K(A, z.names), K.splice(Y, 1)
            }
            return K.length > 0 ? this : void 0
        }
        get names() {
            return this.nodes.reduce((A, q) => SA6(A, q.names), {})
        }
    }
    class ln extends o61 {
        render(A) {
            return "{" + A._n + super.render(A) + "}" + A._n
        }
    }
    class P5A extends o61 {}
    class By6 extends ln {}
    By6.kind = "else";
    class up extends ln {
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
                q = this.else = Array.isArray(K) ? new By6(K) : K
            }
            if (q) {
                if (A === !1) return q instanceof up ? q : q.nodes;
                if (this.nodes.length) return this;
                return new up(T5A(A), q instanceof up ? [q] : q.nodes)
            }
            if (A === !1 || !this.nodes.length) return;
            return this
        }
        optimizeNames(A, q) {
            var K;
            if (this.else = (K = this.else) === null || K === void 0 ? void 0 : K.optimizeNames(A, q), !(super.optimizeNames(A, q) || this.else)) return;
            return this.condition = UO6(this.condition, A, q), this
        }
        get names() {
            let A = super.names;
            if (n61(A, this.condition), this.else) SA6(A, this.else.names);
            return A
        }
    }
    up.kind = "if";
    class QO6 extends ln {}
    QO6.kind = "for";
    class W5A extends QO6 {
        constructor(A) {
            super();
            this.iteration = A
        }
        render(A) {
            return `for(${this.iteration})` + super.render(A)
        }
        optimizeNames(A, q) {
            if (!super.optimizeNames(A, q)) return;
            return this.iteration = UO6(this.iteration, A, q), this
        }
        get names() {
            return SA6(super.names, this.iteration.names)
        }
    }
    class Z5A extends QO6 {
        constructor(A, q, K, Y) {
            super();
            this.varKind = A, this.name = q, this.from = K, this.to = Y
        }
        render(A) {
            let q = A.es5 ? ES.varKinds.var : this.varKind,
                {
                    name: K,
                    from: Y,
                    to: z
                } = this;
            return `for(${q} ${K}=${Y}; ${K}<${z}; ${K}++)` + super.render(A)
        }
        get names() {
            let A = n61(super.names, this.from);
            return n61(A, this.to)
        }
    }
    class PU1 extends QO6 {
        constructor(A, q, K, Y) {
            super();
            this.loop = A, this.varKind = q, this.name = K, this.iterable = Y
        }
        render(A) {
            return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(A)
        }
        optimizeNames(A, q) {
            if (!super.optimizeNames(A, q)) return;
            return this.iterable = UO6(this.iterable, A, q), this
        }
        get names() {
            return SA6(super.names, this.iterable.names)
        }
    }
    class d61 extends ln {
        constructor(A, q, K) {
            super();
            this.name = A, this.args = q, this.async = K
        }
        render(A) {
            return `${this.async?"async ":""}function ${this.name}(${this.args})` + super.render(A)
        }
    }
    d61.kind = "func";
    class c61 extends o61 {
        render(A) {
            return "return " + super.render(A)
        }
    }
    c61.kind = "return";
    class G5A extends ln {
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
            if (this.catch) SA6(A, this.catch.names);
            if (this.finally) SA6(A, this.finally.names);
            return A
        }
    }
    class l61 extends ln {
        constructor(A) {
            super();
            this.error = A
        }
        render(A) {
            return `catch(${this.error})` + super.render(A)
        }
    }
    l61.kind = "catch";
    class i61 extends ln {
        render(A) {
            return "finally" + super.render(A)
        }
    }
    i61.kind = "finally";
    class f5A {
        constructor(A, q = {}) {
            this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = {
                ...q,
                _n: q.lines ? `
` : ""
            }, this._extScope = A, this._scope = new ES.Scope({
                parent: A
            }), this._nodes = [new P5A]
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
            return this._leafNode(new H5A(A, z, K)), z
        }
        const (A, q, K) {
            return this._def(ES.varKinds.const, A, q, K)
        }
        let (A, q, K) {
            return this._def(ES.varKinds.let, A, q, K)
        }
        var (A, q, K) {
            return this._def(ES.varKinds.var, A, q, K)
        }
        assign(A, q, K) {
            return this._leafNode(new ZU1(A, q, K))
        }
        add(A, q) {
            return this._leafNode(new j5A(A, TT.operators.ADD, q))
        }
        code(A) {
            if (typeof A == "function") A();
            else if (A !== YY.nil) this._leafNode(new X5A(A));
            return this
        }
        object(...A) {
            let q = ["{"];
            for (let [K, Y] of A) {
                if (q.length > 1) q.push(",");
                if (q.push(K), K !== Y || this.opts.es5) q.push(":"), (0, YY.addCodeArg)(q, Y)
            }
            return q.push("}"), new YY._Code(q)
        }
        if (A, q, K) {
            if (this._blockNode(new up(A)), q && K) this.code(q).else().code(K).endIf();
            else if (q) this.code(q).endIf();
            else if (K) throw Error('CodeGen: "else" body without "then" body');
            return this
        }
        elseIf(A) {
            return this._elseNode(new up(A))
        } else() {
            return this._elseNode(new By6)
        }
        endIf() {
            return this._endBlockNode(up, By6)
        }
        _for(A, q) {
            if (this._blockNode(A), q) this.code(q).endFor();
            return this
        }
        for (A, q) {
            return this._for(new W5A(A), q)
        }
        forRange(A, q, K, Y, z = this.opts.es5 ? ES.varKinds.var : ES.varKinds.let) {
            let _ = this._scope.toName(A);
            return this._for(new Z5A(z, _, q, K), () => Y(_))
        }
        forOf(A, q, K, Y = ES.varKinds.const) {
            let z = this._scope.toName(A);
            if (this.opts.es5) {
                let _ = q instanceof YY.Name ? q : this.var("_arr", q);
                return this.forRange("_i", 0, YY._`${_}.length`, (w) => {
                    this.var(z, YY._`${_}[${w}]`), K(z)
                })
            }
            return this._for(new PU1("of", Y, z, q), () => K(z))
        }
        forIn(A, q, K, Y = this.opts.es5 ? ES.varKinds.var : ES.varKinds.const) {
            if (this.opts.ownProperties) return this.forOf(A, YY._`Object.keys(${q})`, K);
            let z = this._scope.toName(A);
            return this._for(new PU1("in", Y, z, q), () => K(z))
        }
        endFor() {
            return this._endBlockNode(QO6)
        }
        label(A) {
            return this._leafNode(new J5A(A))
        }
        break (A) {
            return this._leafNode(new M5A(A))
        }
        return (A) {
            let q = new c61;
            if (this._blockNode(q), this.code(A), q.nodes.length !== 1) throw Error('CodeGen: "return" should have one node');
            return this._endBlockNode(c61)
        }
        try (A, q, K) {
            if (!q && !K) throw Error('CodeGen: "try" without "catch" and "finally"');
            let Y = new G5A;
            if (this._blockNode(Y), this.code(A), q) {
                let z = this.name("e");
                this._currNode = Y.catch = new l61(z), q(z)
            }
            if (K) this._currNode = Y.finally = new i61, this.code(K);
            return this._endBlockNode(l61, i61)
        }
        throw (A) {
            return this._leafNode(new D5A(A))
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
        func(A, q = YY.nil, K, Y) {
            if (this._blockNode(new d61(A, q, K)), Y) this.code(Y).endFunc();
            return this
        }
        endFunc() {
            return this._endBlockNode(d61)
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
            if (!(q instanceof up)) throw Error('CodeGen: "else" without "if"');
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
    TT.CodeGen = f5A;

    function SA6(A, q) {
        for (let K in q) A[K] = (A[K] || 0) + (q[K] || 0);
        return A
    }

    function n61(A, q) {
        return q instanceof YY._CodeOrName ? SA6(A, q.names) : A
    }

    function UO6(A, q, K) {
        if (A instanceof YY.Name) return Y(A);
        if (!z(A)) return A;
        return new YY._Code(A._items.reduce((_, w) => {
            if (w instanceof YY.Name) w = Y(w);
            if (w instanceof YY._Code) _.push(...w._items);
            else _.push(w);
            return _
        }, []));

        function Y(_) {
            let w = K[_.str];
            if (w === void 0 || q[_.str] !== 1) return _;
            return delete q[_.str], w
        }

        function z(_) {
            return _ instanceof YY._Code && _._items.some((w) => w instanceof YY.Name && q[w.str] === 1 && K[w.str] !== void 0)
        }
    }

    function E1K(A, q) {
        for (let K in q) A[K] = (A[K] || 0) - (q[K] || 0)
    }

    function T5A(A) {
        return typeof A == "boolean" || typeof A == "number" || A === null ? !A : YY._`!${WU1(A)}`
    }
    TT.not = T5A;
    var y1K = v5A(TT.operators.AND);

    function L1K(...A) {
        return A.reduce(y1K)
    }
    TT.and = L1K;
    var R1K = v5A(TT.operators.OR);

    function h1K(...A) {
        return A.reduce(R1K)
    }
    TT.or = h1K;

    function v5A(A) {
        return (q, K) => q === YY.nil ? K : K === YY.nil ? q : YY._`${WU1(q)} ${A} ${WU1(K)}`
    }

    function WU1(A) {
        return A instanceof YY.Name ? A : YY._`(${A})`
    }
})
// @from(Ln 23979, Col 4)
nY = x((S5A) => {
    Object.defineProperty(S5A, "__esModule", {
        value: !0
    });
    S5A.checkStrictMode = S5A.getErrorPath = S5A.Type = S5A.useFunc = S5A.setEvaluated = S5A.evaluatedPropsToName = S5A.mergeEvaluated = S5A.eachItem = S5A.unescapeJsonPointer = S5A.escapeJsonPointer = S5A.escapeFragment = S5A.unescapeFragment = S5A.schemaRefOrVal = S5A.schemaHasRulesButRef = S5A.schemaHasRules = S5A.checkUnknownRules = S5A.alwaysValidSchema = S5A.toHash = void 0;
    var x2 = y3(),
        b1K = my6();

    function x1K(A) {
        let q = {};
        for (let K of A) q[K] = !0;
        return q
    }
    S5A.toHash = x1K;

    function u1K(A, q) {
        if (typeof q == "boolean") return q;
        if (Object.keys(q).length === 0) return !0;
        return E5A(A, q), !y5A(q, A.self.RULES.all)
    }
    S5A.alwaysValidSchema = u1K;

    function E5A(A, q = A.schema) {
        let {
            opts: K,
            self: Y
        } = A;
        if (!K.strictSchema) return;
        if (typeof q === "boolean") return;
        let z = Y.RULES.keywords;
        for (let _ in q)
            if (!z[_]) h5A(A, `unknown keyword: "${_}"`)
    }
    S5A.checkUnknownRules = E5A;

    function y5A(A, q) {
        if (typeof A == "boolean") return !A;
        for (let K in A)
            if (q[K]) return !0;
        return !1
    }
    S5A.schemaHasRules = y5A;

    function m1K(A, q) {
        if (typeof A == "boolean") return !A;
        for (let K in A)
            if (K !== "$ref" && q.all[K]) return !0;
        return !1
    }
    S5A.schemaHasRulesButRef = m1K;

    function B1K({
        topSchemaRef: A,
        schemaPath: q
    }, K, Y, z) {
        if (!z) {
            if (typeof K == "number" || typeof K == "boolean") return K;
            if (typeof K == "string") return x2._`${K}`
        }
        return x2._`${A}${q}${(0,x2.getProperty)(Y)}`
    }
    S5A.schemaRefOrVal = B1K;

    function g1K(A) {
        return L5A(decodeURIComponent(A))
    }
    S5A.unescapeFragment = g1K;

    function F1K(A) {
        return encodeURIComponent(fU1(A))
    }
    S5A.escapeFragment = F1K;

    function fU1(A) {
        if (typeof A == "number") return `${A}`;
        return A.replace(/~/g, "~0").replace(/\//g, "~1")
    }
    S5A.escapeJsonPointer = fU1;

    function L5A(A) {
        return A.replace(/~1/g, "/").replace(/~0/g, "~")
    }
    S5A.unescapeJsonPointer = L5A;

    function p1K(A, q) {
        if (Array.isArray(A))
            for (let K of A) q(K);
        else q(A)
    }
    S5A.eachItem = p1K;

    function V5A({
        mergeNames: A,
        mergeToName: q,
        mergeValues: K,
        resultToName: Y
    }) {
        return (z, _, w, O) => {
            let $ = w === void 0 ? _ : w instanceof x2.Name ? (_ instanceof x2.Name ? A(z, _, w) : q(z, _, w), w) : _ instanceof x2.Name ? (q(z, w, _), _) : K(_, w);
            return O === x2.Name && !($ instanceof x2.Name) ? Y(z, $) : $
        }
    }
    S5A.mergeEvaluated = {
        props: V5A({
            mergeNames: (A, q, K) => A.if(x2._`${K} !== true && ${q} !== undefined`, () => {
                A.if(x2._`${q} === true`, () => A.assign(K, !0), () => A.assign(K, x2._`${K} || {}`).code(x2._`Object.assign(${K}, ${q})`))
            }),
            mergeToName: (A, q, K) => A.if(x2._`${K} !== true`, () => {
                if (q === !0) A.assign(K, !0);
                else A.assign(K, x2._`${K} || {}`), TU1(A, K, q)
            }),
            mergeValues: (A, q) => A === !0 ? !0 : {
                ...A,
                ...q
            },
            resultToName: R5A
        }),
        items: V5A({
            mergeNames: (A, q, K) => A.if(x2._`${K} !== true && ${q} !== undefined`, () => A.assign(K, x2._`${q} === true ? true : ${K} > ${q} ? ${K} : ${q}`)),
            mergeToName: (A, q, K) => A.if(x2._`${K} !== true`, () => A.assign(K, q === !0 ? !0 : x2._`${K} > ${q} ? ${K} : ${q}`)),
            mergeValues: (A, q) => A === !0 ? !0 : Math.max(A, q),
            resultToName: (A, q) => A.var("items", q)
        })
    };

    function R5A(A, q) {
        if (q === !0) return A.var("props", !0);
        let K = A.var("props", x2._`{}`);
        if (q !== void 0) TU1(A, K, q);
        return K
    }
    S5A.evaluatedPropsToName = R5A;

    function TU1(A, q, K) {
        Object.keys(K).forEach((Y) => A.assign(x2._`${q}${(0,x2.getProperty)(Y)}`, !0))
    }
    S5A.setEvaluated = TU1;
    var k5A = {};

    function Q1K(A, q) {
        return A.scopeValue("func", {
            ref: q,
            code: k5A[q.code] || (k5A[q.code] = new b1K._Code(q.code))
        })
    }
    S5A.useFunc = Q1K;
    var GU1;
    (function(A) {
        A[A.Num = 0] = "Num", A[A.Str = 1] = "Str"
    })(GU1 || (S5A.Type = GU1 = {}));

    function U1K(A, q, K) {
        if (A instanceof x2.Name) {
            let Y = q === GU1.Num;
            return K ? Y ? x2._`"[" + ${A} + "]"` : x2._`"['" + ${A} + "']"` : Y ? x2._`"/" + ${A}` : x2._`"/" + ${A}.replace(/~/g, "~0").replace(/\\//g, "~1")`
        }
        return K ? (0, x2.getProperty)(A).toString() : "/" + fU1(A)
    }
    S5A.getErrorPath = U1K;

    function h5A(A, q, K = A.opts.strictSchema) {
        if (!K) return;
        if (q = `strict mode: ${q}`, K === !0) throw Error(q);
        A.self.logger.warn(q)
    }
    S5A.checkStrictMode = h5A
})
// @from(Ln 24146, Col 4)
mp = x((I5A) => {
    Object.defineProperty(I5A, "__esModule", {
        value: !0
    });
    var PW = y3(),
        w8K = {
            data: new PW.Name("data"),
            valCxt: new PW.Name("valCxt"),
            instancePath: new PW.Name("instancePath"),
            parentData: new PW.Name("parentData"),
            parentDataProperty: new PW.Name("parentDataProperty"),
            rootData: new PW.Name("rootData"),
            dynamicAnchors: new PW.Name("dynamicAnchors"),
            vErrors: new PW.Name("vErrors"),
            errors: new PW.Name("errors"),
            this: new PW.Name("this"),
            self: new PW.Name("self"),
            scope: new PW.Name("scope"),
            json: new PW.Name("json"),
            jsonPos: new PW.Name("jsonPos"),
            jsonLen: new PW.Name("jsonLen"),
            jsonPart: new PW.Name("jsonPart")
        };
    I5A.default = w8K
})
// @from(Ln 24171, Col 4)
gy6 = x((m5A) => {
    Object.defineProperty(m5A, "__esModule", {
        value: !0
    });
    m5A.extendErrors = m5A.resetErrorsCount = m5A.reportExtraError = m5A.reportError = m5A.keyword$DataError = m5A.keywordError = void 0;
    var VY = y3(),
        s61 = nY(),
        HG = mp();
    m5A.keywordError = {
        message: ({
            keyword: A
        }) => VY.str`must pass "${A}" keyword validation`
    };
    m5A.keyword$DataError = {
        message: ({
            keyword: A,
            schemaType: q
        }) => q ? VY.str`"${A}" keyword must be ${q} ($data)` : VY.str`"${A}" keyword is invalid ($data)`
    };

    function $8K(A, q = m5A.keywordError, K, Y) {
        let {
            it: z
        } = A, {
            gen: _,
            compositeRule: w,
            allErrors: O
        } = z, $ = u5A(A, q, K);
        if (Y !== null && Y !== void 0 ? Y : w || O) b5A(_, $);
        else x5A(z, VY._`[${$}]`)
    }
    m5A.reportError = $8K;

    function H8K(A, q = m5A.keywordError, K) {
        let {
            it: Y
        } = A, {
            gen: z,
            compositeRule: _,
            allErrors: w
        } = Y, O = u5A(A, q, K);
        if (b5A(z, O), !(_ || w)) x5A(Y, HG.default.vErrors)
    }
    m5A.reportExtraError = H8K;

    function j8K(A, q) {
        A.assign(HG.default.errors, q), A.if(VY._`${HG.default.vErrors} !== null`, () => A.if(q, () => A.assign(VY._`${HG.default.vErrors}.length`, q), () => A.assign(HG.default.vErrors, null)))
    }
    m5A.resetErrorsCount = j8K;

    function J8K({
        gen: A,
        keyword: q,
        schemaValue: K,
        data: Y,
        errsCount: z,
        it: _
    }) {
        if (z === void 0) throw Error("ajv implementation error");
        let w = A.name("err");
        A.forRange("i", z, HG.default.errors, (O) => {
            if (A.const(w, VY._`${HG.default.vErrors}[${O}]`), A.if(VY._`${w}.instancePath === undefined`, () => A.assign(VY._`${w}.instancePath`, (0, VY.strConcat)(HG.default.instancePath, _.errorPath))), A.assign(VY._`${w}.schemaPath`, VY.str`${_.errSchemaPath}/${q}`), _.opts.verbose) A.assign(VY._`${w}.schema`, K), A.assign(VY._`${w}.data`, Y)
        })
    }
    m5A.extendErrors = J8K;

    function b5A(A, q) {
        let K = A.const("err", q);
        A.if(VY._`${HG.default.vErrors} === null`, () => A.assign(HG.default.vErrors, VY._`[${K}]`), VY._`${HG.default.vErrors}.push(${K})`), A.code(VY._`${HG.default.errors}++`)
    }

    function x5A(A, q) {
        let {
            gen: K,
            validateName: Y,
            schemaEnv: z
        } = A;
        if (z.$async) K.throw(VY._`new ${A.ValidationError}(${q})`);
        else K.assign(VY._`${Y}.errors`, q), K.return(!1)
    }
    var CA6 = {
        keyword: new VY.Name("keyword"),
        schemaPath: new VY.Name("schemaPath"),
        params: new VY.Name("params"),
        propertyName: new VY.Name("propertyName"),
        message: new VY.Name("message"),
        schema: new VY.Name("schema"),
        parentSchema: new VY.Name("parentSchema")
    };

    function u5A(A, q, K) {
        let {
            createErrors: Y
        } = A.it;
        if (Y === !1) return VY._`{}`;
        return M8K(A, q, K)
    }

    function M8K(A, q, K = {}) {
        let {
            gen: Y,
            it: z
        } = A, _ = [D8K(z, K), X8K(A, K)];
        return P8K(A, q, _), Y.object(..._)
    }

    function D8K({
        errorPath: A
    }, {
        instancePath: q
    }) {
        let K = q ? VY.str`${A}${(0,s61.getErrorPath)(q,s61.Type.Str)}` : A;
        return [HG.default.instancePath, (0, VY.strConcat)(HG.default.instancePath, K)]
    }

    function X8K({
        keyword: A,
        it: {
            errSchemaPath: q
        }
    }, {
        schemaPath: K,
        parentSchema: Y
    }) {
        let z = Y ? q : VY.str`${q}/${A}`;
        if (K) z = VY.str`${z}${(0,s61.getErrorPath)(K,s61.Type.Str)}`;
        return [CA6.schemaPath, z]
    }

    function P8K(A, {
        params: q,
        message: K
    }, Y) {
        let {
            keyword: z,
            data: _,
            schemaValue: w,
            it: O
        } = A, {
            opts: $,
            propertyName: H,
            topSchemaRef: j,
            schemaPath: J
        } = O;
        if (Y.push([CA6.keyword, z], [CA6.params, typeof q == "function" ? q(A) : q || VY._`{}`]), $.messages) Y.push([CA6.message, typeof K == "function" ? K(A) : K]);
        if ($.verbose) Y.push([CA6.schema, w], [CA6.parentSchema, VY._`${j}${J}`], [HG.default.data, _]);
        if (H) Y.push([CA6.propertyName, H])
    }
})
// @from(Ln 24320, Col 4)
Q5A = x((F5A) => {
    Object.defineProperty(F5A, "__esModule", {
        value: !0
    });
    F5A.boolOrEmptySchema = F5A.topBoolOrEmptySchema = void 0;
    var T8K = gy6(),
        v8K = y3(),
        N8K = mp(),
        V8K = {
            message: "boolean schema is false"
        };

    function k8K(A) {
        let {
            gen: q,
            schema: K,
            validateName: Y
        } = A;
        if (K === !1) g5A(A, !1);
        else if (typeof K == "object" && K.$async === !0) q.return(N8K.default.data);
        else q.assign(v8K._`${Y}.errors`, null), q.return(!0)
    }
    F5A.topBoolOrEmptySchema = k8K;

    function E8K(A, q) {
        let {
            gen: K,
            schema: Y
        } = A;
        if (Y === !1) K.var(q, !1), g5A(A);
        else K.var(q, !0)
    }
    F5A.boolOrEmptySchema = E8K;

    function g5A(A, q) {
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
        (0, T8K.reportError)(z, V8K, void 0, q)
    }
})
// @from(Ln 24371, Col 4)
NU1 = x((U5A) => {
    Object.defineProperty(U5A, "__esModule", {
        value: !0
    });
    U5A.getRules = U5A.isJSONType = void 0;
    var L8K = ["string", "number", "integer", "boolean", "null", "object", "array"],
        R8K = new Set(L8K);

    function h8K(A) {
        return typeof A == "string" && R8K.has(A)
    }
    U5A.isJSONType = h8K;

    function S8K() {
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
    U5A.getRules = S8K
})
// @from(Ln 24422, Col 4)
VU1 = x((i5A) => {
    Object.defineProperty(i5A, "__esModule", {
        value: !0
    });
    i5A.shouldUseRule = i5A.shouldUseGroup = i5A.schemaHasRulesForType = void 0;

    function I8K({
        schema: A,
        self: q
    }, K) {
        let Y = q.RULES.types[K];
        return Y && Y !== !0 && c5A(A, Y)
    }
    i5A.schemaHasRulesForType = I8K;

    function c5A(A, q) {
        return q.rules.some((K) => l5A(A, K))
    }
    i5A.shouldUseGroup = c5A;

    function l5A(A, q) {
        var K;
        return A[q.keyword] !== void 0 || ((K = q.definition.implements) === null || K === void 0 ? void 0 : K.some((Y) => A[Y] !== void 0))
    }
    i5A.shouldUseRule = l5A
})
// @from(Ln 24448, Col 4)
Fy6 = x((s5A) => {
    Object.defineProperty(s5A, "__esModule", {
        value: !0
    });
    s5A.reportTypeError = s5A.checkDataTypes = s5A.checkDataType = s5A.coerceAndCheckDataType = s5A.getJSONTypes = s5A.getSchemaTypes = s5A.DataType = void 0;
    var u8K = NU1(),
        m8K = VU1(),
        B8K = gy6(),
        J3 = y3(),
        r5A = nY(),
        dO6;
    (function(A) {
        A[A.Correct = 0] = "Correct", A[A.Wrong = 1] = "Wrong"
    })(dO6 || (s5A.DataType = dO6 = {}));

    function g8K(A) {
        let q = o5A(A.type);
        if (q.includes("null")) {
            if (A.nullable === !1) throw Error("type: null contradicts nullable: false")
        } else {
            if (!q.length && A.nullable !== void 0) throw Error('"nullable" cannot be used without "type"');
            if (A.nullable === !0) q.push("null")
        }
        return q
    }
    s5A.getSchemaTypes = g8K;

    function o5A(A) {
        let q = Array.isArray(A) ? A : A ? [A] : [];
        if (q.every(u8K.isJSONType)) return q;
        throw Error("type must be JSONType or JSONType[]: " + q.join(","))
    }
    s5A.getJSONTypes = o5A;

    function F8K(A, q) {
        let {
            gen: K,
            data: Y,
            opts: z
        } = A, _ = p8K(q, z.coerceTypes), w = q.length > 0 && !(_.length === 0 && q.length === 1 && (0, m8K.schemaHasRulesForType)(A, q[0]));
        if (w) {
            let O = EU1(q, Y, z.strictNumbers, dO6.Wrong);
            K.if(O, () => {
                if (_.length) Q8K(A, q, _);
                else yU1(A)
            })
        }
        return w
    }
    s5A.coerceAndCheckDataType = F8K;
    var a5A = new Set(["string", "number", "integer", "boolean", "null"]);

    function p8K(A, q) {
        return q ? A.filter((K) => a5A.has(K) || q === "array" && K === "array") : []
    }

    function Q8K(A, q, K) {
        let {
            gen: Y,
            data: z,
            opts: _
        } = A, w = Y.let("dataType", J3._`typeof ${z}`), O = Y.let("coerced", J3._`undefined`);
        if (_.coerceTypes === "array") Y.if(J3._`${w} == 'object' && Array.isArray(${z}) && ${z}.length == 1`, () => Y.assign(z, J3._`${z}[0]`).assign(w, J3._`typeof ${z}`).if(EU1(q, z, _.strictNumbers), () => Y.assign(O, z)));
        Y.if(J3._`${O} !== undefined`);
        for (let H of K)
            if (a5A.has(H) || H === "array" && _.coerceTypes === "array") $(H);
        Y.else(), yU1(A), Y.endIf(), Y.if(J3._`${O} !== undefined`, () => {
            Y.assign(z, O), U8K(A, O)
        });

        function $(H) {
            switch (H) {
                case "string":
                    Y.elseIf(J3._`${w} == "number" || ${w} == "boolean"`).assign(O, J3._`"" + ${z}`).elseIf(J3._`${z} === null`).assign(O, J3._`""`);
                    return;
                case "number":
                    Y.elseIf(J3._`${w} == "boolean" || ${z} === null
              || (${w} == "string" && ${z} && ${z} == +${z})`).assign(O, J3._`+${z}`);
                    return;
                case "integer":
                    Y.elseIf(J3._`${w} === "boolean" || ${z} === null
              || (${w} === "string" && ${z} && ${z} == +${z} && !(${z} % 1))`).assign(O, J3._`+${z}`);
                    return;
                case "boolean":
                    Y.elseIf(J3._`${z} === "false" || ${z} === 0 || ${z} === null`).assign(O, !1).elseIf(J3._`${z} === "true" || ${z} === 1`).assign(O, !0);
                    return;
                case "null":
                    Y.elseIf(J3._`${z} === "" || ${z} === 0 || ${z} === false`), Y.assign(O, null);
                    return;
                case "array":
                    Y.elseIf(J3._`${w} === "string" || ${w} === "number"
              || ${w} === "boolean" || ${z} === null`).assign(O, J3._`[${z}]`)
            }
        }
    }

    function U8K({
        gen: A,
        parentData: q,
        parentDataProperty: K
    }, Y) {
        A.if(J3._`${q} !== undefined`, () => A.assign(J3._`${q}[${K}]`, Y))
    }

    function kU1(A, q, K, Y = dO6.Correct) {
        let z = Y === dO6.Correct ? J3.operators.EQ : J3.operators.NEQ,
            _;
        switch (A) {
            case "null":
                return J3._`${q} ${z} null`;
            case "array":
                _ = J3._`Array.isArray(${q})`;
                break;
            case "object":
                _ = J3._`${q} && typeof ${q} == "object" && !Array.isArray(${q})`;
                break;
            case "integer":
                _ = w(J3._`!(${q} % 1) && !isNaN(${q})`);
                break;
            case "number":
                _ = w();
                break;
            default:
                return J3._`typeof ${q} ${z} ${A}`
        }
        return Y === dO6.Correct ? _ : (0, J3.not)(_);

        function w(O = J3.nil) {
            return (0, J3.and)(J3._`typeof ${q} == "number"`, O, K ? J3._`isFinite(${q})` : J3.nil)
        }
    }
    s5A.checkDataType = kU1;

    function EU1(A, q, K, Y) {
        if (A.length === 1) return kU1(A[0], q, K, Y);
        let z, _ = (0, r5A.toHash)(A);
        if (_.array && _.object) {
            let w = J3._`typeof ${q} != "object"`;
            z = _.null ? w : J3._`!${q} || ${w}`, delete _.null, delete _.array, delete _.object
        } else z = J3.nil;
        if (_.number) delete _.integer;
        for (let w in _) z = (0, J3.and)(z, kU1(w, q, K, Y));
        return z
    }
    s5A.checkDataTypes = EU1;
    var d8K = {
        message: ({
            schema: A
        }) => `must be ${A}`,
        params: ({
            schema: A,
            schemaValue: q
        }) => typeof A == "string" ? J3._`{type: ${A}}` : J3._`{type: ${q}}`
    };

    function yU1(A) {
        let q = c8K(A);
        (0, B8K.reportError)(q, d8K)
    }
    s5A.reportTypeError = yU1;

    function c8K(A) {
        let {
            gen: q,
            data: K,
            schema: Y
        } = A, z = (0, r5A.schemaRefOrVal)(A, Y, "type");
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
// @from(Ln 24628, Col 4)
K3A = x((A3A) => {
    Object.defineProperty(A3A, "__esModule", {
        value: !0
    });
    A3A.assignDefaults = void 0;
    var cO6 = y3(),
        s8K = nY();

    function t8K(A, q) {
        let {
            properties: K,
            items: Y
        } = A.schema;
        if (q === "object" && K)
            for (let z in K) e5A(A, z, K[z].default);
        else if (q === "array" && Array.isArray(Y)) Y.forEach((z, _) => e5A(A, _, z.default))
    }
    A3A.assignDefaults = t8K;

    function e5A(A, q, K) {
        let {
            gen: Y,
            compositeRule: z,
            data: _,
            opts: w
        } = A;
        if (K === void 0) return;
        let O = cO6._`${_}${(0,cO6.getProperty)(q)}`;
        if (z) {
            (0, s8K.checkStrictMode)(A, `default is ignored for: ${O}`);
            return
        }
        let $ = cO6._`${O} === undefined`;
        if (w.useDefaults === "empty") $ = cO6._`${$} || ${O} === null || ${O} === ""`;
        Y.if($, cO6._`${O} = ${(0,cO6.stringify)(K)}`)
    }
})
// @from(Ln 24665, Col 4)
_y = x((_3A) => {
    Object.defineProperty(_3A, "__esModule", {
        value: !0
    });
    _3A.validateUnion = _3A.validateArray = _3A.usePattern = _3A.callValidateCode = _3A.schemaProperties = _3A.allSchemaProperties = _3A.noPropertyInData = _3A.propertyInData = _3A.isOwnProperty = _3A.hasPropFunc = _3A.reportMissingProp = _3A.checkMissingProp = _3A.checkReportMissingProp = void 0;
    var zO = y3(),
        LU1 = nY(),
        nn = mp(),
        e8K = nY();

    function AAK(A, q) {
        let {
            gen: K,
            data: Y,
            it: z
        } = A;
        K.if(hU1(K, Y, q, z.opts.ownProperties), () => {
            A.setParams({
                missingProperty: zO._`${q}`
            }, !0), A.error()
        })
    }
    _3A.checkReportMissingProp = AAK;

    function qAK({
        gen: A,
        data: q,
        it: {
            opts: K
        }
    }, Y, z) {
        return (0, zO.or)(...Y.map((_) => (0, zO.and)(hU1(A, q, _, K.ownProperties), zO._`${z} = ${_}`)))
    }
    _3A.checkMissingProp = qAK;

    function KAK(A, q) {
        A.setParams({
            missingProperty: q
        }, !0), A.error()
    }
    _3A.reportMissingProp = KAK;

    function Y3A(A) {
        return A.scopeValue("func", {
            ref: Object.prototype.hasOwnProperty,
            code: zO._`Object.prototype.hasOwnProperty`
        })
    }
    _3A.hasPropFunc = Y3A;

    function RU1(A, q, K) {
        return zO._`${Y3A(A)}.call(${q}, ${K})`
    }
    _3A.isOwnProperty = RU1;

    function YAK(A, q, K, Y) {
        let z = zO._`${q}${(0,zO.getProperty)(K)} !== undefined`;
        return Y ? zO._`${z} && ${RU1(A,q,K)}` : z
    }
    _3A.propertyInData = YAK;

    function hU1(A, q, K, Y) {
        let z = zO._`${q}${(0,zO.getProperty)(K)} === undefined`;
        return Y ? (0, zO.or)(z, (0, zO.not)(RU1(A, q, K))) : z
    }
    _3A.noPropertyInData = hU1;

    function z3A(A) {
        return A ? Object.keys(A).filter((q) => q !== "__proto__") : []
    }
    _3A.allSchemaProperties = z3A;

    function zAK(A, q) {
        return z3A(q).filter((K) => !(0, LU1.alwaysValidSchema)(A, q[K]))
    }
    _3A.schemaProperties = zAK;

    function _AK({
        schemaCode: A,
        data: q,
        it: {
            gen: K,
            topSchemaRef: Y,
            schemaPath: z,
            errorPath: _
        },
        it: w
    }, O, $, H) {
        let j = H ? zO._`${A}, ${q}, ${Y}${z}` : q,
            J = [
                [nn.default.instancePath, (0, zO.strConcat)(nn.default.instancePath, _)],
                [nn.default.parentData, w.parentData],
                [nn.default.parentDataProperty, w.parentDataProperty],
                [nn.default.rootData, nn.default.rootData]
            ];
        if (w.opts.dynamicRef) J.push([nn.default.dynamicAnchors, nn.default.dynamicAnchors]);
        let M = zO._`${j}, ${K.object(...J)}`;
        return $ !== zO.nil ? zO._`${O}.call(${$}, ${M})` : zO._`${O}(${M})`
    }
    _3A.callValidateCode = _AK;
    var wAK = zO._`new RegExp`;

    function OAK({
        gen: A,
        it: {
            opts: q
        }
    }, K) {
        let Y = q.unicodeRegExp ? "u" : "",
            {
                regExp: z
            } = q.code,
            _ = z(K, Y);
        return A.scopeValue("pattern", {
            key: _.toString(),
            ref: _,
            code: zO._`${z.code==="new RegExp"?wAK:(0,e8K.useFunc)(A,z)}(${K}, ${Y})`
        })
    }
    _3A.usePattern = OAK;

    function $AK(A) {
        let {
            gen: q,
            data: K,
            keyword: Y,
            it: z
        } = A, _ = q.name("valid");
        if (z.allErrors) {
            let O = q.let("valid", !0);
            return w(() => q.assign(O, !1)), O
        }
        return q.var(_, !0), w(() => q.break()), _;

        function w(O) {
            let $ = q.const("len", zO._`${K}.length`);
            q.forRange("i", 0, $, (H) => {
                A.subschema({
                    keyword: Y,
                    dataProp: H,
                    dataPropType: LU1.Type.Num
                }, _), q.if((0, zO.not)(_), O)
            })
        }
    }
    _3A.validateArray = $AK;

    function HAK(A) {
        let {
            gen: q,
            schema: K,
            keyword: Y,
            it: z
        } = A;
        if (!Array.isArray(K)) throw Error("ajv implementation error");
        if (K.some(($) => (0, LU1.alwaysValidSchema)(z, $)) && !z.opts.unevaluated) return;
        let w = q.let("valid", !1),
            O = q.name("_valid");
        q.block(() => K.forEach(($, H) => {
            let j = A.subschema({
                keyword: Y,
                schemaProp: H,
                compositeRule: !0
            }, O);
            if (q.assign(w, zO._`${w} || ${O}`), !A.mergeValidEvaluated(j, O)) q.if((0, zO.not)(w))
        })), A.result(w, () => A.reset(), () => A.error(!0))
    }
    _3A.validateUnion = HAK
})
// @from(Ln 24834, Col 4)
J3A = x((H3A) => {
    Object.defineProperty(H3A, "__esModule", {
        value: !0
    });
    H3A.validateKeywordUsage = H3A.validSchemaType = H3A.funcKeywordCode = H3A.macroKeywordCode = void 0;
    var jG = y3(),
        IA6 = mp(),
        NAK = _y(),
        VAK = gy6();

    function kAK(A, q) {
        let {
            gen: K,
            keyword: Y,
            schema: z,
            parentSchema: _,
            it: w
        } = A, O = q.macro.call(w.self, z, _, w), $ = $3A(K, Y, O);
        if (w.opts.validateSchema !== !1) w.self.validateSchema(O, !0);
        let H = K.name("valid");
        A.subschema({
            schema: O,
            schemaPath: jG.nil,
            errSchemaPath: `${w.errSchemaPath}/${Y}`,
            topSchemaRef: $,
            compositeRule: !0
        }, H), A.pass(H, () => A.error(!0))
    }
    H3A.macroKeywordCode = kAK;

    function EAK(A, q) {
        var K;
        let {
            gen: Y,
            keyword: z,
            schema: _,
            parentSchema: w,
            $data: O,
            it: $
        } = A;
        LAK($, q);
        let H = !O && q.compile ? q.compile.call($.self, _, w, $) : q.validate,
            j = $3A(Y, z, H),
            J = Y.let("valid");
        A.block$data(J, M), A.ok((K = q.valid) !== null && K !== void 0 ? K : J);

        function M() {
            if (q.errors === !1) {
                if (P(), q.modifying) O3A(A);
                W(() => A.error())
            } else {
                let Z = q.async ? D() : X();
                if (q.modifying) O3A(A);
                W(() => yAK(A, Z))
            }
        }

        function D() {
            let Z = Y.let("ruleErrs", null);
            return Y.try(() => P(jG._`await `), (G) => Y.assign(J, !1).if(jG._`${G} instanceof ${$.ValidationError}`, () => Y.assign(Z, jG._`${G}.errors`), () => Y.throw(G))), Z
        }

        function X() {
            let Z = jG._`${j}.errors`;
            return Y.assign(Z, null), P(jG.nil), Z
        }

        function P(Z = q.async ? jG._`await ` : jG.nil) {
            let G = $.opts.passContext ? IA6.default.this : IA6.default.self,
                f = !(("compile" in q) && !O || q.schema === !1);
            Y.assign(J, jG._`${Z}${(0,NAK.callValidateCode)(A,j,G,f)}`, q.modifying)
        }

        function W(Z) {
            var G;
            Y.if((0, jG.not)((G = q.valid) !== null && G !== void 0 ? G : J), Z)
        }
    }
    H3A.funcKeywordCode = EAK;

    function O3A(A) {
        let {
            gen: q,
            data: K,
            it: Y
        } = A;
        q.if(Y.parentData, () => q.assign(K, jG._`${Y.parentData}[${Y.parentDataProperty}]`))
    }

    function yAK(A, q) {
        let {
            gen: K
        } = A;
        K.if(jG._`Array.isArray(${q})`, () => {
            K.assign(IA6.default.vErrors, jG._`${IA6.default.vErrors} === null ? ${q} : ${IA6.default.vErrors}.concat(${q})`).assign(IA6.default.errors, jG._`${IA6.default.vErrors}.length`), (0, VAK.extendErrors)(A)
        }, () => A.error())
    }

    function LAK({
        schemaEnv: A
    }, q) {
        if (q.async && !A.$async) throw Error("async keyword in sync schema")
    }

    function $3A(A, q, K) {
        if (K === void 0) throw Error(`keyword "${q}" failed to compile`);
        return A.scopeValue("keyword", typeof K == "function" ? {
            ref: K
        } : {
            ref: K,
            code: (0, jG.stringify)(K)
        })
    }

    function RAK(A, q, K = !1) {
        return !q.length || q.some((Y) => Y === "array" ? Array.isArray(A) : Y === "object" ? A && typeof A == "object" && !Array.isArray(A) : typeof A == Y || K && typeof A > "u")
    }
    H3A.validSchemaType = RAK;

    function hAK({
        schema: A,
        opts: q,
        self: K,
        errSchemaPath: Y
    }, z, _) {
        if (Array.isArray(z.keyword) ? !z.keyword.includes(_) : z.keyword !== _) throw Error("ajv implementation error");
        let w = z.dependencies;
        if (w === null || w === void 0 ? void 0 : w.some((O) => !Object.prototype.hasOwnProperty.call(A, O))) throw Error(`parent schema must have dependencies of ${_}: ${w.join(",")}`);
        if (z.validateSchema) {
            if (!z.validateSchema(A[_])) {
                let $ = `keyword "${_}" value is invalid at path "${Y}": ` + K.errorsText(z.validateSchema.errors);
                if (q.validateSchema === "log") K.logger.error($);
                else throw Error($)
            }
        }
    }
    H3A.validateKeywordUsage = hAK
})
// @from(Ln 24972, Col 4)
P3A = x((D3A) => {
    Object.defineProperty(D3A, "__esModule", {
        value: !0
    });
    D3A.extendSubschemaMode = D3A.extendSubschemaData = D3A.getSubschema = void 0;
    var gx = y3(),
        M3A = nY();

    function bAK(A, {
        keyword: q,
        schemaProp: K,
        schema: Y,
        schemaPath: z,
        errSchemaPath: _,
        topSchemaRef: w
    }) {
        if (q !== void 0 && Y !== void 0) throw Error('both "keyword" and "schema" passed, only one allowed');
        if (q !== void 0) {
            let O = A.schema[q];
            return K === void 0 ? {
                schema: O,
                schemaPath: gx._`${A.schemaPath}${(0,gx.getProperty)(q)}`,
                errSchemaPath: `${A.errSchemaPath}/${q}`
            } : {
                schema: O[K],
                schemaPath: gx._`${A.schemaPath}${(0,gx.getProperty)(q)}${(0,gx.getProperty)(K)}`,
                errSchemaPath: `${A.errSchemaPath}/${q}/${(0,M3A.escapeFragment)(K)}`
            }
        }
        if (Y !== void 0) {
            if (z === void 0 || _ === void 0 || w === void 0) throw Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
            return {
                schema: Y,
                schemaPath: z,
                topSchemaRef: w,
                errSchemaPath: _
            }
        }
        throw Error('either "keyword" or "schema" must be passed')
    }
    D3A.getSubschema = bAK;

    function xAK(A, q, {
        dataProp: K,
        dataPropType: Y,
        data: z,
        dataTypes: _,
        propertyName: w
    }) {
        if (z !== void 0 && K !== void 0) throw Error('both "data" and "dataProp" passed, only one allowed');
        let {
            gen: O
        } = q;
        if (K !== void 0) {
            let {
                errorPath: H,
                dataPathArr: j,
                opts: J
            } = q, M = O.let("data", gx._`${q.data}${(0,gx.getProperty)(K)}`, !0);
            $(M), A.errorPath = gx.str`${H}${(0,M3A.getErrorPath)(K,Y,J.jsPropertySyntax)}`, A.parentDataProperty = gx._`${K}`, A.dataPathArr = [...j, A.parentDataProperty]
        }
        if (z !== void 0) {
            let H = z instanceof gx.Name ? z : O.let("data", z, !0);
            if ($(H), w !== void 0) A.propertyName = w
        }
        if (_) A.dataTypes = _;

        function $(H) {
            A.data = H, A.dataLevel = q.dataLevel + 1, A.dataTypes = [], q.definedProperties = new Set, A.parentData = q.data, A.dataNames = [...q.dataNames, H]
        }
    }
    D3A.extendSubschemaData = xAK;

    function uAK(A, {
        jtdDiscriminator: q,
        jtdMetadata: K,
        compositeRule: Y,
        createErrors: z,
        allErrors: _
    }) {
        if (Y !== void 0) A.compositeRule = Y;
        if (z !== void 0) A.createErrors = z;
        if (_ !== void 0) A.allErrors = _;
        A.jtdDiscriminator = q, A.jtdMetadata = K
    }
    D3A.extendSubschemaMode = uAK
})
// @from(Ln 25059, Col 4)
SU1 = x((uFz, W3A) => {
    W3A.exports = function A(q, K) {
        if (q === K) return !0;
        if (q && K && typeof q == "object" && typeof K == "object") {
            if (q.constructor !== K.constructor) return !1;
            var Y, z, _;
            if (Array.isArray(q)) {
                if (Y = q.length, Y != K.length) return !1;
                for (z = Y; z-- !== 0;)
                    if (!A(q[z], K[z])) return !1;
                return !0
            }
            if (q.constructor === RegExp) return q.source === K.source && q.flags === K.flags;
            if (q.valueOf !== Object.prototype.valueOf) return q.valueOf() === K.valueOf();
            if (q.toString !== Object.prototype.toString) return q.toString() === K.toString();
            if (_ = Object.keys(q), Y = _.length, Y !== Object.keys(K).length) return !1;
            for (z = Y; z-- !== 0;)
                if (!Object.prototype.hasOwnProperty.call(K, _[z])) return !1;
            for (z = Y; z-- !== 0;) {
                var w = _[z];
                if (!A(q[w], K[w])) return !1
            }
            return !0
        }
        return q !== q && K !== K
    }
})
// @from(Ln 25086, Col 4)
G3A = x((mFz, Z3A) => {
    var rn = Z3A.exports = function(A, q, K) {
        if (typeof q == "function") K = q, q = {};
        K = q.cb || K;
        var Y = typeof K == "function" ? K : K.pre || function() {},
            z = K.post || function() {};
        t61(q, Y, z, A, "", A)
    };
    rn.keywords = {
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
    rn.arrayKeywords = {
        items: !0,
        allOf: !0,
        anyOf: !0,
        oneOf: !0
    };
    rn.propsKeywords = {
        $defs: !0,
        definitions: !0,
        properties: !0,
        patternProperties: !0,
        dependencies: !0
    };
    rn.skipKeywords = {
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

    function t61(A, q, K, Y, z, _, w, O, $, H) {
        if (Y && typeof Y == "object" && !Array.isArray(Y)) {
            q(Y, z, _, w, O, $, H);
            for (var j in Y) {
                var J = Y[j];
                if (Array.isArray(J)) {
                    if (j in rn.arrayKeywords)
                        for (var M = 0; M < J.length; M++) t61(A, q, K, J[M], z + "/" + j + "/" + M, _, z, j, Y, M)
                } else if (j in rn.propsKeywords) {
                    if (J && typeof J == "object")
                        for (var D in J) t61(A, q, K, J[D], z + "/" + j + "/" + gAK(D), _, z, j, Y, D)
                } else if (j in rn.keywords || A.allKeys && !(j in rn.skipKeywords)) t61(A, q, K, J, z + "/" + j, _, z, j, Y)
            }
            K(Y, z, _, w, O, $, H)
        }
    }

    function gAK(A) {
        return A.replace(/~/g, "~0").replace(/\//g, "~1")
    }
})
// @from(Ln 25160, Col 4)
py6 = x((N3A) => {
    Object.defineProperty(N3A, "__esModule", {
        value: !0
    });
    N3A.getSchemaRefs = N3A.resolveUrl = N3A.normalizeId = N3A._getFullPath = N3A.getFullPath = N3A.inlineRef = void 0;
    var FAK = nY(),
        pAK = SU1(),
        QAK = G3A(),
        UAK = new Set(["type", "format", "pattern", "maxLength", "minLength", "maxProperties", "minProperties", "maxItems", "minItems", "maximum", "minimum", "uniqueItems", "multipleOf", "required", "enum", "const"]);

    function dAK(A, q = !0) {
        if (typeof A == "boolean") return !0;
        if (q === !0) return !CU1(A);
        if (!q) return !1;
        return f3A(A) <= q
    }
    N3A.inlineRef = dAK;
    var cAK = new Set(["$ref", "$recursiveRef", "$recursiveAnchor", "$dynamicRef", "$dynamicAnchor"]);

    function CU1(A) {
        for (let q in A) {
            if (cAK.has(q)) return !0;
            let K = A[q];
            if (Array.isArray(K) && K.some(CU1)) return !0;
            if (typeof K == "object" && CU1(K)) return !0
        }
        return !1
    }

    function f3A(A) {
        let q = 0;
        for (let K in A) {
            if (K === "$ref") return 1 / 0;
            if (q++, UAK.has(K)) continue;
            if (typeof A[K] == "object")(0, FAK.eachItem)(A[K], (Y) => q += f3A(Y));
            if (q === 1 / 0) return 1 / 0
        }
        return q
    }

    function T3A(A, q = "", K) {
        if (K !== !1) q = lO6(q);
        let Y = A.parse(q);
        return v3A(A, Y)
    }
    N3A.getFullPath = T3A;

    function v3A(A, q) {
        return A.serialize(q).split("#")[0] + "#"
    }
    N3A._getFullPath = v3A;
    var lAK = /#\/?$/;

    function lO6(A) {
        return A ? A.replace(lAK, "") : ""
    }
    N3A.normalizeId = lO6;

    function iAK(A, q, K) {
        return K = lO6(K), A.resolve(q, K)
    }
    N3A.resolveUrl = iAK;
    var nAK = /^[a-z_][-a-z0-9._]*$/i;

    function rAK(A, q) {
        if (typeof A == "boolean") return {};
        let {
            schemaId: K,
            uriResolver: Y
        } = this.opts, z = lO6(A[K] || q), _ = {
            "": z
        }, w = T3A(Y, z, !1), O = {}, $ = new Set;
        return QAK(A, {
            allKeys: !0
        }, (J, M, D, X) => {
            if (X === void 0) return;
            let P = w + M,
                W = _[X];
            if (typeof J[K] == "string") W = Z.call(this, J[K]);
            G.call(this, J.$anchor), G.call(this, J.$dynamicAnchor), _[M] = W;

            function Z(f) {
                let v = this.opts.uriResolver.resolve;
                if (f = lO6(W ? v(W, f) : f), $.has(f)) throw j(f);
                $.add(f);
                let N = this.refs[f];
                if (typeof N == "string") N = this.refs[N];
                if (typeof N == "object") H(J, N.schema, f);
                else if (f !== lO6(P))
                    if (f[0] === "#") H(J, O[f], f), O[f] = J;
                    else this.refs[f] = P;
                return f
            }

            function G(f) {
                if (typeof f == "string") {
                    if (!nAK.test(f)) throw Error(`invalid anchor "${f}"`);
                    Z.call(this, `#${f}`)
                }
            }
        }), O;

        function H(J, M, D) {
            if (M !== void 0 && !pAK(J, M)) throw j(D)
        }

        function j(J) {
            return Error(`reference "${J}" resolves to more than one schema`)
        }
    }
    N3A.getSchemaRefs = rAK
})