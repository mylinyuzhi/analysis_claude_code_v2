
// @from(Ln 411239, Col 4)
Q3q = R((Z7$, F3q) => {
    var Z1z = h1("util"),
        VbA = h1("zlib"),
        m3q = JbA(),
        f1z = h3q(),
        V1z = GbA(),
        N1z = ZbA(),
        T1z = fbA(),
        HF = F3q.exports = function(A) {
            m3q.call(this), this._parser = new V1z(A, {
                read: this.read.bind(this),
                error: this._handleError.bind(this),
                metadata: this._handleMetaData.bind(this),
                gamma: this.emit.bind(this, "gamma"),
                palette: this._handlePalette.bind(this),
                transColor: this._handleTransColor.bind(this),
                finished: this._finished.bind(this),
                inflateData: this._inflateData.bind(this),
                simpleTransparency: this._simpleTransparency.bind(this),
                headersFinished: this._headersFinished.bind(this)
            }), this._options = A, this.writable = !0, this._parser.start()
        };
    Z1z.inherits(HF, m3q);
    HF.prototype._handleError = function(A) {
        if (this.emit("error", A), this.writable = !1, this.destroy(), this._inflate && this._inflate.destroy) this._inflate.destroy();
        if (this._filter) this._filter.destroy(), this._filter.on("error", function() {});
        this.errord = !0
    };
    HF.prototype._inflateData = function(A) {
        if (!this._inflate)
            if (this._bitmapInfo.interlace) this._inflate = VbA.createInflate(), this._inflate.on("error", this.emit.bind(this, "error")), this._filter.on("complete", this._complete.bind(this)), this._inflate.pipe(this._filter);
            else {
                let K = ((this._bitmapInfo.width * this._bitmapInfo.bpp * this._bitmapInfo.depth + 7 >> 3) + 1) * this._bitmapInfo.height,
                    Y = Math.max(K, VbA.Z_MIN_CHUNK);
                this._inflate = VbA.createInflate({
                    chunkSize: Y
                });
                let z = K,
                    w = this.emit.bind(this, "error");
                this._inflate.on("error", function($) {
                    if (!z) return;
                    w($)
                }), this._filter.on("complete", this._complete.bind(this));
                let H = this._filter.write.bind(this._filter);
                this._inflate.on("data", function($) {
                    if (!z) return;
                    if ($.length > z) $ = $.slice(0, z);
                    z -= $.length, H($)
                }), this._inflate.on("end", this._filter.end.bind(this._filter))
            } this._inflate.write(A)
    };
    HF.prototype._handleMetaData = function(A) {
        this._metaData = A, this._bitmapInfo = Object.create(A), this._filter = new f1z(this._bitmapInfo)
    };
    HF.prototype._handleTransColor = function(A) {
        this._bitmapInfo.transColor = A
    };
    HF.prototype._handlePalette = function(A) {
        this._bitmapInfo.palette = A
    };
    HF.prototype._simpleTransparency = function() {
        this._metaData.alpha = !0
    };
    HF.prototype._headersFinished = function() {
        this.emit("metadata", this._metaData)
    };
    HF.prototype._finished = function() {
        if (this.errord) return;
        if (!this._inflate) this.emit("error", "No Inflate block");
        else this._inflate.end()
    };
    HF.prototype._complete = function(A) {
        if (this.errord) return;
        let q;
        try {
            let K = N1z.dataToBitMap(A, this._bitmapInfo);
            q = T1z(K, this._bitmapInfo), K = null
        } catch (K) {
            this._handleError(K);
            return
        }
        this.emit("parsed", q)
    }
})
// @from(Ln 411323, Col 4)
U3q = R((f7$, g3q) => {
    var Xy = hZ1();
    g3q.exports = function(A, q, K, Y) {
        let z = [Xy.COLORTYPE_COLOR_ALPHA, Xy.COLORTYPE_ALPHA].indexOf(Y.colorType) !== -1;
        if (Y.colorType === Y.inputColorType) {
            let M = function() {
                let P = new ArrayBuffer(2);
                return new DataView(P).setInt16(0, 256, !0), new Int16Array(P)[0] !== 256
            }();
            if (Y.bitDepth === 8 || Y.bitDepth === 16 && M) return A
        }
        let w = Y.bitDepth !== 16 ? A : new Uint16Array(A.buffer),
            H = 255,
            $ = Xy.COLORTYPE_TO_BPP_MAP[Y.inputColorType];
        if ($ === 4 && !Y.inputHasAlpha) $ = 3;
        let O = Xy.COLORTYPE_TO_BPP_MAP[Y.colorType];
        if (Y.bitDepth === 16) H = 65535, O *= 2;
        let _ = Buffer.alloc(q * K * O),
            J = 0,
            X = 0,
            D = Y.bgColor || {};
        if (D.red === void 0) D.red = H;
        if (D.green === void 0) D.green = H;
        if (D.blue === void 0) D.blue = H;

        function j() {
            let M, P, W, G = H;
            switch (Y.inputColorType) {
                case Xy.COLORTYPE_COLOR_ALPHA:
                    G = w[J + 3], M = w[J], P = w[J + 1], W = w[J + 2];
                    break;
                case Xy.COLORTYPE_COLOR:
                    M = w[J], P = w[J + 1], W = w[J + 2];
                    break;
                case Xy.COLORTYPE_ALPHA:
                    G = w[J + 1], M = w[J], P = M, W = M;
                    break;
                case Xy.COLORTYPE_GRAYSCALE:
                    M = w[J], P = M, W = M;
                    break;
                default:
                    throw Error("input color type:" + Y.inputColorType + " is not supported at present")
            }
            if (Y.inputHasAlpha) {
                if (!z) G /= H, M = Math.min(Math.max(Math.round((1 - G) * D.red + G * M), 0), H), P = Math.min(Math.max(Math.round((1 - G) * D.green + G * P), 0), H), W = Math.min(Math.max(Math.round((1 - G) * D.blue + G * W), 0), H)
            }
            return {
                red: M,
                green: P,
                blue: W,
                alpha: G
            }
        }
        for (let M = 0; M < K; M++)
            for (let P = 0; P < q; P++) {
                let W = j(w, J);
                switch (Y.colorType) {
                    case Xy.COLORTYPE_COLOR_ALPHA:
                    case Xy.COLORTYPE_COLOR:
                        if (Y.bitDepth === 8) {
                            if (_[X] = W.red, _[X + 1] = W.green, _[X + 2] = W.blue, z) _[X + 3] = W.alpha
                        } else if (_.writeUInt16BE(W.red, X), _.writeUInt16BE(W.green, X + 2), _.writeUInt16BE(W.blue, X + 4), z) _.writeUInt16BE(W.alpha, X + 6);
                        break;
                    case Xy.COLORTYPE_ALPHA:
                    case Xy.COLORTYPE_GRAYSCALE: {
                        let G = (W.red + W.green + W.blue) / 3;
                        if (Y.bitDepth === 8) {
                            if (_[X] = G, z) _[X + 1] = W.alpha
                        } else if (_.writeUInt16BE(G, X), z) _.writeUInt16BE(W.alpha, X + 2);
                        break
                    }
                    default:
                        throw Error("unrecognised color Type " + Y.colorType)
                }
                J += $, X += O
            }
        return _
    }
})
// @from(Ln 411402, Col 4)
c3q = R((V7$, d3q) => {
    var p3q = DbA();

    function v1z(A, q, K, Y, z) {
        for (let w = 0; w < K; w++) Y[z + w] = A[q + w]
    }

    function E1z(A, q, K) {
        let Y = 0,
            z = q + K;
        for (let w = q; w < z; w++) Y += Math.abs(A[w]);
        return Y
    }

    function k1z(A, q, K, Y, z, w) {
        for (let H = 0; H < K; H++) {
            let $ = H >= w ? A[q + H - w] : 0,
                O = A[q + H] - $;
            Y[z + H] = O
        }
    }

    function L1z(A, q, K, Y) {
        let z = 0;
        for (let w = 0; w < K; w++) {
            let H = w >= Y ? A[q + w - Y] : 0,
                $ = A[q + w] - H;
            z += Math.abs($)
        }
        return z
    }

    function R1z(A, q, K, Y, z) {
        for (let w = 0; w < K; w++) {
            let H = q > 0 ? A[q + w - K] : 0,
                $ = A[q + w] - H;
            Y[z + w] = $
        }
    }

    function y1z(A, q, K) {
        let Y = 0,
            z = q + K;
        for (let w = q; w < z; w++) {
            let H = q > 0 ? A[w - K] : 0,
                $ = A[w] - H;
            Y += Math.abs($)
        }
        return Y
    }

    function C1z(A, q, K, Y, z, w) {
        for (let H = 0; H < K; H++) {
            let $ = H >= w ? A[q + H - w] : 0,
                O = q > 0 ? A[q + H - K] : 0,
                _ = A[q + H] - ($ + O >> 1);
            Y[z + H] = _
        }
    }

    function S1z(A, q, K, Y) {
        let z = 0;
        for (let w = 0; w < K; w++) {
            let H = w >= Y ? A[q + w - Y] : 0,
                $ = q > 0 ? A[q + w - K] : 0,
                O = A[q + w] - (H + $ >> 1);
            z += Math.abs(O)
        }
        return z
    }

    function h1z(A, q, K, Y, z, w) {
        for (let H = 0; H < K; H++) {
            let $ = H >= w ? A[q + H - w] : 0,
                O = q > 0 ? A[q + H - K] : 0,
                _ = q > 0 && H >= w ? A[q + H - (K + w)] : 0,
                J = A[q + H] - p3q($, O, _);
            Y[z + H] = J
        }
    }

    function I1z(A, q, K, Y) {
        let z = 0;
        for (let w = 0; w < K; w++) {
            let H = w >= Y ? A[q + w - Y] : 0,
                $ = q > 0 ? A[q + w - K] : 0,
                O = q > 0 && w >= Y ? A[q + w - (K + Y)] : 0,
                _ = A[q + w] - p3q(H, $, O);
            z += Math.abs(_)
        }
        return z
    }
    var x1z = {
            0: v1z,
            1: k1z,
            2: R1z,
            3: C1z,
            4: h1z
        },
        b1z = {
            0: E1z,
            1: L1z,
            2: y1z,
            3: S1z,
            4: I1z
        };
    d3q.exports = function(A, q, K, Y, z) {
        let w;
        if (!("filterType" in Y) || Y.filterType === -1) w = [0, 1, 2, 3, 4];
        else if (typeof Y.filterType === "number") w = [Y.filterType];
        else throw Error("unrecognised filter types");
        if (Y.bitDepth === 16) z *= 2;
        let H = q * z,
            $ = 0,
            O = 0,
            _ = Buffer.alloc((H + 1) * K),
            J = w[0];
        for (let X = 0; X < K; X++) {
            if (w.length > 1) {
                let D = 1 / 0;
                for (let j = 0; j < w.length; j++) {
                    let M = b1z[w[j]](A, O, H, z);
                    if (M < D) J = w[j], D = M
                }
            }
            _[$] = J, $++, x1z[J](A, O, H, _, $, z), $ += H, O += H
        }
        return _
    }
})
// @from(Ln 411532, Col 4)
NbA = R((N7$, l3q) => {
    var _G = hZ1(),
        u1z = WbA(),
        B1z = U3q(),
        m1z = c3q(),
        F1z = h1("zlib"),
        Te = l3q.exports = function(A) {
            if (this._options = A, A.deflateChunkSize = A.deflateChunkSize || 32768, A.deflateLevel = A.deflateLevel != null ? A.deflateLevel : 9, A.deflateStrategy = A.deflateStrategy != null ? A.deflateStrategy : 3, A.inputHasAlpha = A.inputHasAlpha != null ? A.inputHasAlpha : !0, A.deflateFactory = A.deflateFactory || F1z.createDeflate, A.bitDepth = A.bitDepth || 8, A.colorType = typeof A.colorType === "number" ? A.colorType : _G.COLORTYPE_COLOR_ALPHA, A.inputColorType = typeof A.inputColorType === "number" ? A.inputColorType : _G.COLORTYPE_COLOR_ALPHA, [_G.COLORTYPE_GRAYSCALE, _G.COLORTYPE_COLOR, _G.COLORTYPE_COLOR_ALPHA, _G.COLORTYPE_ALPHA].indexOf(A.colorType) === -1) throw Error("option color type:" + A.colorType + " is not supported at present");
            if ([_G.COLORTYPE_GRAYSCALE, _G.COLORTYPE_COLOR, _G.COLORTYPE_COLOR_ALPHA, _G.COLORTYPE_ALPHA].indexOf(A.inputColorType) === -1) throw Error("option input color type:" + A.inputColorType + " is not supported at present");
            if (A.bitDepth !== 8 && A.bitDepth !== 16) throw Error("option bit depth:" + A.bitDepth + " is not supported at present")
        };
    Te.prototype.getDeflateOptions = function() {
        return {
            chunkSize: this._options.deflateChunkSize,
            level: this._options.deflateLevel,
            strategy: this._options.deflateStrategy
        }
    };
    Te.prototype.createDeflate = function() {
        return this._options.deflateFactory(this.getDeflateOptions())
    };
    Te.prototype.filterData = function(A, q, K) {
        let Y = B1z(A, q, K, this._options),
            z = _G.COLORTYPE_TO_BPP_MAP[this._options.colorType];
        return m1z(Y, q, K, this._options, z)
    };
    Te.prototype._packChunk = function(A, q) {
        let K = q ? q.length : 0,
            Y = Buffer.alloc(K + 12);
        if (Y.writeUInt32BE(K, 0), Y.writeUInt32BE(A, 4), q) q.copy(Y, 8);
        return Y.writeInt32BE(u1z.crc32(Y.slice(4, Y.length - 4)), Y.length - 4), Y
    };
    Te.prototype.packGAMA = function(A) {
        let q = Buffer.alloc(4);
        return q.writeUInt32BE(Math.floor(A * _G.GAMMA_DIVISION), 0), this._packChunk(_G.TYPE_gAMA, q)
    };
    Te.prototype.packIHDR = function(A, q) {
        let K = Buffer.alloc(13);
        return K.writeUInt32BE(A, 0), K.writeUInt32BE(q, 4), K[8] = this._options.bitDepth, K[9] = this._options.colorType, K[10] = 0, K[11] = 0, K[12] = 0, this._packChunk(_G.TYPE_IHDR, K)
    };
    Te.prototype.packIDAT = function(A) {
        return this._packChunk(_G.TYPE_IDAT, A)
    };
    Te.prototype.packIEND = function() {
        return this._packChunk(_G.TYPE_IEND, null)
    }
})
// @from(Ln 411579, Col 4)
o3q = R((T7$, r3q) => {
    var Q1z = h1("util"),
        i3q = h1("stream"),
        g1z = hZ1(),
        U1z = NbA(),
        n3q = r3q.exports = function(A) {
            i3q.call(this);
            let q = A || {};
            this._packer = new U1z(q), this._deflate = this._packer.createDeflate(), this.readable = !0
        };
    Q1z.inherits(n3q, i3q);
    n3q.prototype.pack = function(A, q, K, Y) {
        if (this.emit("data", Buffer.from(g1z.PNG_SIGNATURE)), this.emit("data", this._packer.packIHDR(q, K)), Y) this.emit("data", this._packer.packGAMA(Y));
        let z = this._packer.filterData(A, q, K);
        this._deflate.on("error", this.emit.bind(this, "error")), this._deflate.on("data", function(w) {
            this.emit("data", this._packer.packIDAT(w))
        }.bind(this)), this._deflate.on("end", function() {
            this.emit("data", this._packer.packIEND()), this.emit("end")
        }.bind(this)), this._deflate.end(z)
    }
})
// @from(Ln 411600, Col 4)
q5q = R((Up1, A5q) => {
    var a3q = h1("assert").ok,
        IZ1 = h1("zlib"),
        p1z = h1("util"),
        s3q = h1("buffer").kMaxLength;

    function m91(A) {
        if (!(this instanceof m91)) return new m91(A);
        if (A && A.chunkSize < IZ1.Z_MIN_CHUNK) A.chunkSize = IZ1.Z_MIN_CHUNK;
        if (IZ1.Inflate.call(this, A), this._offset = this._offset === void 0 ? this._outOffset : this._offset, this._buffer = this._buffer || this._outBuffer, A && A.maxLength != null) this._maxLength = A.maxLength
    }

    function d1z(A) {
        return new m91(A)
    }

    function t3q(A, q) {
        if (q) process.nextTick(q);
        if (!A._handle) return;
        A._handle.close(), A._handle = null
    }
    m91.prototype._processChunk = function(A, q, K) {
        if (typeof K === "function") return IZ1.Inflate._processChunk.call(this, A, q, K);
        let Y = this,
            z = A && A.length,
            w = this._chunkSize - this._offset,
            H = this._maxLength,
            $ = 0,
            O = [],
            _ = 0,
            J;
        this.on("error", function(M) {
            J = M
        });

        function X(M, P) {
            if (Y._hadError) return;
            let W = w - P;
            if (a3q(W >= 0, "have should not go down"), W > 0) {
                let G = Y._buffer.slice(Y._offset, Y._offset + W);
                if (Y._offset += W, G.length > H) G = G.slice(0, H);
                if (O.push(G), _ += G.length, H -= G.length, H === 0) return !1
            }
            if (P === 0 || Y._offset >= Y._chunkSize) w = Y._chunkSize, Y._offset = 0, Y._buffer = Buffer.allocUnsafe(Y._chunkSize);
            if (P === 0) return $ += z - M, z = M, !0;
            return !1
        }
        a3q(this._handle, "zlib binding closed");
        let D;
        do D = this._handle.writeSync(q, A, $, z, this._buffer, this._offset, w), D = D || this._writeState; while (!this._hadError && X(D[0], D[1]));
        if (this._hadError) throw J;
        if (_ >= s3q) throw t3q(this), RangeError("Cannot create final Buffer. It would be larger than 0x" + s3q.toString(16) + " bytes");
        let j = Buffer.concat(O, _);
        return t3q(this), j
    };
    p1z.inherits(m91, IZ1.Inflate);

    function c1z(A, q) {
        if (typeof q === "string") q = Buffer.from(q);
        if (!(q instanceof Buffer)) throw TypeError("Not a string or buffer");
        let K = A._finishFlushFlag;
        if (K == null) K = IZ1.Z_FINISH;
        return A._processChunk(q, K)
    }

    function e3q(A, q) {
        return c1z(new m91(q), A)
    }
    A5q.exports = Up1 = e3q;
    Up1.Inflate = m91;
    Up1.createInflate = d1z;
    Up1.inflateSync = e3q
})
// @from(Ln 411673, Col 4)
TbA = R((v7$, Y5q) => {
    var K5q = Y5q.exports = function(A) {
        this._buffer = A, this._reads = []
    };
    K5q.prototype.read = function(A, q) {
        this._reads.push({
            length: Math.abs(A),
            allowLess: A < 0,
            func: q
        })
    };
    K5q.prototype.process = function() {
        while (this._reads.length > 0 && this._buffer.length) {
            let A = this._reads[0];
            if (this._buffer.length && (this._buffer.length >= A.length || A.allowLess)) {
                this._reads.shift();
                let q = this._buffer;
                this._buffer = q.slice(A.length), A.func.call(this, q.slice(0, A.length))
            } else break
        }
        if (this._reads.length > 0) return Error("There are some read requests waitng on finished stream");
        if (this._buffer.length > 0) return Error("unrecognised content at end of stream")
    }
})
// @from(Ln 411697, Col 4)
z5q = R((n1z) => {
    var l1z = TbA(),
        i1z = jbA();
    n1z.process = function(A, q) {
        let K = [],
            Y = new l1z(A);
        return new i1z(q, {
            read: Y.read.bind(Y),
            write: function(w) {
                K.push(w)
            },
            complete: function() {}
        }).start(), Y.process(), Buffer.concat(K)
    }
})
// @from(Ln 411712, Col 4)
O5q = R((k7$, $5q) => {
    var w5q = !0,
        H5q = h1("zlib"),
        o1z = q5q();
    if (!H5q.deflateSync) w5q = !1;
    var a1z = TbA(),
        s1z = z5q(),
        t1z = GbA(),
        e1z = ZbA(),
        A6z = fbA();
    $5q.exports = function(A, q) {
        if (!w5q) throw Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");
        let K;

        function Y(N) {
            K = N
        }
        let z;

        function w(N) {
            z = N
        }

        function H(N) {
            z.transColor = N
        }

        function $(N) {
            z.palette = N
        }

        function O() {
            z.alpha = !0
        }
        let _;

        function J(N) {
            _ = N
        }
        let X = [];

        function D(N) {
            X.push(N)
        }
        let j = new a1z(A);
        if (new t1z(q, {
                read: j.read.bind(j),
                error: Y,
                metadata: w,
                gamma: J,
                palette: $,
                transColor: H,
                inflateData: D,
                simpleTransparency: O
            }).start(), j.process(), K) throw K;
        let P = Buffer.concat(X);
        X.length = 0;
        let W;
        if (z.interlace) W = H5q.inflateSync(P);
        else {
            let T = ((z.width * z.bpp * z.depth + 7 >> 3) + 1) * z.height;
            W = o1z(P, {
                chunkSize: T,
                maxLength: T
            })
        }
        if (P = null, !W || !W.length) throw Error("bad png - invalid inflate data response");
        let G = s1z.process(W, z);
        P = null;
        let f = e1z.dataToBitMap(G, z);
        G = null;
        let Z = A6z(f, z);
        return z.data = Z, z.gamma = _ || 0, z
    }
})
// @from(Ln 411787, Col 4)
D5q = R((L7$, X5q) => {
    var _5q = !0,
        J5q = h1("zlib");
    if (!J5q.deflateSync) _5q = !1;
    var q6z = hZ1(),
        K6z = NbA();
    X5q.exports = function(A, q) {
        if (!_5q) throw Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");
        let Y = new K6z(q || {}),
            z = [];
        if (z.push(Buffer.from(q6z.PNG_SIGNATURE)), z.push(Y.packIHDR(A.width, A.height)), A.gamma) z.push(Y.packGAMA(A.gamma));
        let w = Y.filterData(A.data, A.width, A.height),
            H = J5q.deflateSync(w, Y.getDeflateOptions());
        if (w = null, !H || !H.length) throw Error("bad png - invalid compressed data response");
        return z.push(Y.packIDAT(H)), z.push(Y.packIEND()), Buffer.concat(z)
    }
})
// @from(Ln 411804, Col 4)
j5q = R((w6z) => {
    var Y6z = O5q(),
        z6z = D5q();
    w6z.read = function(A, q) {
        return Y6z(A, q || {})
    };
    w6z.write = function(A, q) {
        return z6z(A, q)
    }
})
// @from(Ln 411814, Col 4)
P5q = R((D6z) => {
    var O6z = h1("util"),
        M5q = h1("stream"),
        _6z = Q3q(),
        J6z = o3q(),
        X6z = j5q(),
        Yf = D6z.PNG = function(A) {
            if (M5q.call(this), A = A || {}, this.width = A.width | 0, this.height = A.height | 0, this.data = this.width > 0 && this.height > 0 ? Buffer.alloc(4 * this.width * this.height) : null, A.fill && this.data) this.data.fill(0);
            this.gamma = 0, this.readable = this.writable = !0, this._parser = new _6z(A), this._parser.on("error", this.emit.bind(this, "error")), this._parser.on("close", this._handleClose.bind(this)), this._parser.on("metadata", this._metadata.bind(this)), this._parser.on("gamma", this._gamma.bind(this)), this._parser.on("parsed", function(q) {
                this.data = q, this.emit("parsed", q)
            }.bind(this)), this._packer = new J6z(A), this._packer.on("data", this.emit.bind(this, "data")), this._packer.on("end", this.emit.bind(this, "end")), this._parser.on("close", this._handleClose.bind(this)), this._packer.on("error", this.emit.bind(this, "error"))
        };
    O6z.inherits(Yf, M5q);
    Yf.sync = X6z;
    Yf.prototype.pack = function() {
        if (!this.data || !this.data.length) return this.emit("error", "No data provided"), this;
        return process.nextTick(function() {
            this._packer.pack(this.data, this.width, this.height, this.gamma)
        }.bind(this)), this
    };
    Yf.prototype.parse = function(A, q) {
        if (q) {
            let K, Y;
            K = function(z) {
                this.removeListener("error", Y), this.data = z, q(null, this)
            }.bind(this), Y = function(z) {
                this.removeListener("parsed", K), q(z, null)
            }.bind(this), this.once("parsed", K), this.once("error", Y)
        }
        return this.end(A), this
    };
    Yf.prototype.write = function(A) {
        return this._parser.write(A), !0
    };
    Yf.prototype.end = function(A) {
        this._parser.end(A)
    };
    Yf.prototype._metadata = function(A) {
        this.width = A.width, this.height = A.height, this.emit("metadata", A)
    };
    Yf.prototype._gamma = function(A) {
        this.gamma = A
    };
    Yf.prototype._handleClose = function() {
        if (!this._parser.writable && !this._packer.readable) this.emit("close")
    };
    Yf.bitblt = function(A, q, K, Y, z, w, H, $) {
        if (K |= 0, Y |= 0, z |= 0, w |= 0, H |= 0, $ |= 0, K > A.width || Y > A.height || K + z > A.width || Y + w > A.height) throw Error("bitblt reading outside image");
        if (H > q.width || $ > q.height || H + z > q.width || $ + w > q.height) throw Error("bitblt writing outside image");
        for (let O = 0; O < w; O++) A.data.copy(q.data, ($ + O) * q.width + H << 2, (Y + O) * A.width + K << 2, (Y + O) * A.width + K + z << 2)
    };
    Yf.prototype.bitblt = function(A, q, K, Y, z, w, H) {
        return Yf.bitblt(this, A, q, K, Y, z, w, H), this
    };
    Yf.adjustGamma = function(A) {
        if (A.gamma) {
            for (let q = 0; q < A.height; q++)
                for (let K = 0; K < A.width; K++) {
                    let Y = A.width * q + K << 2;
                    for (let z = 0; z < 3; z++) {
                        let w = A.data[Y + z] / 255;
                        w = Math.pow(w, 0.45454545454545453 / A.gamma), A.data[Y + z] = Math.round(w * 255)
                    }
                }
            A.gamma = 0
        }
    };
    Yf.prototype.adjustGamma = function() {
        Yf.adjustGamma(this)
    }
})
// @from(Ln 411885, Col 4)
pp1 = R((j6z) => {
    function W5q(A) {
        if (typeof A === "number") A = A.toString();
        if (typeof A !== "string") throw Error("Color should be defined as hex string");
        let q = A.slice().replace("#", "").split("");
        if (q.length < 3 || q.length === 5 || q.length > 8) throw Error("Invalid hex color: " + A);
        if (q.length === 3 || q.length === 4) q = Array.prototype.concat.apply([], q.map(function(Y) {
            return [Y, Y]
        }));
        if (q.length === 6) q.push("F", "F");
        let K = parseInt(q.join(""), 16);
        return {
            r: K >> 24 & 255,
            g: K >> 16 & 255,
            b: K >> 8 & 255,
            a: K & 255,
            hex: "#" + q.slice(0, 6).join("")
        }
    }
    j6z.getOptions = function(q) {
        if (!q) q = {};
        if (!q.color) q.color = {};
        let K = typeof q.margin > "u" || q.margin === null || q.margin < 0 ? 4 : q.margin,
            Y = q.width && q.width >= 21 ? q.width : void 0,
            z = q.scale || 4;
        return {
            width: Y,
            scale: Y ? 4 : z,
            margin: K,
            color: {
                dark: W5q(q.color.dark || "#000000ff"),
                light: W5q(q.color.light || "#ffffffff")
            },
            type: q.type,
            rendererOpts: q.rendererOpts || {}
        }
    };
    j6z.getScale = function(q, K) {
        return K.width && K.width >= q + K.margin * 2 ? K.width / (q + K.margin * 2) : K.scale
    };
    j6z.getImageWidth = function(q, K) {
        let Y = j6z.getScale(q, K);
        return Math.floor((q + K.margin * 2) * Y)
    };
    j6z.qrToImageData = function(q, K, Y) {
        let z = K.modules.size,
            w = K.modules.data,
            H = j6z.getScale(z, Y),
            $ = Math.floor((z + Y.margin * 2) * H),
            O = Y.margin * H,
            _ = [Y.color.light, Y.color.dark];
        for (let J = 0; J < $; J++)
            for (let X = 0; X < $; X++) {
                let D = (J * $ + X) * 4,
                    j = Y.color.light;
                if (J >= O && X >= O && J < $ - O && X < $ - O) {
                    let M = Math.floor((J - O) / H),
                        P = Math.floor((X - O) / H);
                    j = _[w[M * z + P] ? 1 : 0]
                }
                q[D++] = j.r, q[D++] = j.g, q[D++] = j.b, q[D] = j.a
            }
    }
})
// @from(Ln 411949, Col 4)
G5q = R((f6z) => {
    var G6z = h1("fs"),
        Z6z = P5q().PNG,
        EbA = pp1();
    f6z.render = function(q, K) {
        let Y = EbA.getOptions(K),
            z = Y.rendererOpts,
            w = EbA.getImageWidth(q.modules.size, Y);
        z.width = w, z.height = w;
        let H = new Z6z(z);
        return EbA.qrToImageData(H.data, q, Y), H
    };
    f6z.renderToDataURL = function(q, K, Y) {
        if (typeof Y > "u") Y = K, K = void 0;
        f6z.renderToBuffer(q, K, function(z, w) {
            if (z) Y(z);
            let H = "data:image/png;base64,";
            H += w.toString("base64"), Y(null, H)
        })
    };
    f6z.renderToBuffer = function(q, K, Y) {
        if (typeof Y > "u") Y = K, K = void 0;
        let z = f6z.render(q, K),
            w = [];
        z.on("error", Y), z.on("data", function(H) {
            w.push(H)
        }), z.on("end", function() {
            Y(null, Buffer.concat(w))
        }), z.pack()
    };
    f6z.renderToFile = function(q, K, Y, z) {
        if (typeof z > "u") z = Y, Y = void 0;
        let w = !1,
            H = (...O) => {
                if (w) return;
                w = !0, z.apply(null, O)
            },
            $ = G6z.createWriteStream(q);
        $.on("error", H), $.on("close", H), f6z.renderToFileStream($, K, Y)
    };
    f6z.renderToFileStream = function(q, K, Y) {
        f6z.render(K, Y).pack().pipe(q)
    }
})
// @from(Ln 411993, Col 4)
f5q = R((y6z) => {
    var E6z = pp1(),
        k6z = {
            WW: " ",
            WB: "▄",
            BB: "█",
            BW: "▀"
        },
        L6z = {
            BB: " ",
            BW: "▄",
            WW: "█",
            WB: "▀"
        };

    function R6z(A, q, K) {
        if (A && q) return K.BB;
        if (A && !q) return K.BW;
        if (!A && q) return K.WB;
        return K.WW
    }
    y6z.render = function(A, q, K) {
        let Y = E6z.getOptions(q),
            z = k6z;
        if (Y.color.dark.hex === "#ffffff" || Y.color.light.hex === "#000000") z = L6z;
        let w = A.modules.size,
            H = A.modules.data,
            $ = "",
            O = Array(w + Y.margin * 2 + 1).join(z.WW);
        O = Array(Y.margin / 2 + 1).join(O + `
`);
        let _ = Array(Y.margin + 1).join(z.WW);
        $ += O;
        for (let J = 0; J < w; J += 2) {
            $ += _;
            for (let X = 0; X < w; X++) {
                let D = H[J * w + X],
                    j = H[(J + 1) * w + X];
                $ += R6z(D, j, z)
            }
            $ += _ + `
`
        }
        if ($ += O.slice(0, -1), typeof K === "function") K(null, $);
        return $
    };
    y6z.renderToFile = function(q, K, Y, z) {
        if (typeof z > "u") z = Y, Y = void 0;
        let w = h1("fs"),
            H = y6z.render(K, Y);
        w.writeFile(q, H, z)
    }
})
// @from(Ln 412046, Col 4)
V5q = R((S6z) => {
    S6z.render = function(A, q, K) {
        let Y = A.modules.size,
            z = A.modules.data,
            w = "\x1B[40m  \x1B[0m",
            H = "\x1B[47m  \x1B[0m",
            $ = "",
            O = Array(Y + 3).join("\x1B[47m  \x1B[0m"),
            _ = Array(2).join("\x1B[47m  \x1B[0m");
        $ += O + `
`;
        for (let J = 0; J < Y; ++J) {
            $ += "\x1B[47m  \x1B[0m";
            for (let X = 0; X < Y; X++) $ += z[J * Y + X] ? "\x1B[40m  \x1B[0m" : "\x1B[47m  \x1B[0m";
            $ += _ + `
`
        }
        if ($ += O + `
`, typeof K === "function") K(null, $);
        return $
    }
})
// @from(Ln 412068, Col 4)
v5q = R((u6z) => {
    var I6z = "\x1B[47m\x1B[30m",
        x6z = "\x1B[40m\x1B[37m",
        b6z = function(A, q, K) {
            return {
                "00": "\x1B[0m " + A,
                "01": "\x1B[0m" + q + "▄" + A,
                "02": "\x1B[0m" + K + "▄" + A,
                10: "\x1B[0m" + q + "▀" + A,
                11: " ",
                12: "▄",
                20: "\x1B[0m" + K + "▀" + A,
                21: "▀",
                22: "█"
            }
        },
        N5q = function(A, q, K, Y) {
            let z = q + 1;
            if (K >= z || Y >= z || Y < -1 || K < -1) return "0";
            if (K >= q || Y >= q || Y < 0 || K < 0) return "1";
            let w = Y * q + K;
            return A[w] ? "2" : "1"
        },
        T5q = function(A, q, K, Y) {
            return N5q(A, q, K, Y) + N5q(A, q, K, Y + 1)
        };
    u6z.render = function(A, q, K) {
        let Y = A.modules.size,
            z = A.modules.data,
            w = !!(q && q.inverse),
            H = q && q.inverse ? x6z : I6z,
            _ = b6z(H, w ? "\x1B[30m" : "\x1B[37m", w ? "\x1B[37m" : "\x1B[30m"),
            J = `\x1B[0m
` + H,
            X = H;
        for (let D = -1; D < Y + 1; D += 2) {
            for (let j = -1; j < Y; j++) X += _[T5q(z, Y, j, D)];
            X += _[T5q(z, Y, Y, D)] + J
        }
        if (X += "\x1B[0m", typeof K === "function") K(null, X);
        return X
    }
})
// @from(Ln 412111, Col 4)
E5q = R((Q6z) => {
    var m6z = V5q(),
        F6z = v5q();
    Q6z.render = function(A, q, K) {
        if (q && q.small) return F6z.render(A, q, K);
        return m6z.render(A, q, K)
    }
})
// @from(Ln 412119, Col 4)
RbA = R((d6z) => {
    var U6z = pp1();

    function k5q(A, q) {
        let K = A.a / 255,
            Y = q + '="' + A.hex + '"';
        return K < 1 ? Y + " " + q + '-opacity="' + K.toFixed(2).slice(1) + '"' : Y
    }

    function LbA(A, q, K) {
        let Y = A + q;
        if (typeof K < "u") Y += " " + K;
        return Y
    }

    function p6z(A, q, K) {
        let Y = "",
            z = 0,
            w = !1,
            H = 0;
        for (let $ = 0; $ < A.length; $++) {
            let O = Math.floor($ % q),
                _ = Math.floor($ / q);
            if (!O && !w) w = !0;
            if (A[$]) {
                if (H++, !($ > 0 && O > 0 && A[$ - 1])) Y += w ? LbA("M", O + K, 0.5 + _ + K) : LbA("m", z, 0), z = 0, w = !1;
                if (!(O + 1 < q && A[$ + 1])) Y += LbA("h", H), H = 0
            } else z++
        }
        return Y
    }
    d6z.render = function(q, K, Y) {
        let z = U6z.getOptions(K),
            w = q.modules.size,
            H = q.modules.data,
            $ = w + z.margin * 2,
            O = !z.color.light.a ? "" : "<path " + k5q(z.color.light, "fill") + ' d="M0 0h' + $ + "v" + $ + 'H0z"/>',
            _ = "<path " + k5q(z.color.dark, "stroke") + ' d="' + p6z(H, w, z.margin) + '"/>',
            J = 'viewBox="0 0 ' + $ + " " + $ + '"',
            D = '<svg xmlns="http://www.w3.org/2000/svg" ' + (!z.width ? "" : 'width="' + z.width + '" height="' + z.width + '" ') + J + ' shape-rendering="crispEdges">' + O + _ + `</svg>
`;
        if (typeof Y === "function") Y(null, D);
        return D
    }
})
// @from(Ln 412164, Col 4)
R5q = R((i6z) => {
    var l6z = RbA();
    i6z.render = l6z.render;
    i6z.renderToFile = function(q, K, Y, z) {
        if (typeof z > "u") z = Y, Y = void 0;
        let w = h1("fs"),
            $ = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + i6z.render(K, Y);
        w.writeFile(q, $, z)
    }
})
// @from(Ln 412174, Col 4)
C5q = R((a6z) => {
    var ybA = pp1();

    function r6z(A, q, K) {
        if (A.clearRect(0, 0, q.width, q.height), !q.style) q.style = {};
        q.height = K, q.width = K, q.style.height = K + "px", q.style.width = K + "px"
    }

    function o6z() {
        try {
            return document.createElement("canvas")
        } catch (A) {
            throw Error("You need to specify a canvas element")
        }
    }
    a6z.render = function(q, K, Y) {
        let z = Y,
            w = K;
        if (typeof z > "u" && (!K || !K.getContext)) z = K, K = void 0;
        if (!K) w = o6z();
        z = ybA.getOptions(z);
        let H = ybA.getImageWidth(q.modules.size, z),
            $ = w.getContext("2d"),
            O = $.createImageData(H, H);
        return ybA.qrToImageData(O.data, q, z), r6z($, w, H), $.putImageData(O, 0, 0), w
    };
    a6z.renderToDataURL = function(q, K, Y) {
        let z = Y;
        if (typeof z > "u" && (!K || !K.getContext)) z = K, K = void 0;
        if (!z) z = {};
        let w = a6z.render(q, K, z),
            H = z.type || "image/png",
            $ = z.rendererOpts || {};
        return w.toDataURL(H, $.quality)
    }
})
// @from(Ln 412210, Col 4)
h5q = R((AAz) => {
    var t6z = QxA(),
        CbA = _bA(),
        S5q = C5q(),
        e6z = RbA();

    function SbA(A, q, K, Y, z) {
        let w = [].slice.call(arguments, 1),
            H = w.length,
            $ = typeof w[H - 1] === "function";
        if (!$ && !t6z()) throw Error("Callback required as last argument");
        if ($) {
            if (H < 2) throw Error("Too few arguments provided");
            if (H === 2) z = K, K = q, q = Y = void 0;
            else if (H === 3)
                if (q.getContext && typeof z > "u") z = Y, Y = void 0;
                else z = Y, Y = K, K = q, q = void 0
        } else {
            if (H < 1) throw Error("Too few arguments provided");
            if (H === 1) K = q, q = Y = void 0;
            else if (H === 2 && !q.getContext) Y = K, K = q, q = void 0;
            return new Promise(function(O, _) {
                try {
                    let J = CbA.create(K, Y);
                    O(A(J, q, Y))
                } catch (J) {
                    _(J)
                }
            })
        }
        try {
            let O = CbA.create(K, Y);
            z(null, A(O, q, Y))
        } catch (O) {
            z(O)
        }
    }
    AAz.create = CbA.create;
    AAz.toCanvas = SbA.bind(null, S5q.render);
    AAz.toDataURL = SbA.bind(null, S5q.renderToDataURL);
    AAz.toString = SbA.bind(null, function(A, q, K) {
        return e6z.render(A, K)
    })
})
// @from(Ln 412255, Col 0)
function _Az(A, q, K) {
    if (typeof A > "u") throw Error("String required as first argument");
    if (typeof K > "u") K = q, q = {};
    if (typeof K !== "function")
        if (!wAz()) throw Error("Callback required as last argument");
        else q = K || {}, K = null;
    return {
        opts: q,
        cb: K
    }
}
// @from(Ln 412267, Col 0)
function JAz(A) {
    switch (A) {
        case "svg":
            return OAz;
        case "terminal":
            return $Az;
        case "utf8":
        default:
            return HAz
    }
}
// @from(Ln 412279, Col 0)
function XAz(A, q, K) {
    if (!K.cb) return new Promise(function(Y, z) {
        try {
            let w = hbA.create(q, K.opts);
            return A(w, K.opts, function(H, $) {
                return H ? z(H) : Y($)
            })
        } catch (w) {
            z(w)
        }
    });
    try {
        let Y = hbA.create(q, K.opts);
        return A(Y, K.opts, K.cb)
    } catch (Y) {
        K.cb(Y)
    }
}
// @from(Ln 412297, Col 4)
wAz
// @from(Ln 412297, Col 9)
hbA
// @from(Ln 412297, Col 14)
g7$
// @from(Ln 412297, Col 19)
HAz
// @from(Ln 412297, Col 24)
$Az
// @from(Ln 412297, Col 29)
OAz
// @from(Ln 412297, Col 34)
DAz
// @from(Ln 412297, Col 39)
jAz
// @from(Ln 412297, Col 44)
xZ1 = function(q, K, Y) {
    let z = _Az(q, K, Y),
        w = z.opts ? z.opts.type : void 0,
        H = JAz(w);
    return XAz(H.render, q, z)
}
// @from(Ln 412303, Col 4)
IbA = v(() => {
    wAz = QxA(), hbA = _bA(), g7$ = G5q(), HAz = f5q(), $Az = E5q(), OAz = R5q();
    DAz = hbA.create, jAz = h5q().toCanvas
})
// @from(Ln 412307, Col 4)
I5q = {}
// @from(Ln 412312, Col 0)
function MAz(A) {
    let q = e(35),
        {
            onDone: K
        } = A,
        [Y, z] = dp1.useState("ios"),
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = {
        ios: "",
        android: ""
    }, q[0] = w;
    else w = q[0];
    let [H, $] = dp1.useState(w), {
        url: O
    } = xbA[Y], _ = H[Y], J, X;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) J = () => {
        (async function() {
            let [s, O1] = await Promise.all([xZ1(xbA.ios.url, {
                type: "utf8",
                errorCorrectionLevel: "L"
            }), xZ1(xbA.android.url, {
                type: "utf8",
                errorCorrectionLevel: "L"
            })]);
            $({
                ios: s,
                android: O1
            })
        })().catch(ZAz)
    }, X = [], q[1] = J, q[2] = X;
    else J = q[1], X = q[2];
    dp1.useEffect(J, X);
    let D;
    if (q[3] !== K) D = () => {
        K()
    }, q[3] = K, q[4] = D;
    else D = q[4];
    let j = D,
        M;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) M = {
        context: "Confirmation"
    }, q[5] = M;
    else M = q[5];
    DA("confirm:no", j, M);
    let P;
    if (q[6] !== K) P = (l, r) => {
        if (l === "q" || r.ctrl && l === "c") {
            K();
            return
        }
        if (r.tab || r.leftArrow || r.rightArrow) z(GAz)
    }, q[6] = K, q[7] = P;
    else P = q[7];
    D8(P);
    let W, G, f, Z;
    if (q[8] !== _) {
        let l = _.split(`
`).filter(WAz);
        W = I, G = "column", f = 2, Z = l.map(PAz), q[8] = _, q[9] = W, q[10] = G, q[11] = f, q[12] = Z
    } else W = q[9], G = q[10], f = q[11], Z = q[12];
    let N = Y === "ios",
        T = Y === "ios",
        k;
    if (q[13] !== N || q[14] !== T) k = QJ.createElement(V, {
        bold: N,
        underline: T
    }, "iOS"), q[13] = N, q[14] = T, q[15] = k;
    else k = q[15];
    let y;
    if (q[16] === Symbol.for("react.memo_cache_sentinel")) y = QJ.createElement(V, {
        dimColor: !0
    }, " / "), q[16] = y;
    else y = q[16];
    let B = Y === "android",
        S = Y === "android",
        m;
    if (q[17] !== B || q[18] !== S) m = QJ.createElement(V, {
        bold: B,
        underline: S
    }, "Android"), q[17] = B, q[18] = S, q[19] = m;
    else m = q[19];
    let b;
    if (q[20] !== k || q[21] !== m) b = QJ.createElement(V, null, k, y, m), q[20] = k, q[21] = m, q[22] = b;
    else b = q[22];
    let g;
    if (q[23] === Symbol.for("react.memo_cache_sentinel")) g = QJ.createElement(V, {
        dimColor: !0
    }, "(tab to switch, esc to close)"), q[23] = g;
    else g = q[23];
    let U;
    if (q[24] !== b) U = QJ.createElement(I, {
        flexDirection: "row",
        gap: 2,
        marginBottom: 1
    }, b, g), q[24] = b, q[25] = U;
    else U = q[25];
    let x;
    if (q[26] !== O) x = QJ.createElement(V, {
        dimColor: !0
    }, O), q[26] = O, q[27] = x;
    else x = q[27];
    let p;
    if (q[28] !== W || q[29] !== U || q[30] !== x || q[31] !== G || q[32] !== f || q[33] !== Z) p = QJ.createElement(W, {
        flexDirection: G,
        paddingX: f
    }, Z, U, x), q[28] = W, q[29] = U, q[30] = x, q[31] = G, q[32] = f, q[33] = Z, q[34] = p;
    else p = q[34];
    return p
}
// @from(Ln 412422, Col 0)
function PAz(A, q) {
    return QJ.createElement(V, {
        key: q
    }, A)
}
// @from(Ln 412428, Col 0)
function WAz(A) {
    return A.length > 0
}
// @from(Ln 412432, Col 0)
function GAz(A) {
    return A === "ios" ? "android" : "ios"
}
// @from(Ln 412436, Col 0)
function ZAz() {}
// @from(Ln 412437, Col 0)
async function fAz(A) {
    return QJ.createElement(MAz, {
        onDone: A
    })
}
// @from(Ln 412442, Col 4)
QJ
// @from(Ln 412442, Col 8)
dp1
// @from(Ln 412442, Col 13)
xbA
// @from(Ln 412443, Col 4)
x5q = v(() => {
    i1();
    m1();
    K7();
    IbA();
    QJ = o(X1(), 1), dp1 = o(X1(), 1), xbA = {
        ios: {
            url: "https://apps.apple.com/app/claude-by-anthropic/id6473753684"
        },
        android: {
            url: "https://play.google.com/store/apps/details?id=com.anthropic.claude"
        }
    }
})
// @from(Ln 412457, Col 4)
VAz
// @from(Ln 412457, Col 9)
bbA
// @from(Ln 412458, Col 4)
b5q = v(() => {
    VAz = {
        type: "local-jsx",
        name: "mobile",
        aliases: ["ios", "android"],
        description: "Show QR code to download the Claude mobile app",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (x5q(), I5q)),
        userFacingName() {
            return "mobile"
        }
    }, bbA = VAz
})
// @from(Ln 412472, Col 4)
u5q = () => {}
// @from(Ln 412473, Col 4)
B5q = () => {}
// @from(Ln 412475, Col 0)
function bZ1({
    name: A,
    description: q,
    progressMessage: K,
    pluginName: Y,
    pluginCommand: z,
    getPromptWhileMarketplaceIsPrivate: w
}) {
    return {
        type: "prompt",
        name: A,
        description: q,
        progressMessage: K,
        contentLength: 0,
        isEnabled: () => !0,
        isHidden: !1,
        userFacingName() {
            return A
        },
        source: "builtin",
        async getPromptForCommand(H, $) {
            return w(H, $)
        }
    }
}
// @from(Ln 412500, Col 4)
m5q
// @from(Ln 412501, Col 4)
F5q = v(() => {
    v3();
    m5q = bZ1({
        name: "pr-comments",
        description: "Get comments from a GitHub pull request",
        progressMessage: "fetching PR comments",
        pluginName: "pr-comments",
        pluginCommand: "pr-comments",
        async getPromptWhileMarketplaceIsPrivate(A) {
            return u8("pr-comments"), [{
                type: "text",
                text: `You are an AI assistant integrated into a git-based version control system. Your task is to fetch and display comments from a GitHub pull request.

Follow these steps:

1. Use \`gh pr view --json number,headRepository\` to get the PR number and repository info
2. Use \`gh api /repos/{owner}/{repo}/issues/{number}/comments\` to get PR-level comments
3. Use \`gh api /repos/{owner}/{repo}/pulls/{number}/comments\` to get review comments. Pay particular attention to the following fields: \`body\`, \`diff_hunk\`, \`path\`, \`line\`, etc. If the comment references some code, consider fetching it using eg \`gh api /repos/{owner}/{repo}/contents/{path}?ref={branch} | jq .content -r | base64 -d\`
4. Parse and format all comments in a readable way
5. Return ONLY the formatted comments, with no additional text

Format the comments as:

## Comments

[For each comment thread:]
- @author file.ts#line:
  \`\`\`diff
  [diff_hunk from the API response]
  \`\`\`
  > quoted comment text

  [any replies indented]

If there are no comments, return "No comments found."

Remember:
1. Only show the actual comments, no explanatory text
2. Include both PR-level and code review comments
3. Preserve the threading/nesting of comment replies
4. Show the file and line number context for code review comments
5. Use jq to parse the JSON responses from the GitHub API

${A?"Additional user input: "+A:""}
`
            }]
        }
    })
})
// @from(Ln 412562, Col 0)
function ubA() {
    return NAz(O8(), "cache", "changelog.md")
}
// @from(Ln 412565, Col 0)
async function d5q() {
    let A = f6();
    if (!A.cachedChangelog) return;
    let q = ubA();
    try {
        await U5q(Q5q(q), {
            recursive: !0
        }), await g5q(q, A.cachedChangelog, {
            encoding: "utf-8",
            flag: "wx"
        })
    } catch {}
    jA(({
        cachedChangelog: K,
        ...Y
    }) => Y)
}
// @from(Ln 412582, Col 0)
async function BbA() {
    if (w4()) return;
    if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
    let A = await sA.get(EAz);
    if (A.status === 200) {
        let q = A.data,
            K = ubA();
        await U5q(Q5q(K), {
            recursive: !0
        }), await g5q(K, q, {
            encoding: "utf-8"
        });
        let Y = Date.now();
        jA((z) => ({
            ...z,
            changelogLastFetched: Y
        }))
    }
}
// @from(Ln 412602, Col 0)
function F91() {
    let A = ubA();
    try {
        return TAz(A, "utf-8")
    } catch {
        return ""
    }
}
// @from(Ln 412611, Col 0)
function YN6(A) {
    try {
        if (!A) return {};
        let q = {},
            K = A.split(/^## /gm).slice(1);
        for (let Y of K) {
            let z = Y.trim().split(`
`);
            if (z.length === 0) continue;
            let w = z[0];
            if (!w) continue;
            let H = w.split(" - ")[0]?.trim() || "";
            if (!H) continue;
            let $ = z.slice(1).filter((O) => O.trim().startsWith("- ")).map((O) => O.trim().substring(2).trim()).filter(Boolean);
            if ($.length > 0) q[H] = $
        }
        return q
    } catch (q) {
        return K1(q instanceof Error ? q : Error("Failed to parse changelog")), {}
    }
}
// @from(Ln 412633, Col 0)
function kAz(A, q, K = F91()) {
    try {
        let Y = YN6(K),
            z = ve.coerce(A),
            w = q ? ve.coerce(q) : null;
        if (!w || z && ve.gt(z, w, {
                loose: !0
            })) return Object.entries(Y).filter(([H]) => !w || ve.gt(H, w, {
            loose: !0
        })).sort(([H], [$]) => ve.gt(H, $, {
            loose: !0
        }) ? -1 : 1).flatMap(([H, $]) => $).filter(Boolean).slice(0, vAz)
    } catch (Y) {
        return K1(Y instanceof Error ? Y : Error("Failed to get release notes")), []
    }
    return []
}
// @from(Ln 412651, Col 0)
function mbA(A = F91()) {
    try {
        let q = YN6(A);
        return Object.keys(q).sort((Y, z) => ve.gt(Y, z, {
            loose: !0
        }) ? 1 : -1).map((Y) => {
            let z = q[Y];
            if (!z || z.length === 0) return null;
            let w = z.filter(Boolean);
            if (w.length === 0) return null;
            return [Y, w]
        }).filter((Y) => Y !== null)
    } catch (q) {
        return K1(q instanceof Error ? q : Error("Failed to get release notes")), []
    }
}
// @from(Ln 412668, Col 0)
function zN6(A, q = {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.38",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-02-10T00:04:56Z"
}.VERSION) {
    if (A !== q || !F91()) BbA().catch((z) => K1(z instanceof Error ? z : Error("Failed to fetch changelog")));
    let K = kAz(q, A);
    return {
        hasReleaseNotes: K.length > 0,
        releaseNotes: K
    }
}
// @from(Ln 412683, Col 4)
ve
// @from(Ln 412683, Col 8)
vAz = 5
// @from(Ln 412684, Col 4)
p5q = "https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md"
// @from(Ln 412685, Col 4)
EAz = "https://raw.githubusercontent.com/anthropics/claude-code/refs/heads/main/CHANGELOG.md"
// @from(Ln 412686, Col 4)
uZ1 = v(() => {
    y6();
    y5();
    cA();
    B6();
    hA();
    ve = o(GS(), 1)
})
// @from(Ln 412694, Col 4)
l5q = {}
// @from(Ln 412699, Col 0)
function c5q(A) {
    return A.map(([q, K]) => {
        let Y = `Version ${q}:`,
            z = K.map((w) => `• ${w}`).join(`
`);
        return `${Y}
${z}`
    }).join(`

`)
}
// @from(Ln 412710, Col 0)
async function LAz() {
    let A = [];
    try {
        let K = new Promise((Y, z) => {
            setTimeout(() => z(Error("Timeout")), 500)
        });
        await Promise.race([BbA(), K]), A = mbA(F91())
    } catch {}
    if (A.length > 0) return {
        type: "text",
        value: c5q(A)
    };
    let q = mbA();
    if (q.length > 0) return {
        type: "text",
        value: c5q(q)
    };
    return {
        type: "text",
        value: `See the full changelog at: ${p5q}`
    }
}
// @from(Ln 412732, Col 4)
i5q = v(() => {
    uZ1()
})
// @from(Ln 412735, Col 4)
RAz
// @from(Ln 412735, Col 9)
n5q
// @from(Ln 412736, Col 4)
r5q = v(() => {
    RAz = {
        description: "View release notes",
        isEnabled: () => !0,
        isHidden: !1,
        name: "release-notes",
        userFacingName() {
            return "release-notes"
        },
        type: "local",
        supportsNonInteractive: !0,
        load: () => Promise.resolve().then(() => (i5q(), l5q))
    }, n5q = RAz
})
// @from(Ln 412750, Col 4)
o5q = {}
// @from(Ln 412754, Col 0)
async function yAz(A, q) {
    if (l8() && Dz()) return {
        type: "text",
        value: "Cannot rename: This session is a swarm teammate. Teammate names are set by the team leader."
    };
    if (!A || A.trim() === "") return {
        type: "text",
        value: "Please provide a name for the session. Usage: /rename <name>"
    };
    let K = U6(),
        Y = dO(),
        z = A.trim();
    if (await Q91(K, z, Y), l4().terminalTitleFromRename) nL7(z);
    if (l8()) return await FbA(K, z, Y), q.setAppState((w) => ({
        ...w,
        standaloneAgentContext: {
            ...w.standaloneAgentContext,
            name: z
        }
    })), {
        type: "text",
        value: `Session and agent renamed to: ${z}`
    };
    return {
        type: "text",
        value: `Session renamed to: ${z}`
    }
}
// @from(Ln 412782, Col 4)
a5q = v(() => {
    lq();
    B6();
    S9();
    Cz();
    w01();
    p8()
})
// @from(Ln 412790, Col 4)
CAz
// @from(Ln 412790, Col 9)
s5q
// @from(Ln 412791, Col 4)
t5q = v(() => {
    CAz = {
        type: "local",
        name: "rename",
        description: "Rename the current conversation",
        isEnabled: () => !0,
        isHidden: !1,
        supportsNonInteractive: !1,
        argumentHint: "<name>",
        load: () => Promise.resolve().then(() => (a5q(), o5q)),
        userFacingName() {
            return "rename"
        }
    }, s5q = CAz
})
// @from(Ln 412807, Col 0)
function e5q(A) {
    let q = e(47),
        {
            nodes: K,
            onSelect: Y,
            onCancel: z,
            onFocus: w,
            focusNodeId: H,
            visibleOptionCount: $,
            layout: O,
            isDisabled: _,
            hideIndexes: J,
            isNodeExpanded: X,
            onExpand: D,
            onCollapse: j,
            getParentPrefix: M,
            getChildPrefix: P,
            onUpFromFirstItem: W
        } = A,
        G = O === void 0 ? "expanded" : O,
        f = _ === void 0 ? !1 : _,
        Z = J === void 0 ? !1 : J,
        N;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) N = new Set, q[0] = N;
    else N = q[0];
    let [T, k] = cp1.default.useState(N), y = cp1.default.useRef(!1), B = cp1.default.useRef(null), S;
    if (q[1] !== T || q[2] !== X) S = ($1) => {
        if (X) return X($1);
        return T.has($1)
    }, q[1] = T, q[2] = X, q[3] = S;
    else S = q[3];
    let m = S,
        b;
    if (q[4] !== m || q[5] !== K) {
        let $1 = function(G1, L1, x1) {
            let f1 = !!G1.children && G1.children.length > 0,
                R1 = m(G1.id);
            if (b.push({
                    node: G1,
                    depth: L1,
                    isExpanded: R1,
                    hasChildren: f1,
                    parentId: x1
                }), f1 && R1 && G1.children)
                for (let H1 of G1.children) $1(H1, L1 + 1, G1.id)
        };
        b = [];
        for (let G1 of K) $1(G1, 0);
        q[4] = m, q[5] = K, q[6] = b
    } else b = q[6];
    let g = b,
        U = hAz,
        x = SAz,
        p = M ?? U,
        l = P ?? x,
        r;
    if (q[7] !== l || q[8] !== p) r = ($1) => {
        let G1 = "";
        if ($1.hasChildren) G1 = p($1.isExpanded);
        else if ($1.depth > 0) G1 = l($1.depth);
        return G1 + $1.node.label
    }, q[7] = l, q[8] = p, q[9] = r;
    else r = q[9];
    let s = r,
        O1;
    if (q[10] !== s || q[11] !== g) O1 = g.map(($1) => ({
        label: s($1),
        description: $1.node.description,
        dimDescription: $1.node.dimDescription ?? !0,
        value: $1.node.id
    })), q[10] = s, q[11] = g, q[12] = O1;
    else O1 = q[12];
    let T1 = O1,
        N1;
    if (q[13] !== g) N1 = new Map, g.forEach(($1) => N1.set($1.node.id, $1.node)), q[13] = g, q[14] = N1;
    else N1 = q[14];
    let j1 = N1,
        q1;
    if (q[15] !== g) q1 = ($1) => g.find((G1) => G1.node.id === $1), q[15] = g, q[16] = q1;
    else q1 = q[16];
    let t = q1,
        J1;
    if (q[17] !== t || q[18] !== j || q[19] !== D) J1 = ($1, G1) => {
        let L1 = t($1);
        if (!L1 || !L1.hasChildren) return;
        if (G1)
            if (D) D($1);
            else k((x1) => new Set([...x1, $1]));
        else if (j) j($1);
        else k((x1) => {
            let f1 = new Set(x1);
            return f1.delete($1), f1
        })
    }, q[17] = t, q[18] = j, q[19] = D, q[20] = J1;
    else J1 = q[20];
    let D1 = J1,
        Z1;
    if (q[21] !== t || q[22] !== H || q[23] !== f || q[24] !== j1 || q[25] !== w || q[26] !== D1) Z1 = ($1, G1) => {
        if (!H || f) return;
        let L1 = t(H);
        if (!L1) return;
        if (G1.rightArrow && L1.hasChildren) D1(H, !0);
        else if (G1.leftArrow) {
            if (L1.hasChildren && L1.isExpanded) D1(H, !1);
            else if (L1.parentId !== void 0) {
                if (y.current = !0, D1(L1.parentId, !1), w) {
                    let x1 = j1.get(L1.parentId);
                    if (x1) w(x1)
                }
            }
        }
    }, q[21] = t, q[22] = H, q[23] = f, q[24] = j1, q[25] = w, q[26] = D1, q[27] = Z1;
    else Z1 = q[27];
    let E1 = !f,
        a;
    if (q[28] !== E1) a = {
        isActive: E1
    }, q[28] = E1, q[29] = a;
    else a = q[29];
    D8(Z1, a);
    let A1;
    if (q[30] !== j1 || q[31] !== Y) A1 = ($1) => {
        let G1 = j1.get($1);
        if (!G1) return;
        Y(G1)
    }, q[30] = j1, q[31] = Y, q[32] = A1;
    else A1 = q[32];
    let M1 = A1,
        z1;
    if (q[33] !== j1 || q[34] !== w) z1 = ($1) => {
        if (y.current) {
            y.current = !1;
            return
        }
        if (B.current === $1) return;
        if (B.current = $1, w) {
            let G1 = j1.get($1);
            if (G1) w(G1)
        }
    }, q[33] = j1, q[34] = w, q[35] = z1;
    else z1 = q[35];
    let Y1 = z1,
        _1;
    if (q[36] !== H || q[37] !== M1 || q[38] !== Y1 || q[39] !== Z || q[40] !== f || q[41] !== G || q[42] !== z || q[43] !== W || q[44] !== T1 || q[45] !== $) _1 = cp1.default.createElement(kA, {
        options: T1,
        onChange: M1,
        onFocus: Y1,
        onCancel: z,
        defaultFocusValue: H,
        visibleOptionCount: $,
        layout: G,
        isDisabled: f,
        hideIndexes: Z,
        onUpFromFirstItem: W
    }), q[36] = H, q[37] = M1, q[38] = Y1, q[39] = Z, q[40] = f, q[41] = G, q[42] = z, q[43] = W, q[44] = T1, q[45] = $, q[46] = _1;
    else _1 = q[46];
    return _1
}
// @from(Ln 412966, Col 0)
function SAz(A) {
    return "  ▸ "
}
// @from(Ln 412970, Col 0)
function hAz(A) {
    return A ? "▼ " : "▶ "
}
// @from(Ln 412973, Col 4)
cp1
// @from(Ln 412974, Col 4)
A9q = v(() => {
    i1();
    U5();
    m1();
    cp1 = o(X1(), 1)
})
// @from(Ln 412983, Col 0)
async function jc(A) {
    let q = Date.now(),
        {
            stdout: K,
            code: Y
        } = await d4(pq(), ["worktree", "list", "--porcelain"], {
            cwd: A,
            preserveOutputOnError: !1
        }),
        z = Date.now() - q;
    if (Y !== 0) return c("tengu_worktree_detection", {
        duration_ms: z,
        worktree_count: 0,
        success: !1
    }), [];
    let w = K.split(`
`).filter((O) => O.startsWith("worktree ")).map((O) => O.slice(9).normalize("NFC"));
    c("tengu_worktree_detection", {
        duration_ms: z,
        worktree_count: w.length,
        success: !0
    });
    let H = w.find((O) => A === O || A.startsWith(O + IAz)),
        $ = w.filter((O) => O !== H).sort((O, _) => O.localeCompare(_));
    return H ? [H, ...$] : $
}
// @from(Ln 413009, Col 4)
lp1 = v(() => {
    tq();
    u6();
    h9()
})
// @from(Ln 413015, Col 0)
function QbA(A) {
    if (A.type === "assistant" && A.message.content[0]?.type === "tool_use") {
        let q = A.message.content[0];
        return {
            messageId: A.message.id,
            toolUseId: q.id,
            toolName: q.name
        }
    }
    return null
}
// @from(Ln 413027, Col 0)
function q9q(A, q, K = !1) {
    if (K) return {
        messages: A
    };
    let Y = new Set(q.filter((J) => J.renderGroupedToolUse).map((J) => J.name)),
        z = new Map;
    for (let J of A) {
        let X = QbA(J);
        if (X && Y.has(X.toolName)) {
            let D = `${X.messageId}:${X.toolName}`,
                j = z.get(D) ?? [];
            j.push(J), z.set(D, j)
        }
    }
    let w = new Map,
        H = new Set;
    for (let [J, X] of z)
        if (X.length >= 2) {
            w.set(J, X);
            for (let D of X) {
                let j = QbA(D);
                if (j) H.add(j.toolUseId)
            }
        } let $ = new Map;
    for (let J of A)
        if (J.type === "user") {
            for (let X of J.message.content)
                if (X.type === "tool_result" && H.has(X.tool_use_id)) $.set(X.tool_use_id, J)
        } let O = [],
        _ = new Set;
    for (let J of A) {
        let X = QbA(J);
        if (X) {
            let D = `${X.messageId}:${X.toolName}`,
                j = w.get(D);
            if (j) {
                if (!_.has(D)) {
                    _.add(D);
                    let M = j[0],
                        P = [];
                    for (let G of j) {
                        let f = G.message.content[0].id,
                            Z = $.get(f);
                        if (Z) P.push(Z)
                    }
                    let W = {
                        type: "grouped_tool_use",
                        toolName: X.toolName,
                        messages: j,
                        results: P,
                        displayMessage: M,
                        uuid: `grouped-${M.uuid}`,
                        timestamp: M.timestamp,
                        messageId: X.messageId
                    };
                    O.push(W)
                }
                continue
            }
        }
        if (J.type === "user") {
            let D = J.message.content.filter((j) => j.type === "tool_result");
            if (D.length > 0) {
                if (D.every((M) => H.has(M.tool_use_id))) continue
            }
        }
        O.push(J)
    }
    return {
        messages: O
    }
}
// @from(Ln 413100, Col 0)
function K9q(A) {
    return A.type === "attachment" && A.attachment.type === "task_status" && A.attachment.taskType === "in_process_teammate" && A.attachment.status === "completed"
}
// @from(Ln 413104, Col 0)
function Y9q(A) {
    let q = [],
        K = 0;
    while (K < A.length) {
        let Y = A[K];
        if (K9q(Y)) {
            let z = 0;
            while (K < A.length && K9q(A[K])) z++, K++;
            if (z === 1) q.push(Y);
            else q.push({
                type: "attachment",
                uuid: Y.uuid,
                timestamp: Y.timestamp,
                attachment: {
                    type: "teammate_shutdown_batch",
                    count: z
                }
            })
        } else q.push(Y), K++
    }
    return q
}
// @from(Ln 413130, Col 0)
function z9q(A) {
    return dAz.filter((q) => q.isActive(A))
}
// @from(Ln 413133, Col 4)
g7
// @from(Ln 413133, Col 8)
bAz
// @from(Ln 413133, Col 13)
uAz
// @from(Ln 413133, Col 18)
BAz
// @from(Ln 413133, Col 23)
mAz
// @from(Ln 413133, Col 28)
FAz
// @from(Ln 413133, Col 33)
QAz
// @from(Ln 413133, Col 38)
gAz
// @from(Ln 413133, Col 43)
UAz
// @from(Ln 413133, Col 48)
pAz
// @from(Ln 413133, Col 53)
dAz
// @from(Ln 413134, Col 4)
w9q = v(() => {
    m1();
    dD();
    b7();
    N7();
    vq();
    J7();
    UH();
    e7();
    KxA();
    q$();
    YXA();
    g7 = o(X1(), 1), bAz = {
        id: "large-memory-files",
        type: "warning",
        isActive: () => {
            return DK1().length > 0
        },
        render: () => {
            let A = DK1();
            return g7.createElement(g7.Fragment, null, A.map((q) => {
                let K = q.path.startsWith(h6()) ? xAz(h6(), q.path) : q.path;
                return g7.createElement(I, {
                    key: q.path,
                    flexDirection: "row"
                }, g7.createElement(V, {
                    color: "warning"
                }, l1.warning), g7.createElement(V, {
                    color: "warning"
                }, "Large ", g7.createElement(V, {
                    bold: !0
                }, K), " will impact performance (", Y3(q.content.length), " chars >", " ", Y3(Cp), ")", g7.createElement(V, {
                    dimColor: !0
                }, " • /memory to edit")))
            }))
        }
    }, uAz = {
        id: "ultra-claude-md",
        type: "warning",
        isActive: () => {
            let A = jK1();
            return A !== null && A.content.length > Cj1
        },
        render: () => {
            let A = jK1();
            if (!A) return null;
            let q = A.content.length;
            return g7.createElement(I, {
                flexDirection: "row",
                gap: 1
            }, g7.createElement(V, {
                color: "warning"
            }, l1.warning), g7.createElement(V, {
                color: "warning"
            }, "CLAUDE.md entries marked as IMPORTANT exceed", " ", Cj1, " chars (", q, " chars)", g7.createElement(V, {
                dimColor: !0
            }, " • /memory to edit")))
        }
    }, BAz = {
        id: "claude-ai-external-token",
        type: "warning",
        isActive: () => {
            let A = Cn();
            return i8() && (A.source === "ANTHROPIC_AUTH_TOKEN" || A.source === "apiKeyHelper")
        },
        render: () => {
            let A = Cn();
            return g7.createElement(I, {
                flexDirection: "row",
                marginTop: 1
            }, g7.createElement(V, {
                color: "warning"
            }, l1.warning), g7.createElement(V, {
                color: "warning"
            }, "Auth conflict: Using ", A.source, " instead of Claude account subscription token. Either unset ", A.source, ", or run `claude /logout`."))
        }
    }, mAz = {
        id: "api-key-conflict",
        type: "warning",
        isActive: () => {
            let {
                source: A
            } = yO({
                skipRetrievingKeyFromApiKeyHelper: !0
            });
            return !!XR1() && (A === "ANTHROPIC_API_KEY" || A === "apiKeyHelper")
        },
        render: () => {
            let {
                source: A
            } = yO({
                skipRetrievingKeyFromApiKeyHelper: !0
            });
            return g7.createElement(I, {
                flexDirection: "row",
                marginTop: 1
            }, g7.createElement(V, {
                color: "warning"
            }, l1.warning), g7.createElement(V, {
                color: "warning"
            }, "Auth conflict: Using ", A, " instead of Anthropic Console key. Either unset ", A, ", or run `claude /logout`."))
        }
    }, FAz = {
        id: "both-auth-methods",
        type: "warning",
        isActive: () => {
            let {
                source: A
            } = yO({
                skipRetrievingKeyFromApiKeyHelper: !0
            }), q = Cn();
            return A !== "none" && q.source !== "none" && !(A === "apiKeyHelper" && q.source === "apiKeyHelper")
        },
        render: () => {
            let {
                source: A
            } = yO({
                skipRetrievingKeyFromApiKeyHelper: !0
            }), q = Cn();
            return g7.createElement(I, {
                flexDirection: "column",
                marginTop: 1
            }, g7.createElement(I, {
                flexDirection: "row"
            }, g7.createElement(V, {
                color: "warning"
            }, l1.warning), g7.createElement(V, {
                color: "warning"
            }, "Auth conflict: Both a token (", q.source, ") and an API key (", A, ") are set. This may lead to unexpected behavior.")), g7.createElement(I, {
                flexDirection: "column",
                marginLeft: 3
            }, g7.createElement(V, {
                color: "warning"
            }, "• Trying to use", " ", q.source === "claude.ai" ? "claude.ai" : q.source, "?", " ", A === "ANTHROPIC_API_KEY" ? 'Unset the ANTHROPIC_API_KEY environment variable, or claude /logout then say "No" to the API key approval before login.' : A === "apiKeyHelper" ? "Unset the apiKeyHelper setting." : "claude /logout"), g7.createElement(V, {
                color: "warning"
            }, "• Trying to use ", A, "?", " ", q.source === "claude.ai" ? "claude /logout to sign out of claude.ai." : `Unset the ${q.source} environment variable.`)))
        }
    }, QAz = {
        id: "sonnet-1m-welcome",
        type: "info",
        isActive: (A) => A.showSonnet1MNotice === !0,
        render: () => {
            return g7.createElement(I, {
                flexDirection: "column",
                marginTop: 1
            }, g7.createElement(V, {
                bold: !0
            }, "You now have access to Sonnet 4.5 with 1M context (uses more rate limits than Sonnet on long requests) • Update in /model"))
        }
    }, gAz = {
        id: "opus-4.6-available",
        type: "info",
        isActive: (A) => A.showOpus46Notice === !0,
        render: () => {
            let q = E4() !== "firstParty",
                K = dK(),
                Y = K === "max",
                z = K === "team",
                w = K === "pro",
                H = l3().toLowerCase().includes("opus-4-6"),
                $;
            if (Y || z || w || H) $ = g7.createElement(V, {
                dimColor: !0
            }, "Welcome to Opus 4.6");
            else if (q) $ = g7.createElement(V, {
                dimColor: !0
            }, "/model to try Opus 4.6. Note: you may need to request access from your cloud provider");
            else $ = g7.createElement(V, {
                dimColor: !0
            }, "/model to try Opus 4.6");
            return g7.createElement(I, {
                marginLeft: 1
            }, $)
        }
    }, UAz = {
        id: "large-agent-descriptions",
        type: "warning",
        isActive: (A) => {
            return Tp1(A.agentDefinitions) > T91
        },
        render: (A) => {
            let q = Tp1(A.agentDefinitions);
            return g7.createElement(I, {
                flexDirection: "row"
            }, g7.createElement(V, {
                color: "warning"
            }, l1.warning), g7.createElement(V, {
                color: "warning"
            }, "Large cumulative agent descriptions will impact performance (~", Y3(q), " tokens >", " ", Y3(T91), ")", g7.createElement(V, {
                dimColor: !0
            }, " • /agents to manage")))
        }
    }, pAz = {
        id: "jetbrains-plugin-install",
        type: "info",
        isActive: (A) => {
            if (!gb1()) return !1;
            if (!(A.config.autoInstallIdeExtension ?? !0)) return !1;
            let K = Q01();
            return K !== null && !fx7(K)
        },
        render: () => {
            let A = Q01(),
                q = S_(A);
            return g7.createElement(I, {
                flexDirection: "row",
                gap: 1,
                marginLeft: 1
            }, g7.createElement(V, {
                color: "ide"
            }, l1.arrowUp), g7.createElement(V, null, "Install the ", g7.createElement(V, {
                color: "ide"
            }, q), " plugin from the JetBrains Marketplace:", " ", g7.createElement(V, {
                bold: !0
            }, "https://docs.claude.com/s/claude-code-jetbrains")))
        }
    }, dAz = [bAz, uAz, UAz, BAz, mAz, FAz, QAz, gAz, pAz]
})
// @from(Ln 413353, Col 0)
function H9q(A) {
    let q = e(3),
        {
            agentDefinitions: K
        } = A === void 0 ? {} : A,
        Y = f6(),
        z = u3()?.organizationUuid,
        H = (z ? Y.s1mAccessCache?.[z] : void 0)?.hasAccessNotAsDefault,
        $ = z && Y.hasShownS1MWelcomeV2?.[z],
        O = i8() && H && !$,
        J = !(z && Y.hasShownOpus46Notice?.[z]),
        X = {
            config: Y,
            showSonnet1MNotice: O,
            showOpus46Notice: J,
            agentDefinitions: K
        },
        D = z9q(X);
    if (Mc.useEffect(() => {
            if (!z) return;
            let f = D.some(lAz),
                Z = D.some(cAz);
            if (f) c("tengu_sonnet_1m_notice_shown", {});
            if (Z) c("tengu_opus_46_notice_shown", {});
            if (f || Z) jA((N) => ({
                ...N,
                ...f && {
                    hasShownS1MWelcomeV2: {
                        ...N.hasShownS1MWelcomeV2,
                        [z]: !0
                    }
                },
                ...Z && {
                    hasShownOpus46Notice: {
                        ...N.hasShownOpus46Notice,
                        [z]: !0
                    }
                }
            }))
        }, [D, Y, z]), D.length === 0) return null;
    let j = I,
        M = "column",
        P = 1,
        W = D.map((f) => Mc.createElement(Mc.Fragment, {
            key: f.id
        }, f.render(X))),
        G;
    if (q[0] !== j || q[1] !== W) G = Mc.createElement(j, {
        flexDirection: M,
        paddingLeft: P
    }, W), q[0] = j, q[1] = W, q[2] = G;
    else G = q[2];
    return G
}
// @from(Ln 413408, Col 0)
function cAz(A) {
    return A.id === "opus-4.6-available"
}
// @from(Ln 413412, Col 0)
function lAz(A) {
    return A.id === "sonnet-1m-welcome"
}
// @from(Ln 413415, Col 4)
Mc
// @from(Ln 413416, Col 4)
$9q = v(() => {
    i1();
    m1();
    cA();
    w9q();
    u6();
    J7();
    Mc = o(X1(), 1)
})
// @from(Ln 413426, Col 0)
function O9q(A, q) {
    for (let K of A)
        if (!q.has(K)) return !1;
    return !0
}
// @from(Ln 413432, Col 0)
function _9q(A, q = !1) {
    let [K, Y] = BZ1.useState(1), [z, w] = BZ1.useState(-1);
    return D8((H, $) => {
        if ($.escape && z === -1 && !q) w(0)
    }, {
        isActive: A
    }), BZ1.useEffect(() => {
        if (!A) {
            w(-1), Y(0);
            return
        }
    }, [A]), BZ1.useEffect(() => {
        if (z === -1) return;
        let H = [1, 0, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 1];
        if (z >= H.length) {
            w(-1), Y(1);
            return
        }
        Y(H[z]);
        let $ = setTimeout(() => {
            w((O) => O + 1)
        }, 60);
        return () => clearTimeout($)
    }, [z]), K
}
// @from(Ln 413457, Col 4)
BZ1
// @from(Ln 413458, Col 4)
J9q = v(() => {
    m1();
    BZ1 = o(X1(), 1)
})
// @from(Ln 413463, Col 0)
function j9q(A) {
    if (A >= 70) return "horizontal";
    return "compact"
}
// @from(Ln 413468, Col 0)
function M9q(A, q, K) {
    if (q === "horizontal") {
        let z = K,
            w = gbA + HN6 + wN6 + z,
            H = A - w,
            $ = Math.max(30, H),
            O = Math.min(z + $ + wN6 + HN6, A - gbA);
        if (O < z + $ + wN6 + HN6) $ = O - z - wN6 - HN6;
        return {
            leftWidth: z,
            rightWidth: $,
            totalWidth: O
        }
    }
    let Y = Math.min(A - gbA, D9q + 20);
    return {
        leftWidth: Y,
        rightWidth: Y,
        totalWidth: Y
    }
}
// @from(Ln 413490, Col 0)
function P9q(A, q, K) {
    let Y = Math.max(UA(A), UA(q), UA(K), 20);
    return Math.min(Y + 4, D9q)
}
// @from(Ln 413495, Col 0)
function ON6(A) {
    if (!A || A.length > iAz) return "Welcome back!";
    return `Welcome back ${A}!`
}
// @from(Ln 413500, Col 0)
function np1(A, q) {
    if (UA(A) <= q) return A;
    let K = "/",
        Y = "…",
        z = 1,
        w = 1,
        H = A.split(K),
        $ = H[0] || "",
        O = H[H.length - 1] || "",
        _ = UA($),
        J = UA(O);
    if (H.length === 1) return K3(A, q);
    if ($ === "" && z + w + J >= q) return `${K}${K3(O,Math.max(1,q-w))}`;
    if ($ !== "" && z * 2 + w + J >= q) return `${Y}${K}${K3(O,Math.max(1,q-z-w))}`;
    if (H.length === 2) {
        let j = q - z - w - J;
        return `${B_1($,j)}${Y}${K}${O}`
    }
    let X = q - _ - J - z - 2 * w;
    if (X <= 0) {
        let j = Math.max(0, q - J - z - 2 * w);
        return `${B_1($,j)}${K}${Y}${K}${O}`
    }
    let D = [];
    for (let j = H.length - 2; j > 0; j--) {
        let M = H[j];
        if (M && UA(M) + w <= X) D.unshift(M), X -= UA(M) + w;
        else break
    }
    if (D.length === 0) return `${$}${K}${Y}${K}${O}`;
    return `${$}${K}${Y}${K}${D.join(K)}${K}${O}`
}
// @from(Ln 413532, Col 0)
async function W9q() {
    if ($N6) return $N6;
    let A = U6();
    return $N6 = XN6(10).then((q) => {
        return ip1 = q.filter((K) => {
            if (K.isSidechain) return !1;
            if (K.sessionId === A) return !1;
            if (K.summary?.includes("I apologize")) return !1;
            let Y = K.summary && K.summary !== "No prompt",
                z = K.firstPrompt && K.firstPrompt !== "No prompt";
            return Y || z
        }).slice(0, 3), ip1
    }).catch(() => {
        return ip1 = [], ip1
    }), $N6
}
// @from(Ln 413549, Col 0)
function G9q() {
    return ip1
}
// @from(Ln 413553, Col 0)
function _N6() {
    let A = process.env.DEMO_VERSION ?? {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION,
        q = WL6(),
        K = process.env.DEMO_VERSION ? "/code/claude" : L3(h6()),
        Y = q ? `${K} in ${q.replace(/^https?:\/\//,"")}` : K,
        z = l3(),
        w = l17(z),
        H = i8() ? S1A() : "API Usage Billing",
        $ = l4().agent;
    return {
        version: A,
        cwd: Y,
        modelDisplayName: w,
        billingType: H,
        agentName: $
    }
}
// @from(Ln 413578, Col 0)
function Z9q(A, q, K) {
    if (UA(A) + 3 + UA(q) > K) return {
        shouldSplit: !0,
        truncatedModel: DY(A, K),
        truncatedBilling: DY(q, K)
    };
    return {
        shouldSplit: !1,
        truncatedModel: DY(A, Math.max(K - UA(q) - 3, 10)),
        truncatedBilling: q
    }
}
// @from(Ln 413591, Col 0)
function f9q(A) {
    let q = F91();
    if (!q) return [];
    let K;
    try {
        K = YN6(q)
    } catch {
        return []
    }
    let Y = [],
        z = Object.keys(K).sort((w, H) => X9q.gt(w, H, {
            loose: !0
        }) ? -1 : 1).slice(0, 3);
    for (let w of z) {
        let H = K[w];
        if (H) Y.push(...H)
    }
    return Y.slice(0, A)
}
// @from(Ln 413610, Col 4)
X9q
// @from(Ln 413610, Col 9)
D9q = 50
// @from(Ln 413611, Col 4)
iAz = 20
// @from(Ln 413612, Col 4)
gbA = 4
// @from(Ln 413613, Col 4)
wN6 = 1
// @from(Ln 413614, Col 4)
HN6 = 2
// @from(Ln 413615, Col 4)
ip1
// @from(Ln 413615, Col 9)
$N6 = null
// @from(Ln 413616, Col 4)
JN6 = v(() => {
    uZ1();
    vq();
    lq();
    LY();
    B6();
    N7();
    wq();
    J7();
    e7();
    p8();
    X9q = o(GS(), 1);
    ip1 = []
})
// @from(Ln 413631, Col 0)
function UbA() {
    let A = e(3);
    if (xA.terminal === "Apple_Terminal") {
        let Y;
        if (A[0] === Symbol.for("react.memo_cache_sentinel")) Y = d9.createElement(nAz, null), A[0] = Y;
        else Y = A[0];
        return Y
    }
    let q;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) q = d9.createElement(V, null, d9.createElement(V, {
        color: "clawd_body"
    }, " ▐"), d9.createElement(V, {
        color: "clawd_body",
        backgroundColor: "clawd_background"
    }, "▛███▜"), d9.createElement(V, {
        color: "clawd_body"
    }, "▌")), A[1] = q;
    else q = A[1];
    let K;
    if (A[2] === Symbol.for("react.memo_cache_sentinel")) K = d9.createElement(I, {
        flexDirection: "column"
    }, q, d9.createElement(V, null, d9.createElement(V, {
        color: "clawd_body"
    }, "▝▜"), d9.createElement(V, {
        color: "clawd_body",
        backgroundColor: "clawd_background"
    }, "█████"), d9.createElement(V, {
        color: "clawd_body"
    }, "▛▘")), d9.createElement(V, {
        color: "clawd_body"
    }, "  ", "▘▘ ▝▝", "  ")), A[2] = K;
    else K = A[2];
    return K
}
// @from(Ln 413666, Col 0)
function nAz() {
    let A = e(2),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = d9.createElement(V, null, d9.createElement(V, {
        color: "clawd_body"
    }, "▗"), d9.createElement(V, {
        color: "clawd_background",
        backgroundColor: "clawd_body"
    }, " ", "▗", "   ", "▖", " "), d9.createElement(V, {
        color: "clawd_body"
    }, "▖")), A[0] = q;
    else q = A[0];
    let K;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) K = d9.createElement(I, {
        flexDirection: "column",
        alignItems: "center"
    }, q, d9.createElement(V, {
        backgroundColor: "clawd_body"
    }, " ".repeat(7)), d9.createElement(V, {
        color: "clawd_body"
    }, "▘▘ ▝▝")), A[1] = K;
    else K = A[1];
    return K
}
// @from(Ln 413690, Col 4)
d9
// @from(Ln 413691, Col 4)
V9q = v(() => {
    i1();
    m1();
    G5();
    d9 = o(X1(), 1)
})
// @from(Ln 413698, Col 0)
function N9q(A) {
    let {
        title: q,
        lines: K,
        footer: Y,
        emptyMessage: z,
        customContent: w
    } = A, H = UA(q);
    if (w !== void 0) H = Math.max(H, w.width);
    else if (K.length === 0 && z) H = Math.max(H, UA(z));
    else {
        let O = Math.max(0, ...K.map((_) => _.timestamp ? UA(_.timestamp) : 0));
        for (let _ of K) {
            let J = O > 0 ? O : 0,
                X = UA(_.text) + (J > 0 ? J + 2 : 0);
            H = Math.max(H, X)
        }
    }
    if (Y) H = Math.max(H, UA(Y));
    return H
}
// @from(Ln 413720, Col 0)
function T9q(A) {
    let q = e(15),
        {
            config: K,
            actualWidth: Y
        } = A,
        {
            title: z,
            lines: w,
            footer: H,
            emptyMessage: $,
            customContent: O
        } = K,
        _;
    if (q[0] !== w) _ = Math.max(0, ...w.map(rAz)), q[0] = w, q[1] = _;
    else _ = q[1];
    let J = _,
        X;
    if (q[2] !== z) X = O2.createElement(V, {
        bold: !0,
        color: "claude"
    }, z), q[2] = z, q[3] = X;
    else X = q[3];
    let D;
    if (q[4] !== Y || q[5] !== O || q[6] !== $ || q[7] !== H || q[8] !== w || q[9] !== J) D = O ? O2.createElement(O2.Fragment, null, O.content, H && O2.createElement(V, {
        dimColor: !0,
        italic: !0
    }, DY(H, Y))) : w.length === 0 && $ ? O2.createElement(V, {
        dimColor: !0
    }, DY($, Y)) : O2.createElement(O2.Fragment, null, w.map((M, P) => {
        let W = Math.max(10, Y - (J > 0 ? J + 2 : 0));
        return O2.createElement(V, {
            key: P
        }, J > 0 && O2.createElement(O2.Fragment, null, O2.createElement(V, {
            dimColor: !0
        }, (M.timestamp || "").padEnd(J)), "  "), O2.createElement(V, null, DY(M.text, W)))
    }), H && O2.createElement(V, {
        dimColor: !0,
        italic: !0
    }, DY(H, Y))), q[4] = Y, q[5] = O, q[6] = $, q[7] = H, q[8] = w, q[9] = J, q[10] = D;
    else D = q[10];
    let j;
    if (q[11] !== Y || q[12] !== X || q[13] !== D) j = O2.createElement(I, {
        flexDirection: "column",
        width: Y
    }, X, D), q[11] = Y, q[12] = X, q[13] = D, q[14] = j;
    else j = q[14];
    return j
}
// @from(Ln 413770, Col 0)
function rAz(A) {
    return A.timestamp ? A.timestamp.length : 0
}
// @from(Ln 413773, Col 4)
O2
// @from(Ln 413774, Col 4)
v9q = v(() => {
    i1();
    m1();
    vq();
    LY();
    O2 = o(X1(), 1)
})
// @from(Ln 413782, Col 0)
function E9q(A) {
    let q = e(10),
        {
            feeds: K,
            maxWidth: Y
        } = A,
        z;
    if (q[0] !== K) {
        let _ = K.map(oAz);
        z = Math.max(..._), q[0] = K, q[1] = z
    } else z = q[1];
    let H = Math.min(z, Y),
        $;
    if (q[2] !== H || q[3] !== K) {
        let _;
        if (q[5] !== H || q[6] !== K.length) _ = (J, X) => UI.createElement(UI.Fragment, {
            key: X
        }, UI.createElement(T9q, {
            config: J,
            actualWidth: H
        }), X < K.length - 1 && UI.createElement(CY, {
            dividerColor: "claude"
        })), q[5] = H, q[6] = K.length, q[7] = _;
        else _ = q[7];
        $ = K.map(_), q[2] = H, q[3] = K, q[4] = $
    } else $ = q[4];
    let O;
    if (q[8] !== $) O = UI.createElement(I, {
        flexDirection: "column"
    }, $), q[8] = $, q[9] = O;
    else O = q[9];
    return O
}
// @from(Ln 413816, Col 0)
function oAz(A) {
    return N9q(A)
}
// @from(Ln 413819, Col 4)
UI
// @from(Ln 413820, Col 4)
k9q = v(() => {
    i1();
    m1();
    v9q();
    kW();
    UI = o(X1(), 1)
})
// @from(Ln 413827, Col 0)
async function aAz(A = "claude_code_guest_pass") {
    let {
        accessToken: q,
        orgUUID: K
    } = await PN(), Y = {
        ...rX(q),
        "x-organization-uuid": K
    }, z = `${P4().BASE_API_URL}/api/oauth/organizations/${K}/referral/eligibility`;
    return (await sA.get(z, {
        headers: Y,
        params: {
            campaign: A
        },
        timeout: 5000
    })).data
}
// @from(Ln 413843, Col 0)
async function y9q(A = "claude_code_guest_pass") {
    let {
        accessToken: q,
        orgUUID: K
    } = await PN(), Y = {
        ...rX(q),
        "x-organization-uuid": K
    }, z = `${P4().BASE_API_URL}/api/oauth/organizations/${K}/referral/redemptions`;
    return (await sA.get(z, {
        headers: Y,
        params: {
            campaign: A
        },
        timeout: 1e4
    })).data
}
// @from(Ln 413860, Col 0)
function C9q() {
    return !!(u3()?.organizationUuid && i8() && dK() === "max")
}
// @from(Ln 413864, Col 0)
function DN6() {
    if (!C9q()) return {
        eligible: !1,
        needsRefresh: !1,
        hasCache: !1
    };
    let A = u3()?.organizationUuid;
    if (!A) return {
        eligible: !1,
        needsRefresh: !1,
        hasCache: !1
    };
    let K = f6().passesEligibilityCache?.[A];
    if (!K) return {
        eligible: !1,
        needsRefresh: !0,
        hasCache: !1
    };
    let {
        eligible: Y,
        timestamp: z
    } = K, H = Date.now() - z > R9q;
    return {
        eligible: Y,
        needsRefresh: H,
        hasCache: !0
    }
}
// @from(Ln 413893, Col 0)
function Ee(A) {
    let q = sAz[A.currency] ?? `${A.currency} `,
        K = A.amount_minor_units / 100,
        Y = K % 1 === 0 ? K.toString() : K.toFixed(2);
    return `${q}${Y}`
}
// @from(Ln 413900, Col 0)
function ke() {
    let A = u3()?.organizationUuid;
    if (!A) return null;
    return f6().passesEligibilityCache?.[A]?.referrer_reward ?? null
}
// @from(Ln 413906, Col 0)
function jN6() {
    let A = u3()?.organizationUuid;
    if (!A) return null;
    return f6().passesEligibilityCache?.[A]?.remaining_passes ?? null
}
// @from(Ln 413911, Col 0)
async function L9q() {
    if (rp1) return h("Passes: Reusing in-flight eligibility fetch"), rp1;
    let A = u3()?.organizationUuid;
    if (!A) return null;
    return rp1 = (async () => {
        try {
            let q = await aAz(),
                K = {
                    ...q,
                    timestamp: Date.now()
                };
            return jA((Y) => ({
                ...Y,
                passesEligibilityCache: {
                    ...Y.passesEligibilityCache,
                    [A]: K
                }
            })), h(`Passes eligibility cached for org ${A}: ${q.eligible}`), q
        } catch (q) {
            return h("Failed to fetch and cache passes eligibility"), K1(q), null
        } finally {
            rp1 = null
        }
    })(), rp1
}
// @from(Ln 413936, Col 0)
async function op1() {
    if (!C9q()) return null;
    let A = u3()?.organizationUuid;
    if (!A) return null;
    let K = f6().passesEligibilityCache?.[A],
        Y = Date.now();
    if (!K) return h("Passes: No cache, fetching eligibility in background (command unavailable this session)"), L9q(), null;
    if (Y - K.timestamp > R9q) {
        h("Passes: Cache stale, returning cached data and refreshing in background"), L9q();
        let {
            timestamp: H,
            ...$
        } = K;
        return $
    }
    h("Passes: Using fresh cached eligibility data");
    let {
        timestamp: z,
        ...w
    } = K;
    return w
}
// @from(Ln 413958, Col 0)
async function S9q() {
    op1()
}
// @from(Ln 413961, Col 4)
R9q = 3600000
// @from(Ln 413962, Col 4)
rp1 = null
// @from(Ln 413963, Col 4)
sAz
// @from(Ln 413964, Col 4)
Pc = v(() => {
    y5();
    Uz();
    UR();
    cA();
    J7();
    Z6();
    y6();
    sAz = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        BRL: "R$",
        CAD: "CA$",
        AUD: "A$",
        NZD: "NZ$",
        SGD: "S$"
    }
})
// @from(Ln 413987, Col 0)
function ap1(A) {
    let q = A.map((K) => {
        let Y = q71(K.modified);
        return {
            text: (K.summary && K.summary !== "No prompt" ? K.summary : K.firstPrompt) || "",
            timestamp: Y
        }
    });
    return {
        title: "Recent activity",
        lines: q,
        footer: q.length > 0 ? "/resume for more" : void 0,
        emptyMessage: "No recent activity"
    }
}
// @from(Ln 414003, Col 0)
function h9q(A) {
    let q = A.map((Y) => {
            return {
                text: Y
            }
        }),
        K = "Check the Claude Code changelog for updates";
    return {
        title: "What's new",
        lines: q,
        footer: q.length > 0 ? "/release-notes for more" : void 0,
        emptyMessage: "Check the Claude Code changelog for updates"
    }
}
// @from(Ln 414018, Col 0)
function I9q(A) {
    let K = A.filter(({
            isEnabled: z
        }) => z).sort((z, w) => Number(z.isComplete) - Number(w.isComplete)).map(({
            text: z,
            isComplete: w
        }) => {
            return {
                text: `${w?`${l1.tick} `:""}${z}`
            }
        }),
        Y = h6() === tAz() ? "Note: You have launched claude in your home directory. For the best experience, launch it in a project directory instead." : void 0;
    if (Y) K.push({
        text: Y
    });
    return {
        title: "Tips for getting started",
        lines: K
    }
}
// @from(Ln 414039, Col 0)
function x9q() {
    let A = ke(),
        q = A ? `Share Claude Code and earn ${Ee(A)} of extra usage` : "Share Claude Code with friends";
    return {
        title: "3 guest passes",
        lines: [],
        customContent: {
            content: t$.createElement(t$.Fragment, null, t$.createElement(I, {
                marginY: 1
            }, t$.createElement(V, {
                color: "claude"
            }, "[✻] [✻] [✻]")), t$.createElement(V, {
                dimColor: !0
            }, q)),
            width: 48
        },
        footer: "/passes"
    }
}
// @from(Ln 414059, Col 0)
function b9q(A) {
    switch (A) {
        case "promo-copper":
            return {
                title: i4() && lH() ? "Opus 4.6 is here · Try fast mode" : "Opus 4.6 is here", lines: [], customContent: {
                    content: t$.createElement(I, {
                        marginY: 1
                    }, t$.createElement(V, {
                        bold: !0,
                        color: "claude"
                    }, "$50 free extra usage")),
                    width: 48
                }, footer: "/extra-usage to enable"
            };
        case "promo":
            return {
                title: "Opus 4.6 is here", lines: [], customContent: {
                    content: t$.createElement(I, {
                        marginY: 1
                    }, t$.createElement(V, {
                        bold: !0,
                        color: "claude"
                    }, "$50 free extra usage")),
                    width: 48
                }, footer: "/extra-usage to enable"
            };
        case "launch-only":
            return {
                title: "Opus 4.6 is here", lines: [], customContent: {
                    content: t$.createElement(I, {
                        marginY: 1
                    }, t$.createElement(V, null, "Most capable for ambitious work")),
                    width: 48
                }, footer: "/model to switch"
            }
    }
}
// @from(Ln 414096, Col 4)
t$
// @from(Ln 414097, Col 4)
u9q = v(() => {
    vq();
    b7();
    N7();
    m1();
    OJ();
    Pc();
    t$ = o(X1(), 1)
})
// @from(Ln 414107, Col 0)
function eAz() {
    let A = jN6();
    if (A == null || A <= 0) return;
    let K = f6().passesLastSeenRemaining ?? 0;
    if (A > K) jA((Y) => ({
        ...Y,
        passesUpsellSeenCount: 0,
        hasVisitedPasses: !1,
        passesLastSeenRemaining: A
    }))
}
// @from(Ln 414119, Col 0)
function A8z() {
    let {
        eligible: A,
        hasCache: q
    } = DN6();
    if (!A || !q) return !1;
    eAz();
    let K = f6();
    if ((K.passesUpsellSeenCount ?? 0) >= 3) return !1;
    if (K.hasVisitedPasses) return !1;
    return !0
}
// @from(Ln 414132, Col 0)
function MN6() {
    let [A] = B9q.useState(q8z);
    return A
}
// @from(Ln 414137, Col 0)
function q8z() {
    return A8z()
}
// @from(Ln 414141, Col 0)
function PN6() {
    let q = (f6().passesUpsellSeenCount ?? 0) + 1;
    jA((K) => ({
        ...K,
        passesUpsellSeenCount: q
    })), c("tengu_guest_passes_upsell_shown", {
        seen_count: q
    })
}
// @from(Ln 414151, Col 0)
function m9q() {
    let A = e(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) {
        let K = ke();
        q = Wc.createElement(V, {
            dimColor: !0
        }, Wc.createElement(V, {
            color: "claude"
        }, "[✻]"), " ", Wc.createElement(V, {
            color: "claude"
        }, "[✻]"), " ", Wc.createElement(V, {
            color: "claude"
        }, "[✻]"), " ·", " ", K ? `Share Claude Code and earn ${Ee(K)} of extra usage · /passes` : "3 guest passes at /passes"), A[0] = q
    } else q = A[0];
    return q
}
// @from(Ln 414168, Col 4)
Wc
// @from(Ln 414168, Col 8)
B9q
// @from(Ln 414169, Col 4)
pbA = v(() => {
    i1();
    m1();
    cA();
    Pc();
    u6();
    Wc = o(X1(), 1), B9q = o(X1(), 1)
})
// @from(Ln 414178, Col 0)
function K8z() {
    let A = e(4);
    if (xA.terminal === "Apple_Terminal") {
        let z;
        if (A[0] === Symbol.for("react.memo_cache_sentinel")) z = s4.createElement(V, null, s4.createElement(V, {
            color: "clawd_body"
        }, "▗"), s4.createElement(V, {
            color: "clawd_background",
            backgroundColor: "clawd_body"
        }, " ", "▗", "   ", "▖", " "), s4.createElement(V, {
            color: "clawd_body"
        }, "▖")), A[0] = z;
        else z = A[0];
        let w;
        if (A[1] === Symbol.for("react.memo_cache_sentinel")) w = s4.createElement(I, {
            flexDirection: "column",
            alignItems: "center"
        }, z, s4.createElement(V, {
            backgroundColor: "clawd_body"
        }, " ".repeat(7)), s4.createElement(V, {
            color: "clawd_body"
        }, "▘▘ ▝▝")), A[1] = w;
        else w = A[1];
        return w
    }
    let K;
    if (A[2] === Symbol.for("react.memo_cache_sentinel")) K = s4.createElement(V, null, s4.createElement(V, {
        color: "clawd_body"
    }, " ▐"), s4.createElement(V, {
        color: "clawd_body",
        backgroundColor: "clawd_background"
    }, "▛███▜"), s4.createElement(V, {
        color: "clawd_body"
    }, "▌")), A[2] = K;
    else K = A[2];
    let Y;
    if (A[3] === Symbol.for("react.memo_cache_sentinel")) Y = s4.createElement(I, {
        flexDirection: "column"
    }, K, s4.createElement(V, null, s4.createElement(V, {
        color: "clawd_body"
    }, "▝▜"), s4.createElement(V, {
        color: "clawd_body",
        backgroundColor: "clawd_background"
    }, "█████"), s4.createElement(V, {
        color: "clawd_body"
    }, "▛▘")), s4.createElement(V, {
        color: "clawd_body"
    }, "  ", "▘▘ ▝▝", "  ")), A[3] = Y;
    else Y = A[3];
    return Y
}
// @from(Ln 414230, Col 0)
function F9q() {
    let {
        columns: A
    } = Z8(), q = v6((B) => B.agent), [K, {
        isVisible: Y
    }] = wB(), z = _N6(), w = sp1.useRef(z);
    if (Y) w.current = z;
    let {
        version: H,
        cwd: $,
        modelDisplayName: O,
        billingType: _,
        agentName: J
    } = w.current, X = q ?? J, D = MN6(), j = JV6();
    sp1.useEffect(() => {
        if (D) PN6()
    }, [D]), sp1.useEffect(() => {
        if (j && !D) XV6()
    }, [j, D]);
    let M = Math.max(A - 15, 20),
        W = DY(H, Math.max(M - "Claude Code v".length, 6)),
        {
            shouldSplit: G,
            truncatedModel: f,
            truncatedBilling: Z
        } = Z9q(O, _, M),
        N = " · ",
        k = X ? M - 1 - UA(X) - N.length : M,
        y = np1($, Math.max(k, 10));
    return s4.createElement(I, {
        ref: K,
        flexDirection: "row",
        gap: 2,
        alignItems: "center"
    }, s4.createElement(K8z, null), s4.createElement(I, {
        flexDirection: "column"
    }, s4.createElement(V, null, s4.createElement(V, {
        bold: !0
    }, "Claude Code"), " ", s4.createElement(V, {
        dimColor: !0
    }, "v", W)), G ? s4.createElement(s4.Fragment, null, s4.createElement(V, {
        dimColor: !0
    }, f), s4.createElement(V, {
        dimColor: !0
    }, Z)) : s4.createElement(V, {
        dimColor: !0
    }, f, " · ", Z), s4.createElement(V, {
        dimColor: !0
    }, X ? `@${X} · ${y}` : y), D && s4.createElement(m9q, null), !D && j && s4.createElement(w7q, {
        variant: j,
        maxWidth: M
    })))
}
// @from(Ln 414283, Col 4)
s4
// @from(Ln 414283, Col 8)
sp1
// @from(Ln 414284, Col 4)
Q9q = v(() => {
    i1();
    m1();
    G5();
    mq();
    vq();
    LY();
    JN6();
    pbA();
    Gp1();
    d8();
    s4 = o(X1(), 1), sp1 = o(X1(), 1)
})
// @from(Ln 414298, Col 0)
function dbA() {
    let A = ep1.useMemo(w8z, []),
        q = ep1.useMemo(() => f6().lastShownEmergencyTip, []),
        K = A.tip && A.tip !== q;
    if (ep1.useEffect(() => {
            if (K) jA((Y) => {
                if (Y.lastShownEmergencyTip === A.tip) return Y;
                return {
                    ...Y,
                    lastShownEmergencyTip: A.tip
                }
            })
        }, [K, A.tip]), !K) return null;
    return tp1.createElement(I, {
        paddingLeft: 2,
        flexDirection: "column"
    }, tp1.createElement(V, {
        ...A.color === "warning" ? {
            color: "warning"
        } : A.color === "error" ? {
            color: "error"
        } : {
            dimColor: !0
        }
    }, A.tip))
}
// @from(Ln 414325, Col 0)
function w8z() {
    return ep(Y8z, z8z)
}
// @from(Ln 414328, Col 4)
tp1
// @from(Ln 414328, Col 9)
ep1
// @from(Ln 414328, Col 14)
Y8z = "tengu-top-of-feed-tip"
// @from(Ln 414329, Col 4)
z8z
// @from(Ln 414330, Col 4)
g9q = v(() => {
    m1();
    U4();
    cA();
    tp1 = o(X1(), 1), ep1 = o(X1(), 1);
    z8z = {
        tip: "",
        color: "dim"
    }
})