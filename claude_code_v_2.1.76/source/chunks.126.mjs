
// @from(Ln 310748, Col 4)
Fm4 = x((Bm4) => {
    Object.defineProperty(Bm4, "__esModule", {
        value: !0
    });
    Bm4.addCommonProtos = Bm4.loadProtosWithOptionsSync = Bm4.loadProtosWithOptions = void 0;
    var xm4 = x6("fs"),
        um4 = x6("path"),
        FG6 = ZT1();

    function mm4(A, q) {
        let K = A.resolvePath;
        A.resolvePath = (Y, z) => {
            if (um4.isAbsolute(z)) return z;
            for (let _ of q) {
                let w = um4.join(_, z);
                try {
                    return xm4.accessSync(w, xm4.constants.R_OK), w
                } catch (O) {
                    continue
                }
            }
            return process.emitWarning(`${z} not found in any of the include paths ${q}`), K(Y, z)
        }
    }
    async function pjY(A, q) {
        let K = new FG6.Root;
        if (q = q || {}, q.includeDirs) {
            if (!Array.isArray(q.includeDirs)) return Promise.reject(Error("The includeDirs option must be an array"));
            mm4(K, q.includeDirs)
        }
        let Y = await K.load(A, q);
        return Y.resolveAll(), Y
    }
    Bm4.loadProtosWithOptions = pjY;

    function QjY(A, q) {
        let K = new FG6.Root;
        if (q = q || {}, q.includeDirs) {
            if (!Array.isArray(q.includeDirs)) throw Error("The includeDirs option must be an array");
            mm4(K, q.includeDirs)
        }
        let Y = K.loadSync(A, q);
        return Y.resolveAll(), Y
    }
    Bm4.loadProtosWithOptionsSync = QjY;

    function UjY() {
        let A = Cm4(),
            q = BC8(),
            K = Im4(),
            Y = bm4();
        FG6.common("api", A.nested.google.nested.protobuf.nested), FG6.common("descriptor", q.nested.google.nested.protobuf.nested), FG6.common("source_context", K.nested.google.nested.protobuf.nested), FG6.common("type", Y.nested.google.nested.protobuf.nested)
    }
    Bm4.addCommonProtos = UjY
})
// @from(Ln 310803, Col 4)
pm4 = x((Pd6, FC8) => {
    (function(A, q) {
        function K(Y) {
            return "default" in Y ? Y.default : Y
        }
        if (typeof define === "function" && define.amd) define([], function() {
            var Y = {};
            return q(Y), K(Y)
        });
        else if (typeof Pd6 === "object") {
            if (q(Pd6), typeof FC8 === "object") FC8.exports = K(Pd6)
        } else(function() {
            var Y = {};
            q(Y), A.Long = K(Y)
        })()
    })(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : Pd6, function(A) {
        Object.defineProperty(A, "__esModule", {
            value: !0
        }), A.default = void 0;
        var q = null;
        try {
            q = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports
        } catch {}

        function K(B, b, p) {
            this.low = B | 0, this.high = b | 0, this.unsigned = !!p
        }
        K.prototype.__isLong__, Object.defineProperty(K.prototype, "__isLong__", {
            value: !0
        });

        function Y(B) {
            return (B && B.__isLong__) === !0
        }

        function z(B) {
            var b = Math.clz32(B & -B);
            return B ? 31 - b : b
        }
        K.isLong = Y;
        var _ = {},
            w = {};

        function O(B, b) {
            var p, Q, U;
            if (b) {
                if (B >>>= 0, U = 0 <= B && B < 256) {
                    if (Q = w[B], Q) return Q
                }
                if (p = H(B, 0, !0), U) w[B] = p;
                return p
            } else {
                if (B |= 0, U = -128 <= B && B < 128) {
                    if (Q = _[B], Q) return Q
                }
                if (p = H(B, B < 0 ? -1 : 0, !1), U) _[B] = p;
                return p
            }
        }
        K.fromInt = O;

        function $(B, b) {
            if (isNaN(B)) return b ? v : f;
            if (b) {
                if (B < 0) return v;
                if (B >= W) return R
            } else {
                if (B <= -Z) return u;
                if (B + 1 >= Z) return h
            }
            if (B < 0) return $(-B, b).neg();
            return H(B % P | 0, B / P | 0, b)
        }
        K.fromNumber = $;

        function H(B, b, p) {
            return new K(B, b, p)
        }
        K.fromBits = H;
        var j = Math.pow;

        function J(B, b, p) {
            if (B.length === 0) throw Error("empty string");
            if (typeof b === "number") p = b, b = !1;
            else b = !!b;
            if (B === "NaN" || B === "Infinity" || B === "+Infinity" || B === "-Infinity") return b ? v : f;
            if (p = p || 10, p < 2 || 36 < p) throw RangeError("radix");
            var Q;
            if ((Q = B.indexOf("-")) > 0) throw Error("interior hyphen");
            else if (Q === 0) return J(B.substring(1), b, p).neg();
            var U = $(j(p, 8)),
                r = f;
            for (var e = 0; e < B.length; e += 8) {
                var Y6 = Math.min(8, B.length - e),
                    H6 = parseInt(B.substring(e, e + Y6), p);
                if (Y6 < 8) {
                    var J6 = $(j(p, Y6));
                    r = r.mul(J6).add($(H6))
                } else r = r.mul(U), r = r.add($(H6))
            }
            return r.unsigned = b, r
        }
        K.fromString = J;

        function M(B, b) {
            if (typeof B === "number") return $(B, b);
            if (typeof B === "string") return J(B, b);
            return H(B.low, B.high, typeof b === "boolean" ? b : B.unsigned)
        }
        K.fromValue = M;
        var D = 65536,
            X = 16777216,
            P = D * D,
            W = P * P,
            Z = W / 2,
            G = O(X),
            f = O(0);
        K.ZERO = f;
        var v = O(0, !0);
        K.UZERO = v;
        var N = O(1);
        K.ONE = N;
        var V = O(1, !0);
        K.UONE = V;
        var L = O(-1);
        K.NEG_ONE = L;
        var h = H(-1, 2147483647, !1);
        K.MAX_VALUE = h;
        var R = H(-1, -1, !0);
        K.MAX_UNSIGNED_VALUE = R;
        var u = H(0, -2147483648, !1);
        K.MIN_VALUE = u;
        var I = K.prototype;
        if (I.toInt = function() {
                return this.unsigned ? this.low >>> 0 : this.low
            }, I.toNumber = function() {
                if (this.unsigned) return (this.high >>> 0) * P + (this.low >>> 0);
                return this.high * P + (this.low >>> 0)
            }, I.toString = function(b) {
                if (b = b || 10, b < 2 || 36 < b) throw RangeError("radix");
                if (this.isZero()) return "0";
                if (this.isNegative())
                    if (this.eq(u)) {
                        var p = $(b),
                            Q = this.div(p),
                            U = Q.mul(p).sub(this);
                        return Q.toString(b) + U.toInt().toString(b)
                    } else return "-" + this.neg().toString(b);
                var r = $(j(b, 6), this.unsigned),
                    e = this,
                    Y6 = "";
                while (!0) {
                    var H6 = e.div(r),
                        J6 = e.sub(H6.mul(r)).toInt() >>> 0,
                        K6 = J6.toString(b);
                    if (e = H6, e.isZero()) return K6 + Y6;
                    else {
                        while (K6.length < 6) K6 = "0" + K6;
                        Y6 = "" + K6 + Y6
                    }
                }
            }, I.getHighBits = function() {
                return this.high
            }, I.getHighBitsUnsigned = function() {
                return this.high >>> 0
            }, I.getLowBits = function() {
                return this.low
            }, I.getLowBitsUnsigned = function() {
                return this.low >>> 0
            }, I.getNumBitsAbs = function() {
                if (this.isNegative()) return this.eq(u) ? 64 : this.neg().getNumBitsAbs();
                var b = this.high != 0 ? this.high : this.low;
                for (var p = 31; p > 0; p--)
                    if ((b & 1 << p) != 0) break;
                return this.high != 0 ? p + 33 : p + 1
            }, I.isSafeInteger = function() {
                var b = this.high >> 21;
                if (!b) return !0;
                if (this.unsigned) return !1;
                return b === -1 && !(this.low === 0 && this.high === -2097152)
            }, I.isZero = function() {
                return this.high === 0 && this.low === 0
            }, I.eqz = I.isZero, I.isNegative = function() {
                return !this.unsigned && this.high < 0
            }, I.isPositive = function() {
                return this.unsigned || this.high >= 0
            }, I.isOdd = function() {
                return (this.low & 1) === 1
            }, I.isEven = function() {
                return (this.low & 1) === 0
            }, I.equals = function(b) {
                if (!Y(b)) b = M(b);
                if (this.unsigned !== b.unsigned && this.high >>> 31 === 1 && b.high >>> 31 === 1) return !1;
                return this.high === b.high && this.low === b.low
            }, I.eq = I.equals, I.notEquals = function(b) {
                return !this.eq(b)
            }, I.neq = I.notEquals, I.ne = I.notEquals, I.lessThan = function(b) {
                return this.comp(b) < 0
            }, I.lt = I.lessThan, I.lessThanOrEqual = function(b) {
                return this.comp(b) <= 0
            }, I.lte = I.lessThanOrEqual, I.le = I.lessThanOrEqual, I.greaterThan = function(b) {
                return this.comp(b) > 0
            }, I.gt = I.greaterThan, I.greaterThanOrEqual = function(b) {
                return this.comp(b) >= 0
            }, I.gte = I.greaterThanOrEqual, I.ge = I.greaterThanOrEqual, I.compare = function(b) {
                if (!Y(b)) b = M(b);
                if (this.eq(b)) return 0;
                var p = this.isNegative(),
                    Q = b.isNegative();
                if (p && !Q) return -1;
                if (!p && Q) return 1;
                if (!this.unsigned) return this.sub(b).isNegative() ? -1 : 1;
                return b.high >>> 0 > this.high >>> 0 || b.high === this.high && b.low >>> 0 > this.low >>> 0 ? -1 : 1
            }, I.comp = I.compare, I.negate = function() {
                if (!this.unsigned && this.eq(u)) return u;
                return this.not().add(N)
            }, I.neg = I.negate, I.add = function(b) {
                if (!Y(b)) b = M(b);
                var p = this.high >>> 16,
                    Q = this.high & 65535,
                    U = this.low >>> 16,
                    r = this.low & 65535,
                    e = b.high >>> 16,
                    Y6 = b.high & 65535,
                    H6 = b.low >>> 16,
                    J6 = b.low & 65535,
                    K6 = 0,
                    s = 0,
                    X6 = 0,
                    z6 = 0;
                return z6 += r + J6, X6 += z6 >>> 16, z6 &= 65535, X6 += U + H6, s += X6 >>> 16, X6 &= 65535, s += Q + Y6, K6 += s >>> 16, s &= 65535, K6 += p + e, K6 &= 65535, H(X6 << 16 | z6, K6 << 16 | s, this.unsigned)
            }, I.subtract = function(b) {
                if (!Y(b)) b = M(b);
                return this.add(b.neg())
            }, I.sub = I.subtract, I.multiply = function(b) {
                if (this.isZero()) return this;
                if (!Y(b)) b = M(b);
                if (q) {
                    var p = q.mul(this.low, this.high, b.low, b.high);
                    return H(p, q.get_high(), this.unsigned)
                }
                if (b.isZero()) return this.unsigned ? v : f;
                if (this.eq(u)) return b.isOdd() ? u : f;
                if (b.eq(u)) return this.isOdd() ? u : f;
                if (this.isNegative())
                    if (b.isNegative()) return this.neg().mul(b.neg());
                    else return this.neg().mul(b).neg();
                else if (b.isNegative()) return this.mul(b.neg()).neg();
                if (this.lt(G) && b.lt(G)) return $(this.toNumber() * b.toNumber(), this.unsigned);
                var Q = this.high >>> 16,
                    U = this.high & 65535,
                    r = this.low >>> 16,
                    e = this.low & 65535,
                    Y6 = b.high >>> 16,
                    H6 = b.high & 65535,
                    J6 = b.low >>> 16,
                    K6 = b.low & 65535,
                    s = 0,
                    X6 = 0,
                    z6 = 0,
                    N6 = 0;
                return N6 += e * K6, z6 += N6 >>> 16, N6 &= 65535, z6 += r * K6, X6 += z6 >>> 16, z6 &= 65535, z6 += e * J6, X6 += z6 >>> 16, z6 &= 65535, X6 += U * K6, s += X6 >>> 16, X6 &= 65535, X6 += r * J6, s += X6 >>> 16, X6 &= 65535, X6 += e * H6, s += X6 >>> 16, X6 &= 65535, s += Q * K6 + U * J6 + r * H6 + e * Y6, s &= 65535, H(z6 << 16 | N6, s << 16 | X6, this.unsigned)
            }, I.mul = I.multiply, I.divide = function(b) {
                if (!Y(b)) b = M(b);
                if (b.isZero()) throw Error("division by zero");
                if (q) {
                    if (!this.unsigned && this.high === -2147483648 && b.low === -1 && b.high === -1) return this;
                    var p = (this.unsigned ? q.div_u : q.div_s)(this.low, this.high, b.low, b.high);
                    return H(p, q.get_high(), this.unsigned)
                }
                if (this.isZero()) return this.unsigned ? v : f;
                var Q, U, r;
                if (!this.unsigned) {
                    if (this.eq(u))
                        if (b.eq(N) || b.eq(L)) return u;
                        else if (b.eq(u)) return N;
                    else {
                        var e = this.shr(1);
                        if (Q = e.div(b).shl(1), Q.eq(f)) return b.isNegative() ? N : L;
                        else return U = this.sub(b.mul(Q)), r = Q.add(U.div(b)), r
                    } else if (b.eq(u)) return this.unsigned ? v : f;
                    if (this.isNegative()) {
                        if (b.isNegative()) return this.neg().div(b.neg());
                        return this.neg().div(b).neg()
                    } else if (b.isNegative()) return this.div(b.neg()).neg();
                    r = f
                } else {
                    if (!b.unsigned) b = b.toUnsigned();
                    if (b.gt(this)) return v;
                    if (b.gt(this.shru(1))) return V;
                    r = v
                }
                U = this;
                while (U.gte(b)) {
                    Q = Math.max(1, Math.floor(U.toNumber() / b.toNumber()));
                    var Y6 = Math.ceil(Math.log(Q) / Math.LN2),
                        H6 = Y6 <= 48 ? 1 : j(2, Y6 - 48),
                        J6 = $(Q),
                        K6 = J6.mul(b);
                    while (K6.isNegative() || K6.gt(U)) Q -= H6, J6 = $(Q, this.unsigned), K6 = J6.mul(b);
                    if (J6.isZero()) J6 = N;
                    r = r.add(J6), U = U.sub(K6)
                }
                return r
            }, I.div = I.divide, I.modulo = function(b) {
                if (!Y(b)) b = M(b);
                if (q) {
                    var p = (this.unsigned ? q.rem_u : q.rem_s)(this.low, this.high, b.low, b.high);
                    return H(p, q.get_high(), this.unsigned)
                }
                return this.sub(this.div(b).mul(b))
            }, I.mod = I.modulo, I.rem = I.modulo, I.not = function() {
                return H(~this.low, ~this.high, this.unsigned)
            }, I.countLeadingZeros = function() {
                return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32
            }, I.clz = I.countLeadingZeros, I.countTrailingZeros = function() {
                return this.low ? z(this.low) : z(this.high) + 32
            }, I.ctz = I.countTrailingZeros, I.and = function(b) {
                if (!Y(b)) b = M(b);
                return H(this.low & b.low, this.high & b.high, this.unsigned)
            }, I.or = function(b) {
                if (!Y(b)) b = M(b);
                return H(this.low | b.low, this.high | b.high, this.unsigned)
            }, I.xor = function(b) {
                if (!Y(b)) b = M(b);
                return H(this.low ^ b.low, this.high ^ b.high, this.unsigned)
            }, I.shiftLeft = function(b) {
                if (Y(b)) b = b.toInt();
                if ((b &= 63) === 0) return this;
                else if (b < 32) return H(this.low << b, this.high << b | this.low >>> 32 - b, this.unsigned);
                else return H(0, this.low << b - 32, this.unsigned)
            }, I.shl = I.shiftLeft, I.shiftRight = function(b) {
                if (Y(b)) b = b.toInt();
                if ((b &= 63) === 0) return this;
                else if (b < 32) return H(this.low >>> b | this.high << 32 - b, this.high >> b, this.unsigned);
                else return H(this.high >> b - 32, this.high >= 0 ? 0 : -1, this.unsigned)
            }, I.shr = I.shiftRight, I.shiftRightUnsigned = function(b) {
                if (Y(b)) b = b.toInt();
                if ((b &= 63) === 0) return this;
                if (b < 32) return H(this.low >>> b | this.high << 32 - b, this.high >>> b, this.unsigned);
                if (b === 32) return H(this.high, 0, this.unsigned);
                return H(this.high >>> b - 32, 0, this.unsigned)
            }, I.shru = I.shiftRightUnsigned, I.shr_u = I.shiftRightUnsigned, I.rotateLeft = function(b) {
                var p;
                if (Y(b)) b = b.toInt();
                if ((b &= 63) === 0) return this;
                if (b === 32) return H(this.high, this.low, this.unsigned);
                if (b < 32) return p = 32 - b, H(this.low << b | this.high >>> p, this.high << b | this.low >>> p, this.unsigned);
                return b -= 32, p = 32 - b, H(this.high << b | this.low >>> p, this.low << b | this.high >>> p, this.unsigned)
            }, I.rotl = I.rotateLeft, I.rotateRight = function(b) {
                var p;
                if (Y(b)) b = b.toInt();
                if ((b &= 63) === 0) return this;
                if (b === 32) return H(this.high, this.low, this.unsigned);
                if (b < 32) return p = 32 - b, H(this.high << p | this.low >>> b, this.low << p | this.high >>> b, this.unsigned);
                return b -= 32, p = 32 - b, H(this.low << p | this.high >>> b, this.high << p | this.low >>> b, this.unsigned)
            }, I.rotr = I.rotateRight, I.toSigned = function() {
                if (!this.unsigned) return this;
                return H(this.low, this.high, !1)
            }, I.toUnsigned = function() {
                if (this.unsigned) return this;
                return H(this.low, this.high, !0)
            }, I.toBytes = function(b) {
                return b ? this.toBytesLE() : this.toBytesBE()
            }, I.toBytesLE = function() {
                var b = this.high,
                    p = this.low;
                return [p & 255, p >>> 8 & 255, p >>> 16 & 255, p >>> 24, b & 255, b >>> 8 & 255, b >>> 16 & 255, b >>> 24]
            }, I.toBytesBE = function() {
                var b = this.high,
                    p = this.low;
                return [b >>> 24, b >>> 16 & 255, b >>> 8 & 255, b & 255, p >>> 24, p >>> 16 & 255, p >>> 8 & 255, p & 255]
            }, K.fromBytes = function(b, p, Q) {
                return Q ? K.fromBytesLE(b, p) : K.fromBytesBE(b, p)
            }, K.fromBytesLE = function(b, p) {
                return new K(b[0] | b[1] << 8 | b[2] << 16 | b[3] << 24, b[4] | b[5] << 8 | b[6] << 16 | b[7] << 24, p)
            }, K.fromBytesBE = function(b, p) {
                return new K(b[4] << 24 | b[5] << 16 | b[6] << 8 | b[7], b[0] << 24 | b[1] << 16 | b[2] << 8 | b[3], p)
            }, typeof BigInt === "function") K.fromBigInt = function(b, p) {
            var Q = Number(BigInt.asIntN(32, b)),
                U = Number(BigInt.asIntN(32, b >> BigInt(32)));
            return H(Q, U, p)
        }, K.fromValue = function(b, p) {
            if (typeof b === "bigint") return fromBigInt(b, p);
            return M(b, p)
        }, I.toBigInt = function() {
            var b = BigInt(this.low >>> 0),
                p = BigInt(this.unsigned ? this.high >>> 0 : this.high);
            return p << BigInt(32) | b
        };
        var g = A.default = K
    })
})
// @from(Ln 311196, Col 4)
lC8 = x((im4) => {
    Object.defineProperty(im4, "__esModule", {
        value: !0
    });
    im4.loadFileDescriptorSetFromObject = im4.loadFileDescriptorSetFromBuffer = im4.fromJSON = im4.loadSync = im4.load = im4.IdempotencyLevel = im4.isAnyExtension = im4.Long = void 0;
    var ljY = Vu4(),
        Rg = ZT1(),
        dC8 = Sm4(),
        cC8 = Fm4(),
        ijY = pm4();
    im4.Long = ijY;

    function njY(A) {
        return "@type" in A && typeof A["@type"] === "string"
    }
    im4.isAnyExtension = njY;
    var Um4;
    (function(A) {
        A.IDEMPOTENCY_UNKNOWN = "IDEMPOTENCY_UNKNOWN", A.NO_SIDE_EFFECTS = "NO_SIDE_EFFECTS", A.IDEMPOTENT = "IDEMPOTENT"
    })(Um4 = im4.IdempotencyLevel || (im4.IdempotencyLevel = {}));
    var dm4 = {
        longs: String,
        enums: String,
        bytes: String,
        defaults: !0,
        oneofs: !0,
        json: !0
    };

    function rjY(A, q) {
        if (A === "") return q;
        else return A + "." + q
    }

    function ojY(A) {
        return A instanceof Rg.Service || A instanceof Rg.Type || A instanceof Rg.Enum
    }

    function ajY(A) {
        return A instanceof Rg.Namespace || A instanceof Rg.Root
    }

    function cm4(A, q) {
        let K = rjY(q, A.name);
        if (ojY(A)) return [
            [K, A]
        ];
        else if (ajY(A) && typeof A.nested < "u") return Object.keys(A.nested).map((Y) => {
            return cm4(A.nested[Y], K)
        }).reduce((Y, z) => Y.concat(z), []);
        return []
    }

    function pC8(A, q) {
        return function(Y) {
            return A.toObject(A.decode(Y), q)
        }
    }

    function QC8(A) {
        return function(K) {
            if (Array.isArray(K)) throw Error(`Failed to serialize message: expected object with ${A.name} structure, got array instead`);
            let Y = A.fromObject(K);
            return A.encode(Y).finish()
        }
    }

    function sjY(A) {
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
            idempotency_level: Um4.IDEMPOTENCY_UNKNOWN,
            uninterpreted_option: []
        })
    }

    function tjY(A, q, K, Y) {
        let {
            resolvedRequestType: z,
            resolvedResponseType: _
        } = A;
        return {
            path: "/" + q + "/" + A.name,
            requestStream: !!A.requestStream,
            responseStream: !!A.responseStream,
            requestSerialize: QC8(z),
            requestDeserialize: pC8(z, K),
            responseSerialize: QC8(_),
            responseDeserialize: pC8(_, K),
            originalName: ljY(A.name),
            requestType: UC8(z, K, Y),
            responseType: UC8(_, K, Y),
            options: sjY(A.parsedOptions)
        }
    }

    function ejY(A, q, K, Y) {
        let z = {};
        for (let _ of A.methodsArray) z[_.name] = tjY(_, q, K, Y);
        return z
    }

    function UC8(A, q, K) {
        let Y = A.toDescriptor("proto3");
        return {
            format: "Protocol Buffer 3 DescriptorProto",
            type: Y.$type.toObject(Y, dm4),
            fileDescriptorProtos: K,
            serialize: QC8(A),
            deserialize: pC8(A, q)
        }
    }

    function AJY(A, q) {
        let K = A.toDescriptor("proto3");
        return {
            format: "Protocol Buffer 3 EnumDescriptorProto",
            type: K.$type.toObject(K, dm4),
            fileDescriptorProtos: q
        }
    }

    function qJY(A, q, K, Y) {
        if (A instanceof Rg.Service) return ejY(A, q, K, Y);
        else if (A instanceof Rg.Type) return UC8(A, K, Y);
        else if (A instanceof Rg.Enum) return AJY(A, Y);
        else throw Error("Type mismatch in reflection object handling")
    }

    function TT1(A, q) {
        let K = {};
        A.resolveAll();
        let z = A.toDescriptor("proto3").file.map((_) => Buffer.from(dC8.FileDescriptorProto.encode(_).finish()));
        for (let [_, w] of cm4(A, "")) K[_] = qJY(w, _, q, z);
        return K
    }

    function lm4(A, q) {
        q = q || {};
        let K = Rg.Root.fromDescriptor(A);
        return K.resolveAll(), TT1(K, q)
    }

    function KJY(A, q) {
        return (0, cC8.loadProtosWithOptions)(A, q).then((K) => {
            return TT1(K, q)
        })
    }
    im4.load = KJY;

    function YJY(A, q) {
        let K = (0, cC8.loadProtosWithOptionsSync)(A, q);
        return TT1(K, q)
    }
    im4.loadSync = YJY;

    function zJY(A, q) {
        q = q || {};
        let K = Rg.Root.fromJSON(A);
        return K.resolveAll(), TT1(K, q)
    }
    im4.fromJSON = zJY;

    function _JY(A, q) {
        let K = dC8.FileDescriptorSet.decode(A);
        return lm4(K, q)
    }
    im4.loadFileDescriptorSetFromBuffer = _JY;

    function wJY(A, q) {
        let K = dC8.FileDescriptorSet.fromObject(A);
        return lm4(K, q)
    }
    im4.loadFileDescriptorSetFromObject = wJY;
    (0, cC8.addCommonProtos)()
})
// @from(Ln 311380, Col 4)
ae = x((OB4) => {
    var __dirname = "/home/runner/code/tmp/claude-cli-external-build-2217/node_modules/@grpc/grpc-js/build/src";
    Object.defineProperty(OB4, "__esModule", {
        value: !0
    });
    OB4.registerChannelzSocket = OB4.registerChannelzServer = OB4.registerChannelzSubchannel = OB4.registerChannelzChannel = OB4.ChannelzCallTrackerStub = OB4.ChannelzCallTracker = OB4.ChannelzChildrenTrackerStub = OB4.ChannelzChildrenTracker = OB4.ChannelzTrace = OB4.ChannelzTraceStub = void 0;
    OB4.unregisterChannelzRef = ZJY;
    OB4.getChannelzHandlers = _B4;
    OB4.getChannelzServiceDefinition = wB4;
    OB4.setup = RJY;
    var NT1 = x6("net"),
        GY6 = Ex4(),
        Wd6 = Vf(),
        Zd6 = a3(),
        DJY = _N(),
        XJY = rf1(),
        PJY = af1();

    function iC8(A) {
        return {
            channel_id: A.id,
            name: A.name
        }
    }

    function nC8(A) {
        return {
            subchannel_id: A.id,
            name: A.name
        }
    }

    function WJY(A) {
        return {
            server_id: A.id
        }
    }

    function VT1(A) {
        return {
            socket_id: A.id,
            name: A.name
        }
    }
    var rm4 = 32,
        rC8 = 100;
    class tm4 {
        constructor() {
            this.events = [], this.creationTimestamp = new Date, this.eventsLogged = 0
        }
        addTrace() {}
        getTraceMessage() {
            return {
                creation_timestamp: hg(this.creationTimestamp),
                num_events_logged: this.eventsLogged,
                events: []
            }
        }
    }
    OB4.ChannelzTraceStub = tm4;
    class em4 {
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
                }), this.events.length >= rm4 * 2) this.events = this.events.slice(rm4);
            this.eventsLogged += 1
        }
        getTraceMessage() {
            return {
                creation_timestamp: hg(this.creationTimestamp),
                num_events_logged: this.eventsLogged,
                events: this.events.map((A) => {
                    return {
                        description: A.description,
                        severity: A.severity,
                        timestamp: hg(A.timestamp),
                        channel_ref: A.childChannel ? iC8(A.childChannel) : null,
                        subchannel_ref: A.childSubchannel ? nC8(A.childSubchannel) : null
                    }
                })
            }
        }
    }
    OB4.ChannelzTrace = em4;
    class oC8 {
        constructor() {
            this.channelChildren = new GY6.OrderedMap, this.subchannelChildren = new GY6.OrderedMap, this.socketChildren = new GY6.OrderedMap, this.trackerMap = {
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
    OB4.ChannelzChildrenTracker = oC8;
    class AB4 extends oC8 {
        refChild() {}
        unrefChild() {}
    }
    OB4.ChannelzChildrenTrackerStub = AB4;
    class aC8 {
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
    OB4.ChannelzCallTracker = aC8;
    class qB4 extends aC8 {
        addCallStarted() {}
        addCallSucceeded() {}
        addCallFailed() {}
    }
    OB4.ChannelzCallTrackerStub = qB4;
    var nc = {
            ["channel"]: new GY6.OrderedMap,
            ["subchannel"]: new GY6.OrderedMap,
            ["server"]: new GY6.OrderedMap,
            ["socket"]: new GY6.OrderedMap
        },
        kT1 = (A) => {
            let q = 1;

            function K() {
                return q++
            }
            let Y = nc[A];
            return (z, _, w) => {
                let O = K(),
                    $ = {
                        id: O,
                        name: z,
                        kind: A
                    };
                if (w) Y.setElement(O, {
                    ref: $,
                    getInfo: _
                });
                return $
            }
        };
    OB4.registerChannelzChannel = kT1("channel");
    OB4.registerChannelzSubchannel = kT1("subchannel");
    OB4.registerChannelzServer = kT1("server");
    OB4.registerChannelzSocket = kT1("socket");

    function ZJY(A) {
        nc[A.kind].eraseElementByKey(A.id)
    }

    function GJY(A) {
        let q = Number.parseInt(A, 16);
        return [q / 256 | 0, q % 256]
    }

    function om4(A) {
        if (A === "") return [];
        let q = A.split(":").map((Y) => GJY(Y));
        return [].concat(...q)
    }

    function fJY(A) {
        return (0, NT1.isIPv6)(A) && A.toLowerCase().startsWith("::ffff:") && (0, NT1.isIPv4)(A.substring(7))
    }

    function am4(A) {
        return Buffer.from(Uint8Array.from(A.split(".").map((q) => Number.parseInt(q))))
    }

    function TJY(A) {
        if ((0, NT1.isIPv4)(A)) return am4(A);
        else if (fJY(A)) return am4(A.substring(7));
        else if ((0, NT1.isIPv6)(A)) {
            let q, K, Y = A.indexOf("::");
            if (Y === -1) q = A, K = "";
            else q = A.substring(0, Y), K = A.substring(Y + 2);
            let z = Buffer.from(om4(q)),
                _ = Buffer.from(om4(K)),
                w = Buffer.alloc(16 - z.length - _.length, 0);
            return Buffer.concat([z, w, _])
        } else return null
    }

    function KB4(A) {
        switch (A) {
            case Wd6.ConnectivityState.CONNECTING:
                return {
                    state: "CONNECTING"
                };
            case Wd6.ConnectivityState.IDLE:
                return {
                    state: "IDLE"
                };
            case Wd6.ConnectivityState.READY:
                return {
                    state: "READY"
                };
            case Wd6.ConnectivityState.SHUTDOWN:
                return {
                    state: "SHUTDOWN"
                };
            case Wd6.ConnectivityState.TRANSIENT_FAILURE:
                return {
                    state: "TRANSIENT_FAILURE"
                };
            default:
                return {
                    state: "UNKNOWN"
                }
        }
    }

    function hg(A) {
        if (!A) return null;
        let q = A.getTime();
        return {
            seconds: q / 1000 | 0,
            nanos: q % 1000 * 1e6
        }
    }

    function YB4(A) {
        let q = A.getInfo(),
            K = [],
            Y = [];
        return q.children.channels.forEach((z) => {
            K.push(iC8(z[1].ref))
        }), q.children.subchannels.forEach((z) => {
            Y.push(nC8(z[1].ref))
        }), {
            ref: iC8(A.ref),
            data: {
                target: q.target,
                state: KB4(q.state),
                calls_started: q.callTracker.callsStarted,
                calls_succeeded: q.callTracker.callsSucceeded,
                calls_failed: q.callTracker.callsFailed,
                last_call_started_timestamp: hg(q.callTracker.lastCallStartedTimestamp),
                trace: q.trace.getTraceMessage()
            },
            channel_ref: K,
            subchannel_ref: Y
        }
    }

    function vJY(A, q) {
        let K = parseInt(A.request.channel_id, 10),
            Y = nc.channel.getElementByKey(K);
        if (Y === void 0) {
            q({
                code: Zd6.Status.NOT_FOUND,
                details: "No channel data found for id " + K
            });
            return
        }
        q(null, {
            channel: YB4(Y)
        })
    }

    function NJY(A, q) {
        let K = parseInt(A.request.max_results, 10) || rC8,
            Y = [],
            z = parseInt(A.request.start_channel_id, 10),
            _ = nc.channel,
            w;
        for (w = _.lowerBound(z); !w.equals(_.end()) && Y.length < K; w = w.next()) Y.push(YB4(w.pointer[1]));
        q(null, {
            channel: Y,
            end: w.equals(_.end())
        })
    }

    function zB4(A) {
        let q = A.getInfo(),
            K = [];
        return q.listenerChildren.sockets.forEach((Y) => {
            K.push(VT1(Y[1].ref))
        }), {
            ref: WJY(A.ref),
            data: {
                calls_started: q.callTracker.callsStarted,
                calls_succeeded: q.callTracker.callsSucceeded,
                calls_failed: q.callTracker.callsFailed,
                last_call_started_timestamp: hg(q.callTracker.lastCallStartedTimestamp),
                trace: q.trace.getTraceMessage()
            },
            listen_socket: K
        }
    }

    function VJY(A, q) {
        let K = parseInt(A.request.server_id, 10),
            z = nc.server.getElementByKey(K);
        if (z === void 0) {
            q({
                code: Zd6.Status.NOT_FOUND,
                details: "No server data found for id " + K
            });
            return
        }
        q(null, {
            server: zB4(z)
        })
    }

    function kJY(A, q) {
        let K = parseInt(A.request.max_results, 10) || rC8,
            Y = parseInt(A.request.start_server_id, 10),
            z = nc.server,
            _ = [],
            w;
        for (w = z.lowerBound(Y); !w.equals(z.end()) && _.length < K; w = w.next()) _.push(zB4(w.pointer[1]));
        q(null, {
            server: _,
            end: w.equals(z.end())
        })
    }

    function EJY(A, q) {
        let K = parseInt(A.request.subchannel_id, 10),
            Y = nc.subchannel.getElementByKey(K);
        if (Y === void 0) {
            q({
                code: Zd6.Status.NOT_FOUND,
                details: "No subchannel data found for id " + K
            });
            return
        }
        let z = Y.getInfo(),
            _ = [];
        z.children.sockets.forEach((O) => {
            _.push(VT1(O[1].ref))
        });
        let w = {
            ref: nC8(Y.ref),
            data: {
                target: z.target,
                state: KB4(z.state),
                calls_started: z.callTracker.callsStarted,
                calls_succeeded: z.callTracker.callsSucceeded,
                calls_failed: z.callTracker.callsFailed,
                last_call_started_timestamp: hg(z.callTracker.lastCallStartedTimestamp),
                trace: z.trace.getTraceMessage()
            },
            socket_ref: _
        };
        q(null, {
            subchannel: w
        })
    }

    function sm4(A) {
        var q;
        if ((0, DJY.isTcpSubchannelAddress)(A)) return {
            address: "tcpip_address",
            tcpip_address: {
                ip_address: (q = TJY(A.host)) !== null && q !== void 0 ? q : void 0,
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

    function yJY(A, q) {
        var K, Y, z, _, w;
        let O = parseInt(A.request.socket_id, 10),
            $ = nc.socket.getElementByKey(O);
        if ($ === void 0) {
            q({
                code: Zd6.Status.NOT_FOUND,
                details: "No socket data found for id " + O
            });
            return
        }
        let H = $.getInfo(),
            j = H.security ? {
                model: "tls",
                tls: {
                    cipher_suite: H.security.cipherSuiteStandardName ? "standard_name" : "other_name",
                    standard_name: (K = H.security.cipherSuiteStandardName) !== null && K !== void 0 ? K : void 0,
                    other_name: (Y = H.security.cipherSuiteOtherName) !== null && Y !== void 0 ? Y : void 0,
                    local_certificate: (z = H.security.localCertificate) !== null && z !== void 0 ? z : void 0,
                    remote_certificate: (_ = H.security.remoteCertificate) !== null && _ !== void 0 ? _ : void 0
                }
            } : null,
            J = {
                ref: VT1($.ref),
                local: H.localAddress ? sm4(H.localAddress) : null,
                remote: H.remoteAddress ? sm4(H.remoteAddress) : null,
                remote_name: (w = H.remoteName) !== null && w !== void 0 ? w : void 0,
                security: j,
                data: {
                    keep_alives_sent: H.keepAlivesSent,
                    streams_started: H.streamsStarted,
                    streams_succeeded: H.streamsSucceeded,
                    streams_failed: H.streamsFailed,
                    last_local_stream_created_timestamp: hg(H.lastLocalStreamCreatedTimestamp),
                    last_remote_stream_created_timestamp: hg(H.lastRemoteStreamCreatedTimestamp),
                    messages_received: H.messagesReceived,
                    messages_sent: H.messagesSent,
                    last_message_received_timestamp: hg(H.lastMessageReceivedTimestamp),
                    last_message_sent_timestamp: hg(H.lastMessageSentTimestamp),
                    local_flow_control_window: H.localFlowControlWindow ? {
                        value: H.localFlowControlWindow
                    } : null,
                    remote_flow_control_window: H.remoteFlowControlWindow ? {
                        value: H.remoteFlowControlWindow
                    } : null
                }
            };
        q(null, {
            socket: J
        })
    }

    function LJY(A, q) {
        let K = parseInt(A.request.server_id, 10),
            Y = nc.server.getElementByKey(K);
        if (Y === void 0) {
            q({
                code: Zd6.Status.NOT_FOUND,
                details: "No server data found for id " + K
            });
            return
        }
        let z = parseInt(A.request.start_socket_id, 10),
            _ = parseInt(A.request.max_results, 10) || rC8,
            O = Y.getInfo().sessionChildren.sockets,
            $ = [],
            H;
        for (H = O.lowerBound(z); !H.equals(O.end()) && $.length < _; H = H.next()) $.push(VT1(H.pointer[1].ref));
        q(null, {
            socket_ref: $,
            end: H.equals(O.end())
        })
    }

    function _B4() {
        return {
            GetChannel: vJY,
            GetTopChannels: NJY,
            GetServer: VJY,
            GetServers: kJY,
            GetSubchannel: EJY,
            GetSocket: yJY,
            GetServerSockets: LJY
        }
    }
    var vT1 = null;

    function wB4() {
        if (vT1) return vT1;
        let A = lC8().loadSync,
            q = A("channelz.proto", {
                keepCase: !0,
                longs: String,
                enums: String,
                defaults: !0,
                oneofs: !0,
                includeDirs: [`${__dirname}/../../proto`]
            });
        return vT1 = (0, PJY.loadPackageDefinition)(q).grpc.channelz.v1.Channelz.service, vT1
    }

    function RJY() {
        (0, XJY.registerAdminService)(wB4, _B4)
    }
})
// @from(Ln 311891, Col 4)
ET1 = x((HB4) => {
    Object.defineProperty(HB4, "__esModule", {
        value: !0
    });
    HB4.getNextCallNumber = dJY;
    var UJY = 0;

    function dJY() {
        return UJY++
    }
})
// @from(Ln 311902, Col 4)
sC8 = x((JB4) => {
    Object.defineProperty(JB4, "__esModule", {
        value: !0
    });
    JB4.CompressionAlgorithms = void 0;
    var jB4;
    (function(A) {
        A[A.identity = 0] = "identity", A[A.deflate = 1] = "deflate", A[A.gzip = 2] = "gzip"
    })(jB4 || (JB4.CompressionAlgorithms = jB4 = {}))
})
// @from(Ln 311912, Col 4)
tC8 = x((XB4) => {
    Object.defineProperty(XB4, "__esModule", {
        value: !0
    });
    XB4.BaseFilter = void 0;
    class DB4 {
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
    XB4.BaseFilter = DB4
})
// @from(Ln 311936, Col 4)
AI8 = x((NB4) => {
    Object.defineProperty(NB4, "__esModule", {
        value: !0
    });
    NB4.CompressionFilterFactory = NB4.CompressionFilter = void 0;
    var yT1 = x6("zlib"),
        ZB4 = sC8(),
        pG6 = a3(),
        lJY = tC8(),
        iJY = zw(),
        nJY = (A) => {
            return typeof A === "number" && typeof ZB4.CompressionAlgorithms[A] === "string"
        };
    class Gd6 {
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
    class QG6 extends Gd6 {
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
    class GB4 extends Gd6 {
        constructor(A) {
            super();
            this.maxRecvMessageLength = A
        }
        compressMessage(A) {
            return new Promise((q, K) => {
                yT1.deflate(A, (Y, z) => {
                    if (Y) K(Y);
                    else q(z)
                })
            })
        }
        decompressMessage(A) {
            return new Promise((q, K) => {
                let Y = 0,
                    z = [],
                    _ = yT1.createInflate();
                _.on("data", (w) => {
                    if (z.push(w), Y += w.byteLength, this.maxRecvMessageLength !== -1 && Y > this.maxRecvMessageLength) _.destroy(), K({
                        code: pG6.Status.RESOURCE_EXHAUSTED,
                        details: `Received message that decompresses to a size larger than ${this.maxRecvMessageLength}`
                    })
                }), _.on("end", () => {
                    q(Buffer.concat(z))
                }), _.write(A), _.end()
            })
        }
    }
    class fB4 extends Gd6 {
        constructor(A) {
            super();
            this.maxRecvMessageLength = A
        }
        compressMessage(A) {
            return new Promise((q, K) => {
                yT1.gzip(A, (Y, z) => {
                    if (Y) K(Y);
                    else q(z)
                })
            })
        }
        decompressMessage(A) {
            return new Promise((q, K) => {
                let Y = 0,
                    z = [],
                    _ = yT1.createGunzip();
                _.on("data", (w) => {
                    if (z.push(w), Y += w.byteLength, this.maxRecvMessageLength !== -1 && Y > this.maxRecvMessageLength) _.destroy(), K({
                        code: pG6.Status.RESOURCE_EXHAUSTED,
                        details: `Received message that decompresses to a size larger than ${this.maxRecvMessageLength}`
                    })
                }), _.on("end", () => {
                    q(Buffer.concat(z))
                }), _.write(A), _.end()
            })
        }
    }
    class TB4 extends Gd6 {
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

    function WB4(A, q) {
        switch (A) {
            case "identity":
                return new QG6;
            case "deflate":
                return new GB4(q);
            case "gzip":
                return new fB4(q);
            default:
                return new TB4(A)
        }
    }
    class eC8 extends lJY.BaseFilter {
        constructor(A, q) {
            var K, Y, z;
            super();
            this.sharedFilterConfig = q, this.sendCompression = new QG6, this.receiveCompression = new QG6, this.currentCompressionAlgorithm = "identity";
            let _ = A["grpc.default_compression_algorithm"];
            if (this.maxReceiveMessageLength = (K = A["grpc.max_receive_message_length"]) !== null && K !== void 0 ? K : pG6.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH, this.maxSendMessageLength = (Y = A["grpc.max_send_message_length"]) !== null && Y !== void 0 ? Y : pG6.DEFAULT_MAX_SEND_MESSAGE_LENGTH, _ !== void 0)
                if (nJY(_)) {
                    let w = ZB4.CompressionAlgorithms[_],
                        O = (z = q.serverSupportedEncodingHeader) === null || z === void 0 ? void 0 : z.split(",");
                    if (!O || O.includes(w)) this.currentCompressionAlgorithm = w, this.sendCompression = WB4(this.currentCompressionAlgorithm, -1)
                } else iJY.log(pG6.LogVerbosity.ERROR, `Invalid value provided for grpc.default_compression_algorithm option: ${_}`)
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
                if (typeof Y === "string") this.receiveCompression = WB4(Y, this.maxReceiveMessageLength)
            }
            A.remove("grpc-encoding");
            let K = A.get("grpc-accept-encoding")[0];
            if (K) {
                if (this.sharedFilterConfig.serverSupportedEncodingHeader = K, !K.split(",").includes(this.currentCompressionAlgorithm)) this.sendCompression = new QG6, this.currentCompressionAlgorithm = "identity"
            }
            return A.remove("grpc-accept-encoding"), A
        }
        async sendMessage(A) {
            var q;
            let K = await A;
            if (this.maxSendMessageLength !== -1 && K.message.length > this.maxSendMessageLength) throw {
                code: pG6.Status.RESOURCE_EXHAUSTED,
                details: `Attempted to send message with a size larger than ${this.maxSendMessageLength}`
            };
            let Y;
            if (this.sendCompression instanceof QG6) Y = !1;
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
    NB4.CompressionFilter = eC8;
    class vB4 {
        constructor(A, q) {
            this.options = q, this.sharedFilterConfig = {}
        }
        createFilter() {
            return new eC8(this.options, this.sharedFilterConfig)
        }
    }
    NB4.CompressionFilterFactory = vB4
})
// @from(Ln 312120, Col 4)
fd6 = x((kB4) => {
    Object.defineProperty(kB4, "__esModule", {
        value: !0
    });
    kB4.restrictControlPlaneStatusCode = aJY;
    var Sg = a3(),
        oJY = [Sg.Status.OK, Sg.Status.INVALID_ARGUMENT, Sg.Status.NOT_FOUND, Sg.Status.ALREADY_EXISTS, Sg.Status.FAILED_PRECONDITION, Sg.Status.ABORTED, Sg.Status.OUT_OF_RANGE, Sg.Status.DATA_LOSS];

    function aJY(A, q) {
        if (oJY.includes(A)) return {
            code: Sg.Status.INTERNAL,
            details: `Invalid status from control plane: ${A} ${Sg.Status[A]} ${q}`
        };
        else return {
            code: A,
            details: q
        }
    }
})
// @from(Ln 312139, Col 4)
UG6 = x((EB4) => {
    Object.defineProperty(EB4, "__esModule", {
        value: !0
    });
    EB4.minDeadline = tJY;
    EB4.getDeadlineTimeoutString = AMY;
    EB4.getRelativeTimeout = KMY;
    EB4.deadlineToString = YMY;
    EB4.formatDateDifference = zMY;

    function tJY(...A) {
        let q = 1 / 0;
        for (let K of A) {
            let Y = K instanceof Date ? K.getTime() : K;
            if (Y < q) q = Y
        }
        return q
    }
    var eJY = [
        ["m", 1],
        ["S", 1000],
        ["M", 60000],
        ["H", 3600000]
    ];

    function AMY(A) {
        let q = new Date().getTime();
        if (A instanceof Date) A = A.getTime();
        let K = Math.max(A - q, 0);
        for (let [Y, z] of eJY) {
            let _ = K / z;
            if (_ < 1e8) return String(Math.ceil(_)) + Y
        }
        throw Error("Deadline is too far in the future")
    }
    var qMY = 2147483647;

    function KMY(A) {
        let q = A instanceof Date ? A.getTime() : A,
            K = new Date().getTime(),
            Y = q - K;
        if (Y < 0) return 0;
        else if (Y > qMY) return 1 / 0;
        else return Y
    }

    function YMY(A) {
        if (A instanceof Date) return A.toISOString();
        else {
            let q = new Date(A);
            if (Number.isNaN(q.getTime())) return "" + A;
            else return q.toISOString()
        }
    }

    function zMY(A, q) {
        return ((q.getTime() - A.getTime()) / 1000).toFixed(3) + "s"
    }
})
// @from(Ln 312198, Col 4)
LT1 = x((yB4) => {
    Object.defineProperty(yB4, "__esModule", {
        value: !0
    });
    yB4.FilterStackFactory = yB4.FilterStack = void 0;
    class qI8 {
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
    yB4.FilterStack = qI8;
    class KI8 {
        constructor(A) {
            this.factories = A
        }
        push(A) {
            this.factories.unshift(...A)
        }
        clone() {
            return new KI8([...this.factories])
        }
        createFilter() {
            return new qI8(this.factories.map((A) => A.createFilter()))
        }
    }
    yB4.FilterStackFactory = KI8
})
// @from(Ln 312256, Col 4)
IB4 = x((SB4) => {
    Object.defineProperty(SB4, "__esModule", {
        value: !0
    });
    SB4.SingleSubchannelChannel = void 0;
    var JMY = ET1(),
        Td6 = ae(),
        MMY = AI8(),
        DMY = Vf(),
        vd6 = a3(),
        XMY = fd6(),
        PMY = UG6(),
        WMY = LT1(),
        YI8 = LX(),
        ZMY = Ob(),
        RT1 = Nf();
    class RB4 {
        constructor(A, q, K, Y, z) {
            var _, w;
            this.subchannel = A, this.method = q, this.options = Y, this.callNumber = z, this.childCall = null, this.pendingMessage = null, this.readPending = !1, this.halfClosePending = !1, this.pendingStatus = null, this.readFilterPending = !1, this.writeFilterPending = !1;
            let O = this.method.split("/"),
                $ = "";
            if (O.length >= 2) $ = O[1];
            let H = (w = (_ = (0, RT1.splitHostPort)(this.options.host)) === null || _ === void 0 ? void 0 : _.host) !== null && w !== void 0 ? w : "localhost";
            this.serviceUrl = `https://${H}/${$}`;
            let j = (0, PMY.getRelativeTimeout)(Y.deadline);
            if (j !== 1 / 0)
                if (j <= 0) this.cancelWithStatus(vd6.Status.DEADLINE_EXCEEDED, "Deadline exceeded");
                else setTimeout(() => {
                    this.cancelWithStatus(vd6.Status.DEADLINE_EXCEEDED, "Deadline exceeded")
                }, j);
            this.filterStack = K.createFilter()
        }
        cancelWithStatus(A, q) {
            if (this.childCall) this.childCall.cancelWithStatus(A, q);
            else this.pendingStatus = {
                code: A,
                details: q,
                metadata: new YI8.Metadata
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
            if (this.subchannel.getConnectivityState() !== DMY.ConnectivityState.READY) {
                q.onReceiveStatus({
                    code: vd6.Status.UNAVAILABLE,
                    details: "Subchannel not ready",
                    metadata: new YI8.Metadata
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
            } catch (_) {
                let w = _,
                    {
                        code: O,
                        details: $
                    } = (0, XMY.restrictControlPlaneStatusCode)(typeof w.code === "number" ? w.code : vd6.Status.UNKNOWN, `Getting metadata from plugin failed with error: ${w.message}`);
                q.onReceiveStatus({
                    code: O,
                    details: $,
                    metadata: new YI8.Metadata
                });
                return
            }
            Y.merge(K);
            let z = {
                onReceiveMetadata: async (_) => {
                    q.onReceiveMetadata(await this.filterStack.receiveMetadata(_))
                },
                onReceiveMessage: async (_) => {
                    this.readFilterPending = !0;
                    let w = await this.filterStack.receiveMessage(_);
                    if (this.readFilterPending = !1, q.onReceiveMessage(w), this.pendingStatus) q.onReceiveStatus(this.pendingStatus)
                },
                onReceiveStatus: async (_) => {
                    let w = await this.filterStack.receiveTrailers(_);
                    if (this.readFilterPending) this.pendingStatus = w;
                    else q.onReceiveStatus(w)
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
    class hB4 {
        constructor(A, q, K) {
            if (this.subchannel = A, this.target = q, this.channelzEnabled = !1, this.channelzTrace = new Td6.ChannelzTrace, this.callTracker = new Td6.ChannelzCallTracker, this.childrenTracker = new Td6.ChannelzChildrenTracker, this.channelzEnabled = K["grpc.enable_channelz"] !== 0, this.channelzRef = (0, Td6.registerChannelzChannel)((0, RT1.uriToString)(q), () => ({
                    target: `${(0,RT1.uriToString)(q)} (${A.getAddress()})`,
                    state: this.subchannel.getConnectivityState(),
                    trace: this.channelzTrace,
                    callTracker: this.callTracker,
                    children: this.childrenTracker.getChildLists()
                }), this.channelzEnabled), this.channelzEnabled) this.childrenTracker.refChild(A.getChannelzRef());
            this.filterStackFactory = new WMY.FilterStackFactory([new MMY.CompressionFilterFactory(this, K)])
        }
        close() {
            if (this.channelzEnabled) this.childrenTracker.unrefChild(this.subchannel.getChannelzRef());
            (0, Td6.unregisterChannelzRef)(this.channelzRef)
        }
        getTarget() {
            return (0, RT1.uriToString)(this.target)
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
                host: (0, ZMY.getDefaultAuthority)(this.target),
                flags: vd6.Propagate.DEFAULTS,
                parentCall: null
            };
            return new RB4(this.subchannel, A, this.filterStackFactory, K, (0, JMY.getNextCallNumber)())
        }
    }
    SB4.SingleSubchannelChannel = hB4
})
// @from(Ln 312425, Col 4)
mB4 = x((xB4) => {
    Object.defineProperty(xB4, "__esModule", {
        value: !0
    });
    xB4.Subchannel = void 0;
    var T2 = Vf(),
        GMY = RG6(),
        zI8 = zw(),
        hT1 = a3(),
        fMY = Nf(),
        TMY = _N(),
        Cg = ae(),
        vMY = IB4(),
        NMY = "subchannel",
        VMY = 2147483647;
    class bB4 {
        constructor(A, q, K, Y, z) {
            var _;
            this.channelTarget = A, this.subchannelAddress = q, this.options = K, this.connector = z, this.connectivityState = T2.ConnectivityState.IDLE, this.transport = null, this.continueConnecting = !1, this.stateListeners = new Set, this.refcount = 0, this.channelzEnabled = !0, this.dataProducers = new Map, this.subchannelChannel = null;
            let w = {
                initialDelay: K["grpc.initial_reconnect_backoff_ms"],
                maxDelay: K["grpc.max_reconnect_backoff_ms"]
            };
            if (this.backoffTimeout = new GMY.BackoffTimeout(() => {
                    this.handleBackoffTimer()
                }, w), this.backoffTimeout.unref(), this.subchannelAddressString = (0, TMY.subchannelAddressToString)(q), this.keepaliveTime = (_ = K["grpc.keepalive_time_ms"]) !== null && _ !== void 0 ? _ : -1, K["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.channelzTrace = new Cg.ChannelzTraceStub, this.callTracker = new Cg.ChannelzCallTrackerStub, this.childrenTracker = new Cg.ChannelzChildrenTrackerStub, this.streamTracker = new Cg.ChannelzCallTrackerStub;
            else this.channelzTrace = new Cg.ChannelzTrace, this.callTracker = new Cg.ChannelzCallTracker, this.childrenTracker = new Cg.ChannelzChildrenTracker, this.streamTracker = new Cg.ChannelzCallTracker;
            this.channelzRef = (0, Cg.registerChannelzSubchannel)(this.subchannelAddressString, () => this.getChannelzInfo(), this.channelzEnabled), this.channelzTrace.addTrace("CT_INFO", "Subchannel created"), this.trace("Subchannel constructed with options " + JSON.stringify(K, void 0, 2)), this.secureConnector = Y._createSecureConnector(A, K)
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
            zI8.trace(hT1.LogVerbosity.DEBUG, NMY, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
        }
        refTrace(A) {
            zI8.trace(hT1.LogVerbosity.DEBUG, "subchannel_refcount", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
        }
        handleBackoffTimer() {
            if (this.continueConnecting) this.transitionToState([T2.ConnectivityState.TRANSIENT_FAILURE], T2.ConnectivityState.CONNECTING);
            else this.transitionToState([T2.ConnectivityState.TRANSIENT_FAILURE], T2.ConnectivityState.IDLE)
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
                let q = Math.min(this.keepaliveTime, VMY);
                A = Object.assign(Object.assign({}, A), {
                    "grpc.keepalive_time_ms": q
                })
            }
            this.connector.connect(this.subchannelAddress, this.secureConnector, A).then((q) => {
                if (this.transitionToState([T2.ConnectivityState.CONNECTING], T2.ConnectivityState.READY)) {
                    if (this.transport = q, this.channelzEnabled) this.childrenTracker.refChild(q.getChannelzRef());
                    q.addDisconnectListener((K) => {
                        if (this.transitionToState([T2.ConnectivityState.READY], T2.ConnectivityState.IDLE), K && this.keepaliveTime > 0) this.keepaliveTime *= 2, zI8.log(hT1.LogVerbosity.ERROR, `Connection to ${(0,fMY.uriToString)(this.channelTarget)} at ${this.subchannelAddressString} rejected by server because of excess pings. Increasing ping interval to ${this.keepaliveTime} ms`)
                    })
                } else q.shutdown()
            }, (q) => {
                this.transitionToState([T2.ConnectivityState.CONNECTING], T2.ConnectivityState.TRANSIENT_FAILURE, `${q}`)
            })
        }
        transitionToState(A, q, K) {
            var Y, z;
            if (A.indexOf(this.connectivityState) === -1) return !1;
            if (K) this.trace(T2.ConnectivityState[this.connectivityState] + " -> " + T2.ConnectivityState[q] + ' with error "' + K + '"');
            else this.trace(T2.ConnectivityState[this.connectivityState] + " -> " + T2.ConnectivityState[q]);
            if (this.channelzEnabled) this.channelzTrace.addTrace("CT_INFO", "Connectivity state change to " + T2.ConnectivityState[q]);
            let _ = this.connectivityState;
            switch (this.connectivityState = q, q) {
                case T2.ConnectivityState.READY:
                    this.stopBackoff();
                    break;
                case T2.ConnectivityState.CONNECTING:
                    this.startBackoff(), this.startConnectingInternal(), this.continueConnecting = !1;
                    break;
                case T2.ConnectivityState.TRANSIENT_FAILURE:
                    if (this.channelzEnabled && this.transport) this.childrenTracker.unrefChild(this.transport.getChannelzRef());
                    if ((Y = this.transport) === null || Y === void 0 || Y.shutdown(), this.transport = null, !this.backoffTimeout.isRunning()) process.nextTick(() => {
                        this.handleBackoffTimer()
                    });
                    break;
                case T2.ConnectivityState.IDLE:
                    if (this.channelzEnabled && this.transport) this.childrenTracker.unrefChild(this.transport.getChannelzRef());
                    (z = this.transport) === null || z === void 0 || z.shutdown(), this.transport = null;
                    break;
                default:
                    throw Error(`Invalid state: unknown ConnectivityState ${q}`)
            }
            for (let w of this.stateListeners) w(this, _, q, this.keepaliveTime, K);
            return !0
        }
        ref() {
            this.refTrace("refcount " + this.refcount + " -> " + (this.refcount + 1)), this.refcount += 1
        }
        unref() {
            if (this.refTrace("refcount " + this.refcount + " -> " + (this.refcount - 1)), this.refcount -= 1, this.refcount === 0) this.channelzTrace.addTrace("CT_INFO", "Shutting down"), (0, Cg.unregisterChannelzRef)(this.channelzRef), this.secureConnector.destroy(), process.nextTick(() => {
                this.transitionToState([T2.ConnectivityState.CONNECTING, T2.ConnectivityState.READY], T2.ConnectivityState.IDLE)
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
                onCallEnd: (_) => {
                    if (_.code === hT1.Status.OK) this.callTracker.addCallSucceeded();
                    else this.callTracker.addCallFailed()
                }
            };
            else z = {};
            return this.transport.createCall(A, q, K, Y, z)
        }
        startConnecting() {
            process.nextTick(() => {
                if (!this.transitionToState([T2.ConnectivityState.IDLE], T2.ConnectivityState.CONNECTING)) {
                    if (this.connectivityState === T2.ConnectivityState.TRANSIENT_FAILURE) this.continueConnecting = !0
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
                this.backoffTimeout.reset(), this.transitionToState([T2.ConnectivityState.TRANSIENT_FAILURE], T2.ConnectivityState.CONNECTING)
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
            if (!this.subchannelChannel) this.subchannelChannel = new vMY.SingleSubchannelChannel(this, this.channelTarget, this.options);
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
    xB4.Subchannel = bB4
})
// @from(Ln 312615, Col 4)
FB4 = x((BB4) => {
    var _I8;
    Object.defineProperty(BB4, "__esModule", {
        value: !0
    });
    BB4.GRPC_NODE_USE_ALTERNATIVE_RESOLVER = void 0;
    BB4.GRPC_NODE_USE_ALTERNATIVE_RESOLVER = ((_I8 = process.env.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) !== null && _I8 !== void 0 ? _I8 : "false") === "true"
})
// @from(Ln 312623, Col 4)
$I8 = x((cB4) => {
    Object.defineProperty(cB4, "__esModule", {
        value: !0
    });
    cB4.DEFAULT_PORT = void 0;
    cB4.setup = CMY;
    var pB4 = Ob(),
        wI8 = x6("dns"),
        kMY = cS8(),
        OI8 = a3(),
        dG6 = MY6(),
        EMY = LX(),
        yMY = zw(),
        LMY = a3(),
        se = Nf(),
        QB4 = x6("net"),
        RMY = RG6(),
        UB4 = FB4(),
        hMY = "dns_resolver";

    function Ig(A) {
        yMY.trace(LMY.LogVerbosity.DEBUG, hMY, A)
    }
    cB4.DEFAULT_PORT = 443;
    var SMY = 30000;
    class dB4 {
        constructor(A, q, K) {
            var Y, z, _;
            if (this.target = A, this.listener = q, this.pendingLookupPromise = null, this.pendingTxtPromise = null, this.latestLookupResult = null, this.latestServiceConfigResult = null, this.continueResolving = !1, this.isNextResolutionTimerRunning = !1, this.isServiceConfigEnabled = !0, this.returnedIpResult = !1, this.alternativeResolver = new wI8.promises.Resolver, Ig("Resolver constructed for target " + (0, se.uriToString)(A)), A.authority) this.alternativeResolver.setServers([A.authority]);
            let w = (0, se.splitHostPort)(A.path);
            if (w === null) this.ipResult = null, this.dnsHostname = null, this.port = null;
            else if ((0, QB4.isIPv4)(w.host) || (0, QB4.isIPv6)(w.host)) this.ipResult = [{
                addresses: [{
                    host: w.host,
                    port: (Y = w.port) !== null && Y !== void 0 ? Y : cB4.DEFAULT_PORT
                }]
            }], this.dnsHostname = null, this.port = null;
            else this.ipResult = null, this.dnsHostname = w.host, this.port = (z = w.port) !== null && z !== void 0 ? z : cB4.DEFAULT_PORT;
            if (this.percentage = Math.random() * 100, K["grpc.service_config_disable_resolution"] === 1) this.isServiceConfigEnabled = !1;
            this.defaultResolutionError = {
                code: OI8.Status.UNAVAILABLE,
                details: `Name resolution failed for target ${(0,se.uriToString)(this.target)}`,
                metadata: new EMY.Metadata
            };
            let O = {
                initialDelay: K["grpc.initial_reconnect_backoff_ms"],
                maxDelay: K["grpc.max_reconnect_backoff_ms"]
            };
            this.backoff = new RMY.BackoffTimeout(() => {
                if (this.continueResolving) this.startResolutionWithBackoff()
            }, O), this.backoff.unref(), this.minTimeBetweenResolutionsMs = (_ = K["grpc.dns_min_time_between_resolutions_ms"]) !== null && _ !== void 0 ? _ : SMY, this.nextResolutionTimer = setTimeout(() => {}, 0), clearTimeout(this.nextResolutionTimer)
        }
        startResolution() {
            if (this.ipResult !== null) {
                if (!this.returnedIpResult) Ig("Returning IP address for target " + (0, se.uriToString)(this.target)), setImmediate(() => {
                    this.listener((0, dG6.statusOrFromValue)(this.ipResult), {}, null, "")
                }), this.returnedIpResult = !0;
                this.backoff.stop(), this.backoff.reset(), this.stopNextResolutionTimer();
                return
            }
            if (this.dnsHostname === null) Ig("Failed to parse DNS address " + (0, se.uriToString)(this.target)), setImmediate(() => {
                this.listener((0, dG6.statusOrFromError)({
                    code: OI8.Status.UNAVAILABLE,
                    details: `Failed to parse DNS address ${(0,se.uriToString)(this.target)}`
                }), {}, null, "")
            }), this.stopNextResolutionTimer();
            else {
                if (this.pendingLookupPromise !== null) return;
                Ig("Looking up DNS hostname " + this.dnsHostname), this.latestLookupResult = null;
                let A = this.dnsHostname;
                if (this.pendingLookupPromise = this.lookup(A), this.pendingLookupPromise.then((q) => {
                        if (this.pendingLookupPromise === null) return;
                        this.pendingLookupPromise = null, this.latestLookupResult = (0, dG6.statusOrFromValue)(q.map((z) => ({
                            addresses: [z]
                        })));
                        let K = "[" + q.map((z) => z.host + ":" + z.port).join(",") + "]";
                        Ig("Resolved addresses for target " + (0, se.uriToString)(this.target) + ": " + K);
                        let Y = this.listener(this.latestLookupResult, {}, this.latestServiceConfigResult, "");
                        this.handleHealthStatus(Y)
                    }, (q) => {
                        if (this.pendingLookupPromise === null) return;
                        Ig("Resolution error for target " + (0, se.uriToString)(this.target) + ": " + q.message), this.pendingLookupPromise = null, this.stopNextResolutionTimer(), this.listener((0, dG6.statusOrFromError)(this.defaultResolutionError), {}, this.latestServiceConfigResult, "")
                    }), this.isServiceConfigEnabled && this.pendingTxtPromise === null) this.pendingTxtPromise = this.resolveTxt(A), this.pendingTxtPromise.then((q) => {
                    if (this.pendingTxtPromise === null) return;
                    this.pendingTxtPromise = null;
                    let K;
                    try {
                        if (K = (0, kMY.extractAndSelectServiceConfig)(q, this.percentage), K) this.latestServiceConfigResult = (0, dG6.statusOrFromValue)(K);
                        else this.latestServiceConfigResult = null
                    } catch (Y) {
                        this.latestServiceConfigResult = (0, dG6.statusOrFromError)({
                            code: OI8.Status.UNAVAILABLE,
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
            if (UB4.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) {
                Ig("Using alternative DNS resolver.");
                let K = await Promise.allSettled([this.alternativeResolver.resolve4(A), this.alternativeResolver.resolve6(A)]);
                if (K.every((Y) => Y.status === "rejected")) throw Error(K[0].reason);
                return K.reduce((Y, z) => {
                    return z.status === "fulfilled" ? [...Y, ...z.value] : Y
                }, []).map((Y) => ({
                    host: Y,
                    port: +this.port
                }))
            }
            return (await wI8.promises.lookup(A, {
                all: !0
            })).map((K) => ({
                host: K.address,
                port: +this.port
            }))
        }
        async resolveTxt(A) {
            if (UB4.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) return Ig("Using alternative DNS resolver."), this.alternativeResolver.resolveTxt(A);
            return wI8.promises.resolveTxt(A)
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
                    if (this.isNextResolutionTimerRunning) Ig('resolution update delayed by "min time between resolutions" rate limit');
                    else Ig("resolution update delayed by backoff timer until " + this.backoff.getEndTime().toISOString());
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

    function CMY() {
        (0, pB4.registerResolver)("dns", dB4), (0, pB4.registerDefaultScheme)("dns")
    }
})
// @from(Ln 312781, Col 4)
HI8 = x((oB4) => {
    Object.defineProperty(oB4, "__esModule", {
        value: !0
    });
    oB4.parseCIDR = nB4;
    oB4.mapProxyName = UMY;
    oB4.getProxiedConnection = dMY;
    var Nd6 = zw(),
        cG6 = a3(),
        iB4 = x6("net"),
        bMY = x6("http"),
        xMY = zw(),
        lB4 = _N(),
        Vd6 = Nf(),
        uMY = x6("url"),
        mMY = $I8(),
        BMY = "proxy";

    function lG6(A) {
        xMY.trace(cG6.LogVerbosity.DEBUG, BMY, A)
    }

    function gMY() {
        let A = "",
            q = "";
        if (process.env.grpc_proxy) q = "grpc_proxy", A = process.env.grpc_proxy;
        else if (process.env.https_proxy) q = "https_proxy", A = process.env.https_proxy;
        else if (process.env.http_proxy) q = "http_proxy", A = process.env.http_proxy;
        else return {};
        let K;
        try {
            K = new uMY.URL(A)
        } catch (O) {
            return (0, Nd6.log)(cG6.LogVerbosity.ERROR, `cannot parse value of "${q}" env var`), {}
        }
        if (K.protocol !== "http:") return (0, Nd6.log)(cG6.LogVerbosity.ERROR, `"${K.protocol}" scheme not supported in proxy URI`), {};
        let Y = null;
        if (K.username)
            if (K.password)(0, Nd6.log)(cG6.LogVerbosity.INFO, "userinfo found in proxy URI"), Y = decodeURIComponent(`${K.username}:${K.password}`);
            else Y = K.username;
        let {
            hostname: z,
            port: _
        } = K;
        if (_ === "") _ = "80";
        let w = {
            address: `${z}:${_}`
        };
        if (Y) w.creds = Y;
        return lG6("Proxy server " + w.address + " set by environment variable " + q), w
    }

    function FMY() {
        let A = process.env.no_grpc_proxy,
            q = "no_grpc_proxy";
        if (!A) A = process.env.no_proxy, q = "no_proxy";
        if (A) return lG6("No proxy server list set by environment variable " + q), A.split(",");
        else return []
    }

    function nB4(A) {
        let q = A.split("/");
        if (q.length !== 2) return null;
        let K = parseInt(q[1], 10);
        if (!(0, iB4.isIPv4)(q[0]) || Number.isNaN(K) || K < 0 || K > 32) return null;
        return {
            ip: rB4(q[0]),
            prefixLength: K
        }
    }

    function rB4(A) {
        return A.split(".").reduce((q, K) => (q << 8) + parseInt(K, 10), 0)
    }

    function pMY(A, q) {
        let K = A.ip,
            Y = -1 << 32 - A.prefixLength;
        return (rB4(q) & Y) === (K & Y)
    }

    function QMY(A) {
        for (let q of FMY()) {
            let K = nB4(q);
            if ((0, iB4.isIPv4)(A) && K && pMY(K, A)) return !0;
            else if (A.endsWith(q)) return !0
        }
        return !1
    }

    function UMY(A, q) {
        var K;
        let Y = {
            target: A,
            extraOptions: {}
        };
        if (((K = q["grpc.enable_http_proxy"]) !== null && K !== void 0 ? K : 1) === 0) return Y;
        if (A.scheme === "unix") return Y;
        let z = gMY();
        if (!z.address) return Y;
        let _ = (0, Vd6.splitHostPort)(A.path);
        if (!_) return Y;
        let w = _.host;
        if (QMY(w)) return lG6("Not using proxy for target in no_proxy list: " + (0, Vd6.uriToString)(A)), Y;
        let O = {
            "grpc.http_connect_target": (0, Vd6.uriToString)(A)
        };
        if (z.creds) O["grpc.http_connect_creds"] = z.creds;
        return {
            target: {
                scheme: "dns",
                path: z.address
            },
            extraOptions: O
        }
    }

    function dMY(A, q) {
        var K;
        if (!("grpc.http_connect_target" in q)) return Promise.resolve(null);
        let Y = q["grpc.http_connect_target"],
            z = (0, Vd6.parseUri)(Y);
        if (z === null) return Promise.resolve(null);
        let _ = (0, Vd6.splitHostPort)(z.path);
        if (_ === null) return Promise.resolve(null);
        let w = `${_.host}:${(K=_.port)!==null&&K!==void 0?K:mMY.DEFAULT_PORT}`,
            O = {
                method: "CONNECT",
                path: w
            },
            $ = {
                Host: w
            };
        if ((0, lB4.isTcpSubchannelAddress)(A)) O.host = A.host, O.port = A.port;
        else O.socketPath = A.path;
        if ("grpc.http_connect_creds" in q) $["Proxy-Authorization"] = "Basic " + Buffer.from(q["grpc.http_connect_creds"]).toString("base64");
        O.headers = $;
        let H = (0, lB4.subchannelAddressToString)(A);
        return lG6("Using proxy " + H + " to connect to " + O.path), new Promise((j, J) => {
            let M = bMY.request(O);
            M.once("connect", (D, X, P) => {
                if (M.removeAllListeners(), X.removeAllListeners(), D.statusCode === 200) {
                    if (lG6("Successfully connected to " + O.path + " through proxy " + H), P.length > 0) X.unshift(P);
                    lG6("Successfully established a plaintext connection to " + O.path + " through proxy " + H), j(X)
                } else(0, Nd6.log)(cG6.LogVerbosity.ERROR, "Failed to connect to " + O.path + " through proxy " + H + " with status " + D.statusCode), J()
            }), M.once("error", (D) => {
                M.removeAllListeners(), (0, Nd6.log)(cG6.LogVerbosity.ERROR, "Failed to connect to proxy " + H + " with error " + D.message), J()
            }), M.end()
        })
    }
})
// @from(Ln 312932, Col 4)
jI8 = x((sB4) => {
    Object.defineProperty(sB4, "__esModule", {
        value: !0
    });
    sB4.StreamDecoder = void 0;
    var bg;
    (function(A) {
        A[A.NO_DATA = 0] = "NO_DATA", A[A.READING_SIZE = 1] = "READING_SIZE", A[A.READING_MESSAGE = 2] = "READING_MESSAGE"
    })(bg || (bg = {}));
    class aB4 {
        constructor(A) {
            this.maxReadMessageLength = A, this.readState = bg.NO_DATA, this.readCompressFlag = Buffer.alloc(1), this.readPartialSize = Buffer.alloc(4), this.readSizeRemaining = 4, this.readMessageSize = 0, this.readPartialMessage = [], this.readMessageRemaining = 0
        }
        write(A) {
            let q = 0,
                K, Y = [];
            while (q < A.length) switch (this.readState) {
                case bg.NO_DATA:
                    this.readCompressFlag = A.slice(q, q + 1), q += 1, this.readState = bg.READING_SIZE, this.readPartialSize.fill(0), this.readSizeRemaining = 4, this.readMessageSize = 0, this.readMessageRemaining = 0, this.readPartialMessage = [];
                    break;
                case bg.READING_SIZE:
                    if (K = Math.min(A.length - q, this.readSizeRemaining), A.copy(this.readPartialSize, 4 - this.readSizeRemaining, q, q + K), this.readSizeRemaining -= K, q += K, this.readSizeRemaining === 0) {
                        if (this.readMessageSize = this.readPartialSize.readUInt32BE(0), this.maxReadMessageLength !== -1 && this.readMessageSize > this.maxReadMessageLength) throw Error(`Received message larger than max (${this.readMessageSize} vs ${this.maxReadMessageLength})`);
                        if (this.readMessageRemaining = this.readMessageSize, this.readMessageRemaining > 0) this.readState = bg.READING_MESSAGE;
                        else {
                            let z = Buffer.concat([this.readCompressFlag, this.readPartialSize], 5);
                            this.readState = bg.NO_DATA, Y.push(z)
                        }
                    }
                    break;
                case bg.READING_MESSAGE:
                    if (K = Math.min(A.length - q, this.readMessageRemaining), this.readPartialMessage.push(A.slice(q, q + K)), this.readMessageRemaining -= K, q += K, this.readMessageRemaining === 0) {
                        let z = [this.readCompressFlag, this.readPartialSize].concat(this.readPartialMessage),
                            _ = Buffer.concat(z, this.readMessageSize + 5);
                        this.readState = bg.NO_DATA, Y.push(_)
                    }
                    break;
                default:
                    throw Error("Unexpected read state")
            }
            return Y
        }
    }
    sB4.StreamDecoder = aB4
})