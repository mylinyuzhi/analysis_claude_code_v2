
// @from(Start 12667933, End 12673076)
ts2 = z((os2) => {
  var {
    _optionalChain: en
  } = i0();
  Object.defineProperty(os2, "__esModule", {
    value: !0
  });
  var RPA = i0(),
    rs2 = $$(),
    uV3 = tn(),
    mV3 = ["aggregate", "bulkWrite", "countDocuments", "createIndex", "createIndexes", "deleteMany", "deleteOne", "distinct", "drop", "dropIndex", "dropIndexes", "estimatedDocumentCount", "find", "findOne", "findOneAndDelete", "findOneAndReplace", "findOneAndUpdate", "indexes", "indexExists", "indexInformation", "initializeOrderedBulkOp", "insertMany", "insertOne", "isCapped", "mapReduce", "options", "parallelCollectionScan", "rename", "replaceOne", "stats", "updateMany", "updateOne"],
    dV3 = {
      bulkWrite: ["operations"],
      countDocuments: ["query"],
      createIndex: ["fieldOrSpec"],
      createIndexes: ["indexSpecs"],
      deleteMany: ["filter"],
      deleteOne: ["filter"],
      distinct: ["key", "query"],
      dropIndex: ["indexName"],
      find: ["query"],
      findOne: ["query"],
      findOneAndDelete: ["filter"],
      findOneAndReplace: ["filter", "replacement"],
      findOneAndUpdate: ["filter", "update"],
      indexExists: ["indexes"],
      insertMany: ["docs"],
      insertOne: ["doc"],
      mapReduce: ["map", "reduce"],
      rename: ["newName"],
      replaceOne: ["filter", "doc"],
      updateMany: ["filter", "update"],
      updateOne: ["filter", "update"]
    };

  function cV3(A) {
    return A && typeof A === "object" && A.once && typeof A.once === "function"
  }
  class _G1 {
    static __initStatic() {
      this.id = "Mongo"
    }
    constructor(A = {}) {
      this.name = _G1.id, this._operations = Array.isArray(A.operations) ? A.operations : mV3, this._describeOperations = "describeOperations" in A ? A.describeOperations : !0, this._useMongoose = !!A.useMongoose
    }
    loadDependency() {
      let A = this._useMongoose ? "mongoose" : "mongodb";
      return this._module = this._module || RPA.loadModule(A)
    }
    setupOnce(A, Q) {
      if (uV3.shouldDisableAutoInstrumentation(Q)) {
        rs2.DEBUG_BUILD && RPA.logger.log("Mongo Integration is skipped because of instrumenter configuration.");
        return
      }
      let B = this.loadDependency();
      if (!B) {
        let G = this._useMongoose ? "mongoose" : "mongodb";
        rs2.DEBUG_BUILD && RPA.logger.error(`Mongo Integration was unable to require \`${G}\` package.`);
        return
      }
      this._instrumentOperations(B.Collection, this._operations, Q)
    }
    _instrumentOperations(A, Q, B) {
      Q.forEach((G) => this._patchOperation(A, G, B))
    }
    _patchOperation(A, Q, B) {
      if (!(Q in A.prototype)) return;
      let G = this._getSpanContextFromOperationArguments.bind(this);
      RPA.fill(A.prototype, Q, function(Z) {
        return function(...I) {
          let Y = I[I.length - 1],
            J = B(),
            W = J.getScope(),
            X = J.getClient(),
            V = W.getSpan(),
            F = en([X, "optionalAccess", (D) => D.getOptions, "call", (D) => D(), "access", (D) => D.sendDefaultPii]);
          if (typeof Y !== "function" || Q === "mapReduce" && I.length === 2) {
            let D = en([V, "optionalAccess", (C) => C.startChild, "call", (C) => C(G(this, Q, I, F))]),
              H = Z.call(this, ...I);
            if (RPA.isThenable(H)) return H.then((C) => {
              return en([D, "optionalAccess", (E) => E.end, "call", (E) => E()]), C
            });
            else if (cV3(H)) {
              let C = H;
              try {
                C.once("close", () => {
                  en([D, "optionalAccess", (E) => E.end, "call", (E) => E()])
                })
              } catch (E) {
                en([D, "optionalAccess", (U) => U.end, "call", (U) => U()])
              }
              return C
            } else return en([D, "optionalAccess", (C) => C.end, "call", (C) => C()]), H
          }
          let K = en([V, "optionalAccess", (D) => D.startChild, "call", (D) => D(G(this, Q, I.slice(0, -1)))]);
          return Z.call(this, ...I.slice(0, -1), function(D, H) {
            en([K, "optionalAccess", (C) => C.end, "call", (C) => C()]), Y(D, H)
          })
        }
      })
    }
    _getSpanContextFromOperationArguments(A, Q, B, G = !1) {
      let Z = {
          "db.system": "mongodb",
          "db.name": A.dbName,
          "db.operation": Q,
          "db.mongodb.collection": A.collectionName
        },
        I = {
          op: "db",
          origin: "auto.db.mongo",
          description: Q,
          data: Z
        },
        Y = dV3[Q],
        J = Array.isArray(this._describeOperations) ? this._describeOperations.includes(Q) : this._describeOperations;
      if (!Y || !J || !G) return I;
      try {
        if (Q === "mapReduce") {
          let [W, X] = B;
          Z[Y[0]] = typeof W === "string" ? W : W.name || "<anonymous>", Z[Y[1]] = typeof X === "string" ? X : X.name || "<anonymous>"
        } else
          for (let W = 0; W < Y.length; W++) Z[`db.mongodb.${Y[W]}`] = JSON.stringify(B[W])
      } catch (W) {}
      return I
    }
  }
  _G1.__initStatic();
  os2.Mongo = _G1
})
// @from(Start 12673082, End 12674621)
Qr2 = z((Ar2) => {
  Object.defineProperty(Ar2, "__esModule", {
    value: !0
  });
  var LY0 = _4(),
    es2 = i0(),
    lV3 = $$(),
    iV3 = tn();

  function nV3(A) {
    return !!A && !!A.$use
  }
  class kG1 {
    static __initStatic() {
      this.id = "Prisma"
    }
    constructor(A = {}) {
      if (this.name = kG1.id, nV3(A.client) && !A.client._sentryInstrumented) {
        es2.addNonEnumerableProperty(A.client, "_sentryInstrumented", !0);
        let Q = {};
        try {
          let B = A.client._engineConfig;
          if (B) {
            let {
              activeProvider: G,
              clientVersion: Z
            } = B;
            if (G) Q["db.system"] = G;
            if (Z) Q["db.prisma.version"] = Z
          }
        } catch (B) {}
        A.client.$use((B, G) => {
          if (iV3.shouldDisableAutoInstrumentation(LY0.getCurrentHub)) return G(B);
          let {
            action: Z,
            model: I
          } = B;
          return LY0.startSpan({
            name: I ? `${I} ${Z}` : Z,
            onlyIfParent: !0,
            op: "db.prisma",
            attributes: {
              [LY0.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.db.prisma"
            },
            data: {
              ...Q,
              "db.operation": Z
            }
          }, () => G(B))
        })
      } else lV3.DEBUG_BUILD && es2.logger.warn("Unsupported Prisma client provided to PrismaIntegration. Provided client:", A.client)
    }
    setupOnce() {}
  }
  kG1.__initStatic();
  Ar2.Prisma = kG1
})
// @from(Start 12674627, End 12676371)
Zr2 = z((Gr2) => {
  var {
    _optionalChain: qXA
  } = i0();
  Object.defineProperty(Gr2, "__esModule", {
    value: !0
  });
  var TPA = i0(),
    Br2 = $$(),
    sV3 = tn();
  class yG1 {
    static __initStatic() {
      this.id = "GraphQL"
    }
    constructor() {
      this.name = yG1.id
    }
    loadDependency() {
      return this._module = this._module || TPA.loadModule("graphql/execution/execute.js")
    }
    setupOnce(A, Q) {
      if (sV3.shouldDisableAutoInstrumentation(Q)) {
        Br2.DEBUG_BUILD && TPA.logger.log("GraphQL Integration is skipped because of instrumenter configuration.");
        return
      }
      let B = this.loadDependency();
      if (!B) {
        Br2.DEBUG_BUILD && TPA.logger.error("GraphQL Integration was unable to require graphql/execution package.");
        return
      }
      TPA.fill(B, "execute", function(G) {
        return function(...Z) {
          let I = Q().getScope(),
            Y = I.getSpan(),
            J = qXA([Y, "optionalAccess", (X) => X.startChild, "call", (X) => X({
              description: "execute",
              op: "graphql.execute",
              origin: "auto.graphql.graphql"
            })]);
          qXA([I, "optionalAccess", (X) => X.setSpan, "call", (X) => X(J)]);
          let W = G.call(this, ...Z);
          if (TPA.isThenable(W)) return W.then((X) => {
            return qXA([J, "optionalAccess", (V) => V.end, "call", (V) => V()]), qXA([I, "optionalAccess", (V) => V.setSpan, "call", (V) => V(Y)]), X
          });
          return qXA([J, "optionalAccess", (X) => X.end, "call", (X) => X()]), qXA([I, "optionalAccess", (X) => X.setSpan, "call", (X) => X(Y)]), W
        }
      })
    }
  }
  yG1.__initStatic();
  Gr2.GraphQL = yG1
})
// @from(Start 12676377, End 12679903)
Jr2 = z((Yr2) => {
  var {
    _optionalChain: MY0
  } = i0();
  Object.defineProperty(Yr2, "__esModule", {
    value: !0
  });
  var $C = i0(),
    xG1 = $$(),
    oV3 = tn();
  class vG1 {
    static __initStatic() {
      this.id = "Apollo"
    }
    constructor(A = {
      useNestjs: !1
    }) {
      this.name = vG1.id, this._useNest = !!A.useNestjs
    }
    loadDependency() {
      if (this._useNest) this._module = this._module || $C.loadModule("@nestjs/graphql");
      else this._module = this._module || $C.loadModule("apollo-server-core");
      return this._module
    }
    setupOnce(A, Q) {
      if (oV3.shouldDisableAutoInstrumentation(Q)) {
        xG1.DEBUG_BUILD && $C.logger.log("Apollo Integration is skipped because of instrumenter configuration.");
        return
      }
      if (this._useNest) {
        let B = this.loadDependency();
        if (!B) {
          xG1.DEBUG_BUILD && $C.logger.error("Apollo-NestJS Integration was unable to require @nestjs/graphql package.");
          return
        }
        $C.fill(B.GraphQLFactory.prototype, "mergeWithSchema", function(G) {
          return function(...Z) {
            return $C.fill(this.resolversExplorerService, "explore", function(I) {
              return function() {
                let Y = $C.arrayify(I.call(this));
                return Ir2(Y, Q)
              }
            }), G.call(this, ...Z)
          }
        })
      } else {
        let B = this.loadDependency();
        if (!B) {
          xG1.DEBUG_BUILD && $C.logger.error("Apollo Integration was unable to require apollo-server-core package.");
          return
        }
        $C.fill(B.ApolloServerBase.prototype, "constructSchema", function(G) {
          return function() {
            if (!this.config.resolvers) {
              if (xG1.DEBUG_BUILD) {
                if (this.config.schema) $C.logger.warn("Apollo integration is not able to trace `ApolloServer` instances constructed via `schema` property.If you are using NestJS with Apollo, please use `Sentry.Integrations.Apollo({ useNestjs: true })` instead."), $C.logger.warn();
                else if (this.config.modules) $C.logger.warn("Apollo integration is not able to trace `ApolloServer` instances constructed via `modules` property.");
                $C.logger.error("Skipping tracing as no resolvers found on the `ApolloServer` instance.")
              }
              return G.call(this)
            }
            let Z = $C.arrayify(this.config.resolvers);
            return this.config.resolvers = Ir2(Z, Q), G.call(this)
          }
        })
      }
    }
  }
  vG1.__initStatic();

  function Ir2(A, Q) {
    return A.map((B) => {
      return Object.keys(B).forEach((G) => {
        Object.keys(B[G]).forEach((Z) => {
          if (typeof B[G][Z] !== "function") return;
          tV3(B, G, Z, Q)
        })
      }), B
    })
  }

  function tV3(A, Q, B, G) {
    $C.fill(A[Q], B, function(Z) {
      return function(...I) {
        let J = G().getScope().getSpan(),
          W = MY0([J, "optionalAccess", (V) => V.startChild, "call", (V) => V({
            description: `${Q}.${B}`,
            op: "graphql.resolve",
            origin: "auto.graphql.apollo"
          })]),
          X = Z.call(this, ...I);
        if ($C.isThenable(X)) return X.then((V) => {
          return MY0([W, "optionalAccess", (F) => F.end, "call", (F) => F()]), V
        });
        return MY0([W, "optionalAccess", (V) => V.end, "call", (V) => V()]), X
      }
    })
  }
  Yr2.Apollo = vG1
})
// @from(Start 12679909, End 12680679)
Xr2 = z((Wr2, Aa) => {
  Object.defineProperty(Wr2, "__esModule", {
    value: !0
  });
  var AQA = i0(),
    AF3 = [() => {
      return new(AQA.dynamicRequire(Aa, "./apollo")).Apollo
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./apollo")).Apollo({
        useNestjs: !0
      })
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./graphql")).GraphQL
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./mongo")).Mongo
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./mongo")).Mongo({
        mongoose: !0
      })
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./mysql")).Mysql
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./postgres")).Postgres
    }];
  Wr2.lazyLoadedNodePerformanceMonitoringIntegrations = AF3
})
// @from(Start 12680685, End 12680833)
pq = z((Vr2) => {
  Object.defineProperty(Vr2, "__esModule", {
    value: !0
  });
  var BF3 = i0(),
    GF3 = BF3.GLOBAL_OBJ;
  Vr2.WINDOW = GF3
})
// @from(Start 12680839, End 12681692)
RY0 = z((Hr2) => {
  Object.defineProperty(Hr2, "__esModule", {
    value: !0
  });
  var Fr2 = _4(),
    Kr2 = i0(),
    Dr2 = $$(),
    OY0 = pq();

  function IF3() {
    if (OY0.WINDOW.document) OY0.WINDOW.document.addEventListener("visibilitychange", () => {
      let A = Fr2.getActiveTransaction();
      if (OY0.WINDOW.document.hidden && A) {
        let {
          op: B,
          status: G
        } = Fr2.spanToJSON(A);
        if (Dr2.DEBUG_BUILD && Kr2.logger.log(`[Tracing] Transaction: cancelled -> since tab moved to the background, op: ${B}`), !G) A.setStatus("cancelled");
        A.setTag("visibilitychange", "document.hidden"), A.end()
      }
    });
    else Dr2.DEBUG_BUILD && Kr2.logger.warn("[Tracing] Could not set up background tab detection due to lack of global document")
  }
  Hr2.registerBackgroundTabDetection = IF3
})
// @from(Start 12681698, End 12682035)
NXA = z((Cr2) => {
  Object.defineProperty(Cr2, "__esModule", {
    value: !0
  });
  var JF3 = (A, Q, B) => {
    let G, Z;
    return (I) => {
      if (Q.value >= 0) {
        if (I || B) {
          if (Z = Q.value - (G || 0), Z || G === void 0) G = Q.value, Q.delta = Z, A(Q)
        }
      }
    }
  };
  Cr2.bindReporter = JF3
})
// @from(Start 12682041, End 12682268)
zr2 = z((Er2) => {
  Object.defineProperty(Er2, "__esModule", {
    value: !0
  });
  var XF3 = () => {
    return `v3-${Date.now()}-${Math.floor(Math.random()*8999999999999)+1000000000000}`
  };
  Er2.generateUniqueID = XF3
})
// @from(Start 12682274, End 12683144)
jPA = z((Ur2) => {
  Object.defineProperty(Ur2, "__esModule", {
    value: !0
  });
  var PPA = pq(),
    FF3 = () => {
      let A = PPA.WINDOW.performance.timing,
        Q = PPA.WINDOW.performance.navigation.type,
        B = {
          entryType: "navigation",
          startTime: 0,
          type: Q == 2 ? "back_forward" : Q === 1 ? "reload" : "navigate"
        };
      for (let G in A)
        if (G !== "navigationStart" && G !== "toJSON") B[G] = Math.max(A[G] - A.navigationStart, 0);
      return B
    },
    KF3 = () => {
      if (PPA.WINDOW.__WEB_VITALS_POLYFILL__) return PPA.WINDOW.performance && (performance.getEntriesByType && performance.getEntriesByType("navigation")[0] || FF3());
      else return PPA.WINDOW.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0]
    };
  Ur2.getNavigationEntry = KF3
})
// @from(Start 12683150, End 12683392)
bG1 = z(($r2) => {
  Object.defineProperty($r2, "__esModule", {
    value: !0
  });
  var HF3 = jPA(),
    CF3 = () => {
      let A = HF3.getNavigationEntry();
      return A && A.activationStart || 0
    };
  $r2.getActivationStart = CF3
})
// @from(Start 12683398, End 12684049)
LXA = z((qr2) => {
  Object.defineProperty(qr2, "__esModule", {
    value: !0
  });
  var wr2 = pq(),
    zF3 = zr2(),
    UF3 = bG1(),
    $F3 = jPA(),
    wF3 = (A, Q) => {
      let B = $F3.getNavigationEntry(),
        G = "navigate";
      if (B)
        if (wr2.WINDOW.document && wr2.WINDOW.document.prerendering || UF3.getActivationStart() > 0) G = "prerender";
        else G = B.type.replace(/_/g, "-");
      return {
        name: A,
        value: typeof Q > "u" ? -1 : Q,
        rating: "good",
        delta: 0,
        entries: [],
        id: zF3.generateUniqueID(),
        navigationType: G
      }
    };
  qr2.initMetric = wF3
})
// @from(Start 12684055, End 12684502)
QQA = z((Nr2) => {
  Object.defineProperty(Nr2, "__esModule", {
    value: !0
  });
  var NF3 = (A, Q, B) => {
    try {
      if (PerformanceObserver.supportedEntryTypes.includes(A)) {
        let G = new PerformanceObserver((Z) => {
          Q(Z.getEntries())
        });
        return G.observe(Object.assign({
          type: A,
          buffered: !0
        }, B || {})), G
      }
    } catch (G) {}
    return
  };
  Nr2.observe = NF3
})
// @from(Start 12684508, End 12685015)
MXA = z((Mr2) => {
  Object.defineProperty(Mr2, "__esModule", {
    value: !0
  });
  var Lr2 = pq(),
    MF3 = (A, Q) => {
      let B = (G) => {
        if (G.type === "pagehide" || Lr2.WINDOW.document.visibilityState === "hidden") {
          if (A(G), Q) removeEventListener("visibilitychange", B, !0), removeEventListener("pagehide", B, !0)
        }
      };
      if (Lr2.WINDOW.document) addEventListener("visibilitychange", B, !0), addEventListener("pagehide", B, !0)
    };
  Mr2.onHidden = MF3
})
// @from(Start 12685021, End 12686015)
Rr2 = z((Or2) => {
  Object.defineProperty(Or2, "__esModule", {
    value: !0
  });
  var RF3 = NXA(),
    TF3 = LXA(),
    PF3 = QQA(),
    jF3 = MXA(),
    SF3 = (A, Q = {}) => {
      let B = TF3.initMetric("CLS", 0),
        G, Z = 0,
        I = [],
        Y = (W) => {
          W.forEach((X) => {
            if (!X.hadRecentInput) {
              let V = I[0],
                F = I[I.length - 1];
              if (Z && I.length !== 0 && X.startTime - F.startTime < 1000 && X.startTime - V.startTime < 5000) Z += X.value, I.push(X);
              else Z = X.value, I = [X];
              if (Z > B.value) {
                if (B.value = Z, B.entries = I, G) G()
              }
            }
          })
        },
        J = PF3.observe("layout-shift", Y);
      if (J) {
        G = RF3.bindReporter(A, B, Q.reportAllChanges);
        let W = () => {
          Y(J.takeRecords()), G(!0)
        };
        return jF3.onHidden(W), W
      }
      return
    };
  Or2.onCLS = SF3
})
// @from(Start 12686021, End 12686643)
gG1 = z((Tr2) => {
  Object.defineProperty(Tr2, "__esModule", {
    value: !0
  });
  var fG1 = pq(),
    kF3 = MXA(),
    hG1 = -1,
    yF3 = () => {
      if (fG1.WINDOW.document && fG1.WINDOW.document.visibilityState) hG1 = fG1.WINDOW.document.visibilityState === "hidden" && !fG1.WINDOW.document.prerendering ? 0 : 1 / 0
    },
    xF3 = () => {
      kF3.onHidden(({
        timeStamp: A
      }) => {
        hG1 = A
      }, !0)
    },
    vF3 = () => {
      if (hG1 < 0) yF3(), xF3();
      return {
        get firstHiddenTime() {
          return hG1
        }
      }
    };
  Tr2.getVisibilityWatcher = vF3
})
// @from(Start 12686649, End 12687309)
jr2 = z((Pr2) => {
  Object.defineProperty(Pr2, "__esModule", {
    value: !0
  });
  var fF3 = NXA(),
    hF3 = gG1(),
    gF3 = LXA(),
    uF3 = QQA(),
    mF3 = MXA(),
    dF3 = (A) => {
      let Q = hF3.getVisibilityWatcher(),
        B = gF3.initMetric("FID"),
        G, Z = (J) => {
          if (J.startTime < Q.firstHiddenTime) B.value = J.processingStart - J.startTime, B.entries.push(J), G(!0)
        },
        I = (J) => {
          J.forEach(Z)
        },
        Y = uF3.observe("first-input", I);
      if (G = fF3.bindReporter(A, B), Y) mF3.onHidden(() => {
        I(Y.takeRecords()), Y.disconnect()
      }, !0)
    };
  Pr2.onFID = dF3
})
// @from(Start 12687315, End 12688035)
kr2 = z((_r2) => {
  Object.defineProperty(_r2, "__esModule", {
    value: !0
  });
  var pF3 = QQA(),
    Sr2 = 0,
    TY0 = 1 / 0,
    uG1 = 0,
    lF3 = (A) => {
      A.forEach((Q) => {
        if (Q.interactionId) TY0 = Math.min(TY0, Q.interactionId), uG1 = Math.max(uG1, Q.interactionId), Sr2 = uG1 ? (uG1 - TY0) / 7 + 1 : 0
      })
    },
    PY0, iF3 = () => {
      return PY0 ? Sr2 : performance.interactionCount || 0
    },
    nF3 = () => {
      if ("interactionCount" in performance || PY0) return;
      PY0 = pF3.observe("event", lF3, {
        type: "event",
        buffered: !0,
        durationThreshold: 0
      })
    };
  _r2.getInteractionCount = iF3;
  _r2.initInteractionCountPolyfill = nF3
})
// @from(Start 12688041, End 12689993)
hr2 = z((fr2) => {
  Object.defineProperty(fr2, "__esModule", {
    value: !0
  });
  var rF3 = NXA(),
    oF3 = LXA(),
    tF3 = QQA(),
    eF3 = MXA(),
    vr2 = kr2(),
    br2 = () => {
      return vr2.getInteractionCount()
    },
    yr2 = 10,
    zg = [],
    jY0 = {},
    xr2 = (A) => {
      let Q = zg[zg.length - 1],
        B = jY0[A.interactionId];
      if (B || zg.length < yr2 || A.duration > Q.latency) {
        if (B) B.entries.push(A), B.latency = Math.max(B.latency, A.duration);
        else {
          let G = {
            id: A.interactionId,
            latency: A.duration,
            entries: [A]
          };
          jY0[G.id] = G, zg.push(G)
        }
        zg.sort((G, Z) => Z.latency - G.latency), zg.splice(yr2).forEach((G) => {
          delete jY0[G.id]
        })
      }
    },
    AK3 = () => {
      let A = Math.min(zg.length - 1, Math.floor(br2() / 50));
      return zg[A]
    },
    QK3 = (A, Q) => {
      Q = Q || {}, vr2.initInteractionCountPolyfill();
      let B = oF3.initMetric("INP"),
        G, Z = (Y) => {
          Y.forEach((W) => {
            if (W.interactionId) xr2(W);
            if (W.entryType === "first-input") {
              if (!zg.some((V) => {
                  return V.entries.some((F) => {
                    return W.duration === F.duration && W.startTime === F.startTime
                  })
                })) xr2(W)
            }
          });
          let J = AK3();
          if (J && J.latency !== B.value) B.value = J.latency, B.entries = J.entries, G()
        },
        I = tF3.observe("event", Z, {
          durationThreshold: Q.durationThreshold || 40
        });
      if (G = rF3.bindReporter(A, B, Q.reportAllChanges), I) I.observe({
        type: "first-input",
        buffered: !0
      }), eF3.onHidden(() => {
        if (Z(I.takeRecords()), B.value < 0 && br2() > 0) B.value = 0, B.entries = [];
        G(!0)
      })
    };
  fr2.onINP = QK3
})
// @from(Start 12689999, End 12691041)
mr2 = z((ur2) => {
  Object.defineProperty(ur2, "__esModule", {
    value: !0
  });
  var GK3 = pq(),
    ZK3 = NXA(),
    IK3 = bG1(),
    YK3 = gG1(),
    JK3 = LXA(),
    WK3 = QQA(),
    XK3 = MXA(),
    gr2 = {},
    VK3 = (A) => {
      let Q = YK3.getVisibilityWatcher(),
        B = JK3.initMetric("LCP"),
        G, Z = (Y) => {
          let J = Y[Y.length - 1];
          if (J) {
            let W = Math.max(J.startTime - IK3.getActivationStart(), 0);
            if (W < Q.firstHiddenTime) B.value = W, B.entries = [J], G()
          }
        },
        I = WK3.observe("largest-contentful-paint", Z);
      if (I) {
        G = ZK3.bindReporter(A, B);
        let Y = () => {
          if (!gr2[B.id]) Z(I.takeRecords()), I.disconnect(), gr2[B.id] = !0, G(!0)
        };
        return ["keydown", "click"].forEach((J) => {
          if (GK3.WINDOW.document) addEventListener(J, Y, {
            once: !0,
            capture: !0
          })
        }), XK3.onHidden(Y, !0), Y
      }
      return
    };
  ur2.onLCP = VK3
})
// @from(Start 12691047, End 12691944)
cr2 = z((dr2) => {
  Object.defineProperty(dr2, "__esModule", {
    value: !0
  });
  var SY0 = pq(),
    KK3 = NXA(),
    DK3 = bG1(),
    HK3 = jPA(),
    CK3 = LXA(),
    _Y0 = (A) => {
      if (!SY0.WINDOW.document) return;
      if (SY0.WINDOW.document.prerendering) addEventListener("prerenderingchange", () => _Y0(A), !0);
      else if (SY0.WINDOW.document.readyState !== "complete") addEventListener("load", () => _Y0(A), !0);
      else setTimeout(A, 0)
    },
    EK3 = (A, Q) => {
      Q = Q || {};
      let B = CK3.initMetric("TTFB"),
        G = KK3.bindReporter(A, B, Q.reportAllChanges);
      _Y0(() => {
        let Z = HK3.getNavigationEntry();
        if (Z) {
          if (B.value = Math.max(Z.responseStart - DK3.getActivationStart(), 0), B.value < 0 || B.value > performance.now()) return;
          B.entries = [Z], G(!0)
        }
      })
    };
  dr2.onTTFB = EK3
})
// @from(Start 12691950, End 12694421)
RXA = z((tr2) => {
  Object.defineProperty(tr2, "__esModule", {
    value: !0
  });
  var pr2 = i0(),
    UK3 = $$(),
    $K3 = Rr2(),
    wK3 = jr2(),
    qK3 = hr2(),
    NK3 = mr2(),
    LK3 = QQA(),
    MK3 = cr2(),
    SPA = {},
    mG1 = {},
    lr2, ir2, nr2, ar2, sr2;

  function OK3(A, Q = !1) {
    return _PA("cls", A, _K3, lr2, Q)
  }

  function RK3(A, Q = !1) {
    return _PA("lcp", A, yK3, nr2, Q)
  }

  function TK3(A) {
    return _PA("ttfb", A, xK3, ar2)
  }

  function PK3(A) {
    return _PA("fid", A, kK3, ir2)
  }

  function jK3(A) {
    return _PA("inp", A, vK3, sr2)
  }

  function SK3(A, Q) {
    if (rr2(A, Q), !mG1[A]) bK3(A), mG1[A] = !0;
    return or2(A, Q)
  }

  function OXA(A, Q) {
    let B = SPA[A];
    if (!B || !B.length) return;
    for (let G of B) try {
      G(Q)
    } catch (Z) {
      UK3.DEBUG_BUILD && pr2.logger.error(`Error while triggering instrumentation handler.
Type: ${A}
Name: ${pr2.getFunctionName(G)}
Error:`, Z)
    }
  }

  function _K3() {
    return $K3.onCLS((A) => {
      OXA("cls", {
        metric: A
      }), lr2 = A
    }, {
      reportAllChanges: !0
    })
  }

  function kK3() {
    return wK3.onFID((A) => {
      OXA("fid", {
        metric: A
      }), ir2 = A
    })
  }

  function yK3() {
    return NK3.onLCP((A) => {
      OXA("lcp", {
        metric: A
      }), nr2 = A
    })
  }

  function xK3() {
    return MK3.onTTFB((A) => {
      OXA("ttfb", {
        metric: A
      }), ar2 = A
    })
  }

  function vK3() {
    return qK3.onINP((A) => {
      OXA("inp", {
        metric: A
      }), sr2 = A
    })
  }

  function _PA(A, Q, B, G, Z = !1) {
    rr2(A, Q);
    let I;
    if (!mG1[A]) I = B(), mG1[A] = !0;
    if (G) Q({
      metric: G
    });
    return or2(A, Q, Z ? I : void 0)
  }

  function bK3(A) {
    let Q = {};
    if (A === "event") Q.durationThreshold = 0;
    LK3.observe(A, (B) => {
      OXA(A, {
        entries: B
      })
    }, Q)
  }

  function rr2(A, Q) {
    SPA[A] = SPA[A] || [], SPA[A].push(Q)
  }

  function or2(A, Q, B) {
    return () => {
      if (B) B();
      let G = SPA[A];
      if (!G) return;
      let Z = G.indexOf(Q);
      if (Z !== -1) G.splice(Z, 1)
    }
  }
  tr2.addClsInstrumentationHandler = OK3;
  tr2.addFidInstrumentationHandler = PK3;
  tr2.addInpInstrumentationHandler = jK3;
  tr2.addLcpInstrumentationHandler = RK3;
  tr2.addPerformanceInstrumentationHandler = SK3;
  tr2.addTtfbInstrumentationHandler = TK3
})
// @from(Start 12694427, End 12694832)
Ao2 = z((er2) => {
  Object.defineProperty(er2, "__esModule", {
    value: !0
  });

  function cK3(A) {
    return typeof A === "number" && isFinite(A)
  }

  function pK3(A, {
    startTimestamp: Q,
    ...B
  }) {
    if (Q && A.startTimestamp > Q) A.startTimestamp = Q;
    return A.startChild({
      startTimestamp: Q,
      ...B
    })
  }
  er2._startChild = pK3;
  er2.isMeasurementValue = cK3
})
// @from(Start 12694838, End 12708099)
xY0 = z((Io2) => {
  Object.defineProperty(Io2, "__esModule", {
    value: !0
  });
  var Ug = _4(),
    $Z = i0(),
    lq = $$(),
    BQA = RXA(),
    $g = pq(),
    nK3 = gG1(),
    wg = Ao2(),
    aK3 = jPA(),
    sK3 = 2147483647;

  function rV(A) {
    return A / 1000
  }

  function yY0() {
    return $g.WINDOW && $g.WINDOW.addEventListener && $g.WINDOW.performance
  }
  var Qo2 = 0,
    lJ = {},
    ay, kPA;

  function rK3() {
    let A = yY0();
    if (A && $Z.browserPerformanceTimeOrigin) {
      if (A.mark) $g.WINDOW.performance.mark("sentry-tracing-init");
      let Q = BD3(),
        B = AD3(),
        G = QD3(),
        Z = GD3();
      return () => {
        Q(), B(), G(), Z()
      }
    }
    return () => {
      return
    }
  }

  function oK3() {
    BQA.addPerformanceInstrumentationHandler("longtask", ({
      entries: A
    }) => {
      for (let Q of A) {
        let B = Ug.getActiveTransaction();
        if (!B) return;
        let G = rV($Z.browserPerformanceTimeOrigin + Q.startTime),
          Z = rV(Q.duration);
        B.startChild({
          description: "Main UI thread blocked",
          op: "ui.long-task",
          origin: "auto.ui.browser.metrics",
          startTimestamp: G,
          endTimestamp: G + Z
        })
      }
    })
  }

  function tK3() {
    BQA.addPerformanceInstrumentationHandler("event", ({
      entries: A
    }) => {
      for (let Q of A) {
        let B = Ug.getActiveTransaction();
        if (!B) return;
        if (Q.name === "click") {
          let G = rV($Z.browserPerformanceTimeOrigin + Q.startTime),
            Z = rV(Q.duration),
            I = {
              description: $Z.htmlTreeAsString(Q.target),
              op: `ui.interaction.${Q.name}`,
              origin: "auto.ui.browser.metrics",
              startTimestamp: G,
              endTimestamp: G + Z
            },
            Y = $Z.getComponentName(Q.target);
          if (Y) I.attributes = {
            "ui.component_name": Y
          };
          B.startChild(I)
        }
      }
    })
  }

  function eK3(A, Q) {
    if (yY0() && $Z.browserPerformanceTimeOrigin) {
      let G = ZD3(A, Q);
      return () => {
        G()
      }
    }
    return () => {
      return
    }
  }

  function AD3() {
    return BQA.addClsInstrumentationHandler(({
      metric: A
    }) => {
      let Q = A.entries[A.entries.length - 1];
      if (!Q) return;
      lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding CLS"), lJ.cls = {
        value: A.value,
        unit: ""
      }, kPA = Q
    }, !0)
  }

  function QD3() {
    return BQA.addLcpInstrumentationHandler(({
      metric: A
    }) => {
      let Q = A.entries[A.entries.length - 1];
      if (!Q) return;
      lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding LCP"), lJ.lcp = {
        value: A.value,
        unit: "millisecond"
      }, ay = Q
    }, !0)
  }

  function BD3() {
    return BQA.addFidInstrumentationHandler(({
      metric: A
    }) => {
      let Q = A.entries[A.entries.length - 1];
      if (!Q) return;
      let B = rV($Z.browserPerformanceTimeOrigin),
        G = rV(Q.startTime);
      lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding FID"), lJ.fid = {
        value: A.value,
        unit: "millisecond"
      }, lJ["mark.fid"] = {
        value: B + G,
        unit: "second"
      }
    })
  }

  function GD3() {
    return BQA.addTtfbInstrumentationHandler(({
      metric: A
    }) => {
      if (!A.entries[A.entries.length - 1]) return;
      lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding TTFB"), lJ.ttfb = {
        value: A.value,
        unit: "millisecond"
      }
    })
  }
  var Bo2 = {
    click: "click",
    pointerdown: "click",
    pointerup: "click",
    mousedown: "click",
    mouseup: "click",
    touchstart: "click",
    touchend: "click",
    mouseover: "hover",
    mouseout: "hover",
    mouseenter: "hover",
    mouseleave: "hover",
    pointerover: "hover",
    pointerout: "hover",
    pointerenter: "hover",
    pointerleave: "hover",
    dragstart: "drag",
    dragend: "drag",
    drag: "drag",
    dragenter: "drag",
    dragleave: "drag",
    dragover: "drag",
    drop: "drag",
    keydown: "press",
    keyup: "press",
    keypress: "press",
    input: "press"
  };

  function ZD3(A, Q) {
    return BQA.addInpInstrumentationHandler(({
      metric: B
    }) => {
      if (B.value === void 0) return;
      let G = B.entries.find((w) => w.duration === B.value && Bo2[w.name] !== void 0),
        Z = Ug.getClient();
      if (!G || !Z) return;
      let I = Bo2[G.name],
        Y = Z.getOptions(),
        J = rV($Z.browserPerformanceTimeOrigin + G.startTime),
        W = rV(B.value),
        X = G.interactionId !== void 0 ? A[G.interactionId] : void 0;
      if (X === void 0) return;
      let {
        routeName: V,
        parentContext: F,
        activeTransaction: K,
        user: D,
        replayId: H
      } = X, C = D !== void 0 ? D.email || D.id || D.ip_address : void 0, E = K !== void 0 ? K.getProfileId() : void 0, U = new Ug.Span({
        startTimestamp: J,
        endTimestamp: J + W,
        op: `ui.interaction.${I}`,
        name: $Z.htmlTreeAsString(G.target),
        attributes: {
          release: Y.release,
          environment: Y.environment,
          transaction: V,
          ...C !== void 0 && C !== "" ? {
            user: C
          } : {},
          ...E !== void 0 ? {
            profile_id: E
          } : {},
          ...H !== void 0 ? {
            replay_id: H
          } : {}
        },
        exclusiveTime: B.value,
        measurements: {
          inp: {
            value: B.value,
            unit: "millisecond"
          }
        }
      }), q = FD3(F, Y, Q);
      if (!q) return;
      if (Math.random() < q) {
        let w = U ? Ug.createSpanEnvelope([U], Z.getDsn()) : void 0,
          N = Z && Z.getTransport();
        if (N && w) N.send(w).then(null, (R) => {
          lq.DEBUG_BUILD && $Z.logger.error("Error while sending interaction:", R)
        });
        return
      }
    })
  }

  function ID3(A) {
    let Q = yY0();
    if (!Q || !$g.WINDOW.performance.getEntries || !$Z.browserPerformanceTimeOrigin) return;
    lq.DEBUG_BUILD && $Z.logger.log("[Tracing] Adding & adjusting spans using Performance API");
    let B = rV($Z.browserPerformanceTimeOrigin),
      G = Q.getEntries(),
      {
        op: Z,
        start_timestamp: I
      } = Ug.spanToJSON(A);
    if (G.slice(Qo2).forEach((Y) => {
        let J = rV(Y.startTime),
          W = rV(Y.duration);
        if (A.op === "navigation" && I && B + J < I) return;
        switch (Y.entryType) {
          case "navigation": {
            YD3(A, Y, B);
            break
          }
          case "mark":
          case "paint":
          case "measure": {
            Go2(A, Y, J, W, B);
            let X = nK3.getVisibilityWatcher(),
              V = Y.startTime < X.firstHiddenTime;
            if (Y.name === "first-paint" && V) lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding FP"), lJ.fp = {
              value: Y.startTime,
              unit: "millisecond"
            };
            if (Y.name === "first-contentful-paint" && V) lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding FCP"), lJ.fcp = {
              value: Y.startTime,
              unit: "millisecond"
            };
            break
          }
          case "resource": {
            Zo2(A, Y, Y.name, J, W, B);
            break
          }
        }
      }), Qo2 = Math.max(G.length - 1, 0), WD3(A), Z === "pageload") {
      VD3(lJ), ["fcp", "fp", "lcp"].forEach((J) => {
        if (!lJ[J] || !I || B >= I) return;
        let W = lJ[J].value,
          X = B + rV(W),
          V = Math.abs((X - I) * 1000),
          F = V - W;
        lq.DEBUG_BUILD && $Z.logger.log(`[Measurements] Normalized ${J} from ${W} to ${V} (${F})`), lJ[J].value = V
      });
      let Y = lJ["mark.fid"];
      if (Y && lJ.fid) wg._startChild(A, {
        description: "first input delay",
        endTimestamp: Y.value + rV(lJ.fid.value),
        op: "ui.action",
        origin: "auto.ui.browser.metrics",
        startTimestamp: Y.value
      }), delete lJ["mark.fid"];
      if (!("fcp" in lJ)) delete lJ.cls;
      Object.keys(lJ).forEach((J) => {
        Ug.setMeasurement(J, lJ[J].value, lJ[J].unit)
      }), XD3(A)
    }
    ay = void 0, kPA = void 0, lJ = {}
  }

  function Go2(A, Q, B, G, Z) {
    let I = Z + B,
      Y = I + G;
    return wg._startChild(A, {
      description: Q.name,
      endTimestamp: Y,
      op: Q.entryType,
      origin: "auto.resource.browser.metrics",
      startTimestamp: I
    }), I
  }

  function YD3(A, Q, B) {
    ["unloadEvent", "redirect", "domContentLoadedEvent", "loadEvent", "connect"].forEach((G) => {
      dG1(A, Q, G, B)
    }), dG1(A, Q, "secureConnection", B, "TLS/SSL", "connectEnd"), dG1(A, Q, "fetch", B, "cache", "domainLookupStart"), dG1(A, Q, "domainLookup", B, "DNS"), JD3(A, Q, B)
  }

  function dG1(A, Q, B, G, Z, I) {
    let Y = I ? Q[I] : Q[`${B}End`],
      J = Q[`${B}Start`];
    if (!J || !Y) return;
    wg._startChild(A, {
      op: "browser",
      origin: "auto.browser.browser.metrics",
      description: Z || B,
      startTimestamp: G + rV(J),
      endTimestamp: G + rV(Y)
    })
  }

  function JD3(A, Q, B) {
    if (Q.responseEnd) wg._startChild(A, {
      op: "browser",
      origin: "auto.browser.browser.metrics",
      description: "request",
      startTimestamp: B + rV(Q.requestStart),
      endTimestamp: B + rV(Q.responseEnd)
    }), wg._startChild(A, {
      op: "browser",
      origin: "auto.browser.browser.metrics",
      description: "response",
      startTimestamp: B + rV(Q.responseStart),
      endTimestamp: B + rV(Q.responseEnd)
    })
  }

  function Zo2(A, Q, B, G, Z, I) {
    if (Q.initiatorType === "xmlhttprequest" || Q.initiatorType === "fetch") return;
    let Y = $Z.parseUrl(B),
      J = {};
    if (kY0(J, Q, "transferSize", "http.response_transfer_size"), kY0(J, Q, "encodedBodySize", "http.response_content_length"), kY0(J, Q, "decodedBodySize", "http.decoded_response_content_length"), "renderBlockingStatus" in Q) J["resource.render_blocking_status"] = Q.renderBlockingStatus;
    if (Y.protocol) J["url.scheme"] = Y.protocol.split(":").pop();
    if (Y.host) J["server.address"] = Y.host;
    J["url.same_origin"] = B.includes($g.WINDOW.location.origin);
    let W = I + G,
      X = W + Z;
    wg._startChild(A, {
      description: B.replace($g.WINDOW.location.origin, ""),
      endTimestamp: X,
      op: Q.initiatorType ? `resource.${Q.initiatorType}` : "resource.other",
      origin: "auto.resource.browser.metrics",
      startTimestamp: W,
      data: J
    })
  }

  function WD3(A) {
    let Q = $g.WINDOW.navigator;
    if (!Q) return;
    let B = Q.connection;
    if (B) {
      if (B.effectiveType) A.setTag("effectiveConnectionType", B.effectiveType);
      if (B.type) A.setTag("connectionType", B.type);
      if (wg.isMeasurementValue(B.rtt)) lJ["connection.rtt"] = {
        value: B.rtt,
        unit: "millisecond"
      }
    }
    if (wg.isMeasurementValue(Q.deviceMemory)) A.setTag("deviceMemory", `${Q.deviceMemory} GB`);
    if (wg.isMeasurementValue(Q.hardwareConcurrency)) A.setTag("hardwareConcurrency", String(Q.hardwareConcurrency))
  }

  function XD3(A) {
    if (ay) {
      if (lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding LCP Data"), ay.element) A.setTag("lcp.element", $Z.htmlTreeAsString(ay.element));
      if (ay.id) A.setTag("lcp.id", ay.id);
      if (ay.url) A.setTag("lcp.url", ay.url.trim().slice(0, 200));
      A.setTag("lcp.size", ay.size)
    }
    if (kPA && kPA.sources) lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding CLS Data"), kPA.sources.forEach((Q, B) => A.setTag(`cls.source.${B+1}`, $Z.htmlTreeAsString(Q.node)))
  }

  function kY0(A, Q, B, G) {
    let Z = Q[B];
    if (Z != null && Z < sK3) A[G] = Z
  }

  function VD3(A) {
    let Q = aK3.getNavigationEntry();
    if (!Q) return;
    let {
      responseStart: B,
      requestStart: G
    } = Q;
    if (G <= B) lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding TTFB Request Time"), A["ttfb.requestTime"] = {
      value: B - G,
      unit: "millisecond"
    }
  }

  function FD3(A, Q, B) {
    if (!Ug.hasTracingEnabled(Q)) return !1;
    let G;
    if (A !== void 0 && typeof Q.tracesSampler === "function") G = Q.tracesSampler({
      transactionContext: A,
      name: A.name,
      parentSampled: A.parentSampled,
      attributes: {
        ...A.data,
        ...A.attributes
      },
      location: $g.WINDOW.location
    });
    else if (A !== void 0 && A.sampled !== void 0) G = A.sampled;
    else if (typeof Q.tracesSampleRate < "u") G = Q.tracesSampleRate;
    else G = 1;
    if (!Ug.isValidSampleRate(G)) return lq.DEBUG_BUILD && $Z.logger.warn("[Tracing] Discarding interaction span because of invalid sample rate."), !1;
    if (G === !0) return B;
    else if (G === !1) return 0;
    return G * B
  }
  Io2._addMeasureSpans = Go2;
  Io2._addResourceSpans = Zo2;
  Io2.addPerformanceEntries = ID3;
  Io2.startTrackingINP = eK3;
  Io2.startTrackingInteractions = tK3;
  Io2.startTrackingLongTasks = oK3;
  Io2.startTrackingWebVitals = rK3
})
// @from(Start 12708105, End 12711215)
vY0 = z((Jo2) => {
  Object.defineProperty(Jo2, "__esModule", {
    value: !0
  });
  var sy = _4(),
    GQA = i0();

  function $D3(A, Q, B, G, Z = "auto.http.browser") {
    if (!sy.hasTracingEnabled() || !A.fetchData) return;
    let I = Q(A.fetchData.url);
    if (A.endTimestamp && I) {
      let D = A.fetchData.__span;
      if (!D) return;
      let H = G[D];
      if (H) qD3(H, A), delete G[D];
      return
    }
    let Y = sy.getCurrentScope(),
      J = sy.getClient(),
      {
        method: W,
        url: X
      } = A.fetchData,
      V = wD3(X),
      F = V ? GQA.parseUrl(V).host : void 0,
      K = I ? sy.startInactiveSpan({
        name: `${W} ${X}`,
        onlyIfParent: !0,
        attributes: {
          url: X,
          type: "fetch",
          "http.method": W,
          "http.url": V,
          "server.address": F,
          [sy.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: Z
        },
        op: "http.client"
      }) : void 0;
    if (K) A.fetchData.__span = K.spanContext().spanId, G[K.spanContext().spanId] = K;
    if (B(A.fetchData.url) && J) {
      let D = A.args[0];
      A.args[1] = A.args[1] || {};
      let H = A.args[1];
      H.headers = Yo2(D, J, Y, H, K)
    }
    return K
  }

  function Yo2(A, Q, B, G, Z) {
    let I = Z || B.getSpan(),
      Y = sy.getIsolationScope(),
      {
        traceId: J,
        spanId: W,
        sampled: X,
        dsc: V
      } = {
        ...Y.getPropagationContext(),
        ...B.getPropagationContext()
      },
      F = I ? sy.spanToTraceHeader(I) : GQA.generateSentryTraceHeader(J, W, X),
      K = GQA.dynamicSamplingContextToSentryBaggageHeader(V || (I ? sy.getDynamicSamplingContextFromSpan(I) : sy.getDynamicSamplingContextFromClient(J, Q, B))),
      D = G.headers || (typeof Request < "u" && GQA.isInstanceOf(A, Request) ? A.headers : void 0);
    if (!D) return {
      "sentry-trace": F,
      baggage: K
    };
    else if (typeof Headers < "u" && GQA.isInstanceOf(D, Headers)) {
      let H = new Headers(D);
      if (H.append("sentry-trace", F), K) H.append(GQA.BAGGAGE_HEADER_NAME, K);
      return H
    } else if (Array.isArray(D)) {
      let H = [...D, ["sentry-trace", F]];
      if (K) H.push([GQA.BAGGAGE_HEADER_NAME, K]);
      return H
    } else {
      let H = "baggage" in D ? D.baggage : void 0,
        C = [];
      if (Array.isArray(H)) C.push(...H);
      else if (H) C.push(H);
      if (K) C.push(K);
      return {
        ...D,
        "sentry-trace": F,
        baggage: C.length > 0 ? C.join(",") : void 0
      }
    }
  }

  function wD3(A) {
    try {
      return new URL(A).href
    } catch (Q) {
      return
    }
  }

  function qD3(A, Q) {
    if (Q.response) {
      sy.setHttpStatus(A, Q.response.status);
      let B = Q.response && Q.response.headers && Q.response.headers.get("content-length");
      if (B) {
        let G = parseInt(B);
        if (G > 0) A.setAttribute("http.response_content_length", G)
      }
    } else if (Q.error) A.setStatus("internal_error");
    A.end()
  }
  Jo2.addTracingHeadersToFetchRequest = Yo2;
  Jo2.instrumentFetchRequest = $D3
})
// @from(Start 12711221, End 12716494)
pG1 = z((Do2) => {
  Object.defineProperty(Do2, "__esModule", {
    value: !0
  });
  var iP = _4(),
    nP = i0(),
    MD3 = vY0(),
    OD3 = RXA(),
    RD3 = pq(),
    cG1 = ["localhost", /^\/(?!\/)/],
    bY0 = {
      traceFetch: !0,
      traceXHR: !0,
      enableHTTPTimings: !0,
      tracingOrigins: cG1,
      tracePropagationTargets: cG1
    };

  function TD3(A) {
    let {
      traceFetch: Q,
      traceXHR: B,
      tracePropagationTargets: G,
      tracingOrigins: Z,
      shouldCreateSpanForRequest: I,
      enableHTTPTimings: Y
    } = {
      traceFetch: bY0.traceFetch,
      traceXHR: bY0.traceXHR,
      ...A
    }, J = typeof I === "function" ? I : (V) => !0, W = (V) => Vo2(V, G || Z), X = {};
    if (Q) nP.addFetchInstrumentationHandler((V) => {
      let F = MD3.instrumentFetchRequest(V, J, W, X);
      if (F) {
        let K = Ko2(V.fetchData.url),
          D = K ? nP.parseUrl(K).host : void 0;
        F.setAttributes({
          "http.url": K,
          "server.address": D
        })
      }
      if (Y && F) Wo2(F)
    });
    if (B) nP.addXhrInstrumentationHandler((V) => {
      let F = Fo2(V, J, W, X);
      if (Y && F) Wo2(F)
    })
  }

  function PD3(A) {
    return A.entryType === "resource" && "initiatorType" in A && typeof A.nextHopProtocol === "string" && (A.initiatorType === "fetch" || A.initiatorType === "xmlhttprequest")
  }

  function Wo2(A) {
    let {
      url: Q
    } = iP.spanToJSON(A).data || {};
    if (!Q || typeof Q !== "string") return;
    let B = OD3.addPerformanceInstrumentationHandler("resource", ({
      entries: G
    }) => {
      G.forEach((Z) => {
        if (PD3(Z) && Z.name.endsWith(Q)) jD3(Z).forEach((Y) => A.setAttribute(...Y)), setTimeout(B)
      })
    })
  }

  function Xo2(A) {
    let Q = "unknown",
      B = "unknown",
      G = "";
    for (let Z of A) {
      if (Z === "/") {
        [Q, B] = A.split("/");
        break
      }
      if (!isNaN(Number(Z))) {
        Q = G === "h" ? "http" : G, B = A.split(G)[1];
        break
      }
      G += Z
    }
    if (G === A) Q = G;
    return {
      name: Q,
      version: B
    }
  }

  function ry(A = 0) {
    return ((nP.browserPerformanceTimeOrigin || performance.timeOrigin) + A) / 1000
  }

  function jD3(A) {
    let {
      name: Q,
      version: B
    } = Xo2(A.nextHopProtocol), G = [];
    if (G.push(["network.protocol.version", B], ["network.protocol.name", Q]), !nP.browserPerformanceTimeOrigin) return G;
    return [...G, ["http.request.redirect_start", ry(A.redirectStart)],
      ["http.request.fetch_start", ry(A.fetchStart)],
      ["http.request.domain_lookup_start", ry(A.domainLookupStart)],
      ["http.request.domain_lookup_end", ry(A.domainLookupEnd)],
      ["http.request.connect_start", ry(A.connectStart)],
      ["http.request.secure_connection_start", ry(A.secureConnectionStart)],
      ["http.request.connection_end", ry(A.connectEnd)],
      ["http.request.request_start", ry(A.requestStart)],
      ["http.request.response_start", ry(A.responseStart)],
      ["http.request.response_end", ry(A.responseEnd)]
    ]
  }

  function Vo2(A, Q) {
    return nP.stringMatchesSomePattern(A, Q || cG1)
  }

  function Fo2(A, Q, B, G) {
    let Z = A.xhr,
      I = Z && Z[nP.SENTRY_XHR_DATA_KEY];
    if (!iP.hasTracingEnabled() || !Z || Z.__sentry_own_request__ || !I) return;
    let Y = Q(I.url);
    if (A.endTimestamp && Y) {
      let D = Z.__sentry_xhr_span_id__;
      if (!D) return;
      let H = G[D];
      if (H && I.status_code !== void 0) iP.setHttpStatus(H, I.status_code), H.end(), delete G[D];
      return
    }
    let J = iP.getCurrentScope(),
      W = iP.getIsolationScope(),
      X = Ko2(I.url),
      V = X ? nP.parseUrl(X).host : void 0,
      F = Y ? iP.startInactiveSpan({
        name: `${I.method} ${I.url}`,
        onlyIfParent: !0,
        attributes: {
          type: "xhr",
          "http.method": I.method,
          "http.url": X,
          url: I.url,
          "server.address": V,
          [iP.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.http.browser"
        },
        op: "http.client"
      }) : void 0;
    if (F) Z.__sentry_xhr_span_id__ = F.spanContext().spanId, G[Z.__sentry_xhr_span_id__] = F;
    let K = iP.getClient();
    if (Z.setRequestHeader && B(I.url) && K) {
      let {
        traceId: D,
        spanId: H,
        sampled: C,
        dsc: E
      } = {
        ...W.getPropagationContext(),
        ...J.getPropagationContext()
      }, U = F ? iP.spanToTraceHeader(F) : nP.generateSentryTraceHeader(D, H, C), q = nP.dynamicSamplingContextToSentryBaggageHeader(E || (F ? iP.getDynamicSamplingContextFromSpan(F) : iP.getDynamicSamplingContextFromClient(D, K, J)));
      SD3(Z, U, q)
    }
    return F
  }

  function SD3(A, Q, B) {
    try {
      if (A.setRequestHeader("sentry-trace", Q), B) A.setRequestHeader(nP.BAGGAGE_HEADER_NAME, B)
    } catch (G) {}
  }

  function Ko2(A) {
    try {
      return new URL(A, RD3.WINDOW.location.origin).href
    } catch (Q) {
      return
    }
  }
  Do2.DEFAULT_TRACE_PROPAGATION_TARGETS = cG1;
  Do2.defaultRequestInstrumentationOptions = bY0;
  Do2.extractNetworkProtocol = Xo2;
  Do2.instrumentOutgoingRequests = TD3;
  Do2.shouldAttachHeaders = Vo2;
  Do2.xhrCallback = Fo2
})
// @from(Start 12716500, End 12717791)
Eo2 = z((Co2) => {
  Object.defineProperty(Co2, "__esModule", {
    value: !0
  });
  var yPA = i0(),
    Ho2 = $$(),
    xPA = pq();

  function fD3(A, Q = !0, B = !0) {
    if (!xPA.WINDOW || !xPA.WINDOW.location) {
      Ho2.DEBUG_BUILD && yPA.logger.warn("Could not initialize routing instrumentation due to invalid location");
      return
    }
    let G = xPA.WINDOW.location.href,
      Z;
    if (Q) Z = A({
      name: xPA.WINDOW.location.pathname,
      startTimestamp: yPA.browserPerformanceTimeOrigin ? yPA.browserPerformanceTimeOrigin / 1000 : void 0,
      op: "pageload",
      origin: "auto.pageload.browser",
      metadata: {
        source: "url"
      }
    });
    if (B) yPA.addHistoryInstrumentationHandler(({
      to: I,
      from: Y
    }) => {
      if (Y === void 0 && G && G.indexOf(I) !== -1) {
        G = void 0;
        return
      }
      if (Y !== I) {
        if (G = void 0, Z) Ho2.DEBUG_BUILD && yPA.logger.log(`[Tracing] Finishing current transaction with op: ${Z.op}`), Z.end();
        Z = A({
          name: xPA.WINDOW.location.pathname,
          op: "navigation",
          origin: "auto.navigation.browser",
          metadata: {
            source: "url"
          }
        })
      }
    })
  }
  Co2.instrumentRoutingWithDefaults = fD3
})
// @from(Start 12717797, End 12727388)
Lo2 = z((No2) => {
  Object.defineProperty(No2, "__esModule", {
    value: !0
  });
  var aP = _4(),
    qg = i0(),
    Qa = $$(),
    gD3 = RY0(),
    zo2 = RXA(),
    vPA = xY0(),
    $o2 = pG1(),
    uD3 = Eo2(),
    ZQA = pq(),
    wo2 = "BrowserTracing",
    mD3 = {
      ...aP.TRACING_DEFAULTS,
      markBackgroundTransactions: !0,
      routingInstrumentation: uD3.instrumentRoutingWithDefaults,
      startTransactionOnLocationChange: !0,
      startTransactionOnPageLoad: !0,
      enableLongTask: !0,
      enableInp: !1,
      interactionsSampleRate: 1,
      _experiments: {},
      ...$o2.defaultRequestInstrumentationOptions
    },
    Uo2 = 10;
  class qo2 {
    constructor(A) {
      if (this.name = wo2, this._hasSetTracePropagationTargets = !1, aP.addTracingExtensions(), Qa.DEBUG_BUILD) this._hasSetTracePropagationTargets = !!(A && (A.tracePropagationTargets || A.tracingOrigins));
      if (this.options = {
          ...mD3,
          ...A
        }, this.options._experiments.enableLongTask !== void 0) this.options.enableLongTask = this.options._experiments.enableLongTask;
      if (A && !A.tracePropagationTargets && A.tracingOrigins) this.options.tracePropagationTargets = A.tracingOrigins;
      if (this._collectWebVitals = vPA.startTrackingWebVitals(), this._interactionIdToRouteNameMapping = {}, this.options.enableInp) vPA.startTrackingINP(this._interactionIdToRouteNameMapping, this.options.interactionsSampleRate);
      if (this.options.enableLongTask) vPA.startTrackingLongTasks();
      if (this.options._experiments.enableInteractions) vPA.startTrackingInteractions();
      this._latestRoute = {
        name: void 0,
        context: void 0
      }
    }
    setupOnce(A, Q) {
      this._getCurrentHub = Q;
      let G = Q().getClient(),
        Z = G && G.getOptions(),
        {
          routingInstrumentation: I,
          startTransactionOnLocationChange: Y,
          startTransactionOnPageLoad: J,
          markBackgroundTransactions: W,
          traceFetch: X,
          traceXHR: V,
          shouldCreateSpanForRequest: F,
          enableHTTPTimings: K,
          _experiments: D
        } = this.options,
        H = Z && Z.tracePropagationTargets,
        C = H || this.options.tracePropagationTargets;
      if (Qa.DEBUG_BUILD && this._hasSetTracePropagationTargets && H) qg.logger.warn("[Tracing] The `tracePropagationTargets` option was set in the BrowserTracing integration and top level `Sentry.init`. The top level `Sentry.init` value is being used.");
      if (I((E) => {
          let U = this._createRouteTransaction(E);
          return this.options._experiments.onStartRouteTransaction && this.options._experiments.onStartRouteTransaction(U, E, Q), U
        }, J, Y), W) gD3.registerBackgroundTabDetection();
      if (D.enableInteractions) this._registerInteractionListener();
      if (this.options.enableInp) this._registerInpInteractionListener();
      $o2.instrumentOutgoingRequests({
        traceFetch: X,
        traceXHR: V,
        tracePropagationTargets: C,
        shouldCreateSpanForRequest: F,
        enableHTTPTimings: K
      })
    }
    _createRouteTransaction(A) {
      if (!this._getCurrentHub) {
        Qa.DEBUG_BUILD && qg.logger.warn(`[Tracing] Did not create ${A.op} transaction because _getCurrentHub is invalid.`);
        return
      }
      let Q = this._getCurrentHub(),
        {
          beforeNavigate: B,
          idleTimeout: G,
          finalTimeout: Z,
          heartbeatInterval: I
        } = this.options,
        Y = A.op === "pageload",
        J;
      if (Y) {
        let K = Y ? fY0("sentry-trace") : "",
          D = Y ? fY0("baggage") : void 0,
          {
            traceId: H,
            dsc: C,
            parentSpanId: E,
            sampled: U
          } = qg.propagationContextFromHeaders(K, D);
        J = {
          traceId: H,
          parentSpanId: E,
          parentSampled: U,
          ...A,
          metadata: {
            ...A.metadata,
            dynamicSamplingContext: C
          },
          trimEnd: !0
        }
      } else J = {
        trimEnd: !0,
        ...A
      };
      let W = typeof B === "function" ? B(J) : J,
        X = W === void 0 ? {
          ...J,
          sampled: !1
        } : W;
      if (X.metadata = X.name !== J.name ? {
          ...X.metadata,
          source: "custom"
        } : X.metadata, this._latestRoute.name = X.name, this._latestRoute.context = X, X.sampled === !1) Qa.DEBUG_BUILD && qg.logger.log(`[Tracing] Will not send ${X.op} transaction because of beforeNavigate.`);
      Qa.DEBUG_BUILD && qg.logger.log(`[Tracing] Starting ${X.op} transaction on scope`);
      let {
        location: V
      } = ZQA.WINDOW, F = aP.startIdleTransaction(Q, X, G, Z, !0, {
        location: V
      }, I, Y);
      if (Y) {
        if (ZQA.WINDOW.document) {
          if (ZQA.WINDOW.document.addEventListener("readystatechange", () => {
              if (["interactive", "complete"].includes(ZQA.WINDOW.document.readyState)) F.sendAutoFinishSignal()
            }), ["interactive", "complete"].includes(ZQA.WINDOW.document.readyState)) F.sendAutoFinishSignal()
        }
      }
      return F.registerBeforeFinishCallback((K) => {
        this._collectWebVitals(), vPA.addPerformanceEntries(K)
      }), F
    }
    _registerInteractionListener() {
      let A, Q = () => {
        let {
          idleTimeout: B,
          finalTimeout: G,
          heartbeatInterval: Z
        } = this.options, I = "ui.action.click", Y = aP.getActiveTransaction();
        if (Y && Y.op && ["navigation", "pageload"].includes(Y.op)) {
          Qa.DEBUG_BUILD && qg.logger.warn("[Tracing] Did not create ui.action.click transaction because a pageload or navigation transaction is in progress.");
          return
        }
        if (A) A.setFinishReason("interactionInterrupted"), A.end(), A = void 0;
        if (!this._getCurrentHub) {
          Qa.DEBUG_BUILD && qg.logger.warn("[Tracing] Did not create ui.action.click transaction because _getCurrentHub is invalid.");
          return
        }
        if (!this._latestRoute.name) {
          Qa.DEBUG_BUILD && qg.logger.warn("[Tracing] Did not create ui.action.click transaction because _latestRouteName is missing.");
          return
        }
        let J = this._getCurrentHub(),
          {
            location: W
          } = ZQA.WINDOW,
          X = {
            name: this._latestRoute.name,
            op: "ui.action.click",
            trimEnd: !0,
            data: {
              [aP.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: this._latestRoute.context ? dD3(this._latestRoute.context) : "url"
            }
          };
        A = aP.startIdleTransaction(J, X, B, G, !0, {
          location: W
        }, Z)
      };
      ["click"].forEach((B) => {
        if (ZQA.WINDOW.document) addEventListener(B, Q, {
          once: !1,
          capture: !0
        })
      })
    }
    _registerInpInteractionListener() {
      let A = ({
        entries: Q
      }) => {
        let B = aP.getClient(),
          G = B !== void 0 && B.getIntegrationByName !== void 0 ? B.getIntegrationByName("Replay") : void 0,
          Z = G !== void 0 ? G.getReplayId() : void 0,
          I = aP.getActiveTransaction(),
          Y = aP.getCurrentScope(),
          J = Y !== void 0 ? Y.getUser() : void 0;
        Q.forEach((W) => {
          if (cD3(W)) {
            let X = W.interactionId;
            if (X === void 0) return;
            let V = this._interactionIdToRouteNameMapping[X],
              F = W.duration,
              K = W.startTime,
              D = Object.keys(this._interactionIdToRouteNameMapping),
              H = D.length > 0 ? D.reduce((C, E) => {
                return this._interactionIdToRouteNameMapping[C].duration < this._interactionIdToRouteNameMapping[E].duration ? C : E
              }) : void 0;
            if (W.entryType === "first-input") {
              if (D.map((E) => this._interactionIdToRouteNameMapping[E]).some((E) => {
                  return E.duration === F && E.startTime === K
                })) return
            }
            if (!X) return;
            if (V) V.duration = Math.max(V.duration, F);
            else if (D.length < Uo2 || H === void 0 || F > this._interactionIdToRouteNameMapping[H].duration) {
              let C = this._latestRoute.name,
                E = this._latestRoute.context;
              if (C && E) {
                if (H && Object.keys(this._interactionIdToRouteNameMapping).length >= Uo2) delete this._interactionIdToRouteNameMapping[H];
                this._interactionIdToRouteNameMapping[X] = {
                  routeName: C,
                  duration: F,
                  parentContext: E,
                  user: J,
                  activeTransaction: I,
                  replayId: Z,
                  startTime: K
                }
              }
            }
          }
        })
      };
      zo2.addPerformanceInstrumentationHandler("event", A), zo2.addPerformanceInstrumentationHandler("first-input", A)
    }
  }

  function fY0(A) {
    let Q = qg.getDomElement(`meta[name=${A}]`);
    return Q ? Q.getAttribute("content") : void 0
  }

  function dD3(A) {
    let Q = A.attributes && A.attributes[aP.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      B = A.data && A.data[aP.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      G = A.metadata && A.metadata.source;
    return Q || B || G
  }

  function cD3(A) {
    return "duration" in A
  }
  No2.BROWSER_TRACING_INTEGRATION_ID = wo2;
  No2.BrowserTracing = qo2;
  No2.getMetaContent = fY0
})
// @from(Start 12727394, End 12737215)
_o2 = z((So2) => {
  Object.defineProperty(So2, "__esModule", {
    value: !0
  });
  var pW = _4(),
    SO = i0(),
    Ba = $$(),
    nD3 = RY0(),
    Mo2 = RXA(),
    bPA = xY0(),
    Ro2 = pG1(),
    iq = pq(),
    To2 = "BrowserTracing",
    aD3 = {
      ...pW.TRACING_DEFAULTS,
      instrumentNavigation: !0,
      instrumentPageLoad: !0,
      markBackgroundSpan: !0,
      enableLongTask: !0,
      enableInp: !1,
      interactionsSampleRate: 1,
      _experiments: {},
      ...Ro2.defaultRequestInstrumentationOptions
    },
    sD3 = (A = {}) => {
      let Q = Ba.DEBUG_BUILD ? !!(A.tracePropagationTargets || A.tracingOrigins) : !1;
      if (pW.addTracingExtensions(), !A.tracePropagationTargets && A.tracingOrigins) A.tracePropagationTargets = A.tracingOrigins;
      let B = {
          ...aD3,
          ...A
        },
        G = bPA.startTrackingWebVitals(),
        Z = {};
      if (B.enableInp) bPA.startTrackingINP(Z, B.interactionsSampleRate);
      if (B.enableLongTask) bPA.startTrackingLongTasks();
      if (B._experiments.enableInteractions) bPA.startTrackingInteractions();
      let I = {
        name: void 0,
        context: void 0
      };

      function Y(J) {
        let W = pW.getCurrentHub(),
          {
            beforeStartSpan: X,
            idleTimeout: V,
            finalTimeout: F,
            heartbeatInterval: K
          } = B,
          D = J.op === "pageload",
          H;
        if (D) {
          let q = D ? hY0("sentry-trace") : "",
            w = D ? hY0("baggage") : void 0,
            {
              traceId: N,
              dsc: R,
              parentSpanId: T,
              sampled: y
            } = SO.propagationContextFromHeaders(q, w);
          H = {
            traceId: N,
            parentSpanId: T,
            parentSampled: y,
            ...J,
            metadata: {
              ...J.metadata,
              dynamicSamplingContext: R
            },
            trimEnd: !0
          }
        } else H = {
          trimEnd: !0,
          ...J
        };
        let C = X ? X(H) : H;
        if (C.metadata = C.name !== H.name ? {
            ...C.metadata,
            source: "custom"
          } : C.metadata, I.name = C.name, I.context = C, C.sampled === !1) Ba.DEBUG_BUILD && SO.logger.log(`[Tracing] Will not send ${C.op} transaction because of beforeNavigate.`);
        Ba.DEBUG_BUILD && SO.logger.log(`[Tracing] Starting ${C.op} transaction on scope`);
        let {
          location: E
        } = iq.WINDOW, U = pW.startIdleTransaction(W, C, V, F, !0, {
          location: E
        }, K, D);
        if (D && iq.WINDOW.document) {
          if (iq.WINDOW.document.addEventListener("readystatechange", () => {
              if (["interactive", "complete"].includes(iq.WINDOW.document.readyState)) U.sendAutoFinishSignal()
            }), ["interactive", "complete"].includes(iq.WINDOW.document.readyState)) U.sendAutoFinishSignal()
        }
        return U.registerBeforeFinishCallback((q) => {
          G(), bPA.addPerformanceEntries(q)
        }), U
      }
      return {
        name: To2,
        setupOnce: () => {},
        afterAllSetup(J) {
          let W = J.getOptions(),
            {
              markBackgroundSpan: X,
              traceFetch: V,
              traceXHR: F,
              shouldCreateSpanForRequest: K,
              enableHTTPTimings: D,
              _experiments: H
            } = B,
            C = W && W.tracePropagationTargets,
            E = C || B.tracePropagationTargets;
          if (Ba.DEBUG_BUILD && Q && C) SO.logger.warn("[Tracing] The `tracePropagationTargets` option was set in the BrowserTracing integration and top level `Sentry.init`. The top level `Sentry.init` value is being used.");
          let U, q = iq.WINDOW.location && iq.WINDOW.location.href;
          if (J.on) J.on("startNavigationSpan", (w) => {
            if (U) Ba.DEBUG_BUILD && SO.logger.log(`[Tracing] Finishing current transaction with op: ${pW.spanToJSON(U).op}`), U.end();
            U = Y({
              op: "navigation",
              ...w
            })
          }), J.on("startPageLoadSpan", (w) => {
            if (U) Ba.DEBUG_BUILD && SO.logger.log(`[Tracing] Finishing current transaction with op: ${pW.spanToJSON(U).op}`), U.end();
            U = Y({
              op: "pageload",
              ...w
            })
          });
          if (B.instrumentPageLoad && J.emit && iq.WINDOW.location) {
            let w = {
              name: iq.WINDOW.location.pathname,
              startTimestamp: SO.browserPerformanceTimeOrigin ? SO.browserPerformanceTimeOrigin / 1000 : void 0,
              origin: "auto.pageload.browser",
              attributes: {
                [pW.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "url"
              }
            };
            Po2(J, w)
          }
          if (B.instrumentNavigation && J.emit && iq.WINDOW.location) SO.addHistoryInstrumentationHandler(({
            to: w,
            from: N
          }) => {
            if (N === void 0 && q && q.indexOf(w) !== -1) {
              q = void 0;
              return
            }
            if (N !== w) {
              q = void 0;
              let R = {
                name: iq.WINDOW.location.pathname,
                origin: "auto.navigation.browser",
                attributes: {
                  [pW.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "url"
                }
              };
              jo2(J, R)
            }
          });
          if (X) nD3.registerBackgroundTabDetection();
          if (H.enableInteractions) rD3(B, I);
          if (B.enableInp) tD3(Z, I);
          Ro2.instrumentOutgoingRequests({
            traceFetch: V,
            traceXHR: F,
            tracePropagationTargets: E,
            shouldCreateSpanForRequest: K,
            enableHTTPTimings: D
          })
        },
        options: B
      }
    };

  function Po2(A, Q) {
    if (!A.emit) return;
    A.emit("startPageLoadSpan", Q);
    let B = pW.getActiveSpan();
    return (B && pW.spanToJSON(B).op) === "pageload" ? B : void 0
  }

  function jo2(A, Q) {
    if (!A.emit) return;
    A.emit("startNavigationSpan", Q);
    let B = pW.getActiveSpan();
    return (B && pW.spanToJSON(B).op) === "navigation" ? B : void 0
  }

  function hY0(A) {
    let Q = SO.getDomElement(`meta[name=${A}]`);
    return Q ? Q.getAttribute("content") : void 0
  }

  function rD3(A, Q) {
    let B, G = () => {
      let {
        idleTimeout: Z,
        finalTimeout: I,
        heartbeatInterval: Y
      } = A, J = "ui.action.click", W = pW.getActiveTransaction();
      if (W && W.op && ["navigation", "pageload"].includes(W.op)) {
        Ba.DEBUG_BUILD && SO.logger.warn("[Tracing] Did not create ui.action.click transaction because a pageload or navigation transaction is in progress.");
        return
      }
      if (B) B.setFinishReason("interactionInterrupted"), B.end(), B = void 0;
      if (!Q.name) {
        Ba.DEBUG_BUILD && SO.logger.warn("[Tracing] Did not create ui.action.click transaction because _latestRouteName is missing.");
        return
      }
      let {
        location: X
      } = iq.WINDOW, V = {
        name: Q.name,
        op: "ui.action.click",
        trimEnd: !0,
        data: {
          [pW.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: Q.context ? eD3(Q.context) : "url"
        }
      };
      B = pW.startIdleTransaction(pW.getCurrentHub(), V, Z, I, !0, {
        location: X
      }, Y)
    };
    ["click"].forEach((Z) => {
      if (iq.WINDOW.document) addEventListener(Z, G, {
        once: !1,
        capture: !0
      })
    })
  }

  function oD3(A) {
    return "duration" in A
  }
  var Oo2 = 10;

  function tD3(A, Q) {
    let B = ({
      entries: G
    }) => {
      let Z = pW.getClient(),
        I = Z !== void 0 && Z.getIntegrationByName !== void 0 ? Z.getIntegrationByName("Replay") : void 0,
        Y = I !== void 0 ? I.getReplayId() : void 0,
        J = pW.getActiveTransaction(),
        W = pW.getCurrentScope(),
        X = W !== void 0 ? W.getUser() : void 0;
      G.forEach((V) => {
        if (oD3(V)) {
          let F = V.interactionId;
          if (F === void 0) return;
          let K = A[F],
            D = V.duration,
            H = V.startTime,
            C = Object.keys(A),
            E = C.length > 0 ? C.reduce((U, q) => {
              return A[U].duration < A[q].duration ? U : q
            }) : void 0;
          if (V.entryType === "first-input") {
            if (C.map((q) => A[q]).some((q) => {
                return q.duration === D && q.startTime === H
              })) return
          }
          if (!F) return;
          if (K) K.duration = Math.max(K.duration, D);
          else if (C.length < Oo2 || E === void 0 || D > A[E].duration) {
            let {
              name: U,
              context: q
            } = Q;
            if (U && q) {
              if (E && Object.keys(A).length >= Oo2) delete A[E];
              A[F] = {
                routeName: U,
                duration: D,
                parentContext: q,
                user: X,
                activeTransaction: J,
                replayId: Y,
                startTime: H
              }
            }
          }
        }
      })
    };
    Mo2.addPerformanceInstrumentationHandler("event", B), Mo2.addPerformanceInstrumentationHandler("first-input", B)
  }

  function eD3(A) {
    let Q = A.attributes && A.attributes[pW.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      B = A.data && A.data[pW.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      G = A.metadata && A.metadata.source;
    return Q || B || G
  }
  So2.BROWSER_TRACING_INTEGRATION_ID = To2;
  So2.browserTracingIntegration = sD3;
  So2.getMetaContent = hY0;
  So2.startBrowserTracingNavigationSpan = jo2;
  So2.startBrowserTracingPageLoadSpan = Po2
})
// @from(Start 12737221, End 12738300)
xo2 = z((yo2, fPA) => {
  Object.defineProperty(yo2, "__esModule", {
    value: !0
  });
  var ko2 = _4(),
    TXA = i0();

  function IH3() {
    let A = ko2.getMainCarrier();
    if (!A.__SENTRY__) return;
    let Q = {
        mongodb() {
          return new(TXA.dynamicRequire(fPA, "./node/integrations/mongo")).Mongo
        },
        mongoose() {
          return new(TXA.dynamicRequire(fPA, "./node/integrations/mongo")).Mongo
        },
        mysql() {
          return new(TXA.dynamicRequire(fPA, "./node/integrations/mysql")).Mysql
        },
        pg() {
          return new(TXA.dynamicRequire(fPA, "./node/integrations/postgres")).Postgres
        }
      },
      B = Object.keys(Q).filter((G) => !!TXA.loadModule(G)).map((G) => {
        try {
          return Q[G]()
        } catch (Z) {
          return
        }
      }).filter((G) => G);
    if (B.length > 0) A.__SENTRY__.integrations = [...A.__SENTRY__.integrations || [], ...B]
  }

  function YH3() {
    if (ko2.addTracingExtensions(), TXA.isNodeEnv()) IH3()
  }
  yo2.addExtensionMethods = YH3
})
// @from(Start 12738306, End 12740470)
uY0 = z((go2) => {
  Object.defineProperty(go2, "__esModule", {
    value: !0
  });
  var Ng = _4(),
    vo2 = i0(),
    WH3 = ls2(),
    XH3 = ns2(),
    VH3 = ss2(),
    FH3 = ts2(),
    KH3 = Qr2(),
    DH3 = Zr2(),
    HH3 = Jr2(),
    CH3 = Xr2(),
    bo2 = Lo2(),
    gY0 = _o2(),
    fo2 = pG1(),
    lG1 = RXA(),
    ho2 = vY0(),
    EH3 = xo2();
  go2.IdleTransaction = Ng.IdleTransaction;
  go2.Span = Ng.Span;
  go2.SpanStatus = Ng.SpanStatus;
  go2.Transaction = Ng.Transaction;
  go2.extractTraceparentData = Ng.extractTraceparentData;
  go2.getActiveTransaction = Ng.getActiveTransaction;
  go2.hasTracingEnabled = Ng.hasTracingEnabled;
  go2.spanStatusfromHttpCode = Ng.spanStatusfromHttpCode;
  go2.startIdleTransaction = Ng.startIdleTransaction;
  go2.TRACEPARENT_REGEXP = vo2.TRACEPARENT_REGEXP;
  go2.stripUrlQueryAndFragment = vo2.stripUrlQueryAndFragment;
  go2.Express = WH3.Express;
  go2.Postgres = XH3.Postgres;
  go2.Mysql = VH3.Mysql;
  go2.Mongo = FH3.Mongo;
  go2.Prisma = KH3.Prisma;
  go2.GraphQL = DH3.GraphQL;
  go2.Apollo = HH3.Apollo;
  go2.lazyLoadedNodePerformanceMonitoringIntegrations = CH3.lazyLoadedNodePerformanceMonitoringIntegrations;
  go2.BROWSER_TRACING_INTEGRATION_ID = bo2.BROWSER_TRACING_INTEGRATION_ID;
  go2.BrowserTracing = bo2.BrowserTracing;
  go2.browserTracingIntegration = gY0.browserTracingIntegration;
  go2.startBrowserTracingNavigationSpan = gY0.startBrowserTracingNavigationSpan;
  go2.startBrowserTracingPageLoadSpan = gY0.startBrowserTracingPageLoadSpan;
  go2.defaultRequestInstrumentationOptions = fo2.defaultRequestInstrumentationOptions;
  go2.instrumentOutgoingRequests = fo2.instrumentOutgoingRequests;
  go2.addClsInstrumentationHandler = lG1.addClsInstrumentationHandler;
  go2.addFidInstrumentationHandler = lG1.addFidInstrumentationHandler;
  go2.addLcpInstrumentationHandler = lG1.addLcpInstrumentationHandler;
  go2.addPerformanceInstrumentationHandler = lG1.addPerformanceInstrumentationHandler;
  go2.addTracingHeadersToFetchRequest = ho2.addTracingHeadersToFetchRequest;
  go2.instrumentFetchRequest = ho2.instrumentFetchRequest;
  go2.addExtensionMethods = EH3.addExtensionMethods
})
// @from(Start 12740476, End 12741025)
mo2 = z((uo2) => {
  Object.defineProperty(uo2, "__esModule", {
    value: !0
  });
  var rH3 = uY0(),
    oH3 = i0();

  function tH3() {
    let A = rH3.lazyLoadedNodePerformanceMonitoringIntegrations.map((Q) => {
      try {
        return Q()
      } catch (B) {
        return
      }
    }).filter((Q) => !!Q);
    if (A.length === 0) oH3.logger.warn("Performance monitoring integrations could not be automatically loaded.");
    return A.filter((Q) => !!Q.loadDependency())
  }
  uo2.autoDiscoverNodePerformanceMonitoringIntegrations = tH3
})
// @from(Start 12741031, End 12741681)
mY0 = z((po2) => {
  Object.defineProperty(po2, "__esModule", {
    value: !0
  });
  var AC3 = UA("os"),
    QC3 = UA("util"),
    do2 = _4();
  class co2 extends do2.ServerRuntimeClient {
    constructor(A) {
      do2.applySdkMetadata(A, "node"), A.transportOptions = {
        textEncoder: new QC3.TextEncoder,
        ...A.transportOptions
      };
      let Q = {
        ...A,
        platform: "node",
        runtime: {
          name: "node",
          version: global.process.version
        },
        serverName: A.serverName || global.process.env.SENTRY_NAME || AC3.hostname()
      };
      super(Q)
    }
  }
  po2.NodeClient = co2
})
// @from(Start 12741687, End 12743326)
so2 = z((ao2) => {
  var {
    _nullishCoalesce: lo2
  } = i0();
  Object.defineProperty(ao2, "__esModule", {
    value: !0
  });
  var io2 = UA("http");
  UA("https");
  var oy = Symbol("AgentBaseInternalState");
  class no2 extends io2.Agent {
    constructor(A) {
      super(A);
      this[oy] = {}
    }
    isSecureEndpoint(A) {
      if (A) {
        if (typeof A.secureEndpoint === "boolean") return A.secureEndpoint;
        if (typeof A.protocol === "string") return A.protocol === "https:"
      }
      let {
        stack: Q
      } = Error();
      if (typeof Q !== "string") return !1;
      return Q.split(`
`).some((B) => B.indexOf("(https.js:") !== -1 || B.indexOf("node:https:") !== -1)
    }
    createSocket(A, Q, B) {
      let G = {
        ...Q,
        secureEndpoint: this.isSecureEndpoint(Q)
      };
      Promise.resolve().then(() => this.connect(A, G)).then((Z) => {
        if (Z instanceof io2.Agent) return Z.addRequest(A, G);
        this[oy].currentSocket = Z, super.createSocket(A, Q, B)
      }, B)
    }
    createConnection() {
      let A = this[oy].currentSocket;
      if (this[oy].currentSocket = void 0, !A) throw Error("No socket was returned in the `connect()` function");
      return A
    }
    get defaultPort() {
      return lo2(this[oy].defaultPort, () => this.protocol === "https:" ? 443 : 80)
    }
    set defaultPort(A) {
      if (this[oy]) this[oy].defaultPort = A
    }
    get protocol() {
      return lo2(this[oy].protocol, () => this.isSecureEndpoint() ? "https:" : "http:")
    }
    set protocol(A) {
      if (this[oy]) this[oy].protocol = A
    }
  }
  ao2.Agent = no2
})
// @from(Start 12743332, End 12745341)
oo2 = z((ro2) => {
  Object.defineProperty(ro2, "__esModule", {
    value: !0
  });
  var ZC3 = i0();

  function iG1(...A) {
    ZC3.logger.log("[https-proxy-agent:parse-proxy-response]", ...A)
  }

  function IC3(A) {
    return new Promise((Q, B) => {
      let G = 0,
        Z = [];

      function I() {
        let V = A.read();
        if (V) X(V);
        else A.once("readable", I)
      }

      function Y() {
        A.removeListener("end", J), A.removeListener("error", W), A.removeListener("readable", I)
      }

      function J() {
        Y(), iG1("onend"), B(Error("Proxy connection ended before receiving CONNECT response"))
      }

      function W(V) {
        Y(), iG1("onerror %o", V), B(V)
      }

      function X(V) {
        Z.push(V), G += V.length;
        let F = Buffer.concat(Z, G),
          K = F.indexOf(`\r
\r
`);
        if (K === -1) {
          iG1("have not received end of HTTP headers yet..."), I();
          return
        }
        let D = F.slice(0, K).toString("ascii").split(`\r
`),
          H = D.shift();
        if (!H) return A.destroy(), B(Error("No header received from proxy CONNECT response"));
        let C = H.split(" "),
          E = +C[1],
          U = C.slice(2).join(" "),
          q = {};
        for (let w of D) {
          if (!w) continue;
          let N = w.indexOf(":");
          if (N === -1) return A.destroy(), B(Error(`Invalid header from proxy CONNECT response: "${w}"`));
          let R = w.slice(0, N).toLowerCase(),
            T = w.slice(N + 1).trimStart(),
            y = q[R];
          if (typeof y === "string") q[R] = [y, T];
          else if (Array.isArray(y)) y.push(T);
          else q[R] = T
        }
        iG1("got proxy server response: %o %o", H, q), Y(), Q({
          connect: {
            statusCode: E,
            statusText: U,
            headers: q
          },
          buffered: F
        })
      }
      A.on("error", W), A.on("end", J), I()
    })
  }
  ro2.parseProxyResponse = IC3
})
// @from(Start 12745347, End 12748607)
Qt2 = z((At2) => {
  var {
    _nullishCoalesce: JC3,
    _optionalChain: WC3
  } = i0();
  Object.defineProperty(At2, "__esModule", {
    value: !0
  });
  var hPA = UA("net"),
    to2 = UA("tls"),
    XC3 = UA("url"),
    VC3 = i0(),
    FC3 = so2(),
    KC3 = oo2();

  function gPA(...A) {
    VC3.logger.log("[https-proxy-agent]", ...A)
  }
  class dY0 extends FC3.Agent {
    static __initStatic() {
      this.protocols = ["http", "https"]
    }
    constructor(A, Q) {
      super(Q);
      this.options = {}, this.proxy = typeof A === "string" ? new XC3.URL(A) : A, this.proxyHeaders = JC3(WC3([Q, "optionalAccess", (Z) => Z.headers]), () => ({})), gPA("Creating new HttpsProxyAgent instance: %o", this.proxy.href);
      let B = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""),
        G = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
      this.connectOpts = {
        ALPNProtocols: ["http/1.1"],
        ...Q ? eo2(Q, "headers") : null,
        host: B,
        port: G
      }
    }
    async connect(A, Q) {
      let {
        proxy: B
      } = this;
      if (!Q.host) throw TypeError('No "host" provided');
      let G;
      if (B.protocol === "https:") {
        gPA("Creating `tls.Socket`: %o", this.connectOpts);
        let F = this.connectOpts.servername || this.connectOpts.host;
        G = to2.connect({
          ...this.connectOpts,
          servername: F && hPA.isIP(F) ? void 0 : F
        })
      } else gPA("Creating `net.Socket`: %o", this.connectOpts), G = hPA.connect(this.connectOpts);
      let Z = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : {
          ...this.proxyHeaders
        },
        I = hPA.isIPv6(Q.host) ? `[${Q.host}]` : Q.host,
        Y = `CONNECT ${I}:${Q.port} HTTP/1.1\r
`;
      if (B.username || B.password) {
        let F = `${decodeURIComponent(B.username)}:${decodeURIComponent(B.password)}`;
        Z["Proxy-Authorization"] = `Basic ${Buffer.from(F).toString("base64")}`
      }
      if (Z.Host = `${I}:${Q.port}`, !Z["Proxy-Connection"]) Z["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
      for (let F of Object.keys(Z)) Y += `${F}: ${Z[F]}\r
`;
      let J = KC3.parseProxyResponse(G);
      G.write(`${Y}\r
`);
      let {
        connect: W,
        buffered: X
      } = await J;
      if (A.emit("proxyConnect", W), this.emit("proxyConnect", W, A), W.statusCode === 200) {
        if (A.once("socket", DC3), Q.secureEndpoint) {
          gPA("Upgrading socket connection to TLS");
          let F = Q.servername || Q.host;
          return to2.connect({
            ...eo2(Q, "host", "path", "port"),
            socket: G,
            servername: hPA.isIP(F) ? void 0 : F
          })
        }
        return G
      }
      G.destroy();
      let V = new hPA.Socket({
        writable: !1
      });
      return V.readable = !0, A.once("socket", (F) => {
        gPA("Replaying proxy buffer for failed request"), F.push(X), F.push(null)
      }), V
    }
  }
  dY0.__initStatic();

  function DC3(A) {
    A.resume()
  }

  function eo2(A, ...Q) {
    let B = {},
      G;
    for (G in A)
      if (!Q.includes(G)) B[G] = A[G];
    return B
  }
  At2.HttpsProxyAgent = dY0
})
// @from(Start 12748613, End 12751142)
pY0 = z((Zt2) => {
  var {
    _nullishCoalesce: cY0
  } = i0();
  Object.defineProperty(Zt2, "__esModule", {
    value: !0
  });
  var CC3 = UA("http"),
    EC3 = UA("https"),
    zC3 = UA("stream"),
    Gt2 = UA("url"),
    UC3 = UA("zlib"),
    Bt2 = _4(),
    $C3 = i0(),
    wC3 = Qt2(),
    qC3 = 32768;

  function NC3(A) {
    return new zC3.Readable({
      read() {
        this.push(A), this.push(null)
      }
    })
  }

  function LC3(A) {
    let Q;
    try {
      Q = new Gt2.URL(A.url)
    } catch (W) {
      return $C3.consoleSandbox(() => {
        console.warn("[@sentry/node]: Invalid dsn or tunnel option, will not send any events. The tunnel option must be a full URL when used.")
      }), Bt2.createTransport(A, () => Promise.resolve({}))
    }
    let B = Q.protocol === "https:",
      G = MC3(Q, A.proxy || (B ? process.env.https_proxy : void 0) || process.env.http_proxy),
      Z = B ? EC3 : CC3,
      I = A.keepAlive === void 0 ? !1 : A.keepAlive,
      Y = G ? new wC3.HttpsProxyAgent(G) : new Z.Agent({
        keepAlive: I,
        maxSockets: 30,
        timeout: 2000
      }),
      J = OC3(A, cY0(A.httpModule, () => Z), Y);
    return Bt2.createTransport(A, J)
  }

  function MC3(A, Q) {
    let {
      no_proxy: B
    } = process.env;
    if (B && B.split(",").some((Z) => A.host.endsWith(Z) || A.hostname.endsWith(Z))) return;
    else return Q
  }

  function OC3(A, Q, B) {
    let {
      hostname: G,
      pathname: Z,
      port: I,
      protocol: Y,
      search: J
    } = new Gt2.URL(A.url);
    return function(X) {
      return new Promise((V, F) => {
        let K = NC3(X.body),
          D = {
            ...A.headers
          };
        if (X.body.length > qC3) D["content-encoding"] = "gzip", K = K.pipe(UC3.createGzip());
        let H = Q.request({
          method: "POST",
          agent: B,
          headers: D,
          hostname: G,
          path: `${Z}${J}`,
          port: I,
          protocol: Y,
          ca: A.caCerts
        }, (C) => {
          C.on("data", () => {}), C.on("end", () => {}), C.setEncoding("utf8");
          let E = cY0(C.headers["retry-after"], () => null),
            U = cY0(C.headers["x-sentry-rate-limits"], () => null);
          V({
            statusCode: C.statusCode,
            headers: {
              "retry-after": E,
              "x-sentry-rate-limits": Array.isArray(U) ? U[0] : U
            }
          })
        });
        H.on("error", F), K.pipe(H)
      })
    }
  }
  Zt2.makeNodeTransport = LC3
})
// @from(Start 12751148, End 12751327)
IQA = z((It2) => {
  Object.defineProperty(It2, "__esModule", {
    value: !0
  });
  var TC3 = i0(),
    PC3 = TC3.parseSemver(process.versions.node);
  It2.NODE_VERSION = PC3
})
// @from(Start 12751333, End 12752244)
Xt2 = z((Wt2) => {
  var {
    _optionalChain: SC3
  } = i0();
  Object.defineProperty(Wt2, "__esModule", {
    value: !0
  });
  var Yt2 = UA("domain"),
    YQA = _4();

  function Jt2() {
    return Yt2.active
  }

  function _C3() {
    let A = Jt2();
    if (!A) return;
    return YQA.ensureHubOnCarrier(A), YQA.getHubFromCarrier(A)
  }

  function kC3(A) {
    let Q = {};
    return YQA.ensureHubOnCarrier(Q, A), YQA.getHubFromCarrier(Q)
  }

  function yC3(A, Q) {
    let B = Jt2();
    if (B && SC3([Q, "optionalAccess", (Y) => Y.reuseExisting])) return A();
    let G = Yt2.create(),
      Z = B ? YQA.getHubFromCarrier(B) : void 0,
      I = kC3(Z);
    return YQA.setHubOnCarrier(G, I), G.bind(() => {
      return A()
    })()
  }

  function xC3() {
    YQA.setAsyncContextStrategy({
      getCurrentHub: _C3,
      runWithAsyncContext: yC3
    })
  }
  Wt2.setDomainAsyncContextStrategy = xC3
})
// @from(Start 12752250, End 12753017)
Ft2 = z((Vt2) => {
  var {
    _optionalChain: bC3
  } = i0();
  Object.defineProperty(Vt2, "__esModule", {
    value: !0
  });
  var lY0 = _4(),
    fC3 = UA("async_hooks"),
    nG1;

  function hC3() {
    if (!nG1) nG1 = new fC3.AsyncLocalStorage;

    function A() {
      return nG1.getStore()
    }

    function Q(G) {
      let Z = {};
      return lY0.ensureHubOnCarrier(Z, G), lY0.getHubFromCarrier(Z)
    }

    function B(G, Z) {
      let I = A();
      if (I && bC3([Z, "optionalAccess", (J) => J.reuseExisting])) return G();
      let Y = Q(I);
      return nG1.run(Y, () => {
        return G()
      })
    }
    lY0.setAsyncContextStrategy({
      getCurrentHub: A,
      runWithAsyncContext: B
    })
  }
  Vt2.setHooksAsyncContextStrategy = hC3
})
// @from(Start 12753023, End 12753345)
Dt2 = z((Kt2) => {
  Object.defineProperty(Kt2, "__esModule", {
    value: !0
  });
  var uC3 = IQA(),
    mC3 = Xt2(),
    dC3 = Ft2();

  function cC3() {
    if (uC3.NODE_VERSION.major >= 14) dC3.setHooksAsyncContextStrategy();
    else mC3.setDomainAsyncContextStrategy()
  }
  Kt2.setNodeAsyncContextStrategy = cC3
})
// @from(Start 12753351, End 12754202)
sG1 = z((zt2) => {
  Object.defineProperty(zt2, "__esModule", {
    value: !0
  });
  var lC3 = UA("util"),
    aG1 = _4(),
    Ht2 = i0(),
    Ct2 = "Console",
    iC3 = () => {
      return {
        name: Ct2,
        setupOnce() {},
        setup(A) {
          Ht2.addConsoleInstrumentationHandler(({
            args: Q,
            level: B
          }) => {
            if (aG1.getClient() !== A) return;
            aG1.addBreadcrumb({
              category: "console",
              level: Ht2.severityLevelFromString(B),
              message: lC3.format.apply(void 0, Q)
            }, {
              input: [...Q],
              level: B
            })
          })
        }
      }
    },
    Et2 = aG1.defineIntegration(iC3),
    nC3 = aG1.convertIntegrationFnToClass(Ct2, Et2);
  zt2.Console = nC3;
  zt2.consoleIntegration = Et2
})
// @from(Start 12754208, End 12762078)
rG1 = z((Tt2) => {
  var {
    _optionalChain: JQA
  } = i0();
  Object.defineProperty(Tt2, "__esModule", {
    value: !0
  });
  var rC3 = UA("child_process"),
    $t2 = UA("fs"),
    _O = UA("os"),
    oC3 = UA("path"),
    wt2 = UA("util"),
    qt2 = _4(),
    Nt2 = wt2.promisify($t2.readFile),
    Lt2 = wt2.promisify($t2.readdir),
    Mt2 = "Context",
    tC3 = (A = {}) => {
      let Q, B = {
        app: !0,
        os: !0,
        device: !0,
        culture: !0,
        cloudResource: !0,
        ...A
      };
      async function G(I) {
        if (Q === void 0) Q = Z();
        let Y = AE3(await Q);
        return I.contexts = {
          ...I.contexts,
          app: {
            ...Y.app,
            ...JQA([I, "access", (J) => J.contexts, "optionalAccess", (J) => J.app])
          },
          os: {
            ...Y.os,
            ...JQA([I, "access", (J) => J.contexts, "optionalAccess", (J) => J.os])
          },
          device: {
            ...Y.device,
            ...JQA([I, "access", (J) => J.contexts, "optionalAccess", (J) => J.device])
          },
          culture: {
            ...Y.culture,
            ...JQA([I, "access", (J) => J.contexts, "optionalAccess", (J) => J.culture])
          },
          cloud_resource: {
            ...Y.cloud_resource,
            ...JQA([I, "access", (J) => J.contexts, "optionalAccess", (J) => J.cloud_resource])
          }
        }, I
      }
      async function Z() {
        let I = {};
        if (B.os) I.os = await QE3();
        if (B.app) I.app = GE3();
        if (B.device) I.device = Rt2(B.device);
        if (B.culture) {
          let Y = BE3();
          if (Y) I.culture = Y
        }
        if (B.cloudResource) I.cloud_resource = XE3();
        return I
      }
      return {
        name: Mt2,
        setupOnce() {},
        processEvent(I) {
          return G(I)
        }
      }
    },
    Ot2 = qt2.defineIntegration(tC3),
    eC3 = qt2.convertIntegrationFnToClass(Mt2, Ot2);

  function AE3(A) {
    if (JQA([A, "optionalAccess", (Q) => Q.app, "optionalAccess", (Q) => Q.app_memory])) A.app.app_memory = process.memoryUsage().rss;
    if (JQA([A, "optionalAccess", (Q) => Q.device, "optionalAccess", (Q) => Q.free_memory])) A.device.free_memory = _O.freemem();
    return A
  }
  async function QE3() {
    let A = _O.platform();
    switch (A) {
      case "darwin":
        return JE3();
      case "linux":
        return WE3();
      default:
        return {
          name: ZE3[A] || A, version: _O.release()
        }
    }
  }

  function BE3() {
    try {
      if (typeof process.versions.icu !== "string") return;
      let A = new Date(900000000);
      if (new Intl.DateTimeFormat("es", {
          month: "long"
        }).format(A) === "enero") {
        let B = Intl.DateTimeFormat().resolvedOptions();
        return {
          locale: B.locale,
          timezone: B.timeZone
        }
      }
    } catch (A) {}
    return
  }

  function GE3() {
    let A = process.memoryUsage().rss;
    return {
      app_start_time: new Date(Date.now() - process.uptime() * 1000).toISOString(),
      app_memory: A
    }
  }

  function Rt2(A) {
    let Q = {},
      B;
    try {
      B = _O.uptime && _O.uptime()
    } catch (G) {}
    if (typeof B === "number") Q.boot_time = new Date(Date.now() - B * 1000).toISOString();
    if (Q.arch = _O.arch(), A === !0 || A.memory) Q.memory_size = _O.totalmem(), Q.free_memory = _O.freemem();
    if (A === !0 || A.cpu) {
      let G = _O.cpus();
      if (G && G.length) {
        let Z = G[0];
        Q.processor_count = G.length, Q.cpu_description = Z.model, Q.processor_frequency = Z.speed
      }
    }
    return Q
  }
  var ZE3 = {
      aix: "IBM AIX",
      freebsd: "FreeBSD",
      openbsd: "OpenBSD",
      sunos: "SunOS",
      win32: "Windows"
    },
    IE3 = [{
      name: "fedora-release",
      distros: ["Fedora"]
    }, {
      name: "redhat-release",
      distros: ["Red Hat Linux", "Centos"]
    }, {
      name: "redhat_version",
      distros: ["Red Hat Linux"]
    }, {
      name: "SuSE-release",
      distros: ["SUSE Linux"]
    }, {
      name: "lsb-release",
      distros: ["Ubuntu Linux", "Arch Linux"]
    }, {
      name: "debian_version",
      distros: ["Debian"]
    }, {
      name: "debian_release",
      distros: ["Debian"]
    }, {
      name: "arch-release",
      distros: ["Arch Linux"]
    }, {
      name: "gentoo-release",
      distros: ["Gentoo Linux"]
    }, {
      name: "novell-release",
      distros: ["SUSE Linux"]
    }, {
      name: "alpine-release",
      distros: ["Alpine Linux"]
    }],
    YE3 = {
      alpine: (A) => A,
      arch: (A) => ty(/distrib_release=(.*)/, A),
      centos: (A) => ty(/release ([^ ]+)/, A),
      debian: (A) => A,
      fedora: (A) => ty(/release (..)/, A),
      mint: (A) => ty(/distrib_release=(.*)/, A),
      red: (A) => ty(/release ([^ ]+)/, A),
      suse: (A) => ty(/VERSION = (.*)\n/, A),
      ubuntu: (A) => ty(/distrib_release=(.*)/, A)
    };

  function ty(A, Q) {
    let B = A.exec(Q);
    return B ? B[1] : void 0
  }
  async function JE3() {
    let A = {
      kernel_version: _O.release(),
      name: "Mac OS X",
      version: `10.${Number(_O.release().split(".")[0])-4}`
    };
    try {
      let Q = await new Promise((B, G) => {
        rC3.execFile("/usr/bin/sw_vers", (Z, I) => {
          if (Z) {
            G(Z);
            return
          }
          B(I)
        })
      });
      A.name = ty(/^ProductName:\s+(.*)$/m, Q), A.version = ty(/^ProductVersion:\s+(.*)$/m, Q), A.build = ty(/^BuildVersion:\s+(.*)$/m, Q)
    } catch (Q) {}
    return A
  }

  function Ut2(A) {
    return A.split(" ")[0].toLowerCase()
  }
  async function WE3() {
    let A = {
      kernel_version: _O.release(),
      name: "Linux"
    };
    try {
      let Q = await Lt2("/etc"),
        B = IE3.find((J) => Q.includes(J.name));
      if (!B) return A;
      let G = oC3.join("/etc", B.name),
        Z = (await Nt2(G, {
          encoding: "utf-8"
        })).toLowerCase(),
        {
          distros: I
        } = B;
      A.name = I.find((J) => Z.indexOf(Ut2(J)) >= 0) || I[0];
      let Y = Ut2(A.name);
      A.version = YE3[Y](Z)
    } catch (Q) {}
    return A
  }

  function XE3() {
    if (process.env.VERCEL) return {
      "cloud.provider": "vercel",
      "cloud.region": process.env.VERCEL_REGION
    };
    else if (process.env.AWS_REGION) return {
      "cloud.provider": "aws",
      "cloud.region": process.env.AWS_REGION,
      "cloud.platform": process.env.AWS_EXECUTION_ENV
    };
    else if (process.env.GCP_PROJECT) return {
      "cloud.provider": "gcp"
    };
    else if (process.env.ALIYUN_REGION_ID) return {
      "cloud.provider": "alibaba_cloud",
      "cloud.region": process.env.ALIYUN_REGION_ID
    };
    else if (process.env.WEBSITE_SITE_NAME && process.env.REGION_NAME) return {
      "cloud.provider": "azure",
      "cloud.region": process.env.REGION_NAME
    };
    else if (process.env.IBM_CLOUD_REGION) return {
      "cloud.provider": "ibm_cloud",
      "cloud.region": process.env.IBM_CLOUD_REGION
    };
    else if (process.env.TENCENTCLOUD_REGION) return {
      "cloud.provider": "tencent_cloud",
      "cloud.region": process.env.TENCENTCLOUD_REGION,
      "cloud.account.id": process.env.TENCENTCLOUD_APPID,
      "cloud.availability_zone": process.env.TENCENTCLOUD_ZONE
    };
    else if (process.env.NETLIFY) return {
      "cloud.provider": "netlify"
    };
    else if (process.env.FLY_REGION) return {
      "cloud.provider": "fly.io",
      "cloud.region": process.env.FLY_REGION
    };
    else if (process.env.DYNO) return {
      "cloud.provider": "heroku"
    };
    else return
  }
  Tt2.Context = eC3;
  Tt2.getDeviceContext = Rt2;
  Tt2.nodeContextIntegration = Ot2;
  Tt2.readDirAsync = Lt2;
  Tt2.readFileAsync = Nt2
})
// @from(Start 12762084, End 12764161)
tG1 = z((kt2) => {
  var {
    _optionalChain: iY0
  } = i0();
  Object.defineProperty(kt2, "__esModule", {
    value: !0
  });
  var CE3 = UA("fs"),
    Pt2 = _4(),
    jt2 = i0(),
    oG1 = new jt2.LRUMap(100),
    EE3 = 7,
    St2 = "ContextLines";

  function zE3(A) {
    return new Promise((Q, B) => {
      CE3.readFile(A, "utf8", (G, Z) => {
        if (G) B(G);
        else Q(Z)
      })
    })
  }
  var UE3 = (A = {}) => {
      let Q = A.frameContextLines !== void 0 ? A.frameContextLines : EE3;
      return {
        name: St2,
        setupOnce() {},
        processEvent(B) {
          return wE3(B, Q)
        }
      }
    },
    _t2 = Pt2.defineIntegration(UE3),
    $E3 = Pt2.convertIntegrationFnToClass(St2, _t2);
  async function wE3(A, Q) {
    let B = {},
      G = [];
    if (Q > 0 && iY0([A, "access", (Z) => Z.exception, "optionalAccess", (Z) => Z.values]))
      for (let Z of A.exception.values) {
        if (!iY0([Z, "access", (I) => I.stacktrace, "optionalAccess", (I) => I.frames])) continue;
        for (let I = Z.stacktrace.frames.length - 1; I >= 0; I--) {
          let Y = Z.stacktrace.frames[I];
          if (Y.filename && !B[Y.filename] && !oG1.get(Y.filename)) G.push(NE3(Y.filename)), B[Y.filename] = 1
        }
      }
    if (G.length > 0) await Promise.all(G);
    if (Q > 0 && iY0([A, "access", (Z) => Z.exception, "optionalAccess", (Z) => Z.values])) {
      for (let Z of A.exception.values)
        if (Z.stacktrace && Z.stacktrace.frames) await qE3(Z.stacktrace.frames, Q)
    }
    return A
  }

  function qE3(A, Q) {
    for (let B of A)
      if (B.filename && B.context_line === void 0) {
        let G = oG1.get(B.filename);
        if (G) try {
          jt2.addContextToFrame(G, B, Q)
        } catch (Z) {}
      }
  }
  async function NE3(A) {
    let Q = oG1.get(A);
    if (Q === null) return null;
    if (Q !== void 0) return Q;
    let B = null;
    try {
      B = (await zE3(A)).split(`
`)
    } catch (G) {}
    return oG1.set(A, B), B
  }
  kt2.ContextLines = $E3;
  kt2.contextLinesIntegration = _t2
})
// @from(Start 12764167, End 12764340)
uPA = z((yt2) => {
  Object.defineProperty(yt2, "__esModule", {
    value: !0
  });
  var OE3 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
  yt2.DEBUG_BUILD = OE3
})