
// @from(Ln 38319, Col 4)
Kv1 = v(() => {
    xa1();
    Bw1();
    ya1();
    Sa1();
    A3();
    yb6();
    A3();
    N3 = XA("$ZodType", (A, q) => {
        var K;
        A ?? (A = {}), A._zod.def = q, A._zod.bag = A._zod.bag || {}, A._zod.version = Rb6;
        let Y = [...A._zod.def.checks ?? []];
        if (A._zod.traits.has("$ZodCheck")) Y.unshift(A);
        for (let z of Y)
            for (let w of z._zod.onattach) w(A);
        if (Y.length === 0)(K = A._zod).deferred ?? (K.deferred = []), A._zod.deferred?.push(() => {
            A._zod.run = A._zod.parse
        });
        else {
            let z = (w, H, $) => {
                let O = r61(w),
                    _;
                for (let J of H) {
                    if (J._zod.when) {
                        if (!J._zod.when(w)) continue
                    } else if (O) continue;
                    let X = w.issues.length,
                        D = J._zod.check(w);
                    if (D instanceof Promise && $?.async === !1) throw new TQ;
                    if (_ || D instanceof Promise) _ = (_ ?? Promise.resolve()).then(async () => {
                        if (await D, w.issues.length === X) return;
                        if (!O) O = r61(w, X)
                    });
                    else {
                        if (w.issues.length === X) continue;
                        if (!O) O = r61(w, X)
                    }
                }
                if (_) return _.then(() => {
                    return w
                });
                return w
            };
            A._zod.run = (w, H) => {
                let $ = A._zod.parse(w, H);
                if ($ instanceof Promise) {
                    if (H.async === !1) throw new TQ;
                    return $.then((O) => z(O, Y, H))
                }
                return z($, Y, H)
            }
        }
        A["~standard"] = {
            validate: (z) => {
                try {
                    let w = gw1(A, z);
                    return w.success ? {
                        value: w.data
                    } : {
                        issues: w.error?.issues
                    }
                } catch (w) {
                    return sT1(A, z).then((H) => H.success ? {
                        value: H.data
                    } : {
                        issues: H.error?.issues
                    })
                }
            },
            vendor: "zod",
            version: 1
        }
    }), s61 = XA("$ZodString", (A, q) => {
        N3.init(A, q), A._zod.pattern = [...A?._zod.bag?.patterns ?? []].pop() ?? Ab6(A._zod.bag), A._zod.parse = (K, Y) => {
            if (q.coerce) try {
                K.value = String(K.value)
            } catch (z) {}
            if (typeof K.value === "string") return K;
            return K.issues.push({
                expected: "string",
                code: "invalid_type",
                input: K.value,
                inst: A
            }), K
        }
    }), fw = XA("$ZodStringFormat", (A, q) => {
        Uw1.init(A, q), s61.init(A, q)
    }), Sb6 = XA("$ZodGUID", (A, q) => {
        q.pattern ?? (q.pattern = Ux6), fw.init(A, q)
    }), hb6 = XA("$ZodUUID", (A, q) => {
        if (q.version) {
            let Y = {
                v1: 1,
                v2: 2,
                v3: 3,
                v4: 4,
                v5: 5,
                v6: 6,
                v7: 7,
                v8: 8
            } [q.version];
            if (Y === void 0) throw Error(`Invalid UUID version: "${q.version}"`);
            q.pattern ?? (q.pattern = o61(Y))
        } else q.pattern ?? (q.pattern = o61());
        fw.init(A, q)
    }), Ib6 = XA("$ZodEmail", (A, q) => {
        q.pattern ?? (q.pattern = px6), fw.init(A, q)
    }), xb6 = XA("$ZodURL", (A, q) => {
        fw.init(A, q), A._zod.check = (K) => {
            try {
                let Y = K.value,
                    z = new URL(Y),
                    w = z.href;
                if (q.hostname) {
                    if (q.hostname.lastIndex = 0, !q.hostname.test(z.hostname)) K.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid hostname",
                        pattern: ox6.source,
                        input: K.value,
                        inst: A,
                        continue: !q.abort
                    })
                }
                if (q.protocol) {
                    if (q.protocol.lastIndex = 0, !q.protocol.test(z.protocol.endsWith(":") ? z.protocol.slice(0, -1) : z.protocol)) K.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid protocol",
                        pattern: q.protocol.source,
                        input: K.value,
                        inst: A,
                        continue: !q.abort
                    })
                }
                if (!Y.endsWith("/") && w.endsWith("/")) K.value = w.slice(0, -1);
                else K.value = w;
                return
            } catch (Y) {
                K.issues.push({
                    code: "invalid_format",
                    format: "url",
                    input: K.value,
                    inst: A,
                    continue: !q.abort
                })
            }
        }
    }), bb6 = XA("$ZodEmoji", (A, q) => {
        q.pattern ?? (q.pattern = dx6()), fw.init(A, q)
    }), ub6 = XA("$ZodNanoID", (A, q) => {
        q.pattern ?? (q.pattern = Qx6), fw.init(A, q)
    }), Bb6 = XA("$ZodCUID", (A, q) => {
        q.pattern ?? (q.pattern = bx6), fw.init(A, q)
    }), mb6 = XA("$ZodCUID2", (A, q) => {
        q.pattern ?? (q.pattern = ux6), fw.init(A, q)
    }), Fb6 = XA("$ZodULID", (A, q) => {
        q.pattern ?? (q.pattern = Bx6), fw.init(A, q)
    }), Qb6 = XA("$ZodXID", (A, q) => {
        q.pattern ?? (q.pattern = mx6), fw.init(A, q)
    }), gb6 = XA("$ZodKSUID", (A, q) => {
        q.pattern ?? (q.pattern = Fx6), fw.init(A, q)
    }), Ub6 = XA("$ZodISODateTime", (A, q) => {
        q.pattern ?? (q.pattern = ex6(q)), fw.init(A, q)
    }), pb6 = XA("$ZodISODate", (A, q) => {
        q.pattern ?? (q.pattern = sx6), fw.init(A, q)
    }), db6 = XA("$ZodISOTime", (A, q) => {
        q.pattern ?? (q.pattern = tx6(q)), fw.init(A, q)
    }), cb6 = XA("$ZodISODuration", (A, q) => {
        q.pattern ?? (q.pattern = gx6), fw.init(A, q)
    }), lb6 = XA("$ZodIPv4", (A, q) => {
        q.pattern ?? (q.pattern = cx6), fw.init(A, q), A._zod.onattach.push((K) => {
            let Y = K._zod.bag;
            Y.format = "ipv4"
        })
    }), ib6 = XA("$ZodIPv6", (A, q) => {
        q.pattern ?? (q.pattern = lx6), fw.init(A, q), A._zod.onattach.push((K) => {
            let Y = K._zod.bag;
            Y.format = "ipv6"
        }), A._zod.check = (K) => {
            try {
                new URL(`http://[${K.value}]`)
            } catch {
                K.issues.push({
                    code: "invalid_format",
                    format: "ipv6",
                    input: K.value,
                    inst: A,
                    continue: !q.abort
                })
            }
        }
    }), nb6 = XA("$ZodCIDRv4", (A, q) => {
        q.pattern ?? (q.pattern = ix6), fw.init(A, q)
    }), rb6 = XA("$ZodCIDRv6", (A, q) => {
        q.pattern ?? (q.pattern = nx6), fw.init(A, q), A._zod.check = (K) => {
            let [Y, z] = K.value.split("/");
            try {
                if (!z) throw Error();
                let w = Number(z);
                if (`${w}` !== z) throw Error();
                if (w < 0 || w > 128) throw Error();
                new URL(`http://[${Y}]`)
            } catch {
                K.issues.push({
                    code: "invalid_format",
                    format: "cidrv6",
                    input: K.value,
                    inst: A,
                    continue: !q.abort
                })
            }
        }
    });
    ab6 = XA("$ZodBase64", (A, q) => {
        q.pattern ?? (q.pattern = rx6), fw.init(A, q), A._zod.onattach.push((K) => {
            K._zod.bag.contentEncoding = "base64"
        }), A._zod.check = (K) => {
            if (ob6(K.value)) return;
            K.issues.push({
                code: "invalid_format",
                format: "base64",
                input: K.value,
                inst: A,
                continue: !q.abort
            })
        }
    });
    sb6 = XA("$ZodBase64URL", (A, q) => {
        q.pattern ?? (q.pattern = Ca1), fw.init(A, q), A._zod.onattach.push((K) => {
            K._zod.bag.contentEncoding = "base64url"
        }), A._zod.check = (K) => {
            if (cz8(K.value)) return;
            K.issues.push({
                code: "invalid_format",
                format: "base64url",
                input: K.value,
                inst: A,
                continue: !q.abort
            })
        }
    }), tb6 = XA("$ZodE164", (A, q) => {
        q.pattern ?? (q.pattern = ax6), fw.init(A, q)
    });
    eb6 = XA("$ZodJWT", (A, q) => {
        fw.init(A, q), A._zod.check = (K) => {
            if (lz8(K.value, q.alg)) return;
            K.issues.push({
                code: "invalid_format",
                format: "jwt",
                input: K.value,
                inst: A,
                continue: !q.abort
            })
        }
    }), Au6 = XA("$ZodCustomStringFormat", (A, q) => {
        fw.init(A, q), A._zod.check = (K) => {
            if (q.fn(K.value)) return;
            K.issues.push({
                code: "invalid_format",
                format: q.format,
                input: K.value,
                inst: A,
                continue: !q.abort
            })
        }
    }), ma1 = XA("$ZodNumber", (A, q) => {
        N3.init(A, q), A._zod.pattern = A._zod.bag.pattern ?? Yb6, A._zod.parse = (K, Y) => {
            if (q.coerce) try {
                K.value = Number(K.value)
            } catch (H) {}
            let z = K.value;
            if (typeof z === "number" && !Number.isNaN(z) && Number.isFinite(z)) return K;
            let w = typeof z === "number" ? Number.isNaN(z) ? "NaN" : !Number.isFinite(z) ? "Infinity" : void 0 : void 0;
            return K.issues.push({
                expected: "number",
                code: "invalid_type",
                input: z,
                inst: A,
                ...w ? {
                    received: w
                } : {}
            }), K
        }
    }), qu6 = XA("$ZodNumber", (A, q) => {
        Jb6.init(A, q), ma1.init(A, q)
    }), tT1 = XA("$ZodBoolean", (A, q) => {
        N3.init(A, q), A._zod.pattern = zb6, A._zod.parse = (K, Y) => {
            if (q.coerce) try {
                K.value = Boolean(K.value)
            } catch (w) {}
            let z = K.value;
            if (typeof z === "boolean") return K;
            return K.issues.push({
                expected: "boolean",
                code: "invalid_type",
                input: z,
                inst: A
            }), K
        }
    }), Fa1 = XA("$ZodBigInt", (A, q) => {
        N3.init(A, q), A._zod.pattern = qb6, A._zod.parse = (K, Y) => {
            if (q.coerce) try {
                K.value = BigInt(K.value)
            } catch (z) {}
            if (typeof K.value === "bigint") return K;
            return K.issues.push({
                expected: "bigint",
                code: "invalid_type",
                input: K.value,
                inst: A
            }), K
        }
    }), Ku6 = XA("$ZodBigInt", (A, q) => {
        Xb6.init(A, q), Fa1.init(A, q)
    }), Yu6 = XA("$ZodSymbol", (A, q) => {
        N3.init(A, q), A._zod.parse = (K, Y) => {
            let z = K.value;
            if (typeof z === "symbol") return K;
            return K.issues.push({
                expected: "symbol",
                code: "invalid_type",
                input: z,
                inst: A
            }), K
        }
    }), zu6 = XA("$ZodUndefined", (A, q) => {
        N3.init(A, q), A._zod.pattern = Hb6, A._zod.values = new Set([void 0]), A._zod.optin = "optional", A._zod.optout = "optional", A._zod.parse = (K, Y) => {
            let z = K.value;
            if (typeof z > "u") return K;
            return K.issues.push({
                expected: "undefined",
                code: "invalid_type",
                input: z,
                inst: A
            }), K
        }
    }), wu6 = XA("$ZodNull", (A, q) => {
        N3.init(A, q), A._zod.pattern = wb6, A._zod.values = new Set([null]), A._zod.parse = (K, Y) => {
            let z = K.value;
            if (z === null) return K;
            return K.issues.push({
                expected: "null",
                code: "invalid_type",
                input: z,
                inst: A
            }), K
        }
    }), Hu6 = XA("$ZodAny", (A, q) => {
        N3.init(A, q), A._zod.parse = (K) => K
    }), pw1 = XA("$ZodUnknown", (A, q) => {
        N3.init(A, q), A._zod.parse = (K) => K
    }), $u6 = XA("$ZodNever", (A, q) => {
        N3.init(A, q), A._zod.parse = (K, Y) => {
            return K.issues.push({
                expected: "never",
                code: "invalid_type",
                input: K.value,
                inst: A
            }), K
        }
    }), Ou6 = XA("$ZodVoid", (A, q) => {
        N3.init(A, q), A._zod.parse = (K, Y) => {
            let z = K.value;
            if (typeof z > "u") return K;
            return K.issues.push({
                expected: "void",
                code: "invalid_type",
                input: z,
                inst: A
            }), K
        }
    }), _u6 = XA("$ZodDate", (A, q) => {
        N3.init(A, q), A._zod.parse = (K, Y) => {
            if (q.coerce) try {
                K.value = new Date(K.value)
            } catch ($) {}
            let z = K.value,
                w = z instanceof Date;
            if (w && !Number.isNaN(z.getTime())) return K;
            return K.issues.push({
                expected: "date",
                code: "invalid_type",
                input: z,
                ...w ? {
                    received: "Invalid Date"
                } : {},
                inst: A
            }), K
        }
    });
    eT1 = XA("$ZodArray", (A, q) => {
        N3.init(A, q), A._zod.parse = (K, Y) => {
            let z = K.value;
            if (!Array.isArray(z)) return K.issues.push({
                expected: "array",
                code: "invalid_type",
                input: z,
                inst: A
            }), K;
            K.value = Array(z.length);
            let w = [];
            for (let H = 0; H < z.length; H++) {
                let $ = z[H],
                    O = q.element._zod.run({
                        value: $,
                        issues: []
                    }, Y);
                if (O instanceof Promise) w.push(O.then((_) => xz8(_, K, H)));
                else xz8(O, K, H)
            }
            if (w.length) return Promise.all(w).then(() => K);
            return K
        }
    });
    Ju6 = XA("$ZodObject", (A, q) => {
        N3.init(A, q);
        let K = UT1(() => {
            let X = Object.keys(q.shape);
            for (let j of X)
                if (!(q.shape[j] instanceof N3)) throw Error(`Invalid element at key "${j}": expected a Zod schema`);
            let D = Rx6(q.shape);
            return {
                shape: q.shape,
                keys: X,
                keySet: new Set(X),
                numKeys: X.length,
                optionalKeys: new Set(D)
            }
        });
        kz(A._zod, "propValues", () => {
            let X = q.shape,
                D = {};
            for (let j in X) {
                let M = X[j]._zod;
                if (M.values) {
                    D[j] ?? (D[j] = new Set);
                    for (let P of M.values) D[j].add(P)
                }
            }
            return D
        });
        let Y = (X) => {
                let D = new ba1(["shape", "payload", "ctx"]),
                    j = K.value,
                    M = (f) => {
                        let Z = n61(f);
                        return `shape[${Z}]._zod.run({ value: input[${Z}], issues: [] }, ctx)`
                    };
                D.write("const input = payload.value;");
                let P = Object.create(null),
                    W = 0;
                for (let f of j.keys) P[f] = `key_${W++}`;
                D.write("const newResult = {}");
                for (let f of j.keys)
                    if (j.optionalKeys.has(f)) {
                        let Z = P[f];
                        D.write(`const ${Z} = ${M(f)};`);
                        let N = n61(f);
                        D.write(`
        if (${Z}.issues.length) {
          if (input[${N}] === undefined) {
            if (${N} in input) {
              newResult[${N}] = undefined;
            }
          } else {
            payload.issues = payload.issues.concat(
              ${Z}.issues.map((iss) => ({
                ...iss,
                path: iss.path ? [${N}, ...iss.path] : [${N}],
              }))
            );
          }
        } else if (${Z}.value === undefined) {
          if (${N} in input) newResult[${N}] = undefined;
        } else {
          newResult[${N}] = ${Z}.value;
        }
        `)
                    } else {
                        let Z = P[f];
                        D.write(`const ${Z} = ${M(f)};`), D.write(`
          if (${Z}.issues.length) payload.issues = payload.issues.concat(${Z}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${n61(f)}, ...iss.path] : [${n61(f)}]
          })));`), D.write(`newResult[${n61(f)}] = ${Z}.value`)
                    } D.write("payload.value = newResult;"), D.write("return payload;");
                let G = D.compile();
                return (f, Z) => G(X, f, Z)
            },
            z, w = mw1,
            H = !mT1.jitless,
            O = H && kx6.value,
            _ = q.catchall,
            J;
        A._zod.parse = (X, D) => {
            J ?? (J = K.value);
            let j = X.value;
            if (!w(j)) return X.issues.push({
                expected: "object",
                code: "invalid_type",
                input: j,
                inst: A
            }), X;
            let M = [];
            if (H && O && D?.async === !1 && D.jitless !== !0) {
                if (!z) z = Y(q.shape);
                X = z(X, D)
            } else {
                X.value = {};
                let Z = J.shape;
                for (let N of J.keys) {
                    let T = Z[N],
                        k = T._zod.run({
                            value: j[N],
                            issues: []
                        }, D),
                        y = T._zod.optin === "optional" && T._zod.optout === "optional";
                    if (k instanceof Promise) M.push(k.then((B) => y ? bz8(B, X, N, j) : ua1(B, X, N)));
                    else if (y) bz8(k, X, N, j);
                    else ua1(k, X, N)
                }
            }
            if (!_) return M.length ? Promise.all(M).then(() => X) : X;
            let P = [],
                W = J.keySet,
                G = _._zod,
                f = G.def.type;
            for (let Z of Object.keys(j)) {
                if (W.has(Z)) continue;
                if (f === "never") {
                    P.push(Z);
                    continue
                }
                let N = G.run({
                    value: j[Z],
                    issues: []
                }, D);
                if (N instanceof Promise) M.push(N.then((T) => ua1(T, X, Z)));
                else ua1(N, X, Z)
            }
            if (P.length) X.issues.push({
                code: "unrecognized_keys",
                keys: P,
                input: j,
                inst: A
            });
            if (!M.length) return X;
            return Promise.all(M).then(() => {
                return X
            })
        }
    });
    Qa1 = XA("$ZodUnion", (A, q) => {
        N3.init(A, q), kz(A._zod, "optin", () => q.options.some((K) => K._zod.optin === "optional") ? "optional" : void 0), kz(A._zod, "optout", () => q.options.some((K) => K._zod.optout === "optional") ? "optional" : void 0), kz(A._zod, "values", () => {
            if (q.options.every((K) => K._zod.values)) return new Set(q.options.flatMap((K) => Array.from(K._zod.values)));
            return
        }), kz(A._zod, "pattern", () => {
            if (q.options.every((K) => K._zod.pattern)) {
                let K = q.options.map((Y) => Y._zod.pattern);
                return new RegExp(`^(${K.map((Y)=>pT1(Y.source)).join("|")})$`)
            }
            return
        }), A._zod.parse = (K, Y) => {
            let z = !1,
                w = [];
            for (let H of q.options) {
                let $ = H._zod.run({
                    value: K.value,
                    issues: []
                }, Y);
                if ($ instanceof Promise) w.push($), z = !0;
                else {
                    if ($.issues.length === 0) return $;
                    w.push($)
                }
            }
            if (!z) return uz8(w, K, A, Y);
            return Promise.all(w).then((H) => {
                return uz8(H, K, A, Y)
            })
        }
    }), Xu6 = XA("$ZodDiscriminatedUnion", (A, q) => {
        Qa1.init(A, q);
        let K = A._zod.parse;
        kz(A._zod, "propValues", () => {
            let z = {};
            for (let w of q.options) {
                let H = w._zod.propValues;
                if (!H || Object.keys(H).length === 0) throw Error(`Invalid discriminated union option at index "${q.options.indexOf(w)}"`);
                for (let [$, O] of Object.entries(H)) {
                    if (!z[$]) z[$] = new Set;
                    for (let _ of O) z[$].add(_)
                }
            }
            return z
        });
        let Y = UT1(() => {
            let z = q.options,
                w = new Map;
            for (let H of z) {
                let $ = H._zod.propValues[q.discriminator];
                if (!$ || $.size === 0) throw Error(`Invalid discriminated union option at index "${q.options.indexOf(H)}"`);
                for (let O of $) {
                    if (w.has(O)) throw Error(`Duplicate discriminator value "${String(O)}"`);
                    w.set(O, H)
                }
            }
            return w
        });
        A._zod.parse = (z, w) => {
            let H = z.value;
            if (!mw1(H)) return z.issues.push({
                code: "invalid_type",
                expected: "object",
                input: H,
                inst: A
            }), z;
            let $ = Y.value.get(H?.[q.discriminator]);
            if ($) return $._zod.run(z, w);
            if (q.unionFallback) return K(z, w);
            return z.issues.push({
                code: "invalid_union",
                errors: [],
                note: "No matching discriminator",
                input: H,
                path: [q.discriminator],
                inst: A
            }), z
        }
    }), Du6 = XA("$ZodIntersection", (A, q) => {
        N3.init(A, q), A._zod.parse = (K, Y) => {
            let z = K.value,
                w = q.left._zod.run({
                    value: z,
                    issues: []
                }, Y),
                H = q.right._zod.run({
                    value: z,
                    issues: []
                }, Y);
            if (w instanceof Promise || H instanceof Promise) return Promise.all([w, H]).then(([O, _]) => {
                return Bz8(K, O, _)
            });
            return Bz8(K, w, H)
        }
    });
    t61 = XA("$ZodTuple", (A, q) => {
        N3.init(A, q);
        let K = q.items,
            Y = K.length - [...K].reverse().findIndex((z) => z._zod.optin !== "optional");
        A._zod.parse = (z, w) => {
            let H = z.value;
            if (!Array.isArray(H)) return z.issues.push({
                input: H,
                inst: A,
                expected: "tuple",
                code: "invalid_type"
            }), z;
            z.value = [];
            let $ = [];
            if (!q.rest) {
                let _ = H.length > K.length,
                    J = H.length < Y - 1;
                if (_ || J) return z.issues.push({
                    input: H,
                    inst: A,
                    origin: "array",
                    ..._ ? {
                        code: "too_big",
                        maximum: K.length
                    } : {
                        code: "too_small",
                        minimum: K.length
                    }
                }), z
            }
            let O = -1;
            for (let _ of K) {
                if (O++, O >= H.length) {
                    if (O >= Y) continue
                }
                let J = _._zod.run({
                    value: H[O],
                    issues: []
                }, w);
                if (J instanceof Promise) $.push(J.then((X) => Ba1(X, z, O)));
                else Ba1(J, z, O)
            }
            if (q.rest) {
                let _ = H.slice(K.length);
                for (let J of _) {
                    O++;
                    let X = q.rest._zod.run({
                        value: J,
                        issues: []
                    }, w);
                    if (X instanceof Promise) $.push(X.then((D) => Ba1(D, z, O)));
                    else Ba1(X, z, O)
                }
            }
            if ($.length) return Promise.all($).then(() => z);
            return z
        }
    });
    ju6 = XA("$ZodRecord", (A, q) => {
        N3.init(A, q), A._zod.parse = (K, Y) => {
            let z = K.value;
            if (!Fw1(z)) return K.issues.push({
                expected: "record",
                code: "invalid_type",
                input: z,
                inst: A
            }), K;
            let w = [];
            if (q.keyType._zod.values) {
                let H = q.keyType._zod.values;
                K.value = {};
                for (let O of H)
                    if (typeof O === "string" || typeof O === "number" || typeof O === "symbol") {
                        let _ = q.valueType._zod.run({
                            value: z[O],
                            issues: []
                        }, Y);
                        if (_ instanceof Promise) w.push(_.then((J) => {
                            if (J.issues.length) K.issues.push(...Uf(O, J.issues));
                            K.value[O] = J.value
                        }));
                        else {
                            if (_.issues.length) K.issues.push(...Uf(O, _.issues));
                            K.value[O] = _.value
                        }
                    } let $;
                for (let O in z)
                    if (!H.has(O)) $ = $ ?? [], $.push(O);
                if ($ && $.length > 0) K.issues.push({
                    code: "unrecognized_keys",
                    input: z,
                    inst: A,
                    keys: $
                })
            } else {
                K.value = {};
                for (let H of Reflect.ownKeys(z)) {
                    if (H === "__proto__") continue;
                    let $ = q.keyType._zod.run({
                        value: H,
                        issues: []
                    }, Y);
                    if ($ instanceof Promise) throw Error("Async schemas not supported in object keys currently");
                    if ($.issues.length) {
                        K.issues.push({
                            origin: "record",
                            code: "invalid_key",
                            issues: $.issues.map((_) => VT(_, Y, KX())),
                            input: H,
                            path: [H],
                            inst: A
                        }), K.value[$.value] = $.value;
                        continue
                    }
                    let O = q.valueType._zod.run({
                        value: z[H],
                        issues: []
                    }, Y);
                    if (O instanceof Promise) w.push(O.then((_) => {
                        if (_.issues.length) K.issues.push(...Uf(H, _.issues));
                        K.value[$.value] = _.value
                    }));
                    else {
                        if (O.issues.length) K.issues.push(...Uf(H, O.issues));
                        K.value[$.value] = O.value
                    }
                }
            }
            if (w.length) return Promise.all(w).then(() => K);
            return K
        }
    }), Mu6 = XA("$ZodMap", (A, q) => {
        N3.init(A, q), A._zod.parse = (K, Y) => {
            let z = K.value;
            if (!(z instanceof Map)) return K.issues.push({
                expected: "map",
                code: "invalid_type",
                input: z,
                inst: A
            }), K;
            let w = [];
            K.value = new Map;
            for (let [H, $] of z) {
                let O = q.keyType._zod.run({
                        value: H,
                        issues: []
                    }, Y),
                    _ = q.valueType._zod.run({
                        value: $,
                        issues: []
                    }, Y);
                if (O instanceof Promise || _ instanceof Promise) w.push(Promise.all([O, _]).then(([J, X]) => {
                    mz8(J, X, K, H, z, A, Y)
                }));
                else mz8(O, _, K, H, z, A, Y)
            }
            if (w.length) return Promise.all(w).then(() => K);
            return K
        }
    });
    Pu6 = XA("$ZodSet", (A, q) => {
        N3.init(A, q), A._zod.parse = (K, Y) => {
            let z = K.value;
            if (!(z instanceof Set)) return K.issues.push({
                input: z,
                inst: A,
                expected: "set",
                code: "invalid_type"
            }), K;
            let w = [];
            K.value = new Set;
            for (let H of z) {
                let $ = q.valueType._zod.run({
                    value: H,
                    issues: []
                }, Y);
                if ($ instanceof Promise) w.push($.then((O) => Fz8(O, K)));
                else Fz8($, K)
            }
            if (w.length) return Promise.all(w).then(() => K);
            return K
        }
    });
    Wu6 = XA("$ZodEnum", (A, q) => {
        N3.init(A, q);
        let K = gT1(q.entries);
        A._zod.values = new Set(K), A._zod.pattern = new RegExp(`^(${K.filter((Y)=>dT1.has(typeof Y)).map((Y)=>typeof Y==="string"?vQ(Y):Y.toString()).join("|")})$`), A._zod.parse = (Y, z) => {
            let w = Y.value;
            if (A._zod.values.has(w)) return Y;
            return Y.issues.push({
                code: "invalid_value",
                values: K,
                input: w,
                inst: A
            }), Y
        }
    }), Gu6 = XA("$ZodLiteral", (A, q) => {
        N3.init(A, q), A._zod.values = new Set(q.values), A._zod.pattern = new RegExp(`^(${q.values.map((K)=>typeof K==="string"?vQ(K):K?K.toString():String(K)).join("|")})$`), A._zod.parse = (K, Y) => {
            let z = K.value;
            if (A._zod.values.has(z)) return K;
            return K.issues.push({
                code: "invalid_value",
                values: q.values,
                input: z,
                inst: A
            }), K
        }
    }), Zu6 = XA("$ZodFile", (A, q) => {
        N3.init(A, q), A._zod.parse = (K, Y) => {
            let z = K.value;
            if (z instanceof File) return K;
            return K.issues.push({
                expected: "file",
                code: "invalid_type",
                input: z,
                inst: A
            }), K
        }
    }), Av1 = XA("$ZodTransform", (A, q) => {
        N3.init(A, q), A._zod.parse = (K, Y) => {
            let z = q.transform(K.value, K);
            if (Y.async) return (z instanceof Promise ? z : Promise.resolve(z)).then((H) => {
                return K.value = H, K
            });
            if (z instanceof Promise) throw new TQ;
            return K.value = z, K
        }
    }), fu6 = XA("$ZodOptional", (A, q) => {
        N3.init(A, q), A._zod.optin = "optional", A._zod.optout = "optional", kz(A._zod, "values", () => {
            return q.innerType._zod.values ? new Set([...q.innerType._zod.values, void 0]) : void 0
        }), kz(A._zod, "pattern", () => {
            let K = q.innerType._zod.pattern;
            return K ? new RegExp(`^(${pT1(K.source)})?$`) : void 0
        }), A._zod.parse = (K, Y) => {
            if (q.innerType._zod.optin === "optional") return q.innerType._zod.run(K, Y);
            if (K.value === void 0) return K;
            return q.innerType._zod.run(K, Y)
        }
    }), Vu6 = XA("$ZodNullable", (A, q) => {
        N3.init(A, q), kz(A._zod, "optin", () => q.innerType._zod.optin), kz(A._zod, "optout", () => q.innerType._zod.optout), kz(A._zod, "pattern", () => {
            let K = q.innerType._zod.pattern;
            return K ? new RegExp(`^(${pT1(K.source)}|null)$`) : void 0
        }), kz(A._zod, "values", () => {
            return q.innerType._zod.values ? new Set([...q.innerType._zod.values, null]) : void 0
        }), A._zod.parse = (K, Y) => {
            if (K.value === null) return K;
            return q.innerType._zod.run(K, Y)
        }
    }), Nu6 = XA("$ZodDefault", (A, q) => {
        N3.init(A, q), A._zod.optin = "optional", kz(A._zod, "values", () => q.innerType._zod.values), A._zod.parse = (K, Y) => {
            if (K.value === void 0) return K.value = q.defaultValue, K;
            let z = q.innerType._zod.run(K, Y);
            if (z instanceof Promise) return z.then((w) => Qz8(w, q));
            return Qz8(z, q)
        }
    });
    Tu6 = XA("$ZodPrefault", (A, q) => {
        N3.init(A, q), A._zod.optin = "optional", kz(A._zod, "values", () => q.innerType._zod.values), A._zod.parse = (K, Y) => {
            if (K.value === void 0) K.value = q.defaultValue;
            return q.innerType._zod.run(K, Y)
        }
    }), vu6 = XA("$ZodNonOptional", (A, q) => {
        N3.init(A, q), kz(A._zod, "values", () => {
            let K = q.innerType._zod.values;
            return K ? new Set([...K].filter((Y) => Y !== void 0)) : void 0
        }), A._zod.parse = (K, Y) => {
            let z = q.innerType._zod.run(K, Y);
            if (z instanceof Promise) return z.then((w) => gz8(w, A));
            return gz8(z, A)
        }
    });
    Eu6 = XA("$ZodSuccess", (A, q) => {
        N3.init(A, q), A._zod.parse = (K, Y) => {
            let z = q.innerType._zod.run(K, Y);
            if (z instanceof Promise) return z.then((w) => {
                return K.value = w.issues.length === 0, K
            });
            return K.value = z.issues.length === 0, K
        }
    }), ku6 = XA("$ZodCatch", (A, q) => {
        N3.init(A, q), A._zod.optin = "optional", kz(A._zod, "optout", () => q.innerType._zod.optout), kz(A._zod, "values", () => q.innerType._zod.values), A._zod.parse = (K, Y) => {
            let z = q.innerType._zod.run(K, Y);
            if (z instanceof Promise) return z.then((w) => {
                if (K.value = w.value, w.issues.length) K.value = q.catchValue({
                    ...K,
                    error: {
                        issues: w.issues.map((H) => VT(H, Y, KX()))
                    },
                    input: K.value
                }), K.issues = [];
                return K
            });
            if (K.value = z.value, z.issues.length) K.value = q.catchValue({
                ...K,
                error: {
                    issues: z.issues.map((w) => VT(w, Y, KX()))
                },
                input: K.value
            }), K.issues = [];
            return K
        }
    }), Lu6 = XA("$ZodNaN", (A, q) => {
        N3.init(A, q), A._zod.parse = (K, Y) => {
            if (typeof K.value !== "number" || !Number.isNaN(K.value)) return K.issues.push({
                input: K.value,
                inst: A,
                expected: "nan",
                code: "invalid_type"
            }), K;
            return K
        }
    }), qv1 = XA("$ZodPipe", (A, q) => {
        N3.init(A, q), kz(A._zod, "values", () => q.in._zod.values), kz(A._zod, "optin", () => q.in._zod.optin), kz(A._zod, "optout", () => q.out._zod.optout), A._zod.parse = (K, Y) => {
            let z = q.in._zod.run(K, Y);
            if (z instanceof Promise) return z.then((w) => Uz8(w, q, Y));
            return Uz8(z, q, Y)
        }
    });
    Ru6 = XA("$ZodReadonly", (A, q) => {
        N3.init(A, q), kz(A._zod, "propValues", () => q.innerType._zod.propValues), kz(A._zod, "values", () => q.innerType._zod.values), kz(A._zod, "optin", () => q.innerType._zod.optin), kz(A._zod, "optout", () => q.innerType._zod.optout), A._zod.parse = (K, Y) => {
            let z = q.innerType._zod.run(K, Y);
            if (z instanceof Promise) return z.then(pz8);
            return pz8(z)
        }
    });
    yu6 = XA("$ZodTemplateLiteral", (A, q) => {
        N3.init(A, q);
        let K = [];
        for (let Y of q.parts)
            if (Y instanceof N3) {
                if (!Y._zod.pattern) throw Error(`Invalid template literal part, no pattern found: ${[...Y._zod.traits].shift()}`);
                let z = Y._zod.pattern instanceof RegExp ? Y._zod.pattern.source : Y._zod.pattern;
                if (!z) throw Error(`Invalid template literal part: ${Y._zod.traits}`);
                let w = z.startsWith("^") ? 1 : 0,
                    H = z.endsWith("$") ? z.length - 1 : z.length;
                K.push(z.slice(w, H))
            } else if (Y === null || Lx6.has(typeof Y)) K.push(vQ(`${Y}`));
        else throw Error(`Invalid template literal part: ${Y}`);
        A._zod.pattern = new RegExp(`^${K.join("")}$`), A._zod.parse = (Y, z) => {
            if (typeof Y.value !== "string") return Y.issues.push({
                input: Y.value,
                inst: A,
                expected: "template_literal",
                code: "invalid_type"
            }), Y;
            if (A._zod.pattern.lastIndex = 0, !A._zod.pattern.test(Y.value)) return Y.issues.push({
                input: Y.value,
                inst: A,
                code: "invalid_format",
                format: "template_literal",
                pattern: A._zod.pattern.source
            }), Y;
            return Y
        }
    }), Cu6 = XA("$ZodPromise", (A, q) => {
        N3.init(A, q), A._zod.parse = (K, Y) => {
            return Promise.resolve(K.value).then((z) => q.innerType._zod.run({
                value: z,
                issues: []
            }, Y))
        }
    }), Su6 = XA("$ZodLazy", (A, q) => {
        N3.init(A, q), kz(A._zod, "innerType", () => q.getter()), kz(A._zod, "pattern", () => A._zod.innerType._zod.pattern), kz(A._zod, "propValues", () => A._zod.innerType._zod.propValues), kz(A._zod, "optin", () => A._zod.innerType._zod.optin), kz(A._zod, "optout", () => A._zod.innerType._zod.optout), A._zod.parse = (K, Y) => {
            return A._zod.innerType._zod.run(K, Y)
        }
    }), hu6 = XA("$ZodCustom", (A, q) => {
        vO.init(A, q), N3.init(A, q), A._zod.parse = (K, Y) => {
            return K
        }, A._zod.check = (K) => {
            let Y = K.value,
                z = q.fn(Y);
            if (z instanceof Promise) return z.then((w) => dz8(w, K, Y, A));
            dz8(z, K, Y, A);
            return
        }
    })
})
// @from(Ln 39344, Col 0)
function Iu6() {
    return {
        localeError: CwK()
    }
}
// @from(Ln 39349, Col 4)
CwK = () => {
    let A = {
        string: {
            unit: "حرف",
            verb: "أن يحوي"
        },
        file: {
            unit: "بايت",
            verb: "أن يحوي"
        },
        array: {
            unit: "عنصر",
            verb: "أن يحوي"
        },
        set: {
            unit: "عنصر",
            verb: "أن يحوي"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "مدخل",
            email: "بريد إلكتروني",
            url: "رابط",
            emoji: "إيموجي",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "تاريخ ووقت بمعيار ISO",
            date: "تاريخ بمعيار ISO",
            time: "وقت بمعيار ISO",
            duration: "مدة بمعيار ISO",
            ipv4: "عنوان IPv4",
            ipv6: "عنوان IPv6",
            cidrv4: "مدى عناوين بصيغة IPv4",
            cidrv6: "مدى عناوين بصيغة IPv6",
            base64: "نَص بترميز base64-encoded",
            base64url: "نَص بترميز base64url-encoded",
            json_string: "نَص على هيئة JSON",
            e164: "رقم هاتف بمعيار E.164",
            jwt: "JWT",
            template_literal: "مدخل"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `مدخلات غير مقبولة: يفترض إدخال ${z.expected}، ولكن تم إدخال ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `مدخلات غير مقبولة: يفترض إدخال ${Q7(z.values[0])}`;
                return `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return ` أكبر من اللازم: يفترض أن تكون ${z.origin??"القيمة"} ${w} ${z.maximum.toString()} ${H.unit??"عنصر"}`;
                return `أكبر من اللازم: يفترض أن تكون ${z.origin??"القيمة"} ${w} ${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `أصغر من اللازم: يفترض لـ ${z.origin} أن يكون ${w} ${z.minimum.toString()} ${H.unit}`;
                return `أصغر من اللازم: يفترض لـ ${z.origin} أن يكون ${w} ${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `نَص غير مقبول: يجب أن يبدأ بـ "${z.prefix}"`;
                if (w.format === "ends_with") return `نَص غير مقبول: يجب أن ينتهي بـ "${w.suffix}"`;
                if (w.format === "includes") return `نَص غير مقبول: يجب أن يتضمَّن "${w.includes}"`;
                if (w.format === "regex") return `نَص غير مقبول: يجب أن يطابق النمط ${w.pattern}`;
                return `${Y[w.format]??z.format} غير مقبول`
            }
            case "not_multiple_of":
                return `رقم غير مقبول: يجب أن يكون من مضاعفات ${z.divisor}`;
            case "unrecognized_keys":
                return `معرف${z.keys.length>1?"ات":""} غريب${z.keys.length>1?"ة":""}: ${J8(z.keys,"، ")}`;
            case "invalid_key":
                return `معرف غير مقبول في ${z.origin}`;
            case "invalid_union":
                return "مدخل غير مقبول";
            case "invalid_element":
                return `مدخل غير مقبول في ${z.origin}`;
            default:
                return "مدخل غير مقبول"
        }
    }
}
// @from(Ln 39457, Col 4)
nz8 = v(() => {
    A3()
})
// @from(Ln 39461, Col 0)
function xu6() {
    return {
        localeError: SwK()
    }
}
// @from(Ln 39466, Col 4)
SwK = () => {
    let A = {
        string: {
            unit: "simvol",
            verb: "olmalıdır"
        },
        file: {
            unit: "bayt",
            verb: "olmalıdır"
        },
        array: {
            unit: "element",
            verb: "olmalıdır"
        },
        set: {
            unit: "element",
            verb: "olmalıdır"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "input",
            email: "email address",
            url: "URL",
            emoji: "emoji",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "ISO datetime",
            date: "ISO date",
            time: "ISO time",
            duration: "ISO duration",
            ipv4: "IPv4 address",
            ipv6: "IPv6 address",
            cidrv4: "IPv4 range",
            cidrv6: "IPv6 range",
            base64: "base64-encoded string",
            base64url: "base64url-encoded string",
            json_string: "JSON string",
            e164: "E.164 number",
            jwt: "JWT",
            template_literal: "input"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Yanlış dəyər: gözlənilən ${z.expected}, daxil olan ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Yanlış dəyər: gözlənilən ${Q7(z.values[0])}`;
                return `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Çox böyük: gözlənilən ${z.origin??"dəyər"} ${w}${z.maximum.toString()} ${H.unit??"element"}`;
                return `Çox böyük: gözlənilən ${z.origin??"dəyər"} ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Çox kiçik: gözlənilən ${z.origin} ${w}${z.minimum.toString()} ${H.unit}`;
                return `Çox kiçik: gözlənilən ${z.origin} ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Yanlış mətn: "${w.prefix}" ilə başlamalıdır`;
                if (w.format === "ends_with") return `Yanlış mətn: "${w.suffix}" ilə bitməlidir`;
                if (w.format === "includes") return `Yanlış mətn: "${w.includes}" daxil olmalıdır`;
                if (w.format === "regex") return `Yanlış mətn: ${w.pattern} şablonuna uyğun olmalıdır`;
                return `Yanlış ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Yanlış ədəd: ${z.divisor} ilə bölünə bilən olmalıdır`;
            case "unrecognized_keys":
                return `Tanınmayan açar${z.keys.length>1?"lar":""}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `${z.origin} daxilində yanlış açar`;
            case "invalid_union":
                return "Yanlış dəyər";
            case "invalid_element":
                return `${z.origin} daxilində yanlış dəyər`;
            default:
                return "Yanlış dəyər"
        }
    }
}
// @from(Ln 39574, Col 4)
rz8 = v(() => {
    A3()
})
// @from(Ln 39578, Col 0)
function oz8(A, q, K, Y) {
    let z = Math.abs(A),
        w = z % 10,
        H = z % 100;
    if (H >= 11 && H <= 19) return Y;
    if (w === 1) return q;
    if (w >= 2 && w <= 4) return K;
    return Y
}
// @from(Ln 39588, Col 0)
function bu6() {
    return {
        localeError: hwK()
    }
}
// @from(Ln 39593, Col 4)
hwK = () => {
    let A = {
        string: {
            unit: {
                one: "сімвал",
                few: "сімвалы",
                many: "сімвалаў"
            },
            verb: "мець"
        },
        array: {
            unit: {
                one: "элемент",
                few: "элементы",
                many: "элементаў"
            },
            verb: "мець"
        },
        set: {
            unit: {
                one: "элемент",
                few: "элементы",
                many: "элементаў"
            },
            verb: "мець"
        },
        file: {
            unit: {
                one: "байт",
                few: "байты",
                many: "байтаў"
            },
            verb: "мець"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "лік";
                case "object": {
                    if (Array.isArray(z)) return "масіў";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "увод",
            email: "email адрас",
            url: "URL",
            emoji: "эмодзі",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "ISO дата і час",
            date: "ISO дата",
            time: "ISO час",
            duration: "ISO працягласць",
            ipv4: "IPv4 адрас",
            ipv6: "IPv6 адрас",
            cidrv4: "IPv4 дыяпазон",
            cidrv6: "IPv6 дыяпазон",
            base64: "радок у фармаце base64",
            base64url: "радок у фармаце base64url",
            json_string: "JSON радок",
            e164: "нумар E.164",
            jwt: "JWT",
            template_literal: "увод"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Няправільны ўвод: чакаўся ${z.expected}, атрымана ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Няправільны ўвод: чакалася ${Q7(z.values[0])}`;
                return `Няправільны варыянт: чакаўся адзін з ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) {
                    let $ = Number(z.maximum),
                        O = oz8($, H.unit.one, H.unit.few, H.unit.many);
                    return `Занадта вялікі: чакалася, што ${z.origin??"значэнне"} павінна ${H.verb} ${w}${z.maximum.toString()} ${O}`
                }
                return `Занадта вялікі: чакалася, што ${z.origin??"значэнне"} павінна быць ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) {
                    let $ = Number(z.minimum),
                        O = oz8($, H.unit.one, H.unit.few, H.unit.many);
                    return `Занадта малы: чакалася, што ${z.origin} павінна ${H.verb} ${w}${z.minimum.toString()} ${O}`
                }
                return `Занадта малы: чакалася, што ${z.origin} павінна быць ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Няправільны радок: павінен пачынацца з "${w.prefix}"`;
                if (w.format === "ends_with") return `Няправільны радок: павінен заканчвацца на "${w.suffix}"`;
                if (w.format === "includes") return `Няправільны радок: павінен змяшчаць "${w.includes}"`;
                if (w.format === "regex") return `Няправільны радок: павінен адпавядаць шаблону ${w.pattern}`;
                return `Няправільны ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Няправільны лік: павінен быць кратным ${z.divisor}`;
            case "unrecognized_keys":
                return `Нераспазнаны ${z.keys.length>1?"ключы":"ключ"}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Няправільны ключ у ${z.origin}`;
            case "invalid_union":
                return "Няправільны ўвод";
            case "invalid_element":
                return `Няправільнае значэнне ў ${z.origin}`;
            default:
                return "Няправільны ўвод"
        }
    }
}
// @from(Ln 39725, Col 4)
az8 = v(() => {
    A3()
})
// @from(Ln 39729, Col 0)
function uu6() {
    return {
        localeError: IwK()
    }
}
// @from(Ln 39734, Col 4)
IwK = () => {
    let A = {
        string: {
            unit: "caràcters",
            verb: "contenir"
        },
        file: {
            unit: "bytes",
            verb: "contenir"
        },
        array: {
            unit: "elements",
            verb: "contenir"
        },
        set: {
            unit: "elements",
            verb: "contenir"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "entrada",
            email: "adreça electrònica",
            url: "URL",
            emoji: "emoji",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "data i hora ISO",
            date: "data ISO",
            time: "hora ISO",
            duration: "durada ISO",
            ipv4: "adreça IPv4",
            ipv6: "adreça IPv6",
            cidrv4: "rang IPv4",
            cidrv6: "rang IPv6",
            base64: "cadena codificada en base64",
            base64url: "cadena codificada en base64url",
            json_string: "cadena JSON",
            e164: "número E.164",
            jwt: "JWT",
            template_literal: "entrada"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Tipus invàlid: s'esperava ${z.expected}, s'ha rebut ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Valor invàlid: s'esperava ${Q7(z.values[0])}`;
                return `Opció invàlida: s'esperava una de ${J8(z.values," o ")}`;
            case "too_big": {
                let w = z.inclusive ? "com a màxim" : "menys de",
                    H = q(z.origin);
                if (H) return `Massa gran: s'esperava que ${z.origin??"el valor"} contingués ${w} ${z.maximum.toString()} ${H.unit??"elements"}`;
                return `Massa gran: s'esperava que ${z.origin??"el valor"} fos ${w} ${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? "com a mínim" : "més de",
                    H = q(z.origin);
                if (H) return `Massa petit: s'esperava que ${z.origin} contingués ${w} ${z.minimum.toString()} ${H.unit}`;
                return `Massa petit: s'esperava que ${z.origin} fos ${w} ${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Format invàlid: ha de començar amb "${w.prefix}"`;
                if (w.format === "ends_with") return `Format invàlid: ha d'acabar amb "${w.suffix}"`;
                if (w.format === "includes") return `Format invàlid: ha d'incloure "${w.includes}"`;
                if (w.format === "regex") return `Format invàlid: ha de coincidir amb el patró ${w.pattern}`;
                return `Format invàlid per a ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Número invàlid: ha de ser múltiple de ${z.divisor}`;
            case "unrecognized_keys":
                return `Clau${z.keys.length>1?"s":""} no reconeguda${z.keys.length>1?"s":""}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Clau invàlida a ${z.origin}`;
            case "invalid_union":
                return "Entrada invàlida";
            case "invalid_element":
                return `Element invàlid a ${z.origin}`;
            default:
                return "Entrada invàlida"
        }
    }
}
// @from(Ln 39842, Col 4)
sz8 = v(() => {
    A3()
})
// @from(Ln 39846, Col 0)
function Bu6() {
    return {
        localeError: xwK()
    }
}
// @from(Ln 39851, Col 4)
xwK = () => {
    let A = {
        string: {
            unit: "znaků",
            verb: "mít"
        },
        file: {
            unit: "bajtů",
            verb: "mít"
        },
        array: {
            unit: "prvků",
            verb: "mít"
        },
        set: {
            unit: "prvků",
            verb: "mít"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "číslo";
                case "string":
                    return "řetězec";
                case "boolean":
                    return "boolean";
                case "bigint":
                    return "bigint";
                case "function":
                    return "funkce";
                case "symbol":
                    return "symbol";
                case "undefined":
                    return "undefined";
                case "object": {
                    if (Array.isArray(z)) return "pole";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "regulární výraz",
            email: "e-mailová adresa",
            url: "URL",
            emoji: "emoji",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "datum a čas ve formátu ISO",
            date: "datum ve formátu ISO",
            time: "čas ve formátu ISO",
            duration: "doba trvání ISO",
            ipv4: "IPv4 adresa",
            ipv6: "IPv6 adresa",
            cidrv4: "rozsah IPv4",
            cidrv6: "rozsah IPv6",
            base64: "řetězec zakódovaný ve formátu base64",
            base64url: "řetězec zakódovaný ve formátu base64url",
            json_string: "řetězec ve formátu JSON",
            e164: "číslo E.164",
            jwt: "JWT",
            template_literal: "vstup"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Neplatný vstup: očekáváno ${z.expected}, obdrženo ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Neplatný vstup: očekáváno ${Q7(z.values[0])}`;
                return `Neplatná možnost: očekávána jedna z hodnot ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Hodnota je příliš velká: ${z.origin??"hodnota"} musí mít ${w}${z.maximum.toString()} ${H.unit??"prvků"}`;
                return `Hodnota je příliš velká: ${z.origin??"hodnota"} musí být ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Hodnota je příliš malá: ${z.origin??"hodnota"} musí mít ${w}${z.minimum.toString()} ${H.unit??"prvků"}`;
                return `Hodnota je příliš malá: ${z.origin??"hodnota"} musí být ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Neplatný řetězec: musí začínat na "${w.prefix}"`;
                if (w.format === "ends_with") return `Neplatný řetězec: musí končit na "${w.suffix}"`;
                if (w.format === "includes") return `Neplatný řetězec: musí obsahovat "${w.includes}"`;
                if (w.format === "regex") return `Neplatný řetězec: musí odpovídat vzoru ${w.pattern}`;
                return `Neplatný formát ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Neplatné číslo: musí být násobkem ${z.divisor}`;
            case "unrecognized_keys":
                return `Neznámé klíče: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Neplatný klíč v ${z.origin}`;
            case "invalid_union":
                return "Neplatný vstup";
            case "invalid_element":
                return `Neplatná hodnota v ${z.origin}`;
            default:
                return "Neplatný vstup"
        }
    }
}
// @from(Ln 39971, Col 4)
tz8 = v(() => {
    A3()
})
// @from(Ln 39975, Col 0)
function mu6() {
    return {
        localeError: bwK()
    }
}
// @from(Ln 39980, Col 4)
bwK = () => {
    let A = {
        string: {
            unit: "Zeichen",
            verb: "zu haben"
        },
        file: {
            unit: "Bytes",
            verb: "zu haben"
        },
        array: {
            unit: "Elemente",
            verb: "zu haben"
        },
        set: {
            unit: "Elemente",
            verb: "zu haben"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "Zahl";
                case "object": {
                    if (Array.isArray(z)) return "Array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "Eingabe",
            email: "E-Mail-Adresse",
            url: "URL",
            emoji: "Emoji",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "ISO-Datum und -Uhrzeit",
            date: "ISO-Datum",
            time: "ISO-Uhrzeit",
            duration: "ISO-Dauer",
            ipv4: "IPv4-Adresse",
            ipv6: "IPv6-Adresse",
            cidrv4: "IPv4-Bereich",
            cidrv6: "IPv6-Bereich",
            base64: "Base64-codierter String",
            base64url: "Base64-URL-codierter String",
            json_string: "JSON-String",
            e164: "E.164-Nummer",
            jwt: "JWT",
            template_literal: "Eingabe"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Ungültige Eingabe: erwartet ${z.expected}, erhalten ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Ungültige Eingabe: erwartet ${Q7(z.values[0])}`;
                return `Ungültige Option: erwartet eine von ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Zu groß: erwartet, dass ${z.origin??"Wert"} ${w}${z.maximum.toString()} ${H.unit??"Elemente"} hat`;
                return `Zu groß: erwartet, dass ${z.origin??"Wert"} ${w}${z.maximum.toString()} ist`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Zu klein: erwartet, dass ${z.origin} ${w}${z.minimum.toString()} ${H.unit} hat`;
                return `Zu klein: erwartet, dass ${z.origin} ${w}${z.minimum.toString()} ist`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Ungültiger String: muss mit "${w.prefix}" beginnen`;
                if (w.format === "ends_with") return `Ungültiger String: muss mit "${w.suffix}" enden`;
                if (w.format === "includes") return `Ungültiger String: muss "${w.includes}" enthalten`;
                if (w.format === "regex") return `Ungültiger String: muss dem Muster ${w.pattern} entsprechen`;
                return `Ungültig: ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Ungültige Zahl: muss ein Vielfaches von ${z.divisor} sein`;
            case "unrecognized_keys":
                return `${z.keys.length>1?"Unbekannte Schlüssel":"Unbekannter Schlüssel"}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Ungültiger Schlüssel in ${z.origin}`;
            case "invalid_union":
                return "Ungültige Eingabe";
            case "invalid_element":
                return `Ungültiger Wert in ${z.origin}`;
            default:
                return "Ungültige Eingabe"
        }
    }
}
// @from(Ln 40088, Col 4)
ez8 = v(() => {
    A3()
})
// @from(Ln 40092, Col 0)
function Yv1() {
    return {
        localeError: BwK()
    }
}
// @from(Ln 40097, Col 4)
uwK = (A) => {
        let q = typeof A;
        switch (q) {
            case "number":
                return Number.isNaN(A) ? "NaN" : "number";
            case "object": {
                if (Array.isArray(A)) return "array";
                if (A === null) return "null";
                if (Object.getPrototypeOf(A) !== Object.prototype && A.constructor) return A.constructor.name
            }
        }
        return q
    }
// @from(Ln 40110, Col 4)
BwK = () => {
        let A = {
            string: {
                unit: "characters",
                verb: "to have"
            },
            file: {
                unit: "bytes",
                verb: "to have"
            },
            array: {
                unit: "items",
                verb: "to have"
            },
            set: {
                unit: "items",
                verb: "to have"
            }
        };

        function q(Y) {
            return A[Y] ?? null
        }
        let K = {
            regex: "input",
            email: "email address",
            url: "URL",
            emoji: "emoji",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "ISO datetime",
            date: "ISO date",
            time: "ISO time",
            duration: "ISO duration",
            ipv4: "IPv4 address",
            ipv6: "IPv6 address",
            cidrv4: "IPv4 range",
            cidrv6: "IPv6 range",
            base64: "base64-encoded string",
            base64url: "base64url-encoded string",
            json_string: "JSON string",
            e164: "E.164 number",
            jwt: "JWT",
            template_literal: "input"
        };
        return (Y) => {
            switch (Y.code) {
                case "invalid_type":
                    return `Invalid input: expected ${Y.expected}, received ${uwK(Y.input)}`;
                case "invalid_value":
                    if (Y.values.length === 1) return `Invalid input: expected ${Q7(Y.values[0])}`;
                    return `Invalid option: expected one of ${J8(Y.values,"|")}`;
                case "too_big": {
                    let z = Y.inclusive ? "<=" : "<",
                        w = q(Y.origin);
                    if (w) return `Too big: expected ${Y.origin??"value"} to have ${z}${Y.maximum.toString()} ${w.unit??"elements"}`;
                    return `Too big: expected ${Y.origin??"value"} to be ${z}${Y.maximum.toString()}`
                }
                case "too_small": {
                    let z = Y.inclusive ? ">=" : ">",
                        w = q(Y.origin);
                    if (w) return `Too small: expected ${Y.origin} to have ${z}${Y.minimum.toString()} ${w.unit}`;
                    return `Too small: expected ${Y.origin} to be ${z}${Y.minimum.toString()}`
                }
                case "invalid_format": {
                    let z = Y;
                    if (z.format === "starts_with") return `Invalid string: must start with "${z.prefix}"`;
                    if (z.format === "ends_with") return `Invalid string: must end with "${z.suffix}"`;
                    if (z.format === "includes") return `Invalid string: must include "${z.includes}"`;
                    if (z.format === "regex") return `Invalid string: must match pattern ${z.pattern}`;
                    return `Invalid ${K[z.format]??Y.format}`
                }
                case "not_multiple_of":
                    return `Invalid number: must be a multiple of ${Y.divisor}`;
                case "unrecognized_keys":
                    return `Unrecognized key${Y.keys.length>1?"s":""}: ${J8(Y.keys,", ")}`;
                case "invalid_key":
                    return `Invalid key in ${Y.origin}`;
                case "invalid_union":
                    return "Invalid input";
                case "invalid_element":
                    return `Invalid value in ${Y.origin}`;
                default:
                    return "Invalid input"
            }
        }
    }
// @from(Ln 40205, Col 4)
Fu6 = v(() => {
    A3()
})
// @from(Ln 40209, Col 0)
function Qu6() {
    return {
        localeError: FwK()
    }
}
// @from(Ln 40214, Col 4)
mwK = (A) => {
        let q = typeof A;
        switch (q) {
            case "number":
                return Number.isNaN(A) ? "NaN" : "nombro";
            case "object": {
                if (Array.isArray(A)) return "tabelo";
                if (A === null) return "senvalora";
                if (Object.getPrototypeOf(A) !== Object.prototype && A.constructor) return A.constructor.name
            }
        }
        return q
    }
// @from(Ln 40227, Col 4)
FwK = () => {
        let A = {
            string: {
                unit: "karaktrojn",
                verb: "havi"
            },
            file: {
                unit: "bajtojn",
                verb: "havi"
            },
            array: {
                unit: "elementojn",
                verb: "havi"
            },
            set: {
                unit: "elementojn",
                verb: "havi"
            }
        };

        function q(Y) {
            return A[Y] ?? null
        }
        let K = {
            regex: "enigo",
            email: "retadreso",
            url: "URL",
            emoji: "emoĝio",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "ISO-datotempo",
            date: "ISO-dato",
            time: "ISO-tempo",
            duration: "ISO-daŭro",
            ipv4: "IPv4-adreso",
            ipv6: "IPv6-adreso",
            cidrv4: "IPv4-rango",
            cidrv6: "IPv6-rango",
            base64: "64-ume kodita karaktraro",
            base64url: "URL-64-ume kodita karaktraro",
            json_string: "JSON-karaktraro",
            e164: "E.164-nombro",
            jwt: "JWT",
            template_literal: "enigo"
        };
        return (Y) => {
            switch (Y.code) {
                case "invalid_type":
                    return `Nevalida enigo: atendiĝis ${Y.expected}, riceviĝis ${mwK(Y.input)}`;
                case "invalid_value":
                    if (Y.values.length === 1) return `Nevalida enigo: atendiĝis ${Q7(Y.values[0])}`;
                    return `Nevalida opcio: atendiĝis unu el ${J8(Y.values,"|")}`;
                case "too_big": {
                    let z = Y.inclusive ? "<=" : "<",
                        w = q(Y.origin);
                    if (w) return `Tro granda: atendiĝis ke ${Y.origin??"valoro"} havu ${z}${Y.maximum.toString()} ${w.unit??"elementojn"}`;
                    return `Tro granda: atendiĝis ke ${Y.origin??"valoro"} havu ${z}${Y.maximum.toString()}`
                }
                case "too_small": {
                    let z = Y.inclusive ? ">=" : ">",
                        w = q(Y.origin);
                    if (w) return `Tro malgranda: atendiĝis ke ${Y.origin} havu ${z}${Y.minimum.toString()} ${w.unit}`;
                    return `Tro malgranda: atendiĝis ke ${Y.origin} estu ${z}${Y.minimum.toString()}`
                }
                case "invalid_format": {
                    let z = Y;
                    if (z.format === "starts_with") return `Nevalida karaktraro: devas komenciĝi per "${z.prefix}"`;
                    if (z.format === "ends_with") return `Nevalida karaktraro: devas finiĝi per "${z.suffix}"`;
                    if (z.format === "includes") return `Nevalida karaktraro: devas inkluzivi "${z.includes}"`;
                    if (z.format === "regex") return `Nevalida karaktraro: devas kongrui kun la modelo ${z.pattern}`;
                    return `Nevalida ${K[z.format]??Y.format}`
                }
                case "not_multiple_of":
                    return `Nevalida nombro: devas esti oblo de ${Y.divisor}`;
                case "unrecognized_keys":
                    return `Nekonata${Y.keys.length>1?"j":""} ŝlosilo${Y.keys.length>1?"j":""}: ${J8(Y.keys,", ")}`;
                case "invalid_key":
                    return `Nevalida ŝlosilo en ${Y.origin}`;
                case "invalid_union":
                    return "Nevalida enigo";
                case "invalid_element":
                    return `Nevalida valoro en ${Y.origin}`;
                default:
                    return "Nevalida enigo"
            }
        }
    }
// @from(Ln 40322, Col 4)
A28 = v(() => {
    A3()
})
// @from(Ln 40326, Col 0)
function gu6() {
    return {
        localeError: QwK()
    }
}
// @from(Ln 40331, Col 4)
QwK = () => {
    let A = {
        string: {
            unit: "caracteres",
            verb: "tener"
        },
        file: {
            unit: "bytes",
            verb: "tener"
        },
        array: {
            unit: "elementos",
            verb: "tener"
        },
        set: {
            unit: "elementos",
            verb: "tener"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "número";
                case "object": {
                    if (Array.isArray(z)) return "arreglo";
                    if (z === null) return "nulo";
                    if (Object.getPrototypeOf(z) !== Object.prototype) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "entrada",
            email: "dirección de correo electrónico",
            url: "URL",
            emoji: "emoji",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "fecha y hora ISO",
            date: "fecha ISO",
            time: "hora ISO",
            duration: "duración ISO",
            ipv4: "dirección IPv4",
            ipv6: "dirección IPv6",
            cidrv4: "rango IPv4",
            cidrv6: "rango IPv6",
            base64: "cadena codificada en base64",
            base64url: "URL codificada en base64",
            json_string: "cadena JSON",
            e164: "número E.164",
            jwt: "JWT",
            template_literal: "entrada"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Entrada inválida: se esperaba ${z.expected}, recibido ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Entrada inválida: se esperaba ${Q7(z.values[0])}`;
                return `Opción inválida: se esperaba una de ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Demasiado grande: se esperaba que ${z.origin??"valor"} tuviera ${w}${z.maximum.toString()} ${H.unit??"elementos"}`;
                return `Demasiado grande: se esperaba que ${z.origin??"valor"} fuera ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Demasiado pequeño: se esperaba que ${z.origin} tuviera ${w}${z.minimum.toString()} ${H.unit}`;
                return `Demasiado pequeño: se esperaba que ${z.origin} fuera ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Cadena inválida: debe comenzar con "${w.prefix}"`;
                if (w.format === "ends_with") return `Cadena inválida: debe terminar en "${w.suffix}"`;
                if (w.format === "includes") return `Cadena inválida: debe incluir "${w.includes}"`;
                if (w.format === "regex") return `Cadena inválida: debe coincidir con el patrón ${w.pattern}`;
                return `Inválido ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Número inválido: debe ser múltiplo de ${z.divisor}`;
            case "unrecognized_keys":
                return `Llave${z.keys.length>1?"s":""} desconocida${z.keys.length>1?"s":""}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Llave inválida en ${z.origin}`;
            case "invalid_union":
                return "Entrada inválida";
            case "invalid_element":
                return `Valor inválido en ${z.origin}`;
            default:
                return "Entrada inválida"
        }
    }
}
// @from(Ln 40439, Col 4)
q28 = v(() => {
    A3()
})
// @from(Ln 40443, Col 0)
function Uu6() {
    return {
        localeError: gwK()
    }
}
// @from(Ln 40448, Col 4)
gwK = () => {
    let A = {
        string: {
            unit: "کاراکتر",
            verb: "داشته باشد"
        },
        file: {
            unit: "بایت",
            verb: "داشته باشد"
        },
        array: {
            unit: "آیتم",
            verb: "داشته باشد"
        },
        set: {
            unit: "آیتم",
            verb: "داشته باشد"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "عدد";
                case "object": {
                    if (Array.isArray(z)) return "آرایه";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "ورودی",
            email: "آدرس ایمیل",
            url: "URL",
            emoji: "ایموجی",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "تاریخ و زمان ایزو",
            date: "تاریخ ایزو",
            time: "زمان ایزو",
            duration: "مدت زمان ایزو",
            ipv4: "IPv4 آدرس",
            ipv6: "IPv6 آدرس",
            cidrv4: "IPv4 دامنه",
            cidrv6: "IPv6 دامنه",
            base64: "base64-encoded رشته",
            base64url: "base64url-encoded رشته",
            json_string: "JSON رشته",
            e164: "E.164 عدد",
            jwt: "JWT",
            template_literal: "ورودی"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `ورودی نامعتبر: می‌بایست ${z.expected} می‌بود، ${K(z.input)} دریافت شد`;
            case "invalid_value":
                if (z.values.length === 1) return `ورودی نامعتبر: می‌بایست ${Q7(z.values[0])} می‌بود`;
                return `گزینه نامعتبر: می‌بایست یکی از ${J8(z.values,"|")} می‌بود`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `خیلی بزرگ: ${z.origin??"مقدار"} باید ${w}${z.maximum.toString()} ${H.unit??"عنصر"} باشد`;
                return `خیلی بزرگ: ${z.origin??"مقدار"} باید ${w}${z.maximum.toString()} باشد`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `خیلی کوچک: ${z.origin} باید ${w}${z.minimum.toString()} ${H.unit} باشد`;
                return `خیلی کوچک: ${z.origin} باید ${w}${z.minimum.toString()} باشد`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `رشته نامعتبر: باید با "${w.prefix}" شروع شود`;
                if (w.format === "ends_with") return `رشته نامعتبر: باید با "${w.suffix}" تمام شود`;
                if (w.format === "includes") return `رشته نامعتبر: باید شامل "${w.includes}" باشد`;
                if (w.format === "regex") return `رشته نامعتبر: باید با الگوی ${w.pattern} مطابقت داشته باشد`;
                return `${Y[w.format]??z.format} نامعتبر`
            }
            case "not_multiple_of":
                return `عدد نامعتبر: باید مضرب ${z.divisor} باشد`;
            case "unrecognized_keys":
                return `کلید${z.keys.length>1?"های":""} ناشناس: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `کلید ناشناس در ${z.origin}`;
            case "invalid_union":
                return "ورودی نامعتبر";
            case "invalid_element":
                return `مقدار نامعتبر در ${z.origin}`;
            default:
                return "ورودی نامعتبر"
        }
    }
}
// @from(Ln 40556, Col 4)
K28 = v(() => {
    A3()
})
// @from(Ln 40560, Col 0)
function pu6() {
    return {
        localeError: UwK()
    }
}
// @from(Ln 40565, Col 4)
UwK = () => {
    let A = {
        string: {
            unit: "merkkiä",
            subject: "merkkijonon"
        },
        file: {
            unit: "tavua",
            subject: "tiedoston"
        },
        array: {
            unit: "alkiota",
            subject: "listan"
        },
        set: {
            unit: "alkiota",
            subject: "joukon"
        },
        number: {
            unit: "",
            subject: "luvun"
        },
        bigint: {
            unit: "",
            subject: "suuren kokonaisluvun"
        },
        int: {
            unit: "",
            subject: "kokonaisluvun"
        },
        date: {
            unit: "",
            subject: "päivämäärän"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "säännöllinen lauseke",
            email: "sähköpostiosoite",
            url: "URL-osoite",
            emoji: "emoji",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "ISO-aikaleima",
            date: "ISO-päivämäärä",
            time: "ISO-aika",
            duration: "ISO-kesto",
            ipv4: "IPv4-osoite",
            ipv6: "IPv6-osoite",
            cidrv4: "IPv4-alue",
            cidrv6: "IPv6-alue",
            base64: "base64-koodattu merkkijono",
            base64url: "base64url-koodattu merkkijono",
            json_string: "JSON-merkkijono",
            e164: "E.164-luku",
            jwt: "JWT",
            template_literal: "templaattimerkkijono"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Virheellinen tyyppi: odotettiin ${z.expected}, oli ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Virheellinen syöte: täytyy olla ${Q7(z.values[0])}`;
                return `Virheellinen valinta: täytyy olla yksi seuraavista: ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Liian suuri: ${H.subject} täytyy olla ${w}${z.maximum.toString()} ${H.unit}`.trim();
                return `Liian suuri: arvon täytyy olla ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Liian pieni: ${H.subject} täytyy olla ${w}${z.minimum.toString()} ${H.unit}`.trim();
                return `Liian pieni: arvon täytyy olla ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Virheellinen syöte: täytyy alkaa "${w.prefix}"`;
                if (w.format === "ends_with") return `Virheellinen syöte: täytyy loppua "${w.suffix}"`;
                if (w.format === "includes") return `Virheellinen syöte: täytyy sisältää "${w.includes}"`;
                if (w.format === "regex") return `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${w.pattern}`;
                return `Virheellinen ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Virheellinen luku: täytyy olla luvun ${z.divisor} monikerta`;
            case "unrecognized_keys":
                return `${z.keys.length>1?"Tuntemattomat avaimet":"Tuntematon avain"}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return "Virheellinen avain tietueessa";
            case "invalid_union":
                return "Virheellinen unioni";
            case "invalid_element":
                return "Virheellinen arvo joukossa";
            default:
                return "Virheellinen syöte"
        }
    }
}
// @from(Ln 40689, Col 4)
Y28 = v(() => {
    A3()
})
// @from(Ln 40693, Col 0)
function du6() {
    return {
        localeError: pwK()
    }
}
// @from(Ln 40698, Col 4)
pwK = () => {
    let A = {
        string: {
            unit: "caractères",
            verb: "avoir"
        },
        file: {
            unit: "octets",
            verb: "avoir"
        },
        array: {
            unit: "éléments",
            verb: "avoir"
        },
        set: {
            unit: "éléments",
            verb: "avoir"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "nombre";
                case "object": {
                    if (Array.isArray(z)) return "tableau";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "entrée",
            email: "adresse e-mail",
            url: "URL",
            emoji: "emoji",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "date et heure ISO",
            date: "date ISO",
            time: "heure ISO",
            duration: "durée ISO",
            ipv4: "adresse IPv4",
            ipv6: "adresse IPv6",
            cidrv4: "plage IPv4",
            cidrv6: "plage IPv6",
            base64: "chaîne encodée en base64",
            base64url: "chaîne encodée en base64url",
            json_string: "chaîne JSON",
            e164: "numéro E.164",
            jwt: "JWT",
            template_literal: "entrée"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Entrée invalide : ${z.expected} attendu, ${K(z.input)} reçu`;
            case "invalid_value":
                if (z.values.length === 1) return `Entrée invalide : ${Q7(z.values[0])} attendu`;
                return `Option invalide : une valeur parmi ${J8(z.values,"|")} attendue`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Trop grand : ${z.origin??"valeur"} doit ${H.verb} ${w}${z.maximum.toString()} ${H.unit??"élément(s)"}`;
                return `Trop grand : ${z.origin??"valeur"} doit être ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Trop petit : ${z.origin} doit ${H.verb} ${w}${z.minimum.toString()} ${H.unit}`;
                return `Trop petit : ${z.origin} doit être ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Chaîne invalide : doit commencer par "${w.prefix}"`;
                if (w.format === "ends_with") return `Chaîne invalide : doit se terminer par "${w.suffix}"`;
                if (w.format === "includes") return `Chaîne invalide : doit inclure "${w.includes}"`;
                if (w.format === "regex") return `Chaîne invalide : doit correspondre au modèle ${w.pattern}`;
                return `${Y[w.format]??z.format} invalide`
            }
            case "not_multiple_of":
                return `Nombre invalide : doit être un multiple de ${z.divisor}`;
            case "unrecognized_keys":
                return `Clé${z.keys.length>1?"s":""} non reconnue${z.keys.length>1?"s":""} : ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Clé invalide dans ${z.origin}`;
            case "invalid_union":
                return "Entrée invalide";
            case "invalid_element":
                return `Valeur invalide dans ${z.origin}`;
            default:
                return "Entrée invalide"
        }
    }
}
// @from(Ln 40806, Col 4)
z28 = v(() => {
    A3()
})
// @from(Ln 40810, Col 0)
function cu6() {
    return {
        localeError: dwK()
    }
}
// @from(Ln 40815, Col 4)
dwK = () => {
    let A = {
        string: {
            unit: "caractères",
            verb: "avoir"
        },
        file: {
            unit: "octets",
            verb: "avoir"
        },
        array: {
            unit: "éléments",
            verb: "avoir"
        },
        set: {
            unit: "éléments",
            verb: "avoir"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "entrée",
            email: "adresse courriel",
            url: "URL",
            emoji: "emoji",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "date-heure ISO",
            date: "date ISO",
            time: "heure ISO",
            duration: "durée ISO",
            ipv4: "adresse IPv4",
            ipv6: "adresse IPv6",
            cidrv4: "plage IPv4",
            cidrv6: "plage IPv6",
            base64: "chaîne encodée en base64",
            base64url: "chaîne encodée en base64url",
            json_string: "chaîne JSON",
            e164: "numéro E.164",
            jwt: "JWT",
            template_literal: "entrée"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Entrée invalide : attendu ${z.expected}, reçu ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Entrée invalide : attendu ${Q7(z.values[0])}`;
                return `Option invalide : attendu l'une des valeurs suivantes ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "≤" : "<",
                    H = q(z.origin);
                if (H) return `Trop grand : attendu que ${z.origin??"la valeur"} ait ${w}${z.maximum.toString()} ${H.unit}`;
                return `Trop grand : attendu que ${z.origin??"la valeur"} soit ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? "≥" : ">",
                    H = q(z.origin);
                if (H) return `Trop petit : attendu que ${z.origin} ait ${w}${z.minimum.toString()} ${H.unit}`;
                return `Trop petit : attendu que ${z.origin} soit ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Chaîne invalide : doit commencer par "${w.prefix}"`;
                if (w.format === "ends_with") return `Chaîne invalide : doit se terminer par "${w.suffix}"`;
                if (w.format === "includes") return `Chaîne invalide : doit inclure "${w.includes}"`;
                if (w.format === "regex") return `Chaîne invalide : doit correspondre au motif ${w.pattern}`;
                return `${Y[w.format]??z.format} invalide`
            }
            case "not_multiple_of":
                return `Nombre invalide : doit être un multiple de ${z.divisor}`;
            case "unrecognized_keys":
                return `Clé${z.keys.length>1?"s":""} non reconnue${z.keys.length>1?"s":""} : ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Clé invalide dans ${z.origin}`;
            case "invalid_union":
                return "Entrée invalide";
            case "invalid_element":
                return `Valeur invalide dans ${z.origin}`;
            default:
                return "Entrée invalide"
        }
    }
}
// @from(Ln 40923, Col 4)
w28 = v(() => {
    A3()
})
// @from(Ln 40927, Col 0)
function lu6() {
    return {
        localeError: cwK()
    }
}