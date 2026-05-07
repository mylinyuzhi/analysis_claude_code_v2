
// @from(Ln 247577, Col 4)
A88 = p((whw, ry4) => {
    var x5 = p_();
    mp();
    Y88();
    k56();
    ic1();
    oc1();
    Hx();
    RA();
    if (typeof SY > "u") SY = x5.jsbn.BigInteger;
    var SY, ac1 = x5.util.isNodejs ? d6("crypto") : null,
        p1 = x5.asn1,
        Xx = x5.util;
    x5.pki = x5.pki || {};
    ry4.exports = x5.pki.rsa = x5.rsa = x5.rsa || {};
    var s9 = x5.pki,
        U$z = [6, 4, 2, 4, 2, 4, 6, 2],
        Q$z = {
            name: "PrivateKeyInfo",
            tagClass: p1.Class.UNIVERSAL,
            type: p1.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "PrivateKeyInfo.version",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyVersion"
            }, {
                name: "PrivateKeyInfo.privateKeyAlgorithm",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "AlgorithmIdentifier.algorithm",
                    tagClass: p1.Class.UNIVERSAL,
                    type: p1.Type.OID,
                    constructed: !1,
                    capture: "privateKeyOid"
                }]
            }, {
                name: "PrivateKeyInfo",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.OCTETSTRING,
                constructed: !1,
                capture: "privateKey"
            }]
        },
        d$z = {
            name: "RSAPrivateKey",
            tagClass: p1.Class.UNIVERSAL,
            type: p1.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "RSAPrivateKey.version",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyVersion"
            }, {
                name: "RSAPrivateKey.modulus",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyModulus"
            }, {
                name: "RSAPrivateKey.publicExponent",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyPublicExponent"
            }, {
                name: "RSAPrivateKey.privateExponent",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyPrivateExponent"
            }, {
                name: "RSAPrivateKey.prime1",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyPrime1"
            }, {
                name: "RSAPrivateKey.prime2",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyPrime2"
            }, {
                name: "RSAPrivateKey.exponent1",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyExponent1"
            }, {
                name: "RSAPrivateKey.exponent2",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyExponent2"
            }, {
                name: "RSAPrivateKey.coefficient",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyCoefficient"
            }]
        },
        c$z = {
            name: "RSAPublicKey",
            tagClass: p1.Class.UNIVERSAL,
            type: p1.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "RSAPublicKey.modulus",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.INTEGER,
                constructed: !1,
                capture: "publicKeyModulus"
            }, {
                name: "RSAPublicKey.exponent",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.INTEGER,
                constructed: !1,
                capture: "publicKeyExponent"
            }]
        },
        l$z = x5.pki.rsa.publicKeyValidator = {
            name: "SubjectPublicKeyInfo",
            tagClass: p1.Class.UNIVERSAL,
            type: p1.Type.SEQUENCE,
            constructed: !0,
            captureAsn1: "subjectPublicKeyInfo",
            value: [{
                name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "AlgorithmIdentifier.algorithm",
                    tagClass: p1.Class.UNIVERSAL,
                    type: p1.Type.OID,
                    constructed: !1,
                    capture: "publicKeyOid"
                }]
            }, {
                name: "SubjectPublicKeyInfo.subjectPublicKey",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.BITSTRING,
                constructed: !1,
                value: [{
                    name: "SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey",
                    tagClass: p1.Class.UNIVERSAL,
                    type: p1.Type.SEQUENCE,
                    constructed: !0,
                    optional: !0,
                    captureAsn1: "rsaPublicKey"
                }]
            }]
        },
        n$z = {
            name: "DigestInfo",
            tagClass: p1.Class.UNIVERSAL,
            type: p1.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "DigestInfo.DigestAlgorithm",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "DigestInfo.DigestAlgorithm.algorithmIdentifier",
                    tagClass: p1.Class.UNIVERSAL,
                    type: p1.Type.OID,
                    constructed: !1,
                    capture: "algorithmIdentifier"
                }, {
                    name: "DigestInfo.DigestAlgorithm.parameters",
                    tagClass: p1.Class.UNIVERSAL,
                    type: p1.Type.NULL,
                    capture: "parameters",
                    optional: !0,
                    constructed: !1
                }]
            }, {
                name: "DigestInfo.digest",
                tagClass: p1.Class.UNIVERSAL,
                type: p1.Type.OCTETSTRING,
                constructed: !1,
                capture: "digest"
            }]
        },
        i$z = function(q) {
            var K;
            if (q.algorithm in s9.oids) K = s9.oids[q.algorithm];
            else {
                var _ = Error("Unknown message digest algorithm.");
                throw _.algorithm = q.algorithm, _
            }
            var z = p1.oidToDer(K).getBytes(),
                Y = p1.create(p1.Class.UNIVERSAL, p1.Type.SEQUENCE, !0, []),
                A = p1.create(p1.Class.UNIVERSAL, p1.Type.SEQUENCE, !0, []);
            A.value.push(p1.create(p1.Class.UNIVERSAL, p1.Type.OID, !1, z)), A.value.push(p1.create(p1.Class.UNIVERSAL, p1.Type.NULL, !1, ""));
            var O = p1.create(p1.Class.UNIVERSAL, p1.Type.OCTETSTRING, !1, q.digest().getBytes());
            return Y.value.push(A), Y.value.push(O), p1.toDer(Y).getBytes()
        },
        ny4 = function(q, K, _) {
            if (_) return q.modPow(K.e, K.n);
            if (!K.p || !K.q) return q.modPow(K.d, K.n);
            if (!K.dP) K.dP = K.d.mod(K.p.subtract(SY.ONE));
            if (!K.dQ) K.dQ = K.d.mod(K.q.subtract(SY.ONE));
            if (!K.qInv) K.qInv = K.q.modInverse(K.p);
            var z;
            do z = new SY(x5.util.bytesToHex(x5.random.getBytes(K.n.bitLength() / 8)), 16); while (z.compareTo(K.n) >= 0 || !z.gcd(K.n).equals(SY.ONE));
            q = q.multiply(z.modPow(K.e, K.n)).mod(K.n);
            var Y = q.mod(K.p).modPow(K.dP, K.p),
                A = q.mod(K.q).modPow(K.dQ, K.q);
            while (Y.compareTo(A) < 0) Y = Y.add(K.p);
            var O = Y.subtract(A).multiply(K.qInv).mod(K.p).multiply(K.q).add(A);
            return O = O.multiply(z.modInverse(K.n)).mod(K.n), O
        };
    s9.rsa.encrypt = function(q, K, _) {
        var z = _,
            Y, A = Math.ceil(K.n.bitLength() / 8);
        if (_ !== !1 && _ !== !0) z = _ === 2, Y = iy4(q, K, _);
        else Y = x5.util.createBuffer(), Y.putBytes(q);
        var O = new SY(Y.toHex(), 16),
            w = ny4(O, K, z),
            $ = w.toString(16),
            j = x5.util.createBuffer(),
            H = A - Math.ceil($.length / 2);
        while (H > 0) j.putByte(0), --H;
        return j.putBytes(x5.util.hexToBytes($)), j.getBytes()
    };
    s9.rsa.decrypt = function(q, K, _, z) {
        var Y = Math.ceil(K.n.bitLength() / 8);
        if (q.length !== Y) {
            var A = Error("Encrypted message length is invalid.");
            throw A.length = q.length, A.expected = Y, A
        }
        var O = new SY(x5.util.createBuffer(q).toHex(), 16);
        if (O.compareTo(K.n) >= 0) throw Error("Encrypted message is invalid.");
        var w = ny4(O, K, _),
            $ = w.toString(16),
            j = x5.util.createBuffer(),
            H = Y - Math.ceil($.length / 2);
        while (H > 0) j.putByte(0), --H;
        if (j.putBytes(x5.util.hexToBytes($)), z !== !1) return tC8(j.getBytes(), K, _);
        return j.getBytes()
    };
    s9.rsa.createKeyPairGenerationState = function(q, K, _) {
        if (typeof q === "string") q = parseInt(q, 10);
        q = q || 2048, _ = _ || {};
        var z = _.prng || x5.random,
            Y = {
                nextBytes: function(w) {
                    var $ = z.getBytesSync(w.length);
                    for (var j = 0; j < w.length; ++j) w[j] = $.charCodeAt(j)
                }
            },
            A = _.algorithm || "PRIMEINC",
            O;
        if (A === "PRIMEINC") O = {
            algorithm: A,
            state: 0,
            bits: q,
            rng: Y,
            eInt: K || 65537,
            e: new SY(null),
            p: null,
            q: null,
            qBits: q >> 1,
            pBits: q - (q >> 1),
            pqState: 0,
            num: null,
            keys: null
        }, O.e.fromInt(O.eInt);
        else throw Error("Invalid key generation algorithm: " + A);
        return O
    };
    s9.rsa.stepKeyPairGenerationState = function(q, K) {
        if (!("algorithm" in q)) q.algorithm = "PRIMEINC";
        var _ = new SY(null);
        _.fromInt(30);
        var z = 0,
            Y = function(J, X) {
                return J | X
            },
            A = +new Date,
            O, w = 0;
        while (q.keys === null && (K <= 0 || w < K)) {
            if (q.state === 0) {
                var $ = q.p === null ? q.pBits : q.qBits,
                    j = $ - 1;
                if (q.pqState === 0) {
                    if (q.num = new SY($, q.rng), !q.num.testBit(j)) q.num.bitwiseTo(SY.ONE.shiftLeft(j), Y, q.num);
                    q.num.dAddOffset(31 - q.num.mod(_).byteValue(), 0), z = 0, ++q.pqState
                } else if (q.pqState === 1)
                    if (q.num.bitLength() > $) q.pqState = 0;
                    else if (q.num.isProbablePrime(o$z(q.num.bitLength()))) ++q.pqState;
                else q.num.dAddOffset(U$z[z++ % 8], 0);
                else if (q.pqState === 2) q.pqState = q.num.subtract(SY.ONE).gcd(q.e).compareTo(SY.ONE) === 0 ? 3 : 0;
                else if (q.pqState === 3) {
                    if (q.pqState = 0, q.p === null) q.p = q.num;
                    else q.q = q.num;
                    if (q.p !== null && q.q !== null) ++q.state;
                    q.num = null
                }
            } else if (q.state === 1) {
                if (q.p.compareTo(q.q) < 0) q.num = q.p, q.p = q.q, q.q = q.num;
                ++q.state
            } else if (q.state === 2) q.p1 = q.p.subtract(SY.ONE), q.q1 = q.q.subtract(SY.ONE), q.phi = q.p1.multiply(q.q1), ++q.state;
            else if (q.state === 3)
                if (q.phi.gcd(q.e).compareTo(SY.ONE) === 0) ++q.state;
                else q.p = null, q.q = null, q.state = 0;
            else if (q.state === 4)
                if (q.n = q.p.multiply(q.q), q.n.bitLength() === q.bits) ++q.state;
                else q.q = null, q.state = 0;
            else if (q.state === 5) {
                var H = q.e.modInverse(q.phi);
                q.keys = {
                    privateKey: s9.rsa.setPrivateKey(q.n, q.e, H, q.p, q.q, H.mod(q.p1), H.mod(q.q1), q.q.modInverse(q.p)),
                    publicKey: s9.rsa.setPublicKey(q.n, q.e)
                }
            }
            O = +new Date, w += O - A, A = O
        }
        return q.keys !== null
    };
    s9.rsa.generateKeyPair = function(q, K, _, z) {
        if (arguments.length === 1) {
            if (typeof q === "object") _ = q, q = void 0;
            else if (typeof q === "function") z = q, q = void 0
        } else if (arguments.length === 2)
            if (typeof q === "number") {
                if (typeof K === "function") z = K, K = void 0;
                else if (typeof K !== "number") _ = K, K = void 0
            } else _ = q, z = K, q = void 0, K = void 0;
        else if (arguments.length === 3)
            if (typeof K === "number") {
                if (typeof _ === "function") z = _, _ = void 0
            } else z = _, _ = K, K = void 0;
        if (_ = _ || {}, q === void 0) q = _.bits || 2048;
        if (K === void 0) K = _.e || 65537;
        if (!x5.options.usePureJavaScript && !_.prng && q >= 256 && q <= 16384 && (K === 65537 || K === 3)) {
            if (z) {
                if (Qy4("generateKeyPair")) return ac1.generateKeyPair("rsa", {
                    modulusLength: q,
                    publicExponent: K,
                    publicKeyEncoding: {
                        type: "spki",
                        format: "pem"
                    },
                    privateKeyEncoding: {
                        type: "pkcs8",
                        format: "pem"
                    }
                }, function(w, $, j) {
                    if (w) return z(w);
                    z(null, {
                        privateKey: s9.privateKeyFromPem(j),
                        publicKey: s9.publicKeyFromPem($)
                    })
                });
                if (dy4("generateKey") && dy4("exportKey")) return Xx.globalScope.crypto.subtle.generateKey({
                    name: "RSASSA-PKCS1-v1_5",
                    modulusLength: q,
                    publicExponent: ly4(K),
                    hash: {
                        name: "SHA-256"
                    }
                }, !0, ["sign", "verify"]).then(function(w) {
                    return Xx.globalScope.crypto.subtle.exportKey("pkcs8", w.privateKey)
                }).then(void 0, function(w) {
                    z(w)
                }).then(function(w) {
                    if (w) {
                        var $ = s9.privateKeyFromAsn1(p1.fromDer(x5.util.createBuffer(w)));
                        z(null, {
                            privateKey: $,
                            publicKey: s9.setRsaPublicKey($.n, $.e)
                        })
                    }
                });
                if (cy4("generateKey") && cy4("exportKey")) {
                    var Y = Xx.globalScope.msCrypto.subtle.generateKey({
                        name: "RSASSA-PKCS1-v1_5",
                        modulusLength: q,
                        publicExponent: ly4(K),
                        hash: {
                            name: "SHA-256"
                        }
                    }, !0, ["sign", "verify"]);
                    Y.oncomplete = function(w) {
                        var $ = w.target.result,
                            j = Xx.globalScope.msCrypto.subtle.exportKey("pkcs8", $.privateKey);
                        j.oncomplete = function(H) {
                            var J = H.target.result,
                                X = s9.privateKeyFromAsn1(p1.fromDer(x5.util.createBuffer(J)));
                            z(null, {
                                privateKey: X,
                                publicKey: s9.setRsaPublicKey(X.n, X.e)
                            })
                        }, j.onerror = function(H) {
                            z(H)
                        }
                    }, Y.onerror = function(w) {
                        z(w)
                    };
                    return
                }
            } else if (Qy4("generateKeyPairSync")) {
                var A = ac1.generateKeyPairSync("rsa", {
                    modulusLength: q,
                    publicExponent: K,
                    publicKeyEncoding: {
                        type: "spki",
                        format: "pem"
                    },
                    privateKeyEncoding: {
                        type: "pkcs8",
                        format: "pem"
                    }
                });
                return {
                    privateKey: s9.privateKeyFromPem(A.privateKey),
                    publicKey: s9.publicKeyFromPem(A.publicKey)
                }
            }
        }
        var O = s9.rsa.createKeyPairGenerationState(q, K, _);
        if (!z) return s9.rsa.stepKeyPairGenerationState(O, 0), O.keys;
        r$z(O, _, z)
    };
    s9.setRsaPublicKey = s9.rsa.setPublicKey = function(q, K) {
        var _ = {
            n: q,
            e: K
        };
        return _.encrypt = function(z, Y, A) {
            if (typeof Y === "string") Y = Y.toUpperCase();
            else if (Y === void 0) Y = "RSAES-PKCS1-V1_5";
            if (Y === "RSAES-PKCS1-V1_5") Y = {
                encode: function(w, $, j) {
                    return iy4(w, $, 2).getBytes()
                }
            };
            else if (Y === "RSA-OAEP" || Y === "RSAES-OAEP") Y = {
                encode: function(w, $) {
                    return x5.pkcs1.encode_rsa_oaep($, w, A)
                }
            };
            else if (["RAW", "NONE", "NULL", null].indexOf(Y) !== -1) Y = {
                encode: function(w) {
                    return w
                }
            };
            else if (typeof Y === "string") throw Error('Unsupported encryption scheme: "' + Y + '".');
            var O = Y.encode(z, _, !0);
            return s9.rsa.encrypt(O, _, !0)
        }, _.verify = function(z, Y, A, O) {
            if (typeof A === "string") A = A.toUpperCase();
            else if (A === void 0) A = "RSASSA-PKCS1-V1_5";
            if (O === void 0) O = {
                _parseAllDigestBytes: !0
            };
            if (!("_parseAllDigestBytes" in O)) O._parseAllDigestBytes = !0;
            if (A === "RSASSA-PKCS1-V1_5") A = {
                verify: function($, j) {
                    j = tC8(j, _, !0);
                    var H = p1.fromDer(j, {
                            parseAllBytes: O._parseAllDigestBytes
                        }),
                        J = {},
                        X = [];
                    if (!p1.validate(H, n$z, J, X)) {
                        var M = Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value.");
                        throw M.errors = X, M
                    }
                    var P = p1.derToOid(J.algorithmIdentifier);
                    if (!(P === x5.oids.md2 || P === x5.oids.md5 || P === x5.oids.sha1 || P === x5.oids.sha224 || P === x5.oids.sha256 || P === x5.oids.sha384 || P === x5.oids.sha512 || P === x5.oids["sha512-224"] || P === x5.oids["sha512-256"])) {
                        var M = Error("Unknown RSASSA-PKCS1-v1_5 DigestAlgorithm identifier.");
                        throw M.oid = P, M
                    }
                    if (P === x5.oids.md2 || P === x5.oids.md5) {
                        if (!("parameters" in J)) throw Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value. Missing algorithm identifier NULL parameters.")
                    }
                    return $ === J.digest
                }
            };
            else if (A === "NONE" || A === "NULL" || A === null) A = {
                verify: function($, j) {
                    return j = tC8(j, _, !0), $ === j
                }
            };
            var w = s9.rsa.decrypt(Y, _, !0, !1);
            return A.verify(z, w, _.n.bitLength())
        }, _
    };
    s9.setRsaPrivateKey = s9.rsa.setPrivateKey = function(q, K, _, z, Y, A, O, w) {
        var $ = {
            n: q,
            e: K,
            d: _,
            p: z,
            q: Y,
            dP: A,
            dQ: O,
            qInv: w
        };
        return $.decrypt = function(j, H, J) {
            if (typeof H === "string") H = H.toUpperCase();
            else if (H === void 0) H = "RSAES-PKCS1-V1_5";
            var X = s9.rsa.decrypt(j, $, !1, !1);
            if (H === "RSAES-PKCS1-V1_5") H = {
                decode: tC8
            };
            else if (H === "RSA-OAEP" || H === "RSAES-OAEP") H = {
                decode: function(M, P) {
                    return x5.pkcs1.decode_rsa_oaep(P, M, J)
                }
            };
            else if (["RAW", "NONE", "NULL", null].indexOf(H) !== -1) H = {
                decode: function(M) {
                    return M
                }
            };
            else throw Error('Unsupported encryption scheme: "' + H + '".');
            return H.decode(X, $, !1)
        }, $.sign = function(j, H) {
            var J = !1;
            if (typeof H === "string") H = H.toUpperCase();
            if (H === void 0 || H === "RSASSA-PKCS1-V1_5") H = {
                encode: i$z
            }, J = 1;
            else if (H === "NONE" || H === "NULL" || H === null) H = {
                encode: function() {
                    return j
                }
            }, J = 1;
            var X = H.encode(j, $.n.bitLength());
            return s9.rsa.encrypt(X, $, J)
        }, $
    };
    s9.wrapRsaPrivateKey = function(q) {
        return p1.create(p1.Class.UNIVERSAL, p1.Type.SEQUENCE, !0, [p1.create(p1.Class.UNIVERSAL, p1.Type.INTEGER, !1, p1.integerToDer(0).getBytes()), p1.create(p1.Class.UNIVERSAL, p1.Type.SEQUENCE, !0, [p1.create(p1.Class.UNIVERSAL, p1.Type.OID, !1, p1.oidToDer(s9.oids.rsaEncryption).getBytes()), p1.create(p1.Class.UNIVERSAL, p1.Type.NULL, !1, "")]), p1.create(p1.Class.UNIVERSAL, p1.Type.OCTETSTRING, !1, p1.toDer(q).getBytes())])
    };
    s9.privateKeyFromAsn1 = function(q) {
        var K = {},
            _ = [];
        if (p1.validate(q, Q$z, K, _)) q = p1.fromDer(x5.util.createBuffer(K.privateKey));
        if (K = {}, _ = [], !p1.validate(q, d$z, K, _)) {
            var z = Error("Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.");
            throw z.errors = _, z
        }
        var Y, A, O, w, $, j, H, J;
        return Y = x5.util.createBuffer(K.privateKeyModulus).toHex(), A = x5.util.createBuffer(K.privateKeyPublicExponent).toHex(), O = x5.util.createBuffer(K.privateKeyPrivateExponent).toHex(), w = x5.util.createBuffer(K.privateKeyPrime1).toHex(), $ = x5.util.createBuffer(K.privateKeyPrime2).toHex(), j = x5.util.createBuffer(K.privateKeyExponent1).toHex(), H = x5.util.createBuffer(K.privateKeyExponent2).toHex(), J = x5.util.createBuffer(K.privateKeyCoefficient).toHex(), s9.setRsaPrivateKey(new SY(Y, 16), new SY(A, 16), new SY(O, 16), new SY(w, 16), new SY($, 16), new SY(j, 16), new SY(H, 16), new SY(J, 16))
    };
    s9.privateKeyToAsn1 = s9.privateKeyToRSAPrivateKey = function(q) {
        return p1.create(p1.Class.UNIVERSAL, p1.Type.SEQUENCE, !0, [p1.create(p1.Class.UNIVERSAL, p1.Type.INTEGER, !1, p1.integerToDer(0).getBytes()), p1.create(p1.Class.UNIVERSAL, p1.Type.INTEGER, !1, Nc(q.n)), p1.create(p1.Class.UNIVERSAL, p1.Type.INTEGER, !1, Nc(q.e)), p1.create(p1.Class.UNIVERSAL, p1.Type.INTEGER, !1, Nc(q.d)), p1.create(p1.Class.UNIVERSAL, p1.Type.INTEGER, !1, Nc(q.p)), p1.create(p1.Class.UNIVERSAL, p1.Type.INTEGER, !1, Nc(q.q)), p1.create(p1.Class.UNIVERSAL, p1.Type.INTEGER, !1, Nc(q.dP)), p1.create(p1.Class.UNIVERSAL, p1.Type.INTEGER, !1, Nc(q.dQ)), p1.create(p1.Class.UNIVERSAL, p1.Type.INTEGER, !1, Nc(q.qInv))])
    };
    s9.publicKeyFromAsn1 = function(q) {
        var K = {},
            _ = [];
        if (p1.validate(q, l$z, K, _)) {
            var z = p1.derToOid(K.publicKeyOid);
            if (z !== s9.oids.rsaEncryption) {
                var Y = Error("Cannot read public key. Unknown OID.");
                throw Y.oid = z, Y
            }
            q = K.rsaPublicKey
        }
        if (_ = [], !p1.validate(q, c$z, K, _)) {
            var Y = Error("Cannot read public key. ASN.1 object does not contain an RSAPublicKey.");
            throw Y.errors = _, Y
        }
        var A = x5.util.createBuffer(K.publicKeyModulus).toHex(),
            O = x5.util.createBuffer(K.publicKeyExponent).toHex();
        return s9.setRsaPublicKey(new SY(A, 16), new SY(O, 16))
    };
    s9.publicKeyToAsn1 = s9.publicKeyToSubjectPublicKeyInfo = function(q) {
        return p1.create(p1.Class.UNIVERSAL, p1.Type.SEQUENCE, !0, [p1.create(p1.Class.UNIVERSAL, p1.Type.SEQUENCE, !0, [p1.create(p1.Class.UNIVERSAL, p1.Type.OID, !1, p1.oidToDer(s9.oids.rsaEncryption).getBytes()), p1.create(p1.Class.UNIVERSAL, p1.Type.NULL, !1, "")]), p1.create(p1.Class.UNIVERSAL, p1.Type.BITSTRING, !1, [s9.publicKeyToRSAPublicKey(q)])])
    };
    s9.publicKeyToRSAPublicKey = function(q) {
        return p1.create(p1.Class.UNIVERSAL, p1.Type.SEQUENCE, !0, [p1.create(p1.Class.UNIVERSAL, p1.Type.INTEGER, !1, Nc(q.n)), p1.create(p1.Class.UNIVERSAL, p1.Type.INTEGER, !1, Nc(q.e))])
    };

    function iy4(q, K, _) {
        var z = x5.util.createBuffer(),
            Y = Math.ceil(K.n.bitLength() / 8);
        if (q.length > Y - 11) {
            var A = Error("Message is too long for PKCS#1 v1.5 padding.");
            throw A.length = q.length, A.max = Y - 11, A
        }
        z.putByte(0), z.putByte(_);
        var O = Y - 3 - q.length,
            w;
        if (_ === 0 || _ === 1) {
            w = _ === 0 ? 0 : 255;
            for (var $ = 0; $ < O; ++$) z.putByte(w)
        } else
            while (O > 0) {
                var j = 0,
                    H = x5.random.getBytes(O);
                for (var $ = 0; $ < O; ++$)
                    if (w = H.charCodeAt($), w === 0) ++j;
                    else z.putByte(w);
                O = j
            }
        return z.putByte(0), z.putBytes(q), z
    }

    function tC8(q, K, _, z) {
        var Y = Math.ceil(K.n.bitLength() / 8),
            A = x5.util.createBuffer(q),
            O = A.getByte(),
            w = A.getByte();
        if (O !== 0 || _ && w !== 0 && w !== 1 || !_ && w != 2 || _ && w === 0 && typeof z > "u") throw Error("Encryption block is invalid.");
        var $ = 0;
        if (w === 0) {
            $ = Y - 3 - z;
            for (var j = 0; j < $; ++j)
                if (A.getByte() !== 0) throw Error("Encryption block is invalid.")
        } else if (w === 1) {
            $ = 0;
            while (A.length() > 1) {
                if (A.getByte() !== 255) {
                    --A.read;
                    break
                }++$
            }
        } else if (w === 2) {
            $ = 0;
            while (A.length() > 1) {
                if (A.getByte() === 0) {
                    --A.read;
                    break
                }++$
            }
        }
        var H = A.getByte();
        if (H !== 0 || $ !== Y - 3 - A.length()) throw Error("Encryption block is invalid.");
        return A.getBytes()
    }

    function r$z(q, K, _) {
        if (typeof K === "function") _ = K, K = {};
        K = K || {};
        var z = {
            algorithm: {
                name: K.algorithm || "PRIMEINC",
                options: {
                    workers: K.workers || 2,
                    workLoad: K.workLoad || 100,
                    workerScript: K.workerScript
                }
            }
        };
        if ("prng" in K) z.prng = K.prng;
        Y();

        function Y() {
            A(q.pBits, function(w, $) {
                if (w) return _(w);
                if (q.p = $, q.q !== null) return O(w, q.q);
                A(q.qBits, O)
            })
        }

        function A(w, $) {
            x5.prime.generateProbablePrime(w, z, $)
        }

        function O(w, $) {
            if (w) return _(w);
            if (q.q = $, q.p.compareTo(q.q) < 0) {
                var j = q.p;
                q.p = q.q, q.q = j
            }
            if (q.p.subtract(SY.ONE).gcd(q.e).compareTo(SY.ONE) !== 0) {
                q.p = null, Y();
                return
            }
            if (q.q.subtract(SY.ONE).gcd(q.e).compareTo(SY.ONE) !== 0) {
                q.q = null, A(q.qBits, O);
                return
            }
            if (q.p1 = q.p.subtract(SY.ONE), q.q1 = q.q.subtract(SY.ONE), q.phi = q.p1.multiply(q.q1), q.phi.gcd(q.e).compareTo(SY.ONE) !== 0) {
                q.p = q.q = null, Y();
                return
            }
            if (q.n = q.p.multiply(q.q), q.n.bitLength() !== q.bits) {
                q.q = null, A(q.qBits, O);
                return
            }
            var H = q.e.modInverse(q.phi);
            q.keys = {
                privateKey: s9.rsa.setPrivateKey(q.n, q.e, H, q.p, q.q, H.mod(q.p1), H.mod(q.q1), q.q.modInverse(q.p)),
                publicKey: s9.rsa.setPublicKey(q.n, q.e)
            }, _(null, q.keys)
        }
    }

    function Nc(q) {
        var K = q.toString(16);
        if (K[0] >= "8") K = "00" + K;
        var _ = x5.util.hexToBytes(K);
        if (_.length > 1 && (_.charCodeAt(0) === 0 && (_.charCodeAt(1) & 128) === 0 || _.charCodeAt(0) === 255 && (_.charCodeAt(1) & 128) === 128)) return _.substr(1);
        return _
    }

    function o$z(q) {
        if (q <= 100) return 27;
        if (q <= 150) return 18;
        if (q <= 200) return 15;
        if (q <= 250) return 12;
        if (q <= 300) return 9;
        if (q <= 350) return 8;
        if (q <= 400) return 7;
        if (q <= 500) return 6;
        if (q <= 600) return 5;
        if (q <= 800) return 4;
        if (q <= 1250) return 3;
        return 2
    }

    function Qy4(q) {
        return x5.util.isNodejs && typeof ac1[q] === "function"
    }

    function dy4(q) {
        return typeof Xx.globalScope < "u" && typeof Xx.globalScope.crypto === "object" && typeof Xx.globalScope.crypto.subtle === "object" && typeof Xx.globalScope.crypto.subtle[q] === "function"
    }

    function cy4(q) {
        return typeof Xx.globalScope < "u" && typeof Xx.globalScope.msCrypto === "object" && typeof Xx.globalScope.msCrypto.subtle === "object" && typeof Xx.globalScope.msCrypto.subtle[q] === "function"
    }

    function ly4(q) {
        var K = x5.util.hexToBytes(q.toString(16)),
            _ = new Uint8Array(K.length);
        for (var z = 0; z < K.length; ++z) _[z] = K.charCodeAt(z);
        return _
    }
})
// @from(Ln 248323, Col 4)
tc1 = p(($hw, ty4) => {
    var s4 = p_();
    V56();
    mp();
    _88();
    Zc();
    k56();
    iC8();
    NH6();
    Hx();
    Qc1();
    A88();
    RA();
    if (typeof sc1 > "u") sc1 = s4.jsbn.BigInteger;
    var sc1, G7 = s4.asn1,
        E_ = s4.pki = s4.pki || {};
    ty4.exports = E_.pbe = s4.pbe = s4.pbe || {};
    var LH6 = E_.oids,
        a$z = {
            name: "EncryptedPrivateKeyInfo",
            tagClass: G7.Class.UNIVERSAL,
            type: G7.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "EncryptedPrivateKeyInfo.encryptionAlgorithm",
                tagClass: G7.Class.UNIVERSAL,
                type: G7.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "AlgorithmIdentifier.algorithm",
                    tagClass: G7.Class.UNIVERSAL,
                    type: G7.Type.OID,
                    constructed: !1,
                    capture: "encryptionOid"
                }, {
                    name: "AlgorithmIdentifier.parameters",
                    tagClass: G7.Class.UNIVERSAL,
                    type: G7.Type.SEQUENCE,
                    constructed: !0,
                    captureAsn1: "encryptionParams"
                }]
            }, {
                name: "EncryptedPrivateKeyInfo.encryptedData",
                tagClass: G7.Class.UNIVERSAL,
                type: G7.Type.OCTETSTRING,
                constructed: !1,
                capture: "encryptedData"
            }]
        },
        s$z = {
            name: "PBES2Algorithms",
            tagClass: G7.Class.UNIVERSAL,
            type: G7.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "PBES2Algorithms.keyDerivationFunc",
                tagClass: G7.Class.UNIVERSAL,
                type: G7.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "PBES2Algorithms.keyDerivationFunc.oid",
                    tagClass: G7.Class.UNIVERSAL,
                    type: G7.Type.OID,
                    constructed: !1,
                    capture: "kdfOid"
                }, {
                    name: "PBES2Algorithms.params",
                    tagClass: G7.Class.UNIVERSAL,
                    type: G7.Type.SEQUENCE,
                    constructed: !0,
                    value: [{
                        name: "PBES2Algorithms.params.salt",
                        tagClass: G7.Class.UNIVERSAL,
                        type: G7.Type.OCTETSTRING,
                        constructed: !1,
                        capture: "kdfSalt"
                    }, {
                        name: "PBES2Algorithms.params.iterationCount",
                        tagClass: G7.Class.UNIVERSAL,
                        type: G7.Type.INTEGER,
                        constructed: !1,
                        capture: "kdfIterationCount"
                    }, {
                        name: "PBES2Algorithms.params.keyLength",
                        tagClass: G7.Class.UNIVERSAL,
                        type: G7.Type.INTEGER,
                        constructed: !1,
                        optional: !0,
                        capture: "keyLength"
                    }, {
                        name: "PBES2Algorithms.params.prf",
                        tagClass: G7.Class.UNIVERSAL,
                        type: G7.Type.SEQUENCE,
                        constructed: !0,
                        optional: !0,
                        value: [{
                            name: "PBES2Algorithms.params.prf.algorithm",
                            tagClass: G7.Class.UNIVERSAL,
                            type: G7.Type.OID,
                            constructed: !1,
                            capture: "prfOid"
                        }]
                    }]
                }]
            }, {
                name: "PBES2Algorithms.encryptionScheme",
                tagClass: G7.Class.UNIVERSAL,
                type: G7.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "PBES2Algorithms.encryptionScheme.oid",
                    tagClass: G7.Class.UNIVERSAL,
                    type: G7.Type.OID,
                    constructed: !1,
                    capture: "encOid"
                }, {
                    name: "PBES2Algorithms.encryptionScheme.iv",
                    tagClass: G7.Class.UNIVERSAL,
                    type: G7.Type.OCTETSTRING,
                    constructed: !1,
                    capture: "encIv"
                }]
            }]
        },
        t$z = {
            name: "pkcs-12PbeParams",
            tagClass: G7.Class.UNIVERSAL,
            type: G7.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "pkcs-12PbeParams.salt",
                tagClass: G7.Class.UNIVERSAL,
                type: G7.Type.OCTETSTRING,
                constructed: !1,
                capture: "salt"
            }, {
                name: "pkcs-12PbeParams.iterations",
                tagClass: G7.Class.UNIVERSAL,
                type: G7.Type.INTEGER,
                constructed: !1,
                capture: "iterations"
            }]
        };
    E_.encryptPrivateKeyInfo = function(q, K, _) {
        _ = _ || {}, _.saltSize = _.saltSize || 8, _.count = _.count || 2048, _.algorithm = _.algorithm || "aes128", _.prfAlgorithm = _.prfAlgorithm || "sha1";
        var z = s4.random.getBytesSync(_.saltSize),
            Y = _.count,
            A = G7.integerToDer(Y),
            O, w, $;
        if (_.algorithm.indexOf("aes") === 0 || _.algorithm === "des") {
            var j, H, J;
            switch (_.algorithm) {
                case "aes128":
                    O = 16, j = 16, H = LH6["aes128-CBC"], J = s4.aes.createEncryptionCipher;
                    break;
                case "aes192":
                    O = 24, j = 16, H = LH6["aes192-CBC"], J = s4.aes.createEncryptionCipher;
                    break;
                case "aes256":
                    O = 32, j = 16, H = LH6["aes256-CBC"], J = s4.aes.createEncryptionCipher;
                    break;
                case "des":
                    O = 8, j = 8, H = LH6.desCBC, J = s4.des.createEncryptionCipher;
                    break;
                default:
                    var X = Error("Cannot encrypt private key. Unknown encryption algorithm.");
                    throw X.algorithm = _.algorithm, X
            }
            var M = "hmacWith" + _.prfAlgorithm.toUpperCase(),
                P = sy4(M),
                W = s4.pkcs5.pbkdf2(K, z, Y, O, P),
                D = s4.random.getBytesSync(j),
                Z = J(W);
            Z.start(D), Z.update(G7.toDer(q)), Z.finish(), $ = Z.output.getBytes();
            var G = e$z(z, A, O, M);
            w = G7.create(G7.Class.UNIVERSAL, G7.Type.SEQUENCE, !0, [G7.create(G7.Class.UNIVERSAL, G7.Type.OID, !1, G7.oidToDer(LH6.pkcs5PBES2).getBytes()), G7.create(G7.Class.UNIVERSAL, G7.Type.SEQUENCE, !0, [G7.create(G7.Class.UNIVERSAL, G7.Type.SEQUENCE, !0, [G7.create(G7.Class.UNIVERSAL, G7.Type.OID, !1, G7.oidToDer(LH6.pkcs5PBKDF2).getBytes()), G]), G7.create(G7.Class.UNIVERSAL, G7.Type.SEQUENCE, !0, [G7.create(G7.Class.UNIVERSAL, G7.Type.OID, !1, G7.oidToDer(H).getBytes()), G7.create(G7.Class.UNIVERSAL, G7.Type.OCTETSTRING, !1, D)])])])
        } else if (_.algorithm === "3des") {
            O = 24;
            var f = new s4.util.ByteBuffer(z),
                W = E_.pbe.generatePkcs12Key(K, f, 1, Y, O),
                D = E_.pbe.generatePkcs12Key(K, f, 2, Y, O),
                Z = s4.des.createEncryptionCipher(W);
            Z.start(D), Z.update(G7.toDer(q)), Z.finish(), $ = Z.output.getBytes(), w = G7.create(G7.Class.UNIVERSAL, G7.Type.SEQUENCE, !0, [G7.create(G7.Class.UNIVERSAL, G7.Type.OID, !1, G7.oidToDer(LH6["pbeWithSHAAnd3-KeyTripleDES-CBC"]).getBytes()), G7.create(G7.Class.UNIVERSAL, G7.Type.SEQUENCE, !0, [G7.create(G7.Class.UNIVERSAL, G7.Type.OCTETSTRING, !1, z), G7.create(G7.Class.UNIVERSAL, G7.Type.INTEGER, !1, A.getBytes())])])
        } else {
            var X = Error("Cannot encrypt private key. Unknown encryption algorithm.");
            throw X.algorithm = _.algorithm, X
        }
        var v = G7.create(G7.Class.UNIVERSAL, G7.Type.SEQUENCE, !0, [w, G7.create(G7.Class.UNIVERSAL, G7.Type.OCTETSTRING, !1, $)]);
        return v
    };
    E_.decryptPrivateKeyInfo = function(q, K) {
        var _ = null,
            z = {},
            Y = [];
        if (!G7.validate(q, a$z, z, Y)) {
            var A = Error("Cannot read encrypted private key. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
            throw A.errors = Y, A
        }
        var O = G7.derToOid(z.encryptionOid),
            w = E_.pbe.getCipher(O, z.encryptionParams, K),
            $ = s4.util.createBuffer(z.encryptedData);
        if (w.update($), w.finish()) _ = G7.fromDer(w.output);
        return _
    };
    E_.encryptedPrivateKeyToPem = function(q, K) {
        var _ = {
            type: "ENCRYPTED PRIVATE KEY",
            body: G7.toDer(q).getBytes()
        };
        return s4.pem.encode(_, {
            maxline: K
        })
    };
    E_.encryptedPrivateKeyFromPem = function(q) {
        var K = s4.pem.decode(q)[0];
        if (K.type !== "ENCRYPTED PRIVATE KEY") {
            var _ = Error('Could not convert encrypted private key from PEM; PEM header type is "ENCRYPTED PRIVATE KEY".');
            throw _.headerType = K.type, _
        }
        if (K.procType && K.procType.type === "ENCRYPTED") throw Error("Could not convert encrypted private key from PEM; PEM is encrypted.");
        return G7.fromDer(K.body)
    };
    E_.encryptRsaPrivateKey = function(q, K, _) {
        if (_ = _ || {}, !_.legacy) {
            var z = E_.wrapRsaPrivateKey(E_.privateKeyToAsn1(q));
            return z = E_.encryptPrivateKeyInfo(z, K, _), E_.encryptedPrivateKeyToPem(z)
        }
        var Y, A, O, w;
        switch (_.algorithm) {
            case "aes128":
                Y = "AES-128-CBC", O = 16, A = s4.random.getBytesSync(16), w = s4.aes.createEncryptionCipher;
                break;
            case "aes192":
                Y = "AES-192-CBC", O = 24, A = s4.random.getBytesSync(16), w = s4.aes.createEncryptionCipher;
                break;
            case "aes256":
                Y = "AES-256-CBC", O = 32, A = s4.random.getBytesSync(16), w = s4.aes.createEncryptionCipher;
                break;
            case "3des":
                Y = "DES-EDE3-CBC", O = 24, A = s4.random.getBytesSync(8), w = s4.des.createEncryptionCipher;
                break;
            case "des":
                Y = "DES-CBC", O = 8, A = s4.random.getBytesSync(8), w = s4.des.createEncryptionCipher;
                break;
            default:
                var $ = Error('Could not encrypt RSA private key; unsupported encryption algorithm "' + _.algorithm + '".');
                throw $.algorithm = _.algorithm, $
        }
        var j = s4.pbe.opensslDeriveBytes(K, A.substr(0, 8), O),
            H = w(j);
        H.start(A), H.update(G7.toDer(E_.privateKeyToAsn1(q))), H.finish();
        var J = {
            type: "RSA PRIVATE KEY",
            procType: {
                version: "4",
                type: "ENCRYPTED"
            },
            dekInfo: {
                algorithm: Y,
                parameters: s4.util.bytesToHex(A).toUpperCase()
            },
            body: H.output.getBytes()
        };
        return s4.pem.encode(J)
    };
    E_.decryptRsaPrivateKey = function(q, K) {
        var _ = null,
            z = s4.pem.decode(q)[0];
        if (z.type !== "ENCRYPTED PRIVATE KEY" && z.type !== "PRIVATE KEY" && z.type !== "RSA PRIVATE KEY") {
            var Y = Error('Could not convert private key from PEM; PEM header type is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".');
            throw Y.headerType = Y, Y
        }
        if (z.procType && z.procType.type === "ENCRYPTED") {
            var A, O;
            switch (z.dekInfo.algorithm) {
                case "DES-CBC":
                    A = 8, O = s4.des.createDecryptionCipher;
                    break;
                case "DES-EDE3-CBC":
                    A = 24, O = s4.des.createDecryptionCipher;
                    break;
                case "AES-128-CBC":
                    A = 16, O = s4.aes.createDecryptionCipher;
                    break;
                case "AES-192-CBC":
                    A = 24, O = s4.aes.createDecryptionCipher;
                    break;
                case "AES-256-CBC":
                    A = 32, O = s4.aes.createDecryptionCipher;
                    break;
                case "RC2-40-CBC":
                    A = 5, O = function(J) {
                        return s4.rc2.createDecryptionCipher(J, 40)
                    };
                    break;
                case "RC2-64-CBC":
                    A = 8, O = function(J) {
                        return s4.rc2.createDecryptionCipher(J, 64)
                    };
                    break;
                case "RC2-128-CBC":
                    A = 16, O = function(J) {
                        return s4.rc2.createDecryptionCipher(J, 128)
                    };
                    break;
                default:
                    var Y = Error('Could not decrypt private key; unsupported encryption algorithm "' + z.dekInfo.algorithm + '".');
                    throw Y.algorithm = z.dekInfo.algorithm, Y
            }
            var w = s4.util.hexToBytes(z.dekInfo.parameters),
                $ = s4.pbe.opensslDeriveBytes(K, w.substr(0, 8), A),
                j = O($);
            if (j.start(w), j.update(s4.util.createBuffer(z.body)), j.finish()) _ = j.output.getBytes();
            else return _
        } else _ = z.body;
        if (z.type === "ENCRYPTED PRIVATE KEY") _ = E_.decryptPrivateKeyInfo(G7.fromDer(_), K);
        else _ = G7.fromDer(_);
        if (_ !== null) _ = E_.privateKeyFromAsn1(_);
        return _
    };
    E_.pbe.generatePkcs12Key = function(q, K, _, z, Y, A) {
        var O, w;
        if (typeof A > "u" || A === null) {
            if (!("sha1" in s4.md)) throw Error('"sha1" hash algorithm unavailable.');
            A = s4.md.sha1.create()
        }
        var {
            digestLength: $,
            blockLength: j
        } = A, H = new s4.util.ByteBuffer, J = new s4.util.ByteBuffer;
        if (q !== null && q !== void 0) {
            for (w = 0; w < q.length; w++) J.putInt16(q.charCodeAt(w));
            J.putInt16(0)
        }
        var X = J.length(),
            M = K.length(),
            P = new s4.util.ByteBuffer;
        P.fillWithByte(_, j);
        var W = j * Math.ceil(M / j),
            D = new s4.util.ByteBuffer;
        for (w = 0; w < W; w++) D.putByte(K.at(w % M));
        var Z = j * Math.ceil(X / j),
            G = new s4.util.ByteBuffer;
        for (w = 0; w < Z; w++) G.putByte(J.at(w % X));
        var f = D;
        f.putBuffer(G);
        var v = Math.ceil(Y / $);
        for (var V = 1; V <= v; V++) {
            var k = new s4.util.ByteBuffer;
            k.putBytes(P.bytes()), k.putBytes(f.bytes());
            for (var N = 0; N < z; N++) A.start(), A.update(k.getBytes()), k = A.digest();
            var R = new s4.util.ByteBuffer;
            for (w = 0; w < j; w++) R.putByte(k.at(w % $));
            var h = Math.ceil(M / j) + Math.ceil(X / j),
                C = new s4.util.ByteBuffer;
            for (O = 0; O < h; O++) {
                var x = new s4.util.ByteBuffer(f.getBytes(j)),
                    B = 511;
                for (w = R.length() - 1; w >= 0; w--) B = B >> 8, B += R.at(w) + x.at(w), x.setAt(w, B & 255);
                C.putBuffer(x)
            }
            f = C, H.putBuffer(k)
        }
        return H.truncate(H.length() - Y), H
    };
    E_.pbe.getCipher = function(q, K, _) {
        switch (q) {
            case E_.oids.pkcs5PBES2:
                return E_.pbe.getCipherForPBES2(q, K, _);
            case E_.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
            case E_.oids["pbewithSHAAnd40BitRC2-CBC"]:
                return E_.pbe.getCipherForPKCS12PBE(q, K, _);
            default:
                var z = Error("Cannot read encrypted PBE data block. Unsupported OID.");
                throw z.oid = q, z.supportedOids = ["pkcs5PBES2", "pbeWithSHAAnd3-KeyTripleDES-CBC", "pbewithSHAAnd40BitRC2-CBC"], z
        }
    };
    E_.pbe.getCipherForPBES2 = function(q, K, _) {
        var z = {},
            Y = [];
        if (!G7.validate(K, s$z, z, Y)) {
            var A = Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
            throw A.errors = Y, A
        }
        if (q = G7.derToOid(z.kdfOid), q !== E_.oids.pkcs5PBKDF2) {
            var A = Error("Cannot read encrypted private key. Unsupported key derivation function OID.");
            throw A.oid = q, A.supportedOids = ["pkcs5PBKDF2"], A
        }
        if (q = G7.derToOid(z.encOid), q !== E_.oids["aes128-CBC"] && q !== E_.oids["aes192-CBC"] && q !== E_.oids["aes256-CBC"] && q !== E_.oids["des-EDE3-CBC"] && q !== E_.oids.desCBC) {
            var A = Error("Cannot read encrypted private key. Unsupported encryption scheme OID.");
            throw A.oid = q, A.supportedOids = ["aes128-CBC", "aes192-CBC", "aes256-CBC", "des-EDE3-CBC", "desCBC"], A
        }
        var O = z.kdfSalt,
            w = s4.util.createBuffer(z.kdfIterationCount);
        w = w.getInt(w.length() << 3);
        var $, j;
        switch (E_.oids[q]) {
            case "aes128-CBC":
                $ = 16, j = s4.aes.createDecryptionCipher;
                break;
            case "aes192-CBC":
                $ = 24, j = s4.aes.createDecryptionCipher;
                break;
            case "aes256-CBC":
                $ = 32, j = s4.aes.createDecryptionCipher;
                break;
            case "des-EDE3-CBC":
                $ = 24, j = s4.des.createDecryptionCipher;
                break;
            case "desCBC":
                $ = 8, j = s4.des.createDecryptionCipher;
                break
        }
        var H = ay4(z.prfOid),
            J = s4.pkcs5.pbkdf2(_, O, w, $, H),
            X = z.encIv,
            M = j(J);
        return M.start(X), M
    };
    E_.pbe.getCipherForPKCS12PBE = function(q, K, _) {
        var z = {},
            Y = [];
        if (!G7.validate(K, t$z, z, Y)) {
            var A = Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
            throw A.errors = Y, A
        }
        var O = s4.util.createBuffer(z.salt),
            w = s4.util.createBuffer(z.iterations);
        w = w.getInt(w.length() << 3);
        var $, j, H;
        switch (q) {
            case E_.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
                $ = 24, j = 8, H = s4.des.startDecrypting;
                break;
            case E_.oids["pbewithSHAAnd40BitRC2-CBC"]:
                $ = 5, j = 8, H = function(W, D) {
                    var Z = s4.rc2.createDecryptionCipher(W, 40);
                    return Z.start(D, null), Z
                };
                break;
            default:
                var A = Error("Cannot read PKCS #12 PBE data block. Unsupported OID.");
                throw A.oid = q, A
        }
        var J = ay4(z.prfOid),
            X = E_.pbe.generatePkcs12Key(_, O, 1, w, $, J);
        J.start();
        var M = E_.pbe.generatePkcs12Key(_, O, 2, w, j, J);
        return H(X, M)
    };
    E_.pbe.opensslDeriveBytes = function(q, K, _, z) {
        if (typeof z > "u" || z === null) {
            if (!("md5" in s4.md)) throw Error('"md5" hash algorithm unavailable.');
            z = s4.md.md5.create()
        }
        if (K === null) K = "";
        var Y = [oy4(z, q + K)];
        for (var A = 16, O = 1; A < _; ++O, A += 16) Y.push(oy4(z, Y[O - 1] + q + K));
        return Y.join("").substr(0, _)
    };

    function oy4(q, K) {
        return q.start().update(K).digest().getBytes()
    }

    function ay4(q) {
        var K;
        if (!q) K = "hmacWithSHA1";
        else if (K = E_.oids[G7.derToOid(q)], !K) {
            var _ = Error("Unsupported PRF OID.");
            throw _.oid = q, _.supported = ["hmacWithSHA1", "hmacWithSHA224", "hmacWithSHA256", "hmacWithSHA384", "hmacWithSHA512"], _
        }
        return sy4(K)
    }

    function sy4(q) {
        var K = s4.md;
        switch (q) {
            case "hmacWithSHA224":
                K = s4.md.sha512;
            case "hmacWithSHA1":
            case "hmacWithSHA256":
            case "hmacWithSHA384":
            case "hmacWithSHA512":
                q = q.substr(8).toLowerCase();
                break;
            default:
                var _ = Error("Unsupported PRF algorithm.");
                throw _.algorithm = q, _.supported = ["hmacWithSHA1", "hmacWithSHA224", "hmacWithSHA256", "hmacWithSHA384", "hmacWithSHA512"], _
        }
        if (!K || !(q in K)) throw Error("Unknown hash algorithm: " + q);
        return K[q].create()
    }

    function e$z(q, K, _, z) {
        var Y = G7.create(G7.Class.UNIVERSAL, G7.Type.SEQUENCE, !0, [G7.create(G7.Class.UNIVERSAL, G7.Type.OCTETSTRING, !1, q), G7.create(G7.Class.UNIVERSAL, G7.Type.INTEGER, !1, K.getBytes())]);
        if (z !== "hmacWithSHA1") Y.value.push(G7.create(G7.Class.UNIVERSAL, G7.Type.INTEGER, !1, s4.util.hexToBytes(_.toString(16))), G7.create(G7.Class.UNIVERSAL, G7.Type.SEQUENCE, !0, [G7.create(G7.Class.UNIVERSAL, G7.Type.OID, !1, G7.oidToDer(E_.oids[z]).getBytes()), G7.create(G7.Class.UNIVERSAL, G7.Type.NULL, !1, "")]));
        return Y
    }
})
// @from(Ln 248823, Col 4)
ec1 = p((jhw, KL4) => {
    var eL6 = p_();
    mp();
    RA();
    var u4 = eL6.asn1,
        qh6 = KL4.exports = eL6.pkcs7asn1 = eL6.pkcs7asn1 || {};
    eL6.pkcs7 = eL6.pkcs7 || {};
    eL6.pkcs7.asn1 = qh6;
    var ey4 = {
        name: "ContentInfo",
        tagClass: u4.Class.UNIVERSAL,
        type: u4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "ContentInfo.ContentType",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.OID,
            constructed: !1,
            capture: "contentType"
        }, {
            name: "ContentInfo.content",
            tagClass: u4.Class.CONTEXT_SPECIFIC,
            type: 0,
            constructed: !0,
            optional: !0,
            captureAsn1: "content"
        }]
    };
    qh6.contentInfoValidator = ey4;
    var qL4 = {
        name: "EncryptedContentInfo",
        tagClass: u4.Class.UNIVERSAL,
        type: u4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "EncryptedContentInfo.contentType",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.OID,
            constructed: !1,
            capture: "contentType"
        }, {
            name: "EncryptedContentInfo.contentEncryptionAlgorithm",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "EncryptedContentInfo.contentEncryptionAlgorithm.algorithm",
                tagClass: u4.Class.UNIVERSAL,
                type: u4.Type.OID,
                constructed: !1,
                capture: "encAlgorithm"
            }, {
                name: "EncryptedContentInfo.contentEncryptionAlgorithm.parameter",
                tagClass: u4.Class.UNIVERSAL,
                captureAsn1: "encParameter"
            }]
        }, {
            name: "EncryptedContentInfo.encryptedContent",
            tagClass: u4.Class.CONTEXT_SPECIFIC,
            type: 0,
            capture: "encryptedContent",
            captureAsn1: "encryptedContentAsn1"
        }]
    };
    qh6.envelopedDataValidator = {
        name: "EnvelopedData",
        tagClass: u4.Class.UNIVERSAL,
        type: u4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "EnvelopedData.Version",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.INTEGER,
            constructed: !1,
            capture: "version"
        }, {
            name: "EnvelopedData.RecipientInfos",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.SET,
            constructed: !0,
            captureAsn1: "recipientInfos"
        }].concat(qL4)
    };
    qh6.encryptedDataValidator = {
        name: "EncryptedData",
        tagClass: u4.Class.UNIVERSAL,
        type: u4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "EncryptedData.Version",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.INTEGER,
            constructed: !1,
            capture: "version"
        }].concat(qL4)
    };
    var qjz = {
        name: "SignerInfo",
        tagClass: u4.Class.UNIVERSAL,
        type: u4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "SignerInfo.version",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.INTEGER,
            constructed: !1
        }, {
            name: "SignerInfo.issuerAndSerialNumber",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "SignerInfo.issuerAndSerialNumber.issuer",
                tagClass: u4.Class.UNIVERSAL,
                type: u4.Type.SEQUENCE,
                constructed: !0,
                captureAsn1: "issuer"
            }, {
                name: "SignerInfo.issuerAndSerialNumber.serialNumber",
                tagClass: u4.Class.UNIVERSAL,
                type: u4.Type.INTEGER,
                constructed: !1,
                capture: "serial"
            }]
        }, {
            name: "SignerInfo.digestAlgorithm",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "SignerInfo.digestAlgorithm.algorithm",
                tagClass: u4.Class.UNIVERSAL,
                type: u4.Type.OID,
                constructed: !1,
                capture: "digestAlgorithm"
            }, {
                name: "SignerInfo.digestAlgorithm.parameter",
                tagClass: u4.Class.UNIVERSAL,
                constructed: !1,
                captureAsn1: "digestParameter",
                optional: !0
            }]
        }, {
            name: "SignerInfo.authenticatedAttributes",
            tagClass: u4.Class.CONTEXT_SPECIFIC,
            type: 0,
            constructed: !0,
            optional: !0,
            capture: "authenticatedAttributes"
        }, {
            name: "SignerInfo.digestEncryptionAlgorithm",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.SEQUENCE,
            constructed: !0,
            capture: "signatureAlgorithm"
        }, {
            name: "SignerInfo.encryptedDigest",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.OCTETSTRING,
            constructed: !1,
            capture: "signature"
        }, {
            name: "SignerInfo.unauthenticatedAttributes",
            tagClass: u4.Class.CONTEXT_SPECIFIC,
            type: 1,
            constructed: !0,
            optional: !0,
            capture: "unauthenticatedAttributes"
        }]
    };
    qh6.signedDataValidator = {
        name: "SignedData",
        tagClass: u4.Class.UNIVERSAL,
        type: u4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "SignedData.Version",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.INTEGER,
            constructed: !1,
            capture: "version"
        }, {
            name: "SignedData.DigestAlgorithms",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.SET,
            constructed: !0,
            captureAsn1: "digestAlgorithms"
        }, ey4, {
            name: "SignedData.Certificates",
            tagClass: u4.Class.CONTEXT_SPECIFIC,
            type: 0,
            optional: !0,
            captureAsn1: "certificates"
        }, {
            name: "SignedData.CertificateRevocationLists",
            tagClass: u4.Class.CONTEXT_SPECIFIC,
            type: 1,
            optional: !0,
            captureAsn1: "crls"
        }, {
            name: "SignedData.SignerInfos",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.SET,
            capture: "signerInfos",
            optional: !0,
            value: [qjz]
        }]
    };
    qh6.recipientInfoValidator = {
        name: "RecipientInfo",
        tagClass: u4.Class.UNIVERSAL,
        type: u4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "RecipientInfo.version",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.INTEGER,
            constructed: !1,
            capture: "version"
        }, {
            name: "RecipientInfo.issuerAndSerial",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "RecipientInfo.issuerAndSerial.issuer",
                tagClass: u4.Class.UNIVERSAL,
                type: u4.Type.SEQUENCE,
                constructed: !0,
                captureAsn1: "issuer"
            }, {
                name: "RecipientInfo.issuerAndSerial.serialNumber",
                tagClass: u4.Class.UNIVERSAL,
                type: u4.Type.INTEGER,
                constructed: !1,
                capture: "serial"
            }]
        }, {
            name: "RecipientInfo.keyEncryptionAlgorithm",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "RecipientInfo.keyEncryptionAlgorithm.algorithm",
                tagClass: u4.Class.UNIVERSAL,
                type: u4.Type.OID,
                constructed: !1,
                capture: "encAlgorithm"
            }, {
                name: "RecipientInfo.keyEncryptionAlgorithm.parameter",
                tagClass: u4.Class.UNIVERSAL,
                constructed: !1,
                captureAsn1: "encParameter",
                optional: !0
            }]
        }, {
            name: "RecipientInfo.encryptedKey",
            tagClass: u4.Class.UNIVERSAL,
            type: u4.Type.OCTETSTRING,
            constructed: !1,
            capture: "encKey"
        }]
    }
})
// @from(Ln 249087, Col 4)
ql1 = p((Hhw, _L4) => {
    var hH6 = p_();
    RA();
    hH6.mgf = hH6.mgf || {};
    var Kjz = _L4.exports = hH6.mgf.mgf1 = hH6.mgf1 = hH6.mgf1 || {};
    Kjz.create = function(q) {
        var K = {
            generate: function(_, z) {
                var Y = new hH6.util.ByteBuffer,
                    A = Math.ceil(z / q.digestLength);
                for (var O = 0; O < A; O++) {
                    var w = new hH6.util.ByteBuffer;
                    w.putInt32(O), q.start(), q.update(_ + w.getBytes()), Y.putBuffer(q.digest())
                }
                return Y.truncate(Y.length() - z), Y.getBytes()
            }
        };
        return K
    }
})
// @from(Ln 249107, Col 4)
YL4 = p((Jhw, zL4) => {
    var eC8 = p_();
    ql1();
    zL4.exports = eC8.mgf = eC8.mgf || {};
    eC8.mgf.mgf1 = eC8.mgf1
})
// @from(Ln 249113, Col 4)
qb8 = p((Xhw, AL4) => {
    var RH6 = p_();
    Hx();
    RA();
    var _jz = AL4.exports = RH6.pss = RH6.pss || {};
    _jz.create = function(q) {
        if (arguments.length === 3) q = {
            md: arguments[0],
            mgf: arguments[1],
            saltLength: arguments[2]
        };
        var {
            md: K,
            mgf: _
        } = q, z = K.digestLength, Y = q.salt || null;
        if (typeof Y === "string") Y = RH6.util.createBuffer(Y);
        var A;
        if ("saltLength" in q) A = q.saltLength;
        else if (Y !== null) A = Y.length();
        else throw Error("Salt length not specified or specific salt not given.");
        if (Y !== null && Y.length() !== A) throw Error("Given salt length does not match length of given salt.");
        var O = q.prng || RH6.random,
            w = {};
        return w.encode = function($, j) {
            var H, J = j - 1,
                X = Math.ceil(J / 8),
                M = $.digest().getBytes();
            if (X < z + A + 2) throw Error("Message is too long to encrypt.");
            var P;
            if (Y === null) P = O.getBytesSync(A);
            else P = Y.bytes();
            var W = new RH6.util.ByteBuffer;
            W.fillWithByte(0, 8), W.putBytes(M), W.putBytes(P), K.start(), K.update(W.getBytes());
            var D = K.digest().getBytes(),
                Z = new RH6.util.ByteBuffer;
            Z.fillWithByte(0, X - A - z - 2), Z.putByte(1), Z.putBytes(P);
            var G = Z.getBytes(),
                f = X - z - 1,
                v = _.generate(D, f),
                V = "";
            for (H = 0; H < f; H++) V += String.fromCharCode(G.charCodeAt(H) ^ v.charCodeAt(H));
            var k = 65280 >> 8 * X - J & 255;
            return V = String.fromCharCode(V.charCodeAt(0) & ~k) + V.substr(1), V + D + String.fromCharCode(188)
        }, w.verify = function($, j, H) {
            var J, X = H - 1,
                M = Math.ceil(X / 8);
            if (j = j.substr(-M), M < z + A + 2) throw Error("Inconsistent parameters to PSS signature verification.");
            if (j.charCodeAt(M - 1) !== 188) throw Error("Encoded message does not end in 0xBC.");
            var P = M - z - 1,
                W = j.substr(0, P),
                D = j.substr(P, z),
                Z = 65280 >> 8 * M - X & 255;
            if ((W.charCodeAt(0) & Z) !== 0) throw Error("Bits beyond keysize not zero as expected.");
            var G = _.generate(D, P),
                f = "";
            for (J = 0; J < P; J++) f += String.fromCharCode(W.charCodeAt(J) ^ G.charCodeAt(J));
            f = String.fromCharCode(f.charCodeAt(0) & ~Z) + f.substr(1);
            var v = M - z - A - 2;
            for (J = 0; J < v; J++)
                if (f.charCodeAt(J) !== 0) throw Error("Leftmost octets not zero as expected");
            if (f.charCodeAt(v) !== 1) throw Error("Inconsistent PSS signature, 0x01 marker not found");
            var V = f.substr(-A),
                k = new RH6.util.ByteBuffer;
            k.fillWithByte(0, 8), k.putBytes($), k.putBytes(V), K.start(), K.update(k.getBytes());
            var N = K.digest().getBytes();
            return D === N
        }, w
    }
})