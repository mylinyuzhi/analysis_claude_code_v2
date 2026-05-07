
// @from(Ln 253204, Col 4)
lL4 = p((Thw, cL4) => {
    var pR = p_();
    RA();
    Hx();
    Y88();
    cL4.exports = pR.kem = pR.kem || {};
    var QL4 = pR.jsbn.BigInteger;
    pR.kem.rsa = {};
    pR.kem.rsa.create = function(q, K) {
        K = K || {};
        var _ = K.prng || pR.random,
            z = {};
        return z.encrypt = function(Y, A) {
            var O = Math.ceil(Y.n.bitLength() / 8),
                w;
            do w = new QL4(pR.util.bytesToHex(_.getBytesSync(O)), 16).mod(Y.n); while (w.compareTo(QL4.ONE) <= 0);
            w = pR.util.hexToBytes(w.toString(16));
            var $ = O - w.length;
            if ($ > 0) w = pR.util.fillString(String.fromCharCode(0), $) + w;
            var j = Y.encrypt(w, "NONE"),
                H = q.generate(w, A);
            return {
                encapsulation: j,
                key: H
            }
        }, z.decrypt = function(Y, A, O) {
            var w = Y.decrypt(A, "NONE");
            return q.generate(w, O)
        }, z
    };
    pR.kem.kdf1 = function(q, K) {
        dL4(this, q, 0, K || q.digestLength)
    };
    pR.kem.kdf2 = function(q, K) {
        dL4(this, q, 1, K || q.digestLength)
    };

    function dL4(q, K, _, z) {
        q.generate = function(Y, A) {
            var O = new pR.util.ByteBuffer,
                w = Math.ceil(A / z) + _,
                $ = new pR.util.ByteBuffer;
            for (var j = _; j < w; ++j) {
                $.putInt32(j), K.start(), K.update(Y + $.getBytes());
                var H = K.digest();
                O.putBytes(H.getBytes(z))
            }
            return O.truncate(O.length() - A), O.getBytes()
        }
    }
})
// @from(Ln 253255, Col 4)
iL4 = p((Vhw, nL4) => {
    var $Y = p_();
    RA();
    nL4.exports = $Y.log = $Y.log || {};
    $Y.log.levels = ["none", "error", "warning", "info", "debug", "verbose", "max"];
    var Jb8 = {},
        Nl1 = [],
        J88 = null;
    $Y.log.LEVEL_LOCKED = 2;
    $Y.log.NO_LEVEL_CHECK = 4;
    $Y.log.INTERPOLATE = 8;
    for (Dx = 0; Dx < $Y.log.levels.length; ++Dx) jb8 = $Y.log.levels[Dx], Jb8[jb8] = {
        index: Dx,
        name: jb8.toUpperCase()
    };
    var jb8, Dx;
    $Y.log.logMessage = function(q) {
        var K = Jb8[q.level].index;
        for (var _ = 0; _ < Nl1.length; ++_) {
            var z = Nl1[_];
            if (z.flags & $Y.log.NO_LEVEL_CHECK) z.f(q);
            else {
                var Y = Jb8[z.level].index;
                if (K <= Y) z.f(z, q)
            }
        }
    };
    $Y.log.prepareStandard = function(q) {
        if (!("standard" in q)) q.standard = Jb8[q.level].name + " [" + q.category + "] " + q.message
    };
    $Y.log.prepareFull = function(q) {
        if (!("full" in q)) {
            var K = [q.message];
            K = K.concat([]), q.full = $Y.util.format.apply(this, K)
        }
    };
    $Y.log.prepareStandardFull = function(q) {
        if (!("standardFull" in q)) $Y.log.prepareStandard(q), q.standardFull = q.standard
    };
    Hb8 = ["error", "warning", "info", "debug", "verbose"];
    for (Dx = 0; Dx < Hb8.length; ++Dx)(function(K) {
        $Y.log[K] = function(_, z) {
            var Y = Array.prototype.slice.call(arguments).slice(2),
                A = {
                    timestamp: new Date,
                    level: K,
                    category: _,
                    message: z,
                    arguments: Y
                };
            $Y.log.logMessage(A)
        }
    })(Hb8[Dx]);
    var Hb8, Dx;
    $Y.log.makeLogger = function(q) {
        var K = {
            flags: 0,
            f: q
        };
        return $Y.log.setLevel(K, "none"), K
    };
    $Y.log.setLevel = function(q, K) {
        var _ = !1;
        if (q && !(q.flags & $Y.log.LEVEL_LOCKED))
            for (var z = 0; z < $Y.log.levels.length; ++z) {
                var Y = $Y.log.levels[z];
                if (K == Y) {
                    q.level = K, _ = !0;
                    break
                }
            }
        return _
    };
    $Y.log.lock = function(q, K) {
        if (typeof K > "u" || K) q.flags |= $Y.log.LEVEL_LOCKED;
        else q.flags &= ~$Y.log.LEVEL_LOCKED
    };
    $Y.log.addLogger = function(q) {
        Nl1.push(q)
    };
    if (typeof console < "u" && "log" in console) {
        if (console.error && console.warn && console.info && console.debug) El1 = {
            error: console.error,
            warning: console.warn,
            info: console.info,
            debug: console.debug,
            verbose: console.debug
        }, Oh6 = function(q, K) {
            $Y.log.prepareStandard(K);
            var _ = El1[K.level],
                z = [K.standard];
            z = z.concat(K.arguments.slice()), _.apply(console, z)
        }, bH6 = $Y.log.makeLogger(Oh6);
        else Oh6 = function(K, _) {
            $Y.log.prepareStandardFull(_), console.log(_.standardFull)
        }, bH6 = $Y.log.makeLogger(Oh6);
        $Y.log.setLevel(bH6, "debug"), $Y.log.addLogger(bH6), J88 = bH6
    } else console = {
        log: function() {}
    };
    var bH6, El1, Oh6;
    if (J88 !== null && typeof window < "u" && window.location) {
        if (Ah6 = new URL(window.location.href).searchParams, Ah6.has("console.level")) $Y.log.setLevel(J88, Ah6.get("console.level").slice(-1)[0]);
        if (Ah6.has("console.lock")) {
            if (yl1 = Ah6.get("console.lock").slice(-1)[0], yl1 == "true") $Y.log.lock(J88)
        }
    }
    var Ah6, yl1;
    $Y.log.consoleLogger = J88
})
// @from(Ln 253365, Col 4)
oL4 = p((khw, rL4) => {
    rL4.exports = Zc();
    dC8();
    tL6();
    pc1();
    Pl1()
})
// @from(Ln 253372, Col 4)
tL4 = p((Nhw, sL4) => {
    var y4 = p_();
    V56();
    mp();
    _88();
    k56();
    NH6();
    ec1();
    Hx();
    RA();
    zb8();
    var W1 = y4.asn1,
        pk = sL4.exports = y4.pkcs7 = y4.pkcs7 || {};
    pk.messageFromPem = function(q) {
        var K = y4.pem.decode(q)[0];
        if (K.type !== "PKCS7") {
            var _ = Error('Could not convert PKCS#7 message from PEM; PEM header type is not "PKCS#7".');
            throw _.headerType = K.type, _
        }
        if (K.procType && K.procType.type === "ENCRYPTED") throw Error("Could not convert PKCS#7 message from PEM; PEM is encrypted.");
        var z = W1.fromDer(K.body);
        return pk.messageFromAsn1(z)
    };
    pk.messageToPem = function(q, K) {
        var _ = {
            type: "PKCS7",
            body: W1.toDer(q.toAsn1()).getBytes()
        };
        return y4.pem.encode(_, {
            maxline: K
        })
    };
    pk.messageFromAsn1 = function(q) {
        var K = {},
            _ = [];
        if (!W1.validate(q, pk.asn1.contentInfoValidator, K, _)) {
            var z = Error("Cannot read PKCS#7 message. ASN.1 object is not an PKCS#7 ContentInfo.");
            throw z.errors = _, z
        }
        var Y = W1.derToOid(K.contentType),
            A;
        switch (Y) {
            case y4.pki.oids.envelopedData:
                A = pk.createEnvelopedData();
                break;
            case y4.pki.oids.encryptedData:
                A = pk.createEncryptedData();
                break;
            case y4.pki.oids.signedData:
                A = pk.createSignedData();
                break;
            default:
                throw Error("Cannot read PKCS#7 message. ContentType with OID " + Y + " is not (yet) supported.")
        }
        return A.fromAsn1(K.content.value[0]), A
    };
    pk.createSignedData = function() {
        var q = null;
        return q = {
            type: y4.pki.oids.signedData,
            version: 1,
            certificates: [],
            crls: [],
            signers: [],
            digestAlgorithmIdentifiers: [],
            contentInfo: null,
            signerInfos: [],
            fromAsn1: function(z) {
                if (hl1(q, z, pk.asn1.signedDataValidator), q.certificates = [], q.crls = [], q.digestAlgorithmIdentifiers = [], q.contentInfo = null, q.signerInfos = [], q.rawCapture.certificates) {
                    var Y = q.rawCapture.certificates.value;
                    for (var A = 0; A < Y.length; ++A) q.certificates.push(y4.pki.certificateFromAsn1(Y[A]))
                }
            },
            toAsn1: function() {
                if (!q.contentInfo) q.sign();
                var z = [];
                for (var Y = 0; Y < q.certificates.length; ++Y) z.push(y4.pki.certificateToAsn1(q.certificates[Y]));
                var A = [],
                    O = W1.create(W1.Class.CONTEXT_SPECIFIC, 0, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.INTEGER, !1, W1.integerToDer(q.version).getBytes()), W1.create(W1.Class.UNIVERSAL, W1.Type.SET, !0, q.digestAlgorithmIdentifiers), q.contentInfo])]);
                if (z.length > 0) O.value[0].value.push(W1.create(W1.Class.CONTEXT_SPECIFIC, 0, !0, z));
                if (A.length > 0) O.value[0].value.push(W1.create(W1.Class.CONTEXT_SPECIFIC, 1, !0, A));
                return O.value[0].value.push(W1.create(W1.Class.UNIVERSAL, W1.Type.SET, !0, q.signerInfos)), W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.OID, !1, W1.oidToDer(q.type).getBytes()), O])
            },
            addSigner: function(z) {
                var {
                    issuer: Y,
                    serialNumber: A
                } = z;
                if (z.certificate) {
                    var O = z.certificate;
                    if (typeof O === "string") O = y4.pki.certificateFromPem(O);
                    Y = O.issuer.attributes, A = O.serialNumber
                }
                var w = z.key;
                if (!w) throw Error("Could not add PKCS#7 signer; no private key specified.");
                if (typeof w === "string") w = y4.pki.privateKeyFromPem(w);
                var $ = z.digestAlgorithm || y4.pki.oids.sha1;
                switch ($) {
                    case y4.pki.oids.sha1:
                    case y4.pki.oids.sha256:
                    case y4.pki.oids.sha384:
                    case y4.pki.oids.sha512:
                    case y4.pki.oids.md5:
                        break;
                    default:
                        throw Error("Could not add PKCS#7 signer; unknown message digest algorithm: " + $)
                }
                var j = z.authenticatedAttributes || [];
                if (j.length > 0) {
                    var H = !1,
                        J = !1;
                    for (var X = 0; X < j.length; ++X) {
                        var M = j[X];
                        if (!H && M.type === y4.pki.oids.contentType) {
                            if (H = !0, J) break;
                            continue
                        }
                        if (!J && M.type === y4.pki.oids.messageDigest) {
                            if (J = !0, H) break;
                            continue
                        }
                    }
                    if (!H || !J) throw Error("Invalid signer.authenticatedAttributes. If signer.authenticatedAttributes is specified, then it must contain at least two attributes, PKCS #9 content-type and PKCS #9 message-digest.")
                }
                q.signers.push({
                    key: w,
                    version: 1,
                    issuer: Y,
                    serialNumber: A,
                    digestAlgorithm: $,
                    signatureAlgorithm: y4.pki.oids.rsaEncryption,
                    signature: null,
                    authenticatedAttributes: j,
                    unauthenticatedAttributes: []
                })
            },
            sign: function(z) {
                if (z = z || {}, typeof q.content !== "object" || q.contentInfo === null) {
                    if (q.contentInfo = W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.OID, !1, W1.oidToDer(y4.pki.oids.data).getBytes())]), "content" in q) {
                        var Y;
                        if (q.content instanceof y4.util.ByteBuffer) Y = q.content.bytes();
                        else if (typeof q.content === "string") Y = y4.util.encodeUtf8(q.content);
                        if (z.detached) q.detachedContent = W1.create(W1.Class.UNIVERSAL, W1.Type.OCTETSTRING, !1, Y);
                        else q.contentInfo.value.push(W1.create(W1.Class.CONTEXT_SPECIFIC, 0, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.OCTETSTRING, !1, Y)]))
                    }
                }
                if (q.signers.length === 0) return;
                var A = K();
                _(A)
            },
            verify: function() {
                throw Error("PKCS#7 signature verification not yet implemented.")
            },
            addCertificate: function(z) {
                if (typeof z === "string") z = y4.pki.certificateFromPem(z);
                q.certificates.push(z)
            },
            addCertificateRevokationList: function(z) {
                throw Error("PKCS#7 CRL support not yet implemented.")
            }
        }, q;

        function K() {
            var z = {};
            for (var Y = 0; Y < q.signers.length; ++Y) {
                var A = q.signers[Y],
                    O = A.digestAlgorithm;
                if (!(O in z)) z[O] = y4.md[y4.pki.oids[O]].create();
                if (A.authenticatedAttributes.length === 0) A.md = z[O];
                else A.md = y4.md[y4.pki.oids[O]].create()
            }
            q.digestAlgorithmIdentifiers = [];
            for (var O in z) q.digestAlgorithmIdentifiers.push(W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.OID, !1, W1.oidToDer(O).getBytes()), W1.create(W1.Class.UNIVERSAL, W1.Type.NULL, !1, "")]));
            return z
        }

        function _(z) {
            var Y;
            if (q.detachedContent) Y = q.detachedContent;
            else Y = q.contentInfo.value[1], Y = Y.value[0];
            if (!Y) throw Error("Could not sign PKCS#7 message; there is no content to sign.");
            var A = W1.derToOid(q.contentInfo.value[0].value),
                O = W1.toDer(Y);
            O.getByte(), W1.getBerValueLength(O), O = O.getBytes();
            for (var w in z) z[w].start().update(O);
            var $ = new Date;
            for (var j = 0; j < q.signers.length; ++j) {
                var H = q.signers[j];
                if (H.authenticatedAttributes.length === 0) {
                    if (A !== y4.pki.oids.data) throw Error("Invalid signer; authenticatedAttributes must be present when the ContentInfo content type is not PKCS#7 Data.")
                } else {
                    H.authenticatedAttributesAsn1 = W1.create(W1.Class.CONTEXT_SPECIFIC, 0, !0, []);
                    var J = W1.create(W1.Class.UNIVERSAL, W1.Type.SET, !0, []);
                    for (var X = 0; X < H.authenticatedAttributes.length; ++X) {
                        var M = H.authenticatedAttributes[X];
                        if (M.type === y4.pki.oids.messageDigest) M.value = z[H.digestAlgorithm].digest();
                        else if (M.type === y4.pki.oids.signingTime) {
                            if (!M.value) M.value = $
                        }
                        J.value.push(Ll1(M)), H.authenticatedAttributesAsn1.value.push(Ll1(M))
                    }
                    O = W1.toDer(J).getBytes(), H.md.start().update(O)
                }
                H.signature = H.key.sign(H.md, "RSASSA-PKCS1-V1_5")
            }
            q.signerInfos = XHz(q.signers)
        }
    };
    pk.createEncryptedData = function() {
        var q = null;
        return q = {
            type: y4.pki.oids.encryptedData,
            version: 0,
            encryptedContent: {
                algorithm: y4.pki.oids["aes256-CBC"]
            },
            fromAsn1: function(K) {
                hl1(q, K, pk.asn1.encryptedDataValidator)
            },
            decrypt: function(K) {
                if (K !== void 0) q.encryptedContent.key = K;
                aL4(q)
            }
        }, q
    };
    pk.createEnvelopedData = function() {
        var q = null;
        return q = {
            type: y4.pki.oids.envelopedData,
            version: 0,
            recipients: [],
            encryptedContent: {
                algorithm: y4.pki.oids["aes256-CBC"]
            },
            fromAsn1: function(K) {
                var _ = hl1(q, K, pk.asn1.envelopedDataValidator);
                q.recipients = jHz(_.recipientInfos.value)
            },
            toAsn1: function() {
                return W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.OID, !1, W1.oidToDer(q.type).getBytes()), W1.create(W1.Class.CONTEXT_SPECIFIC, 0, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.INTEGER, !1, W1.integerToDer(q.version).getBytes()), W1.create(W1.Class.UNIVERSAL, W1.Type.SET, !0, HHz(q.recipients)), W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, MHz(q.encryptedContent))])])])
            },
            findRecipient: function(K) {
                var _ = K.issuer.attributes;
                for (var z = 0; z < q.recipients.length; ++z) {
                    var Y = q.recipients[z],
                        A = Y.issuer;
                    if (Y.serialNumber !== K.serialNumber) continue;
                    if (A.length !== _.length) continue;
                    var O = !0;
                    for (var w = 0; w < _.length; ++w)
                        if (A[w].type !== _[w].type || A[w].value !== _[w].value) {
                            O = !1;
                            break
                        } if (O) return Y
                }
                return null
            },
            decrypt: function(K, _) {
                if (q.encryptedContent.key === void 0 && K !== void 0 && _ !== void 0) switch (K.encryptedContent.algorithm) {
                    case y4.pki.oids.rsaEncryption:
                    case y4.pki.oids.desCBC:
                        var z = _.decrypt(K.encryptedContent.content);
                        q.encryptedContent.key = y4.util.createBuffer(z);
                        break;
                    default:
                        throw Error("Unsupported asymmetric cipher, OID " + K.encryptedContent.algorithm)
                }
                aL4(q)
            },
            addRecipient: function(K) {
                q.recipients.push({
                    version: 0,
                    issuer: K.issuer.attributes,
                    serialNumber: K.serialNumber,
                    encryptedContent: {
                        algorithm: y4.pki.oids.rsaEncryption,
                        key: K.publicKey
                    }
                })
            },
            encrypt: function(K, _) {
                if (q.encryptedContent.content === void 0) {
                    _ = _ || q.encryptedContent.algorithm, K = K || q.encryptedContent.key;
                    var z, Y, A;
                    switch (_) {
                        case y4.pki.oids["aes128-CBC"]:
                            z = 16, Y = 16, A = y4.aes.createEncryptionCipher;
                            break;
                        case y4.pki.oids["aes192-CBC"]:
                            z = 24, Y = 16, A = y4.aes.createEncryptionCipher;
                            break;
                        case y4.pki.oids["aes256-CBC"]:
                            z = 32, Y = 16, A = y4.aes.createEncryptionCipher;
                            break;
                        case y4.pki.oids["des-EDE3-CBC"]:
                            z = 24, Y = 8, A = y4.des.createEncryptionCipher;
                            break;
                        default:
                            throw Error("Unsupported symmetric cipher, OID " + _)
                    }
                    if (K === void 0) K = y4.util.createBuffer(y4.random.getBytes(z));
                    else if (K.length() != z) throw Error("Symmetric key has wrong length; got " + K.length() + " bytes, expected " + z + ".");
                    q.encryptedContent.algorithm = _, q.encryptedContent.key = K, q.encryptedContent.parameter = y4.util.createBuffer(y4.random.getBytes(Y));
                    var O = A(K);
                    if (O.start(q.encryptedContent.parameter.copy()), O.update(q.content), !O.finish()) throw Error("Symmetric encryption failed.");
                    q.encryptedContent.content = O.output
                }
                for (var w = 0; w < q.recipients.length; ++w) {
                    var $ = q.recipients[w];
                    if ($.encryptedContent.content !== void 0) continue;
                    switch ($.encryptedContent.algorithm) {
                        case y4.pki.oids.rsaEncryption:
                            $.encryptedContent.content = $.encryptedContent.key.encrypt(q.encryptedContent.key.data);
                            break;
                        default:
                            throw Error("Unsupported asymmetric cipher, OID " + $.encryptedContent.algorithm)
                    }
                }
            }
        }, q
    };

    function wHz(q) {
        var K = {},
            _ = [];
        if (!W1.validate(q, pk.asn1.recipientInfoValidator, K, _)) {
            var z = Error("Cannot read PKCS#7 RecipientInfo. ASN.1 object is not an PKCS#7 RecipientInfo.");
            throw z.errors = _, z
        }
        return {
            version: K.version.charCodeAt(0),
            issuer: y4.pki.RDNAttributesAsArray(K.issuer),
            serialNumber: y4.util.createBuffer(K.serial).toHex(),
            encryptedContent: {
                algorithm: W1.derToOid(K.encAlgorithm),
                parameter: K.encParameter ? K.encParameter.value : void 0,
                content: K.encKey
            }
        }
    }

    function $Hz(q) {
        return W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.INTEGER, !1, W1.integerToDer(q.version).getBytes()), W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, [y4.pki.distinguishedNameToAsn1({
            attributes: q.issuer
        }), W1.create(W1.Class.UNIVERSAL, W1.Type.INTEGER, !1, y4.util.hexToBytes(q.serialNumber))]), W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.OID, !1, W1.oidToDer(q.encryptedContent.algorithm).getBytes()), W1.create(W1.Class.UNIVERSAL, W1.Type.NULL, !1, "")]), W1.create(W1.Class.UNIVERSAL, W1.Type.OCTETSTRING, !1, q.encryptedContent.content)])
    }

    function jHz(q) {
        var K = [];
        for (var _ = 0; _ < q.length; ++_) K.push(wHz(q[_]));
        return K
    }

    function HHz(q) {
        var K = [];
        for (var _ = 0; _ < q.length; ++_) K.push($Hz(q[_]));
        return K
    }

    function JHz(q) {
        var K = W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.INTEGER, !1, W1.integerToDer(q.version).getBytes()), W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, [y4.pki.distinguishedNameToAsn1({
            attributes: q.issuer
        }), W1.create(W1.Class.UNIVERSAL, W1.Type.INTEGER, !1, y4.util.hexToBytes(q.serialNumber))]), W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.OID, !1, W1.oidToDer(q.digestAlgorithm).getBytes()), W1.create(W1.Class.UNIVERSAL, W1.Type.NULL, !1, "")])]);
        if (q.authenticatedAttributesAsn1) K.value.push(q.authenticatedAttributesAsn1);
        if (K.value.push(W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.OID, !1, W1.oidToDer(q.signatureAlgorithm).getBytes()), W1.create(W1.Class.UNIVERSAL, W1.Type.NULL, !1, "")])), K.value.push(W1.create(W1.Class.UNIVERSAL, W1.Type.OCTETSTRING, !1, q.signature)), q.unauthenticatedAttributes.length > 0) {
            var _ = W1.create(W1.Class.CONTEXT_SPECIFIC, 1, !0, []);
            for (var z = 0; z < q.unauthenticatedAttributes.length; ++z) {
                var Y = q.unauthenticatedAttributes[z];
                _.values.push(Ll1(Y))
            }
            K.value.push(_)
        }
        return K
    }

    function XHz(q) {
        var K = [];
        for (var _ = 0; _ < q.length; ++_) K.push(JHz(q[_]));
        return K
    }

    function Ll1(q) {
        var K;
        if (q.type === y4.pki.oids.contentType) K = W1.create(W1.Class.UNIVERSAL, W1.Type.OID, !1, W1.oidToDer(q.value).getBytes());
        else if (q.type === y4.pki.oids.messageDigest) K = W1.create(W1.Class.UNIVERSAL, W1.Type.OCTETSTRING, !1, q.value.bytes());
        else if (q.type === y4.pki.oids.signingTime) {
            var _ = new Date("1950-01-01T00:00:00Z"),
                z = new Date("2050-01-01T00:00:00Z"),
                Y = q.value;
            if (typeof Y === "string") {
                var A = Date.parse(Y);
                if (!isNaN(A)) Y = new Date(A);
                else if (Y.length === 13) Y = W1.utcTimeToDate(Y);
                else Y = W1.generalizedTimeToDate(Y)
            }
            if (Y >= _ && Y < z) K = W1.create(W1.Class.UNIVERSAL, W1.Type.UTCTIME, !1, W1.dateToUtcTime(Y));
            else K = W1.create(W1.Class.UNIVERSAL, W1.Type.GENERALIZEDTIME, !1, W1.dateToGeneralizedTime(Y))
        }
        return W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.OID, !1, W1.oidToDer(q.type).getBytes()), W1.create(W1.Class.UNIVERSAL, W1.Type.SET, !0, [K])])
    }

    function MHz(q) {
        return [W1.create(W1.Class.UNIVERSAL, W1.Type.OID, !1, W1.oidToDer(y4.pki.oids.data).getBytes()), W1.create(W1.Class.UNIVERSAL, W1.Type.SEQUENCE, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.OID, !1, W1.oidToDer(q.algorithm).getBytes()), !q.parameter ? void 0 : W1.create(W1.Class.UNIVERSAL, W1.Type.OCTETSTRING, !1, q.parameter.getBytes())]), W1.create(W1.Class.CONTEXT_SPECIFIC, 0, !0, [W1.create(W1.Class.UNIVERSAL, W1.Type.OCTETSTRING, !1, q.content.getBytes())])]
    }

    function hl1(q, K, _) {
        var z = {},
            Y = [];
        if (!W1.validate(K, _, z, Y)) {
            var A = Error("Cannot read PKCS#7 message. ASN.1 object is not a supported PKCS#7 message.");
            throw A.errors = A, A
        }
        var O = W1.derToOid(z.contentType);
        if (O !== y4.pki.oids.data) throw Error("Unsupported PKCS#7 message. Only wrapped ContentType Data supported.");
        if (z.encryptedContent) {
            var w = "";
            if (y4.util.isArray(z.encryptedContent))
                for (var $ = 0; $ < z.encryptedContent.length; ++$) {
                    if (z.encryptedContent[$].type !== W1.Type.OCTETSTRING) throw Error("Malformed PKCS#7 message, expecting encrypted content constructed of only OCTET STRING objects.");
                    w += z.encryptedContent[$].value
                } else w = z.encryptedContent;
            q.encryptedContent = {
                algorithm: W1.derToOid(z.encAlgorithm),
                parameter: y4.util.createBuffer(z.encParameter.value),
                content: y4.util.createBuffer(w)
            }
        }
        if (z.content) {
            var w = "";
            if (y4.util.isArray(z.content))
                for (var $ = 0; $ < z.content.length; ++$) {
                    if (z.content[$].type !== W1.Type.OCTETSTRING) throw Error("Malformed PKCS#7 message, expecting content constructed of only OCTET STRING objects.");
                    w += z.content[$].value
                } else w = z.content;
            q.content = y4.util.createBuffer(w)
        }
        return q.version = z.version.charCodeAt(0), q.rawCapture = z, z
    }

    function aL4(q) {
        if (q.encryptedContent.key === void 0) throw Error("Symmetric key not available.");
        if (q.content === void 0) {
            var K;
            switch (q.encryptedContent.algorithm) {
                case y4.pki.oids["aes128-CBC"]:
                case y4.pki.oids["aes192-CBC"]:
                case y4.pki.oids["aes256-CBC"]:
                    K = y4.aes.createDecryptionCipher(q.encryptedContent.key);
                    break;
                case y4.pki.oids.desCBC:
                case y4.pki.oids["des-EDE3-CBC"]:
                    K = y4.des.createDecryptionCipher(q.encryptedContent.key);
                    break;
                default:
                    throw Error("Unsupported symmetric cipher, OID " + q.encryptedContent.algorithm)
            }
            if (K.start(q.encryptedContent.parameter), K.update(q.encryptedContent.content), !K.finish()) throw Error("Symmetric decryption failed.");
            q.content = K.output
        }
    }
})
// @from(Ln 253833, Col 4)
qh4 = p((Ehw, eL4) => {
    var UP = p_();
    V56();
    rL6();
    dC8();
    tL6();
    RA();
    var Mb8 = eL4.exports = UP.ssh = UP.ssh || {};
    Mb8.privateKeyToPutty = function(q, K, _) {
        _ = _ || "", K = K || "";
        var z = "ssh-rsa",
            Y = K === "" ? "none" : "aes256-cbc",
            A = "PuTTY-User-Key-File-2: " + z + `\r
`;
        A += "Encryption: " + Y + `\r
`, A += "Comment: " + _ + `\r
`;
        var O = UP.util.createBuffer();
        wh6(O, z), Ec(O, q.e), Ec(O, q.n);
        var w = UP.util.encode64(O.bytes(), 64),
            $ = Math.floor(w.length / 66) + 1;
        A += "Public-Lines: " + $ + `\r
`, A += w;
        var j = UP.util.createBuffer();
        Ec(j, q.d), Ec(j, q.p), Ec(j, q.q), Ec(j, q.qInv);
        var H;
        if (!K) H = UP.util.encode64(j.bytes(), 64);
        else {
            var J = j.length() + 16 - 1;
            J -= J % 16;
            var X = Xb8(j.bytes());
            X.truncate(X.length() - J + j.length()), j.putBuffer(X);
            var M = UP.util.createBuffer();
            M.putBuffer(Xb8("\x00\x00\x00\x00", K)), M.putBuffer(Xb8("\x00\x00\x00\x01", K));
            var P = UP.aes.createEncryptionCipher(M.truncate(8), "CBC");
            P.start(UP.util.createBuffer().fillWithByte(0, 16)), P.update(j.copy()), P.finish();
            var W = P.output;
            W.truncate(16), H = UP.util.encode64(W.bytes(), 64)
        }
        $ = Math.floor(H.length / 66) + 1, A += `\r
Private-Lines: ` + $ + `\r
`, A += H;
        var D = Xb8("putty-private-key-file-mac-key", K),
            Z = UP.util.createBuffer();
        wh6(Z, z), wh6(Z, Y), wh6(Z, _), Z.putInt32(O.length()), Z.putBuffer(O), Z.putInt32(j.length()), Z.putBuffer(j);
        var G = UP.hmac.create();
        return G.start("sha1", D), G.update(Z.bytes()), A += `\r
Private-MAC: ` + G.digest().toHex() + `\r
`, A
    };
    Mb8.publicKeyToOpenSSH = function(q, K) {
        var _ = "ssh-rsa";
        K = K || "";
        var z = UP.util.createBuffer();
        return wh6(z, _), Ec(z, q.e), Ec(z, q.n), _ + " " + UP.util.encode64(z.bytes()) + " " + K
    };
    Mb8.privateKeyToOpenSSH = function(q, K) {
        if (!K) return UP.pki.privateKeyToPem(q);
        return UP.pki.encryptRsaPrivateKey(q, K, {
            legacy: !0,
            algorithm: "aes128"
        })
    };
    Mb8.getPublicKeyFingerprint = function(q, K) {
        K = K || {};
        var _ = K.md || UP.md.md5.create(),
            z = "ssh-rsa",
            Y = UP.util.createBuffer();
        wh6(Y, z), Ec(Y, q.e), Ec(Y, q.n), _.start(), _.update(Y.getBytes());
        var A = _.digest();
        if (K.encoding === "hex") {
            var O = A.toHex();
            if (K.delimiter) return O.match(/.{2}/g).join(K.delimiter);
            return O
        } else if (K.encoding === "binary") return A.getBytes();
        else if (K.encoding) throw Error('Unknown encoding "' + K.encoding + '".');
        return A
    };

    function Ec(q, K) {
        var _ = K.toString(16);
        if (_[0] >= "8") _ = "00" + _;
        var z = UP.util.hexToBytes(_);
        q.putInt32(z.length), q.putBytes(z)
    }

    function wh6(q, K) {
        q.putInt32(K.length), q.putString(K)
    }

    function Xb8() {
        var q = UP.md.sha1.create(),
            K = arguments.length;
        for (var _ = 0; _ < K; ++_) q.update(arguments[_]);
        return q.digest()
    }
})
// @from(Ln 253930, Col 4)
_h4 = p((yhw, Kh4) => {
    Kh4.exports = p_();
    V56();
    NL4();
    mp();
    mC8();
    _88();
    UL4();
    rL6();
    lL4();
    iL4();
    oL4();
    ql1();
    iC8();
    NH6();
    ic1();
    zl1();
    tL4();
    Al1();
    oc1();
    Fc1();
    qb8();
    Hx();
    Qc1();
    qh4();
    Jl1();
    RA()
})
// @from(Ln 253980, Col 0)
function vHz(q, K, _, z) {
    let Y = $h6(q),
        A = $h6(K, "utf-8"),
        O = $h6(_, "utf-8"),
        w = z?.map((W) => $h6(W, "utf-8")),
        $ = TJ.default.pkcs7.createSignedData();
    $.content = TJ.default.util.createBuffer(Y);
    let j = TJ.default.pki.certificateFromPem(A),
        H = TJ.default.pki.privateKeyFromPem(O);
    if ($.addCertificate(j), w)
        for (let W of w) $.addCertificate(TJ.default.pki.certificateFromPem(W));
    $.addSigner({
        key: H,
        certificate: j,
        digestAlgorithm: TJ.default.pki.oids.sha256,
        authenticatedAttributes: [{
            type: TJ.default.pki.oids.contentType,
            value: TJ.default.pki.oids.data
        }, {
            type: TJ.default.pki.oids.messageDigest
        }, {
            type: TJ.default.pki.oids.signingTime
        }]
    }), $.sign({
        detached: !0
    });
    let J = TJ.default.asn1.toDer($.toAsn1()),
        X = Buffer.from(J.getBytes(), "binary"),
        M = VHz(X),
        P = Buffer.concat([Y, M]);
    Yh4(q, P)
}
// @from(Ln 254012, Col 0)
async function THz(q) {
    try {
        let K = $h6(q),
            {
                originalContent: _,
                pkcs7Signature: z
            } = X88(K);
        if (!z) return {
            status: "unsigned"
        };
        let Y = TJ.default.asn1.fromDer(z.toString("binary")),
            A = TJ.default.pkcs7.messageFromAsn1(Y);
        if (!("type" in A) || A.type !== TJ.default.pki.oids.signedData) return {
            status: "unsigned"
        };
        let O = A,
            w = O.certificates || [];
        if (w.length === 0) return {
            status: "unsigned"
        };
        let $ = w[0],
            j = TJ.default.util.createBuffer(_);
        try {
            O.verify({
                authenticatedAttributes: !0
            });
            let W = O.signerInfos?.[0];
            if (W) {
                let D = TJ.default.md.sha256.create();
                D.update(j.getBytes());
                let Z = D.digest().getBytes(),
                    G = null;
                for (let f of W.authenticatedAttributes)
                    if (f.type === TJ.default.pki.oids.messageDigest) {
                        G = f.value;
                        break
                    } if (!G || G !== Z) return {
                    status: "unsigned"
                }
            }
        } catch (P) {
            return {
                status: "unsigned"
            }
        }
        let H = TJ.default.pki.certificateToPem($),
            J = w.slice(1).map((P) => Buffer.from(TJ.default.pki.certificateToPem(P)));
        if (!await wh4(Buffer.from(H), J)) return {
            status: "unsigned"
        };
        return {
            status: $.issuer.getField("CN")?.value === $.subject.getField("CN")?.value ? "self-signed" : "signed",
            publisher: $.subject.getField("CN")?.value || "Unknown",
            issuer: $.issuer.getField("CN")?.value || "Unknown",
            valid_from: $.validity.notBefore.toISOString(),
            valid_to: $.validity.notAfter.toISOString(),
            fingerprint: TJ.default.md.sha256.create().update(TJ.default.asn1.toDer(TJ.default.pki.certificateToAsn1($)).getBytes()).digest().toHex()
        }
    } catch (K) {
        throw Error(`Failed to verify MCPB file: ${K}`)
    }
}
// @from(Ln 254075, Col 0)
function VHz(q) {
    let K = [];
    K.push(Buffer.from(Ah4, "utf-8"));
    let _ = Buffer.alloc(4);
    return _.writeUInt32LE(q.length, 0), K.push(_), K.push(q), K.push(Buffer.from(Oh4, "utf-8")), Buffer.concat(K)
}
// @from(Ln 254082, Col 0)
function X88(q) {
    let K = Buffer.from(Oh4, "utf-8"),
        _ = q.lastIndexOf(K);
    if (_ === -1) return {
        originalContent: q
    };
    let z = Buffer.from(Ah4, "utf-8"),
        Y = -1;
    for (let w = _ - 1; w >= 0; w--)
        if (q.slice(w, w + z.length).equals(z)) {
            Y = w;
            break
        } if (Y === -1) return {
        originalContent: q
    };
    let A = q.slice(0, Y),
        O = Y + z.length;
    try {
        let w = q.readUInt32LE(O);
        O += 4;
        let $ = q.slice(O, O + w);
        return {
            originalContent: A,
            pkcs7Signature: $
        }
    } catch {
        return {
            originalContent: q
        }
    }
}
// @from(Ln 254113, Col 0)
async function wh4(q, K) {
    let _ = null;
    try {
        _ = await WHz(zh4(fHz(), "mcpb-verify-"));
        let z = zh4(_, "chain.pem"),
            Y = [q, ...K || []].join(`
`);
        if (await ZHz(z, Y), process.platform === "darwin") try {
            return await Rl1("security", ["verify-cert", "-c", z, "-p", "codeSign"]), !0
        } catch (A) {
            return !1
        } else if (process.platform === "win32") {
            let A = `
        $ErrorActionPreference = 'Stop'
        $certCollection = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2Collection
        $certCollection.Import('${z}')
        
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
                    stdout: O
                } = await Rl1("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", A]);
            return O.includes("Valid")
        } else try {
            return await Rl1("openssl", ["verify", "-purpose", "codesigning", "-CApath", "/etc/ssl/certs", z]), !0
        } catch (A) {
            return !1
        }
    } catch (z) {
        return !1
    } finally {
        if (_) try {
            await DHz(_, {
                recursive: !0,
                force: !0
            })
        } catch {}
    }
}
// @from(Ln 254185, Col 0)
function kHz(q) {
    let K = $h6(q),
        {
            originalContent: _
        } = X88(K);
    Yh4(q, _)
}
// @from(Ln 254192, Col 4)
TJ
// @from(Ln 254192, Col 8)
Ah4 = "MCPB_SIG_V1"
// @from(Ln 254193, Col 4)
Oh4 = "MCPB_SIG_END"
// @from(Ln 254194, Col 4)
Rl1
// @from(Ln 254195, Col 4)
Sl1 = L(() => {
    TJ = K6(_h4(), 1), Rl1 = GHz(PHz)
})
// @from(Ln 254199, Col 0)
function Pb8({
    silent: q = !1
} = {}) {
    return {
        log: (...K) => {
            if (!q) console.log(...K)
        },
        error: (...K) => {
            if (!q) console.error(...K)
        },
        warn: (...K) => {
            if (!q) console.warn(...K)
        },
        info: (...K) => {
            if (!q) console.info(...K)
        },
        debug: (...K) => {
            if (!q) console.debug(...K)
        }
    }
}
// @from(Ln 254232, Col 0)
async function bl1({
    mcpbPath: q,
    outputDir: K,
    silent: _
}) {
    let z = Pb8({
            silent: _
        }),
        Y = Wb8(q);
    if (!Cl1(Y)) return z.error(`ERROR: MCPB file not found: ${q}`), !1;
    let A = K ? Wb8(K) : process.cwd();
    if (!Cl1(A)) $h4(A, {
        recursive: !0
    });
    try {
        let O = EHz(Y),
            {
                originalContent: w
            } = X88(O),
            $ = new Map,
            j = process.platform !== "win32";
        if (j) {
            let J = w,
                X = -1;
            for (let M = J.length - 22; M >= 0; M--)
                if (J.readUInt32LE(M) === 101010256) {
                    X = M;
                    break
                } if (X !== -1) {
                let M = J.readUInt32LE(X + 16),
                    P = J.readUInt16LE(X + 8),
                    W = M;
                for (let D = 0; D < P; D++)
                    if (J.readUInt32LE(W) === 33639248) {
                        let Z = J.readUInt32LE(W + 38),
                            G = J.readUInt16LE(W + 28),
                            f = J.toString("utf8", W + 46, W + 46 + G),
                            v = Z >> 16 & 511;
                        if (v > 0) $.set(f, v);
                        let V = J.readUInt16LE(W + 30),
                            k = J.readUInt16LE(W + 32);
                        W += 46 + G + V + k
                    } else break
            }
        }
        let H = aQ1(w);
        for (let J in H)
            if (Object.prototype.hasOwnProperty.call(H, J)) {
                let X = H[J],
                    M = jh4(A, J),
                    P = Wb8(M),
                    W = Wb8(A);
                if (!P.startsWith(W + LHz) && P !== W) throw Error(`Path traversal attempt detected: ${J}`);
                let D = jh4(M, "..");
                if (!Cl1(D)) $h4(D, {
                    recursive: !0
                });
                if (yHz(M, X), j && $.has(J)) try {
                    let Z = $.get(J);
                    if (Z !== void 0) NHz(M, Z)
                } catch (Z) {}
            } return z.log(`Extension unpacked successfully to ${A}`), !0
    } catch (O) {
        if (O instanceof Error) z.error(`ERROR: Failed to unpack extension: ${O.message}`);
        else z.error("ERROR: An unknown error occurred during unpacking.");
        return !1
    }
}
// @from(Ln 254300, Col 4)
Il1 = L(() => {
    W68();
    Sl1()
})
// @from(Ln 254304, Col 4)
Hh4
// @from(Ln 254304, Col 9)
hHz
// @from(Ln 254304, Col 14)
RHz
// @from(Ln 254304, Col 19)
SHz
// @from(Ln 254304, Col 24)
CHz
// @from(Ln 254304, Col 29)
bHz
// @from(Ln 254304, Col 34)
IHz
// @from(Ln 254304, Col 39)
xHz
// @from(Ln 254304, Col 44)
uHz
// @from(Ln 254304, Col 49)
mHz
// @from(Ln 254304, Col 54)
Uhw
// @from(Ln 254304, Col 59)
Jh4
// @from(Ln 254304, Col 64)
Qhw
// @from(Ln 254305, Col 4)
Xh4 = L(() => {
    Hs();
    Hh4 = Yh({
        command: Aq(),
        args: sJ(Aq()).optional(),
        env: Xm(Aq(), Aq()).optional()
    }), hHz = Yh({
        name: Aq(),
        email: Aq().email().optional(),
        url: Aq().url().optional()
    }), RHz = Yh({
        type: Aq(),
        url: Aq().url()
    }), SHz = Hh4.partial(), CHz = Hh4.extend({
        platform_overrides: Xm(Aq(), SHz).optional()
    }), bHz = Yh({
        type: Mm(["python", "node", "binary"]),
        entry_point: Aq(),
        mcp_config: CHz
    }), IHz = Yh({
        claude_desktop: Aq().optional(),
        platforms: sJ(Mm(["darwin", "win32", "linux"])).optional(),
        runtimes: Yh({
            python: Aq().optional(),
            node: Aq().optional()
        }).optional()
    }).passthrough(), xHz = Yh({
        name: Aq(),
        description: Aq().optional()
    }), uHz = Yh({
        name: Aq(),
        description: Aq().optional(),
        arguments: sJ(Aq()).optional(),
        text: Aq()
    }), mHz = Yh({
        type: Mm(["string", "number", "boolean", "directory", "file"]),
        title: Aq(),
        description: Aq(),
        required: U0().optional(),
        default: gY6([Aq(), IC(), U0(), sJ(Aq())]).optional(),
        multiple: U0().optional(),
        sensitive: U0().optional(),
        min: IC().optional(),
        max: IC().optional()
    }), Uhw = Xm(Aq(), gY6([Aq(), IC(), U0(), sJ(Aq())])), Jh4 = Yh({
        $schema: Aq().optional(),
        dxt_version: Aq().optional().describe("@deprecated Use manifest_version instead"),
        manifest_version: Aq().optional(),
        name: Aq(),
        display_name: Aq().optional(),
        version: Aq(),
        description: Aq(),
        long_description: Aq().optional(),
        author: hHz,
        repository: RHz.optional(),
        homepage: Aq().url().optional(),
        documentation: Aq().url().optional(),
        support: Aq().url().optional(),
        icon: Aq().optional(),
        screenshots: sJ(Aq()).optional(),
        server: bHz,
        tools: sJ(xHz).optional(),
        tools_generated: U0().optional(),
        prompts: sJ(uHz).optional(),
        prompts_generated: U0().optional(),
        keywords: sJ(Aq()).optional(),
        license: Aq().optional(),
        compatibility: IHz.optional(),
        user_config: Xm(Aq(), mHz).optional()
    }).refine((q) => !!(q.dxt_version || q.manifest_version), {
        message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
    }), Qhw = Yh({
        status: Mm(["signed", "unsigned", "self-signed"]),
        publisher: Aq().optional(),
        issuer: Aq().optional(),
        valid_from: Aq().optional(),
        valid_to: Aq().optional(),
        fingerprint: Aq().optional()
    })
})
// @from(Ln 254397, Col 0)
function ml1(q) {
    try {
        let K = C56(q),
            _ = K;
        if (xl1(K) && Mh4(K).isDirectory()) _ = pHz(K, "manifest.json");
        let z = BHz(_, "utf-8"),
            Y = JSON.parse(z),
            A = b68.safeParse(Y);
        if (A.success) return console.log("Manifest schema validation passes!"), !0;
        else return console.log(`ERROR: Manifest validation failed:
`), A.error.issues.forEach((O) => {
            let w = O.path.join(".");
            console.log(`  - ${w?`${w}: `:""}${O.message}`)
        }), !1
    } catch (K) {
        if (K instanceof Error)
            if (K.message.includes("ENOENT")) {
                if (console.error(`ERROR: File not found: ${q}`), xl1(C56(q)) && Mh4(C56(q)).isDirectory()) console.error("  (No manifest.json found in directory)")
            } else if (K.message.includes("JSON")) console.error(`ERROR: Invalid JSON in manifest file: ${K.message}`);
        else console.error(`ERROR: Error reading manifest: ${K.message}`);
        else console.error("ERROR: Unknown error occurred");
        return !1
    }
}
// @from(Ln 254421, Col 0)
async function FHz(q) {
    let K = await vy.mkdtemp(C56(Wh4.tmpdir(), "mcpb-clean-")),
        _ = C56(K, "in.mcpb"),
        z = C56(K, "out");
    console.log(" -- Cleaning MCPB...");
    try {
        await vy.copyFile(q, _), console.log(" -- Unpacking MCPB..."), await bl1({
            mcpbPath: _,
            silent: !0,
            outputDir: z
        });
        let Y = C56(z, "manifest.json"),
            A = await vy.readFile(Y, "utf-8"),
            O = JSON.parse(A),
            w = Jh4.safeParse(O);
        if (!w.success) throw Error('Unrecoverable manifest issues, please run "mcpb validate"');
        if (await vy.writeFile(Y, JSON.stringify(w.data, null, 2)), A.trim() !== (await vy.readFile(Y, "utf8")).trim()) console.log(" -- Update manifest to be valid per MCPB schema");
        else console.log(" -- Manifest already valid per MCPB schema");
        let $ = C56(z, "node_modules");
        if (xl1($)) {
            console.log(" -- node_modules found, deleting development dependencies");
            let X = new Ph4.DestroyerOfModules({
                rootDirectory: z
            });
            try {
                await X.destroy()
            } catch (M) {
                if (M instanceof Error && M.message.includes("Failed to locate module")) console.log(" -- Some modules already removed, skipping remaining cleanup");
                else throw M
            }
            console.log(" -- Removed development dependencies from node_modules")
        } else console.log(" -- No node_modules, not pruning");
        let j = await vy.stat(q),
            {
                packExtension: H
            } = await Promise.resolve().then(() => (pl1(), Dh4));
        await H({
            extensionPath: z,
            outputPath: q,
            silent: !0
        });
        let J = await vy.stat(q);
        console.log(`
Clean Complete:`), console.log("Before:", ul1.default(j.size)), console.log("After:", ul1.default(J.size))
    } finally {
        await vy.rm(K, {
            recursive: !0,
            force: !0
        })
    }
}
// @from(Ln 254472, Col 4)
Ph4
// @from(Ln 254472, Col 9)
ul1
// @from(Ln 254473, Col 4)
Bl1 = L(() => {
    Il1();
    I68();
    Xh4();
    Ph4 = K6(UE4(), 1), ul1 = K6(cE4(), 1)
})
// @from(Ln 254479, Col 4)
Dh4 = {}
// @from(Ln 254501, Col 0)
function M88(q) {
    if (q < 1024) return `${q}B`;
    else if (q < 1048576) return `${(q/1024).toFixed(1)}kB`;
    else return `${(q/1048576).toFixed(1)}MB`
}
// @from(Ln 254507, Col 0)
function rHz(q) {
    return q.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_.]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "").substring(0, 100)
}
// @from(Ln 254510, Col 0)
async function Gh4({
    extensionPath: q,
    outputPath: K,
    silent: _
}) {
    let z = Fl1(q),
        Y = Pb8({
            silent: _
        });
    if (!Zh4(z) || !dHz(z).isDirectory()) return Y.error(`ERROR: Directory not found: ${q}`), !1;
    let A = fh4(z, "manifest.json");
    if (!Zh4(A))
        if (Y.log(`No manifest.json found in ${q}`), await Rw({
                message: "Would you like to create a manifest.json file?",
                default: !0
            })) {
            if (!await Qd1(q)) return Y.error("ERROR: Failed to create manifest"), !1
        } else return Y.error("ERROR: Cannot pack extension without manifest.json"), !1;
    if (Y.log("Validating manifest..."), !ml1(A)) return Y.error("ERROR: Cannot pack extension with invalid manifest"), !1;
    let O;
    try {
        let J = QHz(A, "utf-8"),
            X = JSON.parse(J);
        O = b68.parse(X)
    } catch (J) {
        if (Y.error("ERROR: Failed to parse manifest.json"), J instanceof Error) Y.error(`  ${J.message}`);
        return !1
    }
    let w = O.manifest_version || O.dxt_version;
    if (w !== fH6) return Y.error(`ERROR: Manifest version mismatch. Expected "${fH6}", found "${w}"`), Y.error(`  Please update the manifest_version in your manifest.json to "${fH6}"`), !1;
    let $ = lHz(z),
        j = K ? Fl1(K) : Fl1(`${$}.mcpb`),
        H = fh4(j, "..");
    UHz(H, {
        recursive: !0
    });
    try {
        let J = nd1(z),
            {
                files: X,
                ignoredCount: M
            } = MC8(z, z, {}, J);
        Y.log(`
\uD83D\uDCE6  ${O.name}@${O.version}`), Y.log("Archive Contents");
        let P = Object.entries(X),
            W = 0;
        P.sort(([R], [h]) => R.localeCompare(h));
        let D = new Map,
            Z = [];
        for (let [R, h] of P) {
            let C = nHz(z, R),
                x = h.data,
                B = typeof x === "string" ? Buffer.byteLength(x, "utf8") : x.length;
            W += B;
            let m = C.split(iHz);
            if (m.length > 3) {
                let S = m.slice(0, 3).join("/");
                if (!D.has(S)) D.set(S, {
                    files: [],
                    totalSize: 0
                });
                let F = D.get(S);
                F.files.push(C), F.totalSize += B
            } else Z.push({
                path: C,
                size: B
            })
        }
        for (let {
                path: R,
                size: h
            }
            of Z) Y.log(`${M88(h).padStart(8)} ${R}`);
        for (let [R, {
                files: h,
                totalSize: C
            }] of D)
            if (h.length === 1) {
                let x = h[0],
                    B = C;
                Y.log(`${M88(B).padStart(8)} ${x}`)
            } else Y.log(`${M88(C).padStart(8)} ${R}/ [and ${h.length} more files]`);
        let G = {},
            f = process.platform !== "win32";
        for (let [R, h] of Object.entries(X))
            if (f) G[R] = [h.data, {
                os: 3,
                attrs: (h.mode & 511) << 16
            }];
            else G[R] = h.data;
        let v = oQ1(G, {
            level: 9,
            mtime: new Date
        });
        cHz(j, v);
        let V = gHz("sha1").update(v).digest("hex"),
            N = `${rHz(O.name)}-${O.version}.mcpb`;
        return Y.log(`
Archive Details`), Y.log(`name: ${O.name}`), Y.log(`version: ${O.version}`), Y.log(`filename: ${N}`), Y.log(`package size: ${M88(v.length)}`), Y.log(`unpacked size: ${M88(W)}`), Y.log(`shasum: ${V}`), Y.log(`total files: ${P.length}`), Y.log(`ignored (.mcpbignore) files: ${M}`), Y.log(`
Output: ${j}`), !0
    } catch (J) {
        if (J instanceof Error) Y.error(`ERROR: Archive error: ${J.message}`);
        else Y.error("ERROR: Unknown archive error occurred");
        return !1
    }
}
// @from(Ln 254616, Col 4)
pl1 = L(() => {
    ud1();
    W68();
    rd1();
    Bl1();
    I68();
    dd1()
})
// @from(Ln 254625, Col 0)
function Db8(q, K) {
    if (typeof q === "string") {
        let _ = q;
        for (let [z, Y] of Object.entries(K)) {
            let A = new RegExp(`\\$\\{${z}\\}`, "g");
            if (_.match(A))
                if (Array.isArray(Y)) console.warn(`Cannot replace ${z} with array value in string context: "${q}"`, {
                    key: z,
                    replacement: Y
                });
                else _ = _.replace(A, Y)
        }
        return _
    } else if (Array.isArray(q)) {
        let _ = [];
        for (let z of q)
            if (typeof z === "string" && z.match(/^\$\{user_config\.[^}]+\}$/)) {
                let Y = z.match(/^\$\{([^}]+)\}$/)?.[1];
                if (Y && K[Y]) {
                    let A = K[Y];
                    if (Array.isArray(A)) _.push(...A);
                    else _.push(A)
                } else _.push(z)
            } else _.push(Db8(z, K));
        return _
    } else if (q && typeof q === "object") {
        let _ = {};
        for (let [z, Y] of Object.entries(q)) _[z] = Db8(Y, K);
        return _
    }
    return q
}
// @from(Ln 254657, Col 0)
async function oHz(q) {
    let {
        manifest: K,
        extensionPath: _,
        systemDirs: z,
        userConfig: Y,
        pathSeparator: A,
        logger: O
    } = q, w = K.server?.mcp_config;
    if (!w) return;
    let $ = {
        ...w
    };
    if (w.platform_overrides) {
        if (process.platform in w.platform_overrides) {
            let J = w.platform_overrides[process.platform];
            $.command = J.command || $.command, $.args = J.args || $.args, $.env = J.env || $.env
        }
    }
    if (Th4({
            manifest: K,
            userConfig: Y
        })) {
        O?.warn(`Extension ${K.name} has missing required configuration, skipping MCP config`);
        return
    }
    let j = {
            __dirname: _,
            pathSeparator: A,
            "/": A,
            ...z
        },
        H = {};
    if (K.user_config) {
        for (let [J, X] of Object.entries(K.user_config))
            if (X.default !== void 0) H[J] = X.default
    }
    if (Y) Object.assign(H, Y);
    for (let [J, X] of Object.entries(H)) {
        let M = `user_config.${J}`;
        if (Array.isArray(X)) j[M] = X.map(String);
        else if (typeof X === "boolean") j[M] = X ? "true" : "false";
        else j[M] = String(X)
    }
    return $ = Db8($, j), $
}
// @from(Ln 254704, Col 0)
function vh4(q) {
    return q === void 0 || q === null || q === ""
}
// @from(Ln 254708, Col 0)
function Th4({
    manifest: q,
    userConfig: K
}) {
    if (!q.user_config) return !1;
    let _ = K || {};
    for (let [z, Y] of Object.entries(q.user_config))
        if (Y.required) {
            let A = _[z];
            if (vh4(A) || Array.isArray(A) && (A.length === 0 || A.some(vh4))) return !0
        } return !1
}
// @from(Ln 254720, Col 4)
Vh4 = () => {}
// @from(Ln 254721, Col 4)
gl1 = {}
// @from(Ln 254780, Col 4)
Ul1 = L(() => {
    dd1();
    pl1();
    Il1();
    rd1();
    Sl1();
    Bl1();
    I68();
    Vh4()
})
// @from(Ln 254790, Col 0)
async function aHz(q) {
    let {
        McpbManifestSchema: K
    } = await Promise.resolve().then(() => (Ul1(), gl1)), _ = K.safeParse(q);
    if (!_.success) {
        let z = _.error.flatten(),
            Y = [...Object.entries(z.fieldErrors).map(([A, O]) => `${A}: ${O?.join(", ")}`), ...z.formErrors || []].filter(Boolean).join("; ");
        throw Error(`Invalid manifest: ${Y}`)
    }
    return _.data
}
// @from(Ln 254801, Col 0)
async function sHz(q) {
    let K;
    try {
        K = n8(q)
    } catch (_) {
        throw Error(`Invalid JSON in manifest.json: ${b6(_)}`)
    }
    return aHz(K)
}
// @from(Ln 254810, Col 0)
async function Ql1(q) {
    let K = new TextDecoder().decode(q);
    return sHz(K)
}
// @from(Ln 254814, Col 4)
kh4 = L(() => {
    m8();
    e8()
})
// @from(Ln 254825, Col 0)
function Nh4(q) {
    let K = q?.platform ?? y1(),
        _ = q?.homedir ?? tHz(),
        z = q?.env ?? process.env,
        Y = {
            HOME: _,
            DESKTOP: jh6(_, "Desktop"),
            DOCUMENTS: jh6(_, "Documents"),
            DOWNLOADS: jh6(_, "Downloads")
        };
    switch (K) {
        case "windows": {
            let A = z.USERPROFILE || _;
            return {
                HOME: _,
                DESKTOP: jh6(A, "Desktop"),
                DOCUMENTS: jh6(A, "Documents"),
                DOWNLOADS: jh6(A, "Downloads")
            }
        }
        case "linux":
        case "wsl":
            return {
                HOME: _, DESKTOP: z.XDG_DESKTOP_DIR || Y.DESKTOP, DOCUMENTS: z.XDG_DOCUMENTS_DIR || Y.DOCUMENTS, DOWNLOADS: z.XDG_DOWNLOAD_DIR || Y.DOWNLOADS
            };
        case "macos":
        default: {
            if (K === "unknown") E("Unknown platform detected, using default paths");
            return Y
        }
    }
}
// @from(Ln 254857, Col 4)
Eh4 = L(() => {
    K8();
    NK()
})
// @from(Ln 254873, Col 0)
function Zx(q) {
    return q.endsWith(".mcpb") || q.endsWith(".dxt")
}
// @from(Ln 254877, Col 0)
function yh4(q) {
    return q.startsWith("http://") || q.startsWith("https://")
}
// @from(Ln 254881, Col 0)
function KJz(q) {
    return cl1("sha256").update(q).digest("hex").substring(0, 16)
}
// @from(Ln 254885, Col 0)
function Lh4(q) {
    return b56(q, ".mcpb-cache")
}
// @from(Ln 254889, Col 0)
function hh4(q, K) {
    let _ = cl1("md5").update(K).digest("hex").substring(0, 8);
    return b56(q, `${_}.metadata.json`)
}
// @from(Ln 254894, Col 0)
function Rh4(q, K) {
    return `${q}/${K}`
}
// @from(Ln 254898, Col 0)
function IH6(q, K) {
    try {
        let z = y7().pluginConfigs?.[q]?.mcpServers?.[K],
            Y = t3().read()?.pluginSecrets?.[Rh4(q, K)];
        if (!z && !Y) return null;
        return E(`Loaded user config for ${q}/${K} (settings + secureStorage)`), {
            ...z,
            ...Y
        }
    } catch (_) {
        let z = r1(_);
        return j6(z), E(`Failed to load user config for ${q}/${K}: ${_}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 254915, Col 0)
function Gb8(q, K, _, z) {
    try {
        let Y = {},
            A = {};
        for (let [D, Z] of Object.entries(_))
            if (z[D]?.sensitive === !0) A[D] = String(Z);
            else Y[D] = Z;
        let O = new Set(Object.keys(A)),
            w = new Set(Object.keys(Y)),
            $ = t3(),
            j = Rh4(q, K),
            H = $.read()?.pluginSecrets?.[j] ?? void 0,
            J = H ? Object.fromEntries(Object.entries(H).filter(([D]) => !w.has(D))) : void 0,
            X = J && H && Object.keys(J).length !== Object.keys(H).length;
        if (Object.keys(A).length > 0 || X) {
            let D = $.read() ?? {};
            if (!D.pluginSecrets) D.pluginSecrets = {};
            D.pluginSecrets[j] = {
                ...J,
                ...A
            };
            let Z = $.update(D);
            if (!Z.success) throw Error(`Failed to save sensitive config to secure storage for ${j}`);
            if (Z.warning) E(`Server secrets save warning: ${Z.warning}`, {
                level: "warn"
            });
            if (X) E(`saveMcpServerUserConfig: scrubbed ${Object.keys(H).length-Object.keys(J).length} stale non-sensitive key(s) from secureStorage for ${j}`)
        }
        let M = y7(),
            P = M.pluginConfigs?.[q]?.mcpServers?.[K] ?? {},
            W = Object.keys(P).filter((D) => O.has(D));
        if (Object.keys(Y).length > 0 || W.length > 0) {
            if (!M.pluginConfigs) M.pluginConfigs = {};
            if (!M.pluginConfigs[q]) M.pluginConfigs[q] = {};
            if (!M.pluginConfigs[q].mcpServers) M.pluginConfigs[q].mcpServers = {};
            let D = Object.fromEntries(W.map((G) => [G, void 0]));
            M.pluginConfigs[q].mcpServers[K] = {
                ...Y,
                ...D
            };
            let Z = P7("userSettings", M);
            if (Z.error) throw Z.error;
            if (W.length > 0) E(`saveMcpServerUserConfig: scrubbed ${W.length} plaintext sensitive key(s) from settings.json for ${q}/${K}`)
        }
        E(`Saved user config for ${q}/${K} (${Object.keys(Y).length} non-sensitive, ${Object.keys(A).length} sensitive)`)
    } catch (Y) {
        let A = r1(Y);
        throw j6(A), Error(`Failed to save user configuration for ${q}/${K}: ${A.message}`)
    }
}
// @from(Ln 254966, Col 0)
function xH6(q, K) {
    let _ = [];
    for (let [z, Y] of Object.entries(K)) {
        let A = q[z];
        if (Y.required && (A === void 0 || A === "")) {
            _.push(`${Y.title||z} is required but not provided`);
            continue
        }
        if (A === void 0 || A === "") continue;
        if (Y.type === "string") {
            if (Array.isArray(A)) {
                if (!Y.multiple) _.push(`${Y.title||z} must be a string, not an array`);
                else if (!A.every((O) => typeof O === "string")) _.push(`${Y.title||z} must be an array of strings`)
            } else if (typeof A !== "string") _.push(`${Y.title||z} must be a string`)
        } else if (Y.type === "number" && typeof A !== "number") _.push(`${Y.title||z} must be a number`);
        else if (Y.type === "boolean" && typeof A !== "boolean") _.push(`${Y.title||z} must be a boolean`);
        else if ((Y.type === "file" || Y.type === "directory") && typeof A !== "string") _.push(`${Y.title||z} must be a path string`);
        if (Y.type === "number" && typeof A === "number") {
            if (Y.min !== void 0 && A < Y.min) _.push(`${Y.title||z} must be at least ${Y.min}`);
            if (Y.max !== void 0 && A > Y.max) _.push(`${Y.title||z} must be at most ${Y.max}`)
        }
    }
    return {
        valid: _.length === 0,
        errors: _
    }
}
// @from(Ln 254993, Col 0)
async function Zb8(q, K, _ = {}) {
    let {
        getMcpConfigForManifest: z
    } = await Promise.resolve().then(() => (Ul1(), gl1)), Y = await z({
        manifest: q,
        extensionPath: K,
        systemDirs: Nh4(),
        userConfig: _,
        pathSeparator: "/"
    });
    if (!Y) {
        let A = Error(`Failed to generate MCP server configuration from manifest "${q.name}"`);
        throw j6(A), A
    }
    return Y
}
// @from(Ln 255009, Col 0)
async function Sh4(q, K) {
    let _ = V8(),
        z = hh4(q, K);
    try {
        let Y = await _.readFile(z, {
            encoding: "utf-8"
        });
        return n8(Y)
    } catch (Y) {
        if (Q1(Y) === "ENOENT") return null;
        let O = r1(Y);
        return j6(O), E(`Failed to load MCPB cache metadata: ${Y}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 255025, Col 0)
async function dl1(q, K, _) {
    let z = hh4(q, K);
    await V8().mkdir(q), await fb8(z, I6(_, null, 2), "utf-8")
}
// @from(Ln 255029, Col 0)
async function _Jz(q, K, _) {
    if (E(`Downloading MCPB from ${q}`), _) _(`Downloading ${q}...`);
    let z = performance.now(),
        Y = !1;
    try {
        let A = await Z1.get(q, {
                timeout: 120000,
                responseType: "arraybuffer",
                maxRedirects: 5,
                onDownloadProgress: (w) => {
                    if (w.total && _) {
                        let $ = Math.round(w.loaded / w.total * 100);
                        _(`Downloading... ${$}%`)
                    }
                }
            }),
            O = new Uint8Array(A.data);
        if (ED("mcpb", q, "success", performance.now() - z), Y = !0, await fb8(K, Buffer.from(O)), E(`Downloaded ${O.length} bytes to ${K}`), _) _("Download complete");
        return O
    } catch (A) {
        if (!Y) ED("mcpb", q, "failure", performance.now() - z, Kx(A));
        let O = b6(A),
            w = Error(`Failed to download MCPB file from ${q}: ${O}`);
        throw j6(w), w
    }
}
// @from(Ln 255055, Col 0)
async function zJz(q, K, _, z) {
    if (z) z("Extracting files...");
    await V8().mkdir(K);
    let Y = 0,
        A = Object.entries(q).filter(([w]) => !w.endsWith("/")),
        O = A.length;
    for (let [w, $] of A) {
        let j = b56(K, w),
            H = qJz(j);
        if (H !== K) await V8().mkdir(H);
        if (w.endsWith(".json") || w.endsWith(".js") || w.endsWith(".ts") || w.endsWith(".txt") || w.endsWith(".md") || w.endsWith(".yml") || w.endsWith(".yaml")) {
            let M = new TextDecoder().decode($);
            await fb8(j, M, "utf-8")
        } else await fb8(j, Buffer.from($));
        let X = _[w];
        if (X && X & 73) await eHz(j, X & 511).catch(() => {});
        if (Y++, z && Y % 10 === 0) z(`Extracted ${Y}/${O} files`)
    }
    if (E(`Extracted ${Y} files to ${K}`), z) z(`Extraction complete (${Y} files)`)
}
// @from(Ln 255075, Col 0)
async function YJz(q, K) {
    let _ = V8(),
        z = Lh4(K),
        Y = await Sh4(z, q);
    if (!Y) return !0;
    try {
        await _.stat(Y.extractedPath)
    } catch (A) {
        if (Q1(A) === "ENOENT") E(`MCPB extraction path missing: ${Y.extractedPath}`);
        else E(`MCPB extraction path inaccessible: ${Y.extractedPath}: ${A}`, {
            level: "error"
        });
        return !0
    }
    if (!yh4(q)) {
        let A = b56(K, q),
            O;
        try {
            O = await _.stat(A)
        } catch (j) {
            if (Q1(j) === "ENOENT") E(`MCPB source file missing: ${A}`);
            else E(`MCPB source file inaccessible: ${A}: ${j}`, {
                level: "error"
            });
            return !0
        }
        let w = new Date(Y.cachedAt).getTime(),
            $ = Math.floor(O.mtimeMs);
        if ($ > w) return E(`MCPB file modified: ${new Date($)} > ${new Date(w)}`), !0
    }
    return !1
}
// @from(Ln 255107, Col 0)
async function P88(q, K, _, z, Y, A) {
    let O = V8(),
        w = Lh4(K);
    await O.mkdir(w), E(`Loading MCPB from source: ${q}`);
    let $ = await Sh4(w, q);
    if ($ && !await YJz(q, K)) {
        E(`Using cached MCPB from ${$.extractedPath} (hash: ${$.contentHash})`);
        let f = b56($.extractedPath, "manifest.json"),
            v;
        try {
            v = await O.readFile(f, {
                encoding: "utf-8"
            })
        } catch (R) {
            if (t1(R)) {
                let h = Error(`Cached manifest not found: ${f}`);
                throw j6(h), h
            }
            throw R
        }
        let V = new TextEncoder().encode(v),
            k = await Ql1(V);
        if (k.user_config && Object.keys(k.user_config).length > 0) {
            let R = k.name,
                h = IH6(_, R),
                C = Y || h || {},
                x = xH6(C, k.user_config);
            if (A || !x.valid) return {
                status: "needs-config",
                manifest: k,
                extractedPath: $.extractedPath,
                contentHash: $.contentHash,
                configSchema: k.user_config,
                existingConfig: h || {},
                validationErrors: x.valid ? [] : x.errors
            };
            if (Y) Gb8(_, R, Y, k.user_config ?? {});
            let B = await Zb8(k, $.extractedPath, C);
            return {
                manifest: k,
                mcpConfig: B,
                extractedPath: $.extractedPath,
                contentHash: $.contentHash
            }
        }
        let N = await Zb8(k, $.extractedPath);
        return {
            manifest: k,
            mcpConfig: N,
            extractedPath: $.extractedPath,
            contentHash: $.contentHash
        }
    }
    let j, H;
    if (yh4(q)) {
        let f = cl1("md5").update(q).digest("hex").substring(0, 8);
        H = b56(w, `${f}.mcpb`), j = await _Jz(q, H, z)
    } else {
        let f = b56(K, q);
        if (z) z(`Loading ${q}...`);
        try {
            j = await O.readFileBytes(f), H = f
        } catch (v) {
            if (t1(v)) {
                let V = Error(`MCPB file not found: ${f}`);
                throw j6(V), V
            }
            throw v
        }
    }
    let J = KJz(j);
    if (E(`MCPB content hash: ${J}`), z) z("Extracting MCPB archive...");
    let X = await kL6(Buffer.from(j)),
        M = NL6(j),
        P = X["manifest.json"];
    if (!P) {
        let f = Error("No manifest.json found in MCPB file");
        throw j6(f), f
    }
    let W = await Ql1(P);
    if (E(`MCPB manifest: ${W.name} v${W.version} by ${W.author.name}`), !W.server) {
        let f = Error(`MCPB manifest for "${W.name}" does not define a server configuration`);
        throw j6(f), f
    }
    let D = b56(w, J);
    if (await zJz(X, D, M, z), W.user_config && Object.keys(W.user_config).length > 0) {
        let f = W.name,
            v = IH6(_, f),
            V = Y || v || {},
            k = xH6(V, W.user_config);
        if (!k.valid) {
            let h = {
                source: q,
                contentHash: J,
                extractedPath: D,
                cachedAt: new Date().toISOString(),
                lastChecked: new Date().toISOString()
            };
            return await dl1(w, q, h), {
                status: "needs-config",
                manifest: W,
                extractedPath: D,
                contentHash: J,
                configSchema: W.user_config,
                existingConfig: v || {},
                validationErrors: k.errors
            }
        }
        if (Y) Gb8(_, f, Y, W.user_config ?? {});
        if (z) z("Generating MCP server configuration...");
        let N = await Zb8(W, D, V),
            R = {
                source: q,
                contentHash: J,
                extractedPath: D,
                cachedAt: new Date().toISOString(),
                lastChecked: new Date().toISOString()
            };
        return await dl1(w, q, R), {
            manifest: W,
            mcpConfig: N,
            extractedPath: D,
            contentHash: J
        }
    }
    if (z) z("Generating MCP server configuration...");
    let Z = await Zb8(W, D),
        G = {
            source: q,
            contentHash: J,
            extractedPath: D,
            cachedAt: new Date().toISOString(),
            lastChecked: new Date().toISOString()
        };
    return await dl1(w, q, G), E(`Successfully loaded MCPB: ${W.name} (extracted to ${D})`), {
        manifest: W,
        mcpConfig: Z,
        extractedPath: D,
        contentHash: J
    }
}
// @from(Ln 255248, Col 4)
W88 = L(() => {
    CK();
    K8();
    kh4();
    gS8();
    m8();
    Yq();
    U8();
    _46();
    a1();
    e8();
    Eh4();
    Y68()
})
// @from(Ln 255263, Col 0)
function uH6(q) {
    return q.source
}
// @from(Ln 255267, Col 0)
function vb8() {
    ID.cache?.clear?.()
}
// @from(Ln 255271, Col 0)
function Tb8(q, K, _) {
    let z = {},
        Y = {};
    for (let [P, W] of Object.entries(K))
        if (_[P]?.sensitive === !0) Y[P] = String(W);
        else z[P] = W;
    let A = new Set(Object.keys(Y)),
        O = new Set(Object.keys(z)),
        w = t3(),
        $ = w.read()?.pluginSecrets?.[q] ?? void 0,
        j = $ ? Object.fromEntries(Object.entries($).filter(([P]) => !O.has(P))) : void 0,
        H = j && $ && Object.keys(j).length !== Object.keys($).length;
    if (Object.keys(Y).length > 0 || H) {
        let P = w.read() ?? {};
        if (!P.pluginSecrets) P.pluginSecrets = {};
        P.pluginSecrets[q] = {
            ...j,
            ...Y
        };
        let W = w.update(P);
        if (!W.success) {
            let D = Error(`Failed to save sensitive plugin options for ${q} to secure storage`);
            throw j6(D), D
        }
        if (W.warning) E(`Plugin secrets save warning: ${W.warning}`, {
            level: "warn"
        })
    }
    let J = y7(),
        X = J.pluginConfigs?.[q]?.options ?? {},
        M = Object.keys(X).filter((P) => A.has(P));
    if (Object.keys(z).length > 0 || M.length > 0) {
        if (!J.pluginConfigs) J.pluginConfigs = {};
        if (!J.pluginConfigs[q]) J.pluginConfigs[q] = {};
        let P = Object.fromEntries(M.map((D) => [D, void 0]));
        J.pluginConfigs[q].options = {
            ...z,
            ...P
        };
        let W = P7("userSettings", J);
        if (W.error) throw j6(W.error), Error(`Failed to save plugin options for ${q}: ${W.error.message}`)
    }
    vb8()
}
// @from(Ln 255316, Col 0)
function Vb8(q) {
    if (y7().pluginConfigs?.[q]) {
        let Y = {
                [q]: void 0
            },
            {
                error: A
            } = P7("userSettings", {
                pluginConfigs: Y
            });
        if (A) E(`deletePluginOptions: failed to clear settings.pluginConfigs[${q}]: ${A.message}`, {
            level: "warn"
        })
    }
    let _ = t3(),
        z = _.read();
    if (z?.pluginSecrets) {
        let Y = `${q}/`,
            A = Object.entries(z.pluginSecrets).filter(([O]) => O !== q && !O.startsWith(Y));
        if (A.length !== Object.keys(z.pluginSecrets).length) {
            if (!_.update({
                    ...z,
                    pluginSecrets: A.length > 0 ? Object.fromEntries(A) : void 0
                }).success) E(`deletePluginOptions: failed to clear pluginSecrets for ${q} from keychain`, {
                level: "warn"
            })
        }
    }
    vb8()
}
// @from(Ln 255347, Col 0)
function Ch4(q) {
    let K = q.manifest.userConfig;
    if (!K || Object.keys(K).length === 0) return {};
    let _ = ID(uH6(q));
    if (xH6(_, K).valid) return {};
    let Y = {};
    for (let [A, O] of Object.entries(K))
        if (!xH6({
                [A]: _[A]
            }, {
                [A]: O
            }).valid) Y[A] = O;
    return Y
}
// @from(Ln 255362, Col 0)
function fx(q, K) {
    let _ = (Y) => process.platform === "win32" ? Y.replace(/\\/g, "/") : Y,
        z = q.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, () => _(K.path));
    if (K.source) {
        let Y = K.source;
        z = z.replace(/\$\{CLAUDE_PLUGIN_DATA\}/g, () => _(Is(Y)))
    }
    return z
}
// @from(Ln 255372, Col 0)
function I56(q, K) {
    return q.replace(/\$\{user_config\.([^}]+)\}/g, (_, z) => {
        let Y = K[z];
        if (Y === void 0) throw Error(`Missing required user configuration value: ${z}. This should have been validated before variable substitution.`);
        return String(Y)
    })
}
// @from(Ln 255380, Col 0)
function kb8(q, K, _) {
    return q.replace(/\$\{user_config\.([^}]+)\}/g, (z, Y) => {
        if (_[Y]?.sensitive === !0) return `[sensitive option '${Y}' not available in skill content]`;
        let A = K[Y];
        if (A === void 0) return z;
        return String(A)
    })
}
// @from(Ln 255388, Col 4)
ID
// @from(Ln 255389, Col 4)
Gx = L(() => {
    U4();
    K8();
    U8();
    _46();
    a1();
    W88();
    Jy();
    ID = P1((q) => {
        let _ = y7().pluginConfigs?.[q]?.options ?? {},
            Y = t3().read()?.pluginSecrets?.[q] ?? {};
        return {
            ..._,
            ...Y
        }
    })
})
// @from(Ln 255409, Col 0)
async function Hh6(q, K, _ = {}) {
    let z = V8(),
        Y = _.logLabel ?? "plugin";
    async function A(O, w) {
        try {
            let $ = await z.readdir(O);
            if (_.stopAtSkillDir && $.some((j) => j.isFile() && AJz.test(j.name))) {
                await Promise.all($.map((j) => j.isFile() && j.name.toLowerCase().endsWith(".md") ? K(bh4(O, j.name), w) : void 0));
                return
            }
            await Promise.all($.map((j) => {
                let H = bh4(O, j.name);
                if (j.isDirectory()) return A(H, [...w, j.name]);
                if (j.isFile() && j.name.toLowerCase().endsWith(".md")) return K(H, w);
                return
            }))
        } catch ($) {
            E(`Failed to scan ${Y} directory ${O}: ${$}`, {
                level: "error"
            })
        }
    }
    await A(q, [])
}
// @from(Ln 255433, Col 4)
AJz
// @from(Ln 255434, Col 4)
Nb8 = L(() => {
    K8();
    Yq();
    AJz = /^skill\.md$/i
})
// @from(Ln 255442, Col 0)
async function xh4(q, K, _, z, Y, A) {
    let O = [];
    return await Hh6(q, async (w, $) => {
        let j = await uh4(w, K, $, _, z, Y, A);
        if (j) O.push(j)
    }, {
        logLabel: "agents"
    }), O
}
// @from(Ln 255451, Col 0)
async function uh4(q, K, _, z, Y, A, O) {
    let w = V8();
    if (di(w, q, O)) return null;
    try {
        let $ = await w.readFile(q, {
                encoding: "utf-8"
            }),
            {
                frontmatter: j,
                content: H
            } = p2($, q),
            J = (j.name != null ? String(j.name) : void 0) || OJz(q).replace(/\.md$/, ""),
            M = [K, ..._, J].join(":"),
            P = Wp(j.description, M) ?? Wp(j["when-to-use"], M) ?? `Agent from ${K} plugin`,
            W = x56(j.tools),
            D = yc(j.skills),
            Z = j.color,
            G = j.model,
            f;
        if (typeof G === "string" && G.trim().length > 0) {
            let U = G.trim();
            f = U.toLowerCase() === "inherit" ? "inherit" : U
        }
        let v = j.background,
            V = v === "true" || v === !0 ? !0 : void 0,
            k = fx(H.trim(), {
                path: Y,
                source: z
            });
        if (A.userConfig) k = kb8(k, ID(z), A.userConfig);
        let N = j.memory,
            R;
        if (N !== void 0)
            if (Ih4.includes(N)) R = N;
            else E(`Plugin agent file ${q} has invalid memory value '${N}'. Valid options: ${Ih4.join(", ")}`);
        let C = j.isolation === "worktree" ? "worktree" : void 0,
            x = j.effort,
            B = x !== void 0 ? id(x) : void 0;
        if (x !== void 0 && B === void 0) E(`Plugin agent file ${q} has invalid effort '${x}'. Valid options: ${UI.join(", ")} or an integer`);
        for (let U of ["permissionMode", "hooks", "mcpServers"])
            if (j[U] !== void 0) E(`Plugin agent file ${q} sets ${U}, which is ignored for plugin agents. Use .claude/agents/ for this level of control.`, {
                level: "warn"
            });
        let m = j.maxTurns,
            S = Gh8(m);
        if (m !== void 0 && S === void 0) E(`Plugin agent file ${q} has invalid maxTurns '${m}'. Must be a positive integer.`);
        let F = j.disallowedTools !== void 0 ? x56(j.disallowedTools) : void 0;
        if (x3() && R && W !== void 0) {
            let U = new Set(W);
            for (let g of [IK, J4, xq])
                if (!U.has(g)) W = [...W, g]
        }
        return {
            agentType: M,
            whenToUse: P,
            tools: W,
            ...F !== void 0 && {
                disallowedTools: F
            },
            ...D !== void 0 && {
                skills: D
            },
            getSystemPrompt: () => {
                if (x3() && R) {
                    let U = mH6(M, R);
                    return k + `

` + U
                }
                return k
            },
            source: "plugin",
            color: Z,
            model: f,
            filename: J,
            plugin: z,
            ...V && {
                background: V
            },
            ...R && {
                memory: R
            },
            ...C && {
                isolation: C
            },
            ...B !== void 0 && {
                effort: B
            },
            ...S !== void 0 && {
                maxTurns: S
            }
        }
    } catch ($) {
        return E(`Failed to load agent from ${q}: ${$}`, {
            level: "error"
        }), null
    }
}
// @from(Ln 255550, Col 0)
function Eb8() {
    D88.cache?.clear?.()
}
// @from(Ln 255553, Col 4)
Ih4
// @from(Ln 255553, Col 9)
D88
// @from(Ln 255554, Col 4)
yb8 = L(() => {
    U4();
    VY();
    pp();
    Rz();
    u$();
    K8();
    hf();
    Lf();
    Yq();
    ds();
    vH();
    Gx();
    Nb8();
    Ih4 = ["user", "project", "local"];
    D88 = P1(async () => {
        let {
            enabled: q,
            errors: K
        } = await Gj();
        if (K.length > 0) E(`Plugin loading errors: ${K.map((Y)=>GH(Y)).join(", ")}`);
        let z = (await Promise.all(q.map(async (Y) => {
            let A = new Set,
                O = [];
            if (Y.agentsPath) try {
                let w = await xh4(Y.agentsPath, Y.name, Y.source, Y.path, Y.manifest, A);
                if (O.push(...w), w.length > 0) E(`Loaded ${w.length} agents from plugin ${Y.name} default directory`)
            } catch (w) {
                E(`Failed to load agents from plugin ${Y.name} default directory: ${w}`, {
                    level: "error"
                })
            }
            if (Y.agentsPaths) {
                let w = await Promise.all(Y.agentsPaths.map(async ($) => {
                    try {
                        let H = await V8().stat($);
                        if (H.isDirectory()) {
                            let J = await xh4($, Y.name, Y.source, Y.path, Y.manifest, A);
                            if (J.length > 0) E(`Loaded ${J.length} agents from plugin ${Y.name} custom path: ${$}`);
                            return J
                        } else if (H.isFile() && $.endsWith(".md")) {
                            let J = await uh4($, Y.name, [], Y.source, Y.path, Y.manifest, A);
                            if (J) return E(`Loaded agent from plugin ${Y.name} custom file: ${$}`), [J]
                        }
                        return []
                    } catch (j) {
                        return E(`Failed to load agents from plugin ${Y.name} custom path ${$}: ${j}`, {
                            level: "error"
                        }), []
                    }
                }));
                for (let $ of w) O.push(...$)
            }
            return O
        }))).flat();
        return E(`Total plugin agents loaded: ${z.length}`), z
    })
})
// @from(Ln 255613, Col 0)
function cs(q) {
    if (q === "general-purpose") return;
    let _ = nO8().get(q);
    if (_ && VJ.includes(_)) return QP[_];
    return
}
// @from(Ln 255620, Col 0)
function BH6(q, K) {
    let _ = nO8();
    if (!K) {
        _.delete(q);
        return
    }
    if (VJ.includes(K)) _.set(q, K)
}
// @from(Ln 255628, Col 4)
VJ
// @from(Ln 255628, Col 8)
QP
// @from(Ln 255629, Col 4)
Uf = L(() => {
    y8();
    VJ = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"], QP = {
        red: "red_FOR_SUBAGENTS_ONLY",
        blue: "blue_FOR_SUBAGENTS_ONLY",
        green: "green_FOR_SUBAGENTS_ONLY",
        yellow: "yellow_FOR_SUBAGENTS_ONLY",
        purple: "purple_FOR_SUBAGENTS_ONLY",
        orange: "orange_FOR_SUBAGENTS_ONLY",
        pink: "pink_FOR_SUBAGENTS_ONLY",
        cyan: "cyan_FOR_SUBAGENTS_ONLY"
    }
})
// @from(Ln 255642, Col 4)
kSw
// @from(Ln 255642, Col 9)
NSw
// @from(Ln 255643, Col 4)
mh4 = L(() => {
    p7();
    n7();
    K8();
    e8();
    pp();
    kSw = C6(() => y.object({
        updatedAt: y.string().min(1)
    })), NSw = C6(() => y.object({
        syncedFrom: y.string().min(1)
    }))
})
// @from(Ln 255655, Col 4)
tW = "SendMessage"
// @from(Ln 255657, Col 0)
function $Jz() {
    let q = $H() ? `${xq}, \`find\`, and \`grep\`` : `${xq}, ${T9}, and ${a5}`;
    return `You are the Claude guide agent. Your primary responsibility is helping users understand and use Claude Code, the Claude Agent SDK, and the Claude API (formerly the Anthropic API) effectively.

**Your expertise spans three domains:**

1. **Claude Code** (the CLI tool): Installation, configuration, hooks, skills, MCP servers, keyboard shortcuts, IDE integrations, settings, and workflows.

2. **Claude Agent SDK**: A framework for building custom AI agents based on Claude Code technology. Available for Node.js/TypeScript and Python.

3. **Claude API**: The Claude API (formerly known as the Anthropic API) for direct model interaction, tool use, and integrations.

**Documentation sources:**

- **Claude Code docs** (${wJz}): Fetch this for questions about the Claude Code CLI tool, including:
  - Installation, setup, and getting started
  - Hooks (pre/post command execution)
  - Custom skills
  - MCP server configuration
  - IDE integrations (VS Code, JetBrains)
  - Settings files and configuration
  - Keyboard shortcuts and hotkeys
  - Subagents and plugins
  - Sandboxing and security

- **Claude Agent SDK docs** (${Bh4}): Fetch this for questions about building agents with the SDK, including:
  - SDK overview and getting started (Python and TypeScript)
  - Agent configuration + custom tools
  - Session management and permissions
  - MCP integration in agents
  - Hosting and deployment
  - Cost tracking and context management
  Note: Agent SDK docs are part of the Claude API documentation at the same URL.

- **Claude API docs** (${Bh4}): Fetch this for questions about the Claude API (formerly the Anthropic API), including:
  - Messages API and streaming
  - Tool use (function calling) and Anthropic-defined tools (computer use, code execution, web search, text editor, bash, programmatic tool calling, tool search tool, context editing, Files API, structured outputs)
  - Vision, PDF support, and citations
  - Extended thinking and structured outputs
  - MCP connector for remote MCP servers
  - Cloud provider integrations (Bedrock, Vertex AI, Foundry)

**Approach:**
1. Determine which domain the user's question falls into
2. Use ${PH} to fetch the appropriate docs map
3. Identify the most relevant documentation URLs from the map
4. Fetch the specific documentation pages
5. Provide clear, actionable guidance based on official documentation
6. Use ${hR} if docs don't cover the topic
7. Reference local project files (CLAUDE.md, .claude/ directory) when relevant using ${q}

**Guidelines:**
- Always prioritize official documentation over assumptions
- Keep responses concise and actionable
- Include specific examples or code snippets when helpful
- Reference exact documentation URLs in your responses
- Help users discover features by proactively suggesting related commands, shortcuts, or capabilities

Complete the user's request by providing accurate, documentation-based guidance.`
}
// @from(Ln 255718, Col 0)
function jJz() {
    if (z46()) return `- When you cannot find an answer or the feature doesn't exist, direct the user to ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.ISSUES_EXPLAINER}`;
    return "- When you cannot find an answer or the feature doesn't exist, direct the user to use /feedback to report a feature request or bug"
}
// @from(Ln 255722, Col 4)
wJz = "https://code.claude.com/docs/en/claude_code_docs_map.md"
// @from(Ln 255723, Col 4)
Bh4 = "https://platform.claude.com/llms.txt"
// @from(Ln 255724, Col 4)
ll1 = "claude-code-guide"
// @from(Ln 255725, Col 4)
ph4
// @from(Ln 255726, Col 4)
nl1 = L(() => {
    Rz();
    jJ();
    cy6();
    T7();
    pB();
    a1();
    e8();
    ph4 = {
        agentType: ll1,
        whenToUse: `Use this agent when the user asks questions ("Can Claude...", "Does Claude...", "How do I...") about: (1) Claude Code (the CLI tool) - features, hooks, slash commands, MCP servers, settings, IDE integrations, keyboard shortcuts; (2) Claude Agent SDK - building custom agents; (3) Claude API (formerly Anthropic API) - API usage, tool use, Anthropic SDK usage. **IMPORTANT:** Before spawning a new agent, check if there is already a running or recently completed claude-code-guide agent that you can continue via ${tW}.`,
        tools: $H() ? [S7, xq, PH, hR] : [T9, a5, xq, PH, hR],
        source: "built-in",
        baseDir: "built-in",
        model: "haiku",
        permissionMode: "dontAsk",
        getSystemPrompt({
            toolUseContext: q
        }) {
            let K = q.options.commands,
                _ = [],
                z = K.filter((H) => H.type === "prompt");
            if (z.length > 0) {
                let H = z.map((J) => `- /${J.name}: ${J.description}`).join(`
`);
                _.push(`**Available custom skills in this project:**
${H}`)
            }
            let Y = q.options.agentDefinitions.activeAgents.filter((H) => H.source !== "built-in");
            if (Y.length > 0) {
                let H = Y.map((J) => `- ${J.agentType}: ${J.whenToUse}`).join(`
`);
                _.push(`**Available custom agents configured:**
${H}`)
            }
            let A = q.options.mcpClients;
            if (A && A.length > 0) {
                let H = A.map((J) => `- ${J.name}`).join(`
`);
                _.push(`**Configured MCP servers:**
${H}`)
            }
            let O = K.filter((H) => H.type === "prompt" && H.source === "plugin");
            if (O.length > 0) {
                let H = O.map((J) => `- /${J.name}: ${J.description}`).join(`
`);
                _.push(`**Available plugin skills:**
${H}`)
            }
            let w = y7();
            if (Object.keys(w).length > 0) {
                let H = I6(w, null, 2);
                _.push(`**User's settings.json:**
\`\`\`json
${H}
\`\`\``)
            }
            let $ = jJz(),
                j = `${$Jz()}
${$}`;
            if (_.length > 0) return `${j}

---

# User's Current Configuration

The user has the following custom setup in their environment:

${_.join(`

`)}

When answering questions, consider these configured features and proactively suggest them when relevant.`;
            return j
        }
    }
})
// @from(Ln 255803, Col 4)
Fk = "ExitPlanMode"
// @from(Ln 255804, Col 4)
dP = "ExitPlanMode"
// @from(Ln 255806, Col 0)
function HJz() {
    let q = $H(),
        K = q ? `- Use \`find\` via ${S7} for broad file pattern matching` : `- Use ${T9} for broad file pattern matching`,
        _ = q ? `- Use \`grep\` via ${S7} for searching file contents with regex` : `- Use ${a5} for searching file contents with regex`;
    return `You are a file search specialist for Claude Code, Anthropic's official CLI for Claude. You excel at thoroughly navigating and exploring codebases.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY exploration task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to search and analyze existing code. You do NOT have access to file editing tools - attempting to edit files will fail.

Your strengths:
- Rapidly finding files using glob patterns
- Searching code and text with powerful regex patterns
- Reading and analyzing file contents

Guidelines:
${K}
${_}
- Use ${xq} when you know the specific file path you need to read
- Use ${S7} ONLY for read-only operations (ls, git status, git log, git diff, find${q?", grep":""}, cat, head, tail)
- NEVER use ${S7} for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification
- Adapt your search approach based on the thoroughness level specified by the caller
- Communicate your final report directly as a regular message - do NOT attempt to create files

NOTE: You are meant to be a fast agent that returns output as quickly as possible. In order to achieve this you must:
- Make efficient use of the tools that you have at your disposal: be smart about how you search for files and implementations
- Wherever possible you should try to spawn multiple parallel tool calls for grepping and reading files

Complete the user's search request efficiently and report your findings clearly.`
}
// @from(Ln 255844, Col 4)
Fh4 = 3
// @from(Ln 255845, Col 4)
JJz = 'Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.'
// @from(Ln 255846, Col 4)
Lc
// @from(Ln 255847, Col 4)
Z88 = L(() => {
    Rz();
    u$();
    jJ();
    pB();
    sY();
    Lc = {
        agentType: "Explore",
        whenToUse: JJz,
        disallowedTools: [T4, Fk, J4, IK, HJ],
        source: "built-in",
        baseDir: "built-in",
        model: "haiku",
        omitClaudeMd: !0,
        getSystemPrompt: () => HJz()
    }
})
// @from(Ln 255865, Col 0)
function XJz() {
    return `${"You are an agent for Claude Code, Anthropic's official CLI for Claude. Given the user's message, you should use the tools available to complete the task. Complete the task fully—don't gold-plate, but don't leave it half-done."} When you complete the task, respond with a concise report covering what was done and any key findings — the caller will relay this to the user, so it only needs the essentials.

${`Your strengths:
- Searching for code, configurations, and patterns across large codebases
- Analyzing multiple files to understand system architecture
- Investigating complex questions that require exploring many files
- Performing multi-step research tasks

Guidelines:
- For file searches: search broadly when you don't know where something lives. Use Read when you know the specific file path.
- For analysis: Start broad and narrow down. Use multiple search strategies if the first doesn't yield results.
- Be thorough: Check multiple locations, consider different naming conventions, look for related files.
- NEVER create files unless they're absolutely necessary for achieving your goal. ALWAYS prefer editing an existing file to creating a new one.
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested.`}`
}
// @from(Ln 255881, Col 4)
hc
// @from(Ln 255882, Col 4)
f88 = L(() => {
    hc = {
        agentType: "general-purpose",
        whenToUse: "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you.",
        tools: ["*"],
        source: "built-in",
        baseDir: "built-in",
        getSystemPrompt: XJz
    }
})
// @from(Ln 255893, Col 0)
function MJz() {
    return `You are a software architect and planning specialist for Claude Code. Your role is to explore the codebase and design implementation plans.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY planning task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state

Your role is EXCLUSIVELY to explore the codebase and design implementation plans. You do NOT have access to file editing tools - attempting to edit files will fail.

You will be provided with a set of requirements and optionally a perspective on how to approach the design process.

## Your Process

1. **Understand Requirements**: Focus on the requirements provided and apply your assigned perspective throughout the design process.

2. **Explore Thoroughly**:
   - Read any files provided to you in the initial prompt
   - Find existing patterns and conventions using ${$H()?`\`find\`, \`grep\`, and ${xq}`:`${T9}, ${a5}, and ${xq}`}
   - Understand the current architecture
   - Identify similar features as reference
   - Trace through relevant code paths
   - Use ${S7} ONLY for read-only operations (ls, git status, git log, git diff, find${$H()?", grep":""}, cat, head, tail)
   - NEVER use ${S7} for: mkdir, touch, rm, cp, mv, git add, git commit, npm install, pip install, or any file creation/modification

3. **Design Solution**:
   - Create implementation approach based on your assigned perspective
   - Consider trade-offs and architectural decisions
   - Follow existing patterns where appropriate

4. **Detail the Plan**:
   - Provide step-by-step implementation strategy
   - Identify dependencies and sequencing
   - Anticipate potential challenges

## Required Output

End your response with:

### Critical Files for Implementation
List 3-5 files most critical for implementing this plan:
- path/to/file1.ts
- path/to/file2.ts
- path/to/file3.ts

REMEMBER: You can ONLY explore and plan. You CANNOT and MUST NOT write, edit, or modify any files. You do NOT have access to file editing tools.`
}
// @from(Ln 255945, Col 4)
Lb8
// @from(Ln 255946, Col 4)
il1 = L(() => {
    Rz();
    u$();
    jJ();
    pB();
    sY();
    Z88();
    Lb8 = {
        agentType: "Plan",
        whenToUse: "Software architect agent for designing implementation plans. Use this when you need to plan the implementation strategy for a task. Returns step-by-step plans, identifies critical files, and considers architectural trade-offs.",
        disallowedTools: [T4, Fk, J4, IK, HJ],
        source: "built-in",
        tools: Lc.tools,
        baseDir: "built-in",
        model: "inherit",
        omitClaudeMd: !0,
        getSystemPrompt: () => MJz()
    }
})
// @from(Ln 255965, Col 4)
gh4