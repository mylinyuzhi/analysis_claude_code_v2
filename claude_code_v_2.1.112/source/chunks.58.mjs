
// @from(Ln 150038, Col 4)
oL1 = p((EBq, cT8) => {
    (function(q) {
        var K, _ = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
            z = Math.ceil,
            Y = Math.floor,
            A = "[BigNumber Error] ",
            O = A + "Number primitive has more than 15 significant digits: ",
            w = 100000000000000,
            $ = 14,
            j = 9007199254740991,
            H = [1, 10, 100, 1000, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 10000000000, 100000000000, 1000000000000, 10000000000000],
            J = 1e7,
            X = 1e9;

        function M(V) {
            var k, N, R, h = e.prototype = {
                    constructor: e,
                    toString: null,
                    valueOf: null
                },
                C = new e(1),
                x = 20,
                B = 4,
                m = -7,
                S = 21,
                F = -1e7,
                U = 1e7,
                g = !1,
                c = 1,
                n = 0,
                l = {
                    prefix: "",
                    groupSize: 3,
                    secondaryGroupSize: 0,
                    groupSeparator: ",",
                    decimalSeparator: ".",
                    fractionGroupSize: 0,
                    fractionGroupSeparator: " ",
                    suffix: ""
                },
                z6 = "0123456789abcdefghijklmnopqrstuvwxyz",
                A6 = !0;

            function e(q6, o) {
                var _6, r, t, Y6, X6, M6, W6, V6, f6 = this;
                if (!(f6 instanceof e)) return new e(q6, o);
                if (o == null) {
                    if (q6 && q6._isBigNumber === !0) {
                        if (f6.s = q6.s, !q6.c || q6.e > U) f6.c = f6.e = null;
                        else if (q6.e < F) f6.c = [f6.e = 0];
                        else f6.e = q6.e, f6.c = q6.c.slice();
                        return
                    }
                    if ((M6 = typeof q6 == "number") && q6 * 0 == 0) {
                        if (f6.s = 1 / q6 < 0 ? (q6 = -q6, -1) : 1, q6 === ~~q6) {
                            for (Y6 = 0, X6 = q6; X6 >= 10; X6 /= 10, Y6++);
                            if (Y6 > U) f6.c = f6.e = null;
                            else f6.e = Y6, f6.c = [q6];
                            return
                        }
                        V6 = String(q6)
                    } else {
                        if (!_.test(V6 = String(q6))) return R(f6, V6, M6);
                        f6.s = V6.charCodeAt(0) == 45 ? (V6 = V6.slice(1), -1) : 1
                    }
                    if ((Y6 = V6.indexOf(".")) > -1) V6 = V6.replace(".", "");
                    if ((X6 = V6.search(/e/i)) > 0) {
                        if (Y6 < 0) Y6 = X6;
                        Y6 += +V6.slice(X6 + 1), V6 = V6.substring(0, X6)
                    } else if (Y6 < 0) Y6 = V6.length
                } else {
                    if (Z(o, 2, z6.length, "Base"), o == 10 && A6) return f6 = new e(q6), $6(f6, x + f6.e + 1, B);
                    if (V6 = String(q6), M6 = typeof q6 == "number") {
                        if (q6 * 0 != 0) return R(f6, V6, M6, o);
                        if (f6.s = 1 / q6 < 0 ? (V6 = V6.slice(1), -1) : 1, e.DEBUG && V6.replace(/^0\.0*|\./, "").length > 15) throw Error(O + q6)
                    } else f6.s = V6.charCodeAt(0) === 45 ? (V6 = V6.slice(1), -1) : 1;
                    _6 = z6.slice(0, o), Y6 = X6 = 0;
                    for (W6 = V6.length; X6 < W6; X6++)
                        if (_6.indexOf(r = V6.charAt(X6)) < 0) {
                            if (r == ".") {
                                if (X6 > Y6) {
                                    Y6 = W6;
                                    continue
                                }
                            } else if (!t) {
                                if (V6 == V6.toUpperCase() && (V6 = V6.toLowerCase()) || V6 == V6.toLowerCase() && (V6 = V6.toUpperCase())) {
                                    t = !0, X6 = -1, Y6 = 0;
                                    continue
                                }
                            }
                            return R(f6, String(q6), M6, o)
                        } if (M6 = !1, V6 = N(V6, o, 10, f6.s), (Y6 = V6.indexOf(".")) > -1) V6 = V6.replace(".", "");
                    else Y6 = V6.length
                }
                for (X6 = 0; V6.charCodeAt(X6) === 48; X6++);
                for (W6 = V6.length; V6.charCodeAt(--W6) === 48;);
                if (V6 = V6.slice(X6, ++W6)) {
                    if (W6 -= X6, M6 && e.DEBUG && W6 > 15 && (q6 > j || q6 !== Y(q6))) throw Error(O + f6.s * q6);
                    if ((Y6 = Y6 - X6 - 1) > U) f6.c = f6.e = null;
                    else if (Y6 < F) f6.c = [f6.e = 0];
                    else {
                        if (f6.e = Y6, f6.c = [], X6 = (Y6 + 1) % $, Y6 < 0) X6 += $;
                        if (X6 < W6) {
                            if (X6) f6.c.push(+V6.slice(0, X6));
                            for (W6 -= $; X6 < W6;) f6.c.push(+V6.slice(X6, X6 += $));
                            X6 = $ - (V6 = V6.slice(X6)).length
                        } else X6 -= W6;
                        for (; X6--; V6 += "0");
                        f6.c.push(+V6)
                    }
                } else f6.c = [f6.e = 0]
            }
            e.clone = M, e.ROUND_UP = 0, e.ROUND_DOWN = 1, e.ROUND_CEIL = 2, e.ROUND_FLOOR = 3, e.ROUND_HALF_UP = 4, e.ROUND_HALF_DOWN = 5, e.ROUND_HALF_EVEN = 6, e.ROUND_HALF_CEIL = 7, e.ROUND_HALF_FLOOR = 8, e.EUCLID = 9, e.config = e.set = function(q6) {
                var o, _6;
                if (q6 != null)
                    if (typeof q6 == "object") {
                        if (q6.hasOwnProperty(o = "DECIMAL_PLACES")) _6 = q6[o], Z(_6, 0, X, o), x = _6;
                        if (q6.hasOwnProperty(o = "ROUNDING_MODE")) _6 = q6[o], Z(_6, 0, 8, o), B = _6;
                        if (q6.hasOwnProperty(o = "EXPONENTIAL_AT"))
                            if (_6 = q6[o], _6 && _6.pop) Z(_6[0], -X, 0, o), Z(_6[1], 0, X, o), m = _6[0], S = _6[1];
                            else Z(_6, -X, X, o), m = -(S = _6 < 0 ? -_6 : _6);
                        if (q6.hasOwnProperty(o = "RANGE"))
                            if (_6 = q6[o], _6 && _6.pop) Z(_6[0], -X, -1, o), Z(_6[1], 1, X, o), F = _6[0], U = _6[1];
                            else if (Z(_6, -X, X, o), _6) F = -(U = _6 < 0 ? -_6 : _6);
                        else throw Error(A + o + " cannot be zero: " + _6);
                        if (q6.hasOwnProperty(o = "CRYPTO"))
                            if (_6 = q6[o], _6 === !!_6)
                                if (_6)
                                    if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes)) g = _6;
                                    else throw g = !_6, Error(A + "crypto unavailable");
                        else g = _6;
                        else throw Error(A + o + " not true or false: " + _6);
                        if (q6.hasOwnProperty(o = "MODULO_MODE")) _6 = q6[o], Z(_6, 0, 9, o), c = _6;
                        if (q6.hasOwnProperty(o = "POW_PRECISION")) _6 = q6[o], Z(_6, 0, X, o), n = _6;
                        if (q6.hasOwnProperty(o = "FORMAT"))
                            if (_6 = q6[o], typeof _6 == "object") l = _6;
                            else throw Error(A + o + " not an object: " + _6);
                        if (q6.hasOwnProperty(o = "ALPHABET"))
                            if (_6 = q6[o], typeof _6 == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(_6)) A6 = _6.slice(0, 10) == "0123456789", z6 = _6;
                            else throw Error(A + o + " invalid: " + _6)
                    } else throw Error(A + "Object expected: " + q6);
                return {
                    DECIMAL_PLACES: x,
                    ROUNDING_MODE: B,
                    EXPONENTIAL_AT: [m, S],
                    RANGE: [F, U],
                    CRYPTO: g,
                    MODULO_MODE: c,
                    POW_PRECISION: n,
                    FORMAT: l,
                    ALPHABET: z6
                }
            }, e.isBigNumber = function(q6) {
                if (!q6 || q6._isBigNumber !== !0) return !1;
                if (!e.DEBUG) return !0;
                var o, _6, r = q6.c,
                    t = q6.e,
                    Y6 = q6.s;
                q: if ({}.toString.call(r) == "[object Array]") {
                    if ((Y6 === 1 || Y6 === -1) && t >= -X && t <= X && t === Y(t)) {
                        if (r[0] === 0) {
                            if (t === 0 && r.length === 1) return !0;
                            break q
                        }
                        if (o = (t + 1) % $, o < 1) o += $;
                        if (String(r[0]).length == o) {
                            for (o = 0; o < r.length; o++)
                                if (_6 = r[o], _6 < 0 || _6 >= w || _6 !== Y(_6)) break q;
                            if (_6 !== 0) return !0
                        }
                    }
                } else if (r === null && t === null && (Y6 === null || Y6 === 1 || Y6 === -1)) return !0;
                throw Error(A + "Invalid BigNumber: " + q6)
            }, e.maximum = e.max = function() {
                return O6(arguments, -1)
            }, e.minimum = e.min = function() {
                return O6(arguments, 1)
            }, e.random = function() {
                var q6 = 9007199254740992,
                    o = Math.random() * q6 & 2097151 ? function() {
                        return Y(Math.random() * q6)
                    } : function() {
                        return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0)
                    };
                return function(_6) {
                    var r, t, Y6, X6, M6, W6 = 0,
                        V6 = [],
                        f6 = new e(C);
                    if (_6 == null) _6 = x;
                    else Z(_6, 0, X);
                    if (X6 = z(_6 / $), g)
                        if (crypto.getRandomValues) {
                            r = crypto.getRandomValues(new Uint32Array(X6 *= 2));
                            for (; W6 < X6;)
                                if (M6 = r[W6] * 131072 + (r[W6 + 1] >>> 11), M6 >= 9000000000000000) t = crypto.getRandomValues(new Uint32Array(2)), r[W6] = t[0], r[W6 + 1] = t[1];
                                else V6.push(M6 % 100000000000000), W6 += 2;
                            W6 = X6 / 2
                        } else if (crypto.randomBytes) {
                        r = crypto.randomBytes(X6 *= 7);
                        for (; W6 < X6;)
                            if (M6 = (r[W6] & 31) * 281474976710656 + r[W6 + 1] * 1099511627776 + r[W6 + 2] * 4294967296 + r[W6 + 3] * 16777216 + (r[W6 + 4] << 16) + (r[W6 + 5] << 8) + r[W6 + 6], M6 >= 9000000000000000) crypto.randomBytes(7).copy(r, W6);
                            else V6.push(M6 % 100000000000000), W6 += 7;
                        W6 = X6 / 7
                    } else throw g = !1, Error(A + "crypto unavailable");
                    if (!g) {
                        for (; W6 < X6;)
                            if (M6 = o(), M6 < 9000000000000000) V6[W6++] = M6 % 100000000000000
                    }
                    if (X6 = V6[--W6], _6 %= $, X6 && _6) M6 = H[$ - _6], V6[W6] = Y(X6 / M6) * M6;
                    for (; V6[W6] === 0; V6.pop(), W6--);
                    if (W6 < 0) V6 = [Y6 = 0];
                    else {
                        for (Y6 = -1; V6[0] === 0; V6.splice(0, 1), Y6 -= $);
                        for (W6 = 1, M6 = V6[0]; M6 >= 10; M6 /= 10, W6++);
                        if (W6 < $) Y6 -= $ - W6
                    }
                    return f6.e = Y6, f6.c = V6, f6
                }
            }(), e.sum = function() {
                var q6 = 1,
                    o = arguments,
                    _6 = new e(o[0]);
                for (; q6 < o.length;) _6 = _6.plus(o[q6++]);
                return _6
            }, N = function() {
                var q6 = "0123456789";

                function o(_6, r, t, Y6) {
                    var X6, M6 = [0],
                        W6, V6 = 0,
                        f6 = _6.length;
                    for (; V6 < f6;) {
                        for (W6 = M6.length; W6--; M6[W6] *= r);
                        M6[0] += Y6.indexOf(_6.charAt(V6++));
                        for (X6 = 0; X6 < M6.length; X6++)
                            if (M6[X6] > t - 1) {
                                if (M6[X6 + 1] == null) M6[X6 + 1] = 0;
                                M6[X6 + 1] += M6[X6] / t | 0, M6[X6] %= t
                            }
                    }
                    return M6.reverse()
                }
                return function(_6, r, t, Y6, X6) {
                    var M6, W6, V6, f6, G6, k6, T6, v6, L6 = _6.indexOf("."),
                        y6 = x,
                        c6 = B;
                    if (L6 >= 0) f6 = n, n = 0, _6 = _6.replace(".", ""), v6 = new e(r), k6 = v6.pow(_6.length - L6), n = f6, v6.c = o(v(W(k6.c), k6.e, "0"), 10, t, q6), v6.e = v6.c.length;
                    T6 = o(_6, r, t, X6 ? (M6 = z6, q6) : (M6 = q6, z6)), V6 = f6 = T6.length;
                    for (; T6[--f6] == 0; T6.pop());
                    if (!T6[0]) return M6.charAt(0);
                    if (L6 < 0) --V6;
                    else k6.c = T6, k6.e = V6, k6.s = Y6, k6 = k(k6, v6, y6, c6, t), T6 = k6.c, G6 = k6.r, V6 = k6.e;
                    if (W6 = V6 + y6 + 1, L6 = T6[W6], f6 = t / 2, G6 = G6 || W6 < 0 || T6[W6 + 1] != null, G6 = c6 < 4 ? (L6 != null || G6) && (c6 == 0 || c6 == (k6.s < 0 ? 3 : 2)) : L6 > f6 || L6 == f6 && (c6 == 4 || G6 || c6 == 6 && T6[W6 - 1] & 1 || c6 == (k6.s < 0 ? 8 : 7)), W6 < 1 || !T6[0]) _6 = G6 ? v(M6.charAt(1), -y6, M6.charAt(0)) : M6.charAt(0);
                    else {
                        if (T6.length = W6, G6) {
                            for (--t; ++T6[--W6] > t;)
                                if (T6[W6] = 0, !W6) ++V6, T6 = [1].concat(T6)
                        }
                        for (f6 = T6.length; !T6[--f6];);
                        for (L6 = 0, _6 = ""; L6 <= f6; _6 += M6.charAt(T6[L6++]));
                        _6 = v(_6, V6, M6.charAt(0))
                    }
                    return _6
                }
            }(), k = function() {
                function q6(r, t, Y6) {
                    var X6, M6, W6, V6, f6 = 0,
                        G6 = r.length,
                        k6 = t % J,
                        T6 = t / J | 0;
                    for (r = r.slice(); G6--;) W6 = r[G6] % J, V6 = r[G6] / J | 0, X6 = T6 * W6 + V6 * k6, M6 = k6 * W6 + X6 % J * J + f6, f6 = (M6 / Y6 | 0) + (X6 / J | 0) + T6 * V6, r[G6] = M6 % Y6;
                    if (f6) r = [f6].concat(r);
                    return r
                }

                function o(r, t, Y6, X6) {
                    var M6, W6;
                    if (Y6 != X6) W6 = Y6 > X6 ? 1 : -1;
                    else
                        for (M6 = W6 = 0; M6 < Y6; M6++)
                            if (r[M6] != t[M6]) {
                                W6 = r[M6] > t[M6] ? 1 : -1;
                                break
                            } return W6
                }

                function _6(r, t, Y6, X6) {
                    var M6 = 0;
                    for (; Y6--;) r[Y6] -= M6, M6 = r[Y6] < t[Y6] ? 1 : 0, r[Y6] = M6 * X6 + r[Y6] - t[Y6];
                    for (; !r[0] && r.length > 1; r.splice(0, 1));
                }
                return function(r, t, Y6, X6, M6) {
                    var W6, V6, f6, G6, k6, T6, v6, L6, y6, c6, Z8, N8, R6, p6, q8, L8, w8, x8 = r.s == t.s ? 1 : -1,
                        a6 = r.c,
                        D8 = t.c;
                    if (!a6 || !a6[0] || !D8 || !D8[0]) return new e(!r.s || !t.s || (a6 ? D8 && a6[0] == D8[0] : !D8) ? NaN : a6 && a6[0] == 0 || !D8 ? x8 * 0 : x8 / 0);
                    if (L6 = new e(x8), y6 = L6.c = [], V6 = r.e - t.e, x8 = Y6 + V6 + 1, !M6) M6 = w, V6 = P(r.e / $) - P(t.e / $), x8 = x8 / $ | 0;
                    for (f6 = 0; D8[f6] == (a6[f6] || 0); f6++);
                    if (D8[f6] > (a6[f6] || 0)) V6--;
                    if (x8 < 0) y6.push(1), G6 = !0;
                    else {
                        if (p6 = a6.length, L8 = D8.length, f6 = 0, x8 += 2, k6 = Y(M6 / (D8[0] + 1)), k6 > 1) D8 = q6(D8, k6, M6), a6 = q6(a6, k6, M6), L8 = D8.length, p6 = a6.length;
                        R6 = L8, c6 = a6.slice(0, L8), Z8 = c6.length;
                        for (; Z8 < L8; c6[Z8++] = 0);
                        if (w8 = D8.slice(), w8 = [0].concat(w8), q8 = D8[0], D8[1] >= M6 / 2) q8++;
                        do {
                            if (k6 = 0, W6 = o(D8, c6, L8, Z8), W6 < 0) {
                                if (N8 = c6[0], L8 != Z8) N8 = N8 * M6 + (c6[1] || 0);
                                if (k6 = Y(N8 / q8), k6 > 1) {
                                    if (k6 >= M6) k6 = M6 - 1;
                                    T6 = q6(D8, k6, M6), v6 = T6.length, Z8 = c6.length;
                                    while (o(T6, c6, v6, Z8) == 1) k6--, _6(T6, L8 < v6 ? w8 : D8, v6, M6), v6 = T6.length, W6 = 1
                                } else {
                                    if (k6 == 0) W6 = k6 = 1;
                                    T6 = D8.slice(), v6 = T6.length
                                }
                                if (v6 < Z8) T6 = [0].concat(T6);
                                if (_6(c6, T6, Z8, M6), Z8 = c6.length, W6 == -1)
                                    while (o(D8, c6, L8, Z8) < 1) k6++, _6(c6, L8 < Z8 ? w8 : D8, Z8, M6), Z8 = c6.length
                            } else if (W6 === 0) k6++, c6 = [0];
                            if (y6[f6++] = k6, c6[0]) c6[Z8++] = a6[R6] || 0;
                            else c6 = [a6[R6]], Z8 = 1
                        } while ((R6++ < p6 || c6[0] != null) && x8--);
                        if (G6 = c6[0] != null, !y6[0]) y6.splice(0, 1)
                    }
                    if (M6 == w) {
                        for (f6 = 1, x8 = y6[0]; x8 >= 10; x8 /= 10, f6++);
                        $6(L6, Y6 + (L6.e = f6 + V6 * $ - 1) + 1, X6, G6)
                    } else L6.e = V6, L6.r = +G6;
                    return L6
                }
            }();

            function i(q6, o, _6, r) {
                var t, Y6, X6, M6, W6;
                if (_6 == null) _6 = B;
                else Z(_6, 0, 8);
                if (!q6.c) return q6.toString();
                if (t = q6.c[0], X6 = q6.e, o == null) W6 = W(q6.c), W6 = r == 1 || r == 2 && (X6 <= m || X6 >= S) ? f(W6, X6) : v(W6, X6, "0");
                else if (q6 = $6(new e(q6), o, _6), Y6 = q6.e, W6 = W(q6.c), M6 = W6.length, r == 1 || r == 2 && (o <= Y6 || Y6 <= m)) {
                    for (; M6 < o; W6 += "0", M6++);
                    W6 = f(W6, Y6)
                } else if (o -= X6, W6 = v(W6, Y6, "0"), Y6 + 1 > M6) {
                    if (--o > 0)
                        for (W6 += "."; o--; W6 += "0");
                } else if (o += Y6 - M6, o > 0) {
                    if (Y6 + 1 == M6) W6 += ".";
                    for (; o--; W6 += "0");
                }
                return q6.s < 0 && t ? "-" + W6 : W6
            }

            function O6(q6, o) {
                var _6, r, t = 1,
                    Y6 = new e(q6[0]);
                for (; t < q6.length; t++)
                    if (r = new e(q6[t]), !r.s || (_6 = D(Y6, r)) === o || _6 === 0 && Y6.s === o) Y6 = r;
                return Y6
            }

            function J6(q6, o, _6) {
                var r = 1,
                    t = o.length;
                for (; !o[--t]; o.pop());
                for (t = o[0]; t >= 10; t /= 10, r++);
                if ((_6 = r + _6 * $ - 1) > U) q6.c = q6.e = null;
                else if (_6 < F) q6.c = [q6.e = 0];
                else q6.e = _6, q6.c = o;
                return q6
            }
            R = function() {
                var q6 = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
                    o = /^([^.]+)\.$/,
                    _6 = /^\.([^.]+)$/,
                    r = /^-?(Infinity|NaN)$/,
                    t = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
                return function(Y6, X6, M6, W6) {
                    var V6, f6 = M6 ? X6 : X6.replace(t, "");
                    if (r.test(f6)) Y6.s = isNaN(f6) ? null : f6 < 0 ? -1 : 1;
                    else {
                        if (!M6) {
                            if (f6 = f6.replace(q6, function(G6, k6, T6) {
                                    return V6 = (T6 = T6.toLowerCase()) == "x" ? 16 : T6 == "b" ? 2 : 8, !W6 || W6 == V6 ? k6 : G6
                                }), W6) V6 = W6, f6 = f6.replace(o, "$1").replace(_6, "0.$1");
                            if (X6 != f6) return new e(f6, V6)
                        }
                        if (e.DEBUG) throw Error(A + "Not a" + (W6 ? " base " + W6 : "") + " number: " + X6);
                        Y6.s = null
                    }
                    Y6.c = Y6.e = null
                }
            }();

            function $6(q6, o, _6, r) {
                var t, Y6, X6, M6, W6, V6, f6, G6 = q6.c,
                    k6 = H;
                if (G6) {
                    q: {
                        for (t = 1, M6 = G6[0]; M6 >= 10; M6 /= 10, t++);
                        if (Y6 = o - t, Y6 < 0) Y6 += $,
                        X6 = o,
                        W6 = G6[V6 = 0],
                        f6 = Y(W6 / k6[t - X6 - 1] % 10);
                        else if (V6 = z((Y6 + 1) / $), V6 >= G6.length)
                            if (r) {
                                for (; G6.length <= V6; G6.push(0));
                                W6 = f6 = 0, t = 1, Y6 %= $, X6 = Y6 - $ + 1
                            } else break q;
                        else {
                            W6 = M6 = G6[V6];
                            for (t = 1; M6 >= 10; M6 /= 10, t++);
                            Y6 %= $, X6 = Y6 - $ + t, f6 = X6 < 0 ? 0 : Y(W6 / k6[t - X6 - 1] % 10)
                        }
                        if (r = r || o < 0 || G6[V6 + 1] != null || (X6 < 0 ? W6 : W6 % k6[t - X6 - 1]), r = _6 < 4 ? (f6 || r) && (_6 == 0 || _6 == (q6.s < 0 ? 3 : 2)) : f6 > 5 || f6 == 5 && (_6 == 4 || r || _6 == 6 && (Y6 > 0 ? X6 > 0 ? W6 / k6[t - X6] : 0 : G6[V6 - 1]) % 10 & 1 || _6 == (q6.s < 0 ? 8 : 7)), o < 1 || !G6[0]) {
                            if (G6.length = 0, r) o -= q6.e + 1, G6[0] = k6[($ - o % $) % $], q6.e = -o || 0;
                            else G6[0] = q6.e = 0;
                            return q6
                        }
                        if (Y6 == 0) G6.length = V6,
                        M6 = 1,
                        V6--;
                        else G6.length = V6 + 1,
                        M6 = k6[$ - Y6],
                        G6[V6] = X6 > 0 ? Y(W6 / k6[t - X6] % k6[X6]) * M6 : 0;
                        if (r)
                            for (;;)
                                if (V6 == 0) {
                                    for (Y6 = 1, X6 = G6[0]; X6 >= 10; X6 /= 10, Y6++);
                                    X6 = G6[0] += M6;
                                    for (M6 = 1; X6 >= 10; X6 /= 10, M6++);
                                    if (Y6 != M6) {
                                        if (q6.e++, G6[0] == w) G6[0] = 1
                                    }
                                    break
                                } else {
                                    if (G6[V6] += M6, G6[V6] != w) break;
                                    G6[V6--] = 0, M6 = 1
                                } for (Y6 = G6.length; G6[--Y6] === 0; G6.pop());
                    }
                    if (q6.e > U) q6.c = q6.e = null;
                    else if (q6.e < F) q6.c = [q6.e = 0]
                }
                return q6
            }

            function H6(q6) {
                var o, _6 = q6.e;
                if (_6 === null) return q6.toString();
                return o = W(q6.c), o = _6 <= m || _6 >= S ? f(o, _6) : v(o, _6, "0"), q6.s < 0 ? "-" + o : o
            }
            if (h.absoluteValue = h.abs = function() {
                    var q6 = new e(this);
                    if (q6.s < 0) q6.s = 1;
                    return q6
                }, h.comparedTo = function(q6, o) {
                    return D(this, new e(q6, o))
                }, h.decimalPlaces = h.dp = function(q6, o) {
                    var _6, r, t, Y6 = this;
                    if (q6 != null) {
                        if (Z(q6, 0, X), o == null) o = B;
                        else Z(o, 0, 8);
                        return $6(new e(Y6), q6 + Y6.e + 1, o)
                    }
                    if (!(_6 = Y6.c)) return null;
                    if (r = ((t = _6.length - 1) - P(this.e / $)) * $, t = _6[t])
                        for (; t % 10 == 0; t /= 10, r--);
                    if (r < 0) r = 0;
                    return r
                }, h.dividedBy = h.div = function(q6, o) {
                    return k(this, new e(q6, o), x, B)
                }, h.dividedToIntegerBy = h.idiv = function(q6, o) {
                    return k(this, new e(q6, o), 0, 1)
                }, h.exponentiatedBy = h.pow = function(q6, o) {
                    var _6, r, t, Y6, X6, M6, W6, V6, f6, G6 = this;
                    if (q6 = new e(q6), q6.c && !q6.isInteger()) throw Error(A + "Exponent not an integer: " + H6(q6));
                    if (o != null) o = new e(o);
                    if (M6 = q6.e > 14, !G6.c || !G6.c[0] || G6.c[0] == 1 && !G6.e && G6.c.length == 1 || !q6.c || !q6.c[0]) return f6 = new e(Math.pow(+H6(G6), M6 ? q6.s * (2 - G(q6)) : +H6(q6))), o ? f6.mod(o) : f6;
                    if (W6 = q6.s < 0, o) {
                        if (o.c ? !o.c[0] : !o.s) return new e(NaN);
                        if (r = !W6 && G6.isInteger() && o.isInteger(), r) G6 = G6.mod(o)
                    } else if (q6.e > 9 && (G6.e > 0 || G6.e < -1 || (G6.e == 0 ? G6.c[0] > 1 || M6 && G6.c[1] >= 240000000 : G6.c[0] < 80000000000000 || M6 && G6.c[0] <= 99999750000000))) {
                        if (Y6 = G6.s < 0 && G(q6) ? -0 : 0, G6.e > -1) Y6 = 1 / Y6;
                        return new e(W6 ? 1 / Y6 : Y6)
                    } else if (n) Y6 = z(n / $ + 2);
                    if (M6) {
                        if (_6 = new e(0.5), W6) q6.s = 1;
                        V6 = G(q6)
                    } else t = Math.abs(+H6(q6)), V6 = t % 2;
                    f6 = new e(C);
                    for (;;) {
                        if (V6) {
                            if (f6 = f6.times(G6), !f6.c) break;
                            if (Y6) {
                                if (f6.c.length > Y6) f6.c.length = Y6
                            } else if (r) f6 = f6.mod(o)
                        }
                        if (t) {
                            if (t = Y(t / 2), t === 0) break;
                            V6 = t % 2
                        } else if (q6 = q6.times(_6), $6(q6, q6.e + 1, 1), q6.e > 14) V6 = G(q6);
                        else {
                            if (t = +H6(q6), t === 0) break;
                            V6 = t % 2
                        }
                        if (G6 = G6.times(G6), Y6) {
                            if (G6.c && G6.c.length > Y6) G6.c.length = Y6
                        } else if (r) G6 = G6.mod(o)
                    }
                    if (r) return f6;
                    if (W6) f6 = C.div(f6);
                    return o ? f6.mod(o) : Y6 ? $6(f6, n, B, X6) : f6
                }, h.integerValue = function(q6) {
                    var o = new e(this);
                    if (q6 == null) q6 = B;
                    else Z(q6, 0, 8);
                    return $6(o, o.e + 1, q6)
                }, h.isEqualTo = h.eq = function(q6, o) {
                    return D(this, new e(q6, o)) === 0
                }, h.isFinite = function() {
                    return !!this.c
                }, h.isGreaterThan = h.gt = function(q6, o) {
                    return D(this, new e(q6, o)) > 0
                }, h.isGreaterThanOrEqualTo = h.gte = function(q6, o) {
                    return (o = D(this, new e(q6, o))) === 1 || o === 0
                }, h.isInteger = function() {
                    return !!this.c && P(this.e / $) > this.c.length - 2
                }, h.isLessThan = h.lt = function(q6, o) {
                    return D(this, new e(q6, o)) < 0
                }, h.isLessThanOrEqualTo = h.lte = function(q6, o) {
                    return (o = D(this, new e(q6, o))) === -1 || o === 0
                }, h.isNaN = function() {
                    return !this.s
                }, h.isNegative = function() {
                    return this.s < 0
                }, h.isPositive = function() {
                    return this.s > 0
                }, h.isZero = function() {
                    return !!this.c && this.c[0] == 0
                }, h.minus = function(q6, o) {
                    var _6, r, t, Y6, X6 = this,
                        M6 = X6.s;
                    if (q6 = new e(q6, o), o = q6.s, !M6 || !o) return new e(NaN);
                    if (M6 != o) return q6.s = -o, X6.plus(q6);
                    var W6 = X6.e / $,
                        V6 = q6.e / $,
                        f6 = X6.c,
                        G6 = q6.c;
                    if (!W6 || !V6) {
                        if (!f6 || !G6) return f6 ? (q6.s = -o, q6) : new e(G6 ? X6 : NaN);
                        if (!f6[0] || !G6[0]) return G6[0] ? (q6.s = -o, q6) : new e(f6[0] ? X6 : B == 3 ? -0 : 0)
                    }
                    if (W6 = P(W6), V6 = P(V6), f6 = f6.slice(), M6 = W6 - V6) {
                        if (Y6 = M6 < 0) M6 = -M6, t = f6;
                        else V6 = W6, t = G6;
                        t.reverse();
                        for (o = M6; o--; t.push(0));
                        t.reverse()
                    } else {
                        r = (Y6 = (M6 = f6.length) < (o = G6.length)) ? M6 : o;
                        for (M6 = o = 0; o < r; o++)
                            if (f6[o] != G6[o]) {
                                Y6 = f6[o] < G6[o];
                                break
                            }
                    }
                    if (Y6) t = f6, f6 = G6, G6 = t, q6.s = -q6.s;
                    if (o = (r = G6.length) - (_6 = f6.length), o > 0)
                        for (; o--; f6[_6++] = 0);
                    o = w - 1;
                    for (; r > M6;) {
                        if (f6[--r] < G6[r]) {
                            for (_6 = r; _6 && !f6[--_6]; f6[_6] = o);
                            --f6[_6], f6[r] += w
                        }
                        f6[r] -= G6[r]
                    }
                    for (; f6[0] == 0; f6.splice(0, 1), --V6);
                    if (!f6[0]) return q6.s = B == 3 ? -1 : 1, q6.c = [q6.e = 0], q6;
                    return J6(q6, f6, V6)
                }, h.modulo = h.mod = function(q6, o) {
                    var _6, r, t = this;
                    if (q6 = new e(q6, o), !t.c || !q6.s || q6.c && !q6.c[0]) return new e(NaN);
                    else if (!q6.c || t.c && !t.c[0]) return new e(t);
                    if (c == 9) r = q6.s, q6.s = 1, _6 = k(t, q6, 0, 3), q6.s = r, _6.s *= r;
                    else _6 = k(t, q6, 0, c);
                    if (q6 = t.minus(_6.times(q6)), !q6.c[0] && c == 1) q6.s = t.s;
                    return q6
                }, h.multipliedBy = h.times = function(q6, o) {
                    var _6, r, t, Y6, X6, M6, W6, V6, f6, G6, k6, T6, v6, L6, y6, c6 = this,
                        Z8 = c6.c,
                        N8 = (q6 = new e(q6, o)).c;
                    if (!Z8 || !N8 || !Z8[0] || !N8[0]) {
                        if (!c6.s || !q6.s || Z8 && !Z8[0] && !N8 || N8 && !N8[0] && !Z8) q6.c = q6.e = q6.s = null;
                        else if (q6.s *= c6.s, !Z8 || !N8) q6.c = q6.e = null;
                        else q6.c = [0], q6.e = 0;
                        return q6
                    }
                    if (r = P(c6.e / $) + P(q6.e / $), q6.s *= c6.s, W6 = Z8.length, G6 = N8.length, W6 < G6) v6 = Z8, Z8 = N8, N8 = v6, t = W6, W6 = G6, G6 = t;
                    for (t = W6 + G6, v6 = []; t--; v6.push(0));
                    L6 = w, y6 = J;
                    for (t = G6; --t >= 0;) {
                        _6 = 0, k6 = N8[t] % y6, T6 = N8[t] / y6 | 0;
                        for (X6 = W6, Y6 = t + X6; Y6 > t;) V6 = Z8[--X6] % y6, f6 = Z8[X6] / y6 | 0, M6 = T6 * V6 + f6 * k6, V6 = k6 * V6 + M6 % y6 * y6 + v6[Y6] + _6, _6 = (V6 / L6 | 0) + (M6 / y6 | 0) + T6 * f6, v6[Y6--] = V6 % L6;
                        v6[Y6] = _6
                    }
                    if (_6) ++r;
                    else v6.splice(0, 1);
                    return J6(q6, v6, r)
                }, h.negated = function() {
                    var q6 = new e(this);
                    return q6.s = -q6.s || null, q6
                }, h.plus = function(q6, o) {
                    var _6, r = this,
                        t = r.s;
                    if (q6 = new e(q6, o), o = q6.s, !t || !o) return new e(NaN);
                    if (t != o) return q6.s = -o, r.minus(q6);
                    var Y6 = r.e / $,
                        X6 = q6.e / $,
                        M6 = r.c,
                        W6 = q6.c;
                    if (!Y6 || !X6) {
                        if (!M6 || !W6) return new e(t / 0);
                        if (!M6[0] || !W6[0]) return W6[0] ? q6 : new e(M6[0] ? r : t * 0)
                    }
                    if (Y6 = P(Y6), X6 = P(X6), M6 = M6.slice(), t = Y6 - X6) {
                        if (t > 0) X6 = Y6, _6 = W6;
                        else t = -t, _6 = M6;
                        _6.reverse();
                        for (; t--; _6.push(0));
                        _6.reverse()
                    }
                    if (t = M6.length, o = W6.length, t - o < 0) _6 = W6, W6 = M6, M6 = _6, o = t;
                    for (t = 0; o;) t = (M6[--o] = M6[o] + W6[o] + t) / w | 0, M6[o] = w === M6[o] ? 0 : M6[o] % w;
                    if (t) M6 = [t].concat(M6), ++X6;
                    return J6(q6, M6, X6)
                }, h.precision = h.sd = function(q6, o) {
                    var _6, r, t, Y6 = this;
                    if (q6 != null && q6 !== !!q6) {
                        if (Z(q6, 1, X), o == null) o = B;
                        else Z(o, 0, 8);
                        return $6(new e(Y6), q6, o)
                    }
                    if (!(_6 = Y6.c)) return null;
                    if (t = _6.length - 1, r = t * $ + 1, t = _6[t]) {
                        for (; t % 10 == 0; t /= 10, r--);
                        for (t = _6[0]; t >= 10; t /= 10, r++);
                    }
                    if (q6 && Y6.e + 1 > r) r = Y6.e + 1;
                    return r
                }, h.shiftedBy = function(q6) {
                    return Z(q6, -j, j), this.times("1e" + q6)
                }, h.squareRoot = h.sqrt = function() {
                    var q6, o, _6, r, t, Y6 = this,
                        X6 = Y6.c,
                        M6 = Y6.s,
                        W6 = Y6.e,
                        V6 = x + 4,
                        f6 = new e("0.5");
                    if (M6 !== 1 || !X6 || !X6[0]) return new e(!M6 || M6 < 0 && (!X6 || X6[0]) ? NaN : X6 ? Y6 : 1 / 0);
                    if (M6 = Math.sqrt(+H6(Y6)), M6 == 0 || M6 == 1 / 0) {
                        if (o = W(X6), (o.length + W6) % 2 == 0) o += "0";
                        if (M6 = Math.sqrt(+o), W6 = P((W6 + 1) / 2) - (W6 < 0 || W6 % 2), M6 == 1 / 0) o = "5e" + W6;
                        else o = M6.toExponential(), o = o.slice(0, o.indexOf("e") + 1) + W6;
                        _6 = new e(o)
                    } else _6 = new e(M6 + "");
                    if (_6.c[0]) {
                        if (W6 = _6.e, M6 = W6 + V6, M6 < 3) M6 = 0;
                        for (;;)
                            if (t = _6, _6 = f6.times(t.plus(k(Y6, t, V6, 1))), W(t.c).slice(0, M6) === (o = W(_6.c)).slice(0, M6)) {
                                if (_6.e < W6) --M6;
                                if (o = o.slice(M6 - 3, M6 + 1), o == "9999" || !r && o == "4999") {
                                    if (!r) {
                                        if ($6(t, t.e + x + 2, 0), t.times(t).eq(Y6)) {
                                            _6 = t;
                                            break
                                        }
                                    }
                                    V6 += 4, M6 += 4, r = 1
                                } else {
                                    if (!+o || !+o.slice(1) && o.charAt(0) == "5") $6(_6, _6.e + x + 2, 1), q6 = !_6.times(_6).eq(Y6);
                                    break
                                }
                            }
                    }
                    return $6(_6, _6.e + x + 1, B, q6)
                }, h.toExponential = function(q6, o) {
                    if (q6 != null) Z(q6, 0, X), q6++;
                    return i(this, q6, o, 1)
                }, h.toFixed = function(q6, o) {
                    if (q6 != null) Z(q6, 0, X), q6 = q6 + this.e + 1;
                    return i(this, q6, o)
                }, h.toFormat = function(q6, o, _6) {
                    var r, t = this;
                    if (_6 == null)
                        if (q6 != null && o && typeof o == "object") _6 = o, o = null;
                        else if (q6 && typeof q6 == "object") _6 = q6, q6 = o = null;
                    else _6 = l;
                    else if (typeof _6 != "object") throw Error(A + "Argument not an object: " + _6);
                    if (r = t.toFixed(q6, o), t.c) {
                        var Y6, X6 = r.split("."),
                            M6 = +_6.groupSize,
                            W6 = +_6.secondaryGroupSize,
                            V6 = _6.groupSeparator || "",
                            f6 = X6[0],
                            G6 = X6[1],
                            k6 = t.s < 0,
                            T6 = k6 ? f6.slice(1) : f6,
                            v6 = T6.length;
                        if (W6) Y6 = M6, M6 = W6, W6 = Y6, v6 -= Y6;
                        if (M6 > 0 && v6 > 0) {
                            Y6 = v6 % M6 || M6, f6 = T6.substr(0, Y6);
                            for (; Y6 < v6; Y6 += M6) f6 += V6 + T6.substr(Y6, M6);
                            if (W6 > 0) f6 += V6 + T6.slice(Y6);
                            if (k6) f6 = "-" + f6
                        }
                        r = G6 ? f6 + (_6.decimalSeparator || "") + ((W6 = +_6.fractionGroupSize) ? G6.replace(new RegExp("\\d{" + W6 + "}\\B", "g"), "$&" + (_6.fractionGroupSeparator || "")) : G6) : f6
                    }
                    return (_6.prefix || "") + r + (_6.suffix || "")
                }, h.toFraction = function(q6) {
                    var o, _6, r, t, Y6, X6, M6, W6, V6, f6, G6, k6, T6 = this,
                        v6 = T6.c;
                    if (q6 != null) {
                        if (M6 = new e(q6), !M6.isInteger() && (M6.c || M6.s !== 1) || M6.lt(C)) throw Error(A + "Argument " + (M6.isInteger() ? "out of range: " : "not an integer: ") + H6(M6))
                    }
                    if (!v6) return new e(T6);
                    o = new e(C), V6 = _6 = new e(C), r = W6 = new e(C), k6 = W(v6), Y6 = o.e = k6.length - T6.e - 1, o.c[0] = H[(X6 = Y6 % $) < 0 ? $ + X6 : X6], q6 = !q6 || M6.comparedTo(o) > 0 ? Y6 > 0 ? o : V6 : M6, X6 = U, U = 1 / 0, M6 = new e(k6), W6.c[0] = 0;
                    for (;;) {
                        if (f6 = k(M6, o, 0, 1), t = _6.plus(f6.times(r)), t.comparedTo(q6) == 1) break;
                        _6 = r, r = t, V6 = W6.plus(f6.times(t = V6)), W6 = t, o = M6.minus(f6.times(t = o)), M6 = t
                    }
                    return t = k(q6.minus(_6), r, 0, 1), W6 = W6.plus(t.times(V6)), _6 = _6.plus(t.times(r)), W6.s = V6.s = T6.s, Y6 = Y6 * 2, G6 = k(V6, r, Y6, B).minus(T6).abs().comparedTo(k(W6, _6, Y6, B).minus(T6).abs()) < 1 ? [V6, r] : [W6, _6], U = X6, G6
                }, h.toNumber = function() {
                    return +H6(this)
                }, h.toPrecision = function(q6, o) {
                    if (q6 != null) Z(q6, 1, X);
                    return i(this, q6, o, 2)
                }, h.toString = function(q6) {
                    var o, _6 = this,
                        r = _6.s,
                        t = _6.e;
                    if (t === null)
                        if (r) {
                            if (o = "Infinity", r < 0) o = "-" + o
                        } else o = "NaN";
                    else {
                        if (q6 == null) o = t <= m || t >= S ? f(W(_6.c), t) : v(W(_6.c), t, "0");
                        else if (q6 === 10 && A6) _6 = $6(new e(_6), x + t + 1, B), o = v(W(_6.c), _6.e, "0");
                        else Z(q6, 2, z6.length, "Base"), o = N(v(W(_6.c), t, "0"), 10, q6, r, !0);
                        if (r < 0 && _6.c[0]) o = "-" + o
                    }
                    return o
                }, h.valueOf = h.toJSON = function() {
                    return H6(this)
                }, h._isBigNumber = !0, V != null) e.set(V);
            return e
        }

        function P(V) {
            var k = V | 0;
            return V > 0 || V === k ? k : k - 1
        }

        function W(V) {
            var k, N, R = 1,
                h = V.length,
                C = V[0] + "";
            for (; R < h;) {
                k = V[R++] + "", N = $ - k.length;
                for (; N--; k = "0" + k);
                C += k
            }
            for (h = C.length; C.charCodeAt(--h) === 48;);
            return C.slice(0, h + 1 || 1)
        }

        function D(V, k) {
            var N, R, h = V.c,
                C = k.c,
                x = V.s,
                B = k.s,
                m = V.e,
                S = k.e;
            if (!x || !B) return null;
            if (N = h && !h[0], R = C && !C[0], N || R) return N ? R ? 0 : -B : x;
            if (x != B) return x;
            if (N = x < 0, R = m == S, !h || !C) return R ? 0 : !h ^ N ? 1 : -1;
            if (!R) return m > S ^ N ? 1 : -1;
            B = (m = h.length) < (S = C.length) ? m : S;
            for (x = 0; x < B; x++)
                if (h[x] != C[x]) return h[x] > C[x] ^ N ? 1 : -1;
            return m == S ? 0 : m > S ^ N ? 1 : -1
        }

        function Z(V, k, N, R) {
            if (V < k || V > N || V !== Y(V)) throw Error(A + (R || "Argument") + (typeof V == "number" ? V < k || V > N ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(V))
        }

        function G(V) {
            var k = V.c.length - 1;
            return P(V.e / $) == k && V.c[k] % 2 != 0
        }

        function f(V, k) {
            return (V.length > 1 ? V.charAt(0) + "." + V.slice(1) : V) + (k < 0 ? "e" : "e+") + k
        }

        function v(V, k, N) {
            var R, h;
            if (k < 0) {
                for (h = N + "."; ++k; h += N);
                V = h + V
            } else if (R = V.length, ++k > R) {
                for (h = N, k -= R; --k; h += N);
                V += h
            } else if (k < R) V = V.slice(0, k) + "." + V.slice(k);
            return V
        }
        if (K = M(), K.default = K.BigNumber = K, typeof define == "function" && define.amd) define(function() {
            return K
        });
        else if (typeof cT8 < "u" && cT8.exports) cT8.exports = K;
        else {
            if (!q) q = typeof self < "u" && self ? self : window;
            q.BigNumber = K
        }
    })(EBq)
})
// @from(Ln 150865, Col 4)
RBq = p((qgO, hBq) => {
    var yBq = oL1(),
        LBq = qgO;
    (function() {
        function q(j) {
            return j < 10 ? "0" + j : j
        }
        var K = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            _ = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            z, Y, A = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': "\\\"",
                "\\": "\\\\"
            },
            O;

        function w(j) {
            return _.lastIndex = 0, _.test(j) ? '"' + j.replace(_, function(H) {
                var J = A[H];
                return typeof J === "string" ? J : "\\u" + ("0000" + H.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + j + '"'
        }

        function $(j, H) {
            var J, X, M, P, W = z,
                D, Z = H[j],
                G = Z != null && (Z instanceof yBq || yBq.isBigNumber(Z));
            if (Z && typeof Z === "object" && typeof Z.toJSON === "function") Z = Z.toJSON(j);
            if (typeof O === "function") Z = O.call(H, j, Z);
            switch (typeof Z) {
                case "string":
                    if (G) return Z;
                    else return w(Z);
                case "number":
                    return isFinite(Z) ? String(Z) : "null";
                case "boolean":
                case "null":
                case "bigint":
                    return String(Z);
                case "object":
                    if (!Z) return "null";
                    if (z += Y, D = [], Object.prototype.toString.apply(Z) === "[object Array]") {
                        P = Z.length;
                        for (J = 0; J < P; J += 1) D[J] = $(J, Z) || "null";
                        return M = D.length === 0 ? "[]" : z ? `[
` + z + D.join(`,
` + z) + `
` + W + "]" : "[" + D.join(",") + "]", z = W, M
                    }
                    if (O && typeof O === "object") {
                        P = O.length;
                        for (J = 0; J < P; J += 1)
                            if (typeof O[J] === "string") {
                                if (X = O[J], M = $(X, Z), M) D.push(w(X) + (z ? ": " : ":") + M)
                            }
                    } else Object.keys(Z).forEach(function(f) {
                        var v = $(f, Z);
                        if (v) D.push(w(f) + (z ? ": " : ":") + v)
                    });
                    return M = D.length === 0 ? "{}" : z ? `{
` + z + D.join(`,
` + z) + `
` + W + "}" : "{" + D.join(",") + "}", z = W, M
            }
        }
        if (typeof LBq.stringify !== "function") LBq.stringify = function(j, H, J) {
            var X;
            if (z = "", Y = "", typeof J === "number")
                for (X = 0; X < J; X += 1) Y += " ";
            else if (typeof J === "string") Y = J;
            if (O = H, H && typeof H !== "function" && (typeof H !== "object" || typeof H.length !== "number")) throw Error("JSON.stringify");
            return $("", {
                "": j
            })
        }
    })()
})
// @from(Ln 150946, Col 4)
CBq = p((KgO, SBq) => {
    var lT8 = null,
        i__ = /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/,
        r__ = /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/,
        o__ = function(q) {
            var K = {
                strict: !1,
                storeAsString: !1,
                alwaysParseAsBig: !1,
                useNativeBigInt: !1,
                protoAction: "error",
                constructorAction: "error"
            };
            if (q !== void 0 && q !== null) {
                if (q.strict === !0) K.strict = !0;
                if (q.storeAsString === !0) K.storeAsString = !0;
                if (K.alwaysParseAsBig = q.alwaysParseAsBig === !0 ? q.alwaysParseAsBig : !1, K.useNativeBigInt = q.useNativeBigInt === !0 ? q.useNativeBigInt : !1, typeof q.constructorAction < "u")
                    if (q.constructorAction === "error" || q.constructorAction === "ignore" || q.constructorAction === "preserve") K.constructorAction = q.constructorAction;
                    else throw Error(`Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ${q.constructorAction}`);
                if (typeof q.protoAction < "u")
                    if (q.protoAction === "error" || q.protoAction === "ignore" || q.protoAction === "preserve") K.protoAction = q.protoAction;
                    else throw Error(`Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ${q.protoAction}`)
            }
            var _, z, Y = {
                    '"': '"',
                    "\\": "\\",
                    "/": "/",
                    b: "\b",
                    f: "\f",
                    n: `
`,
                    r: "\r",
                    t: "\t"
                },
                A, O = function(W) {
                    throw {
                        name: "SyntaxError",
                        message: W,
                        at: _,
                        text: A
                    }
                },
                w = function(W) {
                    if (W && W !== z) O("Expected '" + W + "' instead of '" + z + "'");
                    return z = A.charAt(_), _ += 1, z
                },
                $ = function() {
                    var W, D = "";
                    if (z === "-") D = "-", w("-");
                    while (z >= "0" && z <= "9") D += z, w();
                    if (z === ".") {
                        D += ".";
                        while (w() && z >= "0" && z <= "9") D += z
                    }
                    if (z === "e" || z === "E") {
                        if (D += z, w(), z === "-" || z === "+") D += z, w();
                        while (z >= "0" && z <= "9") D += z, w()
                    }
                    if (W = +D, !isFinite(W)) O("Bad number");
                    else {
                        if (lT8 == null) lT8 = oL1();
                        if (D.length > 15) return K.storeAsString ? D : K.useNativeBigInt ? BigInt(D) : new lT8(D);
                        else return !K.alwaysParseAsBig ? W : K.useNativeBigInt ? BigInt(W) : new lT8(W)
                    }
                },
                j = function() {
                    var W, D, Z = "",
                        G;
                    if (z === '"') {
                        var f = _;
                        while (w()) {
                            if (z === '"') {
                                if (_ - 1 > f) Z += A.substring(f, _ - 1);
                                return w(), Z
                            }
                            if (z === "\\") {
                                if (_ - 1 > f) Z += A.substring(f, _ - 1);
                                if (w(), z === "u") {
                                    G = 0;
                                    for (D = 0; D < 4; D += 1) {
                                        if (W = parseInt(w(), 16), !isFinite(W)) break;
                                        G = G * 16 + W
                                    }
                                    Z += String.fromCharCode(G)
                                } else if (typeof Y[z] === "string") Z += Y[z];
                                else break;
                                f = _
                            }
                        }
                    }
                    O("Bad string")
                },
                H = function() {
                    while (z && z <= " ") w()
                },
                J = function() {
                    switch (z) {
                        case "t":
                            return w("t"), w("r"), w("u"), w("e"), !0;
                        case "f":
                            return w("f"), w("a"), w("l"), w("s"), w("e"), !1;
                        case "n":
                            return w("n"), w("u"), w("l"), w("l"), null
                    }
                    O("Unexpected '" + z + "'")
                },
                X, M = function() {
                    var W = [];
                    if (z === "[") {
                        if (w("["), H(), z === "]") return w("]"), W;
                        while (z) {
                            if (W.push(X()), H(), z === "]") return w("]"), W;
                            w(","), H()
                        }
                    }
                    O("Bad array")
                },
                P = function() {
                    var W, D = Object.create(null);
                    if (z === "{") {
                        if (w("{"), H(), z === "}") return w("}"), D;
                        while (z) {
                            if (W = j(), H(), w(":"), K.strict === !0 && Object.hasOwnProperty.call(D, W)) O('Duplicate key "' + W + '"');
                            if (i__.test(W) === !0)
                                if (K.protoAction === "error") O("Object contains forbidden prototype property");
                                else if (K.protoAction === "ignore") X();
                            else D[W] = X();
                            else if (r__.test(W) === !0)
                                if (K.constructorAction === "error") O("Object contains forbidden constructor property");
                                else if (K.constructorAction === "ignore") X();
                            else D[W] = X();
                            else D[W] = X();
                            if (H(), z === "}") return w("}"), D;
                            w(","), H()
                        }
                    }
                    O("Bad object")
                };
            return X = function() {
                    switch (H(), z) {
                        case "{":
                            return P();
                        case "[":
                            return M();
                        case '"':
                            return j();
                        case "-":
                            return $();
                        default:
                            return z >= "0" && z <= "9" ? $() : J()
                    }
                },
                function(W, D) {
                    var Z;
                    if (A = W + "", _ = 0, z = " ", Z = X(), H(), z) O("Syntax error");
                    return typeof D === "function" ? function G(f, v) {
                        var V, k, N = f[v];
                        if (N && typeof N === "object") Object.keys(N).forEach(function(R) {
                            if (k = G(N, R), k !== void 0) N[R] = k;
                            else delete N[R]
                        });
                        return D.call(f, v, N)
                    }({
                        "": Z
                    }, "") : Z
                }
        };
    SBq.exports = o__
})
// @from(Ln 151115, Col 4)
xBq = p((_gO, nT8) => {
    var bBq = RBq().stringify,
        IBq = CBq();
    nT8.exports = function(q) {
        return {
            parse: IBq(q),
            stringify: bBq
        }
    };
    nT8.exports.parse = IBq();
    nT8.exports.stringify = bBq
})
// @from(Ln 151127, Col 4)
aL1 = p((UBq) => {
    Object.defineProperty(UBq, "__esModule", {
        value: !0
    });
    UBq.GCE_LINUX_BIOS_PATHS = void 0;
    UBq.isGoogleCloudServerless = BBq;
    UBq.isGoogleComputeEngineLinux = pBq;
    UBq.isGoogleComputeEngineMACAddress = FBq;
    UBq.isGoogleComputeEngine = gBq;
    UBq.detectGCPResidency = s__;
    var uBq = d6("fs"),
        mBq = d6("os");
    UBq.GCE_LINUX_BIOS_PATHS = {
        BIOS_DATE: "/sys/class/dmi/id/bios_date",
        BIOS_VENDOR: "/sys/class/dmi/id/bios_vendor"
    };
    var a__ = /^42:01/;

    function BBq() {
        return !!(process.env.CLOUD_RUN_JOB || process.env.FUNCTION_NAME || process.env.K_SERVICE)
    }

    function pBq() {
        if ((0, mBq.platform)() !== "linux") return !1;
        try {
            (0, uBq.statSync)(UBq.GCE_LINUX_BIOS_PATHS.BIOS_DATE);
            let q = (0, uBq.readFileSync)(UBq.GCE_LINUX_BIOS_PATHS.BIOS_VENDOR, "utf8");
            return /Google/.test(q)
        } catch (q) {
            return !1
        }
    }

    function FBq() {
        let q = (0, mBq.networkInterfaces)();
        for (let K of Object.values(q)) {
            if (!K) continue;
            for (let {
                    mac: _
                }
                of K)
                if (a__.test(_)) return !0
        }
        return !1
    }

    function gBq() {
        return pBq() || FBq()
    }

    function s__() {
        return BBq() || gBq()
    }
})
// @from(Ln 151181, Col 4)
cBq = p((QBq) => {
    Object.defineProperty(QBq, "__esModule", {
        value: !0
    });
    QBq.Colours = void 0;
    class s_ {
        static isEnabled(q) {
            return q.isTTY && (typeof q.getColorDepth === "function" ? q.getColorDepth() > 2 : !0)
        }
        static refresh() {
            if (s_.enabled = s_.isEnabled(process.stderr), !this.enabled) s_.reset = "", s_.bright = "", s_.dim = "", s_.red = "", s_.green = "", s_.yellow = "", s_.blue = "", s_.magenta = "", s_.cyan = "", s_.white = "", s_.grey = "";
            else s_.reset = "\x1B[0m", s_.bright = "\x1B[1m", s_.dim = "\x1B[2m", s_.red = "\x1B[31m", s_.green = "\x1B[32m", s_.yellow = "\x1B[33m", s_.blue = "\x1B[34m", s_.magenta = "\x1B[35m", s_.cyan = "\x1B[36m", s_.white = "\x1B[37m", s_.grey = "\x1B[90m"
        }
    }
    QBq.Colours = s_;
    s_.enabled = !1;
    s_.reset = "";
    s_.bright = "";
    s_.dim = "";
    s_.red = "";
    s_.green = "";
    s_.yellow = "";
    s_.blue = "";
    s_.magenta = "";
    s_.cyan = "";
    s_.white = "";
    s_.grey = "";
    s_.refresh()
})
// @from(Ln 151210, Col 4)
aBq = p((ew) => {
    var zz_ = ew && ew.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            var Y = Object.getOwnPropertyDescriptor(K, _);
            if (!Y || ("get" in Y ? !K.__esModule : Y.writable || Y.configurable)) Y = {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            };
            Object.defineProperty(q, z, Y)
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        Yz_ = ew && ew.__setModuleDefault || (Object.create ? function(q, K) {
            Object.defineProperty(q, "default", {
                enumerable: !0,
                value: K
            })
        } : function(q, K) {
            q.default = K
        }),
        lBq = ew && ew.__importStar || function(q) {
            if (q && q.__esModule) return q;
            var K = {};
            if (q != null) {
                for (var _ in q)
                    if (_ !== "default" && Object.prototype.hasOwnProperty.call(q, _)) zz_(K, q, _)
            }
            return Yz_(K, q), K
        };
    Object.defineProperty(ew, "__esModule", {
        value: !0
    });
    ew.env = ew.DebugLogBackendBase = ew.placeholder = ew.AdhocDebugLogger = ew.LogSeverity = void 0;
    ew.getNodeBackend = sL1;
    ew.getDebugBackend = Oz_;
    ew.getStructuredBackend = wz_;
    ew.setBackend = $z_;
    ew.log = oBq;
    var Az_ = d6("node:events"),
        qo6 = lBq(d6("node:process")),
        nBq = lBq(d6("node:util")),
        eh = cBq(),
        RB;
    (function(q) {
        q.DEFAULT = "DEFAULT", q.DEBUG = "DEBUG", q.INFO = "INFO", q.WARNING = "WARNING", q.ERROR = "ERROR"
    })(RB || (ew.LogSeverity = RB = {}));
    class rT8 extends Az_.EventEmitter {
        constructor(q, K) {
            super();
            this.namespace = q, this.upstream = K, this.func = Object.assign(this.invoke.bind(this), {
                instance: this,
                on: (_, z) => this.on(_, z)
            }), this.func.debug = (..._) => this.invokeSeverity(RB.DEBUG, ..._), this.func.info = (..._) => this.invokeSeverity(RB.INFO, ..._), this.func.warn = (..._) => this.invokeSeverity(RB.WARNING, ..._), this.func.error = (..._) => this.invokeSeverity(RB.ERROR, ..._), this.func.sublog = (_) => oBq(_, this.func)
        }
        invoke(q, ...K) {
            if (this.upstream) this.upstream(q, ...K);
            this.emit("log", q, K)
        }
        invokeSeverity(q, ...K) {
            this.invoke({
                severity: q
            }, ...K)
        }
    }
    ew.AdhocDebugLogger = rT8;
    ew.placeholder = new rT8("", () => {}).func;
    class Ko6 {
        constructor() {
            var q;
            this.cached = new Map, this.filters = [], this.filtersSet = !1;
            let K = (q = qo6.env[ew.env.nodeEnables]) !== null && q !== void 0 ? q : "*";
            if (K === "all") K = "*";
            this.filters = K.split(",")
        }
        log(q, K, ..._) {
            try {
                if (!this.filtersSet) this.setFilters(), this.filtersSet = !0;
                let z = this.cached.get(q);
                if (!z) z = this.makeLogger(q), this.cached.set(q, z);
                z(K, ..._)
            } catch (z) {
                console.error(z)
            }
        }
    }
    ew.DebugLogBackendBase = Ko6;
    class eL1 extends Ko6 {
        constructor() {
            super(...arguments);
            this.enabledRegexp = /.*/g
        }
        isEnabled(q) {
            return this.enabledRegexp.test(q)
        }
        makeLogger(q) {
            if (!this.enabledRegexp.test(q)) return () => {};
            return (K, ..._) => {
                var z;
                let Y = `${eh.Colours.green}${q}${eh.Colours.reset}`,
                    A = `${eh.Colours.yellow}${qo6.pid}${eh.Colours.reset}`,
                    O;
                switch (K.severity) {
                    case RB.ERROR:
                        O = `${eh.Colours.red}${K.severity}${eh.Colours.reset}`;
                        break;
                    case RB.INFO:
                        O = `${eh.Colours.magenta}${K.severity}${eh.Colours.reset}`;
                        break;
                    case RB.WARNING:
                        O = `${eh.Colours.yellow}${K.severity}${eh.Colours.reset}`;
                        break;
                    default:
                        O = (z = K.severity) !== null && z !== void 0 ? z : RB.DEFAULT;
                        break
                }
                let w = nBq.formatWithOptions({
                        colors: eh.Colours.enabled
                    }, ..._),
                    $ = Object.assign({}, K);
                delete $.severity;
                let j = Object.getOwnPropertyNames($).length ? JSON.stringify($) : "",
                    H = j ? `${eh.Colours.grey}${j}${eh.Colours.reset}` : "";
                console.error("%s [%s|%s] %s%s", A, Y, O, w, j ? ` ${H}` : "")
            }
        }
        setFilters() {
            let K = this.filters.join(",").replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^");
            this.enabledRegexp = new RegExp(`^${K}$`, "i")
        }
    }

    function sL1() {
        return new eL1
    }
    class iBq extends Ko6 {
        constructor(q) {
            super();
            this.debugPkg = q
        }
        makeLogger(q) {
            let K = this.debugPkg(q);
            return (_, ...z) => {
                K(z[0], ...z.slice(1))
            }
        }
        setFilters() {
            var q;
            let K = (q = qo6.env.NODE_DEBUG) !== null && q !== void 0 ? q : "";
            qo6.env.NODE_DEBUG = `${K}${K?",":""}${this.filters.join(",")}`
        }
    }

    function Oz_(q) {
        return new iBq(q)
    }
    class rBq extends Ko6 {
        constructor(q) {
            var K;
            super();
            this.upstream = (K = q) !== null && K !== void 0 ? K : new eL1
        }
        makeLogger(q) {
            let K = this.upstream.makeLogger(q);
            return (_, ...z) => {
                var Y;
                let A = (Y = _.severity) !== null && Y !== void 0 ? Y : RB.INFO,
                    O = Object.assign({
                        severity: A,
                        message: nBq.format(...z)
                    }, _),
                    w = JSON.stringify(O);
                K(_, w)
            }
        }
        setFilters() {
            this.upstream.setFilters()
        }
    }

    function wz_(q) {
        return new rBq(q)
    }
    ew.env = {
        nodeEnables: "GOOGLE_SDK_NODE_LOGGING"
    };
    var tL1 = new Map,
        YI = void 0;

    function $z_(q) {
        YI = q, tL1.clear()
    }

    function oBq(q, K) {
        if (!qo6.env[ew.env.nodeEnables]) return ew.placeholder;
        if (!q) return ew.placeholder;
        if (K) q = `${K.instance.namespace}:${q}`;
        let z = tL1.get(q);
        if (z) return z.func;
        if (YI === null) return ew.placeholder;
        else if (YI === void 0) YI = sL1();
        let Y = (() => {
            let A = void 0;
            return new rT8(q, (w, ...$) => {
                if (A !== YI) {
                    if (YI === null) return;
                    else if (YI === void 0) YI = sL1();
                    A = YI
                }
                YI === null || YI === void 0 || YI.log(q, w, ...$)
            })
        })();
        return tL1.set(q, Y), Y.func
    }
})
// @from(Ln 151427, Col 4)
sBq = p((E26) => {
    var jz_ = E26 && E26.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            var Y = Object.getOwnPropertyDescriptor(K, _);
            if (!Y || ("get" in Y ? !K.__esModule : Y.writable || Y.configurable)) Y = {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            };
            Object.defineProperty(q, z, Y)
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        Hz_ = E26 && E26.__exportStar || function(q, K) {
            for (var _ in q)
                if (_ !== "default" && !Object.prototype.hasOwnProperty.call(K, _)) jz_(K, q, _)
        };
    Object.defineProperty(E26, "__esModule", {
        value: !0
    });
    Hz_(aBq(), E26)
})
// @from(Ln 151451, Col 4)
zo6 = p((I3) => {
    var Jz_ = I3 && I3.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            var Y = Object.getOwnPropertyDescriptor(K, _);
            if (!Y || ("get" in Y ? !K.__esModule : Y.writable || Y.configurable)) Y = {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            };
            Object.defineProperty(q, z, Y)
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        Xz_ = I3 && I3.__exportStar || function(q, K) {
            for (var _ in q)
                if (_ !== "default" && !Object.prototype.hasOwnProperty.call(K, _)) Jz_(K, q, _)
        };
    Object.defineProperty(I3, "__esModule", {
        value: !0
    });
    I3.gcpResidencyCache = I3.METADATA_SERVER_DETECTION = I3.HEADERS = I3.HEADER_VALUE = I3.HEADER_NAME = I3.SECONDARY_HOST_ADDRESS = I3.HOST_ADDRESS = I3.BASE_PATH = void 0;
    I3.instance = fz_;
    I3.project = Gz_;
    I3.universe = vz_;
    I3.bulk = Tz_;
    I3.isAvailable = kz_;
    I3.resetIsAvailableCache = Nz_;
    I3.getGCPResidency = _h1;
    I3.setGCPResidency = eBq;
    I3.requestTimeout = qpq;
    var qh1 = hB(),
        Mz_ = xBq(),
        Pz_ = aL1(),
        Wz_ = sBq();
    I3.BASE_PATH = "/computeMetadata/v1";
    I3.HOST_ADDRESS = "http://169.254.169.254";
    I3.SECONDARY_HOST_ADDRESS = "http://metadata.google.internal.";
    I3.HEADER_NAME = "Metadata-Flavor";
    I3.HEADER_VALUE = "Google";
    I3.HEADERS = Object.freeze({
        [I3.HEADER_NAME]: I3.HEADER_VALUE
    });
    var tBq = Wz_.log("gcp metadata");
    I3.METADATA_SERVER_DETECTION = Object.freeze({
        "assume-present": "don't try to ping the metadata server, but assume it's present",
        none: "don't try to ping the metadata server, but don't try to use it either",
        "bios-only": "treat the result of a BIOS probe as canonical (don't fall back to pinging)",
        "ping-only": "skip the BIOS probe, and go straight to pinging"
    });

    function Kh1(q) {
        if (!q) q = process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST || I3.HOST_ADDRESS;
        if (!/^https?:\/\//.test(q)) q = `http://${q}`;
        return new URL(I3.BASE_PATH, q).href
    }

    function Dz_(q) {
        Object.keys(q).forEach((K) => {
            switch (K) {
                case "params":
                case "property":
                case "headers":
                    break;
                case "qs":
                    throw Error("'qs' is not a valid configuration option. Please use 'params' instead.");
                default:
                    throw Error(`'${K}' is not a valid configuration option.`)
            }
        })
    }
    async function _o6(q, K = {}, _ = 3, z = !1) {
        let Y = "",
            A = {},
            O = {};
        if (typeof q === "object") {
            let H = q;
            Y = H.metadataKey, A = H.params || A, O = H.headers || O, _ = H.noResponseRetries || _, z = H.fastFail || z
        } else Y = q;
        if (typeof K === "string") Y += `/${K}`;
        else {
            if (Dz_(K), K.property) Y += `/${K.property}`;
            O = K.headers || O, A = K.params || A
        }
        let w = z ? Zz_ : qh1.request,
            $ = {
                url: `${Kh1()}/${Y}`,
                headers: {
                    ...I3.HEADERS,
                    ...O
                },
                retryConfig: {
                    noResponseRetries: _
                },
                params: A,
                responseType: "text",
                timeout: qpq()
            };
        tBq.info("instance request %j", $);
        let j = await w($);
        if (tBq.info("instance metadata is %s", j.data), j.headers[I3.HEADER_NAME.toLowerCase()] !== I3.HEADER_VALUE) throw Error(`Invalid response from metadata service: incorrect ${I3.HEADER_NAME} header. Expected '${I3.HEADER_VALUE}', got ${j.headers[I3.HEADER_NAME.toLowerCase()]?`'${j.headers[I3.HEADER_NAME.toLowerCase()]}'`:"no header"}`);
        if (typeof j.data === "string") try {
            return Mz_.parse(j.data)
        } catch (H) {}
        return j.data
    }
    async function Zz_(q) {
        var K;
        let _ = {
                ...q,
                url: (K = q.url) === null || K === void 0 ? void 0 : K.toString().replace(Kh1(), Kh1(I3.SECONDARY_HOST_ADDRESS))
            },
            z = !1,
            Y = (0, qh1.request)(q).then((O) => {
                return z = !0, O
            }).catch((O) => {
                if (z) return A;
                else throw z = !0, O
            }),
            A = (0, qh1.request)(_).then((O) => {
                return z = !0, O
            }).catch((O) => {
                if (z) return Y;
                else throw z = !0, O
            });
        return Promise.race([Y, A])
    }

    function fz_(q) {
        return _o6("instance", q)
    }

    function Gz_(q) {
        return _o6("project", q)
    }

    function vz_(q) {
        return _o6("universe", q)
    }
    async function Tz_(q) {
        let K = {};
        return await Promise.all(q.map((_) => {
            return (async () => {
                let z = await _o6(_),
                    Y = _.metadataKey;
                K[Y] = z
            })()
        })), K
    }

    function Vz_() {
        return process.env.DETECT_GCP_RETRIES ? Number(process.env.DETECT_GCP_RETRIES) : 0
    }
    var oT8;
    async function kz_() {
        if (process.env.METADATA_SERVER_DETECTION) {
            let q = process.env.METADATA_SERVER_DETECTION.trim().toLocaleLowerCase();
            if (!(q in I3.METADATA_SERVER_DETECTION)) throw RangeError(`Unknown \`METADATA_SERVER_DETECTION\` env variable. Got \`${q}\`, but it should be \`${Object.keys(I3.METADATA_SERVER_DETECTION).join("`, `")}\`, or unset`);
            switch (q) {
                case "assume-present":
                    return !0;
                case "none":
                    return !1;
                case "bios-only":
                    return _h1();
                case "ping-only":
            }
        }
        try {
            if (oT8 === void 0) oT8 = _o6("instance", void 0, Vz_(), !(process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST));
            return await oT8, !0
        } catch (q) {
            let K = q;
            if (process.env.DEBUG_AUTH) console.info(K);
            if (K.type === "request-timeout") return !1;
            if (K.response && K.response.status === 404) return !1;
            else {
                if (!(K.response && K.response.status === 404) && (!K.code || !["EHOSTDOWN", "EHOSTUNREACH", "ENETUNREACH", "ENOENT", "ENOTFOUND", "ECONNREFUSED"].includes(K.code))) {
                    let _ = "UNKNOWN";
                    if (K.code) _ = K.code;
                    process.emitWarning(`received unexpected error = ${K.message} code = ${_}`, "MetadataLookupWarning")
                }
                return !1
            }
        }
    }

    function Nz_() {
        oT8 = void 0
    }
    I3.gcpResidencyCache = null;

    function _h1() {
        if (I3.gcpResidencyCache === null) eBq();
        return I3.gcpResidencyCache
    }

    function eBq(q = null) {
        I3.gcpResidencyCache = q !== null ? q : (0, Pz_.detectGCPResidency)()
    }

    function qpq() {
        return _h1() ? 0 : 3000
    }
    Xz_(aL1(), I3)
})
// @from(Ln 151658, Col 4)
Ah1 = p((bz_) => {
    bz_.byteLength = yz_;
    bz_.toByteArray = hz_;
    bz_.fromByteArray = Cz_;
    var rQ = [],
        AI = [],
        Ez_ = typeof Uint8Array < "u" ? Uint8Array : Array,
        zh1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (nq6 = 0, Yh1 = zh1.length; nq6 < Yh1; ++nq6) rQ[nq6] = zh1[nq6], AI[zh1.charCodeAt(nq6)] = nq6;
    var nq6, Yh1;
    AI[45] = 62;
    AI[95] = 63;

    function Kpq(q) {
        var K = q.length;
        if (K % 4 > 0) throw Error("Invalid string. Length must be a multiple of 4");
        var _ = q.indexOf("=");
        if (_ === -1) _ = K;
        var z = _ === K ? 0 : 4 - _ % 4;
        return [_, z]
    }

    function yz_(q) {
        var K = Kpq(q),
            _ = K[0],
            z = K[1];
        return (_ + z) * 3 / 4 - z
    }

    function Lz_(q, K, _) {
        return (K + _) * 3 / 4 - _
    }

    function hz_(q) {
        var K, _ = Kpq(q),
            z = _[0],
            Y = _[1],
            A = new Ez_(Lz_(q, z, Y)),
            O = 0,
            w = Y > 0 ? z - 4 : z,
            $;
        for ($ = 0; $ < w; $ += 4) K = AI[q.charCodeAt($)] << 18 | AI[q.charCodeAt($ + 1)] << 12 | AI[q.charCodeAt($ + 2)] << 6 | AI[q.charCodeAt($ + 3)], A[O++] = K >> 16 & 255, A[O++] = K >> 8 & 255, A[O++] = K & 255;
        if (Y === 2) K = AI[q.charCodeAt($)] << 2 | AI[q.charCodeAt($ + 1)] >> 4, A[O++] = K & 255;
        if (Y === 1) K = AI[q.charCodeAt($)] << 10 | AI[q.charCodeAt($ + 1)] << 4 | AI[q.charCodeAt($ + 2)] >> 2, A[O++] = K >> 8 & 255, A[O++] = K & 255;
        return A
    }

    function Rz_(q) {
        return rQ[q >> 18 & 63] + rQ[q >> 12 & 63] + rQ[q >> 6 & 63] + rQ[q & 63]
    }

    function Sz_(q, K, _) {
        var z, Y = [];
        for (var A = K; A < _; A += 3) z = (q[A] << 16 & 16711680) + (q[A + 1] << 8 & 65280) + (q[A + 2] & 255), Y.push(Rz_(z));
        return Y.join("")
    }

    function Cz_(q) {
        var K, _ = q.length,
            z = _ % 3,
            Y = [],
            A = 16383;
        for (var O = 0, w = _ - z; O < w; O += A) Y.push(Sz_(q, O, O + A > w ? w : O + A));
        if (z === 1) K = q[_ - 1], Y.push(rQ[K >> 2] + rQ[K << 4 & 63] + "==");
        else if (z === 2) K = (q[_ - 2] << 8) + q[_ - 1], Y.push(rQ[K >> 10] + rQ[K >> 4 & 63] + rQ[K << 2 & 63] + "=");
        return Y.join("")
    }
})
// @from(Ln 151726, Col 4)
Ypq = p((_pq) => {
    Object.defineProperty(_pq, "__esModule", {
        value: !0
    });
    _pq.BrowserCrypto = void 0;
    var tV6 = Ah1(),
        mz_ = eV6();
    class aT8 {
        constructor() {
            if (typeof window > "u" || window.crypto === void 0 || window.crypto.subtle === void 0) throw Error("SubtleCrypto not found. Make sure it's an https:// website.")
        }
        async sha256DigestBase64(q) {
            let K = new TextEncoder().encode(q),
                _ = await window.crypto.subtle.digest("SHA-256", K);
            return tV6.fromByteArray(new Uint8Array(_))
        }
        randomBytesBase64(q) {
            let K = new Uint8Array(q);
            return window.crypto.getRandomValues(K), tV6.fromByteArray(K)
        }
        static padBase64(q) {
            while (q.length % 4 !== 0) q += "=";
            return q
        }
        async verify(q, K, _) {
            let z = {
                    name: "RSASSA-PKCS1-v1_5",
                    hash: {
                        name: "SHA-256"
                    }
                },
                Y = new TextEncoder().encode(K),
                A = tV6.toByteArray(aT8.padBase64(_)),
                O = await window.crypto.subtle.importKey("jwk", q, z, !0, ["verify"]);
            return await window.crypto.subtle.verify(z, O, A, Y)
        }
        async sign(q, K) {
            let _ = {
                    name: "RSASSA-PKCS1-v1_5",
                    hash: {
                        name: "SHA-256"
                    }
                },
                z = new TextEncoder().encode(K),
                Y = await window.crypto.subtle.importKey("jwk", q, _, !0, ["sign"]),
                A = await window.crypto.subtle.sign(_, Y, z);
            return tV6.fromByteArray(new Uint8Array(A))
        }
        decodeBase64StringUtf8(q) {
            let K = tV6.toByteArray(aT8.padBase64(q));
            return new TextDecoder().decode(K)
        }
        encodeBase64StringUtf8(q) {
            let K = new TextEncoder().encode(q);
            return tV6.fromByteArray(K)
        }
        async sha256DigestHex(q) {
            let K = new TextEncoder().encode(q),
                _ = await window.crypto.subtle.digest("SHA-256", K);
            return (0, mz_.fromArrayBufferToHex)(_)
        }
        async signWithHmacSha256(q, K) {
            let _ = typeof q === "string" ? q : String.fromCharCode(...new Uint16Array(q)),
                z = new TextEncoder,
                Y = await window.crypto.subtle.importKey("raw", z.encode(_), {
                    name: "HMAC",
                    hash: {
                        name: "SHA-256"
                    }
                }, !1, ["sign"]);
            return window.crypto.subtle.sign("HMAC", Y, z.encode(K))
        }
    }
    _pq.BrowserCrypto = aT8
})
// @from(Ln 151801, Col 4)
$pq = p((Opq) => {
    Object.defineProperty(Opq, "__esModule", {
        value: !0
    });
    Opq.NodeCrypto = void 0;
    var qk6 = d6("crypto");
    class Apq {
        async sha256DigestBase64(q) {
            return qk6.createHash("sha256").update(q).digest("base64")
        }
        randomBytesBase64(q) {
            return qk6.randomBytes(q).toString("base64")
        }
        async verify(q, K, _) {
            let z = qk6.createVerify("RSA-SHA256");
            return z.update(K), z.end(), z.verify(q, _, "base64")
        }
        async sign(q, K) {
            let _ = qk6.createSign("RSA-SHA256");
            return _.update(K), _.end(), _.sign(q, "base64")
        }
        decodeBase64StringUtf8(q) {
            return Buffer.from(q, "base64").toString("utf-8")
        }
        encodeBase64StringUtf8(q) {
            return Buffer.from(q, "utf-8").toString("base64")
        }
        async sha256DigestHex(q) {
            return qk6.createHash("sha256").update(q).digest("hex")
        }
        async signWithHmacSha256(q, K) {
            let _ = typeof q === "string" ? q : pz_(q);
            return Bz_(qk6.createHmac("sha256", _).update(K).digest())
        }
    }
    Opq.NodeCrypto = Apq;

    function Bz_(q) {
        return q.buffer.slice(q.byteOffset, q.byteOffset + q.byteLength)
    }

    function pz_(q) {
        return Buffer.from(q)
    }
})
// @from(Ln 151846, Col 4)
eV6 = p((Hpq) => {
    Object.defineProperty(Hpq, "__esModule", {
        value: !0
    });
    Hpq.createCrypto = Uz_;
    Hpq.hasBrowserCrypto = jpq;
    Hpq.fromArrayBufferToHex = Qz_;
    var Fz_ = Ypq(),
        gz_ = $pq();

    function Uz_() {
        if (jpq()) return new Fz_.BrowserCrypto;
        return new gz_.NodeCrypto
    }

    function jpq() {
        return typeof window < "u" && typeof window.crypto < "u" && typeof window.crypto.subtle < "u"
    }

    function Qz_(q) {
        return Array.from(new Uint8Array(q)).map((_) => {
            return _.toString(16).padStart(2, "0")
        }).join("")
    }
})
// @from(Ln 151871, Col 4)
Xpq = p((Jpq) => {
    Object.defineProperty(Jpq, "__esModule", {
        value: !0
    });
    Jpq.validate = nz_;

    function nz_(q) {
        let K = [{
            invalid: "uri",
            expected: "url"
        }, {
            invalid: "json",
            expected: "data"
        }, {
            invalid: "qs",
            expected: "params"
        }];
        for (let _ of K)
            if (q[_.invalid]) {
                let z = `'${_.invalid}' is not a valid configuration option. Please use '${_.expected}' instead. This library is using Axios for requests. Please see https://github.com/axios/axios to learn more about the valid request options.`;
                throw Error(z)
            }
    }
})
// @from(Ln 151895, Col 4)
Oh1 = p((MgO, rz_) => {
    rz_.exports = {
        name: "google-auth-library",
        version: "9.15.1",
        author: "Google Inc.",
        description: "Google APIs Authentication Client Library for Node.js",
        engines: {
            node: ">=14"
        },
        main: "./build/src/index.js",
        types: "./build/src/index.d.ts",
        repository: "googleapis/google-auth-library-nodejs.git",
        keywords: ["google", "api", "google apis", "client", "client library"],
        dependencies: {
            "base64-js": "^1.3.0",
            "ecdsa-sig-formatter": "^1.0.11",
            gaxios: "^6.1.1",
            "gcp-metadata": "^6.1.0",
            gtoken: "^7.0.0",
            jws: "^4.0.0"
        },
        devDependencies: {
            "@types/base64-js": "^1.2.5",
            "@types/chai": "^4.1.7",
            "@types/jws": "^3.1.0",
            "@types/mocha": "^9.0.0",
            "@types/mv": "^2.1.0",
            "@types/ncp": "^2.0.1",
            "@types/node": "^20.4.2",
            "@types/sinon": "^17.0.0",
            "assert-rejects": "^1.0.0",
            c8: "^8.0.0",
            chai: "^4.2.0",
            cheerio: "1.0.0-rc.12",
            codecov: "^3.0.2",
            "engine.io": "6.6.2",
            gts: "^5.0.0",
            "is-docker": "^2.0.0",
            jsdoc: "^4.0.0",
            "jsdoc-fresh": "^3.0.0",
            "jsdoc-region-tag": "^3.0.0",
            karma: "^6.0.0",
            "karma-chrome-launcher": "^3.0.0",
            "karma-coverage": "^2.0.0",
            "karma-firefox-launcher": "^2.0.0",
            "karma-mocha": "^2.0.0",
            "karma-sourcemap-loader": "^0.4.0",
            "karma-webpack": "5.0.0",
            keypair: "^1.0.4",
            linkinator: "^4.0.0",
            mocha: "^9.2.2",
            mv: "^2.1.1",
            ncp: "^2.0.0",
            nock: "^13.0.0",
            "null-loader": "^4.0.0",
            pdfmake: "0.2.12",
            puppeteer: "^21.0.0",
            sinon: "^18.0.0",
            "ts-loader": "^8.0.0",
            typescript: "^5.1.6",
            webpack: "^5.21.2",
            "webpack-cli": "^4.0.0"
        },
        files: ["build/src", "!build/src/**/*.map"],
        scripts: {
            test: "c8 mocha build/test",
            clean: "gts clean",
            prepare: "npm run compile",
            lint: "gts check",
            compile: "tsc -p .",
            fix: "gts fix",
            pretest: "npm run compile -- --sourceMap",
            docs: "jsdoc -c .jsdoc.json",
            "samples-setup": "cd samples/ && npm link ../ && npm run setup && cd ../",
            "samples-test": "cd samples/ && npm link ../ && npm test && cd ../",
            "system-test": "mocha build/system-test --timeout 60000",
            "presystem-test": "npm run compile -- --sourceMap",
            webpack: "webpack",
            "browser-test": "karma start",
            "docs-test": "linkinator docs",
            "predocs-test": "npm run docs",
            prelint: "cd samples; npm link ../; npm install",
            precompile: "gts clean"
        },
        license: "Apache-2.0"
    }
})
// @from(Ln 151982, Col 4)
Ao6 = p((Ppq) => {
    Object.defineProperty(Ppq, "__esModule", {
        value: !0
    });
    Ppq.DefaultTransporter = void 0;
    var oz_ = hB(),
        az_ = Xpq(),
        sz_ = Oh1(),
        Mpq = "google-api-nodejs-client";
    class Yo6 {
        constructor() {
            this.instance = new oz_.Gaxios
        }
        configure(q = {}) {
            if (q.headers = q.headers || {}, typeof window > "u") {
                let K = q.headers["User-Agent"];
                if (!K) q.headers["User-Agent"] = Yo6.USER_AGENT;
                else if (!K.includes(`${Mpq}/`)) q.headers["User-Agent"] = `${K} ${Yo6.USER_AGENT}`;
                if (!q.headers["x-goog-api-client"]) {
                    let _ = process.version.replace(/^v/, "");
                    q.headers["x-goog-api-client"] = `gl-node/${_}`
                }
            }
            return q
        }
        request(q) {
            return q = this.configure(q), (0, az_.validate)(q), this.instance.request(q).catch((K) => {
                throw this.processError(K)
            })
        }
        get defaults() {
            return this.instance.defaults
        }
        set defaults(q) {
            this.instance.defaults = q
        }
        processError(q) {
            let K = q.response,
                _ = q,
                z = K ? K.data : null;
            if (K && z && z.error && K.status !== 200)
                if (typeof z.error === "string") _.message = z.error, _.status = K.status;
                else if (Array.isArray(z.error.errors)) _.message = z.error.errors.map((Y) => Y.message).join(`
`), _.code = z.error.code, _.errors = z.error.errors;
            else _.message = z.error.message, _.code = z.error.code;
            else if (K && K.status >= 400) _.message = z, _.status = K.status;
            return _
        }
    }
    Ppq.DefaultTransporter = Yo6;
    Yo6.USER_AGENT = `${Mpq}/${sz_.version}`
})
// @from(Ln 152034, Col 4)
rq6 = p((iq6) => {
    var SB = iq6 && iq6.__classPrivateFieldGet || function(q, K, _, z) {
            if (_ === "a" && !z) throw TypeError("Private accessor was defined without a getter");
            if (typeof K === "function" ? q !== K || !z : !K.has(q)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return _ === "m" ? z : _ === "a" ? z.call(q) : z ? z.value : K.get(q)
        },
        Kk6, _a, wh1, $h1;
    Object.defineProperty(iq6, "__esModule", {
        value: !0
    });
    iq6.LRUCache = void 0;
    iq6.snakeToCamel = Dpq;
    iq6.originalOrCamelOptions = tz_;

    function Dpq(q) {
        return q.replace(/([_][^_])/g, (K) => K.slice(1).toUpperCase())
    }

    function tz_(q) {
        function K(_) {
            var z;
            let Y = q || {};
            return (z = Y[_]) !== null && z !== void 0 ? z : Y[Dpq(_)]
        }
        return {
            get: K
        }
    }
    class Zpq {
        constructor(q) {
            Kk6.add(this), _a.set(this, new Map), this.capacity = q.capacity, this.maxAge = q.maxAge
        }
        set(q, K) {
            SB(this, Kk6, "m", wh1).call(this, q, K), SB(this, Kk6, "m", $h1).call(this)
        }
        get(q) {
            let K = SB(this, _a, "f").get(q);
            if (!K) return;
            return SB(this, Kk6, "m", wh1).call(this, q, K.value), SB(this, Kk6, "m", $h1).call(this), K.value
        }
    }
    iq6.LRUCache = Zpq;
    _a = new WeakMap, Kk6 = new WeakSet, wh1 = function(K, _) {
        SB(this, _a, "f").delete(K), SB(this, _a, "f").set(K, {
            value: _,
            lastAccessed: Date.now()
        })
    }, $h1 = function() {
        let K = this.maxAge ? Date.now() - this.maxAge : 0,
            _ = SB(this, _a, "f").entries().next();
        while (!_.done && (SB(this, _a, "f").size > this.capacity || _.value[1].lastAccessed < K)) SB(this, _a, "f").delete(_.value[0]), _ = SB(this, _a, "f").entries().next()
    }
})
// @from(Ln 152087, Col 4)
oQ = p((Tpq) => {
    Object.defineProperty(Tpq, "__esModule", {
        value: !0
    });
    Tpq.AuthClient = Tpq.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = Tpq.DEFAULT_UNIVERSE = void 0;
    var ez_ = d6("events"),
        fpq = hB(),
        Gpq = Ao6(),
        qY_ = rq6();
    Tpq.DEFAULT_UNIVERSE = "googleapis.com";
    Tpq.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = 300000;
    class vpq extends ez_.EventEmitter {
        constructor(q = {}) {
            var K, _, z, Y, A;
            super();
            this.credentials = {}, this.eagerRefreshThresholdMillis = Tpq.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS, this.forceRefreshOnFailure = !1, this.universeDomain = Tpq.DEFAULT_UNIVERSE;
            let O = (0, qY_.originalOrCamelOptions)(q);
            if (this.apiKey = q.apiKey, this.projectId = (K = O.get("project_id")) !== null && K !== void 0 ? K : null, this.quotaProjectId = O.get("quota_project_id"), this.credentials = (_ = O.get("credentials")) !== null && _ !== void 0 ? _ : {}, this.universeDomain = (z = O.get("universe_domain")) !== null && z !== void 0 ? z : Tpq.DEFAULT_UNIVERSE, this.transporter = (Y = q.transporter) !== null && Y !== void 0 ? Y : new Gpq.DefaultTransporter, q.transporterOptions) this.transporter.defaults = q.transporterOptions;
            if (q.eagerRefreshThresholdMillis) this.eagerRefreshThresholdMillis = q.eagerRefreshThresholdMillis;
            this.forceRefreshOnFailure = (A = q.forceRefreshOnFailure) !== null && A !== void 0 ? A : !1
        }
        get gaxios() {
            if (this.transporter instanceof fpq.Gaxios) return this.transporter;
            else if (this.transporter instanceof Gpq.DefaultTransporter) return this.transporter.instance;
            else if ("instance" in this.transporter && this.transporter.instance instanceof fpq.Gaxios) return this.transporter.instance;
            return null
        }
        setCredentials(q) {
            this.credentials = q
        }
        addSharedMetadataHeaders(q) {
            if (!q["x-goog-user-project"] && this.quotaProjectId) q["x-goog-user-project"] = this.quotaProjectId;
            return q
        }
        static get RETRY_CONFIG() {
            return {
                retry: !0,
                retryConfig: {
                    httpMethodsToRetry: ["GET", "PUT", "POST", "HEAD", "OPTIONS", "DELETE"]
                }
            }
        }
    }
    Tpq.AuthClient = vpq
})
// @from(Ln 152132, Col 4)
Hh1 = p((Epq) => {
    Object.defineProperty(Epq, "__esModule", {
        value: !0
    });
    Epq.LoginTicket = void 0;
    class Npq {
        constructor(q, K) {
            this.envelope = q, this.payload = K
        }
        getEnvelope() {
            return this.envelope
        }
        getPayload() {
            return this.payload
        }
        getUserId() {
            let q = this.getPayload();
            if (q && q.sub) return q.sub;
            return null
        }
        getAttributes() {
            return {
                envelope: this.getEnvelope(),
                payload: this.getPayload()
            }
        }
    }
    Epq.LoginTicket = Npq
})