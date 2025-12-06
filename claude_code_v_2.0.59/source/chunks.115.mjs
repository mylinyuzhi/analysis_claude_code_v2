
// @from(Start 10901281, End 10916529)
mU2 = z((gU2) => {
  Object.defineProperty(gU2, "__esModule", {
    value: !0
  });
  gU2.Http2SubchannelConnector = void 0;
  var Z0A = UA("http2"),
    Gj5 = UA("tls"),
    U81 = ti(),
    pOA = E6(),
    Zj5 = k90(),
    $JA = zZ(),
    Ij5 = CP(),
    $81 = eU(),
    v90 = uE(),
    Yj5 = UA("net"),
    Jj5 = bU2(),
    Wj5 = K81(),
    b90 = "transport",
    Xj5 = "transport_flowctrl",
    Vj5 = rB0().version,
    {
      HTTP2_HEADER_AUTHORITY: Fj5,
      HTTP2_HEADER_CONTENT_TYPE: Kj5,
      HTTP2_HEADER_METHOD: Dj5,
      HTTP2_HEADER_PATH: Hj5,
      HTTP2_HEADER_TE: Cj5,
      HTTP2_HEADER_USER_AGENT: Ej5
    } = Z0A.constants,
    zj5 = 20000,
    Uj5 = Buffer.from("too_many_pings", "ascii");
  class fU2 {
    constructor(A, Q, B, G) {
      if (this.session = A, this.options = B, this.remoteName = G, this.keepaliveTimer = null, this.pendingSendKeepalivePing = !1, this.activeCalls = new Set, this.disconnectListeners = [], this.disconnectHandled = !1, this.channelzEnabled = !0, this.keepalivesSent = 0, this.messagesSent = 0, this.messagesReceived = 0, this.lastMessageSentTimestamp = null, this.lastMessageReceivedTimestamp = null, this.subchannelAddressString = (0, $81.subchannelAddressToString)(Q), B["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.streamTracker = new U81.ChannelzCallTrackerStub;
      else this.streamTracker = new U81.ChannelzCallTracker;
      if (this.channelzRef = (0, U81.registerChannelzSocket)(this.subchannelAddressString, () => this.getChannelzInfo(), this.channelzEnabled), this.userAgent = [B["grpc.primary_user_agent"], `grpc-node-js/${Vj5}`, B["grpc.secondary_user_agent"]].filter((Z) => Z).join(" "), "grpc.keepalive_time_ms" in B) this.keepaliveTimeMs = B["grpc.keepalive_time_ms"];
      else this.keepaliveTimeMs = -1;
      if ("grpc.keepalive_timeout_ms" in B) this.keepaliveTimeoutMs = B["grpc.keepalive_timeout_ms"];
      else this.keepaliveTimeoutMs = zj5;
      if ("grpc.keepalive_permit_without_calls" in B) this.keepaliveWithoutCalls = B["grpc.keepalive_permit_without_calls"] === 1;
      else this.keepaliveWithoutCalls = !1;
      if (A.once("close", () => {
          this.trace("session closed"), this.handleDisconnect()
        }), A.once("goaway", (Z, I, Y) => {
          let J = !1;
          if (Z === Z0A.constants.NGHTTP2_ENHANCE_YOUR_CALM && Y && Y.equals(Uj5)) J = !0;
          this.trace("connection closed by GOAWAY with code " + Z + " and data " + (Y === null || Y === void 0 ? void 0 : Y.toString())), this.reportDisconnectToOwner(J)
        }), A.once("error", (Z) => {
          this.trace("connection closed with error " + Z.message), this.handleDisconnect()
        }), A.socket.once("close", (Z) => {
          this.trace("connection closed. hadError=" + Z), this.handleDisconnect()
        }), $JA.isTracerEnabled(b90)) A.on("remoteSettings", (Z) => {
        this.trace("new settings received" + (this.session !== A ? " on the old connection" : "") + ": " + JSON.stringify(Z))
      }), A.on("localSettings", (Z) => {
        this.trace("local settings acknowledged by remote" + (this.session !== A ? " on the old connection" : "") + ": " + JSON.stringify(Z))
      });
      if (this.keepaliveWithoutCalls) this.maybeStartKeepalivePingTimer();
      if (A.socket instanceof Gj5.TLSSocket) this.authContext = {
        transportSecurityType: "ssl",
        sslPeerCertificate: A.socket.getPeerCertificate()
      };
      else this.authContext = {}
    }
    getChannelzInfo() {
      var A, Q, B;
      let G = this.session.socket,
        Z = G.remoteAddress ? (0, $81.stringToSubchannelAddress)(G.remoteAddress, G.remotePort) : null,
        I = G.localAddress ? (0, $81.stringToSubchannelAddress)(G.localAddress, G.localPort) : null,
        Y;
      if (this.session.encrypted) {
        let W = G,
          X = W.getCipher(),
          V = W.getCertificate(),
          F = W.getPeerCertificate();
        Y = {
          cipherSuiteStandardName: (A = X.standardName) !== null && A !== void 0 ? A : null,
          cipherSuiteOtherName: X.standardName ? null : X.name,
          localCertificate: V && "raw" in V ? V.raw : null,
          remoteCertificate: F && "raw" in F ? F.raw : null
        }
      } else Y = null;
      return {
        remoteAddress: Z,
        localAddress: I,
        security: Y,
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
      $JA.trace(pOA.LogVerbosity.DEBUG, b90, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    keepaliveTrace(A) {
      $JA.trace(pOA.LogVerbosity.DEBUG, "keepalive", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    flowControlTrace(A) {
      $JA.trace(pOA.LogVerbosity.DEBUG, Xj5, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    internalsTrace(A) {
      $JA.trace(pOA.LogVerbosity.DEBUG, "transport_internals", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
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
        if (!this.session.ping((Z, I, Y) => {
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
      let I = A.toHttp2Headers();
      I[Fj5] = Q, I[Ej5] = this.userAgent, I[Kj5] = "application/grpc", I[Dj5] = "POST", I[Hj5] = B, I[Cj5] = "trailers";
      let Y;
      try {
        Y = this.session.request(I)
      } catch (X) {
        throw this.handleDisconnect(), X
      }
      this.flowControlTrace("local window size: " + this.session.state.localWindowSize + " remote window size: " + this.session.state.remoteWindowSize), this.internalsTrace("session.closed=" + this.session.closed + " session.destroyed=" + this.session.destroyed + " session.socket.destroyed=" + this.session.socket.destroyed);
      let J, W;
      if (this.channelzEnabled) this.streamTracker.addCallStarted(), J = {
        addMessageSent: () => {
          var X;
          this.messagesSent += 1, this.lastMessageSentTimestamp = new Date, (X = Z.addMessageSent) === null || X === void 0 || X.call(Z)
        },
        addMessageReceived: () => {
          var X;
          this.messagesReceived += 1, this.lastMessageReceivedTimestamp = new Date, (X = Z.addMessageReceived) === null || X === void 0 || X.call(Z)
        },
        onCallEnd: (X) => {
          var V;
          (V = Z.onCallEnd) === null || V === void 0 || V.call(Z, X), this.removeActiveCall(W)
        },
        onStreamEnd: (X) => {
          var V;
          if (X) this.streamTracker.addCallSucceeded();
          else this.streamTracker.addCallFailed();
          (V = Z.onStreamEnd) === null || V === void 0 || V.call(Z, X)
        }
      };
      else J = {
        addMessageSent: () => {
          var X;
          (X = Z.addMessageSent) === null || X === void 0 || X.call(Z)
        },
        addMessageReceived: () => {
          var X;
          (X = Z.addMessageReceived) === null || X === void 0 || X.call(Z)
        },
        onCallEnd: (X) => {
          var V;
          (V = Z.onCallEnd) === null || V === void 0 || V.call(Z, X), this.removeActiveCall(W)
        },
        onStreamEnd: (X) => {
          var V;
          (V = Z.onStreamEnd) === null || V === void 0 || V.call(Z, X)
        }
      };
      return W = new Jj5.Http2SubchannelCall(Y, J, G, this, (0, Wj5.getNextCallNumber)()), this.addActiveCall(W), W
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
      this.session.close(), (0, U81.unregisterChannelzRef)(this.channelzRef)
    }
  }
  class hU2 {
    constructor(A) {
      this.channelTarget = A, this.session = null, this.isShutdown = !1
    }
    trace(A) {
      $JA.trace(pOA.LogVerbosity.DEBUG, b90, (0, v90.uriToString)(this.channelTarget) + " " + A)
    }
    createSession(A, Q, B) {
      if (this.isShutdown) return Promise.reject();
      if (A.socket.closed) return Promise.reject("Connection closed before starting HTTP/2 handshake");
      return new Promise((G, Z) => {
        var I, Y, J, W, X, V, F;
        let K = null,
          D = this.channelTarget;
        if ("grpc.http_connect_target" in B) {
          let v = (0, v90.parseUri)(B["grpc.http_connect_target"]);
          if (v) D = v, K = (0, v90.uriToString)(v)
        }
        let H = A.secure ? "https" : "http",
          C = (0, Ij5.getDefaultAuthority)(D),
          E = () => {
            var v;
            (v = this.session) === null || v === void 0 || v.destroy(), this.session = null, setImmediate(() => {
              if (!y) y = !0, Z(`${T.trim()} (${new Date().toISOString()})`)
            })
          },
          U = (v) => {
            var x;
            if ((x = this.session) === null || x === void 0 || x.destroy(), T = v.message, this.trace("connection failed with error " + T), !y) y = !0, Z(`${T} (${new Date().toISOString()})`)
          },
          q = {
            createConnection: (v, x) => {
              return A.socket
            },
            settings: {
              initialWindowSize: (W = (I = B["grpc-node.flow_control_window"]) !== null && I !== void 0 ? I : (J = (Y = Z0A.getDefaultSettings) === null || Y === void 0 ? void 0 : Y.call(Z0A)) === null || J === void 0 ? void 0 : J.initialWindowSize) !== null && W !== void 0 ? W : 65535
            }
          },
          w = Z0A.connect(`${H}://${C}`, q),
          N = (F = (V = (X = Z0A.getDefaultSettings) === null || X === void 0 ? void 0 : X.call(Z0A)) === null || V === void 0 ? void 0 : V.initialWindowSize) !== null && F !== void 0 ? F : 65535,
          R = B["grpc-node.flow_control_window"];
        this.session = w;
        let T = "Failed to connect",
          y = !1;
        w.unref(), w.once("remoteSettings", () => {
          var v;
          if (R && R > N) try {
            w.setLocalWindowSize(R)
          } catch (x) {
            let p = R - ((v = w.state.localWindowSize) !== null && v !== void 0 ? v : N);
            if (p > 0) w.incrementWindowSize(p)
          }
          w.removeAllListeners(), A.socket.removeListener("close", E), A.socket.removeListener("error", U), G(new fU2(w, Q, B, K)), this.session = null
        }), w.once("close", E), w.once("error", U), A.socket.once("close", E), A.socket.once("error", U)
      })
    }
    tcpConnect(A, Q) {
      return (0, Zj5.getProxiedConnection)(A, Q).then((B) => {
        if (B) return B;
        else return new Promise((G, Z) => {
          let I = () => {
              Z(Error("Socket closed"))
            },
            Y = (W) => {
              Z(W)
            },
            J = Yj5.connect(A, () => {
              J.removeListener("close", I), J.removeListener("error", Y), G(J)
            });
          J.once("close", I), J.once("error", Y)
        })
      })
    }
    async connect(A, Q, B) {
      if (this.isShutdown) return Promise.reject();
      let G = null,
        Z = null,
        I = (0, $81.subchannelAddressToString)(A);
      try {
        return this.trace(I + " Waiting for secureConnector to be ready"), await Q.waitForReady(), this.trace(I + " secureConnector is ready"), G = await this.tcpConnect(A, B), G.setNoDelay(), this.trace(I + " Established TCP connection"), Z = await Q.connect(G), this.trace(I + " Established secure connection"), this.createSession(Z, A, B)
      } catch (Y) {
        throw G === null || G === void 0 || G.destroy(), Z === null || Z === void 0 || Z.socket.destroy(), Y
      }
    }
    shutdown() {
      var A;
      this.isShutdown = !0, (A = this.session) === null || A === void 0 || A.close(), this.session = null
    }
  }
  gU2.Http2SubchannelConnector = hU2
})
// @from(Start 10916535, End 10918283)
pU2 = z((dU2) => {
  Object.defineProperty(dU2, "__esModule", {
    value: !0
  });
  dU2.SubchannelPool = void 0;
  dU2.getSubchannelPool = Rj5;
  var $j5 = pH2(),
    wj5 = EU2(),
    qj5 = eU(),
    Nj5 = uE(),
    Lj5 = mU2(),
    Mj5 = 1e4;
  class w81 {
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
      }, Mj5), (Q = (A = this.cleanupTimer).unref) === null || Q === void 0 || Q.call(A)
    }
    getOrCreateSubchannel(A, Q, B, G) {
      this.ensureCleanupTask();
      let Z = (0, Nj5.uriToString)(A);
      if (Z in this.pool) {
        let Y = this.pool[Z];
        for (let J of Y)
          if ((0, qj5.subchannelAddressEqual)(Q, J.subchannelAddress) && (0, $j5.channelOptionsEqual)(B, J.channelArguments) && G._equals(J.channelCredentials)) return J.subchannel
      }
      let I = new wj5.Subchannel(A, Q, B, G, new Lj5.Http2SubchannelConnector(A));
      if (!(Z in this.pool)) this.pool[Z] = [];
      return this.pool[Z].push({
        subchannelAddress: Q,
        channelArguments: B,
        channelCredentials: G,
        subchannel: I
      }), I.ref(), I
    }
  }
  dU2.SubchannelPool = w81;
  var Oj5 = new w81;

  function Rj5(A) {
    if (A) return Oj5;
    else return new w81
  }
})
// @from(Start 10918289, End 10926754)
rU2 = z((aU2) => {
  Object.defineProperty(aU2, "__esModule", {
    value: !0
  });
  aU2.LoadBalancingCall = void 0;
  var lU2 = mE(),
    q81 = E6(),
    iU2 = CJA(),
    N81 = YK(),
    lOA = Ph(),
    Pj5 = uE(),
    jj5 = zZ(),
    f90 = gOA(),
    Sj5 = UA("http2"),
    _j5 = "load_balancing_call";
  class nU2 {
    constructor(A, Q, B, G, Z, I, Y) {
      var J, W;
      this.channel = A, this.callConfig = Q, this.methodName = B, this.host = G, this.credentials = Z, this.deadline = I, this.callNumber = Y, this.child = null, this.readPending = !1, this.pendingMessage = null, this.pendingHalfClose = !1, this.ended = !1, this.metadata = null, this.listener = null, this.onCallEnded = null, this.childStartTime = null;
      let X = this.methodName.split("/"),
        V = "";
      if (X.length >= 2) V = X[1];
      let F = (W = (J = (0, Pj5.splitHostPort)(this.host)) === null || J === void 0 ? void 0 : J.host) !== null && W !== void 0 ? W : "localhost";
      this.serviceUrl = `https://${F}/${V}`, this.startTime = new Date
    }
    getDeadlineInfo() {
      var A, Q;
      let B = [];
      if (this.childStartTime) {
        if (this.childStartTime > this.startTime) {
          if ((A = this.metadata) === null || A === void 0 ? void 0 : A.getOptions().waitForReady) B.push("wait_for_ready");
          B.push(`LB pick: ${(0,iU2.formatDateDifference)(this.startTime,this.childStartTime)}`)
        }
        return B.push(...this.child.getDeadlineInfo()), B
      } else {
        if ((Q = this.metadata) === null || Q === void 0 ? void 0 : Q.getOptions().waitForReady) B.push("wait_for_ready");
        B.push("Waiting for LB pick")
      }
      return B
    }
    trace(A) {
      jj5.trace(q81.LogVerbosity.DEBUG, _j5, "[" + this.callNumber + "] " + A)
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
      switch (this.trace("Pick result: " + lOA.PickResultType[G.pickResultType] + " subchannel: " + Z + " status: " + ((A = G.status) === null || A === void 0 ? void 0 : A.code) + " " + ((Q = G.status) === null || Q === void 0 ? void 0 : Q.details)), G.pickResultType) {
        case lOA.PickResultType.COMPLETE:
          this.credentials.compose(G.subchannel.getCallCredentials()).generateMetadata({
            method_name: this.methodName,
            service_url: this.serviceUrl
          }).then((W) => {
            var X;
            if (this.ended) {
              this.trace("Credentials metadata generation finished after call ended");
              return
            }
            if (B.merge(W), B.get("authorization").length > 1) this.outputStatus({
              code: q81.Status.INTERNAL,
              details: '"authorization" metadata cannot have multiple values',
              metadata: new N81.Metadata
            }, "PROCESSED");
            if (G.subchannel.getConnectivityState() !== lU2.ConnectivityState.READY) {
              this.trace("Picked subchannel " + Z + " has state " + lU2.ConnectivityState[G.subchannel.getConnectivityState()] + " after getting credentials metadata. Retrying pick"), this.doPick();
              return
            }
            if (this.deadline !== 1 / 0) B.set("grpc-timeout", (0, iU2.getDeadlineTimeoutString)(this.deadline));
            try {
              this.child = G.subchannel.getRealSubchannel().createCall(B, this.host, this.methodName, {
                onReceiveMetadata: (V) => {
                  this.trace("Received metadata"), this.listener.onReceiveMetadata(V)
                },
                onReceiveMessage: (V) => {
                  this.trace("Received message"), this.listener.onReceiveMessage(V)
                },
                onReceiveStatus: (V) => {
                  if (this.trace("Received status"), V.rstCode === Sj5.constants.NGHTTP2_REFUSED_STREAM) this.outputStatus(V, "REFUSED");
                  else this.outputStatus(V, "PROCESSED")
                }
              }), this.childStartTime = new Date
            } catch (V) {
              this.trace("Failed to start call on picked subchannel " + Z + " with error " + V.message), this.outputStatus({
                code: q81.Status.INTERNAL,
                details: "Failed to start HTTP/2 stream with error " + V.message,
                metadata: new N81.Metadata
              }, "NOT_STARTED");
              return
            }
            if ((X = G.onCallStarted) === null || X === void 0 || X.call(G), this.onCallEnded = G.onCallEnded, this.trace("Created child call [" + this.child.getCallNumber() + "]"), this.readPending) this.child.startRead();
            if (this.pendingMessage) this.child.sendMessageWithContext(this.pendingMessage.context, this.pendingMessage.message);
            if (this.pendingHalfClose) this.child.halfClose()
          }, (W) => {
            let {
              code: X,
              details: V
            } = (0, f90.restrictControlPlaneStatusCode)(typeof W.code === "number" ? W.code : q81.Status.UNKNOWN, `Getting metadata from plugin failed with error: ${W.message}`);
            this.outputStatus({
              code: X,
              details: V,
              metadata: new N81.Metadata
            }, "PROCESSED")
          });
          break;
        case lOA.PickResultType.DROP:
          let {
            code: Y, details: J
          } = (0, f90.restrictControlPlaneStatusCode)(G.status.code, G.status.details);
          setImmediate(() => {
            this.outputStatus({
              code: Y,
              details: J,
              metadata: G.status.metadata
            }, "DROP")
          });
          break;
        case lOA.PickResultType.TRANSIENT_FAILURE:
          if (this.metadata.getOptions().waitForReady) this.channel.queueCallForPick(this);
          else {
            let {
              code: W,
              details: X
            } = (0, f90.restrictControlPlaneStatusCode)(G.status.code, G.status.details);
            setImmediate(() => {
              this.outputStatus({
                code: W,
                details: X,
                metadata: G.status.metadata
              }, "PROCESSED")
            })
          }
          break;
        case lOA.PickResultType.QUEUE:
          this.channel.queueCallForPick(this)
      }
    }
    cancelWithStatus(A, Q) {
      var B;
      this.trace("cancelWithStatus code: " + A + ' details: "' + Q + '"'), (B = this.child) === null || B === void 0 || B.cancelWithStatus(A, Q), this.outputStatus({
        code: A,
        details: Q,
        metadata: new N81.Metadata
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
  aU2.LoadBalancingCall = nU2
})
// @from(Start 10926760, End 10935169)
Q$2 = z((eU2) => {
  Object.defineProperty(eU2, "__esModule", {
    value: !0
  });
  eU2.ResolvingCall = void 0;
  var kj5 = O41(),
    I0A = E6(),
    Y0A = CJA(),
    oU2 = YK(),
    yj5 = zZ(),
    xj5 = gOA(),
    vj5 = "resolving_call";
  class tU2 {
    constructor(A, Q, B, G, Z) {
      if (this.channel = A, this.method = Q, this.filterStackFactory = G, this.callNumber = Z, this.child = null, this.readPending = !1, this.pendingMessage = null, this.pendingHalfClose = !1, this.ended = !1, this.readFilterPending = !1, this.writeFilterPending = !1, this.pendingChildStatus = null, this.metadata = null, this.listener = null, this.statusWatchers = [], this.deadlineTimer = setTimeout(() => {}, 0), this.filterStack = null, this.deadlineStartTime = null, this.configReceivedTime = null, this.childStartTime = null, this.credentials = kj5.CallCredentials.createEmpty(), this.deadline = B.deadline, this.host = B.host, B.parentCall) {
        if (B.flags & I0A.Propagate.CANCELLATION) B.parentCall.on("cancelled", () => {
          this.cancelWithStatus(I0A.Status.CANCELLED, "Cancelled by parent call")
        });
        if (B.flags & I0A.Propagate.DEADLINE) this.trace("Propagating deadline from parent: " + B.parentCall.getDeadline()), this.deadline = (0, Y0A.minDeadline)(this.deadline, B.parentCall.getDeadline())
      }
      this.trace("Created"), this.runDeadlineTimer()
    }
    trace(A) {
      yj5.trace(I0A.LogVerbosity.DEBUG, vj5, "[" + this.callNumber + "] " + A)
    }
    runDeadlineTimer() {
      clearTimeout(this.deadlineTimer), this.deadlineStartTime = new Date, this.trace("Deadline: " + (0, Y0A.deadlineToString)(this.deadline));
      let A = (0, Y0A.getRelativeTimeout)(this.deadline);
      if (A !== 1 / 0) {
        this.trace("Deadline will be reached in " + A + "ms");
        let Q = () => {
          if (!this.deadlineStartTime) {
            this.cancelWithStatus(I0A.Status.DEADLINE_EXCEEDED, "Deadline exceeded");
            return
          }
          let B = [],
            G = new Date;
          if (B.push(`Deadline exceeded after ${(0,Y0A.formatDateDifference)(this.deadlineStartTime,G)}`), this.configReceivedTime) {
            if (this.configReceivedTime > this.deadlineStartTime) B.push(`name resolution: ${(0,Y0A.formatDateDifference)(this.deadlineStartTime,this.configReceivedTime)}`);
            if (this.childStartTime) {
              if (this.childStartTime > this.configReceivedTime) B.push(`metadata filters: ${(0,Y0A.formatDateDifference)(this.configReceivedTime,this.childStartTime)}`)
            } else B.push("waiting for metadata filters")
          } else B.push("waiting for name resolution");
          if (this.child) B.push(...this.child.getDeadlineInfo());
          this.cancelWithStatus(I0A.Status.DEADLINE_EXCEEDED, B.join(","))
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
      if (Q.status !== I0A.Status.OK) {
        let {
          code: B,
          details: G
        } = (0, xj5.restrictControlPlaneStatusCode)(Q.status, "Failed to route call to method " + this.method);
        this.outputStatus({
          code: B,
          details: G,
          metadata: new oU2.Metadata
        });
        return
      }
      if (Q.methodConfig.timeout) {
        let B = new Date;
        B.setSeconds(B.getSeconds() + Q.methodConfig.timeout.seconds), B.setMilliseconds(B.getMilliseconds() + Q.methodConfig.timeout.nanos / 1e6), this.deadline = (0, Y0A.minDeadline)(this.deadline, B), this.runDeadlineTimer()
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
        metadata: new oU2.Metadata
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
  eU2.ResolvingCall = tU2
})
// @from(Start 10935175, End 10952324)
J$2 = z((I$2) => {
  Object.defineProperty(I$2, "__esModule", {
    value: !0
  });
  I$2.RetryingCall = I$2.MessageBufferTracker = I$2.RetryThrottler = void 0;
  var L81 = E6(),
    bj5 = CJA(),
    fj5 = YK(),
    hj5 = zZ(),
    gj5 = "retrying_call";
  class B$2 {
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
  I$2.RetryThrottler = B$2;
  class G$2 {
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
  I$2.MessageBufferTracker = G$2;
  var h90 = "grpc-previous-rpc-attempts",
    uj5 = 5;
  class Z$2 {
    constructor(A, Q, B, G, Z, I, Y, J, W) {
      var X;
      this.channel = A, this.callConfig = Q, this.methodName = B, this.host = G, this.credentials = Z, this.deadline = I, this.callNumber = Y, this.bufferTracker = J, this.retryThrottler = W, this.listener = null, this.initialMetadata = null, this.underlyingCalls = [], this.writeBuffer = [], this.writeBufferOffset = 0, this.readStarted = !1, this.transparentRetryUsed = !1, this.attempts = 0, this.hedgingTimer = null, this.committedCallIndex = null, this.initialRetryBackoffSec = 0, this.nextRetryBackoffSec = 0;
      let V = (X = A.getOptions()["grpc-node.retry_max_attempts_limit"]) !== null && X !== void 0 ? X : uj5;
      if (A.getOptions()["grpc.enable_retries"] === 0) this.state = "NO_RETRY", this.maxAttempts = 1;
      else if (Q.methodConfig.retryPolicy) {
        this.state = "RETRY";
        let F = Q.methodConfig.retryPolicy;
        this.nextRetryBackoffSec = this.initialRetryBackoffSec = Number(F.initialBackoff.substring(0, F.initialBackoff.length - 1)), this.maxAttempts = Math.min(F.maxAttempts, V)
      } else if (Q.methodConfig.hedgingPolicy) this.state = "HEDGING", this.maxAttempts = Math.min(Q.methodConfig.hedgingPolicy.maxAttempts, V);
      else this.state = "TRANSPARENT_ONLY", this.maxAttempts = 1;
      this.startTime = new Date
    }
    getDeadlineInfo() {
      if (this.underlyingCalls.length === 0) return [];
      let A = [],
        Q = this.underlyingCalls[this.underlyingCalls.length - 1];
      if (this.underlyingCalls.length > 1) A.push(`previous attempts: ${this.underlyingCalls.length-1}`);
      if (Q.startTime > this.startTime) A.push(`time to current attempt start: ${(0,bj5.formatDateDifference)(this.startTime,Q.startTime)}`);
      return A.push(...Q.call.getDeadlineInfo()), A
    }
    getCallNumber() {
      return this.callNumber
    }
    trace(A) {
      hj5.trace(L81.LogVerbosity.DEBUG, gj5, "[" + this.callNumber + "] " + A)
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
        metadata: new fj5.Metadata
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
        this.underlyingCalls[G].state = "COMPLETED", this.underlyingCalls[G].call.cancelWithStatus(L81.Status.CANCELLED, "Discarded in favor of other hedged attempt")
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
        return B === Q || B.toString().toLowerCase() === ((G = L81.Status[Q]) === null || G === void 0 ? void 0 : G.toLowerCase())
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
      var G, Z, I;
      switch (this.state) {
        case "COMMITTED":
        case "NO_RETRY":
        case "TRANSPARENT_ONLY":
          this.commitCall(Q), this.reportStatus(A);
          break;
        case "HEDGING":
          if (this.isStatusCodeInList((G = this.callConfig.methodConfig.hedgingPolicy.nonFatalStatusCodes) !== null && G !== void 0 ? G : [], A.code)) {
            (Z = this.retryThrottler) === null || Z === void 0 || Z.addCallFailed();
            let Y;
            if (B === null) Y = 0;
            else if (B < 0) {
              this.state = "TRANSPARENT_ONLY", this.commitCall(Q), this.reportStatus(A);
              return
            } else Y = B;
            setTimeout(() => {
              if (this.maybeStartHedgingAttempt(), this.countActiveCalls() === 0) this.commitCall(Q), this.reportStatus(A)
            }, Y)
          } else this.commitCall(Q), this.reportStatus(A);
          break;
        case "RETRY":
          if (this.isStatusCodeInList(this.callConfig.methodConfig.retryPolicy.retryableStatusCodes, A.code))(I = this.retryThrottler) === null || I === void 0 || I.addCallFailed(), this.maybeRetryCall(B, (Y) => {
            if (!Y) this.commitCall(Q), this.reportStatus(A)
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
      if (this.trace("state=" + this.state + " handling status with progress " + A.progress + " from child [" + this.underlyingCalls[Q].call.getCallNumber() + "] in state " + this.underlyingCalls[Q].state), this.underlyingCalls[Q].state = "COMPLETED", A.code === L81.Status.OK) {
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
        I = Number(Z.substring(0, Z.length - 1));
      this.hedgingTimer = setTimeout(() => {
        this.maybeStartHedgingAttempt()
      }, I * 1000), (B = (Q = this.hedgingTimer).unref) === null || B === void 0 || B.call(Q)
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
      if (B > 0) G.set(h90, `${B}`);
      let Z = !1;
      if (A.start(G, {
          onReceiveMetadata: (I) => {
            if (this.trace("Received metadata from child [" + A.getCallNumber() + "]"), this.commitCall(Q), Z = !0, B > 0) I.set(h90, `${B}`);
            if (this.underlyingCalls[Q].state === "ACTIVE") this.listener.onReceiveMetadata(I)
          },
          onReceiveMessage: (I) => {
            if (this.trace("Received message from child [" + A.getCallNumber() + "]"), this.commitCall(Q), this.underlyingCalls[Q].state === "ACTIVE") this.listener.onReceiveMessage(I)
          },
          onReceiveStatus: (I) => {
            if (this.trace("Received status from child [" + A.getCallNumber() + "]"), !Z && B > 0) I.metadata.set(h90, `${B}`);
            this.handleChildStatus(I, Q)
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
        I = {
          entryType: "MESSAGE",
          message: G,
          allocated: this.bufferTracker.allocate(Q.length, this.callNumber)
        };
      if (this.writeBuffer.push(I), I.allocated) {
        (B = A.callback) === null || B === void 0 || B.call(A);
        for (let [Y, J] of this.underlyingCalls.entries())
          if (J.state === "ACTIVE" && J.nextMessageToSend === Z) J.call.sendMessageWithContext({
            callback: (W) => {
              this.handleChildWriteCompleted(Y)
            }
          }, Q)
      } else {
        if (this.commitCallWithMostMessages(), this.committedCallIndex === null) return;
        let Y = this.underlyingCalls[this.committedCallIndex];
        if (I.callback = A.callback, Y.state === "ACTIVE" && Y.nextMessageToSend === Z) Y.call.sendMessageWithContext({
          callback: (J) => {
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
  I$2.RetryingCall = Z$2
})
// @from(Start 10952330, End 10954424)
iOA = z((X$2) => {
  Object.defineProperty(X$2, "__esModule", {
    value: !0
  });
  X$2.BaseSubchannelWrapper = void 0;
  class W$2 {
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
  X$2.BaseSubchannelWrapper = W$2
})
// @from(Start 10954430, End 10970463)
d90 = z((E$2) => {
  Object.defineProperty(E$2, "__esModule", {
    value: !0
  });
  E$2.InternalChannel = E$2.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = void 0;
  var cj5 = AJA(),
    pj5 = mH2(),
    lj5 = pU2(),
    m90 = Ph(),
    ij5 = YK(),
    An = E6(),
    nj5 = H81(),
    aj5 = L90(),
    F$2 = CP(),
    M81 = zZ(),
    sj5 = k90(),
    O81 = uE(),
    FO = mE(),
    nOA = ti(),
    rj5 = rU2(),
    oj5 = CJA(),
    tj5 = Q$2(),
    g90 = K81(),
    ej5 = gOA(),
    u90 = J$2(),
    AS5 = iOA(),
    QS5 = 2147483647,
    BS5 = 1000,
    GS5 = 1800000,
    R81 = new Map,
    ZS5 = 16777216,
    IS5 = 1048576;
  class K$2 extends AS5.BaseSubchannelWrapper {
    constructor(A, Q) {
      super(A);
      this.channel = Q, this.refCount = 0, this.subchannelStateListener = (B, G, Z, I) => {
        Q.throttleKeepalive(I)
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
  class D$2 {
    pick(A) {
      return {
        pickResultType: m90.PickResultType.DROP,
        status: {
          code: An.Status.UNAVAILABLE,
          details: "Channel closed before call started",
          metadata: new ij5.Metadata
        },
        subchannel: null,
        onCallStarted: null,
        onCallEnded: null
      }
    }
  }
  E$2.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = "grpc.internal.no_subchannel";
  class H$2 {
    constructor(A) {
      this.target = A, this.trace = new nOA.ChannelzTrace, this.callTracker = new nOA.ChannelzCallTracker, this.childrenTracker = new nOA.ChannelzChildrenTracker, this.state = FO.ConnectivityState.IDLE
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
  class C$2 {
    constructor(A, Q, B) {
      var G, Z, I, Y, J, W;
      if (this.credentials = Q, this.options = B, this.connectivityState = FO.ConnectivityState.IDLE, this.currentPicker = new m90.UnavailablePicker, this.configSelectionQueue = [], this.pickQueue = [], this.connectivityStateWatchers = [], this.callRefTimer = null, this.configSelector = null, this.currentResolutionError = null, this.wrappedSubchannels = new Set, this.callCount = 0, this.idleTimer = null, this.channelzEnabled = !0, this.randomChannelId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), typeof A !== "string") throw TypeError("Channel target must be a string");
      if (!(Q instanceof cj5.ChannelCredentials)) throw TypeError("Channel credentials must be a ChannelCredentials object");
      if (B) {
        if (typeof B !== "object") throw TypeError("Channel options must be an object")
      }
      this.channelzInfoTracker = new H$2(A);
      let X = (0, O81.parseUri)(A);
      if (X === null) throw Error(`Could not parse target name "${A}"`);
      let V = (0, F$2.mapUriDefaultScheme)(X);
      if (V === null) throw Error(`Could not find a default scheme for target name "${A}"`);
      if (this.options["grpc.enable_channelz"] === 0) this.channelzEnabled = !1;
      if (this.channelzRef = (0, nOA.registerChannelzChannel)(A, this.channelzInfoTracker.getChannelzInfoCallback(), this.channelzEnabled), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Channel created");
      if (this.options["grpc.default_authority"]) this.defaultAuthority = this.options["grpc.default_authority"];
      else this.defaultAuthority = (0, F$2.getDefaultAuthority)(V);
      let F = (0, sj5.mapProxyName)(V, B);
      this.target = F.target, this.options = Object.assign({}, this.options, F.extraOptions), this.subchannelPool = (0, lj5.getSubchannelPool)(((G = this.options["grpc.use_local_subchannel_pool"]) !== null && G !== void 0 ? G : 0) === 0), this.retryBufferTracker = new u90.MessageBufferTracker((Z = this.options["grpc.retry_buffer_size"]) !== null && Z !== void 0 ? Z : ZS5, (I = this.options["grpc.per_rpc_retry_buffer_size"]) !== null && I !== void 0 ? I : IS5), this.keepaliveTime = (Y = this.options["grpc.keepalive_time_ms"]) !== null && Y !== void 0 ? Y : -1, this.idleTimeoutMs = Math.max((J = this.options["grpc.client_idle_timeout_ms"]) !== null && J !== void 0 ? J : GS5, BS5);
      let K = {
        createSubchannel: (H, C) => {
          let E = {};
          for (let [w, N] of Object.entries(C))
            if (!w.startsWith(E$2.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX)) E[w] = N;
          let U = this.subchannelPool.getOrCreateSubchannel(this.target, H, E, this.credentials);
          if (U.throttleKeepalive(this.keepaliveTime), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Created subchannel or used existing subchannel", U.getChannelzRef());
          return new K$2(U, this)
        },
        updateState: (H, C) => {
          this.currentPicker = C;
          let E = this.pickQueue.slice();
          if (this.pickQueue = [], E.length > 0) this.callRefTimerUnref();
          for (let U of E) U.doPick();
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
      this.resolvingLoadBalancer = new pj5.ResolvingLoadBalancer(this.target, K, this.options, (H, C) => {
        var E;
        if (H.retryThrottling) R81.set(this.getTarget(), new u90.RetryThrottler(H.retryThrottling.maxTokens, H.retryThrottling.tokenRatio, R81.get(this.getTarget())));
        else R81.delete(this.getTarget());
        if (this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Address resolution succeeded");
        (E = this.configSelector) === null || E === void 0 || E.unref(), this.configSelector = C, this.currentResolutionError = null, process.nextTick(() => {
          let U = this.configSelectionQueue;
          if (this.configSelectionQueue = [], U.length > 0) this.callRefTimerUnref();
          for (let q of U) q.getConfig()
        })
      }, (H) => {
        if (this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_WARNING", "Address resolution failed with code " + H.code + ' and details "' + H.details + '"');
        if (this.configSelectionQueue.length > 0) this.trace("Name resolution failed with calls queued for config selection");
        if (this.configSelector === null) this.currentResolutionError = Object.assign(Object.assign({}, (0, ej5.restrictControlPlaneStatusCode)(H.code, H.details)), {
          metadata: H.metadata
        });
        let C = this.configSelectionQueue;
        if (this.configSelectionQueue = [], C.length > 0) this.callRefTimerUnref();
        for (let E of C) E.reportResolverError(H)
      }), this.filterStackFactory = new nj5.FilterStackFactory([new aj5.CompressionFilterFactory(this, this.options)]), this.trace("Channel constructed with options " + JSON.stringify(B, void 0, 2));
      let D = Error();
      if ((0, M81.isTracerEnabled)("channel_stacktrace"))(0, M81.trace)(An.LogVerbosity.DEBUG, "channel_stacktrace", "(" + this.channelzRef.id + `) Channel constructed 
` + ((W = D.stack) === null || W === void 0 ? void 0 : W.substring(D.stack.indexOf(`
`) + 1)));
      this.lastActivityTimestamp = new Date
    }
    trace(A, Q) {
      (0, M81.trace)(Q !== null && Q !== void 0 ? Q : An.LogVerbosity.DEBUG, "channel", "(" + this.channelzRef.id + ") " + (0, O81.uriToString)(this.target) + " " + A)
    }
    callRefTimerRef() {
      var A, Q, B, G;
      if (!this.callRefTimer) this.callRefTimer = setInterval(() => {}, QS5);
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
      if ((0, M81.trace)(An.LogVerbosity.DEBUG, "connectivity_state", "(" + this.channelzRef.id + ") " + (0, O81.uriToString)(this.target) + " " + FO.ConnectivityState[this.connectivityState] + " -> " + FO.ConnectivityState[A]), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Connectivity state change to " + FO.ConnectivityState[A]);
      this.connectivityState = A, this.channelzInfoTracker.state = A;
      let Q = this.connectivityStateWatchers.slice();
      for (let B of Q)
        if (A !== B.currentState) {
          if (B.timer) clearTimeout(B.timer);
          this.removeConnectivityStateWatcher(B), B.callback()
        } if (A !== FO.ConnectivityState.TRANSIENT_FAILURE) this.currentResolutionError = null
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
      if (this.connectivityState !== FO.ConnectivityState.SHUTDOWN) this.resolvingLoadBalancer.exitIdle();
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
      if (this.resolvingLoadBalancer.destroy(), this.updateState(FO.ConnectivityState.IDLE), this.currentPicker = new m90.QueuePicker(this.resolvingLoadBalancer), this.idleTimer) clearTimeout(this.idleTimer), this.idleTimer = null;
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
      if (this.connectivityState !== FO.ConnectivityState.SHUTDOWN && !this.idleTimer) this.startIdleTimeout(this.idleTimeoutMs)
    }
    onCallStart() {
      if (this.channelzEnabled) this.channelzInfoTracker.callTracker.addCallStarted();
      this.callCount += 1
    }
    onCallEnd(A) {
      if (this.channelzEnabled)
        if (A.code === An.Status.OK) this.channelzInfoTracker.callTracker.addCallSucceeded();
        else this.channelzInfoTracker.callTracker.addCallFailed();
      this.callCount -= 1, this.lastActivityTimestamp = new Date, this.maybeStartIdleTimer()
    }
    createLoadBalancingCall(A, Q, B, G, Z) {
      let I = (0, g90.getNextCallNumber)();
      return this.trace("createLoadBalancingCall [" + I + '] method="' + Q + '"'), new rj5.LoadBalancingCall(this, A, Q, B, G, Z, I)
    }
    createRetryingCall(A, Q, B, G, Z) {
      let I = (0, g90.getNextCallNumber)();
      return this.trace("createRetryingCall [" + I + '] method="' + Q + '"'), new u90.RetryingCall(this, A, Q, B, G, Z, I, this.retryBufferTracker, R81.get(this.getTarget()))
    }
    createResolvingCall(A, Q, B, G, Z) {
      let I = (0, g90.getNextCallNumber)();
      this.trace("createResolvingCall [" + I + '] method="' + A + '", deadline=' + (0, oj5.deadlineToString)(Q));
      let Y = {
          deadline: Q,
          flags: Z !== null && Z !== void 0 ? Z : An.Propagate.DEFAULTS,
          host: B !== null && B !== void 0 ? B : this.defaultAuthority,
          parentCall: G
        },
        J = new tj5.ResolvingCall(this, A, Y, this.filterStackFactory.clone(), I);
      return this.onCallStart(), J.addStatusWatcher((W) => {
        this.onCallEnd(W)
      }), J
    }
    close() {
      var A;
      this.resolvingLoadBalancer.destroy(), this.updateState(FO.ConnectivityState.SHUTDOWN), this.currentPicker = new D$2;
      for (let Q of this.configSelectionQueue) Q.cancelWithStatus(An.Status.UNAVAILABLE, "Channel closed before call started");
      this.configSelectionQueue = [];
      for (let Q of this.pickQueue) Q.cancelWithStatus(An.Status.UNAVAILABLE, "Channel closed before call started");
      if (this.pickQueue = [], this.callRefTimer) clearInterval(this.callRefTimer);
      if (this.idleTimer) clearTimeout(this.idleTimer);
      if (this.channelzEnabled)(0, nOA.unregisterChannelzRef)(this.channelzRef);
      this.subchannelPool.unrefUnusedSubchannels(), (A = this.configSelector) === null || A === void 0 || A.unref(), this.configSelector = null
    }
    getTarget() {
      return (0, O81.uriToString)(this.target)
    }
    getConnectivityState(A) {
      let Q = this.connectivityState;
      if (A) this.resolvingLoadBalancer.exitIdle(), this.lastActivityTimestamp = new Date, this.maybeStartIdleTimer();
      return Q
    }
    watchConnectivityState(A, Q, B) {
      if (this.connectivityState === FO.ConnectivityState.SHUTDOWN) throw Error("Channel has been shut down");
      let G = null;
      if (Q !== 1 / 0) {
        let I = Q instanceof Date ? Q : new Date(Q),
          Y = new Date;
        if (Q === -1 / 0 || I <= Y) {
          process.nextTick(B, Error("Deadline passed without connectivity state change"));
          return
        }
        G = setTimeout(() => {
          this.removeConnectivityStateWatcher(Z), B(Error("Deadline passed without connectivity state change"))
        }, I.getTime() - Y.getTime())
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
      if (this.connectivityState === FO.ConnectivityState.SHUTDOWN) throw Error("Channel has been shut down");
      return this.createResolvingCall(A, Q, B, G, Z)
    }
    getOptions() {
      return this.options
    }
  }
  E$2.InternalChannel = C$2
})
// @from(Start 10970469, End 10971826)
N20 = z((w$2) => {
  Object.defineProperty(w$2, "__esModule", {
    value: !0
  });
  w$2.ChannelImplementation = void 0;
  var YS5 = AJA(),
    JS5 = d90();
  class $$2 {
    constructor(A, Q, B) {
      if (typeof A !== "string") throw TypeError("Channel target must be a string");
      if (!(Q instanceof YS5.ChannelCredentials)) throw TypeError("Channel credentials must be a ChannelCredentials object");
      if (B) {
        if (typeof B !== "object") throw TypeError("Channel options must be an object")
      }
      this.internalChannel = new JS5.InternalChannel(A, Q, B)
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
  w$2.ChannelImplementation = $$2
})
// @from(Start 10971832, End 10976531)
j$2 = z((T$2) => {
  Object.defineProperty(T$2, "__esModule", {
    value: !0
  });
  T$2.ServerDuplexStreamImpl = T$2.ServerWritableStreamImpl = T$2.ServerReadableStreamImpl = T$2.ServerUnaryCallImpl = void 0;
  T$2.serverErrorToStatus = l90;
  var WS5 = UA("events"),
    c90 = UA("stream"),
    p90 = E6(),
    N$2 = YK();

  function l90(A, Q) {
    var B;
    let G = {
      code: p90.Status.UNKNOWN,
      details: "message" in A ? A.message : "Unknown Error",
      metadata: (B = Q !== null && Q !== void 0 ? Q : A.metadata) !== null && B !== void 0 ? B : null
    };
    if ("code" in A && typeof A.code === "number" && Number.isInteger(A.code)) {
      if (G.code = A.code, "details" in A && typeof A.details === "string") G.details = A.details
    }
    return G
  }
  class L$2 extends WS5.EventEmitter {
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
  T$2.ServerUnaryCallImpl = L$2;
  class M$2 extends c90.Readable {
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
  T$2.ServerReadableStreamImpl = M$2;
  class O$2 extends c90.Writable {
    constructor(A, Q, B, G) {
      super({
        objectMode: !0
      });
      this.path = A, this.call = Q, this.metadata = B, this.request = G, this.pendingStatus = {
        code: p90.Status.OK,
        details: "OK"
      }, this.cancelled = !1, this.trailingMetadata = new N$2.Metadata, this.on("error", (Z) => {
        this.pendingStatus = l90(Z), this.end()
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
  T$2.ServerWritableStreamImpl = O$2;
  class R$2 extends c90.Duplex {
    constructor(A, Q, B) {
      super({
        objectMode: !0
      });
      this.path = A, this.call = Q, this.metadata = B, this.pendingStatus = {
        code: p90.Status.OK,
        details: "OK"
      }, this.cancelled = !1, this.trailingMetadata = new N$2.Metadata, this.on("error", (G) => {
        this.pendingStatus = l90(G), this.end()
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
  T$2.ServerDuplexStreamImpl = R$2
})
// @from(Start 10976537, End 10983784)
T81 = z((S$2) => {
  Object.defineProperty(S$2, "__esModule", {
    value: !0
  });
  S$2.ServerCredentials = void 0;
  S$2.createCertificateProviderServerCredentials = DS5;
  S$2.createServerCredentialsWithInterceptors = HS5;
  var i90 = J20();
  class wJA {
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
      return new n90
    }
    static createSsl(A, Q, B = !1) {
      var G;
      if (A !== null && !Buffer.isBuffer(A)) throw TypeError("rootCerts must be null or a Buffer");
      if (!Array.isArray(Q)) throw TypeError("keyCertPairs must be an array");
      if (typeof B !== "boolean") throw TypeError("checkClientCertificate must be a boolean");
      let Z = [],
        I = [];
      for (let Y = 0; Y < Q.length; Y++) {
        let J = Q[Y];
        if (J === null || typeof J !== "object") throw TypeError(`keyCertPair[${Y}] must be an object`);
        if (!Buffer.isBuffer(J.private_key)) throw TypeError(`keyCertPair[${Y}].private_key must be a Buffer`);
        if (!Buffer.isBuffer(J.cert_chain)) throw TypeError(`keyCertPair[${Y}].cert_chain must be a Buffer`);
        Z.push(J.cert_chain), I.push(J.private_key)
      }
      return new a90({
        requestCert: B,
        ciphers: i90.CIPHER_SUITES
      }, {
        ca: (G = A !== null && A !== void 0 ? A : (0, i90.getDefaultRootsData)()) !== null && G !== void 0 ? G : void 0,
        cert: Z,
        key: I
      })
    }
  }
  S$2.ServerCredentials = wJA;
  class n90 extends wJA {
    constructor() {
      super(null)
    }
    _getSettings() {
      return null
    }
    _equals(A) {
      return A instanceof n90
    }
  }
  class a90 extends wJA {
    constructor(A, Q) {
      super(A, Q);
      this.options = Object.assign(Object.assign({}, A), Q)
    }
    _equals(A) {
      if (this === A) return !0;
      if (!(A instanceof a90)) return !1;
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
  class s90 extends wJA {
    constructor(A, Q, B) {
      super({
        requestCert: Q !== null,
        rejectUnauthorized: B,
        ciphers: i90.CIPHER_SUITES
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
      if (!(A instanceof s90)) return !1;
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

  function DS5(A, Q, B) {
    return new s90(A, Q, B)
  }
  class r90 extends wJA {
    constructor(A, Q) {
      super({});
      this.childCredentials = A, this.interceptors = Q
    }
    _isSecure() {
      return this.childCredentials._isSecure()
    }
    _equals(A) {
      if (!(A instanceof r90)) return !1;
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

  function HS5(A, Q) {
    return new r90(A, Q)
  }
})
// @from(Start 10983790, End 10985019)
aOA = z((k$2) => {
  Object.defineProperty(k$2, "__esModule", {
    value: !0
  });
  k$2.durationMessageToDuration = zS5;
  k$2.msToDuration = US5;
  k$2.durationToMs = $S5;
  k$2.isDuration = wS5;
  k$2.isDurationMessage = qS5;
  k$2.parseDuration = LS5;
  k$2.durationToString = MS5;

  function zS5(A) {
    return {
      seconds: Number.parseInt(A.seconds),
      nanos: A.nanos
    }
  }

  function US5(A) {
    return {
      seconds: A / 1000 | 0,
      nanos: A % 1000 * 1e6 | 0
    }
  }

  function $S5(A) {
    return A.seconds * 1000 + A.nanos / 1e6 | 0
  }

  function wS5(A) {
    return typeof A.seconds === "number" && typeof A.nanos === "number"
  }

  function qS5(A) {
    return typeof A.seconds === "string" && typeof A.nanos === "number"
  }
  var NS5 = /^(\d+)(?:\.(\d+))?s$/;

  function LS5(A) {
    let Q = A.match(NS5);
    if (!Q) return null;
    return {
      seconds: Number.parseInt(Q[1], 10),
      nanos: Q[2] ? Number.parseInt(Q[2].padEnd(9, "0"), 10) : 0
    }
  }

  function MS5(A) {
    if (A.nanos === 0) return `${A.seconds}s`;
    let Q;
    if (A.nanos % 1e6 === 0) Q = 1e6;
    else if (A.nanos % 1000 === 0) Q = 1000;
    else Q = 1;
    return `${A.seconds}.${A.nanos/Q}s`
  }
})
// @from(Start 10985025, End 10991938)
j81 = z((c$2) => {
  var __dirname = "/home/runner/code/tmp/claude-cli-external-build-2204/node_modules/@grpc/grpc-js/build/src";
  Object.defineProperty(c$2, "__esModule", {
    value: !0
  });
  c$2.OrcaOobMetricsSubchannelWrapper = c$2.GRPC_METRICS_HEADER = c$2.ServerMetricRecorder = c$2.PerRequestMetricRecorder = void 0;
  c$2.createOrcaClient = h$2;
  c$2.createMetricsReader = hS5;
  var kS5 = f41(),
    o90 = aOA(),
    yS5 = AJA(),
    xS5 = iOA(),
    y$2 = E6(),
    vS5 = QJA(),
    bS5 = mE(),
    x$2 = null;

  function P81() {
    if (x$2) return x$2;
    let A = H90().loadSync,
      Q = A("xds/service/orca/v3/orca.proto", {
        keepCase: !0,
        longs: String,
        enums: String,
        defaults: !0,
        oneofs: !0,
        includeDirs: [`${__dirname}/../../proto/xds`, `${__dirname}/../../proto/protoc-gen-validate`]
      });
    return (0, kS5.loadPackageDefinition)(Q)
  }
  class b$2 {
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
      return P81().xds.data.orca.v3.OrcaLoadReport.serialize(this.message)
    }
  }
  c$2.PerRequestMetricRecorder = b$2;
  var fS5 = 30000;
  class f$2 {
    constructor() {
      this.message = {}, this.serviceImplementation = {
        StreamCoreMetrics: (A) => {
          let Q = A.request.report_interval ? (0, o90.durationToMs)((0, o90.durationMessageToDuration)(A.request.report_interval)) : fS5,
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
      let Q = P81().xds.service.orca.v3.OpenRcaService.service;
      A.addService(Q, this.serviceImplementation)
    }
  }
  c$2.ServerMetricRecorder = f$2;

  function h$2(A) {
    return new(P81()).xds.service.orca.v3.OpenRcaService("unused", yS5.ChannelCredentials.createInsecure(), {
      channelOverride: A
    })
  }
  c$2.GRPC_METRICS_HEADER = "endpoint-load-metrics-bin";
  var v$2 = "grpc_orca_load_report";

  function hS5(A, Q) {
    return (B, G, Z) => {
      let I = Z.getOpaque(v$2);
      if (I) A(I);
      else {
        let Y = Z.get(c$2.GRPC_METRICS_HEADER);
        if (Y.length > 0) I = P81().xds.data.orca.v3.OrcaLoadReport.deserialize(Y[0]), A(I), Z.setOpaque(v$2, I)
      }
      if (Q) Q(B, G, Z)
    }
  }
  var g$2 = "orca_oob_metrics";
  class u$2 {
    constructor(A, Q) {
      this.metricsListener = A, this.intervalMs = Q, this.dataProducer = null
    }
    setSubchannel(A) {
      let Q = A.getOrCreateDataProducer(g$2, gS5);
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
  class m$2 {
    constructor(A) {
      this.subchannel = A, this.dataWatchers = new Set, this.orcaSupported = !0, this.metricsCall = null, this.currentInterval = 1 / 0, this.backoffTimer = new vS5.BackoffTimeout(() => this.updateMetricsSubscription()), this.subchannelStateListener = () => this.updateMetricsSubscription();
      let Q = A.getChannel();
      this.client = h$2(Q), A.addConnectivityStateListener(this.subchannelStateListener)
    }
    addDataWatcher(A) {
      this.dataWatchers.add(A), this.updateMetricsSubscription()
    }
    removeDataWatcher(A) {
      var Q;
      if (this.dataWatchers.delete(A), this.dataWatchers.size === 0) this.subchannel.removeDataProducer(g$2), (Q = this.metricsCall) === null || Q === void 0 || Q.cancel(), this.metricsCall = null, this.client.close(), this.subchannel.removeConnectivityStateListener(this.subchannelStateListener);
      else this.updateMetricsSubscription()
    }
    updateMetricsSubscription() {
      var A;
      if (this.dataWatchers.size === 0 || !this.orcaSupported || this.subchannel.getConnectivityState() !== bS5.ConnectivityState.READY) return;
      let Q = Math.min(...Array.from(this.dataWatchers).map((B) => B.getInterval()));
      if (!this.metricsCall || Q !== this.currentInterval) {
        (A = this.metricsCall) === null || A === void 0 || A.cancel(), this.currentInterval = Q;
        let B = this.client.streamCoreMetrics({
          report_interval: (0, o90.msToDuration)(Q)
        });
        this.metricsCall = B, B.on("data", (G) => {
          this.dataWatchers.forEach((Z) => {
            Z.onMetricsUpdate(G)
          })
        }), B.on("error", (G) => {
          if (this.metricsCall = null, G.code === y$2.Status.UNIMPLEMENTED) {
            this.orcaSupported = !1;
            return
          }
          if (G.code === y$2.Status.CANCELLED) return;
          this.backoffTimer.runOnce()
        })
      }
    }
  }
  class d$2 extends xS5.BaseSubchannelWrapper {
    constructor(A, Q, B) {
      super(A);
      this.addDataWatcher(new u$2(Q, B))
    }
    getWrappedSubchannel() {
      return this.child
    }
  }
  c$2.OrcaOobMetricsSubchannelWrapper = d$2;

  function gS5(A) {
    return new m$2(A)
  }
})