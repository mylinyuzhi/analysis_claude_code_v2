
// @from(Ln 304854, Col 4)
MY6 = x((mx4) => {
    Object.defineProperty(mx4, "__esModule", {
        value: !0
    });
    mx4.InterceptingListenerImpl = void 0;
    mx4.statusOrFromValue = q$Y;
    mx4.statusOrFromError = K$Y;
    mx4.isInterceptingListener = Y$Y;
    var A$Y = LX();

    function q$Y(A) {
        return {
            ok: !0,
            value: A
        }
    }

    function K$Y(A) {
        var q;
        return {
            ok: !1,
            error: Object.assign(Object.assign({}, A), {
                metadata: (q = A.metadata) !== null && q !== void 0 ? q : new A$Y.Metadata
            })
        }
    }

    function Y$Y(A) {
        return A.onReceiveMetadata !== void 0 && A.onReceiveMetadata.length === 1
    }
    class ux4 {
        constructor(A, q) {
            this.listener = A, this.nextListener = q, this.processingMetadata = !1, this.hasPendingMessage = !1, this.processingMessage = !1, this.pendingStatus = null
        }
        processPendingMessage() {
            if (this.hasPendingMessage) this.nextListener.onReceiveMessage(this.pendingMessage), this.pendingMessage = null, this.hasPendingMessage = !1
        }
        processPendingStatus() {
            if (this.pendingStatus) this.nextListener.onReceiveStatus(this.pendingStatus)
        }
        onReceiveMetadata(A) {
            this.processingMetadata = !0, this.listener.onReceiveMetadata(A, (q) => {
                this.processingMetadata = !1, this.nextListener.onReceiveMetadata(q), this.processPendingMessage(), this.processPendingStatus()
            })
        }
        onReceiveMessage(A) {
            this.processingMessage = !0, this.listener.onReceiveMessage(A, (q) => {
                if (this.processingMessage = !1, this.processingMetadata) this.pendingMessage = q, this.hasPendingMessage = !0;
                else this.nextListener.onReceiveMessage(q), this.processPendingStatus()
            })
        }
        onReceiveStatus(A) {
            this.listener.onReceiveStatus(A, (q) => {
                if (this.processingMetadata || this.processingMessage) this.pendingStatus = q;
                else this.nextListener.onReceiveStatus(q)
            })
        }
    }
    mx4.InterceptingListenerImpl = ux4
})
// @from(Ln 304914, Col 4)
aS8 = x((ix4) => {
    Object.defineProperty(ix4, "__esModule", {
        value: !0
    });
    ix4.InterceptingCall = ix4.RequesterBuilder = ix4.ListenerBuilder = ix4.InterceptorConfigurationError = void 0;
    ix4.getInterceptingCall = j$Y;
    var O$Y = LX(),
        gx4 = MY6(),
        Fx4 = a3(),
        px4 = xf1();
    class qd6 extends Error {
        constructor(A) {
            super(A);
            this.name = "InterceptorConfigurationError", Error.captureStackTrace(this, qd6)
        }
    }
    ix4.InterceptorConfigurationError = qd6;
    class Qx4 {
        constructor() {
            this.metadata = void 0, this.message = void 0, this.status = void 0
        }
        withOnReceiveMetadata(A) {
            return this.metadata = A, this
        }
        withOnReceiveMessage(A) {
            return this.message = A, this
        }
        withOnReceiveStatus(A) {
            return this.status = A, this
        }
        build() {
            return {
                onReceiveMetadata: this.metadata,
                onReceiveMessage: this.message,
                onReceiveStatus: this.status
            }
        }
    }
    ix4.ListenerBuilder = Qx4;
    class Ux4 {
        constructor() {
            this.start = void 0, this.message = void 0, this.halfClose = void 0, this.cancel = void 0
        }
        withStart(A) {
            return this.start = A, this
        }
        withSendMessage(A) {
            return this.message = A, this
        }
        withHalfClose(A) {
            return this.halfClose = A, this
        }
        withCancel(A) {
            return this.cancel = A, this
        }
        build() {
            return {
                start: this.start,
                sendMessage: this.message,
                halfClose: this.halfClose,
                cancel: this.cancel
            }
        }
    }
    ix4.RequesterBuilder = Ux4;
    var rS8 = {
            onReceiveMetadata: (A, q) => {
                q(A)
            },
            onReceiveMessage: (A, q) => {
                q(A)
            },
            onReceiveStatus: (A, q) => {
                q(A)
            }
        },
        Ad6 = {
            start: (A, q, K) => {
                K(A, q)
            },
            sendMessage: (A, q) => {
                q(A)
            },
            halfClose: (A) => {
                A()
            },
            cancel: (A) => {
                A()
            }
        };
    class dx4 {
        constructor(A, q) {
            var K, Y, z, _;
            if (this.nextCall = A, this.processingMetadata = !1, this.pendingMessageContext = null, this.processingMessage = !1, this.pendingHalfClose = !1, q) this.requester = {
                start: (K = q.start) !== null && K !== void 0 ? K : Ad6.start,
                sendMessage: (Y = q.sendMessage) !== null && Y !== void 0 ? Y : Ad6.sendMessage,
                halfClose: (z = q.halfClose) !== null && z !== void 0 ? z : Ad6.halfClose,
                cancel: (_ = q.cancel) !== null && _ !== void 0 ? _ : Ad6.cancel
            };
            else this.requester = Ad6
        }
        cancelWithStatus(A, q) {
            this.requester.cancel(() => {
                this.nextCall.cancelWithStatus(A, q)
            })
        }
        getPeer() {
            return this.nextCall.getPeer()
        }
        processPendingMessage() {
            if (this.pendingMessageContext) this.nextCall.sendMessageWithContext(this.pendingMessageContext, this.pendingMessage), this.pendingMessageContext = null, this.pendingMessage = null
        }
        processPendingHalfClose() {
            if (this.pendingHalfClose) this.nextCall.halfClose()
        }
        start(A, q) {
            var K, Y, z, _, w, O;
            let $ = {
                onReceiveMetadata: (Y = (K = q === null || q === void 0 ? void 0 : q.onReceiveMetadata) === null || K === void 0 ? void 0 : K.bind(q)) !== null && Y !== void 0 ? Y : (H) => {},
                onReceiveMessage: (_ = (z = q === null || q === void 0 ? void 0 : q.onReceiveMessage) === null || z === void 0 ? void 0 : z.bind(q)) !== null && _ !== void 0 ? _ : (H) => {},
                onReceiveStatus: (O = (w = q === null || q === void 0 ? void 0 : q.onReceiveStatus) === null || w === void 0 ? void 0 : w.bind(q)) !== null && O !== void 0 ? O : (H) => {}
            };
            this.processingMetadata = !0, this.requester.start(A, $, (H, j) => {
                var J, M, D;
                this.processingMetadata = !1;
                let X;
                if ((0, gx4.isInterceptingListener)(j)) X = j;
                else {
                    let P = {
                        onReceiveMetadata: (J = j.onReceiveMetadata) !== null && J !== void 0 ? J : rS8.onReceiveMetadata,
                        onReceiveMessage: (M = j.onReceiveMessage) !== null && M !== void 0 ? M : rS8.onReceiveMessage,
                        onReceiveStatus: (D = j.onReceiveStatus) !== null && D !== void 0 ? D : rS8.onReceiveStatus
                    };
                    X = new gx4.InterceptingListenerImpl(P, $)
                }
                this.nextCall.start(H, X), this.processPendingMessage(), this.processPendingHalfClose()
            })
        }
        sendMessageWithContext(A, q) {
            this.processingMessage = !0, this.requester.sendMessage(q, (K) => {
                if (this.processingMessage = !1, this.processingMetadata) this.pendingMessageContext = A, this.pendingMessage = q;
                else this.nextCall.sendMessageWithContext(A, K), this.processPendingHalfClose()
            })
        }
        sendMessage(A) {
            this.sendMessageWithContext({}, A)
        }
        startRead() {
            this.nextCall.startRead()
        }
        halfClose() {
            this.requester.halfClose(() => {
                if (this.processingMetadata || this.processingMessage) this.pendingHalfClose = !0;
                else this.nextCall.halfClose()
            })
        }
        getAuthContext() {
            return this.nextCall.getAuthContext()
        }
    }
    ix4.InterceptingCall = dx4;

    function $$Y(A, q, K) {
        var Y, z;
        let _ = (Y = K.deadline) !== null && Y !== void 0 ? Y : 1 / 0,
            w = K.host,
            O = (z = K.parent) !== null && z !== void 0 ? z : null,
            $ = K.propagate_flags,
            H = K.credentials,
            j = A.createCall(q, _, w, O, $);
        if (H) j.setCredentials(H);
        return j
    }
    class oS8 {
        constructor(A, q) {
            this.call = A, this.methodDefinition = q
        }
        cancelWithStatus(A, q) {
            this.call.cancelWithStatus(A, q)
        }
        getPeer() {
            return this.call.getPeer()
        }
        sendMessageWithContext(A, q) {
            let K;
            try {
                K = this.methodDefinition.requestSerialize(q)
            } catch (Y) {
                this.call.cancelWithStatus(Fx4.Status.INTERNAL, `Request message serialization failure: ${(0,px4.getErrorMessage)(Y)}`);
                return
            }
            this.call.sendMessageWithContext(A, K)
        }
        sendMessage(A) {
            this.sendMessageWithContext({}, A)
        }
        start(A, q) {
            let K = null;
            this.call.start(A, {
                onReceiveMetadata: (Y) => {
                    var z;
                    (z = q === null || q === void 0 ? void 0 : q.onReceiveMetadata) === null || z === void 0 || z.call(q, Y)
                },
                onReceiveMessage: (Y) => {
                    var z;
                    let _;
                    try {
                        _ = this.methodDefinition.responseDeserialize(Y)
                    } catch (w) {
                        K = {
                            code: Fx4.Status.INTERNAL,
                            details: `Response message parsing error: ${(0,px4.getErrorMessage)(w)}`,
                            metadata: new O$Y.Metadata
                        }, this.call.cancelWithStatus(K.code, K.details);
                        return
                    }(z = q === null || q === void 0 ? void 0 : q.onReceiveMessage) === null || z === void 0 || z.call(q, _)
                },
                onReceiveStatus: (Y) => {
                    var z, _;
                    if (K)(z = q === null || q === void 0 ? void 0 : q.onReceiveStatus) === null || z === void 0 || z.call(q, K);
                    else(_ = q === null || q === void 0 ? void 0 : q.onReceiveStatus) === null || _ === void 0 || _.call(q, Y)
                }
            })
        }
        startRead() {
            this.call.startRead()
        }
        halfClose() {
            this.call.halfClose()
        }
        getAuthContext() {
            return this.call.getAuthContext()
        }
    }
    class cx4 extends oS8 {
        constructor(A, q) {
            super(A, q)
        }
        start(A, q) {
            var K, Y;
            let z = !1,
                _ = {
                    onReceiveMetadata: (Y = (K = q === null || q === void 0 ? void 0 : q.onReceiveMetadata) === null || K === void 0 ? void 0 : K.bind(q)) !== null && Y !== void 0 ? Y : (w) => {},
                    onReceiveMessage: (w) => {
                        var O;
                        z = !0, (O = q === null || q === void 0 ? void 0 : q.onReceiveMessage) === null || O === void 0 || O.call(q, w)
                    },
                    onReceiveStatus: (w) => {
                        var O, $;
                        if (!z)(O = q === null || q === void 0 ? void 0 : q.onReceiveMessage) === null || O === void 0 || O.call(q, null);
                        ($ = q === null || q === void 0 ? void 0 : q.onReceiveStatus) === null || $ === void 0 || $.call(q, w)
                    }
                };
            super.start(A, _), this.call.startRead()
        }
    }
    class lx4 extends oS8 {}

    function H$Y(A, q, K) {
        let Y = $$Y(A, K.path, q);
        if (K.responseStream) return new lx4(Y, K);
        else return new cx4(Y, K)
    }

    function j$Y(A, q, K, Y) {
        if (A.clientInterceptors.length > 0 && A.clientInterceptorProviders.length > 0) throw new qd6("Both interceptors and interceptor_providers were passed as options to the client constructor. Only one of these is allowed.");
        if (A.callInterceptors.length > 0 && A.callInterceptorProviders.length > 0) throw new qd6("Both interceptors and interceptor_providers were passed as call options. Only one of these is allowed.");
        let z = [];
        if (A.callInterceptors.length > 0 || A.callInterceptorProviders.length > 0) z = [].concat(A.callInterceptors, A.callInterceptorProviders.map((O) => O(q))).filter((O) => O);
        else z = [].concat(A.clientInterceptors, A.clientInterceptorProviders.map((O) => O(q))).filter((O) => O);
        let _ = Object.assign({}, K, {
            method_definition: q
        });
        return z.reduceRight((O, $) => {
            return (H) => $(H, O)
        }, (O) => H$Y(Y, O, q))(_)
    }
})
// @from(Ln 305192, Col 4)
tS8 = x((ox4) => {
    Object.defineProperty(ox4, "__esModule", {
        value: !0
    });
    ox4.Client = void 0;
    var Ng = xx4(),
        P$Y = eS8(),
        W$Y = Vf(),
        ce = a3(),
        hG6 = LX(),
        of1 = aS8(),
        Hb = Symbol(),
        SG6 = Symbol(),
        CG6 = Symbol(),
        Qc = Symbol();

    function sS8(A) {
        return typeof A === "function"
    }

    function IG6(A) {
        var q;
        return ((q = A.stack) === null || q === void 0 ? void 0 : q.split(`
`).slice(1).join(`
`)) || "no stack trace available"
    }
    class rx4 {
        constructor(A, q, K = {}) {
            var Y, z;
            if (K = Object.assign({}, K), this[SG6] = (Y = K.interceptors) !== null && Y !== void 0 ? Y : [], delete K.interceptors, this[CG6] = (z = K.interceptor_providers) !== null && z !== void 0 ? z : [], delete K.interceptor_providers, this[SG6].length > 0 && this[CG6].length > 0) throw Error("Both interceptors and interceptor_providers were passed as options to the client constructor. Only one of these is allowed.");
            if (this[Qc] = K.callInvocationTransformer, delete K.callInvocationTransformer, K.channelOverride) this[Hb] = K.channelOverride;
            else if (K.channelFactoryOverride) {
                let _ = K.channelFactoryOverride;
                delete K.channelFactoryOverride, this[Hb] = _(A, q, K)
            } else this[Hb] = new P$Y.ChannelImplementation(A, q, K)
        }
        close() {
            this[Hb].close()
        }
        getChannel() {
            return this[Hb]
        }
        waitForReady(A, q) {
            let K = (Y) => {
                if (Y) {
                    q(Error("Failed to connect before the deadline"));
                    return
                }
                let z;
                try {
                    z = this[Hb].getConnectivityState(!0)
                } catch (_) {
                    q(Error("The channel has been closed"));
                    return
                }
                if (z === W$Y.ConnectivityState.READY) q();
                else try {
                    this[Hb].watchConnectivityState(z, A, K)
                } catch (_) {
                    q(Error("The channel has been closed"))
                }
            };
            setImmediate(K)
        }
        checkOptionalUnaryResponseArguments(A, q, K) {
            if (sS8(A)) return {
                metadata: new hG6.Metadata,
                options: {},
                callback: A
            };
            else if (sS8(q))
                if (A instanceof hG6.Metadata) return {
                    metadata: A,
                    options: {},
                    callback: q
                };
                else return {
                    metadata: new hG6.Metadata,
                    options: A,
                    callback: q
                };
            else {
                if (!(A instanceof hG6.Metadata && q instanceof Object && sS8(K))) throw Error("Incorrect arguments passed");
                return {
                    metadata: A,
                    options: q,
                    callback: K
                }
            }
        }
        makeUnaryRequest(A, q, K, Y, z, _, w) {
            var O, $;
            let H = this.checkOptionalUnaryResponseArguments(z, _, w),
                j = {
                    path: A,
                    requestStream: !1,
                    responseStream: !1,
                    requestSerialize: q,
                    responseDeserialize: K
                },
                J = {
                    argument: Y,
                    metadata: H.metadata,
                    call: new Ng.ClientUnaryCallImpl,
                    channel: this[Hb],
                    methodDefinition: j,
                    callOptions: H.options,
                    callback: H.callback
                };
            if (this[Qc]) J = this[Qc](J);
            let M = J.call,
                D = {
                    clientInterceptors: this[SG6],
                    clientInterceptorProviders: this[CG6],
                    callInterceptors: (O = J.callOptions.interceptors) !== null && O !== void 0 ? O : [],
                    callInterceptorProviders: ($ = J.callOptions.interceptor_providers) !== null && $ !== void 0 ? $ : []
                },
                X = (0, of1.getInterceptingCall)(D, J.methodDefinition, J.callOptions, J.channel);
            M.call = X;
            let P = null,
                W = !1,
                Z = Error();
            return X.start(J.metadata, {
                onReceiveMetadata: (G) => {
                    M.emit("metadata", G)
                },
                onReceiveMessage(G) {
                    if (P !== null) X.cancelWithStatus(ce.Status.UNIMPLEMENTED, "Too many responses received");
                    P = G
                },
                onReceiveStatus(G) {
                    if (W) return;
                    if (W = !0, G.code === ce.Status.OK)
                        if (P === null) {
                            let f = IG6(Z);
                            J.callback((0, Ng.callErrorFromStatus)({
                                code: ce.Status.UNIMPLEMENTED,
                                details: "No message received",
                                metadata: G.metadata
                            }, f))
                        } else J.callback(null, P);
                    else {
                        let f = IG6(Z);
                        J.callback((0, Ng.callErrorFromStatus)(G, f))
                    }
                    Z = null, M.emit("status", G)
                }
            }), X.sendMessage(Y), X.halfClose(), M
        }
        makeClientStreamRequest(A, q, K, Y, z, _) {
            var w, O;
            let $ = this.checkOptionalUnaryResponseArguments(Y, z, _),
                H = {
                    path: A,
                    requestStream: !0,
                    responseStream: !1,
                    requestSerialize: q,
                    responseDeserialize: K
                },
                j = {
                    metadata: $.metadata,
                    call: new Ng.ClientWritableStreamImpl(q),
                    channel: this[Hb],
                    methodDefinition: H,
                    callOptions: $.options,
                    callback: $.callback
                };
            if (this[Qc]) j = this[Qc](j);
            let J = j.call,
                M = {
                    clientInterceptors: this[SG6],
                    clientInterceptorProviders: this[CG6],
                    callInterceptors: (w = j.callOptions.interceptors) !== null && w !== void 0 ? w : [],
                    callInterceptorProviders: (O = j.callOptions.interceptor_providers) !== null && O !== void 0 ? O : []
                },
                D = (0, of1.getInterceptingCall)(M, j.methodDefinition, j.callOptions, j.channel);
            J.call = D;
            let X = null,
                P = !1,
                W = Error();
            return D.start(j.metadata, {
                onReceiveMetadata: (Z) => {
                    J.emit("metadata", Z)
                },
                onReceiveMessage(Z) {
                    if (X !== null) D.cancelWithStatus(ce.Status.UNIMPLEMENTED, "Too many responses received");
                    X = Z, D.startRead()
                },
                onReceiveStatus(Z) {
                    if (P) return;
                    if (P = !0, Z.code === ce.Status.OK)
                        if (X === null) {
                            let G = IG6(W);
                            j.callback((0, Ng.callErrorFromStatus)({
                                code: ce.Status.UNIMPLEMENTED,
                                details: "No message received",
                                metadata: Z.metadata
                            }, G))
                        } else j.callback(null, X);
                    else {
                        let G = IG6(W);
                        j.callback((0, Ng.callErrorFromStatus)(Z, G))
                    }
                    W = null, J.emit("status", Z)
                }
            }), J
        }
        checkMetadataAndOptions(A, q) {
            let K, Y;
            if (A instanceof hG6.Metadata)
                if (K = A, q) Y = q;
                else Y = {};
            else {
                if (A) Y = A;
                else Y = {};
                K = new hG6.Metadata
            }
            return {
                metadata: K,
                options: Y
            }
        }
        makeServerStreamRequest(A, q, K, Y, z, _) {
            var w, O;
            let $ = this.checkMetadataAndOptions(z, _),
                H = {
                    path: A,
                    requestStream: !1,
                    responseStream: !0,
                    requestSerialize: q,
                    responseDeserialize: K
                },
                j = {
                    argument: Y,
                    metadata: $.metadata,
                    call: new Ng.ClientReadableStreamImpl(K),
                    channel: this[Hb],
                    methodDefinition: H,
                    callOptions: $.options
                };
            if (this[Qc]) j = this[Qc](j);
            let J = j.call,
                M = {
                    clientInterceptors: this[SG6],
                    clientInterceptorProviders: this[CG6],
                    callInterceptors: (w = j.callOptions.interceptors) !== null && w !== void 0 ? w : [],
                    callInterceptorProviders: (O = j.callOptions.interceptor_providers) !== null && O !== void 0 ? O : []
                },
                D = (0, of1.getInterceptingCall)(M, j.methodDefinition, j.callOptions, j.channel);
            J.call = D;
            let X = !1,
                P = Error();
            return D.start(j.metadata, {
                onReceiveMetadata(W) {
                    J.emit("metadata", W)
                },
                onReceiveMessage(W) {
                    J.push(W)
                },
                onReceiveStatus(W) {
                    if (X) return;
                    if (X = !0, J.push(null), W.code !== ce.Status.OK) {
                        let Z = IG6(P);
                        J.emit("error", (0, Ng.callErrorFromStatus)(W, Z))
                    }
                    P = null, J.emit("status", W)
                }
            }), D.sendMessage(Y), D.halfClose(), J
        }
        makeBidiStreamRequest(A, q, K, Y, z) {
            var _, w;
            let O = this.checkMetadataAndOptions(Y, z),
                $ = {
                    path: A,
                    requestStream: !0,
                    responseStream: !0,
                    requestSerialize: q,
                    responseDeserialize: K
                },
                H = {
                    metadata: O.metadata,
                    call: new Ng.ClientDuplexStreamImpl(q, K),
                    channel: this[Hb],
                    methodDefinition: $,
                    callOptions: O.options
                };
            if (this[Qc]) H = this[Qc](H);
            let j = H.call,
                J = {
                    clientInterceptors: this[SG6],
                    clientInterceptorProviders: this[CG6],
                    callInterceptors: (_ = H.callOptions.interceptors) !== null && _ !== void 0 ? _ : [],
                    callInterceptorProviders: (w = H.callOptions.interceptor_providers) !== null && w !== void 0 ? w : []
                },
                M = (0, of1.getInterceptingCall)(J, H.methodDefinition, H.callOptions, H.channel);
            j.call = M;
            let D = !1,
                X = Error();
            return M.start(H.metadata, {
                onReceiveMetadata(P) {
                    j.emit("metadata", P)
                },
                onReceiveMessage(P) {
                    j.push(P)
                },
                onReceiveStatus(P) {
                    if (D) return;
                    if (D = !0, j.push(null), P.code !== ce.Status.OK) {
                        let W = IG6(X);
                        j.emit("error", (0, Ng.callErrorFromStatus)(P, W))
                    }
                    X = null, j.emit("status", P)
                }
            }), j
        }
    }
    ox4.Client = rx4
})
// @from(Ln 305510, Col 4)
af1 = x((tx4) => {
    Object.defineProperty(tx4, "__esModule", {
        value: !0
    });
    tx4.makeClientConstructor = sx4;
    tx4.loadPackageDefinition = T$Y;
    var Kd6 = tS8(),
        Z$Y = {
            unary: Kd6.Client.prototype.makeUnaryRequest,
            server_stream: Kd6.Client.prototype.makeServerStreamRequest,
            client_stream: Kd6.Client.prototype.makeClientStreamRequest,
            bidi: Kd6.Client.prototype.makeBidiStreamRequest
        };

    function AC8(A) {
        return ["__proto__", "prototype", "constructor"].includes(A)
    }

    function sx4(A, q, K) {
        if (!K) K = {};
        class Y extends Kd6.Client {}
        return Object.keys(A).forEach((z) => {
            if (AC8(z)) return;
            let _ = A[z],
                w;
            if (typeof z === "string" && z.charAt(0) === "$") throw Error("Method names cannot start with $");
            if (_.requestStream)
                if (_.responseStream) w = "bidi";
                else w = "client_stream";
            else if (_.responseStream) w = "server_stream";
            else w = "unary";
            let {
                requestSerialize: O,
                responseDeserialize: $
            } = _, H = G$Y(Z$Y[w], _.path, O, $);
            if (Y.prototype[z] = H, Object.assign(Y.prototype[z], _), _.originalName && !AC8(_.originalName)) Y.prototype[_.originalName] = Y.prototype[z]
        }), Y.service = A, Y.serviceName = q, Y
    }

    function G$Y(A, q, K, Y) {
        return function(...z) {
            return A.call(this, q, K, Y, ...z)
        }
    }

    function f$Y(A) {
        return "format" in A
    }

    function T$Y(A) {
        let q = {};
        for (let K in A)
            if (Object.prototype.hasOwnProperty.call(A, K)) {
                let Y = A[K],
                    z = K.split(".");
                if (z.some((O) => AC8(O))) continue;
                let _ = z[z.length - 1],
                    w = q;
                for (let O of z.slice(0, -1)) {
                    if (!w[O]) w[O] = {};
                    w = w[O]
                }
                if (f$Y(Y)) w[_] = Y;
                else w[_] = sx4(Y, _, {})
            } return q
    }
})
// @from(Ln 305577, Col 4)
Vu4 = x((KWw, Nu4) => {
    var V$Y = 1 / 0,
        k$Y = "[object Symbol]",
        E$Y = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
        y$Y = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
        tf1 = "\\ud800-\\udfff",
        wu4 = "\\u0300-\\u036f\\ufe20-\\ufe23",
        Ou4 = "\\u20d0-\\u20f0",
        $u4 = "\\u2700-\\u27bf",
        Hu4 = "a-z\\xdf-\\xf6\\xf8-\\xff",
        L$Y = "\\xac\\xb1\\xd7\\xf7",
        R$Y = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",
        h$Y = "\\u2000-\\u206f",
        S$Y = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
        ju4 = "A-Z\\xc0-\\xd6\\xd8-\\xde",
        Ju4 = "\\ufe0e\\ufe0f",
        Mu4 = L$Y + R$Y + h$Y + S$Y,
        KC8 = "['’]",
        C$Y = "[" + tf1 + "]",
        ex4 = "[" + Mu4 + "]",
        sf1 = "[" + wu4 + Ou4 + "]",
        Du4 = "\\d+",
        I$Y = "[" + $u4 + "]",
        Xu4 = "[" + Hu4 + "]",
        Pu4 = "[^" + tf1 + Mu4 + Du4 + $u4 + Hu4 + ju4 + "]",
        qC8 = "\\ud83c[\\udffb-\\udfff]",
        b$Y = "(?:" + sf1 + "|" + qC8 + ")",
        Wu4 = "[^" + tf1 + "]",
        YC8 = "(?:\\ud83c[\\udde6-\\uddff]){2}",
        zC8 = "[\\ud800-\\udbff][\\udc00-\\udfff]",
        bG6 = "[" + ju4 + "]",
        Zu4 = "\\u200d",
        Au4 = "(?:" + Xu4 + "|" + Pu4 + ")",
        x$Y = "(?:" + bG6 + "|" + Pu4 + ")",
        qu4 = "(?:" + KC8 + "(?:d|ll|m|re|s|t|ve))?",
        Ku4 = "(?:" + KC8 + "(?:D|LL|M|RE|S|T|VE))?",
        Gu4 = b$Y + "?",
        fu4 = "[" + Ju4 + "]?",
        u$Y = "(?:" + Zu4 + "(?:" + [Wu4, YC8, zC8].join("|") + ")" + fu4 + Gu4 + ")*",
        Tu4 = fu4 + Gu4 + u$Y,
        m$Y = "(?:" + [I$Y, YC8, zC8].join("|") + ")" + Tu4,
        B$Y = "(?:" + [Wu4 + sf1 + "?", sf1, YC8, zC8, C$Y].join("|") + ")",
        g$Y = RegExp(KC8, "g"),
        F$Y = RegExp(sf1, "g"),
        p$Y = RegExp(qC8 + "(?=" + qC8 + ")|" + B$Y + Tu4, "g"),
        Q$Y = RegExp([bG6 + "?" + Xu4 + "+" + qu4 + "(?=" + [ex4, bG6, "$"].join("|") + ")", x$Y + "+" + Ku4 + "(?=" + [ex4, bG6 + Au4, "$"].join("|") + ")", bG6 + "?" + Au4 + "+" + qu4, bG6 + "+" + Ku4, Du4, m$Y].join("|"), "g"),
        U$Y = RegExp("[" + Zu4 + tf1 + wu4 + Ou4 + Ju4 + "]"),
        d$Y = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
        c$Y = {
            "À": "A",
            "Á": "A",
            "Â": "A",
            "Ã": "A",
            "Ä": "A",
            "Å": "A",
            "à": "a",
            "á": "a",
            "â": "a",
            "ã": "a",
            "ä": "a",
            "å": "a",
            "Ç": "C",
            "ç": "c",
            "Ð": "D",
            "ð": "d",
            "È": "E",
            "É": "E",
            "Ê": "E",
            "Ë": "E",
            "è": "e",
            "é": "e",
            "ê": "e",
            "ë": "e",
            "Ì": "I",
            "Í": "I",
            "Î": "I",
            "Ï": "I",
            "ì": "i",
            "í": "i",
            "î": "i",
            "ï": "i",
            "Ñ": "N",
            "ñ": "n",
            "Ò": "O",
            "Ó": "O",
            "Ô": "O",
            "Õ": "O",
            "Ö": "O",
            "Ø": "O",
            "ò": "o",
            "ó": "o",
            "ô": "o",
            "õ": "o",
            "ö": "o",
            "ø": "o",
            "Ù": "U",
            "Ú": "U",
            "Û": "U",
            "Ü": "U",
            "ù": "u",
            "ú": "u",
            "û": "u",
            "ü": "u",
            "Ý": "Y",
            "ý": "y",
            "ÿ": "y",
            "Æ": "Ae",
            "æ": "ae",
            "Þ": "Th",
            "þ": "th",
            "ß": "ss",
            "Ā": "A",
            "Ă": "A",
            "Ą": "A",
            "ā": "a",
            "ă": "a",
            "ą": "a",
            "Ć": "C",
            "Ĉ": "C",
            "Ċ": "C",
            "Č": "C",
            "ć": "c",
            "ĉ": "c",
            "ċ": "c",
            "č": "c",
            "Ď": "D",
            "Đ": "D",
            "ď": "d",
            "đ": "d",
            "Ē": "E",
            "Ĕ": "E",
            "Ė": "E",
            "Ę": "E",
            "Ě": "E",
            "ē": "e",
            "ĕ": "e",
            "ė": "e",
            "ę": "e",
            "ě": "e",
            "Ĝ": "G",
            "Ğ": "G",
            "Ġ": "G",
            "Ģ": "G",
            "ĝ": "g",
            "ğ": "g",
            "ġ": "g",
            "ģ": "g",
            "Ĥ": "H",
            "Ħ": "H",
            "ĥ": "h",
            "ħ": "h",
            "Ĩ": "I",
            "Ī": "I",
            "Ĭ": "I",
            "Į": "I",
            "İ": "I",
            "ĩ": "i",
            "ī": "i",
            "ĭ": "i",
            "į": "i",
            "ı": "i",
            "Ĵ": "J",
            "ĵ": "j",
            "Ķ": "K",
            "ķ": "k",
            "ĸ": "k",
            "Ĺ": "L",
            "Ļ": "L",
            "Ľ": "L",
            "Ŀ": "L",
            "Ł": "L",
            "ĺ": "l",
            "ļ": "l",
            "ľ": "l",
            "ŀ": "l",
            "ł": "l",
            "Ń": "N",
            "Ņ": "N",
            "Ň": "N",
            "Ŋ": "N",
            "ń": "n",
            "ņ": "n",
            "ň": "n",
            "ŋ": "n",
            "Ō": "O",
            "Ŏ": "O",
            "Ő": "O",
            "ō": "o",
            "ŏ": "o",
            "ő": "o",
            "Ŕ": "R",
            "Ŗ": "R",
            "Ř": "R",
            "ŕ": "r",
            "ŗ": "r",
            "ř": "r",
            "Ś": "S",
            "Ŝ": "S",
            "Ş": "S",
            "Š": "S",
            "ś": "s",
            "ŝ": "s",
            "ş": "s",
            "š": "s",
            "Ţ": "T",
            "Ť": "T",
            "Ŧ": "T",
            "ţ": "t",
            "ť": "t",
            "ŧ": "t",
            "Ũ": "U",
            "Ū": "U",
            "Ŭ": "U",
            "Ů": "U",
            "Ű": "U",
            "Ų": "U",
            "ũ": "u",
            "ū": "u",
            "ŭ": "u",
            "ů": "u",
            "ű": "u",
            "ų": "u",
            "Ŵ": "W",
            "ŵ": "w",
            "Ŷ": "Y",
            "ŷ": "y",
            "Ÿ": "Y",
            "Ź": "Z",
            "Ż": "Z",
            "Ž": "Z",
            "ź": "z",
            "ż": "z",
            "ž": "z",
            "Ĳ": "IJ",
            "ĳ": "ij",
            "Œ": "Oe",
            "œ": "oe",
            "ŉ": "'n",
            "ſ": "ss"
        },
        l$Y = typeof global == "object" && global && global.Object === Object && global,
        i$Y = typeof self == "object" && self && self.Object === Object && self,
        n$Y = l$Y || i$Y || Function("return this")();

    function r$Y(A, q, K, Y) {
        var z = -1,
            _ = A ? A.length : 0;
        if (Y && _) K = A[++z];
        while (++z < _) K = q(K, A[z], z, A);
        return K
    }

    function o$Y(A) {
        return A.split("")
    }

    function a$Y(A) {
        return A.match(E$Y) || []
    }

    function s$Y(A) {
        return function(q) {
            return A == null ? void 0 : A[q]
        }
    }
    var t$Y = s$Y(c$Y);

    function vu4(A) {
        return U$Y.test(A)
    }

    function e$Y(A) {
        return d$Y.test(A)
    }

    function AHY(A) {
        return vu4(A) ? qHY(A) : o$Y(A)
    }

    function qHY(A) {
        return A.match(p$Y) || []
    }

    function KHY(A) {
        return A.match(Q$Y) || []
    }
    var YHY = Object.prototype,
        zHY = YHY.toString,
        Yu4 = n$Y.Symbol,
        zu4 = Yu4 ? Yu4.prototype : void 0,
        _u4 = zu4 ? zu4.toString : void 0;

    function _HY(A, q, K) {
        var Y = -1,
            z = A.length;
        if (q < 0) q = -q > z ? 0 : z + q;
        if (K = K > z ? z : K, K < 0) K += z;
        z = q > K ? 0 : K - q >>> 0, q >>>= 0;
        var _ = Array(z);
        while (++Y < z) _[Y] = A[Y + q];
        return _
    }

    function wHY(A) {
        if (typeof A == "string") return A;
        if (JHY(A)) return _u4 ? _u4.call(A) : "";
        var q = A + "";
        return q == "0" && 1 / A == -V$Y ? "-0" : q
    }

    function OHY(A, q, K) {
        var Y = A.length;
        return K = K === void 0 ? Y : K, !q && K >= Y ? A : _HY(A, q, K)
    }

    function $HY(A) {
        return function(q) {
            q = ef1(q);
            var K = vu4(q) ? AHY(q) : void 0,
                Y = K ? K[0] : q.charAt(0),
                z = K ? OHY(K, 1).join("") : q.slice(1);
            return Y[A]() + z
        }
    }

    function HHY(A) {
        return function(q) {
            return r$Y(WHY(XHY(q).replace(g$Y, "")), A, "")
        }
    }

    function jHY(A) {
        return !!A && typeof A == "object"
    }

    function JHY(A) {
        return typeof A == "symbol" || jHY(A) && zHY.call(A) == k$Y
    }

    function ef1(A) {
        return A == null ? "" : wHY(A)
    }
    var MHY = HHY(function(A, q, K) {
        return q = q.toLowerCase(), A + (K ? DHY(q) : q)
    });

    function DHY(A) {
        return PHY(ef1(A).toLowerCase())
    }

    function XHY(A) {
        return A = ef1(A), A && A.replace(y$Y, t$Y).replace(F$Y, "")
    }
    var PHY = $HY("toUpperCase");

    function WHY(A, q, K) {
        if (A = ef1(A), q = K ? void 0 : q, q === void 0) return e$Y(A) ? KHY(A) : a$Y(A);
        return A.match(q) || []
    }
    Nu4.exports = MHY
})
// @from(Ln 305938, Col 4)
Eu4 = x((YWw, ku4) => {
    ku4.exports = _C8;

    function _C8(A, q) {
        if (typeof A === "string") q = A, A = void 0;
        var K = [];

        function Y(_) {
            if (typeof _ !== "string") {
                var w = z();
                if (_C8.verbose) console.log("codegen: " + w);
                if (w = "return " + w, _) {
                    var O = Object.keys(_),
                        $ = Array(O.length + 1),
                        H = Array(O.length),
                        j = 0;
                    while (j < O.length) $[j] = O[j], H[j] = _[O[j++]];
                    return $[j] = w, Function.apply(null, $).apply(null, H)
                }
                return Function(w)()
            }
            var J = Array(arguments.length - 1),
                M = 0;
            while (M < J.length) J[M] = arguments[++M];
            if (M = 0, _ = _.replace(/%([%dfijs])/g, function(X, P) {
                    var W = J[M++];
                    switch (P) {
                        case "d":
                        case "f":
                            return String(Number(W));
                        case "i":
                            return String(Math.floor(W));
                        case "j":
                            return JSON.stringify(W);
                        case "s":
                            return String(W)
                    }
                    return "%"
                }), M !== J.length) throw Error("parameter count mismatch");
            return K.push(_), Y
        }

        function z(_) {
            return "function " + (_ || q || "") + "(" + (A && A.join(",") || "") + `){
  ` + K.join(`
  `) + `
}`
        }
        return Y.toString = z, Y
    }
    _C8.verbose = !1
})
// @from(Ln 305990, Col 4)
Lu4 = x((zWw, yu4) => {
    yu4.exports = Yd6;
    var ZHY = Mh8(),
        GHY = Ph8(),
        wC8 = GHY("fs");

    function Yd6(A, q, K) {
        if (typeof q === "function") K = q, q = {};
        else if (!q) q = {};
        if (!K) return ZHY(Yd6, this, A, q);
        if (!q.xhr && wC8 && wC8.readFile) return wC8.readFile(A, function(z, _) {
            return z && typeof XMLHttpRequest < "u" ? Yd6.xhr(A, q, K) : z ? K(z) : K(null, q.binary ? _ : _.toString("utf8"))
        });
        return Yd6.xhr(A, q, K)
    }
    Yd6.xhr = function(q, K, Y) {
        var z = new XMLHttpRequest;
        if (z.onreadystatechange = function() {
                if (z.readyState !== 4) return;
                if (z.status !== 0 && z.status !== 200) return Y(Error("status " + z.status));
                if (K.binary) {
                    var w = z.response;
                    if (!w) {
                        w = [];
                        for (var O = 0; O < z.responseText.length; ++O) w.push(z.responseText.charCodeAt(O) & 255)
                    }
                    return Y(null, typeof Uint8Array < "u" ? new Uint8Array(w) : w)
                }
                return Y(null, z.responseText)
            }, K.binary) {
            if ("overrideMimeType" in z) z.overrideMimeType("text/plain; charset=x-user-defined");
            z.responseType = "arraybuffer"
        }
        z.open("GET", q), z.send()
    }
})
// @from(Ln 306026, Col 4)
Su4 = x((hu4) => {
    var $C8 = hu4,
        Ru4 = $C8.isAbsolute = function(q) {
            return /^(?:\/|\w+:)/.test(q)
        },
        OC8 = $C8.normalize = function(q) {
            q = q.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
            var K = q.split("/"),
                Y = Ru4(q),
                z = "";
            if (Y) z = K.shift() + "/";
            for (var _ = 0; _ < K.length;)
                if (K[_] === "..")
                    if (_ > 0 && K[_ - 1] !== "..") K.splice(--_, 2);
                    else if (Y) K.splice(_, 1);
            else ++_;
            else if (K[_] === ".") K.splice(_, 1);
            else ++_;
            return z + K.join("/")
        };
    $C8.resolve = function(q, K, Y) {
        if (!Y) K = OC8(K);
        if (Ru4(K)) return K;
        if (!Y) q = OC8(q);
        return (q = q.replace(/(?:\/|^)[^/]+$/, "")).length ? OC8(q + "/" + K) : K
    }
})
// @from(Ln 306053, Col 4)
uG6 = x((wWw, bu4) => {
    bu4.exports = uY;
    var AT1 = ie();
    ((uY.prototype = Object.create(AT1.prototype)).constructor = uY).className = "Namespace";
    var HC8 = le(),
        qT1 = RX(),
        fHY = PY6(),
        DY6, xG6, XY6;
    uY.fromJSON = function(q, K) {
        return new uY(q, K.options).addJSON(K.nested)
    };

    function Cu4(A, q) {
        if (!(A && A.length)) return;
        var K = {};
        for (var Y = 0; Y < A.length; ++Y) K[A[Y].name] = A[Y].toJSON(q);
        return K
    }
    uY.arrayToJSON = Cu4;
    uY.isReservedId = function(q, K) {
        if (q) {
            for (var Y = 0; Y < q.length; ++Y)
                if (typeof q[Y] !== "string" && q[Y][0] <= K && q[Y][1] > K) return !0
        }
        return !1
    };
    uY.isReservedName = function(q, K) {
        if (q) {
            for (var Y = 0; Y < q.length; ++Y)
                if (q[Y] === K) return !0
        }
        return !1
    };

    function uY(A, q) {
        AT1.call(this, A, q), this.nested = void 0, this._nestedArray = null, this._lookupCache = {}, this._needsRecursiveFeatureResolution = !0, this._needsRecursiveResolve = !0
    }

    function Iu4(A) {
        A._nestedArray = null, A._lookupCache = {};
        var q = A;
        while (q = q.parent) q._lookupCache = {};
        return A
    }
    Object.defineProperty(uY.prototype, "nestedArray", {
        get: function() {
            return this._nestedArray || (this._nestedArray = qT1.toArray(this.nested))
        }
    });
    uY.prototype.toJSON = function(q) {
        return qT1.toObject(["options", this.options, "nested", Cu4(this.nestedArray, q)])
    };
    uY.prototype.addJSON = function(q) {
        var K = this;
        if (q)
            for (var Y = Object.keys(q), z = 0, _; z < Y.length; ++z) _ = q[Y[z]], K.add((_.fields !== void 0 ? DY6.fromJSON : _.values !== void 0 ? XY6.fromJSON : _.methods !== void 0 ? xG6.fromJSON : _.id !== void 0 ? HC8.fromJSON : uY.fromJSON)(Y[z], _));
        return this
    };
    uY.prototype.get = function(q) {
        return this.nested && this.nested[q] || null
    };
    uY.prototype.getEnum = function(q) {
        if (this.nested && this.nested[q] instanceof XY6) return this.nested[q].values;
        throw Error("no such enum: " + q)
    };
    uY.prototype.add = function(q) {
        if (!(q instanceof HC8 && q.extend !== void 0 || q instanceof DY6 || q instanceof fHY || q instanceof XY6 || q instanceof xG6 || q instanceof uY)) throw TypeError("object must be a valid nested object");
        if (!this.nested) this.nested = {};
        else {
            var K = this.get(q.name);
            if (K)
                if (K instanceof uY && q instanceof uY && !(K instanceof DY6 || K instanceof xG6)) {
                    var Y = K.nestedArray;
                    for (var z = 0; z < Y.length; ++z) q.add(Y[z]);
                    if (this.remove(K), !this.nested) this.nested = {};
                    q.setOptions(K.options, !0)
                } else throw Error("duplicate name '" + q.name + "' in " + this)
        }
        if (this.nested[q.name] = q, !(this instanceof DY6 || this instanceof xG6 || this instanceof XY6 || this instanceof HC8)) {
            if (!q._edition) q._edition = q._defaultEdition
        }
        this._needsRecursiveFeatureResolution = !0, this._needsRecursiveResolve = !0;
        var _ = this;
        while (_ = _.parent) _._needsRecursiveFeatureResolution = !0, _._needsRecursiveResolve = !0;
        return q.onAdd(this), Iu4(this)
    };
    uY.prototype.remove = function(q) {
        if (!(q instanceof AT1)) throw TypeError("object must be a ReflectionObject");
        if (q.parent !== this) throw Error(q + " is not a member of " + this);
        if (delete this.nested[q.name], !Object.keys(this.nested).length) this.nested = void 0;
        return q.onRemove(this), Iu4(this)
    };
    uY.prototype.define = function(q, K) {
        if (qT1.isString(q)) q = q.split(".");
        else if (!Array.isArray(q)) throw TypeError("illegal path");
        if (q && q.length && q[0] === "") throw Error("path must be relative");
        var Y = this;
        while (q.length > 0) {
            var z = q.shift();
            if (Y.nested && Y.nested[z]) {
                if (Y = Y.nested[z], !(Y instanceof uY)) throw Error("path conflicts with non-namespace objects")
            } else Y.add(Y = new uY(z))
        }
        if (K) Y.addJSON(K);
        return Y
    };
    uY.prototype.resolveAll = function() {
        if (!this._needsRecursiveResolve) return this;
        this._resolveFeaturesRecursive(this._edition);
        var q = this.nestedArray,
            K = 0;
        this.resolve();
        while (K < q.length)
            if (q[K] instanceof uY) q[K++].resolveAll();
            else q[K++].resolve();
        return this._needsRecursiveResolve = !1, this
    };
    uY.prototype._resolveFeaturesRecursive = function(q) {
        if (!this._needsRecursiveFeatureResolution) return this;
        return this._needsRecursiveFeatureResolution = !1, q = this._edition || q, AT1.prototype._resolveFeaturesRecursive.call(this, q), this.nestedArray.forEach((K) => {
            K._resolveFeaturesRecursive(q)
        }), this
    };
    uY.prototype.lookup = function(q, K, Y) {
        if (typeof K === "boolean") Y = K, K = void 0;
        else if (K && !Array.isArray(K)) K = [K];
        if (qT1.isString(q) && q.length) {
            if (q === ".") return this.root;
            q = q.split(".")
        } else if (!q.length) return this;
        var z = q.join(".");
        if (q[0] === "") return this.root.lookup(q.slice(1), K);
        var _ = this.root._fullyQualifiedObjects && this.root._fullyQualifiedObjects["." + z];
        if (_ && (!K || K.indexOf(_.constructor) > -1)) return _;
        if (_ = this._lookupImpl(q, z), _ && (!K || K.indexOf(_.constructor) > -1)) return _;
        if (Y) return null;
        var w = this;
        while (w.parent) {
            if (_ = w.parent._lookupImpl(q, z), _ && (!K || K.indexOf(_.constructor) > -1)) return _;
            w = w.parent
        }
        return null
    };
    uY.prototype._lookupImpl = function(q, K) {
        if (Object.prototype.hasOwnProperty.call(this._lookupCache, K)) return this._lookupCache[K];
        var Y = this.get(q[0]),
            z = null;
        if (Y) {
            if (q.length === 1) z = Y;
            else if (Y instanceof uY) q = q.slice(1), z = Y._lookupImpl(q, q.join("."))
        } else
            for (var _ = 0; _ < this.nestedArray.length; ++_)
                if (this._nestedArray[_] instanceof uY && (Y = this._nestedArray[_]._lookupImpl(q, K))) z = Y;
        return this._lookupCache[K] = z, z
    };
    uY.prototype.lookupType = function(q) {
        var K = this.lookup(q, [DY6]);
        if (!K) throw Error("no such type: " + q);
        return K
    };
    uY.prototype.lookupEnum = function(q) {
        var K = this.lookup(q, [XY6]);
        if (!K) throw Error("no such Enum '" + q + "' in " + this);
        return K
    };
    uY.prototype.lookupTypeOrEnum = function(q) {
        var K = this.lookup(q, [DY6, XY6]);
        if (!K) throw Error("no such Type or Enum '" + q + "' in " + this);
        return K
    };
    uY.prototype.lookupService = function(q) {
        var K = this.lookup(q, [xG6]);
        if (!K) throw Error("no such Service '" + q + "' in " + this);
        return K
    };
    uY._configure = function(A, q, K) {
        DY6 = A, xG6 = q, XY6 = K
    }
})
// @from(Ln 306232, Col 4)
KT1 = x((OWw, xu4) => {
    xu4.exports = Uc;
    var jC8 = le();
    ((Uc.prototype = Object.create(jC8.prototype)).constructor = Uc).className = "MapField";
    var THY = WY6(),
        zd6 = RX();

    function Uc(A, q, K, Y, z, _) {
        if (jC8.call(this, A, q, Y, void 0, void 0, z, _), !zd6.isString(K)) throw TypeError("keyType must be a string");
        this.keyType = K, this.resolvedKeyType = null, this.map = !0
    }
    Uc.fromJSON = function(q, K) {
        return new Uc(q, K.id, K.keyType, K.type, K.options, K.comment)
    };
    Uc.prototype.toJSON = function(q) {
        var K = q ? Boolean(q.keepComments) : !1;
        return zd6.toObject(["keyType", this.keyType, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", K ? this.comment : void 0])
    };
    Uc.prototype.resolve = function() {
        if (this.resolved) return this;
        if (THY.mapKey[this.keyType] === void 0) throw Error("invalid key type: " + this.keyType);
        return jC8.prototype.resolve.call(this)
    };
    Uc.d = function(q, K, Y) {
        if (typeof Y === "function") Y = zd6.decorateType(Y).name;
        else if (Y && typeof Y === "object") Y = zd6.decorateEnum(Y).name;
        return function(_, w) {
            zd6.decorateType(_.constructor).add(new Uc(w, q, K, Y))
        }
    }
})
// @from(Ln 306263, Col 4)
YT1 = x(($Ww, uu4) => {
    uu4.exports = ZY6;
    var JC8 = ie();
    ((ZY6.prototype = Object.create(JC8.prototype)).constructor = ZY6).className = "Method";
    var mG6 = RX();

    function ZY6(A, q, K, Y, z, _, w, O, $) {
        if (mG6.isObject(z)) w = z, z = _ = void 0;
        else if (mG6.isObject(_)) w = _, _ = void 0;
        if (!(q === void 0 || mG6.isString(q))) throw TypeError("type must be a string");
        if (!mG6.isString(K)) throw TypeError("requestType must be a string");
        if (!mG6.isString(Y)) throw TypeError("responseType must be a string");
        JC8.call(this, A, w), this.type = q || "rpc", this.requestType = K, this.requestStream = z ? !0 : void 0, this.responseType = Y, this.responseStream = _ ? !0 : void 0, this.resolvedRequestType = null, this.resolvedResponseType = null, this.comment = O, this.parsedOptions = $
    }
    ZY6.fromJSON = function(q, K) {
        return new ZY6(q, K.type, K.requestType, K.responseType, K.requestStream, K.responseStream, K.options, K.comment, K.parsedOptions)
    };
    ZY6.prototype.toJSON = function(q) {
        var K = q ? Boolean(q.keepComments) : !1;
        return mG6.toObject(["type", this.type !== "rpc" && this.type || void 0, "requestType", this.requestType, "requestStream", this.requestStream, "responseType", this.responseType, "responseStream", this.responseStream, "options", this.options, "comment", K ? this.comment : void 0, "parsedOptions", this.parsedOptions])
    };
    ZY6.prototype.resolve = function() {
        if (this.resolved) return this;
        return this.resolvedRequestType = this.parent.lookupType(this.requestType), this.resolvedResponseType = this.parent.lookupType(this.responseType), JC8.prototype.resolve.call(this)
    }
})
// @from(Ln 306289, Col 4)
zT1 = x((HWw, Bu4) => {
    Bu4.exports = qE;
    var dc = uG6();
    ((qE.prototype = Object.create(dc.prototype)).constructor = qE).className = "Service";
    var MC8 = YT1(),
        _d6 = RX(),
        vHY = Lh8();

    function qE(A, q) {
        dc.call(this, A, q), this.methods = {}, this._methodsArray = null
    }
    qE.fromJSON = function(q, K) {
        var Y = new qE(q, K.options);
        if (K.methods)
            for (var z = Object.keys(K.methods), _ = 0; _ < z.length; ++_) Y.add(MC8.fromJSON(z[_], K.methods[z[_]]));
        if (K.nested) Y.addJSON(K.nested);
        if (K.edition) Y._edition = K.edition;
        return Y.comment = K.comment, Y._defaultEdition = "proto3", Y
    };
    qE.prototype.toJSON = function(q) {
        var K = dc.prototype.toJSON.call(this, q),
            Y = q ? Boolean(q.keepComments) : !1;
        return _d6.toObject(["edition", this._editionToJSON(), "options", K && K.options || void 0, "methods", dc.arrayToJSON(this.methodsArray, q) || {}, "nested", K && K.nested || void 0, "comment", Y ? this.comment : void 0])
    };
    Object.defineProperty(qE.prototype, "methodsArray", {
        get: function() {
            return this._methodsArray || (this._methodsArray = _d6.toArray(this.methods))
        }
    });

    function mu4(A) {
        return A._methodsArray = null, A
    }
    qE.prototype.get = function(q) {
        return this.methods[q] || dc.prototype.get.call(this, q)
    };
    qE.prototype.resolveAll = function() {
        if (!this._needsRecursiveResolve) return this;
        dc.prototype.resolve.call(this);
        var q = this.methodsArray;
        for (var K = 0; K < q.length; ++K) q[K].resolve();
        return this
    };
    qE.prototype._resolveFeaturesRecursive = function(q) {
        if (!this._needsRecursiveFeatureResolution) return this;
        return q = this._edition || q, dc.prototype._resolveFeaturesRecursive.call(this, q), this.methodsArray.forEach((K) => {
            K._resolveFeaturesRecursive(q)
        }), this
    };
    qE.prototype.add = function(q) {
        if (this.get(q.name)) throw Error("duplicate name '" + q.name + "' in " + this);
        if (q instanceof MC8) return this.methods[q.name] = q, q.parent = this, mu4(this);
        return dc.prototype.add.call(this, q)
    };
    qE.prototype.remove = function(q) {
        if (q instanceof MC8) {
            if (this.methods[q.name] !== q) throw Error(q + " is not a member of " + this);
            return delete this.methods[q.name], q.parent = null, mu4(this)
        }
        return dc.prototype.remove.call(this, q)
    };
    qE.prototype.create = function(q, K, Y) {
        var z = new vHY.Service(q, K, Y);
        for (var _ = 0, w; _ < this.methodsArray.length; ++_) {
            var O = _d6.lcFirst((w = this._methodsArray[_]).resolve().name).replace(/[^$\w_]/g, "");
            z[O] = _d6.codegen(["r", "c"], _d6.isReserved(O) ? O + "_" : O)("return this.rpcCall(m,q,s,r,c)")({
                m: w,
                q: w.resolvedRequestType.ctor,
                s: w.resolvedResponseType.ctor
            })
        }
        return z
    }
})
// @from(Ln 306363, Col 4)
_T1 = x((jWw, gu4) => {
    gu4.exports = Vg;
    var NHY = Wg();

    function Vg(A) {
        if (A)
            for (var q = Object.keys(A), K = 0; K < q.length; ++K) this[q[K]] = A[q[K]]
    }
    Vg.create = function(q) {
        return this.$type.create(q)
    };
    Vg.encode = function(q, K) {
        return this.$type.encode(q, K)
    };
    Vg.encodeDelimited = function(q, K) {
        return this.$type.encodeDelimited(q, K)
    };
    Vg.decode = function(q) {
        return this.$type.decode(q)
    };
    Vg.decodeDelimited = function(q) {
        return this.$type.decodeDelimited(q)
    };
    Vg.verify = function(q) {
        return this.$type.verify(q)
    };
    Vg.fromObject = function(q) {
        return this.$type.fromObject(q)
    };
    Vg.toObject = function(q, K) {
        return this.$type.toObject(q, K)
    };
    Vg.prototype.toJSON = function() {
        return this.$type.toObject(this, NHY.toJSONOptions)
    }
})
// @from(Ln 306399, Col 4)
DC8 = x((JWw, pu4) => {
    pu4.exports = EHY;
    var VHY = jb(),
        cc = WY6(),
        Fu4 = RX();

    function kHY(A) {
        return "missing required '" + A.name + "'"
    }

    function EHY(A) {
        var q = Fu4.codegen(["r", "l", "e"], A.name + "$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (A.fieldsArray.filter(function(O) {
                return O.map
            }).length ? ",k,value" : ""))("while(r.pos<c){")("var t=r.uint32()")("if(t===e)")("break")("switch(t>>>3){"),
            K = 0;
        for (; K < A.fieldsArray.length; ++K) {
            var Y = A._fieldsArray[K].resolve(),
                z = Y.resolvedType instanceof VHY ? "int32" : Y.type,
                _ = "m" + Fu4.safeProp(Y.name);
            if (q("case %i: {", Y.id), Y.map) {
                if (q("if(%s===util.emptyObject)", _)("%s={}", _)("var c2 = r.uint32()+r.pos"), cc.defaults[Y.keyType] !== void 0) q("k=%j", cc.defaults[Y.keyType]);
                else q("k=null");
                if (cc.defaults[z] !== void 0) q("value=%j", cc.defaults[z]);
                else q("value=null");
                if (q("while(r.pos<c2){")("var tag2=r.uint32()")("switch(tag2>>>3){")("case 1: k=r.%s(); break", Y.keyType)("case 2:"), cc.basic[z] === void 0) q("value=types[%i].decode(r,r.uint32())", K);
                else q("value=r.%s()", z);
                if (q("break")("default:")("r.skipType(tag2&7)")("break")("}")("}"), cc.long[Y.keyType] !== void 0) q('%s[typeof k==="object"?util.longToHash(k):k]=value', _);
                else q("%s[k]=value", _)
            } else if (Y.repeated) {
                if (q("if(!(%s&&%s.length))", _, _)("%s=[]", _), cc.packed[z] !== void 0) q("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())", _, z)("}else");
                if (cc.basic[z] === void 0) q(Y.delimited ? "%s.push(types[%i].decode(r,undefined,((t&~7)|4)))" : "%s.push(types[%i].decode(r,r.uint32()))", _, K);
                else q("%s.push(r.%s())", _, z)
            } else if (cc.basic[z] === void 0) q(Y.delimited ? "%s=types[%i].decode(r,undefined,((t&~7)|4))" : "%s=types[%i].decode(r,r.uint32())", _, K);
            else q("%s=r.%s()", _, z);
            q("break")("}")
        }
        q("default:")("r.skipType(t&7)")("break")("}")("}");
        for (K = 0; K < A._fieldsArray.length; ++K) {
            var w = A._fieldsArray[K];
            if (w.required) q("if(!m.hasOwnProperty(%j))", w.name)("throw util.ProtocolError(%j,{instance:m})", kHY(w))
        }
        return q("return m")
    }
})
// @from(Ln 306443, Col 4)
WC8 = x((MWw, Qu4) => {
    Qu4.exports = RHY;
    var yHY = jb(),
        XC8 = RX();

    function lR(A, q) {
        return A.name + ": " + q + (A.repeated && q !== "array" ? "[]" : A.map && q !== "object" ? "{k:" + A.keyType + "}" : "") + " expected"
    }

    function PC8(A, q, K, Y) {
        if (q.resolvedType)
            if (q.resolvedType instanceof yHY) {
                A("switch(%s){", Y)("default:")("return%j", lR(q, "enum value"));
                for (var z = Object.keys(q.resolvedType.values), _ = 0; _ < z.length; ++_) A("case %i:", q.resolvedType.values[z[_]]);
                A("break")("}")
            } else A("{")("var e=types[%i].verify(%s);", K, Y)("if(e)")("return%j+e", q.name + ".")("}");
        else switch (q.type) {
            case "int32":
            case "uint32":
            case "sint32":
            case "fixed32":
            case "sfixed32":
                A("if(!util.isInteger(%s))", Y)("return%j", lR(q, "integer"));
                break;
            case "int64":
            case "uint64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
                A("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", Y, Y, Y, Y)("return%j", lR(q, "integer|Long"));
                break;
            case "float":
            case "double":
                A('if(typeof %s!=="number")', Y)("return%j", lR(q, "number"));
                break;
            case "bool":
                A('if(typeof %s!=="boolean")', Y)("return%j", lR(q, "boolean"));
                break;
            case "string":
                A("if(!util.isString(%s))", Y)("return%j", lR(q, "string"));
                break;
            case "bytes":
                A('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))', Y, Y, Y)("return%j", lR(q, "buffer"));
                break
        }
        return A
    }

    function LHY(A, q, K) {
        switch (q.keyType) {
            case "int32":
            case "uint32":
            case "sint32":
            case "fixed32":
            case "sfixed32":
                A("if(!util.key32Re.test(%s))", K)("return%j", lR(q, "integer key"));
                break;
            case "int64":
            case "uint64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
                A("if(!util.key64Re.test(%s))", K)("return%j", lR(q, "integer|Long key"));
                break;
            case "bool":
                A("if(!util.key2Re.test(%s))", K)("return%j", lR(q, "boolean key"));
                break
        }
        return A
    }

    function RHY(A) {
        var q = XC8.codegen(["m"], A.name + "$verify")('if(typeof m!=="object"||m===null)')("return%j", "object expected"),
            K = A.oneofsArray,
            Y = {};
        if (K.length) q("var p={}");
        for (var z = 0; z < A.fieldsArray.length; ++z) {
            var _ = A._fieldsArray[z].resolve(),
                w = "m" + XC8.safeProp(_.name);
            if (_.optional) q("if(%s!=null&&m.hasOwnProperty(%j)){", w, _.name);
            if (_.map) q("if(!util.isObject(%s))", w)("return%j", lR(_, "object"))("var k=Object.keys(%s)", w)("for(var i=0;i<k.length;++i){"), LHY(q, _, "k[i]"), PC8(q, _, z, w + "[k[i]]")("}");
            else if (_.repeated) q("if(!Array.isArray(%s))", w)("return%j", lR(_, "array"))("for(var i=0;i<%s.length;++i){", w), PC8(q, _, z, w + "[i]")("}");
            else {
                if (_.partOf) {
                    var O = XC8.safeProp(_.partOf.name);
                    if (Y[_.partOf.name] === 1) q("if(p%s===1)", O)("return%j", _.partOf.name + ": multiple values");
                    Y[_.partOf.name] = 1, q("p%s=1", O)
                }
                PC8(q, _, z, w)
            }
            if (_.optional) q("}")
        }
        return q("return null")
    }
})
// @from(Ln 306538, Col 4)
fC8 = x((du4) => {
    var Uu4 = du4,
        wd6 = jb(),
        kg = RX();

    function ZC8(A, q, K, Y) {
        var z = !1;
        if (q.resolvedType)
            if (q.resolvedType instanceof wd6) {
                A("switch(d%s){", Y);
                for (var _ = q.resolvedType.values, w = Object.keys(_), O = 0; O < w.length; ++O) {
                    if (_[w[O]] === q.typeDefault && !z) {
                        if (A("default:")('if(typeof(d%s)==="number"){m%s=d%s;break}', Y, Y, Y), !q.repeated) A("break");
                        z = !0
                    }
                    A("case%j:", w[O])("case %i:", _[w[O]])("m%s=%j", Y, _[w[O]])("break")
                }
                A("}")
            } else A('if(typeof d%s!=="object")', Y)("throw TypeError(%j)", q.fullName + ": object expected")("m%s=types[%i].fromObject(d%s)", Y, K, Y);
        else {
            var $ = !1;
            switch (q.type) {
                case "double":
                case "float":
                    A("m%s=Number(d%s)", Y, Y);
                    break;
                case "uint32":
                case "fixed32":
                    A("m%s=d%s>>>0", Y, Y);
                    break;
                case "int32":
                case "sint32":
                case "sfixed32":
                    A("m%s=d%s|0", Y, Y);
                    break;
                case "uint64":
                    $ = !0;
                case "int64":
                case "sint64":
                case "fixed64":
                case "sfixed64":
                    A("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j", Y, Y, $)('else if(typeof d%s==="string")', Y)("m%s=parseInt(d%s,10)", Y, Y)('else if(typeof d%s==="number")', Y)("m%s=d%s", Y, Y)('else if(typeof d%s==="object")', Y)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", Y, Y, Y, $ ? "true" : "");
                    break;
                case "bytes":
                    A('if(typeof d%s==="string")', Y)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", Y, Y, Y)("else if(d%s.length >= 0)", Y)("m%s=d%s", Y, Y);
                    break;
                case "string":
                    A("m%s=String(d%s)", Y, Y);
                    break;
                case "bool":
                    A("m%s=Boolean(d%s)", Y, Y);
                    break
            }
        }
        return A
    }
    Uu4.fromObject = function(q) {
        var K = q.fieldsArray,
            Y = kg.codegen(["d"], q.name + "$fromObject")("if(d instanceof this.ctor)")("return d");
        if (!K.length) return Y("return new this.ctor");
        Y("var m=new this.ctor");
        for (var z = 0; z < K.length; ++z) {
            var _ = K[z].resolve(),
                w = kg.safeProp(_.name);
            if (_.map) Y("if(d%s){", w)('if(typeof d%s!=="object")', w)("throw TypeError(%j)", _.fullName + ": object expected")("m%s={}", w)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", w), ZC8(Y, _, z, w + "[ks[i]]")("}")("}");
            else if (_.repeated) Y("if(d%s){", w)("if(!Array.isArray(d%s))", w)("throw TypeError(%j)", _.fullName + ": array expected")("m%s=[]", w)("for(var i=0;i<d%s.length;++i){", w), ZC8(Y, _, z, w + "[i]")("}")("}");
            else {
                if (!(_.resolvedType instanceof wd6)) Y("if(d%s!=null){", w);
                if (ZC8(Y, _, z, w), !(_.resolvedType instanceof wd6)) Y("}")
            }
        }
        return Y("return m")
    };

    function GC8(A, q, K, Y) {
        if (q.resolvedType)
            if (q.resolvedType instanceof wd6) A("d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s", Y, K, Y, Y, K, Y, Y);
            else A("d%s=types[%i].toObject(m%s,o)", Y, K, Y);
        else {
            var z = !1;
            switch (q.type) {
                case "double":
                case "float":
                    A("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", Y, Y, Y, Y);
                    break;
                case "uint64":
                    z = !0;
                case "int64":
                case "sint64":
                case "fixed64":
                case "sfixed64":
                    A('if(typeof m%s==="number")', Y)("d%s=o.longs===String?String(m%s):m%s", Y, Y, Y)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", Y, Y, Y, Y, z ? "true" : "", Y);
                    break;
                case "bytes":
                    A("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", Y, Y, Y, Y, Y);
                    break;
                default:
                    A("d%s=m%s", Y, Y);
                    break
            }
        }
        return A
    }
    Uu4.toObject = function(q) {
        var K = q.fieldsArray.slice().sort(kg.compareFieldsById);
        if (!K.length) return kg.codegen()("return {}");
        var Y = kg.codegen(["m", "o"], q.name + "$toObject")("if(!o)")("o={}")("var d={}"),
            z = [],
            _ = [],
            w = [],
            O = 0;
        for (; O < K.length; ++O)
            if (!K[O].partOf)(K[O].resolve().repeated ? z : K[O].map ? _ : w).push(K[O]);
        if (z.length) {
            Y("if(o.arrays||o.defaults){");
            for (O = 0; O < z.length; ++O) Y("d%s=[]", kg.safeProp(z[O].name));
            Y("}")
        }
        if (_.length) {
            Y("if(o.objects||o.defaults){");
            for (O = 0; O < _.length; ++O) Y("d%s={}", kg.safeProp(_[O].name));
            Y("}")
        }
        if (w.length) {
            Y("if(o.defaults){");
            for (O = 0; O < w.length; ++O) {
                var $ = w[O],
                    H = kg.safeProp($.name);
                if ($.resolvedType instanceof wd6) Y("d%s=o.enums===String?%j:%j", H, $.resolvedType.valuesById[$.typeDefault], $.typeDefault);
                else if ($.long) Y("if(util.Long){")("var n=new util.Long(%i,%i,%j)", $.typeDefault.low, $.typeDefault.high, $.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n", H)("}else")("d%s=o.longs===String?%j:%i", H, $.typeDefault.toString(), $.typeDefault.toNumber());
                else if ($.bytes) {
                    var j = "[" + Array.prototype.slice.call($.typeDefault).join(",") + "]";
                    Y("if(o.bytes===String)d%s=%j", H, String.fromCharCode.apply(String, $.typeDefault))("else{")("d%s=%s", H, j)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)", H, H)("}")
                } else Y("d%s=%j", H, $.typeDefault)
            }
            Y("}")
        }
        var J = !1;
        for (O = 0; O < K.length; ++O) {
            var $ = K[O],
                M = q._fieldsArray.indexOf($),
                H = kg.safeProp($.name);
            if ($.map) {
                if (!J) J = !0, Y("var ks2");
                Y("if(m%s&&(ks2=Object.keys(m%s)).length){", H, H)("d%s={}", H)("for(var j=0;j<ks2.length;++j){"), GC8(Y, $, M, H + "[ks2[j]]")("}")
            } else if ($.repeated) Y("if(m%s&&m%s.length){", H, H)("d%s=[]", H)("for(var j=0;j<m%s.length;++j){", H), GC8(Y, $, M, H + "[j]")("}");
            else if (Y("if(m%s!=null&&m.hasOwnProperty(%j)){", H, $.name), GC8(Y, $, M, H), $.partOf) Y("if(o.oneofs)")("d%s=%j", kg.safeProp($.partOf.name), $.name);
            Y("}")
        }
        return Y("return d")
    }
})
// @from(Ln 306690, Col 4)
TC8 = x((cu4) => {
    var hHY = cu4,
        SHY = _T1();
    hHY[".google.protobuf.Any"] = {
        fromObject: function(A) {
            if (A && A["@type"]) {
                var q = A["@type"].substring(A["@type"].lastIndexOf("/") + 1),
                    K = this.lookup(q);
                if (K) {
                    var Y = A["@type"].charAt(0) === "." ? A["@type"].slice(1) : A["@type"];
                    if (Y.indexOf("/") === -1) Y = "/" + Y;
                    return this.create({
                        type_url: Y,
                        value: K.encode(K.fromObject(A)).finish()
                    })
                }
            }
            return this.fromObject(A)
        },
        toObject: function(A, q) {
            var K = "type.googleapis.com/",
                Y = "",
                z = "";
            if (q && q.json && A.type_url && A.value) {
                z = A.type_url.substring(A.type_url.lastIndexOf("/") + 1), Y = A.type_url.substring(0, A.type_url.lastIndexOf("/") + 1);
                var _ = this.lookup(z);
                if (_) A = _.decode(A.value)
            }
            if (!(A instanceof this.ctor) && A instanceof SHY) {
                var w = A.$type.toObject(A, q),
                    O = A.$type.fullName[0] === "." ? A.$type.fullName.slice(1) : A.$type.fullName;
                if (Y === "") Y = K;
                return z = Y + O, w["@type"] = z, w
            }
            return this.toObject(A, q)
        }
    }
})
// @from(Ln 306728, Col 4)
$T1 = x((PWw, iu4) => {
    iu4.exports = _w;
    var iR = uG6();
    ((_w.prototype = Object.create(iR.prototype)).constructor = _w).className = "Type";
    var CHY = jb(),
        VC8 = PY6(),
        wT1 = le(),
        IHY = KT1(),
        bHY = zT1(),
        vC8 = _T1(),
        NC8 = Jf1(),
        xHY = Hf1(),
        kZ = RX(),
        uHY = kC8(),
        mHY = DC8(),
        BHY = WC8(),
        lu4 = fC8(),
        gHY = TC8();

    function _w(A, q) {
        iR.call(this, A, q), this.fields = {}, this.oneofs = void 0, this.extensions = void 0, this.reserved = void 0, this.group = void 0, this._fieldsById = null, this._fieldsArray = null, this._oneofsArray = null, this._ctor = null
    }
    Object.defineProperties(_w.prototype, {
        fieldsById: {
            get: function() {
                if (this._fieldsById) return this._fieldsById;
                this._fieldsById = {};
                for (var A = Object.keys(this.fields), q = 0; q < A.length; ++q) {
                    var K = this.fields[A[q]],
                        Y = K.id;
                    if (this._fieldsById[Y]) throw Error("duplicate id " + Y + " in " + this);
                    this._fieldsById[Y] = K
                }
                return this._fieldsById
            }
        },
        fieldsArray: {
            get: function() {
                return this._fieldsArray || (this._fieldsArray = kZ.toArray(this.fields))
            }
        },
        oneofsArray: {
            get: function() {
                return this._oneofsArray || (this._oneofsArray = kZ.toArray(this.oneofs))
            }
        },
        ctor: {
            get: function() {
                return this._ctor || (this.ctor = _w.generateConstructor(this)())
            },
            set: function(A) {
                var q = A.prototype;
                if (!(q instanceof vC8))(A.prototype = new vC8).constructor = A, kZ.merge(A.prototype, q);
                A.$type = A.prototype.$type = this, kZ.merge(A, vC8, !0), this._ctor = A;
                var K = 0;
                for (; K < this.fieldsArray.length; ++K) this._fieldsArray[K].resolve();
                var Y = {};
                for (K = 0; K < this.oneofsArray.length; ++K) Y[this._oneofsArray[K].resolve().name] = {
                    get: kZ.oneOfGetter(this._oneofsArray[K].oneof),
                    set: kZ.oneOfSetter(this._oneofsArray[K].oneof)
                };
                if (K) Object.defineProperties(A.prototype, Y)
            }
        }
    });
    _w.generateConstructor = function(q) {
        var K = kZ.codegen(["p"], q.name);
        for (var Y = 0, z; Y < q.fieldsArray.length; ++Y)
            if ((z = q._fieldsArray[Y]).map) K("this%s={}", kZ.safeProp(z.name));
            else if (z.repeated) K("this%s=[]", kZ.safeProp(z.name));
        return K("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]")
    };

    function OT1(A) {
        return A._fieldsById = A._fieldsArray = A._oneofsArray = null, delete A.encode, delete A.decode, delete A.verify, A
    }
    _w.fromJSON = function(q, K) {
        var Y = new _w(q, K.options);
        Y.extensions = K.extensions, Y.reserved = K.reserved;
        var z = Object.keys(K.fields),
            _ = 0;
        for (; _ < z.length; ++_) Y.add((typeof K.fields[z[_]].keyType < "u" ? IHY.fromJSON : wT1.fromJSON)(z[_], K.fields[z[_]]));
        if (K.oneofs)
            for (z = Object.keys(K.oneofs), _ = 0; _ < z.length; ++_) Y.add(VC8.fromJSON(z[_], K.oneofs[z[_]]));
        if (K.nested)
            for (z = Object.keys(K.nested), _ = 0; _ < z.length; ++_) {
                var w = K.nested[z[_]];
                Y.add((w.id !== void 0 ? wT1.fromJSON : w.fields !== void 0 ? _w.fromJSON : w.values !== void 0 ? CHY.fromJSON : w.methods !== void 0 ? bHY.fromJSON : iR.fromJSON)(z[_], w))
            }
        if (K.extensions && K.extensions.length) Y.extensions = K.extensions;
        if (K.reserved && K.reserved.length) Y.reserved = K.reserved;
        if (K.group) Y.group = !0;
        if (K.comment) Y.comment = K.comment;
        if (K.edition) Y._edition = K.edition;
        return Y._defaultEdition = "proto3", Y
    };
    _w.prototype.toJSON = function(q) {
        var K = iR.prototype.toJSON.call(this, q),
            Y = q ? Boolean(q.keepComments) : !1;
        return kZ.toObject(["edition", this._editionToJSON(), "options", K && K.options || void 0, "oneofs", iR.arrayToJSON(this.oneofsArray, q), "fields", iR.arrayToJSON(this.fieldsArray.filter(function(z) {
            return !z.declaringField
        }), q) || {}, "extensions", this.extensions && this.extensions.length ? this.extensions : void 0, "reserved", this.reserved && this.reserved.length ? this.reserved : void 0, "group", this.group || void 0, "nested", K && K.nested || void 0, "comment", Y ? this.comment : void 0])
    };
    _w.prototype.resolveAll = function() {
        if (!this._needsRecursiveResolve) return this;
        iR.prototype.resolveAll.call(this);
        var q = this.oneofsArray;
        Y = 0;
        while (Y < q.length) q[Y++].resolve();
        var K = this.fieldsArray,
            Y = 0;
        while (Y < K.length) K[Y++].resolve();
        return this
    };
    _w.prototype._resolveFeaturesRecursive = function(q) {
        if (!this._needsRecursiveFeatureResolution) return this;
        return q = this._edition || q, iR.prototype._resolveFeaturesRecursive.call(this, q), this.oneofsArray.forEach((K) => {
            K._resolveFeatures(q)
        }), this.fieldsArray.forEach((K) => {
            K._resolveFeatures(q)
        }), this
    };
    _w.prototype.get = function(q) {
        return this.fields[q] || this.oneofs && this.oneofs[q] || this.nested && this.nested[q] || null
    };
    _w.prototype.add = function(q) {
        if (this.get(q.name)) throw Error("duplicate name '" + q.name + "' in " + this);
        if (q instanceof wT1 && q.extend === void 0) {
            if (this._fieldsById ? this._fieldsById[q.id] : this.fieldsById[q.id]) throw Error("duplicate id " + q.id + " in " + this);
            if (this.isReservedId(q.id)) throw Error("id " + q.id + " is reserved in " + this);
            if (this.isReservedName(q.name)) throw Error("name '" + q.name + "' is reserved in " + this);
            if (q.parent) q.parent.remove(q);
            return this.fields[q.name] = q, q.message = this, q.onAdd(this), OT1(this)
        }
        if (q instanceof VC8) {
            if (!this.oneofs) this.oneofs = {};
            return this.oneofs[q.name] = q, q.onAdd(this), OT1(this)
        }
        return iR.prototype.add.call(this, q)
    };
    _w.prototype.remove = function(q) {
        if (q instanceof wT1 && q.extend === void 0) {
            if (!this.fields || this.fields[q.name] !== q) throw Error(q + " is not a member of " + this);
            return delete this.fields[q.name], q.parent = null, q.onRemove(this), OT1(this)
        }
        if (q instanceof VC8) {
            if (!this.oneofs || this.oneofs[q.name] !== q) throw Error(q + " is not a member of " + this);
            return delete this.oneofs[q.name], q.parent = null, q.onRemove(this), OT1(this)
        }
        return iR.prototype.remove.call(this, q)
    };
    _w.prototype.isReservedId = function(q) {
        return iR.isReservedId(this.reserved, q)
    };
    _w.prototype.isReservedName = function(q) {
        return iR.isReservedName(this.reserved, q)
    };
    _w.prototype.create = function(q) {
        return new this.ctor(q)
    };
    _w.prototype.setup = function() {
        var q = this.fullName,
            K = [];
        for (var Y = 0; Y < this.fieldsArray.length; ++Y) K.push(this._fieldsArray[Y].resolve().resolvedType);
        this.encode = uHY(this)({
            Writer: xHY,
            types: K,
            util: kZ
        }), this.decode = mHY(this)({
            Reader: NC8,
            types: K,
            util: kZ
        }), this.verify = BHY(this)({
            types: K,
            util: kZ
        }), this.fromObject = lu4.fromObject(this)({
            types: K,
            util: kZ
        }), this.toObject = lu4.toObject(this)({
            types: K,
            util: kZ
        });
        var z = gHY[q];
        if (z) {
            var _ = Object.create(this);
            _.fromObject = this.fromObject, this.fromObject = z.fromObject.bind(_), _.toObject = this.toObject, this.toObject = z.toObject.bind(_)
        }
        return this
    };
    _w.prototype.encode = function(q, K) {
        return this.setup().encode(q, K)
    };
    _w.prototype.encodeDelimited = function(q, K) {
        return this.encode(q, K && K.len ? K.fork() : K).ldelim()
    };
    _w.prototype.decode = function(q, K) {
        return this.setup().decode(q, K)
    };
    _w.prototype.decodeDelimited = function(q) {
        if (!(q instanceof NC8)) q = NC8.create(q);
        return this.decode(q, q.uint32())
    };
    _w.prototype.verify = function(q) {
        return this.setup().verify(q)
    };
    _w.prototype.fromObject = function(q) {
        return this.setup().fromObject(q)
    };
    _w.prototype.toObject = function(q, K) {
        return this.setup().toObject(q, K)
    };
    _w.d = function(q) {
        return function(Y) {
            kZ.decorateType(Y, q)
        }
    }
})
// @from(Ln 306945, Col 4)
MT1 = x((WWw, ou4) => {
    ou4.exports = KE;
    var JT1 = uG6();
    ((KE.prototype = Object.create(JT1.prototype)).constructor = KE).className = "Root";
    var HT1 = le(),
        EC8 = jb(),
        FHY = PY6(),
        ne = RX(),
        yC8, LC8, Od6;

    function KE(A) {
        JT1.call(this, "", A), this.deferred = [], this.files = [], this._edition = "proto2", this._fullyQualifiedObjects = {}
    }
    KE.fromJSON = function(q, K) {
        if (!K) K = new KE;
        if (q.options) K.setOptions(q.options);
        return K.addJSON(q.nested).resolveAll()
    };
    KE.prototype.resolvePath = ne.path.resolve;
    KE.prototype.fetch = ne.fetch;

    function ru4() {}
    KE.prototype.load = function A(q, K, Y) {
        if (typeof K === "function") Y = K, K = void 0;
        var z = this;
        if (!Y) return ne.asPromise(A, z, q, K);
        var _ = Y === ru4;

        function w(D, X) {
            if (!Y) return;
            if (_) throw D;
            if (X) X.resolveAll();
            var P = Y;
            Y = null, P(D, X)
        }

        function O(D) {
            var X = D.lastIndexOf("google/protobuf/");
            if (X > -1) {
                var P = D.substring(X);
                if (P in Od6) return P
            }
            return null
        }

        function $(D, X) {
            try {
                if (ne.isString(X) && X.charAt(0) === "{") X = JSON.parse(X);
                if (!ne.isString(X)) z.setOptions(X.options).addJSON(X.nested);
                else {
                    LC8.filename = D;
                    var P = LC8(X, z, K),
                        W, Z = 0;
                    if (P.imports) {
                        for (; Z < P.imports.length; ++Z)
                            if (W = O(P.imports[Z]) || z.resolvePath(D, P.imports[Z])) H(W)
                    }
                    if (P.weakImports) {
                        for (Z = 0; Z < P.weakImports.length; ++Z)
                            if (W = O(P.weakImports[Z]) || z.resolvePath(D, P.weakImports[Z])) H(W, !0)
                    }
                }
            } catch (G) {
                w(G)
            }
            if (!_ && !j) w(null, z)
        }

        function H(D, X) {
            if (D = O(D) || D, z.files.indexOf(D) > -1) return;
            if (z.files.push(D), D in Od6) {
                if (_) $(D, Od6[D]);
                else ++j, setTimeout(function() {
                    --j, $(D, Od6[D])
                });
                return
            }
            if (_) {
                var P;
                try {
                    P = ne.fs.readFileSync(D).toString("utf8")
                } catch (W) {
                    if (!X) w(W);
                    return
                }
                $(D, P)
            } else ++j, z.fetch(D, function(W, Z) {
                if (--j, !Y) return;
                if (W) {
                    if (!X) w(W);
                    else if (!j) w(null, z);
                    return
                }
                $(D, Z)
            })
        }
        var j = 0;
        if (ne.isString(q)) q = [q];
        for (var J = 0, M; J < q.length; ++J)
            if (M = z.resolvePath("", q[J])) H(M);
        if (_) return z.resolveAll(), z;
        if (!j) w(null, z);
        return z
    };
    KE.prototype.loadSync = function(q, K) {
        if (!ne.isNode) throw Error("not supported");
        return this.load(q, K, ru4)
    };
    KE.prototype.resolveAll = function() {
        if (!this._needsRecursiveResolve) return this;
        if (this.deferred.length) throw Error("unresolvable extensions: " + this.deferred.map(function(q) {
            return "'extend " + q.extend + "' in " + q.parent.fullName
        }).join(", "));
        return JT1.prototype.resolveAll.call(this)
    };
    var jT1 = /^[A-Z]/;

    function nu4(A, q) {
        var K = q.parent.lookup(q.extend);
        if (K) {
            var Y = new HT1(q.fullName, q.id, q.type, q.rule, void 0, q.options);
            if (K.get(Y.name)) return !0;
            return Y.declaringField = q, q.extensionField = Y, K.add(Y), !0
        }
        return !1
    }
    KE.prototype._handleAdd = function(q) {
        if (q instanceof HT1) {
            if (q.extend !== void 0 && !q.extensionField) {
                if (!nu4(this, q)) this.deferred.push(q)
            }
        } else if (q instanceof EC8) {
            if (jT1.test(q.name)) q.parent[q.name] = q.values
        } else if (!(q instanceof FHY)) {
            if (q instanceof yC8)
                for (var K = 0; K < this.deferred.length;)
                    if (nu4(this, this.deferred[K])) this.deferred.splice(K, 1);
                    else ++K;
            for (var Y = 0; Y < q.nestedArray.length; ++Y) this._handleAdd(q._nestedArray[Y]);
            if (jT1.test(q.name)) q.parent[q.name] = q
        }
        if (q instanceof yC8 || q instanceof EC8 || q instanceof HT1) this._fullyQualifiedObjects[q.fullName] = q
    };
    KE.prototype._handleRemove = function(q) {
        if (q instanceof HT1) {
            if (q.extend !== void 0)
                if (q.extensionField) q.extensionField.parent.remove(q.extensionField), q.extensionField = null;
                else {
                    var K = this.deferred.indexOf(q);
                    if (K > -1) this.deferred.splice(K, 1)
                }
        } else if (q instanceof EC8) {
            if (jT1.test(q.name)) delete q.parent[q.name]
        } else if (q instanceof JT1) {
            for (var Y = 0; Y < q.nestedArray.length; ++Y) this._handleRemove(q._nestedArray[Y]);
            if (jT1.test(q.name)) delete q.parent[q.name]
        }
        delete this._fullyQualifiedObjects[q.fullName]
    };
    KE._configure = function(A, q, K) {
        yC8 = A, LC8 = q, Od6 = K
    }
})
// @from(Ln 307108, Col 4)
RX = x((ZWw, su4) => {
    var tj = su4.exports = Wg(),
        au4 = Rh8(),
        RC8, hC8;
    tj.codegen = Eu4();
    tj.fetch = Lu4();
    tj.path = Su4();
    tj.fs = tj.inquire("fs");
    tj.toArray = function(q) {
        if (q) {
            var K = Object.keys(q),
                Y = Array(K.length),
                z = 0;
            while (z < K.length) Y[z] = q[K[z++]];
            return Y
        }
        return []
    };
    tj.toObject = function(q) {
        var K = {},
            Y = 0;
        while (Y < q.length) {
            var z = q[Y++],
                _ = q[Y++];
            if (_ !== void 0) K[z] = _
        }
        return K
    };
    var pHY = /\\/g,
        QHY = /"/g;
    tj.isReserved = function(q) {
        return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(q)
    };
    tj.safeProp = function(q) {
        if (!/^[$\w_]+$/.test(q) || tj.isReserved(q)) return '["' + q.replace(pHY, "\\\\").replace(QHY, "\\\"") + '"]';
        return "." + q
    };
    tj.ucFirst = function(q) {
        return q.charAt(0).toUpperCase() + q.substring(1)
    };
    var UHY = /_([a-z])/g;
    tj.camelCase = function(q) {
        return q.substring(0, 1) + q.substring(1).replace(UHY, function(K, Y) {
            return Y.toUpperCase()
        })
    };
    tj.compareFieldsById = function(q, K) {
        return q.id - K.id
    };
    tj.decorateType = function(q, K) {
        if (q.$type) {
            if (K && q.$type.name !== K) tj.decorateRoot.remove(q.$type), q.$type.name = K, tj.decorateRoot.add(q.$type);
            return q.$type
        }
        if (!RC8) RC8 = $T1();
        var Y = new RC8(K || q.name);
        return tj.decorateRoot.add(Y), Y.ctor = q, Object.defineProperty(q, "$type", {
            value: Y,
            enumerable: !1
        }), Object.defineProperty(q.prototype, "$type", {
            value: Y,
            enumerable: !1
        }), Y
    };
    var dHY = 0;
    tj.decorateEnum = function(q) {
        if (q.$type) return q.$type;
        if (!hC8) hC8 = jb();
        var K = new hC8("Enum" + dHY++, q);
        return tj.decorateRoot.add(K), Object.defineProperty(q, "$type", {
            value: K,
            enumerable: !1
        }), K
    };
    tj.setProperty = function(q, K, Y, z) {
        function _(w, O, $) {
            var H = O.shift();
            if (H === "__proto__" || H === "prototype") return w;
            if (O.length > 0) w[H] = _(w[H] || {}, O, $);
            else {
                var j = w[H];
                if (j && z) return w;
                if (j) $ = [].concat(j).concat($);
                w[H] = $
            }
            return w
        }
        if (typeof q !== "object") throw TypeError("dst must be an object");
        if (!K) throw TypeError("path must be specified");
        return K = K.split("."), _(q, K, Y)
    };
    Object.defineProperty(tj, "decorateRoot", {
        get: function() {
            return au4.decorated || (au4.decorated = new(MT1()))
        }
    })
})
// @from(Ln 307205, Col 4)
WY6 = x((tu4) => {
    var $d6 = tu4,
        cHY = RX(),
        lHY = ["double", "float", "int32", "uint32", "sint32", "fixed32", "sfixed32", "int64", "uint64", "sint64", "fixed64", "sfixed64", "bool", "string", "bytes"];

    function Hd6(A, q) {
        var K = 0,
            Y = {};
        q |= 0;
        while (K < A.length) Y[lHY[K + q]] = A[K++];
        return Y
    }
    $d6.basic = Hd6([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2, 2]);
    $d6.defaults = Hd6([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, !1, "", cHY.emptyArray, null]);
    $d6.long = Hd6([0, 0, 0, 1, 1], 7);
    $d6.mapKey = Hd6([0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2], 2);
    $d6.packed = Hd6([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0])
})
// @from(Ln 307223, Col 4)
le = x((fWw, Am4) => {
    Am4.exports = hX;
    var Jd6 = ie();
    ((hX.prototype = Object.create(Jd6.prototype)).constructor = hX).className = "Field";
    var eu4 = jb(),
        SC8 = WY6(),
        $M = RX(),
        jd6, iHY = /^required|optional|repeated$/;
    hX.fromJSON = function(q, K) {
        var Y = new hX(q, K.id, K.type, K.rule, K.extend, K.options, K.comment);
        if (K.edition) Y._edition = K.edition;
        return Y._defaultEdition = "proto3", Y
    };

    function hX(A, q, K, Y, z, _, w) {
        if ($M.isObject(Y)) w = z, _ = Y, Y = z = void 0;
        else if ($M.isObject(z)) w = _, _ = z, z = void 0;
        if (Jd6.call(this, A, _), !$M.isInteger(q) || q < 0) throw TypeError("id must be a non-negative integer");
        if (!$M.isString(K)) throw TypeError("type must be a string");
        if (Y !== void 0 && !iHY.test(Y = Y.toString().toLowerCase())) throw TypeError("rule must be a string rule");
        if (z !== void 0 && !$M.isString(z)) throw TypeError("extend must be a string");
        if (Y === "proto3_optional") Y = "optional";
        this.rule = Y && Y !== "optional" ? Y : void 0, this.type = K, this.id = q, this.extend = z || void 0, this.repeated = Y === "repeated", this.map = !1, this.message = null, this.partOf = null, this.typeDefault = null, this.defaultValue = null, this.long = $M.Long ? SC8.long[K] !== void 0 : !1, this.bytes = K === "bytes", this.resolvedType = null, this.extensionField = null, this.declaringField = null, this.comment = w
    }
    Object.defineProperty(hX.prototype, "required", {
        get: function() {
            return this._features.field_presence === "LEGACY_REQUIRED"
        }
    });
    Object.defineProperty(hX.prototype, "optional", {
        get: function() {
            return !this.required
        }
    });
    Object.defineProperty(hX.prototype, "delimited", {
        get: function() {
            return this.resolvedType instanceof jd6 && this._features.message_encoding === "DELIMITED"
        }
    });
    Object.defineProperty(hX.prototype, "packed", {
        get: function() {
            return this._features.repeated_field_encoding === "PACKED"
        }
    });
    Object.defineProperty(hX.prototype, "hasPresence", {
        get: function() {
            if (this.repeated || this.map) return !1;
            return this.partOf || this.declaringField || this.extensionField || this._features.field_presence !== "IMPLICIT"
        }
    });
    hX.prototype.setOption = function(q, K, Y) {
        return Jd6.prototype.setOption.call(this, q, K, Y)
    };
    hX.prototype.toJSON = function(q) {
        var K = q ? Boolean(q.keepComments) : !1;
        return $M.toObject(["edition", this._editionToJSON(), "rule", this.rule !== "optional" && this.rule || void 0, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", K ? this.comment : void 0])
    };
    hX.prototype.resolve = function() {
        if (this.resolved) return this;
        if ((this.typeDefault = SC8.defaults[this.type]) === void 0)
            if (this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type), this.resolvedType instanceof jd6) this.typeDefault = null;
            else this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]];
        else if (this.options && this.options.proto3_optional) this.typeDefault = null;
        if (this.options && this.options.default != null) {
            if (this.typeDefault = this.options.default, this.resolvedType instanceof eu4 && typeof this.typeDefault === "string") this.typeDefault = this.resolvedType.values[this.typeDefault]
        }
        if (this.options) {
            if (this.options.packed !== void 0 && this.resolvedType && !(this.resolvedType instanceof eu4)) delete this.options.packed;
            if (!Object.keys(this.options).length) this.options = void 0
        }
        if (this.long) {
            if (this.typeDefault = $M.Long.fromNumber(this.typeDefault, this.type.charAt(0) === "u"), Object.freeze) Object.freeze(this.typeDefault)
        } else if (this.bytes && typeof this.typeDefault === "string") {
            var q;
            if ($M.base64.test(this.typeDefault)) $M.base64.decode(this.typeDefault, q = $M.newBuffer($M.base64.length(this.typeDefault)), 0);
            else $M.utf8.write(this.typeDefault, q = $M.newBuffer($M.utf8.length(this.typeDefault)), 0);
            this.typeDefault = q
        }
        if (this.map) this.defaultValue = $M.emptyObject;
        else if (this.repeated) this.defaultValue = $M.emptyArray;
        else this.defaultValue = this.typeDefault;
        if (this.parent instanceof jd6) this.parent.ctor.prototype[this.name] = this.defaultValue;
        return Jd6.prototype.resolve.call(this)
    };
    hX.prototype._inferLegacyProtoFeatures = function(q) {
        if (q !== "proto2" && q !== "proto3") return {};
        var K = {};
        if (this.rule === "required") K.field_presence = "LEGACY_REQUIRED";
        if (this.parent && SC8.defaults[this.type] === void 0) {
            var Y = this.parent.get(this.type.split(".").pop());
            if (Y && Y instanceof jd6 && Y.group) K.message_encoding = "DELIMITED"
        }
        if (this.getOption("packed") === !0) K.repeated_field_encoding = "PACKED";
        else if (this.getOption("packed") === !1) K.repeated_field_encoding = "EXPANDED";
        return K
    };
    hX.prototype._resolveFeatures = function(q) {
        return Jd6.prototype._resolveFeatures.call(this, this._edition || q)
    };
    hX.d = function(q, K, Y, z) {
        if (typeof K === "function") K = $M.decorateType(K).name;
        else if (K && typeof K === "object") K = $M.decorateEnum(K).name;
        return function(w, O) {
            $M.decorateType(w.constructor).add(new hX(O, q, K, Y, {
                default: z
            }))
        }
    };
    hX._configure = function(q) {
        jd6 = q
    }
})