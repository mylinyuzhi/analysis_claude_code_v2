
// @from(Start 7016160, End 7027286)
kc1 = z((aBG, lxB) => {
  var {
    defineProperty: QtA,
    getOwnPropertyDescriptor: tj6,
    getOwnPropertyNames: ej6
  } = Object, AS6 = Object.prototype.hasOwnProperty, Ef = (A, Q) => QtA(A, "name", {
    value: Q,
    configurable: !0
  }), QS6 = (A, Q) => {
    for (var B in Q) QtA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, BS6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of ej6(Q))
        if (!AS6.call(A, Z) && Z !== B) QtA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = tj6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, GS6 = (A) => BS6(QtA({}, "__esModule", {
    value: !0
  }), A), mxB = {};
  QS6(mxB, {
    EventStreamCodec: () => ES6,
    HeaderMarshaller: () => dxB,
    Int64: () => AtA,
    MessageDecoderStream: () => zS6,
    MessageEncoderStream: () => US6,
    SmithyMessageDecoderStream: () => $S6,
    SmithyMessageEncoderStream: () => wS6
  });
  lxB.exports = GS6(mxB);
  var ZS6 = eoA(),
    Fe = Jd(),
    AtA = class A {
      constructor(Q) {
        if (this.bytes = Q, Q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
      }
      static {
        Ef(this, "Int64")
      }
      static fromNumber(Q) {
        if (Q > 9223372036854776000 || Q < -9223372036854776000) throw Error(`${Q} is too large (or, if negative, too small) to represent as an Int64`);
        let B = new Uint8Array(8);
        for (let G = 7, Z = Math.abs(Math.round(Q)); G > -1 && Z > 0; G--, Z /= 256) B[G] = Z;
        if (Q < 0) _c1(B);
        return new A(B)
      }
      valueOf() {
        let Q = this.bytes.slice(0),
          B = Q[0] & 128;
        if (B) _c1(Q);
        return parseInt((0, Fe.toHex)(Q), 16) * (B ? -1 : 1)
      }
      toString() {
        return String(this.valueOf())
      }
    };

  function _c1(A) {
    for (let Q = 0; Q < 8; Q++) A[Q] ^= 255;
    for (let Q = 7; Q > -1; Q--)
      if (A[Q]++, A[Q] !== 0) break
  }
  Ef(_c1, "negate");
  var dxB = class {
      constructor(A, Q) {
        this.toUtf8 = A, this.fromUtf8 = Q
      }
      static {
        Ef(this, "HeaderMarshaller")
      }
      format(A) {
        let Q = [];
        for (let Z of Object.keys(A)) {
          let I = this.fromUtf8(Z);
          Q.push(Uint8Array.from([I.byteLength]), I, this.formatHeaderValue(A[Z]))
        }
        let B = new Uint8Array(Q.reduce((Z, I) => Z + I.byteLength, 0)),
          G = 0;
        for (let Z of Q) B.set(Z, G), G += Z.byteLength;
        return B
      }
      formatHeaderValue(A) {
        switch (A.type) {
          case "boolean":
            return Uint8Array.from([A.value ? 0 : 1]);
          case "byte":
            return Uint8Array.from([2, A.value]);
          case "short":
            let Q = new DataView(new ArrayBuffer(3));
            return Q.setUint8(0, 3), Q.setInt16(1, A.value, !1), new Uint8Array(Q.buffer);
          case "integer":
            let B = new DataView(new ArrayBuffer(5));
            return B.setUint8(0, 4), B.setInt32(1, A.value, !1), new Uint8Array(B.buffer);
          case "long":
            let G = new Uint8Array(9);
            return G[0] = 5, G.set(A.value.bytes, 1), G;
          case "binary":
            let Z = new DataView(new ArrayBuffer(3 + A.value.byteLength));
            Z.setUint8(0, 6), Z.setUint16(1, A.value.byteLength, !1);
            let I = new Uint8Array(Z.buffer);
            return I.set(A.value, 3), I;
          case "string":
            let Y = this.fromUtf8(A.value),
              J = new DataView(new ArrayBuffer(3 + Y.byteLength));
            J.setUint8(0, 7), J.setUint16(1, Y.byteLength, !1);
            let W = new Uint8Array(J.buffer);
            return W.set(Y, 3), W;
          case "timestamp":
            let X = new Uint8Array(9);
            return X[0] = 8, X.set(AtA.fromNumber(A.value.valueOf()).bytes, 1), X;
          case "uuid":
            if (!DS6.test(A.value)) throw Error(`Invalid UUID received: ${A.value}`);
            let V = new Uint8Array(17);
            return V[0] = 9, V.set((0, Fe.fromHex)(A.value.replace(/\-/g, "")), 1), V
        }
      }
      parse(A) {
        let Q = {},
          B = 0;
        while (B < A.byteLength) {
          let G = A.getUint8(B++),
            Z = this.toUtf8(new Uint8Array(A.buffer, A.byteOffset + B, G));
          switch (B += G, A.getUint8(B++)) {
            case 0:
              Q[Z] = {
                type: uxB,
                value: !0
              };
              break;
            case 1:
              Q[Z] = {
                type: uxB,
                value: !1
              };
              break;
            case 2:
              Q[Z] = {
                type: IS6,
                value: A.getInt8(B++)
              };
              break;
            case 3:
              Q[Z] = {
                type: YS6,
                value: A.getInt16(B, !1)
              }, B += 2;
              break;
            case 4:
              Q[Z] = {
                type: JS6,
                value: A.getInt32(B, !1)
              }, B += 4;
              break;
            case 5:
              Q[Z] = {
                type: WS6,
                value: new AtA(new Uint8Array(A.buffer, A.byteOffset + B, 8))
              }, B += 8;
              break;
            case 6:
              let I = A.getUint16(B, !1);
              B += 2, Q[Z] = {
                type: XS6,
                value: new Uint8Array(A.buffer, A.byteOffset + B, I)
              }, B += I;
              break;
            case 7:
              let Y = A.getUint16(B, !1);
              B += 2, Q[Z] = {
                type: VS6,
                value: this.toUtf8(new Uint8Array(A.buffer, A.byteOffset + B, Y))
              }, B += Y;
              break;
            case 8:
              Q[Z] = {
                type: FS6,
                value: new Date(new AtA(new Uint8Array(A.buffer, A.byteOffset + B, 8)).valueOf())
              }, B += 8;
              break;
            case 9:
              let J = new Uint8Array(A.buffer, A.byteOffset + B, 16);
              B += 16, Q[Z] = {
                type: KS6,
                value: `${(0,Fe.toHex)(J.subarray(0,4))}-${(0,Fe.toHex)(J.subarray(4,6))}-${(0,Fe.toHex)(J.subarray(6,8))}-${(0,Fe.toHex)(J.subarray(8,10))}-${(0,Fe.toHex)(J.subarray(10))}`
              };
              break;
            default:
              throw Error("Unrecognized header type tag")
          }
        }
        return Q
      }
    },
    uxB = "boolean",
    IS6 = "byte",
    YS6 = "short",
    JS6 = "integer",
    WS6 = "long",
    XS6 = "binary",
    VS6 = "string",
    FS6 = "timestamp",
    KS6 = "uuid",
    DS6 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
    HS6 = eoA(),
    cxB = 4,
    xp = cxB * 2,
    Ke = 4,
    CS6 = xp + Ke * 2;

  function pxB({
    byteLength: A,
    byteOffset: Q,
    buffer: B
  }) {
    if (A < CS6) throw Error("Provided message too short to accommodate event stream message overhead");
    let G = new DataView(B, Q, A),
      Z = G.getUint32(0, !1);
    if (A !== Z) throw Error("Reported message length does not match received message length");
    let I = G.getUint32(cxB, !1),
      Y = G.getUint32(xp, !1),
      J = G.getUint32(A - Ke, !1),
      W = new HS6.Crc32().update(new Uint8Array(B, Q, xp));
    if (Y !== W.digest()) throw Error(`The prelude checksum specified in the message (${Y}) does not match the calculated CRC32 checksum (${W.digest()})`);
    if (W.update(new Uint8Array(B, Q + xp, A - (xp + Ke))), J !== W.digest()) throw Error(`The message checksum (${W.digest()}) did not match the expected value of ${J}`);
    return {
      headers: new DataView(B, Q + xp + Ke, I),
      body: new Uint8Array(B, Q + xp + Ke + I, Z - I - (xp + Ke + Ke))
    }
  }
  Ef(pxB, "splitMessage");
  var ES6 = class {
      static {
        Ef(this, "EventStreamCodec")
      }
      constructor(A, Q) {
        this.headerMarshaller = new dxB(A, Q), this.messageBuffer = [], this.isEndOfStream = !1
      }
      feed(A) {
        this.messageBuffer.push(this.decode(A))
      }
      endOfStream() {
        this.isEndOfStream = !0
      }
      getMessage() {
        let A = this.messageBuffer.pop(),
          Q = this.isEndOfStream;
        return {
          getMessage() {
            return A
          },
          isEndOfStream() {
            return Q
          }
        }
      }
      getAvailableMessages() {
        let A = this.messageBuffer;
        this.messageBuffer = [];
        let Q = this.isEndOfStream;
        return {
          getMessages() {
            return A
          },
          isEndOfStream() {
            return Q
          }
        }
      }
      encode({
        headers: A,
        body: Q
      }) {
        let B = this.headerMarshaller.format(A),
          G = B.byteLength + Q.byteLength + 16,
          Z = new Uint8Array(G),
          I = new DataView(Z.buffer, Z.byteOffset, Z.byteLength),
          Y = new ZS6.Crc32;
        return I.setUint32(0, G, !1), I.setUint32(4, B.byteLength, !1), I.setUint32(8, Y.update(Z.subarray(0, 8)).digest(), !1), Z.set(B, 12), Z.set(Q, B.byteLength + 12), I.setUint32(G - 4, Y.update(Z.subarray(8, G - 4)).digest(), !1), Z
      }
      decode(A) {
        let {
          headers: Q,
          body: B
        } = pxB(A);
        return {
          headers: this.headerMarshaller.parse(Q),
          body: B
        }
      }
      formatHeaders(A) {
        return this.headerMarshaller.format(A)
      }
    },
    zS6 = class {
      constructor(A) {
        this.options = A
      }
      static {
        Ef(this, "MessageDecoderStream")
      } [Symbol.asyncIterator]() {
        return this.asyncIterator()
      }
      async * asyncIterator() {
        for await (let A of this.options.inputStream) yield this.options.decoder.decode(A)
      }
    },
    US6 = class {
      constructor(A) {
        this.options = A
      }
      static {
        Ef(this, "MessageEncoderStream")
      } [Symbol.asyncIterator]() {
        return this.asyncIterator()
      }
      async * asyncIterator() {
        for await (let A of this.options.messageStream) yield this.options.encoder.encode(A);
        if (this.options.includeEndFrame) yield new Uint8Array(0)
      }
    },
    $S6 = class {
      constructor(A) {
        this.options = A
      }
      static {
        Ef(this, "SmithyMessageDecoderStream")
      } [Symbol.asyncIterator]() {
        return this.asyncIterator()
      }
      async * asyncIterator() {
        for await (let A of this.options.messageStream) {
          let Q = await this.options.deserializer(A);
          if (Q === void 0) continue;
          yield Q
        }
      }
    },
    wS6 = class {
      constructor(A) {
        this.options = A
      }
      static {
        Ef(this, "SmithyMessageEncoderStream")
      } [Symbol.asyncIterator]() {
        return this.asyncIterator()
      }
      async * asyncIterator() {
        for await (let A of this.options.inputStream) yield this.options.serializer(A)
      }
    }
})
// @from(Start 7027292, End 7031206)
sxB = z((Q2G, axB) => {
  var {
    defineProperty: GtA,
    getOwnPropertyDescriptor: qS6,
    getOwnPropertyNames: NS6
  } = Object, LS6 = Object.prototype.hasOwnProperty, ZtA = (A, Q) => GtA(A, "name", {
    value: Q,
    configurable: !0
  }), MS6 = (A, Q) => {
    for (var B in Q) GtA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, OS6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of NS6(Q))
        if (!LS6.call(A, Z) && Z !== B) GtA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = qS6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, RS6 = (A) => OS6(GtA({}, "__esModule", {
    value: !0
  }), A), ixB = {};
  MS6(ixB, {
    eventStreamPayloadHandlerProvider: () => SS6
  });
  axB.exports = RS6(ixB);
  var TS6 = kc1(),
    BtA = UA("stream"),
    PS6 = class extends BtA.Transform {
      static {
        ZtA(this, "EventSigningStream")
      }
      priorSignature;
      messageSigner;
      eventStreamCodec;
      systemClockOffsetProvider;
      constructor(A) {
        super({
          autoDestroy: !0,
          readableObjectMode: !0,
          writableObjectMode: !0,
          ...A
        });
        this.priorSignature = A.priorSignature, this.eventStreamCodec = A.eventStreamCodec, this.messageSigner = A.messageSigner, this.systemClockOffsetProvider = A.systemClockOffsetProvider
      }
      async _transform(A, Q, B) {
        try {
          let G = new Date(Date.now() + await this.systemClockOffsetProvider()),
            Z = {
              ":date": {
                type: "timestamp",
                value: G
              }
            },
            I = await this.messageSigner.sign({
              message: {
                body: A,
                headers: Z
              },
              priorSignature: this.priorSignature
            }, {
              signingDate: G
            });
          this.priorSignature = I.signature;
          let Y = this.eventStreamCodec.encode({
            headers: {
              ...Z,
              ":chunk-signature": {
                type: "binary",
                value: nxB(I.signature)
              }
            },
            body: A
          });
          return this.push(Y), B()
        } catch (G) {
          B(G)
        }
      }
    };

  function nxB(A) {
    let Q = Buffer.from(A, "hex");
    return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
  }
  ZtA(nxB, "getSignatureBinary");
  var jS6 = class {
      static {
        ZtA(this, "EventStreamPayloadHandler")
      }
      messageSigner;
      eventStreamCodec;
      systemClockOffsetProvider;
      constructor(A) {
        this.messageSigner = A.messageSigner, this.eventStreamCodec = new TS6.EventStreamCodec(A.utf8Encoder, A.utf8Decoder), this.systemClockOffsetProvider = async () => A.systemClockOffset ?? 0
      }
      async handle(A, Q, B = {}) {
        let G = Q.request,
          {
            body: Z,
            query: I
          } = G;
        if (!(Z instanceof BtA.Readable)) throw Error("Eventstream payload must be a Readable stream.");
        let Y = Z;
        G.body = new BtA.PassThrough({
          objectMode: !0
        });
        let W = G.headers?.authorization?.match(/Signature=([\w]+)$/)?.[1] ?? I?.["X-Amz-Signature"] ?? "",
          X = new PS6({
            priorSignature: W,
            eventStreamCodec: this.eventStreamCodec,
            messageSigner: await this.messageSigner(),
            systemClockOffsetProvider: this.systemClockOffsetProvider
          });
        (0, BtA.pipeline)(Y, X, G.body, (F) => {
          if (F) throw F
        });
        let V;
        try {
          V = await A(Q)
        } catch (F) {
          throw G.body.end(), F
        }
        return V
      }
    },
    SS6 = ZtA((A) => new jS6(A), "eventStreamPayloadHandlerProvider")
})
// @from(Start 7031212, End 7035249)
QvB = z((Z2G, AvB) => {
  var {
    defineProperty: ItA,
    getOwnPropertyDescriptor: _S6,
    getOwnPropertyNames: kS6
  } = Object, yS6 = Object.prototype.hasOwnProperty, OGA = (A, Q) => ItA(A, "name", {
    value: Q,
    configurable: !0
  }), xS6 = (A, Q) => {
    for (var B in Q) ItA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, vS6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of kS6(Q))
        if (!yS6.call(A, Z) && Z !== B) ItA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = _S6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, bS6 = (A) => vS6(ItA({}, "__esModule", {
    value: !0
  }), A), rxB = {};
  xS6(rxB, {
    EventStreamMarshaller: () => exB,
    eventStreamSerdeProvider: () => fS6
  });
  AvB.exports = bS6(rxB);
  var YwA = kc1();

  function oxB(A) {
    let Q = 0,
      B = 0,
      G = null,
      Z = null,
      I = OGA((J) => {
        if (typeof J !== "number") throw Error("Attempted to allocate an event message where size was not a number: " + J);
        Q = J, B = 4, G = new Uint8Array(J), new DataView(G.buffer).setUint32(0, J, !1)
      }, "allocateMessage"),
      Y = OGA(async function*() {
        let J = A[Symbol.asyncIterator]();
        while (!0) {
          let {
            value: W,
            done: X
          } = await J.next();
          if (X) {
            if (!Q) return;
            else if (Q === B) yield G;
            else throw Error("Truncated event message received.");
            return
          }
          let V = W.length,
            F = 0;
          while (F < V) {
            if (!G) {
              let D = V - F;
              if (!Z) Z = new Uint8Array(4);
              let H = Math.min(4 - B, D);
              if (Z.set(W.slice(F, F + H), B), B += H, F += H, B < 4) break;
              I(new DataView(Z.buffer).getUint32(0, !1)), Z = null
            }
            let K = Math.min(Q - B, V - F);
            if (G.set(W.slice(F, F + K), B), B += K, F += K, Q && Q === B) yield G, G = null, Q = 0, B = 0
          }
        }
      }, "iterator");
    return {
      [Symbol.asyncIterator]: Y
    }
  }
  OGA(oxB, "getChunkedStream");

  function txB(A, Q) {
    return async function(B) {
      let {
        value: G
      } = B.headers[":message-type"];
      if (G === "error") {
        let Z = Error(B.headers[":error-message"].value || "UnknownError");
        throw Z.name = B.headers[":error-code"].value, Z
      } else if (G === "exception") {
        let Z = B.headers[":exception-type"].value,
          I = {
            [Z]: B
          },
          Y = await A(I);
        if (Y.$unknown) {
          let J = Error(Q(B.body));
          throw J.name = Z, J
        }
        throw Y[Z]
      } else if (G === "event") {
        let Z = {
            [B.headers[":event-type"].value]: B
          },
          I = await A(Z);
        if (I.$unknown) return;
        return I
      } else throw Error(`Unrecognizable event type: ${B.headers[":event-type"].value}`)
    }
  }
  OGA(txB, "getMessageUnmarshaller");
  var exB = class {
      static {
        OGA(this, "EventStreamMarshaller")
      }
      constructor({
        utf8Encoder: A,
        utf8Decoder: Q
      }) {
        this.eventStreamCodec = new YwA.EventStreamCodec(A, Q), this.utfEncoder = A
      }
      deserialize(A, Q) {
        let B = oxB(A);
        return new YwA.SmithyMessageDecoderStream({
          messageStream: new YwA.MessageDecoderStream({
            inputStream: B,
            decoder: this.eventStreamCodec
          }),
          deserializer: txB(Q, this.utfEncoder)
        })
      }
      serialize(A, Q) {
        return new YwA.MessageEncoderStream({
          messageStream: new YwA.SmithyMessageEncoderStream({
            inputStream: A,
            serializer: Q
          }),
          encoder: this.eventStreamCodec,
          includeEndFrame: !0
        })
      }
    },
    fS6 = OGA((A) => new exB(A), "eventStreamSerdeProvider")
})
// @from(Start 7035255, End 7037201)
YvB = z((Y2G, IvB) => {
  var {
    defineProperty: YtA,
    getOwnPropertyDescriptor: hS6,
    getOwnPropertyNames: gS6
  } = Object, uS6 = Object.prototype.hasOwnProperty, yc1 = (A, Q) => YtA(A, "name", {
    value: Q,
    configurable: !0
  }), mS6 = (A, Q) => {
    for (var B in Q) YtA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, dS6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of gS6(Q))
        if (!uS6.call(A, Z) && Z !== B) YtA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = hS6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, cS6 = (A) => dS6(YtA({}, "__esModule", {
    value: !0
  }), A), BvB = {};
  mS6(BvB, {
    EventStreamMarshaller: () => ZvB,
    eventStreamSerdeProvider: () => iS6
  });
  IvB.exports = cS6(BvB);
  var pS6 = QvB(),
    lS6 = UA("stream");
  async function* GvB(A) {
    let Q = !1,
      B = !1,
      G = [];
    A.on("error", (Z) => {
      if (!Q) Q = !0;
      if (Z) throw Z
    }), A.on("data", (Z) => {
      G.push(Z)
    }), A.on("end", () => {
      Q = !0
    });
    while (!B) {
      let Z = await new Promise((I) => setTimeout(() => I(G.shift()), 0));
      if (Z) yield Z;
      B = Q && G.length === 0
    }
  }
  yc1(GvB, "readabletoIterable");
  var ZvB = class {
      static {
        yc1(this, "EventStreamMarshaller")
      }
      constructor({
        utf8Encoder: A,
        utf8Decoder: Q
      }) {
        this.universalMarshaller = new pS6.EventStreamMarshaller({
          utf8Decoder: Q,
          utf8Encoder: A
        })
      }
      deserialize(A, Q) {
        let B = typeof A[Symbol.asyncIterator] === "function" ? A : GvB(A);
        return this.universalMarshaller.deserialize(B, Q)
      }
      serialize(A, Q) {
        return lS6.Readable.from(this.universalMarshaller.serialize(A, Q))
      }
    },
    iS6 = yc1((A) => new ZvB(A), "eventStreamSerdeProvider")
})
// @from(Start 7037207, End 7039990)
xc1 = z((W2G, CvB) => {
  var {
    defineProperty: JtA,
    getOwnPropertyDescriptor: nS6,
    getOwnPropertyNames: aS6
  } = Object, sS6 = Object.prototype.hasOwnProperty, WtA = (A, Q) => JtA(A, "name", {
    value: Q,
    configurable: !0
  }), rS6 = (A, Q) => {
    for (var B in Q) JtA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, oS6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of aS6(Q))
        if (!sS6.call(A, Z) && Z !== B) JtA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = nS6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, tS6 = (A) => oS6(JtA({}, "__esModule", {
    value: !0
  }), A), JvB = {};
  rS6(JvB, {
    AlgorithmId: () => FvB,
    EndpointURLScheme: () => VvB,
    FieldPosition: () => KvB,
    HttpApiKeyAuthLocation: () => XvB,
    HttpAuthLocation: () => WvB,
    IniSectionType: () => DvB,
    RequestHandlerProtocol: () => HvB,
    SMITHY_CONTEXT_KEY: () => G_6,
    getDefaultClientConfiguration: () => Q_6,
    resolveDefaultRuntimeConfig: () => B_6
  });
  CvB.exports = tS6(JvB);
  var WvB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(WvB || {}),
    XvB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(XvB || {}),
    VvB = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(VvB || {}),
    FvB = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(FvB || {}),
    eS6 = WtA((A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => "sha256",
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => "md5",
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
    }, "getChecksumConfiguration"),
    A_6 = WtA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    Q_6 = WtA((A) => {
      return eS6(A)
    }, "getDefaultClientConfiguration"),
    B_6 = WtA((A) => {
      return A_6(A)
    }, "resolveDefaultRuntimeConfig"),
    KvB = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(KvB || {}),
    G_6 = "__smithy_context",
    DvB = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(DvB || {}),
    HvB = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(HvB || {})
})
// @from(Start 7039996, End 7068451)
FwA = z((X2G, yvB) => {
  var {
    defineProperty: FtA,
    getOwnPropertyDescriptor: Z_6,
    getOwnPropertyNames: I_6
  } = Object, Y_6 = Object.prototype.hasOwnProperty, zB = (A, Q) => FtA(A, "name", {
    value: Q,
    configurable: !0
  }), J_6 = (A, Q) => {
    for (var B in Q) FtA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, W_6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of I_6(Q))
        if (!Y_6.call(A, Z) && Z !== B) FtA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Z_6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, X_6 = (A) => W_6(FtA({}, "__esModule", {
    value: !0
  }), A), zvB = {};
  J_6(zvB, {
    Client: () => V_6,
    Command: () => $vB,
    LazyJsonString: () => De,
    NoOpLogger: () => Yk6,
    SENSITIVE_STRING: () => K_6,
    ServiceException: () => n_6,
    _json: () => mc1,
    collectBody: () => vc1.collectBody,
    convertMap: () => Jk6,
    createAggregatedClient: () => D_6,
    dateToUtcString: () => OvB,
    decorateServiceException: () => RvB,
    emitWarningIfUnsupportedVersion: () => o_6,
    expectBoolean: () => C_6,
    expectByte: () => uc1,
    expectFloat32: () => XtA,
    expectInt: () => z_6,
    expectInt32: () => hc1,
    expectLong: () => XwA,
    expectNonNull: () => $_6,
    expectNumber: () => WwA,
    expectObject: () => wvB,
    expectShort: () => gc1,
    expectString: () => w_6,
    expectUnion: () => q_6,
    extendedEncodeURIComponent: () => vc1.extendedEncodeURIComponent,
    getArrayIfSingleItem: () => Zk6,
    getDefaultClientConfiguration: () => Bk6,
    getDefaultExtensionConfiguration: () => PvB,
    getValueFromTextNode: () => jvB,
    handleFloat: () => M_6,
    isSerializableHeaderValue: () => Ik6,
    limitedParseDouble: () => pc1,
    limitedParseFloat: () => O_6,
    limitedParseFloat32: () => R_6,
    loadConfigsForDefaultMode: () => r_6,
    logger: () => VwA,
    map: () => ic1,
    parseBoolean: () => H_6,
    parseEpochTimestamp: () => h_6,
    parseRfc3339DateTime: () => __6,
    parseRfc3339DateTimeWithOffset: () => y_6,
    parseRfc7231DateTime: () => f_6,
    quoteHeader: () => _vB,
    resolveDefaultRuntimeConfig: () => Gk6,
    resolvedPath: () => vc1.resolvedPath,
    serializeDateTime: () => Dk6,
    serializeFloat: () => Kk6,
    splitEvery: () => kvB,
    splitHeader: () => Hk6,
    strictParseByte: () => MvB,
    strictParseDouble: () => cc1,
    strictParseFloat: () => N_6,
    strictParseFloat32: () => qvB,
    strictParseInt: () => T_6,
    strictParseInt32: () => P_6,
    strictParseLong: () => LvB,
    strictParseShort: () => RGA,
    take: () => Wk6,
    throwDefaultError: () => TvB,
    withBaseException: () => a_6
  });
  yvB.exports = X_6(zvB);
  var UvB = uR(),
    V_6 = class {
      constructor(A) {
        this.config = A, this.middlewareStack = (0, UvB.constructStack)()
      }
      static {
        zB(this, "Client")
      }
      send(A, Q, B) {
        let G = typeof Q !== "function" ? Q : void 0,
          Z = typeof Q === "function" ? Q : B,
          I = G === void 0 && this.config.cacheMiddleware === !0,
          Y;
        if (I) {
          if (!this.handlers) this.handlers = new WeakMap;
          let J = this.handlers;
          if (J.has(A.constructor)) Y = J.get(A.constructor);
          else Y = A.resolveMiddleware(this.middlewareStack, this.config, G), J.set(A.constructor, Y)
        } else delete this.handlers, Y = A.resolveMiddleware(this.middlewareStack, this.config, G);
        if (Z) Y(A).then((J) => Z(null, J.output), (J) => Z(J)).catch(() => {});
        else return Y(A).then((J) => J.output)
      }
      destroy() {
        this.config?.requestHandler?.destroy?.(), delete this.handlers
      }
    },
    vc1 = w5(),
    fc1 = xc1(),
    $vB = class {
      constructor() {
        this.middlewareStack = (0, UvB.constructStack)()
      }
      static {
        zB(this, "Command")
      }
      static classBuilder() {
        return new F_6
      }
      resolveMiddlewareWithContext(A, Q, B, {
        middlewareFn: G,
        clientName: Z,
        commandName: I,
        inputFilterSensitiveLog: Y,
        outputFilterSensitiveLog: J,
        smithyContext: W,
        additionalContext: X,
        CommandCtor: V
      }) {
        for (let C of G.bind(this)(V, A, Q, B)) this.middlewareStack.use(C);
        let F = A.concat(this.middlewareStack),
          {
            logger: K
          } = Q,
          D = {
            logger: K,
            clientName: Z,
            commandName: I,
            inputFilterSensitiveLog: Y,
            outputFilterSensitiveLog: J,
            [fc1.SMITHY_CONTEXT_KEY]: {
              commandInstance: this,
              ...W
            },
            ...X
          },
          {
            requestHandler: H
          } = Q;
        return F.resolve((C) => H.handle(C.request, B || {}), D)
      }
    },
    F_6 = class {
      constructor() {
        this._init = () => {}, this._ep = {}, this._middlewareFn = () => [], this._commandName = "", this._clientName = "", this._additionalContext = {}, this._smithyContext = {}, this._inputFilterSensitiveLog = (A) => A, this._outputFilterSensitiveLog = (A) => A, this._serializer = null, this._deserializer = null
      }
      static {
        zB(this, "ClassBuilder")
      }
      init(A) {
        this._init = A
      }
      ep(A) {
        return this._ep = A, this
      }
      m(A) {
        return this._middlewareFn = A, this
      }
      s(A, Q, B = {}) {
        return this._smithyContext = {
          service: A,
          operation: Q,
          ...B
        }, this
      }
      c(A = {}) {
        return this._additionalContext = A, this
      }
      n(A, Q) {
        return this._clientName = A, this._commandName = Q, this
      }
      f(A = (B) => B, Q = (B) => B) {
        return this._inputFilterSensitiveLog = A, this._outputFilterSensitiveLog = Q, this
      }
      ser(A) {
        return this._serializer = A, this
      }
      de(A) {
        return this._deserializer = A, this
      }
      build() {
        let A = this,
          Q;
        return Q = class extends $vB {
          constructor(...[B]) {
            super();
            this.serialize = A._serializer, this.deserialize = A._deserializer, this.input = B ?? {}, A._init(this)
          }
          static {
            zB(this, "CommandRef")
          }
          static getEndpointParameterInstructions() {
            return A._ep
          }
          resolveMiddleware(B, G, Z) {
            return this.resolveMiddlewareWithContext(B, G, Z, {
              CommandCtor: Q,
              middlewareFn: A._middlewareFn,
              clientName: A._clientName,
              commandName: A._commandName,
              inputFilterSensitiveLog: A._inputFilterSensitiveLog,
              outputFilterSensitiveLog: A._outputFilterSensitiveLog,
              smithyContext: A._smithyContext,
              additionalContext: A._additionalContext
            })
          }
        }
      }
    },
    K_6 = "***SensitiveInformation***",
    D_6 = zB((A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = zB(async function(Y, J, W) {
            let X = new G(Y);
            if (typeof J === "function") this.send(X, J);
            else if (typeof W === "function") {
              if (typeof J !== "object") throw Error(`Expected http options but got ${typeof J}`);
              this.send(X, J || {}, W)
            } else return this.send(X, J)
          }, "methodImpl"),
          I = (B[0].toLowerCase() + B.slice(1)).replace(/Command$/, "");
        Q.prototype[I] = Z
      }
    }, "createAggregatedClient"),
    H_6 = zB((A) => {
      switch (A) {
        case "true":
          return !0;
        case "false":
          return !1;
        default:
          throw Error(`Unable to parse boolean value "${A}"`)
      }
    }, "parseBoolean"),
    C_6 = zB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "number") {
        if (A === 0 || A === 1) VwA.warn(VtA(`Expected boolean, got ${typeof A}: ${A}`));
        if (A === 0) return !1;
        if (A === 1) return !0
      }
      if (typeof A === "string") {
        let Q = A.toLowerCase();
        if (Q === "false" || Q === "true") VwA.warn(VtA(`Expected boolean, got ${typeof A}: ${A}`));
        if (Q === "false") return !1;
        if (Q === "true") return !0
      }
      if (typeof A === "boolean") return A;
      throw TypeError(`Expected boolean, got ${typeof A}: ${A}`)
    }, "expectBoolean"),
    WwA = zB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") {
        let Q = parseFloat(A);
        if (!Number.isNaN(Q)) {
          if (String(Q) !== String(A)) VwA.warn(VtA(`Expected number but observed string: ${A}`));
          return Q
        }
      }
      if (typeof A === "number") return A;
      throw TypeError(`Expected number, got ${typeof A}: ${A}`)
    }, "expectNumber"),
    E_6 = Math.ceil(340282346638528860000000000000000000000),
    XtA = zB((A) => {
      let Q = WwA(A);
      if (Q !== void 0 && !Number.isNaN(Q) && Q !== 1 / 0 && Q !== -1 / 0) {
        if (Math.abs(Q) > E_6) throw TypeError(`Expected 32-bit float, got ${A}`)
      }
      return Q
    }, "expectFloat32"),
    XwA = zB((A) => {
      if (A === null || A === void 0) return;
      if (Number.isInteger(A) && !Number.isNaN(A)) return A;
      throw TypeError(`Expected integer, got ${typeof A}: ${A}`)
    }, "expectLong"),
    z_6 = XwA,
    hc1 = zB((A) => dc1(A, 32), "expectInt32"),
    gc1 = zB((A) => dc1(A, 16), "expectShort"),
    uc1 = zB((A) => dc1(A, 8), "expectByte"),
    dc1 = zB((A, Q) => {
      let B = XwA(A);
      if (B !== void 0 && U_6(B, Q) !== B) throw TypeError(`Expected ${Q}-bit integer, got ${A}`);
      return B
    }, "expectSizedInt"),
    U_6 = zB((A, Q) => {
      switch (Q) {
        case 32:
          return Int32Array.of(A)[0];
        case 16:
          return Int16Array.of(A)[0];
        case 8:
          return Int8Array.of(A)[0]
      }
    }, "castInt"),
    $_6 = zB((A, Q) => {
      if (A === null || A === void 0) {
        if (Q) throw TypeError(`Expected a non-null value for ${Q}`);
        throw TypeError("Expected a non-null value")
      }
      return A
    }, "expectNonNull"),
    wvB = zB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "object" && !Array.isArray(A)) return A;
      let Q = Array.isArray(A) ? "array" : typeof A;
      throw TypeError(`Expected object, got ${Q}: ${A}`)
    }, "expectObject"),
    w_6 = zB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") return A;
      if (["boolean", "number", "bigint"].includes(typeof A)) return VwA.warn(VtA(`Expected string, got ${typeof A}: ${A}`)), String(A);
      throw TypeError(`Expected string, got ${typeof A}: ${A}`)
    }, "expectString"),
    q_6 = zB((A) => {
      if (A === null || A === void 0) return;
      let Q = wvB(A),
        B = Object.entries(Q).filter(([, G]) => G != null).map(([G]) => G);
      if (B.length === 0) throw TypeError("Unions must have exactly one non-null member. None were found.");
      if (B.length > 1) throw TypeError(`Unions must have exactly one non-null member. Keys ${B} were not null.`);
      return Q
    }, "expectUnion"),
    cc1 = zB((A) => {
      if (typeof A == "string") return WwA(PGA(A));
      return WwA(A)
    }, "strictParseDouble"),
    N_6 = cc1,
    qvB = zB((A) => {
      if (typeof A == "string") return XtA(PGA(A));
      return XtA(A)
    }, "strictParseFloat32"),
    L_6 = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g,
    PGA = zB((A) => {
      let Q = A.match(L_6);
      if (Q === null || Q[0].length !== A.length) throw TypeError("Expected real number, got implicit NaN");
      return parseFloat(A)
    }, "parseNumber"),
    pc1 = zB((A) => {
      if (typeof A == "string") return NvB(A);
      return WwA(A)
    }, "limitedParseDouble"),
    M_6 = pc1,
    O_6 = pc1,
    R_6 = zB((A) => {
      if (typeof A == "string") return NvB(A);
      return XtA(A)
    }, "limitedParseFloat32"),
    NvB = zB((A) => {
      switch (A) {
        case "NaN":
          return NaN;
        case "Infinity":
          return 1 / 0;
        case "-Infinity":
          return -1 / 0;
        default:
          throw Error(`Unable to parse float value: ${A}`)
      }
    }, "parseFloatString"),
    LvB = zB((A) => {
      if (typeof A === "string") return XwA(PGA(A));
      return XwA(A)
    }, "strictParseLong"),
    T_6 = LvB,
    P_6 = zB((A) => {
      if (typeof A === "string") return hc1(PGA(A));
      return hc1(A)
    }, "strictParseInt32"),
    RGA = zB((A) => {
      if (typeof A === "string") return gc1(PGA(A));
      return gc1(A)
    }, "strictParseShort"),
    MvB = zB((A) => {
      if (typeof A === "string") return uc1(PGA(A));
      return uc1(A)
    }, "strictParseByte"),
    VtA = zB((A) => {
      return String(TypeError(A).stack || A).split(`
`).slice(0, 5).filter((Q) => !Q.includes("stackTraceWarning")).join(`
`)
    }, "stackTraceWarning"),
    VwA = {
      warn: console.warn
    },
    j_6 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    lc1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function OvB(A) {
    let Q = A.getUTCFullYear(),
      B = A.getUTCMonth(),
      G = A.getUTCDay(),
      Z = A.getUTCDate(),
      I = A.getUTCHours(),
      Y = A.getUTCMinutes(),
      J = A.getUTCSeconds(),
      W = Z < 10 ? `0${Z}` : `${Z}`,
      X = I < 10 ? `0${I}` : `${I}`,
      V = Y < 10 ? `0${Y}` : `${Y}`,
      F = J < 10 ? `0${J}` : `${J}`;
    return `${j_6[G]}, ${W} ${lc1[B]} ${Q} ${X}:${V}:${F} GMT`
  }
  zB(OvB, "dateToUtcString");
  var S_6 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/),
    __6 = zB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = S_6.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, I, Y, J, W, X] = Q, V = RGA(TGA(G)), F = i_(Z, "month", 1, 12), K = i_(I, "day", 1, 31);
      return JwA(V, F, K, {
        hours: Y,
        minutes: J,
        seconds: W,
        fractionalMilliseconds: X
      })
    }, "parseRfc3339DateTime"),
    k_6 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/),
    y_6 = zB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = k_6.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, I, Y, J, W, X, V] = Q, F = RGA(TGA(G)), K = i_(Z, "month", 1, 12), D = i_(I, "day", 1, 31), H = JwA(F, K, D, {
        hours: Y,
        minutes: J,
        seconds: W,
        fractionalMilliseconds: X
      });
      if (V.toUpperCase() != "Z") H.setTime(H.getTime() - i_6(V));
      return H
    }, "parseRfc3339DateTimeWithOffset"),
    x_6 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    v_6 = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    b_6 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/),
    f_6 = zB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
      let Q = x_6.exec(A);
      if (Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return JwA(RGA(TGA(I)), bc1(Z), i_(G, "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: W,
          fractionalMilliseconds: X
        })
      }
      if (Q = v_6.exec(A), Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return m_6(JwA(g_6(I), bc1(Z), i_(G, "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: W,
          fractionalMilliseconds: X
        }))
      }
      if (Q = b_6.exec(A), Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return JwA(RGA(TGA(X)), bc1(G), i_(Z.trimLeft(), "day", 1, 31), {
          hours: I,
          minutes: Y,
          seconds: J,
          fractionalMilliseconds: W
        })
      }
      throw TypeError("Invalid RFC-7231 date-time value")
    }, "parseRfc7231DateTime"),
    h_6 = zB((A) => {
      if (A === null || A === void 0) return;
      let Q;
      if (typeof A === "number") Q = A;
      else if (typeof A === "string") Q = cc1(A);
      else if (typeof A === "object" && A.tag === 1) Q = A.value;
      else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
      if (Number.isNaN(Q) || Q === 1 / 0 || Q === -1 / 0) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
      return new Date(Math.round(Q * 1000))
    }, "parseEpochTimestamp"),
    JwA = zB((A, Q, B, G) => {
      let Z = Q - 1;
      return c_6(A, Z, B), new Date(Date.UTC(A, Z, B, i_(G.hours, "hour", 0, 23), i_(G.minutes, "minute", 0, 59), i_(G.seconds, "seconds", 0, 60), l_6(G.fractionalMilliseconds)))
    }, "buildDate"),
    g_6 = zB((A) => {
      let Q = new Date().getUTCFullYear(),
        B = Math.floor(Q / 100) * 100 + RGA(TGA(A));
      if (B < Q) return B + 100;
      return B
    }, "parseTwoDigitYear"),
    u_6 = 1576800000000,
    m_6 = zB((A) => {
      if (A.getTime() - new Date().getTime() > u_6) return new Date(Date.UTC(A.getUTCFullYear() - 100, A.getUTCMonth(), A.getUTCDate(), A.getUTCHours(), A.getUTCMinutes(), A.getUTCSeconds(), A.getUTCMilliseconds()));
      return A
    }, "adjustRfc850Year"),
    bc1 = zB((A) => {
      let Q = lc1.indexOf(A);
      if (Q < 0) throw TypeError(`Invalid month: ${A}`);
      return Q + 1
    }, "parseMonthByShortName"),
    d_6 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    c_6 = zB((A, Q, B) => {
      let G = d_6[Q];
      if (Q === 1 && p_6(A)) G = 29;
      if (B > G) throw TypeError(`Invalid day for ${lc1[Q]} in ${A}: ${B}`)
    }, "validateDayOfMonth"),
    p_6 = zB((A) => {
      return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
    }, "isLeapYear"),
    i_ = zB((A, Q, B, G) => {
      let Z = MvB(TGA(A));
      if (Z < B || Z > G) throw TypeError(`${Q} must be between ${B} and ${G}, inclusive`);
      return Z
    }, "parseDateValue"),
    l_6 = zB((A) => {
      if (A === null || A === void 0) return 0;
      return qvB("0." + A) * 1000
    }, "parseMilliseconds"),
    i_6 = zB((A) => {
      let Q = A[0],
        B = 1;
      if (Q == "+") B = 1;
      else if (Q == "-") B = -1;
      else throw TypeError(`Offset direction, ${Q}, must be "+" or "-"`);
      let G = Number(A.substring(1, 3)),
        Z = Number(A.substring(4, 6));
      return B * (G * 60 + Z) * 60 * 1000
    }, "parseOffsetToMilliseconds"),
    TGA = zB((A) => {
      let Q = 0;
      while (Q < A.length - 1 && A.charAt(Q) === "0") Q++;
      if (Q === 0) return A;
      return A.slice(Q)
    }, "stripLeadingZeroes"),
    n_6 = class A extends Error {
      static {
        zB(this, "ServiceException")
      }
      constructor(Q) {
        super(Q.message);
        Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = Q.name, this.$fault = Q.$fault, this.$metadata = Q.$metadata
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return A.prototype.isPrototypeOf(B) || Boolean(B.$fault) && Boolean(B.$metadata) && (B.$fault === "client" || B.$fault === "server")
      }
      static[Symbol.hasInstance](Q) {
        if (!Q) return !1;
        let B = Q;
        if (this === A) return A.isInstance(Q);
        if (A.isInstance(Q)) {
          if (B.name && this.name) return this.prototype.isPrototypeOf(Q) || B.name === this.name;
          return this.prototype.isPrototypeOf(Q)
        }
        return !1
      }
    },
    RvB = zB((A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    }, "decorateServiceException"),
    TvB = zB(({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = s_6(A),
        I = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        Y = new B({
          name: Q?.code || Q?.Code || G || I || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw RvB(Y, Q)
    }, "throwDefaultError"),
    a_6 = zB((A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        TvB({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    }, "withBaseException"),
    s_6 = zB((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    r_6 = zB((A) => {
      switch (A) {
        case "standard":
          return {
            retryMode: "standard", connectionTimeout: 3100
          };
        case "in-region":
          return {
            retryMode: "standard", connectionTimeout: 1100
          };
        case "cross-region":
          return {
            retryMode: "standard", connectionTimeout: 3100
          };
        case "mobile":
          return {
            retryMode: "standard", connectionTimeout: 30000
          };
        default:
          return {}
      }
    }, "loadConfigsForDefaultMode"),
    EvB = !1,
    o_6 = zB((A) => {
      if (A && !EvB && parseInt(A.substring(1, A.indexOf("."))) < 16) EvB = !0
    }, "emitWarningIfUnsupportedVersion"),
    t_6 = zB((A) => {
      let Q = [];
      for (let B in fc1.AlgorithmId) {
        let G = fc1.AlgorithmId[B];
        if (A[G] === void 0) continue;
        Q.push({
          algorithmId: () => G,
          checksumConstructor: () => A[G]
        })
      }
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    }, "getChecksumConfiguration"),
    e_6 = zB((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    Ak6 = zB((A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    }, "getRetryConfiguration"),
    Qk6 = zB((A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    }, "resolveRetryRuntimeConfig"),
    PvB = zB((A) => {
      return Object.assign(t_6(A), Ak6(A))
    }, "getDefaultExtensionConfiguration"),
    Bk6 = PvB,
    Gk6 = zB((A) => {
      return Object.assign(e_6(A), Qk6(A))
    }, "resolveDefaultRuntimeConfig"),
    Zk6 = zB((A) => Array.isArray(A) ? A : [A], "getArrayIfSingleItem"),
    jvB = zB((A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = jvB(A[B]);
      return A
    }, "getValueFromTextNode"),
    Ik6 = zB((A) => {
      return A != null
    }, "isSerializableHeaderValue"),
    De = zB(function(Q) {
      return Object.assign(new String(Q), {
        deserializeJSON() {
          return JSON.parse(String(Q))
        },
        toString() {
          return String(Q)
        },
        toJSON() {
          return String(Q)
        }
      })
    }, "LazyJsonString");
  De.from = (A) => {
    if (A && typeof A === "object" && (A instanceof De || ("deserializeJSON" in A))) return A;
    else if (typeof A === "string" || Object.getPrototypeOf(A) === String.prototype) return De(String(A));
    return De(JSON.stringify(A))
  };
  De.fromObject = De.from;
  var Yk6 = class {
    static {
      zB(this, "NoOpLogger")
    }
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  };

  function ic1(A, Q, B) {
    let G, Z, I;
    if (typeof Q > "u" && typeof B > "u") G = {}, I = A;
    else if (G = A, typeof Q === "function") return Z = Q, I = B, Xk6(G, Z, I);
    else I = Q;
    for (let Y of Object.keys(I)) {
      if (!Array.isArray(I[Y])) {
        G[Y] = I[Y];
        continue
      }
      SvB(G, null, I, Y)
    }
    return G
  }
  zB(ic1, "map");
  var Jk6 = zB((A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    }, "convertMap"),
    Wk6 = zB((A, Q) => {
      let B = {};
      for (let G in Q) SvB(B, A, Q, G);
      return B
    }, "take"),
    Xk6 = zB((A, Q, B) => {
      return ic1(A, Object.entries(B).reduce((G, [Z, I]) => {
        if (Array.isArray(I)) G[Z] = I;
        else if (typeof I === "function") G[Z] = [Q, I()];
        else G[Z] = [Q, I];
        return G
      }, {}))
    }, "mapWithFilter"),
    SvB = zB((A, Q, B, G) => {
      if (Q !== null) {
        let Y = B[G];
        if (typeof Y === "function") Y = [, Y];
        let [J = Vk6, W = Fk6, X = G] = Y;
        if (typeof J === "function" && J(Q[X]) || typeof J !== "function" && !!J) A[G] = W(Q[X]);
        return
      }
      let [Z, I] = B[G];
      if (typeof I === "function") {
        let Y, J = Z === void 0 && (Y = I()) != null,
          W = typeof Z === "function" && !!Z(void 0) || typeof Z !== "function" && !!Z;
        if (J) A[G] = Y;
        else if (W) A[G] = I()
      } else {
        let Y = Z === void 0 && I != null,
          J = typeof Z === "function" && !!Z(I) || typeof Z !== "function" && !!Z;
        if (Y || J) A[G] = I
      }
    }, "applyInstruction"),
    Vk6 = zB((A) => A != null, "nonNullish"),
    Fk6 = zB((A) => A, "pass");

  function _vB(A) {
    if (A.includes(",") || A.includes('"')) A = `"${A.replace(/"/g,"\\\"")}"`;
    return A
  }
  zB(_vB, "quoteHeader");
  var Kk6 = zB((A) => {
      if (A !== A) return "NaN";
      switch (A) {
        case 1 / 0:
          return "Infinity";
        case -1 / 0:
          return "-Infinity";
        default:
          return A
      }
    }, "serializeFloat"),
    Dk6 = zB((A) => A.toISOString().replace(".000Z", "Z"), "serializeDateTime"),
    mc1 = zB((A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(mc1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = mc1(A[B])
        }
        return Q
      }
      return A
    }, "_json");

  function kvB(A, Q, B) {
    if (B <= 0 || !Number.isInteger(B)) throw Error("Invalid number of delimiters (" + B + ") for splitEvery.");
    let G = A.split(Q);
    if (B === 1) return G;
    let Z = [],
      I = "";
    for (let Y = 0; Y < G.length; Y++) {
      if (I === "") I = G[Y];
      else I += Q + G[Y];
      if ((Y + 1) % B === 0) Z.push(I), I = ""
    }
    if (I !== "") Z.push(I);
    return Z
  }
  zB(kvB, "splitEvery");
  var Hk6 = zB((A) => {
    let Q = A.length,
      B = [],
      G = !1,
      Z = void 0,
      I = 0;
    for (let Y = 0; Y < Q; ++Y) {
      let J = A[Y];
      switch (J) {
        case '"':
          if (Z !== "\\") G = !G;
          break;
        case ",":
          if (!G) B.push(A.slice(I, Y)), I = Y + 1;
          break;
        default:
      }
      Z = J
    }
    return B.push(A.slice(I)), B.map((Y) => {
      Y = Y.trim();
      let J = Y.length;
      if (J < 2) return Y;
      if (Y[0] === '"' && Y[J - 1] === '"') Y = Y.slice(1, J - 1);
      return Y.replace(/\\"/g, '"')
    })
  }, "splitHeader")
})
// @from(Start 7068457, End 7068944)
bvB = z((xvB) => {
  Object.defineProperty(xvB, "__esModule", {
    value: !0
  });
  xvB.fromBase64 = void 0;
  var Ck6 = hI(),
    Ek6 = /^[A-Za-z0-9+/]*={0,2}$/,
    zk6 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!Ek6.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, Ck6.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  xvB.fromBase64 = zk6
})
// @from(Start 7068950, End 7069529)
gvB = z((fvB) => {
  Object.defineProperty(fvB, "__esModule", {
    value: !0
  });
  fvB.toBase64 = void 0;
  var Uk6 = hI(),
    $k6 = O2(),
    wk6 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, $k6.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, Uk6.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  fvB.toBase64 = wk6
})
// @from(Start 7069535, End 7070231)
dvB = z((z2G, KtA) => {
  var {
    defineProperty: uvB,
    getOwnPropertyDescriptor: qk6,
    getOwnPropertyNames: Nk6
  } = Object, Lk6 = Object.prototype.hasOwnProperty, nc1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Nk6(Q))
        if (!Lk6.call(A, Z) && Z !== B) uvB(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = qk6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, mvB = (A, Q, B) => (nc1(A, Q, "default"), B && nc1(B, Q, "default")), Mk6 = (A) => nc1(uvB({}, "__esModule", {
    value: !0
  }), A), ac1 = {};
  KtA.exports = Mk6(ac1);
  mvB(ac1, bvB(), KtA.exports);
  mvB(ac1, gvB(), KtA.exports)
})
// @from(Start 7070237, End 7075122)
ZbB = z((BbB) => {
  Object.defineProperty(BbB, "__esModule", {
    value: !0
  });
  BbB.ruleSet = void 0;
  var evB = "required",
    a_ = "fn",
    s_ = "argv",
    SGA = "ref",
    cvB = !0,
    pvB = "isSet",
    DwA = "booleanEquals",
    jGA = "error",
    KwA = "endpoint",
    WE = "tree",
    sc1 = "PartitionResult",
    lvB = {
      [evB]: !1,
      type: "String"
    },
    ivB = {
      [evB]: !0,
      default: !1,
      type: "Boolean"
    },
    nvB = {
      [SGA]: "Endpoint"
    },
    AbB = {
      [a_]: DwA,
      [s_]: [{
        [SGA]: "UseFIPS"
      }, !0]
    },
    QbB = {
      [a_]: DwA,
      [s_]: [{
        [SGA]: "UseDualStack"
      }, !0]
    },
    n_ = {},
    avB = {
      [a_]: "getAttr",
      [s_]: [{
        [SGA]: sc1
      }, "supportsFIPS"]
    },
    svB = {
      [a_]: DwA,
      [s_]: [!0, {
        [a_]: "getAttr",
        [s_]: [{
          [SGA]: sc1
        }, "supportsDualStack"]
      }]
    },
    rvB = [AbB],
    ovB = [QbB],
    tvB = [{
      [SGA]: "Region"
    }],
    Ok6 = {
      version: "1.0",
      parameters: {
        Region: lvB,
        UseDualStack: ivB,
        UseFIPS: ivB,
        Endpoint: lvB
      },
      rules: [{
        conditions: [{
          [a_]: pvB,
          [s_]: [nvB]
        }],
        rules: [{
          conditions: rvB,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: jGA
        }, {
          rules: [{
            conditions: ovB,
            error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
            type: jGA
          }, {
            endpoint: {
              url: nvB,
              properties: n_,
              headers: n_
            },
            type: KwA
          }],
          type: WE
        }],
        type: WE
      }, {
        rules: [{
          conditions: [{
            [a_]: pvB,
            [s_]: tvB
          }],
          rules: [{
            conditions: [{
              [a_]: "aws.partition",
              [s_]: tvB,
              assign: sc1
            }],
            rules: [{
              conditions: [AbB, QbB],
              rules: [{
                conditions: [{
                  [a_]: DwA,
                  [s_]: [cvB, avB]
                }, svB],
                rules: [{
                  rules: [{
                    endpoint: {
                      url: "https://bedrock-runtime-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                      properties: n_,
                      headers: n_
                    },
                    type: KwA
                  }],
                  type: WE
                }],
                type: WE
              }, {
                error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                type: jGA
              }],
              type: WE
            }, {
              conditions: rvB,
              rules: [{
                conditions: [{
                  [a_]: DwA,
                  [s_]: [avB, cvB]
                }],
                rules: [{
                  rules: [{
                    endpoint: {
                      url: "https://bedrock-runtime-fips.{Region}.{PartitionResult#dnsSuffix}",
                      properties: n_,
                      headers: n_
                    },
                    type: KwA
                  }],
                  type: WE
                }],
                type: WE
              }, {
                error: "FIPS is enabled but this partition does not support FIPS",
                type: jGA
              }],
              type: WE
            }, {
              conditions: ovB,
              rules: [{
                conditions: [svB],
                rules: [{
                  rules: [{
                    endpoint: {
                      url: "https://bedrock-runtime.{Region}.{PartitionResult#dualStackDnsSuffix}",
                      properties: n_,
                      headers: n_
                    },
                    type: KwA
                  }],
                  type: WE
                }],
                type: WE
              }, {
                error: "DualStack is enabled but this partition does not support DualStack",
                type: jGA
              }],
              type: WE
            }, {
              rules: [{
                endpoint: {
                  url: "https://bedrock-runtime.{Region}.{PartitionResult#dnsSuffix}",
                  properties: n_,
                  headers: n_
                },
                type: KwA
              }],
              type: WE
            }],
            type: WE
          }],
          type: WE
        }, {
          error: "Invalid Configuration: Missing Region",
          type: jGA
        }],
        type: WE
      }]
    };
  BbB.ruleSet = Ok6
})
// @from(Start 7075128, End 7075692)
JbB = z((IbB) => {
  Object.defineProperty(IbB, "__esModule", {
    value: !0
  });
  IbB.defaultEndpointResolver = void 0;
  var Rk6 = I5A(),
    rc1 = FI(),
    Tk6 = ZbB(),
    Pk6 = new rc1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    jk6 = (A, Q = {}) => {
      return Pk6.get(A, () => (0, rc1.resolveEndpoint)(Tk6.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  IbB.defaultEndpointResolver = jk6;
  rc1.customEndpointFunctions.aws = Rk6.awsEndpointFunctions
})
// @from(Start 7075698, End 7076922)
KbB = z((VbB) => {
  Object.defineProperty(VbB, "__esModule", {
    value: !0
  });
  VbB.getRuntimeConfig = void 0;
  var Sk6 = jF(),
    _k6 = FwA(),
    kk6 = NJ(),
    WbB = dvB(),
    XbB = O2(),
    yk6 = Nc1(),
    xk6 = JbB(),
    vk6 = (A) => {
      return {
        apiVersion: "2023-09-30",
        base64Decoder: A?.base64Decoder ?? WbB.fromBase64,
        base64Encoder: A?.base64Encoder ?? WbB.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? xk6.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? yk6.defaultBedrockRuntimeHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new Sk6.AwsSdkSigV4Signer
        }],
        logger: A?.logger ?? new _k6.NoOpLogger,
        serviceId: A?.serviceId ?? "Bedrock Runtime",
        urlParser: A?.urlParser ?? kk6.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? XbB.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? XbB.toUtf8
      }
    };
  VbB.getRuntimeConfig = vk6
})
// @from(Start 7076928, End 7079446)
UbB = z((EbB) => {
  Object.defineProperty(EbB, "__esModule", {
    value: !0
  });
  EbB.getRuntimeConfig = void 0;
  var bk6 = xyB(),
    fk6 = bk6.__importDefault(vyB()),
    hk6 = jF(),
    gk6 = Iy1(),
    uk6 = sxB(),
    DbB = eCA(),
    DtA = f8(),
    mk6 = YvB(),
    dk6 = RX(),
    HbB = D6(),
    _GA = uI(),
    CbB = IZ(),
    ck6 = TX(),
    pk6 = KW(),
    lk6 = KbB(),
    ik6 = FwA(),
    nk6 = PX(),
    ak6 = FwA(),
    sk6 = (A) => {
      (0, ak6.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, nk6.resolveDefaultsModeConfig)(A),
        B = () => Q().then(ik6.loadConfigsForDefaultMode),
        G = (0, lk6.getRuntimeConfig)(A);
      (0, hk6.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        bodyLengthChecker: A?.bodyLengthChecker ?? ck6.calculateBodyLength,
        credentialDefaultProvider: A?.credentialDefaultProvider ?? gk6.defaultProvider,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, DbB.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: fk6.default.version
        }),
        eventStreamPayloadHandlerProvider: A?.eventStreamPayloadHandlerProvider ?? uk6.eventStreamPayloadHandlerProvider,
        eventStreamSerdeProvider: A?.eventStreamSerdeProvider ?? mk6.eventStreamSerdeProvider,
        maxAttempts: A?.maxAttempts ?? (0, _GA.loadConfig)(HbB.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, _GA.loadConfig)(DtA.NODE_REGION_CONFIG_OPTIONS, {
          ...DtA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: CbB.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, _GA.loadConfig)({
          ...HbB.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || pk6.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? dk6.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? CbB.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, _GA.loadConfig)(DtA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, _GA.loadConfig)(DtA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, _GA.loadConfig)(DbB.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  EbB.getRuntimeConfig = sk6
})
// @from(Start 7079452, End 7083959)
MbB = z((N2G, LbB) => {
  var {
    defineProperty: HtA,
    getOwnPropertyDescriptor: rk6,
    getOwnPropertyNames: ok6
  } = Object, tk6 = Object.prototype.hasOwnProperty, vp = (A, Q) => HtA(A, "name", {
    value: Q,
    configurable: !0
  }), ek6 = (A, Q) => {
    for (var B in Q) HtA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Ay6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of ok6(Q))
        if (!tk6.call(A, Z) && Z !== B) HtA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = rk6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Qy6 = (A) => Ay6(HtA({}, "__esModule", {
    value: !0
  }), A), $bB = {};
  ek6($bB, {
    Field: () => Zy6,
    Fields: () => Iy6,
    HttpRequest: () => Yy6,
    HttpResponse: () => Jy6,
    IHttpRequest: () => wbB.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => By6,
    isValidHostname: () => NbB,
    resolveHttpHandlerRuntimeConfig: () => Gy6
  });
  LbB.exports = Qy6($bB);
  var By6 = vp((A) => {
      return {
        setHttpHandler(Q) {
          A.httpHandler = Q
        },
        httpHandler() {
          return A.httpHandler
        },
        updateHttpClientConfig(Q, B) {
          A.httpHandler?.updateHttpClientConfig(Q, B)
        },
        httpHandlerConfigs() {
          return A.httpHandler.httpHandlerConfigs()
        }
      }
    }, "getHttpHandlerExtensionConfiguration"),
    Gy6 = vp((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    wbB = xc1(),
    Zy6 = class {
      static {
        vp(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = wbB.FieldPosition.HEADER,
        values: B = []
      }) {
        this.name = A, this.kind = Q, this.values = B
      }
      add(A) {
        this.values.push(A)
      }
      set(A) {
        this.values = A
      }
      remove(A) {
        this.values = this.values.filter((Q) => Q !== A)
      }
      toString() {
        return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
      }
      get() {
        return this.values
      }
    },
    Iy6 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        vp(this, "Fields")
      }
      setField(A) {
        this.entries[A.name.toLowerCase()] = A
      }
      getField(A) {
        return this.entries[A.toLowerCase()]
      }
      removeField(A) {
        delete this.entries[A.toLowerCase()]
      }
      getByType(A) {
        return Object.values(this.entries).filter((Q) => Q.kind === A)
      }
    },
    Yy6 = class A {
      static {
        vp(this, "HttpRequest")
      }
      constructor(Q) {
        this.method = Q.method || "GET", this.hostname = Q.hostname || "localhost", this.port = Q.port, this.query = Q.query || {}, this.headers = Q.headers || {}, this.body = Q.body, this.protocol = Q.protocol ? Q.protocol.slice(-1) !== ":" ? `${Q.protocol}:` : Q.protocol : "https:", this.path = Q.path ? Q.path.charAt(0) !== "/" ? `/${Q.path}` : Q.path : "/", this.username = Q.username, this.password = Q.password, this.fragment = Q.fragment
      }
      static clone(Q) {
        let B = new A({
          ...Q,
          headers: {
            ...Q.headers
          }
        });
        if (B.query) B.query = qbB(B.query);
        return B
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return "method" in B && "protocol" in B && "hostname" in B && "path" in B && typeof B.query === "object" && typeof B.headers === "object"
      }
      clone() {
        return A.clone(this)
      }
    };

  function qbB(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  vp(qbB, "cloneQuery");
  var Jy6 = class {
    static {
      vp(this, "HttpResponse")
    }
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  };

  function NbB(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  vp(NbB, "isValidHostname")
})