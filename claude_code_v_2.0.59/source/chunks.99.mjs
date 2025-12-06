
// @from(Start 9290612, End 9341411)
A21 = z((DjG, D52) => {
  var j9 = B6();
  Zi();
  GP();
  pLA();
  Pk();
  J52();
  Ii();
  B1A();
  oB1();
  nLA();
  x3();
  var fA = j9.asn1,
    eQ = D52.exports = j9.pki = j9.pki || {},
    K3 = eQ.oids,
    vJ = {};
  vJ.CN = K3.commonName;
  vJ.commonName = "CN";
  vJ.C = K3.countryName;
  vJ.countryName = "C";
  vJ.L = K3.localityName;
  vJ.localityName = "L";
  vJ.ST = K3.stateOrProvinceName;
  vJ.stateOrProvinceName = "ST";
  vJ.O = K3.organizationName;
  vJ.organizationName = "O";
  vJ.OU = K3.organizationalUnitName;
  vJ.organizationalUnitName = "OU";
  vJ.E = K3.emailAddress;
  vJ.emailAddress = "E";
  var V52 = j9.pki.rsa.publicKeyValidator,
    _Z5 = {
      name: "Certificate",
      tagClass: fA.Class.UNIVERSAL,
      type: fA.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "Certificate.TBSCertificate",
        tagClass: fA.Class.UNIVERSAL,
        type: fA.Type.SEQUENCE,
        constructed: !0,
        captureAsn1: "tbsCertificate",
        value: [{
          name: "Certificate.TBSCertificate.version",
          tagClass: fA.Class.CONTEXT_SPECIFIC,
          type: 0,
          constructed: !0,
          optional: !0,
          value: [{
            name: "Certificate.TBSCertificate.version.integer",
            tagClass: fA.Class.UNIVERSAL,
            type: fA.Type.INTEGER,
            constructed: !1,
            capture: "certVersion"
          }]
        }, {
          name: "Certificate.TBSCertificate.serialNumber",
          tagClass: fA.Class.UNIVERSAL,
          type: fA.Type.INTEGER,
          constructed: !1,
          capture: "certSerialNumber"
        }, {
          name: "Certificate.TBSCertificate.signature",
          tagClass: fA.Class.UNIVERSAL,
          type: fA.Type.SEQUENCE,
          constructed: !0,
          value: [{
            name: "Certificate.TBSCertificate.signature.algorithm",
            tagClass: fA.Class.UNIVERSAL,
            type: fA.Type.OID,
            constructed: !1,
            capture: "certinfoSignatureOid"
          }, {
            name: "Certificate.TBSCertificate.signature.parameters",
            tagClass: fA.Class.UNIVERSAL,
            optional: !0,
            captureAsn1: "certinfoSignatureParams"
          }]
        }, {
          name: "Certificate.TBSCertificate.issuer",
          tagClass: fA.Class.UNIVERSAL,
          type: fA.Type.SEQUENCE,
          constructed: !0,
          captureAsn1: "certIssuer"
        }, {
          name: "Certificate.TBSCertificate.validity",
          tagClass: fA.Class.UNIVERSAL,
          type: fA.Type.SEQUENCE,
          constructed: !0,
          value: [{
            name: "Certificate.TBSCertificate.validity.notBefore (utc)",
            tagClass: fA.Class.UNIVERSAL,
            type: fA.Type.UTCTIME,
            constructed: !1,
            optional: !0,
            capture: "certValidity1UTCTime"
          }, {
            name: "Certificate.TBSCertificate.validity.notBefore (generalized)",
            tagClass: fA.Class.UNIVERSAL,
            type: fA.Type.GENERALIZEDTIME,
            constructed: !1,
            optional: !0,
            capture: "certValidity2GeneralizedTime"
          }, {
            name: "Certificate.TBSCertificate.validity.notAfter (utc)",
            tagClass: fA.Class.UNIVERSAL,
            type: fA.Type.UTCTIME,
            constructed: !1,
            optional: !0,
            capture: "certValidity3UTCTime"
          }, {
            name: "Certificate.TBSCertificate.validity.notAfter (generalized)",
            tagClass: fA.Class.UNIVERSAL,
            type: fA.Type.GENERALIZEDTIME,
            constructed: !1,
            optional: !0,
            capture: "certValidity4GeneralizedTime"
          }]
        }, {
          name: "Certificate.TBSCertificate.subject",
          tagClass: fA.Class.UNIVERSAL,
          type: fA.Type.SEQUENCE,
          constructed: !0,
          captureAsn1: "certSubject"
        }, V52, {
          name: "Certificate.TBSCertificate.issuerUniqueID",
          tagClass: fA.Class.CONTEXT_SPECIFIC,
          type: 1,
          constructed: !0,
          optional: !0,
          value: [{
            name: "Certificate.TBSCertificate.issuerUniqueID.id",
            tagClass: fA.Class.UNIVERSAL,
            type: fA.Type.BITSTRING,
            constructed: !1,
            captureBitStringValue: "certIssuerUniqueId"
          }]
        }, {
          name: "Certificate.TBSCertificate.subjectUniqueID",
          tagClass: fA.Class.CONTEXT_SPECIFIC,
          type: 2,
          constructed: !0,
          optional: !0,
          value: [{
            name: "Certificate.TBSCertificate.subjectUniqueID.id",
            tagClass: fA.Class.UNIVERSAL,
            type: fA.Type.BITSTRING,
            constructed: !1,
            captureBitStringValue: "certSubjectUniqueId"
          }]
        }, {
          name: "Certificate.TBSCertificate.extensions",
          tagClass: fA.Class.CONTEXT_SPECIFIC,
          type: 3,
          constructed: !0,
          captureAsn1: "certExtensions",
          optional: !0
        }]
      }, {
        name: "Certificate.signatureAlgorithm",
        tagClass: fA.Class.UNIVERSAL,
        type: fA.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "Certificate.signatureAlgorithm.algorithm",
          tagClass: fA.Class.UNIVERSAL,
          type: fA.Type.OID,
          constructed: !1,
          capture: "certSignatureOid"
        }, {
          name: "Certificate.TBSCertificate.signature.parameters",
          tagClass: fA.Class.UNIVERSAL,
          optional: !0,
          captureAsn1: "certSignatureParams"
        }]
      }, {
        name: "Certificate.signatureValue",
        tagClass: fA.Class.UNIVERSAL,
        type: fA.Type.BITSTRING,
        constructed: !1,
        captureBitStringValue: "certSignature"
      }]
    },
    kZ5 = {
      name: "rsapss",
      tagClass: fA.Class.UNIVERSAL,
      type: fA.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "rsapss.hashAlgorithm",
        tagClass: fA.Class.CONTEXT_SPECIFIC,
        type: 0,
        constructed: !0,
        value: [{
          name: "rsapss.hashAlgorithm.AlgorithmIdentifier",
          tagClass: fA.Class.UNIVERSAL,
          type: fA.Class.SEQUENCE,
          constructed: !0,
          optional: !0,
          value: [{
            name: "rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm",
            tagClass: fA.Class.UNIVERSAL,
            type: fA.Type.OID,
            constructed: !1,
            capture: "hashOid"
          }]
        }]
      }, {
        name: "rsapss.maskGenAlgorithm",
        tagClass: fA.Class.CONTEXT_SPECIFIC,
        type: 1,
        constructed: !0,
        value: [{
          name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier",
          tagClass: fA.Class.UNIVERSAL,
          type: fA.Class.SEQUENCE,
          constructed: !0,
          optional: !0,
          value: [{
            name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm",
            tagClass: fA.Class.UNIVERSAL,
            type: fA.Type.OID,
            constructed: !1,
            capture: "maskGenOid"
          }, {
            name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params",
            tagClass: fA.Class.UNIVERSAL,
            type: fA.Type.SEQUENCE,
            constructed: !0,
            value: [{
              name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm",
              tagClass: fA.Class.UNIVERSAL,
              type: fA.Type.OID,
              constructed: !1,
              capture: "maskGenHashOid"
            }]
          }]
        }]
      }, {
        name: "rsapss.saltLength",
        tagClass: fA.Class.CONTEXT_SPECIFIC,
        type: 2,
        optional: !0,
        value: [{
          name: "rsapss.saltLength.saltLength",
          tagClass: fA.Class.UNIVERSAL,
          type: fA.Class.INTEGER,
          constructed: !1,
          capture: "saltLength"
        }]
      }, {
        name: "rsapss.trailerField",
        tagClass: fA.Class.CONTEXT_SPECIFIC,
        type: 3,
        optional: !0,
        value: [{
          name: "rsapss.trailer.trailer",
          tagClass: fA.Class.UNIVERSAL,
          type: fA.Class.INTEGER,
          constructed: !1,
          capture: "trailer"
        }]
      }]
    },
    yZ5 = {
      name: "CertificationRequestInfo",
      tagClass: fA.Class.UNIVERSAL,
      type: fA.Type.SEQUENCE,
      constructed: !0,
      captureAsn1: "certificationRequestInfo",
      value: [{
        name: "CertificationRequestInfo.integer",
        tagClass: fA.Class.UNIVERSAL,
        type: fA.Type.INTEGER,
        constructed: !1,
        capture: "certificationRequestInfoVersion"
      }, {
        name: "CertificationRequestInfo.subject",
        tagClass: fA.Class.UNIVERSAL,
        type: fA.Type.SEQUENCE,
        constructed: !0,
        captureAsn1: "certificationRequestInfoSubject"
      }, V52, {
        name: "CertificationRequestInfo.attributes",
        tagClass: fA.Class.CONTEXT_SPECIFIC,
        type: 0,
        constructed: !0,
        optional: !0,
        capture: "certificationRequestInfoAttributes",
        value: [{
          name: "CertificationRequestInfo.attributes",
          tagClass: fA.Class.UNIVERSAL,
          type: fA.Type.SEQUENCE,
          constructed: !0,
          value: [{
            name: "CertificationRequestInfo.attributes.type",
            tagClass: fA.Class.UNIVERSAL,
            type: fA.Type.OID,
            constructed: !1
          }, {
            name: "CertificationRequestInfo.attributes.value",
            tagClass: fA.Class.UNIVERSAL,
            type: fA.Type.SET,
            constructed: !0
          }]
        }]
      }]
    },
    xZ5 = {
      name: "CertificationRequest",
      tagClass: fA.Class.UNIVERSAL,
      type: fA.Type.SEQUENCE,
      constructed: !0,
      captureAsn1: "csr",
      value: [yZ5, {
        name: "CertificationRequest.signatureAlgorithm",
        tagClass: fA.Class.UNIVERSAL,
        type: fA.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "CertificationRequest.signatureAlgorithm.algorithm",
          tagClass: fA.Class.UNIVERSAL,
          type: fA.Type.OID,
          constructed: !1,
          capture: "csrSignatureOid"
        }, {
          name: "CertificationRequest.signatureAlgorithm.parameters",
          tagClass: fA.Class.UNIVERSAL,
          optional: !0,
          captureAsn1: "csrSignatureParams"
        }]
      }, {
        name: "CertificationRequest.signature",
        tagClass: fA.Class.UNIVERSAL,
        type: fA.Type.BITSTRING,
        constructed: !1,
        captureBitStringValue: "csrSignature"
      }]
    };
  eQ.RDNAttributesAsArray = function(A, Q) {
    var B = [],
      G, Z, I;
    for (var Y = 0; Y < A.value.length; ++Y) {
      G = A.value[Y];
      for (var J = 0; J < G.value.length; ++J) {
        if (I = {}, Z = G.value[J], I.type = fA.derToOid(Z.value[0].value), I.value = Z.value[1].value, I.valueTagClass = Z.value[1].type, I.type in K3) {
          if (I.name = K3[I.type], I.name in vJ) I.shortName = vJ[I.name]
        }
        if (Q) Q.update(I.type), Q.update(I.value);
        B.push(I)
      }
    }
    return B
  };
  eQ.CRIAttributesAsArray = function(A) {
    var Q = [];
    for (var B = 0; B < A.length; ++B) {
      var G = A[B],
        Z = fA.derToOid(G.value[0].value),
        I = G.value[1].value;
      for (var Y = 0; Y < I.length; ++Y) {
        var J = {};
        if (J.type = Z, J.value = I[Y].value, J.valueTagClass = I[Y].type, J.type in K3) {
          if (J.name = K3[J.type], J.name in vJ) J.shortName = vJ[J.name]
        }
        if (J.type === K3.extensionRequest) {
          J.extensions = [];
          for (var W = 0; W < J.value.length; ++W) J.extensions.push(eQ.certificateExtensionFromAsn1(J.value[W]))
        }
        Q.push(J)
      }
    }
    return Q
  };

  function Wi(A, Q) {
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
  var tB1 = function(A, Q, B) {
      var G = {};
      if (A !== K3["RSASSA-PSS"]) return G;
      if (B) G = {
        hash: {
          algorithmOid: K3.sha1
        },
        mgf: {
          algorithmOid: K3.mgf1,
          hash: {
            algorithmOid: K3.sha1
          }
        },
        saltLength: 20
      };
      var Z = {},
        I = [];
      if (!fA.validate(Q, kZ5, Z, I)) {
        var Y = Error("Cannot read RSASSA-PSS parameter block.");
        throw Y.errors = I, Y
      }
      if (Z.hashOid !== void 0) G.hash = G.hash || {}, G.hash.algorithmOid = fA.derToOid(Z.hashOid);
      if (Z.maskGenOid !== void 0) G.mgf = G.mgf || {}, G.mgf.algorithmOid = fA.derToOid(Z.maskGenOid), G.mgf.hash = G.mgf.hash || {}, G.mgf.hash.algorithmOid = fA.derToOid(Z.maskGenHashOid);
      if (Z.saltLength !== void 0) G.saltLength = Z.saltLength.charCodeAt(0);
      return G
    },
    eB1 = function(A) {
      switch (K3[A.signatureOid]) {
        case "sha1WithRSAEncryption":
        case "sha1WithRSASignature":
          return j9.md.sha1.create();
        case "md5WithRSAEncryption":
          return j9.md.md5.create();
        case "sha256WithRSAEncryption":
          return j9.md.sha256.create();
        case "sha384WithRSAEncryption":
          return j9.md.sha384.create();
        case "sha512WithRSAEncryption":
          return j9.md.sha512.create();
        case "RSASSA-PSS":
          return j9.md.sha256.create();
        default:
          var Q = Error("Could not compute " + A.type + " digest. Unknown signature OID.");
          throw Q.signatureOid = A.signatureOid, Q
      }
    },
    F52 = function(A) {
      var Q = A.certificate,
        B;
      switch (Q.signatureOid) {
        case K3.sha1WithRSAEncryption:
        case K3.sha1WithRSASignature:
          break;
        case K3["RSASSA-PSS"]:
          var G, Z;
          if (G = K3[Q.signatureParameters.mgf.hash.algorithmOid], G === void 0 || j9.md[G] === void 0) {
            var I = Error("Unsupported MGF hash function.");
            throw I.oid = Q.signatureParameters.mgf.hash.algorithmOid, I.name = G, I
          }
          if (Z = K3[Q.signatureParameters.mgf.algorithmOid], Z === void 0 || j9.mgf[Z] === void 0) {
            var I = Error("Unsupported MGF function.");
            throw I.oid = Q.signatureParameters.mgf.algorithmOid, I.name = Z, I
          }
          if (Z = j9.mgf[Z].create(j9.md[G].create()), G = K3[Q.signatureParameters.hash.algorithmOid], G === void 0 || j9.md[G] === void 0) {
            var I = Error("Unsupported RSASSA-PSS hash function.");
            throw I.oid = Q.signatureParameters.hash.algorithmOid, I.name = G, I
          }
          B = j9.pss.create(j9.md[G].create(), Z, Q.signatureParameters.saltLength);
          break
      }
      return Q.publicKey.verify(A.md.digest().getBytes(), A.signature, B)
    };
  eQ.certificateFromPem = function(A, Q, B) {
    var G = j9.pem.decode(A)[0];
    if (G.type !== "CERTIFICATE" && G.type !== "X509 CERTIFICATE" && G.type !== "TRUSTED CERTIFICATE") {
      var Z = Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
      throw Z.headerType = G.type, Z
    }
    if (G.procType && G.procType.type === "ENCRYPTED") throw Error("Could not convert certificate from PEM; PEM is encrypted.");
    var I = fA.fromDer(G.body, B);
    return eQ.certificateFromAsn1(I, Q)
  };
  eQ.certificateToPem = function(A, Q) {
    var B = {
      type: "CERTIFICATE",
      body: fA.toDer(eQ.certificateToAsn1(A)).getBytes()
    };
    return j9.pem.encode(B, {
      maxline: Q
    })
  };
  eQ.publicKeyFromPem = function(A) {
    var Q = j9.pem.decode(A)[0];
    if (Q.type !== "PUBLIC KEY" && Q.type !== "RSA PUBLIC KEY") {
      var B = Error('Could not convert public key from PEM; PEM header type is not "PUBLIC KEY" or "RSA PUBLIC KEY".');
      throw B.headerType = Q.type, B
    }
    if (Q.procType && Q.procType.type === "ENCRYPTED") throw Error("Could not convert public key from PEM; PEM is encrypted.");
    var G = fA.fromDer(Q.body);
    return eQ.publicKeyFromAsn1(G)
  };
  eQ.publicKeyToPem = function(A, Q) {
    var B = {
      type: "PUBLIC KEY",
      body: fA.toDer(eQ.publicKeyToAsn1(A)).getBytes()
    };
    return j9.pem.encode(B, {
      maxline: Q
    })
  };
  eQ.publicKeyToRSAPublicKeyPem = function(A, Q) {
    var B = {
      type: "RSA PUBLIC KEY",
      body: fA.toDer(eQ.publicKeyToRSAPublicKey(A)).getBytes()
    };
    return j9.pem.encode(B, {
      maxline: Q
    })
  };
  eQ.getPublicKeyFingerprint = function(A, Q) {
    Q = Q || {};
    var B = Q.md || j9.md.sha1.create(),
      G = Q.type || "RSAPublicKey",
      Z;
    switch (G) {
      case "RSAPublicKey":
        Z = fA.toDer(eQ.publicKeyToRSAPublicKey(A)).getBytes();
        break;
      case "SubjectPublicKeyInfo":
        Z = fA.toDer(eQ.publicKeyToAsn1(A)).getBytes();
        break;
      default:
        throw Error('Unknown fingerprint type "' + Q.type + '".')
    }
    B.start(), B.update(Z);
    var I = B.digest();
    if (Q.encoding === "hex") {
      var Y = I.toHex();
      if (Q.delimiter) return Y.match(/.{2}/g).join(Q.delimiter);
      return Y
    } else if (Q.encoding === "binary") return I.getBytes();
    else if (Q.encoding) throw Error('Unknown encoding "' + Q.encoding + '".');
    return I
  };
  eQ.certificationRequestFromPem = function(A, Q, B) {
    var G = j9.pem.decode(A)[0];
    if (G.type !== "CERTIFICATE REQUEST") {
      var Z = Error('Could not convert certification request from PEM; PEM header type is not "CERTIFICATE REQUEST".');
      throw Z.headerType = G.type, Z
    }
    if (G.procType && G.procType.type === "ENCRYPTED") throw Error("Could not convert certification request from PEM; PEM is encrypted.");
    var I = fA.fromDer(G.body, B);
    return eQ.certificationRequestFromAsn1(I, Q)
  };
  eQ.certificationRequestToPem = function(A, Q) {
    var B = {
      type: "CERTIFICATE REQUEST",
      body: fA.toDer(eQ.certificationRequestToAsn1(A)).getBytes()
    };
    return j9.pem.encode(B, {
      maxline: Q
    })
  };
  eQ.createCertificate = function() {
    var A = {};
    return A.version = 2, A.serialNumber = "00", A.signatureOid = null, A.signature = null, A.siginfo = {}, A.siginfo.algorithmOid = null, A.validity = {}, A.validity.notBefore = new Date, A.validity.notAfter = new Date, A.issuer = {}, A.issuer.getField = function(Q) {
      return Wi(A.issuer, Q)
    }, A.issuer.addField = function(Q) {
      iM([Q]), A.issuer.attributes.push(Q)
    }, A.issuer.attributes = [], A.issuer.hash = null, A.subject = {}, A.subject.getField = function(Q) {
      return Wi(A.subject, Q)
    }, A.subject.addField = function(Q) {
      iM([Q]), A.subject.attributes.push(Q)
    }, A.subject.attributes = [], A.subject.hash = null, A.extensions = [], A.publicKey = null, A.md = null, A.setSubject = function(Q, B) {
      if (iM(Q), A.subject.attributes = Q, delete A.subject.uniqueId, B) A.subject.uniqueId = B;
      A.subject.hash = null
    }, A.setIssuer = function(Q, B) {
      if (iM(Q), A.issuer.attributes = Q, delete A.issuer.uniqueId, B) A.issuer.uniqueId = B;
      A.issuer.hash = null
    }, A.setExtensions = function(Q) {
      for (var B = 0; B < Q.length; ++B) K52(Q[B], {
        cert: A
      });
      A.extensions = Q
    }, A.getExtension = function(Q) {
      if (typeof Q === "string") Q = {
        name: Q
      };
      var B = null,
        G;
      for (var Z = 0; B === null && Z < A.extensions.length; ++Z)
        if (G = A.extensions[Z], Q.id && G.id === Q.id) B = G;
        else if (Q.name && G.name === Q.name) B = G;
      return B
    }, A.sign = function(Q, B) {
      A.md = B || j9.md.sha1.create();
      var G = K3[A.md.algorithm + "WithRSAEncryption"];
      if (!G) {
        var Z = Error("Could not compute certificate digest. Unknown message digest algorithm OID.");
        throw Z.algorithm = A.md.algorithm, Z
      }
      A.signatureOid = A.siginfo.algorithmOid = G, A.tbsCertificate = eQ.getTBSCertificate(A);
      var I = fA.toDer(A.tbsCertificate);
      A.md.update(I.getBytes()), A.signature = Q.sign(A.md)
    }, A.verify = function(Q) {
      var B = !1;
      if (!A.issued(Q)) {
        var G = Q.issuer,
          Z = A.subject,
          I = Error("The parent certificate did not issue the given child certificate; the child certificate's issuer does not match the parent's subject.");
        throw I.expectedIssuer = Z.attributes, I.actualIssuer = G.attributes, I
      }
      var Y = Q.md;
      if (Y === null) {
        Y = eB1({
          signatureOid: Q.signatureOid,
          type: "certificate"
        });
        var J = Q.tbsCertificate || eQ.getTBSCertificate(Q),
          W = fA.toDer(J);
        Y.update(W.getBytes())
      }
      if (Y !== null) B = F52({
        certificate: A,
        md: Y,
        signature: Q.signature
      });
      return B
    }, A.isIssuer = function(Q) {
      var B = !1,
        G = A.issuer,
        Z = Q.subject;
      if (G.hash && Z.hash) B = G.hash === Z.hash;
      else if (G.attributes.length === Z.attributes.length) {
        B = !0;
        var I, Y;
        for (var J = 0; B && J < G.attributes.length; ++J)
          if (I = G.attributes[J], Y = Z.attributes[J], I.type !== Y.type || I.value !== Y.value) B = !1
      }
      return B
    }, A.issued = function(Q) {
      return Q.isIssuer(A)
    }, A.generateSubjectKeyIdentifier = function() {
      return eQ.getPublicKeyFingerprint(A.publicKey, {
        type: "RSAPublicKey"
      })
    }, A.verifySubjectKeyIdentifier = function() {
      var Q = K3.subjectKeyIdentifier;
      for (var B = 0; B < A.extensions.length; ++B) {
        var G = A.extensions[B];
        if (G.id === Q) {
          var Z = A.generateSubjectKeyIdentifier().getBytes();
          return j9.util.hexToBytes(G.subjectKeyIdentifier) === Z
        }
      }
      return !1
    }, A
  };
  eQ.certificateFromAsn1 = function(A, Q) {
    var B = {},
      G = [];
    if (!fA.validate(A, _Z5, B, G)) {
      var Z = Error("Cannot read X.509 certificate. ASN.1 object is not an X509v3 Certificate.");
      throw Z.errors = G, Z
    }
    var I = fA.derToOid(B.publicKeyOid);
    if (I !== eQ.oids.rsaEncryption) throw Error("Cannot read public key. OID is not RSA.");
    var Y = eQ.createCertificate();
    Y.version = B.certVersion ? B.certVersion.charCodeAt(0) : 0;
    var J = j9.util.createBuffer(B.certSerialNumber);
    Y.serialNumber = J.toHex(), Y.signatureOid = j9.asn1.derToOid(B.certSignatureOid), Y.signatureParameters = tB1(Y.signatureOid, B.certSignatureParams, !0), Y.siginfo.algorithmOid = j9.asn1.derToOid(B.certinfoSignatureOid), Y.siginfo.parameters = tB1(Y.siginfo.algorithmOid, B.certinfoSignatureParams, !1), Y.signature = B.certSignature;
    var W = [];
    if (B.certValidity1UTCTime !== void 0) W.push(fA.utcTimeToDate(B.certValidity1UTCTime));
    if (B.certValidity2GeneralizedTime !== void 0) W.push(fA.generalizedTimeToDate(B.certValidity2GeneralizedTime));
    if (B.certValidity3UTCTime !== void 0) W.push(fA.utcTimeToDate(B.certValidity3UTCTime));
    if (B.certValidity4GeneralizedTime !== void 0) W.push(fA.generalizedTimeToDate(B.certValidity4GeneralizedTime));
    if (W.length > 2) throw Error("Cannot read notBefore/notAfter validity times; more than two times were provided in the certificate.");
    if (W.length < 2) throw Error("Cannot read notBefore/notAfter validity times; they were not provided as either UTCTime or GeneralizedTime.");
    if (Y.validity.notBefore = W[0], Y.validity.notAfter = W[1], Y.tbsCertificate = B.tbsCertificate, Q) {
      Y.md = eB1({
        signatureOid: Y.signatureOid,
        type: "certificate"
      });
      var X = fA.toDer(Y.tbsCertificate);
      Y.md.update(X.getBytes())
    }
    var V = j9.md.sha1.create(),
      F = fA.toDer(B.certIssuer);
    if (V.update(F.getBytes()), Y.issuer.getField = function(H) {
        return Wi(Y.issuer, H)
      }, Y.issuer.addField = function(H) {
        iM([H]), Y.issuer.attributes.push(H)
      }, Y.issuer.attributes = eQ.RDNAttributesAsArray(B.certIssuer), B.certIssuerUniqueId) Y.issuer.uniqueId = B.certIssuerUniqueId;
    Y.issuer.hash = V.digest().toHex();
    var K = j9.md.sha1.create(),
      D = fA.toDer(B.certSubject);
    if (K.update(D.getBytes()), Y.subject.getField = function(H) {
        return Wi(Y.subject, H)
      }, Y.subject.addField = function(H) {
        iM([H]), Y.subject.attributes.push(H)
      }, Y.subject.attributes = eQ.RDNAttributesAsArray(B.certSubject), B.certSubjectUniqueId) Y.subject.uniqueId = B.certSubjectUniqueId;
    if (Y.subject.hash = K.digest().toHex(), B.certExtensions) Y.extensions = eQ.certificateExtensionsFromAsn1(B.certExtensions);
    else Y.extensions = [];
    return Y.publicKey = eQ.publicKeyFromAsn1(B.subjectPublicKeyInfo), Y
  };
  eQ.certificateExtensionsFromAsn1 = function(A) {
    var Q = [];
    for (var B = 0; B < A.value.length; ++B) {
      var G = A.value[B];
      for (var Z = 0; Z < G.value.length; ++Z) Q.push(eQ.certificateExtensionFromAsn1(G.value[Z]))
    }
    return Q
  };
  eQ.certificateExtensionFromAsn1 = function(A) {
    var Q = {};
    if (Q.id = fA.derToOid(A.value[0].value), Q.critical = !1, A.value[1].type === fA.Type.BOOLEAN) Q.critical = A.value[1].value.charCodeAt(0) !== 0, Q.value = A.value[2].value;
    else Q.value = A.value[1].value;
    if (Q.id in K3) {
      if (Q.name = K3[Q.id], Q.name === "keyUsage") {
        var B = fA.fromDer(Q.value),
          G = 0,
          Z = 0;
        if (B.value.length > 1) G = B.value.charCodeAt(1), Z = B.value.length > 2 ? B.value.charCodeAt(2) : 0;
        Q.digitalSignature = (G & 128) === 128, Q.nonRepudiation = (G & 64) === 64, Q.keyEncipherment = (G & 32) === 32, Q.dataEncipherment = (G & 16) === 16, Q.keyAgreement = (G & 8) === 8, Q.keyCertSign = (G & 4) === 4, Q.cRLSign = (G & 2) === 2, Q.encipherOnly = (G & 1) === 1, Q.decipherOnly = (Z & 128) === 128
      } else if (Q.name === "basicConstraints") {
        var B = fA.fromDer(Q.value);
        if (B.value.length > 0 && B.value[0].type === fA.Type.BOOLEAN) Q.cA = B.value[0].value.charCodeAt(0) !== 0;
        else Q.cA = !1;
        var I = null;
        if (B.value.length > 0 && B.value[0].type === fA.Type.INTEGER) I = B.value[0].value;
        else if (B.value.length > 1) I = B.value[1].value;
        if (I !== null) Q.pathLenConstraint = fA.derToInteger(I)
      } else if (Q.name === "extKeyUsage") {
        var B = fA.fromDer(Q.value);
        for (var Y = 0; Y < B.value.length; ++Y) {
          var J = fA.derToOid(B.value[Y].value);
          if (J in K3) Q[K3[J]] = !0;
          else Q[J] = !0
        }
      } else if (Q.name === "nsCertType") {
        var B = fA.fromDer(Q.value),
          G = 0;
        if (B.value.length > 1) G = B.value.charCodeAt(1);
        Q.client = (G & 128) === 128, Q.server = (G & 64) === 64, Q.email = (G & 32) === 32, Q.objsign = (G & 16) === 16, Q.reserved = (G & 8) === 8, Q.sslCA = (G & 4) === 4, Q.emailCA = (G & 2) === 2, Q.objCA = (G & 1) === 1
      } else if (Q.name === "subjectAltName" || Q.name === "issuerAltName") {
        Q.altNames = [];
        var W, B = fA.fromDer(Q.value);
        for (var X = 0; X < B.value.length; ++X) {
          W = B.value[X];
          var V = {
            type: W.type,
            value: W.value
          };
          switch (Q.altNames.push(V), W.type) {
            case 1:
            case 2:
            case 6:
              break;
            case 7:
              V.ip = j9.util.bytesToIP(W.value);
              break;
            case 8:
              V.oid = fA.derToOid(W.value);
              break;
            default:
          }
        }
      } else if (Q.name === "subjectKeyIdentifier") {
        var B = fA.fromDer(Q.value);
        Q.subjectKeyIdentifier = j9.util.bytesToHex(B.value)
      }
    }
    return Q
  };
  eQ.certificationRequestFromAsn1 = function(A, Q) {
    var B = {},
      G = [];
    if (!fA.validate(A, xZ5, B, G)) {
      var Z = Error("Cannot read PKCS#10 certificate request. ASN.1 object is not a PKCS#10 CertificationRequest.");
      throw Z.errors = G, Z
    }
    var I = fA.derToOid(B.publicKeyOid);
    if (I !== eQ.oids.rsaEncryption) throw Error("Cannot read public key. OID is not RSA.");
    var Y = eQ.createCertificationRequest();
    if (Y.version = B.csrVersion ? B.csrVersion.charCodeAt(0) : 0, Y.signatureOid = j9.asn1.derToOid(B.csrSignatureOid), Y.signatureParameters = tB1(Y.signatureOid, B.csrSignatureParams, !0), Y.siginfo.algorithmOid = j9.asn1.derToOid(B.csrSignatureOid), Y.siginfo.parameters = tB1(Y.siginfo.algorithmOid, B.csrSignatureParams, !1), Y.signature = B.csrSignature, Y.certificationRequestInfo = B.certificationRequestInfo, Q) {
      Y.md = eB1({
        signatureOid: Y.signatureOid,
        type: "certification request"
      });
      var J = fA.toDer(Y.certificationRequestInfo);
      Y.md.update(J.getBytes())
    }
    var W = j9.md.sha1.create();
    return Y.subject.getField = function(X) {
      return Wi(Y.subject, X)
    }, Y.subject.addField = function(X) {
      iM([X]), Y.subject.attributes.push(X)
    }, Y.subject.attributes = eQ.RDNAttributesAsArray(B.certificationRequestInfoSubject, W), Y.subject.hash = W.digest().toHex(), Y.publicKey = eQ.publicKeyFromAsn1(B.subjectPublicKeyInfo), Y.getAttribute = function(X) {
      return Wi(Y, X)
    }, Y.addAttribute = function(X) {
      iM([X]), Y.attributes.push(X)
    }, Y.attributes = eQ.CRIAttributesAsArray(B.certificationRequestInfoAttributes || []), Y
  };
  eQ.createCertificationRequest = function() {
    var A = {};
    return A.version = 0, A.signatureOid = null, A.signature = null, A.siginfo = {}, A.siginfo.algorithmOid = null, A.subject = {}, A.subject.getField = function(Q) {
      return Wi(A.subject, Q)
    }, A.subject.addField = function(Q) {
      iM([Q]), A.subject.attributes.push(Q)
    }, A.subject.attributes = [], A.subject.hash = null, A.publicKey = null, A.attributes = [], A.getAttribute = function(Q) {
      return Wi(A, Q)
    }, A.addAttribute = function(Q) {
      iM([Q]), A.attributes.push(Q)
    }, A.md = null, A.setSubject = function(Q) {
      iM(Q), A.subject.attributes = Q, A.subject.hash = null
    }, A.setAttributes = function(Q) {
      iM(Q), A.attributes = Q
    }, A.sign = function(Q, B) {
      A.md = B || j9.md.sha1.create();
      var G = K3[A.md.algorithm + "WithRSAEncryption"];
      if (!G) {
        var Z = Error("Could not compute certification request digest. Unknown message digest algorithm OID.");
        throw Z.algorithm = A.md.algorithm, Z
      }
      A.signatureOid = A.siginfo.algorithmOid = G, A.certificationRequestInfo = eQ.getCertificationRequestInfo(A);
      var I = fA.toDer(A.certificationRequestInfo);
      A.md.update(I.getBytes()), A.signature = Q.sign(A.md)
    }, A.verify = function() {
      var Q = !1,
        B = A.md;
      if (B === null) {
        B = eB1({
          signatureOid: A.signatureOid,
          type: "certification request"
        });
        var G = A.certificationRequestInfo || eQ.getCertificationRequestInfo(A),
          Z = fA.toDer(G);
        B.update(Z.getBytes())
      }
      if (B !== null) Q = F52({
        certificate: A,
        md: B,
        signature: A.signature
      });
      return Q
    }, A
  };

  function aIA(A) {
    var Q = fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, []),
      B, G, Z = A.attributes;
    for (var I = 0; I < Z.length; ++I) {
      B = Z[I];
      var Y = B.value,
        J = fA.Type.PRINTABLESTRING;
      if ("valueTagClass" in B) {
        if (J = B.valueTagClass, J === fA.Type.UTF8) Y = j9.util.encodeUtf8(Y)
      }
      G = fA.create(fA.Class.UNIVERSAL, fA.Type.SET, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.OID, !1, fA.oidToDer(B.type).getBytes()), fA.create(fA.Class.UNIVERSAL, J, !1, Y)])]), Q.value.push(G)
    }
    return Q
  }

  function iM(A) {
    var Q;
    for (var B = 0; B < A.length; ++B) {
      if (Q = A[B], typeof Q.name > "u") {
        if (Q.type && Q.type in eQ.oids) Q.name = eQ.oids[Q.type];
        else if (Q.shortName && Q.shortName in vJ) Q.name = eQ.oids[vJ[Q.shortName]]
      }
      if (typeof Q.type > "u")
        if (Q.name && Q.name in eQ.oids) Q.type = eQ.oids[Q.name];
        else {
          var G = Error("Attribute type not specified.");
          throw G.attribute = Q, G
        } if (typeof Q.shortName > "u") {
        if (Q.name && Q.name in vJ) Q.shortName = vJ[Q.name]
      }
      if (Q.type === K3.extensionRequest) {
        if (Q.valueConstructed = !0, Q.valueTagClass = fA.Type.SEQUENCE, !Q.value && Q.extensions) {
          Q.value = [];
          for (var Z = 0; Z < Q.extensions.length; ++Z) Q.value.push(eQ.certificateExtensionToAsn1(K52(Q.extensions[Z])))
        }
      }
      if (typeof Q.value > "u") {
        var G = Error("Attribute value not specified.");
        throw G.attribute = Q, G
      }
    }
  }

  function K52(A, Q) {
    if (Q = Q || {}, typeof A.name > "u") {
      if (A.id && A.id in eQ.oids) A.name = eQ.oids[A.id]
    }
    if (typeof A.id > "u")
      if (A.name && A.name in eQ.oids) A.id = eQ.oids[A.name];
      else {
        var B = Error("Extension ID not specified.");
        throw B.extension = A, B
      } if (typeof A.value < "u") return A;
    if (A.name === "keyUsage") {
      var G = 0,
        Z = 0,
        I = 0;
      if (A.digitalSignature) Z |= 128, G = 7;
      if (A.nonRepudiation) Z |= 64, G = 6;
      if (A.keyEncipherment) Z |= 32, G = 5;
      if (A.dataEncipherment) Z |= 16, G = 4;
      if (A.keyAgreement) Z |= 8, G = 3;
      if (A.keyCertSign) Z |= 4, G = 2;
      if (A.cRLSign) Z |= 2, G = 1;
      if (A.encipherOnly) Z |= 1, G = 0;
      if (A.decipherOnly) I |= 128, G = 7;
      var Y = String.fromCharCode(G);
      if (I !== 0) Y += String.fromCharCode(Z) + String.fromCharCode(I);
      else if (Z !== 0) Y += String.fromCharCode(Z);
      A.value = fA.create(fA.Class.UNIVERSAL, fA.Type.BITSTRING, !1, Y)
    } else if (A.name === "basicConstraints") {
      if (A.value = fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, []), A.cA) A.value.value.push(fA.create(fA.Class.UNIVERSAL, fA.Type.BOOLEAN, !1, String.fromCharCode(255)));
      if ("pathLenConstraint" in A) A.value.value.push(fA.create(fA.Class.UNIVERSAL, fA.Type.INTEGER, !1, fA.integerToDer(A.pathLenConstraint).getBytes()))
    } else if (A.name === "extKeyUsage") {
      A.value = fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, []);
      var J = A.value.value;
      for (var W in A) {
        if (A[W] !== !0) continue;
        if (W in K3) J.push(fA.create(fA.Class.UNIVERSAL, fA.Type.OID, !1, fA.oidToDer(K3[W]).getBytes()));
        else if (W.indexOf(".") !== -1) J.push(fA.create(fA.Class.UNIVERSAL, fA.Type.OID, !1, fA.oidToDer(W).getBytes()))
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
      var Y = String.fromCharCode(G);
      if (Z !== 0) Y += String.fromCharCode(Z);
      A.value = fA.create(fA.Class.UNIVERSAL, fA.Type.BITSTRING, !1, Y)
    } else if (A.name === "subjectAltName" || A.name === "issuerAltName") {
      A.value = fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, []);
      var X;
      for (var V = 0; V < A.altNames.length; ++V) {
        X = A.altNames[V];
        var Y = X.value;
        if (X.type === 7 && X.ip) {
          if (Y = j9.util.bytesFromIP(X.ip), Y === null) {
            var B = Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
            throw B.extension = A, B
          }
        } else if (X.type === 8)
          if (X.oid) Y = fA.oidToDer(fA.oidToDer(X.oid));
          else Y = fA.oidToDer(Y);
        A.value.value.push(fA.create(fA.Class.CONTEXT_SPECIFIC, X.type, !1, Y))
      }
    } else if (A.name === "nsComment" && Q.cert) {
      if (!/^[\x00-\x7F]*$/.test(A.comment) || A.comment.length < 1 || A.comment.length > 128) throw Error('Invalid "nsComment" content.');
      A.value = fA.create(fA.Class.UNIVERSAL, fA.Type.IA5STRING, !1, A.comment)
    } else if (A.name === "subjectKeyIdentifier" && Q.cert) {
      var F = Q.cert.generateSubjectKeyIdentifier();
      A.subjectKeyIdentifier = F.toHex(), A.value = fA.create(fA.Class.UNIVERSAL, fA.Type.OCTETSTRING, !1, F.getBytes())
    } else if (A.name === "authorityKeyIdentifier" && Q.cert) {
      A.value = fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, []);
      var J = A.value.value;
      if (A.keyIdentifier) {
        var K = A.keyIdentifier === !0 ? Q.cert.generateSubjectKeyIdentifier().getBytes() : A.keyIdentifier;
        J.push(fA.create(fA.Class.CONTEXT_SPECIFIC, 0, !1, K))
      }
      if (A.authorityCertIssuer) {
        var D = [fA.create(fA.Class.CONTEXT_SPECIFIC, 4, !0, [aIA(A.authorityCertIssuer === !0 ? Q.cert.issuer : A.authorityCertIssuer)])];
        J.push(fA.create(fA.Class.CONTEXT_SPECIFIC, 1, !0, D))
      }
      if (A.serialNumber) {
        var H = j9.util.hexToBytes(A.serialNumber === !0 ? Q.cert.serialNumber : A.serialNumber);
        J.push(fA.create(fA.Class.CONTEXT_SPECIFIC, 2, !1, H))
      }
    } else if (A.name === "cRLDistributionPoints") {
      A.value = fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, []);
      var J = A.value.value,
        C = fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, []),
        E = fA.create(fA.Class.CONTEXT_SPECIFIC, 0, !0, []),
        X;
      for (var V = 0; V < A.altNames.length; ++V) {
        X = A.altNames[V];
        var Y = X.value;
        if (X.type === 7 && X.ip) {
          if (Y = j9.util.bytesFromIP(X.ip), Y === null) {
            var B = Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
            throw B.extension = A, B
          }
        } else if (X.type === 8)
          if (X.oid) Y = fA.oidToDer(fA.oidToDer(X.oid));
          else Y = fA.oidToDer(Y);
        E.value.push(fA.create(fA.Class.CONTEXT_SPECIFIC, X.type, !1, Y))
      }
      C.value.push(fA.create(fA.Class.CONTEXT_SPECIFIC, 0, !0, [E])), J.push(C)
    }
    if (typeof A.value > "u") {
      var B = Error("Extension value not specified.");
      throw B.extension = A, B
    }
    return A
  }

  function mA0(A, Q) {
    switch (A) {
      case K3["RSASSA-PSS"]:
        var B = [];
        if (Q.hash.algorithmOid !== void 0) B.push(fA.create(fA.Class.CONTEXT_SPECIFIC, 0, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.OID, !1, fA.oidToDer(Q.hash.algorithmOid).getBytes()), fA.create(fA.Class.UNIVERSAL, fA.Type.NULL, !1, "")])]));
        if (Q.mgf.algorithmOid !== void 0) B.push(fA.create(fA.Class.CONTEXT_SPECIFIC, 1, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.OID, !1, fA.oidToDer(Q.mgf.algorithmOid).getBytes()), fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.OID, !1, fA.oidToDer(Q.mgf.hash.algorithmOid).getBytes()), fA.create(fA.Class.UNIVERSAL, fA.Type.NULL, !1, "")])])]));
        if (Q.saltLength !== void 0) B.push(fA.create(fA.Class.CONTEXT_SPECIFIC, 2, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.INTEGER, !1, fA.integerToDer(Q.saltLength).getBytes())]));
        return fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, B);
      default:
        return fA.create(fA.Class.UNIVERSAL, fA.Type.NULL, !1, "")
    }
  }

  function vZ5(A) {
    var Q = fA.create(fA.Class.CONTEXT_SPECIFIC, 0, !0, []);
    if (A.attributes.length === 0) return Q;
    var B = A.attributes;
    for (var G = 0; G < B.length; ++G) {
      var Z = B[G],
        I = Z.value,
        Y = fA.Type.UTF8;
      if ("valueTagClass" in Z) Y = Z.valueTagClass;
      if (Y === fA.Type.UTF8) I = j9.util.encodeUtf8(I);
      var J = !1;
      if ("valueConstructed" in Z) J = Z.valueConstructed;
      var W = fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.OID, !1, fA.oidToDer(Z.type).getBytes()), fA.create(fA.Class.UNIVERSAL, fA.Type.SET, !0, [fA.create(fA.Class.UNIVERSAL, Y, J, I)])]);
      Q.value.push(W)
    }
    return Q
  }
  var bZ5 = new Date("1950-01-01T00:00:00Z"),
    fZ5 = new Date("2050-01-01T00:00:00Z");

  function X52(A) {
    if (A >= bZ5 && A < fZ5) return fA.create(fA.Class.UNIVERSAL, fA.Type.UTCTIME, !1, fA.dateToUtcTime(A));
    else return fA.create(fA.Class.UNIVERSAL, fA.Type.GENERALIZEDTIME, !1, fA.dateToGeneralizedTime(A))
  }
  eQ.getTBSCertificate = function(A) {
    var Q = X52(A.validity.notBefore),
      B = X52(A.validity.notAfter),
      G = fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, [fA.create(fA.Class.CONTEXT_SPECIFIC, 0, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.INTEGER, !1, fA.integerToDer(A.version).getBytes())]), fA.create(fA.Class.UNIVERSAL, fA.Type.INTEGER, !1, j9.util.hexToBytes(A.serialNumber)), fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.OID, !1, fA.oidToDer(A.siginfo.algorithmOid).getBytes()), mA0(A.siginfo.algorithmOid, A.siginfo.parameters)]), aIA(A.issuer), fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, [Q, B]), aIA(A.subject), eQ.publicKeyToAsn1(A.publicKey)]);
    if (A.issuer.uniqueId) G.value.push(fA.create(fA.Class.CONTEXT_SPECIFIC, 1, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.BITSTRING, !1, String.fromCharCode(0) + A.issuer.uniqueId)]));
    if (A.subject.uniqueId) G.value.push(fA.create(fA.Class.CONTEXT_SPECIFIC, 2, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.BITSTRING, !1, String.fromCharCode(0) + A.subject.uniqueId)]));
    if (A.extensions.length > 0) G.value.push(eQ.certificateExtensionsToAsn1(A.extensions));
    return G
  };
  eQ.getCertificationRequestInfo = function(A) {
    var Q = fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.INTEGER, !1, fA.integerToDer(A.version).getBytes()), aIA(A.subject), eQ.publicKeyToAsn1(A.publicKey), vZ5(A)]);
    return Q
  };
  eQ.distinguishedNameToAsn1 = function(A) {
    return aIA(A)
  };
  eQ.certificateToAsn1 = function(A) {
    var Q = A.tbsCertificate || eQ.getTBSCertificate(A);
    return fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, [Q, fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.OID, !1, fA.oidToDer(A.signatureOid).getBytes()), mA0(A.signatureOid, A.signatureParameters)]), fA.create(fA.Class.UNIVERSAL, fA.Type.BITSTRING, !1, String.fromCharCode(0) + A.signature)])
  };
  eQ.certificateExtensionsToAsn1 = function(A) {
    var Q = fA.create(fA.Class.CONTEXT_SPECIFIC, 3, !0, []),
      B = fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, []);
    Q.value.push(B);
    for (var G = 0; G < A.length; ++G) B.value.push(eQ.certificateExtensionToAsn1(A[G]));
    return Q
  };
  eQ.certificateExtensionToAsn1 = function(A) {
    var Q = fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, []);
    if (Q.value.push(fA.create(fA.Class.UNIVERSAL, fA.Type.OID, !1, fA.oidToDer(A.id).getBytes())), A.critical) Q.value.push(fA.create(fA.Class.UNIVERSAL, fA.Type.BOOLEAN, !1, String.fromCharCode(255)));
    var B = A.value;
    if (typeof A.value !== "string") B = fA.toDer(B).getBytes();
    return Q.value.push(fA.create(fA.Class.UNIVERSAL, fA.Type.OCTETSTRING, !1, B)), Q
  };
  eQ.certificationRequestToAsn1 = function(A) {
    var Q = A.certificationRequestInfo || eQ.getCertificationRequestInfo(A);
    return fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, [Q, fA.create(fA.Class.UNIVERSAL, fA.Type.SEQUENCE, !0, [fA.create(fA.Class.UNIVERSAL, fA.Type.OID, !1, fA.oidToDer(A.signatureOid).getBytes()), mA0(A.signatureOid, A.signatureParameters)]), fA.create(fA.Class.UNIVERSAL, fA.Type.BITSTRING, !1, String.fromCharCode(0) + A.signature)])
  };
  eQ.createCaStore = function(A) {
    var Q = {
      certs: {}
    };
    Q.getIssuer = function(Y) {
      var J = B(Y.issuer);
      return J
    }, Q.addCertificate = function(Y) {
      if (typeof Y === "string") Y = j9.pki.certificateFromPem(Y);
      if (G(Y.subject), !Q.hasCertificate(Y))
        if (Y.subject.hash in Q.certs) {
          var J = Q.certs[Y.subject.hash];
          if (!j9.util.isArray(J)) J = [J];
          J.push(Y), Q.certs[Y.subject.hash] = J
        } else Q.certs[Y.subject.hash] = Y
    }, Q.hasCertificate = function(Y) {
      if (typeof Y === "string") Y = j9.pki.certificateFromPem(Y);
      var J = B(Y.subject);
      if (!J) return !1;
      if (!j9.util.isArray(J)) J = [J];
      var W = fA.toDer(eQ.certificateToAsn1(Y)).getBytes();
      for (var X = 0; X < J.length; ++X) {
        var V = fA.toDer(eQ.certificateToAsn1(J[X])).getBytes();
        if (W === V) return !0
      }
      return !1
    }, Q.listAllCertificates = function() {
      var Y = [];
      for (var J in Q.certs)
        if (Q.certs.hasOwnProperty(J)) {
          var W = Q.certs[J];
          if (!j9.util.isArray(W)) Y.push(W);
          else
            for (var X = 0; X < W.length; ++X) Y.push(W[X])
        } return Y
    }, Q.removeCertificate = function(Y) {
      var J;
      if (typeof Y === "string") Y = j9.pki.certificateFromPem(Y);
      if (G(Y.subject), !Q.hasCertificate(Y)) return null;
      var W = B(Y.subject);
      if (!j9.util.isArray(W)) return J = Q.certs[Y.subject.hash], delete Q.certs[Y.subject.hash], J;
      var X = fA.toDer(eQ.certificateToAsn1(Y)).getBytes();
      for (var V = 0; V < W.length; ++V) {
        var F = fA.toDer(eQ.certificateToAsn1(W[V])).getBytes();
        if (X === F) J = W[V], W.splice(V, 1)
      }
      if (W.length === 0) delete Q.certs[Y.subject.hash];
      return J
    };

    function B(Y) {
      return G(Y), Q.certs[Y.hash] || null
    }

    function G(Y) {
      if (!Y.hash) {
        var J = j9.md.sha1.create();
        Y.attributes = eQ.RDNAttributesAsArray(aIA(Y), J), Y.hash = J.digest().toHex()
      }
    }
    if (A)
      for (var Z = 0; Z < A.length; ++Z) {
        var I = A[Z];
        Q.addCertificate(I)
      }
    return Q
  };
  eQ.certificateError = {
    bad_certificate: "forge.pki.BadCertificate",
    unsupported_certificate: "forge.pki.UnsupportedCertificate",
    certificate_revoked: "forge.pki.CertificateRevoked",
    certificate_expired: "forge.pki.CertificateExpired",
    certificate_unknown: "forge.pki.CertificateUnknown",
    unknown_ca: "forge.pki.UnknownCertificateAuthority"
  };
  eQ.verifyCertificateChain = function(A, Q, B) {
    if (typeof B === "function") B = {
      verify: B
    };
    B = B || {}, Q = Q.slice(0);
    var G = Q.slice(0),
      Z = B.validityCheckDate;
    if (typeof Z > "u") Z = new Date;
    var I = !0,
      Y = null,
      J = 0;
    do {
      var W = Q.shift(),
        X = null,
        V = !1;
      if (Z) {
        if (Z < W.validity.notBefore || Z > W.validity.notAfter) Y = {
          message: "Certificate is not valid yet or has expired.",
          error: eQ.certificateError.certificate_expired,
          notBefore: W.validity.notBefore,
          notAfter: W.validity.notAfter,
          now: Z
        }
      }
      if (Y === null) {
        if (X = Q[0] || A.getIssuer(W), X === null) {
          if (W.isIssuer(W)) V = !0, X = W
        }
        if (X) {
          var F = X;
          if (!j9.util.isArray(F)) F = [F];
          var K = !1;
          while (!K && F.length > 0) {
            X = F.shift();
            try {
              K = X.verify(W)
            } catch (R) {}
          }
          if (!K) Y = {
            message: "Certificate signature is invalid.",
            error: eQ.certificateError.bad_certificate
          }
        }
        if (Y === null && (!X || V) && !A.hasCertificate(W)) Y = {
          message: "Certificate is not trusted.",
          error: eQ.certificateError.unknown_ca
        }
      }
      if (Y === null && X && !W.isIssuer(X)) Y = {
        message: "Certificate issuer is invalid.",
        error: eQ.certificateError.bad_certificate
      };
      if (Y === null) {
        var D = {
          keyUsage: !0,
          basicConstraints: !0
        };
        for (var H = 0; Y === null && H < W.extensions.length; ++H) {
          var C = W.extensions[H];
          if (C.critical && !(C.name in D)) Y = {
            message: "Certificate has an unsupported critical extension.",
            error: eQ.certificateError.unsupported_certificate
          }
        }
      }
      if (Y === null && (!I || Q.length === 0 && (!X || V))) {
        var E = W.getExtension("basicConstraints"),
          U = W.getExtension("keyUsage");
        if (U !== null) {
          if (!U.keyCertSign || E === null) Y = {
            message: "Certificate keyUsage or basicConstraints conflict or indicate that the certificate is not a CA. If the certificate is the only one in the chain or isn't the first then the certificate must be a valid CA.",
            error: eQ.certificateError.bad_certificate
          }
        }
        if (Y === null && E !== null && !E.cA) Y = {
          message: "Certificate basicConstraints indicates the certificate is not a CA.",
          error: eQ.certificateError.bad_certificate
        };
        if (Y === null && U !== null && "pathLenConstraint" in E) {
          var q = J - 1;
          if (q > E.pathLenConstraint) Y = {
            message: "Certificate basicConstraints pathLenConstraint violated.",
            error: eQ.certificateError.bad_certificate
          }
        }
      }
      var w = Y === null ? !0 : Y.error,
        N = B.verify ? B.verify(w, J, G) : w;
      if (N === !0) Y = null;
      else {
        if (w === !0) Y = {
          message: "The application rejected the certificate.",
          error: eQ.certificateError.bad_certificate
        };
        if (N || N === 0) {
          if (typeof N === "object" && !j9.util.isArray(N)) {
            if (N.message) Y.message = N.message;
            if (N.error) Y.error = N.error
          } else if (typeof N === "string") Y.error = N
        }
        throw Y
      }
      I = !1, ++J
    } while (Q.length > 0);
    return !0
  }
})
// @from(Start 9341417, End 9358076)
cA0 = z((HjG, C52) => {
  var iZ = B6();
  GP();
  mIA();
  Ii();
  gA0();
  hA0();
  cM();
  nLA();
  lIA();
  x3();
  A21();
  var {
    asn1: R1,
    pki: I5
  } = iZ, sLA = C52.exports = iZ.pkcs12 = iZ.pkcs12 || {}, H52 = {
    name: "ContentInfo",
    tagClass: R1.Class.UNIVERSAL,
    type: R1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "ContentInfo.contentType",
      tagClass: R1.Class.UNIVERSAL,
      type: R1.Type.OID,
      constructed: !1,
      capture: "contentType"
    }, {
      name: "ContentInfo.content",
      tagClass: R1.Class.CONTEXT_SPECIFIC,
      constructed: !0,
      captureAsn1: "content"
    }]
  }, hZ5 = {
    name: "PFX",
    tagClass: R1.Class.UNIVERSAL,
    type: R1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "PFX.version",
      tagClass: R1.Class.UNIVERSAL,
      type: R1.Type.INTEGER,
      constructed: !1,
      capture: "version"
    }, H52, {
      name: "PFX.macData",
      tagClass: R1.Class.UNIVERSAL,
      type: R1.Type.SEQUENCE,
      constructed: !0,
      optional: !0,
      captureAsn1: "mac",
      value: [{
        name: "PFX.macData.mac",
        tagClass: R1.Class.UNIVERSAL,
        type: R1.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "PFX.macData.mac.digestAlgorithm",
          tagClass: R1.Class.UNIVERSAL,
          type: R1.Type.SEQUENCE,
          constructed: !0,
          value: [{
            name: "PFX.macData.mac.digestAlgorithm.algorithm",
            tagClass: R1.Class.UNIVERSAL,
            type: R1.Type.OID,
            constructed: !1,
            capture: "macAlgorithm"
          }, {
            name: "PFX.macData.mac.digestAlgorithm.parameters",
            tagClass: R1.Class.UNIVERSAL,
            captureAsn1: "macAlgorithmParameters"
          }]
        }, {
          name: "PFX.macData.mac.digest",
          tagClass: R1.Class.UNIVERSAL,
          type: R1.Type.OCTETSTRING,
          constructed: !1,
          capture: "macDigest"
        }]
      }, {
        name: "PFX.macData.macSalt",
        tagClass: R1.Class.UNIVERSAL,
        type: R1.Type.OCTETSTRING,
        constructed: !1,
        capture: "macSalt"
      }, {
        name: "PFX.macData.iterations",
        tagClass: R1.Class.UNIVERSAL,
        type: R1.Type.INTEGER,
        constructed: !1,
        optional: !0,
        capture: "macIterations"
      }]
    }]
  }, gZ5 = {
    name: "SafeBag",
    tagClass: R1.Class.UNIVERSAL,
    type: R1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "SafeBag.bagId",
      tagClass: R1.Class.UNIVERSAL,
      type: R1.Type.OID,
      constructed: !1,
      capture: "bagId"
    }, {
      name: "SafeBag.bagValue",
      tagClass: R1.Class.CONTEXT_SPECIFIC,
      constructed: !0,
      captureAsn1: "bagValue"
    }, {
      name: "SafeBag.bagAttributes",
      tagClass: R1.Class.UNIVERSAL,
      type: R1.Type.SET,
      constructed: !0,
      optional: !0,
      capture: "bagAttributes"
    }]
  }, uZ5 = {
    name: "Attribute",
    tagClass: R1.Class.UNIVERSAL,
    type: R1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "Attribute.attrId",
      tagClass: R1.Class.UNIVERSAL,
      type: R1.Type.OID,
      constructed: !1,
      capture: "oid"
    }, {
      name: "Attribute.attrValues",
      tagClass: R1.Class.UNIVERSAL,
      type: R1.Type.SET,
      constructed: !0,
      capture: "values"
    }]
  }, mZ5 = {
    name: "CertBag",
    tagClass: R1.Class.UNIVERSAL,
    type: R1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "CertBag.certId",
      tagClass: R1.Class.UNIVERSAL,
      type: R1.Type.OID,
      constructed: !1,
      capture: "certId"
    }, {
      name: "CertBag.certValue",
      tagClass: R1.Class.CONTEXT_SPECIFIC,
      constructed: !0,
      value: [{
        name: "CertBag.certValue[0]",
        tagClass: R1.Class.UNIVERSAL,
        type: R1.Class.OCTETSTRING,
        constructed: !1,
        capture: "cert"
      }]
    }]
  };

  function aLA(A, Q, B, G) {
    var Z = [];
    for (var I = 0; I < A.length; I++)
      for (var Y = 0; Y < A[I].safeBags.length; Y++) {
        var J = A[I].safeBags[Y];
        if (G !== void 0 && J.type !== G) continue;
        if (Q === null) {
          Z.push(J);
          continue
        }
        if (J.attributes[Q] !== void 0 && J.attributes[Q].indexOf(B) >= 0) Z.push(J)
      }
    return Z
  }
  sLA.pkcs12FromAsn1 = function(A, Q, B) {
    if (typeof Q === "string") B = Q, Q = !0;
    else if (Q === void 0) Q = !0;
    var G = {},
      Z = [];
    if (!R1.validate(A, hZ5, G, Z)) {
      var I = Error("Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.");
      throw I.errors = I, I
    }
    var Y = {
      version: G.version.charCodeAt(0),
      safeContents: [],
      getBags: function(E) {
        var U = {},
          q;
        if ("localKeyId" in E) q = E.localKeyId;
        else if ("localKeyIdHex" in E) q = iZ.util.hexToBytes(E.localKeyIdHex);
        if (q === void 0 && !("friendlyName" in E) && "bagType" in E) U[E.bagType] = aLA(Y.safeContents, null, null, E.bagType);
        if (q !== void 0) U.localKeyId = aLA(Y.safeContents, "localKeyId", q, E.bagType);
        if ("friendlyName" in E) U.friendlyName = aLA(Y.safeContents, "friendlyName", E.friendlyName, E.bagType);
        return U
      },
      getBagsByFriendlyName: function(E, U) {
        return aLA(Y.safeContents, "friendlyName", E, U)
      },
      getBagsByLocalKeyId: function(E, U) {
        return aLA(Y.safeContents, "localKeyId", E, U)
      }
    };
    if (G.version.charCodeAt(0) !== 3) {
      var I = Error("PKCS#12 PFX of version other than 3 not supported.");
      throw I.version = G.version.charCodeAt(0), I
    }
    if (R1.derToOid(G.contentType) !== I5.oids.data) {
      var I = Error("Only PKCS#12 PFX in password integrity mode supported.");
      throw I.oid = R1.derToOid(G.contentType), I
    }
    var J = G.content.value[0];
    if (J.tagClass !== R1.Class.UNIVERSAL || J.type !== R1.Type.OCTETSTRING) throw Error("PKCS#12 authSafe content data is not an OCTET STRING.");
    if (J = dA0(J), G.mac) {
      var W = null,
        X = 0,
        V = R1.derToOid(G.macAlgorithm);
      switch (V) {
        case I5.oids.sha1:
          W = iZ.md.sha1.create(), X = 20;
          break;
        case I5.oids.sha256:
          W = iZ.md.sha256.create(), X = 32;
          break;
        case I5.oids.sha384:
          W = iZ.md.sha384.create(), X = 48;
          break;
        case I5.oids.sha512:
          W = iZ.md.sha512.create(), X = 64;
          break;
        case I5.oids.md5:
          W = iZ.md.md5.create(), X = 16;
          break
      }
      if (W === null) throw Error("PKCS#12 uses unsupported MAC algorithm: " + V);
      var F = new iZ.util.ByteBuffer(G.macSalt),
        K = "macIterations" in G ? parseInt(iZ.util.bytesToHex(G.macIterations), 16) : 1,
        D = sLA.generateKey(B, F, 3, K, X, W),
        H = iZ.hmac.create();
      H.start(W, D), H.update(J.value);
      var C = H.getMac();
      if (C.getBytes() !== G.macDigest) throw Error("PKCS#12 MAC could not be verified. Invalid password?")
    }
    return dZ5(Y, J.value, Q, B), Y
  };

  function dA0(A) {
    if (A.composed || A.constructed) {
      var Q = iZ.util.createBuffer();
      for (var B = 0; B < A.value.length; ++B) Q.putBytes(A.value[B].value);
      A.composed = A.constructed = !1, A.value = Q.getBytes()
    }
    return A
  }

  function dZ5(A, Q, B, G) {
    if (Q = R1.fromDer(Q, B), Q.tagClass !== R1.Class.UNIVERSAL || Q.type !== R1.Type.SEQUENCE || Q.constructed !== !0) throw Error("PKCS#12 AuthenticatedSafe expected to be a SEQUENCE OF ContentInfo");
    for (var Z = 0; Z < Q.value.length; Z++) {
      var I = Q.value[Z],
        Y = {},
        J = [];
      if (!R1.validate(I, H52, Y, J)) {
        var W = Error("Cannot read ContentInfo.");
        throw W.errors = J, W
      }
      var X = {
          encrypted: !1
        },
        V = null,
        F = Y.content.value[0];
      switch (R1.derToOid(Y.contentType)) {
        case I5.oids.data:
          if (F.tagClass !== R1.Class.UNIVERSAL || F.type !== R1.Type.OCTETSTRING) throw Error("PKCS#12 SafeContents Data is not an OCTET STRING.");
          V = dA0(F).value;
          break;
        case I5.oids.encryptedData:
          V = cZ5(F, G), X.encrypted = !0;
          break;
        default:
          var W = Error("Unsupported PKCS#12 contentType.");
          throw W.contentType = R1.derToOid(Y.contentType), W
      }
      X.safeBags = pZ5(V, B, G), A.safeContents.push(X)
    }
  }

  function cZ5(A, Q) {
    var B = {},
      G = [];
    if (!R1.validate(A, iZ.pkcs7.asn1.encryptedDataValidator, B, G)) {
      var Z = Error("Cannot read EncryptedContentInfo.");
      throw Z.errors = G, Z
    }
    var I = R1.derToOid(B.contentType);
    if (I !== I5.oids.data) {
      var Z = Error("PKCS#12 EncryptedContentInfo ContentType is not Data.");
      throw Z.oid = I, Z
    }
    I = R1.derToOid(B.encAlgorithm);
    var Y = I5.pbe.getCipher(I, B.encParameter, Q),
      J = dA0(B.encryptedContentAsn1),
      W = iZ.util.createBuffer(J.value);
    if (Y.update(W), !Y.finish()) throw Error("Failed to decrypt PKCS#12 SafeContents.");
    return Y.output.getBytes()
  }

  function pZ5(A, Q, B) {
    if (!Q && A.length === 0) return [];
    if (A = R1.fromDer(A, Q), A.tagClass !== R1.Class.UNIVERSAL || A.type !== R1.Type.SEQUENCE || A.constructed !== !0) throw Error("PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag.");
    var G = [];
    for (var Z = 0; Z < A.value.length; Z++) {
      var I = A.value[Z],
        Y = {},
        J = [];
      if (!R1.validate(I, gZ5, Y, J)) {
        var W = Error("Cannot read SafeBag.");
        throw W.errors = J, W
      }
      var X = {
        type: R1.derToOid(Y.bagId),
        attributes: lZ5(Y.bagAttributes)
      };
      G.push(X);
      var V, F, K = Y.bagValue.value[0];
      switch (X.type) {
        case I5.oids.pkcs8ShroudedKeyBag:
          if (K = I5.decryptPrivateKeyInfo(K, B), K === null) throw Error("Unable to decrypt PKCS#8 ShroudedKeyBag, wrong password?");
        case I5.oids.keyBag:
          try {
            X.key = I5.privateKeyFromAsn1(K)
          } catch (H) {
            X.key = null, X.asn1 = K
          }
          continue;
        case I5.oids.certBag:
          V = mZ5, F = function() {
            if (R1.derToOid(Y.certId) !== I5.oids.x509Certificate) {
              var H = Error("Unsupported certificate type, only X.509 supported.");
              throw H.oid = R1.derToOid(Y.certId), H
            }
            var C = R1.fromDer(Y.cert, Q);
            try {
              X.cert = I5.certificateFromAsn1(C, !0)
            } catch (E) {
              X.cert = null, X.asn1 = C
            }
          };
          break;
        default:
          var W = Error("Unsupported PKCS#12 SafeBag type.");
          throw W.oid = X.type, W
      }
      if (V !== void 0 && !R1.validate(K, V, Y, J)) {
        var W = Error("Cannot read PKCS#12 " + V.name);
        throw W.errors = J, W
      }
      F()
    }
    return G
  }

  function lZ5(A) {
    var Q = {};
    if (A !== void 0)
      for (var B = 0; B < A.length; ++B) {
        var G = {},
          Z = [];
        if (!R1.validate(A[B], uZ5, G, Z)) {
          var I = Error("Cannot read PKCS#12 BagAttribute.");
          throw I.errors = Z, I
        }
        var Y = R1.derToOid(G.oid);
        if (I5.oids[Y] === void 0) continue;
        Q[I5.oids[Y]] = [];
        for (var J = 0; J < G.values.length; ++J) Q[I5.oids[Y]].push(G.values[J].value)
      }
    return Q
  }
  sLA.toPkcs12Asn1 = function(A, Q, B, G) {
    if (G = G || {}, G.saltSize = G.saltSize || 8, G.count = G.count || 2048, G.algorithm = G.algorithm || G.encAlgorithm || "aes128", !("useMac" in G)) G.useMac = !0;
    if (!("localKeyId" in G)) G.localKeyId = null;
    if (!("generateLocalKeyId" in G)) G.generateLocalKeyId = !0;
    var Z = G.localKeyId,
      I;
    if (Z !== null) Z = iZ.util.hexToBytes(Z);
    else if (G.generateLocalKeyId)
      if (Q) {
        var Y = iZ.util.isArray(Q) ? Q[0] : Q;
        if (typeof Y === "string") Y = I5.certificateFromPem(Y);
        var J = iZ.md.sha1.create();
        J.update(R1.toDer(I5.certificateToAsn1(Y)).getBytes()), Z = J.digest().getBytes()
      } else Z = iZ.random.getBytes(20);
    var W = [];
    if (Z !== null) W.push(R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.OID, !1, R1.oidToDer(I5.oids.localKeyId).getBytes()), R1.create(R1.Class.UNIVERSAL, R1.Type.SET, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.OCTETSTRING, !1, Z)])]));
    if ("friendlyName" in G) W.push(R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.OID, !1, R1.oidToDer(I5.oids.friendlyName).getBytes()), R1.create(R1.Class.UNIVERSAL, R1.Type.SET, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.BMPSTRING, !1, G.friendlyName)])]));
    if (W.length > 0) I = R1.create(R1.Class.UNIVERSAL, R1.Type.SET, !0, W);
    var X = [],
      V = [];
    if (Q !== null)
      if (iZ.util.isArray(Q)) V = Q;
      else V = [Q];
    var F = [];
    for (var K = 0; K < V.length; ++K) {
      if (Q = V[K], typeof Q === "string") Q = I5.certificateFromPem(Q);
      var D = K === 0 ? I : void 0,
        H = I5.certificateToAsn1(Q),
        C = R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.OID, !1, R1.oidToDer(I5.oids.certBag).getBytes()), R1.create(R1.Class.CONTEXT_SPECIFIC, 0, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.OID, !1, R1.oidToDer(I5.oids.x509Certificate).getBytes()), R1.create(R1.Class.CONTEXT_SPECIFIC, 0, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.OCTETSTRING, !1, R1.toDer(H).getBytes())])])]), D]);
      F.push(C)
    }
    if (F.length > 0) {
      var E = R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, F),
        U = R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.OID, !1, R1.oidToDer(I5.oids.data).getBytes()), R1.create(R1.Class.CONTEXT_SPECIFIC, 0, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.OCTETSTRING, !1, R1.toDer(E).getBytes())])]);
      X.push(U)
    }
    var q = null;
    if (A !== null) {
      var w = I5.wrapRsaPrivateKey(I5.privateKeyToAsn1(A));
      if (B === null) q = R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.OID, !1, R1.oidToDer(I5.oids.keyBag).getBytes()), R1.create(R1.Class.CONTEXT_SPECIFIC, 0, !0, [w]), I]);
      else q = R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.OID, !1, R1.oidToDer(I5.oids.pkcs8ShroudedKeyBag).getBytes()), R1.create(R1.Class.CONTEXT_SPECIFIC, 0, !0, [I5.encryptPrivateKeyInfo(w, B, G)]), I]);
      var N = R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, [q]),
        R = R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.OID, !1, R1.oidToDer(I5.oids.data).getBytes()), R1.create(R1.Class.CONTEXT_SPECIFIC, 0, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.OCTETSTRING, !1, R1.toDer(N).getBytes())])]);
      X.push(R)
    }
    var T = R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, X),
      y;
    if (G.useMac) {
      var J = iZ.md.sha1.create(),
        v = new iZ.util.ByteBuffer(iZ.random.getBytes(G.saltSize)),
        x = G.count,
        A = sLA.generateKey(B, v, 3, x, 20),
        p = iZ.hmac.create();
      p.start(J, A), p.update(R1.toDer(T).getBytes());
      var u = p.getMac();
      y = R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.OID, !1, R1.oidToDer(I5.oids.sha1).getBytes()), R1.create(R1.Class.UNIVERSAL, R1.Type.NULL, !1, "")]), R1.create(R1.Class.UNIVERSAL, R1.Type.OCTETSTRING, !1, u.getBytes())]), R1.create(R1.Class.UNIVERSAL, R1.Type.OCTETSTRING, !1, v.getBytes()), R1.create(R1.Class.UNIVERSAL, R1.Type.INTEGER, !1, R1.integerToDer(x).getBytes())])
    }
    return R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.INTEGER, !1, R1.integerToDer(3).getBytes()), R1.create(R1.Class.UNIVERSAL, R1.Type.SEQUENCE, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.OID, !1, R1.oidToDer(I5.oids.data).getBytes()), R1.create(R1.Class.CONTEXT_SPECIFIC, 0, !0, [R1.create(R1.Class.UNIVERSAL, R1.Type.OCTETSTRING, !1, R1.toDer(T).getBytes())])]), y])
  };
  sLA.generateKey = iZ.pbe.generatePkcs12Key
})
// @from(Start 9358082, End 9359416)
lA0 = z((CjG, E52) => {
  var Xi = B6();
  GP();
  Ii();
  hA0();
  B1A();
  pB1();
  cA0();
  oB1();
  nLA();
  x3();
  A21();
  var pA0 = Xi.asn1,
    sIA = E52.exports = Xi.pki = Xi.pki || {};
  sIA.pemToDer = function(A) {
    var Q = Xi.pem.decode(A)[0];
    if (Q.procType && Q.procType.type === "ENCRYPTED") throw Error("Could not convert PEM to DER; PEM is encrypted.");
    return Xi.util.createBuffer(Q.body)
  };
  sIA.privateKeyFromPem = function(A) {
    var Q = Xi.pem.decode(A)[0];
    if (Q.type !== "PRIVATE KEY" && Q.type !== "RSA PRIVATE KEY") {
      var B = Error('Could not convert private key from PEM; PEM header type is not "PRIVATE KEY" or "RSA PRIVATE KEY".');
      throw B.headerType = Q.type, B
    }
    if (Q.procType && Q.procType.type === "ENCRYPTED") throw Error("Could not convert private key from PEM; PEM is encrypted.");
    var G = pA0.fromDer(Q.body);
    return sIA.privateKeyFromAsn1(G)
  };
  sIA.privateKeyToPem = function(A, Q) {
    var B = {
      type: "RSA PRIVATE KEY",
      body: pA0.toDer(sIA.privateKeyToAsn1(A)).getBytes()
    };
    return Xi.pem.encode(B, {
      maxline: Q
    })
  };
  sIA.privateKeyInfoToPem = function(A, Q) {
    var B = {
      type: "PRIVATE KEY",
      body: pA0.toDer(A).getBytes()
    };
    return Xi.pem.encode(B, {
      maxline: Q
    })
  }
})