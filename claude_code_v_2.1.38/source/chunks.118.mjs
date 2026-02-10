
// @from(Ln 293439, Col 4)
Gf4 = R((Pf4) => {
    Object.defineProperty(Pf4, "__esModule", {
        value: !0
    });
    Pf4.addCommonProtos = Pf4.loadProtosWithOptionsSync = Pf4.loadProtosWithOptions = void 0;
    var Df4 = h1("fs"),
        jf4 = h1("path"),
        tM1 = _06();

    function Mf4(A, q) {
        let K = A.resolvePath;
        A.resolvePath = (Y, z) => {
            if (jf4.isAbsolute(z)) return z;
            for (let w of q) {
                let H = jf4.join(w, z);
                try {
                    return Df4.accessSync(H, Df4.constants.R_OK), H
                } catch ($) {
                    continue
                }
            }
            return process.emitWarning(`${z} not found in any of the include paths ${q}`), K(Y, z)
        }
    }
    async function t2Y(A, q) {
        let K = new tM1.Root;
        if (q = q || {}, q.includeDirs) {
            if (!Array.isArray(q.includeDirs)) return Promise.reject(Error("The includeDirs option must be an array"));
            Mf4(K, q.includeDirs)
        }
        let Y = await K.load(A, q);
        return Y.resolveAll(), Y
    }
    Pf4.loadProtosWithOptions = t2Y;

    function e2Y(A, q) {
        let K = new tM1.Root;
        if (q = q || {}, q.includeDirs) {
            if (!Array.isArray(q.includeDirs)) throw Error("The includeDirs option must be an array");
            Mf4(K, q.includeDirs)
        }
        let Y = K.loadSync(A, q);
        return Y.resolveAll(), Y
    }
    Pf4.loadProtosWithOptionsSync = e2Y;

    function AwY() {
        let A = _f4(),
            q = rfA(),
            K = Jf4(),
            Y = Xf4();
        tM1.common("api", A.nested.google.nested.protobuf.nested), tM1.common("descriptor", q.nested.google.nested.protobuf.nested), tM1.common("source_context", K.nested.google.nested.protobuf.nested), tM1.common("type", Y.nested.google.nested.protobuf.nested)
    }
    Pf4.addCommonProtos = AwY
})
// @from(Ln 293494, Col 4)
Zf4 = R((om1, afA) => {
    (function(A, q) {
        function K(Y) {
            return "default" in Y ? Y.default : Y
        }
        if (typeof define === "function" && define.amd) define([], function() {
            var Y = {};
            return q(Y), K(Y)
        });
        else if (typeof om1 === "object") {
            if (q(om1), typeof afA === "object") afA.exports = K(om1)
        } else(function() {
            var Y = {};
            q(Y), A.Long = K(Y)
        })()
    })(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : om1, function(A) {
        Object.defineProperty(A, "__esModule", {
            value: !0
        }), A.default = void 0;
        var q = null;
        try {
            q = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports
        } catch {}

        function K(U, x, p) {
            this.low = U | 0, this.high = x | 0, this.unsigned = !!p
        }
        K.prototype.__isLong__, Object.defineProperty(K.prototype, "__isLong__", {
            value: !0
        });

        function Y(U) {
            return (U && U.__isLong__) === !0
        }

        function z(U) {
            var x = Math.clz32(U & -U);
            return U ? 31 - x : x
        }
        K.isLong = Y;
        var w = {},
            H = {};

        function $(U, x) {
            var p, l, r;
            if (x) {
                if (U >>>= 0, r = 0 <= U && U < 256) {
                    if (l = H[U], l) return l
                }
                if (p = _(U, 0, !0), r) H[U] = p;
                return p
            } else {
                if (U |= 0, r = -128 <= U && U < 128) {
                    if (l = w[U], l) return l
                }
                if (p = _(U, U < 0 ? -1 : 0, !1), r) w[U] = p;
                return p
            }
        }
        K.fromInt = $;

        function O(U, x) {
            if (isNaN(U)) return x ? N : Z;
            if (x) {
                if (U < 0) return N;
                if (U >= W) return S
            } else {
                if (U <= -G) return m;
                if (U + 1 >= G) return B
            }
            if (U < 0) return O(-U, x).neg();
            return _(U % P | 0, U / P | 0, x)
        }
        K.fromNumber = O;

        function _(U, x, p) {
            return new K(U, x, p)
        }
        K.fromBits = _;
        var J = Math.pow;

        function X(U, x, p) {
            if (U.length === 0) throw Error("empty string");
            if (typeof x === "number") p = x, x = !1;
            else x = !!x;
            if (U === "NaN" || U === "Infinity" || U === "+Infinity" || U === "-Infinity") return x ? N : Z;
            if (p = p || 10, p < 2 || 36 < p) throw RangeError("radix");
            var l;
            if ((l = U.indexOf("-")) > 0) throw Error("interior hyphen");
            else if (l === 0) return X(U.substring(1), x, p).neg();
            var r = O(J(p, 8)),
                s = Z;
            for (var O1 = 0; O1 < U.length; O1 += 8) {
                var T1 = Math.min(8, U.length - O1),
                    N1 = parseInt(U.substring(O1, O1 + T1), p);
                if (T1 < 8) {
                    var j1 = O(J(p, T1));
                    s = s.mul(j1).add(O(N1))
                } else s = s.mul(r), s = s.add(O(N1))
            }
            return s.unsigned = x, s
        }
        K.fromString = X;

        function D(U, x) {
            if (typeof U === "number") return O(U, x);
            if (typeof U === "string") return X(U, x);
            return _(U.low, U.high, typeof x === "boolean" ? x : U.unsigned)
        }
        K.fromValue = D;
        var j = 65536,
            M = 16777216,
            P = j * j,
            W = P * P,
            G = W / 2,
            f = $(M),
            Z = $(0);
        K.ZERO = Z;
        var N = $(0, !0);
        K.UZERO = N;
        var T = $(1);
        K.ONE = T;
        var k = $(1, !0);
        K.UONE = k;
        var y = $(-1);
        K.NEG_ONE = y;
        var B = _(-1, 2147483647, !1);
        K.MAX_VALUE = B;
        var S = _(-1, -1, !0);
        K.MAX_UNSIGNED_VALUE = S;
        var m = _(0, -2147483648, !1);
        K.MIN_VALUE = m;
        var b = K.prototype;
        if (b.toInt = function() {
                return this.unsigned ? this.low >>> 0 : this.low
            }, b.toNumber = function() {
                if (this.unsigned) return (this.high >>> 0) * P + (this.low >>> 0);
                return this.high * P + (this.low >>> 0)
            }, b.toString = function(x) {
                if (x = x || 10, x < 2 || 36 < x) throw RangeError("radix");
                if (this.isZero()) return "0";
                if (this.isNegative())
                    if (this.eq(m)) {
                        var p = O(x),
                            l = this.div(p),
                            r = l.mul(p).sub(this);
                        return l.toString(x) + r.toInt().toString(x)
                    } else return "-" + this.neg().toString(x);
                var s = O(J(x, 6), this.unsigned),
                    O1 = this,
                    T1 = "";
                while (!0) {
                    var N1 = O1.div(s),
                        j1 = O1.sub(N1.mul(s)).toInt() >>> 0,
                        q1 = j1.toString(x);
                    if (O1 = N1, O1.isZero()) return q1 + T1;
                    else {
                        while (q1.length < 6) q1 = "0" + q1;
                        T1 = "" + q1 + T1
                    }
                }
            }, b.getHighBits = function() {
                return this.high
            }, b.getHighBitsUnsigned = function() {
                return this.high >>> 0
            }, b.getLowBits = function() {
                return this.low
            }, b.getLowBitsUnsigned = function() {
                return this.low >>> 0
            }, b.getNumBitsAbs = function() {
                if (this.isNegative()) return this.eq(m) ? 64 : this.neg().getNumBitsAbs();
                var x = this.high != 0 ? this.high : this.low;
                for (var p = 31; p > 0; p--)
                    if ((x & 1 << p) != 0) break;
                return this.high != 0 ? p + 33 : p + 1
            }, b.isSafeInteger = function() {
                var x = this.high >> 21;
                if (!x) return !0;
                if (this.unsigned) return !1;
                return x === -1 && !(this.low === 0 && this.high === -2097152)
            }, b.isZero = function() {
                return this.high === 0 && this.low === 0
            }, b.eqz = b.isZero, b.isNegative = function() {
                return !this.unsigned && this.high < 0
            }, b.isPositive = function() {
                return this.unsigned || this.high >= 0
            }, b.isOdd = function() {
                return (this.low & 1) === 1
            }, b.isEven = function() {
                return (this.low & 1) === 0
            }, b.equals = function(x) {
                if (!Y(x)) x = D(x);
                if (this.unsigned !== x.unsigned && this.high >>> 31 === 1 && x.high >>> 31 === 1) return !1;
                return this.high === x.high && this.low === x.low
            }, b.eq = b.equals, b.notEquals = function(x) {
                return !this.eq(x)
            }, b.neq = b.notEquals, b.ne = b.notEquals, b.lessThan = function(x) {
                return this.comp(x) < 0
            }, b.lt = b.lessThan, b.lessThanOrEqual = function(x) {
                return this.comp(x) <= 0
            }, b.lte = b.lessThanOrEqual, b.le = b.lessThanOrEqual, b.greaterThan = function(x) {
                return this.comp(x) > 0
            }, b.gt = b.greaterThan, b.greaterThanOrEqual = function(x) {
                return this.comp(x) >= 0
            }, b.gte = b.greaterThanOrEqual, b.ge = b.greaterThanOrEqual, b.compare = function(x) {
                if (!Y(x)) x = D(x);
                if (this.eq(x)) return 0;
                var p = this.isNegative(),
                    l = x.isNegative();
                if (p && !l) return -1;
                if (!p && l) return 1;
                if (!this.unsigned) return this.sub(x).isNegative() ? -1 : 1;
                return x.high >>> 0 > this.high >>> 0 || x.high === this.high && x.low >>> 0 > this.low >>> 0 ? -1 : 1
            }, b.comp = b.compare, b.negate = function() {
                if (!this.unsigned && this.eq(m)) return m;
                return this.not().add(T)
            }, b.neg = b.negate, b.add = function(x) {
                if (!Y(x)) x = D(x);
                var p = this.high >>> 16,
                    l = this.high & 65535,
                    r = this.low >>> 16,
                    s = this.low & 65535,
                    O1 = x.high >>> 16,
                    T1 = x.high & 65535,
                    N1 = x.low >>> 16,
                    j1 = x.low & 65535,
                    q1 = 0,
                    t = 0,
                    J1 = 0,
                    D1 = 0;
                return D1 += s + j1, J1 += D1 >>> 16, D1 &= 65535, J1 += r + N1, t += J1 >>> 16, J1 &= 65535, t += l + T1, q1 += t >>> 16, t &= 65535, q1 += p + O1, q1 &= 65535, _(J1 << 16 | D1, q1 << 16 | t, this.unsigned)
            }, b.subtract = function(x) {
                if (!Y(x)) x = D(x);
                return this.add(x.neg())
            }, b.sub = b.subtract, b.multiply = function(x) {
                if (this.isZero()) return this;
                if (!Y(x)) x = D(x);
                if (q) {
                    var p = q.mul(this.low, this.high, x.low, x.high);
                    return _(p, q.get_high(), this.unsigned)
                }
                if (x.isZero()) return this.unsigned ? N : Z;
                if (this.eq(m)) return x.isOdd() ? m : Z;
                if (x.eq(m)) return this.isOdd() ? m : Z;
                if (this.isNegative())
                    if (x.isNegative()) return this.neg().mul(x.neg());
                    else return this.neg().mul(x).neg();
                else if (x.isNegative()) return this.mul(x.neg()).neg();
                if (this.lt(f) && x.lt(f)) return O(this.toNumber() * x.toNumber(), this.unsigned);
                var l = this.high >>> 16,
                    r = this.high & 65535,
                    s = this.low >>> 16,
                    O1 = this.low & 65535,
                    T1 = x.high >>> 16,
                    N1 = x.high & 65535,
                    j1 = x.low >>> 16,
                    q1 = x.low & 65535,
                    t = 0,
                    J1 = 0,
                    D1 = 0,
                    Z1 = 0;
                return Z1 += O1 * q1, D1 += Z1 >>> 16, Z1 &= 65535, D1 += s * q1, J1 += D1 >>> 16, D1 &= 65535, D1 += O1 * j1, J1 += D1 >>> 16, D1 &= 65535, J1 += r * q1, t += J1 >>> 16, J1 &= 65535, J1 += s * j1, t += J1 >>> 16, J1 &= 65535, J1 += O1 * N1, t += J1 >>> 16, J1 &= 65535, t += l * q1 + r * j1 + s * N1 + O1 * T1, t &= 65535, _(D1 << 16 | Z1, t << 16 | J1, this.unsigned)
            }, b.mul = b.multiply, b.divide = function(x) {
                if (!Y(x)) x = D(x);
                if (x.isZero()) throw Error("division by zero");
                if (q) {
                    if (!this.unsigned && this.high === -2147483648 && x.low === -1 && x.high === -1) return this;
                    var p = (this.unsigned ? q.div_u : q.div_s)(this.low, this.high, x.low, x.high);
                    return _(p, q.get_high(), this.unsigned)
                }
                if (this.isZero()) return this.unsigned ? N : Z;
                var l, r, s;
                if (!this.unsigned) {
                    if (this.eq(m))
                        if (x.eq(T) || x.eq(y)) return m;
                        else if (x.eq(m)) return T;
                    else {
                        var O1 = this.shr(1);
                        if (l = O1.div(x).shl(1), l.eq(Z)) return x.isNegative() ? T : y;
                        else return r = this.sub(x.mul(l)), s = l.add(r.div(x)), s
                    } else if (x.eq(m)) return this.unsigned ? N : Z;
                    if (this.isNegative()) {
                        if (x.isNegative()) return this.neg().div(x.neg());
                        return this.neg().div(x).neg()
                    } else if (x.isNegative()) return this.div(x.neg()).neg();
                    s = Z
                } else {
                    if (!x.unsigned) x = x.toUnsigned();
                    if (x.gt(this)) return N;
                    if (x.gt(this.shru(1))) return k;
                    s = N
                }
                r = this;
                while (r.gte(x)) {
                    l = Math.max(1, Math.floor(r.toNumber() / x.toNumber()));
                    var T1 = Math.ceil(Math.log(l) / Math.LN2),
                        N1 = T1 <= 48 ? 1 : J(2, T1 - 48),
                        j1 = O(l),
                        q1 = j1.mul(x);
                    while (q1.isNegative() || q1.gt(r)) l -= N1, j1 = O(l, this.unsigned), q1 = j1.mul(x);
                    if (j1.isZero()) j1 = T;
                    s = s.add(j1), r = r.sub(q1)
                }
                return s
            }, b.div = b.divide, b.modulo = function(x) {
                if (!Y(x)) x = D(x);
                if (q) {
                    var p = (this.unsigned ? q.rem_u : q.rem_s)(this.low, this.high, x.low, x.high);
                    return _(p, q.get_high(), this.unsigned)
                }
                return this.sub(this.div(x).mul(x))
            }, b.mod = b.modulo, b.rem = b.modulo, b.not = function() {
                return _(~this.low, ~this.high, this.unsigned)
            }, b.countLeadingZeros = function() {
                return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32
            }, b.clz = b.countLeadingZeros, b.countTrailingZeros = function() {
                return this.low ? z(this.low) : z(this.high) + 32
            }, b.ctz = b.countTrailingZeros, b.and = function(x) {
                if (!Y(x)) x = D(x);
                return _(this.low & x.low, this.high & x.high, this.unsigned)
            }, b.or = function(x) {
                if (!Y(x)) x = D(x);
                return _(this.low | x.low, this.high | x.high, this.unsigned)
            }, b.xor = function(x) {
                if (!Y(x)) x = D(x);
                return _(this.low ^ x.low, this.high ^ x.high, this.unsigned)
            }, b.shiftLeft = function(x) {
                if (Y(x)) x = x.toInt();
                if ((x &= 63) === 0) return this;
                else if (x < 32) return _(this.low << x, this.high << x | this.low >>> 32 - x, this.unsigned);
                else return _(0, this.low << x - 32, this.unsigned)
            }, b.shl = b.shiftLeft, b.shiftRight = function(x) {
                if (Y(x)) x = x.toInt();
                if ((x &= 63) === 0) return this;
                else if (x < 32) return _(this.low >>> x | this.high << 32 - x, this.high >> x, this.unsigned);
                else return _(this.high >> x - 32, this.high >= 0 ? 0 : -1, this.unsigned)
            }, b.shr = b.shiftRight, b.shiftRightUnsigned = function(x) {
                if (Y(x)) x = x.toInt();
                if ((x &= 63) === 0) return this;
                if (x < 32) return _(this.low >>> x | this.high << 32 - x, this.high >>> x, this.unsigned);
                if (x === 32) return _(this.high, 0, this.unsigned);
                return _(this.high >>> x - 32, 0, this.unsigned)
            }, b.shru = b.shiftRightUnsigned, b.shr_u = b.shiftRightUnsigned, b.rotateLeft = function(x) {
                var p;
                if (Y(x)) x = x.toInt();
                if ((x &= 63) === 0) return this;
                if (x === 32) return _(this.high, this.low, this.unsigned);
                if (x < 32) return p = 32 - x, _(this.low << x | this.high >>> p, this.high << x | this.low >>> p, this.unsigned);
                return x -= 32, p = 32 - x, _(this.high << x | this.low >>> p, this.low << x | this.high >>> p, this.unsigned)
            }, b.rotl = b.rotateLeft, b.rotateRight = function(x) {
                var p;
                if (Y(x)) x = x.toInt();
                if ((x &= 63) === 0) return this;
                if (x === 32) return _(this.high, this.low, this.unsigned);
                if (x < 32) return p = 32 - x, _(this.high << p | this.low >>> x, this.low << p | this.high >>> x, this.unsigned);
                return x -= 32, p = 32 - x, _(this.low << p | this.high >>> x, this.high << p | this.low >>> x, this.unsigned)
            }, b.rotr = b.rotateRight, b.toSigned = function() {
                if (!this.unsigned) return this;
                return _(this.low, this.high, !1)
            }, b.toUnsigned = function() {
                if (this.unsigned) return this;
                return _(this.low, this.high, !0)
            }, b.toBytes = function(x) {
                return x ? this.toBytesLE() : this.toBytesBE()
            }, b.toBytesLE = function() {
                var x = this.high,
                    p = this.low;
                return [p & 255, p >>> 8 & 255, p >>> 16 & 255, p >>> 24, x & 255, x >>> 8 & 255, x >>> 16 & 255, x >>> 24]
            }, b.toBytesBE = function() {
                var x = this.high,
                    p = this.low;
                return [x >>> 24, x >>> 16 & 255, x >>> 8 & 255, x & 255, p >>> 24, p >>> 16 & 255, p >>> 8 & 255, p & 255]
            }, K.fromBytes = function(x, p, l) {
                return l ? K.fromBytesLE(x, p) : K.fromBytesBE(x, p)
            }, K.fromBytesLE = function(x, p) {
                return new K(x[0] | x[1] << 8 | x[2] << 16 | x[3] << 24, x[4] | x[5] << 8 | x[6] << 16 | x[7] << 24, p)
            }, K.fromBytesBE = function(x, p) {
                return new K(x[4] << 24 | x[5] << 16 | x[6] << 8 | x[7], x[0] << 24 | x[1] << 16 | x[2] << 8 | x[3], p)
            }, typeof BigInt === "function") K.fromBigInt = function(x, p) {
            var l = Number(BigInt.asIntN(32, x)),
                r = Number(BigInt.asIntN(32, x >> BigInt(32)));
            return _(l, r, p)
        }, K.fromValue = function(x, p) {
            if (typeof x === "bigint") return fromBigInt(x, p);
            return D(x, p)
        }, b.toBigInt = function() {
            var x = BigInt(this.low >>> 0),
                p = BigInt(this.unsigned ? this.high >>> 0 : this.high);
            return p << BigInt(32) | x
        };
        var g = A.default = K
    })
})
// @from(Ln 293887, Col 4)
KVA = R((Ef4) => {
    Object.defineProperty(Ef4, "__esModule", {
        value: !0
    });
    Ef4.loadFileDescriptorSetFromObject = Ef4.loadFileDescriptorSetFromBuffer = Ef4.fromJSON = Ef4.loadSync = Ef4.load = Ef4.IdempotencyLevel = Ef4.isAnyExtension = Ef4.Long = void 0;
    var YwY = qZ4(),
        Jm = _06(),
        AVA = Of4(),
        qVA = Gf4(),
        zwY = Zf4();
    Ef4.Long = zwY;

    function wwY(A) {
        return "@type" in A && typeof A["@type"] === "string"
    }
    Ef4.isAnyExtension = wwY;
    var Vf4;
    (function(A) {
        A.IDEMPOTENCY_UNKNOWN = "IDEMPOTENCY_UNKNOWN", A.NO_SIDE_EFFECTS = "NO_SIDE_EFFECTS", A.IDEMPOTENT = "IDEMPOTENT"
    })(Vf4 = Ef4.IdempotencyLevel || (Ef4.IdempotencyLevel = {}));
    var Nf4 = {
        longs: String,
        enums: String,
        bytes: String,
        defaults: !0,
        oneofs: !0,
        json: !0
    };

    function HwY(A, q) {
        if (A === "") return q;
        else return A + "." + q
    }

    function $wY(A) {
        return A instanceof Jm.Service || A instanceof Jm.Type || A instanceof Jm.Enum
    }

    function OwY(A) {
        return A instanceof Jm.Namespace || A instanceof Jm.Root
    }

    function Tf4(A, q) {
        let K = HwY(q, A.name);
        if ($wY(A)) return [
            [K, A]
        ];
        else if (OwY(A) && typeof A.nested < "u") return Object.keys(A.nested).map((Y) => {
            return Tf4(A.nested[Y], K)
        }).reduce((Y, z) => Y.concat(z), []);
        return []
    }

    function sfA(A, q) {
        return function(Y) {
            return A.toObject(A.decode(Y), q)
        }
    }

    function tfA(A) {
        return function(K) {
            if (Array.isArray(K)) throw Error(`Failed to serialize message: expected object with ${A.name} structure, got array instead`);
            let Y = A.fromObject(K);
            return A.encode(Y).finish()
        }
    }

    function _wY(A) {
        return (A || []).reduce((q, K) => {
            for (let [Y, z] of Object.entries(K)) switch (Y) {
                case "uninterpreted_option":
                    q.uninterpreted_option.push(K.uninterpreted_option);
                    break;
                default:
                    q[Y] = z
            }
            return q
        }, {
            deprecated: !1,
            idempotency_level: Vf4.IDEMPOTENCY_UNKNOWN,
            uninterpreted_option: []
        })
    }

    function JwY(A, q, K, Y) {
        let {
            resolvedRequestType: z,
            resolvedResponseType: w
        } = A;
        return {
            path: "/" + q + "/" + A.name,
            requestStream: !!A.requestStream,
            responseStream: !!A.responseStream,
            requestSerialize: tfA(z),
            requestDeserialize: sfA(z, K),
            responseSerialize: tfA(w),
            responseDeserialize: sfA(w, K),
            originalName: YwY(A.name),
            requestType: efA(z, K, Y),
            responseType: efA(w, K, Y),
            options: _wY(A.parsedOptions)
        }
    }

    function XwY(A, q, K, Y) {
        let z = {};
        for (let w of A.methodsArray) z[w.name] = JwY(w, q, K, Y);
        return z
    }

    function efA(A, q, K) {
        let Y = A.toDescriptor("proto3");
        return {
            format: "Protocol Buffer 3 DescriptorProto",
            type: Y.$type.toObject(Y, Nf4),
            fileDescriptorProtos: K,
            serialize: tfA(A),
            deserialize: sfA(A, q)
        }
    }

    function DwY(A, q) {
        let K = A.toDescriptor("proto3");
        return {
            format: "Protocol Buffer 3 EnumDescriptorProto",
            type: K.$type.toObject(K, Nf4),
            fileDescriptorProtos: q
        }
    }

    function jwY(A, q, K, Y) {
        if (A instanceof Jm.Service) return XwY(A, q, K, Y);
        else if (A instanceof Jm.Type) return efA(A, K, Y);
        else if (A instanceof Jm.Enum) return DwY(A, Y);
        else throw Error("Type mismatch in reflection object handling")
    }

    function D06(A, q) {
        let K = {};
        A.resolveAll();
        let z = A.toDescriptor("proto3").file.map((w) => Buffer.from(AVA.FileDescriptorProto.encode(w).finish()));
        for (let [w, H] of Tf4(A, "")) K[w] = jwY(H, w, q, z);
        return K
    }

    function vf4(A, q) {
        q = q || {};
        let K = Jm.Root.fromDescriptor(A);
        return K.resolveAll(), D06(K, q)
    }

    function MwY(A, q) {
        return (0, qVA.loadProtosWithOptions)(A, q).then((K) => {
            return D06(K, q)
        })
    }
    Ef4.load = MwY;

    function PwY(A, q) {
        let K = (0, qVA.loadProtosWithOptionsSync)(A, q);
        return D06(K, q)
    }
    Ef4.loadSync = PwY;

    function WwY(A, q) {
        q = q || {};
        let K = Jm.Root.fromJSON(A);
        return K.resolveAll(), D06(K, q)
    }
    Ef4.fromJSON = WwY;

    function GwY(A, q) {
        let K = AVA.FileDescriptorSet.decode(A);
        return vf4(K, q)
    }
    Ef4.loadFileDescriptorSetFromBuffer = GwY;

    function ZwY(A, q) {
        let K = AVA.FileDescriptorSet.fromObject(A);
        return vf4(K, q)
    }
    Ef4.loadFileDescriptorSetFromObject = ZwY;
    (0, qVA.addCommonProtos)()
})
// @from(Ln 294071, Col 4)
hs = R((Qf4) => {
    var __dirname = "/home/runner/code/tmp/claude-cli-external-build-2245/node_modules/@grpc/grpc-js/build/src";
    Object.defineProperty(Qf4, "__esModule", {
        value: !0
    });
    Qf4.registerChannelzSocket = Qf4.registerChannelzServer = Qf4.registerChannelzSubchannel = Qf4.registerChannelzChannel = Qf4.ChannelzCallTrackerStub = Qf4.ChannelzCallTracker = Qf4.ChannelzChildrenTrackerStub = Qf4.ChannelzChildrenTracker = Qf4.ChannelzTrace = Qf4.ChannelzTraceStub = void 0;
    Qf4.unregisterChannelzRef = CwY;
    Qf4.getChannelzHandlers = mf4;
    Qf4.getChannelzServiceDefinition = Ff4;
    Qf4.setup = gwY;
    var M06 = h1("net"),
        h31 = YG4(),
        am1 = FZ(),
        sm1 = w9(),
        kwY = $N(),
        LwY = gD6(),
        RwY = pD6();

    function YVA(A) {
        return {
            channel_id: A.id,
            name: A.name
        }
    }

    function zVA(A) {
        return {
            subchannel_id: A.id,
            name: A.name
        }
    }

    function ywY(A) {
        return {
            server_id: A.id
        }
    }

    function P06(A) {
        return {
            socket_id: A.id,
            name: A.name
        }
    }
    var Lf4 = 32,
        wVA = 100;
    class Sf4 {
        constructor() {
            this.events = [], this.creationTimestamp = new Date, this.eventsLogged = 0
        }
        addTrace() {}
        getTraceMessage() {
            return {
                creation_timestamp: Xm(this.creationTimestamp),
                num_events_logged: this.eventsLogged,
                events: []
            }
        }
    }
    Qf4.ChannelzTraceStub = Sf4;
    class hf4 {
        constructor() {
            this.events = [], this.eventsLogged = 0, this.creationTimestamp = new Date
        }
        addTrace(A, q, K) {
            let Y = new Date;
            if (this.events.push({
                    description: q,
                    severity: A,
                    timestamp: Y,
                    childChannel: (K === null || K === void 0 ? void 0 : K.kind) === "channel" ? K : void 0,
                    childSubchannel: (K === null || K === void 0 ? void 0 : K.kind) === "subchannel" ? K : void 0
                }), this.events.length >= Lf4 * 2) this.events = this.events.slice(Lf4);
            this.eventsLogged += 1
        }
        getTraceMessage() {
            return {
                creation_timestamp: Xm(this.creationTimestamp),
                num_events_logged: this.eventsLogged,
                events: this.events.map((A) => {
                    return {
                        description: A.description,
                        severity: A.severity,
                        timestamp: Xm(A.timestamp),
                        channel_ref: A.childChannel ? YVA(A.childChannel) : null,
                        subchannel_ref: A.childSubchannel ? zVA(A.childSubchannel) : null
                    }
                })
            }
        }
    }
    Qf4.ChannelzTrace = hf4;
    class HVA {
        constructor() {
            this.channelChildren = new h31.OrderedMap, this.subchannelChildren = new h31.OrderedMap, this.socketChildren = new h31.OrderedMap, this.trackerMap = {
                ["channel"]: this.channelChildren,
                ["subchannel"]: this.subchannelChildren,
                ["socket"]: this.socketChildren
            }
        }
        refChild(A) {
            let q = this.trackerMap[A.kind],
                K = q.find(A.id);
            if (K.equals(q.end())) q.setElement(A.id, {
                ref: A,
                count: 1
            }, K);
            else K.pointer[1].count += 1
        }
        unrefChild(A) {
            let q = this.trackerMap[A.kind],
                K = q.getElementByKey(A.id);
            if (K !== void 0) {
                if (K.count -= 1, K.count === 0) q.eraseElementByKey(A.id)
            }
        }
        getChildLists() {
            return {
                channels: this.channelChildren,
                subchannels: this.subchannelChildren,
                sockets: this.socketChildren
            }
        }
    }
    Qf4.ChannelzChildrenTracker = HVA;
    class If4 extends HVA {
        refChild() {}
        unrefChild() {}
    }
    Qf4.ChannelzChildrenTrackerStub = If4;
    class $VA {
        constructor() {
            this.callsStarted = 0, this.callsSucceeded = 0, this.callsFailed = 0, this.lastCallStartedTimestamp = null
        }
        addCallStarted() {
            this.callsStarted += 1, this.lastCallStartedTimestamp = new Date
        }
        addCallSucceeded() {
            this.callsSucceeded += 1
        }
        addCallFailed() {
            this.callsFailed += 1
        }
    }
    Qf4.ChannelzCallTracker = $VA;
    class xf4 extends $VA {
        addCallStarted() {}
        addCallSucceeded() {}
        addCallFailed() {}
    }
    Qf4.ChannelzCallTrackerStub = xf4;
    var Xd = {
            ["channel"]: new h31.OrderedMap,
            ["subchannel"]: new h31.OrderedMap,
            ["server"]: new h31.OrderedMap,
            ["socket"]: new h31.OrderedMap
        },
        W06 = (A) => {
            let q = 1;

            function K() {
                return q++
            }
            let Y = Xd[A];
            return (z, w, H) => {
                let $ = K(),
                    O = {
                        id: $,
                        name: z,
                        kind: A
                    };
                if (H) Y.setElement($, {
                    ref: O,
                    getInfo: w
                });
                return O
            }
        };
    Qf4.registerChannelzChannel = W06("channel");
    Qf4.registerChannelzSubchannel = W06("subchannel");
    Qf4.registerChannelzServer = W06("server");
    Qf4.registerChannelzSocket = W06("socket");

    function CwY(A) {
        Xd[A.kind].eraseElementByKey(A.id)
    }

    function SwY(A) {
        let q = Number.parseInt(A, 16);
        return [q / 256 | 0, q % 256]
    }

    function Rf4(A) {
        if (A === "") return [];
        let q = A.split(":").map((Y) => SwY(Y));
        return [].concat(...q)
    }

    function hwY(A) {
        return (0, M06.isIPv6)(A) && A.toLowerCase().startsWith("::ffff:") && (0, M06.isIPv4)(A.substring(7))
    }

    function yf4(A) {
        return Buffer.from(Uint8Array.from(A.split(".").map((q) => Number.parseInt(q))))
    }

    function IwY(A) {
        if ((0, M06.isIPv4)(A)) return yf4(A);
        else if (hwY(A)) return yf4(A.substring(7));
        else if ((0, M06.isIPv6)(A)) {
            let q, K, Y = A.indexOf("::");
            if (Y === -1) q = A, K = "";
            else q = A.substring(0, Y), K = A.substring(Y + 2);
            let z = Buffer.from(Rf4(q)),
                w = Buffer.from(Rf4(K)),
                H = Buffer.alloc(16 - z.length - w.length, 0);
            return Buffer.concat([z, H, w])
        } else return null
    }

    function bf4(A) {
        switch (A) {
            case am1.ConnectivityState.CONNECTING:
                return {
                    state: "CONNECTING"
                };
            case am1.ConnectivityState.IDLE:
                return {
                    state: "IDLE"
                };
            case am1.ConnectivityState.READY:
                return {
                    state: "READY"
                };
            case am1.ConnectivityState.SHUTDOWN:
                return {
                    state: "SHUTDOWN"
                };
            case am1.ConnectivityState.TRANSIENT_FAILURE:
                return {
                    state: "TRANSIENT_FAILURE"
                };
            default:
                return {
                    state: "UNKNOWN"
                }
        }
    }

    function Xm(A) {
        if (!A) return null;
        let q = A.getTime();
        return {
            seconds: q / 1000 | 0,
            nanos: q % 1000 * 1e6
        }
    }

    function uf4(A) {
        let q = A.getInfo(),
            K = [],
            Y = [];
        return q.children.channels.forEach((z) => {
            K.push(YVA(z[1].ref))
        }), q.children.subchannels.forEach((z) => {
            Y.push(zVA(z[1].ref))
        }), {
            ref: YVA(A.ref),
            data: {
                target: q.target,
                state: bf4(q.state),
                calls_started: q.callTracker.callsStarted,
                calls_succeeded: q.callTracker.callsSucceeded,
                calls_failed: q.callTracker.callsFailed,
                last_call_started_timestamp: Xm(q.callTracker.lastCallStartedTimestamp),
                trace: q.trace.getTraceMessage()
            },
            channel_ref: K,
            subchannel_ref: Y
        }
    }

    function xwY(A, q) {
        let K = parseInt(A.request.channel_id, 10),
            Y = Xd.channel.getElementByKey(K);
        if (Y === void 0) {
            q({
                code: sm1.Status.NOT_FOUND,
                details: "No channel data found for id " + K
            });
            return
        }
        q(null, {
            channel: uf4(Y)
        })
    }

    function bwY(A, q) {
        let K = parseInt(A.request.max_results, 10) || wVA,
            Y = [],
            z = parseInt(A.request.start_channel_id, 10),
            w = Xd.channel,
            H;
        for (H = w.lowerBound(z); !H.equals(w.end()) && Y.length < K; H = H.next()) Y.push(uf4(H.pointer[1]));
        q(null, {
            channel: Y,
            end: H.equals(w.end())
        })
    }

    function Bf4(A) {
        let q = A.getInfo(),
            K = [];
        return q.listenerChildren.sockets.forEach((Y) => {
            K.push(P06(Y[1].ref))
        }), {
            ref: ywY(A.ref),
            data: {
                calls_started: q.callTracker.callsStarted,
                calls_succeeded: q.callTracker.callsSucceeded,
                calls_failed: q.callTracker.callsFailed,
                last_call_started_timestamp: Xm(q.callTracker.lastCallStartedTimestamp),
                trace: q.trace.getTraceMessage()
            },
            listen_socket: K
        }
    }

    function uwY(A, q) {
        let K = parseInt(A.request.server_id, 10),
            z = Xd.server.getElementByKey(K);
        if (z === void 0) {
            q({
                code: sm1.Status.NOT_FOUND,
                details: "No server data found for id " + K
            });
            return
        }
        q(null, {
            server: Bf4(z)
        })
    }

    function BwY(A, q) {
        let K = parseInt(A.request.max_results, 10) || wVA,
            Y = parseInt(A.request.start_server_id, 10),
            z = Xd.server,
            w = [],
            H;
        for (H = z.lowerBound(Y); !H.equals(z.end()) && w.length < K; H = H.next()) w.push(Bf4(H.pointer[1]));
        q(null, {
            server: w,
            end: H.equals(z.end())
        })
    }

    function mwY(A, q) {
        let K = parseInt(A.request.subchannel_id, 10),
            Y = Xd.subchannel.getElementByKey(K);
        if (Y === void 0) {
            q({
                code: sm1.Status.NOT_FOUND,
                details: "No subchannel data found for id " + K
            });
            return
        }
        let z = Y.getInfo(),
            w = [];
        z.children.sockets.forEach(($) => {
            w.push(P06($[1].ref))
        });
        let H = {
            ref: zVA(Y.ref),
            data: {
                target: z.target,
                state: bf4(z.state),
                calls_started: z.callTracker.callsStarted,
                calls_succeeded: z.callTracker.callsSucceeded,
                calls_failed: z.callTracker.callsFailed,
                last_call_started_timestamp: Xm(z.callTracker.lastCallStartedTimestamp),
                trace: z.trace.getTraceMessage()
            },
            socket_ref: w
        };
        q(null, {
            subchannel: H
        })
    }

    function Cf4(A) {
        var q;
        if ((0, kwY.isTcpSubchannelAddress)(A)) return {
            address: "tcpip_address",
            tcpip_address: {
                ip_address: (q = IwY(A.host)) !== null && q !== void 0 ? q : void 0,
                port: A.port
            }
        };
        else return {
            address: "uds_address",
            uds_address: {
                filename: A.path
            }
        }
    }

    function FwY(A, q) {
        var K, Y, z, w, H;
        let $ = parseInt(A.request.socket_id, 10),
            O = Xd.socket.getElementByKey($);
        if (O === void 0) {
            q({
                code: sm1.Status.NOT_FOUND,
                details: "No socket data found for id " + $
            });
            return
        }
        let _ = O.getInfo(),
            J = _.security ? {
                model: "tls",
                tls: {
                    cipher_suite: _.security.cipherSuiteStandardName ? "standard_name" : "other_name",
                    standard_name: (K = _.security.cipherSuiteStandardName) !== null && K !== void 0 ? K : void 0,
                    other_name: (Y = _.security.cipherSuiteOtherName) !== null && Y !== void 0 ? Y : void 0,
                    local_certificate: (z = _.security.localCertificate) !== null && z !== void 0 ? z : void 0,
                    remote_certificate: (w = _.security.remoteCertificate) !== null && w !== void 0 ? w : void 0
                }
            } : null,
            X = {
                ref: P06(O.ref),
                local: _.localAddress ? Cf4(_.localAddress) : null,
                remote: _.remoteAddress ? Cf4(_.remoteAddress) : null,
                remote_name: (H = _.remoteName) !== null && H !== void 0 ? H : void 0,
                security: J,
                data: {
                    keep_alives_sent: _.keepAlivesSent,
                    streams_started: _.streamsStarted,
                    streams_succeeded: _.streamsSucceeded,
                    streams_failed: _.streamsFailed,
                    last_local_stream_created_timestamp: Xm(_.lastLocalStreamCreatedTimestamp),
                    last_remote_stream_created_timestamp: Xm(_.lastRemoteStreamCreatedTimestamp),
                    messages_received: _.messagesReceived,
                    messages_sent: _.messagesSent,
                    last_message_received_timestamp: Xm(_.lastMessageReceivedTimestamp),
                    last_message_sent_timestamp: Xm(_.lastMessageSentTimestamp),
                    local_flow_control_window: _.localFlowControlWindow ? {
                        value: _.localFlowControlWindow
                    } : null,
                    remote_flow_control_window: _.remoteFlowControlWindow ? {
                        value: _.remoteFlowControlWindow
                    } : null
                }
            };
        q(null, {
            socket: X
        })
    }

    function QwY(A, q) {
        let K = parseInt(A.request.server_id, 10),
            Y = Xd.server.getElementByKey(K);
        if (Y === void 0) {
            q({
                code: sm1.Status.NOT_FOUND,
                details: "No server data found for id " + K
            });
            return
        }
        let z = parseInt(A.request.start_socket_id, 10),
            w = parseInt(A.request.max_results, 10) || wVA,
            $ = Y.getInfo().sessionChildren.sockets,
            O = [],
            _;
        for (_ = $.lowerBound(z); !_.equals($.end()) && O.length < w; _ = _.next()) O.push(P06(_.pointer[1].ref));
        q(null, {
            socket_ref: O,
            end: _.equals($.end())
        })
    }

    function mf4() {
        return {
            GetChannel: xwY,
            GetTopChannels: bwY,
            GetServer: uwY,
            GetServers: BwY,
            GetSubchannel: mwY,
            GetSocket: FwY,
            GetServerSockets: QwY
        }
    }
    var j06 = null;

    function Ff4() {
        if (j06) return j06;
        let A = KVA().loadSync,
            q = A("channelz.proto", {
                keepCase: !0,
                longs: String,
                enums: String,
                defaults: !0,
                oneofs: !0,
                includeDirs: [`${__dirname}/../../proto`]
            });
        return j06 = (0, RwY.loadPackageDefinition)(q).grpc.channelz.v1.Channelz.service, j06
    }

    function gwY() {
        (0, LwY.registerAdminService)(Ff4, mf4)
    }
})
// @from(Ln 294582, Col 4)
G06 = R((Uf4) => {
    Object.defineProperty(Uf4, "__esModule", {
        value: !0
    });
    Uf4.getNextCallNumber = qHY;
    var AHY = 0;

    function qHY() {
        return AHY++
    }
})
// @from(Ln 294593, Col 4)
OVA = R((df4) => {
    Object.defineProperty(df4, "__esModule", {
        value: !0
    });
    df4.CompressionAlgorithms = void 0;
    var pf4;
    (function(A) {
        A[A.identity = 0] = "identity", A[A.deflate = 1] = "deflate", A[A.gzip = 2] = "gzip"
    })(pf4 || (df4.CompressionAlgorithms = pf4 = {}))
})
// @from(Ln 294603, Col 4)
_VA = R((if4) => {
    Object.defineProperty(if4, "__esModule", {
        value: !0
    });
    if4.BaseFilter = void 0;
    class lf4 {
        async sendMetadata(A) {
            return A
        }
        receiveMetadata(A) {
            return A
        }
        async sendMessage(A) {
            return A
        }
        async receiveMessage(A) {
            return A
        }
        receiveTrailers(A) {
            return A
        }
    }
    if4.BaseFilter = lf4
})
// @from(Ln 294627, Col 4)
XVA = R((AV4) => {
    Object.defineProperty(AV4, "__esModule", {
        value: !0
    });
    AV4.CompressionFilterFactory = AV4.CompressionFilter = void 0;
    var Z06 = h1("zlib"),
        of4 = OVA(),
        eM1 = w9(),
        YHY = _VA(),
        zHY = mw(),
        wHY = (A) => {
            return typeof A === "number" && typeof of4.CompressionAlgorithms[A] === "string"
        };
    class tm1 {
        async writeMessage(A, q) {
            let K = A;
            if (q) K = await this.compressMessage(K);
            let Y = Buffer.allocUnsafe(K.length + 5);
            return Y.writeUInt8(q ? 1 : 0, 0), Y.writeUInt32BE(K.length, 1), K.copy(Y, 5), Y
        }
        async readMessage(A) {
            let q = A.readUInt8(0) === 1,
                K = A.slice(5);
            if (q) K = await this.decompressMessage(K);
            return K
        }
    }
    class AP1 extends tm1 {
        async compressMessage(A) {
            return A
        }
        async writeMessage(A, q) {
            let K = Buffer.allocUnsafe(A.length + 5);
            return K.writeUInt8(0, 0), K.writeUInt32BE(A.length, 1), A.copy(K, 5), K
        }
        decompressMessage(A) {
            return Promise.reject(Error('Received compressed message but "grpc-encoding" header was identity'))
        }
    }
    class af4 extends tm1 {
        constructor(A) {
            super();
            this.maxRecvMessageLength = A
        }
        compressMessage(A) {
            return new Promise((q, K) => {
                Z06.deflate(A, (Y, z) => {
                    if (Y) K(Y);
                    else q(z)
                })
            })
        }
        decompressMessage(A) {
            return new Promise((q, K) => {
                let Y = 0,
                    z = [],
                    w = Z06.createInflate();
                w.on("data", (H) => {
                    if (z.push(H), Y += H.byteLength, this.maxRecvMessageLength !== -1 && Y > this.maxRecvMessageLength) w.destroy(), K({
                        code: eM1.Status.RESOURCE_EXHAUSTED,
                        details: `Received message that decompresses to a size larger than ${this.maxRecvMessageLength}`
                    })
                }), w.on("end", () => {
                    q(Buffer.concat(z))
                }), w.write(A), w.end()
            })
        }
    }
    class sf4 extends tm1 {
        constructor(A) {
            super();
            this.maxRecvMessageLength = A
        }
        compressMessage(A) {
            return new Promise((q, K) => {
                Z06.gzip(A, (Y, z) => {
                    if (Y) K(Y);
                    else q(z)
                })
            })
        }
        decompressMessage(A) {
            return new Promise((q, K) => {
                let Y = 0,
                    z = [],
                    w = Z06.createGunzip();
                w.on("data", (H) => {
                    if (z.push(H), Y += H.byteLength, this.maxRecvMessageLength !== -1 && Y > this.maxRecvMessageLength) w.destroy(), K({
                        code: eM1.Status.RESOURCE_EXHAUSTED,
                        details: `Received message that decompresses to a size larger than ${this.maxRecvMessageLength}`
                    })
                }), w.on("end", () => {
                    q(Buffer.concat(z))
                }), w.write(A), w.end()
            })
        }
    }
    class tf4 extends tm1 {
        constructor(A) {
            super();
            this.compressionName = A
        }
        compressMessage(A) {
            return Promise.reject(Error(`Received message compressed with unsupported compression method ${this.compressionName}`))
        }
        decompressMessage(A) {
            return Promise.reject(Error(`Compression method not supported: ${this.compressionName}`))
        }
    }

    function rf4(A, q) {
        switch (A) {
            case "identity":
                return new AP1;
            case "deflate":
                return new af4(q);
            case "gzip":
                return new sf4(q);
            default:
                return new tf4(A)
        }
    }
    class JVA extends YHY.BaseFilter {
        constructor(A, q) {
            var K, Y, z;
            super();
            this.sharedFilterConfig = q, this.sendCompression = new AP1, this.receiveCompression = new AP1, this.currentCompressionAlgorithm = "identity";
            let w = A["grpc.default_compression_algorithm"];
            if (this.maxReceiveMessageLength = (K = A["grpc.max_receive_message_length"]) !== null && K !== void 0 ? K : eM1.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH, this.maxSendMessageLength = (Y = A["grpc.max_send_message_length"]) !== null && Y !== void 0 ? Y : eM1.DEFAULT_MAX_SEND_MESSAGE_LENGTH, w !== void 0)
                if (wHY(w)) {
                    let H = of4.CompressionAlgorithms[w],
                        $ = (z = q.serverSupportedEncodingHeader) === null || z === void 0 ? void 0 : z.split(",");
                    if (!$ || $.includes(H)) this.currentCompressionAlgorithm = H, this.sendCompression = rf4(this.currentCompressionAlgorithm, -1)
                } else zHY.log(eM1.LogVerbosity.ERROR, `Invalid value provided for grpc.default_compression_algorithm option: ${w}`)
        }
        async sendMetadata(A) {
            let q = await A;
            if (q.set("grpc-accept-encoding", "identity,deflate,gzip"), q.set("accept-encoding", "identity"), this.currentCompressionAlgorithm === "identity") q.remove("grpc-encoding");
            else q.set("grpc-encoding", this.currentCompressionAlgorithm);
            return q
        }
        receiveMetadata(A) {
            let q = A.get("grpc-encoding");
            if (q.length > 0) {
                let Y = q[0];
                if (typeof Y === "string") this.receiveCompression = rf4(Y, this.maxReceiveMessageLength)
            }
            A.remove("grpc-encoding");
            let K = A.get("grpc-accept-encoding")[0];
            if (K) {
                if (this.sharedFilterConfig.serverSupportedEncodingHeader = K, !K.split(",").includes(this.currentCompressionAlgorithm)) this.sendCompression = new AP1, this.currentCompressionAlgorithm = "identity"
            }
            return A.remove("grpc-accept-encoding"), A
        }
        async sendMessage(A) {
            var q;
            let K = await A;
            if (this.maxSendMessageLength !== -1 && K.message.length > this.maxSendMessageLength) throw {
                code: eM1.Status.RESOURCE_EXHAUSTED,
                details: `Attempted to send message with a size larger than ${this.maxSendMessageLength}`
            };
            let Y;
            if (this.sendCompression instanceof AP1) Y = !1;
            else Y = (((q = K.flags) !== null && q !== void 0 ? q : 0) & 2) === 0;
            return {
                message: await this.sendCompression.writeMessage(K.message, Y),
                flags: K.flags
            }
        }
        async receiveMessage(A) {
            return this.receiveCompression.readMessage(await A)
        }
    }
    AV4.CompressionFilter = JVA;
    class ef4 {
        constructor(A, q) {
            this.options = q, this.sharedFilterConfig = {}
        }
        createFilter() {
            return new JVA(this.options, this.sharedFilterConfig)
        }
    }
    AV4.CompressionFilterFactory = ef4
})
// @from(Ln 294811, Col 4)
em1 = R((KV4) => {
    Object.defineProperty(KV4, "__esModule", {
        value: !0
    });
    KV4.restrictControlPlaneStatusCode = OHY;
    var Dm = w9(),
        $HY = [Dm.Status.OK, Dm.Status.INVALID_ARGUMENT, Dm.Status.NOT_FOUND, Dm.Status.ALREADY_EXISTS, Dm.Status.FAILED_PRECONDITION, Dm.Status.ABORTED, Dm.Status.OUT_OF_RANGE, Dm.Status.DATA_LOSS];

    function OHY(A, q) {
        if ($HY.includes(A)) return {
            code: Dm.Status.INTERNAL,
            details: `Invalid status from control plane: ${A} ${Dm.Status[A]} ${q}`
        };
        else return {
            code: A,
            details: q
        }
    }
})
// @from(Ln 294830, Col 4)
qP1 = R((YV4) => {
    Object.defineProperty(YV4, "__esModule", {
        value: !0
    });
    YV4.minDeadline = JHY;
    YV4.getDeadlineTimeoutString = DHY;
    YV4.getRelativeTimeout = MHY;
    YV4.deadlineToString = PHY;
    YV4.formatDateDifference = WHY;

    function JHY(...A) {
        let q = 1 / 0;
        for (let K of A) {
            let Y = K instanceof Date ? K.getTime() : K;
            if (Y < q) q = Y
        }
        return q
    }
    var XHY = [
        ["m", 1],
        ["S", 1000],
        ["M", 60000],
        ["H", 3600000]
    ];

    function DHY(A) {
        let q = new Date().getTime();
        if (A instanceof Date) A = A.getTime();
        let K = Math.max(A - q, 0);
        for (let [Y, z] of XHY) {
            let w = K / z;
            if (w < 1e8) return String(Math.ceil(w)) + Y
        }
        throw Error("Deadline is too far in the future")
    }
    var jHY = 2147483647;

    function MHY(A) {
        let q = A instanceof Date ? A.getTime() : A,
            K = new Date().getTime(),
            Y = q - K;
        if (Y < 0) return 0;
        else if (Y > jHY) return 1 / 0;
        else return Y
    }

    function PHY(A) {
        if (A instanceof Date) return A.toISOString();
        else {
            let q = new Date(A);
            if (Number.isNaN(q.getTime())) return "" + A;
            else return q.toISOString()
        }
    }

    function WHY(A, q) {
        return ((q.getTime() - A.getTime()) / 1000).toFixed(3) + "s"
    }
})
// @from(Ln 294889, Col 4)
f06 = R((zV4) => {
    Object.defineProperty(zV4, "__esModule", {
        value: !0
    });
    zV4.FilterStackFactory = zV4.FilterStack = void 0;
    class DVA {
        constructor(A) {
            this.filters = A
        }
        sendMetadata(A) {
            let q = A;
            for (let K = 0; K < this.filters.length; K++) q = this.filters[K].sendMetadata(q);
            return q
        }
        receiveMetadata(A) {
            let q = A;
            for (let K = this.filters.length - 1; K >= 0; K--) q = this.filters[K].receiveMetadata(q);
            return q
        }
        sendMessage(A) {
            let q = A;
            for (let K = 0; K < this.filters.length; K++) q = this.filters[K].sendMessage(q);
            return q
        }
        receiveMessage(A) {
            let q = A;
            for (let K = this.filters.length - 1; K >= 0; K--) q = this.filters[K].receiveMessage(q);
            return q
        }
        receiveTrailers(A) {
            let q = A;
            for (let K = this.filters.length - 1; K >= 0; K--) q = this.filters[K].receiveTrailers(q);
            return q
        }
        push(A) {
            this.filters.unshift(...A)
        }
        getFilters() {
            return this.filters
        }
    }
    zV4.FilterStack = DVA;
    class jVA {
        constructor(A) {
            this.factories = A
        }
        push(A) {
            this.factories.unshift(...A)
        }
        clone() {
            return new jVA([...this.factories])
        }
        createFilter() {
            return new DVA(this.factories.map((A) => A.createFilter()))
        }
    }
    zV4.FilterStackFactory = jVA
})
// @from(Ln 294947, Col 4)
JV4 = R((OV4) => {
    Object.defineProperty(OV4, "__esModule", {
        value: !0
    });
    OV4.SingleSubchannelChannel = void 0;
    var vHY = G06(),
        AF1 = hs(),
        EHY = XVA(),
        kHY = FZ(),
        qF1 = w9(),
        LHY = em1(),
        RHY = qP1(),
        yHY = f06(),
        MVA = Jj(),
        CHY = lh(),
        V06 = mZ();
    class HV4 {
        constructor(A, q, K, Y, z) {
            var w, H;
            this.subchannel = A, this.method = q, this.options = Y, this.callNumber = z, this.childCall = null, this.pendingMessage = null, this.readPending = !1, this.halfClosePending = !1, this.pendingStatus = null, this.readFilterPending = !1, this.writeFilterPending = !1;
            let $ = this.method.split("/"),
                O = "";
            if ($.length >= 2) O = $[1];
            let _ = (H = (w = (0, V06.splitHostPort)(this.options.host)) === null || w === void 0 ? void 0 : w.host) !== null && H !== void 0 ? H : "localhost";
            this.serviceUrl = `https://${_}/${O}`;
            let J = (0, RHY.getRelativeTimeout)(Y.deadline);
            if (J !== 1 / 0)
                if (J <= 0) this.cancelWithStatus(qF1.Status.DEADLINE_EXCEEDED, "Deadline exceeded");
                else setTimeout(() => {
                    this.cancelWithStatus(qF1.Status.DEADLINE_EXCEEDED, "Deadline exceeded")
                }, J);
            this.filterStack = K.createFilter()
        }
        cancelWithStatus(A, q) {
            if (this.childCall) this.childCall.cancelWithStatus(A, q);
            else this.pendingStatus = {
                code: A,
                details: q,
                metadata: new MVA.Metadata
            }
        }
        getPeer() {
            var A, q;
            return (q = (A = this.childCall) === null || A === void 0 ? void 0 : A.getPeer()) !== null && q !== void 0 ? q : this.subchannel.getAddress()
        }
        async start(A, q) {
            if (this.pendingStatus) {
                q.onReceiveStatus(this.pendingStatus);
                return
            }
            if (this.subchannel.getConnectivityState() !== kHY.ConnectivityState.READY) {
                q.onReceiveStatus({
                    code: qF1.Status.UNAVAILABLE,
                    details: "Subchannel not ready",
                    metadata: new MVA.Metadata
                });
                return
            }
            let K = await this.filterStack.sendMetadata(Promise.resolve(A)),
                Y;
            try {
                Y = await this.subchannel.getCallCredentials().generateMetadata({
                    method_name: this.method,
                    service_url: this.serviceUrl
                })
            } catch (w) {
                let H = w,
                    {
                        code: $,
                        details: O
                    } = (0, LHY.restrictControlPlaneStatusCode)(typeof H.code === "number" ? H.code : qF1.Status.UNKNOWN, `Getting metadata from plugin failed with error: ${H.message}`);
                q.onReceiveStatus({
                    code: $,
                    details: O,
                    metadata: new MVA.Metadata
                });
                return
            }
            Y.merge(K);
            let z = {
                onReceiveMetadata: async (w) => {
                    q.onReceiveMetadata(await this.filterStack.receiveMetadata(w))
                },
                onReceiveMessage: async (w) => {
                    this.readFilterPending = !0;
                    let H = await this.filterStack.receiveMessage(w);
                    if (this.readFilterPending = !1, q.onReceiveMessage(H), this.pendingStatus) q.onReceiveStatus(this.pendingStatus)
                },
                onReceiveStatus: async (w) => {
                    let H = await this.filterStack.receiveTrailers(w);
                    if (this.readFilterPending) this.pendingStatus = H;
                    else q.onReceiveStatus(H)
                }
            };
            if (this.childCall = this.subchannel.createCall(Y, this.options.host, this.method, z), this.readPending) this.childCall.startRead();
            if (this.pendingMessage) this.childCall.sendMessageWithContext(this.pendingMessage.context, this.pendingMessage.message);
            if (this.halfClosePending && !this.writeFilterPending) this.childCall.halfClose()
        }
        async sendMessageWithContext(A, q) {
            this.writeFilterPending = !0;
            let K = await this.filterStack.sendMessage(Promise.resolve({
                message: q,
                flags: A.flags
            }));
            if (this.writeFilterPending = !1, this.childCall) {
                if (this.childCall.sendMessageWithContext(A, K.message), this.halfClosePending) this.childCall.halfClose()
            } else this.pendingMessage = {
                context: A,
                message: K.message
            }
        }
        startRead() {
            if (this.childCall) this.childCall.startRead();
            else this.readPending = !0
        }
        halfClose() {
            if (this.childCall && !this.writeFilterPending) this.childCall.halfClose();
            else this.halfClosePending = !0
        }
        getCallNumber() {
            return this.callNumber
        }
        setCredentials(A) {
            throw Error("Method not implemented.")
        }
        getAuthContext() {
            if (this.childCall) return this.childCall.getAuthContext();
            else return null
        }
    }
    class $V4 {
        constructor(A, q, K) {
            if (this.subchannel = A, this.target = q, this.channelzEnabled = !1, this.channelzTrace = new AF1.ChannelzTrace, this.callTracker = new AF1.ChannelzCallTracker, this.childrenTracker = new AF1.ChannelzChildrenTracker, this.channelzEnabled = K["grpc.enable_channelz"] !== 0, this.channelzRef = (0, AF1.registerChannelzChannel)((0, V06.uriToString)(q), () => ({
                    target: `${(0,V06.uriToString)(q)} (${A.getAddress()})`,
                    state: this.subchannel.getConnectivityState(),
                    trace: this.channelzTrace,
                    callTracker: this.callTracker,
                    children: this.childrenTracker.getChildLists()
                }), this.channelzEnabled), this.channelzEnabled) this.childrenTracker.refChild(A.getChannelzRef());
            this.filterStackFactory = new yHY.FilterStackFactory([new EHY.CompressionFilterFactory(this, K)])
        }
        close() {
            if (this.channelzEnabled) this.childrenTracker.unrefChild(this.subchannel.getChannelzRef());
            (0, AF1.unregisterChannelzRef)(this.channelzRef)
        }
        getTarget() {
            return (0, V06.uriToString)(this.target)
        }
        getConnectivityState(A) {
            throw Error("Method not implemented.")
        }
        watchConnectivityState(A, q, K) {
            throw Error("Method not implemented.")
        }
        getChannelzRef() {
            return this.channelzRef
        }
        createCall(A, q) {
            let K = {
                deadline: q,
                host: (0, CHY.getDefaultAuthority)(this.target),
                flags: qF1.Propagate.DEFAULTS,
                parentCall: null
            };
            return new HV4(this.subchannel, A, this.filterStackFactory, K, (0, vHY.getNextCallNumber)())
        }
    }
    OV4.SingleSubchannelChannel = $V4
})
// @from(Ln 295116, Col 4)
MV4 = R((DV4) => {
    Object.defineProperty(DV4, "__esModule", {
        value: !0
    });
    DV4.Subchannel = void 0;
    var _w = FZ(),
        SHY = UM1(),
        PVA = mw(),
        N06 = w9(),
        hHY = mZ(),
        IHY = $N(),
        jm = hs(),
        xHY = JV4(),
        bHY = "subchannel",
        uHY = 2147483647;
    class XV4 {
        constructor(A, q, K, Y, z) {
            var w;
            this.channelTarget = A, this.subchannelAddress = q, this.options = K, this.connector = z, this.connectivityState = _w.ConnectivityState.IDLE, this.transport = null, this.continueConnecting = !1, this.stateListeners = new Set, this.refcount = 0, this.channelzEnabled = !0, this.dataProducers = new Map, this.subchannelChannel = null;
            let H = {
                initialDelay: K["grpc.initial_reconnect_backoff_ms"],
                maxDelay: K["grpc.max_reconnect_backoff_ms"]
            };
            if (this.backoffTimeout = new SHY.BackoffTimeout(() => {
                    this.handleBackoffTimer()
                }, H), this.backoffTimeout.unref(), this.subchannelAddressString = (0, IHY.subchannelAddressToString)(q), this.keepaliveTime = (w = K["grpc.keepalive_time_ms"]) !== null && w !== void 0 ? w : -1, K["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.channelzTrace = new jm.ChannelzTraceStub, this.callTracker = new jm.ChannelzCallTrackerStub, this.childrenTracker = new jm.ChannelzChildrenTrackerStub, this.streamTracker = new jm.ChannelzCallTrackerStub;
            else this.channelzTrace = new jm.ChannelzTrace, this.callTracker = new jm.ChannelzCallTracker, this.childrenTracker = new jm.ChannelzChildrenTracker, this.streamTracker = new jm.ChannelzCallTracker;
            this.channelzRef = (0, jm.registerChannelzSubchannel)(this.subchannelAddressString, () => this.getChannelzInfo(), this.channelzEnabled), this.channelzTrace.addTrace("CT_INFO", "Subchannel created"), this.trace("Subchannel constructed with options " + JSON.stringify(K, void 0, 2)), this.secureConnector = Y._createSecureConnector(A, K)
        }
        getChannelzInfo() {
            return {
                state: this.connectivityState,
                trace: this.channelzTrace,
                callTracker: this.callTracker,
                children: this.childrenTracker.getChildLists(),
                target: this.subchannelAddressString
            }
        }
        trace(A) {
            PVA.trace(N06.LogVerbosity.DEBUG, bHY, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
        }
        refTrace(A) {
            PVA.trace(N06.LogVerbosity.DEBUG, "subchannel_refcount", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
        }
        handleBackoffTimer() {
            if (this.continueConnecting) this.transitionToState([_w.ConnectivityState.TRANSIENT_FAILURE], _w.ConnectivityState.CONNECTING);
            else this.transitionToState([_w.ConnectivityState.TRANSIENT_FAILURE], _w.ConnectivityState.IDLE)
        }
        startBackoff() {
            this.backoffTimeout.runOnce()
        }
        stopBackoff() {
            this.backoffTimeout.stop(), this.backoffTimeout.reset()
        }
        startConnectingInternal() {
            let A = this.options;
            if (A["grpc.keepalive_time_ms"]) {
                let q = Math.min(this.keepaliveTime, uHY);
                A = Object.assign(Object.assign({}, A), {
                    "grpc.keepalive_time_ms": q
                })
            }
            this.connector.connect(this.subchannelAddress, this.secureConnector, A).then((q) => {
                if (this.transitionToState([_w.ConnectivityState.CONNECTING], _w.ConnectivityState.READY)) {
                    if (this.transport = q, this.channelzEnabled) this.childrenTracker.refChild(q.getChannelzRef());
                    q.addDisconnectListener((K) => {
                        if (this.transitionToState([_w.ConnectivityState.READY], _w.ConnectivityState.IDLE), K && this.keepaliveTime > 0) this.keepaliveTime *= 2, PVA.log(N06.LogVerbosity.ERROR, `Connection to ${(0,hHY.uriToString)(this.channelTarget)} at ${this.subchannelAddressString} rejected by server because of excess pings. Increasing ping interval to ${this.keepaliveTime} ms`)
                    })
                } else q.shutdown()
            }, (q) => {
                this.transitionToState([_w.ConnectivityState.CONNECTING], _w.ConnectivityState.TRANSIENT_FAILURE, `${q}`)
            })
        }
        transitionToState(A, q, K) {
            var Y, z;
            if (A.indexOf(this.connectivityState) === -1) return !1;
            if (K) this.trace(_w.ConnectivityState[this.connectivityState] + " -> " + _w.ConnectivityState[q] + ' with error "' + K + '"');
            else this.trace(_w.ConnectivityState[this.connectivityState] + " -> " + _w.ConnectivityState[q]);
            if (this.channelzEnabled) this.channelzTrace.addTrace("CT_INFO", "Connectivity state change to " + _w.ConnectivityState[q]);
            let w = this.connectivityState;
            switch (this.connectivityState = q, q) {
                case _w.ConnectivityState.READY:
                    this.stopBackoff();
                    break;
                case _w.ConnectivityState.CONNECTING:
                    this.startBackoff(), this.startConnectingInternal(), this.continueConnecting = !1;
                    break;
                case _w.ConnectivityState.TRANSIENT_FAILURE:
                    if (this.channelzEnabled && this.transport) this.childrenTracker.unrefChild(this.transport.getChannelzRef());
                    if ((Y = this.transport) === null || Y === void 0 || Y.shutdown(), this.transport = null, !this.backoffTimeout.isRunning()) process.nextTick(() => {
                        this.handleBackoffTimer()
                    });
                    break;
                case _w.ConnectivityState.IDLE:
                    if (this.channelzEnabled && this.transport) this.childrenTracker.unrefChild(this.transport.getChannelzRef());
                    (z = this.transport) === null || z === void 0 || z.shutdown(), this.transport = null;
                    break;
                default:
                    throw Error(`Invalid state: unknown ConnectivityState ${q}`)
            }
            for (let H of this.stateListeners) H(this, w, q, this.keepaliveTime, K);
            return !0
        }
        ref() {
            this.refTrace("refcount " + this.refcount + " -> " + (this.refcount + 1)), this.refcount += 1
        }
        unref() {
            if (this.refTrace("refcount " + this.refcount + " -> " + (this.refcount - 1)), this.refcount -= 1, this.refcount === 0) this.channelzTrace.addTrace("CT_INFO", "Shutting down"), (0, jm.unregisterChannelzRef)(this.channelzRef), this.secureConnector.destroy(), process.nextTick(() => {
                this.transitionToState([_w.ConnectivityState.CONNECTING, _w.ConnectivityState.READY], _w.ConnectivityState.IDLE)
            })
        }
        unrefIfOneRef() {
            if (this.refcount === 1) return this.unref(), !0;
            return !1
        }
        createCall(A, q, K, Y) {
            if (!this.transport) throw Error("Cannot create call, subchannel not READY");
            let z;
            if (this.channelzEnabled) this.callTracker.addCallStarted(), this.streamTracker.addCallStarted(), z = {
                onCallEnd: (w) => {
                    if (w.code === N06.Status.OK) this.callTracker.addCallSucceeded();
                    else this.callTracker.addCallFailed()
                }
            };
            else z = {};
            return this.transport.createCall(A, q, K, Y, z)
        }
        startConnecting() {
            process.nextTick(() => {
                if (!this.transitionToState([_w.ConnectivityState.IDLE], _w.ConnectivityState.CONNECTING)) {
                    if (this.connectivityState === _w.ConnectivityState.TRANSIENT_FAILURE) this.continueConnecting = !0
                }
            })
        }
        getConnectivityState() {
            return this.connectivityState
        }
        addConnectivityStateListener(A) {
            this.stateListeners.add(A)
        }
        removeConnectivityStateListener(A) {
            this.stateListeners.delete(A)
        }
        resetBackoff() {
            process.nextTick(() => {
                this.backoffTimeout.reset(), this.transitionToState([_w.ConnectivityState.TRANSIENT_FAILURE], _w.ConnectivityState.CONNECTING)
            })
        }
        getAddress() {
            return this.subchannelAddressString
        }
        getChannelzRef() {
            return this.channelzRef
        }
        isHealthy() {
            return !0
        }
        addHealthStateWatcher(A) {}
        removeHealthStateWatcher(A) {}
        getRealSubchannel() {
            return this
        }
        realSubchannelEquals(A) {
            return A.getRealSubchannel() === this
        }
        throttleKeepalive(A) {
            if (A > this.keepaliveTime) this.keepaliveTime = A
        }
        getCallCredentials() {
            return this.secureConnector.getCallCredentials()
        }
        getChannel() {
            if (!this.subchannelChannel) this.subchannelChannel = new xHY.SingleSubchannelChannel(this, this.channelTarget, this.options);
            return this.subchannelChannel
        }
        addDataWatcher(A) {
            throw Error("Not implemented")
        }
        getOrCreateDataProducer(A, q) {
            let K = this.dataProducers.get(A);
            if (K) return K;
            let Y = q(this);
            return this.dataProducers.set(A, Y), Y
        }
        removeDataProducer(A) {
            this.dataProducers.delete(A)
        }
    }
    DV4.Subchannel = XV4
})
// @from(Ln 295306, Col 4)
GV4 = R((PV4) => {
    var WVA;
    Object.defineProperty(PV4, "__esModule", {
        value: !0
    });
    PV4.GRPC_NODE_USE_ALTERNATIVE_RESOLVER = void 0;
    PV4.GRPC_NODE_USE_ALTERNATIVE_RESOLVER = ((WVA = process.env.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) !== null && WVA !== void 0 ? WVA : "false") === "true"
})
// @from(Ln 295314, Col 4)
fVA = R((TV4) => {
    Object.defineProperty(TV4, "__esModule", {
        value: !0
    });
    TV4.DEFAULT_PORT = void 0;
    TV4.setup = dHY;
    var ZV4 = lh(),
        GVA = h1("dns"),
        BHY = qfA(),
        ZVA = w9(),
        KP1 = k31(),
        mHY = Jj(),
        FHY = mw(),
        QHY = w9(),
        Is = mZ(),
        fV4 = h1("net"),
        gHY = UM1(),
        VV4 = GV4(),
        UHY = "dns_resolver";

    function Mm(A) {
        FHY.trace(QHY.LogVerbosity.DEBUG, UHY, A)
    }
    TV4.DEFAULT_PORT = 443;
    var pHY = 30000;
    class NV4 {
        constructor(A, q, K) {
            var Y, z, w;
            if (this.target = A, this.listener = q, this.pendingLookupPromise = null, this.pendingTxtPromise = null, this.latestLookupResult = null, this.latestServiceConfigResult = null, this.continueResolving = !1, this.isNextResolutionTimerRunning = !1, this.isServiceConfigEnabled = !0, this.returnedIpResult = !1, this.alternativeResolver = new GVA.promises.Resolver, Mm("Resolver constructed for target " + (0, Is.uriToString)(A)), A.authority) this.alternativeResolver.setServers([A.authority]);
            let H = (0, Is.splitHostPort)(A.path);
            if (H === null) this.ipResult = null, this.dnsHostname = null, this.port = null;
            else if ((0, fV4.isIPv4)(H.host) || (0, fV4.isIPv6)(H.host)) this.ipResult = [{
                addresses: [{
                    host: H.host,
                    port: (Y = H.port) !== null && Y !== void 0 ? Y : TV4.DEFAULT_PORT
                }]
            }], this.dnsHostname = null, this.port = null;
            else this.ipResult = null, this.dnsHostname = H.host, this.port = (z = H.port) !== null && z !== void 0 ? z : TV4.DEFAULT_PORT;
            if (this.percentage = Math.random() * 100, K["grpc.service_config_disable_resolution"] === 1) this.isServiceConfigEnabled = !1;
            this.defaultResolutionError = {
                code: ZVA.Status.UNAVAILABLE,
                details: `Name resolution failed for target ${(0,Is.uriToString)(this.target)}`,
                metadata: new mHY.Metadata
            };
            let $ = {
                initialDelay: K["grpc.initial_reconnect_backoff_ms"],
                maxDelay: K["grpc.max_reconnect_backoff_ms"]
            };
            this.backoff = new gHY.BackoffTimeout(() => {
                if (this.continueResolving) this.startResolutionWithBackoff()
            }, $), this.backoff.unref(), this.minTimeBetweenResolutionsMs = (w = K["grpc.dns_min_time_between_resolutions_ms"]) !== null && w !== void 0 ? w : pHY, this.nextResolutionTimer = setTimeout(() => {}, 0), clearTimeout(this.nextResolutionTimer)
        }
        startResolution() {
            if (this.ipResult !== null) {
                if (!this.returnedIpResult) Mm("Returning IP address for target " + (0, Is.uriToString)(this.target)), setImmediate(() => {
                    this.listener((0, KP1.statusOrFromValue)(this.ipResult), {}, null, "")
                }), this.returnedIpResult = !0;
                this.backoff.stop(), this.backoff.reset(), this.stopNextResolutionTimer();
                return
            }
            if (this.dnsHostname === null) Mm("Failed to parse DNS address " + (0, Is.uriToString)(this.target)), setImmediate(() => {
                this.listener((0, KP1.statusOrFromError)({
                    code: ZVA.Status.UNAVAILABLE,
                    details: `Failed to parse DNS address ${(0,Is.uriToString)(this.target)}`
                }), {}, null, "")
            }), this.stopNextResolutionTimer();
            else {
                if (this.pendingLookupPromise !== null) return;
                Mm("Looking up DNS hostname " + this.dnsHostname), this.latestLookupResult = null;
                let A = this.dnsHostname;
                if (this.pendingLookupPromise = this.lookup(A), this.pendingLookupPromise.then((q) => {
                        if (this.pendingLookupPromise === null) return;
                        this.pendingLookupPromise = null, this.latestLookupResult = (0, KP1.statusOrFromValue)(q.map((z) => ({
                            addresses: [z]
                        })));
                        let K = "[" + q.map((z) => z.host + ":" + z.port).join(",") + "]";
                        Mm("Resolved addresses for target " + (0, Is.uriToString)(this.target) + ": " + K);
                        let Y = this.listener(this.latestLookupResult, {}, this.latestServiceConfigResult, "");
                        this.handleHealthStatus(Y)
                    }, (q) => {
                        if (this.pendingLookupPromise === null) return;
                        Mm("Resolution error for target " + (0, Is.uriToString)(this.target) + ": " + q.message), this.pendingLookupPromise = null, this.stopNextResolutionTimer(), this.listener((0, KP1.statusOrFromError)(this.defaultResolutionError), {}, this.latestServiceConfigResult, "")
                    }), this.isServiceConfigEnabled && this.pendingTxtPromise === null) this.pendingTxtPromise = this.resolveTxt(A), this.pendingTxtPromise.then((q) => {
                    if (this.pendingTxtPromise === null) return;
                    this.pendingTxtPromise = null;
                    let K;
                    try {
                        if (K = (0, BHY.extractAndSelectServiceConfig)(q, this.percentage), K) this.latestServiceConfigResult = (0, KP1.statusOrFromValue)(K);
                        else this.latestServiceConfigResult = null
                    } catch (Y) {
                        this.latestServiceConfigResult = (0, KP1.statusOrFromError)({
                            code: ZVA.Status.UNAVAILABLE,
                            details: `Parsing service config failed with error ${Y.message}`
                        })
                    }
                    if (this.latestLookupResult !== null) this.listener(this.latestLookupResult, {}, this.latestServiceConfigResult, "")
                }, (q) => {})
            }
        }
        handleHealthStatus(A) {
            if (A) this.backoff.stop(), this.backoff.reset();
            else this.continueResolving = !0
        }
        async lookup(A) {
            if (VV4.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) {
                Mm("Using alternative DNS resolver.");
                let K = await Promise.allSettled([this.alternativeResolver.resolve4(A), this.alternativeResolver.resolve6(A)]);
                if (K.every((Y) => Y.status === "rejected")) throw Error(K[0].reason);
                return K.reduce((Y, z) => {
                    return z.status === "fulfilled" ? [...Y, ...z.value] : Y
                }, []).map((Y) => ({
                    host: Y,
                    port: +this.port
                }))
            }
            return (await GVA.promises.lookup(A, {
                all: !0
            })).map((K) => ({
                host: K.address,
                port: +this.port
            }))
        }
        async resolveTxt(A) {
            if (VV4.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) return Mm("Using alternative DNS resolver."), this.alternativeResolver.resolveTxt(A);
            return GVA.promises.resolveTxt(A)
        }
        startNextResolutionTimer() {
            var A, q;
            clearTimeout(this.nextResolutionTimer), this.nextResolutionTimer = setTimeout(() => {
                if (this.stopNextResolutionTimer(), this.continueResolving) this.startResolutionWithBackoff()
            }, this.minTimeBetweenResolutionsMs), (q = (A = this.nextResolutionTimer).unref) === null || q === void 0 || q.call(A), this.isNextResolutionTimerRunning = !0
        }
        stopNextResolutionTimer() {
            clearTimeout(this.nextResolutionTimer), this.isNextResolutionTimerRunning = !1
        }
        startResolutionWithBackoff() {
            if (this.pendingLookupPromise === null) this.continueResolving = !1, this.backoff.runOnce(), this.startNextResolutionTimer(), this.startResolution()
        }
        updateResolution() {
            if (this.pendingLookupPromise === null)
                if (this.isNextResolutionTimerRunning || this.backoff.isRunning()) {
                    if (this.isNextResolutionTimerRunning) Mm('resolution update delayed by "min time between resolutions" rate limit');
                    else Mm("resolution update delayed by backoff timer until " + this.backoff.getEndTime().toISOString());
                    this.continueResolving = !0
                } else this.startResolutionWithBackoff()
        }
        destroy() {
            this.continueResolving = !1, this.backoff.reset(), this.backoff.stop(), this.stopNextResolutionTimer(), this.pendingLookupPromise = null, this.pendingTxtPromise = null, this.latestLookupResult = null, this.latestServiceConfigResult = null, this.returnedIpResult = !1
        }
        static getDefaultAuthority(A) {
            return A.path
        }
    }

    function dHY() {
        (0, ZV4.registerResolver)("dns", NV4), (0, ZV4.registerDefaultScheme)("dns")
    }
})
// @from(Ln 295472, Col 4)
VVA = R((RV4) => {
    Object.defineProperty(RV4, "__esModule", {
        value: !0
    });
    RV4.parseCIDR = kV4;
    RV4.mapProxyName = A$Y;
    RV4.getProxiedConnection = q$Y;
    var KF1 = mw(),
        YP1 = w9(),
        EV4 = h1("net"),
        lHY = h1("http"),
        iHY = mw(),
        vV4 = $N(),
        YF1 = mZ(),
        nHY = h1("url"),
        rHY = fVA(),
        oHY = "proxy";

    function zP1(A) {
        iHY.trace(YP1.LogVerbosity.DEBUG, oHY, A)
    }

    function aHY() {
        let A = "",
            q = "";
        if (process.env.grpc_proxy) q = "grpc_proxy", A = process.env.grpc_proxy;
        else if (process.env.https_proxy) q = "https_proxy", A = process.env.https_proxy;
        else if (process.env.http_proxy) q = "http_proxy", A = process.env.http_proxy;
        else return {};
        let K;
        try {
            K = new nHY.URL(A)
        } catch ($) {
            return (0, KF1.log)(YP1.LogVerbosity.ERROR, `cannot parse value of "${q}" env var`), {}
        }
        if (K.protocol !== "http:") return (0, KF1.log)(YP1.LogVerbosity.ERROR, `"${K.protocol}" scheme not supported in proxy URI`), {};
        let Y = null;
        if (K.username)
            if (K.password)(0, KF1.log)(YP1.LogVerbosity.INFO, "userinfo found in proxy URI"), Y = decodeURIComponent(`${K.username}:${K.password}`);
            else Y = K.username;
        let {
            hostname: z,
            port: w
        } = K;
        if (w === "") w = "80";
        let H = {
            address: `${z}:${w}`
        };
        if (Y) H.creds = Y;
        return zP1("Proxy server " + H.address + " set by environment variable " + q), H
    }

    function sHY() {
        let A = process.env.no_grpc_proxy,
            q = "no_grpc_proxy";
        if (!A) A = process.env.no_proxy, q = "no_proxy";
        if (A) return zP1("No proxy server list set by environment variable " + q), A.split(",");
        else return []
    }

    function kV4(A) {
        let q = A.split("/");
        if (q.length !== 2) return null;
        let K = parseInt(q[1], 10);
        if (!(0, EV4.isIPv4)(q[0]) || Number.isNaN(K) || K < 0 || K > 32) return null;
        return {
            ip: LV4(q[0]),
            prefixLength: K
        }
    }

    function LV4(A) {
        return A.split(".").reduce((q, K) => (q << 8) + parseInt(K, 10), 0)
    }

    function tHY(A, q) {
        let K = A.ip,
            Y = -1 << 32 - A.prefixLength;
        return (LV4(q) & Y) === (K & Y)
    }

    function eHY(A) {
        for (let q of sHY()) {
            let K = kV4(q);
            if ((0, EV4.isIPv4)(A) && K && tHY(K, A)) return !0;
            else if (A.endsWith(q)) return !0
        }
        return !1
    }

    function A$Y(A, q) {
        var K;
        let Y = {
            target: A,
            extraOptions: {}
        };
        if (((K = q["grpc.enable_http_proxy"]) !== null && K !== void 0 ? K : 1) === 0) return Y;
        if (A.scheme === "unix") return Y;
        let z = aHY();
        if (!z.address) return Y;
        let w = (0, YF1.splitHostPort)(A.path);
        if (!w) return Y;
        let H = w.host;
        if (eHY(H)) return zP1("Not using proxy for target in no_proxy list: " + (0, YF1.uriToString)(A)), Y;
        let $ = {
            "grpc.http_connect_target": (0, YF1.uriToString)(A)
        };
        if (z.creds) $["grpc.http_connect_creds"] = z.creds;
        return {
            target: {
                scheme: "dns",
                path: z.address
            },
            extraOptions: $
        }
    }

    function q$Y(A, q) {
        var K;
        if (!("grpc.http_connect_target" in q)) return Promise.resolve(null);
        let Y = q["grpc.http_connect_target"],
            z = (0, YF1.parseUri)(Y);
        if (z === null) return Promise.resolve(null);
        let w = (0, YF1.splitHostPort)(z.path);
        if (w === null) return Promise.resolve(null);
        let H = `${w.host}:${(K=w.port)!==null&&K!==void 0?K:rHY.DEFAULT_PORT}`,
            $ = {
                method: "CONNECT",
                path: H
            },
            O = {
                Host: H
            };
        if ((0, vV4.isTcpSubchannelAddress)(A)) $.host = A.host, $.port = A.port;
        else $.socketPath = A.path;
        if ("grpc.http_connect_creds" in q) O["Proxy-Authorization"] = "Basic " + Buffer.from(q["grpc.http_connect_creds"]).toString("base64");
        $.headers = O;
        let _ = (0, vV4.subchannelAddressToString)(A);
        return zP1("Using proxy " + _ + " to connect to " + $.path), new Promise((J, X) => {
            let D = lHY.request($);
            D.once("connect", (j, M, P) => {
                if (D.removeAllListeners(), M.removeAllListeners(), j.statusCode === 200) {
                    if (zP1("Successfully connected to " + $.path + " through proxy " + _), P.length > 0) M.unshift(P);
                    zP1("Successfully established a plaintext connection to " + $.path + " through proxy " + _), J(M)
                } else(0, KF1.log)(YP1.LogVerbosity.ERROR, "Failed to connect to " + $.path + " through proxy " + _ + " with status " + j.statusCode), X()
            }), D.once("error", (j) => {
                D.removeAllListeners(), (0, KF1.log)(YP1.LogVerbosity.ERROR, "Failed to connect to proxy " + _ + " with error " + j.message), X()
            }), D.end()
        })
    }
})
// @from(Ln 295623, Col 4)
NVA = R((CV4) => {
    Object.defineProperty(CV4, "__esModule", {
        value: !0
    });
    CV4.StreamDecoder = void 0;
    var Pm;
    (function(A) {
        A[A.NO_DATA = 0] = "NO_DATA", A[A.READING_SIZE = 1] = "READING_SIZE", A[A.READING_MESSAGE = 2] = "READING_MESSAGE"
    })(Pm || (Pm = {}));
    class yV4 {
        constructor(A) {
            this.maxReadMessageLength = A, this.readState = Pm.NO_DATA, this.readCompressFlag = Buffer.alloc(1), this.readPartialSize = Buffer.alloc(4), this.readSizeRemaining = 4, this.readMessageSize = 0, this.readPartialMessage = [], this.readMessageRemaining = 0
        }
        write(A) {
            let q = 0,
                K, Y = [];
            while (q < A.length) switch (this.readState) {
                case Pm.NO_DATA:
                    this.readCompressFlag = A.slice(q, q + 1), q += 1, this.readState = Pm.READING_SIZE, this.readPartialSize.fill(0), this.readSizeRemaining = 4, this.readMessageSize = 0, this.readMessageRemaining = 0, this.readPartialMessage = [];
                    break;
                case Pm.READING_SIZE:
                    if (K = Math.min(A.length - q, this.readSizeRemaining), A.copy(this.readPartialSize, 4 - this.readSizeRemaining, q, q + K), this.readSizeRemaining -= K, q += K, this.readSizeRemaining === 0) {
                        if (this.readMessageSize = this.readPartialSize.readUInt32BE(0), this.maxReadMessageLength !== -1 && this.readMessageSize > this.maxReadMessageLength) throw Error(`Received message larger than max (${this.readMessageSize} vs ${this.maxReadMessageLength})`);
                        if (this.readMessageRemaining = this.readMessageSize, this.readMessageRemaining > 0) this.readState = Pm.READING_MESSAGE;
                        else {
                            let z = Buffer.concat([this.readCompressFlag, this.readPartialSize], 5);
                            this.readState = Pm.NO_DATA, Y.push(z)
                        }
                    }
                    break;
                case Pm.READING_MESSAGE:
                    if (K = Math.min(A.length - q, this.readMessageRemaining), this.readPartialMessage.push(A.slice(q, q + K)), this.readMessageRemaining -= K, q += K, this.readMessageRemaining === 0) {
                        let z = [this.readCompressFlag, this.readPartialSize].concat(this.readPartialMessage),
                            w = Buffer.concat(z, this.readMessageSize + 5);
                        this.readState = Pm.NO_DATA, Y.push(w)
                    }
                    break;
                default:
                    throw Error("Unexpected read state")
            }
            return Y
        }
    }
    CV4.StreamDecoder = yV4
})