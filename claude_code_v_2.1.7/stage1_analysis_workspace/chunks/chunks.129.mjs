
// @from(Ln 378010, Col 4)
ww0 = U((wXY, Sa2) => {
  var pQ = H8();
  Nx();
  LEA();
  cV1();
  J3A();
  zw0();
  Xj();
  _EA();
  _7();
  var JF1 = function (A, Q, B, G) {
      var Z = pQ.util.createBuffer(),
        Y = A.length >> 1,
        J = Y + (A.length & 1),
        X = A.substr(0, J),
        I = A.substr(Y, J),
        D = pQ.util.createBuffer(),
        W = pQ.hmac.create();
      B = Q + B;
      var K = Math.ceil(G / 16),
        V = Math.ceil(G / 20);
      W.start("MD5", X);
      var F = pQ.util.createBuffer();
      D.putBytes(B);
      for (var H = 0; H < K; ++H) W.start(null, null), W.update(D.getBytes()), D.putBuffer(W.digest()), W.start(null, null), W.update(D.bytes() + B), F.putBuffer(W.digest());
      W.start("SHA1", I);
      var E = pQ.util.createBuffer();
      D.clear(), D.putBytes(B);
      for (var H = 0; H < V; ++H) W.start(null, null), W.update(D.getBytes()), D.putBuffer(W.digest()), W.start(null, null), W.update(D.bytes() + B), E.putBuffer(W.digest());
      return Z.putBytes(pQ.util.xorBytes(F.getBytes(), E.getBytes(), G)), Z
    },
    R07 = function (A, Q, B) {
      var G = pQ.hmac.create();
      G.start("SHA1", A);
      var Z = pQ.util.createBuffer();
      return Z.putInt32(Q[0]), Z.putInt32(Q[1]), Z.putByte(B.type), Z.putByte(B.version.major), Z.putByte(B.version.minor), Z.putInt16(B.length), Z.putBytes(B.fragment.bytes()), G.update(Z.getBytes()), G.digest().getBytes()
    },
    _07 = function (A, Q, B) {
      var G = !1;
      try {
        var Z = A.deflate(Q.fragment.getBytes());
        Q.fragment = pQ.util.createBuffer(Z), Q.length = Z.length, G = !0
      } catch (Y) {}
      return G
    },
    j07 = function (A, Q, B) {
      var G = !1;
      try {
        var Z = A.inflate(Q.fragment.getBytes());
        Q.fragment = pQ.util.createBuffer(Z), Q.length = Z.length, G = !0
      } catch (Y) {}
      return G
    },
    uO = function (A, Q) {
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
      return pQ.util.createBuffer(A.getBytes(B))
    },
    Kj = function (A, Q, B) {
      A.putInt(B.length(), Q << 3), A.putBuffer(B)
    },
    nA = {};
  nA.Versions = {
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
  nA.SupportedVersions = [nA.Versions.TLS_1_1, nA.Versions.TLS_1_0];
  nA.Version = nA.SupportedVersions[0];
  nA.MaxFragment = 15360;
  nA.ConnectionEnd = {
    server: 0,
    client: 1
  };
  nA.PRFAlgorithm = {
    tls_prf_sha256: 0
  };
  nA.BulkCipherAlgorithm = {
    none: null,
    rc4: 0,
    des3: 1,
    aes: 2
  };
  nA.CipherType = {
    stream: 0,
    block: 1,
    aead: 2
  };
  nA.MACAlgorithm = {
    none: null,
    hmac_md5: 0,
    hmac_sha1: 1,
    hmac_sha256: 2,
    hmac_sha384: 3,
    hmac_sha512: 4
  };
  nA.CompressionMethod = {
    none: 0,
    deflate: 1
  };
  nA.ContentType = {
    change_cipher_spec: 20,
    alert: 21,
    handshake: 22,
    application_data: 23,
    heartbeat: 24
  };
  nA.HandshakeType = {
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
  nA.Alert = {};
  nA.Alert.Level = {
    warning: 1,
    fatal: 2
  };
  nA.Alert.Description = {
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
  nA.HeartbeatMessageType = {
    heartbeat_request: 1,
    heartbeat_response: 2
  };
  nA.CipherSuites = {};
  nA.getCipherSuite = function (A) {
    var Q = null;
    for (var B in nA.CipherSuites) {
      var G = nA.CipherSuites[B];
      if (G.id[0] === A.charCodeAt(0) && G.id[1] === A.charCodeAt(1)) {
        Q = G;
        break
      }
    }
    return Q
  };
  nA.handleUnexpected = function (A, Q) {
    var B = !A.open && A.entity === nA.ConnectionEnd.client;
    if (!B) A.error(A, {
      message: "Unexpected message. Received TLS record out of order.",
      send: !0,
      alert: {
        level: nA.Alert.Level.fatal,
        description: nA.Alert.Description.unexpected_message
      }
    })
  };
  nA.handleHelloRequest = function (A, Q, B) {
    if (!A.handshaking && A.handshakes > 0) nA.queue(A, nA.createAlert(A, {
      level: nA.Alert.Level.warning,
      description: nA.Alert.Description.no_renegotiation
    })), nA.flush(A);
    A.process()
  };
  nA.parseHelloMessage = function (A, Q, B) {
    var G = null,
      Z = A.entity === nA.ConnectionEnd.client;
    if (B < 38) A.error(A, {
      message: Z ? "Invalid ServerHello message. Message too short." : "Invalid ClientHello message. Message too short.",
      send: !0,
      alert: {
        level: nA.Alert.Level.fatal,
        description: nA.Alert.Description.illegal_parameter
      }
    });
    else {
      var Y = Q.fragment,
        J = Y.length();
      if (G = {
          version: {
            major: Y.getByte(),
            minor: Y.getByte()
          },
          random: pQ.util.createBuffer(Y.getBytes(32)),
          session_id: uO(Y, 1),
          extensions: []
        }, Z) G.cipher_suite = Y.getBytes(2), G.compression_method = Y.getByte();
      else G.cipher_suites = uO(Y, 2), G.compression_methods = uO(Y, 1);
      if (J = B - (J - Y.length()), J > 0) {
        var X = uO(Y, 2);
        while (X.length() > 0) G.extensions.push({
          type: [X.getByte(), X.getByte()],
          data: uO(X, 2)
        });
        if (!Z)
          for (var I = 0; I < G.extensions.length; ++I) {
            var D = G.extensions[I];
            if (D.type[0] === 0 && D.type[1] === 0) {
              var W = uO(D.data, 2);
              while (W.length() > 0) {
                var K = W.getByte();
                if (K !== 0) break;
                A.session.extensions.server_name.serverNameList.push(uO(W, 2).getBytes())
              }
            }
          }
      }
      if (A.session.version) {
        if (G.version.major !== A.session.version.major || G.version.minor !== A.session.version.minor) return A.error(A, {
          message: "TLS version change is disallowed during renegotiation.",
          send: !0,
          alert: {
            level: nA.Alert.Level.fatal,
            description: nA.Alert.Description.protocol_version
          }
        })
      }
      if (Z) A.session.cipherSuite = nA.getCipherSuite(G.cipher_suite);
      else {
        var V = pQ.util.createBuffer(G.cipher_suites.bytes());
        while (V.length() > 0)
          if (A.session.cipherSuite = nA.getCipherSuite(V.getBytes(2)), A.session.cipherSuite !== null) break
      }
      if (A.session.cipherSuite === null) return A.error(A, {
        message: "No cipher suites in common.",
        send: !0,
        alert: {
          level: nA.Alert.Level.fatal,
          description: nA.Alert.Description.handshake_failure
        },
        cipherSuite: pQ.util.bytesToHex(G.cipher_suite)
      });
      if (Z) A.session.compressionMethod = G.compression_method;
      else A.session.compressionMethod = nA.CompressionMethod.none
    }
    return G
  };
  nA.createSecurityParameters = function (A, Q) {
    var B = A.entity === nA.ConnectionEnd.client,
      G = Q.random.bytes(),
      Z = B ? A.session.sp.client_random : G,
      Y = B ? G : nA.createRandom().getBytes();
    A.session.sp = {
      entity: A.entity,
      prf_algorithm: nA.PRFAlgorithm.tls_prf_sha256,
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
      server_random: Y
    }
  };
  nA.handleServerHello = function (A, Q, B) {
    var G = nA.parseHelloMessage(A, Q, B);
    if (A.fail) return;
    if (G.version.minor <= A.version.minor) A.version.minor = G.version.minor;
    else return A.error(A, {
      message: "Incompatible TLS version.",
      send: !0,
      alert: {
        level: nA.Alert.Level.fatal,
        description: nA.Alert.Description.protocol_version
      }
    });
    A.session.version = A.version;
    var Z = G.session_id.bytes();
    if (Z.length > 0 && Z === A.session.id) A.expect = Ra2, A.session.resuming = !0, A.session.sp.server_random = G.random.bytes();
    else A.expect = P07, A.session.resuming = !1, nA.createSecurityParameters(A, G);
    A.session.id = Z, A.process()
  };
  nA.handleClientHello = function (A, Q, B) {
    var G = nA.parseHelloMessage(A, Q, B);
    if (A.fail) return;
    var Z = G.session_id.bytes(),
      Y = null;
    if (A.sessionCache) {
      if (Y = A.sessionCache.getSession(Z), Y === null) Z = "";
      else if (Y.version.major !== G.version.major || Y.version.minor > G.version.minor) Y = null, Z = ""
    }
    if (Z.length === 0) Z = pQ.random.getBytes(32);
    if (A.session.id = Z, A.session.clientHelloVersion = G.version, A.session.sp = {}, Y) A.version = A.session.version = Y.version, A.session.sp = Y.sp;
    else {
      var J;
      for (var X = 1; X < nA.SupportedVersions.length; ++X)
        if (J = nA.SupportedVersions[X], J.minor <= G.version.minor) break;
      A.version = {
        major: J.major,
        minor: J.minor
      }, A.session.version = A.version
    }
    if (Y !== null) A.expect = qw0, A.session.resuming = !0, A.session.sp.client_random = G.random.bytes();
    else A.expect = A.verifyClient !== !1 ? f07 : Uw0, A.session.resuming = !1, nA.createSecurityParameters(A, G);
    if (A.open = !0, nA.queue(A, nA.createRecord(A, {
        type: nA.ContentType.handshake,
        data: nA.createServerHello(A)
      })), A.session.resuming) nA.queue(A, nA.createRecord(A, {
      type: nA.ContentType.change_cipher_spec,
      data: nA.createChangeCipherSpec()
    })), A.state.pending = nA.createConnectionState(A), A.state.current.write = A.state.pending.write, nA.queue(A, nA.createRecord(A, {
      type: nA.ContentType.handshake,
      data: nA.createFinished(A)
    }));
    else if (nA.queue(A, nA.createRecord(A, {
        type: nA.ContentType.handshake,
        data: nA.createCertificate(A)
      })), !A.fail) {
      if (nA.queue(A, nA.createRecord(A, {
          type: nA.ContentType.handshake,
          data: nA.createServerKeyExchange(A)
        })), A.verifyClient !== !1) nA.queue(A, nA.createRecord(A, {
        type: nA.ContentType.handshake,
        data: nA.createCertificateRequest(A)
      }));
      nA.queue(A, nA.createRecord(A, {
        type: nA.ContentType.handshake,
        data: nA.createServerHelloDone(A)
      }))
    }
    nA.flush(A), A.process()
  };
  nA.handleCertificate = function (A, Q, B) {
    if (B < 3) return A.error(A, {
      message: "Invalid Certificate message. Message too short.",
      send: !0,
      alert: {
        level: nA.Alert.Level.fatal,
        description: nA.Alert.Description.illegal_parameter
      }
    });
    var G = Q.fragment,
      Z = {
        certificate_list: uO(G, 3)
      },
      Y, J, X = [];
    try {
      while (Z.certificate_list.length() > 0) Y = uO(Z.certificate_list, 3), J = pQ.asn1.fromDer(Y), Y = pQ.pki.certificateFromAsn1(J, !0), X.push(Y)
    } catch (D) {
      return A.error(A, {
        message: "Could not parse certificate list.",
        cause: D,
        send: !0,
        alert: {
          level: nA.Alert.Level.fatal,
          description: nA.Alert.Description.bad_certificate
        }
      })
    }
    var I = A.entity === nA.ConnectionEnd.client;
    if ((I || A.verifyClient === !0) && X.length === 0) A.error(A, {
      message: I ? "No server certificate provided." : "No client certificate provided.",
      send: !0,
      alert: {
        level: nA.Alert.Level.fatal,
        description: nA.Alert.Description.illegal_parameter
      }
    });
    else if (X.length === 0) A.expect = I ? Oa2 : Uw0;
    else {
      if (I) A.session.serverCertificate = X[0];
      else A.session.clientCertificate = X[0];
      if (nA.verifyCertificateChain(A, X)) A.expect = I ? Oa2 : Uw0
    }
    A.process()
  };
  nA.handleServerKeyExchange = function (A, Q, B) {
    if (B > 0) return A.error(A, {
      message: "Invalid key parameters. Only RSA is supported.",
      send: !0,
      alert: {
        level: nA.Alert.Level.fatal,
        description: nA.Alert.Description.unsupported_certificate
      }
    });
    A.expect = S07, A.process()
  };
  nA.handleClientKeyExchange = function (A, Q, B) {
    if (B < 48) return A.error(A, {
      message: "Invalid key parameters. Only RSA is supported.",
      send: !0,
      alert: {
        level: nA.Alert.Level.fatal,
        description: nA.Alert.Description.unsupported_certificate
      }
    });
    var G = Q.fragment,
      Z = {
        enc_pre_master_secret: uO(G, 2).getBytes()
      },
      Y = null;
    if (A.getPrivateKey) try {
      Y = A.getPrivateKey(A, A.session.serverCertificate), Y = pQ.pki.privateKeyFromPem(Y)
    } catch (I) {
      A.error(A, {
        message: "Could not get private key.",
        cause: I,
        send: !0,
        alert: {
          level: nA.Alert.Level.fatal,
          description: nA.Alert.Description.internal_error
        }
      })
    }
    if (Y === null) return A.error(A, {
      message: "No private key set.",
      send: !0,
      alert: {
        level: nA.Alert.Level.fatal,
        description: nA.Alert.Description.internal_error
      }
    });
    try {
      var J = A.session.sp;
      J.pre_master_secret = Y.decrypt(Z.enc_pre_master_secret);
      var X = A.session.clientHelloVersion;
      if (X.major !== J.pre_master_secret.charCodeAt(0) || X.minor !== J.pre_master_secret.charCodeAt(1)) throw Error("TLS version rollback attack detected.")
    } catch (I) {
      J.pre_master_secret = pQ.random.getBytes(48)
    }
    if (A.expect = qw0, A.session.clientCertificate !== null) A.expect = h07;
    A.process()
  };
  nA.handleCertificateRequest = function (A, Q, B) {
    if (B < 3) return A.error(A, {
      message: "Invalid CertificateRequest. Message too short.",
      send: !0,
      alert: {
        level: nA.Alert.Level.fatal,
        description: nA.Alert.Description.illegal_parameter
      }
    });
    var G = Q.fragment,
      Z = {
        certificate_types: uO(G, 1),
        certificate_authorities: uO(G, 2)
      };
    A.session.certificateRequest = Z, A.expect = x07, A.process()
  };
  nA.handleCertificateVerify = function (A, Q, B) {
    if (B < 2) return A.error(A, {
      message: "Invalid CertificateVerify. Message too short.",
      send: !0,
      alert: {
        level: nA.Alert.Level.fatal,
        description: nA.Alert.Description.illegal_parameter
      }
    });
    var G = Q.fragment;
    G.read -= 4;
    var Z = G.bytes();
    G.read += 4;
    var Y = {
        signature: uO(G, 2).getBytes()
      },
      J = pQ.util.createBuffer();
    J.putBuffer(A.session.md5.digest()), J.putBuffer(A.session.sha1.digest()), J = J.getBytes();
    try {
      var X = A.session.clientCertificate;
      if (!X.publicKey.verify(J, Y.signature, "NONE")) throw Error("CertificateVerify signature does not match.");
      A.session.md5.update(Z), A.session.sha1.update(Z)
    } catch (I) {
      return A.error(A, {
        message: "Bad signature in CertificateVerify.",
        send: !0,
        alert: {
          level: nA.Alert.Level.fatal,
          description: nA.Alert.Description.handshake_failure
        }
      })
    }
    A.expect = qw0, A.process()
  };
  nA.handleServerHelloDone = function (A, Q, B) {
    if (B > 0) return A.error(A, {
      message: "Invalid ServerHelloDone message. Invalid length.",
      send: !0,
      alert: {
        level: nA.Alert.Level.fatal,
        description: nA.Alert.Description.record_overflow
      }
    });
    if (A.serverCertificate === null) {
      var G = {
          message: "No server certificate provided. Not enough security.",
          send: !0,
          alert: {
            level: nA.Alert.Level.fatal,
            description: nA.Alert.Description.insufficient_security
          }
        },
        Z = 0,
        Y = A.verify(A, G.alert.description, Z, []);
      if (Y !== !0) {
        if (Y || Y === 0) {
          if (typeof Y === "object" && !pQ.util.isArray(Y)) {
            if (Y.message) G.message = Y.message;
            if (Y.alert) G.alert.description = Y.alert
          } else if (typeof Y === "number") G.alert.description = Y
        }
        return A.error(A, G)
      }
    }
    if (A.session.certificateRequest !== null) Q = nA.createRecord(A, {
      type: nA.ContentType.handshake,
      data: nA.createCertificate(A)
    }), nA.queue(A, Q);
    Q = nA.createRecord(A, {
      type: nA.ContentType.handshake,
      data: nA.createClientKeyExchange(A)
    }), nA.queue(A, Q), A.expect = k07;
    var J = function (X, I) {
      if (X.session.certificateRequest !== null && X.session.clientCertificate !== null) nA.queue(X, nA.createRecord(X, {
        type: nA.ContentType.handshake,
        data: nA.createCertificateVerify(X, I)
      }));
      nA.queue(X, nA.createRecord(X, {
        type: nA.ContentType.change_cipher_spec,
        data: nA.createChangeCipherSpec()
      })), X.state.pending = nA.createConnectionState(X), X.state.current.write = X.state.pending.write, nA.queue(X, nA.createRecord(X, {
        type: nA.ContentType.handshake,
        data: nA.createFinished(X)
      })), X.expect = Ra2, nA.flush(X), X.process()
    };
    if (A.session.certificateRequest === null || A.session.clientCertificate === null) return J(A, null);
    nA.getClientSignature(A, J)
  };
  nA.handleChangeCipherSpec = function (A, Q) {
    if (Q.fragment.getByte() !== 1) return A.error(A, {
      message: "Invalid ChangeCipherSpec message received.",
      send: !0,
      alert: {
        level: nA.Alert.Level.fatal,
        description: nA.Alert.Description.illegal_parameter
      }
    });
    var B = A.entity === nA.ConnectionEnd.client;
    if (A.session.resuming && B || !A.session.resuming && !B) A.state.pending = nA.createConnectionState(A);
    if (A.state.current.read = A.state.pending.read, !A.session.resuming && B || A.session.resuming && !B) A.state.pending = null;
    A.expect = B ? y07 : g07, A.process()
  };
  nA.handleFinished = function (A, Q, B) {
    var G = Q.fragment;
    G.read -= 4;
    var Z = G.bytes();
    G.read += 4;
    var Y = Q.fragment.getBytes();
    G = pQ.util.createBuffer(), G.putBuffer(A.session.md5.digest()), G.putBuffer(A.session.sha1.digest());
    var J = A.entity === nA.ConnectionEnd.client,
      X = J ? "server finished" : "client finished",
      I = A.session.sp,
      D = 12,
      W = JF1;
    if (G = W(I.master_secret, X, G.getBytes(), D), G.getBytes() !== Y) return A.error(A, {
      message: "Invalid verify_data in Finished message.",
      send: !0,
      alert: {
        level: nA.Alert.Level.fatal,
        description: nA.Alert.Description.decrypt_error
      }
    });
    if (A.session.md5.update(Z), A.session.sha1.update(Z), A.session.resuming && J || !A.session.resuming && !J) nA.queue(A, nA.createRecord(A, {
      type: nA.ContentType.change_cipher_spec,
      data: nA.createChangeCipherSpec()
    })), A.state.current.write = A.state.pending.write, A.state.pending = null, nA.queue(A, nA.createRecord(A, {
      type: nA.ContentType.handshake,
      data: nA.createFinished(A)
    }));
    A.expect = J ? v07 : u07, A.handshaking = !1, ++A.handshakes, A.peerCertificate = J ? A.session.serverCertificate : A.session.clientCertificate, nA.flush(A), A.isConnected = !0, A.connected(A), A.process()
  };
  nA.handleAlert = function (A, Q) {
    var B = Q.fragment,
      G = {
        level: B.getByte(),
        description: B.getByte()
      },
      Z;
    switch (G.description) {
      case nA.Alert.Description.close_notify:
        Z = "Connection closed.";
        break;
      case nA.Alert.Description.unexpected_message:
        Z = "Unexpected message.";
        break;
      case nA.Alert.Description.bad_record_mac:
        Z = "Bad record MAC.";
        break;
      case nA.Alert.Description.decryption_failed:
        Z = "Decryption failed.";
        break;
      case nA.Alert.Description.record_overflow:
        Z = "Record overflow.";
        break;
      case nA.Alert.Description.decompression_failure:
        Z = "Decompression failed.";
        break;
      case nA.Alert.Description.handshake_failure:
        Z = "Handshake failure.";
        break;
      case nA.Alert.Description.bad_certificate:
        Z = "Bad certificate.";
        break;
      case nA.Alert.Description.unsupported_certificate:
        Z = "Unsupported certificate.";
        break;
      case nA.Alert.Description.certificate_revoked:
        Z = "Certificate revoked.";
        break;
      case nA.Alert.Description.certificate_expired:
        Z = "Certificate expired.";
        break;
      case nA.Alert.Description.certificate_unknown:
        Z = "Certificate unknown.";
        break;
      case nA.Alert.Description.illegal_parameter:
        Z = "Illegal parameter.";
        break;
      case nA.Alert.Description.unknown_ca:
        Z = "Unknown certificate authority.";
        break;
      case nA.Alert.Description.access_denied:
        Z = "Access denied.";
        break;
      case nA.Alert.Description.decode_error:
        Z = "Decode error.";
        break;
      case nA.Alert.Description.decrypt_error:
        Z = "Decrypt error.";
        break;
      case nA.Alert.Description.export_restriction:
        Z = "Export restriction.";
        break;
      case nA.Alert.Description.protocol_version:
        Z = "Unsupported protocol version.";
        break;
      case nA.Alert.Description.insufficient_security:
        Z = "Insufficient security.";
        break;
      case nA.Alert.Description.internal_error:
        Z = "Internal error.";
        break;
      case nA.Alert.Description.user_canceled:
        Z = "User canceled.";
        break;
      case nA.Alert.Description.no_renegotiation:
        Z = "Renegotiation not supported.";
        break;
      default:
        Z = "Unknown error.";
        break
    }
    if (G.description === nA.Alert.Description.close_notify) return A.close();
    A.error(A, {
      message: Z,
      send: !1,
      origin: A.entity === nA.ConnectionEnd.client ? "server" : "client",
      alert: G
    }), A.process()
  };
  nA.handleHandshake = function (A, Q) {
    var B = Q.fragment,
      G = B.getByte(),
      Z = B.getInt24();
    if (Z > B.length()) return A.fragmented = Q, Q.fragment = pQ.util.createBuffer(), B.read -= 4, A.process();
    A.fragmented = null, B.read -= 4;
    var Y = B.bytes(Z + 4);
    if (B.read += 4, G in YF1[A.entity][A.expect]) {
      if (A.entity === nA.ConnectionEnd.server && !A.open && !A.fail) A.handshaking = !0, A.session = {
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
        md5: pQ.md.md5.create(),
        sha1: pQ.md.sha1.create()
      };
      if (G !== nA.HandshakeType.hello_request && G !== nA.HandshakeType.certificate_verify && G !== nA.HandshakeType.finished) A.session.md5.update(Y), A.session.sha1.update(Y);
      YF1[A.entity][A.expect][G](A, Q, Z)
    } else nA.handleUnexpected(A, Q)
  };
  nA.handleApplicationData = function (A, Q) {
    A.data.putBuffer(Q.fragment), A.dataReady(A), A.process()
  };
  nA.handleHeartbeat = function (A, Q) {
    var B = Q.fragment,
      G = B.getByte(),
      Z = B.getInt16(),
      Y = B.getBytes(Z);
    if (G === nA.HeartbeatMessageType.heartbeat_request) {
      if (A.handshaking || Z > Y.length) return A.process();
      nA.queue(A, nA.createRecord(A, {
        type: nA.ContentType.heartbeat,
        data: nA.createHeartbeat(nA.HeartbeatMessageType.heartbeat_response, Y)
      })), nA.flush(A)
    } else if (G === nA.HeartbeatMessageType.heartbeat_response) {
      if (Y !== A.expectedHeartbeatPayload) return A.process();
      if (A.heartbeatReceived) A.heartbeatReceived(A, pQ.util.createBuffer(Y))
    }
    A.process()
  };
  var T07 = 0,
    P07 = 1,
    Oa2 = 2,
    S07 = 3,
    x07 = 4,
    Ra2 = 5,
    y07 = 6,
    v07 = 7,
    k07 = 8,
    b07 = 0,
    f07 = 1,
    Uw0 = 2,
    h07 = 3,
    qw0 = 4,
    g07 = 5,
    u07 = 6,
    iA = nA.handleUnexpected,
    _a2 = nA.handleChangeCipherSpec,
    TE = nA.handleAlert,
    CU = nA.handleHandshake,
    ja2 = nA.handleApplicationData,
    PE = nA.handleHeartbeat,
    Nw0 = [];
  Nw0[nA.ConnectionEnd.client] = [
    [iA, TE, CU, iA, PE],
    [iA, TE, CU, iA, PE],
    [iA, TE, CU, iA, PE],
    [iA, TE, CU, iA, PE],
    [iA, TE, CU, iA, PE],
    [_a2, TE, iA, iA, PE],
    [iA, TE, CU, iA, PE],
    [iA, TE, CU, ja2, PE],
    [iA, TE, CU, iA, PE]
  ];
  Nw0[nA.ConnectionEnd.server] = [
    [iA, TE, CU, iA, PE],
    [iA, TE, CU, iA, PE],
    [iA, TE, CU, iA, PE],
    [iA, TE, CU, iA, PE],
    [_a2, TE, iA, iA, PE],
    [iA, TE, CU, iA, PE],
    [iA, TE, CU, ja2, PE],
    [iA, TE, CU, iA, PE]
  ];
  var {
    handleHelloRequest: ht,
    handleServerHello: m07,
    handleCertificate: Ta2,
    handleServerKeyExchange: Ma2,
    handleCertificateRequest: $w0,
    handleServerHelloDone: ZF1,
    handleFinished: Pa2
  } = nA, YF1 = [];
  YF1[nA.ConnectionEnd.client] = [
    [iA, iA, m07, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA],
    [ht, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, Ta2, Ma2, $w0, ZF1, iA, iA, iA, iA, iA, iA],
    [ht, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, Ma2, $w0, ZF1, iA, iA, iA, iA, iA, iA],
    [ht, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, $w0, ZF1, iA, iA, iA, iA, iA, iA],
    [ht, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, ZF1, iA, iA, iA, iA, iA, iA],
    [ht, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA],
    [ht, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, Pa2],
    [ht, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA],
    [ht, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA]
  ];
  var {
    handleClientHello: d07,
    handleClientKeyExchange: c07,
    handleCertificateVerify: p07
  } = nA;
  YF1[nA.ConnectionEnd.server] = [
    [iA, d07, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA],
    [iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, Ta2, iA, iA, iA, iA, iA, iA, iA, iA, iA],
    [iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, c07, iA, iA, iA, iA],
    [iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, p07, iA, iA, iA, iA, iA],
    [iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA],
    [iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, Pa2],
    [iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA],
    [iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA, iA]
  ];
  nA.generateKeys = function (A, Q) {
    var B = JF1,
      G = Q.client_random + Q.server_random;
    if (!A.session.resuming) Q.master_secret = B(Q.pre_master_secret, "master secret", G, 48).bytes(), Q.pre_master_secret = null;
    G = Q.server_random + Q.client_random;
    var Z = 2 * Q.mac_key_length + 2 * Q.enc_key_length,
      Y = A.version.major === nA.Versions.TLS_1_0.major && A.version.minor === nA.Versions.TLS_1_0.minor;
    if (Y) Z += 2 * Q.fixed_iv_length;
    var J = B(Q.master_secret, "key expansion", G, Z),
      X = {
        client_write_MAC_key: J.getBytes(Q.mac_key_length),
        server_write_MAC_key: J.getBytes(Q.mac_key_length),
        client_write_key: J.getBytes(Q.enc_key_length),
        server_write_key: J.getBytes(Q.enc_key_length)
      };
    if (Y) X.client_write_IV = J.getBytes(Q.fixed_iv_length), X.server_write_IV = J.getBytes(Q.fixed_iv_length);
    return X
  };
  nA.createConnectionState = function (A) {
    var Q = A.entity === nA.ConnectionEnd.client,
      B = function () {
        var Y = {
          sequenceNumber: [0, 0],
          macKey: null,
          macLength: 0,
          macFunction: null,
          cipherState: null,
          cipherFunction: function (J) {
            return !0
          },
          compressionState: null,
          compressFunction: function (J) {
            return !0
          },
          updateSequenceNumber: function () {
            if (Y.sequenceNumber[1] === 4294967295) Y.sequenceNumber[1] = 0, ++Y.sequenceNumber[0];
            else ++Y.sequenceNumber[1]
          }
        };
        return Y
      },
      G = {
        read: B(),
        write: B()
      };
    if (G.read.update = function (Y, J) {
        if (!G.read.cipherFunction(J, G.read)) Y.error(Y, {
          message: "Could not decrypt record or bad MAC.",
          send: !0,
          alert: {
            level: nA.Alert.Level.fatal,
            description: nA.Alert.Description.bad_record_mac
          }
        });
        else if (!G.read.compressFunction(Y, J, G.read)) Y.error(Y, {
          message: "Could not decompress record.",
          send: !0,
          alert: {
            level: nA.Alert.Level.fatal,
            description: nA.Alert.Description.decompression_failure
          }
        });
        return !Y.fail
      }, G.write.update = function (Y, J) {
        if (!G.write.compressFunction(Y, J, G.write)) Y.error(Y, {
          message: "Could not compress record.",
          send: !1,
          alert: {
            level: nA.Alert.Level.fatal,
            description: nA.Alert.Description.internal_error
          }
        });
        else if (!G.write.cipherFunction(J, G.write)) Y.error(Y, {
          message: "Could not encrypt record.",
          send: !1,
          alert: {
            level: nA.Alert.Level.fatal,
            description: nA.Alert.Description.internal_error
          }
        });
        return !Y.fail
      }, A.session) {
      var Z = A.session.sp;
      switch (A.session.cipherSuite.initSecurityParameters(Z), Z.keys = nA.generateKeys(A, Z), G.read.macKey = Q ? Z.keys.server_write_MAC_key : Z.keys.client_write_MAC_key, G.write.macKey = Q ? Z.keys.client_write_MAC_key : Z.keys.server_write_MAC_key, A.session.cipherSuite.initConnectionState(G, A, Z), Z.compression_algorithm) {
        case nA.CompressionMethod.none:
          break;
        case nA.CompressionMethod.deflate:
          G.read.compressFunction = j07, G.write.compressFunction = _07;
          break;
        default:
          throw Error("Unsupported compression algorithm.")
      }
    }
    return G
  };
  nA.createRandom = function () {
    var A = new Date,
      Q = +A + A.getTimezoneOffset() * 60000,
      B = pQ.util.createBuffer();
    return B.putInt32(Q), B.putBytes(pQ.random.getBytes(28)), B
  };
  nA.createRecord = function (A, Q) {
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
  nA.createAlert = function (A, Q) {
    var B = pQ.util.createBuffer();
    return B.putByte(Q.level), B.putByte(Q.description), nA.createRecord(A, {
      type: nA.ContentType.alert,
      data: B
    })
  };
  nA.createClientHello = function (A) {
    A.session.clientHelloVersion = {
      major: A.version.major,
      minor: A.version.minor
    };
    var Q = pQ.util.createBuffer();
    for (var B = 0; B < A.cipherSuites.length; ++B) {
      var G = A.cipherSuites[B];
      Q.putByte(G.id[0]), Q.putByte(G.id[1])
    }
    var Z = Q.length(),
      Y = pQ.util.createBuffer();
    Y.putByte(nA.CompressionMethod.none);
    var J = Y.length(),
      X = pQ.util.createBuffer();
    if (A.virtualHost) {
      var I = pQ.util.createBuffer();
      I.putByte(0), I.putByte(0);
      var D = pQ.util.createBuffer();
      D.putByte(0), Kj(D, 2, pQ.util.createBuffer(A.virtualHost));
      var W = pQ.util.createBuffer();
      Kj(W, 2, D), Kj(I, 2, W), X.putBuffer(I)
    }
    var K = X.length();
    if (K > 0) K += 2;
    var V = A.session.id,
      F = V.length + 1 + 2 + 4 + 28 + 2 + Z + 1 + J + K,
      H = pQ.util.createBuffer();
    if (H.putByte(nA.HandshakeType.client_hello), H.putInt24(F), H.putByte(A.version.major), H.putByte(A.version.minor), H.putBytes(A.session.sp.client_random), Kj(H, 1, pQ.util.createBuffer(V)), Kj(H, 2, Q), Kj(H, 1, Y), K > 0) Kj(H, 2, X);
    return H
  };
  nA.createServerHello = function (A) {
    var Q = A.session.id,
      B = Q.length + 1 + 2 + 4 + 28 + 2 + 1,
      G = pQ.util.createBuffer();
    return G.putByte(nA.HandshakeType.server_hello), G.putInt24(B), G.putByte(A.version.major), G.putByte(A.version.minor), G.putBytes(A.session.sp.server_random), Kj(G, 1, pQ.util.createBuffer(Q)), G.putByte(A.session.cipherSuite.id[0]), G.putByte(A.session.cipherSuite.id[1]), G.putByte(A.session.compressionMethod), G
  };
  nA.createCertificate = function (A) {
    var Q = A.entity === nA.ConnectionEnd.client,
      B = null;
    if (A.getCertificate) {
      var G;
      if (Q) G = A.session.certificateRequest;
      else G = A.session.extensions.server_name.serverNameList;
      B = A.getCertificate(A, G)
    }
    var Z = pQ.util.createBuffer();
    if (B !== null) try {
      if (!pQ.util.isArray(B)) B = [B];
      var Y = null;
      for (var J = 0; J < B.length; ++J) {
        var X = pQ.pem.decode(B[J])[0];
        if (X.type !== "CERTIFICATE" && X.type !== "X509 CERTIFICATE" && X.type !== "TRUSTED CERTIFICATE") {
          var I = Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
          throw I.headerType = X.type, I
        }
        if (X.procType && X.procType.type === "ENCRYPTED") throw Error("Could not convert certificate from PEM; PEM is encrypted.");
        var D = pQ.util.createBuffer(X.body);
        if (Y === null) Y = pQ.asn1.fromDer(D.bytes(), !1);
        var W = pQ.util.createBuffer();
        Kj(W, 3, D), Z.putBuffer(W)
      }
      if (B = pQ.pki.certificateFromAsn1(Y), Q) A.session.clientCertificate = B;
      else A.session.serverCertificate = B
    } catch (F) {
      return A.error(A, {
        message: "Could not send certificate list.",
        cause: F,
        send: !0,
        alert: {
          level: nA.Alert.Level.fatal,
          description: nA.Alert.Description.bad_certificate
        }
      })
    }
    var K = 3 + Z.length(),
      V = pQ.util.createBuffer();
    return V.putByte(nA.HandshakeType.certificate), V.putInt24(K), Kj(V, 3, Z), V
  };
  nA.createClientKeyExchange = function (A) {
    var Q = pQ.util.createBuffer();
    Q.putByte(A.session.clientHelloVersion.major), Q.putByte(A.session.clientHelloVersion.minor), Q.putBytes(pQ.random.getBytes(46));
    var B = A.session.sp;
    B.pre_master_secret = Q.getBytes();
    var G = A.session.serverCertificate.publicKey;
    Q = G.encrypt(B.pre_master_secret);
    var Z = Q.length + 2,
      Y = pQ.util.createBuffer();
    return Y.putByte(nA.HandshakeType.client_key_exchange), Y.putInt24(Z), Y.putInt16(Q.length), Y.putBytes(Q), Y
  };
  nA.createServerKeyExchange = function (A) {
    var Q = 0,
      B = pQ.util.createBuffer();
    if (Q > 0) B.putByte(nA.HandshakeType.server_key_exchange), B.putInt24(Q);
    return B
  };
  nA.getClientSignature = function (A, Q) {
    var B = pQ.util.createBuffer();
    B.putBuffer(A.session.md5.digest()), B.putBuffer(A.session.sha1.digest()), B = B.getBytes(), A.getSignature = A.getSignature || function (G, Z, Y) {
      var J = null;
      if (G.getPrivateKey) try {
        J = G.getPrivateKey(G, G.session.clientCertificate), J = pQ.pki.privateKeyFromPem(J)
      } catch (X) {
        G.error(G, {
          message: "Could not get private key.",
          cause: X,
          send: !0,
          alert: {
            level: nA.Alert.Level.fatal,
            description: nA.Alert.Description.internal_error
          }
        })
      }
      if (J === null) G.error(G, {
        message: "No private key set.",
        send: !0,
        alert: {
          level: nA.Alert.Level.fatal,
          description: nA.Alert.Description.internal_error
        }
      });
      else Z = J.sign(Z, null);
      Y(G, Z)
    }, A.getSignature(A, B, Q)
  };
  nA.createCertificateVerify = function (A, Q) {
    var B = Q.length + 2,
      G = pQ.util.createBuffer();
    return G.putByte(nA.HandshakeType.certificate_verify), G.putInt24(B), G.putInt16(Q.length), G.putBytes(Q), G
  };
  nA.createCertificateRequest = function (A) {
    var Q = pQ.util.createBuffer();
    Q.putByte(1);
    var B = pQ.util.createBuffer();
    for (var G in A.caStore.certs) {
      var Z = A.caStore.certs[G],
        Y = pQ.pki.distinguishedNameToAsn1(Z.subject),
        J = pQ.asn1.toDer(Y);
      B.putInt16(J.length()), B.putBuffer(J)
    }
    var X = 1 + Q.length() + 2 + B.length(),
      I = pQ.util.createBuffer();
    return I.putByte(nA.HandshakeType.certificate_request), I.putInt24(X), Kj(I, 1, Q), Kj(I, 2, B), I
  };
  nA.createServerHelloDone = function (A) {
    var Q = pQ.util.createBuffer();
    return Q.putByte(nA.HandshakeType.server_hello_done), Q.putInt24(0), Q
  };
  nA.createChangeCipherSpec = function () {
    var A = pQ.util.createBuffer();
    return A.putByte(1), A
  };
  nA.createFinished = function (A) {
    var Q = pQ.util.createBuffer();
    Q.putBuffer(A.session.md5.digest()), Q.putBuffer(A.session.sha1.digest());
    var B = A.entity === nA.ConnectionEnd.client,
      G = A.session.sp,
      Z = 12,
      Y = JF1,
      J = B ? "client finished" : "server finished";
    Q = Y(G.master_secret, J, Q.getBytes(), Z);
    var X = pQ.util.createBuffer();
    return X.putByte(nA.HandshakeType.finished), X.putInt24(Q.length()), X.putBuffer(Q), X
  };
  nA.createHeartbeat = function (A, Q, B) {
    if (typeof B > "u") B = Q.length;
    var G = pQ.util.createBuffer();
    G.putByte(A), G.putInt16(B), G.putBytes(Q);
    var Z = G.length(),
      Y = Math.max(16, Z - B - 3);
    return G.putBytes(pQ.random.getBytes(Y)), G
  };
  nA.queue = function (A, Q) {
    if (!Q) return;
    if (Q.fragment.length() === 0) {
      if (Q.type === nA.ContentType.handshake || Q.type === nA.ContentType.alert || Q.type === nA.ContentType.change_cipher_spec) return
    }
    if (Q.type === nA.ContentType.handshake) {
      var B = Q.fragment.bytes();
      A.session.md5.update(B), A.session.sha1.update(B), B = null
    }
    var G;
    if (Q.fragment.length() <= nA.MaxFragment) G = [Q];
    else {
      G = [];
      var Z = Q.fragment.bytes();
      while (Z.length > nA.MaxFragment) G.push(nA.createRecord(A, {
        type: Q.type,
        data: pQ.util.createBuffer(Z.slice(0, nA.MaxFragment))
      })), Z = Z.slice(nA.MaxFragment);
      if (Z.length > 0) G.push(nA.createRecord(A, {
        type: Q.type,
        data: pQ.util.createBuffer(Z)
      }))
    }
    for (var Y = 0; Y < G.length && !A.fail; ++Y) {
      var J = G[Y],
        X = A.state.current.write;
      if (X.update(A, J)) A.records.push(J)
    }
  };
  nA.flush = function (A) {
    for (var Q = 0; Q < A.records.length; ++Q) {
      var B = A.records[Q];
      A.tlsData.putByte(B.type), A.tlsData.putByte(B.version.major), A.tlsData.putByte(B.version.minor), A.tlsData.putInt16(B.fragment.length()), A.tlsData.putBuffer(A.records[Q].fragment)
    }
    return A.records = [], A.tlsDataReady(A)
  };
  var Cw0 = function (A) {
      switch (A) {
        case !0:
          return !0;
        case pQ.pki.certificateError.bad_certificate:
          return nA.Alert.Description.bad_certificate;
        case pQ.pki.certificateError.unsupported_certificate:
          return nA.Alert.Description.unsupported_certificate;
        case pQ.pki.certificateError.certificate_revoked:
          return nA.Alert.Description.certificate_revoked;
        case pQ.pki.certificateError.certificate_expired:
          return nA.Alert.Description.certificate_expired;
        case pQ.pki.certificateError.certificate_unknown:
          return nA.Alert.Description.certificate_unknown;
        case pQ.pki.certificateError.unknown_ca:
          return nA.Alert.Description.unknown_ca;
        default:
          return nA.Alert.Description.bad_certificate
      }
    },
    l07 = function (A) {
      switch (A) {
        case !0:
          return !0;
        case nA.Alert.Description.bad_certificate:
          return pQ.pki.certificateError.bad_certificate;
        case nA.Alert.Description.unsupported_certificate:
          return pQ.pki.certificateError.unsupported_certificate;
        case nA.Alert.Description.certificate_revoked:
          return pQ.pki.certificateError.certificate_revoked;
        case nA.Alert.Description.certificate_expired:
          return pQ.pki.certificateError.certificate_expired;
        case nA.Alert.Description.certificate_unknown:
          return pQ.pki.certificateError.certificate_unknown;
        case nA.Alert.Description.unknown_ca:
          return pQ.pki.certificateError.unknown_ca;
        default:
          return pQ.pki.certificateError.bad_certificate
      }
    };
  nA.verifyCertificateChain = function (A, Q) {
    try {
      var B = {};
      for (var G in A.verifyOptions) B[G] = A.verifyOptions[G];
      B.verify = function (Y, J, X) {
        var I = Cw0(Y),
          D = A.verify(A, Y, J, X);
        if (D !== !0) {
          if (typeof D === "object" && !pQ.util.isArray(D)) {
            var W = Error("The application rejected the certificate.");
            if (W.send = !0, W.alert = {
                level: nA.Alert.Level.fatal,
                description: nA.Alert.Description.bad_certificate
              }, D.message) W.message = D.message;
            if (D.alert) W.alert.description = D.alert;
            throw W
          }
          if (D !== Y) D = l07(D)
        }
        return D
      }, pQ.pki.verifyCertificateChain(A.caStore, Q, B)
    } catch (Y) {
      var Z = Y;
      if (typeof Z !== "object" || pQ.util.isArray(Z)) Z = {
        send: !0,
        alert: {
          level: nA.Alert.Level.fatal,
          description: Cw0(Y)
        }
      };
      if (!("send" in Z)) Z.send = !0;
      if (!("alert" in Z)) Z.alert = {
        level: nA.Alert.Level.fatal,
        description: Cw0(Z.error)
      };
      A.error(A, Z)
    }
    return !A.fail
  };
  nA.createSessionCache = function (A, Q) {
    var B = null;
    if (A && A.getSession && A.setSession && A.order) B = A;
    else {
      B = {}, B.cache = A || {}, B.capacity = Math.max(Q || 100, 1), B.order = [];
      for (var G in A)
        if (B.order.length <= Q) B.order.push(G);
        else delete A[G];
      B.getSession = function (Z) {
        var Y = null,
          J = null;
        if (Z) J = pQ.util.bytesToHex(Z);
        else if (B.order.length > 0) J = B.order[0];
        if (J !== null && J in B.cache) {
          Y = B.cache[J], delete B.cache[J];
          for (var X in B.order)
            if (B.order[X] === J) {
              B.order.splice(X, 1);
              break
            }
        }
        return Y
      }, B.setSession = function (Z, Y) {
        if (B.order.length === B.capacity) {
          var J = B.order.shift();
          delete B.cache[J]
        }
        var J = pQ.util.bytesToHex(Z);
        B.order.push(J), B.cache[J] = Y
      }
    }
    return B
  };
  nA.createConnection = function (A) {
    var Q = null;
    if (A.caStore)
      if (pQ.util.isArray(A.caStore)) Q = pQ.pki.createCaStore(A.caStore);
      else Q = A.caStore;
    else Q = pQ.pki.createCaStore();
    var B = A.cipherSuites || null;
    if (B === null) {
      B = [];
      for (var G in nA.CipherSuites) B.push(nA.CipherSuites[G])
    }
    var Z = A.server ? nA.ConnectionEnd.server : nA.ConnectionEnd.client,
      Y = A.sessionCache ? nA.createSessionCache(A.sessionCache) : null,
      J = {
        version: {
          major: nA.Version.major,
          minor: nA.Version.minor
        },
        entity: Z,
        sessionId: A.sessionId,
        caStore: Q,
        sessionCache: Y,
        cipherSuites: B,
        connected: A.connected,
        virtualHost: A.virtualHost || null,
        verifyClient: A.verifyClient || !1,
        verify: A.verify || function (W, K, V, F) {
          return K
        },
        verifyOptions: A.verifyOptions || {},
        getCertificate: A.getCertificate || null,
        getPrivateKey: A.getPrivateKey || null,
        getSignature: A.getSignature || null,
        input: pQ.util.createBuffer(),
        tlsData: pQ.util.createBuffer(),
        data: pQ.util.createBuffer(),
        tlsDataReady: A.tlsDataReady,
        dataReady: A.dataReady,
        heartbeatReceived: A.heartbeatReceived,
        closed: A.closed,
        error: function (W, K) {
          if (K.origin = K.origin || (W.entity === nA.ConnectionEnd.client ? "client" : "server"), K.send) nA.queue(W, nA.createAlert(W, K.alert)), nA.flush(W);
          var V = K.fatal !== !1;
          if (V) W.fail = !0;
          if (A.error(W, K), V) W.close(!1)
        },
        deflate: A.deflate || null,
        inflate: A.inflate || null
      };
    J.reset = function (W) {
      J.version = {
        major: nA.Version.major,
        minor: nA.Version.minor
      }, J.record = null, J.session = null, J.peerCertificate = null, J.state = {
        pending: null,
        current: null
      }, J.expect = J.entity === nA.ConnectionEnd.client ? T07 : b07, J.fragmented = null, J.records = [], J.open = !1, J.handshakes = 0, J.handshaking = !1, J.isConnected = !1, J.fail = !(W || typeof W > "u"), J.input.clear(), J.tlsData.clear(), J.data.clear(), J.state.current = nA.createConnectionState(J)
    }, J.reset();
    var X = function (W, K) {
        var V = K.type - nA.ContentType.change_cipher_spec,
          F = Nw0[W.entity][W.expect];
        if (V in F) F[V](W, K);
        else nA.handleUnexpected(W, K)
      },
      I = function (W) {
        var K = 0,
          V = W.input,
          F = V.length();
        if (F < 5) K = 5 - F;
        else {
          W.record = {
            type: V.getByte(),
            version: {
              major: V.getByte(),
              minor: V.getByte()
            },
            length: V.getInt16(),
            fragment: pQ.util.createBuffer(),
            ready: !1
          };
          var H = W.record.version.major === W.version.major;
          if (H && W.session && W.session.version) H = W.record.version.minor === W.version.minor;
          if (!H) W.error(W, {
            message: "Incompatible TLS version.",
            send: !0,
            alert: {
              level: nA.Alert.Level.fatal,
              description: nA.Alert.Description.protocol_version
            }
          })
        }
        return K
      },
      D = function (W) {
        var K = 0,
          V = W.input,
          F = V.length();
        if (F < W.record.length) K = W.record.length - F;
        else {
          W.record.fragment.putBytes(V.getBytes(W.record.length)), V.compact();
          var H = W.state.current.read;
          if (H.update(W, W.record)) {
            if (W.fragmented !== null)
              if (W.fragmented.type === W.record.type) W.fragmented.fragment.putBuffer(W.record.fragment), W.record = W.fragmented;
              else W.error(W, {
                message: "Invalid fragmented record.",
                send: !0,
                alert: {
                  level: nA.Alert.Level.fatal,
                  description: nA.Alert.Description.unexpected_message
                }
              });
            W.record.ready = !0
          }
        }
        return K
      };
    return J.handshake = function (W) {
      if (J.entity !== nA.ConnectionEnd.client) J.error(J, {
        message: "Cannot initiate handshake as a server.",
        fatal: !1
      });
      else if (J.handshaking) J.error(J, {
        message: "Handshake already in progress.",
        fatal: !1
      });
      else {
        if (J.fail && !J.open && J.handshakes === 0) J.fail = !1;
        J.handshaking = !0, W = W || "";
        var K = null;
        if (W.length > 0) {
          if (J.sessionCache) K = J.sessionCache.getSession(W);
          if (K === null) W = ""
        }
        if (W.length === 0 && J.sessionCache) {
          if (K = J.sessionCache.getSession(), K !== null) W = K.id
        }
        if (J.session = {
            id: W,
            version: null,
            cipherSuite: null,
            compressionMethod: null,
            serverCertificate: null,
            certificateRequest: null,
            clientCertificate: null,
            sp: {},
            md5: pQ.md.md5.create(),
            sha1: pQ.md.sha1.create()
          }, K) J.version = K.version, J.session.sp = K.sp;
        J.session.sp.client_random = nA.createRandom().getBytes(), J.open = !0, nA.queue(J, nA.createRecord(J, {
          type: nA.ContentType.handshake,
          data: nA.createClientHello(J)
        })), nA.flush(J)
      }
    }, J.process = function (W) {
      var K = 0;
      if (W) J.input.putBytes(W);
      if (!J.fail) {
        if (J.record !== null && J.record.ready && J.record.fragment.isEmpty()) J.record = null;
        if (J.record === null) K = I(J);
        if (!J.fail && J.record !== null && !J.record.ready) K = D(J);
        if (!J.fail && J.record !== null && J.record.ready) X(J, J.record)
      }
      return K
    }, J.prepare = function (W) {
      return nA.queue(J, nA.createRecord(J, {
        type: nA.ContentType.application_data,
        data: pQ.util.createBuffer(W)
      })), nA.flush(J)
    }, J.prepareHeartbeatRequest = function (W, K) {
      if (W instanceof pQ.util.ByteBuffer) W = W.bytes();
      if (typeof K > "u") K = W.length;
      return J.expectedHeartbeatPayload = W, nA.queue(J, nA.createRecord(J, {
        type: nA.ContentType.heartbeat,
        data: nA.createHeartbeat(nA.HeartbeatMessageType.heartbeat_request, W, K)
      })), nA.flush(J)
    }, J.close = function (W) {
      if (!J.fail && J.sessionCache && J.session) {
        var K = {
          id: J.session.id,
          version: J.session.version,
          sp: J.session.sp
        };
        K.sp.keys = null, J.sessionCache.setSession(K.id, K)
      }
      if (J.open) {
        if (J.open = !1, J.input.clear(), J.isConnected || J.handshaking) J.isConnected = J.handshaking = !1, nA.queue(J, nA.createAlert(J, {
          level: nA.Alert.Level.warning,
          description: nA.Alert.Description.close_notify
        })), nA.flush(J);
        J.closed(J)
      }
      J.reset(W)
    }, J
  };
  Sa2.exports = pQ.tls = pQ.tls || {};
  for (gfA in nA)
    if (typeof nA[gfA] !== "function") pQ.tls[gfA] = nA[gfA];
  var gfA;
  pQ.tls.prf_tls1 = JF1;
  pQ.tls.hmac_sha1 = R07;
  pQ.tls.createSessionCache = nA.createSessionCache;
  pQ.tls.createConnection = nA.createConnection
})
// @from(Ln 379487, Col 4)
va2 = U((LXY, ya2) => {
  var gt = H8();
  xt();
  ww0();
  var Vj = ya2.exports = gt.tls;
  Vj.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA = {
    id: [0, 47],
    name: "TLS_RSA_WITH_AES_128_CBC_SHA",
    initSecurityParameters: function (A) {
      A.bulk_cipher_algorithm = Vj.BulkCipherAlgorithm.aes, A.cipher_type = Vj.CipherType.block, A.enc_key_length = 16, A.block_length = 16, A.fixed_iv_length = 16, A.record_iv_length = 16, A.mac_algorithm = Vj.MACAlgorithm.hmac_sha1, A.mac_length = 20, A.mac_key_length = 20
    },
    initConnectionState: xa2
  };
  Vj.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA = {
    id: [0, 53],
    name: "TLS_RSA_WITH_AES_256_CBC_SHA",
    initSecurityParameters: function (A) {
      A.bulk_cipher_algorithm = Vj.BulkCipherAlgorithm.aes, A.cipher_type = Vj.CipherType.block, A.enc_key_length = 32, A.block_length = 16, A.fixed_iv_length = 16, A.record_iv_length = 16, A.mac_algorithm = Vj.MACAlgorithm.hmac_sha1, A.mac_length = 20, A.mac_key_length = 20
    },
    initConnectionState: xa2
  };

  function xa2(A, Q, B) {
    var G = Q.entity === gt.tls.ConnectionEnd.client;
    A.read.cipherState = {
      init: !1,
      cipher: gt.cipher.createDecipher("AES-CBC", G ? B.keys.server_write_key : B.keys.client_write_key),
      iv: G ? B.keys.server_write_IV : B.keys.client_write_IV
    }, A.write.cipherState = {
      init: !1,
      cipher: gt.cipher.createCipher("AES-CBC", G ? B.keys.client_write_key : B.keys.server_write_key),
      iv: G ? B.keys.client_write_IV : B.keys.server_write_IV
    }, A.read.cipherFunction = o07, A.write.cipherFunction = i07, A.read.macLength = A.write.macLength = B.mac_length, A.read.macFunction = A.write.macFunction = Vj.hmac_sha1
  }

  function i07(A, Q) {
    var B = !1,
      G = Q.macFunction(Q.macKey, Q.sequenceNumber, A);
    A.fragment.putBytes(G), Q.updateSequenceNumber();
    var Z;
    if (A.version.minor === Vj.Versions.TLS_1_0.minor) Z = Q.cipherState.init ? null : Q.cipherState.iv;
    else Z = gt.random.getBytesSync(16);
    Q.cipherState.init = !0;
    var Y = Q.cipherState.cipher;
    if (Y.start({
        iv: Z
      }), A.version.minor >= Vj.Versions.TLS_1_1.minor) Y.output.putBytes(Z);
    if (Y.update(A.fragment), Y.finish(n07)) A.fragment = Y.output, A.length = A.fragment.length(), B = !0;
    return B
  }

  function n07(A, Q, B) {
    if (!B) {
      var G = A - Q.length() % A;
      Q.fillWithByte(G - 1, G)
    }
    return !0
  }

  function a07(A, Q, B) {
    var G = !0;
    if (B) {
      var Z = Q.length(),
        Y = Q.last();
      for (var J = Z - 1 - Y; J < Z - 1; ++J) G = G && Q.at(J) == Y;
      if (G) Q.truncate(Y + 1)
    }
    return G
  }

  function o07(A, Q) {
    var B = !1,
      G;
    if (A.version.minor === Vj.Versions.TLS_1_0.minor) G = Q.cipherState.init ? null : Q.cipherState.iv;
    else G = A.fragment.getBytes(16);
    Q.cipherState.init = !0;
    var Z = Q.cipherState.cipher;
    Z.start({
      iv: G
    }), Z.update(A.fragment), B = Z.finish(a07);
    var Y = Q.macLength,
      J = gt.random.getBytesSync(Y),
      X = Z.output.length();
    if (X >= Y) A.fragment = Z.output.getBytes(X - Y), J = Z.output.getBytes(Y);
    else A.fragment = Z.output.getBytes();
    A.fragment = gt.util.createBuffer(A.fragment), A.length = A.fragment.length();
    var I = Q.macFunction(Q.macKey, Q.sequenceNumber, A);
    return Q.updateSequenceNumber(), B = r07(Q.macKey, J, I) && B, B
  }

  function r07(A, Q, B) {
    var G = gt.hmac.create();
    return G.start("SHA1", A), G.update(Q), Q = G.digest().getBytes(), G.start(null, null), G.update(B), B = G.digest().getBytes(), Q === B
  }
})
// @from(Ln 379582, Col 4)
Mw0 = U((OXY, ha2) => {
  var bJ = H8();
  Sf();
  _7();
  var ufA = ha2.exports = bJ.sha512 = bJ.sha512 || {};
  bJ.md.sha512 = bJ.md.algorithms.sha512 = ufA;
  var ba2 = bJ.sha384 = bJ.sha512.sha384 = bJ.sha512.sha384 || {};
  ba2.create = function () {
    return ufA.create("SHA-384")
  };
  bJ.md.sha384 = bJ.md.algorithms.sha384 = ba2;
  bJ.sha512.sha256 = bJ.sha512.sha256 || {
    create: function () {
      return ufA.create("SHA-512/256")
    }
  };
  bJ.md["sha512/256"] = bJ.md.algorithms["sha512/256"] = bJ.sha512.sha256;
  bJ.sha512.sha224 = bJ.sha512.sha224 || {
    create: function () {
      return ufA.create("SHA-512/224")
    }
  };
  bJ.md["sha512/224"] = bJ.md.algorithms["sha512/224"] = bJ.sha512.sha224;
  ufA.create = function (A) {
    if (!fa2) s07();
    if (typeof A > "u") A = "SHA-512";
    if (!(A in V3A)) throw Error("Invalid SHA-512 algorithm: " + A);
    var Q = V3A[A],
      B = null,
      G = bJ.util.createBuffer(),
      Z = Array(80);
    for (var Y = 0; Y < 80; ++Y) Z[Y] = [, , ];
    var J = 64;
    switch (A) {
      case "SHA-384":
        J = 48;
        break;
      case "SHA-512/256":
        J = 32;
        break;
      case "SHA-512/224":
        J = 28;
        break
    }
    var X = {
      algorithm: A.replace("-", "").toLowerCase(),
      blockLength: 128,
      digestLength: J,
      messageLength: 0,
      fullMessageLength: null,
      messageLengthSize: 16
    };
    return X.start = function () {
      X.messageLength = 0, X.fullMessageLength = X.messageLength128 = [];
      var I = X.messageLengthSize / 4;
      for (var D = 0; D < I; ++D) X.fullMessageLength.push(0);
      G = bJ.util.createBuffer(), B = Array(Q.length);
      for (var D = 0; D < Q.length; ++D) B[D] = Q[D].slice(0);
      return X
    }, X.start(), X.update = function (I, D) {
      if (D === "utf8") I = bJ.util.encodeUtf8(I);
      var W = I.length;
      X.messageLength += W, W = [W / 4294967296 >>> 0, W >>> 0];
      for (var K = X.fullMessageLength.length - 1; K >= 0; --K) X.fullMessageLength[K] += W[1], W[1] = W[0] + (X.fullMessageLength[K] / 4294967296 >>> 0), X.fullMessageLength[K] = X.fullMessageLength[K] >>> 0, W[0] = W[1] / 4294967296 >>> 0;
      if (G.putBytes(I), ka2(B, Z, G), G.read > 2048 || G.length() === 0) G.compact();
      return X
    }, X.digest = function () {
      var I = bJ.util.createBuffer();
      I.putBytes(G.bytes());
      var D = X.fullMessageLength[X.fullMessageLength.length - 1] + X.messageLengthSize,
        W = D & X.blockLength - 1;
      I.putBytes(Lw0.substr(0, X.blockLength - W));
      var K, V, F = X.fullMessageLength[0] * 8;
      for (var H = 0; H < X.fullMessageLength.length - 1; ++H) K = X.fullMessageLength[H + 1] * 8, V = K / 4294967296 >>> 0, F += V, I.putInt32(F >>> 0), F = K >>> 0;
      I.putInt32(F);
      var E = Array(B.length);
      for (var H = 0; H < B.length; ++H) E[H] = B[H].slice(0);
      ka2(E, Z, I);
      var z = bJ.util.createBuffer(),
        $;
      if (A === "SHA-512") $ = E.length;
      else if (A === "SHA-384") $ = E.length - 2;
      else $ = E.length - 4;
      for (var H = 0; H < $; ++H)
        if (z.putInt32(E[H][0]), H !== $ - 1 || A !== "SHA-512/224") z.putInt32(E[H][1]);
      return z
    }, X
  };
  var Lw0 = null,
    fa2 = !1,
    Ow0 = null,
    V3A = null;

  function s07() {
    Lw0 = String.fromCharCode(128), Lw0 += bJ.util.fillString(String.fromCharCode(0), 128), Ow0 = [
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
    ], V3A = {}, V3A["SHA-512"] = [
      [1779033703, 4089235720],
      [3144134277, 2227873595],
      [1013904242, 4271175723],
      [2773480762, 1595750129],
      [1359893119, 2917565137],
      [2600822924, 725511199],
      [528734635, 4215389547],
      [1541459225, 327033209]
    ], V3A["SHA-384"] = [
      [3418070365, 3238371032],
      [1654270250, 914150663],
      [2438529370, 812702999],
      [355462360, 4144912697],
      [1731405415, 4290775857],
      [2394180231, 1750603025],
      [3675008525, 1694076839],
      [1203062813, 3204075428]
    ], V3A["SHA-512/256"] = [
      [573645204, 4230739756],
      [2673172387, 3360449730],
      [596883563, 1867755857],
      [2520282905, 1497426621],
      [2519219938, 2827943907],
      [3193839141, 1401305490],
      [721525244, 746961066],
      [246885852, 2177182882]
    ], V3A["SHA-512/224"] = [
      [2352822216, 424955298],
      [1944164710, 2312950998],
      [502970286, 855612546],
      [1738396948, 1479516111],
      [258812777, 2077511080],
      [2011393907, 79989058],
      [1067287976, 1780299464],
      [286451373, 2446758561]
    ], fa2 = !0
  }

  function ka2(A, Q, B) {
    var G, Z, Y, J, X, I, D, W, K, V, F, H, E, z, $, O, L, M, _, j, x, b, S, u, f, AA, n, y, p, GA, WA, MA, TA, bA, jA, OA = B.length();
    while (OA >= 128) {
      for (p = 0; p < 16; ++p) Q[p][0] = B.getInt32() >>> 0, Q[p][1] = B.getInt32() >>> 0;
      for (; p < 80; ++p) MA = Q[p - 2], GA = MA[0], WA = MA[1], G = ((GA >>> 19 | WA << 13) ^ (WA >>> 29 | GA << 3) ^ GA >>> 6) >>> 0, Z = ((GA << 13 | WA >>> 19) ^ (WA << 3 | GA >>> 29) ^ (GA << 26 | WA >>> 6)) >>> 0, bA = Q[p - 15], GA = bA[0], WA = bA[1], Y = ((GA >>> 1 | WA << 31) ^ (GA >>> 8 | WA << 24) ^ GA >>> 7) >>> 0, J = ((GA << 31 | WA >>> 1) ^ (GA << 24 | WA >>> 8) ^ (GA << 25 | WA >>> 7)) >>> 0, TA = Q[p - 7], jA = Q[p - 16], WA = Z + TA[1] + J + jA[1], Q[p][0] = G + TA[0] + Y + jA[0] + (WA / 4294967296 >>> 0) >>> 0, Q[p][1] = WA >>> 0;
      E = A[0][0], z = A[0][1], $ = A[1][0], O = A[1][1], L = A[2][0], M = A[2][1], _ = A[3][0], j = A[3][1], x = A[4][0], b = A[4][1], S = A[5][0], u = A[5][1], f = A[6][0], AA = A[6][1], n = A[7][0], y = A[7][1];
      for (p = 0; p < 80; ++p) D = ((x >>> 14 | b << 18) ^ (x >>> 18 | b << 14) ^ (b >>> 9 | x << 23)) >>> 0, W = ((x << 18 | b >>> 14) ^ (x << 14 | b >>> 18) ^ (b << 23 | x >>> 9)) >>> 0, K = (f ^ x & (S ^ f)) >>> 0, V = (AA ^ b & (u ^ AA)) >>> 0, X = ((E >>> 28 | z << 4) ^ (z >>> 2 | E << 30) ^ (z >>> 7 | E << 25)) >>> 0, I = ((E << 4 | z >>> 28) ^ (z << 30 | E >>> 2) ^ (z << 25 | E >>> 7)) >>> 0, F = (E & $ | L & (E ^ $)) >>> 0, H = (z & O | M & (z ^ O)) >>> 0, WA = y + W + V + Ow0[p][1] + Q[p][1], G = n + D + K + Ow0[p][0] + Q[p][0] + (WA / 4294967296 >>> 0) >>> 0, Z = WA >>> 0, WA = I + H, Y = X + F + (WA / 4294967296 >>> 0) >>> 0, J = WA >>> 0, n = f, y = AA, f = S, AA = u, S = x, u = b, WA = j + Z, x = _ + G + (WA / 4294967296 >>> 0) >>> 0, b = WA >>> 0, _ = L, j = M, L = $, M = O, $ = E, O = z, WA = Z + J, E = G + Y + (WA / 4294967296 >>> 0) >>> 0, z = WA >>> 0;
      WA = A[0][1] + z, A[0][0] = A[0][0] + E + (WA / 4294967296 >>> 0) >>> 0, A[0][1] = WA >>> 0, WA = A[1][1] + O, A[1][0] = A[1][0] + $ + (WA / 4294967296 >>> 0) >>> 0, A[1][1] = WA >>> 0, WA = A[2][1] + M, A[2][0] = A[2][0] + L + (WA / 4294967296 >>> 0) >>> 0, A[2][1] = WA >>> 0, WA = A[3][1] + j, A[3][0] = A[3][0] + _ + (WA / 4294967296 >>> 0) >>> 0, A[3][1] = WA >>> 0, WA = A[4][1] + b, A[4][0] = A[4][0] + x + (WA / 4294967296 >>> 0) >>> 0, A[4][1] = WA >>> 0, WA = A[5][1] + u, A[5][0] = A[5][0] + S + (WA / 4294967296 >>> 0) >>> 0, A[5][1] = WA >>> 0, WA = A[6][1] + AA, A[6][0] = A[6][0] + f + (WA / 4294967296 >>> 0) >>> 0, A[6][1] = WA >>> 0, WA = A[7][1] + y, A[7][0] = A[7][0] + n + (WA / 4294967296 >>> 0) >>> 0, A[7][1] = WA >>> 0, OA -= 128
    }
  }
})
// @from(Ln 379807, Col 4)
ga2 = U((e07) => {
  var t07 = H8();
  Nx();
  var pF = t07.asn1;
  e07.privateKeyValidator = {
    name: "PrivateKeyInfo",
    tagClass: pF.Class.UNIVERSAL,
    type: pF.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "PrivateKeyInfo.version",
      tagClass: pF.Class.UNIVERSAL,
      type: pF.Type.INTEGER,
      constructed: !1,
      capture: "privateKeyVersion"
    }, {
      name: "PrivateKeyInfo.privateKeyAlgorithm",
      tagClass: pF.Class.UNIVERSAL,
      type: pF.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "AlgorithmIdentifier.algorithm",
        tagClass: pF.Class.UNIVERSAL,
        type: pF.Type.OID,
        constructed: !1,
        capture: "privateKeyOid"
      }]
    }, {
      name: "PrivateKeyInfo",
      tagClass: pF.Class.UNIVERSAL,
      type: pF.Type.OCTETSTRING,
      constructed: !1,
      capture: "privateKey"
    }]
  };
  e07.publicKeyValidator = {
    name: "SubjectPublicKeyInfo",
    tagClass: pF.Class.UNIVERSAL,
    type: pF.Type.SEQUENCE,
    constructed: !0,
    captureAsn1: "subjectPublicKeyInfo",
    value: [{
      name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
      tagClass: pF.Class.UNIVERSAL,
      type: pF.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "AlgorithmIdentifier.algorithm",
        tagClass: pF.Class.UNIVERSAL,
        type: pF.Type.OID,
        constructed: !1,
        capture: "publicKeyOid"
      }]
    }, {
      tagClass: pF.Class.UNIVERSAL,
      type: pF.Type.BITSTRING,
      constructed: !1,
      composed: !0,
      captureBitStringValue: "ed25519PublicKey"
    }]
  }
})
// @from(Ln 379869, Col 4)
sa2 = U((RXY, ra2) => {
  var SE = H8();
  kfA();
  Xj();
  Mw0();
  _7();
  var pa2 = ga2(),
    BQ7 = pa2.publicKeyValidator,
    GQ7 = pa2.privateKeyValidator;
  if (typeof jw0 > "u") jw0 = SE.jsbn.BigInteger;
  var jw0, Tw0 = SE.util.ByteBuffer,
    Dw = typeof Buffer > "u" ? Uint8Array : Buffer;
  SE.pki = SE.pki || {};
  ra2.exports = SE.pki.ed25519 = SE.ed25519 = SE.ed25519 || {};
  var z5 = SE.ed25519;
  z5.constants = {};
  z5.constants.PUBLIC_KEY_BYTE_LENGTH = 32;
  z5.constants.PRIVATE_KEY_BYTE_LENGTH = 64;
  z5.constants.SEED_BYTE_LENGTH = 32;
  z5.constants.SIGN_BYTE_LENGTH = 64;
  z5.constants.HASH_BYTE_LENGTH = 64;
  z5.generateKeyPair = function (A) {
    A = A || {};
    var Q = A.seed;
    if (Q === void 0) Q = SE.random.getBytesSync(z5.constants.SEED_BYTE_LENGTH);
    else if (typeof Q === "string") {
      if (Q.length !== z5.constants.SEED_BYTE_LENGTH) throw TypeError('"seed" must be ' + z5.constants.SEED_BYTE_LENGTH + " bytes in length.")
    } else if (!(Q instanceof Uint8Array)) throw TypeError('"seed" must be a node.js Buffer, Uint8Array, or a binary string.');
    Q = mc({
      message: Q,
      encoding: "binary"
    });
    var B = new Dw(z5.constants.PUBLIC_KEY_BYTE_LENGTH),
      G = new Dw(z5.constants.PRIVATE_KEY_BYTE_LENGTH);
    for (var Z = 0; Z < 32; ++Z) G[Z] = Q[Z];
    return XQ7(B, G), {
      publicKey: B,
      privateKey: G
    }
  };
  z5.privateKeyFromAsn1 = function (A) {
    var Q = {},
      B = [],
      G = SE.asn1.validate(A, GQ7, Q, B);
    if (!G) {
      var Z = Error("Invalid Key.");
      throw Z.errors = B, Z
    }
    var Y = SE.asn1.derToOid(Q.privateKeyOid),
      J = SE.oids.EdDSA25519;
    if (Y !== J) throw Error('Invalid OID "' + Y + '"; OID must be "' + J + '".');
    var X = Q.privateKey,
      I = mc({
        message: SE.asn1.fromDer(X).value,
        encoding: "binary"
      });
    return {
      privateKeyBytes: I
    }
  };
  z5.publicKeyFromAsn1 = function (A) {
    var Q = {},
      B = [],
      G = SE.asn1.validate(A, BQ7, Q, B);
    if (!G) {
      var Z = Error("Invalid Key.");
      throw Z.errors = B, Z
    }
    var Y = SE.asn1.derToOid(Q.publicKeyOid),
      J = SE.oids.EdDSA25519;
    if (Y !== J) throw Error('Invalid OID "' + Y + '"; OID must be "' + J + '".');
    var X = Q.ed25519PublicKey;
    if (X.length !== z5.constants.PUBLIC_KEY_BYTE_LENGTH) throw Error("Key length is invalid.");
    return mc({
      message: X,
      encoding: "binary"
    })
  };
  z5.publicKeyFromPrivateKey = function (A) {
    A = A || {};
    var Q = mc({
      message: A.privateKey,
      encoding: "binary"
    });
    if (Q.length !== z5.constants.PRIVATE_KEY_BYTE_LENGTH) throw TypeError('"options.privateKey" must have a byte length of ' + z5.constants.PRIVATE_KEY_BYTE_LENGTH);
    var B = new Dw(z5.constants.PUBLIC_KEY_BYTE_LENGTH);
    for (var G = 0; G < B.length; ++G) B[G] = Q[32 + G];
    return B
  };
  z5.sign = function (A) {
    A = A || {};
    var Q = mc(A),
      B = mc({
        message: A.privateKey,
        encoding: "binary"
      });
    if (B.length === z5.constants.SEED_BYTE_LENGTH) {
      var G = z5.generateKeyPair({
        seed: B
      });
      B = G.privateKey
    } else if (B.length !== z5.constants.PRIVATE_KEY_BYTE_LENGTH) throw TypeError('"options.privateKey" must have a byte length of ' + z5.constants.SEED_BYTE_LENGTH + " or " + z5.constants.PRIVATE_KEY_BYTE_LENGTH);
    var Z = new Dw(z5.constants.SIGN_BYTE_LENGTH + Q.length);
    IQ7(Z, Q, Q.length, B);
    var Y = new Dw(z5.constants.SIGN_BYTE_LENGTH);
    for (var J = 0; J < Y.length; ++J) Y[J] = Z[J];
    return Y
  };
  z5.verify = function (A) {
    A = A || {};
    var Q = mc(A);
    if (A.signature === void 0) throw TypeError('"options.signature" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a binary string.');
    var B = mc({
      message: A.signature,
      encoding: "binary"
    });
    if (B.length !== z5.constants.SIGN_BYTE_LENGTH) throw TypeError('"options.signature" must have a byte length of ' + z5.constants.SIGN_BYTE_LENGTH);
    var G = mc({
      message: A.publicKey,
      encoding: "binary"
    });
    if (G.length !== z5.constants.PUBLIC_KEY_BYTE_LENGTH) throw TypeError('"options.publicKey" must have a byte length of ' + z5.constants.PUBLIC_KEY_BYTE_LENGTH);
    var Z = new Dw(z5.constants.SIGN_BYTE_LENGTH + Q.length),
      Y = new Dw(z5.constants.SIGN_BYTE_LENGTH + Q.length),
      J;
    for (J = 0; J < z5.constants.SIGN_BYTE_LENGTH; ++J) Z[J] = B[J];
    for (J = 0; J < Q.length; ++J) Z[J + z5.constants.SIGN_BYTE_LENGTH] = Q[J];
    return DQ7(Y, Z, Z.length, G) >= 0
  };

  function mc(A) {
    var Q = A.message;
    if (Q instanceof Uint8Array || Q instanceof Dw) return Q;
    var B = A.encoding;
    if (Q === void 0)
      if (A.md) Q = A.md.digest().getBytes(), B = "binary";
      else throw TypeError('"options.message" or "options.md" not specified.');
    if (typeof Q === "string" && !B) throw TypeError('"options.encoding" must be "binary" or "utf8".');
    if (typeof Q === "string") {
      if (typeof Buffer < "u") return Buffer.from(Q, B);
      Q = new Tw0(Q, B)
    } else if (!(Q instanceof Tw0)) throw TypeError('"options.message" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a string with "options.encoding" specifying its encoding.');
    var G = new Dw(Q.length());
    for (var Z = 0; Z < G.length; ++Z) G[Z] = Q.at(Z);
    return G
  }
  var Pw0 = l4(),
    XF1 = l4([1]),
    ZQ7 = l4([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]),
    YQ7 = l4([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]),
    ua2 = l4([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]),
    ma2 = l4([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]),
    Rw0 = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]),
    JQ7 = l4([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);

  function mfA(A, Q) {
    var B = SE.md.sha512.create(),
      G = new Tw0(A);
    B.update(G.getBytes(Q), "binary");
    var Z = B.digest().getBytes();
    if (typeof Buffer < "u") return Buffer.from(Z, "binary");
    var Y = new Dw(z5.constants.HASH_BYTE_LENGTH);
    for (var J = 0; J < 64; ++J) Y[J] = Z.charCodeAt(J);
    return Y
  }

  function XQ7(A, Q) {
    var B = [l4(), l4(), l4(), l4()],
      G, Z = mfA(Q, 32);
    Z[0] &= 248, Z[31] &= 127, Z[31] |= 64, vw0(B, Z), yw0(A, B);
    for (G = 0; G < 32; ++G) Q[G + 32] = A[G];
    return 0
  }

  function IQ7(A, Q, B, G) {
    var Z, Y, J = new Float64Array(64),
      X = [l4(), l4(), l4(), l4()],
      I = mfA(G, 32);
    I[0] &= 248, I[31] &= 127, I[31] |= 64;
    var D = B + 64;
    for (Z = 0; Z < B; ++Z) A[64 + Z] = Q[Z];
    for (Z = 0; Z < 32; ++Z) A[32 + Z] = I[32 + Z];
    var W = mfA(A.subarray(32), B + 32);
    Sw0(W), vw0(X, W), yw0(A, X);
    for (Z = 32; Z < 64; ++Z) A[Z] = G[Z];
    var K = mfA(A, B + 64);
    Sw0(K);
    for (Z = 32; Z < 64; ++Z) J[Z] = 0;
    for (Z = 0; Z < 32; ++Z) J[Z] = W[Z];
    for (Z = 0; Z < 32; ++Z)
      for (Y = 0; Y < 32; Y++) J[Z + Y] += K[Z] * I[Y];
    return la2(A.subarray(32), J), D
  }

  function DQ7(A, Q, B, G) {
    var Z, Y, J = new Dw(32),
      X = [l4(), l4(), l4(), l4()],
      I = [l4(), l4(), l4(), l4()];
    if (Y = -1, B < 64) return -1;
    if (WQ7(I, G)) return -1;
    for (Z = 0; Z < B; ++Z) A[Z] = Q[Z];
    for (Z = 0; Z < 32; ++Z) A[Z + 32] = G[Z];
    var D = mfA(A, B);
    if (Sw0(D), aa2(X, I, D), vw0(I, Q.subarray(32)), xw0(X, I), yw0(J, X), B -= 64, ia2(Q, 0, J, 0)) {
      for (Z = 0; Z < B; ++Z) A[Z] = 0;
      return -1
    }
    for (Z = 0; Z < B; ++Z) A[Z] = Q[Z + 64];
    return Y = B, Y
  }

  function la2(A, Q) {
    var B, G, Z, Y;
    for (G = 63; G >= 32; --G) {
      B = 0;
      for (Z = G - 32, Y = G - 12; Z < Y; ++Z) Q[Z] += B - 16 * Q[G] * Rw0[Z - (G - 32)], B = Q[Z] + 128 >> 8, Q[Z] -= B * 256;
      Q[Z] += B, Q[G] = 0
    }
    B = 0;
    for (Z = 0; Z < 32; ++Z) Q[Z] += B - (Q[31] >> 4) * Rw0[Z], B = Q[Z] >> 8, Q[Z] &= 255;
    for (Z = 0; Z < 32; ++Z) Q[Z] -= B * Rw0[Z];
    for (G = 0; G < 32; ++G) Q[G + 1] += Q[G] >> 8, A[G] = Q[G] & 255
  }

  function Sw0(A) {
    var Q = new Float64Array(64);
    for (var B = 0; B < 64; ++B) Q[B] = A[B], A[B] = 0;
    la2(A, Q)
  }

  function xw0(A, Q) {
    var B = l4(),
      G = l4(),
      Z = l4(),
      Y = l4(),
      J = l4(),
      X = l4(),
      I = l4(),
      D = l4(),
      W = l4();
    yEA(B, A[1], A[0]), yEA(W, Q[1], Q[0]), qY(B, B, W), xEA(G, A[0], A[1]), xEA(W, Q[0], Q[1]), qY(G, G, W), qY(Z, A[3], Q[3]), qY(Z, Z, YQ7), qY(Y, A[2], Q[2]), xEA(Y, Y, Y), yEA(J, G, B), yEA(X, Y, Z), xEA(I, Y, Z), xEA(D, G, B), qY(A[0], J, X), qY(A[1], D, I), qY(A[2], I, X), qY(A[3], J, D)
  }

  function da2(A, Q, B) {
    for (var G = 0; G < 4; ++G) oa2(A[G], Q[G], B)
  }

  function yw0(A, Q) {
    var B = l4(),
      G = l4(),
      Z = l4();
    HQ7(Z, Q[2]), qY(B, Q[0], Z), qY(G, Q[1], Z), IF1(A, G), A[31] ^= na2(B) << 7
  }

  function IF1(A, Q) {
    var B, G, Z, Y = l4(),
      J = l4();
    for (B = 0; B < 16; ++B) J[B] = Q[B];
    _w0(J), _w0(J), _w0(J);
    for (G = 0; G < 2; ++G) {
      Y[0] = J[0] - 65517;
      for (B = 1; B < 15; ++B) Y[B] = J[B] - 65535 - (Y[B - 1] >> 16 & 1), Y[B - 1] &= 65535;
      Y[15] = J[15] - 32767 - (Y[14] >> 16 & 1), Z = Y[15] >> 16 & 1, Y[14] &= 65535, oa2(J, Y, 1 - Z)
    }
    for (B = 0; B < 16; B++) A[2 * B] = J[B] & 255, A[2 * B + 1] = J[B] >> 8
  }

  function WQ7(A, Q) {
    var B = l4(),
      G = l4(),
      Z = l4(),
      Y = l4(),
      J = l4(),
      X = l4(),
      I = l4();
    if (ut(A[2], XF1), KQ7(A[1], Q), F3A(Z, A[1]), qY(Y, Z, ZQ7), yEA(Z, Z, A[2]), xEA(Y, A[2], Y), F3A(J, Y), F3A(X, J), qY(I, X, J), qY(B, I, Z), qY(B, B, Y), VQ7(B, B), qY(B, B, Z), qY(B, B, Y), qY(B, B, Y), qY(A[0], B, Y), F3A(G, A[0]), qY(G, G, Y), ca2(G, Z)) qY(A[0], A[0], JQ7);
    if (F3A(G, A[0]), qY(G, G, Y), ca2(G, Z)) return -1;
    if (na2(A[0]) === Q[31] >> 7) yEA(A[0], Pw0, A[0]);
    return qY(A[3], A[0], A[1]), 0
  }

  function KQ7(A, Q) {
    var B;
    for (B = 0; B < 16; ++B) A[B] = Q[2 * B] + (Q[2 * B + 1] << 8);
    A[15] &= 32767
  }

  function VQ7(A, Q) {
    var B = l4(),
      G;
    for (G = 0; G < 16; ++G) B[G] = Q[G];
    for (G = 250; G >= 0; --G)
      if (F3A(B, B), G !== 1) qY(B, B, Q);
    for (G = 0; G < 16; ++G) A[G] = B[G]
  }

  function ca2(A, Q) {
    var B = new Dw(32),
      G = new Dw(32);
    return IF1(B, A), IF1(G, Q), ia2(B, 0, G, 0)
  }

  function ia2(A, Q, B, G) {
    return FQ7(A, Q, B, G, 32)
  }

  function FQ7(A, Q, B, G, Z) {
    var Y, J = 0;
    for (Y = 0; Y < Z; ++Y) J |= A[Q + Y] ^ B[G + Y];
    return (1 & J - 1 >>> 8) - 1
  }

  function na2(A) {
    var Q = new Dw(32);
    return IF1(Q, A), Q[0] & 1
  }

  function aa2(A, Q, B) {
    var G, Z;
    ut(A[0], Pw0), ut(A[1], XF1), ut(A[2], XF1), ut(A[3], Pw0);
    for (Z = 255; Z >= 0; --Z) G = B[Z / 8 | 0] >> (Z & 7) & 1, da2(A, Q, G), xw0(Q, A), xw0(A, A), da2(A, Q, G)
  }

  function vw0(A, Q) {
    var B = [l4(), l4(), l4(), l4()];
    ut(B[0], ua2), ut(B[1], ma2), ut(B[2], XF1), qY(B[3], ua2, ma2), aa2(A, B, Q)
  }

  function ut(A, Q) {
    var B;
    for (B = 0; B < 16; B++) A[B] = Q[B] | 0
  }

  function HQ7(A, Q) {
    var B = l4(),
      G;
    for (G = 0; G < 16; ++G) B[G] = Q[G];
    for (G = 253; G >= 0; --G)
      if (F3A(B, B), G !== 2 && G !== 4) qY(B, B, Q);
    for (G = 0; G < 16; ++G) A[G] = B[G]
  }

  function _w0(A) {
    var Q, B, G = 1;
    for (Q = 0; Q < 16; ++Q) B = A[Q] + G + 65535, G = Math.floor(B / 65536), A[Q] = B - G * 65536;
    A[0] += G - 1 + 37 * (G - 1)
  }

  function oa2(A, Q, B) {
    var G, Z = ~(B - 1);
    for (var Y = 0; Y < 16; ++Y) G = Z & (A[Y] ^ Q[Y]), A[Y] ^= G, Q[Y] ^= G
  }

  function l4(A) {
    var Q, B = new Float64Array(16);
    if (A)
      for (Q = 0; Q < A.length; ++Q) B[Q] = A[Q];
    return B
  }

  function xEA(A, Q, B) {
    for (var G = 0; G < 16; ++G) A[G] = Q[G] + B[G]
  }

  function yEA(A, Q, B) {
    for (var G = 0; G < 16; ++G) A[G] = Q[G] - B[G]
  }

  function F3A(A, Q) {
    qY(A, Q, Q)
  }

  function qY(A, Q, B) {
    var G, Z, Y = 0,
      J = 0,
      X = 0,
      I = 0,
      D = 0,
      W = 0,
      K = 0,
      V = 0,
      F = 0,
      H = 0,
      E = 0,
      z = 0,
      $ = 0,
      O = 0,
      L = 0,
      M = 0,
      _ = 0,
      j = 0,
      x = 0,
      b = 0,
      S = 0,
      u = 0,
      f = 0,
      AA = 0,
      n = 0,
      y = 0,
      p = 0,
      GA = 0,
      WA = 0,
      MA = 0,
      TA = 0,
      bA = B[0],
      jA = B[1],
      OA = B[2],
      IA = B[3],
      HA = B[4],
      ZA = B[5],
      zA = B[6],
      wA = B[7],
      _A = B[8],
      s = B[9],
      t = B[10],
      BA = B[11],
      DA = B[12],
      CA = B[13],
      FA = B[14],
      xA = B[15];
    G = Q[0], Y += G * bA, J += G * jA, X += G * OA, I += G * IA, D += G * HA, W += G * ZA, K += G * zA, V += G * wA, F += G * _A, H += G * s, E += G * t, z += G * BA, $ += G * DA, O += G * CA, L += G * FA, M += G * xA, G = Q[1], J += G * bA, X += G * jA, I += G * OA, D += G * IA, W += G * HA, K += G * ZA, V += G * zA, F += G * wA, H += G * _A, E += G * s, z += G * t, $ += G * BA, O += G * DA, L += G * CA, M += G * FA, _ += G * xA, G = Q[2], X += G * bA, I += G * jA, D += G * OA, W += G * IA, K += G * HA, V += G * ZA, F += G * zA, H += G * wA, E += G * _A, z += G * s, $ += G * t, O += G * BA, L += G * DA, M += G * CA, _ += G * FA, j += G * xA, G = Q[3], I += G * bA, D += G * jA, W += G * OA, K += G * IA, V += G * HA, F += G * ZA, H += G * zA, E += G * wA, z += G * _A, $ += G * s, O += G * t, L += G * BA, M += G * DA, _ += G * CA, j += G * FA, x += G * xA, G = Q[4], D += G * bA, W += G * jA, K += G * OA, V += G * IA, F += G * HA, H += G * ZA, E += G * zA, z += G * wA, $ += G * _A, O += G * s, L += G * t, M += G * BA, _ += G * DA, j += G * CA, x += G * FA, b += G * xA, G = Q[5], W += G * bA, K += G * jA, V += G * OA, F += G * IA, H += G * HA, E += G * ZA, z += G * zA, $ += G * wA, O += G * _A, L += G * s, M += G * t, _ += G * BA, j += G * DA, x += G * CA, b += G * FA, S += G * xA, G = Q[6], K += G * bA, V += G * jA, F += G * OA, H += G * IA, E += G * HA, z += G * ZA, $ += G * zA, O += G * wA, L += G * _A, M += G * s, _ += G * t, j += G * BA, x += G * DA, b += G * CA, S += G * FA, u += G * xA, G = Q[7], V += G * bA, F += G * jA, H += G * OA, E += G * IA, z += G * HA, $ += G * ZA, O += G * zA, L += G * wA, M += G * _A, _ += G * s, j += G * t, x += G * BA, b += G * DA, S += G * CA, u += G * FA, f += G * xA, G = Q[8], F += G * bA, H += G * jA, E += G * OA, z += G * IA, $ += G * HA, O += G * ZA, L += G * zA, M += G * wA, _ += G * _A, j += G * s, x += G * t, b += G * BA, S += G * DA, u += G * CA, f += G * FA, AA += G * xA, G = Q[9], H += G * bA, E += G * jA, z += G * OA, $ += G * IA, O += G * HA, L += G * ZA, M += G * zA, _ += G * wA, j += G * _A, x += G * s, b += G * t, S += G * BA, u += G * DA, f += G * CA, AA += G * FA, n += G * xA, G = Q[10], E += G * bA, z += G * jA, $ += G * OA, O += G * IA, L += G * HA, M += G * ZA, _ += G * zA, j += G * wA, x += G * _A, b += G * s, S += G * t, u += G * BA, f += G * DA, AA += G * CA, n += G * FA, y += G * xA, G = Q[11], z += G * bA, $ += G * jA, O += G * OA, L += G * IA, M += G * HA, _ += G * ZA, j += G * zA, x += G * wA, b += G * _A, S += G * s, u += G * t, f += G * BA, AA += G * DA, n += G * CA, y += G * FA, p += G * xA, G = Q[12], $ += G * bA, O += G * jA, L += G * OA, M += G * IA, _ += G * HA, j += G * ZA, x += G * zA, b += G * wA, S += G * _A, u += G * s, f += G * t, AA += G * BA, n += G * DA, y += G * CA, p += G * FA, GA += G * xA, G = Q[13], O += G * bA, L += G * jA, M += G * OA, _ += G * IA, j += G * HA, x += G * ZA, b += G * zA, S += G * wA, u += G * _A, f += G * s, AA += G * t, n += G * BA, y += G * DA, p += G * CA, GA += G * FA, WA += G * xA, G = Q[14], L += G * bA, M += G * jA, _ += G * OA, j += G * IA, x += G * HA, b += G * ZA, S += G * zA, u += G * wA, f += G * _A, AA += G * s, n += G * t, y += G * BA, p += G * DA, GA += G * CA, WA += G * FA, MA += G * xA, G = Q[15], M += G * bA, _ += G * jA, j += G * OA, x += G * IA, b += G * HA, S += G * ZA, u += G * zA, f += G * wA, AA += G * _A, n += G * s, y += G * t, p += G * BA, GA += G * DA, WA += G * CA, MA += G * FA, TA += G * xA, Y += 38 * _, J += 38 * j, X += 38 * x, I += 38 * b, D += 38 * S, W += 38 * u, K += 38 * f, V += 38 * AA, F += 38 * n, H += 38 * y, E += 38 * p, z += 38 * GA, $ += 38 * WA, O += 38 * MA, L += 38 * TA, Z = 1, G = Y + Z + 65535, Z = Math.floor(G / 65536), Y = G - Z * 65536, G = J + Z + 65535, Z = Math.floor(G / 65536), J = G - Z * 65536, G = X + Z + 65535, Z = Math.floor(G / 65536), X = G - Z * 65536, G = I + Z + 65535, Z = Math.floor(G / 65536), I = G - Z * 65536, G = D + Z + 65535, Z = Math.floor(G / 65536), D = G - Z * 65536, G = W + Z + 65535, Z = Math.floor(G / 65536), W = G - Z * 65536, G = K + Z + 65535, Z = Math.floor(G / 65536), K = G - Z * 65536, G = V + Z + 65535, Z = Math.floor(G / 65536), V = G - Z * 65536, G = F + Z + 65535, Z = Math.floor(G / 65536), F = G - Z * 65536, G = H + Z + 65535, Z = Math.floor(G / 65536), H = G - Z * 65536, G = E + Z + 65535, Z = Math.floor(G / 65536), E = G - Z * 65536, G = z + Z + 65535, Z = Math.floor(G / 65536), z = G - Z * 65536, G = $ + Z + 65535, Z = Math.floor(G / 65536), $ = G - Z * 65536, G = O + Z + 65535, Z = Math.floor(G / 65536), O = G - Z * 65536, G = L + Z + 65535, Z = Math.floor(G / 65536), L = G - Z * 65536, G = M + Z + 65535, Z = Math.floor(G / 65536), M = G - Z * 65536, Y += Z - 1 + 37 * (Z - 1), Z = 1, G = Y + Z + 65535, Z = Math.floor(G / 65536), Y = G - Z * 65536, G = J + Z + 65535, Z = Math.floor(G / 65536), J = G - Z * 65536, G = X + Z + 65535, Z = Math.floor(G / 65536), X = G - Z * 65536, G = I + Z + 65535, Z = Math.floor(G / 65536), I = G - Z * 65536, G = D + Z + 65535, Z = Math.floor(G / 65536), D = G - Z * 65536, G = W + Z + 65535, Z = Math.floor(G / 65536), W = G - Z * 65536, G = K + Z + 65535, Z = Math.floor(G / 65536), K = G - Z * 65536, G = V + Z + 65535, Z = Math.floor(G / 65536), V = G - Z * 65536, G = F + Z + 65535, Z = Math.floor(G / 65536), F = G - Z * 65536, G = H + Z + 65535, Z = Math.floor(G / 65536), H = G - Z * 65536, G = E + Z + 65535, Z = Math.floor(G / 65536), E = G - Z * 65536, G = z + Z + 65535, Z = Math.floor(G / 65536), z = G - Z * 65536, G = $ + Z + 65535, Z = Math.floor(G / 65536), $ = G - Z * 65536, G = O + Z + 65535, Z = Math.floor(G / 65536), O = G - Z * 65536, G = L + Z + 65535, Z = Math.floor(G / 65536), L = G - Z * 65536, G = M + Z + 65535, Z = Math.floor(G / 65536), M = G - Z * 65536, Y += Z - 1 + 37 * (Z - 1), A[0] = Y, A[1] = J, A[2] = X, A[3] = I, A[4] = D, A[5] = W, A[6] = K, A[7] = V, A[8] = F, A[9] = H, A[10] = E, A[11] = z, A[12] = $, A[13] = O, A[14] = L, A[15] = M
  }
})
// @from(Ln 380292, Col 4)
Qo2 = U((_XY, Ao2) => {
  var mO = H8();
  _7();
  Xj();
  kfA();
  Ao2.exports = mO.kem = mO.kem || {};
  var ta2 = mO.jsbn.BigInteger;
  mO.kem.rsa = {};
  mO.kem.rsa.create = function (A, Q) {
    Q = Q || {};
    var B = Q.prng || mO.random,
      G = {};
    return G.encrypt = function (Z, Y) {
      var J = Math.ceil(Z.n.bitLength() / 8),
        X;
      do X = new ta2(mO.util.bytesToHex(B.getBytesSync(J)), 16).mod(Z.n); while (X.compareTo(ta2.ONE) <= 0);
      X = mO.util.hexToBytes(X.toString(16));
      var I = J - X.length;
      if (I > 0) X = mO.util.fillString(String.fromCharCode(0), I) + X;
      var D = Z.encrypt(X, "NONE"),
        W = A.generate(X, Y);
      return {
        encapsulation: D,
        key: W
      }
    }, G.decrypt = function (Z, Y, J) {
      var X = Z.decrypt(Y, "NONE");
      return A.generate(X, J)
    }, G
  };
  mO.kem.kdf1 = function (A, Q) {
    ea2(this, A, 0, Q || A.digestLength)
  };
  mO.kem.kdf2 = function (A, Q) {
    ea2(this, A, 1, Q || A.digestLength)
  };

  function ea2(A, Q, B, G) {
    A.generate = function (Z, Y) {
      var J = new mO.util.ByteBuffer,
        X = Math.ceil(Y / G) + B,
        I = new mO.util.ByteBuffer;
      for (var D = B; D < X; ++D) {
        I.putInt32(D), Q.start(), Q.update(Z + I.getBytes());
        var W = Q.digest();
        J.putBytes(W.getBytes(G))
      }
      return J.truncate(J.length() - Y), J.getBytes()
    }
  }
})
// @from(Ln 380343, Col 4)
Go2 = U((jXY, Bo2) => {
  var f5 = H8();
  _7();
  Bo2.exports = f5.log = f5.log || {};
  f5.log.levels = ["none", "error", "warning", "info", "debug", "verbose", "max"];
  var KF1 = {},
    kw0 = [],
    dfA = null;
  f5.log.LEVEL_LOCKED = 2;
  f5.log.NO_LEVEL_CHECK = 4;
  f5.log.INTERPOLATE = 8;
  for (Fj = 0; Fj < f5.log.levels.length; ++Fj) DF1 = f5.log.levels[Fj], KF1[DF1] = {
    index: Fj,
    name: DF1.toUpperCase()
  };
  var DF1, Fj;
  f5.log.logMessage = function (A) {
    var Q = KF1[A.level].index;
    for (var B = 0; B < kw0.length; ++B) {
      var G = kw0[B];
      if (G.flags & f5.log.NO_LEVEL_CHECK) G.f(A);
      else {
        var Z = KF1[G.level].index;
        if (Q <= Z) G.f(G, A)
      }
    }
  };
  f5.log.prepareStandard = function (A) {
    if (!("standard" in A)) A.standard = KF1[A.level].name + " [" + A.category + "] " + A.message
  };
  f5.log.prepareFull = function (A) {
    if (!("full" in A)) {
      var Q = [A.message];
      Q = Q.concat([]), A.full = f5.util.format.apply(this, Q)
    }
  };
  f5.log.prepareStandardFull = function (A) {
    if (!("standardFull" in A)) f5.log.prepareStandard(A), A.standardFull = A.standard
  };
  WF1 = ["error", "warning", "info", "debug", "verbose"];
  for (Fj = 0; Fj < WF1.length; ++Fj)(function (Q) {
    f5.log[Q] = function (B, G) {
      var Z = Array.prototype.slice.call(arguments).slice(2),
        Y = {
          timestamp: new Date,
          level: Q,
          category: B,
          message: G,
          arguments: Z
        };
      f5.log.logMessage(Y)
    }
  })(WF1[Fj]);
  var WF1, Fj;
  f5.log.makeLogger = function (A) {
    var Q = {
      flags: 0,
      f: A
    };
    return f5.log.setLevel(Q, "none"), Q
  };
  f5.log.setLevel = function (A, Q) {
    var B = !1;
    if (A && !(A.flags & f5.log.LEVEL_LOCKED))
      for (var G = 0; G < f5.log.levels.length; ++G) {
        var Z = f5.log.levels[G];
        if (Q == Z) {
          A.level = Q, B = !0;
          break
        }
      }
    return B
  };
  f5.log.lock = function (A, Q) {
    if (typeof Q > "u" || Q) A.flags |= f5.log.LEVEL_LOCKED;
    else A.flags &= ~f5.log.LEVEL_LOCKED
  };
  f5.log.addLogger = function (A) {
    kw0.push(A)
  };
  if (typeof console < "u" && "log" in console) {
    if (console.error && console.warn && console.info && console.debug) bw0 = {
      error: console.error,
      warning: console.warn,
      info: console.info,
      debug: console.debug,
      verbose: console.debug
    }, kEA = function (A, Q) {
      f5.log.prepareStandard(Q);
      var B = bw0[Q.level],
        G = [Q.standard];
      G = G.concat(Q.arguments.slice()), B.apply(console, G)
    }, H3A = f5.log.makeLogger(kEA);
    else kEA = function (Q, B) {
      f5.log.prepareStandardFull(B), console.log(B.standardFull)
    }, H3A = f5.log.makeLogger(kEA);
    f5.log.setLevel(H3A, "debug"), f5.log.addLogger(H3A), dfA = H3A
  } else console = {
    log: function () {}
  };
  var H3A, bw0, kEA;
  if (dfA !== null && typeof window < "u" && window.location) {
    if (vEA = new URL(window.location.href).searchParams, vEA.has("console.level")) f5.log.setLevel(dfA, vEA.get("console.level").slice(-1)[0]);
    if (vEA.has("console.lock")) {
      if (fw0 = vEA.get("console.lock").slice(-1)[0], fw0 == "true") f5.log.lock(dfA)
    }
  }
  var vEA, fw0;
  f5.log.consoleLogger = dfA
})
// @from(Ln 380453, Col 4)
Yo2 = U((TXY, Zo2) => {
  Zo2.exports = Sf();
  cV1();
  _EA();
  oN0();
  Mw0()
})