
// @from(Ln 230468, Col 4)
H0A = R((X_w, fg7) => {
    var h8 = d5();
    Zh();
    Jj1();
    jO6();
    nq1();
    A0A();
    zR();
    Mj1();
    cY();
    var SO6 = function(A, q, K, Y) {
            var z = h8.util.createBuffer(),
                w = A.length >> 1,
                H = w + (A.length & 1),
                $ = A.substr(0, H),
                O = A.substr(w, H),
                _ = h8.util.createBuffer(),
                J = h8.hmac.create();
            K = q + K;
            var X = Math.ceil(Y / 16),
                D = Math.ceil(Y / 20);
            J.start("MD5", $);
            var j = h8.util.createBuffer();
            _.putBytes(K);
            for (var M = 0; M < X; ++M) J.start(null, null), J.update(_.getBytes()), _.putBuffer(J.digest()), J.start(null, null), J.update(_.bytes() + K), j.putBuffer(J.digest());
            J.start("SHA1", O);
            var P = h8.util.createBuffer();
            _.clear(), _.putBytes(K);
            for (var M = 0; M < D; ++M) J.start(null, null), J.update(_.getBytes()), _.putBuffer(J.digest()), J.start(null, null), J.update(_.bytes() + K), P.putBuffer(J.digest());
            return z.putBytes(h8.util.xorBytes(j.getBytes(), P.getBytes(), Y)), z
        },
        XV9 = function(A, q, K) {
            var Y = h8.hmac.create();
            Y.start("SHA1", A);
            var z = h8.util.createBuffer();
            return z.putInt32(q[0]), z.putInt32(q[1]), z.putByte(K.type), z.putByte(K.version.major), z.putByte(K.version.minor), z.putInt16(K.length), z.putBytes(K.fragment.bytes()), Y.update(z.getBytes()), Y.digest().getBytes()
        },
        DV9 = function(A, q, K) {
            var Y = !1;
            try {
                var z = A.deflate(q.fragment.getBytes());
                q.fragment = h8.util.createBuffer(z), q.length = z.length, Y = !0
            } catch (w) {}
            return Y
        },
        jV9 = function(A, q, K) {
            var Y = !1;
            try {
                var z = A.inflate(q.fragment.getBytes());
                q.fragment = h8.util.createBuffer(z), q.length = z.length, Y = !0
            } catch (w) {}
            return Y
        },
        yv = function(A, q) {
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
            return h8.util.createBuffer(A.getBytes(K))
        },
        OR = function(A, q, K) {
            A.putInt(K.length(), q << 3), A.putBuffer(K)
        },
        s1 = {};
    s1.Versions = {
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
    s1.SupportedVersions = [s1.Versions.TLS_1_1, s1.Versions.TLS_1_0];
    s1.Version = s1.SupportedVersions[0];
    s1.MaxFragment = 15360;
    s1.ConnectionEnd = {
        server: 0,
        client: 1
    };
    s1.PRFAlgorithm = {
        tls_prf_sha256: 0
    };
    s1.BulkCipherAlgorithm = {
        none: null,
        rc4: 0,
        des3: 1,
        aes: 2
    };
    s1.CipherType = {
        stream: 0,
        block: 1,
        aead: 2
    };
    s1.MACAlgorithm = {
        none: null,
        hmac_md5: 0,
        hmac_sha1: 1,
        hmac_sha256: 2,
        hmac_sha384: 3,
        hmac_sha512: 4
    };
    s1.CompressionMethod = {
        none: 0,
        deflate: 1
    };
    s1.ContentType = {
        change_cipher_spec: 20,
        alert: 21,
        handshake: 22,
        application_data: 23,
        heartbeat: 24
    };
    s1.HandshakeType = {
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
    s1.Alert = {};
    s1.Alert.Level = {
        warning: 1,
        fatal: 2
    };
    s1.Alert.Description = {
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
    s1.HeartbeatMessageType = {
        heartbeat_request: 1,
        heartbeat_response: 2
    };
    s1.CipherSuites = {};
    s1.getCipherSuite = function(A) {
        var q = null;
        for (var K in s1.CipherSuites) {
            var Y = s1.CipherSuites[K];
            if (Y.id[0] === A.charCodeAt(0) && Y.id[1] === A.charCodeAt(1)) {
                q = Y;
                break
            }
        }
        return q
    };
    s1.handleUnexpected = function(A, q) {
        var K = !A.open && A.entity === s1.ConnectionEnd.client;
        if (!K) A.error(A, {
            message: "Unexpected message. Received TLS record out of order.",
            send: !0,
            alert: {
                level: s1.Alert.Level.fatal,
                description: s1.Alert.Description.unexpected_message
            }
        })
    };
    s1.handleHelloRequest = function(A, q, K) {
        if (!A.handshaking && A.handshakes > 0) s1.queue(A, s1.createAlert(A, {
            level: s1.Alert.Level.warning,
            description: s1.Alert.Description.no_renegotiation
        })), s1.flush(A);
        A.process()
    };
    s1.parseHelloMessage = function(A, q, K) {
        var Y = null,
            z = A.entity === s1.ConnectionEnd.client;
        if (K < 38) A.error(A, {
            message: z ? "Invalid ServerHello message. Message too short." : "Invalid ClientHello message. Message too short.",
            send: !0,
            alert: {
                level: s1.Alert.Level.fatal,
                description: s1.Alert.Description.illegal_parameter
            }
        });
        else {
            var w = q.fragment,
                H = w.length();
            if (Y = {
                    version: {
                        major: w.getByte(),
                        minor: w.getByte()
                    },
                    random: h8.util.createBuffer(w.getBytes(32)),
                    session_id: yv(w, 1),
                    extensions: []
                }, z) Y.cipher_suite = w.getBytes(2), Y.compression_method = w.getByte();
            else Y.cipher_suites = yv(w, 2), Y.compression_methods = yv(w, 1);
            if (H = K - (H - w.length()), H > 0) {
                var $ = yv(w, 2);
                while ($.length() > 0) Y.extensions.push({
                    type: [$.getByte(), $.getByte()],
                    data: yv($, 2)
                });
                if (!z)
                    for (var O = 0; O < Y.extensions.length; ++O) {
                        var _ = Y.extensions[O];
                        if (_.type[0] === 0 && _.type[1] === 0) {
                            var J = yv(_.data, 2);
                            while (J.length() > 0) {
                                var X = J.getByte();
                                if (X !== 0) break;
                                A.session.extensions.server_name.serverNameList.push(yv(J, 2).getBytes())
                            }
                        }
                    }
            }
            if (A.session.version) {
                if (Y.version.major !== A.session.version.major || Y.version.minor !== A.session.version.minor) return A.error(A, {
                    message: "TLS version change is disallowed during renegotiation.",
                    send: !0,
                    alert: {
                        level: s1.Alert.Level.fatal,
                        description: s1.Alert.Description.protocol_version
                    }
                })
            }
            if (z) A.session.cipherSuite = s1.getCipherSuite(Y.cipher_suite);
            else {
                var D = h8.util.createBuffer(Y.cipher_suites.bytes());
                while (D.length() > 0)
                    if (A.session.cipherSuite = s1.getCipherSuite(D.getBytes(2)), A.session.cipherSuite !== null) break
            }
            if (A.session.cipherSuite === null) return A.error(A, {
                message: "No cipher suites in common.",
                send: !0,
                alert: {
                    level: s1.Alert.Level.fatal,
                    description: s1.Alert.Description.handshake_failure
                },
                cipherSuite: h8.util.bytesToHex(Y.cipher_suite)
            });
            if (z) A.session.compressionMethod = Y.compression_method;
            else A.session.compressionMethod = s1.CompressionMethod.none
        }
        return Y
    };
    s1.createSecurityParameters = function(A, q) {
        var K = A.entity === s1.ConnectionEnd.client,
            Y = q.random.bytes(),
            z = K ? A.session.sp.client_random : Y,
            w = K ? Y : s1.createRandom().getBytes();
        A.session.sp = {
            entity: A.entity,
            prf_algorithm: s1.PRFAlgorithm.tls_prf_sha256,
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
            server_random: w
        }
    };
    s1.handleServerHello = function(A, q, K) {
        var Y = s1.parseHelloMessage(A, q, K);
        if (A.fail) return;
        if (Y.version.minor <= A.version.minor) A.version.minor = Y.version.minor;
        else return A.error(A, {
            message: "Incompatible TLS version.",
            send: !0,
            alert: {
                level: s1.Alert.Level.fatal,
                description: s1.Alert.Description.protocol_version
            }
        });
        A.session.version = A.version;
        var z = Y.session_id.bytes();
        if (z.length > 0 && z === A.session.id) A.expect = Mg7, A.session.resuming = !0, A.session.sp.server_random = Y.random.bytes();
        else A.expect = PV9, A.session.resuming = !1, s1.createSecurityParameters(A, Y);
        A.session.id = z, A.process()
    };
    s1.handleClientHello = function(A, q, K) {
        var Y = s1.parseHelloMessage(A, q, K);
        if (A.fail) return;
        var z = Y.session_id.bytes(),
            w = null;
        if (A.sessionCache) {
            if (w = A.sessionCache.getSession(z), w === null) z = "";
            else if (w.version.major !== Y.version.major || w.version.minor > Y.version.minor) w = null, z = ""
        }
        if (z.length === 0) z = h8.random.getBytes(32);
        if (A.session.id = z, A.session.clientHelloVersion = Y.version, A.session.sp = {}, w) A.version = A.session.version = w.version, A.session.sp = w.sp;
        else {
            var H;
            for (var $ = 1; $ < s1.SupportedVersions.length; ++$)
                if (H = s1.SupportedVersions[$], H.minor <= Y.version.minor) break;
            A.version = {
                major: H.major,
                minor: H.minor
            }, A.session.version = A.version
        }
        if (w !== null) A.expect = z0A, A.session.resuming = !0, A.session.sp.client_random = Y.random.bytes();
        else A.expect = A.verifyClient !== !1 ? TV9 : Y0A, A.session.resuming = !1, s1.createSecurityParameters(A, Y);
        if (A.open = !0, s1.queue(A, s1.createRecord(A, {
                type: s1.ContentType.handshake,
                data: s1.createServerHello(A)
            })), A.session.resuming) s1.queue(A, s1.createRecord(A, {
            type: s1.ContentType.change_cipher_spec,
            data: s1.createChangeCipherSpec()
        })), A.state.pending = s1.createConnectionState(A), A.state.current.write = A.state.pending.write, s1.queue(A, s1.createRecord(A, {
            type: s1.ContentType.handshake,
            data: s1.createFinished(A)
        }));
        else if (s1.queue(A, s1.createRecord(A, {
                type: s1.ContentType.handshake,
                data: s1.createCertificate(A)
            })), !A.fail) {
            if (s1.queue(A, s1.createRecord(A, {
                    type: s1.ContentType.handshake,
                    data: s1.createServerKeyExchange(A)
                })), A.verifyClient !== !1) s1.queue(A, s1.createRecord(A, {
                type: s1.ContentType.handshake,
                data: s1.createCertificateRequest(A)
            }));
            s1.queue(A, s1.createRecord(A, {
                type: s1.ContentType.handshake,
                data: s1.createServerHelloDone(A)
            }))
        }
        s1.flush(A), A.process()
    };
    s1.handleCertificate = function(A, q, K) {
        if (K < 3) return A.error(A, {
            message: "Invalid Certificate message. Message too short.",
            send: !0,
            alert: {
                level: s1.Alert.Level.fatal,
                description: s1.Alert.Description.illegal_parameter
            }
        });
        var Y = q.fragment,
            z = {
                certificate_list: yv(Y, 3)
            },
            w, H, $ = [];
        try {
            while (z.certificate_list.length() > 0) w = yv(z.certificate_list, 3), H = h8.asn1.fromDer(w), w = h8.pki.certificateFromAsn1(H, !0), $.push(w)
        } catch (_) {
            return A.error(A, {
                message: "Could not parse certificate list.",
                cause: _,
                send: !0,
                alert: {
                    level: s1.Alert.Level.fatal,
                    description: s1.Alert.Description.bad_certificate
                }
            })
        }
        var O = A.entity === s1.ConnectionEnd.client;
        if ((O || A.verifyClient === !0) && $.length === 0) A.error(A, {
            message: O ? "No server certificate provided." : "No client certificate provided.",
            send: !0,
            alert: {
                level: s1.Alert.Level.fatal,
                description: s1.Alert.Description.illegal_parameter
            }
        });
        else if ($.length === 0) A.expect = O ? Dg7 : Y0A;
        else {
            if (O) A.session.serverCertificate = $[0];
            else A.session.clientCertificate = $[0];
            if (s1.verifyCertificateChain(A, $)) A.expect = O ? Dg7 : Y0A
        }
        A.process()
    };
    s1.handleServerKeyExchange = function(A, q, K) {
        if (K > 0) return A.error(A, {
            message: "Invalid key parameters. Only RSA is supported.",
            send: !0,
            alert: {
                level: s1.Alert.Level.fatal,
                description: s1.Alert.Description.unsupported_certificate
            }
        });
        A.expect = WV9, A.process()
    };
    s1.handleClientKeyExchange = function(A, q, K) {
        if (K < 48) return A.error(A, {
            message: "Invalid key parameters. Only RSA is supported.",
            send: !0,
            alert: {
                level: s1.Alert.Level.fatal,
                description: s1.Alert.Description.unsupported_certificate
            }
        });
        var Y = q.fragment,
            z = {
                enc_pre_master_secret: yv(Y, 2).getBytes()
            },
            w = null;
        if (A.getPrivateKey) try {
            w = A.getPrivateKey(A, A.session.serverCertificate), w = h8.pki.privateKeyFromPem(w)
        } catch (O) {
            A.error(A, {
                message: "Could not get private key.",
                cause: O,
                send: !0,
                alert: {
                    level: s1.Alert.Level.fatal,
                    description: s1.Alert.Description.internal_error
                }
            })
        }
        if (w === null) return A.error(A, {
            message: "No private key set.",
            send: !0,
            alert: {
                level: s1.Alert.Level.fatal,
                description: s1.Alert.Description.internal_error
            }
        });
        try {
            var H = A.session.sp;
            H.pre_master_secret = w.decrypt(z.enc_pre_master_secret);
            var $ = A.session.clientHelloVersion;
            if ($.major !== H.pre_master_secret.charCodeAt(0) || $.minor !== H.pre_master_secret.charCodeAt(1)) throw Error("TLS version rollback attack detected.")
        } catch (O) {
            H.pre_master_secret = h8.random.getBytes(48)
        }
        if (A.expect = z0A, A.session.clientCertificate !== null) A.expect = vV9;
        A.process()
    };
    s1.handleCertificateRequest = function(A, q, K) {
        if (K < 3) return A.error(A, {
            message: "Invalid CertificateRequest. Message too short.",
            send: !0,
            alert: {
                level: s1.Alert.Level.fatal,
                description: s1.Alert.Description.illegal_parameter
            }
        });
        var Y = q.fragment,
            z = {
                certificate_types: yv(Y, 1),
                certificate_authorities: yv(Y, 2)
            };
        A.session.certificateRequest = z, A.expect = GV9, A.process()
    };
    s1.handleCertificateVerify = function(A, q, K) {
        if (K < 2) return A.error(A, {
            message: "Invalid CertificateVerify. Message too short.",
            send: !0,
            alert: {
                level: s1.Alert.Level.fatal,
                description: s1.Alert.Description.illegal_parameter
            }
        });
        var Y = q.fragment;
        Y.read -= 4;
        var z = Y.bytes();
        Y.read += 4;
        var w = {
                signature: yv(Y, 2).getBytes()
            },
            H = h8.util.createBuffer();
        H.putBuffer(A.session.md5.digest()), H.putBuffer(A.session.sha1.digest()), H = H.getBytes();
        try {
            var $ = A.session.clientCertificate;
            if (!$.publicKey.verify(H, w.signature, "NONE")) throw Error("CertificateVerify signature does not match.");
            A.session.md5.update(z), A.session.sha1.update(z)
        } catch (O) {
            return A.error(A, {
                message: "Bad signature in CertificateVerify.",
                send: !0,
                alert: {
                    level: s1.Alert.Level.fatal,
                    description: s1.Alert.Description.handshake_failure
                }
            })
        }
        A.expect = z0A, A.process()
    };
    s1.handleServerHelloDone = function(A, q, K) {
        if (K > 0) return A.error(A, {
            message: "Invalid ServerHelloDone message. Invalid length.",
            send: !0,
            alert: {
                level: s1.Alert.Level.fatal,
                description: s1.Alert.Description.record_overflow
            }
        });
        if (A.serverCertificate === null) {
            var Y = {
                    message: "No server certificate provided. Not enough security.",
                    send: !0,
                    alert: {
                        level: s1.Alert.Level.fatal,
                        description: s1.Alert.Description.insufficient_security
                    }
                },
                z = 0,
                w = A.verify(A, Y.alert.description, z, []);
            if (w !== !0) {
                if (w || w === 0) {
                    if (typeof w === "object" && !h8.util.isArray(w)) {
                        if (w.message) Y.message = w.message;
                        if (w.alert) Y.alert.description = w.alert
                    } else if (typeof w === "number") Y.alert.description = w
                }
                return A.error(A, Y)
            }
        }
        if (A.session.certificateRequest !== null) q = s1.createRecord(A, {
            type: s1.ContentType.handshake,
            data: s1.createCertificate(A)
        }), s1.queue(A, q);
        q = s1.createRecord(A, {
            type: s1.ContentType.handshake,
            data: s1.createClientKeyExchange(A)
        }), s1.queue(A, q), A.expect = VV9;
        var H = function($, O) {
            if ($.session.certificateRequest !== null && $.session.clientCertificate !== null) s1.queue($, s1.createRecord($, {
                type: s1.ContentType.handshake,
                data: s1.createCertificateVerify($, O)
            }));
            s1.queue($, s1.createRecord($, {
                type: s1.ContentType.change_cipher_spec,
                data: s1.createChangeCipherSpec()
            })), $.state.pending = s1.createConnectionState($), $.state.current.write = $.state.pending.write, s1.queue($, s1.createRecord($, {
                type: s1.ContentType.handshake,
                data: s1.createFinished($)
            })), $.expect = Mg7, s1.flush($), $.process()
        };
        if (A.session.certificateRequest === null || A.session.clientCertificate === null) return H(A, null);
        s1.getClientSignature(A, H)
    };
    s1.handleChangeCipherSpec = function(A, q) {
        if (q.fragment.getByte() !== 1) return A.error(A, {
            message: "Invalid ChangeCipherSpec message received.",
            send: !0,
            alert: {
                level: s1.Alert.Level.fatal,
                description: s1.Alert.Description.illegal_parameter
            }
        });
        var K = A.entity === s1.ConnectionEnd.client;
        if (A.session.resuming && K || !A.session.resuming && !K) A.state.pending = s1.createConnectionState(A);
        if (A.state.current.read = A.state.pending.read, !A.session.resuming && K || A.session.resuming && !K) A.state.pending = null;
        A.expect = K ? ZV9 : EV9, A.process()
    };
    s1.handleFinished = function(A, q, K) {
        var Y = q.fragment;
        Y.read -= 4;
        var z = Y.bytes();
        Y.read += 4;
        var w = q.fragment.getBytes();
        Y = h8.util.createBuffer(), Y.putBuffer(A.session.md5.digest()), Y.putBuffer(A.session.sha1.digest());
        var H = A.entity === s1.ConnectionEnd.client,
            $ = H ? "server finished" : "client finished",
            O = A.session.sp,
            _ = 12,
            J = SO6;
        if (Y = J(O.master_secret, $, Y.getBytes(), _), Y.getBytes() !== w) return A.error(A, {
            message: "Invalid verify_data in Finished message.",
            send: !0,
            alert: {
                level: s1.Alert.Level.fatal,
                description: s1.Alert.Description.decrypt_error
            }
        });
        if (A.session.md5.update(z), A.session.sha1.update(z), A.session.resuming && H || !A.session.resuming && !H) s1.queue(A, s1.createRecord(A, {
            type: s1.ContentType.change_cipher_spec,
            data: s1.createChangeCipherSpec()
        })), A.state.current.write = A.state.pending.write, A.state.pending = null, s1.queue(A, s1.createRecord(A, {
            type: s1.ContentType.handshake,
            data: s1.createFinished(A)
        }));
        A.expect = H ? fV9 : kV9, A.handshaking = !1, ++A.handshakes, A.peerCertificate = H ? A.session.serverCertificate : A.session.clientCertificate, s1.flush(A), A.isConnected = !0, A.connected(A), A.process()
    };
    s1.handleAlert = function(A, q) {
        var K = q.fragment,
            Y = {
                level: K.getByte(),
                description: K.getByte()
            },
            z;
        switch (Y.description) {
            case s1.Alert.Description.close_notify:
                z = "Connection closed.";
                break;
            case s1.Alert.Description.unexpected_message:
                z = "Unexpected message.";
                break;
            case s1.Alert.Description.bad_record_mac:
                z = "Bad record MAC.";
                break;
            case s1.Alert.Description.decryption_failed:
                z = "Decryption failed.";
                break;
            case s1.Alert.Description.record_overflow:
                z = "Record overflow.";
                break;
            case s1.Alert.Description.decompression_failure:
                z = "Decompression failed.";
                break;
            case s1.Alert.Description.handshake_failure:
                z = "Handshake failure.";
                break;
            case s1.Alert.Description.bad_certificate:
                z = "Bad certificate.";
                break;
            case s1.Alert.Description.unsupported_certificate:
                z = "Unsupported certificate.";
                break;
            case s1.Alert.Description.certificate_revoked:
                z = "Certificate revoked.";
                break;
            case s1.Alert.Description.certificate_expired:
                z = "Certificate expired.";
                break;
            case s1.Alert.Description.certificate_unknown:
                z = "Certificate unknown.";
                break;
            case s1.Alert.Description.illegal_parameter:
                z = "Illegal parameter.";
                break;
            case s1.Alert.Description.unknown_ca:
                z = "Unknown certificate authority.";
                break;
            case s1.Alert.Description.access_denied:
                z = "Access denied.";
                break;
            case s1.Alert.Description.decode_error:
                z = "Decode error.";
                break;
            case s1.Alert.Description.decrypt_error:
                z = "Decrypt error.";
                break;
            case s1.Alert.Description.export_restriction:
                z = "Export restriction.";
                break;
            case s1.Alert.Description.protocol_version:
                z = "Unsupported protocol version.";
                break;
            case s1.Alert.Description.insufficient_security:
                z = "Insufficient security.";
                break;
            case s1.Alert.Description.internal_error:
                z = "Internal error.";
                break;
            case s1.Alert.Description.user_canceled:
                z = "User canceled.";
                break;
            case s1.Alert.Description.no_renegotiation:
                z = "Renegotiation not supported.";
                break;
            default:
                z = "Unknown error.";
                break
        }
        if (Y.description === s1.Alert.Description.close_notify) return A.close();
        A.error(A, {
            message: z,
            send: !1,
            origin: A.entity === s1.ConnectionEnd.client ? "server" : "client",
            alert: Y
        }), A.process()
    };
    s1.handleHandshake = function(A, q) {
        var K = q.fragment,
            Y = K.getByte(),
            z = K.getInt24();
        if (z > K.length()) return A.fragmented = q, q.fragment = h8.util.createBuffer(), K.read -= 4, A.process();
        A.fragmented = null, K.read -= 4;
        var w = K.bytes(z + 4);
        if (K.read += 4, Y in CO6[A.entity][A.expect]) {
            if (A.entity === s1.ConnectionEnd.server && !A.open && !A.fail) A.handshaking = !0, A.session = {
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
                md5: h8.md.md5.create(),
                sha1: h8.md.sha1.create()
            };
            if (Y !== s1.HandshakeType.hello_request && Y !== s1.HandshakeType.certificate_verify && Y !== s1.HandshakeType.finished) A.session.md5.update(w), A.session.sha1.update(w);
            CO6[A.entity][A.expect][Y](A, q, z)
        } else s1.handleUnexpected(A, q)
    };
    s1.handleApplicationData = function(A, q) {
        A.data.putBuffer(q.fragment), A.dataReady(A), A.process()
    };
    s1.handleHeartbeat = function(A, q) {
        var K = q.fragment,
            Y = K.getByte(),
            z = K.getInt16(),
            w = K.getBytes(z);
        if (Y === s1.HeartbeatMessageType.heartbeat_request) {
            if (A.handshaking || z > w.length) return A.process();
            s1.queue(A, s1.createRecord(A, {
                type: s1.ContentType.heartbeat,
                data: s1.createHeartbeat(s1.HeartbeatMessageType.heartbeat_response, w)
            })), s1.flush(A)
        } else if (Y === s1.HeartbeatMessageType.heartbeat_response) {
            if (w !== A.expectedHeartbeatPayload) return A.process();
            if (A.heartbeatReceived) A.heartbeatReceived(A, h8.util.createBuffer(w))
        }
        A.process()
    };
    var MV9 = 0,
        PV9 = 1,
        Dg7 = 2,
        WV9 = 3,
        GV9 = 4,
        Mg7 = 5,
        ZV9 = 6,
        fV9 = 7,
        VV9 = 8,
        NV9 = 0,
        TV9 = 1,
        Y0A = 2,
        vV9 = 3,
        z0A = 4,
        EV9 = 5,
        kV9 = 6,
        r1 = s1.handleUnexpected,
        Pg7 = s1.handleChangeCipherSpec,
        FM = s1.handleAlert,
        RZ = s1.handleHandshake,
        Wg7 = s1.handleApplicationData,
        QM = s1.handleHeartbeat,
        w0A = [];
    w0A[s1.ConnectionEnd.client] = [
        [r1, FM, RZ, r1, QM],
        [r1, FM, RZ, r1, QM],
        [r1, FM, RZ, r1, QM],
        [r1, FM, RZ, r1, QM],
        [r1, FM, RZ, r1, QM],
        [Pg7, FM, r1, r1, QM],
        [r1, FM, RZ, r1, QM],
        [r1, FM, RZ, Wg7, QM],
        [r1, FM, RZ, r1, QM]
    ];
    w0A[s1.ConnectionEnd.server] = [
        [r1, FM, RZ, r1, QM],
        [r1, FM, RZ, r1, QM],
        [r1, FM, RZ, r1, QM],
        [r1, FM, RZ, r1, QM],
        [Pg7, FM, r1, r1, QM],
        [r1, FM, RZ, r1, QM],
        [r1, FM, RZ, Wg7, QM],
        [r1, FM, RZ, r1, QM]
    ];
    var {
        handleHelloRequest: ba,
        handleServerHello: LV9,
        handleCertificate: Gg7,
        handleServerKeyExchange: jg7,
        handleCertificateRequest: q0A,
        handleServerHelloDone: yO6,
        handleFinished: Zg7
    } = s1, CO6 = [];
    CO6[s1.ConnectionEnd.client] = [
        [r1, r1, LV9, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1],
        [ba, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, Gg7, jg7, q0A, yO6, r1, r1, r1, r1, r1, r1],
        [ba, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, jg7, q0A, yO6, r1, r1, r1, r1, r1, r1],
        [ba, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, q0A, yO6, r1, r1, r1, r1, r1, r1],
        [ba, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, yO6, r1, r1, r1, r1, r1, r1],
        [ba, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1],
        [ba, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, Zg7],
        [ba, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1],
        [ba, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1]
    ];
    var {
        handleClientHello: RV9,
        handleClientKeyExchange: yV9,
        handleCertificateVerify: CV9
    } = s1;
    CO6[s1.ConnectionEnd.server] = [
        [r1, RV9, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1],
        [r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, Gg7, r1, r1, r1, r1, r1, r1, r1, r1, r1],
        [r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, yV9, r1, r1, r1, r1],
        [r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, CV9, r1, r1, r1, r1, r1],
        [r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1],
        [r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, Zg7],
        [r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1],
        [r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1]
    ];
    s1.generateKeys = function(A, q) {
        var K = SO6,
            Y = q.client_random + q.server_random;
        if (!A.session.resuming) q.master_secret = K(q.pre_master_secret, "master secret", Y, 48).bytes(), q.pre_master_secret = null;
        Y = q.server_random + q.client_random;
        var z = 2 * q.mac_key_length + 2 * q.enc_key_length,
            w = A.version.major === s1.Versions.TLS_1_0.major && A.version.minor === s1.Versions.TLS_1_0.minor;
        if (w) z += 2 * q.fixed_iv_length;
        var H = K(q.master_secret, "key expansion", Y, z),
            $ = {
                client_write_MAC_key: H.getBytes(q.mac_key_length),
                server_write_MAC_key: H.getBytes(q.mac_key_length),
                client_write_key: H.getBytes(q.enc_key_length),
                server_write_key: H.getBytes(q.enc_key_length)
            };
        if (w) $.client_write_IV = H.getBytes(q.fixed_iv_length), $.server_write_IV = H.getBytes(q.fixed_iv_length);
        return $
    };
    s1.createConnectionState = function(A) {
        var q = A.entity === s1.ConnectionEnd.client,
            K = function() {
                var w = {
                    sequenceNumber: [0, 0],
                    macKey: null,
                    macLength: 0,
                    macFunction: null,
                    cipherState: null,
                    cipherFunction: function(H) {
                        return !0
                    },
                    compressionState: null,
                    compressFunction: function(H) {
                        return !0
                    },
                    updateSequenceNumber: function() {
                        if (w.sequenceNumber[1] === 4294967295) w.sequenceNumber[1] = 0, ++w.sequenceNumber[0];
                        else ++w.sequenceNumber[1]
                    }
                };
                return w
            },
            Y = {
                read: K(),
                write: K()
            };
        if (Y.read.update = function(w, H) {
                if (!Y.read.cipherFunction(H, Y.read)) w.error(w, {
                    message: "Could not decrypt record or bad MAC.",
                    send: !0,
                    alert: {
                        level: s1.Alert.Level.fatal,
                        description: s1.Alert.Description.bad_record_mac
                    }
                });
                else if (!Y.read.compressFunction(w, H, Y.read)) w.error(w, {
                    message: "Could not decompress record.",
                    send: !0,
                    alert: {
                        level: s1.Alert.Level.fatal,
                        description: s1.Alert.Description.decompression_failure
                    }
                });
                return !w.fail
            }, Y.write.update = function(w, H) {
                if (!Y.write.compressFunction(w, H, Y.write)) w.error(w, {
                    message: "Could not compress record.",
                    send: !1,
                    alert: {
                        level: s1.Alert.Level.fatal,
                        description: s1.Alert.Description.internal_error
                    }
                });
                else if (!Y.write.cipherFunction(H, Y.write)) w.error(w, {
                    message: "Could not encrypt record.",
                    send: !1,
                    alert: {
                        level: s1.Alert.Level.fatal,
                        description: s1.Alert.Description.internal_error
                    }
                });
                return !w.fail
            }, A.session) {
            var z = A.session.sp;
            switch (A.session.cipherSuite.initSecurityParameters(z), z.keys = s1.generateKeys(A, z), Y.read.macKey = q ? z.keys.server_write_MAC_key : z.keys.client_write_MAC_key, Y.write.macKey = q ? z.keys.client_write_MAC_key : z.keys.server_write_MAC_key, A.session.cipherSuite.initConnectionState(Y, A, z), z.compression_algorithm) {
                case s1.CompressionMethod.none:
                    break;
                case s1.CompressionMethod.deflate:
                    Y.read.compressFunction = jV9, Y.write.compressFunction = DV9;
                    break;
                default:
                    throw Error("Unsupported compression algorithm.")
            }
        }
        return Y
    };
    s1.createRandom = function() {
        var A = new Date,
            q = +A + A.getTimezoneOffset() * 60000,
            K = h8.util.createBuffer();
        return K.putInt32(q), K.putBytes(h8.random.getBytes(28)), K
    };
    s1.createRecord = function(A, q) {
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
    s1.createAlert = function(A, q) {
        var K = h8.util.createBuffer();
        return K.putByte(q.level), K.putByte(q.description), s1.createRecord(A, {
            type: s1.ContentType.alert,
            data: K
        })
    };
    s1.createClientHello = function(A) {
        A.session.clientHelloVersion = {
            major: A.version.major,
            minor: A.version.minor
        };
        var q = h8.util.createBuffer();
        for (var K = 0; K < A.cipherSuites.length; ++K) {
            var Y = A.cipherSuites[K];
            q.putByte(Y.id[0]), q.putByte(Y.id[1])
        }
        var z = q.length(),
            w = h8.util.createBuffer();
        w.putByte(s1.CompressionMethod.none);
        var H = w.length(),
            $ = h8.util.createBuffer();
        if (A.virtualHost) {
            var O = h8.util.createBuffer();
            O.putByte(0), O.putByte(0);
            var _ = h8.util.createBuffer();
            _.putByte(0), OR(_, 2, h8.util.createBuffer(A.virtualHost));
            var J = h8.util.createBuffer();
            OR(J, 2, _), OR(O, 2, J), $.putBuffer(O)
        }
        var X = $.length();
        if (X > 0) X += 2;
        var D = A.session.id,
            j = D.length + 1 + 2 + 4 + 28 + 2 + z + 1 + H + X,
            M = h8.util.createBuffer();
        if (M.putByte(s1.HandshakeType.client_hello), M.putInt24(j), M.putByte(A.version.major), M.putByte(A.version.minor), M.putBytes(A.session.sp.client_random), OR(M, 1, h8.util.createBuffer(D)), OR(M, 2, q), OR(M, 1, w), X > 0) OR(M, 2, $);
        return M
    };
    s1.createServerHello = function(A) {
        var q = A.session.id,
            K = q.length + 1 + 2 + 4 + 28 + 2 + 1,
            Y = h8.util.createBuffer();
        return Y.putByte(s1.HandshakeType.server_hello), Y.putInt24(K), Y.putByte(A.version.major), Y.putByte(A.version.minor), Y.putBytes(A.session.sp.server_random), OR(Y, 1, h8.util.createBuffer(q)), Y.putByte(A.session.cipherSuite.id[0]), Y.putByte(A.session.cipherSuite.id[1]), Y.putByte(A.session.compressionMethod), Y
    };
    s1.createCertificate = function(A) {
        var q = A.entity === s1.ConnectionEnd.client,
            K = null;
        if (A.getCertificate) {
            var Y;
            if (q) Y = A.session.certificateRequest;
            else Y = A.session.extensions.server_name.serverNameList;
            K = A.getCertificate(A, Y)
        }
        var z = h8.util.createBuffer();
        if (K !== null) try {
            if (!h8.util.isArray(K)) K = [K];
            var w = null;
            for (var H = 0; H < K.length; ++H) {
                var $ = h8.pem.decode(K[H])[0];
                if ($.type !== "CERTIFICATE" && $.type !== "X509 CERTIFICATE" && $.type !== "TRUSTED CERTIFICATE") {
                    var O = Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
                    throw O.headerType = $.type, O
                }
                if ($.procType && $.procType.type === "ENCRYPTED") throw Error("Could not convert certificate from PEM; PEM is encrypted.");
                var _ = h8.util.createBuffer($.body);
                if (w === null) w = h8.asn1.fromDer(_.bytes(), !1);
                var J = h8.util.createBuffer();
                OR(J, 3, _), z.putBuffer(J)
            }
            if (K = h8.pki.certificateFromAsn1(w), q) A.session.clientCertificate = K;
            else A.session.serverCertificate = K
        } catch (j) {
            return A.error(A, {
                message: "Could not send certificate list.",
                cause: j,
                send: !0,
                alert: {
                    level: s1.Alert.Level.fatal,
                    description: s1.Alert.Description.bad_certificate
                }
            })
        }
        var X = 3 + z.length(),
            D = h8.util.createBuffer();
        return D.putByte(s1.HandshakeType.certificate), D.putInt24(X), OR(D, 3, z), D
    };
    s1.createClientKeyExchange = function(A) {
        var q = h8.util.createBuffer();
        q.putByte(A.session.clientHelloVersion.major), q.putByte(A.session.clientHelloVersion.minor), q.putBytes(h8.random.getBytes(46));
        var K = A.session.sp;
        K.pre_master_secret = q.getBytes();
        var Y = A.session.serverCertificate.publicKey;
        q = Y.encrypt(K.pre_master_secret);
        var z = q.length + 2,
            w = h8.util.createBuffer();
        return w.putByte(s1.HandshakeType.client_key_exchange), w.putInt24(z), w.putInt16(q.length), w.putBytes(q), w
    };
    s1.createServerKeyExchange = function(A) {
        var q = 0,
            K = h8.util.createBuffer();
        if (q > 0) K.putByte(s1.HandshakeType.server_key_exchange), K.putInt24(q);
        return K
    };
    s1.getClientSignature = function(A, q) {
        var K = h8.util.createBuffer();
        K.putBuffer(A.session.md5.digest()), K.putBuffer(A.session.sha1.digest()), K = K.getBytes(), A.getSignature = A.getSignature || function(Y, z, w) {
            var H = null;
            if (Y.getPrivateKey) try {
                H = Y.getPrivateKey(Y, Y.session.clientCertificate), H = h8.pki.privateKeyFromPem(H)
            } catch ($) {
                Y.error(Y, {
                    message: "Could not get private key.",
                    cause: $,
                    send: !0,
                    alert: {
                        level: s1.Alert.Level.fatal,
                        description: s1.Alert.Description.internal_error
                    }
                })
            }
            if (H === null) Y.error(Y, {
                message: "No private key set.",
                send: !0,
                alert: {
                    level: s1.Alert.Level.fatal,
                    description: s1.Alert.Description.internal_error
                }
            });
            else z = H.sign(z, null);
            w(Y, z)
        }, A.getSignature(A, K, q)
    };
    s1.createCertificateVerify = function(A, q) {
        var K = q.length + 2,
            Y = h8.util.createBuffer();
        return Y.putByte(s1.HandshakeType.certificate_verify), Y.putInt24(K), Y.putInt16(q.length), Y.putBytes(q), Y
    };
    s1.createCertificateRequest = function(A) {
        var q = h8.util.createBuffer();
        q.putByte(1);
        var K = h8.util.createBuffer();
        for (var Y in A.caStore.certs) {
            var z = A.caStore.certs[Y],
                w = h8.pki.distinguishedNameToAsn1(z.subject),
                H = h8.asn1.toDer(w);
            K.putInt16(H.length()), K.putBuffer(H)
        }
        var $ = 1 + q.length() + 2 + K.length(),
            O = h8.util.createBuffer();
        return O.putByte(s1.HandshakeType.certificate_request), O.putInt24($), OR(O, 1, q), OR(O, 2, K), O
    };
    s1.createServerHelloDone = function(A) {
        var q = h8.util.createBuffer();
        return q.putByte(s1.HandshakeType.server_hello_done), q.putInt24(0), q
    };
    s1.createChangeCipherSpec = function() {
        var A = h8.util.createBuffer();
        return A.putByte(1), A
    };
    s1.createFinished = function(A) {
        var q = h8.util.createBuffer();
        q.putBuffer(A.session.md5.digest()), q.putBuffer(A.session.sha1.digest());
        var K = A.entity === s1.ConnectionEnd.client,
            Y = A.session.sp,
            z = 12,
            w = SO6,
            H = K ? "client finished" : "server finished";
        q = w(Y.master_secret, H, q.getBytes(), z);
        var $ = h8.util.createBuffer();
        return $.putByte(s1.HandshakeType.finished), $.putInt24(q.length()), $.putBuffer(q), $
    };
    s1.createHeartbeat = function(A, q, K) {
        if (typeof K > "u") K = q.length;
        var Y = h8.util.createBuffer();
        Y.putByte(A), Y.putInt16(K), Y.putBytes(q);
        var z = Y.length(),
            w = Math.max(16, z - K - 3);
        return Y.putBytes(h8.random.getBytes(w)), Y
    };
    s1.queue = function(A, q) {
        if (!q) return;
        if (q.fragment.length() === 0) {
            if (q.type === s1.ContentType.handshake || q.type === s1.ContentType.alert || q.type === s1.ContentType.change_cipher_spec) return
        }
        if (q.type === s1.ContentType.handshake) {
            var K = q.fragment.bytes();
            A.session.md5.update(K), A.session.sha1.update(K), K = null
        }
        var Y;
        if (q.fragment.length() <= s1.MaxFragment) Y = [q];
        else {
            Y = [];
            var z = q.fragment.bytes();
            while (z.length > s1.MaxFragment) Y.push(s1.createRecord(A, {
                type: q.type,
                data: h8.util.createBuffer(z.slice(0, s1.MaxFragment))
            })), z = z.slice(s1.MaxFragment);
            if (z.length > 0) Y.push(s1.createRecord(A, {
                type: q.type,
                data: h8.util.createBuffer(z)
            }))
        }
        for (var w = 0; w < Y.length && !A.fail; ++w) {
            var H = Y[w],
                $ = A.state.current.write;
            if ($.update(A, H)) A.records.push(H)
        }
    };
    s1.flush = function(A) {
        for (var q = 0; q < A.records.length; ++q) {
            var K = A.records[q];
            A.tlsData.putByte(K.type), A.tlsData.putByte(K.version.major), A.tlsData.putByte(K.version.minor), A.tlsData.putInt16(K.fragment.length()), A.tlsData.putBuffer(A.records[q].fragment)
        }
        return A.records = [], A.tlsDataReady(A)
    };
    var K0A = function(A) {
            switch (A) {
                case !0:
                    return !0;
                case h8.pki.certificateError.bad_certificate:
                    return s1.Alert.Description.bad_certificate;
                case h8.pki.certificateError.unsupported_certificate:
                    return s1.Alert.Description.unsupported_certificate;
                case h8.pki.certificateError.certificate_revoked:
                    return s1.Alert.Description.certificate_revoked;
                case h8.pki.certificateError.certificate_expired:
                    return s1.Alert.Description.certificate_expired;
                case h8.pki.certificateError.certificate_unknown:
                    return s1.Alert.Description.certificate_unknown;
                case h8.pki.certificateError.unknown_ca:
                    return s1.Alert.Description.unknown_ca;
                default:
                    return s1.Alert.Description.bad_certificate
            }
        },
        SV9 = function(A) {
            switch (A) {
                case !0:
                    return !0;
                case s1.Alert.Description.bad_certificate:
                    return h8.pki.certificateError.bad_certificate;
                case s1.Alert.Description.unsupported_certificate:
                    return h8.pki.certificateError.unsupported_certificate;
                case s1.Alert.Description.certificate_revoked:
                    return h8.pki.certificateError.certificate_revoked;
                case s1.Alert.Description.certificate_expired:
                    return h8.pki.certificateError.certificate_expired;
                case s1.Alert.Description.certificate_unknown:
                    return h8.pki.certificateError.certificate_unknown;
                case s1.Alert.Description.unknown_ca:
                    return h8.pki.certificateError.unknown_ca;
                default:
                    return h8.pki.certificateError.bad_certificate
            }
        };
    s1.verifyCertificateChain = function(A, q) {
        try {
            var K = {};
            for (var Y in A.verifyOptions) K[Y] = A.verifyOptions[Y];
            K.verify = function(w, H, $) {
                var O = K0A(w),
                    _ = A.verify(A, w, H, $);
                if (_ !== !0) {
                    if (typeof _ === "object" && !h8.util.isArray(_)) {
                        var J = Error("The application rejected the certificate.");
                        if (J.send = !0, J.alert = {
                                level: s1.Alert.Level.fatal,
                                description: s1.Alert.Description.bad_certificate
                            }, _.message) J.message = _.message;
                        if (_.alert) J.alert.description = _.alert;
                        throw J
                    }
                    if (_ !== w) _ = SV9(_)
                }
                return _
            }, h8.pki.verifyCertificateChain(A.caStore, q, K)
        } catch (w) {
            var z = w;
            if (typeof z !== "object" || h8.util.isArray(z)) z = {
                send: !0,
                alert: {
                    level: s1.Alert.Level.fatal,
                    description: K0A(w)
                }
            };
            if (!("send" in z)) z.send = !0;
            if (!("alert" in z)) z.alert = {
                level: s1.Alert.Level.fatal,
                description: K0A(z.error)
            };
            A.error(A, z)
        }
        return !A.fail
    };
    s1.createSessionCache = function(A, q) {
        var K = null;
        if (A && A.getSession && A.setSession && A.order) K = A;
        else {
            K = {}, K.cache = A || {}, K.capacity = Math.max(q || 100, 1), K.order = [];
            for (var Y in A)
                if (K.order.length <= q) K.order.push(Y);
                else delete A[Y];
            K.getSession = function(z) {
                var w = null,
                    H = null;
                if (z) H = h8.util.bytesToHex(z);
                else if (K.order.length > 0) H = K.order[0];
                if (H !== null && H in K.cache) {
                    w = K.cache[H], delete K.cache[H];
                    for (var $ in K.order)
                        if (K.order[$] === H) {
                            K.order.splice($, 1);
                            break
                        }
                }
                return w
            }, K.setSession = function(z, w) {
                if (K.order.length === K.capacity) {
                    var H = K.order.shift();
                    delete K.cache[H]
                }
                var H = h8.util.bytesToHex(z);
                K.order.push(H), K.cache[H] = w
            }
        }
        return K
    };
    s1.createConnection = function(A) {
        var q = null;
        if (A.caStore)
            if (h8.util.isArray(A.caStore)) q = h8.pki.createCaStore(A.caStore);
            else q = A.caStore;
        else q = h8.pki.createCaStore();
        var K = A.cipherSuites || null;
        if (K === null) {
            K = [];
            for (var Y in s1.CipherSuites) K.push(s1.CipherSuites[Y])
        }
        var z = A.server ? s1.ConnectionEnd.server : s1.ConnectionEnd.client,
            w = A.sessionCache ? s1.createSessionCache(A.sessionCache) : null,
            H = {
                version: {
                    major: s1.Version.major,
                    minor: s1.Version.minor
                },
                entity: z,
                sessionId: A.sessionId,
                caStore: q,
                sessionCache: w,
                cipherSuites: K,
                connected: A.connected,
                virtualHost: A.virtualHost || null,
                verifyClient: A.verifyClient || !1,
                verify: A.verify || function(J, X, D, j) {
                    return X
                },
                verifyOptions: A.verifyOptions || {},
                getCertificate: A.getCertificate || null,
                getPrivateKey: A.getPrivateKey || null,
                getSignature: A.getSignature || null,
                input: h8.util.createBuffer(),
                tlsData: h8.util.createBuffer(),
                data: h8.util.createBuffer(),
                tlsDataReady: A.tlsDataReady,
                dataReady: A.dataReady,
                heartbeatReceived: A.heartbeatReceived,
                closed: A.closed,
                error: function(J, X) {
                    if (X.origin = X.origin || (J.entity === s1.ConnectionEnd.client ? "client" : "server"), X.send) s1.queue(J, s1.createAlert(J, X.alert)), s1.flush(J);
                    var D = X.fatal !== !1;
                    if (D) J.fail = !0;
                    if (A.error(J, X), D) J.close(!1)
                },
                deflate: A.deflate || null,
                inflate: A.inflate || null
            };
        H.reset = function(J) {
            H.version = {
                major: s1.Version.major,
                minor: s1.Version.minor
            }, H.record = null, H.session = null, H.peerCertificate = null, H.state = {
                pending: null,
                current: null
            }, H.expect = H.entity === s1.ConnectionEnd.client ? MV9 : NV9, H.fragmented = null, H.records = [], H.open = !1, H.handshakes = 0, H.handshaking = !1, H.isConnected = !1, H.fail = !(J || typeof J > "u"), H.input.clear(), H.tlsData.clear(), H.data.clear(), H.state.current = s1.createConnectionState(H)
        }, H.reset();
        var $ = function(J, X) {
                var D = X.type - s1.ContentType.change_cipher_spec,
                    j = w0A[J.entity][J.expect];
                if (D in j) j[D](J, X);
                else s1.handleUnexpected(J, X)
            },
            O = function(J) {
                var X = 0,
                    D = J.input,
                    j = D.length();
                if (j < 5) X = 5 - j;
                else {
                    J.record = {
                        type: D.getByte(),
                        version: {
                            major: D.getByte(),
                            minor: D.getByte()
                        },
                        length: D.getInt16(),
                        fragment: h8.util.createBuffer(),
                        ready: !1
                    };
                    var M = J.record.version.major === J.version.major;
                    if (M && J.session && J.session.version) M = J.record.version.minor === J.version.minor;
                    if (!M) J.error(J, {
                        message: "Incompatible TLS version.",
                        send: !0,
                        alert: {
                            level: s1.Alert.Level.fatal,
                            description: s1.Alert.Description.protocol_version
                        }
                    })
                }
                return X
            },
            _ = function(J) {
                var X = 0,
                    D = J.input,
                    j = D.length();
                if (j < J.record.length) X = J.record.length - j;
                else {
                    J.record.fragment.putBytes(D.getBytes(J.record.length)), D.compact();
                    var M = J.state.current.read;
                    if (M.update(J, J.record)) {
                        if (J.fragmented !== null)
                            if (J.fragmented.type === J.record.type) J.fragmented.fragment.putBuffer(J.record.fragment), J.record = J.fragmented;
                            else J.error(J, {
                                message: "Invalid fragmented record.",
                                send: !0,
                                alert: {
                                    level: s1.Alert.Level.fatal,
                                    description: s1.Alert.Description.unexpected_message
                                }
                            });
                        J.record.ready = !0
                    }
                }
                return X
            };
        return H.handshake = function(J) {
            if (H.entity !== s1.ConnectionEnd.client) H.error(H, {
                message: "Cannot initiate handshake as a server.",
                fatal: !1
            });
            else if (H.handshaking) H.error(H, {
                message: "Handshake already in progress.",
                fatal: !1
            });
            else {
                if (H.fail && !H.open && H.handshakes === 0) H.fail = !1;
                H.handshaking = !0, J = J || "";
                var X = null;
                if (J.length > 0) {
                    if (H.sessionCache) X = H.sessionCache.getSession(J);
                    if (X === null) J = ""
                }
                if (J.length === 0 && H.sessionCache) {
                    if (X = H.sessionCache.getSession(), X !== null) J = X.id
                }
                if (H.session = {
                        id: J,
                        version: null,
                        cipherSuite: null,
                        compressionMethod: null,
                        serverCertificate: null,
                        certificateRequest: null,
                        clientCertificate: null,
                        sp: {},
                        md5: h8.md.md5.create(),
                        sha1: h8.md.sha1.create()
                    }, X) H.version = X.version, H.session.sp = X.sp;
                H.session.sp.client_random = s1.createRandom().getBytes(), H.open = !0, s1.queue(H, s1.createRecord(H, {
                    type: s1.ContentType.handshake,
                    data: s1.createClientHello(H)
                })), s1.flush(H)
            }
        }, H.process = function(J) {
            var X = 0;
            if (J) H.input.putBytes(J);
            if (!H.fail) {
                if (H.record !== null && H.record.ready && H.record.fragment.isEmpty()) H.record = null;
                if (H.record === null) X = O(H);
                if (!H.fail && H.record !== null && !H.record.ready) X = _(H);
                if (!H.fail && H.record !== null && H.record.ready) $(H, H.record)
            }
            return X
        }, H.prepare = function(J) {
            return s1.queue(H, s1.createRecord(H, {
                type: s1.ContentType.application_data,
                data: h8.util.createBuffer(J)
            })), s1.flush(H)
        }, H.prepareHeartbeatRequest = function(J, X) {
            if (J instanceof h8.util.ByteBuffer) J = J.bytes();
            if (typeof X > "u") X = J.length;
            return H.expectedHeartbeatPayload = J, s1.queue(H, s1.createRecord(H, {
                type: s1.ContentType.heartbeat,
                data: s1.createHeartbeat(s1.HeartbeatMessageType.heartbeat_request, J, X)
            })), s1.flush(H)
        }, H.close = function(J) {
            if (!H.fail && H.sessionCache && H.session) {
                var X = {
                    id: H.session.id,
                    version: H.session.version,
                    sp: H.session.sp
                };
                X.sp.keys = null, H.sessionCache.setSession(X.id, X)
            }
            if (H.open) {
                if (H.open = !1, H.input.clear(), H.isConnected || H.handshaking) H.isConnected = H.handshaking = !1, s1.queue(H, s1.createAlert(H, {
                    level: s1.Alert.Level.warning,
                    description: s1.Alert.Description.close_notify
                })), s1.flush(H);
                H.closed(H)
            }
            H.reset(J)
        }, H
    };
    fg7.exports = h8.tls = h8.tls || {};
    for (Ru1 in s1)
        if (typeof s1[Ru1] !== "function") h8.tls[Ru1] = s1[Ru1];
    var Ru1;
    h8.tls.prf_tls1 = SO6;
    h8.tls.hmac_sha1 = XV9;
    h8.tls.createSessionCache = s1.createSessionCache;
    h8.tls.createConnection = s1.createConnection
})
// @from(Ln 231945, Col 4)
Tg7 = R((D_w, Ng7) => {
    var ua = d5();
    ya();
    H0A();
    var _R = Ng7.exports = ua.tls;
    _R.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA = {
        id: [0, 47],
        name: "TLS_RSA_WITH_AES_128_CBC_SHA",
        initSecurityParameters: function(A) {
            A.bulk_cipher_algorithm = _R.BulkCipherAlgorithm.aes, A.cipher_type = _R.CipherType.block, A.enc_key_length = 16, A.block_length = 16, A.fixed_iv_length = 16, A.record_iv_length = 16, A.mac_algorithm = _R.MACAlgorithm.hmac_sha1, A.mac_length = 20, A.mac_key_length = 20
        },
        initConnectionState: Vg7
    };
    _R.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA = {
        id: [0, 53],
        name: "TLS_RSA_WITH_AES_256_CBC_SHA",
        initSecurityParameters: function(A) {
            A.bulk_cipher_algorithm = _R.BulkCipherAlgorithm.aes, A.cipher_type = _R.CipherType.block, A.enc_key_length = 32, A.block_length = 16, A.fixed_iv_length = 16, A.record_iv_length = 16, A.mac_algorithm = _R.MACAlgorithm.hmac_sha1, A.mac_length = 20, A.mac_key_length = 20
        },
        initConnectionState: Vg7
    };

    function Vg7(A, q, K) {
        var Y = q.entity === ua.tls.ConnectionEnd.client;
        A.read.cipherState = {
            init: !1,
            cipher: ua.cipher.createDecipher("AES-CBC", Y ? K.keys.server_write_key : K.keys.client_write_key),
            iv: Y ? K.keys.server_write_IV : K.keys.client_write_IV
        }, A.write.cipherState = {
            init: !1,
            cipher: ua.cipher.createCipher("AES-CBC", Y ? K.keys.client_write_key : K.keys.server_write_key),
            iv: Y ? K.keys.client_write_IV : K.keys.server_write_IV
        }, A.read.cipherFunction = bV9, A.write.cipherFunction = hV9, A.read.macLength = A.write.macLength = K.mac_length, A.read.macFunction = A.write.macFunction = _R.hmac_sha1
    }

    function hV9(A, q) {
        var K = !1,
            Y = q.macFunction(q.macKey, q.sequenceNumber, A);
        A.fragment.putBytes(Y), q.updateSequenceNumber();
        var z;
        if (A.version.minor === _R.Versions.TLS_1_0.minor) z = q.cipherState.init ? null : q.cipherState.iv;
        else z = ua.random.getBytesSync(16);
        q.cipherState.init = !0;
        var w = q.cipherState.cipher;
        if (w.start({
                iv: z
            }), A.version.minor >= _R.Versions.TLS_1_1.minor) w.output.putBytes(z);
        if (w.update(A.fragment), w.finish(IV9)) A.fragment = w.output, A.length = A.fragment.length(), K = !0;
        return K
    }

    function IV9(A, q, K) {
        if (!K) {
            var Y = A - q.length() % A;
            q.fillWithByte(Y - 1, Y)
        }
        return !0
    }

    function xV9(A, q, K) {
        var Y = !0;
        if (K) {
            var z = q.length(),
                w = q.last();
            for (var H = z - 1 - w; H < z - 1; ++H) Y = Y && q.at(H) == w;
            if (Y) q.truncate(w + 1)
        }
        return Y
    }

    function bV9(A, q) {
        var K = !1,
            Y;
        if (A.version.minor === _R.Versions.TLS_1_0.minor) Y = q.cipherState.init ? null : q.cipherState.iv;
        else Y = A.fragment.getBytes(16);
        q.cipherState.init = !0;
        var z = q.cipherState.cipher;
        z.start({
            iv: Y
        }), z.update(A.fragment), K = z.finish(xV9);
        var w = q.macLength,
            H = ua.random.getBytesSync(w),
            $ = z.output.length();
        if ($ >= w) A.fragment = z.output.getBytes($ - w), H = z.output.getBytes(w);
        else A.fragment = z.output.getBytes();
        A.fragment = ua.util.createBuffer(A.fragment), A.length = A.fragment.length();
        var O = q.macFunction(q.macKey, q.sequenceNumber, A);
        return q.updateSequenceNumber(), K = uV9(q.macKey, H, O) && K, K
    }

    function uV9(A, q, K) {
        var Y = ua.hmac.create();
        return Y.start("SHA1", A), Y.update(q), q = Y.digest().getBytes(), Y.start(null, null), Y.update(K), K = Y.digest().getBytes(), q === K
    }
})
// @from(Ln 232040, Col 4)
_0A = R((j_w, Lg7) => {
    var Y$ = d5();
    SB();
    cY();
    var yu1 = Lg7.exports = Y$.sha512 = Y$.sha512 || {};
    Y$.md.sha512 = Y$.md.algorithms.sha512 = yu1;
    var Eg7 = Y$.sha384 = Y$.sha512.sha384 = Y$.sha512.sha384 || {};
    Eg7.create = function() {
        return yu1.create("SHA-384")
    };
    Y$.md.sha384 = Y$.md.algorithms.sha384 = Eg7;
    Y$.sha512.sha256 = Y$.sha512.sha256 || {
        create: function() {
            return yu1.create("SHA-512/256")
        }
    };
    Y$.md["sha512/256"] = Y$.md.algorithms["sha512/256"] = Y$.sha512.sha256;
    Y$.sha512.sha224 = Y$.sha512.sha224 || {
        create: function() {
            return yu1.create("SHA-512/224")
        }
    };
    Y$.md["sha512/224"] = Y$.md.algorithms["sha512/224"] = Y$.sha512.sha224;
    yu1.create = function(A) {
        if (!kg7) BV9();
        if (typeof A > "u") A = "SHA-512";
        if (!(A in eq1)) throw Error("Invalid SHA-512 algorithm: " + A);
        var q = eq1[A],
            K = null,
            Y = Y$.util.createBuffer(),
            z = Array(80);
        for (var w = 0; w < 80; ++w) z[w] = [, , ];
        var H = 64;
        switch (A) {
            case "SHA-384":
                H = 48;
                break;
            case "SHA-512/256":
                H = 32;
                break;
            case "SHA-512/224":
                H = 28;
                break
        }
        var $ = {
            algorithm: A.replace("-", "").toLowerCase(),
            blockLength: 128,
            digestLength: H,
            messageLength: 0,
            fullMessageLength: null,
            messageLengthSize: 16
        };
        return $.start = function() {
            $.messageLength = 0, $.fullMessageLength = $.messageLength128 = [];
            var O = $.messageLengthSize / 4;
            for (var _ = 0; _ < O; ++_) $.fullMessageLength.push(0);
            Y = Y$.util.createBuffer(), K = Array(q.length);
            for (var _ = 0; _ < q.length; ++_) K[_] = q[_].slice(0);
            return $
        }, $.start(), $.update = function(O, _) {
            if (_ === "utf8") O = Y$.util.encodeUtf8(O);
            var J = O.length;
            $.messageLength += J, J = [J / 4294967296 >>> 0, J >>> 0];
            for (var X = $.fullMessageLength.length - 1; X >= 0; --X) $.fullMessageLength[X] += J[1], J[1] = J[0] + ($.fullMessageLength[X] / 4294967296 >>> 0), $.fullMessageLength[X] = $.fullMessageLength[X] >>> 0, J[0] = J[1] / 4294967296 >>> 0;
            if (Y.putBytes(O), vg7(K, z, Y), Y.read > 2048 || Y.length() === 0) Y.compact();
            return $
        }, $.digest = function() {
            var O = Y$.util.createBuffer();
            O.putBytes(Y.bytes());
            var _ = $.fullMessageLength[$.fullMessageLength.length - 1] + $.messageLengthSize,
                J = _ & $.blockLength - 1;
            O.putBytes($0A.substr(0, $.blockLength - J));
            var X, D, j = $.fullMessageLength[0] * 8;
            for (var M = 0; M < $.fullMessageLength.length - 1; ++M) X = $.fullMessageLength[M + 1] * 8, D = X / 4294967296 >>> 0, j += D, O.putInt32(j >>> 0), j = X >>> 0;
            O.putInt32(j);
            var P = Array(K.length);
            for (var M = 0; M < K.length; ++M) P[M] = K[M].slice(0);
            vg7(P, z, O);
            var W = Y$.util.createBuffer(),
                G;
            if (A === "SHA-512") G = P.length;
            else if (A === "SHA-384") G = P.length - 2;
            else G = P.length - 4;
            for (var M = 0; M < G; ++M)
                if (W.putInt32(P[M][0]), M !== G - 1 || A !== "SHA-512/224") W.putInt32(P[M][1]);
            return W
        }, $
    };
    var $0A = null,
        kg7 = !1,
        O0A = null,
        eq1 = null;

    function BV9() {
        $0A = String.fromCharCode(128), $0A += Y$.util.fillString(String.fromCharCode(0), 128), O0A = [
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
        ], eq1 = {}, eq1["SHA-512"] = [
            [1779033703, 4089235720],
            [3144134277, 2227873595],
            [1013904242, 4271175723],
            [2773480762, 1595750129],
            [1359893119, 2917565137],
            [2600822924, 725511199],
            [528734635, 4215389547],
            [1541459225, 327033209]
        ], eq1["SHA-384"] = [
            [3418070365, 3238371032],
            [1654270250, 914150663],
            [2438529370, 812702999],
            [355462360, 4144912697],
            [1731405415, 4290775857],
            [2394180231, 1750603025],
            [3675008525, 1694076839],
            [1203062813, 3204075428]
        ], eq1["SHA-512/256"] = [
            [573645204, 4230739756],
            [2673172387, 3360449730],
            [596883563, 1867755857],
            [2520282905, 1497426621],
            [2519219938, 2827943907],
            [3193839141, 1401305490],
            [721525244, 746961066],
            [246885852, 2177182882]
        ], eq1["SHA-512/224"] = [
            [2352822216, 424955298],
            [1944164710, 2312950998],
            [502970286, 855612546],
            [1738396948, 1479516111],
            [258812777, 2077511080],
            [2011393907, 79989058],
            [1067287976, 1780299464],
            [286451373, 2446758561]
        ], kg7 = !0
    }

    function vg7(A, q, K) {
        var Y, z, w, H, $, O, _, J, X, D, j, M, P, W, G, f, Z, N, T, k, y, B, S, m, b, g, U, x, p, l, r, s, O1, T1, N1, j1 = K.length();
        while (j1 >= 128) {
            for (p = 0; p < 16; ++p) q[p][0] = K.getInt32() >>> 0, q[p][1] = K.getInt32() >>> 0;
            for (; p < 80; ++p) s = q[p - 2], l = s[0], r = s[1], Y = ((l >>> 19 | r << 13) ^ (r >>> 29 | l << 3) ^ l >>> 6) >>> 0, z = ((l << 13 | r >>> 19) ^ (r << 3 | l >>> 29) ^ (l << 26 | r >>> 6)) >>> 0, T1 = q[p - 15], l = T1[0], r = T1[1], w = ((l >>> 1 | r << 31) ^ (l >>> 8 | r << 24) ^ l >>> 7) >>> 0, H = ((l << 31 | r >>> 1) ^ (l << 24 | r >>> 8) ^ (l << 25 | r >>> 7)) >>> 0, O1 = q[p - 7], N1 = q[p - 16], r = z + O1[1] + H + N1[1], q[p][0] = Y + O1[0] + w + N1[0] + (r / 4294967296 >>> 0) >>> 0, q[p][1] = r >>> 0;
            P = A[0][0], W = A[0][1], G = A[1][0], f = A[1][1], Z = A[2][0], N = A[2][1], T = A[3][0], k = A[3][1], y = A[4][0], B = A[4][1], S = A[5][0], m = A[5][1], b = A[6][0], g = A[6][1], U = A[7][0], x = A[7][1];
            for (p = 0; p < 80; ++p) _ = ((y >>> 14 | B << 18) ^ (y >>> 18 | B << 14) ^ (B >>> 9 | y << 23)) >>> 0, J = ((y << 18 | B >>> 14) ^ (y << 14 | B >>> 18) ^ (B << 23 | y >>> 9)) >>> 0, X = (b ^ y & (S ^ b)) >>> 0, D = (g ^ B & (m ^ g)) >>> 0, $ = ((P >>> 28 | W << 4) ^ (W >>> 2 | P << 30) ^ (W >>> 7 | P << 25)) >>> 0, O = ((P << 4 | W >>> 28) ^ (W << 30 | P >>> 2) ^ (W << 25 | P >>> 7)) >>> 0, j = (P & G | Z & (P ^ G)) >>> 0, M = (W & f | N & (W ^ f)) >>> 0, r = x + J + D + O0A[p][1] + q[p][1], Y = U + _ + X + O0A[p][0] + q[p][0] + (r / 4294967296 >>> 0) >>> 0, z = r >>> 0, r = O + M, w = $ + j + (r / 4294967296 >>> 0) >>> 0, H = r >>> 0, U = b, x = g, b = S, g = m, S = y, m = B, r = k + z, y = T + Y + (r / 4294967296 >>> 0) >>> 0, B = r >>> 0, T = Z, k = N, Z = G, N = f, G = P, f = W, r = z + H, P = Y + w + (r / 4294967296 >>> 0) >>> 0, W = r >>> 0;
            r = A[0][1] + W, A[0][0] = A[0][0] + P + (r / 4294967296 >>> 0) >>> 0, A[0][1] = r >>> 0, r = A[1][1] + f, A[1][0] = A[1][0] + G + (r / 4294967296 >>> 0) >>> 0, A[1][1] = r >>> 0, r = A[2][1] + N, A[2][0] = A[2][0] + Z + (r / 4294967296 >>> 0) >>> 0, A[2][1] = r >>> 0, r = A[3][1] + k, A[3][0] = A[3][0] + T + (r / 4294967296 >>> 0) >>> 0, A[3][1] = r >>> 0, r = A[4][1] + B, A[4][0] = A[4][0] + y + (r / 4294967296 >>> 0) >>> 0, A[4][1] = r >>> 0, r = A[5][1] + m, A[5][0] = A[5][0] + S + (r / 4294967296 >>> 0) >>> 0, A[5][1] = r >>> 0, r = A[6][1] + g, A[6][0] = A[6][0] + b + (r / 4294967296 >>> 0) >>> 0, A[6][1] = r >>> 0, r = A[7][1] + x, A[7][0] = A[7][0] + U + (r / 4294967296 >>> 0) >>> 0, A[7][1] = r >>> 0, j1 -= 128
        }
    }
})
// @from(Ln 232265, Col 4)
Rg7 = R((FV9) => {
    var mV9 = d5();
    Zh();
    var Kj = mV9.asn1;
    FV9.privateKeyValidator = {
        name: "PrivateKeyInfo",
        tagClass: Kj.Class.UNIVERSAL,
        type: Kj.Type.SEQUENCE,
        constructed: !0,
        value: [{
            name: "PrivateKeyInfo.version",
            tagClass: Kj.Class.UNIVERSAL,
            type: Kj.Type.INTEGER,
            constructed: !1,
            capture: "privateKeyVersion"
        }, {
            name: "PrivateKeyInfo.privateKeyAlgorithm",
            tagClass: Kj.Class.UNIVERSAL,
            type: Kj.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "AlgorithmIdentifier.algorithm",
                tagClass: Kj.Class.UNIVERSAL,
                type: Kj.Type.OID,
                constructed: !1,
                capture: "privateKeyOid"
            }]
        }, {
            name: "PrivateKeyInfo",
            tagClass: Kj.Class.UNIVERSAL,
            type: Kj.Type.OCTETSTRING,
            constructed: !1,
            capture: "privateKey"
        }]
    };
    FV9.publicKeyValidator = {
        name: "SubjectPublicKeyInfo",
        tagClass: Kj.Class.UNIVERSAL,
        type: Kj.Type.SEQUENCE,
        constructed: !0,
        captureAsn1: "subjectPublicKeyInfo",
        value: [{
            name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
            tagClass: Kj.Class.UNIVERSAL,
            type: Kj.Type.SEQUENCE,
            constructed: !0,
            value: [{
                name: "AlgorithmIdentifier.algorithm",
                tagClass: Kj.Class.UNIVERSAL,
                type: Kj.Type.OID,
                constructed: !1,
                capture: "publicKeyOid"
            }]
        }, {
            tagClass: Kj.Class.UNIVERSAL,
            type: Kj.Type.BITSTRING,
            constructed: !1,
            composed: !0,
            captureBitStringValue: "ed25519PublicKey"
        }]
    }
})
// @from(Ln 232327, Col 4)
Qg7 = R((P_w, Fg7) => {
    var gM = d5();
    vu1();
    zR();
    _0A();
    cY();
    var Ig7 = Rg7(),
        UV9 = Ig7.publicKeyValidator,
        pV9 = Ig7.privateKeyValidator;
    if (typeof D0A > "u") D0A = gM.jsbn.BigInteger;
    var D0A, j0A = gM.util.ByteBuffer,
        eV = typeof Buffer > "u" ? Uint8Array : Buffer;
    gM.pki = gM.pki || {};
    Fg7.exports = gM.pki.ed25519 = gM.ed25519 = gM.ed25519 || {};
    var Q9 = gM.ed25519;
    Q9.constants = {};
    Q9.constants.PUBLIC_KEY_BYTE_LENGTH = 32;
    Q9.constants.PRIVATE_KEY_BYTE_LENGTH = 64;
    Q9.constants.SEED_BYTE_LENGTH = 32;
    Q9.constants.SIGN_BYTE_LENGTH = 64;
    Q9.constants.HASH_BYTE_LENGTH = 64;
    Q9.generateKeyPair = function(A) {
        A = A || {};
        var q = A.seed;
        if (q === void 0) q = gM.random.getBytesSync(Q9.constants.SEED_BYTE_LENGTH);
        else if (typeof q === "string") {
            if (q.length !== Q9.constants.SEED_BYTE_LENGTH) throw TypeError('"seed" must be ' + Q9.constants.SEED_BYTE_LENGTH + " bytes in length.")
        } else if (!(q instanceof Uint8Array)) throw TypeError('"seed" must be a node.js Buffer, Uint8Array, or a binary string.');
        q = Tp({
            message: q,
            encoding: "binary"
        });
        var K = new eV(Q9.constants.PUBLIC_KEY_BYTE_LENGTH),
            Y = new eV(Q9.constants.PRIVATE_KEY_BYTE_LENGTH);
        for (var z = 0; z < 32; ++z) Y[z] = q[z];
        return iV9(K, Y), {
            publicKey: K,
            privateKey: Y
        }
    };
    Q9.privateKeyFromAsn1 = function(A) {
        var q = {},
            K = [],
            Y = gM.asn1.validate(A, pV9, q, K);
        if (!Y) {
            var z = Error("Invalid Key.");
            throw z.errors = K, z
        }
        var w = gM.asn1.derToOid(q.privateKeyOid),
            H = gM.oids.EdDSA25519;
        if (w !== H) throw Error('Invalid OID "' + w + '"; OID must be "' + H + '".');
        var $ = q.privateKey,
            O = Tp({
                message: gM.asn1.fromDer($).value,
                encoding: "binary"
            });
        return {
            privateKeyBytes: O
        }
    };
    Q9.publicKeyFromAsn1 = function(A) {
        var q = {},
            K = [],
            Y = gM.asn1.validate(A, UV9, q, K);
        if (!Y) {
            var z = Error("Invalid Key.");
            throw z.errors = K, z
        }
        var w = gM.asn1.derToOid(q.publicKeyOid),
            H = gM.oids.EdDSA25519;
        if (w !== H) throw Error('Invalid OID "' + w + '"; OID must be "' + H + '".');
        var $ = q.ed25519PublicKey;
        if ($.length !== Q9.constants.PUBLIC_KEY_BYTE_LENGTH) throw Error("Key length is invalid.");
        return Tp({
            message: $,
            encoding: "binary"
        })
    };
    Q9.publicKeyFromPrivateKey = function(A) {
        A = A || {};
        var q = Tp({
            message: A.privateKey,
            encoding: "binary"
        });
        if (q.length !== Q9.constants.PRIVATE_KEY_BYTE_LENGTH) throw TypeError('"options.privateKey" must have a byte length of ' + Q9.constants.PRIVATE_KEY_BYTE_LENGTH);
        var K = new eV(Q9.constants.PUBLIC_KEY_BYTE_LENGTH);
        for (var Y = 0; Y < K.length; ++Y) K[Y] = q[32 + Y];
        return K
    };
    Q9.sign = function(A) {
        A = A || {};
        var q = Tp(A),
            K = Tp({
                message: A.privateKey,
                encoding: "binary"
            });
        if (K.length === Q9.constants.SEED_BYTE_LENGTH) {
            var Y = Q9.generateKeyPair({
                seed: K
            });
            K = Y.privateKey
        } else if (K.length !== Q9.constants.PRIVATE_KEY_BYTE_LENGTH) throw TypeError('"options.privateKey" must have a byte length of ' + Q9.constants.SEED_BYTE_LENGTH + " or " + Q9.constants.PRIVATE_KEY_BYTE_LENGTH);
        var z = new eV(Q9.constants.SIGN_BYTE_LENGTH + q.length);
        nV9(z, q, q.length, K);
        var w = new eV(Q9.constants.SIGN_BYTE_LENGTH);
        for (var H = 0; H < w.length; ++H) w[H] = z[H];
        return w
    };
    Q9.verify = function(A) {
        A = A || {};
        var q = Tp(A);
        if (A.signature === void 0) throw TypeError('"options.signature" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a binary string.');
        var K = Tp({
            message: A.signature,
            encoding: "binary"
        });
        if (K.length !== Q9.constants.SIGN_BYTE_LENGTH) throw TypeError('"options.signature" must have a byte length of ' + Q9.constants.SIGN_BYTE_LENGTH);
        var Y = Tp({
            message: A.publicKey,
            encoding: "binary"
        });
        if (Y.length !== Q9.constants.PUBLIC_KEY_BYTE_LENGTH) throw TypeError('"options.publicKey" must have a byte length of ' + Q9.constants.PUBLIC_KEY_BYTE_LENGTH);
        var z = new eV(Q9.constants.SIGN_BYTE_LENGTH + q.length),
            w = new eV(Q9.constants.SIGN_BYTE_LENGTH + q.length),
            H;
        for (H = 0; H < Q9.constants.SIGN_BYTE_LENGTH; ++H) z[H] = K[H];
        for (H = 0; H < q.length; ++H) z[H + Q9.constants.SIGN_BYTE_LENGTH] = q[H];
        return rV9(w, z, z.length, Y) >= 0
    };

    function Tp(A) {
        var q = A.message;
        if (q instanceof Uint8Array || q instanceof eV) return q;
        var K = A.encoding;
        if (q === void 0)
            if (A.md) q = A.md.digest().getBytes(), K = "binary";
            else throw TypeError('"options.message" or "options.md" not specified.');
        if (typeof q === "string" && !K) throw TypeError('"options.encoding" must be "binary" or "utf8".');
        if (typeof q === "string") {
            if (typeof Buffer < "u") return Buffer.from(q, K);
            q = new j0A(q, K)
        } else if (!(q instanceof j0A)) throw TypeError('"options.message" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a string with "options.encoding" specifying its encoding.');
        var Y = new eV(q.length());
        for (var z = 0; z < Y.length; ++z) Y[z] = q.at(z);
        return Y
    }
    var M0A = mK(),
        hO6 = mK([1]),
        dV9 = mK([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]),
        cV9 = mK([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]),
        yg7 = mK([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]),
        Cg7 = mK([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]),
        J0A = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]),
        lV9 = mK([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);

    function Cu1(A, q) {
        var K = gM.md.sha512.create(),
            Y = new j0A(A);
        K.update(Y.getBytes(q), "binary");
        var z = K.digest().getBytes();
        if (typeof Buffer < "u") return Buffer.from(z, "binary");
        var w = new eV(Q9.constants.HASH_BYTE_LENGTH);
        for (var H = 0; H < 64; ++H) w[H] = z.charCodeAt(H);
        return w
    }

    function iV9(A, q) {
        var K = [mK(), mK(), mK(), mK()],
            Y, z = Cu1(q, 32);
        z[0] &= 248, z[31] &= 127, z[31] |= 64, Z0A(K, z), G0A(A, K);
        for (Y = 0; Y < 32; ++Y) q[Y + 32] = A[Y];
        return 0
    }

    function nV9(A, q, K, Y) {
        var z, w, H = new Float64Array(64),
            $ = [mK(), mK(), mK(), mK()],
            O = Cu1(Y, 32);
        O[0] &= 248, O[31] &= 127, O[31] |= 64;
        var _ = K + 64;
        for (z = 0; z < K; ++z) A[64 + z] = q[z];
        for (z = 0; z < 32; ++z) A[32 + z] = O[32 + z];
        var J = Cu1(A.subarray(32), K + 32);
        P0A(J), Z0A($, J), G0A(A, $);
        for (z = 32; z < 64; ++z) A[z] = Y[z];
        var X = Cu1(A, K + 64);
        P0A(X);
        for (z = 32; z < 64; ++z) H[z] = 0;
        for (z = 0; z < 32; ++z) H[z] = J[z];
        for (z = 0; z < 32; ++z)
            for (w = 0; w < 32; w++) H[z + w] += X[z] * O[w];
        return xg7(A.subarray(32), H), _
    }

    function rV9(A, q, K, Y) {
        var z, w, H = new eV(32),
            $ = [mK(), mK(), mK(), mK()],
            O = [mK(), mK(), mK(), mK()];
        if (w = -1, K < 64) return -1;
        if (oV9(O, Y)) return -1;
        for (z = 0; z < K; ++z) A[z] = q[z];
        for (z = 0; z < 32; ++z) A[z + 32] = Y[z];
        var _ = Cu1(A, K);
        if (P0A(_), Bg7($, O, _), Z0A(O, q.subarray(32)), W0A($, O), G0A(H, $), K -= 64, bg7(q, 0, H, 0)) {
            for (z = 0; z < K; ++z) A[z] = 0;
            return -1
        }
        for (z = 0; z < K; ++z) A[z] = q[z + 64];
        return w = K, w
    }

    function xg7(A, q) {
        var K, Y, z, w;
        for (Y = 63; Y >= 32; --Y) {
            K = 0;
            for (z = Y - 32, w = Y - 12; z < w; ++z) q[z] += K - 16 * q[Y] * J0A[z - (Y - 32)], K = q[z] + 128 >> 8, q[z] -= K * 256;
            q[z] += K, q[Y] = 0
        }
        K = 0;
        for (z = 0; z < 32; ++z) q[z] += K - (q[31] >> 4) * J0A[z], K = q[z] >> 8, q[z] &= 255;
        for (z = 0; z < 32; ++z) q[z] -= K * J0A[z];
        for (Y = 0; Y < 32; ++Y) q[Y + 1] += q[Y] >> 8, A[Y] = q[Y] & 255
    }

    function P0A(A) {
        var q = new Float64Array(64);
        for (var K = 0; K < 64; ++K) q[K] = A[K], A[K] = 0;
        xg7(A, q)
    }

    function W0A(A, q) {
        var K = mK(),
            Y = mK(),
            z = mK(),
            w = mK(),
            H = mK(),
            $ = mK(),
            O = mK(),
            _ = mK(),
            J = mK();
        Vj1(K, A[1], A[0]), Vj1(J, q[1], q[0]), Iw(K, K, J), fj1(Y, A[0], A[1]), fj1(J, q[0], q[1]), Iw(Y, Y, J), Iw(z, A[3], q[3]), Iw(z, z, cV9), Iw(w, A[2], q[2]), fj1(w, w, w), Vj1(H, Y, K), Vj1($, w, z), fj1(O, w, z), fj1(_, Y, K), Iw(A[0], H, $), Iw(A[1], _, O), Iw(A[2], O, $), Iw(A[3], H, _)
    }

    function Sg7(A, q, K) {
        for (var Y = 0; Y < 4; ++Y) mg7(A[Y], q[Y], K)
    }

    function G0A(A, q) {
        var K = mK(),
            Y = mK(),
            z = mK();
        eV9(z, q[2]), Iw(K, q[0], z), Iw(Y, q[1], z), IO6(A, Y), A[31] ^= ug7(K) << 7
    }

    function IO6(A, q) {
        var K, Y, z, w = mK(),
            H = mK();
        for (K = 0; K < 16; ++K) H[K] = q[K];
        X0A(H), X0A(H), X0A(H);
        for (Y = 0; Y < 2; ++Y) {
            w[0] = H[0] - 65517;
            for (K = 1; K < 15; ++K) w[K] = H[K] - 65535 - (w[K - 1] >> 16 & 1), w[K - 1] &= 65535;
            w[15] = H[15] - 32767 - (w[14] >> 16 & 1), z = w[15] >> 16 & 1, w[14] &= 65535, mg7(H, w, 1 - z)
        }
        for (K = 0; K < 16; K++) A[2 * K] = H[K] & 255, A[2 * K + 1] = H[K] >> 8
    }

    function oV9(A, q) {
        var K = mK(),
            Y = mK(),
            z = mK(),
            w = mK(),
            H = mK(),
            $ = mK(),
            O = mK();
        if (Ba(A[2], hO6), aV9(A[1], q), AK1(z, A[1]), Iw(w, z, dV9), Vj1(z, z, A[2]), fj1(w, A[2], w), AK1(H, w), AK1($, H), Iw(O, $, H), Iw(K, O, z), Iw(K, K, w), sV9(K, K), Iw(K, K, z), Iw(K, K, w), Iw(K, K, w), Iw(A[0], K, w), AK1(Y, A[0]), Iw(Y, Y, w), hg7(Y, z)) Iw(A[0], A[0], lV9);
        if (AK1(Y, A[0]), Iw(Y, Y, w), hg7(Y, z)) return -1;
        if (ug7(A[0]) === q[31] >> 7) Vj1(A[0], M0A, A[0]);
        return Iw(A[3], A[0], A[1]), 0
    }

    function aV9(A, q) {
        var K;
        for (K = 0; K < 16; ++K) A[K] = q[2 * K] + (q[2 * K + 1] << 8);
        A[15] &= 32767
    }

    function sV9(A, q) {
        var K = mK(),
            Y;
        for (Y = 0; Y < 16; ++Y) K[Y] = q[Y];
        for (Y = 250; Y >= 0; --Y)
            if (AK1(K, K), Y !== 1) Iw(K, K, q);
        for (Y = 0; Y < 16; ++Y) A[Y] = K[Y]
    }

    function hg7(A, q) {
        var K = new eV(32),
            Y = new eV(32);
        return IO6(K, A), IO6(Y, q), bg7(K, 0, Y, 0)
    }

    function bg7(A, q, K, Y) {
        return tV9(A, q, K, Y, 32)
    }

    function tV9(A, q, K, Y, z) {
        var w, H = 0;
        for (w = 0; w < z; ++w) H |= A[q + w] ^ K[Y + w];
        return (1 & H - 1 >>> 8) - 1
    }

    function ug7(A) {
        var q = new eV(32);
        return IO6(q, A), q[0] & 1
    }

    function Bg7(A, q, K) {
        var Y, z;
        Ba(A[0], M0A), Ba(A[1], hO6), Ba(A[2], hO6), Ba(A[3], M0A);
        for (z = 255; z >= 0; --z) Y = K[z / 8 | 0] >> (z & 7) & 1, Sg7(A, q, Y), W0A(q, A), W0A(A, A), Sg7(A, q, Y)
    }

    function Z0A(A, q) {
        var K = [mK(), mK(), mK(), mK()];
        Ba(K[0], yg7), Ba(K[1], Cg7), Ba(K[2], hO6), Iw(K[3], yg7, Cg7), Bg7(A, K, q)
    }

    function Ba(A, q) {
        var K;
        for (K = 0; K < 16; K++) A[K] = q[K] | 0
    }

    function eV9(A, q) {
        var K = mK(),
            Y;
        for (Y = 0; Y < 16; ++Y) K[Y] = q[Y];
        for (Y = 253; Y >= 0; --Y)
            if (AK1(K, K), Y !== 2 && Y !== 4) Iw(K, K, q);
        for (Y = 0; Y < 16; ++Y) A[Y] = K[Y]
    }

    function X0A(A) {
        var q, K, Y = 1;
        for (q = 0; q < 16; ++q) K = A[q] + Y + 65535, Y = Math.floor(K / 65536), A[q] = K - Y * 65536;
        A[0] += Y - 1 + 37 * (Y - 1)
    }

    function mg7(A, q, K) {
        var Y, z = ~(K - 1);
        for (var w = 0; w < 16; ++w) Y = z & (A[w] ^ q[w]), A[w] ^= Y, q[w] ^= Y
    }

    function mK(A) {
        var q, K = new Float64Array(16);
        if (A)
            for (q = 0; q < A.length; ++q) K[q] = A[q];
        return K
    }

    function fj1(A, q, K) {
        for (var Y = 0; Y < 16; ++Y) A[Y] = q[Y] + K[Y]
    }

    function Vj1(A, q, K) {
        for (var Y = 0; Y < 16; ++Y) A[Y] = q[Y] - K[Y]
    }

    function AK1(A, q) {
        Iw(A, q, q)
    }

    function Iw(A, q, K) {
        var Y, z, w = 0,
            H = 0,
            $ = 0,
            O = 0,
            _ = 0,
            J = 0,
            X = 0,
            D = 0,
            j = 0,
            M = 0,
            P = 0,
            W = 0,
            G = 0,
            f = 0,
            Z = 0,
            N = 0,
            T = 0,
            k = 0,
            y = 0,
            B = 0,
            S = 0,
            m = 0,
            b = 0,
            g = 0,
            U = 0,
            x = 0,
            p = 0,
            l = 0,
            r = 0,
            s = 0,
            O1 = 0,
            T1 = K[0],
            N1 = K[1],
            j1 = K[2],
            q1 = K[3],
            t = K[4],
            J1 = K[5],
            D1 = K[6],
            Z1 = K[7],
            E1 = K[8],
            a = K[9],
            A1 = K[10],
            M1 = K[11],
            z1 = K[12],
            Y1 = K[13],
            _1 = K[14],
            $1 = K[15];
        Y = q[0], w += Y * T1, H += Y * N1, $ += Y * j1, O += Y * q1, _ += Y * t, J += Y * J1, X += Y * D1, D += Y * Z1, j += Y * E1, M += Y * a, P += Y * A1, W += Y * M1, G += Y * z1, f += Y * Y1, Z += Y * _1, N += Y * $1, Y = q[1], H += Y * T1, $ += Y * N1, O += Y * j1, _ += Y * q1, J += Y * t, X += Y * J1, D += Y * D1, j += Y * Z1, M += Y * E1, P += Y * a, W += Y * A1, G += Y * M1, f += Y * z1, Z += Y * Y1, N += Y * _1, T += Y * $1, Y = q[2], $ += Y * T1, O += Y * N1, _ += Y * j1, J += Y * q1, X += Y * t, D += Y * J1, j += Y * D1, M += Y * Z1, P += Y * E1, W += Y * a, G += Y * A1, f += Y * M1, Z += Y * z1, N += Y * Y1, T += Y * _1, k += Y * $1, Y = q[3], O += Y * T1, _ += Y * N1, J += Y * j1, X += Y * q1, D += Y * t, j += Y * J1, M += Y * D1, P += Y * Z1, W += Y * E1, G += Y * a, f += Y * A1, Z += Y * M1, N += Y * z1, T += Y * Y1, k += Y * _1, y += Y * $1, Y = q[4], _ += Y * T1, J += Y * N1, X += Y * j1, D += Y * q1, j += Y * t, M += Y * J1, P += Y * D1, W += Y * Z1, G += Y * E1, f += Y * a, Z += Y * A1, N += Y * M1, T += Y * z1, k += Y * Y1, y += Y * _1, B += Y * $1, Y = q[5], J += Y * T1, X += Y * N1, D += Y * j1, j += Y * q1, M += Y * t, P += Y * J1, W += Y * D1, G += Y * Z1, f += Y * E1, Z += Y * a, N += Y * A1, T += Y * M1, k += Y * z1, y += Y * Y1, B += Y * _1, S += Y * $1, Y = q[6], X += Y * T1, D += Y * N1, j += Y * j1, M += Y * q1, P += Y * t, W += Y * J1, G += Y * D1, f += Y * Z1, Z += Y * E1, N += Y * a, T += Y * A1, k += Y * M1, y += Y * z1, B += Y * Y1, S += Y * _1, m += Y * $1, Y = q[7], D += Y * T1, j += Y * N1, M += Y * j1, P += Y * q1, W += Y * t, G += Y * J1, f += Y * D1, Z += Y * Z1, N += Y * E1, T += Y * a, k += Y * A1, y += Y * M1, B += Y * z1, S += Y * Y1, m += Y * _1, b += Y * $1, Y = q[8], j += Y * T1, M += Y * N1, P += Y * j1, W += Y * q1, G += Y * t, f += Y * J1, Z += Y * D1, N += Y * Z1, T += Y * E1, k += Y * a, y += Y * A1, B += Y * M1, S += Y * z1, m += Y * Y1, b += Y * _1, g += Y * $1, Y = q[9], M += Y * T1, P += Y * N1, W += Y * j1, G += Y * q1, f += Y * t, Z += Y * J1, N += Y * D1, T += Y * Z1, k += Y * E1, y += Y * a, B += Y * A1, S += Y * M1, m += Y * z1, b += Y * Y1, g += Y * _1, U += Y * $1, Y = q[10], P += Y * T1, W += Y * N1, G += Y * j1, f += Y * q1, Z += Y * t, N += Y * J1, T += Y * D1, k += Y * Z1, y += Y * E1, B += Y * a, S += Y * A1, m += Y * M1, b += Y * z1, g += Y * Y1, U += Y * _1, x += Y * $1, Y = q[11], W += Y * T1, G += Y * N1, f += Y * j1, Z += Y * q1, N += Y * t, T += Y * J1, k += Y * D1, y += Y * Z1, B += Y * E1, S += Y * a, m += Y * A1, b += Y * M1, g += Y * z1, U += Y * Y1, x += Y * _1, p += Y * $1, Y = q[12], G += Y * T1, f += Y * N1, Z += Y * j1, N += Y * q1, T += Y * t, k += Y * J1, y += Y * D1, B += Y * Z1, S += Y * E1, m += Y * a, b += Y * A1, g += Y * M1, U += Y * z1, x += Y * Y1, p += Y * _1, l += Y * $1, Y = q[13], f += Y * T1, Z += Y * N1, N += Y * j1, T += Y * q1, k += Y * t, y += Y * J1, B += Y * D1, S += Y * Z1, m += Y * E1, b += Y * a, g += Y * A1, U += Y * M1, x += Y * z1, p += Y * Y1, l += Y * _1, r += Y * $1, Y = q[14], Z += Y * T1, N += Y * N1, T += Y * j1, k += Y * q1, y += Y * t, B += Y * J1, S += Y * D1, m += Y * Z1, b += Y * E1, g += Y * a, U += Y * A1, x += Y * M1, p += Y * z1, l += Y * Y1, r += Y * _1, s += Y * $1, Y = q[15], N += Y * T1, T += Y * N1, k += Y * j1, y += Y * q1, B += Y * t, S += Y * J1, m += Y * D1, b += Y * Z1, g += Y * E1, U += Y * a, x += Y * A1, p += Y * M1, l += Y * z1, r += Y * Y1, s += Y * _1, O1 += Y * $1, w += 38 * T, H += 38 * k, $ += 38 * y, O += 38 * B, _ += 38 * S, J += 38 * m, X += 38 * b, D += 38 * g, j += 38 * U, M += 38 * x, P += 38 * p, W += 38 * l, G += 38 * r, f += 38 * s, Z += 38 * O1, z = 1, Y = w + z + 65535, z = Math.floor(Y / 65536), w = Y - z * 65536, Y = H + z + 65535, z = Math.floor(Y / 65536), H = Y - z * 65536, Y = $ + z + 65535, z = Math.floor(Y / 65536), $ = Y - z * 65536, Y = O + z + 65535, z = Math.floor(Y / 65536), O = Y - z * 65536, Y = _ + z + 65535, z = Math.floor(Y / 65536), _ = Y - z * 65536, Y = J + z + 65535, z = Math.floor(Y / 65536), J = Y - z * 65536, Y = X + z + 65535, z = Math.floor(Y / 65536), X = Y - z * 65536, Y = D + z + 65535, z = Math.floor(Y / 65536), D = Y - z * 65536, Y = j + z + 65535, z = Math.floor(Y / 65536), j = Y - z * 65536, Y = M + z + 65535, z = Math.floor(Y / 65536), M = Y - z * 65536, Y = P + z + 65535, z = Math.floor(Y / 65536), P = Y - z * 65536, Y = W + z + 65535, z = Math.floor(Y / 65536), W = Y - z * 65536, Y = G + z + 65535, z = Math.floor(Y / 65536), G = Y - z * 65536, Y = f + z + 65535, z = Math.floor(Y / 65536), f = Y - z * 65536, Y = Z + z + 65535, z = Math.floor(Y / 65536), Z = Y - z * 65536, Y = N + z + 65535, z = Math.floor(Y / 65536), N = Y - z * 65536, w += z - 1 + 37 * (z - 1), z = 1, Y = w + z + 65535, z = Math.floor(Y / 65536), w = Y - z * 65536, Y = H + z + 65535, z = Math.floor(Y / 65536), H = Y - z * 65536, Y = $ + z + 65535, z = Math.floor(Y / 65536), $ = Y - z * 65536, Y = O + z + 65535, z = Math.floor(Y / 65536), O = Y - z * 65536, Y = _ + z + 65535, z = Math.floor(Y / 65536), _ = Y - z * 65536, Y = J + z + 65535, z = Math.floor(Y / 65536), J = Y - z * 65536, Y = X + z + 65535, z = Math.floor(Y / 65536), X = Y - z * 65536, Y = D + z + 65535, z = Math.floor(Y / 65536), D = Y - z * 65536, Y = j + z + 65535, z = Math.floor(Y / 65536), j = Y - z * 65536, Y = M + z + 65535, z = Math.floor(Y / 65536), M = Y - z * 65536, Y = P + z + 65535, z = Math.floor(Y / 65536), P = Y - z * 65536, Y = W + z + 65535, z = Math.floor(Y / 65536), W = Y - z * 65536, Y = G + z + 65535, z = Math.floor(Y / 65536), G = Y - z * 65536, Y = f + z + 65535, z = Math.floor(Y / 65536), f = Y - z * 65536, Y = Z + z + 65535, z = Math.floor(Y / 65536), Z = Y - z * 65536, Y = N + z + 65535, z = Math.floor(Y / 65536), N = Y - z * 65536, w += z - 1 + 37 * (z - 1), A[0] = w, A[1] = H, A[2] = $, A[3] = O, A[4] = _, A[5] = J, A[6] = X, A[7] = D, A[8] = j, A[9] = M, A[10] = P, A[11] = W, A[12] = G, A[13] = f, A[14] = Z, A[15] = N
    }
})