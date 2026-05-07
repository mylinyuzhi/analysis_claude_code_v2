
// @from(Ln 249182, Col 4)
zb8 = p((Mhw, HL4) => {
    var u5 = p_();
    V56();
    mp();
    _88();
    Zc();
    YL4();
    k56();
    NH6();
    qb8();
    A88();
    RA();
    var O8 = u5.asn1,
        aq = HL4.exports = u5.pki = u5.pki || {},
        wA = aq.oids,
        MX = {};
    MX.CN = wA.commonName;
    MX.commonName = "CN";
    MX.C = wA.countryName;
    MX.countryName = "C";
    MX.L = wA.localityName;
    MX.localityName = "L";
    MX.ST = wA.stateOrProvinceName;
    MX.stateOrProvinceName = "ST";
    MX.O = wA.organizationName;
    MX.organizationName = "O";
    MX.OU = wA.organizationalUnitName;
    MX.organizationalUnitName = "OU";
    MX.E = wA.emailAddress;
    MX.emailAddress = "E";
    var wL4 = u5.pki.rsa.publicKeyValidator,
        zjz = {
            name: "Certificate",
            tagClass: O8.Class.UNIVERSAL,
            type: O8.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "Certificate.TBSCertificate",
                tagClass: O8.Class.UNIVERSAL,
                type: O8.Type.SEQUENCE,
                constructed: !0,
                captureAsn1: "tbsCertificate",
                value: [{
                    name: "Certificate.TBSCertificate.version",
                    tagClass: O8.Class.CONTEXT_SPECIFIC,
                    type: 0,
                    constructed: !0,
                    optional: !0,
                    value: [{
                        name: "Certificate.TBSCertificate.version.integer",
                        tagClass: O8.Class.UNIVERSAL,
                        type: O8.Type.INTEGER,
                        constructed: !1,
                        capture: "certVersion"
                    }]
                }, {
                    name: "Certificate.TBSCertificate.serialNumber",
                    tagClass: O8.Class.UNIVERSAL,
                    type: O8.Type.INTEGER,
                    constructed: !1,
                    capture: "certSerialNumber"
                }, {
                    name: "Certificate.TBSCertificate.signature",
                    tagClass: O8.Class.UNIVERSAL,
                    type: O8.Type.SEQUENCE,
                    constructed: !0,
                    value: [{
                        name: "Certificate.TBSCertificate.signature.algorithm",
                        tagClass: O8.Class.UNIVERSAL,
                        type: O8.Type.OID,
                        constructed: !1,
                        capture: "certinfoSignatureOid"
                    }, {
                        name: "Certificate.TBSCertificate.signature.parameters",
                        tagClass: O8.Class.UNIVERSAL,
                        optional: !0,
                        captureAsn1: "certinfoSignatureParams"
                    }]
                }, {
                    name: "Certificate.TBSCertificate.issuer",
                    tagClass: O8.Class.UNIVERSAL,
                    type: O8.Type.SEQUENCE,
                    constructed: !0,
                    captureAsn1: "certIssuer"
                }, {
                    name: "Certificate.TBSCertificate.validity",
                    tagClass: O8.Class.UNIVERSAL,
                    type: O8.Type.SEQUENCE,
                    constructed: !0,
                    value: [{
                        name: "Certificate.TBSCertificate.validity.notBefore (utc)",
                        tagClass: O8.Class.UNIVERSAL,
                        type: O8.Type.UTCTIME,
                        constructed: !1,
                        optional: !0,
                        capture: "certValidity1UTCTime"
                    }, {
                        name: "Certificate.TBSCertificate.validity.notBefore (generalized)",
                        tagClass: O8.Class.UNIVERSAL,
                        type: O8.Type.GENERALIZEDTIME,
                        constructed: !1,
                        optional: !0,
                        capture: "certValidity2GeneralizedTime"
                    }, {
                        name: "Certificate.TBSCertificate.validity.notAfter (utc)",
                        tagClass: O8.Class.UNIVERSAL,
                        type: O8.Type.UTCTIME,
                        constructed: !1,
                        optional: !0,
                        capture: "certValidity3UTCTime"
                    }, {
                        name: "Certificate.TBSCertificate.validity.notAfter (generalized)",
                        tagClass: O8.Class.UNIVERSAL,
                        type: O8.Type.GENERALIZEDTIME,
                        constructed: !1,
                        optional: !0,
                        capture: "certValidity4GeneralizedTime"
                    }]
                }, {
                    name: "Certificate.TBSCertificate.subject",
                    tagClass: O8.Class.UNIVERSAL,
                    type: O8.Type.SEQUENCE,
                    constructed: !0,
                    captureAsn1: "certSubject"
                }, wL4, {
                    name: "Certificate.TBSCertificate.issuerUniqueID",
                    tagClass: O8.Class.CONTEXT_SPECIFIC,
                    type: 1,
                    constructed: !0,
                    optional: !0,
                    value: [{
                        name: "Certificate.TBSCertificate.issuerUniqueID.id",
                        tagClass: O8.Class.UNIVERSAL,
                        type: O8.Type.BITSTRING,
                        constructed: !1,
                        captureBitStringValue: "certIssuerUniqueId"
                    }]
                }, {
                    name: "Certificate.TBSCertificate.subjectUniqueID",
                    tagClass: O8.Class.CONTEXT_SPECIFIC,
                    type: 2,
                    constructed: !0,
                    optional: !0,
                    value: [{
                        name: "Certificate.TBSCertificate.subjectUniqueID.id",
                        tagClass: O8.Class.UNIVERSAL,
                        type: O8.Type.BITSTRING,
                        constructed: !1,
                        captureBitStringValue: "certSubjectUniqueId"
                    }]
                }, {
                    name: "Certificate.TBSCertificate.extensions",
                    tagClass: O8.Class.CONTEXT_SPECIFIC,
                    type: 3,
                    constructed: !0,
                    captureAsn1: "certExtensions",
                    optional: !0
                }]
            }, {
                name: "Certificate.signatureAlgorithm",
                tagClass: O8.Class.UNIVERSAL,
                type: O8.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "Certificate.signatureAlgorithm.algorithm",
                    tagClass: O8.Class.UNIVERSAL,
                    type: O8.Type.OID,
                    constructed: !1,
                    capture: "certSignatureOid"
                }, {
                    name: "Certificate.TBSCertificate.signature.parameters",
                    tagClass: O8.Class.UNIVERSAL,
                    optional: !0,
                    captureAsn1: "certSignatureParams"
                }]
            }, {
                name: "Certificate.signatureValue",
                tagClass: O8.Class.UNIVERSAL,
                type: O8.Type.BITSTRING,
                constructed: !1,
                captureBitStringValue: "certSignature"
            }]
        },
        Yjz = {
            name: "rsapss",
            tagClass: O8.Class.UNIVERSAL,
            type: O8.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "rsapss.hashAlgorithm",
                tagClass: O8.Class.CONTEXT_SPECIFIC,
                type: 0,
                constructed: !0,
                value: [{
                    name: "rsapss.hashAlgorithm.AlgorithmIdentifier",
                    tagClass: O8.Class.UNIVERSAL,
                    type: O8.Class.SEQUENCE,
                    constructed: !0,
                    optional: !0,
                    value: [{
                        name: "rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm",
                        tagClass: O8.Class.UNIVERSAL,
                        type: O8.Type.OID,
                        constructed: !1,
                        capture: "hashOid"
                    }]
                }]
            }, {
                name: "rsapss.maskGenAlgorithm",
                tagClass: O8.Class.CONTEXT_SPECIFIC,
                type: 1,
                constructed: !0,
                value: [{
                    name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier",
                    tagClass: O8.Class.UNIVERSAL,
                    type: O8.Class.SEQUENCE,
                    constructed: !0,
                    optional: !0,
                    value: [{
                        name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm",
                        tagClass: O8.Class.UNIVERSAL,
                        type: O8.Type.OID,
                        constructed: !1,
                        capture: "maskGenOid"
                    }, {
                        name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params",
                        tagClass: O8.Class.UNIVERSAL,
                        type: O8.Type.SEQUENCE,
                        constructed: !0,
                        value: [{
                            name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm",
                            tagClass: O8.Class.UNIVERSAL,
                            type: O8.Type.OID,
                            constructed: !1,
                            capture: "maskGenHashOid"
                        }]
                    }]
                }]
            }, {
                name: "rsapss.saltLength",
                tagClass: O8.Class.CONTEXT_SPECIFIC,
                type: 2,
                optional: !0,
                value: [{
                    name: "rsapss.saltLength.saltLength",
                    tagClass: O8.Class.UNIVERSAL,
                    type: O8.Class.INTEGER,
                    constructed: !1,
                    capture: "saltLength"
                }]
            }, {
                name: "rsapss.trailerField",
                tagClass: O8.Class.CONTEXT_SPECIFIC,
                type: 3,
                optional: !0,
                value: [{
                    name: "rsapss.trailer.trailer",
                    tagClass: O8.Class.UNIVERSAL,
                    type: O8.Class.INTEGER,
                    constructed: !1,
                    capture: "trailer"
                }]
            }]
        },
        Ajz = {
            name: "CertificationRequestInfo",
            tagClass: O8.Class.UNIVERSAL,
            type: O8.Type.SEQUENCE,
            constructed: !0,
            captureAsn1: "certificationRequestInfo",
            value: [{
                name: "CertificationRequestInfo.integer",
                tagClass: O8.Class.UNIVERSAL,
                type: O8.Type.INTEGER,
                constructed: !1,
                capture: "certificationRequestInfoVersion"
            }, {
                name: "CertificationRequestInfo.subject",
                tagClass: O8.Class.UNIVERSAL,
                type: O8.Type.SEQUENCE,
                constructed: !0,
                captureAsn1: "certificationRequestInfoSubject"
            }, wL4, {
                name: "CertificationRequestInfo.attributes",
                tagClass: O8.Class.CONTEXT_SPECIFIC,
                type: 0,
                constructed: !0,
                optional: !0,
                capture: "certificationRequestInfoAttributes",
                value: [{
                    name: "CertificationRequestInfo.attributes",
                    tagClass: O8.Class.UNIVERSAL,
                    type: O8.Type.SEQUENCE,
                    constructed: !0,
                    value: [{
                        name: "CertificationRequestInfo.attributes.type",
                        tagClass: O8.Class.UNIVERSAL,
                        type: O8.Type.OID,
                        constructed: !1
                    }, {
                        name: "CertificationRequestInfo.attributes.value",
                        tagClass: O8.Class.UNIVERSAL,
                        type: O8.Type.SET,
                        constructed: !0
                    }]
                }]
            }]
        },
        Ojz = {
            name: "CertificationRequest",
            tagClass: O8.Class.UNIVERSAL,
            type: O8.Type.SEQUENCE,
            constructed: !0,
            captureAsn1: "csr",
            value: [Ajz, {
                name: "CertificationRequest.signatureAlgorithm",
                tagClass: O8.Class.UNIVERSAL,
                type: O8.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "CertificationRequest.signatureAlgorithm.algorithm",
                    tagClass: O8.Class.UNIVERSAL,
                    type: O8.Type.OID,
                    constructed: !1,
                    capture: "csrSignatureOid"
                }, {
                    name: "CertificationRequest.signatureAlgorithm.parameters",
                    tagClass: O8.Class.UNIVERSAL,
                    optional: !0,
                    captureAsn1: "csrSignatureParams"
                }]
            }, {
                name: "CertificationRequest.signature",
                tagClass: O8.Class.UNIVERSAL,
                type: O8.Type.BITSTRING,
                constructed: !1,
                captureBitStringValue: "csrSignature"
            }]
        };
    aq.RDNAttributesAsArray = function(q, K) {
        var _ = [],
            z, Y, A;
        for (var O = 0; O < q.value.length; ++O) {
            z = q.value[O];
            for (var w = 0; w < z.value.length; ++w) {
                if (A = {}, Y = z.value[w], A.type = O8.derToOid(Y.value[0].value), A.value = Y.value[1].value, A.valueTagClass = Y.value[1].type, A.type in wA) {
                    if (A.name = wA[A.type], A.name in MX) A.shortName = MX[A.name]
                }
                if (K) K.update(A.type), K.update(A.value);
                _.push(A)
            }
        }
        return _
    };
    aq.CRIAttributesAsArray = function(q) {
        var K = [];
        for (var _ = 0; _ < q.length; ++_) {
            var z = q[_],
                Y = O8.derToOid(z.value[0].value),
                A = z.value[1].value;
            for (var O = 0; O < A.length; ++O) {
                var w = {};
                if (w.type = Y, w.value = A[O].value, w.valueTagClass = A[O].type, w.type in wA) {
                    if (w.name = wA[w.type], w.name in MX) w.shortName = MX[w.name]
                }
                if (w.type === wA.extensionRequest) {
                    w.extensions = [];
                    for (var $ = 0; $ < w.value.length; ++$) w.extensions.push(aq.certificateExtensionFromAsn1(w.value[$]))
                }
                K.push(w)
            }
        }
        return K
    };

    function y56(q, K) {
        if (typeof K === "string") K = {
            shortName: K
        };
        var _ = null,
            z;
        for (var Y = 0; _ === null && Y < q.attributes.length; ++Y)
            if (z = q.attributes[Y], K.type && K.type === z.type) _ = z;
            else if (K.name && K.name === z.name) _ = z;
        else if (K.shortName && K.shortName === z.shortName) _ = z;
        return _
    }
    var Kb8 = function(q, K, _) {
            var z = {};
            if (q !== wA["RSASSA-PSS"]) return z;
            if (_) z = {
                hash: {
                    algorithmOid: wA.sha1
                },
                mgf: {
                    algorithmOid: wA.mgf1,
                    hash: {
                        algorithmOid: wA.sha1
                    }
                },
                saltLength: 20
            };
            var Y = {},
                A = [];
            if (!O8.validate(K, Yjz, Y, A)) {
                var O = Error("Cannot read RSASSA-PSS parameter block.");
                throw O.errors = A, O
            }
            if (Y.hashOid !== void 0) z.hash = z.hash || {}, z.hash.algorithmOid = O8.derToOid(Y.hashOid);
            if (Y.maskGenOid !== void 0) z.mgf = z.mgf || {}, z.mgf.algorithmOid = O8.derToOid(Y.maskGenOid), z.mgf.hash = z.mgf.hash || {}, z.mgf.hash.algorithmOid = O8.derToOid(Y.maskGenHashOid);
            if (Y.saltLength !== void 0) z.saltLength = Y.saltLength.charCodeAt(0);
            return z
        },
        _b8 = function(q) {
            switch (wA[q.signatureOid]) {
                case "sha1WithRSAEncryption":
                case "sha1WithRSASignature":
                    return u5.md.sha1.create();
                case "md5WithRSAEncryption":
                    return u5.md.md5.create();
                case "sha256WithRSAEncryption":
                    return u5.md.sha256.create();
                case "sha384WithRSAEncryption":
                    return u5.md.sha384.create();
                case "sha512WithRSAEncryption":
                    return u5.md.sha512.create();
                case "RSASSA-PSS":
                    return u5.md.sha256.create();
                default:
                    var K = Error("Could not compute " + q.type + " digest. Unknown signature OID.");
                    throw K.signatureOid = q.signatureOid, K
            }
        },
        $L4 = function(q) {
            var K = q.certificate,
                _;
            switch (K.signatureOid) {
                case wA.sha1WithRSAEncryption:
                case wA.sha1WithRSASignature:
                    break;
                case wA["RSASSA-PSS"]:
                    var z, Y;
                    if (z = wA[K.signatureParameters.mgf.hash.algorithmOid], z === void 0 || u5.md[z] === void 0) {
                        var A = Error("Unsupported MGF hash function.");
                        throw A.oid = K.signatureParameters.mgf.hash.algorithmOid, A.name = z, A
                    }
                    if (Y = wA[K.signatureParameters.mgf.algorithmOid], Y === void 0 || u5.mgf[Y] === void 0) {
                        var A = Error("Unsupported MGF function.");
                        throw A.oid = K.signatureParameters.mgf.algorithmOid, A.name = Y, A
                    }
                    if (Y = u5.mgf[Y].create(u5.md[z].create()), z = wA[K.signatureParameters.hash.algorithmOid], z === void 0 || u5.md[z] === void 0) {
                        var A = Error("Unsupported RSASSA-PSS hash function.");
                        throw A.oid = K.signatureParameters.hash.algorithmOid, A.name = z, A
                    }
                    _ = u5.pss.create(u5.md[z].create(), Y, K.signatureParameters.saltLength);
                    break
            }
            return K.publicKey.verify(q.md.digest().getBytes(), q.signature, _)
        };
    aq.certificateFromPem = function(q, K, _) {
        var z = u5.pem.decode(q)[0];
        if (z.type !== "CERTIFICATE" && z.type !== "X509 CERTIFICATE" && z.type !== "TRUSTED CERTIFICATE") {
            var Y = Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
            throw Y.headerType = z.type, Y
        }
        if (z.procType && z.procType.type === "ENCRYPTED") throw Error("Could not convert certificate from PEM; PEM is encrypted.");
        var A = O8.fromDer(z.body, _);
        return aq.certificateFromAsn1(A, K)
    };
    aq.certificateToPem = function(q, K) {
        var _ = {
            type: "CERTIFICATE",
            body: O8.toDer(aq.certificateToAsn1(q)).getBytes()
        };
        return u5.pem.encode(_, {
            maxline: K
        })
    };
    aq.publicKeyFromPem = function(q) {
        var K = u5.pem.decode(q)[0];
        if (K.type !== "PUBLIC KEY" && K.type !== "RSA PUBLIC KEY") {
            var _ = Error('Could not convert public key from PEM; PEM header type is not "PUBLIC KEY" or "RSA PUBLIC KEY".');
            throw _.headerType = K.type, _
        }
        if (K.procType && K.procType.type === "ENCRYPTED") throw Error("Could not convert public key from PEM; PEM is encrypted.");
        var z = O8.fromDer(K.body);
        return aq.publicKeyFromAsn1(z)
    };
    aq.publicKeyToPem = function(q, K) {
        var _ = {
            type: "PUBLIC KEY",
            body: O8.toDer(aq.publicKeyToAsn1(q)).getBytes()
        };
        return u5.pem.encode(_, {
            maxline: K
        })
    };
    aq.publicKeyToRSAPublicKeyPem = function(q, K) {
        var _ = {
            type: "RSA PUBLIC KEY",
            body: O8.toDer(aq.publicKeyToRSAPublicKey(q)).getBytes()
        };
        return u5.pem.encode(_, {
            maxline: K
        })
    };
    aq.getPublicKeyFingerprint = function(q, K) {
        K = K || {};
        var _ = K.md || u5.md.sha1.create(),
            z = K.type || "RSAPublicKey",
            Y;
        switch (z) {
            case "RSAPublicKey":
                Y = O8.toDer(aq.publicKeyToRSAPublicKey(q)).getBytes();
                break;
            case "SubjectPublicKeyInfo":
                Y = O8.toDer(aq.publicKeyToAsn1(q)).getBytes();
                break;
            default:
                throw Error('Unknown fingerprint type "' + K.type + '".')
        }
        _.start(), _.update(Y);
        var A = _.digest();
        if (K.encoding === "hex") {
            var O = A.toHex();
            if (K.delimiter) return O.match(/.{2}/g).join(K.delimiter);
            return O
        } else if (K.encoding === "binary") return A.getBytes();
        else if (K.encoding) throw Error('Unknown encoding "' + K.encoding + '".');
        return A
    };
    aq.certificationRequestFromPem = function(q, K, _) {
        var z = u5.pem.decode(q)[0];
        if (z.type !== "CERTIFICATE REQUEST") {
            var Y = Error('Could not convert certification request from PEM; PEM header type is not "CERTIFICATE REQUEST".');
            throw Y.headerType = z.type, Y
        }
        if (z.procType && z.procType.type === "ENCRYPTED") throw Error("Could not convert certification request from PEM; PEM is encrypted.");
        var A = O8.fromDer(z.body, _);
        return aq.certificationRequestFromAsn1(A, K)
    };
    aq.certificationRequestToPem = function(q, K) {
        var _ = {
            type: "CERTIFICATE REQUEST",
            body: O8.toDer(aq.certificationRequestToAsn1(q)).getBytes()
        };
        return u5.pem.encode(_, {
            maxline: K
        })
    };
    aq.createCertificate = function() {
        var q = {};
        return q.version = 2, q.serialNumber = "00", q.signatureOid = null, q.signature = null, q.siginfo = {}, q.siginfo.algorithmOid = null, q.validity = {}, q.validity.notBefore = new Date, q.validity.notAfter = new Date, q.issuer = {}, q.issuer.getField = function(K) {
            return y56(q.issuer, K)
        }, q.issuer.addField = function(K) {
            Mx([K]), q.issuer.attributes.push(K)
        }, q.issuer.attributes = [], q.issuer.hash = null, q.subject = {}, q.subject.getField = function(K) {
            return y56(q.subject, K)
        }, q.subject.addField = function(K) {
            Mx([K]), q.subject.attributes.push(K)
        }, q.subject.attributes = [], q.subject.hash = null, q.extensions = [], q.publicKey = null, q.md = null, q.setSubject = function(K, _) {
            if (Mx(K), q.subject.attributes = K, delete q.subject.uniqueId, _) q.subject.uniqueId = _;
            q.subject.hash = null
        }, q.setIssuer = function(K, _) {
            if (Mx(K), q.issuer.attributes = K, delete q.issuer.uniqueId, _) q.issuer.uniqueId = _;
            q.issuer.hash = null
        }, q.setExtensions = function(K) {
            for (var _ = 0; _ < K.length; ++_) jL4(K[_], {
                cert: q
            });
            q.extensions = K
        }, q.getExtension = function(K) {
            if (typeof K === "string") K = {
                name: K
            };
            var _ = null,
                z;
            for (var Y = 0; _ === null && Y < q.extensions.length; ++Y)
                if (z = q.extensions[Y], K.id && z.id === K.id) _ = z;
                else if (K.name && z.name === K.name) _ = z;
            return _
        }, q.sign = function(K, _) {
            q.md = _ || u5.md.sha1.create();
            var z = wA[q.md.algorithm + "WithRSAEncryption"];
            if (!z) {
                var Y = Error("Could not compute certificate digest. Unknown message digest algorithm OID.");
                throw Y.algorithm = q.md.algorithm, Y
            }
            q.signatureOid = q.siginfo.algorithmOid = z, q.tbsCertificate = aq.getTBSCertificate(q);
            var A = O8.toDer(q.tbsCertificate);
            q.md.update(A.getBytes()), q.signature = K.sign(q.md)
        }, q.verify = function(K) {
            var _ = !1;
            if (!q.issued(K)) {
                var z = K.issuer,
                    Y = q.subject,
                    A = Error("The parent certificate did not issue the given child certificate; the child certificate's issuer does not match the parent's subject.");
                throw A.expectedIssuer = Y.attributes, A.actualIssuer = z.attributes, A
            }
            var O = K.md;
            if (O === null) {
                O = _b8({
                    signatureOid: K.signatureOid,
                    type: "certificate"
                });
                var w = K.tbsCertificate || aq.getTBSCertificate(K),
                    $ = O8.toDer(w);
                O.update($.getBytes())
            }
            if (O !== null) _ = $L4({
                certificate: q,
                md: O,
                signature: K.signature
            });
            return _
        }, q.isIssuer = function(K) {
            var _ = !1,
                z = q.issuer,
                Y = K.subject;
            if (z.hash && Y.hash) _ = z.hash === Y.hash;
            else if (z.attributes.length === Y.attributes.length) {
                _ = !0;
                var A, O;
                for (var w = 0; _ && w < z.attributes.length; ++w)
                    if (A = z.attributes[w], O = Y.attributes[w], A.type !== O.type || A.value !== O.value) _ = !1
            }
            return _
        }, q.issued = function(K) {
            return K.isIssuer(q)
        }, q.generateSubjectKeyIdentifier = function() {
            return aq.getPublicKeyFingerprint(q.publicKey, {
                type: "RSAPublicKey"
            })
        }, q.verifySubjectKeyIdentifier = function() {
            var K = wA.subjectKeyIdentifier;
            for (var _ = 0; _ < q.extensions.length; ++_) {
                var z = q.extensions[_];
                if (z.id === K) {
                    var Y = q.generateSubjectKeyIdentifier().getBytes();
                    return u5.util.hexToBytes(z.subjectKeyIdentifier) === Y
                }
            }
            return !1
        }, q
    };
    aq.certificateFromAsn1 = function(q, K) {
        var _ = {},
            z = [];
        if (!O8.validate(q, zjz, _, z)) {
            var Y = Error("Cannot read X.509 certificate. ASN.1 object is not an X509v3 Certificate.");
            throw Y.errors = z, Y
        }
        var A = O8.derToOid(_.publicKeyOid);
        if (A !== aq.oids.rsaEncryption) throw Error("Cannot read public key. OID is not RSA.");
        var O = aq.createCertificate();
        O.version = _.certVersion ? _.certVersion.charCodeAt(0) : 0;
        var w = u5.util.createBuffer(_.certSerialNumber);
        O.serialNumber = w.toHex(), O.signatureOid = u5.asn1.derToOid(_.certSignatureOid), O.signatureParameters = Kb8(O.signatureOid, _.certSignatureParams, !0), O.siginfo.algorithmOid = u5.asn1.derToOid(_.certinfoSignatureOid), O.siginfo.parameters = Kb8(O.siginfo.algorithmOid, _.certinfoSignatureParams, !1), O.signature = _.certSignature;
        var $ = [];
        if (_.certValidity1UTCTime !== void 0) $.push(O8.utcTimeToDate(_.certValidity1UTCTime));
        if (_.certValidity2GeneralizedTime !== void 0) $.push(O8.generalizedTimeToDate(_.certValidity2GeneralizedTime));
        if (_.certValidity3UTCTime !== void 0) $.push(O8.utcTimeToDate(_.certValidity3UTCTime));
        if (_.certValidity4GeneralizedTime !== void 0) $.push(O8.generalizedTimeToDate(_.certValidity4GeneralizedTime));
        if ($.length > 2) throw Error("Cannot read notBefore/notAfter validity times; more than two times were provided in the certificate.");
        if ($.length < 2) throw Error("Cannot read notBefore/notAfter validity times; they were not provided as either UTCTime or GeneralizedTime.");
        if (O.validity.notBefore = $[0], O.validity.notAfter = $[1], O.tbsCertificate = _.tbsCertificate, K) {
            O.md = _b8({
                signatureOid: O.signatureOid,
                type: "certificate"
            });
            var j = O8.toDer(O.tbsCertificate);
            O.md.update(j.getBytes())
        }
        var H = u5.md.sha1.create(),
            J = O8.toDer(_.certIssuer);
        if (H.update(J.getBytes()), O.issuer.getField = function(P) {
                return y56(O.issuer, P)
            }, O.issuer.addField = function(P) {
                Mx([P]), O.issuer.attributes.push(P)
            }, O.issuer.attributes = aq.RDNAttributesAsArray(_.certIssuer), _.certIssuerUniqueId) O.issuer.uniqueId = _.certIssuerUniqueId;
        O.issuer.hash = H.digest().toHex();
        var X = u5.md.sha1.create(),
            M = O8.toDer(_.certSubject);
        if (X.update(M.getBytes()), O.subject.getField = function(P) {
                return y56(O.subject, P)
            }, O.subject.addField = function(P) {
                Mx([P]), O.subject.attributes.push(P)
            }, O.subject.attributes = aq.RDNAttributesAsArray(_.certSubject), _.certSubjectUniqueId) O.subject.uniqueId = _.certSubjectUniqueId;
        if (O.subject.hash = X.digest().toHex(), _.certExtensions) O.extensions = aq.certificateExtensionsFromAsn1(_.certExtensions);
        else O.extensions = [];
        return O.publicKey = aq.publicKeyFromAsn1(_.subjectPublicKeyInfo), O
    };
    aq.certificateExtensionsFromAsn1 = function(q) {
        var K = [];
        for (var _ = 0; _ < q.value.length; ++_) {
            var z = q.value[_];
            for (var Y = 0; Y < z.value.length; ++Y) K.push(aq.certificateExtensionFromAsn1(z.value[Y]))
        }
        return K
    };
    aq.certificateExtensionFromAsn1 = function(q) {
        var K = {};
        if (K.id = O8.derToOid(q.value[0].value), K.critical = !1, q.value[1].type === O8.Type.BOOLEAN) K.critical = q.value[1].value.charCodeAt(0) !== 0, K.value = q.value[2].value;
        else K.value = q.value[1].value;
        if (K.id in wA) {
            if (K.name = wA[K.id], K.name === "keyUsage") {
                var _ = O8.fromDer(K.value),
                    z = 0,
                    Y = 0;
                if (_.value.length > 1) z = _.value.charCodeAt(1), Y = _.value.length > 2 ? _.value.charCodeAt(2) : 0;
                K.digitalSignature = (z & 128) === 128, K.nonRepudiation = (z & 64) === 64, K.keyEncipherment = (z & 32) === 32, K.dataEncipherment = (z & 16) === 16, K.keyAgreement = (z & 8) === 8, K.keyCertSign = (z & 4) === 4, K.cRLSign = (z & 2) === 2, K.encipherOnly = (z & 1) === 1, K.decipherOnly = (Y & 128) === 128
            } else if (K.name === "basicConstraints") {
                var _ = O8.fromDer(K.value);
                if (_.value.length > 0 && _.value[0].type === O8.Type.BOOLEAN) K.cA = _.value[0].value.charCodeAt(0) !== 0;
                else K.cA = !1;
                var A = null;
                if (_.value.length > 0 && _.value[0].type === O8.Type.INTEGER) A = _.value[0].value;
                else if (_.value.length > 1) A = _.value[1].value;
                if (A !== null) K.pathLenConstraint = O8.derToInteger(A)
            } else if (K.name === "extKeyUsage") {
                var _ = O8.fromDer(K.value);
                for (var O = 0; O < _.value.length; ++O) {
                    var w = O8.derToOid(_.value[O].value);
                    if (w in wA) K[wA[w]] = !0;
                    else K[w] = !0
                }
            } else if (K.name === "nsCertType") {
                var _ = O8.fromDer(K.value),
                    z = 0;
                if (_.value.length > 1) z = _.value.charCodeAt(1);
                K.client = (z & 128) === 128, K.server = (z & 64) === 64, K.email = (z & 32) === 32, K.objsign = (z & 16) === 16, K.reserved = (z & 8) === 8, K.sslCA = (z & 4) === 4, K.emailCA = (z & 2) === 2, K.objCA = (z & 1) === 1
            } else if (K.name === "subjectAltName" || K.name === "issuerAltName") {
                K.altNames = [];
                var $, _ = O8.fromDer(K.value);
                for (var j = 0; j < _.value.length; ++j) {
                    $ = _.value[j];
                    var H = {
                        type: $.type,
                        value: $.value
                    };
                    switch (K.altNames.push(H), $.type) {
                        case 1:
                        case 2:
                        case 6:
                            break;
                        case 7:
                            H.ip = u5.util.bytesToIP($.value);
                            break;
                        case 8:
                            H.oid = O8.derToOid($.value);
                            break;
                        default:
                    }
                }
            } else if (K.name === "subjectKeyIdentifier") {
                var _ = O8.fromDer(K.value);
                K.subjectKeyIdentifier = u5.util.bytesToHex(_.value)
            }
        }
        return K
    };
    aq.certificationRequestFromAsn1 = function(q, K) {
        var _ = {},
            z = [];
        if (!O8.validate(q, Ojz, _, z)) {
            var Y = Error("Cannot read PKCS#10 certificate request. ASN.1 object is not a PKCS#10 CertificationRequest.");
            throw Y.errors = z, Y
        }
        var A = O8.derToOid(_.publicKeyOid);
        if (A !== aq.oids.rsaEncryption) throw Error("Cannot read public key. OID is not RSA.");
        var O = aq.createCertificationRequest();
        if (O.version = _.csrVersion ? _.csrVersion.charCodeAt(0) : 0, O.signatureOid = u5.asn1.derToOid(_.csrSignatureOid), O.signatureParameters = Kb8(O.signatureOid, _.csrSignatureParams, !0), O.siginfo.algorithmOid = u5.asn1.derToOid(_.csrSignatureOid), O.siginfo.parameters = Kb8(O.siginfo.algorithmOid, _.csrSignatureParams, !1), O.signature = _.csrSignature, O.certificationRequestInfo = _.certificationRequestInfo, K) {
            O.md = _b8({
                signatureOid: O.signatureOid,
                type: "certification request"
            });
            var w = O8.toDer(O.certificationRequestInfo);
            O.md.update(w.getBytes())
        }
        var $ = u5.md.sha1.create();
        return O.subject.getField = function(j) {
            return y56(O.subject, j)
        }, O.subject.addField = function(j) {
            Mx([j]), O.subject.attributes.push(j)
        }, O.subject.attributes = aq.RDNAttributesAsArray(_.certificationRequestInfoSubject, $), O.subject.hash = $.digest().toHex(), O.publicKey = aq.publicKeyFromAsn1(_.subjectPublicKeyInfo), O.getAttribute = function(j) {
            return y56(O, j)
        }, O.addAttribute = function(j) {
            Mx([j]), O.attributes.push(j)
        }, O.attributes = aq.CRIAttributesAsArray(_.certificationRequestInfoAttributes || []), O
    };
    aq.createCertificationRequest = function() {
        var q = {};
        return q.version = 0, q.signatureOid = null, q.signature = null, q.siginfo = {}, q.siginfo.algorithmOid = null, q.subject = {}, q.subject.getField = function(K) {
            return y56(q.subject, K)
        }, q.subject.addField = function(K) {
            Mx([K]), q.subject.attributes.push(K)
        }, q.subject.attributes = [], q.subject.hash = null, q.publicKey = null, q.attributes = [], q.getAttribute = function(K) {
            return y56(q, K)
        }, q.addAttribute = function(K) {
            Mx([K]), q.attributes.push(K)
        }, q.md = null, q.setSubject = function(K) {
            Mx(K), q.subject.attributes = K, q.subject.hash = null
        }, q.setAttributes = function(K) {
            Mx(K), q.attributes = K
        }, q.sign = function(K, _) {
            q.md = _ || u5.md.sha1.create();
            var z = wA[q.md.algorithm + "WithRSAEncryption"];
            if (!z) {
                var Y = Error("Could not compute certification request digest. Unknown message digest algorithm OID.");
                throw Y.algorithm = q.md.algorithm, Y
            }
            q.signatureOid = q.siginfo.algorithmOid = z, q.certificationRequestInfo = aq.getCertificationRequestInfo(q);
            var A = O8.toDer(q.certificationRequestInfo);
            q.md.update(A.getBytes()), q.signature = K.sign(q.md)
        }, q.verify = function() {
            var K = !1,
                _ = q.md;
            if (_ === null) {
                _ = _b8({
                    signatureOid: q.signatureOid,
                    type: "certification request"
                });
                var z = q.certificationRequestInfo || aq.getCertificationRequestInfo(q),
                    Y = O8.toDer(z);
                _.update(Y.getBytes())
            }
            if (_ !== null) K = $L4({
                certificate: q,
                md: _,
                signature: q.signature
            });
            return K
        }, q
    };

    function Kh6(q) {
        var K = O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, []),
            _, z, Y = q.attributes;
        for (var A = 0; A < Y.length; ++A) {
            _ = Y[A];
            var O = _.value,
                w = O8.Type.PRINTABLESTRING;
            if ("valueTagClass" in _) {
                if (w = _.valueTagClass, w === O8.Type.UTF8) O = u5.util.encodeUtf8(O)
            }
            z = O8.create(O8.Class.UNIVERSAL, O8.Type.SET, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.OID, !1, O8.oidToDer(_.type).getBytes()), O8.create(O8.Class.UNIVERSAL, w, !1, O)])]), K.value.push(z)
        }
        return K
    }

    function Mx(q) {
        var K;
        for (var _ = 0; _ < q.length; ++_) {
            if (K = q[_], typeof K.name > "u") {
                if (K.type && K.type in aq.oids) K.name = aq.oids[K.type];
                else if (K.shortName && K.shortName in MX) K.name = aq.oids[MX[K.shortName]]
            }
            if (typeof K.type > "u")
                if (K.name && K.name in aq.oids) K.type = aq.oids[K.name];
                else {
                    var z = Error("Attribute type not specified.");
                    throw z.attribute = K, z
                } if (typeof K.shortName > "u") {
                if (K.name && K.name in MX) K.shortName = MX[K.name]
            }
            if (K.type === wA.extensionRequest) {
                if (K.valueConstructed = !0, K.valueTagClass = O8.Type.SEQUENCE, !K.value && K.extensions) {
                    K.value = [];
                    for (var Y = 0; Y < K.extensions.length; ++Y) K.value.push(aq.certificateExtensionToAsn1(jL4(K.extensions[Y])))
                }
            }
            if (typeof K.value > "u") {
                var z = Error("Attribute value not specified.");
                throw z.attribute = K, z
            }
        }
    }

    function jL4(q, K) {
        if (K = K || {}, typeof q.name > "u") {
            if (q.id && q.id in aq.oids) q.name = aq.oids[q.id]
        }
        if (typeof q.id > "u")
            if (q.name && q.name in aq.oids) q.id = aq.oids[q.name];
            else {
                var _ = Error("Extension ID not specified.");
                throw _.extension = q, _
            } if (typeof q.value < "u") return q;
        if (q.name === "keyUsage") {
            var z = 0,
                Y = 0,
                A = 0;
            if (q.digitalSignature) Y |= 128, z = 7;
            if (q.nonRepudiation) Y |= 64, z = 6;
            if (q.keyEncipherment) Y |= 32, z = 5;
            if (q.dataEncipherment) Y |= 16, z = 4;
            if (q.keyAgreement) Y |= 8, z = 3;
            if (q.keyCertSign) Y |= 4, z = 2;
            if (q.cRLSign) Y |= 2, z = 1;
            if (q.encipherOnly) Y |= 1, z = 0;
            if (q.decipherOnly) A |= 128, z = 7;
            var O = String.fromCharCode(z);
            if (A !== 0) O += String.fromCharCode(Y) + String.fromCharCode(A);
            else if (Y !== 0) O += String.fromCharCode(Y);
            q.value = O8.create(O8.Class.UNIVERSAL, O8.Type.BITSTRING, !1, O)
        } else if (q.name === "basicConstraints") {
            if (q.value = O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, []), q.cA) q.value.value.push(O8.create(O8.Class.UNIVERSAL, O8.Type.BOOLEAN, !1, String.fromCharCode(255)));
            if ("pathLenConstraint" in q) q.value.value.push(O8.create(O8.Class.UNIVERSAL, O8.Type.INTEGER, !1, O8.integerToDer(q.pathLenConstraint).getBytes()))
        } else if (q.name === "extKeyUsage") {
            q.value = O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, []);
            var w = q.value.value;
            for (var $ in q) {
                if (q[$] !== !0) continue;
                if ($ in wA) w.push(O8.create(O8.Class.UNIVERSAL, O8.Type.OID, !1, O8.oidToDer(wA[$]).getBytes()));
                else if ($.indexOf(".") !== -1) w.push(O8.create(O8.Class.UNIVERSAL, O8.Type.OID, !1, O8.oidToDer($).getBytes()))
            }
        } else if (q.name === "nsCertType") {
            var z = 0,
                Y = 0;
            if (q.client) Y |= 128, z = 7;
            if (q.server) Y |= 64, z = 6;
            if (q.email) Y |= 32, z = 5;
            if (q.objsign) Y |= 16, z = 4;
            if (q.reserved) Y |= 8, z = 3;
            if (q.sslCA) Y |= 4, z = 2;
            if (q.emailCA) Y |= 2, z = 1;
            if (q.objCA) Y |= 1, z = 0;
            var O = String.fromCharCode(z);
            if (Y !== 0) O += String.fromCharCode(Y);
            q.value = O8.create(O8.Class.UNIVERSAL, O8.Type.BITSTRING, !1, O)
        } else if (q.name === "subjectAltName" || q.name === "issuerAltName") {
            q.value = O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, []);
            var j;
            for (var H = 0; H < q.altNames.length; ++H) {
                j = q.altNames[H];
                var O = j.value;
                if (j.type === 7 && j.ip) {
                    if (O = u5.util.bytesFromIP(j.ip), O === null) {
                        var _ = Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
                        throw _.extension = q, _
                    }
                } else if (j.type === 8)
                    if (j.oid) O = O8.oidToDer(O8.oidToDer(j.oid));
                    else O = O8.oidToDer(O);
                q.value.value.push(O8.create(O8.Class.CONTEXT_SPECIFIC, j.type, !1, O))
            }
        } else if (q.name === "nsComment" && K.cert) {
            if (!/^[\x00-\x7F]*$/.test(q.comment) || q.comment.length < 1 || q.comment.length > 128) throw Error('Invalid "nsComment" content.');
            q.value = O8.create(O8.Class.UNIVERSAL, O8.Type.IA5STRING, !1, q.comment)
        } else if (q.name === "subjectKeyIdentifier" && K.cert) {
            var J = K.cert.generateSubjectKeyIdentifier();
            q.subjectKeyIdentifier = J.toHex(), q.value = O8.create(O8.Class.UNIVERSAL, O8.Type.OCTETSTRING, !1, J.getBytes())
        } else if (q.name === "authorityKeyIdentifier" && K.cert) {
            q.value = O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, []);
            var w = q.value.value;
            if (q.keyIdentifier) {
                var X = q.keyIdentifier === !0 ? K.cert.generateSubjectKeyIdentifier().getBytes() : q.keyIdentifier;
                w.push(O8.create(O8.Class.CONTEXT_SPECIFIC, 0, !1, X))
            }
            if (q.authorityCertIssuer) {
                var M = [O8.create(O8.Class.CONTEXT_SPECIFIC, 4, !0, [Kh6(q.authorityCertIssuer === !0 ? K.cert.issuer : q.authorityCertIssuer)])];
                w.push(O8.create(O8.Class.CONTEXT_SPECIFIC, 1, !0, M))
            }
            if (q.serialNumber) {
                var P = u5.util.hexToBytes(q.serialNumber === !0 ? K.cert.serialNumber : q.serialNumber);
                w.push(O8.create(O8.Class.CONTEXT_SPECIFIC, 2, !1, P))
            }
        } else if (q.name === "cRLDistributionPoints") {
            q.value = O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, []);
            var w = q.value.value,
                W = O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, []),
                D = O8.create(O8.Class.CONTEXT_SPECIFIC, 0, !0, []),
                j;
            for (var H = 0; H < q.altNames.length; ++H) {
                j = q.altNames[H];
                var O = j.value;
                if (j.type === 7 && j.ip) {
                    if (O = u5.util.bytesFromIP(j.ip), O === null) {
                        var _ = Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
                        throw _.extension = q, _
                    }
                } else if (j.type === 8)
                    if (j.oid) O = O8.oidToDer(O8.oidToDer(j.oid));
                    else O = O8.oidToDer(O);
                D.value.push(O8.create(O8.Class.CONTEXT_SPECIFIC, j.type, !1, O))
            }
            W.value.push(O8.create(O8.Class.CONTEXT_SPECIFIC, 0, !0, [D])), w.push(W)
        }
        if (typeof q.value > "u") {
            var _ = Error("Extension value not specified.");
            throw _.extension = q, _
        }
        return q
    }

    function Kl1(q, K) {
        switch (q) {
            case wA["RSASSA-PSS"]:
                var _ = [];
                if (K.hash.algorithmOid !== void 0) _.push(O8.create(O8.Class.CONTEXT_SPECIFIC, 0, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.OID, !1, O8.oidToDer(K.hash.algorithmOid).getBytes()), O8.create(O8.Class.UNIVERSAL, O8.Type.NULL, !1, "")])]));
                if (K.mgf.algorithmOid !== void 0) _.push(O8.create(O8.Class.CONTEXT_SPECIFIC, 1, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.OID, !1, O8.oidToDer(K.mgf.algorithmOid).getBytes()), O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.OID, !1, O8.oidToDer(K.mgf.hash.algorithmOid).getBytes()), O8.create(O8.Class.UNIVERSAL, O8.Type.NULL, !1, "")])])]));
                if (K.saltLength !== void 0) _.push(O8.create(O8.Class.CONTEXT_SPECIFIC, 2, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.INTEGER, !1, O8.integerToDer(K.saltLength).getBytes())]));
                return O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, _);
            default:
                return O8.create(O8.Class.UNIVERSAL, O8.Type.NULL, !1, "")
        }
    }

    function wjz(q) {
        var K = O8.create(O8.Class.CONTEXT_SPECIFIC, 0, !0, []);
        if (q.attributes.length === 0) return K;
        var _ = q.attributes;
        for (var z = 0; z < _.length; ++z) {
            var Y = _[z],
                A = Y.value,
                O = O8.Type.UTF8;
            if ("valueTagClass" in Y) O = Y.valueTagClass;
            if (O === O8.Type.UTF8) A = u5.util.encodeUtf8(A);
            var w = !1;
            if ("valueConstructed" in Y) w = Y.valueConstructed;
            var $ = O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.OID, !1, O8.oidToDer(Y.type).getBytes()), O8.create(O8.Class.UNIVERSAL, O8.Type.SET, !0, [O8.create(O8.Class.UNIVERSAL, O, w, A)])]);
            K.value.push($)
        }
        return K
    }
    var $jz = new Date("1950-01-01T00:00:00Z"),
        jjz = new Date("2050-01-01T00:00:00Z");

    function OL4(q) {
        if (q >= $jz && q < jjz) return O8.create(O8.Class.UNIVERSAL, O8.Type.UTCTIME, !1, O8.dateToUtcTime(q));
        else return O8.create(O8.Class.UNIVERSAL, O8.Type.GENERALIZEDTIME, !1, O8.dateToGeneralizedTime(q))
    }
    aq.getTBSCertificate = function(q) {
        var K = OL4(q.validity.notBefore),
            _ = OL4(q.validity.notAfter),
            z = O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, [O8.create(O8.Class.CONTEXT_SPECIFIC, 0, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.INTEGER, !1, O8.integerToDer(q.version).getBytes())]), O8.create(O8.Class.UNIVERSAL, O8.Type.INTEGER, !1, u5.util.hexToBytes(q.serialNumber)), O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.OID, !1, O8.oidToDer(q.siginfo.algorithmOid).getBytes()), Kl1(q.siginfo.algorithmOid, q.siginfo.parameters)]), Kh6(q.issuer), O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, [K, _]), Kh6(q.subject), aq.publicKeyToAsn1(q.publicKey)]);
        if (q.issuer.uniqueId) z.value.push(O8.create(O8.Class.CONTEXT_SPECIFIC, 1, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.BITSTRING, !1, String.fromCharCode(0) + q.issuer.uniqueId)]));
        if (q.subject.uniqueId) z.value.push(O8.create(O8.Class.CONTEXT_SPECIFIC, 2, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.BITSTRING, !1, String.fromCharCode(0) + q.subject.uniqueId)]));
        if (q.extensions.length > 0) z.value.push(aq.certificateExtensionsToAsn1(q.extensions));
        return z
    };
    aq.getCertificationRequestInfo = function(q) {
        var K = O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.INTEGER, !1, O8.integerToDer(q.version).getBytes()), Kh6(q.subject), aq.publicKeyToAsn1(q.publicKey), wjz(q)]);
        return K
    };
    aq.distinguishedNameToAsn1 = function(q) {
        return Kh6(q)
    };
    aq.certificateToAsn1 = function(q) {
        var K = q.tbsCertificate || aq.getTBSCertificate(q);
        return O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, [K, O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.OID, !1, O8.oidToDer(q.signatureOid).getBytes()), Kl1(q.signatureOid, q.signatureParameters)]), O8.create(O8.Class.UNIVERSAL, O8.Type.BITSTRING, !1, String.fromCharCode(0) + q.signature)])
    };
    aq.certificateExtensionsToAsn1 = function(q) {
        var K = O8.create(O8.Class.CONTEXT_SPECIFIC, 3, !0, []),
            _ = O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, []);
        K.value.push(_);
        for (var z = 0; z < q.length; ++z) _.value.push(aq.certificateExtensionToAsn1(q[z]));
        return K
    };
    aq.certificateExtensionToAsn1 = function(q) {
        var K = O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, []);
        if (K.value.push(O8.create(O8.Class.UNIVERSAL, O8.Type.OID, !1, O8.oidToDer(q.id).getBytes())), q.critical) K.value.push(O8.create(O8.Class.UNIVERSAL, O8.Type.BOOLEAN, !1, String.fromCharCode(255)));
        var _ = q.value;
        if (typeof q.value !== "string") _ = O8.toDer(_).getBytes();
        return K.value.push(O8.create(O8.Class.UNIVERSAL, O8.Type.OCTETSTRING, !1, _)), K
    };
    aq.certificationRequestToAsn1 = function(q) {
        var K = q.certificationRequestInfo || aq.getCertificationRequestInfo(q);
        return O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, [K, O8.create(O8.Class.UNIVERSAL, O8.Type.SEQUENCE, !0, [O8.create(O8.Class.UNIVERSAL, O8.Type.OID, !1, O8.oidToDer(q.signatureOid).getBytes()), Kl1(q.signatureOid, q.signatureParameters)]), O8.create(O8.Class.UNIVERSAL, O8.Type.BITSTRING, !1, String.fromCharCode(0) + q.signature)])
    };
    aq.createCaStore = function(q) {
        var K = {
            certs: {}
        };
        K.getIssuer = function(O) {
            var w = _(O.issuer);
            return w
        }, K.addCertificate = function(O) {
            if (typeof O === "string") O = u5.pki.certificateFromPem(O);
            if (z(O.subject), !K.hasCertificate(O))
                if (O.subject.hash in K.certs) {
                    var w = K.certs[O.subject.hash];
                    if (!u5.util.isArray(w)) w = [w];
                    w.push(O), K.certs[O.subject.hash] = w
                } else K.certs[O.subject.hash] = O
        }, K.hasCertificate = function(O) {
            if (typeof O === "string") O = u5.pki.certificateFromPem(O);
            var w = _(O.subject);
            if (!w) return !1;
            if (!u5.util.isArray(w)) w = [w];
            var $ = O8.toDer(aq.certificateToAsn1(O)).getBytes();
            for (var j = 0; j < w.length; ++j) {
                var H = O8.toDer(aq.certificateToAsn1(w[j])).getBytes();
                if ($ === H) return !0
            }
            return !1
        }, K.listAllCertificates = function() {
            var O = [];
            for (var w in K.certs)
                if (K.certs.hasOwnProperty(w)) {
                    var $ = K.certs[w];
                    if (!u5.util.isArray($)) O.push($);
                    else
                        for (var j = 0; j < $.length; ++j) O.push($[j])
                } return O
        }, K.removeCertificate = function(O) {
            var w;
            if (typeof O === "string") O = u5.pki.certificateFromPem(O);
            if (z(O.subject), !K.hasCertificate(O)) return null;
            var $ = _(O.subject);
            if (!u5.util.isArray($)) return w = K.certs[O.subject.hash], delete K.certs[O.subject.hash], w;
            var j = O8.toDer(aq.certificateToAsn1(O)).getBytes();
            for (var H = 0; H < $.length; ++H) {
                var J = O8.toDer(aq.certificateToAsn1($[H])).getBytes();
                if (j === J) w = $[H], $.splice(H, 1)
            }
            if ($.length === 0) delete K.certs[O.subject.hash];
            return w
        };

        function _(O) {
            return z(O), K.certs[O.hash] || null
        }

        function z(O) {
            if (!O.hash) {
                var w = u5.md.sha1.create();
                O.attributes = aq.RDNAttributesAsArray(Kh6(O), w), O.hash = w.digest().toHex()
            }
        }
        if (q)
            for (var Y = 0; Y < q.length; ++Y) {
                var A = q[Y];
                K.addCertificate(A)
            }
        return K
    };
    aq.certificateError = {
        bad_certificate: "forge.pki.BadCertificate",
        unsupported_certificate: "forge.pki.UnsupportedCertificate",
        certificate_revoked: "forge.pki.CertificateRevoked",
        certificate_expired: "forge.pki.CertificateExpired",
        certificate_unknown: "forge.pki.CertificateUnknown",
        unknown_ca: "forge.pki.UnknownCertificateAuthority"
    };
    aq.verifyCertificateChain = function(q, K, _) {
        if (typeof _ === "function") _ = {
            verify: _
        };
        _ = _ || {}, K = K.slice(0);
        var z = K.slice(0),
            Y = _.validityCheckDate;
        if (typeof Y > "u") Y = new Date;
        var A = !0,
            O = null,
            w = 0;
        do {
            var $ = K.shift(),
                j = null,
                H = !1;
            if (Y) {
                if (Y < $.validity.notBefore || Y > $.validity.notAfter) O = {
                    message: "Certificate is not valid yet or has expired.",
                    error: aq.certificateError.certificate_expired,
                    notBefore: $.validity.notBefore,
                    notAfter: $.validity.notAfter,
                    now: Y
                }
            }
            if (O === null) {
                if (j = K[0] || q.getIssuer($), j === null) {
                    if ($.isIssuer($)) H = !0, j = $
                }
                if (j) {
                    var J = j;
                    if (!u5.util.isArray(J)) J = [J];
                    var X = !1;
                    while (!X && J.length > 0) {
                        j = J.shift();
                        try {
                            X = j.verify($)
                        } catch (V) {}
                    }
                    if (!X) O = {
                        message: "Certificate signature is invalid.",
                        error: aq.certificateError.bad_certificate
                    }
                }
                if (O === null && (!j || H) && !q.hasCertificate($)) O = {
                    message: "Certificate is not trusted.",
                    error: aq.certificateError.unknown_ca
                }
            }
            if (O === null && j && !$.isIssuer(j)) O = {
                message: "Certificate issuer is invalid.",
                error: aq.certificateError.bad_certificate
            };
            if (O === null) {
                var M = {
                    keyUsage: !0,
                    basicConstraints: !0
                };
                for (var P = 0; O === null && P < $.extensions.length; ++P) {
                    var W = $.extensions[P];
                    if (W.critical && !(W.name in M)) O = {
                        message: "Certificate has an unsupported critical extension.",
                        error: aq.certificateError.unsupported_certificate
                    }
                }
            }
            if (O === null && (!A || K.length === 0 && (!j || H))) {
                var D = $.getExtension("basicConstraints"),
                    Z = $.getExtension("keyUsage");
                if (Z !== null) {
                    if (!Z.keyCertSign || D === null) O = {
                        message: "Certificate keyUsage or basicConstraints conflict or indicate that the certificate is not a CA. If the certificate is the only one in the chain or isn't the first then the certificate must be a valid CA.",
                        error: aq.certificateError.bad_certificate
                    }
                }
                if (O === null && D !== null && !D.cA) O = {
                    message: "Certificate basicConstraints indicates the certificate is not a CA.",
                    error: aq.certificateError.bad_certificate
                };
                if (O === null && Z !== null && "pathLenConstraint" in D) {
                    var G = w - 1;
                    if (G > D.pathLenConstraint) O = {
                        message: "Certificate basicConstraints pathLenConstraint violated.",
                        error: aq.certificateError.bad_certificate
                    }
                }
            }
            var f = O === null ? !0 : O.error,
                v = _.verify ? _.verify(f, w, z) : f;
            if (v === !0) O = null;
            else {
                if (f === !0) O = {
                    message: "The application rejected the certificate.",
                    error: aq.certificateError.bad_certificate
                };
                if (v || v === 0) {
                    if (typeof v === "object" && !u5.util.isArray(v)) {
                        if (v.message) O.message = v.message;
                        if (v.error) O.error = v.error
                    } else if (typeof v === "string") O.error = v
                }
                throw O
            }
            A = !1, ++w
        } while (K.length > 0);
        return !0
    }
})
// @from(Ln 250434, Col 4)
zl1 = p((Phw, XL4) => {
    var F$ = p_();
    mp();
    rL6();
    k56();
    ec1();
    tc1();
    Hx();
    A88();
    tL6();
    RA();
    zb8();
    var {
        asn1: s8,
        pki: Bz
    } = F$, w88 = XL4.exports = F$.pkcs12 = F$.pkcs12 || {}, JL4 = {
        name: "ContentInfo",
        tagClass: s8.Class.UNIVERSAL,
        type: s8.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "ContentInfo.contentType",
            tagClass: s8.Class.UNIVERSAL,
            type: s8.Type.OID,
            constructed: !1,
            capture: "contentType"
        }, {
            name: "ContentInfo.content",
            tagClass: s8.Class.CONTEXT_SPECIFIC,
            constructed: !0,
            captureAsn1: "content"
        }]
    }, Hjz = {
        name: "PFX",
        tagClass: s8.Class.UNIVERSAL,
        type: s8.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "PFX.version",
            tagClass: s8.Class.UNIVERSAL,
            type: s8.Type.INTEGER,
            constructed: !1,
            capture: "version"
        }, JL4, {
            name: "PFX.macData",
            tagClass: s8.Class.UNIVERSAL,
            type: s8.Type.SEQUENCE,
            constructed: !0,
            optional: !0,
            captureAsn1: "mac",
            value: [{
                name: "PFX.macData.mac",
                tagClass: s8.Class.UNIVERSAL,
                type: s8.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "PFX.macData.mac.digestAlgorithm",
                    tagClass: s8.Class.UNIVERSAL,
                    type: s8.Type.SEQUENCE,
                    constructed: !0,
                    value: [{
                        name: "PFX.macData.mac.digestAlgorithm.algorithm",
                        tagClass: s8.Class.UNIVERSAL,
                        type: s8.Type.OID,
                        constructed: !1,
                        capture: "macAlgorithm"
                    }, {
                        name: "PFX.macData.mac.digestAlgorithm.parameters",
                        optional: !0,
                        tagClass: s8.Class.UNIVERSAL,
                        captureAsn1: "macAlgorithmParameters"
                    }]
                }, {
                    name: "PFX.macData.mac.digest",
                    tagClass: s8.Class.UNIVERSAL,
                    type: s8.Type.OCTETSTRING,
                    constructed: !1,
                    capture: "macDigest"
                }]
            }, {
                name: "PFX.macData.macSalt",
                tagClass: s8.Class.UNIVERSAL,
                type: s8.Type.OCTETSTRING,
                constructed: !1,
                capture: "macSalt"
            }, {
                name: "PFX.macData.iterations",
                tagClass: s8.Class.UNIVERSAL,
                type: s8.Type.INTEGER,
                constructed: !1,
                optional: !0,
                capture: "macIterations"
            }]
        }]
    }, Jjz = {
        name: "SafeBag",
        tagClass: s8.Class.UNIVERSAL,
        type: s8.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "SafeBag.bagId",
            tagClass: s8.Class.UNIVERSAL,
            type: s8.Type.OID,
            constructed: !1,
            capture: "bagId"
        }, {
            name: "SafeBag.bagValue",
            tagClass: s8.Class.CONTEXT_SPECIFIC,
            constructed: !0,
            captureAsn1: "bagValue"
        }, {
            name: "SafeBag.bagAttributes",
            tagClass: s8.Class.UNIVERSAL,
            type: s8.Type.SET,
            constructed: !0,
            optional: !0,
            capture: "bagAttributes"
        }]
    }, Xjz = {
        name: "Attribute",
        tagClass: s8.Class.UNIVERSAL,
        type: s8.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "Attribute.attrId",
            tagClass: s8.Class.UNIVERSAL,
            type: s8.Type.OID,
            constructed: !1,
            capture: "oid"
        }, {
            name: "Attribute.attrValues",
            tagClass: s8.Class.UNIVERSAL,
            type: s8.Type.SET,
            constructed: !0,
            capture: "values"
        }]
    }, Mjz = {
        name: "CertBag",
        tagClass: s8.Class.UNIVERSAL,
        type: s8.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "CertBag.certId",
            tagClass: s8.Class.UNIVERSAL,
            type: s8.Type.OID,
            constructed: !1,
            capture: "certId"
        }, {
            name: "CertBag.certValue",
            tagClass: s8.Class.CONTEXT_SPECIFIC,
            constructed: !0,
            value: [{
                name: "CertBag.certValue[0]",
                tagClass: s8.Class.UNIVERSAL,
                type: s8.Class.OCTETSTRING,
                constructed: !1,
                capture: "cert"
            }]
        }]
    };

    function O88(q, K, _, z) {
        var Y = [];
        for (var A = 0; A < q.length; A++)
            for (var O = 0; O < q[A].safeBags.length; O++) {
                var w = q[A].safeBags[O];
                if (z !== void 0 && w.type !== z) continue;
                if (K === null) {
                    Y.push(w);
                    continue
                }
                if (w.attributes[K] !== void 0 && w.attributes[K].indexOf(_) >= 0) Y.push(w)
            }
        return Y
    }
    w88.pkcs12FromAsn1 = function(q, K, _) {
        if (typeof K === "string") _ = K, K = !0;
        else if (K === void 0) K = !0;
        var z = {},
            Y = [];
        if (!s8.validate(q, Hjz, z, Y)) {
            var A = Error("Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.");
            throw A.errors = A, A
        }
        var O = {
            version: z.version.charCodeAt(0),
            safeContents: [],
            getBags: function(D) {
                var Z = {},
                    G;
                if ("localKeyId" in D) G = D.localKeyId;
                else if ("localKeyIdHex" in D) G = F$.util.hexToBytes(D.localKeyIdHex);
                if (G === void 0 && !("friendlyName" in D) && "bagType" in D) Z[D.bagType] = O88(O.safeContents, null, null, D.bagType);
                if (G !== void 0) Z.localKeyId = O88(O.safeContents, "localKeyId", G, D.bagType);
                if ("friendlyName" in D) Z.friendlyName = O88(O.safeContents, "friendlyName", D.friendlyName, D.bagType);
                return Z
            },
            getBagsByFriendlyName: function(D, Z) {
                return O88(O.safeContents, "friendlyName", D, Z)
            },
            getBagsByLocalKeyId: function(D, Z) {
                return O88(O.safeContents, "localKeyId", D, Z)
            }
        };
        if (z.version.charCodeAt(0) !== 3) {
            var A = Error("PKCS#12 PFX of version other than 3 not supported.");
            throw A.version = z.version.charCodeAt(0), A
        }
        if (s8.derToOid(z.contentType) !== Bz.oids.data) {
            var A = Error("Only PKCS#12 PFX in password integrity mode supported.");
            throw A.oid = s8.derToOid(z.contentType), A
        }
        var w = z.content.value[0];
        if (w.tagClass !== s8.Class.UNIVERSAL || w.type !== s8.Type.OCTETSTRING) throw Error("PKCS#12 authSafe content data is not an OCTET STRING.");
        if (w = _l1(w), z.mac) {
            var $ = null,
                j = 0,
                H = s8.derToOid(z.macAlgorithm);
            switch (H) {
                case Bz.oids.sha1:
                    $ = F$.md.sha1.create(), j = 20;
                    break;
                case Bz.oids.sha256:
                    $ = F$.md.sha256.create(), j = 32;
                    break;
                case Bz.oids.sha384:
                    $ = F$.md.sha384.create(), j = 48;
                    break;
                case Bz.oids.sha512:
                    $ = F$.md.sha512.create(), j = 64;
                    break;
                case Bz.oids.md5:
                    $ = F$.md.md5.create(), j = 16;
                    break
            }
            if ($ === null) throw Error("PKCS#12 uses unsupported MAC algorithm: " + H);
            var J = new F$.util.ByteBuffer(z.macSalt),
                X = "macIterations" in z ? parseInt(F$.util.bytesToHex(z.macIterations), 16) : 1,
                M = w88.generateKey(_, J, 3, X, j, $),
                P = F$.hmac.create();
            P.start($, M), P.update(w.value);
            var W = P.getMac();
            if (W.getBytes() !== z.macDigest) throw Error("PKCS#12 MAC could not be verified. Invalid password?")
        } else if (Array.isArray(q.value) && q.value.length > 2) throw Error("Invalid PKCS#12. macData field present but MAC was not validated.");
        return Pjz(O, w.value, K, _), O
    };

    function _l1(q) {
        if (q.composed || q.constructed) {
            var K = F$.util.createBuffer();
            for (var _ = 0; _ < q.value.length; ++_) K.putBytes(q.value[_].value);
            q.composed = q.constructed = !1, q.value = K.getBytes()
        }
        return q
    }

    function Pjz(q, K, _, z) {
        if (K = s8.fromDer(K, _), K.tagClass !== s8.Class.UNIVERSAL || K.type !== s8.Type.SEQUENCE || K.constructed !== !0) throw Error("PKCS#12 AuthenticatedSafe expected to be a SEQUENCE OF ContentInfo");
        for (var Y = 0; Y < K.value.length; Y++) {
            var A = K.value[Y],
                O = {},
                w = [];
            if (!s8.validate(A, JL4, O, w)) {
                var $ = Error("Cannot read ContentInfo.");
                throw $.errors = w, $
            }
            var j = {
                    encrypted: !1
                },
                H = null,
                J = O.content.value[0];
            switch (s8.derToOid(O.contentType)) {
                case Bz.oids.data:
                    if (J.tagClass !== s8.Class.UNIVERSAL || J.type !== s8.Type.OCTETSTRING) throw Error("PKCS#12 SafeContents Data is not an OCTET STRING.");
                    H = _l1(J).value;
                    break;
                case Bz.oids.encryptedData:
                    H = Wjz(J, z), j.encrypted = !0;
                    break;
                default:
                    var $ = Error("Unsupported PKCS#12 contentType.");
                    throw $.contentType = s8.derToOid(O.contentType), $
            }
            j.safeBags = Djz(H, _, z), q.safeContents.push(j)
        }
    }

    function Wjz(q, K) {
        var _ = {},
            z = [];
        if (!s8.validate(q, F$.pkcs7.asn1.encryptedDataValidator, _, z)) {
            var Y = Error("Cannot read EncryptedContentInfo.");
            throw Y.errors = z, Y
        }
        var A = s8.derToOid(_.contentType);
        if (A !== Bz.oids.data) {
            var Y = Error("PKCS#12 EncryptedContentInfo ContentType is not Data.");
            throw Y.oid = A, Y
        }
        A = s8.derToOid(_.encAlgorithm);
        var O = Bz.pbe.getCipher(A, _.encParameter, K),
            w = _l1(_.encryptedContentAsn1),
            $ = F$.util.createBuffer(w.value);
        if (O.update($), !O.finish()) throw Error("Failed to decrypt PKCS#12 SafeContents.");
        return O.output.getBytes()
    }

    function Djz(q, K, _) {
        if (!K && q.length === 0) return [];
        if (q = s8.fromDer(q, K), q.tagClass !== s8.Class.UNIVERSAL || q.type !== s8.Type.SEQUENCE || q.constructed !== !0) throw Error("PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag.");
        var z = [];
        for (var Y = 0; Y < q.value.length; Y++) {
            var A = q.value[Y],
                O = {},
                w = [];
            if (!s8.validate(A, Jjz, O, w)) {
                var $ = Error("Cannot read SafeBag.");
                throw $.errors = w, $
            }
            var j = {
                type: s8.derToOid(O.bagId),
                attributes: Zjz(O.bagAttributes)
            };
            z.push(j);
            var H, J, X = O.bagValue.value[0];
            switch (j.type) {
                case Bz.oids.pkcs8ShroudedKeyBag:
                    if (X = Bz.decryptPrivateKeyInfo(X, _), X === null) throw Error("Unable to decrypt PKCS#8 ShroudedKeyBag, wrong password?");
                case Bz.oids.keyBag:
                    try {
                        j.key = Bz.privateKeyFromAsn1(X)
                    } catch (P) {
                        j.key = null, j.asn1 = X
                    }
                    continue;
                case Bz.oids.certBag:
                    H = Mjz, J = function() {
                        if (s8.derToOid(O.certId) !== Bz.oids.x509Certificate) {
                            var P = Error("Unsupported certificate type, only X.509 supported.");
                            throw P.oid = s8.derToOid(O.certId), P
                        }
                        var W = s8.fromDer(O.cert, K);
                        try {
                            j.cert = Bz.certificateFromAsn1(W, !0)
                        } catch (D) {
                            j.cert = null, j.asn1 = W
                        }
                    };
                    break;
                default:
                    var $ = Error("Unsupported PKCS#12 SafeBag type.");
                    throw $.oid = j.type, $
            }
            if (H !== void 0 && !s8.validate(X, H, O, w)) {
                var $ = Error("Cannot read PKCS#12 " + H.name);
                throw $.errors = w, $
            }
            J()
        }
        return z
    }

    function Zjz(q) {
        var K = {};
        if (q !== void 0)
            for (var _ = 0; _ < q.length; ++_) {
                var z = {},
                    Y = [];
                if (!s8.validate(q[_], Xjz, z, Y)) {
                    var A = Error("Cannot read PKCS#12 BagAttribute.");
                    throw A.errors = Y, A
                }
                var O = s8.derToOid(z.oid);
                if (Bz.oids[O] === void 0) continue;
                K[Bz.oids[O]] = [];
                for (var w = 0; w < z.values.length; ++w) K[Bz.oids[O]].push(z.values[w].value)
            }
        return K
    }
    w88.toPkcs12Asn1 = function(q, K, _, z) {
        if (z = z || {}, z.saltSize = z.saltSize || 8, z.count = z.count || 2048, z.algorithm = z.algorithm || z.encAlgorithm || "aes128", !("useMac" in z)) z.useMac = !0;
        if (!("localKeyId" in z)) z.localKeyId = null;
        if (!("generateLocalKeyId" in z)) z.generateLocalKeyId = !0;
        var Y = z.localKeyId,
            A;
        if (Y !== null) Y = F$.util.hexToBytes(Y);
        else if (z.generateLocalKeyId)
            if (K) {
                var O = F$.util.isArray(K) ? K[0] : K;
                if (typeof O === "string") O = Bz.certificateFromPem(O);
                var w = F$.md.sha1.create();
                w.update(s8.toDer(Bz.certificateToAsn1(O)).getBytes()), Y = w.digest().getBytes()
            } else Y = F$.random.getBytes(20);
        var $ = [];
        if (Y !== null) $.push(s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.OID, !1, s8.oidToDer(Bz.oids.localKeyId).getBytes()), s8.create(s8.Class.UNIVERSAL, s8.Type.SET, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.OCTETSTRING, !1, Y)])]));
        if ("friendlyName" in z) $.push(s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.OID, !1, s8.oidToDer(Bz.oids.friendlyName).getBytes()), s8.create(s8.Class.UNIVERSAL, s8.Type.SET, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.BMPSTRING, !1, z.friendlyName)])]));
        if ($.length > 0) A = s8.create(s8.Class.UNIVERSAL, s8.Type.SET, !0, $);
        var j = [],
            H = [];
        if (K !== null)
            if (F$.util.isArray(K)) H = K;
            else H = [K];
        var J = [];
        for (var X = 0; X < H.length; ++X) {
            if (K = H[X], typeof K === "string") K = Bz.certificateFromPem(K);
            var M = X === 0 ? A : void 0,
                P = Bz.certificateToAsn1(K),
                W = s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.OID, !1, s8.oidToDer(Bz.oids.certBag).getBytes()), s8.create(s8.Class.CONTEXT_SPECIFIC, 0, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.OID, !1, s8.oidToDer(Bz.oids.x509Certificate).getBytes()), s8.create(s8.Class.CONTEXT_SPECIFIC, 0, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.OCTETSTRING, !1, s8.toDer(P).getBytes())])])]), M]);
            J.push(W)
        }
        if (J.length > 0) {
            var D = s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, J),
                Z = s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.OID, !1, s8.oidToDer(Bz.oids.data).getBytes()), s8.create(s8.Class.CONTEXT_SPECIFIC, 0, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.OCTETSTRING, !1, s8.toDer(D).getBytes())])]);
            j.push(Z)
        }
        var G = null;
        if (q !== null) {
            var f = Bz.wrapRsaPrivateKey(Bz.privateKeyToAsn1(q));
            if (_ === null) G = s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.OID, !1, s8.oidToDer(Bz.oids.keyBag).getBytes()), s8.create(s8.Class.CONTEXT_SPECIFIC, 0, !0, [f]), A]);
            else G = s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.OID, !1, s8.oidToDer(Bz.oids.pkcs8ShroudedKeyBag).getBytes()), s8.create(s8.Class.CONTEXT_SPECIFIC, 0, !0, [Bz.encryptPrivateKeyInfo(f, _, z)]), A]);
            var v = s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, [G]),
                V = s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.OID, !1, s8.oidToDer(Bz.oids.data).getBytes()), s8.create(s8.Class.CONTEXT_SPECIFIC, 0, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.OCTETSTRING, !1, s8.toDer(v).getBytes())])]);
            j.push(V)
        }
        var k = s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, j),
            N;
        if (z.useMac) {
            var w = F$.md.sha1.create(),
                R = new F$.util.ByteBuffer(F$.random.getBytes(z.saltSize)),
                h = z.count,
                q = w88.generateKey(_, R, 3, h, 20),
                C = F$.hmac.create();
            C.start(w, q), C.update(s8.toDer(k).getBytes());
            var x = C.getMac();
            N = s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.OID, !1, s8.oidToDer(Bz.oids.sha1).getBytes()), s8.create(s8.Class.UNIVERSAL, s8.Type.NULL, !1, "")]), s8.create(s8.Class.UNIVERSAL, s8.Type.OCTETSTRING, !1, x.getBytes())]), s8.create(s8.Class.UNIVERSAL, s8.Type.OCTETSTRING, !1, R.getBytes()), s8.create(s8.Class.UNIVERSAL, s8.Type.INTEGER, !1, s8.integerToDer(h).getBytes())])
        }
        return s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.INTEGER, !1, s8.integerToDer(3).getBytes()), s8.create(s8.Class.UNIVERSAL, s8.Type.SEQUENCE, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.OID, !1, s8.oidToDer(Bz.oids.data).getBytes()), s8.create(s8.Class.CONTEXT_SPECIFIC, 0, !0, [s8.create(s8.Class.UNIVERSAL, s8.Type.OCTETSTRING, !1, s8.toDer(k).getBytes())])]), N])
    };
    w88.generateKey = F$.pbe.generatePkcs12Key
})
// @from(Ln 250874, Col 4)
Al1 = p((Whw, ML4) => {
    var L56 = p_();
    mp();
    k56();
    tc1();
    NH6();
    iC8();
    zl1();
    qb8();
    A88();
    RA();
    zb8();
    var Yl1 = L56.asn1,
        _h6 = ML4.exports = L56.pki = L56.pki || {};
    _h6.pemToDer = function(q) {
        var K = L56.pem.decode(q)[0];
        if (K.procType && K.procType.type === "ENCRYPTED") throw Error("Could not convert PEM to DER; PEM is encrypted.");
        return L56.util.createBuffer(K.body)
    };
    _h6.privateKeyFromPem = function(q) {
        var K = L56.pem.decode(q)[0];
        if (K.type !== "PRIVATE KEY" && K.type !== "RSA PRIVATE KEY") {
            var _ = Error('Could not convert private key from PEM; PEM header type is not "PRIVATE KEY" or "RSA PRIVATE KEY".');
            throw _.headerType = K.type, _
        }
        if (K.procType && K.procType.type === "ENCRYPTED") throw Error("Could not convert private key from PEM; PEM is encrypted.");
        var z = Yl1.fromDer(K.body);
        return _h6.privateKeyFromAsn1(z)
    };
    _h6.privateKeyToPem = function(q, K) {
        var _ = {
            type: "RSA PRIVATE KEY",
            body: Yl1.toDer(_h6.privateKeyToAsn1(q)).getBytes()
        };
        return L56.pem.encode(_, {
            maxline: K
        })
    };
    _h6.privateKeyInfoToPem = function(q, K) {
        var _ = {
            type: "PRIVATE KEY",
            body: Yl1.toDer(q).getBytes()
        };
        return L56.pem.encode(_, {
            maxline: K
        })
    }
})