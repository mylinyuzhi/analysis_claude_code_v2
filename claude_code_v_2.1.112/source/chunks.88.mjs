
// @from(Ln 233941, Col 4)
W68 = L(() => {
    A9z = Y9z("/");
    try {
        hS8 = A9z("worker_threads").Worker
    } catch (q) {}
    w9z = hS8 ? function(q, K, _, z, Y) {
        var A = !1,
            O = new hS8(q + O9z, {
                eval: !0
            }).on("error", function(w) {
                return Y(w, null)
            }).on("message", function(w) {
                return Y(null, w)
            }).on("exit", function(w) {
                if (w && !A) Y(Error("exited with code " + w), null)
            });
        return O.postMessage(_, z), O.terminate = function() {
            return A = !0, hS8.prototype.terminate.call(O)
        }, O
    } : function(q, K, _, z, Y) {
        setImmediate(function() {
            return Y(Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"), null)
        });
        var A = function() {};
        return {
            terminate: A,
            postMessage: A
        }
    }, $_ = Uint8Array, Ck = Uint16Array, J68 = Int32Array, PL6 = new $_([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]), WL6 = new $_([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]), $68 = new $_([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Sf4 = Rf4(PL6, 2), mQ1 = Sf4.b, bS8 = Sf4.r;
    mQ1[28] = 258, bS8[258] = 28;
    Cf4 = Rf4(WL6, 0), bf4 = Cf4.b, LQ1 = Cf4.r, j68 = new Ck(32768);
    for (xz = 0; xz < 32768; ++xz) Mc = (xz & 43690) >> 1 | (xz & 21845) << 1, Mc = (Mc & 52428) >> 2 | (Mc & 13107) << 2, Mc = (Mc & 61680) >> 4 | (Mc & 3855) << 4, j68[xz] = ((Mc & 65280) >> 8 | (Mc & 255) << 8) >> 1;
    ms = new $_(288);
    for (xz = 0; xz < 144; ++xz) ms[xz] = 8;
    for (xz = 144; xz < 256; ++xz) ms[xz] = 9;
    for (xz = 256; xz < 280; ++xz) ms[xz] = 7;
    for (xz = 280; xz < 288; ++xz) ms[xz] = 8;
    XL6 = new $_(32);
    for (xz = 0; xz < 32; ++xz) XL6[xz] = 5;
    If4 = zx(ms, 9, 0), xf4 = zx(ms, 9, 1), uf4 = zx(XL6, 5, 0), mf4 = zx(XL6, 5, 1), $9z = {
        UnexpectedEOF: 0,
        InvalidBlockType: 1,
        InvalidLengthLiteral: 2,
        InvalidDistance: 3,
        StreamFinished: 4,
        NoStreamHandler: 5,
        InvalidHeader: 6,
        NoCallback: 7,
        InvalidUTF8: 8,
        ExtraFieldTooLong: 9,
        InvalidDate: 10,
        FilenameTooLong: 11,
        StreamFinishing: 12,
        InvalidZipData: 13,
        UnknownCompressionMethod: 14
    }, Bf4 = ["unexpected EOF", "invalid block type", "invalid length/literal", "invalid distance", "stream finished", "no stream handler", , "no callback", "invalid UTF-8 data", "extra field too long", "date not in range 1980-2099", "filename too long", "stream finishing", "invalid zip data"], pf4 = new J68([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), tK6 = new $_(0), gf4 = function() {
        var q = new Int32Array(256);
        for (var K = 0; K < 256; ++K) {
            var _ = K,
                z = 9;
            while (--z) _ = (_ & 1 && -306674912) ^ _ >>> 1;
            q[K] = _
        }
        return q
    }(), LS8 = [];
    Ax = function() {
        function q(K, _) {
            if (typeof K == "function") _ = K, K = {};
            if (this.ondata = _, this.o = K || {}, this.s = {
                    l: 0,
                    i: 32768,
                    w: 32768,
                    z: 32768
                }, this.b = new $_(98304), this.o.dictionary) {
                var z = this.o.dictionary.subarray(-32768);
                this.b.set(z, 32768 - z.length), this.s.i = 32768 - z.length
            }
        }
        return q.prototype.p = function(K, _) {
            this.ondata(OH6(K, this.o, 0, 0, this.s), _)
        }, q.prototype.push = function(K, _) {
            if (!this.ondata) z5(5);
            if (this.s.l) z5(4);
            var z = K.length + this.s.z;
            if (z > this.b.length) {
                if (z > 2 * this.b.length - 32768) {
                    var Y = new $_(z & -32768);
                    Y.set(this.b.subarray(0, this.s.z)), this.b = Y
                }
                var A = this.b.length - this.s.z;
                this.b.set(K.subarray(0, A), this.s.z), this.s.z = this.b.length, this.p(this.b, !1), this.b.set(this.b.subarray(-32768)), this.b.set(K.subarray(A), 32768), this.s.z = K.length - A + 32768, this.s.i = 32766, this.s.w = 32768
            } else this.b.set(K, this.s.z), this.s.z += K.length;
            if (this.s.l = _ & 1, this.s.z > this.s.w + 8191 || _) this.p(this.b, _ || !1), this.s.w = this.s.i, this.s.i -= 2
        }, q.prototype.flush = function() {
            if (!this.ondata) z5(5);
            if (this.s.l) z5(4);
            this.p(this.b, !1), this.s.w = this.s.i, this.s.i -= 2
        }, q
    }(), if4 = function() {
        function q(K, _) {
            TL6([GL6, function() {
                return [Ox, Ax]
            }], this, wH6.call(this, K, _), function(z) {
                var Y = new Ax(z.data);
                onmessage = Ox(Y)
            }, 6, 1)
        }
        return q
    }();
    My = function() {
        function q(K, _) {
            if (typeof K == "function") _ = K, K = {};
            this.ondata = _;
            var z = K && K.dictionary && K.dictionary.subarray(-32768);
            if (this.s = {
                    i: 0,
                    b: z ? z.length : 0
                }, this.o = new $_(32768), this.p = new $_(0), z) this.o.set(z)
        }
        return q.prototype.e = function(K) {
            if (!this.ondata) z5(5);
            if (this.d) z5(4);
            if (!this.p.length) this.p = K;
            else if (K.length) {
                var _ = new $_(this.p.length + K.length);
                _.set(this.p), _.set(K, this.p.length), this.p = _
            }
        }, q.prototype.c = function(K) {
            this.s.i = +(this.d = K || !1);
            var _ = this.s.b,
                z = X68(this.p, this.s, this.o);
            this.ondata(Yx(z, _, this.s.b), this.d), this.o = Yx(z, this.s.b - 32768), this.s.b = this.o.length, this.p = Yx(this.p, this.s.p / 8 | 0), this.s.p &= 7
        }, q.prototype.push = function(K, _) {
            this.e(K), this.c(_)
        }, q
    }(), cQ1 = function() {
        function q(K, _) {
            TL6([fL6, function() {
                return [Ox, My]
            }], this, wH6.call(this, K, _), function(z) {
                var Y = new My(z.data);
                onmessage = Ox(Y)
            }, 7, 0)
        }
        return q
    }();
    SQ1 = function() {
        function q(K, _) {
            this.c = ZL6(), this.l = 0, this.v = 1, Ax.call(this, K, _)
        }
        return q.prototype.push = function(K, _) {
            this.c.p(K), this.l += K.length, Ax.prototype.push.call(this, K, _)
        }, q.prototype.p = function(K, _) {
            var z = OH6(K, this.o, this.v && UQ1(this.o), _ && 8, this.s);
            if (this.v) FQ1(z, this.o), this.v = 0;
            if (_) VO(z, z.length - 8, this.c.d()), VO(z, z.length - 4, this.l);
            this.ondata(z, _)
        }, q.prototype.flush = function() {
            Ax.prototype.flush.call(this)
        }, q
    }(), H9z = function() {
        function q(K, _) {
            TL6([GL6, Qf4, function() {
                return [Ox, Ax, SQ1]
            }], this, wH6.call(this, K, _), function(z) {
                var Y = new SQ1(z.data);
                onmessage = Ox(Y)
            }, 8, 1)
        }
        return q
    }();
    xS8 = function() {
        function q(K, _) {
            this.v = 1, this.r = 0, My.call(this, K, _)
        }
        return q.prototype.push = function(K, _) {
            if (My.prototype.e.call(this, K), this.r += K.length, this.v) {
                var z = this.p.subarray(this.v - 1),
                    Y = z.length > 3 ? gQ1(z) : 4;
                if (Y > z.length) {
                    if (!_) return
                } else if (this.v > 1 && this.onmember) this.onmember(this.r - z.length);
                this.p = z.subarray(Y), this.v = 0
            }
            if (My.prototype.c.call(this, _), this.s.f && !this.s.l && !_) this.v = DL6(this.s.p) + 9, this.s = {
                i: 0
            }, this.o = new $_(0), this.push(new $_(0), _)
        }, q
    }(), of4 = function() {
        function q(K, _) {
            var z = this;
            TL6([fL6, df4, function() {
                return [Ox, My, xS8]
            }], this, wH6.call(this, K, _), function(Y) {
                var A = new xS8(Y.data);
                A.onmember = function(O) {
                    return postMessage(O)
                }, onmessage = Ox(A)
            }, 9, 0, function(Y) {
                return z.onmember && z.onmember(Y)
            })
        }
        return q
    }();
    bQ1 = function() {
        function q(K, _) {
            this.c = FS8(), this.v = 1, Ax.call(this, K, _)
        }
        return q.prototype.push = function(K, _) {
            this.c.p(K), Ax.prototype.push.call(this, K, _)
        }, q.prototype.p = function(K, _) {
            var z = OH6(K, this.o, this.v && (this.o.dictionary ? 6 : 2), _ && 4, this.s);
            if (this.v) QQ1(z, this.o), this.v = 0;
            if (_) VO(z, z.length - 4, this.c.d());
            this.ondata(z, _)
        }, q.prototype.flush = function() {
            Ax.prototype.flush.call(this)
        }, q
    }(), X9z = function() {
        function q(K, _) {
            TL6([GL6, cf4, function() {
                return [Ox, Ax, bQ1]
            }], this, wH6.call(this, K, _), function(z) {
                var Y = new bQ1(z.data);
                onmessage = Ox(Y)
            }, 10, 1)
        }
        return q
    }();
    mS8 = function() {
        function q(K, _) {
            My.call(this, K, _), this.v = K && K.dictionary ? 2 : 1
        }
        return q.prototype.push = function(K, _) {
            if (My.prototype.e.call(this, K), this.v) {
                if (this.p.length < 6 && !_) return;
                this.p = this.p.subarray(dQ1(this.p, this.v - 1)), this.v = 0
            }
            if (_) {
                if (this.p.length < 4) z5(6, "invalid zlib data");
                this.p = this.p.subarray(0, -4)
            }
            My.prototype.c.call(this, _)
        }, q
    }(), sf4 = function() {
        function q(K, _) {
            TL6([fL6, lf4, function() {
                return [Ox, My, mS8]
            }], this, wH6.call(this, K, _), function(z) {
                var Y = new mS8(z.data);
                onmessage = Ox(Y)
            }, 11, 0)
        }
        return q
    }();
    xQ1 = function() {
        function q(K, _) {
            this.o = wH6.call(this, K, _) || {}, this.G = xS8, this.I = My, this.Z = mS8
        }
        return q.prototype.i = function() {
            var K = this;
            this.s.ondata = function(_, z) {
                K.ondata(_, z)
            }
        }, q.prototype.push = function(K, _) {
            if (!this.ondata) z5(5);
            if (!this.s) {
                if (this.p && this.p.length) {
                    var z = new $_(this.p.length + K.length);
                    z.set(this.p), z.set(K, this.p.length)
                } else this.p = K;
                if (this.p.length > 2) this.s = this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8 ? new this.G(this.o) : (this.p[0] & 15) != 8 || this.p[0] >> 4 > 7 || (this.p[0] << 8 | this.p[1]) % 31 ? new this.I(this.o) : new this.Z(this.o), this.i(), this.s.push(this.p, _), this.p = null
            } else this.s.push(K, _)
        }, q
    }(), P9z = function() {
        function q(K, _) {
            xQ1.call(this, K, _), this.queuedSize = 0, this.G = of4, this.I = cQ1, this.Z = sf4
        }
        return q.prototype.i = function() {
            var K = this;
            this.s.ondata = function(_, z, Y) {
                K.ondata(_, z, Y)
            }, this.s.ondrain = function(_) {
                if (K.queuedSize -= _, K.ondrain) K.ondrain(_)
            }
        }, q.prototype.push = function(K, _) {
            this.queuedSize += K.length, xQ1.prototype.push.call(this, K, _)
        }, q
    }();
    hf4 = typeof TextEncoder < "u" && new TextEncoder, uQ1 = typeof TextDecoder < "u" && new TextDecoder;
    try {
        uQ1.decode(tK6, {
            stream: !0
        }), ef4 = 1
    } catch (q) {}
    Z9z = function() {
        function q(K) {
            if (this.ondata = K, ef4) this.t = new TextDecoder;
            else this.p = tK6
        }
        return q.prototype.push = function(K, _) {
            if (!this.ondata) z5(5);
            if (_ = !!_, this.t) {
                if (this.ondata(this.t.decode(K, {
                        stream: !0
                    }), _), _) {
                    if (this.t.decode().length) z5(8);
                    this.t = null
                }
                return
            }
            if (!this.p) z5(4);
            var z = new $_(this.p.length + K.length);
            z.set(this.p), z.set(K, this.p.length);
            var Y = qG4(z),
                A = Y.s,
                O = Y.r;
            if (_) {
                if (O.length) z5(8);
                this.p = null
            } else this.p = O;
            this.ondata(A, _)
        }, q
    }(), f9z = function() {
        function q(K) {
            this.ondata = K
        }
        return q.prototype.push = function(K, _) {
            if (!this.ondata) z5(5);
            if (this.d) z5(4);
            this.ondata(q56(K), this.d = _ || !1)
        }, q
    }();
    H68 = function() {
        function q(K) {
            this.filename = K, this.c = ZL6(), this.size = 0, this.compression = 0
        }
        return q.prototype.process = function(K, _) {
            this.ondata(null, K, _)
        }, q.prototype.push = function(K, _) {
            if (!this.ondata) z5(5);
            if (this.c.p(K), this.size += K.length, _) this.crc = this.c.d();
            this.process(K, _ || !1)
        }, q
    }(), G9z = function() {
        function q(K, _) {
            var z = this;
            if (!_) _ = {};
            H68.call(this, K), this.d = new Ax(_, function(Y, A) {
                z.ondata(null, Y, A)
            }), this.compression = 8, this.flag = KG4(_.level)
        }
        return q.prototype.process = function(K, _) {
            try {
                this.d.push(K, _)
            } catch (z) {
                this.ondata(z, null, _)
            }
        }, q.prototype.push = function(K, _) {
            H68.prototype.push.call(this, K, _)
        }, q
    }(), v9z = function() {
        function q(K, _) {
            var z = this;
            if (!_) _ = {};
            H68.call(this, K), this.d = new if4(_, function(Y, A, O) {
                z.ondata(Y, A, O)
            }), this.compression = 8, this.flag = KG4(_.level), this.terminate = this.d.terminate
        }
        return q.prototype.process = function(K, _) {
            this.d.push(K, _)
        }, q.prototype.push = function(K, _) {
            H68.prototype.push.call(this, K, _)
        }, q
    }(), T9z = function() {
        function q(K) {
            this.ondata = K, this.u = [], this.d = 1
        }
        return q.prototype.add = function(K) {
            var _ = this;
            if (!this.ondata) z5(5);
            if (this.d & 2) this.ondata(z5(4 + (this.d & 1) * 8, 0, 1), null, !1);
            else {
                var z = q56(K.filename),
                    Y = z.length,
                    A = K.comment,
                    O = A && q56(A),
                    w = Y != K.filename.length || O && A.length != O.length,
                    $ = Y + eK6(K.extra) + 30;
                if (Y > 65535) this.ondata(z5(11, 0, 1), null, !1);
                var j = new $_($);
                ML6(j, 0, K, z, w, -1);
                var H = [j],
                    J = function() {
                        for (var D = 0, Z = H; D < Z.length; D++) {
                            var G = Z[D];
                            _.ondata(null, G, !1)
                        }
                        H = []
                    },
                    X = this.d;
                this.d = 0;
                var M = this.u.length,
                    P = M68(K, {
                        f: z,
                        u: w,
                        o: O,
                        t: function() {
                            if (K.terminate) K.terminate()
                        },
                        r: function() {
                            if (J(), X) {
                                var D = _.u[M + 1];
                                if (D) D.r();
                                else _.d = 1
                            }
                            X = 1
                        }
                    }),
                    W = 0;
                K.ondata = function(D, Z, G) {
                    if (D) _.ondata(D, Z, G), _.terminate();
                    else if (W += Z.length, H.push(Z), G) {
                        var f = new $_(16);
                        if (VO(f, 0, 134695760), VO(f, 4, K.crc), VO(f, 8, W), VO(f, 12, K.size), H.push(f), P.c = W, P.b = $ + W + 16, P.crc = K.crc, P.size = K.size, X) P.r();
                        X = 1
                    } else if (X) J()
                }, this.u.push(P)
            }
        }, q.prototype.end = function() {
            var K = this;
            if (this.d & 2) {
                this.ondata(z5(4 + (this.d & 1) * 8, 0, 1), null, !0);
                return
            }
            if (this.d) this.e();
            else this.u.push({
                r: function() {
                    if (!(K.d & 1)) return;
                    K.u.splice(-1, 1), K.e()
                },
                t: function() {}
            });
            this.d = 3
        }, q.prototype.e = function() {
            var K = 0,
                _ = 0,
                z = 0;
            for (var Y = 0, A = this.u; Y < A.length; Y++) {
                var O = A[Y];
                z += 46 + O.f.length + eK6(O.extra) + (O.o ? O.o.length : 0)
            }
            var w = new $_(z + 22);
            for (var $ = 0, j = this.u; $ < j.length; $++) {
                var O = j[$];
                ML6(w, K, O, O.f, O.u, -O.c - 2, _, O.o), K += 46 + O.f.length + eK6(O.extra) + (O.o ? O.o.length : 0), _ += O.b
            }
            rQ1(w, K, this.u.length, z, _), this.ondata(null, w, !0), this.d = 2
        }, q.prototype.terminate = function() {
            for (var K = 0, _ = this.u; K < _.length; K++) {
                var z = _[K];
                z.t()
            }
            this.d = 2
        }, q
    }();
    AG4 = function() {
        function q() {}
        return q.prototype.push = function(K, _) {
            this.ondata(null, K, _)
        }, q.compression = 0, q
    }(), k9z = function() {
        function q() {
            var K = this;
            this.i = new My(function(_, z) {
                K.ondata(null, _, z)
            })
        }
        return q.prototype.push = function(K, _) {
            try {
                this.i.push(K, _)
            } catch (z) {
                this.ondata(z, null, _)
            }
        }, q.compression = 8, q
    }(), N9z = function() {
        function q(K, _) {
            var z = this;
            if (_ < 320000) this.i = new My(function(Y, A) {
                z.ondata(null, Y, A)
            });
            else this.i = new cQ1(function(Y, A, O) {
                z.ondata(Y, A, O)
            }), this.terminate = this.i.terminate
        }
        return q.prototype.push = function(K, _) {
            if (this.i.terminate) K = Yx(K, 0);
            this.i.push(K, _)
        }, q.compression = 8, q
    }(), E9z = function() {
        function q(K) {
            this.onfile = K, this.k = [], this.o = {
                0: AG4
            }, this.p = tK6
        }
        return q.prototype.push = function(K, _) {
            var z = this;
            if (!this.onfile) z5(5);
            if (!this.p) z5(4);
            if (this.c > 0) {
                var Y = Math.min(this.c, K.length),
                    A = K.subarray(0, Y);
                if (this.c -= Y, this.d) this.d.push(A, !this.c);
                else this.k[0].push(A);
                if (K = K.subarray(Y), K.length) return this.push(K, _)
            } else {
                var O = 0,
                    w = 0,
                    $ = void 0,
                    j = void 0;
                if (!this.p.length) j = K;
                else if (!K.length) j = this.p;
                else j = new $_(this.p.length + K.length), j.set(this.p), j.set(K, this.p.length);
                var H = j.length,
                    J = this.c,
                    X = J && this.d,
                    M = function() {
                        var Z, G = DM(j, w);
                        if (G == 67324752) {
                            O = 1, $ = w, P.d = null, P.c = 0;
                            var f = Sk(j, w + 6),
                                v = Sk(j, w + 8),
                                V = f & 2048,
                                k = f & 8,
                                N = Sk(j, w + 26),
                                R = Sk(j, w + 28);
                            if (H > w + 30 + N + R) {
                                var h = [];
                                P.k.unshift(h), O = 2;
                                var C = DM(j, w + 18),
                                    x = DM(j, w + 22),
                                    B = iQ1(j.subarray(w + 30, w += 30 + N), !V);
                                if (C == 4294967295) Z = k ? [-2] : YG4(j, w), C = Z[0], x = Z[1];
                                else if (k) C = -1;
                                w += R, P.c = C;
                                var m, S = {
                                    name: B,
                                    compression: v,
                                    start: function() {
                                        if (!S.ondata) z5(5);
                                        if (!C) S.ondata(null, tK6, !0);
                                        else {
                                            var F = z.o[v];
                                            if (!F) S.ondata(z5(14, "unknown compression type " + v, 1), null, !1);
                                            m = C < 0 ? new F(B) : new F(B, C, x), m.ondata = function(n, l, z6) {
                                                S.ondata(n, l, z6)
                                            };
                                            for (var U = 0, g = h; U < g.length; U++) {
                                                var c = g[U];
                                                m.push(c, !1)
                                            }
                                            if (z.k[0] == h && z.c) z.d = m;
                                            else m.push(tK6, !0)
                                        }
                                    },
                                    terminate: function() {
                                        if (m && m.terminate) m.terminate()
                                    }
                                };
                                if (C >= 0) S.size = C, S.originalSize = x;
                                P.onfile(S)
                            }
                            return "break"
                        } else if (J) {
                            if (G == 134695760) return $ = w += 12 + (J == -2 && 8), O = 3, P.c = 0, "break";
                            else if (G == 33639248) return $ = w -= 4, O = 3, P.c = 0, "break"
                        }
                    },
                    P = this;
                for (; w < H - 4; ++w) {
                    var W = M();
                    if (W === "break") break
                }
                if (this.p = tK6, J < 0) {
                    var D = O ? j.subarray(0, $ - 12 - (J == -2 && 8) - (DM(j, $ - 16) == 134695760 && 4)) : j.subarray(0, w);
                    if (X) X.push(D, !!O);
                    else this.k[+(O == 2)].push(D)
                }
                if (O & 2) return this.push(j.subarray(w), _);
                this.p = j.subarray(w)
            }
            if (_) {
                if (this.c) z5(13);
                this.p = null
            }
        }, q.prototype.register = function(K) {
            this.o[K.compression] = K
        }, q
    }(), pS8 = typeof queueMicrotask == "function" ? queueMicrotask : typeof setTimeout == "function" ? setTimeout : function(q) {
        q()
    }
})
// @from(Ln 234548, Col 0)
function R9z(q) {
    if (MU(q)) return !1;
    let K = h9z(q);
    if (L9z(K)) return !1;
    return !0
}
// @from(Ln 234555, Col 0)
function S9z(q, K) {
    K.fileCount++;
    let _;
    if (K.fileCount > _56.MAX_FILE_COUNT) _ = `Archive contains too many files: ${K.fileCount} (max: ${_56.MAX_FILE_COUNT})`;
    if (!R9z(q.name)) _ = `Unsafe file path detected: "${q.name}". Path traversal or absolute paths are not allowed.`;
    let z = q.originalSize || 0;
    if (z > _56.MAX_FILE_SIZE) _ = `File "${q.name}" is too large: ${Math.round(z/1024/1024)}MB (max: ${Math.round(_56.MAX_FILE_SIZE/1024/1024)}MB)`;
    if (K.totalUncompressedSize += z, K.totalUncompressedSize > _56.MAX_TOTAL_SIZE) _ = `Archive total size is too large: ${Math.round(K.totalUncompressedSize/1024/1024)}MB (max: ${Math.round(_56.MAX_TOTAL_SIZE/1024/1024)}MB)`;
    let Y = K.totalUncompressedSize / K.compressedSize;
    if (Y > _56.MAX_COMPRESSION_RATIO) _ = `Suspicious compression ratio detected: ${Y.toFixed(1)}:1 (max: ${_56.MAX_COMPRESSION_RATIO}:1). This may be a zip bomb.`;
    return _ ? {
        isValid: !1,
        error: _
    } : {
        isValid: !0
    }
}
// @from(Ln 234572, Col 0)
async function kL6(q) {
    let {
        unzipSync: K
    } = await Promise.resolve().then(() => (W68(), sQ1)), z = {
        fileCount: 0,
        totalUncompressedSize: 0,
        compressedSize: q.length,
        errors: []
    }, Y = K(new Uint8Array(q), {
        filter: (A) => {
            let O = S9z(A, z);
            if (!O.isValid) throw Error(O.error);
            return !0
        }
    });
    return E(`Zip extraction completed: ${z.fileCount} files, ${Math.round(z.totalUncompressedSize/1024)}KB uncompressed`), Y
}
// @from(Ln 234590, Col 0)
function NL6(q) {
    let K = Buffer.from(q.buffer, q.byteOffset, q.byteLength),
        _ = {},
        z = Math.max(0, K.length - 22 - 65535),
        Y = -1;
    for (let w = K.length - 22; w >= z; w--)
        if (K.readUInt32LE(w) === 101010256) {
            Y = w;
            break
        } if (Y < 0) return _;
    let A = K.readUInt16LE(Y + 10),
        O = K.readUInt32LE(Y + 16);
    for (let w = 0; w < A; w++) {
        if (O + 46 > K.length || K.readUInt32LE(O) !== 33639248) break;
        let $ = K.readUInt16LE(O + 4),
            j = K.readUInt16LE(O + 28),
            H = K.readUInt16LE(O + 30),
            J = K.readUInt16LE(O + 32),
            X = K.readUInt32LE(O + 38),
            M = K.toString("utf8", O + 46, O + 46 + j);
        if ($ >> 8 === 3) {
            let P = X >>> 16 & 65535;
            if (P) _[M] = P
        }
        O += 46 + j + H + J
    }
    return _
}
// @from(Ln 234618, Col 4)
_56
// @from(Ln 234619, Col 4)
gS8 = L(() => {
    K8();
    m8();
    Yq();
    b9();
    _56 = {
        MAX_FILE_SIZE: 536870912,
        MAX_TOTAL_SIZE: 1073741824,
        MAX_FILE_COUNT: 1e5,
        MAX_COMPRESSION_RATIO: 50,
        MIN_COMPRESSION_RATIO: 0.5
    }
})
// @from(Ln 234651, Col 0)
function wx() {
    return S6(process.env.CLAUDE_CODE_PLUGIN_USE_ZIP_CACHE)
}
// @from(Ln 234655, Col 0)
function D68() {
    if (!wx()) return;
    let q = process.env.CLAUDE_CODE_PLUGIN_CACHE_DIR;
    return q ? kK6(q) : void 0
}
// @from(Ln 234661, Col 0)
function qd1() {
    let q = D68();
    if (!q) throw Error("Plugin zip cache is not enabled");
    return Wc(q, "known_marketplaces.json")
}
// @from(Ln 234667, Col 0)
function $G4() {
    let q = D68();
    if (!q) throw Error("Plugin zip cache is not enabled");
    return Wc(q, "marketplaces")
}
// @from(Ln 234673, Col 0)
function jG4() {
    let q = D68();
    if (!q) throw Error("Plugin zip cache is not enabled");
    return Wc(q, "plugins")
}
// @from(Ln 234678, Col 0)
async function Kd1() {
    if ($H6) return $H6;
    if (!US8) US8 = (async () => {
        let q = OG4(8).toString("hex"),
            K = Wc(z2(), `claude-plugin-session-${q}`);
        return await V8().mkdir(K), $H6 = K, E(`Created session plugin cache at ${K}`), K
    })();
    return US8
}
// @from(Ln 234687, Col 0)
async function HG4() {
    if (!$H6) return;
    try {
        await eQ1($H6, {
            recursive: !0,
            force: !0
        }), E(`Cleaned up session plugin cache at ${$H6}`)
    } catch (q) {
        E(`Failed to clean up session plugin cache: ${q}`)
    } finally {
        $H6 = null, US8 = null
    }
}
// @from(Ln 234700, Col 0)
async function QS8(q, K) {
    let _ = wG4(q);
    await V8().mkdir(_);
    let z = `.${B9z(q)}.tmp.${OG4(4).toString("hex")}`,
        Y = Wc(_, z);
    try {
        if (typeof K === "string") await tQ1(Y, K, {
            encoding: "utf-8"
        });
        else await tQ1(Y, K);
        await u9z(Y, q)
    } catch (A) {
        try {
            await eQ1(Y, {
                force: !0
            })
        } catch {}
        throw A
    }
}
// @from(Ln 234720, Col 0)
async function p9z(q) {
    let K = {};
    await JG4(q, "", K, new Set);
    let {
        zipSync: z
    } = await Promise.resolve().then(() => (W68(), sQ1)), Y = z(K, {
        level: 6
    });
    return E(`Created ZIP from ${q}: ${Object.keys(K).length} files, ${Y.length} bytes`), Y
}
// @from(Ln 234730, Col 0)
async function JG4(q, K, _, z) {
    let Y = K ? Wc(q, K) : q,
        A;
    try {
        A = await I9z(Y)
    } catch {
        return
    }
    try {
        let O = await m9z(Y, {
            bigint: !0
        });
        if (O.dev !== 0n || O.ino !== 0n) {
            let w = `${O.dev}:${O.ino}`;
            if (z.has(w)) {
                E(`Skipping symlink cycle at ${Y}`);
                return
            }
            z.add(w)
        }
    } catch {
        return
    }
    for (let O of A) {
        if (O === ".git") continue;
        let w = Wc(Y, O),
            $ = K ? `${K}/${O}` : O,
            j;
        try {
            j = await b9z(w)
        } catch {
            continue
        }
        if (j.isSymbolicLink()) continue;
        if (j.isDirectory()) await JG4(q, $, _, z);
        else if (j.isFile()) try {
            let H = await x9z(w);
            _[$] = [new Uint8Array(H), {
                os: 3,
                attrs: (j.mode & 65535) << 16
            }]
        } catch (H) {
            E(`Failed to read file for zip: ${$}: ${H}`)
        }
    }
}
// @from(Ln 234776, Col 0)
async function _d1(q, K) {
    let _ = await V8().readFileBytes(q),
        z = await kL6(_),
        Y = NL6(_);
    await V8().mkdir(K);
    for (let [A, O] of Object.entries(z)) {
        if (A.endsWith("/")) {
            await V8().mkdir(Wc(K, A));
            continue
        }
        let w = Wc(K, A);
        await V8().mkdir(wG4(w)), await tQ1(w, O);
        let $ = Y[A];
        if ($ && $ & 73) await C9z(w, $ & 511).catch(() => {})
    }
    E(`Extracted ZIP to ${K}: ${Object.keys(z).length} entries`)
}
// @from(Ln 234793, Col 0)
async function dS8(q, K) {
    let _ = await p9z(q);
    await QS8(K, _), await eQ1(q, {
        recursive: !0,
        force: !0
    })
}
// @from(Ln 234801, Col 0)
function XG4(q) {
    let K = q.replace(/[^a-zA-Z0-9\-_]/g, "-");
    return Wc("marketplaces", `${K}.json`)
}
// @from(Ln 234806, Col 0)
function MG4(q) {
    return ["github", "git", "url", "settings"].includes(q.source)
}
// @from(Ln 234809, Col 4)
$H6 = null
// @from(Ln 234810, Col 4)
US8 = null
// @from(Ln 234811, Col 4)
EL6 = L(() => {
    K8();
    gS8();
    Q8();
    Yq();
    Gy6();
    cW()
})
// @from(Ln 234833, Col 0)
function PG4() {
    return new Date().toISOString()
}
// @from(Ln 234837, Col 0)
function cS8(q, K) {
    let _ = Ad1(q, K),
        z = Ad1(q) + Od1;
    if (!_.startsWith(z) && _ !== Ad1(q)) throw Error(`Path traversal detected: "${K}" would escape the base directory`);
    return _
}
// @from(Ln 234843, Col 0)
async function Z68(q, K, _ = "user", z, Y, A) {
    let O = typeof K.source === "string" && Y ? Y : K.source,
        w = A && typeof O === "object" && (O.source === "github" || O.source === "url" || O.source === "git-subdir") ? {
            ...O,
            ref: A.ref,
            sha: A.sha
        } : O,
        $ = await f68(w, {
            manifest: K
        }),
        j = Y || $.path,
        H = A?.sha ?? $.gitCommitSha ?? await lS8(j),
        J = PG4(),
        X = await us(q, K.source, $.manifest, j, K.version, A?.sha ?? $.gitCommitSha),
        M = A && ($.manifest.version || K.version) ? `${X}-${A.sha.substring(0,12)}` : X,
        P = Sp(q, M),
        W = $.path;
    if ($.path !== P) {
        await V8().mkdir(Yd1(P)), await g9z(P, {
            recursive: !0,
            force: !0
        });
        let Z = $.path.endsWith(Od1) ? $.path : $.path + Od1;
        if (P.startsWith(Z)) {
            let f = U9z(Yd1($.path), `.claude-plugin-temp-${Date.now()}-${F9z(4).toString("hex")}`);
            await zd1($.path, f), await V8().mkdir(Yd1(P)), await zd1(f, P)
        } else await zd1($.path, P);
        W = P
    }
    let D = await VS8(W);
    if (D.error) E(`Plugin dependency install warning for ${q}: ${D.error}`, {
        level: "warn"
    });
    if (wx()) {
        let Z = yL6(q, M);
        await dS8(W, Z), W = Z
    }
    if (A && $.manifest.version && A.version !== $.manifest.version) E(`Tag ${A.ref} resolved to a commit whose plugin.json says version ${$.manifest.version} — using tag-derived ${A.version} for constraint checks`, {
        level: "warn"
    });
    return jd1(q, {
        version: M,
        installedAt: J,
        lastUpdated: J,
        installPath: W,
        gitCommitSha: H,
        ...A && {
            resolvedVersion: A.version
        }
    }, _, z), {
        path: W,
        depConstraints: $.depConstraints,
        dependencies: $.manifest.dependencies
    }
}
// @from(Ln 234899, Col 0)
function WG4(q, K = "user", _) {
    let z = PG4();
    jd1(q.pluginId, {
        version: q.version || "unknown",
        installedAt: z,
        lastUpdated: z,
        installPath: q.installPath
    }, K, _)
}
// @from(Ln 234909, Col 0)
function wd1(q) {
    switch (q.reason) {
        case "cycle":
            return `Dependency cycle: ${q.chain.join(" → ")}`;
        case "cross-marketplace": {
            let K = Z4(q.dependency).marketplace,
                _ = K ? `marketplace "${K}"` : "a different marketplace",
                z = K ? ` Add "${K}" to allowCrossMarketplaceDependenciesOn in the ROOT marketplace's marketplace.json (the marketplace of the plugin you're installing — only its allowlist applies; no transitive trust).` : "";
            return `Dependency "${q.dependency}" (required by ${q.requiredBy}) is in ${_}, which is not in the allowlist — cross-marketplace dependencies are blocked by default. Install it manually first.${z}`
        }
        case "not-found": {
            let {
                marketplace: K
            } = Z4(q.missing);
            return K ? `Dependency "${q.missing}" (required by ${q.requiredBy}) not found. Is the "${K}" marketplace added?` : `Dependency "${q.missing}" (required by ${q.requiredBy}) not found in any configured marketplace`
        }
    }
}
// @from(Ln 234927, Col 0)
async function Q9z(q) {
    let K = [];
    for (let _ of q.rootManifestDeps ?? []) {
        let z = Hc(_, q.pluginId);
        if (q.closureSet.has(z) || q.alreadyEnabled.has(z)) continue;
        let Y = Z4(z).marketplace;
        if (Y !== q.rootMarketplace && !(Y && q.allowedCrossMarketplaces.has(Y))) {
            E(`${q.pluginId} plugin.json declares dependency "${z}" in a different marketplace; not auto-installing — install it manually`, {
                level: "warn"
            });
            continue
        }
        if (Rk(z)) return {
            ok: !1,
            blockedDependency: z
        };
        let A = await mf(z);
        if (!A) {
            E(`${q.pluginId} plugin.json declares dependency "${z}" not found in any known marketplace; not auto-installing`, {
                level: "warn"
            });
            continue
        }
        q.depInfo.set(z, A), K.push(z)
    }
    return {
        ok: !0,
        ids: K
    }
}
// @from(Ln 234957, Col 0)
async function $d1({
    pluginId: q,
    entry: K,
    scope: _,
    marketplaceInstallLocation: z,
    trigger: Y
}) {
    let A = jc(_);
    if (Rk(q)) return {
        ok: !1,
        reason: "blocked-by-policy",
        pluginName: K.name
    };
    let O = new Map;
    if (uQ6(K.source) && !z) return {
        ok: !1,
        reason: "local-source-no-location",
        pluginName: K.name
    };
    if (z) O.set(q, {
        entry: K,
        marketplaceInstallLocation: z
    });
    let w = Z4(q).marketplace,
        $ = new Set((w ? (await G68(w))?.allowCrossMarketplaceDependenciesOn : void 0) ?? []),
        j = _ !== "user" ? b8() : void 0,
        H = mR().plugins,
        J = new Set;
    for (let N of Jf4(A))
        if (H[N]?.some((R) => R.scope === _ && R.projectPath === j)) J.add(N);
    let X = await jf4(q, async (N) => {
        if (O.has(N)) return O.get(N).entry;
        if (N === q) return K;
        let R = await mf(N);
        if (R) O.set(N, R);
        return R?.entry ?? null
    }, J, $);
    if (!X.ok) return {
        ok: !1,
        reason: "resolution-failed",
        resolution: X
    };
    for (let N of X.closure)
        if (N !== q && Rk(N)) return {
            ok: !1,
            reason: "dependency-blocked-by-policy",
            pluginName: K.name,
            blockedDependency: N
        };
    let M = {
            ...E1(A)?.enabledPlugins ?? {}
        },
        P = {};
    for (let N of X.closure) P[N] = !0;
    let {
        error: W
    } = P7(A, {
        enabledPlugins: {
            ...M,
            ...P
        }
    });
    if (W) return {
        ok: !1,
        reason: "settings-write-failed",
        message: W.message
    };

    function D(N) {
        return uQ6(N.entry.source) ? cS8(N.marketplaceInstallLocation, N.entry.source) : void 0
    }
    let Z = new Set,
        G = X.closure;

    function f() {
        let N = {};
        for (let h of G) N[h] = h === q && Z.has(h) ? !0 : M[h];
        let {
            error: R
        } = P7(A, {
            enabledPlugins: N
        });
        if (R) j6(`Failed to roll back enabledPlugins after install failure for ${q}: ${R.message}. Retry may skip un-cached deps; manually disable then reinstall to recover.`)
    }
    let v;
    try {
        if (!O.has(q)) {
            let S = (await mf(q))?.marketplaceInstallLocation;
            if (S) O.set(q, {
                entry: K,
                marketplaceInstallLocation: S
            })
        }
        let N = new Set(G),
            R = new Map,
            h = await Gj();
        for (let S of h.enabled.concat(h.disabled)) {
            if (!S.depConstraints) continue;
            if (N.has(S.source)) continue;
            for (let [F, U] of S.depConstraints) {
                if (U.version === void 0) continue;
                let g = Hc(F, S.source),
                    c = R.get(g);
                if (c) c.push(U.version);
                else R.set(g, [U.version])
            }
        }
        let C = new Map,
            x = new Map;
        async function B(S) {
            let F = O.get(S);
            if (!F) return {
                ok: !0,
                dependencies: void 0
            };
            let U = [...C.get(S) ?? [], ...R.get(S) ?? []],
                g;
            if (U.length > 0) {
                let n = Of4(U);
                if (!n.ok) return {
                    ok: !1,
                    reason: "range-conflict",
                    dep: S,
                    ranges: U,
                    why: n.reason
                };
                if (n.range !== "*") {
                    let l = Ef4(F.entry.source);
                    if (l !== null) {
                        let z6 = await yf4(l, F.entry.name, n.range, x);
                        if (z6 === null) return {
                            ok: !1,
                            reason: "no-matching-tag",
                            dep: S,
                            range: n.range
                        };
                        g = z6
                    }
                }
            }
            let c = await Z68(S, F.entry, _, j, D(F), g);
            Z.add(S);
            for (let [n, l] of c.depConstraints ?? []) {
                if (l.version === void 0) continue;
                let z6 = Hc(n, S),
                    A6 = C.get(z6);
                if (A6) A6.push(l.version);
                else C.set(z6, [l.version])
            }
            return {
                ok: !0,
                dependencies: c.dependencies ?? []
            }
        }
        for (let S = X.closure.length - 1; S >= 0; S--) {
            let F = X.closure[S];
            if (F === void 0) continue;
            let U = await B(F);
            if (!U.ok) return f(), U;
            if (F === q) v = U.dependencies
        }
        let m = await Q9z({
            rootManifestDeps: v,
            pluginId: q,
            closureSet: N,
            alreadyEnabled: J,
            rootMarketplace: w,
            allowedCrossMarketplaces: $,
            depInfo: O
        });
        if (!m.ok) return f(), {
            ok: !1,
            reason: "dependency-blocked-by-policy",
            pluginName: K.name,
            blockedDependency: m.blockedDependency
        };
        if (m.ids.length > 0) {
            for (let U of m.ids) N.add(U), G.push(U);
            let S = {};
            for (let U of m.ids) S[U] = !0;
            let {
                error: F
            } = P7(A, {
                enabledPlugins: {
                    ...E1(A)?.enabledPlugins ?? {},
                    ...S
                }
            });
            if (F) return f(), {
                ok: !1,
                reason: "settings-write-failed",
                message: F.message
            };
            for (let U of m.ids) {
                let g = await B(U);
                if (!g.ok) return f(), g
            }
        }
    } catch (N) {
        throw f(), N
    }
    if (v !== void 0) {
        let N = new Set(v.map((R) => Hc(R, q)));
        for (let R of K.dependencies ?? []) {
            let h = Hc(R, q);
            if (!N.has(h)) E(`Marketplace entry for ${q} lists dependency "${R}" not present in plugin.json — catalog may be stale`)
        }
    }
    YO();
    let V = Z4(q).marketplace;
    Xz("plugin_installed", {
        "plugin.name": K.name,
        ...K.version && {
            "plugin.version": K.version
        },
        ...V && {
            "marketplace.name": V
        },
        "marketplace.is_official": String(V ? eI(V) : !1),
        ...Y && {
            "install.trigger": Y
        }
    });
    let k = Xf4(X.closure.filter((N) => N !== q));
    return {
        ok: !0,
        closure: X.closure,
        depNote: k
    }
}
// @from(Ln 235187, Col 0)
async function z56({
    pluginId: q,
    entry: K,
    marketplaceName: _,
    scope: z = "user",
    trigger: Y = "user"
}) {
    try {
        let O = (await mf(q))?.marketplaceInstallLocation,
            w = await $d1({
                pluginId: q,
                entry: K,
                scope: z,
                marketplaceInstallLocation: O,
                trigger: "ui"
            });
        if (!w.ok) switch (w.reason) {
            case "local-source-no-location":
                return {
                    success: !1, error: `Cannot install local plugin "${w.pluginName}" without marketplace install location`
                };
            case "settings-write-failed":
                return {
                    success: !1, error: `Failed to update settings: ${w.message}`
                };
            case "resolution-failed":
                return {
                    success: !1, error: wd1(w.resolution)
                };
            case "blocked-by-policy":
                return {
                    success: !1, error: `Plugin "${w.pluginName}" is blocked by your organization's policy and cannot be installed`
                };
            case "dependency-blocked-by-policy":
                return {
                    success: !1, error: `Cannot install "${w.pluginName}": dependency "${w.blockedDependency}" is blocked by your organization's policy`
                };
            case "range-conflict": {
                let $ = w.dep === q ? "Plugin" : "Dependency";
                return {
                    success: !1,
                    error: fS8($, w.dep, w.ranges, w.why)
                }
            }
            case "no-matching-tag": {
                let $ = w.dep === q ? "Plugin" : "Dependency";
                return {
                    success: !1,
                    error: GS8($, w.dep, w.range)
                }
            }
        }
        return d("tengu_plugin_installed", {
            _PROTO_plugin_name: K.name,
            _PROTO_marketplace_name: _,
            plugin_id: eI(_) ? q : "third-party",
            trigger: Y,
            install_source: Y === "hint" ? "ui-suggestion" : "ui-discover",
            ...xR(K.name, _, Xy()),
            ...K.version && {
                version: K.version
            }
        }), {
            success: !0,
            message: `✓ Installed ${K.name}${w.depNote}. Run /reload-plugins to activate.`,
            depNote: w.depNote
        }
    } catch (A) {
        let O = A instanceof Error ? A.message : String(A);
        return j6(r1(A)), {
            success: !1,
            error: `Failed to install: ${O}`
        }
    }
}
// @from(Ln 235262, Col 4)
Y56 = L(() => {
    C8();
    n7();
    K8();
    m8();
    Yq();
    U8();
    a1();
    uf();
    sK6();
    uR();
    vS8();
    yD();
    iK6();
    m$();
    NQ1();
    aW();
    vH();
    AH6();
    yS8();
    Hv();
    EL6()
})
// @from(Ln 235285, Col 4)
DG4
// @from(Ln 235286, Col 4)
ZG4 = L(() => {
    DG4 = ["agent", "subagentStatusLine"]
})
// @from(Ln 235310, Col 0)
function RL6() {
    return uz(gP(), "cache")
}
// @from(Ln 235314, Col 0)
function Xd1(q, K, _) {
    let {
        name: z,
        marketplace: Y
    } = Z4(K), A = (Y || "unknown").replace(/[^a-zA-Z0-9\-_]/g, "-"), O = (z || K).replace(/[^a-zA-Z0-9\-_]/g, "-"), w = _.replace(/[^a-zA-Z0-9\-_.]/g, "-");
    return uz(q, "cache", A, O, w)
}
// @from(Ln 235322, Col 0)
function Sp(q, K) {
    return Xd1(gP(), q, K)
}
// @from(Ln 235326, Col 0)
function yL6(q, K) {
    return `${Sp(q,K)}.zip`
}
// @from(Ln 235329, Col 0)
async function kG4(q, K) {
    for (let _ of nK6()) {
        let z = Xd1(_, q, K);
        try {
            if ((await hL6(z)).length > 0) return z
        } catch {}
    }
    return null
}
// @from(Ln 235338, Col 0)
async function i9z(q) {
    for (let K of nK6()) {
        let _ = Jd1(Xd1(K, q, "_"));
        try {
            let z = await hL6(_);
            if (z.length !== 1) continue;
            let Y = uz(_, z[0]);
            if ((await hL6(Y)).length > 0) return Y
        } catch {}
    }
    return null
}
// @from(Ln 235350, Col 0)
async function V68(q, K) {
    await V8().mkdir(K);
    let _ = LL6(q),
        z = LL6(K),
        Y = z.startsWith(_ + v68) ? nS8(_, z).split(v68)[0] : void 0,
        A = await hL6(q, {
            withFileTypes: !0
        });
    for (let O of A) {
        if (Y !== void 0 && O.name === Y) continue;
        let w = uz(q, O.name),
            $ = uz(K, O.name);
        if (O.isDirectory()) await V68(w, $);
        else if (O.isFile()) await d9z(w, $);
        else if (O.isSymbolicLink()) {
            let j;
            try {
                j = await c9z(w)
            } catch (M) {
                if (Q1(M) !== "EINVAL") E(`copyDir: readlink failed for ${w}: ${b6(M)}`, {
                    level: "warn"
                });
                continue
            }
            let H;
            try {
                H = await iS8(w)
            } catch {
                await Hd1(j, $);
                continue
            }
            let J;
            try {
                J = await iS8(q)
            } catch {
                J = q
            }
            let X = J.endsWith(v68) ? J : J + v68;
            if (H.startsWith(X) || H === J) {
                let M = nS8(J, H),
                    P = uz(K, M),
                    W = nS8(Jd1($), P);
                await Hd1(W, $)
            } else await Hd1(H, $)
        }
    }
}
// @from(Ln 235397, Col 0)
async function rS8(q, K, _, z, Y) {
    let A = wx(),
        O = Sp(K, _),
        w = yL6(K, _);
    if (A) {
        if (await a3(w)) return E(`Plugin ${K} version ${_} already cached at ${w}`), w
    } else if (await a3(O)) {
        if ((await hL6(O)).length > 0) return E(`Plugin ${K} version ${_} already cached at ${O}`), O;
        E(`Removing empty cache directory for ${K} at ${O}`), await l9z(O)
    }
    let $ = await kG4(K, _);
    if ($) return E(`Using seed cache for ${K}@${_} at ${$}`), $;
    if (await V8().mkdir(Jd1(O)), z && typeof z.source === "string" && Y) {
        let X = cS8(Y, z.source);
        E(`Copying source directory ${z.source} for plugin ${K}`);
        try {
            await V68(X, O)
        } catch (M) {
            if (t1(M) && mw8(M) === X) throw Error(`Plugin source directory not found: ${X} (from entry.source: ${z.source})`);
            throw M
        }
    } else E(`Copying plugin ${K} to versioned cache (fallback to full copy)`), await V68(q, O);
    let j = uz(O, ".git");
    if (await jH6(j, {
            recursive: !0,
            force: !0
        }), (await hL6(O)).length === 0) throw Error(`Failed to copy plugin ${K} to versioned cache: destination is empty after copy`);
    let J = await VS8(O);
    if (J.error) E(`Plugin dependency install warning for ${K}: ${J.error}`, {
        level: "warn"
    });
    if (A) return await dS8(O, w), E(`Successfully cached plugin ${K} as ZIP at ${w}`), w;
    return E(`Successfully cached plugin ${K} at ${O}`), O
}
// @from(Ln 235432, Col 0)
function NG4(q) {
    try {
        let K = new URL(q);
        if (!["https:", "http:", "file:"].includes(K.protocol)) {
            if (!/^git@[a-zA-Z0-9.-]+:/.test(q)) throw Error(`Invalid git URL protocol: ${K.protocol}. Only HTTPS, HTTP, file:// and SSH (git@) URLs are supported.`)
        }
        return q
    } catch {
        if (/^git@[a-zA-Z0-9.-]+:/.test(q)) return q;
        throw Error(`Invalid git URL: ${q}`)
    }
}
// @from(Ln 235444, Col 0)
async function r9z(q, K, _ = {}) {
    let z = uz(gP(), "npm-cache");
    await V8().mkdir(z);
    let Y = _.version ? `${q}@${_.version}` : q,
        A = uz(z, "node_modules", q);
    if (!await a3(A)) {
        E(`Installing npm package ${Y} to cache`);
        let w = ["install", Y, "--prefix", z];
        if (_.registry) w.push("--registry", _.registry);
        let $ = await w1("npm", w, {
            useCwd: !1
        });
        if ($.code !== 0) throw Error(`Failed to install npm package: ${$.stderr}`)
    }
    await V68(A, K), E(`Copied npm package ${q} from cache to ${K}`)
}
// @from(Ln 235460, Col 0)
async function o9z(q, K, _, z) {
    let Y = [...hp, "clone", "--depth", "1", "--recurse-submodules", "--shallow-submodules"];
    if (_) Y.push("--branch", _);
    if (z) Y.push("--no-checkout");
    Y.push(q, K);
    let A = {
            ...process.env,
            ...IR
        },
        O = performance.now(),
        w = await w1(D7(), Y, {
            useCwd: !0,
            env: A,
            stdin: "ignore"
        });
    if (w.code !== 0) throw ED("plugin_clone", q, "failure", performance.now() - O, Kx(w.stderr)), Error(`Failed to clone repository: ${w.stderr}`);
    if (z) {
        if ((await M7(D7(), [...hp, "fetch", "--depth", "1", "origin", z], {
                cwd: K,
                env: A,
                stdin: "ignore"
            })).code !== 0) {
            E(`Shallow fetch of SHA ${z} failed, falling back to unshallow fetch`);
            let H = await M7(D7(), [...hp, "fetch", "--unshallow"], {
                cwd: K,
                env: A,
                stdin: "ignore"
            });
            if (H.code !== 0) throw ED("plugin_clone", q, "failure", performance.now() - O, Kx(H.stderr)), Error(`Failed to fetch commit ${z}: ${H.stderr}`)
        }
        let j = await M7(D7(), ["checkout", z], {
            cwd: K,
            env: A,
            stdin: "ignore"
        });
        if (j.code !== 0) throw ED("plugin_clone", q, "failure", performance.now() - O, Kx(j.stderr)), Error(`Failed to checkout commit ${z}: ${j.stderr}`)
    }
    ED("plugin_clone", q, "success", performance.now() - O)
}
// @from(Ln 235499, Col 0)
async function EG4(q, K, _, z) {
    let Y = NG4(q);
    await o9z(Y, K, _, z);
    let A = _ ? ` (ref: ${_})` : "";
    E(`Cloned repository from ${Y}${A} to ${K}`)
}
// @from(Ln 235505, Col 0)
async function a9z(q, K, _, z) {
    if (!/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/.test(q)) throw Error(`Invalid GitHub repository format: ${q}. Expected format: owner/repo`);
    let Y = S6(process.env.CLAUDE_CODE_REMOTE) ? `https://github.com/${q}.git` : `git@github.com:${q}.git`;
    return EG4(Y, K, _, z)
}
// @from(Ln 235511, Col 0)
function s9z(q) {
    if (/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/.test(q)) return S6(process.env.CLAUDE_CODE_REMOTE) ? `https://github.com/${q}.git` : `git@github.com:${q}.git`;
    return NG4(q)
}
// @from(Ln 235515, Col 0)
async function t9z(q, K, _, z, Y) {
    if (!await KH6()) throw Error("git-subdir plugin source requires git to be installed and on PATH. Install git (version 2.25 or later for sparse-checkout cone mode) and try again.");
    let A = s9z(q),
        O = `${K}.clone`,
        w = [...hp, "clone", "--depth", "1", "--filter=tree:0", "--no-checkout"];
    if (z) w.push("--branch", z);
    w.push(A, O);
    let $ = {
            ...process.env,
            ...IR
        },
        j = await w1(D7(), w, {
            useCwd: !0,
            env: $,
            stdin: "ignore"
        });
    if (j.code !== 0) throw Error(`Failed to clone repository for git-subdir source: ${j.stderr}`);
    try {
        let H = await M7(D7(), ["sparse-checkout", "set", "--cone", "--", _], {
            cwd: O,
            env: $,
            stdin: "ignore"
        });
        if (H.code !== 0) throw Error(`git sparse-checkout set failed (git >= 2.25 required for cone mode): ${H.stderr}`);
        let J;
        if (Y) {
            if ((await M7(D7(), [...hp, "fetch", "--depth", "1", "origin", Y], {
                    cwd: O,
                    env: $,
                    stdin: "ignore"
                })).code !== 0) {
                E(`Shallow fetch of SHA ${Y} failed for git-subdir, falling back to unshallow fetch`);
                let Z = await M7(D7(), [...hp, "fetch", "--unshallow"], {
                    cwd: O,
                    env: $,
                    stdin: "ignore"
                });
                if (Z.code !== 0) throw Error(`Failed to fetch commit ${Y}: ${Z.stderr}`)
            }
            let D = await M7(D7(), [...hp, "checkout", Y], {
                cwd: O,
                env: $,
                stdin: "ignore"
            });
            if (D.code !== 0) throw Error(`Failed to checkout commit ${Y}: ${D.stderr}`);
            J = Y
        } else {
            let [W, D] = await Promise.all([M7(D7(), [...hp, "checkout", "HEAD"], {
                cwd: O,
                env: $,
                stdin: "ignore"
            }), M7(D7(), ["rev-parse", "HEAD"], {
                cwd: O,
                env: $,
                stdin: "ignore"
            })]);
            if (W.code !== 0) throw Error(`git checkout after sparse-checkout failed: ${W.stderr}`);
            if (D.code === 0) J = D.stdout.trim()
        }
        let X = cS8(O, _);
        try {
            await TG4(X, K)
        } catch (W) {
            if (t1(W)) throw Error(`Subdirectory '${_}' not found in repository ${A}${z?` (ref: ${z})`:""}. Check that the path is correct and exists at the specified ref/sha.`);
            throw W
        }
        let M = z ? ` ref=${z}` : "",
            P = J ? ` sha=${J}` : "";
        return E(`Extracted subdir ${_} from ${A}${M}${P} to ${K}`), J
    } finally {
        await jH6(O, {
            recursive: !0,
            force: !0
        })
    }
}
// @from(Ln 235591, Col 0)
async function e9z(q, K) {
    if (!await a3(q)) throw Error(`Source path does not exist: ${q}`);
    await V68(q, K);
    let _ = uz(K, ".git");
    await jH6(_, {
        recursive: !0,
        force: !0
    })
}
// @from(Ln 235601, Col 0)
function q_z(q) {
    let K = Date.now(),
        _ = Math.random().toString(36).substring(2, 8),
        z;
    if (typeof q === "string") z = "local";
    else switch (q.source) {
        case "npm":
            z = "npm";
            break;
        case "pip":
            z = "pip";
            break;
        case "github":
            z = "github";
            break;
        case "url":
            z = "git";
            break;
        case "git-subdir":
            z = "subdir";
            break;
        default:
            z = "unknown"
    }
    return `temp_${z}_${K}_${_}`
}
// @from(Ln 235627, Col 0)
async function f68(q, K) {
    let _ = RL6();
    await V8().mkdir(_);
    let z = q_z(q),
        Y = uz(_, z),
        A = !1,
        O;
    try {
        if (E(`Caching plugin from source: ${I6(q)} to temporary path ${Y}`), A = !0, typeof q === "string") await e9z(q, Y);
        else switch (q.source) {
            case "npm":
                await r9z(q.package, Y, {
                    registry: q.registry,
                    version: q.version
                });
                break;
            case "github":
                await a9z(q.repo, Y, q.ref, q.sha);
                break;
            case "url":
                await EG4(q.url, Y, q.ref, q.sha);
                break;
            case "git-subdir":
                O = await t9z(q.url, Y, q.path, q.ref, q.sha);
                break;
            case "pip":
                throw Error("Python package plugins are not yet supported");
            default:
                throw Error("Unsupported plugin source type")
        }
    } catch (P) {
        if (A && await a3(Y)) {
            E(`Cleaning up failed installation at ${Y}`);
            try {
                await jH6(Y, {
                    recursive: !0,
                    force: !0
                })
            } catch (W) {
                E(`Failed to clean up installation: ${W}`, {
                    level: "error"
                })
            }
        }
        throw P
    }
    let w = typeof q === "string" ? q : q.source,
        {
            manifest: $,
            manifestPath: j,
            depConstraints: H
        } = await k68(Y, z, w, [uz(Y, "plugin.json")]),
        J = j !== null ? $ : K?.manifest || {
            name: z,
            description: `Plugin cached from ${w}`
        },
        X = J.name.replace(/[^a-zA-Z0-9-_]/g, "-"),
        M = uz(_, X);
    if (await a3(M)) E(`Removing old cached version at ${M}`), await jH6(M, {
        recursive: !0,
        force: !0
    });
    return await TG4(Y, M), E(`Successfully cached plugin ${J.name} to ${M}`), {
        path: M,
        manifest: J,
        ...O && {
            gitCommitSha: O
        },
        ...H && {
            depConstraints: H
        }
    }
}
// @from(Ln 235700, Col 0)
async function k68(q, K, _, z = []) {
    let Y = [uz(q, ".claude-plugin", "plugin.json"), ...z];
    for (let A of Y) {
        let O;
        try {
            O = await oS8(A, {
                encoding: "utf-8"
            })
        } catch (H) {
            if (t1(H) || Q1(H) === "ENOTDIR") continue;
            let J = b6(H);
            throw E(`Plugin ${K}: failed to read manifest file at ${A}. Read error: ${J}`, {
                level: "error"
            }), Error(`Plugin ${K}: failed to read manifest file at ${A}.

Read error: ${J}`)
        }
        let w;
        try {
            w = n8(O)
        } catch (H) {
            let J = b6(H);
            throw E(`Plugin ${K} has a corrupt manifest file at ${A}. Parse error: ${J}`, {
                level: "error"
            }), Error(`Plugin ${K} has a corrupt manifest file at ${A}.

JSON parse error: ${J}`)
        }
        let $ = IQ6().safeParse(w);
        if ($.success) return {
            manifest: $.data,
            manifestPath: A,
            depConstraints: Af4(w)
        };
        let j = $.error.issues.map((H) => H.path.length > 0 ? `${H.path.join(".")}: ${H.message}` : H.message).join(", ");
        throw E(`Plugin ${K} has an invalid manifest file at ${A}. Validation errors: ${j}`, {
            level: "error"
        }), Error(`Plugin ${K} has an invalid manifest file at ${A}.

Validation errors: ${j}`)
    }
    return {
        manifest: {
            name: K,
            description: `Plugin from ${_}`
        },
        manifestPath: null,
        depConstraints: void 0
    }
}
// @from(Ln 235750, Col 0)
async function fG4(q, K) {
    if (!await a3(q)) throw Error(`Hooks file not found at ${q} for plugin ${K}. If the manifest declares hooks, the file must exist.`);
    let _ = await oS8(q, {
            encoding: "utf-8"
        }),
        z = n8(_);
    return WX8().parse(z).hooks
}
// @from(Ln 235758, Col 0)
async function K_z(q, K, _, z) {
    let Y;
    if (K.monitors === void 0) {
        let A = uz(q, "monitors", "monitors.json");
        if (await a3(A)) Y = A
    } else if (typeof K.monitors === "string") {
        let A = T68(q, K.monitors);
        if (A === null) {
            z.push({
                type: "path-traversal",
                source: _,
                plugin: K.name,
                path: K.monitors,
                component: "monitors"
            });
            return
        }
        Y = A
    } else return K.monitors;
    if (Y === void 0) return;
    try {
        let A = await oS8(Y, {
            encoding: "utf-8"
        });
        return XO1().parse(n8(A))
    } catch (A) {
        let O = b6(A);
        E(`Failed to load monitors for ${K.name} from ${Y}: ${O}`, {
            level: "error"
        }), z.push({
            type: "component-load-failed",
            source: _,
            plugin: K.name,
            component: "monitors",
            path: Y,
            reason: O
        });
        return
    }
}
// @from(Ln 235799, Col 0)
function T68(q, K) {
    let _ = LL6(q),
        z = LL6(_, K),
        Y = nS8(_, z);
    if (Y === "" || Y.startsWith("..") || LL6(Y) === Y) return null;
    return z
}
// @from(Ln 235806, Col 0)
async function A56(q, K, _, z, Y, A, O, w) {
    let $ = await Promise.all(q.map(async (H) => {
            let J = T68(K, H);
            if (J === null) return {
                relPath: H,
                fullPath: null,
                exists: !1
            };
            return {
                relPath: H,
                fullPath: J,
                exists: await a3(J)
            }
        })),
        j = [];
    for (let {
            relPath: H,
            fullPath: J,
            exists: X
        }
        of $) {
        if (J === null) {
            E(`${A} path ${H} ${O} escapes plugin directory for ${_}`, {
                level: "error"
            }), w.push({
                type: "path-traversal",
                source: z,
                plugin: _,
                path: H,
                component: Y
            });
            continue
        }
        if (X) j.push(J);
        else E(`${A} path ${H} ${O} not found at ${J} for ${_}`, {
            level: "warn"
        }), j6(Error(`Plugin component file not found: ${J} for ${_}`)), w.push({
            type: "path-not-found",
            source: z,
            plugin: _,
            path: J,
            component: Y
        })
    }
    return j
}
// @from(Ln 235852, Col 0)
async function yG4(q, K, _, z, Y = !0) {
    let A = [],
        {
            manifest: O,
            manifestPath: w,
            depConstraints: $
        } = await k68(q, z, K),
        j = {
            name: O.name,
            manifest: O,
            path: q,
            source: K,
            repository: K,
            enabled: _,
            depConstraints: $
        },
        [H, J, X, M] = await Promise.all([!O.commands ? a3(uz(q, "commands")) : !1, !O.agents ? a3(uz(q, "agents")) : !1, !O.skills ? a3(uz(q, "skills")) : !1, !O.outputStyles ? a3(uz(q, "output-styles")) : !1]),
        P = uz(q, "commands");
    if (H) j.commandsPath = P;
    if (O.commands) {
        let N = Object.values(O.commands)[0];
        if (typeof O.commands === "object" && !Array.isArray(O.commands) && N && typeof N === "object" && (("source" in N) || ("content" in N))) {
            let R = {},
                h = [],
                C = Object.entries(O.commands),
                x = await Promise.all(C.map(async ([B, m]) => {
                    if (!m || typeof m !== "object") return {
                        commandName: B,
                        metadata: m,
                        kind: "skip"
                    };
                    if (m.source) {
                        let S = T68(q, m.source);
                        return {
                            commandName: B,
                            metadata: m,
                            kind: "source",
                            fullPath: S,
                            exists: S !== null && await a3(S)
                        }
                    }
                    if (m.content) return {
                        commandName: B,
                        metadata: m,
                        kind: "content"
                    };
                    return {
                        commandName: B,
                        metadata: m,
                        kind: "skip"
                    }
                }));
            for (let B of x) {
                if (B.kind === "skip") continue;
                if (B.kind === "content") {
                    R[B.commandName] = B.metadata;
                    continue
                }
                if (B.fullPath === null) E(`Command ${B.commandName} source ${B.metadata.source} specified in manifest but escapes plugin directory for ${O.name}`, {
                    level: "error"
                }), A.push({
                    type: "path-traversal",
                    source: K,
                    plugin: O.name,
                    path: B.metadata.source ?? "",
                    component: "commands"
                });
                else if (B.exists) h.push(B.fullPath), R[B.commandName] = B.metadata;
                else E(`Command ${B.commandName} path ${B.metadata.source} specified in manifest but not found at ${B.fullPath} for ${O.name}`, {
                    level: "warn"
                }), j6(Error(`Plugin component file not found: ${B.fullPath} for ${O.name}`)), A.push({
                    type: "path-not-found",
                    source: K,
                    plugin: O.name,
                    path: B.fullPath,
                    component: "commands"
                })
            }
            if (h.length > 0) j.commandsPaths = h;
            if (Object.keys(R).length > 0) j.commandsMetadata = R
        } else {
            let R = Array.isArray(O.commands) ? O.commands : [O.commands],
                h = await Promise.all(R.map(async (x) => {
                    if (typeof x !== "string") return {
                        cmdPath: x,
                        kind: "invalid"
                    };
                    let B = T68(q, x);
                    return {
                        cmdPath: x,
                        kind: "path",
                        fullPath: B,
                        exists: B !== null && await a3(B)
                    }
                })),
                C = [];
            for (let x of h) {
                if (x.kind === "invalid") {
                    E(`Unexpected command format in manifest for ${O.name}`, {
                        level: "error"
                    });
                    continue
                }
                if (x.fullPath === null) {
                    E(`Command path ${x.cmdPath} specified in manifest but escapes plugin directory for ${O.name}`, {
                        level: "error"
                    }), A.push({
                        type: "path-traversal",
                        source: K,
                        plugin: O.name,
                        path: x.cmdPath,
                        component: "commands"
                    });
                    continue
                }
                if (x.exists) C.push(x.fullPath);
                else E(`Command path ${x.cmdPath} specified in manifest but not found at ${x.fullPath} for ${O.name}`, {
                    level: "warn"
                }), j6(Error(`Plugin component file not found: ${x.fullPath} for ${O.name}`)), A.push({
                    type: "path-not-found",
                    source: K,
                    plugin: O.name,
                    path: x.fullPath,
                    component: "commands"
                })
            }
            if (C.length > 0) j.commandsPaths = C
        }
    }
    let W = uz(q, "agents");
    if (J) j.agentsPath = W;
    if (O.agents) {
        let N = Array.isArray(O.agents) ? O.agents : [O.agents],
            R = await A56(N, q, O.name, K, "agents", "Agent", "specified in manifest but", A);
        if (R.length > 0) j.agentsPaths = R
    }
    let D = uz(q, "skills");
    if (X) j.skillsPath = D;
    if (O.skills) {
        let N = Array.isArray(O.skills) ? O.skills : [O.skills],
            R = await A56(N, q, O.name, K, "skills", "Skill", "specified in manifest but", A);
        if (R.length > 0) j.skillsPaths = R
    }
    let Z = uz(q, "output-styles");
    if (M) j.outputStylesPath = Z;
    if (O.outputStyles) {
        let N = Array.isArray(O.outputStyles) ? O.outputStyles : [O.outputStyles],
            R = await A56(N, q, O.name, K, "output-styles", "Output style", "specified in manifest but", A);
        if (R.length > 0) j.outputStylesPaths = R
    }
    let G, f = new Set,
        v = uz(q, "hooks", "hooks.json");
    if (await a3(v)) try {
        G = await fG4(v, O.name);
        try {
            f.add(await iS8(v))
        } catch {
            f.add(v)
        }
        E(`Loaded hooks from standard location for plugin ${O.name}: ${v}`)
    } catch (N) {
        let R = b6(N);
        E(`Failed to load hooks for ${O.name}: ${R}`, {
            level: "error"
        }), j6(r1(N)), A.push({
            type: "hook-load-failed",
            source: K,
            plugin: O.name,
            hookPath: v,
            reason: R
        })
    }
    if (O.hooks) {
        let N = Array.isArray(O.hooks) ? O.hooks : [O.hooks];
        for (let R of N)
            if (typeof R === "string") {
                let h = T68(q, R);
                if (h === null) {
                    E(`Hooks file ${R} specified in manifest but escapes plugin directory for ${O.name}`, {
                        level: "error"
                    }), A.push({
                        type: "path-traversal",
                        source: K,
                        plugin: O.name,
                        path: R,
                        component: "hooks"
                    });
                    continue
                }
                if (!await a3(h)) {
                    E(`Hooks file ${R} specified in manifest but not found at ${h} for ${O.name}`, {
                        level: "error"
                    }), j6(Error(`Plugin component file not found: ${h} for ${O.name}`)), A.push({
                        type: "path-not-found",
                        source: K,
                        plugin: O.name,
                        path: h,
                        component: "hooks"
                    });
                    continue
                }
                let C;
                try {
                    C = await iS8(h)
                } catch {
                    C = h
                }
                if (f.has(C)) {
                    if (E(`Skipping duplicate hooks file for plugin ${O.name}: ${R} (resolves to already-loaded file: ${C})`), Y) {
                        let x = `Duplicate hooks file detected: ${R} resolves to already-loaded file ${C}. The standard hooks/hooks.json is loaded automatically, so manifest.hooks should only reference additional hook files.`;
                        j6(Error(x)), A.push({
                            type: "hook-load-failed",
                            source: K,
                            plugin: O.name,
                            hookPath: h,
                            reason: x
                        })
                    }
                    continue
                }
                try {
                    let x = await fG4(h, O.name);
                    try {
                        G = vG4(G, x), f.add(C), E(`Loaded and merged hooks from manifest for plugin ${O.name}: ${R}`)
                    } catch (B) {
                        let m = b6(B);
                        E(`Failed to merge hooks from ${R} for ${O.name}: ${m}`, {
                            level: "error"
                        }), j6(r1(B)), A.push({
                            type: "hook-load-failed",
                            source: K,
                            plugin: O.name,
                            hookPath: h,
                            reason: `Failed to merge: ${m}`
                        })
                    }
                } catch (x) {
                    let B = b6(x);
                    E(`Failed to load hooks from ${R} for ${O.name}: ${B}`, {
                        level: "error"
                    }), j6(r1(x)), A.push({
                        type: "hook-load-failed",
                        source: K,
                        plugin: O.name,
                        hookPath: h,
                        reason: B
                    })
                }
            } else if (typeof R === "object") G = vG4(G, R)
    }
    if (G) j.hooksConfig = G;
    let V = await K_z(q, O, K, A);
    if (V) j.monitors = V;
    let k = await z_z(q, O);
    if (k) j.settings = k;
    return {
        plugin: j,
        errors: A,
        hasManifest: w !== null
    }
}
// @from(Ln 236114, Col 0)
function GG4(q) {
    let K = __z().safeParse(q);
    if (!K.success) return;
    let _ = K.data;
    if (Object.keys(_).length === 0) return;
    return _
}
// @from(Ln 236121, Col 0)
async function z_z(q, K) {
    let _ = uz(q, "settings.json");
    try {
        let z = await oS8(_, {
                encoding: "utf-8"
            }),
            Y = n8(z);
        if (H_z(Y)) {
            let A = GG4(Y);
            if (A) return E(`Loaded settings from settings.json for plugin ${K.name}`), A
        }
    } catch (z) {
        if (!D5(z)) E(`Failed to parse settings.json for plugin ${K.name}: ${z}`, {
            level: "warn"
        })
    }
    if (K.settings) {
        let z = GG4(K.settings);
        if (z) return E(`Loaded settings from manifest for plugin ${K.name}`), z
    }
    return
}
// @from(Ln 236144, Col 0)
function vG4(q, K) {
    if (!q) return K;
    let _ = {
        ...q
    };
    for (let [z, Y] of Object.entries(K))
        if (!_[z]) _[z] = Y;
        else _[z] = [..._[z] || [], ...Y];
    return _
}
// @from(Ln 236154, Col 0)
async function LG4({
    cacheOnly: q
}) {
    let K = y7(),
        _ = {
            ...ej6(),
            ...K.enabledPlugins || {}
        },
        z = [],
        Y = [],
        A = Object.entries(_).filter(([P, W]) => {
            if (!DX8().safeParse(P).success || W === void 0) return !1;
            let {
                marketplace: Z
            } = Z4(P);
            return Z !== _68
        }),
        O = await O56(),
        w = oK6(),
        $ = VQ1(),
        j = w !== null || $ !== null && $.length > 0,
        H = new Set(A.map(([P]) => Z4(P).marketplace).filter((P) => !!P)),
        J = new Map;
    await Promise.all([...H].map(async (P) => {
        J.set(P, await G68(P))
    }));
    let X = N68(),
        M = await Promise.allSettled(A.map(async ([P, W]) => {
            let {
                name: D,
                marketplace: Z
            } = Z4(P), G = O[Z];
            if (!G && j) return Y.push({
                type: "marketplace-blocked-by-policy",
                source: P,
                plugin: D,
                marketplace: Z,
                blockedByBlocklist: w === null,
                allowedSources: (w ?? []).map((N) => zH6(N))
            }), null;
            if (G && !_H6(G.source)) {
                let N = w68(G.source),
                    R = oK6() || [];
                return Y.push({
                    type: "marketplace-blocked-by-policy",
                    source: P,
                    plugin: D,
                    marketplace: Z,
                    blockedByBlocklist: N,
                    allowedSources: N ? [] : R.map((h) => zH6(h))
                }), null
            }
            let f = null,
                v = J.get(Z);
            if (v && G) {
                let N = v.plugins.find((R) => R.name === D);
                if (N) f = {
                    entry: N,
                    marketplaceInstallLocation: G.installLocation
                }
            } else f = await Md1(P);
            if (!f) return Y.push({
                type: "plugin-not-found",
                source: P,
                pluginId: D,
                marketplace: Z
            }), null;
            let V = X.plugins[P]?.[0],
                k = await (q ? Y_z(f.entry, f.marketplaceInstallLocation, G?.source, P, W === !0, Y, V?.installPath) : A_z(f.entry, f.marketplaceInstallLocation, G?.source, P, W === !0, Y, V?.version));
            if (k && V?.resolvedVersion !== void 0) k.resolvedVersion = V.resolvedVersion;
            return k
        }));
    for (let [P, W] of M.entries())
        if (W.status === "fulfilled" && W.value) z.push(W.value);
        else if (W.status === "rejected") {
        let D = r1(W.reason);
        j6(D);
        let Z = A[P][0];
        Y.push({
            type: "generic-error",
            source: Z,
            plugin: i5(Z, "@"),
            error: D.message
        })
    }
    return {
        plugins: z,
        errors: Y
    }
}
// @from(Ln 236244, Col 0)
async function Y_z(q, K, _, z, Y, A, O) {
    let w;
    if (typeof q.source === "string") {
        let $ = _ && Wh(_);
        if (!$ && O && await a3(O)) w = O;
        else {
            let j;
            try {
                j = (await VG4(K)).isDirectory() ? K : uz(K, "..")
            } catch {
                return A.push($ ? {
                    type: "generic-error",
                    source: z,
                    error: `Marketplace directory not found at path: ${K}`
                } : {
                    type: "plugin-cache-miss",
                    source: z,
                    plugin: q.name,
                    installPath: K
                }), null
            }
            if (w = uz(j, q.source), !await a3(w)) return A.push($ ? {
                type: "generic-error",
                source: z,
                error: `Plugin directory not found at path: ${w}. Check that the marketplace entry has the correct path.`
            } : {
                type: "plugin-cache-miss",
                source: z,
                plugin: q.name,
                installPath: w
            }), null
        }
    } else {
        if (!O || !await a3(O)) return A.push({
            type: "plugin-cache-miss",
            source: z,
            plugin: q.name,
            installPath: O ?? "(not recorded)"
        }), null;
        w = O
    }
    if (wx() && w.endsWith(".zip")) {
        let $ = await Kd1(),
            j = uz($, z.replace(/[^a-zA-Z0-9@\-_]/g, "-"));
        try {
            await _d1(w, j), w = j
        } catch (H) {
            return E(`Failed to extract plugin ZIP ${w}: ${H}`, {
                level: "error"
            }), A.push({
                type: "plugin-cache-miss",
                source: z,
                plugin: q.name,
                installPath: w
            }), null
        }
    }
    return hG4(q, z, Y, A, w)
}
// @from(Ln 236303, Col 0)
async function A_z(q, K, _, z, Y, A, O) {
    E(`Loading plugin ${q.name} from source: ${I6(q.source)}`);
    let w;
    if (typeof q.source === "string") {
        let $ = (await VG4(K)).isDirectory() ? K : uz(K, ".."),
            j = uz($, q.source);
        if (!await a3(j)) {
            let H = Error(`Plugin path not found: ${j}`);
            return E(`Plugin path not found: ${j}`, {
                level: "error"
            }), j6(H), A.push({
                type: "generic-error",
                source: z,
                error: `Plugin directory not found at path: ${j}. Check that the marketplace entry has the correct path.`
            }), null
        }
        if (_ && Wh(_)) w = j;
        else try {
            let H;
            try {
                H = (await k68(j, q.name, q.source)).manifest
            } catch {}
            let J = await us(z, q.source, H, $, q.version);
            w = await rS8(j, z, J, q, $), E(`Copied plugin ${q.name} to versioned cache: ${w}`)
        } catch (H) {
            let J = b6(H);
            E(`Failed to copy plugin ${q.name} to versioned cache: ${J}. Using marketplace path.`, {
                level: "warn"
            }), w = j
        }
    } else try {
        let $ = await us(z, q.source, void 0, void 0, O ?? q.version, "sha" in q.source ? q.source.sha : void 0),
            j = Sp(z, $),
            H = yL6(z, $);
        if (wx() && await a3(H)) E(`Using versioned cached plugin ZIP ${q.name} from ${H}`), w = H;
        else if (await a3(j)) E(`Using versioned cached plugin ${q.name} from ${j}`), w = j;
        else {
            let J = await kG4(z, $) ?? ($ === "unknown" ? await i9z(z) : null);
            if (J) w = J, E(`Using seed cache for external plugin ${q.name} at ${J}`);
            else {
                let X = await f68(q.source, {
                        manifest: {
                            name: q.name
                        }
                    }),
                    M = $ !== "unknown" ? $ : await us(z, q.source, X.manifest, X.path, O ?? q.version, X.gitCommitSha);
                if (w = await rS8(X.path, z, M, q, void 0), X.path !== w) await jH6(X.path, {
                    recursive: !0,
                    force: !0
                })
            }
        }
    } catch ($) {
        let j = b6($);
        return E(`Failed to cache plugin ${q.name}: ${j}`, {
            level: "error"
        }), j6(r1($)), A.push({
            type: "generic-error",
            source: z,
            error: `Failed to download/cache plugin ${q.name}: ${j}`
        }), null
    }
    if (wx() && w.endsWith(".zip")) {
        let $ = await Kd1(),
            j = uz($, z.replace(/[^a-zA-Z0-9@\-_]/g, "-"));
        try {
            await _d1(w, j), E(`Extracted plugin ZIP to session dir: ${j}`), w = j
        } catch (H) {
            throw E(`Failed to extract plugin ZIP ${w}, deleting corrupt file: ${H}`), await jH6(w, {
                force: !0
            }).catch(() => {}), H
        }
    }
    return hG4(q, z, Y, A, w)
}
// @from(Ln 236378, Col 0)
async function hG4(q, K, _, z, Y) {
    let A = [],
        {
            plugin: O,
            errors: w,
            hasManifest: $
        } = await yG4(Y, K, _, q.name, q.strict ?? !0);
    if (A.push(...w), typeof q.source === "object" && "sha" in q.source && q.source.sha) O.sha = q.source.sha;
    if (!$) {
        if (O.manifest = {
                ...q,
                id: void 0,
                source: void 0,
                strict: void 0
            }, O.name = O.manifest.name, q.commands) {
            let j = Object.values(q.commands)[0];
            if (typeof q.commands === "object" && !Array.isArray(q.commands) && j && typeof j === "object" && (("source" in j) || ("content" in j))) {
                let H = {},
                    J = [],
                    X = Object.entries(q.commands),
                    M = await Promise.all(X.map(async ([P, W]) => {
                        if (!W || typeof W !== "object" || !W.source) return {
                            commandName: P,
                            metadata: W,
                            skip: !0
                        };
                        let D = uz(Y, W.source);
                        return {
                            commandName: P,
                            metadata: W,
                            skip: !1,
                            fullPath: D,
                            exists: await a3(D)
                        }
                    }));
                for (let P of M) {
                    if (P.skip) continue;
                    if (P.exists) J.push(P.fullPath), H[P.commandName] = P.metadata;
                    else E(`Command ${P.commandName} path ${P.metadata.source} from marketplace entry not found at ${P.fullPath} for ${q.name}`, {
                        level: "warn"
                    }), j6(Error(`Plugin component file not found: ${P.fullPath} for ${q.name}`)), A.push({
                        type: "path-not-found",
                        source: K,
                        plugin: q.name,
                        path: P.fullPath,
                        component: "commands"
                    })
                }
                if (J.length > 0) O.commandsPaths = J, O.commandsMetadata = H
            } else {
                let H = Array.isArray(q.commands) ? q.commands : [q.commands],
                    J = await Promise.all(H.map(async (M) => {
                        if (typeof M !== "string") return {
                            cmdPath: M,
                            kind: "invalid"
                        };
                        let P = uz(Y, M);
                        return {
                            cmdPath: M,
                            kind: "path",
                            fullPath: P,
                            exists: await a3(P)
                        }
                    })),
                    X = [];
                for (let M of J) {
                    if (M.kind === "invalid") {
                        E(`Unexpected command format in marketplace entry for ${q.name}`, {
                            level: "error"
                        });
                        continue
                    }
                    if (M.exists) X.push(M.fullPath);
                    else E(`Command path ${M.cmdPath} from marketplace entry not found at ${M.fullPath} for ${q.name}`, {
                        level: "warn"
                    }), j6(Error(`Plugin component file not found: ${M.fullPath} for ${q.name}`)), A.push({
                        type: "path-not-found",
                        source: K,
                        plugin: q.name,
                        path: M.fullPath,
                        component: "commands"
                    })
                }
                if (X.length > 0) O.commandsPaths = X
            }
        }
        if (q.agents) {
            let j = Array.isArray(q.agents) ? q.agents : [q.agents],
                H = await A56(j, Y, q.name, K, "agents", "Agent", "from marketplace entry", A);
            if (H.length > 0) O.agentsPaths = H
        }
        if (q.skills) {
            E(`Processing ${Array.isArray(q.skills)?q.skills.length:1} skill paths for plugin ${q.name}`);
            let j = Array.isArray(q.skills) ? q.skills : [q.skills],
                H = await Promise.all(j.map(async (X) => {
                    let M = uz(Y, X);
                    return {
                        skillPath: X,
                        fullPath: M,
                        exists: await a3(M)
                    }
                })),
                J = [];
            for (let {
                    skillPath: X,
                    fullPath: M,
                    exists: P
                }
                of H)
                if (E(`Checking skill path: ${X} -> ${M} (exists: ${P})`), P) J.push(M);
                else E(`Skill path ${X} from marketplace entry not found at ${M} for ${q.name}`, {
                    level: "warn"
                }), j6(Error(`Plugin component file not found: ${M} for ${q.name}`)), A.push({
                    type: "path-not-found",
                    source: K,
                    plugin: q.name,
                    path: M,
                    component: "skills"
                });
            if (E(`Found ${J.length} valid skill paths for plugin ${q.name}, setting skillsPaths`), J.length > 0) O.skillsPaths = J
        } else E(`Plugin ${q.name} has no entry.skills defined`);
        if (q.outputStyles) {
            let j = Array.isArray(q.outputStyles) ? q.outputStyles : [q.outputStyles],
                H = await A56(j, Y, q.name, K, "output-styles", "Output style", "from marketplace entry", A);
            if (H.length > 0) O.outputStylesPaths = H
        }
        if (q.hooks) O.hooksConfig = q.hooks
    } else if (!q.strict && $ && (q.commands || q.agents || q.skills || q.hooks || q.outputStyles)) {
        let j = Error(`Plugin ${q.name} has both plugin.json and marketplace manifest entries for commands/agents/skills/hooks/outputStyles. This is a conflict.`);
        return E(`Plugin ${q.name} has both plugin.json and marketplace manifest entries for commands/agents/skills/hooks/outputStyles. This is a conflict.`, {
            level: "error"
        }), j6(j), z.push({
            type: "generic-error",
            source: K,
            error: `Plugin ${q.name} has conflicting manifests: both plugin.json and marketplace entry specify components. Set strict: true in marketplace entry or remove component specs from one location.`
        }), null
    } else if ($) {
        if (q.commands) {
            let j = Object.values(q.commands)[0];
            if (typeof q.commands === "object" && !Array.isArray(q.commands) && j && typeof j === "object" && (("source" in j) || ("content" in j))) {
                let H = {
                        ...O.commandsMetadata || {}
                    },
                    J = [],
                    X = Object.entries(q.commands),
                    M = await Promise.all(X.map(async ([P, W]) => {
                        if (!W || typeof W !== "object" || !W.source) return {
                            commandName: P,
                            metadata: W,
                            skip: !0
                        };
                        let D = uz(Y, W.source);
                        return {
                            commandName: P,
                            metadata: W,
                            skip: !1,
                            fullPath: D,
                            exists: await a3(D)
                        }
                    }));
                for (let P of M) {
                    if (P.skip) continue;
                    if (P.exists) J.push(P.fullPath), H[P.commandName] = P.metadata;
                    else E(`Command ${P.commandName} path ${P.metadata.source} from marketplace entry not found at ${P.fullPath} for ${q.name}`, {
                        level: "warn"
                    }), j6(Error(`Plugin component file not found: ${P.fullPath} for ${q.name}`)), A.push({
                        type: "path-not-found",
                        source: K,
                        plugin: q.name,
                        path: P.fullPath,
                        component: "commands"
                    })
                }
                if (J.length > 0) O.commandsPaths = [...O.commandsPaths || [], ...J], O.commandsMetadata = H
            } else {
                let H = Array.isArray(q.commands) ? q.commands : [q.commands],
                    J = await Promise.all(H.map(async (M) => {
                        if (typeof M !== "string") return {
                            cmdPath: M,
                            kind: "invalid"
                        };
                        let P = uz(Y, M);
                        return {
                            cmdPath: M,
                            kind: "path",
                            fullPath: P,
                            exists: await a3(P)
                        }
                    })),
                    X = [];
                for (let M of J) {
                    if (M.kind === "invalid") {
                        E(`Unexpected command format in marketplace entry for ${q.name}`, {
                            level: "error"
                        });
                        continue
                    }
                    if (M.exists) X.push(M.fullPath);
                    else E(`Command path ${M.cmdPath} from marketplace entry not found at ${M.fullPath} for ${q.name}`, {
                        level: "warn"
                    }), j6(Error(`Plugin component file not found: ${M.fullPath} for ${q.name}`)), A.push({
                        type: "path-not-found",
                        source: K,
                        plugin: q.name,
                        path: M.fullPath,
                        component: "commands"
                    })
                }
                if (X.length > 0) O.commandsPaths = [...O.commandsPaths || [], ...X]
            }
        }
        if (q.agents) {
            let j = Array.isArray(q.agents) ? q.agents : [q.agents],
                H = await A56(j, Y, q.name, K, "agents", "Agent", "from marketplace entry", A);
            if (H.length > 0) O.agentsPaths = [...O.agentsPaths || [], ...H]
        }
        if (q.skills) {
            let j = Array.isArray(q.skills) ? q.skills : [q.skills],
                H = await A56(j, Y, q.name, K, "skills", "Skill", "from marketplace entry", A);
            if (H.length > 0) O.skillsPaths = [...O.skillsPaths || [], ...H]
        }
        if (q.outputStyles) {
            let j = Array.isArray(q.outputStyles) ? q.outputStyles : [q.outputStyles],
                H = await A56(j, Y, q.name, K, "output-styles", "Output style", "from marketplace entry", A);
            if (H.length > 0) O.outputStylesPaths = [...O.outputStylesPaths || [], ...H]
        }
        if (q.hooks) O.hooksConfig = {
            ...O.hooksConfig || {},
            ...q.hooks
        }
    }
    return z.push(...A), O
}
// @from(Ln 236611, Col 0)
async function O_z(q) {
    if (q.length === 0) return {
        plugins: [],
        errors: []
    };
    let K = [],
        _ = [];
    for (let [z, Y] of q.entries()) try {
        let A = LL6(Y);
        if (!await a3(A)) {
            E(`Plugin path does not exist: ${A}, skipping`, {
                level: "warn"
            }), _.push({
                type: "path-not-found",
                source: `inline[${z}]`,
                path: A,
                component: "commands"
            });
            continue
        }
        let O = n9z(A),
            {
                plugin: w,
                errors: $
            } = await yG4(A, `${O}@inline`, !0, O);
        w.source = `${w.name}@inline`, w.repository = `${w.name}@inline`, K.push(w), _.push(...$), E(`Loaded inline plugin from path: ${w.name}`)
    } catch (A) {
        let O = b6(A);
        E(`Failed to load session plugin from ${Y}: ${O}`, {
            level: "warn"
        }), _.push({
            type: "generic-error",
            source: `inline[${z}]`,
            error: `Failed to load plugin: ${O}`
        })
    }
    if (K.length > 0) E(`Loaded ${K.length} session-only plugins from --plugin-dir`);
    return {
        plugins: K,
        errors: _
    }
}
// @from(Ln 236654, Col 0)
function w_z(q) {
    let K = [],
        _ = q.managedNames,
        z = q.session.filter((O) => {
            if (_?.has(O.name)) return E(`Plugin "${O.name}" from --plugin-dir is blocked by managed settings`, {
                level: "warn"
            }), K.push({
                type: "generic-error",
                source: O.source,
                plugin: O.name,
                error: `--plugin-dir copy of "${O.name}" ignored: plugin is locked by managed settings`
            }), !1;
            return !0
        }),
        Y = new Set(z.map((O) => O.name)),
        A = q.marketplace.filter((O) => {
            if (Y.has(O.name)) return E(`Plugin "${O.name}" from --plugin-dir overrides installed version`), !1;
            return !0
        });
    return {
        plugins: [...z, ...A, ...q.builtin],
        errors: K
    }
}
// @from(Ln 236678, Col 0)
async function RG4() {
    let {
        enabled: q
    } = await Gj();
    return q.filter((K) => !K.isBuiltin && K.path).map((K) => uz(K.path, "bin")).filter((K) => {
        if (v68 !== "\\" && /[:"'$`\\\n\r]/.test(K)) return E(`Dropping plugin bin path with shell metacharacters: ${K}`), !1;
        return !0
    })
}
// @from(Ln 236687, Col 0)
async function SG4(q) {
    let K = cg(),
        [_, z] = await Promise.all([q(), K.length > 0 ? O_z(K) : Promise.resolve({
            plugins: [],
            errors: []
        })]),
        Y = DQ1(),
        {
            plugins: A,
            errors: O
        } = w_z({
            session: z.plugins,
            marketplace: _.plugins,
            builtin: [...Y.enabled, ...Y.disabled],
            managedNames: Xy()
        }),
        w = [..._.errors, ...z.errors, ...O],
        {
            demoted: $,
            errors: j
        } = Hf4(A);
    for (let J of A)
        if ($.has(J.source)) J.enabled = !1;
    w.push(...j);
    let H = A.filter((J) => J.enabled);
    return E(`Found ${A.length} plugins (${H.length} enabled, ${A.length-H.length} disabled)`), j_z(H), {
        enabled: H,
        disabled: A.filter((J) => !J.enabled),
        errors: w
    }
}
// @from(Ln 236719, Col 0)
function bk(q) {
    if (q) E(`clearPluginCache: invalidating loadAllPlugins cache (${q})`);
    if (sW.cache?.clear?.(), Gj.cache?.clear?.(), CO8() !== void 0) u0();
    Bf7()
}
// @from(Ln 236725, Col 0)
function $_z(q) {
    let K;
    for (let _ of q) {
        if (!_.settings) continue;
        if (!K) K = {};
        for (let [z, Y] of Object.entries(_.settings)) {
            if (z in K) E(`Plugin "${_.name}" overrides setting "${z}" (previously set by another plugin)`);
            K[z] = Y
        }
    }
    return K
}
// @from(Ln 236738, Col 0)
function j_z(q) {
    let K = $_z(q);
    if (mf7(K), K && Object.keys(K).length > 0) u0(), E(`Cached plugin settings with keys: ${Object.keys(K).join(", ")}`)
}
// @from(Ln 236743, Col 0)
function H_z(q) {
    return typeof q === "object" && q !== null && !Array.isArray(q)
}
// @from(Ln 236746, Col 4)
__z