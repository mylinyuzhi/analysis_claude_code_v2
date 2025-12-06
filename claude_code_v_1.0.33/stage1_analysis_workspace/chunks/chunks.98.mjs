
// @from(Start 9231163, End 9234517)
vA0 = z((YjG, xA0) => {
  var Ji = B6();
  x3();
  iLA();
  cM();
  (function() {
    if (Ji.prime) {
      xA0.exports = Ji.prime;
      return
    }
    var A = xA0.exports = Ji.prime = Ji.prime || {},
      Q = Ji.jsbn.BigInteger,
      B = [6, 4, 2, 4, 2, 4, 6, 2],
      G = new Q(null);
    G.fromInt(30);
    var Z = function(F, K) {
      return F | K
    };
    A.generateProbablePrime = function(F, K, D) {
      if (typeof K === "function") D = K, K = {};
      K = K || {};
      var H = K.algorithm || "PRIMEINC";
      if (typeof H === "string") H = {
        name: H
      };
      H.options = H.options || {};
      var C = K.prng || Ji.random,
        E = {
          nextBytes: function(U) {
            var q = C.getBytesSync(U.length);
            for (var w = 0; w < U.length; ++w) U[w] = q.charCodeAt(w)
          }
        };
      if (H.name === "PRIMEINC") return I(F, E, H.options, D);
      throw Error("Invalid prime generation algorithm: " + H.name)
    };

    function I(F, K, D, H) {
      if ("workers" in D) return W(F, K, D, H);
      return Y(F, K, D, H)
    }

    function Y(F, K, D, H) {
      var C = X(F, K),
        E = 0,
        U = V(C.bitLength());
      if ("millerRabinTests" in D) U = D.millerRabinTests;
      var q = 10;
      if ("maxBlockTime" in D) q = D.maxBlockTime;
      J(C, F, K, E, U, q, H)
    }

    function J(F, K, D, H, C, E, U) {
      var q = +new Date;
      do {
        if (F.bitLength() > K) F = X(K, D);
        if (F.isProbablePrime(C)) return U(null, F);
        F.dAddOffset(B[H++ % 8], 0)
      } while (E < 0 || +new Date - q < E);
      Ji.util.setImmediate(function() {
        J(F, K, D, H, C, E, U)
      })
    }

    function W(F, K, D, H) {
      if (typeof Worker > "u") return Y(F, K, D, H);
      var C = X(F, K),
        E = D.workers,
        U = D.workLoad || 100,
        q = U * 30 / 8,
        w = D.workerScript || "forge/prime.worker.js";
      if (E === -1) return Ji.util.estimateCores(function(R, T) {
        if (R) T = 2;
        E = T - 1, N()
      });
      N();

      function N() {
        E = Math.max(1, E);
        var R = [];
        for (var T = 0; T < E; ++T) R[T] = new Worker(w);
        var y = E;
        for (var T = 0; T < E; ++T) R[T].addEventListener("message", x);
        var v = !1;

        function x(p) {
          if (v) return;
          --y;
          var u = p.data;
          if (u.found) {
            for (var e = 0; e < R.length; ++e) R[e].terminate();
            return v = !0, H(null, new Q(u.prime, 16))
          }
          if (C.bitLength() > F) C = X(F, K);
          var l = C.toString(16);
          p.target.postMessage({
            hex: l,
            workLoad: U
          }), C.dAddOffset(q, 0)
        }
      }
    }

    function X(F, K) {
      var D = new Q(F, K),
        H = F - 1;
      if (!D.testBit(H)) D.bitwiseTo(Q.ONE.shiftLeft(H), Z, D);
      return D.dAddOffset(31 - D.mod(G).byteValue(), 0), D
    }

    function V(F) {
      if (F <= 100) return 27;
      if (F <= 150) return 18;
      if (F <= 200) return 15;
      if (F <= 250) return 12;
      if (F <= 300) return 9;
      if (F <= 350) return 8;
      if (F <= 400) return 7;
      if (F <= 500) return 6;
      if (F <= 600) return 5;
      if (F <= 800) return 4;
      if (F <= 1250) return 3;
      return 2
    }
  })()
})
// @from(Start 9234523, End 9261126)
nLA = z((JjG, o62) => {
  var P9 = B6();
  GP();
  iLA();
  Ii();
  yA0();
  vA0();
  cM();
  x3();
  if (typeof i5 > "u") i5 = P9.jsbn.BigInteger;
  var i5, bA0 = P9.util.isNodejs ? UA("crypto") : null,
    J0 = P9.asn1,
    lM = P9.util;
  P9.pki = P9.pki || {};
  o62.exports = P9.pki.rsa = P9.rsa = P9.rsa || {};
  var L8 = P9.pki,
    CZ5 = [6, 4, 2, 4, 2, 4, 6, 2],
    EZ5 = {
      name: "PrivateKeyInfo",
      tagClass: J0.Class.UNIVERSAL,
      type: J0.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "PrivateKeyInfo.version",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyVersion"
      }, {
        name: "PrivateKeyInfo.privateKeyAlgorithm",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "AlgorithmIdentifier.algorithm",
          tagClass: J0.Class.UNIVERSAL,
          type: J0.Type.OID,
          constructed: !1,
          capture: "privateKeyOid"
        }]
      }, {
        name: "PrivateKeyInfo",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.OCTETSTRING,
        constructed: !1,
        capture: "privateKey"
      }]
    },
    zZ5 = {
      name: "RSAPrivateKey",
      tagClass: J0.Class.UNIVERSAL,
      type: J0.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "RSAPrivateKey.version",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyVersion"
      }, {
        name: "RSAPrivateKey.modulus",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyModulus"
      }, {
        name: "RSAPrivateKey.publicExponent",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyPublicExponent"
      }, {
        name: "RSAPrivateKey.privateExponent",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyPrivateExponent"
      }, {
        name: "RSAPrivateKey.prime1",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyPrime1"
      }, {
        name: "RSAPrivateKey.prime2",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyPrime2"
      }, {
        name: "RSAPrivateKey.exponent1",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyExponent1"
      }, {
        name: "RSAPrivateKey.exponent2",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyExponent2"
      }, {
        name: "RSAPrivateKey.coefficient",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.INTEGER,
        constructed: !1,
        capture: "privateKeyCoefficient"
      }]
    },
    UZ5 = {
      name: "RSAPublicKey",
      tagClass: J0.Class.UNIVERSAL,
      type: J0.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "RSAPublicKey.modulus",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.INTEGER,
        constructed: !1,
        capture: "publicKeyModulus"
      }, {
        name: "RSAPublicKey.exponent",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.INTEGER,
        constructed: !1,
        capture: "publicKeyExponent"
      }]
    },
    $Z5 = P9.pki.rsa.publicKeyValidator = {
      name: "SubjectPublicKeyInfo",
      tagClass: J0.Class.UNIVERSAL,
      type: J0.Type.SEQUENCE,
      constructed: !0,
      captureAsn1: "subjectPublicKeyInfo",
      value: [{
        name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "AlgorithmIdentifier.algorithm",
          tagClass: J0.Class.UNIVERSAL,
          type: J0.Type.OID,
          constructed: !1,
          capture: "publicKeyOid"
        }]
      }, {
        name: "SubjectPublicKeyInfo.subjectPublicKey",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.BITSTRING,
        constructed: !1,
        value: [{
          name: "SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey",
          tagClass: J0.Class.UNIVERSAL,
          type: J0.Type.SEQUENCE,
          constructed: !0,
          optional: !0,
          captureAsn1: "rsaPublicKey"
        }]
      }]
    },
    wZ5 = {
      name: "DigestInfo",
      tagClass: J0.Class.UNIVERSAL,
      type: J0.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "DigestInfo.DigestAlgorithm",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "DigestInfo.DigestAlgorithm.algorithmIdentifier",
          tagClass: J0.Class.UNIVERSAL,
          type: J0.Type.OID,
          constructed: !1,
          capture: "algorithmIdentifier"
        }, {
          name: "DigestInfo.DigestAlgorithm.parameters",
          tagClass: J0.Class.UNIVERSAL,
          type: J0.Type.NULL,
          capture: "parameters",
          optional: !0,
          constructed: !1
        }]
      }, {
        name: "DigestInfo.digest",
        tagClass: J0.Class.UNIVERSAL,
        type: J0.Type.OCTETSTRING,
        constructed: !1,
        capture: "digest"
      }]
    },
    qZ5 = function(A) {
      var Q;
      if (A.algorithm in L8.oids) Q = L8.oids[A.algorithm];
      else {
        var B = Error("Unknown message digest algorithm.");
        throw B.algorithm = A.algorithm, B
      }
      var G = J0.oidToDer(Q).getBytes(),
        Z = J0.create(J0.Class.UNIVERSAL, J0.Type.SEQUENCE, !0, []),
        I = J0.create(J0.Class.UNIVERSAL, J0.Type.SEQUENCE, !0, []);
      I.value.push(J0.create(J0.Class.UNIVERSAL, J0.Type.OID, !1, G)), I.value.push(J0.create(J0.Class.UNIVERSAL, J0.Type.NULL, !1, ""));
      var Y = J0.create(J0.Class.UNIVERSAL, J0.Type.OCTETSTRING, !1, A.digest().getBytes());
      return Z.value.push(I), Z.value.push(Y), J0.toDer(Z).getBytes()
    },
    s62 = function(A, Q, B) {
      if (B) return A.modPow(Q.e, Q.n);
      if (!Q.p || !Q.q) return A.modPow(Q.d, Q.n);
      if (!Q.dP) Q.dP = Q.d.mod(Q.p.subtract(i5.ONE));
      if (!Q.dQ) Q.dQ = Q.d.mod(Q.q.subtract(i5.ONE));
      if (!Q.qInv) Q.qInv = Q.q.modInverse(Q.p);
      var G;
      do G = new i5(P9.util.bytesToHex(P9.random.getBytes(Q.n.bitLength() / 8)), 16); while (G.compareTo(Q.n) >= 0 || !G.gcd(Q.n).equals(i5.ONE));
      A = A.multiply(G.modPow(Q.e, Q.n)).mod(Q.n);
      var Z = A.mod(Q.p).modPow(Q.dP, Q.p),
        I = A.mod(Q.q).modPow(Q.dQ, Q.q);
      while (Z.compareTo(I) < 0) Z = Z.add(Q.p);
      var Y = Z.subtract(I).multiply(Q.qInv).mod(Q.p).multiply(Q.q).add(I);
      return Y = Y.multiply(G.modInverse(Q.n)).mod(Q.n), Y
    };
  L8.rsa.encrypt = function(A, Q, B) {
    var G = B,
      Z, I = Math.ceil(Q.n.bitLength() / 8);
    if (B !== !1 && B !== !0) G = B === 2, Z = r62(A, Q, B);
    else Z = P9.util.createBuffer(), Z.putBytes(A);
    var Y = new i5(Z.toHex(), 16),
      J = s62(Y, Q, G),
      W = J.toString(16),
      X = P9.util.createBuffer(),
      V = I - Math.ceil(W.length / 2);
    while (V > 0) X.putByte(0), --V;
    return X.putBytes(P9.util.hexToBytes(W)), X.getBytes()
  };
  L8.rsa.decrypt = function(A, Q, B, G) {
    var Z = Math.ceil(Q.n.bitLength() / 8);
    if (A.length !== Z) {
      var I = Error("Encrypted message length is invalid.");
      throw I.length = A.length, I.expected = Z, I
    }
    var Y = new i5(P9.util.createBuffer(A).toHex(), 16);
    if (Y.compareTo(Q.n) >= 0) throw Error("Encrypted message is invalid.");
    var J = s62(Y, Q, B),
      W = J.toString(16),
      X = P9.util.createBuffer(),
      V = Z - Math.ceil(W.length / 2);
    while (V > 0) X.putByte(0), --V;
    if (X.putBytes(P9.util.hexToBytes(W)), G !== !1) return sB1(X.getBytes(), Q, B);
    return X.getBytes()
  };
  L8.rsa.createKeyPairGenerationState = function(A, Q, B) {
    if (typeof A === "string") A = parseInt(A, 10);
    A = A || 2048, B = B || {};
    var G = B.prng || P9.random,
      Z = {
        nextBytes: function(J) {
          var W = G.getBytesSync(J.length);
          for (var X = 0; X < J.length; ++X) J[X] = W.charCodeAt(X)
        }
      },
      I = B.algorithm || "PRIMEINC",
      Y;
    if (I === "PRIMEINC") Y = {
      algorithm: I,
      state: 0,
      bits: A,
      rng: Z,
      eInt: Q || 65537,
      e: new i5(null),
      p: null,
      q: null,
      qBits: A >> 1,
      pBits: A - (A >> 1),
      pqState: 0,
      num: null,
      keys: null
    }, Y.e.fromInt(Y.eInt);
    else throw Error("Invalid key generation algorithm: " + I);
    return Y
  };
  L8.rsa.stepKeyPairGenerationState = function(A, Q) {
    if (!("algorithm" in A)) A.algorithm = "PRIMEINC";
    var B = new i5(null);
    B.fromInt(30);
    var G = 0,
      Z = function(F, K) {
        return F | K
      },
      I = +new Date,
      Y, J = 0;
    while (A.keys === null && (Q <= 0 || J < Q)) {
      if (A.state === 0) {
        var W = A.p === null ? A.pBits : A.qBits,
          X = W - 1;
        if (A.pqState === 0) {
          if (A.num = new i5(W, A.rng), !A.num.testBit(X)) A.num.bitwiseTo(i5.ONE.shiftLeft(X), Z, A.num);
          A.num.dAddOffset(31 - A.num.mod(B).byteValue(), 0), G = 0, ++A.pqState
        } else if (A.pqState === 1)
          if (A.num.bitLength() > W) A.pqState = 0;
          else if (A.num.isProbablePrime(LZ5(A.num.bitLength()))) ++A.pqState;
        else A.num.dAddOffset(CZ5[G++ % 8], 0);
        else if (A.pqState === 2) A.pqState = A.num.subtract(i5.ONE).gcd(A.e).compareTo(i5.ONE) === 0 ? 3 : 0;
        else if (A.pqState === 3) {
          if (A.pqState = 0, A.p === null) A.p = A.num;
          else A.q = A.num;
          if (A.p !== null && A.q !== null) ++A.state;
          A.num = null
        }
      } else if (A.state === 1) {
        if (A.p.compareTo(A.q) < 0) A.num = A.p, A.p = A.q, A.q = A.num;
        ++A.state
      } else if (A.state === 2) A.p1 = A.p.subtract(i5.ONE), A.q1 = A.q.subtract(i5.ONE), A.phi = A.p1.multiply(A.q1), ++A.state;
      else if (A.state === 3)
        if (A.phi.gcd(A.e).compareTo(i5.ONE) === 0) ++A.state;
        else A.p = null, A.q = null, A.state = 0;
      else if (A.state === 4)
        if (A.n = A.p.multiply(A.q), A.n.bitLength() === A.bits) ++A.state;
        else A.q = null, A.state = 0;
      else if (A.state === 5) {
        var V = A.e.modInverse(A.phi);
        A.keys = {
          privateKey: L8.rsa.setPrivateKey(A.n, A.e, V, A.p, A.q, V.mod(A.p1), V.mod(A.q1), A.q.modInverse(A.p)),
          publicKey: L8.rsa.setPublicKey(A.n, A.e)
        }
      }
      Y = +new Date, J += Y - I, I = Y
    }
    return A.keys !== null
  };
  L8.rsa.generateKeyPair = function(A, Q, B, G) {
    if (arguments.length === 1) {
      if (typeof A === "object") B = A, A = void 0;
      else if (typeof A === "function") G = A, A = void 0
    } else if (arguments.length === 2)
      if (typeof A === "number") {
        if (typeof Q === "function") G = Q, Q = void 0;
        else if (typeof Q !== "number") B = Q, Q = void 0
      } else B = A, G = Q, A = void 0, Q = void 0;
    else if (arguments.length === 3)
      if (typeof Q === "number") {
        if (typeof B === "function") G = B, B = void 0
      } else G = B, B = Q, Q = void 0;
    if (B = B || {}, A === void 0) A = B.bits || 2048;
    if (Q === void 0) Q = B.e || 65537;
    if (!P9.options.usePureJavaScript && !B.prng && A >= 256 && A <= 16384 && (Q === 65537 || Q === 3)) {
      if (G) {
        if (l62("generateKeyPair")) return bA0.generateKeyPair("rsa", {
          modulusLength: A,
          publicExponent: Q,
          publicKeyEncoding: {
            type: "spki",
            format: "pem"
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem"
          }
        }, function(J, W, X) {
          if (J) return G(J);
          G(null, {
            privateKey: L8.privateKeyFromPem(X),
            publicKey: L8.publicKeyFromPem(W)
          })
        });
        if (i62("generateKey") && i62("exportKey")) return lM.globalScope.crypto.subtle.generateKey({
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: A,
          publicExponent: a62(Q),
          hash: {
            name: "SHA-256"
          }
        }, !0, ["sign", "verify"]).then(function(J) {
          return lM.globalScope.crypto.subtle.exportKey("pkcs8", J.privateKey)
        }).then(void 0, function(J) {
          G(J)
        }).then(function(J) {
          if (J) {
            var W = L8.privateKeyFromAsn1(J0.fromDer(P9.util.createBuffer(J)));
            G(null, {
              privateKey: W,
              publicKey: L8.setRsaPublicKey(W.n, W.e)
            })
          }
        });
        if (n62("generateKey") && n62("exportKey")) {
          var Z = lM.globalScope.msCrypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: A,
            publicExponent: a62(Q),
            hash: {
              name: "SHA-256"
            }
          }, !0, ["sign", "verify"]);
          Z.oncomplete = function(J) {
            var W = J.target.result,
              X = lM.globalScope.msCrypto.subtle.exportKey("pkcs8", W.privateKey);
            X.oncomplete = function(V) {
              var F = V.target.result,
                K = L8.privateKeyFromAsn1(J0.fromDer(P9.util.createBuffer(F)));
              G(null, {
                privateKey: K,
                publicKey: L8.setRsaPublicKey(K.n, K.e)
              })
            }, X.onerror = function(V) {
              G(V)
            }
          }, Z.onerror = function(J) {
            G(J)
          };
          return
        }
      } else if (l62("generateKeyPairSync")) {
        var I = bA0.generateKeyPairSync("rsa", {
          modulusLength: A,
          publicExponent: Q,
          publicKeyEncoding: {
            type: "spki",
            format: "pem"
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem"
          }
        });
        return {
          privateKey: L8.privateKeyFromPem(I.privateKey),
          publicKey: L8.publicKeyFromPem(I.publicKey)
        }
      }
    }
    var Y = L8.rsa.createKeyPairGenerationState(A, Q, B);
    if (!G) return L8.rsa.stepKeyPairGenerationState(Y, 0), Y.keys;
    NZ5(Y, B, G)
  };
  L8.setRsaPublicKey = L8.rsa.setPublicKey = function(A, Q) {
    var B = {
      n: A,
      e: Q
    };
    return B.encrypt = function(G, Z, I) {
      if (typeof Z === "string") Z = Z.toUpperCase();
      else if (Z === void 0) Z = "RSAES-PKCS1-V1_5";
      if (Z === "RSAES-PKCS1-V1_5") Z = {
        encode: function(J, W, X) {
          return r62(J, W, 2).getBytes()
        }
      };
      else if (Z === "RSA-OAEP" || Z === "RSAES-OAEP") Z = {
        encode: function(J, W) {
          return P9.pkcs1.encode_rsa_oaep(W, J, I)
        }
      };
      else if (["RAW", "NONE", "NULL", null].indexOf(Z) !== -1) Z = {
        encode: function(J) {
          return J
        }
      };
      else if (typeof Z === "string") throw Error('Unsupported encryption scheme: "' + Z + '".');
      var Y = Z.encode(G, B, !0);
      return L8.rsa.encrypt(Y, B, !0)
    }, B.verify = function(G, Z, I, Y) {
      if (typeof I === "string") I = I.toUpperCase();
      else if (I === void 0) I = "RSASSA-PKCS1-V1_5";
      if (Y === void 0) Y = {
        _parseAllDigestBytes: !0
      };
      if (!("_parseAllDigestBytes" in Y)) Y._parseAllDigestBytes = !0;
      if (I === "RSASSA-PKCS1-V1_5") I = {
        verify: function(W, X) {
          X = sB1(X, B, !0);
          var V = J0.fromDer(X, {
              parseAllBytes: Y._parseAllDigestBytes
            }),
            F = {},
            K = [];
          if (!J0.validate(V, wZ5, F, K)) {
            var D = Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value.");
            throw D.errors = K, D
          }
          var H = J0.derToOid(F.algorithmIdentifier);
          if (!(H === P9.oids.md2 || H === P9.oids.md5 || H === P9.oids.sha1 || H === P9.oids.sha224 || H === P9.oids.sha256 || H === P9.oids.sha384 || H === P9.oids.sha512 || H === P9.oids["sha512-224"] || H === P9.oids["sha512-256"])) {
            var D = Error("Unknown RSASSA-PKCS1-v1_5 DigestAlgorithm identifier.");
            throw D.oid = H, D
          }
          if (H === P9.oids.md2 || H === P9.oids.md5) {
            if (!("parameters" in F)) throw Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value. Missing algorithm identifer NULL parameters.")
          }
          return W === F.digest
        }
      };
      else if (I === "NONE" || I === "NULL" || I === null) I = {
        verify: function(W, X) {
          return X = sB1(X, B, !0), W === X
        }
      };
      var J = L8.rsa.decrypt(Z, B, !0, !1);
      return I.verify(G, J, B.n.bitLength())
    }, B
  };
  L8.setRsaPrivateKey = L8.rsa.setPrivateKey = function(A, Q, B, G, Z, I, Y, J) {
    var W = {
      n: A,
      e: Q,
      d: B,
      p: G,
      q: Z,
      dP: I,
      dQ: Y,
      qInv: J
    };
    return W.decrypt = function(X, V, F) {
      if (typeof V === "string") V = V.toUpperCase();
      else if (V === void 0) V = "RSAES-PKCS1-V1_5";
      var K = L8.rsa.decrypt(X, W, !1, !1);
      if (V === "RSAES-PKCS1-V1_5") V = {
        decode: sB1
      };
      else if (V === "RSA-OAEP" || V === "RSAES-OAEP") V = {
        decode: function(D, H) {
          return P9.pkcs1.decode_rsa_oaep(H, D, F)
        }
      };
      else if (["RAW", "NONE", "NULL", null].indexOf(V) !== -1) V = {
        decode: function(D) {
          return D
        }
      };
      else throw Error('Unsupported encryption scheme: "' + V + '".');
      return V.decode(K, W, !1)
    }, W.sign = function(X, V) {
      var F = !1;
      if (typeof V === "string") V = V.toUpperCase();
      if (V === void 0 || V === "RSASSA-PKCS1-V1_5") V = {
        encode: qZ5
      }, F = 1;
      else if (V === "NONE" || V === "NULL" || V === null) V = {
        encode: function() {
          return X
        }
      }, F = 1;
      var K = V.encode(X, W.n.bitLength());
      return L8.rsa.encrypt(K, W, F)
    }, W
  };
  L8.wrapRsaPrivateKey = function(A) {
    return J0.create(J0.Class.UNIVERSAL, J0.Type.SEQUENCE, !0, [J0.create(J0.Class.UNIVERSAL, J0.Type.INTEGER, !1, J0.integerToDer(0).getBytes()), J0.create(J0.Class.UNIVERSAL, J0.Type.SEQUENCE, !0, [J0.create(J0.Class.UNIVERSAL, J0.Type.OID, !1, J0.oidToDer(L8.oids.rsaEncryption).getBytes()), J0.create(J0.Class.UNIVERSAL, J0.Type.NULL, !1, "")]), J0.create(J0.Class.UNIVERSAL, J0.Type.OCTETSTRING, !1, J0.toDer(A).getBytes())])
  };
  L8.privateKeyFromAsn1 = function(A) {
    var Q = {},
      B = [];
    if (J0.validate(A, EZ5, Q, B)) A = J0.fromDer(P9.util.createBuffer(Q.privateKey));
    if (Q = {}, B = [], !J0.validate(A, zZ5, Q, B)) {
      var G = Error("Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.");
      throw G.errors = B, G
    }
    var Z, I, Y, J, W, X, V, F;
    return Z = P9.util.createBuffer(Q.privateKeyModulus).toHex(), I = P9.util.createBuffer(Q.privateKeyPublicExponent).toHex(), Y = P9.util.createBuffer(Q.privateKeyPrivateExponent).toHex(), J = P9.util.createBuffer(Q.privateKeyPrime1).toHex(), W = P9.util.createBuffer(Q.privateKeyPrime2).toHex(), X = P9.util.createBuffer(Q.privateKeyExponent1).toHex(), V = P9.util.createBuffer(Q.privateKeyExponent2).toHex(), F = P9.util.createBuffer(Q.privateKeyCoefficient).toHex(), L8.setRsaPrivateKey(new i5(Z, 16), new i5(I, 16), new i5(Y, 16), new i5(J, 16), new i5(W, 16), new i5(X, 16), new i5(V, 16), new i5(F, 16))
  };
  L8.privateKeyToAsn1 = L8.privateKeyToRSAPrivateKey = function(A) {
    return J0.create(J0.Class.UNIVERSAL, J0.Type.SEQUENCE, !0, [J0.create(J0.Class.UNIVERSAL, J0.Type.INTEGER, !1, J0.integerToDer(0).getBytes()), J0.create(J0.Class.UNIVERSAL, J0.Type.INTEGER, !1, vk(A.n)), J0.create(J0.Class.UNIVERSAL, J0.Type.INTEGER, !1, vk(A.e)), J0.create(J0.Class.UNIVERSAL, J0.Type.INTEGER, !1, vk(A.d)), J0.create(J0.Class.UNIVERSAL, J0.Type.INTEGER, !1, vk(A.p)), J0.create(J0.Class.UNIVERSAL, J0.Type.INTEGER, !1, vk(A.q)), J0.create(J0.Class.UNIVERSAL, J0.Type.INTEGER, !1, vk(A.dP)), J0.create(J0.Class.UNIVERSAL, J0.Type.INTEGER, !1, vk(A.dQ)), J0.create(J0.Class.UNIVERSAL, J0.Type.INTEGER, !1, vk(A.qInv))])
  };
  L8.publicKeyFromAsn1 = function(A) {
    var Q = {},
      B = [];
    if (J0.validate(A, $Z5, Q, B)) {
      var G = J0.derToOid(Q.publicKeyOid);
      if (G !== L8.oids.rsaEncryption) {
        var Z = Error("Cannot read public key. Unknown OID.");
        throw Z.oid = G, Z
      }
      A = Q.rsaPublicKey
    }
    if (B = [], !J0.validate(A, UZ5, Q, B)) {
      var Z = Error("Cannot read public key. ASN.1 object does not contain an RSAPublicKey.");
      throw Z.errors = B, Z
    }
    var I = P9.util.createBuffer(Q.publicKeyModulus).toHex(),
      Y = P9.util.createBuffer(Q.publicKeyExponent).toHex();
    return L8.setRsaPublicKey(new i5(I, 16), new i5(Y, 16))
  };
  L8.publicKeyToAsn1 = L8.publicKeyToSubjectPublicKeyInfo = function(A) {
    return J0.create(J0.Class.UNIVERSAL, J0.Type.SEQUENCE, !0, [J0.create(J0.Class.UNIVERSAL, J0.Type.SEQUENCE, !0, [J0.create(J0.Class.UNIVERSAL, J0.Type.OID, !1, J0.oidToDer(L8.oids.rsaEncryption).getBytes()), J0.create(J0.Class.UNIVERSAL, J0.Type.NULL, !1, "")]), J0.create(J0.Class.UNIVERSAL, J0.Type.BITSTRING, !1, [L8.publicKeyToRSAPublicKey(A)])])
  };
  L8.publicKeyToRSAPublicKey = function(A) {
    return J0.create(J0.Class.UNIVERSAL, J0.Type.SEQUENCE, !0, [J0.create(J0.Class.UNIVERSAL, J0.Type.INTEGER, !1, vk(A.n)), J0.create(J0.Class.UNIVERSAL, J0.Type.INTEGER, !1, vk(A.e))])
  };

  function r62(A, Q, B) {
    var G = P9.util.createBuffer(),
      Z = Math.ceil(Q.n.bitLength() / 8);
    if (A.length > Z - 11) {
      var I = Error("Message is too long for PKCS#1 v1.5 padding.");
      throw I.length = A.length, I.max = Z - 11, I
    }
    G.putByte(0), G.putByte(B);
    var Y = Z - 3 - A.length,
      J;
    if (B === 0 || B === 1) {
      J = B === 0 ? 0 : 255;
      for (var W = 0; W < Y; ++W) G.putByte(J)
    } else
      while (Y > 0) {
        var X = 0,
          V = P9.random.getBytes(Y);
        for (var W = 0; W < Y; ++W)
          if (J = V.charCodeAt(W), J === 0) ++X;
          else G.putByte(J);
        Y = X
      }
    return G.putByte(0), G.putBytes(A), G
  }

  function sB1(A, Q, B, G) {
    var Z = Math.ceil(Q.n.bitLength() / 8),
      I = P9.util.createBuffer(A),
      Y = I.getByte(),
      J = I.getByte();
    if (Y !== 0 || B && J !== 0 && J !== 1 || !B && J != 2 || B && J === 0 && typeof G > "u") throw Error("Encryption block is invalid.");
    var W = 0;
    if (J === 0) {
      W = Z - 3 - G;
      for (var X = 0; X < W; ++X)
        if (I.getByte() !== 0) throw Error("Encryption block is invalid.")
    } else if (J === 1) {
      W = 0;
      while (I.length() > 1) {
        if (I.getByte() !== 255) {
          --I.read;
          break
        }++W
      }
    } else if (J === 2) {
      W = 0;
      while (I.length() > 1) {
        if (I.getByte() === 0) {
          --I.read;
          break
        }++W
      }
    }
    var V = I.getByte();
    if (V !== 0 || W !== Z - 3 - I.length()) throw Error("Encryption block is invalid.");
    return I.getBytes()
  }

  function NZ5(A, Q, B) {
    if (typeof Q === "function") B = Q, Q = {};
    Q = Q || {};
    var G = {
      algorithm: {
        name: Q.algorithm || "PRIMEINC",
        options: {
          workers: Q.workers || 2,
          workLoad: Q.workLoad || 100,
          workerScript: Q.workerScript
        }
      }
    };
    if ("prng" in Q) G.prng = Q.prng;
    Z();

    function Z() {
      I(A.pBits, function(J, W) {
        if (J) return B(J);
        if (A.p = W, A.q !== null) return Y(J, A.q);
        I(A.qBits, Y)
      })
    }

    function I(J, W) {
      P9.prime.generateProbablePrime(J, G, W)
    }

    function Y(J, W) {
      if (J) return B(J);
      if (A.q = W, A.p.compareTo(A.q) < 0) {
        var X = A.p;
        A.p = A.q, A.q = X
      }
      if (A.p.subtract(i5.ONE).gcd(A.e).compareTo(i5.ONE) !== 0) {
        A.p = null, Z();
        return
      }
      if (A.q.subtract(i5.ONE).gcd(A.e).compareTo(i5.ONE) !== 0) {
        A.q = null, I(A.qBits, Y);
        return
      }
      if (A.p1 = A.p.subtract(i5.ONE), A.q1 = A.q.subtract(i5.ONE), A.phi = A.p1.multiply(A.q1), A.phi.gcd(A.e).compareTo(i5.ONE) !== 0) {
        A.p = A.q = null, Z();
        return
      }
      if (A.n = A.p.multiply(A.q), A.n.bitLength() !== A.bits) {
        A.q = null, I(A.qBits, Y);
        return
      }
      var V = A.e.modInverse(A.phi);
      A.keys = {
        privateKey: L8.rsa.setPrivateKey(A.n, A.e, V, A.p, A.q, V.mod(A.p1), V.mod(A.q1), A.q.modInverse(A.p)),
        publicKey: L8.rsa.setPublicKey(A.n, A.e)
      }, B(null, A.keys)
    }
  }

  function vk(A) {
    var Q = A.toString(16);
    if (Q[0] >= "8") Q = "00" + Q;
    var B = P9.util.hexToBytes(Q);
    if (B.length > 1 && (B.charCodeAt(0) === 0 && (B.charCodeAt(1) & 128) === 0 || B.charCodeAt(0) === 255 && (B.charCodeAt(1) & 128) === 128)) return B.substr(1);
    return B
  }

  function LZ5(A) {
    if (A <= 100) return 27;
    if (A <= 150) return 18;
    if (A <= 200) return 15;
    if (A <= 250) return 12;
    if (A <= 300) return 9;
    if (A <= 350) return 8;
    if (A <= 400) return 7;
    if (A <= 500) return 6;
    if (A <= 600) return 5;
    if (A <= 800) return 4;
    if (A <= 1250) return 3;
    return 2
  }

  function l62(A) {
    return P9.util.isNodejs && typeof bA0[A] === "function"
  }

  function i62(A) {
    return typeof lM.globalScope < "u" && typeof lM.globalScope.crypto === "object" && typeof lM.globalScope.crypto.subtle === "object" && typeof lM.globalScope.crypto.subtle[A] === "function"
  }

  function n62(A) {
    return typeof lM.globalScope < "u" && typeof lM.globalScope.msCrypto === "object" && typeof lM.globalScope.msCrypto.subtle === "object" && typeof lM.globalScope.msCrypto.subtle[A] === "function"
  }

  function a62(A) {
    var Q = P9.util.hexToBytes(A.toString(16)),
      B = new Uint8Array(Q.length);
    for (var G = 0; G < Q.length; ++G) B[G] = Q.charCodeAt(G);
    return B
  }
})
// @from(Start 9261132, End 9279767)
hA0 = z((WjG, Q52) => {
  var uB = B6();
  Zi();
  GP();
  pLA();
  Pk();
  Ii();
  pB1();
  B1A();
  cM();
  PA0();
  nLA();
  x3();
  if (typeof fA0 > "u") fA0 = uB.jsbn.BigInteger;
  var fA0, x0 = uB.asn1,
    a8 = uB.pki = uB.pki || {};
  Q52.exports = a8.pbe = uB.pbe = uB.pbe || {};
  var I1A = a8.oids,
    MZ5 = {
      name: "EncryptedPrivateKeyInfo",
      tagClass: x0.Class.UNIVERSAL,
      type: x0.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "EncryptedPrivateKeyInfo.encryptionAlgorithm",
        tagClass: x0.Class.UNIVERSAL,
        type: x0.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "AlgorithmIdentifier.algorithm",
          tagClass: x0.Class.UNIVERSAL,
          type: x0.Type.OID,
          constructed: !1,
          capture: "encryptionOid"
        }, {
          name: "AlgorithmIdentifier.parameters",
          tagClass: x0.Class.UNIVERSAL,
          type: x0.Type.SEQUENCE,
          constructed: !0,
          captureAsn1: "encryptionParams"
        }]
      }, {
        name: "EncryptedPrivateKeyInfo.encryptedData",
        tagClass: x0.Class.UNIVERSAL,
        type: x0.Type.OCTETSTRING,
        constructed: !1,
        capture: "encryptedData"
      }]
    },
    OZ5 = {
      name: "PBES2Algorithms",
      tagClass: x0.Class.UNIVERSAL,
      type: x0.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "PBES2Algorithms.keyDerivationFunc",
        tagClass: x0.Class.UNIVERSAL,
        type: x0.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "PBES2Algorithms.keyDerivationFunc.oid",
          tagClass: x0.Class.UNIVERSAL,
          type: x0.Type.OID,
          constructed: !1,
          capture: "kdfOid"
        }, {
          name: "PBES2Algorithms.params",
          tagClass: x0.Class.UNIVERSAL,
          type: x0.Type.SEQUENCE,
          constructed: !0,
          value: [{
            name: "PBES2Algorithms.params.salt",
            tagClass: x0.Class.UNIVERSAL,
            type: x0.Type.OCTETSTRING,
            constructed: !1,
            capture: "kdfSalt"
          }, {
            name: "PBES2Algorithms.params.iterationCount",
            tagClass: x0.Class.UNIVERSAL,
            type: x0.Type.INTEGER,
            constructed: !1,
            capture: "kdfIterationCount"
          }, {
            name: "PBES2Algorithms.params.keyLength",
            tagClass: x0.Class.UNIVERSAL,
            type: x0.Type.INTEGER,
            constructed: !1,
            optional: !0,
            capture: "keyLength"
          }, {
            name: "PBES2Algorithms.params.prf",
            tagClass: x0.Class.UNIVERSAL,
            type: x0.Type.SEQUENCE,
            constructed: !0,
            optional: !0,
            value: [{
              name: "PBES2Algorithms.params.prf.algorithm",
              tagClass: x0.Class.UNIVERSAL,
              type: x0.Type.OID,
              constructed: !1,
              capture: "prfOid"
            }]
          }]
        }]
      }, {
        name: "PBES2Algorithms.encryptionScheme",
        tagClass: x0.Class.UNIVERSAL,
        type: x0.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "PBES2Algorithms.encryptionScheme.oid",
          tagClass: x0.Class.UNIVERSAL,
          type: x0.Type.OID,
          constructed: !1,
          capture: "encOid"
        }, {
          name: "PBES2Algorithms.encryptionScheme.iv",
          tagClass: x0.Class.UNIVERSAL,
          type: x0.Type.OCTETSTRING,
          constructed: !1,
          capture: "encIv"
        }]
      }]
    },
    RZ5 = {
      name: "pkcs-12PbeParams",
      tagClass: x0.Class.UNIVERSAL,
      type: x0.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "pkcs-12PbeParams.salt",
        tagClass: x0.Class.UNIVERSAL,
        type: x0.Type.OCTETSTRING,
        constructed: !1,
        capture: "salt"
      }, {
        name: "pkcs-12PbeParams.iterations",
        tagClass: x0.Class.UNIVERSAL,
        type: x0.Type.INTEGER,
        constructed: !1,
        capture: "iterations"
      }]
    };
  a8.encryptPrivateKeyInfo = function(A, Q, B) {
    B = B || {}, B.saltSize = B.saltSize || 8, B.count = B.count || 2048, B.algorithm = B.algorithm || "aes128", B.prfAlgorithm = B.prfAlgorithm || "sha1";
    var G = uB.random.getBytesSync(B.saltSize),
      Z = B.count,
      I = x0.integerToDer(Z),
      Y, J, W;
    if (B.algorithm.indexOf("aes") === 0 || B.algorithm === "des") {
      var X, V, F;
      switch (B.algorithm) {
        case "aes128":
          Y = 16, X = 16, V = I1A["aes128-CBC"], F = uB.aes.createEncryptionCipher;
          break;
        case "aes192":
          Y = 24, X = 16, V = I1A["aes192-CBC"], F = uB.aes.createEncryptionCipher;
          break;
        case "aes256":
          Y = 32, X = 16, V = I1A["aes256-CBC"], F = uB.aes.createEncryptionCipher;
          break;
        case "des":
          Y = 8, X = 8, V = I1A.desCBC, F = uB.des.createEncryptionCipher;
          break;
        default:
          var K = Error("Cannot encrypt private key. Unknown encryption algorithm.");
          throw K.algorithm = B.algorithm, K
      }
      var D = "hmacWith" + B.prfAlgorithm.toUpperCase(),
        H = A52(D),
        C = uB.pkcs5.pbkdf2(Q, G, Z, Y, H),
        E = uB.random.getBytesSync(X),
        U = F(C);
      U.start(E), U.update(x0.toDer(A)), U.finish(), W = U.output.getBytes();
      var q = TZ5(G, I, Y, D);
      J = x0.create(x0.Class.UNIVERSAL, x0.Type.SEQUENCE, !0, [x0.create(x0.Class.UNIVERSAL, x0.Type.OID, !1, x0.oidToDer(I1A.pkcs5PBES2).getBytes()), x0.create(x0.Class.UNIVERSAL, x0.Type.SEQUENCE, !0, [x0.create(x0.Class.UNIVERSAL, x0.Type.SEQUENCE, !0, [x0.create(x0.Class.UNIVERSAL, x0.Type.OID, !1, x0.oidToDer(I1A.pkcs5PBKDF2).getBytes()), q]), x0.create(x0.Class.UNIVERSAL, x0.Type.SEQUENCE, !0, [x0.create(x0.Class.UNIVERSAL, x0.Type.OID, !1, x0.oidToDer(V).getBytes()), x0.create(x0.Class.UNIVERSAL, x0.Type.OCTETSTRING, !1, E)])])])
    } else if (B.algorithm === "3des") {
      Y = 24;
      var w = new uB.util.ByteBuffer(G),
        C = a8.pbe.generatePkcs12Key(Q, w, 1, Z, Y),
        E = a8.pbe.generatePkcs12Key(Q, w, 2, Z, Y),
        U = uB.des.createEncryptionCipher(C);
      U.start(E), U.update(x0.toDer(A)), U.finish(), W = U.output.getBytes(), J = x0.create(x0.Class.UNIVERSAL, x0.Type.SEQUENCE, !0, [x0.create(x0.Class.UNIVERSAL, x0.Type.OID, !1, x0.oidToDer(I1A["pbeWithSHAAnd3-KeyTripleDES-CBC"]).getBytes()), x0.create(x0.Class.UNIVERSAL, x0.Type.SEQUENCE, !0, [x0.create(x0.Class.UNIVERSAL, x0.Type.OCTETSTRING, !1, G), x0.create(x0.Class.UNIVERSAL, x0.Type.INTEGER, !1, I.getBytes())])])
    } else {
      var K = Error("Cannot encrypt private key. Unknown encryption algorithm.");
      throw K.algorithm = B.algorithm, K
    }
    var N = x0.create(x0.Class.UNIVERSAL, x0.Type.SEQUENCE, !0, [J, x0.create(x0.Class.UNIVERSAL, x0.Type.OCTETSTRING, !1, W)]);
    return N
  };
  a8.decryptPrivateKeyInfo = function(A, Q) {
    var B = null,
      G = {},
      Z = [];
    if (!x0.validate(A, MZ5, G, Z)) {
      var I = Error("Cannot read encrypted private key. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
      throw I.errors = Z, I
    }
    var Y = x0.derToOid(G.encryptionOid),
      J = a8.pbe.getCipher(Y, G.encryptionParams, Q),
      W = uB.util.createBuffer(G.encryptedData);
    if (J.update(W), J.finish()) B = x0.fromDer(J.output);
    return B
  };
  a8.encryptedPrivateKeyToPem = function(A, Q) {
    var B = {
      type: "ENCRYPTED PRIVATE KEY",
      body: x0.toDer(A).getBytes()
    };
    return uB.pem.encode(B, {
      maxline: Q
    })
  };
  a8.encryptedPrivateKeyFromPem = function(A) {
    var Q = uB.pem.decode(A)[0];
    if (Q.type !== "ENCRYPTED PRIVATE KEY") {
      var B = Error('Could not convert encrypted private key from PEM; PEM header type is "ENCRYPTED PRIVATE KEY".');
      throw B.headerType = Q.type, B
    }
    if (Q.procType && Q.procType.type === "ENCRYPTED") throw Error("Could not convert encrypted private key from PEM; PEM is encrypted.");
    return x0.fromDer(Q.body)
  };
  a8.encryptRsaPrivateKey = function(A, Q, B) {
    if (B = B || {}, !B.legacy) {
      var G = a8.wrapRsaPrivateKey(a8.privateKeyToAsn1(A));
      return G = a8.encryptPrivateKeyInfo(G, Q, B), a8.encryptedPrivateKeyToPem(G)
    }
    var Z, I, Y, J;
    switch (B.algorithm) {
      case "aes128":
        Z = "AES-128-CBC", Y = 16, I = uB.random.getBytesSync(16), J = uB.aes.createEncryptionCipher;
        break;
      case "aes192":
        Z = "AES-192-CBC", Y = 24, I = uB.random.getBytesSync(16), J = uB.aes.createEncryptionCipher;
        break;
      case "aes256":
        Z = "AES-256-CBC", Y = 32, I = uB.random.getBytesSync(16), J = uB.aes.createEncryptionCipher;
        break;
      case "3des":
        Z = "DES-EDE3-CBC", Y = 24, I = uB.random.getBytesSync(8), J = uB.des.createEncryptionCipher;
        break;
      case "des":
        Z = "DES-CBC", Y = 8, I = uB.random.getBytesSync(8), J = uB.des.createEncryptionCipher;
        break;
      default:
        var W = Error('Could not encrypt RSA private key; unsupported encryption algorithm "' + B.algorithm + '".');
        throw W.algorithm = B.algorithm, W
    }
    var X = uB.pbe.opensslDeriveBytes(Q, I.substr(0, 8), Y),
      V = J(X);
    V.start(I), V.update(x0.toDer(a8.privateKeyToAsn1(A))), V.finish();
    var F = {
      type: "RSA PRIVATE KEY",
      procType: {
        version: "4",
        type: "ENCRYPTED"
      },
      dekInfo: {
        algorithm: Z,
        parameters: uB.util.bytesToHex(I).toUpperCase()
      },
      body: V.output.getBytes()
    };
    return uB.pem.encode(F)
  };
  a8.decryptRsaPrivateKey = function(A, Q) {
    var B = null,
      G = uB.pem.decode(A)[0];
    if (G.type !== "ENCRYPTED PRIVATE KEY" && G.type !== "PRIVATE KEY" && G.type !== "RSA PRIVATE KEY") {
      var Z = Error('Could not convert private key from PEM; PEM header type is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".');
      throw Z.headerType = Z, Z
    }
    if (G.procType && G.procType.type === "ENCRYPTED") {
      var I, Y;
      switch (G.dekInfo.algorithm) {
        case "DES-CBC":
          I = 8, Y = uB.des.createDecryptionCipher;
          break;
        case "DES-EDE3-CBC":
          I = 24, Y = uB.des.createDecryptionCipher;
          break;
        case "AES-128-CBC":
          I = 16, Y = uB.aes.createDecryptionCipher;
          break;
        case "AES-192-CBC":
          I = 24, Y = uB.aes.createDecryptionCipher;
          break;
        case "AES-256-CBC":
          I = 32, Y = uB.aes.createDecryptionCipher;
          break;
        case "RC2-40-CBC":
          I = 5, Y = function(F) {
            return uB.rc2.createDecryptionCipher(F, 40)
          };
          break;
        case "RC2-64-CBC":
          I = 8, Y = function(F) {
            return uB.rc2.createDecryptionCipher(F, 64)
          };
          break;
        case "RC2-128-CBC":
          I = 16, Y = function(F) {
            return uB.rc2.createDecryptionCipher(F, 128)
          };
          break;
        default:
          var Z = Error('Could not decrypt private key; unsupported encryption algorithm "' + G.dekInfo.algorithm + '".');
          throw Z.algorithm = G.dekInfo.algorithm, Z
      }
      var J = uB.util.hexToBytes(G.dekInfo.parameters),
        W = uB.pbe.opensslDeriveBytes(Q, J.substr(0, 8), I),
        X = Y(W);
      if (X.start(J), X.update(uB.util.createBuffer(G.body)), X.finish()) B = X.output.getBytes();
      else return B
    } else B = G.body;
    if (G.type === "ENCRYPTED PRIVATE KEY") B = a8.decryptPrivateKeyInfo(x0.fromDer(B), Q);
    else B = x0.fromDer(B);
    if (B !== null) B = a8.privateKeyFromAsn1(B);
    return B
  };
  a8.pbe.generatePkcs12Key = function(A, Q, B, G, Z, I) {
    var Y, J;
    if (typeof I > "u" || I === null) {
      if (!("sha1" in uB.md)) throw Error('"sha1" hash algorithm unavailable.');
      I = uB.md.sha1.create()
    }
    var {
      digestLength: W,
      blockLength: X
    } = I, V = new uB.util.ByteBuffer, F = new uB.util.ByteBuffer;
    if (A !== null && A !== void 0) {
      for (J = 0; J < A.length; J++) F.putInt16(A.charCodeAt(J));
      F.putInt16(0)
    }
    var K = F.length(),
      D = Q.length(),
      H = new uB.util.ByteBuffer;
    H.fillWithByte(B, X);
    var C = X * Math.ceil(D / X),
      E = new uB.util.ByteBuffer;
    for (J = 0; J < C; J++) E.putByte(Q.at(J % D));
    var U = X * Math.ceil(K / X),
      q = new uB.util.ByteBuffer;
    for (J = 0; J < U; J++) q.putByte(F.at(J % K));
    var w = E;
    w.putBuffer(q);
    var N = Math.ceil(Z / W);
    for (var R = 1; R <= N; R++) {
      var T = new uB.util.ByteBuffer;
      T.putBytes(H.bytes()), T.putBytes(w.bytes());
      for (var y = 0; y < G; y++) I.start(), I.update(T.getBytes()), T = I.digest();
      var v = new uB.util.ByteBuffer;
      for (J = 0; J < X; J++) v.putByte(T.at(J % W));
      var x = Math.ceil(D / X) + Math.ceil(K / X),
        p = new uB.util.ByteBuffer;
      for (Y = 0; Y < x; Y++) {
        var u = new uB.util.ByteBuffer(w.getBytes(X)),
          e = 511;
        for (J = v.length() - 1; J >= 0; J--) e = e >> 8, e += v.at(J) + u.at(J), u.setAt(J, e & 255);
        p.putBuffer(u)
      }
      w = p, V.putBuffer(T)
    }
    return V.truncate(V.length() - Z), V
  };
  a8.pbe.getCipher = function(A, Q, B) {
    switch (A) {
      case a8.oids.pkcs5PBES2:
        return a8.pbe.getCipherForPBES2(A, Q, B);
      case a8.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
      case a8.oids["pbewithSHAAnd40BitRC2-CBC"]:
        return a8.pbe.getCipherForPKCS12PBE(A, Q, B);
      default:
        var G = Error("Cannot read encrypted PBE data block. Unsupported OID.");
        throw G.oid = A, G.supportedOids = ["pkcs5PBES2", "pbeWithSHAAnd3-KeyTripleDES-CBC", "pbewithSHAAnd40BitRC2-CBC"], G
    }
  };
  a8.pbe.getCipherForPBES2 = function(A, Q, B) {
    var G = {},
      Z = [];
    if (!x0.validate(Q, OZ5, G, Z)) {
      var I = Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
      throw I.errors = Z, I
    }
    if (A = x0.derToOid(G.kdfOid), A !== a8.oids.pkcs5PBKDF2) {
      var I = Error("Cannot read encrypted private key. Unsupported key derivation function OID.");
      throw I.oid = A, I.supportedOids = ["pkcs5PBKDF2"], I
    }
    if (A = x0.derToOid(G.encOid), A !== a8.oids["aes128-CBC"] && A !== a8.oids["aes192-CBC"] && A !== a8.oids["aes256-CBC"] && A !== a8.oids["des-EDE3-CBC"] && A !== a8.oids.desCBC) {
      var I = Error("Cannot read encrypted private key. Unsupported encryption scheme OID.");
      throw I.oid = A, I.supportedOids = ["aes128-CBC", "aes192-CBC", "aes256-CBC", "des-EDE3-CBC", "desCBC"], I
    }
    var Y = G.kdfSalt,
      J = uB.util.createBuffer(G.kdfIterationCount);
    J = J.getInt(J.length() << 3);
    var W, X;
    switch (a8.oids[A]) {
      case "aes128-CBC":
        W = 16, X = uB.aes.createDecryptionCipher;
        break;
      case "aes192-CBC":
        W = 24, X = uB.aes.createDecryptionCipher;
        break;
      case "aes256-CBC":
        W = 32, X = uB.aes.createDecryptionCipher;
        break;
      case "des-EDE3-CBC":
        W = 24, X = uB.des.createDecryptionCipher;
        break;
      case "desCBC":
        W = 8, X = uB.des.createDecryptionCipher;
        break
    }
    var V = e62(G.prfOid),
      F = uB.pkcs5.pbkdf2(B, Y, J, W, V),
      K = G.encIv,
      D = X(F);
    return D.start(K), D
  };
  a8.pbe.getCipherForPKCS12PBE = function(A, Q, B) {
    var G = {},
      Z = [];
    if (!x0.validate(Q, RZ5, G, Z)) {
      var I = Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
      throw I.errors = Z, I
    }
    var Y = uB.util.createBuffer(G.salt),
      J = uB.util.createBuffer(G.iterations);
    J = J.getInt(J.length() << 3);
    var W, X, V;
    switch (A) {
      case a8.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
        W = 24, X = 8, V = uB.des.startDecrypting;
        break;
      case a8.oids["pbewithSHAAnd40BitRC2-CBC"]:
        W = 5, X = 8, V = function(C, E) {
          var U = uB.rc2.createDecryptionCipher(C, 40);
          return U.start(E, null), U
        };
        break;
      default:
        var I = Error("Cannot read PKCS #12 PBE data block. Unsupported OID.");
        throw I.oid = A, I
    }
    var F = e62(G.prfOid),
      K = a8.pbe.generatePkcs12Key(B, Y, 1, J, W, F);
    F.start();
    var D = a8.pbe.generatePkcs12Key(B, Y, 2, J, X, F);
    return V(K, D)
  };
  a8.pbe.opensslDeriveBytes = function(A, Q, B, G) {
    if (typeof G > "u" || G === null) {
      if (!("md5" in uB.md)) throw Error('"md5" hash algorithm unavailable.');
      G = uB.md.md5.create()
    }
    if (Q === null) Q = "";
    var Z = [t62(G, A + Q)];
    for (var I = 16, Y = 1; I < B; ++Y, I += 16) Z.push(t62(G, Z[Y - 1] + A + Q));
    return Z.join("").substr(0, B)
  };

  function t62(A, Q) {
    return A.start().update(Q).digest().getBytes()
  }

  function e62(A) {
    var Q;
    if (!A) Q = "hmacWithSHA1";
    else if (Q = a8.oids[x0.derToOid(A)], !Q) {
      var B = Error("Unsupported PRF OID.");
      throw B.oid = A, B.supported = ["hmacWithSHA1", "hmacWithSHA224", "hmacWithSHA256", "hmacWithSHA384", "hmacWithSHA512"], B
    }
    return A52(Q)
  }

  function A52(A) {
    var Q = uB.md;
    switch (A) {
      case "hmacWithSHA224":
        Q = uB.md.sha512;
      case "hmacWithSHA1":
      case "hmacWithSHA256":
      case "hmacWithSHA384":
      case "hmacWithSHA512":
        A = A.substr(8).toLowerCase();
        break;
      default:
        var B = Error("Unsupported PRF algorithm.");
        throw B.algorithm = A, B.supported = ["hmacWithSHA1", "hmacWithSHA224", "hmacWithSHA256", "hmacWithSHA384", "hmacWithSHA512"], B
    }
    if (!Q || !(A in Q)) throw Error("Unknown hash algorithm: " + A);
    return Q[A].create()
  }

  function TZ5(A, Q, B, G) {
    var Z = x0.create(x0.Class.UNIVERSAL, x0.Type.SEQUENCE, !0, [x0.create(x0.Class.UNIVERSAL, x0.Type.OCTETSTRING, !1, A), x0.create(x0.Class.UNIVERSAL, x0.Type.INTEGER, !1, Q.getBytes())]);
    if (G !== "hmacWithSHA1") Z.value.push(x0.create(x0.Class.UNIVERSAL, x0.Type.INTEGER, !1, uB.util.hexToBytes(B.toString(16))), x0.create(x0.Class.UNIVERSAL, x0.Type.SEQUENCE, !0, [x0.create(x0.Class.UNIVERSAL, x0.Type.OID, !1, x0.oidToDer(a8.oids[G]).getBytes()), x0.create(x0.Class.UNIVERSAL, x0.Type.NULL, !1, "")]));
    return Z
  }
})
// @from(Start 9279773, End 9287053)
gA0 = z((XjG, Z52) => {
  var iIA = B6();
  GP();
  x3();
  var yB = iIA.asn1,
    nIA = Z52.exports = iIA.pkcs7asn1 = iIA.pkcs7asn1 || {};
  iIA.pkcs7 = iIA.pkcs7 || {};
  iIA.pkcs7.asn1 = nIA;
  var B52 = {
    name: "ContentInfo",
    tagClass: yB.Class.UNIVERSAL,
    type: yB.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "ContentInfo.ContentType",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.OID,
      constructed: !1,
      capture: "contentType"
    }, {
      name: "ContentInfo.content",
      tagClass: yB.Class.CONTEXT_SPECIFIC,
      type: 0,
      constructed: !0,
      optional: !0,
      captureAsn1: "content"
    }]
  };
  nIA.contentInfoValidator = B52;
  var G52 = {
    name: "EncryptedContentInfo",
    tagClass: yB.Class.UNIVERSAL,
    type: yB.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "EncryptedContentInfo.contentType",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.OID,
      constructed: !1,
      capture: "contentType"
    }, {
      name: "EncryptedContentInfo.contentEncryptionAlgorithm",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "EncryptedContentInfo.contentEncryptionAlgorithm.algorithm",
        tagClass: yB.Class.UNIVERSAL,
        type: yB.Type.OID,
        constructed: !1,
        capture: "encAlgorithm"
      }, {
        name: "EncryptedContentInfo.contentEncryptionAlgorithm.parameter",
        tagClass: yB.Class.UNIVERSAL,
        captureAsn1: "encParameter"
      }]
    }, {
      name: "EncryptedContentInfo.encryptedContent",
      tagClass: yB.Class.CONTEXT_SPECIFIC,
      type: 0,
      capture: "encryptedContent",
      captureAsn1: "encryptedContentAsn1"
    }]
  };
  nIA.envelopedDataValidator = {
    name: "EnvelopedData",
    tagClass: yB.Class.UNIVERSAL,
    type: yB.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "EnvelopedData.Version",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.INTEGER,
      constructed: !1,
      capture: "version"
    }, {
      name: "EnvelopedData.RecipientInfos",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.SET,
      constructed: !0,
      captureAsn1: "recipientInfos"
    }].concat(G52)
  };
  nIA.encryptedDataValidator = {
    name: "EncryptedData",
    tagClass: yB.Class.UNIVERSAL,
    type: yB.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "EncryptedData.Version",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.INTEGER,
      constructed: !1,
      capture: "version"
    }].concat(G52)
  };
  var PZ5 = {
    name: "SignerInfo",
    tagClass: yB.Class.UNIVERSAL,
    type: yB.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "SignerInfo.version",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.INTEGER,
      constructed: !1
    }, {
      name: "SignerInfo.issuerAndSerialNumber",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "SignerInfo.issuerAndSerialNumber.issuer",
        tagClass: yB.Class.UNIVERSAL,
        type: yB.Type.SEQUENCE,
        constructed: !0,
        captureAsn1: "issuer"
      }, {
        name: "SignerInfo.issuerAndSerialNumber.serialNumber",
        tagClass: yB.Class.UNIVERSAL,
        type: yB.Type.INTEGER,
        constructed: !1,
        capture: "serial"
      }]
    }, {
      name: "SignerInfo.digestAlgorithm",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "SignerInfo.digestAlgorithm.algorithm",
        tagClass: yB.Class.UNIVERSAL,
        type: yB.Type.OID,
        constructed: !1,
        capture: "digestAlgorithm"
      }, {
        name: "SignerInfo.digestAlgorithm.parameter",
        tagClass: yB.Class.UNIVERSAL,
        constructed: !1,
        captureAsn1: "digestParameter",
        optional: !0
      }]
    }, {
      name: "SignerInfo.authenticatedAttributes",
      tagClass: yB.Class.CONTEXT_SPECIFIC,
      type: 0,
      constructed: !0,
      optional: !0,
      capture: "authenticatedAttributes"
    }, {
      name: "SignerInfo.digestEncryptionAlgorithm",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.SEQUENCE,
      constructed: !0,
      capture: "signatureAlgorithm"
    }, {
      name: "SignerInfo.encryptedDigest",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.OCTETSTRING,
      constructed: !1,
      capture: "signature"
    }, {
      name: "SignerInfo.unauthenticatedAttributes",
      tagClass: yB.Class.CONTEXT_SPECIFIC,
      type: 1,
      constructed: !0,
      optional: !0,
      capture: "unauthenticatedAttributes"
    }]
  };
  nIA.signedDataValidator = {
    name: "SignedData",
    tagClass: yB.Class.UNIVERSAL,
    type: yB.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "SignedData.Version",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.INTEGER,
      constructed: !1,
      capture: "version"
    }, {
      name: "SignedData.DigestAlgorithms",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.SET,
      constructed: !0,
      captureAsn1: "digestAlgorithms"
    }, B52, {
      name: "SignedData.Certificates",
      tagClass: yB.Class.CONTEXT_SPECIFIC,
      type: 0,
      optional: !0,
      captureAsn1: "certificates"
    }, {
      name: "SignedData.CertificateRevocationLists",
      tagClass: yB.Class.CONTEXT_SPECIFIC,
      type: 1,
      optional: !0,
      captureAsn1: "crls"
    }, {
      name: "SignedData.SignerInfos",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.SET,
      capture: "signerInfos",
      optional: !0,
      value: [PZ5]
    }]
  };
  nIA.recipientInfoValidator = {
    name: "RecipientInfo",
    tagClass: yB.Class.UNIVERSAL,
    type: yB.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "RecipientInfo.version",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.INTEGER,
      constructed: !1,
      capture: "version"
    }, {
      name: "RecipientInfo.issuerAndSerial",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "RecipientInfo.issuerAndSerial.issuer",
        tagClass: yB.Class.UNIVERSAL,
        type: yB.Type.SEQUENCE,
        constructed: !0,
        captureAsn1: "issuer"
      }, {
        name: "RecipientInfo.issuerAndSerial.serialNumber",
        tagClass: yB.Class.UNIVERSAL,
        type: yB.Type.INTEGER,
        constructed: !1,
        capture: "serial"
      }]
    }, {
      name: "RecipientInfo.keyEncryptionAlgorithm",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "RecipientInfo.keyEncryptionAlgorithm.algorithm",
        tagClass: yB.Class.UNIVERSAL,
        type: yB.Type.OID,
        constructed: !1,
        capture: "encAlgorithm"
      }, {
        name: "RecipientInfo.keyEncryptionAlgorithm.parameter",
        tagClass: yB.Class.UNIVERSAL,
        constructed: !1,
        captureAsn1: "encParameter",
        optional: !0
      }]
    }, {
      name: "RecipientInfo.encryptedKey",
      tagClass: yB.Class.UNIVERSAL,
      type: yB.Type.OCTETSTRING,
      constructed: !1,
      capture: "encKey"
    }]
  }
})
// @from(Start 9287059, End 9287635)
uA0 = z((VjG, I52) => {
  var Y1A = B6();
  x3();
  Y1A.mgf = Y1A.mgf || {};
  var jZ5 = I52.exports = Y1A.mgf.mgf1 = Y1A.mgf1 = Y1A.mgf1 || {};
  jZ5.create = function(A) {
    var Q = {
      generate: function(B, G) {
        var Z = new Y1A.util.ByteBuffer,
          I = Math.ceil(G / A.digestLength);
        for (var Y = 0; Y < I; Y++) {
          var J = new Y1A.util.ByteBuffer;
          J.putInt32(Y), A.start(), A.update(B + J.getBytes()), Z.putBuffer(A.digest())
        }
        return Z.truncate(Z.length() - G), Z.getBytes()
      }
    };
    return Q
  }
})
// @from(Start 9287641, End 9287761)
J52 = z((FjG, Y52) => {
  var rB1 = B6();
  uA0();
  Y52.exports = rB1.mgf = rB1.mgf || {};
  rB1.mgf.mgf1 = rB1.mgf1
})
// @from(Start 9287767, End 9290606)
oB1 = z((KjG, W52) => {
  var J1A = B6();
  cM();
  x3();
  var SZ5 = W52.exports = J1A.pss = J1A.pss || {};
  SZ5.create = function(A) {
    if (arguments.length === 3) A = {
      md: arguments[0],
      mgf: arguments[1],
      saltLength: arguments[2]
    };
    var {
      md: Q,
      mgf: B
    } = A, G = Q.digestLength, Z = A.salt || null;
    if (typeof Z === "string") Z = J1A.util.createBuffer(Z);
    var I;
    if ("saltLength" in A) I = A.saltLength;
    else if (Z !== null) I = Z.length();
    else throw Error("Salt length not specified or specific salt not given.");
    if (Z !== null && Z.length() !== I) throw Error("Given salt length does not match length of given salt.");
    var Y = A.prng || J1A.random,
      J = {};
    return J.encode = function(W, X) {
      var V, F = X - 1,
        K = Math.ceil(F / 8),
        D = W.digest().getBytes();
      if (K < G + I + 2) throw Error("Message is too long to encrypt.");
      var H;
      if (Z === null) H = Y.getBytesSync(I);
      else H = Z.bytes();
      var C = new J1A.util.ByteBuffer;
      C.fillWithByte(0, 8), C.putBytes(D), C.putBytes(H), Q.start(), Q.update(C.getBytes());
      var E = Q.digest().getBytes(),
        U = new J1A.util.ByteBuffer;
      U.fillWithByte(0, K - I - G - 2), U.putByte(1), U.putBytes(H);
      var q = U.getBytes(),
        w = K - G - 1,
        N = B.generate(E, w),
        R = "";
      for (V = 0; V < w; V++) R += String.fromCharCode(q.charCodeAt(V) ^ N.charCodeAt(V));
      var T = 65280 >> 8 * K - F & 255;
      return R = String.fromCharCode(R.charCodeAt(0) & ~T) + R.substr(1), R + E + String.fromCharCode(188)
    }, J.verify = function(W, X, V) {
      var F, K = V - 1,
        D = Math.ceil(K / 8);
      if (X = X.substr(-D), D < G + I + 2) throw Error("Inconsistent parameters to PSS signature verification.");
      if (X.charCodeAt(D - 1) !== 188) throw Error("Encoded message does not end in 0xBC.");
      var H = D - G - 1,
        C = X.substr(0, H),
        E = X.substr(H, G),
        U = 65280 >> 8 * D - K & 255;
      if ((C.charCodeAt(0) & U) !== 0) throw Error("Bits beyond keysize not zero as expected.");
      var q = B.generate(E, H),
        w = "";
      for (F = 0; F < H; F++) w += String.fromCharCode(C.charCodeAt(F) ^ q.charCodeAt(F));
      w = String.fromCharCode(w.charCodeAt(0) & ~U) + w.substr(1);
      var N = D - G - I - 2;
      for (F = 0; F < N; F++)
        if (w.charCodeAt(F) !== 0) throw Error("Leftmost octets not zero as expected");
      if (w.charCodeAt(N) !== 1) throw Error("Inconsistent PSS signature, 0x01 marker not found");
      var R = w.substr(-I),
        T = new J1A.util.ByteBuffer;
      T.fillWithByte(0, 8), T.putBytes(W), T.putBytes(R), Q.start(), Q.update(T.getBytes());
      var y = Q.digest().getBytes();
      return E === y
    }, J
  }
})