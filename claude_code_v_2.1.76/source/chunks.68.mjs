
// @from(Ln 171696, Col 4)
Vu7 = x((zz2, Nu7) => {
    var {
        defineProperty: EH1,
        getOwnPropertyDescriptor: y79,
        getOwnPropertyNames: L79
    } = Object, R79 = Object.prototype.hasOwnProperty, bM8 = (A, q) => EH1(A, "name", {
        value: q,
        configurable: !0
    }), h79 = (A, q) => {
        for (var K in q) EH1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, S79 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of L79(q))
                if (!R79.call(A, z) && z !== K) EH1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = y79(q, z)) || Y.enumerable
                })
        }
        return A
    }, C79 = (A) => S79(EH1({}, "__esModule", {
        value: !0
    }), A), Gu7 = {};
    h79(Gu7, {
        EventStreamMarshaller: () => vu7,
        eventStreamSerdeProvider: () => x79
    });
    Nu7.exports = C79(Gu7);
    var I79 = Zu7(),
        b79 = x6("stream");
    async function* fu7(A) {
        let q = !1,
            K = !1,
            Y = [];
        A.on("error", (z) => {
            if (!q) q = !0;
            if (z) throw z
        }), A.on("data", (z) => {
            Y.push(z)
        }), A.on("end", () => {
            q = !0
        });
        while (!K) {
            let z = await new Promise((_) => setTimeout(() => _(Y.shift()), 0));
            if (z) yield z;
            K = q && Y.length === 0
        }
    }
    bM8(fu7, "readabletoIterable");
    var Tu7 = class {
        constructor({
            utf8Encoder: q,
            utf8Decoder: K
        }) {
            this.universalMarshaller = new I79.EventStreamMarshaller({
                utf8Decoder: K,
                utf8Encoder: q
            })
        }
        deserialize(q, K) {
            let Y = typeof q[Symbol.asyncIterator] === "function" ? q : fu7(q);
            return this.universalMarshaller.deserialize(Y, K)
        }
        serialize(q, K) {
            return b79.Readable.from(this.universalMarshaller.serialize(q, K))
        }
    };
    bM8(Tu7, "EventStreamMarshaller");
    var vu7 = Tu7,
        x79 = bM8((A) => new vu7(A), "eventStreamSerdeProvider")
})
// @from(Ln 171769, Col 4)
yu7 = x((ku7) => {
    Object.defineProperty(ku7, "__esModule", {
        value: !0
    });
    ku7.fromBase64 = void 0;
    var u79 = V46(),
        m79 = /^[A-Za-z0-9+/]*={0,2}$/,
        B79 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!m79.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, u79.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    ku7.fromBase64 = B79
})
// @from(Ln 171784, Col 4)
Cu7 = x((wz2, Su7) => {
    var {
        defineProperty: yH1,
        getOwnPropertyDescriptor: g79,
        getOwnPropertyNames: F79
    } = Object, p79 = Object.prototype.hasOwnProperty, xM8 = (A, q) => yH1(A, "name", {
        value: q,
        configurable: !0
    }), Q79 = (A, q) => {
        for (var K in q) yH1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, U79 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of F79(q))
                if (!p79.call(A, z) && z !== K) yH1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = g79(q, z)) || Y.enumerable
                })
        }
        return A
    }, d79 = (A) => U79(yH1({}, "__esModule", {
        value: !0
    }), A), Lu7 = {};
    Q79(Lu7, {
        fromUtf8: () => hu7,
        toUint8Array: () => c79,
        toUtf8: () => l79
    });
    Su7.exports = d79(Lu7);
    var Ru7 = V46(),
        hu7 = xM8((A) => {
            let q = (0, Ru7.fromString)(A, "utf8");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
        }, "fromUtf8"),
        c79 = xM8((A) => {
            if (typeof A === "string") return hu7(A);
            if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return new Uint8Array(A)
        }, "toUint8Array"),
        l79 = xM8((A) => {
            if (typeof A === "string") return A;
            if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
            return (0, Ru7.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
        }, "toUtf8")
})
// @from(Ln 171831, Col 4)
xu7 = x((Iu7) => {
    Object.defineProperty(Iu7, "__esModule", {
        value: !0
    });
    Iu7.toBase64 = void 0;
    var i79 = V46(),
        n79 = Cu7(),
        r79 = (A) => {
            let q;
            if (typeof A === "string") q = (0, n79.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, i79.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    Iu7.toBase64 = r79
})
// @from(Ln 171847, Col 4)
BM8 = x(($z2, LH1) => {
    var {
        defineProperty: uu7,
        getOwnPropertyDescriptor: o79,
        getOwnPropertyNames: a79
    } = Object, s79 = Object.prototype.hasOwnProperty, uM8 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of a79(q))
                if (!s79.call(A, z) && z !== K) uu7(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = o79(q, z)) || Y.enumerable
                })
        }
        return A
    }, mu7 = (A, q, K) => (uM8(A, q, "default"), K && uM8(K, q, "default")), t79 = (A) => uM8(uu7({}, "__esModule", {
        value: !0
    }), A), mM8 = {};
    LH1.exports = t79(mM8);
    mu7(mM8, yu7(), LH1.exports);
    mu7(mM8, xu7(), LH1.exports)
})
// @from(Ln 171868, Col 4)
Qu7 = x((Hz2, pu7) => {
    var {
        defineProperty: RH1,
        getOwnPropertyDescriptor: e79,
        getOwnPropertyNames: A49
    } = Object, q49 = Object.prototype.hasOwnProperty, pL = (A, q) => RH1(A, "name", {
        value: q,
        configurable: !0
    }), K49 = (A, q) => {
        for (var K in q) RH1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Y49 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of A49(q))
                if (!q49.call(A, z) && z !== K) RH1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = e79(q, z)) || Y.enumerable
                })
        }
        return A
    }, z49 = (A) => Y49(RH1({}, "__esModule", {
        value: !0
    }), A), Fu7 = {};
    K49(Fu7, {
        constructStack: () => gM8
    });
    pu7.exports = z49(Fu7);
    var BK6 = pL((A, q) => {
            let K = [];
            if (A) K.push(A);
            if (q)
                for (let Y of q) K.push(Y);
            return K
        }, "getAllAliases"),
        vs = pL((A, q) => {
            return `${A||"anonymous"}${q&&q.length>0?` (a.k.a. ${q.join(",")})`:""}`
        }, "getMiddlewareNameWithAliases"),
        gM8 = pL(() => {
            let A = [],
                q = [],
                K = !1,
                Y = new Set,
                z = pL((J) => J.sort((M, D) => Bu7[D.step] - Bu7[M.step] || gu7[D.priority || "normal"] - gu7[M.priority || "normal"]), "sort"),
                _ = pL((J) => {
                    let M = !1,
                        D = pL((X) => {
                            let P = BK6(X.name, X.aliases);
                            if (P.includes(J)) {
                                M = !0;
                                for (let W of P) Y.delete(W);
                                return !1
                            }
                            return !0
                        }, "filterCb");
                    return A = A.filter(D), q = q.filter(D), M
                }, "removeByName"),
                w = pL((J) => {
                    let M = !1,
                        D = pL((X) => {
                            if (X.middleware === J) {
                                M = !0;
                                for (let P of BK6(X.name, X.aliases)) Y.delete(P);
                                return !1
                            }
                            return !0
                        }, "filterCb");
                    return A = A.filter(D), q = q.filter(D), M
                }, "removeByReference"),
                O = pL((J) => {
                    var M;
                    return A.forEach((D) => {
                        J.add(D.middleware, {
                            ...D
                        })
                    }), q.forEach((D) => {
                        J.addRelativeTo(D.middleware, {
                            ...D
                        })
                    }), (M = J.identifyOnResolve) == null || M.call(J, j.identifyOnResolve()), J
                }, "cloneTo"),
                $ = pL((J) => {
                    let M = [];
                    return J.before.forEach((D) => {
                        if (D.before.length === 0 && D.after.length === 0) M.push(D);
                        else M.push(...$(D))
                    }), M.push(J), J.after.reverse().forEach((D) => {
                        if (D.before.length === 0 && D.after.length === 0) M.push(D);
                        else M.push(...$(D))
                    }), M
                }, "expandRelativeMiddlewareList"),
                H = pL((J = !1) => {
                    let M = [],
                        D = [],
                        X = {};
                    return A.forEach((W) => {
                        let Z = {
                            ...W,
                            before: [],
                            after: []
                        };
                        for (let G of BK6(Z.name, Z.aliases)) X[G] = Z;
                        M.push(Z)
                    }), q.forEach((W) => {
                        let Z = {
                            ...W,
                            before: [],
                            after: []
                        };
                        for (let G of BK6(Z.name, Z.aliases)) X[G] = Z;
                        D.push(Z)
                    }), D.forEach((W) => {
                        if (W.toMiddleware) {
                            let Z = X[W.toMiddleware];
                            if (Z === void 0) {
                                if (J) return;
                                throw Error(`${W.toMiddleware} is not found when adding ${vs(W.name,W.aliases)} middleware ${W.relation} ${W.toMiddleware}`)
                            }
                            if (W.relation === "after") Z.after.push(W);
                            if (W.relation === "before") Z.before.push(W)
                        }
                    }), z(M).map($).reduce((W, Z) => {
                        return W.push(...Z), W
                    }, [])
                }, "getMiddlewareList"),
                j = {
                    add: (J, M = {}) => {
                        let {
                            name: D,
                            override: X,
                            aliases: P
                        } = M, W = {
                            step: "initialize",
                            priority: "normal",
                            middleware: J,
                            ...M
                        }, Z = BK6(D, P);
                        if (Z.length > 0) {
                            if (Z.some((G) => Y.has(G))) {
                                if (!X) throw Error(`Duplicate middleware name '${vs(D,P)}'`);
                                for (let G of Z) {
                                    let f = A.findIndex((N) => {
                                        var V;
                                        return N.name === G || ((V = N.aliases) == null ? void 0 : V.some((L) => L === G))
                                    });
                                    if (f === -1) continue;
                                    let v = A[f];
                                    if (v.step !== W.step || W.priority !== v.priority) throw Error(`"${vs(v.name,v.aliases)}" middleware with ${v.priority} priority in ${v.step} step cannot be overridden by "${vs(D,P)}" middleware with ${W.priority} priority in ${W.step} step.`);
                                    A.splice(f, 1)
                                }
                            }
                            for (let G of Z) Y.add(G)
                        }
                        A.push(W)
                    },
                    addRelativeTo: (J, M) => {
                        let {
                            name: D,
                            override: X,
                            aliases: P
                        } = M, W = {
                            middleware: J,
                            ...M
                        }, Z = BK6(D, P);
                        if (Z.length > 0) {
                            if (Z.some((G) => Y.has(G))) {
                                if (!X) throw Error(`Duplicate middleware name '${vs(D,P)}'`);
                                for (let G of Z) {
                                    let f = q.findIndex((N) => {
                                        var V;
                                        return N.name === G || ((V = N.aliases) == null ? void 0 : V.some((L) => L === G))
                                    });
                                    if (f === -1) continue;
                                    let v = q[f];
                                    if (v.toMiddleware !== W.toMiddleware || v.relation !== W.relation) throw Error(`"${vs(v.name,v.aliases)}" middleware ${v.relation} "${v.toMiddleware}" middleware cannot be overridden by "${vs(D,P)}" middleware ${W.relation} "${W.toMiddleware}" middleware.`);
                                    q.splice(f, 1)
                                }
                            }
                            for (let G of Z) Y.add(G)
                        }
                        q.push(W)
                    },
                    clone: () => O(gM8()),
                    use: (J) => {
                        J.applyToStack(j)
                    },
                    remove: (J) => {
                        if (typeof J === "string") return _(J);
                        else return w(J)
                    },
                    removeByTag: (J) => {
                        let M = !1,
                            D = pL((X) => {
                                let {
                                    tags: P,
                                    name: W,
                                    aliases: Z
                                } = X;
                                if (P && P.includes(J)) {
                                    let G = BK6(W, Z);
                                    for (let f of G) Y.delete(f);
                                    return M = !0, !1
                                }
                                return !0
                            }, "filterCb");
                        return A = A.filter(D), q = q.filter(D), M
                    },
                    concat: (J) => {
                        var M;
                        let D = O(gM8());
                        return D.use(J), D.identifyOnResolve(K || D.identifyOnResolve() || (((M = J.identifyOnResolve) == null ? void 0 : M.call(J)) ?? !1)), D
                    },
                    applyToStack: O,
                    identify: () => {
                        return H(!0).map((J) => {
                            let M = J.step ?? J.relation + " " + J.toMiddleware;
                            return vs(J.name, J.aliases) + " - " + M
                        })
                    },
                    identifyOnResolve(J) {
                        if (typeof J === "boolean") K = J;
                        return K
                    },
                    resolve: (J, M) => {
                        for (let D of H().map((X) => X.middleware).reverse()) J = D(J, M);
                        if (K) console.log(j.identify());
                        return J
                    }
                };
            return j
        }, "constructStack"),
        Bu7 = {
            initialize: 5,
            serialize: 4,
            build: 3,
            finalizeRequest: 2,
            deserialize: 1
        },
        gu7 = {
            high: 3,
            normal: 2,
            low: 1
        }
})
// @from(Ln 172113, Col 4)
iu7 = x((jz2, lu7) => {
    var {
        defineProperty: hH1,
        getOwnPropertyDescriptor: _49,
        getOwnPropertyNames: w49
    } = Object, O49 = Object.prototype.hasOwnProperty, FM8 = (A, q) => hH1(A, "name", {
        value: q,
        configurable: !0
    }), $49 = (A, q) => {
        for (var K in q) hH1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, H49 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of w49(q))
                if (!O49.call(A, z) && z !== K) hH1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = _49(q, z)) || Y.enumerable
                })
        }
        return A
    }, j49 = (A) => H49(hH1({}, "__esModule", {
        value: !0
    }), A), Uu7 = {};
    $49(Uu7, {
        fromUtf8: () => cu7,
        toUint8Array: () => J49,
        toUtf8: () => M49
    });
    lu7.exports = j49(Uu7);
    var du7 = V46(),
        cu7 = FM8((A) => {
            let q = (0, du7.fromString)(A, "utf8");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
        }, "fromUtf8"),
        J49 = FM8((A) => {
            if (typeof A === "string") return cu7(A);
            if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return new Uint8Array(A)
        }, "toUint8Array"),
        M49 = FM8((A) => {
            if (typeof A === "string") return A;
            if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
            return (0, du7.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
        }, "toUtf8")
})
// @from(Ln 172160, Col 4)
ou7 = x((nu7) => {
    Object.defineProperty(nu7, "__esModule", {
        value: !0
    });
    nu7.getAwsChunkedEncodingStream = void 0;
    var D49 = x6("stream"),
        X49 = (A, q) => {
            let {
                base64Encoder: K,
                bodyLengthChecker: Y,
                checksumAlgorithmFn: z,
                checksumLocationName: _,
                streamHasher: w
            } = q, O = K !== void 0 && z !== void 0 && _ !== void 0 && w !== void 0, $ = O ? w(z, A) : void 0, H = new D49.Readable({
                read: () => {}
            });
            return A.on("data", (j) => {
                let J = Y(j) || 0;
                H.push(`${J.toString(16)}\r
`), H.push(j), H.push(`\r
`)
            }), A.on("end", async () => {
                if (H.push(`0\r
`), O) {
                    let j = K(await $);
                    H.push(`${_}:${j}\r
`), H.push(`\r
`)
                }
                H.push(null)
            }), H
        };
    nu7.getAwsChunkedEncodingStream = X49
})
// @from(Ln 172194, Col 4)
eu7 = x((Mz2, tu7) => {
    var {
        defineProperty: SH1,
        getOwnPropertyDescriptor: P49,
        getOwnPropertyNames: W49
    } = Object, Z49 = Object.prototype.hasOwnProperty, pM8 = (A, q) => SH1(A, "name", {
        value: q,
        configurable: !0
    }), G49 = (A, q) => {
        for (var K in q) SH1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, f49 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of W49(q))
                if (!Z49.call(A, z) && z !== K) SH1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = P49(q, z)) || Y.enumerable
                })
        }
        return A
    }, T49 = (A) => f49(SH1({}, "__esModule", {
        value: !0
    }), A), au7 = {};
    G49(au7, {
        escapeUri: () => su7,
        escapeUriPath: () => N49
    });
    tu7.exports = T49(au7);
    var su7 = pM8((A) => encodeURIComponent(A).replace(/[!'()*]/g, v49), "escapeUri"),
        v49 = pM8((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
        N49 = pM8((A) => A.split("/").map(su7).join("/"), "escapeUriPath")
})
// @from(Ln 172228, Col 4)
Ym7 = x((Dz2, Km7) => {
    var {
        defineProperty: CH1,
        getOwnPropertyDescriptor: V49,
        getOwnPropertyNames: k49
    } = Object, E49 = Object.prototype.hasOwnProperty, y49 = (A, q) => CH1(A, "name", {
        value: q,
        configurable: !0
    }), L49 = (A, q) => {
        for (var K in q) CH1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, R49 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of k49(q))
                if (!E49.call(A, z) && z !== K) CH1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = V49(q, z)) || Y.enumerable
                })
        }
        return A
    }, h49 = (A) => R49(CH1({}, "__esModule", {
        value: !0
    }), A), Am7 = {};
    L49(Am7, {
        buildQueryString: () => qm7
    });
    Km7.exports = h49(Am7);
    var QM8 = eu7();

    function qm7(A) {
        let q = [];
        for (let K of Object.keys(A).sort()) {
            let Y = A[K];
            if (K = (0, QM8.escapeUri)(K), Array.isArray(Y))
                for (let z = 0, _ = Y.length; z < _; z++) q.push(`${K}=${(0,QM8.escapeUri)(Y[z])}`);
            else {
                let z = K;
                if (Y || typeof Y === "string") z += `=${(0,QM8.escapeUri)(Y)}`;
                q.push(z)
            }
        }
        return q.join("&")
    }
    y49(qm7, "buildQueryString")
})
// @from(Ln 172275, Col 4)
fm7 = x((Xz2, Gm7) => {
    var {
        create: S49,
        defineProperty: Ym6,
        getOwnPropertyDescriptor: C49,
        getOwnPropertyNames: I49,
        getPrototypeOf: b49
    } = Object, x49 = Object.prototype.hasOwnProperty, HX = (A, q) => Ym6(A, "name", {
        value: q,
        configurable: !0
    }), u49 = (A, q) => {
        for (var K in q) Ym6(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, wm7 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of I49(q))
                if (!x49.call(A, z) && z !== K) Ym6(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = C49(q, z)) || Y.enumerable
                })
        }
        return A
    }, m49 = (A, q, K) => (K = A != null ? S49(b49(A)) : {}, wm7(q || !A || !A.__esModule ? Ym6(K, "default", {
        value: A,
        enumerable: !0
    }) : K, A)), B49 = (A) => wm7(Ym6({}, "__esModule", {
        value: !0
    }), A), Om7 = {};
    u49(Om7, {
        DEFAULT_REQUEST_TIMEOUT: () => U49,
        NodeHttp2Handler: () => n49,
        NodeHttpHandler: () => d49,
        streamCollector: () => o49
    });
    Gm7.exports = B49(Om7);
    var $m7 = DJ8(),
        Hm7 = Ym7(),
        UM8 = x6("http"),
        dM8 = x6("https"),
        g49 = ["ECONNRESET", "EPIPE", "ETIMEDOUT"],
        jm7 = HX((A) => {
            let q = {};
            for (let K of Object.keys(A)) {
                let Y = A[K];
                q[K] = Array.isArray(Y) ? Y.join(",") : Y
            }
            return q
        }, "getTransformedHeaders"),
        F49 = HX((A, q, K = 0) => {
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
        p49 = HX((A, {
            keepAlive: q,
            keepAliveMsecs: K
        }) => {
            if (q !== !0) return;
            A.on("socket", (Y) => {
                Y.setKeepAlive(q, K || 0)
            })
        }, "setSocketKeepAlive"),
        Q49 = HX((A, q, K = 0) => {
            A.setTimeout(K, () => {
                A.destroy(), q(Object.assign(Error(`Connection timed out after ${K} ms`), {
                    name: "TimeoutError"
                }))
            })
        }, "setSocketTimeout"),
        Jm7 = x6("stream"),
        zm7 = 1000;
    async function cM8(A, q, K = zm7) {
        let Y = q.headers ?? {},
            z = Y.Expect || Y.expect,
            _ = -1,
            w = !1;
        if (z === "100-continue") await Promise.race([new Promise((O) => {
            _ = Number(setTimeout(O, Math.max(zm7, K)))
        }), new Promise((O) => {
            A.on("continue", () => {
                clearTimeout(_), O()
            }), A.on("error", () => {
                w = !0, clearTimeout(_), O()
            })
        })]);
        if (!w) Mm7(A, q.body)
    }
    HX(cM8, "writeRequestBody");

    function Mm7(A, q) {
        if (q instanceof Jm7.Readable) {
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
    HX(Mm7, "writeBody");
    var U49 = 0,
        Dm7 = class A {
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
                    sockets: _,
                    requests: w,
                    maxSockets: O
                } = q;
                if (typeof O !== "number" || O === 1 / 0) return K;
                let $ = 15000;
                if (Date.now() - $ < K) return K;
                if (_ && w)
                    for (let H in _) {
                        let j = ((Y = _[H]) == null ? void 0 : Y.length) ?? 0,
                            J = ((z = w[H]) == null ? void 0 : z.length) ?? 0;
                        if (j >= O && J >= 2 * O) return console.warn("@smithy/node-http-handler:WARN", `socket usage at capacity=${j} and ${J} additional requests are enqueued.`, "See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html", "or increase socketAcquisitionWarningTimeout=(millis) in the NodeHttpHandler config."), Date.now()
                    }
                return K
            }
            resolveDefaultConfig(q) {
                let {
                    requestTimeout: K,
                    connectionTimeout: Y,
                    socketTimeout: z,
                    httpAgent: _,
                    httpsAgent: w
                } = q || {}, O = !0, $ = 50;
                return {
                    connectionTimeout: Y,
                    requestTimeout: K ?? z,
                    httpAgent: (() => {
                        if (_ instanceof UM8.Agent || typeof(_ == null ? void 0 : _.destroy) === "function") return _;
                        return new UM8.Agent({
                            keepAlive: !0,
                            maxSockets: 50,
                            ..._
                        })
                    })(),
                    httpsAgent: (() => {
                        if (w instanceof dM8.Agent || typeof(w == null ? void 0 : w.destroy) === "function") return w;
                        return new dM8.Agent({
                            keepAlive: !0,
                            maxSockets: 50,
                            ...w
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
                return new Promise((z, _) => {
                    let w = void 0,
                        O = HX(async (G) => {
                            await w, clearTimeout(Y), z(G)
                        }, "resolve"),
                        $ = HX(async (G) => {
                            await w, _(G)
                        }, "reject");
                    if (!this.config) throw Error("Node HTTP request handler config is not resolved");
                    if (K == null ? void 0 : K.aborted) {
                        let G = Error("Request aborted");
                        G.name = "AbortError", $(G);
                        return
                    }
                    let H = q.protocol === "https:",
                        j = H ? this.config.httpsAgent : this.config.httpAgent;
                    Y = setTimeout(() => {
                        this.socketWarningTimestamp = A.checkSocketUsage(j, this.socketWarningTimestamp)
                    }, this.config.socketAcquisitionWarningTimeout ?? (this.config.requestTimeout ?? 2000) + (this.config.connectionTimeout ?? 1000));
                    let J = (0, Hm7.buildQueryString)(q.query || {}),
                        M = void 0;
                    if (q.username != null || q.password != null) {
                        let G = q.username ?? "",
                            f = q.password ?? "";
                        M = `${G}:${f}`
                    }
                    let D = q.path;
                    if (J) D += `?${J}`;
                    if (q.fragment) D += `#${q.fragment}`;
                    let X = {
                            headers: q.headers,
                            host: q.hostname,
                            method: q.method,
                            path: D,
                            port: q.port,
                            agent: j,
                            auth: M
                        },
                        W = (H ? dM8.request : UM8.request)(X, (G) => {
                            let f = new $m7.HttpResponse({
                                statusCode: G.statusCode || -1,
                                reason: G.statusMessage,
                                headers: jm7(G.headers),
                                body: G
                            });
                            O({
                                response: f
                            })
                        });
                    if (W.on("error", (G) => {
                            if (g49.includes(G.code)) $(Object.assign(G, {
                                name: "TimeoutError"
                            }));
                            else $(G)
                        }), F49(W, $, this.config.connectionTimeout), Q49(W, $, this.config.requestTimeout), K) K.onabort = () => {
                        W.abort();
                        let G = Error("Request aborted");
                        G.name = "AbortError", $(G)
                    };
                    let Z = X.agent;
                    if (typeof Z === "object" && "keepAlive" in Z) p49(W, {
                        keepAlive: Z.keepAlive,
                        keepAliveMsecs: Z.keepAliveMsecs
                    });
                    w = cM8(W, q, this.config.requestTimeout).catch(_)
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
    HX(Dm7, "NodeHttpHandler");
    var d49 = Dm7,
        _m7 = x6("http2"),
        c49 = m49(x6("http2")),
        Xm7 = class {
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
    HX(Xm7, "NodeHttp2ConnectionPool");
    var l49 = Xm7,
        Pm7 = class {
            constructor(q) {
                if (this.sessionCache = new Map, this.config = q, this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw RangeError("maxConcurrency must be greater than zero.")
            }
            lease(q, K) {
                let Y = this.getUrlString(q),
                    z = this.sessionCache.get(Y);
                if (z) {
                    let $ = z.poll();
                    if ($ && !this.config.disableConcurrency) return $
                }
                let _ = c49.default.connect(Y);
                if (this.config.maxConcurrency) _.settings({
                    maxConcurrentStreams: this.config.maxConcurrency
                }, ($) => {
                    if ($) throw Error("Fail to set maxConcurrentStreams to " + this.config.maxConcurrency + "when creating new session for " + q.destination.toString())
                });
                _.unref();
                let w = HX(() => {
                    _.destroy(), this.deleteSession(Y, _)
                }, "destroySessionCb");
                if (_.on("goaway", w), _.on("error", w), _.on("frameError", w), _.on("close", () => this.deleteSession(Y, _)), K.requestTimeout) _.setTimeout(K.requestTimeout, w);
                let O = this.sessionCache.get(Y) || new l49;
                return O.offerLast(_), this.sessionCache.set(Y, O), _
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
    HX(Pm7, "NodeHttp2ConnectionManager");
    var i49 = Pm7,
        Wm7 = class A {
            constructor(q) {
                this.metadata = {
                    handlerProtocol: "h2"
                }, this.connectionManager = new i49({}), this.configProvider = new Promise((K, Y) => {
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
                return new Promise((_, w) => {
                    var O;
                    let $ = !1,
                        H = void 0,
                        j = HX(async (R) => {
                            await H, _(R)
                        }, "resolve"),
                        J = HX(async (R) => {
                            await H, w(R)
                        }, "reject");
                    if (K == null ? void 0 : K.aborted) {
                        $ = !0;
                        let R = Error("Request aborted");
                        R.name = "AbortError", J(R);
                        return
                    }
                    let {
                        hostname: M,
                        method: D,
                        port: X,
                        protocol: P,
                        query: W
                    } = q, Z = "";
                    if (q.username != null || q.password != null) {
                        let R = q.username ?? "",
                            u = q.password ?? "";
                        Z = `${R}:${u}@`
                    }
                    let G = `${P}//${Z}${M}${X?`:${X}`:""}`,
                        f = {
                            destination: new URL(G)
                        },
                        v = this.connectionManager.lease(f, {
                            requestTimeout: (O = this.config) == null ? void 0 : O.sessionTimeout,
                            disableConcurrentStreams: z || !1
                        }),
                        N = HX((R) => {
                            if (z) this.destroySession(v);
                            $ = !0, J(R)
                        }, "rejectWithDestroy"),
                        V = (0, Hm7.buildQueryString)(W || {}),
                        L = q.path;
                    if (V) L += `?${V}`;
                    if (q.fragment) L += `#${q.fragment}`;
                    let h = v.request({
                        ...q.headers,
                        [_m7.constants.HTTP2_HEADER_PATH]: L,
                        [_m7.constants.HTTP2_HEADER_METHOD]: D
                    });
                    if (v.ref(), h.on("response", (R) => {
                            let u = new $m7.HttpResponse({
                                statusCode: R[":status"] || -1,
                                headers: jm7(R),
                                body: h
                            });
                            if ($ = !0, j({
                                    response: u
                                }), z) v.close(), this.connectionManager.deleteSession(G, v)
                        }), Y) h.setTimeout(Y, () => {
                        h.close();
                        let R = Error(`Stream timed out because of no activity for ${Y} ms`);
                        R.name = "TimeoutError", N(R)
                    });
                    if (K) K.onabort = () => {
                        h.close();
                        let R = Error("Request aborted");
                        R.name = "AbortError", N(R)
                    };
                    h.on("frameError", (R, u, I) => {
                        N(Error(`Frame type id ${R} in stream id ${I} has failed with code ${u}.`))
                    }), h.on("error", N), h.on("aborted", () => {
                        N(Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${h.rstCode}.`))
                    }), h.on("close", () => {
                        if (v.unref(), z) v.destroy();
                        if (!$) N(Error("Unexpected error: http2 request did not get a response"))
                    }), H = cM8(h, q, Y)
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
    HX(Wm7, "NodeHttp2Handler");
    var n49 = Wm7,
        Zm7 = class extends Jm7.Writable {
            constructor() {
                super(...arguments);
                this.bufferedBytes = []
            }
            _write(q, K, Y) {
                this.bufferedBytes.push(q), Y()
            }
        };
    HX(Zm7, "Collector");
    var r49 = Zm7,
        o49 = HX((A) => new Promise((q, K) => {
            let Y = new r49;
            A.pipe(Y), A.on("error", (z) => {
                Y.end(), K(z)
            }), Y.on("error", K), Y.on("finish", function() {
                let z = new Uint8Array(Buffer.concat(this.bufferedBytes));
                q(z)
            })
        }), "streamCollector")
})
// @from(Ln 172780, Col 4)
Vm7 = x((vm7) => {
    Object.defineProperty(vm7, "__esModule", {
        value: !0
    });
    vm7.sdkStreamMixin = void 0;
    var a49 = fm7(),
        s49 = V46(),
        lM8 = x6("stream"),
        t49 = x6("util"),
        Tm7 = "The stream has already been transformed.",
        e49 = (A) => {
            var q, K;
            if (!(A instanceof lM8.Readable)) {
                let _ = ((K = (q = A === null || A === void 0 ? void 0 : A.__proto__) === null || q === void 0 ? void 0 : q.constructor) === null || K === void 0 ? void 0 : K.name) || A;
                throw Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${_}`)
            }
            let Y = !1,
                z = async () => {
                    if (Y) throw Error(Tm7);
                    return Y = !0, await (0, a49.streamCollector)(A)
                };
            return Object.assign(A, {
                transformToByteArray: z,
                transformToString: async (_) => {
                    let w = await z();
                    if (_ === void 0 || Buffer.isEncoding(_)) return (0, s49.fromArrayBuffer)(w.buffer, w.byteOffset, w.byteLength).toString(_);
                    else return new t49.TextDecoder(_).decode(w)
                },
                transformToWebStream: () => {
                    if (Y) throw Error(Tm7);
                    if (A.readableFlowing !== null) throw Error("The stream has been consumed by other callbacks.");
                    if (typeof lM8.Readable.toWeb !== "function") throw Error("Readable.toWeb() is not supported. Please make sure you are using Node.js >= 17.0.0, or polyfill is available.");
                    return Y = !0, lM8.Readable.toWeb(A)
                }
            })
        };
    vm7.sdkStreamMixin = e49
})
// @from(Ln 172818, Col 4)
Sm7 = x((Wz2, xH1) => {
    var {
        defineProperty: IH1,
        getOwnPropertyDescriptor: Aq9,
        getOwnPropertyNames: qq9
    } = Object, Kq9 = Object.prototype.hasOwnProperty, rM8 = (A, q) => IH1(A, "name", {
        value: q,
        configurable: !0
    }), Yq9 = (A, q) => {
        for (var K in q) IH1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, iM8 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of qq9(q))
                if (!Kq9.call(A, z) && z !== K) IH1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = Aq9(q, z)) || Y.enumerable
                })
        }
        return A
    }, km7 = (A, q, K) => (iM8(A, q, "default"), K && iM8(K, q, "default")), zq9 = (A) => iM8(IH1({}, "__esModule", {
        value: !0
    }), A), bH1 = {};
    Yq9(bH1, {
        Uint8ArrayBlobAdapter: () => nM8
    });
    xH1.exports = zq9(bH1);
    var Em7 = BM8(),
        ym7 = iu7();

    function Lm7(A, q = "utf-8") {
        if (q === "base64") return (0, Em7.toBase64)(A);
        return (0, ym7.toUtf8)(A)
    }
    rM8(Lm7, "transformToString");

    function Rm7(A, q) {
        if (q === "base64") return nM8.mutate((0, Em7.fromBase64)(A));
        return nM8.mutate((0, ym7.fromUtf8)(A))
    }
    rM8(Rm7, "transformFromString");
    var hm7 = class A extends Uint8Array {
        static fromString(q, K = "utf-8") {
            switch (typeof q) {
                case "string":
                    return Rm7(q, K);
                default:
                    throw Error(`Unsupported conversion from ${typeof q} to Uint8ArrayBlobAdapter.`)
            }
        }
        static mutate(q) {
            return Object.setPrototypeOf(q, A.prototype), q
        }
        transformToString(q = "utf-8") {
            return Lm7(this, q)
        }
    };
    rM8(hm7, "Uint8ArrayBlobAdapter");
    var nM8 = hm7;
    km7(bH1, ou7(), xH1.exports);
    km7(bH1, Vm7(), xH1.exports)
})
// @from(Ln 172882, Col 4)
AB7 = x((Zz2, em7) => {
    var {
        defineProperty: gH1,
        getOwnPropertyDescriptor: _q9,
        getOwnPropertyNames: wq9
    } = Object, Oq9 = Object.prototype.hasOwnProperty, r7 = (A, q) => gH1(A, "name", {
        value: q,
        configurable: !0
    }), $q9 = (A, q) => {
        for (var K in q) gH1(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Hq9 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of wq9(q))
                if (!Oq9.call(A, z) && z !== K) gH1(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = _q9(q, z)) || Y.enumerable
                })
        }
        return A
    }, jq9 = (A) => Hq9(gH1({}, "__esModule", {
        value: !0
    }), A), Im7 = {};
    $q9(Im7, {
        Client: () => Mq9,
        Command: () => Bm7,
        LazyJsonString: () => $K9,
        NoOpLogger: () => Jq9,
        SENSITIVE_STRING: () => Pq9,
        ServiceException: () => aq9,
        StringWrapper: () => $m6,
        _json: () => qD8,
        collectBody: () => Dq9,
        convertMap: () => HK9,
        createAggregatedClient: () => Wq9,
        dateToUtcString: () => cm7,
        decorateServiceException: () => im7,
        emitWarningIfUnsupportedVersion: () => AK9,
        expectBoolean: () => Gq9,
        expectByte: () => AD8,
        expectFloat32: () => uH1,
        expectInt: () => Tq9,
        expectInt32: () => tM8,
        expectLong: () => wm6,
        expectNonNull: () => Nq9,
        expectNumber: () => _m6,
        expectObject: () => Fm7,
        expectShort: () => eM8,
        expectString: () => Vq9,
        expectUnion: () => kq9,
        extendedEncodeURIComponent: () => BH1,
        getArrayIfSingleItem: () => OK9,
        getDefaultClientConfiguration: () => _K9,
        getDefaultExtensionConfiguration: () => rm7,
        getValueFromTextNode: () => om7,
        handleFloat: () => Lq9,
        limitedParseDouble: () => zD8,
        limitedParseFloat: () => Rq9,
        limitedParseFloat32: () => hq9,
        loadConfigsForDefaultMode: () => eq9,
        logger: () => Om6,
        map: () => wD8,
        parseBoolean: () => Zq9,
        parseEpochTimestamp: () => Qq9,
        parseRfc3339DateTime: () => xq9,
        parseRfc3339DateTimeWithOffset: () => mq9,
        parseRfc7231DateTime: () => pq9,
        resolveDefaultRuntimeConfig: () => wK9,
        resolvedPath: () => XK9,
        serializeFloat: () => PK9,
        splitEvery: () => tm7,
        strictParseByte: () => dm7,
        strictParseDouble: () => YD8,
        strictParseFloat: () => Eq9,
        strictParseFloat32: () => pm7,
        strictParseInt: () => Sq9,
        strictParseInt32: () => Cq9,
        strictParseLong: () => Um7,
        strictParseShort: () => AP6,
        take: () => jK9,
        throwDefaultError: () => nm7,
        withBaseException: () => sq9
    });
    em7.exports = jq9(Im7);
    var bm7 = class {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    };
    r7(bm7, "NoOpLogger");
    var Jq9 = bm7,
        xm7 = Qu7(),
        um7 = class {
            constructor(q) {
                this.middlewareStack = (0, xm7.constructStack)(), this.config = q
            }
            send(q, K, Y) {
                let z = typeof K !== "function" ? K : void 0,
                    _ = typeof K === "function" ? K : Y,
                    w = q.resolveMiddleware(this.middlewareStack, this.config, z);
                if (_) w(q).then((O) => _(null, O.output), (O) => _(O)).catch(() => {});
                else return w(q).then((O) => O.output)
            }
            destroy() {
                if (this.config.requestHandler.destroy) this.config.requestHandler.destroy()
            }
        };
    r7(um7, "Client");
    var Mq9 = um7,
        oM8 = Sm7(),
        Dq9 = r7(async (A = new Uint8Array, q) => {
            if (A instanceof Uint8Array) return oM8.Uint8ArrayBlobAdapter.mutate(A);
            if (!A) return oM8.Uint8ArrayBlobAdapter.mutate(new Uint8Array);
            let K = q.streamCollector(A);
            return oM8.Uint8ArrayBlobAdapter.mutate(await K)
        }, "collectBody"),
        sM8 = MJ8(),
        mm7 = class {
            constructor() {
                this.middlewareStack = (0, xm7.constructStack)()
            }
            static classBuilder() {
                return new Xq9
            }
            resolveMiddlewareWithContext(q, K, Y, {
                middlewareFn: z,
                clientName: _,
                commandName: w,
                inputFilterSensitiveLog: O,
                outputFilterSensitiveLog: $,
                smithyContext: H,
                additionalContext: j,
                CommandCtor: J
            }) {
                for (let W of z.bind(this)(J, q, K, Y)) this.middlewareStack.use(W);
                let M = q.concat(this.middlewareStack),
                    {
                        logger: D
                    } = K,
                    X = {
                        logger: D,
                        clientName: _,
                        commandName: w,
                        inputFilterSensitiveLog: O,
                        outputFilterSensitiveLog: $,
                        [sM8.SMITHY_CONTEXT_KEY]: {
                            ...H
                        },
                        ...j
                    },
                    {
                        requestHandler: P
                    } = K;
                return M.resolve((W) => P.handle(W.request, Y || {}), X)
            }
        };
    r7(mm7, "Command");
    var Bm7 = mm7,
        gm7 = class {
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
                return Y = (q = class extends Bm7 {
                    constructor(...[z]) {
                        super();
                        this.serialize = K._serializer, this.deserialize = K._deserializer, this.input = z ?? {}, K._init(this)
                    }
                    static getEndpointParameterInstructions() {
                        return K._ep
                    }
                    resolveMiddleware(z, _, w) {
                        return this.resolveMiddlewareWithContext(z, _, w, {
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
                }, r7(q, "CommandRef"), q)
            }
        };
    r7(gm7, "ClassBuilder");
    var Xq9 = gm7,
        Pq9 = "***SensitiveInformation***",
        Wq9 = r7((A, q) => {
            for (let K of Object.keys(A)) {
                let Y = A[K],
                    z = r7(async function(w, O, $) {
                        let H = new Y(w);
                        if (typeof O === "function") this.send(H, O);
                        else if (typeof $ === "function") {
                            if (typeof O !== "object") throw Error(`Expected http options but got ${typeof O}`);
                            this.send(H, O || {}, $)
                        } else return this.send(H, O)
                    }, "methodImpl"),
                    _ = (K[0].toLowerCase() + K.slice(1)).replace(/Command$/, "");
                q.prototype[_] = z
            }
        }, "createAggregatedClient"),
        Zq9 = r7((A) => {
            switch (A) {
                case "true":
                    return !0;
                case "false":
                    return !1;
                default:
                    throw Error(`Unable to parse boolean value "${A}"`)
            }
        }, "parseBoolean"),
        Gq9 = r7((A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "number") {
                if (A === 0 || A === 1) Om6.warn(mH1(`Expected boolean, got ${typeof A}: ${A}`));
                if (A === 0) return !1;
                if (A === 1) return !0
            }
            if (typeof A === "string") {
                let q = A.toLowerCase();
                if (q === "false" || q === "true") Om6.warn(mH1(`Expected boolean, got ${typeof A}: ${A}`));
                if (q === "false") return !1;
                if (q === "true") return !0
            }
            if (typeof A === "boolean") return A;
            throw TypeError(`Expected boolean, got ${typeof A}: ${A}`)
        }, "expectBoolean"),
        _m6 = r7((A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "string") {
                let q = parseFloat(A);
                if (!Number.isNaN(q)) {
                    if (String(q) !== String(A)) Om6.warn(mH1(`Expected number but observed string: ${A}`));
                    return q
                }
            }
            if (typeof A === "number") return A;
            throw TypeError(`Expected number, got ${typeof A}: ${A}`)
        }, "expectNumber"),
        fq9 = Math.ceil(340282346638528860000000000000000000000),
        uH1 = r7((A) => {
            let q = _m6(A);
            if (q !== void 0 && !Number.isNaN(q) && q !== 1 / 0 && q !== -1 / 0) {
                if (Math.abs(q) > fq9) throw TypeError(`Expected 32-bit float, got ${A}`)
            }
            return q
        }, "expectFloat32"),
        wm6 = r7((A) => {
            if (A === null || A === void 0) return;
            if (Number.isInteger(A) && !Number.isNaN(A)) return A;
            throw TypeError(`Expected integer, got ${typeof A}: ${A}`)
        }, "expectLong"),
        Tq9 = wm6,
        tM8 = r7((A) => KD8(A, 32), "expectInt32"),
        eM8 = r7((A) => KD8(A, 16), "expectShort"),
        AD8 = r7((A) => KD8(A, 8), "expectByte"),
        KD8 = r7((A, q) => {
            let K = wm6(A);
            if (K !== void 0 && vq9(K, q) !== K) throw TypeError(`Expected ${q}-bit integer, got ${A}`);
            return K
        }, "expectSizedInt"),
        vq9 = r7((A, q) => {
            switch (q) {
                case 32:
                    return Int32Array.of(A)[0];
                case 16:
                    return Int16Array.of(A)[0];
                case 8:
                    return Int8Array.of(A)[0]
            }
        }, "castInt"),
        Nq9 = r7((A, q) => {
            if (A === null || A === void 0) {
                if (q) throw TypeError(`Expected a non-null value for ${q}`);
                throw TypeError("Expected a non-null value")
            }
            return A
        }, "expectNonNull"),
        Fm7 = r7((A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "object" && !Array.isArray(A)) return A;
            let q = Array.isArray(A) ? "array" : typeof A;
            throw TypeError(`Expected object, got ${q}: ${A}`)
        }, "expectObject"),
        Vq9 = r7((A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "string") return A;
            if (["boolean", "number", "bigint"].includes(typeof A)) return Om6.warn(mH1(`Expected string, got ${typeof A}: ${A}`)), String(A);
            throw TypeError(`Expected string, got ${typeof A}: ${A}`)
        }, "expectString"),
        kq9 = r7((A) => {
            if (A === null || A === void 0) return;
            let q = Fm7(A),
                K = Object.entries(q).filter(([, Y]) => Y != null).map(([Y]) => Y);
            if (K.length === 0) throw TypeError("Unions must have exactly one non-null member. None were found.");
            if (K.length > 1) throw TypeError(`Unions must have exactly one non-null member. Keys ${K} were not null.`);
            return q
        }, "expectUnion"),
        YD8 = r7((A) => {
            if (typeof A == "string") return _m6(KP6(A));
            return _m6(A)
        }, "strictParseDouble"),
        Eq9 = YD8,
        pm7 = r7((A) => {
            if (typeof A == "string") return uH1(KP6(A));
            return uH1(A)
        }, "strictParseFloat32"),
        yq9 = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g,
        KP6 = r7((A) => {
            let q = A.match(yq9);
            if (q === null || q[0].length !== A.length) throw TypeError("Expected real number, got implicit NaN");
            return parseFloat(A)
        }, "parseNumber"),
        zD8 = r7((A) => {
            if (typeof A == "string") return Qm7(A);
            return _m6(A)
        }, "limitedParseDouble"),
        Lq9 = zD8,
        Rq9 = zD8,
        hq9 = r7((A) => {
            if (typeof A == "string") return Qm7(A);
            return uH1(A)
        }, "limitedParseFloat32"),
        Qm7 = r7((A) => {
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
        Um7 = r7((A) => {
            if (typeof A === "string") return wm6(KP6(A));
            return wm6(A)
        }, "strictParseLong"),
        Sq9 = Um7,
        Cq9 = r7((A) => {
            if (typeof A === "string") return tM8(KP6(A));
            return tM8(A)
        }, "strictParseInt32"),
        AP6 = r7((A) => {
            if (typeof A === "string") return eM8(KP6(A));
            return eM8(A)
        }, "strictParseShort"),
        dm7 = r7((A) => {
            if (typeof A === "string") return AD8(KP6(A));
            return AD8(A)
        }, "strictParseByte"),
        mH1 = r7((A) => {
            return String(TypeError(A).stack || A).split(`
`).slice(0, 5).filter((q) => !q.includes("stackTraceWarning")).join(`
`)
        }, "stackTraceWarning"),
        Om6 = {
            warn: console.warn
        },
        Iq9 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        _D8 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function cm7(A) {
        let q = A.getUTCFullYear(),
            K = A.getUTCMonth(),
            Y = A.getUTCDay(),
            z = A.getUTCDate(),
            _ = A.getUTCHours(),
            w = A.getUTCMinutes(),
            O = A.getUTCSeconds(),
            $ = z < 10 ? `0${z}` : `${z}`,
            H = _ < 10 ? `0${_}` : `${_}`,
            j = w < 10 ? `0${w}` : `${w}`,
            J = O < 10 ? `0${O}` : `${O}`;
        return `${Iq9[Y]}, ${$} ${_D8[K]} ${q} ${H}:${j}:${J} GMT`
    }
    r7(cm7, "dateToUtcString");
    var bq9 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/),
        xq9 = r7((A) => {
            if (A === null || A === void 0) return;
            if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
            let q = bq9.exec(A);
            if (!q) throw TypeError("Invalid RFC-3339 date-time value");
            let [K, Y, z, _, w, O, $, H] = q, j = AP6(qP6(Y)), J = um(z, "month", 1, 12), M = um(_, "day", 1, 31);
            return zm6(j, J, M, {
                hours: w,
                minutes: O,
                seconds: $,
                fractionalMilliseconds: H
            })
        }, "parseRfc3339DateTime"),
        uq9 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/),
        mq9 = r7((A) => {
            if (A === null || A === void 0) return;
            if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
            let q = uq9.exec(A);
            if (!q) throw TypeError("Invalid RFC-3339 date-time value");
            let [K, Y, z, _, w, O, $, H, j] = q, J = AP6(qP6(Y)), M = um(z, "month", 1, 12), D = um(_, "day", 1, 31), X = zm6(J, M, D, {
                hours: w,
                minutes: O,
                seconds: $,
                fractionalMilliseconds: H
            });
            if (j.toUpperCase() != "Z") X.setTime(X.getTime() - oq9(j));
            return X
        }, "parseRfc3339DateTimeWithOffset"),
        Bq9 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
        gq9 = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
        Fq9 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/),
        pq9 = r7((A) => {
            if (A === null || A === void 0) return;
            if (typeof A !== "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
            let q = Bq9.exec(A);
            if (q) {
                let [K, Y, z, _, w, O, $, H] = q;
                return zm6(AP6(qP6(_)), aM8(z), um(Y, "day", 1, 31), {
                    hours: w,
                    minutes: O,
                    seconds: $,
                    fractionalMilliseconds: H
                })
            }
            if (q = gq9.exec(A), q) {
                let [K, Y, z, _, w, O, $, H] = q;
                return cq9(zm6(Uq9(_), aM8(z), um(Y, "day", 1, 31), {
                    hours: w,
                    minutes: O,
                    seconds: $,
                    fractionalMilliseconds: H
                }))
            }
            if (q = Fq9.exec(A), q) {
                let [K, Y, z, _, w, O, $, H] = q;
                return zm6(AP6(qP6(H)), aM8(Y), um(z.trimLeft(), "day", 1, 31), {
                    hours: _,
                    minutes: w,
                    seconds: O,
                    fractionalMilliseconds: $
                })
            }
            throw TypeError("Invalid RFC-7231 date-time value")
        }, "parseRfc7231DateTime"),
        Qq9 = r7((A) => {
            if (A === null || A === void 0) return;
            let q;
            if (typeof A === "number") q = A;
            else if (typeof A === "string") q = YD8(A);
            else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
            if (Number.isNaN(q) || q === 1 / 0 || q === -1 / 0) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
            return new Date(Math.round(q * 1000))
        }, "parseEpochTimestamp"),
        zm6 = r7((A, q, K, Y) => {
            let z = q - 1;
            return iq9(A, z, K), new Date(Date.UTC(A, z, K, um(Y.hours, "hour", 0, 23), um(Y.minutes, "minute", 0, 59), um(Y.seconds, "seconds", 0, 60), rq9(Y.fractionalMilliseconds)))
        }, "buildDate"),
        Uq9 = r7((A) => {
            let q = new Date().getUTCFullYear(),
                K = Math.floor(q / 100) * 100 + AP6(qP6(A));
            if (K < q) return K + 100;
            return K
        }, "parseTwoDigitYear"),
        dq9 = 1576800000000,
        cq9 = r7((A) => {
            if (A.getTime() - new Date().getTime() > dq9) return new Date(Date.UTC(A.getUTCFullYear() - 100, A.getUTCMonth(), A.getUTCDate(), A.getUTCHours(), A.getUTCMinutes(), A.getUTCSeconds(), A.getUTCMilliseconds()));
            return A
        }, "adjustRfc850Year"),
        aM8 = r7((A) => {
            let q = _D8.indexOf(A);
            if (q < 0) throw TypeError(`Invalid month: ${A}`);
            return q + 1
        }, "parseMonthByShortName"),
        lq9 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        iq9 = r7((A, q, K) => {
            let Y = lq9[q];
            if (q === 1 && nq9(A)) Y = 29;
            if (K > Y) throw TypeError(`Invalid day for ${_D8[q]} in ${A}: ${K}`)
        }, "validateDayOfMonth"),
        nq9 = r7((A) => {
            return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
        }, "isLeapYear"),
        um = r7((A, q, K, Y) => {
            let z = dm7(qP6(A));
            if (z < K || z > Y) throw TypeError(`${q} must be between ${K} and ${Y}, inclusive`);
            return z
        }, "parseDateValue"),
        rq9 = r7((A) => {
            if (A === null || A === void 0) return 0;
            return pm7("0." + A) * 1000
        }, "parseMilliseconds"),
        oq9 = r7((A) => {
            let q = A[0],
                K = 1;
            if (q == "+") K = 1;
            else if (q == "-") K = -1;
            else throw TypeError(`Offset direction, ${q}, must be "+" or "-"`);
            let Y = Number(A.substring(1, 3)),
                z = Number(A.substring(4, 6));
            return K * (Y * 60 + z) * 60 * 1000
        }, "parseOffsetToMilliseconds"),
        qP6 = r7((A) => {
            let q = 0;
            while (q < A.length - 1 && A.charAt(q) === "0") q++;
            if (q === 0) return A;
            return A.slice(q)
        }, "stripLeadingZeroes"),
        lm7 = class A extends Error {
            constructor(q) {
                super(q.message);
                Object.setPrototypeOf(this, A.prototype), this.name = q.name, this.$fault = q.$fault, this.$metadata = q.$metadata
            }
        };
    r7(lm7, "ServiceException");
    var aq9 = lm7,
        im7 = r7((A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        }, "decorateServiceException"),
        nm7 = r7(({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = tq9(A),
                _ = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                w = new K({
                    name: (q == null ? void 0 : q.code) || (q == null ? void 0 : q.Code) || Y || _ || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw im7(w, q)
        }, "throwDefaultError"),
        sq9 = r7((A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                nm7({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        }, "withBaseException"),
        tq9 = r7((A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }), "deserializeMetadata"),
        eq9 = r7((A) => {
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
        Cm7 = !1,
        AK9 = r7((A) => {
            if (A && !Cm7 && parseInt(A.substring(1, A.indexOf("."))) < 14) Cm7 = !0
        }, "emitWarningIfUnsupportedVersion"),
        qK9 = r7((A) => {
            let q = [];
            for (let K in sM8.AlgorithmId) {
                let Y = sM8.AlgorithmId[K];
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
        KK9 = r7((A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        }, "resolveChecksumRuntimeConfig"),
        YK9 = r7((A) => {
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
        zK9 = r7((A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        }, "resolveRetryRuntimeConfig"),
        rm7 = r7((A) => {
            return {
                ...qK9(A),
                ...YK9(A)
            }
        }, "getDefaultExtensionConfiguration"),
        _K9 = rm7,
        wK9 = r7((A) => {
            return {
                ...KK9(A),
                ...zK9(A)
            }
        }, "resolveDefaultRuntimeConfig");

    function BH1(A) {
        return encodeURIComponent(A).replace(/[!'()*]/g, function(q) {
            return "%" + q.charCodeAt(0).toString(16).toUpperCase()
        })
    }
    r7(BH1, "extendedEncodeURIComponent");
    var OK9 = r7((A) => Array.isArray(A) ? A : [A], "getArrayIfSingleItem"),
        om7 = r7((A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = om7(A[K]);
            return A
        }, "getValueFromTextNode"),
        $m6 = r7(function() {
            let A = Object.getPrototypeOf(this).constructor,
                K = new(Function.bind.apply(String, [null, ...arguments]));
            return Object.setPrototypeOf(K, A.prototype), K
        }, "StringWrapper");
    $m6.prototype = Object.create(String.prototype, {
        constructor: {
            value: $m6,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    });
    Object.setPrototypeOf($m6, String);
    var am7 = class A extends $m6 {
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
    r7(am7, "LazyJsonString");
    var $K9 = am7;

    function wD8(A, q, K) {
        let Y, z, _;
        if (typeof q > "u" && typeof K > "u") Y = {}, _ = A;
        else if (Y = A, typeof q === "function") return z = q, _ = K, JK9(Y, z, _);
        else _ = q;
        for (let w of Object.keys(_)) {
            if (!Array.isArray(_[w])) {
                Y[w] = _[w];
                continue
            }
            sm7(Y, null, _, w)
        }
        return Y
    }
    r7(wD8, "map");
    var HK9 = r7((A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        }, "convertMap"),
        jK9 = r7((A, q) => {
            let K = {};
            for (let Y in q) sm7(K, A, q, Y);
            return K
        }, "take"),
        JK9 = r7((A, q, K) => {
            return wD8(A, Object.entries(K).reduce((Y, [z, _]) => {
                if (Array.isArray(_)) Y[z] = _;
                else if (typeof _ === "function") Y[z] = [q, _()];
                else Y[z] = [q, _];
                return Y
            }, {}))
        }, "mapWithFilter"),
        sm7 = r7((A, q, K, Y) => {
            if (q !== null) {
                let w = K[Y];
                if (typeof w === "function") w = [, w];
                let [O = MK9, $ = DK9, H = Y] = w;
                if (typeof O === "function" && O(q[H]) || typeof O !== "function" && !!O) A[Y] = $(q[H]);
                return
            }
            let [z, _] = K[Y];
            if (typeof _ === "function") {
                let w, O = z === void 0 && (w = _()) != null,
                    $ = typeof z === "function" && !!z(void 0) || typeof z !== "function" && !!z;
                if (O) A[Y] = w;
                else if ($) A[Y] = _()
            } else {
                let w = z === void 0 && _ != null,
                    O = typeof z === "function" && !!z(_) || typeof z !== "function" && !!z;
                if (w || O) A[Y] = _
            }
        }, "applyInstruction"),
        MK9 = r7((A) => A != null, "nonNullish"),
        DK9 = r7((A) => A, "pass"),
        XK9 = r7((A, q, K, Y, z, _) => {
            if (q != null && q[K] !== void 0) {
                let w = Y();
                if (w.length <= 0) throw Error("Empty value provided for input HTTP label: " + K + ".");
                A = A.replace(z, _ ? w.split("/").map((O) => BH1(O)).join("/") : BH1(w))
            } else throw Error("No value provided for input HTTP label: " + K + ".");
            return A
        }, "resolvedPath"),
        PK9 = r7((A) => {
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
        qD8 = r7((A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(qD8);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = qD8(A[K])
                }
                return q
            }
            return A
        }, "_json");

    function tm7(A, q, K) {
        if (K <= 0 || !Number.isInteger(K)) throw Error("Invalid number of delimiters (" + K + ") for splitEvery.");
        let Y = A.split(q);
        if (K === 1) return Y;
        let z = [],
            _ = "";
        for (let w = 0; w < Y.length; w++) {
            if (_ === "") _ = Y[w];
            else _ += q + Y[w];
            if ((w + 1) % K === 0) z.push(_), _ = ""
        }
        if (_ !== "") z.push(_);
        return z
    }
    r7(tm7, "splitEvery")
})
// @from(Ln 173707, Col 4)
Cw
// @from(Ln 173707, Col 8)
Ns
// @from(Ln 173707, Col 12)
WK9 = async (A, q) => {
    let K = Cw.map({}),
        Y = A.body,
        z = Cw.take(Y, {
            message: Cw.expectString
        });
    Object.assign(K, z);
    let _ = new Ns.InternalServerException({
        $metadata: FH1(A),
        ...K
    });
    return Cw.decorateServiceException(_, A.body)
}
// @from(Ln 173719, Col 3)
ZK9 = async (A, q) => {
    let K = Cw.map({}),
        Y = A.body,
        z = Cw.take(Y, {
            message: Cw.expectString,
            originalMessage: Cw.expectString,
            originalStatusCode: Cw.expectInt32
        });
    Object.assign(K, z);
    let _ = new Ns.ModelStreamErrorException({
        $metadata: FH1(A),
        ...K
    });
    return Cw.decorateServiceException(_, A.body)
}
// @from(Ln 173733, Col 3)
GK9 = async (A, q) => {
    let K = Cw.map({}),
        Y = A.body,
        z = Cw.take(Y, {
            message: Cw.expectString
        });
    Object.assign(K, z);
    let _ = new Ns.ThrottlingException({
        $metadata: FH1(A),
        ...K
    });
    return Cw.decorateServiceException(_, A.body)
}
// @from(Ln 173745, Col 3)
fK9 = async (A, q) => {
    let K = Cw.map({}),
        Y = A.body,
        z = Cw.take(Y, {
            message: Cw.expectString
        });
    Object.assign(K, z);
    let _ = new Ns.ValidationException({
        $metadata: FH1(A),
        ...K
    });
    return Cw.decorateServiceException(_, A.body)
}
// @from(Ln 173757, Col 3)
qB7 = (A, q) => {
    return q.eventStreamMarshaller.deserialize(A, async (K) => {
        if (K.chunk != null) return {
            chunk: await NK9(K.chunk, q)
        };
        if (K.internalServerException != null) return {
            internalServerException: await TK9(K.internalServerException, q)
        };
        if (K.modelStreamErrorException != null) return {
            modelStreamErrorException: await vK9(K.modelStreamErrorException, q)
        };
        if (K.validationException != null) return {
            validationException: await kK9(K.validationException, q)
        };
        if (K.throttlingException != null) return {
            throttlingException: await VK9(K.throttlingException, q)
        };
        return {
            $unknown: A
        }
    })
}
// @from(Ln 173778, Col 3)
TK9 = async (A, q) => {
    let K = {
        ...A,
        body: await Hm6(A.body, q)
    };
    return WK9(K, q)
}
// @from(Ln 173784, Col 3)
vK9 = async (A, q) => {
    let K = {
        ...A,
        body: await Hm6(A.body, q)
    };
    return ZK9(K, q)
}
// @from(Ln 173790, Col 3)
NK9 = async (A, q) => {
    let K = {},
        Y = await Hm6(A.body, q);
    return Object.assign(K, EK9(Y, q)), K
}
// @from(Ln 173794, Col 3)
VK9 = async (A, q) => {
    let K = {
        ...A,
        body: await Hm6(A.body, q)
    };
    return GK9(K, q)
}
// @from(Ln 173800, Col 3)
kK9 = async (A, q) => {
    let K = {
        ...A,
        body: await Hm6(A.body, q)
    };
    return fK9(K, q)
}
// @from(Ln 173806, Col 3)
EK9 = (A, q) => {
    return Cw.take(A, {
        bytes: q.base64Decoder
    })
}
// @from(Ln 173810, Col 3)
FH1 = (A) => ({
    httpStatusCode: A.statusCode,
    requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"] ?? "",
    extendedRequestId: A.headers["x-amz-id-2"] ?? "",
    cfId: A.headers["x-amz-cf-id"] ?? ""
})
// @from(Ln 173815, Col 4)
yK9 = (A, q) => Cw.collectBody(A, q).then((K) => q.utf8Encoder(K))
// @from(Ln 173815, Col 72)
Hm6 = (A, q) => yK9(A, q).then((K) => {
    if (K.length) return JSON.parse(K);
    return {}
})
// @from(Ln 173819, Col 4)
KB7 = E(() => {
    Cw = t(AB7(), 1), Ns = t(Z31(), 1)
})
// @from(Ln 173823, Col 0)
function YB7(A) {
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
// @from(Ln 173848, Col 4)
OD8 = E(() => {
    BW()
})
// @from(Ln 173852, Col 0)
function pH1(A) {
    return A != null && typeof A === "object" && !Array.isArray(A)
}
// @from(Ln 173855, Col 4)
$D8 = (A) => ($D8 = Array.isArray, $D8(A))
// @from(Ln 173856, Col 4)
HD8
// @from(Ln 173856, Col 9)
zB7 = (A) => {
        try {
            return JSON.parse(A)
        } catch (q) {
            return
        }
    }
// @from(Ln 173863, Col 4)
jm6 = E(() => {
    OD8();
    HD8 = $D8
})
// @from(Ln 173868, Col 0)
function Jm6() {}
// @from(Ln 173870, Col 0)
function QH1(A, q, K) {
    if (!q || _B7[A] > _B7[K]) return Jm6;
    else return q[A].bind(q)
}
// @from(Ln 173875, Col 0)
function OB7(A) {
    let q = A.logger,
        K = A.logLevel ?? "off";
    if (!q) return LK9;
    let Y = wB7.get(q);
    if (Y && Y[0] === K) return Y[1];
    let z = {
        error: QH1("error", q, K),
        warn: QH1("warn", q, K),
        info: QH1("info", q, K),
        debug: QH1("debug", q, K)
    };
    return wB7.set(q, [K, z]), z
}
// @from(Ln 173889, Col 4)
_B7
// @from(Ln 173889, Col 9)
LK9
// @from(Ln 173889, Col 14)
wB7
// @from(Ln 173890, Col 4)
$B7 = E(() => {
    jm6();
    _B7 = {
        off: 0,
        error: 200,
        warn: 300,
        info: 400,
        debug: 500
    };
    LK9 = {
        error: Jm6,
        warn: Jm6,
        info: Jm6,
        debug: Jm6
    }, wB7 = new WeakMap
})
// @from(Ln 173907, Col 0)
function hK9(A) {
    return typeof A === "object" && A !== null && (("name" in A) && A.name === "AbortError" || ("message" in A) && String(A.message).includes("FetchRequestCanceledException"))
}
// @from(Ln 173910, Col 4)
jB7
// @from(Ln 173910, Col 9)
UH1
// @from(Ln 173910, Col 14)
JB7
// @from(Ln 173910, Col 19)
jD8 = (A) => new TextDecoder("utf-8").decode(A)
// @from(Ln 173911, Col 4)
HB7 = (A) => new TextEncoder().encode(A)
// @from(Ln 173912, Col 4)
RK9 = () => {
        let A = new jB7.EventStreamMarshaller({
            utf8Encoder: jD8,
            utf8Decoder: HB7
        });
        return {
            base64Decoder: UH1.fromBase64,
            base64Encoder: UH1.toBase64,
            utf8Decoder: HB7,
            utf8Encoder: jD8,
            eventStreamMarshaller: A,
            streamCollector: JB7.streamCollector
        }
    }
// @from(Ln 173926, Col 4)
dH1
// @from(Ln 173927, Col 4)
MB7 = E(() => {
    P_1();
    Sa();
    wv();
    KB7();
    jm6();
    $B7();
    jB7 = t(Vu7(), 1), UH1 = t(BM8(), 1), JB7 = t(JJ8(), 1);
    dH1 = class dH1 extends gG {
        static fromSSEResponse(A, q, K) {
            let Y = !1,
                z = K ? OB7(K) : console;
            async function* _() {
                if (!A.body) throw q.abort(), new n7("Attempted to iterate over a response with no body");
                let O = YB7(A.body),
                    $ = qB7(O, RK9());
                for await (let H of $) if (H.chunk && H.chunk.bytes) yield {
                    event: "chunk",
                    data: jD8(H.chunk.bytes),
                    raw: []
                };
                else if (H.internalServerException) yield {
                    event: "error",
                    data: "InternalServerException",
                    raw: []
                };
                else if (H.modelStreamErrorException) yield {
                    event: "error",
                    data: "ModelStreamErrorException",
                    raw: []
                };
                else if (H.validationException) yield {
                    event: "error",
                    data: "ValidationException",
                    raw: []
                };
                else if (H.throttlingException) yield {
                    event: "error",
                    data: "ThrottlingException",
                    raw: []
                }
            }
            async function* w() {
                if (Y) throw Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
                Y = !0;
                let O = !1;
                try {
                    for await (let $ of _()) {
                        if ($.event === "chunk") try {
                            yield JSON.parse($.data)
                        } catch (H) {
                            throw z.error("Could not parse message into JSON:", $.data), z.error("From chunk:", $.raw), H
                        }
                        if ($.event === "error") {
                            let H = $.data,
                                j = zB7(H),
                                J = j ? void 0 : H;
                            throw a7.generate(void 0, j, J, A.headers)
                        }
                    }
                    O = !0
                } catch ($) {
                    if (hK9($)) return;
                    throw $
                } finally {
                    if (!O) q.abort()
                }
            }
            return new dH1(w, q)
        }
    }
})
// @from(Ln 173999, Col 4)
JD8 = (A) => {
    if (typeof globalThis.process < "u") return globalThis.process.env?.[A]?.trim() ?? void 0;
    if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(A)?.trim();
    return
}
// @from(Ln 174005, Col 0)
function* SK9(A) {
    if (!A) return;
    if (DB7 in A) {
        let {
            values: Y,
            nulls: z
        } = A;
        yield* Y.entries();
        for (let _ of z) yield [_, null];
        return
    }
    let q = !1,
        K;
    if (A instanceof Headers) K = A.entries();
    else if (HD8(A)) K = A;
    else q = !0, K = Object.entries(A ?? {});
    for (let Y of K) {
        let z = Y[0];
        if (typeof z !== "string") throw TypeError("expected header name to be a string");
        let _ = HD8(Y[1]) ? Y[1] : [Y[1]],
            w = !1;
        for (let O of _) {
            if (O === void 0) continue;
            if (q && !w) w = !0, yield [z, null];
            yield [z, O]
        }
    }
}
// @from(Ln 174033, Col 4)
DB7
// @from(Ln 174033, Col 9)
MD8 = (A) => {
    let q = new Headers,
        K = new Set;
    for (let Y of A) {
        let z = new Set;
        for (let [_, w] of SK9(Y)) {
            let O = _.toLowerCase();
            if (!z.has(O)) q.delete(_), z.add(O);
            if (w === null) q.delete(_), K.add(O);
            else q.append(_, w), K.delete(O)
        }
    }
    return {
        [DB7]: !0,
        values: q,
        nulls: K
    }
}
// @from(Ln 174051, Col 4)
XB7 = E(() => {
    jm6();
    DB7 = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 174056, Col 0)
function WB7(A) {
    return A.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent)
}
// @from(Ln 174059, Col 4)
PB7
// @from(Ln 174059, Col 9)
CK9 = (A = WB7) => function(K, ...Y) {
        if (K.length === 1) return K[0];
        let z = !1,
            _ = [],
            w = K.reduce((j, J, M) => {
                if (/[?#]/.test(J)) z = !0;
                let D = Y[M],
                    X = (z ? encodeURIComponent : A)("" + D);
                if (M !== Y.length && (D == null || typeof D === "object" && D.toString === Object.getPrototypeOf(Object.getPrototypeOf(D.hasOwnProperty ?? PB7) ?? PB7)?.toString)) X = D + "", _.push({
                    start: j.length + J.length,
                    length: X.length,
                    error: `Value of type ${Object.prototype.toString.call(D).slice(8,-1)} is not a valid path parameter`
                });
                return j + J + (M === Y.length ? "" : X)
            }, ""),
            O = w.split(/[?#]/, 1)[0],
            $ = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi,
            H;
        while ((H = $.exec(O)) !== null) _.push({
            start: H.index,
            length: H[0].length,
            error: `Value "${H[0]}" can't be safely passed as a path parameter`
        });
        if (_.sort((j, J) => j.start - J.start), _.length > 0) {
            let j = 0,
                J = _.reduce((M, D) => {
                    let X = " ".repeat(D.start - j),
                        P = "^".repeat(D.length);
                    return j = D.start + D.length, M + X + P
                }, "");
            throw new n7(`Path parameters result in path with invalid segments:
${_.map((M)=>M.error).join(`
`)}
${w}
${J}`)
        }
        return w
    }
// @from(Ln 174097, Col 4)
DD8
// @from(Ln 174098, Col 4)
ZB7 = E(() => {
    OD8();
    PB7 = Object.freeze(Object.create(null)), DD8 = CK9(WB7)
})
// @from(Ln 174103, Col 0)
function xK9(A) {
    let q = new Yk(A);
    return delete q.batches, delete q.countTokens, q
}
// @from(Ln 174108, Col 0)
function uK9(A) {
    let q = new gW(A);
    return delete q.promptCaching, delete q.messages.batches, delete q.messages.countTokens, q
}
// @from(Ln 174112, Col 4)
IK9 = "bedrock-2023-05-31"
// @from(Ln 174113, Col 4)
bK9
// @from(Ln 174113, Col 9)
XD8
// @from(Ln 174114, Col 4)
PD8 = E(() => {
    jU();
    Jx6();
    _x7();
    MB7();
    jm6();
    XB7();
    ZB7();
    jU();
    bK9 = new Set(["/v1/complete", "/v1/messages", "/v1/messages?beta=true"]);
    XD8 = class XD8 extends yz {
        constructor({
            awsRegion: A = JD8("AWS_REGION") ?? "us-east-1",
            baseURL: q = JD8("ANTHROPIC_BEDROCK_BASE_URL") ?? `https://bedrock-runtime.${A}.amazonaws.com`,
            awsSecretKey: K = null,
            awsAccessKey: Y = null,
            awsSessionToken: z = null,
            providerChainResolver: _ = null,
            ...w
        } = {}) {
            super({
                baseURL: q,
                ...w
            });
            this.skipAuth = !1, this.messages = xK9(this), this.completions = new xa(this), this.beta = uK9(this), this.awsSecretKey = K, this.awsAccessKey = Y, this.awsRegion = A, this.awsSessionToken = z, this.skipAuth = w.skipAuth ?? !1, this.providerChainResolver = _
        }
        validateHeaders() {}
        async prepareRequest(A, {
            url: q,
            options: K
        }) {
            if (this.skipAuth) return;
            let Y = this.awsRegion;
            if (!Y) throw Error("Expected `awsRegion` option to be passed to the client or the `AWS_REGION` environment variable to be present");
            let z = await zx7(A, {
                url: q,
                regionName: Y,
                awsAccessKey: this.awsAccessKey,
                awsSecretKey: this.awsSecretKey,
                awsSessionToken: this.awsSessionToken,
                fetchOptions: this.fetchOptions,
                providerChainResolver: this.providerChainResolver
            });
            A.headers = MD8([z, A.headers]).values
        }
        async buildRequest(A) {
            if (A.__streamClass = dH1, pH1(A.body)) A.body = {
                ...A.body
            };
            if (pH1(A.body)) {
                if (!A.body.anthropic_version) A.body.anthropic_version = IK9;
                if (A.headers && !A.body.anthropic_beta) {
                    let q = MD8([A.headers]).values.get("anthropic-beta");
                    if (q != null) A.body.anthropic_beta = q.split(",")
                }
            }
            if (bK9.has(A.path) && A.method === "post") {
                if (!pH1(A.body)) throw Error("Expected request body to be an object for post /v1/messages");
                let q = A.body.model;
                A.body.model = void 0;
                let K = A.body.stream;
                if (A.body.stream = void 0, K) A.path = DD8`/model/${q}/invoke-with-response-stream`;
                else A.path = DD8`/model/${q}/invoke`
            }
            return super.buildRequest(A)
        }
    }
})
// @from(Ln 174182, Col 4)
GB7 = {}
// @from(Ln 174188, Col 4)
fB7 = E(() => {
    PD8();
    PD8()
})
// @from(Ln 174192, Col 4)
cH1 = E(() => {
    BW()
})
// @from(Ln 174195, Col 4)
WD8 = (A) => (WD8 = Array.isArray, WD8(A))
// @from(Ln 174196, Col 4)
ZD8
// @from(Ln 174197, Col 4)
lH1 = E(() => {
    cH1();
    ZD8 = WD8
})
// @from(Ln 174202, Col 0)
function* BK9(A) {
    if (!A) return;
    if (TB7 in A) {
        let {
            values: Y,
            nulls: z
        } = A;
        yield* Y.entries();
        for (let _ of z) yield [_, null];
        return
    }
    let q = !1,
        K;
    if (A instanceof Headers) K = A.entries();
    else if (ZD8(A)) K = A;
    else q = !0, K = Object.entries(A ?? {});
    for (let Y of K) {
        let z = Y[0];
        if (typeof z !== "string") throw TypeError("expected header name to be a string");
        let _ = ZD8(Y[1]) ? Y[1] : [Y[1]],
            w = !1;
        for (let O of _) {
            if (O === void 0) continue;
            if (q && !w) w = !0, yield [z, null];
            yield [z, O]
        }
    }
}
// @from(Ln 174230, Col 4)
TB7
// @from(Ln 174230, Col 9)
GD8 = (A) => {
    let q = new Headers,
        K = new Set;
    for (let Y of A) {
        let z = new Set;
        for (let [_, w] of BK9(Y)) {
            let O = _.toLowerCase();
            if (!z.has(O)) q.delete(_), z.add(O);
            if (w === null) q.delete(_), K.add(O);
            else q.append(_, w), K.delete(O)
        }
    }
    return {
        [TB7]: !0,
        values: q,
        nulls: K
    }
}
// @from(Ln 174248, Col 4)
vB7 = E(() => {
    lH1();
    TB7 = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 174252, Col 4)
NB7 = E(() => {
    cH1()
})
// @from(Ln 174255, Col 4)
iH1 = (A) => {
    if (typeof globalThis.process < "u") return globalThis.process.env?.[A]?.trim() ?? void 0;
    if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(A)?.trim();
    return
}
// @from(Ln 174260, Col 4)
VB7 = E(() => {
    lH1()
})
// @from(Ln 174263, Col 4)
kB7 = E(() => {
    lH1();
    NB7();
    VB7()
})
// @from(Ln 174269, Col 0)
function gK9(A) {
    let q = new Yk(A);
    return delete q.batches, q
}
// @from(Ln 174274, Col 0)
function FK9(A) {
    let q = new gW(A);
    return delete q.messages.batches, q
}
// @from(Ln 174278, Col 4)
fD8