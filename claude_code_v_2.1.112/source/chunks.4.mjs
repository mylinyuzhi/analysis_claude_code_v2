
// @from(Ln 9105, Col 4)
XF6 = p((_yA, dT7) => {
    var JF6 = d6("zlib"),
        FT7 = HF6(),
        tv5 = pT7(),
        {
            kStatusCode: gT7
        } = li(),
        ev5 = Buffer[Symbol.species],
        qT5 = Buffer.from([0, 0, 255, 255]),
        $28 = Symbol("permessage-deflate"),
        ni = Symbol("total-length"),
        eD6 = Symbol("callback"),
        d86 = Symbol("buffers"),
        qZ6 = Symbol("error"),
        w28;
    class UT7 {
        constructor(q, K, _) {
            if (this._maxPayload = _ | 0, this._options = q || {}, this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024, this._isServer = !!K, this._deflate = null, this._inflate = null, this.params = null, !w28) {
                let z = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
                w28 = new tv5(z)
            }
        }
        static get extensionName() {
            return "permessage-deflate"
        }
        offer() {
            let q = {};
            if (this._options.serverNoContextTakeover) q.server_no_context_takeover = !0;
            if (this._options.clientNoContextTakeover) q.client_no_context_takeover = !0;
            if (this._options.serverMaxWindowBits) q.server_max_window_bits = this._options.serverMaxWindowBits;
            if (this._options.clientMaxWindowBits) q.client_max_window_bits = this._options.clientMaxWindowBits;
            else if (this._options.clientMaxWindowBits == null) q.client_max_window_bits = !0;
            return q
        }
        accept(q) {
            return q = this.normalizeParams(q), this.params = this._isServer ? this.acceptAsServer(q) : this.acceptAsClient(q), this.params
        }
        cleanup() {
            if (this._inflate) this._inflate.close(), this._inflate = null;
            if (this._deflate) {
                let q = this._deflate[eD6];
                if (this._deflate.close(), this._deflate = null, q) q(Error("The deflate stream was closed while data was being processed"))
            }
        }
        acceptAsServer(q) {
            let K = this._options,
                _ = q.find((z) => {
                    if (K.serverNoContextTakeover === !1 && z.server_no_context_takeover || z.server_max_window_bits && (K.serverMaxWindowBits === !1 || typeof K.serverMaxWindowBits === "number" && K.serverMaxWindowBits > z.server_max_window_bits) || typeof K.clientMaxWindowBits === "number" && !z.client_max_window_bits) return !1;
                    return !0
                });
            if (!_) throw Error("None of the extension offers can be accepted");
            if (K.serverNoContextTakeover) _.server_no_context_takeover = !0;
            if (K.clientNoContextTakeover) _.client_no_context_takeover = !0;
            if (typeof K.serverMaxWindowBits === "number") _.server_max_window_bits = K.serverMaxWindowBits;
            if (typeof K.clientMaxWindowBits === "number") _.client_max_window_bits = K.clientMaxWindowBits;
            else if (_.client_max_window_bits === !0 || K.clientMaxWindowBits === !1) delete _.client_max_window_bits;
            return _
        }
        acceptAsClient(q) {
            let K = q[0];
            if (this._options.clientNoContextTakeover === !1 && K.client_no_context_takeover) throw Error('Unexpected parameter "client_no_context_takeover"');
            if (!K.client_max_window_bits) {
                if (typeof this._options.clientMaxWindowBits === "number") K.client_max_window_bits = this._options.clientMaxWindowBits
            } else if (this._options.clientMaxWindowBits === !1 || typeof this._options.clientMaxWindowBits === "number" && K.client_max_window_bits > this._options.clientMaxWindowBits) throw Error('Unexpected or invalid parameter "client_max_window_bits"');
            return K
        }
        normalizeParams(q) {
            return q.forEach((K) => {
                Object.keys(K).forEach((_) => {
                    let z = K[_];
                    if (z.length > 1) throw Error(`Parameter "${_}" must have only a single value`);
                    if (z = z[0], _ === "client_max_window_bits") {
                        if (z !== !0) {
                            let Y = +z;
                            if (!Number.isInteger(Y) || Y < 8 || Y > 15) throw TypeError(`Invalid value for parameter "${_}": ${z}`);
                            z = Y
                        } else if (!this._isServer) throw TypeError(`Invalid value for parameter "${_}": ${z}`)
                    } else if (_ === "server_max_window_bits") {
                        let Y = +z;
                        if (!Number.isInteger(Y) || Y < 8 || Y > 15) throw TypeError(`Invalid value for parameter "${_}": ${z}`);
                        z = Y
                    } else if (_ === "client_no_context_takeover" || _ === "server_no_context_takeover") {
                        if (z !== !0) throw TypeError(`Invalid value for parameter "${_}": ${z}`)
                    } else throw Error(`Unknown parameter "${_}"`);
                    K[_] = z
                })
            }), q
        }
        decompress(q, K, _) {
            w28.add((z) => {
                this._decompress(q, K, (Y, A) => {
                    z(), _(Y, A)
                })
            })
        }
        compress(q, K, _) {
            w28.add((z) => {
                this._compress(q, K, (Y, A) => {
                    z(), _(Y, A)
                })
            })
        }
        _decompress(q, K, _) {
            let z = this._isServer ? "client" : "server";
            if (!this._inflate) {
                let Y = `${z}_max_window_bits`,
                    A = typeof this.params[Y] !== "number" ? JF6.Z_DEFAULT_WINDOWBITS : this.params[Y];
                this._inflate = JF6.createInflateRaw({
                    ...this._options.zlibInflateOptions,
                    windowBits: A
                }), this._inflate[$28] = this, this._inflate[ni] = 0, this._inflate[d86] = [], this._inflate.on("error", _T5), this._inflate.on("data", QT7)
            }
            if (this._inflate[eD6] = _, this._inflate.write(q), K) this._inflate.write(qT5);
            this._inflate.flush(() => {
                let Y = this._inflate[qZ6];
                if (Y) {
                    this._inflate.close(), this._inflate = null, _(Y);
                    return
                }
                let A = FT7.concat(this._inflate[d86], this._inflate[ni]);
                if (this._inflate._readableState.endEmitted) this._inflate.close(), this._inflate = null;
                else if (this._inflate[ni] = 0, this._inflate[d86] = [], K && this.params[`${z}_no_context_takeover`]) this._inflate.reset();
                _(null, A)
            })
        }
        _compress(q, K, _) {
            let z = this._isServer ? "server" : "client";
            if (!this._deflate) {
                let Y = `${z}_max_window_bits`,
                    A = typeof this.params[Y] !== "number" ? JF6.Z_DEFAULT_WINDOWBITS : this.params[Y];
                this._deflate = JF6.createDeflateRaw({
                    ...this._options.zlibDeflateOptions,
                    windowBits: A
                }), this._deflate[ni] = 0, this._deflate[d86] = [], this._deflate.on("data", KT5)
            }
            this._deflate[eD6] = _, this._deflate.write(q), this._deflate.flush(JF6.Z_SYNC_FLUSH, () => {
                if (!this._deflate) return;
                let Y = FT7.concat(this._deflate[d86], this._deflate[ni]);
                if (K) Y = new ev5(Y.buffer, Y.byteOffset, Y.length - 4);
                if (this._deflate[eD6] = null, this._deflate[ni] = 0, this._deflate[d86] = [], K && this.params[`${z}_no_context_takeover`]) this._deflate.reset();
                _(null, Y)
            })
        }
    }
    dT7.exports = UT7;

    function KT5(q) {
        this[d86].push(q), this[ni] += q.length
    }

    function QT7(q) {
        if (this[ni] += q.length, this[$28]._maxPayload < 1 || this[ni] <= this[$28]._maxPayload) {
            this[d86].push(q);
            return
        }
        this[qZ6] = RangeError("Max payload size exceeded"), this[qZ6].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH", this[qZ6][gT7] = 1009, this.removeListener("data", QT7), this.reset()
    }

    function _T5(q) {
        if (this[$28]._inflate = null, this[qZ6]) {
            this[eD6](this[qZ6]);
            return
        }
        q[gT7] = 1007, this[eD6](q)
    }
})
// @from(Ln 9271, Col 4)
KZ6 = p((zyA, j28) => {
    var {
        isUtf8: cT7
    } = d6("buffer"), {
        hasBlob: zT5
    } = li(), YT5 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0];

    function AT5(q) {
        return q >= 1000 && q <= 1014 && q !== 1004 && q !== 1005 && q !== 1006 || q >= 3000 && q <= 4999
    }

    function b71(q) {
        let K = q.length,
            _ = 0;
        while (_ < K)
            if ((q[_] & 128) === 0) _++;
            else if ((q[_] & 224) === 192) {
            if (_ + 1 === K || (q[_ + 1] & 192) !== 128 || (q[_] & 254) === 192) return !1;
            _ += 2
        } else if ((q[_] & 240) === 224) {
            if (_ + 2 >= K || (q[_ + 1] & 192) !== 128 || (q[_ + 2] & 192) !== 128 || q[_] === 224 && (q[_ + 1] & 224) === 128 || q[_] === 237 && (q[_ + 1] & 224) === 160) return !1;
            _ += 3
        } else if ((q[_] & 248) === 240) {
            if (_ + 3 >= K || (q[_ + 1] & 192) !== 128 || (q[_ + 2] & 192) !== 128 || (q[_ + 3] & 192) !== 128 || q[_] === 240 && (q[_ + 1] & 240) === 128 || q[_] === 244 && q[_ + 1] > 143 || q[_] > 244) return !1;
            _ += 4
        } else return !1;
        return !0
    }

    function OT5(q) {
        return zT5 && typeof q === "object" && typeof q.arrayBuffer === "function" && typeof q.type === "string" && typeof q.stream === "function" && (q[Symbol.toStringTag] === "Blob" || q[Symbol.toStringTag] === "File")
    }
    j28.exports = {
        isBlob: OT5,
        isValidStatusCode: AT5,
        isValidUTF8: b71,
        tokenChars: YT5
    };
    if (cT7) j28.exports.isValidUTF8 = function(q) {
        return q.length < 24 ? b71(q) : cT7(q)
    };
    else if (!process.env.WS_NO_UTF_8_VALIDATE) try {
        let q = (() => {
            throw new Error("Cannot require module " + "utf-8-validate");
        })();
        j28.exports.isValidUTF8 = function(K) {
            return K.length < 32 ? b71(K) : q(K)
        }
    } catch (q) {}
})
// @from(Ln 9321, Col 4)
x71 = p((YyA, oT7) => {
    var {
        Writable: wT5
    } = d6("stream"), lT7 = XF6(), {
        BINARY_TYPES: $T5,
        EMPTY_BUFFER: nT7,
        kStatusCode: jT5,
        kWebSocket: HT5
    } = li(), {
        concat: I71,
        toArrayBuffer: JT5,
        unmask: XT5
    } = HF6(), {
        isValidStatusCode: MT5,
        isValidUTF8: iT7
    } = KZ6(), H28 = Buffer[Symbol.species];
    class rT7 extends wT5 {
        constructor(q = {}) {
            super();
            this._allowSynchronousEvents = q.allowSynchronousEvents !== void 0 ? q.allowSynchronousEvents : !0, this._binaryType = q.binaryType || $T5[0], this._extensions = q.extensions || {}, this._isServer = !!q.isServer, this._maxPayload = q.maxPayload | 0, this._skipUTF8Validation = !!q.skipUTF8Validation, this[HT5] = void 0, this._bufferedBytes = 0, this._buffers = [], this._compressed = !1, this._payloadLength = 0, this._mask = void 0, this._fragmented = 0, this._masked = !1, this._fin = !1, this._opcode = 0, this._totalPayloadLength = 0, this._messageLength = 0, this._fragments = [], this._errored = !1, this._loop = !1, this._state = 0
        }
        _write(q, K, _) {
            if (this._opcode === 8 && this._state == 0) return _();
            this._bufferedBytes += q.length, this._buffers.push(q), this.startLoop(_)
        }
        consume(q) {
            if (this._bufferedBytes -= q, q === this._buffers[0].length) return this._buffers.shift();
            if (q < this._buffers[0].length) {
                let _ = this._buffers[0];
                return this._buffers[0] = new H28(_.buffer, _.byteOffset + q, _.length - q), new H28(_.buffer, _.byteOffset, q)
            }
            let K = Buffer.allocUnsafe(q);
            do {
                let _ = this._buffers[0],
                    z = K.length - q;
                if (q >= _.length) K.set(this._buffers.shift(), z);
                else K.set(new Uint8Array(_.buffer, _.byteOffset, q), z), this._buffers[0] = new H28(_.buffer, _.byteOffset + q, _.length - q);
                q -= _.length
            } while (q > 0);
            return K
        }
        startLoop(q) {
            this._loop = !0;
            do switch (this._state) {
                case 0:
                    this.getInfo(q);
                    break;
                case 1:
                    this.getPayloadLength16(q);
                    break;
                case 2:
                    this.getPayloadLength64(q);
                    break;
                case 3:
                    this.getMask();
                    break;
                case 4:
                    this.getData(q);
                    break;
                case 5:
                case 6:
                    this._loop = !1;
                    return
            }
            while (this._loop);
            if (!this._errored) q()
        }
        getInfo(q) {
            if (this._bufferedBytes < 2) {
                this._loop = !1;
                return
            }
            let K = this.consume(2);
            if ((K[0] & 48) !== 0) {
                let z = this.createError(RangeError, "RSV2 and RSV3 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_2_3");
                q(z);
                return
            }
            let _ = (K[0] & 64) === 64;
            if (_ && !this._extensions[lT7.extensionName]) {
                let z = this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
                q(z);
                return
            }
            if (this._fin = (K[0] & 128) === 128, this._opcode = K[0] & 15, this._payloadLength = K[1] & 127, this._opcode === 0) {
                if (_) {
                    let z = this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
                    q(z);
                    return
                }
                if (!this._fragmented) {
                    let z = this.createError(RangeError, "invalid opcode 0", !0, 1002, "WS_ERR_INVALID_OPCODE");
                    q(z);
                    return
                }
                this._opcode = this._fragmented
            } else if (this._opcode === 1 || this._opcode === 2) {
                if (this._fragmented) {
                    let z = this.createError(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE");
                    q(z);
                    return
                }
                this._compressed = _
            } else if (this._opcode > 7 && this._opcode < 11) {
                if (!this._fin) {
                    let z = this.createError(RangeError, "FIN must be set", !0, 1002, "WS_ERR_EXPECTED_FIN");
                    q(z);
                    return
                }
                if (_) {
                    let z = this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
                    q(z);
                    return
                }
                if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
                    let z = this.createError(RangeError, `invalid payload length ${this._payloadLength}`, !0, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
                    q(z);
                    return
                }
            } else {
                let z = this.createError(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE");
                q(z);
                return
            }
            if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
            if (this._masked = (K[1] & 128) === 128, this._isServer) {
                if (!this._masked) {
                    let z = this.createError(RangeError, "MASK must be set", !0, 1002, "WS_ERR_EXPECTED_MASK");
                    q(z);
                    return
                }
            } else if (this._masked) {
                let z = this.createError(RangeError, "MASK must be clear", !0, 1002, "WS_ERR_UNEXPECTED_MASK");
                q(z);
                return
            }
            if (this._payloadLength === 126) this._state = 1;
            else if (this._payloadLength === 127) this._state = 2;
            else this.haveLength(q)
        }
        getPayloadLength16(q) {
            if (this._bufferedBytes < 2) {
                this._loop = !1;
                return
            }
            this._payloadLength = this.consume(2).readUInt16BE(0), this.haveLength(q)
        }
        getPayloadLength64(q) {
            if (this._bufferedBytes < 8) {
                this._loop = !1;
                return
            }
            let K = this.consume(8),
                _ = K.readUInt32BE(0);
            if (_ > Math.pow(2, 21) - 1) {
                let z = this.createError(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", !1, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH");
                q(z);
                return
            }
            this._payloadLength = _ * Math.pow(2, 32) + K.readUInt32BE(4), this.haveLength(q)
        }
        haveLength(q) {
            if (this._payloadLength && this._opcode < 8) {
                if (this._totalPayloadLength += this._payloadLength, this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
                    let K = this.createError(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
                    q(K);
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
        getData(q) {
            let K = nT7;
            if (this._payloadLength) {
                if (this._bufferedBytes < this._payloadLength) {
                    this._loop = !1;
                    return
                }
                if (K = this.consume(this._payloadLength), this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) XT5(K, this._mask)
            }
            if (this._opcode > 7) {
                this.controlMessage(K, q);
                return
            }
            if (this._compressed) {
                this._state = 5, this.decompress(K, q);
                return
            }
            if (K.length) this._messageLength = this._totalPayloadLength, this._fragments.push(K);
            this.dataMessage(q)
        }
        decompress(q, K) {
            this._extensions[lT7.extensionName].decompress(q, this._fin, (z, Y) => {
                if (z) return K(z);
                if (Y.length) {
                    if (this._messageLength += Y.length, this._messageLength > this._maxPayload && this._maxPayload > 0) {
                        let A = this.createError(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
                        K(A);
                        return
                    }
                    this._fragments.push(Y)
                }
                if (this.dataMessage(K), this._state === 0) this.startLoop(K)
            })
        }
        dataMessage(q) {
            if (!this._fin) {
                this._state = 0;
                return
            }
            let K = this._messageLength,
                _ = this._fragments;
            if (this._totalPayloadLength = 0, this._messageLength = 0, this._fragmented = 0, this._fragments = [], this._opcode === 2) {
                let z;
                if (this._binaryType === "nodebuffer") z = I71(_, K);
                else if (this._binaryType === "arraybuffer") z = JT5(I71(_, K));
                else if (this._binaryType === "blob") z = new Blob(_);
                else z = _;
                if (this._allowSynchronousEvents) this.emit("message", z, !0), this._state = 0;
                else this._state = 6, setImmediate(() => {
                    this.emit("message", z, !0), this._state = 0, this.startLoop(q)
                })
            } else {
                let z = I71(_, K);
                if (!this._skipUTF8Validation && !iT7(z)) {
                    let Y = this.createError(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8");
                    q(Y);
                    return
                }
                if (this._state === 5 || this._allowSynchronousEvents) this.emit("message", z, !1), this._state = 0;
                else this._state = 6, setImmediate(() => {
                    this.emit("message", z, !1), this._state = 0, this.startLoop(q)
                })
            }
        }
        controlMessage(q, K) {
            if (this._opcode === 8) {
                if (q.length === 0) this._loop = !1, this.emit("conclude", 1005, nT7), this.end();
                else {
                    let _ = q.readUInt16BE(0);
                    if (!MT5(_)) {
                        let Y = this.createError(RangeError, `invalid status code ${_}`, !0, 1002, "WS_ERR_INVALID_CLOSE_CODE");
                        K(Y);
                        return
                    }
                    let z = new H28(q.buffer, q.byteOffset + 2, q.length - 2);
                    if (!this._skipUTF8Validation && !iT7(z)) {
                        let Y = this.createError(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8");
                        K(Y);
                        return
                    }
                    this._loop = !1, this.emit("conclude", _, z), this.end()
                }
                this._state = 0;
                return
            }
            if (this._allowSynchronousEvents) this.emit(this._opcode === 9 ? "ping" : "pong", q), this._state = 0;
            else this._state = 6, setImmediate(() => {
                this.emit(this._opcode === 9 ? "ping" : "pong", q), this._state = 0, this.startLoop(K)
            })
        }
        createError(q, K, _, z, Y) {
            this._loop = !1, this._errored = !0;
            let A = new q(_ ? `Invalid WebSocket frame: ${K}` : K);
            return Error.captureStackTrace(A, this.createError), A.code = Y, A[jT5] = z, A
        }
    }
    oT7.exports = rT7
})
// @from(Ln 9598, Col 4)
m71 = p((OyA, tT7) => {
    var {
        Duplex: AyA
    } = d6("stream"), {
        randomFillSync: PT5
    } = d6("crypto"), aT7 = XF6(), {
        EMPTY_BUFFER: WT5,
        kWebSocket: DT5,
        NOOP: ZT5
    } = li(), {
        isBlob: _Z6,
        isValidStatusCode: fT5
    } = KZ6(), {
        mask: sT7,
        toBuffer: SY6
    } = HF6(), bC = Symbol("kByteLength"), GT5 = Buffer.alloc(4), CY6, zZ6 = 8192, Om = 0, vT5 = 1, TT5 = 2;
    class c86 {
        constructor(q, K, _) {
            if (this._extensions = K || {}, _) this._generateMask = _, this._maskBuffer = Buffer.alloc(4);
            this._socket = q, this._firstFragment = !0, this._compress = !1, this._bufferedBytes = 0, this._queue = [], this._state = Om, this.onerror = ZT5, this[DT5] = void 0
        }
        static frame(q, K) {
            let _, z = !1,
                Y = 2,
                A = !1;
            if (K.mask) {
                if (_ = K.maskBuffer || GT5, K.generateMask) K.generateMask(_);
                else {
                    if (zZ6 === 8192) {
                        if (CY6 === void 0) CY6 = Buffer.alloc(8192);
                        PT5(CY6, 0, 8192), zZ6 = 0
                    }
                    _[0] = CY6[zZ6++], _[1] = CY6[zZ6++], _[2] = CY6[zZ6++], _[3] = CY6[zZ6++]
                }
                A = (_[0] | _[1] | _[2] | _[3]) === 0, Y = 6
            }
            let O;
            if (typeof q === "string")
                if ((!K.mask || A) && K[bC] !== void 0) O = K[bC];
                else q = Buffer.from(q), O = q.length;
            else O = q.length, z = K.mask && K.readOnly && !A;
            let w = O;
            if (O >= 65536) Y += 8, w = 127;
            else if (O > 125) Y += 2, w = 126;
            let $ = Buffer.allocUnsafe(z ? O + Y : Y);
            if ($[0] = K.fin ? K.opcode | 128 : K.opcode, K.rsv1) $[0] |= 64;
            if ($[1] = w, w === 126) $.writeUInt16BE(O, 2);
            else if (w === 127) $[2] = $[3] = 0, $.writeUIntBE(O, 4, 6);
            if (!K.mask) return [$, q];
            if ($[1] |= 128, $[Y - 4] = _[0], $[Y - 3] = _[1], $[Y - 2] = _[2], $[Y - 1] = _[3], A) return [$, q];
            if (z) return sT7(q, _, $, Y, O), [$];
            return sT7(q, _, q, 0, O), [$, q]
        }
        close(q, K, _, z) {
            let Y;
            if (q === void 0) Y = WT5;
            else if (typeof q !== "number" || !fT5(q)) throw TypeError("First argument must be a valid error code number");
            else if (K === void 0 || !K.length) Y = Buffer.allocUnsafe(2), Y.writeUInt16BE(q, 0);
            else {
                let O = Buffer.byteLength(K);
                if (O > 123) throw RangeError("The message must not be greater than 123 bytes");
                if (Y = Buffer.allocUnsafe(2 + O), Y.writeUInt16BE(q, 0), typeof K === "string") Y.write(K, 2);
                else Y.set(K, 2)
            }
            let A = {
                [bC]: Y.length,
                fin: !0,
                generateMask: this._generateMask,
                mask: _,
                maskBuffer: this._maskBuffer,
                opcode: 8,
                readOnly: !1,
                rsv1: !1
            };
            if (this._state !== Om) this.enqueue([this.dispatch, Y, !1, A, z]);
            else this.sendFrame(c86.frame(Y, A), z)
        }
        ping(q, K, _) {
            let z, Y;
            if (typeof q === "string") z = Buffer.byteLength(q), Y = !1;
            else if (_Z6(q)) z = q.size, Y = !1;
            else q = SY6(q), z = q.length, Y = SY6.readOnly;
            if (z > 125) throw RangeError("The data size must not be greater than 125 bytes");
            let A = {
                [bC]: z,
                fin: !0,
                generateMask: this._generateMask,
                mask: K,
                maskBuffer: this._maskBuffer,
                opcode: 9,
                readOnly: Y,
                rsv1: !1
            };
            if (_Z6(q))
                if (this._state !== Om) this.enqueue([this.getBlobData, q, !1, A, _]);
                else this.getBlobData(q, !1, A, _);
            else if (this._state !== Om) this.enqueue([this.dispatch, q, !1, A, _]);
            else this.sendFrame(c86.frame(q, A), _)
        }
        pong(q, K, _) {
            let z, Y;
            if (typeof q === "string") z = Buffer.byteLength(q), Y = !1;
            else if (_Z6(q)) z = q.size, Y = !1;
            else q = SY6(q), z = q.length, Y = SY6.readOnly;
            if (z > 125) throw RangeError("The data size must not be greater than 125 bytes");
            let A = {
                [bC]: z,
                fin: !0,
                generateMask: this._generateMask,
                mask: K,
                maskBuffer: this._maskBuffer,
                opcode: 10,
                readOnly: Y,
                rsv1: !1
            };
            if (_Z6(q))
                if (this._state !== Om) this.enqueue([this.getBlobData, q, !1, A, _]);
                else this.getBlobData(q, !1, A, _);
            else if (this._state !== Om) this.enqueue([this.dispatch, q, !1, A, _]);
            else this.sendFrame(c86.frame(q, A), _)
        }
        send(q, K, _) {
            let z = this._extensions[aT7.extensionName],
                Y = K.binary ? 2 : 1,
                A = K.compress,
                O, w;
            if (typeof q === "string") O = Buffer.byteLength(q), w = !1;
            else if (_Z6(q)) O = q.size, w = !1;
            else q = SY6(q), O = q.length, w = SY6.readOnly;
            if (this._firstFragment) {
                if (this._firstFragment = !1, A && z && z.params[z._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) A = O >= z._threshold;
                this._compress = A
            } else A = !1, Y = 0;
            if (K.fin) this._firstFragment = !0;
            let $ = {
                [bC]: O,
                fin: K.fin,
                generateMask: this._generateMask,
                mask: K.mask,
                maskBuffer: this._maskBuffer,
                opcode: Y,
                readOnly: w,
                rsv1: A
            };
            if (_Z6(q))
                if (this._state !== Om) this.enqueue([this.getBlobData, q, this._compress, $, _]);
                else this.getBlobData(q, this._compress, $, _);
            else if (this._state !== Om) this.enqueue([this.dispatch, q, this._compress, $, _]);
            else this.dispatch(q, this._compress, $, _)
        }
        getBlobData(q, K, _, z) {
            this._bufferedBytes += _[bC], this._state = TT5, q.arrayBuffer().then((Y) => {
                if (this._socket.destroyed) {
                    let O = Error("The socket was closed while the blob was being read");
                    process.nextTick(u71, this, O, z);
                    return
                }
                this._bufferedBytes -= _[bC];
                let A = SY6(Y);
                if (!K) this._state = Om, this.sendFrame(c86.frame(A, _), z), this.dequeue();
                else this.dispatch(A, K, _, z)
            }).catch((Y) => {
                process.nextTick(VT5, this, Y, z)
            })
        }
        dispatch(q, K, _, z) {
            if (!K) {
                this.sendFrame(c86.frame(q, _), z);
                return
            }
            let Y = this._extensions[aT7.extensionName];
            this._bufferedBytes += _[bC], this._state = vT5, Y.compress(q, _.fin, (A, O) => {
                if (this._socket.destroyed) {
                    let w = Error("The socket was closed while data was being compressed");
                    u71(this, w, z);
                    return
                }
                this._bufferedBytes -= _[bC], this._state = Om, _.readOnly = !1, this.sendFrame(c86.frame(O, _), z), this.dequeue()
            })
        }
        dequeue() {
            while (this._state === Om && this._queue.length) {
                let q = this._queue.shift();
                this._bufferedBytes -= q[3][bC], Reflect.apply(q[0], this, q.slice(1))
            }
        }
        enqueue(q) {
            this._bufferedBytes += q[3][bC], this._queue.push(q)
        }
        sendFrame(q, K) {
            if (q.length === 2) this._socket.cork(), this._socket.write(q[0]), this._socket.write(q[1], K), this._socket.uncork();
            else this._socket.write(q[0], K)
        }
    }
    tT7.exports = c86;

    function u71(q, K, _) {
        if (typeof _ === "function") _(K);
        for (let z = 0; z < q._queue.length; z++) {
            let Y = q._queue[z],
                A = Y[Y.length - 1];
            if (typeof A === "function") A(K)
        }
    }

    function VT5(q, K, _) {
        u71(q, K, _), q.onerror(K)
    }
})
// @from(Ln 9807, Col 4)
wV7 = p((wyA, OV7) => {
    var {
        kForOnEventAttribute: MF6,
        kListener: B71
    } = li(), eT7 = Symbol("kCode"), qV7 = Symbol("kData"), KV7 = Symbol("kError"), _V7 = Symbol("kMessage"), zV7 = Symbol("kReason"), YZ6 = Symbol("kTarget"), YV7 = Symbol("kType"), AV7 = Symbol("kWasClean");
    class l86 {
        constructor(q) {
            this[YZ6] = null, this[YV7] = q
        }
        get target() {
            return this[YZ6]
        }
        get type() {
            return this[YV7]
        }
    }
    Object.defineProperty(l86.prototype, "target", {
        enumerable: !0
    });
    Object.defineProperty(l86.prototype, "type", {
        enumerable: !0
    });
    class AZ6 extends l86 {
        constructor(q, K = {}) {
            super(q);
            this[eT7] = K.code === void 0 ? 0 : K.code, this[zV7] = K.reason === void 0 ? "" : K.reason, this[AV7] = K.wasClean === void 0 ? !1 : K.wasClean
        }
        get code() {
            return this[eT7]
        }
        get reason() {
            return this[zV7]
        }
        get wasClean() {
            return this[AV7]
        }
    }
    Object.defineProperty(AZ6.prototype, "code", {
        enumerable: !0
    });
    Object.defineProperty(AZ6.prototype, "reason", {
        enumerable: !0
    });
    Object.defineProperty(AZ6.prototype, "wasClean", {
        enumerable: !0
    });
    class PF6 extends l86 {
        constructor(q, K = {}) {
            super(q);
            this[KV7] = K.error === void 0 ? null : K.error, this[_V7] = K.message === void 0 ? "" : K.message
        }
        get error() {
            return this[KV7]
        }
        get message() {
            return this[_V7]
        }
    }
    Object.defineProperty(PF6.prototype, "error", {
        enumerable: !0
    });
    Object.defineProperty(PF6.prototype, "message", {
        enumerable: !0
    });
    class X28 extends l86 {
        constructor(q, K = {}) {
            super(q);
            this[qV7] = K.data === void 0 ? null : K.data
        }
        get data() {
            return this[qV7]
        }
    }
    Object.defineProperty(X28.prototype, "data", {
        enumerable: !0
    });
    var kT5 = {
        addEventListener(q, K, _ = {}) {
            for (let Y of this.listeners(q))
                if (!_[MF6] && Y[B71] === K && !Y[MF6]) return;
            let z;
            if (q === "message") z = function(A, O) {
                let w = new X28("message", {
                    data: O ? A : A.toString()
                });
                w[YZ6] = this, J28(K, this, w)
            };
            else if (q === "close") z = function(A, O) {
                let w = new AZ6("close", {
                    code: A,
                    reason: O.toString(),
                    wasClean: this._closeFrameReceived && this._closeFrameSent
                });
                w[YZ6] = this, J28(K, this, w)
            };
            else if (q === "error") z = function(A) {
                let O = new PF6("error", {
                    error: A,
                    message: A.message
                });
                O[YZ6] = this, J28(K, this, O)
            };
            else if (q === "open") z = function() {
                let A = new l86("open");
                A[YZ6] = this, J28(K, this, A)
            };
            else return;
            if (z[MF6] = !!_[MF6], z[B71] = K, _.once) this.once(q, z);
            else this.on(q, z)
        },
        removeEventListener(q, K) {
            for (let _ of this.listeners(q))
                if (_[B71] === K && !_[MF6]) {
                    this.removeListener(q, _);
                    break
                }
        }
    };
    OV7.exports = {
        CloseEvent: AZ6,
        ErrorEvent: PF6,
        Event: l86,
        EventTarget: kT5,
        MessageEvent: X28
    };

    function J28(q, K, _) {
        if (typeof q === "object" && q.handleEvent) q.handleEvent.call(q, _);
        else q.call(K, _)
    }
})
// @from(Ln 9938, Col 4)
p71 = p(($yA, $V7) => {
    var {
        tokenChars: WF6
    } = KZ6();

    function sg(q, K, _) {
        if (q[K] === void 0) q[K] = [_];
        else q[K].push(_)
    }

    function NT5(q) {
        let K = Object.create(null),
            _ = Object.create(null),
            z = !1,
            Y = !1,
            A = !1,
            O, w, $ = -1,
            j = -1,
            H = -1,
            J = 0;
        for (; J < q.length; J++)
            if (j = q.charCodeAt(J), O === void 0)
                if (H === -1 && WF6[j] === 1) {
                    if ($ === -1) $ = J
                } else if (J !== 0 && (j === 32 || j === 9)) {
            if (H === -1 && $ !== -1) H = J
        } else if (j === 59 || j === 44) {
            if ($ === -1) throw SyntaxError(`Unexpected character at index ${J}`);
            if (H === -1) H = J;
            let M = q.slice($, H);
            if (j === 44) sg(K, M, _), _ = Object.create(null);
            else O = M;
            $ = H = -1
        } else throw SyntaxError(`Unexpected character at index ${J}`);
        else if (w === void 0)
            if (H === -1 && WF6[j] === 1) {
                if ($ === -1) $ = J
            } else if (j === 32 || j === 9) {
            if (H === -1 && $ !== -1) H = J
        } else if (j === 59 || j === 44) {
            if ($ === -1) throw SyntaxError(`Unexpected character at index ${J}`);
            if (H === -1) H = J;
            if (sg(_, q.slice($, H), !0), j === 44) sg(K, O, _), _ = Object.create(null), O = void 0;
            $ = H = -1
        } else if (j === 61 && $ !== -1 && H === -1) w = q.slice($, J), $ = H = -1;
        else throw SyntaxError(`Unexpected character at index ${J}`);
        else if (Y) {
            if (WF6[j] !== 1) throw SyntaxError(`Unexpected character at index ${J}`);
            if ($ === -1) $ = J;
            else if (!z) z = !0;
            Y = !1
        } else if (A)
            if (WF6[j] === 1) {
                if ($ === -1) $ = J
            } else if (j === 34 && $ !== -1) A = !1, H = J;
        else if (j === 92) Y = !0;
        else throw SyntaxError(`Unexpected character at index ${J}`);
        else if (j === 34 && q.charCodeAt(J - 1) === 61) A = !0;
        else if (H === -1 && WF6[j] === 1) {
            if ($ === -1) $ = J
        } else if ($ !== -1 && (j === 32 || j === 9)) {
            if (H === -1) H = J
        } else if (j === 59 || j === 44) {
            if ($ === -1) throw SyntaxError(`Unexpected character at index ${J}`);
            if (H === -1) H = J;
            let M = q.slice($, H);
            if (z) M = M.replace(/\\/g, ""), z = !1;
            if (sg(_, w, M), j === 44) sg(K, O, _), _ = Object.create(null), O = void 0;
            w = void 0, $ = H = -1
        } else throw SyntaxError(`Unexpected character at index ${J}`);
        if ($ === -1 || A || j === 32 || j === 9) throw SyntaxError("Unexpected end of input");
        if (H === -1) H = J;
        let X = q.slice($, H);
        if (O === void 0) sg(K, X, _);
        else {
            if (w === void 0) sg(_, X, !0);
            else if (z) sg(_, w, X.replace(/\\/g, ""));
            else sg(_, w, X);
            sg(K, O, _)
        }
        return K
    }

    function ET5(q) {
        return Object.keys(q).map((K) => {
            let _ = q[K];
            if (!Array.isArray(_)) _ = [_];
            return _.map((z) => {
                return [K].concat(Object.keys(z).map((Y) => {
                    let A = z[Y];
                    if (!Array.isArray(A)) A = [A];
                    return A.map((O) => O === !0 ? Y : `${Y}=${O}`).join("; ")
                })).join("; ")
            }).join(", ")
        }).join(", ")
    }
    $V7.exports = {
        format: ET5,
        parse: NT5
    }
})
// @from(Ln 10039, Col 4)
D28 = p((JyA, vV7) => {
    var yT5 = d6("events"),
        LT5 = d6("https"),
        hT5 = d6("http"),
        JV7 = d6("net"),
        RT5 = d6("tls"),
        {
            randomBytes: ST5,
            createHash: CT5
        } = d6("crypto"),
        {
            Duplex: jyA,
            Readable: HyA
        } = d6("stream"),
        {
            URL: F71
        } = d6("url"),
        n86 = XF6(),
        bT5 = x71(),
        IT5 = m71(),
        {
            isBlob: xT5
        } = KZ6(),
        {
            BINARY_TYPES: jV7,
            EMPTY_BUFFER: M28,
            GUID: uT5,
            kForOnEventAttribute: g71,
            kListener: mT5,
            kStatusCode: BT5,
            kWebSocket: g0,
            NOOP: XV7
        } = li(),
        {
            EventTarget: {
                addEventListener: pT5,
                removeEventListener: FT5
            }
        } = wV7(),
        {
            format: gT5,
            parse: UT5
        } = p71(),
        {
            toBuffer: QT5
        } = HF6(),
        MV7 = Symbol("kAborted"),
        U71 = [8, 13],
        ii = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"],
        dT5 = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    class C9 extends yT5 {
        constructor(q, K, _) {
            super();
            if (this._binaryType = jV7[0], this._closeCode = 1006, this._closeFrameReceived = !1, this._closeFrameSent = !1, this._closeMessage = M28, this._closeTimer = null, this._errorEmitted = !1, this._extensions = {}, this._paused = !1, this._protocol = "", this._readyState = C9.CONNECTING, this._receiver = null, this._sender = null, this._socket = null, q !== null) {
                if (this._bufferedAmount = 0, this._isServer = !1, this._redirects = 0, K === void 0) K = [];
                else if (!Array.isArray(K))
                    if (typeof K === "object" && K !== null) _ = K, K = [];
                    else K = [K];
                PV7(this, q, K, _)
            } else this._autoPong = _.autoPong, this._isServer = !0
        }
        get binaryType() {
            return this._binaryType
        }
        set binaryType(q) {
            if (!jV7.includes(q)) return;
            if (this._binaryType = q, this._receiver) this._receiver._binaryType = q
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
        setSocket(q, K, _) {
            let z = new bT5({
                    allowSynchronousEvents: _.allowSynchronousEvents,
                    binaryType: this.binaryType,
                    extensions: this._extensions,
                    isServer: this._isServer,
                    maxPayload: _.maxPayload,
                    skipUTF8Validation: _.skipUTF8Validation
                }),
                Y = new IT5(q, this._extensions, _.generateMask);
            if (this._receiver = z, this._sender = Y, this._socket = q, z[g0] = this, Y[g0] = this, q[g0] = this, z.on("conclude", nT5), z.on("drain", iT5), z.on("error", rT5), z.on("message", oT5), z.on("ping", aT5), z.on("pong", sT5), Y.onerror = tT5, q.setTimeout) q.setTimeout(0);
            if (q.setNoDelay) q.setNoDelay();
            if (K.length > 0) q.unshift(K);
            q.on("close", ZV7), q.on("data", W28), q.on("end", fV7), q.on("error", GV7), this._readyState = C9.OPEN, this.emit("open")
        }
        emitClose() {
            if (!this._socket) {
                this._readyState = C9.CLOSED, this.emit("close", this._closeCode, this._closeMessage);
                return
            }
            if (this._extensions[n86.extensionName]) this._extensions[n86.extensionName].cleanup();
            this._receiver.removeAllListeners(), this._readyState = C9.CLOSED, this.emit("close", this._closeCode, this._closeMessage)
        }
        close(q, K) {
            if (this.readyState === C9.CLOSED) return;
            if (this.readyState === C9.CONNECTING) {
                zh(this, this._req, "WebSocket was closed before the connection was established");
                return
            }
            if (this.readyState === C9.CLOSING) {
                if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) this._socket.end();
                return
            }
            this._readyState = C9.CLOSING, this._sender.close(q, K, !this._isServer, (_) => {
                if (_) return;
                if (this._closeFrameSent = !0, this._closeFrameReceived || this._receiver._writableState.errorEmitted) this._socket.end()
            }), DV7(this)
        }
        pause() {
            if (this.readyState === C9.CONNECTING || this.readyState === C9.CLOSED) return;
            this._paused = !0, this._socket.pause()
        }
        ping(q, K, _) {
            if (this.readyState === C9.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
            if (typeof q === "function") _ = q, q = K = void 0;
            else if (typeof K === "function") _ = K, K = void 0;
            if (typeof q === "number") q = q.toString();
            if (this.readyState !== C9.OPEN) {
                Q71(this, q, _);
                return
            }
            if (K === void 0) K = !this._isServer;
            this._sender.ping(q || M28, K, _)
        }
        pong(q, K, _) {
            if (this.readyState === C9.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
            if (typeof q === "function") _ = q, q = K = void 0;
            else if (typeof K === "function") _ = K, K = void 0;
            if (typeof q === "number") q = q.toString();
            if (this.readyState !== C9.OPEN) {
                Q71(this, q, _);
                return
            }
            if (K === void 0) K = !this._isServer;
            this._sender.pong(q || M28, K, _)
        }
        resume() {
            if (this.readyState === C9.CONNECTING || this.readyState === C9.CLOSED) return;
            if (this._paused = !1, !this._receiver._writableState.needDrain) this._socket.resume()
        }
        send(q, K, _) {
            if (this.readyState === C9.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
            if (typeof K === "function") _ = K, K = {};
            if (typeof q === "number") q = q.toString();
            if (this.readyState !== C9.OPEN) {
                Q71(this, q, _);
                return
            }
            let z = {
                binary: typeof q !== "string",
                mask: !this._isServer,
                compress: !0,
                fin: !0,
                ...K
            };
            if (!this._extensions[n86.extensionName]) z.compress = !1;
            this._sender.send(q || M28, z, _)
        }
        terminate() {
            if (this.readyState === C9.CLOSED) return;
            if (this.readyState === C9.CONNECTING) {
                zh(this, this._req, "WebSocket was closed before the connection was established");
                return
            }
            if (this._socket) this._readyState = C9.CLOSING, this._socket.destroy()
        }
    }
    Object.defineProperty(C9, "CONNECTING", {
        enumerable: !0,
        value: ii.indexOf("CONNECTING")
    });
    Object.defineProperty(C9.prototype, "CONNECTING", {
        enumerable: !0,
        value: ii.indexOf("CONNECTING")
    });
    Object.defineProperty(C9, "OPEN", {
        enumerable: !0,
        value: ii.indexOf("OPEN")
    });
    Object.defineProperty(C9.prototype, "OPEN", {
        enumerable: !0,
        value: ii.indexOf("OPEN")
    });
    Object.defineProperty(C9, "CLOSING", {
        enumerable: !0,
        value: ii.indexOf("CLOSING")
    });
    Object.defineProperty(C9.prototype, "CLOSING", {
        enumerable: !0,
        value: ii.indexOf("CLOSING")
    });
    Object.defineProperty(C9, "CLOSED", {
        enumerable: !0,
        value: ii.indexOf("CLOSED")
    });
    Object.defineProperty(C9.prototype, "CLOSED", {
        enumerable: !0,
        value: ii.indexOf("CLOSED")
    });
    ["binaryType", "bufferedAmount", "extensions", "isPaused", "protocol", "readyState", "url"].forEach((q) => {
        Object.defineProperty(C9.prototype, q, {
            enumerable: !0
        })
    });
    ["open", "error", "close", "message"].forEach((q) => {
        Object.defineProperty(C9.prototype, `on${q}`, {
            enumerable: !0,
            get() {
                for (let K of this.listeners(q))
                    if (K[g71]) return K[mT5];
                return null
            },
            set(K) {
                for (let _ of this.listeners(q))
                    if (_[g71]) {
                        this.removeListener(q, _);
                        break
                    } if (typeof K !== "function") return;
                this.addEventListener(q, K, {
                    [g71]: !0
                })
            }
        })
    });
    C9.prototype.addEventListener = pT5;
    C9.prototype.removeEventListener = FT5;
    vV7.exports = C9;

    function PV7(q, K, _, z) {
        let Y = {
            allowSynchronousEvents: !0,
            autoPong: !0,
            protocolVersion: U71[1],
            maxPayload: 104857600,
            skipUTF8Validation: !1,
            perMessageDeflate: !0,
            followRedirects: !1,
            maxRedirects: 10,
            ...z,
            socketPath: void 0,
            hostname: void 0,
            protocol: void 0,
            timeout: void 0,
            method: "GET",
            host: void 0,
            path: void 0,
            port: void 0
        };
        if (q._autoPong = Y.autoPong, !U71.includes(Y.protocolVersion)) throw RangeError(`Unsupported protocol version: ${Y.protocolVersion} (supported versions: ${U71.join(", ")})`);
        let A;
        if (K instanceof F71) A = K;
        else try {
            A = new F71(K)
        } catch (W) {
            throw SyntaxError(`Invalid URL: ${K}`)
        }
        if (A.protocol === "http:") A.protocol = "ws:";
        else if (A.protocol === "https:") A.protocol = "wss:";
        q._url = A.href;
        let O = A.protocol === "wss:",
            w = A.protocol === "ws+unix:",
            $;
        if (A.protocol !== "ws:" && !O && !w) $ = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
        else if (w && !A.pathname) $ = "The URL's pathname is empty";
        else if (A.hash) $ = "The URL contains a fragment identifier";
        if ($) {
            let W = SyntaxError($);
            if (q._redirects === 0) throw W;
            else {
                P28(q, W);
                return
            }
        }
        let j = O ? 443 : 80,
            H = ST5(16).toString("base64"),
            J = O ? LT5.request : hT5.request,
            X = new Set,
            M;
        if (Y.createConnection = Y.createConnection || (O ? lT5 : cT5), Y.defaultPort = Y.defaultPort || j, Y.port = A.port || j, Y.host = A.hostname.startsWith("[") ? A.hostname.slice(1, -1) : A.hostname, Y.headers = {
                ...Y.headers,
                "Sec-WebSocket-Version": Y.protocolVersion,
                "Sec-WebSocket-Key": H,
                Connection: "Upgrade",
                Upgrade: "websocket"
            }, Y.path = A.pathname + A.search, Y.timeout = Y.handshakeTimeout, Y.perMessageDeflate) M = new n86(Y.perMessageDeflate !== !0 ? Y.perMessageDeflate : {}, !1, Y.maxPayload), Y.headers["Sec-WebSocket-Extensions"] = gT5({
            [n86.extensionName]: M.offer()
        });
        if (_.length) {
            for (let W of _) {
                if (typeof W !== "string" || !dT5.test(W) || X.has(W)) throw SyntaxError("An invalid or duplicated subprotocol was specified");
                X.add(W)
            }
            Y.headers["Sec-WebSocket-Protocol"] = _.join(",")
        }
        if (Y.origin)
            if (Y.protocolVersion < 13) Y.headers["Sec-WebSocket-Origin"] = Y.origin;
            else Y.headers.Origin = Y.origin;
        if (A.username || A.password) Y.auth = `${A.username}:${A.password}`;
        if (w) {
            let W = Y.path.split(":");
            Y.socketPath = W[0], Y.path = W[1]
        }
        let P;
        if (Y.followRedirects) {
            if (q._redirects === 0) {
                q._originalIpc = w, q._originalSecure = O, q._originalHostOrSocketPath = w ? Y.socketPath : A.host;
                let W = z && z.headers;
                if (z = {
                        ...z,
                        headers: {}
                    }, W)
                    for (let [D, Z] of Object.entries(W)) z.headers[D.toLowerCase()] = Z
            } else if (q.listenerCount("redirect") === 0) {
                let W = w ? q._originalIpc ? Y.socketPath === q._originalHostOrSocketPath : !1 : q._originalIpc ? !1 : A.host === q._originalHostOrSocketPath;
                if (!W || q._originalSecure && !O) {
                    if (delete Y.headers.authorization, delete Y.headers.cookie, !W) delete Y.headers.host;
                    Y.auth = void 0
                }
            }
            if (Y.auth && !z.headers.authorization) z.headers.authorization = "Basic " + Buffer.from(Y.auth).toString("base64");
            if (P = q._req = J(Y), q._redirects) q.emit("redirect", q.url, P)
        } else P = q._req = J(Y);
        if (Y.timeout) P.on("timeout", () => {
            zh(q, P, "Opening handshake has timed out")
        });
        if (P.on("error", (W) => {
                if (P === null || P[MV7]) return;
                P = q._req = null, P28(q, W)
            }), P.on("response", (W) => {
                let D = W.headers.location,
                    Z = W.statusCode;
                if (D && Y.followRedirects && Z >= 300 && Z < 400) {
                    if (++q._redirects > Y.maxRedirects) {
                        zh(q, P, "Maximum redirects exceeded");
                        return
                    }
                    P.abort();
                    let G;
                    try {
                        G = new F71(D, K)
                    } catch (f) {
                        let v = SyntaxError(`Invalid URL: ${D}`);
                        P28(q, v);
                        return
                    }
                    PV7(q, G, _, z)
                } else if (!q.emit("unexpected-response", P, W)) zh(q, P, `Unexpected server response: ${W.statusCode}`)
            }), P.on("upgrade", (W, D, Z) => {
                if (q.emit("upgrade", W), q.readyState !== C9.CONNECTING) return;
                P = q._req = null;
                let G = W.headers.upgrade;
                if (G === void 0 || G.toLowerCase() !== "websocket") {
                    zh(q, D, "Invalid Upgrade header");
                    return
                }
                let f = CT5("sha1").update(H + uT5).digest("base64");
                if (W.headers["sec-websocket-accept"] !== f) {
                    zh(q, D, "Invalid Sec-WebSocket-Accept header");
                    return
                }
                let v = W.headers["sec-websocket-protocol"],
                    V;
                if (v !== void 0) {
                    if (!X.size) V = "Server sent a subprotocol but none was requested";
                    else if (!X.has(v)) V = "Server sent an invalid subprotocol"
                } else if (X.size) V = "Server sent no subprotocol";
                if (V) {
                    zh(q, D, V);
                    return
                }
                if (v) q._protocol = v;
                let k = W.headers["sec-websocket-extensions"];
                if (k !== void 0) {
                    if (!M) {
                        zh(q, D, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
                        return
                    }
                    let N;
                    try {
                        N = UT5(k)
                    } catch (h) {
                        zh(q, D, "Invalid Sec-WebSocket-Extensions header");
                        return
                    }
                    let R = Object.keys(N);
                    if (R.length !== 1 || R[0] !== n86.extensionName) {
                        zh(q, D, "Server indicated an extension that was not requested");
                        return
                    }
                    try {
                        M.accept(N[n86.extensionName])
                    } catch (h) {
                        zh(q, D, "Invalid Sec-WebSocket-Extensions header");
                        return
                    }
                    q._extensions[n86.extensionName] = M
                }
                q.setSocket(D, Z, {
                    allowSynchronousEvents: Y.allowSynchronousEvents,
                    generateMask: Y.generateMask,
                    maxPayload: Y.maxPayload,
                    skipUTF8Validation: Y.skipUTF8Validation
                })
            }), Y.finishRequest) Y.finishRequest(P, q);
        else P.end()
    }

    function P28(q, K) {
        q._readyState = C9.CLOSING, q._errorEmitted = !0, q.emit("error", K), q.emitClose()
    }

    function cT5(q) {
        return q.path = q.socketPath, JV7.connect(q)
    }

    function lT5(q) {
        if (q.path = void 0, !q.servername && q.servername !== "") q.servername = JV7.isIP(q.host) ? "" : q.host;
        return RT5.connect(q)
    }

    function zh(q, K, _) {
        q._readyState = C9.CLOSING;
        let z = Error(_);
        if (Error.captureStackTrace(z, zh), K.setHeader) {
            if (K[MV7] = !0, K.abort(), K.socket && !K.socket.destroyed) K.socket.destroy();
            process.nextTick(P28, q, z)
        } else K.destroy(z), K.once("error", q.emit.bind(q, "error")), K.once("close", q.emitClose.bind(q))
    }

    function Q71(q, K, _) {
        if (K) {
            let z = xT5(K) ? K.size : QT5(K).length;
            if (q._socket) q._sender._bufferedBytes += z;
            else q._bufferedAmount += z
        }
        if (_) {
            let z = Error(`WebSocket is not open: readyState ${q.readyState} (${ii[q.readyState]})`);
            process.nextTick(_, z)
        }
    }

    function nT5(q, K) {
        let _ = this[g0];
        if (_._closeFrameReceived = !0, _._closeMessage = K, _._closeCode = q, _._socket[g0] === void 0) return;
        if (_._socket.removeListener("data", W28), process.nextTick(WV7, _._socket), q === 1005) _.close();
        else _.close(q, K)
    }

    function iT5() {
        let q = this[g0];
        if (!q.isPaused) q._socket.resume()
    }

    function rT5(q) {
        let K = this[g0];
        if (K._socket[g0] !== void 0) K._socket.removeListener("data", W28), process.nextTick(WV7, K._socket), K.close(q[BT5]);
        if (!K._errorEmitted) K._errorEmitted = !0, K.emit("error", q)
    }

    function HV7() {
        this[g0].emitClose()
    }

    function oT5(q, K) {
        this[g0].emit("message", q, K)
    }

    function aT5(q) {
        let K = this[g0];
        if (K._autoPong) K.pong(q, !this._isServer, XV7);
        K.emit("ping", q)
    }

    function sT5(q) {
        this[g0].emit("pong", q)
    }

    function WV7(q) {
        q.resume()
    }

    function tT5(q) {
        let K = this[g0];
        if (K.readyState === C9.CLOSED) return;
        if (K.readyState === C9.OPEN) K._readyState = C9.CLOSING, DV7(K);
        if (this._socket.end(), !K._errorEmitted) K._errorEmitted = !0, K.emit("error", q)
    }

    function DV7(q) {
        q._closeTimer = setTimeout(q._socket.destroy.bind(q._socket), 30000)
    }

    function ZV7() {
        let q = this[g0];
        this.removeListener("close", ZV7), this.removeListener("data", W28), this.removeListener("end", fV7), q._readyState = C9.CLOSING;
        let K;
        if (!this._readableState.endEmitted && !q._closeFrameReceived && !q._receiver._writableState.errorEmitted && (K = q._socket.read()) !== null) q._receiver.write(K);
        if (q._receiver.end(), this[g0] = void 0, clearTimeout(q._closeTimer), q._receiver._writableState.finished || q._receiver._writableState.errorEmitted) q.emitClose();
        else q._receiver.on("error", HV7), q._receiver.on("finish", HV7)
    }

    function W28(q) {
        if (!this[g0]._receiver.write(q)) this.pause()
    }

    function fV7() {
        let q = this[g0];
        q._readyState = C9.CLOSING, q._receiver.end(), this.end()
    }

    function GV7() {
        let q = this[g0];
        if (this.removeListener("error", GV7), this.on("error", XV7), q) q._readyState = C9.CLOSING, this.destroy()
    }
})
// @from(Ln 10583, Col 4)
NV7 = p((MyA, kV7) => {
    var XyA = D28(),
        {
            Duplex: eT5
        } = d6("stream");

    function TV7(q) {
        q.emit("close")
    }

    function qV5() {
        if (!this.destroyed && this._writableState.finished) this.destroy()
    }

    function VV7(q) {
        if (this.removeListener("error", VV7), this.destroy(), this.listenerCount("error") === 0) this.emit("error", q)
    }

    function KV5(q, K) {
        let _ = !0,
            z = new eT5({
                ...K,
                autoDestroy: !1,
                emitClose: !1,
                objectMode: !1,
                writableObjectMode: !1
            });
        return q.on("message", function(A, O) {
            let w = !O && z._readableState.objectMode ? A.toString() : A;
            if (!z.push(w)) q.pause()
        }), q.once("error", function(A) {
            if (z.destroyed) return;
            _ = !1, z.destroy(A)
        }), q.once("close", function() {
            if (z.destroyed) return;
            z.push(null)
        }), z._destroy = function(Y, A) {
            if (q.readyState === q.CLOSED) {
                A(Y), process.nextTick(TV7, z);
                return
            }
            let O = !1;
            if (q.once("error", function($) {
                    O = !0, A($)
                }), q.once("close", function() {
                    if (!O) A(Y);
                    process.nextTick(TV7, z)
                }), _) q.terminate()
        }, z._final = function(Y) {
            if (q.readyState === q.CONNECTING) {
                q.once("open", function() {
                    z._final(Y)
                });
                return
            }
            if (q._socket === null) return;
            if (q._socket._writableState.finished) {
                if (Y(), z._readableState.endEmitted) z.destroy()
            } else q._socket.once("finish", function() {
                Y()
            }), q.close()
        }, z._read = function() {
            if (q.isPaused) q.resume()
        }, z._write = function(Y, A, O) {
            if (q.readyState === q.CONNECTING) {
                q.once("open", function() {
                    z._write(Y, A, O)
                });
                return
            }
            q.send(Y, O)
        }, z.on("end", qV5), z.on("error", VV7), z
    }
    kV7.exports = KV5
})
// @from(Ln 10658, Col 4)
yV7 = p((PyA, EV7) => {
    var {
        tokenChars: _V5
    } = KZ6();

    function zV5(q) {
        let K = new Set,
            _ = -1,
            z = -1,
            Y = 0;
        for (Y; Y < q.length; Y++) {
            let O = q.charCodeAt(Y);
            if (z === -1 && _V5[O] === 1) {
                if (_ === -1) _ = Y
            } else if (Y !== 0 && (O === 32 || O === 9)) {
                if (z === -1 && _ !== -1) z = Y
            } else if (O === 44) {
                if (_ === -1) throw SyntaxError(`Unexpected character at index ${Y}`);
                if (z === -1) z = Y;
                let w = q.slice(_, z);
                if (K.has(w)) throw SyntaxError(`The "${w}" subprotocol is duplicated`);
                K.add(w), _ = z = -1
            } else throw SyntaxError(`Unexpected character at index ${Y}`)
        }
        if (_ === -1 || z !== -1) throw SyntaxError("Unexpected end of input");
        let A = q.slice(_, Y);
        if (K.has(A)) throw SyntaxError(`The "${A}" subprotocol is duplicated`);
        return K.add(A), K
    }
    EV7.exports = {
        parse: zV5
    }
})
// @from(Ln 10691, Col 4)
CV7 = p((DyA, SV7) => {
    var YV5 = d6("events"),
        Z28 = d6("http"),
        {
            Duplex: WyA
        } = d6("stream"),
        {
            createHash: AV5
        } = d6("crypto"),
        LV7 = p71(),
        bY6 = XF6(),
        OV5 = yV7(),
        wV5 = D28(),
        {
            GUID: $V5,
            kWebSocket: jV5
        } = li(),
        HV5 = /^[+/0-9A-Za-z]{22}==$/;
    class RV7 extends YV5 {
        constructor(q, K) {
            super();
            if (q = {
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
                    WebSocket: wV5,
                    ...q
                }, q.port == null && !q.server && !q.noServer || q.port != null && (q.server || q.noServer) || q.server && q.noServer) throw TypeError('One and only one of the "port", "server", or "noServer" options must be specified');
            if (q.port != null) this._server = Z28.createServer((_, z) => {
                let Y = Z28.STATUS_CODES[426];
                z.writeHead(426, {
                    "Content-Length": Y.length,
                    "Content-Type": "text/plain"
                }), z.end(Y)
            }), this._server.listen(q.port, q.host, q.backlog, K);
            else if (q.server) this._server = q.server;
            if (this._server) {
                let _ = this.emit.bind(this, "connection");
                this._removeListeners = JV5(this._server, {
                    listening: this.emit.bind(this, "listening"),
                    error: this.emit.bind(this, "error"),
                    upgrade: (z, Y, A) => {
                        this.handleUpgrade(z, Y, A, _)
                    }
                })
            }
            if (q.perMessageDeflate === !0) q.perMessageDeflate = {};
            if (q.clientTracking) this.clients = new Set, this._shouldEmitClose = !1;
            this.options = q, this._state = 0
        }
        address() {
            if (this.options.noServer) throw Error('The server is operating in "noServer" mode');
            if (!this._server) return null;
            return this._server.address()
        }
        close(q) {
            if (this._state === 2) {
                if (q) this.once("close", () => {
                    q(Error("The server is not running"))
                });
                process.nextTick(DF6, this);
                return
            }
            if (q) this.once("close", q);
            if (this._state === 1) return;
            if (this._state = 1, this.options.noServer || this.options.server) {
                if (this._server) this._removeListeners(), this._removeListeners = this._server = null;
                if (this.clients)
                    if (!this.clients.size) process.nextTick(DF6, this);
                    else this._shouldEmitClose = !0;
                else process.nextTick(DF6, this)
            } else {
                let K = this._server;
                this._removeListeners(), this._removeListeners = this._server = null, K.close(() => {
                    DF6(this)
                })
            }
        }
        shouldHandle(q) {
            if (this.options.path) {
                let K = q.url.indexOf("?");
                if ((K !== -1 ? q.url.slice(0, K) : q.url) !== this.options.path) return !1
            }
            return !0
        }
        handleUpgrade(q, K, _, z) {
            K.on("error", hV7);
            let Y = q.headers["sec-websocket-key"],
                A = q.headers.upgrade,
                O = +q.headers["sec-websocket-version"];
            if (q.method !== "GET") {
                IY6(this, q, K, 405, "Invalid HTTP method");
                return
            }
            if (A === void 0 || A.toLowerCase() !== "websocket") {
                IY6(this, q, K, 400, "Invalid Upgrade header");
                return
            }
            if (Y === void 0 || !HV5.test(Y)) {
                IY6(this, q, K, 400, "Missing or invalid Sec-WebSocket-Key header");
                return
            }
            if (O !== 13 && O !== 8) {
                IY6(this, q, K, 400, "Missing or invalid Sec-WebSocket-Version header", {
                    "Sec-WebSocket-Version": "13, 8"
                });
                return
            }
            if (!this.shouldHandle(q)) {
                ZF6(K, 400);
                return
            }
            let w = q.headers["sec-websocket-protocol"],
                $ = new Set;
            if (w !== void 0) try {
                $ = OV5.parse(w)
            } catch (J) {
                IY6(this, q, K, 400, "Invalid Sec-WebSocket-Protocol header");
                return
            }
            let j = q.headers["sec-websocket-extensions"],
                H = {};
            if (this.options.perMessageDeflate && j !== void 0) {
                let J = new bY6(this.options.perMessageDeflate, !0, this.options.maxPayload);
                try {
                    let X = LV7.parse(j);
                    if (X[bY6.extensionName]) J.accept(X[bY6.extensionName]), H[bY6.extensionName] = J
                } catch (X) {
                    IY6(this, q, K, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header");
                    return
                }
            }
            if (this.options.verifyClient) {
                let J = {
                    origin: q.headers[`${O===8?"sec-websocket-origin":"origin"}`],
                    secure: !!(q.socket.authorized || q.socket.encrypted),
                    req: q
                };
                if (this.options.verifyClient.length === 2) {
                    this.options.verifyClient(J, (X, M, P, W) => {
                        if (!X) return ZF6(K, M || 401, P, W);
                        this.completeUpgrade(H, Y, $, q, K, _, z)
                    });
                    return
                }
                if (!this.options.verifyClient(J)) return ZF6(K, 401)
            }
            this.completeUpgrade(H, Y, $, q, K, _, z)
        }
        completeUpgrade(q, K, _, z, Y, A, O) {
            if (!Y.readable || !Y.writable) return Y.destroy();
            if (Y[jV5]) throw Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
            if (this._state > 0) return ZF6(Y, 503);
            let $ = ["HTTP/1.1 101 Switching Protocols", "Upgrade: websocket", "Connection: Upgrade", `Sec-WebSocket-Accept: ${AV5("sha1").update(K+$V5).digest("base64")}`],
                j = new this.options.WebSocket(null, void 0, this.options);
            if (_.size) {
                let H = this.options.handleProtocols ? this.options.handleProtocols(_, z) : _.values().next().value;
                if (H) $.push(`Sec-WebSocket-Protocol: ${H}`), j._protocol = H
            }
            if (q[bY6.extensionName]) {
                let H = q[bY6.extensionName].params,
                    J = LV7.format({
                        [bY6.extensionName]: [H]
                    });
                $.push(`Sec-WebSocket-Extensions: ${J}`), j._extensions = q
            }
            if (this.emit("headers", $, z), Y.write($.concat(`\r
`).join(`\r
`)), Y.removeListener("error", hV7), j.setSocket(Y, A, {
                    allowSynchronousEvents: this.options.allowSynchronousEvents,
                    maxPayload: this.options.maxPayload,
                    skipUTF8Validation: this.options.skipUTF8Validation
                }), this.clients) this.clients.add(j), j.on("close", () => {
                if (this.clients.delete(j), this._shouldEmitClose && !this.clients.size) process.nextTick(DF6, this)
            });
            O(j, z)
        }
    }
    SV7.exports = RV7;

    function JV5(q, K) {
        for (let _ of Object.keys(K)) q.on(_, K[_]);
        return function() {
            for (let z of Object.keys(K)) q.removeListener(z, K[z])
        }
    }

    function DF6(q) {
        q._state = 2, q.emit("close")
    }

    function hV7() {
        this.destroy()
    }

    function ZF6(q, K, _, z) {
        _ = _ || Z28.STATUS_CODES[K], z = {
            Connection: "close",
            "Content-Type": "text/html",
            "Content-Length": Buffer.byteLength(_),
            ...z
        }, q.once("finish", q.destroy), q.end(`HTTP/1.1 ${K} ${Z28.STATUS_CODES[K]}\r
` + Object.keys(z).map((Y) => `${Y}: ${z[Y]}`).join(`\r
`) + `\r
\r
` + _)
    }

    function IY6(q, K, _, z, Y, A) {
        if (q.listenerCount("wsClientError")) {
            let O = Error(Y);
            Error.captureStackTrace(O, IY6), q.emit("wsClientError", O, _, K)
        } else ZF6(_, z, Y, A)
    }
})
// @from(Ln 10917, Col 4)
fF6 = {}
// @from(Ln 10926, Col 4)
bV7
// @from(Ln 10926, Col 9)
IV7
// @from(Ln 10926, Col 14)
xV7
// @from(Ln 10926, Col 19)
d71
// @from(Ln 10926, Col 24)
uV7
// @from(Ln 10926, Col 29)
xZ
// @from(Ln 10927, Col 4)
xY6 = L(() => {
    bV7 = K6(NV7(), 1), IV7 = K6(x71(), 1), xV7 = K6(m71(), 1), d71 = K6(D28(), 1), uV7 = K6(CV7(), 1), xZ = d71.default
})
// @from(Ln 10943, Col 0)
function WV5(q) {
    return "result" in q || "error" in q
}
// @from(Ln 10947, Col 0)
function DV5(q) {
    return "method" in q && typeof q.method === "string"
}
// @from(Ln 10950, Col 0)
class BV7 {
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
    constructor(q) {
        this.context = q
    }
    async connect() {
        let {
            serverName: q,
            logger: K
        } = this.context;
        if (this.connecting) {
            K.info(`[${q}] Already connecting, skipping duplicate attempt`);
            return
        }
        this.closeSocket(), this.connecting = !0;
        let _ = this.context.getSocketPath?.() ?? this.context.socketPath;
        K.info(`[${q}] Attempting to connect to: ${_}`);
        try {
            await this.validateSocketSecurity(_)
        } catch (Y) {
            this.connecting = !1, K.info(`[${q}] Security validation failed:`, Y);
            return
        }
        this.socket = XV5(_);
        let z = setTimeout(() => {
            if (!this.connected) K.info(`[${q}] Connection attempt timed out after 5000ms`), this.closeSocket(), this.scheduleReconnect()
        }, 5000);
        this.socket.on("connect", () => {
            clearTimeout(z), this.connected = !0, this.connecting = !1, this.reconnectAttempts = 0, K.info(`[${q}] Successfully connected to bridge server`)
        }), this.socket.on("data", (Y) => {
            this.responseBuffer = Buffer.concat([this.responseBuffer, Y]);
            while (this.responseBuffer.length >= 4) {
                let A = this.responseBuffer.readUInt32LE(0);
                if (this.responseBuffer.length < 4 + A) break;
                let O = this.responseBuffer.slice(4, 4 + A);
                this.responseBuffer = this.responseBuffer.slice(4 + A);
                try {
                    let w = JSON.parse(O.toString("utf-8"));
                    if (DV5(w)) {
                        if (K.info(`[${q}] Received notification: ${w.method}`), this.notificationHandler) this.notificationHandler(w)
                    } else if (WV5(w)) K.info(`[${q}] Received tool response: ${w}`), this.handleResponse(w);
                    else K.info(`[${q}] Received unknown message: ${w}`)
                } catch (w) {
                    K.info(`[${q}] Failed to parse message:`, w)
                }
            }
        }), this.socket.on("error", (Y) => {
            if (clearTimeout(z), K.info(`[${q}] Socket error (code: ${Y.code}):`, Y), this.connected = !1, this.connecting = !1, Y.code && ["ECONNREFUSED", "ECONNRESET", "EPIPE", "ENOENT", "EOPNOTSUPP", "ECONNABORTED"].includes(Y.code)) this.scheduleReconnect()
        }), this.socket.on("close", () => {
            clearTimeout(z), this.connected = !1, this.connecting = !1, this.scheduleReconnect()
        })
    }
    scheduleReconnect() {
        let {
            serverName: q,
            logger: K
        } = this.context;
        if (this.disableAutoReconnect) return;
        if (this.reconnectTimer) {
            K.info(`[${q}] Reconnect already scheduled, skipping`);
            return
        }
        this.reconnectAttempts++;
        let _ = 100;
        if (this.reconnectAttempts > _) {
            K.info(`[${q}] Giving up after ${_} attempts. Will retry on next tool call.`), this.reconnectAttempts = 0;
            return
        }
        let z = Math.min(this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1), 30000);
        if (this.reconnectAttempts <= this.maxReconnectAttempts) K.info(`[${q}] Reconnecting in ${Math.round(z)}ms (attempt ${this.reconnectAttempts})`);
        else if (this.reconnectAttempts % 10 === 0) K.info(`[${q}] Still polling for native host (attempt ${this.reconnectAttempts})`);
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null, this.connect()
        }, z)
    }
    handleResponse(q) {
        if (this.responseCallback) {
            let K = this.responseCallback;
            this.responseCallback = null, K(q)
        }
    }
    setNotificationHandler(q) {
        this.notificationHandler = q
    }
    async ensureConnected() {
        let {
            serverName: q
        } = this.context;
        if (this.connected && this.socket) return !0;
        if (!this.socket && !this.connecting) await this.connect();
        return new Promise((K, _) => {
            let z = null,
                Y = setTimeout(() => {
                    if (z) clearTimeout(z);
                    _(new PV(`[${q}] Connection attempt timed out after 5000ms`))
                }, 5000),
                A = () => {
                    if (this.connected) clearTimeout(Y), K(!0);
                    else z = setTimeout(A, 500)
                };
            A()
        })
    }
    async sendRequest(q, K = 30000) {
        let {
            serverName: _
        } = this.context;
        if (!this.socket) throw new PV(`[${_}] Cannot send request: not connected`);
        let z = this.socket;
        return new Promise((Y, A) => {
            let O = setTimeout(() => {
                this.responseCallback = null, A(new PV(`[${_}] Tool request timed out after ${K}ms`))
            }, K);
            this.responseCallback = (J) => {
                clearTimeout(O), Y(J)
            };
            let w = JSON.stringify(q),
                $ = Buffer.from(w, "utf-8"),
                j = Buffer.allocUnsafe(4);
            j.writeUInt32LE($.length, 0);
            let H = Buffer.concat([j, $]);
            z.write(H)
        })
    }
    async callTool(q, K, _) {
        let z = {
            method: "execute_tool",
            params: {
                client_id: this.context.clientTypeId,
                tool: q,
                args: K
            }
        };
        return this.sendRequestWithRetry(z)
    }
    async sendRequestWithRetry(q) {
        let {
            serverName: K,
            logger: _
        } = this.context;
        try {
            return await this.sendRequest(q)
        } catch (z) {
            if (!(z instanceof PV)) throw z;
            return _.info(`[${K}] Connection error, forcing reconnect and retrying: ${z.message}`), this.closeSocket(), await this.ensureConnected(), await this.sendRequest(q)
        }
    }
    async setPermissionMode(q, K) {}
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
    async validateSocketSecurity(q) {
        let {
            serverName: K,
            logger: _
        } = this.context;
        if (MV5() === "win32") return;
        try {
            let z = PV5(q);
            if ((z.split("/").pop() || "").startsWith("claude-mcp-browser-bridge-")) try {
                let j = await mV7.stat(z);
                if (j.isDirectory()) {
                    let H = j.mode & 511;
                    if (H !== 448) throw Error(`[${K}] Insecure socket directory permissions: ${H.toString(8)} (expected 0700). Directory may have been tampered with.`);
                    let J = process.getuid?.();
                    if (J !== void 0 && j.uid !== J) throw Error(`Socket directory not owned by current user (uid: ${J}, dir uid: ${j.uid}). Potential security risk.`)
                }
            } catch (j) {
                if (j.code !== "ENOENT") throw j
            }
            let O = await mV7.stat(q);
            if (!O.isSocket()) throw Error(`[${K}] Path exists but it's not a socket: ${q}`);
            let w = O.mode & 511;
            if (w !== 384) throw Error(`[${K}] Insecure socket permissions: ${w.toString(8)} (expected 0600). Socket may have been tampered with.`);
            let $ = process.getuid?.();
            if ($ !== void 0 && O.uid !== $) throw Error(`Socket not owned by current user (uid: ${$}, socket uid: ${O.uid}). Potential security risk.`);
            _.info(`[${K}] Socket security validation passed`)
        } catch (z) {
            if (z.code === "ENOENT") {
                _.info(`[${K}] Socket not found, will be created by server`);
                return
            }
            throw z
        }
    }
}
// @from(Ln 11159, Col 0)
function f28(q) {
    return new BV7(q)
}
// @from(Ln 11162, Col 4)
PV
// @from(Ln 11163, Col 4)
GF6 = L(() => {
    PV = class PV extends Error {
        constructor(q) {
            super(q);
            this.name = "SocketConnectionError"
        }
    }
})
// @from(Ln 11172, Col 0)
function G28() {
    return process.platform === "darwin" ? "macOS" : process.platform === "win32" ? "Windows" : "Linux"
}