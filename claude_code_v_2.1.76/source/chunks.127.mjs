
// @from(Ln 312977, Col 4)
Kg4 = x((Ag4) => {
    Object.defineProperty(Ag4, "__esModule", {
        value: !0
    });
    Ag4.Http2SubchannelCall = void 0;
    var rc = x6("http2"),
        nMY = x6("os"),
        v2 = a3(),
        oc = LX(),
        rMY = jI8(),
        oMY = zw(),
        aMY = a3(),
        sMY = "subchannel_call";

    function tMY(A) {
        for (let [q, K] of Object.entries(nMY.constants.errno))
            if (K === A) return q;
        return "Unknown system error " + A
    }

    function JI8(A) {
        let q = `Received HTTP status code ${A}`,
            K;
        switch (A) {
            case 400:
                K = v2.Status.INTERNAL;
                break;
            case 401:
                K = v2.Status.UNAUTHENTICATED;
                break;
            case 403:
                K = v2.Status.PERMISSION_DENIED;
                break;
            case 404:
                K = v2.Status.UNIMPLEMENTED;
                break;
            case 429:
            case 502:
            case 503:
            case 504:
                K = v2.Status.UNAVAILABLE;
                break;
            default:
                K = v2.Status.UNKNOWN
        }
        return {
            code: K,
            details: q,
            metadata: new oc.Metadata
        }
    }
    class eB4 {
        constructor(A, q, K, Y, z) {
            var _;
            this.http2Stream = A, this.callEventTracker = q, this.listener = K, this.transport = Y, this.callId = z, this.isReadFilterPending = !1, this.isPushPending = !1, this.canPush = !1, this.readsClosed = !1, this.statusOutput = !1, this.unpushedReadMessages = [], this.finalStatus = null, this.internalError = null, this.serverEndedCall = !1, this.connectionDropped = !1;
            let w = (_ = Y.getOptions()["grpc.max_receive_message_length"]) !== null && _ !== void 0 ? _ : v2.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH;
            this.decoder = new rMY.StreamDecoder(w), A.on("response", (O, $) => {
                let H = "";
                for (let j of Object.keys(O)) H += "\t\t" + j + ": " + O[j] + `
`;
                if (this.trace(`Received server headers:
` + H), this.httpStatusCode = O[":status"], $ & rc.constants.NGHTTP2_FLAG_END_STREAM) this.handleTrailers(O);
                else {
                    let j;
                    try {
                        j = oc.Metadata.fromHttp2Headers(O)
                    } catch (J) {
                        this.endCall({
                            code: v2.Status.UNKNOWN,
                            details: J.message,
                            metadata: new oc.Metadata
                        });
                        return
                    }
                    this.listener.onReceiveMetadata(j)
                }
            }), A.on("trailers", (O) => {
                this.handleTrailers(O)
            }), A.on("data", (O) => {
                if (this.statusOutput) return;
                this.trace("receive HTTP/2 data frame of length " + O.length);
                let $;
                try {
                    $ = this.decoder.write(O)
                } catch (H) {
                    if (this.httpStatusCode !== void 0 && this.httpStatusCode !== 200) {
                        let j = JI8(this.httpStatusCode);
                        this.cancelWithStatus(j.code, j.details)
                    } else this.cancelWithStatus(v2.Status.RESOURCE_EXHAUSTED, H.message);
                    return
                }
                for (let H of $) this.trace("parsed message of length " + H.length), this.callEventTracker.addMessageReceived(), this.tryPush(H)
            }), A.on("end", () => {
                this.readsClosed = !0, this.maybeOutputStatus()
            }), A.on("close", () => {
                this.serverEndedCall = !0, process.nextTick(() => {
                    var O;
                    if (this.trace("HTTP/2 stream closed with code " + A.rstCode), ((O = this.finalStatus) === null || O === void 0 ? void 0 : O.code) === v2.Status.OK) return;
                    let $, H = "";
                    switch (A.rstCode) {
                        case rc.constants.NGHTTP2_NO_ERROR:
                            if (this.finalStatus !== null) return;
                            if (this.httpStatusCode && this.httpStatusCode !== 200) {
                                let j = JI8(this.httpStatusCode);
                                $ = j.code, H = j.details
                            } else $ = v2.Status.INTERNAL, H = `Received RST_STREAM with code ${A.rstCode} (Call ended without gRPC status)`;
                            break;
                        case rc.constants.NGHTTP2_REFUSED_STREAM:
                            $ = v2.Status.UNAVAILABLE, H = "Stream refused by server";
                            break;
                        case rc.constants.NGHTTP2_CANCEL:
                            if (this.connectionDropped) $ = v2.Status.UNAVAILABLE, H = "Connection dropped";
                            else $ = v2.Status.CANCELLED, H = "Call cancelled";
                            break;
                        case rc.constants.NGHTTP2_ENHANCE_YOUR_CALM:
                            $ = v2.Status.RESOURCE_EXHAUSTED, H = "Bandwidth exhausted or memory limit exceeded";
                            break;
                        case rc.constants.NGHTTP2_INADEQUATE_SECURITY:
                            $ = v2.Status.PERMISSION_DENIED, H = "Protocol not secure enough";
                            break;
                        case rc.constants.NGHTTP2_INTERNAL_ERROR:
                            if ($ = v2.Status.INTERNAL, this.internalError === null) H = `Received RST_STREAM with code ${A.rstCode} (Internal server error)`;
                            else if (this.internalError.code === "ECONNRESET" || this.internalError.code === "ETIMEDOUT") $ = v2.Status.UNAVAILABLE, H = this.internalError.message;
                            else H = `Received RST_STREAM with code ${A.rstCode} triggered by internal client error: ${this.internalError.message}`;
                            break;
                        default:
                            $ = v2.Status.INTERNAL, H = `Received RST_STREAM with code ${A.rstCode}`
                    }
                    this.endCall({
                        code: $,
                        details: H,
                        metadata: new oc.Metadata,
                        rstCode: A.rstCode
                    })
                })
            }), A.on("error", (O) => {
                if (O.code !== "ERR_HTTP2_STREAM_ERROR") this.trace("Node error event: message=" + O.message + " code=" + O.code + " errno=" + tMY(O.errno) + " syscall=" + O.syscall), this.internalError = O;
                this.callEventTracker.onStreamEnd(!1)
            })
        }
        getDeadlineInfo() {
            return [`remote_addr=${this.getPeer()}`]
        }
        onDisconnect() {
            this.connectionDropped = !0, setImmediate(() => {
                this.endCall({
                    code: v2.Status.UNAVAILABLE,
                    details: "Connection dropped",
                    metadata: new oc.Metadata
                })
            })
        }
        outputStatus() {
            if (!this.statusOutput) this.statusOutput = !0, this.trace("ended with status: code=" + this.finalStatus.code + ' details="' + this.finalStatus.details + '"'), this.callEventTracker.onCallEnd(this.finalStatus), process.nextTick(() => {
                this.listener.onReceiveStatus(this.finalStatus)
            }), this.http2Stream.resume()
        }
        trace(A) {
            oMY.trace(aMY.LogVerbosity.DEBUG, sMY, "[" + this.callId + "] " + A)
        }
        endCall(A) {
            if (this.finalStatus === null || this.finalStatus.code === v2.Status.OK) this.finalStatus = A, this.maybeOutputStatus();
            this.destroyHttp2Stream()
        }
        maybeOutputStatus() {
            if (this.finalStatus !== null) {
                if (this.finalStatus.code !== v2.Status.OK || this.readsClosed && this.unpushedReadMessages.length === 0 && !this.isReadFilterPending && !this.isPushPending) this.outputStatus()
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
            for (let _ of Object.keys(A)) q += "\t\t" + _ + ": " + A[_] + `
`;
            this.trace(`Received server trailers:
` + q);
            let K;
            try {
                K = oc.Metadata.fromHttp2Headers(A)
            } catch (_) {
                K = new oc.Metadata
            }
            let Y = K.getMap(),
                z;
            if (typeof Y["grpc-status"] === "string") {
                let _ = Number(Y["grpc-status"]);
                this.trace("received status code " + _ + " from server"), K.remove("grpc-status");
                let w = "";
                if (typeof Y["grpc-message"] === "string") {
                    try {
                        w = decodeURI(Y["grpc-message"])
                    } catch (O) {
                        w = Y["grpc-message"]
                    }
                    K.remove("grpc-message"), this.trace('received status details string "' + w + '" from server')
                }
                z = {
                    code: _,
                    details: w,
                    metadata: K
                }
            } else if (this.httpStatusCode) z = JI8(this.httpStatusCode), z.metadata = K;
            else z = {
                code: v2.Status.UNKNOWN,
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
                if (((A = this.finalStatus) === null || A === void 0 ? void 0 : A.code) === v2.Status.OK) q = rc.constants.NGHTTP2_NO_ERROR;
                else q = rc.constants.NGHTTP2_CANCEL;
                this.trace("close http2 stream with code " + q), this.http2Stream.close(q)
            }
        }
        cancelWithStatus(A, q) {
            this.trace("cancelWithStatus code: " + A + ' details: "' + q + '"'), this.endCall({
                code: A,
                details: q,
                metadata: new oc.Metadata
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
            if (this.finalStatus !== null && this.finalStatus.code !== v2.Status.OK) {
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
                    let _ = v2.Status.UNAVAILABLE;
                    if ((Y === null || Y === void 0 ? void 0 : Y.code) === "ERR_STREAM_WRITE_AFTER_END") _ = v2.Status.INTERNAL;
                    if (Y) this.cancelWithStatus(_, `Write error: ${Y.message}`);
                    (z = A.callback) === null || z === void 0 || z.call(A)
                })
            };
            this.trace("sending data chunk of length " + q.length), this.callEventTracker.addMessageSent();
            try {
                this.http2Stream.write(q, K)
            } catch (Y) {
                this.endCall({
                    code: v2.Status.UNAVAILABLE,
                    details: `Write failed with error ${Y.message}`,
                    metadata: new oc.Metadata
                })
            }
        }
        halfClose() {
            this.trace("end() called"), this.trace("calling end() on HTTP/2 stream"), this.http2Stream.end()
        }
    }
    Ag4.Http2SubchannelCall = eB4
})
// @from(Ln 313266, Col 4)
Og4 = x((_g4) => {
    Object.defineProperty(_g4, "__esModule", {
        value: !0
    });
    _g4.Http2SubchannelConnector = void 0;
    var fY6 = x6("http2"),
        eMY = x6("tls"),
        CT1 = ae(),
        kd6 = a3(),
        ADY = HI8(),
        iG6 = zw(),
        qDY = Ob(),
        IT1 = _N(),
        MI8 = Nf(),
        KDY = x6("net"),
        YDY = Kg4(),
        zDY = ET1(),
        DI8 = "transport",
        _DY = "transport_flowctrl",
        wDY = LS8().version,
        {
            HTTP2_HEADER_AUTHORITY: ODY,
            HTTP2_HEADER_CONTENT_TYPE: $DY,
            HTTP2_HEADER_METHOD: HDY,
            HTTP2_HEADER_PATH: jDY,
            HTTP2_HEADER_TE: JDY,
            HTTP2_HEADER_USER_AGENT: MDY
        } = fY6.constants,
        DDY = 20000,
        XDY = Buffer.from("too_many_pings", "ascii");
    class Yg4 {
        constructor(A, q, K, Y) {
            if (this.session = A, this.options = K, this.remoteName = Y, this.keepaliveTimer = null, this.pendingSendKeepalivePing = !1, this.activeCalls = new Set, this.disconnectListeners = [], this.disconnectHandled = !1, this.channelzEnabled = !0, this.keepalivesSent = 0, this.messagesSent = 0, this.messagesReceived = 0, this.lastMessageSentTimestamp = null, this.lastMessageReceivedTimestamp = null, this.subchannelAddressString = (0, IT1.subchannelAddressToString)(q), K["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.streamTracker = new CT1.ChannelzCallTrackerStub;
            else this.streamTracker = new CT1.ChannelzCallTracker;
            if (this.channelzRef = (0, CT1.registerChannelzSocket)(this.subchannelAddressString, () => this.getChannelzInfo(), this.channelzEnabled), this.userAgent = [K["grpc.primary_user_agent"], `grpc-node-js/${wDY}`, K["grpc.secondary_user_agent"]].filter((z) => z).join(" "), "grpc.keepalive_time_ms" in K) this.keepaliveTimeMs = K["grpc.keepalive_time_ms"];
            else this.keepaliveTimeMs = -1;
            if ("grpc.keepalive_timeout_ms" in K) this.keepaliveTimeoutMs = K["grpc.keepalive_timeout_ms"];
            else this.keepaliveTimeoutMs = DDY;
            if ("grpc.keepalive_permit_without_calls" in K) this.keepaliveWithoutCalls = K["grpc.keepalive_permit_without_calls"] === 1;
            else this.keepaliveWithoutCalls = !1;
            if (A.once("close", () => {
                    this.trace("session closed"), this.handleDisconnect()
                }), A.once("goaway", (z, _, w) => {
                    let O = !1;
                    if (z === fY6.constants.NGHTTP2_ENHANCE_YOUR_CALM && w && w.equals(XDY)) O = !0;
                    this.trace("connection closed by GOAWAY with code " + z + " and data " + (w === null || w === void 0 ? void 0 : w.toString())), this.reportDisconnectToOwner(O)
                }), A.once("error", (z) => {
                    this.trace("connection closed with error " + z.message), this.handleDisconnect()
                }), A.socket.once("close", (z) => {
                    this.trace("connection closed. hadError=" + z), this.handleDisconnect()
                }), iG6.isTracerEnabled(DI8)) A.on("remoteSettings", (z) => {
                this.trace("new settings received" + (this.session !== A ? " on the old connection" : "") + ": " + JSON.stringify(z))
            }), A.on("localSettings", (z) => {
                this.trace("local settings acknowledged by remote" + (this.session !== A ? " on the old connection" : "") + ": " + JSON.stringify(z))
            });
            if (this.keepaliveWithoutCalls) this.maybeStartKeepalivePingTimer();
            if (A.socket instanceof eMY.TLSSocket) this.authContext = {
                transportSecurityType: "ssl",
                sslPeerCertificate: A.socket.getPeerCertificate()
            };
            else this.authContext = {}
        }
        getChannelzInfo() {
            var A, q, K;
            let Y = this.session.socket,
                z = Y.remoteAddress ? (0, IT1.stringToSubchannelAddress)(Y.remoteAddress, Y.remotePort) : null,
                _ = Y.localAddress ? (0, IT1.stringToSubchannelAddress)(Y.localAddress, Y.localPort) : null,
                w;
            if (this.session.encrypted) {
                let $ = Y,
                    H = $.getCipher(),
                    j = $.getCertificate(),
                    J = $.getPeerCertificate();
                w = {
                    cipherSuiteStandardName: (A = H.standardName) !== null && A !== void 0 ? A : null,
                    cipherSuiteOtherName: H.standardName ? null : H.name,
                    localCertificate: j && "raw" in j ? j.raw : null,
                    remoteCertificate: J && "raw" in J ? J.raw : null
                }
            } else w = null;
            return {
                remoteAddress: z,
                localAddress: _,
                security: w,
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
            iG6.trace(kd6.LogVerbosity.DEBUG, DI8, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
        }
        keepaliveTrace(A) {
            iG6.trace(kd6.LogVerbosity.DEBUG, "keepalive", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
        }
        flowControlTrace(A) {
            iG6.trace(kd6.LogVerbosity.DEBUG, _DY, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
        }
        internalsTrace(A) {
            iG6.trace(kd6.LogVerbosity.DEBUG, "transport_internals", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
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
                if (!this.session.ping((z, _, w) => {
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
            let _ = A.toHttp2Headers();
            _[ODY] = q, _[MDY] = this.userAgent, _[$DY] = "application/grpc", _[HDY] = "POST", _[jDY] = K, _[JDY] = "trailers";
            let w;
            try {
                w = this.session.request(_)
            } catch (H) {
                throw this.handleDisconnect(), H
            }
            this.flowControlTrace("local window size: " + this.session.state.localWindowSize + " remote window size: " + this.session.state.remoteWindowSize), this.internalsTrace("session.closed=" + this.session.closed + " session.destroyed=" + this.session.destroyed + " session.socket.destroyed=" + this.session.socket.destroyed);
            let O, $;
            if (this.channelzEnabled) this.streamTracker.addCallStarted(), O = {
                addMessageSent: () => {
                    var H;
                    this.messagesSent += 1, this.lastMessageSentTimestamp = new Date, (H = z.addMessageSent) === null || H === void 0 || H.call(z)
                },
                addMessageReceived: () => {
                    var H;
                    this.messagesReceived += 1, this.lastMessageReceivedTimestamp = new Date, (H = z.addMessageReceived) === null || H === void 0 || H.call(z)
                },
                onCallEnd: (H) => {
                    var j;
                    (j = z.onCallEnd) === null || j === void 0 || j.call(z, H), this.removeActiveCall($)
                },
                onStreamEnd: (H) => {
                    var j;
                    if (H) this.streamTracker.addCallSucceeded();
                    else this.streamTracker.addCallFailed();
                    (j = z.onStreamEnd) === null || j === void 0 || j.call(z, H)
                }
            };
            else O = {
                addMessageSent: () => {
                    var H;
                    (H = z.addMessageSent) === null || H === void 0 || H.call(z)
                },
                addMessageReceived: () => {
                    var H;
                    (H = z.addMessageReceived) === null || H === void 0 || H.call(z)
                },
                onCallEnd: (H) => {
                    var j;
                    (j = z.onCallEnd) === null || j === void 0 || j.call(z, H), this.removeActiveCall($)
                },
                onStreamEnd: (H) => {
                    var j;
                    (j = z.onStreamEnd) === null || j === void 0 || j.call(z, H)
                }
            };
            return $ = new YDY.Http2SubchannelCall(w, O, Y, this, (0, zDY.getNextCallNumber)()), this.addActiveCall($), $
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
            this.session.close(), (0, CT1.unregisterChannelzRef)(this.channelzRef)
        }
    }
    class zg4 {
        constructor(A) {
            this.channelTarget = A, this.session = null, this.isShutdown = !1
        }
        trace(A) {
            iG6.trace(kd6.LogVerbosity.DEBUG, DI8, (0, MI8.uriToString)(this.channelTarget) + " " + A)
        }
        createSession(A, q, K) {
            if (this.isShutdown) return Promise.reject();
            if (A.socket.closed) return Promise.reject("Connection closed before starting HTTP/2 handshake");
            return new Promise((Y, z) => {
                var _, w, O, $, H, j, J;
                let M = null,
                    D = this.channelTarget;
                if ("grpc.http_connect_target" in K) {
                    let h = (0, MI8.parseUri)(K["grpc.http_connect_target"]);
                    if (h) D = h, M = (0, MI8.uriToString)(h)
                }
                let X = A.secure ? "https" : "http",
                    P = (0, qDY.getDefaultAuthority)(D),
                    W = () => {
                        var h;
                        (h = this.session) === null || h === void 0 || h.destroy(), this.session = null, setImmediate(() => {
                            if (!L) L = !0, z(`${V.trim()} (${new Date().toISOString()})`)
                        })
                    },
                    Z = (h) => {
                        var R;
                        if ((R = this.session) === null || R === void 0 || R.destroy(), V = h.message, this.trace("connection failed with error " + V), !L) L = !0, z(`${V} (${new Date().toISOString()})`)
                    },
                    G = {
                        createConnection: (h, R) => {
                            return A.socket
                        },
                        settings: {
                            initialWindowSize: ($ = (_ = K["grpc-node.flow_control_window"]) !== null && _ !== void 0 ? _ : (O = (w = fY6.getDefaultSettings) === null || w === void 0 ? void 0 : w.call(fY6)) === null || O === void 0 ? void 0 : O.initialWindowSize) !== null && $ !== void 0 ? $ : 65535
                        }
                    },
                    f = fY6.connect(`${X}://${P}`, G),
                    v = (J = (j = (H = fY6.getDefaultSettings) === null || H === void 0 ? void 0 : H.call(fY6)) === null || j === void 0 ? void 0 : j.initialWindowSize) !== null && J !== void 0 ? J : 65535,
                    N = K["grpc-node.flow_control_window"];
                this.session = f;
                let V = "Failed to connect",
                    L = !1;
                f.unref(), f.once("remoteSettings", () => {
                    var h;
                    if (N && N > v) try {
                        f.setLocalWindowSize(N)
                    } catch (R) {
                        let u = N - ((h = f.state.localWindowSize) !== null && h !== void 0 ? h : v);
                        if (u > 0) f.incrementWindowSize(u)
                    }
                    f.removeAllListeners(), A.socket.removeListener("close", W), A.socket.removeListener("error", Z), Y(new Yg4(f, q, K, M)), this.session = null
                }), f.once("close", W), f.once("error", Z), A.socket.once("close", W), A.socket.once("error", Z)
            })
        }
        tcpConnect(A, q) {
            return (0, ADY.getProxiedConnection)(A, q).then((K) => {
                if (K) return K;
                else return new Promise((Y, z) => {
                    let _ = () => {
                            z(Error("Socket closed"))
                        },
                        w = ($) => {
                            z($)
                        },
                        O = KDY.connect(A, () => {
                            O.removeListener("close", _), O.removeListener("error", w), Y(O)
                        });
                    O.once("close", _), O.once("error", w)
                })
            })
        }
        async connect(A, q, K) {
            if (this.isShutdown) return Promise.reject();
            let Y = null,
                z = null,
                _ = (0, IT1.subchannelAddressToString)(A);
            try {
                return this.trace(_ + " Waiting for secureConnector to be ready"), await q.waitForReady(), this.trace(_ + " secureConnector is ready"), Y = await this.tcpConnect(A, K), Y.setNoDelay(), this.trace(_ + " Established TCP connection"), z = await q.connect(Y), this.trace(_ + " Established secure connection"), this.createSession(z, A, K)
            } catch (w) {
                throw Y === null || Y === void 0 || Y.destroy(), z === null || z === void 0 || z.socket.destroy(), w
            }
        }
        shutdown() {
            var A;
            this.isShutdown = !0, (A = this.session) === null || A === void 0 || A.close(), this.session = null
        }
    }
    _g4.Http2SubchannelConnector = zg4
})
// @from(Ln 313596, Col 4)
jg4 = x(($g4) => {
    Object.defineProperty($g4, "__esModule", {
        value: !0
    });
    $g4.SubchannelPool = void 0;
    $g4.getSubchannelPool = NDY;
    var PDY = jx4(),
        WDY = mB4(),
        ZDY = _N(),
        GDY = Nf(),
        fDY = Og4(),
        TDY = 1e4;
    class bT1 {
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
            }, TDY), (q = (A = this.cleanupTimer).unref) === null || q === void 0 || q.call(A)
        }
        getOrCreateSubchannel(A, q, K, Y) {
            this.ensureCleanupTask();
            let z = (0, GDY.uriToString)(A);
            if (z in this.pool) {
                let w = this.pool[z];
                for (let O of w)
                    if ((0, ZDY.subchannelAddressEqual)(q, O.subchannelAddress) && (0, PDY.channelOptionsEqual)(K, O.channelArguments) && Y._equals(O.channelCredentials)) return O.subchannel
            }
            let _ = new WDY.Subchannel(A, q, K, Y, new fDY.Http2SubchannelConnector(A));
            if (!(z in this.pool)) this.pool[z] = [];
            return this.pool[z].push({
                subchannelAddress: q,
                channelArguments: K,
                channelCredentials: Y,
                subchannel: _
            }), _.ref(), _
        }
    }
    $g4.SubchannelPool = bT1;
    var vDY = new bT1;

    function NDY(A) {
        if (A) return vDY;
        else return new bT1
    }
})
// @from(Ln 313653, Col 4)
Wg4 = x((Xg4) => {
    Object.defineProperty(Xg4, "__esModule", {
        value: !0
    });
    Xg4.LoadBalancingCall = void 0;
    var Jg4 = Vf(),
        xT1 = a3(),
        Mg4 = UG6(),
        uT1 = LX(),
        Ed6 = pc(),
        kDY = Nf(),
        EDY = zw(),
        XI8 = fd6(),
        yDY = x6("http2"),
        LDY = "load_balancing_call";
    class Dg4 {
        constructor(A, q, K, Y, z, _, w) {
            var O, $;
            this.channel = A, this.callConfig = q, this.methodName = K, this.host = Y, this.credentials = z, this.deadline = _, this.callNumber = w, this.child = null, this.readPending = !1, this.pendingMessage = null, this.pendingHalfClose = !1, this.ended = !1, this.metadata = null, this.listener = null, this.onCallEnded = null, this.childStartTime = null;
            let H = this.methodName.split("/"),
                j = "";
            if (H.length >= 2) j = H[1];
            let J = ($ = (O = (0, kDY.splitHostPort)(this.host)) === null || O === void 0 ? void 0 : O.host) !== null && $ !== void 0 ? $ : "localhost";
            this.serviceUrl = `https://${J}/${j}`, this.startTime = new Date
        }
        getDeadlineInfo() {
            var A, q;
            let K = [];
            if (this.childStartTime) {
                if (this.childStartTime > this.startTime) {
                    if ((A = this.metadata) === null || A === void 0 ? void 0 : A.getOptions().waitForReady) K.push("wait_for_ready");
                    K.push(`LB pick: ${(0,Mg4.formatDateDifference)(this.startTime,this.childStartTime)}`)
                }
                return K.push(...this.child.getDeadlineInfo()), K
            } else {
                if ((q = this.metadata) === null || q === void 0 ? void 0 : q.getOptions().waitForReady) K.push("wait_for_ready");
                K.push("Waiting for LB pick")
            }
            return K
        }
        trace(A) {
            EDY.trace(xT1.LogVerbosity.DEBUG, LDY, "[" + this.callNumber + "] " + A)
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
            switch (this.trace("Pick result: " + Ed6.PickResultType[Y.pickResultType] + " subchannel: " + z + " status: " + ((A = Y.status) === null || A === void 0 ? void 0 : A.code) + " " + ((q = Y.status) === null || q === void 0 ? void 0 : q.details)), Y.pickResultType) {
                case Ed6.PickResultType.COMPLETE:
                    this.credentials.compose(Y.subchannel.getCallCredentials()).generateMetadata({
                        method_name: this.methodName,
                        service_url: this.serviceUrl
                    }).then(($) => {
                        var H;
                        if (this.ended) {
                            this.trace("Credentials metadata generation finished after call ended");
                            return
                        }
                        if (K.merge($), K.get("authorization").length > 1) this.outputStatus({
                            code: xT1.Status.INTERNAL,
                            details: '"authorization" metadata cannot have multiple values',
                            metadata: new uT1.Metadata
                        }, "PROCESSED");
                        if (Y.subchannel.getConnectivityState() !== Jg4.ConnectivityState.READY) {
                            this.trace("Picked subchannel " + z + " has state " + Jg4.ConnectivityState[Y.subchannel.getConnectivityState()] + " after getting credentials metadata. Retrying pick"), this.doPick();
                            return
                        }
                        if (this.deadline !== 1 / 0) K.set("grpc-timeout", (0, Mg4.getDeadlineTimeoutString)(this.deadline));
                        try {
                            this.child = Y.subchannel.getRealSubchannel().createCall(K, this.host, this.methodName, {
                                onReceiveMetadata: (j) => {
                                    this.trace("Received metadata"), this.listener.onReceiveMetadata(j)
                                },
                                onReceiveMessage: (j) => {
                                    this.trace("Received message"), this.listener.onReceiveMessage(j)
                                },
                                onReceiveStatus: (j) => {
                                    if (this.trace("Received status"), j.rstCode === yDY.constants.NGHTTP2_REFUSED_STREAM) this.outputStatus(j, "REFUSED");
                                    else this.outputStatus(j, "PROCESSED")
                                }
                            }), this.childStartTime = new Date
                        } catch (j) {
                            this.trace("Failed to start call on picked subchannel " + z + " with error " + j.message), this.outputStatus({
                                code: xT1.Status.INTERNAL,
                                details: "Failed to start HTTP/2 stream with error " + j.message,
                                metadata: new uT1.Metadata
                            }, "NOT_STARTED");
                            return
                        }
                        if ((H = Y.onCallStarted) === null || H === void 0 || H.call(Y), this.onCallEnded = Y.onCallEnded, this.trace("Created child call [" + this.child.getCallNumber() + "]"), this.readPending) this.child.startRead();
                        if (this.pendingMessage) this.child.sendMessageWithContext(this.pendingMessage.context, this.pendingMessage.message);
                        if (this.pendingHalfClose) this.child.halfClose()
                    }, ($) => {
                        let {
                            code: H,
                            details: j
                        } = (0, XI8.restrictControlPlaneStatusCode)(typeof $.code === "number" ? $.code : xT1.Status.UNKNOWN, `Getting metadata from plugin failed with error: ${$.message}`);
                        this.outputStatus({
                            code: H,
                            details: j,
                            metadata: new uT1.Metadata
                        }, "PROCESSED")
                    });
                    break;
                case Ed6.PickResultType.DROP:
                    let {
                        code: w, details: O
                    } = (0, XI8.restrictControlPlaneStatusCode)(Y.status.code, Y.status.details);
                    setImmediate(() => {
                        this.outputStatus({
                            code: w,
                            details: O,
                            metadata: Y.status.metadata
                        }, "DROP")
                    });
                    break;
                case Ed6.PickResultType.TRANSIENT_FAILURE:
                    if (this.metadata.getOptions().waitForReady) this.channel.queueCallForPick(this);
                    else {
                        let {
                            code: $,
                            details: H
                        } = (0, XI8.restrictControlPlaneStatusCode)(Y.status.code, Y.status.details);
                        setImmediate(() => {
                            this.outputStatus({
                                code: $,
                                details: H,
                                metadata: Y.status.metadata
                            }, "PROCESSED")
                        })
                    }
                    break;
                case Ed6.PickResultType.QUEUE:
                    this.channel.queueCallForPick(this)
            }
        }
        cancelWithStatus(A, q) {
            var K;
            this.trace("cancelWithStatus code: " + A + ' details: "' + q + '"'), (K = this.child) === null || K === void 0 || K.cancelWithStatus(A, q), this.outputStatus({
                code: A,
                details: q,
                metadata: new uT1.Metadata
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
    Xg4.LoadBalancingCall = Dg4
})
// @from(Ln 313846, Col 4)
vg4 = x((fg4) => {
    Object.defineProperty(fg4, "__esModule", {
        value: !0
    });
    fg4.ResolvingCall = void 0;
    var RDY = gf1(),
        TY6 = a3(),
        vY6 = UG6(),
        Zg4 = LX(),
        hDY = zw(),
        SDY = fd6(),
        CDY = "resolving_call";
    class Gg4 {
        constructor(A, q, K, Y, z) {
            if (this.channel = A, this.method = q, this.filterStackFactory = Y, this.callNumber = z, this.child = null, this.readPending = !1, this.pendingMessage = null, this.pendingHalfClose = !1, this.ended = !1, this.readFilterPending = !1, this.writeFilterPending = !1, this.pendingChildStatus = null, this.metadata = null, this.listener = null, this.statusWatchers = [], this.deadlineTimer = setTimeout(() => {}, 0), this.filterStack = null, this.deadlineStartTime = null, this.configReceivedTime = null, this.childStartTime = null, this.credentials = RDY.CallCredentials.createEmpty(), this.deadline = K.deadline, this.host = K.host, K.parentCall) {
                if (K.flags & TY6.Propagate.CANCELLATION) K.parentCall.on("cancelled", () => {
                    this.cancelWithStatus(TY6.Status.CANCELLED, "Cancelled by parent call")
                });
                if (K.flags & TY6.Propagate.DEADLINE) this.trace("Propagating deadline from parent: " + K.parentCall.getDeadline()), this.deadline = (0, vY6.minDeadline)(this.deadline, K.parentCall.getDeadline())
            }
            this.trace("Created"), this.runDeadlineTimer()
        }
        trace(A) {
            hDY.trace(TY6.LogVerbosity.DEBUG, CDY, "[" + this.callNumber + "] " + A)
        }
        runDeadlineTimer() {
            clearTimeout(this.deadlineTimer), this.deadlineStartTime = new Date, this.trace("Deadline: " + (0, vY6.deadlineToString)(this.deadline));
            let A = (0, vY6.getRelativeTimeout)(this.deadline);
            if (A !== 1 / 0) {
                this.trace("Deadline will be reached in " + A + "ms");
                let q = () => {
                    if (!this.deadlineStartTime) {
                        this.cancelWithStatus(TY6.Status.DEADLINE_EXCEEDED, "Deadline exceeded");
                        return
                    }
                    let K = [],
                        Y = new Date;
                    if (K.push(`Deadline exceeded after ${(0,vY6.formatDateDifference)(this.deadlineStartTime,Y)}`), this.configReceivedTime) {
                        if (this.configReceivedTime > this.deadlineStartTime) K.push(`name resolution: ${(0,vY6.formatDateDifference)(this.deadlineStartTime,this.configReceivedTime)}`);
                        if (this.childStartTime) {
                            if (this.childStartTime > this.configReceivedTime) K.push(`metadata filters: ${(0,vY6.formatDateDifference)(this.configReceivedTime,this.childStartTime)}`)
                        } else K.push("waiting for metadata filters")
                    } else K.push("waiting for name resolution");
                    if (this.child) K.push(...this.child.getDeadlineInfo());
                    this.cancelWithStatus(TY6.Status.DEADLINE_EXCEEDED, K.join(","))
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
            if (q.status !== TY6.Status.OK) {
                let {
                    code: K,
                    details: Y
                } = (0, SDY.restrictControlPlaneStatusCode)(q.status, "Failed to route call to method " + this.method);
                this.outputStatus({
                    code: K,
                    details: Y,
                    metadata: new Zg4.Metadata
                });
                return
            }
            if (q.methodConfig.timeout) {
                let K = new Date;
                K.setSeconds(K.getSeconds() + q.methodConfig.timeout.seconds), K.setMilliseconds(K.getMilliseconds() + q.methodConfig.timeout.nanos / 1e6), this.deadline = (0, vY6.minDeadline)(this.deadline, K), this.runDeadlineTimer()
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
                metadata: new Zg4.Metadata
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
    fg4.ResolvingCall = Gg4
})
// @from(Ln 314023, Col 4)
Lg4 = x((Eg4) => {
    Object.defineProperty(Eg4, "__esModule", {
        value: !0
    });
    Eg4.RetryingCall = Eg4.MessageBufferTracker = Eg4.RetryThrottler = void 0;
    var mT1 = a3(),
        IDY = UG6(),
        bDY = LX(),
        xDY = zw(),
        uDY = "retrying_call";
    class Ng4 {
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
    Eg4.RetryThrottler = Ng4;
    class Vg4 {
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
    Eg4.MessageBufferTracker = Vg4;
    var PI8 = "grpc-previous-rpc-attempts",
        mDY = 5;
    class kg4 {
        constructor(A, q, K, Y, z, _, w, O, $) {
            var H;
            this.channel = A, this.callConfig = q, this.methodName = K, this.host = Y, this.credentials = z, this.deadline = _, this.callNumber = w, this.bufferTracker = O, this.retryThrottler = $, this.listener = null, this.initialMetadata = null, this.underlyingCalls = [], this.writeBuffer = [], this.writeBufferOffset = 0, this.readStarted = !1, this.transparentRetryUsed = !1, this.attempts = 0, this.hedgingTimer = null, this.committedCallIndex = null, this.initialRetryBackoffSec = 0, this.nextRetryBackoffSec = 0;
            let j = (H = A.getOptions()["grpc-node.retry_max_attempts_limit"]) !== null && H !== void 0 ? H : mDY;
            if (A.getOptions()["grpc.enable_retries"] === 0) this.state = "NO_RETRY", this.maxAttempts = 1;
            else if (q.methodConfig.retryPolicy) {
                this.state = "RETRY";
                let J = q.methodConfig.retryPolicy;
                this.nextRetryBackoffSec = this.initialRetryBackoffSec = Number(J.initialBackoff.substring(0, J.initialBackoff.length - 1)), this.maxAttempts = Math.min(J.maxAttempts, j)
            } else if (q.methodConfig.hedgingPolicy) this.state = "HEDGING", this.maxAttempts = Math.min(q.methodConfig.hedgingPolicy.maxAttempts, j);
            else this.state = "TRANSPARENT_ONLY", this.maxAttempts = 1;
            this.startTime = new Date
        }
        getDeadlineInfo() {
            if (this.underlyingCalls.length === 0) return [];
            let A = [],
                q = this.underlyingCalls[this.underlyingCalls.length - 1];
            if (this.underlyingCalls.length > 1) A.push(`previous attempts: ${this.underlyingCalls.length-1}`);
            if (q.startTime > this.startTime) A.push(`time to current attempt start: ${(0,IDY.formatDateDifference)(this.startTime,q.startTime)}`);
            return A.push(...q.call.getDeadlineInfo()), A
        }
        getCallNumber() {
            return this.callNumber
        }
        trace(A) {
            xDY.trace(mT1.LogVerbosity.DEBUG, uDY, "[" + this.callNumber + "] " + A)
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
                metadata: new bDY.Metadata
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
                this.underlyingCalls[Y].state = "COMPLETED", this.underlyingCalls[Y].call.cancelWithStatus(mT1.Status.CANCELLED, "Discarded in favor of other hedged attempt")
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
                return K === q || K.toString().toLowerCase() === ((Y = mT1.Status[q]) === null || Y === void 0 ? void 0 : Y.toLowerCase())
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
            var Y, z, _;
            switch (this.state) {
                case "COMMITTED":
                case "NO_RETRY":
                case "TRANSPARENT_ONLY":
                    this.commitCall(q), this.reportStatus(A);
                    break;
                case "HEDGING":
                    if (this.isStatusCodeInList((Y = this.callConfig.methodConfig.hedgingPolicy.nonFatalStatusCodes) !== null && Y !== void 0 ? Y : [], A.code)) {
                        (z = this.retryThrottler) === null || z === void 0 || z.addCallFailed();
                        let w;
                        if (K === null) w = 0;
                        else if (K < 0) {
                            this.state = "TRANSPARENT_ONLY", this.commitCall(q), this.reportStatus(A);
                            return
                        } else w = K;
                        setTimeout(() => {
                            if (this.maybeStartHedgingAttempt(), this.countActiveCalls() === 0) this.commitCall(q), this.reportStatus(A)
                        }, w)
                    } else this.commitCall(q), this.reportStatus(A);
                    break;
                case "RETRY":
                    if (this.isStatusCodeInList(this.callConfig.methodConfig.retryPolicy.retryableStatusCodes, A.code))(_ = this.retryThrottler) === null || _ === void 0 || _.addCallFailed(), this.maybeRetryCall(K, (w) => {
                        if (!w) this.commitCall(q), this.reportStatus(A)
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
            if (this.trace("state=" + this.state + " handling status with progress " + A.progress + " from child [" + this.underlyingCalls[q].call.getCallNumber() + "] in state " + this.underlyingCalls[q].state), this.underlyingCalls[q].state = "COMPLETED", A.code === mT1.Status.OK) {
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
                _ = Number(z.substring(0, z.length - 1));
            this.hedgingTimer = setTimeout(() => {
                this.maybeStartHedgingAttempt()
            }, _ * 1000), (K = (q = this.hedgingTimer).unref) === null || K === void 0 || K.call(q)
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
            if (K > 0) Y.set(PI8, `${K}`);
            let z = !1;
            if (A.start(Y, {
                    onReceiveMetadata: (_) => {
                        if (this.trace("Received metadata from child [" + A.getCallNumber() + "]"), this.commitCall(q), z = !0, K > 0) _.set(PI8, `${K}`);
                        if (this.underlyingCalls[q].state === "ACTIVE") this.listener.onReceiveMetadata(_)
                    },
                    onReceiveMessage: (_) => {
                        if (this.trace("Received message from child [" + A.getCallNumber() + "]"), this.commitCall(q), this.underlyingCalls[q].state === "ACTIVE") this.listener.onReceiveMessage(_)
                    },
                    onReceiveStatus: (_) => {
                        if (this.trace("Received status from child [" + A.getCallNumber() + "]"), !z && K > 0) _.metadata.set(PI8, `${K}`);
                        this.handleChildStatus(_, q)
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
                _ = {
                    entryType: "MESSAGE",
                    message: Y,
                    allocated: this.bufferTracker.allocate(q.length, this.callNumber)
                };
            if (this.writeBuffer.push(_), _.allocated) {
                (K = A.callback) === null || K === void 0 || K.call(A);
                for (let [w, O] of this.underlyingCalls.entries())
                    if (O.state === "ACTIVE" && O.nextMessageToSend === z) O.call.sendMessageWithContext({
                        callback: ($) => {
                            this.handleChildWriteCompleted(w)
                        }
                    }, q)
            } else {
                if (this.commitCallWithMostMessages(), this.committedCallIndex === null) return;
                let w = this.underlyingCalls[this.committedCallIndex];
                if (_.callback = A.callback, w.state === "ACTIVE" && w.nextMessageToSend === z) w.call.sendMessageWithContext({
                    callback: (O) => {
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
    Eg4.RetryingCall = kg4
})
// @from(Ln 314429, Col 4)
yd6 = x((hg4) => {
    Object.defineProperty(hg4, "__esModule", {
        value: !0
    });
    hg4.BaseSubchannelWrapper = void 0;
    class Rg4 {
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
    hg4.BaseSubchannelWrapper = Rg4
})
// @from(Ln 314505, Col 4)
fI8 = x((mg4) => {
    Object.defineProperty(mg4, "__esModule", {
        value: !0
    });
    mg4.InternalChannel = mg4.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = void 0;
    var FDY = LG6(),
        pDY = Ox4(),
        QDY = jg4(),
        GI8 = pc(),
        UDY = LX(),
        te = a3(),
        dDY = LT1(),
        cDY = AI8(),
        Cg4 = Ob(),
        BT1 = zw(),
        lDY = HI8(),
        gT1 = Nf(),
        nR = Vf(),
        Ld6 = ae(),
        iDY = Wg4(),
        nDY = UG6(),
        rDY = vg4(),
        WI8 = ET1(),
        oDY = fd6(),
        ZI8 = Lg4(),
        aDY = yd6(),
        sDY = 2147483647,
        tDY = 1000,
        eDY = 1800000,
        FT1 = new Map,
        AXY = 16777216,
        qXY = 1048576;
    class Ig4 extends aDY.BaseSubchannelWrapper {
        constructor(A, q) {
            super(A);
            this.channel = q, this.refCount = 0, this.subchannelStateListener = (K, Y, z, _) => {
                q.throttleKeepalive(_)
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
    class bg4 {
        pick(A) {
            return {
                pickResultType: GI8.PickResultType.DROP,
                status: {
                    code: te.Status.UNAVAILABLE,
                    details: "Channel closed before call started",
                    metadata: new UDY.Metadata
                },
                subchannel: null,
                onCallStarted: null,
                onCallEnded: null
            }
        }
    }
    mg4.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = "grpc.internal.no_subchannel";
    class xg4 {
        constructor(A) {
            this.target = A, this.trace = new Ld6.ChannelzTrace, this.callTracker = new Ld6.ChannelzCallTracker, this.childrenTracker = new Ld6.ChannelzChildrenTracker, this.state = nR.ConnectivityState.IDLE
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
    class ug4 {
        constructor(A, q, K) {
            var Y, z, _, w, O, $;
            if (this.credentials = q, this.options = K, this.connectivityState = nR.ConnectivityState.IDLE, this.currentPicker = new GI8.UnavailablePicker, this.configSelectionQueue = [], this.pickQueue = [], this.connectivityStateWatchers = [], this.callRefTimer = null, this.configSelector = null, this.currentResolutionError = null, this.wrappedSubchannels = new Set, this.callCount = 0, this.idleTimer = null, this.channelzEnabled = !0, this.randomChannelId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), typeof A !== "string") throw TypeError("Channel target must be a string");
            if (!(q instanceof FDY.ChannelCredentials)) throw TypeError("Channel credentials must be a ChannelCredentials object");
            if (K) {
                if (typeof K !== "object") throw TypeError("Channel options must be an object")
            }
            this.channelzInfoTracker = new xg4(A);
            let H = (0, gT1.parseUri)(A);
            if (H === null) throw Error(`Could not parse target name "${A}"`);
            let j = (0, Cg4.mapUriDefaultScheme)(H);
            if (j === null) throw Error(`Could not find a default scheme for target name "${A}"`);
            if (this.options["grpc.enable_channelz"] === 0) this.channelzEnabled = !1;
            if (this.channelzRef = (0, Ld6.registerChannelzChannel)(A, this.channelzInfoTracker.getChannelzInfoCallback(), this.channelzEnabled), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Channel created");
            if (this.options["grpc.default_authority"]) this.defaultAuthority = this.options["grpc.default_authority"];
            else this.defaultAuthority = (0, Cg4.getDefaultAuthority)(j);
            let J = (0, lDY.mapProxyName)(j, K);
            this.target = J.target, this.options = Object.assign({}, this.options, J.extraOptions), this.subchannelPool = (0, QDY.getSubchannelPool)(((Y = this.options["grpc.use_local_subchannel_pool"]) !== null && Y !== void 0 ? Y : 0) === 0), this.retryBufferTracker = new ZI8.MessageBufferTracker((z = this.options["grpc.retry_buffer_size"]) !== null && z !== void 0 ? z : AXY, (_ = this.options["grpc.per_rpc_retry_buffer_size"]) !== null && _ !== void 0 ? _ : qXY), this.keepaliveTime = (w = this.options["grpc.keepalive_time_ms"]) !== null && w !== void 0 ? w : -1, this.idleTimeoutMs = Math.max((O = this.options["grpc.client_idle_timeout_ms"]) !== null && O !== void 0 ? O : eDY, tDY);
            let M = {
                createSubchannel: (X, P) => {
                    let W = {};
                    for (let [f, v] of Object.entries(P))
                        if (!f.startsWith(mg4.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX)) W[f] = v;
                    let Z = this.subchannelPool.getOrCreateSubchannel(this.target, X, W, this.credentials);
                    if (Z.throttleKeepalive(this.keepaliveTime), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Created subchannel or used existing subchannel", Z.getChannelzRef());
                    return new Ig4(Z, this)
                },
                updateState: (X, P) => {
                    this.currentPicker = P;
                    let W = this.pickQueue.slice();
                    if (this.pickQueue = [], W.length > 0) this.callRefTimerUnref();
                    for (let Z of W) Z.doPick();
                    this.updateState(X)
                },
                requestReresolution: () => {
                    throw Error("Resolving load balancer should never call requestReresolution")
                },
                addChannelzChild: (X) => {
                    if (this.channelzEnabled) this.channelzInfoTracker.childrenTracker.refChild(X)
                },
                removeChannelzChild: (X) => {
                    if (this.channelzEnabled) this.channelzInfoTracker.childrenTracker.unrefChild(X)
                }
            };
            this.resolvingLoadBalancer = new pDY.ResolvingLoadBalancer(this.target, M, this.options, (X, P) => {
                var W;
                if (X.retryThrottling) FT1.set(this.getTarget(), new ZI8.RetryThrottler(X.retryThrottling.maxTokens, X.retryThrottling.tokenRatio, FT1.get(this.getTarget())));
                else FT1.delete(this.getTarget());
                if (this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Address resolution succeeded");
                (W = this.configSelector) === null || W === void 0 || W.unref(), this.configSelector = P, this.currentResolutionError = null, process.nextTick(() => {
                    let Z = this.configSelectionQueue;
                    if (this.configSelectionQueue = [], Z.length > 0) this.callRefTimerUnref();
                    for (let G of Z) G.getConfig()
                })
            }, (X) => {
                if (this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_WARNING", "Address resolution failed with code " + X.code + ' and details "' + X.details + '"');
                if (this.configSelectionQueue.length > 0) this.trace("Name resolution failed with calls queued for config selection");
                if (this.configSelector === null) this.currentResolutionError = Object.assign(Object.assign({}, (0, oDY.restrictControlPlaneStatusCode)(X.code, X.details)), {
                    metadata: X.metadata
                });
                let P = this.configSelectionQueue;
                if (this.configSelectionQueue = [], P.length > 0) this.callRefTimerUnref();
                for (let W of P) W.reportResolverError(X)
            }), this.filterStackFactory = new dDY.FilterStackFactory([new cDY.CompressionFilterFactory(this, this.options)]), this.trace("Channel constructed with options " + JSON.stringify(K, void 0, 2));
            let D = Error();
            if ((0, BT1.isTracerEnabled)("channel_stacktrace"))(0, BT1.trace)(te.LogVerbosity.DEBUG, "channel_stacktrace", "(" + this.channelzRef.id + `) Channel constructed 
` + (($ = D.stack) === null || $ === void 0 ? void 0 : $.substring(D.stack.indexOf(`
`) + 1)));
            this.lastActivityTimestamp = new Date
        }
        trace(A, q) {
            (0, BT1.trace)(q !== null && q !== void 0 ? q : te.LogVerbosity.DEBUG, "channel", "(" + this.channelzRef.id + ") " + (0, gT1.uriToString)(this.target) + " " + A)
        }
        callRefTimerRef() {
            var A, q, K, Y;
            if (!this.callRefTimer) this.callRefTimer = setInterval(() => {}, sDY);
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
            if ((0, BT1.trace)(te.LogVerbosity.DEBUG, "connectivity_state", "(" + this.channelzRef.id + ") " + (0, gT1.uriToString)(this.target) + " " + nR.ConnectivityState[this.connectivityState] + " -> " + nR.ConnectivityState[A]), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Connectivity state change to " + nR.ConnectivityState[A]);
            this.connectivityState = A, this.channelzInfoTracker.state = A;
            let q = this.connectivityStateWatchers.slice();
            for (let K of q)
                if (A !== K.currentState) {
                    if (K.timer) clearTimeout(K.timer);
                    this.removeConnectivityStateWatcher(K), K.callback()
                } if (A !== nR.ConnectivityState.TRANSIENT_FAILURE) this.currentResolutionError = null
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
            if (this.connectivityState !== nR.ConnectivityState.SHUTDOWN) this.resolvingLoadBalancer.exitIdle();
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
            if (this.resolvingLoadBalancer.destroy(), this.updateState(nR.ConnectivityState.IDLE), this.currentPicker = new GI8.QueuePicker(this.resolvingLoadBalancer), this.idleTimer) clearTimeout(this.idleTimer), this.idleTimer = null;
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
            if (this.connectivityState !== nR.ConnectivityState.SHUTDOWN && !this.idleTimer) this.startIdleTimeout(this.idleTimeoutMs)
        }
        onCallStart() {
            if (this.channelzEnabled) this.channelzInfoTracker.callTracker.addCallStarted();
            this.callCount += 1
        }
        onCallEnd(A) {
            if (this.channelzEnabled)
                if (A.code === te.Status.OK) this.channelzInfoTracker.callTracker.addCallSucceeded();
                else this.channelzInfoTracker.callTracker.addCallFailed();
            this.callCount -= 1, this.lastActivityTimestamp = new Date, this.maybeStartIdleTimer()
        }
        createLoadBalancingCall(A, q, K, Y, z) {
            let _ = (0, WI8.getNextCallNumber)();
            return this.trace("createLoadBalancingCall [" + _ + '] method="' + q + '"'), new iDY.LoadBalancingCall(this, A, q, K, Y, z, _)
        }
        createRetryingCall(A, q, K, Y, z) {
            let _ = (0, WI8.getNextCallNumber)();
            return this.trace("createRetryingCall [" + _ + '] method="' + q + '"'), new ZI8.RetryingCall(this, A, q, K, Y, z, _, this.retryBufferTracker, FT1.get(this.getTarget()))
        }
        createResolvingCall(A, q, K, Y, z) {
            let _ = (0, WI8.getNextCallNumber)();
            this.trace("createResolvingCall [" + _ + '] method="' + A + '", deadline=' + (0, nDY.deadlineToString)(q));
            let w = {
                    deadline: q,
                    flags: z !== null && z !== void 0 ? z : te.Propagate.DEFAULTS,
                    host: K !== null && K !== void 0 ? K : this.defaultAuthority,
                    parentCall: Y
                },
                O = new rDY.ResolvingCall(this, A, w, this.filterStackFactory.clone(), _);
            return this.onCallStart(), O.addStatusWatcher(($) => {
                this.onCallEnd($)
            }), O
        }
        close() {
            var A;
            this.resolvingLoadBalancer.destroy(), this.updateState(nR.ConnectivityState.SHUTDOWN), this.currentPicker = new bg4;
            for (let q of this.configSelectionQueue) q.cancelWithStatus(te.Status.UNAVAILABLE, "Channel closed before call started");
            this.configSelectionQueue = [];
            for (let q of this.pickQueue) q.cancelWithStatus(te.Status.UNAVAILABLE, "Channel closed before call started");
            if (this.pickQueue = [], this.callRefTimer) clearInterval(this.callRefTimer);
            if (this.idleTimer) clearTimeout(this.idleTimer);
            if (this.channelzEnabled)(0, Ld6.unregisterChannelzRef)(this.channelzRef);
            this.subchannelPool.unrefUnusedSubchannels(), (A = this.configSelector) === null || A === void 0 || A.unref(), this.configSelector = null
        }
        getTarget() {
            return (0, gT1.uriToString)(this.target)
        }
        getConnectivityState(A) {
            let q = this.connectivityState;
            if (A) this.resolvingLoadBalancer.exitIdle(), this.lastActivityTimestamp = new Date, this.maybeStartIdleTimer();
            return q
        }
        watchConnectivityState(A, q, K) {
            if (this.connectivityState === nR.ConnectivityState.SHUTDOWN) throw Error("Channel has been shut down");
            let Y = null;
            if (q !== 1 / 0) {
                let _ = q instanceof Date ? q : new Date(q),
                    w = new Date;
                if (q === -1 / 0 || _ <= w) {
                    process.nextTick(K, Error("Deadline passed without connectivity state change"));
                    return
                }
                Y = setTimeout(() => {
                    this.removeConnectivityStateWatcher(z), K(Error("Deadline passed without connectivity state change"))
                }, _.getTime() - w.getTime())
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
            if (this.connectivityState === nR.ConnectivityState.SHUTDOWN) throw Error("Channel has been shut down");
            return this.createResolvingCall(A, q, K, Y, z)
        }
        getOptions() {
            return this.options
        }
    }
    mg4.InternalChannel = ug4
})
// @from(Ln 314825, Col 4)
eS8 = x((pg4) => {
    Object.defineProperty(pg4, "__esModule", {
        value: !0
    });
    pg4.ChannelImplementation = void 0;
    var KXY = LG6(),
        YXY = fI8();
    class Fg4 {
        constructor(A, q, K) {
            if (typeof A !== "string") throw TypeError("Channel target must be a string");
            if (!(q instanceof KXY.ChannelCredentials)) throw TypeError("Channel credentials must be a ChannelCredentials object");
            if (K) {
                if (typeof K !== "object") throw TypeError("Channel options must be an object")
            }
            this.internalChannel = new YXY.InternalChannel(A, q, K)
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
    pg4.ChannelImplementation = Fg4
})