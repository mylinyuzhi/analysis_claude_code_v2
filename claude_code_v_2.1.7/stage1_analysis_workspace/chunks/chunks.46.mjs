
// @from(Ln 119876, Col 4)
ZtQ = U((VIG, GtQ) => {
  var {
    Writable: GN3
  } = NA("node:stream"), ZN3 = NA("node:assert"), {
    parserStates: mq,
    opcodes: gJA,
    states: YN3,
    emptyBuffer: nsQ,
    sentCloseFrameState: asQ
  } = XQA(), {
    kReadyState: JN3,
    kSentClose: osQ,
    kResponse: rsQ,
    kReceivedClose: ssQ
  } = XOA(), {
    channels: geA
  } = tYA(), {
    isValidStatusCode: XN3,
    isValidOpcode: IN3,
    failWebsocketConnection: NR,
    websocketMessageReceived: tsQ,
    utf8Decode: DN3,
    isControlFrame: esQ,
    isTextBinaryFrame: Ep1,
    isContinuationFrame: WN3
  } = WOA(), {
    WebsocketFrameSend: AtQ
  } = veA(), {
    closeWebSocketConnection: QtQ
  } = Hp1(), {
    PerMessageDeflate: KN3
  } = isQ();
  class BtQ extends GN3 {
    #A = [];
    #Q = 0;
    #B = !1;
    #Z = mq.INFO;
    #G = {};
    #X = [];
    #Y;
    constructor(A, Q) {
      super();
      if (this.ws = A, this.#Y = Q == null ? new Map : Q, this.#Y.has("permessage-deflate")) this.#Y.set("permessage-deflate", new KN3(Q))
    }
    _write(A, Q, B) {
      this.#A.push(A), this.#Q += A.length, this.#B = !0, this.run(B)
    }
    run(A) {
      while (this.#B)
        if (this.#Z === mq.INFO) {
          if (this.#Q < 2) return A();
          let Q = this.consume(2),
            B = (Q[0] & 128) !== 0,
            G = Q[0] & 15,
            Z = (Q[1] & 128) === 128,
            Y = !B && G !== gJA.CONTINUATION,
            J = Q[1] & 127,
            X = Q[0] & 64,
            I = Q[0] & 32,
            D = Q[0] & 16;
          if (!IN3(G)) return NR(this.ws, "Invalid opcode received"), A();
          if (Z) return NR(this.ws, "Frame cannot be masked"), A();
          if (X !== 0 && !this.#Y.has("permessage-deflate")) {
            NR(this.ws, "Expected RSV1 to be clear.");
            return
          }
          if (I !== 0 || D !== 0) {
            NR(this.ws, "RSV1, RSV2, RSV3 must be clear");
            return
          }
          if (Y && !Ep1(G)) {
            NR(this.ws, "Invalid frame type was fragmented.");
            return
          }
          if (Ep1(G) && this.#X.length > 0) {
            NR(this.ws, "Expected continuation frame");
            return
          }
          if (this.#G.fragmented && Y) {
            NR(this.ws, "Fragmented frame exceeded 125 bytes.");
            return
          }
          if ((J > 125 || Y) && esQ(G)) {
            NR(this.ws, "Control frame either too large or fragmented");
            return
          }
          if (WN3(G) && this.#X.length === 0 && !this.#G.compressed) {
            NR(this.ws, "Unexpected continuation frame");
            return
          }
          if (J <= 125) this.#G.payloadLength = J, this.#Z = mq.READ_DATA;
          else if (J === 126) this.#Z = mq.PAYLOADLENGTH_16;
          else if (J === 127) this.#Z = mq.PAYLOADLENGTH_64;
          if (Ep1(G)) this.#G.binaryType = G, this.#G.compressed = X !== 0;
          this.#G.opcode = G, this.#G.masked = Z, this.#G.fin = B, this.#G.fragmented = Y
        } else if (this.#Z === mq.PAYLOADLENGTH_16) {
        if (this.#Q < 2) return A();
        let Q = this.consume(2);
        this.#G.payloadLength = Q.readUInt16BE(0), this.#Z = mq.READ_DATA
      } else if (this.#Z === mq.PAYLOADLENGTH_64) {
        if (this.#Q < 8) return A();
        let Q = this.consume(8),
          B = Q.readUInt32BE(0);
        if (B > 2147483647) {
          NR(this.ws, "Received payload length > 2^31 bytes.");
          return
        }
        let G = Q.readUInt32BE(4);
        this.#G.payloadLength = (B << 8) + G, this.#Z = mq.READ_DATA
      } else if (this.#Z === mq.READ_DATA) {
        if (this.#Q < this.#G.payloadLength) return A();
        let Q = this.consume(this.#G.payloadLength);
        if (esQ(this.#G.opcode)) this.#B = this.parseControlFrame(Q), this.#Z = mq.INFO;
        else if (!this.#G.compressed) {
          if (this.#X.push(Q), !this.#G.fragmented && this.#G.fin) {
            let B = Buffer.concat(this.#X);
            tsQ(this.ws, this.#G.binaryType, B), this.#X.length = 0
          }
          this.#Z = mq.INFO
        } else {
          this.#Y.get("permessage-deflate").decompress(Q, this.#G.fin, (B, G) => {
            if (B) {
              QtQ(this.ws, 1007, B.message, B.message.length);
              return
            }
            if (this.#X.push(G), !this.#G.fin) {
              this.#Z = mq.INFO, this.#B = !0, this.run(A);
              return
            }
            tsQ(this.ws, this.#G.binaryType, Buffer.concat(this.#X)), this.#B = !0, this.#Z = mq.INFO, this.#X.length = 0, this.run(A)
          }), this.#B = !1;
          break
        }
      }
    }
    consume(A) {
      if (A > this.#Q) throw Error("Called consume() before buffers satiated.");
      else if (A === 0) return nsQ;
      if (this.#A[0].length === A) return this.#Q -= this.#A[0].length, this.#A.shift();
      let Q = Buffer.allocUnsafe(A),
        B = 0;
      while (B !== A) {
        let G = this.#A[0],
          {
            length: Z
          } = G;
        if (Z + B === A) {
          Q.set(this.#A.shift(), B);
          break
        } else if (Z + B > A) {
          Q.set(G.subarray(0, A - B), B), this.#A[0] = G.subarray(A - B);
          break
        } else Q.set(this.#A.shift(), B), B += G.length
      }
      return this.#Q -= A, Q
    }
    parseCloseBody(A) {
      ZN3(A.length !== 1);
      let Q;
      if (A.length >= 2) Q = A.readUInt16BE(0);
      if (Q !== void 0 && !XN3(Q)) return {
        code: 1002,
        reason: "Invalid status code",
        error: !0
      };
      let B = A.subarray(2);
      if (B[0] === 239 && B[1] === 187 && B[2] === 191) B = B.subarray(3);
      try {
        B = DN3(B)
      } catch {
        return {
          code: 1007,
          reason: "Invalid UTF-8",
          error: !0
        }
      }
      return {
        code: Q,
        reason: B,
        error: !1
      }
    }
    parseControlFrame(A) {
      let {
        opcode: Q,
        payloadLength: B
      } = this.#G;
      if (Q === gJA.CLOSE) {
        if (B === 1) return NR(this.ws, "Received close frame with a 1-byte body."), !1;
        if (this.#G.closeInfo = this.parseCloseBody(A), this.#G.closeInfo.error) {
          let {
            code: G,
            reason: Z
          } = this.#G.closeInfo;
          return QtQ(this.ws, G, Z, Z.length), NR(this.ws, Z), !1
        }
        if (this.ws[osQ] !== asQ.SENT) {
          let G = nsQ;
          if (this.#G.closeInfo.code) G = Buffer.allocUnsafe(2), G.writeUInt16BE(this.#G.closeInfo.code, 0);
          let Z = new AtQ(G);
          this.ws[rsQ].socket.write(Z.createFrame(gJA.CLOSE), (Y) => {
            if (!Y) this.ws[osQ] = asQ.SENT
          })
        }
        return this.ws[JN3] = YN3.CLOSING, this.ws[ssQ] = !0, !1
      } else if (Q === gJA.PING) {
        if (!this.ws[ssQ]) {
          let G = new AtQ(A);
          if (this.ws[rsQ].socket.write(G.createFrame(gJA.PONG)), geA.ping.hasSubscribers) geA.ping.publish({
            payload: A
          })
        }
      } else if (Q === gJA.PONG) {
        if (geA.pong.hasSubscribers) geA.pong.publish({
          payload: A
        })
      }
      return !0
    }
    get closingInfo() {
      return this.#G.closeInfo
    }
  }
  GtQ.exports = {
    ByteParser: BtQ
  }
})
// @from(Ln 120103, Col 4)
WtQ = U((FIG, DtQ) => {
  var {
    WebsocketFrameSend: VN3
  } = veA(), {
    opcodes: YtQ,
    sendHints: uJA
  } = XQA(), FN3 = ed1(), JtQ = Buffer[Symbol.species];
  class ItQ {
    #A = new FN3;
    #Q = !1;
    #B;
    constructor(A) {
      this.#B = A
    }
    add(A, Q, B) {
      if (B !== uJA.blob) {
        let Z = XtQ(A, B);
        if (!this.#Q) this.#B.write(Z, Q);
        else {
          let Y = {
            promise: null,
            callback: Q,
            frame: Z
          };
          this.#A.push(Y)
        }
        return
      }
      let G = {
        promise: A.arrayBuffer().then((Z) => {
          G.promise = null, G.frame = XtQ(Z, B)
        }),
        callback: Q,
        frame: null
      };
      if (this.#A.push(G), !this.#Q) this.#Z()
    }
    async #Z() {
      this.#Q = !0;
      let A = this.#A;
      while (!A.isEmpty()) {
        let Q = A.shift();
        if (Q.promise !== null) await Q.promise;
        this.#B.write(Q.frame, Q.callback), Q.callback = Q.frame = null
      }
      this.#Q = !1
    }
  }

  function XtQ(A, Q) {
    return new VN3(HN3(A, Q)).createFrame(Q === uJA.string ? YtQ.TEXT : YtQ.BINARY)
  }

  function HN3(A, Q) {
    switch (Q) {
      case uJA.string:
        return Buffer.from(A);
      case uJA.arrayBuffer:
      case uJA.blob:
        return new JtQ(A);
      case uJA.typedArray:
        return new JtQ(A.buffer, A.byteOffset, A.byteLength)
    }
  }
  DtQ.exports = {
    SendQueue: ItQ
  }
})
// @from(Ln 120171, Col 4)
UtQ = U((HIG, CtQ) => {
  var {
    webidl: q6
  } = xH(), {
    URLSerializer: EN3
  } = bq(), {
    environmentSettingsObject: KtQ
  } = zL(), {
    staticPropertyDescriptors: kn,
    states: HOA,
    sentCloseFrameState: zN3,
    sendHints: ueA
  } = XQA(), {
    kWebSocketURL: VtQ,
    kReadyState: zp1,
    kController: $N3,
    kBinaryType: meA,
    kResponse: FtQ,
    kSentClose: CN3,
    kByteParser: UN3
  } = XOA(), {
    isConnecting: qN3,
    isEstablished: NN3,
    isClosing: wN3,
    isValidSubprotocol: LN3,
    fireEvent: HtQ
  } = WOA(), {
    establishWebSocketConnection: ON3,
    closeWebSocketConnection: EtQ
  } = Hp1(), {
    ByteParser: MN3
  } = ZtQ(), {
    kEnumerableProperty: wR,
    isBlobLike: ztQ
  } = b8(), {
    getGlobalDispatcher: RN3
  } = XeA(), {
    types: $tQ
  } = NA("node:util"), {
    ErrorEvent: _N3,
    CloseEvent: jN3
  } = bJA(), {
    SendQueue: TN3
  } = WtQ();
  class jG extends EventTarget {
    #A = {
      open: null,
      error: null,
      close: null,
      message: null
    };
    #Q = 0;
    #B = "";
    #Z = "";
    #G;
    constructor(A, Q = []) {
      super();
      q6.util.markAsUncloneable(this);
      let B = "WebSocket constructor";
      q6.argumentLengthCheck(arguments, 1, B);
      let G = q6.converters["DOMString or sequence<DOMString> or WebSocketInit"](Q, B, "options");
      A = q6.converters.USVString(A, B, "url"), Q = G.protocols;
      let Z = KtQ.settingsObject.baseUrl,
        Y;
      try {
        Y = new URL(A, Z)
      } catch (X) {
        throw new DOMException(X, "SyntaxError")
      }
      if (Y.protocol === "http:") Y.protocol = "ws:";
      else if (Y.protocol === "https:") Y.protocol = "wss:";
      if (Y.protocol !== "ws:" && Y.protocol !== "wss:") throw new DOMException(`Expected a ws: or wss: protocol, got ${Y.protocol}`, "SyntaxError");
      if (Y.hash || Y.href.endsWith("#")) throw new DOMException("Got fragment", "SyntaxError");
      if (typeof Q === "string") Q = [Q];
      if (Q.length !== new Set(Q.map((X) => X.toLowerCase())).size) throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
      if (Q.length > 0 && !Q.every((X) => LN3(X))) throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
      this[VtQ] = new URL(Y.href);
      let J = KtQ.settingsObject;
      this[$N3] = ON3(Y, Q, J, this, (X, I) => this.#X(X, I), G), this[zp1] = jG.CONNECTING, this[CN3] = zN3.NOT_SENT, this[meA] = "blob"
    }
    close(A = void 0, Q = void 0) {
      q6.brandCheck(this, jG);
      let B = "WebSocket.close";
      if (A !== void 0) A = q6.converters["unsigned short"](A, B, "code", {
        clamp: !0
      });
      if (Q !== void 0) Q = q6.converters.USVString(Q, B, "reason");
      if (A !== void 0) {
        if (A !== 1000 && (A < 3000 || A > 4999)) throw new DOMException("invalid code", "InvalidAccessError")
      }
      let G = 0;
      if (Q !== void 0) {
        if (G = Buffer.byteLength(Q), G > 123) throw new DOMException(`Reason must be less than 123 bytes; received ${G}`, "SyntaxError")
      }
      EtQ(this, A, Q, G)
    }
    send(A) {
      q6.brandCheck(this, jG);
      let Q = "WebSocket.send";
      if (q6.argumentLengthCheck(arguments, 1, Q), A = q6.converters.WebSocketSendData(A, Q, "data"), qN3(this)) throw new DOMException("Sent before connected.", "InvalidStateError");
      if (!NN3(this) || wN3(this)) return;
      if (typeof A === "string") {
        let B = Buffer.byteLength(A);
        this.#Q += B, this.#G.add(A, () => {
          this.#Q -= B
        }, ueA.string)
      } else if ($tQ.isArrayBuffer(A)) this.#Q += A.byteLength, this.#G.add(A, () => {
        this.#Q -= A.byteLength
      }, ueA.arrayBuffer);
      else if (ArrayBuffer.isView(A)) this.#Q += A.byteLength, this.#G.add(A, () => {
        this.#Q -= A.byteLength
      }, ueA.typedArray);
      else if (ztQ(A)) this.#Q += A.size, this.#G.add(A, () => {
        this.#Q -= A.size
      }, ueA.blob)
    }
    get readyState() {
      return q6.brandCheck(this, jG), this[zp1]
    }
    get bufferedAmount() {
      return q6.brandCheck(this, jG), this.#Q
    }
    get url() {
      return q6.brandCheck(this, jG), EN3(this[VtQ])
    }
    get extensions() {
      return q6.brandCheck(this, jG), this.#Z
    }
    get protocol() {
      return q6.brandCheck(this, jG), this.#B
    }
    get onopen() {
      return q6.brandCheck(this, jG), this.#A.open
    }
    set onopen(A) {
      if (q6.brandCheck(this, jG), this.#A.open) this.removeEventListener("open", this.#A.open);
      if (typeof A === "function") this.#A.open = A, this.addEventListener("open", A);
      else this.#A.open = null
    }
    get onerror() {
      return q6.brandCheck(this, jG), this.#A.error
    }
    set onerror(A) {
      if (q6.brandCheck(this, jG), this.#A.error) this.removeEventListener("error", this.#A.error);
      if (typeof A === "function") this.#A.error = A, this.addEventListener("error", A);
      else this.#A.error = null
    }
    get onclose() {
      return q6.brandCheck(this, jG), this.#A.close
    }
    set onclose(A) {
      if (q6.brandCheck(this, jG), this.#A.close) this.removeEventListener("close", this.#A.close);
      if (typeof A === "function") this.#A.close = A, this.addEventListener("close", A);
      else this.#A.close = null
    }
    get onmessage() {
      return q6.brandCheck(this, jG), this.#A.message
    }
    set onmessage(A) {
      if (q6.brandCheck(this, jG), this.#A.message) this.removeEventListener("message", this.#A.message);
      if (typeof A === "function") this.#A.message = A, this.addEventListener("message", A);
      else this.#A.message = null
    }
    get binaryType() {
      return q6.brandCheck(this, jG), this[meA]
    }
    set binaryType(A) {
      if (q6.brandCheck(this, jG), A !== "blob" && A !== "arraybuffer") this[meA] = "blob";
      else this[meA] = A
    }
    #X(A, Q) {
      this[FtQ] = A;
      let B = new MN3(this, Q);
      B.on("drain", PN3), B.on("error", SN3.bind(this)), A.socket.ws = this, this[UN3] = B, this.#G = new TN3(A.socket), this[zp1] = HOA.OPEN;
      let G = A.headersList.get("sec-websocket-extensions");
      if (G !== null) this.#Z = G;
      let Z = A.headersList.get("sec-websocket-protocol");
      if (Z !== null) this.#B = Z;
      HtQ("open", this)
    }
  }
  jG.CONNECTING = jG.prototype.CONNECTING = HOA.CONNECTING;
  jG.OPEN = jG.prototype.OPEN = HOA.OPEN;
  jG.CLOSING = jG.prototype.CLOSING = HOA.CLOSING;
  jG.CLOSED = jG.prototype.CLOSED = HOA.CLOSED;
  Object.defineProperties(jG.prototype, {
    CONNECTING: kn,
    OPEN: kn,
    CLOSING: kn,
    CLOSED: kn,
    url: wR,
    readyState: wR,
    bufferedAmount: wR,
    onopen: wR,
    onerror: wR,
    onclose: wR,
    close: wR,
    onmessage: wR,
    binaryType: wR,
    send: wR,
    extensions: wR,
    protocol: wR,
    [Symbol.toStringTag]: {
      value: "WebSocket",
      writable: !1,
      enumerable: !1,
      configurable: !0
    }
  });
  Object.defineProperties(jG, {
    CONNECTING: kn,
    OPEN: kn,
    CLOSING: kn,
    CLOSED: kn
  });
  q6.converters["sequence<DOMString>"] = q6.sequenceConverter(q6.converters.DOMString);
  q6.converters["DOMString or sequence<DOMString>"] = function (A, Q, B) {
    if (q6.util.Type(A) === "Object" && Symbol.iterator in A) return q6.converters["sequence<DOMString>"](A);
    return q6.converters.DOMString(A, Q, B)
  };
  q6.converters.WebSocketInit = q6.dictionaryConverter([{
    key: "protocols",
    converter: q6.converters["DOMString or sequence<DOMString>"],
    defaultValue: () => []
  }, {
    key: "dispatcher",
    converter: q6.converters.any,
    defaultValue: () => RN3()
  }, {
    key: "headers",
    converter: q6.nullableConverter(q6.converters.HeadersInit)
  }]);
  q6.converters["DOMString or sequence<DOMString> or WebSocketInit"] = function (A) {
    if (q6.util.Type(A) === "Object" && !(Symbol.iterator in A)) return q6.converters.WebSocketInit(A);
    return {
      protocols: q6.converters["DOMString or sequence<DOMString>"](A)
    }
  };
  q6.converters.WebSocketSendData = function (A) {
    if (q6.util.Type(A) === "Object") {
      if (ztQ(A)) return q6.converters.Blob(A, {
        strict: !1
      });
      if (ArrayBuffer.isView(A) || $tQ.isArrayBuffer(A)) return q6.converters.BufferSource(A)
    }
    return q6.converters.USVString(A)
  };

  function PN3() {
    this.ws[FtQ].socket.resume()
  }

  function SN3(A) {
    let Q, B;
    if (A instanceof jN3) Q = A.reason, B = A.code;
    else Q = A.message;
    HtQ("error", this, () => new _N3("error", {
      error: A,
      message: Q
    })), EtQ(this, B)
  }
  CtQ.exports = {
    WebSocket: jG
  }
})
// @from(Ln 120436, Col 4)
$p1 = U((EIG, qtQ) => {
  function xN3(A) {
    return A.indexOf("\x00") === -1
  }

  function yN3(A) {
    if (A.length === 0) return !1;
    for (let Q = 0; Q < A.length; Q++)
      if (A.charCodeAt(Q) < 48 || A.charCodeAt(Q) > 57) return !1;
    return !0
  }

  function vN3(A) {
    return new Promise((Q) => {
      setTimeout(Q, A).unref()
    })
  }
  qtQ.exports = {
    isValidLastEventId: xN3,
    isASCIINumber: yN3,
    delay: vN3
  }
})
// @from(Ln 120459, Col 4)
MtQ = U((zIG, OtQ) => {
  var {
    Transform: kN3
  } = NA("node:stream"), {
    isASCIINumber: NtQ,
    isValidLastEventId: wtQ
  } = $p1(), qu = [239, 187, 191];
  class LtQ extends kN3 {
    state = null;
    checkBOM = !0;
    crlfCheck = !1;
    eventEndCheck = !1;
    buffer = null;
    pos = 0;
    event = {
      data: void 0,
      event: void 0,
      id: void 0,
      retry: void 0
    };
    constructor(A = {}) {
      A.readableObjectMode = !0;
      super(A);
      if (this.state = A.eventSourceSettings || {}, A.push) this.push = A.push
    }
    _transform(A, Q, B) {
      if (A.length === 0) {
        B();
        return
      }
      if (this.buffer) this.buffer = Buffer.concat([this.buffer, A]);
      else this.buffer = A;
      if (this.checkBOM) switch (this.buffer.length) {
        case 1:
          if (this.buffer[0] === qu[0]) {
            B();
            return
          }
          this.checkBOM = !1, B();
          return;
        case 2:
          if (this.buffer[0] === qu[0] && this.buffer[1] === qu[1]) {
            B();
            return
          }
          this.checkBOM = !1;
          break;
        case 3:
          if (this.buffer[0] === qu[0] && this.buffer[1] === qu[1] && this.buffer[2] === qu[2]) {
            this.buffer = Buffer.alloc(0), this.checkBOM = !1, B();
            return
          }
          this.checkBOM = !1;
          break;
        default:
          if (this.buffer[0] === qu[0] && this.buffer[1] === qu[1] && this.buffer[2] === qu[2]) this.buffer = this.buffer.subarray(3);
          this.checkBOM = !1;
          break
      }
      while (this.pos < this.buffer.length) {
        if (this.eventEndCheck) {
          if (this.crlfCheck) {
            if (this.buffer[this.pos] === 10) {
              this.buffer = this.buffer.subarray(this.pos + 1), this.pos = 0, this.crlfCheck = !1;
              continue
            }
            this.crlfCheck = !1
          }
          if (this.buffer[this.pos] === 10 || this.buffer[this.pos] === 13) {
            if (this.buffer[this.pos] === 13) this.crlfCheck = !0;
            if (this.buffer = this.buffer.subarray(this.pos + 1), this.pos = 0, this.event.data !== void 0 || this.event.event || this.event.id || this.event.retry) this.processEvent(this.event);
            this.clearEvent();
            continue
          }
          this.eventEndCheck = !1;
          continue
        }
        if (this.buffer[this.pos] === 10 || this.buffer[this.pos] === 13) {
          if (this.buffer[this.pos] === 13) this.crlfCheck = !0;
          this.parseLine(this.buffer.subarray(0, this.pos), this.event), this.buffer = this.buffer.subarray(this.pos + 1), this.pos = 0, this.eventEndCheck = !0;
          continue
        }
        this.pos++
      }
      B()
    }
    parseLine(A, Q) {
      if (A.length === 0) return;
      let B = A.indexOf(58);
      if (B === 0) return;
      let G = "",
        Z = "";
      if (B !== -1) {
        G = A.subarray(0, B).toString("utf8");
        let Y = B + 1;
        if (A[Y] === 32) ++Y;
        Z = A.subarray(Y).toString("utf8")
      } else G = A.toString("utf8"), Z = "";
      switch (G) {
        case "data":
          if (Q[G] === void 0) Q[G] = Z;
          else Q[G] += `
${Z}`;
          break;
        case "retry":
          if (NtQ(Z)) Q[G] = Z;
          break;
        case "id":
          if (wtQ(Z)) Q[G] = Z;
          break;
        case "event":
          if (Z.length > 0) Q[G] = Z;
          break
      }
    }
    processEvent(A) {
      if (A.retry && NtQ(A.retry)) this.state.reconnectionTime = parseInt(A.retry, 10);
      if (A.id && wtQ(A.id)) this.state.lastEventId = A.id;
      if (A.data !== void 0) this.push({
        type: A.event || "message",
        options: {
          data: A.data,
          lastEventId: this.state.lastEventId,
          origin: this.state.origin
        }
      })
    }
    clearEvent() {
      this.event = {
        data: void 0,
        event: void 0,
        id: void 0,
        retry: void 0
      }
    }
  }
  OtQ.exports = {
    EventSourceStream: LtQ
  }
})
// @from(Ln 120599, Col 4)
ytQ = U(($IG, xtQ) => {
  var {
    pipeline: bN3
  } = NA("node:stream"), {
    fetching: fN3
  } = BOA(), {
    makeRequest: hN3
  } = PJA(), {
    webidl: Nu
  } = xH(), {
    EventSourceStream: gN3
  } = MtQ(), {
    parseMIMEType: uN3
  } = bq(), {
    createFastMessageEvent: mN3
  } = bJA(), {
    isNetworkError: RtQ
  } = AOA(), {
    delay: dN3
  } = $p1(), {
    kEnumerableProperty: IQA
  } = b8(), {
    environmentSettingsObject: _tQ
  } = zL(), jtQ = !1, TtQ = 3000, EOA = 0, PtQ = 1, zOA = 2, cN3 = "anonymous", pN3 = "use-credentials";
  class mJA extends EventTarget {
    #A = {
      open: null,
      error: null,
      message: null
    };
    #Q = null;
    #B = !1;
    #Z = EOA;
    #G = null;
    #X = null;
    #Y;
    #W;
    constructor(A, Q = {}) {
      super();
      Nu.util.markAsUncloneable(this);
      let B = "EventSource constructor";
      if (Nu.argumentLengthCheck(arguments, 1, B), !jtQ) jtQ = !0, process.emitWarning("EventSource is experimental, expect them to change at any time.", {
        code: "UNDICI-ES"
      });
      A = Nu.converters.USVString(A, B, "url"), Q = Nu.converters.EventSourceInitDict(Q, B, "eventSourceInitDict"), this.#Y = Q.dispatcher, this.#W = {
        lastEventId: "",
        reconnectionTime: TtQ
      };
      let G = _tQ,
        Z;
      try {
        Z = new URL(A, G.settingsObject.baseUrl), this.#W.origin = Z.origin
      } catch (X) {
        throw new DOMException(X, "SyntaxError")
      }
      this.#Q = Z.href;
      let Y = cN3;
      if (Q.withCredentials) Y = pN3, this.#B = !0;
      let J = {
        redirect: "follow",
        keepalive: !0,
        mode: "cors",
        credentials: Y === "anonymous" ? "same-origin" : "omit",
        referrer: "no-referrer"
      };
      J.client = _tQ.settingsObject, J.headersList = [
        ["accept", {
          name: "accept",
          value: "text/event-stream"
        }]
      ], J.cache = "no-store", J.initiator = "other", J.urlList = [new URL(this.#Q)], this.#G = hN3(J), this.#K()
    }
    get readyState() {
      return this.#Z
    }
    get url() {
      return this.#Q
    }
    get withCredentials() {
      return this.#B
    }
    #K() {
      if (this.#Z === zOA) return;
      this.#Z = EOA;
      let A = {
          request: this.#G,
          dispatcher: this.#Y
        },
        Q = (B) => {
          if (RtQ(B)) this.dispatchEvent(new Event("error")), this.close();
          this.#I()
        };
      A.processResponseEndOfBody = Q, A.processResponse = (B) => {
        if (RtQ(B))
          if (B.aborted) {
            this.close(), this.dispatchEvent(new Event("error"));
            return
          } else {
            this.#I();
            return
          } let G = B.headersList.get("content-type", !0),
          Z = G !== null ? uN3(G) : "failure",
          Y = Z !== "failure" && Z.essence === "text/event-stream";
        if (B.status !== 200 || Y === !1) {
          this.close(), this.dispatchEvent(new Event("error"));
          return
        }
        this.#Z = PtQ, this.dispatchEvent(new Event("open")), this.#W.origin = B.urlList[B.urlList.length - 1].origin;
        let J = new gN3({
          eventSourceSettings: this.#W,
          push: (X) => {
            this.dispatchEvent(mN3(X.type, X.options))
          }
        });
        bN3(B.body.stream, J, (X) => {
          if (X?.aborted === !1) this.close(), this.dispatchEvent(new Event("error"))
        })
      }, this.#X = fN3(A)
    }
    async #I() {
      if (this.#Z === zOA) return;
      if (this.#Z = EOA, this.dispatchEvent(new Event("error")), await dN3(this.#W.reconnectionTime), this.#Z !== EOA) return;
      if (this.#W.lastEventId.length) this.#G.headersList.set("last-event-id", this.#W.lastEventId, !0);
      this.#K()
    }
    close() {
      if (Nu.brandCheck(this, mJA), this.#Z === zOA) return;
      this.#Z = zOA, this.#X.abort(), this.#G = null
    }
    get onopen() {
      return this.#A.open
    }
    set onopen(A) {
      if (this.#A.open) this.removeEventListener("open", this.#A.open);
      if (typeof A === "function") this.#A.open = A, this.addEventListener("open", A);
      else this.#A.open = null
    }
    get onmessage() {
      return this.#A.message
    }
    set onmessage(A) {
      if (this.#A.message) this.removeEventListener("message", this.#A.message);
      if (typeof A === "function") this.#A.message = A, this.addEventListener("message", A);
      else this.#A.message = null
    }
    get onerror() {
      return this.#A.error
    }
    set onerror(A) {
      if (this.#A.error) this.removeEventListener("error", this.#A.error);
      if (typeof A === "function") this.#A.error = A, this.addEventListener("error", A);
      else this.#A.error = null
    }
  }
  var StQ = {
    CONNECTING: {
      __proto__: null,
      configurable: !1,
      enumerable: !0,
      value: EOA,
      writable: !1
    },
    OPEN: {
      __proto__: null,
      configurable: !1,
      enumerable: !0,
      value: PtQ,
      writable: !1
    },
    CLOSED: {
      __proto__: null,
      configurable: !1,
      enumerable: !0,
      value: zOA,
      writable: !1
    }
  };
  Object.defineProperties(mJA, StQ);
  Object.defineProperties(mJA.prototype, StQ);
  Object.defineProperties(mJA.prototype, {
    close: IQA,
    onerror: IQA,
    onmessage: IQA,
    onopen: IQA,
    readyState: IQA,
    url: IQA,
    withCredentials: IQA
  });
  Nu.converters.EventSourceInitDict = Nu.dictionaryConverter([{
    key: "withCredentials",
    converter: Nu.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "dispatcher",
    converter: Nu.converters.any
  }]);
  xtQ.exports = {
    EventSource: mJA,
    defaultReconnectionTime: TtQ
  }
})
// @from(Ln 120801, Col 0)
function $OA(A) {
  return (Q, B, G) => {
    if (typeof B === "function") G = B, B = null;
    if (!Q || typeof Q !== "string" && typeof Q !== "object" && !(Q instanceof URL)) throw new deA("invalid url");
    if (B != null && typeof B !== "object") throw new deA("invalid opts");
    if (B && B.path != null) {
      if (typeof B.path !== "string") throw new deA("invalid opts.path");
      let J = B.path;
      if (!B.path.startsWith("/")) J = `/${J}`;
      Q = new URL(ceA.parseOrigin(Q).origin + J)
    } else {
      if (!B) B = typeof Q === "object" ? Q : {};
      Q = ceA.parseURL(Q)
    }
    let {
      agent: Z,
      dispatcher: Y = oN3()
    } = B;
    if (Z) throw new deA("unsupported opts.agent. Did you mean opts.client?");
    return A.call(Y, {
      ...B,
      origin: Q.origin,
      path: Q.search ? `${Q.pathname}${Q.search}` : Q.pathname,
      method: B.method || (B.body ? "PUT" : "GET")
    }, G)
  }
}
// @from(Ln 120828, Col 4)
CIG
// @from(Ln 120828, Col 9)
lN3
// @from(Ln 120828, Col 14)
UIG
// @from(Ln 120828, Col 19)
qIG
// @from(Ln 120828, Col 24)
iN3
// @from(Ln 120828, Col 29)
NIG
// @from(Ln 120828, Col 34)
nN3
// @from(Ln 120828, Col 39)
wIG
// @from(Ln 120828, Col 44)
aN3
// @from(Ln 120828, Col 49)
ceA
// @from(Ln 120828, Col 54)
deA
// @from(Ln 120828, Col 59)
dJA
// @from(Ln 120828, Col 64)
LIG
// @from(Ln 120828, Col 69)
OIG
// @from(Ln 120828, Col 74)
MIG
// @from(Ln 120828, Col 79)
RIG
// @from(Ln 120828, Col 84)
_IG
// @from(Ln 120828, Col 89)
jIG
// @from(Ln 120828, Col 94)
oN3
// @from(Ln 120828, Col 99)
rN3
// @from(Ln 120828, Col 104)
TIG
// @from(Ln 120828, Col 109)
PIG
// @from(Ln 120828, Col 114)
SIG
// @from(Ln 120828, Col 119)
Cp1
// @from(Ln 120828, Col 124)
Up1
// @from(Ln 120828, Col 129)
eN3
// @from(Ln 120828, Col 134)
Aw3
// @from(Ln 120828, Col 139)
peA
// @from(Ln 120828, Col 144)
xIG
// @from(Ln 120828, Col 149)
Qw3
// @from(Ln 120828, Col 154)
Bw3
// @from(Ln 120828, Col 159)
Gw3
// @from(Ln 120828, Col 164)
Zw3
// @from(Ln 120828, Col 169)
Yw3
// @from(Ln 120828, Col 174)
Jw3
// @from(Ln 120828, Col 179)
yIG
// @from(Ln 120828, Col 184)
vIG
// @from(Ln 120828, Col 189)
sN3
// @from(Ln 120828, Col 194)
tN3
// @from(Ln 120828, Col 199)
Xw3
// @from(Ln 120828, Col 204)
kIG
// @from(Ln 120828, Col 209)
bIG
// @from(Ln 120828, Col 214)
fIG
// @from(Ln 120828, Col 219)
hIG
// @from(Ln 120828, Col 224)
gIG
// @from(Ln 120828, Col 229)
uIG
// @from(Ln 120828, Col 234)
mIG
// @from(Ln 120828, Col 239)
dIG
// @from(Ln 120828, Col 244)
cIG
// @from(Ln 120828, Col 249)
Iw3
// @from(Ln 120828, Col 254)
Dw3
// @from(Ln 120828, Col 259)
Ww3
// @from(Ln 120828, Col 264)
Kw3
// @from(Ln 120828, Col 269)
Vw3
// @from(Ln 120828, Col 274)
Fw3
// @from(Ln 120828, Col 279)
pIG
// @from(Ln 120829, Col 4)
qp1 = w(() => {
  CIG = hLA(), lN3 = $LA(), UIG = CJA(), qIG = znQ(), iN3 = UJA(), NIG = Kc1(), nN3 = bnQ(), wIG = cnQ(), aN3 = GG(), ceA = b8(), {
    InvalidArgumentError: deA
  } = aN3, dJA = baQ(), LIG = ULA(), OIG = bc1(), MIG = NoQ(), RIG = hc1(), _IG = Mc1(), jIG = ttA(), {
    getGlobalDispatcher: oN3,
    setGlobalDispatcher: rN3
  } = XeA(), TIG = IeA(), PIG = dtA(), SIG = ctA();
  Object.assign(lN3.prototype, dJA);
  Cp1 = iN3, Up1 = nN3, eN3 = {
    redirect: joQ(),
    retry: PoQ(),
    dump: yoQ(),
    dns: hoQ()
  }, Aw3 = {
    parseHeaders: ceA.parseHeaders,
    headerNameToString: ceA.headerNameToString
  };
  peA = rN3;
  xIG = BOA().fetch;
  Qw3 = BQA().Headers, Bw3 = AOA().Response, Gw3 = PJA().Request, Zw3 = MLA().FormData, Yw3 = globalThis.File ?? NA("node:buffer").File, Jw3 = AsQ().FileReader;
  ({
    setGlobalOrigin: yIG,
    getGlobalOrigin: vIG
  } = wd1()), {
    CacheStorage: sN3
  } = DsQ(), {
    kConstruct: tN3
  } = jeA();
  Xw3 = new sN3(tN3);
  ({
    deleteCookie: kIG,
    getCookies: bIG,
    getSetCookies: fIG,
    setCookie: hIG
  } = NsQ()), {
    parseMIMEType: gIG,
    serializeAMimeType: uIG
  } = bq(), {
    CloseEvent: mIG,
    ErrorEvent: dIG,
    MessageEvent: cIG
  } = bJA();
  Iw3 = UtQ().WebSocket, Dw3 = $OA(dJA.request), Ww3 = $OA(dJA.stream), Kw3 = $OA(dJA.pipeline), Vw3 = $OA(dJA.connect), Fw3 = $OA(dJA.upgrade);
  ({
    EventSource: pIG
  } = ytQ())
})
// @from(Ln 120880, Col 0)
function Np1() {
  let A = tT();
  if (!A) return;
  return {
    cert: A.cert,
    key: A.key,
    passphrase: A.passphrase
  }
}
// @from(Ln 120890, Col 0)
function wp1() {
  let A = tT();
  if (!A) return {};
  let Q = {
      cert: A.cert,
      key: A.key,
      passphrase: A.passphrase
    },
    B = new Cp1({
      connect: Q,
      pipelining: 1
    });
  return k("mTLS: Created undici agent with custom certificates"), {
    dispatcher: B
  }
}
// @from(Ln 120907, Col 0)
function btQ() {
  if (!tT()) return;
  if (process.env.NODE_EXTRA_CA_CERTS) k("NODE_EXTRA_CA_CERTS detected - Node.js will automatically append to built-in CAs")
}
// @from(Ln 120911, Col 4)
tT
// @from(Ln 120911, Col 8)
ktQ
// @from(Ln 120912, Col 4)
cJA = w(() => {
  Y9();
  qp1();
  T1();
  DQ();
  tT = W0(() => {
    let A = {};
    if (process.env.CLAUDE_CODE_CLIENT_CERT) try {
      A.cert = vA().readFileSync(process.env.CLAUDE_CODE_CLIENT_CERT, {
        encoding: "utf8"
      }), k("mTLS: Loaded client certificate from CLAUDE_CODE_CLIENT_CERT")
    } catch (Q) {
      k(`mTLS: Failed to load client certificate: ${Q}`, {
        level: "error"
      })
    }
    if (process.env.CLAUDE_CODE_CLIENT_KEY) try {
      A.key = vA().readFileSync(process.env.CLAUDE_CODE_CLIENT_KEY, {
        encoding: "utf8"
      }), k("mTLS: Loaded client key from CLAUDE_CODE_CLIENT_KEY")
    } catch (Q) {
      k(`mTLS: Failed to load client key: ${Q}`, {
        level: "error"
      })
    }
    if (process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE) A.passphrase = process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE, k("mTLS: Using client key passphrase");
    if (Object.keys(A).length === 0) return;
    return A
  }), ktQ = W0(() => {
    let A = tT();
    if (!A) return;
    let Q = {
      ...A,
      keepAlive: !0
    };
    return k("mTLS: Creating HTTPS agent with custom certificates"), new Hw3(Q)
  })
})
// @from(Ln 120951, Col 0)
function Ew3(A) {
  switch (A.family) {
    case 0:
    case 4:
    case 6:
      return A.family;
    case "IPv6":
      return 6;
    case "IPv4":
    case void 0:
      return 4;
    default:
      throw Error(`Unsupported address family: ${A.family}`)
  }
}
// @from(Ln 120967, Col 0)
function bn() {
  return process.env.https_proxy || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.HTTP_PROXY
}
// @from(Ln 120971, Col 0)
function zw3() {
  return process.env.no_proxy || process.env.NO_PROXY
}
// @from(Ln 120975, Col 0)
function leA(A) {
  let Q = zw3();
  if (!Q) return !1;
  if (Q === "*") return !0;
  try {
    let B = new URL(A),
      G = B.hostname.toLowerCase(),
      Z = B.port || (B.protocol === "https:" ? "443" : "80"),
      Y = `${G}:${Z}`;
    return Q.split(/[,\s]+/).filter(Boolean).some((X) => {
      if (X = X.toLowerCase().trim(), X.includes(":")) return Y === X;
      if (X.startsWith(".")) {
        let I = X;
        return G === X.substring(1) || G.endsWith(I)
      }
      return G === X
    })
  } catch {
    return !1
  }
}
// @from(Ln 120997, Col 0)
function gtQ(A) {
  let Q = tT(),
    B = {
      ...Q && {
        cert: Q.cert,
        key: Q.key,
        passphrase: Q.passphrase
      }
    };
  if (a1(process.env.CLAUDE_CODE_PROXY_RESOLVES_HOSTS)) B.lookup = (G, Z, Y) => {
    Y(null, G, Ew3(Z))
  };
  return new Lp1.HttpsProxyAgent(A, B)
}
// @from(Ln 121012, Col 0)
function COA(A) {
  let Q = bn();
  if (!Q) return;
  if (leA(A)) return;
  return gtQ(Q)
}
// @from(Ln 121019, Col 0)
function pJA() {
  let A = bn(),
    Q = wp1();
  if (A) return {
    dispatcher: utQ(A)
  };
  return Q
}
// @from(Ln 121028, Col 0)
function mtQ() {
  let A = bn(),
    Q = ktQ();
  if (A) {
    xQ.defaults.proxy = !1;
    let B = gtQ(A);
    xQ.interceptors.request.use((G) => {
      if (G.url && leA(G.url))
        if (Q) G.httpsAgent = Q, G.httpAgent = Q;
        else delete G.httpsAgent, delete G.httpAgent;
      else G.httpsAgent = B, G.httpAgent = B;
      return G
    }), peA(utQ(A))
  } else if (Q) {
    xQ.defaults.httpsAgent = Q;
    let B = wp1();
    if (B.dispatcher) peA(B.dispatcher)
  }
}
// @from(Ln 121048, Col 0)
function Op1() {
  let A = bn();
  if (!A) return {};
  let Q = new Lp1.HttpsProxyAgent(A),
    B = new htQ.NodeHttpHandler({
      httpAgent: Q,
      httpsAgent: Q
    });
  return {
    requestHandler: B,
    credentials: ftQ.defaultProvider({
      clientConfig: {
        requestHandler: B
      }
    })
  }
}
// @from(Ln 121065, Col 4)
ftQ
// @from(Ln 121065, Col 9)
htQ
// @from(Ln 121065, Col 14)
Lp1
// @from(Ln 121065, Col 19)
utQ
// @from(Ln 121066, Col 4)
fn = w(() => {
  j5();
  Y9();
  qp1();
  cJA();
  fQ();
  ftQ = c(_0A(), 1), htQ = c(XL(), 1), Lp1 = c(ELA(), 1);
  utQ = W0((A) => {
    let Q = tT(),
      B = {
        httpProxy: A,
        httpsProxy: A,
        noProxy: process.env.NO_PROXY || process.env.no_proxy
      };
    if (Q) B.connect = {
      cert: Q.cert,
      key: Q.key,
      passphrase: Q.passphrase
    };
    return new Up1(B)
  })
})
// @from(Ln 121089, Col 0)
function tv(A, Q) {
  return A.find((B) => B.includes(Q)) ?? null
}
// @from(Ln 121092, Col 0)
async function ptQ() {
  let A = lAA(),
    Q = a1(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH),
    B = {
      region: A,
      ...process.env.ANTHROPIC_BEDROCK_BASE_URL && {
        endpoint: process.env.ANTHROPIC_BEDROCK_BASE_URL
      },
      ...Op1(),
      ...Q && {
        requestHandler: new Rp1.NodeHttpHandler,
        httpAuthSchemes: [{
          schemeId: "smithy.api#noAuth",
          identityProvider: () => async () => ({}),
          signer: new Mp1.NoAuthSigner
        }],
        httpAuthSchemeProvider: () => [{
          schemeId: "smithy.api#noAuth"
        }]
      }
    };
  if (!Q && !process.env.AWS_BEARER_TOKEN_BEDROCK) {
    let G = await DQA();
    if (G) B.credentials = {
      accessKeyId: G.accessKeyId,
      secretAccessKey: G.secretAccessKey,
      sessionToken: G.sessionToken
    }
  }
  return new lJA.BedrockClient(B)
}
// @from(Ln 121123, Col 0)
async function ltQ() {
  let A = lAA(),
    Q = a1(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH),
    B = {
      region: A,
      ...process.env.ANTHROPIC_BEDROCK_BASE_URL && {
        endpoint: process.env.ANTHROPIC_BEDROCK_BASE_URL
      },
      ...Op1(),
      ...Q && {
        requestHandler: new Rp1.NodeHttpHandler,
        httpAuthSchemes: [{
          schemeId: "smithy.api#noAuth",
          identityProvider: () => async () => ({}),
          signer: new Mp1.NoAuthSigner
        }],
        httpAuthSchemeProvider: () => [{
          schemeId: "smithy.api#noAuth"
        }]
      }
    };
  if (!Q && !process.env.AWS_BEARER_TOKEN_BEDROCK) {
    let G = await DQA();
    if (G) B.credentials = {
      accessKeyId: G.accessKeyId,
      secretAccessKey: G.secretAccessKey,
      sessionToken: G.sessionToken
    }
  }
  return new dtQ.BedrockRuntimeClient(B)
}
// @from(Ln 121155, Col 0)
function _p1(A) {
  return A.startsWith("anthropic.")
}
// @from(Ln 121159, Col 0)
function jp1(A) {
  for (let Q of $w3)
    if (A.startsWith(`${Q}.anthropic.`)) return Q;
  return
}
// @from(Ln 121165, Col 0)
function itQ(A, Q) {
  let B = jp1(A);
  if (B) return A.replace(`${B}.`, `${Q}.`);
  if (_p1(A)) return `${Q}.${A}`;
  return A
}
// @from(Ln 121171, Col 4)
lJA
// @from(Ln 121171, Col 9)
dtQ
// @from(Ln 121171, Col 14)
Mp1
// @from(Ln 121171, Col 19)
Rp1
// @from(Ln 121171, Col 24)
ctQ
// @from(Ln 121171, Col 29)
ieA
// @from(Ln 121171, Col 34)
$w3
// @from(Ln 121172, Col 4)
UOA = w(() => {
  Y9();
  Q2();
  fQ();
  v1();
  fn();
  lJA = c(khQ(), 1), dtQ = c(XtA(), 1), Mp1 = c(rG(), 1), Rp1 = c(XL(), 1), ctQ = W0(async function () {
    let A = await ptQ(),
      Q = [],
      B;
    try {
      do {
        let G = new lJA.ListInferenceProfilesCommand({
            ...B && {
              nextToken: B
            },
            typeEquals: "SYSTEM_DEFINED"
          }),
          Z = await A.send(G);
        if (Z.inferenceProfileSummaries) Q.push(...Z.inferenceProfileSummaries);
        B = Z.nextToken
      } while (B);
      return Q.filter((G) => G.inferenceProfileId?.includes("anthropic")).map((G) => G.inferenceProfileId).filter(Boolean)
    } catch (G) {
      throw e(G), G
    }
  });
  ieA = W0(async function (A) {
    try {
      let Q = await ptQ(),
        B = new lJA.GetInferenceProfileCommand({
          inferenceProfileIdentifier: A
        }),
        G = await Q.send(B);
      if (!G.models || G.models.length === 0) return null;
      let Z = G.models[0];
      if (!Z?.modelArn) return null;
      let Y = Z.modelArn.lastIndexOf("/");
      return Y >= 0 ? Z.modelArn.substring(Y + 1) : Z.modelArn
    } catch (Q) {
      return e(Q), null
    }
  });
  $w3 = ["us", "eu", "apac", "global"]
})
// @from(Ln 121218, Col 0)
function ev(A) {
  let Q = [],
    B = !1;
  async function G() {
    if (B) return;
    if (Q.length === 0) return;
    B = !0;
    while (Q.length > 0) {
      let {
        args: Z,
        resolve: Y,
        reject: J,
        context: X
      } = Q.shift();
      try {
        let I = await A.apply(X, Z);
        Y(I)
      } catch (I) {
        J(I)
      }
    }
    if (B = !1, Q.length > 0) G()
  }
  return function (...Z) {
    return new Promise((Y, J) => {
      Q.push({
        args: Z,
        resolve: Y,
        reject: J,
        context: this
      }), G()
    })
  }
}
// @from(Ln 121253, Col 0)
function neA(A) {
  return {
    haiku35: $NA[A],
    haiku45: CNA[A],
    sonnet35: zNA[A],
    sonnet37: ENA[A],
    sonnet40: Z0A[A],
    sonnet45: fP1[A],
    opus40: UNA[A],
    opus41: qNA[A],
    opus45: NNA[A]
  }
}
// @from(Ln 121266, Col 0)
async function Cw3() {
  let A;
  try {
    A = await ctQ()
  } catch (W) {
    return e(W), neA("bedrock")
  }
  if (!A?.length) return neA("bedrock");
  let Q = tv(A, "claude-3-5-haiku-20241022"),
    B = tv(A, "claude-haiku-4-5-20251001"),
    G = tv(A, "claude-3-5-sonnet-20241022"),
    Z = tv(A, "claude-3-7-sonnet-20250219"),
    Y = tv(A, "claude-sonnet-4-20250514"),
    J = tv(A, "claude-sonnet-4-5-20250929"),
    X = tv(A, "claude-opus-4-20250514"),
    I = tv(A, "claude-opus-4-1-20250805"),
    D = tv(A, "claude-opus-4-5-20251101");
  return {
    haiku35: Q || $NA.bedrock,
    haiku45: B || CNA.bedrock,
    sonnet35: G || zNA.bedrock,
    sonnet37: Z || ENA.bedrock,
    sonnet40: Y || Z0A.bedrock,
    sonnet45: J || fP1.bedrock,
    opus40: X || UNA.bedrock,
    opus41: I || qNA.bedrock,
    opus45: D || NNA.bedrock
  }
}
// @from(Ln 121296, Col 0)
function qw3() {
  if (MdA() !== null) return;
  if (R4() !== "bedrock") {
    sU1(neA(R4()));
    return
  }
  Uw3()
}
// @from(Ln 121305, Col 0)
function AI() {
  let A = MdA();
  if (A === null) return qw3(), neA(R4());
  return A
}
// @from(Ln 121310, Col 4)
Uw3
// @from(Ln 121311, Col 4)
Tp1 = w(() => {
  C0();
  v1();
  UOA();
  wNA();
  MD();
  Uw3 = ev(async () => {
    if (MdA() !== null) return;
    try {
      let A = await Cw3();
      sU1(A)
    } catch (A) {
      e(A)
    }
  })
})
// @from(Ln 121328, Col 0)
function ntQ(A, Q) {
  if (A.length <= Q) return A;
  if (Q <= 0) return "…";
  if (Q < 5) return A.slice(0, Q - 1) + "…";
  let B = A.lastIndexOf("/"),
    G = B >= 0 ? A.slice(B) : A,
    Z = B >= 0 ? A.slice(0, B) : "";
  if (G.length >= Q - 1) return "…" + A.slice(-(Q - 1));
  let Y = Q - 1 - G.length;
  if (Y <= 0) return "…" + G.slice(-(Q - 1));
  return Z.slice(0, Y) + "…" + G
}
// @from(Ln 121341, Col 0)
function YG(A, Q, B = !1) {
  let G = A;
  if (B) {
    let Z = A.indexOf(`
`);
    if (Z !== -1) {
      if (G = A.substring(0, Z), G.length + 1 > Q) return `${G.substring(0,Q-1)}…`;
      return `${G}…`
    }
  }
  if (G.length <= Q) return G;
  return `${G.substring(0,Q-1)}…`
}
// @from(Ln 121355, Col 0)
function QI(A) {
  if (A < 60000) {
    if (A === 0) return "0s";
    if (A < 1) return `${(A/1000).toFixed(1)}s`;
    return `${Math.round(A/1000).toString()}s`
  }
  let Q = Math.floor(A / 86400000),
    B = Math.floor(A % 86400000 / 3600000),
    G = Math.floor(A % 3600000 / 60000),
    Z = Math.round(A % 60000 / 1000);
  if (Z === 60) Z = 0, G++;
  if (G === 60) G = 0, B++;
  if (B === 24) B = 0, Q++;
  if (Q > 0) return `${Q}d ${B}h ${G}m`;
  if (B > 0) return `${B}h ${G}m ${Z}s`;
  if (G > 0) return `${G}m ${Z}s`;
  return `${Z}s`
}
// @from(Ln 121374, Col 0)
function X8(A) {
  let Q = A >= 1000;
  return new Intl.NumberFormat("en", {
    notation: "compact",
    minimumFractionDigits: Q ? 1 : 0,
    maximumFractionDigits: 1
  }).format(A).toLowerCase()
}
// @from(Ln 121383, Col 0)
function aeA(A, Q = {}) {
  let {
    style: B = "narrow",
    numeric: G = "always",
    now: Z = new Date
  } = Q, Y = A.getTime() - Z.getTime(), J = Math.trunc(Y / 1000), X = [{
    unit: "year",
    seconds: 31536000,
    shortUnit: "y"
  }, {
    unit: "month",
    seconds: 2592000,
    shortUnit: "mo"
  }, {
    unit: "week",
    seconds: 604800,
    shortUnit: "w"
  }, {
    unit: "day",
    seconds: 86400,
    shortUnit: "d"
  }, {
    unit: "hour",
    seconds: 3600,
    shortUnit: "h"
  }, {
    unit: "minute",
    seconds: 60,
    shortUnit: "m"
  }, {
    unit: "second",
    seconds: 1,
    shortUnit: "s"
  }];
  for (let {
      unit: D,
      seconds: W,
      shortUnit: K
    }
    of X)
    if (Math.abs(J) >= W) {
      let V = Math.trunc(J / W);
      if (B === "narrow") return J < 0 ? `${Math.abs(V)}${K} ago` : `in ${V}${K}`;
      return new Intl.RelativeTimeFormat("en", {
        style: "long",
        numeric: G
      }).format(V, D)
    } if (B === "narrow") return J <= 0 ? "0s ago" : "in 0s";
  return new Intl.RelativeTimeFormat("en", {
    style: B,
    numeric: G
  }).format(0, "second")
}
// @from(Ln 121437, Col 0)
function WQA(A, Q = {}) {
  let {
    now: B = new Date,
    ...G
  } = Q;
  if (A > B) return aeA(A, {
    ...G,
    now: B
  });
  return aeA(A, {
    ...G,
    numeric: "always",
    now: B
  })
}
// @from(Ln 121453, Col 0)
function qOA(A) {
  let Q = [WQA(A.modified, {
    style: "short"
  }), `${A.messageCount} messages`, A.gitBranch || "-"];
  if (A.tag) Q.push(`#${A.tag}`);
  return Q.join(" · ")
}
// @from(Ln 121461, Col 0)
function iJA(A, Q = !1, B = !0) {
  if (!A) return;
  let G = new Date(A * 1000),
    Z = new Date,
    Y = G.getMinutes();
  if ((G.getTime() - Z.getTime()) / 3600000 > 24) {
    let D = {
      month: "short",
      day: "numeric",
      hour: B ? "numeric" : void 0,
      minute: !B || Y === 0 ? void 0 : "2-digit",
      hour12: B ? !0 : void 0
    };
    if (G.getFullYear() !== Z.getFullYear()) D.year = "numeric";
    return G.toLocaleString("en-US", D).replace(/ ([AP]M)/i, (K, V) => V.toLowerCase()) + (Q ? ` (${Intl.DateTimeFormat().resolvedOptions().timeZone})` : "")
  }
  let X = G.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: Y === 0 ? void 0 : "2-digit",
      hour12: !0
    }),
    I = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return X.replace(/ ([AP]M)/i, (D, W) => W.toLowerCase()) + (Q ? ` (${I})` : "")
}
// @from(Ln 121486, Col 0)
function atQ(A, Q = !1, B = !0) {
  let G = new Date(A);
  return `${iJA(Math.floor(G.getTime()/1000),Q,B)}`
}
// @from(Ln 121491, Col 0)
function Pp1(A) {
  let Q = JG();
  if (Q.lastSessionId !== A) return;
  let B;
  if (Q.lastModelUsage) B = Object.fromEntries(Object.entries(Q.lastModelUsage).map(([G, Z]) => [G, {
    ...Z,
    contextWindow: Jq(G, SM()),
    maxOutputTokens: o5A(G)
  }]));
  return {
    totalCostUSD: Q.lastCost ?? 0,
    totalAPIDuration: Q.lastAPIDuration ?? 0,
    totalAPIDurationWithoutRetries: Q.lastAPIDurationWithoutRetries ?? 0,
    totalToolDuration: Q.lastToolDuration ?? 0,
    totalLinesAdded: Q.lastLinesAdded ?? 0,
    totalLinesRemoved: Q.lastLinesRemoved ?? 0,
    lastDuration: Q.lastDuration,
    modelUsage: B
  }
}
// @from(Ln 121512, Col 0)
function NOA(A) {
  let Q = Pp1(A);
  if (!Q) return !1;
  return OdA(Q), !0
}
// @from(Ln 121518, Col 0)
function Sp1() {
  BZ((A) => ({
    ...A,
    lastCost: $H(),
    lastAPIDuration: PM(),
    lastAPIDurationWithoutRetries: _b0(),
    lastToolDuration: jb0(),
    lastDuration: PCA(),
    lastLinesAdded: r5A(),
    lastLinesRemoved: s5A(),
    lastTotalInputTokens: qdA(),
    lastTotalOutputTokens: NdA(),
    lastTotalCacheCreationInputTokens: Pb0(),
    lastTotalCacheReadInputTokens: Tb0(),
    lastTotalWebSearchRequests: Sb0(),
    lastModelUsage: Object.fromEntries(Object.entries(jy()).map(([Q, B]) => [Q, {
      inputTokens: B.inputTokens,
      outputTokens: B.outputTokens,
      cacheReadInputTokens: B.cacheReadInputTokens,
      cacheCreationInputTokens: B.cacheCreationInputTokens,
      webSearchRequests: B.webSearchRequests,
      costUSD: B.costUSD
    }])),
    lastSessionId: q0()
  }))
}
// @from(Ln 121545, Col 0)
function wOA(A, Q = 4) {
  return `$${A>0.5?ww3(A,100).toFixed(2):A.toFixed(Q)}`
}
// @from(Ln 121549, Col 0)
function Nw3() {
  let A = jy();
  if (Object.keys(A).length === 0) return "Usage:                 0 input, 0 output, 0 cache read, 0 cache write";
  let Q = {};
  for (let [G, Z] of Object.entries(A)) {
    let Y = Uz(G);
    if (!Q[Y]) Q[Y] = {
      inputTokens: 0,
      outputTokens: 0,
      cacheReadInputTokens: 0,
      cacheCreationInputTokens: 0,
      webSearchRequests: 0,
      costUSD: 0,
      contextWindow: 0,
      maxOutputTokens: 0
    };
    let J = Q[Y];
    J.inputTokens += Z.inputTokens, J.outputTokens += Z.outputTokens, J.cacheReadInputTokens += Z.cacheReadInputTokens, J.cacheCreationInputTokens += Z.cacheCreationInputTokens, J.webSearchRequests += Z.webSearchRequests, J.costUSD += Z.costUSD
  }
  let B = "Usage by model:";
  for (let [G, Z] of Object.entries(Q)) {
    let Y = `  ${X8(Z.inputTokens)} input, ${X8(Z.outputTokens)} output, ${X8(Z.cacheReadInputTokens)} cache read, ${X8(Z.cacheCreationInputTokens)} cache write` + (Z.webSearchRequests > 0 ? `, ${X8(Z.webSearchRequests)} web search` : "") + ` (${wOA(Z.costUSD)})`;
    B += `
` + `${G}:`.padStart(21) + Y
  }
  return B
}
// @from(Ln 121577, Col 0)
function xp1() {
  let A = wOA($H()) + (xb0() ? " (costs may be inaccurate due to usage of unknown models)" : ""),
    Q = Nw3();
  return I1.dim(`Total cost:            ${A}
Total duration (API):  ${QI(PM())}
Total duration (wall): ${QI(PCA())}
Total code changes:    ${r5A()} ${r5A()===1?"line":"lines"} added, ${s5A()} ${s5A()===1?"line":"lines"} removed
${Q}`)
}
// @from(Ln 121587, Col 0)
function rtQ() {
  otQ.useEffect(() => {
    let A = () => {
      if (reA()) process.stdout.write(`
` + xp1() + `
`);
      Sp1()
    };
    return process.on("exit", A), () => {
      process.off("exit", A)
    }
  }, [])
}
// @from(Ln 121601, Col 0)
function ww3(A, Q) {
  return Math.round(A * Q) / Q
}
// @from(Ln 121605, Col 0)
function oeA(A, Q, B) {
  Rb0(A, Q, B), gb0()?.add(A, {
    model: B
  }), yCA()?.add(Q.input_tokens, {
    type: "input",
    model: B
  }), yCA()?.add(Q.output_tokens, {
    type: "output",
    model: B
  }), yCA()?.add(Q.cache_read_input_tokens ?? 0, {
    type: "cacheRead",
    model: B
  }), yCA()?.add(Q.cache_creation_input_tokens ?? 0, {
    type: "cacheCreation",
    model: B
  })
}
// @from(Ln 121622, Col 4)
otQ
// @from(Ln 121623, Col 4)
LR = w(() => {
  Z3();
  l2();
  GQ();
  C0();
  C0();
  C0();
  FT();
  C0();
  otQ = c(QA(), 1)
})
// @from(Ln 121635, Col 0)
function Lw3(A, Q) {
  return Q.input_tokens / 1e6 * A.inputTokens + Q.output_tokens / 1e6 * A.outputTokens + (Q.cache_read_input_tokens ?? 0) / 1e6 * A.promptCacheReadTokens + (Q.cache_creation_input_tokens ?? 0) / 1e6 * A.promptCacheWriteTokens + (Q.server_tool_use?.web_search_requests ?? 0) * A.webSearchRequests
}
// @from(Ln 121639, Col 0)
function Ow3(A) {
  return A.input_tokens + (A.cache_read_input_tokens ?? 0) + (A.cache_creation_input_tokens ?? 0)
}
// @from(Ln 121643, Col 0)
function Mw3(A, Q) {
  let B = Uz(A),
    G = stQ[B];
  if (G === KQA && Ow3(Q) > 200000) return yp1;
  if (!G) return l("tengu_unknown_model_cost", {
    model: A,
    shortName: B
  }), rU1(), stQ[Uz(etQ)];
  return G
}
// @from(Ln 121654, Col 0)
function eeA(A, Q) {
  let B = Mw3(A, Q);
  return Lw3(B, Q)
}
// @from(Ln 121659, Col 0)
function ttQ(A) {
  if (Number.isInteger(A)) return `$${A}`;
  return `$${A.toFixed(2)}`
}
// @from(Ln 121664, Col 0)
function hn(A) {
  return `${ttQ(A.inputTokens)}/${ttQ(A.outputTokens)} per Mtok`
}
// @from(Ln 121667, Col 4)
KQA
// @from(Ln 121667, Col 9)
seA
// @from(Ln 121667, Col 14)
teA
// @from(Ln 121667, Col 19)
yp1
// @from(Ln 121667, Col 24)
vp1
// @from(Ln 121667, Col 29)
kp1
// @from(Ln 121667, Col 34)
stQ
// @from(Ln 121668, Col 4)
AA1 = w(() => {
  LR();
  Z0();
  wNA();
  l2();
  KQA = {
    inputTokens: 3,
    outputTokens: 15,
    promptCacheWriteTokens: 3.75,
    promptCacheReadTokens: 0.3,
    webSearchRequests: 0.01
  }, seA = {
    inputTokens: 15,
    outputTokens: 75,
    promptCacheWriteTokens: 18.75,
    promptCacheReadTokens: 1.5,
    webSearchRequests: 0.01
  }, teA = {
    inputTokens: 5,
    outputTokens: 25,
    promptCacheWriteTokens: 6.25,
    promptCacheReadTokens: 0.5,
    webSearchRequests: 0.01
  }, yp1 = {
    inputTokens: 6,
    outputTokens: 22.5,
    promptCacheWriteTokens: 7.5,
    promptCacheReadTokens: 0.6,
    webSearchRequests: 0.01
  }, vp1 = {
    inputTokens: 0.8,
    outputTokens: 4,
    promptCacheWriteTokens: 1,
    promptCacheReadTokens: 0.08,
    webSearchRequests: 0.01
  }, kp1 = {
    inputTokens: 1,
    outputTokens: 5,
    promptCacheWriteTokens: 1.25,
    promptCacheReadTokens: 0.1,
    webSearchRequests: 0.01
  }, stQ = {
    [Uz($NA.firstParty)]: vp1,
    [Uz(CNA.firstParty)]: kp1,
    [Uz(zNA.firstParty)]: KQA,
    [Uz(ENA.firstParty)]: KQA,
    [Uz(Z0A.firstParty)]: KQA,
    [Uz(UNA.firstParty)]: seA,
    [Uz(qNA.firstParty)]: seA,
    [Uz(NNA.firstParty)]: teA,
    ...{}
  }
})
// @from(Ln 121722, Col 0)
function gn() {
  let A = process.env.CLAUDE_AGENT_SDK_VERSION ? `, agent-sdk/${process.env.CLAUDE_AGENT_SDK_VERSION}` : "";
  return `claude-cli/${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION} (external, ${process.env.CLAUDE_CODE_ENTRYPOINT}${A})`
}
// @from(Ln 121727, Col 0)
function VQA() {
  return `claude-code/${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION}`
}
// @from(Ln 121731, Col 0)
function PD() {
  return `claude-code/${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.7",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-01-13T22:55:21Z"}.VERSION}`
}
// @from(Ln 121735, Col 0)
function CJ() {
  if (qB()) {
    let Q = g4();
    if (!Q?.accessToken) return {
      headers: {},
      error: "No OAuth token available"
    };
    return {
      headers: {
        Authorization: `Bearer ${Q.accessToken}`,
        "anthropic-beta": zi
      }
    }
  }
  let A = YL();
  if (!A) return {
    headers: {},
    error: "No API key available"
  };
  return {
    headers: {
      "x-api-key": A
    }
  }
}
// @from(Ln 121760, Col 4)
qz = w(() => {
  Q2();
  JX()
})
// @from(Ln 121764, Col 0)
async function _w3() {
  let A = v3()?.organizationUuid;
  if (!A) throw Error("No organization ID available");
  let Q = CJ();
  if (Q.error) throw Error(`Auth error: ${Q.error}`);
  let B = {
    "Content-Type": "application/json",
    "User-Agent": PD(),
    ...Q.headers
  };
  try {
    let G = `https://api.anthropic.com/api/organization/${A}/claude_code_sonnet_1m_access`,
      Z = await xQ.get(G, {
        headers: B,
        timeout: 5000
      });
    return {
      hasAccess: Z.data.has_access,
      hasAccessNotAsDefault: Z.data.has_access_not_as_default,
      hasError: !1
    }
  } catch (G) {
    return e(G), {
      hasAccess: !1,
      hasError: !0
    }
  }
}
// @from(Ln 121792, Col 0)
async function Tw3() {
  try {
    return await jw3()
  } catch (A) {
    return k("Sonnet-1M access check failed, defaulting to no access"), {
      hasAccess: !1,
      hasError: !0
    }
  }
}
// @from(Ln 121803, Col 0)
function un() {
  let A = v3()?.organizationUuid;
  if (!A) return {
    hasAccess: !1,
    wasPartOfDefaultRollout: !1,
    needsRefresh: !1
  };
  let Q = L1(),
    B = (qB() ? Q.s1mAccessCache : Q.s1mNonSubscriberAccessCache)?.[A],
    G = Date.now();
  if (!B) return {
    hasAccess: !1,
    wasPartOfDefaultRollout: !1,
    needsRefresh: !0
  };
  let {
    hasAccess: Z,
    hasAccessNotAsDefault: Y,
    timestamp: J
  } = B, X = G - J > Pw3;
  return {
    hasAccess: Z || (Y ?? !1),
    wasPartOfDefaultRollout: Z,
    needsRefresh: X
  }
}
// @from(Ln 121829, Col 0)
async function AeQ() {
  let {
    needsRefresh: A
  } = un();
  if (A) Sw3()
}
// @from(Ln 121835, Col 0)
async function Sw3() {
  let A = v3()?.organizationUuid;
  if (!A) return;
  if (!qB()) {
    let Q = await inA();
    if (!Q) return;
    let {
      uuid: B,
      rate_limit_tier: G
    } = Q.organization, Z = {
      hasAccess: G === "auto_prepaid_tier_3" || G === "manual_tier_3",
      timestamp: Date.now()
    };
    S0((Y) => ({
      ...Y,
      s1mNonSubscriberAccessCache: {
        ...Y.s1mNonSubscriberAccessCache,
        [B]: Z
      }
    }));
    return
  }
  try {
    let {
      hasAccess: Q,
      hasAccessNotAsDefault: B
    } = await Tw3(), G = {
      hasAccess: Q,
      hasAccessNotAsDefault: B,
      timestamp: Date.now()
    };
    S0((Z) => ({
      ...Z,
      s1mAccessCache: {
        ...Z.s1mAccessCache,
        [A]: G
      }
    }))
  } catch (Q) {
    k("Failed to fetch and cache Sonnet-1M access"), e(Q)
  }
}
// @from(Ln 121877, Col 4)
Rw3 = 3600000
// @from(Ln 121878, Col 2)
jw3
// @from(Ln 121878, Col 7)
Pw3 = 3600000
// @from(Ln 121879, Col 4)
QA1 = w(() => {
  j5();
  dnA();
  qz();
  T1();
  v1();
  GQ();
  Q2();
  ZNA();
  jw3 = mnA(_w3, Rw3)
})
// @from(Ln 121891, Col 0)
function yw3() {
  return "inherit"
}
// @from(Ln 121895, Col 0)
function SD() {
  return process.env.ANTHROPIC_SMALL_FAST_MODEL || fp1()
}
// @from(Ln 121899, Col 0)
function oJA(A) {
  return A === AI().opus40 || A === AI().opus41 || A === AI().opus45
}
// @from(Ln 121903, Col 0)
function GA1(A) {
  return A.includes("opus")
}
// @from(Ln 121907, Col 0)
function ZA1() {
  let A, Q = yb0();
  if (Q !== void 0) A = Q;
  else {
    let B = jQ() || {};
    A = process.env.ANTHROPIC_MODEL || B.model || void 0
  }
  if (qB() && !MR() && A && GA1(A)) return;
  return A
}
// @from(Ln 121918, Col 0)
function FQA(A = {}) {
  let Q = ZA1();
  if (Q !== null && Q !== void 0) return Q;
  let {
    forDisplay: B = !1
  } = A;
  return GeQ(B)
}
// @from(Ln 121927, Col 0)
function B5() {
  let A = FQA();
  if (A !== void 0 && A !== null) return FX(A);
  return wu()
}
// @from(Ln 121933, Col 0)
function OR() {
  if (process.env.ANTHROPIC_DEFAULT_SONNET_MODEL) return process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
  return AI().sonnet45
}
// @from(Ln 121938, Col 0)
function OOA() {
  return N6() === "max"
}
// @from(Ln 121942, Col 0)
function MOA() {
  return N6() === "team"
}
// @from(Ln 121946, Col 0)
function rJA() {
  return N6() === "pro"
}
// @from(Ln 121950, Col 0)
function sJA() {
  if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
  if (R4() === "firstParty") return AI().opus45;
  return AI().opus41
}
// @from(Ln 121956, Col 0)
function fp1() {
  if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL) return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
  return AI().haiku45
}
// @from(Ln 121961, Col 0)
function HQA(A) {
  let {
    permissionMode: Q,
    mainLoopModel: B,
    exceeds200kTokens: G = !1
  } = A;
  if (FQA() === "opusplan" && Q === "plan" && !G) return sJA();
  if (FQA() === "haiku" && Q === "plan") return OR();
  return B
}
// @from(Ln 121972, Col 0)
function hp1() {
  if (!qB()) return !1;
  let {
    hasAccess: A
  } = un();
  if (!A) return !1;
  return HX("sonnet_1m_default", "enabled", !1)
}
// @from(Ln 121981, Col 0)
function GeQ(A) {
  let Q = vw3();
  if (Q !== null && Q.name) return A ? Q.displayName ?? Q.name : Q.name;
  if (hp1()) return "sonnet[1m]";
  return
}
// @from(Ln 121988, Col 0)
function EQA(A = {}) {
  let {
    forDisplay: Q = !1
  } = A, B = GeQ(Q);
  if (B !== void 0) return B;
  if (OOA() || MOA() || rJA()) return sJA();
  return OR()
}
// @from(Ln 121997, Col 0)
function wu(A = {}) {
  return FX(EQA(A))
}
// @from(Ln 122001, Col 0)
function Uz(A) {
  if (A.includes("claude-opus-4-5")) return "claude-opus-4-5";
  if (A.includes("claude-opus-4-1")) return "claude-opus-4-1";
  if (A.includes("claude-opus-4")) return "claude-opus-4";
  let Q = A.match(/(claude-(\d+-\d+-)?\w+)/);
  if (Q && Q[1]) return Q[1];
  return A
}
// @from(Ln 122009, Col 0)
async function ZeQ() {
  try {
    if (L1().claudeCodeFirstTokenDate !== void 0) return;
    let Q = CJ();
    if (Q.error) {
      e(Error(`Failed to get auth headers: ${Q.error}`));
      return
    }
    let G = `${v9().BASE_API_URL}/api/organization/claude_code_first_token_date`,
      Y = (await xQ.get(G, {
        headers: {
          ...Q.headers,
          "User-Agent": PD()
        }
      })).data?.first_token_date ?? null;
    if (Y !== null) {
      let J = new Date(Y).getTime();
      if (isNaN(J)) {
        e(Error(`Received invalid first_token_date from API: ${Y}`));
        return
      }
    }
    S0((J) => ({
      ...J,
      claudeCodeFirstTokenDate: Y
    }))
  } catch (A) {
    e(A instanceof Error ? A : Error(String(A)))
  }
}
// @from(Ln 122040, Col 0)
function LOA() {
  if (hp1()) return "Sonnet 4.5 with 1M context · Best for everyday tasks";
  if (OOA() || MOA() || rJA()) return "Opus 4.5 · Most capable for complex work";
  return "Sonnet 4.5 · Best for everyday tasks"
}
// @from(Ln 122046, Col 0)
function kw3(A) {
  if (A === "opusplan") return "Opus 4.5 in plan mode, else Sonnet 4.5";
  return KC(FX(A))
}
// @from(Ln 122051, Col 0)
function YeQ(A) {
  if (A === "opusplan") return "Opus Plan";
  if (up1(A)) return A.charAt(0).toUpperCase() + A.slice(1);
  return KC(A)
}
// @from(Ln 122057, Col 0)
function JeQ(A) {
  switch (A) {
    case AI().opus45:
      return "Opus 4.5";
    case AI().opus41:
      return "Opus 4.1";
    case AI().opus40:
      return "Opus 4";
    case AI().sonnet45 + "[1m]":
      return "Sonnet 4.5 (1M context)";
    case AI().sonnet45:
      return "Sonnet 4.5";
    case AI().sonnet40:
      return "Sonnet 4";
    case AI().sonnet40 + "[1m]":
      return "Sonnet 4 (1M context)";
    case AI().sonnet37:
      return "Sonnet 3.7";
    case AI().sonnet35:
      return "Sonnet 3.5";
    case AI().haiku45:
      return "Haiku 4.5";
    case AI().haiku35:
      return "Haiku 3.5";
    default:
      return null
  }
}
// @from(Ln 122086, Col 0)
function KC(A) {
  let Q = JeQ(A);
  if (Q) return Q;
  return A
}
// @from(Ln 122092, Col 0)
function XeQ(A) {
  let Q = JeQ(A);
  if (Q) return `Claude ${Q}`;
  return "Claude"
}
// @from(Ln 122098, Col 0)
function mn() {
  if (qB()) {
    if (!MR()) return {
      value: null,
      label: "Sonnet",
      description: gp1.description
    };
    if (rJA()) return {
      value: null,
      label: "Opus",
      description: LOA()
    };
    return {
      value: null,
      label: "Default (recommended)",
      description: LOA()
    }
  }
  return {
    value: null,
    label: "Default (recommended)",
    description: `Use the default model (currently ${kw3(EQA({forDisplay:!0}))}) · ${hn(KQA)}`
  }
}
// @from(Ln 122123, Col 0)
function hw3() {
  return fp1() === AI().haiku45 ? WeQ : fw3
}
// @from(Ln 122127, Col 0)
function mw3() {
  let A = WeQ;
  if (qB()) {
    if (!MR()) return [mn(), BA1];
    if (OOA() || MOA()) {
      let G = [mn(), BeQ];
      if (un().hasAccess) G.push(QeQ);
      return G.push(BA1), G
    }
    if (rJA()) return [mn(), BeQ, BA1];
    let B = [mn(), gw3];
    if (hp1()) B.push({
      value: "sonnet",
      label: "Sonnet",
      description: "Sonnet 4.5 with 200K context"
    });
    else if (un().hasAccess) B.push(QeQ);
    return B.push(BA1), B
  }
  let Q = [mn(), DeQ()];
  if (R4() !== "firstParty") Q.push(bw3());
  if (un().hasAccess) Q.push(IeQ);
  if (A) Q.push(A);
  return Q
}
// @from(Ln 122153, Col 0)
function zQA() {
  let A = mw3(),
    Q = null,
    B = ZA1(),
    G = LdA();
  if (B !== void 0 && B !== null) Q = B;
  else if (G !== null) Q = G;
  if (Q === null || A.some((Z) => Z.value === Q)) return A;
  if (Q === "opusplan") return [...A, uw3()];
  if (!qB() && up1(Q))
    if (Q === "sonnet") A.push(gp1);
    else if (Q === "sonnet[1m]") A.push(IeQ);
  else if (Q === "opus") A.push(DeQ());
  else if (Q === "haiku") A.push(hw3());
  else A.push({
    value: Q,
    label: Q,
    description: "Custom model"
  });
  else A.push({
    value: Q,
    label: Q,
    description: "Custom model"
  });
  return A
}
// @from(Ln 122180, Col 0)
function up1(A) {
  return nJA.includes(A)
}
// @from(Ln 122184, Col 0)
function FX(A) {
  let Q = A.trim(),
    B = Q.toLowerCase(),
    G = B.endsWith("[1m]"),
    Z = G ? B.replace(/\[1m]$/i, "").trim() : B;
  if (up1(Z)) switch (Z) {
    case "opusplan":
      return OR() + (G ? "[1m]" : "");
    case "sonnet":
      return OR() + (G ? "[1m]" : "");
    case "haiku":
      return fp1() + (G ? "[1m]" : "");
    case "opus":
      return sJA();
    default:
  }
  if (G) return Q.replace(/\[1m\]$/i, "").trim() + "[1m]";
  return Q
}
// @from(Ln 122204, Col 0)
function eT(A) {
  if (A === null) {
    if (qB() && !MR()) return `Sonnet (${gp1.description})`;
    else if (qB()) return `Default (${LOA()})`;
    return `Default (${wu({forDisplay:!0})})`
  }
  let Q = FX(A);
  return A === Q ? Q : `${A} (${Q})`
}
// @from(Ln 122214, Col 0)
function YA1(A, Q, B, G) {
  if (process.env.CLAUDE_CODE_SUBAGENT_MODEL) return process.env.CLAUDE_CODE_SUBAGENT_MODEL;
  let Z = jp1(Q),
    Y = (X) => {
      if (Z && R4() === "bedrock") return itQ(X, Z);
      return X
    };
  if (B) return Y(FX(B));
  let J = A ?? yw3();
  if (!J) return Y(FX(bp1));
  if (J === "inherit") return HQA({
    permissionMode: G ?? "default",
    mainLoopModel: Q,
    exceeds200kTokens: !1
  });
  return Y(FX(J))
}
// @from(Ln 122232, Col 0)
function JA1(A) {
  if (!A) return "Sonnet (default)";
  if (A === "inherit") return "Inherit from parent";
  return A.charAt(0).toUpperCase() + A.slice(1)
}
// @from(Ln 122238, Col 0)
function KeQ() {
  let A = [{
    value: "sonnet",
    label: "Sonnet",
    description: "Balanced performance - best for most agents"
  }];
  if (MR()) A.push({
    value: "opus",
    label: "Opus",
    description: "Most capable for complex reasoning tasks"
  });
  return A.push({
    value: "haiku",
    label: "Haiku",
    description: "Fast and efficient for simple tasks"
  }, {
    value: "inherit",
    label: "Inherit from parent",
    description: "Use the same model as the main conversation"
  }), A
}
// @from(Ln 122260, Col 0)
function Lu(A) {
  return A.replace(/\[(1|2)m\]/gi, "")
}
// @from(Ln 122263, Col 4)
nJA
// @from(Ln 122263, Col 9)
xw3
// @from(Ln 122263, Col 14)
etQ
// @from(Ln 122263, Col 19)
aJA
// @from(Ln 122263, Col 24)
bp1 = "sonnet"
// @from(Ln 122264, Col 2)
vw3
// @from(Ln 122264, Col 7)
gp1
// @from(Ln 122264, Col 12)
IeQ
// @from(Ln 122264, Col 17)
DeQ = () => {
    let A = R4() !== "firstParty";
    return {
      value: "opus",
      label: A ? "Opus 4.1" : "Opus",
      description: `Opus ${A?"4.1":"4.5"} · ${A?"Legacy":"Most capable for complex work"} · ${hn(A?seA:teA)}`,
      descriptionForModel: A ? "Opus 4.1 - legacy version" : "Opus 4.5 - most capable for complex work"
    }
  }
// @from(Ln 122273, Col 2)
bw3 = () => {
    return {
      value: AI().opus45,
      label: "Opus 4.5",
      description: `Opus 4.5 · Most capable for complex work · ${hn(teA)}`,
      descriptionForModel: "Opus 4.5 - most capable for complex work"
    }
  }
// @from(Ln 122281, Col 2)
WeQ
// @from(Ln 122281, Col 7)
fw3
// @from(Ln 122281, Col 12)
gw3
// @from(Ln 122281, Col 17)
QeQ
// @from(Ln 122281, Col 22)
BeQ
// @from(Ln 122281, Col 27)
BA1
// @from(Ln 122281, Col 32)
uw3 = () => {
    return {
      value: "opusplan",
      label: "Opus Plan Mode",
      description: "Use Opus 4.5 in plan mode, Sonnet 4.5 otherwise"
    }
  }
// @from(Ln 122288, Col 4)
l2 = w(() => {
  Y9();
  GQ();
  C0();
  Q2();
  wNA();
  Tp1();
  AA1();
  GB();
  BI();
  Ou();
  j5();
  JX();
  v1();
  qz();
  QA1();
  MD();
  UOA();
  w6();
  nJA = ["sonnet", "opus", "haiku", "sonnet[1m]", "opusplan"], xw3 = Z0A, etQ = xw3.firstParty, aJA = [...nJA, "inherit"];
  vw3 = W0(() => {
    return null
  });
  gp1 = {
    value: "sonnet",
    label: "Sonnet",
    description: `Sonnet 4.5 · Best for everyday tasks · ${hn(KQA)}`,
    descriptionForModel: "Sonnet 4.5 - best for everyday tasks. Generally recommended for most coding tasks"
  }, IeQ = {
    value: "sonnet[1m]",
    label: "Sonnet (1M context)",
    description: `Sonnet 4.5 for long sessions · ${hn(yp1)}`,
    descriptionForModel: "Sonnet 4.5 with 1M context window - for long sessions with large codebases"
  }, WeQ = {
    value: "haiku",
    label: "Haiku",
    description: `Haiku 4.5 · Fastest for quick answers · ${hn(kp1)}`,
    descriptionForModel: "Haiku 4.5 - fastest for quick answers. Lower cost but less capable than Sonnet 4.5."
  }, fw3 = {
    value: "haiku",
    label: "Haiku",
    description: `Haiku 3.5 for simple tasks · ${hn(vp1)}`,
    descriptionForModel: "Haiku 3.5 - faster and lower cost, but less capable than Sonnet. Use for simple tasks."
  };
  gw3 = {
    value: "opus",
    label: "Opus",
    description: "Opus 4.5 · Most capable for complex work"
  }, QeQ = {
    value: "sonnet[1m]",
    label: "Sonnet (1M context)",
    description: "Sonnet 4.5 with 1M context · Uses rate limits faster"
  }, BeQ = {
    value: "sonnet",
    label: "Sonnet",
    description: "Sonnet 4.5 · Best for everyday tasks"
  }, BA1 = {
    value: "haiku",
    label: "Haiku",
    description: "Haiku 4.5 · Fastest for quick answers"
  }
})
// @from(Ln 122354, Col 0)
function FeQ() {
  return VeQ.getStore()
}
// @from(Ln 122358, Col 0)
function XA1(A, Q) {
  return VeQ.run(A, Q)
}
// @from(Ln 122361, Col 4)
VeQ
// @from(Ln 122362, Col 4)
mp1 = w(() => {
  VeQ = new dw3
})
// @from(Ln 122366, Col 0)
function k9(A) {
  if (A.startsWith("mcp__")) return "mcp_tool";
  return A
}
// @from(Ln 122371, Col 0)
function pw3() {
  let A = FeQ();
  if (A) return {
    agentId: A.agentId,
    parentSessionId: A.parentSessionId,
    agentType: A.agentType
  };
  return {}
}
// @from(Ln 122381, Col 0)
function nw3() {
  return
}
// @from(Ln 122384, Col 0)
async function dn(A = {}) {
  let Q = A.model ? String(A.model) : B5(),
    B = OL(Q),
    G = await iw3(),
    Z = nw3();
  return {
    model: Q,
    sessionId: q0(),
    userType: "external",
    ...B.length > 0 ? {
      betas: B.join(",")
    } : {},
    envContext: G,
    ...process.env.CLAUDE_CODE_ENTRYPOINT && {
      entrypoint: process.env.CLAUDE_CODE_ENTRYPOINT
    },
    ...process.env.CLAUDE_AGENT_SDK_VERSION && {
      agentSdkVersion: process.env.CLAUDE_AGENT_SDK_VERSION
    },
    isInteractive: String(e5A()),
    clientType: _dA(),
    ...Z && {
      processMetrics: Z
    },
    sweBenchRunId: process.env.SWE_BENCH_RUN_ID || "",
    sweBenchInstanceId: process.env.SWE_BENCH_INSTANCE_ID || "",
    sweBenchTaskId: process.env.SWE_BENCH_TASK_ID || "",
    ...pw3()
  }
}
// @from(Ln 122415, Col 0)
function HeQ(A, Q = {}) {
  let B = {};
  for (let [G, Z] of Object.entries(Q))
    if (Z !== void 0) B[G] = String(Z);
  for (let [G, Z] of Object.entries(A)) {
    if (Z === void 0) continue;
    if (G === "envContext") B.env = eA(Z);
    else if (G === "processMetrics") B.process = eA(Z);
    else B[G] = String(Z)
  }
  return B
}
// @from(Ln 122428, Col 0)
function EeQ(A, Q = {}) {
  let {
    envContext: B,
    processMetrics: G,
    ...Z
  } = A;
  return {
    ...Q,
    ...Z,
    env: B,
    ...G && {
      process: G
    },
    surface: cw3
  }
}
// @from(Ln 122445, Col 0)
function zeQ(A, Q, B = {}) {
  let {
    envContext: G,
    processMetrics: Z,
    ...Y
  } = A, J = {
    platform: G.platform,
    arch: G.arch,
    node_version: G.nodeVersion,
    terminal: G.terminal || "unknown",
    package_managers: G.packageManagers,
    runtimes: G.runtimes,
    is_running_with_bun: G.isRunningWithBun,
    is_ci: G.isCi,
    is_claubbit: G.isClaubbit,
    is_claude_code_remote: G.isClaudeCodeRemote,
    is_local_agent_mode: G.isLocalAgentMode,
    is_conductor: G.isConductor,
    is_github_action: G.isGithubAction,
    is_claude_code_action: G.isClaudeCodeAction,
    is_claude_ai_auth: G.isClaudeAiAuth,
    version: G.version,
    build_time: G.buildTime,
    deployment_environment: G.deploymentEnvironment
  };
  if (G.remoteEnvironmentType) J.remote_environment_type = G.remoteEnvironmentType;
  if (G.claudeCodeContainerId) J.claude_code_container_id = G.claudeCodeContainerId;
  if (G.claudeCodeRemoteSessionId) J.claude_code_remote_session_id = G.claudeCodeRemoteSessionId;
  if (G.tags) J.tags = G.tags.split(",").map((I) => I.trim()).filter(Boolean);
  if (G.githubEventName) J.github_event_name = G.githubEventName;
  if (G.githubActionsRunnerEnvironment) J.github_actions_runner_environment = G.githubActionsRunnerEnvironment;
  if (G.githubActionsRunnerOs) J.github_actions_runner_os = G.githubActionsRunnerOs;
  if (G.githubActionRef) J.github_action_ref = G.githubActionRef;
  if (G.wslVersion) J.wsl_version = G.wslVersion;
  if (G.versionBase) J.version_base = G.versionBase;
  let X = {
    session_id: Y.sessionId,
    model: Y.model,
    user_type: Y.userType,
    is_interactive: Y.isInteractive === "true",
    client_type: Y.clientType
  };
  if (Y.betas) X.betas = Y.betas;
  if (Y.entrypoint) X.entrypoint = Y.entrypoint;
  if (Y.agentSdkVersion) X.agent_sdk_version = Y.agentSdkVersion;
  if (Y.sweBenchRunId) X.swe_bench_run_id = Y.sweBenchRunId;
  if (Y.sweBenchInstanceId) X.swe_bench_instance_id = Y.sweBenchInstanceId;
  if (Y.sweBenchTaskId) X.swe_bench_task_id = Y.sweBenchTaskId;
  if (Y.agentId) X.agent_id = Y.agentId;
  if (Y.parentSessionId) X.parent_session_id = Y.parentSessionId;
  if (Y.agentType) X.agent_type = Y.agentType;
  if (Q.githubActionsMetadata) {
    let I = Q.githubActionsMetadata;
    J.github_actions_metadata = {
      actor_id: I.actorId,
      repository_id: I.repositoryId,
      repository_owner_id: I.repositoryOwnerId
    }
  }
  return {
    env: J,
    ...Z && {
      process: eA(Z)
    },
    core: X,
    additional: B
  }
}
// @from(Ln 122513, Col 4)
cw3 = "claude-code"
// @from(Ln 122514, Col 2)
lw3
// @from(Ln 122514, Col 7)
iw3
// @from(Ln 122515, Col 4)
hW = w(() => {
  Y9();
  p3();
  G0A();
  RR();
  l2();
  C0();
  fQ();
  Q2();
  c3();
  mp1();
  A0();
  lw3 = W0(() => {
    let A = {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.VERSION.match(/^\d+\.\d+\.\d+(?:-[a-z]+)?/);
    return A ? A[0] : void 0
  }), iw3 = W0(async () => {
    let [A, Q] = await Promise.all([l0.getPackageManagers(), l0.getRuntimes()]);
    return {
      platform: l0.platform,
      arch: l0.arch,
      nodeVersion: l0.nodeVersion,
      terminal: wq.terminal,
      packageManagers: A.join(","),
      runtimes: Q.join(","),
      isRunningWithBun: l0.isRunningWithBun(),
      isCi: a1(!1),
      isClaubbit: process.env.CLAUBBIT === "true",
      isClaudeCodeRemote: process.env.CLAUDE_CODE_REMOTE === "true",
      isLocalAgentMode: process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent",
      isConductor: l0.isConductor(),
      ...process.env.CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE && {
        remoteEnvironmentType: process.env.CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE
      },
      ...process.env.CLAUDE_CODE_CONTAINER_ID && {
        claudeCodeContainerId: process.env.CLAUDE_CODE_CONTAINER_ID
      },
      ...process.env.CLAUDE_CODE_REMOTE_SESSION_ID && {
        claudeCodeRemoteSessionId: process.env.CLAUDE_CODE_REMOTE_SESSION_ID
      },
      ...process.env.CLAUDE_CODE_TAGS && {
        tags: process.env.CLAUDE_CODE_TAGS
      },
      isGithubAction: process.env.GITHUB_ACTIONS === "true",
      isClaudeCodeAction: process.env.CLAUDE_CODE_ACTION === "1" || process.env.CLAUDE_CODE_ACTION === "true",
      isClaudeAiAuth: qB(),
      version: {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.7",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-01-13T22:55:21Z"
      }.VERSION,
      versionBase: lw3(),
      buildTime: {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.7",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-01-13T22:55:21Z"
      }.BUILD_TIME,
      deploymentEnvironment: l0.detectDeploymentEnvironment(),
      ...process.env.GITHUB_ACTIONS === "true" && {
        githubEventName: process.env.GITHUB_EVENT_NAME,
        githubActionsRunnerEnvironment: process.env.RUNNER_ENVIRONMENT,
        githubActionsRunnerOs: process.env.RUNNER_OS,
        githubActionRef: process.env.GITHUB_ACTION_PATH?.includes("claude-code-action/") ? process.env.GITHUB_ACTION_PATH.split("claude-code-action/")[1] : void 0
      },
      ...Z1A() && {
        wslVersion: Z1A()
      }
    }
  })
})
// @from(Ln 122598, Col 0)
function gW() {
  return a1(process.env.CLAUDE_CODE_USE_BEDROCK) || a1(process.env.CLAUDE_CODE_USE_VERTEX) || a1(process.env.CLAUDE_CODE_USE_FOUNDRY) || !!process.env.DISABLE_TELEMETRY || !!process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC
}
// @from(Ln 122601, Col 4)
Mu = w(() => {
  fQ()
})
// @from(Ln 122608, Col 0)
function rw3(A) {
  let Q = cn(!0),
    B = {
      networkConfig: {
        api: "https://statsig.anthropic.com/v1/",
        networkTimeoutMs: 30000
      },
      environment: {
        tier: ["test", "dev"].includes("production") ? "development" : "production"
      },
      includeCurrentPageUrlWithEvents: !1,
      logLevel: IA1.LogLevel.None,
      storageProvider: new bP1,
      customUserCacheKeyFunc: (Y, J) => {
        return aw3("sha1").update(Y).update(J.userID || "").digest("hex").slice(0, 10)
      }
    },
    G = new IA1.StatsigClient(A, Q, B);
  G.on("error", () => {
    xQ.head("https://api.anthropic.com/api/hello").catch(() => {})
  });
  let Z = G.initializeAsync();
  return process.on("beforeExit", async () => {
    await G.flush()
  }), process.on("exit", () => {
    G.flush()
  }), {
    client: G,
    initialized: Z
  }
}
// @from(Ln 122640, Col 0)
function CeQ() {
  DA1.cache?.clear?.(), Ru.cache?.clear?.(), WA1.cache?.clear?.()
}
// @from(Ln 122643, Col 0)
async function $QA() {
  if (gW()) return;
  try {
    let A = cn(!0),
      Q = await Ru();
    if (Q) await Q.updateUserAsync(A)
  } catch (A) {
    e(A instanceof Error ? A : Error(`Statsig: Force refresh failed: ${A}`))
  }
}
// @from(Ln 122654, Col 0)
function UeQ() {
  if (gW()) return;
  let A = setInterval(() => {
    $QA()
  }, ow3);
  process.on("beforeExit", () => {
    clearInterval(A)
  })
}
// @from(Ln 122663, Col 0)
async function dp1(A, Q) {
  if (gW()) return;
  try {
    let [B, G] = await Promise.all([Ru(), dn({
      model: Q.model
    })]);
    if (!B) return;
    let Z = HeQ(G, Q),
      Y = {
        eventName: A,
        metadata: Z
      };
    B.logEvent(Y), await B.flush()
  } catch (B) {}
}
// @from(Ln 122679, Col 0)
function qeQ(A, Q) {
  dp1(A, Q)
}
// @from(Ln 122683, Col 0)
function NeQ() {
  return {
    ...$eQ
  }
}
// @from(Ln 122689, Col 0)
function HX(A, Q, B) {
  let G = DA1();
  if (!G) return B;
  let Z = G.client.getExperiment(A);
  if (!Z) return B;
  return Z.get(Q, B)
}
// @from(Ln 122697, Col 0)
function ROA(A) {
  return sw3(A), L1().cachedStatsigGates[A] ?? !1
}
// @from(Ln 122700, Col 4)
IA1
// @from(Ln 122700, Col 9)
ow3 = 21600000
// @from(Ln 122701, Col 2)
$eQ
// @from(Ln 122701, Col 7)
DA1
// @from(Ln 122701, Col 12)
Ru
// @from(Ln 122701, Col 16)
WA1
// @from(Ln 122701, Col 21)
sw3
// @from(Ln 122702, Col 4)
BI = w(() => {
  Y9();
  j5();
  $CQ();
  UCQ();
  npA();
  Ou();
  T1();
  v1();
  GQ();
  hW();
  Mu();
  A0();
  IA1 = c(zCQ(), 1), $eQ = {};
  DA1 = W0(() => {
    if (gW()) return null;
    return rw3(l4Q)
  }), Ru = W0(async () => {
    let A = DA1();
    if (!A) return null;
    return await A.initialized, A.client
  });
  WA1 = W0(async (A) => {
    if (gW()) return !1;
    let Q = DA1();
    if (!Q) return !1;
    await Q.initialized;
    let B = Q.client.checkGate(A);
    return $eQ[A] = B, B
  });
  sw3 = W0(async (A) => {
    let Q = await WA1(A);
    S0((B) => {
      if (B.cachedStatsigGates[A] === Q) return B;
      return {
        ...B,
        cachedStatsigGates: {
          ...B.cachedStatsigGates,
          [A]: Q
        }
      }
    })
  })
})
// @from(Ln 122747, Col 0)
function tw3(A) {
  let Q = [],
    B = [];
  for (let G of A)
    if (weQ.includes(G)) Q.push(G);
    else B.push(G);
  return {
    allowed: Q,
    disallowed: B
  }
}
// @from(Ln 122759, Col 0)
function LeQ(A) {
  if (!A || A.length === 0) return;
  if (qB()) {
    console.warn("Warning: Custom betas are only available for API key users. Ignoring provided betas.");
    return
  }
  let {
    allowed: Q,
    disallowed: B
  } = tw3(A);
  for (let G of B) console.warn(`Warning: Beta header '${G}' is not allowed. Only the following betas are supported: ${weQ.join(", ")}`);
  return Q.length > 0 ? Q : void 0
}
// @from(Ln 122773, Col 0)
function ew3(A) {
  let Q = R4();
  if (Q === "foundry") return !0;
  if (Q === "firstParty") return !A.includes("claude-3-");
  return A.includes("claude-opus-4") || A.includes("claude-sonnet-4")
}
// @from(Ln 122780, Col 0)
function AL3(A) {
  let Q = A.toLowerCase();
  return Q.includes("claude-opus-4") || Q.includes("claude-sonnet-4") || Q.includes("claude-haiku-4")
}
// @from(Ln 122785, Col 0)
function cp1(A) {
  return A.includes("-structured-")
}
// @from(Ln 122789, Col 0)
function OeQ() {
  let A = R4();
  if (A === "vertex" || A === "bedrock") return qb0;
  return Ub0
}
// @from(Ln 122795, Col 0)
function QL3() {
  return (R4() === "firstParty" || R4() === "foundry") && !a1(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS)
}
// @from(Ln 122799, Col 0)
function KA1(A) {
  let Q = OL(A),
    B = SM();
  if (!B || B.length === 0) return Q;
  return [...Q, ...B.filter((G) => !Q.includes(G))]
}
// @from(Ln 122806, Col 0)
function VA1() {
  pp1.cache?.clear?.(), OL.cache?.clear?.(), lp1.cache?.clear?.()
}
// @from(Ln 122809, Col 4)
weQ
// @from(Ln 122809, Col 9)
pp1
// @from(Ln 122809, Col 14)
OL
// @from(Ln 122809, Col 18)
lp1
// @from(Ln 122810, Col 4)
RR = w(() => {
  Y9();
  C0();
  a5A();
  JX();
  Q2();
  fQ();
  MD();
  BI();
  w6();
  weQ = [n5A];
  pp1 = W0((A) => {
    let Q = [],
      B = A.includes("haiku"),
      G = R4(),
      Z = QL3();
    if (!B) Q.push(zb0);
    if (qB()) Q.push(zi);
    if (A.includes("[1m]")) Q.push(n5A);
    else if (A.includes("claude-sonnet-4-5")) {
      if (HX("sonnet_45_1m_header", "enabled", !1)) Q.push(n5A)
    }
    if (!a1(process.env.DISABLE_INTERLEAVED_THINKING) && ew3(A)) Q.push($b0);
    let Y = Z && HX("preserve_thinking", "enabled", !1);
    if (a1(process.env.USE_API_CONTEXT_MANAGEMENT) && !1 || Y) Q.push(CdA);
    let J = f8("tengu_tool_pear");
    if (cp1(A) && J) Q.push(Cb0);
    if (Z && HX("tool_use_examples", "enabled", !1)) Q.push(UdA);
    if (G === "vertex" && AL3(A)) Q.push(pU1);
    if (G === "foundry") Q.push(pU1);
    if (process.env.ANTHROPIC_BETAS && !B) Q.push(...process.env.ANTHROPIC_BETAS.split(",").map((X) => X.trim()).filter(Boolean));
    return Q
  }), OL = W0((A) => {
    let Q = pp1(A);
    if (R4() === "bedrock") return Q.filter((B) => !lU1.has(B));
    return Q
  }), lp1 = W0((A) => {
    return pp1(A).filter((B) => lU1.has(B))
  })
})
// @from(Ln 122850, Col 4)
tp1 = U((XL3) => {
  XL3.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(XL3.HttpAuthLocation || (XL3.HttpAuthLocation = {}));
  XL3.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(XL3.HttpApiKeyAuthLocation || (XL3.HttpApiKeyAuthLocation = {}));
  XL3.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(XL3.EndpointURLScheme || (XL3.EndpointURLScheme = {}));
  XL3.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(XL3.AlgorithmId || (XL3.AlgorithmId = {}));
  var BL3 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => XL3.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => XL3.AlgorithmId.MD5,
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    },
    GL3 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    ZL3 = (A) => {
      return BL3(A)
    },
    YL3 = (A) => {
      return GL3(A)
    };
  XL3.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(XL3.FieldPosition || (XL3.FieldPosition = {}));
  var JL3 = "__smithy_context";
  XL3.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(XL3.IniSectionType || (XL3.IniSectionType = {}));
  XL3.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(XL3.RequestHandlerProtocol || (XL3.RequestHandlerProtocol = {}));
  XL3.SMITHY_CONTEXT_KEY = JL3;
  XL3.getDefaultClientConfiguration = ZL3;
  XL3.resolveDefaultRuntimeConfig = YL3
})