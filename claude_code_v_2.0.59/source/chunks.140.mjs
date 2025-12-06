
// @from(Start 13274563, End 13276714)
AI1 = z((t29) => {
  Object.defineProperty(t29, "__esModule", {
    value: !0
  });
  t29.CoreContext = t29.ContextCancelation = void 0;
  var oR3 = DW0(),
    tR3 = AW0(),
    eR3 = HW0(),
    AT3 = EW0(),
    o29 = function() {
      function A(Q) {
        var B, G, Z;
        this.retry = (B = Q.retry) !== null && B !== void 0 ? B : !0, this.type = (G = Q.type) !== null && G !== void 0 ? G : "plugin Error", this.reason = (Z = Q.reason) !== null && Z !== void 0 ? Z : ""
      }
      return A
    }();
  t29.ContextCancelation = o29;
  var QT3 = function() {
    function A(Q, B, G, Z) {
      if (B === void 0) B = (0, oR3.v4)();
      if (G === void 0) G = new AT3.NullStats;
      if (Z === void 0) Z = new eR3.CoreLogger;
      this.attempts = 0, this.event = Q, this._id = B, this.logger = Z, this.stats = G
    }
    return A.system = function() {}, A.prototype.isSame = function(Q) {
      return Q.id === this.id
    }, A.prototype.cancel = function(Q) {
      if (Q) throw Q;
      throw new o29({
        reason: "Context Cancel"
      })
    }, A.prototype.log = function(Q, B, G) {
      this.logger.log(Q, B, G)
    }, Object.defineProperty(A.prototype, "id", {
      get: function() {
        return this._id
      },
      enumerable: !1,
      configurable: !0
    }), A.prototype.updateEvent = function(Q, B) {
      var G;
      if (Q.split(".")[0] === "integrations") {
        var Z = Q.split(".")[1];
        if (((G = this.event.integrations) === null || G === void 0 ? void 0 : G[Z]) === !1) return this.event
      }
      return (0, tR3.dset)(this.event, Q, B), this.event
    }, A.prototype.failedDelivery = function() {
      return this._failedDelivery
    }, A.prototype.setFailedDelivery = function(Q) {
      this._failedDelivery = Q
    }, A.prototype.logs = function() {
      return this.logger.logs
    }, A.prototype.flush = function() {
      this.logger.flush(), this.stats.flush()
    }, A.prototype.toJSON = function() {
      return {
        id: this._id,
        event: this.event,
        logs: this.logger.logs,
        metrics: this.stats.metrics
      }
    }, A
  }();
  t29.CoreContext = QT3
})
// @from(Start 13276720, End 13277292)
G99 = z((Q99) => {
  Object.defineProperty(Q99, "__esModule", {
    value: !0
  });
  Q99.groupBy = void 0;
  var A99 = oP();

  function GT3(A, Q) {
    var B = {};
    return A.forEach(function(G) {
      var Z, I = void 0;
      if (typeof Q === "string") {
        var Y = G[Q];
        I = typeof Y !== "string" ? JSON.stringify(Y) : Y
      } else if (Q instanceof Function) I = Q(G);
      if (I === void 0) return;
      B[I] = A99.__spreadArray(A99.__spreadArray([], (Z = B[I]) !== null && Z !== void 0 ? Z : [], !0), [G], !1)
    }), B
  }
  Q99.groupBy = GT3
})
// @from(Start 13277298, End 13277559)
Y99 = z((Z99) => {
  Object.defineProperty(Z99, "__esModule", {
    value: !0
  });
  Z99.isThenable = void 0;
  var ZT3 = function(A) {
    return typeof A === "object" && A !== null && "then" in A && typeof A.then === "function"
  };
  Z99.isThenable = ZT3
})
// @from(Start 13277565, End 13278182)
X99 = z((J99) => {
  Object.defineProperty(J99, "__esModule", {
    value: !0
  });
  J99.createTaskGroup = void 0;
  var IT3 = Y99(),
    YT3 = function() {
      var A, Q, B = 0;
      return {
        done: function() {
          return A
        },
        run: function(G) {
          var Z = G();
          if ((0, IT3.isThenable)(Z)) {
            if (++B === 1) A = new Promise(function(I) {
              return Q = I
            });
            Z.finally(function() {
              return --B === 0 && Q()
            })
          }
          return Z
        }
      }
    };
  J99.createTaskGroup = YT3
})
// @from(Start 13278188, End 13279884)
UW0 = z((K99) => {
  Object.defineProperty(K99, "__esModule", {
    value: !0
  });
  K99.ensure = K99.attempt = void 0;
  var V99 = oP(),
    zW0 = AI1();

  function JT3(A) {
    return V99.__awaiter(this, void 0, void 0, function() {
      var Q;
      return V99.__generator(this, function(B) {
        switch (B.label) {
          case 0:
            return B.trys.push([0, 2, , 3]), [4, A()];
          case 1:
            return [2, B.sent()];
          case 2:
            return Q = B.sent(), [2, Promise.reject(Q)];
          case 3:
            return [2]
        }
      })
    })
  }

  function F99(A, Q) {
    A.log("debug", "plugin", {
      plugin: Q.name
    });
    var B = new Date().getTime(),
      G = Q[A.event.type];
    if (G === void 0) return Promise.resolve(A);
    var Z = JT3(function() {
      return G.apply(Q, [A])
    }).then(function(I) {
      var Y = new Date().getTime() - B;
      return I.stats.gauge("plugin_time", Y, ["plugin:".concat(Q.name)]), I
    }).catch(function(I) {
      if (I instanceof zW0.ContextCancelation && I.type === "middleware_cancellation") throw I;
      if (I instanceof zW0.ContextCancelation) return A.log("warn", I.type, {
        plugin: Q.name,
        error: I
      }), I;
      return A.log("error", "plugin Error", {
        plugin: Q.name,
        error: I
      }), A.stats.increment("plugin_error", 1, ["plugin:".concat(Q.name)]), I
    });
    return Z
  }
  K99.attempt = F99;

  function WT3(A, Q) {
    return F99(A, Q).then(function(B) {
      if (B instanceof zW0.CoreContext) return B;
      A.log("debug", "Context canceled"), A.stats.increment("context_canceled"), A.cancel(B)
    })
  }
  K99.ensure = WT3
})
// @from(Start 13279890, End 13289421)
E99 = z((H99) => {
  Object.defineProperty(H99, "__esModule", {
    value: !0
  });
  H99.CoreEventQueue = void 0;
  var tD = oP(),
    VT3 = G99(),
    FT3 = KW0(),
    $W0 = AI1(),
    KT3 = nXA(),
    DT3 = X99(),
    QI1 = UW0(),
    HT3 = function(A) {
      tD.__extends(Q, A);

      function Q(B) {
        var G = A.call(this) || this;
        return G.criticalTasks = (0, DT3.createTaskGroup)(), G.plugins = [], G.failedInitializations = [], G.flushing = !1, G.queue = B, G.queue.on(FT3.ON_REMOVE_FROM_FUTURE, function() {
          G.scheduleFlush(0)
        }), G
      }
      return Q.prototype.register = function(B, G, Z) {
        return tD.__awaiter(this, void 0, void 0, function() {
          var I = this;
          return tD.__generator(this, function(Y) {
            switch (Y.label) {
              case 0:
                return [4, Promise.resolve(G.load(B, Z)).then(function() {
                  I.plugins.push(G)
                }).catch(function(J) {
                  if (G.type === "destination") {
                    I.failedInitializations.push(G.name), console.warn(G.name, J), B.log("warn", "Failed to load destination", {
                      plugin: G.name,
                      error: J
                    });
                    return
                  }
                  throw J
                })];
              case 1:
                return Y.sent(), [2]
            }
          })
        })
      }, Q.prototype.deregister = function(B, G, Z) {
        return tD.__awaiter(this, void 0, void 0, function() {
          var I;
          return tD.__generator(this, function(Y) {
            switch (Y.label) {
              case 0:
                if (Y.trys.push([0, 3, , 4]), !G.unload) return [3, 2];
                return [4, Promise.resolve(G.unload(B, Z))];
              case 1:
                Y.sent(), Y.label = 2;
              case 2:
                return this.plugins = this.plugins.filter(function(J) {
                  return J.name !== G.name
                }), [3, 4];
              case 3:
                return I = Y.sent(), B.log("warn", "Failed to unload destination", {
                  plugin: G.name,
                  error: I
                }), [3, 4];
              case 4:
                return [2]
            }
          })
        })
      }, Q.prototype.dispatch = function(B) {
        return tD.__awaiter(this, void 0, void 0, function() {
          var G;
          return tD.__generator(this, function(Z) {
            return B.log("debug", "Dispatching"), B.stats.increment("message_dispatched"), this.queue.push(B), G = this.subscribeToDelivery(B), this.scheduleFlush(0), [2, G]
          })
        })
      }, Q.prototype.subscribeToDelivery = function(B) {
        return tD.__awaiter(this, void 0, void 0, function() {
          var G = this;
          return tD.__generator(this, function(Z) {
            return [2, new Promise(function(I) {
              var Y = function(J, W) {
                if (J.isSame(B))
                  if (G.off("flush", Y), W) I(J);
                  else I(J)
              };
              G.on("flush", Y)
            })]
          })
        })
      }, Q.prototype.dispatchSingle = function(B) {
        return tD.__awaiter(this, void 0, void 0, function() {
          var G = this;
          return tD.__generator(this, function(Z) {
            return B.log("debug", "Dispatching"), B.stats.increment("message_dispatched"), this.queue.updateAttempts(B), B.attempts = 1, [2, this.deliver(B).catch(function(I) {
              var Y = G.enqueuRetry(I, B);
              if (!Y) return B.setFailedDelivery({
                reason: I
              }), B;
              return G.subscribeToDelivery(B)
            })]
          })
        })
      }, Q.prototype.isEmpty = function() {
        return this.queue.length === 0
      }, Q.prototype.scheduleFlush = function(B) {
        var G = this;
        if (B === void 0) B = 500;
        if (this.flushing) return;
        this.flushing = !0, setTimeout(function() {
          G.flush().then(function() {
            setTimeout(function() {
              if (G.flushing = !1, G.queue.length) G.scheduleFlush(0)
            }, 0)
          })
        }, B)
      }, Q.prototype.deliver = function(B) {
        return tD.__awaiter(this, void 0, void 0, function() {
          var G, Z, I, Y;
          return tD.__generator(this, function(J) {
            switch (J.label) {
              case 0:
                return [4, this.criticalTasks.done()];
              case 1:
                J.sent(), G = Date.now(), J.label = 2;
              case 2:
                return J.trys.push([2, 4, , 5]), [4, this.flushOne(B)];
              case 3:
                return B = J.sent(), Z = Date.now() - G, this.emit("delivery_success", B), B.stats.gauge("delivered", Z), B.log("debug", "Delivered", B.event), [2, B];
              case 4:
                throw I = J.sent(), Y = I, B.log("error", "Failed to deliver", Y), this.emit("delivery_failure", B, Y), B.stats.increment("delivery_failed"), I;
              case 5:
                return [2]
            }
          })
        })
      }, Q.prototype.enqueuRetry = function(B, G) {
        var Z = !(B instanceof $W0.ContextCancelation) || B.retry;
        if (!Z) return !1;
        return this.queue.pushWithBackoff(G)
      }, Q.prototype.flush = function() {
        return tD.__awaiter(this, void 0, void 0, function() {
          var B, G, Z;
          return tD.__generator(this, function(I) {
            switch (I.label) {
              case 0:
                if (this.queue.length === 0) return [2, []];
                if (B = this.queue.pop(), !B) return [2, []];
                B.attempts = this.queue.getAttempts(B), I.label = 1;
              case 1:
                return I.trys.push([1, 3, , 4]), [4, this.deliver(B)];
              case 2:
                return B = I.sent(), this.emit("flush", B, !0), [3, 4];
              case 3:
                if (G = I.sent(), Z = this.enqueuRetry(G, B), !Z) B.setFailedDelivery({
                  reason: G
                }), this.emit("flush", B, !1);
                return [2, []];
              case 4:
                return [2, [B]]
            }
          })
        })
      }, Q.prototype.isReady = function() {
        return !0
      }, Q.prototype.availableExtensions = function(B) {
        var G = this.plugins.filter(function(D) {
            var H, C, E;
            if (D.type !== "destination" && D.name !== "Segment.io") return !0;
            var U = void 0;
            return (H = D.alternativeNames) === null || H === void 0 || H.forEach(function(q) {
              if (B[q] !== void 0) U = B[q]
            }), (E = (C = B[D.name]) !== null && C !== void 0 ? C : U) !== null && E !== void 0 ? E : (D.name === "Segment.io" ? !0 : B.All) !== !1
          }),
          Z = (0, VT3.groupBy)(G, "type"),
          I = Z.before,
          Y = I === void 0 ? [] : I,
          J = Z.enrichment,
          W = J === void 0 ? [] : J,
          X = Z.destination,
          V = X === void 0 ? [] : X,
          F = Z.after,
          K = F === void 0 ? [] : F;
        return {
          before: Y,
          enrichment: W,
          destinations: V,
          after: K
        }
      }, Q.prototype.flushOne = function(B) {
        var G, Z;
        return tD.__awaiter(this, void 0, void 0, function() {
          var I, Y, J, W, X, V, H, F, K, D, H, C, E, U, q;
          return tD.__generator(this, function(w) {
            switch (w.label) {
              case 0:
                if (!this.isReady()) throw Error("Not ready");
                if (B.attempts > 1) this.emit("delivery_retry", B);
                I = this.availableExtensions((G = B.event.integrations) !== null && G !== void 0 ? G : {}), Y = I.before, J = I.enrichment, W = 0, X = Y, w.label = 1;
              case 1:
                if (!(W < X.length)) return [3, 4];
                return V = X[W], [4, (0, QI1.ensure)(B, V)];
              case 2:
                if (H = w.sent(), H instanceof $W0.CoreContext) B = H;
                this.emit("message_enriched", B, V), w.label = 3;
              case 3:
                return W++, [3, 1];
              case 4:
                F = 0, K = J, w.label = 5;
              case 5:
                if (!(F < K.length)) return [3, 8];
                return D = K[F], [4, (0, QI1.attempt)(B, D)];
              case 6:
                if (H = w.sent(), H instanceof $W0.CoreContext) B = H;
                this.emit("message_enriched", B, D), w.label = 7;
              case 7:
                return F++, [3, 5];
              case 8:
                return C = this.availableExtensions((Z = B.event.integrations) !== null && Z !== void 0 ? Z : {}), E = C.destinations, U = C.after, [4, new Promise(function(N, R) {
                  setTimeout(function() {
                    var T = E.map(function(y) {
                      return (0, QI1.attempt)(B, y)
                    });
                    Promise.all(T).then(N).catch(R)
                  }, 0)
                })];
              case 9:
                return w.sent(), B.stats.increment("message_delivered"), this.emit("message_delivered", B), q = U.map(function(N) {
                  return (0, QI1.attempt)(B, N)
                }), [4, Promise.all(q)];
              case 10:
                return w.sent(), [2, B]
            }
          })
        })
      }, Q
    }(KT3.Emitter);
  H99.CoreEventQueue = HT3
})
// @from(Start 13289427, End 13289512)
U99 = z((z99) => {
  Object.defineProperty(z99, "__esModule", {
    value: !0
  })
})
// @from(Start 13289518, End 13290762)
L99 = z((w99) => {
  Object.defineProperty(w99, "__esModule", {
    value: !0
  });
  w99.dispatch = w99.getDelay = void 0;
  var $99 = oP(),
    CT3 = JW0(),
    ET3 = function(A, Q) {
      var B = Date.now() - A;
      return Math.max((Q !== null && Q !== void 0 ? Q : 300) - B, 0)
    };
  w99.getDelay = ET3;

  function zT3(A, Q, B, G) {
    return $99.__awaiter(this, void 0, void 0, function() {
      var Z, I;
      return $99.__generator(this, function(Y) {
        switch (Y.label) {
          case 0:
            if (B.emit("dispatch_start", A), Z = Date.now(), !Q.isEmpty()) return [3, 2];
            return [4, Q.dispatchSingle(A)];
          case 1:
            return I = Y.sent(), [3, 4];
          case 2:
            return [4, Q.dispatch(A)];
          case 3:
            I = Y.sent(), Y.label = 4;
          case 4:
            if (!(G === null || G === void 0 ? void 0 : G.callback)) return [3, 6];
            return [4, (0, CT3.invokeCallback)(I, G.callback, w99.getDelay(Z, G.timeout))];
          case 5:
            I = Y.sent(), Y.label = 6;
          case 6:
            if (G === null || G === void 0 ? void 0 : G.debug) I.flush();
            return [2, I]
        }
      })
    })
  }
  w99.dispatch = zT3
})
// @from(Start 13290768, End 13291263)
R99 = z((M99) => {
  Object.defineProperty(M99, "__esModule", {
    value: !0
  });
  M99.bindAll = void 0;

  function UT3(A) {
    var Q = A.constructor.prototype;
    for (var B = 0, G = Object.getOwnPropertyNames(Q); B < G.length; B++) {
      var Z = G[B];
      if (Z !== "constructor") {
        var I = Object.getOwnPropertyDescriptor(A.constructor.prototype, Z);
        if (!!I && typeof I.value === "function") A[Z] = A[Z].bind(A)
      }
    }
    return A
  }
  M99.bindAll = UT3
})
// @from(Start 13291269, End 13292171)
Va = z((JV) => {
  Object.defineProperty(JV, "__esModule", {
    value: !0
  });
  JV.CoreLogger = JV.backoff = void 0;
  var qC = oP();
  qC.__exportStar(_B9(), JV);
  qC.__exportStar(yB9(), JV);
  qC.__exportStar(eJ0(), JV);
  qC.__exportStar(eB9(), JV);
  qC.__exportStar(JW0(), JV);
  qC.__exportStar(KW0(), JV);
  var $T3 = FW0();
  Object.defineProperty(JV, "backoff", {
    enumerable: !0,
    get: function() {
      return $T3.backoff
    }
  });
  qC.__exportStar(AI1(), JV);
  qC.__exportStar(E99(), JV);
  qC.__exportStar(U99(), JV);
  qC.__exportStar(L99(), JV);
  qC.__exportStar(BW0(), JV);
  qC.__exportStar(QW0(), JV);
  qC.__exportStar(IW0(), JV);
  qC.__exportStar(R99(), JV);
  qC.__exportStar(EW0(), JV);
  var wT3 = HW0();
  Object.defineProperty(JV, "CoreLogger", {
    enumerable: !0,
    get: function() {
      return wT3.CoreLogger
    }
  });
  qC.__exportStar(UW0(), JV)
})
// @from(Start 13292177, End 13292458)
j99 = z((T99) => {
  Object.defineProperty(T99, "__esModule", {
    value: !0
  });
  T99.validateSettings = void 0;
  var NT3 = Va(),
    LT3 = (A) => {
      if (!A.writeKey) throw new NT3.ValidationError("writeKey", "writeKey is missing.")
    };
  T99.validateSettings = LT3
})
// @from(Start 13292464, End 13292598)
wW0 = z((S99) => {
  Object.defineProperty(S99, "__esModule", {
    value: !0
  });
  S99.version = void 0;
  S99.version = "1.3.0"
})
// @from(Start 13292604, End 13292875)
x99 = z((k99) => {
  Object.defineProperty(k99, "__esModule", {
    value: !0
  });
  k99.tryCreateFormattedUrl = void 0;
  var MT3 = (A) => A.replace(/\/$/, ""),
    OT3 = (A, Q) => {
      return MT3(new URL(Q || "", A).href)
    };
  k99.tryCreateFormattedUrl = OT3
})
// @from(Start 13292881, End 13293119)
NW0 = z((qW0) => {
  Object.defineProperty(qW0, "__esModule", {
    value: !0
  });
  qW0.uuid = void 0;
  var RT3 = DW0();
  Object.defineProperty(qW0, "uuid", {
    enumerable: !0,
    get: function() {
      return RT3.v4
    }
  })
})
// @from(Start 13293125, End 13294496)
u99 = z((h99) => {
  Object.defineProperty(h99, "__esModule", {
    value: !0
  });
  h99.ContextBatch = void 0;
  var PT3 = NW0(),
    v99 = 32,
    b99 = 480;
  class f99 {
    constructor(A) {
      this.id = (0, PT3.uuid)(), this.items = [], this.sizeInBytes = 0, this.maxEventCount = Math.max(1, A)
    }
    tryAdd(A) {
      if (this.length === this.maxEventCount) return {
        success: !1,
        message: `Event limit of ${this.maxEventCount} has been exceeded.`
      };
      let Q = this.calculateSize(A.context);
      if (Q > v99 * 1024) return {
        success: !1,
        message: `Event exceeds maximum event size of ${v99} KB`
      };
      if (this.sizeInBytes + Q > b99 * 1024) return {
        success: !1,
        message: `Event has caused batch size to exceed ${b99} KB`
      };
      return this.items.push(A), this.sizeInBytes += Q, {
        success: !0
      }
    }
    get length() {
      return this.items.length
    }
    calculateSize(A) {
      return encodeURI(JSON.stringify(A.event)).split(/%..|i/).length
    }
    getEvents() {
      return this.items.map(({
        context: Q
      }) => Q.event)
    }
    getContexts() {
      return this.items.map((A) => A.context)
    }
    resolveEvents() {
      this.items.forEach(({
        resolver: A,
        context: Q
      }) => A(Q))
    }
  }
  h99.ContextBatch = f99
})
// @from(Start 13294502, End 13294739)
c99 = z((m99) => {
  Object.defineProperty(m99, "__esModule", {
    value: !0
  });
  m99.b64encode = void 0;
  var jT3 = UA("buffer"),
    ST3 = (A) => {
      return jT3.Buffer.from(A).toString("base64")
    };
  m99.b64encode = ST3
})
// @from(Start 13294745, End 13298762)
a99 = z((i99) => {
  Object.defineProperty(i99, "__esModule", {
    value: !0
  });
  i99.Publisher = void 0;
  var _T3 = Va(),
    kT3 = x99(),
    yT3 = nXA(),
    xT3 = u99(),
    vT3 = c99();

  function bT3(A) {
    return new Promise((Q) => setTimeout(Q, A))
  }

  function VjA() {}
  class l99 {
    constructor({
      host: A,
      path: Q,
      maxRetries: B,
      flushAt: G,
      flushInterval: Z,
      writeKey: I,
      httpRequestTimeout: Y,
      httpClient: J,
      disable: W
    }, X) {
      this._emitter = X, this._maxRetries = B, this._flushAt = Math.max(G, 1), this._flushInterval = Z, this._auth = (0, vT3.b64encode)(`${I}:`), this._url = (0, kT3.tryCreateFormattedUrl)(A ?? "https://api.segment.io", Q ?? "/v1/batch"), this._httpRequestTimeout = Y ?? 1e4, this._disable = Boolean(W), this._httpClient = J
    }
    createBatch() {
      this.pendingFlushTimeout && clearTimeout(this.pendingFlushTimeout);
      let A = new xT3.ContextBatch(this._flushAt);
      return this._batch = A, this.pendingFlushTimeout = setTimeout(() => {
        if (A === this._batch) this._batch = void 0;
        if (this.pendingFlushTimeout = void 0, A.length) this.send(A).catch(VjA)
      }, this._flushInterval), A
    }
    clearBatch() {
      this.pendingFlushTimeout && clearTimeout(this.pendingFlushTimeout), this._batch = void 0
    }
    flush(A) {
      if (!A) return;
      if (this._flushPendingItemsCount = A, !this._batch) return;
      if (this._batch.length === A) this.send(this._batch).catch(VjA), this.clearBatch()
    }
    enqueue(A) {
      let Q = this._batch ?? this.createBatch(),
        {
          promise: B,
          resolve: G
        } = (0, yT3.createDeferred)(),
        Z = {
          context: A,
          resolver: G
        };
      if (Q.tryAdd(Z).success) {
        let W = Q.length === this._flushPendingItemsCount;
        if (Q.length === this._flushAt || W) this.send(Q).catch(VjA), this.clearBatch();
        return B
      }
      if (Q.length) this.send(Q).catch(VjA), this.clearBatch();
      let Y = this.createBatch(),
        J = Y.tryAdd(Z);
      if (J.success) {
        if (Y.length === this._flushPendingItemsCount) this.send(Y).catch(VjA), this.clearBatch();
        return B
      } else return A.setFailedDelivery({
        reason: Error(J.message)
      }), Promise.resolve(A)
    }
    async send(A) {
      if (this._flushPendingItemsCount) this._flushPendingItemsCount -= A.length;
      let Q = A.getEvents(),
        B = this._maxRetries + 1,
        G = 0;
      while (G < B) {
        G++;
        let Z;
        try {
          if (this._disable) return A.resolveEvents();
          let I = {
            url: this._url,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${this._auth}`,
              "User-Agent": "analytics-node-next/latest"
            },
            data: {
              batch: Q,
              sentAt: new Date
            },
            httpRequestTimeout: this._httpRequestTimeout
          };
          this._emitter.emit("http_request", {
            body: I.data,
            method: I.method,
            url: I.url,
            headers: I.headers
          });
          let Y = await this._httpClient.makeRequest(I);
          if (Y.status >= 200 && Y.status < 300) {
            A.resolveEvents();
            return
          } else if (Y.status === 400) {
            p99(A, Error(`[${Y.status}] ${Y.statusText}`));
            return
          } else Z = Error(`[${Y.status}] ${Y.statusText}`)
        } catch (I) {
          Z = I
        }
        if (G === B) {
          p99(A, Z);
          return
        }
        await bT3((0, _T3.backoff)({
          attempt: G,
          minTimeout: 25,
          maxTimeout: 1000
        }))
      }
    }
  }
  i99.Publisher = l99;

  function p99(A, Q) {
    A.getContexts().forEach((B) => B.setFailedDelivery({
      reason: Q
    })), A.resolveEvents()
  }
})
// @from(Start 13298768, End 13299389)
LW0 = z((s99) => {
  Object.defineProperty(s99, "__esModule", {
    value: !0
  });
  s99.detectRuntime = void 0;
  var fT3 = () => {
    if (typeof process === "object" && process && typeof process.env === "object" && process.env && typeof process.version === "string") return "node";
    if (typeof window === "object") return "browser";
    if (typeof WebSocketPair < "u") return "cloudflare-worker";
    if (typeof EdgeRuntime === "string") return "vercel-edge";
    if (typeof WorkerGlobalScope < "u" && typeof importScripts === "function") return "web-worker";
    return "unknown"
  };
  s99.detectRuntime = fT3
})
// @from(Start 13299395, End 13300448)
A49 = z((t99) => {
  Object.defineProperty(t99, "__esModule", {
    value: !0
  });
  t99.createConfiguredNodePlugin = t99.createNodePlugin = void 0;
  var hT3 = a99(),
    gT3 = wW0(),
    uT3 = LW0();

  function mT3(A) {
    A.updateEvent("context.library.name", "@segment/analytics-node"), A.updateEvent("context.library.version", gT3.version);
    let Q = (0, uT3.detectRuntime)();
    if (Q === "node") A.updateEvent("_metadata.nodeVersion", process.version);
    A.updateEvent("_metadata.jsRuntime", Q)
  }

  function o99(A) {
    function Q(B) {
      return mT3(B), A.enqueue(B)
    }
    return {
      name: "Segment.io",
      type: "destination",
      version: "1.0.0",
      isLoaded: () => !0,
      load: () => Promise.resolve(),
      alias: Q,
      group: Q,
      identify: Q,
      page: Q,
      screen: Q,
      track: Q
    }
  }
  t99.createNodePlugin = o99;
  var dT3 = (A, Q) => {
    let B = new hT3.Publisher(A, Q);
    return {
      publisher: B,
      plugin: o99(B)
    }
  };
  t99.createConfiguredNodePlugin = dT3
})
// @from(Start 13300454, End 13300701)
G49 = z((Q49) => {
  Object.defineProperty(Q49, "__esModule", {
    value: !0
  });
  Q49.createMessageId = void 0;
  var pT3 = NW0(),
    lT3 = () => {
      return `node-next-${Date.now()}-${(0,pT3.uuid)()}`
    };
  Q49.createMessageId = lT3
})
// @from(Start 13300707, End 13301027)
J49 = z((I49) => {
  Object.defineProperty(I49, "__esModule", {
    value: !0
  });
  I49.NodeEventFactory = void 0;
  var iT3 = Va(),
    nT3 = G49();
  class Z49 extends iT3.EventFactory {
    constructor() {
      super({
        createMessageId: nT3.createMessageId
      })
    }
  }
  I49.NodeEventFactory = Z49
})
// @from(Start 13301033, End 13301331)
BI1 = z((X49) => {
  Object.defineProperty(X49, "__esModule", {
    value: !0
  });
  X49.Context = void 0;
  var aT3 = Va();
  class W49 extends aT3.CoreContext {
    static system() {
      return new this({
        type: "track",
        event: "system"
      })
    }
  }
  X49.Context = W49
})
// @from(Start 13301337, End 13302158)
D49 = z((F49) => {
  Object.defineProperty(F49, "__esModule", {
    value: !0
  });
  F49.dispatchAndEmit = void 0;
  var sT3 = Va(),
    rT3 = BI1(),
    oT3 = (A) => (Q) => {
      let B = Q.failedDelivery();
      return B ? A(B.reason, Q) : A(void 0, Q)
    },
    tT3 = async (A, Q, B, G) => {
      try {
        let Z = new rT3.Context(A),
          I = await (0, sT3.dispatch)(Z, Q, B, {
            ...G ? {
              callback: oT3(G)
            } : {}
          }),
          Y = I.failedDelivery();
        if (Y) B.emit("error", {
          code: "delivery_failure",
          reason: Y.reason,
          ctx: I
        });
        else B.emit(A.type, I)
      } catch (Z) {
        B.emit("error", {
          code: "unknown",
          reason: Z
        })
      }
    };
  F49.dispatchAndEmit = tT3
})
// @from(Start 13302164, End 13302356)
z49 = z((C49) => {
  Object.defineProperty(C49, "__esModule", {
    value: !0
  });
  C49.NodeEmitter = void 0;
  var eT3 = nXA();
  class H49 extends eT3.Emitter {}
  C49.NodeEmitter = H49
})
// @from(Start 13302362, End 13302862)
L49 = z((q49) => {
  Object.defineProperty(q49, "__esModule", {
    value: !0
  });
  q49.NodeEventQueue = void 0;
  var U49 = Va();
  class $49 extends U49.PriorityQueue {
    constructor() {
      super(1, [])
    }
    getAttempts(A) {
      return A.attempts ?? 0
    }
    updateAttempts(A) {
      return A.attempts = this.getAttempts(A) + 1, this.getAttempts(A)
    }
  }
  class w49 extends U49.CoreEventQueue {
    constructor() {
      super(new $49)
    }
  }
  q49.NodeEventQueue = w49
})
// @from(Start 13302868, End 13304283)
T49 = z((O49) => {
  Object.defineProperty(O49, "__esModule", {
    value: !0
  });
  O49.abortSignalAfterTimeout = O49.AbortSignal = void 0;
  var AP3 = nXA(),
    QP3 = LW0();
  class MW0 {
    constructor() {
      this.onabort = null, this.aborted = !1, this.eventEmitter = new AP3.Emitter
    }
    toString() {
      return "[object AbortSignal]"
    }
    get[Symbol.toStringTag]() {
      return "AbortSignal"
    }
    removeEventListener(...A) {
      this.eventEmitter.off(...A)
    }
    addEventListener(...A) {
      this.eventEmitter.on(...A)
    }
    dispatchEvent(A) {
      let Q = {
          type: A,
          target: this
        },
        B = `on${A}`;
      if (typeof this[B] === "function") this[B](Q);
      this.eventEmitter.emit(A, Q)
    }
  }
  O49.AbortSignal = MW0;
  class M49 {
    constructor() {
      this.signal = new MW0
    }
    abort() {
      if (this.signal.aborted) return;
      this.signal.aborted = !0, this.signal.dispatchEvent("abort")
    }
    toString() {
      return "[object AbortController]"
    }
    get[Symbol.toStringTag]() {
      return "AbortController"
    }
  }
  var BP3 = (A) => {
    if ((0, QP3.detectRuntime)() === "cloudflare-worker") return [];
    let Q = new(globalThis.AbortController || M49),
      B = setTimeout(() => {
        Q.abort()
      }, A);
    return B?.unref?.(), [Q.signal, B]
  };
  O49.abortSignalAfterTimeout = BP3
})
// @from(Start 13304289, End 13305686)
P49 = z((Ix) => {
  var ZP3 = Ix && Ix.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    IP3 = Ix && Ix.__setModuleDefault || (Object.create ? function(A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function(A, Q) {
      A.default = Q
    }),
    YP3 = Ix && Ix.__importStar || function(A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) ZP3(Q, A, B)
      }
      return IP3(Q, A), Q
    };
  Object.defineProperty(Ix, "__esModule", {
    value: !0
  });
  Ix.fetch = void 0;
  var JP3 = async (...A) => {
    if (globalThis.fetch) return globalThis.fetch(...A);
    else if (typeof EdgeRuntime !== "string") return (await Promise.resolve().then(() => YP3(Yl1()))).default(...A);
    else throw Error("Invariant: an edge runtime that does not support fetch should not exist")
  };
  Ix.fetch = JP3
})
// @from(Start 13305692, End 13306273)
OW0 = z((S49) => {
  Object.defineProperty(S49, "__esModule", {
    value: !0
  });
  S49.FetchHTTPClient = void 0;
  var WP3 = T49(),
    XP3 = P49();
  class j49 {
    constructor(A) {
      this._fetch = A ?? XP3.fetch
    }
    async makeRequest(A) {
      let [Q, B] = (0, WP3.abortSignalAfterTimeout)(A.httpRequestTimeout), G = {
        url: A.url,
        method: A.method,
        headers: A.headers,
        body: JSON.stringify(A.data),
        signal: Q
      };
      return this._fetch(A.url, G).finally(() => clearTimeout(B))
    }
  }
  S49.FetchHTTPClient = j49
})
// @from(Start 13306279, End 13311570)
RW0 = z((b49) => {
  Object.defineProperty(b49, "__esModule", {
    value: !0
  });
  b49.Analytics = void 0;
  var k49 = Va(),
    VP3 = j99(),
    FP3 = wW0(),
    KP3 = A49(),
    DP3 = J49(),
    HP3 = D49(),
    CP3 = z49(),
    y49 = BI1(),
    EP3 = L49(),
    x49 = OW0();
  class v49 extends CP3.NodeEmitter {
    constructor(A) {
      super();
      this._isClosed = !1, this._pendingEvents = 0, this._isFlushing = !1, (0, VP3.validateSettings)(A), this._eventFactory = new DP3.NodeEventFactory, this._queue = new EP3.NodeEventQueue;
      let Q = A.flushInterval ?? 1e4;
      this._closeAndFlushDefaultTimeout = Q * 1.25;
      let {
        plugin: B,
        publisher: G
      } = (0, KP3.createConfiguredNodePlugin)({
        writeKey: A.writeKey,
        host: A.host,
        path: A.path,
        maxRetries: A.maxRetries ?? 3,
        flushAt: A.flushAt ?? A.maxEventsInBatch ?? 15,
        httpRequestTimeout: A.httpRequestTimeout,
        disable: A.disable,
        flushInterval: Q,
        httpClient: typeof A.httpClient === "function" ? new x49.FetchHTTPClient(A.httpClient) : A.httpClient ?? new x49.FetchHTTPClient
      }, this);
      this._publisher = G, this.ready = this.register(B).then(() => {
        return
      }), this.emit("initialize", A), (0, k49.bindAll)(this)
    }
    get VERSION() {
      return FP3.version
    }
    closeAndFlush({
      timeout: A = this._closeAndFlushDefaultTimeout
    } = {}) {
      return this.flush({
        timeout: A,
        close: !0
      })
    }
    async flush({
      timeout: A,
      close: Q = !1
    } = {}) {
      if (this._isFlushing) {
        console.warn("Overlapping flush calls detected. Please wait for the previous flush to finish before calling .flush again");
        return
      } else this._isFlushing = !0;
      if (Q) this._isClosed = !0;
      this._publisher.flush(this._pendingEvents);
      let B = new Promise((G) => {
        if (!this._pendingEvents) G();
        else this.once("drained", () => {
          G()
        })
      }).finally(() => {
        this._isFlushing = !1
      });
      return A ? (0, k49.pTimeout)(B, A).catch(() => {
        return
      }) : B
    }
    _dispatch(A, Q) {
      if (this._isClosed) {
        this.emit("call_after_close", A);
        return
      }
      this._pendingEvents++, (0, HP3.dispatchAndEmit)(A, this._queue, this, Q).catch((B) => B).finally(() => {
        if (this._pendingEvents--, !this._pendingEvents) this.emit("drained")
      })
    }
    alias({
      userId: A,
      previousId: Q,
      context: B,
      timestamp: G,
      integrations: Z
    }, I) {
      let Y = this._eventFactory.alias(A, Q, {
        context: B,
        integrations: Z,
        timestamp: G
      });
      this._dispatch(Y, I)
    }
    group({
      timestamp: A,
      groupId: Q,
      userId: B,
      anonymousId: G,
      traits: Z = {},
      context: I,
      integrations: Y
    }, J) {
      let W = this._eventFactory.group(Q, Z, {
        context: I,
        anonymousId: G,
        userId: B,
        timestamp: A,
        integrations: Y
      });
      this._dispatch(W, J)
    }
    identify({
      userId: A,
      anonymousId: Q,
      traits: B = {},
      context: G,
      timestamp: Z,
      integrations: I
    }, Y) {
      let J = this._eventFactory.identify(A, B, {
        context: G,
        anonymousId: Q,
        userId: A,
        timestamp: Z,
        integrations: I
      });
      this._dispatch(J, Y)
    }
    page({
      userId: A,
      anonymousId: Q,
      category: B,
      name: G,
      properties: Z,
      context: I,
      timestamp: Y,
      integrations: J
    }, W) {
      let X = this._eventFactory.page(B ?? null, G ?? null, Z, {
        context: I,
        anonymousId: Q,
        userId: A,
        timestamp: Y,
        integrations: J
      });
      this._dispatch(X, W)
    }
    screen({
      userId: A,
      anonymousId: Q,
      category: B,
      name: G,
      properties: Z,
      context: I,
      timestamp: Y,
      integrations: J
    }, W) {
      let X = this._eventFactory.screen(B ?? null, G ?? null, Z, {
        context: I,
        anonymousId: Q,
        userId: A,
        timestamp: Y,
        integrations: J
      });
      this._dispatch(X, W)
    }
    track({
      userId: A,
      anonymousId: Q,
      event: B,
      properties: G,
      context: Z,
      timestamp: I,
      integrations: Y
    }, J) {
      let W = this._eventFactory.track(B, G, {
        context: Z,
        userId: A,
        anonymousId: Q,
        timestamp: I,
        integrations: Y
      });
      this._dispatch(W, J)
    }
    register(...A) {
      return this._queue.criticalTasks.run(async () => {
        let Q = y49.Context.system(),
          B = A.map((G) => this._queue.register(Q, G, this));
        await Promise.all(B), this.emit("register", A.map((G) => G.name))
      })
    }
    async deregister(...A) {
      let Q = y49.Context.system(),
        B = A.map((G) => {
          let Z = this._queue.plugins.find((I) => I.name === G);
          if (Z) return this._queue.deregister(Q, Z, this);
          else Q.log("warn", `plugin ${G} not found`)
        });
      await Promise.all(B), this.emit("deregister", A)
    }
  }
  b49.Analytics = v49
})
// @from(Start 13311576, End 13312213)
h49 = z((FjA) => {
  Object.defineProperty(FjA, "__esModule", {
    value: !0
  });
  FjA.FetchHTTPClient = FjA.Context = FjA.Analytics = void 0;
  var zP3 = RW0();
  Object.defineProperty(FjA, "Analytics", {
    enumerable: !0,
    get: function() {
      return zP3.Analytics
    }
  });
  var UP3 = BI1();
  Object.defineProperty(FjA, "Context", {
    enumerable: !0,
    get: function() {
      return UP3.Context
    }
  });
  var $P3 = OW0();
  Object.defineProperty(FjA, "FetchHTTPClient", {
    enumerable: !0,
    get: function() {
      return $P3.FetchHTTPClient
    }
  });
  var wP3 = RW0();
  FjA.default = wP3.Analytics
})
// @from(Start 13312216, End 13312331)
function MP3() {
  let A = ["test", "dev"].includes("production") ? "development" : "production";
  return LP3[A]
}
// @from(Start 13312332, End 13312391)
async function OP3() {
  if (fX()) return !1;
  return !0
}
// @from(Start 13312392, End 13312816)
async function TW0(A, Q) {
  let B = await u49();
  if (!B) return;
  try {
    let G = iv1(),
      Z = t6(),
      I = await lc({
        model: Q.model
      }),
      Y = LCB(I, Q),
      J = {
        anonymousId: G,
        event: A,
        properties: Y
      };
    if (Z) {
      let W = vc(!0);
      J.userId = W.userID
    }
    B.track(J)
  } catch (G) {
    AA(G instanceof Error ? G : Error(String(G)))
  }
}
// @from(Start 13312817, End 13313144)
async function m49(A) {
  let Q = await u49();
  if (!Q) return;
  try {
    let B = iv1(),
      G = t6(),
      Z = {
        anonymousId: B,
        traits: A
      };
    if (G) {
      let I = vc(!0);
      Z.userId = I.userID
    }
    Q.identify(Z)
  } catch (B) {
    AA(B instanceof Error ? B : Error(String(B)))
  }
}
// @from(Start 13313149, End 13313152)
g49
// @from(Start 13313154, End 13313157)
LP3
// @from(Start 13313159, End 13313169)
GI1 = null
// @from(Start 13313173, End 13313176)
u49
// @from(Start 13313182, End 13313787)
PW0 = L(() => {
  l2();
  gb();
  jQ();
  g1();
  gB();
  B7A();
  Ft();
  g49 = BA(h49(), 1), LP3 = {
    production: "LKJN8LsLERHEOXkw487o7qCTFOrGPimI",
    development: "b64sf1kxwDGe1PiSAlv5ixuH0f509RKK"
  };
  u49 = s1(async () => {
    if (!await OP3()) return null;
    try {
      return GI1 = new g49.Analytics({
        writeKey: MP3()
      }), process.on("beforeExit", async () => {
        await GI1?.closeAndFlush()
      }), process.on("exit", () => {
        GI1?.closeAndFlush()
      }), GI1
    } catch (Q) {
      return AA(Q instanceof Error ? Q : Error(String(Q))), null
    }
  })
})
// @from(Start 13313790, End 13313962)
function RP3() {
  let A = t6();
  if (!A) return {};
  return {
    email: A.emailAddress,
    account_uuid: A.accountUuid,
    organization_uuid: A.organizationUuid
  }
}
// @from(Start 13313964, End 13314458)
function KjA(A) {
  let Q = Ja(),
    B = EQ(() => A.onDone(!1, Q));
  return f1((G, Z) => {
    if (Z.escape) A.onDone(!1, Q)
  }), NC.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, NC.createElement(Vn, {
    onDone: () => A.onDone(!0, Q),
    startingMessage: A.startingMessage
  }), NC.createElement(S, {
    marginLeft: 1
  }, NC.createElement($, {
    dimColor: !0
  }, B.pending ? NC.createElement(NC.Fragment, null, "Press ", B.keyName, " again to exit") : "")))
}
// @from(Start 13314463, End 13314465)
NC
// @from(Start 13314467, End 13314950)
d49 = () => ({
  type: "local-jsx",
  name: "login",
  description: g4B() ? "Switch Anthropic accounts" : "Sign in with your Anthropic account",
  isEnabled: () => !process.env.DISABLE_LOGIN_COMMAND,
  isHidden: !1,
  async call(A, Q) {
    return NC.createElement(KjA, {
      onDone: async (B) => {
        if (Q.onChangeAPIKey(), B) OX1(), St(), m49(RP3());
        A(B ? "Login successful" : "Login interrupted")
      }
    })
  },
  userFacingName() {
    return "login"
  }
})
// @from(Start 13314956, End 13315068)
ZI1 = L(() => {
  SRA();
  Q4();
  hA();
  gB();
  ePA();
  u2();
  _0();
  PW0();
  gB();
  NC = BA(VA(), 1)
})
// @from(Start 13315074, End 13315077)
c49
// @from(Start 13315079, End 13315082)
TP3
// @from(Start 13315084, End 13315086)
Yx
// @from(Start 13315092, End 13316091)
DjA = L(() => {
  g1();
  gB();
  gM();
  ZI1();
  c49 = BA(VA(), 1), TP3 = {
    type: "local-jsx",
    name: "extra-usage",
    description: "Access and configure extra usage to keep working when limits are hit",
    isEnabled: () => {
      if (process.env.DISABLE_EXTRA_USAGE_COMMAND) return !1;
      let A = f4();
      return A === "pro" || A === "max"
    },
    isHidden: !1,
    async call(A, Q) {
      try {
        return await cZ("https://claude.ai/settings/usage"), c49.default.createElement(KjA, {
          startingMessage: "Starting new login following /extra-usage. Exit with Ctrl-C to use existing account.",
          onDone: (B) => {
            Q.onChangeAPIKey(), A(B ? "Login successful" : "Login interrupted")
          }
        })
      } catch (B) {
        AA(B), A("Failed to open browser. Please visit https://claude.ai/settings/usage to see your extra usage.")
      }
      return null
    },
    userFacingName() {
      return "extra-usage"
    }
  }, Yx = TP3
})
// @from(Start 13316094, End 13316176)
function jW0() {
  return BZ("claude_code_overages_upgrade_cta", "variant", p49)
}
// @from(Start 13316178, End 13317367)
function l49({
  text: A,
  onOpenRateLimitOptions: Q
}) {
  let B = f4(),
    G = yc(),
    Z = B === "pro" || B === "max",
    I = G === "default_claude_max_20x",
    Y = (y4A() || BB()) && Z,
    J = Y && !I,
    W = J ? jW0() : p49,
    [X, V] = L$.useState(!1);
  L$.useEffect(() => {
    if (J && W === "interactive_menu" && !X && Q) V(!0), Q()
  }, [J, W, X, Q]);
  let F = L$.useMemo(() => {
    if (!Y) return null;
    let K = Yx.isEnabled();
    if (I && K) return L$.default.createElement($, {
      dimColor: !0
    }, "/extra-usage to finish what you're working on.");
    if (W === "interactive_menu" && Q) return L$.default.createElement($, {
      dimColor: !0
    }, "Opening your options…");
    if (W === "control" || !K) return L$.default.createElement($, {
      dimColor: !0
    }, "/upgrade to increase your usage limit.");
    return L$.default.createElement($, {
      dimColor: !0
    }, "/upgrade or /extra-usage to finish what you're working on.")
  }, [Y, I, W, Q]);
  if (X) return null;
  return L$.default.createElement(S0, null, L$.default.createElement(S, {
    flexDirection: "column"
  }, L$.default.createElement($, {
    color: "error"
  }, A), F))
}
// @from(Start 13317372, End 13317374)
L$
// @from(Start 13317376, End 13317391)
p49 = "control"
// @from(Start 13317397, End 13317484)
SW0 = L(() => {
  gB();
  mMA();
  u2();
  hA();
  q8();
  DjA();
  L$ = BA(VA(), 1)
})
// @from(Start 13317487, End 13317803)
function PP3() {
  let A = wo0();
  return g3.default.createElement(S0, null, g3.default.createElement(S, {
    flexDirection: "column"
  }, g3.default.createElement($, {
    color: "error"
  }, N91), A && g3.default.createElement($, {
    dimColor: !0
  }, "· Run in another terminal: security unlock-keychain")))
}
// @from(Start 13317805, End 13320615)
function i49({
  param: {
    text: A
  },
  addMargin: Q,
  shouldShowDot: B,
  onOpenRateLimitOptions: G
}) {
  let {
    columns: Z
  } = WB(), [I] = qB();
  if (B31(A)) return null;
  if (OI2(A)) return g3.default.createElement(l49, {
    text: A,
    onOpenRateLimitOptions: G
  });
  switch (A) {
    case S1A:
      return null;
    case OYA: {
      let Y = EQA("warning") ?? "Run /compact to compact & continue";
      return g3.default.createElement(S0, {
        height: 1
      }, g3.default.createElement($, {
        color: "error"
      }, "Context low · ", Y))
    }
    case q91:
      return g3.default.createElement(S0, {
        height: 1
      }, g3.default.createElement($, {
        color: "error"
      }, "Credit balance too low · Add funds: https://console.anthropic.com/settings/billing"));
    case N91:
      return g3.default.createElement(PP3, null);
    case L91:
      return g3.default.createElement(S0, {
        height: 1
      }, g3.default.createElement($, {
        color: "error"
      }, L91));
    case M91:
      return g3.default.createElement(S0, {
        height: 1
      }, g3.default.createElement($, {
        color: "error"
      }, M91));
    case O91:
      return g3.default.createElement(S0, {
        height: 1
      }, g3.default.createElement($, {
        color: "error"
      }, O91, process.env.API_TIMEOUT_MS && g3.default.createElement(g3.default.Fragment, null, " ", "(API_TIMEOUT_MS=", process.env.API_TIMEOUT_MS, "ms, try increasing it)")));
    case j1A:
      return g3.default.createElement(S0, null, g3.default.createElement(S, {
        flexDirection: "column",
        gap: 1
      }, g3.default.createElement($, {
        color: "error"
      }, "We are experiencing high demand for Opus 4."), g3.default.createElement($, null, "To continue immediately, use /model to switch to", " ", nc(XU()), " and continue coding.")));
    case pMA:
      return g3.default.createElement(S0, {
        height: 1
      }, g3.default.createElement(zk, null));
    case _W0:
      return null;
    default:
      if (A.startsWith(uV)) return g3.default.createElement(S0, null, g3.default.createElement($, {
        color: "error"
      }, A === uV ? `${uV}: Please wait a moment and try again.` : A));
      return g3.default.createElement(S, {
        alignItems: "flex-start",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: Q ? 1 : 0,
        width: "100%"
      }, g3.default.createElement(S, {
        flexDirection: "row"
      }, B && g3.default.createElement(S, {
        minWidth: 2
      }, g3.default.createElement($, {
        color: "text"
      }, rD)), g3.default.createElement(S, {
        flexDirection: "column",
        width: Z - 6
      }, g3.default.createElement($, null, fD(A, I)))))
  }
}
// @from(Start 13320620, End 13320622)
g3
// @from(Start 13320628, End 13320783)
n49 = L(() => {
  hA();
  ZO();
  cQ();
  dn();
  wh();
  i8();
  q8();
  t2();
  wZ1();
  lMA();
  tZA();
  e00();
  _DA();
  SW0();
  g3 = BA(VA(), 1)
})
// @from(Start 13320786, End 13321357)
function a49({
  addMargin: A,
  param: {
    text: Q
  }
}) {
  let B = B9(Q, "command-message"),
    G = B9(Q, "command-args");
  if (!B) return null;
  g(`UserCommandMessage rendering: "${B}" (args: "${G||"none"}")`);
  let Z = B.startsWith("The "),
    I = Z ? "" : "/";
  return g(`  isSkillFormat: ${Z}, prefix: "${I}"`), HjA.createElement(S, {
    flexDirection: "column",
    marginTop: A ? 1 : 0,
    width: "100%"
  }, HjA.createElement($, {
    backgroundColor: "userMessageBackground",
    color: "text"
  }, "> ", I, [B, G].filter(Boolean).join(" "), " "))
}
// @from(Start 13321362, End 13321365)
HjA
// @from(Start 13321371, End 13321433)
s49 = L(() => {
  hA();
  cQ();
  V0();
  HjA = BA(VA(), 1)
})
// @from(Start 13321436, End 13322317)
function r49({
  text: A,
  thinkingMetadata: Q
}) {
  if (!Q || Q.triggers.length === 0) return tq.createElement($, {
    backgroundColor: "userMessageBackground",
    color: "text"
  }, "> ", A + " ");
  let B = Q.disabled ? void 0 : JrA[Q.level],
    G = nMB(A, Q.triggers);
  return tq.createElement($, null, ">", " ", G.map((Z, I) => {
    if (Z.isTrigger)
      if (WrA(Z.text)) return tq.createElement($, {
        key: I
      }, Z.text.split("").map((J, W) => tq.createElement($, {
        key: W,
        backgroundColor: "userMessageBackground",
        color: O$A(W, !1)
      }, J)));
      else return tq.createElement($, {
        key: I,
        backgroundColor: "userMessageBackground",
        color: B
      }, Z.text);
    return tq.createElement($, {
      key: I,
      backgroundColor: "userMessageBackground",
      color: "text"
    }, Z.text)
  }), " ")
}
// @from(Start 13322322, End 13322324)
tq
// @from(Start 13322330, End 13322383)
o49 = L(() => {
  hA();
  CU();
  tq = BA(VA(), 1)
})
// @from(Start 13322386, End 13322798)
function t49({
  addMargin: A,
  param: {
    text: Q
  },
  thinkingMetadata: B
}) {
  let {
    columns: G
  } = WB();
  if (!Q) return AA(Error("No content found in user prompt message")), null;
  let Z = Q.trim();
  return kW0.default.createElement(S, {
    flexDirection: "column",
    marginTop: A ? 1 : 0,
    width: G - 4
  }, kW0.default.createElement(r49, {
    text: Z,
    thinkingMetadata: B
  }))
}
// @from(Start 13322803, End 13322806)
kW0
// @from(Start 13322812, End 13322883)
e49 = L(() => {
  hA();
  g1();
  i8();
  o49();
  kW0 = BA(VA(), 1)
})