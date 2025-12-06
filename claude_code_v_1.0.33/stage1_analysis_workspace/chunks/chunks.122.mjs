
// @from(Start 11526551, End 11553839)
hS2 = z((yS2) => {
  Object.defineProperty(yS2, "__esModule", {
    value: !0
  });
  yS2.createMessageConnection = yS2.ConnectionOptions = yS2.MessageStrategy = yS2.CancellationStrategy = yS2.CancellationSenderStrategy = yS2.CancellationReceiverStrategy = yS2.RequestCancellationReceiverStrategy = yS2.IdCancellationReceiverStrategy = yS2.ConnectionStrategy = yS2.ConnectionError = yS2.ConnectionErrors = yS2.LogTraceNotification = yS2.SetTraceNotification = yS2.TraceFormat = yS2.TraceValues = yS2.Trace = yS2.NullLogger = yS2.ProgressType = yS2.ProgressToken = void 0;
  var PS2 = Dn(),
    sY = BWA(),
    z4 = c60(),
    jS2 = l60(),
    mRA = GWA(),
    G50 = Q51(),
    pRA;
  (function(A) {
    A.type = new z4.NotificationType("$/cancelRequest")
  })(pRA || (pRA = {}));
  var Z50;
  (function(A) {
    function Q(B) {
      return typeof B === "string" || typeof B === "number"
    }
    A.is = Q
  })(Z50 || (yS2.ProgressToken = Z50 = {}));
  var dRA;
  (function(A) {
    A.type = new z4.NotificationType("$/progress")
  })(dRA || (dRA = {}));
  class kS2 {
    constructor() {}
  }
  yS2.ProgressType = kS2;
  var I50;
  (function(A) {
    function Q(B) {
      return sY.func(B)
    }
    A.is = Q
  })(I50 || (I50 = {}));
  yS2.NullLogger = Object.freeze({
    error: () => {},
    warn: () => {},
    info: () => {},
    log: () => {}
  });
  var k7;
  (function(A) {
    A[A.Off = 0] = "Off", A[A.Messages = 1] = "Messages", A[A.Compact = 2] = "Compact", A[A.Verbose = 3] = "Verbose"
  })(k7 || (yS2.Trace = k7 = {}));
  var SS2;
  (function(A) {
    A.Off = "off", A.Messages = "messages", A.Compact = "compact", A.Verbose = "verbose"
  })(SS2 || (yS2.TraceValues = SS2 = {}));
  (function(A) {
    function Q(G) {
      if (!sY.string(G)) return A.Off;
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
  })(k7 || (yS2.Trace = k7 = {}));
  var jq;
  (function(A) {
    A.Text = "text", A.JSON = "json"
  })(jq || (yS2.TraceFormat = jq = {}));
  (function(A) {
    function Q(B) {
      if (!sY.string(B)) return A.Text;
      if (B = B.toLowerCase(), B === "json") return A.JSON;
      else return A.Text
    }
    A.fromString = Q
  })(jq || (yS2.TraceFormat = jq = {}));
  var Y50;
  (function(A) {
    A.type = new z4.NotificationType("$/setTrace")
  })(Y50 || (yS2.SetTraceNotification = Y50 = {}));
  var B51;
  (function(A) {
    A.type = new z4.NotificationType("$/logTrace")
  })(B51 || (yS2.LogTraceNotification = B51 = {}));
  var cRA;
  (function(A) {
    A[A.Closed = 1] = "Closed", A[A.Disposed = 2] = "Disposed", A[A.AlreadyListening = 3] = "AlreadyListening"
  })(cRA || (yS2.ConnectionErrors = cRA = {}));
  class IWA extends Error {
    constructor(A, Q) {
      super(Q);
      this.code = A, Object.setPrototypeOf(this, IWA.prototype)
    }
  }
  yS2.ConnectionError = IWA;
  var J50;
  (function(A) {
    function Q(B) {
      let G = B;
      return G && sY.func(G.cancelUndispatched)
    }
    A.is = Q
  })(J50 || (yS2.ConnectionStrategy = J50 = {}));
  var G51;
  (function(A) {
    function Q(B) {
      let G = B;
      return G && (G.kind === void 0 || G.kind === "id") && sY.func(G.createCancellationTokenSource) && (G.dispose === void 0 || sY.func(G.dispose))
    }
    A.is = Q
  })(G51 || (yS2.IdCancellationReceiverStrategy = G51 = {}));
  var W50;
  (function(A) {
    function Q(B) {
      let G = B;
      return G && G.kind === "request" && sY.func(G.createCancellationTokenSource) && (G.dispose === void 0 || sY.func(G.dispose))
    }
    A.is = Q
  })(W50 || (yS2.RequestCancellationReceiverStrategy = W50 = {}));
  var Z51;
  (function(A) {
    A.Message = Object.freeze({
      createCancellationTokenSource(B) {
        return new G50.CancellationTokenSource
      }
    });

    function Q(B) {
      return G51.is(B) || W50.is(B)
    }
    A.is = Q
  })(Z51 || (yS2.CancellationReceiverStrategy = Z51 = {}));
  var I51;
  (function(A) {
    A.Message = Object.freeze({
      sendCancellation(B, G) {
        return B.sendNotification(pRA.type, {
          id: G
        })
      },
      cleanup(B) {}
    });

    function Q(B) {
      let G = B;
      return G && sY.func(G.sendCancellation) && sY.func(G.cleanup)
    }
    A.is = Q
  })(I51 || (yS2.CancellationSenderStrategy = I51 = {}));
  var Y51;
  (function(A) {
    A.Message = Object.freeze({
      receiver: Z51.Message,
      sender: I51.Message
    });

    function Q(B) {
      let G = B;
      return G && Z51.is(G.receiver) && I51.is(G.sender)
    }
    A.is = Q
  })(Y51 || (yS2.CancellationStrategy = Y51 = {}));
  var J51;
  (function(A) {
    function Q(B) {
      let G = B;
      return G && sY.func(G.handleMessage)
    }
    A.is = Q
  })(J51 || (yS2.MessageStrategy = J51 = {}));
  var _S2;
  (function(A) {
    function Q(B) {
      let G = B;
      return G && (Y51.is(G.cancellationStrategy) || J50.is(G.connectionStrategy) || J51.is(G.messageStrategy))
    }
    A.is = Q
  })(_S2 || (yS2.ConnectionOptions = _S2 = {}));
  var PP;
  (function(A) {
    A[A.New = 1] = "New", A[A.Listening = 2] = "Listening", A[A.Closed = 3] = "Closed", A[A.Disposed = 4] = "Disposed"
  })(PP || (PP = {}));

  function Tg5(A, Q, B, G) {
    let Z = B !== void 0 ? B : yS2.NullLogger,
      I = 0,
      Y = 0,
      J = 0,
      W = "2.0",
      X = void 0,
      V = new Map,
      F = void 0,
      K = new Map,
      D = new Map,
      H, C = new jS2.LinkedMap,
      E = new Map,
      U = new Set,
      q = new Map,
      w = k7.Off,
      N = jq.Text,
      R, T = PP.New,
      y = new mRA.Emitter,
      v = new mRA.Emitter,
      x = new mRA.Emitter,
      p = new mRA.Emitter,
      u = new mRA.Emitter,
      e = G && G.cancellationStrategy ? G.cancellationStrategy : Y51.Message;

    function l(W1) {
      if (W1 === null) throw Error("Can't send requests with id null since the response can't be correlated.");
      return "req-" + W1.toString()
    }

    function k(W1) {
      if (W1 === null) return "res-unknown-" + (++J).toString();
      else return "res-" + W1.toString()
    }

    function m() {
      return "not-" + (++Y).toString()
    }

    function o(W1, O1) {
      if (z4.Message.isRequest(O1)) W1.set(l(O1.id), O1);
      else if (z4.Message.isResponse(O1)) W1.set(k(O1.id), O1);
      else W1.set(m(), O1)
    }

    function IA(W1) {
      return
    }

    function FA() {
      return T === PP.Listening
    }

    function zA() {
      return T === PP.Closed
    }

    function NA() {
      return T === PP.Disposed
    }

    function OA() {
      if (T === PP.New || T === PP.Listening) T = PP.Closed, v.fire(void 0)
    }

    function mA(W1) {
      y.fire([W1, void 0, void 0])
    }

    function wA(W1) {
      y.fire(W1)
    }
    A.onClose(OA), A.onError(mA), Q.onClose(OA), Q.onError(wA);

    function qA() {
      if (H || C.size === 0) return;
      H = (0, PS2.default)().timer.setImmediate(() => {
        H = void 0, yA()
      })
    }

    function KA(W1) {
      if (z4.Message.isRequest(W1)) X1(W1);
      else if (z4.Message.isNotification(W1)) EA(W1);
      else if (z4.Message.isResponse(W1)) WA(W1);
      else MA(W1)
    }

    function yA() {
      if (C.size === 0) return;
      let W1 = C.shift();
      try {
        let O1 = G?.messageStrategy;
        if (J51.is(O1)) O1.handleMessage(W1, KA);
        else KA(W1)
      } finally {
        qA()
      }
    }
    let oA = (W1) => {
      try {
        if (z4.Message.isNotification(W1) && W1.method === pRA.type.method) {
          let O1 = W1.params.id,
            a1 = l(O1),
            C0 = C.get(a1);
          if (z4.Message.isRequest(C0)) {
            let k0 = G?.connectionStrategy,
              f0 = k0 && k0.cancelUndispatched ? k0.cancelUndispatched(C0, IA) : IA(C0);
            if (f0 && (f0.error !== void 0 || f0.result !== void 0)) {
              C.delete(a1), q.delete(O1), f0.id = C0.id, rA(f0, W1.method, Date.now()), Q.write(f0).catch(() => Z.error("Sending response for canceled message failed."));
              return
            }
          }
          let v0 = q.get(O1);
          if (v0 !== void 0) {
            v0.cancel(), J1(W1);
            return
          } else U.add(O1)
        }
        o(C, W1)
      } finally {
        qA()
      }
    };

    function X1(W1) {
      if (NA()) return;

      function O1(yQ, aQ, sQ) {
        let K0 = {
          jsonrpc: W,
          id: W1.id
        };
        if (yQ instanceof z4.ResponseError) K0.error = yQ.toJson();
        else K0.result = yQ === void 0 ? null : yQ;
        rA(K0, aQ, sQ), Q.write(K0).catch(() => Z.error("Sending response failed."))
      }

      function a1(yQ, aQ, sQ) {
        let K0 = {
          jsonrpc: W,
          id: W1.id,
          error: yQ.toJson()
        };
        rA(K0, aQ, sQ), Q.write(K0).catch(() => Z.error("Sending response failed."))
      }

      function C0(yQ, aQ, sQ) {
        if (yQ === void 0) yQ = null;
        let K0 = {
          jsonrpc: W,
          id: W1.id,
          result: yQ
        };
        rA(K0, aQ, sQ), Q.write(K0).catch(() => Z.error("Sending response failed."))
      }
      iA(W1);
      let v0 = V.get(W1.method),
        k0, f0;
      if (v0) k0 = v0.type, f0 = v0.handler;
      let G0 = Date.now();
      if (f0 || X) {
        let yQ = W1.id ?? String(Date.now()),
          aQ = G51.is(e.receiver) ? e.receiver.createCancellationTokenSource(yQ) : e.receiver.createCancellationTokenSource(W1);
        if (W1.id !== null && U.has(W1.id)) aQ.cancel();
        if (W1.id !== null) q.set(yQ, aQ);
        try {
          let sQ;
          if (f0)
            if (W1.params === void 0) {
              if (k0 !== void 0 && k0.numberOfParams !== 0) {
                a1(new z4.ResponseError(z4.ErrorCodes.InvalidParams, `Request ${W1.method} defines ${k0.numberOfParams} params but received none.`), W1.method, G0);
                return
              }
              sQ = f0(aQ.token)
            } else if (Array.isArray(W1.params)) {
            if (k0 !== void 0 && k0.parameterStructures === z4.ParameterStructures.byName) {
              a1(new z4.ResponseError(z4.ErrorCodes.InvalidParams, `Request ${W1.method} defines parameters by name but received parameters by position`), W1.method, G0);
              return
            }
            sQ = f0(...W1.params, aQ.token)
          } else {
            if (k0 !== void 0 && k0.parameterStructures === z4.ParameterStructures.byPosition) {
              a1(new z4.ResponseError(z4.ErrorCodes.InvalidParams, `Request ${W1.method} defines parameters by position but received parameters by name`), W1.method, G0);
              return
            }
            sQ = f0(W1.params, aQ.token)
          } else if (X) sQ = X(W1.method, W1.params, aQ.token);
          let K0 = sQ;
          if (!sQ) q.delete(yQ), C0(sQ, W1.method, G0);
          else if (K0.then) K0.then((mB) => {
            q.delete(yQ), O1(mB, W1.method, G0)
          }, (mB) => {
            if (q.delete(yQ), mB instanceof z4.ResponseError) a1(mB, W1.method, G0);
            else if (mB && sY.string(mB.message)) a1(new z4.ResponseError(z4.ErrorCodes.InternalError, `Request ${W1.method} failed with message: ${mB.message}`), W1.method, G0);
            else a1(new z4.ResponseError(z4.ErrorCodes.InternalError, `Request ${W1.method} failed unexpectedly without providing any details.`), W1.method, G0)
          });
          else q.delete(yQ), O1(sQ, W1.method, G0)
        } catch (sQ) {
          if (q.delete(yQ), sQ instanceof z4.ResponseError) O1(sQ, W1.method, G0);
          else if (sQ && sY.string(sQ.message)) a1(new z4.ResponseError(z4.ErrorCodes.InternalError, `Request ${W1.method} failed with message: ${sQ.message}`), W1.method, G0);
          else a1(new z4.ResponseError(z4.ErrorCodes.InternalError, `Request ${W1.method} failed unexpectedly without providing any details.`), W1.method, G0)
        }
      } else a1(new z4.ResponseError(z4.ErrorCodes.MethodNotFound, `Unhandled method ${W1.method}`), W1.method, G0)
    }

    function WA(W1) {
      if (NA()) return;
      if (W1.id === null)
        if (W1.error) Z.error(`Received response message without id: Error is: 
${JSON.stringify(W1.error,void 0,4)}`);
        else Z.error("Received response message without id. No further error information provided.");
      else {
        let O1 = W1.id,
          a1 = E.get(O1);
        if (w1(W1, a1), a1 !== void 0) {
          E.delete(O1);
          try {
            if (W1.error) {
              let C0 = W1.error;
              a1.reject(new z4.ResponseError(C0.code, C0.message, C0.data))
            } else if (W1.result !== void 0) a1.resolve(W1.result);
            else throw Error("Should never happen.")
          } catch (C0) {
            if (C0.message) Z.error(`Response handler '${a1.method}' failed with message: ${C0.message}`);
            else Z.error(`Response handler '${a1.method}' failed unexpectedly.`)
          }
        }
      }
    }

    function EA(W1) {
      if (NA()) return;
      let O1 = void 0,
        a1;
      if (W1.method === pRA.type.method) {
        let C0 = W1.params.id;
        U.delete(C0), J1(W1);
        return
      } else {
        let C0 = K.get(W1.method);
        if (C0) a1 = C0.handler, O1 = C0.type
      }
      if (a1 || F) try {
        if (J1(W1), a1)
          if (W1.params === void 0) {
            if (O1 !== void 0) {
              if (O1.numberOfParams !== 0 && O1.parameterStructures !== z4.ParameterStructures.byName) Z.error(`Notification ${W1.method} defines ${O1.numberOfParams} params but received none.`)
            }
            a1()
          } else if (Array.isArray(W1.params)) {
          let C0 = W1.params;
          if (W1.method === dRA.type.method && C0.length === 2 && Z50.is(C0[0])) a1({
            token: C0[0],
            value: C0[1]
          });
          else {
            if (O1 !== void 0) {
              if (O1.parameterStructures === z4.ParameterStructures.byName) Z.error(`Notification ${W1.method} defines parameters by name but received parameters by position`);
              if (O1.numberOfParams !== W1.params.length) Z.error(`Notification ${W1.method} defines ${O1.numberOfParams} params but received ${C0.length} arguments`)
            }
            a1(...C0)
          }
        } else {
          if (O1 !== void 0 && O1.parameterStructures === z4.ParameterStructures.byPosition) Z.error(`Notification ${W1.method} defines parameters by position but received parameters by name`);
          a1(W1.params)
        } else if (F) F(W1.method, W1.params)
      } catch (C0) {
        if (C0.message) Z.error(`Notification handler '${W1.method}' failed with message: ${C0.message}`);
        else Z.error(`Notification handler '${W1.method}' failed unexpectedly.`)
      } else x.fire(W1)
    }

    function MA(W1) {
      if (!W1) {
        Z.error("Received empty message.");
        return
      }
      Z.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(W1,null,4)}`);
      let O1 = W1;
      if (sY.string(O1.id) || sY.number(O1.id)) {
        let a1 = O1.id,
          C0 = E.get(a1);
        if (C0) C0.reject(Error("The received response has neither a result nor an error property."))
      }
    }

    function DA(W1) {
      if (W1 === void 0 || W1 === null) return;
      switch (w) {
        case k7.Verbose:
          return JSON.stringify(W1, null, 4);
        case k7.Compact:
          return JSON.stringify(W1);
        default:
          return
      }
    }

    function $A(W1) {
      if (w === k7.Off || !R) return;
      if (N === jq.Text) {
        let O1 = void 0;
        if ((w === k7.Verbose || w === k7.Compact) && W1.params) O1 = `Params: ${DA(W1.params)}

`;
        R.log(`Sending request '${W1.method} - (${W1.id})'.`, O1)
      } else jA("send-request", W1)
    }

    function TA(W1) {
      if (w === k7.Off || !R) return;
      if (N === jq.Text) {
        let O1 = void 0;
        if (w === k7.Verbose || w === k7.Compact)
          if (W1.params) O1 = `Params: ${DA(W1.params)}

`;
          else O1 = `No parameters provided.

`;
        R.log(`Sending notification '${W1.method}'.`, O1)
      } else jA("send-notification", W1)
    }

    function rA(W1, O1, a1) {
      if (w === k7.Off || !R) return;
      if (N === jq.Text) {
        let C0 = void 0;
        if (w === k7.Verbose || w === k7.Compact) {
          if (W1.error && W1.error.data) C0 = `Error data: ${DA(W1.error.data)}

`;
          else if (W1.result) C0 = `Result: ${DA(W1.result)}

`;
          else if (W1.error === void 0) C0 = `No result returned.

`
        }
        R.log(`Sending response '${O1} - (${W1.id})'. Processing request took ${Date.now()-a1}ms`, C0)
      } else jA("send-response", W1)
    }

    function iA(W1) {
      if (w === k7.Off || !R) return;
      if (N === jq.Text) {
        let O1 = void 0;
        if ((w === k7.Verbose || w === k7.Compact) && W1.params) O1 = `Params: ${DA(W1.params)}

`;
        R.log(`Received request '${W1.method} - (${W1.id})'.`, O1)
      } else jA("receive-request", W1)
    }

    function J1(W1) {
      if (w === k7.Off || !R || W1.method === B51.type.method) return;
      if (N === jq.Text) {
        let O1 = void 0;
        if (w === k7.Verbose || w === k7.Compact)
          if (W1.params) O1 = `Params: ${DA(W1.params)}

`;
          else O1 = `No parameters provided.

`;
        R.log(`Received notification '${W1.method}'.`, O1)
      } else jA("receive-notification", W1)
    }

    function w1(W1, O1) {
      if (w === k7.Off || !R) return;
      if (N === jq.Text) {
        let a1 = void 0;
        if (w === k7.Verbose || w === k7.Compact) {
          if (W1.error && W1.error.data) a1 = `Error data: ${DA(W1.error.data)}

`;
          else if (W1.result) a1 = `Result: ${DA(W1.result)}

`;
          else if (W1.error === void 0) a1 = `No result returned.

`
        }
        if (O1) {
          let C0 = W1.error ? ` Request failed: ${W1.error.message} (${W1.error.code}).` : "";
          R.log(`Received response '${O1.method} - (${W1.id})' in ${Date.now()-O1.timerStart}ms.${C0}`, a1)
        } else R.log(`Received response ${W1.id} without active response promise.`, a1)
      } else jA("receive-response", W1)
    }

    function jA(W1, O1) {
      if (!R || w === k7.Off) return;
      let a1 = {
        isLSPMessage: !0,
        type: W1,
        message: O1,
        timestamp: Date.now()
      };
      R.log(a1)
    }

    function eA() {
      if (zA()) throw new IWA(cRA.Closed, "Connection is closed.");
      if (NA()) throw new IWA(cRA.Disposed, "Connection is disposed.")
    }

    function t1() {
      if (FA()) throw new IWA(cRA.AlreadyListening, "Connection is already listening")
    }

    function v1() {
      if (!FA()) throw Error("Call listen() first.")
    }

    function F0(W1) {
      if (W1 === void 0) return null;
      else return W1
    }

    function g0(W1) {
      if (W1 === null) return;
      else return W1
    }

    function p0(W1) {
      return W1 !== void 0 && W1 !== null && !Array.isArray(W1) && typeof W1 === "object"
    }

    function n0(W1, O1) {
      switch (W1) {
        case z4.ParameterStructures.auto:
          if (p0(O1)) return g0(O1);
          else return [F0(O1)];
        case z4.ParameterStructures.byName:
          if (!p0(O1)) throw Error("Received parameters by name but param is not an object literal.");
          return g0(O1);
        case z4.ParameterStructures.byPosition:
          return [F0(O1)];
        default:
          throw Error(`Unknown parameter structure ${W1.toString()}`)
      }
    }

    function _1(W1, O1) {
      let a1, C0 = W1.numberOfParams;
      switch (C0) {
        case 0:
          a1 = void 0;
          break;
        case 1:
          a1 = n0(W1.parameterStructures, O1[0]);
          break;
        default:
          a1 = [];
          for (let v0 = 0; v0 < O1.length && v0 < C0; v0++) a1.push(F0(O1[v0]));
          if (O1.length < C0)
            for (let v0 = O1.length; v0 < C0; v0++) a1.push(null);
          break
      }
      return a1
    }
    let zQ = {
      sendNotification: (W1, ...O1) => {
        eA();
        let a1, C0;
        if (sY.string(W1)) {
          a1 = W1;
          let k0 = O1[0],
            f0 = 0,
            G0 = z4.ParameterStructures.auto;
          if (z4.ParameterStructures.is(k0)) f0 = 1, G0 = k0;
          let yQ = O1.length,
            aQ = yQ - f0;
          switch (aQ) {
            case 0:
              C0 = void 0;
              break;
            case 1:
              C0 = n0(G0, O1[f0]);
              break;
            default:
              if (G0 === z4.ParameterStructures.byName) throw Error(`Received ${aQ} parameters for 'by Name' notification parameter structure.`);
              C0 = O1.slice(f0, yQ).map((sQ) => F0(sQ));
              break
          }
        } else {
          let k0 = O1;
          a1 = W1.method, C0 = _1(W1, k0)
        }
        let v0 = {
          jsonrpc: W,
          method: a1,
          params: C0
        };
        return TA(v0), Q.write(v0).catch((k0) => {
          throw Z.error("Sending notification failed."), k0
        })
      },
      onNotification: (W1, O1) => {
        eA();
        let a1;
        if (sY.func(W1)) F = W1;
        else if (O1)
          if (sY.string(W1)) a1 = W1, K.set(W1, {
            type: void 0,
            handler: O1
          });
          else a1 = W1.method, K.set(W1.method, {
            type: W1,
            handler: O1
          });
        return {
          dispose: () => {
            if (a1 !== void 0) K.delete(a1);
            else F = void 0
          }
        }
      },
      onProgress: (W1, O1, a1) => {
        if (D.has(O1)) throw Error(`Progress handler for token ${O1} already registered`);
        return D.set(O1, a1), {
          dispose: () => {
            D.delete(O1)
          }
        }
      },
      sendProgress: (W1, O1, a1) => {
        return zQ.sendNotification(dRA.type, {
          token: O1,
          value: a1
        })
      },
      onUnhandledProgress: p.event,
      sendRequest: (W1, ...O1) => {
        eA(), v1();
        let a1, C0, v0 = void 0;
        if (sY.string(W1)) {
          a1 = W1;
          let yQ = O1[0],
            aQ = O1[O1.length - 1],
            sQ = 0,
            K0 = z4.ParameterStructures.auto;
          if (z4.ParameterStructures.is(yQ)) sQ = 1, K0 = yQ;
          let mB = O1.length;
          if (G50.CancellationToken.is(aQ)) mB = mB - 1, v0 = aQ;
          let e2 = mB - sQ;
          switch (e2) {
            case 0:
              C0 = void 0;
              break;
            case 1:
              C0 = n0(K0, O1[sQ]);
              break;
            default:
              if (K0 === z4.ParameterStructures.byName) throw Error(`Received ${e2} parameters for 'by Name' request parameter structure.`);
              C0 = O1.slice(sQ, mB).map((s8) => F0(s8));
              break
          }
        } else {
          let yQ = O1;
          a1 = W1.method, C0 = _1(W1, yQ);
          let aQ = W1.numberOfParams;
          v0 = G50.CancellationToken.is(yQ[aQ]) ? yQ[aQ] : void 0
        }
        let k0 = I++,
          f0;
        if (v0) f0 = v0.onCancellationRequested(() => {
          let yQ = e.sender.sendCancellation(zQ, k0);
          if (yQ === void 0) return Z.log(`Received no promise from cancellation strategy when cancelling id ${k0}`), Promise.resolve();
          else return yQ.catch(() => {
            Z.log(`Sending cancellation messages for id ${k0} failed`)
          })
        });
        let G0 = {
          jsonrpc: W,
          id: k0,
          method: a1,
          params: C0
        };
        if ($A(G0), typeof e.sender.enableCancellation === "function") e.sender.enableCancellation(G0);
        return new Promise(async (yQ, aQ) => {
          let sQ = (e2) => {
              yQ(e2), e.sender.cleanup(k0), f0?.dispose()
            },
            K0 = (e2) => {
              aQ(e2), e.sender.cleanup(k0), f0?.dispose()
            },
            mB = {
              method: a1,
              timerStart: Date.now(),
              resolve: sQ,
              reject: K0
            };
          try {
            E.set(k0, mB), await Q.write(G0)
          } catch (e2) {
            throw E.delete(k0), mB.reject(new z4.ResponseError(z4.ErrorCodes.MessageWriteError, e2.message ? e2.message : "Unknown reason")), Z.error("Sending request failed."), e2
          }
        })
      },
      onRequest: (W1, O1) => {
        eA();
        let a1 = null;
        if (I50.is(W1)) a1 = void 0, X = W1;
        else if (sY.string(W1)) {
          if (a1 = null, O1 !== void 0) a1 = W1, V.set(W1, {
            handler: O1,
            type: void 0
          })
        } else if (O1 !== void 0) a1 = W1.method, V.set(W1.method, {
          type: W1,
          handler: O1
        });
        return {
          dispose: () => {
            if (a1 === null) return;
            if (a1 !== void 0) V.delete(a1);
            else X = void 0
          }
        }
      },
      hasPendingResponse: () => {
        return E.size > 0
      },
      trace: async (W1, O1, a1) => {
        let C0 = !1,
          v0 = jq.Text;
        if (a1 !== void 0)
          if (sY.boolean(a1)) C0 = a1;
          else C0 = a1.sendNotification || !1, v0 = a1.traceFormat || jq.Text;
        if (w = W1, N = v0, w === k7.Off) R = void 0;
        else R = O1;
        if (C0 && !zA() && !NA()) await zQ.sendNotification(Y50.type, {
          value: k7.toString(W1)
        })
      },
      onError: y.event,
      onClose: v.event,
      onUnhandledNotification: x.event,
      onDispose: u.event,
      end: () => {
        Q.end()
      },
      dispose: () => {
        if (NA()) return;
        T = PP.Disposed, u.fire(void 0);
        let W1 = new z4.ResponseError(z4.ErrorCodes.PendingResponseRejected, "Pending response rejected since connection got disposed");
        for (let O1 of E.values()) O1.reject(W1);
        if (E = new Map, q = new Map, U = new Set, C = new jS2.LinkedMap, sY.func(Q.dispose)) Q.dispose();
        if (sY.func(A.dispose)) A.dispose()
      },
      listen: () => {
        eA(), t1(), T = PP.Listening, A.listen(oA)
      },
      inspect: () => {
        (0, PS2.default)().console.log("inspect")
      }
    };
    return zQ.onNotification(B51.type, (W1) => {
      if (w === k7.Off || !R) return;
      let O1 = w === k7.Verbose || w === k7.Compact;
      R.log(W1.message, O1 ? W1.verbose : void 0)
    }), zQ.onNotification(dRA.type, (W1) => {
      let O1 = D.get(W1.token);
      if (O1) O1(W1.value);
      else p.fire(W1)
    }), zQ
  }
  yS2.createMessageConnection = Tg5
})
// @from(Start 11553845, End 11563642)
W51 = z((v2) => {
  Object.defineProperty(v2, "__esModule", {
    value: !0
  });
  v2.ProgressType = v2.ProgressToken = v2.createMessageConnection = v2.NullLogger = v2.ConnectionOptions = v2.ConnectionStrategy = v2.AbstractMessageBuffer = v2.WriteableStreamMessageWriter = v2.AbstractMessageWriter = v2.MessageWriter = v2.ReadableStreamMessageReader = v2.AbstractMessageReader = v2.MessageReader = v2.SharedArrayReceiverStrategy = v2.SharedArraySenderStrategy = v2.CancellationToken = v2.CancellationTokenSource = v2.Emitter = v2.Event = v2.Disposable = v2.LRUCache = v2.Touch = v2.LinkedMap = v2.ParameterStructures = v2.NotificationType9 = v2.NotificationType8 = v2.NotificationType7 = v2.NotificationType6 = v2.NotificationType5 = v2.NotificationType4 = v2.NotificationType3 = v2.NotificationType2 = v2.NotificationType1 = v2.NotificationType0 = v2.NotificationType = v2.ErrorCodes = v2.ResponseError = v2.RequestType9 = v2.RequestType8 = v2.RequestType7 = v2.RequestType6 = v2.RequestType5 = v2.RequestType4 = v2.RequestType3 = v2.RequestType2 = v2.RequestType1 = v2.RequestType0 = v2.RequestType = v2.Message = v2.RAL = void 0;
  v2.MessageStrategy = v2.CancellationStrategy = v2.CancellationSenderStrategy = v2.CancellationReceiverStrategy = v2.ConnectionError = v2.ConnectionErrors = v2.LogTraceNotification = v2.SetTraceNotification = v2.TraceFormat = v2.TraceValues = v2.Trace = void 0;
  var aZ = c60();
  Object.defineProperty(v2, "Message", {
    enumerable: !0,
    get: function() {
      return aZ.Message
    }
  });
  Object.defineProperty(v2, "RequestType", {
    enumerable: !0,
    get: function() {
      return aZ.RequestType
    }
  });
  Object.defineProperty(v2, "RequestType0", {
    enumerable: !0,
    get: function() {
      return aZ.RequestType0
    }
  });
  Object.defineProperty(v2, "RequestType1", {
    enumerable: !0,
    get: function() {
      return aZ.RequestType1
    }
  });
  Object.defineProperty(v2, "RequestType2", {
    enumerable: !0,
    get: function() {
      return aZ.RequestType2
    }
  });
  Object.defineProperty(v2, "RequestType3", {
    enumerable: !0,
    get: function() {
      return aZ.RequestType3
    }
  });
  Object.defineProperty(v2, "RequestType4", {
    enumerable: !0,
    get: function() {
      return aZ.RequestType4
    }
  });
  Object.defineProperty(v2, "RequestType5", {
    enumerable: !0,
    get: function() {
      return aZ.RequestType5
    }
  });
  Object.defineProperty(v2, "RequestType6", {
    enumerable: !0,
    get: function() {
      return aZ.RequestType6
    }
  });
  Object.defineProperty(v2, "RequestType7", {
    enumerable: !0,
    get: function() {
      return aZ.RequestType7
    }
  });
  Object.defineProperty(v2, "RequestType8", {
    enumerable: !0,
    get: function() {
      return aZ.RequestType8
    }
  });
  Object.defineProperty(v2, "RequestType9", {
    enumerable: !0,
    get: function() {
      return aZ.RequestType9
    }
  });
  Object.defineProperty(v2, "ResponseError", {
    enumerable: !0,
    get: function() {
      return aZ.ResponseError
    }
  });
  Object.defineProperty(v2, "ErrorCodes", {
    enumerable: !0,
    get: function() {
      return aZ.ErrorCodes
    }
  });
  Object.defineProperty(v2, "NotificationType", {
    enumerable: !0,
    get: function() {
      return aZ.NotificationType
    }
  });
  Object.defineProperty(v2, "NotificationType0", {
    enumerable: !0,
    get: function() {
      return aZ.NotificationType0
    }
  });
  Object.defineProperty(v2, "NotificationType1", {
    enumerable: !0,
    get: function() {
      return aZ.NotificationType1
    }
  });
  Object.defineProperty(v2, "NotificationType2", {
    enumerable: !0,
    get: function() {
      return aZ.NotificationType2
    }
  });
  Object.defineProperty(v2, "NotificationType3", {
    enumerable: !0,
    get: function() {
      return aZ.NotificationType3
    }
  });
  Object.defineProperty(v2, "NotificationType4", {
    enumerable: !0,
    get: function() {
      return aZ.NotificationType4
    }
  });
  Object.defineProperty(v2, "NotificationType5", {
    enumerable: !0,
    get: function() {
      return aZ.NotificationType5
    }
  });
  Object.defineProperty(v2, "NotificationType6", {
    enumerable: !0,
    get: function() {
      return aZ.NotificationType6
    }
  });
  Object.defineProperty(v2, "NotificationType7", {
    enumerable: !0,
    get: function() {
      return aZ.NotificationType7
    }
  });
  Object.defineProperty(v2, "NotificationType8", {
    enumerable: !0,
    get: function() {
      return aZ.NotificationType8
    }
  });
  Object.defineProperty(v2, "NotificationType9", {
    enumerable: !0,
    get: function() {
      return aZ.NotificationType9
    }
  });
  Object.defineProperty(v2, "ParameterStructures", {
    enumerable: !0,
    get: function() {
      return aZ.ParameterStructures
    }
  });
  var X50 = l60();
  Object.defineProperty(v2, "LinkedMap", {
    enumerable: !0,
    get: function() {
      return X50.LinkedMap
    }
  });
  Object.defineProperty(v2, "LRUCache", {
    enumerable: !0,
    get: function() {
      return X50.LRUCache
    }
  });
  Object.defineProperty(v2, "Touch", {
    enumerable: !0,
    get: function() {
      return X50.Touch
    }
  });
  var cg5 = ij2();
  Object.defineProperty(v2, "Disposable", {
    enumerable: !0,
    get: function() {
      return cg5.Disposable
    }
  });
  var gS2 = GWA();
  Object.defineProperty(v2, "Event", {
    enumerable: !0,
    get: function() {
      return gS2.Event
    }
  });
  Object.defineProperty(v2, "Emitter", {
    enumerable: !0,
    get: function() {
      return gS2.Emitter
    }
  });
  var uS2 = Q51();
  Object.defineProperty(v2, "CancellationTokenSource", {
    enumerable: !0,
    get: function() {
      return uS2.CancellationTokenSource
    }
  });
  Object.defineProperty(v2, "CancellationToken", {
    enumerable: !0,
    get: function() {
      return uS2.CancellationToken
    }
  });
  var mS2 = JS2();
  Object.defineProperty(v2, "SharedArraySenderStrategy", {
    enumerable: !0,
    get: function() {
      return mS2.SharedArraySenderStrategy
    }
  });
  Object.defineProperty(v2, "SharedArrayReceiverStrategy", {
    enumerable: !0,
    get: function() {
      return mS2.SharedArrayReceiverStrategy
    }
  });
  var V50 = CS2();
  Object.defineProperty(v2, "MessageReader", {
    enumerable: !0,
    get: function() {
      return V50.MessageReader
    }
  });
  Object.defineProperty(v2, "AbstractMessageReader", {
    enumerable: !0,
    get: function() {
      return V50.AbstractMessageReader
    }
  });
  Object.defineProperty(v2, "ReadableStreamMessageReader", {
    enumerable: !0,
    get: function() {
      return V50.ReadableStreamMessageReader
    }
  });
  var F50 = LS2();
  Object.defineProperty(v2, "MessageWriter", {
    enumerable: !0,
    get: function() {
      return F50.MessageWriter
    }
  });
  Object.defineProperty(v2, "AbstractMessageWriter", {
    enumerable: !0,
    get: function() {
      return F50.AbstractMessageWriter
    }
  });
  Object.defineProperty(v2, "WriteableStreamMessageWriter", {
    enumerable: !0,
    get: function() {
      return F50.WriteableStreamMessageWriter
    }
  });
  var pg5 = TS2();
  Object.defineProperty(v2, "AbstractMessageBuffer", {
    enumerable: !0,
    get: function() {
      return pg5.AbstractMessageBuffer
    }
  });
  var pD = hS2();
  Object.defineProperty(v2, "ConnectionStrategy", {
    enumerable: !0,
    get: function() {
      return pD.ConnectionStrategy
    }
  });
  Object.defineProperty(v2, "ConnectionOptions", {
    enumerable: !0,
    get: function() {
      return pD.ConnectionOptions
    }
  });
  Object.defineProperty(v2, "NullLogger", {
    enumerable: !0,
    get: function() {
      return pD.NullLogger
    }
  });
  Object.defineProperty(v2, "createMessageConnection", {
    enumerable: !0,
    get: function() {
      return pD.createMessageConnection
    }
  });
  Object.defineProperty(v2, "ProgressToken", {
    enumerable: !0,
    get: function() {
      return pD.ProgressToken
    }
  });
  Object.defineProperty(v2, "ProgressType", {
    enumerable: !0,
    get: function() {
      return pD.ProgressType
    }
  });
  Object.defineProperty(v2, "Trace", {
    enumerable: !0,
    get: function() {
      return pD.Trace
    }
  });
  Object.defineProperty(v2, "TraceValues", {
    enumerable: !0,
    get: function() {
      return pD.TraceValues
    }
  });
  Object.defineProperty(v2, "TraceFormat", {
    enumerable: !0,
    get: function() {
      return pD.TraceFormat
    }
  });
  Object.defineProperty(v2, "SetTraceNotification", {
    enumerable: !0,
    get: function() {
      return pD.SetTraceNotification
    }
  });
  Object.defineProperty(v2, "LogTraceNotification", {
    enumerable: !0,
    get: function() {
      return pD.LogTraceNotification
    }
  });
  Object.defineProperty(v2, "ConnectionErrors", {
    enumerable: !0,
    get: function() {
      return pD.ConnectionErrors
    }
  });
  Object.defineProperty(v2, "ConnectionError", {
    enumerable: !0,
    get: function() {
      return pD.ConnectionError
    }
  });
  Object.defineProperty(v2, "CancellationReceiverStrategy", {
    enumerable: !0,
    get: function() {
      return pD.CancellationReceiverStrategy
    }
  });
  Object.defineProperty(v2, "CancellationSenderStrategy", {
    enumerable: !0,
    get: function() {
      return pD.CancellationSenderStrategy
    }
  });
  Object.defineProperty(v2, "CancellationStrategy", {
    enumerable: !0,
    get: function() {
      return pD.CancellationStrategy
    }
  });
  Object.defineProperty(v2, "MessageStrategy", {
    enumerable: !0,
    get: function() {
      return pD.MessageStrategy
    }
  });
  var lg5 = Dn();
  v2.RAL = lg5.default
})
// @from(Start 11563648, End 11567296)
nS2 = z((iS2) => {
  Object.defineProperty(iS2, "__esModule", {
    value: !0
  });
  var dS2 = UA("util"),
    ih = W51();
  class X51 extends ih.AbstractMessageBuffer {
    constructor(A = "utf-8") {
      super(A)
    }
    emptyBuffer() {
      return X51.emptyBuffer
    }
    fromString(A, Q) {
      return Buffer.from(A, Q)
    }
    toString(A, Q) {
      if (A instanceof Buffer) return A.toString(Q);
      else return new dS2.TextDecoder(Q).decode(A)
    }
    asNative(A, Q) {
      if (Q === void 0) return A instanceof Buffer ? A : Buffer.from(A);
      else return A instanceof Buffer ? A.slice(0, Q) : Buffer.from(A, 0, Q)
    }
    allocNative(A) {
      return Buffer.allocUnsafe(A)
    }
  }
  X51.emptyBuffer = Buffer.allocUnsafe(0);
  class cS2 {
    constructor(A) {
      this.stream = A
    }
    onClose(A) {
      return this.stream.on("close", A), ih.Disposable.create(() => this.stream.off("close", A))
    }
    onError(A) {
      return this.stream.on("error", A), ih.Disposable.create(() => this.stream.off("error", A))
    }
    onEnd(A) {
      return this.stream.on("end", A), ih.Disposable.create(() => this.stream.off("end", A))
    }
    onData(A) {
      return this.stream.on("data", A), ih.Disposable.create(() => this.stream.off("data", A))
    }
  }
  class pS2 {
    constructor(A) {
      this.stream = A
    }
    onClose(A) {
      return this.stream.on("close", A), ih.Disposable.create(() => this.stream.off("close", A))
    }
    onError(A) {
      return this.stream.on("error", A), ih.Disposable.create(() => this.stream.off("error", A))
    }
    onEnd(A) {
      return this.stream.on("end", A), ih.Disposable.create(() => this.stream.off("end", A))
    }
    write(A, Q) {
      return new Promise((B, G) => {
        let Z = (I) => {
          if (I === void 0 || I === null) B();
          else G(I)
        };
        if (typeof A === "string") this.stream.write(A, Q, Z);
        else this.stream.write(A, Z)
      })
    }
    end() {
      this.stream.end()
    }
  }
  var lS2 = Object.freeze({
    messageBuffer: Object.freeze({
      create: (A) => new X51(A)
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
            else return Promise.resolve(JSON.parse(new dS2.TextDecoder(Q.charset).decode(A)))
          } catch (B) {
            return Promise.reject(B)
          }
        }
      })
    }),
    stream: Object.freeze({
      asReadableStream: (A) => new cS2(A),
      asWritableStream: (A) => new pS2(A)
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

  function K50() {
    return lS2
  }(function(A) {
    function Q() {
      ih.RAL.install(lS2)
    }
    A.install = Q
  })(K50 || (K50 = {}));
  iS2.default = K50
})
// @from(Start 11567302, End 11573785)
A_2 = z((n5) => {
  var rg5 = n5 && n5.__createBinding || (Object.create ? function(A, Q, B, G) {
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
    og5 = n5 && n5.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) rg5(Q, A, B)
    };
  Object.defineProperty(n5, "__esModule", {
    value: !0
  });
  n5.createMessageConnection = n5.createServerSocketTransport = n5.createClientSocketTransport = n5.createServerPipeTransport = n5.createClientPipeTransport = n5.generateRandomPipeName = n5.StreamMessageWriter = n5.StreamMessageReader = n5.SocketMessageWriter = n5.SocketMessageReader = n5.PortMessageWriter = n5.PortMessageReader = n5.IPCMessageWriter = n5.IPCMessageReader = void 0;
  var YWA = nS2();
  YWA.default.install();
  var aS2 = UA("path"),
    tg5 = UA("os"),
    eg5 = UA("crypto"),
    V51 = UA("net"),
    Sq = W51();
  og5(W51(), n5);
  class rS2 extends Sq.AbstractMessageReader {
    constructor(A) {
      super();
      this.process = A;
      let Q = this.process;
      Q.on("error", (B) => this.fireError(B)), Q.on("close", () => this.fireClose())
    }
    listen(A) {
      return this.process.on("message", A), Sq.Disposable.create(() => this.process.off("message", A))
    }
  }
  n5.IPCMessageReader = rS2;
  class oS2 extends Sq.AbstractMessageWriter {
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
  n5.IPCMessageWriter = oS2;
  class tS2 extends Sq.AbstractMessageReader {
    constructor(A) {
      super();
      this.onData = new Sq.Emitter, A.on("close", () => this.fireClose), A.on("error", (Q) => this.fireError(Q)), A.on("message", (Q) => {
        this.onData.fire(Q)
      })
    }
    listen(A) {
      return this.onData.event(A)
    }
  }
  n5.PortMessageReader = tS2;
  class eS2 extends Sq.AbstractMessageWriter {
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
  n5.PortMessageWriter = eS2;
  class JWA extends Sq.ReadableStreamMessageReader {
    constructor(A, Q = "utf-8") {
      super((0, YWA.default)().stream.asReadableStream(A), Q)
    }
  }
  n5.SocketMessageReader = JWA;
  class WWA extends Sq.WriteableStreamMessageWriter {
    constructor(A, Q) {
      super((0, YWA.default)().stream.asWritableStream(A), Q);
      this.socket = A
    }
    dispose() {
      super.dispose(), this.socket.destroy()
    }
  }
  n5.SocketMessageWriter = WWA;
  class D50 extends Sq.ReadableStreamMessageReader {
    constructor(A, Q) {
      super((0, YWA.default)().stream.asReadableStream(A), Q)
    }
  }
  n5.StreamMessageReader = D50;
  class H50 extends Sq.WriteableStreamMessageWriter {
    constructor(A, Q) {
      super((0, YWA.default)().stream.asWritableStream(A), Q)
    }
  }
  n5.StreamMessageWriter = H50;
  var sS2 = process.env.XDG_RUNTIME_DIR,
    Au5 = new Map([
      ["linux", 107],
      ["darwin", 103]
    ]);

  function Qu5() {
    let A = (0, eg5.randomBytes)(21).toString("hex");
    if (process.platform === "win32") return `\\\\.\\pipe\\vscode-jsonrpc-${A}-sock`;
    let Q;
    if (sS2) Q = aS2.join(sS2, `vscode-ipc-${A}.sock`);
    else Q = aS2.join(tg5.tmpdir(), `vscode-${A}.sock`);
    let B = Au5.get(process.platform);
    if (B !== void 0 && Q.length > B)(0, YWA.default)().console.warn(`WARNING: IPC handle "${Q}" is longer than ${B} characters.`);
    return Q
  }
  n5.generateRandomPipeName = Qu5;

  function Bu5(A, Q = "utf-8") {
    let B, G = new Promise((Z, I) => {
      B = Z
    });
    return new Promise((Z, I) => {
      let Y = (0, V51.createServer)((J) => {
        Y.close(), B([new JWA(J, Q), new WWA(J, Q)])
      });
      Y.on("error", I), Y.listen(A, () => {
        Y.removeListener("error", I), Z({
          onConnected: () => {
            return G
          }
        })
      })
    })
  }
  n5.createClientPipeTransport = Bu5;

  function Gu5(A, Q = "utf-8") {
    let B = (0, V51.createConnection)(A);
    return [new JWA(B, Q), new WWA(B, Q)]
  }
  n5.createServerPipeTransport = Gu5;

  function Zu5(A, Q = "utf-8") {
    let B, G = new Promise((Z, I) => {
      B = Z
    });
    return new Promise((Z, I) => {
      let Y = (0, V51.createServer)((J) => {
        Y.close(), B([new JWA(J, Q), new WWA(J, Q)])
      });
      Y.on("error", I), Y.listen(A, "127.0.0.1", () => {
        Y.removeListener("error", I), Z({
          onConnected: () => {
            return G
          }
        })
      })
    })
  }
  n5.createClientSocketTransport = Zu5;

  function Iu5(A, Q = "utf-8") {
    let B = (0, V51.createConnection)(A, "127.0.0.1");
    return [new JWA(B, Q), new WWA(B, Q)]
  }
  n5.createServerSocketTransport = Iu5;

  function Yu5(A) {
    let Q = A;
    return Q.read !== void 0 && Q.addListener !== void 0
  }

  function Ju5(A) {
    let Q = A;
    return Q.write !== void 0 && Q.addListener !== void 0
  }

  function Wu5(A, Q, B, G) {
    if (!B) B = Sq.NullLogger;
    let Z = Yu5(A) ? new D50(A) : A,
      I = Ju5(Q) ? new H50(Q) : Q;
    if (Sq.ConnectionStrategy.is(G)) G = {
      connectionStrategy: G
    };
    return (0, Sq.createMessageConnection)(Z, I, B, G)
  }
  n5.createMessageConnection = Wu5
})
// @from(Start 11573836, End 11578998)
function Q_2(A) {
  let Q, B, G, Z = !1,
    I = !1,
    Y, J = !1,
    W = [],
    X = [];

  function V() {
    if (I) throw Y || Error(`LSP server ${A} failed to start`)
  }
  return {
    get capabilities() {
      return G
    },
    get isInitialized() {
      return Z
    },
    async start(F, K, D) {
      try {
        if (Q = Xu5(F, K, {
            stdio: ["pipe", "pipe", "pipe"],
            env: D?.env ? {
              ...globalThis.process.env,
              ...D.env
            } : void 0,
            cwd: D?.cwd
          }), !Q.stdout || !Q.stdin) throw Error("LSP server process stdio not available");
        let H = Q;
        if (await new Promise((U, q) => {
            let w = () => {
                R(), U()
              },
              N = (T) => {
                R(), q(T)
              },
              R = () => {
                H.removeListener("spawn", w), H.removeListener("error", N)
              };
            H.once("spawn", w), H.once("error", N)
          }), Q.stderr) Q.stderr.on("data", (U) => {
          let q = U.toString().trim();
          if (q) g(`[LSP SERVER ${A}] ${q}`)
        });
        Q.on("error", (U) => {
          if (!J) I = !0, Y = U, AA(Error(`LSP server ${A} failed to start: ${U.message}`))
        }), Q.on("exit", (U, q) => {
          if (U !== 0 && U !== null && !J) Z = !1, I = !1, Y = void 0, AA(Error(`LSP server ${A} crashed with exit code ${U}`))
        }), Q.stdin.on("error", (U) => {
          if (!J) g(`LSP server ${A} stdin error: ${U.message}`)
        });
        let C = new Hn.StreamMessageReader(Q.stdout),
          E = new Hn.StreamMessageWriter(Q.stdin);
        B = Hn.createMessageConnection(C, E), B.onError(([U, q, w]) => {
          if (!J) I = !0, Y = U, AA(Error(`LSP server ${A} connection error: ${U.message}`))
        }), B.onClose(() => {
          if (!J) Z = !1, g(`LSP server ${A} connection closed`)
        }), B.listen(), B.trace(Hn.Trace.Verbose, {
          log: (U) => {
            g(`[LSP PROTOCOL ${A}] ${U}`)
          }
        }).catch((U) => {
          g(`Failed to enable tracing for ${A}: ${U.message}`)
        });
        for (let {
            method: U,
            handler: q
          }
          of W) B.onNotification(U, q), g(`Applied queued notification handler for ${A}.${U}`);
        W.length = 0;
        for (let {
            method: U,
            handler: q
          }
          of X) B.onRequest(U, q), g(`Applied queued request handler for ${A}.${U}`);
        X.length = 0, g(`LSP client started for ${A}`)
      } catch (H) {
        throw AA(Error(`LSP server ${A} failed to start: ${H.message}`)), H
      }
    },
    async initialize(F) {
      if (!B) throw Error("LSP client not started");
      V();
      try {
        let K = await B.sendRequest("initialize", F);
        return G = K.capabilities, await B.sendNotification("initialized", {}), Z = !0, g(`LSP server ${A} initialized`), K
      } catch (K) {
        throw AA(Error(`LSP server ${A} initialize failed: ${K.message}`)), K
      }
    },
    async sendRequest(F, K) {
      if (!B) throw Error("LSP client not started");
      if (V(), !Z) throw Error("LSP server not initialized");
      try {
        return await B.sendRequest(F, K)
      } catch (D) {
        throw AA(Error(`LSP server ${A} request ${F} failed: ${D.message}`)), D
      }
    },
    async sendNotification(F, K) {
      if (!B) throw Error("LSP client not started");
      V();
      try {
        await B.sendNotification(F, K)
      } catch (D) {
        AA(Error(`LSP server ${A} notification ${F} failed: ${D.message}`)), g(`Notification ${F} failed but continuing`)
      }
    },
    onNotification(F, K) {
      if (!B) {
        W.push({
          method: F,
          handler: K
        }), g(`Queued notification handler for ${A}.${F} (connection not ready)`);
        return
      }
      V(), B.onNotification(F, K)
    },
    onRequest(F, K) {
      if (!B) {
        X.push({
          method: F,
          handler: K
        }), g(`Queued request handler for ${A}.${F} (connection not ready)`);
        return
      }
      V(), B.onRequest(F, K)
    },
    async stop() {
      let F;
      J = !0;
      try {
        if (B) await B.sendRequest("shutdown", null), await B.sendNotification("exit", null)
      } catch (K) {
        let D = K;
        AA(Error(`LSP server ${A} stop failed: ${D.message}`)), F = D
      } finally {
        if (B) {
          try {
            B.dispose()
          } catch (K) {
            g(`Connection disposal failed for ${A}: ${K.message}`)
          }
          B = void 0
        }
        if (Q) {
          if (Q.removeAllListeners("error"), Q.removeAllListeners("exit"), Q.stdin) Q.stdin.removeAllListeners("error");
          if (Q.stderr) Q.stderr.removeAllListeners("data");
          try {
            Q.kill()
          } catch (K) {
            g(`Process kill failed for ${A} (may already be dead): ${K.message}`)
          }
          Q = void 0
        }
        if (Z = !1, G = void 0, J = !1, F) I = !0, Y = F;
        g(`LSP client stopped for ${A}`)
      }
      if (F) throw F
    }
  }
}
// @from(Start 11579003, End 11579005)
Hn
// @from(Start 11579011, End 11579065)
B_2 = L(() => {
  g1();
  V0();
  Hn = BA(A_2(), 1)
})
// @from(Start 11579097, End 11583559)
function Z_2(A, Q) {
  if (Q.restartOnCrash !== void 0) throw Error(`LSP server '${A}': restartOnCrash is not yet implemented. Remove this field from the configuration.`);
  if (Q.startupTimeout !== void 0) throw Error(`LSP server '${A}': startupTimeout is not yet implemented. Remove this field from the configuration.`);
  if (Q.shutdownTimeout !== void 0) throw Error(`LSP server '${A}': shutdownTimeout is not yet implemented. Remove this field from the configuration.`);
  let B = Q_2(A),
    G = "stopped",
    Z, I, Y = 0;
  async function J() {
    if (G === "running" || G === "starting") return;
    try {
      G = "starting", g(`Starting LSP server instance: ${A}`), await B.start(Q.command, Q.args || [], {
        env: Q.env,
        cwd: Q.workspaceFolder
      });
      let C = Q.workspaceFolder || W0(),
        E = `file://${C}`,
        U = {
          processId: process.pid,
          workspaceFolders: [{
            uri: E,
            name: G_2.basename(C)
          }],
          rootPath: C,
          rootUri: E,
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
              }
            },
            general: {
              positionEncodings: ["utf-16"]
            }
          }
        };
      await B.initialize(U), G = "running", Z = new Date, g(`LSP server instance started: ${A}`)
    } catch (C) {
      throw G = "error", I = C, AA(C), C
    }
  }
  async function W() {
    if (G === "stopped" || G === "stopping") return;
    try {
      G = "stopping", await B.stop(), G = "stopped", g(`LSP server instance stopped: ${A}`)
    } catch (C) {
      throw G = "error", I = C, AA(C), C
    }
  }
  async function X() {
    try {
      await W()
    } catch (E) {
      let U = Error(`Failed to stop LSP server '${A}' during restart: ${E.message}`);
      throw AA(U), U
    }
    Y++;
    let C = Q.maxRestarts ?? 3;
    if (Y > C) {
      let E = Error(`Max restart attempts (${C}) exceeded for server '${A}'`);
      throw AA(E), E
    }
    try {
      await J()
    } catch (E) {
      let U = Error(`Failed to start LSP server '${A}' during restart (attempt ${Y}/${C}): ${E.message}`);
      throw AA(U), U
    }
  }

  function V() {
    return G === "running" && B.isInitialized
  }
  async function F(C, E) {
    if (!V()) {
      let U = Error(`Cannot send request to LSP server '${A}': server is ${G}${I?`, last error: ${I.message}`:""}`);
      throw AA(U), U
    }
    try {
      return await B.sendRequest(C, E)
    } catch (U) {
      let q = Error(`LSP request '${C}' failed for server '${A}': ${U.message}`);
      throw AA(q), q
    }
  }
  async function K(C, E) {
    if (!V()) {
      let U = Error(`Cannot send notification to LSP server '${A}': server is ${G}`);
      throw AA(U), U
    }
    try {
      await B.sendNotification(C, E)
    } catch (U) {
      let q = Error(`LSP notification '${C}' failed for server '${A}': ${U.message}`);
      throw AA(q), q
    }
  }

  function D(C, E) {
    B.onNotification(C, E)
  }

  function H(C, E) {
    B.onRequest(C, E)
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
      return I
    },
    get restartCount() {
      return Y
    },
    start: J,
    stop: W,
    restart: X,
    isHealthy: V,
    sendRequest: F,
    sendNotification: K,
    onNotification: D,
    onRequest: H
  }
}
// @from(Start 11583564, End 11583614)
I_2 = L(() => {
  B_2();
  g1();
  V0();
  U2()
})
// @from(Start 11583741, End 11583885)
function Ku5(A, Q) {
  let B = C50(A),
    G = C50(A, Q),
    Z = Fu5(B, G);
  if (Z.startsWith("..") || C50(Z) === Z) return null;
  return G
}
// @from(Start 11583886, End 11585139)
async function J_2(A, Q = []) {
  let B = {},
    G = Vu5(A.path, ".lsp.json");
  try {
    let Z = await Y_2(G, "utf-8"),
      I = JSON.parse(Z),
      Y = j.record(j.string(), RIA).safeParse(I);
    if (Y.success) Object.assign(B, Y.data);
    else {
      let J = `LSP config validation failed for .lsp.json in plugin ${A.name}: ${Y.error.message}`;
      AA(Error(J)), Q.push({
        type: "lsp-config-invalid",
        plugin: A.name,
        serverName: ".lsp.json",
        validationError: Y.error.message,
        source: "plugin"
      })
    }
  } catch (Z) {
    if (Z.code !== "ENOENT") {
      let I = Z instanceof Error ? `Failed to read/parse .lsp.json in plugin ${A.name}: ${Z.message}` : `Failed to read/parse .lsp.json file in plugin ${A.name}`;
      AA(Z instanceof Error ? Z : Error(I)), Q.push({
        type: "lsp-config-invalid",
        plugin: A.name,
        serverName: ".lsp.json",
        validationError: Z instanceof Error ? `Failed to parse JSON: ${Z.message}` : "Failed to parse JSON file",
        source: "plugin"
      })
    }
  }
  if (A.manifest.lspServers) {
    let Z = await Du5(A.manifest.lspServers, A.path, A.name, Q);
    if (Z) Object.assign(B, Z)
  }
  return Object.keys(B).length > 0 ? B : void 0
}
// @from(Start 11585140, End 11587247)
async function Du5(A, Q, B, G) {
  let Z = {},
    I = Array.isArray(A) ? A : [A];
  for (let Y of I)
    if (typeof Y === "string") {
      let J = Ku5(Q, Y);
      if (!J) {
        let W = `Security: Path traversal attempt blocked in plugin ${B}: ${Y}`;
        AA(Error(W)), g(W, {
          level: "warn"
        }), G.push({
          type: "lsp-config-invalid",
          plugin: B,
          serverName: Y,
          validationError: "Invalid path: must be relative and within plugin directory",
          source: "plugin"
        });
        continue
      }
      try {
        let W = await Y_2(J, "utf-8"),
          X = JSON.parse(W),
          V = j.record(j.string(), RIA).safeParse(X);
        if (V.success) Object.assign(Z, V.data);
        else {
          let F = `LSP config validation failed for ${Y} in plugin ${B}: ${V.error.message}`;
          AA(Error(F)), G.push({
            type: "lsp-config-invalid",
            plugin: B,
            serverName: Y,
            validationError: V.error.message,
            source: "plugin"
          })
        }
      } catch (W) {
        let X = W instanceof Error ? `Failed to read/parse LSP config from ${Y} in plugin ${B}: ${W.message}` : `Failed to read/parse LSP config file ${Y} in plugin ${B}`;
        AA(W instanceof Error ? W : Error(X)), G.push({
          type: "lsp-config-invalid",
          plugin: B,
          serverName: Y,
          validationError: W instanceof Error ? `Failed to parse JSON: ${W.message}` : "Failed to parse JSON file",
          source: "plugin"
        })
      }
    } else
      for (let [J, W] of Object.entries(Y)) {
        let X = RIA.safeParse(W);
        if (X.success) Z[J] = X.data;
        else {
          let V = `LSP config validation failed for inline server "${J}" in plugin ${B}: ${X.error.message}`;
          AA(Error(V)), G.push({
            type: "lsp-config-invalid",
            plugin: B,
            serverName: J,
            validationError: X.error.message,
            source: "plugin"
          })
        }
      }
  return Object.keys(Z).length > 0 ? Z : void 0
}
// @from(Start 11587249, End 11587445)
function W_2(A, Q) {
  let B = {};
  for (let [G, Z] of Object.entries(A)) {
    let I = `plugin:${Q}:${G}`;
    B[I] = {
      ...Z,
      scope: "dynamic",
      source: Q
    }
  }
  return B
}
// @from(Start 11587450, End 11587500)
X_2 = L(() => {
  aAA();
  Q2();
  V0();
  g1()
})
// @from(Start 11587502, End 11588219)
async function V_2() {
  let A = {};
  try {
    let {
      enabled: Q
    } = await l7();
    for (let B of Q) {
      let G = [],
        Z = await J_2(B, G);
      if (Z && Object.keys(Z).length > 0) {
        let I = W_2(Z, B.name);
        Object.assign(A, I), g(`Loaded ${Object.keys(Z).length} LSP server(s) from plugin: ${B.name}`)
      }
      if (G.length > 0) g(`${G.length} error(s) loading LSP servers from plugin: ${B.name}`)
    }
    g(`Total LSP servers loaded: ${Object.keys(A).length}`)
  } catch (Q) {
    AA(Q instanceof Error ? Q : Error(`Failed to load LSP servers: ${String(Q)}`)), g(`Error loading LSP servers: ${Q instanceof Error?Q.message:String(Q)}`)
  }
  return {
    servers: A
  }
}
// @from(Start 11588224, End 11588274)
F_2 = L(() => {
  fV();
  X_2();
  V0();
  g1()
})
// @from(Start 11588305, End 11593122)
function K_2() {
  let A = new Map,
    Q = new Map,
    B = new Map;
  async function G() {
    g("[LSP SERVER MANAGER] initialize() called");
    let D;
    try {
      g("[LSP SERVER MANAGER] Calling getAllLspServers()"), D = (await V_2()).servers, g(`[LSP SERVER MANAGER] getAllLspServers returned ${Object.keys(D).length} server(s)`)
    } catch (H) {
      throw AA(Error(`Failed to load LSP server configuration: ${H.message}`)), H
    }
    for (let [H, C] of Object.entries(D)) try {
      if (!C.command) throw Error(`Server ${H} missing required 'command' field`);
      if (!C.extensionToLanguage || Object.keys(C.extensionToLanguage).length === 0) throw Error(`Server ${H} missing required 'extensionToLanguage' field`);
      let E = Object.keys(C.extensionToLanguage);
      for (let q of E) {
        let w = q.toLowerCase();
        if (!Q.has(w)) Q.set(w, []);
        let N = Q.get(w);
        if (N) N.push(H)
      }
      let U = Z_2(H, C);
      A.set(H, U), U.onRequest("workspace/configuration", (q) => {
        return g(`LSP: Received workspace/configuration request from ${H}`), q.items.map(() => null)
      }), U.start().catch((q) => {
        AA(Error(`Failed to start LSP server ${H}: ${q.message}`))
      })
    } catch (E) {
      AA(Error(`Failed to initialize LSP server ${H}: ${E.message}`))
    }
    g(`LSP manager initialized with ${A.size} servers`)
  }
  async function Z() {
    let D = [];
    for (let [H, C] of A.entries())
      if (C.state === "running") try {
        await C.stop()
      } catch (E) {
        let U = E;
        AA(Error(`Failed to stop LSP server ${H}: ${U.message}`)), D.push(U)
      }
    if (A.clear(), Q.clear(), B.clear(), D.length > 0) {
      let H = Error(`Failed to stop ${D.length} LSP server(s): ${D.map((C)=>C.message).join("; ")}`);
      throw AA(H), H
    }
  }

  function I(D) {
    let H = Cn.extname(D).toLowerCase(),
      C = Q.get(H);
    if (!C || C.length === 0) return;
    let E = C[0];
    if (!E) return;
    return A.get(E)
  }
  async function Y(D) {
    let H = I(D);
    if (!H) return;
    if (H.state === "stopped") try {
      await H.start()
    } catch (C) {
      throw AA(Error(`Failed to start LSP server for file ${D}: ${C.message}`)), C
    }
    return H
  }
  async function J(D, H, C) {
    let E = await Y(D);
    if (!E) return;
    try {
      return await E.sendRequest(H, C)
    } catch (U) {
      throw AA(Error(`LSP request failed for file ${D}, method '${H}': ${U.message}`)), U
    }
  }

  function W() {
    return A
  }
  async function X(D, H) {
    let C = await Y(D);
    if (!C) return;
    let E = `file://${Cn.resolve(D)}`;
    if (B.get(E) === C.name) {
      g(`LSP: File already open, skipping didOpen for ${D}`);
      return
    }
    let U = Cn.extname(D).toLowerCase(),
      q = C.config.extensionToLanguage[U] || "plaintext";
    try {
      await C.sendNotification("textDocument/didOpen", {
        textDocument: {
          uri: E,
          languageId: q,
          version: 1,
          text: H
        }
      }), B.set(E, C.name), g(`LSP: Sent didOpen for ${D} (languageId: ${q})`)
    } catch (w) {
      let N = Error(`Failed to sync file open ${D}: ${w.message}`);
      throw AA(N), N
    }
  }
  async function V(D, H) {
    let C = I(D);
    if (!C || C.state !== "running") return X(D, H);
    let E = `file://${Cn.resolve(D)}`;
    if (B.get(E) !== C.name) return X(D, H);
    try {
      await C.sendNotification("textDocument/didChange", {
        textDocument: {
          uri: E,
          version: 1
        },
        contentChanges: [{
          text: H
        }]
      }), g(`LSP: Sent didChange for ${D}`)
    } catch (U) {
      let q = Error(`Failed to sync file change ${D}: ${U.message}`);
      throw AA(q), q
    }
  }
  async function F(D) {
    let H = I(D);
    if (!H || H.state !== "running") return;
    try {
      await H.sendNotification("textDocument/didSave", {
        textDocument: {
          uri: `file://${Cn.resolve(D)}`
        }
      }), g(`LSP: Sent didSave for ${D}`)
    } catch (C) {
      let E = Error(`Failed to sync file save ${D}: ${C.message}`);
      throw AA(E), E
    }
  }
  async function K(D) {
    let H = I(D);
    if (!H || H.state !== "running") return;
    let C = `file://${Cn.resolve(D)}`;
    try {
      await H.sendNotification("textDocument/didClose", {
        textDocument: {
          uri: C
        }
      }), B.delete(C), g(`LSP: Sent didClose for ${D}`)
    } catch (E) {
      let U = Error(`Failed to sync file close ${D}: ${E.message}`);
      throw AA(U), U
    }
  }
  return {
    initialize: G,
    shutdown: Z,
    getServerForFile: I,
    ensureServerStarted: Y,
    sendRequest: J,
    getAllServers: W,
    openFile: X,
    changeFile: V,
    saveFile: F,
    closeFile: K
  }
}
// @from(Start 11593127, End 11593178)
D_2 = L(() => {
  I_2();
  F_2();
  V0();
  g1()
})
// @from(Start 11593227, End 11593435)
function Cu5(A) {
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
// @from(Start 11593437, End 11594189)
function Eu5(A) {
  let Q;
  try {
    Q = A.uri.startsWith("file://") ? Hu5(A.uri) : A.uri
  } catch (G) {
    let Z = G instanceof Error ? G : Error(String(G));
    AA(Z), g(`Failed to convert URI to file path: ${A.uri}. Error: ${Z.message}. Using original URI as fallback.`), Q = A.uri
  }
  let B = A.diagnostics.map((G) => ({
    message: G.message,
    severity: Cu5(G.severity),
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
// @from(Start 11594191, End 11597754)
function H_2(A) {
  let Q = A.getAllServers(),
    B = [],
    G = 0,
    Z = new Map;
  for (let [Y, J] of Q.entries()) try {
    if (!J || typeof J.onNotification !== "function") {
      let W = !J ? "Server instance is null/undefined" : "Server instance has no onNotification method";
      B.push({
        serverName: Y,
        error: W
      });
      let X = Error(`${W} for ${Y}`);
      AA(X), g(`Skipping handler registration for ${Y}: ${W}`);
      continue
    }
    J.onNotification("textDocument/publishDiagnostics", async (W) => {
      g(`[PASSIVE DIAGNOSTICS] Handler invoked for ${Y}! Params type: ${typeof W}`);
      try {
        if (!W || typeof W !== "object" || !("uri" in W) || !("diagnostics" in W)) {
          let K = Error(`LSP server ${Y} sent invalid diagnostic params (missing uri or diagnostics)`);
          AA(K), g(`Invalid diagnostic params from ${Y}: ${JSON.stringify(W)}`);
          return
        }
        let X = W;
        g(`Received diagnostics from ${Y}: ${X.diagnostics.length} diagnostic(s) for ${X.uri}`);
        let V = Eu5(X),
          F = V[0];
        if (!F || V.length === 0 || F.diagnostics.length === 0) {
          g(`Skipping empty diagnostics from ${Y} for ${X.uri}`);
          return
        }
        try {
          wI2({
            serverName: Y,
            files: V
          }), g(`LSP Diagnostics: Registered ${V.length} diagnostic file(s) from ${Y} for async delivery`), Z.delete(Y)
        } catch (K) {
          let D = K instanceof Error ? K : Error(`Failed to register LSP diagnostics: ${String(K)}`);
          AA(D), g(`Error registering LSP diagnostics from ${Y}: URI: ${X.uri}, Diagnostic count: ${F.diagnostics.length}, Error: ${D.message}`);
          let H = Z.get(Y) || {
            count: 0,
            lastError: ""
          };
          if (H.count++, H.lastError = D.message, Z.set(Y, H), H.count >= 3) g(`WARNING: LSP diagnostic handler for ${Y} has failed ${H.count} times consecutively. Last error: ${H.lastError}. This may indicate a problem with the LSP server or diagnostic processing. Check logs for details.`)
        }
      } catch (X) {
        let V = X instanceof Error ? X : Error(`Unexpected error in diagnostic handler: ${String(X)}`);
        AA(V), g(`Unexpected error processing diagnostics from ${Y}: ${V.message}`);
        let F = Z.get(Y) || {
          count: 0,
          lastError: ""
        };
        if (F.count++, F.lastError = V.message, Z.set(Y, F), F.count >= 3) g(`WARNING: LSP diagnostic handler for ${Y} has failed ${F.count} times consecutively. Last error: ${F.lastError}. This may indicate a problem with the LSP server or diagnostic processing. Check logs for details.`)
      }
    }), g(`Registered diagnostics handler for ${Y}`), G++
  } catch (W) {
    let X = W instanceof Error ? W : Error(`Handler registration failed: ${String(W)}`);
    B.push({
      serverName: Y,
      error: X.message
    }), AA(X), g(`Failed to register diagnostics handler for ${Y}: Error: ${X.message}`)
  }
  let I = Q.size;
  if (B.length > 0) {
    let Y = B.map((J) => `${J.serverName} (${J.error})`).join(", ");
    AA(Error(`Failed to register diagnostics for ${B.length} LSP server(s): ${Y}`)), g(`LSP notification handler registration: ${G}/${I} succeeded. Failed servers: ${Y}. Diagnostics from failed servers will not be delivered.`)
  } else g(`LSP notification handlers registered successfully for all ${I} server(s)`);
  return {
    totalServers: I,
    successCount: G,
    registrationErrors: B,
    diagnosticFailures: Z
  }
}
// @from(Start 11597759, End 11597801)
C_2 = L(() => {
  uMA();
  V0();
  g1()
})
// @from(Start 11597804, End 11597866)
function XWA() {
  if (N0A === "failed") return;
  return jP
}
// @from(Start 11597868, End 11598621)
function E_2() {
  if (g("[LSP MANAGER] initializeLspServerManager() called"), jP !== void 0 && N0A !== "failed") {
    g("[LSP MANAGER] Already initialized or initializing, skipping");
    return
  }
  if (N0A === "failed") jP = void 0, E50 = void 0;
  jP = K_2(), N0A = "pending", g("[LSP MANAGER] Created manager instance, state=pending");
  let A = ++F51;
  g(`[LSP MANAGER] Starting async initialization (generation ${A})`), jP.initialize().then(() => {
    if (A === F51) {
      if (N0A = "success", g("LSP server manager initialized successfully"), jP) H_2(jP)
    }
  }).catch((Q) => {
    if (A === F51) N0A = "failed", E50 = Q, jP = void 0, AA(Q), g(`Failed to initialize LSP server manager: ${Q instanceof Error?Q.message:String(Q)}`)
  })
}
// @from(Start 11598622, End 11598944)
async function z_2() {
  if (jP === void 0) return;
  try {
    await jP.shutdown(), g("LSP server manager shut down successfully")
  } catch (A) {
    AA(A), g(`Failed to shutdown LSP server manager: ${A instanceof Error?A.message:String(A)}`)
  } finally {
    jP = void 0, N0A = "not-started", E50 = void 0, F51++
  }
}
// @from(Start 11598949, End 11598951)
jP
// @from(Start 11598953, End 11598972)
N0A = "not-started"
// @from(Start 11598976, End 11598979)
E50
// @from(Start 11598981, End 11598988)
F51 = 0
// @from(Start 11598994, End 11599045)
lRA = L(() => {
  D_2();
  C_2();
  V0();
  g1()
})
// @from(Start 11599051, End 11599054)
U_2
// @from(Start 11599056, End 11599059)
z50
// @from(Start 11599061, End 11599064)
$_2
// @from(Start 11599070, End 11600213)
U50 = L(() => {
  Q2();
  U_2 = j.strictObject({
    file_path: j.string().describe("The absolute path to the file to modify"),
    old_string: j.string().describe("The text to replace"),
    new_string: j.string().describe("The text to replace it with (must be different from old_string)"),
    replace_all: j.boolean().default(!1).optional().describe("Replace all occurences of old_string (default false)")
  }), z50 = j.object({
    oldStart: j.number(),
    oldLines: j.number(),
    newStart: j.number(),
    newLines: j.number(),
    lines: j.array(j.string())
  }), $_2 = j.object({
    filePath: j.string().describe("The file path that was edited"),
    oldString: j.string().describe("The original string that was replaced"),
    newString: j.string().describe("The new string that replaced it"),
    originalFile: j.string().describe("The original file contents before editing"),
    structuredPatch: j.array(z50).describe("Diff patch showing the changes"),
    userModified: j.boolean().describe("Whether the user modified the proposed changes"),
    replaceAll: j.boolean().describe("Whether all occurrences were replaced")
  })
})
// @from(Start 11600215, End 11600724)
async function q_2() {
  if (!await rw()) return null;
  let {
    stdout: Q,
    code: B
  } = await QQ("git", ["diff", "HEAD", "--numstat"], {
    timeout: w_2,
    preserveOutputOnError: !1
  });
  if (B !== 0) return null;
  let G = zu5(Q),
    {
      stdout: Z,
      code: I
    } = await QQ("git", ["diff", "HEAD"], {
      timeout: w_2,
      preserveOutputOnError: !1
    });
  if (I !== 0) return {
    stats: G,
    hunks: new Map
  };
  let Y = Uu5(Z);
  return {
    stats: G,
    hunks: Y
  }
}
// @from(Start 11600726, End 11601126)
function zu5(A) {
  let Q = A.trim().split(`
`).filter(Boolean),
    B = 0,
    G = 0,
    Z = 0;
  for (let I of Q) {
    let Y = I.split("\t");
    if (Y.length < 3) continue;
    Z++;
    let J = Y[0],
      W = Y[1];
    if (J && J !== "-") B += parseInt(J, 10) || 0;
    if (W && W !== "-") G += parseInt(W, 10) || 0
  }
  return {
    filesCount: Z,
    linesAdded: B,
    linesRemoved: G
  }
}
// @from(Start 11601128, End 11602276)
function Uu5(A) {
  let Q = new Map;
  if (!A.trim()) return Q;
  let B = A.split(/^diff --git /m).filter(Boolean);
  for (let G of B) {
    let Z = G.split(`
`),
      I = Z[0]?.match(/^a\/(.+?) b\/(.+)$/);
    if (!I) continue;
    let Y = I[2] ?? I[1] ?? "",
      J = [],
      W = null;
    for (let X = 1; X < Z.length; X++) {
      let V = Z[X] ?? "",
        F = V.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
      if (F) {
        if (W) J.push(W);
        W = {
          oldStart: parseInt(F[1] ?? "0", 10),
          oldLines: parseInt(F[2] ?? "1", 10),
          newStart: parseInt(F[3] ?? "0", 10),
          newLines: parseInt(F[4] ?? "1", 10),
          lines: []
        };
        continue
      }
      if (V.startsWith("index ") || V.startsWith("---") || V.startsWith("+++") || V.startsWith("new file") || V.startsWith("deleted file") || V.startsWith("old mode") || V.startsWith("new mode") || V.startsWith("Binary files")) continue;
      if (W && (V.startsWith("+") || V.startsWith("-") || V.startsWith(" ") || V === "")) W.lines.push(V)
    }
    if (W) J.push(W);
    if (J.length > 0) Q.set(Y, J)
  }
  return Q
}
// @from(Start 11602281, End 11602291)
w_2 = 5000
// @from(Start 11602297, End 11602330)
N_2 = L(() => {
  _8();
  PV()
})
// @from(Start 11602333, End 11602886)
function L_2() {
  let [A, Q] = OQ(), B = nh.useRef(A.gitDiff.version), G = nh.useCallback(async () => {
    return
  }, [Q]);
  nh.useEffect(() => {
    G()
  }, [G]), CI(() => {
    G()
  }, $u5);
  let Z = qp(() => {
    G()
  }, 500);
  return nh.useEffect(() => {
    if (A.gitDiff.version !== B.current) B.current = A.gitDiff.version, Z()
  }, [A.gitDiff.version, Z]), nh.useMemo(() => {
    if (!A.gitDiff.stats) return null;
    return {
      stats: A.gitDiff.stats,
      hunks: A.gitDiff.hunks
    }
  }, [A.gitDiff.stats, A.gitDiff.hunks])
}
// @from(Start 11602888, End 11603015)
function K51(A) {
  A((Q) => ({
    ...Q,
    gitDiff: {
      ...Q.gitDiff,
      version: Q.gitDiff.version + 1
    }
  }))
}
// @from(Start 11603020, End 11603022)
nh
// @from(Start 11603024, End 11603033)
$u5 = 1e4
// @from(Start 11603039, End 11603101)
D51 = L(() => {
  JE();
  z9();
  N_2();
  nh = BA(VA(), 1)
})
// @from(Start 11603104, End 11603406)
function O_2({
  patch: A,
  dim: Q,
  width: B
}) {
  let [G] = qB(), Z = M_2.useMemo(() => Ou5(A.lines, A.oldStart, B, Q, G), [A.lines, A.oldStart, B, Q, G]);
  return z6.createElement(S, {
    flexDirection: "column",
    flexGrow: 1
  }, Z.map((I, Y) => z6.createElement(S, {
    key: Y
  }, I)))
}
// @from(Start 11603408, End 11603821)
function qu5(A) {
  return A.map((Q) => {
    if (Q.startsWith("+")) return {
      code: " " + Q.slice(1),
      i: 0,
      type: "add",
      originalCode: Q.slice(1)
    };
    if (Q.startsWith("-")) return {
      code: " " + Q.slice(1),
      i: 0,
      type: "remove",
      originalCode: Q.slice(1)
    };
    return {
      code: Q,
      i: 0,
      type: "nochange",
      originalCode: Q
    }
  })
}
// @from(Start 11603823, End 11604706)
function Nu5(A) {
  let Q = [],
    B = 0;
  while (B < A.length) {
    let G = A[B];
    if (!G) {
      B++;
      continue
    }
    if (G.type === "remove") {
      let Z = [G],
        I = B + 1;
      while (I < A.length && A[I]?.type === "remove") {
        let J = A[I];
        if (J) Z.push(J);
        I++
      }
      let Y = [];
      while (I < A.length && A[I]?.type === "add") {
        let J = A[I];
        if (J) Y.push(J);
        I++
      }
      if (Z.length > 0 && Y.length > 0) {
        let J = Math.min(Z.length, Y.length);
        for (let W = 0; W < J; W++) {
          let X = Z[W],
            V = Y[W];
          if (X && V) X.wordDiff = !0, V.wordDiff = !0, X.matchedLine = V, V.matchedLine = X
        }
        Q.push(...Z.filter(Boolean)), Q.push(...Y.filter(Boolean)), B = I
      } else Q.push(G), B++
    } else Q.push(G), B++
  }
  return Q
}
// @from(Start 11604708, End 11604775)
function Lu5(A, Q) {
  return GI2(A, Q, {
    ignoreCase: !1
  })
}
// @from(Start 11604777, End 11606464)
function Mu5(A, Q, B, G, Z) {
  let {
    type: I,
    i: Y,
    wordDiff: J,
    matchedLine: W,
    originalCode: X
  } = A;
  if (!J || !W) return null;
  let V = I === "remove" ? X : W.originalCode,
    F = I === "remove" ? W.originalCode : X,
    K = Lu5(V, F),
    D = V.length + F.length;
  if (K.filter((y) => y.added || y.removed).reduce((y, v) => y + v.value.length, 0) / D > wu5 || G) return null;
  let E = I === "add" ? "+" : "-",
    U = "  ",
    q = E.length + U.length,
    w = Q - B - 1 - q,
    N = [],
    R = [],
    T = 0;
  if (K.forEach((y, v) => {
      let x = !1,
        p;
      if (I === "add") {
        if (y.added) x = !0, p = "diffAddedWord";
        else if (!y.removed) x = !0
      } else if (I === "remove") {
        if (y.removed) x = !0, p = "diffRemovedWord";
        else if (!y.added) x = !0
      }
      if (!x) return;
      ob(y.value, w, "wrap").split(`
`).forEach((l, k) => {
        if (!l) return;
        if (k > 0 || T + l.length > w) {
          if (R.length > 0) N.push([...R]), R = [], T = 0
        }
        R.push(z6.createElement($, {
          key: `part-${v}-${k}`,
          backgroundColor: p,
          color: Z ? "text" : void 0,
          dimColor: G
        }, l)), T += l.length
      })
    }), R.length > 0) N.push(R);
  return N.map((y, v) => {
    let x = `${I}-${Y}-${v}`;
    return z6.createElement($, {
      key: x
    }, z6.createElement(H51, {
      i: v === 0 ? Y : void 0,
      width: B
    }), z6.createElement($, {
      backgroundColor: I === "add" ? G ? "diffAddedDimmed" : "diffAdded" : G ? "diffRemovedDimmed" : "diffRemoved"
    }, z6.createElement($, {
      dimColor: G
    }, E, U), y))
  })
}
// @from(Start 11606466, End 11608194)
function Ou5(A, Q, B, G, Z) {
  let I = qu5(A),
    Y = Nu5(I),
    J = Ru5(Y, Q),
    W = Math.max(...J.map(({
      i: V
    }) => V), 0),
    X = Math.max(W.toString().length + 2, 0);
  return J.flatMap((V) => {
    let {
      type: F,
      code: K,
      i: D,
      wordDiff: H,
      matchedLine: C
    } = V;
    if (H && C) {
      let N = Mu5(V, B, X, G, Z);
      if (N !== null) return N
    }
    let E = 2,
      U = B - X - 1 - E;
    return ob(K, U, "wrap").split(`
`).map((N, R) => {
      let T = `${F}-${D}-${R}`;
      switch (F) {
        case "add":
          return z6.createElement($, {
            key: T
          }, z6.createElement(H51, {
            i: R === 0 ? D : void 0,
            width: X
          }), z6.createElement($, {
            color: Z ? "text" : void 0,
            backgroundColor: G ? "diffAddedDimmed" : "diffAdded",
            dimColor: G
          }, z6.createElement($, {
            dimColor: G
          }, "+ "), N));
        case "remove":
          return z6.createElement($, {
            key: T
          }, z6.createElement(H51, {
            i: R === 0 ? D : void 0,
            width: X
          }), z6.createElement($, {
            color: Z ? "text" : void 0,
            backgroundColor: G ? "diffRemovedDimmed" : "diffRemoved",
            dimColor: G
          }, z6.createElement($, {
            dimColor: G
          }, "- "), N));
        case "nochange":
          return z6.createElement($, {
            key: T
          }, z6.createElement(H51, {
            i: R === 0 ? D : void 0,
            width: X
          }), z6.createElement($, {
            color: Z ? "text" : void 0,
            dimColor: G
          }, "  ", N))
      }
    })
  })
}
// @from(Start 11608196, End 11608386)
function H51({
  i: A,
  width: Q,
  hidden: B
}) {
  if (B) return null;
  return z6.createElement($, {
    dimColor: !0
  }, A !== void 0 ? A.toString().padStart(Q) : " ".repeat(Q), " ")
}
// @from(Start 11608388, End 11609490)
function Ru5(A, Q) {
  let B = Q,
    G = [],
    Z = [...A];
  while (Z.length > 0) {
    let I = Z.shift(),
      {
        code: Y,
        type: J,
        originalCode: W,
        wordDiff: X,
        matchedLine: V
      } = I,
      F = {
        code: Y,
        type: J,
        i: B,
        originalCode: W,
        wordDiff: X,
        matchedLine: V
      };
    switch (J) {
      case "nochange":
        B++, G.push(F);
        break;
      case "add":
        B++, G.push(F);
        break;
      case "remove": {
        G.push(F);
        let K = 0;
        while (Z[0]?.type === "remove") {
          B++;
          let D = Z.shift(),
            {
              code: H,
              type: C,
              originalCode: E,
              wordDiff: U,
              matchedLine: q
            } = D,
            w = {
              code: H,
              type: C,
              i: B,
              originalCode: E,
              wordDiff: U,
              matchedLine: q
            };
          G.push(w), K++
        }
        B -= K;
        break
      }
    }
  }
  return G
}
// @from(Start 11609495, End 11609497)
z6
// @from(Start 11609499, End 11609502)
M_2
// @from(Start 11609504, End 11609513)
wu5 = 0.4
// @from(Start 11609519, End 11609592)
R_2 = L(() => {
  hA();
  vMA();
  z6 = BA(VA(), 1), M_2 = BA(VA(), 1)
})
// @from(Start 11609598, End 11609606)
$50 = {}
// @from(Start 11609671, End 11609674)
C51
// @from(Start 11609676, End 11609679)
Tu5
// @from(Start 11609681, End 11609684)
Pu5
// @from(Start 11609690, End 11609899)
w50 = L(() => {
  try {
    C51 = (() => {
      throw new Error("Cannot require module " + "../../color-diff.node");
    })()
  } catch (A) {
    C51 = null
  }
  Tu5 = C51?.ColorDiff, Pu5 = C51?.ColorDiff
})
// @from(Start 11609901, End 11610393)
async function P_2() {
  if (!T_2) {
    return T_2 = !0, null;
    if (_j(process.env.CLAUDE_CODE_SYNTAX_HIGHLIGHT)) return null;
    if (d0.terminal === "Apple_Terminal") return null;
    if (UX()) try {
      q50 = (await Promise.resolve().then(() => (w50(), $50))).ColorDiff
    } catch (A) {
      g(`[ColorDiff] Rust module unavailable, falling back to JS: ${A instanceof Error?A.message:String(A)}`)
    } else g("[ColorDiff] Not in bundled mode, using JS fallback")
  }
  return q50
}
// @from(Start 11610395, End 11610426)
function j_2() {
  return q50
}
// @from(Start 11610431, End 11610441)
q50 = null
// @from(Start 11610445, End 11610453)
T_2 = !1
// @from(Start 11610459, End 11610500)
N50 = L(() => {
  V0();
  hQ();
  c5()
})
// @from(Start 11610503, End 11611323)
function J$({
  patch: A,
  dim: Q,
  filePath: B,
  width: G,
  skipHighlighting: Z = !1
}) {
  let I = sh.useRef(null),
    [Y, J] = sh.useState(G || ju5),
    [W] = qB(),
    X = sh.useMemo(() => {
      if (Z) return null;
      let F = j_2();
      if (F === null) return null;
      return new F(A, B)
    }, [Z, A, B]);
  sh.useEffect(() => {
    if (!G && I.current) {
      let {
        width: F
      } = xu1(I.current);
      if (F > 0) J(F - 2)
    }
  }, [G]);
  let V = sh.useMemo(() => {
    if (X === null) return null;
    return X.render(W, Y, Q)
  }, [W, Y, Q]);
  return ah.createElement(S, {
    ref: I
  }, V ? ah.createElement(S, {
    flexDirection: "column"
  }, V.map((F, K) => ah.createElement($, {
    key: K
  }, F))) : ah.createElement(O_2, {
    patch: A,
    dim: Q,
    width: Y
  }))
}
// @from(Start 11611328, End 11611330)
ah
// @from(Start 11611332, End 11611334)
sh
// @from(Start 11611336, End 11611344)
ju5 = 80
// @from(Start 11611350, End 11611430)
En = L(() => {
  hA();
  R_2();
  N50();
  ah = BA(VA(), 1), sh = BA(VA(), 1)
})
// @from(Start 11611493, End 11612974)
function E51({
  filePath: A,
  structuredPatch: Q,
  style: B,
  verbose: G
}) {
  let {
    columns: Z
  } = WB(), I = Q.reduce((F, K) => F + K.lines.filter((D) => D.startsWith("+")).length, 0), Y = Q.reduce((F, K) => F + K.lines.filter((D) => D.startsWith("-")).length, 0), J = b9(A), W = _u5(uQ(), "CLAUDE.md"), X = J === W, V = Z6.createElement($, null, "Updated", " ", Z6.createElement($, {
    bold: !0
  }, G ? A : Su5(W0(), A)), I > 0 || Y > 0 ? " with " : "", I > 0 ? Z6.createElement(Z6.Fragment, null, Z6.createElement($, {
    bold: !0
  }, I), " ", I > 1 ? "additions" : "addition") : null, I > 0 && Y > 0 ? " and " : null, Y > 0 ? Z6.createElement(Z6.Fragment, null, Z6.createElement($, {
    bold: !0
  }, Y), " ", Y > 1 ? "removals" : "removal") : null);
  if (B === "condensed" && !G) return V;
  return Z6.createElement(S0, null, Z6.createElement(S, {
    flexDirection: "column"
  }, Z6.createElement($, null, V), dV(Q.map((F) => Z6.createElement(S, {
    flexDirection: "column",
    key: F.newStart
  }, Z6.createElement(J$, {
    patch: F,
    dim: !1,
    width: Z - 12,
    filePath: A
  }))), (F) => Z6.createElement(S, {
    key: `ellipsis-${F}`
  }, Z6.createElement($, {
    dimColor: !0
  }, "..."))), X && Z6.createElement(S, {
    marginTop: 1
  }, Z6.createElement($, null, Z6.createElement($, {
    bold: !0
  }, "Tip:"), " Use", " ", Z6.createElement($, {
    color: "remember"
  }, "# to memorize"), " shortcut to quickly add to CLAUDE.md"))))
}
// @from(Start 11612979, End 11612981)
Z6
// @from(Start 11612987, End 11613080)
L50 = L(() => {
  hA();
  En();
  U2();
  i8();
  _0();
  yI();
  q8();
  Z6 = BA(VA(), 1)
})
// @from(Start 11613083, End 11613745)
function CO({
  code: A,
  language: Q
}) {
  let B = z51.useMemo(() => {
    let G = qYA(A);
    try {
      if (VWA.supportsLanguage(Q)) return VWA.highlight(G, {
        language: Q
      });
      else return g(`Language not supported while highlighting code, falling back to markdown: ${Q}`), VWA.highlight(G, {
        language: "markdown"
      })
    } catch (Z) {
      if (Z instanceof Error && Z.message.includes("Unknown language")) return g(`Language not supported while highlighting code, falling back to markdown: ${Z}`), VWA.highlight(G, {
        language: "markdown"
      })
    }
  }, [A, Q]);
  return z51.default.createElement($, null, B)
}
// @from(Start 11613750, End 11613753)
VWA
// @from(Start 11613755, End 11613758)
z51
// @from(Start 11613764, End 11613846)
FWA = L(() => {
  hA();
  V0();
  R9();
  VWA = BA(p21(), 1), z51 = BA(VA(), 1)
})
// @from(Start 11613983, End 11614080)
function k_2(A) {
  if (A?.file_path?.startsWith(kU())) return "Updated plan";
  return "Write"
}
// @from(Start 11614082, End 11614160)
function y_2(A) {
  if (!A?.file_path) return null;
  return Q5(A.file_path)
}
// @from(Start 11614162, End 11614322)
function x_2(A, {
  verbose: Q
}) {
  if (!A.file_path) return null;
  if (A.file_path.startsWith(kU())) return "";
  return Q ? A.file_path : Q5(A.file_path)
}
// @from(Start 11614324, End 11615735)
function v_2({
  file_path: A,
  content: Q
}, {
  columns: B,
  style: G,
  verbose: Z
}) {
  try {
    let I = RA(),
      Y = xu5(A) ? A : vu5(W0(), A),
      J = I.existsSync(Y),
      W = J ? CH(Y) : "utf-8",
      X = J ? I.readFileSync(Y, {
        encoding: W
      }) : null,
      V = X ? "update" : "create",
      F = Uq({
        filePath: A,
        fileContents: X ?? "",
        edits: [{
          old_string: X ?? "",
          new_string: Q,
          replace_all: !1
        }]
      }),
      K = h9.createElement(S, {
        flexDirection: "row"
      }, h9.createElement($, {
        color: "error"
      }, "User rejected ", V === "update" ? "update" : "write", " to", " "), h9.createElement($, {
        bold: !0,
        color: "error"
      }, Z ? A : __2(W0(), A)));
    if (G === "condensed" && !Z) return K;
    return h9.createElement(S0, null, h9.createElement(S, {
      flexDirection: "column"
    }, K, dV(F.map((D) => h9.createElement(S, {
      flexDirection: "column",
      key: D.newStart
    }, h9.createElement(J$, {
      patch: D,
      dim: !0,
      width: B - 12,
      filePath: A
    }))), (D) => h9.createElement(S, {
      key: `ellipsis-${D}`
    }, h9.createElement($, {
      dimColor: !0
    }, "...")))))
  } catch (I) {
    return AA(I), h9.createElement(S, {
      flexDirection: "column"
    }, h9.createElement($, null, "  ", "⎿ (No changes)"))
  }
}
// @from(Start 11615737, End 11616007)
function b_2(A, {
  verbose: Q
}) {
  if (!Q && typeof A === "string" && B9(A, "tool_use_error")) return h9.createElement(S0, null, h9.createElement($, {
    color: "error"
  }, "Error writing file"));
  return h9.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 11616009, End 11616041)
function f_2() {
  return null
}
// @from(Start 11616043, End 11617321)
function h_2({
  filePath: A,
  content: Q,
  structuredPatch: B,
  type: G
}, Z, {
  style: I,
  verbose: Y
}) {
  if (!Y && A.startsWith(kU())) {
    let J = Q5(A);
    return h9.createElement(S0, null, h9.createElement($, {
      dimColor: !0
    }, "/plan to preview · ", J))
  }
  switch (G) {
    case "create": {
      let J = Q || "(No content)",
        W = Q.split(ku5).length,
        X = W - S_2,
        V = h9.createElement($, null, "Wrote ", h9.createElement($, {
          bold: !0
        }, W), " lines to", " ", h9.createElement($, {
          bold: !0
        }, Y ? A : __2(W0(), A)));
      if (I === "condensed" && !Y) return V;
      return h9.createElement(S0, null, h9.createElement(S, {
        flexDirection: "column"
      }, V, h9.createElement(S, {
        flexDirection: "column"
      }, h9.createElement(CO, {
        code: Y ? J : J.split(`
`).slice(0, S_2).filter((F) => F.trim() !== "").join(`
`),
        language: yu5(A).slice(1)
      }), !Y && X > 0 && h9.createElement($, {
        dimColor: !0
      }, "… +", X, " ", X === 1 ? "line" : "lines", " ", W > 0 && h9.createElement(Tl, null)))))
    }
    case "update":
      return h9.createElement(E51, {
        filePath: A,
        structuredPatch: B,
        verbose: Y
      })
  }
}
// @from(Start 11617326, End 11617328)
h9
// @from(Start 11617330, End 11617338)
S_2 = 10
// @from(Start 11617344, End 11617504)
g_2 = L(() => {
  hA();
  L50();
  FWA();
  En();
  q8();
  yJ();
  AIA();
  R9();
  R9();
  U2();
  Rh();
  AQ();
  g1();
  cQ();
  NE();
  h9 = BA(VA(), 1)
})
// @from(Start 11617565, End 11617576)
u_2 = 16000
// @from(Start 11617580, End 11617823)
hu5 = "<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with Grep in order to find the line numbers of what you are looking for.</NOTE>"
// @from(Start 11617827, End 11617830)
gu5
// @from(Start 11617832, End 11617835)
uu5
// @from(Start 11617837, End 11617839)
QV
// @from(Start 11617845, End 11623275)
rh = L(() => {
  Q2();
  q0();
  Q01();
  R9();
  YS();
  Rh();
  EJ();
  yI();
  AQ();
  R1A();
  lRA();
  uMA();
  g1();
  V0();
  U50();
  sU();
  D51();
  g_2();
  gu5 = j.strictObject({
    file_path: j.string().describe("The absolute path to the file to write (must be absolute, not relative)"),
    content: j.string().describe("The content to write to the file")
  }), uu5 = j.object({
    type: j.enum(["create", "update"]).describe("Whether a new file was created or an existing file was updated"),
    filePath: j.string().describe("The path to the file that was written"),
    content: j.string().describe("The content that was written to the file"),
    structuredPatch: j.array(z50).describe("Diff patch showing the changes"),
    originalFile: j.string().nullable().describe("The original file content before the write (null for new files)")
  }), QV = {
    name: wX,
    strict: !0,
    input_examples: [{
      file_path: "/Users/username/project/src/newFile.ts",
      content: `export function hello() {
  console.log("Hello, World!");
}`
    }],
    async description() {
      return "Write a file to the local filesystem."
    },
    userFacingName: k_2,
    getToolUseSummary: y_2,
    async prompt() {
      return qc0
    },
    isEnabled() {
      return !0
    },
    renderToolUseMessage: x_2,
    inputSchema: gu5,
    outputSchema: uu5,
    isConcurrencySafe() {
      return !1
    },
    isReadOnly() {
      return !1
    },
    getPath(A) {
      return A.file_path
    },
    async checkPermissions(A, Q) {
      let B = await Q.getAppState();
      return L0A(QV, A, B.toolPermissionContext)
    },
    renderToolUseRejectedMessage: v_2,
    renderToolUseErrorMessage: b_2,
    renderToolUseProgressMessage: f_2,
    renderToolResultMessage: h_2,
    async validateInput({
      file_path: A
    }, Q) {
      let B = b9(A),
        G = await Q.getAppState();
      if (jD(B, G.toolPermissionContext, "edit", "deny") !== null) return {
        result: !1,
        message: "File is in a directory that is denied by your permission settings.",
        errorCode: 1
      };
      if (!RA().existsSync(B)) return {
        result: !0
      };
      let Y = Q.readFileState.get(B);
      if (!Y) return {
        result: !1,
        message: "File has not been read yet. Read it first before writing to it.",
        errorCode: 2
      };
      if (Y) {
        if (PD(B) > Y.timestamp) return {
          result: !1,
          message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
          errorCode: 3
        }
      }
      return {
        result: !0
      }
    },
    async call({
      file_path: A,
      content: Q
    }, {
      readFileState: B,
      updateFileHistoryState: G,
      setAppState: Z
    }, I, Y) {
      let J = b9(A),
        W = bu5(J),
        X = RA();
      await Oh.beforeFileEdited(J);
      let V = X.existsSync(J);
      if (V) {
        let E = PD(J),
          U = B.get(J);
        if (!U || E > U.timestamp) throw Error("File has been unexpectedly modified. Read it again before attempting to write it.")
      }
      let F = V ? CH(J) : "utf-8",
        K = V ? X.readFileSync(J, {
          encoding: F
        }) : null;
      if (EG()) await kYA(G, J, Y.uuid);
      let D = V ? M0A(J) : await m_2();
      X.mkdirSync(W), KWA(J, Q, F, D);
      let H = XWA();
      if (H) H91(`file://${J}`), H.changeFile(J, Q).catch((E) => {
        g(`LSP: Failed to notify server of file change for ${J}: ${E.message}`), AA(E)
      }), H.saveFile(J).catch((E) => {
        g(`LSP: Failed to notify server of file save for ${J}: ${E.message}`), AA(E)
      });
      if (B.set(J, {
          content: Q,
          timestamp: PD(J),
          offset: void 0,
          limit: void 0
        }), K51(Z), J.endsWith(`${fu5}CLAUDE.md`)) GA("tengu_write_claudemd", {});
      if (K) {
        let E = Uq({
            filePath: A,
            fileContents: K,
            edits: [{
              old_string: K,
              new_string: Q,
              replace_all: !1
            }]
          }),
          U = {
            type: "update",
            filePath: A,
            content: Q,
            structuredPatch: E,
            originalFile: K
          };
        return fMA(E), Uk({
          operation: "write",
          tool: "FileWriteTool",
          filePath: J,
          type: "update"
        }), {
          data: U
        }
      }
      let C = {
        type: "create",
        filePath: A,
        content: Q,
        structuredPatch: [],
        originalFile: null
      };
      return fMA([], Q), Uk({
        operation: "write",
        tool: "FileWriteTool",
        filePath: J,
        type: "create"
      }), {
        data: C
      }
    },
    mapToolResultToToolResultBlockParam({
      filePath: A,
      content: Q,
      type: B
    }, G) {
      switch (B) {
        case "create":
          return {
            tool_use_id: G, type: "tool_result", content: `File created successfully at: ${A}`
          };
        case "update":
          return {
            tool_use_id: G, type: "tool_result", content: `The file ${A} has been updated. Here's the result of running \`cat -n\` on a snippet of the edited file:
${Sl({content:Q.split(/\r?\n/).length>u_2?Q.split(/\r?\n/).slice(0,u_2).join(`
`)+hu5:Q,startLine:1})}`
          }
      }
    }
  }
})
// @from(Start 11623281, End 11623284)
d_2