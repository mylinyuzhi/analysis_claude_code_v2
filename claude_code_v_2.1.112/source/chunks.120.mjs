
// @from(Ln 299612, Col 4)
vm8 = p((MK2, Ds4) => {
    Ds4.exports = IA;
    var Fx = Ol(),
        bs1, Gm8 = Fx.LongBits,
        Ms4 = Fx.base64,
        Ps4 = Fx.utf8;

    function p78(q, K, _) {
        this.fn = q, this.len = K, this.next = void 0, this.val = _
    }

    function xs1() {}

    function mCz(q) {
        this.head = q.head, this.tail = q.tail, this.len = q.len, this.next = q.states
    }

    function IA() {
        this.len = 0, this.head = new p78(xs1, 0, 0), this.tail = this.head, this.states = null
    }
    var Ws4 = function() {
        return Fx.Buffer ? function() {
            return (IA.create = function() {
                return new bs1
            })()
        } : function() {
            return new IA
        }
    };
    IA.create = Ws4();
    IA.alloc = function(K) {
        return new Fx.Array(K)
    };
    if (Fx.Array !== Array) IA.alloc = Fx.pool(IA.alloc, Fx.Array.prototype.subarray);
    IA.prototype._push = function(K, _, z) {
        return this.tail = this.tail.next = new p78(K, _, z), this.len += _, this
    };

    function us1(q, K, _) {
        K[_] = q & 255
    }

    function BCz(q, K, _) {
        while (q > 127) K[_++] = q & 127 | 128, q >>>= 7;
        K[_] = q
    }

    function ms1(q, K) {
        this.len = q, this.next = void 0, this.val = K
    }
    ms1.prototype = Object.create(p78.prototype);
    ms1.prototype.fn = BCz;
    IA.prototype.uint32 = function(K) {
        return this.len += (this.tail = this.tail.next = new ms1((K = K >>> 0) < 128 ? 1 : K < 16384 ? 2 : K < 2097152 ? 3 : K < 268435456 ? 4 : 5, K)).len, this
    };
    IA.prototype.int32 = function(K) {
        return K < 0 ? this._push(Bs1, 10, Gm8.fromNumber(K)) : this.uint32(K)
    };
    IA.prototype.sint32 = function(K) {
        return this.uint32((K << 1 ^ K >> 31) >>> 0)
    };

    function Bs1(q, K, _) {
        while (q.hi) K[_++] = q.lo & 127 | 128, q.lo = (q.lo >>> 7 | q.hi << 25) >>> 0, q.hi >>>= 7;
        while (q.lo > 127) K[_++] = q.lo & 127 | 128, q.lo = q.lo >>> 7;
        K[_++] = q.lo
    }
    IA.prototype.uint64 = function(K) {
        var _ = Gm8.from(K);
        return this._push(Bs1, _.length(), _)
    };
    IA.prototype.int64 = IA.prototype.uint64;
    IA.prototype.sint64 = function(K) {
        var _ = Gm8.from(K).zzEncode();
        return this._push(Bs1, _.length(), _)
    };
    IA.prototype.bool = function(K) {
        return this._push(us1, 1, K ? 1 : 0)
    };

    function Is1(q, K, _) {
        K[_] = q & 255, K[_ + 1] = q >>> 8 & 255, K[_ + 2] = q >>> 16 & 255, K[_ + 3] = q >>> 24
    }
    IA.prototype.fixed32 = function(K) {
        return this._push(Is1, 4, K >>> 0)
    };
    IA.prototype.sfixed32 = IA.prototype.fixed32;
    IA.prototype.fixed64 = function(K) {
        var _ = Gm8.from(K);
        return this._push(Is1, 4, _.lo)._push(Is1, 4, _.hi)
    };
    IA.prototype.sfixed64 = IA.prototype.fixed64;
    IA.prototype.float = function(K) {
        return this._push(Fx.float.writeFloatLE, 4, K)
    };
    IA.prototype.double = function(K) {
        return this._push(Fx.float.writeDoubleLE, 8, K)
    };
    var pCz = Fx.Array.prototype.set ? function(K, _, z) {
        _.set(K, z)
    } : function(K, _, z) {
        for (var Y = 0; Y < K.length; ++Y) _[z + Y] = K[Y]
    };
    IA.prototype.bytes = function(K) {
        var _ = K.length >>> 0;
        if (!_) return this._push(us1, 1, 0);
        if (Fx.isString(K)) {
            var z = IA.alloc(_ = Ms4.length(K));
            Ms4.decode(K, z, 0), K = z
        }
        return this.uint32(_)._push(pCz, _, K)
    };
    IA.prototype.string = function(K) {
        var _ = Ps4.length(K);
        return _ ? this.uint32(_)._push(Ps4.write, _, K) : this._push(us1, 1, 0)
    };
    IA.prototype.fork = function() {
        return this.states = new mCz(this), this.head = this.tail = new p78(xs1, 0, 0), this.len = 0, this
    };
    IA.prototype.reset = function() {
        if (this.states) this.head = this.states.head, this.tail = this.states.tail, this.len = this.states.len, this.states = this.states.next;
        else this.head = this.tail = new p78(xs1, 0, 0), this.len = 0;
        return this
    };
    IA.prototype.ldelim = function() {
        var K = this.head,
            _ = this.tail,
            z = this.len;
        if (this.reset().uint32(z), z) this.tail.next = K.next, this.tail = _, this.len += z;
        return this
    };
    IA.prototype.finish = function() {
        var K = this.head.next,
            _ = this.constructor.alloc(this.len),
            z = 0;
        while (K) K.fn(K.val, _, z), z += K.len, K = K.next;
        return _
    };
    IA._configure = function(q) {
        bs1 = q, IA.create = Ws4(), bs1._configure()
    }
})
// @from(Ln 299754, Col 4)
Gs4 = p((PK2, fs4) => {
    fs4.exports = wl;
    var Zs4 = vm8();
    (wl.prototype = Object.create(Zs4.prototype)).constructor = wl;
    var T36 = Ol();

    function wl() {
        Zs4.call(this)
    }
    wl._configure = function() {
        wl.alloc = T36._Buffer_allocUnsafe, wl.writeBytesBuffer = T36.Buffer && T36.Buffer.prototype instanceof Uint8Array && T36.Buffer.prototype.set.name === "set" ? function(K, _, z) {
            _.set(K, z)
        } : function(K, _, z) {
            if (K.copy) K.copy(_, z, 0, K.length);
            else
                for (var Y = 0; Y < K.length;) _[z++] = K[Y++]
        }
    };
    wl.prototype.bytes = function(K) {
        if (T36.isString(K)) K = T36._Buffer_from(K, "base64");
        var _ = K.length >>> 0;
        if (this.uint32(_), _) this._push(wl.writeBytesBuffer, _, K);
        return this
    };

    function FCz(q, K, _) {
        if (q.length < 40) T36.utf8.write(q, K, _);
        else if (K.utf8Write) K.utf8Write(q, _);
        else K.write(q, _)
    }
    wl.prototype.string = function(K) {
        var _ = T36.Buffer.byteLength(K);
        if (this.uint32(_), _) this._push(FCz, _, K);
        return this
    };
    wl._configure()
})
// @from(Ln 299791, Col 4)
Vm8 = p((WK2, Ns4) => {
    Ns4.exports = VM;
    var ZF = Ol(),
        Fs1, Vs4 = ZF.LongBits,
        gCz = ZF.utf8;

    function fF(q, K) {
        return RangeError("index out of range: " + q.pos + " + " + (K || 1) + " > " + q.len)
    }

    function VM(q) {
        this.buf = q, this.pos = 0, this.len = q.length
    }
    var vs4 = typeof Uint8Array < "u" ? function(K) {
            if (K instanceof Uint8Array || Array.isArray(K)) return new VM(K);
            throw Error("illegal buffer")
        } : function(K) {
            if (Array.isArray(K)) return new VM(K);
            throw Error("illegal buffer")
        },
        ks4 = function() {
            return ZF.Buffer ? function(_) {
                return (VM.create = function(Y) {
                    return ZF.Buffer.isBuffer(Y) ? new Fs1(Y) : vs4(Y)
                })(_)
            } : vs4
        };
    VM.create = ks4();
    VM.prototype._slice = ZF.Array.prototype.subarray || ZF.Array.prototype.slice;
    VM.prototype.uint32 = function() {
        var K = 4294967295;
        return function() {
            if (K = (this.buf[this.pos] & 127) >>> 0, this.buf[this.pos++] < 128) return K;
            if (K = (K | (this.buf[this.pos] & 127) << 7) >>> 0, this.buf[this.pos++] < 128) return K;
            if (K = (K | (this.buf[this.pos] & 127) << 14) >>> 0, this.buf[this.pos++] < 128) return K;
            if (K = (K | (this.buf[this.pos] & 127) << 21) >>> 0, this.buf[this.pos++] < 128) return K;
            if (K = (K | (this.buf[this.pos] & 15) << 28) >>> 0, this.buf[this.pos++] < 128) return K;
            if ((this.pos += 5) > this.len) throw this.pos = this.len, fF(this, 10);
            return K
        }
    }();
    VM.prototype.int32 = function() {
        return this.uint32() | 0
    };
    VM.prototype.sint32 = function() {
        var K = this.uint32();
        return K >>> 1 ^ -(K & 1) | 0
    };

    function ps1() {
        var q = new Vs4(0, 0),
            K = 0;
        if (this.len - this.pos > 4) {
            for (; K < 4; ++K)
                if (q.lo = (q.lo | (this.buf[this.pos] & 127) << K * 7) >>> 0, this.buf[this.pos++] < 128) return q;
            if (q.lo = (q.lo | (this.buf[this.pos] & 127) << 28) >>> 0, q.hi = (q.hi | (this.buf[this.pos] & 127) >> 4) >>> 0, this.buf[this.pos++] < 128) return q;
            K = 0
        } else {
            for (; K < 3; ++K) {
                if (this.pos >= this.len) throw fF(this);
                if (q.lo = (q.lo | (this.buf[this.pos] & 127) << K * 7) >>> 0, this.buf[this.pos++] < 128) return q
            }
            return q.lo = (q.lo | (this.buf[this.pos++] & 127) << K * 7) >>> 0, q
        }
        if (this.len - this.pos > 4) {
            for (; K < 5; ++K)
                if (q.hi = (q.hi | (this.buf[this.pos] & 127) << K * 7 + 3) >>> 0, this.buf[this.pos++] < 128) return q
        } else
            for (; K < 5; ++K) {
                if (this.pos >= this.len) throw fF(this);
                if (q.hi = (q.hi | (this.buf[this.pos] & 127) << K * 7 + 3) >>> 0, this.buf[this.pos++] < 128) return q
            }
        throw Error("invalid varint encoding")
    }
    VM.prototype.bool = function() {
        return this.uint32() !== 0
    };

    function Tm8(q, K) {
        return (q[K - 4] | q[K - 3] << 8 | q[K - 2] << 16 | q[K - 1] << 24) >>> 0
    }
    VM.prototype.fixed32 = function() {
        if (this.pos + 4 > this.len) throw fF(this, 4);
        return Tm8(this.buf, this.pos += 4)
    };
    VM.prototype.sfixed32 = function() {
        if (this.pos + 4 > this.len) throw fF(this, 4);
        return Tm8(this.buf, this.pos += 4) | 0
    };

    function Ts4() {
        if (this.pos + 8 > this.len) throw fF(this, 8);
        return new Vs4(Tm8(this.buf, this.pos += 4), Tm8(this.buf, this.pos += 4))
    }
    VM.prototype.float = function() {
        if (this.pos + 4 > this.len) throw fF(this, 4);
        var K = ZF.float.readFloatLE(this.buf, this.pos);
        return this.pos += 4, K
    };
    VM.prototype.double = function() {
        if (this.pos + 8 > this.len) throw fF(this, 4);
        var K = ZF.float.readDoubleLE(this.buf, this.pos);
        return this.pos += 8, K
    };
    VM.prototype.bytes = function() {
        var K = this.uint32(),
            _ = this.pos,
            z = this.pos + K;
        if (z > this.len) throw fF(this, K);
        if (this.pos += K, Array.isArray(this.buf)) return this.buf.slice(_, z);
        if (_ === z) {
            var Y = ZF.Buffer;
            return Y ? Y.alloc(0) : new this.buf.constructor(0)
        }
        return this._slice.call(this.buf, _, z)
    };
    VM.prototype.string = function() {
        var K = this.bytes();
        return gCz.read(K, 0, K.length)
    };
    VM.prototype.skip = function(K) {
        if (typeof K === "number") {
            if (this.pos + K > this.len) throw fF(this, K);
            this.pos += K
        } else
            do
                if (this.pos >= this.len) throw fF(this); while (this.buf[this.pos++] & 128);
        return this
    };
    VM.prototype.skipType = function(q) {
        switch (q) {
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
                while ((q = this.uint32() & 7) !== 4) this.skipType(q);
                break;
            case 5:
                this.skip(4);
                break;
            default:
                throw Error("invalid wire type " + q + " at offset " + this.pos)
        }
        return this
    };
    VM._configure = function(q) {
        Fs1 = q, VM.create = ks4(), Fs1._configure();
        var K = ZF.Long ? "toLong" : "toNumber";
        ZF.merge(VM.prototype, {
            int64: function() {
                return ps1.call(this)[K](!1)
            },
            uint64: function() {
                return ps1.call(this)[K](!0)
            },
            sint64: function() {
                return ps1.call(this).zzDecode()[K](!1)
            },
            fixed64: function() {
                return Ts4.call(this)[K](!0)
            },
            sfixed64: function() {
                return Ts4.call(this)[K](!1)
            }
        })
    }
})
// @from(Ln 299964, Col 4)
hs4 = p((DK2, Ls4) => {
    Ls4.exports = dJ6;
    var ys4 = Vm8();
    (dJ6.prototype = Object.create(ys4.prototype)).constructor = dJ6;
    var Es4 = Ol();

    function dJ6(q) {
        ys4.call(this, q)
    }
    dJ6._configure = function() {
        if (Es4.Buffer) dJ6.prototype._slice = Es4.Buffer.prototype.slice
    };
    dJ6.prototype.string = function() {
        var K = this.uint32();
        return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + K, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + K, this.len))
    };
    dJ6._configure()
})
// @from(Ln 299982, Col 4)
Ss4 = p((ZK2, Rs4) => {
    Rs4.exports = F78;
    var gs1 = Ol();
    (F78.prototype = Object.create(gs1.EventEmitter.prototype)).constructor = F78;

    function F78(q, K, _) {
        if (typeof q !== "function") throw TypeError("rpcImpl must be a function");
        gs1.EventEmitter.call(this), this.rpcImpl = q, this.requestDelimited = Boolean(K), this.responseDelimited = Boolean(_)
    }
    F78.prototype.rpcCall = function q(K, _, z, Y, A) {
        if (!Y) throw TypeError("request must be specified");
        var O = this;
        if (!A) return gs1.asPromise(q, O, K, _, z, Y);
        if (!O.rpcImpl) {
            setTimeout(function() {
                A(Error("already ended"))
            }, 0);
            return
        }
        try {
            return O.rpcImpl(K, _[O.requestDelimited ? "encodeDelimited" : "encode"](Y).finish(), function($, j) {
                if ($) return O.emit("error", $, K), A($);
                if (j === null) {
                    O.end(!0);
                    return
                }
                if (!(j instanceof z)) try {
                    j = z[O.responseDelimited ? "decodeDelimited" : "decode"](j)
                } catch (H) {
                    return O.emit("error", H, K), A(H)
                }
                return O.emit("data", j, K), A(null, j)
            })
        } catch (w) {
            O.emit("error", w, K), setTimeout(function() {
                A(w)
            }, 0);
            return
        }
    };
    F78.prototype.end = function(K) {
        if (this.rpcImpl) {
            if (!K) this.rpcImpl(null, null, null);
            this.rpcImpl = null, this.emit("end").off()
        }
        return this
    }
})
// @from(Ln 300030, Col 4)
Us1 = p((Cs4) => {
    var UCz = Cs4;
    UCz.Service = Ss4()
})
// @from(Ln 300034, Col 4)
Qs1 = p((GK2, bs4) => {
    bs4.exports = {}
})
// @from(Ln 300037, Col 4)
ds1 = p((xs4) => {
    var Sy = xs4;
    Sy.build = "minimal";
    Sy.Writer = vm8();
    Sy.BufferWriter = Gs4();
    Sy.Reader = Vm8();
    Sy.BufferReader = hs4();
    Sy.util = Ol();
    Sy.rpc = Us1();
    Sy.roots = Qs1();
    Sy.configure = Is4;

    function Is4() {
        Sy.util._configure(), Sy.Writer._configure(Sy.BufferWriter), Sy.Reader._configure(Sy.BufferReader)
    }
    Is4()
})