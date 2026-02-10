
// @from(Ln 228370, Col 4)
rDA = R((z_w, eQ7) => {
    var Pj1 = d5();
    Zh();
    cY();
    var D4 = Pj1.asn1,
        Wj1 = eQ7.exports = Pj1.pkcs7asn1 = Pj1.pkcs7asn1 || {};
    Pj1.pkcs7 = Pj1.pkcs7 || {};
    Pj1.pkcs7.asn1 = Wj1;
    var sQ7 = {
        name: "ContentInfo",
        tagClass: D4.Class.UNIVERSAL,
        type: D4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "ContentInfo.ContentType",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.OID,
            constructed: !1,
            capture: "contentType"
        }, {
            name: "ContentInfo.content",
            tagClass: D4.Class.CONTEXT_SPECIFIC,
            type: 0,
            constructed: !0,
            optional: !0,
            captureAsn1: "content"
        }]
    };
    Wj1.contentInfoValidator = sQ7;
    var tQ7 = {
        name: "EncryptedContentInfo",
        tagClass: D4.Class.UNIVERSAL,
        type: D4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "EncryptedContentInfo.contentType",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.OID,
            constructed: !1,
            capture: "contentType"
        }, {
            name: "EncryptedContentInfo.contentEncryptionAlgorithm",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "EncryptedContentInfo.contentEncryptionAlgorithm.algorithm",
                tagClass: D4.Class.UNIVERSAL,
                type: D4.Type.OID,
                constructed: !1,
                capture: "encAlgorithm"
            }, {
                name: "EncryptedContentInfo.contentEncryptionAlgorithm.parameter",
                tagClass: D4.Class.UNIVERSAL,
                captureAsn1: "encParameter"
            }]
        }, {
            name: "EncryptedContentInfo.encryptedContent",
            tagClass: D4.Class.CONTEXT_SPECIFIC,
            type: 0,
            capture: "encryptedContent",
            captureAsn1: "encryptedContentAsn1"
        }]
    };
    Wj1.envelopedDataValidator = {
        name: "EnvelopedData",
        tagClass: D4.Class.UNIVERSAL,
        type: D4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "EnvelopedData.Version",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.INTEGER,
            constructed: !1,
            capture: "version"
        }, {
            name: "EnvelopedData.RecipientInfos",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.SET,
            constructed: !0,
            captureAsn1: "recipientInfos"
        }].concat(tQ7)
    };
    Wj1.encryptedDataValidator = {
        name: "EncryptedData",
        tagClass: D4.Class.UNIVERSAL,
        type: D4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "EncryptedData.Version",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.INTEGER,
            constructed: !1,
            capture: "version"
        }].concat(tQ7)
    };
    var nf9 = {
        name: "SignerInfo",
        tagClass: D4.Class.UNIVERSAL,
        type: D4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "SignerInfo.version",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.INTEGER,
            constructed: !1
        }, {
            name: "SignerInfo.issuerAndSerialNumber",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "SignerInfo.issuerAndSerialNumber.issuer",
                tagClass: D4.Class.UNIVERSAL,
                type: D4.Type.SEQUENCE,
                constructed: !0,
                captureAsn1: "issuer"
            }, {
                name: "SignerInfo.issuerAndSerialNumber.serialNumber",
                tagClass: D4.Class.UNIVERSAL,
                type: D4.Type.INTEGER,
                constructed: !1,
                capture: "serial"
            }]
        }, {
            name: "SignerInfo.digestAlgorithm",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "SignerInfo.digestAlgorithm.algorithm",
                tagClass: D4.Class.UNIVERSAL,
                type: D4.Type.OID,
                constructed: !1,
                capture: "digestAlgorithm"
            }, {
                name: "SignerInfo.digestAlgorithm.parameter",
                tagClass: D4.Class.UNIVERSAL,
                constructed: !1,
                captureAsn1: "digestParameter",
                optional: !0
            }]
        }, {
            name: "SignerInfo.authenticatedAttributes",
            tagClass: D4.Class.CONTEXT_SPECIFIC,
            type: 0,
            constructed: !0,
            optional: !0,
            capture: "authenticatedAttributes"
        }, {
            name: "SignerInfo.digestEncryptionAlgorithm",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.SEQUENCE,
            constructed: !0,
            capture: "signatureAlgorithm"
        }, {
            name: "SignerInfo.encryptedDigest",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.OCTETSTRING,
            constructed: !1,
            capture: "signature"
        }, {
            name: "SignerInfo.unauthenticatedAttributes",
            tagClass: D4.Class.CONTEXT_SPECIFIC,
            type: 1,
            constructed: !0,
            optional: !0,
            capture: "unauthenticatedAttributes"
        }]
    };
    Wj1.signedDataValidator = {
        name: "SignedData",
        tagClass: D4.Class.UNIVERSAL,
        type: D4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "SignedData.Version",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.INTEGER,
            constructed: !1,
            capture: "version"
        }, {
            name: "SignedData.DigestAlgorithms",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.SET,
            constructed: !0,
            captureAsn1: "digestAlgorithms"
        }, sQ7, {
            name: "SignedData.Certificates",
            tagClass: D4.Class.CONTEXT_SPECIFIC,
            type: 0,
            optional: !0,
            captureAsn1: "certificates"
        }, {
            name: "SignedData.CertificateRevocationLists",
            tagClass: D4.Class.CONTEXT_SPECIFIC,
            type: 1,
            optional: !0,
            captureAsn1: "crls"
        }, {
            name: "SignedData.SignerInfos",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.SET,
            capture: "signerInfos",
            optional: !0,
            value: [nf9]
        }]
    };
    Wj1.recipientInfoValidator = {
        name: "RecipientInfo",
        tagClass: D4.Class.UNIVERSAL,
        type: D4.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "RecipientInfo.version",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.INTEGER,
            constructed: !1,
            capture: "version"
        }, {
            name: "RecipientInfo.issuerAndSerial",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "RecipientInfo.issuerAndSerial.issuer",
                tagClass: D4.Class.UNIVERSAL,
                type: D4.Type.SEQUENCE,
                constructed: !0,
                captureAsn1: "issuer"
            }, {
                name: "RecipientInfo.issuerAndSerial.serialNumber",
                tagClass: D4.Class.UNIVERSAL,
                type: D4.Type.INTEGER,
                constructed: !1,
                capture: "serial"
            }]
        }, {
            name: "RecipientInfo.keyEncryptionAlgorithm",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "RecipientInfo.keyEncryptionAlgorithm.algorithm",
                tagClass: D4.Class.UNIVERSAL,
                type: D4.Type.OID,
                constructed: !1,
                capture: "encAlgorithm"
            }, {
                name: "RecipientInfo.keyEncryptionAlgorithm.parameter",
                tagClass: D4.Class.UNIVERSAL,
                constructed: !1,
                captureAsn1: "encParameter",
                optional: !0
            }]
        }, {
            name: "RecipientInfo.encryptedKey",
            tagClass: D4.Class.UNIVERSAL,
            type: D4.Type.OCTETSTRING,
            constructed: !1,
            capture: "encKey"
        }]
    }
})
// @from(Ln 228634, Col 4)
oDA = R((w_w, Ag7) => {
    var sq1 = d5();
    cY();
    sq1.mgf = sq1.mgf || {};
    var rf9 = Ag7.exports = sq1.mgf.mgf1 = sq1.mgf1 = sq1.mgf1 || {};
    rf9.create = function(A) {
        var q = {
            generate: function(K, Y) {
                var z = new sq1.util.ByteBuffer,
                    w = Math.ceil(Y / A.digestLength);
                for (var H = 0; H < w; H++) {
                    var $ = new sq1.util.ByteBuffer;
                    $.putInt32(H), A.start(), A.update(K + $.getBytes()), z.putBuffer(A.digest())
                }
                return z.truncate(z.length() - Y), z.getBytes()
            }
        };
        return q
    }
})
// @from(Ln 228654, Col 4)
Kg7 = R((H_w, qg7) => {
    var vO6 = d5();
    oDA();
    qg7.exports = vO6.mgf = vO6.mgf || {};
    vO6.mgf.mgf1 = vO6.mgf1
})
// @from(Ln 228660, Col 4)
EO6 = R(($_w, Yg7) => {
    var tq1 = d5();
    zR();
    cY();
    var of9 = Yg7.exports = tq1.pss = tq1.pss || {};
    of9.create = function(A) {
        if (arguments.length === 3) A = {
            md: arguments[0],
            mgf: arguments[1],
            saltLength: arguments[2]
        };
        var {
            md: q,
            mgf: K
        } = A, Y = q.digestLength, z = A.salt || null;
        if (typeof z === "string") z = tq1.util.createBuffer(z);
        var w;
        if ("saltLength" in A) w = A.saltLength;
        else if (z !== null) w = z.length();
        else throw Error("Salt length not specified or specific salt not given.");
        if (z !== null && z.length() !== w) throw Error("Given salt length does not match length of given salt.");
        var H = A.prng || tq1.random,
            $ = {};
        return $.encode = function(O, _) {
            var J, X = _ - 1,
                D = Math.ceil(X / 8),
                j = O.digest().getBytes();
            if (D < Y + w + 2) throw Error("Message is too long to encrypt.");
            var M;
            if (z === null) M = H.getBytesSync(w);
            else M = z.bytes();
            var P = new tq1.util.ByteBuffer;
            P.fillWithByte(0, 8), P.putBytes(j), P.putBytes(M), q.start(), q.update(P.getBytes());
            var W = q.digest().getBytes(),
                G = new tq1.util.ByteBuffer;
            G.fillWithByte(0, D - w - Y - 2), G.putByte(1), G.putBytes(M);
            var f = G.getBytes(),
                Z = D - Y - 1,
                N = K.generate(W, Z),
                T = "";
            for (J = 0; J < Z; J++) T += String.fromCharCode(f.charCodeAt(J) ^ N.charCodeAt(J));
            var k = 65280 >> 8 * D - X & 255;
            return T = String.fromCharCode(T.charCodeAt(0) & ~k) + T.substr(1), T + W + String.fromCharCode(188)
        }, $.verify = function(O, _, J) {
            var X, D = J - 1,
                j = Math.ceil(D / 8);
            if (_ = _.substr(-j), j < Y + w + 2) throw Error("Inconsistent parameters to PSS signature verification.");
            if (_.charCodeAt(j - 1) !== 188) throw Error("Encoded message does not end in 0xBC.");
            var M = j - Y - 1,
                P = _.substr(0, M),
                W = _.substr(M, Y),
                G = 65280 >> 8 * j - D & 255;
            if ((P.charCodeAt(0) & G) !== 0) throw Error("Bits beyond keysize not zero as expected.");
            var f = K.generate(W, M),
                Z = "";
            for (X = 0; X < M; X++) Z += String.fromCharCode(P.charCodeAt(X) ^ f.charCodeAt(X));
            Z = String.fromCharCode(Z.charCodeAt(0) & ~G) + Z.substr(1);
            var N = j - Y - w - 2;
            for (X = 0; X < N; X++)
                if (Z.charCodeAt(X) !== 0) throw Error("Leftmost octets not zero as expected");
            if (Z.charCodeAt(N) !== 1) throw Error("Inconsistent PSS signature, 0x01 marker not found");
            var T = Z.substr(-w),
                k = new tq1.util.ByteBuffer;
            k.fillWithByte(0, 8), k.putBytes(O), k.putBytes(T), q.start(), q.update(k.getBytes());
            var y = q.digest().getBytes();
            return W === y
        }, $
    }
})
// @from(Ln 228729, Col 4)
RO6 = R((O_w, Og7) => {
    var OK = d5();
    ya();
    Zh();
    Nu1();
    SB();
    Kg7();
    Ca();
    nq1();
    EO6();
    Eu1();
    cY();
    var n1 = OK.asn1,
        S7 = Og7.exports = OK.pki = OK.pki || {},
        hY = S7.oids,
        h_ = {};
    h_.CN = hY.commonName;
    h_.commonName = "CN";
    h_.C = hY.countryName;
    h_.countryName = "C";
    h_.L = hY.localityName;
    h_.localityName = "L";
    h_.ST = hY.stateOrProvinceName;
    h_.stateOrProvinceName = "ST";
    h_.O = hY.organizationName;
    h_.organizationName = "O";
    h_.OU = hY.organizationalUnitName;
    h_.organizationalUnitName = "OU";
    h_.E = hY.emailAddress;
    h_.emailAddress = "E";
    var wg7 = OK.pki.rsa.publicKeyValidator,
        af9 = {
            name: "Certificate",
            tagClass: n1.Class.UNIVERSAL,
            type: n1.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "Certificate.TBSCertificate",
                tagClass: n1.Class.UNIVERSAL,
                type: n1.Type.SEQUENCE,
                constructed: !0,
                captureAsn1: "tbsCertificate",
                value: [{
                    name: "Certificate.TBSCertificate.version",
                    tagClass: n1.Class.CONTEXT_SPECIFIC,
                    type: 0,
                    constructed: !0,
                    optional: !0,
                    value: [{
                        name: "Certificate.TBSCertificate.version.integer",
                        tagClass: n1.Class.UNIVERSAL,
                        type: n1.Type.INTEGER,
                        constructed: !1,
                        capture: "certVersion"
                    }]
                }, {
                    name: "Certificate.TBSCertificate.serialNumber",
                    tagClass: n1.Class.UNIVERSAL,
                    type: n1.Type.INTEGER,
                    constructed: !1,
                    capture: "certSerialNumber"
                }, {
                    name: "Certificate.TBSCertificate.signature",
                    tagClass: n1.Class.UNIVERSAL,
                    type: n1.Type.SEQUENCE,
                    constructed: !0,
                    value: [{
                        name: "Certificate.TBSCertificate.signature.algorithm",
                        tagClass: n1.Class.UNIVERSAL,
                        type: n1.Type.OID,
                        constructed: !1,
                        capture: "certinfoSignatureOid"
                    }, {
                        name: "Certificate.TBSCertificate.signature.parameters",
                        tagClass: n1.Class.UNIVERSAL,
                        optional: !0,
                        captureAsn1: "certinfoSignatureParams"
                    }]
                }, {
                    name: "Certificate.TBSCertificate.issuer",
                    tagClass: n1.Class.UNIVERSAL,
                    type: n1.Type.SEQUENCE,
                    constructed: !0,
                    captureAsn1: "certIssuer"
                }, {
                    name: "Certificate.TBSCertificate.validity",
                    tagClass: n1.Class.UNIVERSAL,
                    type: n1.Type.SEQUENCE,
                    constructed: !0,
                    value: [{
                        name: "Certificate.TBSCertificate.validity.notBefore (utc)",
                        tagClass: n1.Class.UNIVERSAL,
                        type: n1.Type.UTCTIME,
                        constructed: !1,
                        optional: !0,
                        capture: "certValidity1UTCTime"
                    }, {
                        name: "Certificate.TBSCertificate.validity.notBefore (generalized)",
                        tagClass: n1.Class.UNIVERSAL,
                        type: n1.Type.GENERALIZEDTIME,
                        constructed: !1,
                        optional: !0,
                        capture: "certValidity2GeneralizedTime"
                    }, {
                        name: "Certificate.TBSCertificate.validity.notAfter (utc)",
                        tagClass: n1.Class.UNIVERSAL,
                        type: n1.Type.UTCTIME,
                        constructed: !1,
                        optional: !0,
                        capture: "certValidity3UTCTime"
                    }, {
                        name: "Certificate.TBSCertificate.validity.notAfter (generalized)",
                        tagClass: n1.Class.UNIVERSAL,
                        type: n1.Type.GENERALIZEDTIME,
                        constructed: !1,
                        optional: !0,
                        capture: "certValidity4GeneralizedTime"
                    }]
                }, {
                    name: "Certificate.TBSCertificate.subject",
                    tagClass: n1.Class.UNIVERSAL,
                    type: n1.Type.SEQUENCE,
                    constructed: !0,
                    captureAsn1: "certSubject"
                }, wg7, {
                    name: "Certificate.TBSCertificate.issuerUniqueID",
                    tagClass: n1.Class.CONTEXT_SPECIFIC,
                    type: 1,
                    constructed: !0,
                    optional: !0,
                    value: [{
                        name: "Certificate.TBSCertificate.issuerUniqueID.id",
                        tagClass: n1.Class.UNIVERSAL,
                        type: n1.Type.BITSTRING,
                        constructed: !1,
                        captureBitStringValue: "certIssuerUniqueId"
                    }]
                }, {
                    name: "Certificate.TBSCertificate.subjectUniqueID",
                    tagClass: n1.Class.CONTEXT_SPECIFIC,
                    type: 2,
                    constructed: !0,
                    optional: !0,
                    value: [{
                        name: "Certificate.TBSCertificate.subjectUniqueID.id",
                        tagClass: n1.Class.UNIVERSAL,
                        type: n1.Type.BITSTRING,
                        constructed: !1,
                        captureBitStringValue: "certSubjectUniqueId"
                    }]
                }, {
                    name: "Certificate.TBSCertificate.extensions",
                    tagClass: n1.Class.CONTEXT_SPECIFIC,
                    type: 3,
                    constructed: !0,
                    captureAsn1: "certExtensions",
                    optional: !0
                }]
            }, {
                name: "Certificate.signatureAlgorithm",
                tagClass: n1.Class.UNIVERSAL,
                type: n1.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "Certificate.signatureAlgorithm.algorithm",
                    tagClass: n1.Class.UNIVERSAL,
                    type: n1.Type.OID,
                    constructed: !1,
                    capture: "certSignatureOid"
                }, {
                    name: "Certificate.TBSCertificate.signature.parameters",
                    tagClass: n1.Class.UNIVERSAL,
                    optional: !0,
                    captureAsn1: "certSignatureParams"
                }]
            }, {
                name: "Certificate.signatureValue",
                tagClass: n1.Class.UNIVERSAL,
                type: n1.Type.BITSTRING,
                constructed: !1,
                captureBitStringValue: "certSignature"
            }]
        },
        sf9 = {
            name: "rsapss",
            tagClass: n1.Class.UNIVERSAL,
            type: n1.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "rsapss.hashAlgorithm",
                tagClass: n1.Class.CONTEXT_SPECIFIC,
                type: 0,
                constructed: !0,
                value: [{
                    name: "rsapss.hashAlgorithm.AlgorithmIdentifier",
                    tagClass: n1.Class.UNIVERSAL,
                    type: n1.Class.SEQUENCE,
                    constructed: !0,
                    optional: !0,
                    value: [{
                        name: "rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm",
                        tagClass: n1.Class.UNIVERSAL,
                        type: n1.Type.OID,
                        constructed: !1,
                        capture: "hashOid"
                    }]
                }]
            }, {
                name: "rsapss.maskGenAlgorithm",
                tagClass: n1.Class.CONTEXT_SPECIFIC,
                type: 1,
                constructed: !0,
                value: [{
                    name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier",
                    tagClass: n1.Class.UNIVERSAL,
                    type: n1.Class.SEQUENCE,
                    constructed: !0,
                    optional: !0,
                    value: [{
                        name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm",
                        tagClass: n1.Class.UNIVERSAL,
                        type: n1.Type.OID,
                        constructed: !1,
                        capture: "maskGenOid"
                    }, {
                        name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params",
                        tagClass: n1.Class.UNIVERSAL,
                        type: n1.Type.SEQUENCE,
                        constructed: !0,
                        value: [{
                            name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm",
                            tagClass: n1.Class.UNIVERSAL,
                            type: n1.Type.OID,
                            constructed: !1,
                            capture: "maskGenHashOid"
                        }]
                    }]
                }]
            }, {
                name: "rsapss.saltLength",
                tagClass: n1.Class.CONTEXT_SPECIFIC,
                type: 2,
                optional: !0,
                value: [{
                    name: "rsapss.saltLength.saltLength",
                    tagClass: n1.Class.UNIVERSAL,
                    type: n1.Class.INTEGER,
                    constructed: !1,
                    capture: "saltLength"
                }]
            }, {
                name: "rsapss.trailerField",
                tagClass: n1.Class.CONTEXT_SPECIFIC,
                type: 3,
                optional: !0,
                value: [{
                    name: "rsapss.trailer.trailer",
                    tagClass: n1.Class.UNIVERSAL,
                    type: n1.Class.INTEGER,
                    constructed: !1,
                    capture: "trailer"
                }]
            }]
        },
        tf9 = {
            name: "CertificationRequestInfo",
            tagClass: n1.Class.UNIVERSAL,
            type: n1.Type.SEQUENCE,
            constructed: !0,
            captureAsn1: "certificationRequestInfo",
            value: [{
                name: "CertificationRequestInfo.integer",
                tagClass: n1.Class.UNIVERSAL,
                type: n1.Type.INTEGER,
                constructed: !1,
                capture: "certificationRequestInfoVersion"
            }, {
                name: "CertificationRequestInfo.subject",
                tagClass: n1.Class.UNIVERSAL,
                type: n1.Type.SEQUENCE,
                constructed: !0,
                captureAsn1: "certificationRequestInfoSubject"
            }, wg7, {
                name: "CertificationRequestInfo.attributes",
                tagClass: n1.Class.CONTEXT_SPECIFIC,
                type: 0,
                constructed: !0,
                optional: !0,
                capture: "certificationRequestInfoAttributes",
                value: [{
                    name: "CertificationRequestInfo.attributes",
                    tagClass: n1.Class.UNIVERSAL,
                    type: n1.Type.SEQUENCE,
                    constructed: !0,
                    value: [{
                        name: "CertificationRequestInfo.attributes.type",
                        tagClass: n1.Class.UNIVERSAL,
                        type: n1.Type.OID,
                        constructed: !1
                    }, {
                        name: "CertificationRequestInfo.attributes.value",
                        tagClass: n1.Class.UNIVERSAL,
                        type: n1.Type.SET,
                        constructed: !0
                    }]
                }]
            }]
        },
        ef9 = {
            name: "CertificationRequest",
            tagClass: n1.Class.UNIVERSAL,
            type: n1.Type.SEQUENCE,
            constructed: !0,
            captureAsn1: "csr",
            value: [tf9, {
                name: "CertificationRequest.signatureAlgorithm",
                tagClass: n1.Class.UNIVERSAL,
                type: n1.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "CertificationRequest.signatureAlgorithm.algorithm",
                    tagClass: n1.Class.UNIVERSAL,
                    type: n1.Type.OID,
                    constructed: !1,
                    capture: "csrSignatureOid"
                }, {
                    name: "CertificationRequest.signatureAlgorithm.parameters",
                    tagClass: n1.Class.UNIVERSAL,
                    optional: !0,
                    captureAsn1: "csrSignatureParams"
                }]
            }, {
                name: "CertificationRequest.signature",
                tagClass: n1.Class.UNIVERSAL,
                type: n1.Type.BITSTRING,
                constructed: !1,
                captureBitStringValue: "csrSignature"
            }]
        };
    S7.RDNAttributesAsArray = function(A, q) {
        var K = [],
            Y, z, w;
        for (var H = 0; H < A.value.length; ++H) {
            Y = A.value[H];
            for (var $ = 0; $ < Y.value.length; ++$) {
                if (w = {}, z = Y.value[$], w.type = n1.derToOid(z.value[0].value), w.value = z.value[1].value, w.valueTagClass = z.value[1].type, w.type in hY) {
                    if (w.name = hY[w.type], w.name in h_) w.shortName = h_[w.name]
                }
                if (q) q.update(w.type), q.update(w.value);
                K.push(w)
            }
        }
        return K
    };
    S7.CRIAttributesAsArray = function(A) {
        var q = [];
        for (var K = 0; K < A.length; ++K) {
            var Y = A[K],
                z = n1.derToOid(Y.value[0].value),
                w = Y.value[1].value;
            for (var H = 0; H < w.length; ++H) {
                var $ = {};
                if ($.type = z, $.value = w[H].value, $.valueTagClass = w[H].type, $.type in hY) {
                    if ($.name = hY[$.type], $.name in h_) $.shortName = h_[$.name]
                }
                if ($.type === hY.extensionRequest) {
                    $.extensions = [];
                    for (var O = 0; O < $.value.length; ++O) $.extensions.push(S7.certificateExtensionFromAsn1($.value[O]))
                }
                q.push($)
            }
        }
        return q
    };

    function Ia(A, q) {
        if (typeof q === "string") q = {
            shortName: q
        };
        var K = null,
            Y;
        for (var z = 0; K === null && z < A.attributes.length; ++z)
            if (Y = A.attributes[z], q.type && q.type === Y.type) K = Y;
            else if (q.name && q.name === Y.name) K = Y;
        else if (q.shortName && q.shortName === Y.shortName) K = Y;
        return K
    }
    var kO6 = function(A, q, K) {
            var Y = {};
            if (A !== hY["RSASSA-PSS"]) return Y;
            if (K) Y = {
                hash: {
                    algorithmOid: hY.sha1
                },
                mgf: {
                    algorithmOid: hY.mgf1,
                    hash: {
                        algorithmOid: hY.sha1
                    }
                },
                saltLength: 20
            };
            var z = {},
                w = [];
            if (!n1.validate(q, sf9, z, w)) {
                var H = Error("Cannot read RSASSA-PSS parameter block.");
                throw H.errors = w, H
            }
            if (z.hashOid !== void 0) Y.hash = Y.hash || {}, Y.hash.algorithmOid = n1.derToOid(z.hashOid);
            if (z.maskGenOid !== void 0) Y.mgf = Y.mgf || {}, Y.mgf.algorithmOid = n1.derToOid(z.maskGenOid), Y.mgf.hash = Y.mgf.hash || {}, Y.mgf.hash.algorithmOid = n1.derToOid(z.maskGenHashOid);
            if (z.saltLength !== void 0) Y.saltLength = z.saltLength.charCodeAt(0);
            return Y
        },
        LO6 = function(A) {
            switch (hY[A.signatureOid]) {
                case "sha1WithRSAEncryption":
                case "sha1WithRSASignature":
                    return OK.md.sha1.create();
                case "md5WithRSAEncryption":
                    return OK.md.md5.create();
                case "sha256WithRSAEncryption":
                    return OK.md.sha256.create();
                case "sha384WithRSAEncryption":
                    return OK.md.sha384.create();
                case "sha512WithRSAEncryption":
                    return OK.md.sha512.create();
                case "RSASSA-PSS":
                    return OK.md.sha256.create();
                default:
                    var q = Error("Could not compute " + A.type + " digest. Unknown signature OID.");
                    throw q.signatureOid = A.signatureOid, q
            }
        },
        Hg7 = function(A) {
            var q = A.certificate,
                K;
            switch (q.signatureOid) {
                case hY.sha1WithRSAEncryption:
                case hY.sha1WithRSASignature:
                    break;
                case hY["RSASSA-PSS"]:
                    var Y, z;
                    if (Y = hY[q.signatureParameters.mgf.hash.algorithmOid], Y === void 0 || OK.md[Y] === void 0) {
                        var w = Error("Unsupported MGF hash function.");
                        throw w.oid = q.signatureParameters.mgf.hash.algorithmOid, w.name = Y, w
                    }
                    if (z = hY[q.signatureParameters.mgf.algorithmOid], z === void 0 || OK.mgf[z] === void 0) {
                        var w = Error("Unsupported MGF function.");
                        throw w.oid = q.signatureParameters.mgf.algorithmOid, w.name = z, w
                    }
                    if (z = OK.mgf[z].create(OK.md[Y].create()), Y = hY[q.signatureParameters.hash.algorithmOid], Y === void 0 || OK.md[Y] === void 0) {
                        var w = Error("Unsupported RSASSA-PSS hash function.");
                        throw w.oid = q.signatureParameters.hash.algorithmOid, w.name = Y, w
                    }
                    K = OK.pss.create(OK.md[Y].create(), z, q.signatureParameters.saltLength);
                    break
            }
            return q.publicKey.verify(A.md.digest().getBytes(), A.signature, K)
        };
    S7.certificateFromPem = function(A, q, K) {
        var Y = OK.pem.decode(A)[0];
        if (Y.type !== "CERTIFICATE" && Y.type !== "X509 CERTIFICATE" && Y.type !== "TRUSTED CERTIFICATE") {
            var z = Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
            throw z.headerType = Y.type, z
        }
        if (Y.procType && Y.procType.type === "ENCRYPTED") throw Error("Could not convert certificate from PEM; PEM is encrypted.");
        var w = n1.fromDer(Y.body, K);
        return S7.certificateFromAsn1(w, q)
    };
    S7.certificateToPem = function(A, q) {
        var K = {
            type: "CERTIFICATE",
            body: n1.toDer(S7.certificateToAsn1(A)).getBytes()
        };
        return OK.pem.encode(K, {
            maxline: q
        })
    };
    S7.publicKeyFromPem = function(A) {
        var q = OK.pem.decode(A)[0];
        if (q.type !== "PUBLIC KEY" && q.type !== "RSA PUBLIC KEY") {
            var K = Error('Could not convert public key from PEM; PEM header type is not "PUBLIC KEY" or "RSA PUBLIC KEY".');
            throw K.headerType = q.type, K
        }
        if (q.procType && q.procType.type === "ENCRYPTED") throw Error("Could not convert public key from PEM; PEM is encrypted.");
        var Y = n1.fromDer(q.body);
        return S7.publicKeyFromAsn1(Y)
    };
    S7.publicKeyToPem = function(A, q) {
        var K = {
            type: "PUBLIC KEY",
            body: n1.toDer(S7.publicKeyToAsn1(A)).getBytes()
        };
        return OK.pem.encode(K, {
            maxline: q
        })
    };
    S7.publicKeyToRSAPublicKeyPem = function(A, q) {
        var K = {
            type: "RSA PUBLIC KEY",
            body: n1.toDer(S7.publicKeyToRSAPublicKey(A)).getBytes()
        };
        return OK.pem.encode(K, {
            maxline: q
        })
    };
    S7.getPublicKeyFingerprint = function(A, q) {
        q = q || {};
        var K = q.md || OK.md.sha1.create(),
            Y = q.type || "RSAPublicKey",
            z;
        switch (Y) {
            case "RSAPublicKey":
                z = n1.toDer(S7.publicKeyToRSAPublicKey(A)).getBytes();
                break;
            case "SubjectPublicKeyInfo":
                z = n1.toDer(S7.publicKeyToAsn1(A)).getBytes();
                break;
            default:
                throw Error('Unknown fingerprint type "' + q.type + '".')
        }
        K.start(), K.update(z);
        var w = K.digest();
        if (q.encoding === "hex") {
            var H = w.toHex();
            if (q.delimiter) return H.match(/.{2}/g).join(q.delimiter);
            return H
        } else if (q.encoding === "binary") return w.getBytes();
        else if (q.encoding) throw Error('Unknown encoding "' + q.encoding + '".');
        return w
    };
    S7.certificationRequestFromPem = function(A, q, K) {
        var Y = OK.pem.decode(A)[0];
        if (Y.type !== "CERTIFICATE REQUEST") {
            var z = Error('Could not convert certification request from PEM; PEM header type is not "CERTIFICATE REQUEST".');
            throw z.headerType = Y.type, z
        }
        if (Y.procType && Y.procType.type === "ENCRYPTED") throw Error("Could not convert certification request from PEM; PEM is encrypted.");
        var w = n1.fromDer(Y.body, K);
        return S7.certificationRequestFromAsn1(w, q)
    };
    S7.certificationRequestToPem = function(A, q) {
        var K = {
            type: "CERTIFICATE REQUEST",
            body: n1.toDer(S7.certificationRequestToAsn1(A)).getBytes()
        };
        return OK.pem.encode(K, {
            maxline: q
        })
    };
    S7.createCertificate = function() {
        var A = {};
        return A.version = 2, A.serialNumber = "00", A.signatureOid = null, A.signature = null, A.siginfo = {}, A.siginfo.algorithmOid = null, A.validity = {}, A.validity.notBefore = new Date, A.validity.notAfter = new Date, A.issuer = {}, A.issuer.getField = function(q) {
            return Ia(A.issuer, q)
        }, A.issuer.addField = function(q) {
            $R([q]), A.issuer.attributes.push(q)
        }, A.issuer.attributes = [], A.issuer.hash = null, A.subject = {}, A.subject.getField = function(q) {
            return Ia(A.subject, q)
        }, A.subject.addField = function(q) {
            $R([q]), A.subject.attributes.push(q)
        }, A.subject.attributes = [], A.subject.hash = null, A.extensions = [], A.publicKey = null, A.md = null, A.setSubject = function(q, K) {
            if ($R(q), A.subject.attributes = q, delete A.subject.uniqueId, K) A.subject.uniqueId = K;
            A.subject.hash = null
        }, A.setIssuer = function(q, K) {
            if ($R(q), A.issuer.attributes = q, delete A.issuer.uniqueId, K) A.issuer.uniqueId = K;
            A.issuer.hash = null
        }, A.setExtensions = function(q) {
            for (var K = 0; K < q.length; ++K) $g7(q[K], {
                cert: A
            });
            A.extensions = q
        }, A.getExtension = function(q) {
            if (typeof q === "string") q = {
                name: q
            };
            var K = null,
                Y;
            for (var z = 0; K === null && z < A.extensions.length; ++z)
                if (Y = A.extensions[z], q.id && Y.id === q.id) K = Y;
                else if (q.name && Y.name === q.name) K = Y;
            return K
        }, A.sign = function(q, K) {
            A.md = K || OK.md.sha1.create();
            var Y = hY[A.md.algorithm + "WithRSAEncryption"];
            if (!Y) {
                var z = Error("Could not compute certificate digest. Unknown message digest algorithm OID.");
                throw z.algorithm = A.md.algorithm, z
            }
            A.signatureOid = A.siginfo.algorithmOid = Y, A.tbsCertificate = S7.getTBSCertificate(A);
            var w = n1.toDer(A.tbsCertificate);
            A.md.update(w.getBytes()), A.signature = q.sign(A.md)
        }, A.verify = function(q) {
            var K = !1;
            if (!A.issued(q)) {
                var Y = q.issuer,
                    z = A.subject,
                    w = Error("The parent certificate did not issue the given child certificate; the child certificate's issuer does not match the parent's subject.");
                throw w.expectedIssuer = z.attributes, w.actualIssuer = Y.attributes, w
            }
            var H = q.md;
            if (H === null) {
                H = LO6({
                    signatureOid: q.signatureOid,
                    type: "certificate"
                });
                var $ = q.tbsCertificate || S7.getTBSCertificate(q),
                    O = n1.toDer($);
                H.update(O.getBytes())
            }
            if (H !== null) K = Hg7({
                certificate: A,
                md: H,
                signature: q.signature
            });
            return K
        }, A.isIssuer = function(q) {
            var K = !1,
                Y = A.issuer,
                z = q.subject;
            if (Y.hash && z.hash) K = Y.hash === z.hash;
            else if (Y.attributes.length === z.attributes.length) {
                K = !0;
                var w, H;
                for (var $ = 0; K && $ < Y.attributes.length; ++$)
                    if (w = Y.attributes[$], H = z.attributes[$], w.type !== H.type || w.value !== H.value) K = !1
            }
            return K
        }, A.issued = function(q) {
            return q.isIssuer(A)
        }, A.generateSubjectKeyIdentifier = function() {
            return S7.getPublicKeyFingerprint(A.publicKey, {
                type: "RSAPublicKey"
            })
        }, A.verifySubjectKeyIdentifier = function() {
            var q = hY.subjectKeyIdentifier;
            for (var K = 0; K < A.extensions.length; ++K) {
                var Y = A.extensions[K];
                if (Y.id === q) {
                    var z = A.generateSubjectKeyIdentifier().getBytes();
                    return OK.util.hexToBytes(Y.subjectKeyIdentifier) === z
                }
            }
            return !1
        }, A
    };
    S7.certificateFromAsn1 = function(A, q) {
        var K = {},
            Y = [];
        if (!n1.validate(A, af9, K, Y)) {
            var z = Error("Cannot read X.509 certificate. ASN.1 object is not an X509v3 Certificate.");
            throw z.errors = Y, z
        }
        var w = n1.derToOid(K.publicKeyOid);
        if (w !== S7.oids.rsaEncryption) throw Error("Cannot read public key. OID is not RSA.");
        var H = S7.createCertificate();
        H.version = K.certVersion ? K.certVersion.charCodeAt(0) : 0;
        var $ = OK.util.createBuffer(K.certSerialNumber);
        H.serialNumber = $.toHex(), H.signatureOid = OK.asn1.derToOid(K.certSignatureOid), H.signatureParameters = kO6(H.signatureOid, K.certSignatureParams, !0), H.siginfo.algorithmOid = OK.asn1.derToOid(K.certinfoSignatureOid), H.siginfo.parameters = kO6(H.siginfo.algorithmOid, K.certinfoSignatureParams, !1), H.signature = K.certSignature;
        var O = [];
        if (K.certValidity1UTCTime !== void 0) O.push(n1.utcTimeToDate(K.certValidity1UTCTime));
        if (K.certValidity2GeneralizedTime !== void 0) O.push(n1.generalizedTimeToDate(K.certValidity2GeneralizedTime));
        if (K.certValidity3UTCTime !== void 0) O.push(n1.utcTimeToDate(K.certValidity3UTCTime));
        if (K.certValidity4GeneralizedTime !== void 0) O.push(n1.generalizedTimeToDate(K.certValidity4GeneralizedTime));
        if (O.length > 2) throw Error("Cannot read notBefore/notAfter validity times; more than two times were provided in the certificate.");
        if (O.length < 2) throw Error("Cannot read notBefore/notAfter validity times; they were not provided as either UTCTime or GeneralizedTime.");
        if (H.validity.notBefore = O[0], H.validity.notAfter = O[1], H.tbsCertificate = K.tbsCertificate, q) {
            H.md = LO6({
                signatureOid: H.signatureOid,
                type: "certificate"
            });
            var _ = n1.toDer(H.tbsCertificate);
            H.md.update(_.getBytes())
        }
        var J = OK.md.sha1.create(),
            X = n1.toDer(K.certIssuer);
        if (J.update(X.getBytes()), H.issuer.getField = function(M) {
                return Ia(H.issuer, M)
            }, H.issuer.addField = function(M) {
                $R([M]), H.issuer.attributes.push(M)
            }, H.issuer.attributes = S7.RDNAttributesAsArray(K.certIssuer), K.certIssuerUniqueId) H.issuer.uniqueId = K.certIssuerUniqueId;
        H.issuer.hash = J.digest().toHex();
        var D = OK.md.sha1.create(),
            j = n1.toDer(K.certSubject);
        if (D.update(j.getBytes()), H.subject.getField = function(M) {
                return Ia(H.subject, M)
            }, H.subject.addField = function(M) {
                $R([M]), H.subject.attributes.push(M)
            }, H.subject.attributes = S7.RDNAttributesAsArray(K.certSubject), K.certSubjectUniqueId) H.subject.uniqueId = K.certSubjectUniqueId;
        if (H.subject.hash = D.digest().toHex(), K.certExtensions) H.extensions = S7.certificateExtensionsFromAsn1(K.certExtensions);
        else H.extensions = [];
        return H.publicKey = S7.publicKeyFromAsn1(K.subjectPublicKeyInfo), H
    };
    S7.certificateExtensionsFromAsn1 = function(A) {
        var q = [];
        for (var K = 0; K < A.value.length; ++K) {
            var Y = A.value[K];
            for (var z = 0; z < Y.value.length; ++z) q.push(S7.certificateExtensionFromAsn1(Y.value[z]))
        }
        return q
    };
    S7.certificateExtensionFromAsn1 = function(A) {
        var q = {};
        if (q.id = n1.derToOid(A.value[0].value), q.critical = !1, A.value[1].type === n1.Type.BOOLEAN) q.critical = A.value[1].value.charCodeAt(0) !== 0, q.value = A.value[2].value;
        else q.value = A.value[1].value;
        if (q.id in hY) {
            if (q.name = hY[q.id], q.name === "keyUsage") {
                var K = n1.fromDer(q.value),
                    Y = 0,
                    z = 0;
                if (K.value.length > 1) Y = K.value.charCodeAt(1), z = K.value.length > 2 ? K.value.charCodeAt(2) : 0;
                q.digitalSignature = (Y & 128) === 128, q.nonRepudiation = (Y & 64) === 64, q.keyEncipherment = (Y & 32) === 32, q.dataEncipherment = (Y & 16) === 16, q.keyAgreement = (Y & 8) === 8, q.keyCertSign = (Y & 4) === 4, q.cRLSign = (Y & 2) === 2, q.encipherOnly = (Y & 1) === 1, q.decipherOnly = (z & 128) === 128
            } else if (q.name === "basicConstraints") {
                var K = n1.fromDer(q.value);
                if (K.value.length > 0 && K.value[0].type === n1.Type.BOOLEAN) q.cA = K.value[0].value.charCodeAt(0) !== 0;
                else q.cA = !1;
                var w = null;
                if (K.value.length > 0 && K.value[0].type === n1.Type.INTEGER) w = K.value[0].value;
                else if (K.value.length > 1) w = K.value[1].value;
                if (w !== null) q.pathLenConstraint = n1.derToInteger(w)
            } else if (q.name === "extKeyUsage") {
                var K = n1.fromDer(q.value);
                for (var H = 0; H < K.value.length; ++H) {
                    var $ = n1.derToOid(K.value[H].value);
                    if ($ in hY) q[hY[$]] = !0;
                    else q[$] = !0
                }
            } else if (q.name === "nsCertType") {
                var K = n1.fromDer(q.value),
                    Y = 0;
                if (K.value.length > 1) Y = K.value.charCodeAt(1);
                q.client = (Y & 128) === 128, q.server = (Y & 64) === 64, q.email = (Y & 32) === 32, q.objsign = (Y & 16) === 16, q.reserved = (Y & 8) === 8, q.sslCA = (Y & 4) === 4, q.emailCA = (Y & 2) === 2, q.objCA = (Y & 1) === 1
            } else if (q.name === "subjectAltName" || q.name === "issuerAltName") {
                q.altNames = [];
                var O, K = n1.fromDer(q.value);
                for (var _ = 0; _ < K.value.length; ++_) {
                    O = K.value[_];
                    var J = {
                        type: O.type,
                        value: O.value
                    };
                    switch (q.altNames.push(J), O.type) {
                        case 1:
                        case 2:
                        case 6:
                            break;
                        case 7:
                            J.ip = OK.util.bytesToIP(O.value);
                            break;
                        case 8:
                            J.oid = n1.derToOid(O.value);
                            break;
                        default:
                    }
                }
            } else if (q.name === "subjectKeyIdentifier") {
                var K = n1.fromDer(q.value);
                q.subjectKeyIdentifier = OK.util.bytesToHex(K.value)
            }
        }
        return q
    };
    S7.certificationRequestFromAsn1 = function(A, q) {
        var K = {},
            Y = [];
        if (!n1.validate(A, ef9, K, Y)) {
            var z = Error("Cannot read PKCS#10 certificate request. ASN.1 object is not a PKCS#10 CertificationRequest.");
            throw z.errors = Y, z
        }
        var w = n1.derToOid(K.publicKeyOid);
        if (w !== S7.oids.rsaEncryption) throw Error("Cannot read public key. OID is not RSA.");
        var H = S7.createCertificationRequest();
        if (H.version = K.csrVersion ? K.csrVersion.charCodeAt(0) : 0, H.signatureOid = OK.asn1.derToOid(K.csrSignatureOid), H.signatureParameters = kO6(H.signatureOid, K.csrSignatureParams, !0), H.siginfo.algorithmOid = OK.asn1.derToOid(K.csrSignatureOid), H.siginfo.parameters = kO6(H.siginfo.algorithmOid, K.csrSignatureParams, !1), H.signature = K.csrSignature, H.certificationRequestInfo = K.certificationRequestInfo, q) {
            H.md = LO6({
                signatureOid: H.signatureOid,
                type: "certification request"
            });
            var $ = n1.toDer(H.certificationRequestInfo);
            H.md.update($.getBytes())
        }
        var O = OK.md.sha1.create();
        return H.subject.getField = function(_) {
            return Ia(H.subject, _)
        }, H.subject.addField = function(_) {
            $R([_]), H.subject.attributes.push(_)
        }, H.subject.attributes = S7.RDNAttributesAsArray(K.certificationRequestInfoSubject, O), H.subject.hash = O.digest().toHex(), H.publicKey = S7.publicKeyFromAsn1(K.subjectPublicKeyInfo), H.getAttribute = function(_) {
            return Ia(H, _)
        }, H.addAttribute = function(_) {
            $R([_]), H.attributes.push(_)
        }, H.attributes = S7.CRIAttributesAsArray(K.certificationRequestInfoAttributes || []), H
    };
    S7.createCertificationRequest = function() {
        var A = {};
        return A.version = 0, A.signatureOid = null, A.signature = null, A.siginfo = {}, A.siginfo.algorithmOid = null, A.subject = {}, A.subject.getField = function(q) {
            return Ia(A.subject, q)
        }, A.subject.addField = function(q) {
            $R([q]), A.subject.attributes.push(q)
        }, A.subject.attributes = [], A.subject.hash = null, A.publicKey = null, A.attributes = [], A.getAttribute = function(q) {
            return Ia(A, q)
        }, A.addAttribute = function(q) {
            $R([q]), A.attributes.push(q)
        }, A.md = null, A.setSubject = function(q) {
            $R(q), A.subject.attributes = q, A.subject.hash = null
        }, A.setAttributes = function(q) {
            $R(q), A.attributes = q
        }, A.sign = function(q, K) {
            A.md = K || OK.md.sha1.create();
            var Y = hY[A.md.algorithm + "WithRSAEncryption"];
            if (!Y) {
                var z = Error("Could not compute certification request digest. Unknown message digest algorithm OID.");
                throw z.algorithm = A.md.algorithm, z
            }
            A.signatureOid = A.siginfo.algorithmOid = Y, A.certificationRequestInfo = S7.getCertificationRequestInfo(A);
            var w = n1.toDer(A.certificationRequestInfo);
            A.md.update(w.getBytes()), A.signature = q.sign(A.md)
        }, A.verify = function() {
            var q = !1,
                K = A.md;
            if (K === null) {
                K = LO6({
                    signatureOid: A.signatureOid,
                    type: "certification request"
                });
                var Y = A.certificationRequestInfo || S7.getCertificationRequestInfo(A),
                    z = n1.toDer(Y);
                K.update(z.getBytes())
            }
            if (K !== null) q = Hg7({
                certificate: A,
                md: K,
                signature: A.signature
            });
            return q
        }, A
    };

    function Gj1(A) {
        var q = n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, []),
            K, Y, z = A.attributes;
        for (var w = 0; w < z.length; ++w) {
            K = z[w];
            var H = K.value,
                $ = n1.Type.PRINTABLESTRING;
            if ("valueTagClass" in K) {
                if ($ = K.valueTagClass, $ === n1.Type.UTF8) H = OK.util.encodeUtf8(H)
            }
            Y = n1.create(n1.Class.UNIVERSAL, n1.Type.SET, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.OID, !1, n1.oidToDer(K.type).getBytes()), n1.create(n1.Class.UNIVERSAL, $, !1, H)])]), q.value.push(Y)
        }
        return q
    }

    function $R(A) {
        var q;
        for (var K = 0; K < A.length; ++K) {
            if (q = A[K], typeof q.name > "u") {
                if (q.type && q.type in S7.oids) q.name = S7.oids[q.type];
                else if (q.shortName && q.shortName in h_) q.name = S7.oids[h_[q.shortName]]
            }
            if (typeof q.type > "u")
                if (q.name && q.name in S7.oids) q.type = S7.oids[q.name];
                else {
                    var Y = Error("Attribute type not specified.");
                    throw Y.attribute = q, Y
                } if (typeof q.shortName > "u") {
                if (q.name && q.name in h_) q.shortName = h_[q.name]
            }
            if (q.type === hY.extensionRequest) {
                if (q.valueConstructed = !0, q.valueTagClass = n1.Type.SEQUENCE, !q.value && q.extensions) {
                    q.value = [];
                    for (var z = 0; z < q.extensions.length; ++z) q.value.push(S7.certificateExtensionToAsn1($g7(q.extensions[z])))
                }
            }
            if (typeof q.value > "u") {
                var Y = Error("Attribute value not specified.");
                throw Y.attribute = q, Y
            }
        }
    }

    function $g7(A, q) {
        if (q = q || {}, typeof A.name > "u") {
            if (A.id && A.id in S7.oids) A.name = S7.oids[A.id]
        }
        if (typeof A.id > "u")
            if (A.name && A.name in S7.oids) A.id = S7.oids[A.name];
            else {
                var K = Error("Extension ID not specified.");
                throw K.extension = A, K
            } if (typeof A.value < "u") return A;
        if (A.name === "keyUsage") {
            var Y = 0,
                z = 0,
                w = 0;
            if (A.digitalSignature) z |= 128, Y = 7;
            if (A.nonRepudiation) z |= 64, Y = 6;
            if (A.keyEncipherment) z |= 32, Y = 5;
            if (A.dataEncipherment) z |= 16, Y = 4;
            if (A.keyAgreement) z |= 8, Y = 3;
            if (A.keyCertSign) z |= 4, Y = 2;
            if (A.cRLSign) z |= 2, Y = 1;
            if (A.encipherOnly) z |= 1, Y = 0;
            if (A.decipherOnly) w |= 128, Y = 7;
            var H = String.fromCharCode(Y);
            if (w !== 0) H += String.fromCharCode(z) + String.fromCharCode(w);
            else if (z !== 0) H += String.fromCharCode(z);
            A.value = n1.create(n1.Class.UNIVERSAL, n1.Type.BITSTRING, !1, H)
        } else if (A.name === "basicConstraints") {
            if (A.value = n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, []), A.cA) A.value.value.push(n1.create(n1.Class.UNIVERSAL, n1.Type.BOOLEAN, !1, String.fromCharCode(255)));
            if ("pathLenConstraint" in A) A.value.value.push(n1.create(n1.Class.UNIVERSAL, n1.Type.INTEGER, !1, n1.integerToDer(A.pathLenConstraint).getBytes()))
        } else if (A.name === "extKeyUsage") {
            A.value = n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, []);
            var $ = A.value.value;
            for (var O in A) {
                if (A[O] !== !0) continue;
                if (O in hY) $.push(n1.create(n1.Class.UNIVERSAL, n1.Type.OID, !1, n1.oidToDer(hY[O]).getBytes()));
                else if (O.indexOf(".") !== -1) $.push(n1.create(n1.Class.UNIVERSAL, n1.Type.OID, !1, n1.oidToDer(O).getBytes()))
            }
        } else if (A.name === "nsCertType") {
            var Y = 0,
                z = 0;
            if (A.client) z |= 128, Y = 7;
            if (A.server) z |= 64, Y = 6;
            if (A.email) z |= 32, Y = 5;
            if (A.objsign) z |= 16, Y = 4;
            if (A.reserved) z |= 8, Y = 3;
            if (A.sslCA) z |= 4, Y = 2;
            if (A.emailCA) z |= 2, Y = 1;
            if (A.objCA) z |= 1, Y = 0;
            var H = String.fromCharCode(Y);
            if (z !== 0) H += String.fromCharCode(z);
            A.value = n1.create(n1.Class.UNIVERSAL, n1.Type.BITSTRING, !1, H)
        } else if (A.name === "subjectAltName" || A.name === "issuerAltName") {
            A.value = n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, []);
            var _;
            for (var J = 0; J < A.altNames.length; ++J) {
                _ = A.altNames[J];
                var H = _.value;
                if (_.type === 7 && _.ip) {
                    if (H = OK.util.bytesFromIP(_.ip), H === null) {
                        var K = Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
                        throw K.extension = A, K
                    }
                } else if (_.type === 8)
                    if (_.oid) H = n1.oidToDer(n1.oidToDer(_.oid));
                    else H = n1.oidToDer(H);
                A.value.value.push(n1.create(n1.Class.CONTEXT_SPECIFIC, _.type, !1, H))
            }
        } else if (A.name === "nsComment" && q.cert) {
            if (!/^[\x00-\x7F]*$/.test(A.comment) || A.comment.length < 1 || A.comment.length > 128) throw Error('Invalid "nsComment" content.');
            A.value = n1.create(n1.Class.UNIVERSAL, n1.Type.IA5STRING, !1, A.comment)
        } else if (A.name === "subjectKeyIdentifier" && q.cert) {
            var X = q.cert.generateSubjectKeyIdentifier();
            A.subjectKeyIdentifier = X.toHex(), A.value = n1.create(n1.Class.UNIVERSAL, n1.Type.OCTETSTRING, !1, X.getBytes())
        } else if (A.name === "authorityKeyIdentifier" && q.cert) {
            A.value = n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, []);
            var $ = A.value.value;
            if (A.keyIdentifier) {
                var D = A.keyIdentifier === !0 ? q.cert.generateSubjectKeyIdentifier().getBytes() : A.keyIdentifier;
                $.push(n1.create(n1.Class.CONTEXT_SPECIFIC, 0, !1, D))
            }
            if (A.authorityCertIssuer) {
                var j = [n1.create(n1.Class.CONTEXT_SPECIFIC, 4, !0, [Gj1(A.authorityCertIssuer === !0 ? q.cert.issuer : A.authorityCertIssuer)])];
                $.push(n1.create(n1.Class.CONTEXT_SPECIFIC, 1, !0, j))
            }
            if (A.serialNumber) {
                var M = OK.util.hexToBytes(A.serialNumber === !0 ? q.cert.serialNumber : A.serialNumber);
                $.push(n1.create(n1.Class.CONTEXT_SPECIFIC, 2, !1, M))
            }
        } else if (A.name === "cRLDistributionPoints") {
            A.value = n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, []);
            var $ = A.value.value,
                P = n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, []),
                W = n1.create(n1.Class.CONTEXT_SPECIFIC, 0, !0, []),
                _;
            for (var J = 0; J < A.altNames.length; ++J) {
                _ = A.altNames[J];
                var H = _.value;
                if (_.type === 7 && _.ip) {
                    if (H = OK.util.bytesFromIP(_.ip), H === null) {
                        var K = Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
                        throw K.extension = A, K
                    }
                } else if (_.type === 8)
                    if (_.oid) H = n1.oidToDer(n1.oidToDer(_.oid));
                    else H = n1.oidToDer(H);
                W.value.push(n1.create(n1.Class.CONTEXT_SPECIFIC, _.type, !1, H))
            }
            P.value.push(n1.create(n1.Class.CONTEXT_SPECIFIC, 0, !0, [W])), $.push(P)
        }
        if (typeof A.value > "u") {
            var K = Error("Extension value not specified.");
            throw K.extension = A, K
        }
        return A
    }

    function aDA(A, q) {
        switch (A) {
            case hY["RSASSA-PSS"]:
                var K = [];
                if (q.hash.algorithmOid !== void 0) K.push(n1.create(n1.Class.CONTEXT_SPECIFIC, 0, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.OID, !1, n1.oidToDer(q.hash.algorithmOid).getBytes()), n1.create(n1.Class.UNIVERSAL, n1.Type.NULL, !1, "")])]));
                if (q.mgf.algorithmOid !== void 0) K.push(n1.create(n1.Class.CONTEXT_SPECIFIC, 1, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.OID, !1, n1.oidToDer(q.mgf.algorithmOid).getBytes()), n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.OID, !1, n1.oidToDer(q.mgf.hash.algorithmOid).getBytes()), n1.create(n1.Class.UNIVERSAL, n1.Type.NULL, !1, "")])])]));
                if (q.saltLength !== void 0) K.push(n1.create(n1.Class.CONTEXT_SPECIFIC, 2, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.INTEGER, !1, n1.integerToDer(q.saltLength).getBytes())]));
                return n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, K);
            default:
                return n1.create(n1.Class.UNIVERSAL, n1.Type.NULL, !1, "")
        }
    }

    function AV9(A) {
        var q = n1.create(n1.Class.CONTEXT_SPECIFIC, 0, !0, []);
        if (A.attributes.length === 0) return q;
        var K = A.attributes;
        for (var Y = 0; Y < K.length; ++Y) {
            var z = K[Y],
                w = z.value,
                H = n1.Type.UTF8;
            if ("valueTagClass" in z) H = z.valueTagClass;
            if (H === n1.Type.UTF8) w = OK.util.encodeUtf8(w);
            var $ = !1;
            if ("valueConstructed" in z) $ = z.valueConstructed;
            var O = n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.OID, !1, n1.oidToDer(z.type).getBytes()), n1.create(n1.Class.UNIVERSAL, n1.Type.SET, !0, [n1.create(n1.Class.UNIVERSAL, H, $, w)])]);
            q.value.push(O)
        }
        return q
    }
    var qV9 = new Date("1950-01-01T00:00:00Z"),
        KV9 = new Date("2050-01-01T00:00:00Z");

    function zg7(A) {
        if (A >= qV9 && A < KV9) return n1.create(n1.Class.UNIVERSAL, n1.Type.UTCTIME, !1, n1.dateToUtcTime(A));
        else return n1.create(n1.Class.UNIVERSAL, n1.Type.GENERALIZEDTIME, !1, n1.dateToGeneralizedTime(A))
    }
    S7.getTBSCertificate = function(A) {
        var q = zg7(A.validity.notBefore),
            K = zg7(A.validity.notAfter),
            Y = n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, [n1.create(n1.Class.CONTEXT_SPECIFIC, 0, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.INTEGER, !1, n1.integerToDer(A.version).getBytes())]), n1.create(n1.Class.UNIVERSAL, n1.Type.INTEGER, !1, OK.util.hexToBytes(A.serialNumber)), n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.OID, !1, n1.oidToDer(A.siginfo.algorithmOid).getBytes()), aDA(A.siginfo.algorithmOid, A.siginfo.parameters)]), Gj1(A.issuer), n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, [q, K]), Gj1(A.subject), S7.publicKeyToAsn1(A.publicKey)]);
        if (A.issuer.uniqueId) Y.value.push(n1.create(n1.Class.CONTEXT_SPECIFIC, 1, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.BITSTRING, !1, String.fromCharCode(0) + A.issuer.uniqueId)]));
        if (A.subject.uniqueId) Y.value.push(n1.create(n1.Class.CONTEXT_SPECIFIC, 2, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.BITSTRING, !1, String.fromCharCode(0) + A.subject.uniqueId)]));
        if (A.extensions.length > 0) Y.value.push(S7.certificateExtensionsToAsn1(A.extensions));
        return Y
    };
    S7.getCertificationRequestInfo = function(A) {
        var q = n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.INTEGER, !1, n1.integerToDer(A.version).getBytes()), Gj1(A.subject), S7.publicKeyToAsn1(A.publicKey), AV9(A)]);
        return q
    };
    S7.distinguishedNameToAsn1 = function(A) {
        return Gj1(A)
    };
    S7.certificateToAsn1 = function(A) {
        var q = A.tbsCertificate || S7.getTBSCertificate(A);
        return n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, [q, n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.OID, !1, n1.oidToDer(A.signatureOid).getBytes()), aDA(A.signatureOid, A.signatureParameters)]), n1.create(n1.Class.UNIVERSAL, n1.Type.BITSTRING, !1, String.fromCharCode(0) + A.signature)])
    };
    S7.certificateExtensionsToAsn1 = function(A) {
        var q = n1.create(n1.Class.CONTEXT_SPECIFIC, 3, !0, []),
            K = n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, []);
        q.value.push(K);
        for (var Y = 0; Y < A.length; ++Y) K.value.push(S7.certificateExtensionToAsn1(A[Y]));
        return q
    };
    S7.certificateExtensionToAsn1 = function(A) {
        var q = n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, []);
        if (q.value.push(n1.create(n1.Class.UNIVERSAL, n1.Type.OID, !1, n1.oidToDer(A.id).getBytes())), A.critical) q.value.push(n1.create(n1.Class.UNIVERSAL, n1.Type.BOOLEAN, !1, String.fromCharCode(255)));
        var K = A.value;
        if (typeof A.value !== "string") K = n1.toDer(K).getBytes();
        return q.value.push(n1.create(n1.Class.UNIVERSAL, n1.Type.OCTETSTRING, !1, K)), q
    };
    S7.certificationRequestToAsn1 = function(A) {
        var q = A.certificationRequestInfo || S7.getCertificationRequestInfo(A);
        return n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, [q, n1.create(n1.Class.UNIVERSAL, n1.Type.SEQUENCE, !0, [n1.create(n1.Class.UNIVERSAL, n1.Type.OID, !1, n1.oidToDer(A.signatureOid).getBytes()), aDA(A.signatureOid, A.signatureParameters)]), n1.create(n1.Class.UNIVERSAL, n1.Type.BITSTRING, !1, String.fromCharCode(0) + A.signature)])
    };
    S7.createCaStore = function(A) {
        var q = {
            certs: {}
        };
        q.getIssuer = function(H) {
            var $ = K(H.issuer);
            return $
        }, q.addCertificate = function(H) {
            if (typeof H === "string") H = OK.pki.certificateFromPem(H);
            if (Y(H.subject), !q.hasCertificate(H))
                if (H.subject.hash in q.certs) {
                    var $ = q.certs[H.subject.hash];
                    if (!OK.util.isArray($)) $ = [$];
                    $.push(H), q.certs[H.subject.hash] = $
                } else q.certs[H.subject.hash] = H
        }, q.hasCertificate = function(H) {
            if (typeof H === "string") H = OK.pki.certificateFromPem(H);
            var $ = K(H.subject);
            if (!$) return !1;
            if (!OK.util.isArray($)) $ = [$];
            var O = n1.toDer(S7.certificateToAsn1(H)).getBytes();
            for (var _ = 0; _ < $.length; ++_) {
                var J = n1.toDer(S7.certificateToAsn1($[_])).getBytes();
                if (O === J) return !0
            }
            return !1
        }, q.listAllCertificates = function() {
            var H = [];
            for (var $ in q.certs)
                if (q.certs.hasOwnProperty($)) {
                    var O = q.certs[$];
                    if (!OK.util.isArray(O)) H.push(O);
                    else
                        for (var _ = 0; _ < O.length; ++_) H.push(O[_])
                } return H
        }, q.removeCertificate = function(H) {
            var $;
            if (typeof H === "string") H = OK.pki.certificateFromPem(H);
            if (Y(H.subject), !q.hasCertificate(H)) return null;
            var O = K(H.subject);
            if (!OK.util.isArray(O)) return $ = q.certs[H.subject.hash], delete q.certs[H.subject.hash], $;
            var _ = n1.toDer(S7.certificateToAsn1(H)).getBytes();
            for (var J = 0; J < O.length; ++J) {
                var X = n1.toDer(S7.certificateToAsn1(O[J])).getBytes();
                if (_ === X) $ = O[J], O.splice(J, 1)
            }
            if (O.length === 0) delete q.certs[H.subject.hash];
            return $
        };

        function K(H) {
            return Y(H), q.certs[H.hash] || null
        }

        function Y(H) {
            if (!H.hash) {
                var $ = OK.md.sha1.create();
                H.attributes = S7.RDNAttributesAsArray(Gj1(H), $), H.hash = $.digest().toHex()
            }
        }
        if (A)
            for (var z = 0; z < A.length; ++z) {
                var w = A[z];
                q.addCertificate(w)
            }
        return q
    };
    S7.certificateError = {
        bad_certificate: "forge.pki.BadCertificate",
        unsupported_certificate: "forge.pki.UnsupportedCertificate",
        certificate_revoked: "forge.pki.CertificateRevoked",
        certificate_expired: "forge.pki.CertificateExpired",
        certificate_unknown: "forge.pki.CertificateUnknown",
        unknown_ca: "forge.pki.UnknownCertificateAuthority"
    };
    S7.verifyCertificateChain = function(A, q, K) {
        if (typeof K === "function") K = {
            verify: K
        };
        K = K || {}, q = q.slice(0);
        var Y = q.slice(0),
            z = K.validityCheckDate;
        if (typeof z > "u") z = new Date;
        var w = !0,
            H = null,
            $ = 0;
        do {
            var O = q.shift(),
                _ = null,
                J = !1;
            if (z) {
                if (z < O.validity.notBefore || z > O.validity.notAfter) H = {
                    message: "Certificate is not valid yet or has expired.",
                    error: S7.certificateError.certificate_expired,
                    notBefore: O.validity.notBefore,
                    notAfter: O.validity.notAfter,
                    now: z
                }
            }
            if (H === null) {
                if (_ = q[0] || A.getIssuer(O), _ === null) {
                    if (O.isIssuer(O)) J = !0, _ = O
                }
                if (_) {
                    var X = _;
                    if (!OK.util.isArray(X)) X = [X];
                    var D = !1;
                    while (!D && X.length > 0) {
                        _ = X.shift();
                        try {
                            D = _.verify(O)
                        } catch (T) {}
                    }
                    if (!D) H = {
                        message: "Certificate signature is invalid.",
                        error: S7.certificateError.bad_certificate
                    }
                }
                if (H === null && (!_ || J) && !A.hasCertificate(O)) H = {
                    message: "Certificate is not trusted.",
                    error: S7.certificateError.unknown_ca
                }
            }
            if (H === null && _ && !O.isIssuer(_)) H = {
                message: "Certificate issuer is invalid.",
                error: S7.certificateError.bad_certificate
            };
            if (H === null) {
                var j = {
                    keyUsage: !0,
                    basicConstraints: !0
                };
                for (var M = 0; H === null && M < O.extensions.length; ++M) {
                    var P = O.extensions[M];
                    if (P.critical && !(P.name in j)) H = {
                        message: "Certificate has an unsupported critical extension.",
                        error: S7.certificateError.unsupported_certificate
                    }
                }
            }
            if (H === null && (!w || q.length === 0 && (!_ || J))) {
                var W = O.getExtension("basicConstraints"),
                    G = O.getExtension("keyUsage");
                if (G !== null) {
                    if (!G.keyCertSign || W === null) H = {
                        message: "Certificate keyUsage or basicConstraints conflict or indicate that the certificate is not a CA. If the certificate is the only one in the chain or isn't the first then the certificate must be a valid CA.",
                        error: S7.certificateError.bad_certificate
                    }
                }
                if (H === null && W !== null && !W.cA) H = {
                    message: "Certificate basicConstraints indicates the certificate is not a CA.",
                    error: S7.certificateError.bad_certificate
                };
                if (H === null && G !== null && "pathLenConstraint" in W) {
                    var f = $ - 1;
                    if (f > W.pathLenConstraint) H = {
                        message: "Certificate basicConstraints pathLenConstraint violated.",
                        error: S7.certificateError.bad_certificate
                    }
                }
            }
            var Z = H === null ? !0 : H.error,
                N = K.verify ? K.verify(Z, $, Y) : Z;
            if (N === !0) H = null;
            else {
                if (Z === !0) H = {
                    message: "The application rejected the certificate.",
                    error: S7.certificateError.bad_certificate
                };
                if (N || N === 0) {
                    if (typeof N === "object" && !OK.util.isArray(N)) {
                        if (N.message) H.message = N.message;
                        if (N.error) H.error = N.error
                    } else if (typeof N === "string") H.error = N
                }
                throw H
            }
            w = !1, ++$
        } while (q.length > 0);
        return !0
    }
})
// @from(Ln 229981, Col 4)
tDA = R((__w, Jg7) => {
    var NH = d5();
    Zh();
    Jj1();
    Ca();
    rDA();
    nDA();
    zR();
    Eu1();
    Mj1();
    cY();
    RO6();
    var {
        asn1: C6,
        pki: F9
    } = NH, Lu1 = Jg7.exports = NH.pkcs12 = NH.pkcs12 || {}, _g7 = {
        name: "ContentInfo",
        tagClass: C6.Class.UNIVERSAL,
        type: C6.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "ContentInfo.contentType",
            tagClass: C6.Class.UNIVERSAL,
            type: C6.Type.OID,
            constructed: !1,
            capture: "contentType"
        }, {
            name: "ContentInfo.content",
            tagClass: C6.Class.CONTEXT_SPECIFIC,
            constructed: !0,
            captureAsn1: "content"
        }]
    }, YV9 = {
        name: "PFX",
        tagClass: C6.Class.UNIVERSAL,
        type: C6.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "PFX.version",
            tagClass: C6.Class.UNIVERSAL,
            type: C6.Type.INTEGER,
            constructed: !1,
            capture: "version"
        }, _g7, {
            name: "PFX.macData",
            tagClass: C6.Class.UNIVERSAL,
            type: C6.Type.SEQUENCE,
            constructed: !0,
            optional: !0,
            captureAsn1: "mac",
            value: [{
                name: "PFX.macData.mac",
                tagClass: C6.Class.UNIVERSAL,
                type: C6.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "PFX.macData.mac.digestAlgorithm",
                    tagClass: C6.Class.UNIVERSAL,
                    type: C6.Type.SEQUENCE,
                    constructed: !0,
                    value: [{
                        name: "PFX.macData.mac.digestAlgorithm.algorithm",
                        tagClass: C6.Class.UNIVERSAL,
                        type: C6.Type.OID,
                        constructed: !1,
                        capture: "macAlgorithm"
                    }, {
                        name: "PFX.macData.mac.digestAlgorithm.parameters",
                        tagClass: C6.Class.UNIVERSAL,
                        captureAsn1: "macAlgorithmParameters"
                    }]
                }, {
                    name: "PFX.macData.mac.digest",
                    tagClass: C6.Class.UNIVERSAL,
                    type: C6.Type.OCTETSTRING,
                    constructed: !1,
                    capture: "macDigest"
                }]
            }, {
                name: "PFX.macData.macSalt",
                tagClass: C6.Class.UNIVERSAL,
                type: C6.Type.OCTETSTRING,
                constructed: !1,
                capture: "macSalt"
            }, {
                name: "PFX.macData.iterations",
                tagClass: C6.Class.UNIVERSAL,
                type: C6.Type.INTEGER,
                constructed: !1,
                optional: !0,
                capture: "macIterations"
            }]
        }]
    }, zV9 = {
        name: "SafeBag",
        tagClass: C6.Class.UNIVERSAL,
        type: C6.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "SafeBag.bagId",
            tagClass: C6.Class.UNIVERSAL,
            type: C6.Type.OID,
            constructed: !1,
            capture: "bagId"
        }, {
            name: "SafeBag.bagValue",
            tagClass: C6.Class.CONTEXT_SPECIFIC,
            constructed: !0,
            captureAsn1: "bagValue"
        }, {
            name: "SafeBag.bagAttributes",
            tagClass: C6.Class.UNIVERSAL,
            type: C6.Type.SET,
            constructed: !0,
            optional: !0,
            capture: "bagAttributes"
        }]
    }, wV9 = {
        name: "Attribute",
        tagClass: C6.Class.UNIVERSAL,
        type: C6.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "Attribute.attrId",
            tagClass: C6.Class.UNIVERSAL,
            type: C6.Type.OID,
            constructed: !1,
            capture: "oid"
        }, {
            name: "Attribute.attrValues",
            tagClass: C6.Class.UNIVERSAL,
            type: C6.Type.SET,
            constructed: !0,
            capture: "values"
        }]
    }, HV9 = {
        name: "CertBag",
        tagClass: C6.Class.UNIVERSAL,
        type: C6.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "CertBag.certId",
            tagClass: C6.Class.UNIVERSAL,
            type: C6.Type.OID,
            constructed: !1,
            capture: "certId"
        }, {
            name: "CertBag.certValue",
            tagClass: C6.Class.CONTEXT_SPECIFIC,
            constructed: !0,
            value: [{
                name: "CertBag.certValue[0]",
                tagClass: C6.Class.UNIVERSAL,
                type: C6.Class.OCTETSTRING,
                constructed: !1,
                capture: "cert"
            }]
        }]
    };

    function ku1(A, q, K, Y) {
        var z = [];
        for (var w = 0; w < A.length; w++)
            for (var H = 0; H < A[w].safeBags.length; H++) {
                var $ = A[w].safeBags[H];
                if (Y !== void 0 && $.type !== Y) continue;
                if (q === null) {
                    z.push($);
                    continue
                }
                if ($.attributes[q] !== void 0 && $.attributes[q].indexOf(K) >= 0) z.push($)
            }
        return z
    }
    Lu1.pkcs12FromAsn1 = function(A, q, K) {
        if (typeof q === "string") K = q, q = !0;
        else if (q === void 0) q = !0;
        var Y = {},
            z = [];
        if (!C6.validate(A, YV9, Y, z)) {
            var w = Error("Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.");
            throw w.errors = w, w
        }
        var H = {
            version: Y.version.charCodeAt(0),
            safeContents: [],
            getBags: function(W) {
                var G = {},
                    f;
                if ("localKeyId" in W) f = W.localKeyId;
                else if ("localKeyIdHex" in W) f = NH.util.hexToBytes(W.localKeyIdHex);
                if (f === void 0 && !("friendlyName" in W) && "bagType" in W) G[W.bagType] = ku1(H.safeContents, null, null, W.bagType);
                if (f !== void 0) G.localKeyId = ku1(H.safeContents, "localKeyId", f, W.bagType);
                if ("friendlyName" in W) G.friendlyName = ku1(H.safeContents, "friendlyName", W.friendlyName, W.bagType);
                return G
            },
            getBagsByFriendlyName: function(W, G) {
                return ku1(H.safeContents, "friendlyName", W, G)
            },
            getBagsByLocalKeyId: function(W, G) {
                return ku1(H.safeContents, "localKeyId", W, G)
            }
        };
        if (Y.version.charCodeAt(0) !== 3) {
            var w = Error("PKCS#12 PFX of version other than 3 not supported.");
            throw w.version = Y.version.charCodeAt(0), w
        }
        if (C6.derToOid(Y.contentType) !== F9.oids.data) {
            var w = Error("Only PKCS#12 PFX in password integrity mode supported.");
            throw w.oid = C6.derToOid(Y.contentType), w
        }
        var $ = Y.content.value[0];
        if ($.tagClass !== C6.Class.UNIVERSAL || $.type !== C6.Type.OCTETSTRING) throw Error("PKCS#12 authSafe content data is not an OCTET STRING.");
        if ($ = sDA($), Y.mac) {
            var O = null,
                _ = 0,
                J = C6.derToOid(Y.macAlgorithm);
            switch (J) {
                case F9.oids.sha1:
                    O = NH.md.sha1.create(), _ = 20;
                    break;
                case F9.oids.sha256:
                    O = NH.md.sha256.create(), _ = 32;
                    break;
                case F9.oids.sha384:
                    O = NH.md.sha384.create(), _ = 48;
                    break;
                case F9.oids.sha512:
                    O = NH.md.sha512.create(), _ = 64;
                    break;
                case F9.oids.md5:
                    O = NH.md.md5.create(), _ = 16;
                    break
            }
            if (O === null) throw Error("PKCS#12 uses unsupported MAC algorithm: " + J);
            var X = new NH.util.ByteBuffer(Y.macSalt),
                D = "macIterations" in Y ? parseInt(NH.util.bytesToHex(Y.macIterations), 16) : 1,
                j = Lu1.generateKey(K, X, 3, D, _, O),
                M = NH.hmac.create();
            M.start(O, j), M.update($.value);
            var P = M.getMac();
            if (P.getBytes() !== Y.macDigest) throw Error("PKCS#12 MAC could not be verified. Invalid password?")
        }
        return $V9(H, $.value, q, K), H
    };

    function sDA(A) {
        if (A.composed || A.constructed) {
            var q = NH.util.createBuffer();
            for (var K = 0; K < A.value.length; ++K) q.putBytes(A.value[K].value);
            A.composed = A.constructed = !1, A.value = q.getBytes()
        }
        return A
    }

    function $V9(A, q, K, Y) {
        if (q = C6.fromDer(q, K), q.tagClass !== C6.Class.UNIVERSAL || q.type !== C6.Type.SEQUENCE || q.constructed !== !0) throw Error("PKCS#12 AuthenticatedSafe expected to be a SEQUENCE OF ContentInfo");
        for (var z = 0; z < q.value.length; z++) {
            var w = q.value[z],
                H = {},
                $ = [];
            if (!C6.validate(w, _g7, H, $)) {
                var O = Error("Cannot read ContentInfo.");
                throw O.errors = $, O
            }
            var _ = {
                    encrypted: !1
                },
                J = null,
                X = H.content.value[0];
            switch (C6.derToOid(H.contentType)) {
                case F9.oids.data:
                    if (X.tagClass !== C6.Class.UNIVERSAL || X.type !== C6.Type.OCTETSTRING) throw Error("PKCS#12 SafeContents Data is not an OCTET STRING.");
                    J = sDA(X).value;
                    break;
                case F9.oids.encryptedData:
                    J = OV9(X, Y), _.encrypted = !0;
                    break;
                default:
                    var O = Error("Unsupported PKCS#12 contentType.");
                    throw O.contentType = C6.derToOid(H.contentType), O
            }
            _.safeBags = _V9(J, K, Y), A.safeContents.push(_)
        }
    }

    function OV9(A, q) {
        var K = {},
            Y = [];
        if (!C6.validate(A, NH.pkcs7.asn1.encryptedDataValidator, K, Y)) {
            var z = Error("Cannot read EncryptedContentInfo.");
            throw z.errors = Y, z
        }
        var w = C6.derToOid(K.contentType);
        if (w !== F9.oids.data) {
            var z = Error("PKCS#12 EncryptedContentInfo ContentType is not Data.");
            throw z.oid = w, z
        }
        w = C6.derToOid(K.encAlgorithm);
        var H = F9.pbe.getCipher(w, K.encParameter, q),
            $ = sDA(K.encryptedContentAsn1),
            O = NH.util.createBuffer($.value);
        if (H.update(O), !H.finish()) throw Error("Failed to decrypt PKCS#12 SafeContents.");
        return H.output.getBytes()
    }

    function _V9(A, q, K) {
        if (!q && A.length === 0) return [];
        if (A = C6.fromDer(A, q), A.tagClass !== C6.Class.UNIVERSAL || A.type !== C6.Type.SEQUENCE || A.constructed !== !0) throw Error("PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag.");
        var Y = [];
        for (var z = 0; z < A.value.length; z++) {
            var w = A.value[z],
                H = {},
                $ = [];
            if (!C6.validate(w, zV9, H, $)) {
                var O = Error("Cannot read SafeBag.");
                throw O.errors = $, O
            }
            var _ = {
                type: C6.derToOid(H.bagId),
                attributes: JV9(H.bagAttributes)
            };
            Y.push(_);
            var J, X, D = H.bagValue.value[0];
            switch (_.type) {
                case F9.oids.pkcs8ShroudedKeyBag:
                    if (D = F9.decryptPrivateKeyInfo(D, K), D === null) throw Error("Unable to decrypt PKCS#8 ShroudedKeyBag, wrong password?");
                case F9.oids.keyBag:
                    try {
                        _.key = F9.privateKeyFromAsn1(D)
                    } catch (M) {
                        _.key = null, _.asn1 = D
                    }
                    continue;
                case F9.oids.certBag:
                    J = HV9, X = function() {
                        if (C6.derToOid(H.certId) !== F9.oids.x509Certificate) {
                            var M = Error("Unsupported certificate type, only X.509 supported.");
                            throw M.oid = C6.derToOid(H.certId), M
                        }
                        var P = C6.fromDer(H.cert, q);
                        try {
                            _.cert = F9.certificateFromAsn1(P, !0)
                        } catch (W) {
                            _.cert = null, _.asn1 = P
                        }
                    };
                    break;
                default:
                    var O = Error("Unsupported PKCS#12 SafeBag type.");
                    throw O.oid = _.type, O
            }
            if (J !== void 0 && !C6.validate(D, J, H, $)) {
                var O = Error("Cannot read PKCS#12 " + J.name);
                throw O.errors = $, O
            }
            X()
        }
        return Y
    }

    function JV9(A) {
        var q = {};
        if (A !== void 0)
            for (var K = 0; K < A.length; ++K) {
                var Y = {},
                    z = [];
                if (!C6.validate(A[K], wV9, Y, z)) {
                    var w = Error("Cannot read PKCS#12 BagAttribute.");
                    throw w.errors = z, w
                }
                var H = C6.derToOid(Y.oid);
                if (F9.oids[H] === void 0) continue;
                q[F9.oids[H]] = [];
                for (var $ = 0; $ < Y.values.length; ++$) q[F9.oids[H]].push(Y.values[$].value)
            }
        return q
    }
    Lu1.toPkcs12Asn1 = function(A, q, K, Y) {
        if (Y = Y || {}, Y.saltSize = Y.saltSize || 8, Y.count = Y.count || 2048, Y.algorithm = Y.algorithm || Y.encAlgorithm || "aes128", !("useMac" in Y)) Y.useMac = !0;
        if (!("localKeyId" in Y)) Y.localKeyId = null;
        if (!("generateLocalKeyId" in Y)) Y.generateLocalKeyId = !0;
        var z = Y.localKeyId,
            w;
        if (z !== null) z = NH.util.hexToBytes(z);
        else if (Y.generateLocalKeyId)
            if (q) {
                var H = NH.util.isArray(q) ? q[0] : q;
                if (typeof H === "string") H = F9.certificateFromPem(H);
                var $ = NH.md.sha1.create();
                $.update(C6.toDer(F9.certificateToAsn1(H)).getBytes()), z = $.digest().getBytes()
            } else z = NH.random.getBytes(20);
        var O = [];
        if (z !== null) O.push(C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.OID, !1, C6.oidToDer(F9.oids.localKeyId).getBytes()), C6.create(C6.Class.UNIVERSAL, C6.Type.SET, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.OCTETSTRING, !1, z)])]));
        if ("friendlyName" in Y) O.push(C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.OID, !1, C6.oidToDer(F9.oids.friendlyName).getBytes()), C6.create(C6.Class.UNIVERSAL, C6.Type.SET, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.BMPSTRING, !1, Y.friendlyName)])]));
        if (O.length > 0) w = C6.create(C6.Class.UNIVERSAL, C6.Type.SET, !0, O);
        var _ = [],
            J = [];
        if (q !== null)
            if (NH.util.isArray(q)) J = q;
            else J = [q];
        var X = [];
        for (var D = 0; D < J.length; ++D) {
            if (q = J[D], typeof q === "string") q = F9.certificateFromPem(q);
            var j = D === 0 ? w : void 0,
                M = F9.certificateToAsn1(q),
                P = C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.OID, !1, C6.oidToDer(F9.oids.certBag).getBytes()), C6.create(C6.Class.CONTEXT_SPECIFIC, 0, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.OID, !1, C6.oidToDer(F9.oids.x509Certificate).getBytes()), C6.create(C6.Class.CONTEXT_SPECIFIC, 0, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.OCTETSTRING, !1, C6.toDer(M).getBytes())])])]), j]);
            X.push(P)
        }
        if (X.length > 0) {
            var W = C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, X),
                G = C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.OID, !1, C6.oidToDer(F9.oids.data).getBytes()), C6.create(C6.Class.CONTEXT_SPECIFIC, 0, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.OCTETSTRING, !1, C6.toDer(W).getBytes())])]);
            _.push(G)
        }
        var f = null;
        if (A !== null) {
            var Z = F9.wrapRsaPrivateKey(F9.privateKeyToAsn1(A));
            if (K === null) f = C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.OID, !1, C6.oidToDer(F9.oids.keyBag).getBytes()), C6.create(C6.Class.CONTEXT_SPECIFIC, 0, !0, [Z]), w]);
            else f = C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.OID, !1, C6.oidToDer(F9.oids.pkcs8ShroudedKeyBag).getBytes()), C6.create(C6.Class.CONTEXT_SPECIFIC, 0, !0, [F9.encryptPrivateKeyInfo(Z, K, Y)]), w]);
            var N = C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, [f]),
                T = C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.OID, !1, C6.oidToDer(F9.oids.data).getBytes()), C6.create(C6.Class.CONTEXT_SPECIFIC, 0, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.OCTETSTRING, !1, C6.toDer(N).getBytes())])]);
            _.push(T)
        }
        var k = C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, _),
            y;
        if (Y.useMac) {
            var $ = NH.md.sha1.create(),
                B = new NH.util.ByteBuffer(NH.random.getBytes(Y.saltSize)),
                S = Y.count,
                A = Lu1.generateKey(K, B, 3, S, 20),
                m = NH.hmac.create();
            m.start($, A), m.update(C6.toDer(k).getBytes());
            var b = m.getMac();
            y = C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.OID, !1, C6.oidToDer(F9.oids.sha1).getBytes()), C6.create(C6.Class.UNIVERSAL, C6.Type.NULL, !1, "")]), C6.create(C6.Class.UNIVERSAL, C6.Type.OCTETSTRING, !1, b.getBytes())]), C6.create(C6.Class.UNIVERSAL, C6.Type.OCTETSTRING, !1, B.getBytes()), C6.create(C6.Class.UNIVERSAL, C6.Type.INTEGER, !1, C6.integerToDer(S).getBytes())])
        }
        return C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.INTEGER, !1, C6.integerToDer(3).getBytes()), C6.create(C6.Class.UNIVERSAL, C6.Type.SEQUENCE, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.OID, !1, C6.oidToDer(F9.oids.data).getBytes()), C6.create(C6.Class.CONTEXT_SPECIFIC, 0, !0, [C6.create(C6.Class.UNIVERSAL, C6.Type.OCTETSTRING, !1, C6.toDer(k).getBytes())])]), y])
    };
    Lu1.generateKey = NH.pbe.generatePkcs12Key
})
// @from(Ln 230420, Col 4)
A0A = R((J_w, Xg7) => {
    var xa = d5();
    Zh();
    Ca();
    nDA();
    nq1();
    GO6();
    tDA();
    EO6();
    Eu1();
    cY();
    RO6();
    var eDA = xa.asn1,
        Zj1 = Xg7.exports = xa.pki = xa.pki || {};
    Zj1.pemToDer = function(A) {
        var q = xa.pem.decode(A)[0];
        if (q.procType && q.procType.type === "ENCRYPTED") throw Error("Could not convert PEM to DER; PEM is encrypted.");
        return xa.util.createBuffer(q.body)
    };
    Zj1.privateKeyFromPem = function(A) {
        var q = xa.pem.decode(A)[0];
        if (q.type !== "PRIVATE KEY" && q.type !== "RSA PRIVATE KEY") {
            var K = Error('Could not convert private key from PEM; PEM header type is not "PRIVATE KEY" or "RSA PRIVATE KEY".');
            throw K.headerType = q.type, K
        }
        if (q.procType && q.procType.type === "ENCRYPTED") throw Error("Could not convert private key from PEM; PEM is encrypted.");
        var Y = eDA.fromDer(q.body);
        return Zj1.privateKeyFromAsn1(Y)
    };
    Zj1.privateKeyToPem = function(A, q) {
        var K = {
            type: "RSA PRIVATE KEY",
            body: eDA.toDer(Zj1.privateKeyToAsn1(A)).getBytes()
        };
        return xa.pem.encode(K, {
            maxline: q
        })
    };
    Zj1.privateKeyInfoToPem = function(A, q) {
        var K = {
            type: "PRIVATE KEY",
            body: eDA.toDer(A).getBytes()
        };
        return xa.pem.encode(K, {
            maxline: q
        })
    }
})