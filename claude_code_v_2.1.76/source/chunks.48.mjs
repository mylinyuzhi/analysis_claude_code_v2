
// @from(Ln 118547, Col 4)
BY1 = x((Bv_, Hj7) => {
    var lq = h3();
    Aa();
    GC();
    mI6();
    cu();
    Yj7();
    qa();
    $q6();
    xY1();
    FI6();
    tY();
    var q1 = lq.asn1,
        T7 = Hj7.exports = lq.pki = lq.pki || {},
        SY = T7.oids,
        xH = {};
    xH.CN = SY.commonName;
    xH.commonName = "CN";
    xH.C = SY.countryName;
    xH.countryName = "C";
    xH.L = SY.localityName;
    xH.localityName = "L";
    xH.ST = SY.stateOrProvinceName;
    xH.stateOrProvinceName = "ST";
    xH.O = SY.organizationName;
    xH.organizationName = "O";
    xH.OU = SY.organizationalUnitName;
    xH.organizationalUnitName = "OU";
    xH.E = SY.emailAddress;
    xH.emailAddress = "E";
    var wj7 = lq.pki.rsa.publicKeyValidator,
        kW3 = {
            name: "Certificate",
            tagClass: q1.Class.UNIVERSAL,
            type: q1.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "Certificate.TBSCertificate",
                tagClass: q1.Class.UNIVERSAL,
                type: q1.Type.SEQUENCE,
                constructed: !0,
                captureAsn1: "tbsCertificate",
                value: [{
                    name: "Certificate.TBSCertificate.version",
                    tagClass: q1.Class.CONTEXT_SPECIFIC,
                    type: 0,
                    constructed: !0,
                    optional: !0,
                    value: [{
                        name: "Certificate.TBSCertificate.version.integer",
                        tagClass: q1.Class.UNIVERSAL,
                        type: q1.Type.INTEGER,
                        constructed: !1,
                        capture: "certVersion"
                    }]
                }, {
                    name: "Certificate.TBSCertificate.serialNumber",
                    tagClass: q1.Class.UNIVERSAL,
                    type: q1.Type.INTEGER,
                    constructed: !1,
                    capture: "certSerialNumber"
                }, {
                    name: "Certificate.TBSCertificate.signature",
                    tagClass: q1.Class.UNIVERSAL,
                    type: q1.Type.SEQUENCE,
                    constructed: !0,
                    value: [{
                        name: "Certificate.TBSCertificate.signature.algorithm",
                        tagClass: q1.Class.UNIVERSAL,
                        type: q1.Type.OID,
                        constructed: !1,
                        capture: "certinfoSignatureOid"
                    }, {
                        name: "Certificate.TBSCertificate.signature.parameters",
                        tagClass: q1.Class.UNIVERSAL,
                        optional: !0,
                        captureAsn1: "certinfoSignatureParams"
                    }]
                }, {
                    name: "Certificate.TBSCertificate.issuer",
                    tagClass: q1.Class.UNIVERSAL,
                    type: q1.Type.SEQUENCE,
                    constructed: !0,
                    captureAsn1: "certIssuer"
                }, {
                    name: "Certificate.TBSCertificate.validity",
                    tagClass: q1.Class.UNIVERSAL,
                    type: q1.Type.SEQUENCE,
                    constructed: !0,
                    value: [{
                        name: "Certificate.TBSCertificate.validity.notBefore (utc)",
                        tagClass: q1.Class.UNIVERSAL,
                        type: q1.Type.UTCTIME,
                        constructed: !1,
                        optional: !0,
                        capture: "certValidity1UTCTime"
                    }, {
                        name: "Certificate.TBSCertificate.validity.notBefore (generalized)",
                        tagClass: q1.Class.UNIVERSAL,
                        type: q1.Type.GENERALIZEDTIME,
                        constructed: !1,
                        optional: !0,
                        capture: "certValidity2GeneralizedTime"
                    }, {
                        name: "Certificate.TBSCertificate.validity.notAfter (utc)",
                        tagClass: q1.Class.UNIVERSAL,
                        type: q1.Type.UTCTIME,
                        constructed: !1,
                        optional: !0,
                        capture: "certValidity3UTCTime"
                    }, {
                        name: "Certificate.TBSCertificate.validity.notAfter (generalized)",
                        tagClass: q1.Class.UNIVERSAL,
                        type: q1.Type.GENERALIZEDTIME,
                        constructed: !1,
                        optional: !0,
                        capture: "certValidity4GeneralizedTime"
                    }]
                }, {
                    name: "Certificate.TBSCertificate.subject",
                    tagClass: q1.Class.UNIVERSAL,
                    type: q1.Type.SEQUENCE,
                    constructed: !0,
                    captureAsn1: "certSubject"
                }, wj7, {
                    name: "Certificate.TBSCertificate.issuerUniqueID",
                    tagClass: q1.Class.CONTEXT_SPECIFIC,
                    type: 1,
                    constructed: !0,
                    optional: !0,
                    value: [{
                        name: "Certificate.TBSCertificate.issuerUniqueID.id",
                        tagClass: q1.Class.UNIVERSAL,
                        type: q1.Type.BITSTRING,
                        constructed: !1,
                        captureBitStringValue: "certIssuerUniqueId"
                    }]
                }, {
                    name: "Certificate.TBSCertificate.subjectUniqueID",
                    tagClass: q1.Class.CONTEXT_SPECIFIC,
                    type: 2,
                    constructed: !0,
                    optional: !0,
                    value: [{
                        name: "Certificate.TBSCertificate.subjectUniqueID.id",
                        tagClass: q1.Class.UNIVERSAL,
                        type: q1.Type.BITSTRING,
                        constructed: !1,
                        captureBitStringValue: "certSubjectUniqueId"
                    }]
                }, {
                    name: "Certificate.TBSCertificate.extensions",
                    tagClass: q1.Class.CONTEXT_SPECIFIC,
                    type: 3,
                    constructed: !0,
                    captureAsn1: "certExtensions",
                    optional: !0
                }]
            }, {
                name: "Certificate.signatureAlgorithm",
                tagClass: q1.Class.UNIVERSAL,
                type: q1.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "Certificate.signatureAlgorithm.algorithm",
                    tagClass: q1.Class.UNIVERSAL,
                    type: q1.Type.OID,
                    constructed: !1,
                    capture: "certSignatureOid"
                }, {
                    name: "Certificate.TBSCertificate.signature.parameters",
                    tagClass: q1.Class.UNIVERSAL,
                    optional: !0,
                    captureAsn1: "certSignatureParams"
                }]
            }, {
                name: "Certificate.signatureValue",
                tagClass: q1.Class.UNIVERSAL,
                type: q1.Type.BITSTRING,
                constructed: !1,
                captureBitStringValue: "certSignature"
            }]
        },
        EW3 = {
            name: "rsapss",
            tagClass: q1.Class.UNIVERSAL,
            type: q1.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "rsapss.hashAlgorithm",
                tagClass: q1.Class.CONTEXT_SPECIFIC,
                type: 0,
                constructed: !0,
                value: [{
                    name: "rsapss.hashAlgorithm.AlgorithmIdentifier",
                    tagClass: q1.Class.UNIVERSAL,
                    type: q1.Class.SEQUENCE,
                    constructed: !0,
                    optional: !0,
                    value: [{
                        name: "rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm",
                        tagClass: q1.Class.UNIVERSAL,
                        type: q1.Type.OID,
                        constructed: !1,
                        capture: "hashOid"
                    }]
                }]
            }, {
                name: "rsapss.maskGenAlgorithm",
                tagClass: q1.Class.CONTEXT_SPECIFIC,
                type: 1,
                constructed: !0,
                value: [{
                    name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier",
                    tagClass: q1.Class.UNIVERSAL,
                    type: q1.Class.SEQUENCE,
                    constructed: !0,
                    optional: !0,
                    value: [{
                        name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm",
                        tagClass: q1.Class.UNIVERSAL,
                        type: q1.Type.OID,
                        constructed: !1,
                        capture: "maskGenOid"
                    }, {
                        name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params",
                        tagClass: q1.Class.UNIVERSAL,
                        type: q1.Type.SEQUENCE,
                        constructed: !0,
                        value: [{
                            name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm",
                            tagClass: q1.Class.UNIVERSAL,
                            type: q1.Type.OID,
                            constructed: !1,
                            capture: "maskGenHashOid"
                        }]
                    }]
                }]
            }, {
                name: "rsapss.saltLength",
                tagClass: q1.Class.CONTEXT_SPECIFIC,
                type: 2,
                optional: !0,
                value: [{
                    name: "rsapss.saltLength.saltLength",
                    tagClass: q1.Class.UNIVERSAL,
                    type: q1.Class.INTEGER,
                    constructed: !1,
                    capture: "saltLength"
                }]
            }, {
                name: "rsapss.trailerField",
                tagClass: q1.Class.CONTEXT_SPECIFIC,
                type: 3,
                optional: !0,
                value: [{
                    name: "rsapss.trailer.trailer",
                    tagClass: q1.Class.UNIVERSAL,
                    type: q1.Class.INTEGER,
                    constructed: !1,
                    capture: "trailer"
                }]
            }]
        },
        yW3 = {
            name: "CertificationRequestInfo",
            tagClass: q1.Class.UNIVERSAL,
            type: q1.Type.SEQUENCE,
            constructed: !0,
            captureAsn1: "certificationRequestInfo",
            value: [{
                name: "CertificationRequestInfo.integer",
                tagClass: q1.Class.UNIVERSAL,
                type: q1.Type.INTEGER,
                constructed: !1,
                capture: "certificationRequestInfoVersion"
            }, {
                name: "CertificationRequestInfo.subject",
                tagClass: q1.Class.UNIVERSAL,
                type: q1.Type.SEQUENCE,
                constructed: !0,
                captureAsn1: "certificationRequestInfoSubject"
            }, wj7, {
                name: "CertificationRequestInfo.attributes",
                tagClass: q1.Class.CONTEXT_SPECIFIC,
                type: 0,
                constructed: !0,
                optional: !0,
                capture: "certificationRequestInfoAttributes",
                value: [{
                    name: "CertificationRequestInfo.attributes",
                    tagClass: q1.Class.UNIVERSAL,
                    type: q1.Type.SEQUENCE,
                    constructed: !0,
                    value: [{
                        name: "CertificationRequestInfo.attributes.type",
                        tagClass: q1.Class.UNIVERSAL,
                        type: q1.Type.OID,
                        constructed: !1
                    }, {
                        name: "CertificationRequestInfo.attributes.value",
                        tagClass: q1.Class.UNIVERSAL,
                        type: q1.Type.SET,
                        constructed: !0
                    }]
                }]
            }]
        },
        LW3 = {
            name: "CertificationRequest",
            tagClass: q1.Class.UNIVERSAL,
            type: q1.Type.SEQUENCE,
            constructed: !0,
            captureAsn1: "csr",
            value: [yW3, {
                name: "CertificationRequest.signatureAlgorithm",
                tagClass: q1.Class.UNIVERSAL,
                type: q1.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "CertificationRequest.signatureAlgorithm.algorithm",
                    tagClass: q1.Class.UNIVERSAL,
                    type: q1.Type.OID,
                    constructed: !1,
                    capture: "csrSignatureOid"
                }, {
                    name: "CertificationRequest.signatureAlgorithm.parameters",
                    tagClass: q1.Class.UNIVERSAL,
                    optional: !0,
                    captureAsn1: "csrSignatureParams"
                }]
            }, {
                name: "CertificationRequest.signature",
                tagClass: q1.Class.UNIVERSAL,
                type: q1.Type.BITSTRING,
                constructed: !1,
                captureBitStringValue: "csrSignature"
            }]
        };
    T7.RDNAttributesAsArray = function(A, q) {
        var K = [],
            Y, z, _;
        for (var w = 0; w < A.value.length; ++w) {
            Y = A.value[w];
            for (var O = 0; O < Y.value.length; ++O) {
                if (_ = {}, z = Y.value[O], _.type = q1.derToOid(z.value[0].value), _.value = z.value[1].value, _.valueTagClass = z.value[1].type, _.type in SY) {
                    if (_.name = SY[_.type], _.name in xH) _.shortName = xH[_.name]
                }
                if (q) q.update(_.type), q.update(_.value);
                K.push(_)
            }
        }
        return K
    };
    T7.CRIAttributesAsArray = function(A) {
        var q = [];
        for (var K = 0; K < A.length; ++K) {
            var Y = A[K],
                z = q1.derToOid(Y.value[0].value),
                _ = Y.value[1].value;
            for (var w = 0; w < _.length; ++w) {
                var O = {};
                if (O.type = z, O.value = _[w].value, O.valueTagClass = _[w].type, O.type in SY) {
                    if (O.name = SY[O.type], O.name in xH) O.shortName = xH[O.name]
                }
                if (O.type === SY.extensionRequest) {
                    O.extensions = [];
                    for (var $ = 0; $ < O.value.length; ++$) O.extensions.push(T7.certificateExtensionFromAsn1(O.value[$]))
                }
                q.push(O)
            }
        }
        return q
    };

    function za(A, q) {
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
    var uY1 = function(A, q, K) {
            var Y = {};
            if (A !== SY["RSASSA-PSS"]) return Y;
            if (K) Y = {
                hash: {
                    algorithmOid: SY.sha1
                },
                mgf: {
                    algorithmOid: SY.mgf1,
                    hash: {
                        algorithmOid: SY.sha1
                    }
                },
                saltLength: 20
            };
            var z = {},
                _ = [];
            if (!q1.validate(q, EW3, z, _)) {
                var w = Error("Cannot read RSASSA-PSS parameter block.");
                throw w.errors = _, w
            }
            if (z.hashOid !== void 0) Y.hash = Y.hash || {}, Y.hash.algorithmOid = q1.derToOid(z.hashOid);
            if (z.maskGenOid !== void 0) Y.mgf = Y.mgf || {}, Y.mgf.algorithmOid = q1.derToOid(z.maskGenOid), Y.mgf.hash = Y.mgf.hash || {}, Y.mgf.hash.algorithmOid = q1.derToOid(z.maskGenHashOid);
            if (z.saltLength !== void 0) Y.saltLength = z.saltLength.charCodeAt(0);
            return Y
        },
        mY1 = function(A) {
            switch (SY[A.signatureOid]) {
                case "sha1WithRSAEncryption":
                case "sha1WithRSASignature":
                    return lq.md.sha1.create();
                case "md5WithRSAEncryption":
                    return lq.md.md5.create();
                case "sha256WithRSAEncryption":
                    return lq.md.sha256.create();
                case "sha384WithRSAEncryption":
                    return lq.md.sha384.create();
                case "sha512WithRSAEncryption":
                    return lq.md.sha512.create();
                case "RSASSA-PSS":
                    return lq.md.sha256.create();
                default:
                    var q = Error("Could not compute " + A.type + " digest. Unknown signature OID.");
                    throw q.signatureOid = A.signatureOid, q
            }
        },
        Oj7 = function(A) {
            var q = A.certificate,
                K;
            switch (q.signatureOid) {
                case SY.sha1WithRSAEncryption:
                case SY.sha1WithRSASignature:
                    break;
                case SY["RSASSA-PSS"]:
                    var Y, z;
                    if (Y = SY[q.signatureParameters.mgf.hash.algorithmOid], Y === void 0 || lq.md[Y] === void 0) {
                        var _ = Error("Unsupported MGF hash function.");
                        throw _.oid = q.signatureParameters.mgf.hash.algorithmOid, _.name = Y, _
                    }
                    if (z = SY[q.signatureParameters.mgf.algorithmOid], z === void 0 || lq.mgf[z] === void 0) {
                        var _ = Error("Unsupported MGF function.");
                        throw _.oid = q.signatureParameters.mgf.algorithmOid, _.name = z, _
                    }
                    if (z = lq.mgf[z].create(lq.md[Y].create()), Y = SY[q.signatureParameters.hash.algorithmOid], Y === void 0 || lq.md[Y] === void 0) {
                        var _ = Error("Unsupported RSASSA-PSS hash function.");
                        throw _.oid = q.signatureParameters.hash.algorithmOid, _.name = Y, _
                    }
                    K = lq.pss.create(lq.md[Y].create(), z, q.signatureParameters.saltLength);
                    break
            }
            return q.publicKey.verify(A.md.digest().getBytes(), A.signature, K)
        };
    T7.certificateFromPem = function(A, q, K) {
        var Y = lq.pem.decode(A)[0];
        if (Y.type !== "CERTIFICATE" && Y.type !== "X509 CERTIFICATE" && Y.type !== "TRUSTED CERTIFICATE") {
            var z = Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
            throw z.headerType = Y.type, z
        }
        if (Y.procType && Y.procType.type === "ENCRYPTED") throw Error("Could not convert certificate from PEM; PEM is encrypted.");
        var _ = q1.fromDer(Y.body, K);
        return T7.certificateFromAsn1(_, q)
    };
    T7.certificateToPem = function(A, q) {
        var K = {
            type: "CERTIFICATE",
            body: q1.toDer(T7.certificateToAsn1(A)).getBytes()
        };
        return lq.pem.encode(K, {
            maxline: q
        })
    };
    T7.publicKeyFromPem = function(A) {
        var q = lq.pem.decode(A)[0];
        if (q.type !== "PUBLIC KEY" && q.type !== "RSA PUBLIC KEY") {
            var K = Error('Could not convert public key from PEM; PEM header type is not "PUBLIC KEY" or "RSA PUBLIC KEY".');
            throw K.headerType = q.type, K
        }
        if (q.procType && q.procType.type === "ENCRYPTED") throw Error("Could not convert public key from PEM; PEM is encrypted.");
        var Y = q1.fromDer(q.body);
        return T7.publicKeyFromAsn1(Y)
    };
    T7.publicKeyToPem = function(A, q) {
        var K = {
            type: "PUBLIC KEY",
            body: q1.toDer(T7.publicKeyToAsn1(A)).getBytes()
        };
        return lq.pem.encode(K, {
            maxline: q
        })
    };
    T7.publicKeyToRSAPublicKeyPem = function(A, q) {
        var K = {
            type: "RSA PUBLIC KEY",
            body: q1.toDer(T7.publicKeyToRSAPublicKey(A)).getBytes()
        };
        return lq.pem.encode(K, {
            maxline: q
        })
    };
    T7.getPublicKeyFingerprint = function(A, q) {
        q = q || {};
        var K = q.md || lq.md.sha1.create(),
            Y = q.type || "RSAPublicKey",
            z;
        switch (Y) {
            case "RSAPublicKey":
                z = q1.toDer(T7.publicKeyToRSAPublicKey(A)).getBytes();
                break;
            case "SubjectPublicKeyInfo":
                z = q1.toDer(T7.publicKeyToAsn1(A)).getBytes();
                break;
            default:
                throw Error('Unknown fingerprint type "' + q.type + '".')
        }
        K.start(), K.update(z);
        var _ = K.digest();
        if (q.encoding === "hex") {
            var w = _.toHex();
            if (q.delimiter) return w.match(/.{2}/g).join(q.delimiter);
            return w
        } else if (q.encoding === "binary") return _.getBytes();
        else if (q.encoding) throw Error('Unknown encoding "' + q.encoding + '".');
        return _
    };
    T7.certificationRequestFromPem = function(A, q, K) {
        var Y = lq.pem.decode(A)[0];
        if (Y.type !== "CERTIFICATE REQUEST") {
            var z = Error('Could not convert certification request from PEM; PEM header type is not "CERTIFICATE REQUEST".');
            throw z.headerType = Y.type, z
        }
        if (Y.procType && Y.procType.type === "ENCRYPTED") throw Error("Could not convert certification request from PEM; PEM is encrypted.");
        var _ = q1.fromDer(Y.body, K);
        return T7.certificationRequestFromAsn1(_, q)
    };
    T7.certificationRequestToPem = function(A, q) {
        var K = {
            type: "CERTIFICATE REQUEST",
            body: q1.toDer(T7.certificationRequestToAsn1(A)).getBytes()
        };
        return lq.pem.encode(K, {
            maxline: q
        })
    };
    T7.createCertificate = function() {
        var A = {};
        return A.version = 2, A.serialNumber = "00", A.signatureOid = null, A.signature = null, A.siginfo = {}, A.siginfo.algorithmOid = null, A.validity = {}, A.validity.notBefore = new Date, A.validity.notAfter = new Date, A.issuer = {}, A.issuer.getField = function(q) {
            return za(A.issuer, q)
        }, A.issuer.addField = function(q) {
            ML([q]), A.issuer.attributes.push(q)
        }, A.issuer.attributes = [], A.issuer.hash = null, A.subject = {}, A.subject.getField = function(q) {
            return za(A.subject, q)
        }, A.subject.addField = function(q) {
            ML([q]), A.subject.attributes.push(q)
        }, A.subject.attributes = [], A.subject.hash = null, A.extensions = [], A.publicKey = null, A.md = null, A.setSubject = function(q, K) {
            if (ML(q), A.subject.attributes = q, delete A.subject.uniqueId, K) A.subject.uniqueId = K;
            A.subject.hash = null
        }, A.setIssuer = function(q, K) {
            if (ML(q), A.issuer.attributes = q, delete A.issuer.uniqueId, K) A.issuer.uniqueId = K;
            A.issuer.hash = null
        }, A.setExtensions = function(q) {
            for (var K = 0; K < q.length; ++K) $j7(q[K], {
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
            A.md = K || lq.md.sha1.create();
            var Y = SY[A.md.algorithm + "WithRSAEncryption"];
            if (!Y) {
                var z = Error("Could not compute certificate digest. Unknown message digest algorithm OID.");
                throw z.algorithm = A.md.algorithm, z
            }
            A.signatureOid = A.siginfo.algorithmOid = Y, A.tbsCertificate = T7.getTBSCertificate(A);
            var _ = q1.toDer(A.tbsCertificate);
            A.md.update(_.getBytes()), A.signature = q.sign(A.md)
        }, A.verify = function(q) {
            var K = !1;
            if (!A.issued(q)) {
                var Y = q.issuer,
                    z = A.subject,
                    _ = Error("The parent certificate did not issue the given child certificate; the child certificate's issuer does not match the parent's subject.");
                throw _.expectedIssuer = z.attributes, _.actualIssuer = Y.attributes, _
            }
            var w = q.md;
            if (w === null) {
                w = mY1({
                    signatureOid: q.signatureOid,
                    type: "certificate"
                });
                var O = q.tbsCertificate || T7.getTBSCertificate(q),
                    $ = q1.toDer(O);
                w.update($.getBytes())
            }
            if (w !== null) K = Oj7({
                certificate: A,
                md: w,
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
                var _, w;
                for (var O = 0; K && O < Y.attributes.length; ++O)
                    if (_ = Y.attributes[O], w = z.attributes[O], _.type !== w.type || _.value !== w.value) K = !1
            }
            return K
        }, A.issued = function(q) {
            return q.isIssuer(A)
        }, A.generateSubjectKeyIdentifier = function() {
            return T7.getPublicKeyFingerprint(A.publicKey, {
                type: "RSAPublicKey"
            })
        }, A.verifySubjectKeyIdentifier = function() {
            var q = SY.subjectKeyIdentifier;
            for (var K = 0; K < A.extensions.length; ++K) {
                var Y = A.extensions[K];
                if (Y.id === q) {
                    var z = A.generateSubjectKeyIdentifier().getBytes();
                    return lq.util.hexToBytes(Y.subjectKeyIdentifier) === z
                }
            }
            return !1
        }, A
    };
    T7.certificateFromAsn1 = function(A, q) {
        var K = {},
            Y = [];
        if (!q1.validate(A, kW3, K, Y)) {
            var z = Error("Cannot read X.509 certificate. ASN.1 object is not an X509v3 Certificate.");
            throw z.errors = Y, z
        }
        var _ = q1.derToOid(K.publicKeyOid);
        if (_ !== T7.oids.rsaEncryption) throw Error("Cannot read public key. OID is not RSA.");
        var w = T7.createCertificate();
        w.version = K.certVersion ? K.certVersion.charCodeAt(0) : 0;
        var O = lq.util.createBuffer(K.certSerialNumber);
        w.serialNumber = O.toHex(), w.signatureOid = lq.asn1.derToOid(K.certSignatureOid), w.signatureParameters = uY1(w.signatureOid, K.certSignatureParams, !0), w.siginfo.algorithmOid = lq.asn1.derToOid(K.certinfoSignatureOid), w.siginfo.parameters = uY1(w.siginfo.algorithmOid, K.certinfoSignatureParams, !1), w.signature = K.certSignature;
        var $ = [];
        if (K.certValidity1UTCTime !== void 0) $.push(q1.utcTimeToDate(K.certValidity1UTCTime));
        if (K.certValidity2GeneralizedTime !== void 0) $.push(q1.generalizedTimeToDate(K.certValidity2GeneralizedTime));
        if (K.certValidity3UTCTime !== void 0) $.push(q1.utcTimeToDate(K.certValidity3UTCTime));
        if (K.certValidity4GeneralizedTime !== void 0) $.push(q1.generalizedTimeToDate(K.certValidity4GeneralizedTime));
        if ($.length > 2) throw Error("Cannot read notBefore/notAfter validity times; more than two times were provided in the certificate.");
        if ($.length < 2) throw Error("Cannot read notBefore/notAfter validity times; they were not provided as either UTCTime or GeneralizedTime.");
        if (w.validity.notBefore = $[0], w.validity.notAfter = $[1], w.tbsCertificate = K.tbsCertificate, q) {
            w.md = mY1({
                signatureOid: w.signatureOid,
                type: "certificate"
            });
            var H = q1.toDer(w.tbsCertificate);
            w.md.update(H.getBytes())
        }
        var j = lq.md.sha1.create(),
            J = q1.toDer(K.certIssuer);
        if (j.update(J.getBytes()), w.issuer.getField = function(X) {
                return za(w.issuer, X)
            }, w.issuer.addField = function(X) {
                ML([X]), w.issuer.attributes.push(X)
            }, w.issuer.attributes = T7.RDNAttributesAsArray(K.certIssuer), K.certIssuerUniqueId) w.issuer.uniqueId = K.certIssuerUniqueId;
        w.issuer.hash = j.digest().toHex();
        var M = lq.md.sha1.create(),
            D = q1.toDer(K.certSubject);
        if (M.update(D.getBytes()), w.subject.getField = function(X) {
                return za(w.subject, X)
            }, w.subject.addField = function(X) {
                ML([X]), w.subject.attributes.push(X)
            }, w.subject.attributes = T7.RDNAttributesAsArray(K.certSubject), K.certSubjectUniqueId) w.subject.uniqueId = K.certSubjectUniqueId;
        if (w.subject.hash = M.digest().toHex(), K.certExtensions) w.extensions = T7.certificateExtensionsFromAsn1(K.certExtensions);
        else w.extensions = [];
        return w.publicKey = T7.publicKeyFromAsn1(K.subjectPublicKeyInfo), w
    };
    T7.certificateExtensionsFromAsn1 = function(A) {
        var q = [];
        for (var K = 0; K < A.value.length; ++K) {
            var Y = A.value[K];
            for (var z = 0; z < Y.value.length; ++z) q.push(T7.certificateExtensionFromAsn1(Y.value[z]))
        }
        return q
    };
    T7.certificateExtensionFromAsn1 = function(A) {
        var q = {};
        if (q.id = q1.derToOid(A.value[0].value), q.critical = !1, A.value[1].type === q1.Type.BOOLEAN) q.critical = A.value[1].value.charCodeAt(0) !== 0, q.value = A.value[2].value;
        else q.value = A.value[1].value;
        if (q.id in SY) {
            if (q.name = SY[q.id], q.name === "keyUsage") {
                var K = q1.fromDer(q.value),
                    Y = 0,
                    z = 0;
                if (K.value.length > 1) Y = K.value.charCodeAt(1), z = K.value.length > 2 ? K.value.charCodeAt(2) : 0;
                q.digitalSignature = (Y & 128) === 128, q.nonRepudiation = (Y & 64) === 64, q.keyEncipherment = (Y & 32) === 32, q.dataEncipherment = (Y & 16) === 16, q.keyAgreement = (Y & 8) === 8, q.keyCertSign = (Y & 4) === 4, q.cRLSign = (Y & 2) === 2, q.encipherOnly = (Y & 1) === 1, q.decipherOnly = (z & 128) === 128
            } else if (q.name === "basicConstraints") {
                var K = q1.fromDer(q.value);
                if (K.value.length > 0 && K.value[0].type === q1.Type.BOOLEAN) q.cA = K.value[0].value.charCodeAt(0) !== 0;
                else q.cA = !1;
                var _ = null;
                if (K.value.length > 0 && K.value[0].type === q1.Type.INTEGER) _ = K.value[0].value;
                else if (K.value.length > 1) _ = K.value[1].value;
                if (_ !== null) q.pathLenConstraint = q1.derToInteger(_)
            } else if (q.name === "extKeyUsage") {
                var K = q1.fromDer(q.value);
                for (var w = 0; w < K.value.length; ++w) {
                    var O = q1.derToOid(K.value[w].value);
                    if (O in SY) q[SY[O]] = !0;
                    else q[O] = !0
                }
            } else if (q.name === "nsCertType") {
                var K = q1.fromDer(q.value),
                    Y = 0;
                if (K.value.length > 1) Y = K.value.charCodeAt(1);
                q.client = (Y & 128) === 128, q.server = (Y & 64) === 64, q.email = (Y & 32) === 32, q.objsign = (Y & 16) === 16, q.reserved = (Y & 8) === 8, q.sslCA = (Y & 4) === 4, q.emailCA = (Y & 2) === 2, q.objCA = (Y & 1) === 1
            } else if (q.name === "subjectAltName" || q.name === "issuerAltName") {
                q.altNames = [];
                var $, K = q1.fromDer(q.value);
                for (var H = 0; H < K.value.length; ++H) {
                    $ = K.value[H];
                    var j = {
                        type: $.type,
                        value: $.value
                    };
                    switch (q.altNames.push(j), $.type) {
                        case 1:
                        case 2:
                        case 6:
                            break;
                        case 7:
                            j.ip = lq.util.bytesToIP($.value);
                            break;
                        case 8:
                            j.oid = q1.derToOid($.value);
                            break;
                        default:
                    }
                }
            } else if (q.name === "subjectKeyIdentifier") {
                var K = q1.fromDer(q.value);
                q.subjectKeyIdentifier = lq.util.bytesToHex(K.value)
            }
        }
        return q
    };
    T7.certificationRequestFromAsn1 = function(A, q) {
        var K = {},
            Y = [];
        if (!q1.validate(A, LW3, K, Y)) {
            var z = Error("Cannot read PKCS#10 certificate request. ASN.1 object is not a PKCS#10 CertificationRequest.");
            throw z.errors = Y, z
        }
        var _ = q1.derToOid(K.publicKeyOid);
        if (_ !== T7.oids.rsaEncryption) throw Error("Cannot read public key. OID is not RSA.");
        var w = T7.createCertificationRequest();
        if (w.version = K.csrVersion ? K.csrVersion.charCodeAt(0) : 0, w.signatureOid = lq.asn1.derToOid(K.csrSignatureOid), w.signatureParameters = uY1(w.signatureOid, K.csrSignatureParams, !0), w.siginfo.algorithmOid = lq.asn1.derToOid(K.csrSignatureOid), w.siginfo.parameters = uY1(w.siginfo.algorithmOid, K.csrSignatureParams, !1), w.signature = K.csrSignature, w.certificationRequestInfo = K.certificationRequestInfo, q) {
            w.md = mY1({
                signatureOid: w.signatureOid,
                type: "certification request"
            });
            var O = q1.toDer(w.certificationRequestInfo);
            w.md.update(O.getBytes())
        }
        var $ = lq.md.sha1.create();
        return w.subject.getField = function(H) {
            return za(w.subject, H)
        }, w.subject.addField = function(H) {
            ML([H]), w.subject.attributes.push(H)
        }, w.subject.attributes = T7.RDNAttributesAsArray(K.certificationRequestInfoSubject, $), w.subject.hash = $.digest().toHex(), w.publicKey = T7.publicKeyFromAsn1(K.subjectPublicKeyInfo), w.getAttribute = function(H) {
            return za(w, H)
        }, w.addAttribute = function(H) {
            ML([H]), w.attributes.push(H)
        }, w.attributes = T7.CRIAttributesAsArray(K.certificationRequestInfoAttributes || []), w
    };
    T7.createCertificationRequest = function() {
        var A = {};
        return A.version = 0, A.signatureOid = null, A.signature = null, A.siginfo = {}, A.siginfo.algorithmOid = null, A.subject = {}, A.subject.getField = function(q) {
            return za(A.subject, q)
        }, A.subject.addField = function(q) {
            ML([q]), A.subject.attributes.push(q)
        }, A.subject.attributes = [], A.subject.hash = null, A.publicKey = null, A.attributes = [], A.getAttribute = function(q) {
            return za(A, q)
        }, A.addAttribute = function(q) {
            ML([q]), A.attributes.push(q)
        }, A.md = null, A.setSubject = function(q) {
            ML(q), A.subject.attributes = q, A.subject.hash = null
        }, A.setAttributes = function(q) {
            ML(q), A.attributes = q
        }, A.sign = function(q, K) {
            A.md = K || lq.md.sha1.create();
            var Y = SY[A.md.algorithm + "WithRSAEncryption"];
            if (!Y) {
                var z = Error("Could not compute certification request digest. Unknown message digest algorithm OID.");
                throw z.algorithm = A.md.algorithm, z
            }
            A.signatureOid = A.siginfo.algorithmOid = Y, A.certificationRequestInfo = T7.getCertificationRequestInfo(A);
            var _ = q1.toDer(A.certificationRequestInfo);
            A.md.update(_.getBytes()), A.signature = q.sign(A.md)
        }, A.verify = function() {
            var q = !1,
                K = A.md;
            if (K === null) {
                K = mY1({
                    signatureOid: A.signatureOid,
                    type: "certification request"
                });
                var Y = A.certificationRequestInfo || T7.getCertificationRequestInfo(A),
                    z = q1.toDer(Y);
                K.update(z.getBytes())
            }
            if (K !== null) q = Oj7({
                certificate: A,
                md: K,
                signature: A.signature
            });
            return q
        }, A
    };

    function WM6(A) {
        var q = q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, []),
            K, Y, z = A.attributes;
        for (var _ = 0; _ < z.length; ++_) {
            K = z[_];
            var w = K.value,
                O = q1.Type.PRINTABLESTRING;
            if ("valueTagClass" in K) {
                if (O = K.valueTagClass, O === q1.Type.UTF8) w = lq.util.encodeUtf8(w)
            }
            Y = q1.create(q1.Class.UNIVERSAL, q1.Type.SET, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.OID, !1, q1.oidToDer(K.type).getBytes()), q1.create(q1.Class.UNIVERSAL, O, !1, w)])]), q.value.push(Y)
        }
        return q
    }

    function ML(A) {
        var q;
        for (var K = 0; K < A.length; ++K) {
            if (q = A[K], typeof q.name > "u") {
                if (q.type && q.type in T7.oids) q.name = T7.oids[q.type];
                else if (q.shortName && q.shortName in xH) q.name = T7.oids[xH[q.shortName]]
            }
            if (typeof q.type > "u")
                if (q.name && q.name in T7.oids) q.type = T7.oids[q.name];
                else {
                    var Y = Error("Attribute type not specified.");
                    throw Y.attribute = q, Y
                } if (typeof q.shortName > "u") {
                if (q.name && q.name in xH) q.shortName = xH[q.name]
            }
            if (q.type === SY.extensionRequest) {
                if (q.valueConstructed = !0, q.valueTagClass = q1.Type.SEQUENCE, !q.value && q.extensions) {
                    q.value = [];
                    for (var z = 0; z < q.extensions.length; ++z) q.value.push(T7.certificateExtensionToAsn1($j7(q.extensions[z])))
                }
            }
            if (typeof q.value > "u") {
                var Y = Error("Attribute value not specified.");
                throw Y.attribute = q, Y
            }
        }
    }

    function $j7(A, q) {
        if (q = q || {}, typeof A.name > "u") {
            if (A.id && A.id in T7.oids) A.name = T7.oids[A.id]
        }
        if (typeof A.id > "u")
            if (A.name && A.name in T7.oids) A.id = T7.oids[A.name];
            else {
                var K = Error("Extension ID not specified.");
                throw K.extension = A, K
            } if (typeof A.value < "u") return A;
        if (A.name === "keyUsage") {
            var Y = 0,
                z = 0,
                _ = 0;
            if (A.digitalSignature) z |= 128, Y = 7;
            if (A.nonRepudiation) z |= 64, Y = 6;
            if (A.keyEncipherment) z |= 32, Y = 5;
            if (A.dataEncipherment) z |= 16, Y = 4;
            if (A.keyAgreement) z |= 8, Y = 3;
            if (A.keyCertSign) z |= 4, Y = 2;
            if (A.cRLSign) z |= 2, Y = 1;
            if (A.encipherOnly) z |= 1, Y = 0;
            if (A.decipherOnly) _ |= 128, Y = 7;
            var w = String.fromCharCode(Y);
            if (_ !== 0) w += String.fromCharCode(z) + String.fromCharCode(_);
            else if (z !== 0) w += String.fromCharCode(z);
            A.value = q1.create(q1.Class.UNIVERSAL, q1.Type.BITSTRING, !1, w)
        } else if (A.name === "basicConstraints") {
            if (A.value = q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, []), A.cA) A.value.value.push(q1.create(q1.Class.UNIVERSAL, q1.Type.BOOLEAN, !1, String.fromCharCode(255)));
            if ("pathLenConstraint" in A) A.value.value.push(q1.create(q1.Class.UNIVERSAL, q1.Type.INTEGER, !1, q1.integerToDer(A.pathLenConstraint).getBytes()))
        } else if (A.name === "extKeyUsage") {
            A.value = q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, []);
            var O = A.value.value;
            for (var $ in A) {
                if (A[$] !== !0) continue;
                if ($ in SY) O.push(q1.create(q1.Class.UNIVERSAL, q1.Type.OID, !1, q1.oidToDer(SY[$]).getBytes()));
                else if ($.indexOf(".") !== -1) O.push(q1.create(q1.Class.UNIVERSAL, q1.Type.OID, !1, q1.oidToDer($).getBytes()))
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
            var w = String.fromCharCode(Y);
            if (z !== 0) w += String.fromCharCode(z);
            A.value = q1.create(q1.Class.UNIVERSAL, q1.Type.BITSTRING, !1, w)
        } else if (A.name === "subjectAltName" || A.name === "issuerAltName") {
            A.value = q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, []);
            var H;
            for (var j = 0; j < A.altNames.length; ++j) {
                H = A.altNames[j];
                var w = H.value;
                if (H.type === 7 && H.ip) {
                    if (w = lq.util.bytesFromIP(H.ip), w === null) {
                        var K = Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
                        throw K.extension = A, K
                    }
                } else if (H.type === 8)
                    if (H.oid) w = q1.oidToDer(q1.oidToDer(H.oid));
                    else w = q1.oidToDer(w);
                A.value.value.push(q1.create(q1.Class.CONTEXT_SPECIFIC, H.type, !1, w))
            }
        } else if (A.name === "nsComment" && q.cert) {
            if (!/^[\x00-\x7F]*$/.test(A.comment) || A.comment.length < 1 || A.comment.length > 128) throw Error('Invalid "nsComment" content.');
            A.value = q1.create(q1.Class.UNIVERSAL, q1.Type.IA5STRING, !1, A.comment)
        } else if (A.name === "subjectKeyIdentifier" && q.cert) {
            var J = q.cert.generateSubjectKeyIdentifier();
            A.subjectKeyIdentifier = J.toHex(), A.value = q1.create(q1.Class.UNIVERSAL, q1.Type.OCTETSTRING, !1, J.getBytes())
        } else if (A.name === "authorityKeyIdentifier" && q.cert) {
            A.value = q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, []);
            var O = A.value.value;
            if (A.keyIdentifier) {
                var M = A.keyIdentifier === !0 ? q.cert.generateSubjectKeyIdentifier().getBytes() : A.keyIdentifier;
                O.push(q1.create(q1.Class.CONTEXT_SPECIFIC, 0, !1, M))
            }
            if (A.authorityCertIssuer) {
                var D = [q1.create(q1.Class.CONTEXT_SPECIFIC, 4, !0, [WM6(A.authorityCertIssuer === !0 ? q.cert.issuer : A.authorityCertIssuer)])];
                O.push(q1.create(q1.Class.CONTEXT_SPECIFIC, 1, !0, D))
            }
            if (A.serialNumber) {
                var X = lq.util.hexToBytes(A.serialNumber === !0 ? q.cert.serialNumber : A.serialNumber);
                O.push(q1.create(q1.Class.CONTEXT_SPECIFIC, 2, !1, X))
            }
        } else if (A.name === "cRLDistributionPoints") {
            A.value = q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, []);
            var O = A.value.value,
                P = q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, []),
                W = q1.create(q1.Class.CONTEXT_SPECIFIC, 0, !0, []),
                H;
            for (var j = 0; j < A.altNames.length; ++j) {
                H = A.altNames[j];
                var w = H.value;
                if (H.type === 7 && H.ip) {
                    if (w = lq.util.bytesFromIP(H.ip), w === null) {
                        var K = Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
                        throw K.extension = A, K
                    }
                } else if (H.type === 8)
                    if (H.oid) w = q1.oidToDer(q1.oidToDer(H.oid));
                    else w = q1.oidToDer(w);
                W.value.push(q1.create(q1.Class.CONTEXT_SPECIFIC, H.type, !1, w))
            }
            P.value.push(q1.create(q1.Class.CONTEXT_SPECIFIC, 0, !0, [W])), O.push(P)
        }
        if (typeof A.value > "u") {
            var K = Error("Extension value not specified.");
            throw K.extension = A, K
        }
        return A
    }

    function xY8(A, q) {
        switch (A) {
            case SY["RSASSA-PSS"]:
                var K = [];
                if (q.hash.algorithmOid !== void 0) K.push(q1.create(q1.Class.CONTEXT_SPECIFIC, 0, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.OID, !1, q1.oidToDer(q.hash.algorithmOid).getBytes()), q1.create(q1.Class.UNIVERSAL, q1.Type.NULL, !1, "")])]));
                if (q.mgf.algorithmOid !== void 0) K.push(q1.create(q1.Class.CONTEXT_SPECIFIC, 1, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.OID, !1, q1.oidToDer(q.mgf.algorithmOid).getBytes()), q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.OID, !1, q1.oidToDer(q.mgf.hash.algorithmOid).getBytes()), q1.create(q1.Class.UNIVERSAL, q1.Type.NULL, !1, "")])])]));
                if (q.saltLength !== void 0) K.push(q1.create(q1.Class.CONTEXT_SPECIFIC, 2, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.INTEGER, !1, q1.integerToDer(q.saltLength).getBytes())]));
                return q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, K);
            default:
                return q1.create(q1.Class.UNIVERSAL, q1.Type.NULL, !1, "")
        }
    }

    function RW3(A) {
        var q = q1.create(q1.Class.CONTEXT_SPECIFIC, 0, !0, []);
        if (A.attributes.length === 0) return q;
        var K = A.attributes;
        for (var Y = 0; Y < K.length; ++Y) {
            var z = K[Y],
                _ = z.value,
                w = q1.Type.UTF8;
            if ("valueTagClass" in z) w = z.valueTagClass;
            if (w === q1.Type.UTF8) _ = lq.util.encodeUtf8(_);
            var O = !1;
            if ("valueConstructed" in z) O = z.valueConstructed;
            var $ = q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.OID, !1, q1.oidToDer(z.type).getBytes()), q1.create(q1.Class.UNIVERSAL, q1.Type.SET, !0, [q1.create(q1.Class.UNIVERSAL, w, O, _)])]);
            q.value.push($)
        }
        return q
    }
    var hW3 = new Date("1950-01-01T00:00:00Z"),
        SW3 = new Date("2050-01-01T00:00:00Z");

    function _j7(A) {
        if (A >= hW3 && A < SW3) return q1.create(q1.Class.UNIVERSAL, q1.Type.UTCTIME, !1, q1.dateToUtcTime(A));
        else return q1.create(q1.Class.UNIVERSAL, q1.Type.GENERALIZEDTIME, !1, q1.dateToGeneralizedTime(A))
    }
    T7.getTBSCertificate = function(A) {
        var q = _j7(A.validity.notBefore),
            K = _j7(A.validity.notAfter),
            Y = q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, [q1.create(q1.Class.CONTEXT_SPECIFIC, 0, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.INTEGER, !1, q1.integerToDer(A.version).getBytes())]), q1.create(q1.Class.UNIVERSAL, q1.Type.INTEGER, !1, lq.util.hexToBytes(A.serialNumber)), q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.OID, !1, q1.oidToDer(A.siginfo.algorithmOid).getBytes()), xY8(A.siginfo.algorithmOid, A.siginfo.parameters)]), WM6(A.issuer), q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, [q, K]), WM6(A.subject), T7.publicKeyToAsn1(A.publicKey)]);
        if (A.issuer.uniqueId) Y.value.push(q1.create(q1.Class.CONTEXT_SPECIFIC, 1, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.BITSTRING, !1, String.fromCharCode(0) + A.issuer.uniqueId)]));
        if (A.subject.uniqueId) Y.value.push(q1.create(q1.Class.CONTEXT_SPECIFIC, 2, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.BITSTRING, !1, String.fromCharCode(0) + A.subject.uniqueId)]));
        if (A.extensions.length > 0) Y.value.push(T7.certificateExtensionsToAsn1(A.extensions));
        return Y
    };
    T7.getCertificationRequestInfo = function(A) {
        var q = q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.INTEGER, !1, q1.integerToDer(A.version).getBytes()), WM6(A.subject), T7.publicKeyToAsn1(A.publicKey), RW3(A)]);
        return q
    };
    T7.distinguishedNameToAsn1 = function(A) {
        return WM6(A)
    };
    T7.certificateToAsn1 = function(A) {
        var q = A.tbsCertificate || T7.getTBSCertificate(A);
        return q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, [q, q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.OID, !1, q1.oidToDer(A.signatureOid).getBytes()), xY8(A.signatureOid, A.signatureParameters)]), q1.create(q1.Class.UNIVERSAL, q1.Type.BITSTRING, !1, String.fromCharCode(0) + A.signature)])
    };
    T7.certificateExtensionsToAsn1 = function(A) {
        var q = q1.create(q1.Class.CONTEXT_SPECIFIC, 3, !0, []),
            K = q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, []);
        q.value.push(K);
        for (var Y = 0; Y < A.length; ++Y) K.value.push(T7.certificateExtensionToAsn1(A[Y]));
        return q
    };
    T7.certificateExtensionToAsn1 = function(A) {
        var q = q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, []);
        if (q.value.push(q1.create(q1.Class.UNIVERSAL, q1.Type.OID, !1, q1.oidToDer(A.id).getBytes())), A.critical) q.value.push(q1.create(q1.Class.UNIVERSAL, q1.Type.BOOLEAN, !1, String.fromCharCode(255)));
        var K = A.value;
        if (typeof A.value !== "string") K = q1.toDer(K).getBytes();
        return q.value.push(q1.create(q1.Class.UNIVERSAL, q1.Type.OCTETSTRING, !1, K)), q
    };
    T7.certificationRequestToAsn1 = function(A) {
        var q = A.certificationRequestInfo || T7.getCertificationRequestInfo(A);
        return q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, [q, q1.create(q1.Class.UNIVERSAL, q1.Type.SEQUENCE, !0, [q1.create(q1.Class.UNIVERSAL, q1.Type.OID, !1, q1.oidToDer(A.signatureOid).getBytes()), xY8(A.signatureOid, A.signatureParameters)]), q1.create(q1.Class.UNIVERSAL, q1.Type.BITSTRING, !1, String.fromCharCode(0) + A.signature)])
    };
    T7.createCaStore = function(A) {
        var q = {
            certs: {}
        };
        q.getIssuer = function(w) {
            var O = K(w.issuer);
            return O
        }, q.addCertificate = function(w) {
            if (typeof w === "string") w = lq.pki.certificateFromPem(w);
            if (Y(w.subject), !q.hasCertificate(w))
                if (w.subject.hash in q.certs) {
                    var O = q.certs[w.subject.hash];
                    if (!lq.util.isArray(O)) O = [O];
                    O.push(w), q.certs[w.subject.hash] = O
                } else q.certs[w.subject.hash] = w
        }, q.hasCertificate = function(w) {
            if (typeof w === "string") w = lq.pki.certificateFromPem(w);
            var O = K(w.subject);
            if (!O) return !1;
            if (!lq.util.isArray(O)) O = [O];
            var $ = q1.toDer(T7.certificateToAsn1(w)).getBytes();
            for (var H = 0; H < O.length; ++H) {
                var j = q1.toDer(T7.certificateToAsn1(O[H])).getBytes();
                if ($ === j) return !0
            }
            return !1
        }, q.listAllCertificates = function() {
            var w = [];
            for (var O in q.certs)
                if (q.certs.hasOwnProperty(O)) {
                    var $ = q.certs[O];
                    if (!lq.util.isArray($)) w.push($);
                    else
                        for (var H = 0; H < $.length; ++H) w.push($[H])
                } return w
        }, q.removeCertificate = function(w) {
            var O;
            if (typeof w === "string") w = lq.pki.certificateFromPem(w);
            if (Y(w.subject), !q.hasCertificate(w)) return null;
            var $ = K(w.subject);
            if (!lq.util.isArray($)) return O = q.certs[w.subject.hash], delete q.certs[w.subject.hash], O;
            var H = q1.toDer(T7.certificateToAsn1(w)).getBytes();
            for (var j = 0; j < $.length; ++j) {
                var J = q1.toDer(T7.certificateToAsn1($[j])).getBytes();
                if (H === J) O = $[j], $.splice(j, 1)
            }
            if ($.length === 0) delete q.certs[w.subject.hash];
            return O
        };

        function K(w) {
            return Y(w), q.certs[w.hash] || null
        }

        function Y(w) {
            if (!w.hash) {
                var O = lq.md.sha1.create();
                w.attributes = T7.RDNAttributesAsArray(WM6(w), O), w.hash = O.digest().toHex()
            }
        }
        if (A)
            for (var z = 0; z < A.length; ++z) {
                var _ = A[z];
                q.addCertificate(_)
            }
        return q
    };
    T7.certificateError = {
        bad_certificate: "forge.pki.BadCertificate",
        unsupported_certificate: "forge.pki.UnsupportedCertificate",
        certificate_revoked: "forge.pki.CertificateRevoked",
        certificate_expired: "forge.pki.CertificateExpired",
        certificate_unknown: "forge.pki.CertificateUnknown",
        unknown_ca: "forge.pki.UnknownCertificateAuthority"
    };
    T7.verifyCertificateChain = function(A, q, K) {
        if (typeof K === "function") K = {
            verify: K
        };
        K = K || {}, q = q.slice(0);
        var Y = q.slice(0),
            z = K.validityCheckDate;
        if (typeof z > "u") z = new Date;
        var _ = !0,
            w = null,
            O = 0;
        do {
            var $ = q.shift(),
                H = null,
                j = !1;
            if (z) {
                if (z < $.validity.notBefore || z > $.validity.notAfter) w = {
                    message: "Certificate is not valid yet or has expired.",
                    error: T7.certificateError.certificate_expired,
                    notBefore: $.validity.notBefore,
                    notAfter: $.validity.notAfter,
                    now: z
                }
            }
            if (w === null) {
                if (H = q[0] || A.getIssuer($), H === null) {
                    if ($.isIssuer($)) j = !0, H = $
                }
                if (H) {
                    var J = H;
                    if (!lq.util.isArray(J)) J = [J];
                    var M = !1;
                    while (!M && J.length > 0) {
                        H = J.shift();
                        try {
                            M = H.verify($)
                        } catch (N) {}
                    }
                    if (!M) w = {
                        message: "Certificate signature is invalid.",
                        error: T7.certificateError.bad_certificate
                    }
                }
                if (w === null && (!H || j) && !A.hasCertificate($)) w = {
                    message: "Certificate is not trusted.",
                    error: T7.certificateError.unknown_ca
                }
            }
            if (w === null && H && !$.isIssuer(H)) w = {
                message: "Certificate issuer is invalid.",
                error: T7.certificateError.bad_certificate
            };
            if (w === null) {
                var D = {
                    keyUsage: !0,
                    basicConstraints: !0
                };
                for (var X = 0; w === null && X < $.extensions.length; ++X) {
                    var P = $.extensions[X];
                    if (P.critical && !(P.name in D)) w = {
                        message: "Certificate has an unsupported critical extension.",
                        error: T7.certificateError.unsupported_certificate
                    }
                }
            }
            if (w === null && (!_ || q.length === 0 && (!H || j))) {
                var W = $.getExtension("basicConstraints"),
                    Z = $.getExtension("keyUsage");
                if (Z !== null) {
                    if (!Z.keyCertSign || W === null) w = {
                        message: "Certificate keyUsage or basicConstraints conflict or indicate that the certificate is not a CA. If the certificate is the only one in the chain or isn't the first then the certificate must be a valid CA.",
                        error: T7.certificateError.bad_certificate
                    }
                }
                if (w === null && W !== null && !W.cA) w = {
                    message: "Certificate basicConstraints indicates the certificate is not a CA.",
                    error: T7.certificateError.bad_certificate
                };
                if (w === null && Z !== null && "pathLenConstraint" in W) {
                    var G = O - 1;
                    if (G > W.pathLenConstraint) w = {
                        message: "Certificate basicConstraints pathLenConstraint violated.",
                        error: T7.certificateError.bad_certificate
                    }
                }
            }
            var f = w === null ? !0 : w.error,
                v = K.verify ? K.verify(f, O, Y) : f;
            if (v === !0) w = null;
            else {
                if (f === !0) w = {
                    message: "The application rejected the certificate.",
                    error: T7.certificateError.bad_certificate
                };
                if (v || v === 0) {
                    if (typeof v === "object" && !lq.util.isArray(v)) {
                        if (v.message) w.message = v.message;
                        if (v.error) w.error = v.error
                    } else if (typeof v === "string") w.error = v
                }
                throw w
            }
            _ = !1, ++O
        } while (q.length > 0);
        return !0
    }
})
// @from(Ln 119799, Col 4)
mY8 = x((gv_, Jj7) => {
    var Lw = h3();
    GC();
    HM6();
    qa();
    IY8();
    CY8();
    HL();
    FI6();
    DM6();
    tY();
    BY1();
    var {
        asn1: S1,
        pki: T9
    } = Lw, QI6 = Jj7.exports = Lw.pkcs12 = Lw.pkcs12 || {}, jj7 = {
        name: "ContentInfo",
        tagClass: S1.Class.UNIVERSAL,
        type: S1.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "ContentInfo.contentType",
            tagClass: S1.Class.UNIVERSAL,
            type: S1.Type.OID,
            constructed: !1,
            capture: "contentType"
        }, {
            name: "ContentInfo.content",
            tagClass: S1.Class.CONTEXT_SPECIFIC,
            constructed: !0,
            captureAsn1: "content"
        }]
    }, CW3 = {
        name: "PFX",
        tagClass: S1.Class.UNIVERSAL,
        type: S1.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "PFX.version",
            tagClass: S1.Class.UNIVERSAL,
            type: S1.Type.INTEGER,
            constructed: !1,
            capture: "version"
        }, jj7, {
            name: "PFX.macData",
            tagClass: S1.Class.UNIVERSAL,
            type: S1.Type.SEQUENCE,
            constructed: !0,
            optional: !0,
            captureAsn1: "mac",
            value: [{
                name: "PFX.macData.mac",
                tagClass: S1.Class.UNIVERSAL,
                type: S1.Type.SEQUENCE,
                constructed: !0,
                value: [{
                    name: "PFX.macData.mac.digestAlgorithm",
                    tagClass: S1.Class.UNIVERSAL,
                    type: S1.Type.SEQUENCE,
                    constructed: !0,
                    value: [{
                        name: "PFX.macData.mac.digestAlgorithm.algorithm",
                        tagClass: S1.Class.UNIVERSAL,
                        type: S1.Type.OID,
                        constructed: !1,
                        capture: "macAlgorithm"
                    }, {
                        name: "PFX.macData.mac.digestAlgorithm.parameters",
                        tagClass: S1.Class.UNIVERSAL,
                        captureAsn1: "macAlgorithmParameters"
                    }]
                }, {
                    name: "PFX.macData.mac.digest",
                    tagClass: S1.Class.UNIVERSAL,
                    type: S1.Type.OCTETSTRING,
                    constructed: !1,
                    capture: "macDigest"
                }]
            }, {
                name: "PFX.macData.macSalt",
                tagClass: S1.Class.UNIVERSAL,
                type: S1.Type.OCTETSTRING,
                constructed: !1,
                capture: "macSalt"
            }, {
                name: "PFX.macData.iterations",
                tagClass: S1.Class.UNIVERSAL,
                type: S1.Type.INTEGER,
                constructed: !1,
                optional: !0,
                capture: "macIterations"
            }]
        }]
    }, IW3 = {
        name: "SafeBag",
        tagClass: S1.Class.UNIVERSAL,
        type: S1.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "SafeBag.bagId",
            tagClass: S1.Class.UNIVERSAL,
            type: S1.Type.OID,
            constructed: !1,
            capture: "bagId"
        }, {
            name: "SafeBag.bagValue",
            tagClass: S1.Class.CONTEXT_SPECIFIC,
            constructed: !0,
            captureAsn1: "bagValue"
        }, {
            name: "SafeBag.bagAttributes",
            tagClass: S1.Class.UNIVERSAL,
            type: S1.Type.SET,
            constructed: !0,
            optional: !0,
            capture: "bagAttributes"
        }]
    }, bW3 = {
        name: "Attribute",
        tagClass: S1.Class.UNIVERSAL,
        type: S1.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "Attribute.attrId",
            tagClass: S1.Class.UNIVERSAL,
            type: S1.Type.OID,
            constructed: !1,
            capture: "oid"
        }, {
            name: "Attribute.attrValues",
            tagClass: S1.Class.UNIVERSAL,
            type: S1.Type.SET,
            constructed: !0,
            capture: "values"
        }]
    }, xW3 = {
        name: "CertBag",
        tagClass: S1.Class.UNIVERSAL,
        type: S1.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "CertBag.certId",
            tagClass: S1.Class.UNIVERSAL,
            type: S1.Type.OID,
            constructed: !1,
            capture: "certId"
        }, {
            name: "CertBag.certValue",
            tagClass: S1.Class.CONTEXT_SPECIFIC,
            constructed: !0,
            value: [{
                name: "CertBag.certValue[0]",
                tagClass: S1.Class.UNIVERSAL,
                type: S1.Class.OCTETSTRING,
                constructed: !1,
                capture: "cert"
            }]
        }]
    };

    function pI6(A, q, K, Y) {
        var z = [];
        for (var _ = 0; _ < A.length; _++)
            for (var w = 0; w < A[_].safeBags.length; w++) {
                var O = A[_].safeBags[w];
                if (Y !== void 0 && O.type !== Y) continue;
                if (q === null) {
                    z.push(O);
                    continue
                }
                if (O.attributes[q] !== void 0 && O.attributes[q].indexOf(K) >= 0) z.push(O)
            }
        return z
    }
    QI6.pkcs12FromAsn1 = function(A, q, K) {
        if (typeof q === "string") K = q, q = !0;
        else if (q === void 0) q = !0;
        var Y = {},
            z = [];
        if (!S1.validate(A, CW3, Y, z)) {
            var _ = Error("Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.");
            throw _.errors = _, _
        }
        var w = {
            version: Y.version.charCodeAt(0),
            safeContents: [],
            getBags: function(W) {
                var Z = {},
                    G;
                if ("localKeyId" in W) G = W.localKeyId;
                else if ("localKeyIdHex" in W) G = Lw.util.hexToBytes(W.localKeyIdHex);
                if (G === void 0 && !("friendlyName" in W) && "bagType" in W) Z[W.bagType] = pI6(w.safeContents, null, null, W.bagType);
                if (G !== void 0) Z.localKeyId = pI6(w.safeContents, "localKeyId", G, W.bagType);
                if ("friendlyName" in W) Z.friendlyName = pI6(w.safeContents, "friendlyName", W.friendlyName, W.bagType);
                return Z
            },
            getBagsByFriendlyName: function(W, Z) {
                return pI6(w.safeContents, "friendlyName", W, Z)
            },
            getBagsByLocalKeyId: function(W, Z) {
                return pI6(w.safeContents, "localKeyId", W, Z)
            }
        };
        if (Y.version.charCodeAt(0) !== 3) {
            var _ = Error("PKCS#12 PFX of version other than 3 not supported.");
            throw _.version = Y.version.charCodeAt(0), _
        }
        if (S1.derToOid(Y.contentType) !== T9.oids.data) {
            var _ = Error("Only PKCS#12 PFX in password integrity mode supported.");
            throw _.oid = S1.derToOid(Y.contentType), _
        }
        var O = Y.content.value[0];
        if (O.tagClass !== S1.Class.UNIVERSAL || O.type !== S1.Type.OCTETSTRING) throw Error("PKCS#12 authSafe content data is not an OCTET STRING.");
        if (O = uY8(O), Y.mac) {
            var $ = null,
                H = 0,
                j = S1.derToOid(Y.macAlgorithm);
            switch (j) {
                case T9.oids.sha1:
                    $ = Lw.md.sha1.create(), H = 20;
                    break;
                case T9.oids.sha256:
                    $ = Lw.md.sha256.create(), H = 32;
                    break;
                case T9.oids.sha384:
                    $ = Lw.md.sha384.create(), H = 48;
                    break;
                case T9.oids.sha512:
                    $ = Lw.md.sha512.create(), H = 64;
                    break;
                case T9.oids.md5:
                    $ = Lw.md.md5.create(), H = 16;
                    break
            }
            if ($ === null) throw Error("PKCS#12 uses unsupported MAC algorithm: " + j);
            var J = new Lw.util.ByteBuffer(Y.macSalt),
                M = "macIterations" in Y ? parseInt(Lw.util.bytesToHex(Y.macIterations), 16) : 1,
                D = QI6.generateKey(K, J, 3, M, H, $),
                X = Lw.hmac.create();
            X.start($, D), X.update(O.value);
            var P = X.getMac();
            if (P.getBytes() !== Y.macDigest) throw Error("PKCS#12 MAC could not be verified. Invalid password?")
        }
        return uW3(w, O.value, q, K), w
    };

    function uY8(A) {
        if (A.composed || A.constructed) {
            var q = Lw.util.createBuffer();
            for (var K = 0; K < A.value.length; ++K) q.putBytes(A.value[K].value);
            A.composed = A.constructed = !1, A.value = q.getBytes()
        }
        return A
    }

    function uW3(A, q, K, Y) {
        if (q = S1.fromDer(q, K), q.tagClass !== S1.Class.UNIVERSAL || q.type !== S1.Type.SEQUENCE || q.constructed !== !0) throw Error("PKCS#12 AuthenticatedSafe expected to be a SEQUENCE OF ContentInfo");
        for (var z = 0; z < q.value.length; z++) {
            var _ = q.value[z],
                w = {},
                O = [];
            if (!S1.validate(_, jj7, w, O)) {
                var $ = Error("Cannot read ContentInfo.");
                throw $.errors = O, $
            }
            var H = {
                    encrypted: !1
                },
                j = null,
                J = w.content.value[0];
            switch (S1.derToOid(w.contentType)) {
                case T9.oids.data:
                    if (J.tagClass !== S1.Class.UNIVERSAL || J.type !== S1.Type.OCTETSTRING) throw Error("PKCS#12 SafeContents Data is not an OCTET STRING.");
                    j = uY8(J).value;
                    break;
                case T9.oids.encryptedData:
                    j = mW3(J, Y), H.encrypted = !0;
                    break;
                default:
                    var $ = Error("Unsupported PKCS#12 contentType.");
                    throw $.contentType = S1.derToOid(w.contentType), $
            }
            H.safeBags = BW3(j, K, Y), A.safeContents.push(H)
        }
    }

    function mW3(A, q) {
        var K = {},
            Y = [];
        if (!S1.validate(A, Lw.pkcs7.asn1.encryptedDataValidator, K, Y)) {
            var z = Error("Cannot read EncryptedContentInfo.");
            throw z.errors = Y, z
        }
        var _ = S1.derToOid(K.contentType);
        if (_ !== T9.oids.data) {
            var z = Error("PKCS#12 EncryptedContentInfo ContentType is not Data.");
            throw z.oid = _, z
        }
        _ = S1.derToOid(K.encAlgorithm);
        var w = T9.pbe.getCipher(_, K.encParameter, q),
            O = uY8(K.encryptedContentAsn1),
            $ = Lw.util.createBuffer(O.value);
        if (w.update($), !w.finish()) throw Error("Failed to decrypt PKCS#12 SafeContents.");
        return w.output.getBytes()
    }

    function BW3(A, q, K) {
        if (!q && A.length === 0) return [];
        if (A = S1.fromDer(A, q), A.tagClass !== S1.Class.UNIVERSAL || A.type !== S1.Type.SEQUENCE || A.constructed !== !0) throw Error("PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag.");
        var Y = [];
        for (var z = 0; z < A.value.length; z++) {
            var _ = A.value[z],
                w = {},
                O = [];
            if (!S1.validate(_, IW3, w, O)) {
                var $ = Error("Cannot read SafeBag.");
                throw $.errors = O, $
            }
            var H = {
                type: S1.derToOid(w.bagId),
                attributes: gW3(w.bagAttributes)
            };
            Y.push(H);
            var j, J, M = w.bagValue.value[0];
            switch (H.type) {
                case T9.oids.pkcs8ShroudedKeyBag:
                    if (M = T9.decryptPrivateKeyInfo(M, K), M === null) throw Error("Unable to decrypt PKCS#8 ShroudedKeyBag, wrong password?");
                case T9.oids.keyBag:
                    try {
                        H.key = T9.privateKeyFromAsn1(M)
                    } catch (X) {
                        H.key = null, H.asn1 = M
                    }
                    continue;
                case T9.oids.certBag:
                    j = xW3, J = function() {
                        if (S1.derToOid(w.certId) !== T9.oids.x509Certificate) {
                            var X = Error("Unsupported certificate type, only X.509 supported.");
                            throw X.oid = S1.derToOid(w.certId), X
                        }
                        var P = S1.fromDer(w.cert, q);
                        try {
                            H.cert = T9.certificateFromAsn1(P, !0)
                        } catch (W) {
                            H.cert = null, H.asn1 = P
                        }
                    };
                    break;
                default:
                    var $ = Error("Unsupported PKCS#12 SafeBag type.");
                    throw $.oid = H.type, $
            }
            if (j !== void 0 && !S1.validate(M, j, w, O)) {
                var $ = Error("Cannot read PKCS#12 " + j.name);
                throw $.errors = O, $
            }
            J()
        }
        return Y
    }

    function gW3(A) {
        var q = {};
        if (A !== void 0)
            for (var K = 0; K < A.length; ++K) {
                var Y = {},
                    z = [];
                if (!S1.validate(A[K], bW3, Y, z)) {
                    var _ = Error("Cannot read PKCS#12 BagAttribute.");
                    throw _.errors = z, _
                }
                var w = S1.derToOid(Y.oid);
                if (T9.oids[w] === void 0) continue;
                q[T9.oids[w]] = [];
                for (var O = 0; O < Y.values.length; ++O) q[T9.oids[w]].push(Y.values[O].value)
            }
        return q
    }
    QI6.toPkcs12Asn1 = function(A, q, K, Y) {
        if (Y = Y || {}, Y.saltSize = Y.saltSize || 8, Y.count = Y.count || 2048, Y.algorithm = Y.algorithm || Y.encAlgorithm || "aes128", !("useMac" in Y)) Y.useMac = !0;
        if (!("localKeyId" in Y)) Y.localKeyId = null;
        if (!("generateLocalKeyId" in Y)) Y.generateLocalKeyId = !0;
        var z = Y.localKeyId,
            _;
        if (z !== null) z = Lw.util.hexToBytes(z);
        else if (Y.generateLocalKeyId)
            if (q) {
                var w = Lw.util.isArray(q) ? q[0] : q;
                if (typeof w === "string") w = T9.certificateFromPem(w);
                var O = Lw.md.sha1.create();
                O.update(S1.toDer(T9.certificateToAsn1(w)).getBytes()), z = O.digest().getBytes()
            } else z = Lw.random.getBytes(20);
        var $ = [];
        if (z !== null) $.push(S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.OID, !1, S1.oidToDer(T9.oids.localKeyId).getBytes()), S1.create(S1.Class.UNIVERSAL, S1.Type.SET, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.OCTETSTRING, !1, z)])]));
        if ("friendlyName" in Y) $.push(S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.OID, !1, S1.oidToDer(T9.oids.friendlyName).getBytes()), S1.create(S1.Class.UNIVERSAL, S1.Type.SET, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.BMPSTRING, !1, Y.friendlyName)])]));
        if ($.length > 0) _ = S1.create(S1.Class.UNIVERSAL, S1.Type.SET, !0, $);
        var H = [],
            j = [];
        if (q !== null)
            if (Lw.util.isArray(q)) j = q;
            else j = [q];
        var J = [];
        for (var M = 0; M < j.length; ++M) {
            if (q = j[M], typeof q === "string") q = T9.certificateFromPem(q);
            var D = M === 0 ? _ : void 0,
                X = T9.certificateToAsn1(q),
                P = S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.OID, !1, S1.oidToDer(T9.oids.certBag).getBytes()), S1.create(S1.Class.CONTEXT_SPECIFIC, 0, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.OID, !1, S1.oidToDer(T9.oids.x509Certificate).getBytes()), S1.create(S1.Class.CONTEXT_SPECIFIC, 0, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.OCTETSTRING, !1, S1.toDer(X).getBytes())])])]), D]);
            J.push(P)
        }
        if (J.length > 0) {
            var W = S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, J),
                Z = S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.OID, !1, S1.oidToDer(T9.oids.data).getBytes()), S1.create(S1.Class.CONTEXT_SPECIFIC, 0, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.OCTETSTRING, !1, S1.toDer(W).getBytes())])]);
            H.push(Z)
        }
        var G = null;
        if (A !== null) {
            var f = T9.wrapRsaPrivateKey(T9.privateKeyToAsn1(A));
            if (K === null) G = S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.OID, !1, S1.oidToDer(T9.oids.keyBag).getBytes()), S1.create(S1.Class.CONTEXT_SPECIFIC, 0, !0, [f]), _]);
            else G = S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.OID, !1, S1.oidToDer(T9.oids.pkcs8ShroudedKeyBag).getBytes()), S1.create(S1.Class.CONTEXT_SPECIFIC, 0, !0, [T9.encryptPrivateKeyInfo(f, K, Y)]), _]);
            var v = S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, [G]),
                N = S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.OID, !1, S1.oidToDer(T9.oids.data).getBytes()), S1.create(S1.Class.CONTEXT_SPECIFIC, 0, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.OCTETSTRING, !1, S1.toDer(v).getBytes())])]);
            H.push(N)
        }
        var V = S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, H),
            L;
        if (Y.useMac) {
            var O = Lw.md.sha1.create(),
                h = new Lw.util.ByteBuffer(Lw.random.getBytes(Y.saltSize)),
                R = Y.count,
                A = QI6.generateKey(K, h, 3, R, 20),
                u = Lw.hmac.create();
            u.start(O, A), u.update(S1.toDer(V).getBytes());
            var I = u.getMac();
            L = S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.OID, !1, S1.oidToDer(T9.oids.sha1).getBytes()), S1.create(S1.Class.UNIVERSAL, S1.Type.NULL, !1, "")]), S1.create(S1.Class.UNIVERSAL, S1.Type.OCTETSTRING, !1, I.getBytes())]), S1.create(S1.Class.UNIVERSAL, S1.Type.OCTETSTRING, !1, h.getBytes()), S1.create(S1.Class.UNIVERSAL, S1.Type.INTEGER, !1, S1.integerToDer(R).getBytes())])
        }
        return S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.INTEGER, !1, S1.integerToDer(3).getBytes()), S1.create(S1.Class.UNIVERSAL, S1.Type.SEQUENCE, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.OID, !1, S1.oidToDer(T9.oids.data).getBytes()), S1.create(S1.Class.CONTEXT_SPECIFIC, 0, !0, [S1.create(S1.Class.UNIVERSAL, S1.Type.OCTETSTRING, !1, S1.toDer(V).getBytes())])]), L])
    };
    QI6.generateKey = Lw.pbe.generatePkcs12Key
})
// @from(Ln 120238, Col 4)
gY8 = x((Fv_, Mj7) => {
    var _a = h3();
    GC();
    qa();
    CY8();
    $q6();
    LY1();
    mY8();
    xY1();
    FI6();
    tY();
    BY1();
    var BY8 = _a.asn1,
        ZM6 = Mj7.exports = _a.pki = _a.pki || {};
    ZM6.pemToDer = function(A) {
        var q = _a.pem.decode(A)[0];
        if (q.procType && q.procType.type === "ENCRYPTED") throw Error("Could not convert PEM to DER; PEM is encrypted.");
        return _a.util.createBuffer(q.body)
    };
    ZM6.privateKeyFromPem = function(A) {
        var q = _a.pem.decode(A)[0];
        if (q.type !== "PRIVATE KEY" && q.type !== "RSA PRIVATE KEY") {
            var K = Error('Could not convert private key from PEM; PEM header type is not "PRIVATE KEY" or "RSA PRIVATE KEY".');
            throw K.headerType = q.type, K
        }
        if (q.procType && q.procType.type === "ENCRYPTED") throw Error("Could not convert private key from PEM; PEM is encrypted.");
        var Y = BY8.fromDer(q.body);
        return ZM6.privateKeyFromAsn1(Y)
    };
    ZM6.privateKeyToPem = function(A, q) {
        var K = {
            type: "RSA PRIVATE KEY",
            body: BY8.toDer(ZM6.privateKeyToAsn1(A)).getBytes()
        };
        return _a.pem.encode(K, {
            maxline: q
        })
    };
    ZM6.privateKeyInfoToPem = function(A, q) {
        var K = {
            type: "PRIVATE KEY",
            body: BY8.toDer(A).getBytes()
        };
        return _a.pem.encode(K, {
            maxline: q
        })
    }
})