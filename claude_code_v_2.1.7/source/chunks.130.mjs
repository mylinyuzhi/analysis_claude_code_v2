
// @from(Ln 380460, Col 4)
Io2 = U((PXY, Xo2) => {
  var Z2 = H8();
  xt();
  Nx();
  yfA();
  yt();
  J3A();
  Ww0();
  Xj();
  _7();
  GF1();
  var g1 = Z2.asn1,
    UU = Xo2.exports = Z2.pkcs7 = Z2.pkcs7 || {};
  UU.messageFromPem = function (A) {
    var Q = Z2.pem.decode(A)[0];
    if (Q.type !== "PKCS7") {
      var B = Error('Could not convert PKCS#7 message from PEM; PEM header type is not "PKCS#7".');
      throw B.headerType = Q.type, B
    }
    if (Q.procType && Q.procType.type === "ENCRYPTED") throw Error("Could not convert PKCS#7 message from PEM; PEM is encrypted.");
    var G = g1.fromDer(Q.body);
    return UU.messageFromAsn1(G)
  };
  UU.messageToPem = function (A, Q) {
    var B = {
      type: "PKCS7",
      body: g1.toDer(A.toAsn1()).getBytes()
    };
    return Z2.pem.encode(B, {
      maxline: Q
    })
  };
  UU.messageFromAsn1 = function (A) {
    var Q = {},
      B = [];
    if (!g1.validate(A, UU.asn1.contentInfoValidator, Q, B)) {
      var G = Error("Cannot read PKCS#7 message. ASN.1 object is not an PKCS#7 ContentInfo.");
      throw G.errors = B, G
    }
    var Z = g1.derToOid(Q.contentType),
      Y;
    switch (Z) {
      case Z2.pki.oids.envelopedData:
        Y = UU.createEnvelopedData();
        break;
      case Z2.pki.oids.encryptedData:
        Y = UU.createEncryptedData();
        break;
      case Z2.pki.oids.signedData:
        Y = UU.createSignedData();
        break;
      default:
        throw Error("Cannot read PKCS#7 message. ContentType with OID " + Z + " is not (yet) supported.")
    }
    return Y.fromAsn1(Q.content.value[0]), Y
  };
  UU.createSignedData = function () {
    var A = null;
    return A = {
      type: Z2.pki.oids.signedData,
      version: 1,
      certificates: [],
      crls: [],
      signers: [],
      digestAlgorithmIdentifiers: [],
      contentInfo: null,
      signerInfos: [],
      fromAsn1: function (G) {
        if (gw0(A, G, UU.asn1.signedDataValidator), A.certificates = [], A.crls = [], A.digestAlgorithmIdentifiers = [], A.contentInfo = null, A.signerInfos = [], A.rawCapture.certificates) {
          var Z = A.rawCapture.certificates.value;
          for (var Y = 0; Y < Z.length; ++Y) A.certificates.push(Z2.pki.certificateFromAsn1(Z[Y]))
        }
      },
      toAsn1: function () {
        if (!A.contentInfo) A.sign();
        var G = [];
        for (var Z = 0; Z < A.certificates.length; ++Z) G.push(Z2.pki.certificateToAsn1(A.certificates[Z]));
        var Y = [],
          J = g1.create(g1.Class.CONTEXT_SPECIFIC, 0, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.INTEGER, !1, g1.integerToDer(A.version).getBytes()), g1.create(g1.Class.UNIVERSAL, g1.Type.SET, !0, A.digestAlgorithmIdentifiers), A.contentInfo])]);
        if (G.length > 0) J.value[0].value.push(g1.create(g1.Class.CONTEXT_SPECIFIC, 0, !0, G));
        if (Y.length > 0) J.value[0].value.push(g1.create(g1.Class.CONTEXT_SPECIFIC, 1, !0, Y));
        return J.value[0].value.push(g1.create(g1.Class.UNIVERSAL, g1.Type.SET, !0, A.signerInfos)), g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.OID, !1, g1.oidToDer(A.type).getBytes()), J])
      },
      addSigner: function (G) {
        var {
          issuer: Z,
          serialNumber: Y
        } = G;
        if (G.certificate) {
          var J = G.certificate;
          if (typeof J === "string") J = Z2.pki.certificateFromPem(J);
          Z = J.issuer.attributes, Y = J.serialNumber
        }
        var X = G.key;
        if (!X) throw Error("Could not add PKCS#7 signer; no private key specified.");
        if (typeof X === "string") X = Z2.pki.privateKeyFromPem(X);
        var I = G.digestAlgorithm || Z2.pki.oids.sha1;
        switch (I) {
          case Z2.pki.oids.sha1:
          case Z2.pki.oids.sha256:
          case Z2.pki.oids.sha384:
          case Z2.pki.oids.sha512:
          case Z2.pki.oids.md5:
            break;
          default:
            throw Error("Could not add PKCS#7 signer; unknown message digest algorithm: " + I)
        }
        var D = G.authenticatedAttributes || [];
        if (D.length > 0) {
          var W = !1,
            K = !1;
          for (var V = 0; V < D.length; ++V) {
            var F = D[V];
            if (!W && F.type === Z2.pki.oids.contentType) {
              if (W = !0, K) break;
              continue
            }
            if (!K && F.type === Z2.pki.oids.messageDigest) {
              if (K = !0, W) break;
              continue
            }
          }
          if (!W || !K) throw Error("Invalid signer.authenticatedAttributes. If signer.authenticatedAttributes is specified, then it must contain at least two attributes, PKCS #9 content-type and PKCS #9 message-digest.")
        }
        A.signers.push({
          key: X,
          version: 1,
          issuer: Z,
          serialNumber: Y,
          digestAlgorithm: I,
          signatureAlgorithm: Z2.pki.oids.rsaEncryption,
          signature: null,
          authenticatedAttributes: D,
          unauthenticatedAttributes: []
        })
      },
      sign: function (G) {
        if (G = G || {}, typeof A.content !== "object" || A.contentInfo === null) {
          if (A.contentInfo = g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.OID, !1, g1.oidToDer(Z2.pki.oids.data).getBytes())]), "content" in A) {
            var Z;
            if (A.content instanceof Z2.util.ByteBuffer) Z = A.content.bytes();
            else if (typeof A.content === "string") Z = Z2.util.encodeUtf8(A.content);
            if (G.detached) A.detachedContent = g1.create(g1.Class.UNIVERSAL, g1.Type.OCTETSTRING, !1, Z);
            else A.contentInfo.value.push(g1.create(g1.Class.CONTEXT_SPECIFIC, 0, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.OCTETSTRING, !1, Z)]))
          }
        }
        if (A.signers.length === 0) return;
        var Y = Q();
        B(Y)
      },
      verify: function () {
        throw Error("PKCS#7 signature verification not yet implemented.")
      },
      addCertificate: function (G) {
        if (typeof G === "string") G = Z2.pki.certificateFromPem(G);
        A.certificates.push(G)
      },
      addCertificateRevokationList: function (G) {
        throw Error("PKCS#7 CRL support not yet implemented.")
      }
    }, A;

    function Q() {
      var G = {};
      for (var Z = 0; Z < A.signers.length; ++Z) {
        var Y = A.signers[Z],
          J = Y.digestAlgorithm;
        if (!(J in G)) G[J] = Z2.md[Z2.pki.oids[J]].create();
        if (Y.authenticatedAttributes.length === 0) Y.md = G[J];
        else Y.md = Z2.md[Z2.pki.oids[J]].create()
      }
      A.digestAlgorithmIdentifiers = [];
      for (var J in G) A.digestAlgorithmIdentifiers.push(g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.OID, !1, g1.oidToDer(J).getBytes()), g1.create(g1.Class.UNIVERSAL, g1.Type.NULL, !1, "")]));
      return G
    }

    function B(G) {
      var Z;
      if (A.detachedContent) Z = A.detachedContent;
      else Z = A.contentInfo.value[1], Z = Z.value[0];
      if (!Z) throw Error("Could not sign PKCS#7 message; there is no content to sign.");
      var Y = g1.derToOid(A.contentInfo.value[0].value),
        J = g1.toDer(Z);
      J.getByte(), g1.getBerValueLength(J), J = J.getBytes();
      for (var X in G) G[X].start().update(J);
      var I = new Date;
      for (var D = 0; D < A.signers.length; ++D) {
        var W = A.signers[D];
        if (W.authenticatedAttributes.length === 0) {
          if (Y !== Z2.pki.oids.data) throw Error("Invalid signer; authenticatedAttributes must be present when the ContentInfo content type is not PKCS#7 Data.")
        } else {
          W.authenticatedAttributesAsn1 = g1.create(g1.Class.CONTEXT_SPECIFIC, 0, !0, []);
          var K = g1.create(g1.Class.UNIVERSAL, g1.Type.SET, !0, []);
          for (var V = 0; V < W.authenticatedAttributes.length; ++V) {
            var F = W.authenticatedAttributes[V];
            if (F.type === Z2.pki.oids.messageDigest) F.value = G[W.digestAlgorithm].digest();
            else if (F.type === Z2.pki.oids.signingTime) {
              if (!F.value) F.value = I
            }
            K.value.push(hw0(F)), W.authenticatedAttributesAsn1.value.push(hw0(F))
          }
          J = g1.toDer(K).getBytes(), W.md.start().update(J)
        }
        W.signature = W.key.sign(W.md, "RSASSA-PKCS1-V1_5")
      }
      A.signerInfos = qQ7(A.signers)
    }
  };
  UU.createEncryptedData = function () {
    var A = null;
    return A = {
      type: Z2.pki.oids.encryptedData,
      version: 0,
      encryptedContent: {
        algorithm: Z2.pki.oids["aes256-CBC"]
      },
      fromAsn1: function (Q) {
        gw0(A, Q, UU.asn1.encryptedDataValidator)
      },
      decrypt: function (Q) {
        if (Q !== void 0) A.encryptedContent.key = Q;
        Jo2(A)
      }
    }, A
  };
  UU.createEnvelopedData = function () {
    var A = null;
    return A = {
      type: Z2.pki.oids.envelopedData,
      version: 0,
      recipients: [],
      encryptedContent: {
        algorithm: Z2.pki.oids["aes256-CBC"]
      },
      fromAsn1: function (Q) {
        var B = gw0(A, Q, UU.asn1.envelopedDataValidator);
        A.recipients = $Q7(B.recipientInfos.value)
      },
      toAsn1: function () {
        return g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.OID, !1, g1.oidToDer(A.type).getBytes()), g1.create(g1.Class.CONTEXT_SPECIFIC, 0, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.INTEGER, !1, g1.integerToDer(A.version).getBytes()), g1.create(g1.Class.UNIVERSAL, g1.Type.SET, !0, CQ7(A.recipients)), g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, NQ7(A.encryptedContent))])])])
      },
      findRecipient: function (Q) {
        var B = Q.issuer.attributes;
        for (var G = 0; G < A.recipients.length; ++G) {
          var Z = A.recipients[G],
            Y = Z.issuer;
          if (Z.serialNumber !== Q.serialNumber) continue;
          if (Y.length !== B.length) continue;
          var J = !0;
          for (var X = 0; X < B.length; ++X)
            if (Y[X].type !== B[X].type || Y[X].value !== B[X].value) {
              J = !1;
              break
            } if (J) return Z
        }
        return null
      },
      decrypt: function (Q, B) {
        if (A.encryptedContent.key === void 0 && Q !== void 0 && B !== void 0) switch (Q.encryptedContent.algorithm) {
          case Z2.pki.oids.rsaEncryption:
          case Z2.pki.oids.desCBC:
            var G = B.decrypt(Q.encryptedContent.content);
            A.encryptedContent.key = Z2.util.createBuffer(G);
            break;
          default:
            throw Error("Unsupported asymmetric cipher, OID " + Q.encryptedContent.algorithm)
        }
        Jo2(A)
      },
      addRecipient: function (Q) {
        A.recipients.push({
          version: 0,
          issuer: Q.issuer.attributes,
          serialNumber: Q.serialNumber,
          encryptedContent: {
            algorithm: Z2.pki.oids.rsaEncryption,
            key: Q.publicKey
          }
        })
      },
      encrypt: function (Q, B) {
        if (A.encryptedContent.content === void 0) {
          B = B || A.encryptedContent.algorithm, Q = Q || A.encryptedContent.key;
          var G, Z, Y;
          switch (B) {
            case Z2.pki.oids["aes128-CBC"]:
              G = 16, Z = 16, Y = Z2.aes.createEncryptionCipher;
              break;
            case Z2.pki.oids["aes192-CBC"]:
              G = 24, Z = 16, Y = Z2.aes.createEncryptionCipher;
              break;
            case Z2.pki.oids["aes256-CBC"]:
              G = 32, Z = 16, Y = Z2.aes.createEncryptionCipher;
              break;
            case Z2.pki.oids["des-EDE3-CBC"]:
              G = 24, Z = 8, Y = Z2.des.createEncryptionCipher;
              break;
            default:
              throw Error("Unsupported symmetric cipher, OID " + B)
          }
          if (Q === void 0) Q = Z2.util.createBuffer(Z2.random.getBytes(G));
          else if (Q.length() != G) throw Error("Symmetric key has wrong length; got " + Q.length() + " bytes, expected " + G + ".");
          A.encryptedContent.algorithm = B, A.encryptedContent.key = Q, A.encryptedContent.parameter = Z2.util.createBuffer(Z2.random.getBytes(Z));
          var J = Y(Q);
          if (J.start(A.encryptedContent.parameter.copy()), J.update(A.content), !J.finish()) throw Error("Symmetric encryption failed.");
          A.encryptedContent.content = J.output
        }
        for (var X = 0; X < A.recipients.length; ++X) {
          var I = A.recipients[X];
          if (I.encryptedContent.content !== void 0) continue;
          switch (I.encryptedContent.algorithm) {
            case Z2.pki.oids.rsaEncryption:
              I.encryptedContent.content = I.encryptedContent.key.encrypt(A.encryptedContent.key.data);
              break;
            default:
              throw Error("Unsupported asymmetric cipher, OID " + I.encryptedContent.algorithm)
          }
        }
      }
    }, A
  };

  function EQ7(A) {
    var Q = {},
      B = [];
    if (!g1.validate(A, UU.asn1.recipientInfoValidator, Q, B)) {
      var G = Error("Cannot read PKCS#7 RecipientInfo. ASN.1 object is not an PKCS#7 RecipientInfo.");
      throw G.errors = B, G
    }
    return {
      version: Q.version.charCodeAt(0),
      issuer: Z2.pki.RDNAttributesAsArray(Q.issuer),
      serialNumber: Z2.util.createBuffer(Q.serial).toHex(),
      encryptedContent: {
        algorithm: g1.derToOid(Q.encAlgorithm),
        parameter: Q.encParameter ? Q.encParameter.value : void 0,
        content: Q.encKey
      }
    }
  }

  function zQ7(A) {
    return g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.INTEGER, !1, g1.integerToDer(A.version).getBytes()), g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, [Z2.pki.distinguishedNameToAsn1({
      attributes: A.issuer
    }), g1.create(g1.Class.UNIVERSAL, g1.Type.INTEGER, !1, Z2.util.hexToBytes(A.serialNumber))]), g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.OID, !1, g1.oidToDer(A.encryptedContent.algorithm).getBytes()), g1.create(g1.Class.UNIVERSAL, g1.Type.NULL, !1, "")]), g1.create(g1.Class.UNIVERSAL, g1.Type.OCTETSTRING, !1, A.encryptedContent.content)])
  }

  function $Q7(A) {
    var Q = [];
    for (var B = 0; B < A.length; ++B) Q.push(EQ7(A[B]));
    return Q
  }

  function CQ7(A) {
    var Q = [];
    for (var B = 0; B < A.length; ++B) Q.push(zQ7(A[B]));
    return Q
  }

  function UQ7(A) {
    var Q = g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.INTEGER, !1, g1.integerToDer(A.version).getBytes()), g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, [Z2.pki.distinguishedNameToAsn1({
      attributes: A.issuer
    }), g1.create(g1.Class.UNIVERSAL, g1.Type.INTEGER, !1, Z2.util.hexToBytes(A.serialNumber))]), g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.OID, !1, g1.oidToDer(A.digestAlgorithm).getBytes()), g1.create(g1.Class.UNIVERSAL, g1.Type.NULL, !1, "")])]);
    if (A.authenticatedAttributesAsn1) Q.value.push(A.authenticatedAttributesAsn1);
    if (Q.value.push(g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.OID, !1, g1.oidToDer(A.signatureAlgorithm).getBytes()), g1.create(g1.Class.UNIVERSAL, g1.Type.NULL, !1, "")])), Q.value.push(g1.create(g1.Class.UNIVERSAL, g1.Type.OCTETSTRING, !1, A.signature)), A.unauthenticatedAttributes.length > 0) {
      var B = g1.create(g1.Class.CONTEXT_SPECIFIC, 1, !0, []);
      for (var G = 0; G < A.unauthenticatedAttributes.length; ++G) {
        var Z = A.unauthenticatedAttributes[G];
        B.values.push(hw0(Z))
      }
      Q.value.push(B)
    }
    return Q
  }

  function qQ7(A) {
    var Q = [];
    for (var B = 0; B < A.length; ++B) Q.push(UQ7(A[B]));
    return Q
  }

  function hw0(A) {
    var Q;
    if (A.type === Z2.pki.oids.contentType) Q = g1.create(g1.Class.UNIVERSAL, g1.Type.OID, !1, g1.oidToDer(A.value).getBytes());
    else if (A.type === Z2.pki.oids.messageDigest) Q = g1.create(g1.Class.UNIVERSAL, g1.Type.OCTETSTRING, !1, A.value.bytes());
    else if (A.type === Z2.pki.oids.signingTime) {
      var B = new Date("1950-01-01T00:00:00Z"),
        G = new Date("2050-01-01T00:00:00Z"),
        Z = A.value;
      if (typeof Z === "string") {
        var Y = Date.parse(Z);
        if (!isNaN(Y)) Z = new Date(Y);
        else if (Z.length === 13) Z = g1.utcTimeToDate(Z);
        else Z = g1.generalizedTimeToDate(Z)
      }
      if (Z >= B && Z < G) Q = g1.create(g1.Class.UNIVERSAL, g1.Type.UTCTIME, !1, g1.dateToUtcTime(Z));
      else Q = g1.create(g1.Class.UNIVERSAL, g1.Type.GENERALIZEDTIME, !1, g1.dateToGeneralizedTime(Z))
    }
    return g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.OID, !1, g1.oidToDer(A.type).getBytes()), g1.create(g1.Class.UNIVERSAL, g1.Type.SET, !0, [Q])])
  }

  function NQ7(A) {
    return [g1.create(g1.Class.UNIVERSAL, g1.Type.OID, !1, g1.oidToDer(Z2.pki.oids.data).getBytes()), g1.create(g1.Class.UNIVERSAL, g1.Type.SEQUENCE, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.OID, !1, g1.oidToDer(A.algorithm).getBytes()), !A.parameter ? void 0 : g1.create(g1.Class.UNIVERSAL, g1.Type.OCTETSTRING, !1, A.parameter.getBytes())]), g1.create(g1.Class.CONTEXT_SPECIFIC, 0, !0, [g1.create(g1.Class.UNIVERSAL, g1.Type.OCTETSTRING, !1, A.content.getBytes())])]
  }

  function gw0(A, Q, B) {
    var G = {},
      Z = [];
    if (!g1.validate(Q, B, G, Z)) {
      var Y = Error("Cannot read PKCS#7 message. ASN.1 object is not a supported PKCS#7 message.");
      throw Y.errors = Y, Y
    }
    var J = g1.derToOid(G.contentType);
    if (J !== Z2.pki.oids.data) throw Error("Unsupported PKCS#7 message. Only wrapped ContentType Data supported.");
    if (G.encryptedContent) {
      var X = "";
      if (Z2.util.isArray(G.encryptedContent))
        for (var I = 0; I < G.encryptedContent.length; ++I) {
          if (G.encryptedContent[I].type !== g1.Type.OCTETSTRING) throw Error("Malformed PKCS#7 message, expecting encrypted content constructed of only OCTET STRING objects.");
          X += G.encryptedContent[I].value
        } else X = G.encryptedContent;
      A.encryptedContent = {
        algorithm: g1.derToOid(G.encAlgorithm),
        parameter: Z2.util.createBuffer(G.encParameter.value),
        content: Z2.util.createBuffer(X)
      }
    }
    if (G.content) {
      var X = "";
      if (Z2.util.isArray(G.content))
        for (var I = 0; I < G.content.length; ++I) {
          if (G.content[I].type !== g1.Type.OCTETSTRING) throw Error("Malformed PKCS#7 message, expecting content constructed of only OCTET STRING objects.");
          X += G.content[I].value
        } else X = G.content;
      A.content = Z2.util.createBuffer(X)
    }
    return A.version = G.version.charCodeAt(0), A.rawCapture = G, G
  }

  function Jo2(A) {
    if (A.encryptedContent.key === void 0) throw Error("Symmetric key not available.");
    if (A.content === void 0) {
      var Q;
      switch (A.encryptedContent.algorithm) {
        case Z2.pki.oids["aes128-CBC"]:
        case Z2.pki.oids["aes192-CBC"]:
        case Z2.pki.oids["aes256-CBC"]:
          Q = Z2.aes.createDecryptionCipher(A.encryptedContent.key);
          break;
        case Z2.pki.oids.desCBC:
        case Z2.pki.oids["des-EDE3-CBC"]:
          Q = Z2.des.createDecryptionCipher(A.encryptedContent.key);
          break;
        default:
          throw Error("Unsupported symmetric cipher, OID " + A.encryptedContent.algorithm)
      }
      if (Q.start(A.encryptedContent.parameter), Q.update(A.encryptedContent.content), !Q.finish()) throw Error("Symmetric decryption failed.");
      A.content = Q.output
    }
  }
})
// @from(Ln 380921, Col 4)
Wo2 = U((SXY, Do2) => {
  var HK = H8();
  xt();
  LEA();
  cV1();
  _EA();
  _7();
  var FF1 = Do2.exports = HK.ssh = HK.ssh || {};
  FF1.privateKeyToPutty = function (A, Q, B) {
    B = B || "", Q = Q || "";
    var G = "ssh-rsa",
      Z = Q === "" ? "none" : "aes256-cbc",
      Y = "PuTTY-User-Key-File-2: " + G + `\r
`;
    Y += "Encryption: " + Z + `\r
`, Y += "Comment: " + B + `\r
`;
    var J = HK.util.createBuffer();
    bEA(J, G), gf(J, A.e), gf(J, A.n);
    var X = HK.util.encode64(J.bytes(), 64),
      I = Math.floor(X.length / 66) + 1;
    Y += "Public-Lines: " + I + `\r
`, Y += X;
    var D = HK.util.createBuffer();
    gf(D, A.d), gf(D, A.p), gf(D, A.q), gf(D, A.qInv);
    var W;
    if (!Q) W = HK.util.encode64(D.bytes(), 64);
    else {
      var K = D.length() + 16 - 1;
      K -= K % 16;
      var V = VF1(D.bytes());
      V.truncate(V.length() - K + D.length()), D.putBuffer(V);
      var F = HK.util.createBuffer();
      F.putBuffer(VF1("\x00\x00\x00\x00", Q)), F.putBuffer(VF1("\x00\x00\x00\x01", Q));
      var H = HK.aes.createEncryptionCipher(F.truncate(8), "CBC");
      H.start(HK.util.createBuffer().fillWithByte(0, 16)), H.update(D.copy()), H.finish();
      var E = H.output;
      E.truncate(16), W = HK.util.encode64(E.bytes(), 64)
    }
    I = Math.floor(W.length / 66) + 1, Y += `\r
Private-Lines: ` + I + `\r
`, Y += W;
    var z = VF1("putty-private-key-file-mac-key", Q),
      $ = HK.util.createBuffer();
    bEA($, G), bEA($, Z), bEA($, B), $.putInt32(J.length()), $.putBuffer(J), $.putInt32(D.length()), $.putBuffer(D);
    var O = HK.hmac.create();
    return O.start("sha1", z), O.update($.bytes()), Y += `\r
Private-MAC: ` + O.digest().toHex() + `\r
`, Y
  };
  FF1.publicKeyToOpenSSH = function (A, Q) {
    var B = "ssh-rsa";
    Q = Q || "";
    var G = HK.util.createBuffer();
    return bEA(G, B), gf(G, A.e), gf(G, A.n), B + " " + HK.util.encode64(G.bytes()) + " " + Q
  };
  FF1.privateKeyToOpenSSH = function (A, Q) {
    if (!Q) return HK.pki.privateKeyToPem(A);
    return HK.pki.encryptRsaPrivateKey(A, Q, {
      legacy: !0,
      algorithm: "aes128"
    })
  };
  FF1.getPublicKeyFingerprint = function (A, Q) {
    Q = Q || {};
    var B = Q.md || HK.md.md5.create(),
      G = "ssh-rsa",
      Z = HK.util.createBuffer();
    bEA(Z, G), gf(Z, A.e), gf(Z, A.n), B.start(), B.update(Z.getBytes());
    var Y = B.digest();
    if (Q.encoding === "hex") {
      var J = Y.toHex();
      if (Q.delimiter) return J.match(/.{2}/g).join(Q.delimiter);
      return J
    } else if (Q.encoding === "binary") return Y.getBytes();
    else if (Q.encoding) throw Error('Unknown encoding "' + Q.encoding + '".');
    return Y
  };

  function gf(A, Q) {
    var B = Q.toString(16);
    if (B[0] >= "8") B = "00" + B;
    var G = HK.util.hexToBytes(B);
    A.putInt32(G.length), A.putBytes(G)
  }

  function bEA(A, Q) {
    A.putInt32(Q.length), A.putString(Q)
  }

  function VF1() {
    var A = HK.md.sha1.create(),
      Q = arguments.length;
    for (var B = 0; B < Q; ++B) A.update(arguments[B]);
    return A.digest()
  }
})
// @from(Ln 381018, Col 4)
Vo2 = U((xXY, Ko2) => {
  Ko2.exports = H8();
  xt();
  va2();
  Nx();
  bV1();
  yfA();
  sa2();
  LEA();
  Qo2();
  Go2();
  Yo2();
  Kw0();
  nV1();
  J3A();
  Zw0();
  Hw0();
  Io2();
  zw0();
  Jw0();
  rN0();
  AF1();
  Xj();
  eN0();
  Wo2();
  ww0();
  _7()
})
// @from(Ln 381052, Col 4)
LQ7
// @from(Ln 381052, Col 9)
kXY
// @from(Ln 381053, Col 4)
uw0 = w(() => {
  LQ7 = c(Vo2(), 1), kXY = OQ7(wQ7)
})
// @from(Ln 381056, Col 4)
mw0 = w(() => {
  uw0()
})
// @from(Ln 381059, Col 4)
Fo2
// @from(Ln 381059, Col 9)
RQ7
// @from(Ln 381059, Col 14)
_Q7
// @from(Ln 381059, Col 19)
jQ7
// @from(Ln 381059, Col 24)
TQ7
// @from(Ln 381059, Col 29)
PQ7
// @from(Ln 381059, Col 34)
SQ7
// @from(Ln 381059, Col 39)
xQ7
// @from(Ln 381059, Col 44)
yQ7
// @from(Ln 381059, Col 49)
vQ7
// @from(Ln 381059, Col 54)
dXY
// @from(Ln 381059, Col 59)
kQ7
// @from(Ln 381059, Col 64)
cXY
// @from(Ln 381060, Col 4)
Ho2 = w(() => {
  f01();
  Fo2 = bL({
    command: oQ(),
    args: dI(oQ()).optional(),
    env: $P(oQ(), oQ()).optional()
  }), RQ7 = bL({
    name: oQ(),
    email: oQ().email().optional(),
    url: oQ().url().optional()
  }), _Q7 = bL({
    type: oQ(),
    url: oQ().url()
  }), jQ7 = Fo2.partial(), TQ7 = Fo2.extend({
    platform_overrides: $P(oQ(), jQ7).optional()
  }), PQ7 = bL({
    type: CP(["python", "node", "binary"]),
    entry_point: oQ(),
    mcp_config: TQ7
  }), SQ7 = bL({
    claude_desktop: oQ().optional(),
    platforms: dI(CP(["darwin", "win32", "linux"])).optional(),
    runtimes: bL({
      python: oQ().optional(),
      node: oQ().optional()
    }).optional()
  }).passthrough(), xQ7 = bL({
    name: oQ(),
    description: oQ().optional()
  }), yQ7 = bL({
    name: oQ(),
    description: oQ().optional(),
    arguments: dI(oQ()).optional(),
    text: oQ()
  }), vQ7 = bL({
    type: CP(["string", "number", "boolean", "directory", "file"]),
    title: oQ(),
    description: oQ(),
    required: ZF().optional(),
    default: IBA([oQ(), pR(), ZF(), dI(oQ())]).optional(),
    multiple: ZF().optional(),
    sensitive: ZF().optional(),
    min: pR().optional(),
    max: pR().optional()
  }), dXY = $P(oQ(), IBA([oQ(), pR(), ZF(), dI(oQ())])), kQ7 = bL({
    $schema: oQ().optional(),
    dxt_version: oQ().optional().describe("@deprecated Use manifest_version instead"),
    manifest_version: oQ().optional(),
    name: oQ(),
    display_name: oQ().optional(),
    version: oQ(),
    description: oQ(),
    long_description: oQ().optional(),
    author: RQ7,
    repository: _Q7.optional(),
    homepage: oQ().url().optional(),
    documentation: oQ().url().optional(),
    support: oQ().url().optional(),
    icon: oQ().optional(),
    screenshots: dI(oQ()).optional(),
    server: PQ7,
    tools: dI(xQ7).optional(),
    tools_generated: ZF().optional(),
    prompts: dI(yQ7).optional(),
    prompts_generated: ZF().optional(),
    keywords: dI(oQ()).optional(),
    license: oQ().optional(),
    compatibility: SQ7.optional(),
    user_config: $P(oQ(), vQ7).optional()
  }).refine((A) => !!(A.dxt_version || A.manifest_version), {
    message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
  }), cXY = bL({
    status: CP(["signed", "unsigned", "self-signed"]),
    publisher: oQ().optional(),
    issuer: oQ().optional(),
    valid_from: oQ().optional(),
    valid_to: oQ().optional(),
    fingerprint: oQ().optional()
  })
})
// @from(Ln 381140, Col 4)
bQ7
// @from(Ln 381140, Col 9)
fQ7
// @from(Ln 381141, Col 4)
dw0 = w(() => {
  mw0();
  DfA();
  Ho2();
  bQ7 = c(si2(), 1), fQ7 = c(An2(), 1)
})
// @from(Ln 381147, Col 4)
Eo2 = w(() => {
  YN0();
  dw0();
  DfA();
  tq0()
})
// @from(Ln 381154, Col 0)
function cw0(A, Q) {
  if (typeof A === "string") {
    let B = A;
    for (let [G, Z] of Object.entries(Q)) {
      let Y = new RegExp(`\\$\\{${G}\\}`, "g");
      if (B.match(Y))
        if (Array.isArray(Z)) console.warn(`Cannot replace ${G} with array value in string context: "${A}"`, {
          key: G,
          replacement: Z
        });
        else B = B.replace(Y, Z)
    }
    return B
  } else if (Array.isArray(A)) {
    let B = [];
    for (let G of A)
      if (typeof G === "string" && G.match(/^\$\{user_config\.[^}]+\}$/)) {
        let Z = G.match(/^\$\{([^}]+)\}$/)?.[1];
        if (Z && Q[Z]) {
          let Y = Q[Z];
          if (Array.isArray(Y)) B.push(...Y);
          else B.push(Y)
        } else B.push(G)
      } else B.push(cw0(G, Q));
    return B
  } else if (A && typeof A === "object") {
    let B = {};
    for (let [G, Z] of Object.entries(A)) B[G] = cw0(Z, Q);
    return B
  }
  return A
}
// @from(Ln 381186, Col 0)
async function fEA(A) {
  let {
    manifest: Q,
    extensionPath: B,
    systemDirs: G,
    userConfig: Z,
    pathSeparator: Y,
    logger: J
  } = A, X = Q.server?.mcp_config;
  if (!X) return;
  let I = {
    ...X
  };
  if (X.platform_overrides) {
    if (process.platform in X.platform_overrides) {
      let K = X.platform_overrides[process.platform];
      I.command = K.command || I.command, I.args = K.args || I.args, I.env = K.env || I.env
    }
  }
  if (hQ7({
      manifest: Q,
      userConfig: Z
    })) {
    J?.warn(`Extension ${Q.name} has missing required configuration, skipping MCP config`);
    return
  }
  let D = {
      __dirname: B,
      pathSeparator: Y,
      "/": Y,
      ...G
    },
    W = {};
  if (Q.user_config) {
    for (let [K, V] of Object.entries(Q.user_config))
      if (V.default !== void 0) W[K] = V.default
  }
  if (Z) Object.assign(W, Z);
  for (let [K, V] of Object.entries(W)) {
    let F = `user_config.${K}`;
    if (Array.isArray(V)) D[F] = V.map(String);
    else if (typeof V === "boolean") D[F] = V ? "true" : "false";
    else D[F] = String(V)
  }
  return I = cw0(I, D), I
}
// @from(Ln 381233, Col 0)
function zo2(A) {
  return A === void 0 || A === null || A === ""
}
// @from(Ln 381237, Col 0)
function hQ7({
  manifest: A,
  userConfig: Q
}) {
  if (!A.user_config) return !1;
  let B = Q || {};
  for (let [G, Z] of Object.entries(A.user_config))
    if (Z.required) {
      let Y = B[G];
      if (zo2(Y) || Array.isArray(Y) && (Y.length === 0 || Y.some(zo2))) return !0
    } return !1
}
// @from(Ln 381249, Col 4)
$o2 = () => {}
// @from(Ln 381250, Col 4)
cfA = w(() => {
  tq0();
  Eo2();
  mw0();
  YN0();
  uw0();
  dw0();
  DfA();
  $o2()
})
// @from(Ln 381261, Col 0)
function Co2(A) {
  let Q = XV1.safeParse(A);
  if (!Q.success) {
    let B = Q.error.flatten(),
      G = [...Object.entries(B.fieldErrors).map(([Z, Y]) => `${Z}: ${Y?.join(", ")}`), ...B.formErrors || []].filter(Boolean).join("; ");
    throw Error(`Invalid manifest: ${G}`)
  }
  return Q.data
}
// @from(Ln 381271, Col 0)
function gQ7(A) {
  let Q;
  try {
    Q = AQ(A)
  } catch (B) {
    throw Error(`Invalid JSON in manifest.json: ${B instanceof Error?B.message:String(B)}`)
  }
  return Co2(Q)
}
// @from(Ln 381281, Col 0)
function HF1(A) {
  let Q = new TextDecoder().decode(A);
  return gQ7(Q)
}
// @from(Ln 381285, Col 4)
pw0 = w(() => {
  cfA();
  A0()
})
// @from(Ln 381291, Col 0)
function uQ7(A) {
  if (hGA(A)) return !1;
  let Q = EF1.normalize(A);
  if (EF1.isAbsolute(Q)) return !1;
  return !0
}
// @from(Ln 381298, Col 0)
function mQ7(A, Q) {
  Q.fileCount++;
  let B;
  if (Q.fileCount > mt.MAX_FILE_COUNT) B = `Archive contains too many files: ${Q.fileCount} (max: ${mt.MAX_FILE_COUNT})`;
  if (!uQ7(A.name)) B = `Unsafe file path detected: "${A.name}". Path traversal or absolute paths are not allowed.`;
  let G = A.originalSize || 0;
  if (G > mt.MAX_FILE_SIZE) B = `File "${A.name}" is too large: ${Math.round(G/1024/1024)}MB (max: ${Math.round(mt.MAX_FILE_SIZE/1024/1024)}MB)`;
  if (Q.totalUncompressedSize += G, Q.totalUncompressedSize > mt.MAX_TOTAL_SIZE) B = `Archive total size is too large: ${Math.round(Q.totalUncompressedSize/1024/1024)}MB (max: ${Math.round(mt.MAX_TOTAL_SIZE/1024/1024)}MB)`;
  let Z = Q.totalUncompressedSize / Q.compressedSize;
  if (Z > mt.MAX_COMPRESSION_RATIO) B = `Suspicious compression ratio detected: ${Z.toFixed(1)}:1 (max: ${mt.MAX_COMPRESSION_RATIO}:1). This may be a zip bomb.`;
  return B ? {
    isValid: !1,
    error: B
  } : {
    isValid: !0
  }
}
// @from(Ln 381315, Col 0)
async function lw0(A) {
  let Q = vA();
  if (!Q.existsSync(A)) throw Error(`Zip file does not exist: ${A}`);
  try {
    let B = Q.readFileBytesSync(A),
      G = B.length;
    return await new Promise((Y, J) => {
      let X = {
          fileCount: 0,
          totalUncompressedSize: 0,
          compressedSize: G,
          errors: []
        },
        I = dd2(new Uint8Array(B), {
          filter: (D) => {
            let W = mQ7(D, X);
            if (!W.isValid) return J(Error(W.error)), I(), !1;
            return !0
          }
        }, (D, W) => {
          if (D) J(Error(`Failed to unzip file: ${D.message||String(D)}`));
          else k(`Zip extraction completed: ${X.fileCount} files, ${Math.round(X.totalUncompressedSize/1024)}KB uncompressed`), Y(W)
        })
    })
  } catch (B) {
    let G = B instanceof Error ? B.message : String(B);
    throw Error(`Failed to read or unzip file: ${G}`)
  }
}
// @from(Ln 381344, Col 4)
mt
// @from(Ln 381345, Col 4)
iw0 = w(() => {
  cd2();
  T1();
  DQ();
  oZ();
  mt = {
    MAX_FILE_SIZE: 536870912,
    MAX_TOTAL_SIZE: 1073741824,
    MAX_FILE_COUNT: 1e5,
    MAX_COMPRESSION_RATIO: 50,
    MIN_COMPRESSION_RATIO: 0.5
  }
})
// @from(Ln 381361, Col 0)
function dt() {
  let A = $Q(),
    Q = Uo2.homedir(),
    B = {
      HOME: Q,
      DESKTOP: E3A.join(Q, "Desktop"),
      DOCUMENTS: E3A.join(Q, "Documents"),
      DOWNLOADS: E3A.join(Q, "Downloads")
    };
  switch (A) {
    case "windows": {
      let G = process.env.USERPROFILE || Q;
      return {
        HOME: Q,
        DESKTOP: E3A.join(G, "Desktop"),
        DOCUMENTS: E3A.join(G, "Documents"),
        DOWNLOADS: E3A.join(G, "Downloads")
      }
    }
    case "linux":
    case "wsl":
      return {
        HOME: Q, DESKTOP: process.env.XDG_DESKTOP_DIR || B.DESKTOP, DOCUMENTS: process.env.XDG_DOCUMENTS_DIR || B.DOCUMENTS, DOWNLOADS: process.env.XDG_DOWNLOAD_DIR || B.DOWNLOADS
      };
    case "macos":
    default: {
      if (A === "unknown") k("Unknown platform detected, using default paths");
      return B
    }
  }
}
// @from(Ln 381392, Col 4)
pfA = w(() => {
  c3();
  T1()
})
// @from(Ln 381404, Col 0)
function Hj(A) {
  return A.endsWith(".mcpb") || A.endsWith(".dxt")
}
// @from(Ln 381408, Col 0)
function Oo2(A) {
  return A.startsWith("http://") || A.startsWith("https://")
}
// @from(Ln 381412, Col 0)
function cQ7(A) {
  return aw0("sha256").update(A).digest("hex").substring(0, 16)
}
// @from(Ln 381416, Col 0)
function Mo2(A) {
  return ct(A, ".mcpb-cache")
}
// @from(Ln 381420, Col 0)
function Ro2(A, Q) {
  let B = aw0("md5").update(Q).digest("hex").substring(0, 8);
  return ct(A, `${B}.metadata.json`)
}
// @from(Ln 381425, Col 0)
function qo2(A, Q) {
  try {
    let G = jQ().pluginConfigs?.[A]?.mcpServers?.[Q];
    if (!G) return null;
    return k(`Loaded user config for ${A}/${Q} from settings`), G
  } catch (B) {
    let G = B instanceof Error ? B : Error(String(B));
    return e(G), k(`Failed to load user config for ${A}/${Q}: ${B}`, {
      level: "error"
    }), null
  }
}
// @from(Ln 381438, Col 0)
function No2(A, Q, B) {
  try {
    let G = jQ();
    if (!G.pluginConfigs) G.pluginConfigs = {};
    if (!G.pluginConfigs[A]) G.pluginConfigs[A] = {};
    if (!G.pluginConfigs[A].mcpServers) G.pluginConfigs[A].mcpServers = {};
    G.pluginConfigs[A].mcpServers[Q] = B;
    let Z = pB("userSettings", G);
    if (Z.error) throw Z.error;
    k(`Saved user config for ${A}/${Q} to user settings`)
  } catch (G) {
    let Z = G instanceof Error ? G : Error(String(G));
    throw e(Z), Error(`Failed to save user configuration for ${A}/${Q}: ${Z.message}`)
  }
}
// @from(Ln 381454, Col 0)
function wo2(A, Q) {
  let B = [];
  for (let [G, Z] of Object.entries(Q)) {
    let Y = A[G];
    if (Z.required && (Y === void 0 || Y === "")) {
      B.push(`${Z.title||G} is required but not provided`);
      continue
    }
    if (Y === void 0 || Y === "") continue;
    if (Z.type === "string") {
      if (Array.isArray(Y)) {
        if (!Z.multiple) B.push(`${Z.title||G} must be a string, not an array`);
        else if (!Y.every((J) => typeof J === "string")) B.push(`${Z.title||G} must be an array of strings`)
      } else if (typeof Y !== "string") B.push(`${Z.title||G} must be a string`)
    } else if (Z.type === "number" && typeof Y !== "number") B.push(`${Z.title||G} must be a number`);
    else if (Z.type === "boolean" && typeof Y !== "boolean") B.push(`${Z.title||G} must be a boolean`);
    else if ((Z.type === "file" || Z.type === "directory") && typeof Y !== "string") B.push(`${Z.title||G} must be a path string`);
    if (Z.type === "number" && typeof Y === "number") {
      if (Z.min !== void 0 && Y < Z.min) B.push(`${Z.title||G} must be at least ${Z.min}`);
      if (Z.max !== void 0 && Y > Z.max) B.push(`${Z.title||G} must be at most ${Z.max}`)
    }
  }
  return {
    valid: B.length === 0,
    errors: B
  }
}
// @from(Ln 381481, Col 0)
async function Lo2(A, Q) {
  let B = await fEA({
    manifest: A,
    extensionPath: Q,
    systemDirs: dt(),
    userConfig: {},
    pathSeparator: "/"
  });
  if (!B) {
    let G = Error(`Failed to generate MCP server configuration from manifest "${A.name}"`);
    throw e(G), G
  }
  return B
}
// @from(Ln 381495, Col 0)
async function _o2(A, Q) {
  let B = vA(),
    G = Ro2(A, Q);
  if (!B.existsSync(G)) return null;
  try {
    let Z = B.readFileSync(G, {
      encoding: "utf-8"
    });
    return AQ(Z)
  } catch (Z) {
    let Y = Z instanceof Error ? Z : Error(String(Z));
    return e(Y), k(`Failed to load MCPB cache metadata: ${Z}`, {
      level: "error"
    }), null
  }
}
// @from(Ln 381511, Col 0)
async function nw0(A, Q, B) {
  let G = vA(),
    Z = Ro2(A, Q);
  G.mkdirSync(A), bB(Z, eA(B, null, 2), "utf-8")
}
// @from(Ln 381516, Col 0)
async function pQ7(A, Q, B) {
  if (k(`Downloading MCPB from ${A}`), B) B(`Downloading ${A}...`);
  try {
    let G = await xQ.get(A, {
        timeout: 120000,
        responseType: "arraybuffer",
        maxRedirects: 5,
        onDownloadProgress: (Y) => {
          if (Y.total && B) {
            let J = Math.round(Y.loaded / Y.total * 100);
            B(`Downloading... ${J}%`)
          }
        }
      }),
      Z = new Uint8Array(G.data);
    if (bB(Q, Buffer.from(Z)), k(`Downloaded ${Z.length} bytes to ${Q}`), B) B("Download complete");
    return Z
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G),
      Y = Error(`Failed to download MCPB file from ${A}: ${Z}`);
    throw e(Y), Y
  }
}
// @from(Ln 381539, Col 0)
async function lQ7(A, Q, B) {
  let G = vA();
  if (B) B("Extracting files...");
  G.mkdirSync(Q);
  let Z = 0,
    Y = Object.keys(A).length;
  for (let [J, X] of Object.entries(A)) {
    let I = ct(Q, J),
      D = dQ7(I);
    if (D !== Q && !G.existsSync(D)) G.mkdirSync(D);
    if (J.endsWith(".json") || J.endsWith(".js") || J.endsWith(".ts") || J.endsWith(".txt") || J.endsWith(".md") || J.endsWith(".yml") || J.endsWith(".yaml")) {
      let K = new TextDecoder().decode(X);
      bB(I, K, "utf-8")
    } else bB(I, Buffer.from(X));
    if (Z++, B && Z % 10 === 0) B(`Extracted ${Z}/${Y} files`)
  }
  if (k(`Extracted ${Z} files to ${Q}`), B) B(`Extraction complete (${Z} files)`)
}
// @from(Ln 381557, Col 0)
async function iQ7(A, Q) {
  let B = vA(),
    G = Mo2(Q),
    Z = await _o2(G, A);
  if (!Z) return !0;
  if (!B.existsSync(Z.extractedPath)) return k(`MCPB extraction path missing: ${Z.extractedPath}`), !0;
  if (!Oo2(A)) {
    let Y = ct(Q, A);
    if (!B.existsSync(Y)) return k(`MCPB source file missing: ${Y}`), !0;
    let J = B.statSync(Y),
      X = new Date(Z.cachedAt).getTime(),
      I = J.mtimeMs;
    if (I > X) return k(`MCPB file modified: ${new Date(I)} > ${new Date(X)}`), !0
  }
  return !1
}
// @from(Ln 381573, Col 0)
async function lfA(A, Q, B, G, Z, Y) {
  let J = vA(),
    X = Mo2(Q);
  J.mkdirSync(X), k(`Loading MCPB from source: ${A}`);
  let I = await _o2(X, A);
  if (I && !await iQ7(A, Q)) {
    k(`Using cached MCPB from ${I.extractedPath} (hash: ${I.contentHash})`);
    let O = ct(I.extractedPath, "manifest.json");
    if (!J.existsSync(O)) {
      let x = Error(`Cached manifest not found: ${O}`);
      throw e(x), x
    }
    let L = J.readFileSync(O, {
        encoding: "utf-8"
      }),
      M = new TextEncoder().encode(L),
      _ = HF1(M);
    if (_.user_config && Object.keys(_.user_config).length > 0) {
      let x = _.name,
        b = qo2(B, x),
        S = Z || b || {},
        u = wo2(S, _.user_config);
      if (Y || !u.valid) return {
        status: "needs-config",
        manifest: _,
        extractedPath: I.extractedPath,
        contentHash: I.contentHash,
        configSchema: _.user_config,
        existingConfig: b || {},
        validationErrors: u.valid ? [] : u.errors
      };
      if (Z) No2(B, x, Z);
      let f = await fEA({
        manifest: _,
        extensionPath: I.extractedPath,
        systemDirs: dt(),
        userConfig: S,
        pathSeparator: "/"
      });
      if (!f) {
        let AA = Error(`Failed to generate MCP server configuration from manifest "${_.name}"`);
        throw e(AA), AA
      }
      return {
        manifest: _,
        mcpConfig: f,
        extractedPath: I.extractedPath,
        contentHash: I.contentHash
      }
    }
    let j = await Lo2(_, I.extractedPath);
    return {
      manifest: _,
      mcpConfig: j,
      extractedPath: I.extractedPath,
      contentHash: I.contentHash
    }
  }
  let D, W;
  if (Oo2(A)) {
    let O = aw0("md5").update(A).digest("hex").substring(0, 8);
    W = ct(X, `${O}.mcpb`), D = await pQ7(A, W, G)
  } else {
    let O = ct(Q, A);
    if (!J.existsSync(O)) {
      let L = Error(`MCPB file not found: ${O}`);
      throw e(L), L
    }
    if (G) G(`Loading ${A}...`);
    D = J.readFileBytesSync(O), W = O
  }
  let K = cQ7(D);
  if (k(`MCPB content hash: ${K}`), G) G("Extracting MCPB archive...");
  let V = await lw0(W),
    F = V["manifest.json"];
  if (!F) {
    let O = Error("No manifest.json found in MCPB file");
    throw e(O), O
  }
  let H = HF1(F);
  if (k(`MCPB manifest: ${H.name} v${H.version} by ${H.author.name}`), !H.server) {
    let O = Error(`MCPB manifest for "${H.name}" does not define a server configuration`);
    throw e(O), O
  }
  let E = ct(X, K);
  if (await lQ7(V, E, G), H.user_config && Object.keys(H.user_config).length > 0) {
    let O = H.name,
      L = qo2(B, O),
      M = Z || L || {},
      _ = wo2(M, H.user_config);
    if (!_.valid) {
      let b = {
        source: A,
        contentHash: K,
        extractedPath: E,
        cachedAt: new Date().toISOString(),
        lastChecked: new Date().toISOString()
      };
      return await nw0(X, A, b), {
        status: "needs-config",
        manifest: H,
        extractedPath: E,
        contentHash: K,
        configSchema: H.user_config,
        existingConfig: L || {},
        validationErrors: _.errors
      }
    }
    if (Z) No2(B, O, Z);
    if (G) G("Generating MCP server configuration...");
    let j = await fEA({
      manifest: H,
      extensionPath: E,
      systemDirs: dt(),
      userConfig: M,
      pathSeparator: "/"
    });
    if (!j) {
      let b = Error(`Failed to generate MCP server configuration from manifest "${H.name}"`);
      throw e(b), b
    }
    let x = {
      source: A,
      contentHash: K,
      extractedPath: E,
      cachedAt: new Date().toISOString(),
      lastChecked: new Date().toISOString()
    };
    return await nw0(X, A, x), {
      manifest: H,
      mcpConfig: j,
      extractedPath: E,
      contentHash: K
    }
  }
  if (G) G("Generating MCP server configuration...");
  let z = await Lo2(H, E),
    $ = {
      source: A,
      contentHash: K,
      extractedPath: E,
      cachedAt: new Date().toISOString(),
      lastChecked: new Date().toISOString()
    };
  return await nw0(X, A, $), k(`Successfully loaded MCPB: ${H.name} (extracted to ${E})`), {
    manifest: H,
    mcpConfig: z,
    extractedPath: E,
    contentHash: K
  }
}
// @from(Ln 381724, Col 4)
ow0 = w(() => {
  j5();
  A0();
  cfA();
  pw0();
  iw0();
  DQ();
  T1();
  v1();
  pfA();
  GB();
  A0()
})
// @from(Ln 381740, Col 0)
async function jo2(A, Q, B) {
  try {
    k(`Loading MCP servers from MCPB: ${Q}`);
    let G = A.repository,
      Z = await lfA(Q, A.path, G, (X) => {
        k(`MCPB [${A.name}]: ${X}`)
      });
    if ("status" in Z && Z.status === "needs-config") return k(`MCPB ${Q} requires user configuration. ` + `User can configure via: /plugin → Manage plugins → ${A.name} → Configure`), null;
    let Y = Z,
      J = Y.manifest.name;
    return k(`Loaded MCP server "${J}" from MCPB (extracted to ${Y.extractedPath})`), {
      [J]: Y.mcpConfig
    }
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G);
    k(`Failed to load MCPB ${Q}: ${Z}`, {
      level: "error"
    });
    let Y = `${A.name}@${A.repository}`;
    if (Q.startsWith("http") && (Z.includes("download") || Z.includes("network"))) B.push({
      type: "mcpb-download-failed",
      source: Y,
      plugin: A.name,
      url: Q,
      reason: Z
    });
    else if (Z.includes("manifest") || Z.includes("user configuration")) B.push({
      type: "mcpb-invalid-manifest",
      source: Y,
      plugin: A.name,
      mcpbPath: Q,
      validationError: Z
    });
    else B.push({
      type: "mcpb-extract-failed",
      source: Y,
      plugin: A.name,
      mcpbPath: Q,
      reason: Z
    });
    return null
  }
}
// @from(Ln 381783, Col 0)
async function aQ7(A, Q = []) {
  let B = {},
    G = rw0(A.path, ".mcp.json");
  if (G) B = {
    ...B,
    ...G
  };
  if (A.manifest.mcpServers) {
    let Z = A.manifest.mcpServers;
    if (typeof Z === "string")
      if (Hj(Z)) {
        let Y = await jo2(A, Z, Q);
        if (Y) B = {
          ...B,
          ...Y
        }
      } else {
        let Y = rw0(A.path, Z);
        if (Y) B = {
          ...B,
          ...Y
        }
      }
    else if (Array.isArray(Z))
      for (let Y of Z)
        if (typeof Y === "string")
          if (Hj(Y)) {
            let J = await jo2(A, Y, Q);
            if (J) B = {
              ...B,
              ...J
            }
          } else {
            let J = rw0(A.path, Y);
            if (J) B = {
              ...B,
              ...J
            }
          }
    else B = {
      ...B,
      ...Y
    };
    else B = {
      ...B,
      ...Z
    }
  }
  return Object.keys(B).length > 0 ? B : void 0
}
// @from(Ln 381834, Col 0)
function rw0(A, Q) {
  let B = vA(),
    G = nQ7(A, Q);
  if (!B.existsSync(G)) return null;
  try {
    let Z = B.readFileSync(G, {
        encoding: "utf-8"
      }),
      Y = AQ(Z),
      J = Y.mcpServers || Y,
      X = {};
    for (let [I, D] of Object.entries(J)) {
      let W = Rb.safeParse(D);
      if (W.success) X[I] = W.data;
      else k(`Invalid MCP server config for ${I} in ${G}: ${W.error.message}`, {
        level: "error"
      })
    }
    return X
  } catch (Z) {
    return k(`Failed to load MCP servers from ${G}: ${Z}`, {
      level: "error"
    }), null
  }
}
// @from(Ln 381860, Col 0)
function oQ7(A, Q) {
  let B = {};
  for (let [G, Z] of Object.entries(A)) {
    let Y = `plugin:${Q}:${G}`;
    B[Y] = {
      ...Z,
      scope: "dynamic"
    }
  }
  return B
}
// @from(Ln 381872, Col 0)
function ifA(A, Q) {
  return A.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, Q)
}
// @from(Ln 381876, Col 0)
function rQ7(A, Q) {
  return A.replace(/\$\{user_config\.([^}]+)\}/g, (B, G) => {
    let Z = Q[G];
    if (Z === void 0) throw Error(`Missing required user configuration value: ${G}. This should have been validated before variable substitution.`);
    return String(Z)
  })
}
// @from(Ln 381884, Col 0)
function sQ7(A, Q, B, G, Z, Y) {
  let J = [],
    X = (D) => {
      let W = ifA(D, Q);
      if (B) W = rQ7(W, B);
      let {
        expanded: K,
        missingVars: V
      } = BVA(W);
      return J.push(...V), K
    },
    I;
  switch (A.type) {
    case void 0:
    case "stdio": {
      let D = {
        ...A
      };
      if (D.command) D.command = X(D.command);
      if (D.args) D.args = D.args.map((K) => X(K));
      let W = {
        CLAUDE_PLUGIN_ROOT: Q,
        ...D.env || {}
      };
      for (let [K, V] of Object.entries(W))
        if (K !== "CLAUDE_PLUGIN_ROOT") W[K] = X(V);
      D.env = W, I = D;
      break
    }
    case "sse":
    case "http":
    case "ws": {
      let D = {
        ...A
      };
      if (D.url) D.url = X(D.url);
      if (D.headers) {
        let W = {};
        for (let [K, V] of Object.entries(D.headers)) W[K] = X(V);
        D.headers = W
      }
      I = D;
      break
    }
    case "sse-ide":
    case "ws-ide":
    case "sdk":
    case "claudeai-proxy":
      I = A;
      break
  }
  if (G && J.length > 0) {
    let W = [...new Set(J)].join(", ");
    if (k(`Missing environment variables in plugin MCP config: ${W}`, {
        level: "warn"
      }), Z && Y) G.push({
      type: "mcp-config-invalid",
      source: `plugin:${Z}`,
      plugin: Z,
      serverName: Y,
      validationError: `Missing environment variables: ${W}`
    })
  }
  return I
}
// @from(Ln 381949, Col 0)
async function To2(A, Q = []) {
  if (!A.enabled) return;
  let B = A.mcpServers || await aQ7(A, Q);
  if (!B) return;
  let G = {};
  for (let [Z, Y] of Object.entries(B)) G[Z] = sQ7(Y, A.path, void 0, Q, A.name, Z);
  return oQ7(G, A.name)
}
// @from(Ln 381957, Col 4)
sw0 = w(() => {
  DQ();
  T1();
  D4A();
  ow0();
  A0()
})
// @from(Ln 381970, Col 0)
function zF1(A) {
  return /^skill\.md$/i.test(gEA(A))
}
// @from(Ln 381974, Col 0)
function tQ7(A, Q, B) {
  if (zF1(A)) {
    let Z = pt(A),
      Y = pt(Z),
      J = gEA(Z),
      X = Y.startsWith(Q) ? Y.slice(Q.length).replace(/^\//, "") : "",
      I = X ? X.split("/").join(":") : "";
    return I ? `${B}:${I}:${J}` : `${B}:${J}`
  } else {
    let Z = pt(A),
      Y = gEA(A).replace(/\.md$/, ""),
      J = Z.startsWith(Q) ? Z.slice(Q.length).replace(/^\//, "") : "",
      X = J ? J.split("/").join(":") : "";
    return X ? `${B}:${X}:${Y}` : `${B}:${Y}`
  }
}
// @from(Ln 381991, Col 0)
function eQ7(A, Q, B) {
  let G = [],
    Z = vA();

  function Y(J) {
    try {
      let X = Z.readdirSync(J);
      if (X.some((D) => D.isFile() && zF1(D.name))) {
        for (let D of X)
          if (D.isFile() && D.name.toLowerCase().endsWith(".md")) {
            let W = hEA(J, D.name);
            if (Py(Z, W, B)) continue;
            let K = Z.readFileSync(W, {
                encoding: "utf-8"
              }),
              {
                frontmatter: V,
                content: F
              } = lK(K);
            G.push({
              filePath: W,
              baseDir: Q,
              frontmatter: V,
              content: F
            })
          } return
      }
      for (let D of X) {
        let W = hEA(J, D.name);
        if (D.isDirectory()) Y(W);
        else if (D.isFile() && D.name.toLowerCase().endsWith(".md")) {
          if (Py(Z, W, B)) continue;
          let K = Z.readFileSync(W, {
              encoding: "utf-8"
            }),
            {
              frontmatter: V,
              content: F
            } = lK(K);
          G.push({
            filePath: W,
            baseDir: Q,
            frontmatter: V,
            content: F
          })
        }
      }
    } catch (X) {
      k(`Failed to scan directory ${J}: ${X}`, {
        level: "error"
      })
    }
  }
  return Y(A), G
}
// @from(Ln 382047, Col 0)
function AB7(A) {
  let Q = new Map;
  for (let G of A) {
    let Z = pt(G.filePath),
      Y = Q.get(Z) ?? [];
    Y.push(G), Q.set(Z, Y)
  }
  let B = [];
  for (let [G, Z] of Q) {
    let Y = Z.filter((J) => zF1(J.filePath));
    if (Y.length > 0) {
      let J = Y[0];
      if (Y.length > 1) k(`Multiple skill files found in ${G}, using ${gEA(J.filePath)}`);
      B.push(J)
    } else B.push(...Z)
  }
  return B
}
// @from(Ln 382065, Col 0)
async function Po2(A, Q, B, G, Z, Y = {
  isSkillMode: !1
}, J = new Set) {
  let X = eQ7(A, A, J),
    I = AB7(X),
    D = [];
  for (let W of I) {
    let K = tQ7(W.filePath, W.baseDir, Q),
      V = nfA(K, W, B, G, Z, zF1(W.filePath), Y);
    if (V) D.push(V)
  }
  return D
}
// @from(Ln 382079, Col 0)
function nfA(A, Q, B, G, Z, Y, J = {
  isSkillMode: !1
}) {
  try {
    let {
      frontmatter: X,
      content: I
    } = Q, D = X.description ?? dc(I, Y ? "Plugin skill" : "Plugin command"), W = X["allowed-tools"], K = typeof W === "string" ? ifA(W, Z) : Array.isArray(W) ? W.map((_) => typeof _ === "string" ? ifA(_, Z) : _) : W, V = RS(K), F = X["argument-hint"], H = X.when_to_use, E = X.version, z = X.name, $ = X.model === "inherit" ? void 0 : X.model ? FX(X.model) : void 0, O = X["disable-model-invocation"], L;
    if (J.isSkillMode) L = O === void 0 ? !1 : a1(O);
    else L = a1(O);
    let M = J.isSkillMode ? !0 : !1;
    return {
      type: "prompt",
      name: A,
      description: D,
      hasUserSpecifiedDescription: !!X.description,
      allowedTools: V,
      argumentHint: F,
      whenToUse: H,
      version: E,
      model: $,
      disableModelInvocation: L,
      contentLength: I.length,
      source: "plugin",
      loadedFrom: Y || J.isSkillMode ? "plugin" : void 0,
      pluginInfo: {
        pluginManifest: G,
        repository: B
      },
      isEnabled: () => !0,
      isHidden: M,
      progressMessage: Y || J.isSkillMode ? "loading" : "running",
      userFacingName() {
        return z || A
      },
      async getPromptForCommand(_, j) {
        let x = J.isSkillMode ? `Base directory for this skill: ${pt(Q.filePath)}

${I}` : I;
        if (_)
          if (x.includes("$ARGUMENTS")) x = x.replaceAll("$ARGUMENTS", _);
          else x = x + `

ARGUMENTS: ${_}`;
        return x = ifA(x, Z), x = await Ct(x, {
          ...j,
          async getAppState() {
            let b = await j.getAppState();
            return {
              ...b,
              toolPermissionContext: {
                ...b.toolPermissionContext,
                alwaysAllowRules: {
                  ...b.toolPermissionContext.alwaysAllowRules,
                  command: V
                }
              }
            }
          }
        }, `/${A}`), [{
          type: "text",
          text: x
        }]
      }
    }
  } catch (X) {
    return k(`Failed to create command from ${Q.filePath}: ${X}`, {
      level: "error"
    }), null
  }
}
// @from(Ln 382151, Col 0)
function $F1() {
  z3A.cache?.clear?.()
}
// @from(Ln 382154, Col 0)
async function So2(A, Q, B, G, Z, Y) {
  let J = vA(),
    X = [];
  try {
    if (!J.existsSync(A)) return [];
    let I = hEA(A, "SKILL.md");
    if (J.existsSync(I)) {
      if (Py(J, I, Y)) return X;
      try {
        let W = J.readFileSync(I, {
            encoding: "utf-8"
          }),
          {
            frontmatter: K,
            content: V
          } = lK(W),
          F = `${Q}:${gEA(A)}`,
          H = {
            filePath: I,
            baseDir: pt(I),
            frontmatter: K,
            content: V
          },
          E = nfA(F, H, B, G, Z, !0, {
            isSkillMode: !0
          });
        if (E) X.push(E)
      } catch (W) {
        k(`Failed to load skill from ${I}: ${W}`, {
          level: "error"
        })
      }
      return X
    }
    let D = J.readdirSync(A);
    for (let W of D) {
      if (!W.isDirectory() && !W.isSymbolicLink()) continue;
      let K = hEA(A, W.name),
        V = hEA(K, "SKILL.md");
      if (J.existsSync(V)) {
        if (Py(J, V, Y)) continue;
        try {
          let F = J.readFileSync(V, {
              encoding: "utf-8"
            }),
            {
              frontmatter: H,
              content: E
            } = lK(F),
            z = `${Q}:${W.name}`,
            $ = {
              filePath: V,
              baseDir: pt(V),
              frontmatter: H,
              content: E
            },
            O = nfA(z, $, B, G, Z, !0, {
              isSkillMode: !0
            });
          if (O) X.push(O)
        } catch (F) {
          k(`Failed to load skill from ${V}: ${F}`, {
            level: "error"
          })
        }
      }
    }
  } catch (I) {
    k(`Failed to load skills from directory ${A}: ${I}`, {
      level: "error"
    })
  }
  return X
}
// @from(Ln 382229, Col 0)
function xo2() {
  tw0.cache?.clear?.()
}
// @from(Ln 382232, Col 4)
z3A
// @from(Ln 382232, Col 9)
tw0
// @from(Ln 382233, Col 4)
afA = w(() => {
  Y9();
  DQ();
  GK();
  T1();
  VEA();
  kd();
  Da();
  fQ();
  sw0();
  l2();
  z3A = W0(async () => {
    let {
      enabled: A,
      errors: Q
    } = await DG(), B = [];
    if (Q.length > 0) k(`Plugin loading errors: ${Q.map((G)=>h_(G)).join(", ")}`);
    for (let G of A) {
      let Z = new Set;
      if (G.commandsPath) try {
        let Y = await Po2(G.commandsPath, G.name, G.source, G.manifest, G.path, {
          isSkillMode: !1
        }, Z);
        if (B.push(...Y), Y.length > 0) k(`Loaded ${Y.length} commands from plugin ${G.name} default directory`)
      } catch (Y) {
        k(`Failed to load commands from plugin ${G.name} default directory: ${Y}`, {
          level: "error"
        })
      }
      if (G.commandsPaths) {
        k(`Plugin ${G.name} has commandsPaths: ${G.commandsPaths.join(", ")}`);
        for (let Y of G.commandsPaths) try {
          let J = vA(),
            X = J.statSync(Y);
          if (k(`Checking commandPath ${Y} - isDirectory: ${X.isDirectory()}, isFile: ${X.isFile()}`), X.isDirectory()) {
            let I = await Po2(Y, G.name, G.source, G.manifest, G.path, {
              isSkillMode: !1
            }, Z);
            if (B.push(...I), I.length > 0) k(`Loaded ${I.length} commands from plugin ${G.name} custom path: ${Y}`);
            else k(`Warning: No commands found in plugin ${G.name} custom directory: ${Y}. Expected .md files or SKILL.md in subdirectories.`, {
              level: "warn"
            })
          } else if (X.isFile() && Y.endsWith(".md")) {
            if (Py(J, Y, Z)) continue;
            let I = J.readFileSync(Y, {
                encoding: "utf-8"
              }),
              {
                frontmatter: D,
                content: W
              } = lK(I),
              K, V;
            if (G.commandsMetadata) {
              for (let [z, $] of Object.entries(G.commandsMetadata))
                if ($.source) {
                  let O = hEA(G.path, $.source);
                  if (Y === O) {
                    K = `${G.name}:${z}`, V = $;
                    break
                  }
                }
            }
            if (!K) K = `${G.name}:${gEA(Y).replace(/\.md$/,"")}`;
            let F = V ? {
                ...D,
                ...V.description && {
                  description: V.description
                },
                ...V.argumentHint && {
                  "argument-hint": V.argumentHint
                },
                ...V.model && {
                  model: V.model
                },
                ...V.allowedTools && {
                  "allowed-tools": V.allowedTools.join(",")
                }
              } : D,
              H = {
                filePath: Y,
                baseDir: pt(Y),
                frontmatter: F,
                content: W
              },
              E = nfA(K, H, G.source, G.manifest, G.path, !1);
            if (E) B.push(E), k(`Loaded command from plugin ${G.name} custom file: ${Y}${V?" (with metadata override)":""}`)
          }
        } catch (J) {
          k(`Failed to load commands from plugin ${G.name} custom path ${Y}: ${J}`, {
            level: "error"
          })
        }
      }
      if (G.commandsMetadata) {
        for (let [Y, J] of Object.entries(G.commandsMetadata))
          if (J.content && !J.source) try {
            let {
              frontmatter: X,
              content: I
            } = lK(J.content), D = {
              ...X,
              ...J.description && {
                description: J.description
              },
              ...J.argumentHint && {
                "argument-hint": J.argumentHint
              },
              ...J.model && {
                model: J.model
              },
              ...J.allowedTools && {
                "allowed-tools": J.allowedTools.join(",")
              }
            }, W = `${G.name}:${Y}`, K = {
              filePath: `<inline:${W}>`,
              baseDir: G.path,
              frontmatter: D,
              content: I
            }, V = nfA(W, K, G.source, G.manifest, G.path, !1);
            if (V) B.push(V), k(`Loaded inline content command from plugin ${G.name}: ${W}`)
          } catch (X) {
            k(`Failed to load inline content command ${Y} from plugin ${G.name}: ${X}`, {
              level: "error"
            })
          }
      }
    }
    return k(`Total plugin commands loaded: ${B.length}`), B
  });
  tw0 = W0(async () => {
    let {
      enabled: A,
      errors: Q
    } = await DG(), B = [];
    if (Q.length > 0) k(`Plugin loading errors: ${Q.map((G)=>h_(G)).join(", ")}`);
    k(`getPluginSkills: Processing ${A.length} enabled plugins`);
    for (let G of A) {
      let Z = new Set;
      if (k(`Checking plugin ${G.name}: skillsPath=${G.skillsPath?"exists":"none"}, skillsPaths=${G.skillsPaths?G.skillsPaths.length:0} paths`), G.skillsPath) {
        k(`Attempting to load skills from plugin ${G.name} default skillsPath: ${G.skillsPath}`);
        try {
          let Y = await So2(G.skillsPath, G.name, G.source, G.manifest, G.path, Z);
          B.push(...Y), k(`Loaded ${Y.length} skills from plugin ${G.name} default directory`)
        } catch (Y) {
          k(`Failed to load skills from plugin ${G.name} default directory: ${Y}`, {
            level: "error"
          })
        }
      }
      if (G.skillsPaths) {
        k(`Attempting to load skills from plugin ${G.name} skillsPaths: ${G.skillsPaths.join(", ")}`);
        for (let Y of G.skillsPaths) try {
          k(`Loading from skillPath: ${Y} for plugin ${G.name}`);
          let J = await So2(Y, G.name, G.source, G.manifest, G.path, Z);
          B.push(...J), k(`Loaded ${J.length} skills from plugin ${G.name} custom path: ${Y}`)
        } catch (J) {
          k(`Failed to load skills from plugin ${G.name} custom path ${Y}: ${J}`, {
            level: "error"
          })
        }
      }
    }
    return k(`Total plugin skills loaded: ${B.length}`), B
  })
})
// @from(Ln 382403, Col 0)
function yo2(A, Q, B) {
  let G = [],
    Z = vA();

  function Y(J) {
    try {
      let X = Z.readdirSync(J);
      for (let I of X) {
        let D = QB7(J, I.name);
        if (I.isDirectory()) Y(D);
        else if (I.isFile() && I.name.endsWith(".md")) {
          let W = vo2(D, Q, B);
          if (W) G.push(W)
        }
      }
    } catch (X) {
      k(`Failed to scan output-styles directory ${J}: ${X}`, {
        level: "error"
      })
    }
  }
  return Y(A), G
}
// @from(Ln 382427, Col 0)
function vo2(A, Q, B) {
  let G = vA();
  if (Py(G, A, B)) return null;
  try {
    let Z = G.readFileSync(A, {
        encoding: "utf-8"
      }),
      {
        frontmatter: Y,
        content: J
      } = lK(Z),
      X = BB7(A, ".md"),
      I = Y.name || X,
      D = `${Q}:${I}`,
      W = Y.description || dc(J, `Output style from ${Q} plugin`),
      K = Y["force-for-plugin"],
      V = K === !0 || K === "true" ? !0 : K === !1 || K === "false" ? !1 : void 0;
    return {
      name: D,
      description: W,
      prompt: J.trim(),
      source: "plugin",
      forceForPlugin: V
    }
  } catch (Z) {
    return k(`Failed to load output style from ${A}: ${Z}`, {
      level: "error"
    }), null
  }
}
// @from(Ln 382458, Col 0)
function AL0() {
  ew0.cache?.clear?.()
}
// @from(Ln 382461, Col 4)
ew0
// @from(Ln 382462, Col 4)
CF1 = w(() => {
  Y9();
  DQ();
  GK();
  T1();
  Da();
  kd();
  ew0 = W0(async () => {
    let {
      enabled: A,
      errors: Q
    } = await DG(), B = [];
    if (Q.length > 0) k(`Plugin loading errors: ${Q.map((G)=>h_(G)).join(", ")}`);
    for (let G of A) {
      let Z = new Set;
      if (G.outputStylesPath) try {
        let Y = yo2(G.outputStylesPath, G.name, Z);
        if (B.push(...Y), Y.length > 0) k(`Loaded ${Y.length} output styles from plugin ${G.name} default directory`)
      } catch (Y) {
        k(`Failed to load output styles from plugin ${G.name} default directory: ${Y}`, {
          level: "error"
        })
      }
      if (G.outputStylesPaths)
        for (let Y of G.outputStylesPaths) try {
          let X = vA().statSync(Y);
          if (X.isDirectory()) {
            let I = yo2(Y, G.name, Z);
            if (B.push(...I), I.length > 0) k(`Loaded ${I.length} output styles from plugin ${G.name} custom path: ${Y}`)
          } else if (X.isFile() && Y.endsWith(".md")) {
            let I = vo2(Y, G.name, Z);
            if (I) B.push(I), k(`Loaded output style from plugin ${G.name} custom file: ${Y}`)
          }
        } catch (J) {
          k(`Failed to load output styles from plugin ${G.name} custom path ${Y}: ${J}`, {
            level: "error"
          })
        }
    }
    return k(`Total plugin output styles loaded: ${B.length}`), B
  })
})
// @from(Ln 382515, Col 0)
function IB7() {
  Bt(), $F1(), L52(), Bq0(), AL0()
}
// @from(Ln 382519, Col 0)
function NY() {
  IB7(), lt(), fD1()
}
// @from(Ln 382523, Col 0)
function NF1(A) {
  try {
    bB(BL0(A), `${Date.now()}`, {
      encoding: "utf-8"
    })
  } catch (Q) {
    k(`Failed to write .orphaned_at: ${A}: ${Q}`)
  }
}
// @from(Ln 382532, Col 0)
async function fo2() {
  try {
    let A = WB7();
    if (!A) return;
    let Q = Tr();
    if (!QL0(Q)) return;
    let B = Date.now();
    for (let G of A) DB7(G);
    for (let G of qF1(Q)) {
      let Z = UF1(Q, G);
      for (let Y of qF1(Z)) {
        let J = UF1(Z, Y);
        for (let X of qF1(J)) {
          let I = UF1(J, X);
          if (A.has(I)) continue;
          KB7(I, B)
        }
        ko2(J)
      }
      ko2(Z)
    }
  } catch (A) {
    k(`Plugin cache cleanup failed: ${A}`)
  }
}
// @from(Ln 382558, Col 0)
function BL0(A) {
  return UF1(A, JB7)
}
// @from(Ln 382562, Col 0)
function DB7(A) {
  let Q = BL0(A);
  if (QL0(Q)) try {
    YB7(Q)
  } catch (B) {
    k(`Failed to remove .orphaned_at: ${A}: ${B}`)
  }
}
// @from(Ln 382571, Col 0)
function WB7() {
  try {
    let A = new Set,
      Q = jr();
    for (let B of Object.values(Q.plugins))
      for (let G of B) A.add(G.installPath);
    return A
  } catch (A) {
    return k(`Failed to load installed plugins: ${A}`), null
  }
}
// @from(Ln 382583, Col 0)
function KB7(A, Q) {
  let B = BL0(A);
  if (!QL0(B)) {
    NF1(A);
    return
  }
  try {
    let G = ZB7(B).mtimeMs;
    if (Q - G > XB7) bo2(A, {
      recursive: !0,
      force: !0
    })
  } catch (G) {
    k(`Failed to delete orphaned version: ${A}: ${G}`)
  }
}
// @from(Ln 382600, Col 0)
function ko2(A) {
  if (qF1(A).length === 0) try {
    bo2(A, {
      recursive: !0,
      force: !0
    })
  } catch (Q) {
    k(`Failed to remove empty dir: ${A}: ${Q}`)
  }
}
// @from(Ln 382611, Col 0)
function qF1(A) {
  try {
    return GB7(A, {
      withFileTypes: !0
    }).filter((Q) => Q.isDirectory()).map((Q) => Q.name)
  } catch {
    return []
  }
}
// @from(Ln 382620, Col 4)
JB7 = ".orphaned_at"
// @from(Ln 382621, Col 2)
XB7 = 604800000
// @from(Ln 382622, Col 4)
Lx = w(() => {
  A0();
  GK();
  afA();
  LyA();
  mbA();
  CF1();
  WV();
  PN();
  T1();
  akA()
})
// @from(Ln 382652, Col 0)
function uo2() {
  return new Date().toISOString()
}
// @from(Ln 382656, Col 0)
function JL0(A, Q) {
  let B = ZL0(A, Q),
    G = ZL0(A) + YL0;
  if (!B.startsWith(G) && B !== ZL0(A)) throw Error(`Path traversal detected: "${Q}" would escape the base directory`);
  return B
}
// @from(Ln 382662, Col 0)
async function dO(A, Q, B = "user", G, Z) {
  let Y = typeof Q.source === "string" && Z ? Z : Q.source,
    J = await $3A(Y, {
      manifest: Q
    }),
    X = Z || J.path,
    I = await TZ1(X),
    D = uo2(),
    W = await Od(A, Q.source, J.manifest, X, Q.version),
    K = xb(A, W),
    V = J.path;
  if (J.path !== K) {
    if (ho2(go2(K), {
        recursive: !0
      }), VB7(K)) FB7(K, {
      recursive: !0,
      force: !0
    });
    let F = J.path.endsWith(YL0) ? J.path : J.path + YL0;
    if (K.startsWith(F)) {
      let E = HB7(EB7(), `claude-plugin-temp-${Date.now()}`);
      await GL0(J.path, E), ho2(go2(K), {
        recursive: !0
      }), await GL0(E, K)
    } else await GL0(J.path, K);
    V = K
  }
  return NI0(A, {
    version: W,
    installedAt: D,
    lastUpdated: D,
    installPath: V,
    gitCommitSha: I
  }, B, G), V
}
// @from(Ln 382698, Col 0)
function mo2(A, Q = "user", B) {
  let G = uo2();
  NI0(A.pluginId, {
    version: A.version || "unknown",
    installedAt: G,
    lastUpdated: G,
    installPath: A.installPath
  }, Q, B)
}
// @from(Ln 382707, Col 0)
async function ofA({
  pluginId: A,
  entry: Q,
  marketplaceName: B,
  scope: G = "user"
}) {
  try {
    let Z = Pb(G),
      Y = G !== "user" ? o1() : void 0,
      J, {
        source: X
      } = Q;
    if (Tb(X)) {
      let W = await NF(A);
      if (W) J = JL0(W.marketplaceInstallLocation, X)
    }
    await dO(A, Q, G, Y, J);
    let D = {
      ...dB(Z)?.enabledPlugins,
      [A]: !0
    };
    return pB(Z, {
      enabledPlugins: D
    }), l("tengu_plugin_installed", {
      plugin_id: A,
      marketplace_name: B
    }), NY(), {
      success: !0,
      message: `✓ Installed ${Q.name}. Restart Claude Code to load new plugins.`
    }
  } catch (Z) {
    let Y = Z instanceof Error ? Z.message : String(Z);
    return e(Z instanceof Error ? Z : Error(`Failed to install plugin: ${String(Z)}`)), {
      success: !1,
      error: `Failed to install: ${Y}`
    }
  }
}
// @from(Ln 382745, Col 4)
cc = w(() => {
  pz();
  PN();
  GK();
  HI();
  z4A();
  GB();
  V2();
  Lx();
  Z0();
  v1();
  jZ1()
})
// @from(Ln 382767, Col 0)
function Tr() {
  return T8(zQ(), "plugins", "cache")
}
// @from(Ln 382771, Col 0)
function xb(A, Q) {
  let B = Tr(),
    [G, Z] = A.split("@"),
    Y = (Z || "unknown").replace(/[^a-zA-Z0-9\-_]/g, "-"),
    J = (G || A).replace(/[^a-zA-Z0-9\-_]/g, "-"),
    X = Q.replace(/[^a-zA-Z0-9\-_.]/g, "-");
  return T8(B, Y, J, X)
}
// @from(Ln 382780, Col 0)
function rfA(A, Q) {
  let B = vA();
  if (!B.existsSync(Q)) B.mkdirSync(Q);
  let G = B.readdirSync(A);
  for (let Z of G) {
    let Y = T8(A, Z.name),
      J = T8(Q, Z.name);
    if (Z.isDirectory()) rfA(Y, J);
    else if (Z.isFile()) B.copyFileSync(Y, J);
    else if (Z.isSymbolicLink()) {
      let X = B.readlinkSync(Y),
        I;
      try {
        I = B.realpathSync(Y)
      } catch {
        B.symlinkSync(X, J);
        continue
      }
      let D;
      try {
        D = B.realpathSync(A)
      } catch {
        D = A
      }
      let W = D.endsWith(co2) ? D : D + co2;
      if (I.startsWith(W) || I === D) {
        let K = do2(D, I),
          V = T8(Q, K),
          F = do2(io2(J), V);
        B.symlinkSync(F, J)
      } else B.symlinkSync(I, J)
    }
  }
}
// @from(Ln 382814, Col 0)
async function wF1(A, Q, B, G, Z) {
  let Y = vA(),
    J = xb(Q, B);
  if (Y.existsSync(J) && !Y.isDirEmptySync(J)) return k(`Plugin ${Q} version ${B} already cached at ${J}`), J;
  if (Y.existsSync(J) && Y.isDirEmptySync(J)) k(`Removing empty cache directory for ${Q} at ${J}`), Y.rmdirSync(J);
  if (Y.mkdirSync(io2(J)), G && typeof G.source === "string" && Z) {
    let I = JL0(Z, G.source);
    if (Y.existsSync(I)) k(`Copying source directory ${G.source} for plugin ${Q}`), rfA(I, J);
    else throw Error(`Plugin source directory not found: ${I} (from entry.source: ${G.source})`)
  } else k(`Copying plugin ${Q} to versioned cache (fallback to full copy)`), rfA(A, J);
  let X = T8(J, ".git");
  if (Y.existsSync(X)) Y.rmSync(X, {
    recursive: !0,
    force: !0
  });
  if (Y.isDirEmptySync(J)) throw Error(`Failed to copy plugin ${Q} to versioned cache: destination is empty after copy`);
  return k(`Successfully cached plugin ${Q} at ${J}`), J
}
// @from(Ln 382833, Col 0)
function CB7(A) {
  try {
    let Q = new URL(A);
    if (!["https:", "http:", "file:"].includes(Q.protocol)) {
      if (!/^git@[a-zA-Z0-9.-]+:/.test(A)) throw Error(`Invalid git URL protocol: ${Q.protocol}. Only HTTPS, HTTP, file:// and SSH (git@) URLs are supported.`)
    }
    return A
  } catch {
    if (/^git@[a-zA-Z0-9.-]+:/.test(A)) return A;
    throw Error(`Invalid git URL: ${A}`)
  }
}
// @from(Ln 382845, Col 0)
async function UB7(A, Q) {
  let B = vA(),
    G = T8(zQ(), "plugins", "npm-cache");
  B.mkdirSync(G);
  let Z = T8(G, "node_modules", A);
  if (!B.existsSync(Z)) {
    k(`Installing npm package ${A} to cache`);
    let J = await TQ("npm", ["install", A, "--prefix", G], {
      useCwd: !1
    });
    if (J.code !== 0) throw Error(`Failed to install npm package: ${J.stderr}`)
  }
  rfA(Z, Q), k(`Copied npm package ${A} from cache to ${Q}`)
}
// @from(Ln 382859, Col 0)
async function qB7(A, Q, B) {
  let G = ["clone", "--depth", "1", "--recurse-submodules", "--shallow-submodules"];
  if (B) G.push("--branch", B);
  G.push(A, Q);
  let Z = await TQ("git", G);
  if (Z.code !== 0) throw Error(`Failed to clone repository: ${Z.stderr}`)
}
// @from(Ln 382866, Col 0)
async function no2(A, Q, B) {
  let G = CB7(A);
  await qB7(G, Q, B);
  let Z = B ? ` (ref: ${B})` : "";
  k(`Cloned repository from ${G}${Z} to ${Q}`)
}
// @from(Ln 382872, Col 0)
async function NB7(A, Q, B) {
  if (!/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/.test(A)) throw Error(`Invalid GitHub repository format: ${A}. Expected format: owner/repo`);
  let G = `git@github.com:${A}.git`;
  return no2(G, Q, B)
}
// @from(Ln 382877, Col 0)
async function wB7(A, Q) {
  let B = vA();
  if (!B.existsSync(A)) throw Error(`Source path does not exist: ${A}`);
  rfA(A, Q);
  let G = T8(Q, ".git");
  if (B.existsSync(G)) B.rmSync(G, {
    recursive: !0,
    force: !0
  })
}
// @from(Ln 382888, Col 0)
function LB7(A) {
  let Q = Date.now(),
    B = Math.random().toString(36).substring(2, 8),
    G;
  if (typeof A === "string") G = "local";
  else switch (A.source) {
    case "npm":
      G = "npm";
      break;
    case "pip":
      G = "pip";
      break;
    case "github":
      G = "github";
      break;
    case "url":
      G = "git";
      break;
    default:
      G = "unknown"
  }
  return `temp_${G}_${Q}_${B}`
}
// @from(Ln 382911, Col 0)
async function $3A(A, Q) {
  let B = vA(),
    G = Tr();
  B.mkdirSync(G);
  let Z = LB7(A),
    Y = T8(G, Z),
    J = !1;
  try {
    if (k(`Caching plugin from source: ${eA(A)} to temporary path ${Y}`), J = !0, typeof A === "string") await wB7(A, Y);
    else switch (A.source) {
      case "npm":
        await UB7(A.package, Y);
        break;
      case "github":
        await NB7(A.repo, Y, A.ref);
        break;
      case "url":
        await no2(A.url, Y, A.ref);
        break;
      case "pip":
        throw Error("Python package plugins are not yet supported");
      default:
        throw Error("Unsupported plugin source type")
    }
  } catch (V) {
    if (J && B.existsSync(Y)) {
      k(`Cleaning up failed installation at ${Y}`);
      try {
        B.rmSync(Y, {
          recursive: !0,
          force: !0
        })
      } catch (F) {
        k(`Failed to clean up installation: ${F}`, {
          level: "error"
        })
      }
    }
    throw V
  }
  let X = T8(Y, ".claude-plugin", "plugin.json"),
    I = T8(Y, "plugin.json"),
    D;
  if (B.existsSync(X)) try {
    let V = B.readFileSync(X, {
        encoding: "utf-8"
      }),
      F = AQ(V),
      H = V4A.safeParse(F);
    if (H.success) D = H.data;
    else {
      let E = H.error.issues.map((z) => `${z.path.join(".")}: ${z.message}`).join(", ");
      throw k(`Invalid manifest at ${X}: ${E}`, {
        level: "error"
      }), Error(`Plugin has an invalid manifest file at ${X}. Validation errors: ${E}`)
    }
  } catch (V) {
    if (V instanceof Error && V.message.includes("invalid manifest file")) throw V;
    let F = V instanceof Error ? V.message : String(V);
    throw k(`Failed to parse manifest at ${X}: ${F}`, {
      level: "error"
    }), Error(`Plugin has a corrupt manifest file at ${X}. JSON parse error: ${F}`)
  } else if (B.existsSync(I)) try {
    let V = B.readFileSync(I, {
        encoding: "utf-8"
      }),
      F = AQ(V),
      H = V4A.safeParse(F);
    if (H.success) D = H.data;
    else {
      let E = H.error.issues.map((z) => `${z.path.join(".")}: ${z.message}`).join(", ");
      throw k(`Invalid legacy manifest at ${I}: ${E}`, {
        level: "error"
      }), Error(`Plugin has an invalid manifest file at ${I}. Validation errors: ${E}`)
    }
  } catch (V) {
    if (V instanceof Error && V.message.includes("invalid manifest file")) throw V;
    let F = V instanceof Error ? V.message : String(V);
    throw k(`Failed to parse legacy manifest at ${I}: ${F}`, {
      level: "error"
    }), Error(`Plugin has a corrupt manifest file at ${I}. JSON parse error: ${F}`)
  } else D = Q?.manifest || {
    name: Z,
    description: `Plugin cached from ${typeof A==="string"?A:A.source}`
  };
  let W = D.name.replace(/[^a-zA-Z0-9-_]/g, "-"),
    K = T8(G, W);
  if (B.existsSync(K)) k(`Removing old cached version at ${K}`), B.rmSync(K, {
    recursive: !0,
    force: !0
  });
  return B.renameSync(Y, K), k(`Successfully cached plugin ${D.name} to ${K}`), {
    path: K,
    manifest: D
  }
}
// @from(Ln 383008, Col 0)
function LF1(A, Q, B) {
  let G = vA();
  if (!G.existsSync(A)) return {
    name: Q,
    description: `Plugin from ${B}`
  };
  try {
    let Z = G.readFileSync(A, {
        encoding: "utf-8"
      }),
      Y = AQ(Z),
      J = V4A.safeParse(Y);
    if (J.success) return J.data;
    let X = J.error.issues.map((I) => `${I.path.join(".")}: ${I.message}`).join(", ");
    throw k(`Plugin ${Q} has an invalid manifest file at ${A}. Validation errors: ${X}`, {
      level: "error"
    }), Error(`Plugin ${Q} has an invalid manifest file at ${A}.

Validation errors: ${X}

Please fix the manifest or remove it. The plugin cannot load with an invalid manifest.`)
  } catch (Z) {
    if (Z instanceof Error && Z.message.includes("invalid manifest file")) throw Z;
    let Y = Z instanceof Error ? Z.message : String(Z);
    throw k(`Plugin ${Q} has a corrupt manifest file at ${A}. Parse error: ${Y}`, {
      level: "error"
    }), Error(`Plugin ${Q} has a corrupt manifest file at ${A}.

JSON parse error: ${Y}

Please check the file for syntax errors.`)
  }
}
// @from(Ln 383042, Col 0)
function po2(A, Q) {
  let B = vA();
  if (!B.existsSync(A)) throw Error(`Hooks file not found at ${A} for plugin ${Q}. If the manifest declares hooks, the file must exist.`);
  let G = B.readFileSync(A, {
      encoding: "utf-8"
    }),
    Z = AQ(G);
  return l62.parse(Z).hooks
}
// @from(Ln 383052, Col 0)
function ao2(A, Q, B, G, Z = !0) {
  let Y = vA(),
    J = [],
    X = T8(A, ".claude-plugin", "plugin.json"),
    I = LF1(X, G, Q),
    D = {
      name: I.name,
      manifest: I,
      path: A,
      source: Q,
      repository: Q,
      enabled: B
    },
    W = T8(A, "commands");
  if (!I.commands && Y.existsSync(W)) D.commandsPath = W;
  if (I.commands) {
    let $ = Object.values(I.commands)[0];
    if (typeof I.commands === "object" && !Array.isArray(I.commands) && $ && typeof $ === "object" && (("source" in $) || ("content" in $))) {
      let O = {},
        L = [];
      for (let [M, _] of Object.entries(I.commands)) {
        if (!_ || typeof _ !== "object") continue;
        if (_.source) {
          let j = T8(A, _.source);
          if (Y.existsSync(j)) L.push(j), O[M] = _;
          else k(`Command ${M} path ${_.source} specified in manifest but not found at ${j} for ${I.name}`, {
            level: "warn"
          }), e(Error(`Plugin component file not found: ${j} for ${I.name}`)), J.push({
            type: "path-not-found",
            source: Q,
            plugin: I.name,
            path: j,
            component: "commands"
          })
        } else if (_.content) O[M] = _
      }
      if (L.length > 0) D.commandsPaths = L;
      if (Object.keys(O).length > 0) D.commandsMetadata = O
    } else {
      let O = Array.isArray(I.commands) ? I.commands : [I.commands],
        L = [];
      for (let M of O) {
        if (typeof M !== "string") {
          k(`Unexpected command format in manifest for ${I.name}`, {
            level: "error"
          });
          continue
        }
        let _ = T8(A, M);
        if (Y.existsSync(_)) L.push(_);
        else k(`Command path ${M} specified in manifest but not found at ${_} for ${I.name}`, {
          level: "warn"
        }), e(Error(`Plugin component file not found: ${_} for ${I.name}`)), J.push({
          type: "path-not-found",
          source: Q,
          plugin: I.name,
          path: _,
          component: "commands"
        })
      }
      if (L.length > 0) D.commandsPaths = L
    }
  }
  let K = T8(A, "agents");
  if (!I.agents && Y.existsSync(K)) D.agentsPath = K;
  if (I.agents) {
    let $ = Array.isArray(I.agents) ? I.agents : [I.agents],
      O = [];
    for (let L of $) {
      let M = T8(A, L);
      if (Y.existsSync(M)) O.push(M);
      else k(`Agent path ${L} specified in manifest but not found at ${M} for ${I.name}`, {
        level: "warn"
      }), e(Error(`Plugin component file not found: ${M} for ${I.name}`)), J.push({
        type: "path-not-found",
        source: Q,
        plugin: I.name,
        path: M,
        component: "agents"
      })
    }
    if (O.length > 0) D.agentsPaths = O
  }
  let V = T8(A, "skills");
  if (!I.skills && Y.existsSync(V)) D.skillsPath = V;
  if (I.skills) {
    let $ = Array.isArray(I.skills) ? I.skills : [I.skills],
      O = [];
    for (let L of $) {
      let M = T8(A, L);
      if (Y.existsSync(M)) O.push(M);
      else k(`Skill path ${L} specified in manifest but not found at ${M} for ${I.name}`, {
        level: "warn"
      }), e(Error(`Plugin component file not found: ${M} for ${I.name}`)), J.push({
        type: "path-not-found",
        source: Q,
        plugin: I.name,
        path: M,
        component: "skills"
      })
    }
    if (O.length > 0) D.skillsPaths = O
  }
  let F = T8(A, "output-styles");
  if (!I.outputStyles && Y.existsSync(F)) D.outputStylesPath = F;
  if (I.outputStyles) {
    let $ = Array.isArray(I.outputStyles) ? I.outputStyles : [I.outputStyles],
      O = [];
    for (let L of $) {
      let M = T8(A, L);
      if (Y.existsSync(M)) O.push(M);
      else k(`Output style path ${L} specified in manifest but not found at ${M} for ${I.name}`, {
        level: "warn"
      }), e(Error(`Plugin component file not found: ${M} for ${I.name}`)), J.push({
        type: "path-not-found",
        source: Q,
        plugin: I.name,
        path: M,
        component: "output-styles"
      })
    }
    if (O.length > 0) D.outputStylesPaths = O
  }
  let H, E = new Set,
    z = T8(A, "hooks", "hooks.json");
  if (Y.existsSync(z)) try {
    H = po2(z, I.name);
    try {
      E.add(Y.realpathSync(z))
    } catch {
      E.add(z)
    }
    k(`Loaded hooks from standard location for plugin ${I.name}: ${z}`)
  } catch ($) {
    let O = $ instanceof Error ? $.message : String($);
    k(`Failed to load hooks for ${I.name}: ${O}`, {
      level: "error"
    }), e($ instanceof Error ? $ : Error(O)), J.push({
      type: "hook-load-failed",
      source: Q,
      plugin: I.name,
      hookPath: z,
      reason: O
    })
  }
  if (I.hooks) {
    let $ = Array.isArray(I.hooks) ? I.hooks : [I.hooks];
    for (let O of $)
      if (typeof O === "string") {
        let L = T8(A, O);
        if (!Y.existsSync(L)) {
          k(`Hooks file ${O} specified in manifest but not found at ${L} for ${I.name}`, {
            level: "error"
          }), e(Error(`Plugin component file not found: ${L} for ${I.name}`)), J.push({
            type: "path-not-found",
            source: Q,
            plugin: I.name,
            path: L,
            component: "hooks"
          });
          continue
        }
        let M;
        try {
          M = Y.realpathSync(L)
        } catch {
          M = L
        }
        if (E.has(M)) {
          if (k(`Skipping duplicate hooks file for plugin ${I.name}: ${O} (resolves to already-loaded file: ${M})`), Z) {
            let _ = `Duplicate hooks file detected: ${O} resolves to already-loaded file ${M}. The standard hooks/hooks.json is loaded automatically, so manifest.hooks should only reference additional hook files.`;
            e(Error(_)), J.push({
              type: "hook-load-failed",
              source: Q,
              plugin: I.name,
              hookPath: L,
              reason: _
            })
          }
          continue
        }
        try {
          let _ = po2(L, I.name);
          try {
            H = lo2(H, _), E.add(M), k(`Loaded and merged hooks from manifest for plugin ${I.name}: ${O}`)
          } catch (j) {
            let x = j instanceof Error ? j.message : String(j);
            k(`Failed to merge hooks from ${O} for ${I.name}: ${x}`, {
              level: "error"
            }), e(j instanceof Error ? j : Error(x)), J.push({
              type: "hook-load-failed",
              source: Q,
              plugin: I.name,
              hookPath: L,
              reason: `Failed to merge: ${x}`
            })
          }
        } catch (_) {
          let j = _ instanceof Error ? _.message : String(_);
          k(`Failed to load hooks from ${O} for ${I.name}: ${j}`, {
            level: "error"
          }), e(_ instanceof Error ? _ : Error(j)), J.push({
            type: "hook-load-failed",
            source: Q,
            plugin: I.name,
            hookPath: L,
            reason: j
          })
        }
      } else if (typeof O === "object") H = lo2(H, O)
  }
  if (H) D.hooksConfig = H;
  return {
    plugin: D,
    errors: J
  }
}
// @from(Ln 383270, Col 0)
function lo2(A, Q) {
  if (!A) return Q;
  let B = {
    ...A
  };
  for (let [G, Z] of Object.entries(Q))
    if (!B[G]) B[G] = Z;
    else B[G] = [...B[G] || [], ...Z];
  return B
}
// @from(Ln 383280, Col 0)
async function OB7() {
  let Q = jQ().enabledPlugins || {},
    B = [],
    G = [],
    Z = Object.entries(Q).filter(([J, X]) => {
      return W4A.safeParse(J).success && X !== void 0
    }),
    Y = await D5();
  for (let [J, X] of Z) try {
    let [I, D] = J.split("@"), W = Y[D];
    if (W && !H4A(W.source)) {
      let F = AyA(W.source),
        H = WVA() || [];
      G.push({
        type: "marketplace-blocked-by-policy",
        source: J,
        plugin: I,
        marketplace: D,
        blockedByBlocklist: F,
        allowedSources: F ? [] : H.map((E) => KVA(E))
      });
      continue
    }
    let K = HI0(J);
    if (!K) {
      G.push({
        type: "plugin-not-found",
        source: J,
        pluginId: I,
        marketplace: D
      });
      continue
    }
    let V = await MB7(K.entry, K.marketplaceInstallLocation, J, X === !0, G);
    if (V) B.push(V)
  } catch (I) {
    let D = I instanceof Error ? I : Error(String(I));
    e(D), G.push({
      type: "generic-error",
      source: J,
      error: D.message
    })
  }
  return {
    plugins: B,
    errors: G
  }
}
// @from(Ln 383328, Col 0)
async function MB7(A, Q, B, G, Z) {
  k(`Loading plugin ${A.name} from source: ${eA(A.source)}`);
  let Y = vA(),
    J = [],
    X;
  if (typeof A.source === "string") {
    let V = Y.statSync(Q).isDirectory() ? Q : T8(Q, ".."),
      F = T8(V, A.source);
    if (!Y.existsSync(F)) {
      let H = Error(`Plugin path not found: ${F}`);
      return k(`Plugin path not found: ${F}`, {
        level: "error"
      }), e(H), Z.push({
        type: "generic-error",
        source: B,
        error: `Plugin directory not found at path: ${F}. Check that the marketplace entry has the correct path.`
      }), null
    }
    try {
      let H = T8(F, ".claude-plugin", "plugin.json"),
        E;
      try {
        E = LF1(H, A.name, A.source)
      } catch {}
      let z = await Od(B, A.source, E, V, A.version);
      X = await wF1(F, B, z, A, V), k(`Copied local plugin ${A.name} to versioned cache: ${X}`)
    } catch (H) {
      let E = H instanceof Error ? H.message : String(H);
      k(`Failed to copy plugin ${A.name} to versioned cache: ${E}. Using marketplace path.`, {
        level: "warn"
      }), X = F
    }
  } else try {
    let V = await Od(B, A.source, void 0, void 0, A.version),
      F = xb(B, V);
    if (Y.existsSync(F)) k(`Using versioned cached plugin ${A.name} from ${F}`), X = F;
    else {
      let H = await $3A(A.source, {
          manifest: {
            name: A.name
          }
        }),
        E = await Od(B, A.source, H.manifest, H.path, A.version);
      if (X = await wF1(H.path, B, E, A, void 0), H.path !== X) Y.rmSync(H.path, {
        recursive: !0,
        force: !0
      })
    }
  } catch (V) {
    let F = V instanceof Error ? V.message : String(V);
    return k(`Failed to cache plugin ${A.name}: ${F}`, {
      level: "error"
    }), e(V instanceof Error ? V : Error(F)), Z.push({
      type: "generic-error",
      source: B,
      error: `Failed to download/cache plugin ${A.name}: ${F}`
    }), null
  }
  let I = T8(X, ".claude-plugin", "plugin.json"),
    D = Y.existsSync(I),
    {
      plugin: W,
      errors: K
    } = ao2(X, B, G, A.name, A.strict ?? !0);
  if (J.push(...K), !D) {
    if (W.manifest = {
        ...A,
        id: void 0,
        source: void 0,
        strict: void 0
      }, W.name = W.manifest.name, A.commands) {
      let V = Object.values(A.commands)[0];
      if (typeof A.commands === "object" && !Array.isArray(A.commands) && V && typeof V === "object" && (("source" in V) || ("content" in V))) {
        let F = {},
          H = [];
        for (let [E, z] of Object.entries(A.commands)) {
          if (!z || typeof z !== "object" || !z.source) continue;
          let $ = T8(X, z.source);
          if (Y.existsSync($)) H.push($), F[E] = z;
          else k(`Command ${E} path ${z.source} from marketplace entry not found at ${$} for ${A.name}`, {
            level: "warn"
          }), e(Error(`Plugin component file not found: ${$} for ${A.name}`)), J.push({
            type: "path-not-found",
            source: B,
            plugin: A.name,
            path: $,
            component: "commands"
          })
        }
        if (H.length > 0) W.commandsPaths = H, W.commandsMetadata = F
      } else {
        let F = Array.isArray(A.commands) ? A.commands : [A.commands],
          H = [];
        for (let E of F) {
          if (typeof E !== "string") {
            k(`Unexpected command format in marketplace entry for ${A.name}`, {
              level: "error"
            });
            continue
          }
          let z = T8(X, E);
          if (Y.existsSync(z)) H.push(z);
          else k(`Command path ${E} from marketplace entry not found at ${z} for ${A.name}`, {
            level: "warn"
          }), e(Error(`Plugin component file not found: ${z} for ${A.name}`)), J.push({
            type: "path-not-found",
            source: B,
            plugin: A.name,
            path: z,
            component: "commands"
          })
        }
        if (H.length > 0) W.commandsPaths = H
      }
    }
    if (A.agents) {
      let V = Array.isArray(A.agents) ? A.agents : [A.agents],
        F = [];
      for (let H of V) {
        let E = T8(X, H);
        if (Y.existsSync(E)) F.push(E);
        else k(`Agent path ${H} from marketplace entry not found at ${E} for ${A.name}`, {
          level: "warn"
        }), e(Error(`Plugin component file not found: ${E} for ${A.name}`)), J.push({
          type: "path-not-found",
          source: B,
          plugin: A.name,
          path: E,
          component: "agents"
        })
      }
      if (F.length > 0) W.agentsPaths = F
    }
    if (A.skills) {
      k(`Processing ${Array.isArray(A.skills)?A.skills.length:1} skill paths for plugin ${A.name}`);
      let V = Array.isArray(A.skills) ? A.skills : [A.skills],
        F = [];
      for (let H of V) {
        let E = T8(X, H);
        if (k(`Checking skill path: ${H} -> ${E} (exists: ${Y.existsSync(E)})`), Y.existsSync(E)) F.push(E);
        else k(`Skill path ${H} from marketplace entry not found at ${E} for ${A.name}`, {
          level: "warn"
        }), e(Error(`Plugin component file not found: ${E} for ${A.name}`)), J.push({
          type: "path-not-found",
          source: B,
          plugin: A.name,
          path: E,
          component: "skills"
        })
      }
      if (k(`Found ${F.length} valid skill paths for plugin ${A.name}, setting skillsPaths`), F.length > 0) W.skillsPaths = F
    } else k(`Plugin ${A.name} has no entry.skills defined`);
    if (A.outputStyles) {
      let V = Array.isArray(A.outputStyles) ? A.outputStyles : [A.outputStyles],
        F = [];
      for (let H of V) {
        let E = T8(X, H);
        if (Y.existsSync(E)) F.push(E);
        else k(`Output style path ${H} from marketplace entry not found at ${E} for ${A.name}`, {
          level: "warn"
        }), e(Error(`Plugin component file not found: ${E} for ${A.name}`)), J.push({
          type: "path-not-found",
          source: B,
          plugin: A.name,
          path: E,
          component: "output-styles"
        })
      }
      if (F.length > 0) W.outputStylesPaths = F
    }
    if (A.hooks) W.hooksConfig = A.hooks
  } else if (!A.strict && D && (A.commands || A.agents || A.skills || A.hooks || A.outputStyles)) {
    let V = Error(`Plugin ${A.name} has both plugin.json and marketplace manifest entries for commands/agents/skills/hooks/outputStyles. This is a conflict.`);
    return k(`Plugin ${A.name} has both plugin.json and marketplace manifest entries for commands/agents/skills/hooks/outputStyles. This is a conflict.`, {
      level: "error"
    }), e(V), Z.push({
      type: "generic-error",
      source: B,
      error: `Plugin ${A.name} has conflicting manifests: both plugin.json and marketplace entry specify components. Set strict: true in marketplace entry or remove component specs from one location.`
    }), null
  } else if (D) {
    if (A.commands) {
      let V = Object.values(A.commands)[0];
      if (typeof A.commands === "object" && !Array.isArray(A.commands) && V && typeof V === "object" && (("source" in V) || ("content" in V))) {
        let F = {
            ...W.commandsMetadata || {}
          },
          H = [];
        for (let [E, z] of Object.entries(A.commands)) {
          if (!z || typeof z !== "object" || !z.source) continue;
          let $ = T8(X, z.source);
          if (Y.existsSync($)) H.push($), F[E] = z;
          else k(`Command ${E} path ${z.source} from marketplace entry not found at ${$} for ${A.name}`, {
            level: "warn"
          }), e(Error(`Plugin component file not found: ${$} for ${A.name}`)), J.push({
            type: "path-not-found",
            source: B,
            plugin: A.name,
            path: $,
            component: "commands"
          })
        }
        if (H.length > 0) W.commandsPaths = [...W.commandsPaths || [], ...H], W.commandsMetadata = F
      } else {
        let F = Array.isArray(A.commands) ? A.commands : [A.commands],
          H = [];
        for (let E of F) {
          if (typeof E !== "string") {
            k(`Unexpected command format in marketplace entry for ${A.name}`, {
              level: "error"
            });
            continue
          }
          let z = T8(X, E);
          if (Y.existsSync(z)) H.push(z);
          else k(`Command path ${E} from marketplace entry not found at ${z} for ${A.name}`, {
            level: "warn"
          }), e(Error(`Plugin component file not found: ${z} for ${A.name}`)), J.push({
            type: "path-not-found",
            source: B,
            plugin: A.name,
            path: z,
            component: "commands"
          })
        }
        if (H.length > 0) W.commandsPaths = [...W.commandsPaths || [], ...H]
      }
    }
    if (A.agents) {
      let V = Array.isArray(A.agents) ? A.agents : [A.agents],
        F = [];
      for (let H of V) {
        let E = T8(X, H);
        if (Y.existsSync(E)) F.push(E);
        else k(`Agent path ${H} from marketplace entry not found at ${E} for ${A.name}`, {
          level: "warn"
        }), e(Error(`Plugin component file not found: ${E} for ${A.name}`)), J.push({
          type: "path-not-found",
          source: B,
          plugin: A.name,
          path: E,
          component: "agents"
        })
      }
      if (F.length > 0) W.agentsPaths = [...W.agentsPaths || [], ...F]
    }
    if (A.skills) {
      let V = Array.isArray(A.skills) ? A.skills : [A.skills],
        F = [];
      for (let H of V) {
        let E = T8(X, H);
        if (Y.existsSync(E)) F.push(E);
        else k(`Skill path ${H} from marketplace entry not found at ${E} for ${A.name}`, {
          level: "warn"
        }), e(Error(`Plugin component file not found: ${E} for ${A.name}`)), J.push({
          type: "path-not-found",
          source: B,
          plugin: A.name,
          path: E,
          component: "skills"
        })
      }
      if (F.length > 0) W.skillsPaths = [...W.skillsPaths || [], ...F]
    }
    if (A.outputStyles) {
      let V = Array.isArray(A.outputStyles) ? A.outputStyles : [A.outputStyles],
        F = [];
      for (let H of V) {
        let E = T8(X, H);
        if (Y.existsSync(E)) F.push(E);
        else k(`Output style path ${H} from marketplace entry not found at ${E} for ${A.name}`, {
          level: "warn"
        }), e(Error(`Plugin component file not found: ${E} for ${A.name}`)), J.push({
          type: "path-not-found",
          source: B,
          plugin: A.name,
          path: E,
          component: "output-styles"
        })
      }
      if (F.length > 0) W.outputStylesPaths = [...W.outputStylesPaths || [], ...F]
    }
    if (A.hooks) W.hooksConfig = {
      ...W.hooksConfig || {},
      ...A.hooks
    }
  }
  return Z.push(...J), W
}
// @from(Ln 383617, Col 0)
async function RB7(A) {
  if (A.length === 0) return {
    plugins: [],
    errors: []
  };
  let Q = [],
    B = [],
    G = vA();
  for (let [Z, Y] of A.entries()) try {
    let J = zB7(Y);
    if (!G.existsSync(J)) {
      k(`Plugin path does not exist: ${J}, skipping`, {
        level: "warn"
      }), B.push({
        type: "path-not-found",
        source: `inline[${Z}]`,
        path: J,
        component: "commands"
      });
      continue
    }
    let X = $B7(J),
      {
        plugin: I,
        errors: D
      } = ao2(J, `${X}@inline`, !0, X);
    I.source = `${I.name}@inline`, I.repository = `${I.name}@inline`, Q.push(I), B.push(...D), k(`Loaded inline plugin from path: ${I.name}`)
  } catch (J) {
    let X = J instanceof Error ? J.message : String(J);
    k(`Failed to load session plugin from ${Y}: ${X}`, {
      level: "warn"
    }), B.push({
      type: "generic-error",
      source: `inline[${Z}]`,
      error: `Failed to load plugin: ${X}`
    })
  }
  if (Q.length > 0) k(`Loaded ${Q.length} session-only plugins from --plugin-dir`);
  return {
    plugins: Q,
    errors: B
  }
}
// @from(Ln 383661, Col 0)
function Bt() {
  DG.cache?.clear?.()
}
// @from(Ln 383664, Col 4)
DG
// @from(Ln 383665, Col 4)
GK = w(() => {
  Y9();
  DQ();
  C0();
  pz();
  T1();
  v1();
  GB();
  HI();
  E4A();
  t4();
  fQ();
  jZ1();
  JZ();
  cc();
  A0();
  DG = W0(async () => {
    let A = await OB7(),
      Q = [...A.plugins],
      B = [...A.errors],
      G = Qf0();
    if (G.length > 0) {
      let Y = await RB7(G);
      Q.push(...Y.plugins), B.push(...Y.errors)
    }
    k(`Found ${Q.length} plugins (${Q.filter((Y)=>Y.enabled).length} enabled, ${Q.filter((Y)=>!Y.enabled).length} disabled)`);
    let Z = Q.filter((Y) => Y.enabled);
    if (Z.length > 0) T9("plugins");
    return {
      enabled: Z,
      disabled: Q.filter((Y) => !Y.enabled),
      errors: B
    }
  })
})
// @from(Ln 383709, Col 0)
function uEA(A) {
  return e3(A) === Ej
}
// @from(Ln 383713, Col 0)
function so2(A) {
  ro2.add(A)
}
// @from(Ln 383717, Col 0)
function to2(A) {
  return ro2.has(A)
}