
// @from(Ln 120286, Col 4)
cY8 = x((pv_, Tj7) => {
    var yA = h3();
    GC();
    HM6();
    VY1();
    $q6();
    gY8();
    HL();
    DM6();
    tY();
    var pY1 = function(A, q, K, Y) {
            var z = yA.util.createBuffer(),
                _ = A.length >> 1,
                w = _ + (A.length & 1),
                O = A.substr(0, w),
                $ = A.substr(_, w),
                H = yA.util.createBuffer(),
                j = yA.hmac.create();
            K = q + K;
            var J = Math.ceil(Y / 16),
                M = Math.ceil(Y / 20);
            j.start("MD5", O);
            var D = yA.util.createBuffer();
            H.putBytes(K);
            for (var X = 0; X < J; ++X) j.start(null, null), j.update(H.getBytes()), H.putBuffer(j.digest()), j.start(null, null), j.update(H.bytes() + K), D.putBuffer(j.digest());
            j.start("SHA1", $);
            var P = yA.util.createBuffer();
            H.clear(), H.putBytes(K);
            for (var X = 0; X < M; ++X) j.start(null, null), j.update(H.getBytes()), H.putBuffer(j.digest()), j.start(null, null), j.update(H.bytes() + K), P.putBuffer(j.digest());
            return z.putBytes(yA.util.xorBytes(D.getBytes(), P.getBytes(), Y)), z
        },
        FW3 = function(A, q, K) {
            var Y = yA.hmac.create();
            Y.start("SHA1", A);
            var z = yA.util.createBuffer();
            return z.putInt32(q[0]), z.putInt32(q[1]), z.putByte(K.type), z.putByte(K.version.major), z.putByte(K.version.minor), z.putInt16(K.length), z.putBytes(K.fragment.bytes()), Y.update(z.getBytes()), Y.digest().getBytes()
        },
        pW3 = function(A, q, K) {
            var Y = !1;
            try {
                var z = A.deflate(q.fragment.getBytes());
                q.fragment = yA.util.createBuffer(z), q.length = z.length, Y = !0
            } catch (_) {}
            return Y
        },
        QW3 = function(A, q, K) {
            var Y = !1;
            try {
                var z = A.inflate(q.fragment.getBytes());
                q.fragment = yA.util.createBuffer(z), q.length = z.length, Y = !0
            } catch (_) {}
            return Y
        },
        aV = function(A, q) {
            var K = 0;
            switch (q) {
                case 1:
                    K = A.getByte();
                    break;
                case 2:
                    K = A.getInt16();
                    break;
                case 3:
                    K = A.getInt24();
                    break;
                case 4:
                    K = A.getInt32();
                    break
            }
            return yA.util.createBuffer(A.getBytes(K))
        },
        DL = function(A, q, K) {
            A.putInt(K.length(), q << 3), A.putBuffer(K)
        },
        w1 = {};
    w1.Versions = {
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
    w1.SupportedVersions = [w1.Versions.TLS_1_1, w1.Versions.TLS_1_0];
    w1.Version = w1.SupportedVersions[0];
    w1.MaxFragment = 15360;
    w1.ConnectionEnd = {
        server: 0,
        client: 1
    };
    w1.PRFAlgorithm = {
        tls_prf_sha256: 0
    };
    w1.BulkCipherAlgorithm = {
        none: null,
        rc4: 0,
        des3: 1,
        aes: 2
    };
    w1.CipherType = {
        stream: 0,
        block: 1,
        aead: 2
    };
    w1.MACAlgorithm = {
        none: null,
        hmac_md5: 0,
        hmac_sha1: 1,
        hmac_sha256: 2,
        hmac_sha384: 3,
        hmac_sha512: 4
    };
    w1.CompressionMethod = {
        none: 0,
        deflate: 1
    };
    w1.ContentType = {
        change_cipher_spec: 20,
        alert: 21,
        handshake: 22,
        application_data: 23,
        heartbeat: 24
    };
    w1.HandshakeType = {
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
    w1.Alert = {};
    w1.Alert.Level = {
        warning: 1,
        fatal: 2
    };
    w1.Alert.Description = {
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
    w1.HeartbeatMessageType = {
        heartbeat_request: 1,
        heartbeat_response: 2
    };
    w1.CipherSuites = {};
    w1.getCipherSuite = function(A) {
        var q = null;
        for (var K in w1.CipherSuites) {
            var Y = w1.CipherSuites[K];
            if (Y.id[0] === A.charCodeAt(0) && Y.id[1] === A.charCodeAt(1)) {
                q = Y;
                break
            }
        }
        return q
    };
    w1.handleUnexpected = function(A, q) {
        var K = !A.open && A.entity === w1.ConnectionEnd.client;
        if (!K) A.error(A, {
            message: "Unexpected message. Received TLS record out of order.",
            send: !0,
            alert: {
                level: w1.Alert.Level.fatal,
                description: w1.Alert.Description.unexpected_message
            }
        })
    };
    w1.handleHelloRequest = function(A, q, K) {
        if (!A.handshaking && A.handshakes > 0) w1.queue(A, w1.createAlert(A, {
            level: w1.Alert.Level.warning,
            description: w1.Alert.Description.no_renegotiation
        })), w1.flush(A);
        A.process()
    };
    w1.parseHelloMessage = function(A, q, K) {
        var Y = null,
            z = A.entity === w1.ConnectionEnd.client;
        if (K < 38) A.error(A, {
            message: z ? "Invalid ServerHello message. Message too short." : "Invalid ClientHello message. Message too short.",
            send: !0,
            alert: {
                level: w1.Alert.Level.fatal,
                description: w1.Alert.Description.illegal_parameter
            }
        });
        else {
            var _ = q.fragment,
                w = _.length();
            if (Y = {
                    version: {
                        major: _.getByte(),
                        minor: _.getByte()
                    },
                    random: yA.util.createBuffer(_.getBytes(32)),
                    session_id: aV(_, 1),
                    extensions: []
                }, z) Y.cipher_suite = _.getBytes(2), Y.compression_method = _.getByte();
            else Y.cipher_suites = aV(_, 2), Y.compression_methods = aV(_, 1);
            if (w = K - (w - _.length()), w > 0) {
                var O = aV(_, 2);
                while (O.length() > 0) Y.extensions.push({
                    type: [O.getByte(), O.getByte()],
                    data: aV(O, 2)
                });
                if (!z)
                    for (var $ = 0; $ < Y.extensions.length; ++$) {
                        var H = Y.extensions[$];
                        if (H.type[0] === 0 && H.type[1] === 0) {
                            var j = aV(H.data, 2);
                            while (j.length() > 0) {
                                var J = j.getByte();
                                if (J !== 0) break;
                                A.session.extensions.server_name.serverNameList.push(aV(j, 2).getBytes())
                            }
                        }
                    }
            }
            if (A.session.version) {
                if (Y.version.major !== A.session.version.major || Y.version.minor !== A.session.version.minor) return A.error(A, {
                    message: "TLS version change is disallowed during renegotiation.",
                    send: !0,
                    alert: {
                        level: w1.Alert.Level.fatal,
                        description: w1.Alert.Description.protocol_version
                    }
                })
            }
            if (z) A.session.cipherSuite = w1.getCipherSuite(Y.cipher_suite);
            else {
                var M = yA.util.createBuffer(Y.cipher_suites.bytes());
                while (M.length() > 0)
                    if (A.session.cipherSuite = w1.getCipherSuite(M.getBytes(2)), A.session.cipherSuite !== null) break
            }
            if (A.session.cipherSuite === null) return A.error(A, {
                message: "No cipher suites in common.",
                send: !0,
                alert: {
                    level: w1.Alert.Level.fatal,
                    description: w1.Alert.Description.handshake_failure
                },
                cipherSuite: yA.util.bytesToHex(Y.cipher_suite)
            });
            if (z) A.session.compressionMethod = Y.compression_method;
            else A.session.compressionMethod = w1.CompressionMethod.none
        }
        return Y
    };
    w1.createSecurityParameters = function(A, q) {
        var K = A.entity === w1.ConnectionEnd.client,
            Y = q.random.bytes(),
            z = K ? A.session.sp.client_random : Y,
            _ = K ? Y : w1.createRandom().getBytes();
        A.session.sp = {
            entity: A.entity,
            prf_algorithm: w1.PRFAlgorithm.tls_prf_sha256,
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
            client_random: z,
            server_random: _
        }
    };
    w1.handleServerHello = function(A, q, K) {
        var Y = w1.parseHelloMessage(A, q, K);
        if (A.fail) return;
        if (Y.version.minor <= A.version.minor) A.version.minor = Y.version.minor;
        else return A.error(A, {
            message: "Incompatible TLS version.",
            send: !0,
            alert: {
                level: w1.Alert.Level.fatal,
                description: w1.Alert.Description.protocol_version
            }
        });
        A.session.version = A.version;
        var z = Y.session_id.bytes();
        if (z.length > 0 && z === A.session.id) A.expect = Pj7, A.session.resuming = !0, A.session.sp.server_random = Y.random.bytes();
        else A.expect = dW3, A.session.resuming = !1, w1.createSecurityParameters(A, Y);
        A.session.id = z, A.process()
    };
    w1.handleClientHello = function(A, q, K) {
        var Y = w1.parseHelloMessage(A, q, K);
        if (A.fail) return;
        var z = Y.session_id.bytes(),
            _ = null;
        if (A.sessionCache) {
            if (_ = A.sessionCache.getSession(z), _ === null) z = "";
            else if (_.version.major !== Y.version.major || _.version.minor > Y.version.minor) _ = null, z = ""
        }
        if (z.length === 0) z = yA.random.getBytes(32);
        if (A.session.id = z, A.session.clientHelloVersion = Y.version, A.session.sp = {}, _) A.version = A.session.version = _.version, A.session.sp = _.sp;
        else {
            var w;
            for (var O = 1; O < w1.SupportedVersions.length; ++O)
                if (w = w1.SupportedVersions[O], w.minor <= Y.version.minor) break;
            A.version = {
                major: w.major,
                minor: w.minor
            }, A.session.version = A.version
        }
        if (_ !== null) A.expect = UY8, A.session.resuming = !0, A.session.sp.client_random = Y.random.bytes();
        else A.expect = A.verifyClient !== !1 ? aW3 : QY8, A.session.resuming = !1, w1.createSecurityParameters(A, Y);
        if (A.open = !0, w1.queue(A, w1.createRecord(A, {
                type: w1.ContentType.handshake,
                data: w1.createServerHello(A)
            })), A.session.resuming) w1.queue(A, w1.createRecord(A, {
            type: w1.ContentType.change_cipher_spec,
            data: w1.createChangeCipherSpec()
        })), A.state.pending = w1.createConnectionState(A), A.state.current.write = A.state.pending.write, w1.queue(A, w1.createRecord(A, {
            type: w1.ContentType.handshake,
            data: w1.createFinished(A)
        }));
        else if (w1.queue(A, w1.createRecord(A, {
                type: w1.ContentType.handshake,
                data: w1.createCertificate(A)
            })), !A.fail) {
            if (w1.queue(A, w1.createRecord(A, {
                    type: w1.ContentType.handshake,
                    data: w1.createServerKeyExchange(A)
                })), A.verifyClient !== !1) w1.queue(A, w1.createRecord(A, {
                type: w1.ContentType.handshake,
                data: w1.createCertificateRequest(A)
            }));
            w1.queue(A, w1.createRecord(A, {
                type: w1.ContentType.handshake,
                data: w1.createServerHelloDone(A)
            }))
        }
        w1.flush(A), A.process()
    };
    w1.handleCertificate = function(A, q, K) {
        if (K < 3) return A.error(A, {
            message: "Invalid Certificate message. Message too short.",
            send: !0,
            alert: {
                level: w1.Alert.Level.fatal,
                description: w1.Alert.Description.illegal_parameter
            }
        });
        var Y = q.fragment,
            z = {
                certificate_list: aV(Y, 3)
            },
            _, w, O = [];
        try {
            while (z.certificate_list.length() > 0) _ = aV(z.certificate_list, 3), w = yA.asn1.fromDer(_), _ = yA.pki.certificateFromAsn1(w, !0), O.push(_)
        } catch (H) {
            return A.error(A, {
                message: "Could not parse certificate list.",
                cause: H,
                send: !0,
                alert: {
                    level: w1.Alert.Level.fatal,
                    description: w1.Alert.Description.bad_certificate
                }
            })
        }
        var $ = A.entity === w1.ConnectionEnd.client;
        if (($ || A.verifyClient === !0) && O.length === 0) A.error(A, {
            message: $ ? "No server certificate provided." : "No client certificate provided.",
            send: !0,
            alert: {
                level: w1.Alert.Level.fatal,
                description: w1.Alert.Description.illegal_parameter
            }
        });
        else if (O.length === 0) A.expect = $ ? Dj7 : QY8;
        else {
            if ($) A.session.serverCertificate = O[0];
            else A.session.clientCertificate = O[0];
            if (w1.verifyCertificateChain(A, O)) A.expect = $ ? Dj7 : QY8
        }
        A.process()
    };
    w1.handleServerKeyExchange = function(A, q, K) {
        if (K > 0) return A.error(A, {
            message: "Invalid key parameters. Only RSA is supported.",
            send: !0,
            alert: {
                level: w1.Alert.Level.fatal,
                description: w1.Alert.Description.unsupported_certificate
            }
        });
        A.expect = cW3, A.process()
    };
    w1.handleClientKeyExchange = function(A, q, K) {
        if (K < 48) return A.error(A, {
            message: "Invalid key parameters. Only RSA is supported.",
            send: !0,
            alert: {
                level: w1.Alert.Level.fatal,
                description: w1.Alert.Description.unsupported_certificate
            }
        });
        var Y = q.fragment,
            z = {
                enc_pre_master_secret: aV(Y, 2).getBytes()
            },
            _ = null;
        if (A.getPrivateKey) try {
            _ = A.getPrivateKey(A, A.session.serverCertificate), _ = yA.pki.privateKeyFromPem(_)
        } catch ($) {
            A.error(A, {
                message: "Could not get private key.",
                cause: $,
                send: !0,
                alert: {
                    level: w1.Alert.Level.fatal,
                    description: w1.Alert.Description.internal_error
                }
            })
        }
        if (_ === null) return A.error(A, {
            message: "No private key set.",
            send: !0,
            alert: {
                level: w1.Alert.Level.fatal,
                description: w1.Alert.Description.internal_error
            }
        });
        try {
            var w = A.session.sp;
            w.pre_master_secret = _.decrypt(z.enc_pre_master_secret);
            var O = A.session.clientHelloVersion;
            if (O.major !== w.pre_master_secret.charCodeAt(0) || O.minor !== w.pre_master_secret.charCodeAt(1)) throw Error("TLS version rollback attack detected.")
        } catch ($) {
            w.pre_master_secret = yA.random.getBytes(48)
        }
        if (A.expect = UY8, A.session.clientCertificate !== null) A.expect = sW3;
        A.process()
    };
    w1.handleCertificateRequest = function(A, q, K) {
        if (K < 3) return A.error(A, {
            message: "Invalid CertificateRequest. Message too short.",
            send: !0,
            alert: {
                level: w1.Alert.Level.fatal,
                description: w1.Alert.Description.illegal_parameter
            }
        });
        var Y = q.fragment,
            z = {
                certificate_types: aV(Y, 1),
                certificate_authorities: aV(Y, 2)
            };
        A.session.certificateRequest = z, A.expect = lW3, A.process()
    };
    w1.handleCertificateVerify = function(A, q, K) {
        if (K < 2) return A.error(A, {
            message: "Invalid CertificateVerify. Message too short.",
            send: !0,
            alert: {
                level: w1.Alert.Level.fatal,
                description: w1.Alert.Description.illegal_parameter
            }
        });
        var Y = q.fragment;
        Y.read -= 4;
        var z = Y.bytes();
        Y.read += 4;
        var _ = {
                signature: aV(Y, 2).getBytes()
            },
            w = yA.util.createBuffer();
        w.putBuffer(A.session.md5.digest()), w.putBuffer(A.session.sha1.digest()), w = w.getBytes();
        try {
            var O = A.session.clientCertificate;
            if (!O.publicKey.verify(w, _.signature, "NONE")) throw Error("CertificateVerify signature does not match.");
            A.session.md5.update(z), A.session.sha1.update(z)
        } catch ($) {
            return A.error(A, {
                message: "Bad signature in CertificateVerify.",
                send: !0,
                alert: {
                    level: w1.Alert.Level.fatal,
                    description: w1.Alert.Description.handshake_failure
                }
            })
        }
        A.expect = UY8, A.process()
    };
    w1.handleServerHelloDone = function(A, q, K) {
        if (K > 0) return A.error(A, {
            message: "Invalid ServerHelloDone message. Invalid length.",
            send: !0,
            alert: {
                level: w1.Alert.Level.fatal,
                description: w1.Alert.Description.record_overflow
            }
        });
        if (A.serverCertificate === null) {
            var Y = {
                    message: "No server certificate provided. Not enough security.",
                    send: !0,
                    alert: {
                        level: w1.Alert.Level.fatal,
                        description: w1.Alert.Description.insufficient_security
                    }
                },
                z = 0,
                _ = A.verify(A, Y.alert.description, z, []);
            if (_ !== !0) {
                if (_ || _ === 0) {
                    if (typeof _ === "object" && !yA.util.isArray(_)) {
                        if (_.message) Y.message = _.message;
                        if (_.alert) Y.alert.description = _.alert
                    } else if (typeof _ === "number") Y.alert.description = _
                }
                return A.error(A, Y)
            }
        }
        if (A.session.certificateRequest !== null) q = w1.createRecord(A, {
            type: w1.ContentType.handshake,
            data: w1.createCertificate(A)
        }), w1.queue(A, q);
        q = w1.createRecord(A, {
            type: w1.ContentType.handshake,
            data: w1.createClientKeyExchange(A)
        }), w1.queue(A, q), A.expect = rW3;
        var w = function(O, $) {
            if (O.session.certificateRequest !== null && O.session.clientCertificate !== null) w1.queue(O, w1.createRecord(O, {
                type: w1.ContentType.handshake,
                data: w1.createCertificateVerify(O, $)
            }));
            w1.queue(O, w1.createRecord(O, {
                type: w1.ContentType.change_cipher_spec,
                data: w1.createChangeCipherSpec()
            })), O.state.pending = w1.createConnectionState(O), O.state.current.write = O.state.pending.write, w1.queue(O, w1.createRecord(O, {
                type: w1.ContentType.handshake,
                data: w1.createFinished(O)
            })), O.expect = Pj7, w1.flush(O), O.process()
        };
        if (A.session.certificateRequest === null || A.session.clientCertificate === null) return w(A, null);
        w1.getClientSignature(A, w)
    };
    w1.handleChangeCipherSpec = function(A, q) {
        if (q.fragment.getByte() !== 1) return A.error(A, {
            message: "Invalid ChangeCipherSpec message received.",
            send: !0,
            alert: {
                level: w1.Alert.Level.fatal,
                description: w1.Alert.Description.illegal_parameter
            }
        });
        var K = A.entity === w1.ConnectionEnd.client;
        if (A.session.resuming && K || !A.session.resuming && !K) A.state.pending = w1.createConnectionState(A);
        if (A.state.current.read = A.state.pending.read, !A.session.resuming && K || A.session.resuming && !K) A.state.pending = null;
        A.expect = K ? iW3 : tW3, A.process()
    };
    w1.handleFinished = function(A, q, K) {
        var Y = q.fragment;
        Y.read -= 4;
        var z = Y.bytes();
        Y.read += 4;
        var _ = q.fragment.getBytes();
        Y = yA.util.createBuffer(), Y.putBuffer(A.session.md5.digest()), Y.putBuffer(A.session.sha1.digest());
        var w = A.entity === w1.ConnectionEnd.client,
            O = w ? "server finished" : "client finished",
            $ = A.session.sp,
            H = 12,
            j = pY1;
        if (Y = j($.master_secret, O, Y.getBytes(), H), Y.getBytes() !== _) return A.error(A, {
            message: "Invalid verify_data in Finished message.",
            send: !0,
            alert: {
                level: w1.Alert.Level.fatal,
                description: w1.Alert.Description.decrypt_error
            }
        });
        if (A.session.md5.update(z), A.session.sha1.update(z), A.session.resuming && w || !A.session.resuming && !w) w1.queue(A, w1.createRecord(A, {
            type: w1.ContentType.change_cipher_spec,
            data: w1.createChangeCipherSpec()
        })), A.state.current.write = A.state.pending.write, A.state.pending = null, w1.queue(A, w1.createRecord(A, {
            type: w1.ContentType.handshake,
            data: w1.createFinished(A)
        }));
        A.expect = w ? nW3 : eW3, A.handshaking = !1, ++A.handshakes, A.peerCertificate = w ? A.session.serverCertificate : A.session.clientCertificate, w1.flush(A), A.isConnected = !0, A.connected(A), A.process()
    };
    w1.handleAlert = function(A, q) {
        var K = q.fragment,
            Y = {
                level: K.getByte(),
                description: K.getByte()
            },
            z;
        switch (Y.description) {
            case w1.Alert.Description.close_notify:
                z = "Connection closed.";
                break;
            case w1.Alert.Description.unexpected_message:
                z = "Unexpected message.";
                break;
            case w1.Alert.Description.bad_record_mac:
                z = "Bad record MAC.";
                break;
            case w1.Alert.Description.decryption_failed:
                z = "Decryption failed.";
                break;
            case w1.Alert.Description.record_overflow:
                z = "Record overflow.";
                break;
            case w1.Alert.Description.decompression_failure:
                z = "Decompression failed.";
                break;
            case w1.Alert.Description.handshake_failure:
                z = "Handshake failure.";
                break;
            case w1.Alert.Description.bad_certificate:
                z = "Bad certificate.";
                break;
            case w1.Alert.Description.unsupported_certificate:
                z = "Unsupported certificate.";
                break;
            case w1.Alert.Description.certificate_revoked:
                z = "Certificate revoked.";
                break;
            case w1.Alert.Description.certificate_expired:
                z = "Certificate expired.";
                break;
            case w1.Alert.Description.certificate_unknown:
                z = "Certificate unknown.";
                break;
            case w1.Alert.Description.illegal_parameter:
                z = "Illegal parameter.";
                break;
            case w1.Alert.Description.unknown_ca:
                z = "Unknown certificate authority.";
                break;
            case w1.Alert.Description.access_denied:
                z = "Access denied.";
                break;
            case w1.Alert.Description.decode_error:
                z = "Decode error.";
                break;
            case w1.Alert.Description.decrypt_error:
                z = "Decrypt error.";
                break;
            case w1.Alert.Description.export_restriction:
                z = "Export restriction.";
                break;
            case w1.Alert.Description.protocol_version:
                z = "Unsupported protocol version.";
                break;
            case w1.Alert.Description.insufficient_security:
                z = "Insufficient security.";
                break;
            case w1.Alert.Description.internal_error:
                z = "Internal error.";
                break;
            case w1.Alert.Description.user_canceled:
                z = "User canceled.";
                break;
            case w1.Alert.Description.no_renegotiation:
                z = "Renegotiation not supported.";
                break;
            default:
                z = "Unknown error.";
                break
        }
        if (Y.description === w1.Alert.Description.close_notify) return A.close();
        A.error(A, {
            message: z,
            send: !1,
            origin: A.entity === w1.ConnectionEnd.client ? "server" : "client",
            alert: Y
        }), A.process()
    };
    w1.handleHandshake = function(A, q) {
        var K = q.fragment,
            Y = K.getByte(),
            z = K.getInt24();
        if (z > K.length()) return A.fragmented = q, q.fragment = yA.util.createBuffer(), K.read -= 4, A.process();
        A.fragmented = null, K.read -= 4;
        var _ = K.bytes(z + 4);
        if (K.read += 4, Y in FY1[A.entity][A.expect]) {
            if (A.entity === w1.ConnectionEnd.server && !A.open && !A.fail) A.handshaking = !0, A.session = {
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
                md5: yA.md.md5.create(),
                sha1: yA.md.sha1.create()
            };
            if (Y !== w1.HandshakeType.hello_request && Y !== w1.HandshakeType.certificate_verify && Y !== w1.HandshakeType.finished) A.session.md5.update(_), A.session.sha1.update(_);
            FY1[A.entity][A.expect][Y](A, q, z)
        } else w1.handleUnexpected(A, q)
    };
    w1.handleApplicationData = function(A, q) {
        A.data.putBuffer(q.fragment), A.dataReady(A), A.process()
    };
    w1.handleHeartbeat = function(A, q) {
        var K = q.fragment,
            Y = K.getByte(),
            z = K.getInt16(),
            _ = K.getBytes(z);
        if (Y === w1.HeartbeatMessageType.heartbeat_request) {
            if (A.handshaking || z > _.length) return A.process();
            w1.queue(A, w1.createRecord(A, {
                type: w1.ContentType.heartbeat,
                data: w1.createHeartbeat(w1.HeartbeatMessageType.heartbeat_response, _)
            })), w1.flush(A)
        } else if (Y === w1.HeartbeatMessageType.heartbeat_response) {
            if (_ !== A.expectedHeartbeatPayload) return A.process();
            if (A.heartbeatReceived) A.heartbeatReceived(A, yA.util.createBuffer(_))
        }
        A.process()
    };
    var UW3 = 0,
        dW3 = 1,
        Dj7 = 2,
        cW3 = 3,
        lW3 = 4,
        Pj7 = 5,
        iW3 = 6,
        nW3 = 7,
        rW3 = 8,
        oW3 = 0,
        aW3 = 1,
        QY8 = 2,
        sW3 = 3,
        UY8 = 4,
        tW3 = 5,
        eW3 = 6,
        Y1 = w1.handleUnexpected,
        Wj7 = w1.handleChangeCipherSpec,
        IP = w1.handleAlert,
        uG = w1.handleHandshake,
        Zj7 = w1.handleApplicationData,
        bP = w1.handleHeartbeat,
        dY8 = [];
    dY8[w1.ConnectionEnd.client] = [
        [Y1, IP, uG, Y1, bP],
        [Y1, IP, uG, Y1, bP],
        [Y1, IP, uG, Y1, bP],
        [Y1, IP, uG, Y1, bP],
        [Y1, IP, uG, Y1, bP],
        [Wj7, IP, Y1, Y1, bP],
        [Y1, IP, uG, Y1, bP],
        [Y1, IP, uG, Zj7, bP],
        [Y1, IP, uG, Y1, bP]
    ];
    dY8[w1.ConnectionEnd.server] = [
        [Y1, IP, uG, Y1, bP],
        [Y1, IP, uG, Y1, bP],
        [Y1, IP, uG, Y1, bP],
        [Y1, IP, uG, Y1, bP],
        [Wj7, IP, Y1, Y1, bP],
        [Y1, IP, uG, Y1, bP],
        [Y1, IP, uG, Zj7, bP],
        [Y1, IP, uG, Y1, bP]
    ];
    var {
        handleHelloRequest: wa,
        handleServerHello: AZ3,
        handleCertificate: Gj7,
        handleServerKeyExchange: Xj7,
        handleCertificateRequest: FY8,
        handleServerHelloDone: gY1,
        handleFinished: fj7
    } = w1, FY1 = [];
    FY1[w1.ConnectionEnd.client] = [
        [Y1, Y1, AZ3, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1],
        [wa, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Gj7, Xj7, FY8, gY1, Y1, Y1, Y1, Y1, Y1, Y1],
        [wa, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Xj7, FY8, gY1, Y1, Y1, Y1, Y1, Y1, Y1],
        [wa, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, FY8, gY1, Y1, Y1, Y1, Y1, Y1, Y1],
        [wa, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, gY1, Y1, Y1, Y1, Y1, Y1, Y1],
        [wa, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1],
        [wa, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, fj7],
        [wa, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1],
        [wa, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1]
    ];
    var {
        handleClientHello: qZ3,
        handleClientKeyExchange: KZ3,
        handleCertificateVerify: YZ3
    } = w1;
    FY1[w1.ConnectionEnd.server] = [
        [Y1, qZ3, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1],
        [Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Gj7, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1],
        [Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, KZ3, Y1, Y1, Y1, Y1],
        [Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, YZ3, Y1, Y1, Y1, Y1, Y1],
        [Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1],
        [Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, fj7],
        [Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1],
        [Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1, Y1]
    ];
    w1.generateKeys = function(A, q) {
        var K = pY1,
            Y = q.client_random + q.server_random;
        if (!A.session.resuming) q.master_secret = K(q.pre_master_secret, "master secret", Y, 48).bytes(), q.pre_master_secret = null;
        Y = q.server_random + q.client_random;
        var z = 2 * q.mac_key_length + 2 * q.enc_key_length,
            _ = A.version.major === w1.Versions.TLS_1_0.major && A.version.minor === w1.Versions.TLS_1_0.minor;
        if (_) z += 2 * q.fixed_iv_length;
        var w = K(q.master_secret, "key expansion", Y, z),
            O = {
                client_write_MAC_key: w.getBytes(q.mac_key_length),
                server_write_MAC_key: w.getBytes(q.mac_key_length),
                client_write_key: w.getBytes(q.enc_key_length),
                server_write_key: w.getBytes(q.enc_key_length)
            };
        if (_) O.client_write_IV = w.getBytes(q.fixed_iv_length), O.server_write_IV = w.getBytes(q.fixed_iv_length);
        return O
    };
    w1.createConnectionState = function(A) {
        var q = A.entity === w1.ConnectionEnd.client,
            K = function() {
                var _ = {
                    sequenceNumber: [0, 0],
                    macKey: null,
                    macLength: 0,
                    macFunction: null,
                    cipherState: null,
                    cipherFunction: function(w) {
                        return !0
                    },
                    compressionState: null,
                    compressFunction: function(w) {
                        return !0
                    },
                    updateSequenceNumber: function() {
                        if (_.sequenceNumber[1] === 4294967295) _.sequenceNumber[1] = 0, ++_.sequenceNumber[0];
                        else ++_.sequenceNumber[1]
                    }
                };
                return _
            },
            Y = {
                read: K(),
                write: K()
            };
        if (Y.read.update = function(_, w) {
                if (!Y.read.cipherFunction(w, Y.read)) _.error(_, {
                    message: "Could not decrypt record or bad MAC.",
                    send: !0,
                    alert: {
                        level: w1.Alert.Level.fatal,
                        description: w1.Alert.Description.bad_record_mac
                    }
                });
                else if (!Y.read.compressFunction(_, w, Y.read)) _.error(_, {
                    message: "Could not decompress record.",
                    send: !0,
                    alert: {
                        level: w1.Alert.Level.fatal,
                        description: w1.Alert.Description.decompression_failure
                    }
                });
                return !_.fail
            }, Y.write.update = function(_, w) {
                if (!Y.write.compressFunction(_, w, Y.write)) _.error(_, {
                    message: "Could not compress record.",
                    send: !1,
                    alert: {
                        level: w1.Alert.Level.fatal,
                        description: w1.Alert.Description.internal_error
                    }
                });
                else if (!Y.write.cipherFunction(w, Y.write)) _.error(_, {
                    message: "Could not encrypt record.",
                    send: !1,
                    alert: {
                        level: w1.Alert.Level.fatal,
                        description: w1.Alert.Description.internal_error
                    }
                });
                return !_.fail
            }, A.session) {
            var z = A.session.sp;
            switch (A.session.cipherSuite.initSecurityParameters(z), z.keys = w1.generateKeys(A, z), Y.read.macKey = q ? z.keys.server_write_MAC_key : z.keys.client_write_MAC_key, Y.write.macKey = q ? z.keys.client_write_MAC_key : z.keys.server_write_MAC_key, A.session.cipherSuite.initConnectionState(Y, A, z), z.compression_algorithm) {
                case w1.CompressionMethod.none:
                    break;
                case w1.CompressionMethod.deflate:
                    Y.read.compressFunction = QW3, Y.write.compressFunction = pW3;
                    break;
                default:
                    throw Error("Unsupported compression algorithm.")
            }
        }
        return Y
    };
    w1.createRandom = function() {
        var A = new Date,
            q = +A + A.getTimezoneOffset() * 60000,
            K = yA.util.createBuffer();
        return K.putInt32(q), K.putBytes(yA.random.getBytes(28)), K
    };
    w1.createRecord = function(A, q) {
        if (!q.data) return null;
        var K = {
            type: q.type,
            version: {
                major: A.version.major,
                minor: A.version.minor
            },
            length: q.data.length(),
            fragment: q.data
        };
        return K
    };
    w1.createAlert = function(A, q) {
        var K = yA.util.createBuffer();
        return K.putByte(q.level), K.putByte(q.description), w1.createRecord(A, {
            type: w1.ContentType.alert,
            data: K
        })
    };
    w1.createClientHello = function(A) {
        A.session.clientHelloVersion = {
            major: A.version.major,
            minor: A.version.minor
        };
        var q = yA.util.createBuffer();
        for (var K = 0; K < A.cipherSuites.length; ++K) {
            var Y = A.cipherSuites[K];
            q.putByte(Y.id[0]), q.putByte(Y.id[1])
        }
        var z = q.length(),
            _ = yA.util.createBuffer();
        _.putByte(w1.CompressionMethod.none);
        var w = _.length(),
            O = yA.util.createBuffer();
        if (A.virtualHost) {
            var $ = yA.util.createBuffer();
            $.putByte(0), $.putByte(0);
            var H = yA.util.createBuffer();
            H.putByte(0), DL(H, 2, yA.util.createBuffer(A.virtualHost));
            var j = yA.util.createBuffer();
            DL(j, 2, H), DL($, 2, j), O.putBuffer($)
        }
        var J = O.length();
        if (J > 0) J += 2;
        var M = A.session.id,
            D = M.length + 1 + 2 + 4 + 28 + 2 + z + 1 + w + J,
            X = yA.util.createBuffer();
        if (X.putByte(w1.HandshakeType.client_hello), X.putInt24(D), X.putByte(A.version.major), X.putByte(A.version.minor), X.putBytes(A.session.sp.client_random), DL(X, 1, yA.util.createBuffer(M)), DL(X, 2, q), DL(X, 1, _), J > 0) DL(X, 2, O);
        return X
    };
    w1.createServerHello = function(A) {
        var q = A.session.id,
            K = q.length + 1 + 2 + 4 + 28 + 2 + 1,
            Y = yA.util.createBuffer();
        return Y.putByte(w1.HandshakeType.server_hello), Y.putInt24(K), Y.putByte(A.version.major), Y.putByte(A.version.minor), Y.putBytes(A.session.sp.server_random), DL(Y, 1, yA.util.createBuffer(q)), Y.putByte(A.session.cipherSuite.id[0]), Y.putByte(A.session.cipherSuite.id[1]), Y.putByte(A.session.compressionMethod), Y
    };
    w1.createCertificate = function(A) {
        var q = A.entity === w1.ConnectionEnd.client,
            K = null;
        if (A.getCertificate) {
            var Y;
            if (q) Y = A.session.certificateRequest;
            else Y = A.session.extensions.server_name.serverNameList;
            K = A.getCertificate(A, Y)
        }
        var z = yA.util.createBuffer();
        if (K !== null) try {
            if (!yA.util.isArray(K)) K = [K];
            var _ = null;
            for (var w = 0; w < K.length; ++w) {
                var O = yA.pem.decode(K[w])[0];
                if (O.type !== "CERTIFICATE" && O.type !== "X509 CERTIFICATE" && O.type !== "TRUSTED CERTIFICATE") {
                    var $ = Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
                    throw $.headerType = O.type, $
                }
                if (O.procType && O.procType.type === "ENCRYPTED") throw Error("Could not convert certificate from PEM; PEM is encrypted.");
                var H = yA.util.createBuffer(O.body);
                if (_ === null) _ = yA.asn1.fromDer(H.bytes(), !1);
                var j = yA.util.createBuffer();
                DL(j, 3, H), z.putBuffer(j)
            }
            if (K = yA.pki.certificateFromAsn1(_), q) A.session.clientCertificate = K;
            else A.session.serverCertificate = K
        } catch (D) {
            return A.error(A, {
                message: "Could not send certificate list.",
                cause: D,
                send: !0,
                alert: {
                    level: w1.Alert.Level.fatal,
                    description: w1.Alert.Description.bad_certificate
                }
            })
        }
        var J = 3 + z.length(),
            M = yA.util.createBuffer();
        return M.putByte(w1.HandshakeType.certificate), M.putInt24(J), DL(M, 3, z), M
    };
    w1.createClientKeyExchange = function(A) {
        var q = yA.util.createBuffer();
        q.putByte(A.session.clientHelloVersion.major), q.putByte(A.session.clientHelloVersion.minor), q.putBytes(yA.random.getBytes(46));
        var K = A.session.sp;
        K.pre_master_secret = q.getBytes();
        var Y = A.session.serverCertificate.publicKey;
        q = Y.encrypt(K.pre_master_secret);
        var z = q.length + 2,
            _ = yA.util.createBuffer();
        return _.putByte(w1.HandshakeType.client_key_exchange), _.putInt24(z), _.putInt16(q.length), _.putBytes(q), _
    };
    w1.createServerKeyExchange = function(A) {
        var q = 0,
            K = yA.util.createBuffer();
        if (q > 0) K.putByte(w1.HandshakeType.server_key_exchange), K.putInt24(q);
        return K
    };
    w1.getClientSignature = function(A, q) {
        var K = yA.util.createBuffer();
        K.putBuffer(A.session.md5.digest()), K.putBuffer(A.session.sha1.digest()), K = K.getBytes(), A.getSignature = A.getSignature || function(Y, z, _) {
            var w = null;
            if (Y.getPrivateKey) try {
                w = Y.getPrivateKey(Y, Y.session.clientCertificate), w = yA.pki.privateKeyFromPem(w)
            } catch (O) {
                Y.error(Y, {
                    message: "Could not get private key.",
                    cause: O,
                    send: !0,
                    alert: {
                        level: w1.Alert.Level.fatal,
                        description: w1.Alert.Description.internal_error
                    }
                })
            }
            if (w === null) Y.error(Y, {
                message: "No private key set.",
                send: !0,
                alert: {
                    level: w1.Alert.Level.fatal,
                    description: w1.Alert.Description.internal_error
                }
            });
            else z = w.sign(z, null);
            _(Y, z)
        }, A.getSignature(A, K, q)
    };
    w1.createCertificateVerify = function(A, q) {
        var K = q.length + 2,
            Y = yA.util.createBuffer();
        return Y.putByte(w1.HandshakeType.certificate_verify), Y.putInt24(K), Y.putInt16(q.length), Y.putBytes(q), Y
    };
    w1.createCertificateRequest = function(A) {
        var q = yA.util.createBuffer();
        q.putByte(1);
        var K = yA.util.createBuffer();
        for (var Y in A.caStore.certs) {
            var z = A.caStore.certs[Y],
                _ = yA.pki.distinguishedNameToAsn1(z.subject),
                w = yA.asn1.toDer(_);
            K.putInt16(w.length()), K.putBuffer(w)
        }
        var O = 1 + q.length() + 2 + K.length(),
            $ = yA.util.createBuffer();
        return $.putByte(w1.HandshakeType.certificate_request), $.putInt24(O), DL($, 1, q), DL($, 2, K), $
    };
    w1.createServerHelloDone = function(A) {
        var q = yA.util.createBuffer();
        return q.putByte(w1.HandshakeType.server_hello_done), q.putInt24(0), q
    };
    w1.createChangeCipherSpec = function() {
        var A = yA.util.createBuffer();
        return A.putByte(1), A
    };
    w1.createFinished = function(A) {
        var q = yA.util.createBuffer();
        q.putBuffer(A.session.md5.digest()), q.putBuffer(A.session.sha1.digest());
        var K = A.entity === w1.ConnectionEnd.client,
            Y = A.session.sp,
            z = 12,
            _ = pY1,
            w = K ? "client finished" : "server finished";
        q = _(Y.master_secret, w, q.getBytes(), z);
        var O = yA.util.createBuffer();
        return O.putByte(w1.HandshakeType.finished), O.putInt24(q.length()), O.putBuffer(q), O
    };
    w1.createHeartbeat = function(A, q, K) {
        if (typeof K > "u") K = q.length;
        var Y = yA.util.createBuffer();
        Y.putByte(A), Y.putInt16(K), Y.putBytes(q);
        var z = Y.length(),
            _ = Math.max(16, z - K - 3);
        return Y.putBytes(yA.random.getBytes(_)), Y
    };
    w1.queue = function(A, q) {
        if (!q) return;
        if (q.fragment.length() === 0) {
            if (q.type === w1.ContentType.handshake || q.type === w1.ContentType.alert || q.type === w1.ContentType.change_cipher_spec) return
        }
        if (q.type === w1.ContentType.handshake) {
            var K = q.fragment.bytes();
            A.session.md5.update(K), A.session.sha1.update(K), K = null
        }
        var Y;
        if (q.fragment.length() <= w1.MaxFragment) Y = [q];
        else {
            Y = [];
            var z = q.fragment.bytes();
            while (z.length > w1.MaxFragment) Y.push(w1.createRecord(A, {
                type: q.type,
                data: yA.util.createBuffer(z.slice(0, w1.MaxFragment))
            })), z = z.slice(w1.MaxFragment);
            if (z.length > 0) Y.push(w1.createRecord(A, {
                type: q.type,
                data: yA.util.createBuffer(z)
            }))
        }
        for (var _ = 0; _ < Y.length && !A.fail; ++_) {
            var w = Y[_],
                O = A.state.current.write;
            if (O.update(A, w)) A.records.push(w)
        }
    };
    w1.flush = function(A) {
        for (var q = 0; q < A.records.length; ++q) {
            var K = A.records[q];
            A.tlsData.putByte(K.type), A.tlsData.putByte(K.version.major), A.tlsData.putByte(K.version.minor), A.tlsData.putInt16(K.fragment.length()), A.tlsData.putBuffer(A.records[q].fragment)
        }
        return A.records = [], A.tlsDataReady(A)
    };
    var pY8 = function(A) {
            switch (A) {
                case !0:
                    return !0;
                case yA.pki.certificateError.bad_certificate:
                    return w1.Alert.Description.bad_certificate;
                case yA.pki.certificateError.unsupported_certificate:
                    return w1.Alert.Description.unsupported_certificate;
                case yA.pki.certificateError.certificate_revoked:
                    return w1.Alert.Description.certificate_revoked;
                case yA.pki.certificateError.certificate_expired:
                    return w1.Alert.Description.certificate_expired;
                case yA.pki.certificateError.certificate_unknown:
                    return w1.Alert.Description.certificate_unknown;
                case yA.pki.certificateError.unknown_ca:
                    return w1.Alert.Description.unknown_ca;
                default:
                    return w1.Alert.Description.bad_certificate
            }
        },
        zZ3 = function(A) {
            switch (A) {
                case !0:
                    return !0;
                case w1.Alert.Description.bad_certificate:
                    return yA.pki.certificateError.bad_certificate;
                case w1.Alert.Description.unsupported_certificate:
                    return yA.pki.certificateError.unsupported_certificate;
                case w1.Alert.Description.certificate_revoked:
                    return yA.pki.certificateError.certificate_revoked;
                case w1.Alert.Description.certificate_expired:
                    return yA.pki.certificateError.certificate_expired;
                case w1.Alert.Description.certificate_unknown:
                    return yA.pki.certificateError.certificate_unknown;
                case w1.Alert.Description.unknown_ca:
                    return yA.pki.certificateError.unknown_ca;
                default:
                    return yA.pki.certificateError.bad_certificate
            }
        };
    w1.verifyCertificateChain = function(A, q) {
        try {
            var K = {};
            for (var Y in A.verifyOptions) K[Y] = A.verifyOptions[Y];
            K.verify = function(_, w, O) {
                var $ = pY8(_),
                    H = A.verify(A, _, w, O);
                if (H !== !0) {
                    if (typeof H === "object" && !yA.util.isArray(H)) {
                        var j = Error("The application rejected the certificate.");
                        if (j.send = !0, j.alert = {
                                level: w1.Alert.Level.fatal,
                                description: w1.Alert.Description.bad_certificate
                            }, H.message) j.message = H.message;
                        if (H.alert) j.alert.description = H.alert;
                        throw j
                    }
                    if (H !== _) H = zZ3(H)
                }
                return H
            }, yA.pki.verifyCertificateChain(A.caStore, q, K)
        } catch (_) {
            var z = _;
            if (typeof z !== "object" || yA.util.isArray(z)) z = {
                send: !0,
                alert: {
                    level: w1.Alert.Level.fatal,
                    description: pY8(_)
                }
            };
            if (!("send" in z)) z.send = !0;
            if (!("alert" in z)) z.alert = {
                level: w1.Alert.Level.fatal,
                description: pY8(z.error)
            };
            A.error(A, z)
        }
        return !A.fail
    };
    w1.createSessionCache = function(A, q) {
        var K = null;
        if (A && A.getSession && A.setSession && A.order) K = A;
        else {
            K = {}, K.cache = A || {}, K.capacity = Math.max(q || 100, 1), K.order = [];
            for (var Y in A)
                if (K.order.length <= q) K.order.push(Y);
                else delete A[Y];
            K.getSession = function(z) {
                var _ = null,
                    w = null;
                if (z) w = yA.util.bytesToHex(z);
                else if (K.order.length > 0) w = K.order[0];
                if (w !== null && w in K.cache) {
                    _ = K.cache[w], delete K.cache[w];
                    for (var O in K.order)
                        if (K.order[O] === w) {
                            K.order.splice(O, 1);
                            break
                        }
                }
                return _
            }, K.setSession = function(z, _) {
                if (K.order.length === K.capacity) {
                    var w = K.order.shift();
                    delete K.cache[w]
                }
                var w = yA.util.bytesToHex(z);
                K.order.push(w), K.cache[w] = _
            }
        }
        return K
    };
    w1.createConnection = function(A) {
        var q = null;
        if (A.caStore)
            if (yA.util.isArray(A.caStore)) q = yA.pki.createCaStore(A.caStore);
            else q = A.caStore;
        else q = yA.pki.createCaStore();
        var K = A.cipherSuites || null;
        if (K === null) {
            K = [];
            for (var Y in w1.CipherSuites) K.push(w1.CipherSuites[Y])
        }
        var z = A.server ? w1.ConnectionEnd.server : w1.ConnectionEnd.client,
            _ = A.sessionCache ? w1.createSessionCache(A.sessionCache) : null,
            w = {
                version: {
                    major: w1.Version.major,
                    minor: w1.Version.minor
                },
                entity: z,
                sessionId: A.sessionId,
                caStore: q,
                sessionCache: _,
                cipherSuites: K,
                connected: A.connected,
                virtualHost: A.virtualHost || null,
                verifyClient: A.verifyClient || !1,
                verify: A.verify || function(j, J, M, D) {
                    return J
                },
                verifyOptions: A.verifyOptions || {},
                getCertificate: A.getCertificate || null,
                getPrivateKey: A.getPrivateKey || null,
                getSignature: A.getSignature || null,
                input: yA.util.createBuffer(),
                tlsData: yA.util.createBuffer(),
                data: yA.util.createBuffer(),
                tlsDataReady: A.tlsDataReady,
                dataReady: A.dataReady,
                heartbeatReceived: A.heartbeatReceived,
                closed: A.closed,
                error: function(j, J) {
                    if (J.origin = J.origin || (j.entity === w1.ConnectionEnd.client ? "client" : "server"), J.send) w1.queue(j, w1.createAlert(j, J.alert)), w1.flush(j);
                    var M = J.fatal !== !1;
                    if (M) j.fail = !0;
                    if (A.error(j, J), M) j.close(!1)
                },
                deflate: A.deflate || null,
                inflate: A.inflate || null
            };
        w.reset = function(j) {
            w.version = {
                major: w1.Version.major,
                minor: w1.Version.minor
            }, w.record = null, w.session = null, w.peerCertificate = null, w.state = {
                pending: null,
                current: null
            }, w.expect = w.entity === w1.ConnectionEnd.client ? UW3 : oW3, w.fragmented = null, w.records = [], w.open = !1, w.handshakes = 0, w.handshaking = !1, w.isConnected = !1, w.fail = !(j || typeof j > "u"), w.input.clear(), w.tlsData.clear(), w.data.clear(), w.state.current = w1.createConnectionState(w)
        }, w.reset();
        var O = function(j, J) {
                var M = J.type - w1.ContentType.change_cipher_spec,
                    D = dY8[j.entity][j.expect];
                if (M in D) D[M](j, J);
                else w1.handleUnexpected(j, J)
            },
            $ = function(j) {
                var J = 0,
                    M = j.input,
                    D = M.length();
                if (D < 5) J = 5 - D;
                else {
                    j.record = {
                        type: M.getByte(),
                        version: {
                            major: M.getByte(),
                            minor: M.getByte()
                        },
                        length: M.getInt16(),
                        fragment: yA.util.createBuffer(),
                        ready: !1
                    };
                    var X = j.record.version.major === j.version.major;
                    if (X && j.session && j.session.version) X = j.record.version.minor === j.version.minor;
                    if (!X) j.error(j, {
                        message: "Incompatible TLS version.",
                        send: !0,
                        alert: {
                            level: w1.Alert.Level.fatal,
                            description: w1.Alert.Description.protocol_version
                        }
                    })
                }
                return J
            },
            H = function(j) {
                var J = 0,
                    M = j.input,
                    D = M.length();
                if (D < j.record.length) J = j.record.length - D;
                else {
                    j.record.fragment.putBytes(M.getBytes(j.record.length)), M.compact();
                    var X = j.state.current.read;
                    if (X.update(j, j.record)) {
                        if (j.fragmented !== null)
                            if (j.fragmented.type === j.record.type) j.fragmented.fragment.putBuffer(j.record.fragment), j.record = j.fragmented;
                            else j.error(j, {
                                message: "Invalid fragmented record.",
                                send: !0,
                                alert: {
                                    level: w1.Alert.Level.fatal,
                                    description: w1.Alert.Description.unexpected_message
                                }
                            });
                        j.record.ready = !0
                    }
                }
                return J
            };
        return w.handshake = function(j) {
            if (w.entity !== w1.ConnectionEnd.client) w.error(w, {
                message: "Cannot initiate handshake as a server.",
                fatal: !1
            });
            else if (w.handshaking) w.error(w, {
                message: "Handshake already in progress.",
                fatal: !1
            });
            else {
                if (w.fail && !w.open && w.handshakes === 0) w.fail = !1;
                w.handshaking = !0, j = j || "";
                var J = null;
                if (j.length > 0) {
                    if (w.sessionCache) J = w.sessionCache.getSession(j);
                    if (J === null) j = ""
                }
                if (j.length === 0 && w.sessionCache) {
                    if (J = w.sessionCache.getSession(), J !== null) j = J.id
                }
                if (w.session = {
                        id: j,
                        version: null,
                        cipherSuite: null,
                        compressionMethod: null,
                        serverCertificate: null,
                        certificateRequest: null,
                        clientCertificate: null,
                        sp: {},
                        md5: yA.md.md5.create(),
                        sha1: yA.md.sha1.create()
                    }, J) w.version = J.version, w.session.sp = J.sp;
                w.session.sp.client_random = w1.createRandom().getBytes(), w.open = !0, w1.queue(w, w1.createRecord(w, {
                    type: w1.ContentType.handshake,
                    data: w1.createClientHello(w)
                })), w1.flush(w)
            }
        }, w.process = function(j) {
            var J = 0;
            if (j) w.input.putBytes(j);
            if (!w.fail) {
                if (w.record !== null && w.record.ready && w.record.fragment.isEmpty()) w.record = null;
                if (w.record === null) J = $(w);
                if (!w.fail && w.record !== null && !w.record.ready) J = H(w);
                if (!w.fail && w.record !== null && w.record.ready) O(w, w.record)
            }
            return J
        }, w.prepare = function(j) {
            return w1.queue(w, w1.createRecord(w, {
                type: w1.ContentType.application_data,
                data: yA.util.createBuffer(j)
            })), w1.flush(w)
        }, w.prepareHeartbeatRequest = function(j, J) {
            if (j instanceof yA.util.ByteBuffer) j = j.bytes();
            if (typeof J > "u") J = j.length;
            return w.expectedHeartbeatPayload = j, w1.queue(w, w1.createRecord(w, {
                type: w1.ContentType.heartbeat,
                data: w1.createHeartbeat(w1.HeartbeatMessageType.heartbeat_request, j, J)
            })), w1.flush(w)
        }, w.close = function(j) {
            if (!w.fail && w.sessionCache && w.session) {
                var J = {
                    id: w.session.id,
                    version: w.session.version,
                    sp: w.session.sp
                };
                J.sp.keys = null, w.sessionCache.setSession(J.id, J)
            }
            if (w.open) {
                if (w.open = !1, w.input.clear(), w.isConnected || w.handshaking) w.isConnected = w.handshaking = !1, w1.queue(w, w1.createAlert(w, {
                    level: w1.Alert.Level.warning,
                    description: w1.Alert.Description.close_notify
                })), w1.flush(w);
                w.closed(w)
            }
            w.reset(j)
        }, w
    };
    Tj7.exports = yA.tls = yA.tls || {};
    for (UI6 in w1)
        if (typeof w1[UI6] !== "function") yA.tls[UI6] = w1[UI6];
    var UI6;
    yA.tls.prf_tls1 = pY1;
    yA.tls.hmac_sha1 = FW3;
    yA.tls.createSessionCache = w1.createSessionCache;
    yA.tls.createConnection = w1.createConnection
})
// @from(Ln 121763, Col 4)
Vj7 = x((Qv_, Nj7) => {
    var Oa = h3();
    Aa();
    cY8();
    var XL = Nj7.exports = Oa.tls;
    XL.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA = {
        id: [0, 47],
        name: "TLS_RSA_WITH_AES_128_CBC_SHA",
        initSecurityParameters: function(A) {
            A.bulk_cipher_algorithm = XL.BulkCipherAlgorithm.aes, A.cipher_type = XL.CipherType.block, A.enc_key_length = 16, A.block_length = 16, A.fixed_iv_length = 16, A.record_iv_length = 16, A.mac_algorithm = XL.MACAlgorithm.hmac_sha1, A.mac_length = 20, A.mac_key_length = 20
        },
        initConnectionState: vj7
    };
    XL.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA = {
        id: [0, 53],
        name: "TLS_RSA_WITH_AES_256_CBC_SHA",
        initSecurityParameters: function(A) {
            A.bulk_cipher_algorithm = XL.BulkCipherAlgorithm.aes, A.cipher_type = XL.CipherType.block, A.enc_key_length = 32, A.block_length = 16, A.fixed_iv_length = 16, A.record_iv_length = 16, A.mac_algorithm = XL.MACAlgorithm.hmac_sha1, A.mac_length = 20, A.mac_key_length = 20
        },
        initConnectionState: vj7
    };

    function vj7(A, q, K) {
        var Y = q.entity === Oa.tls.ConnectionEnd.client;
        A.read.cipherState = {
            init: !1,
            cipher: Oa.cipher.createDecipher("AES-CBC", Y ? K.keys.server_write_key : K.keys.client_write_key),
            iv: Y ? K.keys.server_write_IV : K.keys.client_write_IV
        }, A.write.cipherState = {
            init: !1,
            cipher: Oa.cipher.createCipher("AES-CBC", Y ? K.keys.client_write_key : K.keys.server_write_key),
            iv: Y ? K.keys.client_write_IV : K.keys.server_write_IV
        }, A.read.cipherFunction = $Z3, A.write.cipherFunction = _Z3, A.read.macLength = A.write.macLength = K.mac_length, A.read.macFunction = A.write.macFunction = XL.hmac_sha1
    }

    function _Z3(A, q) {
        var K = !1,
            Y = q.macFunction(q.macKey, q.sequenceNumber, A);
        A.fragment.putBytes(Y), q.updateSequenceNumber();
        var z;
        if (A.version.minor === XL.Versions.TLS_1_0.minor) z = q.cipherState.init ? null : q.cipherState.iv;
        else z = Oa.random.getBytesSync(16);
        q.cipherState.init = !0;
        var _ = q.cipherState.cipher;
        if (_.start({
                iv: z
            }), A.version.minor >= XL.Versions.TLS_1_1.minor) _.output.putBytes(z);
        if (_.update(A.fragment), _.finish(wZ3)) A.fragment = _.output, A.length = A.fragment.length(), K = !0;
        return K
    }

    function wZ3(A, q, K) {
        if (!K) {
            var Y = A - q.length() % A;
            q.fillWithByte(Y - 1, Y)
        }
        return !0
    }

    function OZ3(A, q, K) {
        var Y = !0;
        if (K) {
            var z = q.length(),
                _ = q.last();
            for (var w = z - 1 - _; w < z - 1; ++w) Y = Y && q.at(w) == _;
            if (Y) q.truncate(_ + 1)
        }
        return Y
    }

    function $Z3(A, q) {
        var K = !1,
            Y;
        if (A.version.minor === XL.Versions.TLS_1_0.minor) Y = q.cipherState.init ? null : q.cipherState.iv;
        else Y = A.fragment.getBytes(16);
        q.cipherState.init = !0;
        var z = q.cipherState.cipher;
        z.start({
            iv: Y
        }), z.update(A.fragment), K = z.finish(OZ3);
        var _ = q.macLength,
            w = Oa.random.getBytesSync(_),
            O = z.output.length();
        if (O >= _) A.fragment = z.output.getBytes(O - _), w = z.output.getBytes(_);
        else A.fragment = z.output.getBytes();
        A.fragment = Oa.util.createBuffer(A.fragment), A.length = A.fragment.length();
        var $ = q.macFunction(q.macKey, q.sequenceNumber, A);
        return q.updateSequenceNumber(), K = HZ3(q.macKey, w, $) && K, K
    }

    function HZ3(A, q, K) {
        var Y = Oa.hmac.create();
        return Y.start("SHA1", A), Y.update(q), q = Y.digest().getBytes(), Y.start(null, null), Y.update(K), K = Y.digest().getBytes(), q === K
    }
})
// @from(Ln 121858, Col 4)
nY8 = x((Uv_, Lj7) => {
    var jO = h3();
    cu();
    tY();
    var dI6 = Lj7.exports = jO.sha512 = jO.sha512 || {};
    jO.md.sha512 = jO.md.algorithms.sha512 = dI6;
    var Ej7 = jO.sha384 = jO.sha512.sha384 = jO.sha512.sha384 || {};
    Ej7.create = function() {
        return dI6.create("SHA-384")
    };
    jO.md.sha384 = jO.md.algorithms.sha384 = Ej7;
    jO.sha512.sha256 = jO.sha512.sha256 || {
        create: function() {
            return dI6.create("SHA-512/256")
        }
    };
    jO.md["sha512/256"] = jO.md.algorithms["sha512/256"] = jO.sha512.sha256;
    jO.sha512.sha224 = jO.sha512.sha224 || {
        create: function() {
            return dI6.create("SHA-512/224")
        }
    };
    jO.md["sha512/224"] = jO.md.algorithms["sha512/224"] = jO.sha512.sha224;
    dI6.create = function(A) {
        if (!yj7) jZ3();
        if (typeof A > "u") A = "SHA-512";
        if (!(A in Xq6)) throw Error("Invalid SHA-512 algorithm: " + A);
        var q = Xq6[A],
            K = null,
            Y = jO.util.createBuffer(),
            z = Array(80);
        for (var _ = 0; _ < 80; ++_) z[_] = [, , ];
        var w = 64;
        switch (A) {
            case "SHA-384":
                w = 48;
                break;
            case "SHA-512/256":
                w = 32;
                break;
            case "SHA-512/224":
                w = 28;
                break
        }
        var O = {
            algorithm: A.replace("-", "").toLowerCase(),
            blockLength: 128,
            digestLength: w,
            messageLength: 0,
            fullMessageLength: null,
            messageLengthSize: 16
        };
        return O.start = function() {
            O.messageLength = 0, O.fullMessageLength = O.messageLength128 = [];
            var $ = O.messageLengthSize / 4;
            for (var H = 0; H < $; ++H) O.fullMessageLength.push(0);
            Y = jO.util.createBuffer(), K = Array(q.length);
            for (var H = 0; H < q.length; ++H) K[H] = q[H].slice(0);
            return O
        }, O.start(), O.update = function($, H) {
            if (H === "utf8") $ = jO.util.encodeUtf8($);
            var j = $.length;
            O.messageLength += j, j = [j / 4294967296 >>> 0, j >>> 0];
            for (var J = O.fullMessageLength.length - 1; J >= 0; --J) O.fullMessageLength[J] += j[1], j[1] = j[0] + (O.fullMessageLength[J] / 4294967296 >>> 0), O.fullMessageLength[J] = O.fullMessageLength[J] >>> 0, j[0] = j[1] / 4294967296 >>> 0;
            if (Y.putBytes($), kj7(K, z, Y), Y.read > 2048 || Y.length() === 0) Y.compact();
            return O
        }, O.digest = function() {
            var $ = jO.util.createBuffer();
            $.putBytes(Y.bytes());
            var H = O.fullMessageLength[O.fullMessageLength.length - 1] + O.messageLengthSize,
                j = H & O.blockLength - 1;
            $.putBytes(lY8.substr(0, O.blockLength - j));
            var J, M, D = O.fullMessageLength[0] * 8;
            for (var X = 0; X < O.fullMessageLength.length - 1; ++X) J = O.fullMessageLength[X + 1] * 8, M = J / 4294967296 >>> 0, D += M, $.putInt32(D >>> 0), D = J >>> 0;
            $.putInt32(D);
            var P = Array(K.length);
            for (var X = 0; X < K.length; ++X) P[X] = K[X].slice(0);
            kj7(P, z, $);
            var W = jO.util.createBuffer(),
                Z;
            if (A === "SHA-512") Z = P.length;
            else if (A === "SHA-384") Z = P.length - 2;
            else Z = P.length - 4;
            for (var X = 0; X < Z; ++X)
                if (W.putInt32(P[X][0]), X !== Z - 1 || A !== "SHA-512/224") W.putInt32(P[X][1]);
            return W
        }, O
    };
    var lY8 = null,
        yj7 = !1,
        iY8 = null,
        Xq6 = null;

    function jZ3() {
        lY8 = String.fromCharCode(128), lY8 += jO.util.fillString(String.fromCharCode(0), 128), iY8 = [
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
        ], Xq6 = {}, Xq6["SHA-512"] = [
            [1779033703, 4089235720],
            [3144134277, 2227873595],
            [1013904242, 4271175723],
            [2773480762, 1595750129],
            [1359893119, 2917565137],
            [2600822924, 725511199],
            [528734635, 4215389547],
            [1541459225, 327033209]
        ], Xq6["SHA-384"] = [
            [3418070365, 3238371032],
            [1654270250, 914150663],
            [2438529370, 812702999],
            [355462360, 4144912697],
            [1731405415, 4290775857],
            [2394180231, 1750603025],
            [3675008525, 1694076839],
            [1203062813, 3204075428]
        ], Xq6["SHA-512/256"] = [
            [573645204, 4230739756],
            [2673172387, 3360449730],
            [596883563, 1867755857],
            [2520282905, 1497426621],
            [2519219938, 2827943907],
            [3193839141, 1401305490],
            [721525244, 746961066],
            [246885852, 2177182882]
        ], Xq6["SHA-512/224"] = [
            [2352822216, 424955298],
            [1944164710, 2312950998],
            [502970286, 855612546],
            [1738396948, 1479516111],
            [258812777, 2077511080],
            [2011393907, 79989058],
            [1067287976, 1780299464],
            [286451373, 2446758561]
        ], yj7 = !0
    }

    function kj7(A, q, K) {
        var Y, z, _, w, O, $, H, j, J, M, D, X, P, W, Z, G, f, v, N, V, L, h, R, u, I, g, B, b, p, Q, U, r, e, Y6, H6, J6 = K.length();
        while (J6 >= 128) {
            for (p = 0; p < 16; ++p) q[p][0] = K.getInt32() >>> 0, q[p][1] = K.getInt32() >>> 0;
            for (; p < 80; ++p) r = q[p - 2], Q = r[0], U = r[1], Y = ((Q >>> 19 | U << 13) ^ (U >>> 29 | Q << 3) ^ Q >>> 6) >>> 0, z = ((Q << 13 | U >>> 19) ^ (U << 3 | Q >>> 29) ^ (Q << 26 | U >>> 6)) >>> 0, Y6 = q[p - 15], Q = Y6[0], U = Y6[1], _ = ((Q >>> 1 | U << 31) ^ (Q >>> 8 | U << 24) ^ Q >>> 7) >>> 0, w = ((Q << 31 | U >>> 1) ^ (Q << 24 | U >>> 8) ^ (Q << 25 | U >>> 7)) >>> 0, e = q[p - 7], H6 = q[p - 16], U = z + e[1] + w + H6[1], q[p][0] = Y + e[0] + _ + H6[0] + (U / 4294967296 >>> 0) >>> 0, q[p][1] = U >>> 0;
            P = A[0][0], W = A[0][1], Z = A[1][0], G = A[1][1], f = A[2][0], v = A[2][1], N = A[3][0], V = A[3][1], L = A[4][0], h = A[4][1], R = A[5][0], u = A[5][1], I = A[6][0], g = A[6][1], B = A[7][0], b = A[7][1];
            for (p = 0; p < 80; ++p) H = ((L >>> 14 | h << 18) ^ (L >>> 18 | h << 14) ^ (h >>> 9 | L << 23)) >>> 0, j = ((L << 18 | h >>> 14) ^ (L << 14 | h >>> 18) ^ (h << 23 | L >>> 9)) >>> 0, J = (I ^ L & (R ^ I)) >>> 0, M = (g ^ h & (u ^ g)) >>> 0, O = ((P >>> 28 | W << 4) ^ (W >>> 2 | P << 30) ^ (W >>> 7 | P << 25)) >>> 0, $ = ((P << 4 | W >>> 28) ^ (W << 30 | P >>> 2) ^ (W << 25 | P >>> 7)) >>> 0, D = (P & Z | f & (P ^ Z)) >>> 0, X = (W & G | v & (W ^ G)) >>> 0, U = b + j + M + iY8[p][1] + q[p][1], Y = B + H + J + iY8[p][0] + q[p][0] + (U / 4294967296 >>> 0) >>> 0, z = U >>> 0, U = $ + X, _ = O + D + (U / 4294967296 >>> 0) >>> 0, w = U >>> 0, B = I, b = g, I = R, g = u, R = L, u = h, U = V + z, L = N + Y + (U / 4294967296 >>> 0) >>> 0, h = U >>> 0, N = f, V = v, f = Z, v = G, Z = P, G = W, U = z + w, P = Y + _ + (U / 4294967296 >>> 0) >>> 0, W = U >>> 0;
            U = A[0][1] + W, A[0][0] = A[0][0] + P + (U / 4294967296 >>> 0) >>> 0, A[0][1] = U >>> 0, U = A[1][1] + G, A[1][0] = A[1][0] + Z + (U / 4294967296 >>> 0) >>> 0, A[1][1] = U >>> 0, U = A[2][1] + v, A[2][0] = A[2][0] + f + (U / 4294967296 >>> 0) >>> 0, A[2][1] = U >>> 0, U = A[3][1] + V, A[3][0] = A[3][0] + N + (U / 4294967296 >>> 0) >>> 0, A[3][1] = U >>> 0, U = A[4][1] + h, A[4][0] = A[4][0] + L + (U / 4294967296 >>> 0) >>> 0, A[4][1] = U >>> 0, U = A[5][1] + u, A[5][0] = A[5][0] + R + (U / 4294967296 >>> 0) >>> 0, A[5][1] = U >>> 0, U = A[6][1] + g, A[6][0] = A[6][0] + I + (U / 4294967296 >>> 0) >>> 0, A[6][1] = U >>> 0, U = A[7][1] + b, A[7][0] = A[7][0] + B + (U / 4294967296 >>> 0) >>> 0, A[7][1] = U >>> 0, J6 -= 128
        }
    }
})
// @from(Ln 122083, Col 4)
Rj7 = x((MZ3) => {
    var JZ3 = h3();
    GC();
    var qX = JZ3.asn1;
    MZ3.privateKeyValidator = {
        name: "PrivateKeyInfo",
        tagClass: qX.Class.UNIVERSAL,
        type: qX.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "PrivateKeyInfo.version",
            tagClass: qX.Class.UNIVERSAL,
            type: qX.Type.INTEGER,
            constructed: !1,
            capture: "privateKeyVersion"
        }, {
            name: "PrivateKeyInfo.privateKeyAlgorithm",
            tagClass: qX.Class.UNIVERSAL,
            type: qX.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "AlgorithmIdentifier.algorithm",
                tagClass: qX.Class.UNIVERSAL,
                type: qX.Type.OID,
                constructed: !1,
                capture: "privateKeyOid"
            }]
        }, {
            name: "PrivateKeyInfo",
            tagClass: qX.Class.UNIVERSAL,
            type: qX.Type.OCTETSTRING,
            constructed: !1,
            capture: "privateKey"
        }]
    };
    MZ3.publicKeyValidator = {
        name: "SubjectPublicKeyInfo",
        tagClass: qX.Class.UNIVERSAL,
        type: qX.Type.SEQUENCE,
        constructed: !0,
        captureAsn1: "subjectPublicKeyInfo",
        value: [{
            name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
            tagClass: qX.Class.UNIVERSAL,
            type: qX.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "AlgorithmIdentifier.algorithm",
                tagClass: qX.Class.UNIVERSAL,
                type: qX.Type.OID,
                constructed: !1,
                capture: "publicKeyOid"
            }]
        }, {
            tagClass: qX.Class.UNIVERSAL,
            type: qX.Type.BITSTRING,
            constructed: !1,
            composed: !0,
            captureBitStringValue: "ed25519PublicKey"
        }]
    }
})
// @from(Ln 122145, Col 4)
pj7 = x((cv_, Fj7) => {
    var xP = h3();
    gI6();
    HL();
    nY8();
    tY();
    var bj7 = Rj7(),
        PZ3 = bj7.publicKeyValidator,
        WZ3 = bj7.privateKeyValidator;
    if (typeof aY8 > "u") aY8 = xP.jsbn.BigInteger;
    var aY8, sY8 = xP.util.ByteBuffer,
        Kv = typeof Buffer > "u" ? Uint8Array : Buffer;
    xP.pki = xP.pki || {};
    Fj7.exports = xP.pki.ed25519 = xP.ed25519 = xP.ed25519 || {};
    var v9 = xP.ed25519;
    v9.constants = {};
    v9.constants.PUBLIC_KEY_BYTE_LENGTH = 32;
    v9.constants.PRIVATE_KEY_BYTE_LENGTH = 64;
    v9.constants.SEED_BYTE_LENGTH = 32;
    v9.constants.SIGN_BYTE_LENGTH = 64;
    v9.constants.HASH_BYTE_LENGTH = 64;
    v9.generateKeyPair = function(A) {
        A = A || {};
        var q = A.seed;
        if (q === void 0) q = xP.random.getBytesSync(v9.constants.SEED_BYTE_LENGTH);
        else if (typeof q === "string") {
            if (q.length !== v9.constants.SEED_BYTE_LENGTH) throw TypeError('"seed" must be ' + v9.constants.SEED_BYTE_LENGTH + " bytes in length.")
        } else if (!(q instanceof Uint8Array)) throw TypeError('"seed" must be a node.js Buffer, Uint8Array, or a binary string.');
        q = eQ({
            message: q,
            encoding: "binary"
        });
        var K = new Kv(v9.constants.PUBLIC_KEY_BYTE_LENGTH),
            Y = new Kv(v9.constants.PRIVATE_KEY_BYTE_LENGTH);
        for (var z = 0; z < 32; ++z) Y[z] = q[z];
        return TZ3(K, Y), {
            publicKey: K,
            privateKey: Y
        }
    };
    v9.privateKeyFromAsn1 = function(A) {
        var q = {},
            K = [],
            Y = xP.asn1.validate(A, WZ3, q, K);
        if (!Y) {
            var z = Error("Invalid Key.");
            throw z.errors = K, z
        }
        var _ = xP.asn1.derToOid(q.privateKeyOid),
            w = xP.oids.EdDSA25519;
        if (_ !== w) throw Error('Invalid OID "' + _ + '"; OID must be "' + w + '".');
        var O = q.privateKey,
            $ = eQ({
                message: xP.asn1.fromDer(O).value,
                encoding: "binary"
            });
        return {
            privateKeyBytes: $
        }
    };
    v9.publicKeyFromAsn1 = function(A) {
        var q = {},
            K = [],
            Y = xP.asn1.validate(A, PZ3, q, K);
        if (!Y) {
            var z = Error("Invalid Key.");
            throw z.errors = K, z
        }
        var _ = xP.asn1.derToOid(q.publicKeyOid),
            w = xP.oids.EdDSA25519;
        if (_ !== w) throw Error('Invalid OID "' + _ + '"; OID must be "' + w + '".');
        var O = q.ed25519PublicKey;
        if (O.length !== v9.constants.PUBLIC_KEY_BYTE_LENGTH) throw Error("Key length is invalid.");
        return eQ({
            message: O,
            encoding: "binary"
        })
    };
    v9.publicKeyFromPrivateKey = function(A) {
        A = A || {};
        var q = eQ({
            message: A.privateKey,
            encoding: "binary"
        });
        if (q.length !== v9.constants.PRIVATE_KEY_BYTE_LENGTH) throw TypeError('"options.privateKey" must have a byte length of ' + v9.constants.PRIVATE_KEY_BYTE_LENGTH);
        var K = new Kv(v9.constants.PUBLIC_KEY_BYTE_LENGTH);
        for (var Y = 0; Y < K.length; ++Y) K[Y] = q[32 + Y];
        return K
    };
    v9.sign = function(A) {
        A = A || {};
        var q = eQ(A),
            K = eQ({
                message: A.privateKey,
                encoding: "binary"
            });
        if (K.length === v9.constants.SEED_BYTE_LENGTH) {
            var Y = v9.generateKeyPair({
                seed: K
            });
            K = Y.privateKey
        } else if (K.length !== v9.constants.PRIVATE_KEY_BYTE_LENGTH) throw TypeError('"options.privateKey" must have a byte length of ' + v9.constants.SEED_BYTE_LENGTH + " or " + v9.constants.PRIVATE_KEY_BYTE_LENGTH);
        var z = new Kv(v9.constants.SIGN_BYTE_LENGTH + q.length);
        vZ3(z, q, q.length, K);
        var _ = new Kv(v9.constants.SIGN_BYTE_LENGTH);
        for (var w = 0; w < _.length; ++w) _[w] = z[w];
        return _
    };
    v9.verify = function(A) {
        A = A || {};
        var q = eQ(A);
        if (A.signature === void 0) throw TypeError('"options.signature" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a binary string.');
        var K = eQ({
            message: A.signature,
            encoding: "binary"
        });
        if (K.length !== v9.constants.SIGN_BYTE_LENGTH) throw TypeError('"options.signature" must have a byte length of ' + v9.constants.SIGN_BYTE_LENGTH);
        var Y = eQ({
            message: A.publicKey,
            encoding: "binary"
        });
        if (Y.length !== v9.constants.PUBLIC_KEY_BYTE_LENGTH) throw TypeError('"options.publicKey" must have a byte length of ' + v9.constants.PUBLIC_KEY_BYTE_LENGTH);
        var z = new Kv(v9.constants.SIGN_BYTE_LENGTH + q.length),
            _ = new Kv(v9.constants.SIGN_BYTE_LENGTH + q.length),
            w;
        for (w = 0; w < v9.constants.SIGN_BYTE_LENGTH; ++w) z[w] = K[w];
        for (w = 0; w < q.length; ++w) z[w + v9.constants.SIGN_BYTE_LENGTH] = q[w];
        return NZ3(_, z, z.length, Y) >= 0
    };

    function eQ(A) {
        var q = A.message;
        if (q instanceof Uint8Array || q instanceof Kv) return q;
        var K = A.encoding;
        if (q === void 0)
            if (A.md) q = A.md.digest().getBytes(), K = "binary";
            else throw TypeError('"options.message" or "options.md" not specified.');
        if (typeof q === "string" && !K) throw TypeError('"options.encoding" must be "binary" or "utf8".');
        if (typeof q === "string") {
            if (typeof Buffer < "u") return Buffer.from(q, K);
            q = new sY8(q, K)
        } else if (!(q instanceof sY8)) throw TypeError('"options.message" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a string with "options.encoding" specifying its encoding.');
        var Y = new Kv(q.length());
        for (var z = 0; z < Y.length; ++z) Y[z] = q.at(z);
        return Y
    }
    var tY8 = LK(),
        QY1 = LK([1]),
        ZZ3 = LK([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]),
        GZ3 = LK([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]),
        hj7 = LK([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]),
        Sj7 = LK([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]),
        rY8 = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]),
        fZ3 = LK([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);

    function cI6(A, q) {
        var K = xP.md.sha512.create(),
            Y = new sY8(A);
        K.update(Y.getBytes(q), "binary");
        var z = K.digest().getBytes();
        if (typeof Buffer < "u") return Buffer.from(z, "binary");
        var _ = new Kv(v9.constants.HASH_BYTE_LENGTH);
        for (var w = 0; w < 64; ++w) _[w] = z.charCodeAt(w);
        return _
    }

    function TZ3(A, q) {
        var K = [LK(), LK(), LK(), LK()],
            Y, z = cI6(q, 32);
        z[0] &= 248, z[31] &= 127, z[31] |= 64, Kz8(K, z), qz8(A, K);
        for (Y = 0; Y < 32; ++Y) q[Y + 32] = A[Y];
        return 0
    }

    function vZ3(A, q, K, Y) {
        var z, _, w = new Float64Array(64),
            O = [LK(), LK(), LK(), LK()],
            $ = cI6(Y, 32);
        $[0] &= 248, $[31] &= 127, $[31] |= 64;
        var H = K + 64;
        for (z = 0; z < K; ++z) A[64 + z] = q[z];
        for (z = 0; z < 32; ++z) A[32 + z] = $[32 + z];
        var j = cI6(A.subarray(32), K + 32);
        eY8(j), Kz8(O, j), qz8(A, O);
        for (z = 32; z < 64; ++z) A[z] = Y[z];
        var J = cI6(A, K + 64);
        eY8(J);
        for (z = 32; z < 64; ++z) w[z] = 0;
        for (z = 0; z < 32; ++z) w[z] = j[z];
        for (z = 0; z < 32; ++z)
            for (_ = 0; _ < 32; _++) w[z + _] += J[z] * $[_];
        return xj7(A.subarray(32), w), H
    }

    function NZ3(A, q, K, Y) {
        var z, _, w = new Kv(32),
            O = [LK(), LK(), LK(), LK()],
            $ = [LK(), LK(), LK(), LK()];
        if (_ = -1, K < 64) return -1;
        if (VZ3($, Y)) return -1;
        for (z = 0; z < K; ++z) A[z] = q[z];
        for (z = 0; z < 32; ++z) A[z + 32] = Y[z];
        var H = cI6(A, K);
        if (eY8(H), Bj7(O, $, H), Kz8($, q.subarray(32)), Az8(O, $), qz8(w, O), K -= 64, uj7(q, 0, w, 0)) {
            for (z = 0; z < K; ++z) A[z] = 0;
            return -1
        }
        for (z = 0; z < K; ++z) A[z] = q[z + 64];
        return _ = K, _
    }

    function xj7(A, q) {
        var K, Y, z, _;
        for (Y = 63; Y >= 32; --Y) {
            K = 0;
            for (z = Y - 32, _ = Y - 12; z < _; ++z) q[z] += K - 16 * q[Y] * rY8[z - (Y - 32)], K = q[z] + 128 >> 8, q[z] -= K * 256;
            q[z] += K, q[Y] = 0
        }
        K = 0;
        for (z = 0; z < 32; ++z) q[z] += K - (q[31] >> 4) * rY8[z], K = q[z] >> 8, q[z] &= 255;
        for (z = 0; z < 32; ++z) q[z] -= K * rY8[z];
        for (Y = 0; Y < 32; ++Y) q[Y + 1] += q[Y] >> 8, A[Y] = q[Y] & 255
    }

    function eY8(A) {
        var q = new Float64Array(64);
        for (var K = 0; K < 64; ++K) q[K] = A[K], A[K] = 0;
        xj7(A, q)
    }

    function Az8(A, q) {
        var K = LK(),
            Y = LK(),
            z = LK(),
            _ = LK(),
            w = LK(),
            O = LK(),
            $ = LK(),
            H = LK(),
            j = LK();
        fM6(K, A[1], A[0]), fM6(j, q[1], q[0]), Q2(K, K, j), GM6(Y, A[0], A[1]), GM6(j, q[0], q[1]), Q2(Y, Y, j), Q2(z, A[3], q[3]), Q2(z, z, GZ3), Q2(_, A[2], q[2]), GM6(_, _, _), fM6(w, Y, K), fM6(O, _, z), GM6($, _, z), GM6(H, Y, K), Q2(A[0], w, O), Q2(A[1], H, $), Q2(A[2], $, O), Q2(A[3], w, H)
    }

    function Cj7(A, q, K) {
        for (var Y = 0; Y < 4; ++Y) gj7(A[Y], q[Y], K)
    }

    function qz8(A, q) {
        var K = LK(),
            Y = LK(),
            z = LK();
        LZ3(z, q[2]), Q2(K, q[0], z), Q2(Y, q[1], z), UY1(A, Y), A[31] ^= mj7(K) << 7
    }

    function UY1(A, q) {
        var K, Y, z, _ = LK(),
            w = LK();
        for (K = 0; K < 16; ++K) w[K] = q[K];
        oY8(w), oY8(w), oY8(w);
        for (Y = 0; Y < 2; ++Y) {
            _[0] = w[0] - 65517;
            for (K = 1; K < 15; ++K) _[K] = w[K] - 65535 - (_[K - 1] >> 16 & 1), _[K - 1] &= 65535;
            _[15] = w[15] - 32767 - (_[14] >> 16 & 1), z = _[15] >> 16 & 1, _[14] &= 65535, gj7(w, _, 1 - z)
        }
        for (K = 0; K < 16; K++) A[2 * K] = w[K] & 255, A[2 * K + 1] = w[K] >> 8
    }

    function VZ3(A, q) {
        var K = LK(),
            Y = LK(),
            z = LK(),
            _ = LK(),
            w = LK(),
            O = LK(),
            $ = LK();
        if ($a(A[2], QY1), kZ3(A[1], q), Pq6(z, A[1]), Q2(_, z, ZZ3), fM6(z, z, A[2]), GM6(_, A[2], _), Pq6(w, _), Pq6(O, w), Q2($, O, w), Q2(K, $, z), Q2(K, K, _), EZ3(K, K), Q2(K, K, z), Q2(K, K, _), Q2(K, K, _), Q2(A[0], K, _), Pq6(Y, A[0]), Q2(Y, Y, _), Ij7(Y, z)) Q2(A[0], A[0], fZ3);
        if (Pq6(Y, A[0]), Q2(Y, Y, _), Ij7(Y, z)) return -1;
        if (mj7(A[0]) === q[31] >> 7) fM6(A[0], tY8, A[0]);
        return Q2(A[3], A[0], A[1]), 0
    }

    function kZ3(A, q) {
        var K;
        for (K = 0; K < 16; ++K) A[K] = q[2 * K] + (q[2 * K + 1] << 8);
        A[15] &= 32767
    }

    function EZ3(A, q) {
        var K = LK(),
            Y;
        for (Y = 0; Y < 16; ++Y) K[Y] = q[Y];
        for (Y = 250; Y >= 0; --Y)
            if (Pq6(K, K), Y !== 1) Q2(K, K, q);
        for (Y = 0; Y < 16; ++Y) A[Y] = K[Y]
    }

    function Ij7(A, q) {
        var K = new Kv(32),
            Y = new Kv(32);
        return UY1(K, A), UY1(Y, q), uj7(K, 0, Y, 0)
    }

    function uj7(A, q, K, Y) {
        return yZ3(A, q, K, Y, 32)
    }

    function yZ3(A, q, K, Y, z) {
        var _, w = 0;
        for (_ = 0; _ < z; ++_) w |= A[q + _] ^ K[Y + _];
        return (1 & w - 1 >>> 8) - 1
    }

    function mj7(A) {
        var q = new Kv(32);
        return UY1(q, A), q[0] & 1
    }

    function Bj7(A, q, K) {
        var Y, z;
        $a(A[0], tY8), $a(A[1], QY1), $a(A[2], QY1), $a(A[3], tY8);
        for (z = 255; z >= 0; --z) Y = K[z / 8 | 0] >> (z & 7) & 1, Cj7(A, q, Y), Az8(q, A), Az8(A, A), Cj7(A, q, Y)
    }

    function Kz8(A, q) {
        var K = [LK(), LK(), LK(), LK()];
        $a(K[0], hj7), $a(K[1], Sj7), $a(K[2], QY1), Q2(K[3], hj7, Sj7), Bj7(A, K, q)
    }

    function $a(A, q) {
        var K;
        for (K = 0; K < 16; K++) A[K] = q[K] | 0
    }

    function LZ3(A, q) {
        var K = LK(),
            Y;
        for (Y = 0; Y < 16; ++Y) K[Y] = q[Y];
        for (Y = 253; Y >= 0; --Y)
            if (Pq6(K, K), Y !== 2 && Y !== 4) Q2(K, K, q);
        for (Y = 0; Y < 16; ++Y) A[Y] = K[Y]
    }

    function oY8(A) {
        var q, K, Y = 1;
        for (q = 0; q < 16; ++q) K = A[q] + Y + 65535, Y = Math.floor(K / 65536), A[q] = K - Y * 65536;
        A[0] += Y - 1 + 37 * (Y - 1)
    }

    function gj7(A, q, K) {
        var Y, z = ~(K - 1);
        for (var _ = 0; _ < 16; ++_) Y = z & (A[_] ^ q[_]), A[_] ^= Y, q[_] ^= Y
    }

    function LK(A) {
        var q, K = new Float64Array(16);
        if (A)
            for (q = 0; q < A.length; ++q) K[q] = A[q];
        return K
    }

    function GM6(A, q, K) {
        for (var Y = 0; Y < 16; ++Y) A[Y] = q[Y] + K[Y]
    }

    function fM6(A, q, K) {
        for (var Y = 0; Y < 16; ++Y) A[Y] = q[Y] - K[Y]
    }

    function Pq6(A, q) {
        Q2(A, q, q)
    }

    function Q2(A, q, K) {
        var Y, z, _ = 0,
            w = 0,
            O = 0,
            $ = 0,
            H = 0,
            j = 0,
            J = 0,
            M = 0,
            D = 0,
            X = 0,
            P = 0,
            W = 0,
            Z = 0,
            G = 0,
            f = 0,
            v = 0,
            N = 0,
            V = 0,
            L = 0,
            h = 0,
            R = 0,
            u = 0,
            I = 0,
            g = 0,
            B = 0,
            b = 0,
            p = 0,
            Q = 0,
            U = 0,
            r = 0,
            e = 0,
            Y6 = K[0],
            H6 = K[1],
            J6 = K[2],
            K6 = K[3],
            s = K[4],
            X6 = K[5],
            z6 = K[6],
            N6 = K[7],
            $6 = K[8],
            n = K[9],
            o = K[10],
            a = K[11],
            i = K[12],
            l = K[13],
            q6 = K[14],
            w6 = K[15];
        Y = q[0], _ += Y * Y6, w += Y * H6, O += Y * J6, $ += Y * K6, H += Y * s, j += Y * X6, J += Y * z6, M += Y * N6, D += Y * $6, X += Y * n, P += Y * o, W += Y * a, Z += Y * i, G += Y * l, f += Y * q6, v += Y * w6, Y = q[1], w += Y * Y6, O += Y * H6, $ += Y * J6, H += Y * K6, j += Y * s, J += Y * X6, M += Y * z6, D += Y * N6, X += Y * $6, P += Y * n, W += Y * o, Z += Y * a, G += Y * i, f += Y * l, v += Y * q6, N += Y * w6, Y = q[2], O += Y * Y6, $ += Y * H6, H += Y * J6, j += Y * K6, J += Y * s, M += Y * X6, D += Y * z6, X += Y * N6, P += Y * $6, W += Y * n, Z += Y * o, G += Y * a, f += Y * i, v += Y * l, N += Y * q6, V += Y * w6, Y = q[3], $ += Y * Y6, H += Y * H6, j += Y * J6, J += Y * K6, M += Y * s, D += Y * X6, X += Y * z6, P += Y * N6, W += Y * $6, Z += Y * n, G += Y * o, f += Y * a, v += Y * i, N += Y * l, V += Y * q6, L += Y * w6, Y = q[4], H += Y * Y6, j += Y * H6, J += Y * J6, M += Y * K6, D += Y * s, X += Y * X6, P += Y * z6, W += Y * N6, Z += Y * $6, G += Y * n, f += Y * o, v += Y * a, N += Y * i, V += Y * l, L += Y * q6, h += Y * w6, Y = q[5], j += Y * Y6, J += Y * H6, M += Y * J6, D += Y * K6, X += Y * s, P += Y * X6, W += Y * z6, Z += Y * N6, G += Y * $6, f += Y * n, v += Y * o, N += Y * a, V += Y * i, L += Y * l, h += Y * q6, R += Y * w6, Y = q[6], J += Y * Y6, M += Y * H6, D += Y * J6, X += Y * K6, P += Y * s, W += Y * X6, Z += Y * z6, G += Y * N6, f += Y * $6, v += Y * n, N += Y * o, V += Y * a, L += Y * i, h += Y * l, R += Y * q6, u += Y * w6, Y = q[7], M += Y * Y6, D += Y * H6, X += Y * J6, P += Y * K6, W += Y * s, Z += Y * X6, G += Y * z6, f += Y * N6, v += Y * $6, N += Y * n, V += Y * o, L += Y * a, h += Y * i, R += Y * l, u += Y * q6, I += Y * w6, Y = q[8], D += Y * Y6, X += Y * H6, P += Y * J6, W += Y * K6, Z += Y * s, G += Y * X6, f += Y * z6, v += Y * N6, N += Y * $6, V += Y * n, L += Y * o, h += Y * a, R += Y * i, u += Y * l, I += Y * q6, g += Y * w6, Y = q[9], X += Y * Y6, P += Y * H6, W += Y * J6, Z += Y * K6, G += Y * s, f += Y * X6, v += Y * z6, N += Y * N6, V += Y * $6, L += Y * n, h += Y * o, R += Y * a, u += Y * i, I += Y * l, g += Y * q6, B += Y * w6, Y = q[10], P += Y * Y6, W += Y * H6, Z += Y * J6, G += Y * K6, f += Y * s, v += Y * X6, N += Y * z6, V += Y * N6, L += Y * $6, h += Y * n, R += Y * o, u += Y * a, I += Y * i, g += Y * l, B += Y * q6, b += Y * w6, Y = q[11], W += Y * Y6, Z += Y * H6, G += Y * J6, f += Y * K6, v += Y * s, N += Y * X6, V += Y * z6, L += Y * N6, h += Y * $6, R += Y * n, u += Y * o, I += Y * a, g += Y * i, B += Y * l, b += Y * q6, p += Y * w6, Y = q[12], Z += Y * Y6, G += Y * H6, f += Y * J6, v += Y * K6, N += Y * s, V += Y * X6, L += Y * z6, h += Y * N6, R += Y * $6, u += Y * n, I += Y * o, g += Y * a, B += Y * i, b += Y * l, p += Y * q6, Q += Y * w6, Y = q[13], G += Y * Y6, f += Y * H6, v += Y * J6, N += Y * K6, V += Y * s, L += Y * X6, h += Y * z6, R += Y * N6, u += Y * $6, I += Y * n, g += Y * o, B += Y * a, b += Y * i, p += Y * l, Q += Y * q6, U += Y * w6, Y = q[14], f += Y * Y6, v += Y * H6, N += Y * J6, V += Y * K6, L += Y * s, h += Y * X6, R += Y * z6, u += Y * N6, I += Y * $6, g += Y * n, B += Y * o, b += Y * a, p += Y * i, Q += Y * l, U += Y * q6, r += Y * w6, Y = q[15], v += Y * Y6, N += Y * H6, V += Y * J6, L += Y * K6, h += Y * s, R += Y * X6, u += Y * z6, I += Y * N6, g += Y * $6, B += Y * n, b += Y * o, p += Y * a, Q += Y * i, U += Y * l, r += Y * q6, e += Y * w6, _ += 38 * N, w += 38 * V, O += 38 * L, $ += 38 * h, H += 38 * R, j += 38 * u, J += 38 * I, M += 38 * g, D += 38 * B, X += 38 * b, P += 38 * p, W += 38 * Q, Z += 38 * U, G += 38 * r, f += 38 * e, z = 1, Y = _ + z + 65535, z = Math.floor(Y / 65536), _ = Y - z * 65536, Y = w + z + 65535, z = Math.floor(Y / 65536), w = Y - z * 65536, Y = O + z + 65535, z = Math.floor(Y / 65536), O = Y - z * 65536, Y = $ + z + 65535, z = Math.floor(Y / 65536), $ = Y - z * 65536, Y = H + z + 65535, z = Math.floor(Y / 65536), H = Y - z * 65536, Y = j + z + 65535, z = Math.floor(Y / 65536), j = Y - z * 65536, Y = J + z + 65535, z = Math.floor(Y / 65536), J = Y - z * 65536, Y = M + z + 65535, z = Math.floor(Y / 65536), M = Y - z * 65536, Y = D + z + 65535, z = Math.floor(Y / 65536), D = Y - z * 65536, Y = X + z + 65535, z = Math.floor(Y / 65536), X = Y - z * 65536, Y = P + z + 65535, z = Math.floor(Y / 65536), P = Y - z * 65536, Y = W + z + 65535, z = Math.floor(Y / 65536), W = Y - z * 65536, Y = Z + z + 65535, z = Math.floor(Y / 65536), Z = Y - z * 65536, Y = G + z + 65535, z = Math.floor(Y / 65536), G = Y - z * 65536, Y = f + z + 65535, z = Math.floor(Y / 65536), f = Y - z * 65536, Y = v + z + 65535, z = Math.floor(Y / 65536), v = Y - z * 65536, _ += z - 1 + 37 * (z - 1), z = 1, Y = _ + z + 65535, z = Math.floor(Y / 65536), _ = Y - z * 65536, Y = w + z + 65535, z = Math.floor(Y / 65536), w = Y - z * 65536, Y = O + z + 65535, z = Math.floor(Y / 65536), O = Y - z * 65536, Y = $ + z + 65535, z = Math.floor(Y / 65536), $ = Y - z * 65536, Y = H + z + 65535, z = Math.floor(Y / 65536), H = Y - z * 65536, Y = j + z + 65535, z = Math.floor(Y / 65536), j = Y - z * 65536, Y = J + z + 65535, z = Math.floor(Y / 65536), J = Y - z * 65536, Y = M + z + 65535, z = Math.floor(Y / 65536), M = Y - z * 65536, Y = D + z + 65535, z = Math.floor(Y / 65536), D = Y - z * 65536, Y = X + z + 65535, z = Math.floor(Y / 65536), X = Y - z * 65536, Y = P + z + 65535, z = Math.floor(Y / 65536), P = Y - z * 65536, Y = W + z + 65535, z = Math.floor(Y / 65536), W = Y - z * 65536, Y = Z + z + 65535, z = Math.floor(Y / 65536), Z = Y - z * 65536, Y = G + z + 65535, z = Math.floor(Y / 65536), G = Y - z * 65536, Y = f + z + 65535, z = Math.floor(Y / 65536), f = Y - z * 65536, Y = v + z + 65535, z = Math.floor(Y / 65536), v = Y - z * 65536, _ += z - 1 + 37 * (z - 1), A[0] = _, A[1] = w, A[2] = O, A[3] = $, A[4] = H, A[5] = j, A[6] = J, A[7] = M, A[8] = D, A[9] = X, A[10] = P, A[11] = W, A[12] = Z, A[13] = G, A[14] = f, A[15] = v
    }
})