
// @from(Ln 295668, Col 4)
bV4 = R((IV4) => {
    Object.defineProperty(IV4, "__esModule", {
        value: !0
    });
    IV4.Http2SubchannelCall = void 0;
    var Dd = h1("http2"),
        w$Y = h1("os"),
        Jw = w9(),
        jd = Jj(),
        H$Y = NVA(),
        $$Y = mw(),
        O$Y = w9(),
        _$Y = "subchannel_call";

    function J$Y(A) {
        for (let [q, K] of Object.entries(w$Y.constants.errno))
            if (K === A) return q;
        return "Unknown system error " + A
    }

    function TVA(A) {
        let q = `Received HTTP status code ${A}`,
            K;
        switch (A) {
            case 400:
                K = Jw.Status.INTERNAL;
                break;
            case 401:
                K = Jw.Status.UNAUTHENTICATED;
                break;
            case 403:
                K = Jw.Status.PERMISSION_DENIED;
                break;
            case 404:
                K = Jw.Status.UNIMPLEMENTED;
                break;
            case 429:
            case 502:
            case 503:
            case 504:
                K = Jw.Status.UNAVAILABLE;
                break;
            default:
                K = Jw.Status.UNKNOWN
        }
        return {
            code: K,
            details: q,
            metadata: new jd.Metadata
        }
    }
    class hV4 {
        constructor(A, q, K, Y, z) {
            var w;
            this.http2Stream = A, this.callEventTracker = q, this.listener = K, this.transport = Y, this.callId = z, this.isReadFilterPending = !1, this.isPushPending = !1, this.canPush = !1, this.readsClosed = !1, this.statusOutput = !1, this.unpushedReadMessages = [], this.finalStatus = null, this.internalError = null, this.serverEndedCall = !1, this.connectionDropped = !1;
            let H = (w = Y.getOptions()["grpc.max_receive_message_length"]) !== null && w !== void 0 ? w : Jw.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH;
            this.decoder = new H$Y.StreamDecoder(H), A.on("response", ($, O) => {
                let _ = "";
                for (let J of Object.keys($)) _ += "\t\t" + J + ": " + $[J] + `
`;
                if (this.trace(`Received server headers:
` + _), this.httpStatusCode = $[":status"], O & Dd.constants.NGHTTP2_FLAG_END_STREAM) this.handleTrailers($);
                else {
                    let J;
                    try {
                        J = jd.Metadata.fromHttp2Headers($)
                    } catch (X) {
                        this.endCall({
                            code: Jw.Status.UNKNOWN,
                            details: X.message,
                            metadata: new jd.Metadata
                        });
                        return
                    }
                    this.listener.onReceiveMetadata(J)
                }
            }), A.on("trailers", ($) => {
                this.handleTrailers($)
            }), A.on("data", ($) => {
                if (this.statusOutput) return;
                this.trace("receive HTTP/2 data frame of length " + $.length);
                let O;
                try {
                    O = this.decoder.write($)
                } catch (_) {
                    if (this.httpStatusCode !== void 0 && this.httpStatusCode !== 200) {
                        let J = TVA(this.httpStatusCode);
                        this.cancelWithStatus(J.code, J.details)
                    } else this.cancelWithStatus(Jw.Status.RESOURCE_EXHAUSTED, _.message);
                    return
                }
                for (let _ of O) this.trace("parsed message of length " + _.length), this.callEventTracker.addMessageReceived(), this.tryPush(_)
            }), A.on("end", () => {
                this.readsClosed = !0, this.maybeOutputStatus()
            }), A.on("close", () => {
                this.serverEndedCall = !0, process.nextTick(() => {
                    var $;
                    if (this.trace("HTTP/2 stream closed with code " + A.rstCode), (($ = this.finalStatus) === null || $ === void 0 ? void 0 : $.code) === Jw.Status.OK) return;
                    let O, _ = "";
                    switch (A.rstCode) {
                        case Dd.constants.NGHTTP2_NO_ERROR:
                            if (this.finalStatus !== null) return;
                            if (this.httpStatusCode && this.httpStatusCode !== 200) {
                                let J = TVA(this.httpStatusCode);
                                O = J.code, _ = J.details
                            } else O = Jw.Status.INTERNAL, _ = `Received RST_STREAM with code ${A.rstCode} (Call ended without gRPC status)`;
                            break;
                        case Dd.constants.NGHTTP2_REFUSED_STREAM:
                            O = Jw.Status.UNAVAILABLE, _ = "Stream refused by server";
                            break;
                        case Dd.constants.NGHTTP2_CANCEL:
                            if (this.connectionDropped) O = Jw.Status.UNAVAILABLE, _ = "Connection dropped";
                            else O = Jw.Status.CANCELLED, _ = "Call cancelled";
                            break;
                        case Dd.constants.NGHTTP2_ENHANCE_YOUR_CALM:
                            O = Jw.Status.RESOURCE_EXHAUSTED, _ = "Bandwidth exhausted or memory limit exceeded";
                            break;
                        case Dd.constants.NGHTTP2_INADEQUATE_SECURITY:
                            O = Jw.Status.PERMISSION_DENIED, _ = "Protocol not secure enough";
                            break;
                        case Dd.constants.NGHTTP2_INTERNAL_ERROR:
                            if (O = Jw.Status.INTERNAL, this.internalError === null) _ = `Received RST_STREAM with code ${A.rstCode} (Internal server error)`;
                            else if (this.internalError.code === "ECONNRESET" || this.internalError.code === "ETIMEDOUT") O = Jw.Status.UNAVAILABLE, _ = this.internalError.message;
                            else _ = `Received RST_STREAM with code ${A.rstCode} triggered by internal client error: ${this.internalError.message}`;
                            break;
                        default:
                            O = Jw.Status.INTERNAL, _ = `Received RST_STREAM with code ${A.rstCode}`
                    }
                    this.endCall({
                        code: O,
                        details: _,
                        metadata: new jd.Metadata,
                        rstCode: A.rstCode
                    })
                })
            }), A.on("error", ($) => {
                if ($.code !== "ERR_HTTP2_STREAM_ERROR") this.trace("Node error event: message=" + $.message + " code=" + $.code + " errno=" + J$Y($.errno) + " syscall=" + $.syscall), this.internalError = $;
                this.callEventTracker.onStreamEnd(!1)
            })
        }
        getDeadlineInfo() {
            return [`remote_addr=${this.getPeer()}`]
        }
        onDisconnect() {
            this.connectionDropped = !0, setImmediate(() => {
                this.endCall({
                    code: Jw.Status.UNAVAILABLE,
                    details: "Connection dropped",
                    metadata: new jd.Metadata
                })
            })
        }
        outputStatus() {
            if (!this.statusOutput) this.statusOutput = !0, this.trace("ended with status: code=" + this.finalStatus.code + ' details="' + this.finalStatus.details + '"'), this.callEventTracker.onCallEnd(this.finalStatus), process.nextTick(() => {
                this.listener.onReceiveStatus(this.finalStatus)
            }), this.http2Stream.resume()
        }
        trace(A) {
            $$Y.trace(O$Y.LogVerbosity.DEBUG, _$Y, "[" + this.callId + "] " + A)
        }
        endCall(A) {
            if (this.finalStatus === null || this.finalStatus.code === Jw.Status.OK) this.finalStatus = A, this.maybeOutputStatus();
            this.destroyHttp2Stream()
        }
        maybeOutputStatus() {
            if (this.finalStatus !== null) {
                if (this.finalStatus.code !== Jw.Status.OK || this.readsClosed && this.unpushedReadMessages.length === 0 && !this.isReadFilterPending && !this.isPushPending) this.outputStatus()
            }
        }
        push(A) {
            this.trace("pushing to reader message of length " + (A instanceof Buffer ? A.length : null)), this.canPush = !1, this.isPushPending = !0, process.nextTick(() => {
                if (this.isPushPending = !1, this.statusOutput) return;
                this.listener.onReceiveMessage(A), this.maybeOutputStatus()
            })
        }
        tryPush(A) {
            if (this.canPush) this.http2Stream.pause(), this.push(A);
            else this.trace("unpushedReadMessages.push message of length " + A.length), this.unpushedReadMessages.push(A)
        }
        handleTrailers(A) {
            this.serverEndedCall = !0, this.callEventTracker.onStreamEnd(!0);
            let q = "";
            for (let w of Object.keys(A)) q += "\t\t" + w + ": " + A[w] + `
`;
            this.trace(`Received server trailers:
` + q);
            let K;
            try {
                K = jd.Metadata.fromHttp2Headers(A)
            } catch (w) {
                K = new jd.Metadata
            }
            let Y = K.getMap(),
                z;
            if (typeof Y["grpc-status"] === "string") {
                let w = Number(Y["grpc-status"]);
                this.trace("received status code " + w + " from server"), K.remove("grpc-status");
                let H = "";
                if (typeof Y["grpc-message"] === "string") {
                    try {
                        H = decodeURI(Y["grpc-message"])
                    } catch ($) {
                        H = Y["grpc-message"]
                    }
                    K.remove("grpc-message"), this.trace('received status details string "' + H + '" from server')
                }
                z = {
                    code: w,
                    details: H,
                    metadata: K
                }
            } else if (this.httpStatusCode) z = TVA(this.httpStatusCode), z.metadata = K;
            else z = {
                code: Jw.Status.UNKNOWN,
                details: "No status information received",
                metadata: K
            };
            this.endCall(z)
        }
        destroyHttp2Stream() {
            var A;
            if (this.http2Stream.destroyed) return;
            if (this.serverEndedCall) this.http2Stream.end();
            else {
                let q;
                if (((A = this.finalStatus) === null || A === void 0 ? void 0 : A.code) === Jw.Status.OK) q = Dd.constants.NGHTTP2_NO_ERROR;
                else q = Dd.constants.NGHTTP2_CANCEL;
                this.trace("close http2 stream with code " + q), this.http2Stream.close(q)
            }
        }
        cancelWithStatus(A, q) {
            this.trace("cancelWithStatus code: " + A + ' details: "' + q + '"'), this.endCall({
                code: A,
                details: q,
                metadata: new jd.Metadata
            })
        }
        getStatus() {
            return this.finalStatus
        }
        getPeer() {
            return this.transport.getPeerName()
        }
        getCallNumber() {
            return this.callId
        }
        getAuthContext() {
            return this.transport.getAuthContext()
        }
        startRead() {
            if (this.finalStatus !== null && this.finalStatus.code !== Jw.Status.OK) {
                this.readsClosed = !0, this.maybeOutputStatus();
                return
            }
            if (this.canPush = !0, this.unpushedReadMessages.length > 0) {
                let A = this.unpushedReadMessages.shift();
                this.push(A);
                return
            }
            this.http2Stream.resume()
        }
        sendMessageWithContext(A, q) {
            this.trace("write() called with message of length " + q.length);
            let K = (Y) => {
                process.nextTick(() => {
                    var z;
                    let w = Jw.Status.UNAVAILABLE;
                    if ((Y === null || Y === void 0 ? void 0 : Y.code) === "ERR_STREAM_WRITE_AFTER_END") w = Jw.Status.INTERNAL;
                    if (Y) this.cancelWithStatus(w, `Write error: ${Y.message}`);
                    (z = A.callback) === null || z === void 0 || z.call(A)
                })
            };
            this.trace("sending data chunk of length " + q.length), this.callEventTracker.addMessageSent();
            try {
                this.http2Stream.write(q, K)
            } catch (Y) {
                this.endCall({
                    code: Jw.Status.UNAVAILABLE,
                    details: `Write failed with error ${Y.message}`,
                    metadata: new jd.Metadata
                })
            }
        }
        halfClose() {
            this.trace("end() called"), this.trace("calling end() on HTTP/2 stream"), this.http2Stream.end()
        }
    }
    IV4.Http2SubchannelCall = hV4
})
// @from(Ln 295957, Col 4)
QV4 = R((mV4) => {
    Object.defineProperty(mV4, "__esModule", {
        value: !0
    });
    mV4.Http2SubchannelConnector = void 0;
    var I31 = h1("http2"),
        X$Y = h1("tls"),
        v06 = hs(),
        zF1 = w9(),
        D$Y = VVA(),
        wP1 = mw(),
        j$Y = lh(),
        E06 = $N(),
        vVA = mZ(),
        M$Y = h1("net"),
        P$Y = bV4(),
        W$Y = G06(),
        EVA = "transport",
        G$Y = "transport_flowctrl",
        Z$Y = FZA().version,
        {
            HTTP2_HEADER_AUTHORITY: f$Y,
            HTTP2_HEADER_CONTENT_TYPE: V$Y,
            HTTP2_HEADER_METHOD: N$Y,
            HTTP2_HEADER_PATH: T$Y,
            HTTP2_HEADER_TE: v$Y,
            HTTP2_HEADER_USER_AGENT: E$Y
        } = I31.constants,
        k$Y = 20000,
        L$Y = Buffer.from("too_many_pings", "ascii");
    class uV4 {
        constructor(A, q, K, Y) {
            if (this.session = A, this.options = K, this.remoteName = Y, this.keepaliveTimer = null, this.pendingSendKeepalivePing = !1, this.activeCalls = new Set, this.disconnectListeners = [], this.disconnectHandled = !1, this.channelzEnabled = !0, this.keepalivesSent = 0, this.messagesSent = 0, this.messagesReceived = 0, this.lastMessageSentTimestamp = null, this.lastMessageReceivedTimestamp = null, this.subchannelAddressString = (0, E06.subchannelAddressToString)(q), K["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.streamTracker = new v06.ChannelzCallTrackerStub;
            else this.streamTracker = new v06.ChannelzCallTracker;
            if (this.channelzRef = (0, v06.registerChannelzSocket)(this.subchannelAddressString, () => this.getChannelzInfo(), this.channelzEnabled), this.userAgent = [K["grpc.primary_user_agent"], `grpc-node-js/${Z$Y}`, K["grpc.secondary_user_agent"]].filter((z) => z).join(" "), "grpc.keepalive_time_ms" in K) this.keepaliveTimeMs = K["grpc.keepalive_time_ms"];
            else this.keepaliveTimeMs = -1;
            if ("grpc.keepalive_timeout_ms" in K) this.keepaliveTimeoutMs = K["grpc.keepalive_timeout_ms"];
            else this.keepaliveTimeoutMs = k$Y;
            if ("grpc.keepalive_permit_without_calls" in K) this.keepaliveWithoutCalls = K["grpc.keepalive_permit_without_calls"] === 1;
            else this.keepaliveWithoutCalls = !1;
            if (A.once("close", () => {
                    this.trace("session closed"), this.handleDisconnect()
                }), A.once("goaway", (z, w, H) => {
                    let $ = !1;
                    if (z === I31.constants.NGHTTP2_ENHANCE_YOUR_CALM && H && H.equals(L$Y)) $ = !0;
                    this.trace("connection closed by GOAWAY with code " + z + " and data " + (H === null || H === void 0 ? void 0 : H.toString())), this.reportDisconnectToOwner($)
                }), A.once("error", (z) => {
                    this.trace("connection closed with error " + z.message), this.handleDisconnect()
                }), A.socket.once("close", (z) => {
                    this.trace("connection closed. hadError=" + z), this.handleDisconnect()
                }), wP1.isTracerEnabled(EVA)) A.on("remoteSettings", (z) => {
                this.trace("new settings received" + (this.session !== A ? " on the old connection" : "") + ": " + JSON.stringify(z))
            }), A.on("localSettings", (z) => {
                this.trace("local settings acknowledged by remote" + (this.session !== A ? " on the old connection" : "") + ": " + JSON.stringify(z))
            });
            if (this.keepaliveWithoutCalls) this.maybeStartKeepalivePingTimer();
            if (A.socket instanceof X$Y.TLSSocket) this.authContext = {
                transportSecurityType: "ssl",
                sslPeerCertificate: A.socket.getPeerCertificate()
            };
            else this.authContext = {}
        }
        getChannelzInfo() {
            var A, q, K;
            let Y = this.session.socket,
                z = Y.remoteAddress ? (0, E06.stringToSubchannelAddress)(Y.remoteAddress, Y.remotePort) : null,
                w = Y.localAddress ? (0, E06.stringToSubchannelAddress)(Y.localAddress, Y.localPort) : null,
                H;
            if (this.session.encrypted) {
                let O = Y,
                    _ = O.getCipher(),
                    J = O.getCertificate(),
                    X = O.getPeerCertificate();
                H = {
                    cipherSuiteStandardName: (A = _.standardName) !== null && A !== void 0 ? A : null,
                    cipherSuiteOtherName: _.standardName ? null : _.name,
                    localCertificate: J && "raw" in J ? J.raw : null,
                    remoteCertificate: X && "raw" in X ? X.raw : null
                }
            } else H = null;
            return {
                remoteAddress: z,
                localAddress: w,
                security: H,
                remoteName: this.remoteName,
                streamsStarted: this.streamTracker.callsStarted,
                streamsSucceeded: this.streamTracker.callsSucceeded,
                streamsFailed: this.streamTracker.callsFailed,
                messagesSent: this.messagesSent,
                messagesReceived: this.messagesReceived,
                keepAlivesSent: this.keepalivesSent,
                lastLocalStreamCreatedTimestamp: this.streamTracker.lastCallStartedTimestamp,
                lastRemoteStreamCreatedTimestamp: null,
                lastMessageSentTimestamp: this.lastMessageSentTimestamp,
                lastMessageReceivedTimestamp: this.lastMessageReceivedTimestamp,
                localFlowControlWindow: (q = this.session.state.localWindowSize) !== null && q !== void 0 ? q : null,
                remoteFlowControlWindow: (K = this.session.state.remoteWindowSize) !== null && K !== void 0 ? K : null
            }
        }
        trace(A) {
            wP1.trace(zF1.LogVerbosity.DEBUG, EVA, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
        }
        keepaliveTrace(A) {
            wP1.trace(zF1.LogVerbosity.DEBUG, "keepalive", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
        }
        flowControlTrace(A) {
            wP1.trace(zF1.LogVerbosity.DEBUG, G$Y, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
        }
        internalsTrace(A) {
            wP1.trace(zF1.LogVerbosity.DEBUG, "transport_internals", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
        }
        reportDisconnectToOwner(A) {
            if (this.disconnectHandled) return;
            this.disconnectHandled = !0, this.disconnectListeners.forEach((q) => q(A))
        }
        handleDisconnect() {
            this.clearKeepaliveTimeout(), this.reportDisconnectToOwner(!1);
            for (let A of this.activeCalls) A.onDisconnect();
            setImmediate(() => {
                this.session.destroy()
            })
        }
        addDisconnectListener(A) {
            this.disconnectListeners.push(A)
        }
        canSendPing() {
            return !this.session.destroyed && this.keepaliveTimeMs > 0 && (this.keepaliveWithoutCalls || this.activeCalls.size > 0)
        }
        maybeSendPing() {
            var A, q;
            if (!this.canSendPing()) {
                this.pendingSendKeepalivePing = !0;
                return
            }
            if (this.keepaliveTimer) {
                console.error("keepaliveTimeout is not null");
                return
            }
            if (this.channelzEnabled) this.keepalivesSent += 1;
            this.keepaliveTrace("Sending ping with timeout " + this.keepaliveTimeoutMs + "ms"), this.keepaliveTimer = setTimeout(() => {
                this.keepaliveTimer = null, this.keepaliveTrace("Ping timeout passed without response"), this.handleDisconnect()
            }, this.keepaliveTimeoutMs), (q = (A = this.keepaliveTimer).unref) === null || q === void 0 || q.call(A);
            let K = "";
            try {
                if (!this.session.ping((z, w, H) => {
                        if (this.clearKeepaliveTimeout(), z) this.keepaliveTrace("Ping failed with error " + z.message), this.handleDisconnect();
                        else this.keepaliveTrace("Received ping response"), this.maybeStartKeepalivePingTimer()
                    })) K = "Ping returned false"
            } catch (Y) {
                K = (Y instanceof Error ? Y.message : "") || "Unknown error"
            }
            if (K) this.keepaliveTrace("Ping send failed: " + K), this.handleDisconnect()
        }
        maybeStartKeepalivePingTimer() {
            var A, q;
            if (!this.canSendPing()) return;
            if (this.pendingSendKeepalivePing) this.pendingSendKeepalivePing = !1, this.maybeSendPing();
            else if (!this.keepaliveTimer) this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), this.keepaliveTimer = setTimeout(() => {
                this.keepaliveTimer = null, this.maybeSendPing()
            }, this.keepaliveTimeMs), (q = (A = this.keepaliveTimer).unref) === null || q === void 0 || q.call(A)
        }
        clearKeepaliveTimeout() {
            if (this.keepaliveTimer) clearTimeout(this.keepaliveTimer), this.keepaliveTimer = null
        }
        removeActiveCall(A) {
            if (this.activeCalls.delete(A), this.activeCalls.size === 0) this.session.unref()
        }
        addActiveCall(A) {
            if (this.activeCalls.add(A), this.activeCalls.size === 1) {
                if (this.session.ref(), !this.keepaliveWithoutCalls) this.maybeStartKeepalivePingTimer()
            }
        }
        createCall(A, q, K, Y, z) {
            let w = A.toHttp2Headers();
            w[f$Y] = q, w[E$Y] = this.userAgent, w[V$Y] = "application/grpc", w[N$Y] = "POST", w[T$Y] = K, w[v$Y] = "trailers";
            let H;
            try {
                H = this.session.request(w)
            } catch (_) {
                throw this.handleDisconnect(), _
            }
            this.flowControlTrace("local window size: " + this.session.state.localWindowSize + " remote window size: " + this.session.state.remoteWindowSize), this.internalsTrace("session.closed=" + this.session.closed + " session.destroyed=" + this.session.destroyed + " session.socket.destroyed=" + this.session.socket.destroyed);
            let $, O;
            if (this.channelzEnabled) this.streamTracker.addCallStarted(), $ = {
                addMessageSent: () => {
                    var _;
                    this.messagesSent += 1, this.lastMessageSentTimestamp = new Date, (_ = z.addMessageSent) === null || _ === void 0 || _.call(z)
                },
                addMessageReceived: () => {
                    var _;
                    this.messagesReceived += 1, this.lastMessageReceivedTimestamp = new Date, (_ = z.addMessageReceived) === null || _ === void 0 || _.call(z)
                },
                onCallEnd: (_) => {
                    var J;
                    (J = z.onCallEnd) === null || J === void 0 || J.call(z, _), this.removeActiveCall(O)
                },
                onStreamEnd: (_) => {
                    var J;
                    if (_) this.streamTracker.addCallSucceeded();
                    else this.streamTracker.addCallFailed();
                    (J = z.onStreamEnd) === null || J === void 0 || J.call(z, _)
                }
            };
            else $ = {
                addMessageSent: () => {
                    var _;
                    (_ = z.addMessageSent) === null || _ === void 0 || _.call(z)
                },
                addMessageReceived: () => {
                    var _;
                    (_ = z.addMessageReceived) === null || _ === void 0 || _.call(z)
                },
                onCallEnd: (_) => {
                    var J;
                    (J = z.onCallEnd) === null || J === void 0 || J.call(z, _), this.removeActiveCall(O)
                },
                onStreamEnd: (_) => {
                    var J;
                    (J = z.onStreamEnd) === null || J === void 0 || J.call(z, _)
                }
            };
            return O = new P$Y.Http2SubchannelCall(H, $, Y, this, (0, W$Y.getNextCallNumber)()), this.addActiveCall(O), O
        }
        getChannelzRef() {
            return this.channelzRef
        }
        getPeerName() {
            return this.subchannelAddressString
        }
        getOptions() {
            return this.options
        }
        getAuthContext() {
            return this.authContext
        }
        shutdown() {
            this.session.close(), (0, v06.unregisterChannelzRef)(this.channelzRef)
        }
    }
    class BV4 {
        constructor(A) {
            this.channelTarget = A, this.session = null, this.isShutdown = !1
        }
        trace(A) {
            wP1.trace(zF1.LogVerbosity.DEBUG, EVA, (0, vVA.uriToString)(this.channelTarget) + " " + A)
        }
        createSession(A, q, K) {
            if (this.isShutdown) return Promise.reject();
            if (A.socket.closed) return Promise.reject("Connection closed before starting HTTP/2 handshake");
            return new Promise((Y, z) => {
                var w, H, $, O, _, J, X;
                let D = null,
                    j = this.channelTarget;
                if ("grpc.http_connect_target" in K) {
                    let B = (0, vVA.parseUri)(K["grpc.http_connect_target"]);
                    if (B) j = B, D = (0, vVA.uriToString)(B)
                }
                let M = A.secure ? "https" : "http",
                    P = (0, j$Y.getDefaultAuthority)(j),
                    W = () => {
                        var B;
                        (B = this.session) === null || B === void 0 || B.destroy(), this.session = null, setImmediate(() => {
                            if (!y) y = !0, z(`${k.trim()} (${new Date().toISOString()})`)
                        })
                    },
                    G = (B) => {
                        var S;
                        if ((S = this.session) === null || S === void 0 || S.destroy(), k = B.message, this.trace("connection failed with error " + k), !y) y = !0, z(`${k} (${new Date().toISOString()})`)
                    },
                    f = {
                        createConnection: (B, S) => {
                            return A.socket
                        },
                        settings: {
                            initialWindowSize: (O = (w = K["grpc-node.flow_control_window"]) !== null && w !== void 0 ? w : ($ = (H = I31.getDefaultSettings) === null || H === void 0 ? void 0 : H.call(I31)) === null || $ === void 0 ? void 0 : $.initialWindowSize) !== null && O !== void 0 ? O : 65535
                        }
                    },
                    Z = I31.connect(`${M}://${P}`, f),
                    N = (X = (J = (_ = I31.getDefaultSettings) === null || _ === void 0 ? void 0 : _.call(I31)) === null || J === void 0 ? void 0 : J.initialWindowSize) !== null && X !== void 0 ? X : 65535,
                    T = K["grpc-node.flow_control_window"];
                this.session = Z;
                let k = "Failed to connect",
                    y = !1;
                Z.unref(), Z.once("remoteSettings", () => {
                    var B;
                    if (T && T > N) try {
                        Z.setLocalWindowSize(T)
                    } catch (S) {
                        let m = T - ((B = Z.state.localWindowSize) !== null && B !== void 0 ? B : N);
                        if (m > 0) Z.incrementWindowSize(m)
                    }
                    Z.removeAllListeners(), A.socket.removeListener("close", W), A.socket.removeListener("error", G), Y(new uV4(Z, q, K, D)), this.session = null
                }), Z.once("close", W), Z.once("error", G), A.socket.once("close", W), A.socket.once("error", G)
            })
        }
        tcpConnect(A, q) {
            return (0, D$Y.getProxiedConnection)(A, q).then((K) => {
                if (K) return K;
                else return new Promise((Y, z) => {
                    let w = () => {
                            z(Error("Socket closed"))
                        },
                        H = (O) => {
                            z(O)
                        },
                        $ = M$Y.connect(A, () => {
                            $.removeListener("close", w), $.removeListener("error", H), Y($)
                        });
                    $.once("close", w), $.once("error", H)
                })
            })
        }
        async connect(A, q, K) {
            if (this.isShutdown) return Promise.reject();
            let Y = null,
                z = null,
                w = (0, E06.subchannelAddressToString)(A);
            try {
                return this.trace(w + " Waiting for secureConnector to be ready"), await q.waitForReady(), this.trace(w + " secureConnector is ready"), Y = await this.tcpConnect(A, K), Y.setNoDelay(), this.trace(w + " Established TCP connection"), z = await q.connect(Y), this.trace(w + " Established secure connection"), this.createSession(z, A, K)
            } catch (H) {
                throw Y === null || Y === void 0 || Y.destroy(), z === null || z === void 0 || z.socket.destroy(), H
            }
        }
        shutdown() {
            var A;
            this.isShutdown = !0, (A = this.session) === null || A === void 0 || A.close(), this.session = null
        }
    }
    mV4.Http2SubchannelConnector = BV4
})
// @from(Ln 296287, Col 4)
pV4 = R((gV4) => {
    Object.defineProperty(gV4, "__esModule", {
        value: !0
    });
    gV4.SubchannelPool = void 0;
    gV4.getSubchannelPool = b$Y;
    var R$Y = pW4(),
        y$Y = MV4(),
        C$Y = $N(),
        S$Y = mZ(),
        h$Y = QV4(),
        I$Y = 1e4;
    class k06 {
        constructor() {
            this.pool = Object.create(null), this.cleanupTimer = null
        }
        unrefUnusedSubchannels() {
            let A = !0;
            for (let q in this.pool) {
                let Y = this.pool[q].filter((z) => !z.subchannel.unrefIfOneRef());
                if (Y.length > 0) A = !1;
                this.pool[q] = Y
            }
            if (A && this.cleanupTimer !== null) clearInterval(this.cleanupTimer), this.cleanupTimer = null
        }
        ensureCleanupTask() {
            var A, q;
            if (this.cleanupTimer === null) this.cleanupTimer = setInterval(() => {
                this.unrefUnusedSubchannels()
            }, I$Y), (q = (A = this.cleanupTimer).unref) === null || q === void 0 || q.call(A)
        }
        getOrCreateSubchannel(A, q, K, Y) {
            this.ensureCleanupTask();
            let z = (0, S$Y.uriToString)(A);
            if (z in this.pool) {
                let H = this.pool[z];
                for (let $ of H)
                    if ((0, C$Y.subchannelAddressEqual)(q, $.subchannelAddress) && (0, R$Y.channelOptionsEqual)(K, $.channelArguments) && Y._equals($.channelCredentials)) return $.subchannel
            }
            let w = new y$Y.Subchannel(A, q, K, Y, new h$Y.Http2SubchannelConnector(A));
            if (!(z in this.pool)) this.pool[z] = [];
            return this.pool[z].push({
                subchannelAddress: q,
                channelArguments: K,
                channelCredentials: Y,
                subchannel: w
            }), w.ref(), w
        }
    }
    gV4.SubchannelPool = k06;
    var x$Y = new k06;

    function b$Y(A) {
        if (A) return x$Y;
        else return new k06
    }
})
// @from(Ln 296344, Col 4)
rV4 = R((iV4) => {
    Object.defineProperty(iV4, "__esModule", {
        value: !0
    });
    iV4.LoadBalancingCall = void 0;
    var dV4 = FZ(),
        L06 = w9(),
        cV4 = qP1(),
        R06 = Jj(),
        wF1 = zd(),
        B$Y = mZ(),
        m$Y = mw(),
        kVA = em1(),
        F$Y = h1("http2"),
        Q$Y = "load_balancing_call";
    class lV4 {
        constructor(A, q, K, Y, z, w, H) {
            var $, O;
            this.channel = A, this.callConfig = q, this.methodName = K, this.host = Y, this.credentials = z, this.deadline = w, this.callNumber = H, this.child = null, this.readPending = !1, this.pendingMessage = null, this.pendingHalfClose = !1, this.ended = !1, this.metadata = null, this.listener = null, this.onCallEnded = null, this.childStartTime = null;
            let _ = this.methodName.split("/"),
                J = "";
            if (_.length >= 2) J = _[1];
            let X = (O = ($ = (0, B$Y.splitHostPort)(this.host)) === null || $ === void 0 ? void 0 : $.host) !== null && O !== void 0 ? O : "localhost";
            this.serviceUrl = `https://${X}/${J}`, this.startTime = new Date
        }
        getDeadlineInfo() {
            var A, q;
            let K = [];
            if (this.childStartTime) {
                if (this.childStartTime > this.startTime) {
                    if ((A = this.metadata) === null || A === void 0 ? void 0 : A.getOptions().waitForReady) K.push("wait_for_ready");
                    K.push(`LB pick: ${(0,cV4.formatDateDifference)(this.startTime,this.childStartTime)}`)
                }
                return K.push(...this.child.getDeadlineInfo()), K
            } else {
                if ((q = this.metadata) === null || q === void 0 ? void 0 : q.getOptions().waitForReady) K.push("wait_for_ready");
                K.push("Waiting for LB pick")
            }
            return K
        }
        trace(A) {
            m$Y.trace(L06.LogVerbosity.DEBUG, Q$Y, "[" + this.callNumber + "] " + A)
        }
        outputStatus(A, q) {
            var K, Y;
            if (!this.ended) {
                this.ended = !0, this.trace("ended with status: code=" + A.code + ' details="' + A.details + '" start time=' + this.startTime.toISOString());
                let z = Object.assign(Object.assign({}, A), {
                    progress: q
                });
                (K = this.listener) === null || K === void 0 || K.onReceiveStatus(z), (Y = this.onCallEnded) === null || Y === void 0 || Y.call(this, z.code, z.details, z.metadata)
            }
        }
        doPick() {
            var A, q;
            if (this.ended) return;
            if (!this.metadata) throw Error("doPick called before start");
            this.trace("Pick called");
            let K = this.metadata.clone(),
                Y = this.channel.doPick(K, this.callConfig.pickInformation),
                z = Y.subchannel ? "(" + Y.subchannel.getChannelzRef().id + ") " + Y.subchannel.getAddress() : "" + Y.subchannel;
            switch (this.trace("Pick result: " + wF1.PickResultType[Y.pickResultType] + " subchannel: " + z + " status: " + ((A = Y.status) === null || A === void 0 ? void 0 : A.code) + " " + ((q = Y.status) === null || q === void 0 ? void 0 : q.details)), Y.pickResultType) {
                case wF1.PickResultType.COMPLETE:
                    this.credentials.compose(Y.subchannel.getCallCredentials()).generateMetadata({
                        method_name: this.methodName,
                        service_url: this.serviceUrl
                    }).then((O) => {
                        var _;
                        if (this.ended) {
                            this.trace("Credentials metadata generation finished after call ended");
                            return
                        }
                        if (K.merge(O), K.get("authorization").length > 1) this.outputStatus({
                            code: L06.Status.INTERNAL,
                            details: '"authorization" metadata cannot have multiple values',
                            metadata: new R06.Metadata
                        }, "PROCESSED");
                        if (Y.subchannel.getConnectivityState() !== dV4.ConnectivityState.READY) {
                            this.trace("Picked subchannel " + z + " has state " + dV4.ConnectivityState[Y.subchannel.getConnectivityState()] + " after getting credentials metadata. Retrying pick"), this.doPick();
                            return
                        }
                        if (this.deadline !== 1 / 0) K.set("grpc-timeout", (0, cV4.getDeadlineTimeoutString)(this.deadline));
                        try {
                            this.child = Y.subchannel.getRealSubchannel().createCall(K, this.host, this.methodName, {
                                onReceiveMetadata: (J) => {
                                    this.trace("Received metadata"), this.listener.onReceiveMetadata(J)
                                },
                                onReceiveMessage: (J) => {
                                    this.trace("Received message"), this.listener.onReceiveMessage(J)
                                },
                                onReceiveStatus: (J) => {
                                    if (this.trace("Received status"), J.rstCode === F$Y.constants.NGHTTP2_REFUSED_STREAM) this.outputStatus(J, "REFUSED");
                                    else this.outputStatus(J, "PROCESSED")
                                }
                            }), this.childStartTime = new Date
                        } catch (J) {
                            this.trace("Failed to start call on picked subchannel " + z + " with error " + J.message), this.outputStatus({
                                code: L06.Status.INTERNAL,
                                details: "Failed to start HTTP/2 stream with error " + J.message,
                                metadata: new R06.Metadata
                            }, "NOT_STARTED");
                            return
                        }
                        if ((_ = Y.onCallStarted) === null || _ === void 0 || _.call(Y), this.onCallEnded = Y.onCallEnded, this.trace("Created child call [" + this.child.getCallNumber() + "]"), this.readPending) this.child.startRead();
                        if (this.pendingMessage) this.child.sendMessageWithContext(this.pendingMessage.context, this.pendingMessage.message);
                        if (this.pendingHalfClose) this.child.halfClose()
                    }, (O) => {
                        let {
                            code: _,
                            details: J
                        } = (0, kVA.restrictControlPlaneStatusCode)(typeof O.code === "number" ? O.code : L06.Status.UNKNOWN, `Getting metadata from plugin failed with error: ${O.message}`);
                        this.outputStatus({
                            code: _,
                            details: J,
                            metadata: new R06.Metadata
                        }, "PROCESSED")
                    });
                    break;
                case wF1.PickResultType.DROP:
                    let {
                        code: H, details: $
                    } = (0, kVA.restrictControlPlaneStatusCode)(Y.status.code, Y.status.details);
                    setImmediate(() => {
                        this.outputStatus({
                            code: H,
                            details: $,
                            metadata: Y.status.metadata
                        }, "DROP")
                    });
                    break;
                case wF1.PickResultType.TRANSIENT_FAILURE:
                    if (this.metadata.getOptions().waitForReady) this.channel.queueCallForPick(this);
                    else {
                        let {
                            code: O,
                            details: _
                        } = (0, kVA.restrictControlPlaneStatusCode)(Y.status.code, Y.status.details);
                        setImmediate(() => {
                            this.outputStatus({
                                code: O,
                                details: _,
                                metadata: Y.status.metadata
                            }, "PROCESSED")
                        })
                    }
                    break;
                case wF1.PickResultType.QUEUE:
                    this.channel.queueCallForPick(this)
            }
        }
        cancelWithStatus(A, q) {
            var K;
            this.trace("cancelWithStatus code: " + A + ' details: "' + q + '"'), (K = this.child) === null || K === void 0 || K.cancelWithStatus(A, q), this.outputStatus({
                code: A,
                details: q,
                metadata: new R06.Metadata
            }, "PROCESSED")
        }
        getPeer() {
            var A, q;
            return (q = (A = this.child) === null || A === void 0 ? void 0 : A.getPeer()) !== null && q !== void 0 ? q : this.channel.getTarget()
        }
        start(A, q) {
            this.trace("start called"), this.listener = q, this.metadata = A, this.doPick()
        }
        sendMessageWithContext(A, q) {
            if (this.trace("write() called with message of length " + q.length), this.child) this.child.sendMessageWithContext(A, q);
            else this.pendingMessage = {
                context: A,
                message: q
            }
        }
        startRead() {
            if (this.trace("startRead called"), this.child) this.child.startRead();
            else this.readPending = !0
        }
        halfClose() {
            if (this.trace("halfClose called"), this.child) this.child.halfClose();
            else this.pendingHalfClose = !0
        }
        setCredentials(A) {
            throw Error("Method not implemented.")
        }
        getCallNumber() {
            return this.callNumber
        }
        getAuthContext() {
            if (this.child) return this.child.getAuthContext();
            else return null
        }
    }
    iV4.LoadBalancingCall = lV4
})
// @from(Ln 296537, Col 4)
eV4 = R((sV4) => {
    Object.defineProperty(sV4, "__esModule", {
        value: !0
    });
    sV4.ResolvingCall = void 0;
    var g$Y = SD6(),
        x31 = w9(),
        b31 = qP1(),
        oV4 = Jj(),
        U$Y = mw(),
        p$Y = em1(),
        d$Y = "resolving_call";
    class aV4 {
        constructor(A, q, K, Y, z) {
            if (this.channel = A, this.method = q, this.filterStackFactory = Y, this.callNumber = z, this.child = null, this.readPending = !1, this.pendingMessage = null, this.pendingHalfClose = !1, this.ended = !1, this.readFilterPending = !1, this.writeFilterPending = !1, this.pendingChildStatus = null, this.metadata = null, this.listener = null, this.statusWatchers = [], this.deadlineTimer = setTimeout(() => {}, 0), this.filterStack = null, this.deadlineStartTime = null, this.configReceivedTime = null, this.childStartTime = null, this.credentials = g$Y.CallCredentials.createEmpty(), this.deadline = K.deadline, this.host = K.host, K.parentCall) {
                if (K.flags & x31.Propagate.CANCELLATION) K.parentCall.on("cancelled", () => {
                    this.cancelWithStatus(x31.Status.CANCELLED, "Cancelled by parent call")
                });
                if (K.flags & x31.Propagate.DEADLINE) this.trace("Propagating deadline from parent: " + K.parentCall.getDeadline()), this.deadline = (0, b31.minDeadline)(this.deadline, K.parentCall.getDeadline())
            }
            this.trace("Created"), this.runDeadlineTimer()
        }
        trace(A) {
            U$Y.trace(x31.LogVerbosity.DEBUG, d$Y, "[" + this.callNumber + "] " + A)
        }
        runDeadlineTimer() {
            clearTimeout(this.deadlineTimer), this.deadlineStartTime = new Date, this.trace("Deadline: " + (0, b31.deadlineToString)(this.deadline));
            let A = (0, b31.getRelativeTimeout)(this.deadline);
            if (A !== 1 / 0) {
                this.trace("Deadline will be reached in " + A + "ms");
                let q = () => {
                    if (!this.deadlineStartTime) {
                        this.cancelWithStatus(x31.Status.DEADLINE_EXCEEDED, "Deadline exceeded");
                        return
                    }
                    let K = [],
                        Y = new Date;
                    if (K.push(`Deadline exceeded after ${(0,b31.formatDateDifference)(this.deadlineStartTime,Y)}`), this.configReceivedTime) {
                        if (this.configReceivedTime > this.deadlineStartTime) K.push(`name resolution: ${(0,b31.formatDateDifference)(this.deadlineStartTime,this.configReceivedTime)}`);
                        if (this.childStartTime) {
                            if (this.childStartTime > this.configReceivedTime) K.push(`metadata filters: ${(0,b31.formatDateDifference)(this.configReceivedTime,this.childStartTime)}`)
                        } else K.push("waiting for metadata filters")
                    } else K.push("waiting for name resolution");
                    if (this.child) K.push(...this.child.getDeadlineInfo());
                    this.cancelWithStatus(x31.Status.DEADLINE_EXCEEDED, K.join(","))
                };
                if (A <= 0) process.nextTick(q);
                else this.deadlineTimer = setTimeout(q, A)
            }
        }
        outputStatus(A) {
            if (!this.ended) {
                if (this.ended = !0, !this.filterStack) this.filterStack = this.filterStackFactory.createFilter();
                clearTimeout(this.deadlineTimer);
                let q = this.filterStack.receiveTrailers(A);
                this.trace("ended with status: code=" + q.code + ' details="' + q.details + '"'), this.statusWatchers.forEach((K) => K(q)), process.nextTick(() => {
                    var K;
                    (K = this.listener) === null || K === void 0 || K.onReceiveStatus(q)
                })
            }
        }
        sendMessageOnChild(A, q) {
            if (!this.child) throw Error("sendMessageonChild called with child not populated");
            let K = this.child;
            this.writeFilterPending = !0, this.filterStack.sendMessage(Promise.resolve({
                message: q,
                flags: A.flags
            })).then((Y) => {
                if (this.writeFilterPending = !1, K.sendMessageWithContext(A, Y.message), this.pendingHalfClose) K.halfClose()
            }, (Y) => {
                this.cancelWithStatus(Y.code, Y.details)
            })
        }
        getConfig() {
            if (this.ended) return;
            if (!this.metadata || !this.listener) throw Error("getConfig called before start");
            let A = this.channel.getConfig(this.method, this.metadata);
            if (A.type === "NONE") {
                this.channel.queueCallForConfig(this);
                return
            } else if (A.type === "ERROR") {
                if (this.metadata.getOptions().waitForReady) this.channel.queueCallForConfig(this);
                else this.outputStatus(A.error);
                return
            }
            this.configReceivedTime = new Date;
            let q = A.config;
            if (q.status !== x31.Status.OK) {
                let {
                    code: K,
                    details: Y
                } = (0, p$Y.restrictControlPlaneStatusCode)(q.status, "Failed to route call to method " + this.method);
                this.outputStatus({
                    code: K,
                    details: Y,
                    metadata: new oV4.Metadata
                });
                return
            }
            if (q.methodConfig.timeout) {
                let K = new Date;
                K.setSeconds(K.getSeconds() + q.methodConfig.timeout.seconds), K.setMilliseconds(K.getMilliseconds() + q.methodConfig.timeout.nanos / 1e6), this.deadline = (0, b31.minDeadline)(this.deadline, K), this.runDeadlineTimer()
            }
            this.filterStackFactory.push(q.dynamicFilterFactories), this.filterStack = this.filterStackFactory.createFilter(), this.filterStack.sendMetadata(Promise.resolve(this.metadata)).then((K) => {
                if (this.child = this.channel.createRetryingCall(q, this.method, this.host, this.credentials, this.deadline), this.trace("Created child [" + this.child.getCallNumber() + "]"), this.childStartTime = new Date, this.child.start(K, {
                        onReceiveMetadata: (Y) => {
                            this.trace("Received metadata"), this.listener.onReceiveMetadata(this.filterStack.receiveMetadata(Y))
                        },
                        onReceiveMessage: (Y) => {
                            this.trace("Received message"), this.readFilterPending = !0, this.filterStack.receiveMessage(Y).then((z) => {
                                if (this.trace("Finished filtering received message"), this.readFilterPending = !1, this.listener.onReceiveMessage(z), this.pendingChildStatus) this.outputStatus(this.pendingChildStatus)
                            }, (z) => {
                                this.cancelWithStatus(z.code, z.details)
                            })
                        },
                        onReceiveStatus: (Y) => {
                            if (this.trace("Received status"), this.readFilterPending) this.pendingChildStatus = Y;
                            else this.outputStatus(Y)
                        }
                    }), this.readPending) this.child.startRead();
                if (this.pendingMessage) this.sendMessageOnChild(this.pendingMessage.context, this.pendingMessage.message);
                else if (this.pendingHalfClose) this.child.halfClose()
            }, (K) => {
                this.outputStatus(K)
            })
        }
        reportResolverError(A) {
            var q;
            if ((q = this.metadata) === null || q === void 0 ? void 0 : q.getOptions().waitForReady) this.channel.queueCallForConfig(this);
            else this.outputStatus(A)
        }
        cancelWithStatus(A, q) {
            var K;
            this.trace("cancelWithStatus code: " + A + ' details: "' + q + '"'), (K = this.child) === null || K === void 0 || K.cancelWithStatus(A, q), this.outputStatus({
                code: A,
                details: q,
                metadata: new oV4.Metadata
            })
        }
        getPeer() {
            var A, q;
            return (q = (A = this.child) === null || A === void 0 ? void 0 : A.getPeer()) !== null && q !== void 0 ? q : this.channel.getTarget()
        }
        start(A, q) {
            this.trace("start called"), this.metadata = A.clone(), this.listener = q, this.getConfig()
        }
        sendMessageWithContext(A, q) {
            if (this.trace("write() called with message of length " + q.length), this.child) this.sendMessageOnChild(A, q);
            else this.pendingMessage = {
                context: A,
                message: q
            }
        }
        startRead() {
            if (this.trace("startRead called"), this.child) this.child.startRead();
            else this.readPending = !0
        }
        halfClose() {
            if (this.trace("halfClose called"), this.child && !this.writeFilterPending) this.child.halfClose();
            else this.pendingHalfClose = !0
        }
        setCredentials(A) {
            this.credentials = A
        }
        addStatusWatcher(A) {
            this.statusWatchers.push(A)
        }
        getCallNumber() {
            return this.callNumber
        }
        getAuthContext() {
            if (this.child) return this.child.getAuthContext();
            else return null
        }
    }
    sV4.ResolvingCall = aV4
})
// @from(Ln 296714, Col 4)
wN4 = R((YN4) => {
    Object.defineProperty(YN4, "__esModule", {
        value: !0
    });
    YN4.RetryingCall = YN4.MessageBufferTracker = YN4.RetryThrottler = void 0;
    var y06 = w9(),
        c$Y = qP1(),
        l$Y = Jj(),
        i$Y = mw(),
        n$Y = "retrying_call";
    class AN4 {
        constructor(A, q, K) {
            if (this.maxTokens = A, this.tokenRatio = q, K) this.tokens = K.tokens * (A / K.maxTokens);
            else this.tokens = A
        }
        addCallSucceeded() {
            this.tokens = Math.min(this.tokens + this.tokenRatio, this.maxTokens)
        }
        addCallFailed() {
            this.tokens = Math.max(this.tokens - 1, 0)
        }
        canRetryCall() {
            return this.tokens > this.maxTokens / 2
        }
    }
    YN4.RetryThrottler = AN4;
    class qN4 {
        constructor(A, q) {
            this.totalLimit = A, this.limitPerCall = q, this.totalAllocated = 0, this.allocatedPerCall = new Map
        }
        allocate(A, q) {
            var K;
            let Y = (K = this.allocatedPerCall.get(q)) !== null && K !== void 0 ? K : 0;
            if (this.limitPerCall - Y < A || this.totalLimit - this.totalAllocated < A) return !1;
            return this.allocatedPerCall.set(q, Y + A), this.totalAllocated += A, !0
        }
        free(A, q) {
            var K;
            if (this.totalAllocated < A) throw Error(`Invalid buffer allocation state: call ${q} freed ${A} > total allocated ${this.totalAllocated}`);
            this.totalAllocated -= A;
            let Y = (K = this.allocatedPerCall.get(q)) !== null && K !== void 0 ? K : 0;
            if (Y < A) throw Error(`Invalid buffer allocation state: call ${q} freed ${A} > allocated for call ${Y}`);
            this.allocatedPerCall.set(q, Y - A)
        }
        freeAll(A) {
            var q;
            let K = (q = this.allocatedPerCall.get(A)) !== null && q !== void 0 ? q : 0;
            if (this.totalAllocated < K) throw Error(`Invalid buffer allocation state: call ${A} allocated ${K} > total allocated ${this.totalAllocated}`);
            this.totalAllocated -= K, this.allocatedPerCall.delete(A)
        }
    }
    YN4.MessageBufferTracker = qN4;
    var LVA = "grpc-previous-rpc-attempts",
        r$Y = 5;
    class KN4 {
        constructor(A, q, K, Y, z, w, H, $, O) {
            var _;
            this.channel = A, this.callConfig = q, this.methodName = K, this.host = Y, this.credentials = z, this.deadline = w, this.callNumber = H, this.bufferTracker = $, this.retryThrottler = O, this.listener = null, this.initialMetadata = null, this.underlyingCalls = [], this.writeBuffer = [], this.writeBufferOffset = 0, this.readStarted = !1, this.transparentRetryUsed = !1, this.attempts = 0, this.hedgingTimer = null, this.committedCallIndex = null, this.initialRetryBackoffSec = 0, this.nextRetryBackoffSec = 0;
            let J = (_ = A.getOptions()["grpc-node.retry_max_attempts_limit"]) !== null && _ !== void 0 ? _ : r$Y;
            if (A.getOptions()["grpc.enable_retries"] === 0) this.state = "NO_RETRY", this.maxAttempts = 1;
            else if (q.methodConfig.retryPolicy) {
                this.state = "RETRY";
                let X = q.methodConfig.retryPolicy;
                this.nextRetryBackoffSec = this.initialRetryBackoffSec = Number(X.initialBackoff.substring(0, X.initialBackoff.length - 1)), this.maxAttempts = Math.min(X.maxAttempts, J)
            } else if (q.methodConfig.hedgingPolicy) this.state = "HEDGING", this.maxAttempts = Math.min(q.methodConfig.hedgingPolicy.maxAttempts, J);
            else this.state = "TRANSPARENT_ONLY", this.maxAttempts = 1;
            this.startTime = new Date
        }
        getDeadlineInfo() {
            if (this.underlyingCalls.length === 0) return [];
            let A = [],
                q = this.underlyingCalls[this.underlyingCalls.length - 1];
            if (this.underlyingCalls.length > 1) A.push(`previous attempts: ${this.underlyingCalls.length-1}`);
            if (q.startTime > this.startTime) A.push(`time to current attempt start: ${(0,c$Y.formatDateDifference)(this.startTime,q.startTime)}`);
            return A.push(...q.call.getDeadlineInfo()), A
        }
        getCallNumber() {
            return this.callNumber
        }
        trace(A) {
            i$Y.trace(y06.LogVerbosity.DEBUG, n$Y, "[" + this.callNumber + "] " + A)
        }
        reportStatus(A) {
            this.trace("ended with status: code=" + A.code + ' details="' + A.details + '" start time=' + this.startTime.toISOString()), this.bufferTracker.freeAll(this.callNumber), this.writeBufferOffset = this.writeBufferOffset + this.writeBuffer.length, this.writeBuffer = [], process.nextTick(() => {
                var q;
                (q = this.listener) === null || q === void 0 || q.onReceiveStatus({
                    code: A.code,
                    details: A.details,
                    metadata: A.metadata
                })
            })
        }
        cancelWithStatus(A, q) {
            this.trace("cancelWithStatus code: " + A + ' details: "' + q + '"'), this.reportStatus({
                code: A,
                details: q,
                metadata: new l$Y.Metadata
            });
            for (let {
                    call: K
                }
                of this.underlyingCalls) K.cancelWithStatus(A, q)
        }
        getPeer() {
            if (this.committedCallIndex !== null) return this.underlyingCalls[this.committedCallIndex].call.getPeer();
            else return "unknown"
        }
        getBufferEntry(A) {
            var q;
            return (q = this.writeBuffer[A - this.writeBufferOffset]) !== null && q !== void 0 ? q : {
                entryType: "FREED",
                allocated: !1
            }
        }
        getNextBufferIndex() {
            return this.writeBufferOffset + this.writeBuffer.length
        }
        clearSentMessages() {
            if (this.state !== "COMMITTED") return;
            let A;
            if (this.underlyingCalls[this.committedCallIndex].state === "COMPLETED") A = this.getNextBufferIndex();
            else A = this.underlyingCalls[this.committedCallIndex].nextMessageToSend;
            for (let q = this.writeBufferOffset; q < A; q++) {
                let K = this.getBufferEntry(q);
                if (K.allocated) this.bufferTracker.free(K.message.message.length, this.callNumber)
            }
            this.writeBuffer = this.writeBuffer.slice(A - this.writeBufferOffset), this.writeBufferOffset = A
        }
        commitCall(A) {
            var q, K;
            if (this.state === "COMMITTED") return;
            this.trace("Committing call [" + this.underlyingCalls[A].call.getCallNumber() + "] at index " + A), this.state = "COMMITTED", (K = (q = this.callConfig).onCommitted) === null || K === void 0 || K.call(q), this.committedCallIndex = A;
            for (let Y = 0; Y < this.underlyingCalls.length; Y++) {
                if (Y === A) continue;
                if (this.underlyingCalls[Y].state === "COMPLETED") continue;
                this.underlyingCalls[Y].state = "COMPLETED", this.underlyingCalls[Y].call.cancelWithStatus(y06.Status.CANCELLED, "Discarded in favor of other hedged attempt")
            }
            this.clearSentMessages()
        }
        commitCallWithMostMessages() {
            if (this.state === "COMMITTED") return;
            let A = -1,
                q = -1;
            for (let [K, Y] of this.underlyingCalls.entries())
                if (Y.state === "ACTIVE" && Y.nextMessageToSend > A) A = Y.nextMessageToSend, q = K;
            if (q === -1) this.state = "TRANSPARENT_ONLY";
            else this.commitCall(q)
        }
        isStatusCodeInList(A, q) {
            return A.some((K) => {
                var Y;
                return K === q || K.toString().toLowerCase() === ((Y = y06.Status[q]) === null || Y === void 0 ? void 0 : Y.toLowerCase())
            })
        }
        getNextRetryJitter() {
            return Math.random() * 0.3999999999999999 + 0.8
        }
        getNextRetryBackoffMs() {
            var A;
            let q = (A = this.callConfig) === null || A === void 0 ? void 0 : A.methodConfig.retryPolicy;
            if (!q) return 0;
            let Y = this.getNextRetryJitter() * this.nextRetryBackoffSec * 1000,
                z = Number(q.maxBackoff.substring(0, q.maxBackoff.length - 1));
            return this.nextRetryBackoffSec = Math.min(this.nextRetryBackoffSec * q.backoffMultiplier, z), Y
        }
        maybeRetryCall(A, q) {
            if (this.state !== "RETRY") {
                q(!1);
                return
            }
            if (this.attempts >= this.maxAttempts) {
                q(!1);
                return
            }
            let K;
            if (A === null) K = this.getNextRetryBackoffMs();
            else if (A < 0) {
                this.state = "TRANSPARENT_ONLY", q(!1);
                return
            } else K = A, this.nextRetryBackoffSec = this.initialRetryBackoffSec;
            setTimeout(() => {
                var Y, z;
                if (this.state !== "RETRY") {
                    q(!1);
                    return
                }
                if ((z = (Y = this.retryThrottler) === null || Y === void 0 ? void 0 : Y.canRetryCall()) !== null && z !== void 0 ? z : !0) q(!0), this.attempts += 1, this.startNewAttempt();
                else this.trace("Retry attempt denied by throttling policy"), q(!1)
            }, K)
        }
        countActiveCalls() {
            let A = 0;
            for (let q of this.underlyingCalls)
                if ((q === null || q === void 0 ? void 0 : q.state) === "ACTIVE") A += 1;
            return A
        }
        handleProcessedStatus(A, q, K) {
            var Y, z, w;
            switch (this.state) {
                case "COMMITTED":
                case "NO_RETRY":
                case "TRANSPARENT_ONLY":
                    this.commitCall(q), this.reportStatus(A);
                    break;
                case "HEDGING":
                    if (this.isStatusCodeInList((Y = this.callConfig.methodConfig.hedgingPolicy.nonFatalStatusCodes) !== null && Y !== void 0 ? Y : [], A.code)) {
                        (z = this.retryThrottler) === null || z === void 0 || z.addCallFailed();
                        let H;
                        if (K === null) H = 0;
                        else if (K < 0) {
                            this.state = "TRANSPARENT_ONLY", this.commitCall(q), this.reportStatus(A);
                            return
                        } else H = K;
                        setTimeout(() => {
                            if (this.maybeStartHedgingAttempt(), this.countActiveCalls() === 0) this.commitCall(q), this.reportStatus(A)
                        }, H)
                    } else this.commitCall(q), this.reportStatus(A);
                    break;
                case "RETRY":
                    if (this.isStatusCodeInList(this.callConfig.methodConfig.retryPolicy.retryableStatusCodes, A.code))(w = this.retryThrottler) === null || w === void 0 || w.addCallFailed(), this.maybeRetryCall(K, (H) => {
                        if (!H) this.commitCall(q), this.reportStatus(A)
                    });
                    else this.commitCall(q), this.reportStatus(A);
                    break
            }
        }
        getPushback(A) {
            let q = A.get("grpc-retry-pushback-ms");
            if (q.length === 0) return null;
            try {
                return parseInt(q[0])
            } catch (K) {
                return -1
            }
        }
        handleChildStatus(A, q) {
            var K;
            if (this.underlyingCalls[q].state === "COMPLETED") return;
            if (this.trace("state=" + this.state + " handling status with progress " + A.progress + " from child [" + this.underlyingCalls[q].call.getCallNumber() + "] in state " + this.underlyingCalls[q].state), this.underlyingCalls[q].state = "COMPLETED", A.code === y06.Status.OK) {
                (K = this.retryThrottler) === null || K === void 0 || K.addCallSucceeded(), this.commitCall(q), this.reportStatus(A);
                return
            }
            if (this.state === "NO_RETRY") {
                this.commitCall(q), this.reportStatus(A);
                return
            }
            if (this.state === "COMMITTED") {
                this.reportStatus(A);
                return
            }
            let Y = this.getPushback(A.metadata);
            switch (A.progress) {
                case "NOT_STARTED":
                    this.startNewAttempt();
                    break;
                case "REFUSED":
                    if (this.transparentRetryUsed) this.handleProcessedStatus(A, q, Y);
                    else this.transparentRetryUsed = !0, this.startNewAttempt();
                    break;
                case "DROP":
                    this.commitCall(q), this.reportStatus(A);
                    break;
                case "PROCESSED":
                    this.handleProcessedStatus(A, q, Y);
                    break
            }
        }
        maybeStartHedgingAttempt() {
            if (this.state !== "HEDGING") return;
            if (!this.callConfig.methodConfig.hedgingPolicy) return;
            if (this.attempts >= this.maxAttempts) return;
            this.attempts += 1, this.startNewAttempt(), this.maybeStartHedgingTimer()
        }
        maybeStartHedgingTimer() {
            var A, q, K;
            if (this.hedgingTimer) clearTimeout(this.hedgingTimer);
            if (this.state !== "HEDGING") return;
            if (!this.callConfig.methodConfig.hedgingPolicy) return;
            let Y = this.callConfig.methodConfig.hedgingPolicy;
            if (this.attempts >= this.maxAttempts) return;
            let z = (A = Y.hedgingDelay) !== null && A !== void 0 ? A : "0s",
                w = Number(z.substring(0, z.length - 1));
            this.hedgingTimer = setTimeout(() => {
                this.maybeStartHedgingAttempt()
            }, w * 1000), (K = (q = this.hedgingTimer).unref) === null || K === void 0 || K.call(q)
        }
        startNewAttempt() {
            let A = this.channel.createLoadBalancingCall(this.callConfig, this.methodName, this.host, this.credentials, this.deadline);
            this.trace("Created child call [" + A.getCallNumber() + "] for attempt " + this.attempts);
            let q = this.underlyingCalls.length;
            this.underlyingCalls.push({
                state: "ACTIVE",
                call: A,
                nextMessageToSend: 0,
                startTime: new Date
            });
            let K = this.attempts - 1,
                Y = this.initialMetadata.clone();
            if (K > 0) Y.set(LVA, `${K}`);
            let z = !1;
            if (A.start(Y, {
                    onReceiveMetadata: (w) => {
                        if (this.trace("Received metadata from child [" + A.getCallNumber() + "]"), this.commitCall(q), z = !0, K > 0) w.set(LVA, `${K}`);
                        if (this.underlyingCalls[q].state === "ACTIVE") this.listener.onReceiveMetadata(w)
                    },
                    onReceiveMessage: (w) => {
                        if (this.trace("Received message from child [" + A.getCallNumber() + "]"), this.commitCall(q), this.underlyingCalls[q].state === "ACTIVE") this.listener.onReceiveMessage(w)
                    },
                    onReceiveStatus: (w) => {
                        if (this.trace("Received status from child [" + A.getCallNumber() + "]"), !z && K > 0) w.metadata.set(LVA, `${K}`);
                        this.handleChildStatus(w, q)
                    }
                }), this.sendNextChildMessage(q), this.readStarted) A.startRead()
        }
        start(A, q) {
            this.trace("start called"), this.listener = q, this.initialMetadata = A, this.attempts += 1, this.startNewAttempt(), this.maybeStartHedgingTimer()
        }
        handleChildWriteCompleted(A) {
            var q, K;
            let Y = this.underlyingCalls[A],
                z = Y.nextMessageToSend;
            (K = (q = this.getBufferEntry(z)).callback) === null || K === void 0 || K.call(q), this.clearSentMessages(), Y.nextMessageToSend += 1, this.sendNextChildMessage(A)
        }
        sendNextChildMessage(A) {
            let q = this.underlyingCalls[A];
            if (q.state === "COMPLETED") return;
            if (this.getBufferEntry(q.nextMessageToSend)) {
                let K = this.getBufferEntry(q.nextMessageToSend);
                switch (K.entryType) {
                    case "MESSAGE":
                        q.call.sendMessageWithContext({
                            callback: (Y) => {
                                this.handleChildWriteCompleted(A)
                            }
                        }, K.message.message);
                        break;
                    case "HALF_CLOSE":
                        q.nextMessageToSend += 1, q.call.halfClose();
                        break;
                    case "FREED":
                        break
                }
            }
        }
        sendMessageWithContext(A, q) {
            var K;
            this.trace("write() called with message of length " + q.length);
            let Y = {
                    message: q,
                    flags: A.flags
                },
                z = this.getNextBufferIndex(),
                w = {
                    entryType: "MESSAGE",
                    message: Y,
                    allocated: this.bufferTracker.allocate(q.length, this.callNumber)
                };
            if (this.writeBuffer.push(w), w.allocated) {
                (K = A.callback) === null || K === void 0 || K.call(A);
                for (let [H, $] of this.underlyingCalls.entries())
                    if ($.state === "ACTIVE" && $.nextMessageToSend === z) $.call.sendMessageWithContext({
                        callback: (O) => {
                            this.handleChildWriteCompleted(H)
                        }
                    }, q)
            } else {
                if (this.commitCallWithMostMessages(), this.committedCallIndex === null) return;
                let H = this.underlyingCalls[this.committedCallIndex];
                if (w.callback = A.callback, H.state === "ACTIVE" && H.nextMessageToSend === z) H.call.sendMessageWithContext({
                    callback: ($) => {
                        this.handleChildWriteCompleted(this.committedCallIndex)
                    }
                }, q)
            }
        }
        startRead() {
            this.trace("startRead called"), this.readStarted = !0;
            for (let A of this.underlyingCalls)
                if ((A === null || A === void 0 ? void 0 : A.state) === "ACTIVE") A.call.startRead()
        }
        halfClose() {
            this.trace("halfClose called");
            let A = this.getNextBufferIndex();
            this.writeBuffer.push({
                entryType: "HALF_CLOSE",
                allocated: !1
            });
            for (let q of this.underlyingCalls)
                if ((q === null || q === void 0 ? void 0 : q.state) === "ACTIVE" && q.nextMessageToSend === A) q.nextMessageToSend += 1, q.call.halfClose()
        }
        setCredentials(A) {
            throw Error("Method not implemented.")
        }
        getMethod() {
            return this.methodName
        }
        getHost() {
            return this.host
        }
        getAuthContext() {
            if (this.committedCallIndex !== null) return this.underlyingCalls[this.committedCallIndex].call.getAuthContext();
            else return null
        }
    }
    YN4.RetryingCall = KN4
})
// @from(Ln 297120, Col 4)
HF1 = R(($N4) => {
    Object.defineProperty($N4, "__esModule", {
        value: !0
    });
    $N4.BaseSubchannelWrapper = void 0;
    class HN4 {
        constructor(A) {
            this.child = A, this.healthy = !0, this.healthListeners = new Set, this.refcount = 0, this.dataWatchers = new Set, A.addHealthStateWatcher((q) => {
                if (this.healthy) this.updateHealthListeners()
            })
        }
        updateHealthListeners() {
            for (let A of this.healthListeners) A(this.isHealthy())
        }
        getConnectivityState() {
            return this.child.getConnectivityState()
        }
        addConnectivityStateListener(A) {
            this.child.addConnectivityStateListener(A)
        }
        removeConnectivityStateListener(A) {
            this.child.removeConnectivityStateListener(A)
        }
        startConnecting() {
            this.child.startConnecting()
        }
        getAddress() {
            return this.child.getAddress()
        }
        throttleKeepalive(A) {
            this.child.throttleKeepalive(A)
        }
        ref() {
            this.child.ref(), this.refcount += 1
        }
        unref() {
            if (this.child.unref(), this.refcount -= 1, this.refcount === 0) this.destroy()
        }
        destroy() {
            for (let A of this.dataWatchers) A.destroy()
        }
        getChannelzRef() {
            return this.child.getChannelzRef()
        }
        isHealthy() {
            return this.healthy && this.child.isHealthy()
        }
        addHealthStateWatcher(A) {
            this.healthListeners.add(A)
        }
        removeHealthStateWatcher(A) {
            this.healthListeners.delete(A)
        }
        addDataWatcher(A) {
            A.setSubchannel(this.getRealSubchannel()), this.dataWatchers.add(A)
        }
        setHealthy(A) {
            if (A !== this.healthy) {
                if (this.healthy = A, this.child.isHealthy()) this.updateHealthListeners()
            }
        }
        getRealSubchannel() {
            return this.child.getRealSubchannel()
        }
        realSubchannelEquals(A) {
            return this.getRealSubchannel() === A.getRealSubchannel()
        }
        getCallCredentials() {
            return this.child.getCallCredentials()
        }
        getChannel() {
            return this.child.getChannel()
        }
    }
    $N4.BaseSubchannelWrapper = HN4
})
// @from(Ln 297196, Col 4)
SVA = R((MN4) => {
    Object.defineProperty(MN4, "__esModule", {
        value: !0
    });
    MN4.InternalChannel = MN4.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = void 0;
    var s$Y = gM1(),
        t$Y = QW4(),
        e$Y = pV4(),
        CVA = zd(),
        AOY = Jj(),
        xs = w9(),
        qOY = f06(),
        KOY = XVA(),
        _N4 = lh(),
        C06 = mw(),
        YOY = VVA(),
        S06 = mZ(),
        FR = FZ(),
        $F1 = hs(),
        zOY = rV4(),
        wOY = qP1(),
        HOY = eV4(),
        RVA = G06(),
        $OY = em1(),
        yVA = wN4(),
        OOY = HF1(),
        _OY = 2147483647,
        JOY = 1000,
        XOY = 1800000,
        h06 = new Map,
        DOY = 16777216,
        jOY = 1048576;
    class JN4 extends OOY.BaseSubchannelWrapper {
        constructor(A, q) {
            super(A);
            this.channel = q, this.refCount = 0, this.subchannelStateListener = (K, Y, z, w) => {
                q.throttleKeepalive(w)
            }
        }
        ref() {
            if (this.refCount === 0) this.child.addConnectivityStateListener(this.subchannelStateListener), this.channel.addWrappedSubchannel(this);
            this.child.ref(), this.refCount += 1
        }
        unref() {
            if (this.child.unref(), this.refCount -= 1, this.refCount <= 0) this.child.removeConnectivityStateListener(this.subchannelStateListener), this.channel.removeWrappedSubchannel(this)
        }
    }
    class XN4 {
        pick(A) {
            return {
                pickResultType: CVA.PickResultType.DROP,
                status: {
                    code: xs.Status.UNAVAILABLE,
                    details: "Channel closed before call started",
                    metadata: new AOY.Metadata
                },
                subchannel: null,
                onCallStarted: null,
                onCallEnded: null
            }
        }
    }
    MN4.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = "grpc.internal.no_subchannel";
    class DN4 {
        constructor(A) {
            this.target = A, this.trace = new $F1.ChannelzTrace, this.callTracker = new $F1.ChannelzCallTracker, this.childrenTracker = new $F1.ChannelzChildrenTracker, this.state = FR.ConnectivityState.IDLE
        }
        getChannelzInfoCallback() {
            return () => {
                return {
                    target: this.target,
                    state: this.state,
                    trace: this.trace,
                    callTracker: this.callTracker,
                    children: this.childrenTracker.getChildLists()
                }
            }
        }
    }
    class jN4 {
        constructor(A, q, K) {
            var Y, z, w, H, $, O;
            if (this.credentials = q, this.options = K, this.connectivityState = FR.ConnectivityState.IDLE, this.currentPicker = new CVA.UnavailablePicker, this.configSelectionQueue = [], this.pickQueue = [], this.connectivityStateWatchers = [], this.callRefTimer = null, this.configSelector = null, this.currentResolutionError = null, this.wrappedSubchannels = new Set, this.callCount = 0, this.idleTimer = null, this.channelzEnabled = !0, this.randomChannelId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), typeof A !== "string") throw TypeError("Channel target must be a string");
            if (!(q instanceof s$Y.ChannelCredentials)) throw TypeError("Channel credentials must be a ChannelCredentials object");
            if (K) {
                if (typeof K !== "object") throw TypeError("Channel options must be an object")
            }
            this.channelzInfoTracker = new DN4(A);
            let _ = (0, S06.parseUri)(A);
            if (_ === null) throw Error(`Could not parse target name "${A}"`);
            let J = (0, _N4.mapUriDefaultScheme)(_);
            if (J === null) throw Error(`Could not find a default scheme for target name "${A}"`);
            if (this.options["grpc.enable_channelz"] === 0) this.channelzEnabled = !1;
            if (this.channelzRef = (0, $F1.registerChannelzChannel)(A, this.channelzInfoTracker.getChannelzInfoCallback(), this.channelzEnabled), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Channel created");
            if (this.options["grpc.default_authority"]) this.defaultAuthority = this.options["grpc.default_authority"];
            else this.defaultAuthority = (0, _N4.getDefaultAuthority)(J);
            let X = (0, YOY.mapProxyName)(J, K);
            this.target = X.target, this.options = Object.assign({}, this.options, X.extraOptions), this.subchannelPool = (0, e$Y.getSubchannelPool)(((Y = this.options["grpc.use_local_subchannel_pool"]) !== null && Y !== void 0 ? Y : 0) === 0), this.retryBufferTracker = new yVA.MessageBufferTracker((z = this.options["grpc.retry_buffer_size"]) !== null && z !== void 0 ? z : DOY, (w = this.options["grpc.per_rpc_retry_buffer_size"]) !== null && w !== void 0 ? w : jOY), this.keepaliveTime = (H = this.options["grpc.keepalive_time_ms"]) !== null && H !== void 0 ? H : -1, this.idleTimeoutMs = Math.max(($ = this.options["grpc.client_idle_timeout_ms"]) !== null && $ !== void 0 ? $ : XOY, JOY);
            let D = {
                createSubchannel: (M, P) => {
                    let W = {};
                    for (let [Z, N] of Object.entries(P))
                        if (!Z.startsWith(MN4.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX)) W[Z] = N;
                    let G = this.subchannelPool.getOrCreateSubchannel(this.target, M, W, this.credentials);
                    if (G.throttleKeepalive(this.keepaliveTime), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Created subchannel or used existing subchannel", G.getChannelzRef());
                    return new JN4(G, this)
                },
                updateState: (M, P) => {
                    this.currentPicker = P;
                    let W = this.pickQueue.slice();
                    if (this.pickQueue = [], W.length > 0) this.callRefTimerUnref();
                    for (let G of W) G.doPick();
                    this.updateState(M)
                },
                requestReresolution: () => {
                    throw Error("Resolving load balancer should never call requestReresolution")
                },
                addChannelzChild: (M) => {
                    if (this.channelzEnabled) this.channelzInfoTracker.childrenTracker.refChild(M)
                },
                removeChannelzChild: (M) => {
                    if (this.channelzEnabled) this.channelzInfoTracker.childrenTracker.unrefChild(M)
                }
            };
            this.resolvingLoadBalancer = new t$Y.ResolvingLoadBalancer(this.target, D, this.options, (M, P) => {
                var W;
                if (M.retryThrottling) h06.set(this.getTarget(), new yVA.RetryThrottler(M.retryThrottling.maxTokens, M.retryThrottling.tokenRatio, h06.get(this.getTarget())));
                else h06.delete(this.getTarget());
                if (this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Address resolution succeeded");
                (W = this.configSelector) === null || W === void 0 || W.unref(), this.configSelector = P, this.currentResolutionError = null, process.nextTick(() => {
                    let G = this.configSelectionQueue;
                    if (this.configSelectionQueue = [], G.length > 0) this.callRefTimerUnref();
                    for (let f of G) f.getConfig()
                })
            }, (M) => {
                if (this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_WARNING", "Address resolution failed with code " + M.code + ' and details "' + M.details + '"');
                if (this.configSelectionQueue.length > 0) this.trace("Name resolution failed with calls queued for config selection");
                if (this.configSelector === null) this.currentResolutionError = Object.assign(Object.assign({}, (0, $OY.restrictControlPlaneStatusCode)(M.code, M.details)), {
                    metadata: M.metadata
                });
                let P = this.configSelectionQueue;
                if (this.configSelectionQueue = [], P.length > 0) this.callRefTimerUnref();
                for (let W of P) W.reportResolverError(M)
            }), this.filterStackFactory = new qOY.FilterStackFactory([new KOY.CompressionFilterFactory(this, this.options)]), this.trace("Channel constructed with options " + JSON.stringify(K, void 0, 2));
            let j = Error();
            if ((0, C06.isTracerEnabled)("channel_stacktrace"))(0, C06.trace)(xs.LogVerbosity.DEBUG, "channel_stacktrace", "(" + this.channelzRef.id + `) Channel constructed 
` + ((O = j.stack) === null || O === void 0 ? void 0 : O.substring(j.stack.indexOf(`
`) + 1)));
            this.lastActivityTimestamp = new Date
        }
        trace(A, q) {
            (0, C06.trace)(q !== null && q !== void 0 ? q : xs.LogVerbosity.DEBUG, "channel", "(" + this.channelzRef.id + ") " + (0, S06.uriToString)(this.target) + " " + A)
        }
        callRefTimerRef() {
            var A, q, K, Y;
            if (!this.callRefTimer) this.callRefTimer = setInterval(() => {}, _OY);
            if (!((q = (A = this.callRefTimer).hasRef) === null || q === void 0 ? void 0 : q.call(A))) this.trace("callRefTimer.ref | configSelectionQueue.length=" + this.configSelectionQueue.length + " pickQueue.length=" + this.pickQueue.length), (Y = (K = this.callRefTimer).ref) === null || Y === void 0 || Y.call(K)
        }
        callRefTimerUnref() {
            var A, q, K;
            if (!((A = this.callRefTimer) === null || A === void 0 ? void 0 : A.hasRef) || this.callRefTimer.hasRef()) this.trace("callRefTimer.unref | configSelectionQueue.length=" + this.configSelectionQueue.length + " pickQueue.length=" + this.pickQueue.length), (K = (q = this.callRefTimer) === null || q === void 0 ? void 0 : q.unref) === null || K === void 0 || K.call(q)
        }
        removeConnectivityStateWatcher(A) {
            let q = this.connectivityStateWatchers.findIndex((K) => K === A);
            if (q >= 0) this.connectivityStateWatchers.splice(q, 1)
        }
        updateState(A) {
            if ((0, C06.trace)(xs.LogVerbosity.DEBUG, "connectivity_state", "(" + this.channelzRef.id + ") " + (0, S06.uriToString)(this.target) + " " + FR.ConnectivityState[this.connectivityState] + " -> " + FR.ConnectivityState[A]), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Connectivity state change to " + FR.ConnectivityState[A]);
            this.connectivityState = A, this.channelzInfoTracker.state = A;
            let q = this.connectivityStateWatchers.slice();
            for (let K of q)
                if (A !== K.currentState) {
                    if (K.timer) clearTimeout(K.timer);
                    this.removeConnectivityStateWatcher(K), K.callback()
                } if (A !== FR.ConnectivityState.TRANSIENT_FAILURE) this.currentResolutionError = null
        }
        throttleKeepalive(A) {
            if (A > this.keepaliveTime) {
                this.keepaliveTime = A;
                for (let q of this.wrappedSubchannels) q.throttleKeepalive(A)
            }
        }
        addWrappedSubchannel(A) {
            this.wrappedSubchannels.add(A)
        }
        removeWrappedSubchannel(A) {
            this.wrappedSubchannels.delete(A)
        }
        doPick(A, q) {
            return this.currentPicker.pick({
                metadata: A,
                extraPickInfo: q
            })
        }
        queueCallForPick(A) {
            this.pickQueue.push(A), this.callRefTimerRef()
        }
        getConfig(A, q) {
            if (this.connectivityState !== FR.ConnectivityState.SHUTDOWN) this.resolvingLoadBalancer.exitIdle();
            if (this.configSelector) return {
                type: "SUCCESS",
                config: this.configSelector.invoke(A, q, this.randomChannelId)
            };
            else if (this.currentResolutionError) return {
                type: "ERROR",
                error: this.currentResolutionError
            };
            else return {
                type: "NONE"
            }
        }
        queueCallForConfig(A) {
            this.configSelectionQueue.push(A), this.callRefTimerRef()
        }
        enterIdle() {
            if (this.resolvingLoadBalancer.destroy(), this.updateState(FR.ConnectivityState.IDLE), this.currentPicker = new CVA.QueuePicker(this.resolvingLoadBalancer), this.idleTimer) clearTimeout(this.idleTimer), this.idleTimer = null;
            if (this.callRefTimer) clearInterval(this.callRefTimer), this.callRefTimer = null
        }
        startIdleTimeout(A) {
            var q, K;
            this.idleTimer = setTimeout(() => {
                if (this.callCount > 0) {
                    this.startIdleTimeout(this.idleTimeoutMs);
                    return
                }
                let z = new Date().valueOf() - this.lastActivityTimestamp.valueOf();
                if (z >= this.idleTimeoutMs) this.trace("Idle timer triggered after " + this.idleTimeoutMs + "ms of inactivity"), this.enterIdle();
                else this.startIdleTimeout(this.idleTimeoutMs - z)
            }, A), (K = (q = this.idleTimer).unref) === null || K === void 0 || K.call(q)
        }
        maybeStartIdleTimer() {
            if (this.connectivityState !== FR.ConnectivityState.SHUTDOWN && !this.idleTimer) this.startIdleTimeout(this.idleTimeoutMs)
        }
        onCallStart() {
            if (this.channelzEnabled) this.channelzInfoTracker.callTracker.addCallStarted();
            this.callCount += 1
        }
        onCallEnd(A) {
            if (this.channelzEnabled)
                if (A.code === xs.Status.OK) this.channelzInfoTracker.callTracker.addCallSucceeded();
                else this.channelzInfoTracker.callTracker.addCallFailed();
            this.callCount -= 1, this.lastActivityTimestamp = new Date, this.maybeStartIdleTimer()
        }
        createLoadBalancingCall(A, q, K, Y, z) {
            let w = (0, RVA.getNextCallNumber)();
            return this.trace("createLoadBalancingCall [" + w + '] method="' + q + '"'), new zOY.LoadBalancingCall(this, A, q, K, Y, z, w)
        }
        createRetryingCall(A, q, K, Y, z) {
            let w = (0, RVA.getNextCallNumber)();
            return this.trace("createRetryingCall [" + w + '] method="' + q + '"'), new yVA.RetryingCall(this, A, q, K, Y, z, w, this.retryBufferTracker, h06.get(this.getTarget()))
        }
        createResolvingCall(A, q, K, Y, z) {
            let w = (0, RVA.getNextCallNumber)();
            this.trace("createResolvingCall [" + w + '] method="' + A + '", deadline=' + (0, wOY.deadlineToString)(q));
            let H = {
                    deadline: q,
                    flags: z !== null && z !== void 0 ? z : xs.Propagate.DEFAULTS,
                    host: K !== null && K !== void 0 ? K : this.defaultAuthority,
                    parentCall: Y
                },
                $ = new HOY.ResolvingCall(this, A, H, this.filterStackFactory.clone(), w);
            return this.onCallStart(), $.addStatusWatcher((O) => {
                this.onCallEnd(O)
            }), $
        }
        close() {
            var A;
            this.resolvingLoadBalancer.destroy(), this.updateState(FR.ConnectivityState.SHUTDOWN), this.currentPicker = new XN4;
            for (let q of this.configSelectionQueue) q.cancelWithStatus(xs.Status.UNAVAILABLE, "Channel closed before call started");
            this.configSelectionQueue = [];
            for (let q of this.pickQueue) q.cancelWithStatus(xs.Status.UNAVAILABLE, "Channel closed before call started");
            if (this.pickQueue = [], this.callRefTimer) clearInterval(this.callRefTimer);
            if (this.idleTimer) clearTimeout(this.idleTimer);
            if (this.channelzEnabled)(0, $F1.unregisterChannelzRef)(this.channelzRef);
            this.subchannelPool.unrefUnusedSubchannels(), (A = this.configSelector) === null || A === void 0 || A.unref(), this.configSelector = null
        }
        getTarget() {
            return (0, S06.uriToString)(this.target)
        }
        getConnectivityState(A) {
            let q = this.connectivityState;
            if (A) this.resolvingLoadBalancer.exitIdle(), this.lastActivityTimestamp = new Date, this.maybeStartIdleTimer();
            return q
        }
        watchConnectivityState(A, q, K) {
            if (this.connectivityState === FR.ConnectivityState.SHUTDOWN) throw Error("Channel has been shut down");
            let Y = null;
            if (q !== 1 / 0) {
                let w = q instanceof Date ? q : new Date(q),
                    H = new Date;
                if (q === -1 / 0 || w <= H) {
                    process.nextTick(K, Error("Deadline passed without connectivity state change"));
                    return
                }
                Y = setTimeout(() => {
                    this.removeConnectivityStateWatcher(z), K(Error("Deadline passed without connectivity state change"))
                }, w.getTime() - H.getTime())
            }
            let z = {
                currentState: A,
                callback: K,
                timer: Y
            };
            this.connectivityStateWatchers.push(z)
        }
        getChannelzRef() {
            return this.channelzRef
        }
        createCall(A, q, K, Y, z) {
            if (typeof A !== "string") throw TypeError("Channel#createCall: method must be a string");
            if (!(typeof q === "number" || q instanceof Date)) throw TypeError("Channel#createCall: deadline must be a number or Date");
            if (this.connectivityState === FR.ConnectivityState.SHUTDOWN) throw Error("Channel has been shut down");
            return this.createResolvingCall(A, q, K, Y, z)
        }
        getOptions() {
            return this.options
        }
    }
    MN4.InternalChannel = jN4
})
// @from(Ln 297516, Col 4)
JfA = R((ZN4) => {
    Object.defineProperty(ZN4, "__esModule", {
        value: !0
    });
    ZN4.ChannelImplementation = void 0;
    var MOY = gM1(),
        POY = SVA();
    class GN4 {
        constructor(A, q, K) {
            if (typeof A !== "string") throw TypeError("Channel target must be a string");
            if (!(q instanceof MOY.ChannelCredentials)) throw TypeError("Channel credentials must be a ChannelCredentials object");
            if (K) {
                if (typeof K !== "object") throw TypeError("Channel options must be an object")
            }
            this.internalChannel = new POY.InternalChannel(A, q, K)
        }
        close() {
            this.internalChannel.close()
        }
        getTarget() {
            return this.internalChannel.getTarget()
        }
        getConnectivityState(A) {
            return this.internalChannel.getConnectivityState(A)
        }
        watchConnectivityState(A, q, K) {
            this.internalChannel.watchConnectivityState(A, q, K)
        }
        getChannelzRef() {
            return this.internalChannel.getChannelzRef()
        }
        createCall(A, q, K, Y, z) {
            if (typeof A !== "string") throw TypeError("Channel#createCall: method must be a string");
            if (!(typeof q === "number" || q instanceof Date)) throw TypeError("Channel#createCall: deadline must be a number or Date");
            return this.internalChannel.createCall(A, q, K, Y, z)
        }
    }
    ZN4.ChannelImplementation = GN4
})