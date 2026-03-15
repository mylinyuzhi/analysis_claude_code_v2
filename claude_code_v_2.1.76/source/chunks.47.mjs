
// @from(Ln 116942, Col 4)
FI6 = x((Cv_, nH7) => {
    var cq = h3();
    GC();
    gI6();
    qa();
    yY8();
    RY8();
    HL();
    tY();
    if (typeof wY > "u") wY = cq.jsbn.BigInteger;
    var wY, hY8 = cq.util.isNodejs ? x6("crypto") : null,
        Z8 = cq.asn1,
        JL = cq.util;
    cq.pki = cq.pki || {};
    nH7.exports = cq.pki.rsa = cq.rsa = cq.rsa || {};
    var p5 = cq.pki,
        $W3 = [6, 4, 2, 4, 2, 4, 6, 2],
        HW3 = {
            name: "PrivateKeyInfo",
            tagClass: Z8.Class.UNIVERSAL,
            type: Z8.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "PrivateKeyInfo.version",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyVersion"
            }, {
                name: "PrivateKeyInfo.privateKeyAlgorithm",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "AlgorithmIdentifier.algorithm",
                    tagClass: Z8.Class.UNIVERSAL,
                    type: Z8.Type.OID,
                    constructed: !1,
                    capture: "privateKeyOid"
                }]
            }, {
                name: "PrivateKeyInfo",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.OCTETSTRING,
                constructed: !1,
                capture: "privateKey"
            }]
        },
        jW3 = {
            name: "RSAPrivateKey",
            tagClass: Z8.Class.UNIVERSAL,
            type: Z8.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "RSAPrivateKey.version",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyVersion"
            }, {
                name: "RSAPrivateKey.modulus",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyModulus"
            }, {
                name: "RSAPrivateKey.publicExponent",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyPublicExponent"
            }, {
                name: "RSAPrivateKey.privateExponent",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyPrivateExponent"
            }, {
                name: "RSAPrivateKey.prime1",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyPrime1"
            }, {
                name: "RSAPrivateKey.prime2",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyPrime2"
            }, {
                name: "RSAPrivateKey.exponent1",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyExponent1"
            }, {
                name: "RSAPrivateKey.exponent2",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyExponent2"
            }, {
                name: "RSAPrivateKey.coefficient",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.INTEGER,
                constructed: !1,
                capture: "privateKeyCoefficient"
            }]
        },
        JW3 = {
            name: "RSAPublicKey",
            tagClass: Z8.Class.UNIVERSAL,
            type: Z8.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "RSAPublicKey.modulus",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.INTEGER,
                constructed: !1,
                capture: "publicKeyModulus"
            }, {
                name: "RSAPublicKey.exponent",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.INTEGER,
                constructed: !1,
                capture: "publicKeyExponent"
            }]
        },
        MW3 = cq.pki.rsa.publicKeyValidator = {
            name: "SubjectPublicKeyInfo",
            tagClass: Z8.Class.UNIVERSAL,
            type: Z8.Type.SEQUENCE,
            constructed: !0,
            captureAsn1: "subjectPublicKeyInfo",
            value: [{
                name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "AlgorithmIdentifier.algorithm",
                    tagClass: Z8.Class.UNIVERSAL,
                    type: Z8.Type.OID,
                    constructed: !1,
                    capture: "publicKeyOid"
                }]
            }, {
                name: "SubjectPublicKeyInfo.subjectPublicKey",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.BITSTRING,
                constructed: !1,
                value: [{
                    name: "SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey",
                    tagClass: Z8.Class.UNIVERSAL,
                    type: Z8.Type.SEQUENCE,
                    constructed: !0,
                    optional: !0,
                    captureAsn1: "rsaPublicKey"
                }]
            }]
        },
        DW3 = {
            name: "DigestInfo",
            tagClass: Z8.Class.UNIVERSAL,
            type: Z8.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "DigestInfo.DigestAlgorithm",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "DigestInfo.DigestAlgorithm.algorithmIdentifier",
                    tagClass: Z8.Class.UNIVERSAL,
                    type: Z8.Type.OID,
                    constructed: !1,
                    capture: "algorithmIdentifier"
                }, {
                    name: "DigestInfo.DigestAlgorithm.parameters",
                    tagClass: Z8.Class.UNIVERSAL,
                    type: Z8.Type.NULL,
                    capture: "parameters",
                    optional: !0,
                    constructed: !1
                }]
            }, {
                name: "DigestInfo.digest",
                tagClass: Z8.Class.UNIVERSAL,
                type: Z8.Type.OCTETSTRING,
                constructed: !1,
                capture: "digest"
            }]
        },
        XW3 = function(A) {
            var q;
            if (A.algorithm in p5.oids) q = p5.oids[A.algorithm];
            else {
                var K = Error("Unknown message digest algorithm.");
                throw K.algorithm = A.algorithm, K
            }
            var Y = Z8.oidToDer(q).getBytes(),
                z = Z8.create(Z8.Class.UNIVERSAL, Z8.Type.SEQUENCE, !0, []),
                _ = Z8.create(Z8.Class.UNIVERSAL, Z8.Type.SEQUENCE, !0, []);
            _.value.push(Z8.create(Z8.Class.UNIVERSAL, Z8.Type.OID, !1, Y)), _.value.push(Z8.create(Z8.Class.UNIVERSAL, Z8.Type.NULL, !1, ""));
            var w = Z8.create(Z8.Class.UNIVERSAL, Z8.Type.OCTETSTRING, !1, A.digest().getBytes());
            return z.value.push(_), z.value.push(w), Z8.toDer(z).getBytes()
        },
        lH7 = function(A, q, K) {
            if (K) return A.modPow(q.e, q.n);
            if (!q.p || !q.q) return A.modPow(q.d, q.n);
            if (!q.dP) q.dP = q.d.mod(q.p.subtract(wY.ONE));
            if (!q.dQ) q.dQ = q.d.mod(q.q.subtract(wY.ONE));
            if (!q.qInv) q.qInv = q.q.modInverse(q.p);
            var Y;
            do Y = new wY(cq.util.bytesToHex(cq.random.getBytes(q.n.bitLength() / 8)), 16); while (Y.compareTo(q.n) >= 0 || !Y.gcd(q.n).equals(wY.ONE));
            A = A.multiply(Y.modPow(q.e, q.n)).mod(q.n);
            var z = A.mod(q.p).modPow(q.dP, q.p),
                _ = A.mod(q.q).modPow(q.dQ, q.q);
            while (z.compareTo(_) < 0) z = z.add(q.p);
            var w = z.subtract(_).multiply(q.qInv).mod(q.p).multiply(q.q).add(_);
            return w = w.multiply(Y.modInverse(q.n)).mod(q.n), w
        };
    p5.rsa.encrypt = function(A, q, K) {
        var Y = K,
            z, _ = Math.ceil(q.n.bitLength() / 8);
        if (K !== !1 && K !== !0) Y = K === 2, z = iH7(A, q, K);
        else z = cq.util.createBuffer(), z.putBytes(A);
        var w = new wY(z.toHex(), 16),
            O = lH7(w, q, Y),
            $ = O.toString(16),
            H = cq.util.createBuffer(),
            j = _ - Math.ceil($.length / 2);
        while (j > 0) H.putByte(0), --j;
        return H.putBytes(cq.util.hexToBytes($)), H.getBytes()
    };
    p5.rsa.decrypt = function(A, q, K, Y) {
        var z = Math.ceil(q.n.bitLength() / 8);
        if (A.length !== z) {
            var _ = Error("Encrypted message length is invalid.");
            throw _.length = A.length, _.expected = z, _
        }
        var w = new wY(cq.util.createBuffer(A).toHex(), 16);
        if (w.compareTo(q.n) >= 0) throw Error("Encrypted message is invalid.");
        var O = lH7(w, q, K),
            $ = O.toString(16),
            H = cq.util.createBuffer(),
            j = z - Math.ceil($.length / 2);
        while (j > 0) H.putByte(0), --j;
        if (H.putBytes(cq.util.hexToBytes($)), Y !== !1) return IY1(H.getBytes(), q, K);
        return H.getBytes()
    };
    p5.rsa.createKeyPairGenerationState = function(A, q, K) {
        if (typeof A === "string") A = parseInt(A, 10);
        A = A || 2048, K = K || {};
        var Y = K.prng || cq.random,
            z = {
                nextBytes: function(O) {
                    var $ = Y.getBytesSync(O.length);
                    for (var H = 0; H < O.length; ++H) O[H] = $.charCodeAt(H)
                }
            },
            _ = K.algorithm || "PRIMEINC",
            w;
        if (_ === "PRIMEINC") w = {
            algorithm: _,
            state: 0,
            bits: A,
            rng: z,
            eInt: q || 65537,
            e: new wY(null),
            p: null,
            q: null,
            qBits: A >> 1,
            pBits: A - (A >> 1),
            pqState: 0,
            num: null,
            keys: null
        }, w.e.fromInt(w.eInt);
        else throw Error("Invalid key generation algorithm: " + _);
        return w
    };
    p5.rsa.stepKeyPairGenerationState = function(A, q) {
        if (!("algorithm" in A)) A.algorithm = "PRIMEINC";
        var K = new wY(null);
        K.fromInt(30);
        var Y = 0,
            z = function(J, M) {
                return J | M
            },
            _ = +new Date,
            w, O = 0;
        while (A.keys === null && (q <= 0 || O < q)) {
            if (A.state === 0) {
                var $ = A.p === null ? A.pBits : A.qBits,
                    H = $ - 1;
                if (A.pqState === 0) {
                    if (A.num = new wY($, A.rng), !A.num.testBit(H)) A.num.bitwiseTo(wY.ONE.shiftLeft(H), z, A.num);
                    A.num.dAddOffset(31 - A.num.mod(K).byteValue(), 0), Y = 0, ++A.pqState
                } else if (A.pqState === 1)
                    if (A.num.bitLength() > $) A.pqState = 0;
                    else if (A.num.isProbablePrime(WW3(A.num.bitLength()))) ++A.pqState;
                else A.num.dAddOffset($W3[Y++ % 8], 0);
                else if (A.pqState === 2) A.pqState = A.num.subtract(wY.ONE).gcd(A.e).compareTo(wY.ONE) === 0 ? 3 : 0;
                else if (A.pqState === 3) {
                    if (A.pqState = 0, A.p === null) A.p = A.num;
                    else A.q = A.num;
                    if (A.p !== null && A.q !== null) ++A.state;
                    A.num = null
                }
            } else if (A.state === 1) {
                if (A.p.compareTo(A.q) < 0) A.num = A.p, A.p = A.q, A.q = A.num;
                ++A.state
            } else if (A.state === 2) A.p1 = A.p.subtract(wY.ONE), A.q1 = A.q.subtract(wY.ONE), A.phi = A.p1.multiply(A.q1), ++A.state;
            else if (A.state === 3)
                if (A.phi.gcd(A.e).compareTo(wY.ONE) === 0) ++A.state;
                else A.p = null, A.q = null, A.state = 0;
            else if (A.state === 4)
                if (A.n = A.p.multiply(A.q), A.n.bitLength() === A.bits) ++A.state;
                else A.q = null, A.state = 0;
            else if (A.state === 5) {
                var j = A.e.modInverse(A.phi);
                A.keys = {
                    privateKey: p5.rsa.setPrivateKey(A.n, A.e, j, A.p, A.q, j.mod(A.p1), j.mod(A.q1), A.q.modInverse(A.p)),
                    publicKey: p5.rsa.setPublicKey(A.n, A.e)
                }
            }
            w = +new Date, O += w - _, _ = w
        }
        return A.keys !== null
    };
    p5.rsa.generateKeyPair = function(A, q, K, Y) {
        if (arguments.length === 1) {
            if (typeof A === "object") K = A, A = void 0;
            else if (typeof A === "function") Y = A, A = void 0
        } else if (arguments.length === 2)
            if (typeof A === "number") {
                if (typeof q === "function") Y = q, q = void 0;
                else if (typeof q !== "number") K = q, q = void 0
            } else K = A, Y = q, A = void 0, q = void 0;
        else if (arguments.length === 3)
            if (typeof q === "number") {
                if (typeof K === "function") Y = K, K = void 0
            } else Y = K, K = q, q = void 0;
        if (K = K || {}, A === void 0) A = K.bits || 2048;
        if (q === void 0) q = K.e || 65537;
        if (!cq.options.usePureJavaScript && !K.prng && A >= 256 && A <= 16384 && (q === 65537 || q === 3)) {
            if (Y) {
                if (QH7("generateKeyPair")) return hY8.generateKeyPair("rsa", {
                    modulusLength: A,
                    publicExponent: q,
                    publicKeyEncoding: {
                        type: "spki",
                        format: "pem"
                    },
                    privateKeyEncoding: {
                        type: "pkcs8",
                        format: "pem"
                    }
                }, function(O, $, H) {
                    if (O) return Y(O);
                    Y(null, {
                        privateKey: p5.privateKeyFromPem(H),
                        publicKey: p5.publicKeyFromPem($)
                    })
                });
                if (UH7("generateKey") && UH7("exportKey")) return JL.globalScope.crypto.subtle.generateKey({
                    name: "RSASSA-PKCS1-v1_5",
                    modulusLength: A,
                    publicExponent: cH7(q),
                    hash: {
                        name: "SHA-256"
                    }
                }, !0, ["sign", "verify"]).then(function(O) {
                    return JL.globalScope.crypto.subtle.exportKey("pkcs8", O.privateKey)
                }).then(void 0, function(O) {
                    Y(O)
                }).then(function(O) {
                    if (O) {
                        var $ = p5.privateKeyFromAsn1(Z8.fromDer(cq.util.createBuffer(O)));
                        Y(null, {
                            privateKey: $,
                            publicKey: p5.setRsaPublicKey($.n, $.e)
                        })
                    }
                });
                if (dH7("generateKey") && dH7("exportKey")) {
                    var z = JL.globalScope.msCrypto.subtle.generateKey({
                        name: "RSASSA-PKCS1-v1_5",
                        modulusLength: A,
                        publicExponent: cH7(q),
                        hash: {
                            name: "SHA-256"
                        }
                    }, !0, ["sign", "verify"]);
                    z.oncomplete = function(O) {
                        var $ = O.target.result,
                            H = JL.globalScope.msCrypto.subtle.exportKey("pkcs8", $.privateKey);
                        H.oncomplete = function(j) {
                            var J = j.target.result,
                                M = p5.privateKeyFromAsn1(Z8.fromDer(cq.util.createBuffer(J)));
                            Y(null, {
                                privateKey: M,
                                publicKey: p5.setRsaPublicKey(M.n, M.e)
                            })
                        }, H.onerror = function(j) {
                            Y(j)
                        }
                    }, z.onerror = function(O) {
                        Y(O)
                    };
                    return
                }
            } else if (QH7("generateKeyPairSync")) {
                var _ = hY8.generateKeyPairSync("rsa", {
                    modulusLength: A,
                    publicExponent: q,
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
                    privateKey: p5.privateKeyFromPem(_.privateKey),
                    publicKey: p5.publicKeyFromPem(_.publicKey)
                }
            }
        }
        var w = p5.rsa.createKeyPairGenerationState(A, q, K);
        if (!Y) return p5.rsa.stepKeyPairGenerationState(w, 0), w.keys;
        PW3(w, K, Y)
    };
    p5.setRsaPublicKey = p5.rsa.setPublicKey = function(A, q) {
        var K = {
            n: A,
            e: q
        };
        return K.encrypt = function(Y, z, _) {
            if (typeof z === "string") z = z.toUpperCase();
            else if (z === void 0) z = "RSAES-PKCS1-V1_5";
            if (z === "RSAES-PKCS1-V1_5") z = {
                encode: function(O, $, H) {
                    return iH7(O, $, 2).getBytes()
                }
            };
            else if (z === "RSA-OAEP" || z === "RSAES-OAEP") z = {
                encode: function(O, $) {
                    return cq.pkcs1.encode_rsa_oaep($, O, _)
                }
            };
            else if (["RAW", "NONE", "NULL", null].indexOf(z) !== -1) z = {
                encode: function(O) {
                    return O
                }
            };
            else if (typeof z === "string") throw Error('Unsupported encryption scheme: "' + z + '".');
            var w = z.encode(Y, K, !0);
            return p5.rsa.encrypt(w, K, !0)
        }, K.verify = function(Y, z, _, w) {
            if (typeof _ === "string") _ = _.toUpperCase();
            else if (_ === void 0) _ = "RSASSA-PKCS1-V1_5";
            if (w === void 0) w = {
                _parseAllDigestBytes: !0
            };
            if (!("_parseAllDigestBytes" in w)) w._parseAllDigestBytes = !0;
            if (_ === "RSASSA-PKCS1-V1_5") _ = {
                verify: function($, H) {
                    H = IY1(H, K, !0);
                    var j = Z8.fromDer(H, {
                            parseAllBytes: w._parseAllDigestBytes
                        }),
                        J = {},
                        M = [];
                    if (!Z8.validate(j, DW3, J, M)) {
                        var D = Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value.");
                        throw D.errors = M, D
                    }
                    var X = Z8.derToOid(J.algorithmIdentifier);
                    if (!(X === cq.oids.md2 || X === cq.oids.md5 || X === cq.oids.sha1 || X === cq.oids.sha224 || X === cq.oids.sha256 || X === cq.oids.sha384 || X === cq.oids.sha512 || X === cq.oids["sha512-224"] || X === cq.oids["sha512-256"])) {
                        var D = Error("Unknown RSASSA-PKCS1-v1_5 DigestAlgorithm identifier.");
                        throw D.oid = X, D
                    }
                    if (X === cq.oids.md2 || X === cq.oids.md5) {
                        if (!("parameters" in J)) throw Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value. Missing algorithm identifer NULL parameters.")
                    }
                    return $ === J.digest
                }
            };
            else if (_ === "NONE" || _ === "NULL" || _ === null) _ = {
                verify: function($, H) {
                    return H = IY1(H, K, !0), $ === H
                }
            };
            var O = p5.rsa.decrypt(z, K, !0, !1);
            return _.verify(Y, O, K.n.bitLength())
        }, K
    };
    p5.setRsaPrivateKey = p5.rsa.setPrivateKey = function(A, q, K, Y, z, _, w, O) {
        var $ = {
            n: A,
            e: q,
            d: K,
            p: Y,
            q: z,
            dP: _,
            dQ: w,
            qInv: O
        };
        return $.decrypt = function(H, j, J) {
            if (typeof j === "string") j = j.toUpperCase();
            else if (j === void 0) j = "RSAES-PKCS1-V1_5";
            var M = p5.rsa.decrypt(H, $, !1, !1);
            if (j === "RSAES-PKCS1-V1_5") j = {
                decode: IY1
            };
            else if (j === "RSA-OAEP" || j === "RSAES-OAEP") j = {
                decode: function(D, X) {
                    return cq.pkcs1.decode_rsa_oaep(X, D, J)
                }
            };
            else if (["RAW", "NONE", "NULL", null].indexOf(j) !== -1) j = {
                decode: function(D) {
                    return D
                }
            };
            else throw Error('Unsupported encryption scheme: "' + j + '".');
            return j.decode(M, $, !1)
        }, $.sign = function(H, j) {
            var J = !1;
            if (typeof j === "string") j = j.toUpperCase();
            if (j === void 0 || j === "RSASSA-PKCS1-V1_5") j = {
                encode: XW3
            }, J = 1;
            else if (j === "NONE" || j === "NULL" || j === null) j = {
                encode: function() {
                    return H
                }
            }, J = 1;
            var M = j.encode(H, $.n.bitLength());
            return p5.rsa.encrypt(M, $, J)
        }, $
    };
    p5.wrapRsaPrivateKey = function(A) {
        return Z8.create(Z8.Class.UNIVERSAL, Z8.Type.SEQUENCE, !0, [Z8.create(Z8.Class.UNIVERSAL, Z8.Type.INTEGER, !1, Z8.integerToDer(0).getBytes()), Z8.create(Z8.Class.UNIVERSAL, Z8.Type.SEQUENCE, !0, [Z8.create(Z8.Class.UNIVERSAL, Z8.Type.OID, !1, Z8.oidToDer(p5.oids.rsaEncryption).getBytes()), Z8.create(Z8.Class.UNIVERSAL, Z8.Type.NULL, !1, "")]), Z8.create(Z8.Class.UNIVERSAL, Z8.Type.OCTETSTRING, !1, Z8.toDer(A).getBytes())])
    };
    p5.privateKeyFromAsn1 = function(A) {
        var q = {},
            K = [];
        if (Z8.validate(A, HW3, q, K)) A = Z8.fromDer(cq.util.createBuffer(q.privateKey));
        if (q = {}, K = [], !Z8.validate(A, jW3, q, K)) {
            var Y = Error("Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.");
            throw Y.errors = K, Y
        }
        var z, _, w, O, $, H, j, J;
        return z = cq.util.createBuffer(q.privateKeyModulus).toHex(), _ = cq.util.createBuffer(q.privateKeyPublicExponent).toHex(), w = cq.util.createBuffer(q.privateKeyPrivateExponent).toHex(), O = cq.util.createBuffer(q.privateKeyPrime1).toHex(), $ = cq.util.createBuffer(q.privateKeyPrime2).toHex(), H = cq.util.createBuffer(q.privateKeyExponent1).toHex(), j = cq.util.createBuffer(q.privateKeyExponent2).toHex(), J = cq.util.createBuffer(q.privateKeyCoefficient).toHex(), p5.setRsaPrivateKey(new wY(z, 16), new wY(_, 16), new wY(w, 16), new wY(O, 16), new wY($, 16), new wY(H, 16), new wY(j, 16), new wY(J, 16))
    };
    p5.privateKeyToAsn1 = p5.privateKeyToRSAPrivateKey = function(A) {
        return Z8.create(Z8.Class.UNIVERSAL, Z8.Type.SEQUENCE, !0, [Z8.create(Z8.Class.UNIVERSAL, Z8.Type.INTEGER, !1, Z8.integerToDer(0).getBytes()), Z8.create(Z8.Class.UNIVERSAL, Z8.Type.INTEGER, !1, su(A.n)), Z8.create(Z8.Class.UNIVERSAL, Z8.Type.INTEGER, !1, su(A.e)), Z8.create(Z8.Class.UNIVERSAL, Z8.Type.INTEGER, !1, su(A.d)), Z8.create(Z8.Class.UNIVERSAL, Z8.Type.INTEGER, !1, su(A.p)), Z8.create(Z8.Class.UNIVERSAL, Z8.Type.INTEGER, !1, su(A.q)), Z8.create(Z8.Class.UNIVERSAL, Z8.Type.INTEGER, !1, su(A.dP)), Z8.create(Z8.Class.UNIVERSAL, Z8.Type.INTEGER, !1, su(A.dQ)), Z8.create(Z8.Class.UNIVERSAL, Z8.Type.INTEGER, !1, su(A.qInv))])
    };
    p5.publicKeyFromAsn1 = function(A) {
        var q = {},
            K = [];
        if (Z8.validate(A, MW3, q, K)) {
            var Y = Z8.derToOid(q.publicKeyOid);
            if (Y !== p5.oids.rsaEncryption) {
                var z = Error("Cannot read public key. Unknown OID.");
                throw z.oid = Y, z
            }
            A = q.rsaPublicKey
        }
        if (K = [], !Z8.validate(A, JW3, q, K)) {
            var z = Error("Cannot read public key. ASN.1 object does not contain an RSAPublicKey.");
            throw z.errors = K, z
        }
        var _ = cq.util.createBuffer(q.publicKeyModulus).toHex(),
            w = cq.util.createBuffer(q.publicKeyExponent).toHex();
        return p5.setRsaPublicKey(new wY(_, 16), new wY(w, 16))
    };
    p5.publicKeyToAsn1 = p5.publicKeyToSubjectPublicKeyInfo = function(A) {
        return Z8.create(Z8.Class.UNIVERSAL, Z8.Type.SEQUENCE, !0, [Z8.create(Z8.Class.UNIVERSAL, Z8.Type.SEQUENCE, !0, [Z8.create(Z8.Class.UNIVERSAL, Z8.Type.OID, !1, Z8.oidToDer(p5.oids.rsaEncryption).getBytes()), Z8.create(Z8.Class.UNIVERSAL, Z8.Type.NULL, !1, "")]), Z8.create(Z8.Class.UNIVERSAL, Z8.Type.BITSTRING, !1, [p5.publicKeyToRSAPublicKey(A)])])
    };
    p5.publicKeyToRSAPublicKey = function(A) {
        return Z8.create(Z8.Class.UNIVERSAL, Z8.Type.SEQUENCE, !0, [Z8.create(Z8.Class.UNIVERSAL, Z8.Type.INTEGER, !1, su(A.n)), Z8.create(Z8.Class.UNIVERSAL, Z8.Type.INTEGER, !1, su(A.e))])
    };

    function iH7(A, q, K) {
        var Y = cq.util.createBuffer(),
            z = Math.ceil(q.n.bitLength() / 8);
        if (A.length > z - 11) {
            var _ = Error("Message is too long for PKCS#1 v1.5 padding.");
            throw _.length = A.length, _.max = z - 11, _
        }
        Y.putByte(0), Y.putByte(K);
        var w = z - 3 - A.length,
            O;
        if (K === 0 || K === 1) {
            O = K === 0 ? 0 : 255;
            for (var $ = 0; $ < w; ++$) Y.putByte(O)
        } else
            while (w > 0) {
                var H = 0,
                    j = cq.random.getBytes(w);
                for (var $ = 0; $ < w; ++$)
                    if (O = j.charCodeAt($), O === 0) ++H;
                    else Y.putByte(O);
                w = H
            }
        return Y.putByte(0), Y.putBytes(A), Y
    }

    function IY1(A, q, K, Y) {
        var z = Math.ceil(q.n.bitLength() / 8),
            _ = cq.util.createBuffer(A),
            w = _.getByte(),
            O = _.getByte();
        if (w !== 0 || K && O !== 0 && O !== 1 || !K && O != 2 || K && O === 0 && typeof Y > "u") throw Error("Encryption block is invalid.");
        var $ = 0;
        if (O === 0) {
            $ = z - 3 - Y;
            for (var H = 0; H < $; ++H)
                if (_.getByte() !== 0) throw Error("Encryption block is invalid.")
        } else if (O === 1) {
            $ = 0;
            while (_.length() > 1) {
                if (_.getByte() !== 255) {
                    --_.read;
                    break
                }++$
            }
        } else if (O === 2) {
            $ = 0;
            while (_.length() > 1) {
                if (_.getByte() === 0) {
                    --_.read;
                    break
                }++$
            }
        }
        var j = _.getByte();
        if (j !== 0 || $ !== z - 3 - _.length()) throw Error("Encryption block is invalid.");
        return _.getBytes()
    }

    function PW3(A, q, K) {
        if (typeof q === "function") K = q, q = {};
        q = q || {};
        var Y = {
            algorithm: {
                name: q.algorithm || "PRIMEINC",
                options: {
                    workers: q.workers || 2,
                    workLoad: q.workLoad || 100,
                    workerScript: q.workerScript
                }
            }
        };
        if ("prng" in q) Y.prng = q.prng;
        z();

        function z() {
            _(A.pBits, function(O, $) {
                if (O) return K(O);
                if (A.p = $, A.q !== null) return w(O, A.q);
                _(A.qBits, w)
            })
        }

        function _(O, $) {
            cq.prime.generateProbablePrime(O, Y, $)
        }

        function w(O, $) {
            if (O) return K(O);
            if (A.q = $, A.p.compareTo(A.q) < 0) {
                var H = A.p;
                A.p = A.q, A.q = H
            }
            if (A.p.subtract(wY.ONE).gcd(A.e).compareTo(wY.ONE) !== 0) {
                A.p = null, z();
                return
            }
            if (A.q.subtract(wY.ONE).gcd(A.e).compareTo(wY.ONE) !== 0) {
                A.q = null, _(A.qBits, w);
                return
            }
            if (A.p1 = A.p.subtract(wY.ONE), A.q1 = A.q.subtract(wY.ONE), A.phi = A.p1.multiply(A.q1), A.phi.gcd(A.e).compareTo(wY.ONE) !== 0) {
                A.p = A.q = null, z();
                return
            }
            if (A.n = A.p.multiply(A.q), A.n.bitLength() !== A.bits) {
                A.q = null, _(A.qBits, w);
                return
            }
            var j = A.e.modInverse(A.phi);
            A.keys = {
                privateKey: p5.rsa.setPrivateKey(A.n, A.e, j, A.p, A.q, j.mod(A.p1), j.mod(A.q1), A.q.modInverse(A.p)),
                publicKey: p5.rsa.setPublicKey(A.n, A.e)
            }, K(null, A.keys)
        }
    }

    function su(A) {
        var q = A.toString(16);
        if (q[0] >= "8") q = "00" + q;
        var K = cq.util.hexToBytes(q);
        if (K.length > 1 && (K.charCodeAt(0) === 0 && (K.charCodeAt(1) & 128) === 0 || K.charCodeAt(0) === 255 && (K.charCodeAt(1) & 128) === 128)) return K.substr(1);
        return K
    }

    function WW3(A) {
        if (A <= 100) return 27;
        if (A <= 150) return 18;
        if (A <= 200) return 15;
        if (A <= 250) return 12;
        if (A <= 300) return 9;
        if (A <= 350) return 8;
        if (A <= 400) return 7;
        if (A <= 500) return 6;
        if (A <= 600) return 5;
        if (A <= 800) return 4;
        if (A <= 1250) return 3;
        return 2
    }

    function QH7(A) {
        return cq.util.isNodejs && typeof hY8[A] === "function"
    }

    function UH7(A) {
        return typeof JL.globalScope < "u" && typeof JL.globalScope.crypto === "object" && typeof JL.globalScope.crypto.subtle === "object" && typeof JL.globalScope.crypto.subtle[A] === "function"
    }

    function dH7(A) {
        return typeof JL.globalScope < "u" && typeof JL.globalScope.msCrypto === "object" && typeof JL.globalScope.msCrypto.subtle === "object" && typeof JL.globalScope.msCrypto.subtle[A] === "function"
    }

    function cH7(A) {
        var q = cq.util.hexToBytes(A.toString(16)),
            K = new Uint8Array(q.length);
        for (var Y = 0; Y < q.length; ++Y) K[Y] = q.charCodeAt(Y);
        return K
    }
})
// @from(Ln 117688, Col 4)
CY8 = x((Iv_, sH7) => {
    var G4 = h3();
    Aa();
    GC();
    mI6();
    cu();
    qa();
    LY1();
    $q6();
    HL();
    vY8();
    FI6();
    tY();
    if (typeof SY8 > "u") SY8 = G4.jsbn.BigInteger;
    var SY8, r8 = G4.asn1,
        W3 = G4.pki = G4.pki || {};
    sH7.exports = W3.pbe = G4.pbe = G4.pbe || {};
    var Jq6 = W3.oids,
        ZW3 = {
            name: "EncryptedPrivateKeyInfo",
            tagClass: r8.Class.UNIVERSAL,
            type: r8.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "EncryptedPrivateKeyInfo.encryptionAlgorithm",
                tagClass: r8.Class.UNIVERSAL,
                type: r8.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "AlgorithmIdentifier.algorithm",
                    tagClass: r8.Class.UNIVERSAL,
                    type: r8.Type.OID,
                    constructed: !1,
                    capture: "encryptionOid"
                }, {
                    name: "AlgorithmIdentifier.parameters",
                    tagClass: r8.Class.UNIVERSAL,
                    type: r8.Type.SEQUENCE,
                    constructed: !0,
                    captureAsn1: "encryptionParams"
                }]
            }, {
                name: "EncryptedPrivateKeyInfo.encryptedData",
                tagClass: r8.Class.UNIVERSAL,
                type: r8.Type.OCTETSTRING,
                constructed: !1,
                capture: "encryptedData"
            }]
        },
        GW3 = {
            name: "PBES2Algorithms",
            tagClass: r8.Class.UNIVERSAL,
            type: r8.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "PBES2Algorithms.keyDerivationFunc",
                tagClass: r8.Class.UNIVERSAL,
                type: r8.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "PBES2Algorithms.keyDerivationFunc.oid",
                    tagClass: r8.Class.UNIVERSAL,
                    type: r8.Type.OID,
                    constructed: !1,
                    capture: "kdfOid"
                }, {
                    name: "PBES2Algorithms.params",
                    tagClass: r8.Class.UNIVERSAL,
                    type: r8.Type.SEQUENCE,
                    constructed: !0,
                    value: [{
                        name: "PBES2Algorithms.params.salt",
                        tagClass: r8.Class.UNIVERSAL,
                        type: r8.Type.OCTETSTRING,
                        constructed: !1,
                        capture: "kdfSalt"
                    }, {
                        name: "PBES2Algorithms.params.iterationCount",
                        tagClass: r8.Class.UNIVERSAL,
                        type: r8.Type.INTEGER,
                        constructed: !1,
                        capture: "kdfIterationCount"
                    }, {
                        name: "PBES2Algorithms.params.keyLength",
                        tagClass: r8.Class.UNIVERSAL,
                        type: r8.Type.INTEGER,
                        constructed: !1,
                        optional: !0,
                        capture: "keyLength"
                    }, {
                        name: "PBES2Algorithms.params.prf",
                        tagClass: r8.Class.UNIVERSAL,
                        type: r8.Type.SEQUENCE,
                        constructed: !0,
                        optional: !0,
                        value: [{
                            name: "PBES2Algorithms.params.prf.algorithm",
                            tagClass: r8.Class.UNIVERSAL,
                            type: r8.Type.OID,
                            constructed: !1,
                            capture: "prfOid"
                        }]
                    }]
                }]
            }, {
                name: "PBES2Algorithms.encryptionScheme",
                tagClass: r8.Class.UNIVERSAL,
                type: r8.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "PBES2Algorithms.encryptionScheme.oid",
                    tagClass: r8.Class.UNIVERSAL,
                    type: r8.Type.OID,
                    constructed: !1,
                    capture: "encOid"
                }, {
                    name: "PBES2Algorithms.encryptionScheme.iv",
                    tagClass: r8.Class.UNIVERSAL,
                    type: r8.Type.OCTETSTRING,
                    constructed: !1,
                    capture: "encIv"
                }]
            }]
        },
        fW3 = {
            name: "pkcs-12PbeParams",
            tagClass: r8.Class.UNIVERSAL,
            type: r8.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "pkcs-12PbeParams.salt",
                tagClass: r8.Class.UNIVERSAL,
                type: r8.Type.OCTETSTRING,
                constructed: !1,
                capture: "salt"
            }, {
                name: "pkcs-12PbeParams.iterations",
                tagClass: r8.Class.UNIVERSAL,
                type: r8.Type.INTEGER,
                constructed: !1,
                capture: "iterations"
            }]
        };
    W3.encryptPrivateKeyInfo = function(A, q, K) {
        K = K || {}, K.saltSize = K.saltSize || 8, K.count = K.count || 2048, K.algorithm = K.algorithm || "aes128", K.prfAlgorithm = K.prfAlgorithm || "sha1";
        var Y = G4.random.getBytesSync(K.saltSize),
            z = K.count,
            _ = r8.integerToDer(z),
            w, O, $;
        if (K.algorithm.indexOf("aes") === 0 || K.algorithm === "des") {
            var H, j, J;
            switch (K.algorithm) {
                case "aes128":
                    w = 16, H = 16, j = Jq6["aes128-CBC"], J = G4.aes.createEncryptionCipher;
                    break;
                case "aes192":
                    w = 24, H = 16, j = Jq6["aes192-CBC"], J = G4.aes.createEncryptionCipher;
                    break;
                case "aes256":
                    w = 32, H = 16, j = Jq6["aes256-CBC"], J = G4.aes.createEncryptionCipher;
                    break;
                case "des":
                    w = 8, H = 8, j = Jq6.desCBC, J = G4.des.createEncryptionCipher;
                    break;
                default:
                    var M = Error("Cannot encrypt private key. Unknown encryption algorithm.");
                    throw M.algorithm = K.algorithm, M
            }
            var D = "hmacWith" + K.prfAlgorithm.toUpperCase(),
                X = aH7(D),
                P = G4.pkcs5.pbkdf2(q, Y, z, w, X),
                W = G4.random.getBytesSync(H),
                Z = J(P);
            Z.start(W), Z.update(r8.toDer(A)), Z.finish(), $ = Z.output.getBytes();
            var G = TW3(Y, _, w, D);
            O = r8.create(r8.Class.UNIVERSAL, r8.Type.SEQUENCE, !0, [r8.create(r8.Class.UNIVERSAL, r8.Type.OID, !1, r8.oidToDer(Jq6.pkcs5PBES2).getBytes()), r8.create(r8.Class.UNIVERSAL, r8.Type.SEQUENCE, !0, [r8.create(r8.Class.UNIVERSAL, r8.Type.SEQUENCE, !0, [r8.create(r8.Class.UNIVERSAL, r8.Type.OID, !1, r8.oidToDer(Jq6.pkcs5PBKDF2).getBytes()), G]), r8.create(r8.Class.UNIVERSAL, r8.Type.SEQUENCE, !0, [r8.create(r8.Class.UNIVERSAL, r8.Type.OID, !1, r8.oidToDer(j).getBytes()), r8.create(r8.Class.UNIVERSAL, r8.Type.OCTETSTRING, !1, W)])])])
        } else if (K.algorithm === "3des") {
            w = 24;
            var f = new G4.util.ByteBuffer(Y),
                P = W3.pbe.generatePkcs12Key(q, f, 1, z, w),
                W = W3.pbe.generatePkcs12Key(q, f, 2, z, w),
                Z = G4.des.createEncryptionCipher(P);
            Z.start(W), Z.update(r8.toDer(A)), Z.finish(), $ = Z.output.getBytes(), O = r8.create(r8.Class.UNIVERSAL, r8.Type.SEQUENCE, !0, [r8.create(r8.Class.UNIVERSAL, r8.Type.OID, !1, r8.oidToDer(Jq6["pbeWithSHAAnd3-KeyTripleDES-CBC"]).getBytes()), r8.create(r8.Class.UNIVERSAL, r8.Type.SEQUENCE, !0, [r8.create(r8.Class.UNIVERSAL, r8.Type.OCTETSTRING, !1, Y), r8.create(r8.Class.UNIVERSAL, r8.Type.INTEGER, !1, _.getBytes())])])
        } else {
            var M = Error("Cannot encrypt private key. Unknown encryption algorithm.");
            throw M.algorithm = K.algorithm, M
        }
        var v = r8.create(r8.Class.UNIVERSAL, r8.Type.SEQUENCE, !0, [O, r8.create(r8.Class.UNIVERSAL, r8.Type.OCTETSTRING, !1, $)]);
        return v
    };
    W3.decryptPrivateKeyInfo = function(A, q) {
        var K = null,
            Y = {},
            z = [];
        if (!r8.validate(A, ZW3, Y, z)) {
            var _ = Error("Cannot read encrypted private key. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
            throw _.errors = z, _
        }
        var w = r8.derToOid(Y.encryptionOid),
            O = W3.pbe.getCipher(w, Y.encryptionParams, q),
            $ = G4.util.createBuffer(Y.encryptedData);
        if (O.update($), O.finish()) K = r8.fromDer(O.output);
        return K
    };
    W3.encryptedPrivateKeyToPem = function(A, q) {
        var K = {
            type: "ENCRYPTED PRIVATE KEY",
            body: r8.toDer(A).getBytes()
        };
        return G4.pem.encode(K, {
            maxline: q
        })
    };
    W3.encryptedPrivateKeyFromPem = function(A) {
        var q = G4.pem.decode(A)[0];
        if (q.type !== "ENCRYPTED PRIVATE KEY") {
            var K = Error('Could not convert encrypted private key from PEM; PEM header type is "ENCRYPTED PRIVATE KEY".');
            throw K.headerType = q.type, K
        }
        if (q.procType && q.procType.type === "ENCRYPTED") throw Error("Could not convert encrypted private key from PEM; PEM is encrypted.");
        return r8.fromDer(q.body)
    };
    W3.encryptRsaPrivateKey = function(A, q, K) {
        if (K = K || {}, !K.legacy) {
            var Y = W3.wrapRsaPrivateKey(W3.privateKeyToAsn1(A));
            return Y = W3.encryptPrivateKeyInfo(Y, q, K), W3.encryptedPrivateKeyToPem(Y)
        }
        var z, _, w, O;
        switch (K.algorithm) {
            case "aes128":
                z = "AES-128-CBC", w = 16, _ = G4.random.getBytesSync(16), O = G4.aes.createEncryptionCipher;
                break;
            case "aes192":
                z = "AES-192-CBC", w = 24, _ = G4.random.getBytesSync(16), O = G4.aes.createEncryptionCipher;
                break;
            case "aes256":
                z = "AES-256-CBC", w = 32, _ = G4.random.getBytesSync(16), O = G4.aes.createEncryptionCipher;
                break;
            case "3des":
                z = "DES-EDE3-CBC", w = 24, _ = G4.random.getBytesSync(8), O = G4.des.createEncryptionCipher;
                break;
            case "des":
                z = "DES-CBC", w = 8, _ = G4.random.getBytesSync(8), O = G4.des.createEncryptionCipher;
                break;
            default:
                var $ = Error('Could not encrypt RSA private key; unsupported encryption algorithm "' + K.algorithm + '".');
                throw $.algorithm = K.algorithm, $
        }
        var H = G4.pbe.opensslDeriveBytes(q, _.substr(0, 8), w),
            j = O(H);
        j.start(_), j.update(r8.toDer(W3.privateKeyToAsn1(A))), j.finish();
        var J = {
            type: "RSA PRIVATE KEY",
            procType: {
                version: "4",
                type: "ENCRYPTED"
            },
            dekInfo: {
                algorithm: z,
                parameters: G4.util.bytesToHex(_).toUpperCase()
            },
            body: j.output.getBytes()
        };
        return G4.pem.encode(J)
    };
    W3.decryptRsaPrivateKey = function(A, q) {
        var K = null,
            Y = G4.pem.decode(A)[0];
        if (Y.type !== "ENCRYPTED PRIVATE KEY" && Y.type !== "PRIVATE KEY" && Y.type !== "RSA PRIVATE KEY") {
            var z = Error('Could not convert private key from PEM; PEM header type is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".');
            throw z.headerType = z, z
        }
        if (Y.procType && Y.procType.type === "ENCRYPTED") {
            var _, w;
            switch (Y.dekInfo.algorithm) {
                case "DES-CBC":
                    _ = 8, w = G4.des.createDecryptionCipher;
                    break;
                case "DES-EDE3-CBC":
                    _ = 24, w = G4.des.createDecryptionCipher;
                    break;
                case "AES-128-CBC":
                    _ = 16, w = G4.aes.createDecryptionCipher;
                    break;
                case "AES-192-CBC":
                    _ = 24, w = G4.aes.createDecryptionCipher;
                    break;
                case "AES-256-CBC":
                    _ = 32, w = G4.aes.createDecryptionCipher;
                    break;
                case "RC2-40-CBC":
                    _ = 5, w = function(J) {
                        return G4.rc2.createDecryptionCipher(J, 40)
                    };
                    break;
                case "RC2-64-CBC":
                    _ = 8, w = function(J) {
                        return G4.rc2.createDecryptionCipher(J, 64)
                    };
                    break;
                case "RC2-128-CBC":
                    _ = 16, w = function(J) {
                        return G4.rc2.createDecryptionCipher(J, 128)
                    };
                    break;
                default:
                    var z = Error('Could not decrypt private key; unsupported encryption algorithm "' + Y.dekInfo.algorithm + '".');
                    throw z.algorithm = Y.dekInfo.algorithm, z
            }
            var O = G4.util.hexToBytes(Y.dekInfo.parameters),
                $ = G4.pbe.opensslDeriveBytes(q, O.substr(0, 8), _),
                H = w($);
            if (H.start(O), H.update(G4.util.createBuffer(Y.body)), H.finish()) K = H.output.getBytes();
            else return K
        } else K = Y.body;
        if (Y.type === "ENCRYPTED PRIVATE KEY") K = W3.decryptPrivateKeyInfo(r8.fromDer(K), q);
        else K = r8.fromDer(K);
        if (K !== null) K = W3.privateKeyFromAsn1(K);
        return K
    };
    W3.pbe.generatePkcs12Key = function(A, q, K, Y, z, _) {
        var w, O;
        if (typeof _ > "u" || _ === null) {
            if (!("sha1" in G4.md)) throw Error('"sha1" hash algorithm unavailable.');
            _ = G4.md.sha1.create()
        }
        var {
            digestLength: $,
            blockLength: H
        } = _, j = new G4.util.ByteBuffer, J = new G4.util.ByteBuffer;
        if (A !== null && A !== void 0) {
            for (O = 0; O < A.length; O++) J.putInt16(A.charCodeAt(O));
            J.putInt16(0)
        }
        var M = J.length(),
            D = q.length(),
            X = new G4.util.ByteBuffer;
        X.fillWithByte(K, H);
        var P = H * Math.ceil(D / H),
            W = new G4.util.ByteBuffer;
        for (O = 0; O < P; O++) W.putByte(q.at(O % D));
        var Z = H * Math.ceil(M / H),
            G = new G4.util.ByteBuffer;
        for (O = 0; O < Z; O++) G.putByte(J.at(O % M));
        var f = W;
        f.putBuffer(G);
        var v = Math.ceil(z / $);
        for (var N = 1; N <= v; N++) {
            var V = new G4.util.ByteBuffer;
            V.putBytes(X.bytes()), V.putBytes(f.bytes());
            for (var L = 0; L < Y; L++) _.start(), _.update(V.getBytes()), V = _.digest();
            var h = new G4.util.ByteBuffer;
            for (O = 0; O < H; O++) h.putByte(V.at(O % $));
            var R = Math.ceil(D / H) + Math.ceil(M / H),
                u = new G4.util.ByteBuffer;
            for (w = 0; w < R; w++) {
                var I = new G4.util.ByteBuffer(f.getBytes(H)),
                    g = 511;
                for (O = h.length() - 1; O >= 0; O--) g = g >> 8, g += h.at(O) + I.at(O), I.setAt(O, g & 255);
                u.putBuffer(I)
            }
            f = u, j.putBuffer(V)
        }
        return j.truncate(j.length() - z), j
    };
    W3.pbe.getCipher = function(A, q, K) {
        switch (A) {
            case W3.oids.pkcs5PBES2:
                return W3.pbe.getCipherForPBES2(A, q, K);
            case W3.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
            case W3.oids["pbewithSHAAnd40BitRC2-CBC"]:
                return W3.pbe.getCipherForPKCS12PBE(A, q, K);
            default:
                var Y = Error("Cannot read encrypted PBE data block. Unsupported OID.");
                throw Y.oid = A, Y.supportedOids = ["pkcs5PBES2", "pbeWithSHAAnd3-KeyTripleDES-CBC", "pbewithSHAAnd40BitRC2-CBC"], Y
        }
    };
    W3.pbe.getCipherForPBES2 = function(A, q, K) {
        var Y = {},
            z = [];
        if (!r8.validate(q, GW3, Y, z)) {
            var _ = Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
            throw _.errors = z, _
        }
        if (A = r8.derToOid(Y.kdfOid), A !== W3.oids.pkcs5PBKDF2) {
            var _ = Error("Cannot read encrypted private key. Unsupported key derivation function OID.");
            throw _.oid = A, _.supportedOids = ["pkcs5PBKDF2"], _
        }
        if (A = r8.derToOid(Y.encOid), A !== W3.oids["aes128-CBC"] && A !== W3.oids["aes192-CBC"] && A !== W3.oids["aes256-CBC"] && A !== W3.oids["des-EDE3-CBC"] && A !== W3.oids.desCBC) {
            var _ = Error("Cannot read encrypted private key. Unsupported encryption scheme OID.");
            throw _.oid = A, _.supportedOids = ["aes128-CBC", "aes192-CBC", "aes256-CBC", "des-EDE3-CBC", "desCBC"], _
        }
        var w = Y.kdfSalt,
            O = G4.util.createBuffer(Y.kdfIterationCount);
        O = O.getInt(O.length() << 3);
        var $, H;
        switch (W3.oids[A]) {
            case "aes128-CBC":
                $ = 16, H = G4.aes.createDecryptionCipher;
                break;
            case "aes192-CBC":
                $ = 24, H = G4.aes.createDecryptionCipher;
                break;
            case "aes256-CBC":
                $ = 32, H = G4.aes.createDecryptionCipher;
                break;
            case "des-EDE3-CBC":
                $ = 24, H = G4.des.createDecryptionCipher;
                break;
            case "desCBC":
                $ = 8, H = G4.des.createDecryptionCipher;
                break
        }
        var j = oH7(Y.prfOid),
            J = G4.pkcs5.pbkdf2(K, w, O, $, j),
            M = Y.encIv,
            D = H(J);
        return D.start(M), D
    };
    W3.pbe.getCipherForPKCS12PBE = function(A, q, K) {
        var Y = {},
            z = [];
        if (!r8.validate(q, fW3, Y, z)) {
            var _ = Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
            throw _.errors = z, _
        }
        var w = G4.util.createBuffer(Y.salt),
            O = G4.util.createBuffer(Y.iterations);
        O = O.getInt(O.length() << 3);
        var $, H, j;
        switch (A) {
            case W3.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
                $ = 24, H = 8, j = G4.des.startDecrypting;
                break;
            case W3.oids["pbewithSHAAnd40BitRC2-CBC"]:
                $ = 5, H = 8, j = function(P, W) {
                    var Z = G4.rc2.createDecryptionCipher(P, 40);
                    return Z.start(W, null), Z
                };
                break;
            default:
                var _ = Error("Cannot read PKCS #12 PBE data block. Unsupported OID.");
                throw _.oid = A, _
        }
        var J = oH7(Y.prfOid),
            M = W3.pbe.generatePkcs12Key(K, w, 1, O, $, J);
        J.start();
        var D = W3.pbe.generatePkcs12Key(K, w, 2, O, H, J);
        return j(M, D)
    };
    W3.pbe.opensslDeriveBytes = function(A, q, K, Y) {
        if (typeof Y > "u" || Y === null) {
            if (!("md5" in G4.md)) throw Error('"md5" hash algorithm unavailable.');
            Y = G4.md.md5.create()
        }
        if (q === null) q = "";
        var z = [rH7(Y, A + q)];
        for (var _ = 16, w = 1; _ < K; ++w, _ += 16) z.push(rH7(Y, z[w - 1] + A + q));
        return z.join("").substr(0, K)
    };

    function rH7(A, q) {
        return A.start().update(q).digest().getBytes()
    }

    function oH7(A) {
        var q;
        if (!A) q = "hmacWithSHA1";
        else if (q = W3.oids[r8.derToOid(A)], !q) {
            var K = Error("Unsupported PRF OID.");
            throw K.oid = A, K.supported = ["hmacWithSHA1", "hmacWithSHA224", "hmacWithSHA256", "hmacWithSHA384", "hmacWithSHA512"], K
        }
        return aH7(q)
    }

    function aH7(A) {
        var q = G4.md;
        switch (A) {
            case "hmacWithSHA224":
                q = G4.md.sha512;
            case "hmacWithSHA1":
            case "hmacWithSHA256":
            case "hmacWithSHA384":
            case "hmacWithSHA512":
                A = A.substr(8).toLowerCase();
                break;
            default:
                var K = Error("Unsupported PRF algorithm.");
                throw K.algorithm = A, K.supported = ["hmacWithSHA1", "hmacWithSHA224", "hmacWithSHA256", "hmacWithSHA384", "hmacWithSHA512"], K
        }
        if (!q || !(A in q)) throw Error("Unknown hash algorithm: " + A);
        return q[A].create()
    }

    function TW3(A, q, K, Y) {
        var z = r8.create(r8.Class.UNIVERSAL, r8.Type.SEQUENCE, !0, [r8.create(r8.Class.UNIVERSAL, r8.Type.OCTETSTRING, !1, A), r8.create(r8.Class.UNIVERSAL, r8.Type.INTEGER, !1, q.getBytes())]);
        if (Y !== "hmacWithSHA1") z.value.push(r8.create(r8.Class.UNIVERSAL, r8.Type.INTEGER, !1, G4.util.hexToBytes(K.toString(16))), r8.create(r8.Class.UNIVERSAL, r8.Type.SEQUENCE, !0, [r8.create(r8.Class.UNIVERSAL, r8.Type.OID, !1, r8.oidToDer(W3.oids[Y]).getBytes()), r8.create(r8.Class.UNIVERSAL, r8.Type.NULL, !1, "")]));
        return z
    }
})
// @from(Ln 118188, Col 4)
IY8 = x((bv_, Aj7) => {
    var XM6 = h3();
    GC();
    tY();
    var w4 = XM6.asn1,
        PM6 = Aj7.exports = XM6.pkcs7asn1 = XM6.pkcs7asn1 || {};
    XM6.pkcs7 = XM6.pkcs7 || {};
    XM6.pkcs7.asn1 = PM6;
    var tH7 = {
        name: "ContentInfo",
        tagClass: w4.Class.UNIVERSAL,
        type: w4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "ContentInfo.ContentType",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.OID,
            constructed: !1,
            capture: "contentType"
        }, {
            name: "ContentInfo.content",
            tagClass: w4.Class.CONTEXT_SPECIFIC,
            type: 0,
            constructed: !0,
            optional: !0,
            captureAsn1: "content"
        }]
    };
    PM6.contentInfoValidator = tH7;
    var eH7 = {
        name: "EncryptedContentInfo",
        tagClass: w4.Class.UNIVERSAL,
        type: w4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "EncryptedContentInfo.contentType",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.OID,
            constructed: !1,
            capture: "contentType"
        }, {
            name: "EncryptedContentInfo.contentEncryptionAlgorithm",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "EncryptedContentInfo.contentEncryptionAlgorithm.algorithm",
                tagClass: w4.Class.UNIVERSAL,
                type: w4.Type.OID,
                constructed: !1,
                capture: "encAlgorithm"
            }, {
                name: "EncryptedContentInfo.contentEncryptionAlgorithm.parameter",
                tagClass: w4.Class.UNIVERSAL,
                captureAsn1: "encParameter"
            }]
        }, {
            name: "EncryptedContentInfo.encryptedContent",
            tagClass: w4.Class.CONTEXT_SPECIFIC,
            type: 0,
            capture: "encryptedContent",
            captureAsn1: "encryptedContentAsn1"
        }]
    };
    PM6.envelopedDataValidator = {
        name: "EnvelopedData",
        tagClass: w4.Class.UNIVERSAL,
        type: w4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "EnvelopedData.Version",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.INTEGER,
            constructed: !1,
            capture: "version"
        }, {
            name: "EnvelopedData.RecipientInfos",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.SET,
            constructed: !0,
            captureAsn1: "recipientInfos"
        }].concat(eH7)
    };
    PM6.encryptedDataValidator = {
        name: "EncryptedData",
        tagClass: w4.Class.UNIVERSAL,
        type: w4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "EncryptedData.Version",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.INTEGER,
            constructed: !1,
            capture: "version"
        }].concat(eH7)
    };
    var vW3 = {
        name: "SignerInfo",
        tagClass: w4.Class.UNIVERSAL,
        type: w4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "SignerInfo.version",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.INTEGER,
            constructed: !1
        }, {
            name: "SignerInfo.issuerAndSerialNumber",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "SignerInfo.issuerAndSerialNumber.issuer",
                tagClass: w4.Class.UNIVERSAL,
                type: w4.Type.SEQUENCE,
                constructed: !0,
                captureAsn1: "issuer"
            }, {
                name: "SignerInfo.issuerAndSerialNumber.serialNumber",
                tagClass: w4.Class.UNIVERSAL,
                type: w4.Type.INTEGER,
                constructed: !1,
                capture: "serial"
            }]
        }, {
            name: "SignerInfo.digestAlgorithm",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "SignerInfo.digestAlgorithm.algorithm",
                tagClass: w4.Class.UNIVERSAL,
                type: w4.Type.OID,
                constructed: !1,
                capture: "digestAlgorithm"
            }, {
                name: "SignerInfo.digestAlgorithm.parameter",
                tagClass: w4.Class.UNIVERSAL,
                constructed: !1,
                captureAsn1: "digestParameter",
                optional: !0
            }]
        }, {
            name: "SignerInfo.authenticatedAttributes",
            tagClass: w4.Class.CONTEXT_SPECIFIC,
            type: 0,
            constructed: !0,
            optional: !0,
            capture: "authenticatedAttributes"
        }, {
            name: "SignerInfo.digestEncryptionAlgorithm",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.SEQUENCE,
            constructed: !0,
            capture: "signatureAlgorithm"
        }, {
            name: "SignerInfo.encryptedDigest",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.OCTETSTRING,
            constructed: !1,
            capture: "signature"
        }, {
            name: "SignerInfo.unauthenticatedAttributes",
            tagClass: w4.Class.CONTEXT_SPECIFIC,
            type: 1,
            constructed: !0,
            optional: !0,
            capture: "unauthenticatedAttributes"
        }]
    };
    PM6.signedDataValidator = {
        name: "SignedData",
        tagClass: w4.Class.UNIVERSAL,
        type: w4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "SignedData.Version",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.INTEGER,
            constructed: !1,
            capture: "version"
        }, {
            name: "SignedData.DigestAlgorithms",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.SET,
            constructed: !0,
            captureAsn1: "digestAlgorithms"
        }, tH7, {
            name: "SignedData.Certificates",
            tagClass: w4.Class.CONTEXT_SPECIFIC,
            type: 0,
            optional: !0,
            captureAsn1: "certificates"
        }, {
            name: "SignedData.CertificateRevocationLists",
            tagClass: w4.Class.CONTEXT_SPECIFIC,
            type: 1,
            optional: !0,
            captureAsn1: "crls"
        }, {
            name: "SignedData.SignerInfos",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.SET,
            capture: "signerInfos",
            optional: !0,
            value: [vW3]
        }]
    };
    PM6.recipientInfoValidator = {
        name: "RecipientInfo",
        tagClass: w4.Class.UNIVERSAL,
        type: w4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "RecipientInfo.version",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.INTEGER,
            constructed: !1,
            capture: "version"
        }, {
            name: "RecipientInfo.issuerAndSerial",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "RecipientInfo.issuerAndSerial.issuer",
                tagClass: w4.Class.UNIVERSAL,
                type: w4.Type.SEQUENCE,
                constructed: !0,
                captureAsn1: "issuer"
            }, {
                name: "RecipientInfo.issuerAndSerial.serialNumber",
                tagClass: w4.Class.UNIVERSAL,
                type: w4.Type.INTEGER,
                constructed: !1,
                capture: "serial"
            }]
        }, {
            name: "RecipientInfo.keyEncryptionAlgorithm",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "RecipientInfo.keyEncryptionAlgorithm.algorithm",
                tagClass: w4.Class.UNIVERSAL,
                type: w4.Type.OID,
                constructed: !1,
                capture: "encAlgorithm"
            }, {
                name: "RecipientInfo.keyEncryptionAlgorithm.parameter",
                tagClass: w4.Class.UNIVERSAL,
                constructed: !1,
                captureAsn1: "encParameter",
                optional: !0
            }]
        }, {
            name: "RecipientInfo.encryptedKey",
            tagClass: w4.Class.UNIVERSAL,
            type: w4.Type.OCTETSTRING,
            constructed: !1,
            capture: "encKey"
        }]
    }
})
// @from(Ln 118452, Col 4)
bY8 = x((xv_, qj7) => {
    var Mq6 = h3();
    tY();
    Mq6.mgf = Mq6.mgf || {};
    var NW3 = qj7.exports = Mq6.mgf.mgf1 = Mq6.mgf1 = Mq6.mgf1 || {};
    NW3.create = function(A) {
        var q = {
            generate: function(K, Y) {
                var z = new Mq6.util.ByteBuffer,
                    _ = Math.ceil(Y / A.digestLength);
                for (var w = 0; w < _; w++) {
                    var O = new Mq6.util.ByteBuffer;
                    O.putInt32(w), A.start(), A.update(K + O.getBytes()), z.putBuffer(A.digest())
                }
                return z.truncate(z.length() - Y), z.getBytes()
            }
        };
        return q
    }
})
// @from(Ln 118472, Col 4)
Yj7 = x((uv_, Kj7) => {
    var bY1 = h3();
    bY8();
    Kj7.exports = bY1.mgf = bY1.mgf || {};
    bY1.mgf.mgf1 = bY1.mgf1
})
// @from(Ln 118478, Col 4)
xY1 = x((mv_, zj7) => {
    var Dq6 = h3();
    HL();
    tY();
    var VW3 = zj7.exports = Dq6.pss = Dq6.pss || {};
    VW3.create = function(A) {
        if (arguments.length === 3) A = {
            md: arguments[0],
            mgf: arguments[1],
            saltLength: arguments[2]
        };
        var {
            md: q,
            mgf: K
        } = A, Y = q.digestLength, z = A.salt || null;
        if (typeof z === "string") z = Dq6.util.createBuffer(z);
        var _;
        if ("saltLength" in A) _ = A.saltLength;
        else if (z !== null) _ = z.length();
        else throw Error("Salt length not specified or specific salt not given.");
        if (z !== null && z.length() !== _) throw Error("Given salt length does not match length of given salt.");
        var w = A.prng || Dq6.random,
            O = {};
        return O.encode = function($, H) {
            var j, J = H - 1,
                M = Math.ceil(J / 8),
                D = $.digest().getBytes();
            if (M < Y + _ + 2) throw Error("Message is too long to encrypt.");
            var X;
            if (z === null) X = w.getBytesSync(_);
            else X = z.bytes();
            var P = new Dq6.util.ByteBuffer;
            P.fillWithByte(0, 8), P.putBytes(D), P.putBytes(X), q.start(), q.update(P.getBytes());
            var W = q.digest().getBytes(),
                Z = new Dq6.util.ByteBuffer;
            Z.fillWithByte(0, M - _ - Y - 2), Z.putByte(1), Z.putBytes(X);
            var G = Z.getBytes(),
                f = M - Y - 1,
                v = K.generate(W, f),
                N = "";
            for (j = 0; j < f; j++) N += String.fromCharCode(G.charCodeAt(j) ^ v.charCodeAt(j));
            var V = 65280 >> 8 * M - J & 255;
            return N = String.fromCharCode(N.charCodeAt(0) & ~V) + N.substr(1), N + W + String.fromCharCode(188)
        }, O.verify = function($, H, j) {
            var J, M = j - 1,
                D = Math.ceil(M / 8);
            if (H = H.substr(-D), D < Y + _ + 2) throw Error("Inconsistent parameters to PSS signature verification.");
            if (H.charCodeAt(D - 1) !== 188) throw Error("Encoded message does not end in 0xBC.");
            var X = D - Y - 1,
                P = H.substr(0, X),
                W = H.substr(X, Y),
                Z = 65280 >> 8 * D - M & 255;
            if ((P.charCodeAt(0) & Z) !== 0) throw Error("Bits beyond keysize not zero as expected.");
            var G = K.generate(W, X),
                f = "";
            for (J = 0; J < X; J++) f += String.fromCharCode(P.charCodeAt(J) ^ G.charCodeAt(J));
            f = String.fromCharCode(f.charCodeAt(0) & ~Z) + f.substr(1);
            var v = D - Y - _ - 2;
            for (J = 0; J < v; J++)
                if (f.charCodeAt(J) !== 0) throw Error("Leftmost octets not zero as expected");
            if (f.charCodeAt(v) !== 1) throw Error("Inconsistent PSS signature, 0x01 marker not found");
            var N = f.substr(-_),
                V = new Dq6.util.ByteBuffer;
            V.fillWithByte(0, 8), V.putBytes($), V.putBytes(N), q.start(), q.update(V.getBytes());
            var L = q.digest().getBytes();
            return W === L
        }, O
    }
})