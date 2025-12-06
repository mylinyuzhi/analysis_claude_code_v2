
// @from(Start 10991944, End 11011737)
Q40 = z((Iw2) => {
  Object.defineProperty(Iw2, "__esModule", {
    value: !0
  });
  Iw2.BaseServerInterceptingCall = Iw2.ServerInterceptingCall = Iw2.ResponderBuilder = Iw2.ServerListenerBuilder = void 0;
  Iw2.isInterceptingServerListener = iS5;
  Iw2.getServerInterceptingCall = oS5;
  var k81 = YK(),
    A$ = E6(),
    qJA = UA("http2"),
    i$2 = q41(),
    n$2 = UA("zlib"),
    pS5 = y90(),
    t$2 = zZ(),
    lS5 = UA("tls"),
    a$2 = j81(),
    e$2 = "server_call";

  function J0A(A) {
    t$2.trace(A$.LogVerbosity.DEBUG, e$2, A)
  }
  class Aw2 {
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
  Iw2.ServerListenerBuilder = Aw2;

  function iS5(A) {
    return A.onReceiveMetadata !== void 0 && A.onReceiveMetadata.length === 1
  }
  class Qw2 {
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
  class Bw2 {
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
  Iw2.ResponderBuilder = Bw2;
  var S81 = {
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
    _81 = {
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
  class Gw2 {
    constructor(A, Q) {
      var B, G, Z, I;
      this.nextCall = A, this.processingMetadata = !1, this.sentMetadata = !1, this.processingMessage = !1, this.pendingMessage = null, this.pendingMessageCallback = null, this.pendingStatus = null, this.responder = {
        start: (B = Q === null || Q === void 0 ? void 0 : Q.start) !== null && B !== void 0 ? B : _81.start,
        sendMetadata: (G = Q === null || Q === void 0 ? void 0 : Q.sendMetadata) !== null && G !== void 0 ? G : _81.sendMetadata,
        sendMessage: (Z = Q === null || Q === void 0 ? void 0 : Q.sendMessage) !== null && Z !== void 0 ? Z : _81.sendMessage,
        sendStatus: (I = Q === null || Q === void 0 ? void 0 : Q.sendStatus) !== null && I !== void 0 ? I : _81.sendStatus
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
        var B, G, Z, I;
        let Y = {
            onReceiveMetadata: (B = Q === null || Q === void 0 ? void 0 : Q.onReceiveMetadata) !== null && B !== void 0 ? B : S81.onReceiveMetadata,
            onReceiveMessage: (G = Q === null || Q === void 0 ? void 0 : Q.onReceiveMessage) !== null && G !== void 0 ? G : S81.onReceiveMessage,
            onReceiveHalfClose: (Z = Q === null || Q === void 0 ? void 0 : Q.onReceiveHalfClose) !== null && Z !== void 0 ? Z : S81.onReceiveHalfClose,
            onCancel: (I = Q === null || Q === void 0 ? void 0 : Q.onCancel) !== null && I !== void 0 ? I : S81.onCancel
          },
          J = new Qw2(Y, A);
        this.nextCall.start(J)
      })
    }
    sendMetadata(A) {
      this.processingMetadata = !0, this.sentMetadata = !0, this.responder.sendMetadata(A, (Q) => {
        this.processingMetadata = !1, this.nextCall.sendMetadata(Q), this.processPendingMessage(), this.processPendingStatus()
      })
    }
    sendMessage(A, Q) {
      if (this.processingMessage = !0, !this.sentMetadata) this.sendMetadata(new k81.Metadata);
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
  Iw2.ServerInterceptingCall = Gw2;
  var Zw2 = "grpc-accept-encoding",
    e90 = "grpc-encoding",
    s$2 = "grpc-message",
    r$2 = "grpc-status",
    t90 = "grpc-timeout",
    nS5 = /(\d{1,8})\s*([HMSmun])/,
    aS5 = {
      H: 3600000,
      M: 60000,
      S: 1000,
      m: 1,
      u: 0.001,
      n: 0.000001
    },
    sS5 = {
      [Zw2]: "identity,deflate,gzip",
      [e90]: "identity"
    },
    o$2 = {
      [qJA.constants.HTTP2_HEADER_STATUS]: qJA.constants.HTTP_STATUS_OK,
      [qJA.constants.HTTP2_HEADER_CONTENT_TYPE]: "application/grpc+proto"
    },
    rS5 = {
      waitForTrailers: !0
    };
  class A40 {
    constructor(A, Q, B, G, Z) {
      var I, Y;
      if (this.stream = A, this.callEventTracker = B, this.handler = G, this.listener = null, this.deadlineTimer = null, this.deadline = 1 / 0, this.maxSendMessageSize = A$.DEFAULT_MAX_SEND_MESSAGE_LENGTH, this.maxReceiveMessageSize = A$.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH, this.cancelled = !1, this.metadataSent = !1, this.wantTrailers = !1, this.cancelNotified = !1, this.incomingEncoding = "identity", this.readQueue = [], this.isReadPending = !1, this.receivedHalfClose = !1, this.streamEnded = !1, this.metricsRecorder = new a$2.PerRequestMetricRecorder, this.stream.once("error", (F) => {}), this.stream.once("close", () => {
          var F;
          if (J0A("Request to method " + ((F = this.handler) === null || F === void 0 ? void 0 : F.path) + " stream closed with rstCode " + this.stream.rstCode), this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!1), this.callEventTracker.onCallEnd({
            code: A$.Status.CANCELLED,
            details: "Stream closed before sending status",
            metadata: null
          });
          this.notifyOnCancel()
        }), this.stream.on("data", (F) => {
          this.handleDataFrame(F)
        }), this.stream.pause(), this.stream.on("end", () => {
          this.handleEndEvent()
        }), "grpc.max_send_message_length" in Z) this.maxSendMessageSize = Z["grpc.max_send_message_length"];
      if ("grpc.max_receive_message_length" in Z) this.maxReceiveMessageSize = Z["grpc.max_receive_message_length"];
      this.host = (I = Q[":authority"]) !== null && I !== void 0 ? I : Q.host, this.decoder = new pS5.StreamDecoder(this.maxReceiveMessageSize);
      let J = k81.Metadata.fromHttp2Headers(Q);
      if (t$2.isTracerEnabled(e$2)) J0A("Request to " + this.handler.path + " received headers " + JSON.stringify(J.toJSON()));
      let W = J.get(t90);
      if (W.length > 0) this.handleTimeoutHeader(W[0]);
      let X = J.get(e90);
      if (X.length > 0) this.incomingEncoding = X[0];
      J.remove(t90), J.remove(e90), J.remove(Zw2), J.remove(qJA.constants.HTTP2_HEADER_ACCEPT_ENCODING), J.remove(qJA.constants.HTTP2_HEADER_TE), J.remove(qJA.constants.HTTP2_HEADER_CONTENT_TYPE), this.metadata = J;
      let V = (Y = A.session) === null || Y === void 0 ? void 0 : Y.socket;
      this.connectionInfo = {
        localAddress: V === null || V === void 0 ? void 0 : V.localAddress,
        localPort: V === null || V === void 0 ? void 0 : V.localPort,
        remoteAddress: V === null || V === void 0 ? void 0 : V.remoteAddress,
        remotePort: V === null || V === void 0 ? void 0 : V.remotePort
      }, this.shouldSendMetrics = !!Z["grpc.server_call_metric_recording"]
    }
    handleTimeoutHeader(A) {
      let Q = A.toString().match(nS5);
      if (Q === null) {
        let Z = {
          code: A$.Status.INTERNAL,
          details: `Invalid ${t90} value "${A}"`,
          metadata: null
        };
        process.nextTick(() => {
          this.sendStatus(Z)
        });
        return
      }
      let B = +Q[1] * aS5[Q[2]] | 0,
        G = new Date;
      this.deadline = G.setMilliseconds(G.getMilliseconds() + B), this.deadlineTimer = setTimeout(() => {
        let Z = {
          code: A$.Status.DEADLINE_EXCEEDED,
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
      if (!this.metadataSent) this.sendMetadata(new k81.Metadata)
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
        if (Q === "deflate") G = n$2.createInflate();
        else G = n$2.createGunzip();
        return new Promise((Z, I) => {
          let Y = 0,
            J = [];
          G.on("data", (W) => {
            if (J.push(W), Y += W.byteLength, this.maxReceiveMessageSize !== -1 && Y > this.maxReceiveMessageSize) G.destroy(), I({
              code: A$.Status.RESOURCE_EXHAUSTED,
              details: `Received message that decompresses to a size larger than ${this.maxReceiveMessageSize}`
            })
          }), G.on("end", () => {
            Z(Buffer.concat(J))
          }), G.write(B), G.end()
        })
      } else return Promise.reject({
        code: A$.Status.UNIMPLEMENTED,
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
          code: A$.Status.INTERNAL,
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
      J0A("Request to " + this.handler.path + " received data frame of size " + A.length);
      let B;
      try {
        B = this.decoder.write(A)
      } catch (G) {
        this.sendStatus({
          code: A$.Status.RESOURCE_EXHAUSTED,
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
      if (J0A("Request to " + this.handler.path + " start called"), this.checkCancelled()) return;
      this.listener = A, A.onReceiveMetadata(this.metadata)
    }
    sendMetadata(A) {
      if (this.checkCancelled()) return;
      if (this.metadataSent) return;
      this.metadataSent = !0;
      let Q = A ? A.toHttp2Headers() : null,
        B = Object.assign(Object.assign(Object.assign({}, o$2), sS5), Q);
      this.stream.respond(B, rS5)
    }
    sendMessage(A, Q) {
      if (this.checkCancelled()) return;
      let B;
      try {
        B = this.serializeMessage(A)
      } catch (G) {
        this.sendStatus({
          code: A$.Status.INTERNAL,
          details: `Error serializing response: ${(0,i$2.getErrorMessage)(G)}`,
          metadata: null
        });
        return
      }
      if (this.maxSendMessageSize !== -1 && B.length - 5 > this.maxSendMessageSize) {
        this.sendStatus({
          code: A$.Status.RESOURCE_EXHAUSTED,
          details: `Sent message larger than max (${B.length} vs. ${this.maxSendMessageSize})`,
          metadata: null
        });
        return
      }
      this.maybeSendMetadata(), J0A("Request to " + this.handler.path + " sent data frame of size " + B.length), this.stream.write(B, (G) => {
        var Z;
        if (G) {
          this.sendStatus({
            code: A$.Status.INTERNAL,
            details: `Error writing message: ${(0,i$2.getErrorMessage)(G)}`,
            metadata: null
          });
          return
        }(Z = this.callEventTracker) === null || Z === void 0 || Z.addMessageSent(), Q()
      })
    }
    sendStatus(A) {
      var Q, B, G;
      if (this.checkCancelled()) return;
      J0A("Request to method " + ((Q = this.handler) === null || Q === void 0 ? void 0 : Q.path) + " ended with status code: " + A$.Status[A.code] + " details: " + A.details);
      let Z = (G = (B = A.metadata) === null || B === void 0 ? void 0 : B.clone()) !== null && G !== void 0 ? G : new k81.Metadata;
      if (this.shouldSendMetrics) Z.set(a$2.GRPC_METRICS_HEADER, this.metricsRecorder.serialize());
      if (this.metadataSent)
        if (!this.wantTrailers) this.wantTrailers = !0, this.stream.once("wantTrailers", () => {
          if (this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!0), this.callEventTracker.onCallEnd(A);
          let I = Object.assign({
            [r$2]: A.code,
            [s$2]: encodeURI(A.details)
          }, Z.toHttp2Headers());
          this.stream.sendTrailers(I), this.notifyOnCancel()
        }), this.stream.end();
        else this.notifyOnCancel();
      else {
        if (this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!0), this.callEventTracker.onCallEnd(A);
        let I = Object.assign(Object.assign({
          [r$2]: A.code,
          [s$2]: encodeURI(A.details)
        }, o$2), Z.toHttp2Headers());
        this.stream.respond(I, {
          endStream: !0
        }), this.notifyOnCancel()
      }
    }
    startRead() {
      if (J0A("Request to " + this.handler.path + " startRead called"), this.checkCancelled()) return;
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
      if (((A = this.stream.session) === null || A === void 0 ? void 0 : A.socket) instanceof lS5.TLSSocket) {
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
  Iw2.BaseServerInterceptingCall = A40;

  function oS5(A, Q, B, G, Z, I) {
    let Y = {
        path: Z.path,
        requestStream: Z.type === "clientStream" || Z.type === "bidi",
        responseStream: Z.type === "serverStream" || Z.type === "bidi",
        requestDeserialize: Z.deserialize,
        responseSerialize: Z.serialize
      },
      J = new A40(Q, B, G, Z, I);
    return A.reduce((W, X) => {
      return X(Y, W)
    }, J)
  }
})
// @from(Start 11011743, End 11054111)
Dw2 = z((Bn) => {
  var G_5 = Bn && Bn.__runInitializers || function(A, Q, B) {
      var G = arguments.length > 2;
      for (var Z = 0; Z < Q.length; Z++) B = G ? Q[Z].call(A, B) : Q[Z].call(A);
      return G ? B : void 0
    },
    Z_5 = Bn && Bn.__esDecorate || function(A, Q, B, G, Z, I) {
      function Y(U) {
        if (U !== void 0 && typeof U !== "function") throw TypeError("Function expected");
        return U
      }
      var J = G.kind,
        W = J === "getter" ? "get" : J === "setter" ? "set" : "value",
        X = !Q && A ? G.static ? A : A.prototype : null,
        V = Q || (X ? Object.getOwnPropertyDescriptor(X, G.name) : {}),
        F, K = !1;
      for (var D = B.length - 1; D >= 0; D--) {
        var H = {};
        for (var C in G) H[C] = C === "access" ? {} : G[C];
        for (var C in G.access) H.access[C] = G.access[C];
        H.addInitializer = function(U) {
          if (K) throw TypeError("Cannot add initializers after decoration has completed");
          I.push(Y(U || null))
        };
        var E = (0, B[D])(J === "accessor" ? {
          get: V.get,
          set: V.set
        } : V[W], H);
        if (J === "accessor") {
          if (E === void 0) continue;
          if (E === null || typeof E !== "object") throw TypeError("Object expected");
          if (F = Y(E.get)) V.get = F;
          if (F = Y(E.set)) V.set = F;
          if (F = Y(E.init)) Z.unshift(F)
        } else if (F = Y(E))
          if (J === "field") Z.unshift(F);
          else V[W] = F
      }
      if (X) Object.defineProperty(X, G.name, V);
      K = !0
    };
  Object.defineProperty(Bn, "__esModule", {
    value: !0
  });
  Bn.Server = void 0;
  var Q$ = UA("http2"),
    I_5 = UA("util"),
    vW = E6(),
    MJA = j$2(),
    B40 = T81(),
    Jw2 = CP(),
    LJA = zZ(),
    Qn = eU(),
    qP = uE(),
    mV = ti(),
    Ww2 = Q40(),
    NJA = 2147483647,
    G40 = 2147483647,
    Y_5 = 20000,
    Xw2 = 2147483647,
    {
      HTTP2_HEADER_PATH: Vw2
    } = Q$.constants,
    J_5 = "server",
    Fw2 = Buffer.from("max_age");

  function Kw2(A) {
    LJA.trace(vW.LogVerbosity.DEBUG, "server_call", A)
  }

  function W_5() {}

  function X_5(A) {
    return function(Q, B) {
      return I_5.deprecate(Q, A)
    }
  }

  function Z40(A) {
    return {
      code: vW.Status.UNIMPLEMENTED,
      details: `The server does not implement the method ${A}`
    }
  }

  function V_5(A, Q) {
    let B = Z40(Q);
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
  var F_5 = (() => {
    var A;
    let Q = [],
      B;
    return A = class {
      constructor(Z) {
        var I, Y, J, W, X, V;
        if (this.boundPorts = (G_5(this, Q), new Map), this.http2Servers = new Map, this.sessionIdleTimeouts = new Map, this.handlers = new Map, this.sessions = new Map, this.started = !1, this.shutdown = !1, this.serverAddressString = "null", this.channelzEnabled = !0, this.options = Z !== null && Z !== void 0 ? Z : {}, this.options["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.channelzTrace = new mV.ChannelzTraceStub, this.callTracker = new mV.ChannelzCallTrackerStub, this.listenerChildrenTracker = new mV.ChannelzChildrenTrackerStub, this.sessionChildrenTracker = new mV.ChannelzChildrenTrackerStub;
        else this.channelzTrace = new mV.ChannelzTrace, this.callTracker = new mV.ChannelzCallTracker, this.listenerChildrenTracker = new mV.ChannelzChildrenTracker, this.sessionChildrenTracker = new mV.ChannelzChildrenTracker;
        if (this.channelzRef = (0, mV.registerChannelzServer)("server", () => this.getChannelzInfo(), this.channelzEnabled), this.channelzTrace.addTrace("CT_INFO", "Server created"), this.maxConnectionAgeMs = (I = this.options["grpc.max_connection_age_ms"]) !== null && I !== void 0 ? I : NJA, this.maxConnectionAgeGraceMs = (Y = this.options["grpc.max_connection_age_grace_ms"]) !== null && Y !== void 0 ? Y : NJA, this.keepaliveTimeMs = (J = this.options["grpc.keepalive_time_ms"]) !== null && J !== void 0 ? J : G40, this.keepaliveTimeoutMs = (W = this.options["grpc.keepalive_timeout_ms"]) !== null && W !== void 0 ? W : Y_5, this.sessionIdleTimeout = (X = this.options["grpc.max_connection_idle_ms"]) !== null && X !== void 0 ? X : Xw2, this.commonServerOptions = {
            maxSendHeaderBlockLength: Number.MAX_SAFE_INTEGER
          }, "grpc-node.max_session_memory" in this.options) this.commonServerOptions.maxSessionMemory = this.options["grpc-node.max_session_memory"];
        else this.commonServerOptions.maxSessionMemory = Number.MAX_SAFE_INTEGER;
        if ("grpc.max_concurrent_streams" in this.options) this.commonServerOptions.settings = {
          maxConcurrentStreams: this.options["grpc.max_concurrent_streams"]
        };
        this.interceptors = (V = this.options.interceptors) !== null && V !== void 0 ? V : [], this.trace("Server constructed")
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
        var I, Y, J;
        let W = this.sessions.get(Z),
          X = Z.socket,
          V = X.remoteAddress ? (0, Qn.stringToSubchannelAddress)(X.remoteAddress, X.remotePort) : null,
          F = X.localAddress ? (0, Qn.stringToSubchannelAddress)(X.localAddress, X.localPort) : null,
          K;
        if (Z.encrypted) {
          let H = X,
            C = H.getCipher(),
            E = H.getCertificate(),
            U = H.getPeerCertificate();
          K = {
            cipherSuiteStandardName: (I = C.standardName) !== null && I !== void 0 ? I : null,
            cipherSuiteOtherName: C.standardName ? null : C.name,
            localCertificate: E && "raw" in E ? E.raw : null,
            remoteCertificate: U && "raw" in U ? U.raw : null
          }
        } else K = null;
        return {
          remoteAddress: V,
          localAddress: F,
          security: K,
          remoteName: null,
          streamsStarted: W.streamTracker.callsStarted,
          streamsSucceeded: W.streamTracker.callsSucceeded,
          streamsFailed: W.streamTracker.callsFailed,
          messagesSent: W.messagesSent,
          messagesReceived: W.messagesReceived,
          keepAlivesSent: W.keepAlivesSent,
          lastLocalStreamCreatedTimestamp: null,
          lastRemoteStreamCreatedTimestamp: W.streamTracker.lastCallStartedTimestamp,
          lastMessageSentTimestamp: W.lastMessageSentTimestamp,
          lastMessageReceivedTimestamp: W.lastMessageReceivedTimestamp,
          localFlowControlWindow: (Y = Z.state.localWindowSize) !== null && Y !== void 0 ? Y : null,
          remoteFlowControlWindow: (J = Z.state.remoteWindowSize) !== null && J !== void 0 ? J : null
        }
      }
      trace(Z) {
        LJA.trace(vW.LogVerbosity.DEBUG, J_5, "(" + this.channelzRef.id + ") " + Z)
      }
      keepaliveTrace(Z) {
        LJA.trace(vW.LogVerbosity.DEBUG, "keepalive", "(" + this.channelzRef.id + ") " + Z)
      }
      addProtoService() {
        throw Error("Not implemented. Use addService() instead")
      }
      addService(Z, I) {
        if (Z === null || typeof Z !== "object" || I === null || typeof I !== "object") throw Error("addService() requires two objects as arguments");
        let Y = Object.keys(Z);
        if (Y.length === 0) throw Error("Cannot add an empty service to a server");
        Y.forEach((J) => {
          let W = Z[J],
            X;
          if (W.requestStream)
            if (W.responseStream) X = "bidi";
            else X = "clientStream";
          else if (W.responseStream) X = "serverStream";
          else X = "unary";
          let V = I[J],
            F;
          if (V === void 0 && typeof W.originalName === "string") V = I[W.originalName];
          if (V !== void 0) F = V.bind(I);
          else F = V_5(X, J);
          if (this.register(W.path, F, W.responseSerialize, W.requestDeserialize, X) === !1) throw Error(`Method handler for ${W.path} already provided.`)
        })
      }
      removeService(Z) {
        if (Z === null || typeof Z !== "object") throw Error("removeService() requires object as argument");
        Object.keys(Z).forEach((Y) => {
          let J = Z[Y];
          this.unregister(J.path)
        })
      }
      bind(Z, I) {
        throw Error("Not implemented. Use bindAsync() instead")
      }
      experimentalRegisterListenerToChannelz(Z) {
        return (0, mV.registerChannelzSocket)((0, Qn.subchannelAddressToString)(Z), () => {
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
        (0, mV.unregisterChannelzRef)(Z)
      }
      createHttp2Server(Z) {
        let I;
        if (Z._isSecure()) {
          let Y = Z._getConstructorOptions(),
            J = Z._getSecureContextOptions(),
            W = Object.assign(Object.assign(Object.assign(Object.assign({}, this.commonServerOptions), Y), J), {
              enableTrace: this.options["grpc-node.tls_enable_trace"] === 1
            }),
            X = J !== null;
          this.trace("Initial credentials valid: " + X), I = Q$.createSecureServer(W), I.prependListener("connection", (F) => {
            if (!X) this.trace("Dropped connection from " + JSON.stringify(F.address()) + " due to unloaded credentials"), F.destroy()
          }), I.on("secureConnection", (F) => {
            F.on("error", (K) => {
              this.trace("An incoming TLS connection closed with error: " + K.message)
            })
          });
          let V = (F) => {
            if (F) {
              let K = I;
              try {
                K.setSecureContext(F)
              } catch (D) {
                LJA.log(vW.LogVerbosity.ERROR, "Failed to set secure context with error " + D.message), F = null
              }
            }
            X = F !== null, this.trace("Post-update credentials valid: " + X)
          };
          Z._addWatcher(V), I.on("close", () => {
            Z._removeWatcher(V)
          })
        } else I = Q$.createServer(this.commonServerOptions);
        return I.setTimeout(0, W_5), this._setupHandlers(I, Z._getInterceptors()), I
      }
      bindOneAddress(Z, I) {
        this.trace("Attempting to bind " + (0, Qn.subchannelAddressToString)(Z));
        let Y = this.createHttp2Server(I.credentials);
        return new Promise((J, W) => {
          let X = (V) => {
            this.trace("Failed to bind " + (0, Qn.subchannelAddressToString)(Z) + " with error " + V.message), J({
              port: "port" in Z ? Z.port : 1,
              error: V.message
            })
          };
          Y.once("error", X), Y.listen(Z, () => {
            let V = Y.address(),
              F;
            if (typeof V === "string") F = {
              path: V
            };
            else F = {
              host: V.address,
              port: V.port
            };
            let K = this.experimentalRegisterListenerToChannelz(F);
            this.listenerChildrenTracker.refChild(K), this.http2Servers.set(Y, {
              channelzRef: K,
              sessions: new Set,
              ownsChannelzRef: !0
            }), I.listeningServers.add(Y), this.trace("Successfully bound " + (0, Qn.subchannelAddressToString)(F)), J({
              port: "port" in F ? F.port : 1
            }), Y.removeListener("error", X)
          })
        })
      }
      async bindManyPorts(Z, I) {
        if (Z.length === 0) return {
          count: 0,
          port: 0,
          errors: []
        };
        if ((0, Qn.isTcpSubchannelAddress)(Z[0]) && Z[0].port === 0) {
          let Y = await this.bindOneAddress(Z[0], I);
          if (Y.error) {
            let J = await this.bindManyPorts(Z.slice(1), I);
            return Object.assign(Object.assign({}, J), {
              errors: [Y.error, ...J.errors]
            })
          } else {
            let J = Z.slice(1).map((V) => (0, Qn.isTcpSubchannelAddress)(V) ? {
                host: V.host,
                port: Y.port
              } : V),
              W = await Promise.all(J.map((V) => this.bindOneAddress(V, I))),
              X = [Y, ...W];
            return {
              count: X.filter((V) => V.error === void 0).length,
              port: Y.port,
              errors: X.filter((V) => V.error).map((V) => V.error)
            }
          }
        } else {
          let Y = await Promise.all(Z.map((J) => this.bindOneAddress(J, I)));
          return {
            count: Y.filter((J) => J.error === void 0).length,
            port: Y[0].port,
            errors: Y.filter((J) => J.error).map((J) => J.error)
          }
        }
      }
      async bindAddressList(Z, I) {
        let Y = await this.bindManyPorts(Z, I);
        if (Y.count > 0) {
          if (Y.count < Z.length) LJA.log(vW.LogVerbosity.INFO, `WARNING Only ${Y.count} addresses added out of total ${Z.length} resolved`);
          return Y.port
        } else {
          let J = `No address added out of total ${Z.length} resolved`;
          throw LJA.log(vW.LogVerbosity.ERROR, J), Error(`${J} errors: [${Y.errors.join(",")}]`)
        }
      }
      resolvePort(Z) {
        return new Promise((I, Y) => {
          let J = !1,
            W = (V, F, K, D) => {
              if (J) return !0;
              if (J = !0, !V.ok) return Y(Error(V.error.details)), !0;
              let H = [].concat(...V.value.map((C) => C.addresses));
              if (H.length === 0) return Y(Error(`No addresses resolved for port ${Z}`)), !0;
              return I(H), !0
            };
          (0, Jw2.createResolver)(Z, W, this.options).updateResolution()
        })
      }
      async bindPort(Z, I) {
        let Y = await this.resolvePort(Z);
        if (I.cancelled) throw this.completeUnbind(I), Error("bindAsync operation cancelled by unbind call");
        let J = await this.bindAddressList(Y, I);
        if (I.cancelled) throw this.completeUnbind(I), Error("bindAsync operation cancelled by unbind call");
        return J
      }
      normalizePort(Z) {
        let I = (0, qP.parseUri)(Z);
        if (I === null) throw Error(`Could not parse port "${Z}"`);
        let Y = (0, Jw2.mapUriDefaultScheme)(I);
        if (Y === null) throw Error(`Could not get a default scheme for port "${Z}"`);
        return Y
      }
      bindAsync(Z, I, Y) {
        if (this.shutdown) throw Error("bindAsync called after shutdown");
        if (typeof Z !== "string") throw TypeError("port must be a string");
        if (I === null || !(I instanceof B40.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
        if (typeof Y !== "function") throw TypeError("callback must be a function");
        this.trace("bindAsync port=" + Z);
        let J = this.normalizePort(Z),
          W = (K, D) => {
            process.nextTick(() => Y(K, D))
          },
          X = this.boundPorts.get((0, qP.uriToString)(J));
        if (X) {
          if (!I._equals(X.credentials)) {
            W(Error(`${Z} already bound with incompatible credentials`), 0);
            return
          }
          if (X.cancelled = !1, X.completionPromise) X.completionPromise.then((K) => Y(null, K), (K) => Y(K, 0));
          else W(null, X.portNumber);
          return
        }
        X = {
          mapKey: (0, qP.uriToString)(J),
          originalUri: J,
          completionPromise: null,
          cancelled: !1,
          portNumber: 0,
          credentials: I,
          listeningServers: new Set
        };
        let V = (0, qP.splitHostPort)(J.path),
          F = this.bindPort(J, X);
        if (X.completionPromise = F, (V === null || V === void 0 ? void 0 : V.port) === 0) F.then((K) => {
          let D = {
            scheme: J.scheme,
            authority: J.authority,
            path: (0, qP.combineHostPort)({
              host: V.host,
              port: K
            })
          };
          X.mapKey = (0, qP.uriToString)(D), X.completionPromise = null, X.portNumber = K, this.boundPorts.set(X.mapKey, X), Y(null, K)
        }, (K) => {
          Y(K, 0)
        });
        else this.boundPorts.set(X.mapKey, X), F.then((K) => {
          X.completionPromise = null, X.portNumber = K, Y(null, K)
        }, (K) => {
          Y(K, 0)
        })
      }
      registerInjectorToChannelz() {
        return (0, mV.registerChannelzSocket)("injector", () => {
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
      experimentalCreateConnectionInjectorWithChannelzRef(Z, I, Y = !1) {
        if (Z === null || !(Z instanceof B40.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
        if (this.channelzEnabled) this.listenerChildrenTracker.refChild(I);
        let J = this.createHttp2Server(Z),
          W = new Set;
        return this.http2Servers.set(J, {
          channelzRef: I,
          sessions: W,
          ownsChannelzRef: Y
        }), {
          injectConnection: (X) => {
            J.emit("connection", X)
          },
          drain: (X) => {
            var V, F;
            for (let K of W) this.closeSession(K);
            (F = (V = setTimeout(() => {
              for (let K of W) K.destroy(Q$.constants.NGHTTP2_CANCEL)
            }, X)).unref) === null || F === void 0 || F.call(V)
          },
          destroy: () => {
            this.closeServer(J);
            for (let X of W) this.closeSession(X)
          }
        }
      }
      createConnectionInjector(Z) {
        if (Z === null || !(Z instanceof B40.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
        let I = this.registerInjectorToChannelz();
        return this.experimentalCreateConnectionInjectorWithChannelzRef(Z, I, !0)
      }
      closeServer(Z, I) {
        this.trace("Closing server with address " + JSON.stringify(Z.address()));
        let Y = this.http2Servers.get(Z);
        Z.close(() => {
          if (Y && Y.ownsChannelzRef) this.listenerChildrenTracker.unrefChild(Y.channelzRef), (0, mV.unregisterChannelzRef)(Y.channelzRef);
          this.http2Servers.delete(Z), I === null || I === void 0 || I()
        })
      }
      closeSession(Z, I) {
        var Y;
        this.trace("Closing session initiated by " + ((Y = Z.socket) === null || Y === void 0 ? void 0 : Y.remoteAddress));
        let J = this.sessions.get(Z),
          W = () => {
            if (J) this.sessionChildrenTracker.unrefChild(J.ref), (0, mV.unregisterChannelzRef)(J.ref);
            I === null || I === void 0 || I()
          };
        if (Z.closed) queueMicrotask(W);
        else Z.close(W)
      }
      completeUnbind(Z) {
        for (let I of Z.listeningServers) {
          let Y = this.http2Servers.get(I);
          if (this.closeServer(I, () => {
              Z.listeningServers.delete(I)
            }), Y)
            for (let J of Y.sessions) this.closeSession(J)
        }
        this.boundPorts.delete(Z.mapKey)
      }
      unbind(Z) {
        this.trace("unbind port=" + Z);
        let I = this.normalizePort(Z),
          Y = (0, qP.splitHostPort)(I.path);
        if ((Y === null || Y === void 0 ? void 0 : Y.port) === 0) throw Error("Cannot unbind port 0");
        let J = this.boundPorts.get((0, qP.uriToString)(I));
        if (J)
          if (this.trace("unbinding " + J.mapKey + " originally bound as " + (0, qP.uriToString)(J.originalUri)), J.completionPromise) J.cancelled = !0;
          else this.completeUnbind(J)
      }
      drain(Z, I) {
        var Y, J;
        this.trace("drain port=" + Z + " graceTimeMs=" + I);
        let W = this.normalizePort(Z),
          X = (0, qP.splitHostPort)(W.path);
        if ((X === null || X === void 0 ? void 0 : X.port) === 0) throw Error("Cannot drain port 0");
        let V = this.boundPorts.get((0, qP.uriToString)(W));
        if (!V) return;
        let F = new Set;
        for (let K of V.listeningServers) {
          let D = this.http2Servers.get(K);
          if (D)
            for (let H of D.sessions) F.add(H), this.closeSession(H, () => {
              F.delete(H)
            })
        }(J = (Y = setTimeout(() => {
          for (let K of F) K.destroy(Q$.constants.NGHTTP2_CANCEL)
        }, I)).unref) === null || J === void 0 || J.call(Y)
      }
      forceShutdown() {
        for (let Z of this.boundPorts.values()) Z.cancelled = !0;
        this.boundPorts.clear();
        for (let Z of this.http2Servers.keys()) this.closeServer(Z);
        this.sessions.forEach((Z, I) => {
          this.closeSession(I), I.destroy(Q$.constants.NGHTTP2_CANCEL)
        }), this.sessions.clear(), (0, mV.unregisterChannelzRef)(this.channelzRef), this.shutdown = !0
      }
      register(Z, I, Y, J, W) {
        if (this.handlers.has(Z)) return !1;
        return this.handlers.set(Z, {
          func: I,
          serialize: Y,
          deserialize: J,
          type: W,
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
        var I;
        let Y = (X) => {
            (0, mV.unregisterChannelzRef)(this.channelzRef), Z(X)
          },
          J = 0;

        function W() {
          if (J--, J === 0) Y()
        }
        this.shutdown = !0;
        for (let [X, V] of this.http2Servers.entries()) {
          J++;
          let F = V.channelzRef.name;
          this.trace("Waiting for server " + F + " to close"), this.closeServer(X, () => {
            this.trace("Server " + F + " finished closing"), W()
          });
          for (let K of V.sessions.keys()) {
            J++;
            let D = (I = K.socket) === null || I === void 0 ? void 0 : I.remoteAddress;
            this.trace("Waiting for session " + D + " to close"), this.closeSession(K, () => {
              this.trace("Session " + D + " finished closing"), W()
            })
          }
        }
        if (J === 0) Y()
      }
      addHttp2Port() {
        throw Error("Not yet implemented")
      }
      getChannelzRef() {
        return this.channelzRef
      }
      _verifyContentType(Z, I) {
        let Y = I[Q$.constants.HTTP2_HEADER_CONTENT_TYPE];
        if (typeof Y !== "string" || !Y.startsWith("application/grpc")) return Z.respond({
          [Q$.constants.HTTP2_HEADER_STATUS]: Q$.constants.HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE
        }, {
          endStream: !0
        }), !1;
        return !0
      }
      _retrieveHandler(Z) {
        Kw2("Received call to method " + Z + " at address " + this.serverAddressString);
        let I = this.handlers.get(Z);
        if (I === void 0) return Kw2("No handler registered for method " + Z + ". Sending UNIMPLEMENTED status."), null;
        return I
      }
      _respondWithError(Z, I, Y = null) {
        var J, W;
        let X = Object.assign({
          "grpc-status": (J = Z.code) !== null && J !== void 0 ? J : vW.Status.INTERNAL,
          "grpc-message": Z.details,
          [Q$.constants.HTTP2_HEADER_STATUS]: Q$.constants.HTTP_STATUS_OK,
          [Q$.constants.HTTP2_HEADER_CONTENT_TYPE]: "application/grpc+proto"
        }, (W = Z.metadata) === null || W === void 0 ? void 0 : W.toHttp2Headers());
        I.respond(X, {
          endStream: !0
        }), this.callTracker.addCallFailed(), Y === null || Y === void 0 || Y.streamTracker.addCallFailed()
      }
      _channelzHandler(Z, I, Y) {
        this.onStreamOpened(I);
        let J = this.sessions.get(I.session);
        if (this.callTracker.addCallStarted(), J === null || J === void 0 || J.streamTracker.addCallStarted(), !this._verifyContentType(I, Y)) {
          this.callTracker.addCallFailed(), J === null || J === void 0 || J.streamTracker.addCallFailed();
          return
        }
        let W = Y[Vw2],
          X = this._retrieveHandler(W);
        if (!X) {
          this._respondWithError(Z40(W), I, J);
          return
        }
        let V = {
            addMessageSent: () => {
              if (J) J.messagesSent += 1, J.lastMessageSentTimestamp = new Date
            },
            addMessageReceived: () => {
              if (J) J.messagesReceived += 1, J.lastMessageReceivedTimestamp = new Date
            },
            onCallEnd: (K) => {
              if (K.code === vW.Status.OK) this.callTracker.addCallSucceeded();
              else this.callTracker.addCallFailed()
            },
            onStreamEnd: (K) => {
              if (J)
                if (K) J.streamTracker.addCallSucceeded();
                else J.streamTracker.addCallFailed()
            }
          },
          F = (0, Ww2.getServerInterceptingCall)([...Z, ...this.interceptors], I, Y, V, X, this.options);
        if (!this._runHandlerForCall(F, X)) this.callTracker.addCallFailed(), J === null || J === void 0 || J.streamTracker.addCallFailed(), F.sendStatus({
          code: vW.Status.INTERNAL,
          details: `Unknown handler type: ${X.type}`
        })
      }
      _streamHandler(Z, I, Y) {
        if (this.onStreamOpened(I), this._verifyContentType(I, Y) !== !0) return;
        let J = Y[Vw2],
          W = this._retrieveHandler(J);
        if (!W) {
          this._respondWithError(Z40(J), I, null);
          return
        }
        let X = (0, Ww2.getServerInterceptingCall)([...Z, ...this.interceptors], I, Y, null, W, this.options);
        if (!this._runHandlerForCall(X, W)) X.sendStatus({
          code: vW.Status.INTERNAL,
          details: `Unknown handler type: ${W.type}`
        })
      }
      _runHandlerForCall(Z, I) {
        let {
          type: Y
        } = I;
        if (Y === "unary") K_5(Z, I);
        else if (Y === "clientStream") D_5(Z, I);
        else if (Y === "serverStream") H_5(Z, I);
        else if (Y === "bidi") C_5(Z, I);
        else return !1;
        return !0
      }
      _setupHandlers(Z, I) {
        if (Z === null) return;
        let Y = Z.address(),
          J = "null";
        if (Y)
          if (typeof Y === "string") J = Y;
          else J = Y.address + ":" + Y.port;
        this.serverAddressString = J;
        let W = this.channelzEnabled ? this._channelzHandler : this._streamHandler,
          X = this.channelzEnabled ? this._channelzSessionHandler(Z) : this._sessionHandler(Z);
        Z.on("stream", W.bind(this, I)), Z.on("session", X)
      }
      _sessionHandler(Z) {
        return (I) => {
          var Y, J;
          (Y = this.http2Servers.get(Z)) === null || Y === void 0 || Y.sessions.add(I);
          let W = null,
            X = null,
            V = null,
            F = !1,
            K = this.enableIdleTimeout(I);
          if (this.maxConnectionAgeMs !== NJA) {
            let U = this.maxConnectionAgeMs / 10,
              q = Math.random() * U * 2 - U;
            W = setTimeout(() => {
              var w, N;
              F = !0, this.trace("Connection dropped by max connection age: " + ((w = I.socket) === null || w === void 0 ? void 0 : w.remoteAddress));
              try {
                I.goaway(Q$.constants.NGHTTP2_NO_ERROR, 2147483647, Fw2)
              } catch (R) {
                I.destroy();
                return
              }
              if (I.close(), this.maxConnectionAgeGraceMs !== NJA) X = setTimeout(() => {
                I.destroy()
              }, this.maxConnectionAgeGraceMs), (N = X.unref) === null || N === void 0 || N.call(X)
            }, this.maxConnectionAgeMs + q), (J = W.unref) === null || J === void 0 || J.call(W)
          }
          let D = () => {
              if (V) clearTimeout(V), V = null
            },
            H = () => {
              return !I.destroyed && this.keepaliveTimeMs < G40 && this.keepaliveTimeMs > 0
            },
            C, E = () => {
              var U;
              if (!H()) return;
              this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), V = setTimeout(() => {
                D(), C()
              }, this.keepaliveTimeMs), (U = V.unref) === null || U === void 0 || U.call(V)
            };
          C = () => {
            var U;
            if (!H()) return;
            this.keepaliveTrace("Sending ping with timeout " + this.keepaliveTimeoutMs + "ms");
            let q = "";
            try {
              if (!I.ping((N, R, T) => {
                  if (D(), N) this.keepaliveTrace("Ping failed with error: " + N.message), F = !0, I.close();
                  else this.keepaliveTrace("Received ping response"), E()
                })) q = "Ping returned false"
            } catch (w) {
              q = (w instanceof Error ? w.message : "") || "Unknown error"
            }
            if (q) {
              this.keepaliveTrace("Ping send failed: " + q), this.trace("Connection dropped due to ping send error: " + q), F = !0, I.close();
              return
            }
            V = setTimeout(() => {
              D(), this.keepaliveTrace("Ping timeout passed without response"), this.trace("Connection dropped by keepalive timeout"), F = !0, I.close()
            }, this.keepaliveTimeoutMs), (U = V.unref) === null || U === void 0 || U.call(V)
          }, E(), I.on("close", () => {
            var U, q;
            if (!F) this.trace(`Connection dropped by client ${(U=I.socket)===null||U===void 0?void 0:U.remoteAddress}`);
            if (W) clearTimeout(W);
            if (X) clearTimeout(X);
            if (D(), K !== null) clearTimeout(K.timeout), this.sessionIdleTimeouts.delete(I);
            (q = this.http2Servers.get(Z)) === null || q === void 0 || q.sessions.delete(I)
          })
        }
      }
      _channelzSessionHandler(Z) {
        return (I) => {
          var Y, J, W, X;
          let V = (0, mV.registerChannelzSocket)((J = (Y = I.socket) === null || Y === void 0 ? void 0 : Y.remoteAddress) !== null && J !== void 0 ? J : "unknown", this.getChannelzSessionInfo.bind(this, I), this.channelzEnabled),
            F = {
              ref: V,
              streamTracker: new mV.ChannelzCallTracker,
              messagesSent: 0,
              messagesReceived: 0,
              keepAlivesSent: 0,
              lastMessageSentTimestamp: null,
              lastMessageReceivedTimestamp: null
            };
          (W = this.http2Servers.get(Z)) === null || W === void 0 || W.sessions.add(I), this.sessions.set(I, F);
          let K = `${I.socket.remoteAddress}:${I.socket.remotePort}`;
          this.channelzTrace.addTrace("CT_INFO", "Connection established by client " + K), this.trace("Connection established by client " + K), this.sessionChildrenTracker.refChild(V);
          let D = null,
            H = null,
            C = null,
            E = !1,
            U = this.enableIdleTimeout(I);
          if (this.maxConnectionAgeMs !== NJA) {
            let T = this.maxConnectionAgeMs / 10,
              y = Math.random() * T * 2 - T;
            D = setTimeout(() => {
              var v;
              E = !0, this.channelzTrace.addTrace("CT_INFO", "Connection dropped by max connection age from " + K);
              try {
                I.goaway(Q$.constants.NGHTTP2_NO_ERROR, 2147483647, Fw2)
              } catch (x) {
                I.destroy();
                return
              }
              if (I.close(), this.maxConnectionAgeGraceMs !== NJA) H = setTimeout(() => {
                I.destroy()
              }, this.maxConnectionAgeGraceMs), (v = H.unref) === null || v === void 0 || v.call(H)
            }, this.maxConnectionAgeMs + y), (X = D.unref) === null || X === void 0 || X.call(D)
          }
          let q = () => {
              if (C) clearTimeout(C), C = null
            },
            w = () => {
              return !I.destroyed && this.keepaliveTimeMs < G40 && this.keepaliveTimeMs > 0
            },
            N, R = () => {
              var T;
              if (!w()) return;
              this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), C = setTimeout(() => {
                q(), N()
              }, this.keepaliveTimeMs), (T = C.unref) === null || T === void 0 || T.call(C)
            };
          N = () => {
            var T;
            if (!w()) return;
            this.keepaliveTrace("Sending ping with timeout " + this.keepaliveTimeoutMs + "ms");
            let y = "";
            try {
              if (!I.ping((x, p, u) => {
                  if (q(), x) this.keepaliveTrace("Ping failed with error: " + x.message), this.channelzTrace.addTrace("CT_INFO", "Connection dropped due to error of a ping frame " + x.message + " return in " + p), E = !0, I.close();
                  else this.keepaliveTrace("Received ping response"), R()
                })) y = "Ping returned false"
            } catch (v) {
              y = (v instanceof Error ? v.message : "") || "Unknown error"
            }
            if (y) {
              this.keepaliveTrace("Ping send failed: " + y), this.channelzTrace.addTrace("CT_INFO", "Connection dropped due to ping send error: " + y), E = !0, I.close();
              return
            }
            F.keepAlivesSent += 1, C = setTimeout(() => {
              q(), this.keepaliveTrace("Ping timeout passed without response"), this.channelzTrace.addTrace("CT_INFO", "Connection dropped by keepalive timeout from " + K), E = !0, I.close()
            }, this.keepaliveTimeoutMs), (T = C.unref) === null || T === void 0 || T.call(C)
          }, R(), I.on("close", () => {
            var T;
            if (!E) this.channelzTrace.addTrace("CT_INFO", "Connection dropped by client " + K);
            if (this.sessionChildrenTracker.unrefChild(V), (0, mV.unregisterChannelzRef)(V), D) clearTimeout(D);
            if (H) clearTimeout(H);
            if (q(), U !== null) clearTimeout(U.timeout), this.sessionIdleTimeouts.delete(I);
            (T = this.http2Servers.get(Z)) === null || T === void 0 || T.sessions.delete(I), this.sessions.delete(I)
          })
        }
      }
      enableIdleTimeout(Z) {
        var I, Y;
        if (this.sessionIdleTimeout >= Xw2) return null;
        let J = {
          activeStreams: 0,
          lastIdle: Date.now(),
          onClose: this.onStreamClose.bind(this, Z),
          timeout: setTimeout(this.onIdleTimeout, this.sessionIdleTimeout, this, Z)
        };
        (Y = (I = J.timeout).unref) === null || Y === void 0 || Y.call(I), this.sessionIdleTimeouts.set(Z, J);
        let {
          socket: W
        } = Z;
        return this.trace("Enable idle timeout for " + W.remoteAddress + ":" + W.remotePort), J
      }
      onIdleTimeout(Z, I) {
        let {
          socket: Y
        } = I, J = Z.sessionIdleTimeouts.get(I);
        if (J !== void 0 && J.activeStreams === 0)
          if (Date.now() - J.lastIdle >= Z.sessionIdleTimeout) Z.trace("Session idle timeout triggered for " + (Y === null || Y === void 0 ? void 0 : Y.remoteAddress) + ":" + (Y === null || Y === void 0 ? void 0 : Y.remotePort) + " last idle at " + J.lastIdle), Z.closeSession(I);
          else J.timeout.refresh()
      }
      onStreamOpened(Z) {
        let I = Z.session,
          Y = this.sessionIdleTimeouts.get(I);
        if (Y) Y.activeStreams += 1, Z.once("close", Y.onClose)
      }
      onStreamClose(Z) {
        var I, Y;
        let J = this.sessionIdleTimeouts.get(Z);
        if (J) {
          if (J.activeStreams -= 1, J.activeStreams === 0) J.lastIdle = Date.now(), J.timeout.refresh(), this.trace("Session onStreamClose" + ((I = Z.socket) === null || I === void 0 ? void 0 : I.remoteAddress) + ":" + ((Y = Z.socket) === null || Y === void 0 ? void 0 : Y.remotePort) + " at " + J.lastIdle)
        }
      }
    }, (() => {
      let G = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
      if (B = [X_5("Calling start() is no longer necessary. It can be safely omitted.")], Z_5(A, null, B, {
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
  Bn.Server = F_5;
  async function K_5(A, Q) {
    let B;

    function G(Y, J, W, X) {
      if (Y) {
        A.sendStatus((0, MJA.serverErrorToStatus)(Y, W));
        return
      }
      A.sendMessage(J, () => {
        A.sendStatus({
          code: vW.Status.OK,
          details: "OK",
          metadata: W !== null && W !== void 0 ? W : null
        })
      })
    }
    let Z, I = null;
    A.start({
      onReceiveMetadata(Y) {
        Z = Y, A.startRead()
      },
      onReceiveMessage(Y) {
        if (I) {
          A.sendStatus({
            code: vW.Status.UNIMPLEMENTED,
            details: `Received a second request message for server streaming method ${Q.path}`,
            metadata: null
          });
          return
        }
        I = Y, A.startRead()
      },
      onReceiveHalfClose() {
        if (!I) {
          A.sendStatus({
            code: vW.Status.UNIMPLEMENTED,
            details: `Received no request message for server streaming method ${Q.path}`,
            metadata: null
          });
          return
        }
        B = new MJA.ServerWritableStreamImpl(Q.path, A, Z, I);
        try {
          Q.func(B, G)
        } catch (Y) {
          A.sendStatus({
            code: vW.Status.UNKNOWN,
            details: `Server method handler threw error ${Y.message}`,
            metadata: null
          })
        }
      },
      onCancel() {
        if (B) B.cancelled = !0, B.emit("cancelled", "cancelled")
      }
    })
  }

  function D_5(A, Q) {
    let B;

    function G(Z, I, Y, J) {
      if (Z) {
        A.sendStatus((0, MJA.serverErrorToStatus)(Z, Y));
        return
      }
      A.sendMessage(I, () => {
        A.sendStatus({
          code: vW.Status.OK,
          details: "OK",
          metadata: Y !== null && Y !== void 0 ? Y : null
        })
      })
    }
    A.start({
      onReceiveMetadata(Z) {
        B = new MJA.ServerDuplexStreamImpl(Q.path, A, Z);
        try {
          Q.func(B, G)
        } catch (I) {
          A.sendStatus({
            code: vW.Status.UNKNOWN,
            details: `Server method handler threw error ${I.message}`,
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

  function H_5(A, Q) {
    let B, G, Z = null;
    A.start({
      onReceiveMetadata(I) {
        G = I, A.startRead()
      },
      onReceiveMessage(I) {
        if (Z) {
          A.sendStatus({
            code: vW.Status.UNIMPLEMENTED,
            details: `Received a second request message for server streaming method ${Q.path}`,
            metadata: null
          });
          return
        }
        Z = I, A.startRead()
      },
      onReceiveHalfClose() {
        if (!Z) {
          A.sendStatus({
            code: vW.Status.UNIMPLEMENTED,
            details: `Received no request message for server streaming method ${Q.path}`,
            metadata: null
          });
          return
        }
        B = new MJA.ServerWritableStreamImpl(Q.path, A, G, Z);
        try {
          Q.func(B)
        } catch (I) {
          A.sendStatus({
            code: vW.Status.UNKNOWN,
            details: `Server method handler threw error ${I.message}`,
            metadata: null
          })
        }
      },
      onCancel() {
        if (B) B.cancelled = !0, B.emit("cancelled", "cancelled"), B.destroy()
      }
    })
  }

  function C_5(A, Q) {
    let B;
    A.start({
      onReceiveMetadata(G) {
        B = new MJA.ServerDuplexStreamImpl(Q.path, A, G);
        try {
          Q.func(B)
        } catch (Z) {
          A.sendStatus({
            code: vW.Status.UNKNOWN,
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
// @from(Start 11054117, End 11054778)
zw2 = z((Cw2) => {
  Object.defineProperty(Cw2, "__esModule", {
    value: !0
  });
  Cw2.StatusBuilder = void 0;
  class Hw2 {
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
  Cw2.StatusBuilder = Hw2
})
// @from(Start 11054784, End 11066564)
oOA = z((Ow2) => {
  Object.defineProperty(Ow2, "__esModule", {
    value: !0
  });
  Ow2.LeafLoadBalancer = Ow2.PickFirstLoadBalancer = Ow2.PickFirstLoadBalancingConfig = void 0;
  Ow2.shuffled = Nw2;
  Ow2.setup = L_5;
  var I40 = li(),
    bW = mE(),
    Gn = Ph(),
    Uw2 = eU(),
    E_5 = zZ(),
    z_5 = E6(),
    $w2 = eU(),
    ww2 = UA("net"),
    U_5 = o1A(),
    $_5 = "pick_first";

  function sOA(A) {
    E_5.trace(z_5.LogVerbosity.DEBUG, $_5, A)
  }
  var rOA = "pick_first",
    w_5 = 250;
  class OJA {
    constructor(A) {
      this.shuffleAddressList = A
    }
    getLoadBalancerName() {
      return rOA
    }
    toJsonObject() {
      return {
        [rOA]: {
          shuffleAddressList: this.shuffleAddressList
        }
      }
    }
    getShuffleAddressList() {
      return this.shuffleAddressList
    }
    static createFromJson(A) {
      if ("shuffleAddressList" in A && typeof A.shuffleAddressList !== "boolean") throw Error("pick_first config field shuffleAddressList must be a boolean if provided");
      return new OJA(A.shuffleAddressList === !0)
    }
  }
  Ow2.PickFirstLoadBalancingConfig = OJA;
  class qw2 {
    constructor(A) {
      this.subchannel = A
    }
    pick(A) {
      return {
        pickResultType: Gn.PickResultType.COMPLETE,
        subchannel: this.subchannel,
        status: null,
        onCallStarted: null,
        onCallEnded: null
      }
    }
  }

  function Nw2(A) {
    let Q = A.slice();
    for (let B = Q.length - 1; B > 1; B--) {
      let G = Math.floor(Math.random() * (B + 1)),
        Z = Q[B];
      Q[B] = Q[G], Q[G] = Z
    }
    return Q
  }

  function q_5(A) {
    if (A.length === 0) return [];
    let Q = [],
      B = [],
      G = [],
      Z = (0, $w2.isTcpSubchannelAddress)(A[0]) && (0, ww2.isIPv6)(A[0].host);
    for (let J of A)
      if ((0, $w2.isTcpSubchannelAddress)(J) && (0, ww2.isIPv6)(J.host)) B.push(J);
      else G.push(J);
    let I = Z ? B : G,
      Y = Z ? G : B;
    for (let J = 0; J < Math.max(I.length, Y.length); J++) {
      if (J < I.length) Q.push(I[J]);
      if (J < Y.length) Q.push(Y[J])
    }
    return Q
  }
  var Lw2 = "grpc-node.internal.pick-first.report_health_status";
  class y81 {
    constructor(A) {
      this.channelControlHelper = A, this.children = [], this.currentState = bW.ConnectivityState.IDLE, this.currentSubchannelIndex = 0, this.currentPick = null, this.subchannelStateListener = (Q, B, G, Z, I) => {
        this.onSubchannelStateUpdate(Q, B, G, I)
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
          this.updateState(bW.ConnectivityState.TRANSIENT_FAILURE, new Gn.UnavailablePicker({
            details: Q
          }), Q)
        } else this.updateState(bW.ConnectivityState.READY, new qw2(this.currentPick), null);
      else if (((A = this.latestAddressList) === null || A === void 0 ? void 0 : A.length) === 0) {
        let Q = `No connection established. Last error: ${this.lastError}. Resolution note: ${this.latestResolutionNote}`;
        this.updateState(bW.ConnectivityState.TRANSIENT_FAILURE, new Gn.UnavailablePicker({
          details: Q
        }), Q)
      } else if (this.children.length === 0) this.updateState(bW.ConnectivityState.IDLE, new Gn.QueuePicker(this), null);
      else if (this.stickyTransientFailureMode) {
        let Q = `No connection established. Last error: ${this.lastError}. Resolution note: ${this.latestResolutionNote}`;
        this.updateState(bW.ConnectivityState.TRANSIENT_FAILURE, new Gn.UnavailablePicker({
          details: Q
        }), Q)
      } else this.updateState(bW.ConnectivityState.CONNECTING, new Gn.QueuePicker(this), null)
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
        if (B !== bW.ConnectivityState.READY) this.removeCurrentPick(), this.calculateAndReportNewState();
        return
      }
      for (let [I, Y] of this.children.entries())
        if (A.realSubchannelEquals(Y.subchannel)) {
          if (B === bW.ConnectivityState.READY) this.pickSubchannel(Y.subchannel);
          if (B === bW.ConnectivityState.TRANSIENT_FAILURE) {
            if (Y.hasReportedTransientFailure = !0, G) this.lastError = G;
            if (this.maybeEnterStickyTransientFailureMode(), I === this.currentSubchannelIndex) this.startNextSubchannelConnecting(I + 1)
          }
          Y.subchannel.startConnecting();
          return
        }
    }
    startNextSubchannelConnecting(A) {
      clearTimeout(this.connectionDelayTimeout);
      for (let [Q, B] of this.children.entries())
        if (Q >= A) {
          let G = B.subchannel.getConnectivityState();
          if (G === bW.ConnectivityState.IDLE || G === bW.ConnectivityState.CONNECTING) {
            this.startConnecting(Q);
            return
          }
        } this.maybeEnterStickyTransientFailureMode()
    }
    startConnecting(A) {
      var Q, B;
      if (clearTimeout(this.connectionDelayTimeout), this.currentSubchannelIndex = A, this.children[A].subchannel.getConnectivityState() === bW.ConnectivityState.IDLE) sOA("Start connecting to subchannel with address " + this.children[A].subchannel.getAddress()), process.nextTick(() => {
        var G;
        (G = this.children[A]) === null || G === void 0 || G.subchannel.startConnecting()
      });
      this.connectionDelayTimeout = setTimeout(() => {
        this.startNextSubchannelConnecting(A + 1)
      }, w_5), (B = (Q = this.connectionDelayTimeout).unref) === null || B === void 0 || B.call(Q)
    }
    pickSubchannel(A) {
      sOA("Pick subchannel with address " + A.getAddress()), this.stickyTransientFailureMode = !1, A.ref(), this.channelControlHelper.addChannelzChild(A.getChannelzRef()), this.removeCurrentPick(), this.resetSubchannelList(), A.addConnectivityStateListener(this.subchannelStateListener), A.addHealthStateWatcher(this.pickedSubchannelHealthListener), this.currentPick = A, clearTimeout(this.connectionDelayTimeout), this.calculateAndReportNewState()
    }
    updateState(A, Q, B) {
      sOA(bW.ConnectivityState[this.currentState] + " -> " + bW.ConnectivityState[A]), this.currentState = A, this.channelControlHelper.updateState(A, Q, B)
    }
    resetSubchannelList() {
      for (let A of this.children) A.subchannel.removeConnectivityStateListener(this.subchannelStateListener), A.subchannel.unref(), this.channelControlHelper.removeChannelzChild(A.subchannel.getChannelzRef());
      this.currentSubchannelIndex = 0, this.children = []
    }
    connectToAddressList(A, Q) {
      sOA("connectToAddressList([" + A.map((G) => (0, Uw2.subchannelAddressToString)(G)) + "])");
      let B = A.map((G) => ({
        subchannel: this.channelControlHelper.createSubchannel(G, Q),
        hasReportedTransientFailure: !1
      }));
      for (let {
          subchannel: G
        }
        of B)
        if (G.getConnectivityState() === bW.ConnectivityState.READY) {
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
        if (G.subchannel.getConnectivityState() === bW.ConnectivityState.TRANSIENT_FAILURE) G.hasReportedTransientFailure = !0;
      this.startNextSubchannelConnecting(0), this.calculateAndReportNewState()
    }
    updateAddressList(A, Q, B, G) {
      if (!(Q instanceof OJA)) return !1;
      if (!A.ok) {
        if (this.children.length === 0 && this.currentPick === null) this.channelControlHelper.updateState(bW.ConnectivityState.TRANSIENT_FAILURE, new Gn.UnavailablePicker(A.error), A.error.details);
        return !0
      }
      let Z = A.value;
      if (this.reportHealthStatus = B[Lw2], Q.getShuffleAddressList()) Z = Nw2(Z);
      let I = [].concat(...Z.map((J) => J.addresses));
      sOA("updateAddressList([" + I.map((J) => (0, Uw2.subchannelAddressToString)(J)) + "])");
      let Y = q_5(I);
      if (this.latestAddressList = Y, this.latestOptions = B, this.connectToAddressList(Y, B), this.latestResolutionNote = G, I.length > 0) return !0;
      else return this.lastError = "No addresses resolved", !1
    }
    exitIdle() {
      if (this.currentState === bW.ConnectivityState.IDLE && this.latestAddressList) this.connectToAddressList(this.latestAddressList, this.latestOptions)
    }
    resetBackoff() {}
    destroy() {
      this.resetSubchannelList(), this.removeCurrentPick()
    }
    getTypeName() {
      return rOA
    }
  }
  Ow2.PickFirstLoadBalancer = y81;
  var N_5 = new OJA(!1);
  class Mw2 {
    constructor(A, Q, B, G) {
      this.endpoint = A, this.options = B, this.resolutionNote = G, this.latestState = bW.ConnectivityState.IDLE;
      let Z = (0, I40.createChildChannelControlHelper)(Q, {
        updateState: (I, Y, J) => {
          this.latestState = I, this.latestPicker = Y, Q.updateState(I, Y, J)
        }
      });
      this.pickFirstBalancer = new y81(Z), this.latestPicker = new Gn.QueuePicker(this.pickFirstBalancer)
    }
    startConnecting() {
      this.pickFirstBalancer.updateAddressList((0, U_5.statusOrFromValue)([this.endpoint]), N_5, Object.assign(Object.assign({}, this.options), {
        [Lw2]: !0
      }), this.resolutionNote)
    }
    updateEndpoint(A, Q) {
      if (this.options = Q, this.endpoint = A, this.latestState !== bW.ConnectivityState.IDLE) this.startConnecting()
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
  Ow2.LeafLoadBalancer = Mw2;

  function L_5() {
    (0, I40.registerLoadBalancerType)(rOA, y81, OJA), (0, I40.registerDefaultLoadBalancerType)(rOA)
  }
})
// @from(Start 11066570, End 11070208)
Sw2 = z((Pw2) => {
  Object.defineProperty(Pw2, "__esModule", {
    value: !0
  });
  Pw2.FileWatcherCertificateProvider = void 0;
  var P_5 = UA("fs"),
    j_5 = zZ(),
    S_5 = E6(),
    __5 = UA("util"),
    k_5 = "certificate_provider";

  function x81(A) {
    j_5.trace(S_5.LogVerbosity.DEBUG, k_5, A)
  }
  var Y40 = (0, __5.promisify)(P_5.readFile);
  class Tw2 {
    constructor(A) {
      if (this.config = A, this.refreshTimer = null, this.fileResultPromise = null, this.latestCaUpdate = void 0, this.caListeners = new Set, this.latestIdentityUpdate = void 0, this.identityListeners = new Set, this.lastUpdateTime = null, A.certificateFile === void 0 !== (A.privateKeyFile === void 0)) throw Error("certificateFile and privateKeyFile must be set or unset together");
      if (A.certificateFile === void 0 && A.caCertificateFile === void 0) throw Error("At least one of certificateFile and caCertificateFile must be set");
      x81("File watcher constructed with config " + JSON.stringify(A))
    }
    updateCertificates() {
      if (this.fileResultPromise) return;
      this.fileResultPromise = Promise.allSettled([this.config.certificateFile ? Y40(this.config.certificateFile) : Promise.reject(), this.config.privateKeyFile ? Y40(this.config.privateKeyFile) : Promise.reject(), this.config.caCertificateFile ? Y40(this.config.caCertificateFile) : Promise.reject()]), this.fileResultPromise.then(([A, Q, B]) => {
        if (!this.refreshTimer) return;
        if (x81("File watcher read certificates certificate " + A.status + ", privateKey " + Q.status + ", CA certificate " + B.status), this.lastUpdateTime = new Date, this.fileResultPromise = null, A.status === "fulfilled" && Q.status === "fulfilled") this.latestIdentityUpdate = {
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
      }), x81("File watcher initiated certificate update")
    }
    maybeStartWatchingFiles() {
      if (!this.refreshTimer) {
        let A = this.lastUpdateTime ? new Date().getTime() - this.lastUpdateTime.getTime() : 1 / 0;
        if (A > this.config.refreshIntervalMs) this.updateCertificates();
        if (A > this.config.refreshIntervalMs * 2) this.latestCaUpdate = void 0, this.latestIdentityUpdate = void 0;
        this.refreshTimer = setInterval(() => this.updateCertificates(), this.config.refreshIntervalMs), x81("File watcher started watching")
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
  Pw2.FileWatcherCertificateProvider = Tw2
})
// @from(Start 11070214, End 11076697)
X40 = z((W5) => {
  Object.defineProperty(W5, "__esModule", {
    value: !0
  });
  W5.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = W5.createCertificateProviderChannelCredentials = W5.FileWatcherCertificateProvider = W5.createCertificateProviderServerCredentials = W5.createServerCredentialsWithInterceptors = W5.BaseSubchannelWrapper = W5.registerAdminService = W5.FilterStackFactory = W5.BaseFilter = W5.statusOrFromError = W5.statusOrFromValue = W5.PickResultType = W5.QueuePicker = W5.UnavailablePicker = W5.ChildLoadBalancerHandler = W5.EndpointMap = W5.endpointHasAddress = W5.endpointToString = W5.subchannelAddressToString = W5.LeafLoadBalancer = W5.isLoadBalancerNameRegistered = W5.parseLoadBalancingConfig = W5.selectLbConfigFromList = W5.registerLoadBalancerType = W5.createChildChannelControlHelper = W5.BackoffTimeout = W5.parseDuration = W5.durationToMs = W5.splitHostPort = W5.uriToString = W5.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = W5.createResolver = W5.registerResolver = W5.log = W5.trace = void 0;
  var _w2 = zZ();
  Object.defineProperty(W5, "trace", {
    enumerable: !0,
    get: function() {
      return _w2.trace
    }
  });
  Object.defineProperty(W5, "log", {
    enumerable: !0,
    get: function() {
      return _w2.log
    }
  });
  var J40 = CP();
  Object.defineProperty(W5, "registerResolver", {
    enumerable: !0,
    get: function() {
      return J40.registerResolver
    }
  });
  Object.defineProperty(W5, "createResolver", {
    enumerable: !0,
    get: function() {
      return J40.createResolver
    }
  });
  Object.defineProperty(W5, "CHANNEL_ARGS_CONFIG_SELECTOR_KEY", {
    enumerable: !0,
    get: function() {
      return J40.CHANNEL_ARGS_CONFIG_SELECTOR_KEY
    }
  });
  var kw2 = uE();
  Object.defineProperty(W5, "uriToString", {
    enumerable: !0,
    get: function() {
      return kw2.uriToString
    }
  });
  Object.defineProperty(W5, "splitHostPort", {
    enumerable: !0,
    get: function() {
      return kw2.splitHostPort
    }
  });
  var yw2 = aOA();
  Object.defineProperty(W5, "durationToMs", {
    enumerable: !0,
    get: function() {
      return yw2.durationToMs
    }
  });
  Object.defineProperty(W5, "parseDuration", {
    enumerable: !0,
    get: function() {
      return yw2.parseDuration
    }
  });
  var y_5 = QJA();
  Object.defineProperty(W5, "BackoffTimeout", {
    enumerable: !0,
    get: function() {
      return y_5.BackoffTimeout
    }
  });
  var tOA = li();
  Object.defineProperty(W5, "createChildChannelControlHelper", {
    enumerable: !0,
    get: function() {
      return tOA.createChildChannelControlHelper
    }
  });
  Object.defineProperty(W5, "registerLoadBalancerType", {
    enumerable: !0,
    get: function() {
      return tOA.registerLoadBalancerType
    }
  });
  Object.defineProperty(W5, "selectLbConfigFromList", {
    enumerable: !0,
    get: function() {
      return tOA.selectLbConfigFromList
    }
  });
  Object.defineProperty(W5, "parseLoadBalancingConfig", {
    enumerable: !0,
    get: function() {
      return tOA.parseLoadBalancingConfig
    }
  });
  Object.defineProperty(W5, "isLoadBalancerNameRegistered", {
    enumerable: !0,
    get: function() {
      return tOA.isLoadBalancerNameRegistered
    }
  });
  var x_5 = oOA();
  Object.defineProperty(W5, "LeafLoadBalancer", {
    enumerable: !0,
    get: function() {
      return x_5.LeafLoadBalancer
    }
  });
  var v81 = eU();
  Object.defineProperty(W5, "subchannelAddressToString", {
    enumerable: !0,
    get: function() {
      return v81.subchannelAddressToString
    }
  });
  Object.defineProperty(W5, "endpointToString", {
    enumerable: !0,
    get: function() {
      return v81.endpointToString
    }
  });
  Object.defineProperty(W5, "endpointHasAddress", {
    enumerable: !0,
    get: function() {
      return v81.endpointHasAddress
    }
  });
  Object.defineProperty(W5, "EndpointMap", {
    enumerable: !0,
    get: function() {
      return v81.EndpointMap
    }
  });
  var v_5 = y41();
  Object.defineProperty(W5, "ChildLoadBalancerHandler", {
    enumerable: !0,
    get: function() {
      return v_5.ChildLoadBalancerHandler
    }
  });
  var W40 = Ph();
  Object.defineProperty(W5, "UnavailablePicker", {
    enumerable: !0,
    get: function() {
      return W40.UnavailablePicker
    }
  });
  Object.defineProperty(W5, "QueuePicker", {
    enumerable: !0,
    get: function() {
      return W40.QueuePicker
    }
  });
  Object.defineProperty(W5, "PickResultType", {
    enumerable: !0,
    get: function() {
      return W40.PickResultType
    }
  });
  var xw2 = o1A();
  Object.defineProperty(W5, "statusOrFromValue", {
    enumerable: !0,
    get: function() {
      return xw2.statusOrFromValue
    }
  });
  Object.defineProperty(W5, "statusOrFromError", {
    enumerable: !0,
    get: function() {
      return xw2.statusOrFromError
    }
  });
  var b_5 = q90();
  Object.defineProperty(W5, "BaseFilter", {
    enumerable: !0,
    get: function() {
      return b_5.BaseFilter
    }
  });
  var f_5 = H81();
  Object.defineProperty(W5, "FilterStackFactory", {
    enumerable: !0,
    get: function() {
      return f_5.FilterStackFactory
    }
  });
  var h_5 = v41();
  Object.defineProperty(W5, "registerAdminService", {
    enumerable: !0,
    get: function() {
      return h_5.registerAdminService
    }
  });
  var g_5 = iOA();
  Object.defineProperty(W5, "BaseSubchannelWrapper", {
    enumerable: !0,
    get: function() {
      return g_5.BaseSubchannelWrapper
    }
  });
  var vw2 = T81();
  Object.defineProperty(W5, "createServerCredentialsWithInterceptors", {
    enumerable: !0,
    get: function() {
      return vw2.createServerCredentialsWithInterceptors
    }
  });
  Object.defineProperty(W5, "createCertificateProviderServerCredentials", {
    enumerable: !0,
    get: function() {
      return vw2.createCertificateProviderServerCredentials
    }
  });
  var u_5 = Sw2();
  Object.defineProperty(W5, "FileWatcherCertificateProvider", {
    enumerable: !0,
    get: function() {
      return u_5.FileWatcherCertificateProvider
    }
  });
  var m_5 = AJA();
  Object.defineProperty(W5, "createCertificateProviderChannelCredentials", {
    enumerable: !0,
    get: function() {
      return m_5.createCertificateProviderChannelCredentials
    }
  });
  var d_5 = d90();
  Object.defineProperty(W5, "SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX", {
    enumerable: !0,
    get: function() {
      return d_5.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX
    }
  })
})
// @from(Start 11076703, End 11077514)
hw2 = z((fw2) => {
  Object.defineProperty(fw2, "__esModule", {
    value: !0
  });
  fw2.setup = i_5;
  var p_5 = CP(),
    l_5 = o1A();
  class bw2 {
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
      if (!this.hasReturnedResult) this.hasReturnedResult = !0, process.nextTick(this.listener, (0, l_5.statusOrFromValue)(this.endpoints), {}, null, "")
    }
    destroy() {
      this.hasReturnedResult = !1
    }
    static getDefaultAuthority(A) {
      return "localhost"
    }
  }

  function i_5() {
    (0, p_5.registerResolver)("unix", bw2)
  }
})
// @from(Start 11077520, End 11079887)
lw2 = z((pw2) => {
  Object.defineProperty(pw2, "__esModule", {
    value: !0
  });
  pw2.setup = t_5;
  var gw2 = UA("net"),
    uw2 = o1A(),
    b81 = E6(),
    V40 = YK(),
    mw2 = CP(),
    a_5 = eU(),
    dw2 = uE(),
    s_5 = zZ(),
    r_5 = "ip_resolver";

  function cw2(A) {
    s_5.trace(b81.LogVerbosity.DEBUG, r_5, A)
  }
  var F40 = "ipv4",
    K40 = "ipv6",
    o_5 = 443;
  class D40 {
    constructor(A, Q, B) {
      var G;
      this.listener = Q, this.endpoints = [], this.error = null, this.hasReturnedResult = !1, cw2("Resolver constructed for target " + (0, dw2.uriToString)(A));
      let Z = [];
      if (!(A.scheme === F40 || A.scheme === K40)) {
        this.error = {
          code: b81.Status.UNAVAILABLE,
          details: `Unrecognized scheme ${A.scheme} in IP resolver`,
          metadata: new V40.Metadata
        };
        return
      }
      let I = A.path.split(",");
      for (let Y of I) {
        let J = (0, dw2.splitHostPort)(Y);
        if (J === null) {
          this.error = {
            code: b81.Status.UNAVAILABLE,
            details: `Failed to parse ${A.scheme} address ${Y}`,
            metadata: new V40.Metadata
          };
          return
        }
        if (A.scheme === F40 && !(0, gw2.isIPv4)(J.host) || A.scheme === K40 && !(0, gw2.isIPv6)(J.host)) {
          this.error = {
            code: b81.Status.UNAVAILABLE,
            details: `Failed to parse ${A.scheme} address ${Y}`,
            metadata: new V40.Metadata
          };
          return
        }
        Z.push({
          host: J.host,
          port: (G = J.port) !== null && G !== void 0 ? G : o_5
        })
      }
      this.endpoints = Z.map((Y) => ({
        addresses: [Y]
      })), cw2("Parsed " + A.scheme + " address list " + Z.map(a_5.subchannelAddressToString))
    }
    updateResolution() {
      if (!this.hasReturnedResult) this.hasReturnedResult = !0, process.nextTick(() => {
        if (this.error) this.listener((0, uw2.statusOrFromError)(this.error), {}, null, "");
        else this.listener((0, uw2.statusOrFromValue)(this.endpoints), {}, null, "")
      })
    }
    destroy() {
      this.hasReturnedResult = !1
    }
    static getDefaultAuthority(A) {
      return A.path.split(",")[0]
    }
  }

  function t_5() {
    (0, mw2.registerResolver)(F40, D40), (0, mw2.registerResolver)(K40, D40)
  }
})
// @from(Start 11079893, End 11084542)
tw2 = z((rw2) => {
  Object.defineProperty(rw2, "__esModule", {
    value: !0
  });
  rw2.RoundRobinLoadBalancer = void 0;
  rw2.setup = Ik5;
  var aw2 = li(),
    dD = mE(),
    eOA = Ph(),
    Ak5 = zZ(),
    Qk5 = E6(),
    iw2 = eU(),
    Bk5 = oOA(),
    Gk5 = "round_robin";

  function nw2(A) {
    Ak5.trace(Qk5.LogVerbosity.DEBUG, Gk5, A)
  }
  var f81 = "round_robin";
  class h81 {
    getLoadBalancerName() {
      return f81
    }
    constructor() {}
    toJsonObject() {
      return {
        [f81]: {}
      }
    }
    static createFromJson(A) {
      return new h81
    }
  }
  class sw2 {
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

  function Zk5(A, Q) {
    return [...A.slice(Q), ...A.slice(0, Q)]
  }
  class H40 {
    constructor(A) {
      this.channelControlHelper = A, this.children = [], this.currentState = dD.ConnectivityState.IDLE, this.currentReadyPicker = null, this.updatesPaused = !1, this.lastError = null, this.childChannelControlHelper = (0, aw2.createChildChannelControlHelper)(A, {
        updateState: (Q, B, G) => {
          if (this.currentState === dD.ConnectivityState.READY && Q !== dD.ConnectivityState.READY) this.channelControlHelper.requestReresolution();
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
      if (this.countChildrenWithState(dD.ConnectivityState.READY) > 0) {
        let A = this.children.filter((B) => B.getConnectivityState() === dD.ConnectivityState.READY),
          Q = 0;
        if (this.currentReadyPicker !== null) {
          let B = this.currentReadyPicker.peekNextEndpoint();
          if (Q = A.findIndex((G) => (0, iw2.endpointEqual)(G.getEndpoint(), B)), Q < 0) Q = 0
        }
        this.updateState(dD.ConnectivityState.READY, new sw2(A.map((B) => ({
          endpoint: B.getEndpoint(),
          picker: B.getPicker()
        })), Q), null)
      } else if (this.countChildrenWithState(dD.ConnectivityState.CONNECTING) > 0) this.updateState(dD.ConnectivityState.CONNECTING, new eOA.QueuePicker(this), null);
      else if (this.countChildrenWithState(dD.ConnectivityState.TRANSIENT_FAILURE) > 0) {
        let A = `round_robin: No connection established. Last error: ${this.lastError}`;
        this.updateState(dD.ConnectivityState.TRANSIENT_FAILURE, new eOA.UnavailablePicker({
          details: A
        }), A)
      } else this.updateState(dD.ConnectivityState.IDLE, new eOA.QueuePicker(this), null);
      for (let A of this.children)
        if (A.getConnectivityState() === dD.ConnectivityState.IDLE) A.exitIdle()
    }
    updateState(A, Q, B) {
      if (nw2(dD.ConnectivityState[this.currentState] + " -> " + dD.ConnectivityState[A]), A === dD.ConnectivityState.READY) this.currentReadyPicker = Q;
      else this.currentReadyPicker = null;
      this.currentState = A, this.channelControlHelper.updateState(A, Q, B)
    }
    resetSubchannelList() {
      for (let A of this.children) A.destroy();
      this.children = []
    }
    updateAddressList(A, Q, B, G) {
      if (!(Q instanceof h81)) return !1;
      if (!A.ok) {
        if (this.children.length === 0) this.updateState(dD.ConnectivityState.TRANSIENT_FAILURE, new eOA.UnavailablePicker(A.error), A.error.details);
        return !0
      }
      let Z = Math.random() * A.value.length | 0,
        I = Zk5(A.value, Z);
      if (this.resetSubchannelList(), I.length === 0) {
        let Y = `No addresses resolved. Resolution note: ${G}`;
        this.updateState(dD.ConnectivityState.TRANSIENT_FAILURE, new eOA.UnavailablePicker({
          details: Y
        }), Y)
      }
      nw2("Connect to endpoint list " + I.map(iw2.endpointToString)), this.updatesPaused = !0, this.children = I.map((Y) => new Bk5.LeafLoadBalancer(Y, this.childChannelControlHelper, B, G));
      for (let Y of this.children) Y.startConnecting();
      return this.updatesPaused = !1, this.calculateAndUpdateState(), !0
    }
    exitIdle() {}
    resetBackoff() {}
    destroy() {
      this.resetSubchannelList()
    }
    getTypeName() {
      return f81
    }
  }
  rw2.RoundRobinLoadBalancer = H40;

  function Ik5() {
    (0, aw2.registerLoadBalancerType)(f81, H40, h81)
  }
})