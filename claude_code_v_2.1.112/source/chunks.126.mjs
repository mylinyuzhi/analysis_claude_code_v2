
// @from(Ln 315117, Col 4)
V7K = p((v7K) => {
    Object.defineProperty(v7K, "__esModule", {
        value: !0
    });
    v7K.addCommonProtos = v7K.loadProtosWithOptionsSync = v7K.loadProtosWithOptions = void 0;
    var Z7K = d6("fs"),
        f7K = d6("path"),
        hS6 = PB8();

    function G7K(q, K) {
        let _ = q.resolvePath;
        q.resolvePath = (z, Y) => {
            if (f7K.isAbsolute(Y)) return Y;
            for (let A of K) {
                let O = f7K.join(A, Y);
                try {
                    return Z7K.accessSync(O, Z7K.constants.R_OK), O
                } catch (w) {
                    continue
                }
            }
            return process.emitWarning(`${Y} not found in any of the include paths ${K}`), _(z, Y)
        }
    }
    async function oFz(q, K) {
        let _ = new hS6.Root;
        if (K = K || {}, K.includeDirs) {
            if (!Array.isArray(K.includeDirs)) return Promise.reject(Error("The includeDirs option must be an array"));
            G7K(_, K.includeDirs)
        }
        let z = await _.load(q, K);
        return z.resolveAll(), z
    }
    v7K.loadProtosWithOptions = oFz;

    function aFz(q, K) {
        let _ = new hS6.Root;
        if (K = K || {}, K.includeDirs) {
            if (!Array.isArray(K.includeDirs)) throw Error("The includeDirs option must be an array");
            G7K(_, K.includeDirs)
        }
        let z = _.loadSync(q, K);
        return z.resolveAll(), z
    }
    v7K.loadProtosWithOptionsSync = aFz;

    function sFz() {
        let q = P7K(),
            K = Ge1(),
            _ = W7K(),
            z = D7K();
        hS6.common("api", q.nested.google.nested.protobuf.nested), hS6.common("descriptor", K.nested.google.nested.protobuf.nested), hS6.common("source_context", _.nested.google.nested.protobuf.nested), hS6.common("type", z.nested.google.nested.protobuf.nested)
    }
    v7K.addCommonProtos = sFz
})
// @from(Ln 315172, Col 4)
k7K = p((Hq8, Te1) => {
    (function(q, K) {
        function _(z) {
            return "default" in z ? z.default : z
        }
        if (typeof define === "function" && define.amd) define([], function() {
            var z = {};
            return K(z), _(z)
        });
        else if (typeof Hq8 === "object") {
            if (K(Hq8), typeof Te1 === "object") Te1.exports = _(Hq8)
        } else(function() {
            var z = {};
            K(z), q.Long = _(z)
        })()
    })(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : Hq8, function(q) {
        Object.defineProperty(q, "__esModule", {
            value: !0
        }), q.default = void 0;
        var K = null;
        try {
            K = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports
        } catch {}

        function _(m, S, F) {
            this.low = m | 0, this.high = S | 0, this.unsigned = !!F
        }
        _.prototype.__isLong__, Object.defineProperty(_.prototype, "__isLong__", {
            value: !0
        });

        function z(m) {
            return (m && m.__isLong__) === !0
        }

        function Y(m) {
            var S = Math.clz32(m & -m);
            return m ? 31 - S : S
        }
        _.isLong = z;
        var A = {},
            O = {};

        function w(m, S) {
            var F, U, g;
            if (S) {
                if (m >>>= 0, g = 0 <= m && m < 256) {
                    if (U = O[m], U) return U
                }
                if (F = j(m, 0, !0), g) O[m] = F;
                return F
            } else {
                if (m |= 0, g = -128 <= m && m < 128) {
                    if (U = A[m], U) return U
                }
                if (F = j(m, m < 0 ? -1 : 0, !1), g) A[m] = F;
                return F
            }
        }
        _.fromInt = w;

        function $(m, S) {
            if (isNaN(m)) return S ? v : f;
            if (S) {
                if (m < 0) return v;
                if (m >= D) return h
            } else {
                if (m <= -Z) return C;
                if (m + 1 >= Z) return R
            }
            if (m < 0) return $(-m, S).neg();
            return j(m % W | 0, m / W | 0, S)
        }
        _.fromNumber = $;

        function j(m, S, F) {
            return new _(m, S, F)
        }
        _.fromBits = j;
        var H = Math.pow;

        function J(m, S, F) {
            if (m.length === 0) throw Error("empty string");
            if (typeof S === "number") F = S, S = !1;
            else S = !!S;
            if (m === "NaN" || m === "Infinity" || m === "+Infinity" || m === "-Infinity") return S ? v : f;
            if (F = F || 10, F < 2 || 36 < F) throw RangeError("radix");
            var U;
            if ((U = m.indexOf("-")) > 0) throw Error("interior hyphen");
            else if (U === 0) return J(m.substring(1), S, F).neg();
            var g = $(H(F, 8)),
                c = f;
            for (var n = 0; n < m.length; n += 8) {
                var l = Math.min(8, m.length - n),
                    z6 = parseInt(m.substring(n, n + l), F);
                if (l < 8) {
                    var A6 = $(H(F, l));
                    c = c.mul(A6).add($(z6))
                } else c = c.mul(g), c = c.add($(z6))
            }
            return c.unsigned = S, c
        }
        _.fromString = J;

        function X(m, S) {
            if (typeof m === "number") return $(m, S);
            if (typeof m === "string") return J(m, S);
            return j(m.low, m.high, typeof S === "boolean" ? S : m.unsigned)
        }
        _.fromValue = X;
        var M = 65536,
            P = 16777216,
            W = M * M,
            D = W * W,
            Z = D / 2,
            G = w(P),
            f = w(0);
        _.ZERO = f;
        var v = w(0, !0);
        _.UZERO = v;
        var V = w(1);
        _.ONE = V;
        var k = w(1, !0);
        _.UONE = k;
        var N = w(-1);
        _.NEG_ONE = N;
        var R = j(-1, 2147483647, !1);
        _.MAX_VALUE = R;
        var h = j(-1, -1, !0);
        _.MAX_UNSIGNED_VALUE = h;
        var C = j(0, -2147483648, !1);
        _.MIN_VALUE = C;
        var x = _.prototype;
        if (x.toInt = function() {
                return this.unsigned ? this.low >>> 0 : this.low
            }, x.toNumber = function() {
                if (this.unsigned) return (this.high >>> 0) * W + (this.low >>> 0);
                return this.high * W + (this.low >>> 0)
            }, x.toString = function(S) {
                if (S = S || 10, S < 2 || 36 < S) throw RangeError("radix");
                if (this.isZero()) return "0";
                if (this.isNegative())
                    if (this.eq(C)) {
                        var F = $(S),
                            U = this.div(F),
                            g = U.mul(F).sub(this);
                        return U.toString(S) + g.toInt().toString(S)
                    } else return "-" + this.neg().toString(S);
                var c = $(H(S, 6), this.unsigned),
                    n = this,
                    l = "";
                while (!0) {
                    var z6 = n.div(c),
                        A6 = n.sub(z6.mul(c)).toInt() >>> 0,
                        e = A6.toString(S);
                    if (n = z6, n.isZero()) return e + l;
                    else {
                        while (e.length < 6) e = "0" + e;
                        l = "" + e + l
                    }
                }
            }, x.getHighBits = function() {
                return this.high
            }, x.getHighBitsUnsigned = function() {
                return this.high >>> 0
            }, x.getLowBits = function() {
                return this.low
            }, x.getLowBitsUnsigned = function() {
                return this.low >>> 0
            }, x.getNumBitsAbs = function() {
                if (this.isNegative()) return this.eq(C) ? 64 : this.neg().getNumBitsAbs();
                var S = this.high != 0 ? this.high : this.low;
                for (var F = 31; F > 0; F--)
                    if ((S & 1 << F) != 0) break;
                return this.high != 0 ? F + 33 : F + 1
            }, x.isSafeInteger = function() {
                var S = this.high >> 21;
                if (!S) return !0;
                if (this.unsigned) return !1;
                return S === -1 && !(this.low === 0 && this.high === -2097152)
            }, x.isZero = function() {
                return this.high === 0 && this.low === 0
            }, x.eqz = x.isZero, x.isNegative = function() {
                return !this.unsigned && this.high < 0
            }, x.isPositive = function() {
                return this.unsigned || this.high >= 0
            }, x.isOdd = function() {
                return (this.low & 1) === 1
            }, x.isEven = function() {
                return (this.low & 1) === 0
            }, x.equals = function(S) {
                if (!z(S)) S = X(S);
                if (this.unsigned !== S.unsigned && this.high >>> 31 === 1 && S.high >>> 31 === 1) return !1;
                return this.high === S.high && this.low === S.low
            }, x.eq = x.equals, x.notEquals = function(S) {
                return !this.eq(S)
            }, x.neq = x.notEquals, x.ne = x.notEquals, x.lessThan = function(S) {
                return this.comp(S) < 0
            }, x.lt = x.lessThan, x.lessThanOrEqual = function(S) {
                return this.comp(S) <= 0
            }, x.lte = x.lessThanOrEqual, x.le = x.lessThanOrEqual, x.greaterThan = function(S) {
                return this.comp(S) > 0
            }, x.gt = x.greaterThan, x.greaterThanOrEqual = function(S) {
                return this.comp(S) >= 0
            }, x.gte = x.greaterThanOrEqual, x.ge = x.greaterThanOrEqual, x.compare = function(S) {
                if (!z(S)) S = X(S);
                if (this.eq(S)) return 0;
                var F = this.isNegative(),
                    U = S.isNegative();
                if (F && !U) return -1;
                if (!F && U) return 1;
                if (!this.unsigned) return this.sub(S).isNegative() ? -1 : 1;
                return S.high >>> 0 > this.high >>> 0 || S.high === this.high && S.low >>> 0 > this.low >>> 0 ? -1 : 1
            }, x.comp = x.compare, x.negate = function() {
                if (!this.unsigned && this.eq(C)) return C;
                return this.not().add(V)
            }, x.neg = x.negate, x.add = function(S) {
                if (!z(S)) S = X(S);
                var F = this.high >>> 16,
                    U = this.high & 65535,
                    g = this.low >>> 16,
                    c = this.low & 65535,
                    n = S.high >>> 16,
                    l = S.high & 65535,
                    z6 = S.low >>> 16,
                    A6 = S.low & 65535,
                    e = 0,
                    i = 0,
                    O6 = 0,
                    J6 = 0;
                return J6 += c + A6, O6 += J6 >>> 16, J6 &= 65535, O6 += g + z6, i += O6 >>> 16, O6 &= 65535, i += U + l, e += i >>> 16, i &= 65535, e += F + n, e &= 65535, j(O6 << 16 | J6, e << 16 | i, this.unsigned)
            }, x.subtract = function(S) {
                if (!z(S)) S = X(S);
                return this.add(S.neg())
            }, x.sub = x.subtract, x.multiply = function(S) {
                if (this.isZero()) return this;
                if (!z(S)) S = X(S);
                if (K) {
                    var F = K.mul(this.low, this.high, S.low, S.high);
                    return j(F, K.get_high(), this.unsigned)
                }
                if (S.isZero()) return this.unsigned ? v : f;
                if (this.eq(C)) return S.isOdd() ? C : f;
                if (S.eq(C)) return this.isOdd() ? C : f;
                if (this.isNegative())
                    if (S.isNegative()) return this.neg().mul(S.neg());
                    else return this.neg().mul(S).neg();
                else if (S.isNegative()) return this.mul(S.neg()).neg();
                if (this.lt(G) && S.lt(G)) return $(this.toNumber() * S.toNumber(), this.unsigned);
                var U = this.high >>> 16,
                    g = this.high & 65535,
                    c = this.low >>> 16,
                    n = this.low & 65535,
                    l = S.high >>> 16,
                    z6 = S.high & 65535,
                    A6 = S.low >>> 16,
                    e = S.low & 65535,
                    i = 0,
                    O6 = 0,
                    J6 = 0,
                    $6 = 0;
                return $6 += n * e, J6 += $6 >>> 16, $6 &= 65535, J6 += c * e, O6 += J6 >>> 16, J6 &= 65535, J6 += n * A6, O6 += J6 >>> 16, J6 &= 65535, O6 += g * e, i += O6 >>> 16, O6 &= 65535, O6 += c * A6, i += O6 >>> 16, O6 &= 65535, O6 += n * z6, i += O6 >>> 16, O6 &= 65535, i += U * e + g * A6 + c * z6 + n * l, i &= 65535, j(J6 << 16 | $6, i << 16 | O6, this.unsigned)
            }, x.mul = x.multiply, x.divide = function(S) {
                if (!z(S)) S = X(S);
                if (S.isZero()) throw Error("division by zero");
                if (K) {
                    if (!this.unsigned && this.high === -2147483648 && S.low === -1 && S.high === -1) return this;
                    var F = (this.unsigned ? K.div_u : K.div_s)(this.low, this.high, S.low, S.high);
                    return j(F, K.get_high(), this.unsigned)
                }
                if (this.isZero()) return this.unsigned ? v : f;
                var U, g, c;
                if (!this.unsigned) {
                    if (this.eq(C))
                        if (S.eq(V) || S.eq(N)) return C;
                        else if (S.eq(C)) return V;
                    else {
                        var n = this.shr(1);
                        if (U = n.div(S).shl(1), U.eq(f)) return S.isNegative() ? V : N;
                        else return g = this.sub(S.mul(U)), c = U.add(g.div(S)), c
                    } else if (S.eq(C)) return this.unsigned ? v : f;
                    if (this.isNegative()) {
                        if (S.isNegative()) return this.neg().div(S.neg());
                        return this.neg().div(S).neg()
                    } else if (S.isNegative()) return this.div(S.neg()).neg();
                    c = f
                } else {
                    if (!S.unsigned) S = S.toUnsigned();
                    if (S.gt(this)) return v;
                    if (S.gt(this.shru(1))) return k;
                    c = v
                }
                g = this;
                while (g.gte(S)) {
                    U = Math.max(1, Math.floor(g.toNumber() / S.toNumber()));
                    var l = Math.ceil(Math.log(U) / Math.LN2),
                        z6 = l <= 48 ? 1 : H(2, l - 48),
                        A6 = $(U),
                        e = A6.mul(S);
                    while (e.isNegative() || e.gt(g)) U -= z6, A6 = $(U, this.unsigned), e = A6.mul(S);
                    if (A6.isZero()) A6 = V;
                    c = c.add(A6), g = g.sub(e)
                }
                return c
            }, x.div = x.divide, x.modulo = function(S) {
                if (!z(S)) S = X(S);
                if (K) {
                    var F = (this.unsigned ? K.rem_u : K.rem_s)(this.low, this.high, S.low, S.high);
                    return j(F, K.get_high(), this.unsigned)
                }
                return this.sub(this.div(S).mul(S))
            }, x.mod = x.modulo, x.rem = x.modulo, x.not = function() {
                return j(~this.low, ~this.high, this.unsigned)
            }, x.countLeadingZeros = function() {
                return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32
            }, x.clz = x.countLeadingZeros, x.countTrailingZeros = function() {
                return this.low ? Y(this.low) : Y(this.high) + 32
            }, x.ctz = x.countTrailingZeros, x.and = function(S) {
                if (!z(S)) S = X(S);
                return j(this.low & S.low, this.high & S.high, this.unsigned)
            }, x.or = function(S) {
                if (!z(S)) S = X(S);
                return j(this.low | S.low, this.high | S.high, this.unsigned)
            }, x.xor = function(S) {
                if (!z(S)) S = X(S);
                return j(this.low ^ S.low, this.high ^ S.high, this.unsigned)
            }, x.shiftLeft = function(S) {
                if (z(S)) S = S.toInt();
                if ((S &= 63) === 0) return this;
                else if (S < 32) return j(this.low << S, this.high << S | this.low >>> 32 - S, this.unsigned);
                else return j(0, this.low << S - 32, this.unsigned)
            }, x.shl = x.shiftLeft, x.shiftRight = function(S) {
                if (z(S)) S = S.toInt();
                if ((S &= 63) === 0) return this;
                else if (S < 32) return j(this.low >>> S | this.high << 32 - S, this.high >> S, this.unsigned);
                else return j(this.high >> S - 32, this.high >= 0 ? 0 : -1, this.unsigned)
            }, x.shr = x.shiftRight, x.shiftRightUnsigned = function(S) {
                if (z(S)) S = S.toInt();
                if ((S &= 63) === 0) return this;
                if (S < 32) return j(this.low >>> S | this.high << 32 - S, this.high >>> S, this.unsigned);
                if (S === 32) return j(this.high, 0, this.unsigned);
                return j(this.high >>> S - 32, 0, this.unsigned)
            }, x.shru = x.shiftRightUnsigned, x.shr_u = x.shiftRightUnsigned, x.rotateLeft = function(S) {
                var F;
                if (z(S)) S = S.toInt();
                if ((S &= 63) === 0) return this;
                if (S === 32) return j(this.high, this.low, this.unsigned);
                if (S < 32) return F = 32 - S, j(this.low << S | this.high >>> F, this.high << S | this.low >>> F, this.unsigned);
                return S -= 32, F = 32 - S, j(this.high << S | this.low >>> F, this.low << S | this.high >>> F, this.unsigned)
            }, x.rotl = x.rotateLeft, x.rotateRight = function(S) {
                var F;
                if (z(S)) S = S.toInt();
                if ((S &= 63) === 0) return this;
                if (S === 32) return j(this.high, this.low, this.unsigned);
                if (S < 32) return F = 32 - S, j(this.high << F | this.low >>> S, this.low << F | this.high >>> S, this.unsigned);
                return S -= 32, F = 32 - S, j(this.low << F | this.high >>> S, this.high << F | this.low >>> S, this.unsigned)
            }, x.rotr = x.rotateRight, x.toSigned = function() {
                if (!this.unsigned) return this;
                return j(this.low, this.high, !1)
            }, x.toUnsigned = function() {
                if (this.unsigned) return this;
                return j(this.low, this.high, !0)
            }, x.toBytes = function(S) {
                return S ? this.toBytesLE() : this.toBytesBE()
            }, x.toBytesLE = function() {
                var S = this.high,
                    F = this.low;
                return [F & 255, F >>> 8 & 255, F >>> 16 & 255, F >>> 24, S & 255, S >>> 8 & 255, S >>> 16 & 255, S >>> 24]
            }, x.toBytesBE = function() {
                var S = this.high,
                    F = this.low;
                return [S >>> 24, S >>> 16 & 255, S >>> 8 & 255, S & 255, F >>> 24, F >>> 16 & 255, F >>> 8 & 255, F & 255]
            }, _.fromBytes = function(S, F, U) {
                return U ? _.fromBytesLE(S, F) : _.fromBytesBE(S, F)
            }, _.fromBytesLE = function(S, F) {
                return new _(S[0] | S[1] << 8 | S[2] << 16 | S[3] << 24, S[4] | S[5] << 8 | S[6] << 16 | S[7] << 24, F)
            }, _.fromBytesBE = function(S, F) {
                return new _(S[4] << 24 | S[5] << 16 | S[6] << 8 | S[7], S[0] << 24 | S[1] << 16 | S[2] << 8 | S[3], F)
            }, typeof BigInt === "function") _.fromBigInt = function(S, F) {
            var U = Number(BigInt.asIntN(32, S)),
                g = Number(BigInt.asIntN(32, S >> BigInt(32)));
            return j(U, g, F)
        }, _.fromValue = function(S, F) {
            if (typeof S === "bigint") return fromBigInt(S, F);
            return X(S, F)
        }, x.toBigInt = function() {
            var S = BigInt(this.low >>> 0),
                F = BigInt(this.unsigned ? this.high >>> 0 : this.high);
            return F << BigInt(32) | S
        };
        var B = q.default = _
    })
})
// @from(Ln 315565, Col 4)
Le1 = p((R7K) => {
    Object.defineProperty(R7K, "__esModule", {
        value: !0
    });
    R7K.loadFileDescriptorSetFromObject = R7K.loadFileDescriptorSetFromBuffer = R7K.fromJSON = R7K.loadSync = R7K.load = R7K.IdempotencyLevel = R7K.isAnyExtension = R7K.Long = void 0;
    var qgz = O1K(),
        Dl = PB8(),
        Ee1 = M7K(),
        ye1 = V7K(),
        Kgz = k7K();
    R7K.Long = Kgz;

    function _gz(q) {
        return "@type" in q && typeof q["@type"] === "string"
    }
    R7K.isAnyExtension = _gz;
    var E7K;
    (function(q) {
        q.IDEMPOTENCY_UNKNOWN = "IDEMPOTENCY_UNKNOWN", q.NO_SIDE_EFFECTS = "NO_SIDE_EFFECTS", q.IDEMPOTENT = "IDEMPOTENT"
    })(E7K = R7K.IdempotencyLevel || (R7K.IdempotencyLevel = {}));
    var y7K = {
        longs: String,
        enums: String,
        bytes: String,
        defaults: !0,
        oneofs: !0,
        json: !0
    };

    function zgz(q, K) {
        if (q === "") return K;
        else return q + "." + K
    }

    function Ygz(q) {
        return q instanceof Dl.Service || q instanceof Dl.Type || q instanceof Dl.Enum
    }

    function Agz(q) {
        return q instanceof Dl.Namespace || q instanceof Dl.Root
    }

    function L7K(q, K) {
        let _ = zgz(K, q.name);
        if (Ygz(q)) return [
            [_, q]
        ];
        else if (Agz(q) && typeof q.nested < "u") return Object.keys(q.nested).map((z) => {
            return L7K(q.nested[z], _)
        }).reduce((z, Y) => z.concat(Y), []);
        return []
    }

    function Ve1(q, K) {
        return function(z) {
            return q.toObject(q.decode(z), K)
        }
    }

    function ke1(q) {
        return function(_) {
            if (Array.isArray(_)) throw Error(`Failed to serialize message: expected object with ${q.name} structure, got array instead`);
            let z = q.fromObject(_);
            return q.encode(z).finish()
        }
    }

    function Ogz(q) {
        return (q || []).reduce((K, _) => {
            for (let [z, Y] of Object.entries(_)) switch (z) {
                case "uninterpreted_option":
                    K.uninterpreted_option.push(_.uninterpreted_option);
                    break;
                default:
                    K[z] = Y
            }
            return K
        }, {
            deprecated: !1,
            idempotency_level: E7K.IDEMPOTENCY_UNKNOWN,
            uninterpreted_option: []
        })
    }

    function wgz(q, K, _, z) {
        let {
            resolvedRequestType: Y,
            resolvedResponseType: A
        } = q;
        return {
            path: "/" + K + "/" + q.name,
            requestStream: !!q.requestStream,
            responseStream: !!q.responseStream,
            requestSerialize: ke1(Y),
            requestDeserialize: Ve1(Y, _),
            responseSerialize: ke1(A),
            responseDeserialize: Ve1(A, _),
            originalName: qgz(q.name),
            requestType: Ne1(Y, _, z),
            responseType: Ne1(A, _, z),
            options: Ogz(q.parsedOptions)
        }
    }

    function $gz(q, K, _, z) {
        let Y = {};
        for (let A of q.methodsArray) Y[A.name] = wgz(A, K, _, z);
        return Y
    }

    function Ne1(q, K, _) {
        let z = q.toDescriptor("proto3");
        return {
            format: "Protocol Buffer 3 DescriptorProto",
            type: z.$type.toObject(z, y7K),
            fileDescriptorProtos: _,
            serialize: ke1(q),
            deserialize: Ve1(q, K)
        }
    }

    function jgz(q, K) {
        let _ = q.toDescriptor("proto3");
        return {
            format: "Protocol Buffer 3 EnumDescriptorProto",
            type: _.$type.toObject(_, y7K),
            fileDescriptorProtos: K
        }
    }

    function Hgz(q, K, _, z) {
        if (q instanceof Dl.Service) return $gz(q, K, _, z);
        else if (q instanceof Dl.Type) return Ne1(q, _, z);
        else if (q instanceof Dl.Enum) return jgz(q, z);
        else throw Error("Type mismatch in reflection object handling")
    }

    function ZB8(q, K) {
        let _ = {};
        q.resolveAll();
        let Y = q.toDescriptor("proto3").file.map((A) => Buffer.from(Ee1.FileDescriptorProto.encode(A).finish()));
        for (let [A, O] of L7K(q, "")) _[A] = Hgz(O, A, K, Y);
        return _
    }

    function h7K(q, K) {
        K = K || {};
        let _ = Dl.Root.fromDescriptor(q);
        return _.resolveAll(), ZB8(_, K)
    }

    function Jgz(q, K) {
        return (0, ye1.loadProtosWithOptions)(q, K).then((_) => {
            return ZB8(_, K)
        })
    }
    R7K.load = Jgz;

    function Xgz(q, K) {
        let _ = (0, ye1.loadProtosWithOptionsSync)(q, K);
        return ZB8(_, K)
    }
    R7K.loadSync = Xgz;

    function Mgz(q, K) {
        K = K || {};
        let _ = Dl.Root.fromJSON(q);
        return _.resolveAll(), ZB8(_, K)
    }
    R7K.fromJSON = Mgz;

    function Pgz(q, K) {
        let _ = Ee1.FileDescriptorSet.decode(q);
        return h7K(_, K)
    }
    R7K.loadFileDescriptorSetFromBuffer = Pgz;

    function Wgz(q, K) {
        let _ = Ee1.FileDescriptorSet.fromObject(q);
        return h7K(_, K)
    }
    R7K.loadFileDescriptorSetFromObject = Wgz;
    (0, ye1.addCommonProtos)()
})
// @from(Ln 315749, Col 4)
I36 = p((c7K) => {
    var __dirname = "/home/runner/code/tmp/claude-cli-external-build-2239/node_modules/@grpc/grpc-js/build/src";
    Object.defineProperty(c7K, "__esModule", {
        value: !0
    });
    c7K.registerChannelzSocket = c7K.registerChannelzServer = c7K.registerChannelzSubchannel = c7K.registerChannelzChannel = c7K.ChannelzCallTrackerStub = c7K.ChannelzCallTracker = c7K.ChannelzChildrenTrackerStub = c7K.ChannelzChildrenTracker = c7K.ChannelzTrace = c7K.ChannelzTraceStub = void 0;
    c7K.unregisterChannelzRef = ygz;
    c7K.getChannelzHandlers = Q7K;
    c7K.getChannelzServiceDefinition = d7K;
    c7K.setup = Bgz;
    var GB8 = d6("net"),
        tJ6 = $8K(),
        Jq8 = ik(),
        Xq8 = e_(),
        Vgz = by(),
        kgz = lm8(),
        Ngz = im8();

    function he1(q) {
        return {
            channel_id: q.id,
            name: q.name
        }
    }

    function Re1(q) {
        return {
            subchannel_id: q.id,
            name: q.name
        }
    }

    function Egz(q) {
        return {
            server_id: q.id
        }
    }

    function vB8(q) {
        return {
            socket_id: q.id,
            name: q.name
        }
    }
    var C7K = 32,
        Se1 = 100;
    class u7K {
        constructor() {
            this.events = [], this.creationTimestamp = new Date, this.eventsLogged = 0
        }
        addTrace() {}
        getTraceMessage() {
            return {
                creation_timestamp: Zl(this.creationTimestamp),
                num_events_logged: this.eventsLogged,
                events: []
            }
        }
    }
    c7K.ChannelzTraceStub = u7K;
    class m7K {
        constructor() {
            this.events = [], this.eventsLogged = 0, this.creationTimestamp = new Date
        }
        addTrace(q, K, _) {
            let z = new Date;
            if (this.events.push({
                    description: K,
                    severity: q,
                    timestamp: z,
                    childChannel: (_ === null || _ === void 0 ? void 0 : _.kind) === "channel" ? _ : void 0,
                    childSubchannel: (_ === null || _ === void 0 ? void 0 : _.kind) === "subchannel" ? _ : void 0
                }), this.events.length >= C7K * 2) this.events = this.events.slice(C7K);
            this.eventsLogged += 1
        }
        getTraceMessage() {
            return {
                creation_timestamp: Zl(this.creationTimestamp),
                num_events_logged: this.eventsLogged,
                events: this.events.map((q) => {
                    return {
                        description: q.description,
                        severity: q.severity,
                        timestamp: Zl(q.timestamp),
                        channel_ref: q.childChannel ? he1(q.childChannel) : null,
                        subchannel_ref: q.childSubchannel ? Re1(q.childSubchannel) : null
                    }
                })
            }
        }
    }
    c7K.ChannelzTrace = m7K;
    class Ce1 {
        constructor() {
            this.channelChildren = new tJ6.OrderedMap, this.subchannelChildren = new tJ6.OrderedMap, this.socketChildren = new tJ6.OrderedMap, this.trackerMap = {
                ["channel"]: this.channelChildren,
                ["subchannel"]: this.subchannelChildren,
                ["socket"]: this.socketChildren
            }
        }
        refChild(q) {
            let K = this.trackerMap[q.kind],
                _ = K.find(q.id);
            if (_.equals(K.end())) K.setElement(q.id, {
                ref: q,
                count: 1
            }, _);
            else _.pointer[1].count += 1
        }
        unrefChild(q) {
            let K = this.trackerMap[q.kind],
                _ = K.getElementByKey(q.id);
            if (_ !== void 0) {
                if (_.count -= 1, _.count === 0) K.eraseElementByKey(q.id)
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
    c7K.ChannelzChildrenTracker = Ce1;
    class B7K extends Ce1 {
        refChild() {}
        unrefChild() {}
    }
    c7K.ChannelzChildrenTrackerStub = B7K;
    class be1 {
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
    c7K.ChannelzCallTracker = be1;
    class p7K extends be1 {
        addCallStarted() {}
        addCallSucceeded() {}
        addCallFailed() {}
    }
    c7K.ChannelzCallTrackerStub = p7K;
    var vt = {
            ["channel"]: new tJ6.OrderedMap,
            ["subchannel"]: new tJ6.OrderedMap,
            ["server"]: new tJ6.OrderedMap,
            ["socket"]: new tJ6.OrderedMap
        },
        TB8 = (q) => {
            let K = 1;

            function _() {
                return K++
            }
            let z = vt[q];
            return (Y, A, O) => {
                let w = _(),
                    $ = {
                        id: w,
                        name: Y,
                        kind: q
                    };
                if (O) z.setElement(w, {
                    ref: $,
                    getInfo: A
                });
                return $
            }
        };
    c7K.registerChannelzChannel = TB8("channel");
    c7K.registerChannelzSubchannel = TB8("subchannel");
    c7K.registerChannelzServer = TB8("server");
    c7K.registerChannelzSocket = TB8("socket");

    function ygz(q) {
        vt[q.kind].eraseElementByKey(q.id)
    }

    function Lgz(q) {
        let K = Number.parseInt(q, 16);
        return [K / 256 | 0, K % 256]
    }

    function b7K(q) {
        if (q === "") return [];
        let K = q.split(":").map((z) => Lgz(z));
        return [].concat(...K)
    }

    function hgz(q) {
        return (0, GB8.isIPv6)(q) && q.toLowerCase().startsWith("::ffff:") && (0, GB8.isIPv4)(q.substring(7))
    }

    function I7K(q) {
        return Buffer.from(Uint8Array.from(q.split(".").map((K) => Number.parseInt(K))))
    }

    function Rgz(q) {
        if ((0, GB8.isIPv4)(q)) return I7K(q);
        else if (hgz(q)) return I7K(q.substring(7));
        else if ((0, GB8.isIPv6)(q)) {
            let K, _, z = q.indexOf("::");
            if (z === -1) K = q, _ = "";
            else K = q.substring(0, z), _ = q.substring(z + 2);
            let Y = Buffer.from(b7K(K)),
                A = Buffer.from(b7K(_)),
                O = Buffer.alloc(16 - Y.length - A.length, 0);
            return Buffer.concat([Y, O, A])
        } else return null
    }

    function F7K(q) {
        switch (q) {
            case Jq8.ConnectivityState.CONNECTING:
                return {
                    state: "CONNECTING"
                };
            case Jq8.ConnectivityState.IDLE:
                return {
                    state: "IDLE"
                };
            case Jq8.ConnectivityState.READY:
                return {
                    state: "READY"
                };
            case Jq8.ConnectivityState.SHUTDOWN:
                return {
                    state: "SHUTDOWN"
                };
            case Jq8.ConnectivityState.TRANSIENT_FAILURE:
                return {
                    state: "TRANSIENT_FAILURE"
                };
            default:
                return {
                    state: "UNKNOWN"
                }
        }
    }

    function Zl(q) {
        if (!q) return null;
        let K = q.getTime();
        return {
            seconds: K / 1000 | 0,
            nanos: K % 1000 * 1e6
        }
    }

    function g7K(q) {
        let K = q.getInfo(),
            _ = [],
            z = [];
        return K.children.channels.forEach((Y) => {
            _.push(he1(Y[1].ref))
        }), K.children.subchannels.forEach((Y) => {
            z.push(Re1(Y[1].ref))
        }), {
            ref: he1(q.ref),
            data: {
                target: K.target,
                state: F7K(K.state),
                calls_started: K.callTracker.callsStarted,
                calls_succeeded: K.callTracker.callsSucceeded,
                calls_failed: K.callTracker.callsFailed,
                last_call_started_timestamp: Zl(K.callTracker.lastCallStartedTimestamp),
                trace: K.trace.getTraceMessage()
            },
            channel_ref: _,
            subchannel_ref: z
        }
    }

    function Sgz(q, K) {
        let _ = parseInt(q.request.channel_id, 10),
            z = vt.channel.getElementByKey(_);
        if (z === void 0) {
            K({
                code: Xq8.Status.NOT_FOUND,
                details: "No channel data found for id " + _
            });
            return
        }
        K(null, {
            channel: g7K(z)
        })
    }

    function Cgz(q, K) {
        let _ = parseInt(q.request.max_results, 10) || Se1,
            z = [],
            Y = parseInt(q.request.start_channel_id, 10),
            A = vt.channel,
            O;
        for (O = A.lowerBound(Y); !O.equals(A.end()) && z.length < _; O = O.next()) z.push(g7K(O.pointer[1]));
        K(null, {
            channel: z,
            end: O.equals(A.end())
        })
    }

    function U7K(q) {
        let K = q.getInfo(),
            _ = [];
        return K.listenerChildren.sockets.forEach((z) => {
            _.push(vB8(z[1].ref))
        }), {
            ref: Egz(q.ref),
            data: {
                calls_started: K.callTracker.callsStarted,
                calls_succeeded: K.callTracker.callsSucceeded,
                calls_failed: K.callTracker.callsFailed,
                last_call_started_timestamp: Zl(K.callTracker.lastCallStartedTimestamp),
                trace: K.trace.getTraceMessage()
            },
            listen_socket: _
        }
    }

    function bgz(q, K) {
        let _ = parseInt(q.request.server_id, 10),
            Y = vt.server.getElementByKey(_);
        if (Y === void 0) {
            K({
                code: Xq8.Status.NOT_FOUND,
                details: "No server data found for id " + _
            });
            return
        }
        K(null, {
            server: U7K(Y)
        })
    }

    function Igz(q, K) {
        let _ = parseInt(q.request.max_results, 10) || Se1,
            z = parseInt(q.request.start_server_id, 10),
            Y = vt.server,
            A = [],
            O;
        for (O = Y.lowerBound(z); !O.equals(Y.end()) && A.length < _; O = O.next()) A.push(U7K(O.pointer[1]));
        K(null, {
            server: A,
            end: O.equals(Y.end())
        })
    }

    function xgz(q, K) {
        let _ = parseInt(q.request.subchannel_id, 10),
            z = vt.subchannel.getElementByKey(_);
        if (z === void 0) {
            K({
                code: Xq8.Status.NOT_FOUND,
                details: "No subchannel data found for id " + _
            });
            return
        }
        let Y = z.getInfo(),
            A = [];
        Y.children.sockets.forEach((w) => {
            A.push(vB8(w[1].ref))
        });
        let O = {
            ref: Re1(z.ref),
            data: {
                target: Y.target,
                state: F7K(Y.state),
                calls_started: Y.callTracker.callsStarted,
                calls_succeeded: Y.callTracker.callsSucceeded,
                calls_failed: Y.callTracker.callsFailed,
                last_call_started_timestamp: Zl(Y.callTracker.lastCallStartedTimestamp),
                trace: Y.trace.getTraceMessage()
            },
            socket_ref: A
        };
        K(null, {
            subchannel: O
        })
    }

    function x7K(q) {
        var K;
        if ((0, Vgz.isTcpSubchannelAddress)(q)) return {
            address: "tcpip_address",
            tcpip_address: {
                ip_address: (K = Rgz(q.host)) !== null && K !== void 0 ? K : void 0,
                port: q.port
            }
        };
        else return {
            address: "uds_address",
            uds_address: {
                filename: q.path
            }
        }
    }

    function ugz(q, K) {
        var _, z, Y, A, O;
        let w = parseInt(q.request.socket_id, 10),
            $ = vt.socket.getElementByKey(w);
        if ($ === void 0) {
            K({
                code: Xq8.Status.NOT_FOUND,
                details: "No socket data found for id " + w
            });
            return
        }
        let j = $.getInfo(),
            H = j.security ? {
                model: "tls",
                tls: {
                    cipher_suite: j.security.cipherSuiteStandardName ? "standard_name" : "other_name",
                    standard_name: (_ = j.security.cipherSuiteStandardName) !== null && _ !== void 0 ? _ : void 0,
                    other_name: (z = j.security.cipherSuiteOtherName) !== null && z !== void 0 ? z : void 0,
                    local_certificate: (Y = j.security.localCertificate) !== null && Y !== void 0 ? Y : void 0,
                    remote_certificate: (A = j.security.remoteCertificate) !== null && A !== void 0 ? A : void 0
                }
            } : null,
            J = {
                ref: vB8($.ref),
                local: j.localAddress ? x7K(j.localAddress) : null,
                remote: j.remoteAddress ? x7K(j.remoteAddress) : null,
                remote_name: (O = j.remoteName) !== null && O !== void 0 ? O : void 0,
                security: H,
                data: {
                    keep_alives_sent: j.keepAlivesSent,
                    streams_started: j.streamsStarted,
                    streams_succeeded: j.streamsSucceeded,
                    streams_failed: j.streamsFailed,
                    last_local_stream_created_timestamp: Zl(j.lastLocalStreamCreatedTimestamp),
                    last_remote_stream_created_timestamp: Zl(j.lastRemoteStreamCreatedTimestamp),
                    messages_received: j.messagesReceived,
                    messages_sent: j.messagesSent,
                    last_message_received_timestamp: Zl(j.lastMessageReceivedTimestamp),
                    last_message_sent_timestamp: Zl(j.lastMessageSentTimestamp),
                    local_flow_control_window: j.localFlowControlWindow ? {
                        value: j.localFlowControlWindow
                    } : null,
                    remote_flow_control_window: j.remoteFlowControlWindow ? {
                        value: j.remoteFlowControlWindow
                    } : null
                }
            };
        K(null, {
            socket: J
        })
    }

    function mgz(q, K) {
        let _ = parseInt(q.request.server_id, 10),
            z = vt.server.getElementByKey(_);
        if (z === void 0) {
            K({
                code: Xq8.Status.NOT_FOUND,
                details: "No server data found for id " + _
            });
            return
        }
        let Y = parseInt(q.request.start_socket_id, 10),
            A = parseInt(q.request.max_results, 10) || Se1,
            w = z.getInfo().sessionChildren.sockets,
            $ = [],
            j;
        for (j = w.lowerBound(Y); !j.equals(w.end()) && $.length < A; j = j.next()) $.push(vB8(j.pointer[1].ref));
        K(null, {
            socket_ref: $,
            end: j.equals(w.end())
        })
    }

    function Q7K() {
        return {
            GetChannel: Sgz,
            GetTopChannels: Cgz,
            GetServer: bgz,
            GetServers: Igz,
            GetSubchannel: xgz,
            GetSocket: ugz,
            GetServerSockets: mgz
        }
    }
    var fB8 = null;

    function d7K() {
        if (fB8) return fB8;
        let q = Le1().loadSync,
            K = q("channelz.proto", {
                keepCase: !0,
                longs: String,
                enums: String,
                defaults: !0,
                oneofs: !0,
                includeDirs: [`${__dirname}/../../proto`]
            });
        return fB8 = (0, Ngz.loadPackageDefinition)(K).grpc.channelz.v1.Channelz.service, fB8
    }

    function Bgz() {
        (0, kgz.registerAdminService)(d7K, Q7K)
    }
})
// @from(Ln 316260, Col 4)
VB8 = p((n7K) => {
    Object.defineProperty(n7K, "__esModule", {
        value: !0
    });
    n7K.getNextCallNumber = tgz;
    var sgz = 0;

    function tgz() {
        return sgz++
    }
})
// @from(Ln 316271, Col 4)
Ie1 = p((r7K) => {
    Object.defineProperty(r7K, "__esModule", {
        value: !0
    });
    r7K.CompressionAlgorithms = void 0;
    var i7K;
    (function(q) {
        q[q.identity = 0] = "identity", q[q.deflate = 1] = "deflate", q[q.gzip = 2] = "gzip"
    })(i7K || (r7K.CompressionAlgorithms = i7K = {}))
})
// @from(Ln 316281, Col 4)
xe1 = p((s7K) => {
    Object.defineProperty(s7K, "__esModule", {
        value: !0
    });
    s7K.BaseFilter = void 0;
    class a7K {
        async sendMetadata(q) {
            return q
        }
        receiveMetadata(q) {
            return q
        }
        async sendMessage(q) {
            return q
        }
        async receiveMessage(q) {
            return q
        }
        receiveTrailers(q) {
            return q
        }
    }
    s7K.BaseFilter = a7K
})
// @from(Ln 316305, Col 4)
me1 = p((AqK) => {
    Object.defineProperty(AqK, "__esModule", {
        value: !0
    });
    AqK.CompressionFilterFactory = AqK.CompressionFilter = void 0;
    var kB8 = d6("zlib"),
        qqK = Ie1(),
        RS6 = e_(),
        qUz = xe1(),
        KUz = o2(),
        _Uz = (q) => {
            return typeof q === "number" && typeof qqK.CompressionAlgorithms[q] === "string"
        };
    class Mq8 {
        async writeMessage(q, K) {
            let _ = q;
            if (K) _ = await this.compressMessage(_);
            let z = Buffer.allocUnsafe(_.length + 5);
            return z.writeUInt8(K ? 1 : 0, 0), z.writeUInt32BE(_.length, 1), _.copy(z, 5), z
        }
        async readMessage(q) {
            let K = q.readUInt8(0) === 1,
                _ = q.slice(5);
            if (K) _ = await this.decompressMessage(_);
            return _
        }
    }
    class SS6 extends Mq8 {
        async compressMessage(q) {
            return q
        }
        async writeMessage(q, K) {
            let _ = Buffer.allocUnsafe(q.length + 5);
            return _.writeUInt8(0, 0), _.writeUInt32BE(q.length, 1), q.copy(_, 5), _
        }
        decompressMessage(q) {
            return Promise.reject(Error('Received compressed message but "grpc-encoding" header was identity'))
        }
    }
    class KqK extends Mq8 {
        constructor(q) {
            super();
            this.maxRecvMessageLength = q
        }
        compressMessage(q) {
            return new Promise((K, _) => {
                kB8.deflate(q, (z, Y) => {
                    if (z) _(z);
                    else K(Y)
                })
            })
        }
        decompressMessage(q) {
            return new Promise((K, _) => {
                let z = 0,
                    Y = [],
                    A = kB8.createInflate();
                A.on("data", (O) => {
                    if (Y.push(O), z += O.byteLength, this.maxRecvMessageLength !== -1 && z > this.maxRecvMessageLength) A.destroy(), _({
                        code: RS6.Status.RESOURCE_EXHAUSTED,
                        details: `Received message that decompresses to a size larger than ${this.maxRecvMessageLength}`
                    })
                }), A.on("end", () => {
                    K(Buffer.concat(Y))
                }), A.write(q), A.end()
            })
        }
    }
    class _qK extends Mq8 {
        constructor(q) {
            super();
            this.maxRecvMessageLength = q
        }
        compressMessage(q) {
            return new Promise((K, _) => {
                kB8.gzip(q, (z, Y) => {
                    if (z) _(z);
                    else K(Y)
                })
            })
        }
        decompressMessage(q) {
            return new Promise((K, _) => {
                let z = 0,
                    Y = [],
                    A = kB8.createGunzip();
                A.on("data", (O) => {
                    if (Y.push(O), z += O.byteLength, this.maxRecvMessageLength !== -1 && z > this.maxRecvMessageLength) A.destroy(), _({
                        code: RS6.Status.RESOURCE_EXHAUSTED,
                        details: `Received message that decompresses to a size larger than ${this.maxRecvMessageLength}`
                    })
                }), A.on("end", () => {
                    K(Buffer.concat(Y))
                }), A.write(q), A.end()
            })
        }
    }
    class zqK extends Mq8 {
        constructor(q) {
            super();
            this.compressionName = q
        }
        compressMessage(q) {
            return Promise.reject(Error(`Received message compressed with unsupported compression method ${this.compressionName}`))
        }
        decompressMessage(q) {
            return Promise.reject(Error(`Compression method not supported: ${this.compressionName}`))
        }
    }

    function e7K(q, K) {
        switch (q) {
            case "identity":
                return new SS6;
            case "deflate":
                return new KqK(K);
            case "gzip":
                return new _qK(K);
            default:
                return new zqK(q)
        }
    }
    class ue1 extends qUz.BaseFilter {
        constructor(q, K) {
            var _, z, Y;
            super();
            this.sharedFilterConfig = K, this.sendCompression = new SS6, this.receiveCompression = new SS6, this.currentCompressionAlgorithm = "identity";
            let A = q["grpc.default_compression_algorithm"];
            if (this.maxReceiveMessageLength = (_ = q["grpc.max_receive_message_length"]) !== null && _ !== void 0 ? _ : RS6.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH, this.maxSendMessageLength = (z = q["grpc.max_send_message_length"]) !== null && z !== void 0 ? z : RS6.DEFAULT_MAX_SEND_MESSAGE_LENGTH, A !== void 0)
                if (_Uz(A)) {
                    let O = qqK.CompressionAlgorithms[A],
                        w = (Y = K.serverSupportedEncodingHeader) === null || Y === void 0 ? void 0 : Y.split(",");
                    if (!w || w.includes(O)) this.currentCompressionAlgorithm = O, this.sendCompression = e7K(this.currentCompressionAlgorithm, -1)
                } else KUz.log(RS6.LogVerbosity.ERROR, `Invalid value provided for grpc.default_compression_algorithm option: ${A}`)
        }
        async sendMetadata(q) {
            let K = await q;
            if (K.set("grpc-accept-encoding", "identity,deflate,gzip"), K.set("accept-encoding", "identity"), this.currentCompressionAlgorithm === "identity") K.remove("grpc-encoding");
            else K.set("grpc-encoding", this.currentCompressionAlgorithm);
            return K
        }
        receiveMetadata(q) {
            let K = q.get("grpc-encoding");
            if (K.length > 0) {
                let z = K[0];
                if (typeof z === "string") this.receiveCompression = e7K(z, this.maxReceiveMessageLength)
            }
            q.remove("grpc-encoding");
            let _ = q.get("grpc-accept-encoding")[0];
            if (_) {
                if (this.sharedFilterConfig.serverSupportedEncodingHeader = _, !_.split(",").includes(this.currentCompressionAlgorithm)) this.sendCompression = new SS6, this.currentCompressionAlgorithm = "identity"
            }
            return q.remove("grpc-accept-encoding"), q
        }
        async sendMessage(q) {
            var K;
            let _ = await q;
            if (this.maxSendMessageLength !== -1 && _.message.length > this.maxSendMessageLength) throw {
                code: RS6.Status.RESOURCE_EXHAUSTED,
                details: `Attempted to send message with a size larger than ${this.maxSendMessageLength}`
            };
            let z;
            if (this.sendCompression instanceof SS6) z = !1;
            else z = (((K = _.flags) !== null && K !== void 0 ? K : 0) & 2) === 0;
            return {
                message: await this.sendCompression.writeMessage(_.message, z),
                flags: _.flags
            }
        }
        async receiveMessage(q) {
            return this.receiveCompression.readMessage(await q)
        }
    }
    AqK.CompressionFilter = ue1;
    class YqK {
        constructor(q, K) {
            this.options = K, this.sharedFilterConfig = {}
        }
        createFilter() {
            return new ue1(this.options, this.sharedFilterConfig)
        }
    }
    AqK.CompressionFilterFactory = YqK
})
// @from(Ln 316489, Col 4)
Pq8 = p((wqK) => {
    Object.defineProperty(wqK, "__esModule", {
        value: !0
    });
    wqK.restrictControlPlaneStatusCode = AUz;
    var fl = e_(),
        YUz = [fl.Status.OK, fl.Status.INVALID_ARGUMENT, fl.Status.NOT_FOUND, fl.Status.ALREADY_EXISTS, fl.Status.FAILED_PRECONDITION, fl.Status.ABORTED, fl.Status.OUT_OF_RANGE, fl.Status.DATA_LOSS];

    function AUz(q, K) {
        if (YUz.includes(q)) return {
            code: fl.Status.INTERNAL,
            details: `Invalid status from control plane: ${q} ${fl.Status[q]} ${K}`
        };
        else return {
            code: q,
            details: K
        }
    }
})
// @from(Ln 316508, Col 4)
CS6 = p(($qK) => {
    Object.defineProperty($qK, "__esModule", {
        value: !0
    });
    $qK.minDeadline = wUz;
    $qK.getDeadlineTimeoutString = jUz;
    $qK.getRelativeTimeout = JUz;
    $qK.deadlineToString = XUz;
    $qK.formatDateDifference = MUz;

    function wUz(...q) {
        let K = 1 / 0;
        for (let _ of q) {
            let z = _ instanceof Date ? _.getTime() : _;
            if (z < K) K = z
        }
        return K
    }
    var $Uz = [
        ["m", 1],
        ["S", 1000],
        ["M", 60000],
        ["H", 3600000]
    ];

    function jUz(q) {
        let K = new Date().getTime();
        if (q instanceof Date) q = q.getTime();
        let _ = Math.max(q - K, 0);
        for (let [z, Y] of $Uz) {
            let A = _ / Y;
            if (A < 1e8) return String(Math.ceil(A)) + z
        }
        throw Error("Deadline is too far in the future")
    }
    var HUz = 2147483647;

    function JUz(q) {
        let K = q instanceof Date ? q.getTime() : q,
            _ = new Date().getTime(),
            z = K - _;
        if (z < 0) return 0;
        else if (z > HUz) return 1 / 0;
        else return z
    }

    function XUz(q) {
        if (q instanceof Date) return q.toISOString();
        else {
            let K = new Date(q);
            if (Number.isNaN(K.getTime())) return "" + q;
            else return K.toISOString()
        }
    }

    function MUz(q, K) {
        return ((K.getTime() - q.getTime()) / 1000).toFixed(3) + "s"
    }
})
// @from(Ln 316567, Col 4)
NB8 = p((jqK) => {
    Object.defineProperty(jqK, "__esModule", {
        value: !0
    });
    jqK.FilterStackFactory = jqK.FilterStack = void 0;
    class Be1 {
        constructor(q) {
            this.filters = q
        }
        sendMetadata(q) {
            let K = q;
            for (let _ = 0; _ < this.filters.length; _++) K = this.filters[_].sendMetadata(K);
            return K
        }
        receiveMetadata(q) {
            let K = q;
            for (let _ = this.filters.length - 1; _ >= 0; _--) K = this.filters[_].receiveMetadata(K);
            return K
        }
        sendMessage(q) {
            let K = q;
            for (let _ = 0; _ < this.filters.length; _++) K = this.filters[_].sendMessage(K);
            return K
        }
        receiveMessage(q) {
            let K = q;
            for (let _ = this.filters.length - 1; _ >= 0; _--) K = this.filters[_].receiveMessage(K);
            return K
        }
        receiveTrailers(q) {
            let K = q;
            for (let _ = this.filters.length - 1; _ >= 0; _--) K = this.filters[_].receiveTrailers(K);
            return K
        }
        push(q) {
            this.filters.unshift(...q)
        }
        getFilters() {
            return this.filters
        }
    }
    jqK.FilterStack = Be1;
    class pe1 {
        constructor(q) {
            this.factories = q
        }
        push(q) {
            this.factories.unshift(...q)
        }
        clone() {
            return new pe1([...this.factories])
        }
        createFilter() {
            return new Be1(this.factories.map((q) => q.createFilter()))
        }
    }
    jqK.FilterStackFactory = pe1
})
// @from(Ln 316625, Col 4)
WqK = p((MqK) => {
    Object.defineProperty(MqK, "__esModule", {
        value: !0
    });
    MqK.SingleSubchannelChannel = void 0;
    var vUz = VB8(),
        Wq8 = I36(),
        TUz = me1(),
        VUz = ik(),
        Dq8 = e_(),
        kUz = Pq8(),
        NUz = CS6(),
        EUz = NB8(),
        Fe1 = QD(),
        yUz = GF(),
        EB8 = nk();
    class JqK {
        constructor(q, K, _, z, Y) {
            var A, O;
            this.subchannel = q, this.method = K, this.options = z, this.callNumber = Y, this.childCall = null, this.pendingMessage = null, this.readPending = !1, this.halfClosePending = !1, this.pendingStatus = null, this.readFilterPending = !1, this.writeFilterPending = !1;
            let w = this.method.split("/"),
                $ = "";
            if (w.length >= 2) $ = w[1];
            let j = (O = (A = (0, EB8.splitHostPort)(this.options.host)) === null || A === void 0 ? void 0 : A.host) !== null && O !== void 0 ? O : "localhost";
            this.serviceUrl = `https://${j}/${$}`;
            let H = (0, NUz.getRelativeTimeout)(z.deadline);
            if (H !== 1 / 0)
                if (H <= 0) this.cancelWithStatus(Dq8.Status.DEADLINE_EXCEEDED, "Deadline exceeded");
                else setTimeout(() => {
                    this.cancelWithStatus(Dq8.Status.DEADLINE_EXCEEDED, "Deadline exceeded")
                }, H);
            this.filterStack = _.createFilter()
        }
        cancelWithStatus(q, K) {
            if (this.childCall) this.childCall.cancelWithStatus(q, K);
            else this.pendingStatus = {
                code: q,
                details: K,
                metadata: new Fe1.Metadata
            }
        }
        getPeer() {
            var q, K;
            return (K = (q = this.childCall) === null || q === void 0 ? void 0 : q.getPeer()) !== null && K !== void 0 ? K : this.subchannel.getAddress()
        }
        async start(q, K) {
            if (this.pendingStatus) {
                K.onReceiveStatus(this.pendingStatus);
                return
            }
            if (this.subchannel.getConnectivityState() !== VUz.ConnectivityState.READY) {
                K.onReceiveStatus({
                    code: Dq8.Status.UNAVAILABLE,
                    details: "Subchannel not ready",
                    metadata: new Fe1.Metadata
                });
                return
            }
            let _ = await this.filterStack.sendMetadata(Promise.resolve(q)),
                z;
            try {
                z = await this.subchannel.getCallCredentials().generateMetadata({
                    method_name: this.method,
                    service_url: this.serviceUrl
                })
            } catch (A) {
                let O = A,
                    {
                        code: w,
                        details: $
                    } = (0, kUz.restrictControlPlaneStatusCode)(typeof O.code === "number" ? O.code : Dq8.Status.UNKNOWN, `Getting metadata from plugin failed with error: ${O.message}`);
                K.onReceiveStatus({
                    code: w,
                    details: $,
                    metadata: new Fe1.Metadata
                });
                return
            }
            z.merge(_);
            let Y = {
                onReceiveMetadata: async (A) => {
                    K.onReceiveMetadata(await this.filterStack.receiveMetadata(A))
                },
                onReceiveMessage: async (A) => {
                    this.readFilterPending = !0;
                    let O = await this.filterStack.receiveMessage(A);
                    if (this.readFilterPending = !1, K.onReceiveMessage(O), this.pendingStatus) K.onReceiveStatus(this.pendingStatus)
                },
                onReceiveStatus: async (A) => {
                    let O = await this.filterStack.receiveTrailers(A);
                    if (this.readFilterPending) this.pendingStatus = O;
                    else K.onReceiveStatus(O)
                }
            };
            if (this.childCall = this.subchannel.createCall(z, this.options.host, this.method, Y), this.readPending) this.childCall.startRead();
            if (this.pendingMessage) this.childCall.sendMessageWithContext(this.pendingMessage.context, this.pendingMessage.message);
            if (this.halfClosePending && !this.writeFilterPending) this.childCall.halfClose()
        }
        async sendMessageWithContext(q, K) {
            this.writeFilterPending = !0;
            let _ = await this.filterStack.sendMessage(Promise.resolve({
                message: K,
                flags: q.flags
            }));
            if (this.writeFilterPending = !1, this.childCall) {
                if (this.childCall.sendMessageWithContext(q, _.message), this.halfClosePending) this.childCall.halfClose()
            } else this.pendingMessage = {
                context: q,
                message: _.message
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
        setCredentials(q) {
            throw Error("Method not implemented.")
        }
        getAuthContext() {
            if (this.childCall) return this.childCall.getAuthContext();
            else return null
        }
    }
    class XqK {
        constructor(q, K, _) {
            if (this.subchannel = q, this.target = K, this.channelzEnabled = !1, this.channelzTrace = new Wq8.ChannelzTrace, this.callTracker = new Wq8.ChannelzCallTracker, this.childrenTracker = new Wq8.ChannelzChildrenTracker, this.channelzEnabled = _["grpc.enable_channelz"] !== 0, this.channelzRef = (0, Wq8.registerChannelzChannel)((0, EB8.uriToString)(K), () => ({
                    target: `${(0,EB8.uriToString)(K)} (${q.getAddress()})`,
                    state: this.subchannel.getConnectivityState(),
                    trace: this.channelzTrace,
                    callTracker: this.callTracker,
                    children: this.childrenTracker.getChildLists()
                }), this.channelzEnabled), this.channelzEnabled) this.childrenTracker.refChild(q.getChannelzRef());
            this.filterStackFactory = new EUz.FilterStackFactory([new TUz.CompressionFilterFactory(this, _)])
        }
        close() {
            if (this.channelzEnabled) this.childrenTracker.unrefChild(this.subchannel.getChannelzRef());
            (0, Wq8.unregisterChannelzRef)(this.channelzRef)
        }
        getTarget() {
            return (0, EB8.uriToString)(this.target)
        }
        getConnectivityState(q) {
            throw Error("Method not implemented.")
        }
        watchConnectivityState(q, K, _) {
            throw Error("Method not implemented.")
        }
        getChannelzRef() {
            return this.channelzRef
        }
        createCall(q, K) {
            let _ = {
                deadline: K,
                host: (0, yUz.getDefaultAuthority)(this.target),
                flags: Dq8.Propagate.DEFAULTS,
                parentCall: null
            };
            return new JqK(this.subchannel, q, this.filterStackFactory, _, (0, vUz.getNextCallNumber)())
        }
    }
    MqK.SingleSubchannelChannel = XqK
})
// @from(Ln 316794, Col 4)
GqK = p((ZqK) => {
    Object.defineProperty(ZqK, "__esModule", {
        value: !0
    });
    ZqK.Subchannel = void 0;
    var X2 = ik(),
        LUz = ZS6(),
        ge1 = o2(),
        yB8 = e_(),
        hUz = nk(),
        RUz = by(),
        Gl = I36(),
        SUz = WqK(),
        CUz = "subchannel",
        bUz = 2147483647;
    class DqK {
        constructor(q, K, _, z, Y) {
            var A;
            this.channelTarget = q, this.subchannelAddress = K, this.options = _, this.connector = Y, this.connectivityState = X2.ConnectivityState.IDLE, this.transport = null, this.continueConnecting = !1, this.stateListeners = new Set, this.refcount = 0, this.channelzEnabled = !0, this.dataProducers = new Map, this.subchannelChannel = null;
            let O = {
                initialDelay: _["grpc.initial_reconnect_backoff_ms"],
                maxDelay: _["grpc.max_reconnect_backoff_ms"]
            };
            if (this.backoffTimeout = new LUz.BackoffTimeout(() => {
                    this.handleBackoffTimer()
                }, O), this.backoffTimeout.unref(), this.subchannelAddressString = (0, RUz.subchannelAddressToString)(K), this.keepaliveTime = (A = _["grpc.keepalive_time_ms"]) !== null && A !== void 0 ? A : -1, _["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.channelzTrace = new Gl.ChannelzTraceStub, this.callTracker = new Gl.ChannelzCallTrackerStub, this.childrenTracker = new Gl.ChannelzChildrenTrackerStub, this.streamTracker = new Gl.ChannelzCallTrackerStub;
            else this.channelzTrace = new Gl.ChannelzTrace, this.callTracker = new Gl.ChannelzCallTracker, this.childrenTracker = new Gl.ChannelzChildrenTracker, this.streamTracker = new Gl.ChannelzCallTracker;
            this.channelzRef = (0, Gl.registerChannelzSubchannel)(this.subchannelAddressString, () => this.getChannelzInfo(), this.channelzEnabled), this.channelzTrace.addTrace("CT_INFO", "Subchannel created"), this.trace("Subchannel constructed with options " + JSON.stringify(_, void 0, 2)), this.secureConnector = z._createSecureConnector(q, _)
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
        trace(q) {
            ge1.trace(yB8.LogVerbosity.DEBUG, CUz, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + q)
        }
        refTrace(q) {
            ge1.trace(yB8.LogVerbosity.DEBUG, "subchannel_refcount", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + q)
        }
        handleBackoffTimer() {
            if (this.continueConnecting) this.transitionToState([X2.ConnectivityState.TRANSIENT_FAILURE], X2.ConnectivityState.CONNECTING);
            else this.transitionToState([X2.ConnectivityState.TRANSIENT_FAILURE], X2.ConnectivityState.IDLE)
        }
        startBackoff() {
            this.backoffTimeout.runOnce()
        }
        stopBackoff() {
            this.backoffTimeout.stop(), this.backoffTimeout.reset()
        }
        startConnectingInternal() {
            let q = this.options;
            if (q["grpc.keepalive_time_ms"]) {
                let K = Math.min(this.keepaliveTime, bUz);
                q = Object.assign(Object.assign({}, q), {
                    "grpc.keepalive_time_ms": K
                })
            }
            this.connector.connect(this.subchannelAddress, this.secureConnector, q).then((K) => {
                if (this.transitionToState([X2.ConnectivityState.CONNECTING], X2.ConnectivityState.READY)) {
                    if (this.transport = K, this.channelzEnabled) this.childrenTracker.refChild(K.getChannelzRef());
                    K.addDisconnectListener((_) => {
                        if (this.transitionToState([X2.ConnectivityState.READY], X2.ConnectivityState.IDLE), _ && this.keepaliveTime > 0) this.keepaliveTime *= 2, ge1.log(yB8.LogVerbosity.ERROR, `Connection to ${(0,hUz.uriToString)(this.channelTarget)} at ${this.subchannelAddressString} rejected by server because of excess pings. Increasing ping interval to ${this.keepaliveTime} ms`)
                    })
                } else K.shutdown()
            }, (K) => {
                this.transitionToState([X2.ConnectivityState.CONNECTING], X2.ConnectivityState.TRANSIENT_FAILURE, `${K}`)
            })
        }
        transitionToState(q, K, _) {
            var z, Y;
            if (q.indexOf(this.connectivityState) === -1) return !1;
            if (_) this.trace(X2.ConnectivityState[this.connectivityState] + " -> " + X2.ConnectivityState[K] + ' with error "' + _ + '"');
            else this.trace(X2.ConnectivityState[this.connectivityState] + " -> " + X2.ConnectivityState[K]);
            if (this.channelzEnabled) this.channelzTrace.addTrace("CT_INFO", "Connectivity state change to " + X2.ConnectivityState[K]);
            let A = this.connectivityState;
            switch (this.connectivityState = K, K) {
                case X2.ConnectivityState.READY:
                    this.stopBackoff();
                    break;
                case X2.ConnectivityState.CONNECTING:
                    this.startBackoff(), this.startConnectingInternal(), this.continueConnecting = !1;
                    break;
                case X2.ConnectivityState.TRANSIENT_FAILURE:
                    if (this.channelzEnabled && this.transport) this.childrenTracker.unrefChild(this.transport.getChannelzRef());
                    if ((z = this.transport) === null || z === void 0 || z.shutdown(), this.transport = null, !this.backoffTimeout.isRunning()) process.nextTick(() => {
                        this.handleBackoffTimer()
                    });
                    break;
                case X2.ConnectivityState.IDLE:
                    if (this.channelzEnabled && this.transport) this.childrenTracker.unrefChild(this.transport.getChannelzRef());
                    (Y = this.transport) === null || Y === void 0 || Y.shutdown(), this.transport = null;
                    break;
                default:
                    throw Error(`Invalid state: unknown ConnectivityState ${K}`)
            }
            for (let O of this.stateListeners) O(this, A, K, this.keepaliveTime, _);
            return !0
        }
        ref() {
            this.refTrace("refcount " + this.refcount + " -> " + (this.refcount + 1)), this.refcount += 1
        }
        unref() {
            if (this.refTrace("refcount " + this.refcount + " -> " + (this.refcount - 1)), this.refcount -= 1, this.refcount === 0) this.channelzTrace.addTrace("CT_INFO", "Shutting down"), (0, Gl.unregisterChannelzRef)(this.channelzRef), this.secureConnector.destroy(), process.nextTick(() => {
                this.transitionToState([X2.ConnectivityState.CONNECTING, X2.ConnectivityState.READY], X2.ConnectivityState.IDLE)
            })
        }
        unrefIfOneRef() {
            if (this.refcount === 1) return this.unref(), !0;
            return !1
        }
        createCall(q, K, _, z) {
            if (!this.transport) throw Error("Cannot create call, subchannel not READY");
            let Y;
            if (this.channelzEnabled) this.callTracker.addCallStarted(), this.streamTracker.addCallStarted(), Y = {
                onCallEnd: (A) => {
                    if (A.code === yB8.Status.OK) this.callTracker.addCallSucceeded();
                    else this.callTracker.addCallFailed()
                }
            };
            else Y = {};
            return this.transport.createCall(q, K, _, z, Y)
        }
        startConnecting() {
            process.nextTick(() => {
                if (!this.transitionToState([X2.ConnectivityState.IDLE], X2.ConnectivityState.CONNECTING)) {
                    if (this.connectivityState === X2.ConnectivityState.TRANSIENT_FAILURE) this.continueConnecting = !0
                }
            })
        }
        getConnectivityState() {
            return this.connectivityState
        }
        addConnectivityStateListener(q) {
            this.stateListeners.add(q)
        }
        removeConnectivityStateListener(q) {
            this.stateListeners.delete(q)
        }
        resetBackoff() {
            process.nextTick(() => {
                this.backoffTimeout.reset(), this.transitionToState([X2.ConnectivityState.TRANSIENT_FAILURE], X2.ConnectivityState.CONNECTING)
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
        addHealthStateWatcher(q) {}
        removeHealthStateWatcher(q) {}
        getRealSubchannel() {
            return this
        }
        realSubchannelEquals(q) {
            return q.getRealSubchannel() === this
        }
        throttleKeepalive(q) {
            if (q > this.keepaliveTime) this.keepaliveTime = q
        }
        getCallCredentials() {
            return this.secureConnector.getCallCredentials()
        }
        getChannel() {
            if (!this.subchannelChannel) this.subchannelChannel = new SUz.SingleSubchannelChannel(this, this.channelTarget, this.options);
            return this.subchannelChannel
        }
        addDataWatcher(q) {
            throw Error("Not implemented")
        }
        getOrCreateDataProducer(q, K) {
            let _ = this.dataProducers.get(q);
            if (_) return _;
            let z = K(this);
            return this.dataProducers.set(q, z), z
        }
        removeDataProducer(q) {
            this.dataProducers.delete(q)
        }
    }
    ZqK.Subchannel = DqK
})
// @from(Ln 316984, Col 4)
VqK = p((vqK) => {
    var Ue1;
    Object.defineProperty(vqK, "__esModule", {
        value: !0
    });
    vqK.GRPC_NODE_USE_ALTERNATIVE_RESOLVER = void 0;
    vqK.GRPC_NODE_USE_ALTERNATIVE_RESOLVER = ((Ue1 = process.env.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) !== null && Ue1 !== void 0 ? Ue1 : "false") === "true"
})
// @from(Ln 316992, Col 4)
ce1 = p((LqK) => {
    Object.defineProperty(LqK, "__esModule", {
        value: !0
    });
    LqK.DEFAULT_PORT = void 0;
    LqK.setup = gUz;
    var kqK = GF(),
        Qe1 = d6("dns"),
        IUz = yt1(),
        de1 = e_(),
        bS6 = nJ6(),
        xUz = QD(),
        uUz = o2(),
        mUz = e_(),
        x36 = nk(),
        NqK = d6("net"),
        BUz = ZS6(),
        EqK = VqK(),
        pUz = "dns_resolver";

    function vl(q) {
        uUz.trace(mUz.LogVerbosity.DEBUG, pUz, q)
    }
    LqK.DEFAULT_PORT = 443;
    var FUz = 30000;
    class yqK {
        constructor(q, K, _) {
            var z, Y, A;
            if (this.target = q, this.listener = K, this.pendingLookupPromise = null, this.pendingTxtPromise = null, this.latestLookupResult = null, this.latestServiceConfigResult = null, this.continueResolving = !1, this.isNextResolutionTimerRunning = !1, this.isServiceConfigEnabled = !0, this.returnedIpResult = !1, this.alternativeResolver = new Qe1.promises.Resolver, vl("Resolver constructed for target " + (0, x36.uriToString)(q)), q.authority) this.alternativeResolver.setServers([q.authority]);
            let O = (0, x36.splitHostPort)(q.path);
            if (O === null) this.ipResult = null, this.dnsHostname = null, this.port = null;
            else if ((0, NqK.isIPv4)(O.host) || (0, NqK.isIPv6)(O.host)) this.ipResult = [{
                addresses: [{
                    host: O.host,
                    port: (z = O.port) !== null && z !== void 0 ? z : LqK.DEFAULT_PORT
                }]
            }], this.dnsHostname = null, this.port = null;
            else this.ipResult = null, this.dnsHostname = O.host, this.port = (Y = O.port) !== null && Y !== void 0 ? Y : LqK.DEFAULT_PORT;
            if (this.percentage = Math.random() * 100, _["grpc.service_config_disable_resolution"] === 1) this.isServiceConfigEnabled = !1;
            this.defaultResolutionError = {
                code: de1.Status.UNAVAILABLE,
                details: `Name resolution failed for target ${(0,x36.uriToString)(this.target)}`,
                metadata: new xUz.Metadata
            };
            let w = {
                initialDelay: _["grpc.initial_reconnect_backoff_ms"],
                maxDelay: _["grpc.max_reconnect_backoff_ms"]
            };
            this.backoff = new BUz.BackoffTimeout(() => {
                if (this.continueResolving) this.startResolutionWithBackoff()
            }, w), this.backoff.unref(), this.minTimeBetweenResolutionsMs = (A = _["grpc.dns_min_time_between_resolutions_ms"]) !== null && A !== void 0 ? A : FUz, this.nextResolutionTimer = setTimeout(() => {}, 0), clearTimeout(this.nextResolutionTimer)
        }
        startResolution() {
            if (this.ipResult !== null) {
                if (!this.returnedIpResult) vl("Returning IP address for target " + (0, x36.uriToString)(this.target)), setImmediate(() => {
                    this.listener((0, bS6.statusOrFromValue)(this.ipResult), {}, null, "")
                }), this.returnedIpResult = !0;
                this.backoff.stop(), this.backoff.reset(), this.stopNextResolutionTimer();
                return
            }
            if (this.dnsHostname === null) vl("Failed to parse DNS address " + (0, x36.uriToString)(this.target)), setImmediate(() => {
                this.listener((0, bS6.statusOrFromError)({
                    code: de1.Status.UNAVAILABLE,
                    details: `Failed to parse DNS address ${(0,x36.uriToString)(this.target)}`
                }), {}, null, "")
            }), this.stopNextResolutionTimer();
            else {
                if (this.pendingLookupPromise !== null) return;
                vl("Looking up DNS hostname " + this.dnsHostname), this.latestLookupResult = null;
                let q = this.dnsHostname;
                if (this.pendingLookupPromise = this.lookup(q), this.pendingLookupPromise.then((K) => {
                        if (this.pendingLookupPromise === null) return;
                        this.pendingLookupPromise = null, this.latestLookupResult = (0, bS6.statusOrFromValue)(K.map((Y) => ({
                            addresses: [Y]
                        })));
                        let _ = "[" + K.map((Y) => Y.host + ":" + Y.port).join(",") + "]";
                        vl("Resolved addresses for target " + (0, x36.uriToString)(this.target) + ": " + _);
                        let z = this.listener(this.latestLookupResult, {}, this.latestServiceConfigResult, "");
                        this.handleHealthStatus(z)
                    }, (K) => {
                        if (this.pendingLookupPromise === null) return;
                        vl("Resolution error for target " + (0, x36.uriToString)(this.target) + ": " + K.message), this.pendingLookupPromise = null, this.stopNextResolutionTimer(), this.listener((0, bS6.statusOrFromError)(this.defaultResolutionError), {}, this.latestServiceConfigResult, "")
                    }), this.isServiceConfigEnabled && this.pendingTxtPromise === null) this.pendingTxtPromise = this.resolveTxt(q), this.pendingTxtPromise.then((K) => {
                    if (this.pendingTxtPromise === null) return;
                    this.pendingTxtPromise = null;
                    let _;
                    try {
                        if (_ = (0, IUz.extractAndSelectServiceConfig)(K, this.percentage), _) this.latestServiceConfigResult = (0, bS6.statusOrFromValue)(_);
                        else this.latestServiceConfigResult = null
                    } catch (z) {
                        this.latestServiceConfigResult = (0, bS6.statusOrFromError)({
                            code: de1.Status.UNAVAILABLE,
                            details: `Parsing service config failed with error ${z.message}`
                        })
                    }
                    if (this.latestLookupResult !== null) this.listener(this.latestLookupResult, {}, this.latestServiceConfigResult, "")
                }, (K) => {})
            }
        }
        handleHealthStatus(q) {
            if (q) this.backoff.stop(), this.backoff.reset();
            else this.continueResolving = !0
        }
        async lookup(q) {
            if (EqK.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) {
                vl("Using alternative DNS resolver.");
                let _ = await Promise.allSettled([this.alternativeResolver.resolve4(q), this.alternativeResolver.resolve6(q)]);
                if (_.every((z) => z.status === "rejected")) throw Error(_[0].reason);
                return _.reduce((z, Y) => {
                    return Y.status === "fulfilled" ? [...z, ...Y.value] : z
                }, []).map((z) => ({
                    host: z,
                    port: +this.port
                }))
            }
            return (await Qe1.promises.lookup(q, {
                all: !0
            })).map((_) => ({
                host: _.address,
                port: +this.port
            }))
        }
        async resolveTxt(q) {
            if (EqK.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) return vl("Using alternative DNS resolver."), this.alternativeResolver.resolveTxt(q);
            return Qe1.promises.resolveTxt(q)
        }
        startNextResolutionTimer() {
            var q, K;
            clearTimeout(this.nextResolutionTimer), this.nextResolutionTimer = setTimeout(() => {
                if (this.stopNextResolutionTimer(), this.continueResolving) this.startResolutionWithBackoff()
            }, this.minTimeBetweenResolutionsMs), (K = (q = this.nextResolutionTimer).unref) === null || K === void 0 || K.call(q), this.isNextResolutionTimerRunning = !0
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
                    if (this.isNextResolutionTimerRunning) vl('resolution update delayed by "min time between resolutions" rate limit');
                    else vl("resolution update delayed by backoff timer until " + this.backoff.getEndTime().toISOString());
                    this.continueResolving = !0
                } else this.startResolutionWithBackoff()
        }
        destroy() {
            this.continueResolving = !1, this.backoff.reset(), this.backoff.stop(), this.stopNextResolutionTimer(), this.pendingLookupPromise = null, this.pendingTxtPromise = null, this.latestLookupResult = null, this.latestServiceConfigResult = null, this.returnedIpResult = !1
        }
        static getDefaultAuthority(q) {
            return q.path
        }
    }

    function gUz() {
        (0, kqK.registerResolver)("dns", yqK), (0, kqK.registerDefaultScheme)("dns")
    }
})
// @from(Ln 317150, Col 4)
le1 = p((bqK) => {
    Object.defineProperty(bqK, "__esModule", {
        value: !0
    });
    bqK.parseCIDR = SqK;
    bqK.mapProxyName = sUz;
    bqK.getProxiedConnection = tUz;
    var Zq8 = o2(),
        IS6 = e_(),
        RqK = d6("net"),
        QUz = d6("http"),
        dUz = o2(),
        hqK = by(),
        fq8 = nk(),
        cUz = d6("url"),
        lUz = ce1(),
        nUz = "proxy";

    function xS6(q) {
        dUz.trace(IS6.LogVerbosity.DEBUG, nUz, q)
    }

    function iUz() {
        let q = "",
            K = "";
        if (process.env.grpc_proxy) K = "grpc_proxy", q = process.env.grpc_proxy;
        else if (process.env.https_proxy) K = "https_proxy", q = process.env.https_proxy;
        else if (process.env.http_proxy) K = "http_proxy", q = process.env.http_proxy;
        else return {};
        let _;
        try {
            _ = new cUz.URL(q)
        } catch (w) {
            return (0, Zq8.log)(IS6.LogVerbosity.ERROR, `cannot parse value of "${K}" env var`), {}
        }
        if (_.protocol !== "http:") return (0, Zq8.log)(IS6.LogVerbosity.ERROR, `"${_.protocol}" scheme not supported in proxy URI`), {};
        let z = null;
        if (_.username)
            if (_.password)(0, Zq8.log)(IS6.LogVerbosity.INFO, "userinfo found in proxy URI"), z = decodeURIComponent(`${_.username}:${_.password}`);
            else z = _.username;
        let {
            hostname: Y,
            port: A
        } = _;
        if (A === "") A = "80";
        let O = {
            address: `${Y}:${A}`
        };
        if (z) O.creds = z;
        return xS6("Proxy server " + O.address + " set by environment variable " + K), O
    }

    function rUz() {
        let q = process.env.no_grpc_proxy,
            K = "no_grpc_proxy";
        if (!q) q = process.env.no_proxy, K = "no_proxy";
        if (q) return xS6("No proxy server list set by environment variable " + K), q.split(",");
        else return []
    }

    function SqK(q) {
        let K = q.split("/");
        if (K.length !== 2) return null;
        let _ = parseInt(K[1], 10);
        if (!(0, RqK.isIPv4)(K[0]) || Number.isNaN(_) || _ < 0 || _ > 32) return null;
        return {
            ip: CqK(K[0]),
            prefixLength: _
        }
    }

    function CqK(q) {
        return q.split(".").reduce((K, _) => (K << 8) + parseInt(_, 10), 0)
    }

    function oUz(q, K) {
        let _ = q.ip,
            z = -1 << 32 - q.prefixLength;
        return (CqK(K) & z) === (_ & z)
    }

    function aUz(q) {
        for (let K of rUz()) {
            let _ = SqK(K);
            if ((0, RqK.isIPv4)(q) && _ && oUz(_, q)) return !0;
            else if (q.endsWith(K)) return !0
        }
        return !1
    }

    function sUz(q, K) {
        var _;
        let z = {
            target: q,
            extraOptions: {}
        };
        if (((_ = K["grpc.enable_http_proxy"]) !== null && _ !== void 0 ? _ : 1) === 0) return z;
        if (q.scheme === "unix") return z;
        let Y = iUz();
        if (!Y.address) return z;
        let A = (0, fq8.splitHostPort)(q.path);
        if (!A) return z;
        let O = A.host;
        if (aUz(O)) return xS6("Not using proxy for target in no_proxy list: " + (0, fq8.uriToString)(q)), z;
        let w = {
            "grpc.http_connect_target": (0, fq8.uriToString)(q)
        };
        if (Y.creds) w["grpc.http_connect_creds"] = Y.creds;
        return {
            target: {
                scheme: "dns",
                path: Y.address
            },
            extraOptions: w
        }
    }

    function tUz(q, K) {
        var _;
        if (!("grpc.http_connect_target" in K)) return Promise.resolve(null);
        let z = K["grpc.http_connect_target"],
            Y = (0, fq8.parseUri)(z);
        if (Y === null) return Promise.resolve(null);
        let A = (0, fq8.splitHostPort)(Y.path);
        if (A === null) return Promise.resolve(null);
        let O = `${A.host}:${(_=A.port)!==null&&_!==void 0?_:lUz.DEFAULT_PORT}`,
            w = {
                method: "CONNECT",
                path: O
            },
            $ = {
                Host: O
            };
        if ((0, hqK.isTcpSubchannelAddress)(q)) w.host = q.host, w.port = q.port;
        else w.socketPath = q.path;
        if ("grpc.http_connect_creds" in K) $["Proxy-Authorization"] = "Basic " + Buffer.from(K["grpc.http_connect_creds"]).toString("base64");
        w.headers = $;
        let j = (0, hqK.subchannelAddressToString)(q);
        return xS6("Using proxy " + j + " to connect to " + w.path), new Promise((H, J) => {
            let X = QUz.request(w);
            X.once("connect", (M, P, W) => {
                if (X.removeAllListeners(), P.removeAllListeners(), M.statusCode === 200) {
                    if (xS6("Successfully connected to " + w.path + " through proxy " + j), W.length > 0) P.unshift(W);
                    xS6("Successfully established a plaintext connection to " + w.path + " through proxy " + j), H(P)
                } else(0, Zq8.log)(IS6.LogVerbosity.ERROR, "Failed to connect to " + w.path + " through proxy " + j + " with status " + M.statusCode), J()
            }), X.once("error", (M) => {
                X.removeAllListeners(), (0, Zq8.log)(IS6.LogVerbosity.ERROR, "Failed to connect to proxy " + j + " with error " + M.message), J()
            }), X.end()
        })
    }
})
// @from(Ln 317301, Col 4)
ne1 = p((xqK) => {
    Object.defineProperty(xqK, "__esModule", {
        value: !0
    });
    xqK.StreamDecoder = void 0;
    var Tl;
    (function(q) {
        q[q.NO_DATA = 0] = "NO_DATA", q[q.READING_SIZE = 1] = "READING_SIZE", q[q.READING_MESSAGE = 2] = "READING_MESSAGE"
    })(Tl || (Tl = {}));
    class IqK {
        constructor(q) {
            this.maxReadMessageLength = q, this.readState = Tl.NO_DATA, this.readCompressFlag = Buffer.alloc(1), this.readPartialSize = Buffer.alloc(4), this.readSizeRemaining = 4, this.readMessageSize = 0, this.readPartialMessage = [], this.readMessageRemaining = 0
        }
        write(q) {
            let K = 0,
                _, z = [];
            while (K < q.length) switch (this.readState) {
                case Tl.NO_DATA:
                    this.readCompressFlag = q.slice(K, K + 1), K += 1, this.readState = Tl.READING_SIZE, this.readPartialSize.fill(0), this.readSizeRemaining = 4, this.readMessageSize = 0, this.readMessageRemaining = 0, this.readPartialMessage = [];
                    break;
                case Tl.READING_SIZE:
                    if (_ = Math.min(q.length - K, this.readSizeRemaining), q.copy(this.readPartialSize, 4 - this.readSizeRemaining, K, K + _), this.readSizeRemaining -= _, K += _, this.readSizeRemaining === 0) {
                        if (this.readMessageSize = this.readPartialSize.readUInt32BE(0), this.maxReadMessageLength !== -1 && this.readMessageSize > this.maxReadMessageLength) throw Error(`Received message larger than max (${this.readMessageSize} vs ${this.maxReadMessageLength})`);
                        if (this.readMessageRemaining = this.readMessageSize, this.readMessageRemaining > 0) this.readState = Tl.READING_MESSAGE;
                        else {
                            let Y = Buffer.concat([this.readCompressFlag, this.readPartialSize], 5);
                            this.readState = Tl.NO_DATA, z.push(Y)
                        }
                    }
                    break;
                case Tl.READING_MESSAGE:
                    if (_ = Math.min(q.length - K, this.readMessageRemaining), this.readPartialMessage.push(q.slice(K, K + _)), this.readMessageRemaining -= _, K += _, this.readMessageRemaining === 0) {
                        let Y = [this.readCompressFlag, this.readPartialSize].concat(this.readPartialMessage),
                            A = Buffer.concat(Y, this.readMessageSize + 5);
                        this.readState = Tl.NO_DATA, z.push(A)
                    }
                    break;
                default:
                    throw Error("Unexpected read state")
            }
            return z
        }
    }
    xqK.StreamDecoder = IqK
})