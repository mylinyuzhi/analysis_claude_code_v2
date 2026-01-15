
// @from(Ln 171001, Col 4)
pIA = U((RTG, lB1) => {
  var {
    isUtf8: IqB
  } = NA("buffer"), {
    hasBlob: hI8
  } = Xm(), gI8 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0];

  function uI8(A) {
    return A >= 1000 && A <= 1014 && A !== 1004 && A !== 1005 && A !== 1006 || A >= 3000 && A <= 4999
  }

  function l00(A) {
    let Q = A.length,
      B = 0;
    while (B < Q)
      if ((A[B] & 128) === 0) B++;
      else if ((A[B] & 224) === 192) {
      if (B + 1 === Q || (A[B + 1] & 192) !== 128 || (A[B] & 254) === 192) return !1;
      B += 2
    } else if ((A[B] & 240) === 224) {
      if (B + 2 >= Q || (A[B + 1] & 192) !== 128 || (A[B + 2] & 192) !== 128 || A[B] === 224 && (A[B + 1] & 224) === 128 || A[B] === 237 && (A[B + 1] & 224) === 160) return !1;
      B += 3
    } else if ((A[B] & 248) === 240) {
      if (B + 3 >= Q || (A[B + 1] & 192) !== 128 || (A[B + 2] & 192) !== 128 || (A[B + 3] & 192) !== 128 || A[B] === 240 && (A[B + 1] & 240) === 128 || A[B] === 244 && A[B + 1] > 143 || A[B] > 244) return !1;
      B += 4
    } else return !1;
    return !0
  }

  function mI8(A) {
    return hI8 && typeof A === "object" && typeof A.arrayBuffer === "function" && typeof A.type === "string" && typeof A.stream === "function" && (A[Symbol.toStringTag] === "Blob" || A[Symbol.toStringTag] === "File")
  }
  lB1.exports = {
    isBlob: mI8,
    isValidStatusCode: uI8,
    isValidUTF8: l00,
    tokenChars: gI8
  };
  if (IqB) lB1.exports.isValidUTF8 = function (A) {
    return A.length < 24 ? l00(A) : IqB(A)
  };
  else if (!process.env.WS_NO_UTF_8_VALIDATE) try {
    let A = (() => {
      throw new Error("Cannot require module " + "utf-8-validate");
    })();
    lB1.exports.isValidUTF8 = function (Q) {
      return Q.length < 32 ? l00(Q) : A(Q)
    }
  } catch (A) {}
})
// @from(Ln 171051, Col 4)
n00 = U((_TG, FqB) => {
  var {
    Writable: dI8
  } = NA("stream"), DqB = __A(), {
    BINARY_TYPES: cI8,
    EMPTY_BUFFER: WqB,
    kStatusCode: pI8,
    kWebSocket: lI8
  } = Xm(), {
    concat: i00,
    toArrayBuffer: iI8,
    unmask: nI8
  } = M_A(), {
    isValidStatusCode: aI8,
    isValidUTF8: KqB
  } = pIA(), iB1 = Buffer[Symbol.species];
  class VqB extends dI8 {
    constructor(A = {}) {
      super();
      this._allowSynchronousEvents = A.allowSynchronousEvents !== void 0 ? A.allowSynchronousEvents : !0, this._binaryType = A.binaryType || cI8[0], this._extensions = A.extensions || {}, this._isServer = !!A.isServer, this._maxPayload = A.maxPayload | 0, this._skipUTF8Validation = !!A.skipUTF8Validation, this[lI8] = void 0, this._bufferedBytes = 0, this._buffers = [], this._compressed = !1, this._payloadLength = 0, this._mask = void 0, this._fragmented = 0, this._masked = !1, this._fin = !1, this._opcode = 0, this._totalPayloadLength = 0, this._messageLength = 0, this._fragments = [], this._errored = !1, this._loop = !1, this._state = 0
    }
    _write(A, Q, B) {
      if (this._opcode === 8 && this._state == 0) return B();
      this._bufferedBytes += A.length, this._buffers.push(A), this.startLoop(B)
    }
    consume(A) {
      if (this._bufferedBytes -= A, A === this._buffers[0].length) return this._buffers.shift();
      if (A < this._buffers[0].length) {
        let B = this._buffers[0];
        return this._buffers[0] = new iB1(B.buffer, B.byteOffset + A, B.length - A), new iB1(B.buffer, B.byteOffset, A)
      }
      let Q = Buffer.allocUnsafe(A);
      do {
        let B = this._buffers[0],
          G = Q.length - A;
        if (A >= B.length) Q.set(this._buffers.shift(), G);
        else Q.set(new Uint8Array(B.buffer, B.byteOffset, A), G), this._buffers[0] = new iB1(B.buffer, B.byteOffset + A, B.length - A);
        A -= B.length
      } while (A > 0);
      return Q
    }
    startLoop(A) {
      this._loop = !0;
      do switch (this._state) {
        case 0:
          this.getInfo(A);
          break;
        case 1:
          this.getPayloadLength16(A);
          break;
        case 2:
          this.getPayloadLength64(A);
          break;
        case 3:
          this.getMask();
          break;
        case 4:
          this.getData(A);
          break;
        case 5:
        case 6:
          this._loop = !1;
          return
      }
      while (this._loop);
      if (!this._errored) A()
    }
    getInfo(A) {
      if (this._bufferedBytes < 2) {
        this._loop = !1;
        return
      }
      let Q = this.consume(2);
      if ((Q[0] & 48) !== 0) {
        let G = this.createError(RangeError, "RSV2 and RSV3 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_2_3");
        A(G);
        return
      }
      let B = (Q[0] & 64) === 64;
      if (B && !this._extensions[DqB.extensionName]) {
        let G = this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
        A(G);
        return
      }
      if (this._fin = (Q[0] & 128) === 128, this._opcode = Q[0] & 15, this._payloadLength = Q[1] & 127, this._opcode === 0) {
        if (B) {
          let G = this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
          A(G);
          return
        }
        if (!this._fragmented) {
          let G = this.createError(RangeError, "invalid opcode 0", !0, 1002, "WS_ERR_INVALID_OPCODE");
          A(G);
          return
        }
        this._opcode = this._fragmented
      } else if (this._opcode === 1 || this._opcode === 2) {
        if (this._fragmented) {
          let G = this.createError(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE");
          A(G);
          return
        }
        this._compressed = B
      } else if (this._opcode > 7 && this._opcode < 11) {
        if (!this._fin) {
          let G = this.createError(RangeError, "FIN must be set", !0, 1002, "WS_ERR_EXPECTED_FIN");
          A(G);
          return
        }
        if (B) {
          let G = this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
          A(G);
          return
        }
        if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
          let G = this.createError(RangeError, `invalid payload length ${this._payloadLength}`, !0, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
          A(G);
          return
        }
      } else {
        let G = this.createError(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE");
        A(G);
        return
      }
      if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
      if (this._masked = (Q[1] & 128) === 128, this._isServer) {
        if (!this._masked) {
          let G = this.createError(RangeError, "MASK must be set", !0, 1002, "WS_ERR_EXPECTED_MASK");
          A(G);
          return
        }
      } else if (this._masked) {
        let G = this.createError(RangeError, "MASK must be clear", !0, 1002, "WS_ERR_UNEXPECTED_MASK");
        A(G);
        return
      }
      if (this._payloadLength === 126) this._state = 1;
      else if (this._payloadLength === 127) this._state = 2;
      else this.haveLength(A)
    }
    getPayloadLength16(A) {
      if (this._bufferedBytes < 2) {
        this._loop = !1;
        return
      }
      this._payloadLength = this.consume(2).readUInt16BE(0), this.haveLength(A)
    }
    getPayloadLength64(A) {
      if (this._bufferedBytes < 8) {
        this._loop = !1;
        return
      }
      let Q = this.consume(8),
        B = Q.readUInt32BE(0);
      if (B > Math.pow(2, 21) - 1) {
        let G = this.createError(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", !1, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH");
        A(G);
        return
      }
      this._payloadLength = B * Math.pow(2, 32) + Q.readUInt32BE(4), this.haveLength(A)
    }
    haveLength(A) {
      if (this._payloadLength && this._opcode < 8) {
        if (this._totalPayloadLength += this._payloadLength, this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
          let Q = this.createError(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
          A(Q);
          return
        }
      }
      if (this._masked) this._state = 3;
      else this._state = 4
    }
    getMask() {
      if (this._bufferedBytes < 4) {
        this._loop = !1;
        return
      }
      this._mask = this.consume(4), this._state = 4
    }
    getData(A) {
      let Q = WqB;
      if (this._payloadLength) {
        if (this._bufferedBytes < this._payloadLength) {
          this._loop = !1;
          return
        }
        if (Q = this.consume(this._payloadLength), this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) nI8(Q, this._mask)
      }
      if (this._opcode > 7) {
        this.controlMessage(Q, A);
        return
      }
      if (this._compressed) {
        this._state = 5, this.decompress(Q, A);
        return
      }
      if (Q.length) this._messageLength = this._totalPayloadLength, this._fragments.push(Q);
      this.dataMessage(A)
    }
    decompress(A, Q) {
      this._extensions[DqB.extensionName].decompress(A, this._fin, (G, Z) => {
        if (G) return Q(G);
        if (Z.length) {
          if (this._messageLength += Z.length, this._messageLength > this._maxPayload && this._maxPayload > 0) {
            let Y = this.createError(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
            Q(Y);
            return
          }
          this._fragments.push(Z)
        }
        if (this.dataMessage(Q), this._state === 0) this.startLoop(Q)
      })
    }
    dataMessage(A) {
      if (!this._fin) {
        this._state = 0;
        return
      }
      let Q = this._messageLength,
        B = this._fragments;
      if (this._totalPayloadLength = 0, this._messageLength = 0, this._fragmented = 0, this._fragments = [], this._opcode === 2) {
        let G;
        if (this._binaryType === "nodebuffer") G = i00(B, Q);
        else if (this._binaryType === "arraybuffer") G = iI8(i00(B, Q));
        else if (this._binaryType === "blob") G = new Blob(B);
        else G = B;
        if (this._allowSynchronousEvents) this.emit("message", G, !0), this._state = 0;
        else this._state = 6, setImmediate(() => {
          this.emit("message", G, !0), this._state = 0, this.startLoop(A)
        })
      } else {
        let G = i00(B, Q);
        if (!this._skipUTF8Validation && !KqB(G)) {
          let Z = this.createError(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8");
          A(Z);
          return
        }
        if (this._state === 5 || this._allowSynchronousEvents) this.emit("message", G, !1), this._state = 0;
        else this._state = 6, setImmediate(() => {
          this.emit("message", G, !1), this._state = 0, this.startLoop(A)
        })
      }
    }
    controlMessage(A, Q) {
      if (this._opcode === 8) {
        if (A.length === 0) this._loop = !1, this.emit("conclude", 1005, WqB), this.end();
        else {
          let B = A.readUInt16BE(0);
          if (!aI8(B)) {
            let Z = this.createError(RangeError, `invalid status code ${B}`, !0, 1002, "WS_ERR_INVALID_CLOSE_CODE");
            Q(Z);
            return
          }
          let G = new iB1(A.buffer, A.byteOffset + 2, A.length - 2);
          if (!this._skipUTF8Validation && !KqB(G)) {
            let Z = this.createError(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8");
            Q(Z);
            return
          }
          this._loop = !1, this.emit("conclude", B, G), this.end()
        }
        this._state = 0;
        return
      }
      if (this._allowSynchronousEvents) this.emit(this._opcode === 9 ? "ping" : "pong", A), this._state = 0;
      else this._state = 6, setImmediate(() => {
        this.emit(this._opcode === 9 ? "ping" : "pong", A), this._state = 0, this.startLoop(Q)
      })
    }
    createError(A, Q, B, G, Z) {
      this._loop = !1, this._errored = !0;
      let Y = new A(B ? `Invalid WebSocket frame: ${Q}` : Q);
      return Error.captureStackTrace(Y, this.createError), Y.code = Z, Y[pI8] = G, Y
    }
  }
  FqB.exports = VqB
})
// @from(Ln 171328, Col 4)
o00 = U((TTG, zqB) => {
  var {
    Duplex: jTG
  } = NA("stream"), {
    randomFillSync: oI8
  } = NA("crypto"), HqB = __A(), {
    EMPTY_BUFFER: rI8,
    kWebSocket: sI8,
    NOOP: tI8
  } = Xm(), {
    isBlob: lIA,
    isValidStatusCode: eI8
  } = pIA(), {
    mask: EqB,
    toBuffer: fBA
  } = M_A(), sR = Symbol("kByteLength"), AD8 = Buffer.alloc(4), hBA, iIA = 8192, _P = 0, QD8 = 1, BD8 = 2;
  class ja {
    constructor(A, Q, B) {
      if (this._extensions = Q || {}, B) this._generateMask = B, this._maskBuffer = Buffer.alloc(4);
      this._socket = A, this._firstFragment = !0, this._compress = !1, this._bufferedBytes = 0, this._queue = [], this._state = _P, this.onerror = tI8, this[sI8] = void 0
    }
    static frame(A, Q) {
      let B, G = !1,
        Z = 2,
        Y = !1;
      if (Q.mask) {
        if (B = Q.maskBuffer || AD8, Q.generateMask) Q.generateMask(B);
        else {
          if (iIA === 8192) {
            if (hBA === void 0) hBA = Buffer.alloc(8192);
            oI8(hBA, 0, 8192), iIA = 0
          }
          B[0] = hBA[iIA++], B[1] = hBA[iIA++], B[2] = hBA[iIA++], B[3] = hBA[iIA++]
        }
        Y = (B[0] | B[1] | B[2] | B[3]) === 0, Z = 6
      }
      let J;
      if (typeof A === "string")
        if ((!Q.mask || Y) && Q[sR] !== void 0) J = Q[sR];
        else A = Buffer.from(A), J = A.length;
      else J = A.length, G = Q.mask && Q.readOnly && !Y;
      let X = J;
      if (J >= 65536) Z += 8, X = 127;
      else if (J > 125) Z += 2, X = 126;
      let I = Buffer.allocUnsafe(G ? J + Z : Z);
      if (I[0] = Q.fin ? Q.opcode | 128 : Q.opcode, Q.rsv1) I[0] |= 64;
      if (I[1] = X, X === 126) I.writeUInt16BE(J, 2);
      else if (X === 127) I[2] = I[3] = 0, I.writeUIntBE(J, 4, 6);
      if (!Q.mask) return [I, A];
      if (I[1] |= 128, I[Z - 4] = B[0], I[Z - 3] = B[1], I[Z - 2] = B[2], I[Z - 1] = B[3], Y) return [I, A];
      if (G) return EqB(A, B, I, Z, J), [I];
      return EqB(A, B, A, 0, J), [I, A]
    }
    close(A, Q, B, G) {
      let Z;
      if (A === void 0) Z = rI8;
      else if (typeof A !== "number" || !eI8(A)) throw TypeError("First argument must be a valid error code number");
      else if (Q === void 0 || !Q.length) Z = Buffer.allocUnsafe(2), Z.writeUInt16BE(A, 0);
      else {
        let J = Buffer.byteLength(Q);
        if (J > 123) throw RangeError("The message must not be greater than 123 bytes");
        if (Z = Buffer.allocUnsafe(2 + J), Z.writeUInt16BE(A, 0), typeof Q === "string") Z.write(Q, 2);
        else Z.set(Q, 2)
      }
      let Y = {
        [sR]: Z.length,
        fin: !0,
        generateMask: this._generateMask,
        mask: B,
        maskBuffer: this._maskBuffer,
        opcode: 8,
        readOnly: !1,
        rsv1: !1
      };
      if (this._state !== _P) this.enqueue([this.dispatch, Z, !1, Y, G]);
      else this.sendFrame(ja.frame(Z, Y), G)
    }
    ping(A, Q, B) {
      let G, Z;
      if (typeof A === "string") G = Buffer.byteLength(A), Z = !1;
      else if (lIA(A)) G = A.size, Z = !1;
      else A = fBA(A), G = A.length, Z = fBA.readOnly;
      if (G > 125) throw RangeError("The data size must not be greater than 125 bytes");
      let Y = {
        [sR]: G,
        fin: !0,
        generateMask: this._generateMask,
        mask: Q,
        maskBuffer: this._maskBuffer,
        opcode: 9,
        readOnly: Z,
        rsv1: !1
      };
      if (lIA(A))
        if (this._state !== _P) this.enqueue([this.getBlobData, A, !1, Y, B]);
        else this.getBlobData(A, !1, Y, B);
      else if (this._state !== _P) this.enqueue([this.dispatch, A, !1, Y, B]);
      else this.sendFrame(ja.frame(A, Y), B)
    }
    pong(A, Q, B) {
      let G, Z;
      if (typeof A === "string") G = Buffer.byteLength(A), Z = !1;
      else if (lIA(A)) G = A.size, Z = !1;
      else A = fBA(A), G = A.length, Z = fBA.readOnly;
      if (G > 125) throw RangeError("The data size must not be greater than 125 bytes");
      let Y = {
        [sR]: G,
        fin: !0,
        generateMask: this._generateMask,
        mask: Q,
        maskBuffer: this._maskBuffer,
        opcode: 10,
        readOnly: Z,
        rsv1: !1
      };
      if (lIA(A))
        if (this._state !== _P) this.enqueue([this.getBlobData, A, !1, Y, B]);
        else this.getBlobData(A, !1, Y, B);
      else if (this._state !== _P) this.enqueue([this.dispatch, A, !1, Y, B]);
      else this.sendFrame(ja.frame(A, Y), B)
    }
    send(A, Q, B) {
      let G = this._extensions[HqB.extensionName],
        Z = Q.binary ? 2 : 1,
        Y = Q.compress,
        J, X;
      if (typeof A === "string") J = Buffer.byteLength(A), X = !1;
      else if (lIA(A)) J = A.size, X = !1;
      else A = fBA(A), J = A.length, X = fBA.readOnly;
      if (this._firstFragment) {
        if (this._firstFragment = !1, Y && G && G.params[G._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) Y = J >= G._threshold;
        this._compress = Y
      } else Y = !1, Z = 0;
      if (Q.fin) this._firstFragment = !0;
      let I = {
        [sR]: J,
        fin: Q.fin,
        generateMask: this._generateMask,
        mask: Q.mask,
        maskBuffer: this._maskBuffer,
        opcode: Z,
        readOnly: X,
        rsv1: Y
      };
      if (lIA(A))
        if (this._state !== _P) this.enqueue([this.getBlobData, A, this._compress, I, B]);
        else this.getBlobData(A, this._compress, I, B);
      else if (this._state !== _P) this.enqueue([this.dispatch, A, this._compress, I, B]);
      else this.dispatch(A, this._compress, I, B)
    }
    getBlobData(A, Q, B, G) {
      this._bufferedBytes += B[sR], this._state = BD8, A.arrayBuffer().then((Z) => {
        if (this._socket.destroyed) {
          let J = Error("The socket was closed while the blob was being read");
          process.nextTick(a00, this, J, G);
          return
        }
        this._bufferedBytes -= B[sR];
        let Y = fBA(Z);
        if (!Q) this._state = _P, this.sendFrame(ja.frame(Y, B), G), this.dequeue();
        else this.dispatch(Y, Q, B, G)
      }).catch((Z) => {
        process.nextTick(GD8, this, Z, G)
      })
    }
    dispatch(A, Q, B, G) {
      if (!Q) {
        this.sendFrame(ja.frame(A, B), G);
        return
      }
      let Z = this._extensions[HqB.extensionName];
      this._bufferedBytes += B[sR], this._state = QD8, Z.compress(A, B.fin, (Y, J) => {
        if (this._socket.destroyed) {
          let X = Error("The socket was closed while data was being compressed");
          a00(this, X, G);
          return
        }
        this._bufferedBytes -= B[sR], this._state = _P, B.readOnly = !1, this.sendFrame(ja.frame(J, B), G), this.dequeue()
      })
    }
    dequeue() {
      while (this._state === _P && this._queue.length) {
        let A = this._queue.shift();
        this._bufferedBytes -= A[3][sR], Reflect.apply(A[0], this, A.slice(1))
      }
    }
    enqueue(A) {
      this._bufferedBytes += A[3][sR], this._queue.push(A)
    }
    sendFrame(A, Q) {
      if (A.length === 2) this._socket.cork(), this._socket.write(A[0]), this._socket.write(A[1], Q), this._socket.uncork();
      else this._socket.write(A[0], Q)
    }
  }
  zqB.exports = ja;

  function a00(A, Q, B) {
    if (typeof B === "function") B(Q);
    for (let G = 0; G < A._queue.length; G++) {
      let Z = A._queue[G],
        Y = Z[Z.length - 1];
      if (typeof Y === "function") Y(Q)
    }
  }

  function GD8(A, Q, B) {
    a00(A, Q, B), A.onerror(Q)
  }
})
// @from(Ln 171537, Col 4)
MqB = U((PTG, OqB) => {
  var {
    kForOnEventAttribute: j_A,
    kListener: r00
  } = Xm(), $qB = Symbol("kCode"), CqB = Symbol("kData"), UqB = Symbol("kError"), qqB = Symbol("kMessage"), NqB = Symbol("kReason"), nIA = Symbol("kTarget"), wqB = Symbol("kType"), LqB = Symbol("kWasClean");
  class Ta {
    constructor(A) {
      this[nIA] = null, this[wqB] = A
    }
    get target() {
      return this[nIA]
    }
    get type() {
      return this[wqB]
    }
  }
  Object.defineProperty(Ta.prototype, "target", {
    enumerable: !0
  });
  Object.defineProperty(Ta.prototype, "type", {
    enumerable: !0
  });
  class aIA extends Ta {
    constructor(A, Q = {}) {
      super(A);
      this[$qB] = Q.code === void 0 ? 0 : Q.code, this[NqB] = Q.reason === void 0 ? "" : Q.reason, this[LqB] = Q.wasClean === void 0 ? !1 : Q.wasClean
    }
    get code() {
      return this[$qB]
    }
    get reason() {
      return this[NqB]
    }
    get wasClean() {
      return this[LqB]
    }
  }
  Object.defineProperty(aIA.prototype, "code", {
    enumerable: !0
  });
  Object.defineProperty(aIA.prototype, "reason", {
    enumerable: !0
  });
  Object.defineProperty(aIA.prototype, "wasClean", {
    enumerable: !0
  });
  class T_A extends Ta {
    constructor(A, Q = {}) {
      super(A);
      this[UqB] = Q.error === void 0 ? null : Q.error, this[qqB] = Q.message === void 0 ? "" : Q.message
    }
    get error() {
      return this[UqB]
    }
    get message() {
      return this[qqB]
    }
  }
  Object.defineProperty(T_A.prototype, "error", {
    enumerable: !0
  });
  Object.defineProperty(T_A.prototype, "message", {
    enumerable: !0
  });
  class aB1 extends Ta {
    constructor(A, Q = {}) {
      super(A);
      this[CqB] = Q.data === void 0 ? null : Q.data
    }
    get data() {
      return this[CqB]
    }
  }
  Object.defineProperty(aB1.prototype, "data", {
    enumerable: !0
  });
  var ZD8 = {
    addEventListener(A, Q, B = {}) {
      for (let Z of this.listeners(A))
        if (!B[j_A] && Z[r00] === Q && !Z[j_A]) return;
      let G;
      if (A === "message") G = function (Y, J) {
        let X = new aB1("message", {
          data: J ? Y : Y.toString()
        });
        X[nIA] = this, nB1(Q, this, X)
      };
      else if (A === "close") G = function (Y, J) {
        let X = new aIA("close", {
          code: Y,
          reason: J.toString(),
          wasClean: this._closeFrameReceived && this._closeFrameSent
        });
        X[nIA] = this, nB1(Q, this, X)
      };
      else if (A === "error") G = function (Y) {
        let J = new T_A("error", {
          error: Y,
          message: Y.message
        });
        J[nIA] = this, nB1(Q, this, J)
      };
      else if (A === "open") G = function () {
        let Y = new Ta("open");
        Y[nIA] = this, nB1(Q, this, Y)
      };
      else return;
      if (G[j_A] = !!B[j_A], G[r00] = Q, B.once) this.once(A, G);
      else this.on(A, G)
    },
    removeEventListener(A, Q) {
      for (let B of this.listeners(A))
        if (B[r00] === Q && !B[j_A]) {
          this.removeListener(A, B);
          break
        }
    }
  };
  OqB.exports = {
    CloseEvent: aIA,
    ErrorEvent: T_A,
    Event: Ta,
    EventTarget: ZD8,
    MessageEvent: aB1
  };

  function nB1(A, Q, B) {
    if (typeof A === "object" && A.handleEvent) A.handleEvent.call(A, B);
    else A.call(Q, B)
  }
})
// @from(Ln 171668, Col 4)
s00 = U((STG, RqB) => {
  var {
    tokenChars: P_A
  } = pIA();

  function Lk(A, Q, B) {
    if (A[Q] === void 0) A[Q] = [B];
    else A[Q].push(B)
  }

  function YD8(A) {
    let Q = Object.create(null),
      B = Object.create(null),
      G = !1,
      Z = !1,
      Y = !1,
      J, X, I = -1,
      D = -1,
      W = -1,
      K = 0;
    for (; K < A.length; K++)
      if (D = A.charCodeAt(K), J === void 0)
        if (W === -1 && P_A[D] === 1) {
          if (I === -1) I = K
        } else if (K !== 0 && (D === 32 || D === 9)) {
      if (W === -1 && I !== -1) W = K
    } else if (D === 59 || D === 44) {
      if (I === -1) throw SyntaxError(`Unexpected character at index ${K}`);
      if (W === -1) W = K;
      let F = A.slice(I, W);
      if (D === 44) Lk(Q, F, B), B = Object.create(null);
      else J = F;
      I = W = -1
    } else throw SyntaxError(`Unexpected character at index ${K}`);
    else if (X === void 0)
      if (W === -1 && P_A[D] === 1) {
        if (I === -1) I = K
      } else if (D === 32 || D === 9) {
      if (W === -1 && I !== -1) W = K
    } else if (D === 59 || D === 44) {
      if (I === -1) throw SyntaxError(`Unexpected character at index ${K}`);
      if (W === -1) W = K;
      if (Lk(B, A.slice(I, W), !0), D === 44) Lk(Q, J, B), B = Object.create(null), J = void 0;
      I = W = -1
    } else if (D === 61 && I !== -1 && W === -1) X = A.slice(I, K), I = W = -1;
    else throw SyntaxError(`Unexpected character at index ${K}`);
    else if (Z) {
      if (P_A[D] !== 1) throw SyntaxError(`Unexpected character at index ${K}`);
      if (I === -1) I = K;
      else if (!G) G = !0;
      Z = !1
    } else if (Y)
      if (P_A[D] === 1) {
        if (I === -1) I = K
      } else if (D === 34 && I !== -1) Y = !1, W = K;
    else if (D === 92) Z = !0;
    else throw SyntaxError(`Unexpected character at index ${K}`);
    else if (D === 34 && A.charCodeAt(K - 1) === 61) Y = !0;
    else if (W === -1 && P_A[D] === 1) {
      if (I === -1) I = K
    } else if (I !== -1 && (D === 32 || D === 9)) {
      if (W === -1) W = K
    } else if (D === 59 || D === 44) {
      if (I === -1) throw SyntaxError(`Unexpected character at index ${K}`);
      if (W === -1) W = K;
      let F = A.slice(I, W);
      if (G) F = F.replace(/\\/g, ""), G = !1;
      if (Lk(B, X, F), D === 44) Lk(Q, J, B), B = Object.create(null), J = void 0;
      X = void 0, I = W = -1
    } else throw SyntaxError(`Unexpected character at index ${K}`);
    if (I === -1 || Y || D === 32 || D === 9) throw SyntaxError("Unexpected end of input");
    if (W === -1) W = K;
    let V = A.slice(I, W);
    if (J === void 0) Lk(Q, V, B);
    else {
      if (X === void 0) Lk(B, V, !0);
      else if (G) Lk(B, X, V.replace(/\\/g, ""));
      else Lk(B, X, V);
      Lk(Q, J, B)
    }
    return Q
  }

  function JD8(A) {
    return Object.keys(A).map((Q) => {
      let B = A[Q];
      if (!Array.isArray(B)) B = [B];
      return B.map((G) => {
        return [Q].concat(Object.keys(G).map((Z) => {
          let Y = G[Z];
          if (!Array.isArray(Y)) Y = [Y];
          return Y.map((J) => J === !0 ? Z : `${Z}=${J}`).join("; ")
        })).join("; ")
      }).join(", ")
    }).join(", ")
  }
  RqB.exports = {
    format: JD8,
    parse: YD8
  }
})
// @from(Ln 171769, Col 4)
tB1 = U((vTG, hqB) => {
  var XD8 = NA("events"),
    ID8 = NA("https"),
    DD8 = NA("http"),
    TqB = NA("net"),
    WD8 = NA("tls"),
    {
      randomBytes: KD8,
      createHash: VD8
    } = NA("crypto"),
    {
      Duplex: xTG,
      Readable: yTG
    } = NA("stream"),
    {
      URL: t00
    } = NA("url"),
    Pa = __A(),
    FD8 = n00(),
    HD8 = o00(),
    {
      isBlob: ED8
    } = pIA(),
    {
      BINARY_TYPES: _qB,
      EMPTY_BUFFER: oB1,
      GUID: zD8,
      kForOnEventAttribute: e00,
      kListener: $D8,
      kStatusCode: CD8,
      kWebSocket: IF,
      NOOP: PqB
    } = Xm(),
    {
      EventTarget: {
        addEventListener: UD8,
        removeEventListener: qD8
      }
    } = MqB(),
    {
      format: ND8,
      parse: wD8
    } = s00(),
    {
      toBuffer: LD8
    } = M_A(),
    SqB = Symbol("kAborted"),
    AQ0 = [8, 13],
    Dm = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"],
    OD8 = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
  class Y3 extends XD8 {
    constructor(A, Q, B) {
      super();
      if (this._binaryType = _qB[0], this._closeCode = 1006, this._closeFrameReceived = !1, this._closeFrameSent = !1, this._closeMessage = oB1, this._closeTimer = null, this._errorEmitted = !1, this._extensions = {}, this._paused = !1, this._protocol = "", this._readyState = Y3.CONNECTING, this._receiver = null, this._sender = null, this._socket = null, A !== null) {
        if (this._bufferedAmount = 0, this._isServer = !1, this._redirects = 0, Q === void 0) Q = [];
        else if (!Array.isArray(Q))
          if (typeof Q === "object" && Q !== null) B = Q, Q = [];
          else Q = [Q];
        xqB(this, A, Q, B)
      } else this._autoPong = B.autoPong, this._isServer = !0
    }
    get binaryType() {
      return this._binaryType
    }
    set binaryType(A) {
      if (!_qB.includes(A)) return;
      if (this._binaryType = A, this._receiver) this._receiver._binaryType = A
    }
    get bufferedAmount() {
      if (!this._socket) return this._bufferedAmount;
      return this._socket._writableState.length + this._sender._bufferedBytes
    }
    get extensions() {
      return Object.keys(this._extensions).join()
    }
    get isPaused() {
      return this._paused
    }
    get onclose() {
      return null
    }
    get onerror() {
      return null
    }
    get onopen() {
      return null
    }
    get onmessage() {
      return null
    }
    get protocol() {
      return this._protocol
    }
    get readyState() {
      return this._readyState
    }
    get url() {
      return this._url
    }
    setSocket(A, Q, B) {
      let G = new FD8({
          allowSynchronousEvents: B.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxPayload: B.maxPayload,
          skipUTF8Validation: B.skipUTF8Validation
        }),
        Z = new HD8(A, this._extensions, B.generateMask);
      if (this._receiver = G, this._sender = Z, this._socket = A, G[IF] = this, Z[IF] = this, A[IF] = this, G.on("conclude", _D8), G.on("drain", jD8), G.on("error", TD8), G.on("message", PD8), G.on("ping", SD8), G.on("pong", xD8), Z.onerror = yD8, A.setTimeout) A.setTimeout(0);
      if (A.setNoDelay) A.setNoDelay();
      if (Q.length > 0) A.unshift(Q);
      A.on("close", kqB), A.on("data", sB1), A.on("end", bqB), A.on("error", fqB), this._readyState = Y3.OPEN, this.emit("open")
    }
    emitClose() {
      if (!this._socket) {
        this._readyState = Y3.CLOSED, this.emit("close", this._closeCode, this._closeMessage);
        return
      }
      if (this._extensions[Pa.extensionName]) this._extensions[Pa.extensionName].cleanup();
      this._receiver.removeAllListeners(), this._readyState = Y3.CLOSED, this.emit("close", this._closeCode, this._closeMessage)
    }
    close(A, Q) {
      if (this.readyState === Y3.CLOSED) return;
      if (this.readyState === Y3.CONNECTING) {
        iL(this, this._req, "WebSocket was closed before the connection was established");
        return
      }
      if (this.readyState === Y3.CLOSING) {
        if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) this._socket.end();
        return
      }
      this._readyState = Y3.CLOSING, this._sender.close(A, Q, !this._isServer, (B) => {
        if (B) return;
        if (this._closeFrameSent = !0, this._closeFrameReceived || this._receiver._writableState.errorEmitted) this._socket.end()
      }), vqB(this)
    }
    pause() {
      if (this.readyState === Y3.CONNECTING || this.readyState === Y3.CLOSED) return;
      this._paused = !0, this._socket.pause()
    }
    ping(A, Q, B) {
      if (this.readyState === Y3.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
      if (typeof A === "function") B = A, A = Q = void 0;
      else if (typeof Q === "function") B = Q, Q = void 0;
      if (typeof A === "number") A = A.toString();
      if (this.readyState !== Y3.OPEN) {
        QQ0(this, A, B);
        return
      }
      if (Q === void 0) Q = !this._isServer;
      this._sender.ping(A || oB1, Q, B)
    }
    pong(A, Q, B) {
      if (this.readyState === Y3.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
      if (typeof A === "function") B = A, A = Q = void 0;
      else if (typeof Q === "function") B = Q, Q = void 0;
      if (typeof A === "number") A = A.toString();
      if (this.readyState !== Y3.OPEN) {
        QQ0(this, A, B);
        return
      }
      if (Q === void 0) Q = !this._isServer;
      this._sender.pong(A || oB1, Q, B)
    }
    resume() {
      if (this.readyState === Y3.CONNECTING || this.readyState === Y3.CLOSED) return;
      if (this._paused = !1, !this._receiver._writableState.needDrain) this._socket.resume()
    }
    send(A, Q, B) {
      if (this.readyState === Y3.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
      if (typeof Q === "function") B = Q, Q = {};
      if (typeof A === "number") A = A.toString();
      if (this.readyState !== Y3.OPEN) {
        QQ0(this, A, B);
        return
      }
      let G = {
        binary: typeof A !== "string",
        mask: !this._isServer,
        compress: !0,
        fin: !0,
        ...Q
      };
      if (!this._extensions[Pa.extensionName]) G.compress = !1;
      this._sender.send(A || oB1, G, B)
    }
    terminate() {
      if (this.readyState === Y3.CLOSED) return;
      if (this.readyState === Y3.CONNECTING) {
        iL(this, this._req, "WebSocket was closed before the connection was established");
        return
      }
      if (this._socket) this._readyState = Y3.CLOSING, this._socket.destroy()
    }
  }
  Object.defineProperty(Y3, "CONNECTING", {
    enumerable: !0,
    value: Dm.indexOf("CONNECTING")
  });
  Object.defineProperty(Y3.prototype, "CONNECTING", {
    enumerable: !0,
    value: Dm.indexOf("CONNECTING")
  });
  Object.defineProperty(Y3, "OPEN", {
    enumerable: !0,
    value: Dm.indexOf("OPEN")
  });
  Object.defineProperty(Y3.prototype, "OPEN", {
    enumerable: !0,
    value: Dm.indexOf("OPEN")
  });
  Object.defineProperty(Y3, "CLOSING", {
    enumerable: !0,
    value: Dm.indexOf("CLOSING")
  });
  Object.defineProperty(Y3.prototype, "CLOSING", {
    enumerable: !0,
    value: Dm.indexOf("CLOSING")
  });
  Object.defineProperty(Y3, "CLOSED", {
    enumerable: !0,
    value: Dm.indexOf("CLOSED")
  });
  Object.defineProperty(Y3.prototype, "CLOSED", {
    enumerable: !0,
    value: Dm.indexOf("CLOSED")
  });
  ["binaryType", "bufferedAmount", "extensions", "isPaused", "protocol", "readyState", "url"].forEach((A) => {
    Object.defineProperty(Y3.prototype, A, {
      enumerable: !0
    })
  });
  ["open", "error", "close", "message"].forEach((A) => {
    Object.defineProperty(Y3.prototype, `on${A}`, {
      enumerable: !0,
      get() {
        for (let Q of this.listeners(A))
          if (Q[e00]) return Q[$D8];
        return null
      },
      set(Q) {
        for (let B of this.listeners(A))
          if (B[e00]) {
            this.removeListener(A, B);
            break
          } if (typeof Q !== "function") return;
        this.addEventListener(A, Q, {
          [e00]: !0
        })
      }
    })
  });
  Y3.prototype.addEventListener = UD8;
  Y3.prototype.removeEventListener = qD8;
  hqB.exports = Y3;

  function xqB(A, Q, B, G) {
    let Z = {
      allowSynchronousEvents: !0,
      autoPong: !0,
      protocolVersion: AQ0[1],
      maxPayload: 104857600,
      skipUTF8Validation: !1,
      perMessageDeflate: !0,
      followRedirects: !1,
      maxRedirects: 10,
      ...G,
      socketPath: void 0,
      hostname: void 0,
      protocol: void 0,
      timeout: void 0,
      method: "GET",
      host: void 0,
      path: void 0,
      port: void 0
    };
    if (A._autoPong = Z.autoPong, !AQ0.includes(Z.protocolVersion)) throw RangeError(`Unsupported protocol version: ${Z.protocolVersion} (supported versions: ${AQ0.join(", ")})`);
    let Y;
    if (Q instanceof t00) Y = Q;
    else try {
      Y = new t00(Q)
    } catch (E) {
      throw SyntaxError(`Invalid URL: ${Q}`)
    }
    if (Y.protocol === "http:") Y.protocol = "ws:";
    else if (Y.protocol === "https:") Y.protocol = "wss:";
    A._url = Y.href;
    let J = Y.protocol === "wss:",
      X = Y.protocol === "ws+unix:",
      I;
    if (Y.protocol !== "ws:" && !J && !X) I = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
    else if (X && !Y.pathname) I = "The URL's pathname is empty";
    else if (Y.hash) I = "The URL contains a fragment identifier";
    if (I) {
      let E = SyntaxError(I);
      if (A._redirects === 0) throw E;
      else {
        rB1(A, E);
        return
      }
    }
    let D = J ? 443 : 80,
      W = KD8(16).toString("base64"),
      K = J ? ID8.request : DD8.request,
      V = new Set,
      F;
    if (Z.createConnection = Z.createConnection || (J ? RD8 : MD8), Z.defaultPort = Z.defaultPort || D, Z.port = Y.port || D, Z.host = Y.hostname.startsWith("[") ? Y.hostname.slice(1, -1) : Y.hostname, Z.headers = {
        ...Z.headers,
        "Sec-WebSocket-Version": Z.protocolVersion,
        "Sec-WebSocket-Key": W,
        Connection: "Upgrade",
        Upgrade: "websocket"
      }, Z.path = Y.pathname + Y.search, Z.timeout = Z.handshakeTimeout, Z.perMessageDeflate) F = new Pa(Z.perMessageDeflate !== !0 ? Z.perMessageDeflate : {}, !1, Z.maxPayload), Z.headers["Sec-WebSocket-Extensions"] = ND8({
      [Pa.extensionName]: F.offer()
    });
    if (B.length) {
      for (let E of B) {
        if (typeof E !== "string" || !OD8.test(E) || V.has(E)) throw SyntaxError("An invalid or duplicated subprotocol was specified");
        V.add(E)
      }
      Z.headers["Sec-WebSocket-Protocol"] = B.join(",")
    }
    if (Z.origin)
      if (Z.protocolVersion < 13) Z.headers["Sec-WebSocket-Origin"] = Z.origin;
      else Z.headers.Origin = Z.origin;
    if (Y.username || Y.password) Z.auth = `${Y.username}:${Y.password}`;
    if (X) {
      let E = Z.path.split(":");
      Z.socketPath = E[0], Z.path = E[1]
    }
    let H;
    if (Z.followRedirects) {
      if (A._redirects === 0) {
        A._originalIpc = X, A._originalSecure = J, A._originalHostOrSocketPath = X ? Z.socketPath : Y.host;
        let E = G && G.headers;
        if (G = {
            ...G,
            headers: {}
          }, E)
          for (let [z, $] of Object.entries(E)) G.headers[z.toLowerCase()] = $
      } else if (A.listenerCount("redirect") === 0) {
        let E = X ? A._originalIpc ? Z.socketPath === A._originalHostOrSocketPath : !1 : A._originalIpc ? !1 : Y.host === A._originalHostOrSocketPath;
        if (!E || A._originalSecure && !J) {
          if (delete Z.headers.authorization, delete Z.headers.cookie, !E) delete Z.headers.host;
          Z.auth = void 0
        }
      }
      if (Z.auth && !G.headers.authorization) G.headers.authorization = "Basic " + Buffer.from(Z.auth).toString("base64");
      if (H = A._req = K(Z), A._redirects) A.emit("redirect", A.url, H)
    } else H = A._req = K(Z);
    if (Z.timeout) H.on("timeout", () => {
      iL(A, H, "Opening handshake has timed out")
    });
    if (H.on("error", (E) => {
        if (H === null || H[SqB]) return;
        H = A._req = null, rB1(A, E)
      }), H.on("response", (E) => {
        let z = E.headers.location,
          $ = E.statusCode;
        if (z && Z.followRedirects && $ >= 300 && $ < 400) {
          if (++A._redirects > Z.maxRedirects) {
            iL(A, H, "Maximum redirects exceeded");
            return
          }
          H.abort();
          let O;
          try {
            O = new t00(z, Q)
          } catch (L) {
            let M = SyntaxError(`Invalid URL: ${z}`);
            rB1(A, M);
            return
          }
          xqB(A, O, B, G)
        } else if (!A.emit("unexpected-response", H, E)) iL(A, H, `Unexpected server response: ${E.statusCode}`)
      }), H.on("upgrade", (E, z, $) => {
        if (A.emit("upgrade", E), A.readyState !== Y3.CONNECTING) return;
        H = A._req = null;
        let O = E.headers.upgrade;
        if (O === void 0 || O.toLowerCase() !== "websocket") {
          iL(A, z, "Invalid Upgrade header");
          return
        }
        let L = VD8("sha1").update(W + zD8).digest("base64");
        if (E.headers["sec-websocket-accept"] !== L) {
          iL(A, z, "Invalid Sec-WebSocket-Accept header");
          return
        }
        let M = E.headers["sec-websocket-protocol"],
          _;
        if (M !== void 0) {
          if (!V.size) _ = "Server sent a subprotocol but none was requested";
          else if (!V.has(M)) _ = "Server sent an invalid subprotocol"
        } else if (V.size) _ = "Server sent no subprotocol";
        if (_) {
          iL(A, z, _);
          return
        }
        if (M) A._protocol = M;
        let j = E.headers["sec-websocket-extensions"];
        if (j !== void 0) {
          if (!F) {
            iL(A, z, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
            return
          }
          let x;
          try {
            x = wD8(j)
          } catch (S) {
            iL(A, z, "Invalid Sec-WebSocket-Extensions header");
            return
          }
          let b = Object.keys(x);
          if (b.length !== 1 || b[0] !== Pa.extensionName) {
            iL(A, z, "Server indicated an extension that was not requested");
            return
          }
          try {
            F.accept(x[Pa.extensionName])
          } catch (S) {
            iL(A, z, "Invalid Sec-WebSocket-Extensions header");
            return
          }
          A._extensions[Pa.extensionName] = F
        }
        A.setSocket(z, $, {
          allowSynchronousEvents: Z.allowSynchronousEvents,
          generateMask: Z.generateMask,
          maxPayload: Z.maxPayload,
          skipUTF8Validation: Z.skipUTF8Validation
        })
      }), Z.finishRequest) Z.finishRequest(H, A);
    else H.end()
  }

  function rB1(A, Q) {
    A._readyState = Y3.CLOSING, A._errorEmitted = !0, A.emit("error", Q), A.emitClose()
  }

  function MD8(A) {
    return A.path = A.socketPath, TqB.connect(A)
  }

  function RD8(A) {
    if (A.path = void 0, !A.servername && A.servername !== "") A.servername = TqB.isIP(A.host) ? "" : A.host;
    return WD8.connect(A)
  }

  function iL(A, Q, B) {
    A._readyState = Y3.CLOSING;
    let G = Error(B);
    if (Error.captureStackTrace(G, iL), Q.setHeader) {
      if (Q[SqB] = !0, Q.abort(), Q.socket && !Q.socket.destroyed) Q.socket.destroy();
      process.nextTick(rB1, A, G)
    } else Q.destroy(G), Q.once("error", A.emit.bind(A, "error")), Q.once("close", A.emitClose.bind(A))
  }

  function QQ0(A, Q, B) {
    if (Q) {
      let G = ED8(Q) ? Q.size : LD8(Q).length;
      if (A._socket) A._sender._bufferedBytes += G;
      else A._bufferedAmount += G
    }
    if (B) {
      let G = Error(`WebSocket is not open: readyState ${A.readyState} (${Dm[A.readyState]})`);
      process.nextTick(B, G)
    }
  }

  function _D8(A, Q) {
    let B = this[IF];
    if (B._closeFrameReceived = !0, B._closeMessage = Q, B._closeCode = A, B._socket[IF] === void 0) return;
    if (B._socket.removeListener("data", sB1), process.nextTick(yqB, B._socket), A === 1005) B.close();
    else B.close(A, Q)
  }

  function jD8() {
    let A = this[IF];
    if (!A.isPaused) A._socket.resume()
  }

  function TD8(A) {
    let Q = this[IF];
    if (Q._socket[IF] !== void 0) Q._socket.removeListener("data", sB1), process.nextTick(yqB, Q._socket), Q.close(A[CD8]);
    if (!Q._errorEmitted) Q._errorEmitted = !0, Q.emit("error", A)
  }

  function jqB() {
    this[IF].emitClose()
  }

  function PD8(A, Q) {
    this[IF].emit("message", A, Q)
  }

  function SD8(A) {
    let Q = this[IF];
    if (Q._autoPong) Q.pong(A, !this._isServer, PqB);
    Q.emit("ping", A)
  }

  function xD8(A) {
    this[IF].emit("pong", A)
  }

  function yqB(A) {
    A.resume()
  }

  function yD8(A) {
    let Q = this[IF];
    if (Q.readyState === Y3.CLOSED) return;
    if (Q.readyState === Y3.OPEN) Q._readyState = Y3.CLOSING, vqB(Q);
    if (this._socket.end(), !Q._errorEmitted) Q._errorEmitted = !0, Q.emit("error", A)
  }

  function vqB(A) {
    A._closeTimer = setTimeout(A._socket.destroy.bind(A._socket), 30000)
  }

  function kqB() {
    let A = this[IF];
    this.removeListener("close", kqB), this.removeListener("data", sB1), this.removeListener("end", bqB), A._readyState = Y3.CLOSING;
    let Q;
    if (!this._readableState.endEmitted && !A._closeFrameReceived && !A._receiver._writableState.errorEmitted && (Q = A._socket.read()) !== null) A._receiver.write(Q);
    if (A._receiver.end(), this[IF] = void 0, clearTimeout(A._closeTimer), A._receiver._writableState.finished || A._receiver._writableState.errorEmitted) A.emitClose();
    else A._receiver.on("error", jqB), A._receiver.on("finish", jqB)
  }

  function sB1(A) {
    if (!this[IF]._receiver.write(A)) this.pause()
  }

  function bqB() {
    let A = this[IF];
    A._readyState = Y3.CLOSING, A._receiver.end(), this.end()
  }

  function fqB() {
    let A = this[IF];
    if (this.removeListener("error", fqB), this.on("error", PqB), A) A._readyState = Y3.CLOSING, this.destroy()
  }
})
// @from(Ln 172313, Col 4)
dqB = U((bTG, mqB) => {
  var kTG = tB1(),
    {
      Duplex: vD8
    } = NA("stream");

  function gqB(A) {
    A.emit("close")
  }

  function kD8() {
    if (!this.destroyed && this._writableState.finished) this.destroy()
  }

  function uqB(A) {
    if (this.removeListener("error", uqB), this.destroy(), this.listenerCount("error") === 0) this.emit("error", A)
  }

  function bD8(A, Q) {
    let B = !0,
      G = new vD8({
        ...Q,
        autoDestroy: !1,
        emitClose: !1,
        objectMode: !1,
        writableObjectMode: !1
      });
    return A.on("message", function (Y, J) {
      let X = !J && G._readableState.objectMode ? Y.toString() : Y;
      if (!G.push(X)) A.pause()
    }), A.once("error", function (Y) {
      if (G.destroyed) return;
      B = !1, G.destroy(Y)
    }), A.once("close", function () {
      if (G.destroyed) return;
      G.push(null)
    }), G._destroy = function (Z, Y) {
      if (A.readyState === A.CLOSED) {
        Y(Z), process.nextTick(gqB, G);
        return
      }
      let J = !1;
      if (A.once("error", function (I) {
          J = !0, Y(I)
        }), A.once("close", function () {
          if (!J) Y(Z);
          process.nextTick(gqB, G)
        }), B) A.terminate()
    }, G._final = function (Z) {
      if (A.readyState === A.CONNECTING) {
        A.once("open", function () {
          G._final(Z)
        });
        return
      }
      if (A._socket === null) return;
      if (A._socket._writableState.finished) {
        if (Z(), G._readableState.endEmitted) G.destroy()
      } else A._socket.once("finish", function () {
        Z()
      }), A.close()
    }, G._read = function () {
      if (A.isPaused) A.resume()
    }, G._write = function (Z, Y, J) {
      if (A.readyState === A.CONNECTING) {
        A.once("open", function () {
          G._write(Z, Y, J)
        });
        return
      }
      A.send(Z, J)
    }, G.on("end", kD8), G.on("error", uqB), G
  }
  mqB.exports = bD8
})
// @from(Ln 172388, Col 4)
pqB = U((fTG, cqB) => {
  var {
    tokenChars: fD8
  } = pIA();

  function hD8(A) {
    let Q = new Set,
      B = -1,
      G = -1,
      Z = 0;
    for (Z; Z < A.length; Z++) {
      let J = A.charCodeAt(Z);
      if (G === -1 && fD8[J] === 1) {
        if (B === -1) B = Z
      } else if (Z !== 0 && (J === 32 || J === 9)) {
        if (G === -1 && B !== -1) G = Z
      } else if (J === 44) {
        if (B === -1) throw SyntaxError(`Unexpected character at index ${Z}`);
        if (G === -1) G = Z;
        let X = A.slice(B, G);
        if (Q.has(X)) throw SyntaxError(`The "${X}" subprotocol is duplicated`);
        Q.add(X), B = G = -1
      } else throw SyntaxError(`Unexpected character at index ${Z}`)
    }
    if (B === -1 || G !== -1) throw SyntaxError("Unexpected end of input");
    let Y = A.slice(B, Z);
    if (Q.has(Y)) throw SyntaxError(`The "${Y}" subprotocol is duplicated`);
    return Q.add(Y), Q
  }
  cqB.exports = {
    parse: hD8
  }
})
// @from(Ln 172421, Col 4)
oqB = U((gTG, aqB) => {
  var gD8 = NA("events"),
    eB1 = NA("http"),
    {
      Duplex: hTG
    } = NA("stream"),
    {
      createHash: uD8
    } = NA("crypto"),
    lqB = s00(),
    gBA = __A(),
    mD8 = pqB(),
    dD8 = tB1(),
    {
      GUID: cD8,
      kWebSocket: pD8
    } = Xm(),
    lD8 = /^[+/0-9A-Za-z]{22}==$/;
  class nqB extends gD8 {
    constructor(A, Q) {
      super();
      if (A = {
          allowSynchronousEvents: !0,
          autoPong: !0,
          maxPayload: 104857600,
          skipUTF8Validation: !1,
          perMessageDeflate: !1,
          handleProtocols: null,
          clientTracking: !0,
          verifyClient: null,
          noServer: !1,
          backlog: null,
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: dD8,
          ...A
        }, A.port == null && !A.server && !A.noServer || A.port != null && (A.server || A.noServer) || A.server && A.noServer) throw TypeError('One and only one of the "port", "server", or "noServer" options must be specified');
      if (A.port != null) this._server = eB1.createServer((B, G) => {
        let Z = eB1.STATUS_CODES[426];
        G.writeHead(426, {
          "Content-Length": Z.length,
          "Content-Type": "text/plain"
        }), G.end(Z)
      }), this._server.listen(A.port, A.host, A.backlog, Q);
      else if (A.server) this._server = A.server;
      if (this._server) {
        let B = this.emit.bind(this, "connection");
        this._removeListeners = iD8(this._server, {
          listening: this.emit.bind(this, "listening"),
          error: this.emit.bind(this, "error"),
          upgrade: (G, Z, Y) => {
            this.handleUpgrade(G, Z, Y, B)
          }
        })
      }
      if (A.perMessageDeflate === !0) A.perMessageDeflate = {};
      if (A.clientTracking) this.clients = new Set, this._shouldEmitClose = !1;
      this.options = A, this._state = 0
    }
    address() {
      if (this.options.noServer) throw Error('The server is operating in "noServer" mode');
      if (!this._server) return null;
      return this._server.address()
    }
    close(A) {
      if (this._state === 2) {
        if (A) this.once("close", () => {
          A(Error("The server is not running"))
        });
        process.nextTick(S_A, this);
        return
      }
      if (A) this.once("close", A);
      if (this._state === 1) return;
      if (this._state = 1, this.options.noServer || this.options.server) {
        if (this._server) this._removeListeners(), this._removeListeners = this._server = null;
        if (this.clients)
          if (!this.clients.size) process.nextTick(S_A, this);
          else this._shouldEmitClose = !0;
        else process.nextTick(S_A, this)
      } else {
        let Q = this._server;
        this._removeListeners(), this._removeListeners = this._server = null, Q.close(() => {
          S_A(this)
        })
      }
    }
    shouldHandle(A) {
      if (this.options.path) {
        let Q = A.url.indexOf("?");
        if ((Q !== -1 ? A.url.slice(0, Q) : A.url) !== this.options.path) return !1
      }
      return !0
    }
    handleUpgrade(A, Q, B, G) {
      Q.on("error", iqB);
      let Z = A.headers["sec-websocket-key"],
        Y = A.headers.upgrade,
        J = +A.headers["sec-websocket-version"];
      if (A.method !== "GET") {
        uBA(this, A, Q, 405, "Invalid HTTP method");
        return
      }
      if (Y === void 0 || Y.toLowerCase() !== "websocket") {
        uBA(this, A, Q, 400, "Invalid Upgrade header");
        return
      }
      if (Z === void 0 || !lD8.test(Z)) {
        uBA(this, A, Q, 400, "Missing or invalid Sec-WebSocket-Key header");
        return
      }
      if (J !== 13 && J !== 8) {
        uBA(this, A, Q, 400, "Missing or invalid Sec-WebSocket-Version header", {
          "Sec-WebSocket-Version": "13, 8"
        });
        return
      }
      if (!this.shouldHandle(A)) {
        x_A(Q, 400);
        return
      }
      let X = A.headers["sec-websocket-protocol"],
        I = new Set;
      if (X !== void 0) try {
        I = mD8.parse(X)
      } catch (K) {
        uBA(this, A, Q, 400, "Invalid Sec-WebSocket-Protocol header");
        return
      }
      let D = A.headers["sec-websocket-extensions"],
        W = {};
      if (this.options.perMessageDeflate && D !== void 0) {
        let K = new gBA(this.options.perMessageDeflate, !0, this.options.maxPayload);
        try {
          let V = lqB.parse(D);
          if (V[gBA.extensionName]) K.accept(V[gBA.extensionName]), W[gBA.extensionName] = K
        } catch (V) {
          uBA(this, A, Q, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header");
          return
        }
      }
      if (this.options.verifyClient) {
        let K = {
          origin: A.headers[`${J===8?"sec-websocket-origin":"origin"}`],
          secure: !!(A.socket.authorized || A.socket.encrypted),
          req: A
        };
        if (this.options.verifyClient.length === 2) {
          this.options.verifyClient(K, (V, F, H, E) => {
            if (!V) return x_A(Q, F || 401, H, E);
            this.completeUpgrade(W, Z, I, A, Q, B, G)
          });
          return
        }
        if (!this.options.verifyClient(K)) return x_A(Q, 401)
      }
      this.completeUpgrade(W, Z, I, A, Q, B, G)
    }
    completeUpgrade(A, Q, B, G, Z, Y, J) {
      if (!Z.readable || !Z.writable) return Z.destroy();
      if (Z[pD8]) throw Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
      if (this._state > 0) return x_A(Z, 503);
      let I = ["HTTP/1.1 101 Switching Protocols", "Upgrade: websocket", "Connection: Upgrade", `Sec-WebSocket-Accept: ${uD8("sha1").update(Q+cD8).digest("base64")}`],
        D = new this.options.WebSocket(null, void 0, this.options);
      if (B.size) {
        let W = this.options.handleProtocols ? this.options.handleProtocols(B, G) : B.values().next().value;
        if (W) I.push(`Sec-WebSocket-Protocol: ${W}`), D._protocol = W
      }
      if (A[gBA.extensionName]) {
        let W = A[gBA.extensionName].params,
          K = lqB.format({
            [gBA.extensionName]: [W]
          });
        I.push(`Sec-WebSocket-Extensions: ${K}`), D._extensions = A
      }
      if (this.emit("headers", I, G), Z.write(I.concat(`\r
`).join(`\r
`)), Z.removeListener("error", iqB), D.setSocket(Z, Y, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        }), this.clients) this.clients.add(D), D.on("close", () => {
        if (this.clients.delete(D), this._shouldEmitClose && !this.clients.size) process.nextTick(S_A, this)
      });
      J(D, G)
    }
  }
  aqB.exports = nqB;

  function iD8(A, Q) {
    for (let B of Object.keys(Q)) A.on(B, Q[B]);
    return function () {
      for (let G of Object.keys(Q)) A.removeListener(G, Q[G])
    }
  }

  function S_A(A) {
    A._state = 2, A.emit("close")
  }

  function iqB() {
    this.destroy()
  }

  function x_A(A, Q, B, G) {
    B = B || eB1.STATUS_CODES[Q], G = {
      Connection: "close",
      "Content-Type": "text/html",
      "Content-Length": Buffer.byteLength(B),
      ...G
    }, A.once("finish", A.destroy), A.end(`HTTP/1.1 ${Q} ${eB1.STATUS_CODES[Q]}\r
` + Object.keys(G).map((Z) => `${Z}: ${G[Z]}`).join(`\r
`) + `\r
\r
` + B)
  }

  function uBA(A, Q, B, G, Z, Y) {
    if (A.listenerCount("wsClientError")) {
      let J = Error(Z);
      Error.captureStackTrace(J, uBA), A.emit("wsClientError", J, B, Q)
    } else x_A(B, G, Z, Y)
  }
})
// @from(Ln 172647, Col 4)
nD8
// @from(Ln 172647, Col 9)
aD8
// @from(Ln 172647, Col 14)
oD8
// @from(Ln 172647, Col 19)
y_A
// @from(Ln 172647, Col 24)
rD8
// @from(Ln 172647, Col 29)
Ok
// @from(Ln 172648, Col 4)
v_A = w(() => {
  nD8 = c(dqB(), 1), aD8 = c(n00(), 1), oD8 = c(o00(), 1), y_A = c(tB1(), 1), rD8 = c(oqB(), 1), Ok = y_A.default
})
// @from(Ln 172651, Col 4)
A21
// @from(Ln 172652, Col 4)
rqB = w(() => {
  v_A();
  A21 = global;
  A21.WebSocket ||= Ok;
  A21.window ||= global;
  A21.self ||= global;
  A21.window.__REACT_DEVTOOLS_COMPONENT_FILTERS__ = [{
    type: 1,
    value: 7,
    isEnabled: !0
  }, {
    type: 2,
    value: "InternalApp",
    isEnabled: !0,
    isValid: !0
  }, {
    type: 2,
    value: "InternalAppContext",
    isEnabled: !0,
    isValid: !0
  }, {
    type: 2,
    value: "InternalStdoutContext",
    isEnabled: !0,
    isValid: !0
  }, {
    type: 2,
    value: "InternalStderrContext",
    isEnabled: !0,
    isValid: !0
  }, {
    type: 2,
    value: "InternalStdinContext",
    isEnabled: !0,
    isValid: !0
  }, {
    type: 2,
    value: "InternalFocusContext",
    isEnabled: !0,
    isValid: !0
  }]
})