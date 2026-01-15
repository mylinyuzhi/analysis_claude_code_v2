
// @from(Ln 331346, Col 4)
ix2 = U((mx2) => {
  Object.defineProperty(mx2, "__esModule", {
    value: !0
  });
  mx2.createMessageConnection = mx2.ConnectionOptions = mx2.MessageStrategy = mx2.CancellationStrategy = mx2.CancellationSenderStrategy = mx2.CancellationReceiverStrategy = mx2.RequestCancellationReceiverStrategy = mx2.IdCancellationReceiverStrategy = mx2.ConnectionStrategy = mx2.ConnectionError = mx2.ConnectionErrors = mx2.LogTraceNotification = mx2.SetTraceNotification = mx2.TraceFormat = mx2.TraceValues = mx2.Trace = mx2.NullLogger = mx2.ProgressType = mx2.ProgressToken = void 0;
  var bx2 = gs(),
    EI = zHA(),
    B6 = Z$0(),
    fx2 = J$0(),
    ZbA = $HA(),
    C$0 = rD1(),
    XbA;
  (function (A) {
    A.type = new B6.NotificationType("$/cancelRequest")
  })(XbA || (XbA = {}));
  var U$0;
  (function (A) {
    function Q(B) {
      return typeof B === "string" || typeof B === "number"
    }
    A.is = Q
  })(U$0 || (mx2.ProgressToken = U$0 = {}));
  var YbA;
  (function (A) {
    A.type = new B6.NotificationType("$/progress")
  })(YbA || (YbA = {}));
  class ux2 {
    constructor() {}
  }
  mx2.ProgressType = ux2;
  var q$0;
  (function (A) {
    function Q(B) {
      return EI.func(B)
    }
    A.is = Q
  })(q$0 || (q$0 = {}));
  mx2.NullLogger = Object.freeze({
    error: () => {},
    warn: () => {},
    info: () => {},
    log: () => {}
  });
  var WG;
  (function (A) {
    A[A.Off = 0] = "Off", A[A.Messages = 1] = "Messages", A[A.Compact = 2] = "Compact", A[A.Verbose = 3] = "Verbose"
  })(WG || (mx2.Trace = WG = {}));
  var hx2;
  (function (A) {
    A.Off = "off", A.Messages = "messages", A.Compact = "compact", A.Verbose = "verbose"
  })(hx2 || (mx2.TraceValues = hx2 = {}));
  (function (A) {
    function Q(G) {
      if (!EI.string(G)) return A.Off;
      switch (G = G.toLowerCase(), G) {
        case "off":
          return A.Off;
        case "messages":
          return A.Messages;
        case "compact":
          return A.Compact;
        case "verbose":
          return A.Verbose;
        default:
          return A.Off
      }
    }
    A.fromString = Q;

    function B(G) {
      switch (G) {
        case A.Off:
          return "off";
        case A.Messages:
          return "messages";
        case A.Compact:
          return "compact";
        case A.Verbose:
          return "verbose";
        default:
          return "off"
      }
    }
    A.toString = B
  })(WG || (mx2.Trace = WG = {}));
  var yO;
  (function (A) {
    A.Text = "text", A.JSON = "json"
  })(yO || (mx2.TraceFormat = yO = {}));
  (function (A) {
    function Q(B) {
      if (!EI.string(B)) return A.Text;
      if (B = B.toLowerCase(), B === "json") return A.JSON;
      else return A.Text
    }
    A.fromString = Q
  })(yO || (mx2.TraceFormat = yO = {}));
  var N$0;
  (function (A) {
    A.type = new B6.NotificationType("$/setTrace")
  })(N$0 || (mx2.SetTraceNotification = N$0 = {}));
  var sD1;
  (function (A) {
    A.type = new B6.NotificationType("$/logTrace")
  })(sD1 || (mx2.LogTraceNotification = sD1 = {}));
  var JbA;
  (function (A) {
    A[A.Closed = 1] = "Closed", A[A.Disposed = 2] = "Disposed", A[A.AlreadyListening = 3] = "AlreadyListening"
  })(JbA || (mx2.ConnectionErrors = JbA = {}));
  class UHA extends Error {
    constructor(A, Q) {
      super(Q);
      this.code = A, Object.setPrototypeOf(this, UHA.prototype)
    }
  }
  mx2.ConnectionError = UHA;
  var w$0;
  (function (A) {
    function Q(B) {
      let G = B;
      return G && EI.func(G.cancelUndispatched)
    }
    A.is = Q
  })(w$0 || (mx2.ConnectionStrategy = w$0 = {}));
  var tD1;
  (function (A) {
    function Q(B) {
      let G = B;
      return G && (G.kind === void 0 || G.kind === "id") && EI.func(G.createCancellationTokenSource) && (G.dispose === void 0 || EI.func(G.dispose))
    }
    A.is = Q
  })(tD1 || (mx2.IdCancellationReceiverStrategy = tD1 = {}));
  var L$0;
  (function (A) {
    function Q(B) {
      let G = B;
      return G && G.kind === "request" && EI.func(G.createCancellationTokenSource) && (G.dispose === void 0 || EI.func(G.dispose))
    }
    A.is = Q
  })(L$0 || (mx2.RequestCancellationReceiverStrategy = L$0 = {}));
  var eD1;
  (function (A) {
    A.Message = Object.freeze({
      createCancellationTokenSource(B) {
        return new C$0.CancellationTokenSource
      }
    });

    function Q(B) {
      return tD1.is(B) || L$0.is(B)
    }
    A.is = Q
  })(eD1 || (mx2.CancellationReceiverStrategy = eD1 = {}));
  var AW1;
  (function (A) {
    A.Message = Object.freeze({
      sendCancellation(B, G) {
        return B.sendNotification(XbA.type, {
          id: G
        })
      },
      cleanup(B) {}
    });

    function Q(B) {
      let G = B;
      return G && EI.func(G.sendCancellation) && EI.func(G.cleanup)
    }
    A.is = Q
  })(AW1 || (mx2.CancellationSenderStrategy = AW1 = {}));
  var QW1;
  (function (A) {
    A.Message = Object.freeze({
      receiver: eD1.Message,
      sender: AW1.Message
    });

    function Q(B) {
      let G = B;
      return G && eD1.is(G.receiver) && AW1.is(G.sender)
    }
    A.is = Q
  })(QW1 || (mx2.CancellationStrategy = QW1 = {}));
  var BW1;
  (function (A) {
    function Q(B) {
      let G = B;
      return G && EI.func(G.handleMessage)
    }
    A.is = Q
  })(BW1 || (mx2.MessageStrategy = BW1 = {}));
  var gx2;
  (function (A) {
    function Q(B) {
      let G = B;
      return G && (QW1.is(G.cancellationStrategy) || w$0.is(G.connectionStrategy) || BW1.is(G.messageStrategy))
    }
    A.is = Q
  })(gx2 || (mx2.ConnectionOptions = gx2 = {}));
  var Zx;
  (function (A) {
    A[A.New = 1] = "New", A[A.Listening = 2] = "Listening", A[A.Closed = 3] = "Closed", A[A.Disposed = 4] = "Disposed"
  })(Zx || (Zx = {}));

  function ch5(A, Q, B, G) {
    let Z = B !== void 0 ? B : mx2.NullLogger,
      Y = 0,
      J = 0,
      X = 0,
      I = "2.0",
      D = void 0,
      W = new Map,
      K = void 0,
      V = new Map,
      F = new Map,
      H, E = new fx2.LinkedMap,
      z = new Map,
      $ = new Set,
      O = new Map,
      L = WG.Off,
      M = yO.Text,
      _, j = Zx.New,
      x = new ZbA.Emitter,
      b = new ZbA.Emitter,
      S = new ZbA.Emitter,
      u = new ZbA.Emitter,
      f = new ZbA.Emitter,
      AA = G && G.cancellationStrategy ? G.cancellationStrategy : QW1.Message;

    function n(K1) {
      if (K1 === null) throw Error("Can't send requests with id null since the response can't be correlated.");
      return "req-" + K1.toString()
    }

    function y(K1) {
      if (K1 === null) return "res-unknown-" + (++X).toString();
      else return "res-" + K1.toString()
    }

    function p() {
      return "not-" + (++J).toString()
    }

    function GA(K1, $1) {
      if (B6.Message.isRequest($1)) K1.set(n($1.id), $1);
      else if (B6.Message.isResponse($1)) K1.set(y($1.id), $1);
      else K1.set(p(), $1)
    }

    function WA(K1) {
      return
    }

    function MA() {
      return j === Zx.Listening
    }

    function TA() {
      return j === Zx.Closed
    }

    function bA() {
      return j === Zx.Disposed
    }

    function jA() {
      if (j === Zx.New || j === Zx.Listening) j = Zx.Closed, b.fire(void 0)
    }

    function OA(K1) {
      x.fire([K1, void 0, void 0])
    }

    function IA(K1) {
      x.fire(K1)
    }
    A.onClose(jA), A.onError(OA), Q.onClose(jA), Q.onError(IA);

    function HA() {
      if (H || E.size === 0) return;
      H = (0, bx2.default)().timer.setImmediate(() => {
        H = void 0, zA()
      })
    }

    function ZA(K1) {
      if (B6.Message.isRequest(K1)) _A(K1);
      else if (B6.Message.isNotification(K1)) t(K1);
      else if (B6.Message.isResponse(K1)) s(K1);
      else BA(K1)
    }

    function zA() {
      if (E.size === 0) return;
      let K1 = E.shift();
      try {
        let $1 = G?.messageStrategy;
        if (BW1.is($1)) $1.handleMessage(K1, ZA);
        else ZA(K1)
      } finally {
        HA()
      }
    }
    let wA = (K1) => {
      try {
        if (B6.Message.isNotification(K1) && K1.method === XbA.type.method) {
          let $1 = K1.params.id,
            i1 = n($1),
            Q0 = E.get(i1);
          if (B6.Message.isRequest(Q0)) {
            let b0 = G?.connectionStrategy,
              UA = b0 && b0.cancelUndispatched ? b0.cancelUndispatched(Q0, WA) : WA(Q0);
            if (UA && (UA.error !== void 0 || UA.result !== void 0)) {
              E.delete(i1), O.delete($1), UA.id = Q0.id, xA(UA, K1.method, Date.now()), Q.write(UA).catch(() => Z.error("Sending response for canceled message failed."));
              return
            }
          }
          let c0 = O.get($1);
          if (c0 !== void 0) {
            c0.cancel(), G1(K1);
            return
          } else $.add($1)
        }
        GA(E, K1)
      } finally {
        HA()
      }
    };

    function _A(K1) {
      if (bA()) return;

      function $1(D1, U1, V1) {
        let H1 = {
          jsonrpc: I,
          id: K1.id
        };
        if (D1 instanceof B6.ResponseError) H1.error = D1.toJson();
        else H1.result = D1 === void 0 ? null : D1;
        xA(H1, U1, V1), Q.write(H1).catch(() => Z.error("Sending response failed."))
      }

      function i1(D1, U1, V1) {
        let H1 = {
          jsonrpc: I,
          id: K1.id,
          error: D1.toJson()
        };
        xA(H1, U1, V1), Q.write(H1).catch(() => Z.error("Sending response failed."))
      }

      function Q0(D1, U1, V1) {
        if (D1 === void 0) D1 = null;
        let H1 = {
          jsonrpc: I,
          id: K1.id,
          result: D1
        };
        xA(H1, U1, V1), Q.write(H1).catch(() => Z.error("Sending response failed."))
      }
      mA(K1);
      let c0 = W.get(K1.method),
        b0, UA;
      if (c0) b0 = c0.type, UA = c0.handler;
      let RA = Date.now();
      if (UA || D) {
        let D1 = K1.id ?? String(Date.now()),
          U1 = tD1.is(AA.receiver) ? AA.receiver.createCancellationTokenSource(D1) : AA.receiver.createCancellationTokenSource(K1);
        if (K1.id !== null && $.has(K1.id)) U1.cancel();
        if (K1.id !== null) O.set(D1, U1);
        try {
          let V1;
          if (UA)
            if (K1.params === void 0) {
              if (b0 !== void 0 && b0.numberOfParams !== 0) {
                i1(new B6.ResponseError(B6.ErrorCodes.InvalidParams, `Request ${K1.method} defines ${b0.numberOfParams} params but received none.`), K1.method, RA);
                return
              }
              V1 = UA(U1.token)
            } else if (Array.isArray(K1.params)) {
            if (b0 !== void 0 && b0.parameterStructures === B6.ParameterStructures.byName) {
              i1(new B6.ResponseError(B6.ErrorCodes.InvalidParams, `Request ${K1.method} defines parameters by name but received parameters by position`), K1.method, RA);
              return
            }
            V1 = UA(...K1.params, U1.token)
          } else {
            if (b0 !== void 0 && b0.parameterStructures === B6.ParameterStructures.byPosition) {
              i1(new B6.ResponseError(B6.ErrorCodes.InvalidParams, `Request ${K1.method} defines parameters by position but received parameters by name`), K1.method, RA);
              return
            }
            V1 = UA(K1.params, U1.token)
          } else if (D) V1 = D(K1.method, K1.params, U1.token);
          let H1 = V1;
          if (!V1) O.delete(D1), Q0(V1, K1.method, RA);
          else if (H1.then) H1.then((Y0) => {
            O.delete(D1), $1(Y0, K1.method, RA)
          }, (Y0) => {
            if (O.delete(D1), Y0 instanceof B6.ResponseError) i1(Y0, K1.method, RA);
            else if (Y0 && EI.string(Y0.message)) i1(new B6.ResponseError(B6.ErrorCodes.InternalError, `Request ${K1.method} failed with message: ${Y0.message}`), K1.method, RA);
            else i1(new B6.ResponseError(B6.ErrorCodes.InternalError, `Request ${K1.method} failed unexpectedly without providing any details.`), K1.method, RA)
          });
          else O.delete(D1), $1(V1, K1.method, RA)
        } catch (V1) {
          if (O.delete(D1), V1 instanceof B6.ResponseError) $1(V1, K1.method, RA);
          else if (V1 && EI.string(V1.message)) i1(new B6.ResponseError(B6.ErrorCodes.InternalError, `Request ${K1.method} failed with message: ${V1.message}`), K1.method, RA);
          else i1(new B6.ResponseError(B6.ErrorCodes.InternalError, `Request ${K1.method} failed unexpectedly without providing any details.`), K1.method, RA)
        }
      } else i1(new B6.ResponseError(B6.ErrorCodes.MethodNotFound, `Unhandled method ${K1.method}`), K1.method, RA)
    }

    function s(K1) {
      if (bA()) return;
      if (K1.id === null)
        if (K1.error) Z.error(`Received response message without id: Error is: 
${JSON.stringify(K1.error,void 0,4)}`);
        else Z.error("Received response message without id. No further error information provided.");
      else {
        let $1 = K1.id,
          i1 = z.get($1);
        if (J1(K1, i1), i1 !== void 0) {
          z.delete($1);
          try {
            if (K1.error) {
              let Q0 = K1.error;
              i1.reject(new B6.ResponseError(Q0.code, Q0.message, Q0.data))
            } else if (K1.result !== void 0) i1.resolve(K1.result);
            else throw Error("Should never happen.")
          } catch (Q0) {
            if (Q0.message) Z.error(`Response handler '${i1.method}' failed with message: ${Q0.message}`);
            else Z.error(`Response handler '${i1.method}' failed unexpectedly.`)
          }
        }
      }
    }

    function t(K1) {
      if (bA()) return;
      let $1 = void 0,
        i1;
      if (K1.method === XbA.type.method) {
        let Q0 = K1.params.id;
        $.delete(Q0), G1(K1);
        return
      } else {
        let Q0 = V.get(K1.method);
        if (Q0) i1 = Q0.handler, $1 = Q0.type
      }
      if (i1 || K) try {
        if (G1(K1), i1)
          if (K1.params === void 0) {
            if ($1 !== void 0) {
              if ($1.numberOfParams !== 0 && $1.parameterStructures !== B6.ParameterStructures.byName) Z.error(`Notification ${K1.method} defines ${$1.numberOfParams} params but received none.`)
            }
            i1()
          } else if (Array.isArray(K1.params)) {
          let Q0 = K1.params;
          if (K1.method === YbA.type.method && Q0.length === 2 && U$0.is(Q0[0])) i1({
            token: Q0[0],
            value: Q0[1]
          });
          else {
            if ($1 !== void 0) {
              if ($1.parameterStructures === B6.ParameterStructures.byName) Z.error(`Notification ${K1.method} defines parameters by name but received parameters by position`);
              if ($1.numberOfParams !== K1.params.length) Z.error(`Notification ${K1.method} defines ${$1.numberOfParams} params but received ${Q0.length} arguments`)
            }
            i1(...Q0)
          }
        } else {
          if ($1 !== void 0 && $1.parameterStructures === B6.ParameterStructures.byPosition) Z.error(`Notification ${K1.method} defines parameters by position but received parameters by name`);
          i1(K1.params)
        } else if (K) K(K1.method, K1.params)
      } catch (Q0) {
        if (Q0.message) Z.error(`Notification handler '${K1.method}' failed with message: ${Q0.message}`);
        else Z.error(`Notification handler '${K1.method}' failed unexpectedly.`)
      } else S.fire(K1)
    }

    function BA(K1) {
      if (!K1) {
        Z.error("Received empty message.");
        return
      }
      Z.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(K1,null,4)}`);
      let $1 = K1;
      if (EI.string($1.id) || EI.number($1.id)) {
        let i1 = $1.id,
          Q0 = z.get(i1);
        if (Q0) Q0.reject(Error("The received response has neither a result nor an error property."))
      }
    }

    function DA(K1) {
      if (K1 === void 0 || K1 === null) return;
      switch (L) {
        case WG.Verbose:
          return JSON.stringify(K1, null, 4);
        case WG.Compact:
          return JSON.stringify(K1);
        default:
          return
      }
    }

    function CA(K1) {
      if (L === WG.Off || !_) return;
      if (M === yO.Text) {
        let $1 = void 0;
        if ((L === WG.Verbose || L === WG.Compact) && K1.params) $1 = `Params: ${DA(K1.params)}

`;
        _.log(`Sending request '${K1.method} - (${K1.id})'.`, $1)
      } else SA("send-request", K1)
    }

    function FA(K1) {
      if (L === WG.Off || !_) return;
      if (M === yO.Text) {
        let $1 = void 0;
        if (L === WG.Verbose || L === WG.Compact)
          if (K1.params) $1 = `Params: ${DA(K1.params)}

`;
          else $1 = `No parameters provided.

`;
        _.log(`Sending notification '${K1.method}'.`, $1)
      } else SA("send-notification", K1)
    }

    function xA(K1, $1, i1) {
      if (L === WG.Off || !_) return;
      if (M === yO.Text) {
        let Q0 = void 0;
        if (L === WG.Verbose || L === WG.Compact) {
          if (K1.error && K1.error.data) Q0 = `Error data: ${DA(K1.error.data)}

`;
          else if (K1.result) Q0 = `Result: ${DA(K1.result)}

`;
          else if (K1.error === void 0) Q0 = `No result returned.

`
        }
        _.log(`Sending response '${$1} - (${K1.id})'. Processing request took ${Date.now()-i1}ms`, Q0)
      } else SA("send-response", K1)
    }

    function mA(K1) {
      if (L === WG.Off || !_) return;
      if (M === yO.Text) {
        let $1 = void 0;
        if ((L === WG.Verbose || L === WG.Compact) && K1.params) $1 = `Params: ${DA(K1.params)}

`;
        _.log(`Received request '${K1.method} - (${K1.id})'.`, $1)
      } else SA("receive-request", K1)
    }

    function G1(K1) {
      if (L === WG.Off || !_ || K1.method === sD1.type.method) return;
      if (M === yO.Text) {
        let $1 = void 0;
        if (L === WG.Verbose || L === WG.Compact)
          if (K1.params) $1 = `Params: ${DA(K1.params)}

`;
          else $1 = `No parameters provided.

`;
        _.log(`Received notification '${K1.method}'.`, $1)
      } else SA("receive-notification", K1)
    }

    function J1(K1, $1) {
      if (L === WG.Off || !_) return;
      if (M === yO.Text) {
        let i1 = void 0;
        if (L === WG.Verbose || L === WG.Compact) {
          if (K1.error && K1.error.data) i1 = `Error data: ${DA(K1.error.data)}

`;
          else if (K1.result) i1 = `Result: ${DA(K1.result)}

`;
          else if (K1.error === void 0) i1 = `No result returned.

`
        }
        if ($1) {
          let Q0 = K1.error ? ` Request failed: ${K1.error.message} (${K1.error.code}).` : "";
          _.log(`Received response '${$1.method} - (${K1.id})' in ${Date.now()-$1.timerStart}ms.${Q0}`, i1)
        } else _.log(`Received response ${K1.id} without active response promise.`, i1)
      } else SA("receive-response", K1)
    }

    function SA(K1, $1) {
      if (!_ || L === WG.Off) return;
      let i1 = {
        isLSPMessage: !0,
        type: K1,
        message: $1,
        timestamp: Date.now()
      };
      _.log(i1)
    }

    function A1() {
      if (TA()) throw new UHA(JbA.Closed, "Connection is closed.");
      if (bA()) throw new UHA(JbA.Disposed, "Connection is disposed.")
    }

    function n1() {
      if (MA()) throw new UHA(JbA.AlreadyListening, "Connection is already listening")
    }

    function S1() {
      if (!MA()) throw Error("Call listen() first.")
    }

    function L0(K1) {
      if (K1 === void 0) return null;
      else return K1
    }

    function VQ(K1) {
      if (K1 === null) return;
      else return K1
    }

    function t0(K1) {
      return K1 !== void 0 && K1 !== null && !Array.isArray(K1) && typeof K1 === "object"
    }

    function QQ(K1, $1) {
      switch (K1) {
        case B6.ParameterStructures.auto:
          if (t0($1)) return VQ($1);
          else return [L0($1)];
        case B6.ParameterStructures.byName:
          if (!t0($1)) throw Error("Received parameters by name but param is not an object literal.");
          return VQ($1);
        case B6.ParameterStructures.byPosition:
          return [L0($1)];
        default:
          throw Error(`Unknown parameter structure ${K1.toString()}`)
      }
    }

    function y1(K1, $1) {
      let i1, Q0 = K1.numberOfParams;
      switch (Q0) {
        case 0:
          i1 = void 0;
          break;
        case 1:
          i1 = QQ(K1.parameterStructures, $1[0]);
          break;
        default:
          i1 = [];
          for (let c0 = 0; c0 < $1.length && c0 < Q0; c0++) i1.push(L0($1[c0]));
          if ($1.length < Q0)
            for (let c0 = $1.length; c0 < Q0; c0++) i1.push(null);
          break
      }
      return i1
    }
    let qQ = {
      sendNotification: (K1, ...$1) => {
        A1();
        let i1, Q0;
        if (EI.string(K1)) {
          i1 = K1;
          let b0 = $1[0],
            UA = 0,
            RA = B6.ParameterStructures.auto;
          if (B6.ParameterStructures.is(b0)) UA = 1, RA = b0;
          let D1 = $1.length,
            U1 = D1 - UA;
          switch (U1) {
            case 0:
              Q0 = void 0;
              break;
            case 1:
              Q0 = QQ(RA, $1[UA]);
              break;
            default:
              if (RA === B6.ParameterStructures.byName) throw Error(`Received ${U1} parameters for 'by Name' notification parameter structure.`);
              Q0 = $1.slice(UA, D1).map((V1) => L0(V1));
              break
          }
        } else {
          let b0 = $1;
          i1 = K1.method, Q0 = y1(K1, b0)
        }
        let c0 = {
          jsonrpc: I,
          method: i1,
          params: Q0
        };
        return FA(c0), Q.write(c0).catch((b0) => {
          throw Z.error("Sending notification failed."), b0
        })
      },
      onNotification: (K1, $1) => {
        A1();
        let i1;
        if (EI.func(K1)) K = K1;
        else if ($1)
          if (EI.string(K1)) i1 = K1, V.set(K1, {
            type: void 0,
            handler: $1
          });
          else i1 = K1.method, V.set(K1.method, {
            type: K1,
            handler: $1
          });
        return {
          dispose: () => {
            if (i1 !== void 0) V.delete(i1);
            else K = void 0
          }
        }
      },
      onProgress: (K1, $1, i1) => {
        if (F.has($1)) throw Error(`Progress handler for token ${$1} already registered`);
        return F.set($1, i1), {
          dispose: () => {
            F.delete($1)
          }
        }
      },
      sendProgress: (K1, $1, i1) => {
        return qQ.sendNotification(YbA.type, {
          token: $1,
          value: i1
        })
      },
      onUnhandledProgress: u.event,
      sendRequest: (K1, ...$1) => {
        A1(), S1();
        let i1, Q0, c0 = void 0;
        if (EI.string(K1)) {
          i1 = K1;
          let D1 = $1[0],
            U1 = $1[$1.length - 1],
            V1 = 0,
            H1 = B6.ParameterStructures.auto;
          if (B6.ParameterStructures.is(D1)) V1 = 1, H1 = D1;
          let Y0 = $1.length;
          if (C$0.CancellationToken.is(U1)) Y0 = Y0 - 1, c0 = U1;
          let c1 = Y0 - V1;
          switch (c1) {
            case 0:
              Q0 = void 0;
              break;
            case 1:
              Q0 = QQ(H1, $1[V1]);
              break;
            default:
              if (H1 === B6.ParameterStructures.byName) throw Error(`Received ${c1} parameters for 'by Name' request parameter structure.`);
              Q0 = $1.slice(V1, Y0).map((p0) => L0(p0));
              break
          }
        } else {
          let D1 = $1;
          i1 = K1.method, Q0 = y1(K1, D1);
          let U1 = K1.numberOfParams;
          c0 = C$0.CancellationToken.is(D1[U1]) ? D1[U1] : void 0
        }
        let b0 = Y++,
          UA;
        if (c0) UA = c0.onCancellationRequested(() => {
          let D1 = AA.sender.sendCancellation(qQ, b0);
          if (D1 === void 0) return Z.log(`Received no promise from cancellation strategy when cancelling id ${b0}`), Promise.resolve();
          else return D1.catch(() => {
            Z.log(`Sending cancellation messages for id ${b0} failed`)
          })
        });
        let RA = {
          jsonrpc: I,
          id: b0,
          method: i1,
          params: Q0
        };
        if (CA(RA), typeof AA.sender.enableCancellation === "function") AA.sender.enableCancellation(RA);
        return new Promise(async (D1, U1) => {
          let V1 = (c1) => {
              D1(c1), AA.sender.cleanup(b0), UA?.dispose()
            },
            H1 = (c1) => {
              U1(c1), AA.sender.cleanup(b0), UA?.dispose()
            },
            Y0 = {
              method: i1,
              timerStart: Date.now(),
              resolve: V1,
              reject: H1
            };
          try {
            z.set(b0, Y0), await Q.write(RA)
          } catch (c1) {
            throw z.delete(b0), Y0.reject(new B6.ResponseError(B6.ErrorCodes.MessageWriteError, c1.message ? c1.message : "Unknown reason")), Z.error("Sending request failed."), c1
          }
        })
      },
      onRequest: (K1, $1) => {
        A1();
        let i1 = null;
        if (q$0.is(K1)) i1 = void 0, D = K1;
        else if (EI.string(K1)) {
          if (i1 = null, $1 !== void 0) i1 = K1, W.set(K1, {
            handler: $1,
            type: void 0
          })
        } else if ($1 !== void 0) i1 = K1.method, W.set(K1.method, {
          type: K1,
          handler: $1
        });
        return {
          dispose: () => {
            if (i1 === null) return;
            if (i1 !== void 0) W.delete(i1);
            else D = void 0
          }
        }
      },
      hasPendingResponse: () => {
        return z.size > 0
      },
      trace: async (K1, $1, i1) => {
        let Q0 = !1,
          c0 = yO.Text;
        if (i1 !== void 0)
          if (EI.boolean(i1)) Q0 = i1;
          else Q0 = i1.sendNotification || !1, c0 = i1.traceFormat || yO.Text;
        if (L = K1, M = c0, L === WG.Off) _ = void 0;
        else _ = $1;
        if (Q0 && !TA() && !bA()) await qQ.sendNotification(N$0.type, {
          value: WG.toString(K1)
        })
      },
      onError: x.event,
      onClose: b.event,
      onUnhandledNotification: S.event,
      onDispose: f.event,
      end: () => {
        Q.end()
      },
      dispose: () => {
        if (bA()) return;
        j = Zx.Disposed, f.fire(void 0);
        let K1 = new B6.ResponseError(B6.ErrorCodes.PendingResponseRejected, "Pending response rejected since connection got disposed");
        for (let $1 of z.values()) $1.reject(K1);
        if (z = new Map, O = new Map, $ = new Set, E = new fx2.LinkedMap, EI.func(Q.dispose)) Q.dispose();
        if (EI.func(A.dispose)) A.dispose()
      },
      listen: () => {
        A1(), n1(), j = Zx.Listening, A.listen(wA)
      },
      inspect: () => {
        (0, bx2.default)().console.log("inspect")
      }
    };
    return qQ.onNotification(sD1.type, (K1) => {
      if (L === WG.Off || !_) return;
      let $1 = L === WG.Verbose || L === WG.Compact;
      _.log(K1.message, $1 ? K1.verbose : void 0)
    }), qQ.onNotification(YbA.type, (K1) => {
      let $1 = F.get(K1.token);
      if ($1) $1(K1.value);
      else u.fire(K1)
    }), qQ
  }
  mx2.createMessageConnection = ch5
})
// @from(Ln 332223, Col 4)
GW1 = U((K9) => {
  Object.defineProperty(K9, "__esModule", {
    value: !0
  });
  K9.ProgressType = K9.ProgressToken = K9.createMessageConnection = K9.NullLogger = K9.ConnectionOptions = K9.ConnectionStrategy = K9.AbstractMessageBuffer = K9.WriteableStreamMessageWriter = K9.AbstractMessageWriter = K9.MessageWriter = K9.ReadableStreamMessageReader = K9.AbstractMessageReader = K9.MessageReader = K9.SharedArrayReceiverStrategy = K9.SharedArraySenderStrategy = K9.CancellationToken = K9.CancellationTokenSource = K9.Emitter = K9.Event = K9.Disposable = K9.LRUCache = K9.Touch = K9.LinkedMap = K9.ParameterStructures = K9.NotificationType9 = K9.NotificationType8 = K9.NotificationType7 = K9.NotificationType6 = K9.NotificationType5 = K9.NotificationType4 = K9.NotificationType3 = K9.NotificationType2 = K9.NotificationType1 = K9.NotificationType0 = K9.NotificationType = K9.ErrorCodes = K9.ResponseError = K9.RequestType9 = K9.RequestType8 = K9.RequestType7 = K9.RequestType6 = K9.RequestType5 = K9.RequestType4 = K9.RequestType3 = K9.RequestType2 = K9.RequestType1 = K9.RequestType0 = K9.RequestType = K9.Message = K9.RAL = void 0;
  K9.MessageStrategy = K9.CancellationStrategy = K9.CancellationSenderStrategy = K9.CancellationReceiverStrategy = K9.ConnectionError = K9.ConnectionErrors = K9.LogTraceNotification = K9.SetTraceNotification = K9.TraceFormat = K9.TraceValues = K9.Trace = void 0;
  var tY = Z$0();
  Object.defineProperty(K9, "Message", {
    enumerable: !0,
    get: function () {
      return tY.Message
    }
  });
  Object.defineProperty(K9, "RequestType", {
    enumerable: !0,
    get: function () {
      return tY.RequestType
    }
  });
  Object.defineProperty(K9, "RequestType0", {
    enumerable: !0,
    get: function () {
      return tY.RequestType0
    }
  });
  Object.defineProperty(K9, "RequestType1", {
    enumerable: !0,
    get: function () {
      return tY.RequestType1
    }
  });
  Object.defineProperty(K9, "RequestType2", {
    enumerable: !0,
    get: function () {
      return tY.RequestType2
    }
  });
  Object.defineProperty(K9, "RequestType3", {
    enumerable: !0,
    get: function () {
      return tY.RequestType3
    }
  });
  Object.defineProperty(K9, "RequestType4", {
    enumerable: !0,
    get: function () {
      return tY.RequestType4
    }
  });
  Object.defineProperty(K9, "RequestType5", {
    enumerable: !0,
    get: function () {
      return tY.RequestType5
    }
  });
  Object.defineProperty(K9, "RequestType6", {
    enumerable: !0,
    get: function () {
      return tY.RequestType6
    }
  });
  Object.defineProperty(K9, "RequestType7", {
    enumerable: !0,
    get: function () {
      return tY.RequestType7
    }
  });
  Object.defineProperty(K9, "RequestType8", {
    enumerable: !0,
    get: function () {
      return tY.RequestType8
    }
  });
  Object.defineProperty(K9, "RequestType9", {
    enumerable: !0,
    get: function () {
      return tY.RequestType9
    }
  });
  Object.defineProperty(K9, "ResponseError", {
    enumerable: !0,
    get: function () {
      return tY.ResponseError
    }
  });
  Object.defineProperty(K9, "ErrorCodes", {
    enumerable: !0,
    get: function () {
      return tY.ErrorCodes
    }
  });
  Object.defineProperty(K9, "NotificationType", {
    enumerable: !0,
    get: function () {
      return tY.NotificationType
    }
  });
  Object.defineProperty(K9, "NotificationType0", {
    enumerable: !0,
    get: function () {
      return tY.NotificationType0
    }
  });
  Object.defineProperty(K9, "NotificationType1", {
    enumerable: !0,
    get: function () {
      return tY.NotificationType1
    }
  });
  Object.defineProperty(K9, "NotificationType2", {
    enumerable: !0,
    get: function () {
      return tY.NotificationType2
    }
  });
  Object.defineProperty(K9, "NotificationType3", {
    enumerable: !0,
    get: function () {
      return tY.NotificationType3
    }
  });
  Object.defineProperty(K9, "NotificationType4", {
    enumerable: !0,
    get: function () {
      return tY.NotificationType4
    }
  });
  Object.defineProperty(K9, "NotificationType5", {
    enumerable: !0,
    get: function () {
      return tY.NotificationType5
    }
  });
  Object.defineProperty(K9, "NotificationType6", {
    enumerable: !0,
    get: function () {
      return tY.NotificationType6
    }
  });
  Object.defineProperty(K9, "NotificationType7", {
    enumerable: !0,
    get: function () {
      return tY.NotificationType7
    }
  });
  Object.defineProperty(K9, "NotificationType8", {
    enumerable: !0,
    get: function () {
      return tY.NotificationType8
    }
  });
  Object.defineProperty(K9, "NotificationType9", {
    enumerable: !0,
    get: function () {
      return tY.NotificationType9
    }
  });
  Object.defineProperty(K9, "ParameterStructures", {
    enumerable: !0,
    get: function () {
      return tY.ParameterStructures
    }
  });
  var O$0 = J$0();
  Object.defineProperty(K9, "LinkedMap", {
    enumerable: !0,
    get: function () {
      return O$0.LinkedMap
    }
  });
  Object.defineProperty(K9, "LRUCache", {
    enumerable: !0,
    get: function () {
      return O$0.LRUCache
    }
  });
  Object.defineProperty(K9, "Touch", {
    enumerable: !0,
    get: function () {
      return O$0.Touch
    }
  });
  var Yg5 = Ax2();
  Object.defineProperty(K9, "Disposable", {
    enumerable: !0,
    get: function () {
      return Yg5.Disposable
    }
  });
  var nx2 = $HA();
  Object.defineProperty(K9, "Event", {
    enumerable: !0,
    get: function () {
      return nx2.Event
    }
  });
  Object.defineProperty(K9, "Emitter", {
    enumerable: !0,
    get: function () {
      return nx2.Emitter
    }
  });
  var ax2 = rD1();
  Object.defineProperty(K9, "CancellationTokenSource", {
    enumerable: !0,
    get: function () {
      return ax2.CancellationTokenSource
    }
  });
  Object.defineProperty(K9, "CancellationToken", {
    enumerable: !0,
    get: function () {
      return ax2.CancellationToken
    }
  });
  var ox2 = Ex2();
  Object.defineProperty(K9, "SharedArraySenderStrategy", {
    enumerable: !0,
    get: function () {
      return ox2.SharedArraySenderStrategy
    }
  });
  Object.defineProperty(K9, "SharedArrayReceiverStrategy", {
    enumerable: !0,
    get: function () {
      return ox2.SharedArrayReceiverStrategy
    }
  });
  var M$0 = Lx2();
  Object.defineProperty(K9, "MessageReader", {
    enumerable: !0,
    get: function () {
      return M$0.MessageReader
    }
  });
  Object.defineProperty(K9, "AbstractMessageReader", {
    enumerable: !0,
    get: function () {
      return M$0.AbstractMessageReader
    }
  });
  Object.defineProperty(K9, "ReadableStreamMessageReader", {
    enumerable: !0,
    get: function () {
      return M$0.ReadableStreamMessageReader
    }
  });
  var R$0 = Sx2();
  Object.defineProperty(K9, "MessageWriter", {
    enumerable: !0,
    get: function () {
      return R$0.MessageWriter
    }
  });
  Object.defineProperty(K9, "AbstractMessageWriter", {
    enumerable: !0,
    get: function () {
      return R$0.AbstractMessageWriter
    }
  });
  Object.defineProperty(K9, "WriteableStreamMessageWriter", {
    enumerable: !0,
    get: function () {
      return R$0.WriteableStreamMessageWriter
    }
  });
  var Jg5 = kx2();
  Object.defineProperty(K9, "AbstractMessageBuffer", {
    enumerable: !0,
    get: function () {
      return Jg5.AbstractMessageBuffer
    }
  });
  var wE = ix2();
  Object.defineProperty(K9, "ConnectionStrategy", {
    enumerable: !0,
    get: function () {
      return wE.ConnectionStrategy
    }
  });
  Object.defineProperty(K9, "ConnectionOptions", {
    enumerable: !0,
    get: function () {
      return wE.ConnectionOptions
    }
  });
  Object.defineProperty(K9, "NullLogger", {
    enumerable: !0,
    get: function () {
      return wE.NullLogger
    }
  });
  Object.defineProperty(K9, "createMessageConnection", {
    enumerable: !0,
    get: function () {
      return wE.createMessageConnection
    }
  });
  Object.defineProperty(K9, "ProgressToken", {
    enumerable: !0,
    get: function () {
      return wE.ProgressToken
    }
  });
  Object.defineProperty(K9, "ProgressType", {
    enumerable: !0,
    get: function () {
      return wE.ProgressType
    }
  });
  Object.defineProperty(K9, "Trace", {
    enumerable: !0,
    get: function () {
      return wE.Trace
    }
  });
  Object.defineProperty(K9, "TraceValues", {
    enumerable: !0,
    get: function () {
      return wE.TraceValues
    }
  });
  Object.defineProperty(K9, "TraceFormat", {
    enumerable: !0,
    get: function () {
      return wE.TraceFormat
    }
  });
  Object.defineProperty(K9, "SetTraceNotification", {
    enumerable: !0,
    get: function () {
      return wE.SetTraceNotification
    }
  });
  Object.defineProperty(K9, "LogTraceNotification", {
    enumerable: !0,
    get: function () {
      return wE.LogTraceNotification
    }
  });
  Object.defineProperty(K9, "ConnectionErrors", {
    enumerable: !0,
    get: function () {
      return wE.ConnectionErrors
    }
  });
  Object.defineProperty(K9, "ConnectionError", {
    enumerable: !0,
    get: function () {
      return wE.ConnectionError
    }
  });
  Object.defineProperty(K9, "CancellationReceiverStrategy", {
    enumerable: !0,
    get: function () {
      return wE.CancellationReceiverStrategy
    }
  });
  Object.defineProperty(K9, "CancellationSenderStrategy", {
    enumerable: !0,
    get: function () {
      return wE.CancellationSenderStrategy
    }
  });
  Object.defineProperty(K9, "CancellationStrategy", {
    enumerable: !0,
    get: function () {
      return wE.CancellationStrategy
    }
  });
  Object.defineProperty(K9, "MessageStrategy", {
    enumerable: !0,
    get: function () {
      return wE.MessageStrategy
    }
  });
  var Xg5 = gs();
  K9.RAL = Xg5.default
})
// @from(Ln 332602, Col 4)
Qy2 = U((Ay2) => {
  Object.defineProperty(Ay2, "__esModule", {
    value: !0
  });
  var rx2 = NA("util"),
    Oc = GW1();
  class ZW1 extends Oc.AbstractMessageBuffer {
    constructor(A = "utf-8") {
      super(A)
    }
    emptyBuffer() {
      return ZW1.emptyBuffer
    }
    fromString(A, Q) {
      return Buffer.from(A, Q)
    }
    toString(A, Q) {
      if (A instanceof Buffer) return A.toString(Q);
      else return new rx2.TextDecoder(Q).decode(A)
    }
    asNative(A, Q) {
      if (Q === void 0) return A instanceof Buffer ? A : Buffer.from(A);
      else return A instanceof Buffer ? A.slice(0, Q) : Buffer.from(A, 0, Q)
    }
    allocNative(A) {
      return Buffer.allocUnsafe(A)
    }
  }
  ZW1.emptyBuffer = Buffer.allocUnsafe(0);
  class sx2 {
    constructor(A) {
      this.stream = A
    }
    onClose(A) {
      return this.stream.on("close", A), Oc.Disposable.create(() => this.stream.off("close", A))
    }
    onError(A) {
      return this.stream.on("error", A), Oc.Disposable.create(() => this.stream.off("error", A))
    }
    onEnd(A) {
      return this.stream.on("end", A), Oc.Disposable.create(() => this.stream.off("end", A))
    }
    onData(A) {
      return this.stream.on("data", A), Oc.Disposable.create(() => this.stream.off("data", A))
    }
  }
  class tx2 {
    constructor(A) {
      this.stream = A
    }
    onClose(A) {
      return this.stream.on("close", A), Oc.Disposable.create(() => this.stream.off("close", A))
    }
    onError(A) {
      return this.stream.on("error", A), Oc.Disposable.create(() => this.stream.off("error", A))
    }
    onEnd(A) {
      return this.stream.on("end", A), Oc.Disposable.create(() => this.stream.off("end", A))
    }
    write(A, Q) {
      return new Promise((B, G) => {
        let Z = (Y) => {
          if (Y === void 0 || Y === null) B();
          else G(Y)
        };
        if (typeof A === "string") this.stream.write(A, Q, Z);
        else this.stream.write(A, Z)
      })
    }
    end() {
      this.stream.end()
    }
  }
  var ex2 = Object.freeze({
    messageBuffer: Object.freeze({
      create: (A) => new ZW1(A)
    }),
    applicationJson: Object.freeze({
      encoder: Object.freeze({
        name: "application/json",
        encode: (A, Q) => {
          try {
            return Promise.resolve(Buffer.from(JSON.stringify(A, void 0, 0), Q.charset))
          } catch (B) {
            return Promise.reject(B)
          }
        }
      }),
      decoder: Object.freeze({
        name: "application/json",
        decode: (A, Q) => {
          try {
            if (A instanceof Buffer) return Promise.resolve(JSON.parse(A.toString(Q.charset)));
            else return Promise.resolve(JSON.parse(new rx2.TextDecoder(Q.charset).decode(A)))
          } catch (B) {
            return Promise.reject(B)
          }
        }
      })
    }),
    stream: Object.freeze({
      asReadableStream: (A) => new sx2(A),
      asWritableStream: (A) => new tx2(A)
    }),
    console,
    timer: Object.freeze({
      setTimeout(A, Q, ...B) {
        let G = setTimeout(A, Q, ...B);
        return {
          dispose: () => clearTimeout(G)
        }
      },
      setImmediate(A, ...Q) {
        let B = setImmediate(A, ...Q);
        return {
          dispose: () => clearImmediate(B)
        }
      },
      setInterval(A, Q, ...B) {
        let G = setInterval(A, Q, ...B);
        return {
          dispose: () => clearInterval(G)
        }
      }
    })
  });

  function _$0() {
    return ex2
  }(function (A) {
    function Q() {
      Oc.RAL.install(ex2)
    }
    A.install = Q
  })(_$0 || (_$0 = {}));
  Ay2.default = _$0
})
// @from(Ln 332739, Col 4)
Iy2 = U((i5) => {
  var Vg5 = i5 && i5.__createBinding || (Object.create ? function (A, Q, B, G) {
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
    Fg5 = i5 && i5.__exportStar || function (A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) Vg5(Q, A, B)
    };
  Object.defineProperty(i5, "__esModule", {
    value: !0
  });
  i5.createMessageConnection = i5.createServerSocketTransport = i5.createClientSocketTransport = i5.createServerPipeTransport = i5.createClientPipeTransport = i5.generateRandomPipeName = i5.StreamMessageWriter = i5.StreamMessageReader = i5.SocketMessageWriter = i5.SocketMessageReader = i5.PortMessageWriter = i5.PortMessageReader = i5.IPCMessageWriter = i5.IPCMessageReader = void 0;
  var qHA = Qy2();
  qHA.default.install();
  var By2 = NA("path"),
    Hg5 = NA("os"),
    Eg5 = NA("crypto"),
    YW1 = NA("net"),
    vO = GW1();
  Fg5(GW1(), i5);
  class Zy2 extends vO.AbstractMessageReader {
    constructor(A) {
      super();
      this.process = A;
      let Q = this.process;
      Q.on("error", (B) => this.fireError(B)), Q.on("close", () => this.fireClose())
    }
    listen(A) {
      return this.process.on("message", A), vO.Disposable.create(() => this.process.off("message", A))
    }
  }
  i5.IPCMessageReader = Zy2;
  class Yy2 extends vO.AbstractMessageWriter {
    constructor(A) {
      super();
      this.process = A, this.errorCount = 0;
      let Q = this.process;
      Q.on("error", (B) => this.fireError(B)), Q.on("close", () => this.fireClose)
    }
    write(A) {
      try {
        if (typeof this.process.send === "function") this.process.send(A, void 0, void 0, (Q) => {
          if (Q) this.errorCount++, this.handleError(Q, A);
          else this.errorCount = 0
        });
        return Promise.resolve()
      } catch (Q) {
        return this.handleError(Q, A), Promise.reject(Q)
      }
    }
    handleError(A, Q) {
      this.errorCount++, this.fireError(A, Q, this.errorCount)
    }
    end() {}
  }
  i5.IPCMessageWriter = Yy2;
  class Jy2 extends vO.AbstractMessageReader {
    constructor(A) {
      super();
      this.onData = new vO.Emitter, A.on("close", () => this.fireClose), A.on("error", (Q) => this.fireError(Q)), A.on("message", (Q) => {
        this.onData.fire(Q)
      })
    }
    listen(A) {
      return this.onData.event(A)
    }
  }
  i5.PortMessageReader = Jy2;
  class Xy2 extends vO.AbstractMessageWriter {
    constructor(A) {
      super();
      this.port = A, this.errorCount = 0, A.on("close", () => this.fireClose()), A.on("error", (Q) => this.fireError(Q))
    }
    write(A) {
      try {
        return this.port.postMessage(A), Promise.resolve()
      } catch (Q) {
        return this.handleError(Q, A), Promise.reject(Q)
      }
    }
    handleError(A, Q) {
      this.errorCount++, this.fireError(A, Q, this.errorCount)
    }
    end() {}
  }
  i5.PortMessageWriter = Xy2;
  class NHA extends vO.ReadableStreamMessageReader {
    constructor(A, Q = "utf-8") {
      super((0, qHA.default)().stream.asReadableStream(A), Q)
    }
  }
  i5.SocketMessageReader = NHA;
  class wHA extends vO.WriteableStreamMessageWriter {
    constructor(A, Q) {
      super((0, qHA.default)().stream.asWritableStream(A), Q);
      this.socket = A
    }
    dispose() {
      super.dispose(), this.socket.destroy()
    }
  }
  i5.SocketMessageWriter = wHA;
  class j$0 extends vO.ReadableStreamMessageReader {
    constructor(A, Q) {
      super((0, qHA.default)().stream.asReadableStream(A), Q)
    }
  }
  i5.StreamMessageReader = j$0;
  class T$0 extends vO.WriteableStreamMessageWriter {
    constructor(A, Q) {
      super((0, qHA.default)().stream.asWritableStream(A), Q)
    }
  }
  i5.StreamMessageWriter = T$0;
  var Gy2 = process.env.XDG_RUNTIME_DIR,
    zg5 = new Map([
      ["linux", 107],
      ["darwin", 103]
    ]);

  function $g5() {
    let A = (0, Eg5.randomBytes)(21).toString("hex");
    if (process.platform === "win32") return `\\\\.\\pipe\\vscode-jsonrpc-${A}-sock`;
    let Q;
    if (Gy2) Q = By2.join(Gy2, `vscode-ipc-${A}.sock`);
    else Q = By2.join(Hg5.tmpdir(), `vscode-${A}.sock`);
    let B = zg5.get(process.platform);
    if (B !== void 0 && Q.length > B)(0, qHA.default)().console.warn(`WARNING: IPC handle "${Q}" is longer than ${B} characters.`);
    return Q
  }
  i5.generateRandomPipeName = $g5;

  function Cg5(A, Q = "utf-8") {
    let B, G = new Promise((Z, Y) => {
      B = Z
    });
    return new Promise((Z, Y) => {
      let J = (0, YW1.createServer)((X) => {
        J.close(), B([new NHA(X, Q), new wHA(X, Q)])
      });
      J.on("error", Y), J.listen(A, () => {
        J.removeListener("error", Y), Z({
          onConnected: () => {
            return G
          }
        })
      })
    })
  }
  i5.createClientPipeTransport = Cg5;

  function Ug5(A, Q = "utf-8") {
    let B = (0, YW1.createConnection)(A);
    return [new NHA(B, Q), new wHA(B, Q)]
  }
  i5.createServerPipeTransport = Ug5;

  function qg5(A, Q = "utf-8") {
    let B, G = new Promise((Z, Y) => {
      B = Z
    });
    return new Promise((Z, Y) => {
      let J = (0, YW1.createServer)((X) => {
        J.close(), B([new NHA(X, Q), new wHA(X, Q)])
      });
      J.on("error", Y), J.listen(A, "127.0.0.1", () => {
        J.removeListener("error", Y), Z({
          onConnected: () => {
            return G
          }
        })
      })
    })
  }
  i5.createClientSocketTransport = qg5;

  function Ng5(A, Q = "utf-8") {
    let B = (0, YW1.createConnection)(A, "127.0.0.1");
    return [new NHA(B, Q), new wHA(B, Q)]
  }
  i5.createServerSocketTransport = Ng5;

  function wg5(A) {
    let Q = A;
    return Q.read !== void 0 && Q.addListener !== void 0
  }

  function Lg5(A) {
    let Q = A;
    return Q.write !== void 0 && Q.addListener !== void 0
  }

  function Og5(A, Q, B, G) {
    if (!B) B = vO.NullLogger;
    let Z = wg5(A) ? new j$0(A) : A,
      Y = Lg5(Q) ? new T$0(Q) : Q;
    if (vO.ConnectionStrategy.is(G)) G = {
      connectionStrategy: G
    };
    return (0, vO.createMessageConnection)(Z, Y, B, G)
  }
  i5.createMessageConnection = Og5
})
// @from(Ln 332957, Col 0)
function Dy2(A) {
  let Q, B, G, Z = !1,
    Y = !1,
    J, X = !1,
    I = [],
    D = [];

  function W() {
    if (Y) throw J || Error(`LSP server ${A} failed to start`)
  }
  return {
    get capabilities() {
      return G
    },
    get isInitialized() {
      return Z
    },
    async start(K, V, F) {
      try {
        if (Q = Mg5(K, V, {
            stdio: ["pipe", "pipe", "pipe"],
            env: F?.env ? {
              ...globalThis.process.env,
              ...F.env
            } : void 0,
            cwd: F?.cwd
          }), !Q.stdout || !Q.stdin) throw Error("LSP server process stdio not available");
        let H = Q;
        if (await new Promise(($, O) => {
            let L = () => {
                _(), $()
              },
              M = (j) => {
                _(), O(j)
              },
              _ = () => {
                H.removeListener("spawn", L), H.removeListener("error", M)
              };
            H.once("spawn", L), H.once("error", M)
          }), Q.stderr) Q.stderr.on("data", ($) => {
          let O = $.toString().trim();
          if (O) k(`[LSP SERVER ${A}] ${O}`)
        });
        Q.on("error", ($) => {
          if (!X) Y = !0, J = $, e(Error(`LSP server ${A} failed to start: ${$.message}`))
        }), Q.on("exit", ($, O) => {
          if ($ !== 0 && $ !== null && !X) Z = !1, Y = !1, J = void 0, e(Error(`LSP server ${A} crashed with exit code ${$}`))
        }), Q.stdin.on("error", ($) => {
          if (!X) k(`LSP server ${A} stdin error: ${$.message}`)
        });
        let E = new us.StreamMessageReader(Q.stdout),
          z = new us.StreamMessageWriter(Q.stdin);
        B = us.createMessageConnection(E, z), B.onError(([$, O, L]) => {
          if (!X) Y = !0, J = $, e(Error(`LSP server ${A} connection error: ${$.message}`))
        }), B.onClose(() => {
          if (!X) Z = !1, k(`LSP server ${A} connection closed`)
        }), B.listen(), B.trace(us.Trace.Verbose, {
          log: ($) => {
            k(`[LSP PROTOCOL ${A}] ${$}`)
          }
        }).catch(($) => {
          k(`Failed to enable tracing for ${A}: ${$.message}`)
        });
        for (let {
            method: $,
            handler: O
          }
          of I) B.onNotification($, O), k(`Applied queued notification handler for ${A}.${$}`);
        I.length = 0;
        for (let {
            method: $,
            handler: O
          }
          of D) B.onRequest($, O), k(`Applied queued request handler for ${A}.${$}`);
        D.length = 0, k(`LSP client started for ${A}`)
      } catch (H) {
        throw e(Error(`LSP server ${A} failed to start: ${H.message}`)), H
      }
    },
    async initialize(K) {
      if (!B) throw Error("LSP client not started");
      W();
      try {
        let V = await B.sendRequest("initialize", K);
        return G = V.capabilities, await B.sendNotification("initialized", {}), Z = !0, k(`LSP server ${A} initialized`), V
      } catch (V) {
        throw e(Error(`LSP server ${A} initialize failed: ${V.message}`)), V
      }
    },
    async sendRequest(K, V) {
      if (!B) throw Error("LSP client not started");
      if (W(), !Z) throw Error("LSP server not initialized");
      try {
        return await B.sendRequest(K, V)
      } catch (F) {
        throw e(Error(`LSP server ${A} request ${K} failed: ${F.message}`)), F
      }
    },
    async sendNotification(K, V) {
      if (!B) throw Error("LSP client not started");
      W();
      try {
        await B.sendNotification(K, V)
      } catch (F) {
        e(Error(`LSP server ${A} notification ${K} failed: ${F.message}`)), k(`Notification ${K} failed but continuing`)
      }
    },
    onNotification(K, V) {
      if (!B) {
        I.push({
          method: K,
          handler: V
        }), k(`Queued notification handler for ${A}.${K} (connection not ready)`);
        return
      }
      W(), B.onNotification(K, V)
    },
    onRequest(K, V) {
      if (!B) {
        D.push({
          method: K,
          handler: V
        }), k(`Queued request handler for ${A}.${K} (connection not ready)`);
        return
      }
      W(), B.onRequest(K, V)
    },
    async stop() {
      let K;
      X = !0;
      try {
        if (B) await B.sendRequest("shutdown", null), await B.sendNotification("exit", null)
      } catch (V) {
        let F = V;
        e(Error(`LSP server ${A} stop failed: ${F.message}`)), K = F
      } finally {
        if (B) {
          try {
            B.dispose()
          } catch (V) {
            k(`Connection disposal failed for ${A}: ${V.message}`)
          }
          B = void 0
        }
        if (Q) {
          if (Q.removeAllListeners("error"), Q.removeAllListeners("exit"), Q.stdin) Q.stdin.removeAllListeners("error");
          if (Q.stderr) Q.stderr.removeAllListeners("data");
          try {
            Q.kill()
          } catch (V) {
            k(`Process kill failed for ${A} (may already be dead): ${V.message}`)
          }
          Q = void 0
        }
        if (Z = !1, G = void 0, X = !1, K) Y = !0, J = K;
        k(`LSP client stopped for ${A}`)
      }
      if (K) throw K
    }
  }
}
// @from(Ln 333118, Col 4)
us
// @from(Ln 333119, Col 4)
Wy2 = w(() => {
  v1();
  T1();
  us = c(Iy2(), 1)
})
// @from(Ln 333126, Col 0)
function Vy2(A, Q) {
  if (Q.restartOnCrash !== void 0) throw Error(`LSP server '${A}': restartOnCrash is not yet implemented. Remove this field from the configuration.`);
  if (Q.startupTimeout !== void 0) throw Error(`LSP server '${A}': startupTimeout is not yet implemented. Remove this field from the configuration.`);
  if (Q.shutdownTimeout !== void 0) throw Error(`LSP server '${A}': shutdownTimeout is not yet implemented. Remove this field from the configuration.`);
  let B = Dy2(A),
    G = "stopped",
    Z, Y, J = 0;
  async function X() {
    if (G === "running" || G === "starting") return;
    try {
      G = "starting", k(`Starting LSP server instance: ${A}`), await B.start(Q.command, Q.args || [], {
        env: Q.env,
        cwd: Q.workspaceFolder
      });
      let E = Q.workspaceFolder || o1(),
        z = `file://${E}`,
        $ = {
          processId: process.pid,
          initializationOptions: Q.initializationOptions ?? {},
          workspaceFolders: [{
            uri: z,
            name: Ky2.basename(E)
          }],
          rootPath: E,
          rootUri: z,
          capabilities: {
            workspace: {
              configuration: !1,
              workspaceFolders: !1
            },
            textDocument: {
              synchronization: {
                dynamicRegistration: !1,
                willSave: !1,
                willSaveWaitUntil: !1,
                didSave: !0
              },
              publishDiagnostics: {
                relatedInformation: !0,
                tagSupport: {
                  valueSet: [1, 2]
                },
                versionSupport: !1,
                codeDescriptionSupport: !0,
                dataSupport: !1
              },
              hover: {
                dynamicRegistration: !1,
                contentFormat: ["markdown", "plaintext"]
              },
              definition: {
                dynamicRegistration: !1,
                linkSupport: !0
              },
              references: {
                dynamicRegistration: !1
              },
              documentSymbol: {
                dynamicRegistration: !1,
                hierarchicalDocumentSymbolSupport: !0
              },
              callHierarchy: {
                dynamicRegistration: !1
              }
            },
            general: {
              positionEncodings: ["utf-16"]
            }
          }
        };
      await B.initialize($), G = "running", Z = new Date, k(`LSP server instance started: ${A}`)
    } catch (E) {
      throw G = "error", Y = E, e(E), E
    }
  }
  async function I() {
    if (G === "stopped" || G === "stopping") return;
    try {
      G = "stopping", await B.stop(), G = "stopped", k(`LSP server instance stopped: ${A}`)
    } catch (E) {
      throw G = "error", Y = E, e(E), E
    }
  }
  async function D() {
    try {
      await I()
    } catch (z) {
      let $ = Error(`Failed to stop LSP server '${A}' during restart: ${z.message}`);
      throw e($), $
    }
    J++;
    let E = Q.maxRestarts ?? 3;
    if (J > E) {
      let z = Error(`Max restart attempts (${E}) exceeded for server '${A}'`);
      throw e(z), z
    }
    try {
      await X()
    } catch (z) {
      let $ = Error(`Failed to start LSP server '${A}' during restart (attempt ${J}/${E}): ${z.message}`);
      throw e($), $
    }
  }

  function W() {
    return G === "running" && B.isInitialized
  }
  async function K(E, z) {
    if (!W()) {
      let L = Error(`Cannot send request to LSP server '${A}': server is ${G}${Y?`, last error: ${Y.message}`:""}`);
      throw e(L), L
    }
    let $;
    for (let L = 0; L <= P$0; L++) try {
      return await B.sendRequest(E, z)
    } catch (M) {
      $ = M;
      let _ = M.code;
      if (typeof _ === "number" && _ === Rg5 && L < P$0) {
        let x = _g5 * Math.pow(2, L);
        k(`LSP request '${E}' to '${A}' got ContentModified error, retrying in ${x}ms (attempt ${L+1}/${P$0})…`), await new Promise((b) => setTimeout(b, x));
        continue
      }
      break
    }
    let O = Error(`LSP request '${E}' failed for server '${A}': ${$?.message??"unknown error"}`);
    throw e(O), O
  }
  async function V(E, z) {
    if (!W()) {
      let $ = Error(`Cannot send notification to LSP server '${A}': server is ${G}`);
      throw e($), $
    }
    try {
      await B.sendNotification(E, z)
    } catch ($) {
      let O = Error(`LSP notification '${E}' failed for server '${A}': ${$.message}`);
      throw e(O), O
    }
  }

  function F(E, z) {
    B.onNotification(E, z)
  }

  function H(E, z) {
    B.onRequest(E, z)
  }
  return {
    name: A,
    config: Q,
    get state() {
      return G
    },
    get startTime() {
      return Z
    },
    get lastError() {
      return Y
    },
    get restartCount() {
      return J
    },
    start: X,
    stop: I,
    restart: D,
    isHealthy: W,
    sendRequest: K,
    sendNotification: V,
    onNotification: F,
    onRequest: H
  }
}
// @from(Ln 333299, Col 4)
Rg5 = -32801
// @from(Ln 333300, Col 2)
P$0 = 3
// @from(Ln 333301, Col 2)
_g5 = 500
// @from(Ln 333302, Col 4)
Fy2 = w(() => {
  Wy2();
  v1();
  T1();
  V2()
})
// @from(Ln 333317, Col 0)
function Pg5(A, Q) {
  let B = S$0(A),
    G = S$0(A, Q),
    Z = Tg5(B, G);
  if (Z.startsWith("..") || S$0(Z) === Z) return null;
  return G
}
// @from(Ln 333324, Col 0)
async function Sg5(A, Q = []) {
  let B = {},
    G = jg5(A.path, ".lsp.json");
  try {
    let Z = await Hy2(G, "utf-8"),
      Y = AQ(Z),
      J = m.record(m.string(), YVA).safeParse(Y);
    if (J.success) Object.assign(B, J.data);
    else {
      let X = `LSP config validation failed for .lsp.json in plugin ${A.name}: ${J.error.message}`;
      e(Error(X)), Q.push({
        type: "lsp-config-invalid",
        plugin: A.name,
        serverName: ".lsp.json",
        validationError: J.error.message,
        source: "plugin"
      })
    }
  } catch (Z) {
    if (Z.code !== "ENOENT") {
      let Y = Z instanceof Error ? `Failed to read/parse .lsp.json in plugin ${A.name}: ${Z.message}` : `Failed to read/parse .lsp.json file in plugin ${A.name}`;
      e(Z instanceof Error ? Z : Error(Y)), Q.push({
        type: "lsp-config-invalid",
        plugin: A.name,
        serverName: ".lsp.json",
        validationError: Z instanceof Error ? `Failed to parse JSON: ${Z.message}` : "Failed to parse JSON file",
        source: "plugin"
      })
    }
  }
  if (A.manifest.lspServers) {
    let Z = await xg5(A.manifest.lspServers, A.path, A.name, Q);
    if (Z) Object.assign(B, Z)
  }
  return Object.keys(B).length > 0 ? B : void 0
}
// @from(Ln 333360, Col 0)
async function xg5(A, Q, B, G) {
  let Z = {},
    Y = Array.isArray(A) ? A : [A];
  for (let J of Y)
    if (typeof J === "string") {
      let X = Pg5(Q, J);
      if (!X) {
        let I = `Security: Path traversal attempt blocked in plugin ${B}: ${J}`;
        e(Error(I)), k(I, {
          level: "warn"
        }), G.push({
          type: "lsp-config-invalid",
          plugin: B,
          serverName: J,
          validationError: "Invalid path: must be relative and within plugin directory",
          source: "plugin"
        });
        continue
      }
      try {
        let I = await Hy2(X, "utf-8"),
          D = AQ(I),
          W = m.record(m.string(), YVA).safeParse(D);
        if (W.success) Object.assign(Z, W.data);
        else {
          let K = `LSP config validation failed for ${J} in plugin ${B}: ${W.error.message}`;
          e(Error(K)), G.push({
            type: "lsp-config-invalid",
            plugin: B,
            serverName: J,
            validationError: W.error.message,
            source: "plugin"
          })
        }
      } catch (I) {
        let D = I instanceof Error ? `Failed to read/parse LSP config from ${J} in plugin ${B}: ${I.message}` : `Failed to read/parse LSP config file ${J} in plugin ${B}`;
        e(I instanceof Error ? I : Error(D)), G.push({
          type: "lsp-config-invalid",
          plugin: B,
          serverName: J,
          validationError: I instanceof Error ? `Failed to parse JSON: ${I.message}` : "Failed to parse JSON file",
          source: "plugin"
        })
      }
    } else
      for (let [X, I] of Object.entries(J)) {
        let D = YVA.safeParse(I);
        if (D.success) Z[X] = D.data;
        else {
          let W = `LSP config validation failed for inline server "${X}" in plugin ${B}: ${D.error.message}`;
          e(Error(W)), G.push({
            type: "lsp-config-invalid",
            plugin: B,
            serverName: X,
            validationError: D.error.message,
            source: "plugin"
          })
        }
      }
  return Object.keys(Z).length > 0 ? Z : void 0
}
// @from(Ln 333422, Col 0)
function yg5(A, Q) {
  return A.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, Q)
}
// @from(Ln 333426, Col 0)
function vg5(A, Q, B) {
  let G = [],
    Z = (X) => {
      let I = yg5(X, Q),
        {
          expanded: D,
          missingVars: W
        } = BVA(I);
      return G.push(...W), D
    },
    Y = {
      ...A
    };
  if (Y.command) Y.command = Z(Y.command);
  if (Y.args) Y.args = Y.args.map((X) => Z(X));
  let J = {
    CLAUDE_PLUGIN_ROOT: Q,
    ...Y.env || {}
  };
  for (let [X, I] of Object.entries(J))
    if (X !== "CLAUDE_PLUGIN_ROOT") J[X] = Z(I);
  if (Y.env = J, Y.workspaceFolder) Y.workspaceFolder = Z(Y.workspaceFolder);
  if (G.length > 0) {
    let I = `Missing environment variables in plugin LSP config: ${[...new Set(G)].join(", ")}`;
    e(Error(I)), k(I, {
      level: "warn"
    })
  }
  return Y
}
// @from(Ln 333457, Col 0)
function kg5(A, Q) {
  let B = {};
  for (let [G, Z] of Object.entries(A)) {
    let Y = `plugin:${Q}:${G}`;
    B[Y] = {
      ...Z,
      scope: "dynamic",
      source: Q
    }
  }
  return B
}
// @from(Ln 333469, Col 0)
async function Ey2(A, Q = []) {
  if (!A.enabled) return;
  let B = A.lspServers || await Sg5(A, Q);
  if (!B) return;
  let G = {};
  for (let [Z, Y] of Object.entries(B)) G[Z] = vg5(Y, A.path, Q);
  return kg5(G, A.name)
}
// @from(Ln 333477, Col 4)
zy2 = w(() => {
  pz();
  j9();
  T1();
  v1();
  A0()
})
// @from(Ln 333484, Col 0)
async function $y2() {
  let A = {};
  try {
    let {
      enabled: Q
    } = await DG();
    for (let B of Q) {
      let G = [],
        Z = await Ey2(B, G);
      if (Z && Object.keys(Z).length > 0) Object.assign(A, Z), k(`Loaded ${Object.keys(Z).length} LSP server(s) from plugin: ${B.name}`);
      if (G.length > 0) k(`${G.length} error(s) loading LSP servers from plugin: ${B.name}`)
    }
    k(`Total LSP servers loaded: ${Object.keys(A).length}`)
  } catch (Q) {
    e(Q instanceof Error ? Q : Error(`Failed to load LSP servers: ${String(Q)}`)), k(`Error loading LSP servers: ${Q instanceof Error?Q.message:String(Q)}`)
  }
  return {
    servers: A
  }
}
// @from(Ln 333504, Col 4)
Cy2 = w(() => {
  GK();
  zy2();
  T1();
  v1()
})
// @from(Ln 333512, Col 0)
function Uy2() {
  let A = new Map,
    Q = new Map,
    B = new Map;
  async function G() {
    let H;
    try {
      H = (await $y2()).servers, k(`[LSP SERVER MANAGER] getAllLspServers returned ${Object.keys(H).length} server(s)`)
    } catch (E) {
      throw e(Error(`Failed to load LSP server configuration: ${E.message}`)), E
    }
    for (let [E, z] of Object.entries(H)) try {
      if (!z.command) throw Error(`Server ${E} missing required 'command' field`);
      if (!z.extensionToLanguage || Object.keys(z.extensionToLanguage).length === 0) throw Error(`Server ${E} missing required 'extensionToLanguage' field`);
      let $ = Object.keys(z.extensionToLanguage);
      for (let L of $) {
        let M = L.toLowerCase();
        if (!Q.has(M)) Q.set(M, []);
        let _ = Q.get(M);
        if (_) _.push(E)
      }
      let O = Vy2(E, z);
      A.set(E, O), O.onRequest("workspace/configuration", (L) => {
        return k(`LSP: Received workspace/configuration request from ${E}`), L.items.map(() => null)
      }), O.start().catch((L) => {
        e(Error(`Failed to start LSP server ${E}: ${L.message}`))
      })
    } catch ($) {
      e(Error(`Failed to initialize LSP server ${E}: ${$.message}`))
    }
    k(`LSP manager initialized with ${A.size} servers`)
  }
  async function Z() {
    let H = [];
    for (let [E, z] of A.entries())
      if (z.state === "running") try {
        await z.stop()
      } catch ($) {
        let O = $;
        e(Error(`Failed to stop LSP server ${E}: ${O.message}`)), H.push(O)
      }
    if (A.clear(), Q.clear(), B.clear(), H.length > 0) {
      let E = Error(`Failed to stop ${H.length} LSP server(s): ${H.map((z)=>z.message).join("; ")}`);
      throw e(E), E
    }
  }

  function Y(H) {
    let E = Mc.extname(H).toLowerCase(),
      z = Q.get(E);
    if (!z || z.length === 0) return;
    let $ = z[0];
    if (!$) return;
    return A.get($)
  }
  async function J(H) {
    let E = Y(H);
    if (!E) return;
    if (E.state === "stopped") try {
      await E.start()
    } catch (z) {
      throw e(Error(`Failed to start LSP server for file ${H}: ${z.message}`)), z
    }
    return E
  }
  async function X(H, E, z) {
    let $ = await J(H);
    if (!$) return;
    try {
      return await $.sendRequest(E, z)
    } catch (O) {
      throw e(Error(`LSP request failed for file ${H}, method '${E}': ${O.message}`)), O
    }
  }

  function I() {
    return A
  }
  async function D(H, E) {
    let z = await J(H);
    if (!z) return;
    let $ = `file://${Mc.resolve(H)}`;
    if (B.get($) === z.name) {
      k(`LSP: File already open, skipping didOpen for ${H}`);
      return
    }
    let O = Mc.extname(H).toLowerCase(),
      L = z.config.extensionToLanguage[O] || "plaintext";
    try {
      await z.sendNotification("textDocument/didOpen", {
        textDocument: {
          uri: $,
          languageId: L,
          version: 1,
          text: E
        }
      }), B.set($, z.name), k(`LSP: Sent didOpen for ${H} (languageId: ${L})`)
    } catch (M) {
      let _ = Error(`Failed to sync file open ${H}: ${M.message}`);
      throw e(_), _
    }
  }
  async function W(H, E) {
    let z = Y(H);
    if (!z || z.state !== "running") return D(H, E);
    let $ = `file://${Mc.resolve(H)}`;
    if (B.get($) !== z.name) return D(H, E);
    try {
      await z.sendNotification("textDocument/didChange", {
        textDocument: {
          uri: $,
          version: 1
        },
        contentChanges: [{
          text: E
        }]
      }), k(`LSP: Sent didChange for ${H}`)
    } catch (O) {
      let L = Error(`Failed to sync file change ${H}: ${O.message}`);
      throw e(L), L
    }
  }
  async function K(H) {
    let E = Y(H);
    if (!E || E.state !== "running") return;
    try {
      await E.sendNotification("textDocument/didSave", {
        textDocument: {
          uri: `file://${Mc.resolve(H)}`
        }
      }), k(`LSP: Sent didSave for ${H}`)
    } catch (z) {
      let $ = Error(`Failed to sync file save ${H}: ${z.message}`);
      throw e($), $
    }
  }
  async function V(H) {
    let E = Y(H);
    if (!E || E.state !== "running") return;
    let z = `file://${Mc.resolve(H)}`;
    try {
      await E.sendNotification("textDocument/didClose", {
        textDocument: {
          uri: z
        }
      }), B.delete(z), k(`LSP: Sent didClose for ${H}`)
    } catch ($) {
      let O = Error(`Failed to sync file close ${H}: ${$.message}`);
      throw e(O), O
    }
  }

  function F(H) {
    let E = `file://${Mc.resolve(H)}`;
    return B.has(E)
  }
  return {
    initialize: G,
    shutdown: Z,
    getServerForFile: Y,
    ensureServerStarted: J,
    sendRequest: X,
    getAllServers: I,
    openFile: D,
    changeFile: W,
    saveFile: K,
    closeFile: V,
    isFileOpen: F
  }
}
// @from(Ln 333682, Col 4)
qy2 = w(() => {
  Fy2();
  Cy2();
  T1();
  v1()
})
// @from(Ln 333692, Col 0)
function Ly2({
  serverName: A,
  files: Q
}) {
  let B = bg5();
  k(`LSP Diagnostics: Registering ${Q.length} diagnostic file(s) from ${A} (ID: ${B})`), IbA.set(B, {
    serverName: A,
    files: Q,
    timestamp: Date.now(),
    attachmentSent: !1
  })
}
// @from(Ln 333705, Col 0)
function wy2(A) {
  switch (A) {
    case "Error":
      return 1;
    case "Warning":
      return 2;
    case "Info":
      return 3;
    case "Hint":
      return 4;
    default:
      return 4
  }
}
// @from(Ln 333720, Col 0)
function Oy2(A) {
  return eA({
    message: A.message,
    severity: A.severity,
    range: A.range,
    source: A.source || null,
    code: A.code || null
  })
}
// @from(Ln 333730, Col 0)
function hg5(A) {
  let Q = new Map,
    B = [];
  for (let G of A) {
    if (!Q.has(G.uri)) Q.set(G.uri, new Set), B.push({
      uri: G.uri,
      diagnostics: []
    });
    let Z = Q.get(G.uri),
      Y = B.find((X) => X.uri === G.uri),
      J = LHA.get(G.uri) || new Set;
    for (let X of G.diagnostics) try {
      let I = Oy2(X);
      if (Z.has(I) || J.has(I)) continue;
      Z.add(I), Y.diagnostics.push(X)
    } catch (I) {
      let D = I instanceof Error ? I : Error(String(I)),
        W = X.message?.substring(0, 100) || "<no message>";
      e(Error(`Failed to deduplicate diagnostic in ${G.uri}: ${D.message}. Diagnostic message: ${W}`)), Y.diagnostics.push(X)
    }
  }
  return B.filter((G) => G.diagnostics.length > 0)
}
// @from(Ln 333754, Col 0)
function My2() {
  k(`LSP Diagnostics: Checking registry - ${IbA.size} pending`);
  let A = [],
    Q = new Set,
    B = [];
  for (let D of IbA.values())
    if (!D.attachmentSent) A.push(...D.files), Q.add(D.serverName), B.push(D);
  if (A.length === 0) return [];
  let G;
  try {
    G = hg5(A)
  } catch (D) {
    let W = D instanceof Error ? D : Error(String(D));
    e(Error(`Failed to deduplicate LSP diagnostics: ${W.message}`)), G = A
  }
  for (let D of B) D.attachmentSent = !0;
  let Z = A.reduce((D, W) => D + W.diagnostics.length, 0),
    Y = G.reduce((D, W) => D + W.diagnostics.length, 0);
  if (Z > Y) k(`LSP Diagnostics: Deduplication removed ${Z-Y} duplicate diagnostic(s)`);
  let J = 0,
    X = 0;
  for (let D of G) {
    if (D.diagnostics.sort((K, V) => wy2(K.severity) - wy2(V.severity)), D.diagnostics.length > JW1) X += D.diagnostics.length - JW1, D.diagnostics = D.diagnostics.slice(0, JW1);
    let W = Ny2 - J;
    if (D.diagnostics.length > W) X += D.diagnostics.length - W, D.diagnostics = D.diagnostics.slice(0, W);
    J += D.diagnostics.length
  }
  if (G = G.filter((D) => D.diagnostics.length > 0), X > 0) k(`LSP Diagnostics: Volume limiting removed ${X} diagnostic(s) (max ${JW1}/file, ${Ny2} total)`);
  for (let D of G) {
    if (!LHA.has(D.uri)) LHA.set(D.uri, new Set);
    let W = LHA.get(D.uri);
    for (let K of D.diagnostics) try {
      W.add(Oy2(K))
    } catch (V) {
      let F = V instanceof Error ? V : Error(String(V)),
        H = K.message?.substring(0, 100) || "<no message>";
      e(Error(`Failed to track delivered diagnostic in ${D.uri}: ${F.message}. Diagnostic message: ${H}`))
    }
  }
  let I = G.reduce((D, W) => D + W.diagnostics.length, 0);
  if (I === 0) return k("LSP Diagnostics: No new diagnostics to deliver (all filtered by deduplication)"), [];
  return k(`LSP Diagnostics: Delivering ${G.length} file(s) with ${I} diagnostic(s) from ${Q.size} server(s)`), [{
    serverName: Array.from(Q).join(", "),
    files: G
  }]
}
// @from(Ln 333801, Col 0)
function Ry2() {
  k(`LSP Diagnostics: Clearing ${IbA.size} pending diagnostic(s)`), IbA.clear()
}
// @from(Ln 333805, Col 0)
function XW1(A) {
  if (LHA.has(A)) k(`LSP Diagnostics: Clearing delivered diagnostics for ${A}`), LHA.delete(A)
}
// @from(Ln 333808, Col 4)
JW1 = 10
// @from(Ln 333809, Col 2)
Ny2 = 30
// @from(Ln 333810, Col 2)
fg5 = 500
// @from(Ln 333811, Col 2)
IbA
// @from(Ln 333811, Col 7)
LHA
// @from(Ln 333812, Col 4)
DbA = w(() => {
  T1();
  v1();
  eqA();
  A0();
  IbA = new Map, LHA = new jT({
    max: fg5
  })
})
// @from(Ln 333825, Col 0)
function ug5(A) {
  switch (A) {
    case 1:
      return "Error";
    case 2:
      return "Warning";
    case 3:
      return "Info";
    case 4:
      return "Hint";
    default:
      return "Error"
  }
}
// @from(Ln 333840, Col 0)
function mg5(A) {
  let Q;
  try {
    Q = A.uri.startsWith("file://") ? gg5(A.uri) : A.uri
  } catch (G) {
    let Z = G instanceof Error ? G : Error(String(G));
    e(Z), k(`Failed to convert URI to file path: ${A.uri}. Error: ${Z.message}. Using original URI as fallback.`), Q = A.uri
  }
  let B = A.diagnostics.map((G) => ({
    message: G.message,
    severity: ug5(G.severity),
    range: {
      start: {
        line: G.range.start.line,
        character: G.range.start.character
      },
      end: {
        line: G.range.end.line,
        character: G.range.end.character
      }
    },
    source: G.source,
    code: G.code !== void 0 && G.code !== null ? String(G.code) : void 0
  }));
  return [{
    uri: Q,
    diagnostics: B
  }]
}
// @from(Ln 333870, Col 0)
function _y2(A) {
  let Q = A.getAllServers(),
    B = [],
    G = 0,
    Z = new Map;
  for (let [J, X] of Q.entries()) try {
    if (!X || typeof X.onNotification !== "function") {
      let I = !X ? "Server instance is null/undefined" : "Server instance has no onNotification method";
      B.push({
        serverName: J,
        error: I
      });
      let D = Error(`${I} for ${J}`);
      e(D), k(`Skipping handler registration for ${J}: ${I}`);
      continue
    }
    X.onNotification("textDocument/publishDiagnostics", async (I) => {
      k(`[PASSIVE DIAGNOSTICS] Handler invoked for ${J}! Params type: ${typeof I}`);
      try {
        if (!I || typeof I !== "object" || !("uri" in I) || !("diagnostics" in I)) {
          let V = Error(`LSP server ${J} sent invalid diagnostic params (missing uri or diagnostics)`);
          e(V), k(`Invalid diagnostic params from ${J}: ${eA(I)}`);
          return
        }
        let D = I;
        k(`Received diagnostics from ${J}: ${D.diagnostics.length} diagnostic(s) for ${D.uri}`);
        let W = mg5(D),
          K = W[0];
        if (!K || W.length === 0 || K.diagnostics.length === 0) {
          k(`Skipping empty diagnostics from ${J} for ${D.uri}`);
          return
        }
        try {
          Ly2({
            serverName: J,
            files: W
          }), k(`LSP Diagnostics: Registered ${W.length} diagnostic file(s) from ${J} for async delivery`), Z.delete(J)
        } catch (V) {
          let F = V instanceof Error ? V : Error(`Failed to register LSP diagnostics: ${String(V)}`);
          e(F), k(`Error registering LSP diagnostics from ${J}: URI: ${D.uri}, Diagnostic count: ${K.diagnostics.length}, Error: ${F.message}`);
          let H = Z.get(J) || {
            count: 0,
            lastError: ""
          };
          if (H.count++, H.lastError = F.message, Z.set(J, H), H.count >= 3) k(`WARNING: LSP diagnostic handler for ${J} has failed ${H.count} times consecutively. Last error: ${H.lastError}. This may indicate a problem with the LSP server or diagnostic processing. Check logs for details.`)
        }
      } catch (D) {
        let W = D instanceof Error ? D : Error(`Unexpected error in diagnostic handler: ${String(D)}`);
        e(W), k(`Unexpected error processing diagnostics from ${J}: ${W.message}`);
        let K = Z.get(J) || {
          count: 0,
          lastError: ""
        };
        if (K.count++, K.lastError = W.message, Z.set(J, K), K.count >= 3) k(`WARNING: LSP diagnostic handler for ${J} has failed ${K.count} times consecutively. Last error: ${K.lastError}. This may indicate a problem with the LSP server or diagnostic processing. Check logs for details.`)
      }
    }), k(`Registered diagnostics handler for ${J}`), G++
  } catch (I) {
    let D = I instanceof Error ? I : Error(`Handler registration failed: ${String(I)}`);
    B.push({
      serverName: J,
      error: D.message
    }), e(D), k(`Failed to register diagnostics handler for ${J}: Error: ${D.message}`)
  }
  let Y = Q.size;
  if (B.length > 0) {
    let J = B.map((X) => `${X.serverName} (${X.error})`).join(", ");
    e(Error(`Failed to register diagnostics for ${B.length} LSP server(s): ${J}`)), k(`LSP notification handler registration: ${G}/${Y} succeeded. Failed servers: ${J}. Diagnostics from failed servers will not be delivered.`)
  } else k(`LSP notification handlers registered successfully for all ${Y} server(s)`);
  return {
    totalServers: Y,
    successCount: G,
    registrationErrors: B,
    diagnosticFailures: Z
  }
}
// @from(Ln 333945, Col 4)
jy2 = w(() => {
  A0();
  DbA();
  T1();
  v1()
})
// @from(Ln 333952, Col 0)
function Rc() {
  if (kO === "failed") return;
  return Yx
}
// @from(Ln 333957, Col 0)
function f6A() {
  if (kO === "failed") return {
    status: "failed",
    error: DW1 || Error("Initialization failed")
  };
  if (kO === "not-started") return {
    status: "not-started"
  };
  if (kO === "pending") return {
    status: "pending"
  };
  return {
    status: "success"
  }
}
// @from(Ln 333972, Col 0)
async function Ty2() {
  if (kO === "success" || kO === "failed") return;
  if (kO === "pending" && WW1) await WW1
}
// @from(Ln 333977, Col 0)
function Py2() {
  if (k("[LSP MANAGER] initializeLspServerManager() called"), Yx !== void 0 && kO !== "failed") {
    k("[LSP MANAGER] Already initialized or initializing, skipping");
    return
  }
  if (kO === "failed") Yx = void 0, DW1 = void 0;
  Yx = Uy2(), kO = "pending", k("[LSP MANAGER] Created manager instance, state=pending");
  let A = ++IW1;
  k(`[LSP MANAGER] Starting async initialization (generation ${A})`), WW1 = Yx.initialize().then(() => {
    if (A === IW1) {
      if (kO = "success", k("LSP server manager initialized successfully"), Yx) _y2(Yx)
    }
  }).catch((Q) => {
    if (A === IW1) kO = "failed", DW1 = Q, Yx = void 0, e(Q), k(`Failed to initialize LSP server manager: ${Q instanceof Error?Q.message:String(Q)}`)
  })
}
// @from(Ln 333993, Col 0)
async function Sy2() {
  if (Yx === void 0) return;
  try {
    await Yx.shutdown(), k("LSP server manager shut down successfully")
  } catch (A) {
    e(A), k(`Failed to shutdown LSP server manager: ${A instanceof Error?A.message:String(A)}`)
  } finally {
    Yx = void 0, kO = "not-started", DW1 = void 0, WW1 = void 0, IW1++
  }
}
// @from(Ln 334003, Col 4)
Yx
// @from(Ln 334003, Col 8)
kO = "not-started"
// @from(Ln 334004, Col 2)
DW1
// @from(Ln 334004, Col 7)
IW1 = 0
// @from(Ln 334005, Col 2)
WW1
// @from(Ln 334006, Col 4)
ms = w(() => {
  qy2();
  jy2();
  T1();
  v1()
})
// @from(Ln 334012, Col 4)
xy2
// @from(Ln 334012, Col 9)
x$0
// @from(Ln 334012, Col 14)
KW1
// @from(Ln 334013, Col 4)
VW1 = w(() => {
  j9();
  xy2 = m.strictObject({
    file_path: m.string().describe("The absolute path to the file to modify"),
    old_string: m.string().describe("The text to replace"),
    new_string: m.string().describe("The text to replace it with (must be different from old_string)"),
    replace_all: m.boolean().default(!1).optional().describe("Replace all occurences of old_string (default false)")
  }), x$0 = m.object({
    oldStart: m.number(),
    oldLines: m.number(),
    newStart: m.number(),
    newLines: m.number(),
    lines: m.array(m.string())
  }), KW1 = m.object({
    filePath: m.string().describe("The file path that was edited"),
    oldString: m.string().describe("The original string that was replaced"),
    newString: m.string().describe("The new string that replaced it"),
    originalFile: m.string().describe("The original file contents before editing"),
    structuredPatch: m.array(x$0).describe("Diff patch showing the changes"),
    userModified: m.boolean().describe("Whether the user modified the proposed changes"),
    replaceAll: m.boolean().describe("Whether all occurrences were replaced")
  })
})
// @from(Ln 334037, Col 0)
function yy2(A) {
  let Q = dg5.find((G) => G.matches(A));
  if (!Q) return null;
  let B = {
    ...Q.tip
  };
  if (A.code === "invalid_value" && A.enumValues && !B.suggestion) B.suggestion = `Valid values: ${A.enumValues.map((G)=>`"${G}"`).join(", ")}`;
  if (!B.docLink && A.path) {
    let G = A.path.split(".")[0];
    if (G) B.docLink = cg5[G]
  }
  return B
}
// @from(Ln 334050, Col 4)
dg5
// @from(Ln 334050, Col 9)
cg5
// @from(Ln 334051, Col 4)
vy2 = w(() => {
  dg5 = [{
    matches: (A) => A.path === "permissions.defaultMode" && A.code === "invalid_value",
    tip: {
      suggestion: 'Valid modes: "acceptEdits" (ask before file changes), "plan" (analysis only), "bypassPermissions" (auto-accept all), or "default" (standard behavior)',
      docLink: "https://code.claude.com/docs/en/iam#permission-modes"
    }
  }, {
    matches: (A) => A.path === "apiKeyHelper" && A.code === "invalid_type",
    tip: {
      suggestion: 'Provide a shell command that outputs your API key to stdout. The script should output only the API key. Example: "/bin/generate_temp_api_key.sh"'
    }
  }, {
    matches: (A) => A.path === "cleanupPeriodDays" && A.code === "too_small" && A.expected === "0",
    tip: {
      suggestion: "Must be 0 or greater. Use 0 to disable automatic cleanup and keep chat transcripts forever, or set a positive number for days to retain (default is 30 days)"
    }
  }, {
    matches: (A) => A.path.startsWith("env.") && A.code === "invalid_type",
    tip: {
      suggestion: 'Environment variables must be strings. Wrap numbers and booleans in quotes. Example: "DEBUG": "true", "PORT": "3000"',
      docLink: "https://code.claude.com/docs/en/settings#environment-variables"
    }
  }, {
    matches: (A) => (A.path === "permissions.allow" || A.path === "permissions.deny") && A.code === "invalid_type" && A.expected === "array",
    tip: {
      suggestion: 'Permission rules must be in an array. Format: ["Tool(specifier)"]. Examples: ["Bash(npm run build)", "Edit(docs/**)", "Read(~/.zshrc)"]. Use * for wildcards.'
    }
  }, {
    matches: (A) => A.path.includes("hooks") && A.code === "invalid_type",
    tip: {
      suggestion: 'Hooks use a new format with matchers. Example: {"PostToolUse": [{"matcher": {"tools": ["BashTool"]}, "hooks": [{"type": "command", "command": "echo Done"}]}]}'
    }
  }, {
    matches: (A) => A.code === "invalid_type" && A.expected === "boolean",
    tip: {
      suggestion: 'Use true or false without quotes. Example: "includeCoAuthoredBy": true'
    }
  }, {
    matches: (A) => A.code === "unrecognized_keys",
    tip: {
      suggestion: "Check for typos or refer to the documentation for valid fields",
      docLink: "https://code.claude.com/docs/en/settings"
    }
  }, {
    matches: (A) => A.code === "invalid_value" && A.enumValues !== void 0,
    tip: {
      suggestion: void 0
    }
  }, {
    matches: (A) => A.code === "invalid_type" && A.expected === "object" && A.received === null && A.path === "",
    tip: {
      suggestion: "Check for missing commas, unmatched brackets, or trailing commas. Use a JSON validator to identify the exact syntax error."
    }
  }, {
    matches: (A) => A.path === "permissions.additionalDirectories" && A.code === "invalid_type",
    tip: {
      suggestion: 'Must be an array of directory paths. Example: ["~/projects", "/tmp/workspace"]. You can also use --add-dir flag or /add-dir command',
      docLink: "https://code.claude.com/docs/en/iam#working-directories"
    }
  }], cg5 = {
    permissions: "https://code.claude.com/docs/en/iam#configuring-permissions",
    env: "https://code.claude.com/docs/en/settings#environment-variables",
    hooks: "https://code.claude.com/docs/en/hooks"
  }
})
// @from(Ln 334118, Col 0)
function y$0() {
  let A = UBA(Ld, {
    unrepresentable: "any"
  });
  return eA(A, null, 2)
}
// @from(Ln 334124, Col 4)
ky2 = w(() => {
  j9();
  wd();
  A0()
})
// @from(Ln 334130, Col 0)
function by2(A) {
  return A.code === "invalid_type"
}
// @from(Ln 334134, Col 0)
function fy2(A) {
  return A.code === "invalid_value"
}
// @from(Ln 334138, Col 0)
function pg5(A) {
  return A.code === "unrecognized_keys"
}
// @from(Ln 334142, Col 0)
function hy2(A) {
  return A.code === "too_small"
}
// @from(Ln 334146, Col 0)
function v$0(A) {
  if (A === null) return "null";
  if (A === void 0) return "undefined";
  if (Array.isArray(A)) return "array";
  return typeof A
}
// @from(Ln 334153, Col 0)
function gy2(A) {
  let Q = A.match(/received (\w+)/);
  return Q ? Q[1] : void 0
}
// @from(Ln 334158, Col 0)
function k$0(A, Q) {
  return A.issues.map((B) => {
    let G = B.path.map(String).join("."),
      Z = B.message,
      Y, J, X, I, D;
    if (fy2(B)) J = B.values.map((K) => String(K)), X = J.join(" | "), I = void 0, D = void 0;
    else if (by2(B)) {
      X = B.expected;
      let K = gy2(B.message);
      I = K ?? v$0(B.input), D = K ?? v$0(B.input)
    } else if (hy2(B)) X = String(B.minimum);
    else if (B.code === "custom" && "params" in B) I = B.params.received, D = I;
    let W = yy2({
      path: G,
      code: B.code,
      expected: X,
      received: I,
      enumValues: J,
      message: B.message,
      value: I
    });
    if (fy2(B)) Y = J?.map((K) => `"${K}"`).join(", "), Z = `Invalid value. Expected one of: ${Y}`;
    else if (by2(B)) {
      let K = gy2(B.message) ?? v$0(B.input);
      if (B.expected === "object" && K === "null" && G === "") Z = "Invalid or malformed JSON";
      else Z = `Expected ${B.expected}, but received ${K}`
    } else if (pg5(B)) {
      let K = B.keys.join(", ");
      Z = `Unrecognized field${B.keys.length>1?"s":""}: ${K}`
    } else if (hy2(B)) Z = `Number must be greater than or equal to ${B.minimum}`, Y = String(B.minimum);
    return {
      file: Q,
      path: G,
      message: Z,
      expected: Y,
      invalidValue: D,
      suggestion: W?.suggestion,
      docLink: W?.docLink
    }
  })
}
// @from(Ln 334200, Col 0)
function b$0(A) {
  try {
    let Q = AQ(A),
      B = Ld.strict().safeParse(Q);
    if (B.success) return {
      isValid: !0
    };
    return {
      isValid: !1,
      error: `Settings validation failed:
` + k$0(B.error, "settings").map((Y) => `- ${Y.path}: ${Y.message}`).join(`
`),
      fullSchema: y$0()
    }
  } catch (Q) {
    return {
      isValid: !1,
      error: `Invalid JSON: ${Q instanceof Error?Q.message:"Unknown parsing error"}`,
      fullSchema: y$0()
    }
  }
}
// @from(Ln 334222, Col 4)
f$0 = w(() => {
  wd();
  vy2();
  ky2();
  A0()
})
// @from(Ln 334229, Col 0)
function uy2(A, Q, B) {
  if (!h$0(A)) return null;
  if (!b$0(Q).isValid) return null;
  let Z = B(),
    Y = b$0(Z);
  if (!Y.isValid) return {
    result: !1,
    message: `Claude Code settings.json validation failed after edit:
${Y.error}

Full schema:
${Y.fullSchema}
IMPORTANT: Do not update the env unless explicitly instructed to do so.`,
    errorCode: 10
  };
  return null
}
// @from(Ln 334246, Col 4)
my2 = w(() => {
  f$0();
  AY()
})
// @from(Ln 334251, Col 0)
function ds(A, Q, B) {
  return
}
// @from(Ln 334255, Col 0)
function cy2(A) {
  let Q = A.find((B) => B.name === "claude-vscode");
  if (Q && Q.type === "connected") {
    dy2 = Q, Q.client.setNotificationHandler(lg5, async (G) => {
      let {
        eventName: Z,
        eventData: Y
      } = G.params;
      l(`tengu_vscode_${Z}`, Y)
    });
    let B = {
      tengu_vscode_review_upsell: f8("tengu_vscode_review_upsell"),
      tengu_vscode_onboarding: f8("tengu_vscode_onboarding")
    };
    Q.client.notification({
      method: "experiment_gates",
      params: {
        gates: B
      }
    })
  }
}
// @from(Ln 334277, Col 4)
lg5
// @from(Ln 334277, Col 9)
dy2 = null
// @from(Ln 334278, Col 4)
OHA = w(() => {
  j9();
  Z0();
  w6();
  T1();
  lg5 = m.object({
    method: m.literal("log_event"),
    params: m.object({
      eventName: m.string(),
      eventData: m.object({}).passthrough()
    })
  })
})
// @from(Ln 334307, Col 0)
function vG() {
  if (p2()) return og5();
  return L1().fileCheckpointingEnabled !== !1 && !a1(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING)
}
// @from(Ln 334312, Col 0)
function og5() {
  return a1(process.env.CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING) && !a1(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING)
}
// @from(Ln 334315, Col 0)
async function ps(A, Q, B) {
  if (!vG()) return;
  A((G) => {
    try {
      let Z = G.snapshots.at(-1);
      if (!Z) return e(Error("FileHistory: Missing most recent snapshot")), l("tengu_file_history_track_edit_failed", {}), G;
      let Y = ry2(Q);
      if (Z.trackedFileBackups[Y]) return G;
      let J = G.trackedFiles.has(Y) ? G.trackedFiles : new Set(G.trackedFiles).add(Y),
        I = !vA().existsSync(Q),
        D = I ? g$0(null, 1) : g$0(Q, 1),
        W = nAA(Z);
      W.trackedFileBackups[Y] = D;
      let K = {
        ...G,
        snapshots: [...G.snapshots.slice(0, -1), W],
        trackedFiles: J
      };
      return sy2(K), zW1(B, W, !0).catch((V) => {
        e(Error(`FileHistory: Failed to record snapshot: ${V}`))
      }), l("tengu_file_history_track_edit_success", {
        isNewFile: I,
        version: D.version
      }), k(`FileHistory: Tracked file modification for ${Q}`), K
    } catch (Z) {
      return e(Z), l("tengu_file_history_track_edit_failed", {}), G
    }
  })
}
// @from(Ln 334344, Col 0)
async function MHA(A, Q) {
  if (!vG()) return;
  A((B) => {
    try {
      let G = vA(),
        Z = new Date,
        Y = {},
        J = B.snapshots.at(-1);
      if (J) {
        k(`FileHistory: Making snapshot for message ${Q}`);
        for (let D of B.trackedFiles) try {
          let W = m$0(D);
          if (!G.existsSync(W)) {
            let K = J.trackedFileBackups[D],
              V = K ? K.version + 1 : 1;
            Y[D] = {
              backupFileName: null,
              version: V,
              backupTime: new Date
            }, l("tengu_file_history_backup_deleted_file", {
              version: V
            }), k(`FileHistory: Missing tracked file: ${D}`)
          } else {
            let K = J.trackedFileBackups[D];
            if (K && K.backupFileName !== null && !oy2(W, K.backupFileName)) {
              Y[D] = K;
              continue
            }
            let V = K ? K.version + 1 : 1,
              F = g$0(W, V);
            Y[D] = F
          }
        } catch (W) {
          e(W), l("tengu_file_history_backup_file_failed", {})
        }
      }
      let X = {
          messageId: Q,
          trackedFileBackups: Y,
          timestamp: Z
        },
        I = {
          ...B,
          snapshots: [...B.snapshots, X]
        };
      return sy2(I), eg5(B, I), zW1(Q, X, !1).catch((D) => {
        e(Error(`FileHistory: Failed to record snapshot: ${D}`))
      }), k(`FileHistory: Added snapshot for ${Q}, tracking ${B.trackedFiles.size} files`), l("tengu_file_history_snapshot_success", {
        trackedFilesCount: B.trackedFiles.size,
        snapshotCount: I.snapshots.length
      }), I
    } catch (G) {
      return e(G), l("tengu_file_history_snapshot_failed", {}), B
    }
  })
}
// @from(Ln 334400, Col 0)
async function FW1(A, Q) {
  if (!vG()) return;
  let B = null;
  if (A((G) => {
      let Z = G;
      try {
        let Y = G.snapshots.findLast((X) => X.messageId === Q);
        if (!Y) return e(Error(`FileHistory: Snapshot for ${Q} not found`)), l("tengu_file_history_rewind_failed", {
          trackedFilesCount: Z.trackedFiles.size,
          snapshotFound: !1
        }), B = Error("The selected snapshot was not found"), Z;
        k(`FileHistory: [Rewind] Rewinding to snapshot for ${Q}`);
        let J = ay2(Z, Y, !1);
        k(`FileHistory: [Rewind] Finished rewinding to ${Q}`), l("tengu_file_history_rewind_success", {
          trackedFilesCount: Z.trackedFiles.size,
          filesChangedCount: J?.filesChanged?.length
        })
      } catch (Y) {
        B = Y, e(Y), l("tengu_file_history_rewind_failed", {
          trackedFilesCount: Z.trackedFiles.size,
          snapshotFound: !0
        })
      }
      return Z
    }), B) throw B
}
// @from(Ln 334427, Col 0)
function HW1(A, Q) {
  if (!vG()) return !1;
  return A.snapshots.some((B) => B.messageId === Q)
}
// @from(Ln 334432, Col 0)
function WbA(A, Q) {
  if (!vG()) return;
  let B = A.snapshots.findLast((G) => G.messageId === Q);
  if (!B) return;
  return ay2(A, B, !0)
}
// @from(Ln 334439, Col 0)
function ay2(A, Q, B) {
  let G = vA(),
    Z = [],
    Y = 0,
    J = 0;
  for (let X of A.trackedFiles) try {
    let I = m$0(X),
      D = Q.trackedFileBackups[X],
      W = D ? D.backupFileName : tg5(X, A);
    if (W === void 0) e(Error("FileHistory: Error finding the backup file to apply")), l("tengu_file_history_rewind_restore_file_failed", {
      dryRun: B
    });
    else if (W === null) {
      if (G.existsSync(I)) {
        if (B) {
          let K = py2(I, void 0);
          Y += K?.insertions || 0, J += K?.deletions || 0
        } else G.unlinkSync(I), k(`FileHistory: [Rewind] Deleted ${I}`);
        Z.push(I)
      }
    } else if (B) {
      let K = py2(I, W);
      if (Y += K?.insertions || 0, J += K?.deletions || 0, K?.insertions || K?.deletions) Z.push(I)
    } else if (oy2(I, W)) sg5(I, W), k(`FileHistory: [Rewind] Restored ${I} from ${W}`), Z.push(I)
  } catch (I) {
    e(I), l("tengu_file_history_rewind_restore_file_failed", {
      dryRun: B
    })
  }
  return {
    filesChanged: Z,
    insertions: Y,
    deletions: J
  }
}
// @from(Ln 334475, Col 0)
function oy2(A, Q) {
  let B = vA(),
    G = cs(Q);
  try {
    let Z = B.existsSync(A),
      Y = B.existsSync(G);
    if (Z !== Y) return !0;
    else if (!Z) return !1;
    let J = B.statSync(A),
      X = B.statSync(G);
    if (J.mode !== X.mode || J.size !== X.size) return !0;
    if (J.mtimeMs < X.mtimeMs) return !1;
    let I = B.readFileSync(A, {
        encoding: "utf-8"
      }),
      D = B.readFileSync(G, {
        encoding: "utf-8"
      });
    return I !== D
  } catch {
    return !0
  }
}
// @from(Ln 334499, Col 0)
function py2(A, Q) {
  let B = [],
    G = 0,
    Z = 0;
  try {
    let Y = vA(),
      J = Q && cs(Q),
      X = Y.existsSync(A),
      I = J && Y.existsSync(J);
    if (!X && !I) return {
      filesChanged: B,
      insertions: G,
      deletions: Z
    };
    B.push(A);
    let D = X ? Y.readFileSync(A, {
        encoding: "utf-8"
      }) : "",
      W = I ? Y.readFileSync(J, {
        encoding: "utf-8"
      }) : "";
    cD1(D, W).forEach((V) => {
      if (V.added) G += V.count || 0;
      if (V.removed) Z += V.count || 0
    })
  } catch (Y) {
    e(Error(`FileHistory: Error generating diffStats: ${Y}`))
  }
  return {
    filesChanged: B,
    insertions: G,
    deletions: Z
  }
}
// @from(Ln 334534, Col 0)
function rg5(A, Q) {
  return `${ig5("sha256").update(A).digest("hex").slice(0,16)}@v${Q}`
}
// @from(Ln 334538, Col 0)
function cs(A, Q) {
  let B = zQ();
  return ly2(B, "file-history", Q || q0(), A)
}
// @from(Ln 334543, Col 0)
function g$0(A, Q) {
  let B = A !== null ? rg5(A, Q) : null;
  if (A && B) {
    let G = vA(),
      Z = cs(B),
      Y = u$0(Z);
    if (!G.existsSync(Y)) G.mkdirSync(Y);
    let J = G.readFileSync(A, {
      encoding: "utf-8"
    });
    bB(Z, J, {
      encoding: "utf-8",
      flush: !0
    });
    let X = G.statSync(A),
      I = X.mode;
    ny2(Z, I), l("tengu_file_history_backup_file_created", {
      version: Q,
      fileSize: X.size
    })
  }
  return {
    backupFileName: B,
    version: Q,
    backupTime: new Date
  }
}
// @from(Ln 334571, Col 0)
function sg5(A, Q) {
  let B = vA(),
    G = cs(Q);
  if (!B.existsSync(G)) {
    l("tengu_file_history_rewind_restore_file_failed", {}), e(Error(`FileHistory: [Rewind] Backup file not found: ${G}`));
    return
  }
  let Z = B.readFileSync(G, {
      encoding: "utf-8"
    }),
    Y = u$0(A);
  if (!B.existsSync(Y)) B.mkdirSync(Y);
  bB(A, Z, {
    encoding: "utf-8",
    flush: !0
  });
  let J = B.statSync(G).mode;
  ny2(A, J)
}
// @from(Ln 334591, Col 0)
function tg5(A, Q) {
  for (let B of Q.snapshots) {
    let G = B.trackedFileBackups[A];
    if (G !== void 0 && G.version === 1) return G.backupFileName
  }
  return
}
// @from(Ln 334599, Col 0)
function ry2(A) {
  if (!iy2(A)) return A;
  let Q = EQ();
  if (A.startsWith(Q)) return ng5(Q, A);
  return A
}
// @from(Ln 334606, Col 0)
function m$0(A) {
  if (iy2(A)) return A;
  return ly2(EQ(), A)
}
// @from(Ln 334611, Col 0)
function RHA(A, Q) {
  if (!vG()) return;
  let B = [],
    G = new Set;
  for (let Z of A) {
    let Y = {};
    for (let [J, X] of Object.entries(Z.trackedFileBackups)) {
      let I = ry2(J);
      G.add(I), Y[I] = X
    }
    B.push({
      ...Z,
      trackedFileBackups: Y
    })
  }
  Q({
    snapshots: B,
    trackedFiles: G
  })
}
// @from(Ln 334631, Col 0)
async function EW1(A) {
  if (!vG()) return;
  let Q = A.fileHistorySnapshots;
  if (!Q || A.messages.length === 0) return;
  let G = A.messages[A.messages.length - 1]?.sessionId;
  if (!G) {
    e(Error("FileHistory: Failed to copy backups on restore (no previous session id)"));
    return
  }
  let Z = q0();
  if (G === Z) {
    k(`FileHistory: No need to copy file history for resuming with same session id: ${Z}`);
    return
  }
  try {
    for (let Y of Q) {
      let J = !1;
      for (let [X, I] of Object.entries(Y.trackedFileBackups)) {
        if (!I.backupFileName) continue;
        let D = vA(),
          W = cs(I.backupFileName, G),
          K = cs(I.backupFileName, Z);
        if (D.existsSync(K)) continue;
        if (!D.existsSync(W)) {
          e(Error(`FileHistory: Failed to copy backup ${I.backupFileName} on restore (backup file does not exist in ${G})`)), J = !0;
          break
        }
        let V = u$0(K);
        if (!D.existsSync(V)) D.mkdirSync(V);
        try {
          D.linkSync(W, K)
        } catch {
          e(Error("FileHistory: Error hard linking backup file from previous session"));
          try {
            D.copyFileSync(W, K)
          } catch {
            J = !0, e(Error("FileHistory: Error copying over backup from previous session"))
          }
        }
        k(`FileHistory: Copied backup ${I.backupFileName} from session ${G} to ${Z}`)
      }
      if (!J) zW1(Y.messageId, Y, !1).catch((X) => {
        e(Error("FileHistory: Failed to record copy backup snapshot"))
      });
      else l("tengu_file_history_resume_copy_failed", {
        numSnapshots: Q.length
      })
    }
  } catch (Y) {
    e(Y)
  }
}
// @from(Ln 334684, Col 0)
function eg5(A, Q) {
  let B = A.snapshots.at(-1),
    G = Q.snapshots.at(-1);
  if (!G) return;
  let Z = vA();
  for (let Y of Q.trackedFiles) {
    let J = m$0(Y),
      X = B?.trackedFileBackups[Y],
      I = G.trackedFileBackups[Y];
    if (X?.backupFileName === I?.backupFileName && X?.version === I?.version) continue;
    let D = null;
    if (X?.backupFileName) try {
      let K = cs(X.backupFileName);
      if (Z.existsSync(K)) D = Z.readFileSync(K, {
        encoding: "utf-8"
      })
    } catch {}
    let W = null;
    if (I?.backupFileName) try {
      let K = cs(I.backupFileName);
      if (Z.existsSync(K)) W = Z.readFileSync(K, {
        encoding: "utf-8"
      })
    } catch {} else if (I?.backupFileName === null) W = null;
    if (D !== W) ds(J, D, W)
  }
}
// @from(Ln 334712, Col 0)
function sy2(A) {
  if (Au5) console.error(ag5(A, !1, 5))
}