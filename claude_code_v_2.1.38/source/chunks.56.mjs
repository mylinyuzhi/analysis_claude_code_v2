
// @from(Ln 146581, Col 4)
jY7 = R((tV2, DY7) => {
    var {
        defineProperty: A56,
        getOwnPropertyDescriptor: CS5,
        getOwnPropertyNames: SS5
    } = Object, hS5 = Object.prototype.hasOwnProperty, uKA = (A, q) => A56(A, "name", {
        value: q,
        configurable: !0
    }), IS5 = (A, q) => {
        for (var K in q) A56(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, xS5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of SS5(q))
                if (!hS5.call(A, z) && z !== K) A56(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = CS5(q, z)) || Y.enumerable
                })
        }
        return A
    }, bS5 = (A) => xS5(A56({}, "__esModule", {
        value: !0
    }), A), _Y7 = {};
    IS5(_Y7, {
        fromUtf8: () => XY7,
        toUint8Array: () => uS5,
        toUtf8: () => BS5
    });
    DY7.exports = bS5(_Y7);
    var JY7 = M81(),
        XY7 = uKA((A) => {
            let q = (0, JY7.fromString)(A, "utf8");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
        }, "fromUtf8"),
        uS5 = uKA((A) => {
            if (typeof A === "string") return XY7(A);
            if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return new Uint8Array(A)
        }, "toUint8Array"),
        BS5 = uKA((A) => {
            if (typeof A === "string") return A;
            if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
            return (0, JY7.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
        }, "toUtf8")
})
// @from(Ln 146628, Col 4)
WY7 = R((MY7) => {
    Object.defineProperty(MY7, "__esModule", {
        value: !0
    });
    MY7.toBase64 = void 0;
    var mS5 = M81(),
        FS5 = jY7(),
        QS5 = (A) => {
            let q;
            if (typeof A === "string") q = (0, FS5.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, mS5.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    MY7.toBase64 = QS5
})
// @from(Ln 146644, Col 4)
FKA = R((AN2, q56) => {
    var {
        defineProperty: GY7,
        getOwnPropertyDescriptor: gS5,
        getOwnPropertyNames: US5
    } = Object, pS5 = Object.prototype.hasOwnProperty, BKA = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of US5(q))
                if (!pS5.call(A, z) && z !== K) GY7(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = gS5(q, z)) || Y.enumerable
                })
        }
        return A
    }, ZY7 = (A, q, K) => (BKA(A, q, "default"), K && BKA(K, q, "default")), dS5 = (A) => BKA(GY7({}, "__esModule", {
        value: !0
    }), A), mKA = {};
    q56.exports = dS5(mKA);
    ZY7(mKA, OY7(), q56.exports);
    ZY7(mKA, WY7(), q56.exports)
})
// @from(Ln 146665, Col 4)
vY7 = R((qN2, TY7) => {
    var {
        defineProperty: K56,
        getOwnPropertyDescriptor: cS5,
        getOwnPropertyNames: lS5
    } = Object, iS5 = Object.prototype.hasOwnProperty, EL = (A, q) => K56(A, "name", {
        value: q,
        configurable: !0
    }), nS5 = (A, q) => {
        for (var K in q) K56(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, rS5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of lS5(q))
                if (!iS5.call(A, z) && z !== K) K56(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = cS5(q, z)) || Y.enumerable
                })
        }
        return A
    }, oS5 = (A) => rS5(K56({}, "__esModule", {
        value: !0
    }), A), NY7 = {};
    nS5(NY7, {
        constructStack: () => QKA
    });
    TY7.exports = oS5(NY7);
    var S71 = EL((A, q) => {
            let K = [];
            if (A) K.push(A);
            if (q)
                for (let Y of q) K.push(Y);
            return K
        }, "getAllAliases"),
        xr = EL((A, q) => {
            return `${A||"anonymous"}${q&&q.length>0?` (a.k.a. ${q.join(",")})`:""}`
        }, "getMiddlewareNameWithAliases"),
        QKA = EL(() => {
            let A = [],
                q = [],
                K = !1,
                Y = new Set,
                z = EL((X) => X.sort((D, j) => fY7[j.step] - fY7[D.step] || VY7[j.priority || "normal"] - VY7[D.priority || "normal"]), "sort"),
                w = EL((X) => {
                    let D = !1,
                        j = EL((M) => {
                            let P = S71(M.name, M.aliases);
                            if (P.includes(X)) {
                                D = !0;
                                for (let W of P) Y.delete(W);
                                return !1
                            }
                            return !0
                        }, "filterCb");
                    return A = A.filter(j), q = q.filter(j), D
                }, "removeByName"),
                H = EL((X) => {
                    let D = !1,
                        j = EL((M) => {
                            if (M.middleware === X) {
                                D = !0;
                                for (let P of S71(M.name, M.aliases)) Y.delete(P);
                                return !1
                            }
                            return !0
                        }, "filterCb");
                    return A = A.filter(j), q = q.filter(j), D
                }, "removeByReference"),
                $ = EL((X) => {
                    var D;
                    return A.forEach((j) => {
                        X.add(j.middleware, {
                            ...j
                        })
                    }), q.forEach((j) => {
                        X.addRelativeTo(j.middleware, {
                            ...j
                        })
                    }), (D = X.identifyOnResolve) == null || D.call(X, J.identifyOnResolve()), X
                }, "cloneTo"),
                O = EL((X) => {
                    let D = [];
                    return X.before.forEach((j) => {
                        if (j.before.length === 0 && j.after.length === 0) D.push(j);
                        else D.push(...O(j))
                    }), D.push(X), X.after.reverse().forEach((j) => {
                        if (j.before.length === 0 && j.after.length === 0) D.push(j);
                        else D.push(...O(j))
                    }), D
                }, "expandRelativeMiddlewareList"),
                _ = EL((X = !1) => {
                    let D = [],
                        j = [],
                        M = {};
                    return A.forEach((W) => {
                        let G = {
                            ...W,
                            before: [],
                            after: []
                        };
                        for (let f of S71(G.name, G.aliases)) M[f] = G;
                        D.push(G)
                    }), q.forEach((W) => {
                        let G = {
                            ...W,
                            before: [],
                            after: []
                        };
                        for (let f of S71(G.name, G.aliases)) M[f] = G;
                        j.push(G)
                    }), j.forEach((W) => {
                        if (W.toMiddleware) {
                            let G = M[W.toMiddleware];
                            if (G === void 0) {
                                if (X) return;
                                throw Error(`${W.toMiddleware} is not found when adding ${xr(W.name,W.aliases)} middleware ${W.relation} ${W.toMiddleware}`)
                            }
                            if (W.relation === "after") G.after.push(W);
                            if (W.relation === "before") G.before.push(W)
                        }
                    }), z(D).map(O).reduce((W, G) => {
                        return W.push(...G), W
                    }, [])
                }, "getMiddlewareList"),
                J = {
                    add: (X, D = {}) => {
                        let {
                            name: j,
                            override: M,
                            aliases: P
                        } = D, W = {
                            step: "initialize",
                            priority: "normal",
                            middleware: X,
                            ...D
                        }, G = S71(j, P);
                        if (G.length > 0) {
                            if (G.some((f) => Y.has(f))) {
                                if (!M) throw Error(`Duplicate middleware name '${xr(j,P)}'`);
                                for (let f of G) {
                                    let Z = A.findIndex((T) => {
                                        var k;
                                        return T.name === f || ((k = T.aliases) == null ? void 0 : k.some((y) => y === f))
                                    });
                                    if (Z === -1) continue;
                                    let N = A[Z];
                                    if (N.step !== W.step || W.priority !== N.priority) throw Error(`"${xr(N.name,N.aliases)}" middleware with ${N.priority} priority in ${N.step} step cannot be overridden by "${xr(j,P)}" middleware with ${W.priority} priority in ${W.step} step.`);
                                    A.splice(Z, 1)
                                }
                            }
                            for (let f of G) Y.add(f)
                        }
                        A.push(W)
                    },
                    addRelativeTo: (X, D) => {
                        let {
                            name: j,
                            override: M,
                            aliases: P
                        } = D, W = {
                            middleware: X,
                            ...D
                        }, G = S71(j, P);
                        if (G.length > 0) {
                            if (G.some((f) => Y.has(f))) {
                                if (!M) throw Error(`Duplicate middleware name '${xr(j,P)}'`);
                                for (let f of G) {
                                    let Z = q.findIndex((T) => {
                                        var k;
                                        return T.name === f || ((k = T.aliases) == null ? void 0 : k.some((y) => y === f))
                                    });
                                    if (Z === -1) continue;
                                    let N = q[Z];
                                    if (N.toMiddleware !== W.toMiddleware || N.relation !== W.relation) throw Error(`"${xr(N.name,N.aliases)}" middleware ${N.relation} "${N.toMiddleware}" middleware cannot be overridden by "${xr(j,P)}" middleware ${W.relation} "${W.toMiddleware}" middleware.`);
                                    q.splice(Z, 1)
                                }
                            }
                            for (let f of G) Y.add(f)
                        }
                        q.push(W)
                    },
                    clone: () => $(QKA()),
                    use: (X) => {
                        X.applyToStack(J)
                    },
                    remove: (X) => {
                        if (typeof X === "string") return w(X);
                        else return H(X)
                    },
                    removeByTag: (X) => {
                        let D = !1,
                            j = EL((M) => {
                                let {
                                    tags: P,
                                    name: W,
                                    aliases: G
                                } = M;
                                if (P && P.includes(X)) {
                                    let f = S71(W, G);
                                    for (let Z of f) Y.delete(Z);
                                    return D = !0, !1
                                }
                                return !0
                            }, "filterCb");
                        return A = A.filter(j), q = q.filter(j), D
                    },
                    concat: (X) => {
                        var D;
                        let j = $(QKA());
                        return j.use(X), j.identifyOnResolve(K || j.identifyOnResolve() || (((D = X.identifyOnResolve) == null ? void 0 : D.call(X)) ?? !1)), j
                    },
                    applyToStack: $,
                    identify: () => {
                        return _(!0).map((X) => {
                            let D = X.step ?? X.relation + " " + X.toMiddleware;
                            return xr(X.name, X.aliases) + " - " + D
                        })
                    },
                    identifyOnResolve(X) {
                        if (typeof X === "boolean") K = X;
                        return K
                    },
                    resolve: (X, D) => {
                        for (let j of _().map((M) => M.middleware).reverse()) X = j(X, D);
                        if (K) console.log(J.identify());
                        return X
                    }
                };
            return J
        }, "constructStack"),
        fY7 = {
            initialize: 5,
            serialize: 4,
            build: 3,
            finalizeRequest: 2,
            deserialize: 1
        },
        VY7 = {
            high: 3,
            normal: 2,
            low: 1
        }
})
// @from(Ln 146910, Col 4)
yY7 = R((KN2, RY7) => {
    var {
        defineProperty: Y56,
        getOwnPropertyDescriptor: aS5,
        getOwnPropertyNames: sS5
    } = Object, tS5 = Object.prototype.hasOwnProperty, gKA = (A, q) => Y56(A, "name", {
        value: q,
        configurable: !0
    }), eS5 = (A, q) => {
        for (var K in q) Y56(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Ah5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of sS5(q))
                if (!tS5.call(A, z) && z !== K) Y56(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = aS5(q, z)) || Y.enumerable
                })
        }
        return A
    }, qh5 = (A) => Ah5(Y56({}, "__esModule", {
        value: !0
    }), A), EY7 = {};
    eS5(EY7, {
        fromUtf8: () => LY7,
        toUint8Array: () => Kh5,
        toUtf8: () => Yh5
    });
    RY7.exports = qh5(EY7);
    var kY7 = M81(),
        LY7 = gKA((A) => {
            let q = (0, kY7.fromString)(A, "utf8");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
        }, "fromUtf8"),
        Kh5 = gKA((A) => {
            if (typeof A === "string") return LY7(A);
            if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return new Uint8Array(A)
        }, "toUint8Array"),
        Yh5 = gKA((A) => {
            if (typeof A === "string") return A;
            if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
            return (0, kY7.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
        }, "toUtf8")
})
// @from(Ln 146957, Col 4)
hY7 = R((CY7) => {
    Object.defineProperty(CY7, "__esModule", {
        value: !0
    });
    CY7.getAwsChunkedEncodingStream = void 0;
    var zh5 = h1("stream"),
        wh5 = (A, q) => {
            let {
                base64Encoder: K,
                bodyLengthChecker: Y,
                checksumAlgorithmFn: z,
                checksumLocationName: w,
                streamHasher: H
            } = q, $ = K !== void 0 && z !== void 0 && w !== void 0 && H !== void 0, O = $ ? H(z, A) : void 0, _ = new zh5.Readable({
                read: () => {}
            });
            return A.on("data", (J) => {
                let X = Y(J) || 0;
                _.push(`${X.toString(16)}\r
`), _.push(J), _.push(`\r
`)
            }), A.on("end", async () => {
                if (_.push(`0\r
`), $) {
                    let J = K(await O);
                    _.push(`${w}:${J}\r
`), _.push(`\r
`)
                }
                _.push(null)
            }), _
        };
    CY7.getAwsChunkedEncodingStream = wh5
})
// @from(Ln 146991, Col 4)
uY7 = R((zN2, bY7) => {
    var {
        defineProperty: z56,
        getOwnPropertyDescriptor: Hh5,
        getOwnPropertyNames: $h5
    } = Object, Oh5 = Object.prototype.hasOwnProperty, UKA = (A, q) => z56(A, "name", {
        value: q,
        configurable: !0
    }), _h5 = (A, q) => {
        for (var K in q) z56(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Jh5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of $h5(q))
                if (!Oh5.call(A, z) && z !== K) z56(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Hh5(q, z)) || Y.enumerable
                })
        }
        return A
    }, Xh5 = (A) => Jh5(z56({}, "__esModule", {
        value: !0
    }), A), IY7 = {};
    _h5(IY7, {
        escapeUri: () => xY7,
        escapeUriPath: () => jh5
    });
    bY7.exports = Xh5(IY7);
    var xY7 = UKA((A) => encodeURIComponent(A).replace(/[!'()*]/g, Dh5), "escapeUri"),
        Dh5 = UKA((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
        jh5 = UKA((A) => A.split("/").map(xY7).join("/"), "escapeUriPath")
})
// @from(Ln 147025, Col 4)
QY7 = R((wN2, FY7) => {
    var {
        defineProperty: w56,
        getOwnPropertyDescriptor: Mh5,
        getOwnPropertyNames: Ph5
    } = Object, Wh5 = Object.prototype.hasOwnProperty, Gh5 = (A, q) => w56(A, "name", {
        value: q,
        configurable: !0
    }), Zh5 = (A, q) => {
        for (var K in q) w56(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, fh5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of Ph5(q))
                if (!Wh5.call(A, z) && z !== K) w56(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Mh5(q, z)) || Y.enumerable
                })
        }
        return A
    }, Vh5 = (A) => fh5(w56({}, "__esModule", {
        value: !0
    }), A), BY7 = {};
    Zh5(BY7, {
        buildQueryString: () => mY7
    });
    FY7.exports = Vh5(BY7);
    var pKA = uY7();

    function mY7(A) {
        let q = [];
        for (let K of Object.keys(A).sort()) {
            let Y = A[K];
            if (K = (0, pKA.escapeUri)(K), Array.isArray(Y))
                for (let z = 0, w = Y.length; z < w; z++) q.push(`${K}=${(0,pKA.escapeUri)(Y[z])}`);
            else {
                let z = K;
                if (Y || typeof Y === "string") z += `=${(0,pKA.escapeUri)(Y)}`;
                q.push(z)
            }
        }
        return q.join("&")
    }
    Gh5(mY7, "buildQueryString")
})
// @from(Ln 147072, Col 4)
qz7 = R((HN2, Az7) => {
    var {
        create: Nh5,
        defineProperty: $S1,
        getOwnPropertyDescriptor: Th5,
        getOwnPropertyNames: vh5,
        getPrototypeOf: Eh5
    } = Object, kh5 = Object.prototype.hasOwnProperty, F0 = (A, q) => $S1(A, "name", {
        value: q,
        configurable: !0
    }), Lh5 = (A, q) => {
        for (var K in q) $S1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, pY7 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of vh5(q))
                if (!kh5.call(A, z) && z !== K) $S1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Th5(q, z)) || Y.enumerable
                })
        }
        return A
    }, Rh5 = (A, q, K) => (K = A != null ? Nh5(Eh5(A)) : {}, pY7(q || !A || !A.__esModule ? $S1(K, "default", {
        value: A,
        enumerable: !0
    }) : K, A)), yh5 = (A) => pY7($S1({}, "__esModule", {
        value: !0
    }), A), dY7 = {};
    Lh5(dY7, {
        DEFAULT_REQUEST_TIMEOUT: () => xh5,
        NodeHttp2Handler: () => Fh5,
        NodeHttpHandler: () => bh5,
        streamCollector: () => gh5
    });
    Az7.exports = yh5(dY7);
    var cY7 = PKA(),
        lY7 = QY7(),
        dKA = h1("http"),
        cKA = h1("https"),
        Ch5 = ["ECONNRESET", "EPIPE", "ETIMEDOUT"],
        iY7 = F0((A) => {
            let q = {};
            for (let K of Object.keys(A)) {
                let Y = A[K];
                q[K] = Array.isArray(Y) ? Y.join(",") : Y
            }
            return q
        }, "getTransformedHeaders"),
        Sh5 = F0((A, q, K = 0) => {
            if (!K) return;
            let Y = setTimeout(() => {
                A.destroy(), q(Object.assign(Error(`Socket timed out without establishing a connection within ${K} ms`), {
                    name: "TimeoutError"
                }))
            }, K);
            A.on("socket", (z) => {
                if (z.connecting) z.on("connect", () => {
                    clearTimeout(Y)
                });
                else clearTimeout(Y)
            })
        }, "setConnectionTimeout"),
        hh5 = F0((A, {
            keepAlive: q,
            keepAliveMsecs: K
        }) => {
            if (q !== !0) return;
            A.on("socket", (Y) => {
                Y.setKeepAlive(q, K || 0)
            })
        }, "setSocketKeepAlive"),
        Ih5 = F0((A, q, K = 0) => {
            A.setTimeout(K, () => {
                A.destroy(), q(Object.assign(Error(`Connection timed out after ${K} ms`), {
                    name: "TimeoutError"
                }))
            })
        }, "setSocketTimeout"),
        nY7 = h1("stream"),
        gY7 = 1000;
    async function lKA(A, q, K = gY7) {
        let Y = q.headers ?? {},
            z = Y.Expect || Y.expect,
            w = -1,
            H = !1;
        if (z === "100-continue") await Promise.race([new Promise(($) => {
            w = Number(setTimeout($, Math.max(gY7, K)))
        }), new Promise(($) => {
            A.on("continue", () => {
                clearTimeout(w), $()
            }), A.on("error", () => {
                H = !0, clearTimeout(w), $()
            })
        })]);
        if (!H) rY7(A, q.body)
    }
    F0(lKA, "writeRequestBody");

    function rY7(A, q) {
        if (q instanceof nY7.Readable) {
            q.pipe(A);
            return
        }
        if (q) {
            if (Buffer.isBuffer(q) || typeof q === "string") {
                A.end(q);
                return
            }
            let K = q;
            if (typeof K === "object" && K.buffer && typeof K.byteOffset === "number" && typeof K.byteLength === "number") {
                A.end(Buffer.from(K.buffer, K.byteOffset, K.byteLength));
                return
            }
            A.end(Buffer.from(q));
            return
        }
        A.end()
    }
    F0(rY7, "writeBody");
    var xh5 = 0,
        oY7 = class A {
            constructor(q) {
                this.socketWarningTimestamp = 0, this.metadata = {
                    handlerProtocol: "http/1.1"
                }, this.configProvider = new Promise((K, Y) => {
                    if (typeof q === "function") q().then((z) => {
                        K(this.resolveDefaultConfig(z))
                    }).catch(Y);
                    else K(this.resolveDefaultConfig(q))
                })
            }
            static create(q) {
                if (typeof(q == null ? void 0 : q.handle) === "function") return q;
                return new A(q)
            }
            static checkSocketUsage(q, K) {
                var Y, z;
                let {
                    sockets: w,
                    requests: H,
                    maxSockets: $
                } = q;
                if (typeof $ !== "number" || $ === 1 / 0) return K;
                let O = 15000;
                if (Date.now() - O < K) return K;
                if (w && H)
                    for (let _ in w) {
                        let J = ((Y = w[_]) == null ? void 0 : Y.length) ?? 0,
                            X = ((z = H[_]) == null ? void 0 : z.length) ?? 0;
                        if (J >= $ && X >= 2 * $) return console.warn("@smithy/node-http-handler:WARN", `socket usage at capacity=${J} and ${X} additional requests are enqueued.`, "See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html", "or increase socketAcquisitionWarningTimeout=(millis) in the NodeHttpHandler config."), Date.now()
                    }
                return K
            }
            resolveDefaultConfig(q) {
                let {
                    requestTimeout: K,
                    connectionTimeout: Y,
                    socketTimeout: z,
                    httpAgent: w,
                    httpsAgent: H
                } = q || {}, $ = !0, O = 50;
                return {
                    connectionTimeout: Y,
                    requestTimeout: K ?? z,
                    httpAgent: (() => {
                        if (w instanceof dKA.Agent || typeof(w == null ? void 0 : w.destroy) === "function") return w;
                        return new dKA.Agent({
                            keepAlive: !0,
                            maxSockets: 50,
                            ...w
                        })
                    })(),
                    httpsAgent: (() => {
                        if (H instanceof cKA.Agent || typeof(H == null ? void 0 : H.destroy) === "function") return H;
                        return new cKA.Agent({
                            keepAlive: !0,
                            maxSockets: 50,
                            ...H
                        })
                    })()
                }
            }
            destroy() {
                var q, K, Y, z;
                (K = (q = this.config) == null ? void 0 : q.httpAgent) == null || K.destroy(), (z = (Y = this.config) == null ? void 0 : Y.httpsAgent) == null || z.destroy()
            }
            async handle(q, {
                abortSignal: K
            } = {}) {
                if (!this.config) this.config = await this.configProvider;
                let Y;
                return new Promise((z, w) => {
                    let H = void 0,
                        $ = F0(async (f) => {
                            await H, clearTimeout(Y), z(f)
                        }, "resolve"),
                        O = F0(async (f) => {
                            await H, w(f)
                        }, "reject");
                    if (!this.config) throw Error("Node HTTP request handler config is not resolved");
                    if (K == null ? void 0 : K.aborted) {
                        let f = Error("Request aborted");
                        f.name = "AbortError", O(f);
                        return
                    }
                    let _ = q.protocol === "https:",
                        J = _ ? this.config.httpsAgent : this.config.httpAgent;
                    Y = setTimeout(() => {
                        this.socketWarningTimestamp = A.checkSocketUsage(J, this.socketWarningTimestamp)
                    }, this.config.socketAcquisitionWarningTimeout ?? (this.config.requestTimeout ?? 2000) + (this.config.connectionTimeout ?? 1000));
                    let X = (0, lY7.buildQueryString)(q.query || {}),
                        D = void 0;
                    if (q.username != null || q.password != null) {
                        let f = q.username ?? "",
                            Z = q.password ?? "";
                        D = `${f}:${Z}`
                    }
                    let j = q.path;
                    if (X) j += `?${X}`;
                    if (q.fragment) j += `#${q.fragment}`;
                    let M = {
                            headers: q.headers,
                            host: q.hostname,
                            method: q.method,
                            path: j,
                            port: q.port,
                            agent: J,
                            auth: D
                        },
                        W = (_ ? cKA.request : dKA.request)(M, (f) => {
                            let Z = new cY7.HttpResponse({
                                statusCode: f.statusCode || -1,
                                reason: f.statusMessage,
                                headers: iY7(f.headers),
                                body: f
                            });
                            $({
                                response: Z
                            })
                        });
                    if (W.on("error", (f) => {
                            if (Ch5.includes(f.code)) O(Object.assign(f, {
                                name: "TimeoutError"
                            }));
                            else O(f)
                        }), Sh5(W, O, this.config.connectionTimeout), Ih5(W, O, this.config.requestTimeout), K) K.onabort = () => {
                        W.abort();
                        let f = Error("Request aborted");
                        f.name = "AbortError", O(f)
                    };
                    let G = M.agent;
                    if (typeof G === "object" && "keepAlive" in G) hh5(W, {
                        keepAlive: G.keepAlive,
                        keepAliveMsecs: G.keepAliveMsecs
                    });
                    H = lKA(W, q, this.config.requestTimeout).catch(w)
                })
            }
            updateHttpClientConfig(q, K) {
                this.config = void 0, this.configProvider = this.configProvider.then((Y) => {
                    return {
                        ...Y,
                        [q]: K
                    }
                })
            }
            httpHandlerConfigs() {
                return this.config ?? {}
            }
        };
    F0(oY7, "NodeHttpHandler");
    var bh5 = oY7,
        UY7 = h1("http2"),
        uh5 = Rh5(h1("http2")),
        aY7 = class {
            constructor(q) {
                this.sessions = [], this.sessions = q ?? []
            }
            poll() {
                if (this.sessions.length > 0) return this.sessions.shift()
            }
            offerLast(q) {
                this.sessions.push(q)
            }
            contains(q) {
                return this.sessions.includes(q)
            }
            remove(q) {
                this.sessions = this.sessions.filter((K) => K !== q)
            } [Symbol.iterator]() {
                return this.sessions[Symbol.iterator]()
            }
            destroy(q) {
                for (let K of this.sessions)
                    if (K === q) {
                        if (!K.destroyed) K.destroy()
                    }
            }
        };
    F0(aY7, "NodeHttp2ConnectionPool");
    var Bh5 = aY7,
        sY7 = class {
            constructor(q) {
                if (this.sessionCache = new Map, this.config = q, this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw RangeError("maxConcurrency must be greater than zero.")
            }
            lease(q, K) {
                let Y = this.getUrlString(q),
                    z = this.sessionCache.get(Y);
                if (z) {
                    let O = z.poll();
                    if (O && !this.config.disableConcurrency) return O
                }
                let w = uh5.default.connect(Y);
                if (this.config.maxConcurrency) w.settings({
                    maxConcurrentStreams: this.config.maxConcurrency
                }, (O) => {
                    if (O) throw Error("Fail to set maxConcurrentStreams to " + this.config.maxConcurrency + "when creating new session for " + q.destination.toString())
                });
                w.unref();
                let H = F0(() => {
                    w.destroy(), this.deleteSession(Y, w)
                }, "destroySessionCb");
                if (w.on("goaway", H), w.on("error", H), w.on("frameError", H), w.on("close", () => this.deleteSession(Y, w)), K.requestTimeout) w.setTimeout(K.requestTimeout, H);
                let $ = this.sessionCache.get(Y) || new Bh5;
                return $.offerLast(w), this.sessionCache.set(Y, $), w
            }
            deleteSession(q, K) {
                let Y = this.sessionCache.get(q);
                if (!Y) return;
                if (!Y.contains(K)) return;
                Y.remove(K), this.sessionCache.set(q, Y)
            }
            release(q, K) {
                var Y;
                let z = this.getUrlString(q);
                (Y = this.sessionCache.get(z)) == null || Y.offerLast(K)
            }
            destroy() {
                for (let [q, K] of this.sessionCache) {
                    for (let Y of K) {
                        if (!Y.destroyed) Y.destroy();
                        K.remove(Y)
                    }
                    this.sessionCache.delete(q)
                }
            }
            setMaxConcurrentStreams(q) {
                if (this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw RangeError("maxConcurrentStreams must be greater than zero.");
                this.config.maxConcurrency = q
            }
            setDisableConcurrentStreams(q) {
                this.config.disableConcurrency = q
            }
            getUrlString(q) {
                return q.destination.toString()
            }
        };
    F0(sY7, "NodeHttp2ConnectionManager");
    var mh5 = sY7,
        tY7 = class A {
            constructor(q) {
                this.metadata = {
                    handlerProtocol: "h2"
                }, this.connectionManager = new mh5({}), this.configProvider = new Promise((K, Y) => {
                    if (typeof q === "function") q().then((z) => {
                        K(z || {})
                    }).catch(Y);
                    else K(q || {})
                })
            }
            static create(q) {
                if (typeof(q == null ? void 0 : q.handle) === "function") return q;
                return new A(q)
            }
            destroy() {
                this.connectionManager.destroy()
            }
            async handle(q, {
                abortSignal: K
            } = {}) {
                if (!this.config) {
                    if (this.config = await this.configProvider, this.connectionManager.setDisableConcurrentStreams(this.config.disableConcurrentStreams || !1), this.config.maxConcurrentStreams) this.connectionManager.setMaxConcurrentStreams(this.config.maxConcurrentStreams)
                }
                let {
                    requestTimeout: Y,
                    disableConcurrentStreams: z
                } = this.config;
                return new Promise((w, H) => {
                    var $;
                    let O = !1,
                        _ = void 0,
                        J = F0(async (S) => {
                            await _, w(S)
                        }, "resolve"),
                        X = F0(async (S) => {
                            await _, H(S)
                        }, "reject");
                    if (K == null ? void 0 : K.aborted) {
                        O = !0;
                        let S = Error("Request aborted");
                        S.name = "AbortError", X(S);
                        return
                    }
                    let {
                        hostname: D,
                        method: j,
                        port: M,
                        protocol: P,
                        query: W
                    } = q, G = "";
                    if (q.username != null || q.password != null) {
                        let S = q.username ?? "",
                            m = q.password ?? "";
                        G = `${S}:${m}@`
                    }
                    let f = `${P}//${G}${D}${M?`:${M}`:""}`,
                        Z = {
                            destination: new URL(f)
                        },
                        N = this.connectionManager.lease(Z, {
                            requestTimeout: ($ = this.config) == null ? void 0 : $.sessionTimeout,
                            disableConcurrentStreams: z || !1
                        }),
                        T = F0((S) => {
                            if (z) this.destroySession(N);
                            O = !0, X(S)
                        }, "rejectWithDestroy"),
                        k = (0, lY7.buildQueryString)(W || {}),
                        y = q.path;
                    if (k) y += `?${k}`;
                    if (q.fragment) y += `#${q.fragment}`;
                    let B = N.request({
                        ...q.headers,
                        [UY7.constants.HTTP2_HEADER_PATH]: y,
                        [UY7.constants.HTTP2_HEADER_METHOD]: j
                    });
                    if (N.ref(), B.on("response", (S) => {
                            let m = new cY7.HttpResponse({
                                statusCode: S[":status"] || -1,
                                headers: iY7(S),
                                body: B
                            });
                            if (O = !0, J({
                                    response: m
                                }), z) N.close(), this.connectionManager.deleteSession(f, N)
                        }), Y) B.setTimeout(Y, () => {
                        B.close();
                        let S = Error(`Stream timed out because of no activity for ${Y} ms`);
                        S.name = "TimeoutError", T(S)
                    });
                    if (K) K.onabort = () => {
                        B.close();
                        let S = Error("Request aborted");
                        S.name = "AbortError", T(S)
                    };
                    B.on("frameError", (S, m, b) => {
                        T(Error(`Frame type id ${S} in stream id ${b} has failed with code ${m}.`))
                    }), B.on("error", T), B.on("aborted", () => {
                        T(Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${B.rstCode}.`))
                    }), B.on("close", () => {
                        if (N.unref(), z) N.destroy();
                        if (!O) T(Error("Unexpected error: http2 request did not get a response"))
                    }), _ = lKA(B, q, Y)
                })
            }
            updateHttpClientConfig(q, K) {
                this.config = void 0, this.configProvider = this.configProvider.then((Y) => {
                    return {
                        ...Y,
                        [q]: K
                    }
                })
            }
            httpHandlerConfigs() {
                return this.config ?? {}
            }
            destroySession(q) {
                if (!q.destroyed) q.destroy()
            }
        };
    F0(tY7, "NodeHttp2Handler");
    var Fh5 = tY7,
        eY7 = class extends nY7.Writable {
            constructor() {
                super(...arguments);
                this.bufferedBytes = []
            }
            _write(q, K, Y) {
                this.bufferedBytes.push(q), Y()
            }
        };
    F0(eY7, "Collector");
    var Qh5 = eY7,
        gh5 = F0((A) => new Promise((q, K) => {
            let Y = new Qh5;
            A.pipe(Y), A.on("error", (z) => {
                Y.end(), K(z)
            }), Y.on("error", K), Y.on("finish", function() {
                let z = new Uint8Array(Buffer.concat(this.bufferedBytes));
                q(z)
            })
        }), "streamCollector")
})
// @from(Ln 147577, Col 4)
wz7 = R((Yz7) => {
    Object.defineProperty(Yz7, "__esModule", {
        value: !0
    });
    Yz7.sdkStreamMixin = void 0;
    var Uh5 = qz7(),
        ph5 = M81(),
        iKA = h1("stream"),
        dh5 = h1("util"),
        Kz7 = "The stream has already been transformed.",
        ch5 = (A) => {
            var q, K;
            if (!(A instanceof iKA.Readable)) {
                let w = ((K = (q = A === null || A === void 0 ? void 0 : A.__proto__) === null || q === void 0 ? void 0 : q.constructor) === null || K === void 0 ? void 0 : K.name) || A;
                throw Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${w}`)
            }
            let Y = !1,
                z = async () => {
                    if (Y) throw Error(Kz7);
                    return Y = !0, await (0, Uh5.streamCollector)(A)
                };
            return Object.assign(A, {
                transformToByteArray: z,
                transformToString: async (w) => {
                    let H = await z();
                    if (w === void 0 || Buffer.isEncoding(w)) return (0, ph5.fromArrayBuffer)(H.buffer, H.byteOffset, H.byteLength).toString(w);
                    else return new dh5.TextDecoder(w).decode(H)
                },
                transformToWebStream: () => {
                    if (Y) throw Error(Kz7);
                    if (A.readableFlowing !== null) throw Error("The stream has been consumed by other callbacks.");
                    if (typeof iKA.Readable.toWeb !== "function") throw Error("Readable.toWeb() is not supported. Please make sure you are using Node.js >= 17.0.0, or polyfill is available.");
                    return Y = !0, iKA.Readable.toWeb(A)
                }
            })
        };
    Yz7.sdkStreamMixin = ch5
})
// @from(Ln 147615, Col 4)
Dz7 = R((ON2, O56) => {
    var {
        defineProperty: H56,
        getOwnPropertyDescriptor: lh5,
        getOwnPropertyNames: ih5
    } = Object, nh5 = Object.prototype.hasOwnProperty, oKA = (A, q) => H56(A, "name", {
        value: q,
        configurable: !0
    }), rh5 = (A, q) => {
        for (var K in q) H56(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, nKA = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of ih5(q))
                if (!nh5.call(A, z) && z !== K) H56(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = lh5(q, z)) || Y.enumerable
                })
        }
        return A
    }, Hz7 = (A, q, K) => (nKA(A, q, "default"), K && nKA(K, q, "default")), oh5 = (A) => nKA(H56({}, "__esModule", {
        value: !0
    }), A), $56 = {};
    rh5($56, {
        Uint8ArrayBlobAdapter: () => rKA
    });
    O56.exports = oh5($56);
    var $z7 = FKA(),
        Oz7 = yY7();

    function _z7(A, q = "utf-8") {
        if (q === "base64") return (0, $z7.toBase64)(A);
        return (0, Oz7.toUtf8)(A)
    }
    oKA(_z7, "transformToString");

    function Jz7(A, q) {
        if (q === "base64") return rKA.mutate((0, $z7.fromBase64)(A));
        return rKA.mutate((0, Oz7.fromUtf8)(A))
    }
    oKA(Jz7, "transformFromString");
    var Xz7 = class A extends Uint8Array {
        static fromString(q, K = "utf-8") {
            switch (typeof q) {
                case "string":
                    return Jz7(q, K);
                default:
                    throw Error(`Unsupported conversion from ${typeof q} to Uint8ArrayBlobAdapter.`)
            }
        }
        static mutate(q) {
            return Object.setPrototypeOf(q, A.prototype), q
        }
        transformToString(q = "utf-8") {
            return _z7(this, q)
        }
    };
    oKA(Xz7, "Uint8ArrayBlobAdapter");
    var rKA = Xz7;
    Hz7($56, hY7(), O56.exports);
    Hz7($56, wz7(), O56.exports)
})
// @from(Ln 147679, Col 4)
Bz7 = R((_N2, uz7) => {
    var {
        defineProperty: D56,
        getOwnPropertyDescriptor: ah5,
        getOwnPropertyNames: sh5
    } = Object, th5 = Object.prototype.hasOwnProperty, o7 = (A, q) => D56(A, "name", {
        value: q,
        configurable: !0
    }), eh5 = (A, q) => {
        for (var K in q) D56(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, AI5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of sh5(q))
                if (!th5.call(A, z) && z !== K) D56(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = ah5(q, z)) || Y.enumerable
                })
        }
        return A
    }, qI5 = (A) => AI5(D56({}, "__esModule", {
        value: !0
    }), A), Mz7 = {};
    eh5(Mz7, {
        Client: () => YI5,
        Command: () => fz7,
        LazyJsonString: () => eI5,
        NoOpLogger: () => KI5,
        SENSITIVE_STRING: () => HI5,
        ServiceException: () => UI5,
        StringWrapper: () => DS1,
        _json: () => K3A,
        collectBody: () => zI5,
        convertMap: () => Ax5,
        createAggregatedClient: () => $I5,
        dateToUtcString: () => Lz7,
        decorateServiceException: () => yz7,
        emitWarningIfUnsupportedVersion: () => lI5,
        expectBoolean: () => _I5,
        expectByte: () => q3A,
        expectFloat32: () => _56,
        expectInt: () => XI5,
        expectInt32: () => eKA,
        expectLong: () => JS1,
        expectNonNull: () => jI5,
        expectNumber: () => _S1,
        expectObject: () => Nz7,
        expectShort: () => A3A,
        expectString: () => MI5,
        expectUnion: () => PI5,
        extendedEncodeURIComponent: () => X56,
        getArrayIfSingleItem: () => tI5,
        getDefaultClientConfiguration: () => aI5,
        getDefaultExtensionConfiguration: () => Sz7,
        getValueFromTextNode: () => hz7,
        handleFloat: () => ZI5,
        limitedParseDouble: () => w3A,
        limitedParseFloat: () => fI5,
        limitedParseFloat32: () => VI5,
        loadConfigsForDefaultMode: () => cI5,
        logger: () => XS1,
        map: () => $3A,
        parseBoolean: () => OI5,
        parseEpochTimestamp: () => II5,
        parseRfc3339DateTime: () => kI5,
        parseRfc3339DateTimeWithOffset: () => RI5,
        parseRfc7231DateTime: () => hI5,
        resolveDefaultRuntimeConfig: () => sI5,
        resolvedPath: () => wx5,
        serializeFloat: () => Hx5,
        splitEvery: () => bz7,
        strictParseByte: () => kz7,
        strictParseDouble: () => z3A,
        strictParseFloat: () => WI5,
        strictParseFloat32: () => Tz7,
        strictParseInt: () => NI5,
        strictParseInt32: () => TI5,
        strictParseLong: () => Ez7,
        strictParseShort: () => IJ1,
        take: () => qx5,
        throwDefaultError: () => Cz7,
        withBaseException: () => pI5
    });
    uz7.exports = qI5(Mz7);
    var Pz7 = class {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    };
    o7(Pz7, "NoOpLogger");
    var KI5 = Pz7,
        Wz7 = vY7(),
        Gz7 = class {
            constructor(q) {
                this.middlewareStack = (0, Wz7.constructStack)(), this.config = q
            }
            send(q, K, Y) {
                let z = typeof K !== "function" ? K : void 0,
                    w = typeof K === "function" ? K : Y,
                    H = q.resolveMiddleware(this.middlewareStack, this.config, z);
                if (w) H(q).then(($) => w(null, $.output), ($) => w($)).catch(() => {});
                else return H(q).then(($) => $.output)
            }
            destroy() {
                if (this.config.requestHandler.destroy) this.config.requestHandler.destroy()
            }
        };
    o7(Gz7, "Client");
    var YI5 = Gz7,
        aKA = Dz7(),
        zI5 = o7(async (A = new Uint8Array, q) => {
            if (A instanceof Uint8Array) return aKA.Uint8ArrayBlobAdapter.mutate(A);
            if (!A) return aKA.Uint8ArrayBlobAdapter.mutate(new Uint8Array);
            let K = q.streamCollector(A);
            return aKA.Uint8ArrayBlobAdapter.mutate(await K)
        }, "collectBody"),
        tKA = MKA(),
        Zz7 = class {
            constructor() {
                this.middlewareStack = (0, Wz7.constructStack)()
            }
            static classBuilder() {
                return new wI5
            }
            resolveMiddlewareWithContext(q, K, Y, {
                middlewareFn: z,
                clientName: w,
                commandName: H,
                inputFilterSensitiveLog: $,
                outputFilterSensitiveLog: O,
                smithyContext: _,
                additionalContext: J,
                CommandCtor: X
            }) {
                for (let W of z.bind(this)(X, q, K, Y)) this.middlewareStack.use(W);
                let D = q.concat(this.middlewareStack),
                    {
                        logger: j
                    } = K,
                    M = {
                        logger: j,
                        clientName: w,
                        commandName: H,
                        inputFilterSensitiveLog: $,
                        outputFilterSensitiveLog: O,
                        [tKA.SMITHY_CONTEXT_KEY]: {
                            ..._
                        },
                        ...J
                    },
                    {
                        requestHandler: P
                    } = K;
                return D.resolve((W) => P.handle(W.request, Y || {}), M)
            }
        };
    o7(Zz7, "Command");
    var fz7 = Zz7,
        Vz7 = class {
            constructor() {
                this._init = () => {}, this._ep = {}, this._middlewareFn = () => [], this._commandName = "", this._clientName = "", this._additionalContext = {}, this._smithyContext = {}, this._inputFilterSensitiveLog = (q) => q, this._outputFilterSensitiveLog = (q) => q, this._serializer = null, this._deserializer = null
            }
            init(q) {
                this._init = q
            }
            ep(q) {
                return this._ep = q, this
            }
            m(q) {
                return this._middlewareFn = q, this
            }
            s(q, K, Y = {}) {
                return this._smithyContext = {
                    service: q,
                    operation: K,
                    ...Y
                }, this
            }
            c(q = {}) {
                return this._additionalContext = q, this
            }
            n(q, K) {
                return this._clientName = q, this._commandName = K, this
            }
            f(q = (Y) => Y, K = (Y) => Y) {
                return this._inputFilterSensitiveLog = q, this._outputFilterSensitiveLog = K, this
            }
            ser(q) {
                return this._serializer = q, this
            }
            de(q) {
                return this._deserializer = q, this
            }
            build() {
                var q;
                let K = this,
                    Y;
                return Y = (q = class extends fz7 {
                    constructor(...[z]) {
                        super();
                        this.serialize = K._serializer, this.deserialize = K._deserializer, this.input = z ?? {}, K._init(this)
                    }
                    static getEndpointParameterInstructions() {
                        return K._ep
                    }
                    resolveMiddleware(z, w, H) {
                        return this.resolveMiddlewareWithContext(z, w, H, {
                            CommandCtor: Y,
                            middlewareFn: K._middlewareFn,
                            clientName: K._clientName,
                            commandName: K._commandName,
                            inputFilterSensitiveLog: K._inputFilterSensitiveLog,
                            outputFilterSensitiveLog: K._outputFilterSensitiveLog,
                            smithyContext: K._smithyContext,
                            additionalContext: K._additionalContext
                        })
                    }
                }, o7(q, "CommandRef"), q)
            }
        };
    o7(Vz7, "ClassBuilder");
    var wI5 = Vz7,
        HI5 = "***SensitiveInformation***",
        $I5 = o7((A, q) => {
            for (let K of Object.keys(A)) {
                let Y = A[K],
                    z = o7(async function(H, $, O) {
                        let _ = new Y(H);
                        if (typeof $ === "function") this.send(_, $);
                        else if (typeof O === "function") {
                            if (typeof $ !== "object") throw Error(`Expected http options but got ${typeof $}`);
                            this.send(_, $ || {}, O)
                        } else return this.send(_, $)
                    }, "methodImpl"),
                    w = (K[0].toLowerCase() + K.slice(1)).replace(/Command$/, "");
                q.prototype[w] = z
            }
        }, "createAggregatedClient"),
        OI5 = o7((A) => {
            switch (A) {
                case "true":
                    return !0;
                case "false":
                    return !1;
                default:
                    throw Error(`Unable to parse boolean value "${A}"`)
            }
        }, "parseBoolean"),
        _I5 = o7((A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "number") {
                if (A === 0 || A === 1) XS1.warn(J56(`Expected boolean, got ${typeof A}: ${A}`));
                if (A === 0) return !1;
                if (A === 1) return !0
            }
            if (typeof A === "string") {
                let q = A.toLowerCase();
                if (q === "false" || q === "true") XS1.warn(J56(`Expected boolean, got ${typeof A}: ${A}`));
                if (q === "false") return !1;
                if (q === "true") return !0
            }
            if (typeof A === "boolean") return A;
            throw TypeError(`Expected boolean, got ${typeof A}: ${A}`)
        }, "expectBoolean"),
        _S1 = o7((A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "string") {
                let q = parseFloat(A);
                if (!Number.isNaN(q)) {
                    if (String(q) !== String(A)) XS1.warn(J56(`Expected number but observed string: ${A}`));
                    return q
                }
            }
            if (typeof A === "number") return A;
            throw TypeError(`Expected number, got ${typeof A}: ${A}`)
        }, "expectNumber"),
        JI5 = Math.ceil(340282346638528860000000000000000000000),
        _56 = o7((A) => {
            let q = _S1(A);
            if (q !== void 0 && !Number.isNaN(q) && q !== 1 / 0 && q !== -1 / 0) {
                if (Math.abs(q) > JI5) throw TypeError(`Expected 32-bit float, got ${A}`)
            }
            return q
        }, "expectFloat32"),
        JS1 = o7((A) => {
            if (A === null || A === void 0) return;
            if (Number.isInteger(A) && !Number.isNaN(A)) return A;
            throw TypeError(`Expected integer, got ${typeof A}: ${A}`)
        }, "expectLong"),
        XI5 = JS1,
        eKA = o7((A) => Y3A(A, 32), "expectInt32"),
        A3A = o7((A) => Y3A(A, 16), "expectShort"),
        q3A = o7((A) => Y3A(A, 8), "expectByte"),
        Y3A = o7((A, q) => {
            let K = JS1(A);
            if (K !== void 0 && DI5(K, q) !== K) throw TypeError(`Expected ${q}-bit integer, got ${A}`);
            return K
        }, "expectSizedInt"),
        DI5 = o7((A, q) => {
            switch (q) {
                case 32:
                    return Int32Array.of(A)[0];
                case 16:
                    return Int16Array.of(A)[0];
                case 8:
                    return Int8Array.of(A)[0]
            }
        }, "castInt"),
        jI5 = o7((A, q) => {
            if (A === null || A === void 0) {
                if (q) throw TypeError(`Expected a non-null value for ${q}`);
                throw TypeError("Expected a non-null value")
            }
            return A
        }, "expectNonNull"),
        Nz7 = o7((A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "object" && !Array.isArray(A)) return A;
            let q = Array.isArray(A) ? "array" : typeof A;
            throw TypeError(`Expected object, got ${q}: ${A}`)
        }, "expectObject"),
        MI5 = o7((A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "string") return A;
            if (["boolean", "number", "bigint"].includes(typeof A)) return XS1.warn(J56(`Expected string, got ${typeof A}: ${A}`)), String(A);
            throw TypeError(`Expected string, got ${typeof A}: ${A}`)
        }, "expectString"),
        PI5 = o7((A) => {
            if (A === null || A === void 0) return;
            let q = Nz7(A),
                K = Object.entries(q).filter(([, Y]) => Y != null).map(([Y]) => Y);
            if (K.length === 0) throw TypeError("Unions must have exactly one non-null member. None were found.");
            if (K.length > 1) throw TypeError(`Unions must have exactly one non-null member. Keys ${K} were not null.`);
            return q
        }, "expectUnion"),
        z3A = o7((A) => {
            if (typeof A == "string") return _S1(bJ1(A));
            return _S1(A)
        }, "strictParseDouble"),
        WI5 = z3A,
        Tz7 = o7((A) => {
            if (typeof A == "string") return _56(bJ1(A));
            return _56(A)
        }, "strictParseFloat32"),
        GI5 = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g,
        bJ1 = o7((A) => {
            let q = A.match(GI5);
            if (q === null || q[0].length !== A.length) throw TypeError("Expected real number, got implicit NaN");
            return parseFloat(A)
        }, "parseNumber"),
        w3A = o7((A) => {
            if (typeof A == "string") return vz7(A);
            return _S1(A)
        }, "limitedParseDouble"),
        ZI5 = w3A,
        fI5 = w3A,
        VI5 = o7((A) => {
            if (typeof A == "string") return vz7(A);
            return _56(A)
        }, "limitedParseFloat32"),
        vz7 = o7((A) => {
            switch (A) {
                case "NaN":
                    return NaN;
                case "Infinity":
                    return 1 / 0;
                case "-Infinity":
                    return -1 / 0;
                default:
                    throw Error(`Unable to parse float value: ${A}`)
            }
        }, "parseFloatString"),
        Ez7 = o7((A) => {
            if (typeof A === "string") return JS1(bJ1(A));
            return JS1(A)
        }, "strictParseLong"),
        NI5 = Ez7,
        TI5 = o7((A) => {
            if (typeof A === "string") return eKA(bJ1(A));
            return eKA(A)
        }, "strictParseInt32"),
        IJ1 = o7((A) => {
            if (typeof A === "string") return A3A(bJ1(A));
            return A3A(A)
        }, "strictParseShort"),
        kz7 = o7((A) => {
            if (typeof A === "string") return q3A(bJ1(A));
            return q3A(A)
        }, "strictParseByte"),
        J56 = o7((A) => {
            return String(TypeError(A).stack || A).split(`
`).slice(0, 5).filter((q) => !q.includes("stackTraceWarning")).join(`
`)
        }, "stackTraceWarning"),
        XS1 = {
            warn: console.warn
        },
        vI5 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        H3A = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function Lz7(A) {
        let q = A.getUTCFullYear(),
            K = A.getUTCMonth(),
            Y = A.getUTCDay(),
            z = A.getUTCDate(),
            w = A.getUTCHours(),
            H = A.getUTCMinutes(),
            $ = A.getUTCSeconds(),
            O = z < 10 ? `0${z}` : `${z}`,
            _ = w < 10 ? `0${w}` : `${w}`,
            J = H < 10 ? `0${H}` : `${H}`,
            X = $ < 10 ? `0${$}` : `${$}`;
        return `${vI5[Y]}, ${O} ${H3A[K]} ${q} ${_}:${J}:${X} GMT`
    }
    o7(Lz7, "dateToUtcString");
    var EI5 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/),
        kI5 = o7((A) => {
            if (A === null || A === void 0) return;
            if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
            let q = EI5.exec(A);
            if (!q) throw TypeError("Invalid RFC-3339 date-time value");
            let [K, Y, z, w, H, $, O, _] = q, J = IJ1(xJ1(Y)), X = Vu(z, "month", 1, 12), D = Vu(w, "day", 1, 31);
            return OS1(J, X, D, {
                hours: H,
                minutes: $,
                seconds: O,
                fractionalMilliseconds: _
            })
        }, "parseRfc3339DateTime"),
        LI5 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/),
        RI5 = o7((A) => {
            if (A === null || A === void 0) return;
            if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
            let q = LI5.exec(A);
            if (!q) throw TypeError("Invalid RFC-3339 date-time value");
            let [K, Y, z, w, H, $, O, _, J] = q, X = IJ1(xJ1(Y)), D = Vu(z, "month", 1, 12), j = Vu(w, "day", 1, 31), M = OS1(X, D, j, {
                hours: H,
                minutes: $,
                seconds: O,
                fractionalMilliseconds: _
            });
            if (J.toUpperCase() != "Z") M.setTime(M.getTime() - gI5(J));
            return M
        }, "parseRfc3339DateTimeWithOffset"),
        yI5 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
        CI5 = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
        SI5 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/),
        hI5 = o7((A) => {
            if (A === null || A === void 0) return;
            if (typeof A !== "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
            let q = yI5.exec(A);
            if (q) {
                let [K, Y, z, w, H, $, O, _] = q;
                return OS1(IJ1(xJ1(w)), sKA(z), Vu(Y, "day", 1, 31), {
                    hours: H,
                    minutes: $,
                    seconds: O,
                    fractionalMilliseconds: _
                })
            }
            if (q = CI5.exec(A), q) {
                let [K, Y, z, w, H, $, O, _] = q;
                return uI5(OS1(xI5(w), sKA(z), Vu(Y, "day", 1, 31), {
                    hours: H,
                    minutes: $,
                    seconds: O,
                    fractionalMilliseconds: _
                }))
            }
            if (q = SI5.exec(A), q) {
                let [K, Y, z, w, H, $, O, _] = q;
                return OS1(IJ1(xJ1(_)), sKA(Y), Vu(z.trimLeft(), "day", 1, 31), {
                    hours: w,
                    minutes: H,
                    seconds: $,
                    fractionalMilliseconds: O
                })
            }
            throw TypeError("Invalid RFC-7231 date-time value")
        }, "parseRfc7231DateTime"),
        II5 = o7((A) => {
            if (A === null || A === void 0) return;
            let q;
            if (typeof A === "number") q = A;
            else if (typeof A === "string") q = z3A(A);
            else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
            if (Number.isNaN(q) || q === 1 / 0 || q === -1 / 0) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
            return new Date(Math.round(q * 1000))
        }, "parseEpochTimestamp"),
        OS1 = o7((A, q, K, Y) => {
            let z = q - 1;
            return mI5(A, z, K), new Date(Date.UTC(A, z, K, Vu(Y.hours, "hour", 0, 23), Vu(Y.minutes, "minute", 0, 59), Vu(Y.seconds, "seconds", 0, 60), QI5(Y.fractionalMilliseconds)))
        }, "buildDate"),
        xI5 = o7((A) => {
            let q = new Date().getUTCFullYear(),
                K = Math.floor(q / 100) * 100 + IJ1(xJ1(A));
            if (K < q) return K + 100;
            return K
        }, "parseTwoDigitYear"),
        bI5 = 1576800000000,
        uI5 = o7((A) => {
            if (A.getTime() - new Date().getTime() > bI5) return new Date(Date.UTC(A.getUTCFullYear() - 100, A.getUTCMonth(), A.getUTCDate(), A.getUTCHours(), A.getUTCMinutes(), A.getUTCSeconds(), A.getUTCMilliseconds()));
            return A
        }, "adjustRfc850Year"),
        sKA = o7((A) => {
            let q = H3A.indexOf(A);
            if (q < 0) throw TypeError(`Invalid month: ${A}`);
            return q + 1
        }, "parseMonthByShortName"),
        BI5 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        mI5 = o7((A, q, K) => {
            let Y = BI5[q];
            if (q === 1 && FI5(A)) Y = 29;
            if (K > Y) throw TypeError(`Invalid day for ${H3A[q]} in ${A}: ${K}`)
        }, "validateDayOfMonth"),
        FI5 = o7((A) => {
            return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
        }, "isLeapYear"),
        Vu = o7((A, q, K, Y) => {
            let z = kz7(xJ1(A));
            if (z < K || z > Y) throw TypeError(`${q} must be between ${K} and ${Y}, inclusive`);
            return z
        }, "parseDateValue"),
        QI5 = o7((A) => {
            if (A === null || A === void 0) return 0;
            return Tz7("0." + A) * 1000
        }, "parseMilliseconds"),
        gI5 = o7((A) => {
            let q = A[0],
                K = 1;
            if (q == "+") K = 1;
            else if (q == "-") K = -1;
            else throw TypeError(`Offset direction, ${q}, must be "+" or "-"`);
            let Y = Number(A.substring(1, 3)),
                z = Number(A.substring(4, 6));
            return K * (Y * 60 + z) * 60 * 1000
        }, "parseOffsetToMilliseconds"),
        xJ1 = o7((A) => {
            let q = 0;
            while (q < A.length - 1 && A.charAt(q) === "0") q++;
            if (q === 0) return A;
            return A.slice(q)
        }, "stripLeadingZeroes"),
        Rz7 = class A extends Error {
            constructor(q) {
                super(q.message);
                Object.setPrototypeOf(this, A.prototype), this.name = q.name, this.$fault = q.$fault, this.$metadata = q.$metadata
            }
        };
    o7(Rz7, "ServiceException");
    var UI5 = Rz7,
        yz7 = o7((A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        }, "decorateServiceException"),
        Cz7 = o7(({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = dI5(A),
                w = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                H = new K({
                    name: (q == null ? void 0 : q.code) || (q == null ? void 0 : q.Code) || Y || w || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw yz7(H, q)
        }, "throwDefaultError"),
        pI5 = o7((A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                Cz7({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        }, "withBaseException"),
        dI5 = o7((A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }), "deserializeMetadata"),
        cI5 = o7((A) => {
            switch (A) {
                case "standard":
                    return {
                        retryMode: "standard", connectionTimeout: 3100
                    };
                case "in-region":
                    return {
                        retryMode: "standard", connectionTimeout: 1100
                    };
                case "cross-region":
                    return {
                        retryMode: "standard", connectionTimeout: 3100
                    };
                case "mobile":
                    return {
                        retryMode: "standard", connectionTimeout: 30000
                    };
                default:
                    return {}
            }
        }, "loadConfigsForDefaultMode"),
        jz7 = !1,
        lI5 = o7((A) => {
            if (A && !jz7 && parseInt(A.substring(1, A.indexOf("."))) < 14) jz7 = !0
        }, "emitWarningIfUnsupportedVersion"),
        iI5 = o7((A) => {
            let q = [];
            for (let K in tKA.AlgorithmId) {
                let Y = tKA.AlgorithmId[K];
                if (A[Y] === void 0) continue;
                q.push({
                    algorithmId: () => Y,
                    checksumConstructor: () => A[Y]
                })
            }
            return {
                _checksumAlgorithms: q,
                addChecksumAlgorithm(K) {
                    this._checksumAlgorithms.push(K)
                },
                checksumAlgorithms() {
                    return this._checksumAlgorithms
                }
            }
        }, "getChecksumConfiguration"),
        nI5 = o7((A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        }, "resolveChecksumRuntimeConfig"),
        rI5 = o7((A) => {
            let q = A.retryStrategy;
            return {
                setRetryStrategy(K) {
                    q = K
                },
                retryStrategy() {
                    return q
                }
            }
        }, "getRetryConfiguration"),
        oI5 = o7((A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        }, "resolveRetryRuntimeConfig"),
        Sz7 = o7((A) => {
            return {
                ...iI5(A),
                ...rI5(A)
            }
        }, "getDefaultExtensionConfiguration"),
        aI5 = Sz7,
        sI5 = o7((A) => {
            return {
                ...nI5(A),
                ...oI5(A)
            }
        }, "resolveDefaultRuntimeConfig");

    function X56(A) {
        return encodeURIComponent(A).replace(/[!'()*]/g, function(q) {
            return "%" + q.charCodeAt(0).toString(16).toUpperCase()
        })
    }
    o7(X56, "extendedEncodeURIComponent");
    var tI5 = o7((A) => Array.isArray(A) ? A : [A], "getArrayIfSingleItem"),
        hz7 = o7((A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = hz7(A[K]);
            return A
        }, "getValueFromTextNode"),
        DS1 = o7(function() {
            let A = Object.getPrototypeOf(this).constructor,
                K = new(Function.bind.apply(String, [null, ...arguments]));
            return Object.setPrototypeOf(K, A.prototype), K
        }, "StringWrapper");
    DS1.prototype = Object.create(String.prototype, {
        constructor: {
            value: DS1,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    });
    Object.setPrototypeOf(DS1, String);
    var Iz7 = class A extends DS1 {
        deserializeJSON() {
            return JSON.parse(super.toString())
        }
        toJSON() {
            return super.toString()
        }
        static fromObject(q) {
            if (q instanceof A) return q;
            else if (q instanceof String || typeof q === "string") return new A(q);
            return new A(JSON.stringify(q))
        }
    };
    o7(Iz7, "LazyJsonString");
    var eI5 = Iz7;

    function $3A(A, q, K) {
        let Y, z, w;
        if (typeof q > "u" && typeof K > "u") Y = {}, w = A;
        else if (Y = A, typeof q === "function") return z = q, w = K, Kx5(Y, z, w);
        else w = q;
        for (let H of Object.keys(w)) {
            if (!Array.isArray(w[H])) {
                Y[H] = w[H];
                continue
            }
            xz7(Y, null, w, H)
        }
        return Y
    }
    o7($3A, "map");
    var Ax5 = o7((A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        }, "convertMap"),
        qx5 = o7((A, q) => {
            let K = {};
            for (let Y in q) xz7(K, A, q, Y);
            return K
        }, "take"),
        Kx5 = o7((A, q, K) => {
            return $3A(A, Object.entries(K).reduce((Y, [z, w]) => {
                if (Array.isArray(w)) Y[z] = w;
                else if (typeof w === "function") Y[z] = [q, w()];
                else Y[z] = [q, w];
                return Y
            }, {}))
        }, "mapWithFilter"),
        xz7 = o7((A, q, K, Y) => {
            if (q !== null) {
                let H = K[Y];
                if (typeof H === "function") H = [, H];
                let [$ = Yx5, O = zx5, _ = Y] = H;
                if (typeof $ === "function" && $(q[_]) || typeof $ !== "function" && !!$) A[Y] = O(q[_]);
                return
            }
            let [z, w] = K[Y];
            if (typeof w === "function") {
                let H, $ = z === void 0 && (H = w()) != null,
                    O = typeof z === "function" && !!z(void 0) || typeof z !== "function" && !!z;
                if ($) A[Y] = H;
                else if (O) A[Y] = w()
            } else {
                let H = z === void 0 && w != null,
                    $ = typeof z === "function" && !!z(w) || typeof z !== "function" && !!z;
                if (H || $) A[Y] = w
            }
        }, "applyInstruction"),
        Yx5 = o7((A) => A != null, "nonNullish"),
        zx5 = o7((A) => A, "pass"),
        wx5 = o7((A, q, K, Y, z, w) => {
            if (q != null && q[K] !== void 0) {
                let H = Y();
                if (H.length <= 0) throw Error("Empty value provided for input HTTP label: " + K + ".");
                A = A.replace(z, w ? H.split("/").map(($) => X56($)).join("/") : X56(H))
            } else throw Error("No value provided for input HTTP label: " + K + ".");
            return A
        }, "resolvedPath"),
        Hx5 = o7((A) => {
            if (A !== A) return "NaN";
            switch (A) {
                case 1 / 0:
                    return "Infinity";
                case -1 / 0:
                    return "-Infinity";
                default:
                    return A
            }
        }, "serializeFloat"),
        K3A = o7((A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(K3A);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = K3A(A[K])
                }
                return q
            }
            return A
        }, "_json");

    function bz7(A, q, K) {
        if (K <= 0 || !Number.isInteger(K)) throw Error("Invalid number of delimiters (" + K + ") for splitEvery.");
        let Y = A.split(q);
        if (K === 1) return Y;
        let z = [],
            w = "";
        for (let H = 0; H < Y.length; H++) {
            if (w === "") w = Y[H];
            else w += q + Y[H];
            if ((H + 1) % K === 0) z.push(w), w = ""
        }
        if (w !== "") z.push(w);
        return z
    }
    o7(bz7, "splitEvery")
})
// @from(Ln 148504, Col 4)
MH
// @from(Ln 148504, Col 8)
br
// @from(Ln 148504, Col 12)
$x5 = async (A, q) => {
    let K = MH.map({}),
        Y = A.body,
        z = MH.take(Y, {
            message: MH.expectString
        });
    Object.assign(K, z);
    let w = new br.InternalServerException({
        $metadata: j56(A),
        ...K
    });
    return MH.decorateServiceException(w, A.body)
}
// @from(Ln 148516, Col 3)
Ox5 = async (A, q) => {
    let K = MH.map({}),
        Y = A.body,
        z = MH.take(Y, {
            message: MH.expectString,
            originalMessage: MH.expectString,
            originalStatusCode: MH.expectInt32
        });
    Object.assign(K, z);
    let w = new br.ModelStreamErrorException({
        $metadata: j56(A),
        ...K
    });
    return MH.decorateServiceException(w, A.body)
}
// @from(Ln 148530, Col 3)
_x5 = async (A, q) => {
    let K = MH.map({}),
        Y = A.body,
        z = MH.take(Y, {
            message: MH.expectString
        });
    Object.assign(K, z);
    let w = new br.ThrottlingException({
        $metadata: j56(A),
        ...K
    });
    return MH.decorateServiceException(w, A.body)
}
// @from(Ln 148542, Col 3)
Jx5 = async (A, q) => {
    let K = MH.map({}),
        Y = A.body,
        z = MH.take(Y, {
            message: MH.expectString
        });
    Object.assign(K, z);
    let w = new br.ValidationException({
        $metadata: j56(A),
        ...K
    });
    return MH.decorateServiceException(w, A.body)
}
// @from(Ln 148554, Col 3)
mz7 = (A, q) => {
    return q.eventStreamMarshaller.deserialize(A, async (K) => {
        if (K.chunk != null) return {
            chunk: await jx5(K.chunk, q)
        };
        if (K.internalServerException != null) return {
            internalServerException: await Xx5(K.internalServerException, q)
        };
        if (K.modelStreamErrorException != null) return {
            modelStreamErrorException: await Dx5(K.modelStreamErrorException, q)
        };
        if (K.validationException != null) return {
            validationException: await Px5(K.validationException, q)
        };
        if (K.throttlingException != null) return {
            throttlingException: await Mx5(K.throttlingException, q)
        };
        return {
            $unknown: A
        }
    })
}
// @from(Ln 148575, Col 3)
Xx5 = async (A, q) => {
    let K = {
        ...A,
        body: await jS1(A.body, q)
    };
    return $x5(K, q)
}
// @from(Ln 148581, Col 3)
Dx5 = async (A, q) => {
    let K = {
        ...A,
        body: await jS1(A.body, q)
    };
    return Ox5(K, q)
}
// @from(Ln 148587, Col 3)
jx5 = async (A, q) => {
    let K = {},
        Y = await jS1(A.body, q);
    return Object.assign(K, Wx5(Y, q)), K
}
// @from(Ln 148591, Col 3)
Mx5 = async (A, q) => {
    let K = {
        ...A,
        body: await jS1(A.body, q)
    };
    return _x5(K, q)
}
// @from(Ln 148597, Col 3)
Px5 = async (A, q) => {
    let K = {
        ...A,
        body: await jS1(A.body, q)
    };
    return Jx5(K, q)
}
// @from(Ln 148603, Col 3)
Wx5 = (A, q) => {
    return MH.take(A, {
        bytes: q.base64Decoder
    })
}
// @from(Ln 148607, Col 3)
j56 = (A) => ({
    httpStatusCode: A.statusCode,
    requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"] ?? "",
    extendedRequestId: A.headers["x-amz-id-2"] ?? "",
    cfId: A.headers["x-amz-cf-id"] ?? ""
})
// @from(Ln 148612, Col 4)
Gx5 = (A, q) => MH.collectBody(A, q).then((K) => q.utf8Encoder(K))
// @from(Ln 148612, Col 72)
jS1 = (A, q) => Gx5(A, q).then((K) => {
    if (K.length) return JSON.parse(K);
    return {}
})
// @from(Ln 148616, Col 4)
Fz7 = v(() => {
    MH = o(Bz7(), 1), br = o(p86(), 1)
})
// @from(Ln 148620, Col 0)
function Qz7(A) {
    if (A[Symbol.asyncIterator]) return A;
    let q = A.getReader();
    return {
        async next() {
            try {
                let K = await q.read();
                if (K?.done) q.releaseLock();
                return K
            } catch (K) {
                throw q.releaseLock(), K
            }
        },
        async return () {
            let K = q.cancel();
            return q.releaseLock(), await K, {
                done: !0,
                value: void 0
            }
        },
        [Symbol.asyncIterator]() {
            return this
        }
    }
}
// @from(Ln 148645, Col 4)
O3A = v(() => {
    _W()
})
// @from(Ln 148649, Col 0)
function M56(A) {
    return A != null && typeof A === "object" && !Array.isArray(A)
}
// @from(Ln 148652, Col 4)
_3A = (A) => (_3A = Array.isArray, _3A(A))
// @from(Ln 148653, Col 4)
J3A
// @from(Ln 148653, Col 9)
gz7 = (A) => {
        try {
            return JSON.parse(A)
        } catch (q) {
            return
        }
    }
// @from(Ln 148660, Col 4)
MS1 = v(() => {
    O3A();
    J3A = _3A
})
// @from(Ln 148665, Col 0)
function PS1() {}
// @from(Ln 148667, Col 0)
function P56(A, q, K) {
    if (!q || Uz7[A] > Uz7[K]) return PS1;
    else return q[A].bind(q)
}
// @from(Ln 148672, Col 0)
function dz7(A) {
    let q = A.logger,
        K = A.logLevel ?? "off";
    if (!q) return Zx5;
    let Y = pz7.get(q);
    if (Y && Y[0] === K) return Y[1];
    let z = {
        error: P56("error", q, K),
        warn: P56("warn", q, K),
        info: P56("info", q, K),
        debug: P56("debug", q, K)
    };
    return pz7.set(q, [K, z]), z
}
// @from(Ln 148686, Col 4)
Uz7
// @from(Ln 148686, Col 9)
Zx5
// @from(Ln 148686, Col 14)
pz7
// @from(Ln 148687, Col 4)
cz7 = v(() => {
    MS1();
    Uz7 = {
        off: 0,
        error: 200,
        warn: 300,
        info: 400,
        debug: 500
    };
    Zx5 = {
        error: PS1,
        warn: PS1,
        info: PS1,
        debug: PS1
    }, pz7 = new WeakMap
})
// @from(Ln 148704, Col 0)
function Vx5(A) {
    return typeof A === "object" && A !== null && (("name" in A) && A.name === "AbortError" || ("message" in A) && String(A.message).includes("FetchRequestCanceledException"))
}
// @from(Ln 148707, Col 4)
iz7
// @from(Ln 148707, Col 9)
W56
// @from(Ln 148707, Col 14)
nz7
// @from(Ln 148707, Col 19)
X3A = (A) => new TextDecoder("utf-8").decode(A)
// @from(Ln 148708, Col 4)
lz7 = (A) => new TextEncoder().encode(A)
// @from(Ln 148709, Col 4)
fx5 = () => {
        let A = new iz7.EventStreamMarshaller({
            utf8Encoder: X3A,
            utf8Decoder: lz7
        });
        return {
            base64Decoder: W56.fromBase64,
            base64Encoder: W56.toBase64,
            utf8Decoder: lz7,
            utf8Encoder: X3A,
            eventStreamMarshaller: A,
            streamCollector: nz7.streamCollector
        }
    }
// @from(Ln 148723, Col 4)
G56
// @from(Ln 148724, Col 4)
rz7 = v(() => {
    z46();
    dn();
    GV();
    Fz7();
    MS1();
    cz7();
    iz7 = o(wY7(), 1), W56 = o(FKA(), 1), nz7 = o(jKA(), 1);
    G56 = class G56 extends pG {
        static fromSSEResponse(A, q, K) {
            let Y = !1,
                z = K ? dz7(K) : console;
            async function* w() {
                if (!A.body) throw q.abort(), new r7("Attempted to iterate over a response with no body");
                let $ = Qz7(A.body),
                    O = mz7($, fx5());
                for await (let _ of O) if (_.chunk && _.chunk.bytes) yield {
                    event: "chunk",
                    data: X3A(_.chunk.bytes),
                    raw: []
                };
                else if (_.internalServerException) yield {
                    event: "error",
                    data: "InternalServerException",
                    raw: []
                };
                else if (_.modelStreamErrorException) yield {
                    event: "error",
                    data: "ModelStreamErrorException",
                    raw: []
                };
                else if (_.validationException) yield {
                    event: "error",
                    data: "ValidationException",
                    raw: []
                };
                else if (_.throttlingException) yield {
                    event: "error",
                    data: "ThrottlingException",
                    raw: []
                }
            }
            async function* H() {
                if (Y) throw Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
                Y = !0;
                let $ = !1;
                try {
                    for await (let O of w()) {
                        if (O.event === "chunk") try {
                            yield JSON.parse(O.data)
                        } catch (_) {
                            throw z.error("Could not parse message into JSON:", O.data), z.error("From chunk:", O.raw), _
                        }
                        if (O.event === "error") {
                            let _ = O.data,
                                J = gz7(_),
                                X = J ? void 0 : _;
                            throw k4.generate(void 0, J, X, A.headers)
                        }
                    }
                    $ = !0
                } catch (O) {
                    if (Vx5(O)) return;
                    throw O
                } finally {
                    if (!$) q.abort()
                }
            }
            return new G56(H, q)
        }
    }
})
// @from(Ln 148796, Col 4)
D3A = (A) => {
    if (typeof globalThis.process < "u") return globalThis.process.env?.[A]?.trim() ?? void 0;
    if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(A)?.trim();
    return
}
// @from(Ln 148802, Col 0)
function* Nx5(A) {
    if (!A) return;
    if (oz7 in A) {
        let {
            values: Y,
            nulls: z
        } = A;
        yield* Y.entries();
        for (let w of z) yield [w, null];
        return
    }
    let q = !1,
        K;
    if (A instanceof Headers) K = A.entries();
    else if (J3A(A)) K = A;
    else q = !0, K = Object.entries(A ?? {});
    for (let Y of K) {
        let z = Y[0];
        if (typeof z !== "string") throw TypeError("expected header name to be a string");
        let w = J3A(Y[1]) ? Y[1] : [Y[1]],
            H = !1;
        for (let $ of w) {
            if ($ === void 0) continue;
            if (q && !H) H = !0, yield [z, null];
            yield [z, $]
        }
    }
}
// @from(Ln 148830, Col 4)
oz7
// @from(Ln 148830, Col 9)
j3A = (A) => {
    let q = new Headers,
        K = new Set;
    for (let Y of A) {
        let z = new Set;
        for (let [w, H] of Nx5(Y)) {
            let $ = w.toLowerCase();
            if (!z.has($)) q.delete(w), z.add($);
            if (H === null) q.delete(w), K.add($);
            else q.append(w, H), K.delete($)
        }
    }
    return {
        [oz7]: !0,
        values: q,
        nulls: K
    }
}
// @from(Ln 148848, Col 4)
az7 = v(() => {
    MS1();
    oz7 = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 148853, Col 0)
function tz7(A) {
    return A.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent)
}
// @from(Ln 148856, Col 4)
sz7
// @from(Ln 148856, Col 9)
Tx5 = (A = tz7) => function(K, ...Y) {
        if (K.length === 1) return K[0];
        let z = !1,
            w = [],
            H = K.reduce((J, X, D) => {
                if (/[?#]/.test(X)) z = !0;
                let j = Y[D],
                    M = (z ? encodeURIComponent : A)("" + j);
                if (D !== Y.length && (j == null || typeof j === "object" && j.toString === Object.getPrototypeOf(Object.getPrototypeOf(j.hasOwnProperty ?? sz7) ?? sz7)?.toString)) M = j + "", w.push({
                    start: J.length + X.length,
                    length: M.length,
                    error: `Value of type ${Object.prototype.toString.call(j).slice(8,-1)} is not a valid path parameter`
                });
                return J + X + (D === Y.length ? "" : M)
            }, ""),
            $ = H.split(/[?#]/, 1)[0],
            O = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi,
            _;
        while ((_ = O.exec($)) !== null) w.push({
            start: _.index,
            length: _[0].length,
            error: `Value "${_[0]}" can't be safely passed as a path parameter`
        });
        if (w.sort((J, X) => J.start - X.start), w.length > 0) {
            let J = 0,
                X = w.reduce((D, j) => {
                    let M = " ".repeat(j.start - J),
                        P = "^".repeat(j.length);
                    return J = j.start + j.length, D + M + P
                }, "");
            throw new r7(`Path parameters result in path with invalid segments:
${w.map((D)=>D.error).join(`
`)}
${H}
${X}`)
        }
        return H
    }
// @from(Ln 148894, Col 4)
M3A
// @from(Ln 148895, Col 4)
ez7 = v(() => {
    O3A();
    sz7 = Object.freeze(Object.create(null)), M3A = Tx5(tz7)
})
// @from(Ln 148900, Col 0)
function kx5(A) {
    let q = new aT(A);
    return delete q.batches, delete q.countTokens, q
}
// @from(Ln 148905, Col 0)
function Lx5(A) {
    let q = new JW(A);
    return delete q.promptCaching, delete q.messages.batches, delete q.messages.countTokens, q
}
// @from(Ln 148909, Col 4)
vx5 = "bedrock-2023-05-31"
// @from(Ln 148910, Col 4)
Ex5
// @from(Ln 148910, Col 9)
P3A
// @from(Ln 148911, Col 4)
W3A = v(() => {
    xg();
    yy1();
    U57();
    rz7();
    MS1();
    az7();
    ez7();
    xg();
    Ex5 = new Set(["/v1/complete", "/v1/messages", "/v1/messages?beta=true"]);
    P3A = class P3A extends _z {
        constructor({
            awsRegion: A = D3A("AWS_REGION") ?? "us-east-1",
            baseURL: q = D3A("ANTHROPIC_BEDROCK_BASE_URL") ?? `https://bedrock-runtime.${A}.amazonaws.com`,
            awsSecretKey: K = null,
            awsAccessKey: Y = null,
            awsSessionToken: z = null,
            providerChainResolver: w = null,
            ...H
        } = {}) {
            super({
                baseURL: q,
                ...H
            });
            this.skipAuth = !1, this.messages = kx5(this), this.completions = new rn(this), this.beta = Lx5(this), this.awsSecretKey = K, this.awsAccessKey = Y, this.awsRegion = A, this.awsSessionToken = z, this.skipAuth = H.skipAuth ?? !1, this.providerChainResolver = w
        }
        validateHeaders() {}
        async prepareRequest(A, {
            url: q,
            options: K
        }) {
            if (this.skipAuth) return;
            let Y = this.awsRegion;
            if (!Y) throw Error("Expected `awsRegion` option to be passed to the client or the `AWS_REGION` environment variable to be present");
            let z = await g57(A, {
                url: q,
                regionName: Y,
                awsAccessKey: this.awsAccessKey,
                awsSecretKey: this.awsSecretKey,
                awsSessionToken: this.awsSessionToken,
                fetchOptions: this.fetchOptions,
                providerChainResolver: this.providerChainResolver
            });
            A.headers = j3A([z, A.headers]).values
        }
        async buildRequest(A) {
            if (A.__streamClass = G56, M56(A.body)) A.body = {
                ...A.body
            };
            if (M56(A.body)) {
                if (!A.body.anthropic_version) A.body.anthropic_version = vx5;
                if (A.headers && !A.body.anthropic_beta) {
                    let q = j3A([A.headers]).values.get("anthropic-beta");
                    if (q != null) A.body.anthropic_beta = q.split(",")
                }
            }
            if (Ex5.has(A.path) && A.method === "post") {
                if (!M56(A.body)) throw Error("Expected request body to be an object for post /v1/messages");
                let q = A.body.model;
                A.body.model = void 0;
                let K = A.body.stream;
                if (A.body.stream = void 0, K) A.path = M3A`/model/${q}/invoke-with-response-stream`;
                else A.path = M3A`/model/${q}/invoke`
            }
            return super.buildRequest(A)
        }
    }
})
// @from(Ln 148979, Col 4)
A27 = {}
// @from(Ln 148985, Col 4)
q27 = v(() => {
    W3A();
    W3A()
})
// @from(Ln 148989, Col 4)
Z56 = v(() => {
    _W()
})
// @from(Ln 148992, Col 4)
G3A = (A) => (G3A = Array.isArray, G3A(A))
// @from(Ln 148993, Col 4)
Z3A
// @from(Ln 148994, Col 4)
f56 = v(() => {
    Z56();
    Z3A = G3A
})
// @from(Ln 148999, Col 0)
function* yx5(A) {
    if (!A) return;
    if (K27 in A) {
        let {
            values: Y,
            nulls: z
        } = A;
        yield* Y.entries();
        for (let w of z) yield [w, null];
        return
    }
    let q = !1,
        K;
    if (A instanceof Headers) K = A.entries();
    else if (Z3A(A)) K = A;
    else q = !0, K = Object.entries(A ?? {});
    for (let Y of K) {
        let z = Y[0];
        if (typeof z !== "string") throw TypeError("expected header name to be a string");
        let w = Z3A(Y[1]) ? Y[1] : [Y[1]],
            H = !1;
        for (let $ of w) {
            if ($ === void 0) continue;
            if (q && !H) H = !0, yield [z, null];
            yield [z, $]
        }
    }
}
// @from(Ln 149027, Col 4)
K27
// @from(Ln 149027, Col 9)
f3A = (A) => {
    let q = new Headers,
        K = new Set;
    for (let Y of A) {
        let z = new Set;
        for (let [w, H] of yx5(Y)) {
            let $ = w.toLowerCase();
            if (!z.has($)) q.delete(w), z.add($);
            if (H === null) q.delete(w), K.add($);
            else q.append(w, H), K.delete($)
        }
    }
    return {
        [K27]: !0,
        values: q,
        nulls: K
    }
}
// @from(Ln 149045, Col 4)
Y27 = v(() => {
    f56();
    K27 = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 149049, Col 4)
z27 = v(() => {
    Z56()
})
// @from(Ln 149052, Col 4)
V56 = (A) => {
    if (typeof globalThis.process < "u") return globalThis.process.env?.[A]?.trim() ?? void 0;
    if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(A)?.trim();
    return
}
// @from(Ln 149057, Col 4)
w27 = v(() => {
    f56()
})
// @from(Ln 149060, Col 4)
H27 = v(() => {
    f56();
    z27();
    w27()
})
// @from(Ln 149066, Col 0)
function Cx5(A) {
    let q = new aT(A);
    return delete q.batches, q
}
// @from(Ln 149071, Col 0)
function Sx5(A) {
    let q = new JW(A);
    return delete q.messages.batches, q
}
// @from(Ln 149075, Col 4)
V3A
// @from(Ln 149076, Col 4)
N3A = v(() => {
    Y27();
    Z56();
    H27();
    xg();
    xg();
    yy1();
    V3A = class V3A extends oC {
        constructor({
            baseURL: A = V56("ANTHROPIC_FOUNDRY_BASE_URL"),
            apiKey: q = V56("ANTHROPIC_FOUNDRY_API_KEY"),
            resource: K = V56("ANTHROPIC_FOUNDRY_RESOURCE"),
            azureADTokenProvider: Y,
            dangerouslyAllowBrowser: z,
            ...w
        } = {}) {
            if (typeof Y === "function") z = !0;
            if (!Y && !q) throw new r7("Missing credentials. Please pass one of `apiKey` and `azureTokenProvider`, or set the `ANTHROPIC_FOUNDRY_API_KEY` environment variable.");
            if (Y && q) throw new r7("The `apiKey` and `azureADTokenProvider` arguments are mutually exclusive; only one can be passed at a time.");
            if (!A) {
                if (!K) throw new r7("Must provide one of the `baseURL` or `resource` arguments, or the `ANTHROPIC_FOUNDRY_RESOURCE` environment variable");
                A = `https://${K}.services.ai.azure.com/anthropic/`
            } else if (K) throw new r7("baseURL and resource are mutually exclusive");
            super({
                apiKey: Y ?? q,
                baseURL: A,
                ...w,
                ...z !== void 0 ? {
                    dangerouslyAllowBrowser: z
                } : {}
            });
            this.resource = null, this.messages = Cx5(this), this.beta = Sx5(this), this.models = void 0
        }
        async authHeaders() {
            if (typeof this._options.apiKey === "function") {
                let A;
                try {
                    A = await this._options.apiKey()
                } catch (q) {
                    if (q instanceof r7) throw q;
                    throw new r7(`Failed to get token from azureADTokenProvider: ${q.message}`, {
                        cause: q
                    })
                }
                if (typeof A !== "string" || !A) throw new r7(`Expected azureADTokenProvider function argument to return a string but it returned ${A}`);
                return f3A([{
                    Authorization: `Bearer ${A}`
                }])
            }
            if (typeof this._options.apiKey === "string") return f3A([{
                "x-api-key": this.apiKey
            }]);
            return
        }
        validateHeaders() {
            return
        }
    }
})
// @from(Ln 149135, Col 4)
$27 = {}
// @from(Ln 149141, Col 4)
O27 = v(() => {
    N3A();
    N3A()
})
// @from(Ln 149145, Col 4)
N56 = "4.10.1"
// @from(Ln 149146, Col 4)
h71 = "04b07795-8ddb-461a-bbee-02f9e1bf7b46"
// @from(Ln 149147, Col 4)
_27 = "common"
// @from(Ln 149148, Col 4)
Nu
// @from(Ln 149148, Col 8)
WS1
// @from(Ln 149148, Col 13)
J27 = "login.microsoftonline.com"
// @from(Ln 149149, Col 4)
X27
// @from(Ln 149149, Col 9)
D27 = "cae"
// @from(Ln 149150, Col 4)
j27 = "nocae"
// @from(Ln 149151, Col 4)
M27 = "msal.cache"
// @from(Ln 149152, Col 4)
Tu = v(() => {
    (function(A) {
        A.AzureChina = "https://login.chinacloudapi.cn", A.AzureGermany = "https://login.microsoftonline.de", A.AzureGovernment = "https://login.microsoftonline.us", A.AzurePublicCloud = "https://login.microsoftonline.com"
    })(Nu || (Nu = {}));
    WS1 = Nu.AzurePublicCloud, X27 = ["*"]
})