
// @from(Ln 250922, Col 4)
Jl1 = p((Dhw, TL4) => {
    var s7 = p_();
    mp();
    rL6();
    dC8();
    NH6();
    Al1();
    Hx();
    tL6();
    RA();
    var Ob8 = function(q, K, _, z) {
            var Y = s7.util.createBuffer(),
                A = q.length >> 1,
                O = A + (q.length & 1),
                w = q.substr(0, O),
                $ = q.substr(A, O),
                j = s7.util.createBuffer(),
                H = s7.hmac.create();
            _ = K + _;
            var J = Math.ceil(z / 16),
                X = Math.ceil(z / 20);
            H.start("MD5", w);
            var M = s7.util.createBuffer();
            j.putBytes(_);
            for (var P = 0; P < J; ++P) H.start(null, null), H.update(j.getBytes()), j.putBuffer(H.digest()), H.start(null, null), H.update(j.bytes() + _), M.putBuffer(H.digest());
            H.start("SHA1", $);
            var W = s7.util.createBuffer();
            j.clear(), j.putBytes(_);
            for (var P = 0; P < X; ++P) H.start(null, null), H.update(j.getBytes()), j.putBuffer(H.digest()), H.start(null, null), H.update(j.bytes() + _), W.putBuffer(H.digest());
            return Y.putBytes(s7.util.xorBytes(M.getBytes(), W.getBytes(), z)), Y
        },
        fjz = function(q, K, _) {
            var z = s7.hmac.create();
            z.start("SHA1", q);
            var Y = s7.util.createBuffer();
            return Y.putInt32(K[0]), Y.putInt32(K[1]), Y.putByte(_.type), Y.putByte(_.version.major), Y.putByte(_.version.minor), Y.putInt16(_.length), Y.putBytes(_.fragment.bytes()), z.update(Y.getBytes()), z.digest().getBytes()
        },
        Gjz = function(q, K, _) {
            var z = !1;
            try {
                var Y = q.deflate(K.fragment.getBytes());
                K.fragment = s7.util.createBuffer(Y), K.length = Y.length, z = !0
            } catch (A) {}
            return z
        },
        vjz = function(q, K, _) {
            var z = !1;
            try {
                var Y = q.inflate(K.fragment.getBytes());
                K.fragment = s7.util.createBuffer(Y), K.length = Y.length, z = !0
            } catch (A) {}
            return z
        },
        BR = function(q, K) {
            var _ = 0;
            switch (K) {
                case 1:
                    _ = q.getByte();
                    break;
                case 2:
                    _ = q.getInt16();
                    break;
                case 3:
                    _ = q.getInt24();
                    break;
                case 4:
                    _ = q.getInt32();
                    break
            }
            return s7.util.createBuffer(q.getBytes(_))
        },
        Px = function(q, K, _) {
            q.putInt(_.length(), K << 3), q.putBuffer(_)
        },
        P8 = {};
    P8.Versions = {
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
    P8.SupportedVersions = [P8.Versions.TLS_1_1, P8.Versions.TLS_1_0];
    P8.Version = P8.SupportedVersions[0];
    P8.MaxFragment = 15360;
    P8.ConnectionEnd = {
        server: 0,
        client: 1
    };
    P8.PRFAlgorithm = {
        tls_prf_sha256: 0
    };
    P8.BulkCipherAlgorithm = {
        none: null,
        rc4: 0,
        des3: 1,
        aes: 2
    };
    P8.CipherType = {
        stream: 0,
        block: 1,
        aead: 2
    };
    P8.MACAlgorithm = {
        none: null,
        hmac_md5: 0,
        hmac_sha1: 1,
        hmac_sha256: 2,
        hmac_sha384: 3,
        hmac_sha512: 4
    };
    P8.CompressionMethod = {
        none: 0,
        deflate: 1
    };
    P8.ContentType = {
        change_cipher_spec: 20,
        alert: 21,
        handshake: 22,
        application_data: 23,
        heartbeat: 24
    };
    P8.HandshakeType = {
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
    P8.Alert = {};
    P8.Alert.Level = {
        warning: 1,
        fatal: 2
    };
    P8.Alert.Description = {
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
    P8.HeartbeatMessageType = {
        heartbeat_request: 1,
        heartbeat_response: 2
    };
    P8.CipherSuites = {};
    P8.getCipherSuite = function(q) {
        var K = null;
        for (var _ in P8.CipherSuites) {
            var z = P8.CipherSuites[_];
            if (z.id[0] === q.charCodeAt(0) && z.id[1] === q.charCodeAt(1)) {
                K = z;
                break
            }
        }
        return K
    };
    P8.handleUnexpected = function(q, K) {
        var _ = !q.open && q.entity === P8.ConnectionEnd.client;
        if (!_) q.error(q, {
            message: "Unexpected message. Received TLS record out of order.",
            send: !0,
            alert: {
                level: P8.Alert.Level.fatal,
                description: P8.Alert.Description.unexpected_message
            }
        })
    };
    P8.handleHelloRequest = function(q, K, _) {
        if (!q.handshaking && q.handshakes > 0) P8.queue(q, P8.createAlert(q, {
            level: P8.Alert.Level.warning,
            description: P8.Alert.Description.no_renegotiation
        })), P8.flush(q);
        q.process()
    };
    P8.parseHelloMessage = function(q, K, _) {
        var z = null,
            Y = q.entity === P8.ConnectionEnd.client;
        if (_ < 38) q.error(q, {
            message: Y ? "Invalid ServerHello message. Message too short." : "Invalid ClientHello message. Message too short.",
            send: !0,
            alert: {
                level: P8.Alert.Level.fatal,
                description: P8.Alert.Description.illegal_parameter
            }
        });
        else {
            var A = K.fragment,
                O = A.length();
            if (z = {
                    version: {
                        major: A.getByte(),
                        minor: A.getByte()
                    },
                    random: s7.util.createBuffer(A.getBytes(32)),
                    session_id: BR(A, 1),
                    extensions: []
                }, Y) z.cipher_suite = A.getBytes(2), z.compression_method = A.getByte();
            else z.cipher_suites = BR(A, 2), z.compression_methods = BR(A, 1);
            if (O = _ - (O - A.length()), O > 0) {
                var w = BR(A, 2);
                while (w.length() > 0) z.extensions.push({
                    type: [w.getByte(), w.getByte()],
                    data: BR(w, 2)
                });
                if (!Y)
                    for (var $ = 0; $ < z.extensions.length; ++$) {
                        var j = z.extensions[$];
                        if (j.type[0] === 0 && j.type[1] === 0) {
                            var H = BR(j.data, 2);
                            while (H.length() > 0) {
                                var J = H.getByte();
                                if (J !== 0) break;
                                q.session.extensions.server_name.serverNameList.push(BR(H, 2).getBytes())
                            }
                        }
                    }
            }
            if (q.session.version) {
                if (z.version.major !== q.session.version.major || z.version.minor !== q.session.version.minor) return q.error(q, {
                    message: "TLS version change is disallowed during renegotiation.",
                    send: !0,
                    alert: {
                        level: P8.Alert.Level.fatal,
                        description: P8.Alert.Description.protocol_version
                    }
                })
            }
            if (Y) q.session.cipherSuite = P8.getCipherSuite(z.cipher_suite);
            else {
                var X = s7.util.createBuffer(z.cipher_suites.bytes());
                while (X.length() > 0)
                    if (q.session.cipherSuite = P8.getCipherSuite(X.getBytes(2)), q.session.cipherSuite !== null) break
            }
            if (q.session.cipherSuite === null) return q.error(q, {
                message: "No cipher suites in common.",
                send: !0,
                alert: {
                    level: P8.Alert.Level.fatal,
                    description: P8.Alert.Description.handshake_failure
                },
                cipherSuite: s7.util.bytesToHex(z.cipher_suite)
            });
            if (Y) q.session.compressionMethod = z.compression_method;
            else q.session.compressionMethod = P8.CompressionMethod.none
        }
        return z
    };
    P8.createSecurityParameters = function(q, K) {
        var _ = q.entity === P8.ConnectionEnd.client,
            z = K.random.bytes(),
            Y = _ ? q.session.sp.client_random : z,
            A = _ ? z : P8.createRandom().getBytes();
        q.session.sp = {
            entity: q.entity,
            prf_algorithm: P8.PRFAlgorithm.tls_prf_sha256,
            bulk_cipher_algorithm: null,
            cipher_type: null,
            enc_key_length: null,
            block_length: null,
            fixed_iv_length: null,
            record_iv_length: null,
            mac_algorithm: null,
            mac_length: null,
            mac_key_length: null,
            compression_algorithm: q.session.compressionMethod,
            pre_master_secret: null,
            master_secret: null,
            client_random: Y,
            server_random: A
        }
    };
    P8.handleServerHello = function(q, K, _) {
        var z = P8.parseHelloMessage(q, K, _);
        if (q.fail) return;
        if (z.version.minor <= q.version.minor) q.version.minor = z.version.minor;
        else return q.error(q, {
            message: "Incompatible TLS version.",
            send: !0,
            alert: {
                level: P8.Alert.Level.fatal,
                description: P8.Alert.Description.protocol_version
            }
        });
        q.session.version = q.version;
        var Y = z.session_id.bytes();
        if (Y.length > 0 && Y === q.session.id) q.expect = DL4, q.session.resuming = !0, q.session.sp.server_random = z.random.bytes();
        else q.expect = Vjz, q.session.resuming = !1, P8.createSecurityParameters(q, z);
        q.session.id = Y, q.process()
    };
    P8.handleClientHello = function(q, K, _) {
        var z = P8.parseHelloMessage(q, K, _);
        if (q.fail) return;
        var Y = z.session_id.bytes(),
            A = null;
        if (q.sessionCache) {
            if (A = q.sessionCache.getSession(Y), A === null) Y = "";
            else if (A.version.major !== z.version.major || A.version.minor > z.version.minor) A = null, Y = ""
        }
        if (Y.length === 0) Y = s7.random.getBytes(32);
        if (q.session.id = Y, q.session.clientHelloVersion = z.version, q.session.sp = {}, A) q.version = q.session.version = A.version, q.session.sp = A.sp;
        else {
            var O;
            for (var w = 1; w < P8.SupportedVersions.length; ++w)
                if (O = P8.SupportedVersions[w], O.minor <= z.version.minor) break;
            q.version = {
                major: O.major,
                minor: O.minor
            }, q.session.version = q.version
        }
        if (A !== null) q.expect = jl1, q.session.resuming = !0, q.session.sp.client_random = z.random.bytes();
        else q.expect = q.verifyClient !== !1 ? Rjz : $l1, q.session.resuming = !1, P8.createSecurityParameters(q, z);
        if (q.open = !0, P8.queue(q, P8.createRecord(q, {
                type: P8.ContentType.handshake,
                data: P8.createServerHello(q)
            })), q.session.resuming) P8.queue(q, P8.createRecord(q, {
            type: P8.ContentType.change_cipher_spec,
            data: P8.createChangeCipherSpec()
        })), q.state.pending = P8.createConnectionState(q), q.state.current.write = q.state.pending.write, P8.queue(q, P8.createRecord(q, {
            type: P8.ContentType.handshake,
            data: P8.createFinished(q)
        }));
        else if (P8.queue(q, P8.createRecord(q, {
                type: P8.ContentType.handshake,
                data: P8.createCertificate(q)
            })), !q.fail) {
            if (P8.queue(q, P8.createRecord(q, {
                    type: P8.ContentType.handshake,
                    data: P8.createServerKeyExchange(q)
                })), q.verifyClient !== !1) P8.queue(q, P8.createRecord(q, {
                type: P8.ContentType.handshake,
                data: P8.createCertificateRequest(q)
            }));
            P8.queue(q, P8.createRecord(q, {
                type: P8.ContentType.handshake,
                data: P8.createServerHelloDone(q)
            }))
        }
        P8.flush(q), q.process()
    };
    P8.handleCertificate = function(q, K, _) {
        if (_ < 3) return q.error(q, {
            message: "Invalid Certificate message. Message too short.",
            send: !0,
            alert: {
                level: P8.Alert.Level.fatal,
                description: P8.Alert.Description.illegal_parameter
            }
        });
        var z = K.fragment,
            Y = {
                certificate_list: BR(z, 3)
            },
            A, O, w = [];
        try {
            while (Y.certificate_list.length() > 0) A = BR(Y.certificate_list, 3), O = s7.asn1.fromDer(A), A = s7.pki.certificateFromAsn1(O, !0), w.push(A)
        } catch (j) {
            return q.error(q, {
                message: "Could not parse certificate list.",
                cause: j,
                send: !0,
                alert: {
                    level: P8.Alert.Level.fatal,
                    description: P8.Alert.Description.bad_certificate
                }
            })
        }
        var $ = q.entity === P8.ConnectionEnd.client;
        if (($ || q.verifyClient === !0) && w.length === 0) q.error(q, {
            message: $ ? "No server certificate provided." : "No client certificate provided.",
            send: !0,
            alert: {
                level: P8.Alert.Level.fatal,
                description: P8.Alert.Description.illegal_parameter
            }
        });
        else if (w.length === 0) q.expect = $ ? PL4 : $l1;
        else {
            if ($) q.session.serverCertificate = w[0];
            else q.session.clientCertificate = w[0];
            if (P8.verifyCertificateChain(q, w)) q.expect = $ ? PL4 : $l1
        }
        q.process()
    };
    P8.handleServerKeyExchange = function(q, K, _) {
        if (_ > 0) return q.error(q, {
            message: "Invalid key parameters. Only RSA is supported.",
            send: !0,
            alert: {
                level: P8.Alert.Level.fatal,
                description: P8.Alert.Description.unsupported_certificate
            }
        });
        q.expect = kjz, q.process()
    };
    P8.handleClientKeyExchange = function(q, K, _) {
        if (_ < 48) return q.error(q, {
            message: "Invalid key parameters. Only RSA is supported.",
            send: !0,
            alert: {
                level: P8.Alert.Level.fatal,
                description: P8.Alert.Description.unsupported_certificate
            }
        });
        var z = K.fragment,
            Y = {
                enc_pre_master_secret: BR(z, 2).getBytes()
            },
            A = null;
        if (q.getPrivateKey) try {
            A = q.getPrivateKey(q, q.session.serverCertificate), A = s7.pki.privateKeyFromPem(A)
        } catch ($) {
            q.error(q, {
                message: "Could not get private key.",
                cause: $,
                send: !0,
                alert: {
                    level: P8.Alert.Level.fatal,
                    description: P8.Alert.Description.internal_error
                }
            })
        }
        if (A === null) return q.error(q, {
            message: "No private key set.",
            send: !0,
            alert: {
                level: P8.Alert.Level.fatal,
                description: P8.Alert.Description.internal_error
            }
        });
        try {
            var O = q.session.sp;
            O.pre_master_secret = A.decrypt(Y.enc_pre_master_secret);
            var w = q.session.clientHelloVersion;
            if (w.major !== O.pre_master_secret.charCodeAt(0) || w.minor !== O.pre_master_secret.charCodeAt(1)) throw Error("TLS version rollback attack detected.")
        } catch ($) {
            O.pre_master_secret = s7.random.getBytes(48)
        }
        if (q.expect = jl1, q.session.clientCertificate !== null) q.expect = Sjz;
        q.process()
    };
    P8.handleCertificateRequest = function(q, K, _) {
        if (_ < 3) return q.error(q, {
            message: "Invalid CertificateRequest. Message too short.",
            send: !0,
            alert: {
                level: P8.Alert.Level.fatal,
                description: P8.Alert.Description.illegal_parameter
            }
        });
        var z = K.fragment,
            Y = {
                certificate_types: BR(z, 1),
                certificate_authorities: BR(z, 2)
            };
        q.session.certificateRequest = Y, q.expect = Njz, q.process()
    };
    P8.handleCertificateVerify = function(q, K, _) {
        if (_ < 2) return q.error(q, {
            message: "Invalid CertificateVerify. Message too short.",
            send: !0,
            alert: {
                level: P8.Alert.Level.fatal,
                description: P8.Alert.Description.illegal_parameter
            }
        });
        var z = K.fragment;
        z.read -= 4;
        var Y = z.bytes();
        z.read += 4;
        var A = {
                signature: BR(z, 2).getBytes()
            },
            O = s7.util.createBuffer();
        O.putBuffer(q.session.md5.digest()), O.putBuffer(q.session.sha1.digest()), O = O.getBytes();
        try {
            var w = q.session.clientCertificate;
            if (!w.publicKey.verify(O, A.signature, "NONE")) throw Error("CertificateVerify signature does not match.");
            q.session.md5.update(Y), q.session.sha1.update(Y)
        } catch ($) {
            return q.error(q, {
                message: "Bad signature in CertificateVerify.",
                send: !0,
                alert: {
                    level: P8.Alert.Level.fatal,
                    description: P8.Alert.Description.handshake_failure
                }
            })
        }
        q.expect = jl1, q.process()
    };
    P8.handleServerHelloDone = function(q, K, _) {
        if (_ > 0) return q.error(q, {
            message: "Invalid ServerHelloDone message. Invalid length.",
            send: !0,
            alert: {
                level: P8.Alert.Level.fatal,
                description: P8.Alert.Description.record_overflow
            }
        });
        if (q.serverCertificate === null) {
            var z = {
                    message: "No server certificate provided. Not enough security.",
                    send: !0,
                    alert: {
                        level: P8.Alert.Level.fatal,
                        description: P8.Alert.Description.insufficient_security
                    }
                },
                Y = 0,
                A = q.verify(q, z.alert.description, Y, []);
            if (A !== !0) {
                if (A || A === 0) {
                    if (typeof A === "object" && !s7.util.isArray(A)) {
                        if (A.message) z.message = A.message;
                        if (A.alert) z.alert.description = A.alert
                    } else if (typeof A === "number") z.alert.description = A
                }
                return q.error(q, z)
            }
        }
        if (q.session.certificateRequest !== null) K = P8.createRecord(q, {
            type: P8.ContentType.handshake,
            data: P8.createCertificate(q)
        }), P8.queue(q, K);
        K = P8.createRecord(q, {
            type: P8.ContentType.handshake,
            data: P8.createClientKeyExchange(q)
        }), P8.queue(q, K), q.expect = Ljz;
        var O = function(w, $) {
            if (w.session.certificateRequest !== null && w.session.clientCertificate !== null) P8.queue(w, P8.createRecord(w, {
                type: P8.ContentType.handshake,
                data: P8.createCertificateVerify(w, $)
            }));
            P8.queue(w, P8.createRecord(w, {
                type: P8.ContentType.change_cipher_spec,
                data: P8.createChangeCipherSpec()
            })), w.state.pending = P8.createConnectionState(w), w.state.current.write = w.state.pending.write, P8.queue(w, P8.createRecord(w, {
                type: P8.ContentType.handshake,
                data: P8.createFinished(w)
            })), w.expect = DL4, P8.flush(w), w.process()
        };
        if (q.session.certificateRequest === null || q.session.clientCertificate === null) return O(q, null);
        P8.getClientSignature(q, O)
    };
    P8.handleChangeCipherSpec = function(q, K) {
        if (K.fragment.getByte() !== 1) return q.error(q, {
            message: "Invalid ChangeCipherSpec message received.",
            send: !0,
            alert: {
                level: P8.Alert.Level.fatal,
                description: P8.Alert.Description.illegal_parameter
            }
        });
        var _ = q.entity === P8.ConnectionEnd.client;
        if (q.session.resuming && _ || !q.session.resuming && !_) q.state.pending = P8.createConnectionState(q);
        if (q.state.current.read = q.state.pending.read, !q.session.resuming && _ || q.session.resuming && !_) q.state.pending = null;
        q.expect = _ ? Ejz : Cjz, q.process()
    };
    P8.handleFinished = function(q, K, _) {
        var z = K.fragment;
        z.read -= 4;
        var Y = z.bytes();
        z.read += 4;
        var A = K.fragment.getBytes();
        z = s7.util.createBuffer(), z.putBuffer(q.session.md5.digest()), z.putBuffer(q.session.sha1.digest());
        var O = q.entity === P8.ConnectionEnd.client,
            w = O ? "server finished" : "client finished",
            $ = q.session.sp,
            j = 12,
            H = Ob8;
        if (z = H($.master_secret, w, z.getBytes(), j), z.getBytes() !== A) return q.error(q, {
            message: "Invalid verify_data in Finished message.",
            send: !0,
            alert: {
                level: P8.Alert.Level.fatal,
                description: P8.Alert.Description.decrypt_error
            }
        });
        if (q.session.md5.update(Y), q.session.sha1.update(Y), q.session.resuming && O || !q.session.resuming && !O) P8.queue(q, P8.createRecord(q, {
            type: P8.ContentType.change_cipher_spec,
            data: P8.createChangeCipherSpec()
        })), q.state.current.write = q.state.pending.write, q.state.pending = null, P8.queue(q, P8.createRecord(q, {
            type: P8.ContentType.handshake,
            data: P8.createFinished(q)
        }));
        q.expect = O ? yjz : bjz, q.handshaking = !1, ++q.handshakes, q.peerCertificate = O ? q.session.serverCertificate : q.session.clientCertificate, P8.flush(q), q.isConnected = !0, q.connected(q), q.process()
    };
    P8.handleAlert = function(q, K) {
        var _ = K.fragment,
            z = {
                level: _.getByte(),
                description: _.getByte()
            },
            Y;
        switch (z.description) {
            case P8.Alert.Description.close_notify:
                Y = "Connection closed.";
                break;
            case P8.Alert.Description.unexpected_message:
                Y = "Unexpected message.";
                break;
            case P8.Alert.Description.bad_record_mac:
                Y = "Bad record MAC.";
                break;
            case P8.Alert.Description.decryption_failed:
                Y = "Decryption failed.";
                break;
            case P8.Alert.Description.record_overflow:
                Y = "Record overflow.";
                break;
            case P8.Alert.Description.decompression_failure:
                Y = "Decompression failed.";
                break;
            case P8.Alert.Description.handshake_failure:
                Y = "Handshake failure.";
                break;
            case P8.Alert.Description.bad_certificate:
                Y = "Bad certificate.";
                break;
            case P8.Alert.Description.unsupported_certificate:
                Y = "Unsupported certificate.";
                break;
            case P8.Alert.Description.certificate_revoked:
                Y = "Certificate revoked.";
                break;
            case P8.Alert.Description.certificate_expired:
                Y = "Certificate expired.";
                break;
            case P8.Alert.Description.certificate_unknown:
                Y = "Certificate unknown.";
                break;
            case P8.Alert.Description.illegal_parameter:
                Y = "Illegal parameter.";
                break;
            case P8.Alert.Description.unknown_ca:
                Y = "Unknown certificate authority.";
                break;
            case P8.Alert.Description.access_denied:
                Y = "Access denied.";
                break;
            case P8.Alert.Description.decode_error:
                Y = "Decode error.";
                break;
            case P8.Alert.Description.decrypt_error:
                Y = "Decrypt error.";
                break;
            case P8.Alert.Description.export_restriction:
                Y = "Export restriction.";
                break;
            case P8.Alert.Description.protocol_version:
                Y = "Unsupported protocol version.";
                break;
            case P8.Alert.Description.insufficient_security:
                Y = "Insufficient security.";
                break;
            case P8.Alert.Description.internal_error:
                Y = "Internal error.";
                break;
            case P8.Alert.Description.user_canceled:
                Y = "User canceled.";
                break;
            case P8.Alert.Description.no_renegotiation:
                Y = "Renegotiation not supported.";
                break;
            default:
                Y = "Unknown error.";
                break
        }
        if (z.description === P8.Alert.Description.close_notify) return q.close();
        q.error(q, {
            message: Y,
            send: !1,
            origin: q.entity === P8.ConnectionEnd.client ? "server" : "client",
            alert: z
        }), q.process()
    };
    P8.handleHandshake = function(q, K) {
        var _ = K.fragment,
            z = _.getByte(),
            Y = _.getInt24();
        if (Y > _.length()) return q.fragmented = K, K.fragment = s7.util.createBuffer(), _.read -= 4, q.process();
        q.fragmented = null, _.read -= 4;
        var A = _.bytes(Y + 4);
        if (_.read += 4, z in Ab8[q.entity][q.expect]) {
            if (q.entity === P8.ConnectionEnd.server && !q.open && !q.fail) q.handshaking = !0, q.session = {
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
                md5: s7.md.md5.create(),
                sha1: s7.md.sha1.create()
            };
            if (z !== P8.HandshakeType.hello_request && z !== P8.HandshakeType.certificate_verify && z !== P8.HandshakeType.finished) q.session.md5.update(A), q.session.sha1.update(A);
            Ab8[q.entity][q.expect][z](q, K, Y)
        } else P8.handleUnexpected(q, K)
    };
    P8.handleApplicationData = function(q, K) {
        q.data.putBuffer(K.fragment), q.dataReady(q), q.process()
    };
    P8.handleHeartbeat = function(q, K) {
        var _ = K.fragment,
            z = _.getByte(),
            Y = _.getInt16(),
            A = _.getBytes(Y);
        if (z === P8.HeartbeatMessageType.heartbeat_request) {
            if (q.handshaking || Y > A.length) return q.process();
            P8.queue(q, P8.createRecord(q, {
                type: P8.ContentType.heartbeat,
                data: P8.createHeartbeat(P8.HeartbeatMessageType.heartbeat_response, A)
            })), P8.flush(q)
        } else if (z === P8.HeartbeatMessageType.heartbeat_response) {
            if (A !== q.expectedHeartbeatPayload) return q.process();
            if (q.heartbeatReceived) q.heartbeatReceived(q, s7.util.createBuffer(A))
        }
        q.process()
    };
    var Tjz = 0,
        Vjz = 1,
        PL4 = 2,
        kjz = 3,
        Njz = 4,
        DL4 = 5,
        Ejz = 6,
        yjz = 7,
        Ljz = 8,
        hjz = 0,
        Rjz = 1,
        $l1 = 2,
        Sjz = 3,
        jl1 = 4,
        Cjz = 5,
        bjz = 6,
        $8 = P8.handleUnexpected,
        ZL4 = P8.handleChangeCipherSpec,
        pf = P8.handleAlert,
        Bk = P8.handleHandshake,
        fL4 = P8.handleApplicationData,
        Ff = P8.handleHeartbeat,
        Hl1 = [];
    Hl1[P8.ConnectionEnd.client] = [
        [$8, pf, Bk, $8, Ff],
        [$8, pf, Bk, $8, Ff],
        [$8, pf, Bk, $8, Ff],
        [$8, pf, Bk, $8, Ff],
        [$8, pf, Bk, $8, Ff],
        [ZL4, pf, $8, $8, Ff],
        [$8, pf, Bk, $8, Ff],
        [$8, pf, Bk, fL4, Ff],
        [$8, pf, Bk, $8, Ff]
    ];
    Hl1[P8.ConnectionEnd.server] = [
        [$8, pf, Bk, $8, Ff],
        [$8, pf, Bk, $8, Ff],
        [$8, pf, Bk, $8, Ff],
        [$8, pf, Bk, $8, Ff],
        [ZL4, pf, $8, $8, Ff],
        [$8, pf, Bk, $8, Ff],
        [$8, pf, Bk, fL4, Ff],
        [$8, pf, Bk, $8, Ff]
    ];
    var {
        handleHelloRequest: h56,
        handleServerHello: Ijz,
        handleCertificate: GL4,
        handleServerKeyExchange: WL4,
        handleCertificateRequest: Ol1,
        handleServerHelloDone: Yb8,
        handleFinished: vL4
    } = P8, Ab8 = [];
    Ab8[P8.ConnectionEnd.client] = [
        [$8, $8, Ijz, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8],
        [h56, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, GL4, WL4, Ol1, Yb8, $8, $8, $8, $8, $8, $8],
        [h56, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, WL4, Ol1, Yb8, $8, $8, $8, $8, $8, $8],
        [h56, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, Ol1, Yb8, $8, $8, $8, $8, $8, $8],
        [h56, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, Yb8, $8, $8, $8, $8, $8, $8],
        [h56, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8],
        [h56, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, vL4],
        [h56, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8],
        [h56, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8]
    ];
    var {
        handleClientHello: xjz,
        handleClientKeyExchange: ujz,
        handleCertificateVerify: mjz
    } = P8;
    Ab8[P8.ConnectionEnd.server] = [
        [$8, xjz, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8],
        [$8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, GL4, $8, $8, $8, $8, $8, $8, $8, $8, $8],
        [$8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, ujz, $8, $8, $8, $8],
        [$8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, mjz, $8, $8, $8, $8, $8],
        [$8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8],
        [$8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, vL4],
        [$8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8],
        [$8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8, $8]
    ];
    P8.generateKeys = function(q, K) {
        var _ = Ob8,
            z = K.client_random + K.server_random;
        if (!q.session.resuming) K.master_secret = _(K.pre_master_secret, "master secret", z, 48).bytes(), K.pre_master_secret = null;
        z = K.server_random + K.client_random;
        var Y = 2 * K.mac_key_length + 2 * K.enc_key_length,
            A = q.version.major === P8.Versions.TLS_1_0.major && q.version.minor === P8.Versions.TLS_1_0.minor;
        if (A) Y += 2 * K.fixed_iv_length;
        var O = _(K.master_secret, "key expansion", z, Y),
            w = {
                client_write_MAC_key: O.getBytes(K.mac_key_length),
                server_write_MAC_key: O.getBytes(K.mac_key_length),
                client_write_key: O.getBytes(K.enc_key_length),
                server_write_key: O.getBytes(K.enc_key_length)
            };
        if (A) w.client_write_IV = O.getBytes(K.fixed_iv_length), w.server_write_IV = O.getBytes(K.fixed_iv_length);
        return w
    };
    P8.createConnectionState = function(q) {
        var K = q.entity === P8.ConnectionEnd.client,
            _ = function() {
                var A = {
                    sequenceNumber: [0, 0],
                    macKey: null,
                    macLength: 0,
                    macFunction: null,
                    cipherState: null,
                    cipherFunction: function(O) {
                        return !0
                    },
                    compressionState: null,
                    compressFunction: function(O) {
                        return !0
                    },
                    updateSequenceNumber: function() {
                        if (A.sequenceNumber[1] === 4294967295) A.sequenceNumber[1] = 0, ++A.sequenceNumber[0];
                        else ++A.sequenceNumber[1]
                    }
                };
                return A
            },
            z = {
                read: _(),
                write: _()
            };
        if (z.read.update = function(A, O) {
                if (!z.read.cipherFunction(O, z.read)) A.error(A, {
                    message: "Could not decrypt record or bad MAC.",
                    send: !0,
                    alert: {
                        level: P8.Alert.Level.fatal,
                        description: P8.Alert.Description.bad_record_mac
                    }
                });
                else if (!z.read.compressFunction(A, O, z.read)) A.error(A, {
                    message: "Could not decompress record.",
                    send: !0,
                    alert: {
                        level: P8.Alert.Level.fatal,
                        description: P8.Alert.Description.decompression_failure
                    }
                });
                return !A.fail
            }, z.write.update = function(A, O) {
                if (!z.write.compressFunction(A, O, z.write)) A.error(A, {
                    message: "Could not compress record.",
                    send: !1,
                    alert: {
                        level: P8.Alert.Level.fatal,
                        description: P8.Alert.Description.internal_error
                    }
                });
                else if (!z.write.cipherFunction(O, z.write)) A.error(A, {
                    message: "Could not encrypt record.",
                    send: !1,
                    alert: {
                        level: P8.Alert.Level.fatal,
                        description: P8.Alert.Description.internal_error
                    }
                });
                return !A.fail
            }, q.session) {
            var Y = q.session.sp;
            switch (q.session.cipherSuite.initSecurityParameters(Y), Y.keys = P8.generateKeys(q, Y), z.read.macKey = K ? Y.keys.server_write_MAC_key : Y.keys.client_write_MAC_key, z.write.macKey = K ? Y.keys.client_write_MAC_key : Y.keys.server_write_MAC_key, q.session.cipherSuite.initConnectionState(z, q, Y), Y.compression_algorithm) {
                case P8.CompressionMethod.none:
                    break;
                case P8.CompressionMethod.deflate:
                    z.read.compressFunction = vjz, z.write.compressFunction = Gjz;
                    break;
                default:
                    throw Error("Unsupported compression algorithm.")
            }
        }
        return z
    };
    P8.createRandom = function() {
        var q = new Date,
            K = +q + q.getTimezoneOffset() * 60000,
            _ = s7.util.createBuffer();
        return _.putInt32(K), _.putBytes(s7.random.getBytes(28)), _
    };
    P8.createRecord = function(q, K) {
        if (!K.data) return null;
        var _ = {
            type: K.type,
            version: {
                major: q.version.major,
                minor: q.version.minor
            },
            length: K.data.length(),
            fragment: K.data
        };
        return _
    };
    P8.createAlert = function(q, K) {
        var _ = s7.util.createBuffer();
        return _.putByte(K.level), _.putByte(K.description), P8.createRecord(q, {
            type: P8.ContentType.alert,
            data: _
        })
    };
    P8.createClientHello = function(q) {
        q.session.clientHelloVersion = {
            major: q.version.major,
            minor: q.version.minor
        };
        var K = s7.util.createBuffer();
        for (var _ = 0; _ < q.cipherSuites.length; ++_) {
            var z = q.cipherSuites[_];
            K.putByte(z.id[0]), K.putByte(z.id[1])
        }
        var Y = K.length(),
            A = s7.util.createBuffer();
        A.putByte(P8.CompressionMethod.none);
        var O = A.length(),
            w = s7.util.createBuffer();
        if (q.virtualHost) {
            var $ = s7.util.createBuffer();
            $.putByte(0), $.putByte(0);
            var j = s7.util.createBuffer();
            j.putByte(0), Px(j, 2, s7.util.createBuffer(q.virtualHost));
            var H = s7.util.createBuffer();
            Px(H, 2, j), Px($, 2, H), w.putBuffer($)
        }
        var J = w.length();
        if (J > 0) J += 2;
        var X = q.session.id,
            M = X.length + 1 + 2 + 4 + 28 + 2 + Y + 1 + O + J,
            P = s7.util.createBuffer();
        if (P.putByte(P8.HandshakeType.client_hello), P.putInt24(M), P.putByte(q.version.major), P.putByte(q.version.minor), P.putBytes(q.session.sp.client_random), Px(P, 1, s7.util.createBuffer(X)), Px(P, 2, K), Px(P, 1, A), J > 0) Px(P, 2, w);
        return P
    };
    P8.createServerHello = function(q) {
        var K = q.session.id,
            _ = K.length + 1 + 2 + 4 + 28 + 2 + 1,
            z = s7.util.createBuffer();
        return z.putByte(P8.HandshakeType.server_hello), z.putInt24(_), z.putByte(q.version.major), z.putByte(q.version.minor), z.putBytes(q.session.sp.server_random), Px(z, 1, s7.util.createBuffer(K)), z.putByte(q.session.cipherSuite.id[0]), z.putByte(q.session.cipherSuite.id[1]), z.putByte(q.session.compressionMethod), z
    };
    P8.createCertificate = function(q) {
        var K = q.entity === P8.ConnectionEnd.client,
            _ = null;
        if (q.getCertificate) {
            var z;
            if (K) z = q.session.certificateRequest;
            else z = q.session.extensions.server_name.serverNameList;
            _ = q.getCertificate(q, z)
        }
        var Y = s7.util.createBuffer();
        if (_ !== null) try {
            if (!s7.util.isArray(_)) _ = [_];
            var A = null;
            for (var O = 0; O < _.length; ++O) {
                var w = s7.pem.decode(_[O])[0];
                if (w.type !== "CERTIFICATE" && w.type !== "X509 CERTIFICATE" && w.type !== "TRUSTED CERTIFICATE") {
                    var $ = Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
                    throw $.headerType = w.type, $
                }
                if (w.procType && w.procType.type === "ENCRYPTED") throw Error("Could not convert certificate from PEM; PEM is encrypted.");
                var j = s7.util.createBuffer(w.body);
                if (A === null) A = s7.asn1.fromDer(j.bytes(), !1);
                var H = s7.util.createBuffer();
                Px(H, 3, j), Y.putBuffer(H)
            }
            if (_ = s7.pki.certificateFromAsn1(A), K) q.session.clientCertificate = _;
            else q.session.serverCertificate = _
        } catch (M) {
            return q.error(q, {
                message: "Could not send certificate list.",
                cause: M,
                send: !0,
                alert: {
                    level: P8.Alert.Level.fatal,
                    description: P8.Alert.Description.bad_certificate
                }
            })
        }
        var J = 3 + Y.length(),
            X = s7.util.createBuffer();
        return X.putByte(P8.HandshakeType.certificate), X.putInt24(J), Px(X, 3, Y), X
    };
    P8.createClientKeyExchange = function(q) {
        var K = s7.util.createBuffer();
        K.putByte(q.session.clientHelloVersion.major), K.putByte(q.session.clientHelloVersion.minor), K.putBytes(s7.random.getBytes(46));
        var _ = q.session.sp;
        _.pre_master_secret = K.getBytes();
        var z = q.session.serverCertificate.publicKey;
        K = z.encrypt(_.pre_master_secret);
        var Y = K.length + 2,
            A = s7.util.createBuffer();
        return A.putByte(P8.HandshakeType.client_key_exchange), A.putInt24(Y), A.putInt16(K.length), A.putBytes(K), A
    };
    P8.createServerKeyExchange = function(q) {
        var K = 0,
            _ = s7.util.createBuffer();
        if (K > 0) _.putByte(P8.HandshakeType.server_key_exchange), _.putInt24(K);
        return _
    };
    P8.getClientSignature = function(q, K) {
        var _ = s7.util.createBuffer();
        _.putBuffer(q.session.md5.digest()), _.putBuffer(q.session.sha1.digest()), _ = _.getBytes(), q.getSignature = q.getSignature || function(z, Y, A) {
            var O = null;
            if (z.getPrivateKey) try {
                O = z.getPrivateKey(z, z.session.clientCertificate), O = s7.pki.privateKeyFromPem(O)
            } catch (w) {
                z.error(z, {
                    message: "Could not get private key.",
                    cause: w,
                    send: !0,
                    alert: {
                        level: P8.Alert.Level.fatal,
                        description: P8.Alert.Description.internal_error
                    }
                })
            }
            if (O === null) z.error(z, {
                message: "No private key set.",
                send: !0,
                alert: {
                    level: P8.Alert.Level.fatal,
                    description: P8.Alert.Description.internal_error
                }
            });
            else Y = O.sign(Y, null);
            A(z, Y)
        }, q.getSignature(q, _, K)
    };
    P8.createCertificateVerify = function(q, K) {
        var _ = K.length + 2,
            z = s7.util.createBuffer();
        return z.putByte(P8.HandshakeType.certificate_verify), z.putInt24(_), z.putInt16(K.length), z.putBytes(K), z
    };
    P8.createCertificateRequest = function(q) {
        var K = s7.util.createBuffer();
        K.putByte(1);
        var _ = s7.util.createBuffer();
        for (var z in q.caStore.certs) {
            var Y = q.caStore.certs[z],
                A = s7.pki.distinguishedNameToAsn1(Y.subject),
                O = s7.asn1.toDer(A);
            _.putInt16(O.length()), _.putBuffer(O)
        }
        var w = 1 + K.length() + 2 + _.length(),
            $ = s7.util.createBuffer();
        return $.putByte(P8.HandshakeType.certificate_request), $.putInt24(w), Px($, 1, K), Px($, 2, _), $
    };
    P8.createServerHelloDone = function(q) {
        var K = s7.util.createBuffer();
        return K.putByte(P8.HandshakeType.server_hello_done), K.putInt24(0), K
    };
    P8.createChangeCipherSpec = function() {
        var q = s7.util.createBuffer();
        return q.putByte(1), q
    };
    P8.createFinished = function(q) {
        var K = s7.util.createBuffer();
        K.putBuffer(q.session.md5.digest()), K.putBuffer(q.session.sha1.digest());
        var _ = q.entity === P8.ConnectionEnd.client,
            z = q.session.sp,
            Y = 12,
            A = Ob8,
            O = _ ? "client finished" : "server finished";
        K = A(z.master_secret, O, K.getBytes(), Y);
        var w = s7.util.createBuffer();
        return w.putByte(P8.HandshakeType.finished), w.putInt24(K.length()), w.putBuffer(K), w
    };
    P8.createHeartbeat = function(q, K, _) {
        if (typeof _ > "u") _ = K.length;
        var z = s7.util.createBuffer();
        z.putByte(q), z.putInt16(_), z.putBytes(K);
        var Y = z.length(),
            A = Math.max(16, Y - _ - 3);
        return z.putBytes(s7.random.getBytes(A)), z
    };
    P8.queue = function(q, K) {
        if (!K) return;
        if (K.fragment.length() === 0) {
            if (K.type === P8.ContentType.handshake || K.type === P8.ContentType.alert || K.type === P8.ContentType.change_cipher_spec) return
        }
        if (K.type === P8.ContentType.handshake) {
            var _ = K.fragment.bytes();
            q.session.md5.update(_), q.session.sha1.update(_), _ = null
        }
        var z;
        if (K.fragment.length() <= P8.MaxFragment) z = [K];
        else {
            z = [];
            var Y = K.fragment.bytes();
            while (Y.length > P8.MaxFragment) z.push(P8.createRecord(q, {
                type: K.type,
                data: s7.util.createBuffer(Y.slice(0, P8.MaxFragment))
            })), Y = Y.slice(P8.MaxFragment);
            if (Y.length > 0) z.push(P8.createRecord(q, {
                type: K.type,
                data: s7.util.createBuffer(Y)
            }))
        }
        for (var A = 0; A < z.length && !q.fail; ++A) {
            var O = z[A],
                w = q.state.current.write;
            if (w.update(q, O)) q.records.push(O)
        }
    };
    P8.flush = function(q) {
        for (var K = 0; K < q.records.length; ++K) {
            var _ = q.records[K];
            q.tlsData.putByte(_.type), q.tlsData.putByte(_.version.major), q.tlsData.putByte(_.version.minor), q.tlsData.putInt16(_.fragment.length()), q.tlsData.putBuffer(q.records[K].fragment)
        }
        return q.records = [], q.tlsDataReady(q)
    };
    var wl1 = function(q) {
            switch (q) {
                case !0:
                    return !0;
                case s7.pki.certificateError.bad_certificate:
                    return P8.Alert.Description.bad_certificate;
                case s7.pki.certificateError.unsupported_certificate:
                    return P8.Alert.Description.unsupported_certificate;
                case s7.pki.certificateError.certificate_revoked:
                    return P8.Alert.Description.certificate_revoked;
                case s7.pki.certificateError.certificate_expired:
                    return P8.Alert.Description.certificate_expired;
                case s7.pki.certificateError.certificate_unknown:
                    return P8.Alert.Description.certificate_unknown;
                case s7.pki.certificateError.unknown_ca:
                    return P8.Alert.Description.unknown_ca;
                default:
                    return P8.Alert.Description.bad_certificate
            }
        },
        Bjz = function(q) {
            switch (q) {
                case !0:
                    return !0;
                case P8.Alert.Description.bad_certificate:
                    return s7.pki.certificateError.bad_certificate;
                case P8.Alert.Description.unsupported_certificate:
                    return s7.pki.certificateError.unsupported_certificate;
                case P8.Alert.Description.certificate_revoked:
                    return s7.pki.certificateError.certificate_revoked;
                case P8.Alert.Description.certificate_expired:
                    return s7.pki.certificateError.certificate_expired;
                case P8.Alert.Description.certificate_unknown:
                    return s7.pki.certificateError.certificate_unknown;
                case P8.Alert.Description.unknown_ca:
                    return s7.pki.certificateError.unknown_ca;
                default:
                    return s7.pki.certificateError.bad_certificate
            }
        };
    P8.verifyCertificateChain = function(q, K) {
        try {
            var _ = {};
            for (var z in q.verifyOptions) _[z] = q.verifyOptions[z];
            _.verify = function(A, O, w) {
                var $ = wl1(A),
                    j = q.verify(q, A, O, w);
                if (j !== !0) {
                    if (typeof j === "object" && !s7.util.isArray(j)) {
                        var H = Error("The application rejected the certificate.");
                        if (H.send = !0, H.alert = {
                                level: P8.Alert.Level.fatal,
                                description: P8.Alert.Description.bad_certificate
                            }, j.message) H.message = j.message;
                        if (j.alert) H.alert.description = j.alert;
                        throw H
                    }
                    if (j !== A) j = Bjz(j)
                }
                return j
            }, s7.pki.verifyCertificateChain(q.caStore, K, _)
        } catch (A) {
            var Y = A;
            if (typeof Y !== "object" || s7.util.isArray(Y)) Y = {
                send: !0,
                alert: {
                    level: P8.Alert.Level.fatal,
                    description: wl1(A)
                }
            };
            if (!("send" in Y)) Y.send = !0;
            if (!("alert" in Y)) Y.alert = {
                level: P8.Alert.Level.fatal,
                description: wl1(Y.error)
            };
            q.error(q, Y)
        }
        return !q.fail
    };
    P8.createSessionCache = function(q, K) {
        var _ = null;
        if (q && q.getSession && q.setSession && q.order) _ = q;
        else {
            _ = {}, _.cache = q || {}, _.capacity = Math.max(K || 100, 1), _.order = [];
            for (var z in q)
                if (_.order.length <= K) _.order.push(z);
                else delete q[z];
            _.getSession = function(Y) {
                var A = null,
                    O = null;
                if (Y) O = s7.util.bytesToHex(Y);
                else if (_.order.length > 0) O = _.order[0];
                if (O !== null && O in _.cache) {
                    A = _.cache[O], delete _.cache[O];
                    for (var w in _.order)
                        if (_.order[w] === O) {
                            _.order.splice(w, 1);
                            break
                        }
                }
                return A
            }, _.setSession = function(Y, A) {
                if (_.order.length === _.capacity) {
                    var O = _.order.shift();
                    delete _.cache[O]
                }
                var O = s7.util.bytesToHex(Y);
                _.order.push(O), _.cache[O] = A
            }
        }
        return _
    };
    P8.createConnection = function(q) {
        var K = null;
        if (q.caStore)
            if (s7.util.isArray(q.caStore)) K = s7.pki.createCaStore(q.caStore);
            else K = q.caStore;
        else K = s7.pki.createCaStore();
        var _ = q.cipherSuites || null;
        if (_ === null) {
            _ = [];
            for (var z in P8.CipherSuites) _.push(P8.CipherSuites[z])
        }
        var Y = q.server ? P8.ConnectionEnd.server : P8.ConnectionEnd.client,
            A = q.sessionCache ? P8.createSessionCache(q.sessionCache) : null,
            O = {
                version: {
                    major: P8.Version.major,
                    minor: P8.Version.minor
                },
                entity: Y,
                sessionId: q.sessionId,
                caStore: K,
                sessionCache: A,
                cipherSuites: _,
                connected: q.connected,
                virtualHost: q.virtualHost || null,
                verifyClient: q.verifyClient || !1,
                verify: q.verify || function(H, J, X, M) {
                    return J
                },
                verifyOptions: q.verifyOptions || {},
                getCertificate: q.getCertificate || null,
                getPrivateKey: q.getPrivateKey || null,
                getSignature: q.getSignature || null,
                input: s7.util.createBuffer(),
                tlsData: s7.util.createBuffer(),
                data: s7.util.createBuffer(),
                tlsDataReady: q.tlsDataReady,
                dataReady: q.dataReady,
                heartbeatReceived: q.heartbeatReceived,
                closed: q.closed,
                error: function(H, J) {
                    if (J.origin = J.origin || (H.entity === P8.ConnectionEnd.client ? "client" : "server"), J.send) P8.queue(H, P8.createAlert(H, J.alert)), P8.flush(H);
                    var X = J.fatal !== !1;
                    if (X) H.fail = !0;
                    if (q.error(H, J), X) H.close(!1)
                },
                deflate: q.deflate || null,
                inflate: q.inflate || null
            };
        O.reset = function(H) {
            O.version = {
                major: P8.Version.major,
                minor: P8.Version.minor
            }, O.record = null, O.session = null, O.peerCertificate = null, O.state = {
                pending: null,
                current: null
            }, O.expect = O.entity === P8.ConnectionEnd.client ? Tjz : hjz, O.fragmented = null, O.records = [], O.open = !1, O.handshakes = 0, O.handshaking = !1, O.isConnected = !1, O.fail = !(H || typeof H > "u"), O.input.clear(), O.tlsData.clear(), O.data.clear(), O.state.current = P8.createConnectionState(O)
        }, O.reset();
        var w = function(H, J) {
                var X = J.type - P8.ContentType.change_cipher_spec,
                    M = Hl1[H.entity][H.expect];
                if (X in M) M[X](H, J);
                else P8.handleUnexpected(H, J)
            },
            $ = function(H) {
                var J = 0,
                    X = H.input,
                    M = X.length();
                if (M < 5) J = 5 - M;
                else {
                    H.record = {
                        type: X.getByte(),
                        version: {
                            major: X.getByte(),
                            minor: X.getByte()
                        },
                        length: X.getInt16(),
                        fragment: s7.util.createBuffer(),
                        ready: !1
                    };
                    var P = H.record.version.major === H.version.major;
                    if (P && H.session && H.session.version) P = H.record.version.minor === H.version.minor;
                    if (!P) H.error(H, {
                        message: "Incompatible TLS version.",
                        send: !0,
                        alert: {
                            level: P8.Alert.Level.fatal,
                            description: P8.Alert.Description.protocol_version
                        }
                    })
                }
                return J
            },
            j = function(H) {
                var J = 0,
                    X = H.input,
                    M = X.length();
                if (M < H.record.length) J = H.record.length - M;
                else {
                    H.record.fragment.putBytes(X.getBytes(H.record.length)), X.compact();
                    var P = H.state.current.read;
                    if (P.update(H, H.record)) {
                        if (H.fragmented !== null)
                            if (H.fragmented.type === H.record.type) H.fragmented.fragment.putBuffer(H.record.fragment), H.record = H.fragmented;
                            else H.error(H, {
                                message: "Invalid fragmented record.",
                                send: !0,
                                alert: {
                                    level: P8.Alert.Level.fatal,
                                    description: P8.Alert.Description.unexpected_message
                                }
                            });
                        H.record.ready = !0
                    }
                }
                return J
            };
        return O.handshake = function(H) {
            if (O.entity !== P8.ConnectionEnd.client) O.error(O, {
                message: "Cannot initiate handshake as a server.",
                fatal: !1
            });
            else if (O.handshaking) O.error(O, {
                message: "Handshake already in progress.",
                fatal: !1
            });
            else {
                if (O.fail && !O.open && O.handshakes === 0) O.fail = !1;
                O.handshaking = !0, H = H || "";
                var J = null;
                if (H.length > 0) {
                    if (O.sessionCache) J = O.sessionCache.getSession(H);
                    if (J === null) H = ""
                }
                if (H.length === 0 && O.sessionCache) {
                    if (J = O.sessionCache.getSession(), J !== null) H = J.id
                }
                if (O.session = {
                        id: H,
                        version: null,
                        cipherSuite: null,
                        compressionMethod: null,
                        serverCertificate: null,
                        certificateRequest: null,
                        clientCertificate: null,
                        sp: {},
                        md5: s7.md.md5.create(),
                        sha1: s7.md.sha1.create()
                    }, J) O.version = J.version, O.session.sp = J.sp;
                O.session.sp.client_random = P8.createRandom().getBytes(), O.open = !0, P8.queue(O, P8.createRecord(O, {
                    type: P8.ContentType.handshake,
                    data: P8.createClientHello(O)
                })), P8.flush(O)
            }
        }, O.process = function(H) {
            var J = 0;
            if (H) O.input.putBytes(H);
            if (!O.fail) {
                if (O.record !== null && O.record.ready && O.record.fragment.isEmpty()) O.record = null;
                if (O.record === null) J = $(O);
                if (!O.fail && O.record !== null && !O.record.ready) J = j(O);
                if (!O.fail && O.record !== null && O.record.ready) w(O, O.record)
            }
            return J
        }, O.prepare = function(H) {
            return P8.queue(O, P8.createRecord(O, {
                type: P8.ContentType.application_data,
                data: s7.util.createBuffer(H)
            })), P8.flush(O)
        }, O.prepareHeartbeatRequest = function(H, J) {
            if (H instanceof s7.util.ByteBuffer) H = H.bytes();
            if (typeof J > "u") J = H.length;
            return O.expectedHeartbeatPayload = H, P8.queue(O, P8.createRecord(O, {
                type: P8.ContentType.heartbeat,
                data: P8.createHeartbeat(P8.HeartbeatMessageType.heartbeat_request, H, J)
            })), P8.flush(O)
        }, O.close = function(H) {
            if (!O.fail && O.sessionCache && O.session) {
                var J = {
                    id: O.session.id,
                    version: O.session.version,
                    sp: O.session.sp
                };
                J.sp.keys = null, O.sessionCache.setSession(J.id, J)
            }
            if (O.open) {
                if (O.open = !1, O.input.clear(), O.isConnected || O.handshaking) O.isConnected = O.handshaking = !1, P8.queue(O, P8.createAlert(O, {
                    level: P8.Alert.Level.warning,
                    description: P8.Alert.Description.close_notify
                })), P8.flush(O);
                O.closed(O)
            }
            O.reset(H)
        }, O
    };
    TL4.exports = s7.tls = s7.tls || {};
    for ($88 in P8)
        if (typeof P8[$88] !== "function") s7.tls[$88] = P8[$88];
    var $88;
    s7.tls.prf_tls1 = Ob8;
    s7.tls.hmac_sha1 = fjz;
    s7.tls.createSessionCache = P8.createSessionCache;
    s7.tls.createConnection = P8.createConnection
})
// @from(Ln 252399, Col 4)
NL4 = p((Zhw, kL4) => {
    var R56 = p_();
    V56();
    Jl1();
    var Wx = kL4.exports = R56.tls;
    Wx.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA = {
        id: [0, 47],
        name: "TLS_RSA_WITH_AES_128_CBC_SHA",
        initSecurityParameters: function(q) {
            q.bulk_cipher_algorithm = Wx.BulkCipherAlgorithm.aes, q.cipher_type = Wx.CipherType.block, q.enc_key_length = 16, q.block_length = 16, q.fixed_iv_length = 16, q.record_iv_length = 16, q.mac_algorithm = Wx.MACAlgorithm.hmac_sha1, q.mac_length = 20, q.mac_key_length = 20
        },
        initConnectionState: VL4
    };
    Wx.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA = {
        id: [0, 53],
        name: "TLS_RSA_WITH_AES_256_CBC_SHA",
        initSecurityParameters: function(q) {
            q.bulk_cipher_algorithm = Wx.BulkCipherAlgorithm.aes, q.cipher_type = Wx.CipherType.block, q.enc_key_length = 32, q.block_length = 16, q.fixed_iv_length = 16, q.record_iv_length = 16, q.mac_algorithm = Wx.MACAlgorithm.hmac_sha1, q.mac_length = 20, q.mac_key_length = 20
        },
        initConnectionState: VL4
    };

    function VL4(q, K, _) {
        var z = K.entity === R56.tls.ConnectionEnd.client;
        q.read.cipherState = {
            init: !1,
            cipher: R56.cipher.createDecipher("AES-CBC", z ? _.keys.server_write_key : _.keys.client_write_key),
            iv: z ? _.keys.server_write_IV : _.keys.client_write_IV
        }, q.write.cipherState = {
            init: !1,
            cipher: R56.cipher.createCipher("AES-CBC", z ? _.keys.client_write_key : _.keys.server_write_key),
            iv: z ? _.keys.client_write_IV : _.keys.server_write_IV
        }, q.read.cipherFunction = Ujz, q.write.cipherFunction = pjz, q.read.macLength = q.write.macLength = _.mac_length, q.read.macFunction = q.write.macFunction = Wx.hmac_sha1
    }

    function pjz(q, K) {
        var _ = !1,
            z = K.macFunction(K.macKey, K.sequenceNumber, q);
        q.fragment.putBytes(z), K.updateSequenceNumber();
        var Y;
        if (q.version.minor === Wx.Versions.TLS_1_0.minor) Y = K.cipherState.init ? null : K.cipherState.iv;
        else Y = R56.random.getBytesSync(16);
        K.cipherState.init = !0;
        var A = K.cipherState.cipher;
        if (A.start({
                iv: Y
            }), q.version.minor >= Wx.Versions.TLS_1_1.minor) A.output.putBytes(Y);
        if (A.update(q.fragment), A.finish(Fjz)) q.fragment = A.output, q.length = q.fragment.length(), _ = !0;
        return _
    }

    function Fjz(q, K, _) {
        if (!_) {
            var z = q - K.length() % q;
            K.fillWithByte(z - 1, z)
        }
        return !0
    }

    function gjz(q, K, _) {
        var z = !0;
        if (_) {
            var Y = K.length(),
                A = K.last();
            for (var O = Y - 1 - A; O < Y - 1; ++O) z = z && K.at(O) == A;
            if (z) K.truncate(A + 1)
        }
        return z
    }

    function Ujz(q, K) {
        var _ = !1,
            z;
        if (q.version.minor === Wx.Versions.TLS_1_0.minor) z = K.cipherState.init ? null : K.cipherState.iv;
        else z = q.fragment.getBytes(16);
        K.cipherState.init = !0;
        var Y = K.cipherState.cipher;
        Y.start({
            iv: z
        }), Y.update(q.fragment), _ = Y.finish(gjz);
        var A = K.macLength,
            O = R56.random.getBytesSync(A),
            w = Y.output.length();
        if (w >= A) q.fragment = Y.output.getBytes(w - A), O = Y.output.getBytes(A);
        else q.fragment = Y.output.getBytes();
        q.fragment = R56.util.createBuffer(q.fragment), q.length = q.fragment.length();
        var $ = K.macFunction(K.macKey, K.sequenceNumber, q);
        return K.updateSequenceNumber(), _ = Qjz(K.macKey, O, $) && _, _
    }

    function Qjz(q, K, _) {
        var z = R56.hmac.create();
        return z.start("SHA1", q), z.update(K), K = z.digest().getBytes(), z.start(null, null), z.update(_), _ = z.digest().getBytes(), K === _
    }
})
// @from(Ln 252494, Col 4)
Pl1 = p((fhw, hL4) => {
    var Tj = p_();
    Zc();
    RA();
    var j88 = hL4.exports = Tj.sha512 = Tj.sha512 || {};
    Tj.md.sha512 = Tj.md.algorithms.sha512 = j88;
    var yL4 = Tj.sha384 = Tj.sha512.sha384 = Tj.sha512.sha384 || {};
    yL4.create = function() {
        return j88.create("SHA-384")
    };
    Tj.md.sha384 = Tj.md.algorithms.sha384 = yL4;
    Tj.sha512.sha256 = Tj.sha512.sha256 || {
        create: function() {
            return j88.create("SHA-512/256")
        }
    };
    Tj.md["sha512/256"] = Tj.md.algorithms["sha512/256"] = Tj.sha512.sha256;
    Tj.sha512.sha224 = Tj.sha512.sha224 || {
        create: function() {
            return j88.create("SHA-512/224")
        }
    };
    Tj.md["sha512/224"] = Tj.md.algorithms["sha512/224"] = Tj.sha512.sha224;
    j88.create = function(q) {
        if (!LL4) djz();
        if (typeof q > "u") q = "SHA-512";
        if (!(q in SH6)) throw Error("Invalid SHA-512 algorithm: " + q);
        var K = SH6[q],
            _ = null,
            z = Tj.util.createBuffer(),
            Y = Array(80);
        for (var A = 0; A < 80; ++A) Y[A] = [, , ];
        var O = 64;
        switch (q) {
            case "SHA-384":
                O = 48;
                break;
            case "SHA-512/256":
                O = 32;
                break;
            case "SHA-512/224":
                O = 28;
                break
        }
        var w = {
            algorithm: q.replace("-", "").toLowerCase(),
            blockLength: 128,
            digestLength: O,
            messageLength: 0,
            fullMessageLength: null,
            messageLengthSize: 16
        };
        return w.start = function() {
            w.messageLength = 0, w.fullMessageLength = w.messageLength128 = [];
            var $ = w.messageLengthSize / 4;
            for (var j = 0; j < $; ++j) w.fullMessageLength.push(0);
            z = Tj.util.createBuffer(), _ = Array(K.length);
            for (var j = 0; j < K.length; ++j) _[j] = K[j].slice(0);
            return w
        }, w.start(), w.update = function($, j) {
            if (j === "utf8") $ = Tj.util.encodeUtf8($);
            var H = $.length;
            w.messageLength += H, H = [H / 4294967296 >>> 0, H >>> 0];
            for (var J = w.fullMessageLength.length - 1; J >= 0; --J) w.fullMessageLength[J] += H[1], H[1] = H[0] + (w.fullMessageLength[J] / 4294967296 >>> 0), w.fullMessageLength[J] = w.fullMessageLength[J] >>> 0, H[0] = H[1] / 4294967296 >>> 0;
            if (z.putBytes($), EL4(_, Y, z), z.read > 2048 || z.length() === 0) z.compact();
            return w
        }, w.digest = function() {
            var $ = Tj.util.createBuffer();
            $.putBytes(z.bytes());
            var j = w.fullMessageLength[w.fullMessageLength.length - 1] + w.messageLengthSize,
                H = j & w.blockLength - 1;
            $.putBytes(Xl1.substr(0, w.blockLength - H));
            var J, X, M = w.fullMessageLength[0] * 8;
            for (var P = 0; P < w.fullMessageLength.length - 1; ++P) J = w.fullMessageLength[P + 1] * 8, X = J / 4294967296 >>> 0, M += X, $.putInt32(M >>> 0), M = J >>> 0;
            $.putInt32(M);
            var W = Array(_.length);
            for (var P = 0; P < _.length; ++P) W[P] = _[P].slice(0);
            EL4(W, Y, $);
            var D = Tj.util.createBuffer(),
                Z;
            if (q === "SHA-512") Z = W.length;
            else if (q === "SHA-384") Z = W.length - 2;
            else Z = W.length - 4;
            for (var P = 0; P < Z; ++P)
                if (D.putInt32(W[P][0]), P !== Z - 1 || q !== "SHA-512/224") D.putInt32(W[P][1]);
            return D
        }, w
    };
    var Xl1 = null,
        LL4 = !1,
        Ml1 = null,
        SH6 = null;

    function djz() {
        Xl1 = String.fromCharCode(128), Xl1 += Tj.util.fillString(String.fromCharCode(0), 128), Ml1 = [
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
        ], SH6 = {}, SH6["SHA-512"] = [
            [1779033703, 4089235720],
            [3144134277, 2227873595],
            [1013904242, 4271175723],
            [2773480762, 1595750129],
            [1359893119, 2917565137],
            [2600822924, 725511199],
            [528734635, 4215389547],
            [1541459225, 327033209]
        ], SH6["SHA-384"] = [
            [3418070365, 3238371032],
            [1654270250, 914150663],
            [2438529370, 812702999],
            [355462360, 4144912697],
            [1731405415, 4290775857],
            [2394180231, 1750603025],
            [3675008525, 1694076839],
            [1203062813, 3204075428]
        ], SH6["SHA-512/256"] = [
            [573645204, 4230739756],
            [2673172387, 3360449730],
            [596883563, 1867755857],
            [2520282905, 1497426621],
            [2519219938, 2827943907],
            [3193839141, 1401305490],
            [721525244, 746961066],
            [246885852, 2177182882]
        ], SH6["SHA-512/224"] = [
            [2352822216, 424955298],
            [1944164710, 2312950998],
            [502970286, 855612546],
            [1738396948, 1479516111],
            [258812777, 2077511080],
            [2011393907, 79989058],
            [1067287976, 1780299464],
            [286451373, 2446758561]
        ], LL4 = !0
    }

    function EL4(q, K, _) {
        var z, Y, A, O, w, $, j, H, J, X, M, P, W, D, Z, G, f, v, V, k, N, R, h, C, x, B, m, S, F, U, g, c, n, l, z6, A6 = _.length();
        while (A6 >= 128) {
            for (F = 0; F < 16; ++F) K[F][0] = _.getInt32() >>> 0, K[F][1] = _.getInt32() >>> 0;
            for (; F < 80; ++F) c = K[F - 2], U = c[0], g = c[1], z = ((U >>> 19 | g << 13) ^ (g >>> 29 | U << 3) ^ U >>> 6) >>> 0, Y = ((U << 13 | g >>> 19) ^ (g << 3 | U >>> 29) ^ (U << 26 | g >>> 6)) >>> 0, l = K[F - 15], U = l[0], g = l[1], A = ((U >>> 1 | g << 31) ^ (U >>> 8 | g << 24) ^ U >>> 7) >>> 0, O = ((U << 31 | g >>> 1) ^ (U << 24 | g >>> 8) ^ (U << 25 | g >>> 7)) >>> 0, n = K[F - 7], z6 = K[F - 16], g = Y + n[1] + O + z6[1], K[F][0] = z + n[0] + A + z6[0] + (g / 4294967296 >>> 0) >>> 0, K[F][1] = g >>> 0;
            W = q[0][0], D = q[0][1], Z = q[1][0], G = q[1][1], f = q[2][0], v = q[2][1], V = q[3][0], k = q[3][1], N = q[4][0], R = q[4][1], h = q[5][0], C = q[5][1], x = q[6][0], B = q[6][1], m = q[7][0], S = q[7][1];
            for (F = 0; F < 80; ++F) j = ((N >>> 14 | R << 18) ^ (N >>> 18 | R << 14) ^ (R >>> 9 | N << 23)) >>> 0, H = ((N << 18 | R >>> 14) ^ (N << 14 | R >>> 18) ^ (R << 23 | N >>> 9)) >>> 0, J = (x ^ N & (h ^ x)) >>> 0, X = (B ^ R & (C ^ B)) >>> 0, w = ((W >>> 28 | D << 4) ^ (D >>> 2 | W << 30) ^ (D >>> 7 | W << 25)) >>> 0, $ = ((W << 4 | D >>> 28) ^ (D << 30 | W >>> 2) ^ (D << 25 | W >>> 7)) >>> 0, M = (W & Z | f & (W ^ Z)) >>> 0, P = (D & G | v & (D ^ G)) >>> 0, g = S + H + X + Ml1[F][1] + K[F][1], z = m + j + J + Ml1[F][0] + K[F][0] + (g / 4294967296 >>> 0) >>> 0, Y = g >>> 0, g = $ + P, A = w + M + (g / 4294967296 >>> 0) >>> 0, O = g >>> 0, m = x, S = B, x = h, B = C, h = N, C = R, g = k + Y, N = V + z + (g / 4294967296 >>> 0) >>> 0, R = g >>> 0, V = f, k = v, f = Z, v = G, Z = W, G = D, g = Y + O, W = z + A + (g / 4294967296 >>> 0) >>> 0, D = g >>> 0;
            g = q[0][1] + D, q[0][0] = q[0][0] + W + (g / 4294967296 >>> 0) >>> 0, q[0][1] = g >>> 0, g = q[1][1] + G, q[1][0] = q[1][0] + Z + (g / 4294967296 >>> 0) >>> 0, q[1][1] = g >>> 0, g = q[2][1] + v, q[2][0] = q[2][0] + f + (g / 4294967296 >>> 0) >>> 0, q[2][1] = g >>> 0, g = q[3][1] + k, q[3][0] = q[3][0] + V + (g / 4294967296 >>> 0) >>> 0, q[3][1] = g >>> 0, g = q[4][1] + R, q[4][0] = q[4][0] + N + (g / 4294967296 >>> 0) >>> 0, q[4][1] = g >>> 0, g = q[5][1] + C, q[5][0] = q[5][0] + h + (g / 4294967296 >>> 0) >>> 0, q[5][1] = g >>> 0, g = q[6][1] + B, q[6][0] = q[6][0] + x + (g / 4294967296 >>> 0) >>> 0, q[6][1] = g >>> 0, g = q[7][1] + S, q[7][0] = q[7][0] + m + (g / 4294967296 >>> 0) >>> 0, q[7][1] = g >>> 0, A6 -= 128
        }
    }
})
// @from(Ln 252719, Col 4)
RL4 = p((ljz) => {
    var cjz = p_();
    mp();
    var bD = cjz.asn1;
    ljz.privateKeyValidator = {
        name: "PrivateKeyInfo",
        tagClass: bD.Class.UNIVERSAL,
        type: bD.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "PrivateKeyInfo.version",
            tagClass: bD.Class.UNIVERSAL,
            type: bD.Type.INTEGER,
            constructed: !1,
            capture: "privateKeyVersion"
        }, {
            name: "PrivateKeyInfo.privateKeyAlgorithm",
            tagClass: bD.Class.UNIVERSAL,
            type: bD.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "AlgorithmIdentifier.algorithm",
                tagClass: bD.Class.UNIVERSAL,
                type: bD.Type.OID,
                constructed: !1,
                capture: "privateKeyOid"
            }]
        }, {
            name: "PrivateKeyInfo",
            tagClass: bD.Class.UNIVERSAL,
            type: bD.Type.OCTETSTRING,
            constructed: !1,
            capture: "privateKey"
        }]
    };
    ljz.publicKeyValidator = {
        name: "SubjectPublicKeyInfo",
        tagClass: bD.Class.UNIVERSAL,
        type: bD.Type.SEQUENCE,
        constructed: !0,
        captureAsn1: "subjectPublicKeyInfo",
        value: [{
            name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
            tagClass: bD.Class.UNIVERSAL,
            type: bD.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "AlgorithmIdentifier.algorithm",
                tagClass: bD.Class.UNIVERSAL,
                type: bD.Type.OID,
                constructed: !1,
                capture: "publicKeyOid"
            }]
        }, {
            tagClass: bD.Class.UNIVERSAL,
            type: bD.Type.BITSTRING,
            constructed: !1,
            composed: !0,
            captureBitStringValue: "ed25519PublicKey"
        }]
    }
})
// @from(Ln 252781, Col 4)
UL4 = p((vhw, gL4) => {
    var gf = p_();
    Y88();
    Hx();
    Pl1();
    RA();
    var xL4 = RL4(),
        rjz = xL4.publicKeyValidator,
        ojz = xL4.privateKeyValidator;
    if (typeof Zl1 > "u") Zl1 = gf.jsbn.BigInteger;
    var Zl1, fl1 = gf.util.ByteBuffer,
        Gy = typeof Buffer > "u" ? Uint8Array : Buffer;
    gf.pki = gf.pki || {};
    gL4.exports = gf.pki.ed25519 = gf.ed25519 = gf.ed25519 || {};
    var pz = gf.ed25519;
    pz.constants = {};
    pz.constants.PUBLIC_KEY_BYTE_LENGTH = 32;
    pz.constants.PRIVATE_KEY_BYTE_LENGTH = 64;
    pz.constants.SEED_BYTE_LENGTH = 32;
    pz.constants.SIGN_BYTE_LENGTH = 64;
    pz.constants.HASH_BYTE_LENGTH = 64;
    pz.generateKeyPair = function(q) {
        q = q || {};
        var K = q.seed;
        if (K === void 0) K = gf.random.getBytesSync(pz.constants.SEED_BYTE_LENGTH);
        else if (typeof K === "string") {
            if (K.length !== pz.constants.SEED_BYTE_LENGTH) throw TypeError('"seed" must be ' + pz.constants.SEED_BYTE_LENGTH + " bytes in length.")
        } else if (!(K instanceof Uint8Array)) throw TypeError('"seed" must be a node.js Buffer, Uint8Array, or a binary string.');
        K = Qs({
            message: K,
            encoding: "binary"
        });
        var _ = new Gy(pz.constants.PUBLIC_KEY_BYTE_LENGTH),
            z = new Gy(pz.constants.PRIVATE_KEY_BYTE_LENGTH);
        for (var Y = 0; Y < 32; ++Y) z[Y] = K[Y];
        return ejz(_, z), {
            publicKey: _,
            privateKey: z
        }
    };
    pz.privateKeyFromAsn1 = function(q) {
        var K = {},
            _ = [],
            z = gf.asn1.validate(q, ojz, K, _);
        if (!z) {
            var Y = Error("Invalid Key.");
            throw Y.errors = _, Y
        }
        var A = gf.asn1.derToOid(K.privateKeyOid),
            O = gf.oids.EdDSA25519;
        if (A !== O) throw Error('Invalid OID "' + A + '"; OID must be "' + O + '".');
        var w = K.privateKey,
            $ = Qs({
                message: gf.asn1.fromDer(w).value,
                encoding: "binary"
            });
        return {
            privateKeyBytes: $
        }
    };
    pz.publicKeyFromAsn1 = function(q) {
        var K = {},
            _ = [],
            z = gf.asn1.validate(q, rjz, K, _);
        if (!z) {
            var Y = Error("Invalid Key.");
            throw Y.errors = _, Y
        }
        var A = gf.asn1.derToOid(K.publicKeyOid),
            O = gf.oids.EdDSA25519;
        if (A !== O) throw Error('Invalid OID "' + A + '"; OID must be "' + O + '".');
        var w = K.ed25519PublicKey;
        if (w.length !== pz.constants.PUBLIC_KEY_BYTE_LENGTH) throw Error("Key length is invalid.");
        return Qs({
            message: w,
            encoding: "binary"
        })
    };
    pz.publicKeyFromPrivateKey = function(q) {
        q = q || {};
        var K = Qs({
            message: q.privateKey,
            encoding: "binary"
        });
        if (K.length !== pz.constants.PRIVATE_KEY_BYTE_LENGTH) throw TypeError('"options.privateKey" must have a byte length of ' + pz.constants.PRIVATE_KEY_BYTE_LENGTH);
        var _ = new Gy(pz.constants.PUBLIC_KEY_BYTE_LENGTH);
        for (var z = 0; z < _.length; ++z) _[z] = K[32 + z];
        return _
    };
    pz.sign = function(q) {
        q = q || {};
        var K = Qs(q),
            _ = Qs({
                message: q.privateKey,
                encoding: "binary"
            });
        if (_.length === pz.constants.SEED_BYTE_LENGTH) {
            var z = pz.generateKeyPair({
                seed: _
            });
            _ = z.privateKey
        } else if (_.length !== pz.constants.PRIVATE_KEY_BYTE_LENGTH) throw TypeError('"options.privateKey" must have a byte length of ' + pz.constants.SEED_BYTE_LENGTH + " or " + pz.constants.PRIVATE_KEY_BYTE_LENGTH);
        var Y = new Gy(pz.constants.SIGN_BYTE_LENGTH + K.length);
        qHz(Y, K, K.length, _);
        var A = new Gy(pz.constants.SIGN_BYTE_LENGTH);
        for (var O = 0; O < A.length; ++O) A[O] = Y[O];
        return A
    };
    pz.verify = function(q) {
        q = q || {};
        var K = Qs(q);
        if (q.signature === void 0) throw TypeError('"options.signature" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a binary string.');
        var _ = Qs({
            message: q.signature,
            encoding: "binary"
        });
        if (_.length !== pz.constants.SIGN_BYTE_LENGTH) throw TypeError('"options.signature" must have a byte length of ' + pz.constants.SIGN_BYTE_LENGTH);
        var z = Qs({
            message: q.publicKey,
            encoding: "binary"
        });
        if (z.length !== pz.constants.PUBLIC_KEY_BYTE_LENGTH) throw TypeError('"options.publicKey" must have a byte length of ' + pz.constants.PUBLIC_KEY_BYTE_LENGTH);
        var Y = new Gy(pz.constants.SIGN_BYTE_LENGTH + K.length),
            A = new Gy(pz.constants.SIGN_BYTE_LENGTH + K.length),
            O;
        for (O = 0; O < pz.constants.SIGN_BYTE_LENGTH; ++O) Y[O] = _[O];
        for (O = 0; O < K.length; ++O) Y[O + pz.constants.SIGN_BYTE_LENGTH] = K[O];
        return KHz(A, Y, Y.length, z) >= 0
    };

    function Qs(q) {
        var K = q.message;
        if (K instanceof Uint8Array || K instanceof Gy) return K;
        var _ = q.encoding;
        if (K === void 0)
            if (q.md) K = q.md.digest().getBytes(), _ = "binary";
            else throw TypeError('"options.message" or "options.md" not specified.');
        if (typeof K === "string" && !_) throw TypeError('"options.encoding" must be "binary" or "utf8".');
        if (typeof K === "string") {
            if (typeof Buffer < "u") return Buffer.from(K, _);
            K = new fl1(K, _)
        } else if (!(K instanceof fl1)) throw TypeError('"options.message" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a string with "options.encoding" specifying its encoding.');
        var z = new Gy(K.length());
        for (var Y = 0; Y < z.length; ++Y) z[Y] = K.at(Y);
        return z
    }
    var Gl1 = T3(),
        wb8 = T3([1]),
        ajz = T3([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]),
        sjz = T3([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]),
        SL4 = T3([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]),
        CL4 = T3([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]),
        Wl1 = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]),
        tjz = T3([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);

    function H88(q, K) {
        var _ = gf.md.sha512.create(),
            z = new fl1(q);
        _.update(z.getBytes(K), "binary");
        var Y = _.digest().getBytes();
        if (typeof Buffer < "u") return Buffer.from(Y, "binary");
        var A = new Gy(pz.constants.HASH_BYTE_LENGTH);
        for (var O = 0; O < 64; ++O) A[O] = Y.charCodeAt(O);
        return A
    }

    function ejz(q, K) {
        var _ = [T3(), T3(), T3(), T3()],
            z, Y = H88(K, 32);
        Y[0] &= 248, Y[31] &= 127, Y[31] |= 64, kl1(_, Y), Vl1(q, _);
        for (z = 0; z < 32; ++z) K[z + 32] = q[z];
        return 0
    }

    function qHz(q, K, _, z) {
        var Y, A, O = new Float64Array(64),
            w = [T3(), T3(), T3(), T3()],
            $ = H88(z, 32);
        $[0] &= 248, $[31] &= 127, $[31] |= 64;
        var j = _ + 64;
        for (Y = 0; Y < _; ++Y) q[64 + Y] = K[Y];
        for (Y = 0; Y < 32; ++Y) q[32 + Y] = $[32 + Y];
        var H = H88(q.subarray(32), _ + 32);
        vl1(H), kl1(w, H), Vl1(q, w);
        for (Y = 32; Y < 64; ++Y) q[Y] = z[Y];
        var J = H88(q, _ + 64);
        vl1(J);
        for (Y = 32; Y < 64; ++Y) O[Y] = 0;
        for (Y = 0; Y < 32; ++Y) O[Y] = H[Y];
        for (Y = 0; Y < 32; ++Y)
            for (A = 0; A < 32; A++) O[Y + A] += J[Y] * $[A];
        return uL4(q.subarray(32), O), j
    }

    function KHz(q, K, _, z) {
        var Y, A, O = new Gy(32),
            w = [T3(), T3(), T3(), T3()],
            $ = [T3(), T3(), T3(), T3()];
        if (A = -1, _ < 64) return -1;
        if (_Hz($, z)) return -1;
        for (Y = 0; Y < _; ++Y) q[Y] = K[Y];
        for (Y = 0; Y < 32; ++Y) q[Y + 32] = z[Y];
        var j = H88(q, _);
        if (vl1(j), pL4(w, $, j), kl1($, K.subarray(32)), Tl1(w, $), Vl1(O, w), _ -= 64, mL4(K, 0, O, 0)) {
            for (Y = 0; Y < _; ++Y) q[Y] = 0;
            return -1
        }
        for (Y = 0; Y < _; ++Y) q[Y] = K[Y + 64];
        return A = _, A
    }

    function uL4(q, K) {
        var _, z, Y, A;
        for (z = 63; z >= 32; --z) {
            _ = 0;
            for (Y = z - 32, A = z - 12; Y < A; ++Y) K[Y] += _ - 16 * K[z] * Wl1[Y - (z - 32)], _ = K[Y] + 128 >> 8, K[Y] -= _ * 256;
            K[Y] += _, K[z] = 0
        }
        _ = 0;
        for (Y = 0; Y < 32; ++Y) K[Y] += _ - (K[31] >> 4) * Wl1[Y], _ = K[Y] >> 8, K[Y] &= 255;
        for (Y = 0; Y < 32; ++Y) K[Y] -= _ * Wl1[Y];
        for (z = 0; z < 32; ++z) K[z + 1] += K[z] >> 8, q[z] = K[z] & 255
    }

    function vl1(q) {
        var K = new Float64Array(64);
        for (var _ = 0; _ < 64; ++_) K[_] = q[_], q[_] = 0;
        uL4(q, K)
    }

    function Tl1(q, K) {
        var _ = T3(),
            z = T3(),
            Y = T3(),
            A = T3(),
            O = T3(),
            w = T3(),
            $ = T3(),
            j = T3(),
            H = T3();
        Yh6(_, q[1], q[0]), Yh6(H, K[1], K[0]), c2(_, _, H), zh6(z, q[0], q[1]), zh6(H, K[0], K[1]), c2(z, z, H), c2(Y, q[3], K[3]), c2(Y, Y, sjz), c2(A, q[2], K[2]), zh6(A, A, A), Yh6(O, z, _), Yh6(w, A, Y), zh6($, A, Y), zh6(j, z, _), c2(q[0], O, w), c2(q[1], j, $), c2(q[2], $, w), c2(q[3], O, j)
    }

    function bL4(q, K, _) {
        for (var z = 0; z < 4; ++z) FL4(q[z], K[z], _)
    }

    function Vl1(q, K) {
        var _ = T3(),
            z = T3(),
            Y = T3();
        OHz(Y, K[2]), c2(_, K[0], Y), c2(z, K[1], Y), $b8(q, z), q[31] ^= BL4(_) << 7
    }

    function $b8(q, K) {
        var _, z, Y, A = T3(),
            O = T3();
        for (_ = 0; _ < 16; ++_) O[_] = K[_];
        Dl1(O), Dl1(O), Dl1(O);
        for (z = 0; z < 2; ++z) {
            A[0] = O[0] - 65517;
            for (_ = 1; _ < 15; ++_) A[_] = O[_] - 65535 - (A[_ - 1] >> 16 & 1), A[_ - 1] &= 65535;
            A[15] = O[15] - 32767 - (A[14] >> 16 & 1), Y = A[15] >> 16 & 1, A[14] &= 65535, FL4(O, A, 1 - Y)
        }
        for (_ = 0; _ < 16; _++) q[2 * _] = O[_] & 255, q[2 * _ + 1] = O[_] >> 8
    }

    function _Hz(q, K) {
        var _ = T3(),
            z = T3(),
            Y = T3(),
            A = T3(),
            O = T3(),
            w = T3(),
            $ = T3();
        if (S56(q[2], wb8), zHz(q[1], K), CH6(Y, q[1]), c2(A, Y, ajz), Yh6(Y, Y, q[2]), zh6(A, q[2], A), CH6(O, A), CH6(w, O), c2($, w, O), c2(_, $, Y), c2(_, _, A), YHz(_, _), c2(_, _, Y), c2(_, _, A), c2(_, _, A), c2(q[0], _, A), CH6(z, q[0]), c2(z, z, A), IL4(z, Y)) c2(q[0], q[0], tjz);
        if (CH6(z, q[0]), c2(z, z, A), IL4(z, Y)) return -1;
        if (BL4(q[0]) === K[31] >> 7) Yh6(q[0], Gl1, q[0]);
        return c2(q[3], q[0], q[1]), 0
    }

    function zHz(q, K) {
        var _;
        for (_ = 0; _ < 16; ++_) q[_] = K[2 * _] + (K[2 * _ + 1] << 8);
        q[15] &= 32767
    }

    function YHz(q, K) {
        var _ = T3(),
            z;
        for (z = 0; z < 16; ++z) _[z] = K[z];
        for (z = 250; z >= 0; --z)
            if (CH6(_, _), z !== 1) c2(_, _, K);
        for (z = 0; z < 16; ++z) q[z] = _[z]
    }

    function IL4(q, K) {
        var _ = new Gy(32),
            z = new Gy(32);
        return $b8(_, q), $b8(z, K), mL4(_, 0, z, 0)
    }

    function mL4(q, K, _, z) {
        return AHz(q, K, _, z, 32)
    }

    function AHz(q, K, _, z, Y) {
        var A, O = 0;
        for (A = 0; A < Y; ++A) O |= q[K + A] ^ _[z + A];
        return (1 & O - 1 >>> 8) - 1
    }

    function BL4(q) {
        var K = new Gy(32);
        return $b8(K, q), K[0] & 1
    }

    function pL4(q, K, _) {
        var z, Y;
        S56(q[0], Gl1), S56(q[1], wb8), S56(q[2], wb8), S56(q[3], Gl1);
        for (Y = 255; Y >= 0; --Y) z = _[Y / 8 | 0] >> (Y & 7) & 1, bL4(q, K, z), Tl1(K, q), Tl1(q, q), bL4(q, K, z)
    }

    function kl1(q, K) {
        var _ = [T3(), T3(), T3(), T3()];
        S56(_[0], SL4), S56(_[1], CL4), S56(_[2], wb8), c2(_[3], SL4, CL4), pL4(q, _, K)
    }

    function S56(q, K) {
        var _;
        for (_ = 0; _ < 16; _++) q[_] = K[_] | 0
    }

    function OHz(q, K) {
        var _ = T3(),
            z;
        for (z = 0; z < 16; ++z) _[z] = K[z];
        for (z = 253; z >= 0; --z)
            if (CH6(_, _), z !== 2 && z !== 4) c2(_, _, K);
        for (z = 0; z < 16; ++z) q[z] = _[z]
    }

    function Dl1(q) {
        var K, _, z = 1;
        for (K = 0; K < 16; ++K) _ = q[K] + z + 65535, z = Math.floor(_ / 65536), q[K] = _ - z * 65536;
        q[0] += z - 1 + 37 * (z - 1)
    }

    function FL4(q, K, _) {
        var z, Y = ~(_ - 1);
        for (var A = 0; A < 16; ++A) z = Y & (q[A] ^ K[A]), q[A] ^= z, K[A] ^= z
    }

    function T3(q) {
        var K, _ = new Float64Array(16);
        if (q)
            for (K = 0; K < q.length; ++K) _[K] = q[K];
        return _
    }

    function zh6(q, K, _) {
        for (var z = 0; z < 16; ++z) q[z] = K[z] + _[z]
    }

    function Yh6(q, K, _) {
        for (var z = 0; z < 16; ++z) q[z] = K[z] - _[z]
    }

    function CH6(q, K) {
        c2(q, K, K)
    }

    function c2(q, K, _) {
        var z, Y, A = 0,
            O = 0,
            w = 0,
            $ = 0,
            j = 0,
            H = 0,
            J = 0,
            X = 0,
            M = 0,
            P = 0,
            W = 0,
            D = 0,
            Z = 0,
            G = 0,
            f = 0,
            v = 0,
            V = 0,
            k = 0,
            N = 0,
            R = 0,
            h = 0,
            C = 0,
            x = 0,
            B = 0,
            m = 0,
            S = 0,
            F = 0,
            U = 0,
            g = 0,
            c = 0,
            n = 0,
            l = _[0],
            z6 = _[1],
            A6 = _[2],
            e = _[3],
            i = _[4],
            O6 = _[5],
            J6 = _[6],
            $6 = _[7],
            H6 = _[8],
            q6 = _[9],
            o = _[10],
            _6 = _[11],
            r = _[12],
            t = _[13],
            Y6 = _[14],
            X6 = _[15];
        z = K[0], A += z * l, O += z * z6, w += z * A6, $ += z * e, j += z * i, H += z * O6, J += z * J6, X += z * $6, M += z * H6, P += z * q6, W += z * o, D += z * _6, Z += z * r, G += z * t, f += z * Y6, v += z * X6, z = K[1], O += z * l, w += z * z6, $ += z * A6, j += z * e, H += z * i, J += z * O6, X += z * J6, M += z * $6, P += z * H6, W += z * q6, D += z * o, Z += z * _6, G += z * r, f += z * t, v += z * Y6, V += z * X6, z = K[2], w += z * l, $ += z * z6, j += z * A6, H += z * e, J += z * i, X += z * O6, M += z * J6, P += z * $6, W += z * H6, D += z * q6, Z += z * o, G += z * _6, f += z * r, v += z * t, V += z * Y6, k += z * X6, z = K[3], $ += z * l, j += z * z6, H += z * A6, J += z * e, X += z * i, M += z * O6, P += z * J6, W += z * $6, D += z * H6, Z += z * q6, G += z * o, f += z * _6, v += z * r, V += z * t, k += z * Y6, N += z * X6, z = K[4], j += z * l, H += z * z6, J += z * A6, X += z * e, M += z * i, P += z * O6, W += z * J6, D += z * $6, Z += z * H6, G += z * q6, f += z * o, v += z * _6, V += z * r, k += z * t, N += z * Y6, R += z * X6, z = K[5], H += z * l, J += z * z6, X += z * A6, M += z * e, P += z * i, W += z * O6, D += z * J6, Z += z * $6, G += z * H6, f += z * q6, v += z * o, V += z * _6, k += z * r, N += z * t, R += z * Y6, h += z * X6, z = K[6], J += z * l, X += z * z6, M += z * A6, P += z * e, W += z * i, D += z * O6, Z += z * J6, G += z * $6, f += z * H6, v += z * q6, V += z * o, k += z * _6, N += z * r, R += z * t, h += z * Y6, C += z * X6, z = K[7], X += z * l, M += z * z6, P += z * A6, W += z * e, D += z * i, Z += z * O6, G += z * J6, f += z * $6, v += z * H6, V += z * q6, k += z * o, N += z * _6, R += z * r, h += z * t, C += z * Y6, x += z * X6, z = K[8], M += z * l, P += z * z6, W += z * A6, D += z * e, Z += z * i, G += z * O6, f += z * J6, v += z * $6, V += z * H6, k += z * q6, N += z * o, R += z * _6, h += z * r, C += z * t, x += z * Y6, B += z * X6, z = K[9], P += z * l, W += z * z6, D += z * A6, Z += z * e, G += z * i, f += z * O6, v += z * J6, V += z * $6, k += z * H6, N += z * q6, R += z * o, h += z * _6, C += z * r, x += z * t, B += z * Y6, m += z * X6, z = K[10], W += z * l, D += z * z6, Z += z * A6, G += z * e, f += z * i, v += z * O6, V += z * J6, k += z * $6, N += z * H6, R += z * q6, h += z * o, C += z * _6, x += z * r, B += z * t, m += z * Y6, S += z * X6, z = K[11], D += z * l, Z += z * z6, G += z * A6, f += z * e, v += z * i, V += z * O6, k += z * J6, N += z * $6, R += z * H6, h += z * q6, C += z * o, x += z * _6, B += z * r, m += z * t, S += z * Y6, F += z * X6, z = K[12], Z += z * l, G += z * z6, f += z * A6, v += z * e, V += z * i, k += z * O6, N += z * J6, R += z * $6, h += z * H6, C += z * q6, x += z * o, B += z * _6, m += z * r, S += z * t, F += z * Y6, U += z * X6, z = K[13], G += z * l, f += z * z6, v += z * A6, V += z * e, k += z * i, N += z * O6, R += z * J6, h += z * $6, C += z * H6, x += z * q6, B += z * o, m += z * _6, S += z * r, F += z * t, U += z * Y6, g += z * X6, z = K[14], f += z * l, v += z * z6, V += z * A6, k += z * e, N += z * i, R += z * O6, h += z * J6, C += z * $6, x += z * H6, B += z * q6, m += z * o, S += z * _6, F += z * r, U += z * t, g += z * Y6, c += z * X6, z = K[15], v += z * l, V += z * z6, k += z * A6, N += z * e, R += z * i, h += z * O6, C += z * J6, x += z * $6, B += z * H6, m += z * q6, S += z * o, F += z * _6, U += z * r, g += z * t, c += z * Y6, n += z * X6, A += 38 * V, O += 38 * k, w += 38 * N, $ += 38 * R, j += 38 * h, H += 38 * C, J += 38 * x, X += 38 * B, M += 38 * m, P += 38 * S, W += 38 * F, D += 38 * U, Z += 38 * g, G += 38 * c, f += 38 * n, Y = 1, z = A + Y + 65535, Y = Math.floor(z / 65536), A = z - Y * 65536, z = O + Y + 65535, Y = Math.floor(z / 65536), O = z - Y * 65536, z = w + Y + 65535, Y = Math.floor(z / 65536), w = z - Y * 65536, z = $ + Y + 65535, Y = Math.floor(z / 65536), $ = z - Y * 65536, z = j + Y + 65535, Y = Math.floor(z / 65536), j = z - Y * 65536, z = H + Y + 65535, Y = Math.floor(z / 65536), H = z - Y * 65536, z = J + Y + 65535, Y = Math.floor(z / 65536), J = z - Y * 65536, z = X + Y + 65535, Y = Math.floor(z / 65536), X = z - Y * 65536, z = M + Y + 65535, Y = Math.floor(z / 65536), M = z - Y * 65536, z = P + Y + 65535, Y = Math.floor(z / 65536), P = z - Y * 65536, z = W + Y + 65535, Y = Math.floor(z / 65536), W = z - Y * 65536, z = D + Y + 65535, Y = Math.floor(z / 65536), D = z - Y * 65536, z = Z + Y + 65535, Y = Math.floor(z / 65536), Z = z - Y * 65536, z = G + Y + 65535, Y = Math.floor(z / 65536), G = z - Y * 65536, z = f + Y + 65535, Y = Math.floor(z / 65536), f = z - Y * 65536, z = v + Y + 65535, Y = Math.floor(z / 65536), v = z - Y * 65536, A += Y - 1 + 37 * (Y - 1), Y = 1, z = A + Y + 65535, Y = Math.floor(z / 65536), A = z - Y * 65536, z = O + Y + 65535, Y = Math.floor(z / 65536), O = z - Y * 65536, z = w + Y + 65535, Y = Math.floor(z / 65536), w = z - Y * 65536, z = $ + Y + 65535, Y = Math.floor(z / 65536), $ = z - Y * 65536, z = j + Y + 65535, Y = Math.floor(z / 65536), j = z - Y * 65536, z = H + Y + 65535, Y = Math.floor(z / 65536), H = z - Y * 65536, z = J + Y + 65535, Y = Math.floor(z / 65536), J = z - Y * 65536, z = X + Y + 65535, Y = Math.floor(z / 65536), X = z - Y * 65536, z = M + Y + 65535, Y = Math.floor(z / 65536), M = z - Y * 65536, z = P + Y + 65535, Y = Math.floor(z / 65536), P = z - Y * 65536, z = W + Y + 65535, Y = Math.floor(z / 65536), W = z - Y * 65536, z = D + Y + 65535, Y = Math.floor(z / 65536), D = z - Y * 65536, z = Z + Y + 65535, Y = Math.floor(z / 65536), Z = z - Y * 65536, z = G + Y + 65535, Y = Math.floor(z / 65536), G = z - Y * 65536, z = f + Y + 65535, Y = Math.floor(z / 65536), f = z - Y * 65536, z = v + Y + 65535, Y = Math.floor(z / 65536), v = z - Y * 65536, A += Y - 1 + 37 * (Y - 1), q[0] = A, q[1] = O, q[2] = w, q[3] = $, q[4] = j, q[5] = H, q[6] = J, q[7] = X, q[8] = M, q[9] = P, q[10] = W, q[11] = D, q[12] = Z, q[13] = G, q[14] = f, q[15] = v
    }
})