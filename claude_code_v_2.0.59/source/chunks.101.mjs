
// @from(Start 9450543, End 9470526)
Q32 = z((MjG, A32) => {
  var UB = B6();
  Zi();
  GP();
  pLA();
  Ii();
  B1A();
  gA0();
  cM();
  x3();
  A21();
  var x1 = UB.asn1,
    yE = A32.exports = UB.pkcs7 = UB.pkcs7 || {};
  yE.messageFromPem = function(A) {
    var Q = UB.pem.decode(A)[0];
    if (Q.type !== "PKCS7") {
      var B = Error('Could not convert PKCS#7 message from PEM; PEM header type is not "PKCS#7".');
      throw B.headerType = Q.type, B
    }
    if (Q.procType && Q.procType.type === "ENCRYPTED") throw Error("Could not convert PKCS#7 message from PEM; PEM is encrypted.");
    var G = x1.fromDer(Q.body);
    return yE.messageFromAsn1(G)
  };
  yE.messageToPem = function(A, Q) {
    var B = {
      type: "PKCS7",
      body: x1.toDer(A.toAsn1()).getBytes()
    };
    return UB.pem.encode(B, {
      maxline: Q
    })
  };
  yE.messageFromAsn1 = function(A) {
    var Q = {},
      B = [];
    if (!x1.validate(A, yE.asn1.contentInfoValidator, Q, B)) {
      var G = Error("Cannot read PKCS#7 message. ASN.1 object is not an PKCS#7 ContentInfo.");
      throw G.errors = B, G
    }
    var Z = x1.derToOid(Q.contentType),
      I;
    switch (Z) {
      case UB.pki.oids.envelopedData:
        I = yE.createEnvelopedData();
        break;
      case UB.pki.oids.encryptedData:
        I = yE.createEncryptedData();
        break;
      case UB.pki.oids.signedData:
        I = yE.createSignedData();
        break;
      default:
        throw Error("Cannot read PKCS#7 message. ContentType with OID " + Z + " is not (yet) supported.")
    }
    return I.fromAsn1(Q.content.value[0]), I
  };
  yE.createSignedData = function() {
    var A = null;
    return A = {
      type: UB.pki.oids.signedData,
      version: 1,
      certificates: [],
      crls: [],
      signers: [],
      digestAlgorithmIdentifiers: [],
      contentInfo: null,
      signerInfos: [],
      fromAsn1: function(G) {
        if (H10(A, G, yE.asn1.signedDataValidator), A.certificates = [], A.crls = [], A.digestAlgorithmIdentifiers = [], A.contentInfo = null, A.signerInfos = [], A.rawCapture.certificates) {
          var Z = A.rawCapture.certificates.value;
          for (var I = 0; I < Z.length; ++I) A.certificates.push(UB.pki.certificateFromAsn1(Z[I]))
        }
      },
      toAsn1: function() {
        if (!A.contentInfo) A.sign();
        var G = [];
        for (var Z = 0; Z < A.certificates.length; ++Z) G.push(UB.pki.certificateToAsn1(A.certificates[Z]));
        var I = [],
          Y = x1.create(x1.Class.CONTEXT_SPECIFIC, 0, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.INTEGER, !1, x1.integerToDer(A.version).getBytes()), x1.create(x1.Class.UNIVERSAL, x1.Type.SET, !0, A.digestAlgorithmIdentifiers), A.contentInfo])]);
        if (G.length > 0) Y.value[0].value.push(x1.create(x1.Class.CONTEXT_SPECIFIC, 0, !0, G));
        if (I.length > 0) Y.value[0].value.push(x1.create(x1.Class.CONTEXT_SPECIFIC, 1, !0, I));
        return Y.value[0].value.push(x1.create(x1.Class.UNIVERSAL, x1.Type.SET, !0, A.signerInfos)), x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.OID, !1, x1.oidToDer(A.type).getBytes()), Y])
      },
      addSigner: function(G) {
        var {
          issuer: Z,
          serialNumber: I
        } = G;
        if (G.certificate) {
          var Y = G.certificate;
          if (typeof Y === "string") Y = UB.pki.certificateFromPem(Y);
          Z = Y.issuer.attributes, I = Y.serialNumber
        }
        var J = G.key;
        if (!J) throw Error("Could not add PKCS#7 signer; no private key specified.");
        if (typeof J === "string") J = UB.pki.privateKeyFromPem(J);
        var W = G.digestAlgorithm || UB.pki.oids.sha1;
        switch (W) {
          case UB.pki.oids.sha1:
          case UB.pki.oids.sha256:
          case UB.pki.oids.sha384:
          case UB.pki.oids.sha512:
          case UB.pki.oids.md5:
            break;
          default:
            throw Error("Could not add PKCS#7 signer; unknown message digest algorithm: " + W)
        }
        var X = G.authenticatedAttributes || [];
        if (X.length > 0) {
          var V = !1,
            F = !1;
          for (var K = 0; K < X.length; ++K) {
            var D = X[K];
            if (!V && D.type === UB.pki.oids.contentType) {
              if (V = !0, F) break;
              continue
            }
            if (!F && D.type === UB.pki.oids.messageDigest) {
              if (F = !0, V) break;
              continue
            }
          }
          if (!V || !F) throw Error("Invalid signer.authenticatedAttributes. If signer.authenticatedAttributes is specified, then it must contain at least two attributes, PKCS #9 content-type and PKCS #9 message-digest.")
        }
        A.signers.push({
          key: J,
          version: 1,
          issuer: Z,
          serialNumber: I,
          digestAlgorithm: W,
          signatureAlgorithm: UB.pki.oids.rsaEncryption,
          signature: null,
          authenticatedAttributes: X,
          unauthenticatedAttributes: []
        })
      },
      sign: function(G) {
        if (G = G || {}, typeof A.content !== "object" || A.contentInfo === null) {
          if (A.contentInfo = x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.OID, !1, x1.oidToDer(UB.pki.oids.data).getBytes())]), "content" in A) {
            var Z;
            if (A.content instanceof UB.util.ByteBuffer) Z = A.content.bytes();
            else if (typeof A.content === "string") Z = UB.util.encodeUtf8(A.content);
            if (G.detached) A.detachedContent = x1.create(x1.Class.UNIVERSAL, x1.Type.OCTETSTRING, !1, Z);
            else A.contentInfo.value.push(x1.create(x1.Class.CONTEXT_SPECIFIC, 0, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.OCTETSTRING, !1, Z)]))
          }
        }
        if (A.signers.length === 0) return;
        var I = Q();
        B(I)
      },
      verify: function() {
        throw Error("PKCS#7 signature verification not yet implemented.")
      },
      addCertificate: function(G) {
        if (typeof G === "string") G = UB.pki.certificateFromPem(G);
        A.certificates.push(G)
      },
      addCertificateRevokationList: function(G) {
        throw Error("PKCS#7 CRL support not yet implemented.")
      }
    }, A;

    function Q() {
      var G = {};
      for (var Z = 0; Z < A.signers.length; ++Z) {
        var I = A.signers[Z],
          Y = I.digestAlgorithm;
        if (!(Y in G)) G[Y] = UB.md[UB.pki.oids[Y]].create();
        if (I.authenticatedAttributes.length === 0) I.md = G[Y];
        else I.md = UB.md[UB.pki.oids[Y]].create()
      }
      A.digestAlgorithmIdentifiers = [];
      for (var Y in G) A.digestAlgorithmIdentifiers.push(x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.OID, !1, x1.oidToDer(Y).getBytes()), x1.create(x1.Class.UNIVERSAL, x1.Type.NULL, !1, "")]));
      return G
    }

    function B(G) {
      var Z;
      if (A.detachedContent) Z = A.detachedContent;
      else Z = A.contentInfo.value[1], Z = Z.value[0];
      if (!Z) throw Error("Could not sign PKCS#7 message; there is no content to sign.");
      var I = x1.derToOid(A.contentInfo.value[0].value),
        Y = x1.toDer(Z);
      Y.getByte(), x1.getBerValueLength(Y), Y = Y.getBytes();
      for (var J in G) G[J].start().update(Y);
      var W = new Date;
      for (var X = 0; X < A.signers.length; ++X) {
        var V = A.signers[X];
        if (V.authenticatedAttributes.length === 0) {
          if (I !== UB.pki.oids.data) throw Error("Invalid signer; authenticatedAttributes must be present when the ContentInfo content type is not PKCS#7 Data.")
        } else {
          V.authenticatedAttributesAsn1 = x1.create(x1.Class.CONTEXT_SPECIFIC, 0, !0, []);
          var F = x1.create(x1.Class.UNIVERSAL, x1.Type.SET, !0, []);
          for (var K = 0; K < V.authenticatedAttributes.length; ++K) {
            var D = V.authenticatedAttributes[K];
            if (D.type === UB.pki.oids.messageDigest) D.value = G[V.digestAlgorithm].digest();
            else if (D.type === UB.pki.oids.signingTime) {
              if (!D.value) D.value = W
            }
            F.value.push(D10(D)), V.authenticatedAttributesAsn1.value.push(D10(D))
          }
          Y = x1.toDer(F).getBytes(), V.md.start().update(Y)
        }
        V.signature = V.key.sign(V.md, "RSASSA-PKCS1-V1_5")
      }
      A.signerInfos = uI5(A.signers)
    }
  };
  yE.createEncryptedData = function() {
    var A = null;
    return A = {
      type: UB.pki.oids.encryptedData,
      version: 0,
      encryptedContent: {
        algorithm: UB.pki.oids["aes256-CBC"]
      },
      fromAsn1: function(Q) {
        H10(A, Q, yE.asn1.encryptedDataValidator)
      },
      decrypt: function(Q) {
        if (Q !== void 0) A.encryptedContent.key = Q;
        e52(A)
      }
    }, A
  };
  yE.createEnvelopedData = function() {
    var A = null;
    return A = {
      type: UB.pki.oids.envelopedData,
      version: 0,
      recipients: [],
      encryptedContent: {
        algorithm: UB.pki.oids["aes256-CBC"]
      },
      fromAsn1: function(Q) {
        var B = H10(A, Q, yE.asn1.envelopedDataValidator);
        A.recipients = fI5(B.recipientInfos.value)
      },
      toAsn1: function() {
        return x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.OID, !1, x1.oidToDer(A.type).getBytes()), x1.create(x1.Class.CONTEXT_SPECIFIC, 0, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.INTEGER, !1, x1.integerToDer(A.version).getBytes()), x1.create(x1.Class.UNIVERSAL, x1.Type.SET, !0, hI5(A.recipients)), x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, mI5(A.encryptedContent))])])])
      },
      findRecipient: function(Q) {
        var B = Q.issuer.attributes;
        for (var G = 0; G < A.recipients.length; ++G) {
          var Z = A.recipients[G],
            I = Z.issuer;
          if (Z.serialNumber !== Q.serialNumber) continue;
          if (I.length !== B.length) continue;
          var Y = !0;
          for (var J = 0; J < B.length; ++J)
            if (I[J].type !== B[J].type || I[J].value !== B[J].value) {
              Y = !1;
              break
            } if (Y) return Z
        }
        return null
      },
      decrypt: function(Q, B) {
        if (A.encryptedContent.key === void 0 && Q !== void 0 && B !== void 0) switch (Q.encryptedContent.algorithm) {
          case UB.pki.oids.rsaEncryption:
          case UB.pki.oids.desCBC:
            var G = B.decrypt(Q.encryptedContent.content);
            A.encryptedContent.key = UB.util.createBuffer(G);
            break;
          default:
            throw Error("Unsupported asymmetric cipher, OID " + Q.encryptedContent.algorithm)
        }
        e52(A)
      },
      addRecipient: function(Q) {
        A.recipients.push({
          version: 0,
          issuer: Q.issuer.attributes,
          serialNumber: Q.serialNumber,
          encryptedContent: {
            algorithm: UB.pki.oids.rsaEncryption,
            key: Q.publicKey
          }
        })
      },
      encrypt: function(Q, B) {
        if (A.encryptedContent.content === void 0) {
          B = B || A.encryptedContent.algorithm, Q = Q || A.encryptedContent.key;
          var G, Z, I;
          switch (B) {
            case UB.pki.oids["aes128-CBC"]:
              G = 16, Z = 16, I = UB.aes.createEncryptionCipher;
              break;
            case UB.pki.oids["aes192-CBC"]:
              G = 24, Z = 16, I = UB.aes.createEncryptionCipher;
              break;
            case UB.pki.oids["aes256-CBC"]:
              G = 32, Z = 16, I = UB.aes.createEncryptionCipher;
              break;
            case UB.pki.oids["des-EDE3-CBC"]:
              G = 24, Z = 8, I = UB.des.createEncryptionCipher;
              break;
            default:
              throw Error("Unsupported symmetric cipher, OID " + B)
          }
          if (Q === void 0) Q = UB.util.createBuffer(UB.random.getBytes(G));
          else if (Q.length() != G) throw Error("Symmetric key has wrong length; got " + Q.length() + " bytes, expected " + G + ".");
          A.encryptedContent.algorithm = B, A.encryptedContent.key = Q, A.encryptedContent.parameter = UB.util.createBuffer(UB.random.getBytes(Z));
          var Y = I(Q);
          if (Y.start(A.encryptedContent.parameter.copy()), Y.update(A.content), !Y.finish()) throw Error("Symmetric encryption failed.");
          A.encryptedContent.content = Y.output
        }
        for (var J = 0; J < A.recipients.length; ++J) {
          var W = A.recipients[J];
          if (W.encryptedContent.content !== void 0) continue;
          switch (W.encryptedContent.algorithm) {
            case UB.pki.oids.rsaEncryption:
              W.encryptedContent.content = W.encryptedContent.key.encrypt(A.encryptedContent.key.data);
              break;
            default:
              throw Error("Unsupported asymmetric cipher, OID " + W.encryptedContent.algorithm)
          }
        }
      }
    }, A
  };

  function vI5(A) {
    var Q = {},
      B = [];
    if (!x1.validate(A, yE.asn1.recipientInfoValidator, Q, B)) {
      var G = Error("Cannot read PKCS#7 RecipientInfo. ASN.1 object is not an PKCS#7 RecipientInfo.");
      throw G.errors = B, G
    }
    return {
      version: Q.version.charCodeAt(0),
      issuer: UB.pki.RDNAttributesAsArray(Q.issuer),
      serialNumber: UB.util.createBuffer(Q.serial).toHex(),
      encryptedContent: {
        algorithm: x1.derToOid(Q.encAlgorithm),
        parameter: Q.encParameter ? Q.encParameter.value : void 0,
        content: Q.encKey
      }
    }
  }

  function bI5(A) {
    return x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.INTEGER, !1, x1.integerToDer(A.version).getBytes()), x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, [UB.pki.distinguishedNameToAsn1({
      attributes: A.issuer
    }), x1.create(x1.Class.UNIVERSAL, x1.Type.INTEGER, !1, UB.util.hexToBytes(A.serialNumber))]), x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.OID, !1, x1.oidToDer(A.encryptedContent.algorithm).getBytes()), x1.create(x1.Class.UNIVERSAL, x1.Type.NULL, !1, "")]), x1.create(x1.Class.UNIVERSAL, x1.Type.OCTETSTRING, !1, A.encryptedContent.content)])
  }

  function fI5(A) {
    var Q = [];
    for (var B = 0; B < A.length; ++B) Q.push(vI5(A[B]));
    return Q
  }

  function hI5(A) {
    var Q = [];
    for (var B = 0; B < A.length; ++B) Q.push(bI5(A[B]));
    return Q
  }

  function gI5(A) {
    var Q = x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.INTEGER, !1, x1.integerToDer(A.version).getBytes()), x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, [UB.pki.distinguishedNameToAsn1({
      attributes: A.issuer
    }), x1.create(x1.Class.UNIVERSAL, x1.Type.INTEGER, !1, UB.util.hexToBytes(A.serialNumber))]), x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.OID, !1, x1.oidToDer(A.digestAlgorithm).getBytes()), x1.create(x1.Class.UNIVERSAL, x1.Type.NULL, !1, "")])]);
    if (A.authenticatedAttributesAsn1) Q.value.push(A.authenticatedAttributesAsn1);
    if (Q.value.push(x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.OID, !1, x1.oidToDer(A.signatureAlgorithm).getBytes()), x1.create(x1.Class.UNIVERSAL, x1.Type.NULL, !1, "")])), Q.value.push(x1.create(x1.Class.UNIVERSAL, x1.Type.OCTETSTRING, !1, A.signature)), A.unauthenticatedAttributes.length > 0) {
      var B = x1.create(x1.Class.CONTEXT_SPECIFIC, 1, !0, []);
      for (var G = 0; G < A.unauthenticatedAttributes.length; ++G) {
        var Z = A.unauthenticatedAttributes[G];
        B.values.push(D10(Z))
      }
      Q.value.push(B)
    }
    return Q
  }

  function uI5(A) {
    var Q = [];
    for (var B = 0; B < A.length; ++B) Q.push(gI5(A[B]));
    return Q
  }

  function D10(A) {
    var Q;
    if (A.type === UB.pki.oids.contentType) Q = x1.create(x1.Class.UNIVERSAL, x1.Type.OID, !1, x1.oidToDer(A.value).getBytes());
    else if (A.type === UB.pki.oids.messageDigest) Q = x1.create(x1.Class.UNIVERSAL, x1.Type.OCTETSTRING, !1, A.value.bytes());
    else if (A.type === UB.pki.oids.signingTime) {
      var B = new Date("1950-01-01T00:00:00Z"),
        G = new Date("2050-01-01T00:00:00Z"),
        Z = A.value;
      if (typeof Z === "string") {
        var I = Date.parse(Z);
        if (!isNaN(I)) Z = new Date(I);
        else if (Z.length === 13) Z = x1.utcTimeToDate(Z);
        else Z = x1.generalizedTimeToDate(Z)
      }
      if (Z >= B && Z < G) Q = x1.create(x1.Class.UNIVERSAL, x1.Type.UTCTIME, !1, x1.dateToUtcTime(Z));
      else Q = x1.create(x1.Class.UNIVERSAL, x1.Type.GENERALIZEDTIME, !1, x1.dateToGeneralizedTime(Z))
    }
    return x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.OID, !1, x1.oidToDer(A.type).getBytes()), x1.create(x1.Class.UNIVERSAL, x1.Type.SET, !0, [Q])])
  }

  function mI5(A) {
    return [x1.create(x1.Class.UNIVERSAL, x1.Type.OID, !1, x1.oidToDer(UB.pki.oids.data).getBytes()), x1.create(x1.Class.UNIVERSAL, x1.Type.SEQUENCE, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.OID, !1, x1.oidToDer(A.algorithm).getBytes()), !A.parameter ? void 0 : x1.create(x1.Class.UNIVERSAL, x1.Type.OCTETSTRING, !1, A.parameter.getBytes())]), x1.create(x1.Class.CONTEXT_SPECIFIC, 0, !0, [x1.create(x1.Class.UNIVERSAL, x1.Type.OCTETSTRING, !1, A.content.getBytes())])]
  }

  function H10(A, Q, B) {
    var G = {},
      Z = [];
    if (!x1.validate(Q, B, G, Z)) {
      var I = Error("Cannot read PKCS#7 message. ASN.1 object is not a supported PKCS#7 message.");
      throw I.errors = I, I
    }
    var Y = x1.derToOid(G.contentType);
    if (Y !== UB.pki.oids.data) throw Error("Unsupported PKCS#7 message. Only wrapped ContentType Data supported.");
    if (G.encryptedContent) {
      var J = "";
      if (UB.util.isArray(G.encryptedContent))
        for (var W = 0; W < G.encryptedContent.length; ++W) {
          if (G.encryptedContent[W].type !== x1.Type.OCTETSTRING) throw Error("Malformed PKCS#7 message, expecting encrypted content constructed of only OCTET STRING objects.");
          J += G.encryptedContent[W].value
        } else J = G.encryptedContent;
      A.encryptedContent = {
        algorithm: x1.derToOid(G.encAlgorithm),
        parameter: UB.util.createBuffer(G.encParameter.value),
        content: UB.util.createBuffer(J)
      }
    }
    if (G.content) {
      var J = "";
      if (UB.util.isArray(G.content))
        for (var W = 0; W < G.content.length; ++W) {
          if (G.content[W].type !== x1.Type.OCTETSTRING) throw Error("Malformed PKCS#7 message, expecting content constructed of only OCTET STRING objects.");
          J += G.content[W].value
        } else J = G.content;
      A.content = UB.util.createBuffer(J)
    }
    return A.version = G.version.charCodeAt(0), A.rawCapture = G, G
  }

  function e52(A) {
    if (A.encryptedContent.key === void 0) throw Error("Symmetric key not available.");
    if (A.content === void 0) {
      var Q;
      switch (A.encryptedContent.algorithm) {
        case UB.pki.oids["aes128-CBC"]:
        case UB.pki.oids["aes192-CBC"]:
        case UB.pki.oids["aes256-CBC"]:
          Q = UB.aes.createDecryptionCipher(A.encryptedContent.key);
          break;
        case UB.pki.oids.desCBC:
        case UB.pki.oids["des-EDE3-CBC"]:
          Q = UB.des.createDecryptionCipher(A.encryptedContent.key);
          break;
        default:
          throw Error("Unsupported symmetric cipher, OID " + A.encryptedContent.algorithm)
      }
      if (Q.start(A.encryptedContent.parameter), Q.update(A.encryptedContent.content), !Q.finish()) throw Error("Symmetric decryption failed.");
      A.content = Q.output
    }
  }
})
// @from(Start 9470532, End 9473615)
G32 = z((OjG, B32) => {
  var aX = B6();
  Zi();
  mIA();
  uB1();
  lIA();
  x3();
  var V21 = B32.exports = aX.ssh = aX.ssh || {};
  V21.privateKeyToPutty = function(A, Q, B) {
    B = B || "", Q = Q || "";
    var G = "ssh-rsa",
      Z = Q === "" ? "none" : "aes256-cbc",
      I = "PuTTY-User-Key-File-2: " + G + `\r
`;
    I += "Encryption: " + Z + `\r
`, I += "Comment: " + B + `\r
`;
    var Y = aX.util.createBuffer();
    AYA(Y, G), bk(Y, A.e), bk(Y, A.n);
    var J = aX.util.encode64(Y.bytes(), 64),
      W = Math.floor(J.length / 66) + 1;
    I += "Public-Lines: " + W + `\r
`, I += J;
    var X = aX.util.createBuffer();
    bk(X, A.d), bk(X, A.p), bk(X, A.q), bk(X, A.qInv);
    var V;
    if (!Q) V = aX.util.encode64(X.bytes(), 64);
    else {
      var F = X.length() + 16 - 1;
      F -= F % 16;
      var K = X21(X.bytes());
      K.truncate(K.length() - F + X.length()), X.putBuffer(K);
      var D = aX.util.createBuffer();
      D.putBuffer(X21("\x00\x00\x00\x00", Q)), D.putBuffer(X21("\x00\x00\x00\x01", Q));
      var H = aX.aes.createEncryptionCipher(D.truncate(8), "CBC");
      H.start(aX.util.createBuffer().fillWithByte(0, 16)), H.update(X.copy()), H.finish();
      var C = H.output;
      C.truncate(16), V = aX.util.encode64(C.bytes(), 64)
    }
    W = Math.floor(V.length / 66) + 1, I += `\r
Private-Lines: ` + W + `\r
`, I += V;
    var E = X21("putty-private-key-file-mac-key", Q),
      U = aX.util.createBuffer();
    AYA(U, G), AYA(U, Z), AYA(U, B), U.putInt32(Y.length()), U.putBuffer(Y), U.putInt32(X.length()), U.putBuffer(X);
    var q = aX.hmac.create();
    return q.start("sha1", E), q.update(U.bytes()), I += `\r
Private-MAC: ` + q.digest().toHex() + `\r
`, I
  };
  V21.publicKeyToOpenSSH = function(A, Q) {
    var B = "ssh-rsa";
    Q = Q || "";
    var G = aX.util.createBuffer();
    return AYA(G, B), bk(G, A.e), bk(G, A.n), B + " " + aX.util.encode64(G.bytes()) + " " + Q
  };
  V21.privateKeyToOpenSSH = function(A, Q) {
    if (!Q) return aX.pki.privateKeyToPem(A);
    return aX.pki.encryptRsaPrivateKey(A, Q, {
      legacy: !0,
      algorithm: "aes128"
    })
  };
  V21.getPublicKeyFingerprint = function(A, Q) {
    Q = Q || {};
    var B = Q.md || aX.md.md5.create(),
      G = "ssh-rsa",
      Z = aX.util.createBuffer();
    AYA(Z, G), bk(Z, A.e), bk(Z, A.n), B.start(), B.update(Z.getBytes());
    var I = B.digest();
    if (Q.encoding === "hex") {
      var Y = I.toHex();
      if (Q.delimiter) return Y.match(/.{2}/g).join(Q.delimiter);
      return Y
    } else if (Q.encoding === "binary") return I.getBytes();
    else if (Q.encoding) throw Error('Unknown encoding "' + Q.encoding + '".');
    return I
  };

  function bk(A, Q) {
    var B = Q.toString(16);
    if (B[0] >= "8") B = "00" + B;
    var G = aX.util.hexToBytes(B);
    A.putInt32(G.length), A.putBytes(G)
  }

  function AYA(A, Q) {
    A.putInt32(Q.length), A.putString(Q)
  }

  function X21() {
    var A = aX.md.sha1.create(),
      Q = arguments.length;
    for (var B = 0; B < Q; ++B) A.update(arguments[B]);
    return A.digest()
  }
})
// @from(Start 9473621, End 9473889)
I32 = z((RjG, Z32) => {
  Z32.exports = B6();
  Zi();
  T52();
  GP();
  yB1();
  pLA();
  p52();
  mIA();
  a52();
  r52();
  t52();
  uA0();
  pB1();
  B1A();
  yA0();
  cA0();
  Q32();
  lA0();
  vA0();
  OA0();
  oB1();
  cM();
  PA0();
  G32();
  oA0();
  x3()
})
// @from(Start 9473989, End 9473992)
cI5
// @from(Start 9473994, End 9473997)
jjG
// @from(Start 9474003, End 9474058)
C10 = L(() => {
  cI5 = BA(I32(), 1), jjG = pI5(dI5)
})
// @from(Start 9474064, End 9474090)
E10 = L(() => {
  C10()
})
// @from(Start 9474096, End 9474099)
Y32
// @from(Start 9474101, End 9474104)
iI5
// @from(Start 9474106, End 9474109)
nI5
// @from(Start 9474111, End 9474114)
aI5
// @from(Start 9474116, End 9474119)
sI5
// @from(Start 9474121, End 9474124)
rI5
// @from(Start 9474126, End 9474129)
oI5
// @from(Start 9474131, End 9474134)
tI5
// @from(Start 9474136, End 9474139)
eI5
// @from(Start 9474141, End 9474144)
AY5
// @from(Start 9474146, End 9474149)
bjG
// @from(Start 9474151, End 9474154)
QY5
// @from(Start 9474156, End 9474159)
fjG
// @from(Start 9474165, End 9476651)
J32 = L(() => {
  Q2();
  Y32 = Aw({
    command: CQ(),
    args: zJ(CQ()).optional(),
    env: PR(CQ(), CQ()).optional()
  }), iI5 = Aw({
    name: CQ(),
    email: CQ().email().optional(),
    url: CQ().url().optional()
  }), nI5 = Aw({
    type: CQ(),
    url: CQ().url()
  }), aI5 = Y32.partial(), sI5 = Y32.extend({
    platform_overrides: PR(CQ(), aI5).optional()
  }), rI5 = Aw({
    type: jR(["python", "node", "binary"]),
    entry_point: CQ(),
    mcp_config: sI5
  }), oI5 = Aw({
    claude_desktop: CQ().optional(),
    platforms: zJ(jR(["darwin", "win32", "linux"])).optional(),
    runtimes: Aw({
      python: CQ().optional(),
      node: CQ().optional()
    }).optional()
  }).passthrough(), tI5 = Aw({
    name: CQ(),
    description: CQ().optional()
  }), eI5 = Aw({
    name: CQ(),
    description: CQ().optional(),
    arguments: zJ(CQ()).optional(),
    text: CQ()
  }), AY5 = Aw({
    type: jR(["string", "number", "boolean", "directory", "file"]),
    title: CQ(),
    description: CQ(),
    required: $F().optional(),
    default: Br([CQ(), rN(), $F(), zJ(CQ())]).optional(),
    multiple: $F().optional(),
    sensitive: $F().optional(),
    min: rN().optional(),
    max: rN().optional()
  }), bjG = PR(CQ(), Br([CQ(), rN(), $F(), zJ(CQ())])), QY5 = Aw({
    $schema: CQ().optional(),
    dxt_version: CQ().optional().describe("@deprecated Use manifest_version instead"),
    manifest_version: CQ().optional(),
    name: CQ(),
    display_name: CQ().optional(),
    version: CQ(),
    description: CQ(),
    long_description: CQ().optional(),
    author: iI5,
    repository: nI5.optional(),
    homepage: CQ().url().optional(),
    documentation: CQ().url().optional(),
    support: CQ().url().optional(),
    icon: CQ().optional(),
    screenshots: zJ(CQ()).optional(),
    server: rI5,
    tools: zJ(tI5).optional(),
    tools_generated: $F().optional(),
    prompts: zJ(eI5).optional(),
    prompts_generated: $F().optional(),
    keywords: zJ(CQ()).optional(),
    license: CQ().optional(),
    compatibility: oI5.optional(),
    user_config: PR(CQ(), AY5).optional()
  }).refine((A) => !!(A.dxt_version || A.manifest_version), {
    message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
  }), fjG = Aw({
    status: jR(["signed", "unsigned", "self-signed"]),
    publisher: CQ().optional(),
    issuer: CQ().optional(),
    valid_from: CQ().optional(),
    valid_to: CQ().optional(),
    fingerprint: CQ().optional()
  })
})
// @from(Start 9476657, End 9476660)
BY5
// @from(Start 9476662, End 9476665)
GY5
// @from(Start 9476671, End 9476757)
z10 = L(() => {
  E10();
  PLA();
  J32();
  BY5 = BA(p82(), 1), GY5 = BA(n82(), 1)
})
// @from(Start 9476763, End 9476816)
W32 = L(() => {
  ie1();
  z10();
  PLA();
  be1()
})
// @from(Start 9476819, End 9477751)
function U10(A, Q) {
  if (typeof A === "string") {
    let B = A;
    for (let [G, Z] of Object.entries(Q)) {
      let I = new RegExp(`\\$\\{${G}\\}`, "g");
      if (B.match(I))
        if (Array.isArray(Z)) console.warn(`Cannot replace ${G} with array value in string context: "${A}"`, {
          key: G,
          replacement: Z
        });
        else B = B.replace(I, Z)
    }
    return B
  } else if (Array.isArray(A)) {
    let B = [];
    for (let G of A)
      if (typeof G === "string" && G.match(/^\$\{user_config\.[^}]+\}$/)) {
        let Z = G.match(/^\$\{([^}]+)\}$/)?.[1];
        if (Z && Q[Z]) {
          let I = Q[Z];
          if (Array.isArray(I)) B.push(...I);
          else B.push(I)
        } else B.push(G)
      } else B.push(U10(G, Q));
    return B
  } else if (A && typeof A === "object") {
    let B = {};
    for (let [G, Z] of Object.entries(A)) B[G] = U10(Z, Q);
    return B
  }
  return A
}
// @from(Start 9477752, End 9478887)
async function QYA(A) {
  let {
    manifest: Q,
    extensionPath: B,
    systemDirs: G,
    userConfig: Z,
    pathSeparator: I,
    logger: Y
  } = A, J = Q.server?.mcp_config;
  if (!J) return;
  let W = {
    ...J
  };
  if (J.platform_overrides) {
    if (process.platform in J.platform_overrides) {
      let F = J.platform_overrides[process.platform];
      W.command = F.command || W.command, W.args = F.args || W.args, W.env = F.env || W.env
    }
  }
  if (ZY5({
      manifest: Q,
      userConfig: Z
    })) {
    Y?.warn(`Extension ${Q.name} has missing required configuration, skipping MCP config`);
    return
  }
  let X = {
      __dirname: B,
      pathSeparator: I,
      "/": I,
      ...G
    },
    V = {};
  if (Q.user_config) {
    for (let [F, K] of Object.entries(Q.user_config))
      if (K.default !== void 0) V[F] = K.default
  }
  if (Z) Object.assign(V, Z);
  for (let [F, K] of Object.entries(V)) {
    let D = `user_config.${F}`;
    if (Array.isArray(K)) X[D] = K.map(String);
    else if (typeof K === "boolean") X[D] = K ? "true" : "false";
    else X[D] = String(K)
  }
  return W = U10(W, X), W
}
// @from(Start 9478889, End 9478956)
function X32(A) {
  return A === void 0 || A === null || A === ""
}
// @from(Start 9478958, End 9479255)
function ZY5({
  manifest: A,
  userConfig: Q
}) {
  if (!A.user_config) return !1;
  let B = Q || {};
  for (let [G, Z] of Object.entries(A.user_config))
    if (Z.required) {
      let I = B[G];
      if (X32(I) || Array.isArray(I) && (I.length === 0 || I.some(X32))) return !0
    } return !1
}
// @from(Start 9479260, End 9479274)
V32 = () => {}
// @from(Start 9479280, End 9479369)
AMA = L(() => {
  be1();
  W32();
  E10();
  ie1();
  C10();
  z10();
  PLA();
  V32()
})
// @from(Start 9479372, End 9479670)
function F32(A) {
  let Q = WB1.safeParse(A);
  if (!Q.success) {
    let B = Q.error.flatten(),
      G = [...Object.entries(B.fieldErrors).map(([Z, I]) => `${Z}: ${I?.join(", ")}`), ...B.formErrors || []].filter(Boolean).join("; ");
    throw Error(`Invalid manifest: ${G}`)
  }
  return Q.data
}
// @from(Start 9479672, End 9479858)
function IY5(A) {
  let Q;
  try {
    Q = JSON.parse(A)
  } catch (B) {
    throw Error(`Invalid JSON in manifest.json: ${B instanceof Error?B.message:String(B)}`)
  }
  return F32(Q)
}
// @from(Start 9479860, End 9479934)
function F21(A) {
  let Q = new TextDecoder().decode(A);
  return IY5(Q)
}
// @from(Start 9479939, End 9479965)
$10 = L(() => {
  AMA()
})
// @from(Start 9479997, End 9480117)
function YY5(A) {
  if (C9A(A)) return !1;
  let Q = K21.normalize(A);
  if (K21.isAbsolute(Q)) return !1;
  return !0
}
// @from(Start 9480119, End 9481096)
function JY5(A, Q) {
  Q.fileCount++;
  let B;
  if (Q.fileCount > Di.MAX_FILE_COUNT) B = `Archive contains too many files: ${Q.fileCount} (max: ${Di.MAX_FILE_COUNT})`;
  if (!YY5(A.name)) B = `Unsafe file path detected: "${A.name}". Path traversal or absolute paths are not allowed.`;
  let G = A.originalSize || 0;
  if (G > Di.MAX_FILE_SIZE) B = `File "${A.name}" is too large: ${Math.round(G/1024/1024)}MB (max: ${Math.round(Di.MAX_FILE_SIZE/1024/1024)}MB)`;
  if (Q.totalUncompressedSize += G, Q.totalUncompressedSize > Di.MAX_TOTAL_SIZE) B = `Archive total size is too large: ${Math.round(Q.totalUncompressedSize/1024/1024)}MB (max: ${Math.round(Di.MAX_TOTAL_SIZE/1024/1024)}MB)`;
  let Z = Q.totalUncompressedSize / Q.compressedSize;
  if (Z > Di.MAX_COMPRESSION_RATIO) B = `Suspicious compression ratio detected: ${Z.toFixed(1)}:1 (max: ${Di.MAX_COMPRESSION_RATIO}:1). This may be a zip bomb.`;
  return B ? {
    isValid: !1,
    error: B
  } : {
    isValid: !0
  }
}
// @from(Start 9481097, End 9482022)
async function w10(A) {
  let Q = RA();
  if (!Q.existsSync(A)) throw Error(`Zip file does not exist: ${A}`);
  try {
    let B = Q.readFileBytesSync(A),
      G = B.length;
    return await new Promise((I, Y) => {
      let J = {
          fileCount: 0,
          totalUncompressedSize: 0,
          compressedSize: G,
          errors: []
        },
        W = U92(new Uint8Array(B), {
          filter: (X) => {
            let V = JY5(X, J);
            if (!V.isValid) return Y(Error(V.error)), W(), !1;
            return !0
          }
        }, (X, V) => {
          if (X) Y(Error(`Failed to unzip file: ${X.message||String(X)}`));
          else g(`Zip extraction completed: ${J.fileCount} files, ${Math.round(J.totalUncompressedSize/1024)}KB uncompressed`), I(V)
        })
    })
  } catch (B) {
    let G = B instanceof Error ? B.message : String(B);
    throw Error(`Failed to read or unzip file: ${G}`)
  }
}
// @from(Start 9482027, End 9482029)
Di
// @from(Start 9482035, End 9482248)
q10 = L(() => {
  $92();
  V0();
  AQ();
  yI();
  Di = {
    MAX_FILE_SIZE: 536870912,
    MAX_TOTAL_SIZE: 1073741824,
    MAX_FILE_COUNT: 1e5,
    MAX_COMPRESSION_RATIO: 50,
    MIN_COMPRESSION_RATIO: 0.5
  }
})
// @from(Start 9482307, End 9483152)
function Hi() {
  let A = dQ(),
    Q = K32.homedir(),
    B = {
      HOME: Q,
      DESKTOP: F1A.join(Q, "Desktop"),
      DOCUMENTS: F1A.join(Q, "Documents"),
      DOWNLOADS: F1A.join(Q, "Downloads")
    };
  switch (A) {
    case "windows": {
      let G = process.env.USERPROFILE || Q;
      return {
        HOME: Q,
        DESKTOP: F1A.join(G, "Desktop"),
        DOCUMENTS: F1A.join(G, "Documents"),
        DOWNLOADS: F1A.join(G, "Downloads")
      }
    }
    case "linux":
    case "wsl":
      return {
        HOME: Q, DESKTOP: process.env.XDG_DESKTOP_DIR || B.DESKTOP, DOCUMENTS: process.env.XDG_DOCUMENTS_DIR || B.DOCUMENTS, DOWNLOADS: process.env.XDG_DOWNLOAD_DIR || B.DOWNLOADS
      };
    case "macos":
    default: {
      if (A === "unknown") g("Unknown platform detected, using default paths");
      return B
    }
  }
}
// @from(Start 9483157, End 9483190)
QMA = L(() => {
  Q3();
  V0()
})
// @from(Start 9483339, End 9483408)
function rM(A) {
  return A.endsWith(".mcpb") || A.endsWith(".dxt")
}
// @from(Start 9483410, End 9483490)
function U32(A) {
  return A.startsWith("http://") || A.startsWith("https://")
}
// @from(Start 9483492, End 9483575)
function XY5(A) {
  return L10("sha256").update(A).digest("hex").substring(0, 16)
}
// @from(Start 9483577, End 9483626)
function $32(A) {
  return Ci(A, ".mcpb-cache")
}
// @from(Start 9483628, End 9483749)
function w32(A, Q) {
  let B = L10("md5").update(Q).digest("hex").substring(0, 8);
  return Ci(A, `${B}.metadata.json`)
}
// @from(Start 9483751, End 9484107)
function D32(A, Q) {
  try {
    let G = l0().pluginConfigs?.[A]?.mcpServers?.[Q];
    if (!G) return null;
    return g(`Loaded user config for ${A}/${Q} from settings`), G
  } catch (B) {
    let G = B instanceof Error ? B : Error(String(B));
    return AA(G), g(`Failed to load user config for ${A}/${Q}: ${B}`, {
      level: "error"
    }), null
  }
}
// @from(Start 9484109, End 9484668)
function H32(A, Q, B) {
  try {
    let G = l0();
    if (!G.pluginConfigs) G.pluginConfigs = {};
    if (!G.pluginConfigs[A]) G.pluginConfigs[A] = {};
    if (!G.pluginConfigs[A].mcpServers) G.pluginConfigs[A].mcpServers = {};
    G.pluginConfigs[A].mcpServers[Q] = B;
    let Z = cB("userSettings", G);
    if (Z.error) throw Z.error;
    g(`Saved user config for ${A}/${Q} to user settings`)
  } catch (G) {
    let Z = G instanceof Error ? G : Error(String(G));
    throw AA(Z), Error(`Failed to save user configuration for ${A}/${Q}: ${Z.message}`)
  }
}
// @from(Start 9484670, End 9485918)
function C32(A, Q) {
  let B = [];
  for (let [G, Z] of Object.entries(Q)) {
    let I = A[G];
    if (Z.required && (I === void 0 || I === "")) {
      B.push(`${Z.title||G} is required but not provided`);
      continue
    }
    if (I === void 0 || I === "") continue;
    if (Z.type === "string") {
      if (Array.isArray(I)) {
        if (!Z.multiple) B.push(`${Z.title||G} must be a string, not an array`);
        else if (!I.every((Y) => typeof Y === "string")) B.push(`${Z.title||G} must be an array of strings`)
      } else if (typeof I !== "string") B.push(`${Z.title||G} must be a string`)
    } else if (Z.type === "number" && typeof I !== "number") B.push(`${Z.title||G} must be a number`);
    else if (Z.type === "boolean" && typeof I !== "boolean") B.push(`${Z.title||G} must be a boolean`);
    else if ((Z.type === "file" || Z.type === "directory") && typeof I !== "string") B.push(`${Z.title||G} must be a path string`);
    if (Z.type === "number" && typeof I === "number") {
      if (Z.min !== void 0 && I < Z.min) B.push(`${Z.title||G} must be at least ${Z.min}`);
      if (Z.max !== void 0 && I > Z.max) B.push(`${Z.title||G} must be at most ${Z.max}`)
    }
  }
  return {
    valid: B.length === 0,
    errors: B
  }
}
// @from(Start 9485919, End 9486217)
async function E32(A, Q) {
  let B = await QYA({
    manifest: A,
    extensionPath: Q,
    systemDirs: Hi(),
    userConfig: {},
    pathSeparator: "/"
  });
  if (!B) {
    let G = Error(`Failed to generate MCP server configuration from manifest "${A.name}"`);
    throw AA(G), G
  }
  return B
}
// @from(Start 9486218, End 9486590)
async function q32(A, Q) {
  let B = RA(),
    G = w32(A, Q);
  if (!B.existsSync(G)) return null;
  try {
    let Z = B.readFileSync(G, {
      encoding: "utf-8"
    });
    return JSON.parse(Z)
  } catch (Z) {
    let I = Z instanceof Error ? Z : Error(String(Z));
    return AA(I), g(`Failed to load MCPB cache metadata: ${Z}`, {
      level: "error"
    }), null
  }
}
// @from(Start 9486591, End 9486766)
async function N10(A, Q, B) {
  let G = RA(),
    Z = w32(A, Q);
  G.mkdirSync(A), G.writeFileSync(Z, JSON.stringify(B, null, 2), {
    encoding: "utf-8",
    flush: !1
  })
}
// @from(Start 9486767, End 9487495)
async function VY5(A, Q, B) {
  if (g(`Downloading MCPB from ${A}`), B) B(`Downloading ${A}...`);
  try {
    let G = await YQ.get(A, {
        timeout: 120000,
        responseType: "arraybuffer",
        maxRedirects: 5,
        onDownloadProgress: (I) => {
          if (I.total && B) {
            let Y = Math.round(I.loaded / I.total * 100);
            B(`Downloading... ${Y}%`)
          }
        }
      }),
      Z = new Uint8Array(G.data);
    if (z32(Q, Buffer.from(Z)), g(`Downloaded ${Z.length} bytes to ${Q}`), B) B("Download complete");
    return Z
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G),
      I = Error(`Failed to download MCPB file from ${A}: ${Z}`);
    throw AA(I), I
  }
}
// @from(Start 9487496, End 9488247)
async function FY5(A, Q, B) {
  let G = RA();
  if (B) B("Extracting files...");
  G.mkdirSync(Q);
  let Z = 0,
    I = Object.keys(A).length;
  for (let [Y, J] of Object.entries(A)) {
    let W = Ci(Q, Y),
      X = WY5(W);
    if (X !== Q && !G.existsSync(X)) G.mkdirSync(X);
    if (Y.endsWith(".json") || Y.endsWith(".js") || Y.endsWith(".ts") || Y.endsWith(".txt") || Y.endsWith(".md") || Y.endsWith(".yml") || Y.endsWith(".yaml")) {
      let F = new TextDecoder().decode(J);
      G.writeFileSync(W, F, {
        encoding: "utf-8",
        flush: !1
      })
    } else z32(W, Buffer.from(J));
    if (Z++, B && Z % 10 === 0) B(`Extracted ${Z}/${I} files`)
  }
  if (g(`Extracted ${Z} files to ${Q}`), B) B(`Extraction complete (${Z} files)`)
}
// @from(Start 9488248, End 9488760)
async function KY5(A, Q) {
  let B = RA(),
    G = $32(Q),
    Z = await q32(G, A);
  if (!Z) return !0;
  if (!B.existsSync(Z.extractedPath)) return g(`MCPB extraction path missing: ${Z.extractedPath}`), !0;
  if (!U32(A)) {
    let I = Ci(Q, A);
    if (!B.existsSync(I)) return g(`MCPB source file missing: ${I}`), !0;
    let Y = B.statSync(I),
      J = new Date(Z.cachedAt).getTime(),
      W = Y.mtimeMs;
    if (W > J) return g(`MCPB file modified: ${new Date(W)} > ${new Date(J)}`), !0
  }
  return !1
}
// @from(Start 9488761, End 9492987)
async function BMA(A, Q, B, G, Z, I) {
  let Y = RA(),
    J = $32(Q);
  Y.mkdirSync(J), g(`Loading MCPB from source: ${A}`);
  let W = await q32(J, A);
  if (W && !await KY5(A, Q)) {
    g(`Using cached MCPB from ${W.extractedPath} (hash: ${W.contentHash})`);
    let q = Ci(W.extractedPath, "manifest.json");
    if (!Y.existsSync(q)) {
      let y = Error(`Cached manifest not found: ${q}`);
      throw AA(y), y
    }
    let w = Y.readFileSync(q, {
        encoding: "utf-8"
      }),
      N = new TextEncoder().encode(w),
      R = F21(N);
    if (R.user_config && Object.keys(R.user_config).length > 0) {
      let y = R.name,
        v = D32(B, y),
        x = Z || v || {},
        p = C32(x, R.user_config);
      if (I || !p.valid) return {
        status: "needs-config",
        manifest: R,
        extractedPath: W.extractedPath,
        contentHash: W.contentHash,
        configSchema: R.user_config,
        existingConfig: v || {},
        validationErrors: p.valid ? [] : p.errors
      };
      if (Z) H32(B, y, Z);
      let u = await QYA({
        manifest: R,
        extensionPath: W.extractedPath,
        systemDirs: Hi(),
        userConfig: x,
        pathSeparator: "/"
      });
      if (!u) {
        let e = Error(`Failed to generate MCP server configuration from manifest "${R.name}"`);
        throw AA(e), e
      }
      return {
        manifest: R,
        mcpConfig: u,
        extractedPath: W.extractedPath,
        contentHash: W.contentHash
      }
    }
    let T = await E32(R, W.extractedPath);
    return {
      manifest: R,
      mcpConfig: T,
      extractedPath: W.extractedPath,
      contentHash: W.contentHash
    }
  }
  let X, V;
  if (U32(A)) {
    let q = L10("md5").update(A).digest("hex").substring(0, 8);
    V = Ci(J, `${q}.mcpb`), X = await VY5(A, V, G)
  } else {
    let q = Ci(Q, A);
    if (!Y.existsSync(q)) {
      let w = Error(`MCPB file not found: ${q}`);
      throw AA(w), w
    }
    if (G) G(`Loading ${A}...`);
    X = Y.readFileBytesSync(q), V = q
  }
  let F = XY5(X);
  if (g(`MCPB content hash: ${F}`), G) G("Extracting MCPB archive...");
  let K = await w10(V),
    D = K["manifest.json"];
  if (!D) {
    let q = Error("No manifest.json found in MCPB file");
    throw AA(q), q
  }
  let H = F21(D);
  if (g(`MCPB manifest: ${H.name} v${H.version} by ${H.author.name}`), !H.server) {
    let q = Error(`MCPB manifest for "${H.name}" does not define a server configuration`);
    throw AA(q), q
  }
  let C = Ci(J, F);
  if (await FY5(K, C, G), H.user_config && Object.keys(H.user_config).length > 0) {
    let q = H.name,
      w = D32(B, q),
      N = Z || w || {},
      R = C32(N, H.user_config);
    if (!R.valid) {
      let v = {
        source: A,
        contentHash: F,
        extractedPath: C,
        cachedAt: new Date().toISOString(),
        lastChecked: new Date().toISOString()
      };
      return await N10(J, A, v), {
        status: "needs-config",
        manifest: H,
        extractedPath: C,
        contentHash: F,
        configSchema: H.user_config,
        existingConfig: w || {},
        validationErrors: R.errors
      }
    }
    if (Z) H32(B, q, Z);
    if (G) G("Generating MCP server configuration...");
    let T = await QYA({
      manifest: H,
      extensionPath: C,
      systemDirs: Hi(),
      userConfig: N,
      pathSeparator: "/"
    });
    if (!T) {
      let v = Error(`Failed to generate MCP server configuration from manifest "${H.name}"`);
      throw AA(v), v
    }
    let y = {
      source: A,
      contentHash: F,
      extractedPath: C,
      cachedAt: new Date().toISOString(),
      lastChecked: new Date().toISOString()
    };
    return await N10(J, A, y), {
      manifest: H,
      mcpConfig: T,
      extractedPath: C,
      contentHash: F
    }
  }
  if (G) G("Generating MCP server configuration...");
  let E = await E32(H, C),
    U = {
      source: A,
      contentHash: F,
      extractedPath: C,
      cachedAt: new Date().toISOString(),
      lastChecked: new Date().toISOString()
    };
  return await N10(J, A, U), g(`Successfully loaded MCPB: ${H.name} (extracted to ${C})`), {
    manifest: H,
    mcpConfig: E,
    extractedPath: C,
    contentHash: F
  }
}
// @from(Start 9492992, End 9493085)
M10 = L(() => {
  O3();
  AMA();
  $10();
  q10();
  AQ();
  V0();
  g1();
  QMA();
  MB()
})
// @from(Start 9493125, End 9494428)
async function N32(A, Q, B) {
  try {
    g(`Loading MCP servers from MCPB: ${Q}`);
    let G = A.repository,
      Z = await BMA(Q, A.path, G, (J) => {
        g(`MCPB [${A.name}]: ${J}`)
      });
    if ("status" in Z && Z.status === "needs-config") return g(`MCPB ${Q} requires user configuration. ` + `User can configure via: /plugin → Manage plugins → ${A.name} → Configure`), null;
    let I = Z,
      Y = I.manifest.name;
    return g(`Loaded MCP server "${Y}" from MCPB (extracted to ${I.extractedPath})`), {
      [Y]: I.mcpConfig
    }
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G);
    g(`Failed to load MCPB ${Q}: ${Z}`, {
      level: "error"
    });
    let I = `${A.name}@${A.repository}`;
    if (Q.startsWith("http") && (Z.includes("download") || Z.includes("network"))) B.push({
      type: "mcpb-download-failed",
      source: I,
      plugin: A.name,
      url: Q,
      reason: Z
    });
    else if (Z.includes("manifest") || Z.includes("user configuration")) B.push({
      type: "mcpb-invalid-manifest",
      source: I,
      plugin: A.name,
      mcpbPath: Q,
      validationError: Z
    });
    else B.push({
      type: "mcpb-extract-failed",
      source: I,
      plugin: A.name,
      mcpbPath: Q,
      reason: Z
    });
    return null
  }
}
// @from(Start 9494429, End 9495396)
async function HY5(A, Q = []) {
  let B = {},
    G = O10(A.path, ".mcp.json");
  if (G) B = {
    ...B,
    ...G
  };
  if (A.manifest.mcpServers) {
    let Z = A.manifest.mcpServers;
    if (typeof Z === "string")
      if (rM(Z)) {
        let I = await N32(A, Z, Q);
        if (I) B = {
          ...B,
          ...I
        }
      } else {
        let I = O10(A.path, Z);
        if (I) B = {
          ...B,
          ...I
        }
      }
    else if (Array.isArray(Z))
      for (let I of Z)
        if (typeof I === "string")
          if (rM(I)) {
            let Y = await N32(A, I, Q);
            if (Y) B = {
              ...B,
              ...Y
            }
          } else {
            let Y = O10(A.path, I);
            if (Y) B = {
              ...B,
              ...Y
            }
          }
    else B = {
      ...B,
      ...I
    };
    else B = {
      ...B,
      ...Z
    }
  }
  return Object.keys(B).length > 0 ? B : void 0
}
// @from(Start 9495398, End 9495994)
function O10(A, Q) {
  let B = RA(),
    G = DY5(A, Q);
  if (!B.existsSync(G)) return null;
  try {
    let Z = B.readFileSync(G, {
        encoding: "utf-8"
      }),
      I = JSON.parse(Z),
      Y = I.mcpServers || I,
      J = {};
    for (let [W, X] of Object.entries(Y)) {
      let V = il.safeParse(X);
      if (V.success) J[W] = V.data;
      else g(`Invalid MCP server config for ${W} in ${G}: ${V.error.message}`, {
        level: "error"
      })
    }
    return J
  } catch (Z) {
    return g(`Failed to load MCP servers from ${G}: ${Z}`, {
      level: "error"
    }), null
  }
}
// @from(Start 9495996, End 9496175)
function CY5(A, Q) {
  let B = {};
  for (let [G, Z] of Object.entries(A)) {
    let I = `plugin:${Q}:${G}`;
    B[I] = {
      ...Z,
      scope: "dynamic"
    }
  }
  return B
}
// @from(Start 9496177, End 9496250)
function R10(A, Q) {
  return A.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, Q)
}
// @from(Start 9496252, End 9496529)
function EY5(A, Q) {
  return A.replace(/\$\{user_config\.([^}]+)\}/g, (B, G) => {
    let Z = Q[G];
    if (Z === void 0) throw Error(`Missing required user configuration value: ${G}. This should have been validated before variable substitution.`);
    return String(Z)
  })
}
// @from(Start 9496531, End 9497466)
function zY5(A, Q, B, G) {
  let Z = [],
    I = (Y) => {
      let J = R10(Y, Q);
      if (B) J = EY5(J, B);
      let {
        expanded: W,
        missingVars: X
      } = ELA(J);
      return Z.push(...X), W
    };
  if (A.type === "stdio" || !A.type) {
    let Y = {
      ...A
    };
    if (Y.command) Y.command = I(Y.command);
    if (Y.args) Y.args = Y.args.map((W) => I(W));
    let J = {
      CLAUDE_PLUGIN_ROOT: Q,
      ...Y.env || {}
    };
    for (let [W, X] of Object.entries(J))
      if (W !== "CLAUDE_PLUGIN_ROOT") J[W] = I(X);
    if (Y.env = J, G && Z.length > 0) {
      let W = [...new Set(Z)];
      g(`Missing environment variables in plugin MCP config: ${W.join(", ")}`, {
        level: "warn"
      })
    }
    return Y
  }
  if (G && Z.length > 0) {
    let Y = [...new Set(Z)];
    g(`Missing environment variables in plugin MCP config: ${Y.join(", ")}`, {
      level: "warn"
    })
  }
  return A
}
// @from(Start 9497467, End 9497699)
async function L32(A, Q = []) {
  if (!A.enabled) return;
  let B = A.mcpServers || await HY5(A, Q);
  if (!B) return;
  let G = {};
  for (let [Z, I] of Object.entries(B)) G[Z] = zY5(I, A.path, void 0, Q);
  return CY5(G, A.name)
}
// @from(Start 9497704, End 9497755)
T10 = L(() => {
  AQ();
  V0();
  MIA();
  M10()
})
// @from(Start 9497758, End 9500344)
function oM(A) {
  switch (A.type) {
    case "generic-error":
      return A.error;
    case "path-not-found":
      return `Path not found: ${A.path} (${A.component})`;
    case "git-auth-failed":
      return `Git authentication failed (${A.authType}): ${A.gitUrl}`;
    case "git-timeout":
      return `Git ${A.operation} timeout: ${A.gitUrl}`;
    case "network-error":
      return `Network error: ${A.url}${A.details?` - ${A.details}`:""}`;
    case "manifest-parse-error":
      return `Manifest parse error: ${A.parseError}`;
    case "manifest-validation-error":
      return `Manifest validation failed: ${A.validationErrors.join(", ")}`;
    case "plugin-not-found":
      return `Plugin ${A.pluginId} not found in marketplace ${A.marketplace}`;
    case "marketplace-not-found":
      return `Marketplace ${A.marketplace} not found`;
    case "marketplace-load-failed":
      return `Marketplace ${A.marketplace} failed to load: ${A.reason}`;
    case "repository-scan-failed":
      return `Repository scan failed: ${A.reason}`;
    case "mcp-config-invalid":
      return `MCP server ${A.serverName} invalid: ${A.validationError}`;
    case "hook-load-failed":
      return `Hook load failed: ${A.reason}`;
    case "component-load-failed":
      return `${A.component} load failed from ${A.path}: ${A.reason}`;
    case "mcpb-download-failed":
      return `Failed to download MCPB from ${A.url}: ${A.reason}`;
    case "mcpb-extract-failed":
      return `Failed to extract MCPB ${A.mcpbPath}: ${A.reason}`;
    case "mcpb-invalid-manifest":
      return `MCPB manifest invalid at ${A.mcpbPath}: ${A.validationError}`;
    case "lsp-config-invalid":
      return `Plugin "${A.plugin}" has invalid LSP server config for "${A.serverName}": ${A.validationError}`;
    case "lsp-server-start-failed":
      return `Plugin "${A.plugin}" failed to start LSP server "${A.serverName}": ${A.reason}`;
    case "lsp-server-crashed":
      if (A.signal) return `Plugin "${A.plugin}" LSP server "${A.serverName}" crashed with signal ${A.signal}`;
      return `Plugin "${A.plugin}" LSP server "${A.serverName}" crashed with exit code ${A.exitCode??"unknown"}`;
    case "lsp-request-timeout":
      return `Plugin "${A.plugin}" LSP server "${A.serverName}" timed out on ${A.method} request after ${A.timeoutMs}ms`;
    case "lsp-request-failed":
      return `Plugin "${A.plugin}" LSP server "${A.serverName}" ${A.method} request failed: ${A.error}`;
    case "marketplace-blocked-by-policy":
      return `Marketplace '${A.marketplace}' is not allowed by enterprise policy`
  }
}
// @from(Start 9500418, End 9500475)
function H21() {
  return D21(iw(), "managed-mcp.json")
}
// @from(Start 9500477, End 9500622)
function GMA(A, Q) {
  if (!A) return {};
  let B = {};
  for (let [G, Z] of Object.entries(A)) B[G] = {
    ...Z,
    scope: Q
  };
  return B
}
// @from(Start 9500624, End 9500741)
function M32(A) {
  let Q = D21(W0(), ".mcp.json");
  L_(Q, JSON.stringify(A, null, 2), {
    encoding: "utf8"
  })
}
// @from(Start 9500743, End 9500867)
function O32(A) {
  if (A.type !== void 0 && A.type !== "stdio") return null;
  let Q = A;
  return [Q.command, ...Q.args]
}
// @from(Start 9500869, End 9500970)
function R32(A, Q) {
  if (A.length !== Q.length) return !1;
  return A.every((B, G) => B === Q[G])
}
// @from(Start 9500972, End 9501296)
function T32(A, Q) {
  let B = l0();
  if (!B.deniedMcpServers) return !1;
  for (let G of B.deniedMcpServers)
    if (wLA(G) && G.serverName === A) return !0;
  if (Q) {
    let G = O32(Q);
    if (G) {
      for (let Z of B.deniedMcpServers)
        if (QB1(Z) && R32(Z.serverCommand, G)) return !0
    }
  }
  return !1
}
// @from(Start 9501298, End 9502041)
function P10(A, Q) {
  if (T32(A, Q)) return !1;
  let B = l0();
  if (!B.allowedMcpServers) return !0;
  if (B.allowedMcpServers.length === 0) return !1;
  let G = B.allowedMcpServers.some(QB1);
  if (Q) {
    let Z = O32(Q);
    if (Z)
      if (G) {
        for (let I of B.allowedMcpServers)
          if (QB1(I) && R32(I.serverCommand, Z)) return !0;
        return !1
      } else {
        for (let I of B.allowedMcpServers)
          if (wLA(I) && I.serverName === A) return !0;
        return !1
      }
    else {
      for (let I of B.allowedMcpServers)
        if (wLA(I) && I.serverName === A) return !0;
      return !1
    }
  }
  for (let Z of B.allowedMcpServers)
    if (wLA(Z) && Z.serverName === A) return !0;
  return !1
}
// @from(Start 9502043, End 9502804)
function wY5(A) {
  let Q = [];

  function B(Z) {
    let {
      expanded: I,
      missingVars: Y
    } = ELA(Z);
    return Q.push(...Y), I
  }
  let G;
  switch (A.type) {
    case void 0:
    case "stdio": {
      let Z = A;
      G = {
        ...Z,
        command: B(Z.command),
        args: Z.args.map(B),
        env: Z.env ? ns(Z.env, B) : void 0
      };
      break
    }
    case "sse":
    case "http":
    case "ws": {
      let Z = A;
      G = {
        ...Z,
        url: B(Z.url),
        headers: Z.headers ? ns(Z.headers, B) : void 0
      };
      break
    }
    case "sse-ide":
    case "ws-ide":
      G = A;
      break;
    case "sdk":
      G = A;
      break
  }
  return {
    expanded: G,
    missingVars: [...new Set(Q)]
  }
}
// @from(Start 9502806, End 9504762)
function K1A(A, Q, B) {
  if (A.match(/[^a-zA-Z0-9_-]/)) throw Error(`Invalid name ${A}. Names can only contain letters, numbers, hyphens, and underscores.`);
  let G = il.safeParse(Q);
  if (!G.success) {
    let I = G.error.errors.map((Y) => `${Y.path.join(".")}: ${Y.message}`).join(", ");
    throw Error(`Invalid configuration: ${I}`)
  }
  let Z = G.data;
  if (T32(A, Z)) throw Error(`Cannot add MCP server "${A}": server is explicitly blocked by enterprise policy`);
  if (!P10(A, Z)) throw Error(`Cannot add MCP server "${A}": not allowed by enterprise policy`);
  switch (B) {
    case "project": {
      let {
        servers: I
      } = j10();
      if (I[A]) throw Error(`MCP server ${A} already exists in .mcp.json`);
      break
    }
    case "user": {
      if (N1().mcpServers?.[A]) throw Error(`MCP server ${A} already exists in user config`);
      break
    }
    case "local": {
      if (j5().mcpServers?.[A]) throw Error(`MCP server ${A} already exists in local config`);
      break
    }
    case "dynamic":
      throw Error("Cannot add MCP server to scope: dynamic");
    case "enterprise":
      throw Error("Cannot add MCP server to scope: enterprise")
  }
  switch (B) {
    case "project": {
      let {
        servers: I
      } = j10(), Y = {};
      for (let [W, X] of Object.entries(I)) {
        let {
          scope: V,
          ...F
        } = X;
        Y[W] = F
      }
      Y[A] = Z;
      let J = {
        mcpServers: Y
      };
      try {
        M32(J)
      } catch (W) {
        throw Error(`Failed to write to mcp.json: ${W}`)
      }
      break
    }
    case "user": {
      let I = N1();
      if (!I.mcpServers) I.mcpServers = {};
      I.mcpServers[A] = Z, c0(I);
      break
    }
    case "local": {
      let I = j5();
      if (!I.mcpServers) I.mcpServers = {};
      I.mcpServers[A] = Z, AY(I);
      break
    }
    default:
      throw Error(`Cannot add MCP server to scope: ${B}`)
  }
}
// @from(Start 9504764, End 9505773)
function S10(A, Q) {
  switch (Q) {
    case "project": {
      let {
        servers: B
      } = j10();
      if (!B[A]) throw Error(`No MCP server found with name: ${A} in .mcp.json`);
      let G = {};
      for (let [I, Y] of Object.entries(B))
        if (I !== A) {
          let {
            scope: J,
            ...W
          } = Y;
          G[I] = W
        } let Z = {
        mcpServers: G
      };
      try {
        M32(Z)
      } catch (I) {
        throw Error(`Failed to remove from .mcp.json: ${I}`)
      }
      break
    }
    case "user": {
      let B = N1();
      if (!B.mcpServers?.[A]) throw Error(`No user-scoped MCP server found with name: ${A}`);
      delete B.mcpServers[A], c0(B);
      break
    }
    case "local": {
      let B = j5();
      if (!B.mcpServers?.[A]) throw Error(`No project-local MCP server found with name: ${A}`);
      delete B.mcpServers[A], AY(B);
      break
    }
    default:
      throw Error(`Cannot remove MCP server from scope: ${Q}`)
  }
}
// @from(Start 9505775, End 9506199)
function j10() {
  if (!EH("projectSettings")) return {
    servers: {},
    errors: []
  };
  let A = RA(),
    Q = D21(W0(), ".mcp.json");
  if (!A.existsSync(Q)) return {
    servers: {},
    errors: []
  };
  let {
    config: B,
    errors: G
  } = BYA({
    filePath: Q,
    expandVars: !0,
    scope: "project"
  });
  return {
    servers: B?.mcpServers ? GMA(B.mcpServers, "project") : {},
    errors: G || []
  }
}
// @from(Start 9506201, End 9508180)
function sX(A) {
  let Q = {
    project: "projectSettings",
    user: "userSettings",
    local: "localSettings"
  };
  if (A in Q && !EH(Q[A])) return {
    servers: {},
    errors: []
  };
  switch (A) {
    case "project": {
      let B = RA(),
        G = {},
        Z = [],
        I = [],
        Y = W0();
      while (Y !== $Y5(Y).root) I.push(Y), Y = UY5(Y);
      for (let J of I.reverse()) {
        let W = D21(J, ".mcp.json");
        if (!B.existsSync(W)) continue;
        let {
          config: X,
          errors: V
        } = BYA({
          filePath: W,
          expandVars: !0,
          scope: "project"
        });
        if (X?.mcpServers) Object.assign(G, GMA(X.mcpServers, A));
        if (V.length > 0) Z.push(...V)
      }
      return {
        servers: G,
        errors: Z
      }
    }
    case "user": {
      let B = N1().mcpServers;
      if (!B) return {
        servers: {},
        errors: []
      };
      let {
        config: G,
        errors: Z
      } = ZMA({
        configObject: {
          mcpServers: B
        },
        expandVars: !0,
        scope: "user"
      });
      return {
        servers: GMA(G?.mcpServers, A),
        errors: Z
      }
    }
    case "local": {
      let B = j5().mcpServers;
      if (!B) return {
        servers: {},
        errors: []
      };
      let {
        config: G,
        errors: Z
      } = ZMA({
        configObject: {
          mcpServers: B
        },
        expandVars: !0,
        scope: "local"
      });
      return {
        servers: GMA(G?.mcpServers, A),
        errors: Z
      }
    }
    case "enterprise": {
      let B = H21();
      if (!RA().existsSync(B)) return {
        servers: {},
        errors: []
      };
      let {
        config: Z,
        errors: I
      } = BYA({
        filePath: B,
        expandVars: !0,
        scope: "enterprise"
      });
      return {
        servers: GMA(Z?.mcpServers, A),
        errors: I
      }
    }
  }
}
// @from(Start 9508182, End 9508471)
function GYA(A) {
  let {
    servers: Q
  } = sX("enterprise"), {
    servers: B
  } = sX("user"), {
    servers: G
  } = sX("project"), {
    servers: Z
  } = sX("local");
  if (Q[A]) return Q[A];
  if (Z[A]) return Z[A];
  if (G[A]) return G[A];
  if (B[A]) return B[A];
  return null
}
// @from(Start 9508472, End 9510325)
async function fk() {
  let {
    servers: A
  } = sX("enterprise");
  if (_10()) {
    let F = {};
    for (let [K, D] of Object.entries(A)) {
      if (!P10(K, D)) continue;
      F[K] = D
    }
    return GA("tengu_mcp_servers", {
      enterprise: Object.keys(F).length,
      global: 0,
      project: 0,
      user: 0,
      plugin: 0
    }), {
      servers: F,
      errors: []
    }
  }
  let {
    servers: Q
  } = sX("user"), {
    servers: B
  } = sX("project"), {
    servers: G
  } = sX("local"), Z = {}, I = await l7(), Y = [];
  if (I.errors.length > 0)
    for (let F of I.errors)
      if (F.type === "mcp-config-invalid" || F.type === "mcpb-download-failed" || F.type === "mcpb-extract-failed" || F.type === "mcpb-invalid-manifest") {
        let K = `Plugin MCP loading error - ${F.type}: ${oM(F)}`;
        AA(Error(K))
      } else {
        let K = F.type;
        g(`Plugin not available for MCP: ${F.source} - error type: ${K}`)
      } for (let F of I.enabled) {
    let K = await L32(F, Y);
    if (K) Object.assign(Z, K)
  }
  if (Y.length > 0)
    for (let F of Y) {
      let K = `Plugin MCP server error - ${F.type}: ${oM(F)}`;
      AA(Error(K))
    }
  let J = {};
  for (let [F, K] of Object.entries(B))
    if (C21(F) === "approved") J[F] = K;
  let W = Object.assign({}, Z, Q, J, G),
    X = {};
  for (let [F, K] of Object.entries(W)) {
    if (!P10(F, K)) continue;
    X[F] = K
  }
  let V = {
    enterprise: 0,
    global: 0,
    project: 0,
    user: 0,
    plugin: 0
  };
  for (let F of Object.values(X))
    if (F.scope === "enterprise") V.enterprise++;
    else if (F.scope === "user") V.global++;
  else if (F.scope === "project") V.project++;
  else if (F.scope === "local") V.user++;
  else if (F.scope === "dynamic") V.plugin++;
  return GA("tengu_mcp_servers", V), {
    servers: X,
    errors: Y
  }
}
// @from(Start 9510327, End 9511992)
function ZMA(A) {
  let {
    configObject: Q,
    expandVars: B,
    scope: G,
    filePath: Z
  } = A, I = O22.safeParse(Q);
  if (!I.success) return {
    config: null,
    errors: I.error.issues.map((W) => ({
      ...Z && {
        file: Z
      },
      path: W.path.join("."),
      message: "Does not adhere to MCP server configuration schema",
      mcpErrorMetadata: {
        scope: G,
        severity: "fatal"
      }
    }))
  };
  let Y = [],
    J = {};
  for (let [W, X] of Object.entries(I.data.mcpServers)) {
    let V = X;
    if (B) {
      let {
        expanded: F,
        missingVars: K
      } = wY5(X);
      if (K.length > 0) Y.push({
        ...Z && {
          file: Z
        },
        path: `mcpServers.${W}`,
        message: `Missing environment variables: ${K.join(", ")}`,
        suggestion: `Set the following environment variables: ${K.join(", ")}`,
        mcpErrorMetadata: {
          scope: G,
          serverName: W,
          severity: "warning"
        }
      });
      V = F
    }
    if (dQ() === "windows" && (!V.type || V.type === "stdio") && (V.command === "npx" || V.command.endsWith("\\npx") || V.command.endsWith("/npx"))) Y.push({
      ...Z && {
        file: Z
      },
      path: `mcpServers.${W}`,
      message: "Windows requires 'cmd /c' wrapper to execute npx",
      suggestion: 'Change command to "cmd" with args ["/c", "npx", ...]. See: https://code.claude.com/docs/en/mcp#configure-mcp-servers',
      mcpErrorMetadata: {
        scope: G,
        serverName: W,
        severity: "warning"
      }
    });
    J[W] = V
  }
  return {
    config: {
      mcpServers: J
    },
    errors: Y
  }
}
// @from(Start 9511994, End 9513172)
function BYA(A) {
  let {
    filePath: Q,
    expandVars: B,
    scope: G
  } = A, Z = RA();
  if (!Z.existsSync(Q)) return {
    config: null,
    errors: [{
      file: Q,
      path: "",
      message: `MCP config file not found: ${Q}`,
      suggestion: "Check that the file path is correct",
      mcpErrorMetadata: {
        scope: G,
        severity: "fatal"
      }
    }]
  };
  let I;
  try {
    I = Z.readFileSync(Q, {
      encoding: "utf8"
    })
  } catch (J) {
    return {
      config: null,
      errors: [{
        file: Q,
        path: "",
        message: `Failed to read file: ${J}`,
        suggestion: "Check file permissions and ensure the file exists",
        mcpErrorMetadata: {
          scope: G,
          severity: "fatal"
        }
      }]
    }
  }
  let Y = f7(I);
  if (!Y) return {
    config: null,
    errors: [{
      file: Q,
      path: "",
      message: "MCP config is not a valid JSON",
      suggestion: "Fix the JSON syntax errors in the file",
      mcpErrorMetadata: {
        scope: G,
        severity: "fatal"
      }
    }]
  };
  return ZMA({
    configObject: Y,
    expandVars: B,
    scope: G,
    filePath: Q
  })
}
// @from(Start 9513174, End 9513317)
function _10() {
  let {
    config: A
  } = BYA({
    filePath: H21(),
    expandVars: !0,
    scope: "enterprise"
  });
  return A !== null
}
// @from(Start 9513319, End 9513391)
function IMA(A) {
  return (j5().disabledMcpServers || []).includes(A)
}
// @from(Start 9513393, End 9513582)
function k10(A, Q) {
  let B = j5(),
    G = B.disabledMcpServers || [];
  if (Q) G = G.filter((Z) => Z !== A);
  else if (!G.includes(A)) G = [...G, A];
  B.disabledMcpServers = G, AY(B)
}
// @from(Start 9513587, End 9513743)
tM = L(() => {
  jQ();
  AQ();
  LF();
  q0();
  qxA();
  U2();
  R9();
  MIA();
  nX();
  Q3();
  MB();
  PIA();
  LV();
  g1();
  V0();
  fV();
  T10()
})
// @from(Start 9513746, End 9513819)
function qY5(A) {
  return A.scope === "project" || A.scope === "local"
}
// @from(Start 9513820, End 9515543)
async function NY5(A, Q) {
  if (!Q.headersHelper) return null;
  if ("scope" in Q && qY5(Q) && !N6()) {
    if (!TJ(!0)) {
      let G = Error(`Security: headersHelper for MCP server '${A}' executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.FEEDBACK_CHANNEL}.`);
      return uN("MCP headersHelper invoked before trust check", G), GA("tengu_mcp_headersHelper_missing_trust", {}), null
    }
  }
  try {
    y0(A, "Executing headersHelper to get dynamic headers");
    let B = await A3(Q.headersHelper, [], {
      shell: !0,
      timeout: 1e4
    });
    if (B.code !== 0 || !B.stdout) throw Error(`headersHelper for MCP server '${A}' did not return a valid value`);
    let G = B.stdout.trim(),
      Z = JSON.parse(G);
    if (typeof Z !== "object" || Z === null || Array.isArray(Z)) throw Error(`headersHelper for MCP server '${A}' must return a JSON object with string key-value pairs`);
    for (let [I, Y] of Object.entries(Z))
      if (typeof Y !== "string") throw Error(`headersHelper for MCP server '${A}' returned non-string value for key "${I}": ${typeof Y}`);
    return y0(A, `Successfully retrieved ${Object.keys(Z).length} headers from headersHelper`), Z
  } catch (B) {
    return WI(A, `Error getting headers from headersHelper: ${B instanceof Error?B.message:String(B)}`), AA(Error(`Error getting MCP headers from headersHelper for server '${A}': ${B instanceof Error?B.message:String(B)}`)), null
  }
}
// @from(Start 9515544, End 9515664)
async function E21(A, Q) {
  let B = Q.headers || {},
    G = await NY5(A, Q) || {};
  return {
    ...B,
    ...G
  }
}
// @from(Start 9515669, End 9515734)
P32 = L(() => {
  _8();
  jQ();
  g1();
  V0();
  q0();
  _0()
})
// @from(Start 9515736, End 9516207)
class y10 {
  serverName;
  sendMcpMessage;
  isClosed = !1;
  onclose;
  onerror;
  onmessage;
  constructor(A, Q) {
    this.serverName = A;
    this.sendMcpMessage = Q
  }
  async start() {}
  async send(A) {
    if (this.isClosed) throw Error("Transport is closed");
    let Q = await this.sendMcpMessage(this.serverName, A);
    if (this.onmessage) this.onmessage(Q)
  }
  async close() {
    if (this.isClosed) return;
    this.isClosed = !0, this.onclose?.()
  }
}
// @from(Start 9516209, End 9516292)
function MY5() {
  return parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10) || 1e8
}
// @from(Start 9516294, End 9516374)
function z21() {
  return parseInt(process.env.MCP_TIMEOUT || "", 10) || 30000
}
// @from(Start 9516376, End 9516473)
function OY5() {
  return parseInt(process.env.MCP_SERVER_CONNECTION_BATCH_SIZE || "", 10) || 3
}
// @from(Start 9516475, End 9516560)
function TY5(A) {
  return !A.name.startsWith("mcp__ide__") || RY5.includes(A.name)
}
// @from(Start 9516562, End 9516621)
function j32(A, Q) {
  return `${A}-${JSON.stringify(Q)}`
}
// @from(Start 9516622, End 9516793)
async function IYA(A, Q) {
  let B = j32(A, Q);
  try {
    let G = await ZYA(A, Q);
    if (G.type === "connected") await G.cleanup()
  } catch {}
  ZYA.cache.delete(B)
}
// @from(Start 9516794, End 9516909)
async function Jh(A, Q, B) {
  return y32({
    client: B,
    tool: A,
    args: Q,
    signal: o9().signal
  })
}
// @from(Start 9516910, End 9517705)
async function D1A(A, Q) {
  try {
    await IYA(A, Q);
    let B = await ZYA(A, Q);
    if (B.type !== "connected") return {
      client: B,
      tools: [],
      commands: []
    };
    let G = !!B.capabilities?.resources,
      [Z, I, Y] = await Promise.all([x10(B), _32(B), G ? S32(B) : Promise.resolve([])]),
      J = [];
    if (G) {
      if (![Wh, Xh].some((X) => Z.some((V) => V.name === X.name))) J.push(Wh, Xh)
    }
    return {
      client: B,
      tools: [...Z, ...J],
      commands: I,
      resources: Y.length > 0 ? Y : void 0
    }
  } catch (B) {
    return WI(A, `Error during reconnection: ${B instanceof Error?B.message:String(B)}`), {
      client: {
        name: A,
        type: "failed",
        config: Q
      },
      tools: [],
      commands: []
    }
  }
}
// @from(Start 9517706, End 9517846)
async function PY5(A, Q, B) {
  for (let G = 0; G < A.length; G += Q) {
    let Z = A.slice(G, G + Q);
    await Promise.all(Z.map(B))
  }
}
// @from(Start 9517847, End 9519440)
async function v10(A, Q) {
  let B = !1,
    G = Object.entries(Q ?? (await fk()).servers),
    Z = G.length,
    I = G.filter(([V, F]) => F.type === "stdio").length,
    Y = G.filter(([V, F]) => F.type === "sse").length,
    J = G.filter(([V, F]) => F.type === "http").length,
    W = G.filter(([V, F]) => F.type === "sse-ide").length,
    X = G.filter(([V, F]) => F.type === "ws-ide").length;
  await PY5(G, OY5(), async ([V, F]) => {
    try {
      if (IMA(V)) {
        A({
          client: {
            name: V,
            type: "disabled",
            config: F
          },
          tools: [],
          commands: []
        });
        return
      }
      let D = await ZYA(V, F, {
        totalServers: Z,
        stdioCount: I,
        sseCount: Y,
        httpCount: J,
        sseIdeCount: W,
        wsIdeCount: X
      });
      if (D.type !== "connected") {
        A({
          client: D,
          tools: [],
          commands: []
        });
        return
      }
      let H = !!D.capabilities?.resources,
        [C, E, U] = await Promise.all([x10(D), _32(D), H ? S32(D) : Promise.resolve([])]),
        q = [];
      if (H && !B) B = !0, q.push(Wh, Xh);
      A({
        client: D,
        tools: [...C, ...q],
        commands: E,
        resources: U.length > 0 ? U : void 0
      })
    } catch (K) {
      WI(V, `Error fetching tools/commands/resources: ${K instanceof Error?K.message:String(K)}`), A({
        client: {
          name: V,
          type: "failed",
          config: F
        },
        tools: [],
        commands: []
      })
    }
  })
}
// @from(Start 9519441, End 9520940)
async function k32(A, Q) {
  switch (A.type) {
    case "text":
      return [{
        type: "text",
        text: A.text
      }];
    case "image": {
      let B = Buffer.from(String(A.data), "base64"),
        G = await rt(B, void 0, A.mimeType);
      return [{
        type: "image",
        source: {
          data: G.base64,
          media_type: G.mediaType,
          type: "base64"
        }
      }]
    }
    case "resource": {
      let B = A.resource,
        G = `[Resource from ${Q} at ${B.uri}] `;
      if ("text" in B) return [{
        type: "text",
        text: `${G}${B.text}`
      }];
      else if ("blob" in B)
        if (LY5.has(B.mimeType ?? "")) {
          let I = Buffer.from(B.blob, "base64"),
            Y = await rt(I, void 0, B.mimeType),
            J = [];
          if (G) J.push({
            type: "text",
            text: G
          });
          return J.push({
            type: "image",
            source: {
              data: Y.base64,
              media_type: Y.mediaType,
              type: "base64"
            }
          }), J
        } else return [{
          type: "text",
          text: `${G}Base64 data (${B.mimeType||"unknown type"}) ${B.blob}`
        }];
      return []
    }
    case "resource_link": {
      let B = A,
        G = `[Resource link: ${B.name}] ${B.uri}`;
      if (B.description) G += ` (${B.description})`;
      return [{
        type: "text",
        text: G
      }]
    }
    default:
      return []
  }
}
// @from(Start 9520942, End 9521356)
function U21(A, Q = 2) {
  if (A === null) return "null";
  if (Array.isArray(A)) {
    if (A.length === 0) return "[]";
    return `[${U21(A[0],Q-1)}]`
  }
  if (typeof A === "object") {
    if (Q <= 0) return "{...}";
    let G = Object.entries(A).slice(0, 10).map(([I, Y]) => `${I}: ${U21(Y,Q-1)}`),
      Z = Object.keys(A).length > 10 ? ", ..." : "";
    return `{${G.join(", ")}${Z}}`
  }
  return typeof A
}
// @from(Start 9521357, End 9522054)
async function b10(A, Q, B) {
  if (A && typeof A === "object") {
    if ("toolResult" in A) return {
      content: String(A.toolResult),
      type: "toolResult"
    };
    if ("structuredContent" in A && A.structuredContent !== void 0) return {
      content: JSON.stringify(A.structuredContent),
      type: "structuredContent",
      schema: U21(A.structuredContent)
    };
    if ("content" in A && Array.isArray(A.content)) {
      let Z = (await Promise.all(A.content.map((I) => k32(I, B)))).flat();
      return {
        content: Z,
        type: "contentArray",
        schema: U21(Z)
      }
    }
  }
  let G = `Unexpected response format from tool ${Q}`;
  throw WI(B, G), Error(G)
}
// @from(Start 9522055, End 9522186)
async function jY5(A, Q, B) {
  let {
    content: G
  } = await b10(A, Q, B);
  if (B !== "ide") return await DB2(G);
  return G
}
// @from(Start 9522187, End 9523587)
async function y32({
  client: {
    client: A,
    name: Q
  },
  tool: B,
  args: G,
  meta: Z,
  signal: I
}) {
  let Y = Date.now(),
    J;
  try {
    y0(Q, `Calling MCP tool: ${B}`), J = setInterval(() => {
      let F = Date.now() - Y,
        D = `${Math.floor(F/1000)}s`;
      y0(Q, `Tool '${B}' still running (${D} elapsed)`)
    }, 30000);
    let W = await A.callTool({
      name: B,
      arguments: G,
      _meta: Z
    }, aT, {
      signal: I,
      timeout: MY5()
    });
    if ("isError" in W && W.isError) {
      let F = "Unknown error";
      if ("content" in W && Array.isArray(W.content) && W.content.length > 0) {
        let K = W.content[0];
        if (K && typeof K === "object" && "text" in K) F = K.text
      } else if ("error" in W) F = String(W.error);
      throw WI(Q, F), Error(F)
    }
    let X = Date.now() - Y,
      V = X < 1000 ? `${X}ms` : X < 60000 ? `${Math.floor(X/1000)}s` : `${Math.floor(X/60000)}m ${Math.floor(X%60000/1000)}s`;
    return y0(Q, `Tool '${B}' completed successfully in ${V}`), await jY5(W, B, Q)
  } catch (W) {
    if (J !== void 0) clearInterval(J);
    let X = Date.now() - Y;
    if (W instanceof Error && W.name !== "AbortError") y0(Q, `Tool '${B}' failed after ${Math.floor(X/1000)}s: ${W.message}`);
    if (!(W instanceof Error) || W.name !== "AbortError") throw W
  } finally {
    if (J !== void 0) clearInterval(J)
  }
}
// @from(Start 9523589, End 9523698)
function SY5(A) {
  if (A.message.content[0]?.type !== "tool_use") return;
  return A.message.content[0].id
}
// @from(Start 9523699, End 9525361)
async function x32(A, Q) {
  let B = [],
    G = [],
    Z = await Promise.allSettled(Object.entries(A).map(async ([I, Y]) => {
      let J = new y10(I, Q),
        W = new BQ1({
          name: "claude-code",
          version: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.0.59",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
          }.VERSION ?? "unknown"
        }, {
          capabilities: {}
        });
      try {
        await W.connect(J);
        let X = W.getServerCapabilities(),
          V = {
            type: "connected",
            name: I,
            capabilities: X || {},
            client: W,
            config: {
              ...Y,
              scope: "dynamic"
            },
            cleanup: async () => {
              await W.close()
            }
          },
          F = [];
        if (X?.tools) {
          let K = await x10(V);
          F.push(...K)
        }
        return {
          client: V,
          tools: F
        }
      } catch (X) {
        return WI(I, `Failed to connect SDK MCP server: ${X}`), {
          client: {
            type: "failed",
            name: I,
            config: {
              ...Y,
              scope: "user"
            }
          },
          tools: []
        }
      }
    }));
  for (let I of Z)
    if (I.status === "fulfilled") B.push(I.value.client), G.push(...I.value.tools);
  return {
    clients: B,
    tools: G
  }
}
// @from(Start 9525366, End 9525369)
LY5
// @from(Start 9525371, End 9525374)
RY5
// @from(Start 9525376, End 9525379)
ZYA
// @from(Start 9525381, End 9525384)
x10
// @from(Start 9525386, End 9525389)
S32
// @from(Start 9525391, End 9525394)
_32
// @from(Start 9525396, End 9525399)
$21
// @from(Start 9525405, End 9543430)
Ok = L(() => {
  l2();
  dUA();
  qQ2();
  LQ2();
  uQ2();
  dQ2();
  SD();
  Ym0();
  g1();
  AE();
  q0();
  nY();
  _0();
  HH();
  yQ1();
  vQ1();
  nX();
  CB2();
  v3A();
  _c();
  OZ();
  ot();
  OB2();
  fQ1();
  hQ1();
  rQ1();
  tM();
  P32();
  VLA();
  LY5 = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
  RY5 = ["mcp__ide__executeCode", "mcp__ide__getDiagnostics"];
  ZYA = s1(async (A, Q, B) => {
    let G = Date.now();
    try {
      let Z, I = cAA();
      if (Q.type === "sse") {
        let w = new lAA(A, Q),
          N = await E21(A, Q),
          R = {
            authProvider: w,
            requestInit: {
              headers: {
                "User-Agent": Wt(),
                ...N
              },
              signal: AbortSignal.timeout(60000)
            }
          };
        if (Object.keys(N).length > 0) R.eventSourceInit = {
          fetch: async (T, y) => {
            let v = {},
              x = await w.tokens();
            if (x) v.Authorization = `Bearer ${x.access_token}`;
            let p = b3A();
            return fetch(T, {
              ...y,
              ...p,
              headers: {
                "User-Agent": Wt(),
                ...v,
                ...y?.headers,
                ...N,
                Accept: "text/event-stream"
              }
            })
          }
        };
        Z = new NQ1(new URL(Q.url), R), y0(A, "SSE transport initialized, awaiting connection")
      } else if (Q.type === "sse-ide") {
        y0(A, `Setting up SSE-IDE transport to ${Q.url}`);
        let w = b3A(),
          N = w.dispatcher ? {
            eventSourceInit: {
              fetch: async (R, T) => {
                return fetch(R, {
                  ...T,
                  ...w,
                  headers: {
                    "User-Agent": Wt(),
                    ...T?.headers
                  }
                })
              }
            }
          } : {};
        Z = new NQ1(new URL(Q.url), Object.keys(N).length > 0 ? N : void 0)
      } else if (Q.type === "ws-ide") {
        let w = yv1(),
          N = {
            headers: {
              "User-Agent": Wt(),
              ...Q.authToken && {
                "X-Claude-Code-Ide-Authorization": Q.authToken
              }
            },
            agent: RzA(Q.url),
            ...w || {}
          },
          R = new mUA.default(Q.url, ["mcp"], Object.keys(N).length > 0 ? N : void 0);
        Z = new bQ1(R)
      } else if (Q.type === "ws") {
        y0(A, `Initializing WebSocket transport to ${Q.url}`);
        let w = await E21(A, Q),
          N = yv1(),
          R = {
            headers: {
              "User-Agent": Wt(),
              ...I && {
                Authorization: `Bearer ${I}`
              },
              ...w
            },
            agent: RzA(Q.url),
            ...N || {}
          };
        y0(A, `WebSocket transport options: ${JSON.stringify({url:Q.url,headers:R.headers,hasSessionAuth:!!I})}`);
        let T = new mUA.default(Q.url, ["mcp"], Object.keys(R).length > 0 ? R : void 0);
        Z = new bQ1(T)
      } else if (Q.type === "http") {
        y0(A, `Initializing HTTP transport to ${Q.url}`), y0(A, `Node version: ${process.version}, Platform: ${process.platform}`), y0(A, `Environment: ${JSON.stringify({NODE_OPTIONS:process.env.NODE_OPTIONS||"not set",UV_THREADPOOL_SIZE:process.env.UV_THREADPOOL_SIZE||"default",HTTP_PROXY:process.env.HTTP_PROXY||"not set",HTTPS_PROXY:process.env.HTTPS_PROXY||"not set",NO_PROXY:process.env.NO_PROXY||"not set"})}`);
        let w = new lAA(A, Q),
          N = await E21(A, Q),
          R = b3A();
        y0(A, `Proxy options: ${R.dispatcher?"custom dispatcher":"default"}`);
        let T = {
          authProvider: w,
          requestInit: {
            ...R,
            headers: {
              "User-Agent": Wt(),
              ...I && {
                Authorization: `Bearer ${I}`
              },
              ...N
            },
            signal: AbortSignal.timeout(60000)
          }
        };
        y0(A, `HTTP transport options: ${JSON.stringify({url:Q.url,headers:T.requestInit?.headers,hasAuthProvider:!!w,timeoutMs:60000})}`), Z = new Xe1(new URL(Q.url), T), y0(A, "HTTP transport created successfully")
      } else if (Q.type === "sdk") throw Error("SDK servers should be handled in print.ts");
      else {
        let w = process.env.CLAUDE_CODE_SHELL_PREFIX || Q.command,
          N = process.env.CLAUDE_CODE_SHELL_PREFIX ? [
            [Q.command, ...Q.args].join(" ")
          ] : Q.args;
        Z = new ut1({
          command: w,
          args: N,
          env: {
            ...process.env,
            ...Q.env
          },
          stderr: "pipe"
        })
      }
      if (Q.type === "stdio" || !Q.type) {
        let w = Z;
        if (w.stderr) w.stderr.on("data", (N) => {
          let R = N.toString().trim();
          if (R) WI(A, `Server stderr: ${R}`)
        })
      }
      let Y = new BQ1({
        name: "claude-code",
        version: {
          ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
          PACKAGE_URL: "@anthropic-ai/claude-code",
          README_URL: "https://code.claude.com/docs/en/overview",
          VERSION: "2.0.59",
          FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
        }.VERSION ?? "unknown"
      }, {
        capabilities: {
          roots: {},
          ...{}
        }
      });
      if (Q.type === "http") y0(A, "Client created, setting up request handler");
      if (Y.setRequestHandler(Kt1, async () => {
          return y0(A, "Received ListRoots request from server"), {
            roots: [{
              uri: `file://${uQ()}`
            }]
          }
        }), y0(A, `Starting connection with timeout of ${z21()}ms`), Q.type === "http") {
        y0(A, `Testing basic HTTP connectivity to ${Q.url}`);
        try {
          let w = new URL(Q.url);
          if (y0(A, `Parsed URL: host=${w.hostname}, port=${w.port||"default"}, protocol=${w.protocol}`), w.hostname === "127.0.0.1" || w.hostname === "localhost") y0(A, `Using loopback address: ${w.hostname}`)
        } catch (w) {
          y0(A, `Failed to parse URL: ${w}`)
        }
      }
      let J = Y.connect(Z),
        W = new Promise((w, N) => {
          let R = setTimeout(() => {
            let T = Date.now() - G;
            y0(A, `Connection timeout triggered after ${T}ms (limit: ${z21()}ms)`), N(Error(`Connection to MCP server "${A}" timed out after ${z21()}ms`))
          }, z21());
          J.then(() => {
            clearTimeout(R)
          }, (T) => {
            clearTimeout(R)
          })
        });
      try {
        await Promise.race([J, W]);
        let w = Date.now() - G;
        y0(A, `Successfully connected to ${Q.type} server in ${w}ms`)
      } catch (w) {
        let N = Date.now() - G;
        if (Q.type === "sse" && w instanceof Error) {
          if (y0(A, `SSE Connection failed after ${N}ms: ${JSON.stringify({url:Q.url,error:w.message,errorType:w.constructor.name,stack:w.stack})}`), WI(A, w), w instanceof rH) return GA("tengu_mcp_server_needs_auth", {}), y0(A, "Authentication required for SSE server"), {
            name: A,
            type: "needs-auth",
            config: Q
          }
        } else if (Q.type === "http" && w instanceof Error) {
          let R = w;
          if (y0(A, `HTTP Connection failed after ${N}ms: ${w.message} (code: ${R.code||"none"}, errno: ${R.errno||"none"})`), WI(A, w), w instanceof rH) return GA("tengu_mcp_server_needs_auth", {}), y0(A, "Authentication required for HTTP server"), {
            name: A,
            type: "needs-auth",
            config: Q
          }
        } else if (Q.type === "sse-ide" || Q.type === "ws-ide") GA("tengu_mcp_ide_server_connection_failed", {});
        throw w
      }
      let X = Y.getServerCapabilities(),
        V = Y.getServerVersion(),
        F = Y.getInstructions();
      if (y0(A, `Connection established with capabilities: ${JSON.stringify({hasTools:!!X?.tools,hasPrompts:!!X?.prompts,hasResources:!!X?.resources,serverVersion:V||"unknown"})}`), Q.type === "sse-ide" || Q.type === "ws-ide") {
        GA("tengu_mcp_ide_server_connection_succeeded", {
          serverVersion: V
        });
        try {
          BB2(Y)
        } catch (w) {
          WI(A, `Failed to send ide_connected notification: ${w}`)
        }
      }
      let K = Date.now(),
        D = !1,
        H = Y.onerror,
        C = Y.onclose;
      Y.onerror = (w) => {
        let N = Date.now() - K;
        D = !0;
        let R = Q.type || "stdio";
        if (y0(A, `${R.toUpperCase()} connection dropped after ${Math.floor(N/1000)}s uptime`), w.message)
          if (w.message.includes("ECONNRESET")) y0(A, "Connection reset - server may have crashed or restarted");
          else if (w.message.includes("ETIMEDOUT")) y0(A, "Connection timeout - network issue or server unresponsive");
        else if (w.message.includes("ECONNREFUSED")) y0(A, "Connection refused - server may be down");
        else if (w.message.includes("EPIPE")) y0(A, "Broken pipe - server closed connection unexpectedly");
        else if (w.message.includes("EHOSTUNREACH")) y0(A, "Host unreachable - network connectivity issue");
        else if (w.message.includes("ESRCH")) y0(A, "Process not found - stdio server process terminated");
        else if (w.message.includes("spawn")) y0(A, "Failed to spawn process - check command and permissions");
        else y0(A, `Connection error: ${w.message}`);
        if (H) H(w)
      }, Y.onclose = () => {
        let w = Date.now() - K,
          N = Q.type ?? "unknown";
        if (y0(A, `${N.toUpperCase()} connection closed after ${Math.floor(w/1000)}s (${D?"with errors":"cleanly"})`), C) C()
      };
      let E = async () => {
        if (Q.type === "stdio") try {
          let N = Z.pid;
          if (N) {
            y0(A, "Sending SIGINT to MCP server process");
            try {
              process.kill(N, "SIGINT")
            } catch (R) {
              y0(A, `Error sending SIGINT: ${R}`);
              return
            }
            await new Promise(async (R) => {
              let T = !1,
                y = setInterval(() => {
                  try {
                    process.kill(N, 0)
                  } catch {
                    if (!T) T = !0, clearInterval(y), clearTimeout(v), y0(A, "MCP server process exited cleanly"), R()
                  }
                }, 50),
                v = setTimeout(() => {
                  if (!T) T = !0, clearInterval(y), y0(A, "Cleanup timeout reached, stopping process monitoring"), R()
                }, 600);
              try {
                if (await new Promise((x) => setTimeout(x, 100)), !T) {
                  try {
                    process.kill(N, 0), y0(A, "SIGINT failed, sending SIGTERM to MCP server process");
                    try {
                      process.kill(N, "SIGTERM")
                    } catch (x) {
                      y0(A, `Error sending SIGTERM: ${x}`), T = !0, clearInterval(y), clearTimeout(v), R();
                      return
                    }
                  } catch {
                    T = !0, clearInterval(y), clearTimeout(v), R();
                    return
                  }
                  if (await new Promise((x) => setTimeout(x, 400)), !T) try {
                    process.kill(N, 0), y0(A, "SIGTERM failed, sending SIGKILL to MCP server process");
                    try {
                      process.kill(N, "SIGKILL")
                    } catch (x) {
                      y0(A, `Error sending SIGKILL: ${x}`)
                    }
                  } catch {
                    T = !0, clearInterval(y), clearTimeout(v), R()
                  }
                }
                if (!T) T = !0, clearInterval(y), clearTimeout(v), R()
              } catch {
                if (!T) T = !0, clearInterval(y), clearTimeout(v), R()
              }
            })
          }
        } catch (w) {
          y0(A, `Error terminating process: ${w}`)
        }
        try {
          await Y.close()
        } catch (w) {
          y0(A, `Error closing client: ${w}`)
        }
      }, U = PG(E), q = async () => {
        U?.(), await E()
      };
      return GA("tengu_mcp_server_connection_succeeded", {}), {
        name: A,
        client: Y,
        type: "connected",
        capabilities: X ?? {},
        serverInfo: V,
        instructions: F,
        config: Q,
        cleanup: q
      }
    } catch (Z) {
      GA("tengu_mcp_server_connection_failed", {
        totalServers: B?.totalServers || 1,
        stdioCount: B?.stdioCount || (Q.type === "stdio" ? 1 : 0),
        sseCount: B?.sseCount || (Q.type === "sse" ? 1 : 0),
        httpCount: B?.httpCount || (Q.type === "http" ? 1 : 0),
        sseIdeCount: B?.sseIdeCount || (Q.type === "sse-ide" ? 1 : 0),
        wsIdeCount: B?.wsIdeCount || (Q.type === "ws-ide" ? 1 : 0),
        transportType: Q.type
      });
      let I = Date.now() - (G || 0);
      return y0(A, `Connection failed after ${I}ms: ${Z instanceof Error?Z.message:String(Z)}`), WI(A, `Connection failed: ${Z instanceof Error?Z.message:String(Z)}`), {
        name: A,
        type: "failed",
        config: Q
      }
    }
  }, j32);
  x10 = s1(async (A) => {
    if (A.type !== "connected") return [];
    try {
      if (!A.capabilities?.tools) return [];
      let Q = await A.client.request({
        method: "tools/list"
      }, ALA);
      return qIA(Q.tools).map((G) => ({
        ...MB2,
        name: `mcp__${n7(A.name)}__${n7(G.name)}`,
        originalMcpToolName: G.name,
        isMcp: !0,
        async description() {
          return G.description ?? ""
        },
        async prompt() {
          return G.description ?? ""
        },
        isConcurrencySafe() {
          return G.annotations?.readOnlyHint ?? !1
        },
        isReadOnly() {
          return G.annotations?.readOnlyHint ?? !1
        },
        isDestructive() {
          return G.annotations?.destructiveHint ?? !1
        },
        isOpenWorld() {
          return G.annotations?.openWorldHint ?? !1
        },
        inputJSONSchema: G.inputSchema,
        async call(Z, I, Y, J) {
          let W = SY5(J),
            X = W ? {
              "claudecode/toolUseId": W
            } : {};
          return {
            data: await y32({
              client: A,
              tool: G.name,
              args: Z,
              meta: X,
              signal: I.abortController.signal
            })
          }
        },
        userFacingName() {
          let Z = G.annotations?.title || G.name;
          return `${A.name} - ${Z} (MCP)`
        }
      })).filter(TY5)
    } catch (Q) {
      return WI(A.name, `Failed to fetch tools: ${Q instanceof Error?Q.message:String(Q)}`), []
    }
  }), S32 = s1(async (A) => {
    if (A.type !== "connected") return [];
    try {
      if (!A.capabilities?.resources) return [];
      let Q = await A.client.request({
        method: "resources/list"
      }, gAA);
      if (!Q.resources) return [];
      return Q.resources.map((B) => ({
        ...B,
        server: A.name
      }))
    } catch (Q) {
      return WI(A.name, `Failed to fetch resources: ${Q instanceof Error?Q.message:String(Q)}`), []
    }
  }), _32 = s1(async (A) => {
    if (A.type !== "connected") return [];
    let Q = A;
    try {
      if (!A.capabilities?.prompts) return [];
      let B = await A.client.request({
        method: "prompts/list"
      }, eNA);
      if (!B.prompts) return [];
      return qIA(B.prompts).map((Z) => {
        let I = Object.values(Z.arguments ?? {}).map((Y) => Y.name);
        return {
          type: "prompt",
          name: "mcp__" + n7(Q.name) + "__" + Z.name,
          description: Z.description ?? "",
          hasUserSpecifiedDescription: !!Z.description,
          isEnabled: () => !0,
          isHidden: !1,
          isMcp: !0,
          progressMessage: "running",
          userFacingName() {
            let Y = Z.title || Z.name;
            return `${Q.name}:${Y} (MCP)`
          },
          argNames: I,
          source: "mcp",
          async getPromptForCommand(Y) {
            let J = Y.split(" ");
            try {
              let W = await Q.client.getPrompt({
                name: Z.name,
                arguments: Im0(I, J)
              });
              return (await Promise.all(W.messages.map((V) => k32(V.content, A.name)))).flat()
            } catch (W) {
              throw WI(A.name, `Error running command '${Z.name}': ${W instanceof Error?W.message:String(W)}`), W
            }
          }
        }
      })
    } catch (B) {
      return WI(A.name, `Failed to fetch commands: ${B instanceof Error?B.message:String(B)}`), []
    }
  });
  $21 = s1(async (A) => {
    return new Promise((Q) => {
      let B = 0,
        G = 0;
      if (B = Object.keys(A).length, B === 0) {
        Q({
          clients: [],
          tools: [],
          commands: []
        });
        return
      }
      let Z = [],
        I = [],
        Y = [];
      v10((J) => {
        if (Z.push(J.client), I.push(...J.tools), Y.push(...J.commands), G++, G >= B) {
          let W = Y.reduce((X, V) => {
            let F = V.name.length + (V.description ?? "").length + (V.argumentHint ?? "").length;
            return X + F
          }, 0);
          GA("tengu_mcp_tools_commands_loaded", {
            tools_count: I.length,
            commands_count: Y.length,
            commands_metadata_length: W
          }), Q({
            clients: Z,
            tools: I,
            commands: Y
          })
        }
      }, A).catch((J) => {
        WI("prefetchAllMcpResources", `Failed to get MCP resources: ${J instanceof Error?J.message:String(J)}`), Q({
          clients: [],
          tools: [],
          commands: []
        })
      })
    })
  })
})
// @from(Start 9543433, End 9543522)
function yY5(A) {
  let Q = xY5(A),
    B = kY5.get(Q);
  return B !== void 0 ? B : _Y5
}
// @from(Start 9543524, End 9543621)
function xY5(A) {
  let Q = lF(A);
  return (Q[Q.length - 1] || A).trim().split(/\s+/)[0] || ""
}
// @from(Start 9543623, End 9543740)
function v32(A, Q, B, G) {
  let I = yY5(A)(Q, B, G);
  return {
    isError: I.isError,
    message: I.message
  }
}
// @from(Start 9543745, End 9543862)
_Y5 = (A, Q, B) => ({
    isError: A !== 0,
    message: A !== 0 ? `Command failed with exit code ${A}` : void 0
  })
