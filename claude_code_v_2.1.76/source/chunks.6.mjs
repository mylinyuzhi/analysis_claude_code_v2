
// @from(Ln 15769, Col 4)
fQ1 = x((Lxz, QqA) => {
    var {
        Writable: Stq
    } = x6("stream"), BqA = Zy6(), {
        BINARY_TYPES: Ctq,
        EMPTY_BUFFER: gqA,
        kStatusCode: Itq,
        kWebSocket: btq
    } = Lp(), {
        concat: GQ1,
        toArrayBuffer: xtq,
        unmask: utq
    } = Py6(), {
        isValidStatusCode: mtq,
        isValidUTF8: FqA
    } = GO6(), P61 = Buffer[Symbol.species];
    class pqA extends Stq {
        constructor(A = {}) {
            super();
            this._allowSynchronousEvents = A.allowSynchronousEvents !== void 0 ? A.allowSynchronousEvents : !0, this._binaryType = A.binaryType || Ctq[0], this._extensions = A.extensions || {}, this._isServer = !!A.isServer, this._maxPayload = A.maxPayload | 0, this._skipUTF8Validation = !!A.skipUTF8Validation, this[btq] = void 0, this._bufferedBytes = 0, this._buffers = [], this._compressed = !1, this._payloadLength = 0, this._mask = void 0, this._fragmented = 0, this._masked = !1, this._fin = !1, this._opcode = 0, this._totalPayloadLength = 0, this._messageLength = 0, this._fragments = [], this._errored = !1, this._loop = !1, this._state = 0
        }
        _write(A, q, K) {
            if (this._opcode === 8 && this._state == 0) return K();
            this._bufferedBytes += A.length, this._buffers.push(A), this.startLoop(K)
        }
        consume(A) {
            if (this._bufferedBytes -= A, A === this._buffers[0].length) return this._buffers.shift();
            if (A < this._buffers[0].length) {
                let K = this._buffers[0];
                return this._buffers[0] = new P61(K.buffer, K.byteOffset + A, K.length - A), new P61(K.buffer, K.byteOffset, A)
            }
            let q = Buffer.allocUnsafe(A);
            do {
                let K = this._buffers[0],
                    Y = q.length - A;
                if (A >= K.length) q.set(this._buffers.shift(), Y);
                else q.set(new Uint8Array(K.buffer, K.byteOffset, A), Y), this._buffers[0] = new P61(K.buffer, K.byteOffset + A, K.length - A);
                A -= K.length
            } while (A > 0);
            return q
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
            let q = this.consume(2);
            if ((q[0] & 48) !== 0) {
                let Y = this.createError(RangeError, "RSV2 and RSV3 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_2_3");
                A(Y);
                return
            }
            let K = (q[0] & 64) === 64;
            if (K && !this._extensions[BqA.extensionName]) {
                let Y = this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
                A(Y);
                return
            }
            if (this._fin = (q[0] & 128) === 128, this._opcode = q[0] & 15, this._payloadLength = q[1] & 127, this._opcode === 0) {
                if (K) {
                    let Y = this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
                    A(Y);
                    return
                }
                if (!this._fragmented) {
                    let Y = this.createError(RangeError, "invalid opcode 0", !0, 1002, "WS_ERR_INVALID_OPCODE");
                    A(Y);
                    return
                }
                this._opcode = this._fragmented
            } else if (this._opcode === 1 || this._opcode === 2) {
                if (this._fragmented) {
                    let Y = this.createError(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE");
                    A(Y);
                    return
                }
                this._compressed = K
            } else if (this._opcode > 7 && this._opcode < 11) {
                if (!this._fin) {
                    let Y = this.createError(RangeError, "FIN must be set", !0, 1002, "WS_ERR_EXPECTED_FIN");
                    A(Y);
                    return
                }
                if (K) {
                    let Y = this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
                    A(Y);
                    return
                }
                if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
                    let Y = this.createError(RangeError, `invalid payload length ${this._payloadLength}`, !0, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
                    A(Y);
                    return
                }
            } else {
                let Y = this.createError(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE");
                A(Y);
                return
            }
            if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
            if (this._masked = (q[1] & 128) === 128, this._isServer) {
                if (!this._masked) {
                    let Y = this.createError(RangeError, "MASK must be set", !0, 1002, "WS_ERR_EXPECTED_MASK");
                    A(Y);
                    return
                }
            } else if (this._masked) {
                let Y = this.createError(RangeError, "MASK must be clear", !0, 1002, "WS_ERR_UNEXPECTED_MASK");
                A(Y);
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
            let q = this.consume(8),
                K = q.readUInt32BE(0);
            if (K > Math.pow(2, 21) - 1) {
                let Y = this.createError(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", !1, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH");
                A(Y);
                return
            }
            this._payloadLength = K * Math.pow(2, 32) + q.readUInt32BE(4), this.haveLength(A)
        }
        haveLength(A) {
            if (this._payloadLength && this._opcode < 8) {
                if (this._totalPayloadLength += this._payloadLength, this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
                    let q = this.createError(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
                    A(q);
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
            let q = gqA;
            if (this._payloadLength) {
                if (this._bufferedBytes < this._payloadLength) {
                    this._loop = !1;
                    return
                }
                if (q = this.consume(this._payloadLength), this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) utq(q, this._mask)
            }
            if (this._opcode > 7) {
                this.controlMessage(q, A);
                return
            }
            if (this._compressed) {
                this._state = 5, this.decompress(q, A);
                return
            }
            if (q.length) this._messageLength = this._totalPayloadLength, this._fragments.push(q);
            this.dataMessage(A)
        }
        decompress(A, q) {
            this._extensions[BqA.extensionName].decompress(A, this._fin, (Y, z) => {
                if (Y) return q(Y);
                if (z.length) {
                    if (this._messageLength += z.length, this._messageLength > this._maxPayload && this._maxPayload > 0) {
                        let _ = this.createError(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
                        q(_);
                        return
                    }
                    this._fragments.push(z)
                }
                if (this.dataMessage(q), this._state === 0) this.startLoop(q)
            })
        }
        dataMessage(A) {
            if (!this._fin) {
                this._state = 0;
                return
            }
            let q = this._messageLength,
                K = this._fragments;
            if (this._totalPayloadLength = 0, this._messageLength = 0, this._fragmented = 0, this._fragments = [], this._opcode === 2) {
                let Y;
                if (this._binaryType === "nodebuffer") Y = GQ1(K, q);
                else if (this._binaryType === "arraybuffer") Y = xtq(GQ1(K, q));
                else if (this._binaryType === "blob") Y = new Blob(K);
                else Y = K;
                if (this._allowSynchronousEvents) this.emit("message", Y, !0), this._state = 0;
                else this._state = 6, setImmediate(() => {
                    this.emit("message", Y, !0), this._state = 0, this.startLoop(A)
                })
            } else {
                let Y = GQ1(K, q);
                if (!this._skipUTF8Validation && !FqA(Y)) {
                    let z = this.createError(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8");
                    A(z);
                    return
                }
                if (this._state === 5 || this._allowSynchronousEvents) this.emit("message", Y, !1), this._state = 0;
                else this._state = 6, setImmediate(() => {
                    this.emit("message", Y, !1), this._state = 0, this.startLoop(A)
                })
            }
        }
        controlMessage(A, q) {
            if (this._opcode === 8) {
                if (A.length === 0) this._loop = !1, this.emit("conclude", 1005, gqA), this.end();
                else {
                    let K = A.readUInt16BE(0);
                    if (!mtq(K)) {
                        let z = this.createError(RangeError, `invalid status code ${K}`, !0, 1002, "WS_ERR_INVALID_CLOSE_CODE");
                        q(z);
                        return
                    }
                    let Y = new P61(A.buffer, A.byteOffset + 2, A.length - 2);
                    if (!this._skipUTF8Validation && !FqA(Y)) {
                        let z = this.createError(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8");
                        q(z);
                        return
                    }
                    this._loop = !1, this.emit("conclude", K, Y), this.end()
                }
                this._state = 0;
                return
            }
            if (this._allowSynchronousEvents) this.emit(this._opcode === 9 ? "ping" : "pong", A), this._state = 0;
            else this._state = 6, setImmediate(() => {
                this.emit(this._opcode === 9 ? "ping" : "pong", A), this._state = 0, this.startLoop(q)
            })
        }
        createError(A, q, K, Y, z) {
            this._loop = !1, this._errored = !0;
            let _ = new A(K ? `Invalid WebSocket frame: ${q}` : q);
            return Error.captureStackTrace(_, this.createError), _.code = z, _[Itq] = Y, _
        }
    }
    QqA.exports = pqA
})
// @from(Ln 16046, Col 4)
vQ1 = x((hxz, cqA) => {
    var {
        Duplex: Rxz
    } = x6("stream"), {
        randomFillSync: Btq
    } = x6("crypto"), UqA = Zy6(), {
        EMPTY_BUFFER: gtq,
        kWebSocket: Ftq,
        NOOP: ptq
    } = Lp(), {
        isBlob: fO6,
        isValidStatusCode: Qtq
    } = GO6(), {
        mask: dqA,
        toBuffer: TA6
    } = Py6(), Ky = Symbol("kByteLength"), Utq = Buffer.alloc(4), vA6, TO6 = 8192, WS = 0, dtq = 1, ctq = 2;
    class bn {
        constructor(A, q, K) {
            if (this._extensions = q || {}, K) this._generateMask = K, this._maskBuffer = Buffer.alloc(4);
            this._socket = A, this._firstFragment = !0, this._compress = !1, this._bufferedBytes = 0, this._queue = [], this._state = WS, this.onerror = ptq, this[Ftq] = void 0
        }
        static frame(A, q) {
            let K, Y = !1,
                z = 2,
                _ = !1;
            if (q.mask) {
                if (K = q.maskBuffer || Utq, q.generateMask) q.generateMask(K);
                else {
                    if (TO6 === 8192) {
                        if (vA6 === void 0) vA6 = Buffer.alloc(8192);
                        Btq(vA6, 0, 8192), TO6 = 0
                    }
                    K[0] = vA6[TO6++], K[1] = vA6[TO6++], K[2] = vA6[TO6++], K[3] = vA6[TO6++]
                }
                _ = (K[0] | K[1] | K[2] | K[3]) === 0, z = 6
            }
            let w;
            if (typeof A === "string")
                if ((!q.mask || _) && q[Ky] !== void 0) w = q[Ky];
                else A = Buffer.from(A), w = A.length;
            else w = A.length, Y = q.mask && q.readOnly && !_;
            let O = w;
            if (w >= 65536) z += 8, O = 127;
            else if (w > 125) z += 2, O = 126;
            let $ = Buffer.allocUnsafe(Y ? w + z : z);
            if ($[0] = q.fin ? q.opcode | 128 : q.opcode, q.rsv1) $[0] |= 64;
            if ($[1] = O, O === 126) $.writeUInt16BE(w, 2);
            else if (O === 127) $[2] = $[3] = 0, $.writeUIntBE(w, 4, 6);
            if (!q.mask) return [$, A];
            if ($[1] |= 128, $[z - 4] = K[0], $[z - 3] = K[1], $[z - 2] = K[2], $[z - 1] = K[3], _) return [$, A];
            if (Y) return dqA(A, K, $, z, w), [$];
            return dqA(A, K, A, 0, w), [$, A]
        }
        close(A, q, K, Y) {
            let z;
            if (A === void 0) z = gtq;
            else if (typeof A !== "number" || !Qtq(A)) throw TypeError("First argument must be a valid error code number");
            else if (q === void 0 || !q.length) z = Buffer.allocUnsafe(2), z.writeUInt16BE(A, 0);
            else {
                let w = Buffer.byteLength(q);
                if (w > 123) throw RangeError("The message must not be greater than 123 bytes");
                if (z = Buffer.allocUnsafe(2 + w), z.writeUInt16BE(A, 0), typeof q === "string") z.write(q, 2);
                else z.set(q, 2)
            }
            let _ = {
                [Ky]: z.length,
                fin: !0,
                generateMask: this._generateMask,
                mask: K,
                maskBuffer: this._maskBuffer,
                opcode: 8,
                readOnly: !1,
                rsv1: !1
            };
            if (this._state !== WS) this.enqueue([this.dispatch, z, !1, _, Y]);
            else this.sendFrame(bn.frame(z, _), Y)
        }
        ping(A, q, K) {
            let Y, z;
            if (typeof A === "string") Y = Buffer.byteLength(A), z = !1;
            else if (fO6(A)) Y = A.size, z = !1;
            else A = TA6(A), Y = A.length, z = TA6.readOnly;
            if (Y > 125) throw RangeError("The data size must not be greater than 125 bytes");
            let _ = {
                [Ky]: Y,
                fin: !0,
                generateMask: this._generateMask,
                mask: q,
                maskBuffer: this._maskBuffer,
                opcode: 9,
                readOnly: z,
                rsv1: !1
            };
            if (fO6(A))
                if (this._state !== WS) this.enqueue([this.getBlobData, A, !1, _, K]);
                else this.getBlobData(A, !1, _, K);
            else if (this._state !== WS) this.enqueue([this.dispatch, A, !1, _, K]);
            else this.sendFrame(bn.frame(A, _), K)
        }
        pong(A, q, K) {
            let Y, z;
            if (typeof A === "string") Y = Buffer.byteLength(A), z = !1;
            else if (fO6(A)) Y = A.size, z = !1;
            else A = TA6(A), Y = A.length, z = TA6.readOnly;
            if (Y > 125) throw RangeError("The data size must not be greater than 125 bytes");
            let _ = {
                [Ky]: Y,
                fin: !0,
                generateMask: this._generateMask,
                mask: q,
                maskBuffer: this._maskBuffer,
                opcode: 10,
                readOnly: z,
                rsv1: !1
            };
            if (fO6(A))
                if (this._state !== WS) this.enqueue([this.getBlobData, A, !1, _, K]);
                else this.getBlobData(A, !1, _, K);
            else if (this._state !== WS) this.enqueue([this.dispatch, A, !1, _, K]);
            else this.sendFrame(bn.frame(A, _), K)
        }
        send(A, q, K) {
            let Y = this._extensions[UqA.extensionName],
                z = q.binary ? 2 : 1,
                _ = q.compress,
                w, O;
            if (typeof A === "string") w = Buffer.byteLength(A), O = !1;
            else if (fO6(A)) w = A.size, O = !1;
            else A = TA6(A), w = A.length, O = TA6.readOnly;
            if (this._firstFragment) {
                if (this._firstFragment = !1, _ && Y && Y.params[Y._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) _ = w >= Y._threshold;
                this._compress = _
            } else _ = !1, z = 0;
            if (q.fin) this._firstFragment = !0;
            let $ = {
                [Ky]: w,
                fin: q.fin,
                generateMask: this._generateMask,
                mask: q.mask,
                maskBuffer: this._maskBuffer,
                opcode: z,
                readOnly: O,
                rsv1: _
            };
            if (fO6(A))
                if (this._state !== WS) this.enqueue([this.getBlobData, A, this._compress, $, K]);
                else this.getBlobData(A, this._compress, $, K);
            else if (this._state !== WS) this.enqueue([this.dispatch, A, this._compress, $, K]);
            else this.dispatch(A, this._compress, $, K)
        }
        getBlobData(A, q, K, Y) {
            this._bufferedBytes += K[Ky], this._state = ctq, A.arrayBuffer().then((z) => {
                if (this._socket.destroyed) {
                    let w = Error("The socket was closed while the blob was being read");
                    process.nextTick(TQ1, this, w, Y);
                    return
                }
                this._bufferedBytes -= K[Ky];
                let _ = TA6(z);
                if (!q) this._state = WS, this.sendFrame(bn.frame(_, K), Y), this.dequeue();
                else this.dispatch(_, q, K, Y)
            }).catch((z) => {
                process.nextTick(ltq, this, z, Y)
            })
        }
        dispatch(A, q, K, Y) {
            if (!q) {
                this.sendFrame(bn.frame(A, K), Y);
                return
            }
            let z = this._extensions[UqA.extensionName];
            this._bufferedBytes += K[Ky], this._state = dtq, z.compress(A, K.fin, (_, w) => {
                if (this._socket.destroyed) {
                    let O = Error("The socket was closed while data was being compressed");
                    TQ1(this, O, Y);
                    return
                }
                this._bufferedBytes -= K[Ky], this._state = WS, K.readOnly = !1, this.sendFrame(bn.frame(w, K), Y), this.dequeue()
            })
        }
        dequeue() {
            while (this._state === WS && this._queue.length) {
                let A = this._queue.shift();
                this._bufferedBytes -= A[3][Ky], Reflect.apply(A[0], this, A.slice(1))
            }
        }
        enqueue(A) {
            this._bufferedBytes += A[3][Ky], this._queue.push(A)
        }
        sendFrame(A, q) {
            if (A.length === 2) this._socket.cork(), this._socket.write(A[0]), this._socket.write(A[1], q), this._socket.uncork();
            else this._socket.write(A[0], q)
        }
    }
    cqA.exports = bn;

    function TQ1(A, q, K) {
        if (typeof K === "function") K(q);
        for (let Y = 0; Y < A._queue.length; Y++) {
            let z = A._queue[Y],
                _ = z[z.length - 1];
            if (typeof _ === "function") _(q)
        }
    }

    function ltq(A, q, K) {
        TQ1(A, q, K), A.onerror(q)
    }
})
// @from(Ln 16255, Col 4)
eqA = x((Sxz, tqA) => {
    var {
        kForOnEventAttribute: Gy6,
        kListener: NQ1
    } = Lp(), lqA = Symbol("kCode"), iqA = Symbol("kData"), nqA = Symbol("kError"), rqA = Symbol("kMessage"), oqA = Symbol("kReason"), vO6 = Symbol("kTarget"), aqA = Symbol("kType"), sqA = Symbol("kWasClean");
    class xn {
        constructor(A) {
            this[vO6] = null, this[aqA] = A
        }
        get target() {
            return this[vO6]
        }
        get type() {
            return this[aqA]
        }
    }
    Object.defineProperty(xn.prototype, "target", {
        enumerable: !0
    });
    Object.defineProperty(xn.prototype, "type", {
        enumerable: !0
    });
    class NO6 extends xn {
        constructor(A, q = {}) {
            super(A);
            this[lqA] = q.code === void 0 ? 0 : q.code, this[oqA] = q.reason === void 0 ? "" : q.reason, this[sqA] = q.wasClean === void 0 ? !1 : q.wasClean
        }
        get code() {
            return this[lqA]
        }
        get reason() {
            return this[oqA]
        }
        get wasClean() {
            return this[sqA]
        }
    }
    Object.defineProperty(NO6.prototype, "code", {
        enumerable: !0
    });
    Object.defineProperty(NO6.prototype, "reason", {
        enumerable: !0
    });
    Object.defineProperty(NO6.prototype, "wasClean", {
        enumerable: !0
    });
    class fy6 extends xn {
        constructor(A, q = {}) {
            super(A);
            this[nqA] = q.error === void 0 ? null : q.error, this[rqA] = q.message === void 0 ? "" : q.message
        }
        get error() {
            return this[nqA]
        }
        get message() {
            return this[rqA]
        }
    }
    Object.defineProperty(fy6.prototype, "error", {
        enumerable: !0
    });
    Object.defineProperty(fy6.prototype, "message", {
        enumerable: !0
    });
    class Z61 extends xn {
        constructor(A, q = {}) {
            super(A);
            this[iqA] = q.data === void 0 ? null : q.data
        }
        get data() {
            return this[iqA]
        }
    }
    Object.defineProperty(Z61.prototype, "data", {
        enumerable: !0
    });
    var itq = {
        addEventListener(A, q, K = {}) {
            for (let z of this.listeners(A))
                if (!K[Gy6] && z[NQ1] === q && !z[Gy6]) return;
            let Y;
            if (A === "message") Y = function(_, w) {
                let O = new Z61("message", {
                    data: w ? _ : _.toString()
                });
                O[vO6] = this, W61(q, this, O)
            };
            else if (A === "close") Y = function(_, w) {
                let O = new NO6("close", {
                    code: _,
                    reason: w.toString(),
                    wasClean: this._closeFrameReceived && this._closeFrameSent
                });
                O[vO6] = this, W61(q, this, O)
            };
            else if (A === "error") Y = function(_) {
                let w = new fy6("error", {
                    error: _,
                    message: _.message
                });
                w[vO6] = this, W61(q, this, w)
            };
            else if (A === "open") Y = function() {
                let _ = new xn("open");
                _[vO6] = this, W61(q, this, _)
            };
            else return;
            if (Y[Gy6] = !!K[Gy6], Y[NQ1] = q, K.once) this.once(A, Y);
            else this.on(A, Y)
        },
        removeEventListener(A, q) {
            for (let K of this.listeners(A))
                if (K[NQ1] === q && !K[Gy6]) {
                    this.removeListener(A, K);
                    break
                }
        }
    };
    tqA.exports = {
        CloseEvent: NO6,
        ErrorEvent: fy6,
        Event: xn,
        EventTarget: itq,
        MessageEvent: Z61
    };

    function W61(A, q, K) {
        if (typeof A === "object" && A.handleEvent) A.handleEvent.call(A, K);
        else A.call(q, K)
    }
})
// @from(Ln 16386, Col 4)
VQ1 = x((Cxz, AKA) => {
    var {
        tokenChars: Ty6
    } = GO6();

    function xx(A, q, K) {
        if (A[q] === void 0) A[q] = [K];
        else A[q].push(K)
    }

    function ntq(A) {
        let q = Object.create(null),
            K = Object.create(null),
            Y = !1,
            z = !1,
            _ = !1,
            w, O, $ = -1,
            H = -1,
            j = -1,
            J = 0;
        for (; J < A.length; J++)
            if (H = A.charCodeAt(J), w === void 0)
                if (j === -1 && Ty6[H] === 1) {
                    if ($ === -1) $ = J
                } else if (J !== 0 && (H === 32 || H === 9)) {
            if (j === -1 && $ !== -1) j = J
        } else if (H === 59 || H === 44) {
            if ($ === -1) throw SyntaxError(`Unexpected character at index ${J}`);
            if (j === -1) j = J;
            let D = A.slice($, j);
            if (H === 44) xx(q, D, K), K = Object.create(null);
            else w = D;
            $ = j = -1
        } else throw SyntaxError(`Unexpected character at index ${J}`);
        else if (O === void 0)
            if (j === -1 && Ty6[H] === 1) {
                if ($ === -1) $ = J
            } else if (H === 32 || H === 9) {
            if (j === -1 && $ !== -1) j = J
        } else if (H === 59 || H === 44) {
            if ($ === -1) throw SyntaxError(`Unexpected character at index ${J}`);
            if (j === -1) j = J;
            if (xx(K, A.slice($, j), !0), H === 44) xx(q, w, K), K = Object.create(null), w = void 0;
            $ = j = -1
        } else if (H === 61 && $ !== -1 && j === -1) O = A.slice($, J), $ = j = -1;
        else throw SyntaxError(`Unexpected character at index ${J}`);
        else if (z) {
            if (Ty6[H] !== 1) throw SyntaxError(`Unexpected character at index ${J}`);
            if ($ === -1) $ = J;
            else if (!Y) Y = !0;
            z = !1
        } else if (_)
            if (Ty6[H] === 1) {
                if ($ === -1) $ = J
            } else if (H === 34 && $ !== -1) _ = !1, j = J;
        else if (H === 92) z = !0;
        else throw SyntaxError(`Unexpected character at index ${J}`);
        else if (H === 34 && A.charCodeAt(J - 1) === 61) _ = !0;
        else if (j === -1 && Ty6[H] === 1) {
            if ($ === -1) $ = J
        } else if ($ !== -1 && (H === 32 || H === 9)) {
            if (j === -1) j = J
        } else if (H === 59 || H === 44) {
            if ($ === -1) throw SyntaxError(`Unexpected character at index ${J}`);
            if (j === -1) j = J;
            let D = A.slice($, j);
            if (Y) D = D.replace(/\\/g, ""), Y = !1;
            if (xx(K, O, D), H === 44) xx(q, w, K), K = Object.create(null), w = void 0;
            O = void 0, $ = j = -1
        } else throw SyntaxError(`Unexpected character at index ${J}`);
        if ($ === -1 || _ || H === 32 || H === 9) throw SyntaxError("Unexpected end of input");
        if (j === -1) j = J;
        let M = A.slice($, j);
        if (w === void 0) xx(q, M, K);
        else {
            if (O === void 0) xx(K, M, !0);
            else if (Y) xx(K, O, M.replace(/\\/g, ""));
            else xx(K, O, M);
            xx(q, w, K)
        }
        return q
    }

    function rtq(A) {
        return Object.keys(A).map((q) => {
            let K = A[q];
            if (!Array.isArray(K)) K = [K];
            return K.map((Y) => {
                return [q].concat(Object.keys(Y).map((z) => {
                    let _ = Y[z];
                    if (!Array.isArray(_)) _ = [_];
                    return _.map((w) => w === !0 ? z : `${z}=${w}`).join("; ")
                })).join("; ")
            }).join(", ")
        }).join(", ")
    }
    AKA.exports = {
        format: rtq,
        parse: ntq
    }
})
// @from(Ln 16487, Col 4)
v61 = x((xxz, MKA) => {
    var otq = x6("events"),
        atq = x6("https"),
        stq = x6("http"),
        YKA = x6("net"),
        ttq = x6("tls"),
        {
            randomBytes: etq,
            createHash: Aeq
        } = x6("crypto"),
        {
            Duplex: Ixz,
            Readable: bxz
        } = x6("stream"),
        {
            URL: kQ1
        } = x6("url"),
        un = Zy6(),
        qeq = fQ1(),
        Keq = vQ1(),
        {
            isBlob: Yeq
        } = GO6(),
        {
            BINARY_TYPES: qKA,
            EMPTY_BUFFER: G61,
            GUID: zeq,
            kForOnEventAttribute: EQ1,
            kListener: _eq,
            kStatusCode: weq,
            kWebSocket: SD,
            NOOP: zKA
        } = Lp(),
        {
            EventTarget: {
                addEventListener: Oeq,
                removeEventListener: $eq
            }
        } = eqA(),
        {
            format: Heq,
            parse: jeq
        } = VQ1(),
        {
            toBuffer: Jeq
        } = Py6(),
        _KA = Symbol("kAborted"),
        yQ1 = [8, 13],
        hp = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"],
        Meq = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    class y5 extends otq {
        constructor(A, q, K) {
            super();
            if (this._binaryType = qKA[0], this._closeCode = 1006, this._closeFrameReceived = !1, this._closeFrameSent = !1, this._closeMessage = G61, this._closeTimer = null, this._errorEmitted = !1, this._extensions = {}, this._paused = !1, this._protocol = "", this._readyState = y5.CONNECTING, this._receiver = null, this._sender = null, this._socket = null, A !== null) {
                if (this._bufferedAmount = 0, this._isServer = !1, this._redirects = 0, q === void 0) q = [];
                else if (!Array.isArray(q))
                    if (typeof q === "object" && q !== null) K = q, q = [];
                    else q = [q];
                wKA(this, A, q, K)
            } else this._autoPong = K.autoPong, this._isServer = !0
        }
        get binaryType() {
            return this._binaryType
        }
        set binaryType(A) {
            if (!qKA.includes(A)) return;
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
        setSocket(A, q, K) {
            let Y = new qeq({
                    allowSynchronousEvents: K.allowSynchronousEvents,
                    binaryType: this.binaryType,
                    extensions: this._extensions,
                    isServer: this._isServer,
                    maxPayload: K.maxPayload,
                    skipUTF8Validation: K.skipUTF8Validation
                }),
                z = new Keq(A, this._extensions, K.generateMask);
            if (this._receiver = Y, this._sender = z, this._socket = A, Y[SD] = this, z[SD] = this, A[SD] = this, Y.on("conclude", Peq), Y.on("drain", Weq), Y.on("error", Zeq), Y.on("message", Geq), Y.on("ping", feq), Y.on("pong", Teq), z.onerror = veq, A.setTimeout) A.setTimeout(0);
            if (A.setNoDelay) A.setNoDelay();
            if (q.length > 0) A.unshift(q);
            A.on("close", HKA), A.on("data", T61), A.on("end", jKA), A.on("error", JKA), this._readyState = y5.OPEN, this.emit("open")
        }
        emitClose() {
            if (!this._socket) {
                this._readyState = y5.CLOSED, this.emit("close", this._closeCode, this._closeMessage);
                return
            }
            if (this._extensions[un.extensionName]) this._extensions[un.extensionName].cleanup();
            this._receiver.removeAllListeners(), this._readyState = y5.CLOSED, this.emit("close", this._closeCode, this._closeMessage)
        }
        close(A, q) {
            if (this.readyState === y5.CLOSED) return;
            if (this.readyState === y5.CONNECTING) {
                XV(this, this._req, "WebSocket was closed before the connection was established");
                return
            }
            if (this.readyState === y5.CLOSING) {
                if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) this._socket.end();
                return
            }
            this._readyState = y5.CLOSING, this._sender.close(A, q, !this._isServer, (K) => {
                if (K) return;
                if (this._closeFrameSent = !0, this._closeFrameReceived || this._receiver._writableState.errorEmitted) this._socket.end()
            }), $KA(this)
        }
        pause() {
            if (this.readyState === y5.CONNECTING || this.readyState === y5.CLOSED) return;
            this._paused = !0, this._socket.pause()
        }
        ping(A, q, K) {
            if (this.readyState === y5.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
            if (typeof A === "function") K = A, A = q = void 0;
            else if (typeof q === "function") K = q, q = void 0;
            if (typeof A === "number") A = A.toString();
            if (this.readyState !== y5.OPEN) {
                LQ1(this, A, K);
                return
            }
            if (q === void 0) q = !this._isServer;
            this._sender.ping(A || G61, q, K)
        }
        pong(A, q, K) {
            if (this.readyState === y5.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
            if (typeof A === "function") K = A, A = q = void 0;
            else if (typeof q === "function") K = q, q = void 0;
            if (typeof A === "number") A = A.toString();
            if (this.readyState !== y5.OPEN) {
                LQ1(this, A, K);
                return
            }
            if (q === void 0) q = !this._isServer;
            this._sender.pong(A || G61, q, K)
        }
        resume() {
            if (this.readyState === y5.CONNECTING || this.readyState === y5.CLOSED) return;
            if (this._paused = !1, !this._receiver._writableState.needDrain) this._socket.resume()
        }
        send(A, q, K) {
            if (this.readyState === y5.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
            if (typeof q === "function") K = q, q = {};
            if (typeof A === "number") A = A.toString();
            if (this.readyState !== y5.OPEN) {
                LQ1(this, A, K);
                return
            }
            let Y = {
                binary: typeof A !== "string",
                mask: !this._isServer,
                compress: !0,
                fin: !0,
                ...q
            };
            if (!this._extensions[un.extensionName]) Y.compress = !1;
            this._sender.send(A || G61, Y, K)
        }
        terminate() {
            if (this.readyState === y5.CLOSED) return;
            if (this.readyState === y5.CONNECTING) {
                XV(this, this._req, "WebSocket was closed before the connection was established");
                return
            }
            if (this._socket) this._readyState = y5.CLOSING, this._socket.destroy()
        }
    }
    Object.defineProperty(y5, "CONNECTING", {
        enumerable: !0,
        value: hp.indexOf("CONNECTING")
    });
    Object.defineProperty(y5.prototype, "CONNECTING", {
        enumerable: !0,
        value: hp.indexOf("CONNECTING")
    });
    Object.defineProperty(y5, "OPEN", {
        enumerable: !0,
        value: hp.indexOf("OPEN")
    });
    Object.defineProperty(y5.prototype, "OPEN", {
        enumerable: !0,
        value: hp.indexOf("OPEN")
    });
    Object.defineProperty(y5, "CLOSING", {
        enumerable: !0,
        value: hp.indexOf("CLOSING")
    });
    Object.defineProperty(y5.prototype, "CLOSING", {
        enumerable: !0,
        value: hp.indexOf("CLOSING")
    });
    Object.defineProperty(y5, "CLOSED", {
        enumerable: !0,
        value: hp.indexOf("CLOSED")
    });
    Object.defineProperty(y5.prototype, "CLOSED", {
        enumerable: !0,
        value: hp.indexOf("CLOSED")
    });
    ["binaryType", "bufferedAmount", "extensions", "isPaused", "protocol", "readyState", "url"].forEach((A) => {
        Object.defineProperty(y5.prototype, A, {
            enumerable: !0
        })
    });
    ["open", "error", "close", "message"].forEach((A) => {
        Object.defineProperty(y5.prototype, `on${A}`, {
            enumerable: !0,
            get() {
                for (let q of this.listeners(A))
                    if (q[EQ1]) return q[_eq];
                return null
            },
            set(q) {
                for (let K of this.listeners(A))
                    if (K[EQ1]) {
                        this.removeListener(A, K);
                        break
                    } if (typeof q !== "function") return;
                this.addEventListener(A, q, {
                    [EQ1]: !0
                })
            }
        })
    });
    y5.prototype.addEventListener = Oeq;
    y5.prototype.removeEventListener = $eq;
    MKA.exports = y5;

    function wKA(A, q, K, Y) {
        let z = {
            allowSynchronousEvents: !0,
            autoPong: !0,
            protocolVersion: yQ1[1],
            maxPayload: 104857600,
            skipUTF8Validation: !1,
            perMessageDeflate: !0,
            followRedirects: !1,
            maxRedirects: 10,
            ...Y,
            socketPath: void 0,
            hostname: void 0,
            protocol: void 0,
            timeout: void 0,
            method: "GET",
            host: void 0,
            path: void 0,
            port: void 0
        };
        if (A._autoPong = z.autoPong, !yQ1.includes(z.protocolVersion)) throw RangeError(`Unsupported protocol version: ${z.protocolVersion} (supported versions: ${yQ1.join(", ")})`);
        let _;
        if (q instanceof kQ1) _ = q;
        else try {
            _ = new kQ1(q)
        } catch (P) {
            throw SyntaxError(`Invalid URL: ${q}`)
        }
        if (_.protocol === "http:") _.protocol = "ws:";
        else if (_.protocol === "https:") _.protocol = "wss:";
        A._url = _.href;
        let w = _.protocol === "wss:",
            O = _.protocol === "ws+unix:",
            $;
        if (_.protocol !== "ws:" && !w && !O) $ = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
        else if (O && !_.pathname) $ = "The URL's pathname is empty";
        else if (_.hash) $ = "The URL contains a fragment identifier";
        if ($) {
            let P = SyntaxError($);
            if (A._redirects === 0) throw P;
            else {
                f61(A, P);
                return
            }
        }
        let H = w ? 443 : 80,
            j = etq(16).toString("base64"),
            J = w ? atq.request : stq.request,
            M = new Set,
            D;
        if (z.createConnection = z.createConnection || (w ? Xeq : Deq), z.defaultPort = z.defaultPort || H, z.port = _.port || H, z.host = _.hostname.startsWith("[") ? _.hostname.slice(1, -1) : _.hostname, z.headers = {
                ...z.headers,
                "Sec-WebSocket-Version": z.protocolVersion,
                "Sec-WebSocket-Key": j,
                Connection: "Upgrade",
                Upgrade: "websocket"
            }, z.path = _.pathname + _.search, z.timeout = z.handshakeTimeout, z.perMessageDeflate) D = new un(z.perMessageDeflate !== !0 ? z.perMessageDeflate : {}, !1, z.maxPayload), z.headers["Sec-WebSocket-Extensions"] = Heq({
            [un.extensionName]: D.offer()
        });
        if (K.length) {
            for (let P of K) {
                if (typeof P !== "string" || !Meq.test(P) || M.has(P)) throw SyntaxError("An invalid or duplicated subprotocol was specified");
                M.add(P)
            }
            z.headers["Sec-WebSocket-Protocol"] = K.join(",")
        }
        if (z.origin)
            if (z.protocolVersion < 13) z.headers["Sec-WebSocket-Origin"] = z.origin;
            else z.headers.Origin = z.origin;
        if (_.username || _.password) z.auth = `${_.username}:${_.password}`;
        if (O) {
            let P = z.path.split(":");
            z.socketPath = P[0], z.path = P[1]
        }
        let X;
        if (z.followRedirects) {
            if (A._redirects === 0) {
                A._originalIpc = O, A._originalSecure = w, A._originalHostOrSocketPath = O ? z.socketPath : _.host;
                let P = Y && Y.headers;
                if (Y = {
                        ...Y,
                        headers: {}
                    }, P)
                    for (let [W, Z] of Object.entries(P)) Y.headers[W.toLowerCase()] = Z
            } else if (A.listenerCount("redirect") === 0) {
                let P = O ? A._originalIpc ? z.socketPath === A._originalHostOrSocketPath : !1 : A._originalIpc ? !1 : _.host === A._originalHostOrSocketPath;
                if (!P || A._originalSecure && !w) {
                    if (delete z.headers.authorization, delete z.headers.cookie, !P) delete z.headers.host;
                    z.auth = void 0
                }
            }
            if (z.auth && !Y.headers.authorization) Y.headers.authorization = "Basic " + Buffer.from(z.auth).toString("base64");
            if (X = A._req = J(z), A._redirects) A.emit("redirect", A.url, X)
        } else X = A._req = J(z);
        if (z.timeout) X.on("timeout", () => {
            XV(A, X, "Opening handshake has timed out")
        });
        if (X.on("error", (P) => {
                if (X === null || X[_KA]) return;
                X = A._req = null, f61(A, P)
            }), X.on("response", (P) => {
                let W = P.headers.location,
                    Z = P.statusCode;
                if (W && z.followRedirects && Z >= 300 && Z < 400) {
                    if (++A._redirects > z.maxRedirects) {
                        XV(A, X, "Maximum redirects exceeded");
                        return
                    }
                    X.abort();
                    let G;
                    try {
                        G = new kQ1(W, q)
                    } catch (f) {
                        let v = SyntaxError(`Invalid URL: ${W}`);
                        f61(A, v);
                        return
                    }
                    wKA(A, G, K, Y)
                } else if (!A.emit("unexpected-response", X, P)) XV(A, X, `Unexpected server response: ${P.statusCode}`)
            }), X.on("upgrade", (P, W, Z) => {
                if (A.emit("upgrade", P), A.readyState !== y5.CONNECTING) return;
                X = A._req = null;
                let G = P.headers.upgrade;
                if (G === void 0 || G.toLowerCase() !== "websocket") {
                    XV(A, W, "Invalid Upgrade header");
                    return
                }
                let f = Aeq("sha1").update(j + zeq).digest("base64");
                if (P.headers["sec-websocket-accept"] !== f) {
                    XV(A, W, "Invalid Sec-WebSocket-Accept header");
                    return
                }
                let v = P.headers["sec-websocket-protocol"],
                    N;
                if (v !== void 0) {
                    if (!M.size) N = "Server sent a subprotocol but none was requested";
                    else if (!M.has(v)) N = "Server sent an invalid subprotocol"
                } else if (M.size) N = "Server sent no subprotocol";
                if (N) {
                    XV(A, W, N);
                    return
                }
                if (v) A._protocol = v;
                let V = P.headers["sec-websocket-extensions"];
                if (V !== void 0) {
                    if (!D) {
                        XV(A, W, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
                        return
                    }
                    let L;
                    try {
                        L = jeq(V)
                    } catch (R) {
                        XV(A, W, "Invalid Sec-WebSocket-Extensions header");
                        return
                    }
                    let h = Object.keys(L);
                    if (h.length !== 1 || h[0] !== un.extensionName) {
                        XV(A, W, "Server indicated an extension that was not requested");
                        return
                    }
                    try {
                        D.accept(L[un.extensionName])
                    } catch (R) {
                        XV(A, W, "Invalid Sec-WebSocket-Extensions header");
                        return
                    }
                    A._extensions[un.extensionName] = D
                }
                A.setSocket(W, Z, {
                    allowSynchronousEvents: z.allowSynchronousEvents,
                    generateMask: z.generateMask,
                    maxPayload: z.maxPayload,
                    skipUTF8Validation: z.skipUTF8Validation
                })
            }), z.finishRequest) z.finishRequest(X, A);
        else X.end()
    }

    function f61(A, q) {
        A._readyState = y5.CLOSING, A._errorEmitted = !0, A.emit("error", q), A.emitClose()
    }

    function Deq(A) {
        return A.path = A.socketPath, YKA.connect(A)
    }

    function Xeq(A) {
        if (A.path = void 0, !A.servername && A.servername !== "") A.servername = YKA.isIP(A.host) ? "" : A.host;
        return ttq.connect(A)
    }

    function XV(A, q, K) {
        A._readyState = y5.CLOSING;
        let Y = Error(K);
        if (Error.captureStackTrace(Y, XV), q.setHeader) {
            if (q[_KA] = !0, q.abort(), q.socket && !q.socket.destroyed) q.socket.destroy();
            process.nextTick(f61, A, Y)
        } else q.destroy(Y), q.once("error", A.emit.bind(A, "error")), q.once("close", A.emitClose.bind(A))
    }

    function LQ1(A, q, K) {
        if (q) {
            let Y = Yeq(q) ? q.size : Jeq(q).length;
            if (A._socket) A._sender._bufferedBytes += Y;
            else A._bufferedAmount += Y
        }
        if (K) {
            let Y = Error(`WebSocket is not open: readyState ${A.readyState} (${hp[A.readyState]})`);
            process.nextTick(K, Y)
        }
    }

    function Peq(A, q) {
        let K = this[SD];
        if (K._closeFrameReceived = !0, K._closeMessage = q, K._closeCode = A, K._socket[SD] === void 0) return;
        if (K._socket.removeListener("data", T61), process.nextTick(OKA, K._socket), A === 1005) K.close();
        else K.close(A, q)
    }

    function Weq() {
        let A = this[SD];
        if (!A.isPaused) A._socket.resume()
    }

    function Zeq(A) {
        let q = this[SD];
        if (q._socket[SD] !== void 0) q._socket.removeListener("data", T61), process.nextTick(OKA, q._socket), q.close(A[weq]);
        if (!q._errorEmitted) q._errorEmitted = !0, q.emit("error", A)
    }

    function KKA() {
        this[SD].emitClose()
    }

    function Geq(A, q) {
        this[SD].emit("message", A, q)
    }

    function feq(A) {
        let q = this[SD];
        if (q._autoPong) q.pong(A, !this._isServer, zKA);
        q.emit("ping", A)
    }

    function Teq(A) {
        this[SD].emit("pong", A)
    }

    function OKA(A) {
        A.resume()
    }

    function veq(A) {
        let q = this[SD];
        if (q.readyState === y5.CLOSED) return;
        if (q.readyState === y5.OPEN) q._readyState = y5.CLOSING, $KA(q);
        if (this._socket.end(), !q._errorEmitted) q._errorEmitted = !0, q.emit("error", A)
    }

    function $KA(A) {
        A._closeTimer = setTimeout(A._socket.destroy.bind(A._socket), 30000)
    }

    function HKA() {
        let A = this[SD];
        this.removeListener("close", HKA), this.removeListener("data", T61), this.removeListener("end", jKA), A._readyState = y5.CLOSING;
        let q;
        if (!this._readableState.endEmitted && !A._closeFrameReceived && !A._receiver._writableState.errorEmitted && (q = A._socket.read()) !== null) A._receiver.write(q);
        if (A._receiver.end(), this[SD] = void 0, clearTimeout(A._closeTimer), A._receiver._writableState.finished || A._receiver._writableState.errorEmitted) A.emitClose();
        else A._receiver.on("error", KKA), A._receiver.on("finish", KKA)
    }

    function T61(A) {
        if (!this[SD]._receiver.write(A)) this.pause()
    }

    function jKA() {
        let A = this[SD];
        A._readyState = y5.CLOSING, A._receiver.end(), this.end()
    }

    function JKA() {
        let A = this[SD];
        if (this.removeListener("error", JKA), this.on("error", zKA), A) A._readyState = y5.CLOSING, this.destroy()
    }
})
// @from(Ln 17031, Col 4)
WKA = x((mxz, PKA) => {
    var uxz = v61(),
        {
            Duplex: Neq
        } = x6("stream");

    function DKA(A) {
        A.emit("close")
    }

    function Veq() {
        if (!this.destroyed && this._writableState.finished) this.destroy()
    }

    function XKA(A) {
        if (this.removeListener("error", XKA), this.destroy(), this.listenerCount("error") === 0) this.emit("error", A)
    }

    function keq(A, q) {
        let K = !0,
            Y = new Neq({
                ...q,
                autoDestroy: !1,
                emitClose: !1,
                objectMode: !1,
                writableObjectMode: !1
            });
        return A.on("message", function(_, w) {
            let O = !w && Y._readableState.objectMode ? _.toString() : _;
            if (!Y.push(O)) A.pause()
        }), A.once("error", function(_) {
            if (Y.destroyed) return;
            K = !1, Y.destroy(_)
        }), A.once("close", function() {
            if (Y.destroyed) return;
            Y.push(null)
        }), Y._destroy = function(z, _) {
            if (A.readyState === A.CLOSED) {
                _(z), process.nextTick(DKA, Y);
                return
            }
            let w = !1;
            if (A.once("error", function($) {
                    w = !0, _($)
                }), A.once("close", function() {
                    if (!w) _(z);
                    process.nextTick(DKA, Y)
                }), K) A.terminate()
        }, Y._final = function(z) {
            if (A.readyState === A.CONNECTING) {
                A.once("open", function() {
                    Y._final(z)
                });
                return
            }
            if (A._socket === null) return;
            if (A._socket._writableState.finished) {
                if (z(), Y._readableState.endEmitted) Y.destroy()
            } else A._socket.once("finish", function() {
                z()
            }), A.close()
        }, Y._read = function() {
            if (A.isPaused) A.resume()
        }, Y._write = function(z, _, w) {
            if (A.readyState === A.CONNECTING) {
                A.once("open", function() {
                    Y._write(z, _, w)
                });
                return
            }
            A.send(z, w)
        }, Y.on("end", Veq), Y.on("error", XKA), Y
    }
    PKA.exports = keq
})
// @from(Ln 17106, Col 4)
GKA = x((Bxz, ZKA) => {
    var {
        tokenChars: Eeq
    } = GO6();

    function yeq(A) {
        let q = new Set,
            K = -1,
            Y = -1,
            z = 0;
        for (z; z < A.length; z++) {
            let w = A.charCodeAt(z);
            if (Y === -1 && Eeq[w] === 1) {
                if (K === -1) K = z
            } else if (z !== 0 && (w === 32 || w === 9)) {
                if (Y === -1 && K !== -1) Y = z
            } else if (w === 44) {
                if (K === -1) throw SyntaxError(`Unexpected character at index ${z}`);
                if (Y === -1) Y = z;
                let O = A.slice(K, Y);
                if (q.has(O)) throw SyntaxError(`The "${O}" subprotocol is duplicated`);
                q.add(O), K = Y = -1
            } else throw SyntaxError(`Unexpected character at index ${z}`)
        }
        if (K === -1 || Y !== -1) throw SyntaxError("Unexpected end of input");
        let _ = A.slice(K, z);
        if (q.has(_)) throw SyntaxError(`The "${_}" subprotocol is duplicated`);
        return q.add(_), q
    }
    ZKA.exports = {
        parse: yeq
    }
})
// @from(Ln 17139, Col 4)
VKA = x((Fxz, NKA) => {
    var Leq = x6("events"),
        N61 = x6("http"),
        {
            Duplex: gxz
        } = x6("stream"),
        {
            createHash: Req
        } = x6("crypto"),
        fKA = VQ1(),
        NA6 = Zy6(),
        heq = GKA(),
        Seq = v61(),
        {
            GUID: Ceq,
            kWebSocket: Ieq
        } = Lp(),
        beq = /^[+/0-9A-Za-z]{22}==$/;
    class vKA extends Leq {
        constructor(A, q) {
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
                    WebSocket: Seq,
                    ...A
                }, A.port == null && !A.server && !A.noServer || A.port != null && (A.server || A.noServer) || A.server && A.noServer) throw TypeError('One and only one of the "port", "server", or "noServer" options must be specified');
            if (A.port != null) this._server = N61.createServer((K, Y) => {
                let z = N61.STATUS_CODES[426];
                Y.writeHead(426, {
                    "Content-Length": z.length,
                    "Content-Type": "text/plain"
                }), Y.end(z)
            }), this._server.listen(A.port, A.host, A.backlog, q);
            else if (A.server) this._server = A.server;
            if (this._server) {
                let K = this.emit.bind(this, "connection");
                this._removeListeners = xeq(this._server, {
                    listening: this.emit.bind(this, "listening"),
                    error: this.emit.bind(this, "error"),
                    upgrade: (Y, z, _) => {
                        this.handleUpgrade(Y, z, _, K)
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
                process.nextTick(vy6, this);
                return
            }
            if (A) this.once("close", A);
            if (this._state === 1) return;
            if (this._state = 1, this.options.noServer || this.options.server) {
                if (this._server) this._removeListeners(), this._removeListeners = this._server = null;
                if (this.clients)
                    if (!this.clients.size) process.nextTick(vy6, this);
                    else this._shouldEmitClose = !0;
                else process.nextTick(vy6, this)
            } else {
                let q = this._server;
                this._removeListeners(), this._removeListeners = this._server = null, q.close(() => {
                    vy6(this)
                })
            }
        }
        shouldHandle(A) {
            if (this.options.path) {
                let q = A.url.indexOf("?");
                if ((q !== -1 ? A.url.slice(0, q) : A.url) !== this.options.path) return !1
            }
            return !0
        }
        handleUpgrade(A, q, K, Y) {
            q.on("error", TKA);
            let z = A.headers["sec-websocket-key"],
                _ = A.headers.upgrade,
                w = +A.headers["sec-websocket-version"];
            if (A.method !== "GET") {
                VA6(this, A, q, 405, "Invalid HTTP method");
                return
            }
            if (_ === void 0 || _.toLowerCase() !== "websocket") {
                VA6(this, A, q, 400, "Invalid Upgrade header");
                return
            }
            if (z === void 0 || !beq.test(z)) {
                VA6(this, A, q, 400, "Missing or invalid Sec-WebSocket-Key header");
                return
            }
            if (w !== 13 && w !== 8) {
                VA6(this, A, q, 400, "Missing or invalid Sec-WebSocket-Version header", {
                    "Sec-WebSocket-Version": "13, 8"
                });
                return
            }
            if (!this.shouldHandle(A)) {
                Ny6(q, 400);
                return
            }
            let O = A.headers["sec-websocket-protocol"],
                $ = new Set;
            if (O !== void 0) try {
                $ = heq.parse(O)
            } catch (J) {
                VA6(this, A, q, 400, "Invalid Sec-WebSocket-Protocol header");
                return
            }
            let H = A.headers["sec-websocket-extensions"],
                j = {};
            if (this.options.perMessageDeflate && H !== void 0) {
                let J = new NA6(this.options.perMessageDeflate, !0, this.options.maxPayload);
                try {
                    let M = fKA.parse(H);
                    if (M[NA6.extensionName]) J.accept(M[NA6.extensionName]), j[NA6.extensionName] = J
                } catch (M) {
                    VA6(this, A, q, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header");
                    return
                }
            }
            if (this.options.verifyClient) {
                let J = {
                    origin: A.headers[`${w===8?"sec-websocket-origin":"origin"}`],
                    secure: !!(A.socket.authorized || A.socket.encrypted),
                    req: A
                };
                if (this.options.verifyClient.length === 2) {
                    this.options.verifyClient(J, (M, D, X, P) => {
                        if (!M) return Ny6(q, D || 401, X, P);
                        this.completeUpgrade(j, z, $, A, q, K, Y)
                    });
                    return
                }
                if (!this.options.verifyClient(J)) return Ny6(q, 401)
            }
            this.completeUpgrade(j, z, $, A, q, K, Y)
        }
        completeUpgrade(A, q, K, Y, z, _, w) {
            if (!z.readable || !z.writable) return z.destroy();
            if (z[Ieq]) throw Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
            if (this._state > 0) return Ny6(z, 503);
            let $ = ["HTTP/1.1 101 Switching Protocols", "Upgrade: websocket", "Connection: Upgrade", `Sec-WebSocket-Accept: ${Req("sha1").update(q+Ceq).digest("base64")}`],
                H = new this.options.WebSocket(null, void 0, this.options);
            if (K.size) {
                let j = this.options.handleProtocols ? this.options.handleProtocols(K, Y) : K.values().next().value;
                if (j) $.push(`Sec-WebSocket-Protocol: ${j}`), H._protocol = j
            }
            if (A[NA6.extensionName]) {
                let j = A[NA6.extensionName].params,
                    J = fKA.format({
                        [NA6.extensionName]: [j]
                    });
                $.push(`Sec-WebSocket-Extensions: ${J}`), H._extensions = A
            }
            if (this.emit("headers", $, Y), z.write($.concat(`\r
`).join(`\r
`)), z.removeListener("error", TKA), H.setSocket(z, _, {
                    allowSynchronousEvents: this.options.allowSynchronousEvents,
                    maxPayload: this.options.maxPayload,
                    skipUTF8Validation: this.options.skipUTF8Validation
                }), this.clients) this.clients.add(H), H.on("close", () => {
                if (this.clients.delete(H), this._shouldEmitClose && !this.clients.size) process.nextTick(vy6, this)
            });
            w(H, Y)
        }
    }
    NKA.exports = vKA;

    function xeq(A, q) {
        for (let K of Object.keys(q)) A.on(K, q[K]);
        return function() {
            for (let Y of Object.keys(q)) A.removeListener(Y, q[Y])
        }
    }

    function vy6(A) {
        A._state = 2, A.emit("close")
    }

    function TKA() {
        this.destroy()
    }

    function Ny6(A, q, K, Y) {
        K = K || N61.STATUS_CODES[q], Y = {
            Connection: "close",
            "Content-Type": "text/html",
            "Content-Length": Buffer.byteLength(K),
            ...Y
        }, A.once("finish", A.destroy), A.end(`HTTP/1.1 ${q} ${N61.STATUS_CODES[q]}\r
` + Object.keys(Y).map((z) => `${z}: ${Y[z]}`).join(`\r
`) + `\r
\r
` + K)
    }

    function VA6(A, q, K, Y, z, _) {
        if (A.listenerCount("wsClientError")) {
            let w = Error(z);
            Error.captureStackTrace(w, VA6), A.emit("wsClientError", w, K, q)
        } else Ny6(K, Y, z, _)
    }
})
// @from(Ln 17365, Col 4)
V61 = {}
// @from(Ln 17374, Col 4)
kKA
// @from(Ln 17374, Col 9)
EKA
// @from(Ln 17374, Col 14)
yKA
// @from(Ln 17374, Col 19)
RQ1
// @from(Ln 17374, Col 24)
LKA
// @from(Ln 17374, Col 29)
HP
// @from(Ln 17375, Col 4)
VO6 = E(() => {
    kKA = t(WKA(), 1), EKA = t(fQ1(), 1), yKA = t(vQ1(), 1), RQ1 = t(v61(), 1), LKA = t(VKA(), 1), HP = RQ1.default
})
// @from(Ln 17391, Col 0)
function geq(A) {
    return "result" in A || "error" in A
}
// @from(Ln 17395, Col 0)
function Feq(A) {
    return "method" in A && typeof A.method === "string"
}
// @from(Ln 17398, Col 0)
class hKA {
    socket = null;
    connected = !1;
    connecting = !1;
    responseCallback = null;
    notificationHandler = null;
    responseBuffer = Buffer.alloc(0);
    reconnectAttempts = 0;
    maxReconnectAttempts = 10;
    reconnectDelay = 1000;
    reconnectTimer = null;
    context;
    disableAutoReconnect = !1;
    constructor(A) {
        this.context = A
    }
    async connect() {
        let {
            serverName: A,
            logger: q
        } = this.context;
        if (this.connecting) {
            q.info(`[${A}] Already connecting, skipping duplicate attempt`);
            return
        }
        this.closeSocket(), this.connecting = !0;
        let K = this.context.getSocketPath?.() ?? this.context.socketPath;
        q.info(`[${A}] Attempting to connect to: ${K}`);
        try {
            await this.validateSocketSecurity(K)
        } catch (z) {
            this.connecting = !1, q.info(`[${A}] Security validation failed:`, z);
            return
        }
        this.socket = ueq(K);
        let Y = setTimeout(() => {
            if (!this.connected) q.info(`[${A}] Connection attempt timed out after 5000ms`), this.closeSocket(), this.scheduleReconnect()
        }, 5000);
        this.socket.on("connect", () => {
            clearTimeout(Y), this.connected = !0, this.connecting = !1, this.reconnectAttempts = 0, q.info(`[${A}] Successfully connected to bridge server`)
        }), this.socket.on("data", (z) => {
            this.responseBuffer = Buffer.concat([this.responseBuffer, z]);
            while (this.responseBuffer.length >= 4) {
                let _ = this.responseBuffer.readUInt32LE(0);
                if (this.responseBuffer.length < 4 + _) break;
                let w = this.responseBuffer.slice(4, 4 + _);
                this.responseBuffer = this.responseBuffer.slice(4 + _);
                try {
                    let O = JSON.parse(w.toString("utf-8"));
                    if (Feq(O)) {
                        if (q.info(`[${A}] Received notification: ${O.method}`), this.notificationHandler) this.notificationHandler(O)
                    } else if (geq(O)) q.info(`[${A}] Received tool response: ${O}`), this.handleResponse(O);
                    else q.info(`[${A}] Received unknown message: ${O}`)
                } catch (O) {
                    q.info(`[${A}] Failed to parse message:`, O)
                }
            }
        }), this.socket.on("error", (z) => {
            if (clearTimeout(Y), q.info(`[${A}] Socket error (code: ${z.code}):`, z), this.connected = !1, this.connecting = !1, z.code && ["ECONNREFUSED", "ECONNRESET", "EPIPE", "ENOENT", "EOPNOTSUPP", "ECONNABORTED"].includes(z.code)) this.scheduleReconnect()
        }), this.socket.on("close", () => {
            clearTimeout(Y), this.connected = !1, this.connecting = !1, this.scheduleReconnect()
        })
    }
    scheduleReconnect() {
        let {
            serverName: A,
            logger: q
        } = this.context;
        if (this.disableAutoReconnect) return;
        if (this.reconnectTimer) {
            q.info(`[${A}] Reconnect already scheduled, skipping`);
            return
        }
        this.reconnectAttempts++;
        let K = 100;
        if (this.reconnectAttempts > K) {
            q.info(`[${A}] Giving up after ${K} attempts. Will retry on next tool call.`), this.reconnectAttempts = 0;
            return
        }
        let Y = Math.min(this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1), 30000);
        if (this.reconnectAttempts <= this.maxReconnectAttempts) q.info(`[${A}] Reconnecting in ${Math.round(Y)}ms (attempt ${this.reconnectAttempts})`);
        else if (this.reconnectAttempts % 10 === 0) q.info(`[${A}] Still polling for native host (attempt ${this.reconnectAttempts})`);
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null, this.connect()
        }, Y)
    }
    handleResponse(A) {
        if (this.responseCallback) {
            let q = this.responseCallback;
            this.responseCallback = null, q(A)
        }
    }
    setNotificationHandler(A) {
        this.notificationHandler = A
    }
    async ensureConnected() {
        let {
            serverName: A
        } = this.context;
        if (this.connected && this.socket) return !0;
        if (!this.socket && !this.connecting) await this.connect();
        return new Promise((q, K) => {
            let Y = null,
                z = setTimeout(() => {
                    if (Y) clearTimeout(Y);
                    K(new OG(`[${A}] Connection attempt timed out after 5000ms`))
                }, 5000),
                _ = () => {
                    if (this.connected) clearTimeout(z), q(!0);
                    else Y = setTimeout(_, 500)
                };
            _()
        })
    }
    async sendRequest(A, q = 30000) {
        let {
            serverName: K
        } = this.context;
        if (!this.socket) throw new OG(`[${K}] Cannot send request: not connected`);
        let Y = this.socket;
        return new Promise((z, _) => {
            let w = setTimeout(() => {
                this.responseCallback = null, _(new OG(`[${K}] Tool request timed out after ${q}ms`))
            }, q);
            this.responseCallback = (J) => {
                clearTimeout(w), z(J)
            };
            let O = JSON.stringify(A),
                $ = Buffer.from(O, "utf-8"),
                H = Buffer.allocUnsafe(4);
            H.writeUInt32LE($.length, 0);
            let j = Buffer.concat([H, $]);
            Y.write(j)
        })
    }
    async callTool(A, q, K) {
        let Y = {
            method: "execute_tool",
            params: {
                client_id: this.context.clientTypeId,
                tool: A,
                args: q
            }
        };
        return this.sendRequestWithRetry(Y)
    }
    async sendRequestWithRetry(A) {
        let {
            serverName: q,
            logger: K
        } = this.context;
        try {
            return await this.sendRequest(A)
        } catch (Y) {
            if (!(Y instanceof OG)) throw Y;
            return K.info(`[${q}] Connection error, forcing reconnect and retrying: ${Y.message}`), this.closeSocket(), await this.ensureConnected(), await this.sendRequest(A)
        }
    }
    async setPermissionMode(A, q) {}
    isConnected() {
        return this.connected
    }
    closeSocket() {
        if (this.socket) this.socket.removeAllListeners(), this.socket.end(), this.socket.destroy(), this.socket = null;
        this.connected = !1, this.connecting = !1
    }
    cleanup() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
        this.closeSocket(), this.reconnectAttempts = 0, this.responseBuffer = Buffer.alloc(0), this.responseCallback = null
    }
    disconnect() {
        this.cleanup()
    }
    async validateSocketSecurity(A) {
        let {
            serverName: q,
            logger: K
        } = this.context;
        if (meq() === "win32") return;
        try {
            let Y = Beq(A);
            if ((Y.split("/").pop() || "").startsWith("claude-mcp-browser-bridge-")) try {
                let H = await RKA.stat(Y);
                if (H.isDirectory()) {
                    let j = H.mode & 511;
                    if (j !== 448) throw Error(`[${q}] Insecure socket directory permissions: ${j.toString(8)} (expected 0700). Directory may have been tampered with.`);
                    let J = process.getuid?.();
                    if (J !== void 0 && H.uid !== J) throw Error(`Socket directory not owned by current user (uid: ${J}, dir uid: ${H.uid}). Potential security risk.`)
                }
            } catch (H) {
                if (H.code !== "ENOENT") throw H
            }
            let w = await RKA.stat(A);
            if (!w.isSocket()) throw Error(`[${q}] Path exists but it's not a socket: ${A}`);
            let O = w.mode & 511;
            if (O !== 384) throw Error(`[${q}] Insecure socket permissions: ${O.toString(8)} (expected 0600). Socket may have been tampered with.`);
            let $ = process.getuid?.();
            if ($ !== void 0 && w.uid !== $) throw Error(`Socket not owned by current user (uid: ${$}, socket uid: ${w.uid}). Potential security risk.`);
            K.info(`[${q}] Socket security validation passed`)
        } catch (Y) {
            if (Y.code === "ENOENT") {
                K.info(`[${q}] Socket not found, will be created by server`);
                return
            }
            throw Y
        }
    }
}
// @from(Ln 17607, Col 0)
function k61(A) {
    return new hKA(A)
}
// @from(Ln 17610, Col 4)
OG
// @from(Ln 17611, Col 4)
Vy6 = E(() => {
    OG = class OG extends Error {
        constructor(A) {
            super(A);
            this.name = "SocketConnectionError"
        }
    }
})
// @from(Ln 17620, Col 0)
function E61() {
    return process.platform === "darwin" ? "macOS" : process.platform === "win32" ? "Windows" : "Linux"
}
// @from(Ln 17623, Col 0)
class y61 {
    ws = null;
    connected = !1;
    authenticated = !1;
    connecting = !1;
    reconnectTimer = null;
    reconnectAttempts = 0;
    pendingCalls = new Map;
    notificationHandler = null;
    context;
    permissionMode = "ask";
    allowedDomains;
    tabsContextCollectionTimeoutMs = 2000;
    toolCallTimeoutMs = 120000;
    connectionStartTime = null;
    connectionEstablishedTime = null;
    selectedDeviceId;
    discoveryComplete = !1;
    discoveryPromise = null;
    pendingDiscovery = null;
    previousSelectedDeviceId;
    peerConnectedWaiters = [];
    pendingPairingRequestId;
    pairingInProgress = !1;
    persistedDeviceId;
    pendingSwitchResolve = null;
    constructor(A) {
        if (this.context = A, A.initialPermissionMode) this.permissionMode = A.initialPermissionMode
    }
    async ensureConnected() {
        let {
            logger: A,
            serverName: q
        } = this.context;
        if (A.info(`[${q}] ensureConnected called, connected=${this.connected}, authenticated=${this.authenticated}, wsState=${this.ws?.readyState}`), this.connected && this.authenticated && this.ws?.readyState === HP.OPEN) return A.info(`[${q}] Already connected and authenticated`), !0;
        if (!this.connecting) A.info(`[${q}] Not connecting, starting connection...`), await this.connect();
        else A.info(`[${q}] Already connecting, waiting...`);
        return new Promise((K) => {
            let Y = setTimeout(() => {
                    A.info(`[${q}] Connection timeout, connected=${this.connected}, authenticated=${this.authenticated}`), K(!1)
                }, 1e4),
                z = () => {
                    if (this.connected && this.authenticated) A.info(`[${q}] Connection successful`), clearTimeout(Y), K(!0);
                    else if (!this.connecting) A.info(`[${q}] No longer connecting, giving up`), clearTimeout(Y), K(!1);
                    else setTimeout(z, 200)
                };
            z()
        })
    }
    async callTool(A, q, K) {
        let {
            logger: Y,
            serverName: z,
            trackEvent: _
        } = this.context;
        if (!this.ws || this.ws.readyState !== HP.OPEN) throw new OG(`[${z}] Bridge not connected`);
        if (!this.selectedDeviceId && !this.discoveryComplete) this.discoveryPromise ??= this.discoverAndSelectExtension().finally(() => {
            this.discoveryPromise = null
        }), await this.discoveryPromise;
        let w = crypto.randomUUID(),
            O = A === "tabs_context_mcp",
            $ = Date.now(),
            H = O ? this.tabsContextCollectionTimeoutMs : this.toolCallTimeoutMs;
        _?.("chrome_bridge_tool_call_started", {
            tool_name: A,
            tool_use_id: w
        });
        let j = K?.permissionMode ?? this.permissionMode,
            J = K?.allowedDomains ?? this.allowedDomains;
        return new Promise((M, D) => {
            let X = setTimeout(() => {
                let W = this.pendingCalls.get(w);
                if (W) {
                    this.pendingCalls.delete(w);
                    let Z = Date.now() - W.startTime;
                    if (O && W.results.length > 0) _?.("chrome_bridge_tool_call_completed", {
                        tool_name: A,
                        tool_use_id: w,
                        duration_ms: Z
                    }), M(this.mergeTabsResults(W.results));
                    else Y.warn(`[${z}] Tool call timeout: ${A} (${w.slice(0,8)}) after ${Z}ms, pending calls: ${this.pendingCalls.size}`), _?.("chrome_bridge_tool_call_timeout", {
                        tool_name: A,
                        tool_use_id: w,
                        duration_ms: Z,
                        timeout_ms: H
                    }), D(new OG(`[${z}] Tool call timed out: ${A}`))
                }
            }, H);
            this.pendingCalls.set(w, {
                resolve: M,
                reject: D,
                timer: X,
                results: [],
                isTabsContext: O,
                onPermissionRequest: K?.onPermissionRequest,
                startTime: $,
                toolName: A
            });
            let P = {
                type: "tool_call",
                tool_use_id: w,
                client_type: this.context.clientTypeId,
                tool: A,
                args: q
            };
            if (this.selectedDeviceId) P.target_device_id = this.selectedDeviceId;
            if (j) P.permission_mode = j;
            if (J?.length) P.allowed_domains = J;
            if (K?.onPermissionRequest) P.handle_permission_prompts = !0;
            Y.debug(`[${z}] Sending tool_call: ${A} (${w.slice(0,8)})`), this.ws.send(JSON.stringify(P))
        })
    }
    isConnected() {
        return this.connected && this.authenticated && this.ws?.readyState === HP.OPEN
    }
    disconnect() {
        this.cleanup()
    }
    setNotificationHandler(A) {
        this.notificationHandler = A
    }
    async setPermissionMode(A, q) {
        this.permissionMode = A, this.allowedDomains = q
    }
    async discoverAndSelectExtension() {
        let {
            logger: A,
            serverName: q
        } = this.context;
        this.persistedDeviceId ??= this.context.getPersistedDeviceId?.();
        let K = await this.queryBridgeExtensions();
        if (K.length === 0) {
            if (A.info(`[${q}] No extensions connected, waiting up to ${SKA}ms for peer_connected`), await this.waitForPeerConnected(SKA)) K = await this.queryBridgeExtensions()
        }
        if (this.discoveryComplete = !0, K.length === 0) {
            A.info(`[${q}] No extensions found after waiting`);
            return
        }
        if (K.length === 1) {
            let Y = K[0];
            if (!this.isLocalExtension(Y)) this.context.onRemoteExtensionWarning?.(Y);
            this.selectExtension(Y.deviceId);
            return
        }
        if (this.persistedDeviceId) {
            let Y = K.find((z) => z.deviceId === this.persistedDeviceId);
            if (Y) {
                A.info(`[${q}] Auto-connecting to persisted extension: ${Y.name||Y.deviceId.slice(0,8)}`), this.selectExtension(Y.deviceId);
                return
            }
        }
        this.broadcastPairingRequest(), this.pairingInProgress = !0
    }
    async queryBridgeExtensions() {
        let A = await new Promise((K) => {
                let Y = setTimeout(() => {
                    this.pendingDiscovery = null, K([])
                }, peq);
                this.pendingDiscovery = {
                    resolve: K,
                    timeout: Y
                }, this.ws?.send(JSON.stringify({
                    type: "list_extensions"
                }))
            }),
            q = new Map;
        for (let K of A) {
            let Y = q.get(K.deviceId);
            if (!Y || K.connectedAt > Y.connectedAt) q.set(K.deviceId, K)
        }
        return [...q.values()]
    }
    selectExtension(A) {
        let {
            logger: q,
            serverName: K
        } = this.context;
        this.selectedDeviceId = A, this.previousSelectedDeviceId = void 0, q.info(`[${K}] Selected Chrome extension: ${A.slice(0,8)}...`)
    }
    isLocalExtension(A) {
        if (!A.osPlatform) return !1;
        return A.osPlatform === E61()
    }
    waitForPeerConnected(A) {
        return new Promise((q) => {
            let K = setTimeout(() => {
                    this.peerConnectedWaiters = this.peerConnectedWaiters.filter((z) => z !== Y), q(!1)
                }, A),
                Y = (z) => {
                    clearTimeout(K), q(z)
                };
            this.peerConnectedWaiters.push(Y)
        })
    }
    broadcastPairingRequest() {
        let A = crypto.randomUUID();
        this.pendingPairingRequestId = A, this.ws?.send(JSON.stringify({
            type: "pairing_request",
            request_id: A,
            client_type: this.context.clientTypeId
        }))
    }
    async switchBrowser() {
        let A = await this.queryBridgeExtensions(),
            q = this.selectedDeviceId ?? this.previousSelectedDeviceId;
        if (A.length === 0 || A.length === 1 && (!q || A[0].deviceId === q)) return "no_other_browsers";
        this.previousSelectedDeviceId = this.selectedDeviceId, this.selectedDeviceId = void 0, this.discoveryComplete = !1, this.pairingInProgress = !1;
        let K = crypto.randomUUID();
        if (this.pendingPairingRequestId = K, this.ws?.readyState !== HP.OPEN) return null;
        if (this.ws.send(JSON.stringify({
                type: "pairing_request",
                request_id: K,
                client_type: this.context.clientTypeId
            })), this.pendingSwitchResolve) this.pendingSwitchResolve(null);
        return new Promise((Y) => {
            let z = setTimeout(() => {
                if (this.pendingPairingRequestId === K) this.pendingPairingRequestId = void 0;
                this.pendingSwitchResolve = null, Y(null)
            }, 120000);
            this.pendingSwitchResolve = (_) => {
                clearTimeout(z), this.pendingSwitchResolve = null, Y(_)
            }
        })
    }
    async connect() {
        let {
            logger: A,
            serverName: q,
            bridgeConfig: K,
            trackEvent: Y
        } = this.context;
        if (!K) {
            A.error(`[${q}] No bridge config provided`);
            return
        }
        if (this.connecting) return;
        this.connecting = !0, this.authenticated = !1, this.connectionStartTime = Date.now(), this.closeSocket();
        let z, _;
        if (K.devUserId) z = K.devUserId, A.debug(`[${q}] Using dev user ID for bridge connection`);
        else {
            A.debug(`[${q}] Fetching user ID for bridge connection`);
            let O = await K.getUserId();
            if (!O) {
                let $ = Date.now() - this.connectionStartTime;
                A.error(`[${q}] No user ID available after ${$}ms`), Y?.("chrome_bridge_connection_failed", {
                    duration_ms: $,
                    error_type: "no_user_id",
                    reconnect_attempt: this.reconnectAttempts
                }), this.connecting = !1, this.context.onAuthenticationError?.();
                return
            }
            if (z = O, A.debug(`[${q}] Fetching OAuth token for bridge connection`), _ = await K.getOAuthToken(), !_) {
                let $ = Date.now() - this.connectionStartTime;
                A.error(`[${q}] No OAuth token available after ${$}ms`), Y?.("chrome_bridge_connection_failed", {
                    duration_ms: $,
                    error_type: "no_oauth_token",
                    reconnect_attempt: this.reconnectAttempts
                }), this.connecting = !1, this.context.onAuthenticationError?.();
                return
            }
        }
        let w = `${K.url}/chrome/${z}`;
        A.info(`[${q}] Connecting to bridge: ${w}`), Y?.("chrome_bridge_connection_started", {
            bridge_url: w
        });
        try {
            this.ws = new HP(w)
        } catch (O) {
            let $ = Date.now() - this.connectionStartTime;
            A.error(`[${q}] Failed to create WebSocket after ${$}ms:`, O), Y?.("chrome_bridge_connection_failed", {
                duration_ms: $,
                error_type: "websocket_error",
                reconnect_attempt: this.reconnectAttempts
            }), this.connecting = !1, this.scheduleReconnect();
            return
        }
        this.ws.on("open", () => {
            A.info(`[${q}] WebSocket connected, sending connect message`);
            let O = {
                type: "connect",
                client_type: this.context.clientTypeId
            };
            if (K.devUserId) O.dev_user_id = K.devUserId;
            else O.oauth_token = _;
            this.ws?.send(JSON.stringify(O))
        }), this.ws.on("message", (O) => {
            try {
                let $ = JSON.parse(O.toString());
                A.debug(`[${q}] Bridge received: ${JSON.stringify($)}`), this.handleMessage($)
            } catch ($) {
                A.error(`[${q}] Failed to parse bridge message:`, $)
            }
        }), this.ws.on("close", (O) => {
            let $ = this.connectionEstablishedTime ? Date.now() - this.connectionEstablishedTime : 0;
            A.info(`[${q}] Bridge connection closed (code: ${O}, duration: ${$}ms)`), Y?.("chrome_bridge_disconnected", {
                close_code: O,
                duration_since_connect_ms: $,
                reconnect_attempt: this.reconnectAttempts + 1
            }), this.connected = !1, this.authenticated = !1, this.connecting = !1, this.connectionEstablishedTime = null, this.scheduleReconnect()
        }), this.ws.on("error", (O) => {
            let $ = this.connectionStartTime ? Date.now() - this.connectionStartTime : 0;
            A.error(`[${q}] Bridge WebSocket error after ${$}ms: ${O.message}`), Y?.("chrome_bridge_connection_failed", {
                duration_ms: $,
                error_type: "websocket_error",
                reconnect_attempt: this.reconnectAttempts
            }), this.connected = !1, this.authenticated = !1, this.connecting = !1
        })
    }
    handleMessage(A) {
        let {
            logger: q,
            serverName: K,
            trackEvent: Y
        } = this.context;
        switch (A.type) {
            case "paired": {
                let z = this.connectionStartTime ? Date.now() - this.connectionStartTime : 0;
                q.info(`[${K}] Paired with Chrome extension (duration: ${z}ms)`), this.connected = !0, this.authenticated = !0, this.connecting = !1, this.reconnectAttempts = 0, this.connectionEstablishedTime = Date.now(), Y?.("chrome_bridge_connection_succeeded", {
                    duration_ms: z,
                    status: "paired"
                });
                break
            }
            case "waiting": {
                let z = this.connectionStartTime ? Date.now() - this.connectionStartTime : 0;
                q.info(`[${K}] Waiting for Chrome extension to connect (duration: ${z}ms)`), this.connected = !0, this.authenticated = !0, this.connecting = !1, this.reconnectAttempts = 0, this.connectionEstablishedTime = Date.now(), Y?.("chrome_bridge_connection_succeeded", {
                    duration_ms: z,
                    status: "waiting"
                });
                break
            }
            case "peer_connected":
                if (q.info(`[${K}] Chrome extension connected to bridge`), Y?.("chrome_bridge_peer_connected", null), !this.selectedDeviceId) this.discoveryComplete = !1;
                if (this.previousSelectedDeviceId && A.deviceId === this.previousSelectedDeviceId && !this.pendingSwitchResolve) q.info(`[${K}] Previously selected extension reconnected, auto-reselecting`), this.selectExtension(this.previousSelectedDeviceId), this.previousSelectedDeviceId = void 0;
                if (this.peerConnectedWaiters.length > 0) {
                    let z = this.peerConnectedWaiters;
                    this.peerConnectedWaiters = [];
                    for (let _ of z) _(!0)
                }
                break;
            case "peer_disconnected":
                if (q.info(`[${K}] Chrome extension disconnected from bridge`), Y?.("chrome_bridge_peer_disconnected", null), A.deviceId && A.deviceId === this.selectedDeviceId) q.info(`[${K}] Selected extension disconnected, clearing selection`), this.previousSelectedDeviceId = this.selectedDeviceId, this.selectedDeviceId = void 0, this.discoveryComplete = !1;
                break;
            case "extensions_list":
                if (this.pendingDiscovery) clearTimeout(this.pendingDiscovery.timeout), this.pendingDiscovery.resolve(A.extensions ?? []), this.pendingDiscovery = null;
                break;
            case "pairing_response": {
                let {
                    request_id: z,
                    device_id: _,
                    name: w
                } = A;
                if (this.pendingPairingRequestId === z && _ && w) {
                    if (this.pendingPairingRequestId = void 0, this.pairingInProgress = !1, this.selectExtension(_), this.context.onExtensionPaired?.(_, w), q.info(`[${K}] Paired with "${w}" (${_.slice(0,8)})`), this.pendingSwitchResolve) this.pendingSwitchResolve({
                        deviceId: _,
                        name: w
                    }), this.pendingSwitchResolve = null
                }
                break
            }
            case "ping":
                this.ws?.send(JSON.stringify({
                    type: "pong"
                }));
                break;
            case "pong":
                break;
            case "tool_result":
                this.handleToolResult(A);
                break;
            case "permission_request":
                this.handlePermissionRequest(A);
                break;
            case "notification":
                if (this.notificationHandler) this.notificationHandler({
                    method: A.method,
                    params: A.params
                });
                break;
            case "error":
                if (q.warn(`[${K}] Bridge error: ${A.error}`), this.selectedDeviceId) this.selectedDeviceId = void 0, this.discoveryComplete = !1;
                break;
            default:
                q.warn(`[${K}] Unrecognized bridge message type: ${A.type}`)
        }
    }
    async handlePermissionRequest(A) {
        let {
            logger: q,
            serverName: K
        } = this.context, Y = A.tool_use_id, z = A.request_id;
        if (!Y || !z) {
            q.warn(`[${K}] permission_request missing tool_use_id or request_id`);
            return
        }
        let _ = this.pendingCalls.get(Y);
        if (!_?.onPermissionRequest) {
            q.debug(`[${K}] Ignoring permission_request for unknown tool_use_id ${Y.slice(0,8)} (not our call)`);
            return
        }
        let w = {
            toolUseId: Y,
            requestId: z,
            toolType: A.tool_type ?? "unknown",
            url: A.url ?? "",
            actionData: A.action_data
        };
        try {
            let O = await _.onPermissionRequest(w);
            this.sendPermissionResponse(z, O)
        } catch (O) {
            q.error(`[${K}] Error handling permission request:`, O), this.sendPermissionResponse(z, !1)
        }
    }
    sendPermissionResponse(A, q) {
        if (this.ws?.readyState === HP.OPEN) {
            let K = {
                type: "permission_response",
                request_id: A,
                allowed: q
            };
            if (this.selectedDeviceId) K.target_device_id = this.selectedDeviceId;
            this.ws.send(JSON.stringify(K))
        }
    }
    handleToolResult(A) {
        let {
            logger: q,
            serverName: K,
            trackEvent: Y
        } = this.context, z = A.tool_use_id;
        if (!z) {
            q.warn(`[${K}] Received tool_result without tool_use_id`);
            return
        }
        let _ = this.pendingCalls.get(z);
        if (!_) {
            q.debug(`[${K}] Received tool_result for unknown call: ${z.slice(0,8)}`);
            return
        }
        let w = Date.now() - _.startTime,
            O = this.normalizeBridgeResponse(A),
            $ = Boolean(A.is_error) || "error" in O;
        if (_.isTabsContext && !this.selectedDeviceId) _.results.push(O);
        else {
            if (clearTimeout(_.timer), this.pendingCalls.delete(z), $) {
                let H = O.error?.content,
                    j = "Unknown error";
                if (Array.isArray(H)) {
                    let J = H.find((M) => typeof M === "object" && M !== null && ("text" in M));
                    if (J?.text) j = J.text.slice(0, 200)
                }
                q.warn(`[${K}] Tool call error: ${_.toolName} (${z.slice(0,8)}) after ${w}ms`), Y?.("chrome_bridge_tool_call_error", {
                    tool_name: _.toolName,
                    tool_use_id: z,
                    duration_ms: w,
                    error_message: j
                })
            } else q.debug(`[${K}] Tool call completed: ${_.toolName} (${z.slice(0,8)}) in ${w}ms`), Y?.("chrome_bridge_tool_call_completed", {
                tool_name: _.toolName,
                tool_use_id: z,
                duration_ms: w
            });
            _.resolve(O)
        }
    }
    normalizeBridgeResponse(A) {
        if (A.result || A.error) return A;
        if (A.content) {
            if (A.is_error) return {
                error: {
                    content: A.content
                }
            };
            return {
                result: {
                    content: A.content
                }
            }
        }
        return A
    }
    mergeTabsResults(A) {
        let q = [];
        for (let K of A) {
            let _ = K.result?.content;
            if (!_ || !Array.isArray(_)) continue;
            for (let w of _)
                if (w.type === "text" && w.text) try {
                    let O = JSON.parse(w.text);
                    if (Array.isArray(O)) q.push(...O);
                    else if (O?.availableTabs && Array.isArray(O.availableTabs)) q.push(...O.availableTabs)
                } catch {}
        }
        if (q.length > 0) {
            let K = q.map((Y) => {
                let z = Y;
                return `  • tabId ${z.tabId}: "${z.title}" (${z.url})`
            }).join(`
`);
            return {
                result: {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            availableTabs: q
                        })
                    }, {
                        type: "text",
                        text: `

Tab Context:
- Available tabs:
${K}`
                    }]
                }
            }
        }
        return A[0]
    }
    scheduleReconnect() {
        let {
            logger: A,
            serverName: q,
            trackEvent: K
        } = this.context;
        if (this.reconnectTimer) return;
        if (this.reconnectAttempts++, this.reconnectAttempts > 100) {
            A.warn(`[${q}] Giving up bridge reconnection after 100 attempts`), K?.("chrome_bridge_reconnect_exhausted", {
                total_attempts: 100
            }), this.reconnectAttempts = 0;
            return
        }
        let Y = Math.min(2000 * Math.pow(1.5, this.reconnectAttempts - 1), 30000);
        if (this.reconnectAttempts <= 10 || this.reconnectAttempts % 10 === 0) A.info(`[${q}] Bridge reconnecting in ${Math.round(Y)}ms (attempt ${this.reconnectAttempts})`);
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null, this.connect()
        }, Y)
    }
    closeSocket() {
        if (this.ws) this.ws.removeAllListeners(), this.ws.close(), this.ws = null;
        if (this.connected = !1, this.authenticated = !1, this.selectedDeviceId = void 0, this.discoveryComplete = !1, this.pendingPairingRequestId = void 0, this.pairingInProgress = !1, this.pendingSwitchResolve) this.pendingSwitchResolve(null), this.pendingSwitchResolve = null;
        if (this.pendingDiscovery) clearTimeout(this.pendingDiscovery.timeout), this.pendingDiscovery.resolve([]), this.pendingDiscovery = null;
        if (this.peerConnectedWaiters.length > 0) {
            let A = this.peerConnectedWaiters;
            this.peerConnectedWaiters = [];
            for (let q of A) q(!1)
        }
    }
    cleanup() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
        for (let [A, q] of this.pendingCalls) clearTimeout(q.timer), q.reject(new OG("Bridge client disconnected")), this.pendingCalls.delete(A);
        this.closeSocket(), this.reconnectAttempts = 0
    }
}
// @from(Ln 18179, Col 0)
function L61(A) {
    return new y61(A)
}
// @from(Ln 18182, Col 4)
peq = 5000
// @from(Ln 18183, Col 4)
SKA = 1e4
// @from(Ln 18184, Col 4)
hQ1 = E(() => {
    VO6();
    Vy6()
})
// @from(Ln 18188, Col 4)
Sp