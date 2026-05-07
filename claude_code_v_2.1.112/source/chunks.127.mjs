
// @from(Ln 317346, Col 4)
FqK = p((BqK) => {
    Object.defineProperty(BqK, "__esModule", {
        value: !0
    });
    BqK.Http2SubchannelCall = void 0;
    var Tt = d6("http2"),
        _Qz = d6("os"),
        M2 = e_(),
        Vt = QD(),
        zQz = ne1(),
        YQz = o2(),
        AQz = e_(),
        OQz = "subchannel_call";

    function wQz(q) {
        for (let [K, _] of Object.entries(_Qz.constants.errno))
            if (_ === q) return K;
        return "Unknown system error " + q
    }

    function ie1(q) {
        let K = `Received HTTP status code ${q}`,
            _;
        switch (q) {
            case 400:
                _ = M2.Status.INTERNAL;
                break;
            case 401:
                _ = M2.Status.UNAUTHENTICATED;
                break;
            case 403:
                _ = M2.Status.PERMISSION_DENIED;
                break;
            case 404:
                _ = M2.Status.UNIMPLEMENTED;
                break;
            case 429:
            case 502:
            case 503:
            case 504:
                _ = M2.Status.UNAVAILABLE;
                break;
            default:
                _ = M2.Status.UNKNOWN
        }
        return {
            code: _,
            details: K,
            metadata: new Vt.Metadata
        }
    }
    class mqK {
        constructor(q, K, _, z, Y) {
            var A;
            this.http2Stream = q, this.callEventTracker = K, this.listener = _, this.transport = z, this.callId = Y, this.isReadFilterPending = !1, this.isPushPending = !1, this.canPush = !1, this.readsClosed = !1, this.statusOutput = !1, this.unpushedReadMessages = [], this.finalStatus = null, this.internalError = null, this.serverEndedCall = !1, this.connectionDropped = !1;
            let O = (A = z.getOptions()["grpc.max_receive_message_length"]) !== null && A !== void 0 ? A : M2.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH;
            this.decoder = new zQz.StreamDecoder(O), q.on("response", (w, $) => {
                let j = "";
                for (let H of Object.keys(w)) j += "\t\t" + H + ": " + w[H] + `
`;
                if (this.trace(`Received server headers:
` + j), this.httpStatusCode = w[":status"], $ & Tt.constants.NGHTTP2_FLAG_END_STREAM) this.handleTrailers(w);
                else {
                    let H;
                    try {
                        H = Vt.Metadata.fromHttp2Headers(w)
                    } catch (J) {
                        this.endCall({
                            code: M2.Status.UNKNOWN,
                            details: J.message,
                            metadata: new Vt.Metadata
                        });
                        return
                    }
                    this.listener.onReceiveMetadata(H)
                }
            }), q.on("trailers", (w) => {
                this.handleTrailers(w)
            }), q.on("data", (w) => {
                if (this.statusOutput) return;
                this.trace("receive HTTP/2 data frame of length " + w.length);
                let $;
                try {
                    $ = this.decoder.write(w)
                } catch (j) {
                    if (this.httpStatusCode !== void 0 && this.httpStatusCode !== 200) {
                        let H = ie1(this.httpStatusCode);
                        this.cancelWithStatus(H.code, H.details)
                    } else this.cancelWithStatus(M2.Status.RESOURCE_EXHAUSTED, j.message);
                    return
                }
                for (let j of $) this.trace("parsed message of length " + j.length), this.callEventTracker.addMessageReceived(), this.tryPush(j)
            }), q.on("end", () => {
                this.readsClosed = !0, this.maybeOutputStatus()
            }), q.on("close", () => {
                this.serverEndedCall = !0, process.nextTick(() => {
                    var w;
                    if (this.trace("HTTP/2 stream closed with code " + q.rstCode), ((w = this.finalStatus) === null || w === void 0 ? void 0 : w.code) === M2.Status.OK) return;
                    let $, j = "";
                    switch (q.rstCode) {
                        case Tt.constants.NGHTTP2_NO_ERROR:
                            if (this.finalStatus !== null) return;
                            if (this.httpStatusCode && this.httpStatusCode !== 200) {
                                let H = ie1(this.httpStatusCode);
                                $ = H.code, j = H.details
                            } else $ = M2.Status.INTERNAL, j = `Received RST_STREAM with code ${q.rstCode} (Call ended without gRPC status)`;
                            break;
                        case Tt.constants.NGHTTP2_REFUSED_STREAM:
                            $ = M2.Status.UNAVAILABLE, j = "Stream refused by server";
                            break;
                        case Tt.constants.NGHTTP2_CANCEL:
                            if (this.connectionDropped) $ = M2.Status.UNAVAILABLE, j = "Connection dropped";
                            else $ = M2.Status.CANCELLED, j = "Call cancelled";
                            break;
                        case Tt.constants.NGHTTP2_ENHANCE_YOUR_CALM:
                            $ = M2.Status.RESOURCE_EXHAUSTED, j = "Bandwidth exhausted or memory limit exceeded";
                            break;
                        case Tt.constants.NGHTTP2_INADEQUATE_SECURITY:
                            $ = M2.Status.PERMISSION_DENIED, j = "Protocol not secure enough";
                            break;
                        case Tt.constants.NGHTTP2_INTERNAL_ERROR:
                            if ($ = M2.Status.INTERNAL, this.internalError === null) j = `Received RST_STREAM with code ${q.rstCode} (Internal server error)`;
                            else if (this.internalError.code === "ECONNRESET" || this.internalError.code === "ETIMEDOUT") $ = M2.Status.UNAVAILABLE, j = this.internalError.message;
                            else j = `Received RST_STREAM with code ${q.rstCode} triggered by internal client error: ${this.internalError.message}`;
                            break;
                        default:
                            $ = M2.Status.INTERNAL, j = `Received RST_STREAM with code ${q.rstCode}`
                    }
                    this.endCall({
                        code: $,
                        details: j,
                        metadata: new Vt.Metadata,
                        rstCode: q.rstCode
                    })
                })
            }), q.on("error", (w) => {
                if (w.code !== "ERR_HTTP2_STREAM_ERROR") this.trace("Node error event: message=" + w.message + " code=" + w.code + " errno=" + wQz(w.errno) + " syscall=" + w.syscall), this.internalError = w;
                this.callEventTracker.onStreamEnd(!1)
            })
        }
        getDeadlineInfo() {
            return [`remote_addr=${this.getPeer()}`]
        }
        onDisconnect() {
            this.connectionDropped = !0, setImmediate(() => {
                this.endCall({
                    code: M2.Status.UNAVAILABLE,
                    details: "Connection dropped",
                    metadata: new Vt.Metadata
                })
            })
        }
        outputStatus() {
            if (!this.statusOutput) this.statusOutput = !0, this.trace("ended with status: code=" + this.finalStatus.code + ' details="' + this.finalStatus.details + '"'), this.callEventTracker.onCallEnd(this.finalStatus), process.nextTick(() => {
                this.listener.onReceiveStatus(this.finalStatus)
            }), this.http2Stream.resume()
        }
        trace(q) {
            YQz.trace(AQz.LogVerbosity.DEBUG, OQz, "[" + this.callId + "] " + q)
        }
        endCall(q) {
            if (this.finalStatus === null || this.finalStatus.code === M2.Status.OK) this.finalStatus = q, this.maybeOutputStatus();
            this.destroyHttp2Stream()
        }
        maybeOutputStatus() {
            if (this.finalStatus !== null) {
                if (this.finalStatus.code !== M2.Status.OK || this.readsClosed && this.unpushedReadMessages.length === 0 && !this.isReadFilterPending && !this.isPushPending) this.outputStatus()
            }
        }
        push(q) {
            this.trace("pushing to reader message of length " + (q instanceof Buffer ? q.length : null)), this.canPush = !1, this.isPushPending = !0, process.nextTick(() => {
                if (this.isPushPending = !1, this.statusOutput) return;
                this.listener.onReceiveMessage(q), this.maybeOutputStatus()
            })
        }
        tryPush(q) {
            if (this.canPush) this.http2Stream.pause(), this.push(q);
            else this.trace("unpushedReadMessages.push message of length " + q.length), this.unpushedReadMessages.push(q)
        }
        handleTrailers(q) {
            this.serverEndedCall = !0, this.callEventTracker.onStreamEnd(!0);
            let K = "";
            for (let A of Object.keys(q)) K += "\t\t" + A + ": " + q[A] + `
`;
            this.trace(`Received server trailers:
` + K);
            let _;
            try {
                _ = Vt.Metadata.fromHttp2Headers(q)
            } catch (A) {
                _ = new Vt.Metadata
            }
            let z = _.getMap(),
                Y;
            if (typeof z["grpc-status"] === "string") {
                let A = Number(z["grpc-status"]);
                this.trace("received status code " + A + " from server"), _.remove("grpc-status");
                let O = "";
                if (typeof z["grpc-message"] === "string") {
                    try {
                        O = decodeURI(z["grpc-message"])
                    } catch (w) {
                        O = z["grpc-message"]
                    }
                    _.remove("grpc-message"), this.trace('received status details string "' + O + '" from server')
                }
                Y = {
                    code: A,
                    details: O,
                    metadata: _
                }
            } else if (this.httpStatusCode) Y = ie1(this.httpStatusCode), Y.metadata = _;
            else Y = {
                code: M2.Status.UNKNOWN,
                details: "No status information received",
                metadata: _
            };
            this.endCall(Y)
        }
        destroyHttp2Stream() {
            var q;
            if (this.http2Stream.destroyed) return;
            if (this.serverEndedCall) this.http2Stream.end();
            else {
                let K;
                if (((q = this.finalStatus) === null || q === void 0 ? void 0 : q.code) === M2.Status.OK) K = Tt.constants.NGHTTP2_NO_ERROR;
                else K = Tt.constants.NGHTTP2_CANCEL;
                this.trace("close http2 stream with code " + K), this.http2Stream.close(K)
            }
        }
        cancelWithStatus(q, K) {
            this.trace("cancelWithStatus code: " + q + ' details: "' + K + '"'), this.endCall({
                code: q,
                details: K,
                metadata: new Vt.Metadata
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
            if (this.finalStatus !== null && this.finalStatus.code !== M2.Status.OK) {
                this.readsClosed = !0, this.maybeOutputStatus();
                return
            }
            if (this.canPush = !0, this.unpushedReadMessages.length > 0) {
                let q = this.unpushedReadMessages.shift();
                this.push(q);
                return
            }
            this.http2Stream.resume()
        }
        sendMessageWithContext(q, K) {
            this.trace("write() called with message of length " + K.length);
            let _ = (z) => {
                process.nextTick(() => {
                    var Y;
                    let A = M2.Status.UNAVAILABLE;
                    if ((z === null || z === void 0 ? void 0 : z.code) === "ERR_STREAM_WRITE_AFTER_END") A = M2.Status.INTERNAL;
                    if (z) this.cancelWithStatus(A, `Write error: ${z.message}`);
                    (Y = q.callback) === null || Y === void 0 || Y.call(q)
                })
            };
            this.trace("sending data chunk of length " + K.length), this.callEventTracker.addMessageSent();
            try {
                this.http2Stream.write(K, _)
            } catch (z) {
                this.endCall({
                    code: M2.Status.UNAVAILABLE,
                    details: `Write failed with error ${z.message}`,
                    metadata: new Vt.Metadata
                })
            }
        }
        halfClose() {
            this.trace("end() called"), this.trace("calling end() on HTTP/2 stream"), this.http2Stream.end()
        }
    }
    BqK.Http2SubchannelCall = mqK
})
// @from(Ln 317635, Col 4)
cqK = p((QqK) => {
    Object.defineProperty(QqK, "__esModule", {
        value: !0
    });
    QqK.Http2SubchannelConnector = void 0;
    var eJ6 = d6("http2"),
        $Qz = d6("tls"),
        hB8 = I36(),
        Gq8 = e_(),
        jQz = le1(),
        uS6 = o2(),
        HQz = GF(),
        RB8 = by(),
        re1 = nk(),
        JQz = d6("net"),
        XQz = FqK(),
        MQz = VB8(),
        oe1 = "transport",
        PQz = "transport_flowctrl",
        WQz = jt1().version,
        {
            HTTP2_HEADER_AUTHORITY: DQz,
            HTTP2_HEADER_CONTENT_TYPE: ZQz,
            HTTP2_HEADER_METHOD: fQz,
            HTTP2_HEADER_PATH: GQz,
            HTTP2_HEADER_TE: vQz,
            HTTP2_HEADER_USER_AGENT: TQz
        } = eJ6.constants,
        VQz = 20000,
        kQz = Buffer.from("too_many_pings", "ascii");
    class gqK {
        constructor(q, K, _, z) {
            if (this.session = q, this.options = _, this.remoteName = z, this.keepaliveTimer = null, this.pendingSendKeepalivePing = !1, this.activeCalls = new Set, this.disconnectListeners = [], this.disconnectHandled = !1, this.channelzEnabled = !0, this.keepalivesSent = 0, this.messagesSent = 0, this.messagesReceived = 0, this.lastMessageSentTimestamp = null, this.lastMessageReceivedTimestamp = null, this.subchannelAddressString = (0, RB8.subchannelAddressToString)(K), _["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.streamTracker = new hB8.ChannelzCallTrackerStub;
            else this.streamTracker = new hB8.ChannelzCallTracker;
            if (this.channelzRef = (0, hB8.registerChannelzSocket)(this.subchannelAddressString, () => this.getChannelzInfo(), this.channelzEnabled), this.userAgent = [_["grpc.primary_user_agent"], `grpc-node-js/${WQz}`, _["grpc.secondary_user_agent"]].filter((Y) => Y).join(" "), "grpc.keepalive_time_ms" in _) this.keepaliveTimeMs = _["grpc.keepalive_time_ms"];
            else this.keepaliveTimeMs = -1;
            if ("grpc.keepalive_timeout_ms" in _) this.keepaliveTimeoutMs = _["grpc.keepalive_timeout_ms"];
            else this.keepaliveTimeoutMs = VQz;
            if ("grpc.keepalive_permit_without_calls" in _) this.keepaliveWithoutCalls = _["grpc.keepalive_permit_without_calls"] === 1;
            else this.keepaliveWithoutCalls = !1;
            if (q.once("close", () => {
                    this.trace("session closed"), this.handleDisconnect()
                }), q.once("goaway", (Y, A, O) => {
                    let w = !1;
                    if (Y === eJ6.constants.NGHTTP2_ENHANCE_YOUR_CALM && O && O.equals(kQz)) w = !0;
                    this.trace("connection closed by GOAWAY with code " + Y + " and data " + (O === null || O === void 0 ? void 0 : O.toString())), this.reportDisconnectToOwner(w)
                }), q.once("error", (Y) => {
                    this.trace("connection closed with error " + Y.message), this.handleDisconnect()
                }), q.socket.once("close", (Y) => {
                    this.trace("connection closed. hadError=" + Y), this.handleDisconnect()
                }), uS6.isTracerEnabled(oe1)) q.on("remoteSettings", (Y) => {
                this.trace("new settings received" + (this.session !== q ? " on the old connection" : "") + ": " + JSON.stringify(Y))
            }), q.on("localSettings", (Y) => {
                this.trace("local settings acknowledged by remote" + (this.session !== q ? " on the old connection" : "") + ": " + JSON.stringify(Y))
            });
            if (this.keepaliveWithoutCalls) this.maybeStartKeepalivePingTimer();
            if (q.socket instanceof $Qz.TLSSocket) this.authContext = {
                transportSecurityType: "ssl",
                sslPeerCertificate: q.socket.getPeerCertificate()
            };
            else this.authContext = {}
        }
        getChannelzInfo() {
            var q, K, _;
            let z = this.session.socket,
                Y = z.remoteAddress ? (0, RB8.stringToSubchannelAddress)(z.remoteAddress, z.remotePort) : null,
                A = z.localAddress ? (0, RB8.stringToSubchannelAddress)(z.localAddress, z.localPort) : null,
                O;
            if (this.session.encrypted) {
                let $ = z,
                    j = $.getCipher(),
                    H = $.getCertificate(),
                    J = $.getPeerCertificate();
                O = {
                    cipherSuiteStandardName: (q = j.standardName) !== null && q !== void 0 ? q : null,
                    cipherSuiteOtherName: j.standardName ? null : j.name,
                    localCertificate: H && "raw" in H ? H.raw : null,
                    remoteCertificate: J && "raw" in J ? J.raw : null
                }
            } else O = null;
            return {
                remoteAddress: Y,
                localAddress: A,
                security: O,
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
                localFlowControlWindow: (K = this.session.state.localWindowSize) !== null && K !== void 0 ? K : null,
                remoteFlowControlWindow: (_ = this.session.state.remoteWindowSize) !== null && _ !== void 0 ? _ : null
            }
        }
        trace(q) {
            uS6.trace(Gq8.LogVerbosity.DEBUG, oe1, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + q)
        }
        keepaliveTrace(q) {
            uS6.trace(Gq8.LogVerbosity.DEBUG, "keepalive", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + q)
        }
        flowControlTrace(q) {
            uS6.trace(Gq8.LogVerbosity.DEBUG, PQz, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + q)
        }
        internalsTrace(q) {
            uS6.trace(Gq8.LogVerbosity.DEBUG, "transport_internals", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + q)
        }
        reportDisconnectToOwner(q) {
            if (this.disconnectHandled) return;
            this.disconnectHandled = !0, this.disconnectListeners.forEach((K) => K(q))
        }
        handleDisconnect() {
            this.clearKeepaliveTimeout(), this.reportDisconnectToOwner(!1);
            for (let q of this.activeCalls) q.onDisconnect();
            setImmediate(() => {
                this.session.destroy()
            })
        }
        addDisconnectListener(q) {
            this.disconnectListeners.push(q)
        }
        canSendPing() {
            return !this.session.destroyed && this.keepaliveTimeMs > 0 && (this.keepaliveWithoutCalls || this.activeCalls.size > 0)
        }
        maybeSendPing() {
            var q, K;
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
            }, this.keepaliveTimeoutMs), (K = (q = this.keepaliveTimer).unref) === null || K === void 0 || K.call(q);
            let _ = "";
            try {
                if (!this.session.ping((Y, A, O) => {
                        if (this.clearKeepaliveTimeout(), Y) this.keepaliveTrace("Ping failed with error " + Y.message), this.handleDisconnect();
                        else this.keepaliveTrace("Received ping response"), this.maybeStartKeepalivePingTimer()
                    })) _ = "Ping returned false"
            } catch (z) {
                _ = (z instanceof Error ? z.message : "") || "Unknown error"
            }
            if (_) this.keepaliveTrace("Ping send failed: " + _), this.handleDisconnect()
        }
        maybeStartKeepalivePingTimer() {
            var q, K;
            if (!this.canSendPing()) return;
            if (this.pendingSendKeepalivePing) this.pendingSendKeepalivePing = !1, this.maybeSendPing();
            else if (!this.keepaliveTimer) this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), this.keepaliveTimer = setTimeout(() => {
                this.keepaliveTimer = null, this.maybeSendPing()
            }, this.keepaliveTimeMs), (K = (q = this.keepaliveTimer).unref) === null || K === void 0 || K.call(q)
        }
        clearKeepaliveTimeout() {
            if (this.keepaliveTimer) clearTimeout(this.keepaliveTimer), this.keepaliveTimer = null
        }
        removeActiveCall(q) {
            if (this.activeCalls.delete(q), this.activeCalls.size === 0) this.session.unref()
        }
        addActiveCall(q) {
            if (this.activeCalls.add(q), this.activeCalls.size === 1) {
                if (this.session.ref(), !this.keepaliveWithoutCalls) this.maybeStartKeepalivePingTimer()
            }
        }
        createCall(q, K, _, z, Y) {
            let A = q.toHttp2Headers();
            A[DQz] = K, A[TQz] = this.userAgent, A[ZQz] = "application/grpc", A[fQz] = "POST", A[GQz] = _, A[vQz] = "trailers";
            let O;
            try {
                O = this.session.request(A)
            } catch (j) {
                throw this.handleDisconnect(), j
            }
            this.flowControlTrace("local window size: " + this.session.state.localWindowSize + " remote window size: " + this.session.state.remoteWindowSize), this.internalsTrace("session.closed=" + this.session.closed + " session.destroyed=" + this.session.destroyed + " session.socket.destroyed=" + this.session.socket.destroyed);
            let w, $;
            if (this.channelzEnabled) this.streamTracker.addCallStarted(), w = {
                addMessageSent: () => {
                    var j;
                    this.messagesSent += 1, this.lastMessageSentTimestamp = new Date, (j = Y.addMessageSent) === null || j === void 0 || j.call(Y)
                },
                addMessageReceived: () => {
                    var j;
                    this.messagesReceived += 1, this.lastMessageReceivedTimestamp = new Date, (j = Y.addMessageReceived) === null || j === void 0 || j.call(Y)
                },
                onCallEnd: (j) => {
                    var H;
                    (H = Y.onCallEnd) === null || H === void 0 || H.call(Y, j), this.removeActiveCall($)
                },
                onStreamEnd: (j) => {
                    var H;
                    if (j) this.streamTracker.addCallSucceeded();
                    else this.streamTracker.addCallFailed();
                    (H = Y.onStreamEnd) === null || H === void 0 || H.call(Y, j)
                }
            };
            else w = {
                addMessageSent: () => {
                    var j;
                    (j = Y.addMessageSent) === null || j === void 0 || j.call(Y)
                },
                addMessageReceived: () => {
                    var j;
                    (j = Y.addMessageReceived) === null || j === void 0 || j.call(Y)
                },
                onCallEnd: (j) => {
                    var H;
                    (H = Y.onCallEnd) === null || H === void 0 || H.call(Y, j), this.removeActiveCall($)
                },
                onStreamEnd: (j) => {
                    var H;
                    (H = Y.onStreamEnd) === null || H === void 0 || H.call(Y, j)
                }
            };
            return $ = new XQz.Http2SubchannelCall(O, w, z, this, (0, MQz.getNextCallNumber)()), this.addActiveCall($), $
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
            this.session.close(), (0, hB8.unregisterChannelzRef)(this.channelzRef)
        }
    }
    class UqK {
        constructor(q) {
            this.channelTarget = q, this.session = null, this.isShutdown = !1
        }
        trace(q) {
            uS6.trace(Gq8.LogVerbosity.DEBUG, oe1, (0, re1.uriToString)(this.channelTarget) + " " + q)
        }
        createSession(q, K, _) {
            if (this.isShutdown) return Promise.reject();
            if (q.socket.closed) return Promise.reject("Connection closed before starting HTTP/2 handshake");
            return new Promise((z, Y) => {
                var A, O, w, $, j, H, J;
                let X = null,
                    M = this.channelTarget;
                if ("grpc.http_connect_target" in _) {
                    let R = (0, re1.parseUri)(_["grpc.http_connect_target"]);
                    if (R) M = R, X = (0, re1.uriToString)(R)
                }
                let P = q.secure ? "https" : "http",
                    W = (0, HQz.getDefaultAuthority)(M),
                    D = () => {
                        var R;
                        (R = this.session) === null || R === void 0 || R.destroy(), this.session = null, setImmediate(() => {
                            if (!N) N = !0, Y(`${k.trim()} (${new Date().toISOString()})`)
                        })
                    },
                    Z = (R) => {
                        var h;
                        if ((h = this.session) === null || h === void 0 || h.destroy(), k = R.message, this.trace("connection failed with error " + k), !N) N = !0, Y(`${k} (${new Date().toISOString()})`)
                    },
                    G = {
                        createConnection: (R, h) => {
                            return q.socket
                        },
                        settings: {
                            initialWindowSize: ($ = (A = _["grpc-node.flow_control_window"]) !== null && A !== void 0 ? A : (w = (O = eJ6.getDefaultSettings) === null || O === void 0 ? void 0 : O.call(eJ6)) === null || w === void 0 ? void 0 : w.initialWindowSize) !== null && $ !== void 0 ? $ : 65535
                        }
                    },
                    f = eJ6.connect(`${P}://${W}`, G),
                    v = (J = (H = (j = eJ6.getDefaultSettings) === null || j === void 0 ? void 0 : j.call(eJ6)) === null || H === void 0 ? void 0 : H.initialWindowSize) !== null && J !== void 0 ? J : 65535,
                    V = _["grpc-node.flow_control_window"];
                this.session = f;
                let k = "Failed to connect",
                    N = !1;
                f.unref(), f.once("remoteSettings", () => {
                    var R;
                    if (V && V > v) try {
                        f.setLocalWindowSize(V)
                    } catch (h) {
                        let C = V - ((R = f.state.localWindowSize) !== null && R !== void 0 ? R : v);
                        if (C > 0) f.incrementWindowSize(C)
                    }
                    f.removeAllListeners(), q.socket.removeListener("close", D), q.socket.removeListener("error", Z), z(new gqK(f, K, _, X)), this.session = null
                }), f.once("close", D), f.once("error", Z), q.socket.once("close", D), q.socket.once("error", Z)
            })
        }
        tcpConnect(q, K) {
            return (0, jQz.getProxiedConnection)(q, K).then((_) => {
                if (_) return _;
                else return new Promise((z, Y) => {
                    let A = () => {
                            Y(Error("Socket closed"))
                        },
                        O = ($) => {
                            Y($)
                        },
                        w = JQz.connect(q, () => {
                            w.removeListener("close", A), w.removeListener("error", O), z(w)
                        });
                    w.once("close", A), w.once("error", O)
                })
            })
        }
        async connect(q, K, _) {
            if (this.isShutdown) return Promise.reject();
            let z = null,
                Y = null,
                A = (0, RB8.subchannelAddressToString)(q);
            try {
                return this.trace(A + " Waiting for secureConnector to be ready"), await K.waitForReady(), this.trace(A + " secureConnector is ready"), z = await this.tcpConnect(q, _), z.setNoDelay(), this.trace(A + " Established TCP connection"), Y = await K.connect(z), this.trace(A + " Established secure connection"), this.createSession(Y, q, _)
            } catch (O) {
                throw z === null || z === void 0 || z.destroy(), Y === null || Y === void 0 || Y.socket.destroy(), O
            }
        }
        shutdown() {
            var q;
            this.isShutdown = !0, (q = this.session) === null || q === void 0 || q.close(), this.session = null
        }
    }
    QqK.Http2SubchannelConnector = UqK
})
// @from(Ln 317965, Col 4)
iqK = p((lqK) => {
    Object.defineProperty(lqK, "__esModule", {
        value: !0
    });
    lqK.SubchannelPool = void 0;
    lqK.getSubchannelPool = CQz;
    var NQz = i6K(),
        EQz = GqK(),
        yQz = by(),
        LQz = nk(),
        hQz = cqK(),
        RQz = 1e4;
    class SB8 {
        constructor() {
            this.pool = Object.create(null), this.cleanupTimer = null
        }
        unrefUnusedSubchannels() {
            let q = !0;
            for (let K in this.pool) {
                let z = this.pool[K].filter((Y) => !Y.subchannel.unrefIfOneRef());
                if (z.length > 0) q = !1;
                this.pool[K] = z
            }
            if (q && this.cleanupTimer !== null) clearInterval(this.cleanupTimer), this.cleanupTimer = null
        }
        ensureCleanupTask() {
            var q, K;
            if (this.cleanupTimer === null) this.cleanupTimer = setInterval(() => {
                this.unrefUnusedSubchannels()
            }, RQz), (K = (q = this.cleanupTimer).unref) === null || K === void 0 || K.call(q)
        }
        getOrCreateSubchannel(q, K, _, z) {
            this.ensureCleanupTask();
            let Y = (0, LQz.uriToString)(q);
            if (Y in this.pool) {
                let O = this.pool[Y];
                for (let w of O)
                    if ((0, yQz.subchannelAddressEqual)(K, w.subchannelAddress) && (0, NQz.channelOptionsEqual)(_, w.channelArguments) && z._equals(w.channelCredentials)) return w.subchannel
            }
            let A = new EQz.Subchannel(q, K, _, z, new hQz.Http2SubchannelConnector(q));
            if (!(Y in this.pool)) this.pool[Y] = [];
            return this.pool[Y].push({
                subchannelAddress: K,
                channelArguments: _,
                channelCredentials: z,
                subchannel: A
            }), A.ref(), A
        }
    }
    lqK.SubchannelPool = SB8;
    var SQz = new SB8;

    function CQz(q) {
        if (q) return SQz;
        else return new SB8
    }
})
// @from(Ln 318022, Col 4)
eqK = p((sqK) => {
    Object.defineProperty(sqK, "__esModule", {
        value: !0
    });
    sqK.LoadBalancingCall = void 0;
    var rqK = ik(),
        CB8 = e_(),
        oqK = CS6(),
        bB8 = QD(),
        vq8 = Mt(),
        IQz = nk(),
        xQz = o2(),
        ae1 = Pq8(),
        uQz = d6("http2"),
        mQz = "load_balancing_call";
    class aqK {
        constructor(q, K, _, z, Y, A, O) {
            var w, $;
            this.channel = q, this.callConfig = K, this.methodName = _, this.host = z, this.credentials = Y, this.deadline = A, this.callNumber = O, this.child = null, this.readPending = !1, this.pendingMessage = null, this.pendingHalfClose = !1, this.ended = !1, this.metadata = null, this.listener = null, this.onCallEnded = null, this.childStartTime = null;
            let j = this.methodName.split("/"),
                H = "";
            if (j.length >= 2) H = j[1];
            let J = ($ = (w = (0, IQz.splitHostPort)(this.host)) === null || w === void 0 ? void 0 : w.host) !== null && $ !== void 0 ? $ : "localhost";
            this.serviceUrl = `https://${J}/${H}`, this.startTime = new Date
        }
        getDeadlineInfo() {
            var q, K;
            let _ = [];
            if (this.childStartTime) {
                if (this.childStartTime > this.startTime) {
                    if ((q = this.metadata) === null || q === void 0 ? void 0 : q.getOptions().waitForReady) _.push("wait_for_ready");
                    _.push(`LB pick: ${(0,oqK.formatDateDifference)(this.startTime,this.childStartTime)}`)
                }
                return _.push(...this.child.getDeadlineInfo()), _
            } else {
                if ((K = this.metadata) === null || K === void 0 ? void 0 : K.getOptions().waitForReady) _.push("wait_for_ready");
                _.push("Waiting for LB pick")
            }
            return _
        }
        trace(q) {
            xQz.trace(CB8.LogVerbosity.DEBUG, mQz, "[" + this.callNumber + "] " + q)
        }
        outputStatus(q, K) {
            var _, z;
            if (!this.ended) {
                this.ended = !0, this.trace("ended with status: code=" + q.code + ' details="' + q.details + '" start time=' + this.startTime.toISOString());
                let Y = Object.assign(Object.assign({}, q), {
                    progress: K
                });
                (_ = this.listener) === null || _ === void 0 || _.onReceiveStatus(Y), (z = this.onCallEnded) === null || z === void 0 || z.call(this, Y.code, Y.details, Y.metadata)
            }
        }
        doPick() {
            var q, K;
            if (this.ended) return;
            if (!this.metadata) throw Error("doPick called before start");
            this.trace("Pick called");
            let _ = this.metadata.clone(),
                z = this.channel.doPick(_, this.callConfig.pickInformation),
                Y = z.subchannel ? "(" + z.subchannel.getChannelzRef().id + ") " + z.subchannel.getAddress() : "" + z.subchannel;
            switch (this.trace("Pick result: " + vq8.PickResultType[z.pickResultType] + " subchannel: " + Y + " status: " + ((q = z.status) === null || q === void 0 ? void 0 : q.code) + " " + ((K = z.status) === null || K === void 0 ? void 0 : K.details)), z.pickResultType) {
                case vq8.PickResultType.COMPLETE:
                    this.credentials.compose(z.subchannel.getCallCredentials()).generateMetadata({
                        method_name: this.methodName,
                        service_url: this.serviceUrl
                    }).then(($) => {
                        var j;
                        if (this.ended) {
                            this.trace("Credentials metadata generation finished after call ended");
                            return
                        }
                        if (_.merge($), _.get("authorization").length > 1) this.outputStatus({
                            code: CB8.Status.INTERNAL,
                            details: '"authorization" metadata cannot have multiple values',
                            metadata: new bB8.Metadata
                        }, "PROCESSED");
                        if (z.subchannel.getConnectivityState() !== rqK.ConnectivityState.READY) {
                            this.trace("Picked subchannel " + Y + " has state " + rqK.ConnectivityState[z.subchannel.getConnectivityState()] + " after getting credentials metadata. Retrying pick"), this.doPick();
                            return
                        }
                        if (this.deadline !== 1 / 0) _.set("grpc-timeout", (0, oqK.getDeadlineTimeoutString)(this.deadline));
                        try {
                            this.child = z.subchannel.getRealSubchannel().createCall(_, this.host, this.methodName, {
                                onReceiveMetadata: (H) => {
                                    this.trace("Received metadata"), this.listener.onReceiveMetadata(H)
                                },
                                onReceiveMessage: (H) => {
                                    this.trace("Received message"), this.listener.onReceiveMessage(H)
                                },
                                onReceiveStatus: (H) => {
                                    if (this.trace("Received status"), H.rstCode === uQz.constants.NGHTTP2_REFUSED_STREAM) this.outputStatus(H, "REFUSED");
                                    else this.outputStatus(H, "PROCESSED")
                                }
                            }), this.childStartTime = new Date
                        } catch (H) {
                            this.trace("Failed to start call on picked subchannel " + Y + " with error " + H.message), this.outputStatus({
                                code: CB8.Status.INTERNAL,
                                details: "Failed to start HTTP/2 stream with error " + H.message,
                                metadata: new bB8.Metadata
                            }, "NOT_STARTED");
                            return
                        }
                        if ((j = z.onCallStarted) === null || j === void 0 || j.call(z), this.onCallEnded = z.onCallEnded, this.trace("Created child call [" + this.child.getCallNumber() + "]"), this.readPending) this.child.startRead();
                        if (this.pendingMessage) this.child.sendMessageWithContext(this.pendingMessage.context, this.pendingMessage.message);
                        if (this.pendingHalfClose) this.child.halfClose()
                    }, ($) => {
                        let {
                            code: j,
                            details: H
                        } = (0, ae1.restrictControlPlaneStatusCode)(typeof $.code === "number" ? $.code : CB8.Status.UNKNOWN, `Getting metadata from plugin failed with error: ${$.message}`);
                        this.outputStatus({
                            code: j,
                            details: H,
                            metadata: new bB8.Metadata
                        }, "PROCESSED")
                    });
                    break;
                case vq8.PickResultType.DROP:
                    let {
                        code: O, details: w
                    } = (0, ae1.restrictControlPlaneStatusCode)(z.status.code, z.status.details);
                    setImmediate(() => {
                        this.outputStatus({
                            code: O,
                            details: w,
                            metadata: z.status.metadata
                        }, "DROP")
                    });
                    break;
                case vq8.PickResultType.TRANSIENT_FAILURE:
                    if (this.metadata.getOptions().waitForReady) this.channel.queueCallForPick(this);
                    else {
                        let {
                            code: $,
                            details: j
                        } = (0, ae1.restrictControlPlaneStatusCode)(z.status.code, z.status.details);
                        setImmediate(() => {
                            this.outputStatus({
                                code: $,
                                details: j,
                                metadata: z.status.metadata
                            }, "PROCESSED")
                        })
                    }
                    break;
                case vq8.PickResultType.QUEUE:
                    this.channel.queueCallForPick(this)
            }
        }
        cancelWithStatus(q, K) {
            var _;
            this.trace("cancelWithStatus code: " + q + ' details: "' + K + '"'), (_ = this.child) === null || _ === void 0 || _.cancelWithStatus(q, K), this.outputStatus({
                code: q,
                details: K,
                metadata: new bB8.Metadata
            }, "PROCESSED")
        }
        getPeer() {
            var q, K;
            return (K = (q = this.child) === null || q === void 0 ? void 0 : q.getPeer()) !== null && K !== void 0 ? K : this.channel.getTarget()
        }
        start(q, K) {
            this.trace("start called"), this.listener = K, this.metadata = q, this.doPick()
        }
        sendMessageWithContext(q, K) {
            if (this.trace("write() called with message of length " + K.length), this.child) this.child.sendMessageWithContext(q, K);
            else this.pendingMessage = {
                context: q,
                message: K
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
        setCredentials(q) {
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
    sqK.LoadBalancingCall = aqK
})
// @from(Ln 318215, Col 4)
Y4K = p((_4K) => {
    Object.defineProperty(_4K, "__esModule", {
        value: !0
    });
    _4K.ResolvingCall = void 0;
    var BQz = um8(),
        qX6 = e_(),
        KX6 = CS6(),
        q4K = QD(),
        pQz = o2(),
        FQz = Pq8(),
        gQz = "resolving_call";
    class K4K {
        constructor(q, K, _, z, Y) {
            if (this.channel = q, this.method = K, this.filterStackFactory = z, this.callNumber = Y, this.child = null, this.readPending = !1, this.pendingMessage = null, this.pendingHalfClose = !1, this.ended = !1, this.readFilterPending = !1, this.writeFilterPending = !1, this.pendingChildStatus = null, this.metadata = null, this.listener = null, this.statusWatchers = [], this.deadlineTimer = setTimeout(() => {}, 0), this.filterStack = null, this.deadlineStartTime = null, this.configReceivedTime = null, this.childStartTime = null, this.credentials = BQz.CallCredentials.createEmpty(), this.deadline = _.deadline, this.host = _.host, _.parentCall) {
                if (_.flags & qX6.Propagate.CANCELLATION) _.parentCall.on("cancelled", () => {
                    this.cancelWithStatus(qX6.Status.CANCELLED, "Cancelled by parent call")
                });
                if (_.flags & qX6.Propagate.DEADLINE) this.trace("Propagating deadline from parent: " + _.parentCall.getDeadline()), this.deadline = (0, KX6.minDeadline)(this.deadline, _.parentCall.getDeadline())
            }
            this.trace("Created"), this.runDeadlineTimer()
        }
        trace(q) {
            pQz.trace(qX6.LogVerbosity.DEBUG, gQz, "[" + this.callNumber + "] " + q)
        }
        runDeadlineTimer() {
            clearTimeout(this.deadlineTimer), this.deadlineStartTime = new Date, this.trace("Deadline: " + (0, KX6.deadlineToString)(this.deadline));
            let q = (0, KX6.getRelativeTimeout)(this.deadline);
            if (q !== 1 / 0) {
                this.trace("Deadline will be reached in " + q + "ms");
                let K = () => {
                    if (!this.deadlineStartTime) {
                        this.cancelWithStatus(qX6.Status.DEADLINE_EXCEEDED, "Deadline exceeded");
                        return
                    }
                    let _ = [],
                        z = new Date;
                    if (_.push(`Deadline exceeded after ${(0,KX6.formatDateDifference)(this.deadlineStartTime,z)}`), this.configReceivedTime) {
                        if (this.configReceivedTime > this.deadlineStartTime) _.push(`name resolution: ${(0,KX6.formatDateDifference)(this.deadlineStartTime,this.configReceivedTime)}`);
                        if (this.childStartTime) {
                            if (this.childStartTime > this.configReceivedTime) _.push(`metadata filters: ${(0,KX6.formatDateDifference)(this.configReceivedTime,this.childStartTime)}`)
                        } else _.push("waiting for metadata filters")
                    } else _.push("waiting for name resolution");
                    if (this.child) _.push(...this.child.getDeadlineInfo());
                    this.cancelWithStatus(qX6.Status.DEADLINE_EXCEEDED, _.join(","))
                };
                if (q <= 0) process.nextTick(K);
                else this.deadlineTimer = setTimeout(K, q)
            }
        }
        outputStatus(q) {
            if (!this.ended) {
                if (this.ended = !0, !this.filterStack) this.filterStack = this.filterStackFactory.createFilter();
                clearTimeout(this.deadlineTimer);
                let K = this.filterStack.receiveTrailers(q);
                this.trace("ended with status: code=" + K.code + ' details="' + K.details + '"'), this.statusWatchers.forEach((_) => _(K)), process.nextTick(() => {
                    var _;
                    (_ = this.listener) === null || _ === void 0 || _.onReceiveStatus(K)
                })
            }
        }
        sendMessageOnChild(q, K) {
            if (!this.child) throw Error("sendMessageonChild called with child not populated");
            let _ = this.child;
            this.writeFilterPending = !0, this.filterStack.sendMessage(Promise.resolve({
                message: K,
                flags: q.flags
            })).then((z) => {
                if (this.writeFilterPending = !1, _.sendMessageWithContext(q, z.message), this.pendingHalfClose) _.halfClose()
            }, (z) => {
                this.cancelWithStatus(z.code, z.details)
            })
        }
        getConfig() {
            if (this.ended) return;
            if (!this.metadata || !this.listener) throw Error("getConfig called before start");
            let q = this.channel.getConfig(this.method, this.metadata);
            if (q.type === "NONE") {
                this.channel.queueCallForConfig(this);
                return
            } else if (q.type === "ERROR") {
                if (this.metadata.getOptions().waitForReady) this.channel.queueCallForConfig(this);
                else this.outputStatus(q.error);
                return
            }
            this.configReceivedTime = new Date;
            let K = q.config;
            if (K.status !== qX6.Status.OK) {
                let {
                    code: _,
                    details: z
                } = (0, FQz.restrictControlPlaneStatusCode)(K.status, "Failed to route call to method " + this.method);
                this.outputStatus({
                    code: _,
                    details: z,
                    metadata: new q4K.Metadata
                });
                return
            }
            if (K.methodConfig.timeout) {
                let _ = new Date;
                _.setSeconds(_.getSeconds() + K.methodConfig.timeout.seconds), _.setMilliseconds(_.getMilliseconds() + K.methodConfig.timeout.nanos / 1e6), this.deadline = (0, KX6.minDeadline)(this.deadline, _), this.runDeadlineTimer()
            }
            this.filterStackFactory.push(K.dynamicFilterFactories), this.filterStack = this.filterStackFactory.createFilter(), this.filterStack.sendMetadata(Promise.resolve(this.metadata)).then((_) => {
                if (this.child = this.channel.createRetryingCall(K, this.method, this.host, this.credentials, this.deadline), this.trace("Created child [" + this.child.getCallNumber() + "]"), this.childStartTime = new Date, this.child.start(_, {
                        onReceiveMetadata: (z) => {
                            this.trace("Received metadata"), this.listener.onReceiveMetadata(this.filterStack.receiveMetadata(z))
                        },
                        onReceiveMessage: (z) => {
                            this.trace("Received message"), this.readFilterPending = !0, this.filterStack.receiveMessage(z).then((Y) => {
                                if (this.trace("Finished filtering received message"), this.readFilterPending = !1, this.listener.onReceiveMessage(Y), this.pendingChildStatus) this.outputStatus(this.pendingChildStatus)
                            }, (Y) => {
                                this.cancelWithStatus(Y.code, Y.details)
                            })
                        },
                        onReceiveStatus: (z) => {
                            if (this.trace("Received status"), this.readFilterPending) this.pendingChildStatus = z;
                            else this.outputStatus(z)
                        }
                    }), this.readPending) this.child.startRead();
                if (this.pendingMessage) this.sendMessageOnChild(this.pendingMessage.context, this.pendingMessage.message);
                else if (this.pendingHalfClose) this.child.halfClose()
            }, (_) => {
                this.outputStatus(_)
            })
        }
        reportResolverError(q) {
            var K;
            if ((K = this.metadata) === null || K === void 0 ? void 0 : K.getOptions().waitForReady) this.channel.queueCallForConfig(this);
            else this.outputStatus(q)
        }
        cancelWithStatus(q, K) {
            var _;
            this.trace("cancelWithStatus code: " + q + ' details: "' + K + '"'), (_ = this.child) === null || _ === void 0 || _.cancelWithStatus(q, K), this.outputStatus({
                code: q,
                details: K,
                metadata: new q4K.Metadata
            })
        }
        getPeer() {
            var q, K;
            return (K = (q = this.child) === null || q === void 0 ? void 0 : q.getPeer()) !== null && K !== void 0 ? K : this.channel.getTarget()
        }
        start(q, K) {
            this.trace("start called"), this.metadata = q.clone(), this.listener = K, this.getConfig()
        }
        sendMessageWithContext(q, K) {
            if (this.trace("write() called with message of length " + K.length), this.child) this.sendMessageOnChild(q, K);
            else this.pendingMessage = {
                context: q,
                message: K
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
        setCredentials(q) {
            this.credentials = q
        }
        addStatusWatcher(q) {
            this.statusWatchers.push(q)
        }
        getCallNumber() {
            return this.callNumber
        }
        getAuthContext() {
            if (this.child) return this.child.getAuthContext();
            else return null
        }
    }
    _4K.ResolvingCall = K4K
})
// @from(Ln 318392, Col 4)
H4K = p(($4K) => {
    Object.defineProperty($4K, "__esModule", {
        value: !0
    });
    $4K.RetryingCall = $4K.MessageBufferTracker = $4K.RetryThrottler = void 0;
    var IB8 = e_(),
        UQz = CS6(),
        QQz = QD(),
        dQz = o2(),
        cQz = "retrying_call";
    class A4K {
        constructor(q, K, _) {
            if (this.maxTokens = q, this.tokenRatio = K, _) this.tokens = _.tokens * (q / _.maxTokens);
            else this.tokens = q
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
    $4K.RetryThrottler = A4K;
    class O4K {
        constructor(q, K) {
            this.totalLimit = q, this.limitPerCall = K, this.totalAllocated = 0, this.allocatedPerCall = new Map
        }
        allocate(q, K) {
            var _;
            let z = (_ = this.allocatedPerCall.get(K)) !== null && _ !== void 0 ? _ : 0;
            if (this.limitPerCall - z < q || this.totalLimit - this.totalAllocated < q) return !1;
            return this.allocatedPerCall.set(K, z + q), this.totalAllocated += q, !0
        }
        free(q, K) {
            var _;
            if (this.totalAllocated < q) throw Error(`Invalid buffer allocation state: call ${K} freed ${q} > total allocated ${this.totalAllocated}`);
            this.totalAllocated -= q;
            let z = (_ = this.allocatedPerCall.get(K)) !== null && _ !== void 0 ? _ : 0;
            if (z < q) throw Error(`Invalid buffer allocation state: call ${K} freed ${q} > allocated for call ${z}`);
            this.allocatedPerCall.set(K, z - q)
        }
        freeAll(q) {
            var K;
            let _ = (K = this.allocatedPerCall.get(q)) !== null && K !== void 0 ? K : 0;
            if (this.totalAllocated < _) throw Error(`Invalid buffer allocation state: call ${q} allocated ${_} > total allocated ${this.totalAllocated}`);
            this.totalAllocated -= _, this.allocatedPerCall.delete(q)
        }
    }
    $4K.MessageBufferTracker = O4K;
    var se1 = "grpc-previous-rpc-attempts",
        lQz = 5;
    class w4K {
        constructor(q, K, _, z, Y, A, O, w, $) {
            var j;
            this.channel = q, this.callConfig = K, this.methodName = _, this.host = z, this.credentials = Y, this.deadline = A, this.callNumber = O, this.bufferTracker = w, this.retryThrottler = $, this.listener = null, this.initialMetadata = null, this.underlyingCalls = [], this.writeBuffer = [], this.writeBufferOffset = 0, this.readStarted = !1, this.transparentRetryUsed = !1, this.attempts = 0, this.hedgingTimer = null, this.committedCallIndex = null, this.initialRetryBackoffSec = 0, this.nextRetryBackoffSec = 0;
            let H = (j = q.getOptions()["grpc-node.retry_max_attempts_limit"]) !== null && j !== void 0 ? j : lQz;
            if (q.getOptions()["grpc.enable_retries"] === 0) this.state = "NO_RETRY", this.maxAttempts = 1;
            else if (K.methodConfig.retryPolicy) {
                this.state = "RETRY";
                let J = K.methodConfig.retryPolicy;
                this.nextRetryBackoffSec = this.initialRetryBackoffSec = Number(J.initialBackoff.substring(0, J.initialBackoff.length - 1)), this.maxAttempts = Math.min(J.maxAttempts, H)
            } else if (K.methodConfig.hedgingPolicy) this.state = "HEDGING", this.maxAttempts = Math.min(K.methodConfig.hedgingPolicy.maxAttempts, H);
            else this.state = "TRANSPARENT_ONLY", this.maxAttempts = 1;
            this.startTime = new Date
        }
        getDeadlineInfo() {
            if (this.underlyingCalls.length === 0) return [];
            let q = [],
                K = this.underlyingCalls[this.underlyingCalls.length - 1];
            if (this.underlyingCalls.length > 1) q.push(`previous attempts: ${this.underlyingCalls.length-1}`);
            if (K.startTime > this.startTime) q.push(`time to current attempt start: ${(0,UQz.formatDateDifference)(this.startTime,K.startTime)}`);
            return q.push(...K.call.getDeadlineInfo()), q
        }
        getCallNumber() {
            return this.callNumber
        }
        trace(q) {
            dQz.trace(IB8.LogVerbosity.DEBUG, cQz, "[" + this.callNumber + "] " + q)
        }
        reportStatus(q) {
            this.trace("ended with status: code=" + q.code + ' details="' + q.details + '" start time=' + this.startTime.toISOString()), this.bufferTracker.freeAll(this.callNumber), this.writeBufferOffset = this.writeBufferOffset + this.writeBuffer.length, this.writeBuffer = [], process.nextTick(() => {
                var K;
                (K = this.listener) === null || K === void 0 || K.onReceiveStatus({
                    code: q.code,
                    details: q.details,
                    metadata: q.metadata
                })
            })
        }
        cancelWithStatus(q, K) {
            this.trace("cancelWithStatus code: " + q + ' details: "' + K + '"'), this.reportStatus({
                code: q,
                details: K,
                metadata: new QQz.Metadata
            });
            for (let {
                    call: _
                }
                of this.underlyingCalls) _.cancelWithStatus(q, K)
        }
        getPeer() {
            if (this.committedCallIndex !== null) return this.underlyingCalls[this.committedCallIndex].call.getPeer();
            else return "unknown"
        }
        getBufferEntry(q) {
            var K;
            return (K = this.writeBuffer[q - this.writeBufferOffset]) !== null && K !== void 0 ? K : {
                entryType: "FREED",
                allocated: !1
            }
        }
        getNextBufferIndex() {
            return this.writeBufferOffset + this.writeBuffer.length
        }
        clearSentMessages() {
            if (this.state !== "COMMITTED") return;
            let q;
            if (this.underlyingCalls[this.committedCallIndex].state === "COMPLETED") q = this.getNextBufferIndex();
            else q = this.underlyingCalls[this.committedCallIndex].nextMessageToSend;
            for (let K = this.writeBufferOffset; K < q; K++) {
                let _ = this.getBufferEntry(K);
                if (_.allocated) this.bufferTracker.free(_.message.message.length, this.callNumber)
            }
            this.writeBuffer = this.writeBuffer.slice(q - this.writeBufferOffset), this.writeBufferOffset = q
        }
        commitCall(q) {
            var K, _;
            if (this.state === "COMMITTED") return;
            this.trace("Committing call [" + this.underlyingCalls[q].call.getCallNumber() + "] at index " + q), this.state = "COMMITTED", (_ = (K = this.callConfig).onCommitted) === null || _ === void 0 || _.call(K), this.committedCallIndex = q;
            for (let z = 0; z < this.underlyingCalls.length; z++) {
                if (z === q) continue;
                if (this.underlyingCalls[z].state === "COMPLETED") continue;
                this.underlyingCalls[z].state = "COMPLETED", this.underlyingCalls[z].call.cancelWithStatus(IB8.Status.CANCELLED, "Discarded in favor of other hedged attempt")
            }
            this.clearSentMessages()
        }
        commitCallWithMostMessages() {
            if (this.state === "COMMITTED") return;
            let q = -1,
                K = -1;
            for (let [_, z] of this.underlyingCalls.entries())
                if (z.state === "ACTIVE" && z.nextMessageToSend > q) q = z.nextMessageToSend, K = _;
            if (K === -1) this.state = "TRANSPARENT_ONLY";
            else this.commitCall(K)
        }
        isStatusCodeInList(q, K) {
            return q.some((_) => {
                var z;
                return _ === K || _.toString().toLowerCase() === ((z = IB8.Status[K]) === null || z === void 0 ? void 0 : z.toLowerCase())
            })
        }
        getNextRetryJitter() {
            return Math.random() * 0.3999999999999999 + 0.8
        }
        getNextRetryBackoffMs() {
            var q;
            let K = (q = this.callConfig) === null || q === void 0 ? void 0 : q.methodConfig.retryPolicy;
            if (!K) return 0;
            let z = this.getNextRetryJitter() * this.nextRetryBackoffSec * 1000,
                Y = Number(K.maxBackoff.substring(0, K.maxBackoff.length - 1));
            return this.nextRetryBackoffSec = Math.min(this.nextRetryBackoffSec * K.backoffMultiplier, Y), z
        }
        maybeRetryCall(q, K) {
            if (this.state !== "RETRY") {
                K(!1);
                return
            }
            if (this.attempts >= this.maxAttempts) {
                K(!1);
                return
            }
            let _;
            if (q === null) _ = this.getNextRetryBackoffMs();
            else if (q < 0) {
                this.state = "TRANSPARENT_ONLY", K(!1);
                return
            } else _ = q, this.nextRetryBackoffSec = this.initialRetryBackoffSec;
            setTimeout(() => {
                var z, Y;
                if (this.state !== "RETRY") {
                    K(!1);
                    return
                }
                if ((Y = (z = this.retryThrottler) === null || z === void 0 ? void 0 : z.canRetryCall()) !== null && Y !== void 0 ? Y : !0) K(!0), this.attempts += 1, this.startNewAttempt();
                else this.trace("Retry attempt denied by throttling policy"), K(!1)
            }, _)
        }
        countActiveCalls() {
            let q = 0;
            for (let K of this.underlyingCalls)
                if ((K === null || K === void 0 ? void 0 : K.state) === "ACTIVE") q += 1;
            return q
        }
        handleProcessedStatus(q, K, _) {
            var z, Y, A;
            switch (this.state) {
                case "COMMITTED":
                case "NO_RETRY":
                case "TRANSPARENT_ONLY":
                    this.commitCall(K), this.reportStatus(q);
                    break;
                case "HEDGING":
                    if (this.isStatusCodeInList((z = this.callConfig.methodConfig.hedgingPolicy.nonFatalStatusCodes) !== null && z !== void 0 ? z : [], q.code)) {
                        (Y = this.retryThrottler) === null || Y === void 0 || Y.addCallFailed();
                        let O;
                        if (_ === null) O = 0;
                        else if (_ < 0) {
                            this.state = "TRANSPARENT_ONLY", this.commitCall(K), this.reportStatus(q);
                            return
                        } else O = _;
                        setTimeout(() => {
                            if (this.maybeStartHedgingAttempt(), this.countActiveCalls() === 0) this.commitCall(K), this.reportStatus(q)
                        }, O)
                    } else this.commitCall(K), this.reportStatus(q);
                    break;
                case "RETRY":
                    if (this.isStatusCodeInList(this.callConfig.methodConfig.retryPolicy.retryableStatusCodes, q.code))(A = this.retryThrottler) === null || A === void 0 || A.addCallFailed(), this.maybeRetryCall(_, (O) => {
                        if (!O) this.commitCall(K), this.reportStatus(q)
                    });
                    else this.commitCall(K), this.reportStatus(q);
                    break
            }
        }
        getPushback(q) {
            let K = q.get("grpc-retry-pushback-ms");
            if (K.length === 0) return null;
            try {
                return parseInt(K[0])
            } catch (_) {
                return -1
            }
        }
        handleChildStatus(q, K) {
            var _;
            if (this.underlyingCalls[K].state === "COMPLETED") return;
            if (this.trace("state=" + this.state + " handling status with progress " + q.progress + " from child [" + this.underlyingCalls[K].call.getCallNumber() + "] in state " + this.underlyingCalls[K].state), this.underlyingCalls[K].state = "COMPLETED", q.code === IB8.Status.OK) {
                (_ = this.retryThrottler) === null || _ === void 0 || _.addCallSucceeded(), this.commitCall(K), this.reportStatus(q);
                return
            }
            if (this.state === "NO_RETRY") {
                this.commitCall(K), this.reportStatus(q);
                return
            }
            if (this.state === "COMMITTED") {
                this.reportStatus(q);
                return
            }
            let z = this.getPushback(q.metadata);
            switch (q.progress) {
                case "NOT_STARTED":
                    this.startNewAttempt();
                    break;
                case "REFUSED":
                    if (this.transparentRetryUsed) this.handleProcessedStatus(q, K, z);
                    else this.transparentRetryUsed = !0, this.startNewAttempt();
                    break;
                case "DROP":
                    this.commitCall(K), this.reportStatus(q);
                    break;
                case "PROCESSED":
                    this.handleProcessedStatus(q, K, z);
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
            var q, K, _;
            if (this.hedgingTimer) clearTimeout(this.hedgingTimer);
            if (this.state !== "HEDGING") return;
            if (!this.callConfig.methodConfig.hedgingPolicy) return;
            let z = this.callConfig.methodConfig.hedgingPolicy;
            if (this.attempts >= this.maxAttempts) return;
            let Y = (q = z.hedgingDelay) !== null && q !== void 0 ? q : "0s",
                A = Number(Y.substring(0, Y.length - 1));
            this.hedgingTimer = setTimeout(() => {
                this.maybeStartHedgingAttempt()
            }, A * 1000), (_ = (K = this.hedgingTimer).unref) === null || _ === void 0 || _.call(K)
        }
        startNewAttempt() {
            let q = this.channel.createLoadBalancingCall(this.callConfig, this.methodName, this.host, this.credentials, this.deadline);
            this.trace("Created child call [" + q.getCallNumber() + "] for attempt " + this.attempts);
            let K = this.underlyingCalls.length;
            this.underlyingCalls.push({
                state: "ACTIVE",
                call: q,
                nextMessageToSend: 0,
                startTime: new Date
            });
            let _ = this.attempts - 1,
                z = this.initialMetadata.clone();
            if (_ > 0) z.set(se1, `${_}`);
            let Y = !1;
            if (q.start(z, {
                    onReceiveMetadata: (A) => {
                        if (this.trace("Received metadata from child [" + q.getCallNumber() + "]"), this.commitCall(K), Y = !0, _ > 0) A.set(se1, `${_}`);
                        if (this.underlyingCalls[K].state === "ACTIVE") this.listener.onReceiveMetadata(A)
                    },
                    onReceiveMessage: (A) => {
                        if (this.trace("Received message from child [" + q.getCallNumber() + "]"), this.commitCall(K), this.underlyingCalls[K].state === "ACTIVE") this.listener.onReceiveMessage(A)
                    },
                    onReceiveStatus: (A) => {
                        if (this.trace("Received status from child [" + q.getCallNumber() + "]"), !Y && _ > 0) A.metadata.set(se1, `${_}`);
                        this.handleChildStatus(A, K)
                    }
                }), this.sendNextChildMessage(K), this.readStarted) q.startRead()
        }
        start(q, K) {
            this.trace("start called"), this.listener = K, this.initialMetadata = q, this.attempts += 1, this.startNewAttempt(), this.maybeStartHedgingTimer()
        }
        handleChildWriteCompleted(q) {
            var K, _;
            let z = this.underlyingCalls[q],
                Y = z.nextMessageToSend;
            (_ = (K = this.getBufferEntry(Y)).callback) === null || _ === void 0 || _.call(K), this.clearSentMessages(), z.nextMessageToSend += 1, this.sendNextChildMessage(q)
        }
        sendNextChildMessage(q) {
            let K = this.underlyingCalls[q];
            if (K.state === "COMPLETED") return;
            if (this.getBufferEntry(K.nextMessageToSend)) {
                let _ = this.getBufferEntry(K.nextMessageToSend);
                switch (_.entryType) {
                    case "MESSAGE":
                        K.call.sendMessageWithContext({
                            callback: (z) => {
                                this.handleChildWriteCompleted(q)
                            }
                        }, _.message.message);
                        break;
                    case "HALF_CLOSE":
                        K.nextMessageToSend += 1, K.call.halfClose();
                        break;
                    case "FREED":
                        break
                }
            }
        }
        sendMessageWithContext(q, K) {
            var _;
            this.trace("write() called with message of length " + K.length);
            let z = {
                    message: K,
                    flags: q.flags
                },
                Y = this.getNextBufferIndex(),
                A = {
                    entryType: "MESSAGE",
                    message: z,
                    allocated: this.bufferTracker.allocate(K.length, this.callNumber)
                };
            if (this.writeBuffer.push(A), A.allocated) {
                (_ = q.callback) === null || _ === void 0 || _.call(q);
                for (let [O, w] of this.underlyingCalls.entries())
                    if (w.state === "ACTIVE" && w.nextMessageToSend === Y) w.call.sendMessageWithContext({
                        callback: ($) => {
                            this.handleChildWriteCompleted(O)
                        }
                    }, K)
            } else {
                if (this.commitCallWithMostMessages(), this.committedCallIndex === null) return;
                let O = this.underlyingCalls[this.committedCallIndex];
                if (A.callback = q.callback, O.state === "ACTIVE" && O.nextMessageToSend === Y) O.call.sendMessageWithContext({
                    callback: (w) => {
                        this.handleChildWriteCompleted(this.committedCallIndex)
                    }
                }, K)
            }
        }
        startRead() {
            this.trace("startRead called"), this.readStarted = !0;
            for (let q of this.underlyingCalls)
                if ((q === null || q === void 0 ? void 0 : q.state) === "ACTIVE") q.call.startRead()
        }
        halfClose() {
            this.trace("halfClose called");
            let q = this.getNextBufferIndex();
            this.writeBuffer.push({
                entryType: "HALF_CLOSE",
                allocated: !1
            });
            for (let K of this.underlyingCalls)
                if ((K === null || K === void 0 ? void 0 : K.state) === "ACTIVE" && K.nextMessageToSend === q) K.nextMessageToSend += 1, K.call.halfClose()
        }
        setCredentials(q) {
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
    $4K.RetryingCall = w4K
})
// @from(Ln 318798, Col 4)
Tq8 = p((X4K) => {
    Object.defineProperty(X4K, "__esModule", {
        value: !0
    });
    X4K.BaseSubchannelWrapper = void 0;
    class J4K {
        constructor(q) {
            this.child = q, this.healthy = !0, this.healthListeners = new Set, this.refcount = 0, this.dataWatchers = new Set, q.addHealthStateWatcher((K) => {
                if (this.healthy) this.updateHealthListeners()
            })
        }
        updateHealthListeners() {
            for (let q of this.healthListeners) q(this.isHealthy())
        }
        getConnectivityState() {
            return this.child.getConnectivityState()
        }
        addConnectivityStateListener(q) {
            this.child.addConnectivityStateListener(q)
        }
        removeConnectivityStateListener(q) {
            this.child.removeConnectivityStateListener(q)
        }
        startConnecting() {
            this.child.startConnecting()
        }
        getAddress() {
            return this.child.getAddress()
        }
        throttleKeepalive(q) {
            this.child.throttleKeepalive(q)
        }
        ref() {
            this.child.ref(), this.refcount += 1
        }
        unref() {
            if (this.child.unref(), this.refcount -= 1, this.refcount === 0) this.destroy()
        }
        destroy() {
            for (let q of this.dataWatchers) q.destroy()
        }
        getChannelzRef() {
            return this.child.getChannelzRef()
        }
        isHealthy() {
            return this.healthy && this.child.isHealthy()
        }
        addHealthStateWatcher(q) {
            this.healthListeners.add(q)
        }
        removeHealthStateWatcher(q) {
            this.healthListeners.delete(q)
        }
        addDataWatcher(q) {
            q.setSubchannel(this.getRealSubchannel()), this.dataWatchers.add(q)
        }
        setHealthy(q) {
            if (q !== this.healthy) {
                if (this.healthy = q, this.child.isHealthy()) this.updateHealthListeners()
            }
        }
        getRealSubchannel() {
            return this.child.getRealSubchannel()
        }
        realSubchannelEquals(q) {
            return this.getRealSubchannel() === q.getRealSubchannel()
        }
        getCallCredentials() {
            return this.child.getCallCredentials()
        }
        getChannel() {
            return this.child.getChannel()
        }
    }
    X4K.BaseSubchannelWrapper = J4K
})
// @from(Ln 318874, Col 4)
K67 = p((G4K) => {
    Object.defineProperty(G4K, "__esModule", {
        value: !0
    });
    G4K.InternalChannel = G4K.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = void 0;
    var rQz = DS6(),
        oQz = c6K(),
        aQz = iqK(),
        q67 = Mt(),
        sQz = QD(),
        u36 = e_(),
        tQz = NB8(),
        eQz = me1(),
        P4K = GF(),
        xB8 = o2(),
        qdz = le1(),
        uB8 = nk(),
        Qx = ik(),
        Vq8 = I36(),
        Kdz = eqK(),
        _dz = CS6(),
        zdz = Y4K(),
        te1 = VB8(),
        Ydz = Pq8(),
        ee1 = H4K(),
        Adz = Tq8(),
        Odz = 2147483647,
        wdz = 1000,
        $dz = 1800000,
        mB8 = new Map,
        jdz = 16777216,
        Hdz = 1048576;
    class W4K extends Adz.BaseSubchannelWrapper {
        constructor(q, K) {
            super(q);
            this.channel = K, this.refCount = 0, this.subchannelStateListener = (_, z, Y, A) => {
                K.throttleKeepalive(A)
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
    class D4K {
        pick(q) {
            return {
                pickResultType: q67.PickResultType.DROP,
                status: {
                    code: u36.Status.UNAVAILABLE,
                    details: "Channel closed before call started",
                    metadata: new sQz.Metadata
                },
                subchannel: null,
                onCallStarted: null,
                onCallEnded: null
            }
        }
    }
    G4K.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = "grpc.internal.no_subchannel";
    class Z4K {
        constructor(q) {
            this.target = q, this.trace = new Vq8.ChannelzTrace, this.callTracker = new Vq8.ChannelzCallTracker, this.childrenTracker = new Vq8.ChannelzChildrenTracker, this.state = Qx.ConnectivityState.IDLE
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
    class f4K {
        constructor(q, K, _) {
            var z, Y, A, O, w, $;
            if (this.credentials = K, this.options = _, this.connectivityState = Qx.ConnectivityState.IDLE, this.currentPicker = new q67.UnavailablePicker, this.configSelectionQueue = [], this.pickQueue = [], this.connectivityStateWatchers = [], this.callRefTimer = null, this.configSelector = null, this.currentResolutionError = null, this.wrappedSubchannels = new Set, this.callCount = 0, this.idleTimer = null, this.channelzEnabled = !0, this.randomChannelId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), typeof q !== "string") throw TypeError("Channel target must be a string");
            if (!(K instanceof rQz.ChannelCredentials)) throw TypeError("Channel credentials must be a ChannelCredentials object");
            if (_) {
                if (typeof _ !== "object") throw TypeError("Channel options must be an object")
            }
            this.channelzInfoTracker = new Z4K(q);
            let j = (0, uB8.parseUri)(q);
            if (j === null) throw Error(`Could not parse target name "${q}"`);
            let H = (0, P4K.mapUriDefaultScheme)(j);
            if (H === null) throw Error(`Could not find a default scheme for target name "${q}"`);
            if (this.options["grpc.enable_channelz"] === 0) this.channelzEnabled = !1;
            if (this.channelzRef = (0, Vq8.registerChannelzChannel)(q, this.channelzInfoTracker.getChannelzInfoCallback(), this.channelzEnabled), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Channel created");
            if (this.options["grpc.default_authority"]) this.defaultAuthority = this.options["grpc.default_authority"];
            else this.defaultAuthority = (0, P4K.getDefaultAuthority)(H);
            let J = (0, qdz.mapProxyName)(H, _);
            this.target = J.target, this.options = Object.assign({}, this.options, J.extraOptions), this.subchannelPool = (0, aQz.getSubchannelPool)(((z = this.options["grpc.use_local_subchannel_pool"]) !== null && z !== void 0 ? z : 0) === 0), this.retryBufferTracker = new ee1.MessageBufferTracker((Y = this.options["grpc.retry_buffer_size"]) !== null && Y !== void 0 ? Y : jdz, (A = this.options["grpc.per_rpc_retry_buffer_size"]) !== null && A !== void 0 ? A : Hdz), this.keepaliveTime = (O = this.options["grpc.keepalive_time_ms"]) !== null && O !== void 0 ? O : -1, this.idleTimeoutMs = Math.max((w = this.options["grpc.client_idle_timeout_ms"]) !== null && w !== void 0 ? w : $dz, wdz);
            let X = {
                createSubchannel: (P, W) => {
                    let D = {};
                    for (let [f, v] of Object.entries(W))
                        if (!f.startsWith(G4K.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX)) D[f] = v;
                    let Z = this.subchannelPool.getOrCreateSubchannel(this.target, P, D, this.credentials);
                    if (Z.throttleKeepalive(this.keepaliveTime), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Created subchannel or used existing subchannel", Z.getChannelzRef());
                    return new W4K(Z, this)
                },
                updateState: (P, W) => {
                    this.currentPicker = W;
                    let D = this.pickQueue.slice();
                    if (this.pickQueue = [], D.length > 0) this.callRefTimerUnref();
                    for (let Z of D) Z.doPick();
                    this.updateState(P)
                },
                requestReresolution: () => {
                    throw Error("Resolving load balancer should never call requestReresolution")
                },
                addChannelzChild: (P) => {
                    if (this.channelzEnabled) this.channelzInfoTracker.childrenTracker.refChild(P)
                },
                removeChannelzChild: (P) => {
                    if (this.channelzEnabled) this.channelzInfoTracker.childrenTracker.unrefChild(P)
                }
            };
            this.resolvingLoadBalancer = new oQz.ResolvingLoadBalancer(this.target, X, this.options, (P, W) => {
                var D;
                if (P.retryThrottling) mB8.set(this.getTarget(), new ee1.RetryThrottler(P.retryThrottling.maxTokens, P.retryThrottling.tokenRatio, mB8.get(this.getTarget())));
                else mB8.delete(this.getTarget());
                if (this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Address resolution succeeded");
                (D = this.configSelector) === null || D === void 0 || D.unref(), this.configSelector = W, this.currentResolutionError = null, process.nextTick(() => {
                    let Z = this.configSelectionQueue;
                    if (this.configSelectionQueue = [], Z.length > 0) this.callRefTimerUnref();
                    for (let G of Z) G.getConfig()
                })
            }, (P) => {
                if (this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_WARNING", "Address resolution failed with code " + P.code + ' and details "' + P.details + '"');
                if (this.configSelectionQueue.length > 0) this.trace("Name resolution failed with calls queued for config selection");
                if (this.configSelector === null) this.currentResolutionError = Object.assign(Object.assign({}, (0, Ydz.restrictControlPlaneStatusCode)(P.code, P.details)), {
                    metadata: P.metadata
                });
                let W = this.configSelectionQueue;
                if (this.configSelectionQueue = [], W.length > 0) this.callRefTimerUnref();
                for (let D of W) D.reportResolverError(P)
            }), this.filterStackFactory = new tQz.FilterStackFactory([new eQz.CompressionFilterFactory(this, this.options)]), this.trace("Channel constructed with options " + JSON.stringify(_, void 0, 2));
            let M = Error();
            if ((0, xB8.isTracerEnabled)("channel_stacktrace"))(0, xB8.trace)(u36.LogVerbosity.DEBUG, "channel_stacktrace", "(" + this.channelzRef.id + `) Channel constructed 
` + (($ = M.stack) === null || $ === void 0 ? void 0 : $.substring(M.stack.indexOf(`
`) + 1)));
            this.lastActivityTimestamp = new Date
        }
        trace(q, K) {
            (0, xB8.trace)(K !== null && K !== void 0 ? K : u36.LogVerbosity.DEBUG, "channel", "(" + this.channelzRef.id + ") " + (0, uB8.uriToString)(this.target) + " " + q)
        }
        callRefTimerRef() {
            var q, K, _, z;
            if (!this.callRefTimer) this.callRefTimer = setInterval(() => {}, Odz);
            if (!((K = (q = this.callRefTimer).hasRef) === null || K === void 0 ? void 0 : K.call(q))) this.trace("callRefTimer.ref | configSelectionQueue.length=" + this.configSelectionQueue.length + " pickQueue.length=" + this.pickQueue.length), (z = (_ = this.callRefTimer).ref) === null || z === void 0 || z.call(_)
        }
        callRefTimerUnref() {
            var q, K, _;
            if (!((q = this.callRefTimer) === null || q === void 0 ? void 0 : q.hasRef) || this.callRefTimer.hasRef()) this.trace("callRefTimer.unref | configSelectionQueue.length=" + this.configSelectionQueue.length + " pickQueue.length=" + this.pickQueue.length), (_ = (K = this.callRefTimer) === null || K === void 0 ? void 0 : K.unref) === null || _ === void 0 || _.call(K)
        }
        removeConnectivityStateWatcher(q) {
            let K = this.connectivityStateWatchers.findIndex((_) => _ === q);
            if (K >= 0) this.connectivityStateWatchers.splice(K, 1)
        }
        updateState(q) {
            if ((0, xB8.trace)(u36.LogVerbosity.DEBUG, "connectivity_state", "(" + this.channelzRef.id + ") " + (0, uB8.uriToString)(this.target) + " " + Qx.ConnectivityState[this.connectivityState] + " -> " + Qx.ConnectivityState[q]), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Connectivity state change to " + Qx.ConnectivityState[q]);
            this.connectivityState = q, this.channelzInfoTracker.state = q;
            let K = this.connectivityStateWatchers.slice();
            for (let _ of K)
                if (q !== _.currentState) {
                    if (_.timer) clearTimeout(_.timer);
                    this.removeConnectivityStateWatcher(_), _.callback()
                } if (q !== Qx.ConnectivityState.TRANSIENT_FAILURE) this.currentResolutionError = null
        }
        throttleKeepalive(q) {
            if (q > this.keepaliveTime) {
                this.keepaliveTime = q;
                for (let K of this.wrappedSubchannels) K.throttleKeepalive(q)
            }
        }
        addWrappedSubchannel(q) {
            this.wrappedSubchannels.add(q)
        }
        removeWrappedSubchannel(q) {
            this.wrappedSubchannels.delete(q)
        }
        doPick(q, K) {
            return this.currentPicker.pick({
                metadata: q,
                extraPickInfo: K
            })
        }
        queueCallForPick(q) {
            this.pickQueue.push(q), this.callRefTimerRef()
        }
        getConfig(q, K) {
            if (this.connectivityState !== Qx.ConnectivityState.SHUTDOWN) this.resolvingLoadBalancer.exitIdle();
            if (this.configSelector) return {
                type: "SUCCESS",
                config: this.configSelector.invoke(q, K, this.randomChannelId)
            };
            else if (this.currentResolutionError) return {
                type: "ERROR",
                error: this.currentResolutionError
            };
            else return {
                type: "NONE"
            }
        }
        queueCallForConfig(q) {
            this.configSelectionQueue.push(q), this.callRefTimerRef()
        }
        enterIdle() {
            if (this.resolvingLoadBalancer.destroy(), this.updateState(Qx.ConnectivityState.IDLE), this.currentPicker = new q67.QueuePicker(this.resolvingLoadBalancer), this.idleTimer) clearTimeout(this.idleTimer), this.idleTimer = null;
            if (this.callRefTimer) clearInterval(this.callRefTimer), this.callRefTimer = null
        }
        startIdleTimeout(q) {
            var K, _;
            this.idleTimer = setTimeout(() => {
                if (this.callCount > 0) {
                    this.startIdleTimeout(this.idleTimeoutMs);
                    return
                }
                let Y = new Date().valueOf() - this.lastActivityTimestamp.valueOf();
                if (Y >= this.idleTimeoutMs) this.trace("Idle timer triggered after " + this.idleTimeoutMs + "ms of inactivity"), this.enterIdle();
                else this.startIdleTimeout(this.idleTimeoutMs - Y)
            }, q), (_ = (K = this.idleTimer).unref) === null || _ === void 0 || _.call(K)
        }
        maybeStartIdleTimer() {
            if (this.connectivityState !== Qx.ConnectivityState.SHUTDOWN && !this.idleTimer) this.startIdleTimeout(this.idleTimeoutMs)
        }
        onCallStart() {
            if (this.channelzEnabled) this.channelzInfoTracker.callTracker.addCallStarted();
            this.callCount += 1
        }
        onCallEnd(q) {
            if (this.channelzEnabled)
                if (q.code === u36.Status.OK) this.channelzInfoTracker.callTracker.addCallSucceeded();
                else this.channelzInfoTracker.callTracker.addCallFailed();
            this.callCount -= 1, this.lastActivityTimestamp = new Date, this.maybeStartIdleTimer()
        }
        createLoadBalancingCall(q, K, _, z, Y) {
            let A = (0, te1.getNextCallNumber)();
            return this.trace("createLoadBalancingCall [" + A + '] method="' + K + '"'), new Kdz.LoadBalancingCall(this, q, K, _, z, Y, A)
        }
        createRetryingCall(q, K, _, z, Y) {
            let A = (0, te1.getNextCallNumber)();
            return this.trace("createRetryingCall [" + A + '] method="' + K + '"'), new ee1.RetryingCall(this, q, K, _, z, Y, A, this.retryBufferTracker, mB8.get(this.getTarget()))
        }
        createResolvingCall(q, K, _, z, Y) {
            let A = (0, te1.getNextCallNumber)();
            this.trace("createResolvingCall [" + A + '] method="' + q + '", deadline=' + (0, _dz.deadlineToString)(K));
            let O = {
                    deadline: K,
                    flags: Y !== null && Y !== void 0 ? Y : u36.Propagate.DEFAULTS,
                    host: _ !== null && _ !== void 0 ? _ : this.defaultAuthority,
                    parentCall: z
                },
                w = new zdz.ResolvingCall(this, q, O, this.filterStackFactory.clone(), A);
            return this.onCallStart(), w.addStatusWatcher(($) => {
                this.onCallEnd($)
            }), w
        }
        close() {
            var q;
            this.resolvingLoadBalancer.destroy(), this.updateState(Qx.ConnectivityState.SHUTDOWN), this.currentPicker = new D4K;
            for (let K of this.configSelectionQueue) K.cancelWithStatus(u36.Status.UNAVAILABLE, "Channel closed before call started");
            this.configSelectionQueue = [];
            for (let K of this.pickQueue) K.cancelWithStatus(u36.Status.UNAVAILABLE, "Channel closed before call started");
            if (this.pickQueue = [], this.callRefTimer) clearInterval(this.callRefTimer);
            if (this.idleTimer) clearTimeout(this.idleTimer);
            if (this.channelzEnabled)(0, Vq8.unregisterChannelzRef)(this.channelzRef);
            this.subchannelPool.unrefUnusedSubchannels(), (q = this.configSelector) === null || q === void 0 || q.unref(), this.configSelector = null
        }
        getTarget() {
            return (0, uB8.uriToString)(this.target)
        }
        getConnectivityState(q) {
            let K = this.connectivityState;
            if (q) this.resolvingLoadBalancer.exitIdle(), this.lastActivityTimestamp = new Date, this.maybeStartIdleTimer();
            return K
        }
        watchConnectivityState(q, K, _) {
            if (this.connectivityState === Qx.ConnectivityState.SHUTDOWN) throw Error("Channel has been shut down");
            let z = null;
            if (K !== 1 / 0) {
                let A = K instanceof Date ? K : new Date(K),
                    O = new Date;
                if (K === -1 / 0 || A <= O) {
                    process.nextTick(_, Error("Deadline passed without connectivity state change"));
                    return
                }
                z = setTimeout(() => {
                    this.removeConnectivityStateWatcher(Y), _(Error("Deadline passed without connectivity state change"))
                }, A.getTime() - O.getTime())
            }
            let Y = {
                currentState: q,
                callback: _,
                timer: z
            };
            this.connectivityStateWatchers.push(Y)
        }
        getChannelzRef() {
            return this.channelzRef
        }
        createCall(q, K, _, z, Y) {
            if (typeof q !== "string") throw TypeError("Channel#createCall: method must be a string");
            if (!(typeof K === "number" || K instanceof Date)) throw TypeError("Channel#createCall: deadline must be a number or Date");
            if (this.connectivityState === Qx.ConnectivityState.SHUTDOWN) throw Error("Channel has been shut down");
            return this.createResolvingCall(q, K, _, z, Y)
        }
        getOptions() {
            return this.options
        }
    }
    G4K.InternalChannel = f4K
})
// @from(Ln 319194, Col 4)
ut1 = p((k4K) => {
    Object.defineProperty(k4K, "__esModule", {
        value: !0
    });
    k4K.ChannelImplementation = void 0;
    var Jdz = DS6(),
        Xdz = K67();
    class V4K {
        constructor(q, K, _) {
            if (typeof q !== "string") throw TypeError("Channel target must be a string");
            if (!(K instanceof Jdz.ChannelCredentials)) throw TypeError("Channel credentials must be a ChannelCredentials object");
            if (_) {
                if (typeof _ !== "object") throw TypeError("Channel options must be an object")
            }
            this.internalChannel = new Xdz.InternalChannel(q, K, _)
        }
        close() {
            this.internalChannel.close()
        }
        getTarget() {
            return this.internalChannel.getTarget()
        }
        getConnectivityState(q) {
            return this.internalChannel.getConnectivityState(q)
        }
        watchConnectivityState(q, K, _) {
            this.internalChannel.watchConnectivityState(q, K, _)
        }
        getChannelzRef() {
            return this.internalChannel.getChannelzRef()
        }
        createCall(q, K, _, z, Y) {
            if (typeof q !== "string") throw TypeError("Channel#createCall: method must be a string");
            if (!(typeof K === "number" || K instanceof Date)) throw TypeError("Channel#createCall: deadline must be a number or Date");
            return this.internalChannel.createCall(q, K, _, z, Y)
        }
    }
    k4K.ChannelImplementation = V4K
})