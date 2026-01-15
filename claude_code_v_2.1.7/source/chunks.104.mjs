
// @from(Ln 300748, Col 4)
oz2 = U((nz2) => {
  Object.defineProperty(nz2, "__esModule", {
    value: !0
  });
  nz2.Http2SubchannelConnector = void 0;
  var G6A = NA("http2"),
    dO5 = NA("tls"),
    PX1 = Vs(),
    fvA = j8(),
    cO5 = BF0(),
    xFA = WY(),
    pO5 = gS(),
    SX1 = hN(),
    YF0 = JU(),
    lO5 = NA("net"),
    iO5 = pz2(),
    nO5 = OX1(),
    JF0 = "transport",
    aO5 = "transport_flowctrl",
    oO5 = qK0().version,
    {
      HTTP2_HEADER_AUTHORITY: rO5,
      HTTP2_HEADER_CONTENT_TYPE: sO5,
      HTTP2_HEADER_METHOD: tO5,
      HTTP2_HEADER_PATH: eO5,
      HTTP2_HEADER_TE: AM5,
      HTTP2_HEADER_USER_AGENT: QM5
    } = G6A.constants,
    BM5 = 20000,
    GM5 = Buffer.from("too_many_pings", "ascii");
  class lz2 {
    constructor(A, Q, B, G) {
      if (this.session = A, this.options = B, this.remoteName = G, this.keepaliveTimer = null, this.pendingSendKeepalivePing = !1, this.activeCalls = new Set, this.disconnectListeners = [], this.disconnectHandled = !1, this.channelzEnabled = !0, this.keepalivesSent = 0, this.messagesSent = 0, this.messagesReceived = 0, this.lastMessageSentTimestamp = null, this.lastMessageReceivedTimestamp = null, this.subchannelAddressString = (0, SX1.subchannelAddressToString)(Q), B["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.streamTracker = new PX1.ChannelzCallTrackerStub;
      else this.streamTracker = new PX1.ChannelzCallTracker;
      if (this.channelzRef = (0, PX1.registerChannelzSocket)(this.subchannelAddressString, () => this.getChannelzInfo(), this.channelzEnabled), this.userAgent = [B["grpc.primary_user_agent"], `grpc-node-js/${oO5}`, B["grpc.secondary_user_agent"]].filter((Z) => Z).join(" "), "grpc.keepalive_time_ms" in B) this.keepaliveTimeMs = B["grpc.keepalive_time_ms"];
      else this.keepaliveTimeMs = -1;
      if ("grpc.keepalive_timeout_ms" in B) this.keepaliveTimeoutMs = B["grpc.keepalive_timeout_ms"];
      else this.keepaliveTimeoutMs = BM5;
      if ("grpc.keepalive_permit_without_calls" in B) this.keepaliveWithoutCalls = B["grpc.keepalive_permit_without_calls"] === 1;
      else this.keepaliveWithoutCalls = !1;
      if (A.once("close", () => {
          this.trace("session closed"), this.handleDisconnect()
        }), A.once("goaway", (Z, Y, J) => {
          let X = !1;
          if (Z === G6A.constants.NGHTTP2_ENHANCE_YOUR_CALM && J && J.equals(GM5)) X = !0;
          this.trace("connection closed by GOAWAY with code " + Z + " and data " + (J === null || J === void 0 ? void 0 : J.toString())), this.reportDisconnectToOwner(X)
        }), A.once("error", (Z) => {
          this.trace("connection closed with error " + Z.message), this.handleDisconnect()
        }), A.socket.once("close", (Z) => {
          this.trace("connection closed. hadError=" + Z), this.handleDisconnect()
        }), xFA.isTracerEnabled(JF0)) A.on("remoteSettings", (Z) => {
        this.trace("new settings received" + (this.session !== A ? " on the old connection" : "") + ": " + JSON.stringify(Z))
      }), A.on("localSettings", (Z) => {
        this.trace("local settings acknowledged by remote" + (this.session !== A ? " on the old connection" : "") + ": " + JSON.stringify(Z))
      });
      if (this.keepaliveWithoutCalls) this.maybeStartKeepalivePingTimer();
      if (A.socket instanceof dO5.TLSSocket) this.authContext = {
        transportSecurityType: "ssl",
        sslPeerCertificate: A.socket.getPeerCertificate()
      };
      else this.authContext = {}
    }
    getChannelzInfo() {
      var A, Q, B;
      let G = this.session.socket,
        Z = G.remoteAddress ? (0, SX1.stringToSubchannelAddress)(G.remoteAddress, G.remotePort) : null,
        Y = G.localAddress ? (0, SX1.stringToSubchannelAddress)(G.localAddress, G.localPort) : null,
        J;
      if (this.session.encrypted) {
        let I = G,
          D = I.getCipher(),
          W = I.getCertificate(),
          K = I.getPeerCertificate();
        J = {
          cipherSuiteStandardName: (A = D.standardName) !== null && A !== void 0 ? A : null,
          cipherSuiteOtherName: D.standardName ? null : D.name,
          localCertificate: W && "raw" in W ? W.raw : null,
          remoteCertificate: K && "raw" in K ? K.raw : null
        }
      } else J = null;
      return {
        remoteAddress: Z,
        localAddress: Y,
        security: J,
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
        localFlowControlWindow: (Q = this.session.state.localWindowSize) !== null && Q !== void 0 ? Q : null,
        remoteFlowControlWindow: (B = this.session.state.remoteWindowSize) !== null && B !== void 0 ? B : null
      }
    }
    trace(A) {
      xFA.trace(fvA.LogVerbosity.DEBUG, JF0, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    keepaliveTrace(A) {
      xFA.trace(fvA.LogVerbosity.DEBUG, "keepalive", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    flowControlTrace(A) {
      xFA.trace(fvA.LogVerbosity.DEBUG, aO5, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    internalsTrace(A) {
      xFA.trace(fvA.LogVerbosity.DEBUG, "transport_internals", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    reportDisconnectToOwner(A) {
      if (this.disconnectHandled) return;
      this.disconnectHandled = !0, this.disconnectListeners.forEach((Q) => Q(A))
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
      var A, Q;
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
      }, this.keepaliveTimeoutMs), (Q = (A = this.keepaliveTimer).unref) === null || Q === void 0 || Q.call(A);
      let B = "";
      try {
        if (!this.session.ping((Z, Y, J) => {
            if (this.clearKeepaliveTimeout(), Z) this.keepaliveTrace("Ping failed with error " + Z.message), this.handleDisconnect();
            else this.keepaliveTrace("Received ping response"), this.maybeStartKeepalivePingTimer()
          })) B = "Ping returned false"
      } catch (G) {
        B = (G instanceof Error ? G.message : "") || "Unknown error"
      }
      if (B) this.keepaliveTrace("Ping send failed: " + B), this.handleDisconnect()
    }
    maybeStartKeepalivePingTimer() {
      var A, Q;
      if (!this.canSendPing()) return;
      if (this.pendingSendKeepalivePing) this.pendingSendKeepalivePing = !1, this.maybeSendPing();
      else if (!this.keepaliveTimer) this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), this.keepaliveTimer = setTimeout(() => {
        this.keepaliveTimer = null, this.maybeSendPing()
      }, this.keepaliveTimeMs), (Q = (A = this.keepaliveTimer).unref) === null || Q === void 0 || Q.call(A)
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
    createCall(A, Q, B, G, Z) {
      let Y = A.toHttp2Headers();
      Y[rO5] = Q, Y[QM5] = this.userAgent, Y[sO5] = "application/grpc", Y[tO5] = "POST", Y[eO5] = B, Y[AM5] = "trailers";
      let J;
      try {
        J = this.session.request(Y)
      } catch (D) {
        throw this.handleDisconnect(), D
      }
      this.flowControlTrace("local window size: " + this.session.state.localWindowSize + " remote window size: " + this.session.state.remoteWindowSize), this.internalsTrace("session.closed=" + this.session.closed + " session.destroyed=" + this.session.destroyed + " session.socket.destroyed=" + this.session.socket.destroyed);
      let X, I;
      if (this.channelzEnabled) this.streamTracker.addCallStarted(), X = {
        addMessageSent: () => {
          var D;
          this.messagesSent += 1, this.lastMessageSentTimestamp = new Date, (D = Z.addMessageSent) === null || D === void 0 || D.call(Z)
        },
        addMessageReceived: () => {
          var D;
          this.messagesReceived += 1, this.lastMessageReceivedTimestamp = new Date, (D = Z.addMessageReceived) === null || D === void 0 || D.call(Z)
        },
        onCallEnd: (D) => {
          var W;
          (W = Z.onCallEnd) === null || W === void 0 || W.call(Z, D), this.removeActiveCall(I)
        },
        onStreamEnd: (D) => {
          var W;
          if (D) this.streamTracker.addCallSucceeded();
          else this.streamTracker.addCallFailed();
          (W = Z.onStreamEnd) === null || W === void 0 || W.call(Z, D)
        }
      };
      else X = {
        addMessageSent: () => {
          var D;
          (D = Z.addMessageSent) === null || D === void 0 || D.call(Z)
        },
        addMessageReceived: () => {
          var D;
          (D = Z.addMessageReceived) === null || D === void 0 || D.call(Z)
        },
        onCallEnd: (D) => {
          var W;
          (W = Z.onCallEnd) === null || W === void 0 || W.call(Z, D), this.removeActiveCall(I)
        },
        onStreamEnd: (D) => {
          var W;
          (W = Z.onStreamEnd) === null || W === void 0 || W.call(Z, D)
        }
      };
      return I = new iO5.Http2SubchannelCall(J, X, G, this, (0, nO5.getNextCallNumber)()), this.addActiveCall(I), I
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
      this.session.close(), (0, PX1.unregisterChannelzRef)(this.channelzRef)
    }
  }
  class iz2 {
    constructor(A) {
      this.channelTarget = A, this.session = null, this.isShutdown = !1
    }
    trace(A) {
      xFA.trace(fvA.LogVerbosity.DEBUG, JF0, (0, YF0.uriToString)(this.channelTarget) + " " + A)
    }
    createSession(A, Q, B) {
      if (this.isShutdown) return Promise.reject();
      if (A.socket.closed) return Promise.reject("Connection closed before starting HTTP/2 handshake");
      return new Promise((G, Z) => {
        var Y, J, X, I, D, W, K;
        let V = null,
          F = this.channelTarget;
        if ("grpc.http_connect_target" in B) {
          let b = (0, YF0.parseUri)(B["grpc.http_connect_target"]);
          if (b) F = b, V = (0, YF0.uriToString)(b)
        }
        let H = A.secure ? "https" : "http",
          E = (0, pO5.getDefaultAuthority)(F),
          z = () => {
            var b;
            (b = this.session) === null || b === void 0 || b.destroy(), this.session = null, setImmediate(() => {
              if (!x) x = !0, Z(`${j.trim()} (${new Date().toISOString()})`)
            })
          },
          $ = (b) => {
            var S;
            if ((S = this.session) === null || S === void 0 || S.destroy(), j = b.message, this.trace("connection failed with error " + j), !x) x = !0, Z(`${j} (${new Date().toISOString()})`)
          },
          O = {
            createConnection: (b, S) => {
              return A.socket
            },
            settings: {
              initialWindowSize: (I = (Y = B["grpc-node.flow_control_window"]) !== null && Y !== void 0 ? Y : (X = (J = G6A.getDefaultSettings) === null || J === void 0 ? void 0 : J.call(G6A)) === null || X === void 0 ? void 0 : X.initialWindowSize) !== null && I !== void 0 ? I : 65535
            }
          },
          L = G6A.connect(`${H}://${E}`, O),
          M = (K = (W = (D = G6A.getDefaultSettings) === null || D === void 0 ? void 0 : D.call(G6A)) === null || W === void 0 ? void 0 : W.initialWindowSize) !== null && K !== void 0 ? K : 65535,
          _ = B["grpc-node.flow_control_window"];
        this.session = L;
        let j = "Failed to connect",
          x = !1;
        L.unref(), L.once("remoteSettings", () => {
          var b;
          if (_ && _ > M) try {
            L.setLocalWindowSize(_)
          } catch (S) {
            let u = _ - ((b = L.state.localWindowSize) !== null && b !== void 0 ? b : M);
            if (u > 0) L.incrementWindowSize(u)
          }
          L.removeAllListeners(), A.socket.removeListener("close", z), A.socket.removeListener("error", $), G(new lz2(L, Q, B, V)), this.session = null
        }), L.once("close", z), L.once("error", $), A.socket.once("close", z), A.socket.once("error", $)
      })
    }
    tcpConnect(A, Q) {
      return (0, cO5.getProxiedConnection)(A, Q).then((B) => {
        if (B) return B;
        else return new Promise((G, Z) => {
          let Y = () => {
              Z(Error("Socket closed"))
            },
            J = (I) => {
              Z(I)
            },
            X = lO5.connect(A, () => {
              X.removeListener("close", Y), X.removeListener("error", J), G(X)
            });
          X.once("close", Y), X.once("error", J)
        })
      })
    }
    async connect(A, Q, B) {
      if (this.isShutdown) return Promise.reject();
      let G = null,
        Z = null,
        Y = (0, SX1.subchannelAddressToString)(A);
      try {
        return this.trace(Y + " Waiting for secureConnector to be ready"), await Q.waitForReady(), this.trace(Y + " secureConnector is ready"), G = await this.tcpConnect(A, B), G.setNoDelay(), this.trace(Y + " Established TCP connection"), Z = await Q.connect(G), this.trace(Y + " Established secure connection"), this.createSession(Z, A, B)
      } catch (J) {
        throw G === null || G === void 0 || G.destroy(), Z === null || Z === void 0 || Z.socket.destroy(), J
      }
    }
    shutdown() {
      var A;
      this.isShutdown = !0, (A = this.session) === null || A === void 0 || A.close(), this.session = null
    }
  }
  nz2.Http2SubchannelConnector = iz2
})
// @from(Ln 301078, Col 4)
tz2 = U((rz2) => {
  Object.defineProperty(rz2, "__esModule", {
    value: !0
  });
  rz2.SubchannelPool = void 0;
  rz2.getSubchannelPool = KM5;
  var ZM5 = tV2(),
    YM5 = Oz2(),
    JM5 = hN(),
    XM5 = JU(),
    IM5 = oz2(),
    DM5 = 1e4;
  class xX1 {
    constructor() {
      this.pool = Object.create(null), this.cleanupTimer = null
    }
    unrefUnusedSubchannels() {
      let A = !0;
      for (let Q in this.pool) {
        let G = this.pool[Q].filter((Z) => !Z.subchannel.unrefIfOneRef());
        if (G.length > 0) A = !1;
        this.pool[Q] = G
      }
      if (A && this.cleanupTimer !== null) clearInterval(this.cleanupTimer), this.cleanupTimer = null
    }
    ensureCleanupTask() {
      var A, Q;
      if (this.cleanupTimer === null) this.cleanupTimer = setInterval(() => {
        this.unrefUnusedSubchannels()
      }, DM5), (Q = (A = this.cleanupTimer).unref) === null || Q === void 0 || Q.call(A)
    }
    getOrCreateSubchannel(A, Q, B, G) {
      this.ensureCleanupTask();
      let Z = (0, XM5.uriToString)(A);
      if (Z in this.pool) {
        let J = this.pool[Z];
        for (let X of J)
          if ((0, JM5.subchannelAddressEqual)(Q, X.subchannelAddress) && (0, ZM5.channelOptionsEqual)(B, X.channelArguments) && G._equals(X.channelCredentials)) return X.subchannel
      }
      let Y = new YM5.Subchannel(A, Q, B, G, new IM5.Http2SubchannelConnector(A));
      if (!(Z in this.pool)) this.pool[Z] = [];
      return this.pool[Z].push({
        subchannelAddress: Q,
        channelArguments: B,
        channelCredentials: G,
        subchannel: Y
      }), Y.ref(), Y
    }
  }
  rz2.SubchannelPool = xX1;
  var WM5 = new xX1;

  function KM5(A) {
    if (A) return WM5;
    else return new xX1
  }
})
// @from(Ln 301135, Col 4)
Z$2 = U((B$2) => {
  Object.defineProperty(B$2, "__esModule", {
    value: !0
  });
  B$2.LoadBalancingCall = void 0;
  var ez2 = XU(),
    yX1 = j8(),
    A$2 = jFA(),
    vX1 = jF(),
    hvA = dd(),
    FM5 = JU(),
    HM5 = WY(),
    XF0 = xvA(),
    EM5 = NA("http2"),
    zM5 = "load_balancing_call";
  class Q$2 {
    constructor(A, Q, B, G, Z, Y, J) {
      var X, I;
      this.channel = A, this.callConfig = Q, this.methodName = B, this.host = G, this.credentials = Z, this.deadline = Y, this.callNumber = J, this.child = null, this.readPending = !1, this.pendingMessage = null, this.pendingHalfClose = !1, this.ended = !1, this.metadata = null, this.listener = null, this.onCallEnded = null, this.childStartTime = null;
      let D = this.methodName.split("/"),
        W = "";
      if (D.length >= 2) W = D[1];
      let K = (I = (X = (0, FM5.splitHostPort)(this.host)) === null || X === void 0 ? void 0 : X.host) !== null && I !== void 0 ? I : "localhost";
      this.serviceUrl = `https://${K}/${W}`, this.startTime = new Date
    }
    getDeadlineInfo() {
      var A, Q;
      let B = [];
      if (this.childStartTime) {
        if (this.childStartTime > this.startTime) {
          if ((A = this.metadata) === null || A === void 0 ? void 0 : A.getOptions().waitForReady) B.push("wait_for_ready");
          B.push(`LB pick: ${(0,A$2.formatDateDifference)(this.startTime,this.childStartTime)}`)
        }
        return B.push(...this.child.getDeadlineInfo()), B
      } else {
        if ((Q = this.metadata) === null || Q === void 0 ? void 0 : Q.getOptions().waitForReady) B.push("wait_for_ready");
        B.push("Waiting for LB pick")
      }
      return B
    }
    trace(A) {
      HM5.trace(yX1.LogVerbosity.DEBUG, zM5, "[" + this.callNumber + "] " + A)
    }
    outputStatus(A, Q) {
      var B, G;
      if (!this.ended) {
        this.ended = !0, this.trace("ended with status: code=" + A.code + ' details="' + A.details + '" start time=' + this.startTime.toISOString());
        let Z = Object.assign(Object.assign({}, A), {
          progress: Q
        });
        (B = this.listener) === null || B === void 0 || B.onReceiveStatus(Z), (G = this.onCallEnded) === null || G === void 0 || G.call(this, Z.code, Z.details, Z.metadata)
      }
    }
    doPick() {
      var A, Q;
      if (this.ended) return;
      if (!this.metadata) throw Error("doPick called before start");
      this.trace("Pick called");
      let B = this.metadata.clone(),
        G = this.channel.doPick(B, this.callConfig.pickInformation),
        Z = G.subchannel ? "(" + G.subchannel.getChannelzRef().id + ") " + G.subchannel.getAddress() : "" + G.subchannel;
      switch (this.trace("Pick result: " + hvA.PickResultType[G.pickResultType] + " subchannel: " + Z + " status: " + ((A = G.status) === null || A === void 0 ? void 0 : A.code) + " " + ((Q = G.status) === null || Q === void 0 ? void 0 : Q.details)), G.pickResultType) {
        case hvA.PickResultType.COMPLETE:
          this.credentials.compose(G.subchannel.getCallCredentials()).generateMetadata({
            method_name: this.methodName,
            service_url: this.serviceUrl
          }).then((I) => {
            var D;
            if (this.ended) {
              this.trace("Credentials metadata generation finished after call ended");
              return
            }
            if (B.merge(I), B.get("authorization").length > 1) this.outputStatus({
              code: yX1.Status.INTERNAL,
              details: '"authorization" metadata cannot have multiple values',
              metadata: new vX1.Metadata
            }, "PROCESSED");
            if (G.subchannel.getConnectivityState() !== ez2.ConnectivityState.READY) {
              this.trace("Picked subchannel " + Z + " has state " + ez2.ConnectivityState[G.subchannel.getConnectivityState()] + " after getting credentials metadata. Retrying pick"), this.doPick();
              return
            }
            if (this.deadline !== 1 / 0) B.set("grpc-timeout", (0, A$2.getDeadlineTimeoutString)(this.deadline));
            try {
              this.child = G.subchannel.getRealSubchannel().createCall(B, this.host, this.methodName, {
                onReceiveMetadata: (W) => {
                  this.trace("Received metadata"), this.listener.onReceiveMetadata(W)
                },
                onReceiveMessage: (W) => {
                  this.trace("Received message"), this.listener.onReceiveMessage(W)
                },
                onReceiveStatus: (W) => {
                  if (this.trace("Received status"), W.rstCode === EM5.constants.NGHTTP2_REFUSED_STREAM) this.outputStatus(W, "REFUSED");
                  else this.outputStatus(W, "PROCESSED")
                }
              }), this.childStartTime = new Date
            } catch (W) {
              this.trace("Failed to start call on picked subchannel " + Z + " with error " + W.message), this.outputStatus({
                code: yX1.Status.INTERNAL,
                details: "Failed to start HTTP/2 stream with error " + W.message,
                metadata: new vX1.Metadata
              }, "NOT_STARTED");
              return
            }
            if ((D = G.onCallStarted) === null || D === void 0 || D.call(G), this.onCallEnded = G.onCallEnded, this.trace("Created child call [" + this.child.getCallNumber() + "]"), this.readPending) this.child.startRead();
            if (this.pendingMessage) this.child.sendMessageWithContext(this.pendingMessage.context, this.pendingMessage.message);
            if (this.pendingHalfClose) this.child.halfClose()
          }, (I) => {
            let {
              code: D,
              details: W
            } = (0, XF0.restrictControlPlaneStatusCode)(typeof I.code === "number" ? I.code : yX1.Status.UNKNOWN, `Getting metadata from plugin failed with error: ${I.message}`);
            this.outputStatus({
              code: D,
              details: W,
              metadata: new vX1.Metadata
            }, "PROCESSED")
          });
          break;
        case hvA.PickResultType.DROP:
          let {
            code: J, details: X
          } = (0, XF0.restrictControlPlaneStatusCode)(G.status.code, G.status.details);
          setImmediate(() => {
            this.outputStatus({
              code: J,
              details: X,
              metadata: G.status.metadata
            }, "DROP")
          });
          break;
        case hvA.PickResultType.TRANSIENT_FAILURE:
          if (this.metadata.getOptions().waitForReady) this.channel.queueCallForPick(this);
          else {
            let {
              code: I,
              details: D
            } = (0, XF0.restrictControlPlaneStatusCode)(G.status.code, G.status.details);
            setImmediate(() => {
              this.outputStatus({
                code: I,
                details: D,
                metadata: G.status.metadata
              }, "PROCESSED")
            })
          }
          break;
        case hvA.PickResultType.QUEUE:
          this.channel.queueCallForPick(this)
      }
    }
    cancelWithStatus(A, Q) {
      var B;
      this.trace("cancelWithStatus code: " + A + ' details: "' + Q + '"'), (B = this.child) === null || B === void 0 || B.cancelWithStatus(A, Q), this.outputStatus({
        code: A,
        details: Q,
        metadata: new vX1.Metadata
      }, "PROCESSED")
    }
    getPeer() {
      var A, Q;
      return (Q = (A = this.child) === null || A === void 0 ? void 0 : A.getPeer()) !== null && Q !== void 0 ? Q : this.channel.getTarget()
    }
    start(A, Q) {
      this.trace("start called"), this.listener = Q, this.metadata = A, this.doPick()
    }
    sendMessageWithContext(A, Q) {
      if (this.trace("write() called with message of length " + Q.length), this.child) this.child.sendMessageWithContext(A, Q);
      else this.pendingMessage = {
        context: A,
        message: Q
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
  B$2.LoadBalancingCall = Q$2
})
// @from(Ln 301328, Col 4)
D$2 = U((X$2) => {
  Object.defineProperty(X$2, "__esModule", {
    value: !0
  });
  X$2.ResolvingCall = void 0;
  var $M5 = fJ1(),
    Z6A = j8(),
    Y6A = jFA(),
    Y$2 = jF(),
    CM5 = WY(),
    UM5 = xvA(),
    qM5 = "resolving_call";
  class J$2 {
    constructor(A, Q, B, G, Z) {
      if (this.channel = A, this.method = Q, this.filterStackFactory = G, this.callNumber = Z, this.child = null, this.readPending = !1, this.pendingMessage = null, this.pendingHalfClose = !1, this.ended = !1, this.readFilterPending = !1, this.writeFilterPending = !1, this.pendingChildStatus = null, this.metadata = null, this.listener = null, this.statusWatchers = [], this.deadlineTimer = setTimeout(() => {}, 0), this.filterStack = null, this.deadlineStartTime = null, this.configReceivedTime = null, this.childStartTime = null, this.credentials = $M5.CallCredentials.createEmpty(), this.deadline = B.deadline, this.host = B.host, B.parentCall) {
        if (B.flags & Z6A.Propagate.CANCELLATION) B.parentCall.on("cancelled", () => {
          this.cancelWithStatus(Z6A.Status.CANCELLED, "Cancelled by parent call")
        });
        if (B.flags & Z6A.Propagate.DEADLINE) this.trace("Propagating deadline from parent: " + B.parentCall.getDeadline()), this.deadline = (0, Y6A.minDeadline)(this.deadline, B.parentCall.getDeadline())
      }
      this.trace("Created"), this.runDeadlineTimer()
    }
    trace(A) {
      CM5.trace(Z6A.LogVerbosity.DEBUG, qM5, "[" + this.callNumber + "] " + A)
    }
    runDeadlineTimer() {
      clearTimeout(this.deadlineTimer), this.deadlineStartTime = new Date, this.trace("Deadline: " + (0, Y6A.deadlineToString)(this.deadline));
      let A = (0, Y6A.getRelativeTimeout)(this.deadline);
      if (A !== 1 / 0) {
        this.trace("Deadline will be reached in " + A + "ms");
        let Q = () => {
          if (!this.deadlineStartTime) {
            this.cancelWithStatus(Z6A.Status.DEADLINE_EXCEEDED, "Deadline exceeded");
            return
          }
          let B = [],
            G = new Date;
          if (B.push(`Deadline exceeded after ${(0,Y6A.formatDateDifference)(this.deadlineStartTime,G)}`), this.configReceivedTime) {
            if (this.configReceivedTime > this.deadlineStartTime) B.push(`name resolution: ${(0,Y6A.formatDateDifference)(this.deadlineStartTime,this.configReceivedTime)}`);
            if (this.childStartTime) {
              if (this.childStartTime > this.configReceivedTime) B.push(`metadata filters: ${(0,Y6A.formatDateDifference)(this.configReceivedTime,this.childStartTime)}`)
            } else B.push("waiting for metadata filters")
          } else B.push("waiting for name resolution");
          if (this.child) B.push(...this.child.getDeadlineInfo());
          this.cancelWithStatus(Z6A.Status.DEADLINE_EXCEEDED, B.join(","))
        };
        if (A <= 0) process.nextTick(Q);
        else this.deadlineTimer = setTimeout(Q, A)
      }
    }
    outputStatus(A) {
      if (!this.ended) {
        if (this.ended = !0, !this.filterStack) this.filterStack = this.filterStackFactory.createFilter();
        clearTimeout(this.deadlineTimer);
        let Q = this.filterStack.receiveTrailers(A);
        this.trace("ended with status: code=" + Q.code + ' details="' + Q.details + '"'), this.statusWatchers.forEach((B) => B(Q)), process.nextTick(() => {
          var B;
          (B = this.listener) === null || B === void 0 || B.onReceiveStatus(Q)
        })
      }
    }
    sendMessageOnChild(A, Q) {
      if (!this.child) throw Error("sendMessageonChild called with child not populated");
      let B = this.child;
      this.writeFilterPending = !0, this.filterStack.sendMessage(Promise.resolve({
        message: Q,
        flags: A.flags
      })).then((G) => {
        if (this.writeFilterPending = !1, B.sendMessageWithContext(A, G.message), this.pendingHalfClose) B.halfClose()
      }, (G) => {
        this.cancelWithStatus(G.code, G.details)
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
      let Q = A.config;
      if (Q.status !== Z6A.Status.OK) {
        let {
          code: B,
          details: G
        } = (0, UM5.restrictControlPlaneStatusCode)(Q.status, "Failed to route call to method " + this.method);
        this.outputStatus({
          code: B,
          details: G,
          metadata: new Y$2.Metadata
        });
        return
      }
      if (Q.methodConfig.timeout) {
        let B = new Date;
        B.setSeconds(B.getSeconds() + Q.methodConfig.timeout.seconds), B.setMilliseconds(B.getMilliseconds() + Q.methodConfig.timeout.nanos / 1e6), this.deadline = (0, Y6A.minDeadline)(this.deadline, B), this.runDeadlineTimer()
      }
      this.filterStackFactory.push(Q.dynamicFilterFactories), this.filterStack = this.filterStackFactory.createFilter(), this.filterStack.sendMetadata(Promise.resolve(this.metadata)).then((B) => {
        if (this.child = this.channel.createRetryingCall(Q, this.method, this.host, this.credentials, this.deadline), this.trace("Created child [" + this.child.getCallNumber() + "]"), this.childStartTime = new Date, this.child.start(B, {
            onReceiveMetadata: (G) => {
              this.trace("Received metadata"), this.listener.onReceiveMetadata(this.filterStack.receiveMetadata(G))
            },
            onReceiveMessage: (G) => {
              this.trace("Received message"), this.readFilterPending = !0, this.filterStack.receiveMessage(G).then((Z) => {
                if (this.trace("Finished filtering received message"), this.readFilterPending = !1, this.listener.onReceiveMessage(Z), this.pendingChildStatus) this.outputStatus(this.pendingChildStatus)
              }, (Z) => {
                this.cancelWithStatus(Z.code, Z.details)
              })
            },
            onReceiveStatus: (G) => {
              if (this.trace("Received status"), this.readFilterPending) this.pendingChildStatus = G;
              else this.outputStatus(G)
            }
          }), this.readPending) this.child.startRead();
        if (this.pendingMessage) this.sendMessageOnChild(this.pendingMessage.context, this.pendingMessage.message);
        else if (this.pendingHalfClose) this.child.halfClose()
      }, (B) => {
        this.outputStatus(B)
      })
    }
    reportResolverError(A) {
      var Q;
      if ((Q = this.metadata) === null || Q === void 0 ? void 0 : Q.getOptions().waitForReady) this.channel.queueCallForConfig(this);
      else this.outputStatus(A)
    }
    cancelWithStatus(A, Q) {
      var B;
      this.trace("cancelWithStatus code: " + A + ' details: "' + Q + '"'), (B = this.child) === null || B === void 0 || B.cancelWithStatus(A, Q), this.outputStatus({
        code: A,
        details: Q,
        metadata: new Y$2.Metadata
      })
    }
    getPeer() {
      var A, Q;
      return (Q = (A = this.child) === null || A === void 0 ? void 0 : A.getPeer()) !== null && Q !== void 0 ? Q : this.channel.getTarget()
    }
    start(A, Q) {
      this.trace("start called"), this.metadata = A.clone(), this.listener = Q, this.getConfig()
    }
    sendMessageWithContext(A, Q) {
      if (this.trace("write() called with message of length " + Q.length), this.child) this.sendMessageOnChild(A, Q);
      else this.pendingMessage = {
        context: A,
        message: Q
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
  X$2.ResolvingCall = J$2
})
// @from(Ln 301505, Col 4)
E$2 = U((F$2) => {
  Object.defineProperty(F$2, "__esModule", {
    value: !0
  });
  F$2.RetryingCall = F$2.MessageBufferTracker = F$2.RetryThrottler = void 0;
  var kX1 = j8(),
    NM5 = jFA(),
    wM5 = jF(),
    LM5 = WY(),
    OM5 = "retrying_call";
  class W$2 {
    constructor(A, Q, B) {
      if (this.maxTokens = A, this.tokenRatio = Q, B) this.tokens = B.tokens * (A / B.maxTokens);
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
  F$2.RetryThrottler = W$2;
  class K$2 {
    constructor(A, Q) {
      this.totalLimit = A, this.limitPerCall = Q, this.totalAllocated = 0, this.allocatedPerCall = new Map
    }
    allocate(A, Q) {
      var B;
      let G = (B = this.allocatedPerCall.get(Q)) !== null && B !== void 0 ? B : 0;
      if (this.limitPerCall - G < A || this.totalLimit - this.totalAllocated < A) return !1;
      return this.allocatedPerCall.set(Q, G + A), this.totalAllocated += A, !0
    }
    free(A, Q) {
      var B;
      if (this.totalAllocated < A) throw Error(`Invalid buffer allocation state: call ${Q} freed ${A} > total allocated ${this.totalAllocated}`);
      this.totalAllocated -= A;
      let G = (B = this.allocatedPerCall.get(Q)) !== null && B !== void 0 ? B : 0;
      if (G < A) throw Error(`Invalid buffer allocation state: call ${Q} freed ${A} > allocated for call ${G}`);
      this.allocatedPerCall.set(Q, G - A)
    }
    freeAll(A) {
      var Q;
      let B = (Q = this.allocatedPerCall.get(A)) !== null && Q !== void 0 ? Q : 0;
      if (this.totalAllocated < B) throw Error(`Invalid buffer allocation state: call ${A} allocated ${B} > total allocated ${this.totalAllocated}`);
      this.totalAllocated -= B, this.allocatedPerCall.delete(A)
    }
  }
  F$2.MessageBufferTracker = K$2;
  var IF0 = "grpc-previous-rpc-attempts",
    MM5 = 5;
  class V$2 {
    constructor(A, Q, B, G, Z, Y, J, X, I) {
      var D;
      this.channel = A, this.callConfig = Q, this.methodName = B, this.host = G, this.credentials = Z, this.deadline = Y, this.callNumber = J, this.bufferTracker = X, this.retryThrottler = I, this.listener = null, this.initialMetadata = null, this.underlyingCalls = [], this.writeBuffer = [], this.writeBufferOffset = 0, this.readStarted = !1, this.transparentRetryUsed = !1, this.attempts = 0, this.hedgingTimer = null, this.committedCallIndex = null, this.initialRetryBackoffSec = 0, this.nextRetryBackoffSec = 0;
      let W = (D = A.getOptions()["grpc-node.retry_max_attempts_limit"]) !== null && D !== void 0 ? D : MM5;
      if (A.getOptions()["grpc.enable_retries"] === 0) this.state = "NO_RETRY", this.maxAttempts = 1;
      else if (Q.methodConfig.retryPolicy) {
        this.state = "RETRY";
        let K = Q.methodConfig.retryPolicy;
        this.nextRetryBackoffSec = this.initialRetryBackoffSec = Number(K.initialBackoff.substring(0, K.initialBackoff.length - 1)), this.maxAttempts = Math.min(K.maxAttempts, W)
      } else if (Q.methodConfig.hedgingPolicy) this.state = "HEDGING", this.maxAttempts = Math.min(Q.methodConfig.hedgingPolicy.maxAttempts, W);
      else this.state = "TRANSPARENT_ONLY", this.maxAttempts = 1;
      this.startTime = new Date
    }
    getDeadlineInfo() {
      if (this.underlyingCalls.length === 0) return [];
      let A = [],
        Q = this.underlyingCalls[this.underlyingCalls.length - 1];
      if (this.underlyingCalls.length > 1) A.push(`previous attempts: ${this.underlyingCalls.length-1}`);
      if (Q.startTime > this.startTime) A.push(`time to current attempt start: ${(0,NM5.formatDateDifference)(this.startTime,Q.startTime)}`);
      return A.push(...Q.call.getDeadlineInfo()), A
    }
    getCallNumber() {
      return this.callNumber
    }
    trace(A) {
      LM5.trace(kX1.LogVerbosity.DEBUG, OM5, "[" + this.callNumber + "] " + A)
    }
    reportStatus(A) {
      this.trace("ended with status: code=" + A.code + ' details="' + A.details + '" start time=' + this.startTime.toISOString()), this.bufferTracker.freeAll(this.callNumber), this.writeBufferOffset = this.writeBufferOffset + this.writeBuffer.length, this.writeBuffer = [], process.nextTick(() => {
        var Q;
        (Q = this.listener) === null || Q === void 0 || Q.onReceiveStatus({
          code: A.code,
          details: A.details,
          metadata: A.metadata
        })
      })
    }
    cancelWithStatus(A, Q) {
      this.trace("cancelWithStatus code: " + A + ' details: "' + Q + '"'), this.reportStatus({
        code: A,
        details: Q,
        metadata: new wM5.Metadata
      });
      for (let {
          call: B
        }
        of this.underlyingCalls) B.cancelWithStatus(A, Q)
    }
    getPeer() {
      if (this.committedCallIndex !== null) return this.underlyingCalls[this.committedCallIndex].call.getPeer();
      else return "unknown"
    }
    getBufferEntry(A) {
      var Q;
      return (Q = this.writeBuffer[A - this.writeBufferOffset]) !== null && Q !== void 0 ? Q : {
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
      for (let Q = this.writeBufferOffset; Q < A; Q++) {
        let B = this.getBufferEntry(Q);
        if (B.allocated) this.bufferTracker.free(B.message.message.length, this.callNumber)
      }
      this.writeBuffer = this.writeBuffer.slice(A - this.writeBufferOffset), this.writeBufferOffset = A
    }
    commitCall(A) {
      var Q, B;
      if (this.state === "COMMITTED") return;
      this.trace("Committing call [" + this.underlyingCalls[A].call.getCallNumber() + "] at index " + A), this.state = "COMMITTED", (B = (Q = this.callConfig).onCommitted) === null || B === void 0 || B.call(Q), this.committedCallIndex = A;
      for (let G = 0; G < this.underlyingCalls.length; G++) {
        if (G === A) continue;
        if (this.underlyingCalls[G].state === "COMPLETED") continue;
        this.underlyingCalls[G].state = "COMPLETED", this.underlyingCalls[G].call.cancelWithStatus(kX1.Status.CANCELLED, "Discarded in favor of other hedged attempt")
      }
      this.clearSentMessages()
    }
    commitCallWithMostMessages() {
      if (this.state === "COMMITTED") return;
      let A = -1,
        Q = -1;
      for (let [B, G] of this.underlyingCalls.entries())
        if (G.state === "ACTIVE" && G.nextMessageToSend > A) A = G.nextMessageToSend, Q = B;
      if (Q === -1) this.state = "TRANSPARENT_ONLY";
      else this.commitCall(Q)
    }
    isStatusCodeInList(A, Q) {
      return A.some((B) => {
        var G;
        return B === Q || B.toString().toLowerCase() === ((G = kX1.Status[Q]) === null || G === void 0 ? void 0 : G.toLowerCase())
      })
    }
    getNextRetryJitter() {
      return Math.random() * 0.3999999999999999 + 0.8
    }
    getNextRetryBackoffMs() {
      var A;
      let Q = (A = this.callConfig) === null || A === void 0 ? void 0 : A.methodConfig.retryPolicy;
      if (!Q) return 0;
      let G = this.getNextRetryJitter() * this.nextRetryBackoffSec * 1000,
        Z = Number(Q.maxBackoff.substring(0, Q.maxBackoff.length - 1));
      return this.nextRetryBackoffSec = Math.min(this.nextRetryBackoffSec * Q.backoffMultiplier, Z), G
    }
    maybeRetryCall(A, Q) {
      if (this.state !== "RETRY") {
        Q(!1);
        return
      }
      if (this.attempts >= this.maxAttempts) {
        Q(!1);
        return
      }
      let B;
      if (A === null) B = this.getNextRetryBackoffMs();
      else if (A < 0) {
        this.state = "TRANSPARENT_ONLY", Q(!1);
        return
      } else B = A, this.nextRetryBackoffSec = this.initialRetryBackoffSec;
      setTimeout(() => {
        var G, Z;
        if (this.state !== "RETRY") {
          Q(!1);
          return
        }
        if ((Z = (G = this.retryThrottler) === null || G === void 0 ? void 0 : G.canRetryCall()) !== null && Z !== void 0 ? Z : !0) Q(!0), this.attempts += 1, this.startNewAttempt();
        else this.trace("Retry attempt denied by throttling policy"), Q(!1)
      }, B)
    }
    countActiveCalls() {
      let A = 0;
      for (let Q of this.underlyingCalls)
        if ((Q === null || Q === void 0 ? void 0 : Q.state) === "ACTIVE") A += 1;
      return A
    }
    handleProcessedStatus(A, Q, B) {
      var G, Z, Y;
      switch (this.state) {
        case "COMMITTED":
        case "NO_RETRY":
        case "TRANSPARENT_ONLY":
          this.commitCall(Q), this.reportStatus(A);
          break;
        case "HEDGING":
          if (this.isStatusCodeInList((G = this.callConfig.methodConfig.hedgingPolicy.nonFatalStatusCodes) !== null && G !== void 0 ? G : [], A.code)) {
            (Z = this.retryThrottler) === null || Z === void 0 || Z.addCallFailed();
            let J;
            if (B === null) J = 0;
            else if (B < 0) {
              this.state = "TRANSPARENT_ONLY", this.commitCall(Q), this.reportStatus(A);
              return
            } else J = B;
            setTimeout(() => {
              if (this.maybeStartHedgingAttempt(), this.countActiveCalls() === 0) this.commitCall(Q), this.reportStatus(A)
            }, J)
          } else this.commitCall(Q), this.reportStatus(A);
          break;
        case "RETRY":
          if (this.isStatusCodeInList(this.callConfig.methodConfig.retryPolicy.retryableStatusCodes, A.code))(Y = this.retryThrottler) === null || Y === void 0 || Y.addCallFailed(), this.maybeRetryCall(B, (J) => {
            if (!J) this.commitCall(Q), this.reportStatus(A)
          });
          else this.commitCall(Q), this.reportStatus(A);
          break
      }
    }
    getPushback(A) {
      let Q = A.get("grpc-retry-pushback-ms");
      if (Q.length === 0) return null;
      try {
        return parseInt(Q[0])
      } catch (B) {
        return -1
      }
    }
    handleChildStatus(A, Q) {
      var B;
      if (this.underlyingCalls[Q].state === "COMPLETED") return;
      if (this.trace("state=" + this.state + " handling status with progress " + A.progress + " from child [" + this.underlyingCalls[Q].call.getCallNumber() + "] in state " + this.underlyingCalls[Q].state), this.underlyingCalls[Q].state = "COMPLETED", A.code === kX1.Status.OK) {
        (B = this.retryThrottler) === null || B === void 0 || B.addCallSucceeded(), this.commitCall(Q), this.reportStatus(A);
        return
      }
      if (this.state === "NO_RETRY") {
        this.commitCall(Q), this.reportStatus(A);
        return
      }
      if (this.state === "COMMITTED") {
        this.reportStatus(A);
        return
      }
      let G = this.getPushback(A.metadata);
      switch (A.progress) {
        case "NOT_STARTED":
          this.startNewAttempt();
          break;
        case "REFUSED":
          if (this.transparentRetryUsed) this.handleProcessedStatus(A, Q, G);
          else this.transparentRetryUsed = !0, this.startNewAttempt();
          break;
        case "DROP":
          this.commitCall(Q), this.reportStatus(A);
          break;
        case "PROCESSED":
          this.handleProcessedStatus(A, Q, G);
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
      var A, Q, B;
      if (this.hedgingTimer) clearTimeout(this.hedgingTimer);
      if (this.state !== "HEDGING") return;
      if (!this.callConfig.methodConfig.hedgingPolicy) return;
      let G = this.callConfig.methodConfig.hedgingPolicy;
      if (this.attempts >= this.maxAttempts) return;
      let Z = (A = G.hedgingDelay) !== null && A !== void 0 ? A : "0s",
        Y = Number(Z.substring(0, Z.length - 1));
      this.hedgingTimer = setTimeout(() => {
        this.maybeStartHedgingAttempt()
      }, Y * 1000), (B = (Q = this.hedgingTimer).unref) === null || B === void 0 || B.call(Q)
    }
    startNewAttempt() {
      let A = this.channel.createLoadBalancingCall(this.callConfig, this.methodName, this.host, this.credentials, this.deadline);
      this.trace("Created child call [" + A.getCallNumber() + "] for attempt " + this.attempts);
      let Q = this.underlyingCalls.length;
      this.underlyingCalls.push({
        state: "ACTIVE",
        call: A,
        nextMessageToSend: 0,
        startTime: new Date
      });
      let B = this.attempts - 1,
        G = this.initialMetadata.clone();
      if (B > 0) G.set(IF0, `${B}`);
      let Z = !1;
      if (A.start(G, {
          onReceiveMetadata: (Y) => {
            if (this.trace("Received metadata from child [" + A.getCallNumber() + "]"), this.commitCall(Q), Z = !0, B > 0) Y.set(IF0, `${B}`);
            if (this.underlyingCalls[Q].state === "ACTIVE") this.listener.onReceiveMetadata(Y)
          },
          onReceiveMessage: (Y) => {
            if (this.trace("Received message from child [" + A.getCallNumber() + "]"), this.commitCall(Q), this.underlyingCalls[Q].state === "ACTIVE") this.listener.onReceiveMessage(Y)
          },
          onReceiveStatus: (Y) => {
            if (this.trace("Received status from child [" + A.getCallNumber() + "]"), !Z && B > 0) Y.metadata.set(IF0, `${B}`);
            this.handleChildStatus(Y, Q)
          }
        }), this.sendNextChildMessage(Q), this.readStarted) A.startRead()
    }
    start(A, Q) {
      this.trace("start called"), this.listener = Q, this.initialMetadata = A, this.attempts += 1, this.startNewAttempt(), this.maybeStartHedgingTimer()
    }
    handleChildWriteCompleted(A) {
      var Q, B;
      let G = this.underlyingCalls[A],
        Z = G.nextMessageToSend;
      (B = (Q = this.getBufferEntry(Z)).callback) === null || B === void 0 || B.call(Q), this.clearSentMessages(), G.nextMessageToSend += 1, this.sendNextChildMessage(A)
    }
    sendNextChildMessage(A) {
      let Q = this.underlyingCalls[A];
      if (Q.state === "COMPLETED") return;
      if (this.getBufferEntry(Q.nextMessageToSend)) {
        let B = this.getBufferEntry(Q.nextMessageToSend);
        switch (B.entryType) {
          case "MESSAGE":
            Q.call.sendMessageWithContext({
              callback: (G) => {
                this.handleChildWriteCompleted(A)
              }
            }, B.message.message);
            break;
          case "HALF_CLOSE":
            Q.nextMessageToSend += 1, Q.call.halfClose();
            break;
          case "FREED":
            break
        }
      }
    }
    sendMessageWithContext(A, Q) {
      var B;
      this.trace("write() called with message of length " + Q.length);
      let G = {
          message: Q,
          flags: A.flags
        },
        Z = this.getNextBufferIndex(),
        Y = {
          entryType: "MESSAGE",
          message: G,
          allocated: this.bufferTracker.allocate(Q.length, this.callNumber)
        };
      if (this.writeBuffer.push(Y), Y.allocated) {
        (B = A.callback) === null || B === void 0 || B.call(A);
        for (let [J, X] of this.underlyingCalls.entries())
          if (X.state === "ACTIVE" && X.nextMessageToSend === Z) X.call.sendMessageWithContext({
            callback: (I) => {
              this.handleChildWriteCompleted(J)
            }
          }, Q)
      } else {
        if (this.commitCallWithMostMessages(), this.committedCallIndex === null) return;
        let J = this.underlyingCalls[this.committedCallIndex];
        if (Y.callback = A.callback, J.state === "ACTIVE" && J.nextMessageToSend === Z) J.call.sendMessageWithContext({
          callback: (X) => {
            this.handleChildWriteCompleted(this.committedCallIndex)
          }
        }, Q)
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
      for (let Q of this.underlyingCalls)
        if ((Q === null || Q === void 0 ? void 0 : Q.state) === "ACTIVE" && Q.nextMessageToSend === A) Q.nextMessageToSend += 1, Q.call.halfClose()
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
  F$2.RetryingCall = V$2
})
// @from(Ln 301911, Col 4)
gvA = U(($$2) => {
  Object.defineProperty($$2, "__esModule", {
    value: !0
  });
  $$2.BaseSubchannelWrapper = void 0;
  class z$2 {
    constructor(A) {
      this.child = A, this.healthy = !0, this.healthListeners = new Set, this.refcount = 0, this.dataWatchers = new Set, A.addHealthStateWatcher((Q) => {
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
  $$2.BaseSubchannelWrapper = z$2
})
// @from(Ln 301987, Col 4)
VF0 = U((O$2) => {
  Object.defineProperty(O$2, "__esModule", {
    value: !0
  });
  O$2.InternalChannel = O$2.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = void 0;
  var jM5 = FFA(),
    TM5 = oV2(),
    PM5 = tz2(),
    KF0 = dd(),
    SM5 = jF(),
    Hs = j8(),
    xM5 = RX1(),
    yM5 = nV0(),
    U$2 = gS(),
    bX1 = WY(),
    vM5 = BF0(),
    fX1 = JU(),
    t_ = XU(),
    uvA = Vs(),
    kM5 = Z$2(),
    bM5 = jFA(),
    fM5 = D$2(),
    DF0 = OX1(),
    hM5 = xvA(),
    WF0 = E$2(),
    gM5 = gvA(),
    uM5 = 2147483647,
    mM5 = 1000,
    dM5 = 1800000,
    hX1 = new Map,
    cM5 = 16777216,
    pM5 = 1048576;
  class q$2 extends gM5.BaseSubchannelWrapper {
    constructor(A, Q) {
      super(A);
      this.channel = Q, this.refCount = 0, this.subchannelStateListener = (B, G, Z, Y) => {
        Q.throttleKeepalive(Y)
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
  class N$2 {
    pick(A) {
      return {
        pickResultType: KF0.PickResultType.DROP,
        status: {
          code: Hs.Status.UNAVAILABLE,
          details: "Channel closed before call started",
          metadata: new SM5.Metadata
        },
        subchannel: null,
        onCallStarted: null,
        onCallEnded: null
      }
    }
  }
  O$2.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = "grpc.internal.no_subchannel";
  class w$2 {
    constructor(A) {
      this.target = A, this.trace = new uvA.ChannelzTrace, this.callTracker = new uvA.ChannelzCallTracker, this.childrenTracker = new uvA.ChannelzChildrenTracker, this.state = t_.ConnectivityState.IDLE
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
  class L$2 {
    constructor(A, Q, B) {
      var G, Z, Y, J, X, I;
      if (this.credentials = Q, this.options = B, this.connectivityState = t_.ConnectivityState.IDLE, this.currentPicker = new KF0.UnavailablePicker, this.configSelectionQueue = [], this.pickQueue = [], this.connectivityStateWatchers = [], this.callRefTimer = null, this.configSelector = null, this.currentResolutionError = null, this.wrappedSubchannels = new Set, this.callCount = 0, this.idleTimer = null, this.channelzEnabled = !0, this.randomChannelId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), typeof A !== "string") throw TypeError("Channel target must be a string");
      if (!(Q instanceof jM5.ChannelCredentials)) throw TypeError("Channel credentials must be a ChannelCredentials object");
      if (B) {
        if (typeof B !== "object") throw TypeError("Channel options must be an object")
      }
      this.channelzInfoTracker = new w$2(A);
      let D = (0, fX1.parseUri)(A);
      if (D === null) throw Error(`Could not parse target name "${A}"`);
      let W = (0, U$2.mapUriDefaultScheme)(D);
      if (W === null) throw Error(`Could not find a default scheme for target name "${A}"`);
      if (this.options["grpc.enable_channelz"] === 0) this.channelzEnabled = !1;
      if (this.channelzRef = (0, uvA.registerChannelzChannel)(A, this.channelzInfoTracker.getChannelzInfoCallback(), this.channelzEnabled), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Channel created");
      if (this.options["grpc.default_authority"]) this.defaultAuthority = this.options["grpc.default_authority"];
      else this.defaultAuthority = (0, U$2.getDefaultAuthority)(W);
      let K = (0, vM5.mapProxyName)(W, B);
      this.target = K.target, this.options = Object.assign({}, this.options, K.extraOptions), this.subchannelPool = (0, PM5.getSubchannelPool)(((G = this.options["grpc.use_local_subchannel_pool"]) !== null && G !== void 0 ? G : 0) === 0), this.retryBufferTracker = new WF0.MessageBufferTracker((Z = this.options["grpc.retry_buffer_size"]) !== null && Z !== void 0 ? Z : cM5, (Y = this.options["grpc.per_rpc_retry_buffer_size"]) !== null && Y !== void 0 ? Y : pM5), this.keepaliveTime = (J = this.options["grpc.keepalive_time_ms"]) !== null && J !== void 0 ? J : -1, this.idleTimeoutMs = Math.max((X = this.options["grpc.client_idle_timeout_ms"]) !== null && X !== void 0 ? X : dM5, mM5);
      let V = {
        createSubchannel: (H, E) => {
          let z = {};
          for (let [L, M] of Object.entries(E))
            if (!L.startsWith(O$2.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX)) z[L] = M;
          let $ = this.subchannelPool.getOrCreateSubchannel(this.target, H, z, this.credentials);
          if ($.throttleKeepalive(this.keepaliveTime), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Created subchannel or used existing subchannel", $.getChannelzRef());
          return new q$2($, this)
        },
        updateState: (H, E) => {
          this.currentPicker = E;
          let z = this.pickQueue.slice();
          if (this.pickQueue = [], z.length > 0) this.callRefTimerUnref();
          for (let $ of z) $.doPick();
          this.updateState(H)
        },
        requestReresolution: () => {
          throw Error("Resolving load balancer should never call requestReresolution")
        },
        addChannelzChild: (H) => {
          if (this.channelzEnabled) this.channelzInfoTracker.childrenTracker.refChild(H)
        },
        removeChannelzChild: (H) => {
          if (this.channelzEnabled) this.channelzInfoTracker.childrenTracker.unrefChild(H)
        }
      };
      this.resolvingLoadBalancer = new TM5.ResolvingLoadBalancer(this.target, V, this.options, (H, E) => {
        var z;
        if (H.retryThrottling) hX1.set(this.getTarget(), new WF0.RetryThrottler(H.retryThrottling.maxTokens, H.retryThrottling.tokenRatio, hX1.get(this.getTarget())));
        else hX1.delete(this.getTarget());
        if (this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Address resolution succeeded");
        (z = this.configSelector) === null || z === void 0 || z.unref(), this.configSelector = E, this.currentResolutionError = null, process.nextTick(() => {
          let $ = this.configSelectionQueue;
          if (this.configSelectionQueue = [], $.length > 0) this.callRefTimerUnref();
          for (let O of $) O.getConfig()
        })
      }, (H) => {
        if (this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_WARNING", "Address resolution failed with code " + H.code + ' and details "' + H.details + '"');
        if (this.configSelectionQueue.length > 0) this.trace("Name resolution failed with calls queued for config selection");
        if (this.configSelector === null) this.currentResolutionError = Object.assign(Object.assign({}, (0, hM5.restrictControlPlaneStatusCode)(H.code, H.details)), {
          metadata: H.metadata
        });
        let E = this.configSelectionQueue;
        if (this.configSelectionQueue = [], E.length > 0) this.callRefTimerUnref();
        for (let z of E) z.reportResolverError(H)
      }), this.filterStackFactory = new xM5.FilterStackFactory([new yM5.CompressionFilterFactory(this, this.options)]), this.trace("Channel constructed with options " + JSON.stringify(B, void 0, 2));
      let F = Error();
      if ((0, bX1.isTracerEnabled)("channel_stacktrace"))(0, bX1.trace)(Hs.LogVerbosity.DEBUG, "channel_stacktrace", "(" + this.channelzRef.id + `) Channel constructed 
` + ((I = F.stack) === null || I === void 0 ? void 0 : I.substring(F.stack.indexOf(`
`) + 1)));
      this.lastActivityTimestamp = new Date
    }
    trace(A, Q) {
      (0, bX1.trace)(Q !== null && Q !== void 0 ? Q : Hs.LogVerbosity.DEBUG, "channel", "(" + this.channelzRef.id + ") " + (0, fX1.uriToString)(this.target) + " " + A)
    }
    callRefTimerRef() {
      var A, Q, B, G;
      if (!this.callRefTimer) this.callRefTimer = setInterval(() => {}, uM5);
      if (!((Q = (A = this.callRefTimer).hasRef) === null || Q === void 0 ? void 0 : Q.call(A))) this.trace("callRefTimer.ref | configSelectionQueue.length=" + this.configSelectionQueue.length + " pickQueue.length=" + this.pickQueue.length), (G = (B = this.callRefTimer).ref) === null || G === void 0 || G.call(B)
    }
    callRefTimerUnref() {
      var A, Q, B;
      if (!((A = this.callRefTimer) === null || A === void 0 ? void 0 : A.hasRef) || this.callRefTimer.hasRef()) this.trace("callRefTimer.unref | configSelectionQueue.length=" + this.configSelectionQueue.length + " pickQueue.length=" + this.pickQueue.length), (B = (Q = this.callRefTimer) === null || Q === void 0 ? void 0 : Q.unref) === null || B === void 0 || B.call(Q)
    }
    removeConnectivityStateWatcher(A) {
      let Q = this.connectivityStateWatchers.findIndex((B) => B === A);
      if (Q >= 0) this.connectivityStateWatchers.splice(Q, 1)
    }
    updateState(A) {
      if ((0, bX1.trace)(Hs.LogVerbosity.DEBUG, "connectivity_state", "(" + this.channelzRef.id + ") " + (0, fX1.uriToString)(this.target) + " " + t_.ConnectivityState[this.connectivityState] + " -> " + t_.ConnectivityState[A]), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Connectivity state change to " + t_.ConnectivityState[A]);
      this.connectivityState = A, this.channelzInfoTracker.state = A;
      let Q = this.connectivityStateWatchers.slice();
      for (let B of Q)
        if (A !== B.currentState) {
          if (B.timer) clearTimeout(B.timer);
          this.removeConnectivityStateWatcher(B), B.callback()
        } if (A !== t_.ConnectivityState.TRANSIENT_FAILURE) this.currentResolutionError = null
    }
    throttleKeepalive(A) {
      if (A > this.keepaliveTime) {
        this.keepaliveTime = A;
        for (let Q of this.wrappedSubchannels) Q.throttleKeepalive(A)
      }
    }
    addWrappedSubchannel(A) {
      this.wrappedSubchannels.add(A)
    }
    removeWrappedSubchannel(A) {
      this.wrappedSubchannels.delete(A)
    }
    doPick(A, Q) {
      return this.currentPicker.pick({
        metadata: A,
        extraPickInfo: Q
      })
    }
    queueCallForPick(A) {
      this.pickQueue.push(A), this.callRefTimerRef()
    }
    getConfig(A, Q) {
      if (this.connectivityState !== t_.ConnectivityState.SHUTDOWN) this.resolvingLoadBalancer.exitIdle();
      if (this.configSelector) return {
        type: "SUCCESS",
        config: this.configSelector.invoke(A, Q, this.randomChannelId)
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
      if (this.resolvingLoadBalancer.destroy(), this.updateState(t_.ConnectivityState.IDLE), this.currentPicker = new KF0.QueuePicker(this.resolvingLoadBalancer), this.idleTimer) clearTimeout(this.idleTimer), this.idleTimer = null;
      if (this.callRefTimer) clearInterval(this.callRefTimer), this.callRefTimer = null
    }
    startIdleTimeout(A) {
      var Q, B;
      this.idleTimer = setTimeout(() => {
        if (this.callCount > 0) {
          this.startIdleTimeout(this.idleTimeoutMs);
          return
        }
        let Z = new Date().valueOf() - this.lastActivityTimestamp.valueOf();
        if (Z >= this.idleTimeoutMs) this.trace("Idle timer triggered after " + this.idleTimeoutMs + "ms of inactivity"), this.enterIdle();
        else this.startIdleTimeout(this.idleTimeoutMs - Z)
      }, A), (B = (Q = this.idleTimer).unref) === null || B === void 0 || B.call(Q)
    }
    maybeStartIdleTimer() {
      if (this.connectivityState !== t_.ConnectivityState.SHUTDOWN && !this.idleTimer) this.startIdleTimeout(this.idleTimeoutMs)
    }
    onCallStart() {
      if (this.channelzEnabled) this.channelzInfoTracker.callTracker.addCallStarted();
      this.callCount += 1
    }
    onCallEnd(A) {
      if (this.channelzEnabled)
        if (A.code === Hs.Status.OK) this.channelzInfoTracker.callTracker.addCallSucceeded();
        else this.channelzInfoTracker.callTracker.addCallFailed();
      this.callCount -= 1, this.lastActivityTimestamp = new Date, this.maybeStartIdleTimer()
    }
    createLoadBalancingCall(A, Q, B, G, Z) {
      let Y = (0, DF0.getNextCallNumber)();
      return this.trace("createLoadBalancingCall [" + Y + '] method="' + Q + '"'), new kM5.LoadBalancingCall(this, A, Q, B, G, Z, Y)
    }
    createRetryingCall(A, Q, B, G, Z) {
      let Y = (0, DF0.getNextCallNumber)();
      return this.trace("createRetryingCall [" + Y + '] method="' + Q + '"'), new WF0.RetryingCall(this, A, Q, B, G, Z, Y, this.retryBufferTracker, hX1.get(this.getTarget()))
    }
    createResolvingCall(A, Q, B, G, Z) {
      let Y = (0, DF0.getNextCallNumber)();
      this.trace("createResolvingCall [" + Y + '] method="' + A + '", deadline=' + (0, bM5.deadlineToString)(Q));
      let J = {
          deadline: Q,
          flags: Z !== null && Z !== void 0 ? Z : Hs.Propagate.DEFAULTS,
          host: B !== null && B !== void 0 ? B : this.defaultAuthority,
          parentCall: G
        },
        X = new fM5.ResolvingCall(this, A, J, this.filterStackFactory.clone(), Y);
      return this.onCallStart(), X.addStatusWatcher((I) => {
        this.onCallEnd(I)
      }), X
    }
    close() {
      var A;
      this.resolvingLoadBalancer.destroy(), this.updateState(t_.ConnectivityState.SHUTDOWN), this.currentPicker = new N$2;
      for (let Q of this.configSelectionQueue) Q.cancelWithStatus(Hs.Status.UNAVAILABLE, "Channel closed before call started");
      this.configSelectionQueue = [];
      for (let Q of this.pickQueue) Q.cancelWithStatus(Hs.Status.UNAVAILABLE, "Channel closed before call started");
      if (this.pickQueue = [], this.callRefTimer) clearInterval(this.callRefTimer);
      if (this.idleTimer) clearTimeout(this.idleTimer);
      if (this.channelzEnabled)(0, uvA.unregisterChannelzRef)(this.channelzRef);
      this.subchannelPool.unrefUnusedSubchannels(), (A = this.configSelector) === null || A === void 0 || A.unref(), this.configSelector = null
    }
    getTarget() {
      return (0, fX1.uriToString)(this.target)
    }
    getConnectivityState(A) {
      let Q = this.connectivityState;
      if (A) this.resolvingLoadBalancer.exitIdle(), this.lastActivityTimestamp = new Date, this.maybeStartIdleTimer();
      return Q
    }
    watchConnectivityState(A, Q, B) {
      if (this.connectivityState === t_.ConnectivityState.SHUTDOWN) throw Error("Channel has been shut down");
      let G = null;
      if (Q !== 1 / 0) {
        let Y = Q instanceof Date ? Q : new Date(Q),
          J = new Date;
        if (Q === -1 / 0 || Y <= J) {
          process.nextTick(B, Error("Deadline passed without connectivity state change"));
          return
        }
        G = setTimeout(() => {
          this.removeConnectivityStateWatcher(Z), B(Error("Deadline passed without connectivity state change"))
        }, Y.getTime() - J.getTime())
      }
      let Z = {
        currentState: A,
        callback: B,
        timer: G
      };
      this.connectivityStateWatchers.push(Z)
    }
    getChannelzRef() {
      return this.channelzRef
    }
    createCall(A, Q, B, G, Z) {
      if (typeof A !== "string") throw TypeError("Channel#createCall: method must be a string");
      if (!(typeof Q === "number" || Q instanceof Date)) throw TypeError("Channel#createCall: deadline must be a number or Date");
      if (this.connectivityState === t_.ConnectivityState.SHUTDOWN) throw Error("Channel has been shut down");
      return this.createResolvingCall(A, Q, B, G, Z)
    }
    getOptions() {
      return this.options
    }
  }
  O$2.InternalChannel = L$2
})
// @from(Ln 302307, Col 4)
iK0 = U((j$2) => {
  Object.defineProperty(j$2, "__esModule", {
    value: !0
  });
  j$2.ChannelImplementation = void 0;
  var lM5 = FFA(),
    iM5 = VF0();
  class _$2 {
    constructor(A, Q, B) {
      if (typeof A !== "string") throw TypeError("Channel target must be a string");
      if (!(Q instanceof lM5.ChannelCredentials)) throw TypeError("Channel credentials must be a ChannelCredentials object");
      if (B) {
        if (typeof B !== "object") throw TypeError("Channel options must be an object")
      }
      this.internalChannel = new iM5.InternalChannel(A, Q, B)
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
    watchConnectivityState(A, Q, B) {
      this.internalChannel.watchConnectivityState(A, Q, B)
    }
    getChannelzRef() {
      return this.internalChannel.getChannelzRef()
    }
    createCall(A, Q, B, G, Z) {
      if (typeof A !== "string") throw TypeError("Channel#createCall: method must be a string");
      if (!(typeof Q === "number" || Q instanceof Date)) throw TypeError("Channel#createCall: deadline must be a number or Date");
      return this.internalChannel.createCall(A, Q, B, G, Z)
    }
  }
  j$2.ChannelImplementation = _$2
})
// @from(Ln 302346, Col 4)
f$2 = U((k$2) => {
  Object.defineProperty(k$2, "__esModule", {
    value: !0
  });
  k$2.ServerDuplexStreamImpl = k$2.ServerWritableStreamImpl = k$2.ServerReadableStreamImpl = k$2.ServerUnaryCallImpl = void 0;
  k$2.serverErrorToStatus = EF0;
  var nM5 = NA("events"),
    FF0 = NA("stream"),
    HF0 = j8(),
    P$2 = jF();

  function EF0(A, Q) {
    var B;
    let G = {
      code: HF0.Status.UNKNOWN,
      details: "message" in A ? A.message : "Unknown Error",
      metadata: (B = Q !== null && Q !== void 0 ? Q : A.metadata) !== null && B !== void 0 ? B : null
    };
    if ("code" in A && typeof A.code === "number" && Number.isInteger(A.code)) {
      if (G.code = A.code, "details" in A && typeof A.details === "string") G.details = A.details
    }
    return G
  }
  class S$2 extends nM5.EventEmitter {
    constructor(A, Q, B, G) {
      super();
      this.path = A, this.call = Q, this.metadata = B, this.request = G, this.cancelled = !1
    }
    getPeer() {
      return this.call.getPeer()
    }
    sendMetadata(A) {
      this.call.sendMetadata(A)
    }
    getDeadline() {
      return this.call.getDeadline()
    }
    getPath() {
      return this.path
    }
    getHost() {
      return this.call.getHost()
    }
    getAuthContext() {
      return this.call.getAuthContext()
    }
    getMetricsRecorder() {
      return this.call.getMetricsRecorder()
    }
  }
  k$2.ServerUnaryCallImpl = S$2;
  class x$2 extends FF0.Readable {
    constructor(A, Q, B) {
      super({
        objectMode: !0
      });
      this.path = A, this.call = Q, this.metadata = B, this.cancelled = !1
    }
    _read(A) {
      this.call.startRead()
    }
    getPeer() {
      return this.call.getPeer()
    }
    sendMetadata(A) {
      this.call.sendMetadata(A)
    }
    getDeadline() {
      return this.call.getDeadline()
    }
    getPath() {
      return this.path
    }
    getHost() {
      return this.call.getHost()
    }
    getAuthContext() {
      return this.call.getAuthContext()
    }
    getMetricsRecorder() {
      return this.call.getMetricsRecorder()
    }
  }
  k$2.ServerReadableStreamImpl = x$2;
  class y$2 extends FF0.Writable {
    constructor(A, Q, B, G) {
      super({
        objectMode: !0
      });
      this.path = A, this.call = Q, this.metadata = B, this.request = G, this.pendingStatus = {
        code: HF0.Status.OK,
        details: "OK"
      }, this.cancelled = !1, this.trailingMetadata = new P$2.Metadata, this.on("error", (Z) => {
        this.pendingStatus = EF0(Z), this.end()
      })
    }
    getPeer() {
      return this.call.getPeer()
    }
    sendMetadata(A) {
      this.call.sendMetadata(A)
    }
    getDeadline() {
      return this.call.getDeadline()
    }
    getPath() {
      return this.path
    }
    getHost() {
      return this.call.getHost()
    }
    getAuthContext() {
      return this.call.getAuthContext()
    }
    getMetricsRecorder() {
      return this.call.getMetricsRecorder()
    }
    _write(A, Q, B) {
      this.call.sendMessage(A, B)
    }
    _final(A) {
      var Q;
      A(null), this.call.sendStatus(Object.assign(Object.assign({}, this.pendingStatus), {
        metadata: (Q = this.pendingStatus.metadata) !== null && Q !== void 0 ? Q : this.trailingMetadata
      }))
    }
    end(A) {
      if (A) this.trailingMetadata = A;
      return super.end()
    }
  }
  k$2.ServerWritableStreamImpl = y$2;
  class v$2 extends FF0.Duplex {
    constructor(A, Q, B) {
      super({
        objectMode: !0
      });
      this.path = A, this.call = Q, this.metadata = B, this.pendingStatus = {
        code: HF0.Status.OK,
        details: "OK"
      }, this.cancelled = !1, this.trailingMetadata = new P$2.Metadata, this.on("error", (G) => {
        this.pendingStatus = EF0(G), this.end()
      })
    }
    getPeer() {
      return this.call.getPeer()
    }
    sendMetadata(A) {
      this.call.sendMetadata(A)
    }
    getDeadline() {
      return this.call.getDeadline()
    }
    getPath() {
      return this.path
    }
    getHost() {
      return this.call.getHost()
    }
    getAuthContext() {
      return this.call.getAuthContext()
    }
    getMetricsRecorder() {
      return this.call.getMetricsRecorder()
    }
    _read(A) {
      this.call.startRead()
    }
    _write(A, Q, B) {
      this.call.sendMessage(A, B)
    }
    _final(A) {
      var Q;
      A(null), this.call.sendStatus(Object.assign(Object.assign({}, this.pendingStatus), {
        metadata: (Q = this.pendingStatus.metadata) !== null && Q !== void 0 ? Q : this.trailingMetadata
      }))
    }
    end(A) {
      if (A) this.trailingMetadata = A;
      return super.end()
    }
  }
  k$2.ServerDuplexStreamImpl = v$2
})
// @from(Ln 302530, Col 4)
gX1 = U((h$2) => {
  Object.defineProperty(h$2, "__esModule", {
    value: !0
  });
  h$2.ServerCredentials = void 0;
  h$2.createCertificateProviderServerCredentials = tM5;
  h$2.createServerCredentialsWithInterceptors = eM5;
  var zF0 = SK0();
  class yFA {
    constructor(A, Q) {
      this.serverConstructorOptions = A, this.watchers = new Set, this.latestContextOptions = null, this.latestContextOptions = Q !== null && Q !== void 0 ? Q : null
    }
    _addWatcher(A) {
      this.watchers.add(A)
    }
    _removeWatcher(A) {
      this.watchers.delete(A)
    }
    getWatcherCount() {
      return this.watchers.size
    }
    updateSecureContextOptions(A) {
      this.latestContextOptions = A;
      for (let Q of this.watchers) Q(this.latestContextOptions)
    }
    _isSecure() {
      return this.serverConstructorOptions !== null
    }
    _getSecureContextOptions() {
      return this.latestContextOptions
    }
    _getConstructorOptions() {
      return this.serverConstructorOptions
    }
    _getInterceptors() {
      return []
    }
    static createInsecure() {
      return new $F0
    }
    static createSsl(A, Q, B = !1) {
      var G;
      if (A !== null && !Buffer.isBuffer(A)) throw TypeError("rootCerts must be null or a Buffer");
      if (!Array.isArray(Q)) throw TypeError("keyCertPairs must be an array");
      if (typeof B !== "boolean") throw TypeError("checkClientCertificate must be a boolean");
      let Z = [],
        Y = [];
      for (let J = 0; J < Q.length; J++) {
        let X = Q[J];
        if (X === null || typeof X !== "object") throw TypeError(`keyCertPair[${J}] must be an object`);
        if (!Buffer.isBuffer(X.private_key)) throw TypeError(`keyCertPair[${J}].private_key must be a Buffer`);
        if (!Buffer.isBuffer(X.cert_chain)) throw TypeError(`keyCertPair[${J}].cert_chain must be a Buffer`);
        Z.push(X.cert_chain), Y.push(X.private_key)
      }
      return new CF0({
        requestCert: B,
        ciphers: zF0.CIPHER_SUITES
      }, {
        ca: (G = A !== null && A !== void 0 ? A : (0, zF0.getDefaultRootsData)()) !== null && G !== void 0 ? G : void 0,
        cert: Z,
        key: Y
      })
    }
  }
  h$2.ServerCredentials = yFA;
  class $F0 extends yFA {
    constructor() {
      super(null)
    }
    _getSettings() {
      return null
    }
    _equals(A) {
      return A instanceof $F0
    }
  }
  class CF0 extends yFA {
    constructor(A, Q) {
      super(A, Q);
      this.options = Object.assign(Object.assign({}, A), Q)
    }
    _equals(A) {
      if (this === A) return !0;
      if (!(A instanceof CF0)) return !1;
      if (Buffer.isBuffer(this.options.ca) && Buffer.isBuffer(A.options.ca)) {
        if (!this.options.ca.equals(A.options.ca)) return !1
      } else if (this.options.ca !== A.options.ca) return !1;
      if (Array.isArray(this.options.cert) && Array.isArray(A.options.cert)) {
        if (this.options.cert.length !== A.options.cert.length) return !1;
        for (let Q = 0; Q < this.options.cert.length; Q++) {
          let B = this.options.cert[Q],
            G = A.options.cert[Q];
          if (Buffer.isBuffer(B) && Buffer.isBuffer(G)) {
            if (!B.equals(G)) return !1
          } else if (B !== G) return !1
        }
      } else if (this.options.cert !== A.options.cert) return !1;
      if (Array.isArray(this.options.key) && Array.isArray(A.options.key)) {
        if (this.options.key.length !== A.options.key.length) return !1;
        for (let Q = 0; Q < this.options.key.length; Q++) {
          let B = this.options.key[Q],
            G = A.options.key[Q];
          if (Buffer.isBuffer(B) && Buffer.isBuffer(G)) {
            if (!B.equals(G)) return !1
          } else if (B !== G) return !1
        }
      } else if (this.options.key !== A.options.key) return !1;
      if (this.options.requestCert !== A.options.requestCert) return !1;
      return !0
    }
  }
  class UF0 extends yFA {
    constructor(A, Q, B) {
      super({
        requestCert: Q !== null,
        rejectUnauthorized: B,
        ciphers: zF0.CIPHER_SUITES
      });
      this.identityCertificateProvider = A, this.caCertificateProvider = Q, this.requireClientCertificate = B, this.latestCaUpdate = null, this.latestIdentityUpdate = null, this.caCertificateUpdateListener = this.handleCaCertificateUpdate.bind(this), this.identityCertificateUpdateListener = this.handleIdentityCertitificateUpdate.bind(this)
    }
    _addWatcher(A) {
      var Q;
      if (this.getWatcherCount() === 0)(Q = this.caCertificateProvider) === null || Q === void 0 || Q.addCaCertificateListener(this.caCertificateUpdateListener), this.identityCertificateProvider.addIdentityCertificateListener(this.identityCertificateUpdateListener);
      super._addWatcher(A)
    }
    _removeWatcher(A) {
      var Q;
      if (super._removeWatcher(A), this.getWatcherCount() === 0)(Q = this.caCertificateProvider) === null || Q === void 0 || Q.removeCaCertificateListener(this.caCertificateUpdateListener), this.identityCertificateProvider.removeIdentityCertificateListener(this.identityCertificateUpdateListener)
    }
    _equals(A) {
      if (this === A) return !0;
      if (!(A instanceof UF0)) return !1;
      return this.caCertificateProvider === A.caCertificateProvider && this.identityCertificateProvider === A.identityCertificateProvider && this.requireClientCertificate === A.requireClientCertificate
    }
    calculateSecureContextOptions() {
      var A;
      if (this.latestIdentityUpdate === null) return null;
      if (this.caCertificateProvider !== null && this.latestCaUpdate === null) return null;
      return {
        ca: (A = this.latestCaUpdate) === null || A === void 0 ? void 0 : A.caCertificate,
        cert: [this.latestIdentityUpdate.certificate],
        key: [this.latestIdentityUpdate.privateKey]
      }
    }
    finalizeUpdate() {
      let A = this.calculateSecureContextOptions();
      this.updateSecureContextOptions(A)
    }
    handleCaCertificateUpdate(A) {
      this.latestCaUpdate = A, this.finalizeUpdate()
    }
    handleIdentityCertitificateUpdate(A) {
      this.latestIdentityUpdate = A, this.finalizeUpdate()
    }
  }

  function tM5(A, Q, B) {
    return new UF0(A, Q, B)
  }
  class qF0 extends yFA {
    constructor(A, Q) {
      super({});
      this.childCredentials = A, this.interceptors = Q
    }
    _isSecure() {
      return this.childCredentials._isSecure()
    }
    _equals(A) {
      if (!(A instanceof qF0)) return !1;
      if (!this.childCredentials._equals(A.childCredentials)) return !1;
      if (this.interceptors.length !== A.interceptors.length) return !1;
      for (let Q = 0; Q < this.interceptors.length; Q++)
        if (this.interceptors[Q] !== A.interceptors[Q]) return !1;
      return !0
    }
    _getInterceptors() {
      return this.interceptors
    }
    _addWatcher(A) {
      this.childCredentials._addWatcher(A)
    }
    _removeWatcher(A) {
      this.childCredentials._removeWatcher(A)
    }
    _getConstructorOptions() {
      return this.childCredentials._getConstructorOptions()
    }
    _getSecureContextOptions() {
      return this.childCredentials._getSecureContextOptions()
    }
  }

  function eM5(A, Q) {
    return new qF0(A, Q)
  }
})
// @from(Ln 302726, Col 4)
mvA = U((u$2) => {
  Object.defineProperty(u$2, "__esModule", {
    value: !0
  });
  u$2.durationMessageToDuration = BR5;
  u$2.msToDuration = GR5;
  u$2.durationToMs = ZR5;
  u$2.isDuration = YR5;
  u$2.isDurationMessage = JR5;
  u$2.parseDuration = IR5;
  u$2.durationToString = DR5;

  function BR5(A) {
    return {
      seconds: Number.parseInt(A.seconds),
      nanos: A.nanos
    }
  }

  function GR5(A) {
    return {
      seconds: A / 1000 | 0,
      nanos: A % 1000 * 1e6 | 0
    }
  }

  function ZR5(A) {
    return A.seconds * 1000 + A.nanos / 1e6 | 0
  }

  function YR5(A) {
    return typeof A.seconds === "number" && typeof A.nanos === "number"
  }

  function JR5(A) {
    return typeof A.seconds === "string" && typeof A.nanos === "number"
  }
  var XR5 = /^(\d+)(?:\.(\d+))?s$/;

  function IR5(A) {
    let Q = A.match(XR5);
    if (!Q) return null;
    return {
      seconds: Number.parseInt(Q[1], 10),
      nanos: Q[2] ? Number.parseInt(Q[2].padEnd(9, "0"), 10) : 0
    }
  }

  function DR5(A) {
    if (A.nanos === 0) return `${A.seconds}s`;
    let Q;
    if (A.nanos % 1e6 === 0) Q = 1e6;
    else if (A.nanos % 1000 === 0) Q = 1000;
    else Q = 1;
    return `${A.seconds}.${A.nanos/Q}s`
  }
})
// @from(Ln 302783, Col 4)
mX1 = U((s$2) => {
  var __dirname = "/home/runner/code/tmp/claude-cli-external-build-2099/node_modules/@grpc/grpc-js/build/src";
  Object.defineProperty(s$2, "__esModule", {
    value: !0
  });
  s$2.OrcaOobMetricsSubchannelWrapper = s$2.GRPC_METRICS_HEADER = s$2.ServerMetricRecorder = s$2.PerRequestMetricRecorder = void 0;
  s$2.createOrcaClient = i$2;
  s$2.createMetricsReader = LR5;
  var $R5 = oJ1(),
    NF0 = mvA(),
    CR5 = FFA(),
    UR5 = gvA(),
    m$2 = j8(),
    qR5 = HFA(),
    NR5 = XU(),
    d$2 = null;

  function uX1() {
    if (d$2) return d$2;
    let A = hV0().loadSync,
      Q = A("xds/service/orca/v3/orca.proto", {
        keepCase: !0,
        longs: String,
        enums: String,
        defaults: !0,
        oneofs: !0,
        includeDirs: [`${__dirname}/../../proto/xds`, `${__dirname}/../../proto/protoc-gen-validate`]
      });
    return (0, $R5.loadPackageDefinition)(Q)
  }
  class p$2 {
    constructor() {
      this.message = {}
    }
    recordRequestCostMetric(A, Q) {
      if (!this.message.request_cost) this.message.request_cost = {};
      this.message.request_cost[A] = Q
    }
    recordUtilizationMetric(A, Q) {
      if (!this.message.utilization) this.message.utilization = {};
      this.message.utilization[A] = Q
    }
    recordNamedMetric(A, Q) {
      if (!this.message.named_metrics) this.message.named_metrics = {};
      this.message.named_metrics[A] = Q
    }
    recordCPUUtilizationMetric(A) {
      this.message.cpu_utilization = A
    }
    recordMemoryUtilizationMetric(A) {
      this.message.mem_utilization = A
    }
    recordApplicationUtilizationMetric(A) {
      this.message.application_utilization = A
    }
    recordQpsMetric(A) {
      this.message.rps_fractional = A
    }
    recordEpsMetric(A) {
      this.message.eps = A
    }
    serialize() {
      return uX1().xds.data.orca.v3.OrcaLoadReport.serialize(this.message)
    }
  }
  s$2.PerRequestMetricRecorder = p$2;
  var wR5 = 30000;
  class l$2 {
    constructor() {
      this.message = {}, this.serviceImplementation = {
        StreamCoreMetrics: (A) => {
          let Q = A.request.report_interval ? (0, NF0.durationToMs)((0, NF0.durationMessageToDuration)(A.request.report_interval)) : wR5,
            B = setInterval(() => {
              A.write(this.message)
            }, Q);
          A.on("cancelled", () => {
            clearInterval(B)
          })
        }
      }
    }
    putUtilizationMetric(A, Q) {
      if (!this.message.utilization) this.message.utilization = {};
      this.message.utilization[A] = Q
    }
    setAllUtilizationMetrics(A) {
      this.message.utilization = Object.assign({}, A)
    }
    deleteUtilizationMetric(A) {
      var Q;
      (Q = this.message.utilization) === null || Q === void 0 || delete Q[A]
    }
    setCpuUtilizationMetric(A) {
      this.message.cpu_utilization = A
    }
    deleteCpuUtilizationMetric() {
      delete this.message.cpu_utilization
    }
    setApplicationUtilizationMetric(A) {
      this.message.application_utilization = A
    }
    deleteApplicationUtilizationMetric() {
      delete this.message.application_utilization
    }
    setQpsMetric(A) {
      this.message.rps_fractional = A
    }
    deleteQpsMetric() {
      delete this.message.rps_fractional
    }
    setEpsMetric(A) {
      this.message.eps = A
    }
    deleteEpsMetric() {
      delete this.message.eps
    }
    addToServer(A) {
      let Q = uX1().xds.service.orca.v3.OpenRcaService.service;
      A.addService(Q, this.serviceImplementation)
    }
  }
  s$2.ServerMetricRecorder = l$2;

  function i$2(A) {
    return new(uX1()).xds.service.orca.v3.OpenRcaService("unused", CR5.ChannelCredentials.createInsecure(), {
      channelOverride: A
    })
  }
  s$2.GRPC_METRICS_HEADER = "endpoint-load-metrics-bin";
  var c$2 = "grpc_orca_load_report";

  function LR5(A, Q) {
    return (B, G, Z) => {
      let Y = Z.getOpaque(c$2);
      if (Y) A(Y);
      else {
        let J = Z.get(s$2.GRPC_METRICS_HEADER);
        if (J.length > 0) Y = uX1().xds.data.orca.v3.OrcaLoadReport.deserialize(J[0]), A(Y), Z.setOpaque(c$2, Y)
      }
      if (Q) Q(B, G, Z)
    }
  }
  var n$2 = "orca_oob_metrics";
  class a$2 {
    constructor(A, Q) {
      this.metricsListener = A, this.intervalMs = Q, this.dataProducer = null
    }
    setSubchannel(A) {
      let Q = A.getOrCreateDataProducer(n$2, OR5);
      this.dataProducer = Q, Q.addDataWatcher(this)
    }
    destroy() {
      var A;
      (A = this.dataProducer) === null || A === void 0 || A.removeDataWatcher(this)
    }
    getInterval() {
      return this.intervalMs
    }
    onMetricsUpdate(A) {
      this.metricsListener(A)
    }
  }
  class o$2 {
    constructor(A) {
      this.subchannel = A, this.dataWatchers = new Set, this.orcaSupported = !0, this.metricsCall = null, this.currentInterval = 1 / 0, this.backoffTimer = new qR5.BackoffTimeout(() => this.updateMetricsSubscription()), this.subchannelStateListener = () => this.updateMetricsSubscription();
      let Q = A.getChannel();
      this.client = i$2(Q), A.addConnectivityStateListener(this.subchannelStateListener)
    }
    addDataWatcher(A) {
      this.dataWatchers.add(A), this.updateMetricsSubscription()
    }
    removeDataWatcher(A) {
      var Q;
      if (this.dataWatchers.delete(A), this.dataWatchers.size === 0) this.subchannel.removeDataProducer(n$2), (Q = this.metricsCall) === null || Q === void 0 || Q.cancel(), this.metricsCall = null, this.client.close(), this.subchannel.removeConnectivityStateListener(this.subchannelStateListener);
      else this.updateMetricsSubscription()
    }
    updateMetricsSubscription() {
      var A;
      if (this.dataWatchers.size === 0 || !this.orcaSupported || this.subchannel.getConnectivityState() !== NR5.ConnectivityState.READY) return;
      let Q = Math.min(...Array.from(this.dataWatchers).map((B) => B.getInterval()));
      if (!this.metricsCall || Q !== this.currentInterval) {
        (A = this.metricsCall) === null || A === void 0 || A.cancel(), this.currentInterval = Q;
        let B = this.client.streamCoreMetrics({
          report_interval: (0, NF0.msToDuration)(Q)
        });
        this.metricsCall = B, B.on("data", (G) => {
          this.dataWatchers.forEach((Z) => {
            Z.onMetricsUpdate(G)
          })
        }), B.on("error", (G) => {
          if (this.metricsCall = null, G.code === m$2.Status.UNIMPLEMENTED) {
            this.orcaSupported = !1;
            return
          }
          if (G.code === m$2.Status.CANCELLED) return;
          this.backoffTimer.runOnce()
        })
      }
    }
  }
  class r$2 extends UR5.BaseSubchannelWrapper {
    constructor(A, Q, B) {
      super(A);
      this.addDataWatcher(new a$2(Q, B))
    }
    getWrappedSubchannel() {
      return this.child
    }
  }
  s$2.OrcaOobMetricsSubchannelWrapper = r$2;

  function OR5(A) {
    return new o$2(A)
  }
})