
// @from(Start 2473464, End 2482878)
$$1 = z((cC7, iBQ) => {
  var {
    defineProperty: VhA,
    getOwnPropertyDescriptor: r$4,
    getOwnPropertyNames: o$4
  } = Object, t$4 = Object.prototype.hasOwnProperty, VW = (A, Q) => VhA(A, "name", {
    value: Q,
    configurable: !0
  }), e$4 = (A, Q) => {
    for (var B in Q) VhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Aw4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of o$4(Q))
        if (!t$4.call(A, Z) && Z !== B) VhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = r$4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Qw4 = (A) => Aw4(VhA({}, "__esModule", {
    value: !0
  }), A), mBQ = {};
  e$4(mBQ, {
    AWSSDKSigV4Signer: () => Iw4,
    AwsSdkSigV4ASigner: () => Jw4,
    AwsSdkSigV4Signer: () => U$1,
    NODE_AUTH_SCHEME_PREFERENCE_OPTIONS: () => Ww4,
    NODE_SIGV4A_CONFIG_OPTIONS: () => Fw4,
    getBearerTokenEnvKey: () => dBQ,
    resolveAWSSDKSigV4Config: () => Dw4,
    resolveAwsSdkSigV4AConfig: () => Vw4,
    resolveAwsSdkSigV4Config: () => cBQ,
    validateSigningProperties: () => z$1
  });
  iBQ.exports = Qw4(mBQ);
  var Bw4 = nC(),
    Gw4 = nC(),
    xBQ = VW((A) => Gw4.HttpResponse.isInstance(A) ? A.headers?.date ?? A.headers?.Date : void 0, "getDateHeader"),
    E$1 = VW((A) => new Date(Date.now() + A), "getSkewCorrectedDate"),
    Zw4 = VW((A, Q) => Math.abs(E$1(Q).getTime() - A) >= 300000, "isClockSkewed"),
    vBQ = VW((A, Q) => {
      let B = Date.parse(A);
      if (Zw4(B, Q)) return B - Date.now();
      return Q
    }, "getUpdatedSystemClockOffset"),
    nDA = VW((A, Q) => {
      if (!Q) throw Error(`Property \`${A}\` is not resolved for AWS SDK SigV4Auth`);
      return Q
    }, "throwSigningPropertyError"),
    z$1 = VW(async (A) => {
      let Q = nDA("context", A.context),
        B = nDA("config", A.config),
        G = Q.endpointV2?.properties?.authSchemes?.[0],
        I = await nDA("signer", B.signer)(G),
        Y = A?.signingRegion,
        J = A?.signingRegionSet,
        W = A?.signingName;
      return {
        config: B,
        signer: I,
        signingRegion: Y,
        signingRegionSet: J,
        signingName: W
      }
    }, "validateSigningProperties"),
    U$1 = class {
      static {
        VW(this, "AwsSdkSigV4Signer")
      }
      async sign(A, Q, B) {
        if (!Bw4.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
        let G = await z$1(B),
          {
            config: Z,
            signer: I
          } = G,
          {
            signingRegion: Y,
            signingName: J
          } = G,
          W = B.context;
        if (W?.authSchemes?.length ?? !1) {
          let [V, F] = W.authSchemes;
          if (V?.name === "sigv4a" && F?.name === "sigv4") Y = F?.signingRegion ?? Y, J = F?.signingName ?? J
        }
        return await I.sign(A, {
          signingDate: E$1(Z.systemClockOffset),
          signingRegion: Y,
          signingService: J
        })
      }
      errorHandler(A) {
        return (Q) => {
          let B = Q.ServerTime ?? xBQ(Q.$response);
          if (B) {
            let G = nDA("config", A.config),
              Z = G.systemClockOffset;
            if (G.systemClockOffset = vBQ(B, G.systemClockOffset), G.systemClockOffset !== Z && Q.$metadata) Q.$metadata.clockSkewCorrected = !0
          }
          throw Q
        }
      }
      successHandler(A, Q) {
        let B = xBQ(A);
        if (B) {
          let G = nDA("config", Q.config);
          G.systemClockOffset = vBQ(B, G.systemClockOffset)
        }
      }
    },
    Iw4 = U$1,
    Yw4 = nC(),
    Jw4 = class extends U$1 {
      static {
        VW(this, "AwsSdkSigV4ASigner")
      }
      async sign(A, Q, B) {
        if (!Yw4.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
        let {
          config: G,
          signer: Z,
          signingRegion: I,
          signingRegionSet: Y,
          signingName: J
        } = await z$1(B), X = (await G.sigv4aSigningRegionSet?.() ?? Y ?? [I]).join(",");
        return await Z.sign(A, {
          signingDate: E$1(G.systemClockOffset),
          signingRegion: X,
          signingService: J
        })
      }
    },
    bBQ = VW((A) => typeof A === "string" && A.length > 0 ? A.split(",").map((Q) => Q.trim()) : [], "getArrayForCommaSeparatedString"),
    dBQ = VW((A) => `AWS_BEARER_TOKEN_${A.replace(/[\s-]/g,"_").toUpperCase()}`, "getBearerTokenEnvKey"),
    fBQ = "AWS_AUTH_SCHEME_PREFERENCE",
    hBQ = "auth_scheme_preference",
    Ww4 = {
      environmentVariableSelector: VW((A, Q) => {
        if (Q?.signingName) {
          if (dBQ(Q.signingName) in A) return ["httpBearerAuth"]
        }
        if (!(fBQ in A)) return;
        return bBQ(A[fBQ])
      }, "environmentVariableSelector"),
      configFileSelector: VW((A) => {
        if (!(hBQ in A)) return;
        return bBQ(A[hBQ])
      }, "configFileSelector"),
      default: []
    },
    Xw4 = iB(),
    gBQ = j2(),
    Vw4 = VW((A) => {
      return A.sigv4aSigningRegionSet = (0, Xw4.normalizeProvider)(A.sigv4aSigningRegionSet), A
    }, "resolveAwsSdkSigV4AConfig"),
    Fw4 = {
      environmentVariableSelector(A) {
        if (A.AWS_SIGV4A_SIGNING_REGION_SET) return A.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((Q) => Q.trim());
        throw new gBQ.ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", {
          tryNextLink: !0
        })
      },
      configFileSelector(A) {
        if (A.sigv4a_signing_region_set) return (A.sigv4a_signing_region_set ?? "").split(",").map((Q) => Q.trim());
        throw new gBQ.ProviderError("sigv4a_signing_region_set not set in profile.", {
          tryNextLink: !0
        })
      },
      default: void 0
    },
    Kw4 = QL(),
    vr = iB(),
    uBQ = yBQ(),
    cBQ = VW((A) => {
      let Q = A.credentials,
        B = !!A.credentials,
        G = void 0;
      Object.defineProperty(A, "credentials", {
        set(X) {
          if (X && X !== Q && X !== G) B = !0;
          Q = X;
          let V = pBQ(A, {
              credentials: Q,
              credentialDefaultProvider: A.credentialDefaultProvider
            }),
            F = lBQ(A, V);
          if (B && !F.attributed) G = VW(async (K) => F(K).then((D) => (0, Kw4.setCredentialFeature)(D, "CREDENTIALS_CODE", "e")), "resolvedCredentials"), G.memoized = F.memoized, G.configBound = F.configBound, G.attributed = !0;
          else G = F
        },
        get() {
          return G
        },
        enumerable: !0,
        configurable: !0
      }), A.credentials = Q;
      let {
        signingEscapePath: Z = !0,
        systemClockOffset: I = A.systemClockOffset || 0,
        sha256: Y
      } = A, J;
      if (A.signer) J = (0, vr.normalizeProvider)(A.signer);
      else if (A.regionInfoProvider) J = VW(() => (0, vr.normalizeProvider)(A.region)().then(async (X) => [await A.regionInfoProvider(X, {
        useFipsEndpoint: await A.useFipsEndpoint(),
        useDualstackEndpoint: await A.useDualstackEndpoint()
      }) || {}, X]).then(([X, V]) => {
        let {
          signingRegion: F,
          signingService: K
        } = X;
        A.signingRegion = A.signingRegion || F || V, A.signingName = A.signingName || K || A.serviceId;
        let D = {
          ...A,
          credentials: A.credentials,
          region: A.signingRegion,
          service: A.signingName,
          sha256: Y,
          uriEscapePath: Z
        };
        return new(A.signerConstructor || uBQ.SignatureV4)(D)
      }), "signer");
      else J = VW(async (X) => {
        X = Object.assign({}, {
          name: "sigv4",
          signingName: A.signingName || A.defaultSigningName,
          signingRegion: await (0, vr.normalizeProvider)(A.region)(),
          properties: {}
        }, X);
        let {
          signingRegion: V,
          signingName: F
        } = X;
        A.signingRegion = A.signingRegion || V, A.signingName = A.signingName || F || A.serviceId;
        let K = {
          ...A,
          credentials: A.credentials,
          region: A.signingRegion,
          service: A.signingName,
          sha256: Y,
          uriEscapePath: Z
        };
        return new(A.signerConstructor || uBQ.SignatureV4)(K)
      }, "signer");
      return Object.assign(A, {
        systemClockOffset: I,
        signingEscapePath: Z,
        signer: J
      })
    }, "resolveAwsSdkSigV4Config"),
    Dw4 = cBQ;

  function pBQ(A, {
    credentials: Q,
    credentialDefaultProvider: B
  }) {
    let G;
    if (Q)
      if (!Q?.memoized) G = (0, vr.memoizeIdentityProvider)(Q, vr.isIdentityExpired, vr.doesIdentityRequireRefresh);
      else G = Q;
    else if (B) G = (0, vr.normalizeProvider)(B(Object.assign({}, A, {
      parentClientConfig: A
    })));
    else G = VW(async () => {
      throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.")
    }, "credentialsProvider");
    return G.memoized = !0, G
  }
  VW(pBQ, "normalizeCredentialProvider");

  function lBQ(A, Q) {
    if (Q.configBound) return Q;
    let B = VW(async (G) => Q({
      ...G,
      callerClientConfig: A
    }), "fn");
    return B.memoized = Q.memoized, B.configBound = !0, B
  }
  VW(lBQ, "bindCallerConfig")
})
// @from(Start 2482884, End 2484342)
oK = z((iC7, sBQ) => {
  var {
    defineProperty: FhA,
    getOwnPropertyDescriptor: Hw4,
    getOwnPropertyNames: Cw4
  } = Object, Ew4 = Object.prototype.hasOwnProperty, zw4 = (A, Q) => FhA(A, "name", {
    value: Q,
    configurable: !0
  }), Uw4 = (A, Q) => {
    for (var B in Q) FhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, $w4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Cw4(Q))
        if (!Ew4.call(A, Z) && Z !== B) FhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Hw4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, ww4 = (A) => $w4(FhA({}, "__esModule", {
    value: !0
  }), A), aBQ = {};
  Uw4(aBQ, {
    calculateBodyLength: () => qw4
  });
  sBQ.exports = ww4(aBQ);
  var nBQ = typeof TextEncoder == "function" ? new TextEncoder : null,
    qw4 = zw4((A) => {
      if (typeof A === "string") {
        if (nBQ) return nBQ.encode(A).byteLength;
        let Q = A.length;
        for (let B = Q - 1; B >= 0; B--) {
          let G = A.charCodeAt(B);
          if (G > 127 && G <= 2047) Q++;
          else if (G > 2047 && G <= 65535) Q += 2;
          if (G >= 56320 && G <= 57343) B--
        }
        return Q
      } else if (typeof A.byteLength === "number") return A.byteLength;
      else if (typeof A.size === "number") return A.size;
      throw Error(`Body Length computation failed for ${A}`)
    }, "calculateBodyLength")
})
// @from(Start 2484348, End 2484835)
tBQ = z((rBQ) => {
  Object.defineProperty(rBQ, "__esModule", {
    value: !0
  });
  rBQ.fromBase64 = void 0;
  var Nw4 = hI(),
    Lw4 = /^[A-Za-z0-9+/]*={0,2}$/,
    Mw4 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!Lw4.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, Nw4.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  rBQ.fromBase64 = Mw4
})
// @from(Start 2484841, End 2485420)
Q2Q = z((eBQ) => {
  Object.defineProperty(eBQ, "__esModule", {
    value: !0
  });
  eBQ.toBase64 = void 0;
  var Ow4 = hI(),
    Rw4 = O2(),
    Tw4 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, Rw4.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, Ow4.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  eBQ.toBase64 = Tw4
})
// @from(Start 2485426, End 2486121)
Fd = z((sC7, KhA) => {
  var {
    defineProperty: B2Q,
    getOwnPropertyDescriptor: Pw4,
    getOwnPropertyNames: jw4
  } = Object, Sw4 = Object.prototype.hasOwnProperty, w$1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of jw4(Q))
        if (!Sw4.call(A, Z) && Z !== B) B2Q(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Pw4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, G2Q = (A, Q, B) => (w$1(A, Q, "default"), B && w$1(B, Q, "default")), _w4 = (A) => w$1(B2Q({}, "__esModule", {
    value: !0
  }), A), q$1 = {};
  KhA.exports = _w4(q$1);
  G2Q(q$1, tBQ(), KhA.exports);
  G2Q(q$1, Q2Q(), KhA.exports)
})
// @from(Start 2486127, End 2493923)
uR = z((rC7, J2Q) => {
  var {
    defineProperty: DhA,
    getOwnPropertyDescriptor: kw4,
    getOwnPropertyNames: yw4
  } = Object, xw4 = Object.prototype.hasOwnProperty, BL = (A, Q) => DhA(A, "name", {
    value: Q,
    configurable: !0
  }), vw4 = (A, Q) => {
    for (var B in Q) DhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, bw4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of yw4(Q))
        if (!xw4.call(A, Z) && Z !== B) DhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = kw4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, fw4 = (A) => bw4(DhA({}, "__esModule", {
    value: !0
  }), A), Y2Q = {};
  vw4(Y2Q, {
    constructStack: () => N$1
  });
  J2Q.exports = fw4(Y2Q);
  var br = BL((A, Q) => {
      let B = [];
      if (A) B.push(A);
      if (Q)
        for (let G of Q) B.push(G);
      return B
    }, "getAllAliases"),
    Kd = BL((A, Q) => {
      return `${A||"anonymous"}${Q&&Q.length>0?` (a.k.a. ${Q.join(",")})`:""}`
    }, "getMiddlewareNameWithAliases"),
    N$1 = BL(() => {
      let A = [],
        Q = [],
        B = !1,
        G = new Set,
        Z = BL((F) => F.sort((K, D) => Z2Q[D.step] - Z2Q[K.step] || I2Q[D.priority || "normal"] - I2Q[K.priority || "normal"]), "sort"),
        I = BL((F) => {
          let K = !1,
            D = BL((H) => {
              let C = br(H.name, H.aliases);
              if (C.includes(F)) {
                K = !0;
                for (let E of C) G.delete(E);
                return !1
              }
              return !0
            }, "filterCb");
          return A = A.filter(D), Q = Q.filter(D), K
        }, "removeByName"),
        Y = BL((F) => {
          let K = !1,
            D = BL((H) => {
              if (H.middleware === F) {
                K = !0;
                for (let C of br(H.name, H.aliases)) G.delete(C);
                return !1
              }
              return !0
            }, "filterCb");
          return A = A.filter(D), Q = Q.filter(D), K
        }, "removeByReference"),
        J = BL((F) => {
          return A.forEach((K) => {
            F.add(K.middleware, {
              ...K
            })
          }), Q.forEach((K) => {
            F.addRelativeTo(K.middleware, {
              ...K
            })
          }), F.identifyOnResolve?.(V.identifyOnResolve()), F
        }, "cloneTo"),
        W = BL((F) => {
          let K = [];
          return F.before.forEach((D) => {
            if (D.before.length === 0 && D.after.length === 0) K.push(D);
            else K.push(...W(D))
          }), K.push(F), F.after.reverse().forEach((D) => {
            if (D.before.length === 0 && D.after.length === 0) K.push(D);
            else K.push(...W(D))
          }), K
        }, "expandRelativeMiddlewareList"),
        X = BL((F = !1) => {
          let K = [],
            D = [],
            H = {};
          return A.forEach((E) => {
            let U = {
              ...E,
              before: [],
              after: []
            };
            for (let q of br(U.name, U.aliases)) H[q] = U;
            K.push(U)
          }), Q.forEach((E) => {
            let U = {
              ...E,
              before: [],
              after: []
            };
            for (let q of br(U.name, U.aliases)) H[q] = U;
            D.push(U)
          }), D.forEach((E) => {
            if (E.toMiddleware) {
              let U = H[E.toMiddleware];
              if (U === void 0) {
                if (F) return;
                throw Error(`${E.toMiddleware} is not found when adding ${Kd(E.name,E.aliases)} middleware ${E.relation} ${E.toMiddleware}`)
              }
              if (E.relation === "after") U.after.push(E);
              if (E.relation === "before") U.before.push(E)
            }
          }), Z(K).map(W).reduce((E, U) => {
            return E.push(...U), E
          }, [])
        }, "getMiddlewareList"),
        V = {
          add: (F, K = {}) => {
            let {
              name: D,
              override: H,
              aliases: C
            } = K, E = {
              step: "initialize",
              priority: "normal",
              middleware: F,
              ...K
            }, U = br(D, C);
            if (U.length > 0) {
              if (U.some((q) => G.has(q))) {
                if (!H) throw Error(`Duplicate middleware name '${Kd(D,C)}'`);
                for (let q of U) {
                  let w = A.findIndex((R) => R.name === q || R.aliases?.some((T) => T === q));
                  if (w === -1) continue;
                  let N = A[w];
                  if (N.step !== E.step || E.priority !== N.priority) throw Error(`"${Kd(N.name,N.aliases)}" middleware with ${N.priority} priority in ${N.step} step cannot be overridden by "${Kd(D,C)}" middleware with ${E.priority} priority in ${E.step} step.`);
                  A.splice(w, 1)
                }
              }
              for (let q of U) G.add(q)
            }
            A.push(E)
          },
          addRelativeTo: (F, K) => {
            let {
              name: D,
              override: H,
              aliases: C
            } = K, E = {
              middleware: F,
              ...K
            }, U = br(D, C);
            if (U.length > 0) {
              if (U.some((q) => G.has(q))) {
                if (!H) throw Error(`Duplicate middleware name '${Kd(D,C)}'`);
                for (let q of U) {
                  let w = Q.findIndex((R) => R.name === q || R.aliases?.some((T) => T === q));
                  if (w === -1) continue;
                  let N = Q[w];
                  if (N.toMiddleware !== E.toMiddleware || N.relation !== E.relation) throw Error(`"${Kd(N.name,N.aliases)}" middleware ${N.relation} "${N.toMiddleware}" middleware cannot be overridden by "${Kd(D,C)}" middleware ${E.relation} "${E.toMiddleware}" middleware.`);
                  Q.splice(w, 1)
                }
              }
              for (let q of U) G.add(q)
            }
            Q.push(E)
          },
          clone: () => J(N$1()),
          use: (F) => {
            F.applyToStack(V)
          },
          remove: (F) => {
            if (typeof F === "string") return I(F);
            else return Y(F)
          },
          removeByTag: (F) => {
            let K = !1,
              D = BL((H) => {
                let {
                  tags: C,
                  name: E,
                  aliases: U
                } = H;
                if (C && C.includes(F)) {
                  let q = br(E, U);
                  for (let w of q) G.delete(w);
                  return K = !0, !1
                }
                return !0
              }, "filterCb");
            return A = A.filter(D), Q = Q.filter(D), K
          },
          concat: (F) => {
            let K = J(N$1());
            return K.use(F), K.identifyOnResolve(B || K.identifyOnResolve() || (F.identifyOnResolve?.() ?? !1)), K
          },
          applyToStack: J,
          identify: () => {
            return X(!0).map((F) => {
              let K = F.step ?? F.relation + " " + F.toMiddleware;
              return Kd(F.name, F.aliases) + " - " + K
            })
          },
          identifyOnResolve(F) {
            if (typeof F === "boolean") B = F;
            return B
          },
          resolve: (F, K) => {
            for (let D of X().map((H) => H.middleware).reverse()) F = D(F, K);
            if (B) console.log(V.identify());
            return F
          }
        };
      return V
    }, "constructStack"),
    Z2Q = {
      initialize: 5,
      serialize: 4,
      build: 3,
      finalizeRequest: 2,
      deserialize: 1
    },
    I2Q = {
      high: 3,
      normal: 2,
      low: 1
    }
})
// @from(Start 2493929, End 2507953)
K6 = z((oC7, j$1) => {
  var {
    defineProperty: HhA,
    getOwnPropertyDescriptor: hw4,
    getOwnPropertyNames: gw4
  } = Object, uw4 = Object.prototype.hasOwnProperty, R3 = (A, Q) => HhA(A, "name", {
    value: Q,
    configurable: !0
  }), mw4 = (A, Q) => {
    for (var B in Q) HhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, M$1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of gw4(Q))
        if (!uw4.call(A, Z) && Z !== B) HhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = hw4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, dw4 = (A, Q, B) => (M$1(A, Q, "default"), B && M$1(B, Q, "default")), cw4 = (A) => M$1(HhA({}, "__esModule", {
    value: !0
  }), A), T$1 = {};
  mw4(T$1, {
    Client: () => pw4,
    Command: () => V2Q,
    NoOpLogger: () => Jq4,
    SENSITIVE_STRING: () => iw4,
    ServiceException: () => aw4,
    _json: () => R$1,
    collectBody: () => L$1.collectBody,
    convertMap: () => Wq4,
    createAggregatedClient: () => nw4,
    decorateServiceException: () => F2Q,
    emitWarningIfUnsupportedVersion: () => tw4,
    extendedEncodeURIComponent: () => L$1.extendedEncodeURIComponent,
    getArrayIfSingleItem: () => Iq4,
    getDefaultClientConfiguration: () => Gq4,
    getDefaultExtensionConfiguration: () => D2Q,
    getValueFromTextNode: () => H2Q,
    isSerializableHeaderValue: () => Yq4,
    loadConfigsForDefaultMode: () => ow4,
    map: () => P$1,
    resolveDefaultRuntimeConfig: () => Zq4,
    resolvedPath: () => L$1.resolvedPath,
    serializeDateTime: () => Hq4,
    serializeFloat: () => Dq4,
    take: () => Xq4,
    throwDefaultError: () => K2Q,
    withBaseException: () => sw4
  });
  j$1.exports = cw4(T$1);
  var X2Q = uR(),
    pw4 = class {
      constructor(A) {
        this.config = A, this.middlewareStack = (0, X2Q.constructStack)()
      }
      static {
        R3(this, "Client")
      }
      send(A, Q, B) {
        let G = typeof Q !== "function" ? Q : void 0,
          Z = typeof Q === "function" ? Q : B,
          I = G === void 0 && this.config.cacheMiddleware === !0,
          Y;
        if (I) {
          if (!this.handlers) this.handlers = new WeakMap;
          let J = this.handlers;
          if (J.has(A.constructor)) Y = J.get(A.constructor);
          else Y = A.resolveMiddleware(this.middlewareStack, this.config, G), J.set(A.constructor, Y)
        } else delete this.handlers, Y = A.resolveMiddleware(this.middlewareStack, this.config, G);
        if (Z) Y(A).then((J) => Z(null, J.output), (J) => Z(J)).catch(() => {});
        else return Y(A).then((J) => J.output)
      }
      destroy() {
        this.config?.requestHandler?.destroy?.(), delete this.handlers
      }
    },
    L$1 = w5(),
    O$1 = IU1(),
    V2Q = class {
      constructor() {
        this.middlewareStack = (0, X2Q.constructStack)()
      }
      static {
        R3(this, "Command")
      }
      static classBuilder() {
        return new lw4
      }
      resolveMiddlewareWithContext(A, Q, B, {
        middlewareFn: G,
        clientName: Z,
        commandName: I,
        inputFilterSensitiveLog: Y,
        outputFilterSensitiveLog: J,
        smithyContext: W,
        additionalContext: X,
        CommandCtor: V
      }) {
        for (let C of G.bind(this)(V, A, Q, B)) this.middlewareStack.use(C);
        let F = A.concat(this.middlewareStack),
          {
            logger: K
          } = Q,
          D = {
            logger: K,
            clientName: Z,
            commandName: I,
            inputFilterSensitiveLog: Y,
            outputFilterSensitiveLog: J,
            [O$1.SMITHY_CONTEXT_KEY]: {
              commandInstance: this,
              ...W
            },
            ...X
          },
          {
            requestHandler: H
          } = Q;
        return F.resolve((C) => H.handle(C.request, B || {}), D)
      }
    },
    lw4 = class {
      constructor() {
        this._init = () => {}, this._ep = {}, this._middlewareFn = () => [], this._commandName = "", this._clientName = "", this._additionalContext = {}, this._smithyContext = {}, this._inputFilterSensitiveLog = (A) => A, this._outputFilterSensitiveLog = (A) => A, this._serializer = null, this._deserializer = null
      }
      static {
        R3(this, "ClassBuilder")
      }
      init(A) {
        this._init = A
      }
      ep(A) {
        return this._ep = A, this
      }
      m(A) {
        return this._middlewareFn = A, this
      }
      s(A, Q, B = {}) {
        return this._smithyContext = {
          service: A,
          operation: Q,
          ...B
        }, this
      }
      c(A = {}) {
        return this._additionalContext = A, this
      }
      n(A, Q) {
        return this._clientName = A, this._commandName = Q, this
      }
      f(A = (B) => B, Q = (B) => B) {
        return this._inputFilterSensitiveLog = A, this._outputFilterSensitiveLog = Q, this
      }
      ser(A) {
        return this._serializer = A, this
      }
      de(A) {
        return this._deserializer = A, this
      }
      sc(A) {
        return this._operationSchema = A, this._smithyContext.operationSchema = A, this
      }
      build() {
        let A = this,
          Q;
        return Q = class extends V2Q {
          constructor(...[B]) {
            super();
            this.serialize = A._serializer, this.deserialize = A._deserializer, this.input = B ?? {}, A._init(this), this.schema = A._operationSchema
          }
          static {
            R3(this, "CommandRef")
          }
          static getEndpointParameterInstructions() {
            return A._ep
          }
          resolveMiddleware(B, G, Z) {
            return this.resolveMiddlewareWithContext(B, G, Z, {
              CommandCtor: Q,
              middlewareFn: A._middlewareFn,
              clientName: A._clientName,
              commandName: A._commandName,
              inputFilterSensitiveLog: A._inputFilterSensitiveLog,
              outputFilterSensitiveLog: A._outputFilterSensitiveLog,
              smithyContext: A._smithyContext,
              additionalContext: A._additionalContext
            })
          }
        }
      }
    },
    iw4 = "***SensitiveInformation***",
    nw4 = R3((A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = R3(async function(Y, J, W) {
            let X = new G(Y);
            if (typeof J === "function") this.send(X, J);
            else if (typeof W === "function") {
              if (typeof J !== "object") throw Error(`Expected http options but got ${typeof J}`);
              this.send(X, J || {}, W)
            } else return this.send(X, J)
          }, "methodImpl"),
          I = (B[0].toLowerCase() + B.slice(1)).replace(/Command$/, "");
        Q.prototype[I] = Z
      }
    }, "createAggregatedClient"),
    aw4 = class A extends Error {
      static {
        R3(this, "ServiceException")
      }
      constructor(Q) {
        super(Q.message);
        Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = Q.name, this.$fault = Q.$fault, this.$metadata = Q.$metadata
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return A.prototype.isPrototypeOf(B) || Boolean(B.$fault) && Boolean(B.$metadata) && (B.$fault === "client" || B.$fault === "server")
      }
      static[Symbol.hasInstance](Q) {
        if (!Q) return !1;
        let B = Q;
        if (this === A) return A.isInstance(Q);
        if (A.isInstance(Q)) {
          if (B.name && this.name) return this.prototype.isPrototypeOf(Q) || B.name === this.name;
          return this.prototype.isPrototypeOf(Q)
        }
        return !1
      }
    },
    F2Q = R3((A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    }, "decorateServiceException"),
    K2Q = R3(({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = rw4(A),
        I = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        Y = new B({
          name: Q?.code || Q?.Code || G || I || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw F2Q(Y, Q)
    }, "throwDefaultError"),
    sw4 = R3((A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        K2Q({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    }, "withBaseException"),
    rw4 = R3((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    ow4 = R3((A) => {
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
    W2Q = !1,
    tw4 = R3((A) => {
      if (A && !W2Q && parseInt(A.substring(1, A.indexOf("."))) < 16) W2Q = !0
    }, "emitWarningIfUnsupportedVersion"),
    ew4 = R3((A) => {
      let Q = [];
      for (let B in O$1.AlgorithmId) {
        let G = O$1.AlgorithmId[B];
        if (A[G] === void 0) continue;
        Q.push({
          algorithmId: () => G,
          checksumConstructor: () => A[G]
        })
      }
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    }, "getChecksumConfiguration"),
    Aq4 = R3((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    Qq4 = R3((A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    }, "getRetryConfiguration"),
    Bq4 = R3((A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    }, "resolveRetryRuntimeConfig"),
    D2Q = R3((A) => {
      return Object.assign(ew4(A), Qq4(A))
    }, "getDefaultExtensionConfiguration"),
    Gq4 = D2Q,
    Zq4 = R3((A) => {
      return Object.assign(Aq4(A), Bq4(A))
    }, "resolveDefaultRuntimeConfig"),
    Iq4 = R3((A) => Array.isArray(A) ? A : [A], "getArrayIfSingleItem"),
    H2Q = R3((A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = H2Q(A[B]);
      return A
    }, "getValueFromTextNode"),
    Yq4 = R3((A) => {
      return A != null
    }, "isSerializableHeaderValue"),
    Jq4 = class {
      static {
        R3(this, "NoOpLogger")
      }
      trace() {}
      debug() {}
      info() {}
      warn() {}
      error() {}
    };

  function P$1(A, Q, B) {
    let G, Z, I;
    if (typeof Q > "u" && typeof B > "u") G = {}, I = A;
    else if (G = A, typeof Q === "function") return Z = Q, I = B, Vq4(G, Z, I);
    else I = Q;
    for (let Y of Object.keys(I)) {
      if (!Array.isArray(I[Y])) {
        G[Y] = I[Y];
        continue
      }
      C2Q(G, null, I, Y)
    }
    return G
  }
  R3(P$1, "map");
  var Wq4 = R3((A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    }, "convertMap"),
    Xq4 = R3((A, Q) => {
      let B = {};
      for (let G in Q) C2Q(B, A, Q, G);
      return B
    }, "take"),
    Vq4 = R3((A, Q, B) => {
      return P$1(A, Object.entries(B).reduce((G, [Z, I]) => {
        if (Array.isArray(I)) G[Z] = I;
        else if (typeof I === "function") G[Z] = [Q, I()];
        else G[Z] = [Q, I];
        return G
      }, {}))
    }, "mapWithFilter"),
    C2Q = R3((A, Q, B, G) => {
      if (Q !== null) {
        let Y = B[G];
        if (typeof Y === "function") Y = [, Y];
        let [J = Fq4, W = Kq4, X = G] = Y;
        if (typeof J === "function" && J(Q[X]) || typeof J !== "function" && !!J) A[G] = W(Q[X]);
        return
      }
      let [Z, I] = B[G];
      if (typeof I === "function") {
        let Y, J = Z === void 0 && (Y = I()) != null,
          W = typeof Z === "function" && !!Z(void 0) || typeof Z !== "function" && !!Z;
        if (J) A[G] = Y;
        else if (W) A[G] = I()
      } else {
        let Y = Z === void 0 && I != null,
          J = typeof Z === "function" && !!Z(I) || typeof Z !== "function" && !!Z;
        if (Y || J) A[G] = I
      }
    }, "applyInstruction"),
    Fq4 = R3((A) => A != null, "nonNullish"),
    Kq4 = R3((A) => A, "pass"),
    Dq4 = R3((A) => {
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
    Hq4 = R3((A) => A.toISOString().replace(".000Z", "Z"), "serializeDateTime"),
    R$1 = R3((A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(R$1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = R$1(A[B])
        }
        return Q
      }
      return A
    }, "_json");
  dw4(T$1, s6(), j$1.exports)
})
// @from(Start 2507959, End 2509377)
ChA = z(($q4) => {
  var Cq4 = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040",
    E2Q = "[:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][" + Cq4 + "]*",
    Eq4 = new RegExp("^" + E2Q + "$"),
    zq4 = function(A, Q) {
      let B = [],
        G = Q.exec(A);
      while (G) {
        let Z = [];
        Z.startIndex = Q.lastIndex - G[0].length;
        let I = G.length;
        for (let Y = 0; Y < I; Y++) Z.push(G[Y]);
        B.push(Z), G = Q.exec(A)
      }
      return B
    },
    Uq4 = function(A) {
      let Q = Eq4.exec(A);
      return !(Q === null || typeof Q > "u")
    };
  $q4.isExist = function(A) {
    return typeof A < "u"
  };
  $q4.isEmptyObject = function(A) {
    return Object.keys(A).length === 0
  };
  $q4.merge = function(A, Q, B) {
    if (Q) {
      let G = Object.keys(Q),
        Z = G.length;
      for (let I = 0; I < Z; I++)
        if (B === "strict") A[G[I]] = [Q[G[I]]];
        else A[G[I]] = Q[G[I]]
    }
  };
  $q4.getValue = function(A) {
    if ($q4.isExist(A)) return A;
    else return ""
  };
  $q4.isName = Uq4;
  $q4.getAllMatches = zq4;
  $q4.nameRegexp = E2Q
})
// @from(Start 2509383, End 2516865)
_$1 = z((vq4) => {
  var S$1 = ChA(),
    Rq4 = {
      allowBooleanAttributes: !1,
      unpairedTags: []
    };
  vq4.validate = function(A, Q) {
    Q = Object.assign({}, Rq4, Q);
    let B = [],
      G = !1,
      Z = !1;
    if (A[0] === "\uFEFF") A = A.substr(1);
    for (let I = 0; I < A.length; I++)
      if (A[I] === "<" && A[I + 1] === "?") {
        if (I += 2, I = $2Q(A, I), I.err) return I
      } else if (A[I] === "<") {
      let Y = I;
      if (I++, A[I] === "!") {
        I = w2Q(A, I);
        continue
      } else {
        let J = !1;
        if (A[I] === "/") J = !0, I++;
        let W = "";
        for (; I < A.length && A[I] !== ">" && A[I] !== " " && A[I] !== "\t" && A[I] !== `
` && A[I] !== "\r"; I++) W += A[I];
        if (W = W.trim(), W[W.length - 1] === "/") W = W.substring(0, W.length - 1), I--;
        if (!xq4(W)) {
          let F;
          if (W.trim().length === 0) F = "Invalid space after '<'.";
          else F = "Tag '" + W + "' is an invalid name.";
          return FW("InvalidTag", F, aC(A, I))
        }
        let X = jq4(A, I);
        if (X === !1) return FW("InvalidAttr", "Attributes for '" + W + "' have open quote.", aC(A, I));
        let V = X.value;
        if (I = X.index, V[V.length - 1] === "/") {
          let F = I - V.length;
          V = V.substring(0, V.length - 1);
          let K = q2Q(V, Q);
          if (K === !0) G = !0;
          else return FW(K.err.code, K.err.msg, aC(A, F + K.err.line))
        } else if (J)
          if (!X.tagClosed) return FW("InvalidTag", "Closing tag '" + W + "' doesn't have proper closing.", aC(A, I));
          else if (V.trim().length > 0) return FW("InvalidTag", "Closing tag '" + W + "' can't have attributes or invalid starting.", aC(A, Y));
        else if (B.length === 0) return FW("InvalidTag", "Closing tag '" + W + "' has not been opened.", aC(A, Y));
        else {
          let F = B.pop();
          if (W !== F.tagName) {
            let K = aC(A, F.tagStartPos);
            return FW("InvalidTag", "Expected closing tag '" + F.tagName + "' (opened in line " + K.line + ", col " + K.col + ") instead of closing tag '" + W + "'.", aC(A, Y))
          }
          if (B.length == 0) Z = !0
        } else {
          let F = q2Q(V, Q);
          if (F !== !0) return FW(F.err.code, F.err.msg, aC(A, I - V.length + F.err.line));
          if (Z === !0) return FW("InvalidXml", "Multiple possible root nodes found.", aC(A, I));
          else if (Q.unpairedTags.indexOf(W) !== -1);
          else B.push({
            tagName: W,
            tagStartPos: Y
          });
          G = !0
        }
        for (I++; I < A.length; I++)
          if (A[I] === "<")
            if (A[I + 1] === "!") {
              I++, I = w2Q(A, I);
              continue
            } else if (A[I + 1] === "?") {
          if (I = $2Q(A, ++I), I.err) return I
        } else break;
        else if (A[I] === "&") {
          let F = kq4(A, I);
          if (F == -1) return FW("InvalidChar", "char '&' is not expected.", aC(A, I));
          I = F
        } else if (Z === !0 && !U2Q(A[I])) return FW("InvalidXml", "Extra text at the end", aC(A, I));
        if (A[I] === "<") I--
      }
    } else {
      if (U2Q(A[I])) continue;
      return FW("InvalidChar", "char '" + A[I] + "' is not expected.", aC(A, I))
    }
    if (!G) return FW("InvalidXml", "Start tag expected.", 1);
    else if (B.length == 1) return FW("InvalidTag", "Unclosed tag '" + B[0].tagName + "'.", aC(A, B[0].tagStartPos));
    else if (B.length > 0) return FW("InvalidXml", "Invalid '" + JSON.stringify(B.map((I) => I.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", {
      line: 1,
      col: 1
    });
    return !0
  };

  function U2Q(A) {
    return A === " " || A === "\t" || A === `
` || A === "\r"
  }

  function $2Q(A, Q) {
    let B = Q;
    for (; Q < A.length; Q++)
      if (A[Q] == "?" || A[Q] == " ") {
        let G = A.substr(B, Q - B);
        if (Q > 5 && G === "xml") return FW("InvalidXml", "XML declaration allowed only at the start of the document.", aC(A, Q));
        else if (A[Q] == "?" && A[Q + 1] == ">") {
          Q++;
          break
        } else continue
      } return Q
  }

  function w2Q(A, Q) {
    if (A.length > Q + 5 && A[Q + 1] === "-" && A[Q + 2] === "-") {
      for (Q += 3; Q < A.length; Q++)
        if (A[Q] === "-" && A[Q + 1] === "-" && A[Q + 2] === ">") {
          Q += 2;
          break
        }
    } else if (A.length > Q + 8 && A[Q + 1] === "D" && A[Q + 2] === "O" && A[Q + 3] === "C" && A[Q + 4] === "T" && A[Q + 5] === "Y" && A[Q + 6] === "P" && A[Q + 7] === "E") {
      let B = 1;
      for (Q += 8; Q < A.length; Q++)
        if (A[Q] === "<") B++;
        else if (A[Q] === ">") {
        if (B--, B === 0) break
      }
    } else if (A.length > Q + 9 && A[Q + 1] === "[" && A[Q + 2] === "C" && A[Q + 3] === "D" && A[Q + 4] === "A" && A[Q + 5] === "T" && A[Q + 6] === "A" && A[Q + 7] === "[") {
      for (Q += 8; Q < A.length; Q++)
        if (A[Q] === "]" && A[Q + 1] === "]" && A[Q + 2] === ">") {
          Q += 2;
          break
        }
    }
    return Q
  }
  var Tq4 = '"',
    Pq4 = "'";

  function jq4(A, Q) {
    let B = "",
      G = "",
      Z = !1;
    for (; Q < A.length; Q++) {
      if (A[Q] === Tq4 || A[Q] === Pq4)
        if (G === "") G = A[Q];
        else if (G !== A[Q]);
      else G = "";
      else if (A[Q] === ">") {
        if (G === "") {
          Z = !0;
          break
        }
      }
      B += A[Q]
    }
    if (G !== "") return !1;
    return {
      value: B,
      index: Q,
      tagClosed: Z
    }
  }
  var Sq4 = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");

  function q2Q(A, Q) {
    let B = S$1.getAllMatches(A, Sq4),
      G = {};
    for (let Z = 0; Z < B.length; Z++) {
      if (B[Z][1].length === 0) return FW("InvalidAttr", "Attribute '" + B[Z][2] + "' has no space in starting.", aDA(B[Z]));
      else if (B[Z][3] !== void 0 && B[Z][4] === void 0) return FW("InvalidAttr", "Attribute '" + B[Z][2] + "' is without value.", aDA(B[Z]));
      else if (B[Z][3] === void 0 && !Q.allowBooleanAttributes) return FW("InvalidAttr", "boolean attribute '" + B[Z][2] + "' is not allowed.", aDA(B[Z]));
      let I = B[Z][2];
      if (!yq4(I)) return FW("InvalidAttr", "Attribute '" + I + "' is an invalid name.", aDA(B[Z]));
      if (!G.hasOwnProperty(I)) G[I] = 1;
      else return FW("InvalidAttr", "Attribute '" + I + "' is repeated.", aDA(B[Z]))
    }
    return !0
  }

  function _q4(A, Q) {
    let B = /\d/;
    if (A[Q] === "x") Q++, B = /[\da-fA-F]/;
    for (; Q < A.length; Q++) {
      if (A[Q] === ";") return Q;
      if (!A[Q].match(B)) break
    }
    return -1
  }

  function kq4(A, Q) {
    if (Q++, A[Q] === ";") return -1;
    if (A[Q] === "#") return Q++, _q4(A, Q);
    let B = 0;
    for (; Q < A.length; Q++, B++) {
      if (A[Q].match(/\w/) && B < 20) continue;
      if (A[Q] === ";") break;
      return -1
    }
    return Q
  }

  function FW(A, Q, B) {
    return {
      err: {
        code: A,
        msg: Q,
        line: B.line || B,
        col: B.col
      }
    }
  }

  function yq4(A) {
    return S$1.isName(A)
  }

  function xq4(A) {
    return S$1.isName(A)
  }

  function aC(A, Q) {
    let B = A.substring(0, Q).split(/\r?\n/);
    return {
      line: B.length,
      col: B[B.length - 1].length + 1
    }
  }

  function aDA(A) {
    return A.startIndex + A[1].length
  }
})
// @from(Start 2516871, End 2517946)
L2Q = z((hq4) => {
  var N2Q = {
      preserveOrder: !1,
      attributeNamePrefix: "@_",
      attributesGroupName: !1,
      textNodeName: "#text",
      ignoreAttributes: !0,
      removeNSPrefix: !1,
      allowBooleanAttributes: !1,
      parseTagValue: !0,
      parseAttributeValue: !1,
      trimValues: !0,
      cdataPropName: !1,
      numberParseOptions: {
        hex: !0,
        leadingZeros: !0,
        eNotation: !0
      },
      tagValueProcessor: function(A, Q) {
        return Q
      },
      attributeValueProcessor: function(A, Q) {
        return Q
      },
      stopNodes: [],
      alwaysCreateTextNode: !1,
      isArray: () => !1,
      commentPropName: !1,
      unpairedTags: [],
      processEntities: !0,
      htmlEntities: !1,
      ignoreDeclaration: !1,
      ignorePiTags: !1,
      transformTagName: !1,
      transformAttributeName: !1,
      updateTag: function(A, Q, B) {
        return A
      }
    },
    fq4 = function(A) {
      return Object.assign({}, N2Q, A)
    };
  hq4.buildOptions = fq4;
  hq4.defaultOptions = N2Q
})
// @from(Start 2517952, End 2518507)
R2Q = z((YE7, O2Q) => {
  class M2Q {
    constructor(A) {
      this.tagname = A, this.child = [], this[":@"] = {}
    }
    add(A, Q) {
      if (A === "__proto__") A = "#__proto__";
      this.child.push({
        [A]: Q
      })
    }
    addChild(A) {
      if (A.tagname === "__proto__") A.tagname = "#__proto__";
      if (A[":@"] && Object.keys(A[":@"]).length > 0) this.child.push({
        [A.tagname]: A.child,
        [":@"]: A[":@"]
      });
      else this.child.push({
        [A.tagname]: A.child
      })
    }
  }
  O2Q.exports = M2Q
})
// @from(Start 2518513, End 2521165)
P2Q = z((JE7, T2Q) => {
  var mq4 = ChA();

  function dq4(A, Q) {
    let B = {};
    if (A[Q + 3] === "O" && A[Q + 4] === "C" && A[Q + 5] === "T" && A[Q + 6] === "Y" && A[Q + 7] === "P" && A[Q + 8] === "E") {
      Q = Q + 9;
      let G = 1,
        Z = !1,
        I = !1,
        Y = "";
      for (; Q < A.length; Q++)
        if (A[Q] === "<" && !I) {
          if (Z && lq4(A, Q)) {
            if (Q += 7, [entityName, val, Q] = cq4(A, Q + 1), val.indexOf("&") === -1) B[sq4(entityName)] = {
              regx: RegExp(`&${entityName};`, "g"),
              val
            }
          } else if (Z && iq4(A, Q)) Q += 8;
          else if (Z && nq4(A, Q)) Q += 8;
          else if (Z && aq4(A, Q)) Q += 9;
          else if (pq4) I = !0;
          else throw Error("Invalid DOCTYPE");
          G++, Y = ""
        } else if (A[Q] === ">") {
        if (I) {
          if (A[Q - 1] === "-" && A[Q - 2] === "-") I = !1, G--
        } else G--;
        if (G === 0) break
      } else if (A[Q] === "[") Z = !0;
      else Y += A[Q];
      if (G !== 0) throw Error("Unclosed DOCTYPE")
    } else throw Error("Invalid Tag instead of DOCTYPE");
    return {
      entities: B,
      i: Q
    }
  }

  function cq4(A, Q) {
    let B = "";
    for (; Q < A.length && (A[Q] !== "'" && A[Q] !== '"'); Q++) B += A[Q];
    if (B = B.trim(), B.indexOf(" ") !== -1) throw Error("External entites are not supported");
    let G = A[Q++],
      Z = "";
    for (; Q < A.length && A[Q] !== G; Q++) Z += A[Q];
    return [B, Z, Q]
  }

  function pq4(A, Q) {
    if (A[Q + 1] === "!" && A[Q + 2] === "-" && A[Q + 3] === "-") return !0;
    return !1
  }

  function lq4(A, Q) {
    if (A[Q + 1] === "!" && A[Q + 2] === "E" && A[Q + 3] === "N" && A[Q + 4] === "T" && A[Q + 5] === "I" && A[Q + 6] === "T" && A[Q + 7] === "Y") return !0;
    return !1
  }

  function iq4(A, Q) {
    if (A[Q + 1] === "!" && A[Q + 2] === "E" && A[Q + 3] === "L" && A[Q + 4] === "E" && A[Q + 5] === "M" && A[Q + 6] === "E" && A[Q + 7] === "N" && A[Q + 8] === "T") return !0;
    return !1
  }

  function nq4(A, Q) {
    if (A[Q + 1] === "!" && A[Q + 2] === "A" && A[Q + 3] === "T" && A[Q + 4] === "T" && A[Q + 5] === "L" && A[Q + 6] === "I" && A[Q + 7] === "S" && A[Q + 8] === "T") return !0;
    return !1
  }

  function aq4(A, Q) {
    if (A[Q + 1] === "!" && A[Q + 2] === "N" && A[Q + 3] === "O" && A[Q + 4] === "T" && A[Q + 5] === "A" && A[Q + 6] === "T" && A[Q + 7] === "I" && A[Q + 8] === "O" && A[Q + 9] === "N") return !0;
    return !1
  }

  function sq4(A) {
    if (mq4.isName(A)) return A;
    else throw Error(`Invalid entity name ${A}`)
  }
  T2Q.exports = dq4
})
// @from(Start 2521171, End 2523155)
S2Q = z((WE7, j2Q) => {
  var rq4 = /^[-+]?0x[a-fA-F0-9]+$/,
    oq4 = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
  if (!Number.parseInt && window.parseInt) Number.parseInt = window.parseInt;
  if (!Number.parseFloat && window.parseFloat) Number.parseFloat = window.parseFloat;
  var tq4 = {
    hex: !0,
    leadingZeros: !0,
    decimalPoint: ".",
    eNotation: !0
  };

  function eq4(A, Q = {}) {
    if (Q = Object.assign({}, tq4, Q), !A || typeof A !== "string") return A;
    let B = A.trim();
    if (Q.skipLike !== void 0 && Q.skipLike.test(B)) return A;
    else if (Q.hex && rq4.test(B)) return Number.parseInt(B, 16);
    else {
      let G = oq4.exec(B);
      if (G) {
        let Z = G[1],
          I = G[2],
          Y = AN4(G[3]),
          J = G[4] || G[6];
        if (!Q.leadingZeros && I.length > 0 && Z && B[2] !== ".") return A;
        else if (!Q.leadingZeros && I.length > 0 && !Z && B[1] !== ".") return A;
        else {
          let W = Number(B),
            X = "" + W;
          if (X.search(/[eE]/) !== -1)
            if (Q.eNotation) return W;
            else return A;
          else if (J)
            if (Q.eNotation) return W;
            else return A;
          else if (B.indexOf(".") !== -1)
            if (X === "0" && Y === "") return W;
            else if (X === Y) return W;
          else if (Z && X === "-" + Y) return W;
          else return A;
          if (I)
            if (Y === X) return W;
            else if (Z + Y === X) return W;
          else return A;
          if (B === X) return W;
          else if (B === Z + X) return W;
          return A
        }
      } else return A
    }
  }

  function AN4(A) {
    if (A && A.indexOf(".") !== -1) {
      if (A = A.replace(/0+$/, ""), A === ".") A = "0";
      else if (A[0] === ".") A = "0" + A;
      else if (A[A.length - 1] === ".") A = A.substr(0, A.length - 1);
      return A
    }
    return A
  }
  j2Q.exports = eq4
})
// @from(Start 2523161, End 2535685)
x2Q = z((XE7, y2Q) => {
  var _2Q = ChA(),
    sDA = R2Q(),
    QN4 = P2Q(),
    BN4 = S2Q();
  class k2Q {
    constructor(A) {
      this.options = A, this.currentNode = null, this.tagsNodeStack = [], this.docTypeEntities = {}, this.lastEntities = {
        apos: {
          regex: /&(apos|#39|#x27);/g,
          val: "'"
        },
        gt: {
          regex: /&(gt|#62|#x3E);/g,
          val: ">"
        },
        lt: {
          regex: /&(lt|#60|#x3C);/g,
          val: "<"
        },
        quot: {
          regex: /&(quot|#34|#x22);/g,
          val: '"'
        }
      }, this.ampEntity = {
        regex: /&(amp|#38|#x26);/g,
        val: "&"
      }, this.htmlEntities = {
        space: {
          regex: /&(nbsp|#160);/g,
          val: " "
        },
        cent: {
          regex: /&(cent|#162);/g,
          val: "¢"
        },
        pound: {
          regex: /&(pound|#163);/g,
          val: "£"
        },
        yen: {
          regex: /&(yen|#165);/g,
          val: "¥"
        },
        euro: {
          regex: /&(euro|#8364);/g,
          val: "€"
        },
        copyright: {
          regex: /&(copy|#169);/g,
          val: "©"
        },
        reg: {
          regex: /&(reg|#174);/g,
          val: "®"
        },
        inr: {
          regex: /&(inr|#8377);/g,
          val: "₹"
        },
        num_dec: {
          regex: /&#([0-9]{1,7});/g,
          val: (Q, B) => String.fromCharCode(Number.parseInt(B, 10))
        },
        num_hex: {
          regex: /&#x([0-9a-fA-F]{1,6});/g,
          val: (Q, B) => String.fromCharCode(Number.parseInt(B, 16))
        }
      }, this.addExternalEntities = GN4, this.parseXml = WN4, this.parseTextData = ZN4, this.resolveNameSpace = IN4, this.buildAttributesMap = JN4, this.isItStopNode = KN4, this.replaceEntitiesValue = VN4, this.readStopNodeData = HN4, this.saveTextToParentTag = FN4, this.addChild = XN4
    }
  }

  function GN4(A) {
    let Q = Object.keys(A);
    for (let B = 0; B < Q.length; B++) {
      let G = Q[B];
      this.lastEntities[G] = {
        regex: new RegExp("&" + G + ";", "g"),
        val: A[G]
      }
    }
  }

  function ZN4(A, Q, B, G, Z, I, Y) {
    if (A !== void 0) {
      if (this.options.trimValues && !G) A = A.trim();
      if (A.length > 0) {
        if (!Y) A = this.replaceEntitiesValue(A);
        let J = this.options.tagValueProcessor(Q, A, B, Z, I);
        if (J === null || J === void 0) return A;
        else if (typeof J !== typeof A || J !== A) return J;
        else if (this.options.trimValues) return y$1(A, this.options.parseTagValue, this.options.numberParseOptions);
        else if (A.trim() === A) return y$1(A, this.options.parseTagValue, this.options.numberParseOptions);
        else return A
      }
    }
  }

  function IN4(A) {
    if (this.options.removeNSPrefix) {
      let Q = A.split(":"),
        B = A.charAt(0) === "/" ? "/" : "";
      if (Q[0] === "xmlns") return "";
      if (Q.length === 2) A = B + Q[1]
    }
    return A
  }
  var YN4 = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");

  function JN4(A, Q, B) {
    if (!this.options.ignoreAttributes && typeof A === "string") {
      let G = _2Q.getAllMatches(A, YN4),
        Z = G.length,
        I = {};
      for (let Y = 0; Y < Z; Y++) {
        let J = this.resolveNameSpace(G[Y][1]),
          W = G[Y][4],
          X = this.options.attributeNamePrefix + J;
        if (J.length) {
          if (this.options.transformAttributeName) X = this.options.transformAttributeName(X);
          if (X === "__proto__") X = "#__proto__";
          if (W !== void 0) {
            if (this.options.trimValues) W = W.trim();
            W = this.replaceEntitiesValue(W);
            let V = this.options.attributeValueProcessor(J, W, Q);
            if (V === null || V === void 0) I[X] = W;
            else if (typeof V !== typeof W || V !== W) I[X] = V;
            else I[X] = y$1(W, this.options.parseAttributeValue, this.options.numberParseOptions)
          } else if (this.options.allowBooleanAttributes) I[X] = !0
        }
      }
      if (!Object.keys(I).length) return;
      if (this.options.attributesGroupName) {
        let Y = {};
        return Y[this.options.attributesGroupName] = I, Y
      }
      return I
    }
  }
  var WN4 = function(A) {
    A = A.replace(/\r\n?/g, `
`);
    let Q = new sDA("!xml"),
      B = Q,
      G = "",
      Z = "";
    for (let I = 0; I < A.length; I++)
      if (A[I] === "<")
        if (A[I + 1] === "/") {
          let J = fr(A, ">", I, "Closing Tag is not closed."),
            W = A.substring(I + 2, J).trim();
          if (this.options.removeNSPrefix) {
            let F = W.indexOf(":");
            if (F !== -1) W = W.substr(F + 1)
          }
          if (this.options.transformTagName) W = this.options.transformTagName(W);
          if (B) G = this.saveTextToParentTag(G, B, Z);
          let X = Z.substring(Z.lastIndexOf(".") + 1);
          if (W && this.options.unpairedTags.indexOf(W) !== -1) throw Error(`Unpaired tag can not be used as closing tag: </${W}>`);
          let V = 0;
          if (X && this.options.unpairedTags.indexOf(X) !== -1) V = Z.lastIndexOf(".", Z.lastIndexOf(".") - 1), this.tagsNodeStack.pop();
          else V = Z.lastIndexOf(".");
          Z = Z.substring(0, V), B = this.tagsNodeStack.pop(), G = "", I = J
        } else if (A[I + 1] === "?") {
      let J = k$1(A, I, !1, "?>");
      if (!J) throw Error("Pi Tag is not closed.");
      if (G = this.saveTextToParentTag(G, B, Z), this.options.ignoreDeclaration && J.tagName === "?xml" || this.options.ignorePiTags);
      else {
        let W = new sDA(J.tagName);
        if (W.add(this.options.textNodeName, ""), J.tagName !== J.tagExp && J.attrExpPresent) W[":@"] = this.buildAttributesMap(J.tagExp, Z, J.tagName);
        this.addChild(B, W, Z)
      }
      I = J.closeIndex + 1
    } else if (A.substr(I + 1, 3) === "!--") {
      let J = fr(A, "-->", I + 4, "Comment is not closed.");
      if (this.options.commentPropName) {
        let W = A.substring(I + 4, J - 2);
        G = this.saveTextToParentTag(G, B, Z), B.add(this.options.commentPropName, [{
          [this.options.textNodeName]: W
        }])
      }
      I = J
    } else if (A.substr(I + 1, 2) === "!D") {
      let J = QN4(A, I);
      this.docTypeEntities = J.entities, I = J.i
    } else if (A.substr(I + 1, 2) === "![") {
      let J = fr(A, "]]>", I, "CDATA is not closed.") - 2,
        W = A.substring(I + 9, J);
      G = this.saveTextToParentTag(G, B, Z);
      let X = this.parseTextData(W, B.tagname, Z, !0, !1, !0, !0);
      if (X == null) X = "";
      if (this.options.cdataPropName) B.add(this.options.cdataPropName, [{
        [this.options.textNodeName]: W
      }]);
      else B.add(this.options.textNodeName, X);
      I = J + 2
    } else {
      let J = k$1(A, I, this.options.removeNSPrefix),
        W = J.tagName,
        X = J.rawTagName,
        V = J.tagExp,
        F = J.attrExpPresent,
        K = J.closeIndex;
      if (this.options.transformTagName) W = this.options.transformTagName(W);
      if (B && G) {
        if (B.tagname !== "!xml") G = this.saveTextToParentTag(G, B, Z, !1)
      }
      let D = B;
      if (D && this.options.unpairedTags.indexOf(D.tagname) !== -1) B = this.tagsNodeStack.pop(), Z = Z.substring(0, Z.lastIndexOf("."));
      if (W !== Q.tagname) Z += Z ? "." + W : W;
      if (this.isItStopNode(this.options.stopNodes, Z, W)) {
        let H = "";
        if (V.length > 0 && V.lastIndexOf("/") === V.length - 1) {
          if (W[W.length - 1] === "/") W = W.substr(0, W.length - 1), Z = Z.substr(0, Z.length - 1), V = W;
          else V = V.substr(0, V.length - 1);
          I = J.closeIndex
        } else if (this.options.unpairedTags.indexOf(W) !== -1) I = J.closeIndex;
        else {
          let E = this.readStopNodeData(A, X, K + 1);
          if (!E) throw Error(`Unexpected end of ${X}`);
          I = E.i, H = E.tagContent
        }
        let C = new sDA(W);
        if (W !== V && F) C[":@"] = this.buildAttributesMap(V, Z, W);
        if (H) H = this.parseTextData(H, W, Z, !0, F, !0, !0);
        Z = Z.substr(0, Z.lastIndexOf(".")), C.add(this.options.textNodeName, H), this.addChild(B, C, Z)
      } else {
        if (V.length > 0 && V.lastIndexOf("/") === V.length - 1) {
          if (W[W.length - 1] === "/") W = W.substr(0, W.length - 1), Z = Z.substr(0, Z.length - 1), V = W;
          else V = V.substr(0, V.length - 1);
          if (this.options.transformTagName) W = this.options.transformTagName(W);
          let H = new sDA(W);
          if (W !== V && F) H[":@"] = this.buildAttributesMap(V, Z, W);
          this.addChild(B, H, Z), Z = Z.substr(0, Z.lastIndexOf("."))
        } else {
          let H = new sDA(W);
          if (this.tagsNodeStack.push(B), W !== V && F) H[":@"] = this.buildAttributesMap(V, Z, W);
          this.addChild(B, H, Z), B = H
        }
        G = "", I = K
      }
    } else G += A[I];
    return Q.child
  };

  function XN4(A, Q, B) {
    let G = this.options.updateTag(Q.tagname, B, Q[":@"]);
    if (G === !1);
    else if (typeof G === "string") Q.tagname = G, A.addChild(Q);
    else A.addChild(Q)
  }
  var VN4 = function(A) {
    if (this.options.processEntities) {
      for (let Q in this.docTypeEntities) {
        let B = this.docTypeEntities[Q];
        A = A.replace(B.regx, B.val)
      }
      for (let Q in this.lastEntities) {
        let B = this.lastEntities[Q];
        A = A.replace(B.regex, B.val)
      }
      if (this.options.htmlEntities)
        for (let Q in this.htmlEntities) {
          let B = this.htmlEntities[Q];
          A = A.replace(B.regex, B.val)
        }
      A = A.replace(this.ampEntity.regex, this.ampEntity.val)
    }
    return A
  };

  function FN4(A, Q, B, G) {
    if (A) {
      if (G === void 0) G = Object.keys(Q.child).length === 0;
      if (A = this.parseTextData(A, Q.tagname, B, !1, Q[":@"] ? Object.keys(Q[":@"]).length !== 0 : !1, G), A !== void 0 && A !== "") Q.add(this.options.textNodeName, A);
      A = ""
    }
    return A
  }

  function KN4(A, Q, B) {
    let G = "*." + B;
    for (let Z in A) {
      let I = A[Z];
      if (G === I || Q === I) return !0
    }
    return !1
  }

  function DN4(A, Q, B = ">") {
    let G, Z = "";
    for (let I = Q; I < A.length; I++) {
      let Y = A[I];
      if (G) {
        if (Y === G) G = ""
      } else if (Y === '"' || Y === "'") G = Y;
      else if (Y === B[0])
        if (B[1]) {
          if (A[I + 1] === B[1]) return {
            data: Z,
            index: I
          }
        } else return {
          data: Z,
          index: I
        };
      else if (Y === "\t") Y = " ";
      Z += Y
    }
  }

  function fr(A, Q, B, G) {
    let Z = A.indexOf(Q, B);
    if (Z === -1) throw Error(G);
    else return Z + Q.length - 1
  }

  function k$1(A, Q, B, G = ">") {
    let Z = DN4(A, Q + 1, G);
    if (!Z) return;
    let {
      data: I,
      index: Y
    } = Z, J = I.search(/\s/), W = I, X = !0;
    if (J !== -1) W = I.substring(0, J), I = I.substring(J + 1).trimStart();
    let V = W;
    if (B) {
      let F = W.indexOf(":");
      if (F !== -1) W = W.substr(F + 1), X = W !== Z.data.substr(F + 1)
    }
    return {
      tagName: W,
      tagExp: I,
      closeIndex: Y,
      attrExpPresent: X,
      rawTagName: V
    }
  }

  function HN4(A, Q, B) {
    let G = B,
      Z = 1;
    for (; B < A.length; B++)
      if (A[B] === "<")
        if (A[B + 1] === "/") {
          let I = fr(A, ">", B, `${Q} is not closed`);
          if (A.substring(B + 2, I).trim() === Q) {
            if (Z--, Z === 0) return {
              tagContent: A.substring(G, B),
              i: I
            }
          }
          B = I
        } else if (A[B + 1] === "?") B = fr(A, "?>", B + 1, "StopNode is not closed.");
    else if (A.substr(B + 1, 3) === "!--") B = fr(A, "-->", B + 3, "StopNode is not closed.");
    else if (A.substr(B + 1, 2) === "![") B = fr(A, "]]>", B, "StopNode is not closed.") - 2;
    else {
      let I = k$1(A, B, ">");
      if (I) {
        if ((I && I.tagName) === Q && I.tagExp[I.tagExp.length - 1] !== "/") Z++;
        B = I.closeIndex
      }
    }
  }

  function y$1(A, Q, B) {
    if (Q && typeof A === "string") {
      let G = A.trim();
      if (G === "true") return !0;
      else if (G === "false") return !1;
      else return BN4(A, B)
    } else if (_2Q.isExist(A)) return A;
    else return ""
  }
  y2Q.exports = k2Q
})
// @from(Start 2535691, End 2537496)
b2Q = z(($N4) => {
  function CN4(A, Q) {
    return v2Q(A, Q)
  }

  function v2Q(A, Q, B) {
    let G, Z = {};
    for (let I = 0; I < A.length; I++) {
      let Y = A[I],
        J = EN4(Y),
        W = "";
      if (B === void 0) W = J;
      else W = B + "." + J;
      if (J === Q.textNodeName)
        if (G === void 0) G = Y[J];
        else G += "" + Y[J];
      else if (J === void 0) continue;
      else if (Y[J]) {
        let X = v2Q(Y[J], Q, W),
          V = UN4(X, Q);
        if (Y[":@"]) zN4(X, Y[":@"], W, Q);
        else if (Object.keys(X).length === 1 && X[Q.textNodeName] !== void 0 && !Q.alwaysCreateTextNode) X = X[Q.textNodeName];
        else if (Object.keys(X).length === 0)
          if (Q.alwaysCreateTextNode) X[Q.textNodeName] = "";
          else X = "";
        if (Z[J] !== void 0 && Z.hasOwnProperty(J)) {
          if (!Array.isArray(Z[J])) Z[J] = [Z[J]];
          Z[J].push(X)
        } else if (Q.isArray(J, W, V)) Z[J] = [X];
        else Z[J] = X
      }
    }
    if (typeof G === "string") {
      if (G.length > 0) Z[Q.textNodeName] = G
    } else if (G !== void 0) Z[Q.textNodeName] = G;
    return Z
  }

  function EN4(A) {
    let Q = Object.keys(A);
    for (let B = 0; B < Q.length; B++) {
      let G = Q[B];
      if (G !== ":@") return G
    }
  }

  function zN4(A, Q, B, G) {
    if (Q) {
      let Z = Object.keys(Q),
        I = Z.length;
      for (let Y = 0; Y < I; Y++) {
        let J = Z[Y];
        if (G.isArray(J, B + "." + J, !0, !0)) A[J] = [Q[J]];
        else A[J] = Q[J]
      }
    }
  }

  function UN4(A, Q) {
    let {
      textNodeName: B
    } = Q, G = Object.keys(A).length;
    if (G === 0) return !0;
    if (G === 1 && (A[B] || typeof A[B] === "boolean" || A[B] === 0)) return !0;
    return !1
  }
  $N4.prettify = CN4
})
// @from(Start 2537502, End 2538693)
g2Q = z((FE7, h2Q) => {
  var {
    buildOptions: qN4
  } = L2Q(), NN4 = x2Q(), {
    prettify: LN4
  } = b2Q(), MN4 = _$1();
  class f2Q {
    constructor(A) {
      this.externalEntities = {}, this.options = qN4(A)
    }
    parse(A, Q) {
      if (typeof A === "string");
      else if (A.toString) A = A.toString();
      else throw Error("XML data is accepted in String or Bytes[] form.");
      if (Q) {
        if (Q === !0) Q = {};
        let Z = MN4.validate(A, Q);
        if (Z !== !0) throw Error(`${Z.err.msg}:${Z.err.line}:${Z.err.col}`)
      }
      let B = new NN4(this.options);
      B.addExternalEntities(this.externalEntities);
      let G = B.parseXml(A);
      if (this.options.preserveOrder || G === void 0) return G;
      else return LN4(G, this.options)
    }
    addEntity(A, Q) {
      if (Q.indexOf("&") !== -1) throw Error("Entity value can't have '&'");
      else if (A.indexOf("&") !== -1 || A.indexOf(";") !== -1) throw Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
      else if (Q === "&") throw Error("An entity with value '&' is not permitted");
      else this.externalEntities[A] = Q
    }
  }
  h2Q.exports = f2Q
})
// @from(Start 2538699, End 2541522)
p2Q = z((KE7, c2Q) => {
  function ON4(A, Q) {
    let B = "";
    if (Q.format && Q.indentBy.length > 0) B = `
`;
    return m2Q(A, Q, "", B)
  }

  function m2Q(A, Q, B, G) {
    let Z = "",
      I = !1;
    for (let Y = 0; Y < A.length; Y++) {
      let J = A[Y],
        W = RN4(J);
      if (W === void 0) continue;
      let X = "";
      if (B.length === 0) X = W;
      else X = `${B}.${W}`;
      if (W === Q.textNodeName) {
        let H = J[W];
        if (!TN4(X, Q)) H = Q.tagValueProcessor(W, H), H = d2Q(H, Q);
        if (I) Z += G;
        Z += H, I = !1;
        continue
      } else if (W === Q.cdataPropName) {
        if (I) Z += G;
        Z += `<![CDATA[${J[W][0][Q.textNodeName]}]]>`, I = !1;
        continue
      } else if (W === Q.commentPropName) {
        Z += G + `<!--${J[W][0][Q.textNodeName]}-->`, I = !0;
        continue
      } else if (W[0] === "?") {
        let H = u2Q(J[":@"], Q),
          C = W === "?xml" ? "" : G,
          E = J[W][0][Q.textNodeName];
        E = E.length !== 0 ? " " + E : "", Z += C + `<${W}${E}${H}?>`, I = !0;
        continue
      }
      let V = G;
      if (V !== "") V += Q.indentBy;
      let F = u2Q(J[":@"], Q),
        K = G + `<${W}${F}`,
        D = m2Q(J[W], Q, X, V);
      if (Q.unpairedTags.indexOf(W) !== -1)
        if (Q.suppressUnpairedNode) Z += K + ">";
        else Z += K + "/>";
      else if ((!D || D.length === 0) && Q.suppressEmptyNode) Z += K + "/>";
      else if (D && D.endsWith(">")) Z += K + `>${D}${G}</${W}>`;
      else {
        if (Z += K + ">", D && G !== "" && (D.includes("/>") || D.includes("</"))) Z += G + Q.indentBy + D + G;
        else Z += D;
        Z += `</${W}>`
      }
      I = !0
    }
    return Z
  }

  function RN4(A) {
    let Q = Object.keys(A);
    for (let B = 0; B < Q.length; B++) {
      let G = Q[B];
      if (!A.hasOwnProperty(G)) continue;
      if (G !== ":@") return G
    }
  }

  function u2Q(A, Q) {
    let B = "";
    if (A && !Q.ignoreAttributes)
      for (let G in A) {
        if (!A.hasOwnProperty(G)) continue;
        let Z = Q.attributeValueProcessor(G, A[G]);
        if (Z = d2Q(Z, Q), Z === !0 && Q.suppressBooleanAttributes) B += ` ${G.substr(Q.attributeNamePrefix.length)}`;
        else B += ` ${G.substr(Q.attributeNamePrefix.length)}="${Z}"`
      }
    return B
  }

  function TN4(A, Q) {
    A = A.substr(0, A.length - Q.textNodeName.length - 1);
    let B = A.substr(A.lastIndexOf(".") + 1);
    for (let G in Q.stopNodes)
      if (Q.stopNodes[G] === A || Q.stopNodes[G] === "*." + B) return !0;
    return !1
  }

  function d2Q(A, Q) {
    if (A && A.length > 0 && Q.processEntities)
      for (let B = 0; B < Q.entities.length; B++) {
        let G = Q.entities[B];
        A = A.replace(G.regex, G.val)
      }
    return A
  }
  c2Q.exports = ON4
})
// @from(Start 2541528, End 2548469)
i2Q = z((DE7, l2Q) => {
  var PN4 = p2Q(),
    jN4 = {
      attributeNamePrefix: "@_",
      attributesGroupName: !1,
      textNodeName: "#text",
      ignoreAttributes: !0,
      cdataPropName: !1,
      format: !1,
      indentBy: "  ",
      suppressEmptyNode: !1,
      suppressUnpairedNode: !0,
      suppressBooleanAttributes: !0,
      tagValueProcessor: function(A, Q) {
        return Q
      },
      attributeValueProcessor: function(A, Q) {
        return Q
      },
      preserveOrder: !1,
      commentPropName: !1,
      unpairedTags: [],
      entities: [{
        regex: new RegExp("&", "g"),
        val: "&amp;"
      }, {
        regex: new RegExp(">", "g"),
        val: "&gt;"
      }, {
        regex: new RegExp("<", "g"),
        val: "&lt;"
      }, {
        regex: new RegExp("'", "g"),
        val: "&apos;"
      }, {
        regex: new RegExp('"', "g"),
        val: "&quot;"
      }],
      processEntities: !0,
      stopNodes: [],
      oneListGroup: !1
    };

  function Dd(A) {
    if (this.options = Object.assign({}, jN4, A), this.options.ignoreAttributes || this.options.attributesGroupName) this.isAttribute = function() {
      return !1
    };
    else this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = kN4;
    if (this.processTextOrObjNode = SN4, this.options.format) this.indentate = _N4, this.tagEndChar = `>
`, this.newLine = `
`;
    else this.indentate = function() {
      return ""
    }, this.tagEndChar = ">", this.newLine = ""
  }
  Dd.prototype.build = function(A) {
    if (this.options.preserveOrder) return PN4(A, this.options);
    else {
      if (Array.isArray(A) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) A = {
        [this.options.arrayNodeName]: A
      };
      return this.j2x(A, 0).val
    }
  };
  Dd.prototype.j2x = function(A, Q) {
    let B = "",
      G = "";
    for (let Z in A) {
      if (!Object.prototype.hasOwnProperty.call(A, Z)) continue;
      if (typeof A[Z] > "u") {
        if (this.isAttribute(Z)) G += ""
      } else if (A[Z] === null)
        if (this.isAttribute(Z)) G += "";
        else if (Z[0] === "?") G += this.indentate(Q) + "<" + Z + "?" + this.tagEndChar;
      else G += this.indentate(Q) + "<" + Z + "/" + this.tagEndChar;
      else if (A[Z] instanceof Date) G += this.buildTextValNode(A[Z], Z, "", Q);
      else if (typeof A[Z] !== "object") {
        let I = this.isAttribute(Z);
        if (I) B += this.buildAttrPairStr(I, "" + A[Z]);
        else if (Z === this.options.textNodeName) {
          let Y = this.options.tagValueProcessor(Z, "" + A[Z]);
          G += this.replaceEntitiesValue(Y)
        } else G += this.buildTextValNode(A[Z], Z, "", Q)
      } else if (Array.isArray(A[Z])) {
        let I = A[Z].length,
          Y = "",
          J = "";
        for (let W = 0; W < I; W++) {
          let X = A[Z][W];
          if (typeof X > "u");
          else if (X === null)
            if (Z[0] === "?") G += this.indentate(Q) + "<" + Z + "?" + this.tagEndChar;
            else G += this.indentate(Q) + "<" + Z + "/" + this.tagEndChar;
          else if (typeof X === "object")
            if (this.options.oneListGroup) {
              let V = this.j2x(X, Q + 1);
              if (Y += V.val, this.options.attributesGroupName && X.hasOwnProperty(this.options.attributesGroupName)) J += V.attrStr
            } else Y += this.processTextOrObjNode(X, Z, Q);
          else if (this.options.oneListGroup) {
            let V = this.options.tagValueProcessor(Z, X);
            V = this.replaceEntitiesValue(V), Y += V
          } else Y += this.buildTextValNode(X, Z, "", Q)
        }
        if (this.options.oneListGroup) Y = this.buildObjectNode(Y, Z, J, Q);
        G += Y
      } else if (this.options.attributesGroupName && Z === this.options.attributesGroupName) {
        let I = Object.keys(A[Z]),
          Y = I.length;
        for (let J = 0; J < Y; J++) B += this.buildAttrPairStr(I[J], "" + A[Z][I[J]])
      } else G += this.processTextOrObjNode(A[Z], Z, Q)
    }
    return {
      attrStr: B,
      val: G
    }
  };
  Dd.prototype.buildAttrPairStr = function(A, Q) {
    if (Q = this.options.attributeValueProcessor(A, "" + Q), Q = this.replaceEntitiesValue(Q), this.options.suppressBooleanAttributes && Q === "true") return " " + A;
    else return " " + A + '="' + Q + '"'
  };

  function SN4(A, Q, B) {
    let G = this.j2x(A, B + 1);
    if (A[this.options.textNodeName] !== void 0 && Object.keys(A).length === 1) return this.buildTextValNode(A[this.options.textNodeName], Q, G.attrStr, B);
    else return this.buildObjectNode(G.val, Q, G.attrStr, B)
  }
  Dd.prototype.buildObjectNode = function(A, Q, B, G) {
    if (A === "")
      if (Q[0] === "?") return this.indentate(G) + "<" + Q + B + "?" + this.tagEndChar;
      else return this.indentate(G) + "<" + Q + B + this.closeTag(Q) + this.tagEndChar;
    else {
      let Z = "</" + Q + this.tagEndChar,
        I = "";
      if (Q[0] === "?") I = "?", Z = "";
      if ((B || B === "") && A.indexOf("<") === -1) return this.indentate(G) + "<" + Q + B + I + ">" + A + Z;
      else if (this.options.commentPropName !== !1 && Q === this.options.commentPropName && I.length === 0) return this.indentate(G) + `<!--${A}-->` + this.newLine;
      else return this.indentate(G) + "<" + Q + B + I + this.tagEndChar + A + this.indentate(G) + Z
    }
  };
  Dd.prototype.closeTag = function(A) {
    let Q = "";
    if (this.options.unpairedTags.indexOf(A) !== -1) {
      if (!this.options.suppressUnpairedNode) Q = "/"
    } else if (this.options.suppressEmptyNode) Q = "/";
    else Q = `></${A}`;
    return Q
  };
  Dd.prototype.buildTextValNode = function(A, Q, B, G) {
    if (this.options.cdataPropName !== !1 && Q === this.options.cdataPropName) return this.indentate(G) + `<![CDATA[${A}]]>` + this.newLine;
    else if (this.options.commentPropName !== !1 && Q === this.options.commentPropName) return this.indentate(G) + `<!--${A}-->` + this.newLine;
    else if (Q[0] === "?") return this.indentate(G) + "<" + Q + B + "?" + this.tagEndChar;
    else {
      let Z = this.options.tagValueProcessor(Q, A);
      if (Z = this.replaceEntitiesValue(Z), Z === "") return this.indentate(G) + "<" + Q + B + this.closeTag(Q) + this.tagEndChar;
      else return this.indentate(G) + "<" + Q + B + ">" + Z + "</" + Q + this.tagEndChar
    }
  };
  Dd.prototype.replaceEntitiesValue = function(A) {
    if (A && A.length > 0 && this.options.processEntities)
      for (let Q = 0; Q < this.options.entities.length; Q++) {
        let B = this.options.entities[Q];
        A = A.replace(B.regex, B.val)
      }
    return A
  };

  function _N4(A) {
    return this.options.indentBy.repeat(A)
  }

  function kN4(A) {
    if (A.startsWith(this.options.attributeNamePrefix) && A !== this.options.textNodeName) return A.substr(this.attrPrefixLen);
    else return !1
  }
  l2Q.exports = Dd
})
// @from(Start 2548475, End 2548638)
wS = z((HE7, n2Q) => {
  var yN4 = _$1(),
    xN4 = g2Q(),
    vN4 = i2Q();
  n2Q.exports = {
    XMLParser: xN4,
    XMLValidator: yN4,
    XMLBuilder: vN4
  }
})
// @from(Start 2548644, End 2551762)
rDA = z((CE7, t2Q) => {
  var {
    defineProperty: EhA,
    getOwnPropertyDescriptor: bN4,
    getOwnPropertyNames: fN4
  } = Object, hN4 = Object.prototype.hasOwnProperty, zhA = (A, Q) => EhA(A, "name", {
    value: Q,
    configurable: !0
  }), gN4 = (A, Q) => {
    for (var B in Q) EhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, uN4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of fN4(Q))
        if (!hN4.call(A, Z) && Z !== B) EhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = bN4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, mN4 = (A) => uN4(EhA({}, "__esModule", {
    value: !0
  }), A), a2Q = {};
  gN4(a2Q, {
    XmlNode: () => dN4,
    XmlText: () => o2Q
  });
  t2Q.exports = mN4(a2Q);

  function s2Q(A) {
    return A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  }
  zhA(s2Q, "escapeAttribute");

  function r2Q(A) {
    return A.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#x0D;").replace(/\n/g, "&#x0A;").replace(/\u0085/g, "&#x85;").replace(/\u2028/, "&#x2028;")
  }
  zhA(r2Q, "escapeElement");
  var o2Q = class {
      constructor(A) {
        this.value = A
      }
      static {
        zhA(this, "XmlText")
      }
      toString() {
        return r2Q("" + this.value)
      }
    },
    dN4 = class A {
      constructor(Q, B = []) {
        this.name = Q, this.children = B
      }
      static {
        zhA(this, "XmlNode")
      }
      attributes = {};
      static of (Q, B, G) {
        let Z = new A(Q);
        if (B !== void 0) Z.addChildNode(new o2Q(B));
        if (G !== void 0) Z.withName(G);
        return Z
      }
      withName(Q) {
        return this.name = Q, this
      }
      addAttribute(Q, B) {
        return this.attributes[Q] = B, this
      }
      addChildNode(Q) {
        return this.children.push(Q), this
      }
      removeAttribute(Q) {
        return delete this.attributes[Q], this
      }
      n(Q) {
        return this.name = Q, this
      }
      c(Q) {
        return this.children.push(Q), this
      }
      a(Q, B) {
        if (B != null) this.attributes[Q] = B;
        return this
      }
      cc(Q, B, G = B) {
        if (Q[B] != null) {
          let Z = A.of(B, Q[B]).withName(G);
          this.c(Z)
        }
      }
      l(Q, B, G, Z) {
        if (Q[B] != null) Z().map((Y) => {
          Y.withName(G), this.c(Y)
        })
      }
      lc(Q, B, G, Z) {
        if (Q[B] != null) {
          let I = Z(),
            Y = new A(G);
          I.map((J) => {
            Y.c(J)
          }), this.c(Y)
        }
      }
      toString() {
        let Q = Boolean(this.children.length),
          B = `<${this.name}`,
          G = this.attributes;
        for (let Z of Object.keys(G)) {
          let I = G[Z];
          if (I != null) B += ` ${Z}="${s2Q(""+I)}"`
        }
        return B += !Q ? "/>" : `>${this.children.map((Z)=>Z.toString()).join("")}</${this.name}>`
      }
    }
})