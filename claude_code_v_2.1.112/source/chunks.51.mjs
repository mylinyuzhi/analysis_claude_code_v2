
// @from(Ln 127294, Col 4)
uCq = p((VCO, xCq) => {
    var h$ = fr6(),
        f8_ = uE1(),
        ICq = mE1(),
        G8_ = xE1(),
        v8_ = BE1(),
        T8_ = tE1(),
        V8_ = eE1(),
        k8_ = CV6(),
        {
            KeyObject: N8_,
            createSecretKey: E8_,
            createPublicKey: y8_
        } = d6("crypto"),
        qy1 = ["RS256", "RS384", "RS512"],
        L8_ = ["ES256", "ES384", "ES512"],
        Ky1 = ["RS256", "RS384", "RS512"],
        h8_ = ["HS256", "HS384", "HS512"];
    if (V8_) qy1.splice(qy1.length, 0, "PS256", "PS384", "PS512"), Ky1.splice(Ky1.length, 0, "PS256", "PS384", "PS512");
    xCq.exports = function(q, K, _, z) {
        if (typeof _ === "function" && !z) z = _, _ = {};
        if (!_) _ = {};
        _ = Object.assign({}, _);
        let Y;
        if (z) Y = z;
        else Y = function(H, J) {
            if (H) throw H;
            return J
        };
        if (_.clockTimestamp && typeof _.clockTimestamp !== "number") return Y(new h$("clockTimestamp must be a number"));
        if (_.nonce !== void 0 && (typeof _.nonce !== "string" || _.nonce.trim() === "")) return Y(new h$("nonce must be a non-empty string"));
        if (_.allowInvalidAsymmetricKeyTypes !== void 0 && typeof _.allowInvalidAsymmetricKeyTypes !== "boolean") return Y(new h$("allowInvalidAsymmetricKeyTypes must be a boolean"));
        let A = _.clockTimestamp || Math.floor(Date.now() / 1000);
        if (!q) return Y(new h$("jwt must be provided"));
        if (typeof q !== "string") return Y(new h$("jwt must be a string"));
        let O = q.split(".");
        if (O.length !== 3) return Y(new h$("jwt malformed"));
        let w;
        try {
            w = G8_(q, {
                complete: !0
            })
        } catch (H) {
            return Y(H)
        }
        if (!w) return Y(new h$("invalid token"));
        let $ = w.header,
            j;
        if (typeof K === "function") {
            if (!z) return Y(new h$("verify must be called asynchronous if secret or public key is provided as a callback"));
            j = K
        } else j = function(H, J) {
            return J(null, K)
        };
        return j($, function(H, J) {
            if (H) return Y(new h$("error in secret or public key callback: " + H.message));
            let X = O[2].trim() !== "";
            if (!X && J) return Y(new h$("jwt signature is required"));
            if (X && !J) return Y(new h$("secret or public key must be provided"));
            if (!X && !_.algorithms) return Y(new h$('please specify "none" in "algorithms" to verify unsigned tokens'));
            if (J != null && !(J instanceof N8_)) try {
                J = y8_(J)
            } catch (W) {
                try {
                    J = E8_(typeof J === "string" ? Buffer.from(J) : J)
                } catch (D) {
                    return Y(new h$("secretOrPublicKey is not valid key material"))
                }
            }
            if (!_.algorithms)
                if (J.type === "secret") _.algorithms = h8_;
                else if (["rsa", "rsa-pss"].includes(J.asymmetricKeyType)) _.algorithms = Ky1;
            else if (J.asymmetricKeyType === "ec") _.algorithms = L8_;
            else _.algorithms = qy1;
            if (_.algorithms.indexOf(w.header.alg) === -1) return Y(new h$("invalid algorithm"));
            if ($.alg.startsWith("HS") && J.type !== "secret") return Y(new h$(`secretOrPublicKey must be a symmetric key when using ${$.alg}`));
            else if (/^(?:RS|PS|ES)/.test($.alg) && J.type !== "public") return Y(new h$(`secretOrPublicKey must be an asymmetric key when using ${$.alg}`));
            if (!_.allowInvalidAsymmetricKeyTypes) try {
                T8_($.alg, J)
            } catch (W) {
                return Y(W)
            }
            let M;
            try {
                M = k8_.verify(q, w.header.alg, J)
            } catch (W) {
                return Y(W)
            }
            if (!M) return Y(new h$("invalid signature"));
            let P = w.payload;
            if (typeof P.nbf < "u" && !_.ignoreNotBefore) {
                if (typeof P.nbf !== "number") return Y(new h$("invalid nbf value"));
                if (P.nbf > A + (_.clockTolerance || 0)) return Y(new f8_("jwt not active", new Date(P.nbf * 1000)))
            }
            if (typeof P.exp < "u" && !_.ignoreExpiration) {
                if (typeof P.exp !== "number") return Y(new h$("invalid exp value"));
                if (A >= P.exp + (_.clockTolerance || 0)) return Y(new ICq("jwt expired", new Date(P.exp * 1000)))
            }
            if (_.audience) {
                let W = Array.isArray(_.audience) ? _.audience : [_.audience];
                if (!(Array.isArray(P.aud) ? P.aud : [P.aud]).some(function(G) {
                        return W.some(function(f) {
                            return f instanceof RegExp ? f.test(G) : f === G
                        })
                    })) return Y(new h$("jwt audience invalid. expected: " + W.join(" or ")))
            }
            if (_.issuer) {
                if (typeof _.issuer === "string" && P.iss !== _.issuer || Array.isArray(_.issuer) && _.issuer.indexOf(P.iss) === -1) return Y(new h$("jwt issuer invalid. expected: " + _.issuer))
            }
            if (_.subject) {
                if (P.sub !== _.subject) return Y(new h$("jwt subject invalid. expected: " + _.subject))
            }
            if (_.jwtid) {
                if (P.jti !== _.jwtid) return Y(new h$("jwt jwtid invalid. expected: " + _.jwtid))
            }
            if (_.nonce) {
                if (P.nonce !== _.nonce) return Y(new h$("jwt nonce invalid. expected: " + _.nonce))
            }
            if (_.maxAge) {
                if (typeof P.iat !== "number") return Y(new h$("iat required when maxAge is specified"));
                let W = v8_(_.maxAge, P.iat);
                if (typeof W > "u") return Y(new h$('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
                if (A >= W + (_.clockTolerance || 0)) return Y(new ICq("maxAge exceeded", new Date(W * 1000)))
            }
            if (_.complete === !0) {
                let W = w.signature;
                return Y(null, {
                    header: $,
                    payload: P,
                    signature: W
                })
            }
            return Y(null, P)
        })
    }
})
// @from(Ln 127430, Col 4)
UCq = p((kCO, gCq) => {
    var mCq = 1 / 0,
        pCq = 9007199254740991,
        R8_ = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        BCq = NaN,
        S8_ = "[object Arguments]",
        C8_ = "[object Function]",
        b8_ = "[object GeneratorFunction]",
        I8_ = "[object String]",
        x8_ = "[object Symbol]",
        u8_ = /^\s+|\s+$/g,
        m8_ = /^[-+]0x[0-9a-f]+$/i,
        B8_ = /^0b[01]+$/i,
        p8_ = /^0o[0-7]+$/i,
        F8_ = /^(?:0|[1-9]\d*)$/,
        g8_ = parseInt;

    function U8_(q, K) {
        var _ = -1,
            z = q ? q.length : 0,
            Y = Array(z);
        while (++_ < z) Y[_] = K(q[_], _, q);
        return Y
    }

    function Q8_(q, K, _, z) {
        var Y = q.length,
            A = _ + (z ? 1 : -1);
        while (z ? A-- : ++A < Y)
            if (K(q[A], A, q)) return A;
        return -1
    }

    function d8_(q, K, _) {
        if (K !== K) return Q8_(q, c8_, _);
        var z = _ - 1,
            Y = q.length;
        while (++z < Y)
            if (q[z] === K) return z;
        return -1
    }

    function c8_(q) {
        return q !== q
    }

    function l8_(q, K) {
        var _ = -1,
            z = Array(q);
        while (++_ < q) z[_] = K(_);
        return z
    }

    function n8_(q, K) {
        return U8_(K, function(_) {
            return q[_]
        })
    }

    function i8_(q, K) {
        return function(_) {
            return q(K(_))
        }
    }
    var AT8 = Object.prototype,
        zy1 = AT8.hasOwnProperty,
        OT8 = AT8.toString,
        r8_ = AT8.propertyIsEnumerable,
        o8_ = i8_(Object.keys, Object),
        a8_ = Math.max;

    function s8_(q, K) {
        var _ = FCq(q) || _1_(q) ? l8_(q.length, String) : [],
            z = _.length,
            Y = !!z;
        for (var A in q)
            if ((K || zy1.call(q, A)) && !(Y && (A == "length" || e8_(A, z)))) _.push(A);
        return _
    }

    function t8_(q) {
        if (!q1_(q)) return o8_(q);
        var K = [];
        for (var _ in Object(q))
            if (zy1.call(q, _) && _ != "constructor") K.push(_);
        return K
    }

    function e8_(q, K) {
        return K = K == null ? pCq : K, !!K && (typeof q == "number" || F8_.test(q)) && (q > -1 && q % 1 == 0 && q < K)
    }

    function q1_(q) {
        var K = q && q.constructor,
            _ = typeof K == "function" && K.prototype || AT8;
        return q === _
    }

    function K1_(q, K, _, z) {
        q = Yy1(q) ? q : X1_(q), _ = _ && !z ? j1_(_) : 0;
        var Y = q.length;
        if (_ < 0) _ = a8_(Y + _, 0);
        return O1_(q) ? _ <= Y && q.indexOf(K, _) > -1 : !!Y && d8_(q, K, _) > -1
    }

    function _1_(q) {
        return z1_(q) && zy1.call(q, "callee") && (!r8_.call(q, "callee") || OT8.call(q) == S8_)
    }
    var FCq = Array.isArray;

    function Yy1(q) {
        return q != null && A1_(q.length) && !Y1_(q)
    }

    function z1_(q) {
        return Ay1(q) && Yy1(q)
    }

    function Y1_(q) {
        var K = _y1(q) ? OT8.call(q) : "";
        return K == C8_ || K == b8_
    }

    function A1_(q) {
        return typeof q == "number" && q > -1 && q % 1 == 0 && q <= pCq
    }

    function _y1(q) {
        var K = typeof q;
        return !!q && (K == "object" || K == "function")
    }

    function Ay1(q) {
        return !!q && typeof q == "object"
    }

    function O1_(q) {
        return typeof q == "string" || !FCq(q) && Ay1(q) && OT8.call(q) == I8_
    }

    function w1_(q) {
        return typeof q == "symbol" || Ay1(q) && OT8.call(q) == x8_
    }

    function $1_(q) {
        if (!q) return q === 0 ? q : 0;
        if (q = H1_(q), q === mCq || q === -mCq) {
            var K = q < 0 ? -1 : 1;
            return K * R8_
        }
        return q === q ? q : 0
    }

    function j1_(q) {
        var K = $1_(q),
            _ = K % 1;
        return K === K ? _ ? K - _ : K : 0
    }

    function H1_(q) {
        if (typeof q == "number") return q;
        if (w1_(q)) return BCq;
        if (_y1(q)) {
            var K = typeof q.valueOf == "function" ? q.valueOf() : q;
            q = _y1(K) ? K + "" : K
        }
        if (typeof q != "string") return q === 0 ? q : +q;
        q = q.replace(u8_, "");
        var _ = B8_.test(q);
        return _ || p8_.test(q) ? g8_(q.slice(2), _ ? 2 : 8) : m8_.test(q) ? BCq : +q
    }

    function J1_(q) {
        return Yy1(q) ? s8_(q) : t8_(q)
    }

    function X1_(q) {
        return q ? n8_(q, J1_(q)) : []
    }
    gCq.exports = K1_
})
// @from(Ln 127611, Col 4)
dCq = p((NCO, QCq) => {
    var M1_ = "[object Boolean]",
        P1_ = Object.prototype,
        W1_ = P1_.toString;

    function D1_(q) {
        return q === !0 || q === !1 || Z1_(q) && W1_.call(q) == M1_
    }

    function Z1_(q) {
        return !!q && typeof q == "object"
    }
    QCq.exports = D1_
})
// @from(Ln 127625, Col 4)
rCq = p((ECO, iCq) => {
    var cCq = 1 / 0,
        f1_ = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        lCq = NaN,
        G1_ = "[object Symbol]",
        v1_ = /^\s+|\s+$/g,
        T1_ = /^[-+]0x[0-9a-f]+$/i,
        V1_ = /^0b[01]+$/i,
        k1_ = /^0o[0-7]+$/i,
        N1_ = parseInt,
        E1_ = Object.prototype,
        y1_ = E1_.toString;

    function L1_(q) {
        return typeof q == "number" && q == C1_(q)
    }

    function nCq(q) {
        var K = typeof q;
        return !!q && (K == "object" || K == "function")
    }

    function h1_(q) {
        return !!q && typeof q == "object"
    }

    function R1_(q) {
        return typeof q == "symbol" || h1_(q) && y1_.call(q) == G1_
    }

    function S1_(q) {
        if (!q) return q === 0 ? q : 0;
        if (q = b1_(q), q === cCq || q === -cCq) {
            var K = q < 0 ? -1 : 1;
            return K * f1_
        }
        return q === q ? q : 0
    }

    function C1_(q) {
        var K = S1_(q),
            _ = K % 1;
        return K === K ? _ ? K - _ : K : 0
    }

    function b1_(q) {
        if (typeof q == "number") return q;
        if (R1_(q)) return lCq;
        if (nCq(q)) {
            var K = typeof q.valueOf == "function" ? q.valueOf() : q;
            q = nCq(K) ? K + "" : K
        }
        if (typeof q != "string") return q === 0 ? q : +q;
        q = q.replace(v1_, "");
        var _ = V1_.test(q);
        return _ || k1_.test(q) ? N1_(q.slice(2), _ ? 2 : 8) : T1_.test(q) ? lCq : +q
    }
    iCq.exports = L1_
})
// @from(Ln 127684, Col 4)
aCq = p((yCO, oCq) => {
    var I1_ = "[object Number]",
        x1_ = Object.prototype,
        u1_ = x1_.toString;

    function m1_(q) {
        return !!q && typeof q == "object"
    }

    function B1_(q) {
        return typeof q == "number" || m1_(q) && u1_.call(q) == I1_
    }
    oCq.exports = B1_
})
// @from(Ln 127698, Col 4)
qbq = p((LCO, eCq) => {
    var p1_ = "[object Object]";

    function F1_(q) {
        var K = !1;
        if (q != null && typeof q.toString != "function") try {
            K = !!(q + "")
        } catch (_) {}
        return K
    }

    function g1_(q, K) {
        return function(_) {
            return q(K(_))
        }
    }
    var U1_ = Function.prototype,
        sCq = Object.prototype,
        tCq = U1_.toString,
        Q1_ = sCq.hasOwnProperty,
        d1_ = tCq.call(Object),
        c1_ = sCq.toString,
        l1_ = g1_(Object.getPrototypeOf, Object);

    function n1_(q) {
        return !!q && typeof q == "object"
    }

    function i1_(q) {
        if (!n1_(q) || c1_.call(q) != p1_ || F1_(q)) return !1;
        var K = l1_(q);
        if (K === null) return !0;
        var _ = Q1_.call(K, "constructor") && K.constructor;
        return typeof _ == "function" && _ instanceof _ && tCq.call(_) == d1_
    }
    eCq.exports = i1_
})
// @from(Ln 127735, Col 4)
_bq = p((hCO, Kbq) => {
    var r1_ = "[object String]",
        o1_ = Object.prototype,
        a1_ = o1_.toString,
        s1_ = Array.isArray;

    function t1_(q) {
        return !!q && typeof q == "object"
    }

    function e1_(q) {
        return typeof q == "string" || !s1_(q) && t1_(q) && a1_.call(q) == r1_
    }
    Kbq.exports = e1_
})
// @from(Ln 127750, Col 4)
wbq = p((RCO, Obq) => {
    var q7_ = "Expected a function",
        zbq = 1 / 0,
        K7_ = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Ybq = NaN,
        _7_ = "[object Symbol]",
        z7_ = /^\s+|\s+$/g,
        Y7_ = /^[-+]0x[0-9a-f]+$/i,
        A7_ = /^0b[01]+$/i,
        O7_ = /^0o[0-7]+$/i,
        w7_ = parseInt,
        $7_ = Object.prototype,
        j7_ = $7_.toString;

    function H7_(q, K) {
        var _;
        if (typeof K != "function") throw TypeError(q7_);
        return q = W7_(q),
            function() {
                if (--q > 0) _ = K.apply(this, arguments);
                if (q <= 1) K = void 0;
                return _
            }
    }

    function J7_(q) {
        return H7_(2, q)
    }

    function Abq(q) {
        var K = typeof q;
        return !!q && (K == "object" || K == "function")
    }

    function X7_(q) {
        return !!q && typeof q == "object"
    }

    function M7_(q) {
        return typeof q == "symbol" || X7_(q) && j7_.call(q) == _7_
    }

    function P7_(q) {
        if (!q) return q === 0 ? q : 0;
        if (q = D7_(q), q === zbq || q === -zbq) {
            var K = q < 0 ? -1 : 1;
            return K * K7_
        }
        return q === q ? q : 0
    }

    function W7_(q) {
        var K = P7_(q),
            _ = K % 1;
        return K === K ? _ ? K - _ : K : 0
    }

    function D7_(q) {
        if (typeof q == "number") return q;
        if (M7_(q)) return Ybq;
        if (Abq(q)) {
            var K = typeof q.valueOf == "function" ? q.valueOf() : q;
            q = Abq(K) ? K + "" : K
        }
        if (typeof q != "string") return q === 0 ? q : +q;
        q = q.replace(z7_, "");
        var _ = A7_.test(q);
        return _ || O7_.test(q) ? w7_(q.slice(2), _ ? 2 : 8) : Y7_.test(q) ? Ybq : +q
    }
    Obq.exports = J7_
})
// @from(Ln 127821, Col 4)
Dbq = p((SCO, Wbq) => {
    var $bq = BE1(),
        Z7_ = eE1(),
        f7_ = tE1(),
        jbq = CV6(),
        G7_ = UCq(),
        wT8 = dCq(),
        Hbq = rCq(),
        Oy1 = aCq(),
        Xbq = qbq(),
        xq6 = _bq(),
        v7_ = wbq(),
        {
            KeyObject: T7_,
            createSecretKey: V7_,
            createPrivateKey: k7_
        } = d6("crypto"),
        Mbq = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "HS256", "HS384", "HS512", "none"];
    if (Z7_) Mbq.splice(3, 0, "PS256", "PS384", "PS512");
    var N7_ = {
            expiresIn: {
                isValid: function(q) {
                    return Hbq(q) || xq6(q) && q
                },
                message: '"expiresIn" should be a number of seconds or string representing a timespan'
            },
            notBefore: {
                isValid: function(q) {
                    return Hbq(q) || xq6(q) && q
                },
                message: '"notBefore" should be a number of seconds or string representing a timespan'
            },
            audience: {
                isValid: function(q) {
                    return xq6(q) || Array.isArray(q)
                },
                message: '"audience" must be a string or array'
            },
            algorithm: {
                isValid: G7_.bind(null, Mbq),
                message: '"algorithm" must be a valid string enum value'
            },
            header: {
                isValid: Xbq,
                message: '"header" must be an object'
            },
            encoding: {
                isValid: xq6,
                message: '"encoding" must be a string'
            },
            issuer: {
                isValid: xq6,
                message: '"issuer" must be a string'
            },
            subject: {
                isValid: xq6,
                message: '"subject" must be a string'
            },
            jwtid: {
                isValid: xq6,
                message: '"jwtid" must be a string'
            },
            noTimestamp: {
                isValid: wT8,
                message: '"noTimestamp" must be a boolean'
            },
            keyid: {
                isValid: xq6,
                message: '"keyid" must be a string'
            },
            mutatePayload: {
                isValid: wT8,
                message: '"mutatePayload" must be a boolean'
            },
            allowInsecureKeySizes: {
                isValid: wT8,
                message: '"allowInsecureKeySizes" must be a boolean'
            },
            allowInvalidAsymmetricKeyTypes: {
                isValid: wT8,
                message: '"allowInvalidAsymmetricKeyTypes" must be a boolean'
            }
        },
        E7_ = {
            iat: {
                isValid: Oy1,
                message: '"iat" should be a number of seconds'
            },
            exp: {
                isValid: Oy1,
                message: '"exp" should be a number of seconds'
            },
            nbf: {
                isValid: Oy1,
                message: '"nbf" should be a number of seconds'
            }
        };

    function Pbq(q, K, _, z) {
        if (!Xbq(_)) throw Error('Expected "' + z + '" to be a plain object.');
        Object.keys(_).forEach(function(Y) {
            let A = q[Y];
            if (!A) {
                if (!K) throw Error('"' + Y + '" is not allowed in "' + z + '"');
                return
            }
            if (!A.isValid(_[Y])) throw Error(A.message)
        })
    }

    function y7_(q) {
        return Pbq(N7_, !1, q, "options")
    }

    function L7_(q) {
        return Pbq(E7_, !0, q, "payload")
    }
    var Jbq = {
            audience: "aud",
            issuer: "iss",
            subject: "sub",
            jwtid: "jti"
        },
        h7_ = ["expiresIn", "notBefore", "noTimestamp", "audience", "issuer", "subject", "jwtid"];
    Wbq.exports = function(q, K, _, z) {
        if (typeof _ === "function") z = _, _ = {};
        else _ = _ || {};
        let Y = typeof q === "object" && !Buffer.isBuffer(q),
            A = Object.assign({
                alg: _.algorithm || "HS256",
                typ: Y ? "JWT" : void 0,
                kid: _.keyid
            }, _.header);

        function O(j) {
            if (z) return z(j);
            throw j
        }
        if (!K && _.algorithm !== "none") return O(Error("secretOrPrivateKey must have a value"));
        if (K != null && !(K instanceof T7_)) try {
            K = k7_(K)
        } catch (j) {
            try {
                K = V7_(typeof K === "string" ? Buffer.from(K) : K)
            } catch (H) {
                return O(Error("secretOrPrivateKey is not valid key material"))
            }
        }
        if (A.alg.startsWith("HS") && K.type !== "secret") return O(Error(`secretOrPrivateKey must be a symmetric key when using ${A.alg}`));
        else if (/^(?:RS|PS|ES)/.test(A.alg)) {
            if (K.type !== "private") return O(Error(`secretOrPrivateKey must be an asymmetric key when using ${A.alg}`));
            if (!_.allowInsecureKeySizes && !A.alg.startsWith("ES") && K.asymmetricKeyDetails !== void 0 && K.asymmetricKeyDetails.modulusLength < 2048) return O(Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${A.alg}`))
        }
        if (typeof q > "u") return O(Error("payload is required"));
        else if (Y) {
            try {
                L7_(q)
            } catch (j) {
                return O(j)
            }
            if (!_.mutatePayload) q = Object.assign({}, q)
        } else {
            let j = h7_.filter(function(H) {
                return typeof _[H] < "u"
            });
            if (j.length > 0) return O(Error("invalid " + j.join(",") + " option for " + typeof q + " payload"))
        }
        if (typeof q.exp < "u" && typeof _.expiresIn < "u") return O(Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
        if (typeof q.nbf < "u" && typeof _.notBefore < "u") return O(Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
        try {
            y7_(_)
        } catch (j) {
            return O(j)
        }
        if (!_.allowInvalidAsymmetricKeyTypes) try {
            f7_(A.alg, K)
        } catch (j) {
            return O(j)
        }
        let w = q.iat || Math.floor(Date.now() / 1000);
        if (_.noTimestamp) delete q.iat;
        else if (Y) q.iat = w;
        if (typeof _.notBefore < "u") {
            try {
                q.nbf = $bq(_.notBefore, w)
            } catch (j) {
                return O(j)
            }
            if (typeof q.nbf > "u") return O(Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'))
        }
        if (typeof _.expiresIn < "u" && typeof q === "object") {
            try {
                q.exp = $bq(_.expiresIn, w)
            } catch (j) {
                return O(j)
            }
            if (typeof q.exp > "u") return O(Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'))
        }
        Object.keys(Jbq).forEach(function(j) {
            let H = Jbq[j];
            if (typeof _[j] < "u") {
                if (typeof q[H] < "u") return O(Error('Bad "options.' + j + '" option. The payload already has an "' + H + '" property.'));
                q[H] = _[j]
            }
        });
        let $ = _.encoding || "utf8";
        if (typeof z === "function") z = z && v7_(z), jbq.createSign({
            header: A,
            privateKey: K,
            payload: q,
            encoding: $
        }).once("error", z).once("done", function(j) {
            if (!_.allowInsecureKeySizes && /^(?:RS|PS)/.test(A.alg) && j.length < 256) return z(Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${A.alg}`));
            z(null, j)
        });
        else {
            let j = jbq.sign({
                header: A,
                payload: q,
                secret: K,
                encoding: $
            });
            if (!_.allowInsecureKeySizes && /^(?:RS|PS)/.test(A.alg) && j.length < 256) throw Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${A.alg}`);
            return j
        }
    }
})
// @from(Ln 128048, Col 4)
fbq = p((CCO, Zbq) => {
    Zbq.exports = {
        decode: xE1(),
        verify: uCq(),
        sign: Dbq(),
        JsonWebTokenError: fr6(),
        NotBeforeError: uE1(),
        TokenExpiredError: mE1()
    }
})
// @from(Ln 128058, Col 0)
class TB {
    static fromAssertion(q) {
        let K = new TB;
        return K.jwt = q, K
    }
    static fromCertificate(q, K, _) {
        let z = new TB;
        if (z.privateKey = K, z.thumbprint = q, z.useSha256 = !1, _) z.publicCertificate = this.parseCertificate(_);
        return z
    }
    static fromCertificateWithSha256Thumbprint(q, K, _) {
        let z = new TB;
        if (z.privateKey = K, z.thumbprint = q, z.useSha256 = !0, _) z.publicCertificate = this.parseCertificate(_);
        return z
    }
    getJwt(q, K, _) {
        if (this.privateKey && this.thumbprint) {
            if (this.jwt && !this.isExpired() && K === this.issuer && _ === this.jwtAudience) return this.jwt;
            return this.createJwt(q, K, _)
        }
        if (this.jwt) return this.jwt;
        throw k7(ow.invalidAssertion)
    }
    createJwt(q, K, _) {
        this.issuer = K, this.jwtAudience = _;
        let z = wj.nowSeconds();
        this.expirationTime = z + 600;
        let A = {
                alg: this.useSha256 ? rb.PSS_256 : rb.RSA_256
            },
            O = this.useSha256 ? rb.X5T_256 : rb.X5T;
        if (Object.assign(A, {
                [O]: uE.base64EncodeUrl(this.thumbprint, jf.HEX)
            }), this.publicCertificate) Object.assign(A, {
            [rb.X5C]: this.publicCertificate
        });
        let w = {
            [rb.AUDIENCE]: this.jwtAudience,
            [rb.EXPIRATION_TIME]: this.expirationTime,
            [rb.ISSUER]: this.issuer,
            [rb.SUBJECT]: this.issuer,
            [rb.NOT_BEFORE]: z,
            [rb.JWT_ID]: q.createNewGuid()
        };
        return this.jwt = Gbq.default.sign(w, this.privateKey, {
            header: A
        }), this.jwt
    }
    isExpired() {
        return this.expirationTime < wj.nowSeconds()
    }
    static parseCertificate(q) {
        let K = /-----BEGIN CERTIFICATE-----\r*\n(.+?)\r*\n-----END CERTIFICATE-----/gs,
            _ = [],
            z;
        while ((z = K.exec(q)) !== null) _.push(z[1].replace(/\r*\n/g, q7.EMPTY_STRING));
        return _
    }
}
// @from(Ln 128117, Col 4)
Gbq
// @from(Ln 128118, Col 4)
$T8 = L(() => {
    cO();
    Jr6();
    jj();
    Gbq = K6(fbq(), 1); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 128124, Col 4)
jT8 = "@azure/msal-node"
// @from(Ln 128125, Col 4)
VB = "3.8.1"
// @from(Ln 128126, Col 4)
xV6 = L(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 128128, Col 4)
Lr6
// @from(Ln 128129, Col 4)
wy1 = L(() => {
    cO(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    Lr6 = class Lr6 extends Iv {
        constructor(q) {
            super(q)
        }
        async acquireToken(q) {
            this.logger.info("in acquireToken call in username-password client");
            let K = wj.nowSeconds(),
                _ = await this.executeTokenRequest(this.authority, q),
                z = new wX(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
            return z.validateTokenResponse(_.body), z.handleServerTokenResponse(_.body, this.authority, K, q)
        }
        async executeTokenRequest(q, K) {
            let _ = this.createTokenQueryParameters(K),
                z = l9.appendQueryString(q.tokenEndpoint, _),
                Y = await this.createTokenRequestBody(K),
                A = this.createTokenRequestHeaders({
                    credential: K.username,
                    type: dV.UPN
                }),
                O = {
                    clientId: this.config.authOptions.clientId,
                    authority: q.canonicalAuthority,
                    scopes: K.scopes,
                    claims: K.claims,
                    authenticationScheme: K.authenticationScheme,
                    resourceRequestMethod: K.resourceRequestMethod,
                    resourceRequestUri: K.resourceRequestUri,
                    shrClaims: K.shrClaims,
                    sshKid: K.sshKid
                };
            return this.executePostToTokenEndpoint(z, Y, A, O, K.correlationId)
        }
        async createTokenRequestBody(q) {
            let K = new Map;
            if (b4.addClientId(K, this.config.authOptions.clientId), b4.addUsername(K, q.username), b4.addPassword(K, q.password), b4.addScopes(K, q.scopes), b4.addResponseType(K, AV6.IDTOKEN_TOKEN), b4.addGrantType(K, bE.RESOURCE_OWNER_PASSWORD_GRANT), b4.addClientInfo(K), b4.addLibraryInfo(K, this.config.libraryInfo), b4.addApplicationTelemetry(K, this.config.telemetry.application), b4.addThrottling(K), this.serverTelemetryManager) b4.addServerTelemetry(K, this.serverTelemetryManager);
            let _ = q.correlationId || this.config.cryptoInterface.createNewGuid();
            if (b4.addCorrelationId(K, _), this.config.clientCredentials.clientSecret) b4.addClientSecret(K, this.config.clientCredentials.clientSecret);
            let z = this.config.clientCredentials.clientAssertion;
            if (z) b4.addClientAssertion(K, await nV(z.assertion, this.config.authOptions.clientId, q.resourceRequestUri)), b4.addClientAssertionType(K, z.assertionType);
            if (!b2.isEmptyObj(q.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) b4.addClaims(K, q.claims, this.config.authOptions.clientCapabilities);
            if (this.config.systemOptions.preventCorsPreflight && q.username) b4.addCcsUpn(K, q.username);
            return Hf.mapToQueryString(K)
        }
    }
})
// @from(Ln 128177, Col 0)
function vbq(q, K, _, z) {
    let Y = zr6.getStandardAuthorizeRequestParameters({
        ...q.auth,
        authority: K,
        redirectUri: _.redirectUri || ""
    }, _, z);
    if (b4.addLibraryInfo(Y, {
            sku: iV.MSAL_SKU,
            version: VB,
            cpu: process.arch || "",
            os: process.platform || ""
        }), q.auth.protocolMode !== bv.OIDC) b4.addApplicationTelemetry(Y, q.telemetry.application);
    if (b4.addResponseType(Y, AV6.CODE), _.codeChallenge && _.codeChallengeMethod) b4.addCodeChallengeParams(Y, _.codeChallenge, _.codeChallengeMethod);
    return b4.addExtraQueryParameters(Y, _.extraQueryParameters || {}), zr6.getAuthorizeUrl(K, Y, q.auth.encodeExtraQueryParams, _.extraQueryParameters)
}
// @from(Ln 128192, Col 4)
Tbq = L(() => {
    cO();
    jj();
    xV6(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 128197, Col 0)
class $26 {
    constructor(q) {
        this.config = cLq(q), this.cryptoProvider = new co, this.logger = new IE(this.config.system.loggerOptions, jT8, VB), this.storage = new A26(this.logger, this.config.auth.clientId, this.cryptoProvider, tN1(this.config.auth)), this.tokenCache = new Pr6(this.storage, this.logger, this.config.cache.cachePlugin)
    }
    async getAuthCodeUrl(q) {
        this.logger.info("getAuthCodeUrl called", q.correlationId);
        let K = {
                ...q,
                ...await this.initializeBaseRequest(q),
                responseMode: q.responseMode || xQ.QUERY,
                authenticationScheme: hz.BEARER,
                state: q.state || "",
                nonce: q.nonce || ""
            },
            _ = await this.createAuthority(K.authority, K.correlationId, void 0, q.azureCloudOptions);
        return vbq(this.config, _, K, this.logger)
    }
    async acquireTokenByCode(q, K) {
        if (this.logger.info("acquireTokenByCode called"), q.state && K) this.logger.info("acquireTokenByCode - validating state"), this.validateState(q.state, K.state || ""), K = {
            ...K,
            state: ""
        };
        let _ = {
                ...q,
                ...await this.initializeBaseRequest(q),
                authenticationScheme: hz.BEARER
            },
            z = this.initializeServerTelemetryManager(Uo.acquireTokenByCode, _.correlationId);
        try {
            let Y = await this.createAuthority(_.authority, _.correlationId, void 0, q.azureCloudOptions),
                A = await this.buildOauthClientConfiguration(Y, _.correlationId, _.redirectUri, z),
                O = new Pv8(A);
            return this.logger.verbose("Auth code client created", _.correlationId), await O.acquireToken(_, K)
        } catch (Y) {
            if (Y instanceof G9) Y.setCorrelationId(_.correlationId);
            throw z.cacheFailedRequest(Y), Y
        }
    }
    async acquireTokenByRefreshToken(q) {
        this.logger.info("acquireTokenByRefreshToken called", q.correlationId);
        let K = {
                ...q,
                ...await this.initializeBaseRequest(q),
                authenticationScheme: hz.BEARER
            },
            _ = this.initializeServerTelemetryManager(Uo.acquireTokenByRefreshToken, K.correlationId);
        try {
            let z = await this.createAuthority(K.authority, K.correlationId, void 0, q.azureCloudOptions),
                Y = await this.buildOauthClientConfiguration(z, K.correlationId, K.redirectUri || "", _),
                A = new EV6(Y);
            return this.logger.verbose("Refresh token client created", K.correlationId), await A.acquireToken(K)
        } catch (z) {
            if (z instanceof G9) z.setCorrelationId(K.correlationId);
            throw _.cacheFailedRequest(z), z
        }
    }
    async acquireTokenSilent(q) {
        let K = {
                ...q,
                ...await this.initializeBaseRequest(q),
                forceRefresh: q.forceRefresh || !1
            },
            _ = this.initializeServerTelemetryManager(Uo.acquireTokenSilent, K.correlationId, K.forceRefresh);
        try {
            let z = await this.createAuthority(K.authority, K.correlationId, void 0, q.azureCloudOptions),
                Y = await this.buildOauthClientConfiguration(z, K.correlationId, K.redirectUri || "", _),
                A = new Wv8(Y);
            this.logger.verbose("Silent flow client created", K.correlationId);
            try {
                return await this.tokenCache.overwriteCache(), await this.acquireCachedTokenSilent(K, A, Y)
            } catch (O) {
                if (O instanceof Tq6 && O.errorCode === ow.tokenRefreshRequired) return new EV6(Y).acquireTokenByRefreshToken(K);
                throw O
            }
        } catch (z) {
            if (z instanceof G9) z.setCorrelationId(K.correlationId);
            throw _.cacheFailedRequest(z), z
        }
    }
    async acquireCachedTokenSilent(q, K, _) {
        let [z, Y] = await K.acquireCachedToken({
            ...q,
            scopes: q.scopes?.length ? q.scopes : [...Cv]
        });
        if (Y === C2.PROACTIVELY_REFRESHED) {
            this.logger.info("ClientApplication:acquireCachedTokenSilent - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
            let A = new EV6(_);
            try {
                await A.acquireTokenByRefreshToken(q)
            } catch {}
        }
        return z
    }
    async acquireTokenByUsernamePassword(q) {
        this.logger.info("acquireTokenByUsernamePassword called", q.correlationId);
        let K = {
                ...q,
                ...await this.initializeBaseRequest(q)
            },
            _ = this.initializeServerTelemetryManager(Uo.acquireTokenByUsernamePassword, K.correlationId);
        try {
            let z = await this.createAuthority(K.authority, K.correlationId, void 0, q.azureCloudOptions),
                Y = await this.buildOauthClientConfiguration(z, K.correlationId, "", _),
                A = new Lr6(Y);
            return this.logger.verbose("Username password client created", K.correlationId), await A.acquireToken(K)
        } catch (z) {
            if (z instanceof G9) z.setCorrelationId(K.correlationId);
            throw _.cacheFailedRequest(z), z
        }
    }
    getTokenCache() {
        return this.logger.info("getTokenCache called"), this.tokenCache
    }
    validateState(q, K) {
        if (!q) throw YH.createStateNotFoundError();
        if (q !== K) throw k7(ow.stateMismatch)
    }
    getLogger() {
        return this.logger
    }
    setLogger(q) {
        this.logger = q
    }
    async buildOauthClientConfiguration(q, K, _, z) {
        return this.logger.verbose("buildOauthClientConfiguration called", K), this.logger.info(`Building oauth client configuration with the following authority: ${q.tokenEndpoint}.`, K), z?.updateRegionDiscoveryMetadata(q.regionDiscoveryMetadata), {
            authOptions: {
                clientId: this.config.auth.clientId,
                authority: q,
                clientCapabilities: this.config.auth.clientCapabilities,
                redirectUri: _
            },
            loggerOptions: {
                logLevel: this.config.system.loggerOptions.logLevel,
                loggerCallback: this.config.system.loggerOptions.loggerCallback,
                piiLoggingEnabled: this.config.system.loggerOptions.piiLoggingEnabled,
                correlationId: K
            },
            cacheOptions: {
                claimsBasedCachingEnabled: this.config.cache.claimsBasedCachingEnabled
            },
            cryptoInterface: this.cryptoProvider,
            networkInterface: this.config.system.networkClient,
            storageInterface: this.storage,
            serverTelemetryManager: z,
            clientCredentials: {
                clientSecret: this.clientSecret,
                clientAssertion: await this.getClientAssertion(q)
            },
            libraryInfo: {
                sku: iV.MSAL_SKU,
                version: VB,
                cpu: process.arch || q7.EMPTY_STRING,
                os: process.platform || q7.EMPTY_STRING
            },
            telemetry: this.config.telemetry,
            persistencePlugin: this.config.cache.cachePlugin,
            serializableCache: this.tokenCache
        }
    }
    async getClientAssertion(q) {
        if (this.developerProvidedClientAssertion) this.clientAssertion = TB.fromAssertion(await nV(this.developerProvidedClientAssertion, this.config.auth.clientId, q.tokenEndpoint));
        return this.clientAssertion && {
            assertion: this.clientAssertion.getJwt(this.cryptoProvider, this.config.auth.clientId, q.tokenEndpoint),
            assertionType: iV.JWT_BEARER_ASSERTION_TYPE
        }
    }
    async initializeBaseRequest(q) {
        if (this.logger.verbose("initializeRequestScopes called", q.correlationId), q.authenticationScheme && q.authenticationScheme === hz.POP) this.logger.verbose("Authentication Scheme 'pop' is not supported yet, setting Authentication Scheme to 'Bearer' for request", q.correlationId);
        if (q.authenticationScheme = hz.BEARER, this.config.cache.claimsBasedCachingEnabled && q.claims && !b2.isEmptyObj(q.claims)) q.requestedClaimsHash = await this.cryptoProvider.hashString(q.claims);
        return {
            ...q,
            scopes: [...q && q.scopes || [], ...Cv],
            correlationId: q && q.correlationId || this.cryptoProvider.createNewGuid(),
            authority: q.authority || this.config.auth.authority
        }
    }
    initializeServerTelemetryManager(q, K, _) {
        let z = {
            clientId: this.config.auth.clientId,
            correlationId: K,
            apiId: q,
            forceRefresh: _ || !1
        };
        return new Cq6(z, this.storage)
    }
    async createAuthority(q, K, _, z) {
        this.logger.verbose("createAuthority called", K);
        let Y = gW.generateAuthority(q, z || this.config.auth.azureCloudOptions),
            A = {
                protocolMode: this.config.auth.protocolMode,
                knownAuthorities: this.config.auth.knownAuthorities,
                cloudDiscoveryMetadata: this.config.auth.cloudDiscoveryMetadata,
                authorityMetadata: this.config.auth.authorityMetadata,
                azureRegionConfiguration: _,
                skipAuthorityMetadataCache: this.config.auth.skipAuthorityMetadataCache
            };
        return _v8.createDiscoveredInstance(Y, this.config.system.networkClient, this.storage, A, this.logger, K)
    }
    clearCache() {
        this.storage.clear()
    }
}
// @from(Ln 128399, Col 4)
HT8 = L(() => {
    cO();
    ME1();
    Xr6();
    Iv8();
    jj();
    VE1();
    $T8();
    xV6();
    wr6();
    wy1();
    Tbq(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 128413, Col 0)
class $y1 {
    async listenForAuthCode(q, K) {
        if (this.server) throw YH.createLoopbackServerAlreadyExistsError();
        return new Promise((_, z) => {
            this.server = R7_.createServer((Y, A) => {
                let O = Y.url;
                if (!O) {
                    A.end(K || "Error occurred loading redirectUrl"), z(YH.createUnableToLoadRedirectUrlError());
                    return
                } else if (O === q7.FORWARD_SLASH) {
                    A.end(q || "Auth code was successfully acquired. You can close this window now.");
                    return
                }
                let w = this.getRedirectUri(),
                    $ = new URL(O, w),
                    j = Hf.getDeserializedResponse($.search) || {};
                if (j.code) A.writeHead(f9.REDIRECT, {
                    location: w
                }), A.end();
                if (j.error) A.end(K || `Error occurred: ${j.error}`);
                _(j)
            }), this.server.listen(0, "127.0.0.1")
        })
    }
    getRedirectUri() {
        if (!this.server || !this.server.listening) throw YH.createNoLoopbackServerExistsError();
        let q = this.server.address();
        if (!q || typeof q === "string" || !q.port) throw this.closeServer(), YH.createInvalidLoopbackAddressTypeError();
        let K = q && q.port;
        return `${iV.HTTP_PROTOCOL}${iV.LOCALHOST}:${K}`
    }
    closeServer() {
        if (this.server) {
            if (this.server.close(), typeof this.server.closeAllConnections === "function") this.server.closeAllConnections();
            this.server.unref(), this.server = void 0
        }
    }
}
// @from(Ln 128451, Col 4)
Vbq = L(() => {
    cO();
    wr6();
    jj(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 128456, Col 4)
hr6
// @from(Ln 128457, Col 4)
jy1 = L(() => {
    cO(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    hr6 = class hr6 extends Iv {
        constructor(q) {
            super(q)
        }
        async acquireToken(q) {
            let K = await this.getDeviceCode(q);
            q.deviceCodeCallback(K);
            let _ = wj.nowSeconds(),
                z = await this.acquireTokenWithDeviceCode(q, K),
                Y = new wX(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
            return Y.validateTokenResponse(z), Y.handleServerTokenResponse(z, this.authority, _, q)
        }
        async getDeviceCode(q) {
            let K = this.createExtraQueryParameters(q),
                _ = l9.appendQueryString(this.authority.deviceCodeEndpoint, K),
                z = this.createQueryString(q),
                Y = this.createTokenRequestHeaders(),
                A = {
                    clientId: this.config.authOptions.clientId,
                    authority: q.authority,
                    scopes: q.scopes,
                    claims: q.claims,
                    authenticationScheme: q.authenticationScheme,
                    resourceRequestMethod: q.resourceRequestMethod,
                    resourceRequestUri: q.resourceRequestUri,
                    shrClaims: q.shrClaims,
                    sshKid: q.sshKid
                };
            return this.executePostRequestToDeviceCodeEndpoint(_, z, Y, A, q.correlationId)
        }
        createExtraQueryParameters(q) {
            let K = new Map;
            if (q.extraQueryParameters) b4.addExtraQueryParameters(K, q.extraQueryParameters);
            return Hf.mapToQueryString(K)
        }
        async executePostRequestToDeviceCodeEndpoint(q, K, _, z, Y) {
            let {
                body: {
                    user_code: A,
                    device_code: O,
                    verification_uri: w,
                    expires_in: $,
                    interval: j,
                    message: H
                }
            } = await this.sendPostRequest(z, q, {
                body: K,
                headers: _
            }, Y);
            return {
                userCode: A,
                deviceCode: O,
                verificationUri: w,
                expiresIn: $,
                interval: j,
                message: H
            }
        }
        createQueryString(q) {
            let K = new Map;
            if (b4.addScopes(K, q.scopes), b4.addClientId(K, this.config.authOptions.clientId), q.extraQueryParameters) b4.addExtraQueryParameters(K, q.extraQueryParameters);
            if (q.claims || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) b4.addClaims(K, q.claims, this.config.authOptions.clientCapabilities);
            return Hf.mapToQueryString(K)
        }
        continuePolling(q, K, _) {
            if (_) throw this.logger.error("Token request cancelled by setting DeviceCodeRequest.cancel = true"), k7(ow.deviceCodePollingCancelled);
            else if (K && K < q && wj.nowSeconds() > K) throw this.logger.error(`User defined timeout for device code polling reached. The timeout was set for ${K}`), k7(ow.userTimeoutReached);
            else if (wj.nowSeconds() > q) {
                if (K) this.logger.verbose(`User specified timeout ignored as the device code has expired before the timeout elapsed. The user specified timeout was set for ${K}`);
                throw this.logger.error(`Device code expired. Expiration time of device code was ${q}`), k7(ow.deviceCodeExpired)
            }
            return !0
        }
        async acquireTokenWithDeviceCode(q, K) {
            let _ = this.createTokenQueryParameters(q),
                z = l9.appendQueryString(this.authority.tokenEndpoint, _),
                Y = this.createTokenRequestBody(q, K),
                A = this.createTokenRequestHeaders(),
                O = q.timeout ? wj.nowSeconds() + q.timeout : void 0,
                w = wj.nowSeconds() + K.expiresIn,
                $ = K.interval * 1000;
            while (this.continuePolling(w, O, q.cancel)) {
                let j = {
                        clientId: this.config.authOptions.clientId,
                        authority: q.authority,
                        scopes: q.scopes,
                        claims: q.claims,
                        authenticationScheme: q.authenticationScheme,
                        resourceRequestMethod: q.resourceRequestMethod,
                        resourceRequestUri: q.resourceRequestUri,
                        shrClaims: q.shrClaims,
                        sshKid: q.sshKid
                    },
                    H = await this.executePostToTokenEndpoint(z, Y, A, j, q.correlationId);
                if (H.body && H.body.error)
                    if (H.body.error === q7.AUTHORIZATION_PENDING) this.logger.info("Authorization pending. Continue polling."), await wj.delay($);
                    else throw this.logger.info("Unexpected error in polling from the server"), Bk1($V6.postRequestFailed, H.body.error);
                else return this.logger.verbose("Authorization completed successfully. Polling stopped."), H.body
            }
            throw this.logger.error("Polling stopped for unknown reasons."), k7(ow.deviceCodeUnknownError)
        }
        createTokenRequestBody(q, K) {
            let _ = new Map;
            b4.addScopes(_, q.scopes), b4.addClientId(_, this.config.authOptions.clientId), b4.addGrantType(_, bE.DEVICE_CODE_GRANT), b4.addDeviceCode(_, K.deviceCode);
            let z = q.correlationId || this.config.cryptoInterface.createNewGuid();
            if (b4.addCorrelationId(_, z), b4.addClientInfo(_), b4.addLibraryInfo(_, this.config.libraryInfo), b4.addApplicationTelemetry(_, this.config.telemetry.application), b4.addThrottling(_), this.serverTelemetryManager) b4.addServerTelemetry(_, this.serverTelemetryManager);
            if (!b2.isEmptyObj(q.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) b4.addClaims(_, q.claims, this.config.authOptions.clientCapabilities);
            return Hf.mapToQueryString(_)
        }
    }
})
// @from(Ln 128570, Col 4)
Rr6
// @from(Ln 128571, Col 4)
kbq = L(() => {
    jj();
    cO();
    HT8();
    wr6();
    Vbq();
    jy1();
    xV6(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    Rr6 = class Rr6 extends $26 {
        constructor(q) {
            super(q);
            if (this.config.broker.nativeBrokerPlugin)
                if (this.config.broker.nativeBrokerPlugin.isBrokerAvailable) this.nativeBrokerPlugin = this.config.broker.nativeBrokerPlugin, this.nativeBrokerPlugin.setLogger(this.config.system.loggerOptions);
                else this.logger.warning("NativeBroker implementation was provided but the broker is unavailable.");
            this.skus = Cq6.makeExtraSkuString({
                libraryName: iV.MSAL_SKU,
                libraryVersion: VB
            })
        }
        async acquireTokenByDeviceCode(q) {
            this.logger.info("acquireTokenByDeviceCode called", q.correlationId);
            let K = Object.assign(q, await this.initializeBaseRequest(q)),
                _ = this.initializeServerTelemetryManager(Uo.acquireTokenByDeviceCode, K.correlationId);
            try {
                let z = await this.createAuthority(K.authority, K.correlationId, void 0, q.azureCloudOptions),
                    Y = await this.buildOauthClientConfiguration(z, K.correlationId, "", _),
                    A = new hr6(Y);
                return this.logger.verbose("Device code client created", K.correlationId), await A.acquireToken(K)
            } catch (z) {
                if (z instanceof G9) z.setCorrelationId(K.correlationId);
                throw _.cacheFailedRequest(z), z
            }
        }
        async acquireTokenInteractive(q) {
            let K = q.correlationId || this.cryptoProvider.createNewGuid();
            this.logger.trace("acquireTokenInteractive called", K);
            let {
                openBrowser: _,
                successTemplate: z,
                errorTemplate: Y,
                windowHandle: A,
                loopbackClient: O,
                ...w
            } = q;
            if (this.nativeBrokerPlugin) {
                let M = {
                    ...w,
                    clientId: this.config.auth.clientId,
                    scopes: q.scopes || Cv,
                    redirectUri: q.redirectUri || "",
                    authority: q.authority || this.config.auth.authority,
                    correlationId: K,
                    extraParameters: {
                        ...w.extraQueryParameters,
                        ...w.tokenQueryParameters,
                        [iw6.X_CLIENT_EXTRA_SKU]: this.skus
                    },
                    accountId: w.account?.nativeAccountId
                };
                return this.nativeBrokerPlugin.acquireTokenInteractive(M, A)
            }
            if (q.redirectUri) {
                if (!this.config.broker.nativeBrokerPlugin) throw YH.createRedirectUriNotSupportedError();
                q.redirectUri = ""
            }
            let {
                verifier: $,
                challenge: j
            } = await this.cryptoProvider.generatePkceCodes(), H = O || new $y1, J = {}, X = null;
            try {
                let M = H.listenForAuthCode(z, Y).then((f) => {
                        J = f
                    }).catch((f) => {
                        X = f
                    }),
                    P = await this.waitForRedirectUri(H),
                    W = {
                        ...w,
                        correlationId: K,
                        scopes: q.scopes || Cv,
                        redirectUri: P,
                        responseMode: xQ.QUERY,
                        codeChallenge: j,
                        codeChallengeMethod: hG8.S256
                    },
                    D = await this.getAuthCodeUrl(W);
                if (await _(D), await M, X) throw X;
                if (J.error) throw new lV(J.error, J.error_description, J.suberror);
                else if (!J.code) throw YH.createNoAuthCodeInResponseError();
                let Z = J.client_info,
                    G = {
                        code: J.code,
                        codeVerifier: $,
                        clientInfo: Z || q7.EMPTY_STRING,
                        ...W
                    };
                return await this.acquireTokenByCode(G)
            } finally {
                H.closeServer()
            }
        }
        async acquireTokenSilent(q) {
            let K = q.correlationId || this.cryptoProvider.createNewGuid();
            if (this.logger.trace("acquireTokenSilent called", K), this.nativeBrokerPlugin) {
                let _ = {
                    ...q,
                    clientId: this.config.auth.clientId,
                    scopes: q.scopes || Cv,
                    redirectUri: q.redirectUri || "",
                    authority: q.authority || this.config.auth.authority,
                    correlationId: K,
                    extraParameters: {
                        ...q.tokenQueryParameters,
                        [iw6.X_CLIENT_EXTRA_SKU]: this.skus
                    },
                    accountId: q.account.nativeAccountId,
                    forceRefresh: q.forceRefresh || !1
                };
                return this.nativeBrokerPlugin.acquireTokenSilent(_)
            }
            if (q.redirectUri) {
                if (!this.config.broker.nativeBrokerPlugin) throw YH.createRedirectUriNotSupportedError();
                q.redirectUri = ""
            }
            return super.acquireTokenSilent(q)
        }
        async signOut(q) {
            if (this.nativeBrokerPlugin && q.account.nativeAccountId) {
                let K = {
                    clientId: this.config.auth.clientId,
                    accountId: q.account.nativeAccountId,
                    correlationId: q.correlationId || this.cryptoProvider.createNewGuid()
                };
                await this.nativeBrokerPlugin.signOut(K)
            }
            await this.getTokenCache().removeAccount(q.account, q.correlationId)
        }
        async getAllAccounts() {
            if (this.nativeBrokerPlugin) {
                let q = this.cryptoProvider.createNewGuid();
                return this.nativeBrokerPlugin.getAllAccounts(this.config.auth.clientId, q)
            }
            return this.getTokenCache().getAllAccounts()
        }
        async waitForRedirectUri(q) {
            return new Promise((K, _) => {
                let z = 0,
                    Y = setInterval(() => {
                        if (Gv8.TIMEOUT_MS / Gv8.INTERVAL_MS < z) {
                            clearInterval(Y), _(YH.createLoopbackServerTimeoutError());
                            return
                        }
                        try {
                            let A = q.getRedirectUri();
                            clearInterval(Y), K(A);
                            return
                        } catch (A) {
                            if (A instanceof G9 && A.errorCode === NP.noLoopbackServerExists.code) {
                                z++;
                                return
                            }
                            clearInterval(Y), _(A);
                            return
                        }
                    }, Gv8.INTERVAL_MS)
            })
        }
    }
})
// @from(Ln 128740, Col 4)
j26
// @from(Ln 128741, Col 4)
JT8 = L(() => {
    cO(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    j26 = class j26 extends Iv {
        constructor(q, K) {
            super(q);
            this.appTokenProvider = K
        }
        async acquireToken(q) {
            if (q.skipCache || q.claims) return this.executeTokenRequest(q, this.authority);
            let [K, _] = await this.getCachedAuthenticationResult(q, this.config, this.cryptoUtils, this.authority, this.cacheManager, this.serverTelemetryManager);
            if (K) {
                if (_ === C2.PROACTIVELY_REFRESHED) {
                    this.logger.info("ClientCredentialClient:getCachedAuthenticationResult - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
                    let z = !0;
                    await this.executeTokenRequest(q, this.authority, z)
                }
                return K
            } else return this.executeTokenRequest(q, this.authority)
        }
        async getCachedAuthenticationResult(q, K, _, z, Y, A) {
            let O = K,
                w = K,
                $ = C2.NOT_APPLICABLE,
                j;
            if (O.serializableCache && O.persistencePlugin) j = new ib(O.serializableCache, !1), await O.persistencePlugin.beforeCacheAccess(j);
            let H = this.readAccessTokenFromCache(z, w.managedIdentityId?.id || O.authOptions.clientId, new OX(q.scopes || []), Y, q.correlationId);
            if (O.serializableCache && O.persistencePlugin && j) await O.persistencePlugin.afterCacheAccess(j);
            if (!H) return A?.setCacheOutcome(C2.NO_CACHED_ACCESS_TOKEN), [null, C2.NO_CACHED_ACCESS_TOKEN];
            if (wj.isTokenExpired(H.expiresOn, O.systemOptions?.tokenRenewalOffsetSeconds || wV6)) return A?.setCacheOutcome(C2.CACHED_ACCESS_TOKEN_EXPIRED), [null, C2.CACHED_ACCESS_TOKEN_EXPIRED];
            if (H.refreshOn && wj.isTokenExpired(H.refreshOn.toString(), 0)) $ = C2.PROACTIVELY_REFRESHED, A?.setCacheOutcome(C2.PROACTIVELY_REFRESHED);
            return [await wX.generateAuthenticationResult(_, z, {
                account: null,
                idToken: null,
                accessToken: H,
                refreshToken: null,
                appMetadata: null
            }, !0, q), $]
        }
        readAccessTokenFromCache(q, K, _, z, Y) {
            let A = {
                    homeAccountId: q7.EMPTY_STRING,
                    environment: q.canonicalAuthorityUrlComponents.HostNameAndPort,
                    credentialType: dO.ACCESS_TOKEN,
                    clientId: K,
                    realm: q.tenant,
                    target: OX.createSearchScopes(_.asArray())
                },
                O = z.getAccessTokensByFilter(A, Y);
            if (O.length < 1) return null;
            else if (O.length > 1) throw k7(ow.multipleMatchingTokens);
            return O[0]
        }
        async executeTokenRequest(q, K, _) {
            let z, Y;
            if (this.appTokenProvider) {
                this.logger.info("Using appTokenProvider extensibility.");
                let w = {
                    correlationId: q.correlationId,
                    tenantId: this.config.authOptions.authority.tenant,
                    scopes: q.scopes,
                    claims: q.claims
                };
                Y = wj.nowSeconds();
                let $ = await this.appTokenProvider(w);
                z = {
                    access_token: $.accessToken,
                    expires_in: $.expiresInSeconds,
                    refresh_in: $.refreshInSeconds,
                    token_type: hz.BEARER
                }
            } else {
                let w = this.createTokenQueryParameters(q),
                    $ = l9.appendQueryString(K.tokenEndpoint, w),
                    j = await this.createTokenRequestBody(q),
                    H = this.createTokenRequestHeaders(),
                    J = {
                        clientId: this.config.authOptions.clientId,
                        authority: q.authority,
                        scopes: q.scopes,
                        claims: q.claims,
                        authenticationScheme: q.authenticationScheme,
                        resourceRequestMethod: q.resourceRequestMethod,
                        resourceRequestUri: q.resourceRequestUri,
                        shrClaims: q.shrClaims,
                        sshKid: q.sshKid
                    };
                this.logger.info("Sending token request to endpoint: " + K.tokenEndpoint), Y = wj.nowSeconds();
                let X = await this.executePostToTokenEndpoint($, j, H, J, q.correlationId);
                z = X.body, z.status = X.status
            }
            let A = new wX(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
            return A.validateTokenResponse(z, _), await A.handleServerTokenResponse(z, this.authority, Y, q)
        }
        async createTokenRequestBody(q) {
            let K = new Map;
            if (b4.addClientId(K, this.config.authOptions.clientId), b4.addScopes(K, q.scopes, !1), b4.addGrantType(K, bE.CLIENT_CREDENTIALS_GRANT), b4.addLibraryInfo(K, this.config.libraryInfo), b4.addApplicationTelemetry(K, this.config.telemetry.application), b4.addThrottling(K), this.serverTelemetryManager) b4.addServerTelemetry(K, this.serverTelemetryManager);
            let _ = q.correlationId || this.config.cryptoInterface.createNewGuid();
            if (b4.addCorrelationId(K, _), this.config.clientCredentials.clientSecret) b4.addClientSecret(K, this.config.clientCredentials.clientSecret);
            let z = q.clientAssertion || this.config.clientCredentials.clientAssertion;
            if (z) b4.addClientAssertion(K, await nV(z.assertion, this.config.authOptions.clientId, q.resourceRequestUri)), b4.addClientAssertionType(K, z.assertionType);
            if (!b2.isEmptyObj(q.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) b4.addClaims(K, q.claims, this.config.authOptions.clientCapabilities);
            return Hf.mapToQueryString(K)
        }
    }
})
// @from(Ln 128846, Col 4)
Sr6
// @from(Ln 128847, Col 4)
Hy1 = L(() => {
    cO();
    Jr6(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    Sr6 = class Sr6 extends Iv {
        constructor(q) {
            super(q)
        }
        async acquireToken(q) {
            if (this.scopeSet = new OX(q.scopes || []), this.userAssertionHash = await this.cryptoUtils.hashString(q.oboAssertion), q.skipCache || q.claims) return this.executeTokenRequest(q, this.authority, this.userAssertionHash);
            try {
                return await this.getCachedAuthenticationResult(q)
            } catch (K) {
                return await this.executeTokenRequest(q, this.authority, this.userAssertionHash)
            }
        }
        async getCachedAuthenticationResult(q) {
            let K = this.readAccessTokenFromCacheForOBO(this.config.authOptions.clientId, q);
            if (!K) throw this.serverTelemetryManager?.setCacheOutcome(C2.NO_CACHED_ACCESS_TOKEN), this.logger.info("SilentFlowClient:acquireCachedToken - No access token found in cache for the given properties."), k7(ow.tokenRefreshRequired);
            else if (wj.isTokenExpired(K.expiresOn, this.config.systemOptions.tokenRenewalOffsetSeconds)) throw this.serverTelemetryManager?.setCacheOutcome(C2.CACHED_ACCESS_TOKEN_EXPIRED), this.logger.info(`OnbehalfofFlow:getCachedAuthenticationResult - Cached access token is expired or will expire within ${this.config.systemOptions.tokenRenewalOffsetSeconds} seconds.`), k7(ow.tokenRefreshRequired);
            let _ = this.readIdTokenFromCacheForOBO(K.homeAccountId, q.correlationId),
                z, Y = null;
            if (_) {
                z = FG8.extractTokenClaims(_.secret, uE.base64Decode);
                let A = z.oid || z.sub,
                    O = {
                        homeAccountId: _.homeAccountId,
                        environment: _.environment,
                        tenantId: _.realm,
                        username: q7.EMPTY_STRING,
                        localAccountId: A || q7.EMPTY_STRING
                    };
                Y = this.cacheManager.getAccount(this.cacheManager.generateAccountKey(O), q.correlationId)
            }
            if (this.config.serverTelemetryManager) this.config.serverTelemetryManager.incrementCacheHits();
            return wX.generateAuthenticationResult(this.cryptoUtils, this.authority, {
                account: Y,
                accessToken: K,
                idToken: _,
                refreshToken: null,
                appMetadata: null
            }, !0, q, z)
        }
        readIdTokenFromCacheForOBO(q, K) {
            let _ = {
                    homeAccountId: q,
                    environment: this.authority.canonicalAuthorityUrlComponents.HostNameAndPort,
                    credentialType: dO.ID_TOKEN,
                    clientId: this.config.authOptions.clientId,
                    realm: this.authority.tenant
                },
                z = this.cacheManager.getIdTokensByFilter(_, K);
            if (Object.values(z).length < 1) return null;
            return Object.values(z)[0]
        }
        readAccessTokenFromCacheForOBO(q, K) {
            let _ = K.authenticationScheme || hz.BEARER,
                Y = {
                    credentialType: _ && _.toLowerCase() !== hz.BEARER.toLowerCase() ? dO.ACCESS_TOKEN_WITH_AUTH_SCHEME : dO.ACCESS_TOKEN,
                    clientId: q,
                    target: OX.createSearchScopes(this.scopeSet.asArray()),
                    tokenType: _,
                    keyId: K.sshKid,
                    requestedClaimsHash: K.requestedClaimsHash,
                    userAssertionHash: this.userAssertionHash
                },
                A = this.cacheManager.getAccessTokensByFilter(Y, K.correlationId),
                O = A.length;
            if (O < 1) return null;
            else if (O > 1) throw k7(ow.multipleMatchingTokens);
            return A[0]
        }
        async executeTokenRequest(q, K, _) {
            let z = this.createTokenQueryParameters(q),
                Y = l9.appendQueryString(K.tokenEndpoint, z),
                A = await this.createTokenRequestBody(q),
                O = this.createTokenRequestHeaders(),
                w = {
                    clientId: this.config.authOptions.clientId,
                    authority: q.authority,
                    scopes: q.scopes,
                    claims: q.claims,
                    authenticationScheme: q.authenticationScheme,
                    resourceRequestMethod: q.resourceRequestMethod,
                    resourceRequestUri: q.resourceRequestUri,
                    shrClaims: q.shrClaims,
                    sshKid: q.sshKid
                },
                $ = wj.nowSeconds(),
                j = await this.executePostToTokenEndpoint(Y, A, O, w, q.correlationId),
                H = new wX(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
            return H.validateTokenResponse(j.body), await H.handleServerTokenResponse(j.body, this.authority, $, q, void 0, _)
        }
        async createTokenRequestBody(q) {
            let K = new Map;
            if (b4.addClientId(K, this.config.authOptions.clientId), b4.addScopes(K, q.scopes), b4.addGrantType(K, bE.JWT_BEARER), b4.addClientInfo(K), b4.addLibraryInfo(K, this.config.libraryInfo), b4.addApplicationTelemetry(K, this.config.telemetry.application), b4.addThrottling(K), this.serverTelemetryManager) b4.addServerTelemetry(K, this.serverTelemetryManager);
            let _ = q.correlationId || this.config.cryptoInterface.createNewGuid();
            if (b4.addCorrelationId(K, _), b4.addRequestTokenUse(K, iw6.ON_BEHALF_OF), b4.addOboAssertion(K, q.oboAssertion), this.config.clientCredentials.clientSecret) b4.addClientSecret(K, this.config.clientCredentials.clientSecret);
            let z = this.config.clientCredentials.clientAssertion;
            if (z) b4.addClientAssertion(K, await nV(z.assertion, this.config.authOptions.clientId, q.resourceRequestUri)), b4.addClientAssertionType(K, z.assertionType);
            if (q.claims || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) b4.addClaims(K, q.claims, this.config.authOptions.clientCapabilities);
            return Hf.mapToQueryString(K)
        }
    }
})
// @from(Ln 128951, Col 4)
Cr6
// @from(Ln 128952, Col 4)
Nbq = L(() => {
    HT8();
    $T8();
    jj();
    cO();
    JT8();
    Hy1(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    Cr6 = class Cr6 extends $26 {
        constructor(q) {
            super(q);
            let K = !!this.config.auth.clientSecret,
                _ = !!this.config.auth.clientAssertion,
                z = (!!this.config.auth.clientCertificate?.thumbprint || !!this.config.auth.clientCertificate?.thumbprintSha256) && !!this.config.auth.clientCertificate?.privateKey;
            if (this.appTokenProvider) return;
            if (K && _ || _ && z || K && z) throw k7(ow.invalidClientCredential);
            if (this.config.auth.clientSecret) {
                this.clientSecret = this.config.auth.clientSecret;
                return
            }
            if (this.config.auth.clientAssertion) {
                this.developerProvidedClientAssertion = this.config.auth.clientAssertion;
                return
            }
            if (!z) throw k7(ow.invalidClientCredential);
            else this.clientAssertion = this.config.auth.clientCertificate.thumbprintSha256 ? TB.fromCertificateWithSha256Thumbprint(this.config.auth.clientCertificate.thumbprintSha256, this.config.auth.clientCertificate.privateKey, this.config.auth.clientCertificate.x5c) : TB.fromCertificate(this.config.auth.clientCertificate.thumbprint, this.config.auth.clientCertificate.privateKey, this.config.auth.clientCertificate.x5c);
            this.appTokenProvider = void 0
        }
        SetAppTokenProvider(q) {
            this.appTokenProvider = q
        }
        async acquireTokenByClientCredential(q) {
            this.logger.info("acquireTokenByClientCredential called", q.correlationId);
            let K;
            if (q.clientAssertion) K = {
                assertion: await nV(q.clientAssertion, this.config.auth.clientId),
                assertionType: iV.JWT_BEARER_ASSERTION_TYPE
            };
            let _ = await this.initializeBaseRequest(q),
                z = {
                    ..._,
                    scopes: _.scopes.filter((J) => !Cv.includes(J))
                },
                Y = {
                    ...q,
                    ...z,
                    clientAssertion: K
                },
                O = new l9(Y.authority).getUrlComponents().PathSegments[0];
            if (Object.values(CE).includes(O)) throw k7(ow.missingTenantIdError);
            let w = process.env[SLq],
                $;
            if (Y.azureRegion !== "DisableMsalForceRegion")
                if (!Y.azureRegion && w) $ = w;
                else $ = Y.azureRegion;
            let j = {
                    azureRegion: $,
                    environmentRegion: process.env[RLq]
                },
                H = this.initializeServerTelemetryManager(Uo.acquireTokenByClientCredential, Y.correlationId, Y.skipCache);
            try {
                let J = await this.createAuthority(Y.authority, Y.correlationId, j, q.azureCloudOptions),
                    X = await this.buildOauthClientConfiguration(J, Y.correlationId, "", H),
                    M = new j26(X, this.appTokenProvider);
                return this.logger.verbose("Client credential client created", Y.correlationId), await M.acquireToken(Y)
            } catch (J) {
                if (J instanceof G9) J.setCorrelationId(Y.correlationId);
                throw H.cacheFailedRequest(J), J
            }
        }
        async acquireTokenOnBehalfOf(q) {
            this.logger.info("acquireTokenOnBehalfOf called", q.correlationId);
            let K = {
                ...q,
                ...await this.initializeBaseRequest(q)
            };
            try {
                let _ = await this.createAuthority(K.authority, K.correlationId, void 0, q.azureCloudOptions),
                    z = await this.buildOauthClientConfiguration(_, K.correlationId, "", void 0),
                    Y = new Sr6(z);
                return this.logger.verbose("On behalf of client created", K.correlationId), await Y.acquireToken(K)
            } catch (_) {
                if (_ instanceof G9) _.setCorrelationId(K.correlationId);
                throw _
            }
        }
    }
})
// @from(Ln 129040, Col 0)
function Ebq(q) {
    if (typeof q !== "string") return !1;
    let K = new Date(q);
    return !isNaN(K.getTime()) && K.toISOString() === q
}
// @from(Ln 129045, Col 4)
ybq = L(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 129047, Col 0)
class Jy1 {
    constructor(q, K, _) {
        this.httpClientNoRetries = q, this.retryPolicy = K, this.logger = _
    }
    async sendNetworkRequestAsyncHelper(q, K, _) {
        if (q === $j.GET) return this.httpClientNoRetries.sendGetRequestAsync(K, _);
        else return this.httpClientNoRetries.sendPostRequestAsync(K, _)
    }
    async sendNetworkRequestAsync(q, K, _) {
        let z = await this.sendNetworkRequestAsyncHelper(q, K, _);
        if ("isNewRequest" in this.retryPolicy) this.retryPolicy.isNewRequest = !0;
        let Y = 0;
        while (await this.retryPolicy.pauseForRetry(z.status, Y, this.logger, z.headers[y$.RETRY_AFTER])) z = await this.sendNetworkRequestAsyncHelper(q, K, _), Y++;
        return z
    }
    async sendGetRequestAsync(q, K) {
        return this.sendNetworkRequestAsync($j.GET, q, K)
    }
    async sendPostRequestAsync(q, K) {
        return this.sendNetworkRequestAsync($j.POST, q, K)
    }
}
// @from(Ln 129069, Col 4)
Lbq = L(() => {
    cO();
    jj(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 129073, Col 0)
class BE {
    constructor(q, K, _, z, Y) {
        this.logger = q, this.nodeStorage = K, this.networkClient = _, this.cryptoProvider = z, this.disableInternalRetries = Y
    }
    async getServerTokenResponseAsync(q, K, _, z) {
        return this.getServerTokenResponse(q)
    }
    getServerTokenResponse(q) {
        let K, _;
        if (q.body.expires_on) {
            if (Ebq(q.body.expires_on)) q.body.expires_on = new Date(q.body.expires_on).getTime() / 1000;
            if (_ = q.body.expires_on - wj.nowSeconds(), _ > 7200) K = _ / 2
        }
        return {
            status: q.status,
            access_token: q.body.access_token,
            expires_in: _,
            scope: q.body.resource,
            token_type: q.body.token_type,
            refresh_in: K,
            correlation_id: q.body.correlation_id || q.body.correlationId,
            error: typeof q.body.error === "string" ? q.body.error : q.body.error?.code,
            error_description: q.body.message || (typeof q.body.error === "string" ? q.body.error_description : q.body.error?.message),
            error_codes: q.body.error_codes,
            timestamp: q.body.timestamp,
            trace_id: q.body.trace_id
        }
    }
    async acquireTokenWithManagedIdentity(q, K, _, z) {
        let Y = this.createRequest(q.resource, K);
        if (q.revokedTokenSha256Hash) this.logger.info(`[Managed Identity] The following claims are present in the request: ${q.claims}`), Y.queryParameters[kP.SHA256_TOKEN_TO_REFRESH] = q.revokedTokenSha256Hash;
        if (q.clientCapabilities?.length) {
            let X = q.clientCapabilities.toString();
            this.logger.info(`[Managed Identity] The following client capabilities are present in the request: ${X}`), Y.queryParameters[kP.XMS_CC] = X
        }
        let A = Y.headers;
        A[y$.CONTENT_TYPE] = q7.URL_FORM_CONTENT_TYPE;
        let O = {
            headers: A
        };
        if (Object.keys(Y.bodyParameters).length) O.body = Y.computeParametersBodyString();
        let w = this.disableInternalRetries ? this.networkClient : new Jy1(this.networkClient, Y.retryPolicy, this.logger),
            $ = wj.nowSeconds(),
            j;
        try {
            if (Y.httpMethod === $j.POST) j = await w.sendPostRequestAsync(Y.computeUri(), O);
            else j = await w.sendGetRequestAsync(Y.computeUri(), O)
        } catch (X) {
            if (X instanceof G9) throw X;
            else throw k7(ow.networkError)
        }
        let H = new wX(K.id, this.nodeStorage, this.cryptoProvider, this.logger, null, null),
            J = await this.getServerTokenResponseAsync(j, w, Y, O);
        return H.validateTokenResponse(J, z), H.handleServerTokenResponse(J, _, $, q)
    }
    getManagedIdentityUserAssignedIdQueryParameterKey(q, K, _) {
        switch (q) {
            case wJ.USER_ASSIGNED_CLIENT_ID:
                return this.logger.info(`[Managed Identity] [API version ${_?"2017+":"2019+"}] Adding user assigned client id to the request.`), _ ? H26.MANAGED_IDENTITY_CLIENT_ID_2017 : H26.MANAGED_IDENTITY_CLIENT_ID;
            case wJ.USER_ASSIGNED_RESOURCE_ID:
                return this.logger.info("[Managed Identity] Adding user assigned resource id to the request."), K ? H26.MANAGED_IDENTITY_RESOURCE_ID_IMDS : H26.MANAGED_IDENTITY_RESOURCE_ID_NON_IMDS;
            case wJ.USER_ASSIGNED_OBJECT_ID:
                return this.logger.info("[Managed Identity] Adding user assigned object id to the request."), H26.MANAGED_IDENTITY_OBJECT_ID;
            default:
                throw $M(Iq6)
        }
    }
}
// @from(Ln 129141, Col 4)
H26
// @from(Ln 129142, Col 4)
J26 = L(() => {
    cO();
    jj();
    yV6();
    ybq();
    Lbq();
    z26(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    H26 = {
        MANAGED_IDENTITY_CLIENT_ID_2017: "clientid",
        MANAGED_IDENTITY_CLIENT_ID: "client_id",
        MANAGED_IDENTITY_OBJECT_ID: "object_id",
        MANAGED_IDENTITY_RESOURCE_ID_IMDS: "msi_res_id",
        MANAGED_IDENTITY_RESOURCE_ID_NON_IMDS: "mi_res_id"
    };
    BE.getValidatedEnvVariableUrlString = (q, K, _, z) => {
        try {
            return new l9(K).urlString
        } catch (Y) {
            throw z.info(`[Managed Identity] ${_} managed identity is unavailable because the '${q}' environment variable is malformed.`), $M(_26[q])
        }
    }
})
// @from(Ln 129164, Col 0)
class Xy1 {
    calculateDelay(q, K) {
        if (!q) return K;
        let _ = Math.round(parseFloat(q) * 1000);
        if (isNaN(_)) _ = new Date(q).valueOf() - new Date().valueOf();
        return Math.max(K, _)
    }
}
// @from(Ln 129172, Col 4)
hbq = L(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 129174, Col 0)
class XT8 {
    constructor() {
        this.linearRetryStrategy = new Xy1
    }
    static get DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS() {
        return C7_
    }
    async pauseForRetry(q, K, _, z) {
        if (b7_.includes(q) && K < S7_) {
            let Y = this.linearRetryStrategy.calculateDelay(z, XT8.DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS);
            return _.verbose(`Retrying request in ${Y}ms (retry attempt: ${K+1})`), await new Promise((A) => {
                return setTimeout(A, Y)
            }), !0
        }
        return !1
    }
}
// @from(Ln 129191, Col 4)
S7_ = 3
// @from(Ln 129192, Col 4)
C7_ = 1000
// @from(Ln 129193, Col 4)
b7_
// @from(Ln 129194, Col 4)
Rbq = L(() => {
    bv8();
    hbq(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    b7_ = [f9.NOT_FOUND, f9.REQUEST_TIMEOUT, f9.TOO_MANY_REQUESTS, f9.SERVER_ERROR, f9.SERVICE_UNAVAILABLE, f9.GATEWAY_TIMEOUT]
})
// @from(Ln 129199, Col 0)
class oh {
    constructor(q, K, _) {
        this.httpMethod = q, this._baseEndpoint = K, this.headers = {}, this.bodyParameters = {}, this.queryParameters = {}, this.retryPolicy = _ || new XT8
    }
    computeUri() {
        let q = new Map;
        if (this.queryParameters) b4.addExtraQueryParameters(q, this.queryParameters);
        let K = Hf.mapToQueryString(q);
        return l9.appendQueryString(this._baseEndpoint, K)
    }
    computeParametersBodyString() {
        let q = new Map;
        if (this.bodyParameters) b4.addExtraQueryParameters(q, this.bodyParameters);
        return Hf.mapToQueryString(q)
    }
}
// @from(Ln 129215, Col 4)
X26 = L(() => {
    cO();
    Rbq(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 129219, Col 4)
I7_ = "2019-08-01"
// @from(Ln 129220, Col 4)
M26
// @from(Ln 129221, Col 4)
Sbq = L(() => {
    J26();
    jj();
    X26(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    M26 = class M26 extends BE {
        constructor(q, K, _, z, Y, A, O) {
            super(q, K, _, z, Y);
            this.identityEndpoint = A, this.identityHeader = O
        }
        static getEnvironmentVariables() {
            let q = process.env[b3.IDENTITY_ENDPOINT],
                K = process.env[b3.IDENTITY_HEADER];
            return [q, K]
        }
        static tryCreate(q, K, _, z, Y) {
            let [A, O] = M26.getEnvironmentVariables();
            if (!A || !O) return q.info(`[Managed Identity] ${s3.APP_SERVICE} managed identity is unavailable because one or both of the '${b3.IDENTITY_HEADER}' and '${b3.IDENTITY_ENDPOINT}' environment variables are not defined.`), null;
            let w = M26.getValidatedEnvVariableUrlString(b3.IDENTITY_ENDPOINT, A, s3.APP_SERVICE, q);
            return q.info(`[Managed Identity] Environment variables validation passed for ${s3.APP_SERVICE} managed identity. Endpoint URI: ${w}. Creating ${s3.APP_SERVICE} managed identity.`), new M26(q, K, _, z, Y, A, O)
        }
        createRequest(q, K) {
            let _ = new oh($j.GET, this.identityEndpoint);
            if (_.headers[xE.APP_SERVICE_SECRET_HEADER_NAME] = this.identityHeader, _.queryParameters[kP.API_VERSION] = I7_, _.queryParameters[kP.RESOURCE] = q, K.idType !== wJ.SYSTEM_ASSIGNED) _.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(K.idType)] = K.id;
            return _
        }
    }
})
// @from(Ln 129255, Col 4)
p7_ = "2019-11-01"
// @from(Ln 129256, Col 4)
bbq = "http://127.0.0.1:40342/metadata/identity/oauth2/token"
// @from(Ln 129257, Col 4)
Ibq = "N/A: himds executable exists"
// @from(Ln 129258, Col 4)
xbq
// @from(Ln 129258, Col 9)
F7_
// @from(Ln 129258, Col 14)
uq6
// @from(Ln 129259, Col 4)
ubq = L(() => {
    cO();
    X26();
    J26();
    yV6();
    jj();
    z26(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    xbq = {
        win32: `${process.env.ProgramData}\\AzureConnectedMachineAgent\\Tokens\\`,
        linux: "/var/opt/azcmagent/tokens/"
    }, F7_ = {
        win32: `${process.env.ProgramFiles}\\AzureConnectedMachineAgent\\himds.exe`,
        linux: "/opt/azcmagent/bin/himds"
    };
    uq6 = class uq6 extends BE {
        constructor(q, K, _, z, Y, A) {
            super(q, K, _, z, Y);
            this.identityEndpoint = A
        }
        static getEnvironmentVariables() {
            let q = process.env[b3.IDENTITY_ENDPOINT],
                K = process.env[b3.IMDS_ENDPOINT];
            if (!q || !K) {
                let _ = F7_[process.platform];
                try {
                    x7_(_, Cbq.F_OK | Cbq.R_OK), q = bbq, K = Ibq
                } catch (z) {}
            }
            return [q, K]
        }
        static tryCreate(q, K, _, z, Y, A) {
            let [O, w] = uq6.getEnvironmentVariables();
            if (!O || !w) return q.info(`[Managed Identity] ${s3.AZURE_ARC} managed identity is unavailable through environment variables because one or both of '${b3.IDENTITY_ENDPOINT}' and '${b3.IMDS_ENDPOINT}' are not defined. ${s3.AZURE_ARC} managed identity is also unavailable through file detection.`), null;
            if (w === Ibq) q.info(`[Managed Identity] ${s3.AZURE_ARC} managed identity is available through file detection. Defaulting to known ${s3.AZURE_ARC} endpoint: ${bbq}. Creating ${s3.AZURE_ARC} managed identity.`);
            else {
                let $ = uq6.getValidatedEnvVariableUrlString(b3.IDENTITY_ENDPOINT, O, s3.AZURE_ARC, q);
                $.endsWith("/") && $.slice(0, -1), uq6.getValidatedEnvVariableUrlString(b3.IMDS_ENDPOINT, w, s3.AZURE_ARC, q), q.info(`[Managed Identity] Environment variables validation passed for ${s3.AZURE_ARC} managed identity. Endpoint URI: ${$}. Creating ${s3.AZURE_ARC} managed identity.`)
            }
            if (A.idType !== wJ.SYSTEM_ASSIGNED) throw $M(Nv8);
            return new uq6(q, K, _, z, Y, O)
        }
        createRequest(q) {
            let K = new oh($j.GET, this.identityEndpoint.replace("localhost", "127.0.0.1"));
            return K.headers[xE.METADATA_HEADER_NAME] = "true", K.queryParameters[kP.API_VERSION] = p7_, K.queryParameters[kP.RESOURCE] = q, K
        }
        async getServerTokenResponseAsync(q, K, _, z) {
            let Y;
            if (q.status === f9.UNAUTHORIZED) {
                let A = q.headers["www-authenticate"];
                if (!A) throw $M(Lv8);
                if (!A.includes("Basic realm=")) throw $M(hv8);
                let O = A.split("Basic realm=")[1];
                if (!xbq.hasOwnProperty(process.platform)) throw $M(kv8);
                let w = xbq[process.platform],
                    $ = B7_.basename(O);
                if (!$.endsWith(".key")) throw $M(vv8);
                if (w + $ !== O) throw $M(Tv8);
                let j;
                try {
                    j = await u7_(O).size
                } catch (X) {
                    throw $M(Or6)
                }
                if (j > ILq) throw $M(Vv8);
                let H;
                try {
                    H = m7_(O, jf.UTF8)
                } catch (X) {
                    throw $M(Or6)
                }
                let J = `Basic ${H}`;
                this.logger.info("[Managed Identity] Adding authorization header to the request."), _.headers[xE.AUTHORIZATION_HEADER_NAME] = J;
                try {
                    Y = await K.sendGetRequestAsync(_.computeUri(), z)
                } catch (X) {
                    if (X instanceof G9) throw X;
                    else throw k7(ow.networkError)
                }
            }
            return this.getServerTokenResponse(Y || q)
        }
    }
})
// @from(Ln 129342, Col 4)
P26
// @from(Ln 129343, Col 4)
mbq = L(() => {
    X26();
    J26();
    jj();
    yV6();
    z26(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    P26 = class P26 extends BE {
        constructor(q, K, _, z, Y, A) {
            super(q, K, _, z, Y);
            this.msiEndpoint = A
        }
        static getEnvironmentVariables() {
            return [process.env[b3.MSI_ENDPOINT]]
        }
        static tryCreate(q, K, _, z, Y, A) {
            let [O] = P26.getEnvironmentVariables();
            if (!O) return q.info(`[Managed Identity] ${s3.CLOUD_SHELL} managed identity is unavailable because the '${b3.MSI_ENDPOINT} environment variable is not defined.`), null;
            let w = P26.getValidatedEnvVariableUrlString(b3.MSI_ENDPOINT, O, s3.CLOUD_SHELL, q);
            if (q.info(`[Managed Identity] Environment variable validation passed for ${s3.CLOUD_SHELL} managed identity. Endpoint URI: ${w}. Creating ${s3.CLOUD_SHELL} managed identity.`), A.idType !== wJ.SYSTEM_ASSIGNED) throw $M(Ev8);
            return new P26(q, K, _, z, Y, O)
        }
        createRequest(q) {
            let K = new oh($j.POST, this.msiEndpoint);
            return K.headers[xE.METADATA_HEADER_NAME] = "true", K.bodyParameters[kP.RESOURCE] = q, K
        }
    }
})
// @from(Ln 129370, Col 0)
class My1 {
    constructor(q, K, _) {
        this.minExponentialBackoff = q, this.maxExponentialBackoff = K, this.exponentialDeltaBackoff = _
    }
    calculateDelay(q) {
        if (q === 0) return this.minExponentialBackoff;
        return Math.min(Math.pow(2, q - 1) * this.exponentialDeltaBackoff, this.maxExponentialBackoff)
    }
}
// @from(Ln 129379, Col 4)
Bbq = L(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 129381, Col 0)
class W26 {
    constructor() {
        this.exponentialRetryStrategy = new My1(W26.MIN_EXPONENTIAL_BACKOFF_MS, W26.MAX_EXPONENTIAL_BACKOFF_MS, W26.EXPONENTIAL_DELTA_BACKOFF_MS)
    }
    static get MIN_EXPONENTIAL_BACKOFF_MS() {
        return d7_
    }
    static get MAX_EXPONENTIAL_BACKOFF_MS() {
        return c7_
    }
    static get EXPONENTIAL_DELTA_BACKOFF_MS() {
        return l7_
    }
    static get HTTP_STATUS_GONE_RETRY_AFTER_MS() {
        return n7_
    }
    set isNewRequest(q) {
        this._isNewRequest = q
    }
    async pauseForRetry(q, K, _) {
        if (this._isNewRequest) this._isNewRequest = !1, this.maxRetries = q === f9.GONE ? Q7_ : U7_;
        if ((g7_.includes(q) || q >= f9.SERVER_ERROR_RANGE_START && q <= f9.SERVER_ERROR_RANGE_END && K < this.maxRetries) && K < this.maxRetries) {
            let z = q === f9.GONE ? W26.HTTP_STATUS_GONE_RETRY_AFTER_MS : this.exponentialRetryStrategy.calculateDelay(K);
            return _.verbose(`Retrying request in ${z}ms (retry attempt: ${K+1})`), await new Promise((Y) => {
                return setTimeout(Y, z)
            }), !0
        }
        return !1
    }
}
// @from(Ln 129411, Col 4)
g7_
// @from(Ln 129411, Col 9)
U7_ = 3
// @from(Ln 129412, Col 4)
Q7_ = 7
// @from(Ln 129413, Col 4)
d7_ = 1000
// @from(Ln 129414, Col 4)
c7_ = 4000
// @from(Ln 129415, Col 4)
l7_ = 2000
// @from(Ln 129416, Col 4)
n7_ = 1e4
// @from(Ln 129417, Col 4)
pbq = L(() => {
    bv8();
    Bbq(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    g7_ = [f9.NOT_FOUND, f9.REQUEST_TIMEOUT, f9.GONE, f9.TOO_MANY_REQUESTS]
})
// @from(Ln 129422, Col 4)
Fbq = "/metadata/identity/oauth2/token"
// @from(Ln 129423, Col 4)
i7_
// @from(Ln 129423, Col 9)
r7_ = "2018-02-01"
// @from(Ln 129424, Col 4)
br6
// @from(Ln 129425, Col 4)
gbq = L(() => {
    X26();
    J26();
    jj();
    pbq(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    i7_ = `http://169.254.169.254${Fbq}`;
    br6 = class br6 extends BE {
        constructor(q, K, _, z, Y, A) {
            super(q, K, _, z, Y);
            this.identityEndpoint = A
        }
        static tryCreate(q, K, _, z, Y) {
            let A;
            if (process.env[b3.AZURE_POD_IDENTITY_AUTHORITY_HOST]) q.info(`[Managed Identity] Environment variable ${b3.AZURE_POD_IDENTITY_AUTHORITY_HOST} for ${s3.IMDS} returned endpoint: ${process.env[b3.AZURE_POD_IDENTITY_AUTHORITY_HOST]}`), A = br6.getValidatedEnvVariableUrlString(b3.AZURE_POD_IDENTITY_AUTHORITY_HOST, `${process.env[b3.AZURE_POD_IDENTITY_AUTHORITY_HOST]}${Fbq}`, s3.IMDS, q);
            else q.info(`[Managed Identity] Unable to find ${b3.AZURE_POD_IDENTITY_AUTHORITY_HOST} environment variable for ${s3.IMDS}, using the default endpoint.`), A = i7_;
            return new br6(q, K, _, z, Y, A)
        }
        createRequest(q, K) {
            let _ = new oh($j.GET, this.identityEndpoint);
            if (_.headers[xE.METADATA_HEADER_NAME] = "true", _.queryParameters[kP.API_VERSION] = r7_, _.queryParameters[kP.RESOURCE] = q, K.idType !== wJ.SYSTEM_ASSIGNED) _.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(K.idType, !0)] = K.id;
            return _.retryPolicy = new W26, _
        }
    }
})
// @from(Ln 129449, Col 4)
o7_ = "2019-07-01-preview"
// @from(Ln 129450, Col 4)
D26
// @from(Ln 129451, Col 4)
Ubq = L(() => {
    X26();
    J26();
    jj(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    D26 = class D26 extends BE {
        constructor(q, K, _, z, Y, A, O) {
            super(q, K, _, z, Y);
            this.identityEndpoint = A, this.identityHeader = O
        }
        static getEnvironmentVariables() {
            let q = process.env[b3.IDENTITY_ENDPOINT],
                K = process.env[b3.IDENTITY_HEADER],
                _ = process.env[b3.IDENTITY_SERVER_THUMBPRINT];
            return [q, K, _]
        }
        static tryCreate(q, K, _, z, Y, A) {
            let [O, w, $] = D26.getEnvironmentVariables();
            if (!O || !w || !$) return q.info(`[Managed Identity] ${s3.SERVICE_FABRIC} managed identity is unavailable because one or all of the '${b3.IDENTITY_HEADER}', '${b3.IDENTITY_ENDPOINT}' or '${b3.IDENTITY_SERVER_THUMBPRINT}' environment variables are not defined.`), null;
            let j = D26.getValidatedEnvVariableUrlString(b3.IDENTITY_ENDPOINT, O, s3.SERVICE_FABRIC, q);
            if (q.info(`[Managed Identity] Environment variables validation passed for ${s3.SERVICE_FABRIC} managed identity. Endpoint URI: ${j}. Creating ${s3.SERVICE_FABRIC} managed identity.`), A.idType !== wJ.SYSTEM_ASSIGNED) q.warning(`[Managed Identity] ${s3.SERVICE_FABRIC} user assigned managed identity is configured in the cluster, not during runtime. See also: https://learn.microsoft.com/en-us/azure/service-fabric/configure-existing-cluster-enable-managed-identity-token-service.`);
            return new D26(q, K, _, z, Y, O, w)
        }
        createRequest(q, K) {
            let _ = new oh($j.GET, this.identityEndpoint);
            if (_.headers[xE.ML_AND_SF_SECRET_HEADER_NAME] = this.identityHeader, _.queryParameters[kP.API_VERSION] = o7_, _.queryParameters[kP.RESOURCE] = q, K.idType !== wJ.SYSTEM_ASSIGNED) _.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(K.idType)] = K.id;
            return _
        }
    }
})
// @from(Ln 129480, Col 4)
a7_ = "2017-09-01"
// @from(Ln 129481, Col 4)
s7_
// @from(Ln 129481, Col 9)
Z26
// @from(Ln 129482, Col 4)
Qbq = L(() => {
    J26();
    jj();
    X26(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    s7_ = `Only client id is supported for user-assigned managed identity in ${s3.MACHINE_LEARNING}.`;
    Z26 = class Z26 extends BE {
        constructor(q, K, _, z, Y, A, O) {
            super(q, K, _, z, Y);
            this.msiEndpoint = A, this.secret = O
        }
        static getEnvironmentVariables() {
            let q = process.env[b3.MSI_ENDPOINT],
                K = process.env[b3.MSI_SECRET];
            return [q, K]
        }
        static tryCreate(q, K, _, z, Y) {
            let [A, O] = Z26.getEnvironmentVariables();
            if (!A || !O) return q.info(`[Managed Identity] ${s3.MACHINE_LEARNING} managed identity is unavailable because one or both of the '${b3.MSI_ENDPOINT}' and '${b3.MSI_SECRET}' environment variables are not defined.`), null;
            let w = Z26.getValidatedEnvVariableUrlString(b3.MSI_ENDPOINT, A, s3.MACHINE_LEARNING, q);
            return q.info(`[Managed Identity] Environment variables validation passed for ${s3.MACHINE_LEARNING} managed identity. Endpoint URI: ${w}. Creating ${s3.MACHINE_LEARNING} managed identity.`), new Z26(q, K, _, z, Y, A, O)
        }
        createRequest(q, K) {
            let _ = new oh($j.GET, this.msiEndpoint);
            if (_.headers[xE.METADATA_HEADER_NAME] = "true", _.headers[xE.ML_AND_SF_SECRET_HEADER_NAME] = this.secret, _.queryParameters[kP.API_VERSION] = a7_, _.queryParameters[kP.RESOURCE] = q, K.idType === wJ.SYSTEM_ASSIGNED) _.queryParameters[H26.MANAGED_IDENTITY_CLIENT_ID_2017] = process.env[b3.DEFAULT_IDENTITY_CLIENT_ID];
            else if (K.idType === wJ.USER_ASSIGNED_CLIENT_ID) _.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(K.idType, !1, !0)] = K.id;
            else throw Error(s7_);
            return _
        }
    }
})
// @from(Ln 129512, Col 0)
class lo {
    constructor(q, K, _, z, Y) {
        this.logger = q, this.nodeStorage = K, this.networkClient = _, this.cryptoProvider = z, this.disableInternalRetries = Y
    }
    async sendManagedIdentityTokenRequest(q, K, _, z) {
        if (!lo.identitySource) lo.identitySource = this.selectManagedIdentitySource(this.logger, this.nodeStorage, this.networkClient, this.cryptoProvider, this.disableInternalRetries, K);
        return lo.identitySource.acquireTokenWithManagedIdentity(q, K, _, z)
    }
    allEnvironmentVariablesAreDefined(q) {
        return Object.values(q).every((K) => {
            return K !== void 0
        })
    }
    getManagedIdentitySource() {
        return lo.sourceName = this.allEnvironmentVariablesAreDefined(D26.getEnvironmentVariables()) ? s3.SERVICE_FABRIC : this.allEnvironmentVariablesAreDefined(M26.getEnvironmentVariables()) ? s3.APP_SERVICE : this.allEnvironmentVariablesAreDefined(Z26.getEnvironmentVariables()) ? s3.MACHINE_LEARNING : this.allEnvironmentVariablesAreDefined(P26.getEnvironmentVariables()) ? s3.CLOUD_SHELL : this.allEnvironmentVariablesAreDefined(uq6.getEnvironmentVariables()) ? s3.AZURE_ARC : s3.DEFAULT_TO_IMDS, lo.sourceName
    }
    selectManagedIdentitySource(q, K, _, z, Y, A) {
        let O = D26.tryCreate(q, K, _, z, Y, A) || M26.tryCreate(q, K, _, z, Y) || Z26.tryCreate(q, K, _, z, Y) || P26.tryCreate(q, K, _, z, Y, A) || uq6.tryCreate(q, K, _, z, Y, A) || br6.tryCreate(q, K, _, z, Y);
        if (!O) throw $M(yv8);
        return O
    }
}
// @from(Ln 129534, Col 4)
dbq = L(() => {
    Sbq();
    ubq();
    mbq();
    gbq();
    Ubq();
    yV6();
    jj();
    Qbq();
    z26(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})