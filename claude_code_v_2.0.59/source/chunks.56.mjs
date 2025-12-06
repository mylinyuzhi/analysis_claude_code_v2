
// @from(Start 5068071, End 5075384)
a9B = z((M_7, n9B) => {
  var {
    Writable: Ks8
  } = UA("node:stream"), Ds8 = UA("node:assert"), {
    parserStates: YU,
    opcodes: _3A,
    states: Hs8,
    emptyBuffer: f9B,
    sentCloseFrameState: h9B
  } = to(), {
    kReadyState: Cs8,
    kSentClose: g9B,
    kResponse: u9B,
    kReceivedClose: m9B
  } = CzA(), {
    channels: CiA
  } = p5A(), {
    isValidStatusCode: Es8,
    isValidOpcode: zs8,
    failWebsocketConnection: AM,
    websocketMessageReceived: d9B,
    utf8Decode: Us8,
    isControlFrame: c9B,
    isTextBinaryFrame: Tv1,
    isContinuationFrame: $s8
  } = UzA(), {
    WebsocketFrameSend: p9B
  } = ViA(), {
    closeWebSocketConnection: l9B
  } = Rv1(), {
    PerMessageDeflate: ws8
  } = b9B();
  class i9B extends Ks8 {
    #A = [];
    #Q = 0;
    #B = !1;
    #Z = YU.INFO;
    #G = {};
    #J = [];
    #I;
    constructor(A, Q) {
      super();
      if (this.ws = A, this.#I = Q == null ? new Map : Q, this.#I.has("permessage-deflate")) this.#I.set("permessage-deflate", new ws8(Q))
    }
    _write(A, Q, B) {
      this.#A.push(A), this.#Q += A.length, this.#B = !0, this.run(B)
    }
    run(A) {
      while (this.#B)
        if (this.#Z === YU.INFO) {
          if (this.#Q < 2) return A();
          let Q = this.consume(2),
            B = (Q[0] & 128) !== 0,
            G = Q[0] & 15,
            Z = (Q[1] & 128) === 128,
            I = !B && G !== _3A.CONTINUATION,
            Y = Q[1] & 127,
            J = Q[0] & 64,
            W = Q[0] & 32,
            X = Q[0] & 16;
          if (!zs8(G)) return AM(this.ws, "Invalid opcode received"), A();
          if (Z) return AM(this.ws, "Frame cannot be masked"), A();
          if (J !== 0 && !this.#I.has("permessage-deflate")) {
            AM(this.ws, "Expected RSV1 to be clear.");
            return
          }
          if (W !== 0 || X !== 0) {
            AM(this.ws, "RSV1, RSV2, RSV3 must be clear");
            return
          }
          if (I && !Tv1(G)) {
            AM(this.ws, "Invalid frame type was fragmented.");
            return
          }
          if (Tv1(G) && this.#J.length > 0) {
            AM(this.ws, "Expected continuation frame");
            return
          }
          if (this.#G.fragmented && I) {
            AM(this.ws, "Fragmented frame exceeded 125 bytes.");
            return
          }
          if ((Y > 125 || I) && c9B(G)) {
            AM(this.ws, "Control frame either too large or fragmented");
            return
          }
          if ($s8(G) && this.#J.length === 0 && !this.#G.compressed) {
            AM(this.ws, "Unexpected continuation frame");
            return
          }
          if (Y <= 125) this.#G.payloadLength = Y, this.#Z = YU.READ_DATA;
          else if (Y === 126) this.#Z = YU.PAYLOADLENGTH_16;
          else if (Y === 127) this.#Z = YU.PAYLOADLENGTH_64;
          if (Tv1(G)) this.#G.binaryType = G, this.#G.compressed = J !== 0;
          this.#G.opcode = G, this.#G.masked = Z, this.#G.fin = B, this.#G.fragmented = I
        } else if (this.#Z === YU.PAYLOADLENGTH_16) {
        if (this.#Q < 2) return A();
        let Q = this.consume(2);
        this.#G.payloadLength = Q.readUInt16BE(0), this.#Z = YU.READ_DATA
      } else if (this.#Z === YU.PAYLOADLENGTH_64) {
        if (this.#Q < 8) return A();
        let Q = this.consume(8),
          B = Q.readUInt32BE(0);
        if (B > 2147483647) {
          AM(this.ws, "Received payload length > 2^31 bytes.");
          return
        }
        let G = Q.readUInt32BE(4);
        this.#G.payloadLength = (B << 8) + G, this.#Z = YU.READ_DATA
      } else if (this.#Z === YU.READ_DATA) {
        if (this.#Q < this.#G.payloadLength) return A();
        let Q = this.consume(this.#G.payloadLength);
        if (c9B(this.#G.opcode)) this.#B = this.parseControlFrame(Q), this.#Z = YU.INFO;
        else if (!this.#G.compressed) {
          if (this.#J.push(Q), !this.#G.fragmented && this.#G.fin) {
            let B = Buffer.concat(this.#J);
            d9B(this.ws, this.#G.binaryType, B), this.#J.length = 0
          }
          this.#Z = YU.INFO
        } else {
          this.#I.get("permessage-deflate").decompress(Q, this.#G.fin, (B, G) => {
            if (B) {
              l9B(this.ws, 1007, B.message, B.message.length);
              return
            }
            if (this.#J.push(G), !this.#G.fin) {
              this.#Z = YU.INFO, this.#B = !0, this.run(A);
              return
            }
            d9B(this.ws, this.#G.binaryType, Buffer.concat(this.#J)), this.#B = !0, this.#Z = YU.INFO, this.#J.length = 0, this.run(A)
          }), this.#B = !1;
          break
        }
      }
    }
    consume(A) {
      if (A > this.#Q) throw Error("Called consume() before buffers satiated.");
      else if (A === 0) return f9B;
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
      Ds8(A.length !== 1);
      let Q;
      if (A.length >= 2) Q = A.readUInt16BE(0);
      if (Q !== void 0 && !Es8(Q)) return {
        code: 1002,
        reason: "Invalid status code",
        error: !0
      };
      let B = A.subarray(2);
      if (B[0] === 239 && B[1] === 187 && B[2] === 191) B = B.subarray(3);
      try {
        B = Us8(B)
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
      if (Q === _3A.CLOSE) {
        if (B === 1) return AM(this.ws, "Received close frame with a 1-byte body."), !1;
        if (this.#G.closeInfo = this.parseCloseBody(A), this.#G.closeInfo.error) {
          let {
            code: G,
            reason: Z
          } = this.#G.closeInfo;
          return l9B(this.ws, G, Z, Z.length), AM(this.ws, Z), !1
        }
        if (this.ws[g9B] !== h9B.SENT) {
          let G = f9B;
          if (this.#G.closeInfo.code) G = Buffer.allocUnsafe(2), G.writeUInt16BE(this.#G.closeInfo.code, 0);
          let Z = new p9B(G);
          this.ws[u9B].socket.write(Z.createFrame(_3A.CLOSE), (I) => {
            if (!I) this.ws[g9B] = h9B.SENT
          })
        }
        return this.ws[Cs8] = Hs8.CLOSING, this.ws[m9B] = !0, !1
      } else if (Q === _3A.PING) {
        if (!this.ws[m9B]) {
          let G = new p9B(A);
          if (this.ws[u9B].socket.write(G.createFrame(_3A.PONG)), CiA.ping.hasSubscribers) CiA.ping.publish({
            payload: A
          })
        }
      } else if (Q === _3A.PONG) {
        if (CiA.pong.hasSubscribers) CiA.pong.publish({
          payload: A
        })
      }
      return !0
    }
    get closingInfo() {
      return this.#G.closeInfo
    }
  }
  n9B.exports = {
    ByteParser: i9B
  }
})
// @from(Start 5075390, End 5076876)
A4B = z((O_7, e9B) => {
  var {
    WebsocketFrameSend: qs8
  } = ViA(), {
    opcodes: s9B,
    sendHints: k3A
  } = to(), Ns8 = Fx1(), r9B = Buffer[Symbol.species];
  class t9B {
    #A = new Ns8;
    #Q = !1;
    #B;
    constructor(A) {
      this.#B = A
    }
    add(A, Q, B) {
      if (B !== k3A.blob) {
        let Z = o9B(A, B);
        if (!this.#Q) this.#B.write(Z, Q);
        else {
          let I = {
            promise: null,
            callback: Q,
            frame: Z
          };
          this.#A.push(I)
        }
        return
      }
      let G = {
        promise: A.arrayBuffer().then((Z) => {
          G.promise = null, G.frame = o9B(Z, B)
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

  function o9B(A, Q) {
    return new qs8(Ls8(A, Q)).createFrame(Q === k3A.string ? s9B.TEXT : s9B.BINARY)
  }

  function Ls8(A, Q) {
    switch (Q) {
      case k3A.string:
        return Buffer.from(A);
      case k3A.arrayBuffer:
      case k3A.blob:
        return new r9B(A);
      case k3A.typedArray:
        return new r9B(A.buffer, A.byteOffset, A.byteLength)
    }
  }
  e9B.exports = {
    SendQueue: t9B
  }
})
// @from(Start 5076882, End 5085584)
X4B = z((R_7, W4B) => {
  var {
    webidl: j4
  } = zD(), {
    URLSerializer: Ms8
  } = QU(), {
    environmentSettingsObject: Q4B
  } = xw(), {
    staticPropertyDescriptors: jc,
    states: NzA,
    sentCloseFrameState: Os8,
    sendHints: EiA
  } = to(), {
    kWebSocketURL: B4B,
    kReadyState: Pv1,
    kController: Rs8,
    kBinaryType: ziA,
    kResponse: G4B,
    kSentClose: Ts8,
    kByteParser: Ps8
  } = CzA(), {
    isConnecting: js8,
    isEstablished: Ss8,
    isClosing: _s8,
    isValidSubprotocol: ks8,
    fireEvent: Z4B
  } = UzA(), {
    establishWebSocketConnection: ys8,
    closeWebSocketConnection: I4B
  } = Rv1(), {
    ByteParser: xs8
  } = a9B(), {
    kEnumerableProperty: QM,
    isBlobLike: Y4B
  } = S6(), {
    getGlobalDispatcher: vs8
  } = flA(), {
    types: J4B
  } = UA("node:util"), {
    ErrorEvent: bs8,
    CloseEvent: fs8
  } = P3A(), {
    SendQueue: hs8
  } = A4B();
  class g7 extends EventTarget {
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
      j4.util.markAsUncloneable(this);
      let B = "WebSocket constructor";
      j4.argumentLengthCheck(arguments, 1, B);
      let G = j4.converters["DOMString or sequence<DOMString> or WebSocketInit"](Q, B, "options");
      A = j4.converters.USVString(A, B, "url"), Q = G.protocols;
      let Z = Q4B.settingsObject.baseUrl,
        I;
      try {
        I = new URL(A, Z)
      } catch (J) {
        throw new DOMException(J, "SyntaxError")
      }
      if (I.protocol === "http:") I.protocol = "ws:";
      else if (I.protocol === "https:") I.protocol = "wss:";
      if (I.protocol !== "ws:" && I.protocol !== "wss:") throw new DOMException(`Expected a ws: or wss: protocol, got ${I.protocol}`, "SyntaxError");
      if (I.hash || I.href.endsWith("#")) throw new DOMException("Got fragment", "SyntaxError");
      if (typeof Q === "string") Q = [Q];
      if (Q.length !== new Set(Q.map((J) => J.toLowerCase())).size) throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
      if (Q.length > 0 && !Q.every((J) => ks8(J))) throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
      this[B4B] = new URL(I.href);
      let Y = Q4B.settingsObject;
      this[Rs8] = ys8(I, Q, Y, this, (J, W) => this.#J(J, W), G), this[Pv1] = g7.CONNECTING, this[Ts8] = Os8.NOT_SENT, this[ziA] = "blob"
    }
    close(A = void 0, Q = void 0) {
      j4.brandCheck(this, g7);
      let B = "WebSocket.close";
      if (A !== void 0) A = j4.converters["unsigned short"](A, B, "code", {
        clamp: !0
      });
      if (Q !== void 0) Q = j4.converters.USVString(Q, B, "reason");
      if (A !== void 0) {
        if (A !== 1000 && (A < 3000 || A > 4999)) throw new DOMException("invalid code", "InvalidAccessError")
      }
      let G = 0;
      if (Q !== void 0) {
        if (G = Buffer.byteLength(Q), G > 123) throw new DOMException(`Reason must be less than 123 bytes; received ${G}`, "SyntaxError")
      }
      I4B(this, A, Q, G)
    }
    send(A) {
      j4.brandCheck(this, g7);
      let Q = "WebSocket.send";
      if (j4.argumentLengthCheck(arguments, 1, Q), A = j4.converters.WebSocketSendData(A, Q, "data"), js8(this)) throw new DOMException("Sent before connected.", "InvalidStateError");
      if (!Ss8(this) || _s8(this)) return;
      if (typeof A === "string") {
        let B = Buffer.byteLength(A);
        this.#Q += B, this.#G.add(A, () => {
          this.#Q -= B
        }, EiA.string)
      } else if (J4B.isArrayBuffer(A)) this.#Q += A.byteLength, this.#G.add(A, () => {
        this.#Q -= A.byteLength
      }, EiA.arrayBuffer);
      else if (ArrayBuffer.isView(A)) this.#Q += A.byteLength, this.#G.add(A, () => {
        this.#Q -= A.byteLength
      }, EiA.typedArray);
      else if (Y4B(A)) this.#Q += A.size, this.#G.add(A, () => {
        this.#Q -= A.size
      }, EiA.blob)
    }
    get readyState() {
      return j4.brandCheck(this, g7), this[Pv1]
    }
    get bufferedAmount() {
      return j4.brandCheck(this, g7), this.#Q
    }
    get url() {
      return j4.brandCheck(this, g7), Ms8(this[B4B])
    }
    get extensions() {
      return j4.brandCheck(this, g7), this.#Z
    }
    get protocol() {
      return j4.brandCheck(this, g7), this.#B
    }
    get onopen() {
      return j4.brandCheck(this, g7), this.#A.open
    }
    set onopen(A) {
      if (j4.brandCheck(this, g7), this.#A.open) this.removeEventListener("open", this.#A.open);
      if (typeof A === "function") this.#A.open = A, this.addEventListener("open", A);
      else this.#A.open = null
    }
    get onerror() {
      return j4.brandCheck(this, g7), this.#A.error
    }
    set onerror(A) {
      if (j4.brandCheck(this, g7), this.#A.error) this.removeEventListener("error", this.#A.error);
      if (typeof A === "function") this.#A.error = A, this.addEventListener("error", A);
      else this.#A.error = null
    }
    get onclose() {
      return j4.brandCheck(this, g7), this.#A.close
    }
    set onclose(A) {
      if (j4.brandCheck(this, g7), this.#A.close) this.removeEventListener("close", this.#A.close);
      if (typeof A === "function") this.#A.close = A, this.addEventListener("close", A);
      else this.#A.close = null
    }
    get onmessage() {
      return j4.brandCheck(this, g7), this.#A.message
    }
    set onmessage(A) {
      if (j4.brandCheck(this, g7), this.#A.message) this.removeEventListener("message", this.#A.message);
      if (typeof A === "function") this.#A.message = A, this.addEventListener("message", A);
      else this.#A.message = null
    }
    get binaryType() {
      return j4.brandCheck(this, g7), this[ziA]
    }
    set binaryType(A) {
      if (j4.brandCheck(this, g7), A !== "blob" && A !== "arraybuffer") this[ziA] = "blob";
      else this[ziA] = A
    }
    #J(A, Q) {
      this[G4B] = A;
      let B = new xs8(this, Q);
      B.on("drain", gs8), B.on("error", us8.bind(this)), A.socket.ws = this, this[Ps8] = B, this.#G = new hs8(A.socket), this[Pv1] = NzA.OPEN;
      let G = A.headersList.get("sec-websocket-extensions");
      if (G !== null) this.#Z = G;
      let Z = A.headersList.get("sec-websocket-protocol");
      if (Z !== null) this.#B = Z;
      Z4B("open", this)
    }
  }
  g7.CONNECTING = g7.prototype.CONNECTING = NzA.CONNECTING;
  g7.OPEN = g7.prototype.OPEN = NzA.OPEN;
  g7.CLOSING = g7.prototype.CLOSING = NzA.CLOSING;
  g7.CLOSED = g7.prototype.CLOSED = NzA.CLOSED;
  Object.defineProperties(g7.prototype, {
    CONNECTING: jc,
    OPEN: jc,
    CLOSING: jc,
    CLOSED: jc,
    url: QM,
    readyState: QM,
    bufferedAmount: QM,
    onopen: QM,
    onerror: QM,
    onclose: QM,
    close: QM,
    onmessage: QM,
    binaryType: QM,
    send: QM,
    extensions: QM,
    protocol: QM,
    [Symbol.toStringTag]: {
      value: "WebSocket",
      writable: !1,
      enumerable: !1,
      configurable: !0
    }
  });
  Object.defineProperties(g7, {
    CONNECTING: jc,
    OPEN: jc,
    CLOSING: jc,
    CLOSED: jc
  });
  j4.converters["sequence<DOMString>"] = j4.sequenceConverter(j4.converters.DOMString);
  j4.converters["DOMString or sequence<DOMString>"] = function(A, Q, B) {
    if (j4.util.Type(A) === "Object" && Symbol.iterator in A) return j4.converters["sequence<DOMString>"](A);
    return j4.converters.DOMString(A, Q, B)
  };
  j4.converters.WebSocketInit = j4.dictionaryConverter([{
    key: "protocols",
    converter: j4.converters["DOMString or sequence<DOMString>"],
    defaultValue: () => []
  }, {
    key: "dispatcher",
    converter: j4.converters.any,
    defaultValue: () => vs8()
  }, {
    key: "headers",
    converter: j4.nullableConverter(j4.converters.HeadersInit)
  }]);
  j4.converters["DOMString or sequence<DOMString> or WebSocketInit"] = function(A) {
    if (j4.util.Type(A) === "Object" && !(Symbol.iterator in A)) return j4.converters.WebSocketInit(A);
    return {
      protocols: j4.converters["DOMString or sequence<DOMString>"](A)
    }
  };
  j4.converters.WebSocketSendData = function(A) {
    if (j4.util.Type(A) === "Object") {
      if (Y4B(A)) return j4.converters.Blob(A, {
        strict: !1
      });
      if (ArrayBuffer.isView(A) || J4B.isArrayBuffer(A)) return j4.converters.BufferSource(A)
    }
    return j4.converters.USVString(A)
  };

  function gs8() {
    this.ws[G4B].socket.resume()
  }

  function us8(A) {
    let Q, B;
    if (A instanceof fs8) Q = A.reason, B = A.code;
    else Q = A.message;
    Z4B("error", this, () => new bs8("error", {
      error: A,
      message: Q
    })), I4B(this, B)
  }
  W4B.exports = {
    WebSocket: g7
  }
})
// @from(Start 5085590, End 5086041)
jv1 = z((T_7, V4B) => {
  function ms8(A) {
    return A.indexOf("\x00") === -1
  }

  function ds8(A) {
    if (A.length === 0) return !1;
    for (let Q = 0; Q < A.length; Q++)
      if (A.charCodeAt(Q) < 48 || A.charCodeAt(Q) > 57) return !1;
    return !0
  }

  function cs8(A) {
    return new Promise((Q) => {
      setTimeout(Q, A).unref()
    })
  }
  V4B.exports = {
    isValidLastEventId: ms8,
    isASCIINumber: ds8,
    delay: cs8
  }
})
// @from(Start 5086047, End 5090153)
C4B = z((P_7, H4B) => {
  var {
    Transform: ps8
  } = UA("node:stream"), {
    isASCIINumber: F4B,
    isValidLastEventId: K4B
  } = jv1(), xb = [239, 187, 191];
  class D4B extends ps8 {
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
          if (this.buffer[0] === xb[0]) {
            B();
            return
          }
          this.checkBOM = !1, B();
          return;
        case 2:
          if (this.buffer[0] === xb[0] && this.buffer[1] === xb[1]) {
            B();
            return
          }
          this.checkBOM = !1;
          break;
        case 3:
          if (this.buffer[0] === xb[0] && this.buffer[1] === xb[1] && this.buffer[2] === xb[2]) {
            this.buffer = Buffer.alloc(0), this.checkBOM = !1, B();
            return
          }
          this.checkBOM = !1;
          break;
        default:
          if (this.buffer[0] === xb[0] && this.buffer[1] === xb[1] && this.buffer[2] === xb[2]) this.buffer = this.buffer.subarray(3);
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
        let I = B + 1;
        if (A[I] === 32) ++I;
        Z = A.subarray(I).toString("utf8")
      } else G = A.toString("utf8"), Z = "";
      switch (G) {
        case "data":
          if (Q[G] === void 0) Q[G] = Z;
          else Q[G] += `
${Z}`;
          break;
        case "retry":
          if (F4B(Z)) Q[G] = Z;
          break;
        case "id":
          if (K4B(Z)) Q[G] = Z;
          break;
        case "event":
          if (Z.length > 0) Q[G] = Z;
          break
      }
    }
    processEvent(A) {
      if (A.retry && F4B(A.retry)) this.state.reconnectionTime = parseInt(A.retry, 10);
      if (A.id && K4B(A.id)) this.state.lastEventId = A.id;
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
  H4B.exports = {
    EventSourceStream: D4B
  }
})
// @from(Start 5090159, End 5095894)
L4B = z((j_7, N4B) => {
  var {
    pipeline: ls8
  } = UA("node:stream"), {
    fetching: is8
  } = VzA(), {
    makeRequest: ns8
  } = N3A(), {
    webidl: vb
  } = zD(), {
    EventSourceStream: as8
  } = C4B(), {
    parseMIMEType: ss8
  } = QU(), {
    createFastMessageEvent: rs8
  } = P3A(), {
    isNetworkError: E4B
  } = WzA(), {
    delay: os8
  } = jv1(), {
    kEnumerableProperty: eo
  } = S6(), {
    environmentSettingsObject: z4B
  } = xw(), U4B = !1, $4B = 3000, LzA = 0, w4B = 1, MzA = 2, ts8 = "anonymous", es8 = "use-credentials";
  class y3A extends EventTarget {
    #A = {
      open: null,
      error: null,
      message: null
    };
    #Q = null;
    #B = !1;
    #Z = LzA;
    #G = null;
    #J = null;
    #I;
    #V;
    constructor(A, Q = {}) {
      super();
      vb.util.markAsUncloneable(this);
      let B = "EventSource constructor";
      if (vb.argumentLengthCheck(arguments, 1, B), !U4B) U4B = !0, process.emitWarning("EventSource is experimental, expect them to change at any time.", {
        code: "UNDICI-ES"
      });
      A = vb.converters.USVString(A, B, "url"), Q = vb.converters.EventSourceInitDict(Q, B, "eventSourceInitDict"), this.#I = Q.dispatcher, this.#V = {
        lastEventId: "",
        reconnectionTime: $4B
      };
      let G = z4B,
        Z;
      try {
        Z = new URL(A, G.settingsObject.baseUrl), this.#V.origin = Z.origin
      } catch (J) {
        throw new DOMException(J, "SyntaxError")
      }
      this.#Q = Z.href;
      let I = ts8;
      if (Q.withCredentials) I = es8, this.#B = !0;
      let Y = {
        redirect: "follow",
        keepalive: !0,
        mode: "cors",
        credentials: I === "anonymous" ? "same-origin" : "omit",
        referrer: "no-referrer"
      };
      Y.client = z4B.settingsObject, Y.headersList = [
        ["accept", {
          name: "accept",
          value: "text/event-stream"
        }]
      ], Y.cache = "no-store", Y.initiator = "other", Y.urlList = [new URL(this.#Q)], this.#G = ns8(Y), this.#F()
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
    #F() {
      if (this.#Z === MzA) return;
      this.#Z = LzA;
      let A = {
          request: this.#G,
          dispatcher: this.#I
        },
        Q = (B) => {
          if (E4B(B)) this.dispatchEvent(new Event("error")), this.close();
          this.#W()
        };
      A.processResponseEndOfBody = Q, A.processResponse = (B) => {
        if (E4B(B))
          if (B.aborted) {
            this.close(), this.dispatchEvent(new Event("error"));
            return
          } else {
            this.#W();
            return
          } let G = B.headersList.get("content-type", !0),
          Z = G !== null ? ss8(G) : "failure",
          I = Z !== "failure" && Z.essence === "text/event-stream";
        if (B.status !== 200 || I === !1) {
          this.close(), this.dispatchEvent(new Event("error"));
          return
        }
        this.#Z = w4B, this.dispatchEvent(new Event("open")), this.#V.origin = B.urlList[B.urlList.length - 1].origin;
        let Y = new as8({
          eventSourceSettings: this.#V,
          push: (J) => {
            this.dispatchEvent(rs8(J.type, J.options))
          }
        });
        ls8(B.body.stream, Y, (J) => {
          if (J?.aborted === !1) this.close(), this.dispatchEvent(new Event("error"))
        })
      }, this.#J = is8(A)
    }
    async #W() {
      if (this.#Z === MzA) return;
      if (this.#Z = LzA, this.dispatchEvent(new Event("error")), await os8(this.#V.reconnectionTime), this.#Z !== LzA) return;
      if (this.#V.lastEventId.length) this.#G.headersList.set("last-event-id", this.#V.lastEventId, !0);
      this.#F()
    }
    close() {
      if (vb.brandCheck(this, y3A), this.#Z === MzA) return;
      this.#Z = MzA, this.#J.abort(), this.#G = null
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
  var q4B = {
    CONNECTING: {
      __proto__: null,
      configurable: !1,
      enumerable: !0,
      value: LzA,
      writable: !1
    },
    OPEN: {
      __proto__: null,
      configurable: !1,
      enumerable: !0,
      value: w4B,
      writable: !1
    },
    CLOSED: {
      __proto__: null,
      configurable: !1,
      enumerable: !0,
      value: MzA,
      writable: !1
    }
  };
  Object.defineProperties(y3A, q4B);
  Object.defineProperties(y3A.prototype, q4B);
  Object.defineProperties(y3A.prototype, {
    close: eo,
    onerror: eo,
    onmessage: eo,
    onopen: eo,
    readyState: eo,
    url: eo,
    withCredentials: eo
  });
  vb.converters.EventSourceInitDict = vb.dictionaryConverter([{
    key: "withCredentials",
    converter: vb.converters.boolean,
    defaultValue: () => !1
  }, {
    key: "dispatcher",
    converter: vb.converters.any
  }]);
  N4B.exports = {
    EventSource: y3A,
    defaultReconnectionTime: $4B
  }
})
// @from(Start 5095897, End 5096831)
function OzA(A) {
  return (Q, B, G) => {
    if (typeof B === "function") G = B, B = null;
    if (!Q || typeof Q !== "string" && typeof Q !== "object" && !(Q instanceof URL)) throw new UiA("invalid url");
    if (B != null && typeof B !== "object") throw new UiA("invalid opts");
    if (B && B.path != null) {
      if (typeof B.path !== "string") throw new UiA("invalid opts.path");
      let Y = B.path;
      if (!B.path.startsWith("/")) Y = `/${Y}`;
      Q = new URL($iA.parseOrigin(Q).origin + Y)
    } else {
      if (!B) B = typeof Q === "object" ? Q : {};
      Q = $iA.parseURL(Q)
    }
    let {
      agent: Z,
      dispatcher: I = Zr8()
    } = B;
    if (Z) throw new UiA("unsupported opts.agent. Did you mean opts.client?");
    return A.call(I, {
      ...B,
      origin: Q.origin,
      path: Q.search ? `${Q.pathname}${Q.search}` : Q.pathname,
      method: B.method || (B.body ? "PUT" : "GET")
    }, G)
  }
}
// @from(Start 5096836, End 5096839)
S_7
// @from(Start 5096841, End 5096844)
Ar8
// @from(Start 5096846, End 5096849)
__7
// @from(Start 5096851, End 5096854)
k_7
// @from(Start 5096856, End 5096859)
Qr8
// @from(Start 5096861, End 5096864)
y_7
// @from(Start 5096866, End 5096869)
Br8
// @from(Start 5096871, End 5096874)
x_7
// @from(Start 5096876, End 5096879)
Gr8
// @from(Start 5096881, End 5096884)
$iA
// @from(Start 5096886, End 5096889)
UiA
// @from(Start 5096891, End 5096894)
x3A
// @from(Start 5096896, End 5096899)
v_7
// @from(Start 5096901, End 5096904)
b_7
// @from(Start 5096906, End 5096909)
f_7
// @from(Start 5096911, End 5096914)
h_7
// @from(Start 5096916, End 5096919)
g_7
// @from(Start 5096921, End 5096924)
u_7
// @from(Start 5096926, End 5096929)
Zr8
// @from(Start 5096931, End 5096934)
Ir8
// @from(Start 5096936, End 5096939)
m_7
// @from(Start 5096941, End 5096944)
d_7
// @from(Start 5096946, End 5096949)
c_7
// @from(Start 5096951, End 5096954)
Sv1
// @from(Start 5096956, End 5096959)
_v1
// @from(Start 5096961, End 5096964)
Wr8
// @from(Start 5096966, End 5096969)
Xr8
// @from(Start 5096971, End 5096974)
wiA
// @from(Start 5096976, End 5096979)
p_7
// @from(Start 5096981, End 5096984)
Vr8
// @from(Start 5096986, End 5096989)
Fr8
// @from(Start 5096991, End 5096994)
Kr8
// @from(Start 5096996, End 5096999)
Dr8
// @from(Start 5097001, End 5097004)
Hr8
// @from(Start 5097006, End 5097009)
Cr8
// @from(Start 5097011, End 5097014)
l_7
// @from(Start 5097016, End 5097019)
i_7
// @from(Start 5097021, End 5097024)
Yr8
// @from(Start 5097026, End 5097029)
Jr8
// @from(Start 5097031, End 5097034)
Er8
// @from(Start 5097036, End 5097039)
n_7
// @from(Start 5097041, End 5097044)
a_7
// @from(Start 5097046, End 5097049)
s_7
// @from(Start 5097051, End 5097054)
r_7
// @from(Start 5097056, End 5097059)
o_7
// @from(Start 5097061, End 5097064)
t_7
// @from(Start 5097066, End 5097069)
e_7
// @from(Start 5097071, End 5097074)
Ak7
// @from(Start 5097076, End 5097079)
Qk7
// @from(Start 5097081, End 5097084)
zr8
// @from(Start 5097086, End 5097089)
Ur8
// @from(Start 5097091, End 5097094)
$r8
// @from(Start 5097096, End 5097099)
wr8
// @from(Start 5097101, End 5097104)
qr8
// @from(Start 5097106, End 5097109)
Nr8
// @from(Start 5097111, End 5097114)
Bk7
// @from(Start 5097120, End 5098549)
kv1 = L(() => {
  S_7 = iEA(), Ar8 = OEA(), __7 = V3A(), k_7 = Y0B(), Qr8 = F3A(), y_7 = Lx1(), Br8 = R0B(), x_7 = y0B(), Gr8 = R7(), $iA = S6(), {
    InvalidArgumentError: UiA
  } = Gr8, x3A = RQB(), v_7 = TEA(), b_7 = ax1(), f_7 = FBB(), h_7 = rx1(), g_7 = fx1(), u_7 = PlA(), {
    getGlobalDispatcher: Zr8,
    setGlobalDispatcher: Ir8
  } = flA(), m_7 = hlA(), d_7 = UlA(), c_7 = $lA();
  Object.assign(Ar8.prototype, x3A);
  Sv1 = Qr8, _v1 = Br8, Wr8 = {
    redirect: UBB(),
    retry: wBB(),
    dump: LBB(),
    dns: PBB()
  }, Xr8 = {
    parseHeaders: $iA.parseHeaders,
    headerNameToString: $iA.headerNameToString
  };
  wiA = Ir8;
  p_7 = VzA().fetch;
  Vr8 = no().Headers, Fr8 = WzA().Response, Kr8 = N3A().Request, Dr8 = yEA().FormData, Hr8 = globalThis.File ?? UA("node:buffer").File, Cr8 = p2B().FileReader;
  ({
    setGlobalOrigin: l_7,
    getGlobalOrigin: i_7
  } = xy1()), {
    CacheStorage: Yr8
  } = e2B(), {
    kConstruct: Jr8
  } = ZiA();
  Er8 = new Yr8(Jr8);
  ({
    deleteCookie: n_7,
    getCookies: a_7,
    getSetCookies: s_7,
    setCookie: r_7
  } = F9B()), {
    parseMIMEType: o_7,
    serializeAMimeType: t_7
  } = QU(), {
    CloseEvent: e_7,
    ErrorEvent: Ak7,
    MessageEvent: Qk7
  } = P3A();
  zr8 = X4B().WebSocket, Ur8 = OzA(x3A.request), $r8 = OzA(x3A.stream), wr8 = OzA(x3A.pipeline), qr8 = OzA(x3A.connect), Nr8 = OzA(x3A.upgrade);
  ({
    EventSource: Bk7
  } = L4B())
})
// @from(Start 5098592, End 5098722)
function yv1() {
  let A = XT();
  if (!A) return;
  return {
    cert: A.cert,
    key: A.key,
    passphrase: A.passphrase
  }
}
// @from(Start 5098724, End 5099022)
function xv1() {
  let A = XT();
  if (!A) return {};
  let Q = {
      cert: A.cert,
      key: A.key,
      passphrase: A.passphrase
    },
    B = new Sv1({
      connect: Q,
      pipelining: 1
    });
  return g("mTLS: Created undici agent with custom certificates"), {
    dispatcher: B
  }
}
// @from(Start 5099024, End 5099188)
function R4B() {
  if (!XT()) return;
  if (process.env.NODE_EXTRA_CA_CERTS) g("NODE_EXTRA_CA_CERTS detected - Node.js will automatically append to built-in CAs")
}
// @from(Start 5099193, End 5099195)
XT
// @from(Start 5099197, End 5099200)
O4B
// @from(Start 5099206, End 5100363)
v3A = L(() => {
  l2();
  kv1();
  V0();
  AQ();
  XT = s1(() => {
    let A = {};
    if (process.env.CLAUDE_CODE_CLIENT_CERT) try {
      A.cert = RA().readFileSync(process.env.CLAUDE_CODE_CLIENT_CERT, {
        encoding: "utf8"
      }), g("mTLS: Loaded client certificate from CLAUDE_CODE_CLIENT_CERT")
    } catch (Q) {
      g(`mTLS: Failed to load client certificate: ${Q}`, {
        level: "error"
      })
    }
    if (process.env.CLAUDE_CODE_CLIENT_KEY) try {
      A.key = RA().readFileSync(process.env.CLAUDE_CODE_CLIENT_KEY, {
        encoding: "utf8"
      }), g("mTLS: Loaded client key from CLAUDE_CODE_CLIENT_KEY")
    } catch (Q) {
      g(`mTLS: Failed to load client key: ${Q}`, {
        level: "error"
      })
    }
    if (process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE) A.passphrase = process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE, g("mTLS: Using client key passphrase");
    if (Object.keys(A).length === 0) return;
    return A
  }), O4B = s1(() => {
    let A = XT();
    if (!A) return;
    let Q = {
      ...A,
      keepAlive: !0
    };
    return g("mTLS: Creating HTTPS agent with custom certificates"), new Lr8(Q)
  })
})
// @from(Start 5100366, End 5100627)
function Mr8(A) {
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
// @from(Start 5100629, End 5100758)
function Sc() {
  return process.env.https_proxy || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.HTTP_PROXY
}
// @from(Start 5100760, End 5100832)
function Or8() {
  return process.env.no_proxy || process.env.NO_PROXY
}
// @from(Start 5100834, End 5101371)
function qiA(A) {
  let Q = Or8();
  if (!Q) return !1;
  if (Q === "*") return !0;
  try {
    let B = new URL(A),
      G = B.hostname.toLowerCase(),
      Z = B.port || (B.protocol === "https:" ? "443" : "80"),
      I = `${G}:${Z}`;
    return Q.split(/[,\s]+/).filter(Boolean).some((J) => {
      if (J = J.toLowerCase().trim(), J.includes(":")) return I === J;
      if (J.startsWith(".")) {
        let W = J;
        return G === J.substring(1) || G.endsWith(W)
      }
      return G === J
    })
  } catch {
    return !1
  }
}
// @from(Start 5101373, End 5101673)
function j4B(A) {
  let Q = XT(),
    B = {
      ...Q && {
        cert: Q.cert,
        key: Q.key,
        passphrase: Q.passphrase
      }
    };
  if (Y0(process.env.CLAUDE_CODE_PROXY_RESOLVES_HOSTS)) B.lookup = (G, Z, I) => {
    I(null, G, Mr8(Z))
  };
  return new vv1.HttpsProxyAgent(A, B)
}
// @from(Start 5101675, End 5101766)
function RzA(A) {
  let Q = Sc();
  if (!Q) return;
  if (qiA(A)) return;
  return j4B(Q)
}
// @from(Start 5101768, End 5101874)
function b3A() {
  let A = Sc(),
    Q = xv1();
  if (A) return {
    dispatcher: S4B(A)
  };
  return Q
}
// @from(Start 5101876, End 5102354)
function _4B() {
  let A = Sc(),
    Q = O4B();
  if (A) {
    YQ.defaults.proxy = !1;
    let B = j4B(A);
    YQ.interceptors.request.use((G) => {
      if (G.url && qiA(G.url))
        if (Q) G.httpsAgent = Q, G.httpAgent = Q;
        else delete G.httpsAgent, delete G.httpAgent;
      else G.httpsAgent = B, G.httpAgent = B;
      return G
    }), wiA(S4B(A))
  } else if (Q) {
    YQ.defaults.httpsAgent = Q;
    let B = xv1();
    if (B.dispatcher) wiA(B.dispatcher)
  }
}
// @from(Start 5102356, End 5102671)
function k4B() {
  let A = Sc();
  if (!A) return {};
  let Q = new vv1.HttpsProxyAgent(A),
    B = new P4B.NodeHttpHandler({
      httpAgent: Q,
      httpsAgent: Q
    });
  return {
    requestHandler: B,
    credentials: T4B.defaultProvider({
      clientConfig: {
        requestHandler: B
      }
    })
  }
}
// @from(Start 5102676, End 5102679)
T4B
// @from(Start 5102681, End 5102684)
P4B
// @from(Start 5102686, End 5102689)
vv1
// @from(Start 5102691, End 5102694)
S4B
// @from(Start 5102700, End 5103114)
_c = L(() => {
  O3();
  l2();
  kv1();
  v3A();
  hQ();
  T4B = BA(Iy1(), 1), P4B = BA(IZ(), 1), vv1 = BA(LEA(), 1);
  S4B = s1((A) => {
    let Q = XT(),
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
    return new _v1(B)
  })
})
// @from(Start 5103117, End 5103184)
function w_(A, Q) {
  return A.find((B) => B.includes(Q)) ?? null
}
// @from(Start 5103185, End 5103514)
async function x4B() {
  let Q = {
    region: hBA(),
    ...k4B()
  };
  if (!process.env.AWS_BEARER_TOKEN_BEDROCK) {
    let B = await h3A();
    if (B) Q.credentials = {
      accessKeyId: B.accessKeyId,
      secretAccessKey: B.secretAccessKey,
      sessionToken: B.sessionToken
    }
  }
  return new f3A.BedrockClient(Q)
}
// @from(Start 5103519, End 5103522)
f3A
// @from(Start 5103524, End 5103527)
y4B
// @from(Start 5103529, End 5103532)
v4B
// @from(Start 5103538, End 5104699)
bv1 = L(() => {
  l2();
  hQ();
  g1();
  _c();
  gB();
  f3A = BA(CgQ(), 1), y4B = s1(async function() {
    let A = await x4B(),
      Q = [],
      B;
    try {
      do {
        let G = new f3A.ListInferenceProfilesCommand({
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
      throw AA(G), G
    }
  });
  v4B = s1(async function(A) {
    try {
      let Q = await x4B(),
        B = new f3A.GetInferenceProfileCommand({
          inferenceProfileIdentifier: A
        }),
        G = await Q.send(B);
      if (!G.models || G.models.length === 0) return null;
      let Z = G.models[0];
      if (!Z?.modelArn) return null;
      let I = Z.modelArn.lastIndexOf("/");
      return I >= 0 ? Z.modelArn.substring(I + 1) : Z.modelArn
    } catch (Q) {
      return AA(Q), null
    }
  })
})
// @from(Start 5104702, End 5105524)
function b4B(A) {
  if (V6() === "foundry") return;
  let Q = A.toLowerCase();
  if (Q.includes("claude-sonnet-4-5") && Q.includes("[1m]")) return "Sonnet 4.5 (with 1M context)";
  if (Q.includes("claude-sonnet-4-5")) return "Sonnet 4.5";
  if (Q.includes("claude-sonnet-4") && Q.includes("[1m]")) return "Sonnet 4 (with 1M context)";
  if (Q.includes("claude-sonnet-4")) return "Sonnet 4";
  if (Q.includes("claude-opus-4-5")) return "Opus 4.5";
  if (Q.includes("claude-opus-4-1")) return "Opus 4.1";
  if (Q.includes("claude-opus-4")) return "Opus 4";
  if (Q.includes("claude-3-7-sonnet")) return "Claude 3.7 Sonnet";
  if (Q.includes("claude-3-5-sonnet")) return "Claude 3.5 Sonnet";
  if (Q.includes("claude-haiku-4-5")) return "Haiku 4.5";
  if (Q.includes("claude-3-5-haiku")) return "Claude 3.5 Haiku";
  return
}
// @from(Start 5105529, End 5105532)
TzA
// @from(Start 5105534, End 5105537)
PzA
// @from(Start 5105539, End 5105542)
jzA
// @from(Start 5105544, End 5105547)
SzA
// @from(Start 5105549, End 5105551)
At
// @from(Start 5105553, End 5105556)
fv1
// @from(Start 5105558, End 5105561)
_zA
// @from(Start 5105563, End 5105566)
kzA
// @from(Start 5105568, End 5105571)
yzA
// @from(Start 5105577, End 5107310)
xzA = L(() => {
  lK();
  TzA = {
    firstParty: "claude-3-7-sonnet-20250219",
    bedrock: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    vertex: "claude-3-7-sonnet@20250219",
    foundry: "claude-3-7-sonnet"
  }, PzA = {
    firstParty: "claude-3-5-sonnet-20241022",
    bedrock: "anthropic.claude-3-5-sonnet-20241022-v2:0",
    vertex: "claude-3-5-sonnet-v2@20241022",
    foundry: "claude-3-5-sonnet"
  }, jzA = {
    firstParty: "claude-3-5-haiku-20241022",
    bedrock: "us.anthropic.claude-3-5-haiku-20241022-v1:0",
    vertex: "claude-3-5-haiku@20241022",
    foundry: "claude-3-5-haiku"
  }, SzA = {
    firstParty: "claude-haiku-4-5-20251001",
    bedrock: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
    vertex: "claude-haiku-4-5@20251001",
    foundry: "claude-haiku-4-5"
  }, At = {
    firstParty: "claude-sonnet-4-20250514",
    bedrock: "us.anthropic.claude-sonnet-4-20250514-v1:0",
    vertex: "claude-sonnet-4@20250514",
    foundry: "claude-sonnet-4"
  }, fv1 = {
    firstParty: "claude-sonnet-4-5-20250929",
    bedrock: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    vertex: "claude-sonnet-4-5@20250929",
    foundry: "claude-sonnet-4-5"
  }, _zA = {
    firstParty: "claude-opus-4-20250514",
    bedrock: "us.anthropic.claude-opus-4-20250514-v1:0",
    vertex: "claude-opus-4@20250514",
    foundry: "claude-opus-4"
  }, kzA = {
    firstParty: "claude-opus-4-1-20250805",
    bedrock: "us.anthropic.claude-opus-4-1-20250805-v1:0",
    vertex: "claude-opus-4-1@20250805",
    foundry: "claude-opus-4-1"
  }, yzA = {
    firstParty: "claude-opus-4-5-20251101",
    bedrock: "us.anthropic.claude-opus-4-5-20251101-v1:0",
    vertex: "claude-opus-4-5@20251101",
    foundry: "claude-opus-4-5"
  }
})
// @from(Start 5107313, End 5107904)
function q_(A) {
  let Q = [],
    B = !1;
  async function G() {
    if (B) return;
    if (Q.length === 0) return;
    B = !0;
    while (Q.length > 0) {
      let {
        args: Z,
        resolve: I,
        reject: Y,
        context: J
      } = Q.shift();
      try {
        let W = await A.apply(J, Z);
        I(W)
      } catch (W) {
        Y(W)
      }
    }
    if (B = !1, Q.length > 0) G()
  }
  return function(...Z) {
    return new Promise((I, Y) => {
      Q.push({
        args: Z,
        resolve: I,
        reject: Y,
        context: this
      }), G()
    })
  }
}
// @from(Start 5107906, End 5108128)
function NiA(A) {
  return {
    haiku35: jzA[A],
    haiku45: SzA[A],
    sonnet35: PzA[A],
    sonnet37: TzA[A],
    sonnet40: At[A],
    sonnet45: fv1[A],
    opus40: _zA[A],
    opus41: kzA[A],
    opus45: yzA[A]
  }
}
// @from(Start 5108129, End 5108972)
async function Rr8() {
  let A;
  try {
    A = await y4B()
  } catch (V) {
    return AA(V), NiA("bedrock")
  }
  if (!A?.length) return NiA("bedrock");
  let Q = w_(A, "claude-3-5-haiku-20241022"),
    B = w_(A, "claude-haiku-4-5-20251001"),
    G = w_(A, "claude-3-5-sonnet-20241022"),
    Z = w_(A, "claude-3-7-sonnet-20250219"),
    I = w_(A, "claude-sonnet-4-20250514"),
    Y = w_(A, "claude-sonnet-4-5-20250929"),
    J = w_(A, "claude-opus-4-20250514"),
    W = w_(A, "claude-opus-4-1-20250805"),
    X = w_(A, "claude-opus-4-5-20251101");
  return {
    haiku35: Q || jzA.bedrock,
    haiku45: B || SzA.bedrock,
    sonnet35: G || PzA.bedrock,
    sonnet37: Z || TzA.bedrock,
    sonnet40: I || At.bedrock,
    sonnet45: Y || fv1.bedrock,
    opus40: J || _zA.bedrock,
    opus41: W || kzA.bedrock,
    opus45: X || yzA.bedrock
  }
}
// @from(Start 5108974, End 5109093)
function Pr8() {
  if ($kA() !== null) return;
  if (V6() !== "bedrock") {
    RX1(NiA(V6()));
    return
  }
  Tr8()
}
// @from(Start 5109095, End 5109183)
function eI() {
  let A = $kA();
  if (A === null) return Pr8(), NiA(V6());
  return A
}
// @from(Start 5109188, End 5109191)
Tr8
// @from(Start 5109197, End 5109405)
hv1 = L(() => {
  _0();
  g1();
  bv1();
  xzA();
  lK();
  Tr8 = q_(async () => {
    if ($kA() !== null) return;
    try {
      let A = await Rr8();
      RX1(A)
    } catch (A) {
      AA(A)
    }
  })
})
// @from(Start 5109408, End 5109549)
function f4B() {
  if (process.platform === "darwin") {
    let A = em();
    tG(`security delete-generic-password -a $USER -s "${A}"`)
  }
}
// @from(Start 5109551, End 5109591)
function dw(A) {
  return A.slice(-20)
}
// @from(Start 5109596, End 5109631)
vzA = L(() => {
  _DA();
  hyA()
})
// @from(Start 5109633, End 5110673)
class vH {
  static instance = null;
  status = {
    isAuthenticating: !1,
    output: []
  };
  listeners = new Set;
  static getInstance() {
    if (!vH.instance) vH.instance = new vH;
    return vH.instance
  }
  getStatus() {
    return {
      ...this.status,
      output: [...this.status.output]
    }
  }
  startAuthentication() {
    this.status = {
      isAuthenticating: !0,
      output: []
    }, this.notifyListeners()
  }
  addOutput(A) {
    this.status.output.push(A), this.notifyListeners()
  }
  setError(A) {
    this.status.error = A, this.notifyListeners()
  }
  endAuthentication(A) {
    if (A) this.status = {
      isAuthenticating: !1,
      output: []
    };
    else this.status.isAuthenticating = !1;
    this.notifyListeners()
  }
  subscribe(A) {
    return this.listeners.add(A), () => {
      this.listeners.delete(A)
    }
  }
  notifyListeners() {
    this.listeners.forEach((A) => A(this.getStatus()))
  }
  static reset() {
    if (vH.instance) vH.instance.listeners.clear(), vH.instance = null
  }
}
// @from(Start 5110722, End 5111208)
function JU() {
  let A = Y0(process.env.CLAUDE_CODE_USE_BEDROCK) || Y0(process.env.CLAUDE_CODE_USE_VERTEX) || Y0(process.env.CLAUDE_CODE_USE_FOUNDRY),
    B = (l0() || {}).apiKeyHelper,
    G = process.env.ANTHROPIC_AUTH_TOKEN || B || process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR,
    {
      source: Z
    } = cw({
      skipRetrievingKeyFromApiKeyHelper: !0
    });
  return !(A || G || (Z === "ANTHROPIC_API_KEY" || Z === "apiKeyHelper") && !Y0(process.env.CLAUDE_CODE_REMOTE))
}
// @from(Start 5111210, End 5111781)
function kc() {
  if (process.env.ANTHROPIC_AUTH_TOKEN) return {
    source: "ANTHROPIC_AUTH_TOKEN",
    hasToken: !0
  };
  if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return {
    source: "CLAUDE_CODE_OAUTH_TOKEN",
    hasToken: !0
  };
  if (sz1()) return {
    source: "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
    hasToken: !0
  };
  if (bzA()) return {
    source: "apiKeyHelper",
    hasToken: !0
  };
  let B = M6();
  if (wv(B?.scopes) && B?.accessToken) return {
    source: "claude.ai",
    hasToken: !0
  };
  return {
    source: "none",
    hasToken: !1
  }
}
// @from(Start 5111783, End 5111842)
function Kw() {
  let {
    key: A
  } = cw();
  return A
}
// @from(Start 5111844, End 5111991)
function g4B() {
  let {
    key: A,
    source: Q
  } = cw({
    skipRetrievingKeyFromApiKeyHelper: !0
  });
  return A !== null && Q !== "none"
}
// @from(Start 5111993, End 5113272)
function cw(A = {}) {
  if (Gz0() && process.env.ANTHROPIC_API_KEY) return {
    key: process.env.ANTHROPIC_API_KEY,
    source: "ANTHROPIC_API_KEY"
  };
  if (Y0(!1)) {
    let G = rz1();
    if (G) return {
      key: G,
      source: "ANTHROPIC_API_KEY"
    };
    if (!process.env.ANTHROPIC_API_KEY && !process.env.CLAUDE_CODE_OAUTH_TOKEN && !process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR) throw Error("ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN env var is required");
    if (process.env.ANTHROPIC_API_KEY) return {
      key: process.env.ANTHROPIC_API_KEY,
      source: "ANTHROPIC_API_KEY"
    };
    return {
      key: null,
      source: "none"
    }
  }
  if (process.env.ANTHROPIC_API_KEY && N1().customApiKeyResponses?.approved?.includes(dw(process.env.ANTHROPIC_API_KEY))) return {
    key: process.env.ANTHROPIC_API_KEY,
    source: "ANTHROPIC_API_KEY"
  };
  let Q = rz1();
  if (Q) return {
    key: Q,
    source: "ANTHROPIC_API_KEY"
  };
  if (A.skipRetrievingKeyFromApiKeyHelper) {
    if (bzA()) return {
      key: null,
      source: "apiKeyHelper"
    }
  } else {
    let G = fzA(N6());
    if (G) return {
      key: G,
      source: "apiKeyHelper"
    }
  }
  let B = hzA();
  if (B) return B;
  return {
    key: null,
    source: "none"
  }
}
// @from(Start 5113274, End 5113327)
function bzA() {
  return (l0() || {}).apiKeyHelper
}
// @from(Start 5113329, End 5113503)
function u4B() {
  let A = bzA();
  if (!A) return !1;
  let Q = OB("projectSettings"),
    B = OB("localSettings");
  return Q?.apiKeyHelper === A || B?.apiKeyHelper === A
}
// @from(Start 5113505, End 5113560)
function gv1() {
  return (l0() || {}).awsAuthRefresh
}
// @from(Start 5113562, End 5113740)
function m4B() {
  let A = gv1();
  if (!A) return !1;
  let Q = OB("projectSettings"),
    B = OB("localSettings");
  return Q?.awsAuthRefresh === A || B?.awsAuthRefresh === A
}
// @from(Start 5113742, End 5113802)
function uv1() {
  return (l0() || {}).awsCredentialExport
}
// @from(Start 5113804, End 5113992)
function d4B() {
  let A = uv1();
  if (!A) return !1;
  let Q = OB("projectSettings"),
    B = OB("localSettings");
  return Q?.awsCredentialExport === A || B?.awsCredentialExport === A
}
// @from(Start 5113994, End 5114300)
function _r8() {
  let A = process.env.CLAUDE_CODE_API_KEY_HELPER_TTL_MS;
  if (A) {
    let Q = parseInt(A, 10);
    if (!Number.isNaN(Q) && Q >= 0) return Q;
    g(`Found CLAUDE_CODE_API_KEY_HELPER_TTL_MS env var, but it was not a valid number. Got ${A}`, {
      level: "error"
    })
  }
  return Sr8
}
// @from(Start 5114302, End 5114340)
function LiA() {
  fzA.cache.clear()
}
// @from(Start 5114342, End 5114438)
function c4B(A) {
  if (bzA()) {
    if (u4B()) {
      if (!TJ(!0)) return
    }
  }
  fzA(A)
}
// @from(Start 5114439, End 5115288)
async function yr8() {
  let A = gv1();
  if (!A) return !1;
  if (m4B()) {
    if (!TJ(!0) && !N6()) {
      let B = Error(`Security: awsAuthRefresh executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.FEEDBACK_CHANNEL}.`);
      return uN("awsAuthRefresh invoked before trust check", B), GA("tengu_awsAuthRefresh_missing_trust", {}), !1
    }
  }
  try {
    return g("Fetching AWS caller identity for AWS auth refresh command"), await DT1(), g("Fetched AWS caller identity, skipping AWS auth refresh command"), !1
  } catch {
    return p4B(A)
  }
}
// @from(Start 5115290, End 5116035)
function p4B(A) {
  g("Running AWS auth refresh command");
  let Q = vH.getInstance();
  return Q.startAuthentication(), new Promise((B) => {
    let G = jr8(A);
    G.stdout.on("data", (Z) => {
      let I = Z.toString().trim();
      if (I) Q.addOutput(I), g(I, {
        level: "debug"
      })
    }), G.stderr.on("data", (Z) => {
      let I = Z.toString().trim();
      if (I) Q.setError(I), g(I, {
        level: "error"
      })
    }), G.on("close", (Z) => {
      if (Z === 0) g("AWS auth refresh completed successfully"), Q.endAuthentication(!0), B(!0);
      else {
        let I = tA.red("Error running awsAuthRefresh (in settings or ~/.claude.json):");
        console.error(I), Q.endAuthentication(!1), B(!1)
      }
    })
  })
}
// @from(Start 5116036, End 5117770)
async function xr8() {
  let A = uv1();
  if (!A) return null;
  if (d4B()) {
    if (!TJ(!0) && !N6()) {
      let B = Error(`Security: awsCredentialExport executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.FEEDBACK_CHANNEL}.`);
      return uN("awsCredentialExport invoked before trust check", B), GA("tengu_awsCredentialExport_missing_trust", {}), null
    }
  }
  try {
    return g("Fetching AWS caller identity for credential export command"), await DT1(), g("Fetched AWS caller identity, skipping AWS credential export command"), null
  } catch {
    try {
      g("Running AWS credential export command");
      let Q = tG(A)?.toString().trim();
      if (!Q) throw Error("awsCredentialExport did not return a valid value");
      let B = JSON.parse(Q);
      if (!BTQ(B)) throw Error("awsCredentialExport did not return valid AWS STS output structure");
      return g("AWS credentials retrieved from awsCredentialExport"), {
        accessKeyId: B.Credentials.AccessKeyId,
        secretAccessKey: B.Credentials.SecretAccessKey,
        sessionToken: B.Credentials.SessionToken
      }
    } catch (Q) {
      let B = tA.red("Error getting AWS credentials from awsCredentialExport (in settings or ~/.claude.json):");
      if (Q instanceof Error && "stderr" in Q) console.error(B, String(Q.stderr));
      else if (Q instanceof Error) console.error(B, Q.message);
      else console.error(B, Q);
      return null
    }
  }
}
// @from(Start 5117772, End 5117810)
function MiA() {
  h3A.cache.clear()
}
// @from(Start 5117812, End 5117961)
function l4B() {
  let A = gv1(),
    Q = uv1();
  if (!A && !Q) return;
  if (m4B() || d4B()) {
    if (!TJ(!0) && !N6()) return
  }
  h3A(), eI()
}
// @from(Start 5117963, End 5118018)
function vr8(A) {
  return /^[a-zA-Z0-9-_]+$/.test(A)
}
// @from(Start 5118020, End 5119066)
function Po0(A) {
  if (!vr8(A)) throw Error("Invalid API key format. API key must contain only alphanumeric characters, dashes, and underscores.");
  let Q = N1();
  if (n4B(), process.platform === "darwin") try {
    let G = em(),
      Z = SDA(),
      I = Buffer.from(A, "utf-8").toString("hex"),
      Y = `add-generic-password -U -a "${Z}" -s "${G}" -X "${I}"
`;
    tG("security -i", {
      input: Y,
      stdio: ["pipe", "pipe", "pipe"]
    }), GA("tengu_api_key_saved_to_keychain", {})
  } catch (G) {
    AA(G), GA("tengu_api_key_keychain_error", {
      error: G.message
    }), Q.primaryApiKey = A, GA("tengu_api_key_saved_to_config", {})
  } else Q.primaryApiKey = A, GA("tengu_api_key_saved_to_config", {});
  if (!Q.customApiKeyResponses) Q.customApiKeyResponses = {
    approved: [],
    rejected: []
  };
  if (!Q.customApiKeyResponses.approved) Q.customApiKeyResponses.approved = [];
  let B = dw(A);
  if (!Q.customApiKeyResponses.approved.includes(B)) Q.customApiKeyResponses.approved.push(B);
  c0(Q), hzA.cache.clear?.()
}
// @from(Start 5119068, End 5119166)
function i4B() {
  n4B();
  let A = N1();
  A.primaryApiKey = void 0, c0(A), hzA.cache.clear?.()
}
// @from(Start 5119168, End 5119234)
function n4B() {
  try {
    f4B()
  } catch (A) {
    AA(A)
  }
}
// @from(Start 5119236, End 5120206)
function gzA(A) {
  if (!wv(A.scopes)) return GA("tengu_oauth_tokens_not_claude_ai", {}), {
    success: !0
  };
  if (!A.refreshToken || !A.expiresAt) return GA("tengu_oauth_tokens_inference_only", {}), {
    success: !0
  };
  let Q = Fw(),
    B = Q.name;
  try {
    let G = Q.read() || {};
    G.claudeAiOauth = {
      accessToken: A.accessToken,
      refreshToken: A.refreshToken,
      expiresAt: A.expiresAt,
      scopes: A.scopes,
      subscriptionType: A.subscriptionType,
      rateLimitTier: A.rateLimitTier
    };
    let Z = Q.update(G);
    if (Z.success) GA("tengu_oauth_tokens_saved", {
      storageBackend: B
    });
    else GA("tengu_oauth_tokens_save_failed", {
      storageBackend: B
    });
    return M6.cache?.clear?.(), x4A(), Z
  } catch (G) {
    return AA(G), GA("tengu_oauth_tokens_save_exception", {
      storageBackend: B,
      error: G.message
    }), {
      success: !1,
      warning: "Failed to save OAuth tokens"
    }
  }
}
// @from(Start 5120207, End 5121290)
async function Qt(A = 0) {
  let B = M6();
  if (!B?.refreshToken || !Ad(B.expiresAt)) return !1;
  if (!wv(B.scopes)) return !1;
  if (M6.cache?.clear?.(), B = M6(), !B?.refreshToken || !Ad(B.expiresAt)) return !1;
  let G = MQ();
  RA().mkdirSync(G);
  let I;
  try {
    I = await h4B.lock(G)
  } catch (Y) {
    if (Y.code === "ELOCKED") {
      if (A < 5) return GA("tengu_oauth_token_refresh_lock_retry", {
        retryCount: A + 1
      }), await new Promise((J) => setTimeout(J, 1000 + Math.random() * 1000)), Qt(A + 1);
      return GA("tengu_oauth_token_refresh_lock_retry_limit_reached", {
        maxRetries: 5
      }), !1
    }
    return AA(Y), GA("tengu_oauth_token_refresh_lock_error", {
      error: Y.message
    }), !1
  }
  try {
    if (M6.cache?.clear?.(), B = M6(), !B?.refreshToken || !Ad(B.expiresAt)) return GA("tengu_oauth_token_refresh_race_resolved", {}), !1;
    let Y = await Mo0(B.refreshToken);
    return gzA(Y), M6.cache?.clear?.(), !0
  } catch (Y) {
    return AA(Y instanceof Error ? Y : Error(String(Y))), !1
  } finally {
    await I()
  }
}
// @from(Start 5121292, End 5121359)
function BB() {
  if (!JU()) return !1;
  return wv(M6()?.scopes)
}
// @from(Start 5121361, End 5121557)
function a4B() {
  if (Y0(process.env.CLAUDE_CODE_USE_BEDROCK) || Y0(process.env.CLAUDE_CODE_USE_VERTEX) || Y0(process.env.CLAUDE_CODE_USE_FOUNDRY)) return !1;
  if (BB()) return !1;
  return !0
}
// @from(Start 5121559, End 5121619)
function t6() {
  return JU() ? N1().oauthAccount : void 0
}
// @from(Start 5121621, End 5121823)
function pw() {
  let A = t6(),
    Q = f4();
  return Q === "max" || Q === "enterprise" || Q === "team" || Q === "pro" && (!o2("tengu_backstage_only") || A?.hasExtraUsageEnabled === !0) || Q === null
}
// @from(Start 5121825, End 5121970)
function f4() {
  if (yo0()) return ko0();
  if (!JU()) return null;
  let A = M6();
  if (!A) return null;
  return A.subscriptionType ?? null
}
// @from(Start 5121972, End 5122087)
function yc() {
  if (!JU()) return null;
  let A = M6();
  if (!A) return null;
  return A.rateLimitTier ?? null
}
// @from(Start 5122089, End 5122356)
function mv1() {
  switch (f4()) {
    case "enterprise":
      return "Claude Enterprise";
    case "team":
      return "Claude Team";
    case "max":
      return "Claude Max";
    case "pro":
      return "Claude Pro";
    default:
      return "Claude API"
  }
}
// @from(Start 5122358, End 5122513)
function N_() {
  return !!(Y0(process.env.CLAUDE_CODE_USE_BEDROCK) || Y0(process.env.CLAUDE_CODE_USE_VERTEX) || Y0(process.env.CLAUDE_CODE_USE_FOUNDRY))
}
// @from(Start 5122515, End 5122573)
function s4B() {
  return (l0() || {}).otelHeadersHelper
}
// @from(Start 5122575, End 5122759)
function uzA() {
  let A = s4B();
  if (!A) return !1;
  let Q = OB("projectSettings"),
    B = OB("localSettings");
  return Q?.otelHeadersHelper === A || B?.otelHeadersHelper === A
}
// @from(Start 5122761, End 5123502)
function r4B() {
  let A = s4B();
  if (!A) return {};
  if (uzA()) {
    if (!TJ(!0)) return {}
  }
  try {
    let Q = tG(A)?.toString().trim();
    if (!Q) throw Error("otelHeadersHelper did not return a valid value");
    let B = JSON.parse(Q);
    if (typeof B !== "object" || B === null || Array.isArray(B)) throw Error("otelHeadersHelper must return a JSON object with string key-value pairs");
    for (let [G, Z] of Object.entries(B))
      if (typeof Z !== "string") throw Error(`otelHeadersHelper returned non-string value for key "${G}": ${typeof Z}`);
    return B
  } catch (Q) {
    throw AA(Error(`Error getting OpenTelemetry headers from otelHeadersHelper (in settings): ${Q instanceof Error?Q.message:String(Q)}`)), Q
  }
}
// @from(Start 5123504, End 5123559)
function br8(A) {
  return A === "max" || A === "pro"
}
// @from(Start 5123561, End 5123633)
function OiA() {
  let A = f4();
  return BB() && A !== null && br8(A)
}
// @from(Start 5123635, End 5124112)
function RiA() {
  if (V6() !== "firstParty") return;
  let {
    source: Q
  } = kc(), B = {};
  if (BB()) B.subscription = mv1();
  else B.tokenSource = Q;
  let {
    key: G,
    source: Z
  } = cw();
  if (G) B.apiKeySource = Z;
  if (Q === "claude.ai" || Z === "/login managed key") {
    let Y = t6()?.organizationName;
    if (Y) B.organization = Y
  }
  let I = t6()?.emailAddress;
  if ((Q === "claude.ai" || Z === "/login managed key") && I) B.email = I;
  return B
}
// @from(Start 5124117, End 5124120)
h4B
// @from(Start 5124122, End 5124134)
Sr8 = 300000
// @from(Start 5124138, End 5124141)
fzA
// @from(Start 5124143, End 5124156)
kr8 = 3600000
// @from(Start 5124160, End 5124163)
h3A
// @from(Start 5124165, End 5124168)
hzA
// @from(Start 5124170, End 5124172)
M6
// @from(Start 5124178, End 5126741)
gB = L(() => {
  jQ();
  MB();
  _8();
  l2();
  hbA();
  g1();
  V0();
  F9();
  mbA();
  No0();
  AL();
  lbA();
  CS();
  AQ();
  hQ();
  _DA();
  _0();
  HT1();
  q0();
  lK();
  hv1();
  vzA();
  u2();
  h4B = BA(T4A(), 1);
  fzA = dz1((A) => {
    let Q = bzA();
    if (!Q) return null;
    if (u4B()) {
      if (!TJ(!0) && !A) {
        let G = Error(`Security: apiKeyHelper executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.FEEDBACK_CHANNEL}.`);
        uN("apiKeyHelper invoked before trust check", G), GA("tengu_apiKeyHelper_missing_trust7", {})
      }
    }
    try {
      let B = tG(Q)?.toString().trim();
      if (!B) throw Error("apiKeyHelper did not return a valid value");
      return B
    } catch (B) {
      let G = tA.red("Error getting API key from apiKeyHelper (in settings or ~/.claude.json):");
      if (B instanceof Error && "stderr" in B) console.error(G, String(B.stderr));
      else if (B instanceof Error) console.error(G, B.message);
      else console.error(G, B);
      return " "
    }
  }, _r8());
  h3A = dz1(async () => {
    let A = await yr8(),
      Q = await xr8();
    if (A || Q) await GTQ();
    return Q
  }, kr8);
  hzA = s1(() => {
    if (process.platform === "darwin") {
      let Q = em();
      try {
        let B = tG(`security find-generic-password -a $USER -w -s "${Q}"`);
        if (B) return {
          key: B,
          source: "/login managed key"
        }
      } catch (B) {
        AA(B)
      }
    }
    let A = N1();
    if (!A.primaryApiKey) return null;
    return {
      key: A.primaryApiKey,
      source: "/login managed key"
    }
  });
  M6 = s1(() => {
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return {
      accessToken: process.env.CLAUDE_CODE_OAUTH_TOKEN,
      refreshToken: null,
      expiresAt: null,
      scopes: ["user:inference"],
      subscriptionType: null,
      rateLimitTier: null
    };
    let A = sz1();
    if (A) return {
      accessToken: A,
      refreshToken: null,
      expiresAt: null,
      scopes: ["user:inference"],
      subscriptionType: null,
      rateLimitTier: null
    };
    try {
      let G = Fw().read()?.claudeAiOauth;
      if (!G?.accessToken) return null;
      return G
    } catch (Q) {
      return AA(Q), null
    }
  })
})
// @from(Start 5126956, End 5127354)
function TJ(A) {
  let Q = xc(nK(), lw);
  if (Q.bypassPermissionsModeAccepted) return !0;
  let B = lv1();
  if (Q.projects?.[B]?.hasTrustDialogAccepted) return !0;
  let Z = W0();
  if (A) return Q.projects?.[Z]?.hasTrustDialogAccepted === !0;
  while (!0) {
    if (Q.projects?.[Z]?.hasTrustDialogAccepted) return !0;
    let Y = t4B(Z, "..");
    if (Y === Z) break;
    Z = Y
  }
  return !1
}
// @from(Start 5127356, End 5127721)
function c0(A) {
  try {
    B8B(nK(), lw, (Q) => ({
      ...A,
      projects: o4B(Q.projects)
    })), bb.config = null, bb.mtime = 0
  } catch (Q) {
    g(`Failed to save config with lock: ${Q}`, {
      level: "error"
    });
    let B = xc(nK(), lw);
    Q8B(nK(), {
      ...A,
      projects: o4B(B.projects)
    }, lw), bb.config = null, bb.mtime = 0
  }
}
// @from(Start 5127723, End 5128231)
function dv1(A) {
  if (A.installMethod !== void 0) return A;
  let Q = "unknown",
    B = A.autoUpdates ?? !0;
  switch (A.autoUpdaterStatus) {
    case "migrated":
      Q = "local";
      break;
    case "installed":
      Q = "native";
      break;
    case "disabled":
      B = !1;
      break;
    case "enabled":
    case "no_permissions":
    case "not_configured":
      Q = "global";
      break;
    case void 0:
      break
  }
  return {
    ...A,
    installMethod: Q,
    autoUpdates: B
  }
}
// @from(Start 5128233, End 5128497)
function o4B(A) {
  if (!A) return A;
  let Q = {},
    B = !1;
  for (let [G, Z] of Object.entries(A))
    if (Z.history !== void 0) {
      B = !0;
      let {
        history: I,
        ...Y
      } = Z;
      Q[G] = Y
    } else Q[G] = Z;
  return B ? Q : A
}
// @from(Start 5128499, End 5128893)
function N1() {
  try {
    let A = RA().existsSync(nK()) ? RA().statSync(nK()) : null;
    if (bb.config && A) {
      if (A.mtimeMs <= bb.mtime) return bb.config
    }
    let Q = dv1(xc(nK(), lw));
    if (A) bb = {
      config: Q,
      mtime: A.mtimeMs
    };
    else bb = {
      config: Q,
      mtime: Date.now()
    };
    return dv1(Q)
  } catch {
    return dv1(xc(nK(), lw))
  }
}
// @from(Start 5128895, End 5129091)
function TiA(A) {
  let Q = N1();
  if (Q.customApiKeyResponses?.approved?.includes(A)) return "approved";
  if (Q.customApiKeyResponses?.rejected?.includes(A)) return "rejected";
  return "new"
}
// @from(Start 5129093, End 5129410)
function Q8B(A, Q, B) {
  let G = e4B(A),
    Z = RA();
  if (!Z.existsSync(G)) Z.mkdirSync(G);
  let I = Object.fromEntries(Object.entries(Q).filter(([Y, J]) => JSON.stringify(J) !== JSON.stringify(B[Y])));
  L_(A, JSON.stringify(I, null, 2), {
    encoding: "utf-8",
    mode: !Z.existsSync(A) ? 384 : void 0
  })
}
// @from(Start 5129412, End 5130234)
function B8B(A, Q, B) {
  let G = e4B(A),
    Z = RA();
  if (!Z.existsSync(G)) Z.mkdirSync(G);
  let I;
  try {
    let Y = `${A}.lock`,
      J = Date.now();
    if (I = A8B.lockSync(A, {
        lockfilePath: Y
      }), Date.now() - J > 100) g("Lock acquisition took longer than expected - another Claude instance may be running");
    let X = xc(A, Q),
      V = B(X),
      F = Object.fromEntries(Object.entries(V).filter(([K, D]) => JSON.stringify(D) !== JSON.stringify(Q[K])));
    if (Z.existsSync(A)) try {
      let K = `${A}.backup`;
      Z.copyFileSync(A, K)
    } catch (K) {
      g(`Failed to backup config: ${K}`, {
        level: "error"
      })
    }
    L_(A, JSON.stringify(F, null, 2), {
      encoding: "utf-8",
      mode: !Z.existsSync(A) ? 384 : void 0
    })
  } finally {
    if (I) I()
  }
}
// @from(Start 5130236, End 5130302)
function PiA() {
  if (pv1) return;
  pv1 = !0, xc(nK(), lw, !0)
}
// @from(Start 5130304, End 5131759)
function xc(A, Q, B) {
  if (!pv1) throw Error("Config accessed before allowed.");
  let G = RA();
  if (!G.existsSync(A)) {
    let Z = `${A}.backup`;
    if (G.existsSync(Z)) process.stdout.write(`
Claude configuration file not found at: ${A}
A backup file exists at: ${Z}
You can manually restore it by running: cp "${Z}" "${A}"

`);
    return Yv(Q)
  }
  try {
    let Z = G.readFileSync(A, {
      encoding: "utf-8"
    });
    try {
      let I = JSON.parse(Z);
      return {
        ...Yv(Q),
        ...I
      }
    } catch (I) {
      let Y = I instanceof Error ? I.message : String(I);
      throw new mz(Y, A, Q)
    }
  } catch (Z) {
    if (Z instanceof mz && B) throw Z;
    if (Z instanceof mz) {
      g(`Config file corrupted, resetting to defaults: ${Z.message}`, {
        level: "error"
      }), AA(Z), process.stdout.write(`
Claude configuration file at ${A} is corrupted: ${Z.message}
`);
      let I = `${A}.corrupted.${Date.now()}`;
      try {
        G.copyFileSync(A, I), g(`Corrupted config backed up to: ${I}`, {
          level: "error"
        })
      } catch {}
      let Y = `${A}.backup`;
      if (process.stdout.write(`
Claude configuration file at ${A} is corrupted
The corrupted file has been backed up to: ${I}
`), G.existsSync(Y)) process.stdout.write(`A backup file exists at: ${Y}
You can manually restore it by running: cp "${Y}" "${A}"

`);
      else process.stdout.write(`
`)
    }
    return Yv(Q)
  }
}
// @from(Start 5131761, End 5131976)
function j5() {
  let A = lv1(),
    Q = xc(nK(), lw);
  if (!Q.projects) return cv1;
  let B = Q.projects[A] ?? cv1;
  if (typeof B.allowedTools === "string") B.allowedTools = f7(B.allowedTools) ?? [];
  return B
}
// @from(Start 5131978, End 5132360)
function AY(A) {
  let Q = lv1();
  try {
    B8B(nK(), lw, (B) => ({
      ...B,
      projects: {
        ...B.projects,
        [Q]: A
      }
    }))
  } catch (B) {
    g(`Failed to save config with lock: ${B}`, {
      level: "error"
    });
    let G = xc(nK(), lw);
    Q8B(nK(), {
      ...G,
      projects: {
        ...G.projects,
        [Q]: A
      }
    }, lw)
  }
}
// @from(Start 5132362, End 5132600)
function fb() {
  let A = N1();
  return !!(Y0(process.env.DISABLE_AUTOUPDATER) || process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC || A.autoUpdates === !1 && (A.installMethod !== "native" || A.autoUpdatesProtectedForNative !== !0))
}
// @from(Start 5132602, End 5132996)
function jiA() {
  if (Y0(process.env.DISABLE_COST_WARNINGS)) return !1;
  if (BB()) return !1;
  let Q = kc(),
    B = Kw() !== null;
  if (!Q.hasToken && !B) return !1;
  let G = N1(),
    Z = G.oauthAccount?.organizationRole,
    I = G.oauthAccount?.workspaceRole;
  if (!Z || !I) return !1;
  return ["admin", "billing"].includes(Z) || ["workspace_admin", "workspace_billing"].includes(I)
}
// @from(Start 5132998, End 5133145)
function hb() {
  let A = N1();
  if (A.userID) return A.userID;
  let Q = hr8(32).toString("hex");
  return c0({
    ...A,
    userID: Q
  }), Q
}
// @from(Start 5133147, End 5133311)
function iv1() {
  let A = N1();
  if (A.anonymousId) return A.anonymousId;
  let Q = `claudecode.v1.${gr8()}`;
  return c0({
    ...A,
    anonymousId: Q
  }), Q
}
// @from(Start 5133313, End 5133437)
function G8B() {
  let A = N1();
  if (!A.firstStartTime) c0({
    ...A,
    firstStartTime: new Date().toISOString()
  })
}
// @from(Start 5133439, End 5133849)
function Gt(A) {
  let Q = uQ();
  if (A === "ExperimentalUltraClaudeMd") return Gt("User");
  switch (A) {
    case "User":
      return Bt(MQ(), "CLAUDE.md");
    case "Local":
      return Bt(Q, "CLAUDE.local.md");
    case "Project":
      return Bt(Q, "CLAUDE.md");
    case "Managed":
      return Bt(iw(), "CLAUDE.md");
    case "ExperimentalUltraClaudeMd":
      return Bt(MQ(), "ULTRACLAUDE.md")
  }
}
// @from(Start 5133851, End 5133907)
function nv1() {
  return Bt(iw(), ".claude", "rules")
}
// @from(Start 5133909, End 5133965)
function av1() {
  return Bt(MQ(), ".claude", "rules")
}
// @from(Start 5133970, End 5133973)
A8B
// @from(Start 5133975, End 5133978)
cv1
// @from(Start 5133980, End 5133982)
lw
// @from(Start 5133984, End 5133987)
Ny7
// @from(Start 5133989, End 5133992)
Ly7
// @from(Start 5133994, End 5133996)
bb
// @from(Start 5133998, End 5134006)
pv1 = !1
// @from(Start 5134010, End 5134013)
lv1
// @from(Start 5134019, End 5135662)
jQ = L(() => {
  UxA();
  l2();
  c5();
  hQ();
  U2();
  LF();
  RZ();
  _0();
  AQ();
  R9();
  gB();
  V0();
  g1();
  MB();
  A8B = BA(T4A(), 1), cv1 = {
    allowedTools: [],
    mcpContextUris: [],
    mcpServers: {},
    enabledMcpjsonServers: [],
    disabledMcpjsonServers: [],
    hasTrustDialogAccepted: !1,
    projectOnboardingSeenCount: 0,
    hasClaudeMdExternalIncludesApproved: !1,
    hasClaudeMdExternalIncludesWarningShown: !1
  }, lw = {
    numStartups: 0,
    installMethod: void 0,
    autoUpdates: void 0,
    theme: "dark",
    preferredNotifChannel: "auto",
    verbose: !1,
    editorMode: "normal",
    autoCompactEnabled: !0,
    hasSeenTasksHint: !1,
    queuedCommandUpHintCount: 0,
    diffTool: "auto",
    customApiKeyResponses: {
      approved: [],
      rejected: []
    },
    env: {},
    tipsHistory: {},
    memoryUsageCount: 0,
    promptQueueUseCount: 0,
    todoFeatureEnabled: !0,
    showExpandedTodos: !1,
    messageIdleNotifThresholdMs: 60000,
    autoConnectIde: !1,
    autoInstallIdeExtension: !0,
    checkpointingShadowRepos: [],
    fileCheckpointingEnabled: !0,
    terminalProgressBarEnabled: !0,
    cachedStatsigGates: {},
    cachedDynamicConfigs: {},
    cachedGrowthBookFeatures: {},
    respectGitignore: !0
  };
  Ny7 = {
    ...lw,
    autoUpdates: !1
  }, Ly7 = {
    ...cv1
  };
  bb = {
    config: null,
    mtime: 0
  };
  lv1 = s1(() => {
    let A = uQ();
    try {
      return fr8(ur8("git rev-parse --show-toplevel", {
        cwd: A,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"]
      }).trim())
    } catch {
      return t4B(A)
    }
  })
})
// @from(Start 5135664, End 5135777)
async function Z8B() {
  if (_iA === null && !SiA) SiA = dr8(), _iA = await SiA, SiA = null, Zt.cache.clear?.()
}
// @from(Start 5135779, End 5136684)
function vc(A) {
  let Q = Zt(A);
  return {
    customIDs: {
      sessionId: Q.sessionId,
      organizationUUID: Q.organizationUuid,
      accountUUID: Q.accountUuid
    },
    userID: Q.deviceId,
    appVersion: Q.appVersion,
    email: Q.email,
    custom: {
      userType: Q.userType,
      organizationUuid: Q.organizationUuid,
      accountUuid: Q.accountUuid,
      subscriptionType: Q.subscriptionType ?? "",
      firstTokenTime: Q.firstTokenTime ?? 0,
      ...Q.githubActionsMetadata && {
        githubActor: Q.githubActionsMetadata.actor,
        githubActorId: Q.githubActionsMetadata.actorId,
        githubRepository: Q.githubActionsMetadata.repository,
        githubRepositoryId: Q.githubActionsMetadata.repositoryId,
        githubRepositoryOwner: Q.githubActionsMetadata.repositoryOwner,
        githubRepositoryOwnerId: Q.githubActionsMetadata.repositoryOwnerId
      }
    }
  }
}
// @from(Start 5136686, End 5136720)
function I8B() {
  return Zt(!0)
}
// @from(Start 5136722, End 5136781)
function mr8() {
  if (_iA !== null) return _iA;
  return
}
// @from(Start 5136782, End 5136815)
async function dr8() {
  return
}
// @from(Start 5136820, End 5136830)
_iA = null
// @from(Start 5136834, End 5136844)
SiA = null
// @from(Start 5136848, End 5136850)
Zt
// @from(Start 5136856, End 5138243)
gb = L(() => {
  jQ();
  l2();
  _0();
  gB();
  _8();
  Zt = s1((A) => {
    let Q = hb(),
      B = N1(),
      G, Z;
    if (A) {
      if (G = f4() ?? void 0, G && B.claudeCodeFirstTokenDate) {
        let W = new Date(B.claudeCodeFirstTokenDate).getTime();
        if (!isNaN(W)) Z = W
      }
    }
    let I = t6(),
      Y = I?.organizationUuid,
      J = I?.accountUuid;
    return {
      deviceId: Q,
      sessionId: e1(),
      email: mr8(),
      appVersion: {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.0.59",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
      }.VERSION,
      organizationUuid: Y,
      accountUuid: J,
      userType: "external",
      subscriptionType: G,
      firstTokenTime: Z,
      ...process.env.GITHUB_ACTIONS === "true" && {
        githubActionsMetadata: {
          actor: process.env.GITHUB_ACTOR,
          actorId: process.env.GITHUB_ACTOR_ID,
          repository: process.env.GITHUB_REPOSITORY,
          repositoryId: process.env.GITHUB_REPOSITORY_ID,
          repositoryOwner: process.env.GITHUB_REPOSITORY_OWNER,
          repositoryOwnerId: process.env.GITHUB_REPOSITORY_OWNER_ID
        }
      }
    }
  })
})
// @from(Start 5138246, End 5138591)
function kiA(A) {
  try {
    let Q = String(A),
      B = process.platform === "win32" ? `powershell.exe -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"ProcessId=${Q}\\").ParentProcessId"` : `ps -o ppid= -p ${Q}`,
      G = tG(B, {
        timeout: 1000
      });
    return G ? G.trim() : null
  } catch {
    return null
  }
}
// @from(Start 5138593, End 5138937)
function Y8B(A) {
  try {
    let Q = String(A),
      B = process.platform === "win32" ? `powershell.exe -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"ProcessId=${Q}\\").CommandLine"` : `ps -o command= -p ${Q}`,
      G = tG(B, {
        timeout: 1000
      });
    return G ? G.trim() : null
  } catch {
    return null
  }
}
// @from(Start 5138942, End 5138967)
sv1 = L(() => {
  _8()
})
// @from(Start 5138970, End 5139137)
function ar8() {
  if (process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm") {
    if (d0.platform !== "darwin") return nr8() || "pycharm"
  }
  return d0.terminal
}
// @from(Start 5139142, End 5139145)
cr8
// @from(Start 5139147, End 5139250)
pr8 = () => {
    return process.platform === "linux" && process.env.CLAUDE_CODE_BUBBLEWRAP === "1"
  }
// @from(Start 5139254, End 5139257)
lr8
// @from(Start 5139259, End 5139262)
ir8
// @from(Start 5139264, End 5139267)
nr8
// @from(Start 5139269, End 5139271)
WU
// @from(Start 5139277, End 5140653)
It = L(() => {
  _8();
  sv1();
  l2();
  AQ();
  V0();
  c5();
  cr8 = s1(async () => {
    let {
      code: A
    } = await QQ("test", ["-f", "/.dockerenv"]);
    if (A !== 0) return !1;
    return process.platform === "linux"
  }), lr8 = s1(() => {
    if (process.platform !== "linux") return !1;
    let A = RA();
    try {
      if (A.existsSync("/lib/libc.musl-x86_64.so.1") || A.existsSync("/lib/libc.musl-aarch64.so.1")) return !0;
      let Q = tG("ldd /bin/ls 2>/dev/null");
      return Q !== null && Q.includes("musl")
    } catch {
      return g("musl detection failed, assuming glibc"), !1
    }
  }), ir8 = ["pycharm", "intellij", "webstorm", "phpstorm", "rubymine", "clion", "goland", "rider", "datagrip", "appcode", "dataspell", "aqua", "gateway", "fleet", "jetbrains", "androidstudio"], nr8 = s1(() => {
    if (process.platform === "darwin") return null;
    try {
      let Q = process.pid.toString();
      for (let B = 0; B < 10; B++) {
        let G = Y8B(Q);
        if (G) {
          let I = G.toLowerCase();
          for (let Y of ir8)
            if (I.includes(Y)) return Y
        }
        let Z = kiA(Q);
        if (!Z || Z === "0" || Z === Q) break;
        Q = Z
      }
    } catch {}
    return null
  });
  WU = {
    ...d0,
    terminal: ar8(),
    getIsDocker: cr8,
    getIsBubblewrapSandbox: pr8,
    isMuslEnvironment: lr8
  }
})
// @from(Start 5140656, End 5140937)
function J7(A, Q, B = !1) {
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
// @from(Start 5140939, End 5141369)
function eC(A) {
  if (A < 60000) {
    if (A === 0) return "0s";
    if (A < 1) return `${(A/1000).toFixed(1)}s`;
    return `${Math.round(A/1000).toString()}s`
  }
  let Q = Math.floor(A / 3600000),
    B = Math.floor(A % 3600000 / 60000),
    G = Math.round(A % 60000 / 1000);
  if (G === 60) G = 0, B++;
  if (B === 60) B = 0, Q++;
  if (Q > 0) return `${Q}h ${B}m ${G}s`;
  if (B > 0) return `${B}m ${G}s`;
  return `${G}s`
}
// @from(Start 5141371, End 5141570)
function JZ(A) {
  let Q = A >= 1000;
  return new Intl.NumberFormat("en", {
    notation: "compact",
    minimumFractionDigits: Q ? 1 : 0,
    maximumFractionDigits: 1
  }).format(A).toLowerCase()
}
// @from(Start 5141572, End 5142703)
function yiA(A, Q = {}) {
  let {
    style: B = "narrow",
    numeric: G = "always",
    now: Z = new Date
  } = Q, I = A.getTime() - Z.getTime(), Y = Math.trunc(I / 1000), J = [{
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
      unit: X,
      seconds: V,
      shortUnit: F
    }
    of J)
    if (Math.abs(Y) >= V) {
      let K = Math.trunc(Y / V);
      if (B === "narrow") return Y < 0 ? `${Math.abs(K)}${F} ago` : `in ${K}${F}`;
      return new Intl.RelativeTimeFormat("en", {
        style: "long",
        numeric: G
      }).format(K, X)
    } if (B === "narrow") return Y <= 0 ? "0s ago" : "in 0s";
  return new Intl.RelativeTimeFormat("en", {
    style: B,
    numeric: G
  }).format(0, "second")
}
// @from(Start 5142705, End 5142903)
function Yt(A, Q = {}) {
  let {
    now: B = new Date,
    ...G
  } = Q;
  if (A > B) return yiA(A, {
    ...G,
    now: B
  });
  return yiA(A, {
    ...G,
    numeric: "always",
    now: B
  })
}
// @from(Start 5142905, End 5143038)
function mzA(A) {
  return [Yt(A.modified, {
    style: "short"
  }), `${A.messageCount} messages`, A.gitBranch || "-"].join(" · ")
}
// @from(Start 5143040, End 5143899)
function g3A(A, Q = !1, B = !0) {
  if (!A) return;
  let G = new Date(A * 1000),
    Z = new Date,
    I = G.getMinutes();
  if ((G.getTime() - Z.getTime()) / 3600000 > 24) {
    let X = {
      month: "short",
      day: "numeric",
      hour: B ? "numeric" : void 0,
      minute: !B || I === 0 ? void 0 : "2-digit",
      hour12: B ? !0 : void 0
    };
    if (G.getFullYear() !== Z.getFullYear()) X.year = "numeric";
    return G.toLocaleString("en-US", X).replace(/ ([AP]M)/i, (F, K) => K.toLowerCase()) + (Q ? ` (${Intl.DateTimeFormat().resolvedOptions().timeZone})` : "")
  }
  let J = G.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: I === 0 ? void 0 : "2-digit",
      hour12: !0
    }),
    W = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return J.replace(/ ([AP]M)/i, (X, V) => V.toLowerCase()) + (Q ? ` (${W})` : "")
}
// @from(Start 5143901, End 5144011)
function J8B(A, Q = !1, B = !0) {
  let G = new Date(A);
  return `${g3A(Math.floor(G.getTime()/1000),Q,B)}`
}
// @from(Start 5144013, End 5144095)
function dzA(A, Q = 4) {
  return `$${A>0.5?rr8(A,100).toFixed(2):A.toFixed(Q)}`
}
// @from(Start 5144097, End 5145190)
function sr8() {
  let A = ru();
  if (Object.keys(A).length === 0) return "Usage:                 0 input, 0 output, 0 cache read, 0 cache write";
  let Q = {};
  for (let [G, Z] of Object.entries(A)) {
    let I = nw(G);
    if (!Q[I]) Q[I] = {
      inputTokens: 0,
      outputTokens: 0,
      cacheReadInputTokens: 0,
      cacheCreationInputTokens: 0,
      webSearchRequests: 0,
      costUSD: 0,
      contextWindow: 0
    };
    let Y = Q[I];
    Y.inputTokens += Z.inputTokens, Y.outputTokens += Z.outputTokens, Y.cacheReadInputTokens += Z.cacheReadInputTokens, Y.cacheCreationInputTokens += Z.cacheCreationInputTokens, Y.webSearchRequests += Z.webSearchRequests, Y.costUSD += Z.costUSD
  }
  let B = "Usage by model:";
  for (let [G, Z] of Object.entries(Q)) {
    let I = `  ${JZ(Z.inputTokens)} input, ${JZ(Z.outputTokens)} output, ${JZ(Z.cacheReadInputTokens)} cache read, ${JZ(Z.cacheCreationInputTokens)} cache write` + (Z.webSearchRequests > 0 ? `, ${JZ(Z.webSearchRequests)} web search` : "") + ` (${dzA(Z.costUSD)})`;
    B += `
` + `${G}:`.padStart(21) + I
  }
  return B
}
// @from(Start 5145192, End 5145558)
function rv1() {
  let A = dzA(hK()) + (kE0() ? " (costs may be inaccurate due to usage of unknown models)" : ""),
    Q = sr8();
  return tA.dim(`Total cost:            ${A}
Total duration (API):  ${eC(gN())}
Total duration (wall): ${eC(zFA())}
Total code changes:    ${Y2A()} ${Y2A()===1?"line":"lines"} added, ${J2A()} ${J2A()===1?"line":"lines"} removed
${Q}`)
}
// @from(Start 5145560, End 5146250)
function X8B() {
  W8B.useEffect(() => {
    let A = () => {
      if (jiA()) process.stdout.write(`
` + rv1() + `
`);
      let Q = j5();
      AY({
        ...Q,
        lastCost: hK(),
        lastAPIDuration: gN(),
        lastToolDuration: RE0(),
        lastDuration: zFA(),
        lastLinesAdded: Y2A(),
        lastLinesRemoved: J2A(),
        lastTotalInputTokens: TE0(),
        lastTotalOutputTokens: PE0(),
        lastTotalCacheCreationInputTokens: SE0(),
        lastTotalCacheReadInputTokens: jE0(),
        lastTotalWebSearchRequests: _E0(),
        lastSessionId: e1()
      })
    };
    return process.on("exit", A), () => {
      process.off("exit", A)
    }
  }, [])
}
// @from(Start 5146252, End 5146305)
function rr8(A, Q) {
  return Math.round(A * Q) / Q
}
// @from(Start 5146307, End 5146700)
function xiA(A, Q, B) {
  OE0(A, Q, B), hE0()?.add(A, {
    model: B
  }), $FA()?.add(Q.input_tokens, {
    type: "input",
    model: B
  }), $FA()?.add(Q.output_tokens, {
    type: "output",
    model: B
  }), $FA()?.add(Q.cache_read_input_tokens ?? 0, {
    type: "cacheRead",
    model: B
  }), $FA()?.add(Q.cache_creation_input_tokens ?? 0, {
    type: "cacheCreation",
    model: B
  })
}
// @from(Start 5146705, End 5146708)
W8B
// @from(Start 5146714, End 5146799)
M_ = L(() => {
  F9();
  t2();
  jQ();
  _0();
  _0();
  _0();
  W8B = BA(VA(), 1)
})
// @from(Start 5146802, End 5147120)
function or8(A, Q) {
  return Q.input_tokens / 1e6 * A.inputTokens + Q.output_tokens / 1e6 * A.outputTokens + (Q.cache_read_input_tokens ?? 0) / 1e6 * A.promptCacheReadTokens + (Q.cache_creation_input_tokens ?? 0) / 1e6 * A.promptCacheWriteTokens + (Q.server_tool_use?.web_search_requests ?? 0) * A.webSearchRequests
}
// @from(Start 5147122, End 5147239)
function tr8(A) {
  return A.input_tokens + (A.cache_read_input_tokens ?? 0) + (A.cache_creation_input_tokens ?? 0)
}
// @from(Start 5147241, End 5147462)
function er8(A, Q) {
  let B = nw(A),
    G = V8B[B];
  if (G === Jt && tr8(Q) > 200000) return ov1;
  if (!G) return GA("tengu_unknown_model_cost", {
    model: A,
    shortName: B
  }), MX1(), V8B[nw(K8B)];
  return G
}
// @from(Start 5147464, End 5147526)
function fiA(A, Q) {
  let B = er8(A, Q);
  return or8(B, Q)
}
// @from(Start 5147528, End 5147618)
function F8B(A) {
  if (Number.isInteger(A)) return `$${A}`;
  return `$${A.toFixed(2)}`
}
// @from(Start 5147620, End 5147703)
function bc(A) {
  return `${F8B(A.inputTokens)}/${F8B(A.outputTokens)} per Mtok`
}
// @from(Start 5147708, End 5147710)
Jt
// @from(Start 5147712, End 5147715)
viA
// @from(Start 5147717, End 5147720)
biA
// @from(Start 5147722, End 5147725)
ov1
// @from(Start 5147727, End 5147730)
tv1
// @from(Start 5147732, End 5147735)
ev1
// @from(Start 5147737, End 5147740)
V8B
// @from(Start 5147746, End 5148959)
hiA = L(() => {
  M_();
  q0();
  xzA();
  t2();
  Jt = {
    inputTokens: 3,
    outputTokens: 15,
    promptCacheWriteTokens: 3.75,
    promptCacheReadTokens: 0.3,
    webSearchRequests: 0.01
  }, viA = {
    inputTokens: 15,
    outputTokens: 75,
    promptCacheWriteTokens: 18.75,
    promptCacheReadTokens: 1.5,
    webSearchRequests: 0.01
  }, biA = {
    inputTokens: 5,
    outputTokens: 25,
    promptCacheWriteTokens: 6.25,
    promptCacheReadTokens: 0.5,
    webSearchRequests: 0.01
  }, ov1 = {
    inputTokens: 6,
    outputTokens: 22.5,
    promptCacheWriteTokens: 7.5,
    promptCacheReadTokens: 0.6,
    webSearchRequests: 0.01
  }, tv1 = {
    inputTokens: 0.8,
    outputTokens: 4,
    promptCacheWriteTokens: 1,
    promptCacheReadTokens: 0.08,
    webSearchRequests: 0.01
  }, ev1 = {
    inputTokens: 1,
    outputTokens: 5,
    promptCacheWriteTokens: 1.25,
    promptCacheReadTokens: 0.1,
    webSearchRequests: 0.01
  }, V8B = {
    [nw(jzA.firstParty)]: tv1,
    [nw(SzA.firstParty)]: ev1,
    [nw(PzA.firstParty)]: Jt,
    [nw(TzA.firstParty)]: Jt,
    [nw(At.firstParty)]: Jt,
    [nw(_zA.firstParty)]: viA,
    [nw(kzA.firstParty)]: viA,
    [nw(yzA.firstParty)]: biA,
    ...{}
  }
})
// @from(Start 5148962, End 5149444)
function fc() {
  let A = process.env.CLAUDE_AGENT_SDK_VERSION ? `, agent-sdk/${process.env.CLAUDE_AGENT_SDK_VERSION}` : "";
  return `claude-cli/${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION} (external, ${process.env.CLAUDE_CODE_ENTRYPOINT}${A})`
}
// @from(Start 5149446, End 5149766)
function Wt() {
  return `claude-code/${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION}`
}
// @from(Start 5149768, End 5150088)
function TV() {
  return `claude-code/${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION}`
}
// @from(Start 5150090, End 5150515)
function DI() {
  if (BB()) {
    let Q = M6();
    if (!Q?.accessToken) return {
      headers: {},
      error: "No OAuth token available"
    };
    return {
      headers: {
        Authorization: `Bearer ${Q.accessToken}`,
        "anthropic-beta": $4A
      }
    }
  }
  let A = Kw();
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
// @from(Start 5150520, End 5150552)
AE = L(() => {
  gB();
  NX()
})
// @from(Start 5150554, End 5151238)
async function Qo8() {
  let A = t6()?.organizationUuid;
  if (!A) throw Error("No organization ID available");
  let Q = DI();
  if (Q.error) throw Error(`Auth error: ${Q.error}`);
  let B = {
    "Content-Type": "application/json",
    "User-Agent": TV(),
    ...Q.headers
  };
  try {
    let G = `https://api.anthropic.com/api/organization/${A}/claude_code_sonnet_1m_access`,
      Z = await YQ.get(G, {
        headers: B,
        timeout: 5000
      });
    return {
      hasAccess: Z.data.has_access,
      hasAccessNotAsDefault: Z.data.has_access_not_as_default,
      hasError: !1
    }
  } catch (G) {
    return AA(G), {
      hasAccess: !1,
      hasError: !0
    }
  }
}
// @from(Start 5151239, End 5151434)
async function Go8() {
  try {
    return await Bo8()
  } catch (A) {
    return g("Sonnet-1M access check failed, defaulting to no access"), {
      hasAccess: !1,
      hasError: !0
    }
  }
}
// @from(Start 5151436, End 5151986)
function hc() {
  let A = t6()?.organizationUuid;
  if (!A) return {
    hasAccess: !1,
    wasPartOfDefaultRollout: !1,
    needsRefresh: !1
  };
  let Q = N1(),
    B = (BB() ? Q.s1mAccessCache : Q.s1mNonSubscriberAccessCache)?.[A],
    G = Date.now();
  if (!B) return {
    hasAccess: !1,
    wasPartOfDefaultRollout: !1,
    needsRefresh: !0
  };
  let {
    hasAccess: Z,
    hasAccessNotAsDefault: I,
    timestamp: Y
  } = B, J = G - Y > Zo8;
  return {
    hasAccess: Z || (I ?? !1),
    wasPartOfDefaultRollout: Z,
    needsRefresh: J
  }
}
// @from(Start 5151987, End 5152066)
async function D8B() {
  let {
    needsRefresh: A
  } = hc();
  if (A) Io8()
}
// @from(Start 5152067, End 5152923)
async function Io8() {
  let A = t6()?.organizationUuid;
  if (!A) return;
  if (!BB()) {
    let Q = await dbA();
    if (!Q) return;
    let {
      uuid: B,
      rate_limit_tier: G
    } = Q.organization, Z = N1(), I = {
      ...Z.s1mNonSubscriberAccessCache,
      [B]: {
        hasAccess: G === "auto_prepaid_tier_3" || G === "manual_tier_3",
        timestamp: Date.now()
      }
    };
    c0({
      ...Z,
      s1mNonSubscriberAccessCache: I
    });
    return
  }
  try {
    let {
      hasAccess: Q,
      hasAccessNotAsDefault: B
    } = await Go8(), G = N1(), Z = {
      ...G.s1mAccessCache,
      [A]: {
        hasAccess: Q,
        hasAccessNotAsDefault: B,
        timestamp: Date.now()
      }
    };
    c0({
      ...G,
      s1mAccessCache: Z
    })
  } catch (Q) {
    g("Failed to fetch and cache Sonnet-1M access"), AA(Q)
  }
}
// @from(Start 5152928, End 5152941)
Ao8 = 3600000
// @from(Start 5152945, End 5152948)
Bo8
// @from(Start 5152950, End 5152963)
Zo8 = 3600000
// @from(Start 5152969, End 5153075)
giA = L(() => {
  O3();
  hbA();
  AE();
  V0();
  g1();
  jQ();
  gB();
  kDA();
  Bo8 = fbA(Qo8, Ao8)
})
// @from(Start 5153078, End 5153109)
function E8B() {
  return C8B
}
// @from(Start 5153111, End 5153299)
function Ab1(A) {
  let Q = 2166136261,
    B = A.length;
  for (let G = 0; G < B; G++) Q ^= A.charCodeAt(G), Q += (Q << 1) + (Q << 4) + (Q << 7) + (Q << 8) + (Q << 24);
  return Q >>> 0
}
// @from(Start 5153301, End 5153444)
function czA(A, Q, B) {
  if (B === 2) return Ab1(Ab1(A + Q) + "") % 1e4 / 1e4;
  if (B === 1) return Ab1(Q + A) % 1000 / 1000;
  return null
}
// @from(Start 5153446, End 5153520)
function Yo8(A) {
  if (A <= 0) return [];
  return Array(A).fill(1 / A)
}
// @from(Start 5153522, End 5153575)
function uiA(A, Q) {
  return A >= Q[0] && A < Q[1]
}
// @from(Start 5153577, End 5153693)
function z8B(A, Q) {
  let B = czA("__" + Q[0], A, 1);
  if (B === null) return !1;
  return B >= Q[1] && B < Q[2]
}
// @from(Start 5153695, End 5153798)
function U8B(A, Q) {
  for (let B = 0; B < Q.length; B++)
    if (uiA(A, Q[B])) return B;
  return -1
}
// @from(Start 5153800, End 5153951)
function Bb1(A) {
  try {
    let Q = A.replace(/([^\\])\//g, "$1\\/");
    return new RegExp(Q)
  } catch (Q) {
    console.error(Q);
    return
  }
}
// @from(Start 5153953, End 5154221)
function miA(A, Q) {
  if (!Q.length) return !1;
  let B = !1,
    G = !1;
  for (let Z = 0; Z < Q.length; Z++) {
    let I = Xo8(A, Q[Z].type, Q[Z].pattern);
    if (Q[Z].include === !1) {
      if (I) return !1
    } else if (B = !0, I) G = !0
  }
  return G || !B
}
// @from(Start 5154223, End 5154480)
function Jo8(A, Q, B) {
  try {
    let G = Q.replace(/[*.+?^${}()|[\]\\]/g, "\\$&").replace(/_____/g, ".*");
    if (B) G = "\\/?" + G.replace(/(^\/|\/$)/g, "") + "\\/?";
    return new RegExp("^" + G + "$", "i").test(A)
  } catch (G) {
    return !1
  }
}
// @from(Start 5154482, End 5154929)
function Wo8(A, Q) {
  try {
    let B = new URL(Q.replace(/^([^:/?]*)\./i, "https://$1.").replace(/\*/g, "_____"), "https://_____"),
      G = [
        [A.host, B.host, !1],
        [A.pathname, B.pathname, !0]
      ];
    if (B.hash) G.push([A.hash, B.hash, !1]);
    return B.searchParams.forEach((Z, I) => {
      G.push([A.searchParams.get(I) || "", Z, !1])
    }), !G.some((Z) => !Jo8(Z[0], Z[1], Z[2]))
  } catch (B) {
    return !1
  }
}
// @from(Start 5154931, End 5155243)
function Xo8(A, Q, B) {
  try {
    let G = new URL(A, "https://_");
    if (Q === "regex") {
      let Z = Bb1(B);
      if (!Z) return !1;
      return Z.test(G.href) || Z.test(G.href.substring(G.origin.length))
    } else if (Q === "simple") return Wo8(G, B);
    return !1
  } catch (G) {
    return !1
  }
}
// @from(Start 5155245, End 5155566)
function $8B(A, Q, B) {
  if (Q = Q === void 0 ? 1 : Q, Q < 0) Q = 0;
  else if (Q > 1) Q = 1;
  let G = Yo8(A);
  if (B = B || G, B.length !== A) B = G;
  let Z = B.reduce((Y, J) => J + Y, 0);
  if (Z < 0.99 || Z > 1.01) B = G;
  let I = 0;
  return B.map((Y) => {
    let J = I;
    return I += Y, [J, J + Q * Y]
  })
}
// @from(Start 5155568, End 5155926)
function w8B(A, Q, B) {
  if (!Q) return null;
  let G = Q.split("?")[1];
  if (!G) return null;
  let Z = G.replace(/#.*/, "").split("&").map((I) => I.split("=", 2)).filter((I) => {
    let [Y] = I;
    return Y === A
  }).map((I) => {
    let [, Y] = I;
    return parseInt(Y)
  });
  if (Z.length > 0 && Z[0] >= 0 && Z[0] < B) return Z[0];
  return null
}
// @from(Start 5155928, End 5156022)
function q8B(A) {
  try {
    return A()
  } catch (Q) {
    return console.error(Q), !1
  }
}
// @from(Start 5156023, End 5156561)
async function Xt(A, Q, B) {
  if (Q = Q || "", B = B || globalThis.crypto && globalThis.crypto.subtle || C8B.SubtleCrypto, !B) throw Error("No SubtleCrypto implementation found");
  try {
    let G = await B.importKey("raw", Qb1(Q), {
        name: "AES-CBC",
        length: 128
      }, !0, ["encrypt", "decrypt"]),
      [Z, I] = A.split("."),
      Y = await B.decrypt({
        name: "AES-CBC",
        iv: Qb1(Z)
      }, G, Qb1(I));
    return new TextDecoder().decode(Y)
  } catch (G) {
    throw Error("Failed to decrypt")
  }
}
// @from(Start 5156563, End 5156648)
function pzA(A) {
  if (typeof A === "string") return A;
  return JSON.stringify(A)
}
// @from(Start 5156650, End 5156920)
function aw(A) {
  if (typeof A === "number") A = A + "";
  if (!A || typeof A !== "string") A = "0";
  let Q = A.replace(/(^v|\+.*$)/g, "").split(/[-.]/);
  if (Q.length === 3) Q.push("~");
  return Q.map((B) => B.match(/^[0-9]+$/) ? B.padStart(5, " ") : B).join("-")
}
// @from(Start 5156922, End 5157015)
function N8B() {
  let A;
  try {
    A = "1.6.1"
  } catch (Q) {
    A = ""
  }
  return A
}
// @from(Start 5157017, End 5157312)
function L8B(A, Q) {
  let B, G;
  try {
    B = new URL(A), G = new URL(Q)
  } catch (Z) {
    return console.error(`Unable to merge query strings: ${Z}`), Q
  }
  return B.searchParams.forEach((Z, I) => {
    if (G.searchParams.has(I)) return;
    G.searchParams.set(I, Z)
  }), G.toString()
}
// @from(Start 5157314, End 5157378)
function H8B(A) {
  return typeof A === "object" && A !== null
}
// @from(Start 5157380, End 5157631)
function diA(A) {
  if (A.urlPatterns && A.variations.some((Q) => H8B(Q) && ("urlRedirect" in Q))) return "redirect";
  else if (A.variations.some((Q) => H8B(Q) && (Q.domMutations || ("js" in Q) || ("css" in Q)))) return "visual";
  return "unknown"
}
// @from(Start 5157632, End 5157898)
async function ciA(A, Q) {
  return new Promise((B) => {
    let G = !1,
      Z, I = (Y) => {
        if (G) return;
        G = !0, Z && clearTimeout(Z), B(Y || null)
      };
    if (Q) Z = setTimeout(() => I(), Q);
    A.then((Y) => I(Y)).catch(() => I())
  })
}
// @from(Start 5157903, End 5157906)
C8B
// @from(Start 5157908, End 5157969)
Qb1 = (A) => Uint8Array.from(atob(A), (Q) => Q.charCodeAt(0))
// @from(Start 5157975, End 5158194)
lzA = L(() => {
  C8B = {
    fetch: globalThis.fetch ? globalThis.fetch.bind(globalThis) : void 0,
    SubtleCrypto: globalThis.crypto ? globalThis.crypto.subtle : void 0,
    EventSource: globalThis.EventSource
  }
})
// @from(Start 5158197, End 5158270)
function R8B(A) {
  if (Object.assign(bH, A), !bH.backgroundSync) zo8()
}