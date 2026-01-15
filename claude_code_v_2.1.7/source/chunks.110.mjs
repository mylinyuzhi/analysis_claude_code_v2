
// @from(Ln 318184, Col 4)
w_2 = U((q_2) => {
  Object.defineProperty(q_2, "__esModule", {
    value: !0
  });
  q_2.CoreEventQueue = void 0;
  var CE = LZ(),
    bv5 = D_2(),
    fv5 = aE0(),
    Qz0 = JD1(),
    hv5 = JHA(),
    gv5 = E_2(),
    XD1 = Az0(),
    uv5 = function (A) {
      CE.__extends(Q, A);

      function Q(B) {
        var G = A.call(this) || this;
        return G.criticalTasks = (0, gv5.createTaskGroup)(), G.plugins = [], G.failedInitializations = [], G.flushing = !1, G.queue = B, G.queue.on(fv5.ON_REMOVE_FROM_FUTURE, function () {
          G.scheduleFlush(0)
        }), G
      }
      return Q.prototype.register = function (B, G, Z) {
        return CE.__awaiter(this, void 0, void 0, function () {
          var Y = this;
          return CE.__generator(this, function (J) {
            switch (J.label) {
              case 0:
                return [4, Promise.resolve(G.load(B, Z)).then(function () {
                  Y.plugins.push(G)
                }).catch(function (X) {
                  if (G.type === "destination") {
                    Y.failedInitializations.push(G.name), console.warn(G.name, X), B.log("warn", "Failed to load destination", {
                      plugin: G.name,
                      error: X
                    });
                    return
                  }
                  throw X
                })];
              case 1:
                return J.sent(), [2]
            }
          })
        })
      }, Q.prototype.deregister = function (B, G, Z) {
        return CE.__awaiter(this, void 0, void 0, function () {
          var Y;
          return CE.__generator(this, function (J) {
            switch (J.label) {
              case 0:
                if (J.trys.push([0, 3, , 4]), !G.unload) return [3, 2];
                return [4, Promise.resolve(G.unload(B, Z))];
              case 1:
                J.sent(), J.label = 2;
              case 2:
                return this.plugins = this.plugins.filter(function (X) {
                  return X.name !== G.name
                }), [3, 4];
              case 3:
                return Y = J.sent(), B.log("warn", "Failed to unload destination", {
                  plugin: G.name,
                  error: Y
                }), [3, 4];
              case 4:
                return [2]
            }
          })
        })
      }, Q.prototype.dispatch = function (B) {
        return CE.__awaiter(this, void 0, void 0, function () {
          var G;
          return CE.__generator(this, function (Z) {
            return B.log("debug", "Dispatching"), B.stats.increment("message_dispatched"), this.queue.push(B), G = this.subscribeToDelivery(B), this.scheduleFlush(0), [2, G]
          })
        })
      }, Q.prototype.subscribeToDelivery = function (B) {
        return CE.__awaiter(this, void 0, void 0, function () {
          var G = this;
          return CE.__generator(this, function (Z) {
            return [2, new Promise(function (Y) {
              var J = function (X, I) {
                if (X.isSame(B))
                  if (G.off("flush", J), I) Y(X);
                  else Y(X)
              };
              G.on("flush", J)
            })]
          })
        })
      }, Q.prototype.dispatchSingle = function (B) {
        return CE.__awaiter(this, void 0, void 0, function () {
          var G = this;
          return CE.__generator(this, function (Z) {
            return B.log("debug", "Dispatching"), B.stats.increment("message_dispatched"), this.queue.updateAttempts(B), B.attempts = 1, [2, this.deliver(B).catch(function (Y) {
              var J = G.enqueuRetry(Y, B);
              if (!J) return B.setFailedDelivery({
                reason: Y
              }), B;
              return G.subscribeToDelivery(B)
            })]
          })
        })
      }, Q.prototype.isEmpty = function () {
        return this.queue.length === 0
      }, Q.prototype.scheduleFlush = function (B) {
        var G = this;
        if (B === void 0) B = 500;
        if (this.flushing) return;
        this.flushing = !0, setTimeout(function () {
          G.flush().then(function () {
            setTimeout(function () {
              if (G.flushing = !1, G.queue.length) G.scheduleFlush(0)
            }, 0)
          })
        }, B)
      }, Q.prototype.deliver = function (B) {
        return CE.__awaiter(this, void 0, void 0, function () {
          var G, Z, Y, J;
          return CE.__generator(this, function (X) {
            switch (X.label) {
              case 0:
                return [4, this.criticalTasks.done()];
              case 1:
                X.sent(), G = Date.now(), X.label = 2;
              case 2:
                return X.trys.push([2, 4, , 5]), [4, this.flushOne(B)];
              case 3:
                return B = X.sent(), Z = Date.now() - G, this.emit("delivery_success", B), B.stats.gauge("delivered", Z), B.log("debug", "Delivered", B.event), [2, B];
              case 4:
                throw Y = X.sent(), J = Y, B.log("error", "Failed to deliver", J), this.emit("delivery_failure", B, J), B.stats.increment("delivery_failed"), Y;
              case 5:
                return [2]
            }
          })
        })
      }, Q.prototype.enqueuRetry = function (B, G) {
        var Z = !(B instanceof Qz0.ContextCancelation) || B.retry;
        if (!Z) return !1;
        return this.queue.pushWithBackoff(G)
      }, Q.prototype.flush = function () {
        return CE.__awaiter(this, void 0, void 0, function () {
          var B, G, Z;
          return CE.__generator(this, function (Y) {
            switch (Y.label) {
              case 0:
                if (this.queue.length === 0) return [2, []];
                if (B = this.queue.pop(), !B) return [2, []];
                B.attempts = this.queue.getAttempts(B), Y.label = 1;
              case 1:
                return Y.trys.push([1, 3, , 4]), [4, this.deliver(B)];
              case 2:
                return B = Y.sent(), this.emit("flush", B, !0), [3, 4];
              case 3:
                if (G = Y.sent(), Z = this.enqueuRetry(G, B), !Z) B.setFailedDelivery({
                  reason: G
                }), this.emit("flush", B, !1);
                return [2, []];
              case 4:
                return [2, [B]]
            }
          })
        })
      }, Q.prototype.isReady = function () {
        return !0
      }, Q.prototype.availableExtensions = function (B) {
        var G = this.plugins.filter(function (F) {
            var H, E, z;
            if (F.type !== "destination" && F.name !== "Segment.io") return !0;
            var $ = void 0;
            return (H = F.alternativeNames) === null || H === void 0 || H.forEach(function (O) {
              if (B[O] !== void 0) $ = B[O]
            }), (z = (E = B[F.name]) !== null && E !== void 0 ? E : $) !== null && z !== void 0 ? z : (F.name === "Segment.io" ? !0 : B.All) !== !1
          }),
          Z = (0, bv5.groupBy)(G, "type"),
          Y = Z.before,
          J = Y === void 0 ? [] : Y,
          X = Z.enrichment,
          I = X === void 0 ? [] : X,
          D = Z.destination,
          W = D === void 0 ? [] : D,
          K = Z.after,
          V = K === void 0 ? [] : K;
        return {
          before: J,
          enrichment: I,
          destinations: W,
          after: V
        }
      }, Q.prototype.flushOne = function (B) {
        var G, Z;
        return CE.__awaiter(this, void 0, void 0, function () {
          var Y, J, X, I, D, W, H, K, V, F, H, E, z, $, O;
          return CE.__generator(this, function (L) {
            switch (L.label) {
              case 0:
                if (!this.isReady()) throw Error("Not ready");
                if (B.attempts > 1) this.emit("delivery_retry", B);
                Y = this.availableExtensions((G = B.event.integrations) !== null && G !== void 0 ? G : {}), J = Y.before, X = Y.enrichment, I = 0, D = J, L.label = 1;
              case 1:
                if (!(I < D.length)) return [3, 4];
                return W = D[I], [4, (0, XD1.ensure)(B, W)];
              case 2:
                if (H = L.sent(), H instanceof Qz0.CoreContext) B = H;
                this.emit("message_enriched", B, W), L.label = 3;
              case 3:
                return I++, [3, 1];
              case 4:
                K = 0, V = X, L.label = 5;
              case 5:
                if (!(K < V.length)) return [3, 8];
                return F = V[K], [4, (0, XD1.attempt)(B, F)];
              case 6:
                if (H = L.sent(), H instanceof Qz0.CoreContext) B = H;
                this.emit("message_enriched", B, F), L.label = 7;
              case 7:
                return K++, [3, 5];
              case 8:
                return E = this.availableExtensions((Z = B.event.integrations) !== null && Z !== void 0 ? Z : {}), z = E.destinations, $ = E.after, [4, new Promise(function (M, _) {
                  setTimeout(function () {
                    var j = z.map(function (x) {
                      return (0, XD1.attempt)(B, x)
                    });
                    Promise.all(j).then(M).catch(_)
                  }, 0)
                })];
              case 9:
                return L.sent(), B.stats.increment("message_delivered"), this.emit("message_delivered", B), O = $.map(function (M) {
                  return (0, XD1.attempt)(B, M)
                }), [4, Promise.all(O)];
              case 10:
                return L.sent(), [2, B]
            }
          })
        })
      }, Q
    }(hv5.Emitter);
  q_2.CoreEventQueue = uv5
})
// @from(Ln 318422, Col 4)
O_2 = U((L_2) => {
  Object.defineProperty(L_2, "__esModule", {
    value: !0
  })
})
// @from(Ln 318427, Col 4)
T_2 = U((R_2) => {
  Object.defineProperty(R_2, "__esModule", {
    value: !0
  });
  R_2.dispatch = R_2.getDelay = void 0;
  var M_2 = LZ(),
    mv5 = pE0(),
    dv5 = function (A, Q) {
      var B = Date.now() - A;
      return Math.max((Q !== null && Q !== void 0 ? Q : 300) - B, 0)
    };
  R_2.getDelay = dv5;

  function cv5(A, Q, B, G) {
    return M_2.__awaiter(this, void 0, void 0, function () {
      var Z, Y;
      return M_2.__generator(this, function (J) {
        switch (J.label) {
          case 0:
            if (B.emit("dispatch_start", A), Z = Date.now(), !Q.isEmpty()) return [3, 2];
            return [4, Q.dispatchSingle(A)];
          case 1:
            return Y = J.sent(), [3, 4];
          case 2:
            return [4, Q.dispatch(A)];
          case 3:
            Y = J.sent(), J.label = 4;
          case 4:
            if (!(G === null || G === void 0 ? void 0 : G.callback)) return [3, 6];
            return [4, (0, mv5.invokeCallback)(Y, G.callback, R_2.getDelay(Z, G.timeout))];
          case 5:
            Y = J.sent(), J.label = 6;
          case 6:
            if (G === null || G === void 0 ? void 0 : G.debug) Y.flush();
            return [2, Y]
        }
      })
    })
  }
  R_2.dispatch = cv5
})
// @from(Ln 318468, Col 4)
x_2 = U((P_2) => {
  Object.defineProperty(P_2, "__esModule", {
    value: !0
  });
  P_2.bindAll = void 0;

  function pv5(A) {
    var Q = A.constructor.prototype;
    for (var B = 0, G = Object.getOwnPropertyNames(Q); B < G.length; B++) {
      var Z = G[B];
      if (Z !== "constructor") {
        var Y = Object.getOwnPropertyDescriptor(A.constructor.prototype, Z);
        if (!!Y && typeof Y.value === "function") A[Z] = A[Z].bind(A)
      }
    }
    return A
  }
  P_2.bindAll = pv5
})
// @from(Ln 318487, Col 4)
Ps = U((WK) => {
  Object.defineProperty(WK, "__esModule", {
    value: !0
  });
  WK.CoreLogger = WK.backoff = void 0;
  var A$ = LZ();
  A$.__exportStar(KR2(), WK);
  A$.__exportStar(FR2(), WK);
  A$.__exportStar(bE0(), WK);
  A$.__exportStar(yR2(), WK);
  A$.__exportStar(pE0(), WK);
  A$.__exportStar(aE0(), WK);
  var lv5 = nE0();
  Object.defineProperty(WK, "backoff", {
    enumerable: !0,
    get: function () {
      return lv5.backoff
    }
  });
  A$.__exportStar(JD1(), WK);
  A$.__exportStar(w_2(), WK);
  A$.__exportStar(O_2(), WK);
  A$.__exportStar(T_2(), WK);
  A$.__exportStar(gE0(), WK);
  A$.__exportStar(hE0(), WK);
  A$.__exportStar(dE0(), WK);
  A$.__exportStar(x_2(), WK);
  A$.__exportStar(tE0(), WK);
  var iv5 = rE0();
  Object.defineProperty(WK, "CoreLogger", {
    enumerable: !0,
    get: function () {
      return iv5.CoreLogger
    }
  });
  A$.__exportStar(Az0(), WK)
})
// @from(Ln 318524, Col 4)
k_2 = U((y_2) => {
  Object.defineProperty(y_2, "__esModule", {
    value: !0
  });
  y_2.validateSettings = void 0;
  var av5 = Ps(),
    ov5 = (A) => {
      if (!A.writeKey) throw new av5.ValidationError("writeKey", "writeKey is missing.")
    };
  y_2.validateSettings = ov5
})
// @from(Ln 318535, Col 4)
Bz0 = U((b_2) => {
  Object.defineProperty(b_2, "__esModule", {
    value: !0
  });
  b_2.version = void 0;
  b_2.version = "1.3.0"
})
// @from(Ln 318542, Col 4)
u_2 = U((h_2) => {
  Object.defineProperty(h_2, "__esModule", {
    value: !0
  });
  h_2.tryCreateFormattedUrl = void 0;
  var rv5 = (A) => A.replace(/\/$/, ""),
    sv5 = (A, Q) => {
      return rv5(new URL(Q || "", A).href)
    };
  h_2.tryCreateFormattedUrl = sv5
})
// @from(Ln 318553, Col 4)
Zz0 = U((Gz0) => {
  Object.defineProperty(Gz0, "__esModule", {
    value: !0
  });
  Gz0.uuid = void 0;
  var tv5 = oE0();
  Object.defineProperty(Gz0, "uuid", {
    enumerable: !0,
    get: function () {
      return tv5.v4
    }
  })
})
// @from(Ln 318566, Col 4)
i_2 = U((p_2) => {
  Object.defineProperty(p_2, "__esModule", {
    value: !0
  });
  p_2.ContextBatch = void 0;
  var Ak5 = Zz0(),
    m_2 = 32,
    d_2 = 480;
  class c_2 {
    constructor(A) {
      this.id = (0, Ak5.uuid)(), this.items = [], this.sizeInBytes = 0, this.maxEventCount = Math.max(1, A)
    }
    tryAdd(A) {
      if (this.length === this.maxEventCount) return {
        success: !1,
        message: `Event limit of ${this.maxEventCount} has been exceeded.`
      };
      let Q = this.calculateSize(A.context);
      if (Q > m_2 * 1024) return {
        success: !1,
        message: `Event exceeds maximum event size of ${m_2} KB`
      };
      if (this.sizeInBytes + Q > d_2 * 1024) return {
        success: !1,
        message: `Event has caused batch size to exceed ${d_2} KB`
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
  p_2.ContextBatch = c_2
})
// @from(Ln 318619, Col 4)
o_2 = U((n_2) => {
  Object.defineProperty(n_2, "__esModule", {
    value: !0
  });
  n_2.b64encode = void 0;
  var Qk5 = NA("buffer"),
    Bk5 = (A) => {
      return Qk5.Buffer.from(A).toString("base64")
    };
  n_2.b64encode = Bk5
})
// @from(Ln 318630, Col 4)
Aj2 = U((t_2) => {
  Object.defineProperty(t_2, "__esModule", {
    value: !0
  });
  t_2.Publisher = void 0;
  var Gk5 = Ps(),
    Zk5 = u_2(),
    Yk5 = JHA(),
    Jk5 = i_2(),
    Xk5 = o_2();

  function Ik5(A) {
    return new Promise((Q) => setTimeout(Q, A))
  }

  function jkA() {}
  class s_2 {
    constructor({
      host: A,
      path: Q,
      maxRetries: B,
      flushAt: G,
      flushInterval: Z,
      writeKey: Y,
      httpRequestTimeout: J,
      httpClient: X,
      disable: I
    }, D) {
      this._emitter = D, this._maxRetries = B, this._flushAt = Math.max(G, 1), this._flushInterval = Z, this._auth = (0, Xk5.b64encode)(`${Y}:`), this._url = (0, Zk5.tryCreateFormattedUrl)(A ?? "https://api.segment.io", Q ?? "/v1/batch"), this._httpRequestTimeout = J ?? 1e4, this._disable = Boolean(I), this._httpClient = X
    }
    createBatch() {
      this.pendingFlushTimeout && clearTimeout(this.pendingFlushTimeout);
      let A = new Jk5.ContextBatch(this._flushAt);
      return this._batch = A, this.pendingFlushTimeout = setTimeout(() => {
        if (A === this._batch) this._batch = void 0;
        if (this.pendingFlushTimeout = void 0, A.length) this.send(A).catch(jkA)
      }, this._flushInterval), A
    }
    clearBatch() {
      this.pendingFlushTimeout && clearTimeout(this.pendingFlushTimeout), this._batch = void 0
    }
    flush(A) {
      if (!A) return;
      if (this._flushPendingItemsCount = A, !this._batch) return;
      if (this._batch.length === A) this.send(this._batch).catch(jkA), this.clearBatch()
    }
    enqueue(A) {
      let Q = this._batch ?? this.createBatch(),
        {
          promise: B,
          resolve: G
        } = (0, Yk5.createDeferred)(),
        Z = {
          context: A,
          resolver: G
        };
      if (Q.tryAdd(Z).success) {
        let I = Q.length === this._flushPendingItemsCount;
        if (Q.length === this._flushAt || I) this.send(Q).catch(jkA), this.clearBatch();
        return B
      }
      if (Q.length) this.send(Q).catch(jkA), this.clearBatch();
      let J = this.createBatch(),
        X = J.tryAdd(Z);
      if (X.success) {
        if (J.length === this._flushPendingItemsCount) this.send(J).catch(jkA), this.clearBatch();
        return B
      } else return A.setFailedDelivery({
        reason: Error(X.message)
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
          let Y = {
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
            body: Y.data,
            method: Y.method,
            url: Y.url,
            headers: Y.headers
          });
          let J = await this._httpClient.makeRequest(Y);
          if (J.status >= 200 && J.status < 300) {
            A.resolveEvents();
            return
          } else if (J.status === 400) {
            r_2(A, Error(`[${J.status}] ${J.statusText}`));
            return
          } else Z = Error(`[${J.status}] ${J.statusText}`)
        } catch (Y) {
          Z = Y
        }
        if (G === B) {
          r_2(A, Z);
          return
        }
        await Ik5((0, Gk5.backoff)({
          attempt: G,
          minTimeout: 25,
          maxTimeout: 1000
        }))
      }
    }
  }
  t_2.Publisher = s_2;

  function r_2(A, Q) {
    A.getContexts().forEach((B) => B.setFailedDelivery({
      reason: Q
    })), A.resolveEvents()
  }
})
// @from(Ln 318762, Col 4)
Yz0 = U((Qj2) => {
  Object.defineProperty(Qj2, "__esModule", {
    value: !0
  });
  Qj2.detectRuntime = void 0;
  var Dk5 = () => {
    if (typeof process === "object" && process && typeof process.env === "object" && process.env && typeof process.version === "string") return "node";
    if (typeof window === "object") return "browser";
    if (typeof WebSocketPair < "u") return "cloudflare-worker";
    if (typeof EdgeRuntime === "string") return "vercel-edge";
    if (typeof WorkerGlobalScope < "u" && typeof importScripts === "function") return "web-worker";
    return "unknown"
  };
  Qj2.detectRuntime = Dk5
})
// @from(Ln 318777, Col 4)
Jj2 = U((Zj2) => {
  Object.defineProperty(Zj2, "__esModule", {
    value: !0
  });
  Zj2.createConfiguredNodePlugin = Zj2.createNodePlugin = void 0;
  var Wk5 = Aj2(),
    Kk5 = Bz0(),
    Vk5 = Yz0();

  function Fk5(A) {
    A.updateEvent("context.library.name", "@segment/analytics-node"), A.updateEvent("context.library.version", Kk5.version);
    let Q = (0, Vk5.detectRuntime)();
    if (Q === "node") A.updateEvent("_metadata.nodeVersion", process.version);
    A.updateEvent("_metadata.jsRuntime", Q)
  }

  function Gj2(A) {
    function Q(B) {
      return Fk5(B), A.enqueue(B)
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
  Zj2.createNodePlugin = Gj2;
  var Hk5 = (A, Q) => {
    let B = new Wk5.Publisher(A, Q);
    return {
      publisher: B,
      plugin: Gj2(B)
    }
  };
  Zj2.createConfiguredNodePlugin = Hk5
})
// @from(Ln 318821, Col 4)
Dj2 = U((Xj2) => {
  Object.defineProperty(Xj2, "__esModule", {
    value: !0
  });
  Xj2.createMessageId = void 0;
  var zk5 = Zz0(),
    $k5 = () => {
      return `node-next-${Date.now()}-${(0,zk5.uuid)()}`
    };
  Xj2.createMessageId = $k5
})
// @from(Ln 318832, Col 4)
Fj2 = U((Kj2) => {
  Object.defineProperty(Kj2, "__esModule", {
    value: !0
  });
  Kj2.NodeEventFactory = void 0;
  var Ck5 = Ps(),
    Uk5 = Dj2();
  class Wj2 extends Ck5.EventFactory {
    constructor() {
      super({
        createMessageId: Uk5.createMessageId
      })
    }
  }
  Kj2.NodeEventFactory = Wj2
})
// @from(Ln 318848, Col 4)
ID1 = U((Ej2) => {
  Object.defineProperty(Ej2, "__esModule", {
    value: !0
  });
  Ej2.Context = void 0;
  var qk5 = Ps();
  class Hj2 extends qk5.CoreContext {
    static system() {
      return new this({
        type: "track",
        event: "system"
      })
    }
  }
  Ej2.Context = Hj2
})
// @from(Ln 318864, Col 4)
Uj2 = U(($j2) => {
  Object.defineProperty($j2, "__esModule", {
    value: !0
  });
  $j2.dispatchAndEmit = void 0;
  var Nk5 = Ps(),
    wk5 = ID1(),
    Lk5 = (A) => (Q) => {
      let B = Q.failedDelivery();
      return B ? A(B.reason, Q) : A(void 0, Q)
    },
    Ok5 = async (A, Q, B, G) => {
      try {
        let Z = new wk5.Context(A),
          Y = await (0, Nk5.dispatch)(Z, Q, B, {
            ...G ? {
              callback: Lk5(G)
            } : {}
          }),
          J = Y.failedDelivery();
        if (J) B.emit("error", {
          code: "delivery_failure",
          reason: J.reason,
          ctx: Y
        });
        else B.emit(A.type, Y)
      } catch (Z) {
        B.emit("error", {
          code: "unknown",
          reason: Z
        })
      }
    };
  $j2.dispatchAndEmit = Ok5
})
// @from(Ln 318899, Col 4)
Lj2 = U((Nj2) => {
  Object.defineProperty(Nj2, "__esModule", {
    value: !0
  });
  Nj2.NodeEmitter = void 0;
  var Mk5 = JHA();
  class qj2 extends Mk5.Emitter {}
  Nj2.NodeEmitter = qj2
})
// @from(Ln 318908, Col 4)
Tj2 = U((_j2) => {
  Object.defineProperty(_j2, "__esModule", {
    value: !0
  });
  _j2.NodeEventQueue = void 0;
  var Oj2 = Ps();
  class Mj2 extends Oj2.PriorityQueue {
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
  class Rj2 extends Oj2.CoreEventQueue {
    constructor() {
      super(new Mj2)
    }
  }
  _j2.NodeEventQueue = Rj2
})
// @from(Ln 318932, Col 4)
yj2 = U((Sj2) => {
  Object.defineProperty(Sj2, "__esModule", {
    value: !0
  });
  Sj2.abortSignalAfterTimeout = Sj2.AbortSignal = void 0;
  var Rk5 = JHA(),
    _k5 = Yz0();
  class Jz0 {
    constructor() {
      this.onabort = null, this.aborted = !1, this.eventEmitter = new Rk5.Emitter
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
  Sj2.AbortSignal = Jz0;
  class Pj2 {
    constructor() {
      this.signal = new Jz0
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
  var jk5 = (A) => {
    if ((0, _k5.detectRuntime)() === "cloudflare-worker") return [];
    let Q = new(globalThis.AbortController || Pj2),
      B = setTimeout(() => {
        Q.abort()
      }, A);
    return B?.unref?.(), [Q.signal, B]
  };
  Sj2.abortSignalAfterTimeout = jk5
})
// @from(Ln 318991, Col 4)
vj2 = U((Ef) => {
  var Pk5 = Ef && Ef.__createBinding || (Object.create ? function (A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function () {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function (A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    Sk5 = Ef && Ef.__setModuleDefault || (Object.create ? function (A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function (A, Q) {
      A.default = Q
    }),
    xk5 = Ef && Ef.__importStar || function (A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) Pk5(Q, A, B)
      }
      return Sk5(Q, A), Q
    };
  Object.defineProperty(Ef, "__esModule", {
    value: !0
  });
  Ef.fetch = void 0;
  var yk5 = async (...A) => {
    if (globalThis.fetch) return globalThis.fetch(...A);
    else if (typeof EdgeRuntime !== "string") return (await Promise.resolve().then(() => xk5(_40()))).default(...A);
    else throw Error("Invariant: an edge runtime that does not support fetch should not exist")
  };
  Ef.fetch = yk5
})
// @from(Ln 319034, Col 4)
Xz0 = U((bj2) => {
  Object.defineProperty(bj2, "__esModule", {
    value: !0
  });
  bj2.FetchHTTPClient = void 0;
  var vk5 = yj2(),
    kk5 = vj2();
  class kj2 {
    constructor(A) {
      this._fetch = A ?? kk5.fetch
    }
    async makeRequest(A) {
      let [Q, B] = (0, vk5.abortSignalAfterTimeout)(A.httpRequestTimeout), G = {
        url: A.url,
        method: A.method,
        headers: A.headers,
        body: JSON.stringify(A.data),
        signal: Q
      };
      return this._fetch(A.url, G).finally(() => clearTimeout(B))
    }
  }
  bj2.FetchHTTPClient = kj2
})
// @from(Ln 319058, Col 4)
Iz0 = U((dj2) => {
  Object.defineProperty(dj2, "__esModule", {
    value: !0
  });
  dj2.Analytics = void 0;
  var hj2 = Ps(),
    bk5 = k_2(),
    fk5 = Bz0(),
    hk5 = Jj2(),
    gk5 = Fj2(),
    uk5 = Uj2(),
    mk5 = Lj2(),
    gj2 = ID1(),
    dk5 = Tj2(),
    uj2 = Xz0();
  class mj2 extends mk5.NodeEmitter {
    constructor(A) {
      super();
      this._isClosed = !1, this._pendingEvents = 0, this._isFlushing = !1, (0, bk5.validateSettings)(A), this._eventFactory = new gk5.NodeEventFactory, this._queue = new dk5.NodeEventQueue;
      let Q = A.flushInterval ?? 1e4;
      this._closeAndFlushDefaultTimeout = Q * 1.25;
      let {
        plugin: B,
        publisher: G
      } = (0, hk5.createConfiguredNodePlugin)({
        writeKey: A.writeKey,
        host: A.host,
        path: A.path,
        maxRetries: A.maxRetries ?? 3,
        flushAt: A.flushAt ?? A.maxEventsInBatch ?? 15,
        httpRequestTimeout: A.httpRequestTimeout,
        disable: A.disable,
        flushInterval: Q,
        httpClient: typeof A.httpClient === "function" ? new uj2.FetchHTTPClient(A.httpClient) : A.httpClient ?? new uj2.FetchHTTPClient
      }, this);
      this._publisher = G, this.ready = this.register(B).then(() => {
        return
      }), this.emit("initialize", A), (0, hj2.bindAll)(this)
    }
    get VERSION() {
      return fk5.version
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
      return A ? (0, hj2.pTimeout)(B, A).catch(() => {
        return
      }) : B
    }
    _dispatch(A, Q) {
      if (this._isClosed) {
        this.emit("call_after_close", A);
        return
      }
      this._pendingEvents++, (0, uk5.dispatchAndEmit)(A, this._queue, this, Q).catch((B) => B).finally(() => {
        if (this._pendingEvents--, !this._pendingEvents) this.emit("drained")
      })
    }
    alias({
      userId: A,
      previousId: Q,
      context: B,
      timestamp: G,
      integrations: Z
    }, Y) {
      let J = this._eventFactory.alias(A, Q, {
        context: B,
        integrations: Z,
        timestamp: G
      });
      this._dispatch(J, Y)
    }
    group({
      timestamp: A,
      groupId: Q,
      userId: B,
      anonymousId: G,
      traits: Z = {},
      context: Y,
      integrations: J
    }, X) {
      let I = this._eventFactory.group(Q, Z, {
        context: Y,
        anonymousId: G,
        userId: B,
        timestamp: A,
        integrations: J
      });
      this._dispatch(I, X)
    }
    identify({
      userId: A,
      anonymousId: Q,
      traits: B = {},
      context: G,
      timestamp: Z,
      integrations: Y
    }, J) {
      let X = this._eventFactory.identify(A, B, {
        context: G,
        anonymousId: Q,
        userId: A,
        timestamp: Z,
        integrations: Y
      });
      this._dispatch(X, J)
    }
    page({
      userId: A,
      anonymousId: Q,
      category: B,
      name: G,
      properties: Z,
      context: Y,
      timestamp: J,
      integrations: X
    }, I) {
      let D = this._eventFactory.page(B ?? null, G ?? null, Z, {
        context: Y,
        anonymousId: Q,
        userId: A,
        timestamp: J,
        integrations: X
      });
      this._dispatch(D, I)
    }
    screen({
      userId: A,
      anonymousId: Q,
      category: B,
      name: G,
      properties: Z,
      context: Y,
      timestamp: J,
      integrations: X
    }, I) {
      let D = this._eventFactory.screen(B ?? null, G ?? null, Z, {
        context: Y,
        anonymousId: Q,
        userId: A,
        timestamp: J,
        integrations: X
      });
      this._dispatch(D, I)
    }
    track({
      userId: A,
      anonymousId: Q,
      event: B,
      properties: G,
      context: Z,
      timestamp: Y,
      integrations: J
    }, X) {
      let I = this._eventFactory.track(B, G, {
        context: Z,
        userId: A,
        anonymousId: Q,
        timestamp: Y,
        integrations: J
      });
      this._dispatch(I, X)
    }
    register(...A) {
      return this._queue.criticalTasks.run(async () => {
        let Q = gj2.Context.system(),
          B = A.map((G) => this._queue.register(Q, G, this));
        await Promise.all(B), this.emit("register", A.map((G) => G.name))
      })
    }
    async deregister(...A) {
      let Q = gj2.Context.system(),
        B = A.map((G) => {
          let Z = this._queue.plugins.find((Y) => Y.name === G);
          if (Z) return this._queue.deregister(Q, Z, this);
          else Q.log("warn", `plugin ${G} not found`)
        });
      await Promise.all(B), this.emit("deregister", A)
    }
  }
  dj2.Analytics = mj2
})
// @from(Ln 319263, Col 4)
pj2 = U((TkA) => {
  Object.defineProperty(TkA, "__esModule", {
    value: !0
  });
  TkA.FetchHTTPClient = TkA.Context = TkA.Analytics = void 0;
  var ck5 = Iz0();
  Object.defineProperty(TkA, "Analytics", {
    enumerable: !0,
    get: function () {
      return ck5.Analytics
    }
  });
  var pk5 = ID1();
  Object.defineProperty(TkA, "Context", {
    enumerable: !0,
    get: function () {
      return pk5.Context
    }
  });
  var lk5 = Xz0();
  Object.defineProperty(TkA, "FetchHTTPClient", {
    enumerable: !0,
    get: function () {
      return lk5.FetchHTTPClient
    }
  });
  var ik5 = Iz0();
  TkA.default = ik5.Analytics
})
// @from(Ln 319293, Col 0)
function rk5() {
  let A = ["test", "dev"].includes("production") ? "development" : "production";
  return ok5[A]
}
// @from(Ln 319297, Col 0)
async function sk5() {
  if (gW()) return !1;
  return !0
}
// @from(Ln 319301, Col 0)
async function Dz0(A, Q) {
  let B = await ij2();
  if (!B) return;
  try {
    let G = ei1(),
      Z = v3(),
      Y = await dn({
        model: Q.model
      }),
      J = EeQ(Y, Q),
      X = {
        anonymousId: G,
        event: A,
        properties: J
      };
    if (Z) {
      let I = cn(!0);
      X.userId = I.userID, X.properties.accountUuid = Z.accountUuid, X.properties.organizationUuid = Z.organizationUuid
    }
    B.track(X)
  } catch (G) {
    e(G instanceof Error ? G : Error(String(G)))
  }
}
// @from(Ln 319325, Col 0)
async function nj2(A) {
  let Q = await ij2();
  if (!Q) return;
  try {
    let B = ei1(),
      G = v3(),
      Z = {
        anonymousId: B,
        traits: A
      };
    if (G) {
      let Y = cn(!0);
      Z.userId = Y.userID
    }
    Q.identify(Z)
  } catch (B) {
    e(B instanceof Error ? B : Error(String(B)))
  }
}
// @from(Ln 319344, Col 4)
lj2
// @from(Ln 319344, Col 9)
ok5
// @from(Ln 319344, Col 14)
DD1 = null
// @from(Ln 319345, Col 2)
ij2
// @from(Ln 319346, Col 4)
Wz0 = w(() => {
  Y9();
  Ou();
  GQ();
  v1();
  Q2();
  hW();
  Mu();
  lj2 = c(pj2(), 1), ok5 = {
    production: "LKJN8LsLERHEOXkw487o7qCTFOrGPimI",
    development: "b64sf1kxwDGe1PiSAlv5ixuH0f509RKK"
  };
  ij2 = W0(async () => {
    if (!await sk5()) return null;
    try {
      return DD1 = new lj2.Analytics({
        writeKey: rk5()
      }), process.on("beforeExit", async () => {
        await DD1?.closeAndFlush()
      }), process.on("exit", () => {
        DD1?.closeAndFlush()
      }), DD1
    } catch (Q) {
      return e(Q instanceof Error ? Q : Error(String(Q))), null
    }
  })
})
// @from(Ln 319374, Col 0)
function tk5() {
  let A = v3();
  if (!A) return {};
  return {
    email: A.emailAddress,
    account_uuid: A.accountUuid,
    organization_uuid: A.organizationUuid
  }
}
// @from(Ln 319384, Col 0)
function PkA(A) {
  let Q = js(),
    B = MQ(() => A.onDone(!1, Q));
  return H2("confirm:no", () => A.onDone(!1, Q), {
    context: "Confirmation"
  }), Q$.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, Q$.createElement(_s, {
    onDone: () => A.onDone(!0, Q),
    startingMessage: A.startingMessage
  }), Q$.createElement(T, {
    marginLeft: 1
  }, Q$.createElement(C, {
    dimColor: !0
  }, B.pending ? Q$.createElement(Q$.Fragment, null, "Press ", B.keyName, " again to exit") : "")))
}
// @from(Ln 319401, Col 4)
Q$
// @from(Ln 319401, Col 8)
aj2 = () => ({
  type: "local-jsx",
  name: "login",
  description: _BB() ? "Switch Anthropic accounts" : "Sign in with your Anthropic account",
  isEnabled: () => !process.env.DISABLE_LOGIN_COMMAND,
  isHidden: !1,
  async call(A, Q) {
    return Q$.createElement(PkA, {
      onDone: async (B) => {
        if (Q.onChangeAPIKey(), B) xCA(), $QA(), nj2(tk5()), $L2(), Q.setAppState((G) => ({
          ...G,
          authVersion: G.authVersion + 1
        }));
        A(B ? "Login successful" : "Login interrupted")
      }
    })
  },
  userFacingName() {
    return "login"
  }
})
// @from(Ln 319422, Col 4)
WD1 = w(() => {
  RkA();
  E9();
  fA();
  Q2();
  c6();
  _kA();
  BI();
  C0();
  Wz0();
  Q2();
  iFA();
  Q$ = c(QA(), 1)
})
// @from(Ln 319436, Col 0)
async function aS() {
  let A = o1();
  if (SkA.has(A)) return SkA.get(A) ?? null;
  try {
    let Q = await pA1();
    if (k(`Git remote URL: ${Q}`), !Q) return k("No git remote URL found"), SkA.set(A, null), null;
    let B = w6A(Q);
    return k(`Parsed repository: ${B} from URL: ${Q}`), SkA.set(A, B), B
  } catch (Q) {
    return k(`Error detecting repository: ${Q}`), SkA.set(A, null), null
  }
}
// @from(Ln 319449, Col 0)
function w6A(A) {
  let Q = A.trim(),
    B = /github\.com[:/]([^/]+)\/([^/]+)$/,
    G = Q.match(B);
  if (G && G[1] && G[2]) {
    let Z = G[1],
      Y = G[2].replace(/\.git$/, ""),
      J = `${Z}/${Y}`;
    return k(`Parsed repository: ${J} from ${Q}`), J
  }
  if (!Q.includes("://") && !Q.includes("@") && Q.includes("/")) {
    let Z = Q.split("/");
    if (Z.length === 2 && Z[0] && Z[1]) {
      let Y = Z[1].replace(/\.git$/, "");
      return `${Z[0]}/${Y}`
    }
  }
  return k(`Could not parse repository from: ${Q}`), null
}
// @from(Ln 319468, Col 4)
SkA
// @from(Ln 319469, Col 4)
L6A = w(() => {
  ZI();
  T1();
  V2();
  SkA = new Map
})
// @from(Ln 319479, Col 0)
function Ab5(A) {
  if (!xQ.isAxiosError(A)) return !1;
  if (!A.response) return !0;
  if (A.response.status >= 500) return !0;
  return !1
}
// @from(Ln 319485, Col 0)
async function Qb5(A, Q) {
  let B;
  for (let G = 0; G <= Kz0; G++) try {
    return await xQ.get(A, Q)
  } catch (Z) {
    if (B = Z, !Ab5(Z)) throw Z;
    if (G >= Kz0) throw k(`Teleport request failed after ${G+1} attempts: ${Z instanceof Error?Z.message:String(Z)}`), Z;
    let Y = oj2[G] ?? 2000;
    k(`Teleport request failed (attempt ${G+1}/${Kz0+1}), retrying in ${Y}ms: ${Z instanceof Error?Z.message:String(Z)}`), await new Promise((J) => setTimeout(J, Y))
  }
  throw B
}
// @from(Ln 319497, Col 0)
async function oS() {
  let A = g4()?.accessToken;
  if (A === void 0) throw Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
  let Q = await Wv();
  if (!Q) throw Error("Unable to get organization UUID");
  return {
    accessToken: A,
    orgUUID: Q
  }
}
// @from(Ln 319507, Col 0)
async function rj2() {
  let {
    accessToken: A,
    orgUUID: Q
  } = await oS(), B = `${v9().BASE_API_URL}/v1/sessions`;
  try {
    let G = {
        ...IV(A),
        "x-organization-uuid": Q
      },
      Z = await Qb5(B, {
        headers: G
      });
    if (Z.status !== 200) throw Error(`Failed to fetch code sessions: ${Z.statusText}`);
    return Z.data.data.map((J) => {
      let X = J.session_context.sources.find((D) => D.type === "git_repository"),
        I = null;
      if (X?.url) {
        let D = w6A(X.url);
        if (D) {
          let [W, K] = D.split("/");
          if (W && K) I = {
            name: K,
            owner: {
              login: W
            },
            default_branch: X.revision || void 0
          }
        }
      }
      return {
        id: J.id,
        title: J.title || "Untitled",
        description: "",
        status: J.session_status,
        repo: I,
        turns: [],
        created_at: J.created_at,
        updated_at: J.updated_at
      }
    })
  } catch (G) {
    let Z = G instanceof Error ? G : Error(String(G));
    throw e(Z), G
  }
}
// @from(Ln 319554, Col 0)
function IV(A) {
  return {
    Authorization: `Bearer ${A}`,
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01"
  }
}
// @from(Ln 319561, Col 0)
async function xkA(A) {
  let {
    accessToken: Q,
    orgUUID: B
  } = await oS(), G = `${v9().BASE_API_URL}/v1/sessions/${A}`, Z = {
    ...IV(Q),
    "x-organization-uuid": B
  }, Y = await xQ.get(G, {
    headers: Z,
    timeout: 15000,
    validateStatus: (J) => J < 500
  });
  if (Y.status !== 200) {
    let X = Y.data?.error?.message;
    if (Y.status === 404) throw Error(`Session not found: ${A}`);
    if (Y.status === 401) throw Error("Session expired. Please run /login to sign in again.");
    throw Error(X || `Failed to fetch session: ${Y.status} ${Y.statusText}`)
  }
  return Y.data
}
// @from(Ln 319582, Col 0)
function Vz0(A) {
  return A.session_context.outcomes?.find((B) => B.type === "git_repository")?.git_info?.branches[0]
}
// @from(Ln 319585, Col 0)
async function sj2(A, Q) {
  try {
    let {
      accessToken: B,
      orgUUID: G
    } = await oS(), Z = `${v9().BASE_API_URL}/v1/sessions/${A}/events`, Y = {
      ...IV(B),
      "x-organization-uuid": G
    }, X = {
      events: [{
        uuid: ek5(),
        session_id: A,
        type: "user",
        parent_tool_use_id: null,
        message: {
          role: "user",
          content: Q
        }
      }]
    }, I = await xQ.post(Z, X, {
      headers: Y,
      validateStatus: (D) => D < 500
    });
    if (I.status === 200 || I.status === 201) return !0;
    return !1
  } catch {
    return !1
  }
}
// @from(Ln 319614, Col 4)
oj2
// @from(Ln 319614, Col 9)
Kz0
// @from(Ln 319614, Col 14)
Bb5
// @from(Ln 319614, Col 19)
omZ
// @from(Ln 319615, Col 4)
zf = w(() => {
  JX();
  Q2();
  j5();
  JL();
  v1();
  T1();
  L6A();
  j9();
  oj2 = [2000, 4000, 8000, 16000], Kz0 = oj2.length;
  Bb5 = k2.object({
    id: k2.string(),
    title: k2.string(),
    description: k2.string(),
    status: k2.enum(["idle", "working", "waiting", "completed", "archived", "cancelled", "rejected"]),
    repo: k2.object({
      name: k2.string(),
      owner: k2.object({
        login: k2.string()
      }),
      default_branch: k2.string().optional()
    }).nullable(),
    turns: k2.array(k2.string()),
    created_at: k2.string(),
    updated_at: k2.string()
  }), omZ = k2.array(Bb5)
})
// @from(Ln 319642, Col 0)
async function tj2(A) {
  let {
    accessToken: Q,
    orgUUID: B
  } = await oS(), G = {
    ...IV(Q),
    "x-organization-uuid": B
  }, Z = `${v9().BASE_API_URL}/api/oauth/organizations/${B}/admin_requests`;
  return (await xQ.post(Z, A, {
    headers: G
  })).data
}
// @from(Ln 319654, Col 0)
async function ej2(A, Q) {
  let {
    accessToken: B,
    orgUUID: G
  } = await oS(), Z = {
    ...IV(B),
    "x-organization-uuid": G
  }, Y = `${v9().BASE_API_URL}/api/oauth/organizations/${G}/admin_requests/me?request_type=${A}`;
  for (let X of Q) Y += `&statuses=${X}`;
  return (await xQ.get(Y, {
    headers: Z
  })).data
}
// @from(Ln 319667, Col 4)
AT2 = w(() => {
  j5();
  JX();
  zf()
})
// @from(Ln 319672, Col 4)
QT2
// @from(Ln 319672, Col 9)
Gb5
// @from(Ln 319672, Col 14)
Wc
// @from(Ln 319673, Col 4)
ykA = w(() => {
  v1();
  Q2();
  TN();
  WD1();
  GQ();
  AT2();
  QT2 = c(QA(), 1), Gb5 = {
    type: "local-jsx",
    name: "extra-usage",
    description: "Configure extra usage to keep working when limits are hit",
    isEnabled: () => {
      if (process.env.DISABLE_EXTRA_USAGE_COMMAND) return !1;
      if (!ju()) return !1;
      if (ZP()) return !0;
      let A = N6();
      return A === "pro" || A === "max"
    },
    isHidden: !1,
    async call(A, Q) {
      let B = N6(),
        G = B === "team" || B === "enterprise",
        Z = Xk(),
        Y = ZP(),
        J = v3()?.hasExtraUsageEnabled === !0;
      if (!Z && G) {
        if (Y) {
          try {
            let I = await ej2("limit_increase", ["pending", "dismissed"]);
            if (I && I.length > 0) return A("You have already submitted a request for extra usage to your admin."), null
          } catch (I) {
            e(I)
          }
          try {
            return await tj2({
              request_type: "limit_increase",
              details: null
            }), A(J ? "Request sent to your admin to increase extra usage." : "Request sent to your admin to enable extra usage."), null
          } catch (I) {
            e(I)
          }
        }
        return A("Please contact your admin to manage extra usage settings."), null
      }
      let X = G ? "https://claude.ai/admin-settings/usage" : "https://claude.ai/settings/usage";
      try {
        return await i7(X), QT2.default.createElement(PkA, {
          startingMessage: "Starting new login following /extra-usage. Exit with Ctrl-C to use existing account.",
          onDone: (I) => {
            Q.onChangeAPIKey(), A(I ? "Login successful" : "Login interrupted")
          }
        })
      } catch (I) {
        e(I), A(`Failed to open browser. Please visit ${X} to see your extra usage.`)
      }
      return null
    },
    userFacingName() {
      return "extra-usage"
    }
  }, Wc = Gb5
})
// @from(Ln 319736, Col 0)
function BT2({
  text: A,
  onOpenRateLimitOptions: Q
}) {
  let B = N6(),
    G = IXA(),
    Z = ZP(),
    Y = B === "pro" || B === "max",
    J = B === "team" || B === "enterprise",
    X = G === "default_claude_max_20x",
    I = HX("hide_overages_option_at_rate_limit_hit", "enabled", !1),
    D = (_ZA() || qB()) && (Y || Z),
    W = D && !X,
    [K, V] = XHA.useState(!1),
    F = no(),
    H = F.status === "rejected" && F.resetsAt !== void 0,
    E = W && !K && H && Q;
  XHA.useEffect(() => {
    if (E) V(!0), Q()
  }, [E, Q]);
  let z = XHA.useMemo(() => {
    if (!D) return null;
    let $ = Wc.isEnabled();
    if (X && $) return rS.default.createElement(C, {
      dimColor: !0
    }, "/extra-usage to finish what you're working on.");
    if (E) return rS.default.createElement(C, {
      dimColor: !0
    }, "Opening your options…");
    if (!J && (I || !$)) return rS.default.createElement(C, {
      dimColor: !0
    }, "/upgrade to increase your usage limit.");
    if (J) {
      if (!$) return null;
      if (Xk()) return rS.default.createElement(C, {
        dimColor: !0
      }, "/extra-usage to finish what you're working on.");
      if (Z) return rS.default.createElement(C, {
        dimColor: !0
      }, "/extra-usage to request more usage from your admin.");
      return rS.default.createElement(C, {
        dimColor: !0
      }, "Contact your admin to request extra usage.")
    }
    return rS.default.createElement(C, {
      dimColor: !0
    }, "/upgrade or /extra-usage to finish what you're working on.")
  }, [D, X, J, Z, E, I]);
  return rS.default.createElement(x0, null, rS.default.createElement(T, {
    flexDirection: "column"
  }, rS.default.createElement(C, {
    color: "error"
  }, A), K ? null : z))
}
// @from(Ln 319790, Col 4)
rS
// @from(Ln 319790, Col 8)
XHA
// @from(Ln 319791, Col 4)
GT2 = w(() => {
  Q2();
  MSA();
  fA();
  c4();
  ykA();
  BI();
  GQ();
  IS();
  rS = c(QA(), 1), XHA = c(QA(), 1)
})
// @from(Ln 319803, Col 0)
function Zb5() {
  let A = wEQ();
  return I7.default.createElement(x0, null, I7.default.createElement(T, {
    flexDirection: "column"
  }, I7.default.createElement(C, {
    color: "error"
  }, T51), A && I7.default.createElement(C, {
    dimColor: !0
  }, "· Run in another terminal: security unlock-keychain")))
}
// @from(Ln 319814, Col 0)
function ZT2({
  param: {
    text: A
  },
  addMargin: Q,
  shouldShowDot: B,
  onOpenRateLimitOptions: G
}) {
  if (KD1(A)) return null;
  if (drB(A)) return I7.default.createElement(BT2, {
    text: A,
    onOpenRateLimitOptions: G
  });
  switch (A) {
    case v9A:
      return null;
    case Ar: {
      let Z = f4A("warning");
      return I7.default.createElement(x0, {
        height: 1
      }, I7.default.createElement(C, {
        color: "error"
      }, "Context limit reached · /compact or /clear to continue", Z ? ` · ${Z}` : ""))
    }
    case j51:
      return I7.default.createElement(x0, {
        height: 1
      }, I7.default.createElement(C, {
        color: "error"
      }, "Credit balance too low · Add funds: https://platform.claude.com/settings/billing"));
    case T51:
      return I7.default.createElement(Zb5, null);
    case P51:
      return I7.default.createElement(x0, {
        height: 1
      }, I7.default.createElement(C, {
        color: "error"
      }, P51));
    case S51:
      return I7.default.createElement(x0, {
        height: 1
      }, I7.default.createElement(C, {
        color: "error"
      }, S51));
    case x51:
      return I7.default.createElement(x0, {
        height: 1
      }, I7.default.createElement(C, {
        color: "error"
      }, x51, process.env.API_TIMEOUT_MS && I7.default.createElement(I7.default.Fragment, null, " ", "(API_TIMEOUT_MS=", process.env.API_TIMEOUT_MS, "ms, try increasing it)")));
    case y9A:
      return I7.default.createElement(x0, null, I7.default.createElement(T, {
        flexDirection: "column",
        gap: 1
      }, I7.default.createElement(C, {
        color: "error"
      }, "We are experiencing high demand for Opus 4."), I7.default.createElement(C, null, "To continue immediately, use /model to switch to", " ", KC(OR()), " and continue coding.")));
    case vkA:
      return I7.default.createElement(x0, {
        height: 1
      }, I7.default.createElement(Hb, null));
    default:
      if (A.startsWith(tW)) return I7.default.createElement(x0, null, I7.default.createElement(C, {
        color: "error"
      }, A === tW ? `${tW}: Please wait a moment and try again.` : A));
      return I7.default.createElement(T, {
        alignItems: "flex-start",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: Q ? 1 : 0,
        width: "100%"
      }, I7.default.createElement(T, {
        flexDirection: "row"
      }, B && I7.default.createElement(T, {
        minWidth: 2
      }, I7.default.createElement(C, {
        color: "text"
      }, xJ)), I7.default.createElement(b4A, null, I7.default.createElement(T, {
        flexDirection: "column"
      }, I7.default.createElement(JV, null, A)))))
  }
}
// @from(Ln 319896, Col 4)
I7
// @from(Ln 319897, Col 4)
YT2 = w(() => {
  fA();
  sY1();
  XO();
  tQ();
  vS();
  pb();
  c4();
  l2();
  tY1();
  O6A();
  NKA();
  dG0();
  GNA();
  GT2();
  I7 = c(QA(), 1)
})
// @from(Ln 319915, Col 0)
function VD1({
  param: {
    text: A
  },
  addMargin: Q
}) {
  let B = Q9(A, "bash-input");
  if (!B) return null;
  return Kc.createElement(T, {
    flexDirection: "column",
    marginTop: Q ? 1 : 0,
    width: "100%"
  }, Kc.createElement(T, null, Kc.createElement(C, {
    backgroundColor: "bashMessageBackgroundColor",
    color: "bashBorder"
  }, "!"), Kc.createElement(C, {
    backgroundColor: "bashMessageBackgroundColor",
    color: "text"
  }, " ", B, " ")))
}
// @from(Ln 319935, Col 4)
Kc
// @from(Ln 319936, Col 4)
Fz0 = w(() => {
  fA();
  tQ();
  Kc = c(QA(), 1)
})
// @from(Ln 319942, Col 0)
function JT2({
  addMargin: A,
  param: {
    text: Q
  }
}) {
  let B = Q9(Q, fz),
    G = Q9(Q, "command-args"),
    Z = Q9(Q, "skill-format") === "true";
  if (!B) return null;
  if (k(`UserCommandMessage rendering: "${B}" (args: "${G||"none"}", isSkillFormat: ${Z})`), Z) return UE.createElement(T, {
    flexDirection: "column",
    marginTop: A ? 1 : 0,
    width: "100%"
  }, UE.createElement(C, {
    backgroundColor: "userMessageBackground"
  }, UE.createElement(C, {
    color: "subtle"
  }, tA.pointer, " "), UE.createElement(C, {
    color: "text"
  }, "Skill(", B, ") ")));
  let Y = `/${[B,G].filter(Boolean).join(" ")}`;
  return UE.createElement(T, {
    flexDirection: "column",
    marginTop: A ? 1 : 0,
    width: "100%"
  }, UE.createElement(C, {
    backgroundColor: "userMessageBackground"
  }, UE.createElement(C, {
    color: "subtle"
  }, tA.pointer, " "), UE.createElement(C, {
    color: "text"
  }, Y, " ")))
}
// @from(Ln 319976, Col 4)
UE
// @from(Ln 319977, Col 4)
XT2 = w(() => {
  B2();
  fA();
  tQ();
  T1();
  cD();
  UE = c(QA(), 1)
})
// @from(Ln 319986, Col 0)
function IT2(A, Q, B) {
  return A.split(`
`).map((Z, Y) => {
    let J = Y === 0 ? Z : Z.trimStart(),
      X = Y === 0 ? "" : " ".repeat(Q),
      D = Math.max(0, B - (Y === 0 ? Q : 0) - X.length - A9(J) - 1);
    return X + J + " ".repeat(D) + " "
  }).join(`
`)
}
// @from(Ln 319996, Col 4)
DT2 = w(() => {
  UC()
})
// @from(Ln 320000, Col 0)
function Yb5(A, Q, B) {
  return A.split(`
`).map((Z, Y) => {
    let J = Y === 0 ? Z : Z.trimStart(),
      X = Y === 0 ? "" : " ".repeat(Q),
      D = Math.max(0, B - (Y === 0 ? Q : 0) - X.length - A9(J) - 1);
    return X + J + " ".repeat(D) + " "
  }).join(`
`)
}
// @from(Ln 320011, Col 0)
function WT2({
  text: A,
  thinkingMetadata: Q
}) {
  let {
    columns: B
  } = ZB(), G = B - 4, Z = G - Hz0 - 1, Y = MP(A, Z, "wrap"), J = Y.includes(`
`);
  if (!Q || Q.triggers.length === 0) {
    let K = J ? IT2(Y, Hz0, G) : Y + " ";
    return eD.createElement(C, {
      backgroundColor: "userMessageBackground"
    }, eD.createElement(C, {
      color: "subtle"
    }, tA.pointer, " "), eD.createElement(C, {
      color: "text"
    }, K))
  }
  let X = J ? Yb5(Y, Hz0, G) : Y + " ",
    I = Q.disabled ? void 0 : C91[Q.level],
    D = zDA(X),
    W = bRB(X, D);
  return eD.createElement(C, {
    backgroundColor: "userMessageBackground"
  }, eD.createElement(C, {
    color: "subtle"
  }, tA.pointer, " "), W.map((K, V) => eD.createElement(Jb5, {
    key: V,
    segment: K,
    triggerColor: I
  })))
}
// @from(Ln 320044, Col 0)
function Jb5({
  segment: A,
  triggerColor: Q
}) {
  if (!A.isTrigger) return eD.createElement(C, {
    color: "text"
  }, A.text);
  if (U91(A.text)) return eD.createElement(C, null, A.text.split("").map((B, G) => eD.createElement(C, {
    key: G,
    color: $jA(G, !1)
  }, B)));
  return eD.createElement(C, {
    color: Q
  }, A.text)
}
// @from(Ln 320059, Col 4)
eD
// @from(Ln 320059, Col 8)
Hz0 = 2
// @from(Ln 320060, Col 4)
KT2 = w(() => {
  B2();
  fA();
  UC();
  P4();
  Y_();
  DT2();
  eD = c(QA(), 1)
})
// @from(Ln 320070, Col 0)
function VT2({
  addMargin: A,
  param: {
    text: Q
  },
  thinkingMetadata: B
}) {
  let {
    columns: G
  } = ZB();
  if (!Q) return e(Error("No content found in user prompt message")), null;
  let Z = Q.replace(Xb5, "").replace(Ib5, "").replace(Db5, "").replace(Wb5, "").trim();
  return Ez0.default.createElement(T, {
    flexDirection: "column",
    marginTop: A ? 1 : 0,
    width: G - 4
  }, Ez0.default.createElement(WT2, {
    text: Z,
    thinkingMetadata: B
  }))
}
// @from(Ln 320091, Col 4)
Ez0
// @from(Ln 320091, Col 9)
Xb5
// @from(Ln 320091, Col 14)
Ib5
// @from(Ln 320091, Col 19)
Db5
// @from(Ln 320091, Col 24)
Wb5
// @from(Ln 320092, Col 4)
FT2 = w(() => {
  fA();
  v1();
  P4();
  KT2();
  Ez0 = c(QA(), 1), Xb5 = /<linked_ticket>[\s\S]*?<\/linked_ticket>\s*/g, Ib5 = /<linked_mockup>[\s\S]*?<\/linked_mockup>\s*/g, Db5 = /\[Linked ticket: [^\]]+\]\s*/g, Wb5 = /\[Linked mockup: [^\]]+\]\s*/g
})