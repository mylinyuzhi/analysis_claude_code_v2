
// @from(Ln 151053, Col 4)
RRA = w(() => {
  JQ1();
  WIA();
  QQ1();
  GQ1();
  W6();
  Bt1();
  W6();
  v6 = z0("$ZodType", (A, Q) => {
    var B;
    A ?? (A = {}), A._zod.def = Q, A._zod.bag = A._zod.bag || {}, A._zod.version = Qt1;
    let G = [...A._zod.def.checks ?? []];
    if (A._zod.traits.has("$ZodCheck")) G.unshift(A);
    for (let Z of G)
      for (let Y of Z._zod.onattach) Y(A);
    if (G.length === 0)(B = A._zod).deferred ?? (B.deferred = []), A._zod.deferred?.push(() => {
      A._zod.run = A._zod.parse
    });
    else {
      let Z = (Y, J, X) => {
        let I = VBA(Y),
          D;
        for (let W of J) {
          if (W._zod.when) {
            if (!W._zod.when(Y)) continue
          } else if (I) continue;
          let K = Y.issues.length,
            V = W._zod.check(Y);
          if (V instanceof Promise && X?.async === !1) throw new lu;
          if (D || V instanceof Promise) D = (D ?? Promise.resolve()).then(async () => {
            if (await V, Y.issues.length === K) return;
            if (!I) I = VBA(Y, K)
          });
          else {
            if (Y.issues.length === K) continue;
            if (!I) I = VBA(Y, K)
          }
        }
        if (D) return D.then(() => {
          return Y
        });
        return Y
      };
      A._zod.run = (Y, J) => {
        let X = A._zod.parse(Y, J);
        if (X instanceof Promise) {
          if (J.async === !1) throw new lu;
          return X.then((I) => Z(I, G, J))
        }
        return Z(X, G, J)
      }
    }
    A["~standard"] = {
      validate: (Z) => {
        try {
          let Y = HIA(A, Z);
          return Y.success ? {
            value: Y.data
          } : {
            issues: Y.error?.issues
          }
        } catch (Y) {
          return NRA(A, Z).then((J) => J.success ? {
            value: J.data
          } : {
            issues: J.error?.issues
          })
        }
      },
      vendor: "zod",
      version: 1
    }
  }), EBA = z0("$ZodString", (A, Q) => {
    v6.init(A, Q), A._zod.pattern = [...A?._zod.bag?.patterns ?? []].pop() ?? js1(A._zod.bag), A._zod.parse = (B, G) => {
      if (Q.coerce) try {
        B.value = String(B.value)
      } catch (Z) {}
      if (typeof B.value === "string") return B;
      return B.issues.push({
        expected: "string",
        code: "invalid_type",
        input: B.value,
        inst: A
      }), B
    }
  }), QY = z0("$ZodStringFormat", (A, Q) => {
    EIA.init(A, Q), EBA.init(A, Q)
  }), Zt1 = z0("$ZodGUID", (A, Q) => {
    Q.pattern ?? (Q.pattern = Es1), QY.init(A, Q)
  }), Yt1 = z0("$ZodUUID", (A, Q) => {
    if (Q.version) {
      let G = {
        v1: 1,
        v2: 2,
        v3: 3,
        v4: 4,
        v5: 5,
        v6: 6,
        v7: 7,
        v8: 8
      } [Q.version];
      if (G === void 0) throw Error(`Invalid UUID version: "${Q.version}"`);
      Q.pattern ?? (Q.pattern = FBA(G))
    } else Q.pattern ?? (Q.pattern = FBA());
    QY.init(A, Q)
  }), Jt1 = z0("$ZodEmail", (A, Q) => {
    Q.pattern ?? (Q.pattern = zs1), QY.init(A, Q)
  }), Xt1 = z0("$ZodURL", (A, Q) => {
    QY.init(A, Q), A._zod.check = (B) => {
      try {
        let G = B.value,
          Z = new URL(G),
          Y = Z.href;
        if (Q.hostname) {
          if (Q.hostname.lastIndex = 0, !Q.hostname.test(Z.hostname)) B.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid hostname",
            pattern: Ls1.source,
            input: B.value,
            inst: A,
            continue: !Q.abort
          })
        }
        if (Q.protocol) {
          if (Q.protocol.lastIndex = 0, !Q.protocol.test(Z.protocol.endsWith(":") ? Z.protocol.slice(0, -1) : Z.protocol)) B.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid protocol",
            pattern: Q.protocol.source,
            input: B.value,
            inst: A,
            continue: !Q.abort
          })
        }
        if (!G.endsWith("/") && Y.endsWith("/")) B.value = Y.slice(0, -1);
        else B.value = Y;
        return
      } catch (G) {
        B.issues.push({
          code: "invalid_format",
          format: "url",
          input: B.value,
          inst: A,
          continue: !Q.abort
        })
      }
    }
  }), It1 = z0("$ZodEmoji", (A, Q) => {
    Q.pattern ?? (Q.pattern = $s1()), QY.init(A, Q)
  }), Dt1 = z0("$ZodNanoID", (A, Q) => {
    Q.pattern ?? (Q.pattern = Fs1), QY.init(A, Q)
  }), Wt1 = z0("$ZodCUID", (A, Q) => {
    Q.pattern ?? (Q.pattern = Is1), QY.init(A, Q)
  }), Kt1 = z0("$ZodCUID2", (A, Q) => {
    Q.pattern ?? (Q.pattern = Ds1), QY.init(A, Q)
  }), Vt1 = z0("$ZodULID", (A, Q) => {
    Q.pattern ?? (Q.pattern = Ws1), QY.init(A, Q)
  }), Ft1 = z0("$ZodXID", (A, Q) => {
    Q.pattern ?? (Q.pattern = Ks1), QY.init(A, Q)
  }), Ht1 = z0("$ZodKSUID", (A, Q) => {
    Q.pattern ?? (Q.pattern = Vs1), QY.init(A, Q)
  }), Et1 = z0("$ZodISODateTime", (A, Q) => {
    Q.pattern ?? (Q.pattern = _s1(Q)), QY.init(A, Q)
  }), zt1 = z0("$ZodISODate", (A, Q) => {
    Q.pattern ?? (Q.pattern = Ms1), QY.init(A, Q)
  }), $t1 = z0("$ZodISOTime", (A, Q) => {
    Q.pattern ?? (Q.pattern = Rs1(Q)), QY.init(A, Q)
  }), Ct1 = z0("$ZodISODuration", (A, Q) => {
    Q.pattern ?? (Q.pattern = Hs1), QY.init(A, Q)
  }), Ut1 = z0("$ZodIPv4", (A, Q) => {
    Q.pattern ?? (Q.pattern = Cs1), QY.init(A, Q), A._zod.onattach.push((B) => {
      let G = B._zod.bag;
      G.format = "ipv4"
    })
  }), qt1 = z0("$ZodIPv6", (A, Q) => {
    Q.pattern ?? (Q.pattern = Us1), QY.init(A, Q), A._zod.onattach.push((B) => {
      let G = B._zod.bag;
      G.format = "ipv6"
    }), A._zod.check = (B) => {
      try {
        new URL(`http://[${B.value}]`)
      } catch {
        B.issues.push({
          code: "invalid_format",
          format: "ipv6",
          input: B.value,
          inst: A,
          continue: !Q.abort
        })
      }
    }
  }), Nt1 = z0("$ZodCIDRv4", (A, Q) => {
    Q.pattern ?? (Q.pattern = qs1), QY.init(A, Q)
  }), wt1 = z0("$ZodCIDRv6", (A, Q) => {
    Q.pattern ?? (Q.pattern = Ns1), QY.init(A, Q), A._zod.check = (B) => {
      let [G, Z] = B.value.split("/");
      try {
        if (!Z) throw Error();
        let Y = Number(Z);
        if (`${Y}` !== Z) throw Error();
        if (Y < 0 || Y > 128) throw Error();
        new URL(`http://[${G}]`)
      } catch {
        B.issues.push({
          code: "invalid_format",
          format: "cidrv6",
          input: B.value,
          inst: A,
          continue: !Q.abort
        })
      }
    }
  });
  Ot1 = z0("$ZodBase64", (A, Q) => {
    Q.pattern ?? (Q.pattern = ws1), QY.init(A, Q), A._zod.onattach.push((B) => {
      B._zod.bag.contentEncoding = "base64"
    }), A._zod.check = (B) => {
      if (Lt1(B.value)) return;
      B.issues.push({
        code: "invalid_format",
        format: "base64",
        input: B.value,
        inst: A,
        continue: !Q.abort
      })
    }
  });
  Mt1 = z0("$ZodBase64URL", (A, Q) => {
    Q.pattern ?? (Q.pattern = BQ1), QY.init(A, Q), A._zod.onattach.push((B) => {
      B._zod.bag.contentEncoding = "base64url"
    }), A._zod.check = (B) => {
      if (QzB(B.value)) return;
      B.issues.push({
        code: "invalid_format",
        format: "base64url",
        input: B.value,
        inst: A,
        continue: !Q.abort
      })
    }
  }), Rt1 = z0("$ZodE164", (A, Q) => {
    Q.pattern ?? (Q.pattern = Os1), QY.init(A, Q)
  });
  _t1 = z0("$ZodJWT", (A, Q) => {
    QY.init(A, Q), A._zod.check = (B) => {
      if (BzB(B.value, Q.alg)) return;
      B.issues.push({
        code: "invalid_format",
        format: "jwt",
        input: B.value,
        inst: A,
        continue: !Q.abort
      })
    }
  }), jt1 = z0("$ZodCustomStringFormat", (A, Q) => {
    QY.init(A, Q), A._zod.check = (B) => {
      if (Q.fn(B.value)) return;
      B.issues.push({
        code: "invalid_format",
        format: Q.format,
        input: B.value,
        inst: A,
        continue: !Q.abort
      })
    }
  }), WQ1 = z0("$ZodNumber", (A, Q) => {
    v6.init(A, Q), A._zod.pattern = A._zod.bag.pattern ?? Ss1, A._zod.parse = (B, G) => {
      if (Q.coerce) try {
        B.value = Number(B.value)
      } catch (J) {}
      let Z = B.value;
      if (typeof Z === "number" && !Number.isNaN(Z) && Number.isFinite(Z)) return B;
      let Y = typeof Z === "number" ? Number.isNaN(Z) ? "NaN" : !Number.isFinite(Z) ? "Infinity" : void 0 : void 0;
      return B.issues.push({
        expected: "number",
        code: "invalid_type",
        input: Z,
        inst: A,
        ...Y ? {
          received: Y
        } : {}
      }), B
    }
  }), Tt1 = z0("$ZodNumber", (A, Q) => {
    hs1.init(A, Q), WQ1.init(A, Q)
  }), wRA = z0("$ZodBoolean", (A, Q) => {
    v6.init(A, Q), A._zod.pattern = xs1, A._zod.parse = (B, G) => {
      if (Q.coerce) try {
        B.value = Boolean(B.value)
      } catch (Y) {}
      let Z = B.value;
      if (typeof Z === "boolean") return B;
      return B.issues.push({
        expected: "boolean",
        code: "invalid_type",
        input: Z,
        inst: A
      }), B
    }
  }), KQ1 = z0("$ZodBigInt", (A, Q) => {
    v6.init(A, Q), A._zod.pattern = Ts1, A._zod.parse = (B, G) => {
      if (Q.coerce) try {
        B.value = BigInt(B.value)
      } catch (Z) {}
      if (typeof B.value === "bigint") return B;
      return B.issues.push({
        expected: "bigint",
        code: "invalid_type",
        input: B.value,
        inst: A
      }), B
    }
  }), Pt1 = z0("$ZodBigInt", (A, Q) => {
    gs1.init(A, Q), KQ1.init(A, Q)
  }), St1 = z0("$ZodSymbol", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B, G) => {
      let Z = B.value;
      if (typeof Z === "symbol") return B;
      return B.issues.push({
        expected: "symbol",
        code: "invalid_type",
        input: Z,
        inst: A
      }), B
    }
  }), xt1 = z0("$ZodUndefined", (A, Q) => {
    v6.init(A, Q), A._zod.pattern = vs1, A._zod.values = new Set([void 0]), A._zod.optin = "optional", A._zod.optout = "optional", A._zod.parse = (B, G) => {
      let Z = B.value;
      if (typeof Z > "u") return B;
      return B.issues.push({
        expected: "undefined",
        code: "invalid_type",
        input: Z,
        inst: A
      }), B
    }
  }), yt1 = z0("$ZodNull", (A, Q) => {
    v6.init(A, Q), A._zod.pattern = ys1, A._zod.values = new Set([null]), A._zod.parse = (B, G) => {
      let Z = B.value;
      if (Z === null) return B;
      return B.issues.push({
        expected: "null",
        code: "invalid_type",
        input: Z,
        inst: A
      }), B
    }
  }), vt1 = z0("$ZodAny", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B) => B
  }), zIA = z0("$ZodUnknown", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B) => B
  }), kt1 = z0("$ZodNever", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B, G) => {
      return B.issues.push({
        expected: "never",
        code: "invalid_type",
        input: B.value,
        inst: A
      }), B
    }
  }), bt1 = z0("$ZodVoid", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B, G) => {
      let Z = B.value;
      if (typeof Z > "u") return B;
      return B.issues.push({
        expected: "void",
        code: "invalid_type",
        input: Z,
        inst: A
      }), B
    }
  }), ft1 = z0("$ZodDate", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B, G) => {
      if (Q.coerce) try {
        B.value = new Date(B.value)
      } catch (X) {}
      let Z = B.value,
        Y = Z instanceof Date;
      if (Y && !Number.isNaN(Z.getTime())) return B;
      return B.issues.push({
        expected: "date",
        code: "invalid_type",
        input: Z,
        ...Y ? {
          received: "Invalid Date"
        } : {},
        inst: A
      }), B
    }
  });
  LRA = z0("$ZodArray", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B, G) => {
      let Z = B.value;
      if (!Array.isArray(Z)) return B.issues.push({
        expected: "array",
        code: "invalid_type",
        input: Z,
        inst: A
      }), B;
      B.value = Array(Z.length);
      let Y = [];
      for (let J = 0; J < Z.length; J++) {
        let X = Z[J],
          I = Q.element._zod.run({
            value: X,
            issues: []
          }, G);
        if (I instanceof Promise) Y.push(I.then((D) => pEB(D, B, J)));
        else pEB(I, B, J)
      }
      if (Y.length) return Promise.all(Y).then(() => B);
      return B
    }
  });
  ht1 = z0("$ZodObject", (A, Q) => {
    v6.init(A, Q);
    let B = KRA(() => {
      let K = Object.keys(Q.shape);
      for (let F of K)
        if (!(Q.shape[F] instanceof v6)) throw Error(`Invalid element at key "${F}": expected a Zod schema`);
      let V = Qs1(Q.shape);
      return {
        shape: Q.shape,
        keys: K,
        keySet: new Set(K),
        numKeys: K.length,
        optionalKeys: new Set(V)
      }
    });
    IG(A._zod, "propValues", () => {
      let K = Q.shape,
        V = {};
      for (let F in K) {
        let H = K[F]._zod;
        if (H.values) {
          V[F] ?? (V[F] = new Set);
          for (let E of H.values) V[F].add(E)
        }
      }
      return V
    });
    let G = (K) => {
        let V = new XQ1(["shape", "payload", "ctx"]),
          F = B.value,
          H = (O) => {
            let L = KBA(O);
            return `shape[${L}]._zod.run({ value: input[${L}], issues: [] }, ctx)`
          };
        V.write("const input = payload.value;");
        let E = Object.create(null),
          z = 0;
        for (let O of F.keys) E[O] = `key_${z++}`;
        V.write("const newResult = {}");
        for (let O of F.keys)
          if (F.optionalKeys.has(O)) {
            let L = E[O];
            V.write(`const ${L} = ${H(O)};`);
            let M = KBA(O);
            V.write(`
        if (${L}.issues.length) {
          if (input[${M}] === undefined) {
            if (${M} in input) {
              newResult[${M}] = undefined;
            }
          } else {
            payload.issues = payload.issues.concat(
              ${L}.issues.map((iss) => ({
                ...iss,
                path: iss.path ? [${M}, ...iss.path] : [${M}],
              }))
            );
          }
        } else if (${L}.value === undefined) {
          if (${M} in input) newResult[${M}] = undefined;
        } else {
          newResult[${M}] = ${L}.value;
        }
        `)
          } else {
            let L = E[O];
            V.write(`const ${L} = ${H(O)};`), V.write(`
          if (${L}.issues.length) payload.issues = payload.issues.concat(${L}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${KBA(O)}, ...iss.path] : [${KBA(O)}]
          })));`), V.write(`newResult[${KBA(O)}] = ${L}.value`)
          } V.write("payload.value = newResult;"), V.write("return payload;");
        let $ = V.compile();
        return (O, L) => $(K, O, L)
      },
      Z, Y = KIA,
      J = !XRA.jitless,
      I = J && er1.value,
      D = Q.catchall,
      W;
    A._zod.parse = (K, V) => {
      W ?? (W = B.value);
      let F = K.value;
      if (!Y(F)) return K.issues.push({
        expected: "object",
        code: "invalid_type",
        input: F,
        inst: A
      }), K;
      let H = [];
      if (J && I && V?.async === !1 && V.jitless !== !0) {
        if (!Z) Z = G(Q.shape);
        K = Z(K, V)
      } else {
        K.value = {};
        let L = W.shape;
        for (let M of W.keys) {
          let _ = L[M],
            j = _._zod.run({
              value: F[M],
              issues: []
            }, V),
            x = _._zod.optin === "optional" && _._zod.optout === "optional";
          if (j instanceof Promise) H.push(j.then((b) => x ? lEB(b, K, M, F) : IQ1(b, K, M)));
          else if (x) lEB(j, K, M, F);
          else IQ1(j, K, M)
        }
      }
      if (!D) return H.length ? Promise.all(H).then(() => K) : K;
      let E = [],
        z = W.keySet,
        $ = D._zod,
        O = $.def.type;
      for (let L of Object.keys(F)) {
        if (z.has(L)) continue;
        if (O === "never") {
          E.push(L);
          continue
        }
        let M = $.run({
          value: F[L],
          issues: []
        }, V);
        if (M instanceof Promise) H.push(M.then((_) => IQ1(_, K, L)));
        else IQ1(M, K, L)
      }
      if (E.length) K.issues.push({
        code: "unrecognized_keys",
        keys: E,
        input: F,
        inst: A
      });
      if (!H.length) return K;
      return Promise.all(H).then(() => {
        return K
      })
    }
  });
  VQ1 = z0("$ZodUnion", (A, Q) => {
    v6.init(A, Q), IG(A._zod, "optin", () => Q.options.some((B) => B._zod.optin === "optional") ? "optional" : void 0), IG(A._zod, "optout", () => Q.options.some((B) => B._zod.optout === "optional") ? "optional" : void 0), IG(A._zod, "values", () => {
      if (Q.options.every((B) => B._zod.values)) return new Set(Q.options.flatMap((B) => Array.from(B._zod.values)));
      return
    }), IG(A._zod, "pattern", () => {
      if (Q.options.every((B) => B._zod.pattern)) {
        let B = Q.options.map((G) => G._zod.pattern);
        return new RegExp(`^(${B.map((G)=>VRA(G.source)).join("|")})$`)
      }
      return
    }), A._zod.parse = (B, G) => {
      let Z = !1,
        Y = [];
      for (let J of Q.options) {
        let X = J._zod.run({
          value: B.value,
          issues: []
        }, G);
        if (X instanceof Promise) Y.push(X), Z = !0;
        else {
          if (X.issues.length === 0) return X;
          Y.push(X)
        }
      }
      if (!Z) return iEB(Y, B, A, G);
      return Promise.all(Y).then((J) => {
        return iEB(J, B, A, G)
      })
    }
  }), gt1 = z0("$ZodDiscriminatedUnion", (A, Q) => {
    VQ1.init(A, Q);
    let B = A._zod.parse;
    IG(A._zod, "propValues", () => {
      let Z = {};
      for (let Y of Q.options) {
        let J = Y._zod.propValues;
        if (!J || Object.keys(J).length === 0) throw Error(`Invalid discriminated union option at index "${Q.options.indexOf(Y)}"`);
        for (let [X, I] of Object.entries(J)) {
          if (!Z[X]) Z[X] = new Set;
          for (let D of I) Z[X].add(D)
        }
      }
      return Z
    });
    let G = KRA(() => {
      let Z = Q.options,
        Y = new Map;
      for (let J of Z) {
        let X = J._zod.propValues[Q.discriminator];
        if (!X || X.size === 0) throw Error(`Invalid discriminated union option at index "${Q.options.indexOf(J)}"`);
        for (let I of X) {
          if (Y.has(I)) throw Error(`Duplicate discriminator value "${String(I)}"`);
          Y.set(I, J)
        }
      }
      return Y
    });
    A._zod.parse = (Z, Y) => {
      let J = Z.value;
      if (!KIA(J)) return Z.issues.push({
        code: "invalid_type",
        expected: "object",
        input: J,
        inst: A
      }), Z;
      let X = G.value.get(J?.[Q.discriminator]);
      if (X) return X._zod.run(Z, Y);
      if (Q.unionFallback) return B(Z, Y);
      return Z.issues.push({
        code: "invalid_union",
        errors: [],
        note: "No matching discriminator",
        input: J,
        path: [Q.discriminator],
        inst: A
      }), Z
    }
  }), ut1 = z0("$ZodIntersection", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B, G) => {
      let Z = B.value,
        Y = Q.left._zod.run({
          value: Z,
          issues: []
        }, G),
        J = Q.right._zod.run({
          value: Z,
          issues: []
        }, G);
      if (Y instanceof Promise || J instanceof Promise) return Promise.all([Y, J]).then(([I, D]) => {
        return nEB(B, I, D)
      });
      return nEB(B, Y, J)
    }
  });
  zBA = z0("$ZodTuple", (A, Q) => {
    v6.init(A, Q);
    let B = Q.items,
      G = B.length - [...B].reverse().findIndex((Z) => Z._zod.optin !== "optional");
    A._zod.parse = (Z, Y) => {
      let J = Z.value;
      if (!Array.isArray(J)) return Z.issues.push({
        input: J,
        inst: A,
        expected: "tuple",
        code: "invalid_type"
      }), Z;
      Z.value = [];
      let X = [];
      if (!Q.rest) {
        let D = J.length > B.length,
          W = J.length < G - 1;
        if (D || W) return Z.issues.push({
          input: J,
          inst: A,
          origin: "array",
          ...D ? {
            code: "too_big",
            maximum: B.length
          } : {
            code: "too_small",
            minimum: B.length
          }
        }), Z
      }
      let I = -1;
      for (let D of B) {
        if (I++, I >= J.length) {
          if (I >= G) continue
        }
        let W = D._zod.run({
          value: J[I],
          issues: []
        }, Y);
        if (W instanceof Promise) X.push(W.then((K) => DQ1(K, Z, I)));
        else DQ1(W, Z, I)
      }
      if (Q.rest) {
        let D = J.slice(B.length);
        for (let W of D) {
          I++;
          let K = Q.rest._zod.run({
            value: W,
            issues: []
          }, Y);
          if (K instanceof Promise) X.push(K.then((V) => DQ1(V, Z, I)));
          else DQ1(K, Z, I)
        }
      }
      if (X.length) return Promise.all(X).then(() => Z);
      return Z
    }
  });
  mt1 = z0("$ZodRecord", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B, G) => {
      let Z = B.value;
      if (!VIA(Z)) return B.issues.push({
        expected: "record",
        code: "invalid_type",
        input: Z,
        inst: A
      }), B;
      let Y = [];
      if (Q.keyType._zod.values) {
        let J = Q.keyType._zod.values;
        B.value = {};
        for (let I of J)
          if (typeof I === "string" || typeof I === "number" || typeof I === "symbol") {
            let D = Q.valueType._zod.run({
              value: Z[I],
              issues: []
            }, G);
            if (D instanceof Promise) Y.push(D.then((W) => {
              if (W.issues.length) B.issues.push(...rq(I, W.issues));
              B.value[I] = W.value
            }));
            else {
              if (D.issues.length) B.issues.push(...rq(I, D.issues));
              B.value[I] = D.value
            }
          } let X;
        for (let I in Z)
          if (!J.has(I)) X = X ?? [], X.push(I);
        if (X && X.length > 0) B.issues.push({
          code: "unrecognized_keys",
          input: Z,
          inst: A,
          keys: X
        })
      } else {
        B.value = {};
        for (let J of Reflect.ownKeys(Z)) {
          if (J === "__proto__") continue;
          let X = Q.keyType._zod.run({
            value: J,
            issues: []
          }, G);
          if (X instanceof Promise) throw Error("Async schemas not supported in object keys currently");
          if (X.issues.length) {
            B.issues.push({
              origin: "record",
              code: "invalid_key",
              issues: X.issues.map((D) => uL(D, G, pW())),
              input: J,
              path: [J],
              inst: A
            }), B.value[X.value] = X.value;
            continue
          }
          let I = Q.valueType._zod.run({
            value: Z[J],
            issues: []
          }, G);
          if (I instanceof Promise) Y.push(I.then((D) => {
            if (D.issues.length) B.issues.push(...rq(J, D.issues));
            B.value[X.value] = D.value
          }));
          else {
            if (I.issues.length) B.issues.push(...rq(J, I.issues));
            B.value[X.value] = I.value
          }
        }
      }
      if (Y.length) return Promise.all(Y).then(() => B);
      return B
    }
  }), dt1 = z0("$ZodMap", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B, G) => {
      let Z = B.value;
      if (!(Z instanceof Map)) return B.issues.push({
        expected: "map",
        code: "invalid_type",
        input: Z,
        inst: A
      }), B;
      let Y = [];
      B.value = new Map;
      for (let [J, X] of Z) {
        let I = Q.keyType._zod.run({
            value: J,
            issues: []
          }, G),
          D = Q.valueType._zod.run({
            value: X,
            issues: []
          }, G);
        if (I instanceof Promise || D instanceof Promise) Y.push(Promise.all([I, D]).then(([W, K]) => {
          aEB(W, K, B, J, Z, A, G)
        }));
        else aEB(I, D, B, J, Z, A, G)
      }
      if (Y.length) return Promise.all(Y).then(() => B);
      return B
    }
  });
  ct1 = z0("$ZodSet", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B, G) => {
      let Z = B.value;
      if (!(Z instanceof Set)) return B.issues.push({
        input: Z,
        inst: A,
        expected: "set",
        code: "invalid_type"
      }), B;
      let Y = [];
      B.value = new Set;
      for (let J of Z) {
        let X = Q.valueType._zod.run({
          value: J,
          issues: []
        }, G);
        if (X instanceof Promise) Y.push(X.then((I) => oEB(I, B)));
        else oEB(X, B)
      }
      if (Y.length) return Promise.all(Y).then(() => B);
      return B
    }
  });
  pt1 = z0("$ZodEnum", (A, Q) => {
    v6.init(A, Q);
    let B = WRA(Q.entries);
    A._zod.values = new Set(B), A._zod.pattern = new RegExp(`^(${B.filter((G)=>FRA.has(typeof G)).map((G)=>typeof G==="string"?iu(G):G.toString()).join("|")})$`), A._zod.parse = (G, Z) => {
      let Y = G.value;
      if (A._zod.values.has(Y)) return G;
      return G.issues.push({
        code: "invalid_value",
        values: B,
        input: Y,
        inst: A
      }), G
    }
  }), lt1 = z0("$ZodLiteral", (A, Q) => {
    v6.init(A, Q), A._zod.values = new Set(Q.values), A._zod.pattern = new RegExp(`^(${Q.values.map((B)=>typeof B==="string"?iu(B):B?B.toString():String(B)).join("|")})$`), A._zod.parse = (B, G) => {
      let Z = B.value;
      if (A._zod.values.has(Z)) return B;
      return B.issues.push({
        code: "invalid_value",
        values: Q.values,
        input: Z,
        inst: A
      }), B
    }
  }), it1 = z0("$ZodFile", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B, G) => {
      let Z = B.value;
      if (Z instanceof File) return B;
      return B.issues.push({
        expected: "file",
        code: "invalid_type",
        input: Z,
        inst: A
      }), B
    }
  }), ORA = z0("$ZodTransform", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B, G) => {
      let Z = Q.transform(B.value, B);
      if (G.async) return (Z instanceof Promise ? Z : Promise.resolve(Z)).then((J) => {
        return B.value = J, B
      });
      if (Z instanceof Promise) throw new lu;
      return B.value = Z, B
    }
  }), nt1 = z0("$ZodOptional", (A, Q) => {
    v6.init(A, Q), A._zod.optin = "optional", A._zod.optout = "optional", IG(A._zod, "values", () => {
      return Q.innerType._zod.values ? new Set([...Q.innerType._zod.values, void 0]) : void 0
    }), IG(A._zod, "pattern", () => {
      let B = Q.innerType._zod.pattern;
      return B ? new RegExp(`^(${VRA(B.source)})?$`) : void 0
    }), A._zod.parse = (B, G) => {
      if (Q.innerType._zod.optin === "optional") return Q.innerType._zod.run(B, G);
      if (B.value === void 0) return B;
      return Q.innerType._zod.run(B, G)
    }
  }), at1 = z0("$ZodNullable", (A, Q) => {
    v6.init(A, Q), IG(A._zod, "optin", () => Q.innerType._zod.optin), IG(A._zod, "optout", () => Q.innerType._zod.optout), IG(A._zod, "pattern", () => {
      let B = Q.innerType._zod.pattern;
      return B ? new RegExp(`^(${VRA(B.source)}|null)$`) : void 0
    }), IG(A._zod, "values", () => {
      return Q.innerType._zod.values ? new Set([...Q.innerType._zod.values, null]) : void 0
    }), A._zod.parse = (B, G) => {
      if (B.value === null) return B;
      return Q.innerType._zod.run(B, G)
    }
  }), ot1 = z0("$ZodDefault", (A, Q) => {
    v6.init(A, Q), A._zod.optin = "optional", IG(A._zod, "values", () => Q.innerType._zod.values), A._zod.parse = (B, G) => {
      if (B.value === void 0) return B.value = Q.defaultValue, B;
      let Z = Q.innerType._zod.run(B, G);
      if (Z instanceof Promise) return Z.then((Y) => rEB(Y, Q));
      return rEB(Z, Q)
    }
  });
  rt1 = z0("$ZodPrefault", (A, Q) => {
    v6.init(A, Q), A._zod.optin = "optional", IG(A._zod, "values", () => Q.innerType._zod.values), A._zod.parse = (B, G) => {
      if (B.value === void 0) B.value = Q.defaultValue;
      return Q.innerType._zod.run(B, G)
    }
  }), st1 = z0("$ZodNonOptional", (A, Q) => {
    v6.init(A, Q), IG(A._zod, "values", () => {
      let B = Q.innerType._zod.values;
      return B ? new Set([...B].filter((G) => G !== void 0)) : void 0
    }), A._zod.parse = (B, G) => {
      let Z = Q.innerType._zod.run(B, G);
      if (Z instanceof Promise) return Z.then((Y) => sEB(Y, A));
      return sEB(Z, A)
    }
  });
  tt1 = z0("$ZodSuccess", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B, G) => {
      let Z = Q.innerType._zod.run(B, G);
      if (Z instanceof Promise) return Z.then((Y) => {
        return B.value = Y.issues.length === 0, B
      });
      return B.value = Z.issues.length === 0, B
    }
  }), et1 = z0("$ZodCatch", (A, Q) => {
    v6.init(A, Q), A._zod.optin = "optional", IG(A._zod, "optout", () => Q.innerType._zod.optout), IG(A._zod, "values", () => Q.innerType._zod.values), A._zod.parse = (B, G) => {
      let Z = Q.innerType._zod.run(B, G);
      if (Z instanceof Promise) return Z.then((Y) => {
        if (B.value = Y.value, Y.issues.length) B.value = Q.catchValue({
          ...B,
          error: {
            issues: Y.issues.map((J) => uL(J, G, pW()))
          },
          input: B.value
        }), B.issues = [];
        return B
      });
      if (B.value = Z.value, Z.issues.length) B.value = Q.catchValue({
        ...B,
        error: {
          issues: Z.issues.map((Y) => uL(Y, G, pW()))
        },
        input: B.value
      }), B.issues = [];
      return B
    }
  }), Ae1 = z0("$ZodNaN", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B, G) => {
      if (typeof B.value !== "number" || !Number.isNaN(B.value)) return B.issues.push({
        input: B.value,
        inst: A,
        expected: "nan",
        code: "invalid_type"
      }), B;
      return B
    }
  }), MRA = z0("$ZodPipe", (A, Q) => {
    v6.init(A, Q), IG(A._zod, "values", () => Q.in._zod.values), IG(A._zod, "optin", () => Q.in._zod.optin), IG(A._zod, "optout", () => Q.out._zod.optout), A._zod.parse = (B, G) => {
      let Z = Q.in._zod.run(B, G);
      if (Z instanceof Promise) return Z.then((Y) => tEB(Y, Q, G));
      return tEB(Z, Q, G)
    }
  });
  Qe1 = z0("$ZodReadonly", (A, Q) => {
    v6.init(A, Q), IG(A._zod, "propValues", () => Q.innerType._zod.propValues), IG(A._zod, "values", () => Q.innerType._zod.values), IG(A._zod, "optin", () => Q.innerType._zod.optin), IG(A._zod, "optout", () => Q.innerType._zod.optout), A._zod.parse = (B, G) => {
      let Z = Q.innerType._zod.run(B, G);
      if (Z instanceof Promise) return Z.then(eEB);
      return eEB(Z)
    }
  });
  Be1 = z0("$ZodTemplateLiteral", (A, Q) => {
    v6.init(A, Q);
    let B = [];
    for (let G of Q.parts)
      if (G instanceof v6) {
        if (!G._zod.pattern) throw Error(`Invalid template literal part, no pattern found: ${[...G._zod.traits].shift()}`);
        let Z = G._zod.pattern instanceof RegExp ? G._zod.pattern.source : G._zod.pattern;
        if (!Z) throw Error(`Invalid template literal part: ${G._zod.traits}`);
        let Y = Z.startsWith("^") ? 1 : 0,
          J = Z.endsWith("$") ? Z.length - 1 : Z.length;
        B.push(Z.slice(Y, J))
      } else if (G === null || As1.has(typeof G)) B.push(iu(`${G}`));
    else throw Error(`Invalid template literal part: ${G}`);
    A._zod.pattern = new RegExp(`^${B.join("")}$`), A._zod.parse = (G, Z) => {
      if (typeof G.value !== "string") return G.issues.push({
        input: G.value,
        inst: A,
        expected: "template_literal",
        code: "invalid_type"
      }), G;
      if (A._zod.pattern.lastIndex = 0, !A._zod.pattern.test(G.value)) return G.issues.push({
        input: G.value,
        inst: A,
        code: "invalid_format",
        format: "template_literal",
        pattern: A._zod.pattern.source
      }), G;
      return G
    }
  }), Ge1 = z0("$ZodPromise", (A, Q) => {
    v6.init(A, Q), A._zod.parse = (B, G) => {
      return Promise.resolve(B.value).then((Z) => Q.innerType._zod.run({
        value: Z,
        issues: []
      }, G))
    }
  }), Ze1 = z0("$ZodLazy", (A, Q) => {
    v6.init(A, Q), IG(A._zod, "innerType", () => Q.getter()), IG(A._zod, "pattern", () => A._zod.innerType._zod.pattern), IG(A._zod, "propValues", () => A._zod.innerType._zod.propValues), IG(A._zod, "optin", () => A._zod.innerType._zod.optin), IG(A._zod, "optout", () => A._zod.innerType._zod.optout), A._zod.parse = (B, G) => {
      return A._zod.innerType._zod.run(B, G)
    }
  }), Ye1 = z0("$ZodCustom", (A, Q) => {
    XI.init(A, Q), v6.init(A, Q), A._zod.parse = (B, G) => {
      return B
    }, A._zod.check = (B) => {
      let G = B.value,
        Z = Q.fn(G);
      if (Z instanceof Promise) return Z.then((Y) => AzB(Y, B, G, A));
      AzB(Z, B, G, A);
      return
    }
  })
})
// @from(Ln 152078, Col 0)
function Je1() {
  return {
    localeError: cZ8()
  }
}
// @from(Ln 152083, Col 4)
cZ8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "number";
        case "object": {
          if (Array.isArray(Z)) return "array";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `مدخلات غير مقبولة: يفترض إدخال ${Z.expected}، ولكن تم إدخال ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `مدخلات غير مقبولة: يفترض إدخال ${aB(Z.values[0])}`;
        return `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return ` أكبر من اللازم: يفترض أن تكون ${Z.origin??"القيمة"} ${Y} ${Z.maximum.toString()} ${J.unit??"عنصر"}`;
        return `أكبر من اللازم: يفترض أن تكون ${Z.origin??"القيمة"} ${Y} ${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `أصغر من اللازم: يفترض لـ ${Z.origin} أن يكون ${Y} ${Z.minimum.toString()} ${J.unit}`;
        return `أصغر من اللازم: يفترض لـ ${Z.origin} أن يكون ${Y} ${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `نَص غير مقبول: يجب أن يبدأ بـ "${Z.prefix}"`;
        if (Y.format === "ends_with") return `نَص غير مقبول: يجب أن ينتهي بـ "${Y.suffix}"`;
        if (Y.format === "includes") return `نَص غير مقبول: يجب أن يتضمَّن "${Y.includes}"`;
        if (Y.format === "regex") return `نَص غير مقبول: يجب أن يطابق النمط ${Y.pattern}`;
        return `${G[Y.format]??Z.format} غير مقبول`
      }
      case "not_multiple_of":
        return `رقم غير مقبول: يجب أن يكون من مضاعفات ${Z.divisor}`;
      case "unrecognized_keys":
        return `معرف${Z.keys.length>1?"ات":""} غريب${Z.keys.length>1?"ة":""}: ${FQ(Z.keys,"، ")}`;
      case "invalid_key":
        return `معرف غير مقبول في ${Z.origin}`;
      case "invalid_union":
        return "مدخل غير مقبول";
      case "invalid_element":
        return `مدخل غير مقبول في ${Z.origin}`;
      default:
        return "مدخل غير مقبول"
    }
  }
}
// @from(Ln 152191, Col 4)
ZzB = w(() => {
  W6()
})
// @from(Ln 152195, Col 0)
function Xe1() {
  return {
    localeError: pZ8()
  }
}
// @from(Ln 152200, Col 4)
pZ8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "number";
        case "object": {
          if (Array.isArray(Z)) return "array";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Yanlış dəyər: gözlənilən ${Z.expected}, daxil olan ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Yanlış dəyər: gözlənilən ${aB(Z.values[0])}`;
        return `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Çox böyük: gözlənilən ${Z.origin??"dəyər"} ${Y}${Z.maximum.toString()} ${J.unit??"element"}`;
        return `Çox böyük: gözlənilən ${Z.origin??"dəyər"} ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Çox kiçik: gözlənilən ${Z.origin} ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `Çox kiçik: gözlənilən ${Z.origin} ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Yanlış mətn: "${Y.prefix}" ilə başlamalıdır`;
        if (Y.format === "ends_with") return `Yanlış mətn: "${Y.suffix}" ilə bitməlidir`;
        if (Y.format === "includes") return `Yanlış mətn: "${Y.includes}" daxil olmalıdır`;
        if (Y.format === "regex") return `Yanlış mətn: ${Y.pattern} şablonuna uyğun olmalıdır`;
        return `Yanlış ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Yanlış ədəd: ${Z.divisor} ilə bölünə bilən olmalıdır`;
      case "unrecognized_keys":
        return `Tanınmayan açar${Z.keys.length>1?"lar":""}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `${Z.origin} daxilində yanlış açar`;
      case "invalid_union":
        return "Yanlış dəyər";
      case "invalid_element":
        return `${Z.origin} daxilində yanlış dəyər`;
      default:
        return "Yanlış dəyər"
    }
  }
}
// @from(Ln 152308, Col 4)
YzB = w(() => {
  W6()
})
// @from(Ln 152312, Col 0)
function JzB(A, Q, B, G) {
  let Z = Math.abs(A),
    Y = Z % 10,
    J = Z % 100;
  if (J >= 11 && J <= 19) return G;
  if (Y === 1) return Q;
  if (Y >= 2 && Y <= 4) return B;
  return G
}
// @from(Ln 152322, Col 0)
function Ie1() {
  return {
    localeError: lZ8()
  }
}
// @from(Ln 152327, Col 4)
lZ8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "лік";
        case "object": {
          if (Array.isArray(Z)) return "масіў";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Няправільны ўвод: чакаўся ${Z.expected}, атрымана ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Няправільны ўвод: чакалася ${aB(Z.values[0])}`;
        return `Няправільны варыянт: чакаўся адзін з ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) {
          let X = Number(Z.maximum),
            I = JzB(X, J.unit.one, J.unit.few, J.unit.many);
          return `Занадта вялікі: чакалася, што ${Z.origin??"значэнне"} павінна ${J.verb} ${Y}${Z.maximum.toString()} ${I}`
        }
        return `Занадта вялікі: чакалася, што ${Z.origin??"значэнне"} павінна быць ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) {
          let X = Number(Z.minimum),
            I = JzB(X, J.unit.one, J.unit.few, J.unit.many);
          return `Занадта малы: чакалася, што ${Z.origin} павінна ${J.verb} ${Y}${Z.minimum.toString()} ${I}`
        }
        return `Занадта малы: чакалася, што ${Z.origin} павінна быць ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Няправільны радок: павінен пачынацца з "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Няправільны радок: павінен заканчвацца на "${Y.suffix}"`;
        if (Y.format === "includes") return `Няправільны радок: павінен змяшчаць "${Y.includes}"`;
        if (Y.format === "regex") return `Няправільны радок: павінен адпавядаць шаблону ${Y.pattern}`;
        return `Няправільны ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Няправільны лік: павінен быць кратным ${Z.divisor}`;
      case "unrecognized_keys":
        return `Нераспазнаны ${Z.keys.length>1?"ключы":"ключ"}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Няправільны ключ у ${Z.origin}`;
      case "invalid_union":
        return "Няправільны ўвод";
      case "invalid_element":
        return `Няправільнае значэнне ў ${Z.origin}`;
      default:
        return "Няправільны ўвод"
    }
  }
}
// @from(Ln 152459, Col 4)
XzB = w(() => {
  W6()
})
// @from(Ln 152463, Col 0)
function De1() {
  return {
    localeError: iZ8()
  }
}
// @from(Ln 152468, Col 4)
iZ8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "number";
        case "object": {
          if (Array.isArray(Z)) return "array";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Tipus invàlid: s'esperava ${Z.expected}, s'ha rebut ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Valor invàlid: s'esperava ${aB(Z.values[0])}`;
        return `Opció invàlida: s'esperava una de ${FQ(Z.values," o ")}`;
      case "too_big": {
        let Y = Z.inclusive ? "com a màxim" : "menys de",
          J = Q(Z.origin);
        if (J) return `Massa gran: s'esperava que ${Z.origin??"el valor"} contingués ${Y} ${Z.maximum.toString()} ${J.unit??"elements"}`;
        return `Massa gran: s'esperava que ${Z.origin??"el valor"} fos ${Y} ${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? "com a mínim" : "més de",
          J = Q(Z.origin);
        if (J) return `Massa petit: s'esperava que ${Z.origin} contingués ${Y} ${Z.minimum.toString()} ${J.unit}`;
        return `Massa petit: s'esperava que ${Z.origin} fos ${Y} ${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Format invàlid: ha de començar amb "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Format invàlid: ha d'acabar amb "${Y.suffix}"`;
        if (Y.format === "includes") return `Format invàlid: ha d'incloure "${Y.includes}"`;
        if (Y.format === "regex") return `Format invàlid: ha de coincidir amb el patró ${Y.pattern}`;
        return `Format invàlid per a ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Número invàlid: ha de ser múltiple de ${Z.divisor}`;
      case "unrecognized_keys":
        return `Clau${Z.keys.length>1?"s":""} no reconeguda${Z.keys.length>1?"s":""}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Clau invàlida a ${Z.origin}`;
      case "invalid_union":
        return "Entrada invàlida";
      case "invalid_element":
        return `Element invàlid a ${Z.origin}`;
      default:
        return "Entrada invàlida"
    }
  }
}
// @from(Ln 152576, Col 4)
IzB = w(() => {
  W6()
})
// @from(Ln 152580, Col 0)
function We1() {
  return {
    localeError: nZ8()
  }
}
// @from(Ln 152585, Col 4)
nZ8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "číslo";
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
          if (Array.isArray(Z)) return "pole";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Neplatný vstup: očekáváno ${Z.expected}, obdrženo ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Neplatný vstup: očekáváno ${aB(Z.values[0])}`;
        return `Neplatná možnost: očekávána jedna z hodnot ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Hodnota je příliš velká: ${Z.origin??"hodnota"} musí mít ${Y}${Z.maximum.toString()} ${J.unit??"prvků"}`;
        return `Hodnota je příliš velká: ${Z.origin??"hodnota"} musí být ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Hodnota je příliš malá: ${Z.origin??"hodnota"} musí mít ${Y}${Z.minimum.toString()} ${J.unit??"prvků"}`;
        return `Hodnota je příliš malá: ${Z.origin??"hodnota"} musí být ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Neplatný řetězec: musí začínat na "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Neplatný řetězec: musí končit na "${Y.suffix}"`;
        if (Y.format === "includes") return `Neplatný řetězec: musí obsahovat "${Y.includes}"`;
        if (Y.format === "regex") return `Neplatný řetězec: musí odpovídat vzoru ${Y.pattern}`;
        return `Neplatný formát ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Neplatné číslo: musí být násobkem ${Z.divisor}`;
      case "unrecognized_keys":
        return `Neznámé klíče: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Neplatný klíč v ${Z.origin}`;
      case "invalid_union":
        return "Neplatný vstup";
      case "invalid_element":
        return `Neplatná hodnota v ${Z.origin}`;
      default:
        return "Neplatný vstup"
    }
  }
}
// @from(Ln 152705, Col 4)
DzB = w(() => {
  W6()
})
// @from(Ln 152709, Col 0)
function Ke1() {
  return {
    localeError: aZ8()
  }
}
// @from(Ln 152714, Col 4)
aZ8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "Zahl";
        case "object": {
          if (Array.isArray(Z)) return "Array";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Ungültige Eingabe: erwartet ${Z.expected}, erhalten ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Ungültige Eingabe: erwartet ${aB(Z.values[0])}`;
        return `Ungültige Option: erwartet eine von ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Zu groß: erwartet, dass ${Z.origin??"Wert"} ${Y}${Z.maximum.toString()} ${J.unit??"Elemente"} hat`;
        return `Zu groß: erwartet, dass ${Z.origin??"Wert"} ${Y}${Z.maximum.toString()} ist`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Zu klein: erwartet, dass ${Z.origin} ${Y}${Z.minimum.toString()} ${J.unit} hat`;
        return `Zu klein: erwartet, dass ${Z.origin} ${Y}${Z.minimum.toString()} ist`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Ungültiger String: muss mit "${Y.prefix}" beginnen`;
        if (Y.format === "ends_with") return `Ungültiger String: muss mit "${Y.suffix}" enden`;
        if (Y.format === "includes") return `Ungültiger String: muss "${Y.includes}" enthalten`;
        if (Y.format === "regex") return `Ungültiger String: muss dem Muster ${Y.pattern} entsprechen`;
        return `Ungültig: ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Ungültige Zahl: muss ein Vielfaches von ${Z.divisor} sein`;
      case "unrecognized_keys":
        return `${Z.keys.length>1?"Unbekannte Schlüssel":"Unbekannter Schlüssel"}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Ungültiger Schlüssel in ${Z.origin}`;
      case "invalid_union":
        return "Ungültige Eingabe";
      case "invalid_element":
        return `Ungültiger Wert in ${Z.origin}`;
      default:
        return "Ungültige Eingabe"
    }
  }
}
// @from(Ln 152822, Col 4)
WzB = w(() => {
  W6()
})
// @from(Ln 152826, Col 0)
function _RA() {
  return {
    localeError: rZ8()
  }
}
// @from(Ln 152831, Col 4)
oZ8 = (A) => {
    let Q = typeof A;
    switch (Q) {
      case "number":
        return Number.isNaN(A) ? "NaN" : "number";
      case "object": {
        if (Array.isArray(A)) return "array";
        if (A === null) return "null";
        if (Object.getPrototypeOf(A) !== Object.prototype && A.constructor) return A.constructor.name
      }
    }
    return Q
  }
// @from(Ln 152844, Col 2)
rZ8 = () => {
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

    function Q(G) {
      return A[G] ?? null
    }
    let B = {
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
    return (G) => {
      switch (G.code) {
        case "invalid_type":
          return `Invalid input: expected ${G.expected}, received ${oZ8(G.input)}`;
        case "invalid_value":
          if (G.values.length === 1) return `Invalid input: expected ${aB(G.values[0])}`;
          return `Invalid option: expected one of ${FQ(G.values,"|")}`;
        case "too_big": {
          let Z = G.inclusive ? "<=" : "<",
            Y = Q(G.origin);
          if (Y) return `Too big: expected ${G.origin??"value"} to have ${Z}${G.maximum.toString()} ${Y.unit??"elements"}`;
          return `Too big: expected ${G.origin??"value"} to be ${Z}${G.maximum.toString()}`
        }
        case "too_small": {
          let Z = G.inclusive ? ">=" : ">",
            Y = Q(G.origin);
          if (Y) return `Too small: expected ${G.origin} to have ${Z}${G.minimum.toString()} ${Y.unit}`;
          return `Too small: expected ${G.origin} to be ${Z}${G.minimum.toString()}`
        }
        case "invalid_format": {
          let Z = G;
          if (Z.format === "starts_with") return `Invalid string: must start with "${Z.prefix}"`;
          if (Z.format === "ends_with") return `Invalid string: must end with "${Z.suffix}"`;
          if (Z.format === "includes") return `Invalid string: must include "${Z.includes}"`;
          if (Z.format === "regex") return `Invalid string: must match pattern ${Z.pattern}`;
          return `Invalid ${B[Z.format]??G.format}`
        }
        case "not_multiple_of":
          return `Invalid number: must be a multiple of ${G.divisor}`;
        case "unrecognized_keys":
          return `Unrecognized key${G.keys.length>1?"s":""}: ${FQ(G.keys,", ")}`;
        case "invalid_key":
          return `Invalid key in ${G.origin}`;
        case "invalid_union":
          return "Invalid input";
        case "invalid_element":
          return `Invalid value in ${G.origin}`;
        default:
          return "Invalid input"
      }
    }
  }
// @from(Ln 152939, Col 4)
Ve1 = w(() => {
  W6()
})
// @from(Ln 152943, Col 0)
function Fe1() {
  return {
    localeError: tZ8()
  }
}
// @from(Ln 152948, Col 4)
sZ8 = (A) => {
    let Q = typeof A;
    switch (Q) {
      case "number":
        return Number.isNaN(A) ? "NaN" : "nombro";
      case "object": {
        if (Array.isArray(A)) return "tabelo";
        if (A === null) return "senvalora";
        if (Object.getPrototypeOf(A) !== Object.prototype && A.constructor) return A.constructor.name
      }
    }
    return Q
  }
// @from(Ln 152961, Col 2)
tZ8 = () => {
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

    function Q(G) {
      return A[G] ?? null
    }
    let B = {
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
    return (G) => {
      switch (G.code) {
        case "invalid_type":
          return `Nevalida enigo: atendiĝis ${G.expected}, riceviĝis ${sZ8(G.input)}`;
        case "invalid_value":
          if (G.values.length === 1) return `Nevalida enigo: atendiĝis ${aB(G.values[0])}`;
          return `Nevalida opcio: atendiĝis unu el ${FQ(G.values,"|")}`;
        case "too_big": {
          let Z = G.inclusive ? "<=" : "<",
            Y = Q(G.origin);
          if (Y) return `Tro granda: atendiĝis ke ${G.origin??"valoro"} havu ${Z}${G.maximum.toString()} ${Y.unit??"elementojn"}`;
          return `Tro granda: atendiĝis ke ${G.origin??"valoro"} havu ${Z}${G.maximum.toString()}`
        }
        case "too_small": {
          let Z = G.inclusive ? ">=" : ">",
            Y = Q(G.origin);
          if (Y) return `Tro malgranda: atendiĝis ke ${G.origin} havu ${Z}${G.minimum.toString()} ${Y.unit}`;
          return `Tro malgranda: atendiĝis ke ${G.origin} estu ${Z}${G.minimum.toString()}`
        }
        case "invalid_format": {
          let Z = G;
          if (Z.format === "starts_with") return `Nevalida karaktraro: devas komenciĝi per "${Z.prefix}"`;
          if (Z.format === "ends_with") return `Nevalida karaktraro: devas finiĝi per "${Z.suffix}"`;
          if (Z.format === "includes") return `Nevalida karaktraro: devas inkluzivi "${Z.includes}"`;
          if (Z.format === "regex") return `Nevalida karaktraro: devas kongrui kun la modelo ${Z.pattern}`;
          return `Nevalida ${B[Z.format]??G.format}`
        }
        case "not_multiple_of":
          return `Nevalida nombro: devas esti oblo de ${G.divisor}`;
        case "unrecognized_keys":
          return `Nekonata${G.keys.length>1?"j":""} ŝlosilo${G.keys.length>1?"j":""}: ${FQ(G.keys,", ")}`;
        case "invalid_key":
          return `Nevalida ŝlosilo en ${G.origin}`;
        case "invalid_union":
          return "Nevalida enigo";
        case "invalid_element":
          return `Nevalida valoro en ${G.origin}`;
        default:
          return "Nevalida enigo"
      }
    }
  }
// @from(Ln 153056, Col 4)
KzB = w(() => {
  W6()
})
// @from(Ln 153060, Col 0)
function He1() {
  return {
    localeError: eZ8()
  }
}
// @from(Ln 153065, Col 4)
eZ8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "número";
        case "object": {
          if (Array.isArray(Z)) return "arreglo";
          if (Z === null) return "nulo";
          if (Object.getPrototypeOf(Z) !== Object.prototype) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Entrada inválida: se esperaba ${Z.expected}, recibido ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Entrada inválida: se esperaba ${aB(Z.values[0])}`;
        return `Opción inválida: se esperaba una de ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Demasiado grande: se esperaba que ${Z.origin??"valor"} tuviera ${Y}${Z.maximum.toString()} ${J.unit??"elementos"}`;
        return `Demasiado grande: se esperaba que ${Z.origin??"valor"} fuera ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Demasiado pequeño: se esperaba que ${Z.origin} tuviera ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `Demasiado pequeño: se esperaba que ${Z.origin} fuera ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Cadena inválida: debe comenzar con "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Cadena inválida: debe terminar en "${Y.suffix}"`;
        if (Y.format === "includes") return `Cadena inválida: debe incluir "${Y.includes}"`;
        if (Y.format === "regex") return `Cadena inválida: debe coincidir con el patrón ${Y.pattern}`;
        return `Inválido ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Número inválido: debe ser múltiplo de ${Z.divisor}`;
      case "unrecognized_keys":
        return `Llave${Z.keys.length>1?"s":""} desconocida${Z.keys.length>1?"s":""}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Llave inválida en ${Z.origin}`;
      case "invalid_union":
        return "Entrada inválida";
      case "invalid_element":
        return `Valor inválido en ${Z.origin}`;
      default:
        return "Entrada inválida"
    }
  }
}
// @from(Ln 153173, Col 4)
VzB = w(() => {
  W6()
})
// @from(Ln 153177, Col 0)
function Ee1() {
  return {
    localeError: AY8()
  }
}
// @from(Ln 153182, Col 4)
AY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "عدد";
        case "object": {
          if (Array.isArray(Z)) return "آرایه";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `ورودی نامعتبر: می‌بایست ${Z.expected} می‌بود، ${B(Z.input)} دریافت شد`;
      case "invalid_value":
        if (Z.values.length === 1) return `ورودی نامعتبر: می‌بایست ${aB(Z.values[0])} می‌بود`;
        return `گزینه نامعتبر: می‌بایست یکی از ${FQ(Z.values,"|")} می‌بود`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `خیلی بزرگ: ${Z.origin??"مقدار"} باید ${Y}${Z.maximum.toString()} ${J.unit??"عنصر"} باشد`;
        return `خیلی بزرگ: ${Z.origin??"مقدار"} باید ${Y}${Z.maximum.toString()} باشد`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `خیلی کوچک: ${Z.origin} باید ${Y}${Z.minimum.toString()} ${J.unit} باشد`;
        return `خیلی کوچک: ${Z.origin} باید ${Y}${Z.minimum.toString()} باشد`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `رشته نامعتبر: باید با "${Y.prefix}" شروع شود`;
        if (Y.format === "ends_with") return `رشته نامعتبر: باید با "${Y.suffix}" تمام شود`;
        if (Y.format === "includes") return `رشته نامعتبر: باید شامل "${Y.includes}" باشد`;
        if (Y.format === "regex") return `رشته نامعتبر: باید با الگوی ${Y.pattern} مطابقت داشته باشد`;
        return `${G[Y.format]??Z.format} نامعتبر`
      }
      case "not_multiple_of":
        return `عدد نامعتبر: باید مضرب ${Z.divisor} باشد`;
      case "unrecognized_keys":
        return `کلید${Z.keys.length>1?"های":""} ناشناس: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `کلید ناشناس در ${Z.origin}`;
      case "invalid_union":
        return "ورودی نامعتبر";
      case "invalid_element":
        return `مقدار نامعتبر در ${Z.origin}`;
      default:
        return "ورودی نامعتبر"
    }
  }
}
// @from(Ln 153290, Col 4)
FzB = w(() => {
  W6()
})
// @from(Ln 153294, Col 0)
function ze1() {
  return {
    localeError: QY8()
  }
}
// @from(Ln 153299, Col 4)
QY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "number";
        case "object": {
          if (Array.isArray(Z)) return "array";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Virheellinen tyyppi: odotettiin ${Z.expected}, oli ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Virheellinen syöte: täytyy olla ${aB(Z.values[0])}`;
        return `Virheellinen valinta: täytyy olla yksi seuraavista: ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Liian suuri: ${J.subject} täytyy olla ${Y}${Z.maximum.toString()} ${J.unit}`.trim();
        return `Liian suuri: arvon täytyy olla ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Liian pieni: ${J.subject} täytyy olla ${Y}${Z.minimum.toString()} ${J.unit}`.trim();
        return `Liian pieni: arvon täytyy olla ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Virheellinen syöte: täytyy alkaa "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Virheellinen syöte: täytyy loppua "${Y.suffix}"`;
        if (Y.format === "includes") return `Virheellinen syöte: täytyy sisältää "${Y.includes}"`;
        if (Y.format === "regex") return `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${Y.pattern}`;
        return `Virheellinen ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Virheellinen luku: täytyy olla luvun ${Z.divisor} monikerta`;
      case "unrecognized_keys":
        return `${Z.keys.length>1?"Tuntemattomat avaimet":"Tuntematon avain"}: ${FQ(Z.keys,", ")}`;
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
// @from(Ln 153423, Col 4)
HzB = w(() => {
  W6()
})
// @from(Ln 153427, Col 0)
function $e1() {
  return {
    localeError: BY8()
  }
}
// @from(Ln 153432, Col 4)
BY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "nombre";
        case "object": {
          if (Array.isArray(Z)) return "tableau";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Entrée invalide : ${Z.expected} attendu, ${B(Z.input)} reçu`;
      case "invalid_value":
        if (Z.values.length === 1) return `Entrée invalide : ${aB(Z.values[0])} attendu`;
        return `Option invalide : une valeur parmi ${FQ(Z.values,"|")} attendue`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Trop grand : ${Z.origin??"valeur"} doit ${J.verb} ${Y}${Z.maximum.toString()} ${J.unit??"élément(s)"}`;
        return `Trop grand : ${Z.origin??"valeur"} doit être ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Trop petit : ${Z.origin} doit ${J.verb} ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `Trop petit : ${Z.origin} doit être ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Chaîne invalide : doit commencer par "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Chaîne invalide : doit se terminer par "${Y.suffix}"`;
        if (Y.format === "includes") return `Chaîne invalide : doit inclure "${Y.includes}"`;
        if (Y.format === "regex") return `Chaîne invalide : doit correspondre au modèle ${Y.pattern}`;
        return `${G[Y.format]??Z.format} invalide`
      }
      case "not_multiple_of":
        return `Nombre invalide : doit être un multiple de ${Z.divisor}`;
      case "unrecognized_keys":
        return `Clé${Z.keys.length>1?"s":""} non reconnue${Z.keys.length>1?"s":""} : ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Clé invalide dans ${Z.origin}`;
      case "invalid_union":
        return "Entrée invalide";
      case "invalid_element":
        return `Valeur invalide dans ${Z.origin}`;
      default:
        return "Entrée invalide"
    }
  }
}
// @from(Ln 153540, Col 4)
EzB = w(() => {
  W6()
})
// @from(Ln 153544, Col 0)
function Ce1() {
  return {
    localeError: GY8()
  }
}
// @from(Ln 153549, Col 4)
GY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "number";
        case "object": {
          if (Array.isArray(Z)) return "array";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Entrée invalide : attendu ${Z.expected}, reçu ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Entrée invalide : attendu ${aB(Z.values[0])}`;
        return `Option invalide : attendu l'une des valeurs suivantes ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "≤" : "<",
          J = Q(Z.origin);
        if (J) return `Trop grand : attendu que ${Z.origin??"la valeur"} ait ${Y}${Z.maximum.toString()} ${J.unit}`;
        return `Trop grand : attendu que ${Z.origin??"la valeur"} soit ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? "≥" : ">",
          J = Q(Z.origin);
        if (J) return `Trop petit : attendu que ${Z.origin} ait ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `Trop petit : attendu que ${Z.origin} soit ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Chaîne invalide : doit commencer par "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Chaîne invalide : doit se terminer par "${Y.suffix}"`;
        if (Y.format === "includes") return `Chaîne invalide : doit inclure "${Y.includes}"`;
        if (Y.format === "regex") return `Chaîne invalide : doit correspondre au motif ${Y.pattern}`;
        return `${G[Y.format]??Z.format} invalide`
      }
      case "not_multiple_of":
        return `Nombre invalide : doit être un multiple de ${Z.divisor}`;
      case "unrecognized_keys":
        return `Clé${Z.keys.length>1?"s":""} non reconnue${Z.keys.length>1?"s":""} : ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Clé invalide dans ${Z.origin}`;
      case "invalid_union":
        return "Entrée invalide";
      case "invalid_element":
        return `Valeur invalide dans ${Z.origin}`;
      default:
        return "Entrée invalide"
    }
  }
}
// @from(Ln 153657, Col 4)
zzB = w(() => {
  W6()
})
// @from(Ln 153661, Col 0)
function Ue1() {
  return {
    localeError: ZY8()
  }
}
// @from(Ln 153666, Col 4)
ZY8 = () => {
  let A = {
    string: {
      unit: "אותיות",
      verb: "לכלול"
    },
    file: {
      unit: "בייטים",
      verb: "לכלול"
    },
    array: {
      unit: "פריטים",
      verb: "לכלול"
    },
    set: {
      unit: "פריטים",
      verb: "לכלול"
    }
  };

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "number";
        case "object": {
          if (Array.isArray(Z)) return "array";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
      regex: "קלט",
      email: "כתובת אימייל",
      url: "כתובת רשת",
      emoji: "אימוג'י",
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
      datetime: "תאריך וזמן ISO",
      date: "תאריך ISO",
      time: "זמן ISO",
      duration: "משך זמן ISO",
      ipv4: "כתובת IPv4",
      ipv6: "כתובת IPv6",
      cidrv4: "טווח IPv4",
      cidrv6: "טווח IPv6",
      base64: "מחרוזת בבסיס 64",
      base64url: "מחרוזת בבסיס 64 לכתובות רשת",
      json_string: "מחרוזת JSON",
      e164: "מספר E.164",
      jwt: "JWT",
      template_literal: "קלט"
    };
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `קלט לא תקין: צריך ${Z.expected}, התקבל ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `קלט לא תקין: צריך ${aB(Z.values[0])}`;
        return `קלט לא תקין: צריך אחת מהאפשרויות  ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `גדול מדי: ${Z.origin??"value"} צריך להיות ${Y}${Z.maximum.toString()} ${J.unit??"elements"}`;
        return `גדול מדי: ${Z.origin??"value"} צריך להיות ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `קטן מדי: ${Z.origin} צריך להיות ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `קטן מדי: ${Z.origin} צריך להיות ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `מחרוזת לא תקינה: חייבת להתחיל ב"${Y.prefix}"`;
        if (Y.format === "ends_with") return `מחרוזת לא תקינה: חייבת להסתיים ב "${Y.suffix}"`;
        if (Y.format === "includes") return `מחרוזת לא תקינה: חייבת לכלול "${Y.includes}"`;
        if (Y.format === "regex") return `מחרוזת לא תקינה: חייבת להתאים לתבנית ${Y.pattern}`;
        return `${G[Y.format]??Z.format} לא תקין`
      }
      case "not_multiple_of":
        return `מספר לא תקין: חייב להיות מכפלה של ${Z.divisor}`;
      case "unrecognized_keys":
        return `מפתח${Z.keys.length>1?"ות":""} לא מזוה${Z.keys.length>1?"ים":"ה"}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `מפתח לא תקין ב${Z.origin}`;
      case "invalid_union":
        return "קלט לא תקין";
      case "invalid_element":
        return `ערך לא תקין ב${Z.origin}`;
      default:
        return "קלט לא תקין"
    }
  }
}
// @from(Ln 153774, Col 4)
$zB = w(() => {
  W6()
})
// @from(Ln 153778, Col 0)
function qe1() {
  return {
    localeError: YY8()
  }
}
// @from(Ln 153783, Col 4)
YY8 = () => {
  let A = {
    string: {
      unit: "karakter",
      verb: "legyen"
    },
    file: {
      unit: "byte",
      verb: "legyen"
    },
    array: {
      unit: "elem",
      verb: "legyen"
    },
    set: {
      unit: "elem",
      verb: "legyen"
    }
  };

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "szám";
        case "object": {
          if (Array.isArray(Z)) return "tömb";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
      regex: "bemenet",
      email: "email cím",
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
      datetime: "ISO időbélyeg",
      date: "ISO dátum",
      time: "ISO idő",
      duration: "ISO időintervallum",
      ipv4: "IPv4 cím",
      ipv6: "IPv6 cím",
      cidrv4: "IPv4 tartomány",
      cidrv6: "IPv6 tartomány",
      base64: "base64-kódolt string",
      base64url: "base64url-kódolt string",
      json_string: "JSON string",
      e164: "E.164 szám",
      jwt: "JWT",
      template_literal: "bemenet"
    };
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Érvénytelen bemenet: a várt érték ${Z.expected}, a kapott érték ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Érvénytelen bemenet: a várt érték ${aB(Z.values[0])}`;
        return `Érvénytelen opció: valamelyik érték várt ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Túl nagy: ${Z.origin??"érték"} mérete túl nagy ${Y}${Z.maximum.toString()} ${J.unit??"elem"}`;
        return `Túl nagy: a bemeneti érték ${Z.origin??"érték"} túl nagy: ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Túl kicsi: a bemeneti érték ${Z.origin} mérete túl kicsi ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `Túl kicsi: a bemeneti érték ${Z.origin} túl kicsi ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Érvénytelen string: "${Y.prefix}" értékkel kell kezdődnie`;
        if (Y.format === "ends_with") return `Érvénytelen string: "${Y.suffix}" értékkel kell végződnie`;
        if (Y.format === "includes") return `Érvénytelen string: "${Y.includes}" értéket kell tartalmaznia`;
        if (Y.format === "regex") return `Érvénytelen string: ${Y.pattern} mintának kell megfelelnie`;
        return `Érvénytelen ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Érvénytelen szám: ${Z.divisor} többszörösének kell lennie`;
      case "unrecognized_keys":
        return `Ismeretlen kulcs${Z.keys.length>1?"s":""}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Érvénytelen kulcs ${Z.origin}`;
      case "invalid_union":
        return "Érvénytelen bemenet";
      case "invalid_element":
        return `Érvénytelen érték: ${Z.origin}`;
      default:
        return "Érvénytelen bemenet"
    }
  }
}
// @from(Ln 153891, Col 4)
CzB = w(() => {
  W6()
})
// @from(Ln 153895, Col 0)
function Ne1() {
  return {
    localeError: JY8()
  }
}
// @from(Ln 153900, Col 4)
JY8 = () => {
  let A = {
    string: {
      unit: "karakter",
      verb: "memiliki"
    },
    file: {
      unit: "byte",
      verb: "memiliki"
    },
    array: {
      unit: "item",
      verb: "memiliki"
    },
    set: {
      unit: "item",
      verb: "memiliki"
    }
  };

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "number";
        case "object": {
          if (Array.isArray(Z)) return "array";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
      regex: "input",
      email: "alamat email",
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
      datetime: "tanggal dan waktu format ISO",
      date: "tanggal format ISO",
      time: "jam format ISO",
      duration: "durasi format ISO",
      ipv4: "alamat IPv4",
      ipv6: "alamat IPv6",
      cidrv4: "rentang alamat IPv4",
      cidrv6: "rentang alamat IPv6",
      base64: "string dengan enkode base64",
      base64url: "string dengan enkode base64url",
      json_string: "string JSON",
      e164: "angka E.164",
      jwt: "JWT",
      template_literal: "input"
    };
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Input tidak valid: diharapkan ${Z.expected}, diterima ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Input tidak valid: diharapkan ${aB(Z.values[0])}`;
        return `Pilihan tidak valid: diharapkan salah satu dari ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Terlalu besar: diharapkan ${Z.origin??"value"} memiliki ${Y}${Z.maximum.toString()} ${J.unit??"elemen"}`;
        return `Terlalu besar: diharapkan ${Z.origin??"value"} menjadi ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Terlalu kecil: diharapkan ${Z.origin} memiliki ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `Terlalu kecil: diharapkan ${Z.origin} menjadi ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `String tidak valid: harus dimulai dengan "${Y.prefix}"`;
        if (Y.format === "ends_with") return `String tidak valid: harus berakhir dengan "${Y.suffix}"`;
        if (Y.format === "includes") return `String tidak valid: harus menyertakan "${Y.includes}"`;
        if (Y.format === "regex") return `String tidak valid: harus sesuai pola ${Y.pattern}`;
        return `${G[Y.format]??Z.format} tidak valid`
      }
      case "not_multiple_of":
        return `Angka tidak valid: harus kelipatan dari ${Z.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali ${Z.keys.length>1?"s":""}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Kunci tidak valid di ${Z.origin}`;
      case "invalid_union":
        return "Input tidak valid";
      case "invalid_element":
        return `Nilai tidak valid di ${Z.origin}`;
      default:
        return "Input tidak valid"
    }
  }
}
// @from(Ln 154008, Col 4)
UzB = w(() => {
  W6()
})
// @from(Ln 154012, Col 0)
function we1() {
  return {
    localeError: XY8()
  }
}
// @from(Ln 154017, Col 4)
XY8 = () => {
  let A = {
    string: {
      unit: "caratteri",
      verb: "avere"
    },
    file: {
      unit: "byte",
      verb: "avere"
    },
    array: {
      unit: "elementi",
      verb: "avere"
    },
    set: {
      unit: "elementi",
      verb: "avere"
    }
  };

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "numero";
        case "object": {
          if (Array.isArray(Z)) return "vettore";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
      regex: "input",
      email: "indirizzo email",
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
      datetime: "data e ora ISO",
      date: "data ISO",
      time: "ora ISO",
      duration: "durata ISO",
      ipv4: "indirizzo IPv4",
      ipv6: "indirizzo IPv6",
      cidrv4: "intervallo IPv4",
      cidrv6: "intervallo IPv6",
      base64: "stringa codificata in base64",
      base64url: "URL codificata in base64",
      json_string: "stringa JSON",
      e164: "numero E.164",
      jwt: "JWT",
      template_literal: "input"
    };
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Input non valido: atteso ${Z.expected}, ricevuto ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Input non valido: atteso ${aB(Z.values[0])}`;
        return `Opzione non valida: atteso uno tra ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Troppo grande: ${Z.origin??"valore"} deve avere ${Y}${Z.maximum.toString()} ${J.unit??"elementi"}`;
        return `Troppo grande: ${Z.origin??"valore"} deve essere ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Troppo piccolo: ${Z.origin} deve avere ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `Troppo piccolo: ${Z.origin} deve essere ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Stringa non valida: deve iniziare con "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Stringa non valida: deve terminare con "${Y.suffix}"`;
        if (Y.format === "includes") return `Stringa non valida: deve includere "${Y.includes}"`;
        if (Y.format === "regex") return `Stringa non valida: deve corrispondere al pattern ${Y.pattern}`;
        return `Invalid ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Numero non valido: deve essere un multiplo di ${Z.divisor}`;
      case "unrecognized_keys":
        return `Chiav${Z.keys.length>1?"i":"e"} non riconosciut${Z.keys.length>1?"e":"a"}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Chiave non valida in ${Z.origin}`;
      case "invalid_union":
        return "Input non valido";
      case "invalid_element":
        return `Valore non valido in ${Z.origin}`;
      default:
        return "Input non valido"
    }
  }
}
// @from(Ln 154125, Col 4)
qzB = w(() => {
  W6()
})
// @from(Ln 154129, Col 0)
function Le1() {
  return {
    localeError: IY8()
  }
}
// @from(Ln 154134, Col 4)
IY8 = () => {
  let A = {
    string: {
      unit: "文字",
      verb: "である"
    },
    file: {
      unit: "バイト",
      verb: "である"
    },
    array: {
      unit: "要素",
      verb: "である"
    },
    set: {
      unit: "要素",
      verb: "である"
    }
  };

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "数値";
        case "object": {
          if (Array.isArray(Z)) return "配列";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
      regex: "入力値",
      email: "メールアドレス",
      url: "URL",
      emoji: "絵文字",
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
      datetime: "ISO日時",
      date: "ISO日付",
      time: "ISO時刻",
      duration: "ISO期間",
      ipv4: "IPv4アドレス",
      ipv6: "IPv6アドレス",
      cidrv4: "IPv4範囲",
      cidrv6: "IPv6範囲",
      base64: "base64エンコード文字列",
      base64url: "base64urlエンコード文字列",
      json_string: "JSON文字列",
      e164: "E.164番号",
      jwt: "JWT",
      template_literal: "入力値"
    };
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `無効な入力: ${Z.expected}が期待されましたが、${B(Z.input)}が入力されました`;
      case "invalid_value":
        if (Z.values.length === 1) return `無効な入力: ${aB(Z.values[0])}が期待されました`;
        return `無効な選択: ${FQ(Z.values,"、")}のいずれかである必要があります`;
      case "too_big": {
        let Y = Z.inclusive ? "以下である" : "より小さい",
          J = Q(Z.origin);
        if (J) return `大きすぎる値: ${Z.origin??"値"}は${Z.maximum.toString()}${J.unit??"要素"}${Y}必要があります`;
        return `大きすぎる値: ${Z.origin??"値"}は${Z.maximum.toString()}${Y}必要があります`
      }
      case "too_small": {
        let Y = Z.inclusive ? "以上である" : "より大きい",
          J = Q(Z.origin);
        if (J) return `小さすぎる値: ${Z.origin}は${Z.minimum.toString()}${J.unit}${Y}必要があります`;
        return `小さすぎる値: ${Z.origin}は${Z.minimum.toString()}${Y}必要があります`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `無効な文字列: "${Y.prefix}"で始まる必要があります`;
        if (Y.format === "ends_with") return `無効な文字列: "${Y.suffix}"で終わる必要があります`;
        if (Y.format === "includes") return `無効な文字列: "${Y.includes}"を含む必要があります`;
        if (Y.format === "regex") return `無効な文字列: パターン${Y.pattern}に一致する必要があります`;
        return `無効な${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `無効な数値: ${Z.divisor}の倍数である必要があります`;
      case "unrecognized_keys":
        return `認識されていないキー${Z.keys.length>1?"群":""}: ${FQ(Z.keys,"、")}`;
      case "invalid_key":
        return `${Z.origin}内の無効なキー`;
      case "invalid_union":
        return "無効な入力";
      case "invalid_element":
        return `${Z.origin}内の無効な値`;
      default:
        return "無効な入力"
    }
  }
}
// @from(Ln 154242, Col 4)
NzB = w(() => {
  W6()
})
// @from(Ln 154246, Col 0)
function Oe1() {
  return {
    localeError: DY8()
  }
}