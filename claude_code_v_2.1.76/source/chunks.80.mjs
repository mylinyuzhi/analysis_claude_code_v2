
// @from(Ln 208835, Col 4)
dZ8 = x((ta7, UM1) => {
    (function(A) {
        var q, K = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
            Y = Math.ceil,
            z = Math.floor,
            _ = "[BigNumber Error] ",
            w = _ + "Number primitive has more than 15 significant digits: ",
            O = 100000000000000,
            $ = 14,
            H = 9007199254740991,
            j = [1, 10, 100, 1000, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 10000000000, 100000000000, 1000000000000, 10000000000000],
            J = 1e7,
            M = 1e9;

        function D(N) {
            var V, L, h, R = K6.prototype = {
                    constructor: K6,
                    toString: null,
                    valueOf: null
                },
                u = new K6(1),
                I = 20,
                g = 4,
                B = -7,
                b = 21,
                p = -1e7,
                Q = 1e7,
                U = !1,
                r = 1,
                e = 0,
                Y6 = {
                    prefix: "",
                    groupSize: 3,
                    secondaryGroupSize: 0,
                    groupSeparator: ",",
                    decimalSeparator: ".",
                    fractionGroupSize: 0,
                    fractionGroupSeparator: " ",
                    suffix: ""
                },
                H6 = "0123456789abcdefghijklmnopqrstuvwxyz",
                J6 = !0;

            function K6(n, o) {
                var a, i, l, q6, w6, O6, L6, y6, G6 = this;
                if (!(G6 instanceof K6)) return new K6(n, o);
                if (o == null) {
                    if (n && n._isBigNumber === !0) {
                        if (G6.s = n.s, !n.c || n.e > Q) G6.c = G6.e = null;
                        else if (n.e < p) G6.c = [G6.e = 0];
                        else G6.e = n.e, G6.c = n.c.slice();
                        return
                    }
                    if ((O6 = typeof n == "number") && n * 0 == 0) {
                        if (G6.s = 1 / n < 0 ? (n = -n, -1) : 1, n === ~~n) {
                            for (q6 = 0, w6 = n; w6 >= 10; w6 /= 10, q6++);
                            if (q6 > Q) G6.c = G6.e = null;
                            else G6.e = q6, G6.c = [n];
                            return
                        }
                        y6 = String(n)
                    } else {
                        if (!K.test(y6 = String(n))) return h(G6, y6, O6);
                        G6.s = y6.charCodeAt(0) == 45 ? (y6 = y6.slice(1), -1) : 1
                    }
                    if ((q6 = y6.indexOf(".")) > -1) y6 = y6.replace(".", "");
                    if ((w6 = y6.search(/e/i)) > 0) {
                        if (q6 < 0) q6 = w6;
                        q6 += +y6.slice(w6 + 1), y6 = y6.substring(0, w6)
                    } else if (q6 < 0) q6 = y6.length
                } else {
                    if (Z(o, 2, H6.length, "Base"), o == 10 && J6) return G6 = new K6(n), N6(G6, I + G6.e + 1, g);
                    if (y6 = String(n), O6 = typeof n == "number") {
                        if (n * 0 != 0) return h(G6, y6, O6, o);
                        if (G6.s = 1 / n < 0 ? (y6 = y6.slice(1), -1) : 1, K6.DEBUG && y6.replace(/^0\.0*|\./, "").length > 15) throw Error(w + n)
                    } else G6.s = y6.charCodeAt(0) === 45 ? (y6 = y6.slice(1), -1) : 1;
                    a = H6.slice(0, o), q6 = w6 = 0;
                    for (L6 = y6.length; w6 < L6; w6++)
                        if (a.indexOf(i = y6.charAt(w6)) < 0) {
                            if (i == ".") {
                                if (w6 > q6) {
                                    q6 = L6;
                                    continue
                                }
                            } else if (!l) {
                                if (y6 == y6.toUpperCase() && (y6 = y6.toLowerCase()) || y6 == y6.toLowerCase() && (y6 = y6.toUpperCase())) {
                                    l = !0, w6 = -1, q6 = 0;
                                    continue
                                }
                            }
                            return h(G6, String(n), O6, o)
                        } if (O6 = !1, y6 = L(y6, o, 10, G6.s), (q6 = y6.indexOf(".")) > -1) y6 = y6.replace(".", "");
                    else q6 = y6.length
                }
                for (w6 = 0; y6.charCodeAt(w6) === 48; w6++);
                for (L6 = y6.length; y6.charCodeAt(--L6) === 48;);
                if (y6 = y6.slice(w6, ++L6)) {
                    if (L6 -= w6, O6 && K6.DEBUG && L6 > 15 && (n > H || n !== z(n))) throw Error(w + G6.s * n);
                    if ((q6 = q6 - w6 - 1) > Q) G6.c = G6.e = null;
                    else if (q6 < p) G6.c = [G6.e = 0];
                    else {
                        if (G6.e = q6, G6.c = [], w6 = (q6 + 1) % $, q6 < 0) w6 += $;
                        if (w6 < L6) {
                            if (w6) G6.c.push(+y6.slice(0, w6));
                            for (L6 -= $; w6 < L6;) G6.c.push(+y6.slice(w6, w6 += $));
                            w6 = $ - (y6 = y6.slice(w6)).length
                        } else w6 -= L6;
                        for (; w6--; y6 += "0");
                        G6.c.push(+y6)
                    }
                } else G6.c = [G6.e = 0]
            }
            K6.clone = D, K6.ROUND_UP = 0, K6.ROUND_DOWN = 1, K6.ROUND_CEIL = 2, K6.ROUND_FLOOR = 3, K6.ROUND_HALF_UP = 4, K6.ROUND_HALF_DOWN = 5, K6.ROUND_HALF_EVEN = 6, K6.ROUND_HALF_CEIL = 7, K6.ROUND_HALF_FLOOR = 8, K6.EUCLID = 9, K6.config = K6.set = function(n) {
                var o, a;
                if (n != null)
                    if (typeof n == "object") {
                        if (n.hasOwnProperty(o = "DECIMAL_PLACES")) a = n[o], Z(a, 0, M, o), I = a;
                        if (n.hasOwnProperty(o = "ROUNDING_MODE")) a = n[o], Z(a, 0, 8, o), g = a;
                        if (n.hasOwnProperty(o = "EXPONENTIAL_AT"))
                            if (a = n[o], a && a.pop) Z(a[0], -M, 0, o), Z(a[1], 0, M, o), B = a[0], b = a[1];
                            else Z(a, -M, M, o), B = -(b = a < 0 ? -a : a);
                        if (n.hasOwnProperty(o = "RANGE"))
                            if (a = n[o], a && a.pop) Z(a[0], -M, -1, o), Z(a[1], 1, M, o), p = a[0], Q = a[1];
                            else if (Z(a, -M, M, o), a) p = -(Q = a < 0 ? -a : a);
                        else throw Error(_ + o + " cannot be zero: " + a);
                        if (n.hasOwnProperty(o = "CRYPTO"))
                            if (a = n[o], a === !!a)
                                if (a)
                                    if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes)) U = a;
                                    else throw U = !a, Error(_ + "crypto unavailable");
                        else U = a;
                        else throw Error(_ + o + " not true or false: " + a);
                        if (n.hasOwnProperty(o = "MODULO_MODE")) a = n[o], Z(a, 0, 9, o), r = a;
                        if (n.hasOwnProperty(o = "POW_PRECISION")) a = n[o], Z(a, 0, M, o), e = a;
                        if (n.hasOwnProperty(o = "FORMAT"))
                            if (a = n[o], typeof a == "object") Y6 = a;
                            else throw Error(_ + o + " not an object: " + a);
                        if (n.hasOwnProperty(o = "ALPHABET"))
                            if (a = n[o], typeof a == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(a)) J6 = a.slice(0, 10) == "0123456789", H6 = a;
                            else throw Error(_ + o + " invalid: " + a)
                    } else throw Error(_ + "Object expected: " + n);
                return {
                    DECIMAL_PLACES: I,
                    ROUNDING_MODE: g,
                    EXPONENTIAL_AT: [B, b],
                    RANGE: [p, Q],
                    CRYPTO: U,
                    MODULO_MODE: r,
                    POW_PRECISION: e,
                    FORMAT: Y6,
                    ALPHABET: H6
                }
            }, K6.isBigNumber = function(n) {
                if (!n || n._isBigNumber !== !0) return !1;
                if (!K6.DEBUG) return !0;
                var o, a, i = n.c,
                    l = n.e,
                    q6 = n.s;
                A: if ({}.toString.call(i) == "[object Array]") {
                    if ((q6 === 1 || q6 === -1) && l >= -M && l <= M && l === z(l)) {
                        if (i[0] === 0) {
                            if (l === 0 && i.length === 1) return !0;
                            break A
                        }
                        if (o = (l + 1) % $, o < 1) o += $;
                        if (String(i[0]).length == o) {
                            for (o = 0; o < i.length; o++)
                                if (a = i[o], a < 0 || a >= O || a !== z(a)) break A;
                            if (a !== 0) return !0
                        }
                    }
                } else if (i === null && l === null && (q6 === null || q6 === 1 || q6 === -1)) return !0;
                throw Error(_ + "Invalid BigNumber: " + n)
            }, K6.maximum = K6.max = function() {
                return X6(arguments, -1)
            }, K6.minimum = K6.min = function() {
                return X6(arguments, 1)
            }, K6.random = function() {
                var n = 9007199254740992,
                    o = Math.random() * n & 2097151 ? function() {
                        return z(Math.random() * n)
                    } : function() {
                        return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0)
                    };
                return function(a) {
                    var i, l, q6, w6, O6, L6 = 0,
                        y6 = [],
                        G6 = new K6(u);
                    if (a == null) a = I;
                    else Z(a, 0, M);
                    if (w6 = Y(a / $), U)
                        if (crypto.getRandomValues) {
                            i = crypto.getRandomValues(new Uint32Array(w6 *= 2));
                            for (; L6 < w6;)
                                if (O6 = i[L6] * 131072 + (i[L6 + 1] >>> 11), O6 >= 9000000000000000) l = crypto.getRandomValues(new Uint32Array(2)), i[L6] = l[0], i[L6 + 1] = l[1];
                                else y6.push(O6 % 100000000000000), L6 += 2;
                            L6 = w6 / 2
                        } else if (crypto.randomBytes) {
                        i = crypto.randomBytes(w6 *= 7);
                        for (; L6 < w6;)
                            if (O6 = (i[L6] & 31) * 281474976710656 + i[L6 + 1] * 1099511627776 + i[L6 + 2] * 4294967296 + i[L6 + 3] * 16777216 + (i[L6 + 4] << 16) + (i[L6 + 5] << 8) + i[L6 + 6], O6 >= 9000000000000000) crypto.randomBytes(7).copy(i, L6);
                            else y6.push(O6 % 100000000000000), L6 += 7;
                        L6 = w6 / 7
                    } else throw U = !1, Error(_ + "crypto unavailable");
                    if (!U) {
                        for (; L6 < w6;)
                            if (O6 = o(), O6 < 9000000000000000) y6[L6++] = O6 % 100000000000000
                    }
                    if (w6 = y6[--L6], a %= $, w6 && a) O6 = j[$ - a], y6[L6] = z(w6 / O6) * O6;
                    for (; y6[L6] === 0; y6.pop(), L6--);
                    if (L6 < 0) y6 = [q6 = 0];
                    else {
                        for (q6 = -1; y6[0] === 0; y6.splice(0, 1), q6 -= $);
                        for (L6 = 1, O6 = y6[0]; O6 >= 10; O6 /= 10, L6++);
                        if (L6 < $) q6 -= $ - L6
                    }
                    return G6.e = q6, G6.c = y6, G6
                }
            }(), K6.sum = function() {
                var n = 1,
                    o = arguments,
                    a = new K6(o[0]);
                for (; n < o.length;) a = a.plus(o[n++]);
                return a
            }, L = function() {
                var n = "0123456789";

                function o(a, i, l, q6) {
                    var w6, O6 = [0],
                        L6, y6 = 0,
                        G6 = a.length;
                    for (; y6 < G6;) {
                        for (L6 = O6.length; L6--; O6[L6] *= i);
                        O6[0] += q6.indexOf(a.charAt(y6++));
                        for (w6 = 0; w6 < O6.length; w6++)
                            if (O6[w6] > l - 1) {
                                if (O6[w6 + 1] == null) O6[w6 + 1] = 0;
                                O6[w6 + 1] += O6[w6] / l | 0, O6[w6] %= l
                            }
                    }
                    return O6.reverse()
                }
                return function(a, i, l, q6, w6) {
                    var O6, L6, y6, G6, R6, T6, D6, Q6, k6 = a.indexOf("."),
                        Z6 = I,
                        u6 = g;
                    if (k6 >= 0) G6 = e, e = 0, a = a.replace(".", ""), Q6 = new K6(i), T6 = Q6.pow(a.length - k6), e = G6, Q6.c = o(v(P(T6.c), T6.e, "0"), 10, l, n), Q6.e = Q6.c.length;
                    D6 = o(a, i, l, w6 ? (O6 = H6, n) : (O6 = n, H6)), y6 = G6 = D6.length;
                    for (; D6[--G6] == 0; D6.pop());
                    if (!D6[0]) return O6.charAt(0);
                    if (k6 < 0) --y6;
                    else T6.c = D6, T6.e = y6, T6.s = q6, T6 = V(T6, Q6, Z6, u6, l), D6 = T6.c, R6 = T6.r, y6 = T6.e;
                    if (L6 = y6 + Z6 + 1, k6 = D6[L6], G6 = l / 2, R6 = R6 || L6 < 0 || D6[L6 + 1] != null, R6 = u6 < 4 ? (k6 != null || R6) && (u6 == 0 || u6 == (T6.s < 0 ? 3 : 2)) : k6 > G6 || k6 == G6 && (u6 == 4 || R6 || u6 == 6 && D6[L6 - 1] & 1 || u6 == (T6.s < 0 ? 8 : 7)), L6 < 1 || !D6[0]) a = R6 ? v(O6.charAt(1), -Z6, O6.charAt(0)) : O6.charAt(0);
                    else {
                        if (D6.length = L6, R6) {
                            for (--l; ++D6[--L6] > l;)
                                if (D6[L6] = 0, !L6) ++y6, D6 = [1].concat(D6)
                        }
                        for (G6 = D6.length; !D6[--G6];);
                        for (k6 = 0, a = ""; k6 <= G6; a += O6.charAt(D6[k6++]));
                        a = v(a, y6, O6.charAt(0))
                    }
                    return a
                }
            }(), V = function() {
                function n(i, l, q6) {
                    var w6, O6, L6, y6, G6 = 0,
                        R6 = i.length,
                        T6 = l % J,
                        D6 = l / J | 0;
                    for (i = i.slice(); R6--;) L6 = i[R6] % J, y6 = i[R6] / J | 0, w6 = D6 * L6 + y6 * T6, O6 = T6 * L6 + w6 % J * J + G6, G6 = (O6 / q6 | 0) + (w6 / J | 0) + D6 * y6, i[R6] = O6 % q6;
                    if (G6) i = [G6].concat(i);
                    return i
                }

                function o(i, l, q6, w6) {
                    var O6, L6;
                    if (q6 != w6) L6 = q6 > w6 ? 1 : -1;
                    else
                        for (O6 = L6 = 0; O6 < q6; O6++)
                            if (i[O6] != l[O6]) {
                                L6 = i[O6] > l[O6] ? 1 : -1;
                                break
                            } return L6
                }

                function a(i, l, q6, w6) {
                    var O6 = 0;
                    for (; q6--;) i[q6] -= O6, O6 = i[q6] < l[q6] ? 1 : 0, i[q6] = O6 * w6 + i[q6] - l[q6];
                    for (; !i[0] && i.length > 1; i.splice(0, 1));
                }
                return function(i, l, q6, w6, O6) {
                    var L6, y6, G6, R6, T6, D6, Q6, k6, Z6, u6, C6, o6, V6, b6, E6, U6, c6, K1 = i.s == l.s ? 1 : -1,
                        j6 = i.c,
                        W6 = l.c;
                    if (!j6 || !j6[0] || !W6 || !W6[0]) return new K6(!i.s || !l.s || (j6 ? W6 && j6[0] == W6[0] : !W6) ? NaN : j6 && j6[0] == 0 || !W6 ? K1 * 0 : K1 / 0);
                    if (k6 = new K6(K1), Z6 = k6.c = [], y6 = i.e - l.e, K1 = q6 + y6 + 1, !O6) O6 = O, y6 = X(i.e / $) - X(l.e / $), K1 = K1 / $ | 0;
                    for (G6 = 0; W6[G6] == (j6[G6] || 0); G6++);
                    if (W6[G6] > (j6[G6] || 0)) y6--;
                    if (K1 < 0) Z6.push(1), R6 = !0;
                    else {
                        if (b6 = j6.length, U6 = W6.length, G6 = 0, K1 += 2, T6 = z(O6 / (W6[0] + 1)), T6 > 1) W6 = n(W6, T6, O6), j6 = n(j6, T6, O6), U6 = W6.length, b6 = j6.length;
                        V6 = U6, u6 = j6.slice(0, U6), C6 = u6.length;
                        for (; C6 < U6; u6[C6++] = 0);
                        if (c6 = W6.slice(), c6 = [0].concat(c6), E6 = W6[0], W6[1] >= O6 / 2) E6++;
                        do {
                            if (T6 = 0, L6 = o(W6, u6, U6, C6), L6 < 0) {
                                if (o6 = u6[0], U6 != C6) o6 = o6 * O6 + (u6[1] || 0);
                                if (T6 = z(o6 / E6), T6 > 1) {
                                    if (T6 >= O6) T6 = O6 - 1;
                                    D6 = n(W6, T6, O6), Q6 = D6.length, C6 = u6.length;
                                    while (o(D6, u6, Q6, C6) == 1) T6--, a(D6, U6 < Q6 ? c6 : W6, Q6, O6), Q6 = D6.length, L6 = 1
                                } else {
                                    if (T6 == 0) L6 = T6 = 1;
                                    D6 = W6.slice(), Q6 = D6.length
                                }
                                if (Q6 < C6) D6 = [0].concat(D6);
                                if (a(u6, D6, C6, O6), C6 = u6.length, L6 == -1)
                                    while (o(W6, u6, U6, C6) < 1) T6++, a(u6, U6 < C6 ? c6 : W6, C6, O6), C6 = u6.length
                            } else if (L6 === 0) T6++, u6 = [0];
                            if (Z6[G6++] = T6, u6[0]) u6[C6++] = j6[V6] || 0;
                            else u6 = [j6[V6]], C6 = 1
                        } while ((V6++ < b6 || u6[0] != null) && K1--);
                        if (R6 = u6[0] != null, !Z6[0]) Z6.splice(0, 1)
                    }
                    if (O6 == O) {
                        for (G6 = 1, K1 = Z6[0]; K1 >= 10; K1 /= 10, G6++);
                        N6(k6, q6 + (k6.e = G6 + y6 * $ - 1) + 1, w6, R6)
                    } else k6.e = y6, k6.r = +R6;
                    return k6
                }
            }();

            function s(n, o, a, i) {
                var l, q6, w6, O6, L6;
                if (a == null) a = g;
                else Z(a, 0, 8);
                if (!n.c) return n.toString();
                if (l = n.c[0], w6 = n.e, o == null) L6 = P(n.c), L6 = i == 1 || i == 2 && (w6 <= B || w6 >= b) ? f(L6, w6) : v(L6, w6, "0");
                else if (n = N6(new K6(n), o, a), q6 = n.e, L6 = P(n.c), O6 = L6.length, i == 1 || i == 2 && (o <= q6 || q6 <= B)) {
                    for (; O6 < o; L6 += "0", O6++);
                    L6 = f(L6, q6)
                } else if (o -= w6, L6 = v(L6, q6, "0"), q6 + 1 > O6) {
                    if (--o > 0)
                        for (L6 += "."; o--; L6 += "0");
                } else if (o += q6 - O6, o > 0) {
                    if (q6 + 1 == O6) L6 += ".";
                    for (; o--; L6 += "0");
                }
                return n.s < 0 && l ? "-" + L6 : L6
            }

            function X6(n, o) {
                var a, i, l = 1,
                    q6 = new K6(n[0]);
                for (; l < n.length; l++)
                    if (i = new K6(n[l]), !i.s || (a = W(q6, i)) === o || a === 0 && q6.s === o) q6 = i;
                return q6
            }

            function z6(n, o, a) {
                var i = 1,
                    l = o.length;
                for (; !o[--l]; o.pop());
                for (l = o[0]; l >= 10; l /= 10, i++);
                if ((a = i + a * $ - 1) > Q) n.c = n.e = null;
                else if (a < p) n.c = [n.e = 0];
                else n.e = a, n.c = o;
                return n
            }
            h = function() {
                var n = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
                    o = /^([^.]+)\.$/,
                    a = /^\.([^.]+)$/,
                    i = /^-?(Infinity|NaN)$/,
                    l = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
                return function(q6, w6, O6, L6) {
                    var y6, G6 = O6 ? w6 : w6.replace(l, "");
                    if (i.test(G6)) q6.s = isNaN(G6) ? null : G6 < 0 ? -1 : 1;
                    else {
                        if (!O6) {
                            if (G6 = G6.replace(n, function(R6, T6, D6) {
                                    return y6 = (D6 = D6.toLowerCase()) == "x" ? 16 : D6 == "b" ? 2 : 8, !L6 || L6 == y6 ? T6 : R6
                                }), L6) y6 = L6, G6 = G6.replace(o, "$1").replace(a, "0.$1");
                            if (w6 != G6) return new K6(G6, y6)
                        }
                        if (K6.DEBUG) throw Error(_ + "Not a" + (L6 ? " base " + L6 : "") + " number: " + w6);
                        q6.s = null
                    }
                    q6.c = q6.e = null
                }
            }();

            function N6(n, o, a, i) {
                var l, q6, w6, O6, L6, y6, G6, R6 = n.c,
                    T6 = j;
                if (R6) {
                    A: {
                        for (l = 1, O6 = R6[0]; O6 >= 10; O6 /= 10, l++);
                        if (q6 = o - l, q6 < 0) q6 += $,
                        w6 = o,
                        L6 = R6[y6 = 0],
                        G6 = z(L6 / T6[l - w6 - 1] % 10);
                        else if (y6 = Y((q6 + 1) / $), y6 >= R6.length)
                            if (i) {
                                for (; R6.length <= y6; R6.push(0));
                                L6 = G6 = 0, l = 1, q6 %= $, w6 = q6 - $ + 1
                            } else break A;
                        else {
                            L6 = O6 = R6[y6];
                            for (l = 1; O6 >= 10; O6 /= 10, l++);
                            q6 %= $, w6 = q6 - $ + l, G6 = w6 < 0 ? 0 : z(L6 / T6[l - w6 - 1] % 10)
                        }
                        if (i = i || o < 0 || R6[y6 + 1] != null || (w6 < 0 ? L6 : L6 % T6[l - w6 - 1]), i = a < 4 ? (G6 || i) && (a == 0 || a == (n.s < 0 ? 3 : 2)) : G6 > 5 || G6 == 5 && (a == 4 || i || a == 6 && (q6 > 0 ? w6 > 0 ? L6 / T6[l - w6] : 0 : R6[y6 - 1]) % 10 & 1 || a == (n.s < 0 ? 8 : 7)), o < 1 || !R6[0]) {
                            if (R6.length = 0, i) o -= n.e + 1, R6[0] = T6[($ - o % $) % $], n.e = -o || 0;
                            else R6[0] = n.e = 0;
                            return n
                        }
                        if (q6 == 0) R6.length = y6,
                        O6 = 1,
                        y6--;
                        else R6.length = y6 + 1,
                        O6 = T6[$ - q6],
                        R6[y6] = w6 > 0 ? z(L6 / T6[l - w6] % T6[w6]) * O6 : 0;
                        if (i)
                            for (;;)
                                if (y6 == 0) {
                                    for (q6 = 1, w6 = R6[0]; w6 >= 10; w6 /= 10, q6++);
                                    w6 = R6[0] += O6;
                                    for (O6 = 1; w6 >= 10; w6 /= 10, O6++);
                                    if (q6 != O6) {
                                        if (n.e++, R6[0] == O) R6[0] = 1
                                    }
                                    break
                                } else {
                                    if (R6[y6] += O6, R6[y6] != O) break;
                                    R6[y6--] = 0, O6 = 1
                                } for (q6 = R6.length; R6[--q6] === 0; R6.pop());
                    }
                    if (n.e > Q) n.c = n.e = null;
                    else if (n.e < p) n.c = [n.e = 0]
                }
                return n
            }

            function $6(n) {
                var o, a = n.e;
                if (a === null) return n.toString();
                return o = P(n.c), o = a <= B || a >= b ? f(o, a) : v(o, a, "0"), n.s < 0 ? "-" + o : o
            }
            if (R.absoluteValue = R.abs = function() {
                    var n = new K6(this);
                    if (n.s < 0) n.s = 1;
                    return n
                }, R.comparedTo = function(n, o) {
                    return W(this, new K6(n, o))
                }, R.decimalPlaces = R.dp = function(n, o) {
                    var a, i, l, q6 = this;
                    if (n != null) {
                        if (Z(n, 0, M), o == null) o = g;
                        else Z(o, 0, 8);
                        return N6(new K6(q6), n + q6.e + 1, o)
                    }
                    if (!(a = q6.c)) return null;
                    if (i = ((l = a.length - 1) - X(this.e / $)) * $, l = a[l])
                        for (; l % 10 == 0; l /= 10, i--);
                    if (i < 0) i = 0;
                    return i
                }, R.dividedBy = R.div = function(n, o) {
                    return V(this, new K6(n, o), I, g)
                }, R.dividedToIntegerBy = R.idiv = function(n, o) {
                    return V(this, new K6(n, o), 0, 1)
                }, R.exponentiatedBy = R.pow = function(n, o) {
                    var a, i, l, q6, w6, O6, L6, y6, G6, R6 = this;
                    if (n = new K6(n), n.c && !n.isInteger()) throw Error(_ + "Exponent not an integer: " + $6(n));
                    if (o != null) o = new K6(o);
                    if (O6 = n.e > 14, !R6.c || !R6.c[0] || R6.c[0] == 1 && !R6.e && R6.c.length == 1 || !n.c || !n.c[0]) return G6 = new K6(Math.pow(+$6(R6), O6 ? n.s * (2 - G(n)) : +$6(n))), o ? G6.mod(o) : G6;
                    if (L6 = n.s < 0, o) {
                        if (o.c ? !o.c[0] : !o.s) return new K6(NaN);
                        if (i = !L6 && R6.isInteger() && o.isInteger(), i) R6 = R6.mod(o)
                    } else if (n.e > 9 && (R6.e > 0 || R6.e < -1 || (R6.e == 0 ? R6.c[0] > 1 || O6 && R6.c[1] >= 240000000 : R6.c[0] < 80000000000000 || O6 && R6.c[0] <= 99999750000000))) {
                        if (q6 = R6.s < 0 && G(n) ? -0 : 0, R6.e > -1) q6 = 1 / q6;
                        return new K6(L6 ? 1 / q6 : q6)
                    } else if (e) q6 = Y(e / $ + 2);
                    if (O6) {
                        if (a = new K6(0.5), L6) n.s = 1;
                        y6 = G(n)
                    } else l = Math.abs(+$6(n)), y6 = l % 2;
                    G6 = new K6(u);
                    for (;;) {
                        if (y6) {
                            if (G6 = G6.times(R6), !G6.c) break;
                            if (q6) {
                                if (G6.c.length > q6) G6.c.length = q6
                            } else if (i) G6 = G6.mod(o)
                        }
                        if (l) {
                            if (l = z(l / 2), l === 0) break;
                            y6 = l % 2
                        } else if (n = n.times(a), N6(n, n.e + 1, 1), n.e > 14) y6 = G(n);
                        else {
                            if (l = +$6(n), l === 0) break;
                            y6 = l % 2
                        }
                        if (R6 = R6.times(R6), q6) {
                            if (R6.c && R6.c.length > q6) R6.c.length = q6
                        } else if (i) R6 = R6.mod(o)
                    }
                    if (i) return G6;
                    if (L6) G6 = u.div(G6);
                    return o ? G6.mod(o) : q6 ? N6(G6, e, g, w6) : G6
                }, R.integerValue = function(n) {
                    var o = new K6(this);
                    if (n == null) n = g;
                    else Z(n, 0, 8);
                    return N6(o, o.e + 1, n)
                }, R.isEqualTo = R.eq = function(n, o) {
                    return W(this, new K6(n, o)) === 0
                }, R.isFinite = function() {
                    return !!this.c
                }, R.isGreaterThan = R.gt = function(n, o) {
                    return W(this, new K6(n, o)) > 0
                }, R.isGreaterThanOrEqualTo = R.gte = function(n, o) {
                    return (o = W(this, new K6(n, o))) === 1 || o === 0
                }, R.isInteger = function() {
                    return !!this.c && X(this.e / $) > this.c.length - 2
                }, R.isLessThan = R.lt = function(n, o) {
                    return W(this, new K6(n, o)) < 0
                }, R.isLessThanOrEqualTo = R.lte = function(n, o) {
                    return (o = W(this, new K6(n, o))) === -1 || o === 0
                }, R.isNaN = function() {
                    return !this.s
                }, R.isNegative = function() {
                    return this.s < 0
                }, R.isPositive = function() {
                    return this.s > 0
                }, R.isZero = function() {
                    return !!this.c && this.c[0] == 0
                }, R.minus = function(n, o) {
                    var a, i, l, q6, w6 = this,
                        O6 = w6.s;
                    if (n = new K6(n, o), o = n.s, !O6 || !o) return new K6(NaN);
                    if (O6 != o) return n.s = -o, w6.plus(n);
                    var L6 = w6.e / $,
                        y6 = n.e / $,
                        G6 = w6.c,
                        R6 = n.c;
                    if (!L6 || !y6) {
                        if (!G6 || !R6) return G6 ? (n.s = -o, n) : new K6(R6 ? w6 : NaN);
                        if (!G6[0] || !R6[0]) return R6[0] ? (n.s = -o, n) : new K6(G6[0] ? w6 : g == 3 ? -0 : 0)
                    }
                    if (L6 = X(L6), y6 = X(y6), G6 = G6.slice(), O6 = L6 - y6) {
                        if (q6 = O6 < 0) O6 = -O6, l = G6;
                        else y6 = L6, l = R6;
                        l.reverse();
                        for (o = O6; o--; l.push(0));
                        l.reverse()
                    } else {
                        i = (q6 = (O6 = G6.length) < (o = R6.length)) ? O6 : o;
                        for (O6 = o = 0; o < i; o++)
                            if (G6[o] != R6[o]) {
                                q6 = G6[o] < R6[o];
                                break
                            }
                    }
                    if (q6) l = G6, G6 = R6, R6 = l, n.s = -n.s;
                    if (o = (i = R6.length) - (a = G6.length), o > 0)
                        for (; o--; G6[a++] = 0);
                    o = O - 1;
                    for (; i > O6;) {
                        if (G6[--i] < R6[i]) {
                            for (a = i; a && !G6[--a]; G6[a] = o);
                            --G6[a], G6[i] += O
                        }
                        G6[i] -= R6[i]
                    }
                    for (; G6[0] == 0; G6.splice(0, 1), --y6);
                    if (!G6[0]) return n.s = g == 3 ? -1 : 1, n.c = [n.e = 0], n;
                    return z6(n, G6, y6)
                }, R.modulo = R.mod = function(n, o) {
                    var a, i, l = this;
                    if (n = new K6(n, o), !l.c || !n.s || n.c && !n.c[0]) return new K6(NaN);
                    else if (!n.c || l.c && !l.c[0]) return new K6(l);
                    if (r == 9) i = n.s, n.s = 1, a = V(l, n, 0, 3), n.s = i, a.s *= i;
                    else a = V(l, n, 0, r);
                    if (n = l.minus(a.times(n)), !n.c[0] && r == 1) n.s = l.s;
                    return n
                }, R.multipliedBy = R.times = function(n, o) {
                    var a, i, l, q6, w6, O6, L6, y6, G6, R6, T6, D6, Q6, k6, Z6, u6 = this,
                        C6 = u6.c,
                        o6 = (n = new K6(n, o)).c;
                    if (!C6 || !o6 || !C6[0] || !o6[0]) {
                        if (!u6.s || !n.s || C6 && !C6[0] && !o6 || o6 && !o6[0] && !C6) n.c = n.e = n.s = null;
                        else if (n.s *= u6.s, !C6 || !o6) n.c = n.e = null;
                        else n.c = [0], n.e = 0;
                        return n
                    }
                    if (i = X(u6.e / $) + X(n.e / $), n.s *= u6.s, L6 = C6.length, R6 = o6.length, L6 < R6) Q6 = C6, C6 = o6, o6 = Q6, l = L6, L6 = R6, R6 = l;
                    for (l = L6 + R6, Q6 = []; l--; Q6.push(0));
                    k6 = O, Z6 = J;
                    for (l = R6; --l >= 0;) {
                        a = 0, T6 = o6[l] % Z6, D6 = o6[l] / Z6 | 0;
                        for (w6 = L6, q6 = l + w6; q6 > l;) y6 = C6[--w6] % Z6, G6 = C6[w6] / Z6 | 0, O6 = D6 * y6 + G6 * T6, y6 = T6 * y6 + O6 % Z6 * Z6 + Q6[q6] + a, a = (y6 / k6 | 0) + (O6 / Z6 | 0) + D6 * G6, Q6[q6--] = y6 % k6;
                        Q6[q6] = a
                    }
                    if (a) ++i;
                    else Q6.splice(0, 1);
                    return z6(n, Q6, i)
                }, R.negated = function() {
                    var n = new K6(this);
                    return n.s = -n.s || null, n
                }, R.plus = function(n, o) {
                    var a, i = this,
                        l = i.s;
                    if (n = new K6(n, o), o = n.s, !l || !o) return new K6(NaN);
                    if (l != o) return n.s = -o, i.minus(n);
                    var q6 = i.e / $,
                        w6 = n.e / $,
                        O6 = i.c,
                        L6 = n.c;
                    if (!q6 || !w6) {
                        if (!O6 || !L6) return new K6(l / 0);
                        if (!O6[0] || !L6[0]) return L6[0] ? n : new K6(O6[0] ? i : l * 0)
                    }
                    if (q6 = X(q6), w6 = X(w6), O6 = O6.slice(), l = q6 - w6) {
                        if (l > 0) w6 = q6, a = L6;
                        else l = -l, a = O6;
                        a.reverse();
                        for (; l--; a.push(0));
                        a.reverse()
                    }
                    if (l = O6.length, o = L6.length, l - o < 0) a = L6, L6 = O6, O6 = a, o = l;
                    for (l = 0; o;) l = (O6[--o] = O6[o] + L6[o] + l) / O | 0, O6[o] = O === O6[o] ? 0 : O6[o] % O;
                    if (l) O6 = [l].concat(O6), ++w6;
                    return z6(n, O6, w6)
                }, R.precision = R.sd = function(n, o) {
                    var a, i, l, q6 = this;
                    if (n != null && n !== !!n) {
                        if (Z(n, 1, M), o == null) o = g;
                        else Z(o, 0, 8);
                        return N6(new K6(q6), n, o)
                    }
                    if (!(a = q6.c)) return null;
                    if (l = a.length - 1, i = l * $ + 1, l = a[l]) {
                        for (; l % 10 == 0; l /= 10, i--);
                        for (l = a[0]; l >= 10; l /= 10, i++);
                    }
                    if (n && q6.e + 1 > i) i = q6.e + 1;
                    return i
                }, R.shiftedBy = function(n) {
                    return Z(n, -H, H), this.times("1e" + n)
                }, R.squareRoot = R.sqrt = function() {
                    var n, o, a, i, l, q6 = this,
                        w6 = q6.c,
                        O6 = q6.s,
                        L6 = q6.e,
                        y6 = I + 4,
                        G6 = new K6("0.5");
                    if (O6 !== 1 || !w6 || !w6[0]) return new K6(!O6 || O6 < 0 && (!w6 || w6[0]) ? NaN : w6 ? q6 : 1 / 0);
                    if (O6 = Math.sqrt(+$6(q6)), O6 == 0 || O6 == 1 / 0) {
                        if (o = P(w6), (o.length + L6) % 2 == 0) o += "0";
                        if (O6 = Math.sqrt(+o), L6 = X((L6 + 1) / 2) - (L6 < 0 || L6 % 2), O6 == 1 / 0) o = "5e" + L6;
                        else o = O6.toExponential(), o = o.slice(0, o.indexOf("e") + 1) + L6;
                        a = new K6(o)
                    } else a = new K6(O6 + "");
                    if (a.c[0]) {
                        if (L6 = a.e, O6 = L6 + y6, O6 < 3) O6 = 0;
                        for (;;)
                            if (l = a, a = G6.times(l.plus(V(q6, l, y6, 1))), P(l.c).slice(0, O6) === (o = P(a.c)).slice(0, O6)) {
                                if (a.e < L6) --O6;
                                if (o = o.slice(O6 - 3, O6 + 1), o == "9999" || !i && o == "4999") {
                                    if (!i) {
                                        if (N6(l, l.e + I + 2, 0), l.times(l).eq(q6)) {
                                            a = l;
                                            break
                                        }
                                    }
                                    y6 += 4, O6 += 4, i = 1
                                } else {
                                    if (!+o || !+o.slice(1) && o.charAt(0) == "5") N6(a, a.e + I + 2, 1), n = !a.times(a).eq(q6);
                                    break
                                }
                            }
                    }
                    return N6(a, a.e + I + 1, g, n)
                }, R.toExponential = function(n, o) {
                    if (n != null) Z(n, 0, M), n++;
                    return s(this, n, o, 1)
                }, R.toFixed = function(n, o) {
                    if (n != null) Z(n, 0, M), n = n + this.e + 1;
                    return s(this, n, o)
                }, R.toFormat = function(n, o, a) {
                    var i, l = this;
                    if (a == null)
                        if (n != null && o && typeof o == "object") a = o, o = null;
                        else if (n && typeof n == "object") a = n, n = o = null;
                    else a = Y6;
                    else if (typeof a != "object") throw Error(_ + "Argument not an object: " + a);
                    if (i = l.toFixed(n, o), l.c) {
                        var q6, w6 = i.split("."),
                            O6 = +a.groupSize,
                            L6 = +a.secondaryGroupSize,
                            y6 = a.groupSeparator || "",
                            G6 = w6[0],
                            R6 = w6[1],
                            T6 = l.s < 0,
                            D6 = T6 ? G6.slice(1) : G6,
                            Q6 = D6.length;
                        if (L6) q6 = O6, O6 = L6, L6 = q6, Q6 -= q6;
                        if (O6 > 0 && Q6 > 0) {
                            q6 = Q6 % O6 || O6, G6 = D6.substr(0, q6);
                            for (; q6 < Q6; q6 += O6) G6 += y6 + D6.substr(q6, O6);
                            if (L6 > 0) G6 += y6 + D6.slice(q6);
                            if (T6) G6 = "-" + G6
                        }
                        i = R6 ? G6 + (a.decimalSeparator || "") + ((L6 = +a.fractionGroupSize) ? R6.replace(new RegExp("\\d{" + L6 + "}\\B", "g"), "$&" + (a.fractionGroupSeparator || "")) : R6) : G6
                    }
                    return (a.prefix || "") + i + (a.suffix || "")
                }, R.toFraction = function(n) {
                    var o, a, i, l, q6, w6, O6, L6, y6, G6, R6, T6, D6 = this,
                        Q6 = D6.c;
                    if (n != null) {
                        if (O6 = new K6(n), !O6.isInteger() && (O6.c || O6.s !== 1) || O6.lt(u)) throw Error(_ + "Argument " + (O6.isInteger() ? "out of range: " : "not an integer: ") + $6(O6))
                    }
                    if (!Q6) return new K6(D6);
                    o = new K6(u), y6 = a = new K6(u), i = L6 = new K6(u), T6 = P(Q6), q6 = o.e = T6.length - D6.e - 1, o.c[0] = j[(w6 = q6 % $) < 0 ? $ + w6 : w6], n = !n || O6.comparedTo(o) > 0 ? q6 > 0 ? o : y6 : O6, w6 = Q, Q = 1 / 0, O6 = new K6(T6), L6.c[0] = 0;
                    for (;;) {
                        if (G6 = V(O6, o, 0, 1), l = a.plus(G6.times(i)), l.comparedTo(n) == 1) break;
                        a = i, i = l, y6 = L6.plus(G6.times(l = y6)), L6 = l, o = O6.minus(G6.times(l = o)), O6 = l
                    }
                    return l = V(n.minus(a), i, 0, 1), L6 = L6.plus(l.times(y6)), a = a.plus(l.times(i)), L6.s = y6.s = D6.s, q6 = q6 * 2, R6 = V(y6, i, q6, g).minus(D6).abs().comparedTo(V(L6, a, q6, g).minus(D6).abs()) < 1 ? [y6, i] : [L6, a], Q = w6, R6
                }, R.toNumber = function() {
                    return +$6(this)
                }, R.toPrecision = function(n, o) {
                    if (n != null) Z(n, 1, M);
                    return s(this, n, o, 2)
                }, R.toString = function(n) {
                    var o, a = this,
                        i = a.s,
                        l = a.e;
                    if (l === null)
                        if (i) {
                            if (o = "Infinity", i < 0) o = "-" + o
                        } else o = "NaN";
                    else {
                        if (n == null) o = l <= B || l >= b ? f(P(a.c), l) : v(P(a.c), l, "0");
                        else if (n === 10 && J6) a = N6(new K6(a), I + l + 1, g), o = v(P(a.c), a.e, "0");
                        else Z(n, 2, H6.length, "Base"), o = L(v(P(a.c), l, "0"), 10, n, i, !0);
                        if (i < 0 && a.c[0]) o = "-" + o
                    }
                    return o
                }, R.valueOf = R.toJSON = function() {
                    return $6(this)
                }, R._isBigNumber = !0, N != null) K6.set(N);
            return K6
        }

        function X(N) {
            var V = N | 0;
            return N > 0 || N === V ? V : V - 1
        }

        function P(N) {
            var V, L, h = 1,
                R = N.length,
                u = N[0] + "";
            for (; h < R;) {
                V = N[h++] + "", L = $ - V.length;
                for (; L--; V = "0" + V);
                u += V
            }
            for (R = u.length; u.charCodeAt(--R) === 48;);
            return u.slice(0, R + 1 || 1)
        }

        function W(N, V) {
            var L, h, R = N.c,
                u = V.c,
                I = N.s,
                g = V.s,
                B = N.e,
                b = V.e;
            if (!I || !g) return null;
            if (L = R && !R[0], h = u && !u[0], L || h) return L ? h ? 0 : -g : I;
            if (I != g) return I;
            if (L = I < 0, h = B == b, !R || !u) return h ? 0 : !R ^ L ? 1 : -1;
            if (!h) return B > b ^ L ? 1 : -1;
            g = (B = R.length) < (b = u.length) ? B : b;
            for (I = 0; I < g; I++)
                if (R[I] != u[I]) return R[I] > u[I] ^ L ? 1 : -1;
            return B == b ? 0 : B > b ^ L ? 1 : -1
        }

        function Z(N, V, L, h) {
            if (N < V || N > L || N !== z(N)) throw Error(_ + (h || "Argument") + (typeof N == "number" ? N < V || N > L ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(N))
        }

        function G(N) {
            var V = N.c.length - 1;
            return X(N.e / $) == V && N.c[V] % 2 != 0
        }

        function f(N, V) {
            return (N.length > 1 ? N.charAt(0) + "." + N.slice(1) : N) + (V < 0 ? "e" : "e+") + V
        }

        function v(N, V, L) {
            var h, R;
            if (V < 0) {
                for (R = L + "."; ++V; R += L);
                N = R + N
            } else if (h = N.length, ++V > h) {
                for (R = L, V -= h; --V; R += L);
                N += R
            } else if (V < h) N = N.slice(0, V) + "." + N.slice(V);
            return N
        }
        if (q = D(), q.default = q.BigNumber = q, typeof define == "function" && define.amd) define(function() {
            return q
        });
        else if (typeof UM1 < "u" && UM1.exports) UM1.exports = q;
        else {
            if (!A) A = typeof self < "u" && self ? self : window;
            A.BigNumber = q
        }
    })(ta7)
})
// @from(Ln 209662, Col 4)
Ks7 = x((xS2, qs7) => {
    var ea7 = dZ8(),
        As7 = xS2;
    (function() {
        function A(H) {
            return H < 10 ? "0" + H : H
        }
        var q = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            K = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            Y, z, _ = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': "\\\"",
                "\\": "\\\\"
            },
            w;

        function O(H) {
            return K.lastIndex = 0, K.test(H) ? '"' + H.replace(K, function(j) {
                var J = _[j];
                return typeof J === "string" ? J : "\\u" + ("0000" + j.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + H + '"'
        }

        function $(H, j) {
            var J, M, D, X, P = Y,
                W, Z = j[H],
                G = Z != null && (Z instanceof ea7 || ea7.isBigNumber(Z));
            if (Z && typeof Z === "object" && typeof Z.toJSON === "function") Z = Z.toJSON(H);
            if (typeof w === "function") Z = w.call(j, H, Z);
            switch (typeof Z) {
                case "string":
                    if (G) return Z;
                    else return O(Z);
                case "number":
                    return isFinite(Z) ? String(Z) : "null";
                case "boolean":
                case "null":
                case "bigint":
                    return String(Z);
                case "object":
                    if (!Z) return "null";
                    if (Y += z, W = [], Object.prototype.toString.apply(Z) === "[object Array]") {
                        X = Z.length;
                        for (J = 0; J < X; J += 1) W[J] = $(J, Z) || "null";
                        return D = W.length === 0 ? "[]" : Y ? `[
` + Y + W.join(`,
` + Y) + `
` + P + "]" : "[" + W.join(",") + "]", Y = P, D
                    }
                    if (w && typeof w === "object") {
                        X = w.length;
                        for (J = 0; J < X; J += 1)
                            if (typeof w[J] === "string") {
                                if (M = w[J], D = $(M, Z), D) W.push(O(M) + (Y ? ": " : ":") + D)
                            }
                    } else Object.keys(Z).forEach(function(f) {
                        var v = $(f, Z);
                        if (v) W.push(O(f) + (Y ? ": " : ":") + v)
                    });
                    return D = W.length === 0 ? "{}" : Y ? `{
` + Y + W.join(`,
` + Y) + `
` + P + "}" : "{" + W.join(",") + "}", Y = P, D
            }
        }
        if (typeof As7.stringify !== "function") As7.stringify = function(H, j, J) {
            var M;
            if (Y = "", z = "", typeof J === "number")
                for (M = 0; M < J; M += 1) z += " ";
            else if (typeof J === "string") z = J;
            if (w = j, j && typeof j !== "function" && (typeof j !== "object" || typeof j.length !== "number")) throw Error("JSON.stringify");
            return $("", {
                "": H
            })
        }
    })()
})
// @from(Ln 209743, Col 4)
zs7 = x((uS2, Ys7) => {
    var dM1 = null,
        u09 = /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/,
        m09 = /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/,
        B09 = function(A) {
            var q = {
                strict: !1,
                storeAsString: !1,
                alwaysParseAsBig: !1,
                useNativeBigInt: !1,
                protoAction: "error",
                constructorAction: "error"
            };
            if (A !== void 0 && A !== null) {
                if (A.strict === !0) q.strict = !0;
                if (A.storeAsString === !0) q.storeAsString = !0;
                if (q.alwaysParseAsBig = A.alwaysParseAsBig === !0 ? A.alwaysParseAsBig : !1, q.useNativeBigInt = A.useNativeBigInt === !0 ? A.useNativeBigInt : !1, typeof A.constructorAction < "u")
                    if (A.constructorAction === "error" || A.constructorAction === "ignore" || A.constructorAction === "preserve") q.constructorAction = A.constructorAction;
                    else throw Error(`Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ${A.constructorAction}`);
                if (typeof A.protoAction < "u")
                    if (A.protoAction === "error" || A.protoAction === "ignore" || A.protoAction === "preserve") q.protoAction = A.protoAction;
                    else throw Error(`Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ${A.protoAction}`)
            }
            var K, Y, z = {
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
                _, w = function(P) {
                    throw {
                        name: "SyntaxError",
                        message: P,
                        at: K,
                        text: _
                    }
                },
                O = function(P) {
                    if (P && P !== Y) w("Expected '" + P + "' instead of '" + Y + "'");
                    return Y = _.charAt(K), K += 1, Y
                },
                $ = function() {
                    var P, W = "";
                    if (Y === "-") W = "-", O("-");
                    while (Y >= "0" && Y <= "9") W += Y, O();
                    if (Y === ".") {
                        W += ".";
                        while (O() && Y >= "0" && Y <= "9") W += Y
                    }
                    if (Y === "e" || Y === "E") {
                        if (W += Y, O(), Y === "-" || Y === "+") W += Y, O();
                        while (Y >= "0" && Y <= "9") W += Y, O()
                    }
                    if (P = +W, !isFinite(P)) w("Bad number");
                    else {
                        if (dM1 == null) dM1 = dZ8();
                        if (W.length > 15) return q.storeAsString ? W : q.useNativeBigInt ? BigInt(W) : new dM1(W);
                        else return !q.alwaysParseAsBig ? P : q.useNativeBigInt ? BigInt(P) : new dM1(P)
                    }
                },
                H = function() {
                    var P, W, Z = "",
                        G;
                    if (Y === '"') {
                        var f = K;
                        while (O()) {
                            if (Y === '"') {
                                if (K - 1 > f) Z += _.substring(f, K - 1);
                                return O(), Z
                            }
                            if (Y === "\\") {
                                if (K - 1 > f) Z += _.substring(f, K - 1);
                                if (O(), Y === "u") {
                                    G = 0;
                                    for (W = 0; W < 4; W += 1) {
                                        if (P = parseInt(O(), 16), !isFinite(P)) break;
                                        G = G * 16 + P
                                    }
                                    Z += String.fromCharCode(G)
                                } else if (typeof z[Y] === "string") Z += z[Y];
                                else break;
                                f = K
                            }
                        }
                    }
                    w("Bad string")
                },
                j = function() {
                    while (Y && Y <= " ") O()
                },
                J = function() {
                    switch (Y) {
                        case "t":
                            return O("t"), O("r"), O("u"), O("e"), !0;
                        case "f":
                            return O("f"), O("a"), O("l"), O("s"), O("e"), !1;
                        case "n":
                            return O("n"), O("u"), O("l"), O("l"), null
                    }
                    w("Unexpected '" + Y + "'")
                },
                M, D = function() {
                    var P = [];
                    if (Y === "[") {
                        if (O("["), j(), Y === "]") return O("]"), P;
                        while (Y) {
                            if (P.push(M()), j(), Y === "]") return O("]"), P;
                            O(","), j()
                        }
                    }
                    w("Bad array")
                },
                X = function() {
                    var P, W = Object.create(null);
                    if (Y === "{") {
                        if (O("{"), j(), Y === "}") return O("}"), W;
                        while (Y) {
                            if (P = H(), j(), O(":"), q.strict === !0 && Object.hasOwnProperty.call(W, P)) w('Duplicate key "' + P + '"');
                            if (u09.test(P) === !0)
                                if (q.protoAction === "error") w("Object contains forbidden prototype property");
                                else if (q.protoAction === "ignore") M();
                            else W[P] = M();
                            else if (m09.test(P) === !0)
                                if (q.constructorAction === "error") w("Object contains forbidden constructor property");
                                else if (q.constructorAction === "ignore") M();
                            else W[P] = M();
                            else W[P] = M();
                            if (j(), Y === "}") return O("}"), W;
                            O(","), j()
                        }
                    }
                    w("Bad object")
                };
            return M = function() {
                    switch (j(), Y) {
                        case "{":
                            return X();
                        case "[":
                            return D();
                        case '"':
                            return H();
                        case "-":
                            return $();
                        default:
                            return Y >= "0" && Y <= "9" ? $() : J()
                    }
                },
                function(P, W) {
                    var Z;
                    if (_ = P + "", K = 0, Y = " ", Z = M(), j(), Y) w("Syntax error");
                    return typeof W === "function" ? function G(f, v) {
                        var N, V, L = f[v];
                        if (L && typeof L === "object") Object.keys(L).forEach(function(h) {
                            if (V = G(L, h), V !== void 0) L[h] = V;
                            else delete L[h]
                        });
                        return W.call(f, v, L)
                    }({
                        "": Z
                    }, "") : Z
                }
        };
    Ys7.exports = B09
})
// @from(Ln 209912, Col 4)
Os7 = x((mS2, cM1) => {
    var _s7 = Ks7().stringify,
        ws7 = zs7();
    cM1.exports = function(A) {
        return {
            parse: ws7(A),
            stringify: _s7
        }
    };
    cM1.exports.parse = ws7();
    cM1.exports.stringify = _s7
})
// @from(Ln 209924, Col 4)
cZ8 = x((Xs7) => {
    Object.defineProperty(Xs7, "__esModule", {
        value: !0
    });
    Xs7.GCE_LINUX_BIOS_PATHS = void 0;
    Xs7.isGoogleCloudServerless = js7;
    Xs7.isGoogleComputeEngineLinux = Js7;
    Xs7.isGoogleComputeEngineMACAddress = Ms7;
    Xs7.isGoogleComputeEngine = Ds7;
    Xs7.detectGCPResidency = F09;
    var $s7 = x6("fs"),
        Hs7 = x6("os");
    Xs7.GCE_LINUX_BIOS_PATHS = {
        BIOS_DATE: "/sys/class/dmi/id/bios_date",
        BIOS_VENDOR: "/sys/class/dmi/id/bios_vendor"
    };
    var g09 = /^42:01/;

    function js7() {
        return !!(process.env.CLOUD_RUN_JOB || process.env.FUNCTION_NAME || process.env.K_SERVICE)
    }

    function Js7() {
        if ((0, Hs7.platform)() !== "linux") return !1;
        try {
            (0, $s7.statSync)(Xs7.GCE_LINUX_BIOS_PATHS.BIOS_DATE);
            let A = (0, $s7.readFileSync)(Xs7.GCE_LINUX_BIOS_PATHS.BIOS_VENDOR, "utf8");
            return /Google/.test(A)
        } catch (A) {
            return !1
        }
    }

    function Ms7() {
        let A = (0, Hs7.networkInterfaces)();
        for (let q of Object.values(A)) {
            if (!q) continue;
            for (let {
                    mac: K
                }
                of q)
                if (g09.test(K)) return !0
        }
        return !1
    }

    function Ds7() {
        return Js7() || Ms7()
    }

    function F09() {
        return js7() || Ds7()
    }
})
// @from(Ln 209978, Col 4)
Zs7 = x((Ps7) => {
    Object.defineProperty(Ps7, "__esModule", {
        value: !0
    });
    Ps7.Colours = void 0;
    class l3 {
        static isEnabled(A) {
            return A.isTTY && (typeof A.getColorDepth === "function" ? A.getColorDepth() > 2 : !0)
        }
        static refresh() {
            if (l3.enabled = l3.isEnabled(process.stderr), !this.enabled) l3.reset = "", l3.bright = "", l3.dim = "", l3.red = "", l3.green = "", l3.yellow = "", l3.blue = "", l3.magenta = "", l3.cyan = "", l3.white = "", l3.grey = "";
            else l3.reset = "\x1B[0m", l3.bright = "\x1B[1m", l3.dim = "\x1B[2m", l3.red = "\x1B[31m", l3.green = "\x1B[32m", l3.yellow = "\x1B[33m", l3.blue = "\x1B[34m", l3.magenta = "\x1B[35m", l3.cyan = "\x1B[36m", l3.white = "\x1B[37m", l3.grey = "\x1B[90m"
        }
    }
    Ps7.Colours = l3;
    l3.enabled = !1;
    l3.reset = "";
    l3.bright = "";
    l3.dim = "";
    l3.red = "";
    l3.green = "";
    l3.yellow = "";
    l3.blue = "";
    l3.magenta = "";
    l3.cyan = "";
    l3.white = "";
    l3.grey = "";
    l3.refresh()
})
// @from(Ln 210007, Col 4)
Vs7 = x((X2) => {
    var l09 = X2 && X2.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            var z = Object.getOwnPropertyDescriptor(q, K);
            if (!z || ("get" in z ? !q.__esModule : z.writable || z.configurable)) z = {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            };
            Object.defineProperty(A, Y, z)
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        i09 = X2 && X2.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        Gs7 = X2 && X2.__importStar || function(A) {
            if (A && A.__esModule) return A;
            var q = {};
            if (A != null) {
                for (var K in A)
                    if (K !== "default" && Object.prototype.hasOwnProperty.call(A, K)) l09(q, A, K)
            }
            return i09(q, A), q
        };
    Object.defineProperty(X2, "__esModule", {
        value: !0
    });
    X2.env = X2.DebugLogBackendBase = X2.placeholder = X2.AdhocDebugLogger = X2.LogSeverity = void 0;
    X2.getNodeBackend = lZ8;
    X2.getDebugBackend = r09;
    X2.getStructuredBackend = o09;
    X2.setBackend = a09;
    X2.log = Ns7;
    var n09 = x6("node:events"),
        xg6 = Gs7(x6("node:process")),
        fs7 = Gs7(x6("node:util")),
        yk = Zs7(),
        wI;
    (function(A) {
        A.DEFAULT = "DEFAULT", A.DEBUG = "DEBUG", A.INFO = "INFO", A.WARNING = "WARNING", A.ERROR = "ERROR"
    })(wI || (X2.LogSeverity = wI = {}));
    class iM1 extends n09.EventEmitter {
        constructor(A, q) {
            super();
            this.namespace = A, this.upstream = q, this.func = Object.assign(this.invoke.bind(this), {
                instance: this,
                on: (K, Y) => this.on(K, Y)
            }), this.func.debug = (...K) => this.invokeSeverity(wI.DEBUG, ...K), this.func.info = (...K) => this.invokeSeverity(wI.INFO, ...K), this.func.warn = (...K) => this.invokeSeverity(wI.WARNING, ...K), this.func.error = (...K) => this.invokeSeverity(wI.ERROR, ...K), this.func.sublog = (K) => Ns7(K, this.func)
        }
        invoke(A, ...q) {
            if (this.upstream) this.upstream(A, ...q);
            this.emit("log", A, q)
        }
        invokeSeverity(A, ...q) {
            this.invoke({
                severity: A
            }, ...q)
        }
    }
    X2.AdhocDebugLogger = iM1;
    X2.placeholder = new iM1("", () => {}).func;
    class ug6 {
        constructor() {
            var A;
            this.cached = new Map, this.filters = [], this.filtersSet = !1;
            let q = (A = xg6.env[X2.env.nodeEnables]) !== null && A !== void 0 ? A : "*";
            if (q === "all") q = "*";
            this.filters = q.split(",")
        }
        log(A, q, ...K) {
            try {
                if (!this.filtersSet) this.setFilters(), this.filtersSet = !0;
                let Y = this.cached.get(A);
                if (!Y) Y = this.makeLogger(A), this.cached.set(A, Y);
                Y(q, ...K)
            } catch (Y) {
                console.error(Y)
            }
        }
    }
    X2.DebugLogBackendBase = ug6;
    class nZ8 extends ug6 {
        constructor() {
            super(...arguments);
            this.enabledRegexp = /.*/g
        }
        isEnabled(A) {
            return this.enabledRegexp.test(A)
        }
        makeLogger(A) {
            if (!this.enabledRegexp.test(A)) return () => {};
            return (q, ...K) => {
                var Y;
                let z = `${yk.Colours.green}${A}${yk.Colours.reset}`,
                    _ = `${yk.Colours.yellow}${xg6.pid}${yk.Colours.reset}`,
                    w;
                switch (q.severity) {
                    case wI.ERROR:
                        w = `${yk.Colours.red}${q.severity}${yk.Colours.reset}`;
                        break;
                    case wI.INFO:
                        w = `${yk.Colours.magenta}${q.severity}${yk.Colours.reset}`;
                        break;
                    case wI.WARNING:
                        w = `${yk.Colours.yellow}${q.severity}${yk.Colours.reset}`;
                        break;
                    default:
                        w = (Y = q.severity) !== null && Y !== void 0 ? Y : wI.DEFAULT;
                        break
                }
                let O = fs7.formatWithOptions({
                        colors: yk.Colours.enabled
                    }, ...K),
                    $ = Object.assign({}, q);
                delete $.severity;
                let H = Object.getOwnPropertyNames($).length ? JSON.stringify($) : "",
                    j = H ? `${yk.Colours.grey}${H}${yk.Colours.reset}` : "";
                console.error("%s [%s|%s] %s%s", _, z, w, O, H ? ` ${j}` : "")
            }
        }
        setFilters() {
            let q = this.filters.join(",").replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^");
            this.enabledRegexp = new RegExp(`^${q}$`, "i")
        }
    }

    function lZ8() {
        return new nZ8
    }
    class Ts7 extends ug6 {
        constructor(A) {
            super();
            this.debugPkg = A
        }
        makeLogger(A) {
            let q = this.debugPkg(A);
            return (K, ...Y) => {
                q(Y[0], ...Y.slice(1))
            }
        }
        setFilters() {
            var A;
            let q = (A = xg6.env.NODE_DEBUG) !== null && A !== void 0 ? A : "";
            xg6.env.NODE_DEBUG = `${q}${q?",":""}${this.filters.join(",")}`
        }
    }

    function r09(A) {
        return new Ts7(A)
    }
    class vs7 extends ug6 {
        constructor(A) {
            var q;
            super();
            this.upstream = (q = A) !== null && q !== void 0 ? q : new nZ8
        }
        makeLogger(A) {
            let q = this.upstream.makeLogger(A);
            return (K, ...Y) => {
                var z;
                let _ = (z = K.severity) !== null && z !== void 0 ? z : wI.INFO,
                    w = Object.assign({
                        severity: _,
                        message: fs7.format(...Y)
                    }, K),
                    O = JSON.stringify(w);
                q(K, O)
            }
        }
        setFilters() {
            this.upstream.setFilters()
        }
    }

    function o09(A) {
        return new vs7(A)
    }
    X2.env = {
        nodeEnables: "GOOGLE_SDK_NODE_LOGGING"
    };
    var iZ8 = new Map,
        qR = void 0;

    function a09(A) {
        qR = A, iZ8.clear()
    }

    function Ns7(A, q) {
        if (!xg6.env[X2.env.nodeEnables]) return X2.placeholder;
        if (!A) return X2.placeholder;
        if (q) A = `${q.instance.namespace}:${A}`;
        let Y = iZ8.get(A);
        if (Y) return Y.func;
        if (qR === null) return X2.placeholder;
        else if (qR === void 0) qR = lZ8();
        let z = (() => {
            let _ = void 0;
            return new iM1(A, (O, ...$) => {
                if (_ !== qR) {
                    if (qR === null) return;
                    else if (qR === void 0) qR = lZ8();
                    _ = qR
                }
                qR === null || qR === void 0 || qR.log(A, O, ...$)
            })
        })();
        return iZ8.set(A, z), z.func
    }
})
// @from(Ln 210224, Col 4)
ks7 = x((e56) => {
    var s09 = e56 && e56.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            var z = Object.getOwnPropertyDescriptor(q, K);
            if (!z || ("get" in z ? !q.__esModule : z.writable || z.configurable)) z = {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            };
            Object.defineProperty(A, Y, z)
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        t09 = e56 && e56.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) s09(q, A, K)
        };
    Object.defineProperty(e56, "__esModule", {
        value: !0
    });
    t09(Vs7(), e56)
})
// @from(Ln 210248, Col 4)
Bg6 = x((xK) => {
    var e09 = xK && xK.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            var z = Object.getOwnPropertyDescriptor(q, K);
            if (!z || ("get" in z ? !q.__esModule : z.writable || z.configurable)) z = {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            };
            Object.defineProperty(A, Y, z)
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        AW9 = xK && xK.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) e09(q, A, K)
        };
    Object.defineProperty(xK, "__esModule", {
        value: !0
    });
    xK.gcpResidencyCache = xK.METADATA_SERVER_DETECTION = xK.HEADERS = xK.HEADER_VALUE = xK.HEADER_NAME = xK.SECONDARY_HOST_ADDRESS = xK.HOST_ADDRESS = xK.BASE_PATH = void 0;
    xK.instance = wW9;
    xK.project = OW9;
    xK.universe = $W9;
    xK.bulk = HW9;
    xK.isAvailable = JW9;
    xK.resetIsAvailableCache = MW9;
    xK.getGCPResidency = aZ8;
    xK.setGCPResidency = ys7;
    xK.requestTimeout = Ls7;
    var rZ8 = _I(),
        qW9 = Os7(),
        KW9 = cZ8(),
        YW9 = ks7();
    xK.BASE_PATH = "/computeMetadata/v1";
    xK.HOST_ADDRESS = "http://169.254.169.254";
    xK.SECONDARY_HOST_ADDRESS = "http://metadata.google.internal.";
    xK.HEADER_NAME = "Metadata-Flavor";
    xK.HEADER_VALUE = "Google";
    xK.HEADERS = Object.freeze({
        [xK.HEADER_NAME]: xK.HEADER_VALUE
    });
    var Es7 = YW9.log("gcp metadata");
    xK.METADATA_SERVER_DETECTION = Object.freeze({
        "assume-present": "don't try to ping the metadata server, but assume it's present",
        none: "don't try to ping the metadata server, but don't try to use it either",
        "bios-only": "treat the result of a BIOS probe as canonical (don't fall back to pinging)",
        "ping-only": "skip the BIOS probe, and go straight to pinging"
    });

    function oZ8(A) {
        if (!A) A = process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST || xK.HOST_ADDRESS;
        if (!/^https?:\/\//.test(A)) A = `http://${A}`;
        return new URL(xK.BASE_PATH, A).href
    }

    function zW9(A) {
        Object.keys(A).forEach((q) => {
            switch (q) {
                case "params":
                case "property":
                case "headers":
                    break;
                case "qs":
                    throw Error("'qs' is not a valid configuration option. Please use 'params' instead.");
                default:
                    throw Error(`'${q}' is not a valid configuration option.`)
            }
        })
    }
    async function mg6(A, q = {}, K = 3, Y = !1) {
        let z = "",
            _ = {},
            w = {};
        if (typeof A === "object") {
            let j = A;
            z = j.metadataKey, _ = j.params || _, w = j.headers || w, K = j.noResponseRetries || K, Y = j.fastFail || Y
        } else z = A;
        if (typeof q === "string") z += `/${q}`;
        else {
            if (zW9(q), q.property) z += `/${q.property}`;
            w = q.headers || w, _ = q.params || _
        }
        let O = Y ? _W9 : rZ8.request,
            $ = {
                url: `${oZ8()}/${z}`,
                headers: {
                    ...xK.HEADERS,
                    ...w
                },
                retryConfig: {
                    noResponseRetries: K
                },
                params: _,
                responseType: "text",
                timeout: Ls7()
            };
        Es7.info("instance request %j", $);
        let H = await O($);
        if (Es7.info("instance metadata is %s", H.data), H.headers[xK.HEADER_NAME.toLowerCase()] !== xK.HEADER_VALUE) throw Error(`Invalid response from metadata service: incorrect ${xK.HEADER_NAME} header. Expected '${xK.HEADER_VALUE}', got ${H.headers[xK.HEADER_NAME.toLowerCase()]?`'${H.headers[xK.HEADER_NAME.toLowerCase()]}'`:"no header"}`);
        if (typeof H.data === "string") try {
            return qW9.parse(H.data)
        } catch (j) {}
        return H.data
    }
    async function _W9(A) {
        var q;
        let K = {
                ...A,
                url: (q = A.url) === null || q === void 0 ? void 0 : q.toString().replace(oZ8(), oZ8(xK.SECONDARY_HOST_ADDRESS))
            },
            Y = !1,
            z = (0, rZ8.request)(A).then((w) => {
                return Y = !0, w
            }).catch((w) => {
                if (Y) return _;
                else throw Y = !0, w
            }),
            _ = (0, rZ8.request)(K).then((w) => {
                return Y = !0, w
            }).catch((w) => {
                if (Y) return z;
                else throw Y = !0, w
            });
        return Promise.race([z, _])
    }

    function wW9(A) {
        return mg6("instance", A)
    }

    function OW9(A) {
        return mg6("project", A)
    }

    function $W9(A) {
        return mg6("universe", A)
    }
    async function HW9(A) {
        let q = {};
        return await Promise.all(A.map((K) => {
            return (async () => {
                let Y = await mg6(K),
                    z = K.metadataKey;
                q[z] = Y
            })()
        })), q
    }

    function jW9() {
        return process.env.DETECT_GCP_RETRIES ? Number(process.env.DETECT_GCP_RETRIES) : 0
    }
    var nM1;
    async function JW9() {
        if (process.env.METADATA_SERVER_DETECTION) {
            let A = process.env.METADATA_SERVER_DETECTION.trim().toLocaleLowerCase();
            if (!(A in xK.METADATA_SERVER_DETECTION)) throw RangeError(`Unknown \`METADATA_SERVER_DETECTION\` env variable. Got \`${A}\`, but it should be \`${Object.keys(xK.METADATA_SERVER_DETECTION).join("`, `")}\`, or unset`);
            switch (A) {
                case "assume-present":
                    return !0;
                case "none":
                    return !1;
                case "bios-only":
                    return aZ8();
                case "ping-only":
            }
        }
        try {
            if (nM1 === void 0) nM1 = mg6("instance", void 0, jW9(), !(process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST));
            return await nM1, !0
        } catch (A) {
            let q = A;
            if (process.env.DEBUG_AUTH) console.info(q);
            if (q.type === "request-timeout") return !1;
            if (q.response && q.response.status === 404) return !1;
            else {
                if (!(q.response && q.response.status === 404) && (!q.code || !["EHOSTDOWN", "EHOSTUNREACH", "ENETUNREACH", "ENOENT", "ENOTFOUND", "ECONNREFUSED"].includes(q.code))) {
                    let K = "UNKNOWN";
                    if (q.code) K = q.code;
                    process.emitWarning(`received unexpected error = ${q.message} code = ${K}`, "MetadataLookupWarning")
                }
                return !1
            }
        }
    }

    function MW9() {
        nM1 = void 0
    }
    xK.gcpResidencyCache = null;

    function aZ8() {
        if (xK.gcpResidencyCache === null) ys7();
        return xK.gcpResidencyCache
    }

    function ys7(A = null) {
        xK.gcpResidencyCache = A !== null ? A : (0, KW9.detectGCPResidency)()
    }

    function Ls7() {
        return aZ8() ? 0 : 3000
    }
    AW9(cZ8(), xK)
})
// @from(Ln 210455, Col 4)
eZ8 = x((TW9) => {
    TW9.byteLength = XW9;
    TW9.toByteArray = WW9;
    TW9.fromByteArray = fW9;
    var _B = [],
        KR = [],
        DW9 = typeof Uint8Array < "u" ? Uint8Array : Array,
        sZ8 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (_t = 0, tZ8 = sZ8.length; _t < tZ8; ++_t) _B[_t] = sZ8[_t], KR[sZ8.charCodeAt(_t)] = _t;
    var _t, tZ8;
    KR[45] = 62;
    KR[95] = 63;

    function Rs7(A) {
        var q = A.length;
        if (q % 4 > 0) throw Error("Invalid string. Length must be a multiple of 4");
        var K = A.indexOf("=");
        if (K === -1) K = q;
        var Y = K === q ? 0 : 4 - K % 4;
        return [K, Y]
    }

    function XW9(A) {
        var q = Rs7(A),
            K = q[0],
            Y = q[1];
        return (K + Y) * 3 / 4 - Y
    }

    function PW9(A, q, K) {
        return (q + K) * 3 / 4 - K
    }

    function WW9(A) {
        var q, K = Rs7(A),
            Y = K[0],
            z = K[1],
            _ = new DW9(PW9(A, Y, z)),
            w = 0,
            O = z > 0 ? Y - 4 : Y,
            $;
        for ($ = 0; $ < O; $ += 4) q = KR[A.charCodeAt($)] << 18 | KR[A.charCodeAt($ + 1)] << 12 | KR[A.charCodeAt($ + 2)] << 6 | KR[A.charCodeAt($ + 3)], _[w++] = q >> 16 & 255, _[w++] = q >> 8 & 255, _[w++] = q & 255;
        if (z === 2) q = KR[A.charCodeAt($)] << 2 | KR[A.charCodeAt($ + 1)] >> 4, _[w++] = q & 255;
        if (z === 1) q = KR[A.charCodeAt($)] << 10 | KR[A.charCodeAt($ + 1)] << 4 | KR[A.charCodeAt($ + 2)] >> 2, _[w++] = q >> 8 & 255, _[w++] = q & 255;
        return _
    }

    function ZW9(A) {
        return _B[A >> 18 & 63] + _B[A >> 12 & 63] + _B[A >> 6 & 63] + _B[A & 63]
    }

    function GW9(A, q, K) {
        var Y, z = [];
        for (var _ = q; _ < K; _ += 3) Y = (A[_] << 16 & 16711680) + (A[_ + 1] << 8 & 65280) + (A[_ + 2] & 255), z.push(ZW9(Y));
        return z.join("")
    }

    function fW9(A) {
        var q, K = A.length,
            Y = K % 3,
            z = [],
            _ = 16383;
        for (var w = 0, O = K - Y; w < O; w += _) z.push(GW9(A, w, w + _ > O ? O : w + _));
        if (Y === 1) q = A[K - 1], z.push(_B[q >> 2] + _B[q << 4 & 63] + "==");
        else if (Y === 2) q = (A[K - 2] << 8) + A[K - 1], z.push(_B[q >> 10] + _B[q >> 4 & 63] + _B[q << 2 & 63] + "=");
        return z.join("")
    }
})
// @from(Ln 210523, Col 4)
Cs7 = x((hs7) => {
    Object.defineProperty(hs7, "__esModule", {
        value: !0
    });
    hs7.BrowserCrypto = void 0;
    var _06 = eZ8(),
        kW9 = w06();
    class rM1 {
        constructor() {
            if (typeof window > "u" || window.crypto === void 0 || window.crypto.subtle === void 0) throw Error("SubtleCrypto not found. Make sure it's an https:// website.")
        }
        async sha256DigestBase64(A) {
            let q = new TextEncoder().encode(A),
                K = await window.crypto.subtle.digest("SHA-256", q);
            return _06.fromByteArray(new Uint8Array(K))
        }
        randomBytesBase64(A) {
            let q = new Uint8Array(A);
            return window.crypto.getRandomValues(q), _06.fromByteArray(q)
        }
        static padBase64(A) {
            while (A.length % 4 !== 0) A += "=";
            return A
        }
        async verify(A, q, K) {
            let Y = {
                    name: "RSASSA-PKCS1-v1_5",
                    hash: {
                        name: "SHA-256"
                    }
                },
                z = new TextEncoder().encode(q),
                _ = _06.toByteArray(rM1.padBase64(K)),
                w = await window.crypto.subtle.importKey("jwk", A, Y, !0, ["verify"]);
            return await window.crypto.subtle.verify(Y, w, _, z)
        }
        async sign(A, q) {
            let K = {
                    name: "RSASSA-PKCS1-v1_5",
                    hash: {
                        name: "SHA-256"
                    }
                },
                Y = new TextEncoder().encode(q),
                z = await window.crypto.subtle.importKey("jwk", A, K, !0, ["sign"]),
                _ = await window.crypto.subtle.sign(K, z, Y);
            return _06.fromByteArray(new Uint8Array(_))
        }
        decodeBase64StringUtf8(A) {
            let q = _06.toByteArray(rM1.padBase64(A));
            return new TextDecoder().decode(q)
        }
        encodeBase64StringUtf8(A) {
            let q = new TextEncoder().encode(A);
            return _06.fromByteArray(q)
        }
        async sha256DigestHex(A) {
            let q = new TextEncoder().encode(A),
                K = await window.crypto.subtle.digest("SHA-256", q);
            return (0, kW9.fromArrayBufferToHex)(K)
        }
        async signWithHmacSha256(A, q) {
            let K = typeof A === "string" ? A : String.fromCharCode(...new Uint16Array(A)),
                Y = new TextEncoder,
                z = await window.crypto.subtle.importKey("raw", Y.encode(K), {
                    name: "HMAC",
                    hash: {
                        name: "SHA-256"
                    }
                }, !1, ["sign"]);
            return window.crypto.subtle.sign("HMAC", z, Y.encode(q))
        }
    }
    hs7.BrowserCrypto = rM1
})
// @from(Ln 210598, Col 4)
us7 = x((bs7) => {
    Object.defineProperty(bs7, "__esModule", {
        value: !0
    });
    bs7.NodeCrypto = void 0;
    var O06 = x6("crypto");
    class Is7 {
        async sha256DigestBase64(A) {
            return O06.createHash("sha256").update(A).digest("base64")
        }
        randomBytesBase64(A) {
            return O06.randomBytes(A).toString("base64")
        }
        async verify(A, q, K) {
            let Y = O06.createVerify("RSA-SHA256");
            return Y.update(q), Y.end(), Y.verify(A, K, "base64")
        }
        async sign(A, q) {
            let K = O06.createSign("RSA-SHA256");
            return K.update(q), K.end(), K.sign(A, "base64")
        }
        decodeBase64StringUtf8(A) {
            return Buffer.from(A, "base64").toString("utf-8")
        }
        encodeBase64StringUtf8(A) {
            return Buffer.from(A, "utf-8").toString("base64")
        }
        async sha256DigestHex(A) {
            return O06.createHash("sha256").update(A).digest("hex")
        }
        async signWithHmacSha256(A, q) {
            let K = typeof A === "string" ? A : yW9(A);
            return EW9(O06.createHmac("sha256", K).update(q).digest())
        }
    }
    bs7.NodeCrypto = Is7;

    function EW9(A) {
        return A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength)
    }

    function yW9(A) {
        return Buffer.from(A)
    }
})
// @from(Ln 210643, Col 4)
w06 = x((Bs7) => {
    Object.defineProperty(Bs7, "__esModule", {
        value: !0
    });
    Bs7.createCrypto = hW9;
    Bs7.hasBrowserCrypto = ms7;
    Bs7.fromArrayBufferToHex = SW9;
    var LW9 = Cs7(),
        RW9 = us7();

    function hW9() {
        if (ms7()) return new LW9.BrowserCrypto;
        return new RW9.NodeCrypto
    }

    function ms7() {
        return typeof window < "u" && typeof window.crypto < "u" && typeof window.crypto.subtle < "u"
    }

    function SW9(A) {
        return Array.from(new Uint8Array(A)).map((K) => {
            return K.toString(16).padStart(2, "0")
        }).join("")
    }
})
// @from(Ln 210668, Col 4)
Fs7 = x((gs7) => {
    Object.defineProperty(gs7, "__esModule", {
        value: !0
    });
    gs7.validate = xW9;

    function xW9(A) {
        let q = [{
            invalid: "uri",
            expected: "url"
        }, {
            invalid: "json",
            expected: "data"
        }, {
            invalid: "qs",
            expected: "params"
        }];
        for (let K of q)
            if (A[K.invalid]) {
                let Y = `'${K.invalid}' is not a valid configuration option. Please use '${K.expected}' instead. This library is using Axios for requests. Please see https://github.com/axios/axios to learn more about the valid request options.`;
                throw Error(Y)
            }
    }
})
// @from(Ln 210692, Col 4)
AG8 = x((nS2, mW9) => {
    mW9.exports = {
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
// @from(Ln 210779, Col 4)
Fg6 = x((Qs7) => {
    Object.defineProperty(Qs7, "__esModule", {
        value: !0
    });
    Qs7.DefaultTransporter = void 0;
    var BW9 = _I(),
        gW9 = Fs7(),
        FW9 = AG8(),
        ps7 = "google-api-nodejs-client";
    class gg6 {
        constructor() {
            this.instance = new BW9.Gaxios
        }
        configure(A = {}) {
            if (A.headers = A.headers || {}, typeof window > "u") {
                let q = A.headers["User-Agent"];
                if (!q) A.headers["User-Agent"] = gg6.USER_AGENT;
                else if (!q.includes(`${ps7}/`)) A.headers["User-Agent"] = `${q} ${gg6.USER_AGENT}`;
                if (!A.headers["x-goog-api-client"]) {
                    let K = process.version.replace(/^v/, "");
                    A.headers["x-goog-api-client"] = `gl-node/${K}`
                }
            }
            return A
        }
        request(A) {
            return A = this.configure(A), (0, gW9.validate)(A), this.instance.request(A).catch((q) => {
                throw this.processError(q)
            })
        }
        get defaults() {
            return this.instance.defaults
        }
        set defaults(A) {
            this.instance.defaults = A
        }
        processError(A) {
            let q = A.response,
                K = A,
                Y = q ? q.data : null;
            if (q && Y && Y.error && q.status !== 200)
                if (typeof Y.error === "string") K.message = Y.error, K.status = q.status;
                else if (Array.isArray(Y.error.errors)) K.message = Y.error.errors.map((z) => z.message).join(`
`), K.code = Y.error.code, K.errors = Y.error.errors;
            else K.message = Y.error.message, K.code = Y.error.code;
            else if (q && q.status >= 400) K.message = Y, K.status = q.status;
            return K
        }
    }
    Qs7.DefaultTransporter = gg6;
    gg6.USER_AGENT = `${ps7}/${FW9.version}`
})
// @from(Ln 210831, Col 4)
Ot = x((wt) => {
    var OI = wt && wt.__classPrivateFieldGet || function(A, q, K, Y) {
            if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
            if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
        },
        $06, Td, qG8, KG8;
    Object.defineProperty(wt, "__esModule", {
        value: !0
    });
    wt.LRUCache = void 0;
    wt.snakeToCamel = ds7;
    wt.originalOrCamelOptions = pW9;

    function ds7(A) {
        return A.replace(/([_][^_])/g, (q) => q.slice(1).toUpperCase())
    }

    function pW9(A) {
        function q(K) {
            var Y;
            let z = A || {};
            return (Y = z[K]) !== null && Y !== void 0 ? Y : z[ds7(K)]
        }
        return {
            get: q
        }
    }
    class cs7 {
        constructor(A) {
            $06.add(this), Td.set(this, new Map), this.capacity = A.capacity, this.maxAge = A.maxAge
        }
        set(A, q) {
            OI(this, $06, "m", qG8).call(this, A, q), OI(this, $06, "m", KG8).call(this)
        }
        get(A) {
            let q = OI(this, Td, "f").get(A);
            if (!q) return;
            return OI(this, $06, "m", qG8).call(this, A, q.value), OI(this, $06, "m", KG8).call(this), q.value
        }
    }
    wt.LRUCache = cs7;
    Td = new WeakMap, $06 = new WeakSet, qG8 = function(q, K) {
        OI(this, Td, "f").delete(q), OI(this, Td, "f").set(q, {
            value: K,
            lastAccessed: Date.now()
        })
    }, KG8 = function() {
        let q = this.maxAge ? Date.now() - this.maxAge : 0,
            K = OI(this, Td, "f").entries().next();
        while (!K.done && (OI(this, Td, "f").size > this.capacity || K.value[1].lastAccessed < q)) OI(this, Td, "f").delete(K.value[0]), K = OI(this, Td, "f").entries().next()
    }
})
// @from(Ln 210884, Col 4)
wB = x((rs7) => {
    Object.defineProperty(rs7, "__esModule", {
        value: !0
    });
    rs7.AuthClient = rs7.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = rs7.DEFAULT_UNIVERSE = void 0;
    var QW9 = x6("events"),
        ls7 = _I(),
        is7 = Fg6(),
        UW9 = Ot();
    rs7.DEFAULT_UNIVERSE = "googleapis.com";
    rs7.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = 300000;
    class ns7 extends QW9.EventEmitter {
        constructor(A = {}) {
            var q, K, Y, z, _;
            super();
            this.credentials = {}, this.eagerRefreshThresholdMillis = rs7.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS, this.forceRefreshOnFailure = !1, this.universeDomain = rs7.DEFAULT_UNIVERSE;
            let w = (0, UW9.originalOrCamelOptions)(A);
            if (this.apiKey = A.apiKey, this.projectId = (q = w.get("project_id")) !== null && q !== void 0 ? q : null, this.quotaProjectId = w.get("quota_project_id"), this.credentials = (K = w.get("credentials")) !== null && K !== void 0 ? K : {}, this.universeDomain = (Y = w.get("universe_domain")) !== null && Y !== void 0 ? Y : rs7.DEFAULT_UNIVERSE, this.transporter = (z = A.transporter) !== null && z !== void 0 ? z : new is7.DefaultTransporter, A.transporterOptions) this.transporter.defaults = A.transporterOptions;
            if (A.eagerRefreshThresholdMillis) this.eagerRefreshThresholdMillis = A.eagerRefreshThresholdMillis;
            this.forceRefreshOnFailure = (_ = A.forceRefreshOnFailure) !== null && _ !== void 0 ? _ : !1
        }
        get gaxios() {
            if (this.transporter instanceof ls7.Gaxios) return this.transporter;
            else if (this.transporter instanceof is7.DefaultTransporter) return this.transporter.instance;
            else if ("instance" in this.transporter && this.transporter.instance instanceof ls7.Gaxios) return this.transporter.instance;
            return null
        }
        setCredentials(A) {
            this.credentials = A
        }
        addSharedMetadataHeaders(A) {
            if (!A["x-goog-user-project"] && this.quotaProjectId) A["x-goog-user-project"] = this.quotaProjectId;
            return A
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
    rs7.AuthClient = ns7
})
// @from(Ln 210929, Col 4)
zG8 = x((ts7) => {
    Object.defineProperty(ts7, "__esModule", {
        value: !0
    });
    ts7.LoginTicket = void 0;
    class ss7 {
        constructor(A, q) {
            this.envelope = A, this.payload = q
        }
        getEnvelope() {
            return this.envelope
        }
        getPayload() {
            return this.payload
        }
        getUserId() {
            let A = this.getPayload();
            if (A && A.sub) return A.sub;
            return null
        }
        getAttributes() {
            return {
                envelope: this.getEnvelope(),
                payload: this.getPayload()
            }
        }
    }
    ts7.LoginTicket = ss7
})