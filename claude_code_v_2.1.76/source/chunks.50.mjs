
// @from(Ln 122568, Col 4)
cj7 = x((lv_, dj7) => {
    var sV = h3();
    tY();
    HL();
    gI6();
    dj7.exports = sV.kem = sV.kem || {};
    var Qj7 = sV.jsbn.BigInteger;
    sV.kem.rsa = {};
    sV.kem.rsa.create = function(A, q) {
        q = q || {};
        var K = q.prng || sV.random,
            Y = {};
        return Y.encrypt = function(z, _) {
            var w = Math.ceil(z.n.bitLength() / 8),
                O;
            do O = new Qj7(sV.util.bytesToHex(K.getBytesSync(w)), 16).mod(z.n); while (O.compareTo(Qj7.ONE) <= 0);
            O = sV.util.hexToBytes(O.toString(16));
            var $ = w - O.length;
            if ($ > 0) O = sV.util.fillString(String.fromCharCode(0), $) + O;
            var H = z.encrypt(O, "NONE"),
                j = A.generate(O, _);
            return {
                encapsulation: H,
                key: j
            }
        }, Y.decrypt = function(z, _, w) {
            var O = z.decrypt(_, "NONE");
            return A.generate(O, w)
        }, Y
    };
    sV.kem.kdf1 = function(A, q) {
        Uj7(this, A, 0, q || A.digestLength)
    };
    sV.kem.kdf2 = function(A, q) {
        Uj7(this, A, 1, q || A.digestLength)
    };

    function Uj7(A, q, K, Y) {
        A.generate = function(z, _) {
            var w = new sV.util.ByteBuffer,
                O = Math.ceil(_ / Y) + K,
                $ = new sV.util.ByteBuffer;
            for (var H = K; H < O; ++H) {
                $.putInt32(H), q.start(), q.update(z + $.getBytes());
                var j = q.digest();
                w.putBytes(j.getBytes(Y))
            }
            return w.truncate(w.length() - _), w.getBytes()
        }
    }
})
// @from(Ln 122619, Col 4)
ij7 = x((iv_, lj7) => {
    var U9 = h3();
    tY();
    lj7.exports = U9.log = U9.log || {};
    U9.log.levels = ["none", "error", "warning", "info", "debug", "verbose", "max"];
    var lY1 = {},
        Yz8 = [],
        lI6 = null;
    U9.log.LEVEL_LOCKED = 2;
    U9.log.NO_LEVEL_CHECK = 4;
    U9.log.INTERPOLATE = 8;
    for (PL = 0; PL < U9.log.levels.length; ++PL) dY1 = U9.log.levels[PL], lY1[dY1] = {
        index: PL,
        name: dY1.toUpperCase()
    };
    var dY1, PL;
    U9.log.logMessage = function(A) {
        var q = lY1[A.level].index;
        for (var K = 0; K < Yz8.length; ++K) {
            var Y = Yz8[K];
            if (Y.flags & U9.log.NO_LEVEL_CHECK) Y.f(A);
            else {
                var z = lY1[Y.level].index;
                if (q <= z) Y.f(Y, A)
            }
        }
    };
    U9.log.prepareStandard = function(A) {
        if (!("standard" in A)) A.standard = lY1[A.level].name + " [" + A.category + "] " + A.message
    };
    U9.log.prepareFull = function(A) {
        if (!("full" in A)) {
            var q = [A.message];
            q = q.concat([]), A.full = U9.util.format.apply(this, q)
        }
    };
    U9.log.prepareStandardFull = function(A) {
        if (!("standardFull" in A)) U9.log.prepareStandard(A), A.standardFull = A.standard
    };
    cY1 = ["error", "warning", "info", "debug", "verbose"];
    for (PL = 0; PL < cY1.length; ++PL)(function(q) {
        U9.log[q] = function(K, Y) {
            var z = Array.prototype.slice.call(arguments).slice(2),
                _ = {
                    timestamp: new Date,
                    level: q,
                    category: K,
                    message: Y,
                    arguments: z
                };
            U9.log.logMessage(_)
        }
    })(cY1[PL]);
    var cY1, PL;
    U9.log.makeLogger = function(A) {
        var q = {
            flags: 0,
            f: A
        };
        return U9.log.setLevel(q, "none"), q
    };
    U9.log.setLevel = function(A, q) {
        var K = !1;
        if (A && !(A.flags & U9.log.LEVEL_LOCKED))
            for (var Y = 0; Y < U9.log.levels.length; ++Y) {
                var z = U9.log.levels[Y];
                if (q == z) {
                    A.level = q, K = !0;
                    break
                }
            }
        return K
    };
    U9.log.lock = function(A, q) {
        if (typeof q > "u" || q) A.flags |= U9.log.LEVEL_LOCKED;
        else A.flags &= ~U9.log.LEVEL_LOCKED
    };
    U9.log.addLogger = function(A) {
        Yz8.push(A)
    };
    if (typeof console < "u" && "log" in console) {
        if (console.error && console.warn && console.info && console.debug) zz8 = {
            error: console.error,
            warning: console.warn,
            info: console.info,
            debug: console.debug,
            verbose: console.debug
        }, vM6 = function(A, q) {
            U9.log.prepareStandard(q);
            var K = zz8[q.level],
                Y = [q.standard];
            Y = Y.concat(q.arguments.slice()), K.apply(console, Y)
        }, Wq6 = U9.log.makeLogger(vM6);
        else vM6 = function(q, K) {
            U9.log.prepareStandardFull(K), console.log(K.standardFull)
        }, Wq6 = U9.log.makeLogger(vM6);
        U9.log.setLevel(Wq6, "debug"), U9.log.addLogger(Wq6), lI6 = Wq6
    } else console = {
        log: function() {}
    };
    var Wq6, zz8, vM6;
    if (lI6 !== null && typeof window < "u" && window.location) {
        if (TM6 = new URL(window.location.href).searchParams, TM6.has("console.level")) U9.log.setLevel(lI6, TM6.get("console.level").slice(-1)[0]);
        if (TM6.has("console.lock")) {
            if (_z8 = TM6.get("console.lock").slice(-1)[0], _z8 == "true") U9.log.lock(lI6)
        }
    }
    var TM6, _z8;
    U9.log.consoleLogger = lI6
})
// @from(Ln 122729, Col 4)
rj7 = x((nv_, nj7) => {
    nj7.exports = cu();
    VY1();
    DM6();
    ZY8();
    nY8()
})
// @from(Ln 122736, Col 4)
sj7 = x((rv_, aj7) => {
    var l7 = h3();
    Aa();
    GC();
    mI6();
    qa();
    $q6();
    IY8();
    HL();
    tY();
    BY1();
    var F1 = l7.asn1,
        mG = aj7.exports = l7.pkcs7 = l7.pkcs7 || {};
    mG.messageFromPem = function(A) {
        var q = l7.pem.decode(A)[0];
        if (q.type !== "PKCS7") {
            var K = Error('Could not convert PKCS#7 message from PEM; PEM header type is not "PKCS#7".');
            throw K.headerType = q.type, K
        }
        if (q.procType && q.procType.type === "ENCRYPTED") throw Error("Could not convert PKCS#7 message from PEM; PEM is encrypted.");
        var Y = F1.fromDer(q.body);
        return mG.messageFromAsn1(Y)
    };
    mG.messageToPem = function(A, q) {
        var K = {
            type: "PKCS7",
            body: F1.toDer(A.toAsn1()).getBytes()
        };
        return l7.pem.encode(K, {
            maxline: q
        })
    };
    mG.messageFromAsn1 = function(A) {
        var q = {},
            K = [];
        if (!F1.validate(A, mG.asn1.contentInfoValidator, q, K)) {
            var Y = Error("Cannot read PKCS#7 message. ASN.1 object is not an PKCS#7 ContentInfo.");
            throw Y.errors = K, Y
        }
        var z = F1.derToOid(q.contentType),
            _;
        switch (z) {
            case l7.pki.oids.envelopedData:
                _ = mG.createEnvelopedData();
                break;
            case l7.pki.oids.encryptedData:
                _ = mG.createEncryptedData();
                break;
            case l7.pki.oids.signedData:
                _ = mG.createSignedData();
                break;
            default:
                throw Error("Cannot read PKCS#7 message. ContentType with OID " + z + " is not (yet) supported.")
        }
        return _.fromAsn1(q.content.value[0]), _
    };
    mG.createSignedData = function() {
        var A = null;
        return A = {
            type: l7.pki.oids.signedData,
            version: 1,
            certificates: [],
            crls: [],
            signers: [],
            digestAlgorithmIdentifiers: [],
            contentInfo: null,
            signerInfos: [],
            fromAsn1: function(Y) {
                if (Oz8(A, Y, mG.asn1.signedDataValidator), A.certificates = [], A.crls = [], A.digestAlgorithmIdentifiers = [], A.contentInfo = null, A.signerInfos = [], A.rawCapture.certificates) {
                    var z = A.rawCapture.certificates.value;
                    for (var _ = 0; _ < z.length; ++_) A.certificates.push(l7.pki.certificateFromAsn1(z[_]))
                }
            },
            toAsn1: function() {
                if (!A.contentInfo) A.sign();
                var Y = [];
                for (var z = 0; z < A.certificates.length; ++z) Y.push(l7.pki.certificateToAsn1(A.certificates[z]));
                var _ = [],
                    w = F1.create(F1.Class.CONTEXT_SPECIFIC, 0, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.INTEGER, !1, F1.integerToDer(A.version).getBytes()), F1.create(F1.Class.UNIVERSAL, F1.Type.SET, !0, A.digestAlgorithmIdentifiers), A.contentInfo])]);
                if (Y.length > 0) w.value[0].value.push(F1.create(F1.Class.CONTEXT_SPECIFIC, 0, !0, Y));
                if (_.length > 0) w.value[0].value.push(F1.create(F1.Class.CONTEXT_SPECIFIC, 1, !0, _));
                return w.value[0].value.push(F1.create(F1.Class.UNIVERSAL, F1.Type.SET, !0, A.signerInfos)), F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.OID, !1, F1.oidToDer(A.type).getBytes()), w])
            },
            addSigner: function(Y) {
                var {
                    issuer: z,
                    serialNumber: _
                } = Y;
                if (Y.certificate) {
                    var w = Y.certificate;
                    if (typeof w === "string") w = l7.pki.certificateFromPem(w);
                    z = w.issuer.attributes, _ = w.serialNumber
                }
                var O = Y.key;
                if (!O) throw Error("Could not add PKCS#7 signer; no private key specified.");
                if (typeof O === "string") O = l7.pki.privateKeyFromPem(O);
                var $ = Y.digestAlgorithm || l7.pki.oids.sha1;
                switch ($) {
                    case l7.pki.oids.sha1:
                    case l7.pki.oids.sha256:
                    case l7.pki.oids.sha384:
                    case l7.pki.oids.sha512:
                    case l7.pki.oids.md5:
                        break;
                    default:
                        throw Error("Could not add PKCS#7 signer; unknown message digest algorithm: " + $)
                }
                var H = Y.authenticatedAttributes || [];
                if (H.length > 0) {
                    var j = !1,
                        J = !1;
                    for (var M = 0; M < H.length; ++M) {
                        var D = H[M];
                        if (!j && D.type === l7.pki.oids.contentType) {
                            if (j = !0, J) break;
                            continue
                        }
                        if (!J && D.type === l7.pki.oids.messageDigest) {
                            if (J = !0, j) break;
                            continue
                        }
                    }
                    if (!j || !J) throw Error("Invalid signer.authenticatedAttributes. If signer.authenticatedAttributes is specified, then it must contain at least two attributes, PKCS #9 content-type and PKCS #9 message-digest.")
                }
                A.signers.push({
                    key: O,
                    version: 1,
                    issuer: z,
                    serialNumber: _,
                    digestAlgorithm: $,
                    signatureAlgorithm: l7.pki.oids.rsaEncryption,
                    signature: null,
                    authenticatedAttributes: H,
                    unauthenticatedAttributes: []
                })
            },
            sign: function(Y) {
                if (Y = Y || {}, typeof A.content !== "object" || A.contentInfo === null) {
                    if (A.contentInfo = F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.OID, !1, F1.oidToDer(l7.pki.oids.data).getBytes())]), "content" in A) {
                        var z;
                        if (A.content instanceof l7.util.ByteBuffer) z = A.content.bytes();
                        else if (typeof A.content === "string") z = l7.util.encodeUtf8(A.content);
                        if (Y.detached) A.detachedContent = F1.create(F1.Class.UNIVERSAL, F1.Type.OCTETSTRING, !1, z);
                        else A.contentInfo.value.push(F1.create(F1.Class.CONTEXT_SPECIFIC, 0, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.OCTETSTRING, !1, z)]))
                    }
                }
                if (A.signers.length === 0) return;
                var _ = q();
                K(_)
            },
            verify: function() {
                throw Error("PKCS#7 signature verification not yet implemented.")
            },
            addCertificate: function(Y) {
                if (typeof Y === "string") Y = l7.pki.certificateFromPem(Y);
                A.certificates.push(Y)
            },
            addCertificateRevokationList: function(Y) {
                throw Error("PKCS#7 CRL support not yet implemented.")
            }
        }, A;

        function q() {
            var Y = {};
            for (var z = 0; z < A.signers.length; ++z) {
                var _ = A.signers[z],
                    w = _.digestAlgorithm;
                if (!(w in Y)) Y[w] = l7.md[l7.pki.oids[w]].create();
                if (_.authenticatedAttributes.length === 0) _.md = Y[w];
                else _.md = l7.md[l7.pki.oids[w]].create()
            }
            A.digestAlgorithmIdentifiers = [];
            for (var w in Y) A.digestAlgorithmIdentifiers.push(F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.OID, !1, F1.oidToDer(w).getBytes()), F1.create(F1.Class.UNIVERSAL, F1.Type.NULL, !1, "")]));
            return Y
        }

        function K(Y) {
            var z;
            if (A.detachedContent) z = A.detachedContent;
            else z = A.contentInfo.value[1], z = z.value[0];
            if (!z) throw Error("Could not sign PKCS#7 message; there is no content to sign.");
            var _ = F1.derToOid(A.contentInfo.value[0].value),
                w = F1.toDer(z);
            w.getByte(), F1.getBerValueLength(w), w = w.getBytes();
            for (var O in Y) Y[O].start().update(w);
            var $ = new Date;
            for (var H = 0; H < A.signers.length; ++H) {
                var j = A.signers[H];
                if (j.authenticatedAttributes.length === 0) {
                    if (_ !== l7.pki.oids.data) throw Error("Invalid signer; authenticatedAttributes must be present when the ContentInfo content type is not PKCS#7 Data.")
                } else {
                    j.authenticatedAttributesAsn1 = F1.create(F1.Class.CONTEXT_SPECIFIC, 0, !0, []);
                    var J = F1.create(F1.Class.UNIVERSAL, F1.Type.SET, !0, []);
                    for (var M = 0; M < j.authenticatedAttributes.length; ++M) {
                        var D = j.authenticatedAttributes[M];
                        if (D.type === l7.pki.oids.messageDigest) D.value = Y[j.digestAlgorithm].digest();
                        else if (D.type === l7.pki.oids.signingTime) {
                            if (!D.value) D.value = $
                        }
                        J.value.push(wz8(D)), j.authenticatedAttributesAsn1.value.push(wz8(D))
                    }
                    w = F1.toDer(J).getBytes(), j.md.start().update(w)
                }
                j.signature = j.key.sign(j.md, "RSASSA-PKCS1-V1_5")
            }
            A.signerInfos = bZ3(A.signers)
        }
    };
    mG.createEncryptedData = function() {
        var A = null;
        return A = {
            type: l7.pki.oids.encryptedData,
            version: 0,
            encryptedContent: {
                algorithm: l7.pki.oids["aes256-CBC"]
            },
            fromAsn1: function(q) {
                Oz8(A, q, mG.asn1.encryptedDataValidator)
            },
            decrypt: function(q) {
                if (q !== void 0) A.encryptedContent.key = q;
                oj7(A)
            }
        }, A
    };
    mG.createEnvelopedData = function() {
        var A = null;
        return A = {
            type: l7.pki.oids.envelopedData,
            version: 0,
            recipients: [],
            encryptedContent: {
                algorithm: l7.pki.oids["aes256-CBC"]
            },
            fromAsn1: function(q) {
                var K = Oz8(A, q, mG.asn1.envelopedDataValidator);
                A.recipients = SZ3(K.recipientInfos.value)
            },
            toAsn1: function() {
                return F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.OID, !1, F1.oidToDer(A.type).getBytes()), F1.create(F1.Class.CONTEXT_SPECIFIC, 0, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.INTEGER, !1, F1.integerToDer(A.version).getBytes()), F1.create(F1.Class.UNIVERSAL, F1.Type.SET, !0, CZ3(A.recipients)), F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, xZ3(A.encryptedContent))])])])
            },
            findRecipient: function(q) {
                var K = q.issuer.attributes;
                for (var Y = 0; Y < A.recipients.length; ++Y) {
                    var z = A.recipients[Y],
                        _ = z.issuer;
                    if (z.serialNumber !== q.serialNumber) continue;
                    if (_.length !== K.length) continue;
                    var w = !0;
                    for (var O = 0; O < K.length; ++O)
                        if (_[O].type !== K[O].type || _[O].value !== K[O].value) {
                            w = !1;
                            break
                        } if (w) return z
                }
                return null
            },
            decrypt: function(q, K) {
                if (A.encryptedContent.key === void 0 && q !== void 0 && K !== void 0) switch (q.encryptedContent.algorithm) {
                    case l7.pki.oids.rsaEncryption:
                    case l7.pki.oids.desCBC:
                        var Y = K.decrypt(q.encryptedContent.content);
                        A.encryptedContent.key = l7.util.createBuffer(Y);
                        break;
                    default:
                        throw Error("Unsupported asymmetric cipher, OID " + q.encryptedContent.algorithm)
                }
                oj7(A)
            },
            addRecipient: function(q) {
                A.recipients.push({
                    version: 0,
                    issuer: q.issuer.attributes,
                    serialNumber: q.serialNumber,
                    encryptedContent: {
                        algorithm: l7.pki.oids.rsaEncryption,
                        key: q.publicKey
                    }
                })
            },
            encrypt: function(q, K) {
                if (A.encryptedContent.content === void 0) {
                    K = K || A.encryptedContent.algorithm, q = q || A.encryptedContent.key;
                    var Y, z, _;
                    switch (K) {
                        case l7.pki.oids["aes128-CBC"]:
                            Y = 16, z = 16, _ = l7.aes.createEncryptionCipher;
                            break;
                        case l7.pki.oids["aes192-CBC"]:
                            Y = 24, z = 16, _ = l7.aes.createEncryptionCipher;
                            break;
                        case l7.pki.oids["aes256-CBC"]:
                            Y = 32, z = 16, _ = l7.aes.createEncryptionCipher;
                            break;
                        case l7.pki.oids["des-EDE3-CBC"]:
                            Y = 24, z = 8, _ = l7.des.createEncryptionCipher;
                            break;
                        default:
                            throw Error("Unsupported symmetric cipher, OID " + K)
                    }
                    if (q === void 0) q = l7.util.createBuffer(l7.random.getBytes(Y));
                    else if (q.length() != Y) throw Error("Symmetric key has wrong length; got " + q.length() + " bytes, expected " + Y + ".");
                    A.encryptedContent.algorithm = K, A.encryptedContent.key = q, A.encryptedContent.parameter = l7.util.createBuffer(l7.random.getBytes(z));
                    var w = _(q);
                    if (w.start(A.encryptedContent.parameter.copy()), w.update(A.content), !w.finish()) throw Error("Symmetric encryption failed.");
                    A.encryptedContent.content = w.output
                }
                for (var O = 0; O < A.recipients.length; ++O) {
                    var $ = A.recipients[O];
                    if ($.encryptedContent.content !== void 0) continue;
                    switch ($.encryptedContent.algorithm) {
                        case l7.pki.oids.rsaEncryption:
                            $.encryptedContent.content = $.encryptedContent.key.encrypt(A.encryptedContent.key.data);
                            break;
                        default:
                            throw Error("Unsupported asymmetric cipher, OID " + $.encryptedContent.algorithm)
                    }
                }
            }
        }, A
    };

    function RZ3(A) {
        var q = {},
            K = [];
        if (!F1.validate(A, mG.asn1.recipientInfoValidator, q, K)) {
            var Y = Error("Cannot read PKCS#7 RecipientInfo. ASN.1 object is not an PKCS#7 RecipientInfo.");
            throw Y.errors = K, Y
        }
        return {
            version: q.version.charCodeAt(0),
            issuer: l7.pki.RDNAttributesAsArray(q.issuer),
            serialNumber: l7.util.createBuffer(q.serial).toHex(),
            encryptedContent: {
                algorithm: F1.derToOid(q.encAlgorithm),
                parameter: q.encParameter ? q.encParameter.value : void 0,
                content: q.encKey
            }
        }
    }

    function hZ3(A) {
        return F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.INTEGER, !1, F1.integerToDer(A.version).getBytes()), F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, [l7.pki.distinguishedNameToAsn1({
            attributes: A.issuer
        }), F1.create(F1.Class.UNIVERSAL, F1.Type.INTEGER, !1, l7.util.hexToBytes(A.serialNumber))]), F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.OID, !1, F1.oidToDer(A.encryptedContent.algorithm).getBytes()), F1.create(F1.Class.UNIVERSAL, F1.Type.NULL, !1, "")]), F1.create(F1.Class.UNIVERSAL, F1.Type.OCTETSTRING, !1, A.encryptedContent.content)])
    }

    function SZ3(A) {
        var q = [];
        for (var K = 0; K < A.length; ++K) q.push(RZ3(A[K]));
        return q
    }

    function CZ3(A) {
        var q = [];
        for (var K = 0; K < A.length; ++K) q.push(hZ3(A[K]));
        return q
    }

    function IZ3(A) {
        var q = F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.INTEGER, !1, F1.integerToDer(A.version).getBytes()), F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, [l7.pki.distinguishedNameToAsn1({
            attributes: A.issuer
        }), F1.create(F1.Class.UNIVERSAL, F1.Type.INTEGER, !1, l7.util.hexToBytes(A.serialNumber))]), F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.OID, !1, F1.oidToDer(A.digestAlgorithm).getBytes()), F1.create(F1.Class.UNIVERSAL, F1.Type.NULL, !1, "")])]);
        if (A.authenticatedAttributesAsn1) q.value.push(A.authenticatedAttributesAsn1);
        if (q.value.push(F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.OID, !1, F1.oidToDer(A.signatureAlgorithm).getBytes()), F1.create(F1.Class.UNIVERSAL, F1.Type.NULL, !1, "")])), q.value.push(F1.create(F1.Class.UNIVERSAL, F1.Type.OCTETSTRING, !1, A.signature)), A.unauthenticatedAttributes.length > 0) {
            var K = F1.create(F1.Class.CONTEXT_SPECIFIC, 1, !0, []);
            for (var Y = 0; Y < A.unauthenticatedAttributes.length; ++Y) {
                var z = A.unauthenticatedAttributes[Y];
                K.values.push(wz8(z))
            }
            q.value.push(K)
        }
        return q
    }

    function bZ3(A) {
        var q = [];
        for (var K = 0; K < A.length; ++K) q.push(IZ3(A[K]));
        return q
    }

    function wz8(A) {
        var q;
        if (A.type === l7.pki.oids.contentType) q = F1.create(F1.Class.UNIVERSAL, F1.Type.OID, !1, F1.oidToDer(A.value).getBytes());
        else if (A.type === l7.pki.oids.messageDigest) q = F1.create(F1.Class.UNIVERSAL, F1.Type.OCTETSTRING, !1, A.value.bytes());
        else if (A.type === l7.pki.oids.signingTime) {
            var K = new Date("1950-01-01T00:00:00Z"),
                Y = new Date("2050-01-01T00:00:00Z"),
                z = A.value;
            if (typeof z === "string") {
                var _ = Date.parse(z);
                if (!isNaN(_)) z = new Date(_);
                else if (z.length === 13) z = F1.utcTimeToDate(z);
                else z = F1.generalizedTimeToDate(z)
            }
            if (z >= K && z < Y) q = F1.create(F1.Class.UNIVERSAL, F1.Type.UTCTIME, !1, F1.dateToUtcTime(z));
            else q = F1.create(F1.Class.UNIVERSAL, F1.Type.GENERALIZEDTIME, !1, F1.dateToGeneralizedTime(z))
        }
        return F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.OID, !1, F1.oidToDer(A.type).getBytes()), F1.create(F1.Class.UNIVERSAL, F1.Type.SET, !0, [q])])
    }

    function xZ3(A) {
        return [F1.create(F1.Class.UNIVERSAL, F1.Type.OID, !1, F1.oidToDer(l7.pki.oids.data).getBytes()), F1.create(F1.Class.UNIVERSAL, F1.Type.SEQUENCE, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.OID, !1, F1.oidToDer(A.algorithm).getBytes()), !A.parameter ? void 0 : F1.create(F1.Class.UNIVERSAL, F1.Type.OCTETSTRING, !1, A.parameter.getBytes())]), F1.create(F1.Class.CONTEXT_SPECIFIC, 0, !0, [F1.create(F1.Class.UNIVERSAL, F1.Type.OCTETSTRING, !1, A.content.getBytes())])]
    }

    function Oz8(A, q, K) {
        var Y = {},
            z = [];
        if (!F1.validate(q, K, Y, z)) {
            var _ = Error("Cannot read PKCS#7 message. ASN.1 object is not a supported PKCS#7 message.");
            throw _.errors = _, _
        }
        var w = F1.derToOid(Y.contentType);
        if (w !== l7.pki.oids.data) throw Error("Unsupported PKCS#7 message. Only wrapped ContentType Data supported.");
        if (Y.encryptedContent) {
            var O = "";
            if (l7.util.isArray(Y.encryptedContent))
                for (var $ = 0; $ < Y.encryptedContent.length; ++$) {
                    if (Y.encryptedContent[$].type !== F1.Type.OCTETSTRING) throw Error("Malformed PKCS#7 message, expecting encrypted content constructed of only OCTET STRING objects.");
                    O += Y.encryptedContent[$].value
                } else O = Y.encryptedContent;
            A.encryptedContent = {
                algorithm: F1.derToOid(Y.encAlgorithm),
                parameter: l7.util.createBuffer(Y.encParameter.value),
                content: l7.util.createBuffer(O)
            }
        }
        if (Y.content) {
            var O = "";
            if (l7.util.isArray(Y.content))
                for (var $ = 0; $ < Y.content.length; ++$) {
                    if (Y.content[$].type !== F1.Type.OCTETSTRING) throw Error("Malformed PKCS#7 message, expecting content constructed of only OCTET STRING objects.");
                    O += Y.content[$].value
                } else O = Y.content;
            A.content = l7.util.createBuffer(O)
        }
        return A.version = Y.version.charCodeAt(0), A.rawCapture = Y, Y
    }

    function oj7(A) {
        if (A.encryptedContent.key === void 0) throw Error("Symmetric key not available.");
        if (A.content === void 0) {
            var q;
            switch (A.encryptedContent.algorithm) {
                case l7.pki.oids["aes128-CBC"]:
                case l7.pki.oids["aes192-CBC"]:
                case l7.pki.oids["aes256-CBC"]:
                    q = l7.aes.createDecryptionCipher(A.encryptedContent.key);
                    break;
                case l7.pki.oids.desCBC:
                case l7.pki.oids["des-EDE3-CBC"]:
                    q = l7.des.createDecryptionCipher(A.encryptedContent.key);
                    break;
                default:
                    throw Error("Unsupported symmetric cipher, OID " + A.encryptedContent.algorithm)
            }
            if (q.start(A.encryptedContent.parameter), q.update(A.encryptedContent.content), !q.finish()) throw Error("Symmetric decryption failed.");
            A.content = q.output
        }
    }
})
// @from(Ln 123197, Col 4)
ej7 = x((ov_, tj7) => {
    var hJ = h3();
    Aa();
    HM6();
    VY1();
    DM6();
    tY();
    var nY1 = tj7.exports = hJ.ssh = hJ.ssh || {};
    nY1.privateKeyToPutty = function(A, q, K) {
        K = K || "", q = q || "";
        var Y = "ssh-rsa",
            z = q === "" ? "none" : "aes256-cbc",
            _ = "PuTTY-User-Key-File-2: " + Y + `\r
`;
        _ += "Encryption: " + z + `\r
`, _ += "Comment: " + K + `\r
`;
        var w = hJ.util.createBuffer();
        NM6(w, Y), tu(w, A.e), tu(w, A.n);
        var O = hJ.util.encode64(w.bytes(), 64),
            $ = Math.floor(O.length / 66) + 1;
        _ += "Public-Lines: " + $ + `\r
`, _ += O;
        var H = hJ.util.createBuffer();
        tu(H, A.d), tu(H, A.p), tu(H, A.q), tu(H, A.qInv);
        var j;
        if (!q) j = hJ.util.encode64(H.bytes(), 64);
        else {
            var J = H.length() + 16 - 1;
            J -= J % 16;
            var M = iY1(H.bytes());
            M.truncate(M.length() - J + H.length()), H.putBuffer(M);
            var D = hJ.util.createBuffer();
            D.putBuffer(iY1("\x00\x00\x00\x00", q)), D.putBuffer(iY1("\x00\x00\x00\x01", q));
            var X = hJ.aes.createEncryptionCipher(D.truncate(8), "CBC");
            X.start(hJ.util.createBuffer().fillWithByte(0, 16)), X.update(H.copy()), X.finish();
            var P = X.output;
            P.truncate(16), j = hJ.util.encode64(P.bytes(), 64)
        }
        $ = Math.floor(j.length / 66) + 1, _ += `\r
Private-Lines: ` + $ + `\r
`, _ += j;
        var W = iY1("putty-private-key-file-mac-key", q),
            Z = hJ.util.createBuffer();
        NM6(Z, Y), NM6(Z, z), NM6(Z, K), Z.putInt32(w.length()), Z.putBuffer(w), Z.putInt32(H.length()), Z.putBuffer(H);
        var G = hJ.hmac.create();
        return G.start("sha1", W), G.update(Z.bytes()), _ += `\r
Private-MAC: ` + G.digest().toHex() + `\r
`, _
    };
    nY1.publicKeyToOpenSSH = function(A, q) {
        var K = "ssh-rsa";
        q = q || "";
        var Y = hJ.util.createBuffer();
        return NM6(Y, K), tu(Y, A.e), tu(Y, A.n), K + " " + hJ.util.encode64(Y.bytes()) + " " + q
    };
    nY1.privateKeyToOpenSSH = function(A, q) {
        if (!q) return hJ.pki.privateKeyToPem(A);
        return hJ.pki.encryptRsaPrivateKey(A, q, {
            legacy: !0,
            algorithm: "aes128"
        })
    };
    nY1.getPublicKeyFingerprint = function(A, q) {
        q = q || {};
        var K = q.md || hJ.md.md5.create(),
            Y = "ssh-rsa",
            z = hJ.util.createBuffer();
        NM6(z, Y), tu(z, A.e), tu(z, A.n), K.start(), K.update(z.getBytes());
        var _ = K.digest();
        if (q.encoding === "hex") {
            var w = _.toHex();
            if (q.delimiter) return w.match(/.{2}/g).join(q.delimiter);
            return w
        } else if (q.encoding === "binary") return _.getBytes();
        else if (q.encoding) throw Error('Unknown encoding "' + q.encoding + '".');
        return _
    };

    function tu(A, q) {
        var K = q.toString(16);
        if (K[0] >= "8") K = "00" + K;
        var Y = hJ.util.hexToBytes(K);
        A.putInt32(Y.length), A.putBytes(Y)
    }

    function NM6(A, q) {
        A.putInt32(q.length), A.putString(q)
    }

    function iY1() {
        var A = hJ.md.sha1.create(),
            q = arguments.length;
        for (var K = 0; K < q; ++K) A.update(arguments[K]);
        return A.digest()
    }
})
// @from(Ln 123294, Col 4)
qJ7 = x((av_, AJ7) => {
    AJ7.exports = h3();
    Aa();
    Vj7();
    GC();
    WY1();
    mI6();
    pj7();
    HM6();
    cj7();
    ij7();
    rj7();
    bY8();
    LY1();
    $q6();
    yY8();
    mY8();
    sj7();
    gY8();
    RY8();
    GY8();
    xY1();
    HL();
    vY8();
    ej7();
    cY8();
    tY()
})
// @from(Ln 123344, Col 0)
function QZ3(A, q, K, Y) {
    let z = VM6(A),
        _ = VM6(q, "utf-8"),
        w = VM6(K, "utf-8"),
        O = Y?.map((P) => VM6(P, "utf-8")),
        $ = g$.default.pkcs7.createSignedData();
    $.content = g$.default.util.createBuffer(z);
    let H = g$.default.pki.certificateFromPem(_),
        j = g$.default.pki.privateKeyFromPem(w);
    if ($.addCertificate(H), O)
        for (let P of O) $.addCertificate(g$.default.pki.certificateFromPem(P));
    $.addSigner({
        key: j,
        certificate: H,
        digestAlgorithm: g$.default.pki.oids.sha256,
        authenticatedAttributes: [{
            type: g$.default.pki.oids.contentType,
            value: g$.default.pki.oids.data
        }, {
            type: g$.default.pki.oids.messageDigest
        }, {
            type: g$.default.pki.oids.signingTime
        }]
    }), $.sign({
        detached: !0
    });
    let J = g$.default.asn1.toDer($.toAsn1()),
        M = Buffer.from(J.getBytes(), "binary"),
        D = dZ3(M),
        X = Buffer.concat([z, D]);
    YJ7(A, X)
}
// @from(Ln 123376, Col 0)
async function UZ3(A) {
    try {
        let q = VM6(A),
            {
                originalContent: K,
                pkcs7Signature: Y
            } = iI6(q);
        if (!Y) return {
            status: "unsigned"
        };
        let z = g$.default.asn1.fromDer(Y.toString("binary")),
            _ = g$.default.pkcs7.messageFromAsn1(z);
        if (!("type" in _) || _.type !== g$.default.pki.oids.signedData) return {
            status: "unsigned"
        };
        let w = _,
            O = w.certificates || [];
        if (O.length === 0) return {
            status: "unsigned"
        };
        let $ = O[0],
            H = g$.default.util.createBuffer(K);
        try {
            w.verify({
                authenticatedAttributes: !0
            });
            let P = w.signerInfos?.[0];
            if (P) {
                let W = g$.default.md.sha256.create();
                W.update(H.getBytes());
                let Z = W.digest().getBytes(),
                    G = null;
                for (let f of P.authenticatedAttributes)
                    if (f.type === g$.default.pki.oids.messageDigest) {
                        G = f.value;
                        break
                    } if (!G || G !== Z) return {
                    status: "unsigned"
                }
            }
        } catch (X) {
            return {
                status: "unsigned"
            }
        }
        let j = g$.default.pki.certificateToPem($),
            J = O.slice(1).map((X) => Buffer.from(g$.default.pki.certificateToPem(X)));
        if (!await wJ7(Buffer.from(j), J)) return {
            status: "unsigned"
        };
        return {
            status: $.issuer.getField("CN")?.value === $.subject.getField("CN")?.value ? "self-signed" : "signed",
            publisher: $.subject.getField("CN")?.value || "Unknown",
            issuer: $.issuer.getField("CN")?.value || "Unknown",
            valid_from: $.validity.notBefore.toISOString(),
            valid_to: $.validity.notAfter.toISOString(),
            fingerprint: g$.default.md.sha256.create().update(g$.default.asn1.toDer(g$.default.pki.certificateToAsn1($)).getBytes()).digest().toHex()
        }
    } catch (q) {
        throw Error(`Failed to verify MCPB file: ${q}`)
    }
}
// @from(Ln 123439, Col 0)
function dZ3(A) {
    let q = [];
    q.push(Buffer.from(zJ7, "utf-8"));
    let K = Buffer.alloc(4);
    return K.writeUInt32LE(A.length, 0), q.push(K), q.push(A), q.push(Buffer.from(_J7, "utf-8")), Buffer.concat(q)
}
// @from(Ln 123446, Col 0)
function iI6(A) {
    let q = Buffer.from(_J7, "utf-8"),
        K = A.lastIndexOf(q);
    if (K === -1) return {
        originalContent: A
    };
    let Y = Buffer.from(zJ7, "utf-8"),
        z = -1;
    for (let O = K - 1; O >= 0; O--)
        if (A.slice(O, O + Y.length).equals(Y)) {
            z = O;
            break
        } if (z === -1) return {
        originalContent: A
    };
    let _ = A.slice(0, z),
        w = z + Y.length;
    try {
        let O = A.readUInt32LE(w);
        w += 4;
        let $ = A.slice(w, w + O);
        return {
            originalContent: _,
            pkcs7Signature: $
        }
    } catch {
        return {
            originalContent: A
        }
    }
}
// @from(Ln 123477, Col 0)
async function wJ7(A, q) {
    let K = null;
    try {
        K = await mZ3(KJ7(FZ3(), "mcpb-verify-"));
        let Y = KJ7(K, "chain.pem"),
            z = [A, ...q || []].join(`
`);
        if (await gZ3(Y, z), process.platform === "darwin") try {
            return await $z8("security", ["verify-cert", "-c", Y, "-p", "codeSign"]), !0
        } catch (_) {
            return !1
        } else if (process.platform === "win32") {
            let _ = `
        $ErrorActionPreference = 'Stop'
        $certCollection = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2Collection
        $certCollection.Import('${Y}')
        
        if ($certCollection.Count -eq 0) {
          Write-Error 'No certificates found'
          exit 1
        }
        
        $leafCert = $certCollection[0]
        $chain = New-Object System.Security.Cryptography.X509Certificates.X509Chain
        
        # Enable revocation checking
        $chain.ChainPolicy.RevocationMode = 'Online'
        $chain.ChainPolicy.RevocationFlag = 'EntireChain'
        $chain.ChainPolicy.UrlRetrievalTimeout = New-TimeSpan -Seconds 30
        
        # Add code signing application policy
        $codeSignOid = New-Object System.Security.Cryptography.Oid '1.3.6.1.5.5.7.3.3'
        $chain.ChainPolicy.ApplicationPolicy.Add($codeSignOid)
        
        # Add intermediate certificates to extra store
        for ($i = 1; $i -lt $certCollection.Count; $i++) {
          [void]$chain.ChainPolicy.ExtraStore.Add($certCollection[$i])
        }
        
        # Build and validate chain
        $result = $chain.Build($leafCert)
        
        if ($result) { 
          'Valid' 
        } else { 
          $chain.ChainStatus | ForEach-Object { 
            Write-Error "$($_.Status): $($_.StatusInformation)"
          }
          exit 1 
        }
      `.trim(),
                {
                    stdout: w
                } = await $z8("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", _]);
            return w.includes("Valid")
        } else try {
            return await $z8("openssl", ["verify", "-purpose", "codesigning", "-CApath", "/etc/ssl/certs", Y]), !0
        } catch (_) {
            return !1
        }
    } catch (Y) {
        return !1
    } finally {
        if (K) try {
            await BZ3(K, {
                recursive: !0,
                force: !0
            })
        } catch {}
    }
}
// @from(Ln 123549, Col 0)
function cZ3(A) {
    let q = VM6(A),
        {
            originalContent: K
        } = iI6(q);
    YJ7(A, K)
}
// @from(Ln 123556, Col 4)
g$
// @from(Ln 123556, Col 8)
zJ7 = "MCPB_SIG_V1"
// @from(Ln 123557, Col 4)
_J7 = "MCPB_SIG_END"
// @from(Ln 123558, Col 4)
$z8
// @from(Ln 123559, Col 4)
Hz8 = E(() => {
    g$ = t(qJ7(), 1), $z8 = pZ3(uZ3)
})
// @from(Ln 123563, Col 0)
function rY1({
    silent: A = !1
} = {}) {
    return {
        log: (...q) => {
            if (!A) console.log(...q)
        },
        error: (...q) => {
            if (!A) console.error(...q)
        },
        warn: (...q) => {
            if (!A) console.warn(...q)
        },
        info: (...q) => {
            if (!A) console.info(...q)
        },
        debug: (...q) => {
            if (!A) console.debug(...q)
        }
    }
}
// @from(Ln 123596, Col 0)
async function Jz8({
    mcpbPath: A,
    outputDir: q,
    silent: K
}) {
    let Y = rY1({
            silent: K
        }),
        z = oY1(A);
    if (!jz8(z)) return Y.error(`ERROR: MCPB file not found: ${A}`), !1;
    let _ = q ? oY1(q) : process.cwd();
    if (!jz8(_)) OJ7(_, {
        recursive: !0
    });
    try {
        let w = iZ3(z),
            {
                originalContent: O
            } = iI6(w),
            $ = new Map,
            H = process.platform !== "win32";
        if (H) {
            let J = O,
                M = -1;
            for (let D = J.length - 22; D >= 0; D--)
                if (J.readUInt32LE(D) === 101010256) {
                    M = D;
                    break
                } if (M !== -1) {
                let D = J.readUInt32LE(M + 16),
                    X = J.readUInt16LE(M + 8),
                    P = D;
                for (let W = 0; W < X; W++)
                    if (J.readUInt32LE(P) === 33639248) {
                        let Z = J.readUInt32LE(P + 38),
                            G = J.readUInt16LE(P + 28),
                            f = J.toString("utf8", P + 46, P + 46 + G),
                            v = Z >> 16 & 511;
                        if (v > 0) $.set(f, v);
                        let N = J.readUInt16LE(P + 30),
                            V = J.readUInt16LE(P + 32);
                        P += 46 + G + N + V
                    } else break
            }
        }
        let j = G98(O);
        for (let J in j)
            if (Object.prototype.hasOwnProperty.call(j, J)) {
                let M = j[J],
                    D = $J7(_, J),
                    X = oY1(D),
                    P = oY1(_);
                if (!X.startsWith(P + rZ3) && X !== P) throw Error(`Path traversal attempt detected: ${J}`);
                let W = $J7(D, "..");
                if (!jz8(W)) OJ7(W, {
                    recursive: !0
                });
                if (nZ3(D, M), H && $.has(J)) try {
                    let Z = $.get(J);
                    if (Z !== void 0) lZ3(D, Z)
                } catch (Z) {}
            } return Y.log(`Extension unpacked successfully to ${_}`), !0
    } catch (w) {
        if (w instanceof Error) Y.error(`ERROR: Failed to unpack extension: ${w.message}`);
        else Y.error("ERROR: An unknown error occurred during unpacking.");
        return !1
    }
}
// @from(Ln 123664, Col 4)
Mz8 = E(() => {
    MI6();
    Hz8()
})
// @from(Ln 123668, Col 4)
HJ7
// @from(Ln 123668, Col 9)
oZ3
// @from(Ln 123668, Col 14)
aZ3
// @from(Ln 123668, Col 19)
sZ3
// @from(Ln 123668, Col 24)
tZ3
// @from(Ln 123668, Col 29)
eZ3
// @from(Ln 123668, Col 34)
AG3
// @from(Ln 123668, Col 39)
qG3
// @from(Ln 123668, Col 44)
KG3
// @from(Ln 123668, Col 49)
YG3
// @from(Ln 123668, Col 54)
JN_
// @from(Ln 123668, Col 59)
jJ7
// @from(Ln 123668, Col 64)
MN_
// @from(Ln 123669, Col 4)
JJ7 = E(() => {
    t46();
    HJ7 = PV({
        command: CA(),
        args: VH(CA()).optional(),
        env: NS(CA(), CA()).optional()
    }), oZ3 = PV({
        name: CA(),
        email: CA().email().optional(),
        url: CA().url().optional()
    }), aZ3 = PV({
        type: CA(),
        url: CA().url()
    }), sZ3 = HJ7.partial(), tZ3 = HJ7.extend({
        platform_overrides: NS(CA(), sZ3).optional()
    }), eZ3 = PV({
        type: VS(["python", "node", "binary"]),
        entry_point: CA(),
        mcp_config: tZ3
    }), AG3 = PV({
        claude_desktop: CA().optional(),
        platforms: VH(VS(["darwin", "win32", "linux"])).optional(),
        runtimes: PV({
            python: CA().optional(),
            node: CA().optional()
        }).optional()
    }).passthrough(), qG3 = PV({
        name: CA(),
        description: CA().optional()
    }), KG3 = PV({
        name: CA(),
        description: CA().optional(),
        arguments: VH(CA()).optional(),
        text: CA()
    }), YG3 = PV({
        type: VS(["string", "number", "boolean", "directory", "file"]),
        title: CA(),
        description: CA(),
        required: CD().optional(),
        default: hA6([CA(), Yy(), CD(), VH(CA())]).optional(),
        multiple: CD().optional(),
        sensitive: CD().optional(),
        min: Yy().optional(),
        max: Yy().optional()
    }), JN_ = NS(CA(), hA6([CA(), Yy(), CD(), VH(CA())])), jJ7 = PV({
        $schema: CA().optional(),
        dxt_version: CA().optional().describe("@deprecated Use manifest_version instead"),
        manifest_version: CA().optional(),
        name: CA(),
        display_name: CA().optional(),
        version: CA(),
        description: CA(),
        long_description: CA().optional(),
        author: oZ3,
        repository: aZ3.optional(),
        homepage: CA().url().optional(),
        documentation: CA().url().optional(),
        support: CA().url().optional(),
        icon: CA().optional(),
        screenshots: VH(CA()).optional(),
        server: eZ3,
        tools: VH(qG3).optional(),
        tools_generated: CD().optional(),
        prompts: VH(KG3).optional(),
        prompts_generated: CD().optional(),
        keywords: VH(CA()).optional(),
        license: CA().optional(),
        compatibility: AG3.optional(),
        user_config: NS(CA(), YG3).optional()
    }).refine((A) => !!(A.dxt_version || A.manifest_version), {
        message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
    }), MN_ = PV({
        status: VS(["signed", "unsigned", "self-signed"]),
        publisher: CA().optional(),
        issuer: CA().optional(),
        valid_from: CA().optional(),
        valid_to: CA().optional(),
        fingerprint: CA().optional()
    })
})
// @from(Ln 123761, Col 0)
function Pz8(A) {
    try {
        let q = Ha(A),
            K = q;
        if (Dz8(q) && MJ7(q).isDirectory()) K = _G3(q, "manifest.json");
        let Y = zG3(K, "utf-8"),
            z = JSON.parse(Y),
            _ = YI6.safeParse(z);
        if (_.success) return console.log("Manifest schema validation passes!"), !0;
        else return console.log(`ERROR: Manifest validation failed:
`), _.error.issues.forEach((w) => {
            let O = w.path.join(".");
            console.log(`  - ${O?`${O}: `:""}${w.message}`)
        }), !1
    } catch (q) {
        if (q instanceof Error)
            if (q.message.includes("ENOENT")) {
                if (console.error(`ERROR: File not found: ${A}`), Dz8(Ha(A)) && MJ7(Ha(A)).isDirectory()) console.error("  (No manifest.json found in directory)")
            } else if (q.message.includes("JSON")) console.error(`ERROR: Invalid JSON in manifest file: ${q.message}`);
        else console.error(`ERROR: Error reading manifest: ${q.message}`);
        else console.error("ERROR: Unknown error occurred");
        return !1
    }
}
// @from(Ln 123785, Col 0)
async function wG3(A) {
    let q = await Yv.mkdtemp(Ha(XJ7.tmpdir(), "mcpb-clean-")),
        K = Ha(q, "in.mcpb"),
        Y = Ha(q, "out");
    console.log(" -- Cleaning MCPB...");
    try {
        await Yv.copyFile(A, K), console.log(" -- Unpacking MCPB..."), await Jz8({
            mcpbPath: K,
            silent: !0,
            outputDir: Y
        });
        let z = Ha(Y, "manifest.json"),
            _ = await Yv.readFile(z, "utf-8"),
            w = JSON.parse(_),
            O = jJ7.safeParse(w);
        if (!O.success) throw Error('Unrecoverable manifest issues, please run "mcpb validate"');
        if (await Yv.writeFile(z, JSON.stringify(O.data, null, 2)), _.trim() !== (await Yv.readFile(z, "utf8")).trim()) console.log(" -- Update manifest to be valid per MCPB schema");
        else console.log(" -- Manifest already valid per MCPB schema");
        let $ = Ha(Y, "node_modules");
        if (Dz8($)) {
            console.log(" -- node_modules found, deleting development dependencies");
            let M = new DJ7.DestroyerOfModules({
                rootDirectory: Y
            });
            try {
                await M.destroy()
            } catch (D) {
                if (D instanceof Error && D.message.includes("Failed to locate module")) console.log(" -- Some modules already removed, skipping remaining cleanup");
                else throw D
            }
            console.log(" -- Removed development dependencies from node_modules")
        } else console.log(" -- No node_modules, not pruning");
        let H = await Yv.stat(A),
            {
                packExtension: j
            } = await Promise.resolve().then(() => (Zz8(), PJ7));
        await j({
            extensionPath: Y,
            outputPath: A,
            silent: !0
        });
        let J = await Yv.stat(A);
        console.log(`
Clean Complete:`), console.log("Before:", Xz8.default(H.size)), console.log("After:", Xz8.default(J.size))
    } finally {
        await Yv.rm(q, {
            recursive: !0,
            force: !0
        })
    }
}
// @from(Ln 123836, Col 4)
DJ7
// @from(Ln 123836, Col 9)
Xz8
// @from(Ln 123837, Col 4)
Wz8 = E(() => {
    Mz8();
    zI6();
    JJ7();
    DJ7 = t(p$7(), 1), Xz8 = t(d$7(), 1)
})
// @from(Ln 123843, Col 4)
PJ7 = {}
// @from(Ln 123865, Col 0)
function nI6(A) {
    if (A < 1024) return `${A}B`;
    else if (A < 1048576) return `${(A/1024).toFixed(1)}kB`;
    else return `${(A/1048576).toFixed(1)}MB`
}
// @from(Ln 123871, Col 0)
function PG3(A) {
    return A.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_.]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "").substring(0, 100)
}
// @from(Ln 123874, Col 0)
async function GJ7({
    extensionPath: A,
    outputPath: q,
    silent: K
}) {
    let Y = Gz8(A),
        z = rY1({
            silent: K
        });
    if (!WJ7(Y) || !jG3(Y).isDirectory()) return z.error(`ERROR: Directory not found: ${A}`), !1;
    let _ = ZJ7(Y, "manifest.json");
    if (!WJ7(_))
        if (z.log(`No manifest.json found in ${A}`), await B_({
                message: "Would you like to create a manifest.json file?",
                default: !0
            })) {
            if (!await i38(A)) return z.error("ERROR: Failed to create manifest"), !1
        } else return z.error("ERROR: Cannot pack extension without manifest.json"), !1;
    if (z.log("Validating manifest..."), !Pz8(_)) return z.error("ERROR: Cannot pack extension with invalid manifest"), !1;
    let w;
    try {
        let J = HG3(_, "utf-8"),
            M = JSON.parse(J);
        w = YI6.parse(M)
    } catch (J) {
        if (z.error("ERROR: Failed to parse manifest.json"), J instanceof Error) z.error(`  ${J.message}`);
        return !1
    }
    let O = w.manifest_version || w.dxt_version;
    if (O !== e46) return z.error(`ERROR: Manifest version mismatch. Expected "${e46}", found "${O}"`), z.error(`  Please update the manifest_version in your manifest.json to "${e46}"`), !1;
    let $ = MG3(Y),
        H = q ? Gz8(q) : Gz8(`${$}.mcpb`),
        j = ZJ7(H, "..");
    $G3(j, {
        recursive: !0
    });
    try {
        let J = E98(Y),
            {
                files: M,
                ignoredCount: D
            } = n91(Y, Y, {}, J);
        z.log(`
\uD83D\uDCE6  ${w.name}@${w.version}`), z.log("Archive Contents");
        let X = Object.entries(M),
            P = 0;
        X.sort(([h], [R]) => h.localeCompare(R));
        let W = new Map,
            Z = [];
        for (let [h, R] of X) {
            let u = DG3(Y, h),
                I = R.data,
                g = typeof I === "string" ? Buffer.byteLength(I, "utf8") : I.length;
            P += g;
            let B = u.split(XG3);
            if (B.length > 3) {
                let b = B.slice(0, 3).join("/");
                if (!W.has(b)) W.set(b, {
                    files: [],
                    totalSize: 0
                });
                let p = W.get(b);
                p.files.push(u), p.totalSize += g
            } else Z.push({
                path: u,
                size: g
            })
        }
        for (let {
                path: h,
                size: R
            }
            of Z) z.log(`${nI6(R).padStart(8)} ${h}`);
        for (let [h, {
                files: R,
                totalSize: u
            }] of W)
            if (R.length === 1) {
                let I = R[0],
                    g = u;
                z.log(`${nI6(g).padStart(8)} ${I}`)
            } else z.log(`${nI6(u).padStart(8)} ${h}/ [and ${R.length} more files]`);
        let G = {},
            f = process.platform !== "win32";
        for (let [h, R] of Object.entries(M))
            if (f) G[h] = [R.data, {
                os: 3,
                attrs: (R.mode & 511) << 16
            }];
            else G[h] = R.data;
        let v = Z98(G, {
            level: 9,
            mtime: new Date
        });
        JG3(H, v);
        let N = OG3("sha1").update(v).digest("hex"),
            L = `${PG3(w.name)}-${w.version}.mcpb`;
        return z.log(`
Archive Details`), z.log(`name: ${w.name}`), z.log(`version: ${w.version}`), z.log(`filename: ${L}`), z.log(`package size: ${nI6(v.length)}`), z.log(`unpacked size: ${nI6(P)}`), z.log(`shasum: ${N}`), z.log(`total files: ${X.length}`), z.log(`ignored (.mcpbignore) files: ${D}`), z.log(`
Output: ${H}`), !0
    } catch (J) {
        if (J instanceof Error) z.error(`ERROR: Archive error: ${J.message}`);
        else z.error("ERROR: Unknown archive error occurred");
        return !1
    }
}
// @from(Ln 123980, Col 4)
Zz8 = E(() => {
    F38();
    MI6();
    L98();
    Wz8();
    zI6();
    n38()
})
// @from(Ln 123989, Col 0)
function aY1(A, q) {
    if (typeof A === "string") {
        let K = A;
        for (let [Y, z] of Object.entries(q)) {
            let _ = new RegExp(`\\$\\{${Y}\\}`, "g");
            if (K.match(_))
                if (Array.isArray(z)) console.warn(`Cannot replace ${Y} with array value in string context: "${A}"`, {
                    key: Y,
                    replacement: z
                });
                else K = K.replace(_, z)
        }
        return K
    } else if (Array.isArray(A)) {
        let K = [];
        for (let Y of A)
            if (typeof Y === "string" && Y.match(/^\$\{user_config\.[^}]+\}$/)) {
                let z = Y.match(/^\$\{([^}]+)\}$/)?.[1];
                if (z && q[z]) {
                    let _ = q[z];
                    if (Array.isArray(_)) K.push(..._);
                    else K.push(_)
                } else K.push(Y)
            } else K.push(aY1(Y, q));
        return K
    } else if (A && typeof A === "object") {
        let K = {};
        for (let [Y, z] of Object.entries(A)) K[Y] = aY1(z, q);
        return K
    }
    return A
}
// @from(Ln 124021, Col 0)
async function WG3(A) {
    let {
        manifest: q,
        extensionPath: K,
        systemDirs: Y,
        userConfig: z,
        pathSeparator: _,
        logger: w
    } = A, O = q.server?.mcp_config;
    if (!O) return;
    let $ = {
        ...O
    };
    if (O.platform_overrides) {
        if (process.platform in O.platform_overrides) {
            let J = O.platform_overrides[process.platform];
            $.command = J.command || $.command, $.args = J.args || $.args, $.env = J.env || $.env
        }
    }
    if (TJ7({
            manifest: q,
            userConfig: z
        })) {
        w?.warn(`Extension ${q.name} has missing required configuration, skipping MCP config`);
        return
    }
    let H = {
            __dirname: K,
            pathSeparator: _,
            "/": _,
            ...Y
        },
        j = {};
    if (q.user_config) {
        for (let [J, M] of Object.entries(q.user_config))
            if (M.default !== void 0) j[J] = M.default
    }
    if (z) Object.assign(j, z);
    for (let [J, M] of Object.entries(j)) {
        let D = `user_config.${J}`;
        if (Array.isArray(M)) H[D] = M.map(String);
        else if (typeof M === "boolean") H[D] = M ? "true" : "false";
        else H[D] = String(M)
    }
    return $ = aY1($, H), $
}
// @from(Ln 124068, Col 0)
function fJ7(A) {
    return A === void 0 || A === null || A === ""
}
// @from(Ln 124072, Col 0)
function TJ7({
    manifest: A,
    userConfig: q
}) {
    if (!A.user_config) return !1;
    let K = q || {};
    for (let [Y, z] of Object.entries(A.user_config))
        if (z.required) {
            let _ = K[Y];
            if (fJ7(_) || Array.isArray(_) && (_.length === 0 || _.some(fJ7))) return !0
        } return !1
}
// @from(Ln 124084, Col 4)
vJ7 = () => {}
// @from(Ln 124085, Col 4)
fz8 = {}
// @from(Ln 124144, Col 4)
Tz8 = E(() => {
    n38();
    Zz8();
    Mz8();
    L98();
    Hz8();
    Wz8();
    zI6();
    vJ7()
})
// @from(Ln 124154, Col 0)
async function ZG3(A) {
    let {
        McpbManifestSchema: q
    } = await Promise.resolve().then(() => (Tz8(), fz8)), K = q.safeParse(A);
    if (!K.success) {
        let Y = K.error.flatten(),
            z = [...Object.entries(Y.fieldErrors).map(([_, w]) => `${_}: ${w?.join(", ")}`), ...Y.formErrors || []].filter(Boolean).join("; ");
        throw Error(`Invalid manifest: ${z}`)
    }
    return K.data
}
// @from(Ln 124165, Col 0)
async function GG3(A) {
    let q;
    try {
        q = i1(A)
    } catch (K) {
        throw Error(`Invalid JSON in manifest.json: ${_1(K)}`)
    }
    return ZG3(q)
}
// @from(Ln 124174, Col 0)
async function vz8(A) {
    let q = new TextDecoder().decode(A);
    return GG3(q)
}
// @from(Ln 124178, Col 4)
NJ7 = E(() => {
    g1();
    s8()
})
// @from(Ln 124184, Col 0)
function fG3(A) {
    if (Or(A)) return !1;
    let q = sY1.normalize(A);
    if (sY1.isAbsolute(q)) return !1;
    return !0
}
// @from(Ln 124191, Col 0)
function TG3(A, q) {
    q.fileCount++;
    let K;
    if (q.fileCount > ja.MAX_FILE_COUNT) K = `Archive contains too many files: ${q.fileCount} (max: ${ja.MAX_FILE_COUNT})`;
    if (!fG3(A.name)) K = `Unsafe file path detected: "${A.name}". Path traversal or absolute paths are not allowed.`;
    let Y = A.originalSize || 0;
    if (Y > ja.MAX_FILE_SIZE) K = `File "${A.name}" is too large: ${Math.round(Y/1024/1024)}MB (max: ${Math.round(ja.MAX_FILE_SIZE/1024/1024)}MB)`;
    if (q.totalUncompressedSize += Y, q.totalUncompressedSize > ja.MAX_TOTAL_SIZE) K = `Archive total size is too large: ${Math.round(q.totalUncompressedSize/1024/1024)}MB (max: ${Math.round(ja.MAX_TOTAL_SIZE/1024/1024)}MB)`;
    let z = q.totalUncompressedSize / q.compressedSize;
    if (z > ja.MAX_COMPRESSION_RATIO) K = `Suspicious compression ratio detected: ${z.toFixed(1)}:1 (max: ${ja.MAX_COMPRESSION_RATIO}:1). This may be a zip bomb.`;
    return K ? {
        isValid: !1,
        error: K
    } : {
        isValid: !0
    }
}
// @from(Ln 124208, Col 0)
async function vG3(A) {
    let {
        unzipSync: q
    } = await Promise.resolve().then(() => (MI6(), f98)), Y = {
        fileCount: 0,
        totalUncompressedSize: 0,
        compressedSize: A.length,
        errors: []
    }, z = q(new Uint8Array(A), {
        filter: (_) => {
            let w = TG3(_, Y);
            if (!w.isValid) throw Error(w.error);
            return !0
        }
    });
    return k(`Zip extraction completed: ${Y.fileCount} files, ${Math.round(Y.totalUncompressedSize/1024)}KB uncompressed`), z
}
// @from(Ln 124225, Col 0)
async function tY1(A) {
    let q = $1();
    try {
        let K = await q.readFileBytes(A);
        return await vG3(K)
    } catch (K) {
        if (K.code === "ENOENT") throw K;
        let Y = K instanceof Error ? K.message : String(K);
        throw Error(`Failed to read or unzip file: ${Y}`)
    }
}
// @from(Ln 124236, Col 4)
ja
// @from(Ln 124237, Col 4)
Nz8 = E(() => {
    H1();
    SA();
    F9();
    ja = {
        MAX_FILE_SIZE: 536870912,
        MAX_TOTAL_SIZE: 1073741824,
        MAX_FILE_COUNT: 1e5,
        MAX_COMPRESSION_RATIO: 50,
        MIN_COMPRESSION_RATIO: 0.5
    }
})
// @from(Ln 124252, Col 0)
function kJ7(A) {
    let q = A?.platform ?? y8(),
        K = A?.homedir ?? VJ7.homedir(),
        Y = A?.env ?? process.env,
        z = {
            HOME: K,
            DESKTOP: Zq6.join(K, "Desktop"),
            DOCUMENTS: Zq6.join(K, "Documents"),
            DOWNLOADS: Zq6.join(K, "Downloads")
        };
    switch (q) {
        case "windows": {
            let _ = Y.USERPROFILE || K;
            return {
                HOME: K,
                DESKTOP: Zq6.join(_, "Desktop"),
                DOCUMENTS: Zq6.join(_, "Documents"),
                DOWNLOADS: Zq6.join(_, "Downloads")
            }
        }
        case "linux":
        case "wsl":
            return {
                HOME: K, DESKTOP: Y.XDG_DESKTOP_DIR || z.DESKTOP, DOCUMENTS: Y.XDG_DOCUMENTS_DIR || z.DOCUMENTS, DOWNLOADS: Y.XDG_DOWNLOAD_DIR || z.DOWNLOADS
            };
        case "macos":
        default: {
            if (q === "unknown") k("Unknown platform detected, using default paths");
            return z
        }
    }
}
// @from(Ln 124284, Col 4)
EJ7 = E(() => {
    YK();
    H1()
})
// @from(Ln 124299, Col 0)
function WL(A) {
    return A.endsWith(".mcpb") || A.endsWith(".dxt")
}
// @from(Ln 124303, Col 0)
function RJ7(A) {
    return A.startsWith("http://") || A.startsWith("https://")
}
// @from(Ln 124307, Col 0)
function VG3(A) {
    return Ez8("sha256").update(A).digest("hex").substring(0, 16)
}
// @from(Ln 124311, Col 0)
function hJ7(A) {
    return Ja(A, ".mcpb-cache")
}
// @from(Ln 124315, Col 0)
function SJ7(A, q) {
    let K = Ez8("md5").update(q).digest("hex").substring(0, 8);
    return Ja(A, `${K}.metadata.json`)
}
// @from(Ln 124320, Col 0)
function yJ7(A, q) {
    try {
        let Y = PA().pluginConfigs?.[A]?.mcpServers?.[q];
        if (!Y) return null;
        return k(`Loaded user config for ${A}/${q} from settings`), Y
    } catch (K) {
        let Y = K instanceof Error ? K : Error(String(K));
        return _6(Y), k(`Failed to load user config for ${A}/${q}: ${K}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 124333, Col 0)
function LJ7(A, q, K) {
    try {
        let Y = PA();
        if (!Y.pluginConfigs) Y.pluginConfigs = {};
        if (!Y.pluginConfigs[A]) Y.pluginConfigs[A] = {};
        if (!Y.pluginConfigs[A].mcpServers) Y.pluginConfigs[A].mcpServers = {};
        Y.pluginConfigs[A].mcpServers[q] = K;
        let z = TA("userSettings", Y);
        if (z.error) throw z.error;
        k(`Saved user config for ${A}/${q} to user settings`)
    } catch (Y) {
        let z = Y instanceof Error ? Y : Error(String(Y));
        throw _6(z), Error(`Failed to save user configuration for ${A}/${q}: ${z.message}`)
    }
}
// @from(Ln 124349, Col 0)
function kz8(A, q) {
    let K = [];
    for (let [Y, z] of Object.entries(q)) {
        let _ = A[Y];
        if (z.required && (_ === void 0 || _ === "")) {
            K.push(`${z.title||Y} is required but not provided`);
            continue
        }
        if (_ === void 0 || _ === "") continue;
        if (z.type === "string") {
            if (Array.isArray(_)) {
                if (!z.multiple) K.push(`${z.title||Y} must be a string, not an array`);
                else if (!_.every((w) => typeof w === "string")) K.push(`${z.title||Y} must be an array of strings`)
            } else if (typeof _ !== "string") K.push(`${z.title||Y} must be a string`)
        } else if (z.type === "number" && typeof _ !== "number") K.push(`${z.title||Y} must be a number`);
        else if (z.type === "boolean" && typeof _ !== "boolean") K.push(`${z.title||Y} must be a boolean`);
        else if ((z.type === "file" || z.type === "directory") && typeof _ !== "string") K.push(`${z.title||Y} must be a path string`);
        if (z.type === "number" && typeof _ === "number") {
            if (z.min !== void 0 && _ < z.min) K.push(`${z.title||Y} must be at least ${z.min}`);
            if (z.max !== void 0 && _ > z.max) K.push(`${z.title||Y} must be at most ${z.max}`)
        }
    }
    return {
        valid: K.length === 0,
        errors: K
    }
}
// @from(Ln 124376, Col 0)
async function eY1(A, q, K = {}) {
    let {
        getMcpConfigForManifest: Y
    } = await Promise.resolve().then(() => (Tz8(), fz8)), z = await Y({
        manifest: A,
        extensionPath: q,
        systemDirs: kJ7(),
        userConfig: K,
        pathSeparator: "/"
    });
    if (!z) {
        let _ = Error(`Failed to generate MCP server configuration from manifest "${A.name}"`);
        throw _6(_), _
    }
    return z
}
// @from(Ln 124392, Col 0)
async function CJ7(A, q) {
    let K = $1(),
        Y = SJ7(A, q);
    try {
        let z = await K.readFile(Y, {
            encoding: "utf-8"
        });
        return i1(z)
    } catch (z) {
        if (z.code === "ENOENT") return null;
        let w = z instanceof Error ? z : Error(String(z));
        return _6(w), k(`Failed to load MCPB cache metadata: ${z}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 124408, Col 0)
async function Vz8(A, q, K) {
    let Y = SJ7(A, q);
    await $1().mkdir(A), await Az1(Y, B6(K, null, 2), "utf-8")
}
// @from(Ln 124412, Col 0)
async function kG3(A, q, K) {
    if (k(`Downloading MCPB from ${A}`), K) K(`Downloading ${A}...`);
    try {
        let Y = await X8.get(A, {
                timeout: 120000,
                responseType: "arraybuffer",
                maxRedirects: 5,
                onDownloadProgress: (_) => {
                    if (_.total && K) {
                        let w = Math.round(_.loaded / _.total * 100);
                        K(`Downloading... ${w}%`)
                    }
                }
            }),
            z = new Uint8Array(Y.data);
        if (await Az1(q, Buffer.from(z)), k(`Downloaded ${z.length} bytes to ${q}`), K) K("Download complete");
        return z
    } catch (Y) {
        let z = _1(Y),
            _ = Error(`Failed to download MCPB file from ${A}: ${z}`);
        throw _6(_), _
    }
}
// @from(Ln 124435, Col 0)
async function EG3(A, q, K) {
    if (K) K("Extracting files...");
    await $1().mkdir(q);
    let Y = 0,
        z = Object.keys(A).length;
    for (let [_, w] of Object.entries(A)) {
        let O = Ja(q, _),
            $ = NG3(O);
        if ($ !== q) await $1().mkdir($);
        if (_.endsWith(".json") || _.endsWith(".js") || _.endsWith(".ts") || _.endsWith(".txt") || _.endsWith(".md") || _.endsWith(".yml") || _.endsWith(".yaml")) {
            let j = new TextDecoder().decode(w);
            await Az1(O, j, "utf-8")
        } else await Az1(O, Buffer.from(w));
        if (Y++, K && Y % 10 === 0) K(`Extracted ${Y}/${z} files`)
    }
    if (k(`Extracted ${Y} files to ${q}`), K) K(`Extraction complete (${Y} files)`)
}
// @from(Ln 124452, Col 0)
async function yG3(A, q) {
    let K = $1(),
        Y = hJ7(q),
        z = await CJ7(Y, A);
    if (!z) return !0;
    try {
        await K.stat(z.extractedPath)
    } catch (_) {
        if (_.code === "ENOENT") k(`MCPB extraction path missing: ${z.extractedPath}`);
        else k(`MCPB extraction path inaccessible: ${z.extractedPath}: ${_}`, {
            level: "error"
        });
        return !0
    }
    if (!RJ7(A)) {
        let _ = Ja(q, A),
            w;
        try {
            w = await K.stat(_)
        } catch (H) {
            if (H.code === "ENOENT") k(`MCPB source file missing: ${_}`);
            else k(`MCPB source file inaccessible: ${_}: ${H}`, {
                level: "error"
            });
            return !0
        }
        let O = new Date(z.cachedAt).getTime(),
            $ = w.mtimeMs;
        if ($ > O) return k(`MCPB file modified: ${new Date($)} > ${new Date(O)}`), !0
    }
    return !1
}
// @from(Ln 124484, Col 0)
async function rI6(A, q, K, Y, z, _) {
    let w = $1(),
        O = hJ7(q);
    await w.mkdir(O), k(`Loading MCPB from source: ${A}`);
    let $ = await CJ7(O, A);
    if ($ && !await yG3(A, q)) {
        k(`Using cached MCPB from ${$.extractedPath} (hash: ${$.contentHash})`);
        let G = Ja($.extractedPath, "manifest.json"),
            f;
        try {
            f = await w.readFile(G, {
                encoding: "utf-8"
            })
        } catch (L) {
            if (L.code === "ENOENT") {
                let h = Error(`Cached manifest not found: ${G}`);
                throw _6(h), h
            }
            throw L
        }
        let v = new TextEncoder().encode(f),
            N = await vz8(v);
        if (N.user_config && Object.keys(N.user_config).length > 0) {
            let L = N.name,
                h = yJ7(K, L),
                R = z || h || {},
                u = kz8(R, N.user_config);
            if (_ || !u.valid) return {
                status: "needs-config",
                manifest: N,
                extractedPath: $.extractedPath,
                contentHash: $.contentHash,
                configSchema: N.user_config,
                existingConfig: h || {},
                validationErrors: u.valid ? [] : u.errors
            };
            if (z) LJ7(K, L, z);
            let I = await eY1(N, $.extractedPath, R);
            return {
                manifest: N,
                mcpConfig: I,
                extractedPath: $.extractedPath,
                contentHash: $.contentHash
            }
        }
        let V = await eY1(N, $.extractedPath);
        return {
            manifest: N,
            mcpConfig: V,
            extractedPath: $.extractedPath,
            contentHash: $.contentHash
        }
    }
    let H, j;
    if (RJ7(A)) {
        let G = Ez8("md5").update(A).digest("hex").substring(0, 8);
        j = Ja(O, `${G}.mcpb`), H = await kG3(A, j, Y)
    } else {
        let G = Ja(q, A);
        if (Y) Y(`Loading ${A}...`);
        try {
            H = await w.readFileBytes(G), j = G
        } catch (f) {
            if (f.code === "ENOENT") {
                let v = Error(`MCPB file not found: ${G}`);
                throw _6(v), v
            }
            throw f
        }
    }
    let J = VG3(H);
    if (k(`MCPB content hash: ${J}`), Y) Y("Extracting MCPB archive...");
    let M = await tY1(j),
        D = M["manifest.json"];
    if (!D) {
        let G = Error("No manifest.json found in MCPB file");
        throw _6(G), G
    }
    let X = await vz8(D);
    if (k(`MCPB manifest: ${X.name} v${X.version} by ${X.author.name}`), !X.server) {
        let G = Error(`MCPB manifest for "${X.name}" does not define a server configuration`);
        throw _6(G), G
    }
    let P = Ja(O, J);
    if (await EG3(M, P, Y), X.user_config && Object.keys(X.user_config).length > 0) {
        let G = X.name,
            f = yJ7(K, G),
            v = z || f || {},
            N = kz8(v, X.user_config);
        if (!N.valid) {
            let h = {
                source: A,
                contentHash: J,
                extractedPath: P,
                cachedAt: new Date().toISOString(),
                lastChecked: new Date().toISOString()
            };
            return await Vz8(O, A, h), {
                status: "needs-config",
                manifest: X,
                extractedPath: P,
                contentHash: J,
                configSchema: X.user_config,
                existingConfig: f || {},
                validationErrors: N.errors
            }
        }
        if (z) LJ7(K, G, z);
        if (Y) Y("Generating MCP server configuration...");
        let V = await eY1(X, P, v),
            L = {
                source: A,
                contentHash: J,
                extractedPath: P,
                cachedAt: new Date().toISOString(),
                lastChecked: new Date().toISOString()
            };
        return await Vz8(O, A, L), {
            manifest: X,
            mcpConfig: V,
            extractedPath: P,
            contentHash: J
        }
    }
    if (Y) Y("Generating MCP server configuration...");
    let W = await eY1(X, P),
        Z = {
            source: A,
            contentHash: J,
            extractedPath: P,
            cachedAt: new Date().toISOString(),
            lastChecked: new Date().toISOString()
        };
    return await Vz8(O, A, Z), k(`Successfully loaded MCPB: ${X.name} (extracted to ${P})`), {
        manifest: X,
        mcpConfig: W,
        extractedPath: P,
        contentHash: J
    }
}
// @from(Ln 124624, Col 4)
qz1 = E(() => {
    kK();
    NJ7();
    Nz8();
    SA();
    H1();
    k1();
    EJ7();
    i8();
    g1();
    s8()
})
// @from(Ln 124637, Col 0)
function IJ7(A, q) {
    return {
        name: `${A.name}-with-${q.name}-fallback`,
        read() {
            let K = A.read();
            if (K !== null && K !== void 0) return K;
            return q.read() || {}
        },
        async readAsync() {
            let K = await A.readAsync();
            if (K !== null && K !== void 0) return K;
            return await q.readAsync() || {}
        },
        update(K) {
            let Y = A.read(),
                z = A.update(K);
            if (z.success) {
                if (Y === null) q.delete();
                return z
            }
            let _ = q.update(K);
            if (_.success) {
                if (Y !== null) A.delete();
                return {
                    success: !0,
                    warning: _.warning
                }
            }
            return {
                success: !1
            }
        },
        delete() {
            let K = A.delete(),
                Y = q.delete();
            return K || Y
        }
    }
}
// @from(Ln 124683, Col 0)
function qU(A = "") {
    let q = c8(),
        Y = !process.env.CLAUDE_CONFIG_DIR ? "" : `-${LG3("sha256").update(q).digest("hex").substring(0,8)}`;
    return `Claude Code${P7().OAUTH_FILE_SUFFIX}${A}${Y}`
}
// @from(Ln 124689, Col 0)
function kM6() {
    try {
        return process.env.USER || RG3().username
    } catch {
        return "claude-code-user"
    }
}
// @from(Ln 124697, Col 0)
function tV() {
    AU = {
        data: null,
        cachedAt: 0
    }, yz8++, oI6 = null
}
// @from(Ln 124703, Col 0)
async function SG3() {
    try {
        let A = qU("-credentials"),
            q = kM6(),
            {
                stdout: K,
                code: Y
            } = await z8("security", ["find-generic-password", "-a", q, "-w", "-s", A], {
                useCwd: !1,
                preserveOutputOnError: !1
            });
        if (Y === 0 && K) return i1(K.trim())
    } catch (A) {}
    return null
}
// @from(Ln 124719, Col 0)
function uJ7() {
    if (process.platform !== "darwin") return !1;
    try {
        return BA6("security", ["show-keychain-info"], {
            reject: !1,
            stdio: ["ignore", "pipe", "pipe"]
        }).exitCode === 36
    } catch {
        return !1
    }
}
// @from(Ln 124730, Col 4)
hG3 = 4032
// @from(Ln 124731, Col 4)
bJ7 = 5000
// @from(Ln 124732, Col 4)
AU
// @from(Ln 124732, Col 8)
yz8 = 0
// @from(Ln 124733, Col 4)
oI6 = null
// @from(Ln 124734, Col 4)
xJ7
// @from(Ln 124735, Col 4)
Gq6 = E(() => {
    al1();
    Eq();
    A8();
    F5();
    WW();
    g1();
    H1();
    AU = {
        data: null,
        cachedAt: 0
    };
    xJ7 = {
        name: "keychain",
        read() {
            if (Date.now() - AU.cachedAt < bJ7) return AU.data;
            try {
                let A = qU("-credentials"),
                    q = kM6(),
                    K = yT(`security find-generic-password -a "${q}" -w -s "${A}"`);
                if (K) {
                    let Y = i1(K);
                    return AU = {
                        data: Y,
                        cachedAt: Date.now()
                    }, Y
                }
            } catch (A) {}
            return AU = {
                data: null,
                cachedAt: Date.now()
            }, null
        },
        async readAsync() {
            if (Date.now() - AU.cachedAt < bJ7) return AU.data;
            if (oI6) return oI6;
            let A = yz8,
                q = SG3().then((K) => {
                    if (A === yz8) AU = {
                        data: K,
                        cachedAt: Date.now()
                    }, oI6 = null;
                    return K
                });
            return oI6 = q, q
        },
        update(A) {
            tV();
            try {
                let q = qU("-credentials"),
                    K = kM6(),
                    Y = B6(A),
                    z = Buffer.from(Y, "utf-8").toString("hex"),
                    _ = `add-generic-password -U -a "${K}" -s "${q}" -X "${z}"
`,
                    w;
                if (_.length <= hG3) w = BA6("security", ["-i"], {
                    input: _,
                    stdio: ["pipe", "pipe", "pipe"],
                    reject: !1
                });
                else k(`Keychain payload (${Y.length}B JSON) exceeds security -i stdin limit; using argv`, {
                    level: "warn"
                }), w = BA6("security", ["add-generic-password", "-U", "-a", K, "-s", q, "-X", z], {
                    stdio: ["ignore", "pipe", "pipe"],
                    reject: !1
                });
                if (w.exitCode !== 0) return {
                    success: !1
                };
                return AU = {
                    data: A,
                    cachedAt: Date.now()
                }, {
                    success: !0
                }
            } catch (q) {
                return {
                    success: !1
                }
            }
        },
        delete() {
            tV();
            try {
                let A = qU("-credentials"),
                    q = kM6();
                return yT(`security delete-generic-password -a "${q}" -s "${A}"`), !0
            } catch (A) {
                return !1
            }
        }
    }
})
// @from(Ln 124836, Col 0)
function Kz1() {
    let A = c8(),
        q = ".credentials.json";
    return {
        storageDir: A,
        storagePath: CG3(A, ".credentials.json")
    }
}
// @from(Ln 124844, Col 4)
Lz8
// @from(Ln 124845, Col 4)
mJ7 = E(() => {
    SA();
    A8();
    g1();
    g1();
    Lz8 = {
        name: "plaintext",
        read() {
            let {
                storagePath: A
            } = Kz1();
            try {
                let q = $1().readFileSync(A, {
                    encoding: "utf8"
                });
                return i1(q)
            } catch {
                return null
            }
        },
        async readAsync() {
            let {
                storagePath: A
            } = Kz1();
            try {
                let q = await $1().readFile(A, {
                    encoding: "utf8"
                });
                return i1(q)
            } catch {
                return null
            }
        },
        update(A) {
            try {
                let {
                    storageDir: q,
                    storagePath: K
                } = Kz1();
                try {
                    $1().mkdirSync(q)
                } catch (Y) {
                    if (Y.code !== "EEXIST") throw Y
                }
                return fz(K, B6(A), {
                    encoding: "utf8",
                    flush: !1
                }), IG3(K, 384), {
                    success: !0,
                    warning: "Warning: Storing credentials in plaintext."
                }
            } catch {
                return {
                    success: !1
                }
            }
        },
        delete() {
            let {
                storagePath: A
            } = Kz1();
            try {
                return $1().unlinkSync(A), !0
            } catch (q) {
                if (q.code === "ENOENT") return !0;
                return !1
            }
        }
    }
})
// @from(Ln 124916, Col 0)
function U2() {
    if (process.platform === "darwin") return IJ7(xJ7, Lz8);
    return Lz8
}
// @from(Ln 124920, Col 4)
aI6 = E(() => {
    Gq6();
    mJ7()
})
// @from(Ln 124925, Col 0)
function Rz8() {
    bG3.cache?.clear?.()
}
// @from(Ln 124929, Col 0)
function Yz1(A) {
    if (PA().pluginConfigs?.[A]) {
        let z = {
                [A]: void 0
            },
            {
                error: _
            } = TA("userSettings", {
                pluginConfigs: z
            });
        if (_) k(`deletePluginOptions: failed to clear settings.pluginConfigs[${A}]: ${_.message}`, {
            level: "warn"
        })
    }
    let K = U2(),
        Y = K.read();
    if (Y?.pluginSecrets?.[A]) {
        let z = {
            ...Y.pluginSecrets
        };
        if (delete z[A], !K.update({
                ...Y,
                pluginSecrets: Object.keys(z).length > 0 ? z : void 0
            }).success) k(`deletePluginOptions: failed to clear pluginSecrets[${A}] from keychain`, {
            level: "warn"
        })
    }
    Rz8()
}
// @from(Ln 124959, Col 0)
function ZL(A, q) {
    let K = process.platform === "win32" ? q.replace(/\\/g, "/") : q;
    return A.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, K)
}
// @from(Ln 124964, Col 0)
function zz1(A, q) {
    return A.replace(/\$\{user_config\.([^}]+)\}/g, (K, Y) => {
        let z = q[Y];
        if (z === void 0) throw Error(`Missing required user configuration value: ${Y}. This should have been validated before variable substitution.`);
        return String(z)
    })
}
// @from(Ln 124971, Col 4)
bG3
// @from(Ln 124972, Col 4)
eu = E(() => {
    U4();
    qz1();
    i8();
    aI6();
    H1();
    k1();
    bG3 = e1((A) => {
        let K = PA().pluginConfigs?.[A]?.options ?? {},
            z = U2().read()?.pluginSecrets?.[A] ?? {};
        return {
            ...K,
            ...z
        }
    })
})
// @from(Ln 124989, Col 0)
function BJ7() {
    let A = L8("policySettings");
    if (A?.disableAllHooks === !0) return {};
    if (A?.allowManagedHooksOnly === !0) return A.hooks ?? {};
    let q = PA();
    if (q.disableAllHooks === !0) return A?.hooks ?? {};
    return q.hooks ?? {}
}
// @from(Ln 124998, Col 0)
function GL() {
    let A = L8("policySettings");
    if (A?.allowManagedHooksOnly === !0) return !0;
    if (PA().disableAllHooks === !0 && A?.disableAllHooks !== !0) return !0;
    return !1
}
// @from(Ln 125005, Col 0)
function sI6() {
    return L8("policySettings")?.disableAllHooks === !0
}
// @from(Ln 125009, Col 0)
function hz8() {
    _z1 = BJ7()
}
// @from(Ln 125013, Col 0)
function gJ7() {
    zP(), _z1 = BJ7()
}
// @from(Ln 125017, Col 0)
function EM6() {
    if (_z1 === null) hz8();
    return _z1
}
// @from(Ln 125021, Col 4)
_z1 = null
// @from(Ln 125022, Col 4)
tI6 = E(() => {
    i8();
    T1()
})
// @from(Ln 125036, Col 0)
function Z3() {
    let A = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;
    if (t6(A)) return !1;
    if (xz(A)) return !0;
    if (t6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return !1;
    let q = mA();
    if (q.autoMemoryEnabled !== void 0) return q.autoMemoryEnabled;
    return !0
}
// @from(Ln 125046, Col 0)
function Ma() {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    return c8()
}
// @from(Ln 125051, Col 0)
function QJ7(A, q) {
    if (!A) return;
    let K = A;
    if (q && (K.startsWith("~/") || K.startsWith("~\\"))) {
        let z = K.slice(2),
            _ = Sz8(z || ".");
        if (_ === "." || _ === "..") return;
        K = wz1(uG3(), z)
    }
    let Y = Sz8(K).replace(/[/\\]+$/, "");
    if (!xG3(Y) || Y.length < 3 || /^[A-Za-z]:$/.test(Y) || Y.startsWith("\\\\") || Y.startsWith("//") || Y.includes("\x00")) return;
    return (Y + pJ7).normalize("NFC")
}
// @from(Ln 125065, Col 0)
function UJ7() {
    return QJ7(process.env.CLAUDE_COWORK_MEMORY_PATH_OVERRIDE, !1)
}
// @from(Ln 125069, Col 0)
function gG3() {
    let A = L8("policySettings")?.autoMemoryDirectory ?? L8("flagSettings")?.autoMemoryDirectory ?? L8("localSettings")?.autoMemoryDirectory ?? L8("userSettings")?.autoMemoryDirectory;
    return QJ7(A, !0)
}
// @from(Ln 125074, Col 0)
function Oz1() {
    return UJ7() !== void 0
}
// @from(Ln 125078, Col 0)
function FG3() {
    return LJ(qY()) ?? qY()
}
// @from(Ln 125082, Col 0)
function $z1() {
    return wz1(uH(), BG3)
}
// @from(Ln 125086, Col 0)
function Da(A) {
    return Sz8(A).startsWith(uH())
}
// @from(Ln 125089, Col 4)
mG3 = "memory"
// @from(Ln 125090, Col 4)
BG3 = "MEMORY.md"
// @from(Ln 125091, Col 4)
uH
// @from(Ln 125092, Col 4)
mH = E(() => {
    U4();
    T1();
    $5();
    A8();
    i8();
    F9();
    uH = e1(() => {
        let A = UJ7() ?? gG3();
        if (A) return A;
        let q = wz1(Ma(), "projects");
        return (wz1(q, BD(FG3()), mG3) + pJ7).normalize("NFC")
    }, () => qY())
})
// @from(Ln 125107, Col 0)
function dJ7(A) {
    return Math.max(0, Math.floor((Date.now() - A) / 86400000))
}
// @from(Ln 125111, Col 0)
function cJ7(A) {
    let q = dJ7(A);
    if (q === 0) return "today";
    if (q === 1) return "yesterday";
    return `${q} days ago`
}
// @from(Ln 125118, Col 0)
function Cz8(A) {
    let q = dJ7(A);
    if (q <= 1) return "";
    return `This memory is ${q} days old. ` + "Memories are point-in-time observations, not live state — " + "claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact."
}
// @from(Ln 125124, Col 0)
function lJ7(A) {
    let q = Cz8(A);
    if (!q) return "";
    return `<system-reminder>${q}</system-reminder>
`
}
// @from(Ln 125131, Col 0)
function iJ7() {
    if (process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT) {
        let K = parseInt(process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT, 10);
        if (!isNaN(K) && K > 0 && K <= 10) return K
    }
    let A = CK(),
        q = ox();
    if (A === "max" && q === "default_claude_max_20x") return 3;
    if (A === "enterprise" || A === "team") return 3;
    return 1
}
// @from(Ln 125143, Col 0)
function nJ7() {
    if (process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT) {
        let A = parseInt(process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT, 10);
        if (!isNaN(A) && A > 0 && A <= 10) return A
    }
    return 3
}
// @from(Ln 125151, Col 0)
function rO() {
    let A = process.env.CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE;
    if (t6(A)) return !0;
    if (xz(A)) return !1;
    return w8("tengu_plan_mode_interview_phase", !1)
}
// @from(Ln 125158, Col 0)
function Hz1() {
    let A = w8("tengu_pewter_ledger", null);
    if (A === "trim" || A === "cut" || A === "cap") return A;
    return null
}
// @from(Ln 125163, Col 4)
Xa = E(() => {
    HA();
    fA();
    A8()
})
// @from(Ln 125169, Col 0)
function pG3() {
    return process.argv.includes("--agent-teams")
}
// @from(Ln 125173, Col 0)
function E7() {
    if (!t6(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) && !pG3()) return !1;
    if (!w8("tengu_amber_flint", !0)) return !1;
    return !0
}
// @from(Ln 125178, Col 4)
Qz = E(() => {
    HA();
    A8()
})
// @from(Ln 125183, Col 0)
function QG3(A) {
    var q = A == null ? 0 : A.length;
    return q ? A[q - 1] : void 0
}
// @from(Ln 125187, Col 4)
fL
// @from(Ln 125188, Col 4)
eI6 = E(() => {
    fL = QG3
})
// @from(Ln 125193, Col 0)
function Iz8() {
    let {
        env: A
    } = rJ7, {
        TERM: q,
        TERM_PROGRAM: K
    } = A;
    if (rJ7.platform !== "win32") return q !== "linux";
    return Boolean(A.WT_SESSION) || Boolean(A.TERMINUS_SUBLIME) || A.ConEmuTask === "{cmd::Cmder}" || K === "Terminus-Sublime" || K === "vscode" || q === "xterm-256color" || q === "alacritty" || q === "rxvt-unicode" || q === "rxvt-unicode-256color" || A.TERMINAL_EMULATOR === "JetBrains-JediTerm"
}
// @from(Ln 125203, Col 4)
oJ7 = () => {}
// @from(Ln 125204, Col 4)
aJ7
// @from(Ln 125204, Col 9)
sJ7
// @from(Ln 125204, Col 14)
UG3
// @from(Ln 125204, Col 19)
dG3
// @from(Ln 125204, Col 24)
cG3
// @from(Ln 125204, Col 29)
lG3
// @from(Ln 125204, Col 34)
iG3
// @from(Ln 125204, Col 39)
a6
// @from(Ln 125204, Col 43)
Hk_
// @from(Ln 125205, Col 4)
b7 = E(() => {
    oJ7();
    aJ7 = {
        circleQuestionMark: "(?)",
        questionMarkPrefix: "(?)",
        square: "█",
        squareDarkShade: "▓",
        squareMediumShade: "▒",
        squareLightShade: "░",
        squareTop: "▀",
        squareBottom: "▄",
        squareLeft: "▌",
        squareRight: "▐",
        squareCenter: "■",
        bullet: "●",
        dot: "․",
        ellipsis: "…",
        pointerSmall: "›",
        triangleUp: "▲",
        triangleUpSmall: "▴",
        triangleDown: "▼",
        triangleDownSmall: "▾",
        triangleLeftSmall: "◂",
        triangleRightSmall: "▸",
        home: "⌂",
        heart: "♥",
        musicNote: "♪",
        musicNoteBeamed: "♫",
        arrowUp: "↑",
        arrowDown: "↓",
        arrowLeft: "←",
        arrowRight: "→",
        arrowLeftRight: "↔",
        arrowUpDown: "↕",
        almostEqual: "≈",
        notEqual: "≠",
        lessOrEqual: "≤",
        greaterOrEqual: "≥",
        identical: "≡",
        infinity: "∞",
        subscriptZero: "₀",
        subscriptOne: "₁",
        subscriptTwo: "₂",
        subscriptThree: "₃",
        subscriptFour: "₄",
        subscriptFive: "₅",
        subscriptSix: "₆",
        subscriptSeven: "₇",
        subscriptEight: "₈",
        subscriptNine: "₉",
        oneHalf: "½",
        oneThird: "⅓",
        oneQuarter: "¼",
        oneFifth: "⅕",
        oneSixth: "⅙",
        oneEighth: "⅛",
        twoThirds: "⅔",
        twoFifths: "⅖",
        threeQuarters: "¾",
        threeFifths: "⅗",
        threeEighths: "⅜",
        fourFifths: "⅘",
        fiveSixths: "⅚",
        fiveEighths: "⅝",
        sevenEighths: "⅞",
        line: "─",
        lineBold: "━",
        lineDouble: "═",
        lineDashed0: "┄",
        lineDashed1: "┅",
        lineDashed2: "┈",
        lineDashed3: "┉",
        lineDashed4: "╌",
        lineDashed5: "╍",
        lineDashed6: "╴",
        lineDashed7: "╶",
        lineDashed8: "╸",
        lineDashed9: "╺",
        lineDashed10: "╼",
        lineDashed11: "╾",
        lineDashed12: "−",
        lineDashed13: "–",
        lineDashed14: "‐",
        lineDashed15: "⁃",
        lineVertical: "│",
        lineVerticalBold: "┃",
        lineVerticalDouble: "║",
        lineVerticalDashed0: "┆",
        lineVerticalDashed1: "┇",
        lineVerticalDashed2: "┊",
        lineVerticalDashed3: "┋",
        lineVerticalDashed4: "╎",
        lineVerticalDashed5: "╏",
        lineVerticalDashed6: "╵",
        lineVerticalDashed7: "╷",
        lineVerticalDashed8: "╹",
        lineVerticalDashed9: "╻",
        lineVerticalDashed10: "╽",
        lineVerticalDashed11: "╿",
        lineDownLeft: "┐",
        lineDownLeftArc: "╮",
        lineDownBoldLeftBold: "┓",
        lineDownBoldLeft: "┒",
        lineDownLeftBold: "┑",
        lineDownDoubleLeftDouble: "╗",
        lineDownDoubleLeft: "╖",
        lineDownLeftDouble: "╕",
        lineDownRight: "┌",
        lineDownRightArc: "╭",
        lineDownBoldRightBold: "┏",
        lineDownBoldRight: "┎",
        lineDownRightBold: "┍",
        lineDownDoubleRightDouble: "╔",
        lineDownDoubleRight: "╓",
        lineDownRightDouble: "╒",
        lineUpLeft: "┘",
        lineUpLeftArc: "╯",
        lineUpBoldLeftBold: "┛",
        lineUpBoldLeft: "┚",
        lineUpLeftBold: "┙",
        lineUpDoubleLeftDouble: "╝",
        lineUpDoubleLeft: "╜",
        lineUpLeftDouble: "╛",
        lineUpRight: "└",
        lineUpRightArc: "╰",
        lineUpBoldRightBold: "┗",
        lineUpBoldRight: "┖",
        lineUpRightBold: "┕",
        lineUpDoubleRightDouble: "╚",
        lineUpDoubleRight: "╙",
        lineUpRightDouble: "╘",
        lineUpDownLeft: "┤",
        lineUpBoldDownBoldLeftBold: "┫",
        lineUpBoldDownBoldLeft: "┨",
        lineUpDownLeftBold: "┥",
        lineUpBoldDownLeftBold: "┩",
        lineUpDownBoldLeftBold: "┪",
        lineUpDownBoldLeft: "┧",
        lineUpBoldDownLeft: "┦",
        lineUpDoubleDownDoubleLeftDouble: "╣",
        lineUpDoubleDownDoubleLeft: "╢",
        lineUpDownLeftDouble: "╡",
        lineUpDownRight: "├",
        lineUpBoldDownBoldRightBold: "┣",
        lineUpBoldDownBoldRight: "┠",
        lineUpDownRightBold: "┝",
        lineUpBoldDownRightBold: "┡",
        lineUpDownBoldRightBold: "┢",
        lineUpDownBoldRight: "┟",
        lineUpBoldDownRight: "┞",
        lineUpDoubleDownDoubleRightDouble: "╠",
        lineUpDoubleDownDoubleRight: "╟",
        lineUpDownRightDouble: "╞",
        lineDownLeftRight: "┬",
        lineDownBoldLeftBoldRightBold: "┳",
        lineDownLeftBoldRightBold: "┯",
        lineDownBoldLeftRight: "┰",
        lineDownBoldLeftBoldRight: "┱",
        lineDownBoldLeftRightBold: "┲",
        lineDownLeftRightBold: "┮",
        lineDownLeftBoldRight: "┭",
        lineDownDoubleLeftDoubleRightDouble: "╦",
        lineDownDoubleLeftRight: "╥",
        lineDownLeftDoubleRightDouble: "╤",
        lineUpLeftRight: "┴",
        lineUpBoldLeftBoldRightBold: "┻",
        lineUpLeftBoldRightBold: "┷",
        lineUpBoldLeftRight: "┸",
        lineUpBoldLeftBoldRight: "┹",
        lineUpBoldLeftRightBold: "┺",
        lineUpLeftRightBold: "┶",
        lineUpLeftBoldRight: "┵",
        lineUpDoubleLeftDoubleRightDouble: "╩",
        lineUpDoubleLeftRight: "╨",
        lineUpLeftDoubleRightDouble: "╧",
        lineUpDownLeftRight: "┼",
        lineUpBoldDownBoldLeftBoldRightBold: "╋",
        lineUpDownBoldLeftBoldRightBold: "╈",
        lineUpBoldDownLeftBoldRightBold: "╇",
        lineUpBoldDownBoldLeftRightBold: "╊",
        lineUpBoldDownBoldLeftBoldRight: "╉",
        lineUpBoldDownLeftRight: "╀",
        lineUpDownBoldLeftRight: "╁",
        lineUpDownLeftBoldRight: "┽",
        lineUpDownLeftRightBold: "┾",
        lineUpBoldDownBoldLeftRight: "╂",
        lineUpDownLeftBoldRightBold: "┿",
        lineUpBoldDownLeftBoldRight: "╃",
        lineUpBoldDownLeftRightBold: "╄",
        lineUpDownBoldLeftBoldRight: "╅",
        lineUpDownBoldLeftRightBold: "╆",
        lineUpDoubleDownDoubleLeftDoubleRightDouble: "╬",
        lineUpDoubleDownDoubleLeftRight: "╫",
        lineUpDownLeftDoubleRightDouble: "╪",
        lineCross: "╳",
        lineBackslash: "╲",
        lineSlash: "╱"
    }, sJ7 = {
        tick: "✔",
        info: "ℹ",
        warning: "⚠",
        cross: "✘",
        squareSmall: "◻",
        squareSmallFilled: "◼",
        circle: "◯",
        circleFilled: "◉",
        circleDotted: "◌",
        circleDouble: "◎",
        circleCircle: "ⓞ",
        circleCross: "ⓧ",
        circlePipe: "Ⓘ",
        radioOn: "◉",
        radioOff: "◯",
        checkboxOn: "☒",
        checkboxOff: "☐",
        checkboxCircleOn: "ⓧ",
        checkboxCircleOff: "Ⓘ",
        pointer: "❯",
        triangleUpOutline: "△",
        triangleLeft: "◀",
        triangleRight: "▶",
        lozenge: "◆",
        lozengeOutline: "◇",
        hamburger: "☰",
        smiley: "㋡",
        mustache: "෴",
        star: "★",
        play: "▶",
        nodejs: "⬢",
        oneSeventh: "⅐",
        oneNinth: "⅑",
        oneTenth: "⅒"
    }, UG3 = {
        tick: "√",
        info: "i",
        warning: "‼",
        cross: "×",
        squareSmall: "□",
        squareSmallFilled: "■",
        circle: "( )",
        circleFilled: "(*)",
        circleDotted: "( )",
        circleDouble: "( )",
        circleCircle: "(○)",
        circleCross: "(×)",
        circlePipe: "(│)",
        radioOn: "(*)",
        radioOff: "( )",
        checkboxOn: "[×]",
        checkboxOff: "[ ]",
        checkboxCircleOn: "(×)",
        checkboxCircleOff: "( )",
        pointer: ">",
        triangleUpOutline: "∆",
        triangleLeft: "◄",
        triangleRight: "►",
        lozenge: "♦",
        lozengeOutline: "◊",
        hamburger: "≡",
        smiley: "☺",
        mustache: "┌─┐",
        star: "✶",
        play: "►",
        nodejs: "♦",
        oneSeventh: "1/7",
        oneNinth: "1/9",
        oneTenth: "1/10"
    }, dG3 = {
        ...aJ7,
        ...sJ7
    }, cG3 = {
        ...aJ7,
        ...UG3
    }, lG3 = Iz8(), iG3 = lG3 ? dG3 : cG3, a6 = iG3, Hk_ = Object.entries(sJ7)
})
// @from(Ln 125480, Col 4)
CY = x((Af3) => {
    var bz8 = Symbol.for("yaml.alias"),
        tJ7 = Symbol.for("yaml.document"),
        jz1 = Symbol.for("yaml.map"),
        eJ7 = Symbol.for("yaml.pair"),
        xz8 = Symbol.for("yaml.scalar"),
        Jz1 = Symbol.for("yaml.seq"),
        KU = Symbol.for("yaml.node.type"),
        nG3 = (A) => !!A && typeof A === "object" && A[KU] === bz8,
        rG3 = (A) => !!A && typeof A === "object" && A[KU] === tJ7,
        oG3 = (A) => !!A && typeof A === "object" && A[KU] === jz1,
        aG3 = (A) => !!A && typeof A === "object" && A[KU] === eJ7,
        AM7 = (A) => !!A && typeof A === "object" && A[KU] === xz8,
        sG3 = (A) => !!A && typeof A === "object" && A[KU] === Jz1;

    function qM7(A) {
        if (A && typeof A === "object") switch (A[KU]) {
            case jz1:
            case Jz1:
                return !0
        }
        return !1
    }

    function tG3(A) {
        if (A && typeof A === "object") switch (A[KU]) {
            case bz8:
            case jz1:
            case xz8:
            case Jz1:
                return !0
        }
        return !1
    }
    var eG3 = (A) => (AM7(A) || qM7(A)) && !!A.anchor;
    Af3.ALIAS = bz8;
    Af3.DOC = tJ7;
    Af3.MAP = jz1;
    Af3.NODE_TYPE = KU;
    Af3.PAIR = eJ7;
    Af3.SCALAR = xz8;
    Af3.SEQ = Jz1;
    Af3.hasAnchor = eG3;
    Af3.isAlias = nG3;
    Af3.isCollection = qM7;
    Af3.isDocument = rG3;
    Af3.isMap = oG3;
    Af3.isNode = tG3;
    Af3.isPair = aG3;
    Af3.isScalar = AM7;
    Af3.isSeq = sG3
})