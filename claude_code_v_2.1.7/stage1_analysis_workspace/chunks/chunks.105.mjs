
// @from(Ln 302998, Col 4)
MF0 = U((FC2) => {
  Object.defineProperty(FC2, "__esModule", {
    value: !0
  });
  FC2.BaseServerInterceptingCall = FC2.ServerInterceptingCall = FC2.ResponderBuilder = FC2.ServerListenerBuilder = void 0;
  FC2.isInterceptingServerListener = SR5;
  FC2.getServerInterceptingCall = bR5;
  var pX1 = jF(),
    gN = j8(),
    vFA = NA("http2"),
    AC2 = yJ1(),
    QC2 = NA("zlib"),
    TR5 = GF0(),
    JC2 = WY(),
    PR5 = NA("tls"),
    BC2 = mX1(),
    XC2 = "server_call";

  function J6A(A) {
    JC2.trace(gN.LogVerbosity.DEBUG, XC2, A)
  }
  class IC2 {
    constructor() {
      this.metadata = void 0, this.message = void 0, this.halfClose = void 0, this.cancel = void 0
    }
    withOnReceiveMetadata(A) {
      return this.metadata = A, this
    }
    withOnReceiveMessage(A) {
      return this.message = A, this
    }
    withOnReceiveHalfClose(A) {
      return this.halfClose = A, this
    }
    withOnCancel(A) {
      return this.cancel = A, this
    }
    build() {
      return {
        onReceiveMetadata: this.metadata,
        onReceiveMessage: this.message,
        onReceiveHalfClose: this.halfClose,
        onCancel: this.cancel
      }
    }
  }
  FC2.ServerListenerBuilder = IC2;

  function SR5(A) {
    return A.onReceiveMetadata !== void 0 && A.onReceiveMetadata.length === 1
  }
  class DC2 {
    constructor(A, Q) {
      this.listener = A, this.nextListener = Q, this.cancelled = !1, this.processingMetadata = !1, this.hasPendingMessage = !1, this.pendingMessage = null, this.processingMessage = !1, this.hasPendingHalfClose = !1
    }
    processPendingMessage() {
      if (this.hasPendingMessage) this.nextListener.onReceiveMessage(this.pendingMessage), this.pendingMessage = null, this.hasPendingMessage = !1
    }
    processPendingHalfClose() {
      if (this.hasPendingHalfClose) this.nextListener.onReceiveHalfClose(), this.hasPendingHalfClose = !1
    }
    onReceiveMetadata(A) {
      if (this.cancelled) return;
      this.processingMetadata = !0, this.listener.onReceiveMetadata(A, (Q) => {
        if (this.processingMetadata = !1, this.cancelled) return;
        this.nextListener.onReceiveMetadata(Q), this.processPendingMessage(), this.processPendingHalfClose()
      })
    }
    onReceiveMessage(A) {
      if (this.cancelled) return;
      this.processingMessage = !0, this.listener.onReceiveMessage(A, (Q) => {
        if (this.processingMessage = !1, this.cancelled) return;
        if (this.processingMetadata) this.pendingMessage = Q, this.hasPendingMessage = !0;
        else this.nextListener.onReceiveMessage(Q), this.processPendingHalfClose()
      })
    }
    onReceiveHalfClose() {
      if (this.cancelled) return;
      this.listener.onReceiveHalfClose(() => {
        if (this.cancelled) return;
        if (this.processingMetadata || this.processingMessage) this.hasPendingHalfClose = !0;
        else this.nextListener.onReceiveHalfClose()
      })
    }
    onCancel() {
      this.cancelled = !0, this.listener.onCancel(), this.nextListener.onCancel()
    }
  }
  class WC2 {
    constructor() {
      this.start = void 0, this.metadata = void 0, this.message = void 0, this.status = void 0
    }
    withStart(A) {
      return this.start = A, this
    }
    withSendMetadata(A) {
      return this.metadata = A, this
    }
    withSendMessage(A) {
      return this.message = A, this
    }
    withSendStatus(A) {
      return this.status = A, this
    }
    build() {
      return {
        start: this.start,
        sendMetadata: this.metadata,
        sendMessage: this.message,
        sendStatus: this.status
      }
    }
  }
  FC2.ResponderBuilder = WC2;
  var dX1 = {
      onReceiveMetadata: (A, Q) => {
        Q(A)
      },
      onReceiveMessage: (A, Q) => {
        Q(A)
      },
      onReceiveHalfClose: (A) => {
        A()
      },
      onCancel: () => {}
    },
    cX1 = {
      start: (A) => {
        A()
      },
      sendMetadata: (A, Q) => {
        Q(A)
      },
      sendMessage: (A, Q) => {
        Q(A)
      },
      sendStatus: (A, Q) => {
        Q(A)
      }
    };
  class KC2 {
    constructor(A, Q) {
      var B, G, Z, Y;
      this.nextCall = A, this.processingMetadata = !1, this.sentMetadata = !1, this.processingMessage = !1, this.pendingMessage = null, this.pendingMessageCallback = null, this.pendingStatus = null, this.responder = {
        start: (B = Q === null || Q === void 0 ? void 0 : Q.start) !== null && B !== void 0 ? B : cX1.start,
        sendMetadata: (G = Q === null || Q === void 0 ? void 0 : Q.sendMetadata) !== null && G !== void 0 ? G : cX1.sendMetadata,
        sendMessage: (Z = Q === null || Q === void 0 ? void 0 : Q.sendMessage) !== null && Z !== void 0 ? Z : cX1.sendMessage,
        sendStatus: (Y = Q === null || Q === void 0 ? void 0 : Q.sendStatus) !== null && Y !== void 0 ? Y : cX1.sendStatus
      }
    }
    processPendingMessage() {
      if (this.pendingMessageCallback) this.nextCall.sendMessage(this.pendingMessage, this.pendingMessageCallback), this.pendingMessage = null, this.pendingMessageCallback = null
    }
    processPendingStatus() {
      if (this.pendingStatus) this.nextCall.sendStatus(this.pendingStatus), this.pendingStatus = null
    }
    start(A) {
      this.responder.start((Q) => {
        var B, G, Z, Y;
        let J = {
            onReceiveMetadata: (B = Q === null || Q === void 0 ? void 0 : Q.onReceiveMetadata) !== null && B !== void 0 ? B : dX1.onReceiveMetadata,
            onReceiveMessage: (G = Q === null || Q === void 0 ? void 0 : Q.onReceiveMessage) !== null && G !== void 0 ? G : dX1.onReceiveMessage,
            onReceiveHalfClose: (Z = Q === null || Q === void 0 ? void 0 : Q.onReceiveHalfClose) !== null && Z !== void 0 ? Z : dX1.onReceiveHalfClose,
            onCancel: (Y = Q === null || Q === void 0 ? void 0 : Q.onCancel) !== null && Y !== void 0 ? Y : dX1.onCancel
          },
          X = new DC2(J, A);
        this.nextCall.start(X)
      })
    }
    sendMetadata(A) {
      this.processingMetadata = !0, this.sentMetadata = !0, this.responder.sendMetadata(A, (Q) => {
        this.processingMetadata = !1, this.nextCall.sendMetadata(Q), this.processPendingMessage(), this.processPendingStatus()
      })
    }
    sendMessage(A, Q) {
      if (this.processingMessage = !0, !this.sentMetadata) this.sendMetadata(new pX1.Metadata);
      this.responder.sendMessage(A, (B) => {
        if (this.processingMessage = !1, this.processingMetadata) this.pendingMessage = B, this.pendingMessageCallback = Q;
        else this.nextCall.sendMessage(B, Q)
      })
    }
    sendStatus(A) {
      this.responder.sendStatus(A, (Q) => {
        if (this.processingMetadata || this.processingMessage) this.pendingStatus = Q;
        else this.nextCall.sendStatus(Q)
      })
    }
    startRead() {
      this.nextCall.startRead()
    }
    getPeer() {
      return this.nextCall.getPeer()
    }
    getDeadline() {
      return this.nextCall.getDeadline()
    }
    getHost() {
      return this.nextCall.getHost()
    }
    getAuthContext() {
      return this.nextCall.getAuthContext()
    }
    getConnectionInfo() {
      return this.nextCall.getConnectionInfo()
    }
    getMetricsRecorder() {
      return this.nextCall.getMetricsRecorder()
    }
  }
  FC2.ServerInterceptingCall = KC2;
  var VC2 = "grpc-accept-encoding",
    LF0 = "grpc-encoding",
    GC2 = "grpc-message",
    ZC2 = "grpc-status",
    wF0 = "grpc-timeout",
    xR5 = /(\d{1,8})\s*([HMSmun])/,
    yR5 = {
      H: 3600000,
      M: 60000,
      S: 1000,
      m: 1,
      u: 0.001,
      n: 0.000001
    },
    vR5 = {
      [VC2]: "identity,deflate,gzip",
      [LF0]: "identity"
    },
    YC2 = {
      [vFA.constants.HTTP2_HEADER_STATUS]: vFA.constants.HTTP_STATUS_OK,
      [vFA.constants.HTTP2_HEADER_CONTENT_TYPE]: "application/grpc+proto"
    },
    kR5 = {
      waitForTrailers: !0
    };
  class OF0 {
    constructor(A, Q, B, G, Z) {
      var Y, J;
      if (this.stream = A, this.callEventTracker = B, this.handler = G, this.listener = null, this.deadlineTimer = null, this.deadline = 1 / 0, this.maxSendMessageSize = gN.DEFAULT_MAX_SEND_MESSAGE_LENGTH, this.maxReceiveMessageSize = gN.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH, this.cancelled = !1, this.metadataSent = !1, this.wantTrailers = !1, this.cancelNotified = !1, this.incomingEncoding = "identity", this.readQueue = [], this.isReadPending = !1, this.receivedHalfClose = !1, this.streamEnded = !1, this.metricsRecorder = new BC2.PerRequestMetricRecorder, this.stream.once("error", (K) => {}), this.stream.once("close", () => {
          var K;
          if (J6A("Request to method " + ((K = this.handler) === null || K === void 0 ? void 0 : K.path) + " stream closed with rstCode " + this.stream.rstCode), this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!1), this.callEventTracker.onCallEnd({
            code: gN.Status.CANCELLED,
            details: "Stream closed before sending status",
            metadata: null
          });
          this.notifyOnCancel()
        }), this.stream.on("data", (K) => {
          this.handleDataFrame(K)
        }), this.stream.pause(), this.stream.on("end", () => {
          this.handleEndEvent()
        }), "grpc.max_send_message_length" in Z) this.maxSendMessageSize = Z["grpc.max_send_message_length"];
      if ("grpc.max_receive_message_length" in Z) this.maxReceiveMessageSize = Z["grpc.max_receive_message_length"];
      this.host = (Y = Q[":authority"]) !== null && Y !== void 0 ? Y : Q.host, this.decoder = new TR5.StreamDecoder(this.maxReceiveMessageSize);
      let X = pX1.Metadata.fromHttp2Headers(Q);
      if (JC2.isTracerEnabled(XC2)) J6A("Request to " + this.handler.path + " received headers " + JSON.stringify(X.toJSON()));
      let I = X.get(wF0);
      if (I.length > 0) this.handleTimeoutHeader(I[0]);
      let D = X.get(LF0);
      if (D.length > 0) this.incomingEncoding = D[0];
      X.remove(wF0), X.remove(LF0), X.remove(VC2), X.remove(vFA.constants.HTTP2_HEADER_ACCEPT_ENCODING), X.remove(vFA.constants.HTTP2_HEADER_TE), X.remove(vFA.constants.HTTP2_HEADER_CONTENT_TYPE), this.metadata = X;
      let W = (J = A.session) === null || J === void 0 ? void 0 : J.socket;
      this.connectionInfo = {
        localAddress: W === null || W === void 0 ? void 0 : W.localAddress,
        localPort: W === null || W === void 0 ? void 0 : W.localPort,
        remoteAddress: W === null || W === void 0 ? void 0 : W.remoteAddress,
        remotePort: W === null || W === void 0 ? void 0 : W.remotePort
      }, this.shouldSendMetrics = !!Z["grpc.server_call_metric_recording"]
    }
    handleTimeoutHeader(A) {
      let Q = A.toString().match(xR5);
      if (Q === null) {
        let Z = {
          code: gN.Status.INTERNAL,
          details: `Invalid ${wF0} value "${A}"`,
          metadata: null
        };
        process.nextTick(() => {
          this.sendStatus(Z)
        });
        return
      }
      let B = +Q[1] * yR5[Q[2]] | 0,
        G = new Date;
      this.deadline = G.setMilliseconds(G.getMilliseconds() + B), this.deadlineTimer = setTimeout(() => {
        let Z = {
          code: gN.Status.DEADLINE_EXCEEDED,
          details: "Deadline exceeded",
          metadata: null
        };
        this.sendStatus(Z)
      }, B)
    }
    checkCancelled() {
      if (!this.cancelled && (this.stream.destroyed || this.stream.closed)) this.notifyOnCancel(), this.cancelled = !0;
      return this.cancelled
    }
    notifyOnCancel() {
      if (this.cancelNotified) return;
      if (this.cancelNotified = !0, this.cancelled = !0, process.nextTick(() => {
          var A;
          (A = this.listener) === null || A === void 0 || A.onCancel()
        }), this.deadlineTimer) clearTimeout(this.deadlineTimer);
      this.stream.resume()
    }
    maybeSendMetadata() {
      if (!this.metadataSent) this.sendMetadata(new pX1.Metadata)
    }
    serializeMessage(A) {
      let Q = this.handler.serialize(A),
        B = Q.byteLength,
        G = Buffer.allocUnsafe(B + 5);
      return G.writeUInt8(0, 0), G.writeUInt32BE(B, 1), Q.copy(G, 5), G
    }
    decompressMessage(A, Q) {
      let B = A.subarray(5);
      if (Q === "identity") return B;
      else if (Q === "deflate" || Q === "gzip") {
        let G;
        if (Q === "deflate") G = QC2.createInflate();
        else G = QC2.createGunzip();
        return new Promise((Z, Y) => {
          let J = 0,
            X = [];
          G.on("data", (I) => {
            if (X.push(I), J += I.byteLength, this.maxReceiveMessageSize !== -1 && J > this.maxReceiveMessageSize) G.destroy(), Y({
              code: gN.Status.RESOURCE_EXHAUSTED,
              details: `Received message that decompresses to a size larger than ${this.maxReceiveMessageSize}`
            })
          }), G.on("end", () => {
            Z(Buffer.concat(X))
          }), G.write(B), G.end()
        })
      } else return Promise.reject({
        code: gN.Status.UNIMPLEMENTED,
        details: `Received message compressed with unsupported encoding "${Q}"`
      })
    }
    async decompressAndMaybePush(A) {
      if (A.type !== "COMPRESSED") throw Error(`Invalid queue entry type: ${A.type}`);
      let B = A.compressedMessage.readUInt8(0) === 1 ? this.incomingEncoding : "identity",
        G;
      try {
        G = await this.decompressMessage(A.compressedMessage, B)
      } catch (Z) {
        this.sendStatus(Z);
        return
      }
      try {
        A.parsedMessage = this.handler.deserialize(G)
      } catch (Z) {
        this.sendStatus({
          code: gN.Status.INTERNAL,
          details: `Error deserializing request: ${Z.message}`
        });
        return
      }
      A.type = "READABLE", this.maybePushNextMessage()
    }
    maybePushNextMessage() {
      if (this.listener && this.isReadPending && this.readQueue.length > 0 && this.readQueue[0].type !== "COMPRESSED") {
        this.isReadPending = !1;
        let A = this.readQueue.shift();
        if (A.type === "READABLE") this.listener.onReceiveMessage(A.parsedMessage);
        else this.listener.onReceiveHalfClose()
      }
    }
    handleDataFrame(A) {
      var Q;
      if (this.checkCancelled()) return;
      J6A("Request to " + this.handler.path + " received data frame of size " + A.length);
      let B;
      try {
        B = this.decoder.write(A)
      } catch (G) {
        this.sendStatus({
          code: gN.Status.RESOURCE_EXHAUSTED,
          details: G.message
        });
        return
      }
      for (let G of B) {
        this.stream.pause();
        let Z = {
          type: "COMPRESSED",
          compressedMessage: G,
          parsedMessage: null
        };
        this.readQueue.push(Z), this.decompressAndMaybePush(Z), (Q = this.callEventTracker) === null || Q === void 0 || Q.addMessageReceived()
      }
    }
    handleEndEvent() {
      this.readQueue.push({
        type: "HALF_CLOSE",
        compressedMessage: null,
        parsedMessage: null
      }), this.receivedHalfClose = !0, this.maybePushNextMessage()
    }
    start(A) {
      if (J6A("Request to " + this.handler.path + " start called"), this.checkCancelled()) return;
      this.listener = A, A.onReceiveMetadata(this.metadata)
    }
    sendMetadata(A) {
      if (this.checkCancelled()) return;
      if (this.metadataSent) return;
      this.metadataSent = !0;
      let Q = A ? A.toHttp2Headers() : null,
        B = Object.assign(Object.assign(Object.assign({}, YC2), vR5), Q);
      this.stream.respond(B, kR5)
    }
    sendMessage(A, Q) {
      if (this.checkCancelled()) return;
      let B;
      try {
        B = this.serializeMessage(A)
      } catch (G) {
        this.sendStatus({
          code: gN.Status.INTERNAL,
          details: `Error serializing response: ${(0,AC2.getErrorMessage)(G)}`,
          metadata: null
        });
        return
      }
      if (this.maxSendMessageSize !== -1 && B.length - 5 > this.maxSendMessageSize) {
        this.sendStatus({
          code: gN.Status.RESOURCE_EXHAUSTED,
          details: `Sent message larger than max (${B.length} vs. ${this.maxSendMessageSize})`,
          metadata: null
        });
        return
      }
      this.maybeSendMetadata(), J6A("Request to " + this.handler.path + " sent data frame of size " + B.length), this.stream.write(B, (G) => {
        var Z;
        if (G) {
          this.sendStatus({
            code: gN.Status.INTERNAL,
            details: `Error writing message: ${(0,AC2.getErrorMessage)(G)}`,
            metadata: null
          });
          return
        }(Z = this.callEventTracker) === null || Z === void 0 || Z.addMessageSent(), Q()
      })
    }
    sendStatus(A) {
      var Q, B, G;
      if (this.checkCancelled()) return;
      J6A("Request to method " + ((Q = this.handler) === null || Q === void 0 ? void 0 : Q.path) + " ended with status code: " + gN.Status[A.code] + " details: " + A.details);
      let Z = (G = (B = A.metadata) === null || B === void 0 ? void 0 : B.clone()) !== null && G !== void 0 ? G : new pX1.Metadata;
      if (this.shouldSendMetrics) Z.set(BC2.GRPC_METRICS_HEADER, this.metricsRecorder.serialize());
      if (this.metadataSent)
        if (!this.wantTrailers) this.wantTrailers = !0, this.stream.once("wantTrailers", () => {
          if (this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!0), this.callEventTracker.onCallEnd(A);
          let Y = Object.assign({
            [ZC2]: A.code,
            [GC2]: encodeURI(A.details)
          }, Z.toHttp2Headers());
          this.stream.sendTrailers(Y), this.notifyOnCancel()
        }), this.stream.end();
        else this.notifyOnCancel();
      else {
        if (this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!0), this.callEventTracker.onCallEnd(A);
        let Y = Object.assign(Object.assign({
          [ZC2]: A.code,
          [GC2]: encodeURI(A.details)
        }, YC2), Z.toHttp2Headers());
        this.stream.respond(Y, {
          endStream: !0
        }), this.notifyOnCancel()
      }
    }
    startRead() {
      if (J6A("Request to " + this.handler.path + " startRead called"), this.checkCancelled()) return;
      if (this.isReadPending = !0, this.readQueue.length === 0) {
        if (!this.receivedHalfClose) this.stream.resume()
      } else this.maybePushNextMessage()
    }
    getPeer() {
      var A;
      let Q = (A = this.stream.session) === null || A === void 0 ? void 0 : A.socket;
      if (Q === null || Q === void 0 ? void 0 : Q.remoteAddress)
        if (Q.remotePort) return `${Q.remoteAddress}:${Q.remotePort}`;
        else return Q.remoteAddress;
      else return "unknown"
    }
    getDeadline() {
      return this.deadline
    }
    getHost() {
      return this.host
    }
    getAuthContext() {
      var A;
      if (((A = this.stream.session) === null || A === void 0 ? void 0 : A.socket) instanceof PR5.TLSSocket) {
        let Q = this.stream.session.socket.getPeerCertificate();
        return {
          transportSecurityType: "ssl",
          sslPeerCertificate: Q.raw ? Q : void 0
        }
      } else return {}
    }
    getConnectionInfo() {
      return this.connectionInfo
    }
    getMetricsRecorder() {
      return this.metricsRecorder
    }
  }
  FC2.BaseServerInterceptingCall = OF0;

  function bR5(A, Q, B, G, Z, Y) {
    let J = {
        path: Z.path,
        requestStream: Z.type === "clientStream" || Z.type === "bidi",
        responseStream: Z.type === "serverStream" || Z.type === "bidi",
        requestDeserialize: Z.deserialize,
        responseSerialize: Z.serialize
      },
      X = new OF0(Q, B, G, Z, Y);
    return A.reduce((I, D) => {
      return D(J, I)
    }, X)
  }
})
// @from(Ln 303520, Col 4)
NC2 = U((zs) => {
  var dR5 = zs && zs.__runInitializers || function (A, Q, B) {
      var G = arguments.length > 2;
      for (var Z = 0; Z < Q.length; Z++) B = G ? Q[Z].call(A, B) : Q[Z].call(A);
      return G ? B : void 0
    },
    cR5 = zs && zs.__esDecorate || function (A, Q, B, G, Z, Y) {
      function J($) {
        if ($ !== void 0 && typeof $ !== "function") throw TypeError("Function expected");
        return $
      }
      var X = G.kind,
        I = X === "getter" ? "get" : X === "setter" ? "set" : "value",
        D = !Q && A ? G.static ? A : A.prototype : null,
        W = Q || (D ? Object.getOwnPropertyDescriptor(D, G.name) : {}),
        K, V = !1;
      for (var F = B.length - 1; F >= 0; F--) {
        var H = {};
        for (var E in G) H[E] = E === "access" ? {} : G[E];
        for (var E in G.access) H.access[E] = G.access[E];
        H.addInitializer = function ($) {
          if (V) throw TypeError("Cannot add initializers after decoration has completed");
          Y.push(J($ || null))
        };
        var z = (0, B[F])(X === "accessor" ? {
          get: W.get,
          set: W.set
        } : W[I], H);
        if (X === "accessor") {
          if (z === void 0) continue;
          if (z === null || typeof z !== "object") throw TypeError("Object expected");
          if (K = J(z.get)) W.get = K;
          if (K = J(z.set)) W.set = K;
          if (K = J(z.init)) Z.unshift(K)
        } else if (K = J(z))
          if (X === "field") Z.unshift(K);
          else W[I] = K
      }
      if (D) Object.defineProperty(D, G.name, W);
      V = !0
    };
  Object.defineProperty(zs, "__esModule", {
    value: !0
  });
  zs.Server = void 0;
  var uN = NA("http2"),
    pR5 = NA("util"),
    oD = j8(),
    fFA = f$2(),
    RF0 = gX1(),
    EC2 = gS(),
    bFA = WY(),
    Es = hN(),
    lS = JU(),
    XV = Vs(),
    zC2 = MF0(),
    kFA = 2147483647,
    _F0 = 2147483647,
    lR5 = 20000,
    $C2 = 2147483647,
    {
      HTTP2_HEADER_PATH: CC2
    } = uN.constants,
    iR5 = "server",
    UC2 = Buffer.from("max_age");

  function qC2(A) {
    bFA.trace(oD.LogVerbosity.DEBUG, "server_call", A)
  }

  function nR5() {}

  function aR5(A) {
    return function (Q, B) {
      return pR5.deprecate(Q, A)
    }
  }

  function jF0(A) {
    return {
      code: oD.Status.UNIMPLEMENTED,
      details: `The server does not implement the method ${A}`
    }
  }

  function oR5(A, Q) {
    let B = jF0(Q);
    switch (A) {
      case "unary":
        return (G, Z) => {
          Z(B, null)
        };
      case "clientStream":
        return (G, Z) => {
          Z(B, null)
        };
      case "serverStream":
        return (G) => {
          G.emit("error", B)
        };
      case "bidi":
        return (G) => {
          G.emit("error", B)
        };
      default:
        throw Error(`Invalid handlerType ${A}`)
    }
  }
  var rR5 = (() => {
    var A;
    let Q = [],
      B;
    return A = class {
      constructor(Z) {
        var Y, J, X, I, D, W;
        if (this.boundPorts = (dR5(this, Q), new Map), this.http2Servers = new Map, this.sessionIdleTimeouts = new Map, this.handlers = new Map, this.sessions = new Map, this.started = !1, this.shutdown = !1, this.serverAddressString = "null", this.channelzEnabled = !0, this.options = Z !== null && Z !== void 0 ? Z : {}, this.options["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.channelzTrace = new XV.ChannelzTraceStub, this.callTracker = new XV.ChannelzCallTrackerStub, this.listenerChildrenTracker = new XV.ChannelzChildrenTrackerStub, this.sessionChildrenTracker = new XV.ChannelzChildrenTrackerStub;
        else this.channelzTrace = new XV.ChannelzTrace, this.callTracker = new XV.ChannelzCallTracker, this.listenerChildrenTracker = new XV.ChannelzChildrenTracker, this.sessionChildrenTracker = new XV.ChannelzChildrenTracker;
        if (this.channelzRef = (0, XV.registerChannelzServer)("server", () => this.getChannelzInfo(), this.channelzEnabled), this.channelzTrace.addTrace("CT_INFO", "Server created"), this.maxConnectionAgeMs = (Y = this.options["grpc.max_connection_age_ms"]) !== null && Y !== void 0 ? Y : kFA, this.maxConnectionAgeGraceMs = (J = this.options["grpc.max_connection_age_grace_ms"]) !== null && J !== void 0 ? J : kFA, this.keepaliveTimeMs = (X = this.options["grpc.keepalive_time_ms"]) !== null && X !== void 0 ? X : _F0, this.keepaliveTimeoutMs = (I = this.options["grpc.keepalive_timeout_ms"]) !== null && I !== void 0 ? I : lR5, this.sessionIdleTimeout = (D = this.options["grpc.max_connection_idle_ms"]) !== null && D !== void 0 ? D : $C2, this.commonServerOptions = {
            maxSendHeaderBlockLength: Number.MAX_SAFE_INTEGER
          }, "grpc-node.max_session_memory" in this.options) this.commonServerOptions.maxSessionMemory = this.options["grpc-node.max_session_memory"];
        else this.commonServerOptions.maxSessionMemory = Number.MAX_SAFE_INTEGER;
        if ("grpc.max_concurrent_streams" in this.options) this.commonServerOptions.settings = {
          maxConcurrentStreams: this.options["grpc.max_concurrent_streams"]
        };
        this.interceptors = (W = this.options.interceptors) !== null && W !== void 0 ? W : [], this.trace("Server constructed")
      }
      getChannelzInfo() {
        return {
          trace: this.channelzTrace,
          callTracker: this.callTracker,
          listenerChildren: this.listenerChildrenTracker.getChildLists(),
          sessionChildren: this.sessionChildrenTracker.getChildLists()
        }
      }
      getChannelzSessionInfo(Z) {
        var Y, J, X;
        let I = this.sessions.get(Z),
          D = Z.socket,
          W = D.remoteAddress ? (0, Es.stringToSubchannelAddress)(D.remoteAddress, D.remotePort) : null,
          K = D.localAddress ? (0, Es.stringToSubchannelAddress)(D.localAddress, D.localPort) : null,
          V;
        if (Z.encrypted) {
          let H = D,
            E = H.getCipher(),
            z = H.getCertificate(),
            $ = H.getPeerCertificate();
          V = {
            cipherSuiteStandardName: (Y = E.standardName) !== null && Y !== void 0 ? Y : null,
            cipherSuiteOtherName: E.standardName ? null : E.name,
            localCertificate: z && "raw" in z ? z.raw : null,
            remoteCertificate: $ && "raw" in $ ? $.raw : null
          }
        } else V = null;
        return {
          remoteAddress: W,
          localAddress: K,
          security: V,
          remoteName: null,
          streamsStarted: I.streamTracker.callsStarted,
          streamsSucceeded: I.streamTracker.callsSucceeded,
          streamsFailed: I.streamTracker.callsFailed,
          messagesSent: I.messagesSent,
          messagesReceived: I.messagesReceived,
          keepAlivesSent: I.keepAlivesSent,
          lastLocalStreamCreatedTimestamp: null,
          lastRemoteStreamCreatedTimestamp: I.streamTracker.lastCallStartedTimestamp,
          lastMessageSentTimestamp: I.lastMessageSentTimestamp,
          lastMessageReceivedTimestamp: I.lastMessageReceivedTimestamp,
          localFlowControlWindow: (J = Z.state.localWindowSize) !== null && J !== void 0 ? J : null,
          remoteFlowControlWindow: (X = Z.state.remoteWindowSize) !== null && X !== void 0 ? X : null
        }
      }
      trace(Z) {
        bFA.trace(oD.LogVerbosity.DEBUG, iR5, "(" + this.channelzRef.id + ") " + Z)
      }
      keepaliveTrace(Z) {
        bFA.trace(oD.LogVerbosity.DEBUG, "keepalive", "(" + this.channelzRef.id + ") " + Z)
      }
      addProtoService() {
        throw Error("Not implemented. Use addService() instead")
      }
      addService(Z, Y) {
        if (Z === null || typeof Z !== "object" || Y === null || typeof Y !== "object") throw Error("addService() requires two objects as arguments");
        let J = Object.keys(Z);
        if (J.length === 0) throw Error("Cannot add an empty service to a server");
        J.forEach((X) => {
          let I = Z[X],
            D;
          if (I.requestStream)
            if (I.responseStream) D = "bidi";
            else D = "clientStream";
          else if (I.responseStream) D = "serverStream";
          else D = "unary";
          let W = Y[X],
            K;
          if (W === void 0 && typeof I.originalName === "string") W = Y[I.originalName];
          if (W !== void 0) K = W.bind(Y);
          else K = oR5(D, X);
          if (this.register(I.path, K, I.responseSerialize, I.requestDeserialize, D) === !1) throw Error(`Method handler for ${I.path} already provided.`)
        })
      }
      removeService(Z) {
        if (Z === null || typeof Z !== "object") throw Error("removeService() requires object as argument");
        Object.keys(Z).forEach((J) => {
          let X = Z[J];
          this.unregister(X.path)
        })
      }
      bind(Z, Y) {
        throw Error("Not implemented. Use bindAsync() instead")
      }
      experimentalRegisterListenerToChannelz(Z) {
        return (0, XV.registerChannelzSocket)((0, Es.subchannelAddressToString)(Z), () => {
          return {
            localAddress: Z,
            remoteAddress: null,
            security: null,
            remoteName: null,
            streamsStarted: 0,
            streamsSucceeded: 0,
            streamsFailed: 0,
            messagesSent: 0,
            messagesReceived: 0,
            keepAlivesSent: 0,
            lastLocalStreamCreatedTimestamp: null,
            lastRemoteStreamCreatedTimestamp: null,
            lastMessageSentTimestamp: null,
            lastMessageReceivedTimestamp: null,
            localFlowControlWindow: null,
            remoteFlowControlWindow: null
          }
        }, this.channelzEnabled)
      }
      experimentalUnregisterListenerFromChannelz(Z) {
        (0, XV.unregisterChannelzRef)(Z)
      }
      createHttp2Server(Z) {
        let Y;
        if (Z._isSecure()) {
          let J = Z._getConstructorOptions(),
            X = Z._getSecureContextOptions(),
            I = Object.assign(Object.assign(Object.assign(Object.assign({}, this.commonServerOptions), J), X), {
              enableTrace: this.options["grpc-node.tls_enable_trace"] === 1
            }),
            D = X !== null;
          this.trace("Initial credentials valid: " + D), Y = uN.createSecureServer(I), Y.prependListener("connection", (K) => {
            if (!D) this.trace("Dropped connection from " + JSON.stringify(K.address()) + " due to unloaded credentials"), K.destroy()
          }), Y.on("secureConnection", (K) => {
            K.on("error", (V) => {
              this.trace("An incoming TLS connection closed with error: " + V.message)
            })
          });
          let W = (K) => {
            if (K) {
              let V = Y;
              try {
                V.setSecureContext(K)
              } catch (F) {
                bFA.log(oD.LogVerbosity.ERROR, "Failed to set secure context with error " + F.message), K = null
              }
            }
            D = K !== null, this.trace("Post-update credentials valid: " + D)
          };
          Z._addWatcher(W), Y.on("close", () => {
            Z._removeWatcher(W)
          })
        } else Y = uN.createServer(this.commonServerOptions);
        return Y.setTimeout(0, nR5), this._setupHandlers(Y, Z._getInterceptors()), Y
      }
      bindOneAddress(Z, Y) {
        this.trace("Attempting to bind " + (0, Es.subchannelAddressToString)(Z));
        let J = this.createHttp2Server(Y.credentials);
        return new Promise((X, I) => {
          let D = (W) => {
            this.trace("Failed to bind " + (0, Es.subchannelAddressToString)(Z) + " with error " + W.message), X({
              port: "port" in Z ? Z.port : 1,
              error: W.message
            })
          };
          J.once("error", D), J.listen(Z, () => {
            let W = J.address(),
              K;
            if (typeof W === "string") K = {
              path: W
            };
            else K = {
              host: W.address,
              port: W.port
            };
            let V = this.experimentalRegisterListenerToChannelz(K);
            this.listenerChildrenTracker.refChild(V), this.http2Servers.set(J, {
              channelzRef: V,
              sessions: new Set,
              ownsChannelzRef: !0
            }), Y.listeningServers.add(J), this.trace("Successfully bound " + (0, Es.subchannelAddressToString)(K)), X({
              port: "port" in K ? K.port : 1
            }), J.removeListener("error", D)
          })
        })
      }
      async bindManyPorts(Z, Y) {
        if (Z.length === 0) return {
          count: 0,
          port: 0,
          errors: []
        };
        if ((0, Es.isTcpSubchannelAddress)(Z[0]) && Z[0].port === 0) {
          let J = await this.bindOneAddress(Z[0], Y);
          if (J.error) {
            let X = await this.bindManyPorts(Z.slice(1), Y);
            return Object.assign(Object.assign({}, X), {
              errors: [J.error, ...X.errors]
            })
          } else {
            let X = Z.slice(1).map((W) => (0, Es.isTcpSubchannelAddress)(W) ? {
                host: W.host,
                port: J.port
              } : W),
              I = await Promise.all(X.map((W) => this.bindOneAddress(W, Y))),
              D = [J, ...I];
            return {
              count: D.filter((W) => W.error === void 0).length,
              port: J.port,
              errors: D.filter((W) => W.error).map((W) => W.error)
            }
          }
        } else {
          let J = await Promise.all(Z.map((X) => this.bindOneAddress(X, Y)));
          return {
            count: J.filter((X) => X.error === void 0).length,
            port: J[0].port,
            errors: J.filter((X) => X.error).map((X) => X.error)
          }
        }
      }
      async bindAddressList(Z, Y) {
        let J = await this.bindManyPorts(Z, Y);
        if (J.count > 0) {
          if (J.count < Z.length) bFA.log(oD.LogVerbosity.INFO, `WARNING Only ${J.count} addresses added out of total ${Z.length} resolved`);
          return J.port
        } else {
          let X = `No address added out of total ${Z.length} resolved`;
          throw bFA.log(oD.LogVerbosity.ERROR, X), Error(`${X} errors: [${J.errors.join(",")}]`)
        }
      }
      resolvePort(Z) {
        return new Promise((Y, J) => {
          let X = !1,
            I = (W, K, V, F) => {
              if (X) return !0;
              if (X = !0, !W.ok) return J(Error(W.error.details)), !0;
              let H = [].concat(...W.value.map((E) => E.addresses));
              if (H.length === 0) return J(Error(`No addresses resolved for port ${Z}`)), !0;
              return Y(H), !0
            };
          (0, EC2.createResolver)(Z, I, this.options).updateResolution()
        })
      }
      async bindPort(Z, Y) {
        let J = await this.resolvePort(Z);
        if (Y.cancelled) throw this.completeUnbind(Y), Error("bindAsync operation cancelled by unbind call");
        let X = await this.bindAddressList(J, Y);
        if (Y.cancelled) throw this.completeUnbind(Y), Error("bindAsync operation cancelled by unbind call");
        return X
      }
      normalizePort(Z) {
        let Y = (0, lS.parseUri)(Z);
        if (Y === null) throw Error(`Could not parse port "${Z}"`);
        let J = (0, EC2.mapUriDefaultScheme)(Y);
        if (J === null) throw Error(`Could not get a default scheme for port "${Z}"`);
        return J
      }
      bindAsync(Z, Y, J) {
        if (this.shutdown) throw Error("bindAsync called after shutdown");
        if (typeof Z !== "string") throw TypeError("port must be a string");
        if (Y === null || !(Y instanceof RF0.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
        if (typeof J !== "function") throw TypeError("callback must be a function");
        this.trace("bindAsync port=" + Z);
        let X = this.normalizePort(Z),
          I = (V, F) => {
            process.nextTick(() => J(V, F))
          },
          D = this.boundPorts.get((0, lS.uriToString)(X));
        if (D) {
          if (!Y._equals(D.credentials)) {
            I(Error(`${Z} already bound with incompatible credentials`), 0);
            return
          }
          if (D.cancelled = !1, D.completionPromise) D.completionPromise.then((V) => J(null, V), (V) => J(V, 0));
          else I(null, D.portNumber);
          return
        }
        D = {
          mapKey: (0, lS.uriToString)(X),
          originalUri: X,
          completionPromise: null,
          cancelled: !1,
          portNumber: 0,
          credentials: Y,
          listeningServers: new Set
        };
        let W = (0, lS.splitHostPort)(X.path),
          K = this.bindPort(X, D);
        if (D.completionPromise = K, (W === null || W === void 0 ? void 0 : W.port) === 0) K.then((V) => {
          let F = {
            scheme: X.scheme,
            authority: X.authority,
            path: (0, lS.combineHostPort)({
              host: W.host,
              port: V
            })
          };
          D.mapKey = (0, lS.uriToString)(F), D.completionPromise = null, D.portNumber = V, this.boundPorts.set(D.mapKey, D), J(null, V)
        }, (V) => {
          J(V, 0)
        });
        else this.boundPorts.set(D.mapKey, D), K.then((V) => {
          D.completionPromise = null, D.portNumber = V, J(null, V)
        }, (V) => {
          J(V, 0)
        })
      }
      registerInjectorToChannelz() {
        return (0, XV.registerChannelzSocket)("injector", () => {
          return {
            localAddress: null,
            remoteAddress: null,
            security: null,
            remoteName: null,
            streamsStarted: 0,
            streamsSucceeded: 0,
            streamsFailed: 0,
            messagesSent: 0,
            messagesReceived: 0,
            keepAlivesSent: 0,
            lastLocalStreamCreatedTimestamp: null,
            lastRemoteStreamCreatedTimestamp: null,
            lastMessageSentTimestamp: null,
            lastMessageReceivedTimestamp: null,
            localFlowControlWindow: null,
            remoteFlowControlWindow: null
          }
        }, this.channelzEnabled)
      }
      experimentalCreateConnectionInjectorWithChannelzRef(Z, Y, J = !1) {
        if (Z === null || !(Z instanceof RF0.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
        if (this.channelzEnabled) this.listenerChildrenTracker.refChild(Y);
        let X = this.createHttp2Server(Z),
          I = new Set;
        return this.http2Servers.set(X, {
          channelzRef: Y,
          sessions: I,
          ownsChannelzRef: J
        }), {
          injectConnection: (D) => {
            X.emit("connection", D)
          },
          drain: (D) => {
            var W, K;
            for (let V of I) this.closeSession(V);
            (K = (W = setTimeout(() => {
              for (let V of I) V.destroy(uN.constants.NGHTTP2_CANCEL)
            }, D)).unref) === null || K === void 0 || K.call(W)
          },
          destroy: () => {
            this.closeServer(X);
            for (let D of I) this.closeSession(D)
          }
        }
      }
      createConnectionInjector(Z) {
        if (Z === null || !(Z instanceof RF0.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
        let Y = this.registerInjectorToChannelz();
        return this.experimentalCreateConnectionInjectorWithChannelzRef(Z, Y, !0)
      }
      closeServer(Z, Y) {
        this.trace("Closing server with address " + JSON.stringify(Z.address()));
        let J = this.http2Servers.get(Z);
        Z.close(() => {
          if (J && J.ownsChannelzRef) this.listenerChildrenTracker.unrefChild(J.channelzRef), (0, XV.unregisterChannelzRef)(J.channelzRef);
          this.http2Servers.delete(Z), Y === null || Y === void 0 || Y()
        })
      }
      closeSession(Z, Y) {
        var J;
        this.trace("Closing session initiated by " + ((J = Z.socket) === null || J === void 0 ? void 0 : J.remoteAddress));
        let X = this.sessions.get(Z),
          I = () => {
            if (X) this.sessionChildrenTracker.unrefChild(X.ref), (0, XV.unregisterChannelzRef)(X.ref);
            Y === null || Y === void 0 || Y()
          };
        if (Z.closed) queueMicrotask(I);
        else Z.close(I)
      }
      completeUnbind(Z) {
        for (let Y of Z.listeningServers) {
          let J = this.http2Servers.get(Y);
          if (this.closeServer(Y, () => {
              Z.listeningServers.delete(Y)
            }), J)
            for (let X of J.sessions) this.closeSession(X)
        }
        this.boundPorts.delete(Z.mapKey)
      }
      unbind(Z) {
        this.trace("unbind port=" + Z);
        let Y = this.normalizePort(Z),
          J = (0, lS.splitHostPort)(Y.path);
        if ((J === null || J === void 0 ? void 0 : J.port) === 0) throw Error("Cannot unbind port 0");
        let X = this.boundPorts.get((0, lS.uriToString)(Y));
        if (X)
          if (this.trace("unbinding " + X.mapKey + " originally bound as " + (0, lS.uriToString)(X.originalUri)), X.completionPromise) X.cancelled = !0;
          else this.completeUnbind(X)
      }
      drain(Z, Y) {
        var J, X;
        this.trace("drain port=" + Z + " graceTimeMs=" + Y);
        let I = this.normalizePort(Z),
          D = (0, lS.splitHostPort)(I.path);
        if ((D === null || D === void 0 ? void 0 : D.port) === 0) throw Error("Cannot drain port 0");
        let W = this.boundPorts.get((0, lS.uriToString)(I));
        if (!W) return;
        let K = new Set;
        for (let V of W.listeningServers) {
          let F = this.http2Servers.get(V);
          if (F)
            for (let H of F.sessions) K.add(H), this.closeSession(H, () => {
              K.delete(H)
            })
        }(X = (J = setTimeout(() => {
          for (let V of K) V.destroy(uN.constants.NGHTTP2_CANCEL)
        }, Y)).unref) === null || X === void 0 || X.call(J)
      }
      forceShutdown() {
        for (let Z of this.boundPorts.values()) Z.cancelled = !0;
        this.boundPorts.clear();
        for (let Z of this.http2Servers.keys()) this.closeServer(Z);
        this.sessions.forEach((Z, Y) => {
          this.closeSession(Y), Y.destroy(uN.constants.NGHTTP2_CANCEL)
        }), this.sessions.clear(), (0, XV.unregisterChannelzRef)(this.channelzRef), this.shutdown = !0
      }
      register(Z, Y, J, X, I) {
        if (this.handlers.has(Z)) return !1;
        return this.handlers.set(Z, {
          func: Y,
          serialize: J,
          deserialize: X,
          type: I,
          path: Z
        }), !0
      }
      unregister(Z) {
        return this.handlers.delete(Z)
      }
      start() {
        if (this.http2Servers.size === 0 || [...this.http2Servers.keys()].every((Z) => !Z.listening)) throw Error("server must be bound in order to start");
        if (this.started === !0) throw Error("server is already started");
        this.started = !0
      }
      tryShutdown(Z) {
        var Y;
        let J = (D) => {
            (0, XV.unregisterChannelzRef)(this.channelzRef), Z(D)
          },
          X = 0;

        function I() {
          if (X--, X === 0) J()
        }
        this.shutdown = !0;
        for (let [D, W] of this.http2Servers.entries()) {
          X++;
          let K = W.channelzRef.name;
          this.trace("Waiting for server " + K + " to close"), this.closeServer(D, () => {
            this.trace("Server " + K + " finished closing"), I()
          });
          for (let V of W.sessions.keys()) {
            X++;
            let F = (Y = V.socket) === null || Y === void 0 ? void 0 : Y.remoteAddress;
            this.trace("Waiting for session " + F + " to close"), this.closeSession(V, () => {
              this.trace("Session " + F + " finished closing"), I()
            })
          }
        }
        if (X === 0) J()
      }
      addHttp2Port() {
        throw Error("Not yet implemented")
      }
      getChannelzRef() {
        return this.channelzRef
      }
      _verifyContentType(Z, Y) {
        let J = Y[uN.constants.HTTP2_HEADER_CONTENT_TYPE];
        if (typeof J !== "string" || !J.startsWith("application/grpc")) return Z.respond({
          [uN.constants.HTTP2_HEADER_STATUS]: uN.constants.HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE
        }, {
          endStream: !0
        }), !1;
        return !0
      }
      _retrieveHandler(Z) {
        qC2("Received call to method " + Z + " at address " + this.serverAddressString);
        let Y = this.handlers.get(Z);
        if (Y === void 0) return qC2("No handler registered for method " + Z + ". Sending UNIMPLEMENTED status."), null;
        return Y
      }
      _respondWithError(Z, Y, J = null) {
        var X, I;
        let D = Object.assign({
          "grpc-status": (X = Z.code) !== null && X !== void 0 ? X : oD.Status.INTERNAL,
          "grpc-message": Z.details,
          [uN.constants.HTTP2_HEADER_STATUS]: uN.constants.HTTP_STATUS_OK,
          [uN.constants.HTTP2_HEADER_CONTENT_TYPE]: "application/grpc+proto"
        }, (I = Z.metadata) === null || I === void 0 ? void 0 : I.toHttp2Headers());
        Y.respond(D, {
          endStream: !0
        }), this.callTracker.addCallFailed(), J === null || J === void 0 || J.streamTracker.addCallFailed()
      }
      _channelzHandler(Z, Y, J) {
        this.onStreamOpened(Y);
        let X = this.sessions.get(Y.session);
        if (this.callTracker.addCallStarted(), X === null || X === void 0 || X.streamTracker.addCallStarted(), !this._verifyContentType(Y, J)) {
          this.callTracker.addCallFailed(), X === null || X === void 0 || X.streamTracker.addCallFailed();
          return
        }
        let I = J[CC2],
          D = this._retrieveHandler(I);
        if (!D) {
          this._respondWithError(jF0(I), Y, X);
          return
        }
        let W = {
            addMessageSent: () => {
              if (X) X.messagesSent += 1, X.lastMessageSentTimestamp = new Date
            },
            addMessageReceived: () => {
              if (X) X.messagesReceived += 1, X.lastMessageReceivedTimestamp = new Date
            },
            onCallEnd: (V) => {
              if (V.code === oD.Status.OK) this.callTracker.addCallSucceeded();
              else this.callTracker.addCallFailed()
            },
            onStreamEnd: (V) => {
              if (X)
                if (V) X.streamTracker.addCallSucceeded();
                else X.streamTracker.addCallFailed()
            }
          },
          K = (0, zC2.getServerInterceptingCall)([...Z, ...this.interceptors], Y, J, W, D, this.options);
        if (!this._runHandlerForCall(K, D)) this.callTracker.addCallFailed(), X === null || X === void 0 || X.streamTracker.addCallFailed(), K.sendStatus({
          code: oD.Status.INTERNAL,
          details: `Unknown handler type: ${D.type}`
        })
      }
      _streamHandler(Z, Y, J) {
        if (this.onStreamOpened(Y), this._verifyContentType(Y, J) !== !0) return;
        let X = J[CC2],
          I = this._retrieveHandler(X);
        if (!I) {
          this._respondWithError(jF0(X), Y, null);
          return
        }
        let D = (0, zC2.getServerInterceptingCall)([...Z, ...this.interceptors], Y, J, null, I, this.options);
        if (!this._runHandlerForCall(D, I)) D.sendStatus({
          code: oD.Status.INTERNAL,
          details: `Unknown handler type: ${I.type}`
        })
      }
      _runHandlerForCall(Z, Y) {
        let {
          type: J
        } = Y;
        if (J === "unary") sR5(Z, Y);
        else if (J === "clientStream") tR5(Z, Y);
        else if (J === "serverStream") eR5(Z, Y);
        else if (J === "bidi") A_5(Z, Y);
        else return !1;
        return !0
      }
      _setupHandlers(Z, Y) {
        if (Z === null) return;
        let J = Z.address(),
          X = "null";
        if (J)
          if (typeof J === "string") X = J;
          else X = J.address + ":" + J.port;
        this.serverAddressString = X;
        let I = this.channelzEnabled ? this._channelzHandler : this._streamHandler,
          D = this.channelzEnabled ? this._channelzSessionHandler(Z) : this._sessionHandler(Z);
        Z.on("stream", I.bind(this, Y)), Z.on("session", D)
      }
      _sessionHandler(Z) {
        return (Y) => {
          var J, X;
          (J = this.http2Servers.get(Z)) === null || J === void 0 || J.sessions.add(Y);
          let I = null,
            D = null,
            W = null,
            K = !1,
            V = this.enableIdleTimeout(Y);
          if (this.maxConnectionAgeMs !== kFA) {
            let $ = this.maxConnectionAgeMs / 10,
              O = Math.random() * $ * 2 - $;
            I = setTimeout(() => {
              var L, M;
              K = !0, this.trace("Connection dropped by max connection age: " + ((L = Y.socket) === null || L === void 0 ? void 0 : L.remoteAddress));
              try {
                Y.goaway(uN.constants.NGHTTP2_NO_ERROR, 2147483647, UC2)
              } catch (_) {
                Y.destroy();
                return
              }
              if (Y.close(), this.maxConnectionAgeGraceMs !== kFA) D = setTimeout(() => {
                Y.destroy()
              }, this.maxConnectionAgeGraceMs), (M = D.unref) === null || M === void 0 || M.call(D)
            }, this.maxConnectionAgeMs + O), (X = I.unref) === null || X === void 0 || X.call(I)
          }
          let F = () => {
              if (W) clearTimeout(W), W = null
            },
            H = () => {
              return !Y.destroyed && this.keepaliveTimeMs < _F0 && this.keepaliveTimeMs > 0
            },
            E, z = () => {
              var $;
              if (!H()) return;
              this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), W = setTimeout(() => {
                F(), E()
              }, this.keepaliveTimeMs), ($ = W.unref) === null || $ === void 0 || $.call(W)
            };
          E = () => {
            var $;
            if (!H()) return;
            this.keepaliveTrace("Sending ping with timeout " + this.keepaliveTimeoutMs + "ms");
            let O = "";
            try {
              if (!Y.ping((M, _, j) => {
                  if (F(), M) this.keepaliveTrace("Ping failed with error: " + M.message), K = !0, Y.close();
                  else this.keepaliveTrace("Received ping response"), z()
                })) O = "Ping returned false"
            } catch (L) {
              O = (L instanceof Error ? L.message : "") || "Unknown error"
            }
            if (O) {
              this.keepaliveTrace("Ping send failed: " + O), this.trace("Connection dropped due to ping send error: " + O), K = !0, Y.close();
              return
            }
            W = setTimeout(() => {
              F(), this.keepaliveTrace("Ping timeout passed without response"), this.trace("Connection dropped by keepalive timeout"), K = !0, Y.close()
            }, this.keepaliveTimeoutMs), ($ = W.unref) === null || $ === void 0 || $.call(W)
          }, z(), Y.on("close", () => {
            var $, O;
            if (!K) this.trace(`Connection dropped by client ${($=Y.socket)===null||$===void 0?void 0:$.remoteAddress}`);
            if (I) clearTimeout(I);
            if (D) clearTimeout(D);
            if (F(), V !== null) clearTimeout(V.timeout), this.sessionIdleTimeouts.delete(Y);
            (O = this.http2Servers.get(Z)) === null || O === void 0 || O.sessions.delete(Y)
          })
        }
      }
      _channelzSessionHandler(Z) {
        return (Y) => {
          var J, X, I, D;
          let W = (0, XV.registerChannelzSocket)((X = (J = Y.socket) === null || J === void 0 ? void 0 : J.remoteAddress) !== null && X !== void 0 ? X : "unknown", this.getChannelzSessionInfo.bind(this, Y), this.channelzEnabled),
            K = {
              ref: W,
              streamTracker: new XV.ChannelzCallTracker,
              messagesSent: 0,
              messagesReceived: 0,
              keepAlivesSent: 0,
              lastMessageSentTimestamp: null,
              lastMessageReceivedTimestamp: null
            };
          (I = this.http2Servers.get(Z)) === null || I === void 0 || I.sessions.add(Y), this.sessions.set(Y, K);
          let V = `${Y.socket.remoteAddress}:${Y.socket.remotePort}`;
          this.channelzTrace.addTrace("CT_INFO", "Connection established by client " + V), this.trace("Connection established by client " + V), this.sessionChildrenTracker.refChild(W);
          let F = null,
            H = null,
            E = null,
            z = !1,
            $ = this.enableIdleTimeout(Y);
          if (this.maxConnectionAgeMs !== kFA) {
            let j = this.maxConnectionAgeMs / 10,
              x = Math.random() * j * 2 - j;
            F = setTimeout(() => {
              var b;
              z = !0, this.channelzTrace.addTrace("CT_INFO", "Connection dropped by max connection age from " + V);
              try {
                Y.goaway(uN.constants.NGHTTP2_NO_ERROR, 2147483647, UC2)
              } catch (S) {
                Y.destroy();
                return
              }
              if (Y.close(), this.maxConnectionAgeGraceMs !== kFA) H = setTimeout(() => {
                Y.destroy()
              }, this.maxConnectionAgeGraceMs), (b = H.unref) === null || b === void 0 || b.call(H)
            }, this.maxConnectionAgeMs + x), (D = F.unref) === null || D === void 0 || D.call(F)
          }
          let O = () => {
              if (E) clearTimeout(E), E = null
            },
            L = () => {
              return !Y.destroyed && this.keepaliveTimeMs < _F0 && this.keepaliveTimeMs > 0
            },
            M, _ = () => {
              var j;
              if (!L()) return;
              this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), E = setTimeout(() => {
                O(), M()
              }, this.keepaliveTimeMs), (j = E.unref) === null || j === void 0 || j.call(E)
            };
          M = () => {
            var j;
            if (!L()) return;
            this.keepaliveTrace("Sending ping with timeout " + this.keepaliveTimeoutMs + "ms");
            let x = "";
            try {
              if (!Y.ping((S, u, f) => {
                  if (O(), S) this.keepaliveTrace("Ping failed with error: " + S.message), this.channelzTrace.addTrace("CT_INFO", "Connection dropped due to error of a ping frame " + S.message + " return in " + u), z = !0, Y.close();
                  else this.keepaliveTrace("Received ping response"), _()
                })) x = "Ping returned false"
            } catch (b) {
              x = (b instanceof Error ? b.message : "") || "Unknown error"
            }
            if (x) {
              this.keepaliveTrace("Ping send failed: " + x), this.channelzTrace.addTrace("CT_INFO", "Connection dropped due to ping send error: " + x), z = !0, Y.close();
              return
            }
            K.keepAlivesSent += 1, E = setTimeout(() => {
              O(), this.keepaliveTrace("Ping timeout passed without response"), this.channelzTrace.addTrace("CT_INFO", "Connection dropped by keepalive timeout from " + V), z = !0, Y.close()
            }, this.keepaliveTimeoutMs), (j = E.unref) === null || j === void 0 || j.call(E)
          }, _(), Y.on("close", () => {
            var j;
            if (!z) this.channelzTrace.addTrace("CT_INFO", "Connection dropped by client " + V);
            if (this.sessionChildrenTracker.unrefChild(W), (0, XV.unregisterChannelzRef)(W), F) clearTimeout(F);
            if (H) clearTimeout(H);
            if (O(), $ !== null) clearTimeout($.timeout), this.sessionIdleTimeouts.delete(Y);
            (j = this.http2Servers.get(Z)) === null || j === void 0 || j.sessions.delete(Y), this.sessions.delete(Y)
          })
        }
      }
      enableIdleTimeout(Z) {
        var Y, J;
        if (this.sessionIdleTimeout >= $C2) return null;
        let X = {
          activeStreams: 0,
          lastIdle: Date.now(),
          onClose: this.onStreamClose.bind(this, Z),
          timeout: setTimeout(this.onIdleTimeout, this.sessionIdleTimeout, this, Z)
        };
        (J = (Y = X.timeout).unref) === null || J === void 0 || J.call(Y), this.sessionIdleTimeouts.set(Z, X);
        let {
          socket: I
        } = Z;
        return this.trace("Enable idle timeout for " + I.remoteAddress + ":" + I.remotePort), X
      }
      onIdleTimeout(Z, Y) {
        let {
          socket: J
        } = Y, X = Z.sessionIdleTimeouts.get(Y);
        if (X !== void 0 && X.activeStreams === 0)
          if (Date.now() - X.lastIdle >= Z.sessionIdleTimeout) Z.trace("Session idle timeout triggered for " + (J === null || J === void 0 ? void 0 : J.remoteAddress) + ":" + (J === null || J === void 0 ? void 0 : J.remotePort) + " last idle at " + X.lastIdle), Z.closeSession(Y);
          else X.timeout.refresh()
      }
      onStreamOpened(Z) {
        let Y = Z.session,
          J = this.sessionIdleTimeouts.get(Y);
        if (J) J.activeStreams += 1, Z.once("close", J.onClose)
      }
      onStreamClose(Z) {
        var Y, J;
        let X = this.sessionIdleTimeouts.get(Z);
        if (X) {
          if (X.activeStreams -= 1, X.activeStreams === 0) X.lastIdle = Date.now(), X.timeout.refresh(), this.trace("Session onStreamClose" + ((Y = Z.socket) === null || Y === void 0 ? void 0 : Y.remoteAddress) + ":" + ((J = Z.socket) === null || J === void 0 ? void 0 : J.remotePort) + " at " + X.lastIdle)
        }
      }
    }, (() => {
      let G = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
      if (B = [aR5("Calling start() is no longer necessary. It can be safely omitted.")], cR5(A, null, B, {
          kind: "method",
          name: "start",
          static: !1,
          private: !1,
          access: {
            has: (Z) => ("start" in Z),
            get: (Z) => Z.start
          },
          metadata: G
        }, null, Q), G) Object.defineProperty(A, Symbol.metadata, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: G
      })
    })(), A
  })();
  zs.Server = rR5;
  async function sR5(A, Q) {
    let B;

    function G(J, X, I, D) {
      if (J) {
        A.sendStatus((0, fFA.serverErrorToStatus)(J, I));
        return
      }
      A.sendMessage(X, () => {
        A.sendStatus({
          code: oD.Status.OK,
          details: "OK",
          metadata: I !== null && I !== void 0 ? I : null
        })
      })
    }
    let Z, Y = null;
    A.start({
      onReceiveMetadata(J) {
        Z = J, A.startRead()
      },
      onReceiveMessage(J) {
        if (Y) {
          A.sendStatus({
            code: oD.Status.UNIMPLEMENTED,
            details: `Received a second request message for server streaming method ${Q.path}`,
            metadata: null
          });
          return
        }
        Y = J, A.startRead()
      },
      onReceiveHalfClose() {
        if (!Y) {
          A.sendStatus({
            code: oD.Status.UNIMPLEMENTED,
            details: `Received no request message for server streaming method ${Q.path}`,
            metadata: null
          });
          return
        }
        B = new fFA.ServerWritableStreamImpl(Q.path, A, Z, Y);
        try {
          Q.func(B, G)
        } catch (J) {
          A.sendStatus({
            code: oD.Status.UNKNOWN,
            details: `Server method handler threw error ${J.message}`,
            metadata: null
          })
        }
      },
      onCancel() {
        if (B) B.cancelled = !0, B.emit("cancelled", "cancelled")
      }
    })
  }

  function tR5(A, Q) {
    let B;

    function G(Z, Y, J, X) {
      if (Z) {
        A.sendStatus((0, fFA.serverErrorToStatus)(Z, J));
        return
      }
      A.sendMessage(Y, () => {
        A.sendStatus({
          code: oD.Status.OK,
          details: "OK",
          metadata: J !== null && J !== void 0 ? J : null
        })
      })
    }
    A.start({
      onReceiveMetadata(Z) {
        B = new fFA.ServerDuplexStreamImpl(Q.path, A, Z);
        try {
          Q.func(B, G)
        } catch (Y) {
          A.sendStatus({
            code: oD.Status.UNKNOWN,
            details: `Server method handler threw error ${Y.message}`,
            metadata: null
          })
        }
      },
      onReceiveMessage(Z) {
        B.push(Z)
      },
      onReceiveHalfClose() {
        B.push(null)
      },
      onCancel() {
        if (B) B.cancelled = !0, B.emit("cancelled", "cancelled"), B.destroy()
      }
    })
  }

  function eR5(A, Q) {
    let B, G, Z = null;
    A.start({
      onReceiveMetadata(Y) {
        G = Y, A.startRead()
      },
      onReceiveMessage(Y) {
        if (Z) {
          A.sendStatus({
            code: oD.Status.UNIMPLEMENTED,
            details: `Received a second request message for server streaming method ${Q.path}`,
            metadata: null
          });
          return
        }
        Z = Y, A.startRead()
      },
      onReceiveHalfClose() {
        if (!Z) {
          A.sendStatus({
            code: oD.Status.UNIMPLEMENTED,
            details: `Received no request message for server streaming method ${Q.path}`,
            metadata: null
          });
          return
        }
        B = new fFA.ServerWritableStreamImpl(Q.path, A, G, Z);
        try {
          Q.func(B)
        } catch (Y) {
          A.sendStatus({
            code: oD.Status.UNKNOWN,
            details: `Server method handler threw error ${Y.message}`,
            metadata: null
          })
        }
      },
      onCancel() {
        if (B) B.cancelled = !0, B.emit("cancelled", "cancelled"), B.destroy()
      }
    })
  }

  function A_5(A, Q) {
    let B;
    A.start({
      onReceiveMetadata(G) {
        B = new fFA.ServerDuplexStreamImpl(Q.path, A, G);
        try {
          Q.func(B)
        } catch (Z) {
          A.sendStatus({
            code: oD.Status.UNKNOWN,
            details: `Server method handler threw error ${Z.message}`,
            metadata: null
          })
        }
      },
      onReceiveMessage(G) {
        B.push(G)
      },
      onReceiveHalfClose() {
        B.push(null)
      },
      onCancel() {
        if (B) B.cancelled = !0, B.emit("cancelled", "cancelled"), B.destroy()
      }
    })
  }
})
// @from(Ln 304587, Col 4)
MC2 = U((LC2) => {
  Object.defineProperty(LC2, "__esModule", {
    value: !0
  });
  LC2.StatusBuilder = void 0;
  class wC2 {
    constructor() {
      this.code = null, this.details = null, this.metadata = null
    }
    withCode(A) {
      return this.code = A, this
    }
    withDetails(A) {
      return this.details = A, this
    }
    withMetadata(A) {
      return this.metadata = A, this
    }
    build() {
      let A = {};
      if (this.code !== null) A.code = this.code;
      if (this.details !== null) A.details = this.details;
      if (this.metadata !== null) A.metadata = this.metadata;
      return A
    }
  }
  LC2.StatusBuilder = wC2
})
// @from(Ln 304615, Col 4)
pvA = U((yC2) => {
  Object.defineProperty(yC2, "__esModule", {
    value: !0
  });
  yC2.LeafLoadBalancer = yC2.PickFirstLoadBalancer = yC2.PickFirstLoadBalancingConfig = void 0;
  yC2.shuffled = PC2;
  yC2.setup = I_5;
  var TF0 = Ys(),
    rD = XU(),
    $s = dd(),
    RC2 = hN(),
    Q_5 = WY(),
    B_5 = j8(),
    _C2 = hN(),
    jC2 = NA("net"),
    G_5 = r4A(),
    Z_5 = "pick_first";

  function dvA(A) {
    Q_5.trace(B_5.LogVerbosity.DEBUG, Z_5, A)
  }
  var cvA = "pick_first",
    Y_5 = 250;
  class hFA {
    constructor(A) {
      this.shuffleAddressList = A
    }
    getLoadBalancerName() {
      return cvA
    }
    toJsonObject() {
      return {
        [cvA]: {
          shuffleAddressList: this.shuffleAddressList
        }
      }
    }
    getShuffleAddressList() {
      return this.shuffleAddressList
    }
    static createFromJson(A) {
      if ("shuffleAddressList" in A && typeof A.shuffleAddressList !== "boolean") throw Error("pick_first config field shuffleAddressList must be a boolean if provided");
      return new hFA(A.shuffleAddressList === !0)
    }
  }
  yC2.PickFirstLoadBalancingConfig = hFA;
  class TC2 {
    constructor(A) {
      this.subchannel = A
    }
    pick(A) {
      return {
        pickResultType: $s.PickResultType.COMPLETE,
        subchannel: this.subchannel,
        status: null,
        onCallStarted: null,
        onCallEnded: null
      }
    }
  }

  function PC2(A) {
    let Q = A.slice();
    for (let B = Q.length - 1; B > 1; B--) {
      let G = Math.floor(Math.random() * (B + 1)),
        Z = Q[B];
      Q[B] = Q[G], Q[G] = Z
    }
    return Q
  }

  function J_5(A) {
    if (A.length === 0) return [];
    let Q = [],
      B = [],
      G = [],
      Z = (0, _C2.isTcpSubchannelAddress)(A[0]) && (0, jC2.isIPv6)(A[0].host);
    for (let X of A)
      if ((0, _C2.isTcpSubchannelAddress)(X) && (0, jC2.isIPv6)(X.host)) B.push(X);
      else G.push(X);
    let Y = Z ? B : G,
      J = Z ? G : B;
    for (let X = 0; X < Math.max(Y.length, J.length); X++) {
      if (X < Y.length) Q.push(Y[X]);
      if (X < J.length) Q.push(J[X])
    }
    return Q
  }
  var SC2 = "grpc-node.internal.pick-first.report_health_status";
  class lX1 {
    constructor(A) {
      this.channelControlHelper = A, this.children = [], this.currentState = rD.ConnectivityState.IDLE, this.currentSubchannelIndex = 0, this.currentPick = null, this.subchannelStateListener = (Q, B, G, Z, Y) => {
        this.onSubchannelStateUpdate(Q, B, G, Y)
      }, this.pickedSubchannelHealthListener = () => this.calculateAndReportNewState(), this.stickyTransientFailureMode = !1, this.reportHealthStatus = !1, this.lastError = null, this.latestAddressList = null, this.latestOptions = {}, this.latestResolutionNote = "", this.connectionDelayTimeout = setTimeout(() => {}, 0), clearTimeout(this.connectionDelayTimeout)
    }
    allChildrenHaveReportedTF() {
      return this.children.every((A) => A.hasReportedTransientFailure)
    }
    resetChildrenReportedTF() {
      this.children.every((A) => A.hasReportedTransientFailure = !1)
    }
    calculateAndReportNewState() {
      var A;
      if (this.currentPick)
        if (this.reportHealthStatus && !this.currentPick.isHealthy()) {
          let Q = `Picked subchannel ${this.currentPick.getAddress()} is unhealthy`;
          this.updateState(rD.ConnectivityState.TRANSIENT_FAILURE, new $s.UnavailablePicker({
            details: Q
          }), Q)
        } else this.updateState(rD.ConnectivityState.READY, new TC2(this.currentPick), null);
      else if (((A = this.latestAddressList) === null || A === void 0 ? void 0 : A.length) === 0) {
        let Q = `No connection established. Last error: ${this.lastError}. Resolution note: ${this.latestResolutionNote}`;
        this.updateState(rD.ConnectivityState.TRANSIENT_FAILURE, new $s.UnavailablePicker({
          details: Q
        }), Q)
      } else if (this.children.length === 0) this.updateState(rD.ConnectivityState.IDLE, new $s.QueuePicker(this), null);
      else if (this.stickyTransientFailureMode) {
        let Q = `No connection established. Last error: ${this.lastError}. Resolution note: ${this.latestResolutionNote}`;
        this.updateState(rD.ConnectivityState.TRANSIENT_FAILURE, new $s.UnavailablePicker({
          details: Q
        }), Q)
      } else this.updateState(rD.ConnectivityState.CONNECTING, new $s.QueuePicker(this), null)
    }
    requestReresolution() {
      this.channelControlHelper.requestReresolution()
    }
    maybeEnterStickyTransientFailureMode() {
      if (!this.allChildrenHaveReportedTF()) return;
      if (this.requestReresolution(), this.resetChildrenReportedTF(), this.stickyTransientFailureMode) {
        this.calculateAndReportNewState();
        return
      }
      this.stickyTransientFailureMode = !0;
      for (let {
          subchannel: A
        }
        of this.children) A.startConnecting();
      this.calculateAndReportNewState()
    }
    removeCurrentPick() {
      if (this.currentPick !== null) this.currentPick.removeConnectivityStateListener(this.subchannelStateListener), this.channelControlHelper.removeChannelzChild(this.currentPick.getChannelzRef()), this.currentPick.removeHealthStateWatcher(this.pickedSubchannelHealthListener), this.currentPick.unref(), this.currentPick = null
    }
    onSubchannelStateUpdate(A, Q, B, G) {
      var Z;
      if ((Z = this.currentPick) === null || Z === void 0 ? void 0 : Z.realSubchannelEquals(A)) {
        if (B !== rD.ConnectivityState.READY) this.removeCurrentPick(), this.calculateAndReportNewState();
        return
      }
      for (let [Y, J] of this.children.entries())
        if (A.realSubchannelEquals(J.subchannel)) {
          if (B === rD.ConnectivityState.READY) this.pickSubchannel(J.subchannel);
          if (B === rD.ConnectivityState.TRANSIENT_FAILURE) {
            if (J.hasReportedTransientFailure = !0, G) this.lastError = G;
            if (this.maybeEnterStickyTransientFailureMode(), Y === this.currentSubchannelIndex) this.startNextSubchannelConnecting(Y + 1)
          }
          J.subchannel.startConnecting();
          return
        }
    }
    startNextSubchannelConnecting(A) {
      clearTimeout(this.connectionDelayTimeout);
      for (let [Q, B] of this.children.entries())
        if (Q >= A) {
          let G = B.subchannel.getConnectivityState();
          if (G === rD.ConnectivityState.IDLE || G === rD.ConnectivityState.CONNECTING) {
            this.startConnecting(Q);
            return
          }
        } this.maybeEnterStickyTransientFailureMode()
    }
    startConnecting(A) {
      var Q, B;
      if (clearTimeout(this.connectionDelayTimeout), this.currentSubchannelIndex = A, this.children[A].subchannel.getConnectivityState() === rD.ConnectivityState.IDLE) dvA("Start connecting to subchannel with address " + this.children[A].subchannel.getAddress()), process.nextTick(() => {
        var G;
        (G = this.children[A]) === null || G === void 0 || G.subchannel.startConnecting()
      });
      this.connectionDelayTimeout = setTimeout(() => {
        this.startNextSubchannelConnecting(A + 1)
      }, Y_5), (B = (Q = this.connectionDelayTimeout).unref) === null || B === void 0 || B.call(Q)
    }
    pickSubchannel(A) {
      dvA("Pick subchannel with address " + A.getAddress()), this.stickyTransientFailureMode = !1, A.ref(), this.channelControlHelper.addChannelzChild(A.getChannelzRef()), this.removeCurrentPick(), this.resetSubchannelList(), A.addConnectivityStateListener(this.subchannelStateListener), A.addHealthStateWatcher(this.pickedSubchannelHealthListener), this.currentPick = A, clearTimeout(this.connectionDelayTimeout), this.calculateAndReportNewState()
    }
    updateState(A, Q, B) {
      dvA(rD.ConnectivityState[this.currentState] + " -> " + rD.ConnectivityState[A]), this.currentState = A, this.channelControlHelper.updateState(A, Q, B)
    }
    resetSubchannelList() {
      for (let A of this.children) A.subchannel.removeConnectivityStateListener(this.subchannelStateListener), A.subchannel.unref(), this.channelControlHelper.removeChannelzChild(A.subchannel.getChannelzRef());
      this.currentSubchannelIndex = 0, this.children = []
    }
    connectToAddressList(A, Q) {
      dvA("connectToAddressList([" + A.map((G) => (0, RC2.subchannelAddressToString)(G)) + "])");
      let B = A.map((G) => ({
        subchannel: this.channelControlHelper.createSubchannel(G, Q),
        hasReportedTransientFailure: !1
      }));
      for (let {
          subchannel: G
        }
        of B)
        if (G.getConnectivityState() === rD.ConnectivityState.READY) {
          this.pickSubchannel(G);
          return
        } for (let {
          subchannel: G
        }
        of B) G.ref(), this.channelControlHelper.addChannelzChild(G.getChannelzRef());
      this.resetSubchannelList(), this.children = B;
      for (let {
          subchannel: G
        }
        of this.children) G.addConnectivityStateListener(this.subchannelStateListener);
      for (let G of this.children)
        if (G.subchannel.getConnectivityState() === rD.ConnectivityState.TRANSIENT_FAILURE) G.hasReportedTransientFailure = !0;
      this.startNextSubchannelConnecting(0), this.calculateAndReportNewState()
    }
    updateAddressList(A, Q, B, G) {
      if (!(Q instanceof hFA)) return !1;
      if (!A.ok) {
        if (this.children.length === 0 && this.currentPick === null) this.channelControlHelper.updateState(rD.ConnectivityState.TRANSIENT_FAILURE, new $s.UnavailablePicker(A.error), A.error.details);
        return !0
      }
      let Z = A.value;
      if (this.reportHealthStatus = B[SC2], Q.getShuffleAddressList()) Z = PC2(Z);
      let Y = [].concat(...Z.map((X) => X.addresses));
      dvA("updateAddressList([" + Y.map((X) => (0, RC2.subchannelAddressToString)(X)) + "])");
      let J = J_5(Y);
      if (this.latestAddressList = J, this.latestOptions = B, this.connectToAddressList(J, B), this.latestResolutionNote = G, Y.length > 0) return !0;
      else return this.lastError = "No addresses resolved", !1
    }
    exitIdle() {
      if (this.currentState === rD.ConnectivityState.IDLE && this.latestAddressList) this.connectToAddressList(this.latestAddressList, this.latestOptions)
    }
    resetBackoff() {}
    destroy() {
      this.resetSubchannelList(), this.removeCurrentPick()
    }
    getTypeName() {
      return cvA
    }
  }
  yC2.PickFirstLoadBalancer = lX1;
  var X_5 = new hFA(!1);
  class xC2 {
    constructor(A, Q, B, G) {
      this.endpoint = A, this.options = B, this.resolutionNote = G, this.latestState = rD.ConnectivityState.IDLE;
      let Z = (0, TF0.createChildChannelControlHelper)(Q, {
        updateState: (Y, J, X) => {
          this.latestState = Y, this.latestPicker = J, Q.updateState(Y, J, X)
        }
      });
      this.pickFirstBalancer = new lX1(Z), this.latestPicker = new $s.QueuePicker(this.pickFirstBalancer)
    }
    startConnecting() {
      this.pickFirstBalancer.updateAddressList((0, G_5.statusOrFromValue)([this.endpoint]), X_5, Object.assign(Object.assign({}, this.options), {
        [SC2]: !0
      }), this.resolutionNote)
    }
    updateEndpoint(A, Q) {
      if (this.options = Q, this.endpoint = A, this.latestState !== rD.ConnectivityState.IDLE) this.startConnecting()
    }
    getConnectivityState() {
      return this.latestState
    }
    getPicker() {
      return this.latestPicker
    }
    getEndpoint() {
      return this.endpoint
    }
    exitIdle() {
      this.pickFirstBalancer.exitIdle()
    }
    destroy() {
      this.pickFirstBalancer.destroy()
    }
  }
  yC2.LeafLoadBalancer = xC2;

  function I_5() {
    (0, TF0.registerLoadBalancerType)(cvA, lX1, hFA), (0, TF0.registerDefaultLoadBalancerType)(cvA)
  }
})
// @from(Ln 304898, Col 4)
hC2 = U((bC2) => {
  Object.defineProperty(bC2, "__esModule", {
    value: !0
  });
  bC2.FileWatcherCertificateProvider = void 0;
  var F_5 = NA("fs"),
    H_5 = WY(),
    E_5 = j8(),
    z_5 = NA("util"),
    $_5 = "certificate_provider";

  function iX1(A) {
    H_5.trace(E_5.LogVerbosity.DEBUG, $_5, A)
  }
  var PF0 = (0, z_5.promisify)(F_5.readFile);
  class kC2 {
    constructor(A) {
      if (this.config = A, this.refreshTimer = null, this.fileResultPromise = null, this.latestCaUpdate = void 0, this.caListeners = new Set, this.latestIdentityUpdate = void 0, this.identityListeners = new Set, this.lastUpdateTime = null, A.certificateFile === void 0 !== (A.privateKeyFile === void 0)) throw Error("certificateFile and privateKeyFile must be set or unset together");
      if (A.certificateFile === void 0 && A.caCertificateFile === void 0) throw Error("At least one of certificateFile and caCertificateFile must be set");
      iX1("File watcher constructed with config " + JSON.stringify(A))
    }
    updateCertificates() {
      if (this.fileResultPromise) return;
      this.fileResultPromise = Promise.allSettled([this.config.certificateFile ? PF0(this.config.certificateFile) : Promise.reject(), this.config.privateKeyFile ? PF0(this.config.privateKeyFile) : Promise.reject(), this.config.caCertificateFile ? PF0(this.config.caCertificateFile) : Promise.reject()]), this.fileResultPromise.then(([A, Q, B]) => {
        if (!this.refreshTimer) return;
        if (iX1("File watcher read certificates certificate " + A.status + ", privateKey " + Q.status + ", CA certificate " + B.status), this.lastUpdateTime = new Date, this.fileResultPromise = null, A.status === "fulfilled" && Q.status === "fulfilled") this.latestIdentityUpdate = {
          certificate: A.value,
          privateKey: Q.value
        };
        else this.latestIdentityUpdate = null;
        if (B.status === "fulfilled") this.latestCaUpdate = {
          caCertificate: B.value
        };
        else this.latestCaUpdate = null;
        for (let G of this.identityListeners) G(this.latestIdentityUpdate);
        for (let G of this.caListeners) G(this.latestCaUpdate)
      }), iX1("File watcher initiated certificate update")
    }
    maybeStartWatchingFiles() {
      if (!this.refreshTimer) {
        let A = this.lastUpdateTime ? new Date().getTime() - this.lastUpdateTime.getTime() : 1 / 0;
        if (A > this.config.refreshIntervalMs) this.updateCertificates();
        if (A > this.config.refreshIntervalMs * 2) this.latestCaUpdate = void 0, this.latestIdentityUpdate = void 0;
        this.refreshTimer = setInterval(() => this.updateCertificates(), this.config.refreshIntervalMs), iX1("File watcher started watching")
      }
    }
    maybeStopWatchingFiles() {
      if (this.caListeners.size === 0 && this.identityListeners.size === 0) {
        if (this.fileResultPromise = null, this.refreshTimer) clearInterval(this.refreshTimer), this.refreshTimer = null
      }
    }
    addCaCertificateListener(A) {
      if (this.caListeners.add(A), this.maybeStartWatchingFiles(), this.latestCaUpdate !== void 0) process.nextTick(A, this.latestCaUpdate)
    }
    removeCaCertificateListener(A) {
      this.caListeners.delete(A), this.maybeStopWatchingFiles()
    }
    addIdentityCertificateListener(A) {
      if (this.identityListeners.add(A), this.maybeStartWatchingFiles(), this.latestIdentityUpdate !== void 0) process.nextTick(A, this.latestIdentityUpdate)
    }
    removeIdentityCertificateListener(A) {
      this.identityListeners.delete(A), this.maybeStopWatchingFiles()
    }
  }
  bC2.FileWatcherCertificateProvider = kC2
})
// @from(Ln 304964, Col 4)
yF0 = U((W5) => {
  Object.defineProperty(W5, "__esModule", {
    value: !0
  });
  W5.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = W5.createCertificateProviderChannelCredentials = W5.FileWatcherCertificateProvider = W5.createCertificateProviderServerCredentials = W5.createServerCredentialsWithInterceptors = W5.BaseSubchannelWrapper = W5.registerAdminService = W5.FilterStackFactory = W5.BaseFilter = W5.statusOrFromError = W5.statusOrFromValue = W5.PickResultType = W5.QueuePicker = W5.UnavailablePicker = W5.ChildLoadBalancerHandler = W5.EndpointMap = W5.endpointHasAddress = W5.endpointToString = W5.subchannelAddressToString = W5.LeafLoadBalancer = W5.isLoadBalancerNameRegistered = W5.parseLoadBalancingConfig = W5.selectLbConfigFromList = W5.registerLoadBalancerType = W5.createChildChannelControlHelper = W5.BackoffTimeout = W5.parseDuration = W5.durationToMs = W5.splitHostPort = W5.uriToString = W5.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = W5.createResolver = W5.registerResolver = W5.log = W5.trace = void 0;
  var gC2 = WY();
  Object.defineProperty(W5, "trace", {
    enumerable: !0,
    get: function () {
      return gC2.trace
    }
  });
  Object.defineProperty(W5, "log", {
    enumerable: !0,
    get: function () {
      return gC2.log
    }
  });
  var SF0 = gS();
  Object.defineProperty(W5, "registerResolver", {
    enumerable: !0,
    get: function () {
      return SF0.registerResolver
    }
  });
  Object.defineProperty(W5, "createResolver", {
    enumerable: !0,
    get: function () {
      return SF0.createResolver
    }
  });
  Object.defineProperty(W5, "CHANNEL_ARGS_CONFIG_SELECTOR_KEY", {
    enumerable: !0,
    get: function () {
      return SF0.CHANNEL_ARGS_CONFIG_SELECTOR_KEY
    }
  });
  var uC2 = JU();
  Object.defineProperty(W5, "uriToString", {
    enumerable: !0,
    get: function () {
      return uC2.uriToString
    }
  });
  Object.defineProperty(W5, "splitHostPort", {
    enumerable: !0,
    get: function () {
      return uC2.splitHostPort
    }
  });
  var mC2 = mvA();
  Object.defineProperty(W5, "durationToMs", {
    enumerable: !0,
    get: function () {
      return mC2.durationToMs
    }
  });
  Object.defineProperty(W5, "parseDuration", {
    enumerable: !0,
    get: function () {
      return mC2.parseDuration
    }
  });
  var C_5 = HFA();
  Object.defineProperty(W5, "BackoffTimeout", {
    enumerable: !0,
    get: function () {
      return C_5.BackoffTimeout
    }
  });
  var lvA = Ys();
  Object.defineProperty(W5, "createChildChannelControlHelper", {
    enumerable: !0,
    get: function () {
      return lvA.createChildChannelControlHelper
    }
  });
  Object.defineProperty(W5, "registerLoadBalancerType", {
    enumerable: !0,
    get: function () {
      return lvA.registerLoadBalancerType
    }
  });
  Object.defineProperty(W5, "selectLbConfigFromList", {
    enumerable: !0,
    get: function () {
      return lvA.selectLbConfigFromList
    }
  });
  Object.defineProperty(W5, "parseLoadBalancingConfig", {
    enumerable: !0,
    get: function () {
      return lvA.parseLoadBalancingConfig
    }
  });
  Object.defineProperty(W5, "isLoadBalancerNameRegistered", {
    enumerable: !0,
    get: function () {
      return lvA.isLoadBalancerNameRegistered
    }
  });
  var U_5 = pvA();
  Object.defineProperty(W5, "LeafLoadBalancer", {
    enumerable: !0,
    get: function () {
      return U_5.LeafLoadBalancer
    }
  });
  var nX1 = hN();
  Object.defineProperty(W5, "subchannelAddressToString", {
    enumerable: !0,
    get: function () {
      return nX1.subchannelAddressToString
    }
  });
  Object.defineProperty(W5, "endpointToString", {
    enumerable: !0,
    get: function () {
      return nX1.endpointToString
    }
  });
  Object.defineProperty(W5, "endpointHasAddress", {
    enumerable: !0,
    get: function () {
      return nX1.endpointHasAddress
    }
  });
  Object.defineProperty(W5, "EndpointMap", {
    enumerable: !0,
    get: function () {
      return nX1.EndpointMap
    }
  });
  var q_5 = lJ1();
  Object.defineProperty(W5, "ChildLoadBalancerHandler", {
    enumerable: !0,
    get: function () {
      return q_5.ChildLoadBalancerHandler
    }
  });
  var xF0 = dd();
  Object.defineProperty(W5, "UnavailablePicker", {
    enumerable: !0,
    get: function () {
      return xF0.UnavailablePicker
    }
  });
  Object.defineProperty(W5, "QueuePicker", {
    enumerable: !0,
    get: function () {
      return xF0.QueuePicker
    }
  });
  Object.defineProperty(W5, "PickResultType", {
    enumerable: !0,
    get: function () {
      return xF0.PickResultType
    }
  });
  var dC2 = r4A();
  Object.defineProperty(W5, "statusOrFromValue", {
    enumerable: !0,
    get: function () {
      return dC2.statusOrFromValue
    }
  });
  Object.defineProperty(W5, "statusOrFromError", {
    enumerable: !0,
    get: function () {
      return dC2.statusOrFromError
    }
  });
  var N_5 = lV0();
  Object.defineProperty(W5, "BaseFilter", {
    enumerable: !0,
    get: function () {
      return N_5.BaseFilter
    }
  });
  var w_5 = RX1();
  Object.defineProperty(W5, "FilterStackFactory", {
    enumerable: !0,
    get: function () {
      return w_5.FilterStackFactory
    }
  });
  var L_5 = nJ1();
  Object.defineProperty(W5, "registerAdminService", {
    enumerable: !0,
    get: function () {
      return L_5.registerAdminService
    }
  });
  var O_5 = gvA();
  Object.defineProperty(W5, "BaseSubchannelWrapper", {
    enumerable: !0,
    get: function () {
      return O_5.BaseSubchannelWrapper
    }
  });
  var cC2 = gX1();
  Object.defineProperty(W5, "createServerCredentialsWithInterceptors", {
    enumerable: !0,
    get: function () {
      return cC2.createServerCredentialsWithInterceptors
    }
  });
  Object.defineProperty(W5, "createCertificateProviderServerCredentials", {
    enumerable: !0,
    get: function () {
      return cC2.createCertificateProviderServerCredentials
    }
  });
  var M_5 = hC2();
  Object.defineProperty(W5, "FileWatcherCertificateProvider", {
    enumerable: !0,
    get: function () {
      return M_5.FileWatcherCertificateProvider
    }
  });
  var R_5 = FFA();
  Object.defineProperty(W5, "createCertificateProviderChannelCredentials", {
    enumerable: !0,
    get: function () {
      return R_5.createCertificateProviderChannelCredentials
    }
  });
  var __5 = VF0();
  Object.defineProperty(W5, "SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX", {
    enumerable: !0,
    get: function () {
      return __5.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX
    }
  })
})
// @from(Ln 305199, Col 4)
iC2 = U((lC2) => {
  Object.defineProperty(lC2, "__esModule", {
    value: !0
  });
  lC2.setup = S_5;
  var T_5 = gS(),
    P_5 = r4A();
  class pC2 {
    constructor(A, Q, B) {
      this.listener = Q, this.hasReturnedResult = !1, this.endpoints = [];
      let G;
      if (A.authority === "") G = "/" + A.path;
      else G = A.path;
      this.endpoints = [{
        addresses: [{
          path: G
        }]
      }]
    }
    updateResolution() {
      if (!this.hasReturnedResult) this.hasReturnedResult = !0, process.nextTick(this.listener, (0, P_5.statusOrFromValue)(this.endpoints), {}, null, "")
    }
    destroy() {
      this.hasReturnedResult = !1
    }
    static getDefaultAuthority(A) {
      return "localhost"
    }
  }

  function S_5() {
    (0, T_5.registerResolver)("unix", pC2)
  }
})
// @from(Ln 305233, Col 4)
eC2 = U((tC2) => {
  Object.defineProperty(tC2, "__esModule", {
    value: !0
  });
  tC2.setup = f_5;
  var nC2 = NA("net"),
    aC2 = r4A(),
    aX1 = j8(),
    vF0 = jF(),
    oC2 = gS(),
    y_5 = hN(),
    rC2 = JU(),
    v_5 = WY(),
    k_5 = "ip_resolver";

  function sC2(A) {
    v_5.trace(aX1.LogVerbosity.DEBUG, k_5, A)
  }
  var kF0 = "ipv4",
    bF0 = "ipv6",
    b_5 = 443;
  class fF0 {
    constructor(A, Q, B) {
      var G;
      this.listener = Q, this.endpoints = [], this.error = null, this.hasReturnedResult = !1, sC2("Resolver constructed for target " + (0, rC2.uriToString)(A));
      let Z = [];
      if (!(A.scheme === kF0 || A.scheme === bF0)) {
        this.error = {
          code: aX1.Status.UNAVAILABLE,
          details: `Unrecognized scheme ${A.scheme} in IP resolver`,
          metadata: new vF0.Metadata
        };
        return
      }
      let Y = A.path.split(",");
      for (let J of Y) {
        let X = (0, rC2.splitHostPort)(J);
        if (X === null) {
          this.error = {
            code: aX1.Status.UNAVAILABLE,
            details: `Failed to parse ${A.scheme} address ${J}`,
            metadata: new vF0.Metadata
          };
          return
        }
        if (A.scheme === kF0 && !(0, nC2.isIPv4)(X.host) || A.scheme === bF0 && !(0, nC2.isIPv6)(X.host)) {
          this.error = {
            code: aX1.Status.UNAVAILABLE,
            details: `Failed to parse ${A.scheme} address ${J}`,
            metadata: new vF0.Metadata
          };
          return
        }
        Z.push({
          host: X.host,
          port: (G = X.port) !== null && G !== void 0 ? G : b_5
        })
      }
      this.endpoints = Z.map((J) => ({
        addresses: [J]
      })), sC2("Parsed " + A.scheme + " address list " + Z.map(y_5.subchannelAddressToString))
    }
    updateResolution() {
      if (!this.hasReturnedResult) this.hasReturnedResult = !0, process.nextTick(() => {
        if (this.error) this.listener((0, aC2.statusOrFromError)(this.error), {}, null, "");
        else this.listener((0, aC2.statusOrFromValue)(this.endpoints), {}, null, "")
      })
    }
    destroy() {
      this.hasReturnedResult = !1
    }
    static getDefaultAuthority(A) {
      return A.path.split(",")[0]
    }
  }

  function f_5() {
    (0, oC2.registerResolver)(kF0, fF0), (0, oC2.registerResolver)(bF0, fF0)
  }
})
// @from(Ln 305313, Col 4)
JU2 = U((ZU2) => {
  Object.defineProperty(ZU2, "__esModule", {
    value: !0
  });
  ZU2.RoundRobinLoadBalancer = void 0;
  ZU2.setup = p_5;
  var BU2 = Ys(),
    EE = XU(),
    ivA = dd(),
    g_5 = WY(),
    u_5 = j8(),
    AU2 = hN(),
    m_5 = pvA(),
    d_5 = "round_robin";

  function QU2(A) {
    g_5.trace(u_5.LogVerbosity.DEBUG, d_5, A)
  }
  var oX1 = "round_robin";
  class rX1 {
    getLoadBalancerName() {
      return oX1
    }
    constructor() {}
    toJsonObject() {
      return {
        [oX1]: {}
      }
    }
    static createFromJson(A) {
      return new rX1
    }
  }
  class GU2 {
    constructor(A, Q = 0) {
      this.children = A, this.nextIndex = Q
    }
    pick(A) {
      let Q = this.children[this.nextIndex].picker;
      return this.nextIndex = (this.nextIndex + 1) % this.children.length, Q.pick(A)
    }
    peekNextEndpoint() {
      return this.children[this.nextIndex].endpoint
    }
  }

  function c_5(A, Q) {
    return [...A.slice(Q), ...A.slice(0, Q)]
  }
  class hF0 {
    constructor(A) {
      this.channelControlHelper = A, this.children = [], this.currentState = EE.ConnectivityState.IDLE, this.currentReadyPicker = null, this.updatesPaused = !1, this.lastError = null, this.childChannelControlHelper = (0, BU2.createChildChannelControlHelper)(A, {
        updateState: (Q, B, G) => {
          if (this.currentState === EE.ConnectivityState.READY && Q !== EE.ConnectivityState.READY) this.channelControlHelper.requestReresolution();
          if (G) this.lastError = G;
          this.calculateAndUpdateState()
        }
      })
    }
    countChildrenWithState(A) {
      return this.children.filter((Q) => Q.getConnectivityState() === A).length
    }
    calculateAndUpdateState() {
      if (this.updatesPaused) return;
      if (this.countChildrenWithState(EE.ConnectivityState.READY) > 0) {
        let A = this.children.filter((B) => B.getConnectivityState() === EE.ConnectivityState.READY),
          Q = 0;
        if (this.currentReadyPicker !== null) {
          let B = this.currentReadyPicker.peekNextEndpoint();
          if (Q = A.findIndex((G) => (0, AU2.endpointEqual)(G.getEndpoint(), B)), Q < 0) Q = 0
        }
        this.updateState(EE.ConnectivityState.READY, new GU2(A.map((B) => ({
          endpoint: B.getEndpoint(),
          picker: B.getPicker()
        })), Q), null)
      } else if (this.countChildrenWithState(EE.ConnectivityState.CONNECTING) > 0) this.updateState(EE.ConnectivityState.CONNECTING, new ivA.QueuePicker(this), null);
      else if (this.countChildrenWithState(EE.ConnectivityState.TRANSIENT_FAILURE) > 0) {
        let A = `round_robin: No connection established. Last error: ${this.lastError}`;
        this.updateState(EE.ConnectivityState.TRANSIENT_FAILURE, new ivA.UnavailablePicker({
          details: A
        }), A)
      } else this.updateState(EE.ConnectivityState.IDLE, new ivA.QueuePicker(this), null);
      for (let A of this.children)
        if (A.getConnectivityState() === EE.ConnectivityState.IDLE) A.exitIdle()
    }
    updateState(A, Q, B) {
      if (QU2(EE.ConnectivityState[this.currentState] + " -> " + EE.ConnectivityState[A]), A === EE.ConnectivityState.READY) this.currentReadyPicker = Q;
      else this.currentReadyPicker = null;
      this.currentState = A, this.channelControlHelper.updateState(A, Q, B)
    }
    resetSubchannelList() {
      for (let A of this.children) A.destroy();
      this.children = []
    }
    updateAddressList(A, Q, B, G) {
      if (!(Q instanceof rX1)) return !1;
      if (!A.ok) {
        if (this.children.length === 0) this.updateState(EE.ConnectivityState.TRANSIENT_FAILURE, new ivA.UnavailablePicker(A.error), A.error.details);
        return !0
      }
      let Z = Math.random() * A.value.length | 0,
        Y = c_5(A.value, Z);
      if (this.resetSubchannelList(), Y.length === 0) {
        let J = `No addresses resolved. Resolution note: ${G}`;
        this.updateState(EE.ConnectivityState.TRANSIENT_FAILURE, new ivA.UnavailablePicker({
          details: J
        }), J)
      }
      QU2("Connect to endpoint list " + Y.map(AU2.endpointToString)), this.updatesPaused = !0, this.children = Y.map((J) => new m_5.LeafLoadBalancer(J, this.childChannelControlHelper, B, G));
      for (let J of this.children) J.startConnecting();
      return this.updatesPaused = !1, this.calculateAndUpdateState(), !0
    }
    exitIdle() {}
    resetBackoff() {}
    destroy() {
      this.resetSubchannelList()
    }
    getTypeName() {
      return oX1
    }
  }
  ZU2.RoundRobinLoadBalancer = hF0;

  function p_5() {
    (0, BU2.registerLoadBalancerType)(oX1, hF0, rX1)
  }
})