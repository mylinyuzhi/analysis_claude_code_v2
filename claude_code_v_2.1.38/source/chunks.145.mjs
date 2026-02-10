
// @from(Ln 368759, Col 4)
jCA = R((wNH, qo4) => {
    var {
        Duplex: zNH
    } = h1("stream"), {
        randomFillSync: IuY
    } = h1("crypto"), er4 = tg1(), {
        EMPTY_BUFFER: xuY,
        kWebSocket: buY,
        NOOP: uuY
    } = sd(), {
        isBlob: DG1,
        isValidStatusCode: BuY
    } = XG1(), {
        mask: Ao4,
        toBuffer: U51
    } = ag1(), Yy = Symbol("kByteLength"), muY = Buffer.alloc(4), p51, jG1 = 8192, yI = 0, FuY = 1, QuY = 2;
    class bt {
        constructor(A, q, K) {
            if (this._extensions = q || {}, K) this._generateMask = K, this._maskBuffer = Buffer.alloc(4);
            this._socket = A, this._firstFragment = !0, this._compress = !1, this._bufferedBytes = 0, this._queue = [], this._state = yI, this.onerror = uuY, this[buY] = void 0
        }
        static frame(A, q) {
            let K, Y = !1,
                z = 2,
                w = !1;
            if (q.mask) {
                if (K = q.maskBuffer || muY, q.generateMask) q.generateMask(K);
                else {
                    if (jG1 === 8192) {
                        if (p51 === void 0) p51 = Buffer.alloc(8192);
                        IuY(p51, 0, 8192), jG1 = 0
                    }
                    K[0] = p51[jG1++], K[1] = p51[jG1++], K[2] = p51[jG1++], K[3] = p51[jG1++]
                }
                w = (K[0] | K[1] | K[2] | K[3]) === 0, z = 6
            }
            let H;
            if (typeof A === "string")
                if ((!q.mask || w) && q[Yy] !== void 0) H = q[Yy];
                else A = Buffer.from(A), H = A.length;
            else H = A.length, Y = q.mask && q.readOnly && !w;
            let $ = H;
            if (H >= 65536) z += 8, $ = 127;
            else if (H > 125) z += 2, $ = 126;
            let O = Buffer.allocUnsafe(Y ? H + z : z);
            if (O[0] = q.fin ? q.opcode | 128 : q.opcode, q.rsv1) O[0] |= 64;
            if (O[1] = $, $ === 126) O.writeUInt16BE(H, 2);
            else if ($ === 127) O[2] = O[3] = 0, O.writeUIntBE(H, 4, 6);
            if (!q.mask) return [O, A];
            if (O[1] |= 128, O[z - 4] = K[0], O[z - 3] = K[1], O[z - 2] = K[2], O[z - 1] = K[3], w) return [O, A];
            if (Y) return Ao4(A, K, O, z, H), [O];
            return Ao4(A, K, A, 0, H), [O, A]
        }
        close(A, q, K, Y) {
            let z;
            if (A === void 0) z = xuY;
            else if (typeof A !== "number" || !BuY(A)) throw TypeError("First argument must be a valid error code number");
            else if (q === void 0 || !q.length) z = Buffer.allocUnsafe(2), z.writeUInt16BE(A, 0);
            else {
                let H = Buffer.byteLength(q);
                if (H > 123) throw RangeError("The message must not be greater than 123 bytes");
                if (z = Buffer.allocUnsafe(2 + H), z.writeUInt16BE(A, 0), typeof q === "string") z.write(q, 2);
                else z.set(q, 2)
            }
            let w = {
                [Yy]: z.length,
                fin: !0,
                generateMask: this._generateMask,
                mask: K,
                maskBuffer: this._maskBuffer,
                opcode: 8,
                readOnly: !1,
                rsv1: !1
            };
            if (this._state !== yI) this.enqueue([this.dispatch, z, !1, w, Y]);
            else this.sendFrame(bt.frame(z, w), Y)
        }
        ping(A, q, K) {
            let Y, z;
            if (typeof A === "string") Y = Buffer.byteLength(A), z = !1;
            else if (DG1(A)) Y = A.size, z = !1;
            else A = U51(A), Y = A.length, z = U51.readOnly;
            if (Y > 125) throw RangeError("The data size must not be greater than 125 bytes");
            let w = {
                [Yy]: Y,
                fin: !0,
                generateMask: this._generateMask,
                mask: q,
                maskBuffer: this._maskBuffer,
                opcode: 9,
                readOnly: z,
                rsv1: !1
            };
            if (DG1(A))
                if (this._state !== yI) this.enqueue([this.getBlobData, A, !1, w, K]);
                else this.getBlobData(A, !1, w, K);
            else if (this._state !== yI) this.enqueue([this.dispatch, A, !1, w, K]);
            else this.sendFrame(bt.frame(A, w), K)
        }
        pong(A, q, K) {
            let Y, z;
            if (typeof A === "string") Y = Buffer.byteLength(A), z = !1;
            else if (DG1(A)) Y = A.size, z = !1;
            else A = U51(A), Y = A.length, z = U51.readOnly;
            if (Y > 125) throw RangeError("The data size must not be greater than 125 bytes");
            let w = {
                [Yy]: Y,
                fin: !0,
                generateMask: this._generateMask,
                mask: q,
                maskBuffer: this._maskBuffer,
                opcode: 10,
                readOnly: z,
                rsv1: !1
            };
            if (DG1(A))
                if (this._state !== yI) this.enqueue([this.getBlobData, A, !1, w, K]);
                else this.getBlobData(A, !1, w, K);
            else if (this._state !== yI) this.enqueue([this.dispatch, A, !1, w, K]);
            else this.sendFrame(bt.frame(A, w), K)
        }
        send(A, q, K) {
            let Y = this._extensions[er4.extensionName],
                z = q.binary ? 2 : 1,
                w = q.compress,
                H, $;
            if (typeof A === "string") H = Buffer.byteLength(A), $ = !1;
            else if (DG1(A)) H = A.size, $ = !1;
            else A = U51(A), H = A.length, $ = U51.readOnly;
            if (this._firstFragment) {
                if (this._firstFragment = !1, w && Y && Y.params[Y._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) w = H >= Y._threshold;
                this._compress = w
            } else w = !1, z = 0;
            if (q.fin) this._firstFragment = !0;
            let O = {
                [Yy]: H,
                fin: q.fin,
                generateMask: this._generateMask,
                mask: q.mask,
                maskBuffer: this._maskBuffer,
                opcode: z,
                readOnly: $,
                rsv1: w
            };
            if (DG1(A))
                if (this._state !== yI) this.enqueue([this.getBlobData, A, this._compress, O, K]);
                else this.getBlobData(A, this._compress, O, K);
            else if (this._state !== yI) this.enqueue([this.dispatch, A, this._compress, O, K]);
            else this.dispatch(A, this._compress, O, K)
        }
        getBlobData(A, q, K, Y) {
            this._bufferedBytes += K[Yy], this._state = QuY, A.arrayBuffer().then((z) => {
                if (this._socket.destroyed) {
                    let H = Error("The socket was closed while the blob was being read");
                    process.nextTick(DCA, this, H, Y);
                    return
                }
                this._bufferedBytes -= K[Yy];
                let w = U51(z);
                if (!q) this._state = yI, this.sendFrame(bt.frame(w, K), Y), this.dequeue();
                else this.dispatch(w, q, K, Y)
            }).catch((z) => {
                process.nextTick(guY, this, z, Y)
            })
        }
        dispatch(A, q, K, Y) {
            if (!q) {
                this.sendFrame(bt.frame(A, K), Y);
                return
            }
            let z = this._extensions[er4.extensionName];
            this._bufferedBytes += K[Yy], this._state = FuY, z.compress(A, K.fin, (w, H) => {
                if (this._socket.destroyed) {
                    let $ = Error("The socket was closed while data was being compressed");
                    DCA(this, $, Y);
                    return
                }
                this._bufferedBytes -= K[Yy], this._state = yI, K.readOnly = !1, this.sendFrame(bt.frame(H, K), Y), this.dequeue()
            })
        }
        dequeue() {
            while (this._state === yI && this._queue.length) {
                let A = this._queue.shift();
                this._bufferedBytes -= A[3][Yy], Reflect.apply(A[0], this, A.slice(1))
            }
        }
        enqueue(A) {
            this._bufferedBytes += A[3][Yy], this._queue.push(A)
        }
        sendFrame(A, q) {
            if (A.length === 2) this._socket.cork(), this._socket.write(A[0]), this._socket.write(A[1], q), this._socket.uncork();
            else this._socket.write(A[0], q)
        }
    }
    qo4.exports = bt;

    function DCA(A, q, K) {
        if (typeof K === "function") K(q);
        for (let Y = 0; Y < A._queue.length; Y++) {
            let z = A._queue[Y],
                w = z[z.length - 1];
            if (typeof w === "function") w(q)
        }
    }

    function guY(A, q, K) {
        DCA(A, q, K), A.onerror(q)
    }
})
// @from(Ln 368968, Col 4)
Jo4 = R((HNH, _o4) => {
    var {
        kForOnEventAttribute: eg1,
        kListener: MCA
    } = sd(), Ko4 = Symbol("kCode"), Yo4 = Symbol("kData"), zo4 = Symbol("kError"), wo4 = Symbol("kMessage"), Ho4 = Symbol("kReason"), MG1 = Symbol("kTarget"), $o4 = Symbol("kType"), Oo4 = Symbol("kWasClean");
    class ut {
        constructor(A) {
            this[MG1] = null, this[$o4] = A
        }
        get target() {
            return this[MG1]
        }
        get type() {
            return this[$o4]
        }
    }
    Object.defineProperty(ut.prototype, "target", {
        enumerable: !0
    });
    Object.defineProperty(ut.prototype, "type", {
        enumerable: !0
    });
    class PG1 extends ut {
        constructor(A, q = {}) {
            super(A);
            this[Ko4] = q.code === void 0 ? 0 : q.code, this[Ho4] = q.reason === void 0 ? "" : q.reason, this[Oo4] = q.wasClean === void 0 ? !1 : q.wasClean
        }
        get code() {
            return this[Ko4]
        }
        get reason() {
            return this[Ho4]
        }
        get wasClean() {
            return this[Oo4]
        }
    }
    Object.defineProperty(PG1.prototype, "code", {
        enumerable: !0
    });
    Object.defineProperty(PG1.prototype, "reason", {
        enumerable: !0
    });
    Object.defineProperty(PG1.prototype, "wasClean", {
        enumerable: !0
    });
    class AU1 extends ut {
        constructor(A, q = {}) {
            super(A);
            this[zo4] = q.error === void 0 ? null : q.error, this[wo4] = q.message === void 0 ? "" : q.message
        }
        get error() {
            return this[zo4]
        }
        get message() {
            return this[wo4]
        }
    }
    Object.defineProperty(AU1.prototype, "error", {
        enumerable: !0
    });
    Object.defineProperty(AU1.prototype, "message", {
        enumerable: !0
    });
    class UG6 extends ut {
        constructor(A, q = {}) {
            super(A);
            this[Yo4] = q.data === void 0 ? null : q.data
        }
        get data() {
            return this[Yo4]
        }
    }
    Object.defineProperty(UG6.prototype, "data", {
        enumerable: !0
    });
    var UuY = {
        addEventListener(A, q, K = {}) {
            for (let z of this.listeners(A))
                if (!K[eg1] && z[MCA] === q && !z[eg1]) return;
            let Y;
            if (A === "message") Y = function(w, H) {
                let $ = new UG6("message", {
                    data: H ? w : w.toString()
                });
                $[MG1] = this, gG6(q, this, $)
            };
            else if (A === "close") Y = function(w, H) {
                let $ = new PG1("close", {
                    code: w,
                    reason: H.toString(),
                    wasClean: this._closeFrameReceived && this._closeFrameSent
                });
                $[MG1] = this, gG6(q, this, $)
            };
            else if (A === "error") Y = function(w) {
                let H = new AU1("error", {
                    error: w,
                    message: w.message
                });
                H[MG1] = this, gG6(q, this, H)
            };
            else if (A === "open") Y = function() {
                let w = new ut("open");
                w[MG1] = this, gG6(q, this, w)
            };
            else return;
            if (Y[eg1] = !!K[eg1], Y[MCA] = q, K.once) this.once(A, Y);
            else this.on(A, Y)
        },
        removeEventListener(A, q) {
            for (let K of this.listeners(A))
                if (K[MCA] === q && !K[eg1]) {
                    this.removeListener(A, K);
                    break
                }
        }
    };
    _o4.exports = {
        CloseEvent: PG1,
        ErrorEvent: AU1,
        Event: ut,
        EventTarget: UuY,
        MessageEvent: UG6
    };

    function gG6(A, q, K) {
        if (typeof A === "object" && A.handleEvent) A.handleEvent.call(A, K);
        else A.call(q, K)
    }
})
// @from(Ln 369099, Col 4)
PCA = R(($NH, Xo4) => {
    var {
        tokenChars: qU1
    } = XG1();

    function mm(A, q, K) {
        if (A[q] === void 0) A[q] = [K];
        else A[q].push(K)
    }

    function puY(A) {
        let q = Object.create(null),
            K = Object.create(null),
            Y = !1,
            z = !1,
            w = !1,
            H, $, O = -1,
            _ = -1,
            J = -1,
            X = 0;
        for (; X < A.length; X++)
            if (_ = A.charCodeAt(X), H === void 0)
                if (J === -1 && qU1[_] === 1) {
                    if (O === -1) O = X
                } else if (X !== 0 && (_ === 32 || _ === 9)) {
            if (J === -1 && O !== -1) J = X
        } else if (_ === 59 || _ === 44) {
            if (O === -1) throw SyntaxError(`Unexpected character at index ${X}`);
            if (J === -1) J = X;
            let j = A.slice(O, J);
            if (_ === 44) mm(q, j, K), K = Object.create(null);
            else H = j;
            O = J = -1
        } else throw SyntaxError(`Unexpected character at index ${X}`);
        else if ($ === void 0)
            if (J === -1 && qU1[_] === 1) {
                if (O === -1) O = X
            } else if (_ === 32 || _ === 9) {
            if (J === -1 && O !== -1) J = X
        } else if (_ === 59 || _ === 44) {
            if (O === -1) throw SyntaxError(`Unexpected character at index ${X}`);
            if (J === -1) J = X;
            if (mm(K, A.slice(O, J), !0), _ === 44) mm(q, H, K), K = Object.create(null), H = void 0;
            O = J = -1
        } else if (_ === 61 && O !== -1 && J === -1) $ = A.slice(O, X), O = J = -1;
        else throw SyntaxError(`Unexpected character at index ${X}`);
        else if (z) {
            if (qU1[_] !== 1) throw SyntaxError(`Unexpected character at index ${X}`);
            if (O === -1) O = X;
            else if (!Y) Y = !0;
            z = !1
        } else if (w)
            if (qU1[_] === 1) {
                if (O === -1) O = X
            } else if (_ === 34 && O !== -1) w = !1, J = X;
        else if (_ === 92) z = !0;
        else throw SyntaxError(`Unexpected character at index ${X}`);
        else if (_ === 34 && A.charCodeAt(X - 1) === 61) w = !0;
        else if (J === -1 && qU1[_] === 1) {
            if (O === -1) O = X
        } else if (O !== -1 && (_ === 32 || _ === 9)) {
            if (J === -1) J = X
        } else if (_ === 59 || _ === 44) {
            if (O === -1) throw SyntaxError(`Unexpected character at index ${X}`);
            if (J === -1) J = X;
            let j = A.slice(O, J);
            if (Y) j = j.replace(/\\/g, ""), Y = !1;
            if (mm(K, $, j), _ === 44) mm(q, H, K), K = Object.create(null), H = void 0;
            $ = void 0, O = J = -1
        } else throw SyntaxError(`Unexpected character at index ${X}`);
        if (O === -1 || w || _ === 32 || _ === 9) throw SyntaxError("Unexpected end of input");
        if (J === -1) J = X;
        let D = A.slice(O, J);
        if (H === void 0) mm(q, D, K);
        else {
            if ($ === void 0) mm(K, D, !0);
            else if (Y) mm(K, $, D.replace(/\\/g, ""));
            else mm(K, $, D);
            mm(q, H, K)
        }
        return q
    }

    function duY(A) {
        return Object.keys(A).map((q) => {
            let K = A[q];
            if (!Array.isArray(K)) K = [K];
            return K.map((Y) => {
                return [q].concat(Object.keys(Y).map((z) => {
                    let w = Y[z];
                    if (!Array.isArray(w)) w = [w];
                    return w.map((H) => H === !0 ? z : `${z}=${H}`).join("; ")
                })).join("; ")
            }).join(", ")
        }).join(", ")
    }
    Xo4.exports = {
        format: duY,
        parse: puY
    }
})
// @from(Ln 369200, Col 4)
lG6 = R((JNH, vo4) => {
    var cuY = h1("events"),
        luY = h1("https"),
        iuY = h1("http"),
        Mo4 = h1("net"),
        nuY = h1("tls"),
        {
            randomBytes: ruY,
            createHash: ouY
        } = h1("crypto"),
        {
            Duplex: ONH,
            Readable: _NH
        } = h1("stream"),
        {
            URL: WCA
        } = h1("url"),
        Bt = tg1(),
        auY = XCA(),
        suY = jCA(),
        {
            isBlob: tuY
        } = XG1(),
        {
            BINARY_TYPES: Do4,
            EMPTY_BUFFER: pG6,
            GUID: euY,
            kForOnEventAttribute: GCA,
            kListener: ABY,
            kStatusCode: qBY,
            kWebSocket: Ej,
            NOOP: Po4
        } = sd(),
        {
            EventTarget: {
                addEventListener: KBY,
                removeEventListener: YBY
            }
        } = Jo4(),
        {
            format: zBY,
            parse: wBY
        } = PCA(),
        {
            toBuffer: HBY
        } = ag1(),
        Wo4 = Symbol("kAborted"),
        ZCA = [8, 13],
        ed = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"],
        $BY = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    class r3 extends cuY {
        constructor(A, q, K) {
            super();
            if (this._binaryType = Do4[0], this._closeCode = 1006, this._closeFrameReceived = !1, this._closeFrameSent = !1, this._closeMessage = pG6, this._closeTimer = null, this._errorEmitted = !1, this._extensions = {}, this._paused = !1, this._protocol = "", this._readyState = r3.CONNECTING, this._receiver = null, this._sender = null, this._socket = null, A !== null) {
                if (this._bufferedAmount = 0, this._isServer = !1, this._redirects = 0, q === void 0) q = [];
                else if (!Array.isArray(q))
                    if (typeof q === "object" && q !== null) K = q, q = [];
                    else q = [q];
                Go4(this, A, q, K)
            } else this._autoPong = K.autoPong, this._isServer = !0
        }
        get binaryType() {
            return this._binaryType
        }
        set binaryType(A) {
            if (!Do4.includes(A)) return;
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
            let Y = new auY({
                    allowSynchronousEvents: K.allowSynchronousEvents,
                    binaryType: this.binaryType,
                    extensions: this._extensions,
                    isServer: this._isServer,
                    maxPayload: K.maxPayload,
                    skipUTF8Validation: K.skipUTF8Validation
                }),
                z = new suY(A, this._extensions, K.generateMask);
            if (this._receiver = Y, this._sender = z, this._socket = A, Y[Ej] = this, z[Ej] = this, A[Ej] = this, Y.on("conclude", JBY), Y.on("drain", XBY), Y.on("error", DBY), Y.on("message", jBY), Y.on("ping", MBY), Y.on("pong", PBY), z.onerror = WBY, A.setTimeout) A.setTimeout(0);
            if (A.setNoDelay) A.setNoDelay();
            if (q.length > 0) A.unshift(q);
            A.on("close", Vo4), A.on("data", cG6), A.on("end", No4), A.on("error", To4), this._readyState = r3.OPEN, this.emit("open")
        }
        emitClose() {
            if (!this._socket) {
                this._readyState = r3.CLOSED, this.emit("close", this._closeCode, this._closeMessage);
                return
            }
            if (this._extensions[Bt.extensionName]) this._extensions[Bt.extensionName].cleanup();
            this._receiver.removeAllListeners(), this._readyState = r3.CLOSED, this.emit("close", this._closeCode, this._closeMessage)
        }
        close(A, q) {
            if (this.readyState === r3.CLOSED) return;
            if (this.readyState === r3.CONNECTING) {
                OE(this, this._req, "WebSocket was closed before the connection was established");
                return
            }
            if (this.readyState === r3.CLOSING) {
                if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) this._socket.end();
                return
            }
            this._readyState = r3.CLOSING, this._sender.close(A, q, !this._isServer, (K) => {
                if (K) return;
                if (this._closeFrameSent = !0, this._closeFrameReceived || this._receiver._writableState.errorEmitted) this._socket.end()
            }), fo4(this)
        }
        pause() {
            if (this.readyState === r3.CONNECTING || this.readyState === r3.CLOSED) return;
            this._paused = !0, this._socket.pause()
        }
        ping(A, q, K) {
            if (this.readyState === r3.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
            if (typeof A === "function") K = A, A = q = void 0;
            else if (typeof q === "function") K = q, q = void 0;
            if (typeof A === "number") A = A.toString();
            if (this.readyState !== r3.OPEN) {
                fCA(this, A, K);
                return
            }
            if (q === void 0) q = !this._isServer;
            this._sender.ping(A || pG6, q, K)
        }
        pong(A, q, K) {
            if (this.readyState === r3.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
            if (typeof A === "function") K = A, A = q = void 0;
            else if (typeof q === "function") K = q, q = void 0;
            if (typeof A === "number") A = A.toString();
            if (this.readyState !== r3.OPEN) {
                fCA(this, A, K);
                return
            }
            if (q === void 0) q = !this._isServer;
            this._sender.pong(A || pG6, q, K)
        }
        resume() {
            if (this.readyState === r3.CONNECTING || this.readyState === r3.CLOSED) return;
            if (this._paused = !1, !this._receiver._writableState.needDrain) this._socket.resume()
        }
        send(A, q, K) {
            if (this.readyState === r3.CONNECTING) throw Error("WebSocket is not open: readyState 0 (CONNECTING)");
            if (typeof q === "function") K = q, q = {};
            if (typeof A === "number") A = A.toString();
            if (this.readyState !== r3.OPEN) {
                fCA(this, A, K);
                return
            }
            let Y = {
                binary: typeof A !== "string",
                mask: !this._isServer,
                compress: !0,
                fin: !0,
                ...q
            };
            if (!this._extensions[Bt.extensionName]) Y.compress = !1;
            this._sender.send(A || pG6, Y, K)
        }
        terminate() {
            if (this.readyState === r3.CLOSED) return;
            if (this.readyState === r3.CONNECTING) {
                OE(this, this._req, "WebSocket was closed before the connection was established");
                return
            }
            if (this._socket) this._readyState = r3.CLOSING, this._socket.destroy()
        }
    }
    Object.defineProperty(r3, "CONNECTING", {
        enumerable: !0,
        value: ed.indexOf("CONNECTING")
    });
    Object.defineProperty(r3.prototype, "CONNECTING", {
        enumerable: !0,
        value: ed.indexOf("CONNECTING")
    });
    Object.defineProperty(r3, "OPEN", {
        enumerable: !0,
        value: ed.indexOf("OPEN")
    });
    Object.defineProperty(r3.prototype, "OPEN", {
        enumerable: !0,
        value: ed.indexOf("OPEN")
    });
    Object.defineProperty(r3, "CLOSING", {
        enumerable: !0,
        value: ed.indexOf("CLOSING")
    });
    Object.defineProperty(r3.prototype, "CLOSING", {
        enumerable: !0,
        value: ed.indexOf("CLOSING")
    });
    Object.defineProperty(r3, "CLOSED", {
        enumerable: !0,
        value: ed.indexOf("CLOSED")
    });
    Object.defineProperty(r3.prototype, "CLOSED", {
        enumerable: !0,
        value: ed.indexOf("CLOSED")
    });
    ["binaryType", "bufferedAmount", "extensions", "isPaused", "protocol", "readyState", "url"].forEach((A) => {
        Object.defineProperty(r3.prototype, A, {
            enumerable: !0
        })
    });
    ["open", "error", "close", "message"].forEach((A) => {
        Object.defineProperty(r3.prototype, `on${A}`, {
            enumerable: !0,
            get() {
                for (let q of this.listeners(A))
                    if (q[GCA]) return q[ABY];
                return null
            },
            set(q) {
                for (let K of this.listeners(A))
                    if (K[GCA]) {
                        this.removeListener(A, K);
                        break
                    } if (typeof q !== "function") return;
                this.addEventListener(A, q, {
                    [GCA]: !0
                })
            }
        })
    });
    r3.prototype.addEventListener = KBY;
    r3.prototype.removeEventListener = YBY;
    vo4.exports = r3;

    function Go4(A, q, K, Y) {
        let z = {
            allowSynchronousEvents: !0,
            autoPong: !0,
            protocolVersion: ZCA[1],
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
        if (A._autoPong = z.autoPong, !ZCA.includes(z.protocolVersion)) throw RangeError(`Unsupported protocol version: ${z.protocolVersion} (supported versions: ${ZCA.join(", ")})`);
        let w;
        if (q instanceof WCA) w = q;
        else try {
            w = new WCA(q)
        } catch (P) {
            throw SyntaxError(`Invalid URL: ${q}`)
        }
        if (w.protocol === "http:") w.protocol = "ws:";
        else if (w.protocol === "https:") w.protocol = "wss:";
        A._url = w.href;
        let H = w.protocol === "wss:",
            $ = w.protocol === "ws+unix:",
            O;
        if (w.protocol !== "ws:" && !H && !$) O = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
        else if ($ && !w.pathname) O = "The URL's pathname is empty";
        else if (w.hash) O = "The URL contains a fragment identifier";
        if (O) {
            let P = SyntaxError(O);
            if (A._redirects === 0) throw P;
            else {
                dG6(A, P);
                return
            }
        }
        let _ = H ? 443 : 80,
            J = ruY(16).toString("base64"),
            X = H ? luY.request : iuY.request,
            D = new Set,
            j;
        if (z.createConnection = z.createConnection || (H ? _BY : OBY), z.defaultPort = z.defaultPort || _, z.port = w.port || _, z.host = w.hostname.startsWith("[") ? w.hostname.slice(1, -1) : w.hostname, z.headers = {
                ...z.headers,
                "Sec-WebSocket-Version": z.protocolVersion,
                "Sec-WebSocket-Key": J,
                Connection: "Upgrade",
                Upgrade: "websocket"
            }, z.path = w.pathname + w.search, z.timeout = z.handshakeTimeout, z.perMessageDeflate) j = new Bt(z.perMessageDeflate !== !0 ? z.perMessageDeflate : {}, !1, z.maxPayload), z.headers["Sec-WebSocket-Extensions"] = zBY({
            [Bt.extensionName]: j.offer()
        });
        if (K.length) {
            for (let P of K) {
                if (typeof P !== "string" || !$BY.test(P) || D.has(P)) throw SyntaxError("An invalid or duplicated subprotocol was specified");
                D.add(P)
            }
            z.headers["Sec-WebSocket-Protocol"] = K.join(",")
        }
        if (z.origin)
            if (z.protocolVersion < 13) z.headers["Sec-WebSocket-Origin"] = z.origin;
            else z.headers.Origin = z.origin;
        if (w.username || w.password) z.auth = `${w.username}:${w.password}`;
        if ($) {
            let P = z.path.split(":");
            z.socketPath = P[0], z.path = P[1]
        }
        let M;
        if (z.followRedirects) {
            if (A._redirects === 0) {
                A._originalIpc = $, A._originalSecure = H, A._originalHostOrSocketPath = $ ? z.socketPath : w.host;
                let P = Y && Y.headers;
                if (Y = {
                        ...Y,
                        headers: {}
                    }, P)
                    for (let [W, G] of Object.entries(P)) Y.headers[W.toLowerCase()] = G
            } else if (A.listenerCount("redirect") === 0) {
                let P = $ ? A._originalIpc ? z.socketPath === A._originalHostOrSocketPath : !1 : A._originalIpc ? !1 : w.host === A._originalHostOrSocketPath;
                if (!P || A._originalSecure && !H) {
                    if (delete z.headers.authorization, delete z.headers.cookie, !P) delete z.headers.host;
                    z.auth = void 0
                }
            }
            if (z.auth && !Y.headers.authorization) Y.headers.authorization = "Basic " + Buffer.from(z.auth).toString("base64");
            if (M = A._req = X(z), A._redirects) A.emit("redirect", A.url, M)
        } else M = A._req = X(z);
        if (z.timeout) M.on("timeout", () => {
            OE(A, M, "Opening handshake has timed out")
        });
        if (M.on("error", (P) => {
                if (M === null || M[Wo4]) return;
                M = A._req = null, dG6(A, P)
            }), M.on("response", (P) => {
                let W = P.headers.location,
                    G = P.statusCode;
                if (W && z.followRedirects && G >= 300 && G < 400) {
                    if (++A._redirects > z.maxRedirects) {
                        OE(A, M, "Maximum redirects exceeded");
                        return
                    }
                    M.abort();
                    let f;
                    try {
                        f = new WCA(W, q)
                    } catch (Z) {
                        let N = SyntaxError(`Invalid URL: ${W}`);
                        dG6(A, N);
                        return
                    }
                    Go4(A, f, K, Y)
                } else if (!A.emit("unexpected-response", M, P)) OE(A, M, `Unexpected server response: ${P.statusCode}`)
            }), M.on("upgrade", (P, W, G) => {
                if (A.emit("upgrade", P), A.readyState !== r3.CONNECTING) return;
                M = A._req = null;
                let f = P.headers.upgrade;
                if (f === void 0 || f.toLowerCase() !== "websocket") {
                    OE(A, W, "Invalid Upgrade header");
                    return
                }
                let Z = ouY("sha1").update(J + euY).digest("base64");
                if (P.headers["sec-websocket-accept"] !== Z) {
                    OE(A, W, "Invalid Sec-WebSocket-Accept header");
                    return
                }
                let N = P.headers["sec-websocket-protocol"],
                    T;
                if (N !== void 0) {
                    if (!D.size) T = "Server sent a subprotocol but none was requested";
                    else if (!D.has(N)) T = "Server sent an invalid subprotocol"
                } else if (D.size) T = "Server sent no subprotocol";
                if (T) {
                    OE(A, W, T);
                    return
                }
                if (N) A._protocol = N;
                let k = P.headers["sec-websocket-extensions"];
                if (k !== void 0) {
                    if (!j) {
                        OE(A, W, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
                        return
                    }
                    let y;
                    try {
                        y = wBY(k)
                    } catch (S) {
                        OE(A, W, "Invalid Sec-WebSocket-Extensions header");
                        return
                    }
                    let B = Object.keys(y);
                    if (B.length !== 1 || B[0] !== Bt.extensionName) {
                        OE(A, W, "Server indicated an extension that was not requested");
                        return
                    }
                    try {
                        j.accept(y[Bt.extensionName])
                    } catch (S) {
                        OE(A, W, "Invalid Sec-WebSocket-Extensions header");
                        return
                    }
                    A._extensions[Bt.extensionName] = j
                }
                A.setSocket(W, G, {
                    allowSynchronousEvents: z.allowSynchronousEvents,
                    generateMask: z.generateMask,
                    maxPayload: z.maxPayload,
                    skipUTF8Validation: z.skipUTF8Validation
                })
            }), z.finishRequest) z.finishRequest(M, A);
        else M.end()
    }

    function dG6(A, q) {
        A._readyState = r3.CLOSING, A._errorEmitted = !0, A.emit("error", q), A.emitClose()
    }

    function OBY(A) {
        return A.path = A.socketPath, Mo4.connect(A)
    }

    function _BY(A) {
        if (A.path = void 0, !A.servername && A.servername !== "") A.servername = Mo4.isIP(A.host) ? "" : A.host;
        return nuY.connect(A)
    }

    function OE(A, q, K) {
        A._readyState = r3.CLOSING;
        let Y = Error(K);
        if (Error.captureStackTrace(Y, OE), q.setHeader) {
            if (q[Wo4] = !0, q.abort(), q.socket && !q.socket.destroyed) q.socket.destroy();
            process.nextTick(dG6, A, Y)
        } else q.destroy(Y), q.once("error", A.emit.bind(A, "error")), q.once("close", A.emitClose.bind(A))
    }

    function fCA(A, q, K) {
        if (q) {
            let Y = tuY(q) ? q.size : HBY(q).length;
            if (A._socket) A._sender._bufferedBytes += Y;
            else A._bufferedAmount += Y
        }
        if (K) {
            let Y = Error(`WebSocket is not open: readyState ${A.readyState} (${ed[A.readyState]})`);
            process.nextTick(K, Y)
        }
    }

    function JBY(A, q) {
        let K = this[Ej];
        if (K._closeFrameReceived = !0, K._closeMessage = q, K._closeCode = A, K._socket[Ej] === void 0) return;
        if (K._socket.removeListener("data", cG6), process.nextTick(Zo4, K._socket), A === 1005) K.close();
        else K.close(A, q)
    }

    function XBY() {
        let A = this[Ej];
        if (!A.isPaused) A._socket.resume()
    }

    function DBY(A) {
        let q = this[Ej];
        if (q._socket[Ej] !== void 0) q._socket.removeListener("data", cG6), process.nextTick(Zo4, q._socket), q.close(A[qBY]);
        if (!q._errorEmitted) q._errorEmitted = !0, q.emit("error", A)
    }

    function jo4() {
        this[Ej].emitClose()
    }

    function jBY(A, q) {
        this[Ej].emit("message", A, q)
    }

    function MBY(A) {
        let q = this[Ej];
        if (q._autoPong) q.pong(A, !this._isServer, Po4);
        q.emit("ping", A)
    }

    function PBY(A) {
        this[Ej].emit("pong", A)
    }

    function Zo4(A) {
        A.resume()
    }

    function WBY(A) {
        let q = this[Ej];
        if (q.readyState === r3.CLOSED) return;
        if (q.readyState === r3.OPEN) q._readyState = r3.CLOSING, fo4(q);
        if (this._socket.end(), !q._errorEmitted) q._errorEmitted = !0, q.emit("error", A)
    }

    function fo4(A) {
        A._closeTimer = setTimeout(A._socket.destroy.bind(A._socket), 30000)
    }

    function Vo4() {
        let A = this[Ej];
        this.removeListener("close", Vo4), this.removeListener("data", cG6), this.removeListener("end", No4), A._readyState = r3.CLOSING;
        let q;
        if (!this._readableState.endEmitted && !A._closeFrameReceived && !A._receiver._writableState.errorEmitted && (q = A._socket.read()) !== null) A._receiver.write(q);
        if (A._receiver.end(), this[Ej] = void 0, clearTimeout(A._closeTimer), A._receiver._writableState.finished || A._receiver._writableState.errorEmitted) A.emitClose();
        else A._receiver.on("error", jo4), A._receiver.on("finish", jo4)
    }

    function cG6(A) {
        if (!this[Ej]._receiver.write(A)) this.pause()
    }

    function No4() {
        let A = this[Ej];
        A._readyState = r3.CLOSING, A._receiver.end(), this.end()
    }

    function To4() {
        let A = this[Ej];
        if (this.removeListener("error", To4), this.on("error", Po4), A) A._readyState = r3.CLOSING, this.destroy()
    }
})
// @from(Ln 369744, Col 4)
Ro4 = R((DNH, Lo4) => {
    var XNH = lG6(),
        {
            Duplex: GBY
        } = h1("stream");

    function Eo4(A) {
        A.emit("close")
    }

    function ZBY() {
        if (!this.destroyed && this._writableState.finished) this.destroy()
    }

    function ko4(A) {
        if (this.removeListener("error", ko4), this.destroy(), this.listenerCount("error") === 0) this.emit("error", A)
    }

    function fBY(A, q) {
        let K = !0,
            Y = new GBY({
                ...q,
                autoDestroy: !1,
                emitClose: !1,
                objectMode: !1,
                writableObjectMode: !1
            });
        return A.on("message", function(w, H) {
            let $ = !H && Y._readableState.objectMode ? w.toString() : w;
            if (!Y.push($)) A.pause()
        }), A.once("error", function(w) {
            if (Y.destroyed) return;
            K = !1, Y.destroy(w)
        }), A.once("close", function() {
            if (Y.destroyed) return;
            Y.push(null)
        }), Y._destroy = function(z, w) {
            if (A.readyState === A.CLOSED) {
                w(z), process.nextTick(Eo4, Y);
                return
            }
            let H = !1;
            if (A.once("error", function(O) {
                    H = !0, w(O)
                }), A.once("close", function() {
                    if (!H) w(z);
                    process.nextTick(Eo4, Y)
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
        }, Y._write = function(z, w, H) {
            if (A.readyState === A.CONNECTING) {
                A.once("open", function() {
                    Y._write(z, w, H)
                });
                return
            }
            A.send(z, H)
        }, Y.on("end", ZBY), Y.on("error", ko4), Y
    }
    Lo4.exports = fBY
})
// @from(Ln 369819, Col 4)
Co4 = R((jNH, yo4) => {
    var {
        tokenChars: VBY
    } = XG1();

    function NBY(A) {
        let q = new Set,
            K = -1,
            Y = -1,
            z = 0;
        for (z; z < A.length; z++) {
            let H = A.charCodeAt(z);
            if (Y === -1 && VBY[H] === 1) {
                if (K === -1) K = z
            } else if (z !== 0 && (H === 32 || H === 9)) {
                if (Y === -1 && K !== -1) Y = z
            } else if (H === 44) {
                if (K === -1) throw SyntaxError(`Unexpected character at index ${z}`);
                if (Y === -1) Y = z;
                let $ = A.slice(K, Y);
                if (q.has($)) throw SyntaxError(`The "${$}" subprotocol is duplicated`);
                q.add($), K = Y = -1
            } else throw SyntaxError(`Unexpected character at index ${z}`)
        }
        if (K === -1 || Y !== -1) throw SyntaxError("Unexpected end of input");
        let w = A.slice(K, z);
        if (q.has(w)) throw SyntaxError(`The "${w}" subprotocol is duplicated`);
        return q.add(w), q
    }
    yo4.exports = {
        parse: NBY
    }
})
// @from(Ln 369852, Col 4)
bo4 = R((PNH, xo4) => {
    var TBY = h1("events"),
        iG6 = h1("http"),
        {
            Duplex: MNH
        } = h1("stream"),
        {
            createHash: vBY
        } = h1("crypto"),
        So4 = PCA(),
        d51 = tg1(),
        EBY = Co4(),
        kBY = lG6(),
        {
            GUID: LBY,
            kWebSocket: RBY
        } = sd(),
        yBY = /^[+/0-9A-Za-z]{22}==$/;
    class Io4 extends TBY {
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
                    WebSocket: kBY,
                    ...A
                }, A.port == null && !A.server && !A.noServer || A.port != null && (A.server || A.noServer) || A.server && A.noServer) throw TypeError('One and only one of the "port", "server", or "noServer" options must be specified');
            if (A.port != null) this._server = iG6.createServer((K, Y) => {
                let z = iG6.STATUS_CODES[426];
                Y.writeHead(426, {
                    "Content-Length": z.length,
                    "Content-Type": "text/plain"
                }), Y.end(z)
            }), this._server.listen(A.port, A.host, A.backlog, q);
            else if (A.server) this._server = A.server;
            if (this._server) {
                let K = this.emit.bind(this, "connection");
                this._removeListeners = CBY(this._server, {
                    listening: this.emit.bind(this, "listening"),
                    error: this.emit.bind(this, "error"),
                    upgrade: (Y, z, w) => {
                        this.handleUpgrade(Y, z, w, K)
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
                process.nextTick(KU1, this);
                return
            }
            if (A) this.once("close", A);
            if (this._state === 1) return;
            if (this._state = 1, this.options.noServer || this.options.server) {
                if (this._server) this._removeListeners(), this._removeListeners = this._server = null;
                if (this.clients)
                    if (!this.clients.size) process.nextTick(KU1, this);
                    else this._shouldEmitClose = !0;
                else process.nextTick(KU1, this)
            } else {
                let q = this._server;
                this._removeListeners(), this._removeListeners = this._server = null, q.close(() => {
                    KU1(this)
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
            q.on("error", ho4);
            let z = A.headers["sec-websocket-key"],
                w = A.headers.upgrade,
                H = +A.headers["sec-websocket-version"];
            if (A.method !== "GET") {
                c51(this, A, q, 405, "Invalid HTTP method");
                return
            }
            if (w === void 0 || w.toLowerCase() !== "websocket") {
                c51(this, A, q, 400, "Invalid Upgrade header");
                return
            }
            if (z === void 0 || !yBY.test(z)) {
                c51(this, A, q, 400, "Missing or invalid Sec-WebSocket-Key header");
                return
            }
            if (H !== 13 && H !== 8) {
                c51(this, A, q, 400, "Missing or invalid Sec-WebSocket-Version header", {
                    "Sec-WebSocket-Version": "13, 8"
                });
                return
            }
            if (!this.shouldHandle(A)) {
                YU1(q, 400);
                return
            }
            let $ = A.headers["sec-websocket-protocol"],
                O = new Set;
            if ($ !== void 0) try {
                O = EBY.parse($)
            } catch (X) {
                c51(this, A, q, 400, "Invalid Sec-WebSocket-Protocol header");
                return
            }
            let _ = A.headers["sec-websocket-extensions"],
                J = {};
            if (this.options.perMessageDeflate && _ !== void 0) {
                let X = new d51(this.options.perMessageDeflate, !0, this.options.maxPayload);
                try {
                    let D = So4.parse(_);
                    if (D[d51.extensionName]) X.accept(D[d51.extensionName]), J[d51.extensionName] = X
                } catch (D) {
                    c51(this, A, q, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header");
                    return
                }
            }
            if (this.options.verifyClient) {
                let X = {
                    origin: A.headers[`${H===8?"sec-websocket-origin":"origin"}`],
                    secure: !!(A.socket.authorized || A.socket.encrypted),
                    req: A
                };
                if (this.options.verifyClient.length === 2) {
                    this.options.verifyClient(X, (D, j, M, P) => {
                        if (!D) return YU1(q, j || 401, M, P);
                        this.completeUpgrade(J, z, O, A, q, K, Y)
                    });
                    return
                }
                if (!this.options.verifyClient(X)) return YU1(q, 401)
            }
            this.completeUpgrade(J, z, O, A, q, K, Y)
        }
        completeUpgrade(A, q, K, Y, z, w, H) {
            if (!z.readable || !z.writable) return z.destroy();
            if (z[RBY]) throw Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
            if (this._state > 0) return YU1(z, 503);
            let O = ["HTTP/1.1 101 Switching Protocols", "Upgrade: websocket", "Connection: Upgrade", `Sec-WebSocket-Accept: ${vBY("sha1").update(q+LBY).digest("base64")}`],
                _ = new this.options.WebSocket(null, void 0, this.options);
            if (K.size) {
                let J = this.options.handleProtocols ? this.options.handleProtocols(K, Y) : K.values().next().value;
                if (J) O.push(`Sec-WebSocket-Protocol: ${J}`), _._protocol = J
            }
            if (A[d51.extensionName]) {
                let J = A[d51.extensionName].params,
                    X = So4.format({
                        [d51.extensionName]: [J]
                    });
                O.push(`Sec-WebSocket-Extensions: ${X}`), _._extensions = A
            }
            if (this.emit("headers", O, Y), z.write(O.concat(`\r
`).join(`\r
`)), z.removeListener("error", ho4), _.setSocket(z, w, {
                    allowSynchronousEvents: this.options.allowSynchronousEvents,
                    maxPayload: this.options.maxPayload,
                    skipUTF8Validation: this.options.skipUTF8Validation
                }), this.clients) this.clients.add(_), _.on("close", () => {
                if (this.clients.delete(_), this._shouldEmitClose && !this.clients.size) process.nextTick(KU1, this)
            });
            H(_, Y)
        }
    }
    xo4.exports = Io4;

    function CBY(A, q) {
        for (let K of Object.keys(q)) A.on(K, q[K]);
        return function() {
            for (let Y of Object.keys(q)) A.removeListener(Y, q[Y])
        }
    }

    function KU1(A) {
        A._state = 2, A.emit("close")
    }

    function ho4() {
        this.destroy()
    }

    function YU1(A, q, K, Y) {
        K = K || iG6.STATUS_CODES[q], Y = {
            Connection: "close",
            "Content-Type": "text/html",
            "Content-Length": Buffer.byteLength(K),
            ...Y
        }, A.once("finish", A.destroy), A.end(`HTTP/1.1 ${q} ${iG6.STATUS_CODES[q]}\r
` + Object.keys(Y).map((z) => `${z}: ${Y[z]}`).join(`\r
`) + `\r
\r
` + K)
    }

    function c51(A, q, K, Y, z, w) {
        if (A.listenerCount("wsClientError")) {
            let H = Error(z);
            Error.captureStackTrace(H, c51), A.emit("wsClientError", H, K, q)
        } else YU1(K, Y, z, w)
    }
})
// @from(Ln 370078, Col 4)
nG6 = {}
// @from(Ln 370087, Col 4)
uo4
// @from(Ln 370087, Col 9)
Bo4
// @from(Ln 370087, Col 14)
mo4
// @from(Ln 370087, Col 19)
VCA
// @from(Ln 370087, Col 24)
Fo4
// @from(Ln 370087, Col 29)
mt
// @from(Ln 370088, Col 4)
zU1 = v(() => {
    uo4 = o(Ro4(), 1), Bo4 = o(XCA(), 1), mo4 = o(jCA(), 1), VCA = o(lG6(), 1), Fo4 = o(bo4(), 1), mt = VCA.default
})
// @from(Ln 370091, Col 0)
async function Qo4(A, q) {
    return new(await Promise.resolve().then(() => (zU1(), nG6))).default(A, ["mcp"], q)
}
// @from(Ln 370095, Col 0)
function rG6() {
    return parseInt(process.env.MCP_TIMEOUT || "", 10) || 30000
}
// @from(Ln 370099, Col 0)
function NCA(A) {
    return async (q, K) => {
        if ((K?.method ?? "GET").toUpperCase() === "GET") return A(q, K);
        let z = AbortSignal.timeout(po4);
        if (!K?.signal) return A(q, {
            ...K,
            signal: z
        });
        let w = new AbortController,
            H = () => w.abort();
        K.signal.addEventListener("abort", H), z.addEventListener("abort", H);
        let $ = () => {
            K.signal?.removeEventListener("abort", H), z.removeEventListener("abort", H)
        };
        if (K.signal.aborted) w.abort();
        try {
            let O = await A(q, {
                ...K,
                signal: w.signal
            });
            return $(), O
        } catch (O) {
            throw $(), O
        }
    }
}
// @from(Ln 370126, Col 0)
function vCA() {
    return parseInt(process.env.MCP_SERVER_CONNECTION_BATCH_SIZE || "", 10) || 3
}
// @from(Ln 370130, Col 0)
function hBY() {
    return parseInt(process.env.MCP_REMOTE_SERVER_CONNECTION_BATCH_SIZE || "", 10) || 20
}
// @from(Ln 370134, Col 0)
function go4(A) {
    return !A.type || A.type === "stdio" || A.type === "sdk"
}
// @from(Ln 370138, Col 0)
function xBY(A) {
    return !A.name.startsWith("mcp__ide__") || IBY.includes(A.name)
}
// @from(Ln 370142, Col 0)
function TCA(A, q) {
    return `${A}-${Q1(q)}`
}
// @from(Ln 370145, Col 0)
async function Fm(A, q) {
    let K = TCA(A, q);
    try {
        let Y = await iR(A, q);
        if (Y.type === "connected") await Y.cleanup()
    } catch {}
    iR.cache.delete(K)
}
// @from(Ln 370153, Col 0)
async function lW1(A) {
    if (A.config.type === "sdk") return A;
    let q = await iR(A.name, A.config);
    if (q.type !== "connected") throw new Ok(`MCP server "${A.name}" is not connected`, "MCP server not connected");
    return q
}
// @from(Ln 370160, Col 0)
function do4(A, q) {
    if (A.type !== q.type) return !1;
    let {
        scope: K,
        ...Y
    } = A, {
        scope: z,
        ...w
    } = q;
    return Q1(Y) === Q1(w)
}
// @from(Ln 370171, Col 0)
async function _h(A, q, K) {
    return (await lo4({
        client: K,
        tool: A,
        args: q,
        signal: Aq().signal
    })).content
}
// @from(Ln 370179, Col 0)
async function Qm(A, q) {
    try {
        await Fm(A, q);
        let K = await iR(A, q);
        if (K.type !== "connected") return {
            client: K,
            tools: [],
            commands: []
        };
        let Y = !!K.capabilities?.resources,
            [z, w, H] = await Promise.all([wI(K), HU1(K), Y ? wU1(K) : Promise.resolve([])]),
            $ = [];
        if (Y) {
            if (![cd, ld].some((_) => z.some((J) => J.name === _.name))) $.push(cd, ld)
        }
        return {
            client: K,
            tools: [...z, ...$],
            commands: w,
            resources: H.length > 0 ? H : void 0
        }
    } catch (K) {
        return Kz(A, `Error during reconnection: ${K instanceof Error?K.message:String(K)}`), {
            client: {
                name: A,
                type: "failed",
                config: q
            },
            tools: [],
            commands: []
        }
    }
}
// @from(Ln 370212, Col 0)
async function Uo4(A, q, K) {
    for (let Y = 0; Y < A.length; Y += q) {
        let z = A.slice(Y, Y + q);
        await Promise.all(z.map(K))
    }
}
// @from(Ln 370218, Col 0)
async function sG6(A, q) {
    let K = !1,
        Y = Object.entries(q ?? (await um()).servers),
        z = Y.length,
        w = Y.filter(([M, P]) => P.type === "stdio").length,
        H = Y.filter(([M, P]) => P.type === "sse").length,
        $ = Y.filter(([M, P]) => P.type === "http").length,
        O = Y.filter(([M, P]) => P.type === "sse-ide").length,
        _ = Y.filter(([M, P]) => P.type === "ws-ide").length,
        J = Y.filter(([M, P]) => go4(P)),
        X = Y.filter(([M, P]) => !go4(P)),
        D = {
            totalServers: z,
            stdioCount: w,
            sseCount: H,
            httpCount: $,
            sseIdeCount: O,
            wsIdeCount: _
        },
        j = async ([M, P]) => {
            try {
                if (dg1(M)) {
                    A({
                        client: {
                            name: M,
                            type: "disabled",
                            config: P
                        },
                        tools: [],
                        commands: []
                    });
                    return
                }
                let W = await iR(M, P, D);
                if (W.type !== "connected") {
                    A({
                        client: W,
                        tools: [],
                        commands: []
                    });
                    return
                }
                let G = !!W.capabilities?.resources,
                    [f, Z, N] = await Promise.all([wI(W), HU1(W), G ? wU1(W) : Promise.resolve([])]),
                    T = [];
                if (G && !K) K = !0, T.push(cd, ld);
                A({
                    client: W,
                    tools: [...f, ...T],
                    commands: Z,
                    resources: N.length > 0 ? N : void 0
                })
            } catch (W) {
                Kz(M, `Error fetching tools/commands/resources: ${W instanceof Error?W.message:String(W)}`), A({
                    client: {
                        name: M,
                        type: "failed",
                        config: P
                    },
                    tools: [],
                    commands: []
                })
            }
        };
    await Promise.all([Uo4(J, vCA(), j), Uo4(X, hBY(), j)])
}
// @from(Ln 370284, Col 0)
async function co4(A, q) {
    switch (A.type) {
        case "text":
            return [{
                type: "text",
                text: A.text
            }];
        case "image": {
            let K = Buffer.from(String(A.data), "base64"),
                Y = A.mimeType?.split("/")[1] || "png",
                z = await eu(K, K.length, Y);
            return [{
                type: "image",
                source: {
                    data: z.buffer.toString("base64"),
                    media_type: `image/${z.mediaType}`,
                    type: "base64"
                }
            }]
        }
        case "resource": {
            let K = A.resource,
                Y = `[Resource from ${q} at ${K.uri}] `;
            if ("text" in K) return [{
                type: "text",
                text: `${Y}${K.text}`
            }];
            else if ("blob" in K)
                if (SBY.has(K.mimeType ?? "")) {
                    let w = Buffer.from(K.blob, "base64"),
                        H = K.mimeType?.split("/")[1] || "png",
                        $ = await eu(w, w.length, H),
                        O = [];
                    if (Y) O.push({
                        type: "text",
                        text: Y
                    });
                    return O.push({
                        type: "image",
                        source: {
                            data: $.buffer.toString("base64"),
                            media_type: `image/${$.mediaType}`,
                            type: "base64"
                        }
                    }), O
                } else return [{
                    type: "text",
                    text: `${Y}Base64 data (${K.mimeType||"unknown type"}) ${K.blob}`
                }];
            return []
        }
        case "resource_link": {
            let K = A,
                Y = `[Resource link: ${K.name}] ${K.uri}`;
            if (K.description) Y += ` (${K.description})`;
            return [{
                type: "text",
                text: Y
            }]
        }
        default:
            return []
    }
}
// @from(Ln 370349, Col 0)
function oG6(A, q = 2) {
    if (A === null) return "null";
    if (Array.isArray(A)) {
        if (A.length === 0) return "[]";
        return `[${oG6(A[0],q-1)}]`
    }
    if (typeof A === "object") {
        if (q <= 0) return "{...}";
        let Y = Object.entries(A).slice(0, 10).map(([w, H]) => `${w}: ${oG6(H,q-1)}`),
            z = Object.keys(A).length > 10 ? ", ..." : "";
        return `{${Y.join(", ")}${z}}`
    }
    return typeof A
}
// @from(Ln 370363, Col 0)
async function ECA(A, q, K) {
    if (A && typeof A === "object") {
        if ("toolResult" in A) return {
            content: String(A.toolResult),
            type: "toolResult"
        };
        if ("structuredContent" in A && A.structuredContent !== void 0) return {
            content: Q1(A.structuredContent),
            type: "structuredContent",
            schema: oG6(A.structuredContent)
        };
        if ("content" in A && Array.isArray(A.content)) {
            let z = (await Promise.all(A.content.map((w) => co4(w, K)))).flat();
            return {
                content: z,
                type: "contentArray",
                schema: oG6(z)
            }
        }
    }
    let Y = `MCP server "${K}" tool "${q}": unexpected response format`;
    throw Kz(K, Y), new Ok(Y, "MCP tool unexpected response format")
}
// @from(Ln 370387, Col 0)
function bBY(A) {
    if (!A || typeof A === "string") return !1;
    return A.some((q) => q.type === "image")
}
// @from(Ln 370391, Col 0)
async function uBY(A, q, K) {
    let {
        content: Y,
        type: z,
        schema: w
    } = await ECA(A, q, K);
    if (K === "ide") return Y;
    if (!await pb1(Y)) return Y;
    if (FY(process.env.ENABLE_MCP_LARGE_OUTPUT_FILES)) return await PXA(Y);
    if (!Y) return Y;
    if (bBY(Y)) return await PXA(Y);
    let H = Date.now(),
        $ = `mcp-${P5(K)}-${P5(q)}-${H}`,
        O = typeof Y === "string" ? Y : Q1(Y, null, 2),
        _ = await uq1(O, $);
    if (Bq1(_)) return `Error: result (${O.length.toLocaleString()} characters) exceeds maximum allowed tokens. Failed to save output to file: ${_.error}. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data.`;
    let J = L$6(z, w);
    return R$6(_.filepath, _.originalSize, J)
}
// @from(Ln 370410, Col 0)
async function lo4({
    client: {
        client: A,
        name: q
    },
    tool: K,
    args: Y,
    meta: z,
    signal: w,
    onProgress: H
}) {
    let $ = Date.now(),
        O, _;
    try {
        if (SA(q, `Calling MCP tool: ${K}`), O = setInterval(() => {
                let f = Date.now() - $,
                    N = `${Math.floor(f/1000)}s`;
                SA(q, `Tool '${K}' still running (${N} elapsed)`)
            }, 30000), px7()) _ = setInterval(() => {
            Ux7()
        }, 50000);
        let J = Ft(),
            X, D = new Promise((f, Z) => {
                X = setTimeout(() => {
                    Z(new Ok(`MCP server "${q}" tool "${K}" timed out after ${Math.floor(J/1000)}s`, "MCP tool timeout"))
                }, J)
            }),
            j = await Promise.race([A.callTool({
                name: K,
                arguments: Y,
                _meta: z
            }, ZZ, {
                signal: w,
                timeout: J,
                onprogress: H ? (f) => {
                    H({
                        type: "mcp_progress",
                        status: "progress",
                        serverName: q,
                        toolName: K,
                        progress: f.progress,
                        total: f.total,
                        progressMessage: f.message
                    })
                } : void 0
            }), D]).finally(() => {
                if (X) clearTimeout(X)
            });
        if ("isError" in j && j.isError) {
            let f = "Unknown error";
            if ("content" in j && Array.isArray(j.content) && j.content.length > 0) {
                let Z = j.content[0];
                if (Z && typeof Z === "object" && "text" in Z) f = Z.text
            } else if ("error" in j) f = String(j.error);
            throw Kz(q, f), new Ok(f, "MCP tool returned error")
        }
        let M = Date.now() - $,
            P = M < 1000 ? `${M}ms` : M < 60000 ? `${Math.floor(M/1000)}s` : `${Math.floor(M/60000)}m ${Math.floor(M%60000/1000)}s`;
        SA(q, `Tool '${K}' completed successfully in ${P}`);
        let W = Bn4(q);
        if (W) c("tengu_code_indexing_tool_used", {
            tool: W,
            source: "mcp",
            success: !0
        });
        return {
            content: await uBY(j, K, q),
            _meta: j._meta,
            structuredContent: j.structuredContent
        }
    } catch (J) {
        if (O !== void 0) clearInterval(O);
        if (_ !== void 0) clearInterval(_);
        let X = Date.now() - $;
        if (J instanceof Error && J.name !== "AbortError") SA(q, `Tool '${K}' failed after ${Math.floor(X/1000)}s: ${J.message}`);
        if (J instanceof Error) {
            if (("code" in J ? J.code : void 0) === 401 || J instanceof r0) throw SA(q, "Tool call returned 401 Unauthorized - token may have expired"), c("tengu_mcp_tool_call_auth_error", {}), new aG6(q, `MCP server "${q}" requires re-authorization (token expired)`)
        }
        if (!(J instanceof Error) || J.name !== "AbortError") throw J;
        return {
            content: void 0
        }
    } finally {
        if (O !== void 0) clearInterval(O);
        if (_ !== void 0) clearInterval(_)
    }
}
// @from(Ln 370498, Col 0)
function BBY(A) {
    if (A.message.content[0]?.type !== "tool_use") return;
    return A.message.content[0].id
}
// @from(Ln 370502, Col 0)
async function io4(A, q) {
    let K = [],
        Y = [],
        z = await Promise.allSettled(Object.entries(A).map(async ([w, H]) => {
            let $ = new wCA(w, q),
                O = new rH6({
                    name: "claude-code",
                    version: {
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.38",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-02-10T00:04:56Z"
                    }.VERSION ?? "unknown"
                }, {
                    capabilities: {}
                });
            try {
                await O.connect($);
                let _ = O.getServerCapabilities(),
                    J = {
                        type: "connected",
                        name: w,
                        capabilities: _ || {},
                        client: O,
                        config: {
                            ...H,
                            scope: "dynamic"
                        },
                        cleanup: async () => {
                            await O.close()
                        }
                    },
                    X = [];
                if (_?.tools) {
                    let D = await wI(J);
                    X.push(...D)
                }
                return {
                    client: J,
                    tools: X
                }
            } catch (_) {
                return Kz(w, `Failed to connect SDK MCP server: ${_}`), {
                    client: {
                        type: "failed",
                        name: w,
                        config: {
                            ...H,
                            scope: "user"
                        }
                    },
                    tools: []
                }
            }
        }));
    for (let w of z)
        if (w.status === "fulfilled") K.push(w.value.client), Y.push(...w.value.tools);
    return {
        clients: K,
        tools: Y
    }
}
// @from(Ln 370566, Col 4)
aG6
// @from(Ln 370566, Col 9)
SBY
// @from(Ln 370566, Col 14)
po4 = 60000
// @from(Ln 370567, Col 4)
IBY
// @from(Ln 370567, Col 9)
iR
// @from(Ln 370567, Col 13)
wI
// @from(Ln 370567, Col 17)
wU1
// @from(Ln 370567, Col 22)
HU1
// @from(Ln 370567, Col 27)
tG6
// @from(Ln 370568, Col 4)
SW = v(() => {
    zq();
    lI7();
    nI7();
    Xx7();
    jx7();
    gD();
    XrA();
    qXA();
    y6();
    qH();
    B0();
    u6();
    q$();
    B6();
    J7();
    Uz();
    Tz();
    Oa();
    k$6();
    WXA();
    Pp();
    hA();
    tX();
    lyA();
    mn4();
    YO1();
    bb();
    G2();
    dL();
    in4();
    SW6();
    hW6();
    g51();
    nW();
    Sr4();
    mb1();
    Tj();
    kI();
    Ir4();
    m6();
    aG6 = class aG6 extends Error {
        serverName;
        constructor(A, q) {
            super(q);
            this.name = "McpAuthError", this.serverName = A
        }
    };
    SBY = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
    IBY = ["mcp__ide__executeCode", "mcp__ide__getDiagnostics"];
    iR = KA(async (A, q, K) => {
        let Y = Date.now();
        try {
            let z, w = nV();
            if (q.type === "sse") {
                let S = new Q51(A, q),
                    m = await bG6(A, q),
                    b = {
                        authProvider: S,
                        fetch: NCA(hq1()),
                        requestInit: {
                            headers: {
                                "User-Agent": Xr(),
                                ...m
                            }
                        }
                    };
                b.eventSourceInit = {
                    fetch: async (g, U) => {
                        let x = {},
                            p = await S.tokens();
                        if (p) x.Authorization = `Bearer ${p.access_token}`;
                        let l = $81();
                        return fetch(g, {
                            ...U,
                            ...l,
                            headers: {
                                "User-Agent": Xr(),
                                ...x,
                                ...U?.headers,
                                ...m,
                                Accept: "text/event-stream"
                            }
                        })
                    }
                }, z = new D$6(new URL(q.url), b), SA(A, "SSE transport initialized, awaiting connection")
            } else if (q.type === "sse-ide") {
                SA(A, `Setting up SSE-IDE transport to ${q.url}`);
                let S = $81(),
                    m = S.dispatcher ? {
                        eventSourceInit: {
                            fetch: async (b, g) => {
                                return fetch(b, {
                                    ...g,
                                    ...S,
                                    headers: {
                                        "User-Agent": Xr(),
                                        ...g?.headers
                                    }
                                })
                            }
                        }
                    } : {};
                z = new D$6(new URL(q.url), Object.keys(m).length > 0 ? m : void 0)
            } else if (q.type === "ws-ide") {
                let S = Io6(),
                    m = {
                        "User-Agent": Xr(),
                        ...q.authToken && {
                            "X-Claude-Code-Ide-Authorization": q.authToken
                        }
                    },
                    b;
                if (typeof Bun < "u") b = new globalThis.WebSocket(q.url, {
                    protocols: ["mcp"],
                    headers: m,
                    proxy: H81(q.url),
                    tls: S || void 0
                });
                else b = await Qo4(q.url, {
                    headers: m,
                    agent: w81(q.url),
                    ...S || {}
                });
                z = new VG6(b)
            } else if (q.type === "ws") {
                SA(A, `Initializing WebSocket transport to ${q.url}`);
                let S = await bG6(A, q),
                    m = Io6(),
                    b = {
                        "User-Agent": Xr(),
                        ...w && {
                            Authorization: `Bearer ${w}`
                        },
                        ...S
                    },
                    g = Object.fromEntries(Object.entries(b).map(([x, p]) => x.toLowerCase() === "authorization" ? [x, "[REDACTED]"] : [x, p]));
                SA(A, `WebSocket transport options: ${Q1({url:q.url,headers:g,hasSessionAuth:!!w})}`);
                let U;
                if (typeof Bun < "u") U = new globalThis.WebSocket(q.url, {
                    protocols: ["mcp"],
                    headers: b,
                    proxy: H81(q.url),
                    tls: m || void 0
                });
                else U = await Qo4(q.url, {
                    headers: b,
                    agent: w81(q.url),
                    ...m || {}
                });
                z = new VG6(U)
            } else if (q.type === "http") {
                SA(A, `Initializing HTTP transport to ${q.url}`), SA(A, `Node version: ${process.version}, Platform: ${process.platform}`), SA(A, `Environment: ${Q1({NODE_OPTIONS:process.env.NODE_OPTIONS||"not set",UV_THREADPOOL_SIZE:process.env.UV_THREADPOOL_SIZE||"default",HTTP_PROXY:process.env.HTTP_PROXY||"not set",HTTPS_PROXY:process.env.HTTPS_PROXY||"not set",NO_PROXY:process.env.NO_PROXY||"not set"})}`);
                let S = new Q51(A, q),
                    m = await bG6(A, q),
                    b = $81();
                SA(A, `Proxy options: ${b.dispatcher?"custom dispatcher":"default"}`);
                let g = {
                        authProvider: S,
                        fetch: NCA(hq1()),
                        requestInit: {
                            ...b,
                            headers: {
                                "User-Agent": Xr(),
                                ...w && {
                                    Authorization: `Bearer ${w}`
                                },
                                ...m
                            }
                        }
                    },
                    U = g.requestInit?.headers ? Object.fromEntries(Object.entries(g.requestInit.headers).map(([x, p]) => x.toLowerCase() === "authorization" ? [x, "[REDACTED]"] : [x, p])) : void 0;
                SA(A, `HTTP transport options: ${Q1({url:q.url,headers:U,hasAuthProvider:!!S,timeoutMs:po4})}`), z = new j$6(new URL(q.url), g), SA(A, "HTTP transport created successfully")
            } else if (q.type === "sdk") throw Error("SDK servers should be handled in print.ts");
            else if (q.type === "claudeai-proxy") {
                if (SA(A, `Initializing claude.ai proxy transport for server ${q.id}`), !a4()) throw Error("No claude.ai OAuth token found");
                let m = P4(),
                    b = `${m.MCP_PROXY_URL}${m.MCP_PROXY_PATH.replace("{server_id}",q.id)}`;
                SA(A, `Using claude.ai proxy at ${b}`);
                let g = async (p, l) => {
                    await XM();
                    let r = a4();
                    if (!r) throw Error("No claude.ai OAuth token available");
                    let s = new Headers(l?.headers);
                    return s.set("Authorization", `Bearer ${r.accessToken}`), globalThis.fetch(p, {
                        ...l,
                        headers: s
                    })
                }, U = $81(), x = {
                    fetch: NCA(g),
                    requestInit: {
                        ...U,
                        headers: {
                            "User-Agent": Xr(),
                            "X-Mcp-Client-Session-Id": U6()
                        }
                    }
                };
                z = new j$6(new URL(b), x), SA(A, "claude.ai proxy transport created successfully")
            } else if (q.type === "stdio" || !q.type) {
                let S = process.env.CLAUDE_CODE_SHELL_PREFIX || q.command,
                    m = process.env.CLAUDE_CODE_SHELL_PREFIX ? [
                        [q.command, ...q.args].join(" ")
                    ] : q.args;
                z = new SJA({
                    command: S,
                    args: m,
                    env: {
                        ...process.env,
                        ...q.env
                    },
                    stderr: "pipe"
                })
            } else throw Error(`Unsupported server type: ${q.type}. claude.ai MCP servers require ENABLE_CLAUDEAI_MCP_SERVERS=true.`);
            let H, $ = "";
            if (q.type === "stdio" || !q.type) {
                let S = z;
                if (S.stderr) H = (m) => {
                    $ += m.toString()
                }, S.stderr.on("data", H)
            }
            let O = new rH6({
                name: "claude-code",
                version: {
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.38",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-02-10T00:04:56Z"
                }.VERSION ?? "unknown"
            }, {
                capabilities: {
                    roots: {},
                    ...xq1() ? {
                        elicitation: {
                            form: {},
                            url: {}
                        }
                    } : {}
                }
            });
            if (q.type === "http") SA(A, "Client created, setting up request handler");
            if (O.setRequestHandler(tOA, async () => {
                    return SA(A, "Received ListRoots request from server"), {
                        roots: [{
                            uri: `file://${y8()}`
                        }]
                    }
                }), SA(A, `Starting connection with timeout of ${rG6()}ms`), q.type === "http") {
                SA(A, `Testing basic HTTP connectivity to ${q.url}`);
                try {
                    let S = new URL(q.url);
                    if (SA(A, `Parsed URL: host=${S.hostname}, port=${S.port||"default"}, protocol=${S.protocol}`), S.hostname === "127.0.0.1" || S.hostname === "localhost") SA(A, `Using loopback address: ${S.hostname}`)
                } catch (S) {
                    SA(A, `Failed to parse URL: ${S}`)
                }
            }
            let _ = O.connect(z),
                J = new Promise((S, m) => {
                    let b = setTimeout(() => {
                        let g = Date.now() - Y;
                        SA(A, `Connection timeout triggered after ${g}ms (limit: ${rG6()}ms)`), z.close().catch(() => {}), m(new Ok(`MCP server "${A}" connection timed out after ${rG6()}ms`, "MCP connection timeout"))
                    }, rG6());
                    _.then(() => {
                        clearTimeout(b)
                    }, (g) => {
                        clearTimeout(b)
                    })
                });
            try {
                if (await Promise.race([_, J]), $) Kz(A, `Server stderr: ${$}`);
                let S = Date.now() - Y;
                SA(A, `Successfully connected to ${q.type} server in ${S}ms`)
            } catch (S) {
                let m = Date.now() - Y;
                if (q.type === "sse" && S instanceof Error) {
                    if (SA(A, `SSE Connection failed after ${m}ms: ${Q1({url:q.url,error:S.message,errorType:S.constructor.name,stack:S.stack})}`), Kz(A, S), S instanceof r0) return c("tengu_mcp_server_needs_auth", {
                        transportType: "sse",
                        ...U_(q) ? {
                            mcpServerBaseUrl: U_(q)
                        } : {}
                    }), SA(A, "Authentication required for SSE server"), {
                        name: A,
                        type: "needs-auth",
                        config: q
                    }
                } else if (q.type === "http" && S instanceof Error) {
                    let b = S;
                    if (SA(A, `HTTP Connection failed after ${m}ms: ${S.message} (code: ${b.code||"none"}, errno: ${b.errno||"none"})`), Kz(A, S), S instanceof r0) return c("tengu_mcp_server_needs_auth", {
                        transportType: "http",
                        ...U_(q) ? {
                            mcpServerBaseUrl: U_(q)
                        } : {}
                    }), SA(A, "Authentication required for HTTP server"), {
                        name: A,
                        type: "needs-auth",
                        config: q
                    }
                } else if (q.type === "claudeai-proxy" && S instanceof Error) {
                    if (SA(A, `claude.ai proxy connection failed after ${m}ms: ${S.message}`), Kz(A, S), S.code === 401) return c("tengu_mcp_server_needs_auth", {
                        transportType: "claudeai-proxy",
                        ...U_(q) ? {
                            mcpServerBaseUrl: U_(q)
                        } : {}
                    }), SA(A, "Authentication required for claude.ai proxy server"), {
                        name: A,
                        type: "needs-auth",
                        config: q
                    }
                } else if (q.type === "sse-ide" || q.type === "ws-ide") c("tengu_mcp_ide_server_connection_failed", {
                    connectionDurationMs: m
                });
                if (z.close().catch(() => {}), $) Kz(A, `Server stderr: ${$}`);
                throw S
            }
            let X = O.getServerCapabilities(),
                D = O.getServerVersion(),
                j = O.getInstructions();
            if (SA(A, `Connection established with capabilities: ${Q1({hasTools:!!X?.tools,hasPrompts:!!X?.prompts,hasResources:!!X?.resources,serverVersion:D||"unknown"})}`), xq1()) O.setRequestHandler(vq1, async (S) => {
                return SA(A, `Elicitation request received during initialization: ${Q1(S)}`), {
                    action: "cancel"
                }
            });
            if (q.type === "sse-ide" || q.type === "ws-ide") {
                let S = Date.now() - Y;
                c("tengu_mcp_ide_server_connection_succeeded", {
                    connectionDurationMs: S,
                    serverVersion: D
                });
                try {
                    hx7(O)
                } catch (m) {
                    Kz(A, `Failed to send ide_connected notification: ${m}`)
                }
            }
            let M = Date.now(),
                P = !1,
                W = O.onerror,
                G = O.onclose,
                f = 0,
                Z = 3,
                N = (S) => {
                    return S.includes("ECONNRESET") || S.includes("ETIMEDOUT") || S.includes("EPIPE") || S.includes("EHOSTUNREACH") || S.includes("ECONNREFUSED") || S.includes("Body Timeout Error") || S.includes("terminated")
                };
            O.onerror = (S) => {
                let m = Date.now() - M;
                P = !0;
                let b = q.type || "stdio";
                if (SA(A, `${b.toUpperCase()} connection dropped after ${Math.floor(m/1000)}s uptime`), S.message)
                    if (S.message.includes("ECONNRESET")) SA(A, "Connection reset - server may have crashed or restarted");
                    else if (S.message.includes("ETIMEDOUT")) SA(A, "Connection timeout - network issue or server unresponsive");
                else if (S.message.includes("ECONNREFUSED")) SA(A, "Connection refused - server may be down");
                else if (S.message.includes("EPIPE")) SA(A, "Broken pipe - server closed connection unexpectedly");
                else if (S.message.includes("EHOSTUNREACH")) SA(A, "Host unreachable - network connectivity issue");
                else if (S.message.includes("ESRCH")) SA(A, "Process not found - stdio server process terminated");
                else if (S.message.includes("spawn")) SA(A, "Failed to spawn process - check command and permissions");
                else SA(A, `Connection error: ${S.message}`);
                if (b === "sse" || b === "http" || b === "claudeai-proxy")
                    if (N(S.message)) {
                        if (f++, SA(A, `Terminal connection error ${f}/${Z}`), f >= Z) SA(A, "Max consecutive errors reached, triggering reconnection via onclose"), f = 0, O.onclose?.()
                    } else f = 0;
                if (W) W(S)
            }, O.onclose = () => {
                let S = Date.now() - M,
                    m = q.type ?? "unknown";
                SA(A, `${m.toUpperCase()} connection closed after ${Math.floor(S/1000)}s (${P?"with errors":"cleanly"})`);
                let b = TCA(A, q);
                if (iR.cache.delete(b), SA(A, "Cleared connection cache for reconnection"), G) G()
            };
            let T = async () => {
                if (H && (q.type === "stdio" || !q.type)) z.stderr?.off("data", H);
                if (q.type === "stdio") try {
                    let m = z.pid;
                    if (m) {
                        SA(A, "Sending SIGINT to MCP server process");
                        try {
                            process.kill(m, "SIGINT")
                        } catch (b) {
                            SA(A, `Error sending SIGINT: ${b}`);
                            return
                        }
                        await new Promise(async (b) => {
                            let g = !1,
                                U = setInterval(() => {
                                    try {
                                        process.kill(m, 0)
                                    } catch {
                                        if (!g) g = !0, clearInterval(U), clearTimeout(x), SA(A, "MCP server process exited cleanly"), b()
                                    }
                                }, 50),
                                x = setTimeout(() => {
                                    if (!g) g = !0, clearInterval(U), SA(A, "Cleanup timeout reached, stopping process monitoring"), b()
                                }, 600);
                            try {
                                if (await new Promise((p) => setTimeout(p, 100)), !g) {
                                    try {
                                        process.kill(m, 0), SA(A, "SIGINT failed, sending SIGTERM to MCP server process");
                                        try {
                                            process.kill(m, "SIGTERM")
                                        } catch (p) {
                                            SA(A, `Error sending SIGTERM: ${p}`), g = !0, clearInterval(U), clearTimeout(x), b();
                                            return
                                        }
                                    } catch {
                                        g = !0, clearInterval(U), clearTimeout(x), b();
                                        return
                                    }
                                    if (await new Promise((p) => setTimeout(p, 400)), !g) try {
                                        process.kill(m, 0), SA(A, "SIGTERM failed, sending SIGKILL to MCP server process");
                                        try {
                                            process.kill(m, "SIGKILL")
                                        } catch (p) {
                                            SA(A, `Error sending SIGKILL: ${p}`)
                                        }
                                    } catch {
                                        g = !0, clearInterval(U), clearTimeout(x), b()
                                    }
                                }
                                if (!g) g = !0, clearInterval(U), clearTimeout(x), b()
                            } catch {
                                if (!g) g = !0, clearInterval(U), clearTimeout(x), b()
                            }
                        })
                    }
                } catch (S) {
                    SA(A, `Error terminating process: ${S}`)
                }
                try {
                    await O.close()
                } catch (S) {
                    SA(A, `Error closing client: ${S}`)
                }
            }, k = Tq(T), y = async () => {
                k?.(), await T()
            }, B = Date.now() - Y;
            return c("tengu_mcp_server_connection_succeeded", {
                connectionDurationMs: B,
                transportType: q.type ?? "stdio",
                totalServers: K?.totalServers,
                stdioCount: K?.stdioCount,
                sseCount: K?.sseCount,
                httpCount: K?.httpCount,
                sseIdeCount: K?.sseIdeCount,
                wsIdeCount: K?.wsIdeCount,
                ...U_(q) ? {
                    mcpServerBaseUrl: U_(q)
                } : {}
            }), {
                name: A,
                client: O,
                type: "connected",
                capabilities: X ?? {},
                serverInfo: D,
                instructions: j,
                config: q,
                cleanup: y
            }
        } catch (z) {
            let w = Date.now() - Y;
            return c("tengu_mcp_server_connection_failed", {
                connectionDurationMs: w,
                totalServers: K?.totalServers || 1,
                stdioCount: K?.stdioCount || (q.type === "stdio" ? 1 : 0),
                sseCount: K?.sseCount || (q.type === "sse" ? 1 : 0),
                httpCount: K?.httpCount || (q.type === "http" ? 1 : 0),
                sseIdeCount: K?.sseIdeCount || (q.type === "sse-ide" ? 1 : 0),
                wsIdeCount: K?.wsIdeCount || (q.type === "ws-ide" ? 1 : 0),
                transportType: q.type ?? "stdio",
                ...U_(q) ? {
                    mcpServerBaseUrl: U_(q)
                } : {}
            }), SA(A, `Connection failed after ${w}ms: ${z instanceof Error?z.message:String(z)}`), Kz(A, `Connection failed: ${z instanceof Error?z.message:String(z)}`), {
                name: A,
                type: "failed",
                config: q,
                error: z instanceof Error ? z.message : String(z)
            }
        }
    }, TCA);
    wI = KA(async (A) => {
        if (A.type !== "connected") return [];
        try {
            if (!A.capabilities?.tools) return [];
            let q = await A.client.request({
                    method: "tools/list"
                }, Kb1),
                K = _a(q.tools),
                Y = A.config.type === "sdk" && J6(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);
            return K.map((z) => ({
                ...ln4,
                name: Y ? z.name : `mcp__${P5(A.name)}__${P5(z.name)}`,
                originalMcpToolName: z.name,
                isMcp: !0,
                async description() {
                    return z.description ?? ""
                },
                async prompt() {
                    return z.description ?? ""
                },
                isConcurrencySafe() {
                    return z.annotations?.readOnlyHint ?? !1
                },
                isReadOnly() {
                    return z.annotations?.readOnlyHint ?? !1
                },
                isDestructive() {
                    return z.annotations?.destructiveHint ?? !1
                },
                isOpenWorld() {
                    return z.annotations?.openWorldHint ?? !1
                },
                inputJSONSchema: z.inputSchema,
                async checkPermissions() {
                    return {
                        behavior: "passthrough",
                        message: "MCPTool requires permission.",
                        suggestions: [{
                            type: "addRules",
                            rules: [{
                                toolName: Y ? z.name : `mcp__${P5(A.name)}__${P5(z.name)}`,
                                ruleContent: void 0
                            }],
                            behavior: "allow",
                            destination: "localSettings"
                        }]
                    }
                },
                async call(w, H, $, O, _) {
                    let J = BBY(O),
                        X = J ? {
                            "claudecode/toolUseId": J
                        } : {};
                    if (_ && J) _({
                        toolUseID: J,
                        data: {
                            type: "mcp_progress",
                            status: "started",
                            serverName: A.name,
                            toolName: z.name
                        }
                    });
                    let D = Date.now();
                    try {
                        let j = await lW1(A),
                            M = await lo4({
                                client: j,
                                tool: z.name,
                                args: w,
                                meta: X,
                                signal: H.abortController.signal,
                                onProgress: _ && J ? (P) => {
                                    _({
                                        toolUseID: J,
                                        data: P
                                    })
                                } : void 0
                            });
                        if (_ && J) _({
                            toolUseID: J,
                            data: {
                                type: "mcp_progress",
                                status: "completed",
                                serverName: A.name,
                                toolName: z.name,
                                elapsedTimeMs: Date.now() - D
                            }
                        });
                        return {
                            data: M.content,
                            ...M._meta || M.structuredContent ? {
                                mcpMeta: {
                                    ...M._meta && {
                                        _meta: M._meta
                                    },
                                    ...M.structuredContent && {
                                        structuredContent: M.structuredContent
                                    }
                                }
                            } : {}
                        }
                    } catch (j) {
                        if (_ && J) _({
                            toolUseID: J,
                            data: {
                                type: "mcp_progress",
                                status: "failed",
                                serverName: A.name,
                                toolName: z.name,
                                elapsedTimeMs: Date.now() - D
                            }
                        });
                        if (j instanceof Error && !(j instanceof Ok)) {
                            let M = j.constructor.name;
                            if (M === "Error") throw new Ok(j.message, j.message.slice(0, 200));
                            if (M === "McpError" && "code" in j && typeof j.code === "number") throw new Ok(j.message, `McpError ${j.code}`)
                        }
                        throw j
                    }
                },
                userFacingName() {
                    let w = z.annotations?.title || z.name;
                    return `${A.name} - ${w} (MCP)`
                },
                ...KG1(A.name) ? hr4(z.name) : {}
            })).filter(xBY)
        } catch (q) {
            return Kz(A.name, `Failed to fetch tools: ${q instanceof Error?q.message:String(q)}`), []
        }
    }), wU1 = KA(async (A) => {
        if (A.type !== "connected") return [];
        try {
            if (!A.capabilities?.resources) return [];
            let q = await A.client.request({
                method: "resources/list"
            }, Vq1);
            if (!q.resources) return [];
            return q.resources.map((K) => ({
                ...K,
                server: A.name
            }))
        } catch (q) {
            return Kz(A.name, `Failed to fetch resources: ${q instanceof Error?q.message:String(q)}`), []
        }
    }), HU1 = KA(async (A) => {
        if (A.type !== "connected") return [];
        try {
            if (!A.capabilities?.prompts) return [];
            let q = await A.client.request({
                method: "prompts/list"
            }, Ab1);
            if (!q.prompts) return [];
            return _a(q.prompts).map((Y) => {
                let z = Object.values(Y.arguments ?? {}).map((w) => w.name);
                return {
                    type: "prompt",
                    name: "mcp__" + P5(A.name) + "__" + Y.name,
                    description: Y.description ?? "",
                    hasUserSpecifiedDescription: !!Y.description,
                    contentLength: 0,
                    isEnabled: () => !0,
                    isHidden: !1,
                    isMcp: !0,
                    progressMessage: "running",
                    userFacingName() {
                        return `${A.name}:${Y.name} (MCP)`
                    },
                    argNames: z,
                    source: "mcp",
                    async getPromptForCommand(w) {
                        let H = w.split(" ");
                        try {
                            let $ = await lW1(A),
                                O = await $.client.getPrompt({
                                    name: Y.name,
                                    arguments: JrA(z, H)
                                });
                            return (await Promise.all(O.messages.map((J) => co4(J.content, $.name)))).flat()
                        } catch ($) {
                            throw Kz(A.name, `Error running command '${Y.name}': ${$ instanceof Error?$.message:String($)}`), $
                        }
                    }
                }
            })
        } catch (q) {
            return Kz(A.name, `Failed to fetch commands: ${q instanceof Error?q.message:String(q)}`), []
        }
    });
    tG6 = KA(async (A) => {
        return new Promise((q) => {
            let K = 0,
                Y = 0;
            if (K = Object.keys(A).length, K === 0) {
                q({
                    clients: [],
                    tools: [],
                    commands: []
                });
                return
            }
            let z = [],
                w = [],
                H = [];
            sG6(($) => {
                if (z.push($.client), w.push(...$.tools), H.push(...$.commands), Y++, Y >= K) {
                    let O = H.reduce((_, J) => {
                        let X = J.name.length + (J.description ?? "").length + (J.argumentHint ?? "").length;
                        return _ + X
                    }, 0);
                    c("tengu_mcp_tools_commands_loaded", {
                        tools_count: w.length,
                        commands_count: H.length,
                        commands_metadata_length: O
                    }), q({
                        clients: z,
                        tools: w,
                        commands: H
                    })
                }
            }, A).catch(($) => {
                Kz("prefetchAllMcpResources", `Failed to get MCP resources: ${$ instanceof Error?$.message:String($)}`), q({
                    clients: [],
                    tools: [],
                    commands: []
                })
            })
        })
    })
})