// @from(Start 9543866, End 9543869)
kY5
// @from(Start 9543875, End 9544620)
b32 = L(() => {
  bU();
  kY5 = new Map([
    ["grep", (A, Q, B) => ({
      isError: A >= 2,
      message: A === 1 ? "No matches found" : void 0
    })],
    ["rg", (A, Q, B) => ({
      isError: A >= 2,
      message: A === 1 ? "No matches found" : void 0
    })],
    ["find", (A, Q, B) => ({
      isError: A >= 2,
      message: A === 1 ? "Some directories were inaccessible" : void 0
    })],
    ["diff", (A, Q, B) => ({
      isError: A >= 2,
      message: A === 1 ? "Files differ" : void 0
    })],
    ["test", (A, Q, B) => ({
      isError: A >= 2,
      message: A === 1 ? "Condition is false" : void 0
    })],
    ["[", (A, Q, B) => ({
      isError: A >= 2,
      message: A === 1 ? "Condition is false" : void 0
    })]
  ])
})
// @from(Start 9544623, End 9544835)
function h10() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  }
}
// @from(Start 9544837, End 9544866)
function d32(A) {
  C1A = A
}
// @from(Start 9544868, End 9545193)
function CG(A, Q = "") {
  let B = typeof A === "string" ? A : A.source,
    G = {
      replace: (Z, I) => {
        let Y = typeof I === "string" ? I : I.source;
        return Y = Y.replace(xE.caret, "$1"), B = B.replace(Z, Y), G
      },
      getRegex: () => {
        return new RegExp(B, Q)
      }
    };
  return G
}
// @from(Start 9545195, End 9545402)
function hk(A, Q) {
  if (Q) {
    if (xE.escapeTest.test(A)) return A.replace(xE.escapeReplace, h32)
  } else if (xE.escapeTestNoEncode.test(A)) return A.replace(xE.escapeReplaceNoEncode, h32);
  return A
}
// @from(Start 9545404, End 9545526)
function g32(A) {
  try {
    A = encodeURI(A).replace(xE.percentDecode, "%")
  } catch {
    return null
  }
  return A
}
// @from(Start 9545528, End 9546036)
function u32(A, Q) {
  let B = A.replace(xE.findPipe, (I, Y, J) => {
      let W = !1,
        X = Y;
      while (--X >= 0 && J[X] === "\\") W = !W;
      if (W) return "|";
      else return " |"
    }),
    G = B.split(xE.splitPipe),
    Z = 0;
  if (!G[0].trim()) G.shift();
  if (G.length > 0 && !G.at(-1)?.trim()) G.pop();
  if (Q)
    if (G.length > Q) G.splice(Q);
    else
      while (G.length < Q) G.push("");
  for (; Z < G.length; Z++) G[Z] = G[Z].trim().replace(xE.slashPipe, "|");
  return G
}
// @from(Start 9546038, End 9546221)
function JMA(A, Q, B) {
  let G = A.length;
  if (G === 0) return "";
  let Z = 0;
  while (Z < G)
    if (A.charAt(G - Z - 1) === Q) Z++;
    else break;
  return A.slice(0, G - Z)
}