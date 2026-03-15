
// @from(Ln 286859, Col 4)
YR8 = x((KR8) => {
    Object.defineProperty(KR8, "__esModule", {
        value: !0
    });
    KR8.uuid = void 0;
    var J7Y = rL8();
    Object.defineProperty(KR8, "uuid", {
        enumerable: !0,
        get: function() {
            return J7Y.v4
        }
    })
})
// @from(Ln 286872, Col 4)
Fv4 = x((Bv4) => {
    Object.defineProperty(Bv4, "__esModule", {
        value: !0
    });
    Bv4.ContextBatch = void 0;
    var D7Y = YR8(),
        xv4 = 32,
        uv4 = 480;
    class mv4 {
        constructor(A) {
            this.id = (0, D7Y.uuid)(), this.items = [], this.sizeInBytes = 0, this.maxEventCount = Math.max(1, A)
        }
        tryAdd(A) {
            if (this.length === this.maxEventCount) return {
                success: !1,
                message: `Event limit of ${this.maxEventCount} has been exceeded.`
            };
            let q = this.calculateSize(A.context);
            if (q > xv4 * 1024) return {
                success: !1,
                message: `Event exceeds maximum event size of ${xv4} KB`
            };
            if (this.sizeInBytes + q > uv4 * 1024) return {
                success: !1,
                message: `Event has caused batch size to exceed ${uv4} KB`
            };
            return this.items.push(A), this.sizeInBytes += q, {
                success: !0
            }
        }
        get length() {
            return this.items.length
        }
        calculateSize(A) {
            return encodeURI(JSON.stringify(A.event)).split(/%..|i/).length
        }
        getEvents() {
            return this.items.map(({
                context: q
            }) => q.event)
        }
        getContexts() {
            return this.items.map((A) => A.context)
        }
        resolveEvents() {
            this.items.forEach(({
                resolver: A,
                context: q
            }) => A(q))
        }
    }
    Bv4.ContextBatch = mv4
})
// @from(Ln 286925, Col 4)
Uv4 = x((pv4) => {
    Object.defineProperty(pv4, "__esModule", {
        value: !0
    });
    pv4.b64encode = void 0;
    var X7Y = x6("buffer"),
        P7Y = (A) => {
            return X7Y.Buffer.from(A).toString("base64")
        };
    pv4.b64encode = P7Y
})
// @from(Ln 286936, Col 4)
nv4 = x((lv4) => {
    Object.defineProperty(lv4, "__esModule", {
        value: !0
    });
    lv4.Publisher = void 0;
    var W7Y = Ce(),
        Z7Y = bv4(),
        G7Y = AG6(),
        f7Y = Fv4(),
        T7Y = Uv4();

    function v7Y(A) {
        return new Promise((q) => setTimeout(q, A))
    }

    function WU6() {}
    class cv4 {
        constructor({
            host: A,
            path: q,
            maxRetries: K,
            flushAt: Y,
            flushInterval: z,
            writeKey: _,
            httpRequestTimeout: w,
            httpClient: O,
            disable: $
        }, H) {
            this._emitter = H, this._maxRetries = K, this._flushAt = Math.max(Y, 1), this._flushInterval = z, this._auth = (0, T7Y.b64encode)(`${_}:`), this._url = (0, Z7Y.tryCreateFormattedUrl)(A ?? "https://api.segment.io", q ?? "/v1/batch"), this._httpRequestTimeout = w ?? 1e4, this._disable = Boolean($), this._httpClient = O
        }
        createBatch() {
            this.pendingFlushTimeout && clearTimeout(this.pendingFlushTimeout);
            let A = new f7Y.ContextBatch(this._flushAt);
            return this._batch = A, this.pendingFlushTimeout = setTimeout(() => {
                if (A === this._batch) this._batch = void 0;
                if (this.pendingFlushTimeout = void 0, A.length) this.send(A).catch(WU6)
            }, this._flushInterval), A
        }
        clearBatch() {
            this.pendingFlushTimeout && clearTimeout(this.pendingFlushTimeout), this._batch = void 0
        }
        flush(A) {
            if (!A) return;
            if (this._flushPendingItemsCount = A, !this._batch) return;
            if (this._batch.length === A) this.send(this._batch).catch(WU6), this.clearBatch()
        }
        enqueue(A) {
            let q = this._batch ?? this.createBatch(),
                {
                    promise: K,
                    resolve: Y
                } = (0, G7Y.createDeferred)(),
                z = {
                    context: A,
                    resolver: Y
                };
            if (q.tryAdd(z).success) {
                let $ = q.length === this._flushPendingItemsCount;
                if (q.length === this._flushAt || $) this.send(q).catch(WU6), this.clearBatch();
                return K
            }
            if (q.length) this.send(q).catch(WU6), this.clearBatch();
            let w = this.createBatch(),
                O = w.tryAdd(z);
            if (O.success) {
                if (w.length === this._flushPendingItemsCount) this.send(w).catch(WU6), this.clearBatch();
                return K
            } else return A.setFailedDelivery({
                reason: Error(O.message)
            }), Promise.resolve(A)
        }
        async send(A) {
            if (this._flushPendingItemsCount) this._flushPendingItemsCount -= A.length;
            let q = A.getEvents(),
                K = this._maxRetries + 1,
                Y = 0;
            while (Y < K) {
                Y++;
                let z;
                try {
                    if (this._disable) return A.resolveEvents();
                    let _ = {
                        url: this._url,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Basic ${this._auth}`,
                            "User-Agent": "analytics-node-next/latest"
                        },
                        data: {
                            batch: q,
                            sentAt: new Date
                        },
                        httpRequestTimeout: this._httpRequestTimeout
                    };
                    this._emitter.emit("http_request", {
                        body: _.data,
                        method: _.method,
                        url: _.url,
                        headers: _.headers
                    });
                    let w = await this._httpClient.makeRequest(_);
                    if (w.status >= 200 && w.status < 300) {
                        A.resolveEvents();
                        return
                    } else if (w.status === 400) {
                        dv4(A, Error(`[${w.status}] ${w.statusText}`));
                        return
                    } else z = Error(`[${w.status}] ${w.statusText}`)
                } catch (_) {
                    z = _
                }
                if (Y === K) {
                    dv4(A, z);
                    return
                }
                await v7Y((0, W7Y.backoff)({
                    attempt: Y,
                    minTimeout: 25,
                    maxTimeout: 1000
                }))
            }
        }
    }
    lv4.Publisher = cv4;

    function dv4(A, q) {
        A.getContexts().forEach((K) => K.setFailedDelivery({
            reason: q
        })), A.resolveEvents()
    }
})
// @from(Ln 287068, Col 4)
zR8 = x((rv4) => {
    Object.defineProperty(rv4, "__esModule", {
        value: !0
    });
    rv4.detectRuntime = void 0;
    var N7Y = () => {
        if (typeof process === "object" && process && typeof process.env === "object" && process.env && typeof process.version === "string") return "node";
        if (typeof window === "object") return "browser";
        if (typeof WebSocketPair < "u") return "cloudflare-worker";
        if (typeof EdgeRuntime === "string") return "vercel-edge";
        if (typeof WorkerGlobalScope < "u" && typeof importScripts === "function") return "web-worker";
        return "unknown"
    };
    rv4.detectRuntime = N7Y
})
// @from(Ln 287083, Col 4)
ev4 = x((sv4) => {
    Object.defineProperty(sv4, "__esModule", {
        value: !0
    });
    sv4.createConfiguredNodePlugin = sv4.createNodePlugin = void 0;
    var V7Y = nv4(),
        k7Y = qR8(),
        E7Y = zR8();

    function y7Y(A) {
        A.updateEvent("context.library.name", "@segment/analytics-node"), A.updateEvent("context.library.version", k7Y.version);
        let q = (0, E7Y.detectRuntime)();
        if (q === "node") A.updateEvent("_metadata.nodeVersion", process.version);
        A.updateEvent("_metadata.jsRuntime", q)
    }

    function av4(A) {
        function q(K) {
            return y7Y(K), A.enqueue(K)
        }
        return {
            name: "Segment.io",
            type: "destination",
            version: "1.0.0",
            isLoaded: () => !0,
            load: () => Promise.resolve(),
            alias: q,
            group: q,
            identify: q,
            page: q,
            screen: q,
            track: q
        }
    }
    sv4.createNodePlugin = av4;
    var L7Y = (A, q) => {
        let K = new V7Y.Publisher(A, q);
        return {
            publisher: K,
            plugin: av4(K)
        }
    };
    sv4.createConfiguredNodePlugin = L7Y
})
// @from(Ln 287127, Col 4)
KN4 = x((AN4) => {
    Object.defineProperty(AN4, "__esModule", {
        value: !0
    });
    AN4.createMessageId = void 0;
    var h7Y = YR8(),
        S7Y = () => {
            return `node-next-${Date.now()}-${(0,h7Y.uuid)()}`
        };
    AN4.createMessageId = S7Y
})
// @from(Ln 287138, Col 4)
wN4 = x((zN4) => {
    Object.defineProperty(zN4, "__esModule", {
        value: !0
    });
    zN4.NodeEventFactory = void 0;
    var C7Y = Ce(),
        I7Y = KN4();
    class YN4 extends C7Y.EventFactory {
        constructor() {
            super({
                createMessageId: I7Y.createMessageId
            })
        }
    }
    zN4.NodeEventFactory = YN4
})
// @from(Ln 287154, Col 4)
hG1 = x(($N4) => {
    Object.defineProperty($N4, "__esModule", {
        value: !0
    });
    $N4.Context = void 0;
    var b7Y = Ce();
    class ON4 extends b7Y.CoreContext {
        static system() {
            return new this({
                type: "track",
                event: "system"
            })
        }
    }
    $N4.Context = ON4
})
// @from(Ln 287170, Col 4)
MN4 = x((jN4) => {
    Object.defineProperty(jN4, "__esModule", {
        value: !0
    });
    jN4.dispatchAndEmit = void 0;
    var x7Y = Ce(),
        u7Y = hG1(),
        m7Y = (A) => (q) => {
            let K = q.failedDelivery();
            return K ? A(K.reason, q) : A(void 0, q)
        },
        B7Y = async (A, q, K, Y) => {
            try {
                let z = new u7Y.Context(A),
                    _ = await (0, x7Y.dispatch)(z, q, K, {
                        ...Y ? {
                            callback: m7Y(Y)
                        } : {}
                    }),
                    w = _.failedDelivery();
                if (w) K.emit("error", {
                    code: "delivery_failure",
                    reason: w.reason,
                    ctx: _
                });
                else K.emit(A.type, _)
            } catch (z) {
                K.emit("error", {
                    code: "unknown",
                    reason: z
                })
            }
        };
    jN4.dispatchAndEmit = B7Y
})
// @from(Ln 287205, Col 4)
WN4 = x((XN4) => {
    Object.defineProperty(XN4, "__esModule", {
        value: !0
    });
    XN4.NodeEmitter = void 0;
    var g7Y = AG6();
    class DN4 extends g7Y.Emitter {}
    XN4.NodeEmitter = DN4
})
// @from(Ln 287214, Col 4)
NN4 = x((TN4) => {
    Object.defineProperty(TN4, "__esModule", {
        value: !0
    });
    TN4.NodeEventQueue = void 0;
    var ZN4 = Ce();
    class GN4 extends ZN4.PriorityQueue {
        constructor() {
            super(1, [])
        }
        getAttempts(A) {
            return A.attempts ?? 0
        }
        updateAttempts(A) {
            return A.attempts = this.getAttempts(A) + 1, this.getAttempts(A)
        }
    }
    class fN4 extends ZN4.CoreEventQueue {
        constructor() {
            super(new GN4)
        }
    }
    TN4.NodeEventQueue = fN4
})
// @from(Ln 287238, Col 4)
yN4 = x((kN4) => {
    Object.defineProperty(kN4, "__esModule", {
        value: !0
    });
    kN4.abortSignalAfterTimeout = kN4.AbortSignal = void 0;
    var F7Y = AG6(),
        p7Y = zR8();
    class _R8 {
        constructor() {
            this.onabort = null, this.aborted = !1, this.eventEmitter = new F7Y.Emitter
        }
        toString() {
            return "[object AbortSignal]"
        }
        get[Symbol.toStringTag]() {
            return "AbortSignal"
        }
        removeEventListener(...A) {
            this.eventEmitter.off(...A)
        }
        addEventListener(...A) {
            this.eventEmitter.on(...A)
        }
        dispatchEvent(A) {
            let q = {
                    type: A,
                    target: this
                },
                K = `on${A}`;
            if (typeof this[K] === "function") this[K](q);
            this.eventEmitter.emit(A, q)
        }
    }
    kN4.AbortSignal = _R8;
    class VN4 {
        constructor() {
            this.signal = new _R8
        }
        abort() {
            if (this.signal.aborted) return;
            this.signal.aborted = !0, this.signal.dispatchEvent("abort")
        }
        toString() {
            return "[object AbortController]"
        }
        get[Symbol.toStringTag]() {
            return "AbortController"
        }
    }
    var Q7Y = (A) => {
        if ((0, p7Y.detectRuntime)() === "cloudflare-worker") return [];
        let q = new(globalThis.AbortController || VN4),
            K = setTimeout(() => {
                q.abort()
            }, A);
        return K?.unref?.(), [q.signal, K]
    };
    kN4.abortSignalAfterTimeout = Q7Y
})
// @from(Ln 287297, Col 4)
LN4 = x((jg) => {
    var d7Y = jg && jg.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            var z = Object.getOwnPropertyDescriptor(q, K);
            if (!z || ("get" in z ? !q.__esModule : z.writable || z.configurable)) z = {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            };
            Object.defineProperty(A, Y, z)
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        c7Y = jg && jg.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        l7Y = jg && jg.__importStar || function(A) {
            if (A && A.__esModule) return A;
            var q = {};
            if (A != null) {
                for (var K in A)
                    if (K !== "default" && Object.prototype.hasOwnProperty.call(A, K)) d7Y(q, A, K)
            }
            return c7Y(q, A), q
        };
    Object.defineProperty(jg, "__esModule", {
        value: !0
    });
    jg.fetch = void 0;
    var i7Y = async (...A) => {
        if (globalThis.fetch) return globalThis.fetch(...A);
        else if (typeof EdgeRuntime !== "string") return (await Promise.resolve().then(() => l7Y(CZ8()))).default(...A);
        else throw Error("Invariant: an edge runtime that does not support fetch should not exist")
    };
    jg.fetch = i7Y
})
// @from(Ln 287340, Col 4)
wR8 = x((hN4) => {
    Object.defineProperty(hN4, "__esModule", {
        value: !0
    });
    hN4.FetchHTTPClient = void 0;
    var n7Y = yN4(),
        r7Y = LN4();
    class RN4 {
        constructor(A) {
            this._fetch = A ?? r7Y.fetch
        }
        async makeRequest(A) {
            let [q, K] = (0, n7Y.abortSignalAfterTimeout)(A.httpRequestTimeout), Y = {
                url: A.url,
                method: A.method,
                headers: A.headers,
                body: JSON.stringify(A.data),
                signal: q
            };
            return this._fetch(A.url, Y).finally(() => clearTimeout(K))
        }
    }
    hN4.FetchHTTPClient = RN4
})
// @from(Ln 287364, Col 4)
OR8 = x((uN4) => {
    Object.defineProperty(uN4, "__esModule", {
        value: !0
    });
    uN4.Analytics = void 0;
    var CN4 = Ce(),
        o7Y = Rv4(),
        a7Y = qR8(),
        s7Y = ev4(),
        t7Y = wN4(),
        e7Y = MN4(),
        A4Y = WN4(),
        IN4 = hG1(),
        q4Y = NN4(),
        bN4 = wR8();
    class xN4 extends A4Y.NodeEmitter {
        constructor(A) {
            super();
            this._isClosed = !1, this._pendingEvents = 0, this._isFlushing = !1, (0, o7Y.validateSettings)(A), this._eventFactory = new t7Y.NodeEventFactory, this._queue = new q4Y.NodeEventQueue;
            let q = A.flushInterval ?? 1e4;
            this._closeAndFlushDefaultTimeout = q * 1.25;
            let {
                plugin: K,
                publisher: Y
            } = (0, s7Y.createConfiguredNodePlugin)({
                writeKey: A.writeKey,
                host: A.host,
                path: A.path,
                maxRetries: A.maxRetries ?? 3,
                flushAt: A.flushAt ?? A.maxEventsInBatch ?? 15,
                httpRequestTimeout: A.httpRequestTimeout,
                disable: A.disable,
                flushInterval: q,
                httpClient: typeof A.httpClient === "function" ? new bN4.FetchHTTPClient(A.httpClient) : A.httpClient ?? new bN4.FetchHTTPClient
            }, this);
            this._publisher = Y, this.ready = this.register(K).then(() => {
                return
            }), this.emit("initialize", A), (0, CN4.bindAll)(this)
        }
        get VERSION() {
            return a7Y.version
        }
        closeAndFlush({
            timeout: A = this._closeAndFlushDefaultTimeout
        } = {}) {
            return this.flush({
                timeout: A,
                close: !0
            })
        }
        async flush({
            timeout: A,
            close: q = !1
        } = {}) {
            if (this._isFlushing) {
                console.warn("Overlapping flush calls detected. Please wait for the previous flush to finish before calling .flush again");
                return
            } else this._isFlushing = !0;
            if (q) this._isClosed = !0;
            this._publisher.flush(this._pendingEvents);
            let K = new Promise((Y) => {
                if (!this._pendingEvents) Y();
                else this.once("drained", () => {
                    Y()
                })
            }).finally(() => {
                this._isFlushing = !1
            });
            return A ? (0, CN4.pTimeout)(K, A).catch(() => {
                return
            }) : K
        }
        _dispatch(A, q) {
            if (this._isClosed) {
                this.emit("call_after_close", A);
                return
            }
            this._pendingEvents++, (0, e7Y.dispatchAndEmit)(A, this._queue, this, q).catch((K) => K).finally(() => {
                if (this._pendingEvents--, !this._pendingEvents) this.emit("drained")
            })
        }
        alias({
            userId: A,
            previousId: q,
            context: K,
            timestamp: Y,
            integrations: z
        }, _) {
            let w = this._eventFactory.alias(A, q, {
                context: K,
                integrations: z,
                timestamp: Y
            });
            this._dispatch(w, _)
        }
        group({
            timestamp: A,
            groupId: q,
            userId: K,
            anonymousId: Y,
            traits: z = {},
            context: _,
            integrations: w
        }, O) {
            let $ = this._eventFactory.group(q, z, {
                context: _,
                anonymousId: Y,
                userId: K,
                timestamp: A,
                integrations: w
            });
            this._dispatch($, O)
        }
        identify({
            userId: A,
            anonymousId: q,
            traits: K = {},
            context: Y,
            timestamp: z,
            integrations: _
        }, w) {
            let O = this._eventFactory.identify(A, K, {
                context: Y,
                anonymousId: q,
                userId: A,
                timestamp: z,
                integrations: _
            });
            this._dispatch(O, w)
        }
        page({
            userId: A,
            anonymousId: q,
            category: K,
            name: Y,
            properties: z,
            context: _,
            timestamp: w,
            integrations: O
        }, $) {
            let H = this._eventFactory.page(K ?? null, Y ?? null, z, {
                context: _,
                anonymousId: q,
                userId: A,
                timestamp: w,
                integrations: O
            });
            this._dispatch(H, $)
        }
        screen({
            userId: A,
            anonymousId: q,
            category: K,
            name: Y,
            properties: z,
            context: _,
            timestamp: w,
            integrations: O
        }, $) {
            let H = this._eventFactory.screen(K ?? null, Y ?? null, z, {
                context: _,
                anonymousId: q,
                userId: A,
                timestamp: w,
                integrations: O
            });
            this._dispatch(H, $)
        }
        track({
            userId: A,
            anonymousId: q,
            event: K,
            properties: Y,
            context: z,
            timestamp: _,
            integrations: w
        }, O) {
            let $ = this._eventFactory.track(K, Y, {
                context: z,
                userId: A,
                anonymousId: q,
                timestamp: _,
                integrations: w
            });
            this._dispatch($, O)
        }
        register(...A) {
            return this._queue.criticalTasks.run(async () => {
                let q = IN4.Context.system(),
                    K = A.map((Y) => this._queue.register(q, Y, this));
                await Promise.all(K), this.emit("register", A.map((Y) => Y.name))
            })
        }
        async deregister(...A) {
            let q = IN4.Context.system(),
                K = A.map((Y) => {
                    let z = this._queue.plugins.find((_) => _.name === Y);
                    if (z) return this._queue.deregister(q, z, this);
                    else q.log("warn", `plugin ${Y} not found`)
                });
            await Promise.all(K), this.emit("deregister", A)
        }
    }
    uN4.Analytics = xN4
})
// @from(Ln 287569, Col 4)
BN4 = x((ZU6) => {
    Object.defineProperty(ZU6, "__esModule", {
        value: !0
    });
    ZU6.FetchHTTPClient = ZU6.Context = ZU6.Analytics = void 0;
    var K4Y = OR8();
    Object.defineProperty(ZU6, "Analytics", {
        enumerable: !0,
        get: function() {
            return K4Y.Analytics
        }
    });
    var Y4Y = hG1();
    Object.defineProperty(ZU6, "Context", {
        enumerable: !0,
        get: function() {
            return Y4Y.Context
        }
    });
    var z4Y = wR8();
    Object.defineProperty(ZU6, "FetchHTTPClient", {
        enumerable: !0,
        get: function() {
            return z4Y.FetchHTTPClient
        }
    });
    var _4Y = OR8();
    ZU6.default = _4Y.Analytics
})
// @from(Ln 287599, Col 0)
function H4Y() {
    return $4Y.production
}
// @from(Ln 287602, Col 0)
async function j4Y() {
    if (My()) return !1;
    return !0
}
// @from(Ln 287606, Col 0)
async function pN4() {
    await $R8?.closeAndFlush()
}
// @from(Ln 287609, Col 0)
async function HR8(A, q) {
    let K = await FN4();
    if (!K) return;
    try {
        let Y = CG1(),
            z = L3(),
            _ = await eZ6({
                model: q.model,
                betas: q.betas
            }),
            w = UN4(_, q),
            O = {
                anonymousId: Y,
                event: A,
                properties: w
            };
        if (z) {
            let $ = Pr(!0);
            O.userId = $.deviceId, O.properties.accountUuid = z.accountUuid, O.properties.organizationUuid = z.organizationUuid
        }
        K.track(O)
    } catch (Y) {
        _6(Y)
    }
}
// @from(Ln 287634, Col 0)
async function QN4(A) {
    let q = await FN4();
    if (!q) return;
    try {
        let K = CG1(),
            Y = L3(),
            z = {
                anonymousId: K,
                traits: A
            };
        if (Y) {
            let _ = Pr(!0);
            z.userId = _.deviceId
        }
        q.identify(z)
    } catch (K) {
        _6(K)
    }
}
// @from(Ln 287653, Col 4)
gN4
// @from(Ln 287653, Col 9)
$4Y
// @from(Ln 287653, Col 14)
$R8 = null
// @from(Ln 287654, Col 4)
FN4
// @from(Ln 287655, Col 4)
SG1 = E(() => {
    U4();
    _76();
    k8();
    k1();
    fA();
    o$();
    ip();
    gN4 = t(BN4(), 1), $4Y = {
        production: "LKJN8LsLERHEOXkw487o7qCTFOrGPimI",
        development: "b64sf1kxwDGe1PiSAlv5ixuH0f509RKK"
    };
    FN4 = e1(async () => {
        if (!await j4Y()) return null;
        try {
            return $R8 = new gN4.Analytics({
                writeKey: H4Y(),
                flushAt: 50,
                flushInterval: 1e4
            }), $R8
        } catch (q) {
            return _6(q), null
        }
    })
})
// @from(Ln 287684, Col 0)
function JR8() {
    if (!process.stdout.isTTY) return;
    try {
        if (FP.get(process.stdout)?.isAltScreenActive) Jg(1, ZK6), Jg(1, vO1);
        if (Jg(1, eD6), Jg(1, WK6), Jg(1, HX6), Jg(1, xC), Jg(1, kO1), !t6(process.env.CLAUDE_CODE_DISABLE_TERMINAL_TITLE))
            if (process.platform === "win32") process.title = "";
            else Jg(1, hk7)
    } catch {}
}
// @from(Ln 287694, Col 0)
function MR8() {
    if (process.stdout.isTTY && DW() && !jS()) try {
        let A = R1();
        if (!fU6(A)) return;
        let q = ek(A),
            K;
        if (q) K = `"${q.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}"`;
        else K = A;
        Jg(1, O1.dim(`
Resume this session with:
claude --resume ${K}
`))
    } catch {}
}
// @from(Ln 287709, Col 0)
function DR8(A) {
    if (GU6 !== void 0) clearTimeout(GU6), GU6 = void 0;
    try {
        process.exit(A)
    } catch (q) {
        process.kill(process.pid, "SIGKILL")
    }
    throw Error("unreachable")
}
// @from(Ln 287719, Col 0)
function fK(A = 0, q = "other", K) {
    process.exitCode = A, J4Y = Vq(A, q, K).catch((Y) => {
        k(`Graceful shutdown failed: ${Y}`, {
            level: "error"
        }), JR8(), MR8(), DR8(A)
    }).catch(() => {})
}
// @from(Ln 287727, Col 0)
function IG1() {
    return XR8
}
// @from(Ln 287730, Col 0)
async function Vq(A = 0, q = "other", K) {
    if (XR8) return;
    XR8 = !0;
    let {
        executeSessionEndHooks: Y,
        getSessionEndHookTimeoutMs: z
    } = await Promise.resolve().then(() => (hw(), PR8)), _ = z();
    GU6 = setTimeout((O) => {
        JR8(), MR8(), DR8(O)
    }, Math.max(5000, _ + 3500), A), GU6.unref(), process.exitCode = A;
    let w;
    try {
        let O = (async () => {
            try {
                await QAA()
            } catch {}
        })();
        await Promise.race([O, new Promise(($, H) => {
            w = setTimeout((j) => j(new cN4), 2000, H)
        })]), clearTimeout(w)
    } catch {
        clearTimeout(w)
    }
    try {
        await Y(q, {
            ...K,
            signal: AbortSignal.timeout(_),
            timeoutMs: _
        })
    } catch {}
    try {
        YE6()
    } catch {}
    try {
        await Promise.race([Promise.all([TU6(), vG1(), pN4()]), new Promise((O) => setTimeout(O, 500).unref())])
    } catch {}
    if (JR8(), K?.finalMessage) try {
        Jg(2, K.finalMessage + `
`)
    } catch {}
    MR8(), DR8(A)
}
// @from(Ln 287772, Col 4)
dN4
// @from(Ln 287772, Col 9)
XR8 = !1
// @from(Ln 287773, Col 4)
GU6
// @from(Ln 287773, Col 9)
jR8
// @from(Ln 287773, Col 14)
J4Y
// @from(Ln 287773, Col 19)
cN4
// @from(Ln 287774, Col 4)
c_ = E(() => {
    aK();
    U4();
    HL6();
    H1();
    XS();
    KY();
    n96();
    NG1();
    SG1();
    GK6();
    uL();
    vm();
    A8();
    u_();
    V1();
    T1();
    Oq();
    bU();
    dN4 = e1(() => {
        if (sn(() => {}), process.on("SIGINT", () => {
                U1("info", "shutdown_signal", {
                    signal: "SIGINT"
                }), Vq(0)
            }), process.on("SIGTERM", () => {
                U1("info", "shutdown_signal", {
                    signal: "SIGTERM"
                }), Vq(143)
            }), process.platform !== "win32") {
            if (process.on("SIGHUP", () => {
                    U1("info", "shutdown_signal", {
                        signal: "SIGHUP"
                    }), Vq(129)
                }), process.stdin.isTTY) jR8 = setInterval(() => {
                if (!process.stdout.writable || !process.stdin.readable) clearInterval(jR8), U1("info", "shutdown_signal", {
                    signal: "orphan_detected"
                }), Vq(129)
            }, 30000), jR8.unref()
        }
        process.on("uncaughtException", (A) => {
            U1("error", "uncaught_exception", {
                error_name: A.name,
                error_message: A.message.slice(0, 2000)
            }), d("tengu_uncaught_exception", {
                error_name: A.name
            })
        }), process.on("unhandledRejection", (A) => {
            let q = A instanceof Error ? A.name : typeof A === "string" ? "string" : "unknown",
                K = A instanceof Error ? {
                    error_name: A.name,
                    error_message: A.message.slice(0, 2000),
                    error_stack: A.stack?.slice(0, 4000)
                } : {
                    error_message: String(A).slice(0, 2000)
                };
            U1("error", "unhandled_rejection", K), d("tengu_unhandled_rejection", {
                error_name: q
            })
        })
    });
    cN4 = class cN4 extends Error {
        constructor() {
            super("Cleanup timeout")
        }
    }
})
// @from(Ln 287840, Col 0)
async function bG1(A) {
    try {
        return await A()
    } catch (q) {
        if (X8.isAxiosError(q) && q.response?.status === 401) {
            d("tengu_grove_oauth_401_received", {});
            let K = sA()?.accessToken;
            if (K) return await DG(K), await A()
        }
        throw q
    }
}
// @from(Ln 287852, Col 0)
async function WR8() {
    try {
        await bG1(() => {
            let A = QO();
            if (A.error) throw Error(`Failed to get auth headers: ${A.error}`);
            return X8.post(`${P7().BASE_API_URL}/api/oauth/account/grove_notice_viewed`, {}, {
                headers: {
                    ...A.headers,
                    "User-Agent": pO()
                }
            })
        }), eI.cache.clear?.()
    } catch (A) {
        _6(A)
    }
}
// @from(Ln 287868, Col 0)
async function xG1(A) {
    try {
        await bG1(() => {
            let q = QO();
            if (q.error) throw Error(`Failed to get auth headers: ${q.error}`);
            return X8.patch(`${P7().BASE_API_URL}/api/oauth/account/settings`, {
                grove_enabled: A
            }, {
                headers: {
                    ...q.headers,
                    "User-Agent": pO()
                }
            })
        }), eI.cache.clear?.()
    } catch (q) {
        _6(q)
    }
}
// @from(Ln 287886, Col 0)
async function qG6() {
    if (!vU6()) return !1;
    let A = L3()?.accountUuid;
    if (!A) return !1;
    let K = X1().groveConfigCache?.[A],
        Y = Date.now();
    if (!K) return k("Grove: No cache, fetching config in background (dialog skipped this session)"), lN4(A), !1;
    if (Y - K.timestamp > M4Y) return k("Grove: Cache stale, returning cached data and refreshing in background"), lN4(A), K.grove_enabled;
    return k("Grove: Using fresh cached config"), K.grove_enabled
}
// @from(Ln 287896, Col 0)
async function lN4(A) {
    try {
        let q = await Ie();
        if (!q.success) return;
        let K = q.data.grove_enabled;
        d1((Y) => ({
            ...Y,
            groveConfigCache: {
                ...Y.groveConfigCache,
                [A]: {
                    grove_enabled: K,
                    timestamp: Date.now()
                }
            }
        }))
    } catch (q) {
        k(`Grove: Failed to fetch and store config: ${q}`)
    }
}
// @from(Ln 287916, Col 0)
function ZR8(A, q, K) {
    if (!A.success || !q.success) return !1;
    let Y = A.data,
        z = q.data;
    if (Y.grove_enabled !== null) return !1;
    if (K) return !0;
    if (!z.notice_is_grace_period) return !0;
    let w = z.notice_reminder_frequency;
    if (w !== null && Y.grove_notice_viewed_at) return Math.floor((Date.now() - new Date(Y.grove_notice_viewed_at).getTime()) / 86400000) >= w;
    else {
        let O = Y.grove_notice_viewed_at;
        return O === null || O === void 0
    }
}
// @from(Ln 287930, Col 0)
async function iN4() {
    let [A, q] = await Promise.all([eI(), Ie()]);
    if (ZR8(A, q, !1)) {
        let Y = q.success ? q.data : null;
        if (d("tengu_grove_print_viewed", {
                dismissable: Y?.notice_is_grace_period
            }), Y === null || Y.notice_is_grace_period) Gn(`
An update to our Consumer Terms and Privacy Policy will take effect on October 8, 2025. Run \`claude\` to review the updated terms.

`), await WR8();
        else Gn(`
[ACTION REQUIRED] An update to our Consumer Terms and Privacy Policy has taken effect on October 8, 2025. You must run \`claude\` to review the updated terms.

`), await Vq(1)
    }
}
// @from(Ln 287946, Col 4)
M4Y = 86400000
// @from(Ln 287947, Col 4)
eI
// @from(Ln 287947, Col 8)
Ie
// @from(Ln 287948, Col 4)
KG6 = E(() => {
    kK();
    RM();
    k1();
    F5();
    H1();
    V1();
    fA();
    k8();
    U4();
    c_();
    eI = e1(async () => {
        if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return {
            success: !1
        };
        try {
            return {
                success: !0,
                data: (await bG1(() => {
                    let q = QO();
                    if (q.error) throw Error(`Failed to get auth headers: ${q.error}`);
                    return X8.get(`${P7().BASE_API_URL}/api/oauth/account/settings`, {
                        headers: {
                            ...q.headers,
                            "User-Agent": pO()
                        }
                    })
                })).data
            }
        } catch (A) {
            return _6(A), eI.cache.clear?.(), {
                success: !1
            }
        }
    });
    Ie = e1(async () => {
        if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return {
            success: !1
        };
        try {
            let A = await bG1(() => {
                    let _ = QO();
                    if (_.error) throw Error(`Failed to get auth headers: ${_.error}`);
                    return X8.get(`${P7().BASE_API_URL}/api/claude_code_grove`, {
                        headers: {
                            ..._.headers,
                            "User-Agent": Gy()
                        },
                        timeout: 3000
                    })
                }),
                {
                    grove_enabled: q,
                    domain_excluded: K,
                    notice_is_grace_period: Y,
                    notice_reminder_frequency: z
                } = A.data;
            return {
                success: !0,
                data: {
                    grove_enabled: q,
                    domain_excluded: K ?? !1,
                    notice_is_grace_period: Y ?? !0,
                    notice_reminder_frequency: z
                }
            }
        } catch (A) {
            return k(`Failed to fetch Grove notice config: ${A}`), {
                success: !1
            }
        }
    })
})
// @from(Ln 288021, Col 4)
nN4
// @from(Ln 288022, Col 4)
rN4 = E(() => {
    K7();
    nN4 = F6(() => C.object({
        uuid: C.string(),
        checksum: C.string(),
        settings: C.record(C.string(), C.unknown())
    }))
})
// @from(Ln 288031, Col 0)
function oN4({
    isDisabled: A = !1,
    visibleOptionCount: q = 5,
    options: K,
    defaultValue: Y = [],
    onChange: z,
    onCancel: _,
    onFocus: w,
    focusValue: O,
    submitButtonText: $,
    onSubmit: H,
    onDownFromLastItem: j,
    onUpFromFirstItem: J,
    initialFocusLast: M
}) {
    let [D, X] = r96.useState(Y), [P, W] = r96.useState(!1), [Z, G] = r96.useState(() => {
        let V = new Map;
        return K.forEach((L) => {
            if (L.type === "input" && L.initialValue) V.set(L.value, L.initialValue)
        }), V
    }), f = r96.useCallback((V) => {
        let L = typeof V === "function" ? V(D) : V;
        X(L), z?.(L)
    }, [D, z]), v = jG1({
        visibleOptionCount: q,
        options: K,
        initialFocusValue: M ? K[K.length - 1]?.value : void 0,
        onFocus: w,
        focusValue: O
    });
    oj("multi-select");
    let N = r96.useCallback((V, L) => {
        G((R) => {
            let u = new Map(R);
            return u.set(V, L), u
        });
        let h = K.find((R) => R.value === V);
        if (h && h.type === "input") h.onChange(L);
        f((R) => {
            if (L) {
                if (!R.includes(V)) return [...R, V];
                return R
            } else return R.filter((u) => u !== V)
        })
    }, [K, f]);
    return jA((V, L, h) => {
        let R = MC(V),
            I = K.find((B) => B.value === v.focusedValue)?.type === "input";
        if (I) {
            if (!(L.upArrow || L.downArrow || L.escape || L.tab || L.return || L.ctrl && (V === "n" || V === "p" || L.return))) return
        }
        let g = K[K.length - 1]?.value;
        if (L.tab && !L.shift) {
            if ($ && H && v.focusedValue === g && !P) W(!0);
            else if (!P) v.focusNextOption();
            return
        }
        if (L.tab && L.shift) {
            if ($ && H && P) W(!1), v.focusOption(g);
            else v.focusPreviousOption();
            return
        }
        if (L.downArrow || L.ctrl && V === "n" || !L.ctrl && !L.shift && V === "j") {
            if (P && j) j();
            else if ($ && H && v.focusedValue === g && !P) W(!0);
            else if (!$ && j && v.focusedValue === g) j();
            else if (!P) v.focusNextOption();
            return
        }
        if (L.upArrow || L.ctrl && V === "p" || !L.ctrl && !L.shift && V === "k") {
            if ($ && H && P) W(!1), v.focusOption(g);
            else if (J && v.focusedValue === K[0]?.value) J();
            else v.focusPreviousOption();
            return
        }
        if (L.pageDown) {
            v.focusNextPage();
            return
        }
        if (L.pageUp) {
            v.focusPreviousPage();
            return
        }
        if (L.return || _91(V) === " ") {
            if (L.ctrl && L.return && I && H) {
                H();
                return
            }
            if (P && H) {
                H();
                return
            }
            if (v.focusedValue !== void 0) {
                let B = D.includes(v.focusedValue) ? D.filter((b) => b !== v.focusedValue) : [...D, v.focusedValue];
                f(B)
            }
            return
        }
        if (/^[0-9]+$/.test(R)) {
            let B = parseInt(R) - 1;
            if (B >= 0 && B < K.length) {
                let b = K[B].value,
                    p = D.includes(b) ? D.filter((Q) => Q !== b) : [...D, b];
                f(p)
            }
            return
        }
        if (L.escape) _(), h.stopImmediatePropagation()
    }, {
        isActive: !A
    }), {
        ...v,
        selectedValues: D,
        inputValues: Z,
        isSubmitFocused: P,
        updateInputValue: N,
        onCancel: _
    }
}
// @from(Ln 288150, Col 4)
r96
// @from(Ln 288151, Col 4)
aN4 = E(() => {
    i6();
    fZ();
    RL8();
    r96 = t(P6(), 1)
})
// @from(Ln 288158, Col 0)
function sN4(A) {
    let q = A6(43),
        {
            isDisabled: K,
            visibleOptionCount: Y,
            options: z,
            defaultValue: _,
            onCancel: w,
            onChange: O,
            onFocus: $,
            focusValue: H,
            submitButtonText: j,
            onSubmit: J,
            onDownFromLastItem: M,
            onUpFromFirstItem: D,
            initialFocusLast: X,
            onOpenEditor: P,
            hideIndexes: W,
            onImagePaste: Z,
            pastedContents: G,
            onRemoveImage: f
        } = A,
        v = K === void 0 ? !1 : K,
        N = Y === void 0 ? 5 : Y,
        V;
    if (q[0] !== _) V = _ === void 0 ? [] : _, q[0] = _, q[1] = V;
    else V = q[1];
    let L = V,
        h = W === void 0 ? !1 : W,
        R;
    if (q[2] !== L || q[3] !== H || q[4] !== X || q[5] !== v || q[6] !== w || q[7] !== O || q[8] !== M || q[9] !== $ || q[10] !== J || q[11] !== D || q[12] !== z || q[13] !== j || q[14] !== N) R = {
        isDisabled: v,
        visibleOptionCount: N,
        options: z,
        defaultValue: L,
        onChange: O,
        onCancel: w,
        onFocus: $,
        focusValue: H,
        submitButtonText: j,
        onSubmit: J,
        onDownFromLastItem: M,
        onUpFromFirstItem: D,
        initialFocusLast: X
    }, q[2] = L, q[3] = H, q[4] = X, q[5] = v, q[6] = w, q[7] = O, q[8] = M, q[9] = $, q[10] = J, q[11] = D, q[12] = z, q[13] = j, q[14] = N, q[15] = R;
    else R = q[15];
    let u = oN4(R),
        I, g, B, b, p;
    if (q[16] !== h || q[17] !== v || q[18] !== w || q[19] !== Z || q[20] !== P || q[21] !== f || q[22] !== z.length || q[23] !== G || q[24] !== u) {
        let e = z.length.toString().length;
        g = m, p = "column", I = m, B = "column", b = u.visibleOptions.map((Y6, H6) => {
            let J6 = !v && u.focusedValue === Y6.value && !u.isSubmitFocused,
                K6 = u.selectedValues.includes(Y6.value),
                s = Y6.index === u.visibleFromIndex,
                X6 = Y6.index === u.visibleToIndex - 1,
                z6 = u.visibleToIndex < z.length,
                N6 = u.visibleFromIndex > 0,
                $6 = u.visibleFromIndex + H6 + 1;
            if (Y6.type === "input") {
                let n = u.inputValues.get(Y6.value) || "";
                return vZ.default.createElement(m, {
                    key: String(Y6.value),
                    gap: 1
                }, vZ.default.createElement(tZ6, {
                    option: Y6,
                    isFocused: J6,
                    isSelected: !1,
                    shouldShowDownArrow: z6 && X6,
                    shouldShowUpArrow: N6 && s,
                    maxIndexWidth: e,
                    index: $6,
                    inputValue: n,
                    onInputChange: (o) => {
                        u.updateInputValue(Y6.value, o)
                    },
                    onSubmit: D4Y,
                    onExit: () => {
                        w()
                    },
                    layout: "compact",
                    onOpenEditor: P,
                    onImagePaste: Z,
                    pastedContents: G,
                    onRemoveImage: f
                }, vZ.default.createElement(T, {
                    color: K6 ? "success" : void 0
                }, "[", K6 ? a6.tick : " ", "]", " ")))
            }
            return vZ.default.createElement(m, {
                key: String(Y6.value),
                gap: 1
            }, vZ.default.createElement(Re, {
                isFocused: J6,
                isSelected: !1,
                shouldShowDownArrow: z6 && X6,
                shouldShowUpArrow: N6 && s,
                description: Y6.description
            }, !h && vZ.default.createElement(T, {
                dimColor: !0
            }, `${$6}.`.padEnd(e)), vZ.default.createElement(T, {
                color: !h && K6 ? "success" : void 0
            }, "[", K6 ? a6.tick : " ", "]"), vZ.default.createElement(T, {
                color: J6 ? "suggestion" : void 0
            }, Y6.label)))
        }), q[16] = h, q[17] = v, q[18] = w, q[19] = Z, q[20] = P, q[21] = f, q[22] = z.length, q[23] = G, q[24] = u, q[25] = I, q[26] = g, q[27] = B, q[28] = b, q[29] = p
    } else I = q[25], g = q[26], B = q[27], b = q[28], p = q[29];
    let Q;
    if (q[30] !== I || q[31] !== B || q[32] !== b) Q = vZ.default.createElement(I, {
        flexDirection: B
    }, b), q[30] = I, q[31] = B, q[32] = b, q[33] = Q;
    else Q = q[33];
    let U;
    if (q[34] !== J || q[35] !== u.isSubmitFocused || q[36] !== j) U = j && J && vZ.default.createElement(m, {
        marginTop: 0,
        gap: 1
    }, u.isSubmitFocused ? vZ.default.createElement(T, {
        color: "suggestion"
    }, a6.pointer) : vZ.default.createElement(T, null, " "), vZ.default.createElement(m, {
        marginLeft: 3
    }, vZ.default.createElement(T, {
        color: u.isSubmitFocused ? "suggestion" : void 0,
        bold: !0
    }, j))), q[34] = J, q[35] = u.isSubmitFocused, q[36] = j, q[37] = U;
    else U = q[37];
    let r;
    if (q[38] !== g || q[39] !== Q || q[40] !== U || q[41] !== p) r = vZ.default.createElement(g, {
        flexDirection: p
    }, Q, U), q[38] = g, q[39] = Q, q[40] = U, q[41] = p, q[42] = r;
    else r = q[42];
    return r
}
// @from(Ln 288290, Col 0)
function D4Y() {}
// @from(Ln 288291, Col 4)
vZ
// @from(Ln 288292, Col 4)
tN4 = E(() => {
    e6();
    b7();
    i6();
    IL8();
    $G1();
    aN4();
    vZ = t(P6(), 1)
})
// @from(Ln 288301, Col 4)
o9 = E(() => {
    v3();
    tN4()
})
// @from(Ln 288306, Col 0)
function be(A) {
    let q = A6(13),
        {
            title: K,
            subtitle: Y,
            color: z,
            workerBadge: _
        } = A,
        w = z === void 0 ? "permission" : z,
        O;
    if (q[0] !== w || q[1] !== K) O = Ab.createElement(T, {
        bold: !0,
        color: w
    }, K), q[0] = w, q[1] = K, q[2] = O;
    else O = q[2];
    let $;
    if (q[3] !== _) $ = _ && Ab.createElement(T, {
        dimColor: !0
    }, "· ", "@", _.name), q[3] = _, q[4] = $;
    else $ = q[4];
    let H;
    if (q[5] !== O || q[6] !== $) H = Ab.createElement(m, {
        flexDirection: "row",
        gap: 1
    }, O, $), q[5] = O, q[6] = $, q[7] = H;
    else H = q[7];
    let j;
    if (q[8] !== Y) j = Y != null && (typeof Y === "string" ? Ab.createElement(T, {
        dimColor: !0,
        wrap: "truncate-start"
    }, Y) : Y), q[8] = Y, q[9] = j;
    else j = q[9];
    let J;
    if (q[10] !== H || q[11] !== j) J = Ab.createElement(m, {
        flexDirection: "column"
    }, H, j), q[10] = H, q[11] = j, q[12] = J;
    else J = q[12];
    return J
}
// @from(Ln 288345, Col 4)
Ab
// @from(Ln 288346, Col 4)
NU6 = E(() => {
    e6();
    i6();
    Ab = t(P6(), 1)
})
// @from(Ln 288352, Col 0)
function cz(A) {
    let q = A6(15),
        {
            title: K,
            subtitle: Y,
            color: z,
            titleColor: _,
            innerPaddingX: w,
            workerBadge: O,
            titleRight: $,
            children: H
        } = A,
        j = z === void 0 ? "permission" : z,
        J = w === void 0 ? 1 : w,
        M;
    if (q[0] !== Y || q[1] !== K || q[2] !== _ || q[3] !== O) M = qb.createElement(be, {
        title: K,
        subtitle: Y,
        color: _,
        workerBadge: O
    }), q[0] = Y, q[1] = K, q[2] = _, q[3] = O, q[4] = M;
    else M = q[4];
    let D;
    if (q[5] !== M || q[6] !== $) D = qb.createElement(m, {
        paddingX: 1,
        flexDirection: "column"
    }, qb.createElement(m, {
        justifyContent: "space-between"
    }, M, $)), q[5] = M, q[6] = $, q[7] = D;
    else D = q[7];
    let X;
    if (q[8] !== H || q[9] !== J) X = qb.createElement(m, {
        flexDirection: "column",
        paddingX: J
    }, H), q[8] = H, q[9] = J, q[10] = X;
    else X = q[10];
    let P;
    if (q[11] !== j || q[12] !== D || q[13] !== X) P = qb.createElement(m, {
        flexDirection: "column",
        borderStyle: "round",
        borderColor: j,
        borderLeft: !1,
        borderRight: !1,
        borderBottom: !1,
        marginTop: 1
    }, D, X), q[11] = j, q[12] = D, q[13] = X, q[14] = P;
    else P = q[14];
    return P
}
// @from(Ln 288401, Col 4)
qb
// @from(Ln 288402, Col 4)
NZ = E(() => {
    e6();
    i6();
    NU6();
    qb = t(P6(), 1)
})
// @from(Ln 288408, Col 4)
eN4
// @from(Ln 288408, Col 9)
YG6
// @from(Ln 288409, Col 4)
uG1 = E(() => {
    eN4 = ["apiKeyHelper", "awsAuthRefresh", "awsCredentialExport", "gcpAuthRefresh", "otelHeadersHelper", "statusLine"], YG6 = new Set(["ANTHROPIC_CUSTOM_HEADERS", "ANTHROPIC_DEFAULT_HAIKU_MODEL", "ANTHROPIC_DEFAULT_OPUS_MODEL", "ANTHROPIC_DEFAULT_SONNET_MODEL", "ANTHROPIC_FOUNDRY_API_KEY", "ANTHROPIC_MODEL", "ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION", "ANTHROPIC_SMALL_FAST_MODEL", "AWS_DEFAULT_REGION", "AWS_PROFILE", "AWS_REGION", "BASH_DEFAULT_TIMEOUT_MS", "BASH_MAX_OUTPUT_LENGTH", "BASH_MAX_TIMEOUT_MS", "CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR", "CLAUDE_CODE_API_KEY_HELPER_TTL_MS", "CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS", "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC", "CLAUDE_CODE_DISABLE_TERMINAL_TITLE", "CLAUDE_CODE_ENABLE_TELEMETRY", "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS", "CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL", "CLAUDE_CODE_MAX_OUTPUT_TOKENS", "CLAUDE_CODE_SKIP_BEDROCK_AUTH", "CLAUDE_CODE_SKIP_FOUNDRY_AUTH", "CLAUDE_CODE_SKIP_VERTEX_AUTH", "CLAUDE_CODE_SUBAGENT_MODEL", "CLAUDE_CODE_USE_BEDROCK", "CLAUDE_CODE_USE_FOUNDRY", "CLAUDE_CODE_USE_VERTEX", "DISABLE_AUTOUPDATER", "DISABLE_BUG_COMMAND", "DISABLE_COST_WARNINGS", "DISABLE_ERROR_REPORTING", "DISABLE_FEEDBACK_COMMAND", "DISABLE_TELEMETRY", "ENABLE_TOOL_SEARCH", "MAX_MCP_OUTPUT_TOKENS", "MAX_THINKING_TOKENS", "MCP_TIMEOUT", "MCP_TOOL_TIMEOUT", "OTEL_EXPORTER_OTLP_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_PROTOCOL", "OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE", "OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY", "OTEL_EXPORTER_OTLP_METRICS_HEADERS", "OTEL_EXPORTER_OTLP_METRICS_PROTOCOL", "OTEL_EXPORTER_OTLP_PROTOCOL", "OTEL_EXPORTER_OTLP_TRACES_HEADERS", "OTEL_LOG_USER_PROMPTS", "OTEL_LOGS_EXPORT_INTERVAL", "OTEL_LOGS_EXPORTER", "OTEL_METRIC_EXPORT_INTERVAL", "OTEL_METRICS_EXPORTER", "OTEL_METRICS_INCLUDE_ACCOUNT_UUID", "OTEL_METRICS_INCLUDE_SESSION_ID", "OTEL_METRICS_INCLUDE_VERSION", "OTEL_RESOURCE_ATTRIBUTES", "USE_BUILTIN_RIPGREP", "VERTEX_REGION_CLAUDE_3_5_HAIKU", "VERTEX_REGION_CLAUDE_3_5_SONNET", "VERTEX_REGION_CLAUDE_3_7_SONNET", "VERTEX_REGION_CLAUDE_4_0_OPUS", "VERTEX_REGION_CLAUDE_4_0_SONNET", "VERTEX_REGION_CLAUDE_4_1_OPUS", "VERTEX_REGION_CLAUDE_HAIKU_4_5"])
})
// @from(Ln 288413, Col 0)
function zG6(A) {
    if (!A) return {
        shellSettings: {},
        envVars: {},
        hasHooks: !1
    };
    let q = {};
    for (let z of eN4) {
        let _ = A[z];
        if (typeof _ === "string" && _.length > 0) q[z] = _
    }
    let K = {};
    if (A.env && typeof A.env === "object") {
        for (let [z, _] of Object.entries(A.env))
            if (typeof _ === "string" && _.length > 0) {
                if (!YG6.has(z.toUpperCase())) K[z] = _
            }
    }
    let Y = A.hooks !== void 0 && A.hooks !== null && typeof A.hooks === "object" && Object.keys(A.hooks).length > 0;
    return {
        shellSettings: q,
        envVars: K,
        hasHooks: Y,
        hooks: Y ? A.hooks : void 0
    }
}
// @from(Ln 288440, Col 0)
function mG1(A) {
    return Object.keys(A.shellSettings).length > 0 || Object.keys(A.envVars).length > 0 || A.hasHooks
}
// @from(Ln 288444, Col 0)
function AV4(A, q) {
    let K = zG6(A),
        Y = zG6(q);
    if (!mG1(Y)) return !1;
    if (!mG1(K)) return !0;
    let z = B6({
            shellSettings: K.shellSettings,
            envVars: K.envVars,
            hooks: K.hooks
        }),
        _ = B6({
            shellSettings: Y.shellSettings,
            envVars: Y.envVars,
            hooks: Y.hooks
        });
    return z !== _
}
// @from(Ln 288462, Col 0)
function qV4(A) {
    let q = [];
    for (let K of Object.keys(A.shellSettings)) q.push(K);
    for (let K of Object.keys(A.envVars)) q.push(K);
    if (A.hasHooks) q.push("hooks");
    return q
}
// @from(Ln 288469, Col 4)
GR8 = E(() => {
    uG1();
    g1()
})
// @from(Ln 288474, Col 0)
function KV4(A) {
    let q = A6(26),
        {
            settings: K,
            onAccept: Y,
            onReject: z
        } = A,
        _ = zG6(K),
        w = qV4(_),
        O = IK(),
        $;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = {
        context: "Confirmation"
    }, q[0] = $;
    else $ = q[0];
    D8("confirm:no", z, $);
    let H;
    if (q[1] !== Y || q[2] !== z) H = function(Q) {
        if (Q === "exit") {
            z();
            return
        }
        Y()
    }, q[1] = Y, q[2] = z, q[3] = H;
    else H = q[3];
    let j = H,
        J = cz,
        M = "warning",
        D = "warning",
        X = "Managed settings require approval",
        P = m,
        W = "column",
        Z = 1,
        G = 1,
        f;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) f = T0.default.createElement(T, null, "Your organization has configured managed settings that could allow execution of arbitrary code or interception of your prompts and responses."), q[4] = f;
    else f = q[4];
    let v = m,
        N = "column",
        V;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) V = T0.default.createElement(T, {
        dimColor: !0
    }, "Settings requiring approval:"), q[5] = V;
    else V = q[5];
    let L = w.map(X4Y),
        h;
    if (q[6] !== v || q[7] !== V || q[8] !== L) h = T0.default.createElement(v, {
        flexDirection: N
    }, V, L), q[6] = v, q[7] = V, q[8] = L, q[9] = h;
    else h = q[9];
    let R;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) R = T0.default.createElement(T, null, "Only accept if you trust your organization's IT administration and expect these settings to be configured."), q[10] = R;
    else R = q[10];
    let u;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) u = [{
        label: "Yes, I trust these settings",
        value: "accept"
    }, {
        label: "No, exit Claude Code",
        value: "exit"
    }], q[11] = u;
    else u = q[11];
    let I;
    if (q[12] !== j) I = T0.default.createElement(T8, {
        options: u,
        onChange: (p) => j(p),
        onCancel: () => j("exit")
    }), q[12] = j, q[13] = I;
    else I = q[13];
    let g;
    if (q[14] !== O.keyName || q[15] !== O.pending) g = T0.default.createElement(T, {
        dimColor: !0
    }, O.pending ? T0.default.createElement(T0.default.Fragment, null, "Press ", O.keyName, " again to exit") : T0.default.createElement(T0.default.Fragment, null, "Enter to confirm · Esc to exit")), q[14] = O.keyName, q[15] = O.pending, q[16] = g;
    else g = q[16];
    let B;
    if (q[17] !== P || q[18] !== h || q[19] !== I || q[20] !== g || q[21] !== f) B = T0.default.createElement(P, {
        flexDirection: W,
        gap: Z,
        paddingTop: G
    }, f, h, R, I, g), q[17] = P, q[18] = h, q[19] = I, q[20] = g, q[21] = f, q[22] = B;
    else B = q[22];
    let b;
    if (q[23] !== J || q[24] !== B) b = T0.default.createElement(J, {
        color: M,
        titleColor: D,
        title: X
    }, B), q[23] = J, q[24] = B, q[25] = b;
    else b = q[25];
    return b
}
// @from(Ln 288565, Col 0)
function X4Y(A, q) {
    return T0.default.createElement(m, {
        key: q,
        paddingLeft: 2
    }, T0.default.createElement(T, null, T0.default.createElement(T, {
        dimColor: !0
    }, "· "), T0.default.createElement(T, null, A)))
}
// @from(Ln 288573, Col 4)
T0
// @from(Ln 288574, Col 4)
YV4 = E(() => {
    e6();
    i6();
    o9();
    NZ();
    PO();
    _7();
    GR8();
    T0 = t(P6(), 1)
})
// @from(Ln 288591, Col 0)
function Z4Y() {
    if (bc !== null) return bc;
    if (process.stdin.isTTY) {
        bc = void 0;
        return
    }
    if (t6(!1)) {
        bc = void 0;
        return
    }
    if (process.argv.includes("mcp")) {
        bc = void 0;
        return
    }
    if (process.platform === "win32") {
        bc = void 0;
        return
    }
    try {
        let A = P4Y("/dev/tty", "r"),
            q = new W4Y(A);
        return q.isTTY = !0, bc = q, bc
    } catch (A) {
        _6(A), bc = void 0;
        return
    }
}
// @from(Ln 288619, Col 0)
function xc(A = !1) {
    let q = Z4Y(),
        K = {
            exitOnCtrlC: A
        };
    if (q) K.stdin = q;
    return K
}
// @from(Ln 288627, Col 4)
bc = null
// @from(Ln 288628, Col 4)
VU6 = E(() => {
    A8();
    k1()
})
// @from(Ln 288633, Col 0)
function f4Y(A, q) {
    let K = A6(9),
        {
            addNotification: Y,
            removeNotification: z
        } = o4(),
        _;
    if (K[0] !== Y || K[1] !== z || K[2] !== A) _ = () => {
        if (A.length === 0) {
            z("keybinding-config-warning");
            return
        }
        let O = A.filter(v4Y).length,
            $ = A.filter(T4Y).length,
            H;
        if (O > 0 && $ > 0) H = `Found ${O} keybinding error${O>1?"s":""} and ${$} warning${$>1?"s":""}`;
        else if (O > 0) H = `Found ${O} keybinding error${O>1?"s":""}`;
        else H = `Found ${$} keybinding warning${$>1?"s":""}`;
        H = H + " · /doctor for details", Y({
            key: "keybinding-config-warning",
            text: H,
            color: O > 0 ? "error" : "warning",
            priority: O > 0 ? "immediate" : "high",
            timeoutMs: 60000
        })
    }, K[0] = Y, K[1] = z, K[2] = A, K[3] = _;
    else _ = K[3];
    let w;
    if (K[4] !== Y || K[5] !== q || K[6] !== z || K[7] !== A) w = [A, q, Y, z], K[4] = Y, K[5] = q, K[6] = z, K[7] = A, K[8] = w;
    else w = K[8];
    wM.useEffect(_, w)
}
// @from(Ln 288666, Col 0)
function T4Y(A) {
    return A.severity === "warning"
}
// @from(Ln 288670, Col 0)
function v4Y(A) {
    return A.severity === "error"
}
// @from(Ln 288674, Col 0)
function aj({
    children: A
}) {
    let [{
        bindings: q,
        warnings: K
    }, Y] = wM.useState(() => {
        let W = $p6();
        return k(`[keybindings] KeybindingSetup initialized with ${W.bindings.length} bindings, ${W.warnings.length} warnings`), W
    }), [z, _] = wM.useState(!1);
    f4Y(K, z);
    let w = wM.useRef(null),
        [O, $] = wM.useState(null),
        H = wM.useRef(null),
        j = wM.useRef(new Map),
        J = wM.useRef(new Set),
        M = wM.useCallback((W) => {
            J.current.add(W)
        }, []),
        D = wM.useCallback((W) => {
            J.current.delete(W)
        }, []),
        X = wM.useCallback(() => {
            if (H.current) clearTimeout(H.current), H.current = null
        }, []),
        P = wM.useCallback((W) => {
            if (X(), W !== null) H.current = setTimeout((Z, G) => {
                k("[keybindings] Chord timeout - cancelling"), Z.current = null, G(null)
            }, G4Y, w, $);
            w.current = W, $(W)
        }, [X]);
    return wM.useEffect(() => {
        B34();
        let W = g34((Z) => {
            _(!0), Y(Z), k(`[keybindings] Reloaded: ${Z.bindings.length} bindings, ${Z.warnings.length} warnings`)
        });
        return () => {
            W(), X()
        }
    }, [X]), wM.default.createElement(G$1, {
        bindings: q,
        pendingChordRef: w,
        pendingChord: O,
        setPendingChord: P,
        activeContexts: J.current,
        registerActiveContext: M,
        unregisterActiveContext: D,
        handlerRegistryRef: j
    }, wM.default.createElement(N4Y, {
        bindings: q,
        pendingChordRef: w,
        setPendingChord: P,
        activeContexts: J.current,
        handlerRegistryRef: j
    }), A)
}
// @from(Ln 288731, Col 0)
function N4Y(A) {
    let q = A6(6),
        {
            bindings: K,
            pendingChordRef: Y,
            setPendingChord: z,
            activeContexts: _,
            handlerRegistryRef: w
        } = A,
        O;
    if (q[0] !== _ || q[1] !== K || q[2] !== w || q[3] !== Y || q[4] !== z) O = (H, j, J) => {
        let M = w.current,
            D = new Set;
        if (M)
            for (let Z of M.values())
                for (let G of Z) D.add(G.context);
        let X = [...D, ..._, "Global"],
            P = Y.current !== null,
            W = Z$1(H, j, X, K, Y.current);
        A: switch (W.type) {
            case "chord_started": {
                z(W.pending), J.stopImmediatePropagation();
                break A
            }
            case "match": {
                if (z(null), P) {
                    let Z = new Set(X);
                    if (M) {
                        let G = M.get(W.action);
                        if (G && G.size > 0) {
                            for (let f of G)
                                if (Z.has(f.context)) {
                                    f.handler(), J.stopImmediatePropagation();
                                    break
                                }
                        }
                    }
                }
                break A
            }
            case "chord_cancelled": {
                z(null);
                break A
            }
            case "unbound": {
                z(null);
                break A
            }
            case "none":
        }
    }, q[0] = _, q[1] = K, q[2] = w, q[3] = Y, q[4] = z, q[5] = O;
    else O = q[5];
    return jA(O), null
}
// @from(Ln 288785, Col 4)
wM
// @from(Ln 288785, Col 8)
G4Y = 1000
// @from(Ln 288786, Col 4)
Mg = E(() => {
    e6();
    i6();
    Rm();
    cd();
    H1();
    wz();
    Uu6();
    wM = t(P6(), 1)
})
// @from(Ln 288796, Col 0)
async function zV4(A, q) {
    if (!q || !mG1(zG6(q))) return "no_check_needed";
    if (!AV4(A, q)) return "no_check_needed";
    if (!DW()) return "no_check_needed";
    return d("tengu_managed_settings_security_dialog_shown", {}), new Promise((K) => {
        (async () => {
            let {
                unmount: Y
            } = await BC(BG1.default.createElement(Yj, null, BG1.default.createElement(aj, null, BG1.default.createElement(KV4, {
                settings: q,
                onAccept: () => {
                    d("tengu_managed_settings_security_dialog_accepted", {}), Y(), K("approved")
                },
                onReject: () => {
                    d("tengu_managed_settings_security_dialog_rejected", {}), Y(), K("rejected")
                }
            }))), xc(!1))
        })()
    })
}
// @from(Ln 288817, Col 0)
function _V4(A) {
    if (A === "rejected") return fK(1), !1;
    return !0
}
// @from(Ln 288821, Col 4)
BG1
// @from(Ln 288822, Col 4)
wV4 = E(() => {
    i6();
    YV4();
    NA();
    T1();
    V1();
    c_();
    GR8();
    VU6();
    Mg();
    BG1 = t(P6(), 1)
})
// @from(Ln 288838, Col 0)
function fR8() {
    return _G6
}
// @from(Ln 288842, Col 0)
function wG6(A) {
    _G6 = A
}
// @from(Ln 288846, Col 0)
function kU6() {
    return V4Y(c8(), k4Y)
}
// @from(Ln 288850, Col 0)
function Dg() {
    if (QA() !== "firstParty") return !1;
    if (!ax()) return !1;
    let A = sA();
    if (A?.accessToken && A.scopes?.includes(ZV) && (A.subscriptionType === "enterprise" || A.subscriptionType === "team")) return !0;
    try {
        let {
            key: q
        } = s2({
            skipRetrievingKeyFromApiKeyHelper: !0
        });
        if (q) return !0
    } catch {}
    return !1
}
// @from(Ln 288866, Col 0)
function TR8() {
    try {
        let A = kU6(),
            q = IM(A),
            K = WK(q, !1);
        if (!K || typeof K !== "object" || Array.isArray(K)) return null;
        return K
    } catch {
        return null
    }
}
// @from(Ln 288878, Col 0)
function gG1() {
    if (!Dg()) return null;
    if (_G6) return _G6;
    let A = TR8();
    if (A) return _G6 = A, A;
    return null
}
// @from(Ln 288886, Col 0)
function OV4() {
    _G6 = null
}
// @from(Ln 288889, Col 4)
k4Y = "remote-settings.json"
// @from(Ln 288890, Col 4)
_G6 = null
// @from(Ln 288891, Col 4)
vR8 = E(() => {
    A8();
    Nz();
    fA();
    F5();
    Z7();
    K_()
})
// @from(Ln 288907, Col 0)
function HV4() {
    if (o96) return;
    if (Dg()) o96 = new Promise((A) => {
        uc = A, setTimeout(() => {
            if (uc) k("Remote settings: Loading promise timed out, resolving anyway"), uc(), uc = null
        }, h4Y)
    })
}
// @from(Ln 288916, Col 0)
function S4Y() {
    return `${P7().BASE_API_URL}/api/claude_code/settings`
}
// @from(Ln 288920, Col 0)
function VR8(A) {
    if (Array.isArray(A)) return A.map(VR8);
    if (A !== null && typeof A === "object") {
        let q = {};
        for (let K of Object.keys(A).sort()) q[K] = VR8(A[K]);
        return q
    }
    return A
}
// @from(Ln 288930, Col 0)
function C4Y(A) {
    let q = VR8(A),
        K = B6(q);
    return `sha256:${E4Y("sha256").update(K).digest("hex")}`
}
// @from(Ln 288936, Col 0)
function kR8() {
    return Dg()
}
// @from(Ln 288939, Col 0)
async function FG1() {
    if (o96) await o96
}
// @from(Ln 288943, Col 0)
function I4Y() {
    try {
        let {
            key: q
        } = s2({
            skipRetrievingKeyFromApiKeyHelper: !0
        });
        if (q) return {
            headers: {
                "x-api-key": q
            }
        }
    } catch {}
    let A = sA();
    if (A?.accessToken) return {
        headers: {
            Authorization: `Bearer ${A.accessToken}`,
            "anthropic-beta": DP
        }
    };
    return {
        headers: {},
        error: "No authentication available"
    }
}
// @from(Ln 288968, Col 0)
async function b4Y(A) {
    let q = null;
    for (let K = 1; K <= NR8 + 1; K++) {
        if (q = await x4Y(A), q.success) return q;
        if (q.skipRetry) return q;
        if (K > NR8) return q;
        let Y = VI(K);
        k(`Remote settings: Retry ${K}/${NR8} after ${Y}ms`), await uk(Y)
    }
    return q
}
// @from(Ln 288979, Col 0)
async function x4Y(A) {
    try {
        await dz();
        let q = I4Y();
        if (q.error) return {
            success: !1,
            error: "Authentication required for remote settings",
            skipRetry: !0
        };
        let K = S4Y(),
            Y = {
                ...q.headers,
                "User-Agent": pO()
            };
        if (A) Y["If-None-Match"] = `"${A}"`;
        let z = await X8.get(K, {
            headers: Y,
            timeout: L4Y,
            validateStatus: (O) => O === 200 || O === 204 || O === 304 || O === 404
        });
        if (z.status === 304) return k("Remote settings: Using cached settings (304)"), {
            success: !0,
            settings: null,
            checksum: A
        };
        if (z.status === 204 || z.status === 404) return k(`Remote settings: No settings found (${z.status})`), {
            success: !0,
            settings: {},
            checksum: void 0
        };
        let _ = nN4().safeParse(z.data);
        if (!_.success) return k(`Remote settings: Invalid response format - ${_.error.message}`), {
            success: !1,
            error: "Invalid remote settings format"
        };
        let w = oD().safeParse(_.data.settings);
        if (!w.success) return k(`Remote settings: Settings validation failed - ${w.error.message}`), {
            success: !1,
            error: "Invalid settings structure"
        };
        return k("Remote settings: Fetched successfully"), {
            success: !0,
            settings: w.data,
            checksum: _.data.checksum
        }
    } catch (q) {
        if (X8.isAxiosError(q)) {
            let K = q;
            if (K.response?.status === 404) return {
                success: !0,
                settings: {},
                checksum: ""
            };
            if (K.response?.status === 401 || K.response?.status === 403) return {
                success: !1,
                error: "Not authorized for remote settings",
                skipRetry: !0
            };
            if (K.code === "ECONNABORTED") return {
                success: !1,
                error: "Remote settings request timeout"
            };
            if (K.code === "ECONNREFUSED" || K.code === "ENOTFOUND") return {
                success: !1,
                error: "Cannot connect to server"
            }
        }
        return {
            success: !1,
            error: q instanceof Error ? q.message : "Unknown error"
        }
    }
}
// @from(Ln 289052, Col 0)
async function u4Y(A) {
    try {
        let q = kU6(),
            K = await y4Y(q, "w", 384);
        try {
            await K.writeFile(B6(A, null, 2), {
                encoding: "utf-8"
            }), await K.datasync()
        } finally {
            await K.close()
        }
        k(`Remote settings: Saved to ${q}`)
    } catch (q) {
        k(`Remote settings: Failed to save - ${q instanceof Error?q.message:"unknown error"}`)
    }
}
// @from(Ln 289068, Col 0)
async function ER8() {
    JV4(), OV4(), o96 = null, uc = null;
    try {
        let A = kU6();
        await $V4(A)
    } catch {}
}
// @from(Ln 289075, Col 0)
async function yR8() {
    if (!Dg()) return null;
    let A = TR8(),
        q = A ? C4Y(A) : void 0;
    try {
        let K = await b4Y(q);
        if (!K.success) {
            if (A) return k("Remote settings: Using stale cache after fetch failure"), wG6(A), A;
            return null
        }
        if (K.settings === null && A) return k("Remote settings: Cache still valid (304 Not Modified)"), wG6(A), A;
        let Y = K.settings || {};
        if (Object.keys(Y).length > 0) {
            let _ = await zV4(A, Y);
            if (!_V4(_)) return k("Remote settings: User rejected new settings, using cached settings"), A;
            return wG6(Y), await u4Y(Y), k("Remote settings: Applied new settings successfully"), Y
        }
        wG6(Y);
        try {
            let _ = kU6();
            await $V4(_), k("Remote settings: Deleted cached file (404 response)")
        } catch (_) {
            if (_.code !== "ENOENT") k(`Remote settings: Failed to delete cached file - ${_ instanceof Error?_.message:"unknown error"}`)
        }
        return Y
    } catch {
        if (A) return k("Remote settings: Using stale cache after error"), wG6(A), A;
        return null
    }
}
// @from(Ln 289105, Col 0)
async function jV4() {
    if (Dg() && !o96) o96 = new Promise((A) => {
        uc = A
    });
    try {
        let A = await yR8();
        if (Dg()) B4Y();
        if (A !== null) tO.notifyChange("policySettings")
    } finally {
        if (uc) uc(), uc = null
    }
}
// @from(Ln 289117, Col 0)
async function pG1() {
    if (await ER8(), !Dg()) {
        tO.notifyChange("policySettings");
        return
    }
    await yR8(), k("Remote settings: Refreshed after auth change"), tO.notifyChange("policySettings")
}
// @from(Ln 289124, Col 0)
async function m4Y() {
    if (!Dg()) return;
    let A = fR8(),
        q = A ? B6(A) : null;
    try {
        await yR8();
        let K = fR8();
        if ((K ? B6(K) : null) !== q) k("Remote settings: Changed during background poll"), tO.notifyChange("policySettings")
    } catch {}
}
// @from(Ln 289135, Col 0)
function B4Y() {
    if (OG6 !== null) return;
    if (!Dg()) return;
    OG6 = setInterval(() => {
        m4Y()
    }, R4Y), OG6.unref(), E4(async () => JV4())
}
// @from(Ln 289143, Col 0)
function JV4() {
    if (OG6 !== null) clearInterval(OG6), OG6 = null
}
// @from(Ln 289146, Col 4)
L4Y = 1e4
// @from(Ln 289147, Col 4)
NR8 = 5
// @from(Ln 289148, Col 4)
R4Y = 3600000
// @from(Ln 289149, Col 4)
OG6 = null
// @from(Ln 289150, Col 4)
o96 = null
// @from(Ln 289151, Col 4)
uc = null
// @from(Ln 289152, Col 4)
h4Y = 30000
// @from(Ln 289153, Col 4)
$G6 = E(() => {
    kK();
    RM();
    H1();
    F5();
    fA();
    jC();
    rN4();
    Ud();
    uv();
    Hm();
    KY();
    wV4();
    g1();
    vR8()
})
// @from(Ln 289169, Col 4)
LR8
// @from(Ln 289170, Col 4)
MV4 = E(() => {
    K7();
    LR8 = F6(() => C.object({
        restrictions: C.record(C.string(), C.object({
            allowed: C.boolean()
        }))
    }))
})
// @from(Ln 289178, Col 4)
xR8 = {}
// @from(Ln 289204, Col 0)
function U4Y(A) {
    return A instanceof Error
}
// @from(Ln 289208, Col 0)
function SR8() {
    if (a96) return;
    if (Kb()) a96 = new Promise((A) => {
        mc = A, setTimeout(() => {
            if (mc) k("Policy limits: Loading promise timed out, resolving anyway"), mc(), mc = null
        }, i4Y)
    })
}
// @from(Ln 289217, Col 0)
function QG1() {
    return g4Y(c8(), d4Y)
}
// @from(Ln 289221, Col 0)
function n4Y() {
    return `${P7().BASE_API_URL}/api/claude_code/policy_limits`
}
// @from(Ln 289225, Col 0)
function hR8(A) {
    if (Array.isArray(A)) return A.map(hR8);
    if (A !== null && typeof A === "object") {
        let q = {};
        for (let [K, Y] of Object.entries(A).sort(([z], [_]) => z.localeCompare(_))) q[K] = hR8(Y);
        return q
    }
    return A
}
// @from(Ln 289235, Col 0)
function r4Y(A) {
    let q = hR8(A),
        K = B6(q);
    return `sha256:${F4Y("sha256").update(K).digest("hex")}`
}
// @from(Ln 289241, Col 0)
function Kb() {
    if (QA() !== "firstParty") return !1;
    if (!ax()) return !1;
    try {
        let {
            key: q
        } = s2({
            skipRetrievingKeyFromApiKeyHelper: !0
        });
        if (q) return !0
    } catch {}
    let A = sA();
    if (!A?.accessToken) return !1;
    if (!A.scopes?.includes(ZV)) return !1;
    if (A.subscriptionType !== "enterprise" && A.subscriptionType !== "team") return !1;
    return !0
}
// @from(Ln 289258, Col 0)
async function EU6() {
    if (a96) await a96
}
// @from(Ln 289262, Col 0)
function o4Y() {
    try {
        let {
            key: q
        } = s2({
            skipRetrievingKeyFromApiKeyHelper: !0
        });
        if (q) return {
            headers: {
                "x-api-key": q
            }
        }
    } catch {}
    let A = sA();
    if (A?.accessToken) return {
        headers: {
            Authorization: `Bearer ${A.accessToken}`,
            "anthropic-beta": DP
        }
    };
    return {
        headers: {},
        error: "No authentication available"
    }
}
// @from(Ln 289287, Col 0)
async function a4Y(A) {
    let q = null;
    for (let K = 1; K <= RR8 + 1; K++) {
        if (q = await s4Y(A), q.success) return q;
        if (q.skipRetry) return q;
        if (K > RR8) return q;
        let Y = VI(K);
        k(`Policy limits: Retry ${K}/${RR8} after ${Y}ms`), await uk(Y)
    }
    return q
}
// @from(Ln 289298, Col 0)
async function s4Y(A) {
    try {
        await dz();
        let q = o4Y();
        if (q.error) return {
            success: !1,
            error: "Authentication required for policy limits",
            skipRetry: !0
        };
        let K = n4Y(),
            Y = {
                ...q.headers,
                "User-Agent": pO()
            };
        if (A) Y["If-None-Match"] = `"${A}"`;
        let z = await X8.get(K, {
            headers: Y,
            timeout: c4Y,
            validateStatus: (w) => w === 200 || w === 304 || w === 404
        });
        if (z.status === 304) return k("Policy limits: Using cached restrictions (304)"), {
            success: !0,
            restrictions: null,
            etag: A
        };
        if (z.status === 404) return k("Policy limits: No restrictions found (404)"), {
            success: !0,
            restrictions: {},
            etag: void 0
        };
        let _ = LR8().safeParse(z.data);
        if (!_.success) return k(`Policy limits: Invalid response format - ${_.error.message}`), {
            success: !1,
            error: "Invalid policy limits format"
        };
        return k("Policy limits: Fetched successfully"), {
            success: !0,
            restrictions: _.data.restrictions
        }
    } catch (q) {
        if (X8.isAxiosError(q)) {
            if (q.response?.status === 401 || q.response?.status === 403) return {
                success: !1,
                error: "Not authorized for policy limits",
                skipRetry: !0
            };
            if (q.code === "ECONNABORTED") return {
                success: !1,
                error: "Policy limits request timeout"
            };
            if (q.code === "ECONNREFUSED" || q.code === "ENOTFOUND") return {
                success: !1,
                error: "Cannot connect to server"
            }
        }
        return {
            success: !1,
            error: q instanceof Error ? q.message : "Unknown error"
        }
    }
}
// @from(Ln 289360, Col 0)
function PV4() {
    try {
        let A = p4Y(QG1(), "utf-8"),
            q = WK(A, !1),
            K = LR8().safeParse(q);
        if (!K.success) return null;
        return K.data.restrictions
    } catch {
        return null
    }
}
// @from(Ln 289371, Col 0)
async function t4Y(A) {
    try {
        let q = QG1();
        await Q4Y(q, B6({
            restrictions: A
        }, null, 2), {
            encoding: "utf-8",
            mode: 384
        }), k(`Policy limits: Saved to ${q}`)
    } catch (q) {
        k(`Policy limits: Failed to save - ${q instanceof Error?q.message:"unknown error"}`)
    }
}
// @from(Ln 289384, Col 0)
async function CR8() {
    if (!Kb()) return null;
    let A = PV4(),
        q = A ? r4Y(A) : void 0;
    try {
        let K = await a4Y(q);
        if (!K.success) {
            if (A) return k("Policy limits: Using stale cache after fetch failure"), AE = A, A;
            return null
        }
        if (K.restrictions === null && A) return k("Policy limits: Cache still valid (304 Not Modified)"), AE = A, A;
        let Y = K.restrictions || {};
        if (Object.keys(Y).length > 0) return AE = Y, await t4Y(Y), k("Policy limits: Applied new restrictions successfully"), Y;
        AE = Y;
        try {
            await XV4(QG1()), k("Policy limits: Deleted cached file (404 response)")
        } catch (_) {
            if (U4Y(_) && _.code !== "ENOENT") k(`Policy limits: Failed to delete cached file - ${_.message}`)
        }
        return Y
    } catch {
        if (A) return k("Policy limits: Using stale cache after error"), AE = A, A;
        return null
    }
}
// @from(Ln 289410, Col 0)
function qD(A) {
    let q = e4Y();
    if (!q) return !0;
    let K = q[A];
    if (!K) return !0;
    return K.allowed
}
// @from(Ln 289418, Col 0)
function e4Y() {
    if (!Kb()) return null;
    if (AE) return AE;
    let A = PV4();
    if (A) return AE = A, A;
    return null
}
// @from(Ln 289425, Col 0)
async function IR8() {
    if (Kb() && !a96) a96 = new Promise((A) => {
        mc = A
    });
    try {
        if (await CR8(), Kb()) WV4()
    } finally {
        if (mc) mc(), mc = null
    }
}
// @from(Ln 289435, Col 0)
async function yU6() {
    if (await UG1(), !Kb()) return;
    await CR8(), k("Policy limits: Refreshed after auth change")
}
// @from(Ln 289439, Col 0)
async function UG1() {
    bR8(), AE = null, a96 = null, mc = null;
    try {
        await XV4(QG1())
    } catch {}
}
// @from(Ln 289445, Col 0)
async function AqY() {
    if (!Kb()) return;
    let A = AE ? B6(AE) : null;
    try {
        if (await CR8(), (AE ? B6(AE) : null) !== A) k("Policy limits: Changed during background poll")
    } catch {}
}
// @from(Ln 289453, Col 0)
function WV4() {
    if (HG6 !== null) return;
    if (!Kb()) return;
    if (HG6 = setInterval(() => {
            AqY()
        }, l4Y), HG6.unref(), !DV4) DV4 = !0, E4(async () => bR8())
}
// @from(Ln 289461, Col 0)
function bR8() {
    if (HG6 !== null) clearInterval(HG6), HG6 = null
}
// @from(Ln 289464, Col 4)
d4Y = "policy-limits.json"
// @from(Ln 289465, Col 4)
c4Y = 1e4
// @from(Ln 289466, Col 4)
RR8 = 5
// @from(Ln 289467, Col 4)
l4Y = 3600000
// @from(Ln 289468, Col 4)
HG6 = null
// @from(Ln 289469, Col 4)
DV4 = !1
// @from(Ln 289470, Col 4)
a96 = null
// @from(Ln 289471, Col 4)
mc = null
// @from(Ln 289472, Col 4)
i4Y = 30000
// @from(Ln 289473, Col 4)
AE = null
// @from(Ln 289474, Col 4)
AN = E(() => {
    kK();
    RM();
    H1();
    F5();
    fA();
    MV4();
    A8();
    Nz();
    K_();
    Ud();
    uv();
    KY();
    g1()
})
// @from(Ln 289489, Col 4)
dG1 = x((ZV4) => {
    Object.defineProperty(ZV4, "__esModule", {
        value: !0
    });
    ZV4.AggregationTemporality = void 0;
    var qqY;
    (function(A) {
        A[A.DELTA = 0] = "DELTA", A[A.CUMULATIVE = 1] = "CUMULATIVE"
    })(qqY = ZV4.AggregationTemporality || (ZV4.AggregationTemporality = {}))
})
// @from(Ln 289499, Col 4)
xe = x((fV4) => {
    Object.defineProperty(fV4, "__esModule", {
        value: !0
    });
    fV4.DataPointType = fV4.InstrumentType = void 0;
    var KqY;
    (function(A) {
        A.COUNTER = "COUNTER", A.GAUGE = "GAUGE", A.HISTOGRAM = "HISTOGRAM", A.UP_DOWN_COUNTER = "UP_DOWN_COUNTER", A.OBSERVABLE_COUNTER = "OBSERVABLE_COUNTER", A.OBSERVABLE_GAUGE = "OBSERVABLE_GAUGE", A.OBSERVABLE_UP_DOWN_COUNTER = "OBSERVABLE_UP_DOWN_COUNTER"
    })(KqY = fV4.InstrumentType || (fV4.InstrumentType = {}));
    var YqY;
    (function(A) {
        A[A.HISTOGRAM = 0] = "HISTOGRAM", A[A.EXPONENTIAL_HISTOGRAM = 1] = "EXPONENTIAL_HISTOGRAM", A[A.GAUGE = 2] = "GAUGE", A[A.SUM = 3] = "SUM"
    })(YqY = fV4.DataPointType || (fV4.DataPointType = {}))
})
// @from(Ln 289513, Col 4)
Yb = x((TV4) => {
    Object.defineProperty(TV4, "__esModule", {
        value: !0
    });
    TV4.equalsCaseInsensitive = TV4.binarySearchUB = TV4.setEquals = TV4.FlatMap = TV4.isPromiseAllSettledRejectionResult = TV4.PromiseAllSettled = TV4.callWithTimeout = TV4.TimeoutError = TV4.instrumentationScopeId = TV4.hashAttributes = TV4.isNotNullish = void 0;

    function zqY(A) {
        return A !== void 0 && A !== null
    }
    TV4.isNotNullish = zqY;

    function _qY(A) {
        let q = Object.keys(A);
        if (q.length === 0) return "";
        return q = q.sort(), JSON.stringify(q.map((K) => [K, A[K]]))
    }
    TV4.hashAttributes = _qY;

    function wqY(A) {
        return `${A.name}:${A.version??""}:${A.schemaUrl??""}`
    }
    TV4.instrumentationScopeId = wqY;
    class cG1 extends Error {
        constructor(A) {
            super(A);
            Object.setPrototypeOf(this, cG1.prototype)
        }
    }
    TV4.TimeoutError = cG1;

    function OqY(A, q) {
        let K, Y = new Promise(function(_, w) {
            K = setTimeout(function() {
                w(new cG1("Operation timed out."))
            }, q)
        });
        return Promise.race([A, Y]).then((z) => {
            return clearTimeout(K), z
        }, (z) => {
            throw clearTimeout(K), z
        })
    }
    TV4.callWithTimeout = OqY;
    async function $qY(A) {
        return Promise.all(A.map(async (q) => {
            try {
                return {
                    status: "fulfilled",
                    value: await q
                }
            } catch (K) {
                return {
                    status: "rejected",
                    reason: K
                }
            }
        }))
    }
    TV4.PromiseAllSettled = $qY;

    function HqY(A) {
        return A.status === "rejected"
    }
    TV4.isPromiseAllSettledRejectionResult = HqY;

    function jqY(A, q) {
        let K = [];
        return A.forEach((Y) => {
            K.push(...q(Y))
        }), K
    }
    TV4.FlatMap = jqY;

    function JqY(A, q) {
        if (A.size !== q.size) return !1;
        for (let K of A)
            if (!q.has(K)) return !1;
        return !0
    }
    TV4.setEquals = JqY;

    function MqY(A, q) {
        let K = 0,
            Y = A.length - 1,
            z = A.length;
        while (Y >= K) {
            let _ = K + Math.trunc((Y - K) / 2);
            if (A[_] < q) K = _ + 1;
            else z = _, Y = _ - 1
        }
        return z
    }
    TV4.binarySearchUB = MqY;

    function DqY(A, q) {
        return A.toLowerCase() === q.toLowerCase()
    }
    TV4.equalsCaseInsensitive = DqY
})
// @from(Ln 289612, Col 4)
jG6 = x((NV4) => {
    Object.defineProperty(NV4, "__esModule", {
        value: !0
    });
    NV4.AggregatorKind = void 0;
    var kqY;
    (function(A) {
        A[A.DROP = 0] = "DROP", A[A.SUM = 1] = "SUM", A[A.LAST_VALUE = 2] = "LAST_VALUE", A[A.HISTOGRAM = 3] = "HISTOGRAM", A[A.EXPONENTIAL_HISTOGRAM = 4] = "EXPONENTIAL_HISTOGRAM"
    })(kqY = NV4.AggregatorKind || (NV4.AggregatorKind = {}))
})
// @from(Ln 289622, Col 4)
yV4 = x((kV4) => {
    Object.defineProperty(kV4, "__esModule", {
        value: !0
    });
    kV4.DropAggregator = void 0;
    var EqY = jG6();
    class VV4 {
        kind = EqY.AggregatorKind.DROP;
        createAccumulation() {
            return
        }
        merge(A, q) {
            return
        }
        diff(A, q) {
            return
        }
        toMetricData(A, q, K, Y) {
            return
        }
    }
    kV4.DropAggregator = VV4
})
// @from(Ln 289645, Col 4)
SV4 = x((RV4) => {
    Object.defineProperty(RV4, "__esModule", {
        value: !0
    });
    RV4.HistogramAggregator = RV4.HistogramAccumulation = void 0;
    var yqY = jG6(),
        LU6 = xe(),
        LqY = Yb();

    function RqY(A) {
        let q = A.map(() => 0);
        return q.push(0), {
            buckets: {
                boundaries: A,
                counts: q
            },
            sum: 0,
            count: 0,
            hasMinMax: !1,
            min: 1 / 0,
            max: -1 / 0
        }
    }
    class RU6 {
        startTime;
        _boundaries;
        _recordMinMax;
        _current;
        constructor(A, q, K = !0, Y = RqY(q)) {
            this.startTime = A, this._boundaries = q, this._recordMinMax = K, this._current = Y
        }
        record(A) {
            if (Number.isNaN(A)) return;
            if (this._current.count += 1, this._current.sum += A, this._recordMinMax) this._current.min = Math.min(A, this._current.min), this._current.max = Math.max(A, this._current.max), this._current.hasMinMax = !0;
            let q = (0, LqY.binarySearchUB)(this._boundaries, A);
            this._current.buckets.counts[q] += 1
        }
        setStartTime(A) {
            this.startTime = A
        }
        toPointValue() {
            return this._current
        }
    }
    RV4.HistogramAccumulation = RU6;
    class LV4 {
        _boundaries;
        _recordMinMax;
        kind = yqY.AggregatorKind.HISTOGRAM;
        constructor(A, q) {
            this._boundaries = A, this._recordMinMax = q
        }
        createAccumulation(A) {
            return new RU6(A, this._boundaries, this._recordMinMax)
        }
        merge(A, q) {
            let K = A.toPointValue(),
                Y = q.toPointValue(),
                z = K.buckets.counts,
                _ = Y.buckets.counts,
                w = Array(z.length);
            for (let H = 0; H < z.length; H++) w[H] = z[H] + _[H];
            let O = 1 / 0,
                $ = -1 / 0;
            if (this._recordMinMax) {
                if (K.hasMinMax && Y.hasMinMax) O = Math.min(K.min, Y.min), $ = Math.max(K.max, Y.max);
                else if (K.hasMinMax) O = K.min, $ = K.max;
                else if (Y.hasMinMax) O = Y.min, $ = Y.max
            }
            return new RU6(A.startTime, K.buckets.boundaries, this._recordMinMax, {
                buckets: {
                    boundaries: K.buckets.boundaries,
                    counts: w
                },
                count: K.count + Y.count,
                sum: K.sum + Y.sum,
                hasMinMax: this._recordMinMax && (K.hasMinMax || Y.hasMinMax),
                min: O,
                max: $
            })
        }
        diff(A, q) {
            let K = A.toPointValue(),
                Y = q.toPointValue(),
                z = K.buckets.counts,
                _ = Y.buckets.counts,
                w = Array(z.length);
            for (let O = 0; O < z.length; O++) w[O] = _[O] - z[O];
            return new RU6(q.startTime, K.buckets.boundaries, this._recordMinMax, {
                buckets: {
                    boundaries: K.buckets.boundaries,
                    counts: w
                },
                count: Y.count - K.count,
                sum: Y.sum - K.sum,
                hasMinMax: !1,
                min: 1 / 0,
                max: -1 / 0
            })
        }
        toMetricData(A, q, K, Y) {
            return {
                descriptor: A,
                aggregationTemporality: q,
                dataPointType: LU6.DataPointType.HISTOGRAM,
                dataPoints: K.map(([z, _]) => {
                    let w = _.toPointValue(),
                        O = A.type === LU6.InstrumentType.GAUGE || A.type === LU6.InstrumentType.UP_DOWN_COUNTER || A.type === LU6.InstrumentType.OBSERVABLE_GAUGE || A.type === LU6.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
                    return {
                        attributes: z,
                        startTime: _.startTime,
                        endTime: Y,
                        value: {
                            min: w.hasMinMax ? w.min : void 0,
                            max: w.hasMinMax ? w.max : void 0,
                            sum: !O ? w.sum : void 0,
                            buckets: w.buckets,
                            count: w.count
                        }
                    }
                })
            }
        }
    }
    RV4.HistogramAggregator = LV4
})
// @from(Ln 289771, Col 4)
bV4 = x((CV4) => {
    Object.defineProperty(CV4, "__esModule", {
        value: !0
    });
    CV4.Buckets = void 0;
    class gR8 {
        backing;
        indexBase;
        indexStart;
        indexEnd;
        constructor(A = new FR8, q = 0, K = 0, Y = 0) {
            this.backing = A, this.indexBase = q, this.indexStart = K, this.indexEnd = Y
        }
        get offset() {
            return this.indexStart
        }
        get length() {
            if (this.backing.length === 0) return 0;
            if (this.indexEnd === this.indexStart && this.at(0) === 0) return 0;
            return this.indexEnd - this.indexStart + 1
        }
        counts() {
            return Array.from({
                length: this.length
            }, (A, q) => this.at(q))
        }
        at(A) {
            let q = this.indexBase - this.indexStart;
            if (A < q) A += this.backing.length;
            return A -= q, this.backing.countAt(A)
        }
        incrementBucket(A, q) {
            this.backing.increment(A, q)
        }
        decrementBucket(A, q) {
            this.backing.decrement(A, q)
        }
        trim() {
            for (let A = 0; A < this.length; A++)
                if (this.at(A) !== 0) {
                    this.indexStart += A;
                    break
                } else if (A === this.length - 1) {
                this.indexStart = this.indexEnd = this.indexBase = 0;
                return
            }
            for (let A = this.length - 1; A >= 0; A--)
                if (this.at(A) !== 0) {
                    this.indexEnd -= this.length - A - 1;
                    break
                } this._rotate()
        }
        downscale(A) {
            this._rotate();
            let q = 1 + this.indexEnd - this.indexStart,
                K = 1 << A,
                Y = 0,
                z = 0;
            for (let _ = this.indexStart; _ <= this.indexEnd;) {
                let w = _ % K;
                if (w < 0) w += K;
                for (let O = w; O < K && Y < q; O++) this._relocateBucket(z, Y), Y++, _++;
                z++
            }
            this.indexStart >>= A, this.indexEnd >>= A, this.indexBase = this.indexStart
        }
        clone() {
            return new gR8(this.backing.clone(), this.indexBase, this.indexStart, this.indexEnd)
        }
        _rotate() {
            let A = this.indexBase - this.indexStart;
            if (A === 0) return;
            else if (A > 0) this.backing.reverse(0, this.backing.length), this.backing.reverse(0, A), this.backing.reverse(A, this.backing.length);
            else this.backing.reverse(0, this.backing.length), this.backing.reverse(0, this.backing.length + A);
            this.indexBase = this.indexStart
        }
        _relocateBucket(A, q) {
            if (A === q) return;
            this.incrementBucket(A, this.backing.emptyBucket(q))
        }
    }
    CV4.Buckets = gR8;
    class FR8 {
        _counts;
        constructor(A = [0]) {
            this._counts = A
        }
        get length() {
            return this._counts.length
        }
        countAt(A) {
            return this._counts[A]
        }
        growTo(A, q, K) {
            let Y = Array(A).fill(0);
            Y.splice(K, this._counts.length - q, ...this._counts.slice(q)), Y.splice(0, q, ...this._counts.slice(0, q)), this._counts = Y
        }
        reverse(A, q) {
            let K = Math.floor((A + q) / 2) - A;
            for (let Y = 0; Y < K; Y++) {
                let z = this._counts[A + Y];
                this._counts[A + Y] = this._counts[q - Y - 1], this._counts[q - Y - 1] = z
            }
        }
        emptyBucket(A) {
            let q = this._counts[A];
            return this._counts[A] = 0, q
        }
        increment(A, q) {
            this._counts[A] += q
        }
        decrement(A, q) {
            if (this._counts[A] >= q) this._counts[A] -= q;
            else this._counts[A] = 0
        }
        clone() {
            return new FR8([...this._counts])
        }
    }
})
// @from(Ln 289891, Col 4)
QR8 = x((xV4) => {
    Object.defineProperty(xV4, "__esModule", {
        value: !0
    });
    xV4.getSignificand = xV4.getNormalBase2 = xV4.MIN_VALUE = xV4.MAX_NORMAL_EXPONENT = xV4.MIN_NORMAL_EXPONENT = xV4.SIGNIFICAND_WIDTH = void 0;
    xV4.SIGNIFICAND_WIDTH = 52;
    var SqY = 2146435072,
        CqY = 1048575,
        pR8 = 1023;
    xV4.MIN_NORMAL_EXPONENT = -pR8 + 1;
    xV4.MAX_NORMAL_EXPONENT = pR8;
    xV4.MIN_VALUE = Math.pow(2, -1022);

    function IqY(A) {
        let q = new DataView(new ArrayBuffer(8));
        return q.setFloat64(0, A), ((q.getUint32(0) & SqY) >> 20) - pR8
    }
    xV4.getNormalBase2 = IqY;

    function bqY(A) {
        let q = new DataView(new ArrayBuffer(8));
        q.setFloat64(0, A);
        let K = q.getUint32(0),
            Y = q.getUint32(4);
        return (K & CqY) * Math.pow(2, 32) + Y
    }
    xV4.getSignificand = bqY
})
// @from(Ln 289919, Col 4)
lG1 = x((mV4) => {
    Object.defineProperty(mV4, "__esModule", {
        value: !0
    });
    mV4.nextGreaterSquare = mV4.ldexp = void 0;

    function FqY(A, q) {
        if (A === 0 || A === Number.POSITIVE_INFINITY || A === Number.NEGATIVE_INFINITY || Number.isNaN(A)) return A;
        return A * Math.pow(2, q)
    }
    mV4.ldexp = FqY;

    function pqY(A) {
        return A--, A |= A >> 1, A |= A >> 2, A |= A >> 4, A |= A >> 8, A |= A >> 16, A++, A
    }
    mV4.nextGreaterSquare = pqY
})
// @from(Ln 289936, Col 4)
iG1 = x((FV4) => {
    Object.defineProperty(FV4, "__esModule", {
        value: !0
    });
    FV4.MappingError = void 0;
    class gV4 extends Error {}
    FV4.MappingError = gV4
})
// @from(Ln 289944, Col 4)
lV4 = x((dV4) => {
    Object.defineProperty(dV4, "__esModule", {
        value: !0
    });
    dV4.ExponentMapping = void 0;
    var JG6 = QR8(),
        UqY = lG1(),
        QV4 = iG1();
    class UV4 {
        _shift;
        constructor(A) {
            this._shift = -A
        }
        mapToIndex(A) {
            if (A < JG6.MIN_VALUE) return this._minNormalLowerBoundaryIndex();
            let q = JG6.getNormalBase2(A),
                K = this._rightShift(JG6.getSignificand(A) - 1, JG6.SIGNIFICAND_WIDTH);
            return q + K >> this._shift
        }
        lowerBoundary(A) {
            let q = this._minNormalLowerBoundaryIndex();
            if (A < q) throw new QV4.MappingError(`underflow: ${A} is < minimum lower boundary: ${q}`);
            let K = this._maxNormalLowerBoundaryIndex();
            if (A > K) throw new QV4.MappingError(`overflow: ${A} is > maximum lower boundary: ${K}`);
            return UqY.ldexp(1, A << this._shift)
        }
        get scale() {
            if (this._shift === 0) return 0;
            return -this._shift
        }
        _minNormalLowerBoundaryIndex() {
            let A = JG6.MIN_NORMAL_EXPONENT >> this._shift;
            if (this._shift < 2) A--;
            return A
        }
        _maxNormalLowerBoundaryIndex() {
            return JG6.MAX_NORMAL_EXPONENT >> this._shift
        }
        _rightShift(A, q) {
            return Math.floor(A * Math.pow(2, -q))
        }
    }
    dV4.ExponentMapping = UV4
})
// @from(Ln 289988, Col 4)
sV4 = x((oV4) => {
    Object.defineProperty(oV4, "__esModule", {
        value: !0
    });
    oV4.LogarithmMapping = void 0;
    var MG6 = QR8(),
        iV4 = lG1(),
        nV4 = iG1();
    class rV4 {
        _scale;
        _scaleFactor;
        _inverseFactor;
        constructor(A) {
            this._scale = A, this._scaleFactor = iV4.ldexp(Math.LOG2E, A), this._inverseFactor = iV4.ldexp(Math.LN2, -A)
        }
        mapToIndex(A) {
            if (A <= MG6.MIN_VALUE) return this._minNormalLowerBoundaryIndex() - 1;
            if (MG6.getSignificand(A) === 0) return (MG6.getNormalBase2(A) << this._scale) - 1;
            let q = Math.floor(Math.log(A) * this._scaleFactor),
                K = this._maxNormalLowerBoundaryIndex();
            if (q >= K) return K;
            return q
        }
        lowerBoundary(A) {
            let q = this._maxNormalLowerBoundaryIndex();
            if (A >= q) {
                if (A === q) return 2 * Math.exp((A - (1 << this._scale)) / this._scaleFactor);
                throw new nV4.MappingError(`overflow: ${A} is > maximum lower boundary: ${q}`)
            }
            let K = this._minNormalLowerBoundaryIndex();
            if (A <= K) {
                if (A === K) return MG6.MIN_VALUE;
                else if (A === K - 1) return Math.exp((A + (1 << this._scale)) / this._scaleFactor) / 2;
                throw new nV4.MappingError(`overflow: ${A} is < minimum lower boundary: ${K}`)
            }
            return Math.exp(A * this._inverseFactor)
        }
        get scale() {
            return this._scale
        }
        _minNormalLowerBoundaryIndex() {
            return MG6.MIN_NORMAL_EXPONENT << this._scale
        }
        _maxNormalLowerBoundaryIndex() {
            return (MG6.MAX_NORMAL_EXPONENT + 1 << this._scale) - 1
        }
    }
    oV4.LogarithmMapping = rV4
})
// @from(Ln 290037, Col 4)
Kk4 = x((Ak4) => {
    Object.defineProperty(Ak4, "__esModule", {
        value: !0
    });
    Ak4.getMapping = void 0;
    var dqY = lV4(),
        cqY = sV4(),
        lqY = iG1(),
        tV4 = -10,
        eV4 = 20,
        iqY = Array.from({
            length: 31
        }, (A, q) => {
            if (q > 10) return new cqY.LogarithmMapping(q - 10);
            return new dqY.ExponentMapping(q - 10)
        });

    function nqY(A) {
        if (A > eV4 || A < tV4) throw new lqY.MappingError(`expected scale >= ${tV4} && <= ${eV4}, got: ${A}`);
        return iqY[A + 10]
    }
    Ak4.getMapping = nqY
})