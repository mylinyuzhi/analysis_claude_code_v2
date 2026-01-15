
// @from(Ln 376271, Col 4)
GF1 = U((UXY, qa2) => {
  var K4 = H8();
  xt();
  Nx();
  yfA();
  Sf();
  Ha2();
  yt();
  J3A();
  AF1();
  bfA();
  _7();
  var pA = K4.asn1,
    gB = qa2.exports = K4.pki = K4.pki || {},
    D7 = gB.oids,
    JD = {};
  JD.CN = D7.commonName;
  JD.commonName = "CN";
  JD.C = D7.countryName;
  JD.countryName = "C";
  JD.L = D7.localityName;
  JD.localityName = "L";
  JD.ST = D7.stateOrProvinceName;
  JD.stateOrProvinceName = "ST";
  JD.O = D7.organizationName;
  JD.organizationName = "O";
  JD.OU = D7.organizationalUnitName;
  JD.organizationalUnitName = "OU";
  JD.E = D7.emailAddress;
  JD.emailAddress = "E";
  var $a2 = K4.pki.rsa.publicKeyValidator,
    K07 = {
      name: "Certificate",
      tagClass: pA.Class.UNIVERSAL,
      type: pA.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "Certificate.TBSCertificate",
        tagClass: pA.Class.UNIVERSAL,
        type: pA.Type.SEQUENCE,
        constructed: !0,
        captureAsn1: "tbsCertificate",
        value: [{
          name: "Certificate.TBSCertificate.version",
          tagClass: pA.Class.CONTEXT_SPECIFIC,
          type: 0,
          constructed: !0,
          optional: !0,
          value: [{
            name: "Certificate.TBSCertificate.version.integer",
            tagClass: pA.Class.UNIVERSAL,
            type: pA.Type.INTEGER,
            constructed: !1,
            capture: "certVersion"
          }]
        }, {
          name: "Certificate.TBSCertificate.serialNumber",
          tagClass: pA.Class.UNIVERSAL,
          type: pA.Type.INTEGER,
          constructed: !1,
          capture: "certSerialNumber"
        }, {
          name: "Certificate.TBSCertificate.signature",
          tagClass: pA.Class.UNIVERSAL,
          type: pA.Type.SEQUENCE,
          constructed: !0,
          value: [{
            name: "Certificate.TBSCertificate.signature.algorithm",
            tagClass: pA.Class.UNIVERSAL,
            type: pA.Type.OID,
            constructed: !1,
            capture: "certinfoSignatureOid"
          }, {
            name: "Certificate.TBSCertificate.signature.parameters",
            tagClass: pA.Class.UNIVERSAL,
            optional: !0,
            captureAsn1: "certinfoSignatureParams"
          }]
        }, {
          name: "Certificate.TBSCertificate.issuer",
          tagClass: pA.Class.UNIVERSAL,
          type: pA.Type.SEQUENCE,
          constructed: !0,
          captureAsn1: "certIssuer"
        }, {
          name: "Certificate.TBSCertificate.validity",
          tagClass: pA.Class.UNIVERSAL,
          type: pA.Type.SEQUENCE,
          constructed: !0,
          value: [{
            name: "Certificate.TBSCertificate.validity.notBefore (utc)",
            tagClass: pA.Class.UNIVERSAL,
            type: pA.Type.UTCTIME,
            constructed: !1,
            optional: !0,
            capture: "certValidity1UTCTime"
          }, {
            name: "Certificate.TBSCertificate.validity.notBefore (generalized)",
            tagClass: pA.Class.UNIVERSAL,
            type: pA.Type.GENERALIZEDTIME,
            constructed: !1,
            optional: !0,
            capture: "certValidity2GeneralizedTime"
          }, {
            name: "Certificate.TBSCertificate.validity.notAfter (utc)",
            tagClass: pA.Class.UNIVERSAL,
            type: pA.Type.UTCTIME,
            constructed: !1,
            optional: !0,
            capture: "certValidity3UTCTime"
          }, {
            name: "Certificate.TBSCertificate.validity.notAfter (generalized)",
            tagClass: pA.Class.UNIVERSAL,
            type: pA.Type.GENERALIZEDTIME,
            constructed: !1,
            optional: !0,
            capture: "certValidity4GeneralizedTime"
          }]
        }, {
          name: "Certificate.TBSCertificate.subject",
          tagClass: pA.Class.UNIVERSAL,
          type: pA.Type.SEQUENCE,
          constructed: !0,
          captureAsn1: "certSubject"
        }, $a2, {
          name: "Certificate.TBSCertificate.issuerUniqueID",
          tagClass: pA.Class.CONTEXT_SPECIFIC,
          type: 1,
          constructed: !0,
          optional: !0,
          value: [{
            name: "Certificate.TBSCertificate.issuerUniqueID.id",
            tagClass: pA.Class.UNIVERSAL,
            type: pA.Type.BITSTRING,
            constructed: !1,
            captureBitStringValue: "certIssuerUniqueId"
          }]
        }, {
          name: "Certificate.TBSCertificate.subjectUniqueID",
          tagClass: pA.Class.CONTEXT_SPECIFIC,
          type: 2,
          constructed: !0,
          optional: !0,
          value: [{
            name: "Certificate.TBSCertificate.subjectUniqueID.id",
            tagClass: pA.Class.UNIVERSAL,
            type: pA.Type.BITSTRING,
            constructed: !1,
            captureBitStringValue: "certSubjectUniqueId"
          }]
        }, {
          name: "Certificate.TBSCertificate.extensions",
          tagClass: pA.Class.CONTEXT_SPECIFIC,
          type: 3,
          constructed: !0,
          captureAsn1: "certExtensions",
          optional: !0
        }]
      }, {
        name: "Certificate.signatureAlgorithm",
        tagClass: pA.Class.UNIVERSAL,
        type: pA.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "Certificate.signatureAlgorithm.algorithm",
          tagClass: pA.Class.UNIVERSAL,
          type: pA.Type.OID,
          constructed: !1,
          capture: "certSignatureOid"
        }, {
          name: "Certificate.TBSCertificate.signature.parameters",
          tagClass: pA.Class.UNIVERSAL,
          optional: !0,
          captureAsn1: "certSignatureParams"
        }]
      }, {
        name: "Certificate.signatureValue",
        tagClass: pA.Class.UNIVERSAL,
        type: pA.Type.BITSTRING,
        constructed: !1,
        captureBitStringValue: "certSignature"
      }]
    },
    V07 = {
      name: "rsapss",
      tagClass: pA.Class.UNIVERSAL,
      type: pA.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "rsapss.hashAlgorithm",
        tagClass: pA.Class.CONTEXT_SPECIFIC,
        type: 0,
        constructed: !0,
        value: [{
          name: "rsapss.hashAlgorithm.AlgorithmIdentifier",
          tagClass: pA.Class.UNIVERSAL,
          type: pA.Class.SEQUENCE,
          constructed: !0,
          optional: !0,
          value: [{
            name: "rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm",
            tagClass: pA.Class.UNIVERSAL,
            type: pA.Type.OID,
            constructed: !1,
            capture: "hashOid"
          }]
        }]
      }, {
        name: "rsapss.maskGenAlgorithm",
        tagClass: pA.Class.CONTEXT_SPECIFIC,
        type: 1,
        constructed: !0,
        value: [{
          name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier",
          tagClass: pA.Class.UNIVERSAL,
          type: pA.Class.SEQUENCE,
          constructed: !0,
          optional: !0,
          value: [{
            name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm",
            tagClass: pA.Class.UNIVERSAL,
            type: pA.Type.OID,
            constructed: !1,
            capture: "maskGenOid"
          }, {
            name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params",
            tagClass: pA.Class.UNIVERSAL,
            type: pA.Type.SEQUENCE,
            constructed: !0,
            value: [{
              name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm",
              tagClass: pA.Class.UNIVERSAL,
              type: pA.Type.OID,
              constructed: !1,
              capture: "maskGenHashOid"
            }]
          }]
        }]
      }, {
        name: "rsapss.saltLength",
        tagClass: pA.Class.CONTEXT_SPECIFIC,
        type: 2,
        optional: !0,
        value: [{
          name: "rsapss.saltLength.saltLength",
          tagClass: pA.Class.UNIVERSAL,
          type: pA.Class.INTEGER,
          constructed: !1,
          capture: "saltLength"
        }]
      }, {
        name: "rsapss.trailerField",
        tagClass: pA.Class.CONTEXT_SPECIFIC,
        type: 3,
        optional: !0,
        value: [{
          name: "rsapss.trailer.trailer",
          tagClass: pA.Class.UNIVERSAL,
          type: pA.Class.INTEGER,
          constructed: !1,
          capture: "trailer"
        }]
      }]
    },
    F07 = {
      name: "CertificationRequestInfo",
      tagClass: pA.Class.UNIVERSAL,
      type: pA.Type.SEQUENCE,
      constructed: !0,
      captureAsn1: "certificationRequestInfo",
      value: [{
        name: "CertificationRequestInfo.integer",
        tagClass: pA.Class.UNIVERSAL,
        type: pA.Type.INTEGER,
        constructed: !1,
        capture: "certificationRequestInfoVersion"
      }, {
        name: "CertificationRequestInfo.subject",
        tagClass: pA.Class.UNIVERSAL,
        type: pA.Type.SEQUENCE,
        constructed: !0,
        captureAsn1: "certificationRequestInfoSubject"
      }, $a2, {
        name: "CertificationRequestInfo.attributes",
        tagClass: pA.Class.CONTEXT_SPECIFIC,
        type: 0,
        constructed: !0,
        optional: !0,
        capture: "certificationRequestInfoAttributes",
        value: [{
          name: "CertificationRequestInfo.attributes",
          tagClass: pA.Class.UNIVERSAL,
          type: pA.Type.SEQUENCE,
          constructed: !0,
          value: [{
            name: "CertificationRequestInfo.attributes.type",
            tagClass: pA.Class.UNIVERSAL,
            type: pA.Type.OID,
            constructed: !1
          }, {
            name: "CertificationRequestInfo.attributes.value",
            tagClass: pA.Class.UNIVERSAL,
            type: pA.Type.SET,
            constructed: !0
          }]
        }]
      }]
    },
    H07 = {
      name: "CertificationRequest",
      tagClass: pA.Class.UNIVERSAL,
      type: pA.Type.SEQUENCE,
      constructed: !0,
      captureAsn1: "csr",
      value: [F07, {
        name: "CertificationRequest.signatureAlgorithm",
        tagClass: pA.Class.UNIVERSAL,
        type: pA.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "CertificationRequest.signatureAlgorithm.algorithm",
          tagClass: pA.Class.UNIVERSAL,
          type: pA.Type.OID,
          constructed: !1,
          capture: "csrSignatureOid"
        }, {
          name: "CertificationRequest.signatureAlgorithm.parameters",
          tagClass: pA.Class.UNIVERSAL,
          optional: !0,
          captureAsn1: "csrSignatureParams"
        }]
      }, {
        name: "CertificationRequest.signature",
        tagClass: pA.Class.UNIVERSAL,
        type: pA.Type.BITSTRING,
        constructed: !1,
        captureBitStringValue: "csrSignature"
      }]
    };
  gB.RDNAttributesAsArray = function (A, Q) {
    var B = [],
      G, Z, Y;
    for (var J = 0; J < A.value.length; ++J) {
      G = A.value[J];
      for (var X = 0; X < G.value.length; ++X) {
        if (Y = {}, Z = G.value[X], Y.type = pA.derToOid(Z.value[0].value), Y.value = Z.value[1].value, Y.valueTagClass = Z.value[1].type, Y.type in D7) {
          if (Y.name = D7[Y.type], Y.name in JD) Y.shortName = JD[Y.name]
        }
        if (Q) Q.update(Y.type), Q.update(Y.value);
        B.push(Y)
      }
    }
    return B
  };
  gB.CRIAttributesAsArray = function (A) {
    var Q = [];
    for (var B = 0; B < A.length; ++B) {
      var G = A[B],
        Z = pA.derToOid(G.value[0].value),
        Y = G.value[1].value;
      for (var J = 0; J < Y.length; ++J) {
        var X = {};
        if (X.type = Z, X.value = Y[J].value, X.valueTagClass = Y[J].type, X.type in D7) {
          if (X.name = D7[X.type], X.name in JD) X.shortName = JD[X.name]
        }
        if (X.type === D7.extensionRequest) {
          X.extensions = [];
          for (var I = 0; I < X.value.length; ++I) X.extensions.push(gB.certificateExtensionFromAsn1(X.value[I]))
        }
        Q.push(X)
      }
    }
    return Q
  };

  function bt(A, Q) {
    if (typeof Q === "string") Q = {
      shortName: Q
    };
    var B = null,
      G;
    for (var Z = 0; B === null && Z < A.attributes.length; ++Z)
      if (G = A.attributes[Z], Q.type && Q.type === G.type) B = G;
      else if (Q.name && Q.name === G.name) B = G;
    else if (Q.shortName && Q.shortName === G.shortName) B = G;
    return B
  }
  var QF1 = function (A, Q, B) {
      var G = {};
      if (A !== D7["RSASSA-PSS"]) return G;
      if (B) G = {
        hash: {
          algorithmOid: D7.sha1
        },
        mgf: {
          algorithmOid: D7.mgf1,
          hash: {
            algorithmOid: D7.sha1
          }
        },
        saltLength: 20
      };
      var Z = {},
        Y = [];
      if (!pA.validate(Q, V07, Z, Y)) {
        var J = Error("Cannot read RSASSA-PSS parameter block.");
        throw J.errors = Y, J
      }
      if (Z.hashOid !== void 0) G.hash = G.hash || {}, G.hash.algorithmOid = pA.derToOid(Z.hashOid);
      if (Z.maskGenOid !== void 0) G.mgf = G.mgf || {}, G.mgf.algorithmOid = pA.derToOid(Z.maskGenOid), G.mgf.hash = G.mgf.hash || {}, G.mgf.hash.algorithmOid = pA.derToOid(Z.maskGenHashOid);
      if (Z.saltLength !== void 0) G.saltLength = Z.saltLength.charCodeAt(0);
      return G
    },
    BF1 = function (A) {
      switch (D7[A.signatureOid]) {
        case "sha1WithRSAEncryption":
        case "sha1WithRSASignature":
          return K4.md.sha1.create();
        case "md5WithRSAEncryption":
          return K4.md.md5.create();
        case "sha256WithRSAEncryption":
          return K4.md.sha256.create();
        case "sha384WithRSAEncryption":
          return K4.md.sha384.create();
        case "sha512WithRSAEncryption":
          return K4.md.sha512.create();
        case "RSASSA-PSS":
          return K4.md.sha256.create();
        default:
          var Q = Error("Could not compute " + A.type + " digest. Unknown signature OID.");
          throw Q.signatureOid = A.signatureOid, Q
      }
    },
    Ca2 = function (A) {
      var Q = A.certificate,
        B;
      switch (Q.signatureOid) {
        case D7.sha1WithRSAEncryption:
        case D7.sha1WithRSASignature:
          break;
        case D7["RSASSA-PSS"]:
          var G, Z;
          if (G = D7[Q.signatureParameters.mgf.hash.algorithmOid], G === void 0 || K4.md[G] === void 0) {
            var Y = Error("Unsupported MGF hash function.");
            throw Y.oid = Q.signatureParameters.mgf.hash.algorithmOid, Y.name = G, Y
          }
          if (Z = D7[Q.signatureParameters.mgf.algorithmOid], Z === void 0 || K4.mgf[Z] === void 0) {
            var Y = Error("Unsupported MGF function.");
            throw Y.oid = Q.signatureParameters.mgf.algorithmOid, Y.name = Z, Y
          }
          if (Z = K4.mgf[Z].create(K4.md[G].create()), G = D7[Q.signatureParameters.hash.algorithmOid], G === void 0 || K4.md[G] === void 0) {
            var Y = Error("Unsupported RSASSA-PSS hash function.");
            throw Y.oid = Q.signatureParameters.hash.algorithmOid, Y.name = G, Y
          }
          B = K4.pss.create(K4.md[G].create(), Z, Q.signatureParameters.saltLength);
          break
      }
      return Q.publicKey.verify(A.md.digest().getBytes(), A.signature, B)
    };
  gB.certificateFromPem = function (A, Q, B) {
    var G = K4.pem.decode(A)[0];
    if (G.type !== "CERTIFICATE" && G.type !== "X509 CERTIFICATE" && G.type !== "TRUSTED CERTIFICATE") {
      var Z = Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
      throw Z.headerType = G.type, Z
    }
    if (G.procType && G.procType.type === "ENCRYPTED") throw Error("Could not convert certificate from PEM; PEM is encrypted.");
    var Y = pA.fromDer(G.body, B);
    return gB.certificateFromAsn1(Y, Q)
  };
  gB.certificateToPem = function (A, Q) {
    var B = {
      type: "CERTIFICATE",
      body: pA.toDer(gB.certificateToAsn1(A)).getBytes()
    };
    return K4.pem.encode(B, {
      maxline: Q
    })
  };
  gB.publicKeyFromPem = function (A) {
    var Q = K4.pem.decode(A)[0];
    if (Q.type !== "PUBLIC KEY" && Q.type !== "RSA PUBLIC KEY") {
      var B = Error('Could not convert public key from PEM; PEM header type is not "PUBLIC KEY" or "RSA PUBLIC KEY".');
      throw B.headerType = Q.type, B
    }
    if (Q.procType && Q.procType.type === "ENCRYPTED") throw Error("Could not convert public key from PEM; PEM is encrypted.");
    var G = pA.fromDer(Q.body);
    return gB.publicKeyFromAsn1(G)
  };
  gB.publicKeyToPem = function (A, Q) {
    var B = {
      type: "PUBLIC KEY",
      body: pA.toDer(gB.publicKeyToAsn1(A)).getBytes()
    };
    return K4.pem.encode(B, {
      maxline: Q
    })
  };
  gB.publicKeyToRSAPublicKeyPem = function (A, Q) {
    var B = {
      type: "RSA PUBLIC KEY",
      body: pA.toDer(gB.publicKeyToRSAPublicKey(A)).getBytes()
    };
    return K4.pem.encode(B, {
      maxline: Q
    })
  };
  gB.getPublicKeyFingerprint = function (A, Q) {
    Q = Q || {};
    var B = Q.md || K4.md.sha1.create(),
      G = Q.type || "RSAPublicKey",
      Z;
    switch (G) {
      case "RSAPublicKey":
        Z = pA.toDer(gB.publicKeyToRSAPublicKey(A)).getBytes();
        break;
      case "SubjectPublicKeyInfo":
        Z = pA.toDer(gB.publicKeyToAsn1(A)).getBytes();
        break;
      default:
        throw Error('Unknown fingerprint type "' + Q.type + '".')
    }
    B.start(), B.update(Z);
    var Y = B.digest();
    if (Q.encoding === "hex") {
      var J = Y.toHex();
      if (Q.delimiter) return J.match(/.{2}/g).join(Q.delimiter);
      return J
    } else if (Q.encoding === "binary") return Y.getBytes();
    else if (Q.encoding) throw Error('Unknown encoding "' + Q.encoding + '".');
    return Y
  };
  gB.certificationRequestFromPem = function (A, Q, B) {
    var G = K4.pem.decode(A)[0];
    if (G.type !== "CERTIFICATE REQUEST") {
      var Z = Error('Could not convert certification request from PEM; PEM header type is not "CERTIFICATE REQUEST".');
      throw Z.headerType = G.type, Z
    }
    if (G.procType && G.procType.type === "ENCRYPTED") throw Error("Could not convert certification request from PEM; PEM is encrypted.");
    var Y = pA.fromDer(G.body, B);
    return gB.certificationRequestFromAsn1(Y, Q)
  };
  gB.certificationRequestToPem = function (A, Q) {
    var B = {
      type: "CERTIFICATE REQUEST",
      body: pA.toDer(gB.certificationRequestToAsn1(A)).getBytes()
    };
    return K4.pem.encode(B, {
      maxline: Q
    })
  };
  gB.createCertificate = function () {
    var A = {};
    return A.version = 2, A.serialNumber = "00", A.signatureOid = null, A.signature = null, A.siginfo = {}, A.siginfo.algorithmOid = null, A.validity = {}, A.validity.notBefore = new Date, A.validity.notAfter = new Date, A.issuer = {}, A.issuer.getField = function (Q) {
      return bt(A.issuer, Q)
    }, A.issuer.addField = function (Q) {
      Wj([Q]), A.issuer.attributes.push(Q)
    }, A.issuer.attributes = [], A.issuer.hash = null, A.subject = {}, A.subject.getField = function (Q) {
      return bt(A.subject, Q)
    }, A.subject.addField = function (Q) {
      Wj([Q]), A.subject.attributes.push(Q)
    }, A.subject.attributes = [], A.subject.hash = null, A.extensions = [], A.publicKey = null, A.md = null, A.setSubject = function (Q, B) {
      if (Wj(Q), A.subject.attributes = Q, delete A.subject.uniqueId, B) A.subject.uniqueId = B;
      A.subject.hash = null
    }, A.setIssuer = function (Q, B) {
      if (Wj(Q), A.issuer.attributes = Q, delete A.issuer.uniqueId, B) A.issuer.uniqueId = B;
      A.issuer.hash = null
    }, A.setExtensions = function (Q) {
      for (var B = 0; B < Q.length; ++B) Ua2(Q[B], {
        cert: A
      });
      A.extensions = Q
    }, A.getExtension = function (Q) {
      if (typeof Q === "string") Q = {
        name: Q
      };
      var B = null,
        G;
      for (var Z = 0; B === null && Z < A.extensions.length; ++Z)
        if (G = A.extensions[Z], Q.id && G.id === Q.id) B = G;
        else if (Q.name && G.name === Q.name) B = G;
      return B
    }, A.sign = function (Q, B) {
      A.md = B || K4.md.sha1.create();
      var G = D7[A.md.algorithm + "WithRSAEncryption"];
      if (!G) {
        var Z = Error("Could not compute certificate digest. Unknown message digest algorithm OID.");
        throw Z.algorithm = A.md.algorithm, Z
      }
      A.signatureOid = A.siginfo.algorithmOid = G, A.tbsCertificate = gB.getTBSCertificate(A);
      var Y = pA.toDer(A.tbsCertificate);
      A.md.update(Y.getBytes()), A.signature = Q.sign(A.md)
    }, A.verify = function (Q) {
      var B = !1;
      if (!A.issued(Q)) {
        var G = Q.issuer,
          Z = A.subject,
          Y = Error("The parent certificate did not issue the given child certificate; the child certificate's issuer does not match the parent's subject.");
        throw Y.expectedIssuer = Z.attributes, Y.actualIssuer = G.attributes, Y
      }
      var J = Q.md;
      if (J === null) {
        J = BF1({
          signatureOid: Q.signatureOid,
          type: "certificate"
        });
        var X = Q.tbsCertificate || gB.getTBSCertificate(Q),
          I = pA.toDer(X);
        J.update(I.getBytes())
      }
      if (J !== null) B = Ca2({
        certificate: A,
        md: J,
        signature: Q.signature
      });
      return B
    }, A.isIssuer = function (Q) {
      var B = !1,
        G = A.issuer,
        Z = Q.subject;
      if (G.hash && Z.hash) B = G.hash === Z.hash;
      else if (G.attributes.length === Z.attributes.length) {
        B = !0;
        var Y, J;
        for (var X = 0; B && X < G.attributes.length; ++X)
          if (Y = G.attributes[X], J = Z.attributes[X], Y.type !== J.type || Y.value !== J.value) B = !1
      }
      return B
    }, A.issued = function (Q) {
      return Q.isIssuer(A)
    }, A.generateSubjectKeyIdentifier = function () {
      return gB.getPublicKeyFingerprint(A.publicKey, {
        type: "RSAPublicKey"
      })
    }, A.verifySubjectKeyIdentifier = function () {
      var Q = D7.subjectKeyIdentifier;
      for (var B = 0; B < A.extensions.length; ++B) {
        var G = A.extensions[B];
        if (G.id === Q) {
          var Z = A.generateSubjectKeyIdentifier().getBytes();
          return K4.util.hexToBytes(G.subjectKeyIdentifier) === Z
        }
      }
      return !1
    }, A
  };
  gB.certificateFromAsn1 = function (A, Q) {
    var B = {},
      G = [];
    if (!pA.validate(A, K07, B, G)) {
      var Z = Error("Cannot read X.509 certificate. ASN.1 object is not an X509v3 Certificate.");
      throw Z.errors = G, Z
    }
    var Y = pA.derToOid(B.publicKeyOid);
    if (Y !== gB.oids.rsaEncryption) throw Error("Cannot read public key. OID is not RSA.");
    var J = gB.createCertificate();
    J.version = B.certVersion ? B.certVersion.charCodeAt(0) : 0;
    var X = K4.util.createBuffer(B.certSerialNumber);
    J.serialNumber = X.toHex(), J.signatureOid = K4.asn1.derToOid(B.certSignatureOid), J.signatureParameters = QF1(J.signatureOid, B.certSignatureParams, !0), J.siginfo.algorithmOid = K4.asn1.derToOid(B.certinfoSignatureOid), J.siginfo.parameters = QF1(J.siginfo.algorithmOid, B.certinfoSignatureParams, !1), J.signature = B.certSignature;
    var I = [];
    if (B.certValidity1UTCTime !== void 0) I.push(pA.utcTimeToDate(B.certValidity1UTCTime));
    if (B.certValidity2GeneralizedTime !== void 0) I.push(pA.generalizedTimeToDate(B.certValidity2GeneralizedTime));
    if (B.certValidity3UTCTime !== void 0) I.push(pA.utcTimeToDate(B.certValidity3UTCTime));
    if (B.certValidity4GeneralizedTime !== void 0) I.push(pA.generalizedTimeToDate(B.certValidity4GeneralizedTime));
    if (I.length > 2) throw Error("Cannot read notBefore/notAfter validity times; more than two times were provided in the certificate.");
    if (I.length < 2) throw Error("Cannot read notBefore/notAfter validity times; they were not provided as either UTCTime or GeneralizedTime.");
    if (J.validity.notBefore = I[0], J.validity.notAfter = I[1], J.tbsCertificate = B.tbsCertificate, Q) {
      J.md = BF1({
        signatureOid: J.signatureOid,
        type: "certificate"
      });
      var D = pA.toDer(J.tbsCertificate);
      J.md.update(D.getBytes())
    }
    var W = K4.md.sha1.create(),
      K = pA.toDer(B.certIssuer);
    if (W.update(K.getBytes()), J.issuer.getField = function (H) {
        return bt(J.issuer, H)
      }, J.issuer.addField = function (H) {
        Wj([H]), J.issuer.attributes.push(H)
      }, J.issuer.attributes = gB.RDNAttributesAsArray(B.certIssuer), B.certIssuerUniqueId) J.issuer.uniqueId = B.certIssuerUniqueId;
    J.issuer.hash = W.digest().toHex();
    var V = K4.md.sha1.create(),
      F = pA.toDer(B.certSubject);
    if (V.update(F.getBytes()), J.subject.getField = function (H) {
        return bt(J.subject, H)
      }, J.subject.addField = function (H) {
        Wj([H]), J.subject.attributes.push(H)
      }, J.subject.attributes = gB.RDNAttributesAsArray(B.certSubject), B.certSubjectUniqueId) J.subject.uniqueId = B.certSubjectUniqueId;
    if (J.subject.hash = V.digest().toHex(), B.certExtensions) J.extensions = gB.certificateExtensionsFromAsn1(B.certExtensions);
    else J.extensions = [];
    return J.publicKey = gB.publicKeyFromAsn1(B.subjectPublicKeyInfo), J
  };
  gB.certificateExtensionsFromAsn1 = function (A) {
    var Q = [];
    for (var B = 0; B < A.value.length; ++B) {
      var G = A.value[B];
      for (var Z = 0; Z < G.value.length; ++Z) Q.push(gB.certificateExtensionFromAsn1(G.value[Z]))
    }
    return Q
  };
  gB.certificateExtensionFromAsn1 = function (A) {
    var Q = {};
    if (Q.id = pA.derToOid(A.value[0].value), Q.critical = !1, A.value[1].type === pA.Type.BOOLEAN) Q.critical = A.value[1].value.charCodeAt(0) !== 0, Q.value = A.value[2].value;
    else Q.value = A.value[1].value;
    if (Q.id in D7) {
      if (Q.name = D7[Q.id], Q.name === "keyUsage") {
        var B = pA.fromDer(Q.value),
          G = 0,
          Z = 0;
        if (B.value.length > 1) G = B.value.charCodeAt(1), Z = B.value.length > 2 ? B.value.charCodeAt(2) : 0;
        Q.digitalSignature = (G & 128) === 128, Q.nonRepudiation = (G & 64) === 64, Q.keyEncipherment = (G & 32) === 32, Q.dataEncipherment = (G & 16) === 16, Q.keyAgreement = (G & 8) === 8, Q.keyCertSign = (G & 4) === 4, Q.cRLSign = (G & 2) === 2, Q.encipherOnly = (G & 1) === 1, Q.decipherOnly = (Z & 128) === 128
      } else if (Q.name === "basicConstraints") {
        var B = pA.fromDer(Q.value);
        if (B.value.length > 0 && B.value[0].type === pA.Type.BOOLEAN) Q.cA = B.value[0].value.charCodeAt(0) !== 0;
        else Q.cA = !1;
        var Y = null;
        if (B.value.length > 0 && B.value[0].type === pA.Type.INTEGER) Y = B.value[0].value;
        else if (B.value.length > 1) Y = B.value[1].value;
        if (Y !== null) Q.pathLenConstraint = pA.derToInteger(Y)
      } else if (Q.name === "extKeyUsage") {
        var B = pA.fromDer(Q.value);
        for (var J = 0; J < B.value.length; ++J) {
          var X = pA.derToOid(B.value[J].value);
          if (X in D7) Q[D7[X]] = !0;
          else Q[X] = !0
        }
      } else if (Q.name === "nsCertType") {
        var B = pA.fromDer(Q.value),
          G = 0;
        if (B.value.length > 1) G = B.value.charCodeAt(1);
        Q.client = (G & 128) === 128, Q.server = (G & 64) === 64, Q.email = (G & 32) === 32, Q.objsign = (G & 16) === 16, Q.reserved = (G & 8) === 8, Q.sslCA = (G & 4) === 4, Q.emailCA = (G & 2) === 2, Q.objCA = (G & 1) === 1
      } else if (Q.name === "subjectAltName" || Q.name === "issuerAltName") {
        Q.altNames = [];
        var I, B = pA.fromDer(Q.value);
        for (var D = 0; D < B.value.length; ++D) {
          I = B.value[D];
          var W = {
            type: I.type,
            value: I.value
          };
          switch (Q.altNames.push(W), I.type) {
            case 1:
            case 2:
            case 6:
              break;
            case 7:
              W.ip = K4.util.bytesToIP(I.value);
              break;
            case 8:
              W.oid = pA.derToOid(I.value);
              break;
            default:
          }
        }
      } else if (Q.name === "subjectKeyIdentifier") {
        var B = pA.fromDer(Q.value);
        Q.subjectKeyIdentifier = K4.util.bytesToHex(B.value)
      }
    }
    return Q
  };
  gB.certificationRequestFromAsn1 = function (A, Q) {
    var B = {},
      G = [];
    if (!pA.validate(A, H07, B, G)) {
      var Z = Error("Cannot read PKCS#10 certificate request. ASN.1 object is not a PKCS#10 CertificationRequest.");
      throw Z.errors = G, Z
    }
    var Y = pA.derToOid(B.publicKeyOid);
    if (Y !== gB.oids.rsaEncryption) throw Error("Cannot read public key. OID is not RSA.");
    var J = gB.createCertificationRequest();
    if (J.version = B.csrVersion ? B.csrVersion.charCodeAt(0) : 0, J.signatureOid = K4.asn1.derToOid(B.csrSignatureOid), J.signatureParameters = QF1(J.signatureOid, B.csrSignatureParams, !0), J.siginfo.algorithmOid = K4.asn1.derToOid(B.csrSignatureOid), J.siginfo.parameters = QF1(J.siginfo.algorithmOid, B.csrSignatureParams, !1), J.signature = B.csrSignature, J.certificationRequestInfo = B.certificationRequestInfo, Q) {
      J.md = BF1({
        signatureOid: J.signatureOid,
        type: "certification request"
      });
      var X = pA.toDer(J.certificationRequestInfo);
      J.md.update(X.getBytes())
    }
    var I = K4.md.sha1.create();
    return J.subject.getField = function (D) {
      return bt(J.subject, D)
    }, J.subject.addField = function (D) {
      Wj([D]), J.subject.attributes.push(D)
    }, J.subject.attributes = gB.RDNAttributesAsArray(B.certificationRequestInfoSubject, I), J.subject.hash = I.digest().toHex(), J.publicKey = gB.publicKeyFromAsn1(B.subjectPublicKeyInfo), J.getAttribute = function (D) {
      return bt(J, D)
    }, J.addAttribute = function (D) {
      Wj([D]), J.attributes.push(D)
    }, J.attributes = gB.CRIAttributesAsArray(B.certificationRequestInfoAttributes || []), J
  };
  gB.createCertificationRequest = function () {
    var A = {};
    return A.version = 0, A.signatureOid = null, A.signature = null, A.siginfo = {}, A.siginfo.algorithmOid = null, A.subject = {}, A.subject.getField = function (Q) {
      return bt(A.subject, Q)
    }, A.subject.addField = function (Q) {
      Wj([Q]), A.subject.attributes.push(Q)
    }, A.subject.attributes = [], A.subject.hash = null, A.publicKey = null, A.attributes = [], A.getAttribute = function (Q) {
      return bt(A, Q)
    }, A.addAttribute = function (Q) {
      Wj([Q]), A.attributes.push(Q)
    }, A.md = null, A.setSubject = function (Q) {
      Wj(Q), A.subject.attributes = Q, A.subject.hash = null
    }, A.setAttributes = function (Q) {
      Wj(Q), A.attributes = Q
    }, A.sign = function (Q, B) {
      A.md = B || K4.md.sha1.create();
      var G = D7[A.md.algorithm + "WithRSAEncryption"];
      if (!G) {
        var Z = Error("Could not compute certification request digest. Unknown message digest algorithm OID.");
        throw Z.algorithm = A.md.algorithm, Z
      }
      A.signatureOid = A.siginfo.algorithmOid = G, A.certificationRequestInfo = gB.getCertificationRequestInfo(A);
      var Y = pA.toDer(A.certificationRequestInfo);
      A.md.update(Y.getBytes()), A.signature = Q.sign(A.md)
    }, A.verify = function () {
      var Q = !1,
        B = A.md;
      if (B === null) {
        B = BF1({
          signatureOid: A.signatureOid,
          type: "certification request"
        });
        var G = A.certificationRequestInfo || gB.getCertificationRequestInfo(A),
          Z = pA.toDer(G);
        B.update(Z.getBytes())
      }
      if (B !== null) Q = Ca2({
        certificate: A,
        md: B,
        signature: A.signature
      });
      return Q
    }, A
  };

  function PEA(A) {
    var Q = pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, []),
      B, G, Z = A.attributes;
    for (var Y = 0; Y < Z.length; ++Y) {
      B = Z[Y];
      var J = B.value,
        X = pA.Type.PRINTABLESTRING;
      if ("valueTagClass" in B) {
        if (X = B.valueTagClass, X === pA.Type.UTF8) J = K4.util.encodeUtf8(J)
      }
      G = pA.create(pA.Class.UNIVERSAL, pA.Type.SET, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.OID, !1, pA.oidToDer(B.type).getBytes()), pA.create(pA.Class.UNIVERSAL, X, !1, J)])]), Q.value.push(G)
    }
    return Q
  }

  function Wj(A) {
    var Q;
    for (var B = 0; B < A.length; ++B) {
      if (Q = A[B], typeof Q.name > "u") {
        if (Q.type && Q.type in gB.oids) Q.name = gB.oids[Q.type];
        else if (Q.shortName && Q.shortName in JD) Q.name = gB.oids[JD[Q.shortName]]
      }
      if (typeof Q.type > "u")
        if (Q.name && Q.name in gB.oids) Q.type = gB.oids[Q.name];
        else {
          var G = Error("Attribute type not specified.");
          throw G.attribute = Q, G
        } if (typeof Q.shortName > "u") {
        if (Q.name && Q.name in JD) Q.shortName = JD[Q.name]
      }
      if (Q.type === D7.extensionRequest) {
        if (Q.valueConstructed = !0, Q.valueTagClass = pA.Type.SEQUENCE, !Q.value && Q.extensions) {
          Q.value = [];
          for (var Z = 0; Z < Q.extensions.length; ++Z) Q.value.push(gB.certificateExtensionToAsn1(Ua2(Q.extensions[Z])))
        }
      }
      if (typeof Q.value > "u") {
        var G = Error("Attribute value not specified.");
        throw G.attribute = Q, G
      }
    }
  }

  function Ua2(A, Q) {
    if (Q = Q || {}, typeof A.name > "u") {
      if (A.id && A.id in gB.oids) A.name = gB.oids[A.id]
    }
    if (typeof A.id > "u")
      if (A.name && A.name in gB.oids) A.id = gB.oids[A.name];
      else {
        var B = Error("Extension ID not specified.");
        throw B.extension = A, B
      } if (typeof A.value < "u") return A;
    if (A.name === "keyUsage") {
      var G = 0,
        Z = 0,
        Y = 0;
      if (A.digitalSignature) Z |= 128, G = 7;
      if (A.nonRepudiation) Z |= 64, G = 6;
      if (A.keyEncipherment) Z |= 32, G = 5;
      if (A.dataEncipherment) Z |= 16, G = 4;
      if (A.keyAgreement) Z |= 8, G = 3;
      if (A.keyCertSign) Z |= 4, G = 2;
      if (A.cRLSign) Z |= 2, G = 1;
      if (A.encipherOnly) Z |= 1, G = 0;
      if (A.decipherOnly) Y |= 128, G = 7;
      var J = String.fromCharCode(G);
      if (Y !== 0) J += String.fromCharCode(Z) + String.fromCharCode(Y);
      else if (Z !== 0) J += String.fromCharCode(Z);
      A.value = pA.create(pA.Class.UNIVERSAL, pA.Type.BITSTRING, !1, J)
    } else if (A.name === "basicConstraints") {
      if (A.value = pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, []), A.cA) A.value.value.push(pA.create(pA.Class.UNIVERSAL, pA.Type.BOOLEAN, !1, String.fromCharCode(255)));
      if ("pathLenConstraint" in A) A.value.value.push(pA.create(pA.Class.UNIVERSAL, pA.Type.INTEGER, !1, pA.integerToDer(A.pathLenConstraint).getBytes()))
    } else if (A.name === "extKeyUsage") {
      A.value = pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, []);
      var X = A.value.value;
      for (var I in A) {
        if (A[I] !== !0) continue;
        if (I in D7) X.push(pA.create(pA.Class.UNIVERSAL, pA.Type.OID, !1, pA.oidToDer(D7[I]).getBytes()));
        else if (I.indexOf(".") !== -1) X.push(pA.create(pA.Class.UNIVERSAL, pA.Type.OID, !1, pA.oidToDer(I).getBytes()))
      }
    } else if (A.name === "nsCertType") {
      var G = 0,
        Z = 0;
      if (A.client) Z |= 128, G = 7;
      if (A.server) Z |= 64, G = 6;
      if (A.email) Z |= 32, G = 5;
      if (A.objsign) Z |= 16, G = 4;
      if (A.reserved) Z |= 8, G = 3;
      if (A.sslCA) Z |= 4, G = 2;
      if (A.emailCA) Z |= 2, G = 1;
      if (A.objCA) Z |= 1, G = 0;
      var J = String.fromCharCode(G);
      if (Z !== 0) J += String.fromCharCode(Z);
      A.value = pA.create(pA.Class.UNIVERSAL, pA.Type.BITSTRING, !1, J)
    } else if (A.name === "subjectAltName" || A.name === "issuerAltName") {
      A.value = pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, []);
      var D;
      for (var W = 0; W < A.altNames.length; ++W) {
        D = A.altNames[W];
        var J = D.value;
        if (D.type === 7 && D.ip) {
          if (J = K4.util.bytesFromIP(D.ip), J === null) {
            var B = Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
            throw B.extension = A, B
          }
        } else if (D.type === 8)
          if (D.oid) J = pA.oidToDer(pA.oidToDer(D.oid));
          else J = pA.oidToDer(J);
        A.value.value.push(pA.create(pA.Class.CONTEXT_SPECIFIC, D.type, !1, J))
      }
    } else if (A.name === "nsComment" && Q.cert) {
      if (!/^[\x00-\x7F]*$/.test(A.comment) || A.comment.length < 1 || A.comment.length > 128) throw Error('Invalid "nsComment" content.');
      A.value = pA.create(pA.Class.UNIVERSAL, pA.Type.IA5STRING, !1, A.comment)
    } else if (A.name === "subjectKeyIdentifier" && Q.cert) {
      var K = Q.cert.generateSubjectKeyIdentifier();
      A.subjectKeyIdentifier = K.toHex(), A.value = pA.create(pA.Class.UNIVERSAL, pA.Type.OCTETSTRING, !1, K.getBytes())
    } else if (A.name === "authorityKeyIdentifier" && Q.cert) {
      A.value = pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, []);
      var X = A.value.value;
      if (A.keyIdentifier) {
        var V = A.keyIdentifier === !0 ? Q.cert.generateSubjectKeyIdentifier().getBytes() : A.keyIdentifier;
        X.push(pA.create(pA.Class.CONTEXT_SPECIFIC, 0, !1, V))
      }
      if (A.authorityCertIssuer) {
        var F = [pA.create(pA.Class.CONTEXT_SPECIFIC, 4, !0, [PEA(A.authorityCertIssuer === !0 ? Q.cert.issuer : A.authorityCertIssuer)])];
        X.push(pA.create(pA.Class.CONTEXT_SPECIFIC, 1, !0, F))
      }
      if (A.serialNumber) {
        var H = K4.util.hexToBytes(A.serialNumber === !0 ? Q.cert.serialNumber : A.serialNumber);
        X.push(pA.create(pA.Class.CONTEXT_SPECIFIC, 2, !1, H))
      }
    } else if (A.name === "cRLDistributionPoints") {
      A.value = pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, []);
      var X = A.value.value,
        E = pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, []),
        z = pA.create(pA.Class.CONTEXT_SPECIFIC, 0, !0, []),
        D;
      for (var W = 0; W < A.altNames.length; ++W) {
        D = A.altNames[W];
        var J = D.value;
        if (D.type === 7 && D.ip) {
          if (J = K4.util.bytesFromIP(D.ip), J === null) {
            var B = Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
            throw B.extension = A, B
          }
        } else if (D.type === 8)
          if (D.oid) J = pA.oidToDer(pA.oidToDer(D.oid));
          else J = pA.oidToDer(J);
        z.value.push(pA.create(pA.Class.CONTEXT_SPECIFIC, D.type, !1, J))
      }
      E.value.push(pA.create(pA.Class.CONTEXT_SPECIFIC, 0, !0, [z])), X.push(E)
    }
    if (typeof A.value > "u") {
      var B = Error("Extension value not specified.");
      throw B.extension = A, B
    }
    return A
  }

  function Vw0(A, Q) {
    switch (A) {
      case D7["RSASSA-PSS"]:
        var B = [];
        if (Q.hash.algorithmOid !== void 0) B.push(pA.create(pA.Class.CONTEXT_SPECIFIC, 0, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.OID, !1, pA.oidToDer(Q.hash.algorithmOid).getBytes()), pA.create(pA.Class.UNIVERSAL, pA.Type.NULL, !1, "")])]));
        if (Q.mgf.algorithmOid !== void 0) B.push(pA.create(pA.Class.CONTEXT_SPECIFIC, 1, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.OID, !1, pA.oidToDer(Q.mgf.algorithmOid).getBytes()), pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.OID, !1, pA.oidToDer(Q.mgf.hash.algorithmOid).getBytes()), pA.create(pA.Class.UNIVERSAL, pA.Type.NULL, !1, "")])])]));
        if (Q.saltLength !== void 0) B.push(pA.create(pA.Class.CONTEXT_SPECIFIC, 2, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.INTEGER, !1, pA.integerToDer(Q.saltLength).getBytes())]));
        return pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, B);
      default:
        return pA.create(pA.Class.UNIVERSAL, pA.Type.NULL, !1, "")
    }
  }

  function E07(A) {
    var Q = pA.create(pA.Class.CONTEXT_SPECIFIC, 0, !0, []);
    if (A.attributes.length === 0) return Q;
    var B = A.attributes;
    for (var G = 0; G < B.length; ++G) {
      var Z = B[G],
        Y = Z.value,
        J = pA.Type.UTF8;
      if ("valueTagClass" in Z) J = Z.valueTagClass;
      if (J === pA.Type.UTF8) Y = K4.util.encodeUtf8(Y);
      var X = !1;
      if ("valueConstructed" in Z) X = Z.valueConstructed;
      var I = pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.OID, !1, pA.oidToDer(Z.type).getBytes()), pA.create(pA.Class.UNIVERSAL, pA.Type.SET, !0, [pA.create(pA.Class.UNIVERSAL, J, X, Y)])]);
      Q.value.push(I)
    }
    return Q
  }
  var z07 = new Date("1950-01-01T00:00:00Z"),
    $07 = new Date("2050-01-01T00:00:00Z");

  function za2(A) {
    if (A >= z07 && A < $07) return pA.create(pA.Class.UNIVERSAL, pA.Type.UTCTIME, !1, pA.dateToUtcTime(A));
    else return pA.create(pA.Class.UNIVERSAL, pA.Type.GENERALIZEDTIME, !1, pA.dateToGeneralizedTime(A))
  }
  gB.getTBSCertificate = function (A) {
    var Q = za2(A.validity.notBefore),
      B = za2(A.validity.notAfter),
      G = pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, [pA.create(pA.Class.CONTEXT_SPECIFIC, 0, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.INTEGER, !1, pA.integerToDer(A.version).getBytes())]), pA.create(pA.Class.UNIVERSAL, pA.Type.INTEGER, !1, K4.util.hexToBytes(A.serialNumber)), pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.OID, !1, pA.oidToDer(A.siginfo.algorithmOid).getBytes()), Vw0(A.siginfo.algorithmOid, A.siginfo.parameters)]), PEA(A.issuer), pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, [Q, B]), PEA(A.subject), gB.publicKeyToAsn1(A.publicKey)]);
    if (A.issuer.uniqueId) G.value.push(pA.create(pA.Class.CONTEXT_SPECIFIC, 1, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.BITSTRING, !1, String.fromCharCode(0) + A.issuer.uniqueId)]));
    if (A.subject.uniqueId) G.value.push(pA.create(pA.Class.CONTEXT_SPECIFIC, 2, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.BITSTRING, !1, String.fromCharCode(0) + A.subject.uniqueId)]));
    if (A.extensions.length > 0) G.value.push(gB.certificateExtensionsToAsn1(A.extensions));
    return G
  };
  gB.getCertificationRequestInfo = function (A) {
    var Q = pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.INTEGER, !1, pA.integerToDer(A.version).getBytes()), PEA(A.subject), gB.publicKeyToAsn1(A.publicKey), E07(A)]);
    return Q
  };
  gB.distinguishedNameToAsn1 = function (A) {
    return PEA(A)
  };
  gB.certificateToAsn1 = function (A) {
    var Q = A.tbsCertificate || gB.getTBSCertificate(A);
    return pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, [Q, pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.OID, !1, pA.oidToDer(A.signatureOid).getBytes()), Vw0(A.signatureOid, A.signatureParameters)]), pA.create(pA.Class.UNIVERSAL, pA.Type.BITSTRING, !1, String.fromCharCode(0) + A.signature)])
  };
  gB.certificateExtensionsToAsn1 = function (A) {
    var Q = pA.create(pA.Class.CONTEXT_SPECIFIC, 3, !0, []),
      B = pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, []);
    Q.value.push(B);
    for (var G = 0; G < A.length; ++G) B.value.push(gB.certificateExtensionToAsn1(A[G]));
    return Q
  };
  gB.certificateExtensionToAsn1 = function (A) {
    var Q = pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, []);
    if (Q.value.push(pA.create(pA.Class.UNIVERSAL, pA.Type.OID, !1, pA.oidToDer(A.id).getBytes())), A.critical) Q.value.push(pA.create(pA.Class.UNIVERSAL, pA.Type.BOOLEAN, !1, String.fromCharCode(255)));
    var B = A.value;
    if (typeof A.value !== "string") B = pA.toDer(B).getBytes();
    return Q.value.push(pA.create(pA.Class.UNIVERSAL, pA.Type.OCTETSTRING, !1, B)), Q
  };
  gB.certificationRequestToAsn1 = function (A) {
    var Q = A.certificationRequestInfo || gB.getCertificationRequestInfo(A);
    return pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, [Q, pA.create(pA.Class.UNIVERSAL, pA.Type.SEQUENCE, !0, [pA.create(pA.Class.UNIVERSAL, pA.Type.OID, !1, pA.oidToDer(A.signatureOid).getBytes()), Vw0(A.signatureOid, A.signatureParameters)]), pA.create(pA.Class.UNIVERSAL, pA.Type.BITSTRING, !1, String.fromCharCode(0) + A.signature)])
  };
  gB.createCaStore = function (A) {
    var Q = {
      certs: {}
    };
    Q.getIssuer = function (J) {
      var X = B(J.issuer);
      return X
    }, Q.addCertificate = function (J) {
      if (typeof J === "string") J = K4.pki.certificateFromPem(J);
      if (G(J.subject), !Q.hasCertificate(J))
        if (J.subject.hash in Q.certs) {
          var X = Q.certs[J.subject.hash];
          if (!K4.util.isArray(X)) X = [X];
          X.push(J), Q.certs[J.subject.hash] = X
        } else Q.certs[J.subject.hash] = J
    }, Q.hasCertificate = function (J) {
      if (typeof J === "string") J = K4.pki.certificateFromPem(J);
      var X = B(J.subject);
      if (!X) return !1;
      if (!K4.util.isArray(X)) X = [X];
      var I = pA.toDer(gB.certificateToAsn1(J)).getBytes();
      for (var D = 0; D < X.length; ++D) {
        var W = pA.toDer(gB.certificateToAsn1(X[D])).getBytes();
        if (I === W) return !0
      }
      return !1
    }, Q.listAllCertificates = function () {
      var J = [];
      for (var X in Q.certs)
        if (Q.certs.hasOwnProperty(X)) {
          var I = Q.certs[X];
          if (!K4.util.isArray(I)) J.push(I);
          else
            for (var D = 0; D < I.length; ++D) J.push(I[D])
        } return J
    }, Q.removeCertificate = function (J) {
      var X;
      if (typeof J === "string") J = K4.pki.certificateFromPem(J);
      if (G(J.subject), !Q.hasCertificate(J)) return null;
      var I = B(J.subject);
      if (!K4.util.isArray(I)) return X = Q.certs[J.subject.hash], delete Q.certs[J.subject.hash], X;
      var D = pA.toDer(gB.certificateToAsn1(J)).getBytes();
      for (var W = 0; W < I.length; ++W) {
        var K = pA.toDer(gB.certificateToAsn1(I[W])).getBytes();
        if (D === K) X = I[W], I.splice(W, 1)
      }
      if (I.length === 0) delete Q.certs[J.subject.hash];
      return X
    };

    function B(J) {
      return G(J), Q.certs[J.hash] || null
    }

    function G(J) {
      if (!J.hash) {
        var X = K4.md.sha1.create();
        J.attributes = gB.RDNAttributesAsArray(PEA(J), X), J.hash = X.digest().toHex()
      }
    }
    if (A)
      for (var Z = 0; Z < A.length; ++Z) {
        var Y = A[Z];
        Q.addCertificate(Y)
      }
    return Q
  };
  gB.certificateError = {
    bad_certificate: "forge.pki.BadCertificate",
    unsupported_certificate: "forge.pki.UnsupportedCertificate",
    certificate_revoked: "forge.pki.CertificateRevoked",
    certificate_expired: "forge.pki.CertificateExpired",
    certificate_unknown: "forge.pki.CertificateUnknown",
    unknown_ca: "forge.pki.UnknownCertificateAuthority"
  };
  gB.verifyCertificateChain = function (A, Q, B) {
    if (typeof B === "function") B = {
      verify: B
    };
    B = B || {}, Q = Q.slice(0);
    var G = Q.slice(0),
      Z = B.validityCheckDate;
    if (typeof Z > "u") Z = new Date;
    var Y = !0,
      J = null,
      X = 0;
    do {
      var I = Q.shift(),
        D = null,
        W = !1;
      if (Z) {
        if (Z < I.validity.notBefore || Z > I.validity.notAfter) J = {
          message: "Certificate is not valid yet or has expired.",
          error: gB.certificateError.certificate_expired,
          notBefore: I.validity.notBefore,
          notAfter: I.validity.notAfter,
          now: Z
        }
      }
      if (J === null) {
        if (D = Q[0] || A.getIssuer(I), D === null) {
          if (I.isIssuer(I)) W = !0, D = I
        }
        if (D) {
          var K = D;
          if (!K4.util.isArray(K)) K = [K];
          var V = !1;
          while (!V && K.length > 0) {
            D = K.shift();
            try {
              V = D.verify(I)
            } catch (_) {}
          }
          if (!V) J = {
            message: "Certificate signature is invalid.",
            error: gB.certificateError.bad_certificate
          }
        }
        if (J === null && (!D || W) && !A.hasCertificate(I)) J = {
          message: "Certificate is not trusted.",
          error: gB.certificateError.unknown_ca
        }
      }
      if (J === null && D && !I.isIssuer(D)) J = {
        message: "Certificate issuer is invalid.",
        error: gB.certificateError.bad_certificate
      };
      if (J === null) {
        var F = {
          keyUsage: !0,
          basicConstraints: !0
        };
        for (var H = 0; J === null && H < I.extensions.length; ++H) {
          var E = I.extensions[H];
          if (E.critical && !(E.name in F)) J = {
            message: "Certificate has an unsupported critical extension.",
            error: gB.certificateError.unsupported_certificate
          }
        }
      }
      if (J === null && (!Y || Q.length === 0 && (!D || W))) {
        var z = I.getExtension("basicConstraints"),
          $ = I.getExtension("keyUsage");
        if ($ !== null) {
          if (!$.keyCertSign || z === null) J = {
            message: "Certificate keyUsage or basicConstraints conflict or indicate that the certificate is not a CA. If the certificate is the only one in the chain or isn't the first then the certificate must be a valid CA.",
            error: gB.certificateError.bad_certificate
          }
        }
        if (J === null && z !== null && !z.cA) J = {
          message: "Certificate basicConstraints indicates the certificate is not a CA.",
          error: gB.certificateError.bad_certificate
        };
        if (J === null && $ !== null && "pathLenConstraint" in z) {
          var O = X - 1;
          if (O > z.pathLenConstraint) J = {
            message: "Certificate basicConstraints pathLenConstraint violated.",
            error: gB.certificateError.bad_certificate
          }
        }
      }
      var L = J === null ? !0 : J.error,
        M = B.verify ? B.verify(L, X, G) : L;
      if (M === !0) J = null;
      else {
        if (L === !0) J = {
          message: "The application rejected the certificate.",
          error: gB.certificateError.bad_certificate
        };
        if (M || M === 0) {
          if (typeof M === "object" && !K4.util.isArray(M)) {
            if (M.message) J.message = M.message;
            if (M.error) J.error = M.error
          } else if (typeof M === "string") J.error = M
        }
        throw J
      }
      Y = !1, ++X
    } while (Q.length > 0);
    return !0
  }
})
// @from(Ln 377523, Col 4)
Hw0 = U((qXY, wa2) => {
  var BJ = H8();
  Nx();
  LEA();
  yt();
  Ww0();
  Dw0();
  Xj();
  bfA();
  _EA();
  _7();
  GF1();
  var {
    asn1: _1,
    pki: E5
  } = BJ, hfA = wa2.exports = BJ.pkcs12 = BJ.pkcs12 || {}, Na2 = {
    name: "ContentInfo",
    tagClass: _1.Class.UNIVERSAL,
    type: _1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "ContentInfo.contentType",
      tagClass: _1.Class.UNIVERSAL,
      type: _1.Type.OID,
      constructed: !1,
      capture: "contentType"
    }, {
      name: "ContentInfo.content",
      tagClass: _1.Class.CONTEXT_SPECIFIC,
      constructed: !0,
      captureAsn1: "content"
    }]
  }, C07 = {
    name: "PFX",
    tagClass: _1.Class.UNIVERSAL,
    type: _1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "PFX.version",
      tagClass: _1.Class.UNIVERSAL,
      type: _1.Type.INTEGER,
      constructed: !1,
      capture: "version"
    }, Na2, {
      name: "PFX.macData",
      tagClass: _1.Class.UNIVERSAL,
      type: _1.Type.SEQUENCE,
      constructed: !0,
      optional: !0,
      captureAsn1: "mac",
      value: [{
        name: "PFX.macData.mac",
        tagClass: _1.Class.UNIVERSAL,
        type: _1.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "PFX.macData.mac.digestAlgorithm",
          tagClass: _1.Class.UNIVERSAL,
          type: _1.Type.SEQUENCE,
          constructed: !0,
          value: [{
            name: "PFX.macData.mac.digestAlgorithm.algorithm",
            tagClass: _1.Class.UNIVERSAL,
            type: _1.Type.OID,
            constructed: !1,
            capture: "macAlgorithm"
          }, {
            name: "PFX.macData.mac.digestAlgorithm.parameters",
            tagClass: _1.Class.UNIVERSAL,
            captureAsn1: "macAlgorithmParameters"
          }]
        }, {
          name: "PFX.macData.mac.digest",
          tagClass: _1.Class.UNIVERSAL,
          type: _1.Type.OCTETSTRING,
          constructed: !1,
          capture: "macDigest"
        }]
      }, {
        name: "PFX.macData.macSalt",
        tagClass: _1.Class.UNIVERSAL,
        type: _1.Type.OCTETSTRING,
        constructed: !1,
        capture: "macSalt"
      }, {
        name: "PFX.macData.iterations",
        tagClass: _1.Class.UNIVERSAL,
        type: _1.Type.INTEGER,
        constructed: !1,
        optional: !0,
        capture: "macIterations"
      }]
    }]
  }, U07 = {
    name: "SafeBag",
    tagClass: _1.Class.UNIVERSAL,
    type: _1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "SafeBag.bagId",
      tagClass: _1.Class.UNIVERSAL,
      type: _1.Type.OID,
      constructed: !1,
      capture: "bagId"
    }, {
      name: "SafeBag.bagValue",
      tagClass: _1.Class.CONTEXT_SPECIFIC,
      constructed: !0,
      captureAsn1: "bagValue"
    }, {
      name: "SafeBag.bagAttributes",
      tagClass: _1.Class.UNIVERSAL,
      type: _1.Type.SET,
      constructed: !0,
      optional: !0,
      capture: "bagAttributes"
    }]
  }, q07 = {
    name: "Attribute",
    tagClass: _1.Class.UNIVERSAL,
    type: _1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "Attribute.attrId",
      tagClass: _1.Class.UNIVERSAL,
      type: _1.Type.OID,
      constructed: !1,
      capture: "oid"
    }, {
      name: "Attribute.attrValues",
      tagClass: _1.Class.UNIVERSAL,
      type: _1.Type.SET,
      constructed: !0,
      capture: "values"
    }]
  }, N07 = {
    name: "CertBag",
    tagClass: _1.Class.UNIVERSAL,
    type: _1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "CertBag.certId",
      tagClass: _1.Class.UNIVERSAL,
      type: _1.Type.OID,
      constructed: !1,
      capture: "certId"
    }, {
      name: "CertBag.certValue",
      tagClass: _1.Class.CONTEXT_SPECIFIC,
      constructed: !0,
      value: [{
        name: "CertBag.certValue[0]",
        tagClass: _1.Class.UNIVERSAL,
        type: _1.Class.OCTETSTRING,
        constructed: !1,
        capture: "cert"
      }]
    }]
  };

  function ffA(A, Q, B, G) {
    var Z = [];
    for (var Y = 0; Y < A.length; Y++)
      for (var J = 0; J < A[Y].safeBags.length; J++) {
        var X = A[Y].safeBags[J];
        if (G !== void 0 && X.type !== G) continue;
        if (Q === null) {
          Z.push(X);
          continue
        }
        if (X.attributes[Q] !== void 0 && X.attributes[Q].indexOf(B) >= 0) Z.push(X)
      }
    return Z
  }
  hfA.pkcs12FromAsn1 = function (A, Q, B) {
    if (typeof Q === "string") B = Q, Q = !0;
    else if (Q === void 0) Q = !0;
    var G = {},
      Z = [];
    if (!_1.validate(A, C07, G, Z)) {
      var Y = Error("Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.");
      throw Y.errors = Y, Y
    }
    var J = {
      version: G.version.charCodeAt(0),
      safeContents: [],
      getBags: function (z) {
        var $ = {},
          O;
        if ("localKeyId" in z) O = z.localKeyId;
        else if ("localKeyIdHex" in z) O = BJ.util.hexToBytes(z.localKeyIdHex);
        if (O === void 0 && !("friendlyName" in z) && "bagType" in z) $[z.bagType] = ffA(J.safeContents, null, null, z.bagType);
        if (O !== void 0) $.localKeyId = ffA(J.safeContents, "localKeyId", O, z.bagType);
        if ("friendlyName" in z) $.friendlyName = ffA(J.safeContents, "friendlyName", z.friendlyName, z.bagType);
        return $
      },
      getBagsByFriendlyName: function (z, $) {
        return ffA(J.safeContents, "friendlyName", z, $)
      },
      getBagsByLocalKeyId: function (z, $) {
        return ffA(J.safeContents, "localKeyId", z, $)
      }
    };
    if (G.version.charCodeAt(0) !== 3) {
      var Y = Error("PKCS#12 PFX of version other than 3 not supported.");
      throw Y.version = G.version.charCodeAt(0), Y
    }
    if (_1.derToOid(G.contentType) !== E5.oids.data) {
      var Y = Error("Only PKCS#12 PFX in password integrity mode supported.");
      throw Y.oid = _1.derToOid(G.contentType), Y
    }
    var X = G.content.value[0];
    if (X.tagClass !== _1.Class.UNIVERSAL || X.type !== _1.Type.OCTETSTRING) throw Error("PKCS#12 authSafe content data is not an OCTET STRING.");
    if (X = Fw0(X), G.mac) {
      var I = null,
        D = 0,
        W = _1.derToOid(G.macAlgorithm);
      switch (W) {
        case E5.oids.sha1:
          I = BJ.md.sha1.create(), D = 20;
          break;
        case E5.oids.sha256:
          I = BJ.md.sha256.create(), D = 32;
          break;
        case E5.oids.sha384:
          I = BJ.md.sha384.create(), D = 48;
          break;
        case E5.oids.sha512:
          I = BJ.md.sha512.create(), D = 64;
          break;
        case E5.oids.md5:
          I = BJ.md.md5.create(), D = 16;
          break
      }
      if (I === null) throw Error("PKCS#12 uses unsupported MAC algorithm: " + W);
      var K = new BJ.util.ByteBuffer(G.macSalt),
        V = "macIterations" in G ? parseInt(BJ.util.bytesToHex(G.macIterations), 16) : 1,
        F = hfA.generateKey(B, K, 3, V, D, I),
        H = BJ.hmac.create();
      H.start(I, F), H.update(X.value);
      var E = H.getMac();
      if (E.getBytes() !== G.macDigest) throw Error("PKCS#12 MAC could not be verified. Invalid password?")
    }
    return w07(J, X.value, Q, B), J
  };

  function Fw0(A) {
    if (A.composed || A.constructed) {
      var Q = BJ.util.createBuffer();
      for (var B = 0; B < A.value.length; ++B) Q.putBytes(A.value[B].value);
      A.composed = A.constructed = !1, A.value = Q.getBytes()
    }
    return A
  }

  function w07(A, Q, B, G) {
    if (Q = _1.fromDer(Q, B), Q.tagClass !== _1.Class.UNIVERSAL || Q.type !== _1.Type.SEQUENCE || Q.constructed !== !0) throw Error("PKCS#12 AuthenticatedSafe expected to be a SEQUENCE OF ContentInfo");
    for (var Z = 0; Z < Q.value.length; Z++) {
      var Y = Q.value[Z],
        J = {},
        X = [];
      if (!_1.validate(Y, Na2, J, X)) {
        var I = Error("Cannot read ContentInfo.");
        throw I.errors = X, I
      }
      var D = {
          encrypted: !1
        },
        W = null,
        K = J.content.value[0];
      switch (_1.derToOid(J.contentType)) {
        case E5.oids.data:
          if (K.tagClass !== _1.Class.UNIVERSAL || K.type !== _1.Type.OCTETSTRING) throw Error("PKCS#12 SafeContents Data is not an OCTET STRING.");
          W = Fw0(K).value;
          break;
        case E5.oids.encryptedData:
          W = L07(K, G), D.encrypted = !0;
          break;
        default:
          var I = Error("Unsupported PKCS#12 contentType.");
          throw I.contentType = _1.derToOid(J.contentType), I
      }
      D.safeBags = O07(W, B, G), A.safeContents.push(D)
    }
  }

  function L07(A, Q) {
    var B = {},
      G = [];
    if (!_1.validate(A, BJ.pkcs7.asn1.encryptedDataValidator, B, G)) {
      var Z = Error("Cannot read EncryptedContentInfo.");
      throw Z.errors = G, Z
    }
    var Y = _1.derToOid(B.contentType);
    if (Y !== E5.oids.data) {
      var Z = Error("PKCS#12 EncryptedContentInfo ContentType is not Data.");
      throw Z.oid = Y, Z
    }
    Y = _1.derToOid(B.encAlgorithm);
    var J = E5.pbe.getCipher(Y, B.encParameter, Q),
      X = Fw0(B.encryptedContentAsn1),
      I = BJ.util.createBuffer(X.value);
    if (J.update(I), !J.finish()) throw Error("Failed to decrypt PKCS#12 SafeContents.");
    return J.output.getBytes()
  }

  function O07(A, Q, B) {
    if (!Q && A.length === 0) return [];
    if (A = _1.fromDer(A, Q), A.tagClass !== _1.Class.UNIVERSAL || A.type !== _1.Type.SEQUENCE || A.constructed !== !0) throw Error("PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag.");
    var G = [];
    for (var Z = 0; Z < A.value.length; Z++) {
      var Y = A.value[Z],
        J = {},
        X = [];
      if (!_1.validate(Y, U07, J, X)) {
        var I = Error("Cannot read SafeBag.");
        throw I.errors = X, I
      }
      var D = {
        type: _1.derToOid(J.bagId),
        attributes: M07(J.bagAttributes)
      };
      G.push(D);
      var W, K, V = J.bagValue.value[0];
      switch (D.type) {
        case E5.oids.pkcs8ShroudedKeyBag:
          if (V = E5.decryptPrivateKeyInfo(V, B), V === null) throw Error("Unable to decrypt PKCS#8 ShroudedKeyBag, wrong password?");
        case E5.oids.keyBag:
          try {
            D.key = E5.privateKeyFromAsn1(V)
          } catch (H) {
            D.key = null, D.asn1 = V
          }
          continue;
        case E5.oids.certBag:
          W = N07, K = function () {
            if (_1.derToOid(J.certId) !== E5.oids.x509Certificate) {
              var H = Error("Unsupported certificate type, only X.509 supported.");
              throw H.oid = _1.derToOid(J.certId), H
            }
            var E = _1.fromDer(J.cert, Q);
            try {
              D.cert = E5.certificateFromAsn1(E, !0)
            } catch (z) {
              D.cert = null, D.asn1 = E
            }
          };
          break;
        default:
          var I = Error("Unsupported PKCS#12 SafeBag type.");
          throw I.oid = D.type, I
      }
      if (W !== void 0 && !_1.validate(V, W, J, X)) {
        var I = Error("Cannot read PKCS#12 " + W.name);
        throw I.errors = X, I
      }
      K()
    }
    return G
  }

  function M07(A) {
    var Q = {};
    if (A !== void 0)
      for (var B = 0; B < A.length; ++B) {
        var G = {},
          Z = [];
        if (!_1.validate(A[B], q07, G, Z)) {
          var Y = Error("Cannot read PKCS#12 BagAttribute.");
          throw Y.errors = Z, Y
        }
        var J = _1.derToOid(G.oid);
        if (E5.oids[J] === void 0) continue;
        Q[E5.oids[J]] = [];
        for (var X = 0; X < G.values.length; ++X) Q[E5.oids[J]].push(G.values[X].value)
      }
    return Q
  }
  hfA.toPkcs12Asn1 = function (A, Q, B, G) {
    if (G = G || {}, G.saltSize = G.saltSize || 8, G.count = G.count || 2048, G.algorithm = G.algorithm || G.encAlgorithm || "aes128", !("useMac" in G)) G.useMac = !0;
    if (!("localKeyId" in G)) G.localKeyId = null;
    if (!("generateLocalKeyId" in G)) G.generateLocalKeyId = !0;
    var Z = G.localKeyId,
      Y;
    if (Z !== null) Z = BJ.util.hexToBytes(Z);
    else if (G.generateLocalKeyId)
      if (Q) {
        var J = BJ.util.isArray(Q) ? Q[0] : Q;
        if (typeof J === "string") J = E5.certificateFromPem(J);
        var X = BJ.md.sha1.create();
        X.update(_1.toDer(E5.certificateToAsn1(J)).getBytes()), Z = X.digest().getBytes()
      } else Z = BJ.random.getBytes(20);
    var I = [];
    if (Z !== null) I.push(_1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.OID, !1, _1.oidToDer(E5.oids.localKeyId).getBytes()), _1.create(_1.Class.UNIVERSAL, _1.Type.SET, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.OCTETSTRING, !1, Z)])]));
    if ("friendlyName" in G) I.push(_1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.OID, !1, _1.oidToDer(E5.oids.friendlyName).getBytes()), _1.create(_1.Class.UNIVERSAL, _1.Type.SET, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.BMPSTRING, !1, G.friendlyName)])]));
    if (I.length > 0) Y = _1.create(_1.Class.UNIVERSAL, _1.Type.SET, !0, I);
    var D = [],
      W = [];
    if (Q !== null)
      if (BJ.util.isArray(Q)) W = Q;
      else W = [Q];
    var K = [];
    for (var V = 0; V < W.length; ++V) {
      if (Q = W[V], typeof Q === "string") Q = E5.certificateFromPem(Q);
      var F = V === 0 ? Y : void 0,
        H = E5.certificateToAsn1(Q),
        E = _1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.OID, !1, _1.oidToDer(E5.oids.certBag).getBytes()), _1.create(_1.Class.CONTEXT_SPECIFIC, 0, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.OID, !1, _1.oidToDer(E5.oids.x509Certificate).getBytes()), _1.create(_1.Class.CONTEXT_SPECIFIC, 0, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.OCTETSTRING, !1, _1.toDer(H).getBytes())])])]), F]);
      K.push(E)
    }
    if (K.length > 0) {
      var z = _1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, K),
        $ = _1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.OID, !1, _1.oidToDer(E5.oids.data).getBytes()), _1.create(_1.Class.CONTEXT_SPECIFIC, 0, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.OCTETSTRING, !1, _1.toDer(z).getBytes())])]);
      D.push($)
    }
    var O = null;
    if (A !== null) {
      var L = E5.wrapRsaPrivateKey(E5.privateKeyToAsn1(A));
      if (B === null) O = _1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.OID, !1, _1.oidToDer(E5.oids.keyBag).getBytes()), _1.create(_1.Class.CONTEXT_SPECIFIC, 0, !0, [L]), Y]);
      else O = _1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.OID, !1, _1.oidToDer(E5.oids.pkcs8ShroudedKeyBag).getBytes()), _1.create(_1.Class.CONTEXT_SPECIFIC, 0, !0, [E5.encryptPrivateKeyInfo(L, B, G)]), Y]);
      var M = _1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, [O]),
        _ = _1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.OID, !1, _1.oidToDer(E5.oids.data).getBytes()), _1.create(_1.Class.CONTEXT_SPECIFIC, 0, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.OCTETSTRING, !1, _1.toDer(M).getBytes())])]);
      D.push(_)
    }
    var j = _1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, D),
      x;
    if (G.useMac) {
      var X = BJ.md.sha1.create(),
        b = new BJ.util.ByteBuffer(BJ.random.getBytes(G.saltSize)),
        S = G.count,
        A = hfA.generateKey(B, b, 3, S, 20),
        u = BJ.hmac.create();
      u.start(X, A), u.update(_1.toDer(j).getBytes());
      var f = u.getMac();
      x = _1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.OID, !1, _1.oidToDer(E5.oids.sha1).getBytes()), _1.create(_1.Class.UNIVERSAL, _1.Type.NULL, !1, "")]), _1.create(_1.Class.UNIVERSAL, _1.Type.OCTETSTRING, !1, f.getBytes())]), _1.create(_1.Class.UNIVERSAL, _1.Type.OCTETSTRING, !1, b.getBytes()), _1.create(_1.Class.UNIVERSAL, _1.Type.INTEGER, !1, _1.integerToDer(S).getBytes())])
    }
    return _1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.INTEGER, !1, _1.integerToDer(3).getBytes()), _1.create(_1.Class.UNIVERSAL, _1.Type.SEQUENCE, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.OID, !1, _1.oidToDer(E5.oids.data).getBytes()), _1.create(_1.Class.CONTEXT_SPECIFIC, 0, !0, [_1.create(_1.Class.UNIVERSAL, _1.Type.OCTETSTRING, !1, _1.toDer(j).getBytes())])]), x])
  };
  hfA.generateKey = BJ.pbe.generatePkcs12Key
})
// @from(Ln 377962, Col 4)
zw0 = U((NXY, La2) => {
  var ft = H8();
  Nx();
  yt();
  Dw0();
  J3A();
  nV1();
  Hw0();
  AF1();
  bfA();
  _7();
  GF1();
  var Ew0 = ft.asn1,
    SEA = La2.exports = ft.pki = ft.pki || {};
  SEA.pemToDer = function (A) {
    var Q = ft.pem.decode(A)[0];
    if (Q.procType && Q.procType.type === "ENCRYPTED") throw Error("Could not convert PEM to DER; PEM is encrypted.");
    return ft.util.createBuffer(Q.body)
  };
  SEA.privateKeyFromPem = function (A) {
    var Q = ft.pem.decode(A)[0];
    if (Q.type !== "PRIVATE KEY" && Q.type !== "RSA PRIVATE KEY") {
      var B = Error('Could not convert private key from PEM; PEM header type is not "PRIVATE KEY" or "RSA PRIVATE KEY".');
      throw B.headerType = Q.type, B
    }
    if (Q.procType && Q.procType.type === "ENCRYPTED") throw Error("Could not convert private key from PEM; PEM is encrypted.");
    var G = Ew0.fromDer(Q.body);
    return SEA.privateKeyFromAsn1(G)
  };
  SEA.privateKeyToPem = function (A, Q) {
    var B = {
      type: "RSA PRIVATE KEY",
      body: Ew0.toDer(SEA.privateKeyToAsn1(A)).getBytes()
    };
    return ft.pem.encode(B, {
      maxline: Q
    })
  };
  SEA.privateKeyInfoToPem = function (A, Q) {
    var B = {
      type: "PRIVATE KEY",
      body: Ew0.toDer(A).getBytes()
    };
    return ft.pem.encode(B, {
      maxline: Q
    })
  }
})