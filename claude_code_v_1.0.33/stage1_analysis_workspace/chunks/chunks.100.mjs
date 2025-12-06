
// @from(Start 9359422, End 9411385)
oA0 = z((EjG, M52) => {
  var KQ = B6();
  GP();
  mIA();
  uB1();
  B1A();
  lA0();
  cM();
  lIA();
  x3();
  var G21 = function(A, Q, B, G) {
      var Z = KQ.util.createBuffer(),
        I = A.length >> 1,
        Y = I + (A.length & 1),
        J = A.substr(0, Y),
        W = A.substr(I, Y),
        X = KQ.util.createBuffer(),
        V = KQ.hmac.create();
      B = Q + B;
      var F = Math.ceil(G / 16),
        K = Math.ceil(G / 20);
      V.start("MD5", J);
      var D = KQ.util.createBuffer();
      X.putBytes(B);
      for (var H = 0; H < F; ++H) V.start(null, null), V.update(X.getBytes()), X.putBuffer(V.digest()), V.start(null, null), V.update(X.bytes() + B), D.putBuffer(V.digest());
      V.start("SHA1", W);
      var C = KQ.util.createBuffer();
      X.clear(), X.putBytes(B);
      for (var H = 0; H < K; ++H) V.start(null, null), V.update(X.getBytes()), X.putBuffer(V.digest()), V.start(null, null), V.update(X.bytes() + B), C.putBuffer(V.digest());
      return Z.putBytes(KQ.util.xorBytes(D.getBytes(), C.getBytes(), G)), Z
    },
    iZ5 = function(A, Q, B) {
      var G = KQ.hmac.create();
      G.start("SHA1", A);
      var Z = KQ.util.createBuffer();
      return Z.putInt32(Q[0]), Z.putInt32(Q[1]), Z.putByte(B.type), Z.putByte(B.version.major), Z.putByte(B.version.minor), Z.putInt16(B.length), Z.putBytes(B.fragment.bytes()), G.update(Z.getBytes()), G.digest().getBytes()
    },
    nZ5 = function(A, Q, B) {
      var G = !1;
      try {
        var Z = A.deflate(Q.fragment.getBytes());
        Q.fragment = KQ.util.createBuffer(Z), Q.length = Z.length, G = !0
      } catch (I) {}
      return G
    },
    aZ5 = function(A, Q, B) {
      var G = !1;
      try {
        var Z = A.inflate(Q.fragment.getBytes());
        Q.fragment = KQ.util.createBuffer(Z), Q.length = Z.length, G = !0
      } catch (I) {}
      return G
    },
    Eq = function(A, Q) {
      var B = 0;
      switch (Q) {
        case 1:
          B = A.getByte();
          break;
        case 2:
          B = A.getInt16();
          break;
        case 3:
          B = A.getInt24();
          break;
        case 4:
          B = A.getInt32();
          break
      }
      return KQ.util.createBuffer(A.getBytes(B))
    },
    nM = function(A, Q, B) {
      A.putInt(B.length(), Q << 3), A.putBuffer(B)
    },
    pA = {};
  pA.Versions = {
    TLS_1_0: {
      major: 3,
      minor: 1
    },
    TLS_1_1: {
      major: 3,
      minor: 2
    },
    TLS_1_2: {
      major: 3,
      minor: 3
    }
  };
  pA.SupportedVersions = [pA.Versions.TLS_1_1, pA.Versions.TLS_1_0];
  pA.Version = pA.SupportedVersions[0];
  pA.MaxFragment = 15360;
  pA.ConnectionEnd = {
    server: 0,
    client: 1
  };
  pA.PRFAlgorithm = {
    tls_prf_sha256: 0
  };
  pA.BulkCipherAlgorithm = {
    none: null,
    rc4: 0,
    des3: 1,
    aes: 2
  };
  pA.CipherType = {
    stream: 0,
    block: 1,
    aead: 2
  };
  pA.MACAlgorithm = {
    none: null,
    hmac_md5: 0,
    hmac_sha1: 1,
    hmac_sha256: 2,
    hmac_sha384: 3,
    hmac_sha512: 4
  };
  pA.CompressionMethod = {
    none: 0,
    deflate: 1
  };
  pA.ContentType = {
    change_cipher_spec: 20,
    alert: 21,
    handshake: 22,
    application_data: 23,
    heartbeat: 24
  };
  pA.HandshakeType = {
    hello_request: 0,
    client_hello: 1,
    server_hello: 2,
    certificate: 11,
    server_key_exchange: 12,
    certificate_request: 13,
    server_hello_done: 14,
    certificate_verify: 15,
    client_key_exchange: 16,
    finished: 20
  };
  pA.Alert = {};
  pA.Alert.Level = {
    warning: 1,
    fatal: 2
  };
  pA.Alert.Description = {
    close_notify: 0,
    unexpected_message: 10,
    bad_record_mac: 20,
    decryption_failed: 21,
    record_overflow: 22,
    decompression_failure: 30,
    handshake_failure: 40,
    bad_certificate: 42,
    unsupported_certificate: 43,
    certificate_revoked: 44,
    certificate_expired: 45,
    certificate_unknown: 46,
    illegal_parameter: 47,
    unknown_ca: 48,
    access_denied: 49,
    decode_error: 50,
    decrypt_error: 51,
    export_restriction: 60,
    protocol_version: 70,
    insufficient_security: 71,
    internal_error: 80,
    user_canceled: 90,
    no_renegotiation: 100
  };
  pA.HeartbeatMessageType = {
    heartbeat_request: 1,
    heartbeat_response: 2
  };
  pA.CipherSuites = {};
  pA.getCipherSuite = function(A) {
    var Q = null;
    for (var B in pA.CipherSuites) {
      var G = pA.CipherSuites[B];
      if (G.id[0] === A.charCodeAt(0) && G.id[1] === A.charCodeAt(1)) {
        Q = G;
        break
      }
    }
    return Q
  };
  pA.handleUnexpected = function(A, Q) {
    var B = !A.open && A.entity === pA.ConnectionEnd.client;
    if (!B) A.error(A, {
      message: "Unexpected message. Received TLS record out of order.",
      send: !0,
      alert: {
        level: pA.Alert.Level.fatal,
        description: pA.Alert.Description.unexpected_message
      }
    })
  };
  pA.handleHelloRequest = function(A, Q, B) {
    if (!A.handshaking && A.handshakes > 0) pA.queue(A, pA.createAlert(A, {
      level: pA.Alert.Level.warning,
      description: pA.Alert.Description.no_renegotiation
    })), pA.flush(A);
    A.process()
  };
  pA.parseHelloMessage = function(A, Q, B) {
    var G = null,
      Z = A.entity === pA.ConnectionEnd.client;
    if (B < 38) A.error(A, {
      message: Z ? "Invalid ServerHello message. Message too short." : "Invalid ClientHello message. Message too short.",
      send: !0,
      alert: {
        level: pA.Alert.Level.fatal,
        description: pA.Alert.Description.illegal_parameter
      }
    });
    else {
      var I = Q.fragment,
        Y = I.length();
      if (G = {
          version: {
            major: I.getByte(),
            minor: I.getByte()
          },
          random: KQ.util.createBuffer(I.getBytes(32)),
          session_id: Eq(I, 1),
          extensions: []
        }, Z) G.cipher_suite = I.getBytes(2), G.compression_method = I.getByte();
      else G.cipher_suites = Eq(I, 2), G.compression_methods = Eq(I, 1);
      if (Y = B - (Y - I.length()), Y > 0) {
        var J = Eq(I, 2);
        while (J.length() > 0) G.extensions.push({
          type: [J.getByte(), J.getByte()],
          data: Eq(J, 2)
        });
        if (!Z)
          for (var W = 0; W < G.extensions.length; ++W) {
            var X = G.extensions[W];
            if (X.type[0] === 0 && X.type[1] === 0) {
              var V = Eq(X.data, 2);
              while (V.length() > 0) {
                var F = V.getByte();
                if (F !== 0) break;
                A.session.extensions.server_name.serverNameList.push(Eq(V, 2).getBytes())
              }
            }
          }
      }
      if (A.session.version) {
        if (G.version.major !== A.session.version.major || G.version.minor !== A.session.version.minor) return A.error(A, {
          message: "TLS version change is disallowed during renegotiation.",
          send: !0,
          alert: {
            level: pA.Alert.Level.fatal,
            description: pA.Alert.Description.protocol_version
          }
        })
      }
      if (Z) A.session.cipherSuite = pA.getCipherSuite(G.cipher_suite);
      else {
        var K = KQ.util.createBuffer(G.cipher_suites.bytes());
        while (K.length() > 0)
          if (A.session.cipherSuite = pA.getCipherSuite(K.getBytes(2)), A.session.cipherSuite !== null) break
      }
      if (A.session.cipherSuite === null) return A.error(A, {
        message: "No cipher suites in common.",
        send: !0,
        alert: {
          level: pA.Alert.Level.fatal,
          description: pA.Alert.Description.handshake_failure
        },
        cipherSuite: KQ.util.bytesToHex(G.cipher_suite)
      });
      if (Z) A.session.compressionMethod = G.compression_method;
      else A.session.compressionMethod = pA.CompressionMethod.none
    }
    return G
  };
  pA.createSecurityParameters = function(A, Q) {
    var B = A.entity === pA.ConnectionEnd.client,
      G = Q.random.bytes(),
      Z = B ? A.session.sp.client_random : G,
      I = B ? G : pA.createRandom().getBytes();
    A.session.sp = {
      entity: A.entity,
      prf_algorithm: pA.PRFAlgorithm.tls_prf_sha256,
      bulk_cipher_algorithm: null,
      cipher_type: null,
      enc_key_length: null,
      block_length: null,
      fixed_iv_length: null,
      record_iv_length: null,
      mac_algorithm: null,
      mac_length: null,
      mac_key_length: null,
      compression_algorithm: A.session.compressionMethod,
      pre_master_secret: null,
      master_secret: null,
      client_random: Z,
      server_random: I
    }
  };
  pA.handleServerHello = function(A, Q, B) {
    var G = pA.parseHelloMessage(A, Q, B);
    if (A.fail) return;
    if (G.version.minor <= A.version.minor) A.version.minor = G.version.minor;
    else return A.error(A, {
      message: "Incompatible TLS version.",
      send: !0,
      alert: {
        level: pA.Alert.Level.fatal,
        description: pA.Alert.Description.protocol_version
      }
    });
    A.session.version = A.version;
    var Z = G.session_id.bytes();
    if (Z.length > 0 && Z === A.session.id) A.expect = $52, A.session.resuming = !0, A.session.sp.server_random = G.random.bytes();
    else A.expect = rZ5, A.session.resuming = !1, pA.createSecurityParameters(A, G);
    A.session.id = Z, A.process()
  };
  pA.handleClientHello = function(A, Q, B) {
    var G = pA.parseHelloMessage(A, Q, B);
    if (A.fail) return;
    var Z = G.session_id.bytes(),
      I = null;
    if (A.sessionCache) {
      if (I = A.sessionCache.getSession(Z), I === null) Z = "";
      else if (I.version.major !== G.version.major || I.version.minor > G.version.minor) I = null, Z = ""
    }
    if (Z.length === 0) Z = KQ.random.getBytes(32);
    if (A.session.id = Z, A.session.clientHelloVersion = G.version, A.session.sp = {}, I) A.version = A.session.version = I.version, A.session.sp = I.sp;
    else {
      var Y;
      for (var J = 1; J < pA.SupportedVersions.length; ++J)
        if (Y = pA.SupportedVersions[J], Y.minor <= G.version.minor) break;
      A.version = {
        major: Y.major,
        minor: Y.minor
      }, A.session.version = A.version
    }
    if (I !== null) A.expect = sA0, A.session.resuming = !0, A.session.sp.client_random = G.random.bytes();
    else A.expect = A.verifyClient !== !1 ? GI5 : aA0, A.session.resuming = !1, pA.createSecurityParameters(A, G);
    if (A.open = !0, pA.queue(A, pA.createRecord(A, {
        type: pA.ContentType.handshake,
        data: pA.createServerHello(A)
      })), A.session.resuming) pA.queue(A, pA.createRecord(A, {
      type: pA.ContentType.change_cipher_spec,
      data: pA.createChangeCipherSpec()
    })), A.state.pending = pA.createConnectionState(A), A.state.current.write = A.state.pending.write, pA.queue(A, pA.createRecord(A, {
      type: pA.ContentType.handshake,
      data: pA.createFinished(A)
    }));
    else if (pA.queue(A, pA.createRecord(A, {
        type: pA.ContentType.handshake,
        data: pA.createCertificate(A)
      })), !A.fail) {
      if (pA.queue(A, pA.createRecord(A, {
          type: pA.ContentType.handshake,
          data: pA.createServerKeyExchange(A)
        })), A.verifyClient !== !1) pA.queue(A, pA.createRecord(A, {
        type: pA.ContentType.handshake,
        data: pA.createCertificateRequest(A)
      }));
      pA.queue(A, pA.createRecord(A, {
        type: pA.ContentType.handshake,
        data: pA.createServerHelloDone(A)
      }))
    }
    pA.flush(A), A.process()
  };
  pA.handleCertificate = function(A, Q, B) {
    if (B < 3) return A.error(A, {
      message: "Invalid Certificate message. Message too short.",
      send: !0,
      alert: {
        level: pA.Alert.Level.fatal,
        description: pA.Alert.Description.illegal_parameter
      }
    });
    var G = Q.fragment,
      Z = {
        certificate_list: Eq(G, 3)
      },
      I, Y, J = [];
    try {
      while (Z.certificate_list.length() > 0) I = Eq(Z.certificate_list, 3), Y = KQ.asn1.fromDer(I), I = KQ.pki.certificateFromAsn1(Y, !0), J.push(I)
    } catch (X) {
      return A.error(A, {
        message: "Could not parse certificate list.",
        cause: X,
        send: !0,
        alert: {
          level: pA.Alert.Level.fatal,
          description: pA.Alert.Description.bad_certificate
        }
      })
    }
    var W = A.entity === pA.ConnectionEnd.client;
    if ((W || A.verifyClient === !0) && J.length === 0) A.error(A, {
      message: W ? "No server certificate provided." : "No client certificate provided.",
      send: !0,
      alert: {
        level: pA.Alert.Level.fatal,
        description: pA.Alert.Description.illegal_parameter
      }
    });
    else if (J.length === 0) A.expect = W ? z52 : aA0;
    else {
      if (W) A.session.serverCertificate = J[0];
      else A.session.clientCertificate = J[0];
      if (pA.verifyCertificateChain(A, J)) A.expect = W ? z52 : aA0
    }
    A.process()
  };
  pA.handleServerKeyExchange = function(A, Q, B) {
    if (B > 0) return A.error(A, {
      message: "Invalid key parameters. Only RSA is supported.",
      send: !0,
      alert: {
        level: pA.Alert.Level.fatal,
        description: pA.Alert.Description.unsupported_certificate
      }
    });
    A.expect = oZ5, A.process()
  };
  pA.handleClientKeyExchange = function(A, Q, B) {
    if (B < 48) return A.error(A, {
      message: "Invalid key parameters. Only RSA is supported.",
      send: !0,
      alert: {
        level: pA.Alert.Level.fatal,
        description: pA.Alert.Description.unsupported_certificate
      }
    });
    var G = Q.fragment,
      Z = {
        enc_pre_master_secret: Eq(G, 2).getBytes()
      },
      I = null;
    if (A.getPrivateKey) try {
      I = A.getPrivateKey(A, A.session.serverCertificate), I = KQ.pki.privateKeyFromPem(I)
    } catch (W) {
      A.error(A, {
        message: "Could not get private key.",
        cause: W,
        send: !0,
        alert: {
          level: pA.Alert.Level.fatal,
          description: pA.Alert.Description.internal_error
        }
      })
    }
    if (I === null) return A.error(A, {
      message: "No private key set.",
      send: !0,
      alert: {
        level: pA.Alert.Level.fatal,
        description: pA.Alert.Description.internal_error
      }
    });
    try {
      var Y = A.session.sp;
      Y.pre_master_secret = I.decrypt(Z.enc_pre_master_secret);
      var J = A.session.clientHelloVersion;
      if (J.major !== Y.pre_master_secret.charCodeAt(0) || J.minor !== Y.pre_master_secret.charCodeAt(1)) throw Error("TLS version rollback attack detected.")
    } catch (W) {
      Y.pre_master_secret = KQ.random.getBytes(48)
    }
    if (A.expect = sA0, A.session.clientCertificate !== null) A.expect = ZI5;
    A.process()
  };
  pA.handleCertificateRequest = function(A, Q, B) {
    if (B < 3) return A.error(A, {
      message: "Invalid CertificateRequest. Message too short.",
      send: !0,
      alert: {
        level: pA.Alert.Level.fatal,
        description: pA.Alert.Description.illegal_parameter
      }
    });
    var G = Q.fragment,
      Z = {
        certificate_types: Eq(G, 1),
        certificate_authorities: Eq(G, 2)
      };
    A.session.certificateRequest = Z, A.expect = tZ5, A.process()
  };
  pA.handleCertificateVerify = function(A, Q, B) {
    if (B < 2) return A.error(A, {
      message: "Invalid CertificateVerify. Message too short.",
      send: !0,
      alert: {
        level: pA.Alert.Level.fatal,
        description: pA.Alert.Description.illegal_parameter
      }
    });
    var G = Q.fragment;
    G.read -= 4;
    var Z = G.bytes();
    G.read += 4;
    var I = {
        signature: Eq(G, 2).getBytes()
      },
      Y = KQ.util.createBuffer();
    Y.putBuffer(A.session.md5.digest()), Y.putBuffer(A.session.sha1.digest()), Y = Y.getBytes();
    try {
      var J = A.session.clientCertificate;
      if (!J.publicKey.verify(Y, I.signature, "NONE")) throw Error("CertificateVerify signature does not match.");
      A.session.md5.update(Z), A.session.sha1.update(Z)
    } catch (W) {
      return A.error(A, {
        message: "Bad signature in CertificateVerify.",
        send: !0,
        alert: {
          level: pA.Alert.Level.fatal,
          description: pA.Alert.Description.handshake_failure
        }
      })
    }
    A.expect = sA0, A.process()
  };
  pA.handleServerHelloDone = function(A, Q, B) {
    if (B > 0) return A.error(A, {
      message: "Invalid ServerHelloDone message. Invalid length.",
      send: !0,
      alert: {
        level: pA.Alert.Level.fatal,
        description: pA.Alert.Description.record_overflow
      }
    });
    if (A.serverCertificate === null) {
      var G = {
          message: "No server certificate provided. Not enough security.",
          send: !0,
          alert: {
            level: pA.Alert.Level.fatal,
            description: pA.Alert.Description.insufficient_security
          }
        },
        Z = 0,
        I = A.verify(A, G.alert.description, Z, []);
      if (I !== !0) {
        if (I || I === 0) {
          if (typeof I === "object" && !KQ.util.isArray(I)) {
            if (I.message) G.message = I.message;
            if (I.alert) G.alert.description = I.alert
          } else if (typeof I === "number") G.alert.description = I
        }
        return A.error(A, G)
      }
    }
    if (A.session.certificateRequest !== null) Q = pA.createRecord(A, {
      type: pA.ContentType.handshake,
      data: pA.createCertificate(A)
    }), pA.queue(A, Q);
    Q = pA.createRecord(A, {
      type: pA.ContentType.handshake,
      data: pA.createClientKeyExchange(A)
    }), pA.queue(A, Q), A.expect = QI5;
    var Y = function(J, W) {
      if (J.session.certificateRequest !== null && J.session.clientCertificate !== null) pA.queue(J, pA.createRecord(J, {
        type: pA.ContentType.handshake,
        data: pA.createCertificateVerify(J, W)
      }));
      pA.queue(J, pA.createRecord(J, {
        type: pA.ContentType.change_cipher_spec,
        data: pA.createChangeCipherSpec()
      })), J.state.pending = pA.createConnectionState(J), J.state.current.write = J.state.pending.write, pA.queue(J, pA.createRecord(J, {
        type: pA.ContentType.handshake,
        data: pA.createFinished(J)
      })), J.expect = $52, pA.flush(J), J.process()
    };
    if (A.session.certificateRequest === null || A.session.clientCertificate === null) return Y(A, null);
    pA.getClientSignature(A, Y)
  };
  pA.handleChangeCipherSpec = function(A, Q) {
    if (Q.fragment.getByte() !== 1) return A.error(A, {
      message: "Invalid ChangeCipherSpec message received.",
      send: !0,
      alert: {
        level: pA.Alert.Level.fatal,
        description: pA.Alert.Description.illegal_parameter
      }
    });
    var B = A.entity === pA.ConnectionEnd.client;
    if (A.session.resuming && B || !A.session.resuming && !B) A.state.pending = pA.createConnectionState(A);
    if (A.state.current.read = A.state.pending.read, !A.session.resuming && B || A.session.resuming && !B) A.state.pending = null;
    A.expect = B ? eZ5 : II5, A.process()
  };
  pA.handleFinished = function(A, Q, B) {
    var G = Q.fragment;
    G.read -= 4;
    var Z = G.bytes();
    G.read += 4;
    var I = Q.fragment.getBytes();
    G = KQ.util.createBuffer(), G.putBuffer(A.session.md5.digest()), G.putBuffer(A.session.sha1.digest());
    var Y = A.entity === pA.ConnectionEnd.client,
      J = Y ? "server finished" : "client finished",
      W = A.session.sp,
      X = 12,
      V = G21;
    if (G = V(W.master_secret, J, G.getBytes(), X), G.getBytes() !== I) return A.error(A, {
      message: "Invalid verify_data in Finished message.",
      send: !0,
      alert: {
        level: pA.Alert.Level.fatal,
        description: pA.Alert.Description.decrypt_error
      }
    });
    if (A.session.md5.update(Z), A.session.sha1.update(Z), A.session.resuming && Y || !A.session.resuming && !Y) pA.queue(A, pA.createRecord(A, {
      type: pA.ContentType.change_cipher_spec,
      data: pA.createChangeCipherSpec()
    })), A.state.current.write = A.state.pending.write, A.state.pending = null, pA.queue(A, pA.createRecord(A, {
      type: pA.ContentType.handshake,
      data: pA.createFinished(A)
    }));
    A.expect = Y ? AI5 : YI5, A.handshaking = !1, ++A.handshakes, A.peerCertificate = Y ? A.session.serverCertificate : A.session.clientCertificate, pA.flush(A), A.isConnected = !0, A.connected(A), A.process()
  };
  pA.handleAlert = function(A, Q) {
    var B = Q.fragment,
      G = {
        level: B.getByte(),
        description: B.getByte()
      },
      Z;
    switch (G.description) {
      case pA.Alert.Description.close_notify:
        Z = "Connection closed.";
        break;
      case pA.Alert.Description.unexpected_message:
        Z = "Unexpected message.";
        break;
      case pA.Alert.Description.bad_record_mac:
        Z = "Bad record MAC.";
        break;
      case pA.Alert.Description.decryption_failed:
        Z = "Decryption failed.";
        break;
      case pA.Alert.Description.record_overflow:
        Z = "Record overflow.";
        break;
      case pA.Alert.Description.decompression_failure:
        Z = "Decompression failed.";
        break;
      case pA.Alert.Description.handshake_failure:
        Z = "Handshake failure.";
        break;
      case pA.Alert.Description.bad_certificate:
        Z = "Bad certificate.";
        break;
      case pA.Alert.Description.unsupported_certificate:
        Z = "Unsupported certificate.";
        break;
      case pA.Alert.Description.certificate_revoked:
        Z = "Certificate revoked.";
        break;
      case pA.Alert.Description.certificate_expired:
        Z = "Certificate expired.";
        break;
      case pA.Alert.Description.certificate_unknown:
        Z = "Certificate unknown.";
        break;
      case pA.Alert.Description.illegal_parameter:
        Z = "Illegal parameter.";
        break;
      case pA.Alert.Description.unknown_ca:
        Z = "Unknown certificate authority.";
        break;
      case pA.Alert.Description.access_denied:
        Z = "Access denied.";
        break;
      case pA.Alert.Description.decode_error:
        Z = "Decode error.";
        break;
      case pA.Alert.Description.decrypt_error:
        Z = "Decrypt error.";
        break;
      case pA.Alert.Description.export_restriction:
        Z = "Export restriction.";
        break;
      case pA.Alert.Description.protocol_version:
        Z = "Unsupported protocol version.";
        break;
      case pA.Alert.Description.insufficient_security:
        Z = "Insufficient security.";
        break;
      case pA.Alert.Description.internal_error:
        Z = "Internal error.";
        break;
      case pA.Alert.Description.user_canceled:
        Z = "User canceled.";
        break;
      case pA.Alert.Description.no_renegotiation:
        Z = "Renegotiation not supported.";
        break;
      default:
        Z = "Unknown error.";
        break
    }
    if (G.description === pA.Alert.Description.close_notify) return A.close();
    A.error(A, {
      message: Z,
      send: !1,
      origin: A.entity === pA.ConnectionEnd.client ? "server" : "client",
      alert: G
    }), A.process()
  };
  pA.handleHandshake = function(A, Q) {
    var B = Q.fragment,
      G = B.getByte(),
      Z = B.getInt24();
    if (Z > B.length()) return A.fragmented = Q, Q.fragment = KQ.util.createBuffer(), B.read -= 4, A.process();
    A.fragmented = null, B.read -= 4;
    var I = B.bytes(Z + 4);
    if (B.read += 4, G in B21[A.entity][A.expect]) {
      if (A.entity === pA.ConnectionEnd.server && !A.open && !A.fail) A.handshaking = !0, A.session = {
        version: null,
        extensions: {
          server_name: {
            serverNameList: []
          }
        },
        cipherSuite: null,
        compressionMethod: null,
        serverCertificate: null,
        clientCertificate: null,
        md5: KQ.md.md5.create(),
        sha1: KQ.md.sha1.create()
      };
      if (G !== pA.HandshakeType.hello_request && G !== pA.HandshakeType.certificate_verify && G !== pA.HandshakeType.finished) A.session.md5.update(I), A.session.sha1.update(I);
      B21[A.entity][A.expect][G](A, Q, Z)
    } else pA.handleUnexpected(A, Q)
  };
  pA.handleApplicationData = function(A, Q) {
    A.data.putBuffer(Q.fragment), A.dataReady(A), A.process()
  };
  pA.handleHeartbeat = function(A, Q) {
    var B = Q.fragment,
      G = B.getByte(),
      Z = B.getInt16(),
      I = B.getBytes(Z);
    if (G === pA.HeartbeatMessageType.heartbeat_request) {
      if (A.handshaking || Z > I.length) return A.process();
      pA.queue(A, pA.createRecord(A, {
        type: pA.ContentType.heartbeat,
        data: pA.createHeartbeat(pA.HeartbeatMessageType.heartbeat_response, I)
      })), pA.flush(A)
    } else if (G === pA.HeartbeatMessageType.heartbeat_response) {
      if (I !== A.expectedHeartbeatPayload) return A.process();
      if (A.heartbeatReceived) A.heartbeatReceived(A, KQ.util.createBuffer(I))
    }
    A.process()
  };
  var sZ5 = 0,
    rZ5 = 1,
    z52 = 2,
    oZ5 = 3,
    tZ5 = 4,
    $52 = 5,
    eZ5 = 6,
    AI5 = 7,
    QI5 = 8,
    BI5 = 0,
    GI5 = 1,
    aA0 = 2,
    ZI5 = 3,
    sA0 = 4,
    II5 = 5,
    YI5 = 6,
    gA = pA.handleUnexpected,
    w52 = pA.handleChangeCipherSpec,
    kD = pA.handleAlert,
    kE = pA.handleHandshake,
    q52 = pA.handleApplicationData,
    yD = pA.handleHeartbeat,
    rA0 = [];
  rA0[pA.ConnectionEnd.client] = [
    [gA, kD, kE, gA, yD],
    [gA, kD, kE, gA, yD],
    [gA, kD, kE, gA, yD],
    [gA, kD, kE, gA, yD],
    [gA, kD, kE, gA, yD],
    [w52, kD, gA, gA, yD],
    [gA, kD, kE, gA, yD],
    [gA, kD, kE, q52, yD],
    [gA, kD, kE, gA, yD]
  ];
  rA0[pA.ConnectionEnd.server] = [
    [gA, kD, kE, gA, yD],
    [gA, kD, kE, gA, yD],
    [gA, kD, kE, gA, yD],
    [gA, kD, kE, gA, yD],
    [w52, kD, gA, gA, yD],
    [gA, kD, kE, gA, yD],
    [gA, kD, kE, q52, yD],
    [gA, kD, kE, gA, yD]
  ];
  var {
    handleHelloRequest: Vi,
    handleServerHello: JI5,
    handleCertificate: N52,
    handleServerKeyExchange: U52,
    handleCertificateRequest: iA0,
    handleServerHelloDone: Q21,
    handleFinished: L52
  } = pA, B21 = [];
  B21[pA.ConnectionEnd.client] = [
    [gA, gA, JI5, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA],
    [Vi, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, N52, U52, iA0, Q21, gA, gA, gA, gA, gA, gA],
    [Vi, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, U52, iA0, Q21, gA, gA, gA, gA, gA, gA],
    [Vi, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, iA0, Q21, gA, gA, gA, gA, gA, gA],
    [Vi, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, Q21, gA, gA, gA, gA, gA, gA],
    [Vi, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA],
    [Vi, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, L52],
    [Vi, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA],
    [Vi, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA]
  ];
  var {
    handleClientHello: WI5,
    handleClientKeyExchange: XI5,
    handleCertificateVerify: VI5
  } = pA;
  B21[pA.ConnectionEnd.server] = [
    [gA, WI5, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA],
    [gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, N52, gA, gA, gA, gA, gA, gA, gA, gA, gA],
    [gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, XI5, gA, gA, gA, gA],
    [gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, VI5, gA, gA, gA, gA, gA],
    [gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA],
    [gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, L52],
    [gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA],
    [gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA, gA]
  ];
  pA.generateKeys = function(A, Q) {
    var B = G21,
      G = Q.client_random + Q.server_random;
    if (!A.session.resuming) Q.master_secret = B(Q.pre_master_secret, "master secret", G, 48).bytes(), Q.pre_master_secret = null;
    G = Q.server_random + Q.client_random;
    var Z = 2 * Q.mac_key_length + 2 * Q.enc_key_length,
      I = A.version.major === pA.Versions.TLS_1_0.major && A.version.minor === pA.Versions.TLS_1_0.minor;
    if (I) Z += 2 * Q.fixed_iv_length;
    var Y = B(Q.master_secret, "key expansion", G, Z),
      J = {
        client_write_MAC_key: Y.getBytes(Q.mac_key_length),
        server_write_MAC_key: Y.getBytes(Q.mac_key_length),
        client_write_key: Y.getBytes(Q.enc_key_length),
        server_write_key: Y.getBytes(Q.enc_key_length)
      };
    if (I) J.client_write_IV = Y.getBytes(Q.fixed_iv_length), J.server_write_IV = Y.getBytes(Q.fixed_iv_length);
    return J
  };
  pA.createConnectionState = function(A) {
    var Q = A.entity === pA.ConnectionEnd.client,
      B = function() {
        var I = {
          sequenceNumber: [0, 0],
          macKey: null,
          macLength: 0,
          macFunction: null,
          cipherState: null,
          cipherFunction: function(Y) {
            return !0
          },
          compressionState: null,
          compressFunction: function(Y) {
            return !0
          },
          updateSequenceNumber: function() {
            if (I.sequenceNumber[1] === 4294967295) I.sequenceNumber[1] = 0, ++I.sequenceNumber[0];
            else ++I.sequenceNumber[1]
          }
        };
        return I
      },
      G = {
        read: B(),
        write: B()
      };
    if (G.read.update = function(I, Y) {
        if (!G.read.cipherFunction(Y, G.read)) I.error(I, {
          message: "Could not decrypt record or bad MAC.",
          send: !0,
          alert: {
            level: pA.Alert.Level.fatal,
            description: pA.Alert.Description.bad_record_mac
          }
        });
        else if (!G.read.compressFunction(I, Y, G.read)) I.error(I, {
          message: "Could not decompress record.",
          send: !0,
          alert: {
            level: pA.Alert.Level.fatal,
            description: pA.Alert.Description.decompression_failure
          }
        });
        return !I.fail
      }, G.write.update = function(I, Y) {
        if (!G.write.compressFunction(I, Y, G.write)) I.error(I, {
          message: "Could not compress record.",
          send: !1,
          alert: {
            level: pA.Alert.Level.fatal,
            description: pA.Alert.Description.internal_error
          }
        });
        else if (!G.write.cipherFunction(Y, G.write)) I.error(I, {
          message: "Could not encrypt record.",
          send: !1,
          alert: {
            level: pA.Alert.Level.fatal,
            description: pA.Alert.Description.internal_error
          }
        });
        return !I.fail
      }, A.session) {
      var Z = A.session.sp;
      switch (A.session.cipherSuite.initSecurityParameters(Z), Z.keys = pA.generateKeys(A, Z), G.read.macKey = Q ? Z.keys.server_write_MAC_key : Z.keys.client_write_MAC_key, G.write.macKey = Q ? Z.keys.client_write_MAC_key : Z.keys.server_write_MAC_key, A.session.cipherSuite.initConnectionState(G, A, Z), Z.compression_algorithm) {
        case pA.CompressionMethod.none:
          break;
        case pA.CompressionMethod.deflate:
          G.read.compressFunction = aZ5, G.write.compressFunction = nZ5;
          break;
        default:
          throw Error("Unsupported compression algorithm.")
      }
    }
    return G
  };
  pA.createRandom = function() {
    var A = new Date,
      Q = +A + A.getTimezoneOffset() * 60000,
      B = KQ.util.createBuffer();
    return B.putInt32(Q), B.putBytes(KQ.random.getBytes(28)), B
  };
  pA.createRecord = function(A, Q) {
    if (!Q.data) return null;
    var B = {
      type: Q.type,
      version: {
        major: A.version.major,
        minor: A.version.minor
      },
      length: Q.data.length(),
      fragment: Q.data
    };
    return B
  };
  pA.createAlert = function(A, Q) {
    var B = KQ.util.createBuffer();
    return B.putByte(Q.level), B.putByte(Q.description), pA.createRecord(A, {
      type: pA.ContentType.alert,
      data: B
    })
  };
  pA.createClientHello = function(A) {
    A.session.clientHelloVersion = {
      major: A.version.major,
      minor: A.version.minor
    };
    var Q = KQ.util.createBuffer();
    for (var B = 0; B < A.cipherSuites.length; ++B) {
      var G = A.cipherSuites[B];
      Q.putByte(G.id[0]), Q.putByte(G.id[1])
    }
    var Z = Q.length(),
      I = KQ.util.createBuffer();
    I.putByte(pA.CompressionMethod.none);
    var Y = I.length(),
      J = KQ.util.createBuffer();
    if (A.virtualHost) {
      var W = KQ.util.createBuffer();
      W.putByte(0), W.putByte(0);
      var X = KQ.util.createBuffer();
      X.putByte(0), nM(X, 2, KQ.util.createBuffer(A.virtualHost));
      var V = KQ.util.createBuffer();
      nM(V, 2, X), nM(W, 2, V), J.putBuffer(W)
    }
    var F = J.length();
    if (F > 0) F += 2;
    var K = A.session.id,
      D = K.length + 1 + 2 + 4 + 28 + 2 + Z + 1 + Y + F,
      H = KQ.util.createBuffer();
    if (H.putByte(pA.HandshakeType.client_hello), H.putInt24(D), H.putByte(A.version.major), H.putByte(A.version.minor), H.putBytes(A.session.sp.client_random), nM(H, 1, KQ.util.createBuffer(K)), nM(H, 2, Q), nM(H, 1, I), F > 0) nM(H, 2, J);
    return H
  };
  pA.createServerHello = function(A) {
    var Q = A.session.id,
      B = Q.length + 1 + 2 + 4 + 28 + 2 + 1,
      G = KQ.util.createBuffer();
    return G.putByte(pA.HandshakeType.server_hello), G.putInt24(B), G.putByte(A.version.major), G.putByte(A.version.minor), G.putBytes(A.session.sp.server_random), nM(G, 1, KQ.util.createBuffer(Q)), G.putByte(A.session.cipherSuite.id[0]), G.putByte(A.session.cipherSuite.id[1]), G.putByte(A.session.compressionMethod), G
  };
  pA.createCertificate = function(A) {
    var Q = A.entity === pA.ConnectionEnd.client,
      B = null;
    if (A.getCertificate) {
      var G;
      if (Q) G = A.session.certificateRequest;
      else G = A.session.extensions.server_name.serverNameList;
      B = A.getCertificate(A, G)
    }
    var Z = KQ.util.createBuffer();
    if (B !== null) try {
      if (!KQ.util.isArray(B)) B = [B];
      var I = null;
      for (var Y = 0; Y < B.length; ++Y) {
        var J = KQ.pem.decode(B[Y])[0];
        if (J.type !== "CERTIFICATE" && J.type !== "X509 CERTIFICATE" && J.type !== "TRUSTED CERTIFICATE") {
          var W = Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
          throw W.headerType = J.type, W
        }
        if (J.procType && J.procType.type === "ENCRYPTED") throw Error("Could not convert certificate from PEM; PEM is encrypted.");
        var X = KQ.util.createBuffer(J.body);
        if (I === null) I = KQ.asn1.fromDer(X.bytes(), !1);
        var V = KQ.util.createBuffer();
        nM(V, 3, X), Z.putBuffer(V)
      }
      if (B = KQ.pki.certificateFromAsn1(I), Q) A.session.clientCertificate = B;
      else A.session.serverCertificate = B
    } catch (D) {
      return A.error(A, {
        message: "Could not send certificate list.",
        cause: D,
        send: !0,
        alert: {
          level: pA.Alert.Level.fatal,
          description: pA.Alert.Description.bad_certificate
        }
      })
    }
    var F = 3 + Z.length(),
      K = KQ.util.createBuffer();
    return K.putByte(pA.HandshakeType.certificate), K.putInt24(F), nM(K, 3, Z), K
  };
  pA.createClientKeyExchange = function(A) {
    var Q = KQ.util.createBuffer();
    Q.putByte(A.session.clientHelloVersion.major), Q.putByte(A.session.clientHelloVersion.minor), Q.putBytes(KQ.random.getBytes(46));
    var B = A.session.sp;
    B.pre_master_secret = Q.getBytes();
    var G = A.session.serverCertificate.publicKey;
    Q = G.encrypt(B.pre_master_secret);
    var Z = Q.length + 2,
      I = KQ.util.createBuffer();
    return I.putByte(pA.HandshakeType.client_key_exchange), I.putInt24(Z), I.putInt16(Q.length), I.putBytes(Q), I
  };
  pA.createServerKeyExchange = function(A) {
    var Q = 0,
      B = KQ.util.createBuffer();
    if (Q > 0) B.putByte(pA.HandshakeType.server_key_exchange), B.putInt24(Q);
    return B
  };
  pA.getClientSignature = function(A, Q) {
    var B = KQ.util.createBuffer();
    B.putBuffer(A.session.md5.digest()), B.putBuffer(A.session.sha1.digest()), B = B.getBytes(), A.getSignature = A.getSignature || function(G, Z, I) {
      var Y = null;
      if (G.getPrivateKey) try {
        Y = G.getPrivateKey(G, G.session.clientCertificate), Y = KQ.pki.privateKeyFromPem(Y)
      } catch (J) {
        G.error(G, {
          message: "Could not get private key.",
          cause: J,
          send: !0,
          alert: {
            level: pA.Alert.Level.fatal,
            description: pA.Alert.Description.internal_error
          }
        })
      }
      if (Y === null) G.error(G, {
        message: "No private key set.",
        send: !0,
        alert: {
          level: pA.Alert.Level.fatal,
          description: pA.Alert.Description.internal_error
        }
      });
      else Z = Y.sign(Z, null);
      I(G, Z)
    }, A.getSignature(A, B, Q)
  };
  pA.createCertificateVerify = function(A, Q) {
    var B = Q.length + 2,
      G = KQ.util.createBuffer();
    return G.putByte(pA.HandshakeType.certificate_verify), G.putInt24(B), G.putInt16(Q.length), G.putBytes(Q), G
  };
  pA.createCertificateRequest = function(A) {
    var Q = KQ.util.createBuffer();
    Q.putByte(1);
    var B = KQ.util.createBuffer();
    for (var G in A.caStore.certs) {
      var Z = A.caStore.certs[G],
        I = KQ.pki.distinguishedNameToAsn1(Z.subject),
        Y = KQ.asn1.toDer(I);
      B.putInt16(Y.length()), B.putBuffer(Y)
    }
    var J = 1 + Q.length() + 2 + B.length(),
      W = KQ.util.createBuffer();
    return W.putByte(pA.HandshakeType.certificate_request), W.putInt24(J), nM(W, 1, Q), nM(W, 2, B), W
  };
  pA.createServerHelloDone = function(A) {
    var Q = KQ.util.createBuffer();
    return Q.putByte(pA.HandshakeType.server_hello_done), Q.putInt24(0), Q
  };
  pA.createChangeCipherSpec = function() {
    var A = KQ.util.createBuffer();
    return A.putByte(1), A
  };
  pA.createFinished = function(A) {
    var Q = KQ.util.createBuffer();
    Q.putBuffer(A.session.md5.digest()), Q.putBuffer(A.session.sha1.digest());
    var B = A.entity === pA.ConnectionEnd.client,
      G = A.session.sp,
      Z = 12,
      I = G21,
      Y = B ? "client finished" : "server finished";
    Q = I(G.master_secret, Y, Q.getBytes(), Z);
    var J = KQ.util.createBuffer();
    return J.putByte(pA.HandshakeType.finished), J.putInt24(Q.length()), J.putBuffer(Q), J
  };
  pA.createHeartbeat = function(A, Q, B) {
    if (typeof B > "u") B = Q.length;
    var G = KQ.util.createBuffer();
    G.putByte(A), G.putInt16(B), G.putBytes(Q);
    var Z = G.length(),
      I = Math.max(16, Z - B - 3);
    return G.putBytes(KQ.random.getBytes(I)), G
  };
  pA.queue = function(A, Q) {
    if (!Q) return;
    if (Q.fragment.length() === 0) {
      if (Q.type === pA.ContentType.handshake || Q.type === pA.ContentType.alert || Q.type === pA.ContentType.change_cipher_spec) return
    }
    if (Q.type === pA.ContentType.handshake) {
      var B = Q.fragment.bytes();
      A.session.md5.update(B), A.session.sha1.update(B), B = null
    }
    var G;
    if (Q.fragment.length() <= pA.MaxFragment) G = [Q];
    else {
      G = [];
      var Z = Q.fragment.bytes();
      while (Z.length > pA.MaxFragment) G.push(pA.createRecord(A, {
        type: Q.type,
        data: KQ.util.createBuffer(Z.slice(0, pA.MaxFragment))
      })), Z = Z.slice(pA.MaxFragment);
      if (Z.length > 0) G.push(pA.createRecord(A, {
        type: Q.type,
        data: KQ.util.createBuffer(Z)
      }))
    }
    for (var I = 0; I < G.length && !A.fail; ++I) {
      var Y = G[I],
        J = A.state.current.write;
      if (J.update(A, Y)) A.records.push(Y)
    }
  };
  pA.flush = function(A) {
    for (var Q = 0; Q < A.records.length; ++Q) {
      var B = A.records[Q];
      A.tlsData.putByte(B.type), A.tlsData.putByte(B.version.major), A.tlsData.putByte(B.version.minor), A.tlsData.putInt16(B.fragment.length()), A.tlsData.putBuffer(A.records[Q].fragment)
    }
    return A.records = [], A.tlsDataReady(A)
  };
  var nA0 = function(A) {
      switch (A) {
        case !0:
          return !0;
        case KQ.pki.certificateError.bad_certificate:
          return pA.Alert.Description.bad_certificate;
        case KQ.pki.certificateError.unsupported_certificate:
          return pA.Alert.Description.unsupported_certificate;
        case KQ.pki.certificateError.certificate_revoked:
          return pA.Alert.Description.certificate_revoked;
        case KQ.pki.certificateError.certificate_expired:
          return pA.Alert.Description.certificate_expired;
        case KQ.pki.certificateError.certificate_unknown:
          return pA.Alert.Description.certificate_unknown;
        case KQ.pki.certificateError.unknown_ca:
          return pA.Alert.Description.unknown_ca;
        default:
          return pA.Alert.Description.bad_certificate
      }
    },
    FI5 = function(A) {
      switch (A) {
        case !0:
          return !0;
        case pA.Alert.Description.bad_certificate:
          return KQ.pki.certificateError.bad_certificate;
        case pA.Alert.Description.unsupported_certificate:
          return KQ.pki.certificateError.unsupported_certificate;
        case pA.Alert.Description.certificate_revoked:
          return KQ.pki.certificateError.certificate_revoked;
        case pA.Alert.Description.certificate_expired:
          return KQ.pki.certificateError.certificate_expired;
        case pA.Alert.Description.certificate_unknown:
          return KQ.pki.certificateError.certificate_unknown;
        case pA.Alert.Description.unknown_ca:
          return KQ.pki.certificateError.unknown_ca;
        default:
          return KQ.pki.certificateError.bad_certificate
      }
    };
  pA.verifyCertificateChain = function(A, Q) {
    try {
      var B = {};
      for (var G in A.verifyOptions) B[G] = A.verifyOptions[G];
      B.verify = function(I, Y, J) {
        var W = nA0(I),
          X = A.verify(A, I, Y, J);
        if (X !== !0) {
          if (typeof X === "object" && !KQ.util.isArray(X)) {
            var V = Error("The application rejected the certificate.");
            if (V.send = !0, V.alert = {
                level: pA.Alert.Level.fatal,
                description: pA.Alert.Description.bad_certificate
              }, X.message) V.message = X.message;
            if (X.alert) V.alert.description = X.alert;
            throw V
          }
          if (X !== I) X = FI5(X)
        }
        return X
      }, KQ.pki.verifyCertificateChain(A.caStore, Q, B)
    } catch (I) {
      var Z = I;
      if (typeof Z !== "object" || KQ.util.isArray(Z)) Z = {
        send: !0,
        alert: {
          level: pA.Alert.Level.fatal,
          description: nA0(I)
        }
      };
      if (!("send" in Z)) Z.send = !0;
      if (!("alert" in Z)) Z.alert = {
        level: pA.Alert.Level.fatal,
        description: nA0(Z.error)
      };
      A.error(A, Z)
    }
    return !A.fail
  };
  pA.createSessionCache = function(A, Q) {
    var B = null;
    if (A && A.getSession && A.setSession && A.order) B = A;
    else {
      B = {}, B.cache = A || {}, B.capacity = Math.max(Q || 100, 1), B.order = [];
      for (var G in A)
        if (B.order.length <= Q) B.order.push(G);
        else delete A[G];
      B.getSession = function(Z) {
        var I = null,
          Y = null;
        if (Z) Y = KQ.util.bytesToHex(Z);
        else if (B.order.length > 0) Y = B.order[0];
        if (Y !== null && Y in B.cache) {
          I = B.cache[Y], delete B.cache[Y];
          for (var J in B.order)
            if (B.order[J] === Y) {
              B.order.splice(J, 1);
              break
            }
        }
        return I
      }, B.setSession = function(Z, I) {
        if (B.order.length === B.capacity) {
          var Y = B.order.shift();
          delete B.cache[Y]
        }
        var Y = KQ.util.bytesToHex(Z);
        B.order.push(Y), B.cache[Y] = I
      }
    }
    return B
  };
  pA.createConnection = function(A) {
    var Q = null;
    if (A.caStore)
      if (KQ.util.isArray(A.caStore)) Q = KQ.pki.createCaStore(A.caStore);
      else Q = A.caStore;
    else Q = KQ.pki.createCaStore();
    var B = A.cipherSuites || null;
    if (B === null) {
      B = [];
      for (var G in pA.CipherSuites) B.push(pA.CipherSuites[G])
    }
    var Z = A.server ? pA.ConnectionEnd.server : pA.ConnectionEnd.client,
      I = A.sessionCache ? pA.createSessionCache(A.sessionCache) : null,
      Y = {
        version: {
          major: pA.Version.major,
          minor: pA.Version.minor
        },
        entity: Z,
        sessionId: A.sessionId,
        caStore: Q,
        sessionCache: I,
        cipherSuites: B,
        connected: A.connected,
        virtualHost: A.virtualHost || null,
        verifyClient: A.verifyClient || !1,
        verify: A.verify || function(V, F, K, D) {
          return F
        },
        verifyOptions: A.verifyOptions || {},
        getCertificate: A.getCertificate || null,
        getPrivateKey: A.getPrivateKey || null,
        getSignature: A.getSignature || null,
        input: KQ.util.createBuffer(),
        tlsData: KQ.util.createBuffer(),
        data: KQ.util.createBuffer(),
        tlsDataReady: A.tlsDataReady,
        dataReady: A.dataReady,
        heartbeatReceived: A.heartbeatReceived,
        closed: A.closed,
        error: function(V, F) {
          if (F.origin = F.origin || (V.entity === pA.ConnectionEnd.client ? "client" : "server"), F.send) pA.queue(V, pA.createAlert(V, F.alert)), pA.flush(V);
          var K = F.fatal !== !1;
          if (K) V.fail = !0;
          if (A.error(V, F), K) V.close(!1)
        },
        deflate: A.deflate || null,
        inflate: A.inflate || null
      };
    Y.reset = function(V) {
      Y.version = {
        major: pA.Version.major,
        minor: pA.Version.minor
      }, Y.record = null, Y.session = null, Y.peerCertificate = null, Y.state = {
        pending: null,
        current: null
      }, Y.expect = Y.entity === pA.ConnectionEnd.client ? sZ5 : BI5, Y.fragmented = null, Y.records = [], Y.open = !1, Y.handshakes = 0, Y.handshaking = !1, Y.isConnected = !1, Y.fail = !(V || typeof V > "u"), Y.input.clear(), Y.tlsData.clear(), Y.data.clear(), Y.state.current = pA.createConnectionState(Y)
    }, Y.reset();
    var J = function(V, F) {
        var K = F.type - pA.ContentType.change_cipher_spec,
          D = rA0[V.entity][V.expect];
        if (K in D) D[K](V, F);
        else pA.handleUnexpected(V, F)
      },
      W = function(V) {
        var F = 0,
          K = V.input,
          D = K.length();
        if (D < 5) F = 5 - D;
        else {
          V.record = {
            type: K.getByte(),
            version: {
              major: K.getByte(),
              minor: K.getByte()
            },
            length: K.getInt16(),
            fragment: KQ.util.createBuffer(),
            ready: !1
          };
          var H = V.record.version.major === V.version.major;
          if (H && V.session && V.session.version) H = V.record.version.minor === V.version.minor;
          if (!H) V.error(V, {
            message: "Incompatible TLS version.",
            send: !0,
            alert: {
              level: pA.Alert.Level.fatal,
              description: pA.Alert.Description.protocol_version
            }
          })
        }
        return F
      },
      X = function(V) {
        var F = 0,
          K = V.input,
          D = K.length();
        if (D < V.record.length) F = V.record.length - D;
        else {
          V.record.fragment.putBytes(K.getBytes(V.record.length)), K.compact();
          var H = V.state.current.read;
          if (H.update(V, V.record)) {
            if (V.fragmented !== null)
              if (V.fragmented.type === V.record.type) V.fragmented.fragment.putBuffer(V.record.fragment), V.record = V.fragmented;
              else V.error(V, {
                message: "Invalid fragmented record.",
                send: !0,
                alert: {
                  level: pA.Alert.Level.fatal,
                  description: pA.Alert.Description.unexpected_message
                }
              });
            V.record.ready = !0
          }
        }
        return F
      };
    return Y.handshake = function(V) {
      if (Y.entity !== pA.ConnectionEnd.client) Y.error(Y, {
        message: "Cannot initiate handshake as a server.",
        fatal: !1
      });
      else if (Y.handshaking) Y.error(Y, {
        message: "Handshake already in progress.",
        fatal: !1
      });
      else {
        if (Y.fail && !Y.open && Y.handshakes === 0) Y.fail = !1;
        Y.handshaking = !0, V = V || "";
        var F = null;
        if (V.length > 0) {
          if (Y.sessionCache) F = Y.sessionCache.getSession(V);
          if (F === null) V = ""
        }
        if (V.length === 0 && Y.sessionCache) {
          if (F = Y.sessionCache.getSession(), F !== null) V = F.id
        }
        if (Y.session = {
            id: V,
            version: null,
            cipherSuite: null,
            compressionMethod: null,
            serverCertificate: null,
            certificateRequest: null,
            clientCertificate: null,
            sp: {},
            md5: KQ.md.md5.create(),
            sha1: KQ.md.sha1.create()
          }, F) Y.version = F.version, Y.session.sp = F.sp;
        Y.session.sp.client_random = pA.createRandom().getBytes(), Y.open = !0, pA.queue(Y, pA.createRecord(Y, {
          type: pA.ContentType.handshake,
          data: pA.createClientHello(Y)
        })), pA.flush(Y)
      }
    }, Y.process = function(V) {
      var F = 0;
      if (V) Y.input.putBytes(V);
      if (!Y.fail) {
        if (Y.record !== null && Y.record.ready && Y.record.fragment.isEmpty()) Y.record = null;
        if (Y.record === null) F = W(Y);
        if (!Y.fail && Y.record !== null && !Y.record.ready) F = X(Y);
        if (!Y.fail && Y.record !== null && Y.record.ready) J(Y, Y.record)
      }
      return F
    }, Y.prepare = function(V) {
      return pA.queue(Y, pA.createRecord(Y, {
        type: pA.ContentType.application_data,
        data: KQ.util.createBuffer(V)
      })), pA.flush(Y)
    }, Y.prepareHeartbeatRequest = function(V, F) {
      if (V instanceof KQ.util.ByteBuffer) V = V.bytes();
      if (typeof F > "u") F = V.length;
      return Y.expectedHeartbeatPayload = V, pA.queue(Y, pA.createRecord(Y, {
        type: pA.ContentType.heartbeat,
        data: pA.createHeartbeat(pA.HeartbeatMessageType.heartbeat_request, V, F)
      })), pA.flush(Y)
    }, Y.close = function(V) {
      if (!Y.fail && Y.sessionCache && Y.session) {
        var F = {
          id: Y.session.id,
          version: Y.session.version,
          sp: Y.session.sp
        };
        F.sp.keys = null, Y.sessionCache.setSession(F.id, F)
      }
      if (Y.open) {
        if (Y.open = !1, Y.input.clear(), Y.isConnected || Y.handshaking) Y.isConnected = Y.handshaking = !1, pA.queue(Y, pA.createAlert(Y, {
          level: pA.Alert.Level.warning,
          description: pA.Alert.Description.close_notify
        })), pA.flush(Y);
        Y.closed(Y)
      }
      Y.reset(V)
    }, Y
  };
  M52.exports = KQ.tls = KQ.tls || {};
  for (rLA in pA)
    if (typeof pA[rLA] !== "function") KQ.tls[rLA] = pA[rLA];
  var rLA;
  KQ.tls.prf_tls1 = G21;
  KQ.tls.hmac_sha1 = iZ5;
  KQ.tls.createSessionCache = pA.createSessionCache;
  KQ.tls.createConnection = pA.createConnection
})
// @from(Start 9411391, End 9415028)
T52 = z((zjG, R52) => {
  var Fi = B6();
  Zi();
  oA0();
  var aM = R52.exports = Fi.tls;
  aM.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA = {
    id: [0, 47],
    name: "TLS_RSA_WITH_AES_128_CBC_SHA",
    initSecurityParameters: function(A) {
      A.bulk_cipher_algorithm = aM.BulkCipherAlgorithm.aes, A.cipher_type = aM.CipherType.block, A.enc_key_length = 16, A.block_length = 16, A.fixed_iv_length = 16, A.record_iv_length = 16, A.mac_algorithm = aM.MACAlgorithm.hmac_sha1, A.mac_length = 20, A.mac_key_length = 20
    },
    initConnectionState: O52
  };
  aM.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA = {
    id: [0, 53],
    name: "TLS_RSA_WITH_AES_256_CBC_SHA",
    initSecurityParameters: function(A) {
      A.bulk_cipher_algorithm = aM.BulkCipherAlgorithm.aes, A.cipher_type = aM.CipherType.block, A.enc_key_length = 32, A.block_length = 16, A.fixed_iv_length = 16, A.record_iv_length = 16, A.mac_algorithm = aM.MACAlgorithm.hmac_sha1, A.mac_length = 20, A.mac_key_length = 20
    },
    initConnectionState: O52
  };

  function O52(A, Q, B) {
    var G = Q.entity === Fi.tls.ConnectionEnd.client;
    A.read.cipherState = {
      init: !1,
      cipher: Fi.cipher.createDecipher("AES-CBC", G ? B.keys.server_write_key : B.keys.client_write_key),
      iv: G ? B.keys.server_write_IV : B.keys.client_write_IV
    }, A.write.cipherState = {
      init: !1,
      cipher: Fi.cipher.createCipher("AES-CBC", G ? B.keys.client_write_key : B.keys.server_write_key),
      iv: G ? B.keys.client_write_IV : B.keys.server_write_IV
    }, A.read.cipherFunction = CI5, A.write.cipherFunction = KI5, A.read.macLength = A.write.macLength = B.mac_length, A.read.macFunction = A.write.macFunction = aM.hmac_sha1
  }

  function KI5(A, Q) {
    var B = !1,
      G = Q.macFunction(Q.macKey, Q.sequenceNumber, A);
    A.fragment.putBytes(G), Q.updateSequenceNumber();
    var Z;
    if (A.version.minor === aM.Versions.TLS_1_0.minor) Z = Q.cipherState.init ? null : Q.cipherState.iv;
    else Z = Fi.random.getBytesSync(16);
    Q.cipherState.init = !0;
    var I = Q.cipherState.cipher;
    if (I.start({
        iv: Z
      }), A.version.minor >= aM.Versions.TLS_1_1.minor) I.output.putBytes(Z);
    if (I.update(A.fragment), I.finish(DI5)) A.fragment = I.output, A.length = A.fragment.length(), B = !0;
    return B
  }

  function DI5(A, Q, B) {
    if (!B) {
      var G = A - Q.length() % A;
      Q.fillWithByte(G - 1, G)
    }
    return !0
  }

  function HI5(A, Q, B) {
    var G = !0;
    if (B) {
      var Z = Q.length(),
        I = Q.last();
      for (var Y = Z - 1 - I; Y < Z - 1; ++Y) G = G && Q.at(Y) == I;
      if (G) Q.truncate(I + 1)
    }
    return G
  }

  function CI5(A, Q) {
    var B = !1,
      G;
    if (A.version.minor === aM.Versions.TLS_1_0.minor) G = Q.cipherState.init ? null : Q.cipherState.iv;
    else G = A.fragment.getBytes(16);
    Q.cipherState.init = !0;
    var Z = Q.cipherState.cipher;
    Z.start({
      iv: G
    }), Z.update(A.fragment), B = Z.finish(HI5);
    var I = Q.macLength,
      Y = Fi.random.getBytesSync(I),
      J = Z.output.length();
    if (J >= I) A.fragment = Z.output.getBytes(J - I), Y = Z.output.getBytes(I);
    else A.fragment = Z.output.getBytes();
    A.fragment = Fi.util.createBuffer(A.fragment), A.length = A.fragment.length();
    var W = Q.macFunction(Q.macKey, Q.sequenceNumber, A);
    return Q.updateSequenceNumber(), B = EI5(Q.macKey, Y, W) && B, B
  }

  function EI5(A, Q, B) {
    var G = Fi.hmac.create();
    return G.start("SHA1", A), G.update(Q), Q = G.digest().getBytes(), G.start(null, null), G.update(B), B = G.digest().getBytes(), Q === B
  }
})
// @from(Start 9415034, End 9424818)
A10 = z((UjG, _52) => {
  var wI = B6();
  Pk();
  x3();
  var oLA = _52.exports = wI.sha512 = wI.sha512 || {};
  wI.md.sha512 = wI.md.algorithms.sha512 = oLA;
  var j52 = wI.sha384 = wI.sha512.sha384 = wI.sha512.sha384 || {};
  j52.create = function() {
    return oLA.create("SHA-384")
  };
  wI.md.sha384 = wI.md.algorithms.sha384 = j52;
  wI.sha512.sha256 = wI.sha512.sha256 || {
    create: function() {
      return oLA.create("SHA-512/256")
    }
  };
  wI.md["sha512/256"] = wI.md.algorithms["sha512/256"] = wI.sha512.sha256;
  wI.sha512.sha224 = wI.sha512.sha224 || {
    create: function() {
      return oLA.create("SHA-512/224")
    }
  };
  wI.md["sha512/224"] = wI.md.algorithms["sha512/224"] = wI.sha512.sha224;
  oLA.create = function(A) {
    if (!S52) zI5();
    if (typeof A > "u") A = "SHA-512";
    if (!(A in W1A)) throw Error("Invalid SHA-512 algorithm: " + A);
    var Q = W1A[A],
      B = null,
      G = wI.util.createBuffer(),
      Z = Array(80);
    for (var I = 0; I < 80; ++I) Z[I] = [, , ];
    var Y = 64;
    switch (A) {
      case "SHA-384":
        Y = 48;
        break;
      case "SHA-512/256":
        Y = 32;
        break;
      case "SHA-512/224":
        Y = 28;
        break
    }
    var J = {
      algorithm: A.replace("-", "").toLowerCase(),
      blockLength: 128,
      digestLength: Y,
      messageLength: 0,
      fullMessageLength: null,
      messageLengthSize: 16
    };
    return J.start = function() {
      J.messageLength = 0, J.fullMessageLength = J.messageLength128 = [];
      var W = J.messageLengthSize / 4;
      for (var X = 0; X < W; ++X) J.fullMessageLength.push(0);
      G = wI.util.createBuffer(), B = Array(Q.length);
      for (var X = 0; X < Q.length; ++X) B[X] = Q[X].slice(0);
      return J
    }, J.start(), J.update = function(W, X) {
      if (X === "utf8") W = wI.util.encodeUtf8(W);
      var V = W.length;
      J.messageLength += V, V = [V / 4294967296 >>> 0, V >>> 0];
      for (var F = J.fullMessageLength.length - 1; F >= 0; --F) J.fullMessageLength[F] += V[1], V[1] = V[0] + (J.fullMessageLength[F] / 4294967296 >>> 0), J.fullMessageLength[F] = J.fullMessageLength[F] >>> 0, V[0] = V[1] / 4294967296 >>> 0;
      if (G.putBytes(W), P52(B, Z, G), G.read > 2048 || G.length() === 0) G.compact();
      return J
    }, J.digest = function() {
      var W = wI.util.createBuffer();
      W.putBytes(G.bytes());
      var X = J.fullMessageLength[J.fullMessageLength.length - 1] + J.messageLengthSize,
        V = X & J.blockLength - 1;
      W.putBytes(tA0.substr(0, J.blockLength - V));
      var F, K, D = J.fullMessageLength[0] * 8;
      for (var H = 0; H < J.fullMessageLength.length - 1; ++H) F = J.fullMessageLength[H + 1] * 8, K = F / 4294967296 >>> 0, D += K, W.putInt32(D >>> 0), D = F >>> 0;
      W.putInt32(D);
      var C = Array(B.length);
      for (var H = 0; H < B.length; ++H) C[H] = B[H].slice(0);
      P52(C, Z, W);
      var E = wI.util.createBuffer(),
        U;
      if (A === "SHA-512") U = C.length;
      else if (A === "SHA-384") U = C.length - 2;
      else U = C.length - 4;
      for (var H = 0; H < U; ++H)
        if (E.putInt32(C[H][0]), H !== U - 1 || A !== "SHA-512/224") E.putInt32(C[H][1]);
      return E
    }, J
  };
  var tA0 = null,
    S52 = !1,
    eA0 = null,
    W1A = null;

  function zI5() {
    tA0 = String.fromCharCode(128), tA0 += wI.util.fillString(String.fromCharCode(0), 128), eA0 = [
      [1116352408, 3609767458],
      [1899447441, 602891725],
      [3049323471, 3964484399],
      [3921009573, 2173295548],
      [961987163, 4081628472],
      [1508970993, 3053834265],
      [2453635748, 2937671579],
      [2870763221, 3664609560],
      [3624381080, 2734883394],
      [310598401, 1164996542],
      [607225278, 1323610764],
      [1426881987, 3590304994],
      [1925078388, 4068182383],
      [2162078206, 991336113],
      [2614888103, 633803317],
      [3248222580, 3479774868],
      [3835390401, 2666613458],
      [4022224774, 944711139],
      [264347078, 2341262773],
      [604807628, 2007800933],
      [770255983, 1495990901],
      [1249150122, 1856431235],
      [1555081692, 3175218132],
      [1996064986, 2198950837],
      [2554220882, 3999719339],
      [2821834349, 766784016],
      [2952996808, 2566594879],
      [3210313671, 3203337956],
      [3336571891, 1034457026],
      [3584528711, 2466948901],
      [113926993, 3758326383],
      [338241895, 168717936],
      [666307205, 1188179964],
      [773529912, 1546045734],
      [1294757372, 1522805485],
      [1396182291, 2643833823],
      [1695183700, 2343527390],
      [1986661051, 1014477480],
      [2177026350, 1206759142],
      [2456956037, 344077627],
      [2730485921, 1290863460],
      [2820302411, 3158454273],
      [3259730800, 3505952657],
      [3345764771, 106217008],
      [3516065817, 3606008344],
      [3600352804, 1432725776],
      [4094571909, 1467031594],
      [275423344, 851169720],
      [430227734, 3100823752],
      [506948616, 1363258195],
      [659060556, 3750685593],
      [883997877, 3785050280],
      [958139571, 3318307427],
      [1322822218, 3812723403],
      [1537002063, 2003034995],
      [1747873779, 3602036899],
      [1955562222, 1575990012],
      [2024104815, 1125592928],
      [2227730452, 2716904306],
      [2361852424, 442776044],
      [2428436474, 593698344],
      [2756734187, 3733110249],
      [3204031479, 2999351573],
      [3329325298, 3815920427],
      [3391569614, 3928383900],
      [3515267271, 566280711],
      [3940187606, 3454069534],
      [4118630271, 4000239992],
      [116418474, 1914138554],
      [174292421, 2731055270],
      [289380356, 3203993006],
      [460393269, 320620315],
      [685471733, 587496836],
      [852142971, 1086792851],
      [1017036298, 365543100],
      [1126000580, 2618297676],
      [1288033470, 3409855158],
      [1501505948, 4234509866],
      [1607167915, 987167468],
      [1816402316, 1246189591]
    ], W1A = {}, W1A["SHA-512"] = [
      [1779033703, 4089235720],
      [3144134277, 2227873595],
      [1013904242, 4271175723],
      [2773480762, 1595750129],
      [1359893119, 2917565137],
      [2600822924, 725511199],
      [528734635, 4215389547],
      [1541459225, 327033209]
    ], W1A["SHA-384"] = [
      [3418070365, 3238371032],
      [1654270250, 914150663],
      [2438529370, 812702999],
      [355462360, 4144912697],
      [1731405415, 4290775857],
      [2394180231, 1750603025],
      [3675008525, 1694076839],
      [1203062813, 3204075428]
    ], W1A["SHA-512/256"] = [
      [573645204, 4230739756],
      [2673172387, 3360449730],
      [596883563, 1867755857],
      [2520282905, 1497426621],
      [2519219938, 2827943907],
      [3193839141, 1401305490],
      [721525244, 746961066],
      [246885852, 2177182882]
    ], W1A["SHA-512/224"] = [
      [2352822216, 424955298],
      [1944164710, 2312950998],
      [502970286, 855612546],
      [1738396948, 1479516111],
      [258812777, 2077511080],
      [2011393907, 79989058],
      [1067287976, 1780299464],
      [286451373, 2446758561]
    ], S52 = !0
  }

  function P52(A, Q, B) {
    var G, Z, I, Y, J, W, X, V, F, K, D, H, C, E, U, q, w, N, R, T, y, v, x, p, u, e, l, k, m, o, IA, FA, zA, NA, OA, mA = B.length();
    while (mA >= 128) {
      for (m = 0; m < 16; ++m) Q[m][0] = B.getInt32() >>> 0, Q[m][1] = B.getInt32() >>> 0;
      for (; m < 80; ++m) FA = Q[m - 2], o = FA[0], IA = FA[1], G = ((o >>> 19 | IA << 13) ^ (IA >>> 29 | o << 3) ^ o >>> 6) >>> 0, Z = ((o << 13 | IA >>> 19) ^ (IA << 3 | o >>> 29) ^ (o << 26 | IA >>> 6)) >>> 0, NA = Q[m - 15], o = NA[0], IA = NA[1], I = ((o >>> 1 | IA << 31) ^ (o >>> 8 | IA << 24) ^ o >>> 7) >>> 0, Y = ((o << 31 | IA >>> 1) ^ (o << 24 | IA >>> 8) ^ (o << 25 | IA >>> 7)) >>> 0, zA = Q[m - 7], OA = Q[m - 16], IA = Z + zA[1] + Y + OA[1], Q[m][0] = G + zA[0] + I + OA[0] + (IA / 4294967296 >>> 0) >>> 0, Q[m][1] = IA >>> 0;
      C = A[0][0], E = A[0][1], U = A[1][0], q = A[1][1], w = A[2][0], N = A[2][1], R = A[3][0], T = A[3][1], y = A[4][0], v = A[4][1], x = A[5][0], p = A[5][1], u = A[6][0], e = A[6][1], l = A[7][0], k = A[7][1];
      for (m = 0; m < 80; ++m) X = ((y >>> 14 | v << 18) ^ (y >>> 18 | v << 14) ^ (v >>> 9 | y << 23)) >>> 0, V = ((y << 18 | v >>> 14) ^ (y << 14 | v >>> 18) ^ (v << 23 | y >>> 9)) >>> 0, F = (u ^ y & (x ^ u)) >>> 0, K = (e ^ v & (p ^ e)) >>> 0, J = ((C >>> 28 | E << 4) ^ (E >>> 2 | C << 30) ^ (E >>> 7 | C << 25)) >>> 0, W = ((C << 4 | E >>> 28) ^ (E << 30 | C >>> 2) ^ (E << 25 | C >>> 7)) >>> 0, D = (C & U | w & (C ^ U)) >>> 0, H = (E & q | N & (E ^ q)) >>> 0, IA = k + V + K + eA0[m][1] + Q[m][1], G = l + X + F + eA0[m][0] + Q[m][0] + (IA / 4294967296 >>> 0) >>> 0, Z = IA >>> 0, IA = W + H, I = J + D + (IA / 4294967296 >>> 0) >>> 0, Y = IA >>> 0, l = u, k = e, u = x, e = p, x = y, p = v, IA = T + Z, y = R + G + (IA / 4294967296 >>> 0) >>> 0, v = IA >>> 0, R = w, T = N, w = U, N = q, U = C, q = E, IA = Z + Y, C = G + I + (IA / 4294967296 >>> 0) >>> 0, E = IA >>> 0;
      IA = A[0][1] + E, A[0][0] = A[0][0] + C + (IA / 4294967296 >>> 0) >>> 0, A[0][1] = IA >>> 0, IA = A[1][1] + q, A[1][0] = A[1][0] + U + (IA / 4294967296 >>> 0) >>> 0, A[1][1] = IA >>> 0, IA = A[2][1] + N, A[2][0] = A[2][0] + w + (IA / 4294967296 >>> 0) >>> 0, A[2][1] = IA >>> 0, IA = A[3][1] + T, A[3][0] = A[3][0] + R + (IA / 4294967296 >>> 0) >>> 0, A[3][1] = IA >>> 0, IA = A[4][1] + v, A[4][0] = A[4][0] + y + (IA / 4294967296 >>> 0) >>> 0, A[4][1] = IA >>> 0, IA = A[5][1] + p, A[5][0] = A[5][0] + x + (IA / 4294967296 >>> 0) >>> 0, A[5][1] = IA >>> 0, IA = A[6][1] + e, A[6][0] = A[6][0] + u + (IA / 4294967296 >>> 0) >>> 0, A[6][1] = IA >>> 0, IA = A[7][1] + k, A[7][0] = A[7][0] + l + (IA / 4294967296 >>> 0) >>> 0, A[7][1] = IA >>> 0, mA -= 128
    }
  }
})
// @from(Start 9424824, End 9426440)
k52 = z(($I5) => {
  var UI5 = B6();
  GP();
  var eF = UI5.asn1;
  $I5.privateKeyValidator = {
    name: "PrivateKeyInfo",
    tagClass: eF.Class.UNIVERSAL,
    type: eF.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "PrivateKeyInfo.version",
      tagClass: eF.Class.UNIVERSAL,
      type: eF.Type.INTEGER,
      constructed: !1,
      capture: "privateKeyVersion"
    }, {
      name: "PrivateKeyInfo.privateKeyAlgorithm",
      tagClass: eF.Class.UNIVERSAL,
      type: eF.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "AlgorithmIdentifier.algorithm",
        tagClass: eF.Class.UNIVERSAL,
        type: eF.Type.OID,
        constructed: !1,
        capture: "privateKeyOid"
      }]
    }, {
      name: "PrivateKeyInfo",
      tagClass: eF.Class.UNIVERSAL,
      type: eF.Type.OCTETSTRING,
      constructed: !1,
      capture: "privateKey"
    }]
  };
  $I5.publicKeyValidator = {
    name: "SubjectPublicKeyInfo",
    tagClass: eF.Class.UNIVERSAL,
    type: eF.Type.SEQUENCE,
    constructed: !0,
    captureAsn1: "subjectPublicKeyInfo",
    value: [{
      name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
      tagClass: eF.Class.UNIVERSAL,
      type: eF.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "AlgorithmIdentifier.algorithm",
        tagClass: eF.Class.UNIVERSAL,
        type: eF.Type.OID,
        constructed: !1,
        capture: "publicKeyOid"
      }]
    }, {
      tagClass: eF.Class.UNIVERSAL,
      type: eF.Type.BITSTRING,
      constructed: !1,
      composed: !0,
      captureBitStringValue: "ed25519PublicKey"
    }]
  }
})
// @from(Start 9426446, End 9445661)
p52 = z((wjG, c52) => {
  var xD = B6();
  iLA();
  cM();
  A10();
  x3();
  var f52 = k52(),
    NI5 = f52.publicKeyValidator,
    LI5 = f52.privateKeyValidator;
  if (typeof G10 > "u") G10 = xD.jsbn.BigInteger;
  var G10, Z10 = xD.util.ByteBuffer,
    iU = typeof Buffer > "u" ? Uint8Array : Buffer;
  xD.pki = xD.pki || {};
  c52.exports = xD.pki.ed25519 = xD.ed25519 = xD.ed25519 || {};
  var Y5 = xD.ed25519;
  Y5.constants = {};
  Y5.constants.PUBLIC_KEY_BYTE_LENGTH = 32;
  Y5.constants.PRIVATE_KEY_BYTE_LENGTH = 64;
  Y5.constants.SEED_BYTE_LENGTH = 32;
  Y5.constants.SIGN_BYTE_LENGTH = 64;
  Y5.constants.HASH_BYTE_LENGTH = 64;
  Y5.generateKeyPair = function(A) {
    A = A || {};
    var Q = A.seed;
    if (Q === void 0) Q = xD.random.getBytesSync(Y5.constants.SEED_BYTE_LENGTH);
    else if (typeof Q === "string") {
      if (Q.length !== Y5.constants.SEED_BYTE_LENGTH) throw TypeError('"seed" must be ' + Y5.constants.SEED_BYTE_LENGTH + " bytes in length.")
    } else if (!(Q instanceof Uint8Array)) throw TypeError('"seed" must be a node.js Buffer, Uint8Array, or a binary string.');
    Q = Eh({
      message: Q,
      encoding: "binary"
    });
    var B = new iU(Y5.constants.PUBLIC_KEY_BYTE_LENGTH),
      G = new iU(Y5.constants.PRIVATE_KEY_BYTE_LENGTH);
    for (var Z = 0; Z < 32; ++Z) G[Z] = Q[Z];
    return TI5(B, G), {
      publicKey: B,
      privateKey: G
    }
  };
  Y5.privateKeyFromAsn1 = function(A) {
    var Q = {},
      B = [],
      G = xD.asn1.validate(A, LI5, Q, B);
    if (!G) {
      var Z = Error("Invalid Key.");
      throw Z.errors = B, Z
    }
    var I = xD.asn1.derToOid(Q.privateKeyOid),
      Y = xD.oids.EdDSA25519;
    if (I !== Y) throw Error('Invalid OID "' + I + '"; OID must be "' + Y + '".');
    var J = Q.privateKey,
      W = Eh({
        message: xD.asn1.fromDer(J).value,
        encoding: "binary"
      });
    return {
      privateKeyBytes: W
    }
  };
  Y5.publicKeyFromAsn1 = function(A) {
    var Q = {},
      B = [],
      G = xD.asn1.validate(A, NI5, Q, B);
    if (!G) {
      var Z = Error("Invalid Key.");
      throw Z.errors = B, Z
    }
    var I = xD.asn1.derToOid(Q.publicKeyOid),
      Y = xD.oids.EdDSA25519;
    if (I !== Y) throw Error('Invalid OID "' + I + '"; OID must be "' + Y + '".');
    var J = Q.ed25519PublicKey;
    if (J.length !== Y5.constants.PUBLIC_KEY_BYTE_LENGTH) throw Error("Key length is invalid.");
    return Eh({
      message: J,
      encoding: "binary"
    })
  };
  Y5.publicKeyFromPrivateKey = function(A) {
    A = A || {};
    var Q = Eh({
      message: A.privateKey,
      encoding: "binary"
    });
    if (Q.length !== Y5.constants.PRIVATE_KEY_BYTE_LENGTH) throw TypeError('"options.privateKey" must have a byte length of ' + Y5.constants.PRIVATE_KEY_BYTE_LENGTH);
    var B = new iU(Y5.constants.PUBLIC_KEY_BYTE_LENGTH);
    for (var G = 0; G < B.length; ++G) B[G] = Q[32 + G];
    return B
  };
  Y5.sign = function(A) {
    A = A || {};
    var Q = Eh(A),
      B = Eh({
        message: A.privateKey,
        encoding: "binary"
      });
    if (B.length === Y5.constants.SEED_BYTE_LENGTH) {
      var G = Y5.generateKeyPair({
        seed: B
      });
      B = G.privateKey
    } else if (B.length !== Y5.constants.PRIVATE_KEY_BYTE_LENGTH) throw TypeError('"options.privateKey" must have a byte length of ' + Y5.constants.SEED_BYTE_LENGTH + " or " + Y5.constants.PRIVATE_KEY_BYTE_LENGTH);
    var Z = new iU(Y5.constants.SIGN_BYTE_LENGTH + Q.length);
    PI5(Z, Q, Q.length, B);
    var I = new iU(Y5.constants.SIGN_BYTE_LENGTH);
    for (var Y = 0; Y < I.length; ++Y) I[Y] = Z[Y];
    return I
  };
  Y5.verify = function(A) {
    A = A || {};
    var Q = Eh(A);
    if (A.signature === void 0) throw TypeError('"options.signature" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a binary string.');
    var B = Eh({
      message: A.signature,
      encoding: "binary"
    });
    if (B.length !== Y5.constants.SIGN_BYTE_LENGTH) throw TypeError('"options.signature" must have a byte length of ' + Y5.constants.SIGN_BYTE_LENGTH);
    var G = Eh({
      message: A.publicKey,
      encoding: "binary"
    });
    if (G.length !== Y5.constants.PUBLIC_KEY_BYTE_LENGTH) throw TypeError('"options.publicKey" must have a byte length of ' + Y5.constants.PUBLIC_KEY_BYTE_LENGTH);
    var Z = new iU(Y5.constants.SIGN_BYTE_LENGTH + Q.length),
      I = new iU(Y5.constants.SIGN_BYTE_LENGTH + Q.length),
      Y;
    for (Y = 0; Y < Y5.constants.SIGN_BYTE_LENGTH; ++Y) Z[Y] = B[Y];
    for (Y = 0; Y < Q.length; ++Y) Z[Y + Y5.constants.SIGN_BYTE_LENGTH] = Q[Y];
    return jI5(I, Z, Z.length, G) >= 0
  };

  function Eh(A) {
    var Q = A.message;
    if (Q instanceof Uint8Array || Q instanceof iU) return Q;
    var B = A.encoding;
    if (Q === void 0)
      if (A.md) Q = A.md.digest().getBytes(), B = "binary";
      else throw TypeError('"options.message" or "options.md" not specified.');
    if (typeof Q === "string" && !B) throw TypeError('"options.encoding" must be "binary" or "utf8".');
    if (typeof Q === "string") {
      if (typeof Buffer < "u") return Buffer.from(Q, B);
      Q = new Z10(Q, B)
    } else if (!(Q instanceof Z10)) throw TypeError('"options.message" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a string with "options.encoding" specifying its encoding.');
    var G = new iU(Q.length());
    for (var Z = 0; Z < G.length; ++Z) G[Z] = Q.at(Z);
    return G
  }
  var I10 = X4(),
    Z21 = X4([1]),
    MI5 = X4([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]),
    OI5 = X4([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]),
    y52 = X4([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]),
    x52 = X4([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]),
    Q10 = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]),
    RI5 = X4([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);

  function tLA(A, Q) {
    var B = xD.md.sha512.create(),
      G = new Z10(A);
    B.update(G.getBytes(Q), "binary");
    var Z = B.digest().getBytes();
    if (typeof Buffer < "u") return Buffer.from(Z, "binary");
    var I = new iU(Y5.constants.HASH_BYTE_LENGTH);
    for (var Y = 0; Y < 64; ++Y) I[Y] = Z.charCodeAt(Y);
    return I
  }

  function TI5(A, Q) {
    var B = [X4(), X4(), X4(), X4()],
      G, Z = tLA(Q, 32);
    Z[0] &= 248, Z[31] &= 127, Z[31] |= 64, X10(B, Z), W10(A, B);
    for (G = 0; G < 32; ++G) Q[G + 32] = A[G];
    return 0
  }

  function PI5(A, Q, B, G) {
    var Z, I, Y = new Float64Array(64),
      J = [X4(), X4(), X4(), X4()],
      W = tLA(G, 32);
    W[0] &= 248, W[31] &= 127, W[31] |= 64;
    var X = B + 64;
    for (Z = 0; Z < B; ++Z) A[64 + Z] = Q[Z];
    for (Z = 0; Z < 32; ++Z) A[32 + Z] = W[32 + Z];
    var V = tLA(A.subarray(32), B + 32);
    Y10(V), X10(J, V), W10(A, J);
    for (Z = 32; Z < 64; ++Z) A[Z] = G[Z];
    var F = tLA(A, B + 64);
    Y10(F);
    for (Z = 32; Z < 64; ++Z) Y[Z] = 0;
    for (Z = 0; Z < 32; ++Z) Y[Z] = V[Z];
    for (Z = 0; Z < 32; ++Z)
      for (I = 0; I < 32; I++) Y[Z + I] += F[Z] * W[I];
    return h52(A.subarray(32), Y), X
  }

  function jI5(A, Q, B, G) {
    var Z, I, Y = new iU(32),
      J = [X4(), X4(), X4(), X4()],
      W = [X4(), X4(), X4(), X4()];
    if (I = -1, B < 64) return -1;
    if (SI5(W, G)) return -1;
    for (Z = 0; Z < B; ++Z) A[Z] = Q[Z];
    for (Z = 0; Z < 32; ++Z) A[Z + 32] = G[Z];
    var X = tLA(A, B);
    if (Y10(X), m52(J, W, X), X10(W, Q.subarray(32)), J10(J, W), W10(Y, J), B -= 64, g52(Q, 0, Y, 0)) {
      for (Z = 0; Z < B; ++Z) A[Z] = 0;
      return -1
    }
    for (Z = 0; Z < B; ++Z) A[Z] = Q[Z + 64];
    return I = B, I
  }

  function h52(A, Q) {
    var B, G, Z, I;
    for (G = 63; G >= 32; --G) {
      B = 0;
      for (Z = G - 32, I = G - 12; Z < I; ++Z) Q[Z] += B - 16 * Q[G] * Q10[Z - (G - 32)], B = Q[Z] + 128 >> 8, Q[Z] -= B * 256;
      Q[Z] += B, Q[G] = 0
    }
    B = 0;
    for (Z = 0; Z < 32; ++Z) Q[Z] += B - (Q[31] >> 4) * Q10[Z], B = Q[Z] >> 8, Q[Z] &= 255;
    for (Z = 0; Z < 32; ++Z) Q[Z] -= B * Q10[Z];
    for (G = 0; G < 32; ++G) Q[G + 1] += Q[G] >> 8, A[G] = Q[G] & 255
  }

  function Y10(A) {
    var Q = new Float64Array(64);
    for (var B = 0; B < 64; ++B) Q[B] = A[B], A[B] = 0;
    h52(A, Q)
  }

  function J10(A, Q) {
    var B = X4(),
      G = X4(),
      Z = X4(),
      I = X4(),
      Y = X4(),
      J = X4(),
      W = X4(),
      X = X4(),
      V = X4();
    oIA(B, A[1], A[0]), oIA(V, Q[1], Q[0]), CZ(B, B, V), rIA(G, A[0], A[1]), rIA(V, Q[0], Q[1]), CZ(G, G, V), CZ(Z, A[3], Q[3]), CZ(Z, Z, OI5), CZ(I, A[2], Q[2]), rIA(I, I, I), oIA(Y, G, B), oIA(J, I, Z), rIA(W, I, Z), rIA(X, G, B), CZ(A[0], Y, J), CZ(A[1], X, W), CZ(A[2], W, J), CZ(A[3], Y, X)
  }

  function v52(A, Q, B) {
    for (var G = 0; G < 4; ++G) d52(A[G], Q[G], B)
  }

  function W10(A, Q) {
    var B = X4(),
      G = X4(),
      Z = X4();
    xI5(Z, Q[2]), CZ(B, Q[0], Z), CZ(G, Q[1], Z), I21(A, G), A[31] ^= u52(B) << 7
  }

  function I21(A, Q) {
    var B, G, Z, I = X4(),
      Y = X4();
    for (B = 0; B < 16; ++B) Y[B] = Q[B];
    B10(Y), B10(Y), B10(Y);
    for (G = 0; G < 2; ++G) {
      I[0] = Y[0] - 65517;
      for (B = 1; B < 15; ++B) I[B] = Y[B] - 65535 - (I[B - 1] >> 16 & 1), I[B - 1] &= 65535;
      I[15] = Y[15] - 32767 - (I[14] >> 16 & 1), Z = I[15] >> 16 & 1, I[14] &= 65535, d52(Y, I, 1 - Z)
    }
    for (B = 0; B < 16; B++) A[2 * B] = Y[B] & 255, A[2 * B + 1] = Y[B] >> 8
  }

  function SI5(A, Q) {
    var B = X4(),
      G = X4(),
      Z = X4(),
      I = X4(),
      Y = X4(),
      J = X4(),
      W = X4();
    if (Ki(A[2], Z21), _I5(A[1], Q), X1A(Z, A[1]), CZ(I, Z, MI5), oIA(Z, Z, A[2]), rIA(I, A[2], I), X1A(Y, I), X1A(J, Y), CZ(W, J, Y), CZ(B, W, Z), CZ(B, B, I), kI5(B, B), CZ(B, B, Z), CZ(B, B, I), CZ(B, B, I), CZ(A[0], B, I), X1A(G, A[0]), CZ(G, G, I), b52(G, Z)) CZ(A[0], A[0], RI5);
    if (X1A(G, A[0]), CZ(G, G, I), b52(G, Z)) return -1;
    if (u52(A[0]) === Q[31] >> 7) oIA(A[0], I10, A[0]);
    return CZ(A[3], A[0], A[1]), 0
  }

  function _I5(A, Q) {
    var B;
    for (B = 0; B < 16; ++B) A[B] = Q[2 * B] + (Q[2 * B + 1] << 8);
    A[15] &= 32767
  }

  function kI5(A, Q) {
    var B = X4(),
      G;
    for (G = 0; G < 16; ++G) B[G] = Q[G];
    for (G = 250; G >= 0; --G)
      if (X1A(B, B), G !== 1) CZ(B, B, Q);
    for (G = 0; G < 16; ++G) A[G] = B[G]
  }

  function b52(A, Q) {
    var B = new iU(32),
      G = new iU(32);
    return I21(B, A), I21(G, Q), g52(B, 0, G, 0)
  }

  function g52(A, Q, B, G) {
    return yI5(A, Q, B, G, 32)
  }

  function yI5(A, Q, B, G, Z) {
    var I, Y = 0;
    for (I = 0; I < Z; ++I) Y |= A[Q + I] ^ B[G + I];
    return (1 & Y - 1 >>> 8) - 1
  }

  function u52(A) {
    var Q = new iU(32);
    return I21(Q, A), Q[0] & 1
  }

  function m52(A, Q, B) {
    var G, Z;
    Ki(A[0], I10), Ki(A[1], Z21), Ki(A[2], Z21), Ki(A[3], I10);
    for (Z = 255; Z >= 0; --Z) G = B[Z / 8 | 0] >> (Z & 7) & 1, v52(A, Q, G), J10(Q, A), J10(A, A), v52(A, Q, G)
  }

  function X10(A, Q) {
    var B = [X4(), X4(), X4(), X4()];
    Ki(B[0], y52), Ki(B[1], x52), Ki(B[2], Z21), CZ(B[3], y52, x52), m52(A, B, Q)
  }

  function Ki(A, Q) {
    var B;
    for (B = 0; B < 16; B++) A[B] = Q[B] | 0
  }

  function xI5(A, Q) {
    var B = X4(),
      G;
    for (G = 0; G < 16; ++G) B[G] = Q[G];
    for (G = 253; G >= 0; --G)
      if (X1A(B, B), G !== 2 && G !== 4) CZ(B, B, Q);
    for (G = 0; G < 16; ++G) A[G] = B[G]
  }

  function B10(A) {
    var Q, B, G = 1;
    for (Q = 0; Q < 16; ++Q) B = A[Q] + G + 65535, G = Math.floor(B / 65536), A[Q] = B - G * 65536;
    A[0] += G - 1 + 37 * (G - 1)
  }

  function d52(A, Q, B) {
    var G, Z = ~(B - 1);
    for (var I = 0; I < 16; ++I) G = Z & (A[I] ^ Q[I]), A[I] ^= G, Q[I] ^= G
  }

  function X4(A) {
    var Q, B = new Float64Array(16);
    if (A)
      for (Q = 0; Q < A.length; ++Q) B[Q] = A[Q];
    return B
  }

  function rIA(A, Q, B) {
    for (var G = 0; G < 16; ++G) A[G] = Q[G] + B[G]
  }

  function oIA(A, Q, B) {
    for (var G = 0; G < 16; ++G) A[G] = Q[G] - B[G]
  }

  function X1A(A, Q) {
    CZ(A, Q, Q)
  }

  function CZ(A, Q, B) {
    var G, Z, I = 0,
      Y = 0,
      J = 0,
      W = 0,
      X = 0,
      V = 0,
      F = 0,
      K = 0,
      D = 0,
      H = 0,
      C = 0,
      E = 0,
      U = 0,
      q = 0,
      w = 0,
      N = 0,
      R = 0,
      T = 0,
      y = 0,
      v = 0,
      x = 0,
      p = 0,
      u = 0,
      e = 0,
      l = 0,
      k = 0,
      m = 0,
      o = 0,
      IA = 0,
      FA = 0,
      zA = 0,
      NA = B[0],
      OA = B[1],
      mA = B[2],
      wA = B[3],
      qA = B[4],
      KA = B[5],
      yA = B[6],
      oA = B[7],
      X1 = B[8],
      WA = B[9],
      EA = B[10],
      MA = B[11],
      DA = B[12],
      $A = B[13],
      TA = B[14],
      rA = B[15];
    G = Q[0], I += G * NA, Y += G * OA, J += G * mA, W += G * wA, X += G * qA, V += G * KA, F += G * yA, K += G * oA, D += G * X1, H += G * WA, C += G * EA, E += G * MA, U += G * DA, q += G * $A, w += G * TA, N += G * rA, G = Q[1], Y += G * NA, J += G * OA, W += G * mA, X += G * wA, V += G * qA, F += G * KA, K += G * yA, D += G * oA, H += G * X1, C += G * WA, E += G * EA, U += G * MA, q += G * DA, w += G * $A, N += G * TA, R += G * rA, G = Q[2], J += G * NA, W += G * OA, X += G * mA, V += G * wA, F += G * qA, K += G * KA, D += G * yA, H += G * oA, C += G * X1, E += G * WA, U += G * EA, q += G * MA, w += G * DA, N += G * $A, R += G * TA, T += G * rA, G = Q[3], W += G * NA, X += G * OA, V += G * mA, F += G * wA, K += G * qA, D += G * KA, H += G * yA, C += G * oA, E += G * X1, U += G * WA, q += G * EA, w += G * MA, N += G * DA, R += G * $A, T += G * TA, y += G * rA, G = Q[4], X += G * NA, V += G * OA, F += G * mA, K += G * wA, D += G * qA, H += G * KA, C += G * yA, E += G * oA, U += G * X1, q += G * WA, w += G * EA, N += G * MA, R += G * DA, T += G * $A, y += G * TA, v += G * rA, G = Q[5], V += G * NA, F += G * OA, K += G * mA, D += G * wA, H += G * qA, C += G * KA, E += G * yA, U += G * oA, q += G * X1, w += G * WA, N += G * EA, R += G * MA, T += G * DA, y += G * $A, v += G * TA, x += G * rA, G = Q[6], F += G * NA, K += G * OA, D += G * mA, H += G * wA, C += G * qA, E += G * KA, U += G * yA, q += G * oA, w += G * X1, N += G * WA, R += G * EA, T += G * MA, y += G * DA, v += G * $A, x += G * TA, p += G * rA, G = Q[7], K += G * NA, D += G * OA, H += G * mA, C += G * wA, E += G * qA, U += G * KA, q += G * yA, w += G * oA, N += G * X1, R += G * WA, T += G * EA, y += G * MA, v += G * DA, x += G * $A, p += G * TA, u += G * rA, G = Q[8], D += G * NA, H += G * OA, C += G * mA, E += G * wA, U += G * qA, q += G * KA, w += G * yA, N += G * oA, R += G * X1, T += G * WA, y += G * EA, v += G * MA, x += G * DA, p += G * $A, u += G * TA, e += G * rA, G = Q[9], H += G * NA, C += G * OA, E += G * mA, U += G * wA, q += G * qA, w += G * KA, N += G * yA, R += G * oA, T += G * X1, y += G * WA, v += G * EA, x += G * MA, p += G * DA, u += G * $A, e += G * TA, l += G * rA, G = Q[10], C += G * NA, E += G * OA, U += G * mA, q += G * wA, w += G * qA, N += G * KA, R += G * yA, T += G * oA, y += G * X1, v += G * WA, x += G * EA, p += G * MA, u += G * DA, e += G * $A, l += G * TA, k += G * rA, G = Q[11], E += G * NA, U += G * OA, q += G * mA, w += G * wA, N += G * qA, R += G * KA, T += G * yA, y += G * oA, v += G * X1, x += G * WA, p += G * EA, u += G * MA, e += G * DA, l += G * $A, k += G * TA, m += G * rA, G = Q[12], U += G * NA, q += G * OA, w += G * mA, N += G * wA, R += G * qA, T += G * KA, y += G * yA, v += G * oA, x += G * X1, p += G * WA, u += G * EA, e += G * MA, l += G * DA, k += G * $A, m += G * TA, o += G * rA, G = Q[13], q += G * NA, w += G * OA, N += G * mA, R += G * wA, T += G * qA, y += G * KA, v += G * yA, x += G * oA, p += G * X1, u += G * WA, e += G * EA, l += G * MA, k += G * DA, m += G * $A, o += G * TA, IA += G * rA, G = Q[14], w += G * NA, N += G * OA, R += G * mA, T += G * wA, y += G * qA, v += G * KA, x += G * yA, p += G * oA, u += G * X1, e += G * WA, l += G * EA, k += G * MA, m += G * DA, o += G * $A, IA += G * TA, FA += G * rA, G = Q[15], N += G * NA, R += G * OA, T += G * mA, y += G * wA, v += G * qA, x += G * KA, p += G * yA, u += G * oA, e += G * X1, l += G * WA, k += G * EA, m += G * MA, o += G * DA, IA += G * $A, FA += G * TA, zA += G * rA, I += 38 * R, Y += 38 * T, J += 38 * y, W += 38 * v, X += 38 * x, V += 38 * p, F += 38 * u, K += 38 * e, D += 38 * l, H += 38 * k, C += 38 * m, E += 38 * o, U += 38 * IA, q += 38 * FA, w += 38 * zA, Z = 1, G = I + Z + 65535, Z = Math.floor(G / 65536), I = G - Z * 65536, G = Y + Z + 65535, Z = Math.floor(G / 65536), Y = G - Z * 65536, G = J + Z + 65535, Z = Math.floor(G / 65536), J = G - Z * 65536, G = W + Z + 65535, Z = Math.floor(G / 65536), W = G - Z * 65536, G = X + Z + 65535, Z = Math.floor(G / 65536), X = G - Z * 65536, G = V + Z + 65535, Z = Math.floor(G / 65536), V = G - Z * 65536, G = F + Z + 65535, Z = Math.floor(G / 65536), F = G - Z * 65536, G = K + Z + 65535, Z = Math.floor(G / 65536), K = G - Z * 65536, G = D + Z + 65535, Z = Math.floor(G / 65536), D = G - Z * 65536, G = H + Z + 65535, Z = Math.floor(G / 65536), H = G - Z * 65536, G = C + Z + 65535, Z = Math.floor(G / 65536), C = G - Z * 65536, G = E + Z + 65535, Z = Math.floor(G / 65536), E = G - Z * 65536, G = U + Z + 65535, Z = Math.floor(G / 65536), U = G - Z * 65536, G = q + Z + 65535, Z = Math.floor(G / 65536), q = G - Z * 65536, G = w + Z + 65535, Z = Math.floor(G / 65536), w = G - Z * 65536, G = N + Z + 65535, Z = Math.floor(G / 65536), N = G - Z * 65536, I += Z - 1 + 37 * (Z - 1), Z = 1, G = I + Z + 65535, Z = Math.floor(G / 65536), I = G - Z * 65536, G = Y + Z + 65535, Z = Math.floor(G / 65536), Y = G - Z * 65536, G = J + Z + 65535, Z = Math.floor(G / 65536), J = G - Z * 65536, G = W + Z + 65535, Z = Math.floor(G / 65536), W = G - Z * 65536, G = X + Z + 65535, Z = Math.floor(G / 65536), X = G - Z * 65536, G = V + Z + 65535, Z = Math.floor(G / 65536), V = G - Z * 65536, G = F + Z + 65535, Z = Math.floor(G / 65536), F = G - Z * 65536, G = K + Z + 65535, Z = Math.floor(G / 65536), K = G - Z * 65536, G = D + Z + 65535, Z = Math.floor(G / 65536), D = G - Z * 65536, G = H + Z + 65535, Z = Math.floor(G / 65536), H = G - Z * 65536, G = C + Z + 65535, Z = Math.floor(G / 65536), C = G - Z * 65536, G = E + Z + 65535, Z = Math.floor(G / 65536), E = G - Z * 65536, G = U + Z + 65535, Z = Math.floor(G / 65536), U = G - Z * 65536, G = q + Z + 65535, Z = Math.floor(G / 65536), q = G - Z * 65536, G = w + Z + 65535, Z = Math.floor(G / 65536), w = G - Z * 65536, G = N + Z + 65535, Z = Math.floor(G / 65536), N = G - Z * 65536, I += Z - 1 + 37 * (Z - 1), A[0] = I, A[1] = Y, A[2] = J, A[3] = W, A[4] = X, A[5] = V, A[6] = F, A[7] = K, A[8] = D, A[9] = H, A[10] = C, A[11] = E, A[12] = U, A[13] = q, A[14] = w, A[15] = N
  }
})
// @from(Start 9445667, End 9447091)
a52 = z((qjG, n52) => {
  var zq = B6();
  x3();
  cM();
  iLA();
  n52.exports = zq.kem = zq.kem || {};
  var l52 = zq.jsbn.BigInteger;
  zq.kem.rsa = {};
  zq.kem.rsa.create = function(A, Q) {
    Q = Q || {};
    var B = Q.prng || zq.random,
      G = {};
    return G.encrypt = function(Z, I) {
      var Y = Math.ceil(Z.n.bitLength() / 8),
        J;
      do J = new l52(zq.util.bytesToHex(B.getBytesSync(Y)), 16).mod(Z.n); while (J.compareTo(l52.ONE) <= 0);
      J = zq.util.hexToBytes(J.toString(16));
      var W = Y - J.length;
      if (W > 0) J = zq.util.fillString(String.fromCharCode(0), W) + J;
      var X = Z.encrypt(J, "NONE"),
        V = A.generate(J, I);
      return {
        encapsulation: X,
        key: V
      }
    }, G.decrypt = function(Z, I, Y) {
      var J = Z.decrypt(I, "NONE");
      return A.generate(J, Y)
    }, G
  };
  zq.kem.kdf1 = function(A, Q) {
    i52(this, A, 0, Q || A.digestLength)
  };
  zq.kem.kdf2 = function(A, Q) {
    i52(this, A, 1, Q || A.digestLength)
  };

  function i52(A, Q, B, G) {
    A.generate = function(Z, I) {
      var Y = new zq.util.ByteBuffer,
        J = Math.ceil(I / G) + B,
        W = new zq.util.ByteBuffer;
      for (var X = B; X < J; ++X) {
        W.putInt32(X), Q.start(), Q.update(Z + W.getBytes());
        var V = Q.digest();
        Y.putBytes(V.getBytes(G))
      }
      return Y.truncate(Y.length() - I), Y.getBytes()
    }
  }
})
// @from(Start 9447097, End 9450448)
r52 = z((NjG, s52) => {
  var y5 = B6();
  x3();
  s52.exports = y5.log = y5.log || {};
  y5.log.levels = ["none", "error", "warning", "info", "debug", "verbose", "max"];
  var W21 = {},
    V10 = [],
    eLA = null;
  y5.log.LEVEL_LOCKED = 2;
  y5.log.NO_LEVEL_CHECK = 4;
  y5.log.INTERPOLATE = 8;
  for (sM = 0; sM < y5.log.levels.length; ++sM) Y21 = y5.log.levels[sM], W21[Y21] = {
    index: sM,
    name: Y21.toUpperCase()
  };
  var Y21, sM;
  y5.log.logMessage = function(A) {
    var Q = W21[A.level].index;
    for (var B = 0; B < V10.length; ++B) {
      var G = V10[B];
      if (G.flags & y5.log.NO_LEVEL_CHECK) G.f(A);
      else {
        var Z = W21[G.level].index;
        if (Q <= Z) G.f(G, A)
      }
    }
  };
  y5.log.prepareStandard = function(A) {
    if (!("standard" in A)) A.standard = W21[A.level].name + " [" + A.category + "] " + A.message
  };
  y5.log.prepareFull = function(A) {
    if (!("full" in A)) {
      var Q = [A.message];
      Q = Q.concat([]), A.full = y5.util.format.apply(this, Q)
    }
  };
  y5.log.prepareStandardFull = function(A) {
    if (!("standardFull" in A)) y5.log.prepareStandard(A), A.standardFull = A.standard
  };
  J21 = ["error", "warning", "info", "debug", "verbose"];
  for (sM = 0; sM < J21.length; ++sM)(function(Q) {
    y5.log[Q] = function(B, G) {
      var Z = Array.prototype.slice.call(arguments).slice(2),
        I = {
          timestamp: new Date,
          level: Q,
          category: B,
          message: G,
          arguments: Z
        };
      y5.log.logMessage(I)
    }
  })(J21[sM]);
  var J21, sM;
  y5.log.makeLogger = function(A) {
    var Q = {
      flags: 0,
      f: A
    };
    return y5.log.setLevel(Q, "none"), Q
  };
  y5.log.setLevel = function(A, Q) {
    var B = !1;
    if (A && !(A.flags & y5.log.LEVEL_LOCKED))
      for (var G = 0; G < y5.log.levels.length; ++G) {
        var Z = y5.log.levels[G];
        if (Q == Z) {
          A.level = Q, B = !0;
          break
        }
      }
    return B
  };
  y5.log.lock = function(A, Q) {
    if (typeof Q > "u" || Q) A.flags |= y5.log.LEVEL_LOCKED;
    else A.flags &= ~y5.log.LEVEL_LOCKED
  };
  y5.log.addLogger = function(A) {
    V10.push(A)
  };
  if (typeof console < "u" && "log" in console) {
    if (console.error && console.warn && console.info && console.debug) F10 = {
      error: console.error,
      warning: console.warn,
      info: console.info,
      debug: console.debug,
      verbose: console.debug
    }, eIA = function(A, Q) {
      y5.log.prepareStandard(Q);
      var B = F10[Q.level],
        G = [Q.standard];
      G = G.concat(Q.arguments.slice()), B.apply(console, G)
    }, V1A = y5.log.makeLogger(eIA);
    else eIA = function(Q, B) {
      y5.log.prepareStandardFull(B), console.log(B.standardFull)
    }, V1A = y5.log.makeLogger(eIA);
    y5.log.setLevel(V1A, "debug"), y5.log.addLogger(V1A), eLA = V1A
  } else console = {
    log: function() {}
  };
  var V1A, F10, eIA;
  if (eLA !== null && typeof window < "u" && window.location) {
    if (tIA = new URL(window.location.href).searchParams, tIA.has("console.level")) y5.log.setLevel(eLA, tIA.get("console.level").slice(-1)[0]);
    if (tIA.has("console.lock")) {
      if (K10 = tIA.get("console.lock").slice(-1)[0], K10 == "true") y5.log.lock(eLA)
    }
  }
  var tIA, K10;
  y5.log.consoleLogger = eLA
})
// @from(Start 9450454, End 9450537)
t52 = z((LjG, o52) => {
  o52.exports = Pk();
  uB1();
  lIA();
  MA0();
  A10()
})