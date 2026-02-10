
// @from(Ln 232750, Col 4)
dg7 = R((W_w, pg7) => {
    var Cv = d5();
    cY();
    zR();
    vu1();
    pg7.exports = Cv.kem = Cv.kem || {};
    var gg7 = Cv.jsbn.BigInteger;
    Cv.kem.rsa = {};
    Cv.kem.rsa.create = function(A, q) {
        q = q || {};
        var K = q.prng || Cv.random,
            Y = {};
        return Y.encrypt = function(z, w) {
            var H = Math.ceil(z.n.bitLength() / 8),
                $;
            do $ = new gg7(Cv.util.bytesToHex(K.getBytesSync(H)), 16).mod(z.n); while ($.compareTo(gg7.ONE) <= 0);
            $ = Cv.util.hexToBytes($.toString(16));
            var O = H - $.length;
            if (O > 0) $ = Cv.util.fillString(String.fromCharCode(0), O) + $;
            var _ = z.encrypt($, "NONE"),
                J = A.generate($, w);
            return {
                encapsulation: _,
                key: J
            }
        }, Y.decrypt = function(z, w, H) {
            var $ = z.decrypt(w, "NONE");
            return A.generate($, H)
        }, Y
    };
    Cv.kem.kdf1 = function(A, q) {
        Ug7(this, A, 0, q || A.digestLength)
    };
    Cv.kem.kdf2 = function(A, q) {
        Ug7(this, A, 1, q || A.digestLength)
    };

    function Ug7(A, q, K, Y) {
        A.generate = function(z, w) {
            var H = new Cv.util.ByteBuffer,
                $ = Math.ceil(w / Y) + K,
                O = new Cv.util.ByteBuffer;
            for (var _ = K; _ < $; ++_) {
                O.putInt32(_), q.start(), q.update(z + O.getBytes());
                var J = q.digest();
                H.putBytes(J.getBytes(Y))
            }
            return H.truncate(H.length() - w), H.getBytes()
        }
    }
})
// @from(Ln 232801, Col 4)
lg7 = R((G_w, cg7) => {
    var qY = d5();
    cY();
    cg7.exports = qY.log = qY.log || {};
    qY.log.levels = ["none", "error", "warning", "info", "debug", "verbose", "max"];
    var uO6 = {},
        f0A = [],
        Su1 = null;
    qY.log.LEVEL_LOCKED = 2;
    qY.log.NO_LEVEL_CHECK = 4;
    qY.log.INTERPOLATE = 8;
    for (JR = 0; JR < qY.log.levels.length; ++JR) xO6 = qY.log.levels[JR], uO6[xO6] = {
        index: JR,
        name: xO6.toUpperCase()
    };
    var xO6, JR;
    qY.log.logMessage = function(A) {
        var q = uO6[A.level].index;
        for (var K = 0; K < f0A.length; ++K) {
            var Y = f0A[K];
            if (Y.flags & qY.log.NO_LEVEL_CHECK) Y.f(A);
            else {
                var z = uO6[Y.level].index;
                if (q <= z) Y.f(Y, A)
            }
        }
    };
    qY.log.prepareStandard = function(A) {
        if (!("standard" in A)) A.standard = uO6[A.level].name + " [" + A.category + "] " + A.message
    };
    qY.log.prepareFull = function(A) {
        if (!("full" in A)) {
            var q = [A.message];
            q = q.concat([]), A.full = qY.util.format.apply(this, q)
        }
    };
    qY.log.prepareStandardFull = function(A) {
        if (!("standardFull" in A)) qY.log.prepareStandard(A), A.standardFull = A.standard
    };
    bO6 = ["error", "warning", "info", "debug", "verbose"];
    for (JR = 0; JR < bO6.length; ++JR)(function(q) {
        qY.log[q] = function(K, Y) {
            var z = Array.prototype.slice.call(arguments).slice(2),
                w = {
                    timestamp: new Date,
                    level: q,
                    category: K,
                    message: Y,
                    arguments: z
                };
            qY.log.logMessage(w)
        }
    })(bO6[JR]);
    var bO6, JR;
    qY.log.makeLogger = function(A) {
        var q = {
            flags: 0,
            f: A
        };
        return qY.log.setLevel(q, "none"), q
    };
    qY.log.setLevel = function(A, q) {
        var K = !1;
        if (A && !(A.flags & qY.log.LEVEL_LOCKED))
            for (var Y = 0; Y < qY.log.levels.length; ++Y) {
                var z = qY.log.levels[Y];
                if (q == z) {
                    A.level = q, K = !0;
                    break
                }
            }
        return K
    };
    qY.log.lock = function(A, q) {
        if (typeof q > "u" || q) A.flags |= qY.log.LEVEL_LOCKED;
        else A.flags &= ~qY.log.LEVEL_LOCKED
    };
    qY.log.addLogger = function(A) {
        f0A.push(A)
    };
    if (typeof console < "u" && "log" in console) {
        if (console.error && console.warn && console.info && console.debug) V0A = {
            error: console.error,
            warning: console.warn,
            info: console.info,
            debug: console.debug,
            verbose: console.debug
        }, Tj1 = function(A, q) {
            qY.log.prepareStandard(q);
            var K = V0A[q.level],
                Y = [q.standard];
            Y = Y.concat(q.arguments.slice()), K.apply(console, Y)
        }, qK1 = qY.log.makeLogger(Tj1);
        else Tj1 = function(q, K) {
            qY.log.prepareStandardFull(K), console.log(K.standardFull)
        }, qK1 = qY.log.makeLogger(Tj1);
        qY.log.setLevel(qK1, "debug"), qY.log.addLogger(qK1), Su1 = qK1
    } else console = {
        log: function() {}
    };
    var qK1, V0A, Tj1;
    if (Su1 !== null && typeof window < "u" && window.location) {
        if (Nj1 = new URL(window.location.href).searchParams, Nj1.has("console.level")) qY.log.setLevel(Su1, Nj1.get("console.level").slice(-1)[0]);
        if (Nj1.has("console.lock")) {
            if (N0A = Nj1.get("console.lock").slice(-1)[0], N0A == "true") qY.log.lock(Su1)
        }
    }
    var Nj1, N0A;
    qY.log.consoleLogger = Su1
})
// @from(Ln 232911, Col 4)
ng7 = R((Z_w, ig7) => {
    ig7.exports = SB();
    jO6();
    Mj1();
    xDA();
    _0A()
})
// @from(Ln 232918, Col 4)
ag7 = R((f_w, og7) => {
    var a7 = d5();
    ya();
    Zh();
    Nu1();
    Ca();
    nq1();
    rDA();
    zR();
    cY();
    RO6();
    var d6 = a7.asn1,
        yZ = og7.exports = a7.pkcs7 = a7.pkcs7 || {};
    yZ.messageFromPem = function(A) {
        var q = a7.pem.decode(A)[0];
        if (q.type !== "PKCS7") {
            var K = Error('Could not convert PKCS#7 message from PEM; PEM header type is not "PKCS#7".');
            throw K.headerType = q.type, K
        }
        if (q.procType && q.procType.type === "ENCRYPTED") throw Error("Could not convert PKCS#7 message from PEM; PEM is encrypted.");
        var Y = d6.fromDer(q.body);
        return yZ.messageFromAsn1(Y)
    };
    yZ.messageToPem = function(A, q) {
        var K = {
            type: "PKCS7",
            body: d6.toDer(A.toAsn1()).getBytes()
        };
        return a7.pem.encode(K, {
            maxline: q
        })
    };
    yZ.messageFromAsn1 = function(A) {
        var q = {},
            K = [];
        if (!d6.validate(A, yZ.asn1.contentInfoValidator, q, K)) {
            var Y = Error("Cannot read PKCS#7 message. ASN.1 object is not an PKCS#7 ContentInfo.");
            throw Y.errors = K, Y
        }
        var z = d6.derToOid(q.contentType),
            w;
        switch (z) {
            case a7.pki.oids.envelopedData:
                w = yZ.createEnvelopedData();
                break;
            case a7.pki.oids.encryptedData:
                w = yZ.createEncryptedData();
                break;
            case a7.pki.oids.signedData:
                w = yZ.createSignedData();
                break;
            default:
                throw Error("Cannot read PKCS#7 message. ContentType with OID " + z + " is not (yet) supported.")
        }
        return w.fromAsn1(q.content.value[0]), w
    };
    yZ.createSignedData = function() {
        var A = null;
        return A = {
            type: a7.pki.oids.signedData,
            version: 1,
            certificates: [],
            crls: [],
            signers: [],
            digestAlgorithmIdentifiers: [],
            contentInfo: null,
            signerInfos: [],
            fromAsn1: function(Y) {
                if (v0A(A, Y, yZ.asn1.signedDataValidator), A.certificates = [], A.crls = [], A.digestAlgorithmIdentifiers = [], A.contentInfo = null, A.signerInfos = [], A.rawCapture.certificates) {
                    var z = A.rawCapture.certificates.value;
                    for (var w = 0; w < z.length; ++w) A.certificates.push(a7.pki.certificateFromAsn1(z[w]))
                }
            },
            toAsn1: function() {
                if (!A.contentInfo) A.sign();
                var Y = [];
                for (var z = 0; z < A.certificates.length; ++z) Y.push(a7.pki.certificateToAsn1(A.certificates[z]));
                var w = [],
                    H = d6.create(d6.Class.CONTEXT_SPECIFIC, 0, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.INTEGER, !1, d6.integerToDer(A.version).getBytes()), d6.create(d6.Class.UNIVERSAL, d6.Type.SET, !0, A.digestAlgorithmIdentifiers), A.contentInfo])]);
                if (Y.length > 0) H.value[0].value.push(d6.create(d6.Class.CONTEXT_SPECIFIC, 0, !0, Y));
                if (w.length > 0) H.value[0].value.push(d6.create(d6.Class.CONTEXT_SPECIFIC, 1, !0, w));
                return H.value[0].value.push(d6.create(d6.Class.UNIVERSAL, d6.Type.SET, !0, A.signerInfos)), d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.OID, !1, d6.oidToDer(A.type).getBytes()), H])
            },
            addSigner: function(Y) {
                var {
                    issuer: z,
                    serialNumber: w
                } = Y;
                if (Y.certificate) {
                    var H = Y.certificate;
                    if (typeof H === "string") H = a7.pki.certificateFromPem(H);
                    z = H.issuer.attributes, w = H.serialNumber
                }
                var $ = Y.key;
                if (!$) throw Error("Could not add PKCS#7 signer; no private key specified.");
                if (typeof $ === "string") $ = a7.pki.privateKeyFromPem($);
                var O = Y.digestAlgorithm || a7.pki.oids.sha1;
                switch (O) {
                    case a7.pki.oids.sha1:
                    case a7.pki.oids.sha256:
                    case a7.pki.oids.sha384:
                    case a7.pki.oids.sha512:
                    case a7.pki.oids.md5:
                        break;
                    default:
                        throw Error("Could not add PKCS#7 signer; unknown message digest algorithm: " + O)
                }
                var _ = Y.authenticatedAttributes || [];
                if (_.length > 0) {
                    var J = !1,
                        X = !1;
                    for (var D = 0; D < _.length; ++D) {
                        var j = _[D];
                        if (!J && j.type === a7.pki.oids.contentType) {
                            if (J = !0, X) break;
                            continue
                        }
                        if (!X && j.type === a7.pki.oids.messageDigest) {
                            if (X = !0, J) break;
                            continue
                        }
                    }
                    if (!J || !X) throw Error("Invalid signer.authenticatedAttributes. If signer.authenticatedAttributes is specified, then it must contain at least two attributes, PKCS #9 content-type and PKCS #9 message-digest.")
                }
                A.signers.push({
                    key: $,
                    version: 1,
                    issuer: z,
                    serialNumber: w,
                    digestAlgorithm: O,
                    signatureAlgorithm: a7.pki.oids.rsaEncryption,
                    signature: null,
                    authenticatedAttributes: _,
                    unauthenticatedAttributes: []
                })
            },
            sign: function(Y) {
                if (Y = Y || {}, typeof A.content !== "object" || A.contentInfo === null) {
                    if (A.contentInfo = d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.OID, !1, d6.oidToDer(a7.pki.oids.data).getBytes())]), "content" in A) {
                        var z;
                        if (A.content instanceof a7.util.ByteBuffer) z = A.content.bytes();
                        else if (typeof A.content === "string") z = a7.util.encodeUtf8(A.content);
                        if (Y.detached) A.detachedContent = d6.create(d6.Class.UNIVERSAL, d6.Type.OCTETSTRING, !1, z);
                        else A.contentInfo.value.push(d6.create(d6.Class.CONTEXT_SPECIFIC, 0, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.OCTETSTRING, !1, z)]))
                    }
                }
                if (A.signers.length === 0) return;
                var w = q();
                K(w)
            },
            verify: function() {
                throw Error("PKCS#7 signature verification not yet implemented.")
            },
            addCertificate: function(Y) {
                if (typeof Y === "string") Y = a7.pki.certificateFromPem(Y);
                A.certificates.push(Y)
            },
            addCertificateRevokationList: function(Y) {
                throw Error("PKCS#7 CRL support not yet implemented.")
            }
        }, A;

        function q() {
            var Y = {};
            for (var z = 0; z < A.signers.length; ++z) {
                var w = A.signers[z],
                    H = w.digestAlgorithm;
                if (!(H in Y)) Y[H] = a7.md[a7.pki.oids[H]].create();
                if (w.authenticatedAttributes.length === 0) w.md = Y[H];
                else w.md = a7.md[a7.pki.oids[H]].create()
            }
            A.digestAlgorithmIdentifiers = [];
            for (var H in Y) A.digestAlgorithmIdentifiers.push(d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.OID, !1, d6.oidToDer(H).getBytes()), d6.create(d6.Class.UNIVERSAL, d6.Type.NULL, !1, "")]));
            return Y
        }

        function K(Y) {
            var z;
            if (A.detachedContent) z = A.detachedContent;
            else z = A.contentInfo.value[1], z = z.value[0];
            if (!z) throw Error("Could not sign PKCS#7 message; there is no content to sign.");
            var w = d6.derToOid(A.contentInfo.value[0].value),
                H = d6.toDer(z);
            H.getByte(), d6.getBerValueLength(H), H = H.getBytes();
            for (var $ in Y) Y[$].start().update(H);
            var O = new Date;
            for (var _ = 0; _ < A.signers.length; ++_) {
                var J = A.signers[_];
                if (J.authenticatedAttributes.length === 0) {
                    if (w !== a7.pki.oids.data) throw Error("Invalid signer; authenticatedAttributes must be present when the ContentInfo content type is not PKCS#7 Data.")
                } else {
                    J.authenticatedAttributesAsn1 = d6.create(d6.Class.CONTEXT_SPECIFIC, 0, !0, []);
                    var X = d6.create(d6.Class.UNIVERSAL, d6.Type.SET, !0, []);
                    for (var D = 0; D < J.authenticatedAttributes.length; ++D) {
                        var j = J.authenticatedAttributes[D];
                        if (j.type === a7.pki.oids.messageDigest) j.value = Y[J.digestAlgorithm].digest();
                        else if (j.type === a7.pki.oids.signingTime) {
                            if (!j.value) j.value = O
                        }
                        X.value.push(T0A(j)), J.authenticatedAttributesAsn1.value.push(T0A(j))
                    }
                    H = d6.toDer(X).getBytes(), J.md.start().update(H)
                }
                J.signature = J.key.sign(J.md, "RSASSA-PKCS1-V1_5")
            }
            A.signerInfos = wN9(A.signers)
        }
    };
    yZ.createEncryptedData = function() {
        var A = null;
        return A = {
            type: a7.pki.oids.encryptedData,
            version: 0,
            encryptedContent: {
                algorithm: a7.pki.oids["aes256-CBC"]
            },
            fromAsn1: function(q) {
                v0A(A, q, yZ.asn1.encryptedDataValidator)
            },
            decrypt: function(q) {
                if (q !== void 0) A.encryptedContent.key = q;
                rg7(A)
            }
        }, A
    };
    yZ.createEnvelopedData = function() {
        var A = null;
        return A = {
            type: a7.pki.oids.envelopedData,
            version: 0,
            recipients: [],
            encryptedContent: {
                algorithm: a7.pki.oids["aes256-CBC"]
            },
            fromAsn1: function(q) {
                var K = v0A(A, q, yZ.asn1.envelopedDataValidator);
                A.recipients = KN9(K.recipientInfos.value)
            },
            toAsn1: function() {
                return d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.OID, !1, d6.oidToDer(A.type).getBytes()), d6.create(d6.Class.CONTEXT_SPECIFIC, 0, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.INTEGER, !1, d6.integerToDer(A.version).getBytes()), d6.create(d6.Class.UNIVERSAL, d6.Type.SET, !0, YN9(A.recipients)), d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, HN9(A.encryptedContent))])])])
            },
            findRecipient: function(q) {
                var K = q.issuer.attributes;
                for (var Y = 0; Y < A.recipients.length; ++Y) {
                    var z = A.recipients[Y],
                        w = z.issuer;
                    if (z.serialNumber !== q.serialNumber) continue;
                    if (w.length !== K.length) continue;
                    var H = !0;
                    for (var $ = 0; $ < K.length; ++$)
                        if (w[$].type !== K[$].type || w[$].value !== K[$].value) {
                            H = !1;
                            break
                        } if (H) return z
                }
                return null
            },
            decrypt: function(q, K) {
                if (A.encryptedContent.key === void 0 && q !== void 0 && K !== void 0) switch (q.encryptedContent.algorithm) {
                    case a7.pki.oids.rsaEncryption:
                    case a7.pki.oids.desCBC:
                        var Y = K.decrypt(q.encryptedContent.content);
                        A.encryptedContent.key = a7.util.createBuffer(Y);
                        break;
                    default:
                        throw Error("Unsupported asymmetric cipher, OID " + q.encryptedContent.algorithm)
                }
                rg7(A)
            },
            addRecipient: function(q) {
                A.recipients.push({
                    version: 0,
                    issuer: q.issuer.attributes,
                    serialNumber: q.serialNumber,
                    encryptedContent: {
                        algorithm: a7.pki.oids.rsaEncryption,
                        key: q.publicKey
                    }
                })
            },
            encrypt: function(q, K) {
                if (A.encryptedContent.content === void 0) {
                    K = K || A.encryptedContent.algorithm, q = q || A.encryptedContent.key;
                    var Y, z, w;
                    switch (K) {
                        case a7.pki.oids["aes128-CBC"]:
                            Y = 16, z = 16, w = a7.aes.createEncryptionCipher;
                            break;
                        case a7.pki.oids["aes192-CBC"]:
                            Y = 24, z = 16, w = a7.aes.createEncryptionCipher;
                            break;
                        case a7.pki.oids["aes256-CBC"]:
                            Y = 32, z = 16, w = a7.aes.createEncryptionCipher;
                            break;
                        case a7.pki.oids["des-EDE3-CBC"]:
                            Y = 24, z = 8, w = a7.des.createEncryptionCipher;
                            break;
                        default:
                            throw Error("Unsupported symmetric cipher, OID " + K)
                    }
                    if (q === void 0) q = a7.util.createBuffer(a7.random.getBytes(Y));
                    else if (q.length() != Y) throw Error("Symmetric key has wrong length; got " + q.length() + " bytes, expected " + Y + ".");
                    A.encryptedContent.algorithm = K, A.encryptedContent.key = q, A.encryptedContent.parameter = a7.util.createBuffer(a7.random.getBytes(z));
                    var H = w(q);
                    if (H.start(A.encryptedContent.parameter.copy()), H.update(A.content), !H.finish()) throw Error("Symmetric encryption failed.");
                    A.encryptedContent.content = H.output
                }
                for (var $ = 0; $ < A.recipients.length; ++$) {
                    var O = A.recipients[$];
                    if (O.encryptedContent.content !== void 0) continue;
                    switch (O.encryptedContent.algorithm) {
                        case a7.pki.oids.rsaEncryption:
                            O.encryptedContent.content = O.encryptedContent.key.encrypt(A.encryptedContent.key.data);
                            break;
                        default:
                            throw Error("Unsupported asymmetric cipher, OID " + O.encryptedContent.algorithm)
                    }
                }
            }
        }, A
    };

    function AN9(A) {
        var q = {},
            K = [];
        if (!d6.validate(A, yZ.asn1.recipientInfoValidator, q, K)) {
            var Y = Error("Cannot read PKCS#7 RecipientInfo. ASN.1 object is not an PKCS#7 RecipientInfo.");
            throw Y.errors = K, Y
        }
        return {
            version: q.version.charCodeAt(0),
            issuer: a7.pki.RDNAttributesAsArray(q.issuer),
            serialNumber: a7.util.createBuffer(q.serial).toHex(),
            encryptedContent: {
                algorithm: d6.derToOid(q.encAlgorithm),
                parameter: q.encParameter ? q.encParameter.value : void 0,
                content: q.encKey
            }
        }
    }

    function qN9(A) {
        return d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.INTEGER, !1, d6.integerToDer(A.version).getBytes()), d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, [a7.pki.distinguishedNameToAsn1({
            attributes: A.issuer
        }), d6.create(d6.Class.UNIVERSAL, d6.Type.INTEGER, !1, a7.util.hexToBytes(A.serialNumber))]), d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.OID, !1, d6.oidToDer(A.encryptedContent.algorithm).getBytes()), d6.create(d6.Class.UNIVERSAL, d6.Type.NULL, !1, "")]), d6.create(d6.Class.UNIVERSAL, d6.Type.OCTETSTRING, !1, A.encryptedContent.content)])
    }

    function KN9(A) {
        var q = [];
        for (var K = 0; K < A.length; ++K) q.push(AN9(A[K]));
        return q
    }

    function YN9(A) {
        var q = [];
        for (var K = 0; K < A.length; ++K) q.push(qN9(A[K]));
        return q
    }

    function zN9(A) {
        var q = d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.INTEGER, !1, d6.integerToDer(A.version).getBytes()), d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, [a7.pki.distinguishedNameToAsn1({
            attributes: A.issuer
        }), d6.create(d6.Class.UNIVERSAL, d6.Type.INTEGER, !1, a7.util.hexToBytes(A.serialNumber))]), d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.OID, !1, d6.oidToDer(A.digestAlgorithm).getBytes()), d6.create(d6.Class.UNIVERSAL, d6.Type.NULL, !1, "")])]);
        if (A.authenticatedAttributesAsn1) q.value.push(A.authenticatedAttributesAsn1);
        if (q.value.push(d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.OID, !1, d6.oidToDer(A.signatureAlgorithm).getBytes()), d6.create(d6.Class.UNIVERSAL, d6.Type.NULL, !1, "")])), q.value.push(d6.create(d6.Class.UNIVERSAL, d6.Type.OCTETSTRING, !1, A.signature)), A.unauthenticatedAttributes.length > 0) {
            var K = d6.create(d6.Class.CONTEXT_SPECIFIC, 1, !0, []);
            for (var Y = 0; Y < A.unauthenticatedAttributes.length; ++Y) {
                var z = A.unauthenticatedAttributes[Y];
                K.values.push(T0A(z))
            }
            q.value.push(K)
        }
        return q
    }

    function wN9(A) {
        var q = [];
        for (var K = 0; K < A.length; ++K) q.push(zN9(A[K]));
        return q
    }

    function T0A(A) {
        var q;
        if (A.type === a7.pki.oids.contentType) q = d6.create(d6.Class.UNIVERSAL, d6.Type.OID, !1, d6.oidToDer(A.value).getBytes());
        else if (A.type === a7.pki.oids.messageDigest) q = d6.create(d6.Class.UNIVERSAL, d6.Type.OCTETSTRING, !1, A.value.bytes());
        else if (A.type === a7.pki.oids.signingTime) {
            var K = new Date("1950-01-01T00:00:00Z"),
                Y = new Date("2050-01-01T00:00:00Z"),
                z = A.value;
            if (typeof z === "string") {
                var w = Date.parse(z);
                if (!isNaN(w)) z = new Date(w);
                else if (z.length === 13) z = d6.utcTimeToDate(z);
                else z = d6.generalizedTimeToDate(z)
            }
            if (z >= K && z < Y) q = d6.create(d6.Class.UNIVERSAL, d6.Type.UTCTIME, !1, d6.dateToUtcTime(z));
            else q = d6.create(d6.Class.UNIVERSAL, d6.Type.GENERALIZEDTIME, !1, d6.dateToGeneralizedTime(z))
        }
        return d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.OID, !1, d6.oidToDer(A.type).getBytes()), d6.create(d6.Class.UNIVERSAL, d6.Type.SET, !0, [q])])
    }

    function HN9(A) {
        return [d6.create(d6.Class.UNIVERSAL, d6.Type.OID, !1, d6.oidToDer(a7.pki.oids.data).getBytes()), d6.create(d6.Class.UNIVERSAL, d6.Type.SEQUENCE, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.OID, !1, d6.oidToDer(A.algorithm).getBytes()), !A.parameter ? void 0 : d6.create(d6.Class.UNIVERSAL, d6.Type.OCTETSTRING, !1, A.parameter.getBytes())]), d6.create(d6.Class.CONTEXT_SPECIFIC, 0, !0, [d6.create(d6.Class.UNIVERSAL, d6.Type.OCTETSTRING, !1, A.content.getBytes())])]
    }

    function v0A(A, q, K) {
        var Y = {},
            z = [];
        if (!d6.validate(q, K, Y, z)) {
            var w = Error("Cannot read PKCS#7 message. ASN.1 object is not a supported PKCS#7 message.");
            throw w.errors = w, w
        }
        var H = d6.derToOid(Y.contentType);
        if (H !== a7.pki.oids.data) throw Error("Unsupported PKCS#7 message. Only wrapped ContentType Data supported.");
        if (Y.encryptedContent) {
            var $ = "";
            if (a7.util.isArray(Y.encryptedContent))
                for (var O = 0; O < Y.encryptedContent.length; ++O) {
                    if (Y.encryptedContent[O].type !== d6.Type.OCTETSTRING) throw Error("Malformed PKCS#7 message, expecting encrypted content constructed of only OCTET STRING objects.");
                    $ += Y.encryptedContent[O].value
                } else $ = Y.encryptedContent;
            A.encryptedContent = {
                algorithm: d6.derToOid(Y.encAlgorithm),
                parameter: a7.util.createBuffer(Y.encParameter.value),
                content: a7.util.createBuffer($)
            }
        }
        if (Y.content) {
            var $ = "";
            if (a7.util.isArray(Y.content))
                for (var O = 0; O < Y.content.length; ++O) {
                    if (Y.content[O].type !== d6.Type.OCTETSTRING) throw Error("Malformed PKCS#7 message, expecting content constructed of only OCTET STRING objects.");
                    $ += Y.content[O].value
                } else $ = Y.content;
            A.content = a7.util.createBuffer($)
        }
        return A.version = Y.version.charCodeAt(0), A.rawCapture = Y, Y
    }

    function rg7(A) {
        if (A.encryptedContent.key === void 0) throw Error("Symmetric key not available.");
        if (A.content === void 0) {
            var q;
            switch (A.encryptedContent.algorithm) {
                case a7.pki.oids["aes128-CBC"]:
                case a7.pki.oids["aes192-CBC"]:
                case a7.pki.oids["aes256-CBC"]:
                    q = a7.aes.createDecryptionCipher(A.encryptedContent.key);
                    break;
                case a7.pki.oids.desCBC:
                case a7.pki.oids["des-EDE3-CBC"]:
                    q = a7.des.createDecryptionCipher(A.encryptedContent.key);
                    break;
                default:
                    throw Error("Unsupported symmetric cipher, OID " + A.encryptedContent.algorithm)
            }
            if (q.start(A.encryptedContent.parameter), q.update(A.encryptedContent.content), !q.finish()) throw Error("Symmetric decryption failed.");
            A.content = q.output
        }
    }
})
// @from(Ln 233379, Col 4)
tg7 = R((V_w, sg7) => {
    var BX = d5();
    ya();
    Jj1();
    jO6();
    Mj1();
    cY();
    var mO6 = sg7.exports = BX.ssh = BX.ssh || {};
    mO6.privateKeyToPutty = function(A, q, K) {
        K = K || "", q = q || "";
        var Y = "ssh-rsa",
            z = q === "" ? "none" : "aes256-cbc",
            w = "PuTTY-User-Key-File-2: " + Y + `\r
`;
        w += "Encryption: " + z + `\r
`, w += "Comment: " + K + `\r
`;
        var H = BX.util.createBuffer();
        vj1(H, Y), FB(H, A.e), FB(H, A.n);
        var $ = BX.util.encode64(H.bytes(), 64),
            O = Math.floor($.length / 66) + 1;
        w += "Public-Lines: " + O + `\r
`, w += $;
        var _ = BX.util.createBuffer();
        FB(_, A.d), FB(_, A.p), FB(_, A.q), FB(_, A.qInv);
        var J;
        if (!q) J = BX.util.encode64(_.bytes(), 64);
        else {
            var X = _.length() + 16 - 1;
            X -= X % 16;
            var D = BO6(_.bytes());
            D.truncate(D.length() - X + _.length()), _.putBuffer(D);
            var j = BX.util.createBuffer();
            j.putBuffer(BO6("\x00\x00\x00\x00", q)), j.putBuffer(BO6("\x00\x00\x00\x01", q));
            var M = BX.aes.createEncryptionCipher(j.truncate(8), "CBC");
            M.start(BX.util.createBuffer().fillWithByte(0, 16)), M.update(_.copy()), M.finish();
            var P = M.output;
            P.truncate(16), J = BX.util.encode64(P.bytes(), 64)
        }
        O = Math.floor(J.length / 66) + 1, w += `\r
Private-Lines: ` + O + `\r
`, w += J;
        var W = BO6("putty-private-key-file-mac-key", q),
            G = BX.util.createBuffer();
        vj1(G, Y), vj1(G, z), vj1(G, K), G.putInt32(H.length()), G.putBuffer(H), G.putInt32(_.length()), G.putBuffer(_);
        var f = BX.hmac.create();
        return f.start("sha1", W), f.update(G.bytes()), w += `\r
Private-MAC: ` + f.digest().toHex() + `\r
`, w
    };
    mO6.publicKeyToOpenSSH = function(A, q) {
        var K = "ssh-rsa";
        q = q || "";
        var Y = BX.util.createBuffer();
        return vj1(Y, K), FB(Y, A.e), FB(Y, A.n), K + " " + BX.util.encode64(Y.bytes()) + " " + q
    };
    mO6.privateKeyToOpenSSH = function(A, q) {
        if (!q) return BX.pki.privateKeyToPem(A);
        return BX.pki.encryptRsaPrivateKey(A, q, {
            legacy: !0,
            algorithm: "aes128"
        })
    };
    mO6.getPublicKeyFingerprint = function(A, q) {
        q = q || {};
        var K = q.md || BX.md.md5.create(),
            Y = "ssh-rsa",
            z = BX.util.createBuffer();
        vj1(z, Y), FB(z, A.e), FB(z, A.n), K.start(), K.update(z.getBytes());
        var w = K.digest();
        if (q.encoding === "hex") {
            var H = w.toHex();
            if (q.delimiter) return H.match(/.{2}/g).join(q.delimiter);
            return H
        } else if (q.encoding === "binary") return w.getBytes();
        else if (q.encoding) throw Error('Unknown encoding "' + q.encoding + '".');
        return w
    };

    function FB(A, q) {
        var K = q.toString(16);
        if (K[0] >= "8") K = "00" + K;
        var Y = BX.util.hexToBytes(K);
        A.putInt32(Y.length), A.putBytes(Y)
    }

    function vj1(A, q) {
        A.putInt32(q.length), A.putString(q)
    }

    function BO6() {
        var A = BX.md.sha1.create(),
            q = arguments.length;
        for (var K = 0; K < q; ++K) A.update(arguments[K]);
        return A.digest()
    }
})
// @from(Ln 233476, Col 4)
AU7 = R((N_w, eg7) => {
    eg7.exports = d5();
    ya();
    Tg7();
    Zh();
    HO6();
    Nu1();
    Qg7();
    Jj1();
    dg7();
    lg7();
    ng7();
    oDA();
    GO6();
    nq1();
    pDA();
    tDA();
    ag7();
    A0A();
    cDA();
    bDA();
    EO6();
    zR();
    mDA();
    tg7();
    H0A();
    cY()
})
// @from(Ln 233510, Col 4)
ON9
// @from(Ln 233510, Col 9)
E_w
// @from(Ln 233511, Col 4)
E0A = v(() => {
    ON9 = o(AU7(), 1), E_w = _N9($N9)
})
// @from(Ln 233514, Col 4)
k0A = v(() => {
    E0A()
})
// @from(Ln 233517, Col 4)
qU7
// @from(Ln 233517, Col 9)
XN9
// @from(Ln 233517, Col 14)
DN9
// @from(Ln 233517, Col 19)
jN9
// @from(Ln 233517, Col 24)
MN9
// @from(Ln 233517, Col 29)
PN9
// @from(Ln 233517, Col 34)
WN9
// @from(Ln 233517, Col 39)
GN9
// @from(Ln 233517, Col 44)
ZN9
// @from(Ln 233517, Col 49)
fN9
// @from(Ln 233517, Col 54)
h_w
// @from(Ln 233517, Col 59)
VN9
// @from(Ln 233517, Col 64)
I_w
// @from(Ln 233518, Col 4)
KU7 = v(() => {
    R_1();
    qU7 = Av({
        command: g8(),
        args: N_(g8()).optional(),
        env: zS(g8(), g8()).optional()
    }), XN9 = Av({
        name: g8(),
        email: g8().email().optional(),
        url: g8().url().optional()
    }), DN9 = Av({
        type: g8(),
        url: g8().url()
    }), jN9 = qU7.partial(), MN9 = qU7.extend({
        platform_overrides: zS(g8(), jN9).optional()
    }), PN9 = Av({
        type: wS(["python", "node", "binary"]),
        entry_point: g8(),
        mcp_config: MN9
    }), WN9 = Av({
        claude_desktop: g8().optional(),
        platforms: N_(wS(["darwin", "win32", "linux"])).optional(),
        runtimes: Av({
            python: g8().optional(),
            node: g8().optional()
        }).optional()
    }).passthrough(), GN9 = Av({
        name: g8(),
        description: g8().optional()
    }), ZN9 = Av({
        name: g8(),
        description: g8().optional(),
        arguments: N_(g8()).optional(),
        text: g8()
    }), fN9 = Av({
        type: wS(["string", "number", "boolean", "directory", "file"]),
        title: g8(),
        description: g8(),
        required: u0().optional(),
        default: a81([g8(), _L(), u0(), N_(g8())]).optional(),
        multiple: u0().optional(),
        sensitive: u0().optional(),
        min: _L().optional(),
        max: _L().optional()
    }), h_w = zS(g8(), a81([g8(), _L(), u0(), N_(g8())])), VN9 = Av({
        $schema: g8().optional(),
        dxt_version: g8().optional().describe("@deprecated Use manifest_version instead"),
        manifest_version: g8().optional(),
        name: g8(),
        display_name: g8().optional(),
        version: g8(),
        description: g8(),
        long_description: g8().optional(),
        author: XN9,
        repository: DN9.optional(),
        homepage: g8().url().optional(),
        documentation: g8().url().optional(),
        support: g8().url().optional(),
        icon: g8().optional(),
        screenshots: N_(g8()).optional(),
        server: PN9,
        tools: N_(GN9).optional(),
        tools_generated: u0().optional(),
        prompts: N_(ZN9).optional(),
        prompts_generated: u0().optional(),
        keywords: N_(g8()).optional(),
        license: g8().optional(),
        compatibility: WN9.optional(),
        user_config: zS(g8(), fN9).optional()
    }).refine((A) => !!(A.dxt_version || A.manifest_version), {
        message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
    }), I_w = Av({
        status: wS(["signed", "unsigned", "self-signed"]),
        publisher: g8().optional(),
        issuer: g8().optional(),
        valid_from: g8().optional(),
        valid_to: g8().optional(),
        fingerprint: g8().optional()
    })
})
// @from(Ln 233598, Col 4)
NN9
// @from(Ln 233598, Col 9)
TN9
// @from(Ln 233599, Col 4)
L0A = v(() => {
    k0A();
    ob1();
    KU7();
    NN9 = o(QF7(), 1), TN9 = o(pF7(), 1)
})
// @from(Ln 233605, Col 4)
YU7 = v(() => {
    dXA();
    L0A();
    ob1();
    xXA()
})
// @from(Ln 233612, Col 0)
function R0A(A, q) {
    if (typeof A === "string") {
        let K = A;
        for (let [Y, z] of Object.entries(q)) {
            let w = new RegExp(`\\$\\{${Y}\\}`, "g");
            if (K.match(w))
                if (Array.isArray(z)) console.warn(`Cannot replace ${Y} with array value in string context: "${A}"`, {
                    key: Y,
                    replacement: z
                });
                else K = K.replace(w, z)
        }
        return K
    } else if (Array.isArray(A)) {
        let K = [];
        for (let Y of A)
            if (typeof Y === "string" && Y.match(/^\$\{user_config\.[^}]+\}$/)) {
                let z = Y.match(/^\$\{([^}]+)\}$/)?.[1];
                if (z && q[z]) {
                    let w = q[z];
                    if (Array.isArray(w)) K.push(...w);
                    else K.push(w)
                } else K.push(Y)
            } else K.push(R0A(Y, q));
        return K
    } else if (A && typeof A === "object") {
        let K = {};
        for (let [Y, z] of Object.entries(A)) K[Y] = R0A(z, q);
        return K
    }
    return A
}
// @from(Ln 233644, Col 0)
async function FO6(A) {
    let {
        manifest: q,
        extensionPath: K,
        systemDirs: Y,
        userConfig: z,
        pathSeparator: w,
        logger: H
    } = A, $ = q.server?.mcp_config;
    if (!$) return;
    let O = {
        ...$
    };
    if ($.platform_overrides) {
        if (process.platform in $.platform_overrides) {
            let X = $.platform_overrides[process.platform];
            O.command = X.command || O.command, O.args = X.args || O.args, O.env = X.env || O.env
        }
    }
    if (vN9({
            manifest: q,
            userConfig: z
        })) {
        H?.warn(`Extension ${q.name} has missing required configuration, skipping MCP config`);
        return
    }
    let _ = {
            __dirname: K,
            pathSeparator: w,
            "/": w,
            ...Y
        },
        J = {};
    if (q.user_config) {
        for (let [X, D] of Object.entries(q.user_config))
            if (D.default !== void 0) J[X] = D.default
    }
    if (z) Object.assign(J, z);
    for (let [X, D] of Object.entries(J)) {
        let j = `user_config.${X}`;
        if (Array.isArray(D)) _[j] = D.map(String);
        else if (typeof D === "boolean") _[j] = D ? "true" : "false";
        else _[j] = String(D)
    }
    return O = R0A(O, _), O
}
// @from(Ln 233691, Col 0)
function zU7(A) {
    return A === void 0 || A === null || A === ""
}
// @from(Ln 233695, Col 0)
function vN9({
    manifest: A,
    userConfig: q
}) {
    if (!A.user_config) return !1;
    let K = q || {};
    for (let [Y, z] of Object.entries(A.user_config))
        if (z.required) {
            let w = K[Y];
            if (zU7(w) || Array.isArray(w) && (w.length === 0 || w.some(zU7))) return !0
        } return !1
}
// @from(Ln 233707, Col 4)
wU7 = () => {}
// @from(Ln 233708, Col 4)
y0A = v(() => {
    xXA();
    YU7();
    k0A();
    dXA();
    E0A();
    L0A();
    ob1();
    wU7()
})
// @from(Ln 233719, Col 0)
function EN9(A) {
    let q = b$6.safeParse(A);
    if (!q.success) {
        let K = q.error.flatten(),
            Y = [...Object.entries(K.fieldErrors).map(([z, w]) => `${z}: ${w?.join(", ")}`), ...K.formErrors || []].filter(Boolean).join("; ");
        throw Error(`Invalid manifest: ${Y}`)
    }
    return q.data
}
// @from(Ln 233729, Col 0)
function kN9(A) {
    let q;
    try {
        q = _A(A)
    } catch (K) {
        throw Error(`Invalid JSON in manifest.json: ${K instanceof Error?K.message:String(K)}`)
    }
    return EN9(q)
}
// @from(Ln 233739, Col 0)
function C0A(A) {
    let q = new TextDecoder().decode(A);
    return kN9(q)
}
// @from(Ln 233743, Col 4)
HU7 = v(() => {
    y0A();
    m6()
})
// @from(Ln 233749, Col 0)
function LN9(A) {
    if (p61(A)) return !1;
    let q = QO6.normalize(A);
    if (QO6.isAbsolute(q)) return !1;
    return !0
}
// @from(Ln 233756, Col 0)
function RN9(A, q) {
    q.fileCount++;
    let K;
    if (q.fileCount > ma.MAX_FILE_COUNT) K = `Archive contains too many files: ${q.fileCount} (max: ${ma.MAX_FILE_COUNT})`;
    if (!LN9(A.name)) K = `Unsafe file path detected: "${A.name}". Path traversal or absolute paths are not allowed.`;
    let Y = A.originalSize || 0;
    if (Y > ma.MAX_FILE_SIZE) K = `File "${A.name}" is too large: ${Math.round(Y/1024/1024)}MB (max: ${Math.round(ma.MAX_FILE_SIZE/1024/1024)}MB)`;
    if (q.totalUncompressedSize += Y, q.totalUncompressedSize > ma.MAX_TOTAL_SIZE) K = `Archive total size is too large: ${Math.round(q.totalUncompressedSize/1024/1024)}MB (max: ${Math.round(ma.MAX_TOTAL_SIZE/1024/1024)}MB)`;
    let z = q.totalUncompressedSize / q.compressedSize;
    if (z > ma.MAX_COMPRESSION_RATIO) K = `Suspicious compression ratio detected: ${z.toFixed(1)}:1 (max: ${ma.MAX_COMPRESSION_RATIO}:1). This may be a zip bomb.`;
    return K ? {
        isValid: !1,
        error: K
    } : {
        isValid: !0
    }
}
// @from(Ln 233774, Col 0)
function $U7(A) {
    let q = b1();
    if (!q.existsSync(A)) throw Error(`Zip file does not exist: ${A}`);
    try {
        let K = q.readFileBytesSync(A),
            z = {
                fileCount: 0,
                totalUncompressedSize: 0,
                compressedSize: K.length,
                errors: []
            },
            w = fb7(new Uint8Array(K), {
                filter: (H) => {
                    let $ = RN9(H, z);
                    if (!$.isValid) throw Error($.error);
                    return !0
                }
            });
        return h(`Zip extraction completed: ${z.fileCount} files, ${Math.round(z.totalUncompressedSize/1024)}KB uncompressed`), w
    } catch (K) {
        let Y = K instanceof Error ? K.message : String(K);
        throw Error(`Failed to read or unzip file: ${Y}`)
    }
}
// @from(Ln 233798, Col 4)
ma
// @from(Ln 233799, Col 4)
OU7 = v(() => {
    Vb7();
    Z6();
    _8();
    Ez();
    ma = {
        MAX_FILE_SIZE: 536870912,
        MAX_TOTAL_SIZE: 1073741824,
        MAX_FILE_COUNT: 1e5,
        MAX_COMPRESSION_RATIO: 50,
        MIN_COMPRESSION_RATIO: 0.5
    }
})
// @from(Ln 233815, Col 0)
function gO6(A) {
    let q = A?.platform ?? eA(),
        K = A?.homedir ?? _U7.homedir(),
        Y = A?.env ?? process.env,
        z = {
            HOME: K,
            DESKTOP: KK1.join(K, "Desktop"),
            DOCUMENTS: KK1.join(K, "Documents"),
            DOWNLOADS: KK1.join(K, "Downloads")
        };
    switch (q) {
        case "windows": {
            let w = Y.USERPROFILE || K;
            return {
                HOME: K,
                DESKTOP: KK1.join(w, "Desktop"),
                DOCUMENTS: KK1.join(w, "Documents"),
                DOWNLOADS: KK1.join(w, "Downloads")
            }
        }
        case "linux":
        case "wsl":
            return {
                HOME: K, DESKTOP: Y.XDG_DESKTOP_DIR || z.DESKTOP, DOCUMENTS: Y.XDG_DOCUMENTS_DIR || z.DOCUMENTS, DOWNLOADS: Y.XDG_DOWNLOAD_DIR || z.DOWNLOADS
            };
        case "macos":
        default: {
            if (q === "unknown") h("Unknown platform detected, using default paths");
            return z
        }
    }
}
// @from(Ln 233847, Col 4)
JU7 = v(() => {
    x3();
    Z6()
})
// @from(Ln 233859, Col 0)
function XR(A) {
    return A.endsWith(".mcpb") || A.endsWith(".dxt")
}
// @from(Ln 233863, Col 0)
function PU7(A) {
    return A.startsWith("http://") || A.startsWith("https://")
}
// @from(Ln 233867, Col 0)
function CN9(A) {
    return h0A("sha256").update(A).digest("hex").substring(0, 16)
}
// @from(Ln 233871, Col 0)
function WU7(A) {
    return Fa(A, ".mcpb-cache")
}
// @from(Ln 233875, Col 0)
function GU7(A, q) {
    let K = h0A("md5").update(q).digest("hex").substring(0, 8);
    return Fa(A, `${K}.metadata.json`)
}
// @from(Ln 233880, Col 0)
function XU7(A, q) {
    try {
        let Y = C8().pluginConfigs?.[A]?.mcpServers?.[q];
        if (!Y) return null;
        return h(`Loaded user config for ${A}/${q} from settings`), Y
    } catch (K) {
        let Y = K instanceof Error ? K : Error(String(K));
        return K1(Y), h(`Failed to load user config for ${A}/${q}: ${K}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 233893, Col 0)
function DU7(A, q, K) {
    try {
        let Y = C8();
        if (!Y.pluginConfigs) Y.pluginConfigs = {};
        if (!Y.pluginConfigs[A]) Y.pluginConfigs[A] = {};
        if (!Y.pluginConfigs[A].mcpServers) Y.pluginConfigs[A].mcpServers = {};
        Y.pluginConfigs[A].mcpServers[q] = K;
        let z = Z7("userSettings", Y);
        if (z.error) throw z.error;
        h(`Saved user config for ${A}/${q} to user settings`)
    } catch (Y) {
        let z = Y instanceof Error ? Y : Error(String(Y));
        throw K1(z), Error(`Failed to save user configuration for ${A}/${q}: ${z.message}`)
    }
}
// @from(Ln 233909, Col 0)
function jU7(A, q) {
    let K = [];
    for (let [Y, z] of Object.entries(q)) {
        let w = A[Y];
        if (z.required && (w === void 0 || w === "")) {
            K.push(`${z.title||Y} is required but not provided`);
            continue
        }
        if (w === void 0 || w === "") continue;
        if (z.type === "string") {
            if (Array.isArray(w)) {
                if (!z.multiple) K.push(`${z.title||Y} must be a string, not an array`);
                else if (!w.every((H) => typeof H === "string")) K.push(`${z.title||Y} must be an array of strings`)
            } else if (typeof w !== "string") K.push(`${z.title||Y} must be a string`)
        } else if (z.type === "number" && typeof w !== "number") K.push(`${z.title||Y} must be a number`);
        else if (z.type === "boolean" && typeof w !== "boolean") K.push(`${z.title||Y} must be a boolean`);
        else if ((z.type === "file" || z.type === "directory") && typeof w !== "string") K.push(`${z.title||Y} must be a path string`);
        if (z.type === "number" && typeof w === "number") {
            if (z.min !== void 0 && w < z.min) K.push(`${z.title||Y} must be at least ${z.min}`);
            if (z.max !== void 0 && w > z.max) K.push(`${z.title||Y} must be at most ${z.max}`)
        }
    }
    return {
        valid: K.length === 0,
        errors: K
    }
}
// @from(Ln 233936, Col 0)
async function MU7(A, q) {
    let K = await FO6({
        manifest: A,
        extensionPath: q,
        systemDirs: gO6(),
        userConfig: {},
        pathSeparator: "/"
    });
    if (!K) {
        let Y = Error(`Failed to generate MCP server configuration from manifest "${A.name}"`);
        throw K1(Y), Y
    }
    return K
}
// @from(Ln 233950, Col 0)
async function ZU7(A, q) {
    let K = b1(),
        Y = GU7(A, q);
    if (!K.existsSync(Y)) return null;
    try {
        let z = K.readFileSync(Y, {
            encoding: "utf-8"
        });
        return _A(z)
    } catch (z) {
        let w = z instanceof Error ? z : Error(String(z));
        return K1(w), h(`Failed to load MCPB cache metadata: ${z}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 233966, Col 0)
async function S0A(A, q, K) {
    let Y = b1(),
        z = GU7(A, q);
    Y.mkdirSync(A), c8(z, Q1(K, null, 2), "utf-8")
}
// @from(Ln 233971, Col 0)
async function SN9(A, q, K) {
    if (h(`Downloading MCPB from ${A}`), K) K(`Downloading ${A}...`);
    try {
        let Y = await sA.get(A, {
                timeout: 120000,
                responseType: "arraybuffer",
                maxRedirects: 5,
                onDownloadProgress: (w) => {
                    if (w.total && K) {
                        let H = Math.round(w.loaded / w.total * 100);
                        K(`Downloading... ${H}%`)
                    }
                }
            }),
            z = new Uint8Array(Y.data);
        if (c8(q, Buffer.from(z)), h(`Downloaded ${z.length} bytes to ${q}`), K) K("Download complete");
        return z
    } catch (Y) {
        let z = Y instanceof Error ? Y.message : String(Y),
            w = Error(`Failed to download MCPB file from ${A}: ${z}`);
        throw K1(w), w
    }
}
// @from(Ln 233994, Col 0)
async function hN9(A, q, K) {
    let Y = b1();
    if (K) K("Extracting files...");
    Y.mkdirSync(q);
    let z = 0,
        w = Object.keys(A).length;
    for (let [H, $] of Object.entries(A)) {
        let O = Fa(q, H),
            _ = yN9(O);
        if (_ !== q && !Y.existsSync(_)) Y.mkdirSync(_);
        if (H.endsWith(".json") || H.endsWith(".js") || H.endsWith(".ts") || H.endsWith(".txt") || H.endsWith(".md") || H.endsWith(".yml") || H.endsWith(".yaml")) {
            let X = new TextDecoder().decode($);
            c8(O, X, "utf-8")
        } else c8(O, Buffer.from($));
        if (z++, K && z % 10 === 0) K(`Extracted ${z}/${w} files`)
    }
    if (h(`Extracted ${z} files to ${q}`), K) K(`Extraction complete (${z} files)`)
}
// @from(Ln 234012, Col 0)
async function IN9(A, q) {
    let K = b1(),
        Y = WU7(q),
        z = await ZU7(Y, A);
    if (!z) return !0;
    if (!K.existsSync(z.extractedPath)) return h(`MCPB extraction path missing: ${z.extractedPath}`), !0;
    if (!PU7(A)) {
        let w = Fa(q, A);
        if (!K.existsSync(w)) return h(`MCPB source file missing: ${w}`), !0;
        let H = K.statSync(w),
            $ = new Date(z.cachedAt).getTime(),
            O = H.mtimeMs;
        if (O > $) return h(`MCPB file modified: ${new Date(O)} > ${new Date($)}`), !0
    }
    return !1
}
// @from(Ln 234028, Col 0)
async function hu1(A, q, K, Y, z, w) {
    let H = b1(),
        $ = WU7(q);
    H.mkdirSync($), h(`Loading MCPB from source: ${A}`);
    let O = await ZU7($, A);
    if (O && !await IN9(A, q)) {
        h(`Using cached MCPB from ${O.extractedPath} (hash: ${O.contentHash})`);
        let f = Fa(O.extractedPath, "manifest.json");
        if (!H.existsSync(f)) {
            let y = Error(`Cached manifest not found: ${f}`);
            throw K1(y), y
        }
        let Z = H.readFileSync(f, {
                encoding: "utf-8"
            }),
            N = new TextEncoder().encode(Z),
            T = C0A(N);
        if (T.user_config && Object.keys(T.user_config).length > 0) {
            let y = T.name,
                B = XU7(K, y),
                S = z || B || {},
                m = jU7(S, T.user_config);
            if (w || !m.valid) return {
                status: "needs-config",
                manifest: T,
                extractedPath: O.extractedPath,
                contentHash: O.contentHash,
                configSchema: T.user_config,
                existingConfig: B || {},
                validationErrors: m.valid ? [] : m.errors
            };
            if (z) DU7(K, y, z);
            let b = await FO6({
                manifest: T,
                extensionPath: O.extractedPath,
                systemDirs: gO6(),
                userConfig: S,
                pathSeparator: "/"
            });
            if (!b) {
                let g = Error(`Failed to generate MCP server configuration from manifest "${T.name}"`);
                throw K1(g), g
            }
            return {
                manifest: T,
                mcpConfig: b,
                extractedPath: O.extractedPath,
                contentHash: O.contentHash
            }
        }
        let k = await MU7(T, O.extractedPath);
        return {
            manifest: T,
            mcpConfig: k,
            extractedPath: O.extractedPath,
            contentHash: O.contentHash
        }
    }
    let _, J;
    if (PU7(A)) {
        let f = h0A("md5").update(A).digest("hex").substring(0, 8);
        J = Fa($, `${f}.mcpb`), _ = await SN9(A, J, Y)
    } else {
        let f = Fa(q, A);
        if (!H.existsSync(f)) {
            let Z = Error(`MCPB file not found: ${f}`);
            throw K1(Z), Z
        }
        if (Y) Y(`Loading ${A}...`);
        _ = H.readFileBytesSync(f), J = f
    }
    let X = CN9(_);
    if (h(`MCPB content hash: ${X}`), Y) Y("Extracting MCPB archive...");
    let D = $U7(J),
        j = D["manifest.json"];
    if (!j) {
        let f = Error("No manifest.json found in MCPB file");
        throw K1(f), f
    }
    let M = C0A(j);
    if (h(`MCPB manifest: ${M.name} v${M.version} by ${M.author.name}`), !M.server) {
        let f = Error(`MCPB manifest for "${M.name}" does not define a server configuration`);
        throw K1(f), f
    }
    let P = Fa($, X);
    if (await hN9(D, P, Y), M.user_config && Object.keys(M.user_config).length > 0) {
        let f = M.name,
            Z = XU7(K, f),
            N = z || Z || {},
            T = jU7(N, M.user_config);
        if (!T.valid) {
            let B = {
                source: A,
                contentHash: X,
                extractedPath: P,
                cachedAt: new Date().toISOString(),
                lastChecked: new Date().toISOString()
            };
            return await S0A($, A, B), {
                status: "needs-config",
                manifest: M,
                extractedPath: P,
                contentHash: X,
                configSchema: M.user_config,
                existingConfig: Z || {},
                validationErrors: T.errors
            }
        }
        if (z) DU7(K, f, z);
        if (Y) Y("Generating MCP server configuration...");
        let k = await FO6({
            manifest: M,
            extensionPath: P,
            systemDirs: gO6(),
            userConfig: N,
            pathSeparator: "/"
        });
        if (!k) {
            let B = Error(`Failed to generate MCP server configuration from manifest "${M.name}"`);
            throw K1(B), B
        }
        let y = {
            source: A,
            contentHash: X,
            extractedPath: P,
            cachedAt: new Date().toISOString(),
            lastChecked: new Date().toISOString()
        };
        return await S0A($, A, y), {
            manifest: M,
            mcpConfig: k,
            extractedPath: P,
            contentHash: X
        }
    }
    if (Y) Y("Generating MCP server configuration...");
    let W = await MU7(M, P),
        G = {
            source: A,
            contentHash: X,
            extractedPath: P,
            cachedAt: new Date().toISOString(),
            lastChecked: new Date().toISOString()
        };
    return await S0A($, A, G), h(`Successfully loaded MCPB: ${M.name} (extracted to ${P})`), {
        manifest: M,
        mcpConfig: W,
        extractedPath: P,
        contentHash: X
    }
}
// @from(Ln 234179, Col 4)
I0A = v(() => {
    y5();
    m6();
    y0A();
    HU7();
    OU7();
    _8();
    Z6();
    y6();
    JU7();
    p8();
    m6()
})
// @from(Ln 234195, Col 0)
async function fU7(A, q, K) {
    try {
        h(`Loading MCP servers from MCPB: ${q}`);
        let Y = A.repository,
            z = await hu1(q, A.path, Y, ($) => {
                h(`MCPB [${A.name}]: ${$}`)
            });
        if ("status" in z && z.status === "needs-config") return h(`MCPB ${q} requires user configuration. ` + `User can configure via: /plugin → Manage plugins → ${A.name} → Configure`), null;
        let w = z,
            H = w.manifest.name;
        return h(`Loaded MCP server "${H}" from MCPB (extracted to ${w.extractedPath})`), {
            [H]: w.mcpConfig
        }
    } catch (Y) {
        let z = Y instanceof Error ? Y.message : String(Y);
        h(`Failed to load MCPB ${q}: ${z}`, {
            level: "error"
        });
        let w = `${A.name}@${A.repository}`;
        if (q.startsWith("http") && (z.includes("download") || z.includes("network"))) K.push({
            type: "mcpb-download-failed",
            source: w,
            plugin: A.name,
            url: q,
            reason: z
        });
        else if (z.includes("manifest") || z.includes("user configuration")) K.push({
            type: "mcpb-invalid-manifest",
            source: w,
            plugin: A.name,
            mcpbPath: q,
            validationError: z
        });
        else K.push({
            type: "mcpb-extract-failed",
            source: w,
            plugin: A.name,
            mcpbPath: q,
            reason: z
        });
        return null
    }
}
// @from(Ln 234238, Col 0)
async function b0A(A, q = []) {
    let K = {},
        Y = x0A(A.path, ".mcp.json");
    if (Y) K = {
        ...K,
        ...Y
    };
    if (A.manifest.mcpServers) {
        let z = A.manifest.mcpServers;
        if (typeof z === "string")
            if (XR(z)) {
                let w = await fU7(A, z, q);
                if (w) K = {
                    ...K,
                    ...w
                }
            } else {
                let w = x0A(A.path, z);
                if (w) K = {
                    ...K,
                    ...w
                }
            }
        else if (Array.isArray(z))
            for (let w of z)
                if (typeof w === "string")
                    if (XR(w)) {
                        let H = await fU7(A, w, q);
                        if (H) K = {
                            ...K,
                            ...H
                        }
                    } else {
                        let H = x0A(A.path, w);
                        if (H) K = {
                            ...K,
                            ...H
                        }
                    }
        else K = {
            ...K,
            ...w
        };
        else K = {
            ...K,
            ...z
        }
    }
    return Object.keys(K).length > 0 ? K : void 0
}
// @from(Ln 234289, Col 0)
function x0A(A, q) {
    let K = b1(),
        Y = xN9(A, q);
    if (!K.existsSync(Y)) return null;
    try {
        let z = K.readFileSync(Y, {
                encoding: "utf-8"
            }),
            w = _A(z),
            H = w.mcpServers || w,
            $ = {};
        for (let [O, _] of Object.entries(H)) {
            let J = sx.safeParse(_);
            if (J.success) $[O] = J.data;
            else h(`Invalid MCP server config for ${O} in ${Y}: ${J.error.message}`, {
                level: "error"
            })
        }
        return $
    } catch (z) {
        return h(`Failed to load MCP servers from ${Y}: ${z}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 234315, Col 0)
function bN9(A, q) {
    let K = {};
    for (let [Y, z] of Object.entries(A)) {
        let w = `plugin:${q}:${Y}`;
        K[w] = {
            ...z,
            scope: "dynamic"
        }
    }
    return K
}
// @from(Ln 234327, Col 0)
function Iu1(A, q) {
    return A.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, q)
}
// @from(Ln 234331, Col 0)
function uN9(A, q) {
    return A.replace(/\$\{user_config\.([^}]+)\}/g, (K, Y) => {
        let z = q[Y];
        if (z === void 0) throw Error(`Missing required user configuration value: ${Y}. This should have been validated before variable substitution.`);
        return String(z)
    })
}
// @from(Ln 234339, Col 0)
function BN9(A, q, K, Y, z, w) {
    let H = [],
        $ = (_) => {
            let J = Iu1(_, q);
            if (K) J = uN9(J, K);
            let {
                expanded: X,
                missingVars: D
            } = i01(J);
            return H.push(...D), X
        },
        O;
    switch (A.type) {
        case void 0:
        case "stdio": {
            let _ = {
                ...A
            };
            if (_.command) _.command = $(_.command);
            if (_.args) _.args = _.args.map((X) => $(X));
            let J = {
                CLAUDE_PLUGIN_ROOT: q,
                ..._.env || {}
            };
            for (let [X, D] of Object.entries(J))
                if (X !== "CLAUDE_PLUGIN_ROOT") J[X] = $(D);
            _.env = J, O = _;
            break
        }
        case "sse":
        case "http":
        case "ws": {
            let _ = {
                ...A
            };
            if (_.url) _.url = $(_.url);
            if (_.headers) {
                let J = {};
                for (let [X, D] of Object.entries(_.headers)) J[X] = $(D);
                _.headers = J
            }
            O = _;
            break
        }
        case "sse-ide":
        case "ws-ide":
        case "sdk":
        case "claudeai-proxy":
            O = A;
            break
    }
    if (Y && H.length > 0) {
        let J = [...new Set(H)].join(", ");
        if (h(`Missing environment variables in plugin MCP config: ${J}`, {
                level: "warn"
            }), z && w) Y.push({
            type: "mcp-config-invalid",
            source: `plugin:${z}`,
            plugin: z,
            serverName: w,
            validationError: `Missing environment variables: ${J}`
        })
    }
    return O
}
// @from(Ln 234404, Col 0)
async function VU7(A, q = []) {
    if (!A.enabled) return;
    let K = A.mcpServers || await b0A(A, q);
    if (!K) return;
    let Y = {};
    for (let [z, w] of Object.entries(K)) Y[z] = BN9(w, A.path, void 0, q, A.name, z);
    return bN9(Y, A.name)
}
// @from(Ln 234412, Col 4)
UO6 = v(() => {
    _8();
    Z6();
    YA1();
    I0A();
    m6()
})
// @from(Ln 234420, Col 0)
function u0A(A) {
    if (!A || !A.trim()) return [];
    let q = pz(A, (K) => `$${K}`);
    if (!q.success) return A.split(/\s+/).filter(Boolean);
    return q.tokens.filter((K) => typeof K === "string")
}
// @from(Ln 234427, Col 0)
function xu1(A) {
    if (!A) return [];
    let q = (K) => typeof K === "string" && K.trim() !== "" && !/^\d+$/.test(K);
    if (Array.isArray(A)) return A.filter(q);
    if (typeof A === "string") return A.split(/\s+/).filter(q);
    return []
}
// @from(Ln 234435, Col 0)
function NU7(A, q) {
    let K = A.slice(q.length);
    if (K.length === 0) return;
    return K.map((Y) => `[${Y}]`).join(" ")
}
// @from(Ln 234441, Col 0)
function Ej1(A, q, K = !0, Y = []) {
    if (q === void 0 || q === null) return A;
    let z = u0A(q),
        w = A;
    for (let H = 0; H < Y.length; H++) {
        let $ = Y[H];
        if (!$) continue;
        A = A.replace(new RegExp(`\\$${$}(?![\\[\\w])`, "g"), z[H] ?? "")
    }
    if (A = A.replace(/\$ARGUMENTS\[(\d+)\]/g, (H, $) => {
            let O = parseInt($, 10);
            return z[O] ?? ""
        }), A = A.replace(/\$(\d+)(?!\w)/g, (H, $) => {
            let O = parseInt($, 10);
            return z[O] ?? ""
        }), A = A.replaceAll("$ARGUMENTS", q), A === w && K && q) A = A + `

ARGUMENTS: ${q}`;
    return A
}
// @from(Ln 234461, Col 4)
bu1 = v(() => {
    M_()
})
// @from(Ln 234470, Col 0)
function pO6(A) {
    return /^skill\.md$/i.test(Lj1(A))
}
// @from(Ln 234474, Col 0)
function mN9(A, q, K) {
    if (pO6(A)) {
        let z = Qa(A),
            w = Qa(z),
            H = Lj1(z),
            $ = w.startsWith(q) ? w.slice(q.length).replace(/^\//, "") : "",
            O = $ ? $.split("/").join(":") : "";
        return O ? `${K}:${O}:${H}` : `${K}:${H}`
    } else {
        let z = Qa(A),
            w = Lj1(A).replace(/\.md$/, ""),
            H = z.startsWith(q) ? z.slice(q.length).replace(/^\//, "") : "",
            $ = H ? H.split("/").join(":") : "";
        return $ ? `${K}:${$}:${w}` : `${K}:${w}`
    }
}
// @from(Ln 234491, Col 0)
function FN9(A, q, K) {
    let Y = [],
        z = b1();

    function w(H) {
        try {
            let $ = z.readdirSync(H);
            if ($.some((_) => _.isFile() && pO6(_.name))) {
                for (let _ of $)
                    if (_.isFile() && _.name.toLowerCase().endsWith(".md")) {
                        let J = kj1(H, _.name);
                        if (Rx(z, J, K)) continue;
                        let X = z.readFileSync(J, {
                                encoding: "utf-8"
                            }),
                            {
                                frontmatter: D,
                                content: j
                            } = yD(X, J);
                        Y.push({
                            filePath: J,
                            baseDir: q,
                            frontmatter: D,
                            content: j
                        })
                    } return
            }
            for (let _ of $) {
                let J = kj1(H, _.name);
                if (_.isDirectory()) w(J);
                else if (_.isFile() && _.name.toLowerCase().endsWith(".md")) {
                    if (Rx(z, J, K)) continue;
                    let X = z.readFileSync(J, {
                            encoding: "utf-8"
                        }),
                        {
                            frontmatter: D,
                            content: j
                        } = yD(X, J);
                    Y.push({
                        filePath: J,
                        baseDir: q,
                        frontmatter: D,
                        content: j
                    })
                }
            }
        } catch ($) {
            h(`Failed to scan directory ${H}: ${$}`, {
                level: "error"
            })
        }
    }
    return w(A), Y
}
// @from(Ln 234547, Col 0)
function QN9(A) {
    let q = new Map;
    for (let Y of A) {
        let z = Qa(Y.filePath),
            w = q.get(z) ?? [];
        w.push(Y), q.set(z, w)
    }
    let K = [];
    for (let [Y, z] of q) {
        let w = z.filter((H) => pO6(H.filePath));
        if (w.length > 0) {
            let H = w[0];
            if (w.length > 1) h(`Multiple skill files found in ${Y}, using ${Lj1(H.filePath)}`);
            K.push(H)
        } else K.push(...z)
    }
    return K
}
// @from(Ln 234565, Col 0)
async function TU7(A, q, K, Y, z, w = {
    isSkillMode: !1
}, H = new Set) {
    let $ = FN9(A, A, H),
        O = QN9($),
        _ = [];
    for (let J of O) {
        let X = mN9(J.filePath, J.baseDir, q),
            D = uu1(X, J, K, Y, z, pO6(J.filePath), w);
        if (D) _.push(D)
    }
    return _
}
// @from(Ln 234579, Col 0)
function uu1(A, q, K, Y, z, w, H = {
    isSkillMode: !1
}) {
    try {
        let {
            frontmatter: $,
            content: O
        } = q, _ = $.description ?? vp(O, w ? "Plugin skill" : "Plugin command"), J = $["allowed-tools"], X = typeof J === "string" ? Iu1(J, z) : Array.isArray(J) ? J.map((B) => typeof B === "string" ? Iu1(B, z) : B) : J, D = Vh(X), j = $["argument-hint"], M = xu1($.arguments), P = $.when_to_use, W = $.version, G = $.name, f = $.model === "inherit" ? void 0 : $.model ? t9($.model) : void 0, Z = $["disable-model-invocation"], N;
        if (H.isSkillMode) N = Z === void 0 ? !1 : J6(Z);
        else N = J6(Z);
        let T = $["user-invocable"],
            y = !(H.isSkillMode ? T === void 0 || T === null ? !0 : J6(T) : !0);
        return {
            type: "prompt",
            name: A,
            description: _,
            hasUserSpecifiedDescription: !!$.description,
            allowedTools: D,
            argumentHint: j,
            argNames: M.length > 0 ? M : void 0,
            whenToUse: P,
            version: W,
            model: f,
            disableModelInvocation: N,
            contentLength: O.length,
            source: "plugin",
            loadedFrom: w || H.isSkillMode ? "plugin" : void 0,
            pluginInfo: {
                pluginManifest: Y,
                repository: K
            },
            isEnabled: () => !0,
            isHidden: y,
            progressMessage: w || H.isSkillMode ? "loading" : "running",
            userFacingName() {
                return G || A
            },
            async getPromptForCommand(B, S) {
                let m = H.isSkillMode ? `Base directory for this skill: ${Qa(q.filePath)}

${O}` : O;
                return m = Ej1(m, B, !0, M), m = Iu1(m, z), m = m.replace(/\$\{CLAUDE_SESSION_ID\}/g, U6()), m = await Ma(m, {
                    ...S,
                    async getAppState() {
                        let b = await S.getAppState();
                        return {
                            ...b,
                            toolPermissionContext: {
                                ...b.toolPermissionContext,
                                alwaysAllowRules: {
                                    ...b.toolPermissionContext.alwaysAllowRules,
                                    command: D
                                }
                            }
                        }
                    }
                }, `/${A}`), [{
                    type: "text",
                    text: m
                }]
            }
        }
    } catch ($) {
        return h(`Failed to create command from ${q.filePath}: ${$}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 234648, Col 0)
function dO6() {
    YK1.cache?.clear?.()
}
// @from(Ln 234651, Col 0)
async function vU7(A, q, K, Y, z, w) {
    let H = b1(),
        $ = [];
    try {
        if (!H.existsSync(A)) return [];
        let O = kj1(A, "SKILL.md");
        if (H.existsSync(O)) {
            if (Rx(H, O, w)) return $;
            try {
                let J = H.readFileSync(O, {
                        encoding: "utf-8"
                    }),
                    {
                        frontmatter: X,
                        content: D
                    } = yD(J, O),
                    j = `${q}:${Lj1(A)}`,
                    M = {
                        filePath: O,
                        baseDir: Qa(O),
                        frontmatter: X,
                        content: D
                    },
                    P = uu1(j, M, K, Y, z, !0, {
                        isSkillMode: !0
                    });
                if (P) $.push(P)
            } catch (J) {
                h(`Failed to load skill from ${O}: ${J}`, {
                    level: "error"
                })
            }
            return $
        }
        let _ = H.readdirSync(A);
        for (let J of _) {
            if (!J.isDirectory() && !J.isSymbolicLink()) continue;
            let X = kj1(A, J.name),
                D = kj1(X, "SKILL.md");
            if (H.existsSync(D)) {
                if (Rx(H, D, w)) continue;
                try {
                    let j = H.readFileSync(D, {
                            encoding: "utf-8"
                        }),
                        {
                            frontmatter: M,
                            content: P
                        } = yD(j, D),
                        W = `${q}:${J.name}`,
                        G = {
                            filePath: D,
                            baseDir: Qa(D),
                            frontmatter: M,
                            content: P
                        },
                        f = uu1(W, G, K, Y, z, !0, {
                            isSkillMode: !0
                        });
                    if (f) $.push(f)
                } catch (j) {
                    h(`Failed to load skill from ${D}: ${j}`, {
                        level: "error"
                    })
                }
            }
        }
    } catch (O) {
        h(`Failed to load skills from directory ${A}: ${O}`, {
            level: "error"
        })
    }
    return $
}
// @from(Ln 234726, Col 0)
function EU7() {
    B0A.cache?.clear?.()
}
// @from(Ln 234729, Col 4)
YK1
// @from(Ln 234729, Col 9)
B0A
// @from(Ln 234730, Col 4)
Bu1 = v(() => {
    zq();
    _8();
    VJ();
    Z6();
    a01();
    Ep();
    Lg();
    hA();
    UO6();
    e7();
    B6();
    bu1();
    YK1 = KA(async () => {
        let {
            enabled: A,
            errors: q
        } = await iY(), K = [];
        if (q.length > 0) h(`Plugin loading errors: ${q.map((Y)=>TZ(Y)).join(", ")}`);
        for (let Y of A) {
            let z = new Set;
            if (Y.commandsPath) try {
                let w = await TU7(Y.commandsPath, Y.name, Y.source, Y.manifest, Y.path, {
                    isSkillMode: !1
                }, z);
                if (K.push(...w), w.length > 0) h(`Loaded ${w.length} commands from plugin ${Y.name} default directory`)
            } catch (w) {
                h(`Failed to load commands from plugin ${Y.name} default directory: ${w}`, {
                    level: "error"
                })
            }
            if (Y.commandsPaths) {
                h(`Plugin ${Y.name} has commandsPaths: ${Y.commandsPaths.join(", ")}`);
                for (let w of Y.commandsPaths) try {
                    let H = b1(),
                        $ = H.statSync(w);
                    if (h(`Checking commandPath ${w} - isDirectory: ${$.isDirectory()}, isFile: ${$.isFile()}`), $.isDirectory()) {
                        let O = await TU7(w, Y.name, Y.source, Y.manifest, Y.path, {
                            isSkillMode: !1
                        }, z);
                        if (K.push(...O), O.length > 0) h(`Loaded ${O.length} commands from plugin ${Y.name} custom path: ${w}`);
                        else h(`Warning: No commands found in plugin ${Y.name} custom directory: ${w}. Expected .md files or SKILL.md in subdirectories.`, {
                            level: "warn"
                        })
                    } else if ($.isFile() && w.endsWith(".md")) {
                        if (Rx(H, w, z)) continue;
                        let O = H.readFileSync(w, {
                                encoding: "utf-8"
                            }),
                            {
                                frontmatter: _,
                                content: J
                            } = yD(O, w),
                            X, D;
                        if (Y.commandsMetadata) {
                            for (let [W, G] of Object.entries(Y.commandsMetadata))
                                if (G.source) {
                                    let f = kj1(Y.path, G.source);
                                    if (w === f) {
                                        X = `${Y.name}:${W}`, D = G;
                                        break
                                    }
                                }
                        }
                        if (!X) X = `${Y.name}:${Lj1(w).replace(/\.md$/,"")}`;
                        let j = D ? {
                                ..._,
                                ...D.description && {
                                    description: D.description
                                },
                                ...D.argumentHint && {
                                    "argument-hint": D.argumentHint
                                },
                                ...D.model && {
                                    model: D.model
                                },
                                ...D.allowedTools && {
                                    "allowed-tools": D.allowedTools.join(",")
                                }
                            } : _,
                            M = {
                                filePath: w,
                                baseDir: Qa(w),
                                frontmatter: j,
                                content: J
                            },
                            P = uu1(X, M, Y.source, Y.manifest, Y.path, !1);
                        if (P) K.push(P), h(`Loaded command from plugin ${Y.name} custom file: ${w}${D?" (with metadata override)":""}`)
                    }
                } catch (H) {
                    h(`Failed to load commands from plugin ${Y.name} custom path ${w}: ${H}`, {
                        level: "error"
                    })
                }
            }
            if (Y.commandsMetadata) {
                for (let [w, H] of Object.entries(Y.commandsMetadata))
                    if (H.content && !H.source) try {
                        let {
                            frontmatter: $,
                            content: O
                        } = yD(H.content, `<inline:${Y.name}:${w}>`), _ = {
                            ...$,
                            ...H.description && {
                                description: H.description
                            },
                            ...H.argumentHint && {
                                "argument-hint": H.argumentHint
                            },
                            ...H.model && {
                                model: H.model
                            },
                            ...H.allowedTools && {
                                "allowed-tools": H.allowedTools.join(",")
                            }
                        }, J = `${Y.name}:${w}`, X = {
                            filePath: `<inline:${J}>`,
                            baseDir: Y.path,
                            frontmatter: _,
                            content: O
                        }, D = uu1(J, X, Y.source, Y.manifest, Y.path, !1);
                        if (D) K.push(D), h(`Loaded inline content command from plugin ${Y.name}: ${J}`)
                    } catch ($) {
                        h(`Failed to load inline content command ${w} from plugin ${Y.name}: ${$}`, {
                            level: "error"
                        })
                    }
            }
        }
        return h(`Total plugin commands loaded: ${K.length}`), K
    });
    B0A = KA(async () => {
        let {
            enabled: A,
            errors: q
        } = await iY(), K = [];
        if (q.length > 0) h(`Plugin loading errors: ${q.map((Y)=>TZ(Y)).join(", ")}`);
        h(`getPluginSkills: Processing ${A.length} enabled plugins`);
        for (let Y of A) {
            let z = new Set;
            if (h(`Checking plugin ${Y.name}: skillsPath=${Y.skillsPath?"exists":"none"}, skillsPaths=${Y.skillsPaths?Y.skillsPaths.length:0} paths`), Y.skillsPath) {
                h(`Attempting to load skills from plugin ${Y.name} default skillsPath: ${Y.skillsPath}`);
                try {
                    let w = await vU7(Y.skillsPath, Y.name, Y.source, Y.manifest, Y.path, z);
                    K.push(...w), h(`Loaded ${w.length} skills from plugin ${Y.name} default directory`)
                } catch (w) {
                    h(`Failed to load skills from plugin ${Y.name} default directory: ${w}`, {
                        level: "error"
                    })
                }
            }
            if (Y.skillsPaths) {
                h(`Attempting to load skills from plugin ${Y.name} skillsPaths: ${Y.skillsPaths.join(", ")}`);
                for (let w of Y.skillsPaths) try {
                    h(`Loading from skillPath: ${w} for plugin ${Y.name}`);
                    let H = await vU7(w, Y.name, Y.source, Y.manifest, Y.path, z);
                    K.push(...H), h(`Loaded ${H.length} skills from plugin ${Y.name} custom path: ${w}`)
                } catch (H) {
                    h(`Failed to load skills from plugin ${Y.name} custom path ${w}: ${H}`, {
                        level: "error"
                    })
                }
            }
        }
        return h(`Total plugin skills loaded: ${K.length}`), K
    })
})
// @from(Ln 234903, Col 0)
function y2() {
    let A = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;
    if (J6(A)) return !1;
    if (FY(A)) return !0;
    if (J6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return !1;
    let q = l4();
    if (q.autoMemoryEnabled !== void 0) return q.autoMemoryEnabled;
    return x8("tengu_oboe", !1)
}
// @from(Ln 234913, Col 0)
function ga() {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
    return O8()
}
// @from(Ln 234918, Col 0)
function LU7() {
    return YX(ZO()) ?? ZO()
}
// @from(Ln 234922, Col 0)
function mu1() {
    let A = cO6(ga(), "projects");
    return (cO6(A, dx(LU7()), kU7) + UN9).normalize("NFC")
}
// @from(Ln 234927, Col 0)
function lO6() {
    let A = cO6(ga(), "projects");
    return cO6(A, dx(LU7()), kU7, pN9)
}
// @from(Ln 234932, Col 0)
function Fu1(A) {
    return gN9(A).startsWith(mu1())
}
// @from(Ln 234935, Col 4)
kU7 = "memory"
// @from(Ln 234936, Col 4)
pN9 = "MEMORY.md"
// @from(Ln 234937, Col 4)
xW = v(() => {
    B6();
    h9();
    U4();
    hA();
    p8();
    Ez()
})
// @from(Ln 234946, Col 0)
function cN9(A, q) {
    b1().readdir(A).then((Y) => {
        let z = 0,
            w = 0;
        for (let H of Y)
            if (H.isFile()) z++;
            else if (H.isDirectory()) w++;
        c("tengu_memdir_loaded", {
            ...q,
            total_file_count: z,
            total_subdir_count: w
        })
    }, () => {
        c("tengu_memdir_loaded", q)
    })
}
// @from(Ln 234963, Col 0)
function m0A(A) {
    let {
        displayName: q,
        memoryDir: K,
        extraGuidelines: Y
    } = A, z = b1(), w = K + Ua;
    try {
        z.mkdirSync(K)
    } catch {}
    let H = "";
    try {
        H = z.readFileSync(w, {
            encoding: "utf-8"
        })
    } catch {}
    let $ = [`# ${q}`, "", `You have a persistent ${q} directory at \`${K}\`. Its contents persist across conversations.`, "", `As you work, consult your memory files to build on previous experience. When you encounter a mistake that seems like it could be common, check your ${q} for relevant notes — and if nothing is written yet, record what you learned.`, "", "Guidelines:", `- \`${Ua}\` is always loaded into your system prompt — lines after ${Qu1} will be truncated, so keep it concise`, "- Create separate topic files (e.g., `debugging.md`, `patterns.md`) for detailed notes and link to them from MEMORY.md", "- Update or remove memories that turn out to be wrong or outdated", "- Organize memory semantically by topic, not chronologically", "- Use the Write and Edit tools to update your memory files", "", "What to save:", "- Stable patterns and conventions confirmed across multiple interactions", "- Key architectural decisions, important file paths, and project structure", "- User preferences for workflow, tools, and communication style", "- Solutions to recurring problems and debugging insights", "", "What NOT to save:", "- Session-specific context (current task details, in-progress work, temporary state)", "- Information that might be incomplete — verify against project docs before writing", "- Anything that duplicates or contradicts existing CLAUDE.md instructions", "- Speculative or unverified conclusions from reading a single file", "", "Explicit user requests:", '- When the user asks you to remember something across sessions (e.g., "always use bun", "never auto-commit"), save it — no need to wait for multiple interactions', "- When the user asks to forget or stop remembering something, find and remove the relevant entries from your memory files", ...Y ?? [], ""];
    if (x8("tengu_coral_fern", !1)) {
        let O = fJ(y8());
        $.push("## Searching past context", "", "When looking for past context:", "1. Search topic files in your memory directory:", "```", `${s9} with pattern="<search term>" path="${K}" glob="*.md"`, "```", "2. Session transcript logs (last resort — large files, slow):", "```", `${s9} with pattern="<search term>" path="${O}/" glob="*.jsonl"`, "```", "Use narrow search terms (error messages, file paths, function names) rather than broad keywords.", "")
    }
    if (H.trim()) {
        let O = H.trim().split(`
`),
            _ = O.length > Qu1,
            J = q === dN9 ? "auto" : "agent";
        cN9(K, {
            content_length: H.length,
            line_count: O.length,
            was_truncated: _,
            memory_type: J
        });
        let X = H.trim();
        if (_) X = O.slice(0, Qu1).join(`
`) + `

> WARNING: ${Ua} is ${O.length} lines (limit: ${Qu1}). Only the first ${Qu1} lines were loaded. Move detailed content into separate topic files and keep ${Ua} as a concise index.`;
        $.push(`## ${Ua}`, "", X)
    } else $.push(`## ${Ua}`, "", `Your ${Ua} is currently empty. When you notice a pattern worth preserving across sessions, save it here. Anything in ${Ua} will be included in your system prompt next time.`);
    return $.join(`
`)
}
// @from(Ln 235005, Col 0)
function F0A() {
    if (y2()) return m0A({
        displayName: "auto memory",
        memoryDir: mu1()
    });
    return c("tengu_memdir_disabled", {
        disabled_by_env_var: J6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
        disabled_by_setting: !J6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) && l4().autoMemoryEnabled === !1
    }), null
}
// @from(Ln 235015, Col 4)
Ua = "MEMORY.md"
// @from(Ln 235016, Col 4)
Qu1 = 200
// @from(Ln 235017, Col 4)
dN9 = "auto memory"
// @from(Ln 235018, Col 4)
Q0A = v(() => {
    _8();
    xW();
    u6();
    hA();
    p8();
    U4();
    lq();
    B6();
    DW()
})
// @from(Ln 235035, Col 0)
function iN9(A) {
    return A.replace(/:/g, "-")
}
// @from(Ln 235039, Col 0)
function RU7(A) {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return kp(process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR, "projects", dx(YX(ZO()) ?? ZO()), "agent-memory-local", A) + QB;
    return kp(h6(), ".claude", "agent-memory-local", A) + QB
}
// @from(Ln 235044, Col 0)
function iO6(A, q) {
    let K = iN9(A);
    switch (q) {
        case "project":
            return kp(h6(), ".claude", "agent-memory", K) + QB;
        case "local":
            return RU7(K);
        case "user":
            return kp(ga(), "agent-memory", K) + QB
    }
}
// @from(Ln 235056, Col 0)
function gu1(A) {
    let q = lN9(A),
        K = ga();
    if (q.startsWith(kp(K, "agent-memory") + QB)) return !0;
    if (q.startsWith(kp(h6(), ".claude", "agent-memory") + QB)) return !0;
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        if (q.includes(QB + "agent-memory-local" + QB) && q.startsWith(kp(process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR, "projects") + QB)) return !0
    } else if (q.startsWith(kp(h6(), ".claude", "agent-memory-local") + QB)) return !0;
    return !1
}
// @from(Ln 235067, Col 0)
function nO6(A) {
    switch (A) {
        case "user":
            return `User (${kp(ga(),"agent-memory")}/)`;
        case "project":
            return "Project (.claude/agent-memory/)";
        case "local":
            return `Local (${RU7("...")})`;
        default:
            return "None"
    }
}
// @from(Ln 235080, Col 0)
function zK1(A, q) {
    let K;
    switch (q) {
        case "user":
            K = "- Since this memory is user-scope, keep learnings general since they apply across all projects";
            break;
        case "project":
            K = "- Since this memory is project-scope and shared with your team via version control, tailor your memories to this project";
            break;
        case "local":
            K = "- Since this memory is local-scope (not checked into version control), tailor your memories to this project and machine";
            break
    }
    return m0A({
        displayName: "Persistent Agent Memory",
        memoryDir: iO6(A, q),
        extraGuidelines: [K]
    })
}
// @from(Ln 235099, Col 4)
gB = v(() => {
    B6();
    N7();
    h9();
    Q0A();
    xW();
    Ez()
})
// @from(Ln 235112, Col 0)
function CU7(A, q, K, Y) {
    let z = [],
        w = b1();

    function H($, O = []) {
        try {
            let _ = w.readdirSync($);
            for (let J of _) {
                let X = nN9($, J.name);
                if (J.isDirectory()) H(X, [...O, J.name]);
                else if (J.isFile() && J.name.endsWith(".md")) {
                    let D = SU7(X, q, O, K, Y);
                    if (D) z.push(D)
                }
            }
        } catch (_) {
            h(`Failed to scan agents directory ${$}: ${_}`, {
                level: "error"
            })
        }
    }
    return H(A), z
}
// @from(Ln 235136, Col 0)
function SU7(A, q, K, Y, z) {
    let w = b1();
    if (Rx(w, A, z)) return null;
    try {
        let H = w.readFileSync(A, {
                encoding: "utf-8"
            }),
            {
                frontmatter: $,
                content: O
            } = yD(H, A),
            _ = $.name || rN9(A).replace(/\.md$/, ""),
            X = [q, ...K, _].join(":"),
            D = $.description || $["when-to-use"] || `Agent from ${q} plugin`,
            j = HK1($.tools),
            M = Vh($.skills),
            P = $.color,
            W = $.model,
            G = $.forkContext,
            f = O.trim(),
            Z = $.memory,
            N;
        if (Z !== void 0)
            if (yU7.includes(Z)) N = Z;
            else h(`Plugin agent file ${A} has invalid memory value '${Z}'. Valid options: ${yU7.join(", ")}`);
        if (y2() && N && j !== void 0) {
            let T = new Set(j);
            for (let k of [f5, bq, Jq])
                if (!T.has(k)) j = [...j, k]
        }
        return {
            agentType: X,
            whenToUse: D,
            tools: j,
            ...M !== void 0 ? {
                skills: M
            } : {},
            getSystemPrompt: () => {
                if (y2() && N) {
                    let T = zK1(X, N);
                    return f + `

` + T
                }
                return f
            },
            source: "plugin",
            color: P,
            model: W,
            filename: _,
            plugin: Y,
            ...N ? {
                memory: N
            } : {},
            ...{}
        }
    } catch (H) {
        return h(`Failed to load agent from ${A}: ${H}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 235199, Col 0)
function hU7() {
    wK1.cache?.clear?.()
}
// @from(Ln 235202, Col 4)
yU7
// @from(Ln 235202, Col 9)
wK1
// @from(Ln 235203, Col 4)
Uu1 = v(() => {
    zq();
    _8();
    VJ();
    Z6();
    Lg();
    Ep();
    xW();
    gB();
    SD();
    _H();
    yU7 = ["user", "project", "local"];
    wK1 = KA(async () => {
        let {
            enabled: A,
            errors: q
        } = await iY(), K = [];
        if (q.length > 0) h(`Plugin loading errors: ${q.map((Y)=>TZ(Y)).join(", ")}`);
        for (let Y of A) {
            let z = new Set;
            if (Y.agentsPath) try {
                let w = CU7(Y.agentsPath, Y.name, Y.source, z);
                if (K.push(...w), w.length > 0) h(`Loaded ${w.length} agents from plugin ${Y.name} default directory`)
            } catch (w) {
                h(`Failed to load agents from plugin ${Y.name} default directory: ${w}`, {
                    level: "error"
                })
            }
            if (Y.agentsPaths)
                for (let w of Y.agentsPaths) try {
                    let $ = b1().statSync(w);
                    if ($.isDirectory()) {
                        let O = CU7(w, Y.name, Y.source, z);
                        if (K.push(...O), O.length > 0) h(`Loaded ${O.length} agents from plugin ${Y.name} custom path: ${w}`)
                    } else if ($.isFile() && w.endsWith(".md")) {
                        let O = SU7(w, Y.name, [], Y.source, z);
                        if (O) K.push(O), h(`Loaded agent from plugin ${Y.name} custom file: ${w}`)
                    }
                } catch (H) {
                    h(`Failed to load agents from plugin ${Y.name} custom path ${w}: ${H}`, {
                        level: "error"
                    })
                }
        }
        return h(`Total plugin agents loaded: ${K.length}`), K
    })
})
// @from(Ln 235250, Col 4)
IU7 = {}
// @from(Ln 235258, Col 0)
function oN9(A) {
    let q = {
        PreToolUse: [],
        PostToolUse: [],
        PostToolUseFailure: [],
        Notification: [],
        UserPromptSubmit: [],
        SessionStart: [],
        SessionEnd: [],
        Stop: [],
        SubagentStart: [],
        SubagentStop: [],
        PreCompact: [],
        PermissionRequest: [],
        Setup: [],
        TeammateIdle: [],
        TaskCompleted: []
    };
    if (!A.hooksConfig) return q;
    for (let [K, Y] of Object.entries(A.hooksConfig)) {
        let z = K;
        if (!q[z]) continue;
        for (let w of Y)
            if (w.hooks.length > 0) q[z].push({
                matcher: w.matcher,
                hooks: w.hooks,
                pluginRoot: A.path,
                pluginName: A.name,
                pluginId: A.source
            })
    }
    return q
}
// @from(Ln 235292, Col 0)
function rO6() {
    pa.cache?.clear?.(), YR6()
}
// @from(Ln 235296, Col 0)
function aN9() {
    g0A = !1
}
// @from(Ln 235300, Col 0)
function sN9() {
    if (g0A) return;
    g0A = !0, zX.subscribe((A) => {
        if (A === "policySettings") h("Plugin hooks: reloading due to policySettings change"), Sv(), rO6(), pa()
    })
}
// @from(Ln 235306, Col 4)
g0A = !1
// @from(Ln 235307, Col 4)
pa
// @from(Ln 235308, Col 4)
pu1 = v(() => {
    zq();
    VJ();
    Z6();
    B6();
    IQ();
    pa = KA(async () => {
        let {
            enabled: A
        } = await iY(), q = {
            PreToolUse: [],
            PostToolUse: [],
            PostToolUseFailure: [],
            Notification: [],
            UserPromptSubmit: [],
            SessionStart: [],
            SessionEnd: [],
            Stop: [],
            SubagentStart: [],
            SubagentStop: [],
            PreCompact: [],
            PermissionRequest: [],
            Setup: [],
            TeammateIdle: [],
            TaskCompleted: []
        };
        for (let Y of A) {
            if (!Y.hooksConfig) continue;
            h(`Loading hooks from plugin: ${Y.name}`);
            let z = oN9(Y);
            for (let w of Object.keys(z)) q[w].push(...z[w])
        }
        O61(q);
        let K = Object.values(q).reduce((Y, z) => Y + z.reduce((w, H) => w + H.hooks.length, 0), 0);
        h(`Registered ${K} hooks from ${A.length} plugins`)
    })
})
// @from(Ln 235350, Col 0)
function xU7(A, q, K) {
    let Y = [],
        z = b1();

    function w(H) {
        try {
            let $ = z.readdirSync(H);
            for (let O of $) {
                let _ = tN9(H, O.name);
                if (O.isDirectory()) w(_);
                else if (O.isFile() && O.name.endsWith(".md")) {
                    let J = bU7(_, q, K);
                    if (J) Y.push(J)
                }
            }
        } catch ($) {
            h(`Failed to scan output-styles directory ${H}: ${$}`, {
                level: "error"
            })
        }
    }
    return w(A), Y
}
// @from(Ln 235374, Col 0)
function bU7(A, q, K) {
    let Y = b1();
    if (Rx(Y, A, K)) return null;
    try {
        let z = Y.readFileSync(A, {
                encoding: "utf-8"
            }),
            {
                frontmatter: w,
                content: H
            } = yD(z, A),
            $ = eN9(A, ".md"),
            O = w.name || $,
            _ = `${q}:${O}`,
            J = w.description || vp(H, `Output style from ${q} plugin`),
            X = w["force-for-plugin"],
            D = X === !0 || X === "true" ? !0 : X === !1 || X === "false" ? !1 : void 0;
        return {
            name: _,
            description: J,
            prompt: H.trim(),
            source: "plugin",
            forceForPlugin: D
        }
    } catch (z) {
        return h(`Failed to load output style from ${A}: ${z}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 235405, Col 0)
function p0A() {
    U0A.cache?.clear?.()
}
// @from(Ln 235408, Col 4)
U0A
// @from(Ln 235409, Col 4)
oO6 = v(() => {
    zq();
    _8();
    VJ();
    Z6();
    Lg();
    Ep();
    U0A = KA(async () => {
        let {
            enabled: A,
            errors: q
        } = await iY(), K = [];
        if (q.length > 0) h(`Plugin loading errors: ${q.map((Y)=>TZ(Y)).join(", ")}`);
        for (let Y of A) {
            let z = new Set;
            if (Y.outputStylesPath) try {
                let w = xU7(Y.outputStylesPath, Y.name, z);
                if (K.push(...w), w.length > 0) h(`Loaded ${w.length} output styles from plugin ${Y.name} default directory`)
            } catch (w) {
                h(`Failed to load output styles from plugin ${Y.name} default directory: ${w}`, {
                    level: "error"
                })
            }
            if (Y.outputStylesPaths)
                for (let w of Y.outputStylesPaths) try {
                    let $ = b1().statSync(w);
                    if ($.isDirectory()) {
                        let O = xU7(w, Y.name, z);
                        if (K.push(...O), O.length > 0) h(`Loaded ${O.length} output styles from plugin ${Y.name} custom path: ${w}`)
                    } else if ($.isFile() && w.endsWith(".md")) {
                        let O = bU7(w, Y.name, z);
                        if (O) K.push(O), h(`Loaded output style from plugin ${Y.name} custom file: ${w}`)
                    }
                } catch (H) {
                    h(`Failed to load output styles from plugin ${Y.name} custom path ${w}: ${H}`, {
                        level: "error"
                    })
                }
        }
        return h(`Total plugin output styles loaded: ${K.length}`), K
    })
})
// @from(Ln 235452, Col 0)
function YT9(A) {
    if (Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET)) return Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET);
    if (A) return Math.floor(A * qT9 * AT9);
    return KT9
}
// @from(Ln 235458, Col 0)
function uU7(A) {
    return A.whenToUse ? `${A.description} - ${A.whenToUse}` : A.description
}
// @from(Ln 235462, Col 0)
function zT9(A) {
    if (A.name !== A.userFacingName() && A.type === "prompt" && A.source === "plugin") h(`Skill prompt: showing "${A.name}" (userFacingName="${A.userFacingName()}")`);
    return `- ${A.name}: ${uU7(A)}`
}
// @from(Ln 235467, Col 0)
function BU7(A, q) {
    if (A.length === 0) return "";
    let K = YT9(q),
        Y = A.map((O) => ({
            cmd: O,
            full: zT9(O)
        }));
    if (Y.reduce((O, _) => O + _.full.length, 0) + (Y.length - 1) <= K) return Y.map((O) => O.full).join(`
`);
    let w = A.reduce((O, _) => O + _.name.length + 4, 0) + (A.length - 1),
        H = K - w,
        $ = Math.floor(H / A.length);
    if ($ < wT9) return A.map((O) => `- ${O.name}`).join(`
`);
    return A.map((O) => {
        let _ = uU7(O),
            J = _.length > $ ? _.slice(0, $ - 1) + "…" : _;
        return `- ${O.name}: ${J}`
    }).join(`
`)
}
// @from(Ln 235488, Col 0)
async function mU7(A) {
    let q = await hv(A);
    return {
        totalCommands: q.length,
        includedCommands: q.length
    }
}
// @from(Ln 235495, Col 0)
async function FU7(A) {
    return hv(A)
}
// @from(Ln 235499, Col 0)
function QU7() {
    d0A.cache?.clear?.()
}
// @from(Ln 235502, Col 4)
AT9 = 0.02
// @from(Ln 235503, Col 4)
qT9 = 4
// @from(Ln 235504, Col 4)
KT9 = 16000
// @from(Ln 235505, Col 4)
wT9 = 20
// @from(Ln 235506, Col 4)
d0A