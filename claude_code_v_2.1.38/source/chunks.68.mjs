
// @from(Ln 183632, Col 4)
c2A = R((bW7, Wz6) => {
    (function(A) {
        var q, K = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
            Y = Math.ceil,
            z = Math.floor,
            w = "[BigNumber Error] ",
            H = w + "Number primitive has more than 15 significant digits: ",
            $ = 100000000000000,
            O = 14,
            _ = 9007199254740991,
            J = [1, 10, 100, 1000, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 10000000000, 100000000000, 1000000000000, 10000000000000],
            X = 1e7,
            D = 1e9;

        function j(T) {
            var k, y, B, S = q1.prototype = {
                    constructor: q1,
                    toString: null,
                    valueOf: null
                },
                m = new q1(1),
                b = 20,
                g = 4,
                U = -7,
                x = 21,
                p = -1e7,
                l = 1e7,
                r = !1,
                s = 1,
                O1 = 0,
                T1 = {
                    prefix: "",
                    groupSize: 3,
                    secondaryGroupSize: 0,
                    groupSeparator: ",",
                    decimalSeparator: ".",
                    fractionGroupSize: 0,
                    fractionGroupSeparator: " ",
                    suffix: ""
                },
                N1 = "0123456789abcdefghijklmnopqrstuvwxyz",
                j1 = !0;

            function q1(a, A1) {
                var M1, z1, Y1, _1, $1, G1, L1, x1, f1 = this;
                if (!(f1 instanceof q1)) return new q1(a, A1);
                if (A1 == null) {
                    if (a && a._isBigNumber === !0) {
                        if (f1.s = a.s, !a.c || a.e > l) f1.c = f1.e = null;
                        else if (a.e < p) f1.c = [f1.e = 0];
                        else f1.e = a.e, f1.c = a.c.slice();
                        return
                    }
                    if ((G1 = typeof a == "number") && a * 0 == 0) {
                        if (f1.s = 1 / a < 0 ? (a = -a, -1) : 1, a === ~~a) {
                            for (_1 = 0, $1 = a; $1 >= 10; $1 /= 10, _1++);
                            if (_1 > l) f1.c = f1.e = null;
                            else f1.e = _1, f1.c = [a];
                            return
                        }
                        x1 = String(a)
                    } else {
                        if (!K.test(x1 = String(a))) return B(f1, x1, G1);
                        f1.s = x1.charCodeAt(0) == 45 ? (x1 = x1.slice(1), -1) : 1
                    }
                    if ((_1 = x1.indexOf(".")) > -1) x1 = x1.replace(".", "");
                    if (($1 = x1.search(/e/i)) > 0) {
                        if (_1 < 0) _1 = $1;
                        _1 += +x1.slice($1 + 1), x1 = x1.substring(0, $1)
                    } else if (_1 < 0) _1 = x1.length
                } else {
                    if (G(A1, 2, N1.length, "Base"), A1 == 10 && j1) return f1 = new q1(a), Z1(f1, b + f1.e + 1, g);
                    if (x1 = String(a), G1 = typeof a == "number") {
                        if (a * 0 != 0) return B(f1, x1, G1, A1);
                        if (f1.s = 1 / a < 0 ? (x1 = x1.slice(1), -1) : 1, q1.DEBUG && x1.replace(/^0\.0*|\./, "").length > 15) throw Error(H + a)
                    } else f1.s = x1.charCodeAt(0) === 45 ? (x1 = x1.slice(1), -1) : 1;
                    M1 = N1.slice(0, A1), _1 = $1 = 0;
                    for (L1 = x1.length; $1 < L1; $1++)
                        if (M1.indexOf(z1 = x1.charAt($1)) < 0) {
                            if (z1 == ".") {
                                if ($1 > _1) {
                                    _1 = L1;
                                    continue
                                }
                            } else if (!Y1) {
                                if (x1 == x1.toUpperCase() && (x1 = x1.toLowerCase()) || x1 == x1.toLowerCase() && (x1 = x1.toUpperCase())) {
                                    Y1 = !0, $1 = -1, _1 = 0;
                                    continue
                                }
                            }
                            return B(f1, String(a), G1, A1)
                        } if (G1 = !1, x1 = y(x1, A1, 10, f1.s), (_1 = x1.indexOf(".")) > -1) x1 = x1.replace(".", "");
                    else _1 = x1.length
                }
                for ($1 = 0; x1.charCodeAt($1) === 48; $1++);
                for (L1 = x1.length; x1.charCodeAt(--L1) === 48;);
                if (x1 = x1.slice($1, ++L1)) {
                    if (L1 -= $1, G1 && q1.DEBUG && L1 > 15 && (a > _ || a !== z(a))) throw Error(H + f1.s * a);
                    if ((_1 = _1 - $1 - 1) > l) f1.c = f1.e = null;
                    else if (_1 < p) f1.c = [f1.e = 0];
                    else {
                        if (f1.e = _1, f1.c = [], $1 = (_1 + 1) % O, _1 < 0) $1 += O;
                        if ($1 < L1) {
                            if ($1) f1.c.push(+x1.slice(0, $1));
                            for (L1 -= O; $1 < L1;) f1.c.push(+x1.slice($1, $1 += O));
                            $1 = O - (x1 = x1.slice($1)).length
                        } else $1 -= L1;
                        for (; $1--; x1 += "0");
                        f1.c.push(+x1)
                    }
                } else f1.c = [f1.e = 0]
            }
            q1.clone = j, q1.ROUND_UP = 0, q1.ROUND_DOWN = 1, q1.ROUND_CEIL = 2, q1.ROUND_FLOOR = 3, q1.ROUND_HALF_UP = 4, q1.ROUND_HALF_DOWN = 5, q1.ROUND_HALF_EVEN = 6, q1.ROUND_HALF_CEIL = 7, q1.ROUND_HALF_FLOOR = 8, q1.EUCLID = 9, q1.config = q1.set = function(a) {
                var A1, M1;
                if (a != null)
                    if (typeof a == "object") {
                        if (a.hasOwnProperty(A1 = "DECIMAL_PLACES")) M1 = a[A1], G(M1, 0, D, A1), b = M1;
                        if (a.hasOwnProperty(A1 = "ROUNDING_MODE")) M1 = a[A1], G(M1, 0, 8, A1), g = M1;
                        if (a.hasOwnProperty(A1 = "EXPONENTIAL_AT"))
                            if (M1 = a[A1], M1 && M1.pop) G(M1[0], -D, 0, A1), G(M1[1], 0, D, A1), U = M1[0], x = M1[1];
                            else G(M1, -D, D, A1), U = -(x = M1 < 0 ? -M1 : M1);
                        if (a.hasOwnProperty(A1 = "RANGE"))
                            if (M1 = a[A1], M1 && M1.pop) G(M1[0], -D, -1, A1), G(M1[1], 1, D, A1), p = M1[0], l = M1[1];
                            else if (G(M1, -D, D, A1), M1) p = -(l = M1 < 0 ? -M1 : M1);
                        else throw Error(w + A1 + " cannot be zero: " + M1);
                        if (a.hasOwnProperty(A1 = "CRYPTO"))
                            if (M1 = a[A1], M1 === !!M1)
                                if (M1)
                                    if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes)) r = M1;
                                    else throw r = !M1, Error(w + "crypto unavailable");
                        else r = M1;
                        else throw Error(w + A1 + " not true or false: " + M1);
                        if (a.hasOwnProperty(A1 = "MODULO_MODE")) M1 = a[A1], G(M1, 0, 9, A1), s = M1;
                        if (a.hasOwnProperty(A1 = "POW_PRECISION")) M1 = a[A1], G(M1, 0, D, A1), O1 = M1;
                        if (a.hasOwnProperty(A1 = "FORMAT"))
                            if (M1 = a[A1], typeof M1 == "object") T1 = M1;
                            else throw Error(w + A1 + " not an object: " + M1);
                        if (a.hasOwnProperty(A1 = "ALPHABET"))
                            if (M1 = a[A1], typeof M1 == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(M1)) j1 = M1.slice(0, 10) == "0123456789", N1 = M1;
                            else throw Error(w + A1 + " invalid: " + M1)
                    } else throw Error(w + "Object expected: " + a);
                return {
                    DECIMAL_PLACES: b,
                    ROUNDING_MODE: g,
                    EXPONENTIAL_AT: [U, x],
                    RANGE: [p, l],
                    CRYPTO: r,
                    MODULO_MODE: s,
                    POW_PRECISION: O1,
                    FORMAT: T1,
                    ALPHABET: N1
                }
            }, q1.isBigNumber = function(a) {
                if (!a || a._isBigNumber !== !0) return !1;
                if (!q1.DEBUG) return !0;
                var A1, M1, z1 = a.c,
                    Y1 = a.e,
                    _1 = a.s;
                A: if ({}.toString.call(z1) == "[object Array]") {
                    if ((_1 === 1 || _1 === -1) && Y1 >= -D && Y1 <= D && Y1 === z(Y1)) {
                        if (z1[0] === 0) {
                            if (Y1 === 0 && z1.length === 1) return !0;
                            break A
                        }
                        if (A1 = (Y1 + 1) % O, A1 < 1) A1 += O;
                        if (String(z1[0]).length == A1) {
                            for (A1 = 0; A1 < z1.length; A1++)
                                if (M1 = z1[A1], M1 < 0 || M1 >= $ || M1 !== z(M1)) break A;
                            if (M1 !== 0) return !0
                        }
                    }
                } else if (z1 === null && Y1 === null && (_1 === null || _1 === 1 || _1 === -1)) return !0;
                throw Error(w + "Invalid BigNumber: " + a)
            }, q1.maximum = q1.max = function() {
                return J1(arguments, -1)
            }, q1.minimum = q1.min = function() {
                return J1(arguments, 1)
            }, q1.random = function() {
                var a = 9007199254740992,
                    A1 = Math.random() * a & 2097151 ? function() {
                        return z(Math.random() * a)
                    } : function() {
                        return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0)
                    };
                return function(M1) {
                    var z1, Y1, _1, $1, G1, L1 = 0,
                        x1 = [],
                        f1 = new q1(m);
                    if (M1 == null) M1 = b;
                    else G(M1, 0, D);
                    if ($1 = Y(M1 / O), r)
                        if (crypto.getRandomValues) {
                            z1 = crypto.getRandomValues(new Uint32Array($1 *= 2));
                            for (; L1 < $1;)
                                if (G1 = z1[L1] * 131072 + (z1[L1 + 1] >>> 11), G1 >= 9000000000000000) Y1 = crypto.getRandomValues(new Uint32Array(2)), z1[L1] = Y1[0], z1[L1 + 1] = Y1[1];
                                else x1.push(G1 % 100000000000000), L1 += 2;
                            L1 = $1 / 2
                        } else if (crypto.randomBytes) {
                        z1 = crypto.randomBytes($1 *= 7);
                        for (; L1 < $1;)
                            if (G1 = (z1[L1] & 31) * 281474976710656 + z1[L1 + 1] * 1099511627776 + z1[L1 + 2] * 4294967296 + z1[L1 + 3] * 16777216 + (z1[L1 + 4] << 16) + (z1[L1 + 5] << 8) + z1[L1 + 6], G1 >= 9000000000000000) crypto.randomBytes(7).copy(z1, L1);
                            else x1.push(G1 % 100000000000000), L1 += 7;
                        L1 = $1 / 7
                    } else throw r = !1, Error(w + "crypto unavailable");
                    if (!r) {
                        for (; L1 < $1;)
                            if (G1 = A1(), G1 < 9000000000000000) x1[L1++] = G1 % 100000000000000
                    }
                    if ($1 = x1[--L1], M1 %= O, $1 && M1) G1 = J[O - M1], x1[L1] = z($1 / G1) * G1;
                    for (; x1[L1] === 0; x1.pop(), L1--);
                    if (L1 < 0) x1 = [_1 = 0];
                    else {
                        for (_1 = -1; x1[0] === 0; x1.splice(0, 1), _1 -= O);
                        for (L1 = 1, G1 = x1[0]; G1 >= 10; G1 /= 10, L1++);
                        if (L1 < O) _1 -= O - L1
                    }
                    return f1.e = _1, f1.c = x1, f1
                }
            }(), q1.sum = function() {
                var a = 1,
                    A1 = arguments,
                    M1 = new q1(A1[0]);
                for (; a < A1.length;) M1 = M1.plus(A1[a++]);
                return M1
            }, y = function() {
                var a = "0123456789";

                function A1(M1, z1, Y1, _1) {
                    var $1, G1 = [0],
                        L1, x1 = 0,
                        f1 = M1.length;
                    for (; x1 < f1;) {
                        for (L1 = G1.length; L1--; G1[L1] *= z1);
                        G1[0] += _1.indexOf(M1.charAt(x1++));
                        for ($1 = 0; $1 < G1.length; $1++)
                            if (G1[$1] > Y1 - 1) {
                                if (G1[$1 + 1] == null) G1[$1 + 1] = 0;
                                G1[$1 + 1] += G1[$1] / Y1 | 0, G1[$1] %= Y1
                            }
                    }
                    return G1.reverse()
                }
                return function(M1, z1, Y1, _1, $1) {
                    var G1, L1, x1, f1, R1, H1, y1, B1, A6 = M1.indexOf("."),
                        O6 = b,
                        P6 = g;
                    if (A6 >= 0) f1 = O1, O1 = 0, M1 = M1.replace(".", ""), B1 = new q1(z1), H1 = B1.pow(M1.length - A6), O1 = f1, B1.c = A1(N(P(H1.c), H1.e, "0"), 10, Y1, a), B1.e = B1.c.length;
                    y1 = A1(M1, z1, Y1, $1 ? (G1 = N1, a) : (G1 = a, N1)), x1 = f1 = y1.length;
                    for (; y1[--f1] == 0; y1.pop());
                    if (!y1[0]) return G1.charAt(0);
                    if (A6 < 0) --x1;
                    else H1.c = y1, H1.e = x1, H1.s = _1, H1 = k(H1, B1, O6, P6, Y1), y1 = H1.c, R1 = H1.r, x1 = H1.e;
                    if (L1 = x1 + O6 + 1, A6 = y1[L1], f1 = Y1 / 2, R1 = R1 || L1 < 0 || y1[L1 + 1] != null, R1 = P6 < 4 ? (A6 != null || R1) && (P6 == 0 || P6 == (H1.s < 0 ? 3 : 2)) : A6 > f1 || A6 == f1 && (P6 == 4 || R1 || P6 == 6 && y1[L1 - 1] & 1 || P6 == (H1.s < 0 ? 8 : 7)), L1 < 1 || !y1[0]) M1 = R1 ? N(G1.charAt(1), -O6, G1.charAt(0)) : G1.charAt(0);
                    else {
                        if (y1.length = L1, R1) {
                            for (--Y1; ++y1[--L1] > Y1;)
                                if (y1[L1] = 0, !L1) ++x1, y1 = [1].concat(y1)
                        }
                        for (f1 = y1.length; !y1[--f1];);
                        for (A6 = 0, M1 = ""; A6 <= f1; M1 += G1.charAt(y1[A6++]));
                        M1 = N(M1, x1, G1.charAt(0))
                    }
                    return M1
                }
            }(), k = function() {
                function a(z1, Y1, _1) {
                    var $1, G1, L1, x1, f1 = 0,
                        R1 = z1.length,
                        H1 = Y1 % X,
                        y1 = Y1 / X | 0;
                    for (z1 = z1.slice(); R1--;) L1 = z1[R1] % X, x1 = z1[R1] / X | 0, $1 = y1 * L1 + x1 * H1, G1 = H1 * L1 + $1 % X * X + f1, f1 = (G1 / _1 | 0) + ($1 / X | 0) + y1 * x1, z1[R1] = G1 % _1;
                    if (f1) z1 = [f1].concat(z1);
                    return z1
                }

                function A1(z1, Y1, _1, $1) {
                    var G1, L1;
                    if (_1 != $1) L1 = _1 > $1 ? 1 : -1;
                    else
                        for (G1 = L1 = 0; G1 < _1; G1++)
                            if (z1[G1] != Y1[G1]) {
                                L1 = z1[G1] > Y1[G1] ? 1 : -1;
                                break
                            } return L1
                }

                function M1(z1, Y1, _1, $1) {
                    var G1 = 0;
                    for (; _1--;) z1[_1] -= G1, G1 = z1[_1] < Y1[_1] ? 1 : 0, z1[_1] = G1 * $1 + z1[_1] - Y1[_1];
                    for (; !z1[0] && z1.length > 1; z1.splice(0, 1));
                }
                return function(z1, Y1, _1, $1, G1) {
                    var L1, x1, f1, R1, H1, y1, B1, A6, O6, P6, V6, q6, p1, K6, j6, M6, N6, F6 = z1.s == Y1.s ? 1 : -1,
                        P1 = z1.c,
                        k1 = Y1.c;
                    if (!P1 || !P1[0] || !k1 || !k1[0]) return new q1(!z1.s || !Y1.s || (P1 ? k1 && P1[0] == k1[0] : !k1) ? NaN : P1 && P1[0] == 0 || !k1 ? F6 * 0 : F6 / 0);
                    if (A6 = new q1(F6), O6 = A6.c = [], x1 = z1.e - Y1.e, F6 = _1 + x1 + 1, !G1) G1 = $, x1 = M(z1.e / O) - M(Y1.e / O), F6 = F6 / O | 0;
                    for (f1 = 0; k1[f1] == (P1[f1] || 0); f1++);
                    if (k1[f1] > (P1[f1] || 0)) x1--;
                    if (F6 < 0) O6.push(1), R1 = !0;
                    else {
                        if (K6 = P1.length, M6 = k1.length, f1 = 0, F6 += 2, H1 = z(G1 / (k1[0] + 1)), H1 > 1) k1 = a(k1, H1, G1), P1 = a(P1, H1, G1), M6 = k1.length, K6 = P1.length;
                        p1 = M6, P6 = P1.slice(0, M6), V6 = P6.length;
                        for (; V6 < M6; P6[V6++] = 0);
                        if (N6 = k1.slice(), N6 = [0].concat(N6), j6 = k1[0], k1[1] >= G1 / 2) j6++;
                        do {
                            if (H1 = 0, L1 = A1(k1, P6, M6, V6), L1 < 0) {
                                if (q6 = P6[0], M6 != V6) q6 = q6 * G1 + (P6[1] || 0);
                                if (H1 = z(q6 / j6), H1 > 1) {
                                    if (H1 >= G1) H1 = G1 - 1;
                                    y1 = a(k1, H1, G1), B1 = y1.length, V6 = P6.length;
                                    while (A1(y1, P6, B1, V6) == 1) H1--, M1(y1, M6 < B1 ? N6 : k1, B1, G1), B1 = y1.length, L1 = 1
                                } else {
                                    if (H1 == 0) L1 = H1 = 1;
                                    y1 = k1.slice(), B1 = y1.length
                                }
                                if (B1 < V6) y1 = [0].concat(y1);
                                if (M1(P6, y1, V6, G1), V6 = P6.length, L1 == -1)
                                    while (A1(k1, P6, M6, V6) < 1) H1++, M1(P6, M6 < V6 ? N6 : k1, V6, G1), V6 = P6.length
                            } else if (L1 === 0) H1++, P6 = [0];
                            if (O6[f1++] = H1, P6[0]) P6[V6++] = P1[p1] || 0;
                            else P6 = [P1[p1]], V6 = 1
                        } while ((p1++ < K6 || P6[0] != null) && F6--);
                        if (R1 = P6[0] != null, !O6[0]) O6.splice(0, 1)
                    }
                    if (G1 == $) {
                        for (f1 = 1, F6 = O6[0]; F6 >= 10; F6 /= 10, f1++);
                        Z1(A6, _1 + (A6.e = f1 + x1 * O - 1) + 1, $1, R1)
                    } else A6.e = x1, A6.r = +R1;
                    return A6
                }
            }();

            function t(a, A1, M1, z1) {
                var Y1, _1, $1, G1, L1;
                if (M1 == null) M1 = g;
                else G(M1, 0, 8);
                if (!a.c) return a.toString();
                if (Y1 = a.c[0], $1 = a.e, A1 == null) L1 = P(a.c), L1 = z1 == 1 || z1 == 2 && ($1 <= U || $1 >= x) ? Z(L1, $1) : N(L1, $1, "0");
                else if (a = Z1(new q1(a), A1, M1), _1 = a.e, L1 = P(a.c), G1 = L1.length, z1 == 1 || z1 == 2 && (A1 <= _1 || _1 <= U)) {
                    for (; G1 < A1; L1 += "0", G1++);
                    L1 = Z(L1, _1)
                } else if (A1 -= $1, L1 = N(L1, _1, "0"), _1 + 1 > G1) {
                    if (--A1 > 0)
                        for (L1 += "."; A1--; L1 += "0");
                } else if (A1 += _1 - G1, A1 > 0) {
                    if (_1 + 1 == G1) L1 += ".";
                    for (; A1--; L1 += "0");
                }
                return a.s < 0 && Y1 ? "-" + L1 : L1
            }

            function J1(a, A1) {
                var M1, z1, Y1 = 1,
                    _1 = new q1(a[0]);
                for (; Y1 < a.length; Y1++)
                    if (z1 = new q1(a[Y1]), !z1.s || (M1 = W(_1, z1)) === A1 || M1 === 0 && _1.s === A1) _1 = z1;
                return _1
            }

            function D1(a, A1, M1) {
                var z1 = 1,
                    Y1 = A1.length;
                for (; !A1[--Y1]; A1.pop());
                for (Y1 = A1[0]; Y1 >= 10; Y1 /= 10, z1++);
                if ((M1 = z1 + M1 * O - 1) > l) a.c = a.e = null;
                else if (M1 < p) a.c = [a.e = 0];
                else a.e = M1, a.c = A1;
                return a
            }
            B = function() {
                var a = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
                    A1 = /^([^.]+)\.$/,
                    M1 = /^\.([^.]+)$/,
                    z1 = /^-?(Infinity|NaN)$/,
                    Y1 = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
                return function(_1, $1, G1, L1) {
                    var x1, f1 = G1 ? $1 : $1.replace(Y1, "");
                    if (z1.test(f1)) _1.s = isNaN(f1) ? null : f1 < 0 ? -1 : 1;
                    else {
                        if (!G1) {
                            if (f1 = f1.replace(a, function(R1, H1, y1) {
                                    return x1 = (y1 = y1.toLowerCase()) == "x" ? 16 : y1 == "b" ? 2 : 8, !L1 || L1 == x1 ? H1 : R1
                                }), L1) x1 = L1, f1 = f1.replace(A1, "$1").replace(M1, "0.$1");
                            if ($1 != f1) return new q1(f1, x1)
                        }
                        if (q1.DEBUG) throw Error(w + "Not a" + (L1 ? " base " + L1 : "") + " number: " + $1);
                        _1.s = null
                    }
                    _1.c = _1.e = null
                }
            }();

            function Z1(a, A1, M1, z1) {
                var Y1, _1, $1, G1, L1, x1, f1, R1 = a.c,
                    H1 = J;
                if (R1) {
                    A: {
                        for (Y1 = 1, G1 = R1[0]; G1 >= 10; G1 /= 10, Y1++);
                        if (_1 = A1 - Y1, _1 < 0) _1 += O,
                        $1 = A1,
                        L1 = R1[x1 = 0],
                        f1 = z(L1 / H1[Y1 - $1 - 1] % 10);
                        else if (x1 = Y((_1 + 1) / O), x1 >= R1.length)
                            if (z1) {
                                for (; R1.length <= x1; R1.push(0));
                                L1 = f1 = 0, Y1 = 1, _1 %= O, $1 = _1 - O + 1
                            } else break A;
                        else {
                            L1 = G1 = R1[x1];
                            for (Y1 = 1; G1 >= 10; G1 /= 10, Y1++);
                            _1 %= O, $1 = _1 - O + Y1, f1 = $1 < 0 ? 0 : z(L1 / H1[Y1 - $1 - 1] % 10)
                        }
                        if (z1 = z1 || A1 < 0 || R1[x1 + 1] != null || ($1 < 0 ? L1 : L1 % H1[Y1 - $1 - 1]), z1 = M1 < 4 ? (f1 || z1) && (M1 == 0 || M1 == (a.s < 0 ? 3 : 2)) : f1 > 5 || f1 == 5 && (M1 == 4 || z1 || M1 == 6 && (_1 > 0 ? $1 > 0 ? L1 / H1[Y1 - $1] : 0 : R1[x1 - 1]) % 10 & 1 || M1 == (a.s < 0 ? 8 : 7)), A1 < 1 || !R1[0]) {
                            if (R1.length = 0, z1) A1 -= a.e + 1, R1[0] = H1[(O - A1 % O) % O], a.e = -A1 || 0;
                            else R1[0] = a.e = 0;
                            return a
                        }
                        if (_1 == 0) R1.length = x1,
                        G1 = 1,
                        x1--;
                        else R1.length = x1 + 1,
                        G1 = H1[O - _1],
                        R1[x1] = $1 > 0 ? z(L1 / H1[Y1 - $1] % H1[$1]) * G1 : 0;
                        if (z1)
                            for (;;)
                                if (x1 == 0) {
                                    for (_1 = 1, $1 = R1[0]; $1 >= 10; $1 /= 10, _1++);
                                    $1 = R1[0] += G1;
                                    for (G1 = 1; $1 >= 10; $1 /= 10, G1++);
                                    if (_1 != G1) {
                                        if (a.e++, R1[0] == $) R1[0] = 1
                                    }
                                    break
                                } else {
                                    if (R1[x1] += G1, R1[x1] != $) break;
                                    R1[x1--] = 0, G1 = 1
                                } for (_1 = R1.length; R1[--_1] === 0; R1.pop());
                    }
                    if (a.e > l) a.c = a.e = null;
                    else if (a.e < p) a.c = [a.e = 0]
                }
                return a
            }

            function E1(a) {
                var A1, M1 = a.e;
                if (M1 === null) return a.toString();
                return A1 = P(a.c), A1 = M1 <= U || M1 >= x ? Z(A1, M1) : N(A1, M1, "0"), a.s < 0 ? "-" + A1 : A1
            }
            if (S.absoluteValue = S.abs = function() {
                    var a = new q1(this);
                    if (a.s < 0) a.s = 1;
                    return a
                }, S.comparedTo = function(a, A1) {
                    return W(this, new q1(a, A1))
                }, S.decimalPlaces = S.dp = function(a, A1) {
                    var M1, z1, Y1, _1 = this;
                    if (a != null) {
                        if (G(a, 0, D), A1 == null) A1 = g;
                        else G(A1, 0, 8);
                        return Z1(new q1(_1), a + _1.e + 1, A1)
                    }
                    if (!(M1 = _1.c)) return null;
                    if (z1 = ((Y1 = M1.length - 1) - M(this.e / O)) * O, Y1 = M1[Y1])
                        for (; Y1 % 10 == 0; Y1 /= 10, z1--);
                    if (z1 < 0) z1 = 0;
                    return z1
                }, S.dividedBy = S.div = function(a, A1) {
                    return k(this, new q1(a, A1), b, g)
                }, S.dividedToIntegerBy = S.idiv = function(a, A1) {
                    return k(this, new q1(a, A1), 0, 1)
                }, S.exponentiatedBy = S.pow = function(a, A1) {
                    var M1, z1, Y1, _1, $1, G1, L1, x1, f1, R1 = this;
                    if (a = new q1(a), a.c && !a.isInteger()) throw Error(w + "Exponent not an integer: " + E1(a));
                    if (A1 != null) A1 = new q1(A1);
                    if (G1 = a.e > 14, !R1.c || !R1.c[0] || R1.c[0] == 1 && !R1.e && R1.c.length == 1 || !a.c || !a.c[0]) return f1 = new q1(Math.pow(+E1(R1), G1 ? a.s * (2 - f(a)) : +E1(a))), A1 ? f1.mod(A1) : f1;
                    if (L1 = a.s < 0, A1) {
                        if (A1.c ? !A1.c[0] : !A1.s) return new q1(NaN);
                        if (z1 = !L1 && R1.isInteger() && A1.isInteger(), z1) R1 = R1.mod(A1)
                    } else if (a.e > 9 && (R1.e > 0 || R1.e < -1 || (R1.e == 0 ? R1.c[0] > 1 || G1 && R1.c[1] >= 240000000 : R1.c[0] < 80000000000000 || G1 && R1.c[0] <= 99999750000000))) {
                        if (_1 = R1.s < 0 && f(a) ? -0 : 0, R1.e > -1) _1 = 1 / _1;
                        return new q1(L1 ? 1 / _1 : _1)
                    } else if (O1) _1 = Y(O1 / O + 2);
                    if (G1) {
                        if (M1 = new q1(0.5), L1) a.s = 1;
                        x1 = f(a)
                    } else Y1 = Math.abs(+E1(a)), x1 = Y1 % 2;
                    f1 = new q1(m);
                    for (;;) {
                        if (x1) {
                            if (f1 = f1.times(R1), !f1.c) break;
                            if (_1) {
                                if (f1.c.length > _1) f1.c.length = _1
                            } else if (z1) f1 = f1.mod(A1)
                        }
                        if (Y1) {
                            if (Y1 = z(Y1 / 2), Y1 === 0) break;
                            x1 = Y1 % 2
                        } else if (a = a.times(M1), Z1(a, a.e + 1, 1), a.e > 14) x1 = f(a);
                        else {
                            if (Y1 = +E1(a), Y1 === 0) break;
                            x1 = Y1 % 2
                        }
                        if (R1 = R1.times(R1), _1) {
                            if (R1.c && R1.c.length > _1) R1.c.length = _1
                        } else if (z1) R1 = R1.mod(A1)
                    }
                    if (z1) return f1;
                    if (L1) f1 = m.div(f1);
                    return A1 ? f1.mod(A1) : _1 ? Z1(f1, O1, g, $1) : f1
                }, S.integerValue = function(a) {
                    var A1 = new q1(this);
                    if (a == null) a = g;
                    else G(a, 0, 8);
                    return Z1(A1, A1.e + 1, a)
                }, S.isEqualTo = S.eq = function(a, A1) {
                    return W(this, new q1(a, A1)) === 0
                }, S.isFinite = function() {
                    return !!this.c
                }, S.isGreaterThan = S.gt = function(a, A1) {
                    return W(this, new q1(a, A1)) > 0
                }, S.isGreaterThanOrEqualTo = S.gte = function(a, A1) {
                    return (A1 = W(this, new q1(a, A1))) === 1 || A1 === 0
                }, S.isInteger = function() {
                    return !!this.c && M(this.e / O) > this.c.length - 2
                }, S.isLessThan = S.lt = function(a, A1) {
                    return W(this, new q1(a, A1)) < 0
                }, S.isLessThanOrEqualTo = S.lte = function(a, A1) {
                    return (A1 = W(this, new q1(a, A1))) === -1 || A1 === 0
                }, S.isNaN = function() {
                    return !this.s
                }, S.isNegative = function() {
                    return this.s < 0
                }, S.isPositive = function() {
                    return this.s > 0
                }, S.isZero = function() {
                    return !!this.c && this.c[0] == 0
                }, S.minus = function(a, A1) {
                    var M1, z1, Y1, _1, $1 = this,
                        G1 = $1.s;
                    if (a = new q1(a, A1), A1 = a.s, !G1 || !A1) return new q1(NaN);
                    if (G1 != A1) return a.s = -A1, $1.plus(a);
                    var L1 = $1.e / O,
                        x1 = a.e / O,
                        f1 = $1.c,
                        R1 = a.c;
                    if (!L1 || !x1) {
                        if (!f1 || !R1) return f1 ? (a.s = -A1, a) : new q1(R1 ? $1 : NaN);
                        if (!f1[0] || !R1[0]) return R1[0] ? (a.s = -A1, a) : new q1(f1[0] ? $1 : g == 3 ? -0 : 0)
                    }
                    if (L1 = M(L1), x1 = M(x1), f1 = f1.slice(), G1 = L1 - x1) {
                        if (_1 = G1 < 0) G1 = -G1, Y1 = f1;
                        else x1 = L1, Y1 = R1;
                        Y1.reverse();
                        for (A1 = G1; A1--; Y1.push(0));
                        Y1.reverse()
                    } else {
                        z1 = (_1 = (G1 = f1.length) < (A1 = R1.length)) ? G1 : A1;
                        for (G1 = A1 = 0; A1 < z1; A1++)
                            if (f1[A1] != R1[A1]) {
                                _1 = f1[A1] < R1[A1];
                                break
                            }
                    }
                    if (_1) Y1 = f1, f1 = R1, R1 = Y1, a.s = -a.s;
                    if (A1 = (z1 = R1.length) - (M1 = f1.length), A1 > 0)
                        for (; A1--; f1[M1++] = 0);
                    A1 = $ - 1;
                    for (; z1 > G1;) {
                        if (f1[--z1] < R1[z1]) {
                            for (M1 = z1; M1 && !f1[--M1]; f1[M1] = A1);
                            --f1[M1], f1[z1] += $
                        }
                        f1[z1] -= R1[z1]
                    }
                    for (; f1[0] == 0; f1.splice(0, 1), --x1);
                    if (!f1[0]) return a.s = g == 3 ? -1 : 1, a.c = [a.e = 0], a;
                    return D1(a, f1, x1)
                }, S.modulo = S.mod = function(a, A1) {
                    var M1, z1, Y1 = this;
                    if (a = new q1(a, A1), !Y1.c || !a.s || a.c && !a.c[0]) return new q1(NaN);
                    else if (!a.c || Y1.c && !Y1.c[0]) return new q1(Y1);
                    if (s == 9) z1 = a.s, a.s = 1, M1 = k(Y1, a, 0, 3), a.s = z1, M1.s *= z1;
                    else M1 = k(Y1, a, 0, s);
                    if (a = Y1.minus(M1.times(a)), !a.c[0] && s == 1) a.s = Y1.s;
                    return a
                }, S.multipliedBy = S.times = function(a, A1) {
                    var M1, z1, Y1, _1, $1, G1, L1, x1, f1, R1, H1, y1, B1, A6, O6, P6 = this,
                        V6 = P6.c,
                        q6 = (a = new q1(a, A1)).c;
                    if (!V6 || !q6 || !V6[0] || !q6[0]) {
                        if (!P6.s || !a.s || V6 && !V6[0] && !q6 || q6 && !q6[0] && !V6) a.c = a.e = a.s = null;
                        else if (a.s *= P6.s, !V6 || !q6) a.c = a.e = null;
                        else a.c = [0], a.e = 0;
                        return a
                    }
                    if (z1 = M(P6.e / O) + M(a.e / O), a.s *= P6.s, L1 = V6.length, R1 = q6.length, L1 < R1) B1 = V6, V6 = q6, q6 = B1, Y1 = L1, L1 = R1, R1 = Y1;
                    for (Y1 = L1 + R1, B1 = []; Y1--; B1.push(0));
                    A6 = $, O6 = X;
                    for (Y1 = R1; --Y1 >= 0;) {
                        M1 = 0, H1 = q6[Y1] % O6, y1 = q6[Y1] / O6 | 0;
                        for ($1 = L1, _1 = Y1 + $1; _1 > Y1;) x1 = V6[--$1] % O6, f1 = V6[$1] / O6 | 0, G1 = y1 * x1 + f1 * H1, x1 = H1 * x1 + G1 % O6 * O6 + B1[_1] + M1, M1 = (x1 / A6 | 0) + (G1 / O6 | 0) + y1 * f1, B1[_1--] = x1 % A6;
                        B1[_1] = M1
                    }
                    if (M1) ++z1;
                    else B1.splice(0, 1);
                    return D1(a, B1, z1)
                }, S.negated = function() {
                    var a = new q1(this);
                    return a.s = -a.s || null, a
                }, S.plus = function(a, A1) {
                    var M1, z1 = this,
                        Y1 = z1.s;
                    if (a = new q1(a, A1), A1 = a.s, !Y1 || !A1) return new q1(NaN);
                    if (Y1 != A1) return a.s = -A1, z1.minus(a);
                    var _1 = z1.e / O,
                        $1 = a.e / O,
                        G1 = z1.c,
                        L1 = a.c;
                    if (!_1 || !$1) {
                        if (!G1 || !L1) return new q1(Y1 / 0);
                        if (!G1[0] || !L1[0]) return L1[0] ? a : new q1(G1[0] ? z1 : Y1 * 0)
                    }
                    if (_1 = M(_1), $1 = M($1), G1 = G1.slice(), Y1 = _1 - $1) {
                        if (Y1 > 0) $1 = _1, M1 = L1;
                        else Y1 = -Y1, M1 = G1;
                        M1.reverse();
                        for (; Y1--; M1.push(0));
                        M1.reverse()
                    }
                    if (Y1 = G1.length, A1 = L1.length, Y1 - A1 < 0) M1 = L1, L1 = G1, G1 = M1, A1 = Y1;
                    for (Y1 = 0; A1;) Y1 = (G1[--A1] = G1[A1] + L1[A1] + Y1) / $ | 0, G1[A1] = $ === G1[A1] ? 0 : G1[A1] % $;
                    if (Y1) G1 = [Y1].concat(G1), ++$1;
                    return D1(a, G1, $1)
                }, S.precision = S.sd = function(a, A1) {
                    var M1, z1, Y1, _1 = this;
                    if (a != null && a !== !!a) {
                        if (G(a, 1, D), A1 == null) A1 = g;
                        else G(A1, 0, 8);
                        return Z1(new q1(_1), a, A1)
                    }
                    if (!(M1 = _1.c)) return null;
                    if (Y1 = M1.length - 1, z1 = Y1 * O + 1, Y1 = M1[Y1]) {
                        for (; Y1 % 10 == 0; Y1 /= 10, z1--);
                        for (Y1 = M1[0]; Y1 >= 10; Y1 /= 10, z1++);
                    }
                    if (a && _1.e + 1 > z1) z1 = _1.e + 1;
                    return z1
                }, S.shiftedBy = function(a) {
                    return G(a, -_, _), this.times("1e" + a)
                }, S.squareRoot = S.sqrt = function() {
                    var a, A1, M1, z1, Y1, _1 = this,
                        $1 = _1.c,
                        G1 = _1.s,
                        L1 = _1.e,
                        x1 = b + 4,
                        f1 = new q1("0.5");
                    if (G1 !== 1 || !$1 || !$1[0]) return new q1(!G1 || G1 < 0 && (!$1 || $1[0]) ? NaN : $1 ? _1 : 1 / 0);
                    if (G1 = Math.sqrt(+E1(_1)), G1 == 0 || G1 == 1 / 0) {
                        if (A1 = P($1), (A1.length + L1) % 2 == 0) A1 += "0";
                        if (G1 = Math.sqrt(+A1), L1 = M((L1 + 1) / 2) - (L1 < 0 || L1 % 2), G1 == 1 / 0) A1 = "5e" + L1;
                        else A1 = G1.toExponential(), A1 = A1.slice(0, A1.indexOf("e") + 1) + L1;
                        M1 = new q1(A1)
                    } else M1 = new q1(G1 + "");
                    if (M1.c[0]) {
                        if (L1 = M1.e, G1 = L1 + x1, G1 < 3) G1 = 0;
                        for (;;)
                            if (Y1 = M1, M1 = f1.times(Y1.plus(k(_1, Y1, x1, 1))), P(Y1.c).slice(0, G1) === (A1 = P(M1.c)).slice(0, G1)) {
                                if (M1.e < L1) --G1;
                                if (A1 = A1.slice(G1 - 3, G1 + 1), A1 == "9999" || !z1 && A1 == "4999") {
                                    if (!z1) {
                                        if (Z1(Y1, Y1.e + b + 2, 0), Y1.times(Y1).eq(_1)) {
                                            M1 = Y1;
                                            break
                                        }
                                    }
                                    x1 += 4, G1 += 4, z1 = 1
                                } else {
                                    if (!+A1 || !+A1.slice(1) && A1.charAt(0) == "5") Z1(M1, M1.e + b + 2, 1), a = !M1.times(M1).eq(_1);
                                    break
                                }
                            }
                    }
                    return Z1(M1, M1.e + b + 1, g, a)
                }, S.toExponential = function(a, A1) {
                    if (a != null) G(a, 0, D), a++;
                    return t(this, a, A1, 1)
                }, S.toFixed = function(a, A1) {
                    if (a != null) G(a, 0, D), a = a + this.e + 1;
                    return t(this, a, A1)
                }, S.toFormat = function(a, A1, M1) {
                    var z1, Y1 = this;
                    if (M1 == null)
                        if (a != null && A1 && typeof A1 == "object") M1 = A1, A1 = null;
                        else if (a && typeof a == "object") M1 = a, a = A1 = null;
                    else M1 = T1;
                    else if (typeof M1 != "object") throw Error(w + "Argument not an object: " + M1);
                    if (z1 = Y1.toFixed(a, A1), Y1.c) {
                        var _1, $1 = z1.split("."),
                            G1 = +M1.groupSize,
                            L1 = +M1.secondaryGroupSize,
                            x1 = M1.groupSeparator || "",
                            f1 = $1[0],
                            R1 = $1[1],
                            H1 = Y1.s < 0,
                            y1 = H1 ? f1.slice(1) : f1,
                            B1 = y1.length;
                        if (L1) _1 = G1, G1 = L1, L1 = _1, B1 -= _1;
                        if (G1 > 0 && B1 > 0) {
                            _1 = B1 % G1 || G1, f1 = y1.substr(0, _1);
                            for (; _1 < B1; _1 += G1) f1 += x1 + y1.substr(_1, G1);
                            if (L1 > 0) f1 += x1 + y1.slice(_1);
                            if (H1) f1 = "-" + f1
                        }
                        z1 = R1 ? f1 + (M1.decimalSeparator || "") + ((L1 = +M1.fractionGroupSize) ? R1.replace(new RegExp("\\d{" + L1 + "}\\B", "g"), "$&" + (M1.fractionGroupSeparator || "")) : R1) : f1
                    }
                    return (M1.prefix || "") + z1 + (M1.suffix || "")
                }, S.toFraction = function(a) {
                    var A1, M1, z1, Y1, _1, $1, G1, L1, x1, f1, R1, H1, y1 = this,
                        B1 = y1.c;
                    if (a != null) {
                        if (G1 = new q1(a), !G1.isInteger() && (G1.c || G1.s !== 1) || G1.lt(m)) throw Error(w + "Argument " + (G1.isInteger() ? "out of range: " : "not an integer: ") + E1(G1))
                    }
                    if (!B1) return new q1(y1);
                    A1 = new q1(m), x1 = M1 = new q1(m), z1 = L1 = new q1(m), H1 = P(B1), _1 = A1.e = H1.length - y1.e - 1, A1.c[0] = J[($1 = _1 % O) < 0 ? O + $1 : $1], a = !a || G1.comparedTo(A1) > 0 ? _1 > 0 ? A1 : x1 : G1, $1 = l, l = 1 / 0, G1 = new q1(H1), L1.c[0] = 0;
                    for (;;) {
                        if (f1 = k(G1, A1, 0, 1), Y1 = M1.plus(f1.times(z1)), Y1.comparedTo(a) == 1) break;
                        M1 = z1, z1 = Y1, x1 = L1.plus(f1.times(Y1 = x1)), L1 = Y1, A1 = G1.minus(f1.times(Y1 = A1)), G1 = Y1
                    }
                    return Y1 = k(a.minus(M1), z1, 0, 1), L1 = L1.plus(Y1.times(x1)), M1 = M1.plus(Y1.times(z1)), L1.s = x1.s = y1.s, _1 = _1 * 2, R1 = k(x1, z1, _1, g).minus(y1).abs().comparedTo(k(L1, M1, _1, g).minus(y1).abs()) < 1 ? [x1, z1] : [L1, M1], l = $1, R1
                }, S.toNumber = function() {
                    return +E1(this)
                }, S.toPrecision = function(a, A1) {
                    if (a != null) G(a, 1, D);
                    return t(this, a, A1, 2)
                }, S.toString = function(a) {
                    var A1, M1 = this,
                        z1 = M1.s,
                        Y1 = M1.e;
                    if (Y1 === null)
                        if (z1) {
                            if (A1 = "Infinity", z1 < 0) A1 = "-" + A1
                        } else A1 = "NaN";
                    else {
                        if (a == null) A1 = Y1 <= U || Y1 >= x ? Z(P(M1.c), Y1) : N(P(M1.c), Y1, "0");
                        else if (a === 10 && j1) M1 = Z1(new q1(M1), b + Y1 + 1, g), A1 = N(P(M1.c), M1.e, "0");
                        else G(a, 2, N1.length, "Base"), A1 = y(N(P(M1.c), Y1, "0"), 10, a, z1, !0);
                        if (z1 < 0 && M1.c[0]) A1 = "-" + A1
                    }
                    return A1
                }, S.valueOf = S.toJSON = function() {
                    return E1(this)
                }, S._isBigNumber = !0, T != null) q1.set(T);
            return q1
        }

        function M(T) {
            var k = T | 0;
            return T > 0 || T === k ? k : k - 1
        }

        function P(T) {
            var k, y, B = 1,
                S = T.length,
                m = T[0] + "";
            for (; B < S;) {
                k = T[B++] + "", y = O - k.length;
                for (; y--; k = "0" + k);
                m += k
            }
            for (S = m.length; m.charCodeAt(--S) === 48;);
            return m.slice(0, S + 1 || 1)
        }

        function W(T, k) {
            var y, B, S = T.c,
                m = k.c,
                b = T.s,
                g = k.s,
                U = T.e,
                x = k.e;
            if (!b || !g) return null;
            if (y = S && !S[0], B = m && !m[0], y || B) return y ? B ? 0 : -g : b;
            if (b != g) return b;
            if (y = b < 0, B = U == x, !S || !m) return B ? 0 : !S ^ y ? 1 : -1;
            if (!B) return U > x ^ y ? 1 : -1;
            g = (U = S.length) < (x = m.length) ? U : x;
            for (b = 0; b < g; b++)
                if (S[b] != m[b]) return S[b] > m[b] ^ y ? 1 : -1;
            return U == x ? 0 : U > x ^ y ? 1 : -1
        }

        function G(T, k, y, B) {
            if (T < k || T > y || T !== z(T)) throw Error(w + (B || "Argument") + (typeof T == "number" ? T < k || T > y ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(T))
        }

        function f(T) {
            var k = T.c.length - 1;
            return M(T.e / O) == k && T.c[k] % 2 != 0
        }

        function Z(T, k) {
            return (T.length > 1 ? T.charAt(0) + "." + T.slice(1) : T) + (k < 0 ? "e" : "e+") + k
        }

        function N(T, k, y) {
            var B, S;
            if (k < 0) {
                for (S = y + "."; ++k; S += y);
                T = S + T
            } else if (B = T.length, ++k > B) {
                for (S = y, k -= B; --k; S += y);
                T += S
            } else if (k < B) T = T.slice(0, k) + "." + T.slice(k);
            return T
        }
        if (q = j(), q.default = q.BigNumber = q, typeof define == "function" && define.amd) define(function() {
            return q
        });
        else if (typeof Wz6 < "u" && Wz6.exports) Wz6.exports = q;
        else {
            if (!A) A = typeof self < "u" && self ? self : window;
            A.BigNumber = q
        }
    })(bW7)
})
// @from(Ln 184459, Col 4)
FW7 = R((Qc2, mW7) => {
    var uW7 = c2A(),
        BW7 = Qc2;
    (function() {
        function A(_) {
            return _ < 10 ? "0" + _ : _
        }
        var q = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            K = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            Y, z, w = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': "\\\"",
                "\\": "\\\\"
            },
            H;

        function $(_) {
            return K.lastIndex = 0, K.test(_) ? '"' + _.replace(K, function(J) {
                var X = w[J];
                return typeof X === "string" ? X : "\\u" + ("0000" + J.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + _ + '"'
        }

        function O(_, J) {
            var X, D, j, M, P = Y,
                W, G = J[_],
                f = G != null && (G instanceof uW7 || uW7.isBigNumber(G));
            if (G && typeof G === "object" && typeof G.toJSON === "function") G = G.toJSON(_);
            if (typeof H === "function") G = H.call(J, _, G);
            switch (typeof G) {
                case "string":
                    if (f) return G;
                    else return $(G);
                case "number":
                    return isFinite(G) ? String(G) : "null";
                case "boolean":
                case "null":
                case "bigint":
                    return String(G);
                case "object":
                    if (!G) return "null";
                    if (Y += z, W = [], Object.prototype.toString.apply(G) === "[object Array]") {
                        M = G.length;
                        for (X = 0; X < M; X += 1) W[X] = O(X, G) || "null";
                        return j = W.length === 0 ? "[]" : Y ? `[
` + Y + W.join(`,
` + Y) + `
` + P + "]" : "[" + W.join(",") + "]", Y = P, j
                    }
                    if (H && typeof H === "object") {
                        M = H.length;
                        for (X = 0; X < M; X += 1)
                            if (typeof H[X] === "string") {
                                if (D = H[X], j = O(D, G), j) W.push($(D) + (Y ? ": " : ":") + j)
                            }
                    } else Object.keys(G).forEach(function(Z) {
                        var N = O(Z, G);
                        if (N) W.push($(Z) + (Y ? ": " : ":") + N)
                    });
                    return j = W.length === 0 ? "{}" : Y ? `{
` + Y + W.join(`,
` + Y) + `
` + P + "}" : "{" + W.join(",") + "}", Y = P, j
            }
        }
        if (typeof BW7.stringify !== "function") BW7.stringify = function(_, J, X) {
            var D;
            if (Y = "", z = "", typeof X === "number")
                for (D = 0; D < X; D += 1) z += " ";
            else if (typeof X === "string") z = X;
            if (H = J, J && typeof J !== "function" && (typeof J !== "object" || typeof J.length !== "number")) throw Error("JSON.stringify");
            return O("", {
                "": _
            })
        }
    })()
})
// @from(Ln 184540, Col 4)
gW7 = R((gc2, QW7) => {
    var Gz6 = null,
        Ls5 = /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/,
        Rs5 = /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/,
        ys5 = function(A) {
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
                w, H = function(P) {
                    throw {
                        name: "SyntaxError",
                        message: P,
                        at: K,
                        text: w
                    }
                },
                $ = function(P) {
                    if (P && P !== Y) H("Expected '" + P + "' instead of '" + Y + "'");
                    return Y = w.charAt(K), K += 1, Y
                },
                O = function() {
                    var P, W = "";
                    if (Y === "-") W = "-", $("-");
                    while (Y >= "0" && Y <= "9") W += Y, $();
                    if (Y === ".") {
                        W += ".";
                        while ($() && Y >= "0" && Y <= "9") W += Y
                    }
                    if (Y === "e" || Y === "E") {
                        if (W += Y, $(), Y === "-" || Y === "+") W += Y, $();
                        while (Y >= "0" && Y <= "9") W += Y, $()
                    }
                    if (P = +W, !isFinite(P)) H("Bad number");
                    else {
                        if (Gz6 == null) Gz6 = c2A();
                        if (W.length > 15) return q.storeAsString ? W : q.useNativeBigInt ? BigInt(W) : new Gz6(W);
                        else return !q.alwaysParseAsBig ? P : q.useNativeBigInt ? BigInt(P) : new Gz6(P)
                    }
                },
                _ = function() {
                    var P, W, G = "",
                        f;
                    if (Y === '"') {
                        var Z = K;
                        while ($()) {
                            if (Y === '"') {
                                if (K - 1 > Z) G += w.substring(Z, K - 1);
                                return $(), G
                            }
                            if (Y === "\\") {
                                if (K - 1 > Z) G += w.substring(Z, K - 1);
                                if ($(), Y === "u") {
                                    f = 0;
                                    for (W = 0; W < 4; W += 1) {
                                        if (P = parseInt($(), 16), !isFinite(P)) break;
                                        f = f * 16 + P
                                    }
                                    G += String.fromCharCode(f)
                                } else if (typeof z[Y] === "string") G += z[Y];
                                else break;
                                Z = K
                            }
                        }
                    }
                    H("Bad string")
                },
                J = function() {
                    while (Y && Y <= " ") $()
                },
                X = function() {
                    switch (Y) {
                        case "t":
                            return $("t"), $("r"), $("u"), $("e"), !0;
                        case "f":
                            return $("f"), $("a"), $("l"), $("s"), $("e"), !1;
                        case "n":
                            return $("n"), $("u"), $("l"), $("l"), null
                    }
                    H("Unexpected '" + Y + "'")
                },
                D, j = function() {
                    var P = [];
                    if (Y === "[") {
                        if ($("["), J(), Y === "]") return $("]"), P;
                        while (Y) {
                            if (P.push(D()), J(), Y === "]") return $("]"), P;
                            $(","), J()
                        }
                    }
                    H("Bad array")
                },
                M = function() {
                    var P, W = Object.create(null);
                    if (Y === "{") {
                        if ($("{"), J(), Y === "}") return $("}"), W;
                        while (Y) {
                            if (P = _(), J(), $(":"), q.strict === !0 && Object.hasOwnProperty.call(W, P)) H('Duplicate key "' + P + '"');
                            if (Ls5.test(P) === !0)
                                if (q.protoAction === "error") H("Object contains forbidden prototype property");
                                else if (q.protoAction === "ignore") D();
                            else W[P] = D();
                            else if (Rs5.test(P) === !0)
                                if (q.constructorAction === "error") H("Object contains forbidden constructor property");
                                else if (q.constructorAction === "ignore") D();
                            else W[P] = D();
                            else W[P] = D();
                            if (J(), Y === "}") return $("}"), W;
                            $(","), J()
                        }
                    }
                    H("Bad object")
                };
            return D = function() {
                    switch (J(), Y) {
                        case "{":
                            return M();
                        case "[":
                            return j();
                        case '"':
                            return _();
                        case "-":
                            return O();
                        default:
                            return Y >= "0" && Y <= "9" ? O() : X()
                    }
                },
                function(P, W) {
                    var G;
                    if (w = P + "", K = 0, Y = " ", G = D(), J(), Y) H("Syntax error");
                    return typeof W === "function" ? function f(Z, N) {
                        var T, k, y = Z[N];
                        if (y && typeof y === "object") Object.keys(y).forEach(function(B) {
                            if (k = f(y, B), k !== void 0) y[B] = k;
                            else delete y[B]
                        });
                        return W.call(Z, N, y)
                    }({
                        "": G
                    }, "") : G
                }
        };
    QW7.exports = ys5
})
// @from(Ln 184709, Col 4)
dW7 = R((Uc2, Zz6) => {
    var UW7 = FW7().stringify,
        pW7 = gW7();
    Zz6.exports = function(A) {
        return {
            parse: pW7(A),
            stringify: UW7
        }
    };
    Zz6.exports.parse = pW7();
    Zz6.exports.stringify = UW7
})
// @from(Ln 184721, Col 4)
l2A = R((aW7) => {
    Object.defineProperty(aW7, "__esModule", {
        value: !0
    });
    aW7.GCE_LINUX_BIOS_PATHS = void 0;
    aW7.isGoogleCloudServerless = iW7;
    aW7.isGoogleComputeEngineLinux = nW7;
    aW7.isGoogleComputeEngineMACAddress = rW7;
    aW7.isGoogleComputeEngine = oW7;
    aW7.detectGCPResidency = Ss5;
    var cW7 = h1("fs"),
        lW7 = h1("os");
    aW7.GCE_LINUX_BIOS_PATHS = {
        BIOS_DATE: "/sys/class/dmi/id/bios_date",
        BIOS_VENDOR: "/sys/class/dmi/id/bios_vendor"
    };
    var Cs5 = /^42:01/;

    function iW7() {
        return !!(process.env.CLOUD_RUN_JOB || process.env.FUNCTION_NAME || process.env.K_SERVICE)
    }

    function nW7() {
        if ((0, lW7.platform)() !== "linux") return !1;
        try {
            (0, cW7.statSync)(aW7.GCE_LINUX_BIOS_PATHS.BIOS_DATE);
            let A = (0, cW7.readFileSync)(aW7.GCE_LINUX_BIOS_PATHS.BIOS_VENDOR, "utf8");
            return /Google/.test(A)
        } catch (A) {
            return !1
        }
    }

    function rW7() {
        let A = (0, lW7.networkInterfaces)();
        for (let q of Object.values(A)) {
            if (!q) continue;
            for (let {
                    mac: K
                }
                of q)
                if (Cs5.test(K)) return !0
        }
        return !1
    }

    function oW7() {
        return nW7() || rW7()
    }

    function Ss5() {
        return iW7() || oW7()
    }
})
// @from(Ln 184775, Col 4)
eW7 = R((sW7) => {
    Object.defineProperty(sW7, "__esModule", {
        value: !0
    });
    sW7.Colours = void 0;
    class K9 {
        static isEnabled(A) {
            return A.isTTY && (typeof A.getColorDepth === "function" ? A.getColorDepth() > 2 : !0)
        }
        static refresh() {
            if (K9.enabled = K9.isEnabled(process.stderr), !this.enabled) K9.reset = "", K9.bright = "", K9.dim = "", K9.red = "", K9.green = "", K9.yellow = "", K9.blue = "", K9.magenta = "", K9.cyan = "", K9.white = "", K9.grey = "";
            else K9.reset = "\x1B[0m", K9.bright = "\x1B[1m", K9.dim = "\x1B[2m", K9.red = "\x1B[31m", K9.green = "\x1B[32m", K9.yellow = "\x1B[33m", K9.blue = "\x1B[34m", K9.magenta = "\x1B[35m", K9.cyan = "\x1B[36m", K9.white = "\x1B[37m", K9.grey = "\x1B[90m"
        }
    }
    sW7.Colours = K9;
    K9.enabled = !1;
    K9.reset = "";
    K9.bright = "";
    K9.dim = "";
    K9.red = "";
    K9.green = "";
    K9.yellow = "";
    K9.blue = "";
    K9.magenta = "";
    K9.cyan = "";
    K9.white = "";
    K9.grey = "";
    K9.refresh()
})
// @from(Ln 184804, Col 4)
wG7 = R((Yw) => {
    var Bs5 = Yw && Yw.__createBinding || (Object.create ? function(A, q, K, Y) {
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
        ms5 = Yw && Yw.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        AG7 = Yw && Yw.__importStar || function(A) {
            if (A && A.__esModule) return A;
            var q = {};
            if (A != null) {
                for (var K in A)
                    if (K !== "default" && Object.prototype.hasOwnProperty.call(A, K)) Bs5(q, A, K)
            }
            return ms5(q, A), q
        };
    Object.defineProperty(Yw, "__esModule", {
        value: !0
    });
    Yw.env = Yw.DebugLogBackendBase = Yw.placeholder = Yw.AdhocDebugLogger = Yw.LogSeverity = void 0;
    Yw.getNodeBackend = i2A;
    Yw.getDebugBackend = Qs5;
    Yw.getStructuredBackend = gs5;
    Yw.setBackend = Us5;
    Yw.log = zG7;
    var Fs5 = h1("node:events"),
        FI1 = AG7(h1("node:process")),
        qG7 = AG7(h1("node:util")),
        Mv = eW7(),
        uS;
    (function(A) {
        A.DEFAULT = "DEFAULT", A.DEBUG = "DEBUG", A.INFO = "INFO", A.WARNING = "WARNING", A.ERROR = "ERROR"
    })(uS || (Yw.LogSeverity = uS = {}));
    class Vz6 extends Fs5.EventEmitter {
        constructor(A, q) {
            super();
            this.namespace = A, this.upstream = q, this.func = Object.assign(this.invoke.bind(this), {
                instance: this,
                on: (K, Y) => this.on(K, Y)
            }), this.func.debug = (...K) => this.invokeSeverity(uS.DEBUG, ...K), this.func.info = (...K) => this.invokeSeverity(uS.INFO, ...K), this.func.warn = (...K) => this.invokeSeverity(uS.WARNING, ...K), this.func.error = (...K) => this.invokeSeverity(uS.ERROR, ...K), this.func.sublog = (K) => zG7(K, this.func)
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
    Yw.AdhocDebugLogger = Vz6;
    Yw.placeholder = new Vz6("", () => {}).func;
    class QI1 {
        constructor() {
            var A;
            this.cached = new Map, this.filters = [], this.filtersSet = !1;
            let q = (A = FI1.env[Yw.env.nodeEnables]) !== null && A !== void 0 ? A : "*";
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
    Yw.DebugLogBackendBase = QI1;
    class r2A extends QI1 {
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
                let z = `${Mv.Colours.green}${A}${Mv.Colours.reset}`,
                    w = `${Mv.Colours.yellow}${FI1.pid}${Mv.Colours.reset}`,
                    H;
                switch (q.severity) {
                    case uS.ERROR:
                        H = `${Mv.Colours.red}${q.severity}${Mv.Colours.reset}`;
                        break;
                    case uS.INFO:
                        H = `${Mv.Colours.magenta}${q.severity}${Mv.Colours.reset}`;
                        break;
                    case uS.WARNING:
                        H = `${Mv.Colours.yellow}${q.severity}${Mv.Colours.reset}`;
                        break;
                    default:
                        H = (Y = q.severity) !== null && Y !== void 0 ? Y : uS.DEFAULT;
                        break
                }
                let $ = qG7.formatWithOptions({
                        colors: Mv.Colours.enabled
                    }, ...K),
                    O = Object.assign({}, q);
                delete O.severity;
                let _ = Object.getOwnPropertyNames(O).length ? JSON.stringify(O) : "",
                    J = _ ? `${Mv.Colours.grey}${_}${Mv.Colours.reset}` : "";
                console.error("%s [%s|%s] %s%s", w, z, H, $, _ ? ` ${J}` : "")
            }
        }
        setFilters() {
            let q = this.filters.join(",").replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^");
            this.enabledRegexp = new RegExp(`^${q}$`, "i")
        }
    }

    function i2A() {
        return new r2A
    }
    class KG7 extends QI1 {
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
            let q = (A = FI1.env.NODE_DEBUG) !== null && A !== void 0 ? A : "";
            FI1.env.NODE_DEBUG = `${q}${q?",":""}${this.filters.join(",")}`
        }
    }

    function Qs5(A) {
        return new KG7(A)
    }
    class YG7 extends QI1 {
        constructor(A) {
            var q;
            super();
            this.upstream = (q = A) !== null && q !== void 0 ? q : new r2A
        }
        makeLogger(A) {
            let q = this.upstream.makeLogger(A);
            return (K, ...Y) => {
                var z;
                let w = (z = K.severity) !== null && z !== void 0 ? z : uS.INFO,
                    H = Object.assign({
                        severity: w,
                        message: qG7.format(...Y)
                    }, K),
                    $ = JSON.stringify(H);
                q(K, $)
            }
        }
        setFilters() {
            this.upstream.setFilters()
        }
    }

    function gs5(A) {
        return new YG7(A)
    }
    Yw.env = {
        nodeEnables: "GOOGLE_SDK_NODE_LOGGING"
    };
    var n2A = new Map,
        QL = void 0;

    function Us5(A) {
        QL = A, n2A.clear()
    }

    function zG7(A, q) {
        if (!FI1.env[Yw.env.nodeEnables]) return Yw.placeholder;
        if (!A) return Yw.placeholder;
        if (q) A = `${q.instance.namespace}:${A}`;
        let Y = n2A.get(A);
        if (Y) return Y.func;
        if (QL === null) return Yw.placeholder;
        else if (QL === void 0) QL = i2A();
        let z = (() => {
            let w = void 0;
            return new Vz6(A, ($, ...O) => {
                if (w !== QL) {
                    if (QL === null) return;
                    else if (QL === void 0) QL = i2A();
                    w = QL
                }
                QL === null || QL === void 0 || QL.log(A, $, ...O)
            })
        })();
        return n2A.set(A, z), z.func
    }
})
// @from(Ln 185021, Col 4)
HG7 = R((i41) => {
    var ps5 = i41 && i41.__createBinding || (Object.create ? function(A, q, K, Y) {
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
        ds5 = i41 && i41.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) ps5(q, A, K)
        };
    Object.defineProperty(i41, "__esModule", {
        value: !0
    });
    ds5(wG7(), i41)
})
// @from(Ln 185045, Col 4)
UI1 = R((iK) => {
    var cs5 = iK && iK.__createBinding || (Object.create ? function(A, q, K, Y) {
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
        ls5 = iK && iK.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) cs5(q, A, K)
        };
    Object.defineProperty(iK, "__esModule", {
        value: !0
    });
    iK.gcpResidencyCache = iK.METADATA_SERVER_DETECTION = iK.HEADERS = iK.HEADER_VALUE = iK.HEADER_NAME = iK.SECONDARY_HOST_ADDRESS = iK.HOST_ADDRESS = iK.BASE_PATH = void 0;
    iK.instance = ss5;
    iK.project = ts5;
    iK.universe = es5;
    iK.bulk = At5;
    iK.isAvailable = Kt5;
    iK.resetIsAvailableCache = Yt5;
    iK.getGCPResidency = s2A;
    iK.setGCPResidency = OG7;
    iK.requestTimeout = _G7;
    var o2A = bS(),
        is5 = dW7(),
        ns5 = l2A(),
        rs5 = HG7();
    iK.BASE_PATH = "/computeMetadata/v1";
    iK.HOST_ADDRESS = "http://169.254.169.254";
    iK.SECONDARY_HOST_ADDRESS = "http://metadata.google.internal.";
    iK.HEADER_NAME = "Metadata-Flavor";
    iK.HEADER_VALUE = "Google";
    iK.HEADERS = Object.freeze({
        [iK.HEADER_NAME]: iK.HEADER_VALUE
    });
    var $G7 = rs5.log("gcp metadata");
    iK.METADATA_SERVER_DETECTION = Object.freeze({
        "assume-present": "don't try to ping the metadata server, but assume it's present",
        none: "don't try to ping the metadata server, but don't try to use it either",
        "bios-only": "treat the result of a BIOS probe as canonical (don't fall back to pinging)",
        "ping-only": "skip the BIOS probe, and go straight to pinging"
    });

    function a2A(A) {
        if (!A) A = process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST || iK.HOST_ADDRESS;
        if (!/^https?:\/\//.test(A)) A = `http://${A}`;
        return new URL(iK.BASE_PATH, A).href
    }

    function os5(A) {
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
    async function gI1(A, q = {}, K = 3, Y = !1) {
        let z = "",
            w = {},
            H = {};
        if (typeof A === "object") {
            let J = A;
            z = J.metadataKey, w = J.params || w, H = J.headers || H, K = J.noResponseRetries || K, Y = J.fastFail || Y
        } else z = A;
        if (typeof q === "string") z += `/${q}`;
        else {
            if (os5(q), q.property) z += `/${q.property}`;
            H = q.headers || H, w = q.params || w
        }
        let $ = Y ? as5 : o2A.request,
            O = {
                url: `${a2A()}/${z}`,
                headers: {
                    ...iK.HEADERS,
                    ...H
                },
                retryConfig: {
                    noResponseRetries: K
                },
                params: w,
                responseType: "text",
                timeout: _G7()
            };
        $G7.info("instance request %j", O);
        let _ = await $(O);
        if ($G7.info("instance metadata is %s", _.data), _.headers[iK.HEADER_NAME.toLowerCase()] !== iK.HEADER_VALUE) throw Error(`Invalid response from metadata service: incorrect ${iK.HEADER_NAME} header. Expected '${iK.HEADER_VALUE}', got ${_.headers[iK.HEADER_NAME.toLowerCase()]?`'${_.headers[iK.HEADER_NAME.toLowerCase()]}'`:"no header"}`);
        if (typeof _.data === "string") try {
            return is5.parse(_.data)
        } catch (J) {}
        return _.data
    }
    async function as5(A) {
        var q;
        let K = {
                ...A,
                url: (q = A.url) === null || q === void 0 ? void 0 : q.toString().replace(a2A(), a2A(iK.SECONDARY_HOST_ADDRESS))
            },
            Y = !1,
            z = (0, o2A.request)(A).then((H) => {
                return Y = !0, H
            }).catch((H) => {
                if (Y) return w;
                else throw Y = !0, H
            }),
            w = (0, o2A.request)(K).then((H) => {
                return Y = !0, H
            }).catch((H) => {
                if (Y) return z;
                else throw Y = !0, H
            });
        return Promise.race([z, w])
    }

    function ss5(A) {
        return gI1("instance", A)
    }

    function ts5(A) {
        return gI1("project", A)
    }

    function es5(A) {
        return gI1("universe", A)
    }
    async function At5(A) {
        let q = {};
        return await Promise.all(A.map((K) => {
            return (async () => {
                let Y = await gI1(K),
                    z = K.metadataKey;
                q[z] = Y
            })()
        })), q
    }

    function qt5() {
        return process.env.DETECT_GCP_RETRIES ? Number(process.env.DETECT_GCP_RETRIES) : 0
    }
    var Nz6;
    async function Kt5() {
        if (process.env.METADATA_SERVER_DETECTION) {
            let A = process.env.METADATA_SERVER_DETECTION.trim().toLocaleLowerCase();
            if (!(A in iK.METADATA_SERVER_DETECTION)) throw RangeError(`Unknown \`METADATA_SERVER_DETECTION\` env variable. Got \`${A}\`, but it should be \`${Object.keys(iK.METADATA_SERVER_DETECTION).join("`, `")}\`, or unset`);
            switch (A) {
                case "assume-present":
                    return !0;
                case "none":
                    return !1;
                case "bios-only":
                    return s2A();
                case "ping-only":
            }
        }
        try {
            if (Nz6 === void 0) Nz6 = gI1("instance", void 0, qt5(), !(process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST));
            return await Nz6, !0
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

    function Yt5() {
        Nz6 = void 0
    }
    iK.gcpResidencyCache = null;

    function s2A() {
        if (iK.gcpResidencyCache === null) OG7();
        return iK.gcpResidencyCache
    }

    function OG7(A = null) {
        iK.gcpResidencyCache = A !== null ? A : (0, ns5.detectGCPResidency)()
    }

    function _G7() {
        return s2A() ? 0 : 3000
    }
    ls5(l2A(), iK)
})
// @from(Ln 185252, Col 4)
AwA = R((Xt5) => {
    Xt5.byteLength = wt5;
    Xt5.toByteArray = $t5;
    Xt5.fromByteArray = Jt5;
    var cu = [],
        gL = [],
        zt5 = typeof Uint8Array < "u" ? Uint8Array : Array,
        t2A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (Go = 0, e2A = t2A.length; Go < e2A; ++Go) cu[Go] = t2A[Go], gL[t2A.charCodeAt(Go)] = Go;
    var Go, e2A;
    gL[45] = 62;
    gL[95] = 63;

    function JG7(A) {
        var q = A.length;
        if (q % 4 > 0) throw Error("Invalid string. Length must be a multiple of 4");
        var K = A.indexOf("=");
        if (K === -1) K = q;
        var Y = K === q ? 0 : 4 - K % 4;
        return [K, Y]
    }

    function wt5(A) {
        var q = JG7(A),
            K = q[0],
            Y = q[1];
        return (K + Y) * 3 / 4 - Y
    }

    function Ht5(A, q, K) {
        return (q + K) * 3 / 4 - K
    }

    function $t5(A) {
        var q, K = JG7(A),
            Y = K[0],
            z = K[1],
            w = new zt5(Ht5(A, Y, z)),
            H = 0,
            $ = z > 0 ? Y - 4 : Y,
            O;
        for (O = 0; O < $; O += 4) q = gL[A.charCodeAt(O)] << 18 | gL[A.charCodeAt(O + 1)] << 12 | gL[A.charCodeAt(O + 2)] << 6 | gL[A.charCodeAt(O + 3)], w[H++] = q >> 16 & 255, w[H++] = q >> 8 & 255, w[H++] = q & 255;
        if (z === 2) q = gL[A.charCodeAt(O)] << 2 | gL[A.charCodeAt(O + 1)] >> 4, w[H++] = q & 255;
        if (z === 1) q = gL[A.charCodeAt(O)] << 10 | gL[A.charCodeAt(O + 1)] << 4 | gL[A.charCodeAt(O + 2)] >> 2, w[H++] = q >> 8 & 255, w[H++] = q & 255;
        return w
    }

    function Ot5(A) {
        return cu[A >> 18 & 63] + cu[A >> 12 & 63] + cu[A >> 6 & 63] + cu[A & 63]
    }

    function _t5(A, q, K) {
        var Y, z = [];
        for (var w = q; w < K; w += 3) Y = (A[w] << 16 & 16711680) + (A[w + 1] << 8 & 65280) + (A[w + 2] & 255), z.push(Ot5(Y));
        return z.join("")
    }

    function Jt5(A) {
        var q, K = A.length,
            Y = K % 3,
            z = [],
            w = 16383;
        for (var H = 0, $ = K - Y; H < $; H += w) z.push(_t5(A, H, H + w > $ ? $ : H + w));
        if (Y === 1) q = A[K - 1], z.push(cu[q >> 2] + cu[q << 4 & 63] + "==");
        else if (Y === 2) q = (A[K - 2] << 8) + A[K - 1], z.push(cu[q >> 10] + cu[q >> 4 & 63] + cu[q << 2 & 63] + "=");
        return z.join("")
    }
})
// @from(Ln 185320, Col 4)
jG7 = R((XG7) => {
    Object.defineProperty(XG7, "__esModule", {
        value: !0
    });
    XG7.BrowserCrypto = void 0;
    var mX1 = AwA(),
        Pt5 = FX1();
    class Tz6 {
        constructor() {
            if (typeof window > "u" || window.crypto === void 0 || window.crypto.subtle === void 0) throw Error("SubtleCrypto not found. Make sure it's an https:// website.")
        }
        async sha256DigestBase64(A) {
            let q = new TextEncoder().encode(A),
                K = await window.crypto.subtle.digest("SHA-256", q);
            return mX1.fromByteArray(new Uint8Array(K))
        }
        randomBytesBase64(A) {
            let q = new Uint8Array(A);
            return window.crypto.getRandomValues(q), mX1.fromByteArray(q)
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
                w = mX1.toByteArray(Tz6.padBase64(K)),
                H = await window.crypto.subtle.importKey("jwk", A, Y, !0, ["verify"]);
            return await window.crypto.subtle.verify(Y, H, w, z)
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
                w = await window.crypto.subtle.sign(K, z, Y);
            return mX1.fromByteArray(new Uint8Array(w))
        }
        decodeBase64StringUtf8(A) {
            let q = mX1.toByteArray(Tz6.padBase64(A));
            return new TextDecoder().decode(q)
        }
        encodeBase64StringUtf8(A) {
            let q = new TextEncoder().encode(A);
            return mX1.fromByteArray(q)
        }
        async sha256DigestHex(A) {
            let q = new TextEncoder().encode(A),
                K = await window.crypto.subtle.digest("SHA-256", q);
            return (0, Pt5.fromArrayBufferToHex)(K)
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
    XG7.BrowserCrypto = Tz6
})
// @from(Ln 185395, Col 4)
GG7 = R((PG7) => {
    Object.defineProperty(PG7, "__esModule", {
        value: !0
    });
    PG7.NodeCrypto = void 0;
    var QX1 = h1("crypto");
    class MG7 {
        async sha256DigestBase64(A) {
            return QX1.createHash("sha256").update(A).digest("base64")
        }
        randomBytesBase64(A) {
            return QX1.randomBytes(A).toString("base64")
        }
        async verify(A, q, K) {
            let Y = QX1.createVerify("RSA-SHA256");
            return Y.update(q), Y.end(), Y.verify(A, K, "base64")
        }
        async sign(A, q) {
            let K = QX1.createSign("RSA-SHA256");
            return K.update(q), K.end(), K.sign(A, "base64")
        }
        decodeBase64StringUtf8(A) {
            return Buffer.from(A, "base64").toString("utf-8")
        }
        encodeBase64StringUtf8(A) {
            return Buffer.from(A, "utf-8").toString("base64")
        }
        async sha256DigestHex(A) {
            return QX1.createHash("sha256").update(A).digest("hex")
        }
        async signWithHmacSha256(A, q) {
            let K = typeof A === "string" ? A : Gt5(A);
            return Wt5(QX1.createHmac("sha256", K).update(q).digest())
        }
    }
    PG7.NodeCrypto = MG7;

    function Wt5(A) {
        return A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength)
    }

    function Gt5(A) {
        return Buffer.from(A)
    }
})
// @from(Ln 185440, Col 4)
FX1 = R((fG7) => {
    Object.defineProperty(fG7, "__esModule", {
        value: !0
    });
    fG7.createCrypto = Vt5;
    fG7.hasBrowserCrypto = ZG7;
    fG7.fromArrayBufferToHex = Nt5;
    var Zt5 = jG7(),
        ft5 = GG7();

    function Vt5() {
        if (ZG7()) return new Zt5.BrowserCrypto;
        return new ft5.NodeCrypto
    }

    function ZG7() {
        return typeof window < "u" && typeof window.crypto < "u" && typeof window.crypto.subtle < "u"
    }

    function Nt5(A) {
        return Array.from(new Uint8Array(A)).map((K) => {
            return K.toString(16).padStart(2, "0")
        }).join("")
    }
})
// @from(Ln 185465, Col 4)
NG7 = R((VG7) => {
    Object.defineProperty(VG7, "__esModule", {
        value: !0
    });
    VG7.validate = kt5;

    function kt5(A) {
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
// @from(Ln 185489, Col 4)
qwA = R((tc2, Rt5) => {
    Rt5.exports = {
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
// @from(Ln 185576, Col 4)
dI1 = R((vG7) => {
    Object.defineProperty(vG7, "__esModule", {
        value: !0
    });
    vG7.DefaultTransporter = void 0;
    var yt5 = bS(),
        Ct5 = NG7(),
        St5 = qwA(),
        TG7 = "google-api-nodejs-client";
    class pI1 {
        constructor() {
            this.instance = new yt5.Gaxios
        }
        configure(A = {}) {
            if (A.headers = A.headers || {}, typeof window > "u") {
                let q = A.headers["User-Agent"];
                if (!q) A.headers["User-Agent"] = pI1.USER_AGENT;
                else if (!q.includes(`${TG7}/`)) A.headers["User-Agent"] = `${q} ${pI1.USER_AGENT}`;
                if (!A.headers["x-goog-api-client"]) {
                    let K = process.version.replace(/^v/, "");
                    A.headers["x-goog-api-client"] = `gl-node/${K}`
                }
            }
            return A
        }
        request(A) {
            return A = this.configure(A), (0, Ct5.validate)(A), this.instance.request(A).catch((q) => {
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
    vG7.DefaultTransporter = pI1;
    pI1.USER_AGENT = `${TG7}/${St5.version}`
})
// @from(Ln 185628, Col 4)
fo = R((Zo) => {
    var BS = Zo && Zo.__classPrivateFieldGet || function(A, q, K, Y) {
            if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
            if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
        },
        gX1, bU, KwA, YwA;
    Object.defineProperty(Zo, "__esModule", {
        value: !0
    });
    Zo.LRUCache = void 0;
    Zo.snakeToCamel = kG7;
    Zo.originalOrCamelOptions = ht5;

    function kG7(A) {
        return A.replace(/([_][^_])/g, (q) => q.slice(1).toUpperCase())
    }

    function ht5(A) {
        function q(K) {
            var Y;
            let z = A || {};
            return (Y = z[K]) !== null && Y !== void 0 ? Y : z[kG7(K)]
        }
        return {
            get: q
        }
    }
    class LG7 {
        constructor(A) {
            gX1.add(this), bU.set(this, new Map), this.capacity = A.capacity, this.maxAge = A.maxAge
        }
        set(A, q) {
            BS(this, gX1, "m", KwA).call(this, A, q), BS(this, gX1, "m", YwA).call(this)
        }
        get(A) {
            let q = BS(this, bU, "f").get(A);
            if (!q) return;
            return BS(this, gX1, "m", KwA).call(this, A, q.value), BS(this, gX1, "m", YwA).call(this), q.value
        }
    }
    Zo.LRUCache = LG7;
    bU = new WeakMap, gX1 = new WeakSet, KwA = function(q, K) {
        BS(this, bU, "f").delete(q), BS(this, bU, "f").set(q, {
            value: K,
            lastAccessed: Date.now()
        })
    }, YwA = function() {
        let q = this.maxAge ? Date.now() - this.maxAge : 0,
            K = BS(this, bU, "f").entries().next();
        while (!K.done && (BS(this, bU, "f").size > this.capacity || K.value[1].lastAccessed < q)) BS(this, bU, "f").delete(K.value[0]), K = BS(this, bU, "f").entries().next()
    }
})
// @from(Ln 185681, Col 4)
lu = R((SG7) => {
    Object.defineProperty(SG7, "__esModule", {
        value: !0
    });
    SG7.AuthClient = SG7.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = SG7.DEFAULT_UNIVERSE = void 0;
    var It5 = h1("events"),
        RG7 = bS(),
        yG7 = dI1(),
        xt5 = fo();
    SG7.DEFAULT_UNIVERSE = "googleapis.com";
    SG7.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = 300000;
    class CG7 extends It5.EventEmitter {
        constructor(A = {}) {
            var q, K, Y, z, w;
            super();
            this.credentials = {}, this.eagerRefreshThresholdMillis = SG7.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS, this.forceRefreshOnFailure = !1, this.universeDomain = SG7.DEFAULT_UNIVERSE;
            let H = (0, xt5.originalOrCamelOptions)(A);
            if (this.apiKey = A.apiKey, this.projectId = (q = H.get("project_id")) !== null && q !== void 0 ? q : null, this.quotaProjectId = H.get("quota_project_id"), this.credentials = (K = H.get("credentials")) !== null && K !== void 0 ? K : {}, this.universeDomain = (Y = H.get("universe_domain")) !== null && Y !== void 0 ? Y : SG7.DEFAULT_UNIVERSE, this.transporter = (z = A.transporter) !== null && z !== void 0 ? z : new yG7.DefaultTransporter, A.transporterOptions) this.transporter.defaults = A.transporterOptions;
            if (A.eagerRefreshThresholdMillis) this.eagerRefreshThresholdMillis = A.eagerRefreshThresholdMillis;
            this.forceRefreshOnFailure = (w = A.forceRefreshOnFailure) !== null && w !== void 0 ? w : !1
        }
        get gaxios() {
            if (this.transporter instanceof RG7.Gaxios) return this.transporter;
            else if (this.transporter instanceof yG7.DefaultTransporter) return this.transporter.instance;
            else if ("instance" in this.transporter && this.transporter.instance instanceof RG7.Gaxios) return this.transporter.instance;
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
    SG7.AuthClient = CG7
})
// @from(Ln 185726, Col 4)
wwA = R((bG7) => {
    Object.defineProperty(bG7, "__esModule", {
        value: !0
    });
    bG7.LoginTicket = void 0;
    class xG7 {
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
    bG7.LoginTicket = xG7
})