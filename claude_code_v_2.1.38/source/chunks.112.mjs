
// @from(Ln 278057, Col 4)
GD6 = R((juw, Xj4) => {
    Xj4.exports = EJ;
    var dh = Am(),
        XZA, _j4 = dh.LongBits,
        u4Y = dh.utf8;

    function ch(A, q) {
        return RangeError("index out of range: " + A.pos + " + " + (q || 1) + " > " + A.len)
    }

    function EJ(A) {
        this.buf = A, this.pos = 0, this.len = A.length
    }
    var $j4 = typeof Uint8Array < "u" ? function(q) {
            if (q instanceof Uint8Array || Array.isArray(q)) return new EJ(q);
            throw Error("illegal buffer")
        } : function(q) {
            if (Array.isArray(q)) return new EJ(q);
            throw Error("illegal buffer")
        },
        Jj4 = function() {
            return dh.Buffer ? function(K) {
                return (EJ.create = function(z) {
                    return dh.Buffer.isBuffer(z) ? new XZA(z) : $j4(z)
                })(K)
            } : $j4
        };
    EJ.create = Jj4();
    EJ.prototype._slice = dh.Array.prototype.subarray || dh.Array.prototype.slice;
    EJ.prototype.uint32 = function() {
        var q = 4294967295;
        return function() {
            if (q = (this.buf[this.pos] & 127) >>> 0, this.buf[this.pos++] < 128) return q;
            if (q = (q | (this.buf[this.pos] & 127) << 7) >>> 0, this.buf[this.pos++] < 128) return q;
            if (q = (q | (this.buf[this.pos] & 127) << 14) >>> 0, this.buf[this.pos++] < 128) return q;
            if (q = (q | (this.buf[this.pos] & 127) << 21) >>> 0, this.buf[this.pos++] < 128) return q;
            if (q = (q | (this.buf[this.pos] & 15) << 28) >>> 0, this.buf[this.pos++] < 128) return q;
            if ((this.pos += 5) > this.len) throw this.pos = this.len, ch(this, 10);
            return q
        }
    }();
    EJ.prototype.int32 = function() {
        return this.uint32() | 0
    };
    EJ.prototype.sint32 = function() {
        var q = this.uint32();
        return q >>> 1 ^ -(q & 1) | 0
    };

    function JZA() {
        var A = new _j4(0, 0),
            q = 0;
        if (this.len - this.pos > 4) {
            for (; q < 4; ++q)
                if (A.lo = (A.lo | (this.buf[this.pos] & 127) << q * 7) >>> 0, this.buf[this.pos++] < 128) return A;
            if (A.lo = (A.lo | (this.buf[this.pos] & 127) << 28) >>> 0, A.hi = (A.hi | (this.buf[this.pos] & 127) >> 4) >>> 0, this.buf[this.pos++] < 128) return A;
            q = 0
        } else {
            for (; q < 3; ++q) {
                if (this.pos >= this.len) throw ch(this);
                if (A.lo = (A.lo | (this.buf[this.pos] & 127) << q * 7) >>> 0, this.buf[this.pos++] < 128) return A
            }
            return A.lo = (A.lo | (this.buf[this.pos++] & 127) << q * 7) >>> 0, A
        }
        if (this.len - this.pos > 4) {
            for (; q < 5; ++q)
                if (A.hi = (A.hi | (this.buf[this.pos] & 127) << q * 7 + 3) >>> 0, this.buf[this.pos++] < 128) return A
        } else
            for (; q < 5; ++q) {
                if (this.pos >= this.len) throw ch(this);
                if (A.hi = (A.hi | (this.buf[this.pos] & 127) << q * 7 + 3) >>> 0, this.buf[this.pos++] < 128) return A
            }
        throw Error("invalid varint encoding")
    }
    EJ.prototype.bool = function() {
        return this.uint32() !== 0
    };

    function WD6(A, q) {
        return (A[q - 4] | A[q - 3] << 8 | A[q - 2] << 16 | A[q - 1] << 24) >>> 0
    }
    EJ.prototype.fixed32 = function() {
        if (this.pos + 4 > this.len) throw ch(this, 4);
        return WD6(this.buf, this.pos += 4)
    };
    EJ.prototype.sfixed32 = function() {
        if (this.pos + 4 > this.len) throw ch(this, 4);
        return WD6(this.buf, this.pos += 4) | 0
    };

    function Oj4() {
        if (this.pos + 8 > this.len) throw ch(this, 8);
        return new _j4(WD6(this.buf, this.pos += 4), WD6(this.buf, this.pos += 4))
    }
    EJ.prototype.float = function() {
        if (this.pos + 4 > this.len) throw ch(this, 4);
        var q = dh.float.readFloatLE(this.buf, this.pos);
        return this.pos += 4, q
    };
    EJ.prototype.double = function() {
        if (this.pos + 8 > this.len) throw ch(this, 4);
        var q = dh.float.readDoubleLE(this.buf, this.pos);
        return this.pos += 8, q
    };
    EJ.prototype.bytes = function() {
        var q = this.uint32(),
            K = this.pos,
            Y = this.pos + q;
        if (Y > this.len) throw ch(this, q);
        if (this.pos += q, Array.isArray(this.buf)) return this.buf.slice(K, Y);
        if (K === Y) {
            var z = dh.Buffer;
            return z ? z.alloc(0) : new this.buf.constructor(0)
        }
        return this._slice.call(this.buf, K, Y)
    };
    EJ.prototype.string = function() {
        var q = this.bytes();
        return u4Y.read(q, 0, q.length)
    };
    EJ.prototype.skip = function(q) {
        if (typeof q === "number") {
            if (this.pos + q > this.len) throw ch(this, q);
            this.pos += q
        } else
            do
                if (this.pos >= this.len) throw ch(this); while (this.buf[this.pos++] & 128);
        return this
    };
    EJ.prototype.skipType = function(A) {
        switch (A) {
            case 0:
                this.skip();
                break;
            case 1:
                this.skip(8);
                break;
            case 2:
                this.skip(this.uint32());
                break;
            case 3:
                while ((A = this.uint32() & 7) !== 4) this.skipType(A);
                break;
            case 5:
                this.skip(4);
                break;
            default:
                throw Error("invalid wire type " + A + " at offset " + this.pos)
        }
        return this
    };
    EJ._configure = function(A) {
        XZA = A, EJ.create = Jj4(), XZA._configure();
        var q = dh.Long ? "toLong" : "toNumber";
        dh.merge(EJ.prototype, {
            int64: function() {
                return JZA.call(this)[q](!1)
            },
            uint64: function() {
                return JZA.call(this)[q](!0)
            },
            sint64: function() {
                return JZA.call(this).zzDecode()[q](!1)
            },
            fixed64: function() {
                return Oj4.call(this)[q](!0)
            },
            sfixed64: function() {
                return Oj4.call(this)[q](!1)
            }
        })
    }
})
// @from(Ln 278230, Col 4)
Pj4 = R((Muw, Mj4) => {
    Mj4.exports = T31;
    var jj4 = GD6();
    (T31.prototype = Object.create(jj4.prototype)).constructor = T31;
    var Dj4 = Am();

    function T31(A) {
        jj4.call(this, A)
    }
    T31._configure = function() {
        if (Dj4.Buffer) T31.prototype._slice = Dj4.Buffer.prototype.slice
    };
    T31.prototype.string = function() {
        var q = this.uint32();
        return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + q, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + q, this.len))
    };
    T31._configure()
})
// @from(Ln 278248, Col 4)
Gj4 = R((Puw, Wj4) => {
    Wj4.exports = Em1;
    var DZA = Am();
    (Em1.prototype = Object.create(DZA.EventEmitter.prototype)).constructor = Em1;

    function Em1(A, q, K) {
        if (typeof A !== "function") throw TypeError("rpcImpl must be a function");
        DZA.EventEmitter.call(this), this.rpcImpl = A, this.requestDelimited = Boolean(q), this.responseDelimited = Boolean(K)
    }
    Em1.prototype.rpcCall = function A(q, K, Y, z, w) {
        if (!z) throw TypeError("request must be specified");
        var H = this;
        if (!w) return DZA.asPromise(A, H, q, K, Y, z);
        if (!H.rpcImpl) {
            setTimeout(function() {
                w(Error("already ended"))
            }, 0);
            return
        }
        try {
            return H.rpcImpl(q, K[H.requestDelimited ? "encodeDelimited" : "encode"](z).finish(), function(O, _) {
                if (O) return H.emit("error", O, q), w(O);
                if (_ === null) {
                    H.end(!0);
                    return
                }
                if (!(_ instanceof Y)) try {
                    _ = Y[H.responseDelimited ? "decodeDelimited" : "decode"](_)
                } catch (J) {
                    return H.emit("error", J, q), w(J)
                }
                return H.emit("data", _, q), w(null, _)
            })
        } catch ($) {
            H.emit("error", $, q), setTimeout(function() {
                w($)
            }, 0);
            return
        }
    };
    Em1.prototype.end = function(q) {
        if (this.rpcImpl) {
            if (!q) this.rpcImpl(null, null, null);
            this.rpcImpl = null, this.emit("end").off()
        }
        return this
    }
})
// @from(Ln 278296, Col 4)
jZA = R((Zj4) => {
    var B4Y = Zj4;
    B4Y.Service = Gj4()
})
// @from(Ln 278300, Col 4)
MZA = R((Guw, fj4) => {
    fj4.exports = {}
})
// @from(Ln 278303, Col 4)
PZA = R((Nj4) => {
    var wN = Nj4;
    wN.build = "minimal";
    wN.Writer = PD6();
    wN.BufferWriter = Hj4();
    wN.Reader = GD6();
    wN.BufferReader = Pj4();
    wN.util = Am();
    wN.rpc = jZA();
    wN.roots = MZA();
    wN.configure = Vj4;

    function Vj4() {
        wN.util._configure(), wN.Writer._configure(wN.BufferWriter), wN.Reader._configure(wN.BufferReader)
    }
    Vj4()
})