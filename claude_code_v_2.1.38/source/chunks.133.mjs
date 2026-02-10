
// @from(Ln 331500, Col 4)
Zm4 = R((jm4) => {
    Object.defineProperty(jm4, "__esModule", {
        value: !0
    });
    jm4.createMessageConnection = jm4.ConnectionOptions = jm4.MessageStrategy = jm4.CancellationStrategy = jm4.CancellationSenderStrategy = jm4.CancellationReceiverStrategy = jm4.RequestCancellationReceiverStrategy = jm4.IdCancellationReceiverStrategy = jm4.ConnectionStrategy = jm4.ConnectionError = jm4.ConnectionErrors = jm4.LogTraceNotification = jm4.SetTraceNotification = jm4.TraceFormat = jm4.TraceValues = jm4.Trace = jm4.NullLogger = jm4.ProgressType = jm4.ProgressToken = void 0;
    var Om4 = Ht(),
        nO = $W1(),
        oK = nEA(),
        _m4 = oEA(),
        gQ1 = OW1(),
        $kA = JP6(),
        dQ1;
    (function(A) {
        A.type = new oK.NotificationType("$/cancelRequest")
    })(dQ1 || (dQ1 = {}));
    var OkA;
    (function(A) {
        function q(K) {
            return typeof K === "string" || typeof K === "number"
        }
        A.is = q
    })(OkA || (jm4.ProgressToken = OkA = {}));
    var UQ1;
    (function(A) {
        A.type = new oK.NotificationType("$/progress")
    })(UQ1 || (UQ1 = {}));
    class Dm4 {
        constructor() {}
    }
    jm4.ProgressType = Dm4;
    var _kA;
    (function(A) {
        function q(K) {
            return nO.func(K)
        }
        A.is = q
    })(_kA || (_kA = {}));
    jm4.NullLogger = Object.freeze({
        error: () => {},
        warn: () => {},
        info: () => {},
        log: () => {}
    });
    var hz;
    (function(A) {
        A[A.Off = 0] = "Off", A[A.Messages = 1] = "Messages", A[A.Compact = 2] = "Compact", A[A.Verbose = 3] = "Verbose"
    })(hz || (jm4.Trace = hz = {}));
    var Jm4;
    (function(A) {
        A.Off = "off", A.Messages = "messages", A.Compact = "compact", A.Verbose = "verbose"
    })(Jm4 || (jm4.TraceValues = Jm4 = {}));
    (function(A) {
        function q(Y) {
            if (!nO.string(Y)) return A.Off;
            switch (Y = Y.toLowerCase(), Y) {
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
        A.fromString = q;

        function K(Y) {
            switch (Y) {
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
        A.toString = K
    })(hz || (jm4.Trace = hz = {}));
    var sv;
    (function(A) {
        A.Text = "text", A.JSON = "json"
    })(sv || (jm4.TraceFormat = sv = {}));
    (function(A) {
        function q(K) {
            if (!nO.string(K)) return A.Text;
            if (K = K.toLowerCase(), K === "json") return A.JSON;
            else return A.Text
        }
        A.fromString = q
    })(sv || (jm4.TraceFormat = sv = {}));
    var JkA;
    (function(A) {
        A.type = new oK.NotificationType("$/setTrace")
    })(JkA || (jm4.SetTraceNotification = JkA = {}));
    var XP6;
    (function(A) {
        A.type = new oK.NotificationType("$/logTrace")
    })(XP6 || (jm4.LogTraceNotification = XP6 = {}));
    var pQ1;
    (function(A) {
        A[A.Closed = 1] = "Closed", A[A.Disposed = 2] = "Disposed", A[A.AlreadyListening = 3] = "AlreadyListening"
    })(pQ1 || (jm4.ConnectionErrors = pQ1 = {}));
    class JW1 extends Error {
        constructor(A, q) {
            super(q);
            this.code = A, Object.setPrototypeOf(this, JW1.prototype)
        }
    }
    jm4.ConnectionError = JW1;
    var XkA;
    (function(A) {
        function q(K) {
            let Y = K;
            return Y && nO.func(Y.cancelUndispatched)
        }
        A.is = q
    })(XkA || (jm4.ConnectionStrategy = XkA = {}));
    var DP6;
    (function(A) {
        function q(K) {
            let Y = K;
            return Y && (Y.kind === void 0 || Y.kind === "id") && nO.func(Y.createCancellationTokenSource) && (Y.dispose === void 0 || nO.func(Y.dispose))
        }
        A.is = q
    })(DP6 || (jm4.IdCancellationReceiverStrategy = DP6 = {}));
    var DkA;
    (function(A) {
        function q(K) {
            let Y = K;
            return Y && Y.kind === "request" && nO.func(Y.createCancellationTokenSource) && (Y.dispose === void 0 || nO.func(Y.dispose))
        }
        A.is = q
    })(DkA || (jm4.RequestCancellationReceiverStrategy = DkA = {}));
    var jP6;
    (function(A) {
        A.Message = Object.freeze({
            createCancellationTokenSource(K) {
                return new $kA.CancellationTokenSource
            }
        });

        function q(K) {
            return DP6.is(K) || DkA.is(K)
        }
        A.is = q
    })(jP6 || (jm4.CancellationReceiverStrategy = jP6 = {}));
    var MP6;
    (function(A) {
        A.Message = Object.freeze({
            sendCancellation(K, Y) {
                return K.sendNotification(dQ1.type, {
                    id: Y
                })
            },
            cleanup(K) {}
        });

        function q(K) {
            let Y = K;
            return Y && nO.func(Y.sendCancellation) && nO.func(Y.cleanup)
        }
        A.is = q
    })(MP6 || (jm4.CancellationSenderStrategy = MP6 = {}));
    var PP6;
    (function(A) {
        A.Message = Object.freeze({
            receiver: jP6.Message,
            sender: MP6.Message
        });

        function q(K) {
            let Y = K;
            return Y && jP6.is(Y.receiver) && MP6.is(Y.sender)
        }
        A.is = q
    })(PP6 || (jm4.CancellationStrategy = PP6 = {}));
    var WP6;
    (function(A) {
        function q(K) {
            let Y = K;
            return Y && nO.func(Y.handleMessage)
        }
        A.is = q
    })(WP6 || (jm4.MessageStrategy = WP6 = {}));
    var Xm4;
    (function(A) {
        function q(K) {
            let Y = K;
            return Y && (PP6.is(Y.cancellationStrategy) || XkA.is(Y.connectionStrategy) || WP6.is(Y.messageStrategy))
        }
        A.is = q
    })(Xm4 || (jm4.ConnectionOptions = Xm4 = {}));
    var DI;
    (function(A) {
        A[A.New = 1] = "New", A[A.Listening = 2] = "Listening", A[A.Closed = 3] = "Closed", A[A.Disposed = 4] = "Disposed"
    })(DI || (DI = {}));

    function ZTY(A, q, K, Y) {
        let z = K !== void 0 ? K : jm4.NullLogger,
            w = 0,
            H = 0,
            $ = 0,
            O = "2.0",
            _ = void 0,
            J = new Map,
            X = void 0,
            D = new Map,
            j = new Map,
            M, P = new _m4.LinkedMap,
            W = new Map,
            G = new Set,
            f = new Map,
            Z = hz.Off,
            N = sv.Text,
            T, k = DI.New,
            y = new gQ1.Emitter,
            B = new gQ1.Emitter,
            S = new gQ1.Emitter,
            m = new gQ1.Emitter,
            b = new gQ1.Emitter,
            g = Y && Y.cancellationStrategy ? Y.cancellationStrategy : PP6.Message;

        function U(p1) {
            if (p1 === null) throw Error("Can't send requests with id null since the response can't be correlated.");
            return "req-" + p1.toString()
        }

        function x(p1) {
            if (p1 === null) return "res-unknown-" + (++$).toString();
            else return "res-" + p1.toString()
        }

        function p() {
            return "not-" + (++H).toString()
        }

        function l(p1, K6) {
            if (oK.Message.isRequest(K6)) p1.set(U(K6.id), K6);
            else if (oK.Message.isResponse(K6)) p1.set(x(K6.id), K6);
            else p1.set(p(), K6)
        }

        function r(p1) {
            return
        }

        function s() {
            return k === DI.Listening
        }

        function O1() {
            return k === DI.Closed
        }

        function T1() {
            return k === DI.Disposed
        }

        function N1() {
            if (k === DI.New || k === DI.Listening) k = DI.Closed, B.fire(void 0)
        }

        function j1(p1) {
            y.fire([p1, void 0, void 0])
        }

        function q1(p1) {
            y.fire(p1)
        }
        A.onClose(N1), A.onError(j1), q.onClose(N1), q.onError(q1);

        function t() {
            if (M || P.size === 0) return;
            M = (0, Om4.default)().timer.setImmediate(() => {
                M = void 0, D1()
            })
        }

        function J1(p1) {
            if (oK.Message.isRequest(p1)) E1(p1);
            else if (oK.Message.isNotification(p1)) A1(p1);
            else if (oK.Message.isResponse(p1)) a(p1);
            else M1(p1)
        }

        function D1() {
            if (P.size === 0) return;
            let p1 = P.shift();
            try {
                let K6 = Y?.messageStrategy;
                if (WP6.is(K6)) K6.handleMessage(p1, J1);
                else J1(p1)
            } finally {
                t()
            }
        }
        let Z1 = (p1) => {
            try {
                if (oK.Message.isNotification(p1) && p1.method === dQ1.type.method) {
                    let K6 = p1.params.id,
                        j6 = U(K6),
                        M6 = P.get(j6);
                    if (oK.Message.isRequest(M6)) {
                        let F6 = Y?.connectionStrategy,
                            P1 = F6 && F6.cancelUndispatched ? F6.cancelUndispatched(M6, r) : r(M6);
                        if (P1 && (P1.error !== void 0 || P1.result !== void 0)) {
                            P.delete(j6), f.delete(K6), P1.id = M6.id, $1(P1, p1.method, Date.now()), q.write(P1).catch(() => z.error("Sending response for canceled message failed."));
                            return
                        }
                    }
                    let N6 = f.get(K6);
                    if (N6 !== void 0) {
                        N6.cancel(), L1(p1);
                        return
                    } else G.add(K6)
                }
                l(P, p1)
            } finally {
                t()
            }
        };

        function E1(p1) {
            if (T1()) return;

            function K6(o1, _6, z6) {
                let w6 = {
                    jsonrpc: O,
                    id: p1.id
                };
                if (o1 instanceof oK.ResponseError) w6.error = o1.toJson();
                else w6.result = o1 === void 0 ? null : o1;
                $1(w6, _6, z6), q.write(w6).catch(() => z.error("Sending response failed."))
            }

            function j6(o1, _6, z6) {
                let w6 = {
                    jsonrpc: O,
                    id: p1.id,
                    error: o1.toJson()
                };
                $1(w6, _6, z6), q.write(w6).catch(() => z.error("Sending response failed."))
            }

            function M6(o1, _6, z6) {
                if (o1 === void 0) o1 = null;
                let w6 = {
                    jsonrpc: O,
                    id: p1.id,
                    result: o1
                };
                $1(w6, _6, z6), q.write(w6).catch(() => z.error("Sending response failed."))
            }
            G1(p1);
            let N6 = J.get(p1.method),
                F6, P1;
            if (N6) F6 = N6.type, P1 = N6.handler;
            let k1 = Date.now();
            if (P1 || _) {
                let o1 = p1.id ?? String(Date.now()),
                    _6 = DP6.is(g.receiver) ? g.receiver.createCancellationTokenSource(o1) : g.receiver.createCancellationTokenSource(p1);
                if (p1.id !== null && G.has(p1.id)) _6.cancel();
                if (p1.id !== null) f.set(o1, _6);
                try {
                    let z6;
                    if (P1)
                        if (p1.params === void 0) {
                            if (F6 !== void 0 && F6.numberOfParams !== 0) {
                                j6(new oK.ResponseError(oK.ErrorCodes.InvalidParams, `Request ${p1.method} defines ${F6.numberOfParams} params but received none.`), p1.method, k1);
                                return
                            }
                            z6 = P1(_6.token)
                        } else if (Array.isArray(p1.params)) {
                        if (F6 !== void 0 && F6.parameterStructures === oK.ParameterStructures.byName) {
                            j6(new oK.ResponseError(oK.ErrorCodes.InvalidParams, `Request ${p1.method} defines parameters by name but received parameters by position`), p1.method, k1);
                            return
                        }
                        z6 = P1(...p1.params, _6.token)
                    } else {
                        if (F6 !== void 0 && F6.parameterStructures === oK.ParameterStructures.byPosition) {
                            j6(new oK.ResponseError(oK.ErrorCodes.InvalidParams, `Request ${p1.method} defines parameters by position but received parameters by name`), p1.method, k1);
                            return
                        }
                        z6 = P1(p1.params, _6.token)
                    } else if (_) z6 = _(p1.method, p1.params, _6.token);
                    let w6 = z6;
                    if (!z6) f.delete(o1), M6(z6, p1.method, k1);
                    else if (w6.then) w6.then((r6) => {
                        f.delete(o1), K6(r6, p1.method, k1)
                    }, (r6) => {
                        if (f.delete(o1), r6 instanceof oK.ResponseError) j6(r6, p1.method, k1);
                        else if (r6 && nO.string(r6.message)) j6(new oK.ResponseError(oK.ErrorCodes.InternalError, `Request ${p1.method} failed with message: ${r6.message}`), p1.method, k1);
                        else j6(new oK.ResponseError(oK.ErrorCodes.InternalError, `Request ${p1.method} failed unexpectedly without providing any details.`), p1.method, k1)
                    });
                    else f.delete(o1), K6(z6, p1.method, k1)
                } catch (z6) {
                    if (f.delete(o1), z6 instanceof oK.ResponseError) K6(z6, p1.method, k1);
                    else if (z6 && nO.string(z6.message)) j6(new oK.ResponseError(oK.ErrorCodes.InternalError, `Request ${p1.method} failed with message: ${z6.message}`), p1.method, k1);
                    else j6(new oK.ResponseError(oK.ErrorCodes.InternalError, `Request ${p1.method} failed unexpectedly without providing any details.`), p1.method, k1)
                }
            } else j6(new oK.ResponseError(oK.ErrorCodes.MethodNotFound, `Unhandled method ${p1.method}`), p1.method, k1)
        }

        function a(p1) {
            if (T1()) return;
            if (p1.id === null)
                if (p1.error) z.error(`Received response message without id: Error is: 
${JSON.stringify(p1.error,void 0,4)}`);
                else z.error("Received response message without id. No further error information provided.");
            else {
                let K6 = p1.id,
                    j6 = W.get(K6);
                if (x1(p1, j6), j6 !== void 0) {
                    W.delete(K6);
                    try {
                        if (p1.error) {
                            let M6 = p1.error;
                            j6.reject(new oK.ResponseError(M6.code, M6.message, M6.data))
                        } else if (p1.result !== void 0) j6.resolve(p1.result);
                        else throw Error("Should never happen.")
                    } catch (M6) {
                        if (M6.message) z.error(`Response handler '${j6.method}' failed with message: ${M6.message}`);
                        else z.error(`Response handler '${j6.method}' failed unexpectedly.`)
                    }
                }
            }
        }

        function A1(p1) {
            if (T1()) return;
            let K6 = void 0,
                j6;
            if (p1.method === dQ1.type.method) {
                let M6 = p1.params.id;
                G.delete(M6), L1(p1);
                return
            } else {
                let M6 = D.get(p1.method);
                if (M6) j6 = M6.handler, K6 = M6.type
            }
            if (j6 || X) try {
                if (L1(p1), j6)
                    if (p1.params === void 0) {
                        if (K6 !== void 0) {
                            if (K6.numberOfParams !== 0 && K6.parameterStructures !== oK.ParameterStructures.byName) z.error(`Notification ${p1.method} defines ${K6.numberOfParams} params but received none.`)
                        }
                        j6()
                    } else if (Array.isArray(p1.params)) {
                    let M6 = p1.params;
                    if (p1.method === UQ1.type.method && M6.length === 2 && OkA.is(M6[0])) j6({
                        token: M6[0],
                        value: M6[1]
                    });
                    else {
                        if (K6 !== void 0) {
                            if (K6.parameterStructures === oK.ParameterStructures.byName) z.error(`Notification ${p1.method} defines parameters by name but received parameters by position`);
                            if (K6.numberOfParams !== p1.params.length) z.error(`Notification ${p1.method} defines ${K6.numberOfParams} params but received ${M6.length} arguments`)
                        }
                        j6(...M6)
                    }
                } else {
                    if (K6 !== void 0 && K6.parameterStructures === oK.ParameterStructures.byPosition) z.error(`Notification ${p1.method} defines parameters by position but received parameters by name`);
                    j6(p1.params)
                } else if (X) X(p1.method, p1.params)
            } catch (M6) {
                if (M6.message) z.error(`Notification handler '${p1.method}' failed with message: ${M6.message}`);
                else z.error(`Notification handler '${p1.method}' failed unexpectedly.`)
            } else S.fire(p1)
        }

        function M1(p1) {
            if (!p1) {
                z.error("Received empty message.");
                return
            }
            z.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(p1,null,4)}`);
            let K6 = p1;
            if (nO.string(K6.id) || nO.number(K6.id)) {
                let j6 = K6.id,
                    M6 = W.get(j6);
                if (M6) M6.reject(Error("The received response has neither a result nor an error property."))
            }
        }

        function z1(p1) {
            if (p1 === void 0 || p1 === null) return;
            switch (Z) {
                case hz.Verbose:
                    return JSON.stringify(p1, null, 4);
                case hz.Compact:
                    return JSON.stringify(p1);
                default:
                    return
            }
        }

        function Y1(p1) {
            if (Z === hz.Off || !T) return;
            if (N === sv.Text) {
                let K6 = void 0;
                if ((Z === hz.Verbose || Z === hz.Compact) && p1.params) K6 = `Params: ${z1(p1.params)}

`;
                T.log(`Sending request '${p1.method} - (${p1.id})'.`, K6)
            } else f1("send-request", p1)
        }

        function _1(p1) {
            if (Z === hz.Off || !T) return;
            if (N === sv.Text) {
                let K6 = void 0;
                if (Z === hz.Verbose || Z === hz.Compact)
                    if (p1.params) K6 = `Params: ${z1(p1.params)}

`;
                    else K6 = `No parameters provided.

`;
                T.log(`Sending notification '${p1.method}'.`, K6)
            } else f1("send-notification", p1)
        }

        function $1(p1, K6, j6) {
            if (Z === hz.Off || !T) return;
            if (N === sv.Text) {
                let M6 = void 0;
                if (Z === hz.Verbose || Z === hz.Compact) {
                    if (p1.error && p1.error.data) M6 = `Error data: ${z1(p1.error.data)}

`;
                    else if (p1.result) M6 = `Result: ${z1(p1.result)}

`;
                    else if (p1.error === void 0) M6 = `No result returned.

`
                }
                T.log(`Sending response '${K6} - (${p1.id})'. Processing request took ${Date.now()-j6}ms`, M6)
            } else f1("send-response", p1)
        }

        function G1(p1) {
            if (Z === hz.Off || !T) return;
            if (N === sv.Text) {
                let K6 = void 0;
                if ((Z === hz.Verbose || Z === hz.Compact) && p1.params) K6 = `Params: ${z1(p1.params)}

`;
                T.log(`Received request '${p1.method} - (${p1.id})'.`, K6)
            } else f1("receive-request", p1)
        }

        function L1(p1) {
            if (Z === hz.Off || !T || p1.method === XP6.type.method) return;
            if (N === sv.Text) {
                let K6 = void 0;
                if (Z === hz.Verbose || Z === hz.Compact)
                    if (p1.params) K6 = `Params: ${z1(p1.params)}

`;
                    else K6 = `No parameters provided.

`;
                T.log(`Received notification '${p1.method}'.`, K6)
            } else f1("receive-notification", p1)
        }

        function x1(p1, K6) {
            if (Z === hz.Off || !T) return;
            if (N === sv.Text) {
                let j6 = void 0;
                if (Z === hz.Verbose || Z === hz.Compact) {
                    if (p1.error && p1.error.data) j6 = `Error data: ${z1(p1.error.data)}

`;
                    else if (p1.result) j6 = `Result: ${z1(p1.result)}

`;
                    else if (p1.error === void 0) j6 = `No result returned.

`
                }
                if (K6) {
                    let M6 = p1.error ? ` Request failed: ${p1.error.message} (${p1.error.code}).` : "";
                    T.log(`Received response '${K6.method} - (${p1.id})' in ${Date.now()-K6.timerStart}ms.${M6}`, j6)
                } else T.log(`Received response ${p1.id} without active response promise.`, j6)
            } else f1("receive-response", p1)
        }

        function f1(p1, K6) {
            if (!T || Z === hz.Off) return;
            let j6 = {
                isLSPMessage: !0,
                type: p1,
                message: K6,
                timestamp: Date.now()
            };
            T.log(j6)
        }

        function R1() {
            if (O1()) throw new JW1(pQ1.Closed, "Connection is closed.");
            if (T1()) throw new JW1(pQ1.Disposed, "Connection is disposed.")
        }

        function H1() {
            if (s()) throw new JW1(pQ1.AlreadyListening, "Connection is already listening")
        }

        function y1() {
            if (!s()) throw Error("Call listen() first.")
        }

        function B1(p1) {
            if (p1 === void 0) return null;
            else return p1
        }

        function A6(p1) {
            if (p1 === null) return;
            else return p1
        }

        function O6(p1) {
            return p1 !== void 0 && p1 !== null && !Array.isArray(p1) && typeof p1 === "object"
        }

        function P6(p1, K6) {
            switch (p1) {
                case oK.ParameterStructures.auto:
                    if (O6(K6)) return A6(K6);
                    else return [B1(K6)];
                case oK.ParameterStructures.byName:
                    if (!O6(K6)) throw Error("Received parameters by name but param is not an object literal.");
                    return A6(K6);
                case oK.ParameterStructures.byPosition:
                    return [B1(K6)];
                default:
                    throw Error(`Unknown parameter structure ${p1.toString()}`)
            }
        }

        function V6(p1, K6) {
            let j6, M6 = p1.numberOfParams;
            switch (M6) {
                case 0:
                    j6 = void 0;
                    break;
                case 1:
                    j6 = P6(p1.parameterStructures, K6[0]);
                    break;
                default:
                    j6 = [];
                    for (let N6 = 0; N6 < K6.length && N6 < M6; N6++) j6.push(B1(K6[N6]));
                    if (K6.length < M6)
                        for (let N6 = K6.length; N6 < M6; N6++) j6.push(null);
                    break
            }
            return j6
        }
        let q6 = {
            sendNotification: (p1, ...K6) => {
                R1();
                let j6, M6;
                if (nO.string(p1)) {
                    j6 = p1;
                    let F6 = K6[0],
                        P1 = 0,
                        k1 = oK.ParameterStructures.auto;
                    if (oK.ParameterStructures.is(F6)) P1 = 1, k1 = F6;
                    let o1 = K6.length,
                        _6 = o1 - P1;
                    switch (_6) {
                        case 0:
                            M6 = void 0;
                            break;
                        case 1:
                            M6 = P6(k1, K6[P1]);
                            break;
                        default:
                            if (k1 === oK.ParameterStructures.byName) throw Error(`Received ${_6} parameters for 'by Name' notification parameter structure.`);
                            M6 = K6.slice(P1, o1).map((z6) => B1(z6));
                            break
                    }
                } else {
                    let F6 = K6;
                    j6 = p1.method, M6 = V6(p1, F6)
                }
                let N6 = {
                    jsonrpc: O,
                    method: j6,
                    params: M6
                };
                return _1(N6), q.write(N6).catch((F6) => {
                    throw z.error("Sending notification failed."), F6
                })
            },
            onNotification: (p1, K6) => {
                R1();
                let j6;
                if (nO.func(p1)) X = p1;
                else if (K6)
                    if (nO.string(p1)) j6 = p1, D.set(p1, {
                        type: void 0,
                        handler: K6
                    });
                    else j6 = p1.method, D.set(p1.method, {
                        type: p1,
                        handler: K6
                    });
                return {
                    dispose: () => {
                        if (j6 !== void 0) D.delete(j6);
                        else X = void 0
                    }
                }
            },
            onProgress: (p1, K6, j6) => {
                if (j.has(K6)) throw Error(`Progress handler for token ${K6} already registered`);
                return j.set(K6, j6), {
                    dispose: () => {
                        j.delete(K6)
                    }
                }
            },
            sendProgress: (p1, K6, j6) => {
                return q6.sendNotification(UQ1.type, {
                    token: K6,
                    value: j6
                })
            },
            onUnhandledProgress: m.event,
            sendRequest: (p1, ...K6) => {
                R1(), y1();
                let j6, M6, N6 = void 0;
                if (nO.string(p1)) {
                    j6 = p1;
                    let o1 = K6[0],
                        _6 = K6[K6.length - 1],
                        z6 = 0,
                        w6 = oK.ParameterStructures.auto;
                    if (oK.ParameterStructures.is(o1)) z6 = 1, w6 = o1;
                    let r6 = K6.length;
                    if ($kA.CancellationToken.is(_6)) r6 = r6 - 1, N6 = _6;
                    let G6 = r6 - z6;
                    switch (G6) {
                        case 0:
                            M6 = void 0;
                            break;
                        case 1:
                            M6 = P6(w6, K6[z6]);
                            break;
                        default:
                            if (w6 === oK.ParameterStructures.byName) throw Error(`Received ${G6} parameters for 'by Name' request parameter structure.`);
                            M6 = K6.slice(z6, r6).map((L6) => B1(L6));
                            break
                    }
                } else {
                    let o1 = K6;
                    j6 = p1.method, M6 = V6(p1, o1);
                    let _6 = p1.numberOfParams;
                    N6 = $kA.CancellationToken.is(o1[_6]) ? o1[_6] : void 0
                }
                let F6 = w++,
                    P1;
                if (N6) P1 = N6.onCancellationRequested(() => {
                    let o1 = g.sender.sendCancellation(q6, F6);
                    if (o1 === void 0) return z.log(`Received no promise from cancellation strategy when cancelling id ${F6}`), Promise.resolve();
                    else return o1.catch(() => {
                        z.log(`Sending cancellation messages for id ${F6} failed`)
                    })
                });
                let k1 = {
                    jsonrpc: O,
                    id: F6,
                    method: j6,
                    params: M6
                };
                if (Y1(k1), typeof g.sender.enableCancellation === "function") g.sender.enableCancellation(k1);
                return new Promise(async (o1, _6) => {
                    let z6 = (G6) => {
                            o1(G6), g.sender.cleanup(F6), P1?.dispose()
                        },
                        w6 = (G6) => {
                            _6(G6), g.sender.cleanup(F6), P1?.dispose()
                        },
                        r6 = {
                            method: j6,
                            timerStart: Date.now(),
                            resolve: z6,
                            reject: w6
                        };
                    try {
                        W.set(F6, r6), await q.write(k1)
                    } catch (G6) {
                        throw W.delete(F6), r6.reject(new oK.ResponseError(oK.ErrorCodes.MessageWriteError, G6.message ? G6.message : "Unknown reason")), z.error("Sending request failed."), G6
                    }
                })
            },
            onRequest: (p1, K6) => {
                R1();
                let j6 = null;
                if (_kA.is(p1)) j6 = void 0, _ = p1;
                else if (nO.string(p1)) {
                    if (j6 = null, K6 !== void 0) j6 = p1, J.set(p1, {
                        handler: K6,
                        type: void 0
                    })
                } else if (K6 !== void 0) j6 = p1.method, J.set(p1.method, {
                    type: p1,
                    handler: K6
                });
                return {
                    dispose: () => {
                        if (j6 === null) return;
                        if (j6 !== void 0) J.delete(j6);
                        else _ = void 0
                    }
                }
            },
            hasPendingResponse: () => {
                return W.size > 0
            },
            trace: async (p1, K6, j6) => {
                let M6 = !1,
                    N6 = sv.Text;
                if (j6 !== void 0)
                    if (nO.boolean(j6)) M6 = j6;
                    else M6 = j6.sendNotification || !1, N6 = j6.traceFormat || sv.Text;
                if (Z = p1, N = N6, Z === hz.Off) T = void 0;
                else T = K6;
                if (M6 && !O1() && !T1()) await q6.sendNotification(JkA.type, {
                    value: hz.toString(p1)
                })
            },
            onError: y.event,
            onClose: B.event,
            onUnhandledNotification: S.event,
            onDispose: b.event,
            end: () => {
                q.end()
            },
            dispose: () => {
                if (T1()) return;
                k = DI.Disposed, b.fire(void 0);
                let p1 = new oK.ResponseError(oK.ErrorCodes.PendingResponseRejected, "Pending response rejected since connection got disposed");
                for (let K6 of W.values()) K6.reject(p1);
                if (W = new Map, f = new Map, G = new Set, P = new _m4.LinkedMap, nO.func(q.dispose)) q.dispose();
                if (nO.func(A.dispose)) A.dispose()
            },
            listen: () => {
                R1(), H1(), k = DI.Listening, A.listen(Z1)
            },
            inspect: () => {
                (0, Om4.default)().console.log("inspect")
            }
        };
        return q6.onNotification(XP6.type, (p1) => {
            if (Z === hz.Off || !T) return;
            let K6 = Z === hz.Verbose || Z === hz.Compact;
            T.log(p1.message, K6 ? p1.verbose : void 0)
        }), q6.onNotification(UQ1.type, (p1) => {
            let K6 = j.get(p1.token);
            if (K6) K6(p1.value);
            else m.fire(p1)
        }), q6
    }
    jm4.createMessageConnection = ZTY
})
// @from(Ln 332377, Col 4)
GP6 = R(($q) => {
    Object.defineProperty($q, "__esModule", {
        value: !0
    });
    $q.ProgressType = $q.ProgressToken = $q.createMessageConnection = $q.NullLogger = $q.ConnectionOptions = $q.ConnectionStrategy = $q.AbstractMessageBuffer = $q.WriteableStreamMessageWriter = $q.AbstractMessageWriter = $q.MessageWriter = $q.ReadableStreamMessageReader = $q.AbstractMessageReader = $q.MessageReader = $q.SharedArrayReceiverStrategy = $q.SharedArraySenderStrategy = $q.CancellationToken = $q.CancellationTokenSource = $q.Emitter = $q.Event = $q.Disposable = $q.LRUCache = $q.Touch = $q.LinkedMap = $q.ParameterStructures = $q.NotificationType9 = $q.NotificationType8 = $q.NotificationType7 = $q.NotificationType6 = $q.NotificationType5 = $q.NotificationType4 = $q.NotificationType3 = $q.NotificationType2 = $q.NotificationType1 = $q.NotificationType0 = $q.NotificationType = $q.ErrorCodes = $q.ResponseError = $q.RequestType9 = $q.RequestType8 = $q.RequestType7 = $q.RequestType6 = $q.RequestType5 = $q.RequestType4 = $q.RequestType3 = $q.RequestType2 = $q.RequestType1 = $q.RequestType0 = $q.RequestType = $q.Message = $q.RAL = void 0;
    $q.MessageStrategy = $q.CancellationStrategy = $q.CancellationSenderStrategy = $q.CancellationReceiverStrategy = $q.ConnectionError = $q.ConnectionErrors = $q.LogTraceNotification = $q.SetTraceNotification = $q.TraceFormat = $q.TraceValues = $q.Trace = void 0;
    var EH = nEA();
    Object.defineProperty($q, "Message", {
        enumerable: !0,
        get: function() {
            return EH.Message
        }
    });
    Object.defineProperty($q, "RequestType", {
        enumerable: !0,
        get: function() {
            return EH.RequestType
        }
    });
    Object.defineProperty($q, "RequestType0", {
        enumerable: !0,
        get: function() {
            return EH.RequestType0
        }
    });
    Object.defineProperty($q, "RequestType1", {
        enumerable: !0,
        get: function() {
            return EH.RequestType1
        }
    });
    Object.defineProperty($q, "RequestType2", {
        enumerable: !0,
        get: function() {
            return EH.RequestType2
        }
    });
    Object.defineProperty($q, "RequestType3", {
        enumerable: !0,
        get: function() {
            return EH.RequestType3
        }
    });
    Object.defineProperty($q, "RequestType4", {
        enumerable: !0,
        get: function() {
            return EH.RequestType4
        }
    });
    Object.defineProperty($q, "RequestType5", {
        enumerable: !0,
        get: function() {
            return EH.RequestType5
        }
    });
    Object.defineProperty($q, "RequestType6", {
        enumerable: !0,
        get: function() {
            return EH.RequestType6
        }
    });
    Object.defineProperty($q, "RequestType7", {
        enumerable: !0,
        get: function() {
            return EH.RequestType7
        }
    });
    Object.defineProperty($q, "RequestType8", {
        enumerable: !0,
        get: function() {
            return EH.RequestType8
        }
    });
    Object.defineProperty($q, "RequestType9", {
        enumerable: !0,
        get: function() {
            return EH.RequestType9
        }
    });
    Object.defineProperty($q, "ResponseError", {
        enumerable: !0,
        get: function() {
            return EH.ResponseError
        }
    });
    Object.defineProperty($q, "ErrorCodes", {
        enumerable: !0,
        get: function() {
            return EH.ErrorCodes
        }
    });
    Object.defineProperty($q, "NotificationType", {
        enumerable: !0,
        get: function() {
            return EH.NotificationType
        }
    });
    Object.defineProperty($q, "NotificationType0", {
        enumerable: !0,
        get: function() {
            return EH.NotificationType0
        }
    });
    Object.defineProperty($q, "NotificationType1", {
        enumerable: !0,
        get: function() {
            return EH.NotificationType1
        }
    });
    Object.defineProperty($q, "NotificationType2", {
        enumerable: !0,
        get: function() {
            return EH.NotificationType2
        }
    });
    Object.defineProperty($q, "NotificationType3", {
        enumerable: !0,
        get: function() {
            return EH.NotificationType3
        }
    });
    Object.defineProperty($q, "NotificationType4", {
        enumerable: !0,
        get: function() {
            return EH.NotificationType4
        }
    });
    Object.defineProperty($q, "NotificationType5", {
        enumerable: !0,
        get: function() {
            return EH.NotificationType5
        }
    });
    Object.defineProperty($q, "NotificationType6", {
        enumerable: !0,
        get: function() {
            return EH.NotificationType6
        }
    });
    Object.defineProperty($q, "NotificationType7", {
        enumerable: !0,
        get: function() {
            return EH.NotificationType7
        }
    });
    Object.defineProperty($q, "NotificationType8", {
        enumerable: !0,
        get: function() {
            return EH.NotificationType8
        }
    });
    Object.defineProperty($q, "NotificationType9", {
        enumerable: !0,
        get: function() {
            return EH.NotificationType9
        }
    });
    Object.defineProperty($q, "ParameterStructures", {
        enumerable: !0,
        get: function() {
            return EH.ParameterStructures
        }
    });
    var jkA = oEA();
    Object.defineProperty($q, "LinkedMap", {
        enumerable: !0,
        get: function() {
            return jkA.LinkedMap
        }
    });
    Object.defineProperty($q, "LRUCache", {
        enumerable: !0,
        get: function() {
            return jkA.LRUCache
        }
    });
    Object.defineProperty($q, "Touch", {
        enumerable: !0,
        get: function() {
            return jkA.Touch
        }
    });
    var bTY = LB4();
    Object.defineProperty($q, "Disposable", {
        enumerable: !0,
        get: function() {
            return bTY.Disposable
        }
    });
    var fm4 = OW1();
    Object.defineProperty($q, "Event", {
        enumerable: !0,
        get: function() {
            return fm4.Event
        }
    });
    Object.defineProperty($q, "Emitter", {
        enumerable: !0,
        get: function() {
            return fm4.Emitter
        }
    });
    var Vm4 = JP6();
    Object.defineProperty($q, "CancellationTokenSource", {
        enumerable: !0,
        get: function() {
            return Vm4.CancellationTokenSource
        }
    });
    Object.defineProperty($q, "CancellationToken", {
        enumerable: !0,
        get: function() {
            return Vm4.CancellationToken
        }
    });
    var Nm4 = UB4();
    Object.defineProperty($q, "SharedArraySenderStrategy", {
        enumerable: !0,
        get: function() {
            return Nm4.SharedArraySenderStrategy
        }
    });
    Object.defineProperty($q, "SharedArrayReceiverStrategy", {
        enumerable: !0,
        get: function() {
            return Nm4.SharedArrayReceiverStrategy
        }
    });
    var MkA = oB4();
    Object.defineProperty($q, "MessageReader", {
        enumerable: !0,
        get: function() {
            return MkA.MessageReader
        }
    });
    Object.defineProperty($q, "AbstractMessageReader", {
        enumerable: !0,
        get: function() {
            return MkA.AbstractMessageReader
        }
    });
    Object.defineProperty($q, "ReadableStreamMessageReader", {
        enumerable: !0,
        get: function() {
            return MkA.ReadableStreamMessageReader
        }
    });
    var PkA = Ym4();
    Object.defineProperty($q, "MessageWriter", {
        enumerable: !0,
        get: function() {
            return PkA.MessageWriter
        }
    });
    Object.defineProperty($q, "AbstractMessageWriter", {
        enumerable: !0,
        get: function() {
            return PkA.AbstractMessageWriter
        }
    });
    Object.defineProperty($q, "WriteableStreamMessageWriter", {
        enumerable: !0,
        get: function() {
            return PkA.WriteableStreamMessageWriter
        }
    });
    var uTY = $m4();
    Object.defineProperty($q, "AbstractMessageBuffer", {
        enumerable: !0,
        get: function() {
            return uTY.AbstractMessageBuffer
        }
    });
    var OP = Zm4();
    Object.defineProperty($q, "ConnectionStrategy", {
        enumerable: !0,
        get: function() {
            return OP.ConnectionStrategy
        }
    });
    Object.defineProperty($q, "ConnectionOptions", {
        enumerable: !0,
        get: function() {
            return OP.ConnectionOptions
        }
    });
    Object.defineProperty($q, "NullLogger", {
        enumerable: !0,
        get: function() {
            return OP.NullLogger
        }
    });
    Object.defineProperty($q, "createMessageConnection", {
        enumerable: !0,
        get: function() {
            return OP.createMessageConnection
        }
    });
    Object.defineProperty($q, "ProgressToken", {
        enumerable: !0,
        get: function() {
            return OP.ProgressToken
        }
    });
    Object.defineProperty($q, "ProgressType", {
        enumerable: !0,
        get: function() {
            return OP.ProgressType
        }
    });
    Object.defineProperty($q, "Trace", {
        enumerable: !0,
        get: function() {
            return OP.Trace
        }
    });
    Object.defineProperty($q, "TraceValues", {
        enumerable: !0,
        get: function() {
            return OP.TraceValues
        }
    });
    Object.defineProperty($q, "TraceFormat", {
        enumerable: !0,
        get: function() {
            return OP.TraceFormat
        }
    });
    Object.defineProperty($q, "SetTraceNotification", {
        enumerable: !0,
        get: function() {
            return OP.SetTraceNotification
        }
    });
    Object.defineProperty($q, "LogTraceNotification", {
        enumerable: !0,
        get: function() {
            return OP.LogTraceNotification
        }
    });
    Object.defineProperty($q, "ConnectionErrors", {
        enumerable: !0,
        get: function() {
            return OP.ConnectionErrors
        }
    });
    Object.defineProperty($q, "ConnectionError", {
        enumerable: !0,
        get: function() {
            return OP.ConnectionError
        }
    });
    Object.defineProperty($q, "CancellationReceiverStrategy", {
        enumerable: !0,
        get: function() {
            return OP.CancellationReceiverStrategy
        }
    });
    Object.defineProperty($q, "CancellationSenderStrategy", {
        enumerable: !0,
        get: function() {
            return OP.CancellationSenderStrategy
        }
    });
    Object.defineProperty($q, "CancellationStrategy", {
        enumerable: !0,
        get: function() {
            return OP.CancellationStrategy
        }
    });
    Object.defineProperty($q, "MessageStrategy", {
        enumerable: !0,
        get: function() {
            return OP.MessageStrategy
        }
    });
    var BTY = Ht();
    $q.RAL = BTY.default
})
// @from(Ln 332756, Col 4)
Rm4 = R((Lm4) => {
    Object.defineProperty(Lm4, "__esModule", {
        value: !0
    });
    var Tm4 = h1("util"),
        ud = GP6();
    class ZP6 extends ud.AbstractMessageBuffer {
        constructor(A = "utf-8") {
            super(A)
        }
        emptyBuffer() {
            return ZP6.emptyBuffer
        }
        fromString(A, q) {
            return Buffer.from(A, q)
        }
        toString(A, q) {
            if (A instanceof Buffer) return A.toString(q);
            else return new Tm4.TextDecoder(q).decode(A)
        }
        asNative(A, q) {
            if (q === void 0) return A instanceof Buffer ? A : Buffer.from(A);
            else return A instanceof Buffer ? A.slice(0, q) : Buffer.from(A, 0, q)
        }
        allocNative(A) {
            return Buffer.allocUnsafe(A)
        }
    }
    ZP6.emptyBuffer = Buffer.allocUnsafe(0);
    class vm4 {
        constructor(A) {
            this.stream = A
        }
        onClose(A) {
            return this.stream.on("close", A), ud.Disposable.create(() => this.stream.off("close", A))
        }
        onError(A) {
            return this.stream.on("error", A), ud.Disposable.create(() => this.stream.off("error", A))
        }
        onEnd(A) {
            return this.stream.on("end", A), ud.Disposable.create(() => this.stream.off("end", A))
        }
        onData(A) {
            return this.stream.on("data", A), ud.Disposable.create(() => this.stream.off("data", A))
        }
    }
    class Em4 {
        constructor(A) {
            this.stream = A
        }
        onClose(A) {
            return this.stream.on("close", A), ud.Disposable.create(() => this.stream.off("close", A))
        }
        onError(A) {
            return this.stream.on("error", A), ud.Disposable.create(() => this.stream.off("error", A))
        }
        onEnd(A) {
            return this.stream.on("end", A), ud.Disposable.create(() => this.stream.off("end", A))
        }
        write(A, q) {
            return new Promise((K, Y) => {
                let z = (w) => {
                    if (w === void 0 || w === null) K();
                    else Y(w)
                };
                if (typeof A === "string") this.stream.write(A, q, z);
                else this.stream.write(A, z)
            })
        }
        end() {
            this.stream.end()
        }
    }
    var km4 = Object.freeze({
        messageBuffer: Object.freeze({
            create: (A) => new ZP6(A)
        }),
        applicationJson: Object.freeze({
            encoder: Object.freeze({
                name: "application/json",
                encode: (A, q) => {
                    try {
                        return Promise.resolve(Buffer.from(JSON.stringify(A, void 0, 0), q.charset))
                    } catch (K) {
                        return Promise.reject(K)
                    }
                }
            }),
            decoder: Object.freeze({
                name: "application/json",
                decode: (A, q) => {
                    try {
                        if (A instanceof Buffer) return Promise.resolve(JSON.parse(A.toString(q.charset)));
                        else return Promise.resolve(JSON.parse(new Tm4.TextDecoder(q.charset).decode(A)))
                    } catch (K) {
                        return Promise.reject(K)
                    }
                }
            })
        }),
        stream: Object.freeze({
            asReadableStream: (A) => new vm4(A),
            asWritableStream: (A) => new Em4(A)
        }),
        console,
        timer: Object.freeze({
            setTimeout(A, q, ...K) {
                let Y = setTimeout(A, q, ...K);
                return {
                    dispose: () => clearTimeout(Y)
                }
            },
            setImmediate(A, ...q) {
                let K = setImmediate(A, ...q);
                return {
                    dispose: () => clearImmediate(K)
                }
            },
            setInterval(A, q, ...K) {
                let Y = setInterval(A, q, ...K);
                return {
                    dispose: () => clearInterval(Y)
                }
            }
        })
    });

    function WkA() {
        return km4
    }(function(A) {
        function q() {
            ud.RAL.install(km4)
        }
        A.install = q
    })(WkA || (WkA = {}));
    Lm4.default = WkA
})
// @from(Ln 332893, Col 4)
bm4 = R((GY) => {
    var UTY = GY && GY.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            var z = Object.getOwnPropertyDescriptor(q, K);
            if (!z || ("get" in z ? !q.__esModule : z.writable || z.configurable)) z = {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            };
            Object.defineProperty(A, Y, z)
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        pTY = GY && GY.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) UTY(q, A, K)
        };
    Object.defineProperty(GY, "__esModule", {
        value: !0
    });
    GY.createMessageConnection = GY.createServerSocketTransport = GY.createClientSocketTransport = GY.createServerPipeTransport = GY.createClientPipeTransport = GY.generateRandomPipeName = GY.StreamMessageWriter = GY.StreamMessageReader = GY.SocketMessageWriter = GY.SocketMessageReader = GY.PortMessageWriter = GY.PortMessageReader = GY.IPCMessageWriter = GY.IPCMessageReader = void 0;
    var XW1 = Rm4();
    XW1.default.install();
    var ym4 = h1("path"),
        dTY = h1("os"),
        cTY = h1("crypto"),
        fP6 = h1("net"),
        tv = GP6();
    pTY(GP6(), GY);
    class Sm4 extends tv.AbstractMessageReader {
        constructor(A) {
            super();
            this.process = A;
            let q = this.process;
            q.on("error", (K) => this.fireError(K)), q.on("close", () => this.fireClose())
        }
        listen(A) {
            return this.process.on("message", A), tv.Disposable.create(() => this.process.off("message", A))
        }
    }
    GY.IPCMessageReader = Sm4;
    class hm4 extends tv.AbstractMessageWriter {
        constructor(A) {
            super();
            this.process = A, this.errorCount = 0;
            let q = this.process;
            q.on("error", (K) => this.fireError(K)), q.on("close", () => this.fireClose)
        }
        write(A) {
            try {
                if (typeof this.process.send === "function") this.process.send(A, void 0, void 0, (q) => {
                    if (q) this.errorCount++, this.handleError(q, A);
                    else this.errorCount = 0
                });
                return Promise.resolve()
            } catch (q) {
                return this.handleError(q, A), Promise.reject(q)
            }
        }
        handleError(A, q) {
            this.errorCount++, this.fireError(A, q, this.errorCount)
        }
        end() {}
    }
    GY.IPCMessageWriter = hm4;
    class Im4 extends tv.AbstractMessageReader {
        constructor(A) {
            super();
            this.onData = new tv.Emitter, A.on("close", () => this.fireClose), A.on("error", (q) => this.fireError(q)), A.on("message", (q) => {
                this.onData.fire(q)
            })
        }
        listen(A) {
            return this.onData.event(A)
        }
    }
    GY.PortMessageReader = Im4;
    class xm4 extends tv.AbstractMessageWriter {
        constructor(A) {
            super();
            this.port = A, this.errorCount = 0, A.on("close", () => this.fireClose()), A.on("error", (q) => this.fireError(q))
        }
        write(A) {
            try {
                return this.port.postMessage(A), Promise.resolve()
            } catch (q) {
                return this.handleError(q, A), Promise.reject(q)
            }
        }
        handleError(A, q) {
            this.errorCount++, this.fireError(A, q, this.errorCount)
        }
        end() {}
    }
    GY.PortMessageWriter = xm4;
    class DW1 extends tv.ReadableStreamMessageReader {
        constructor(A, q = "utf-8") {
            super((0, XW1.default)().stream.asReadableStream(A), q)
        }
    }
    GY.SocketMessageReader = DW1;
    class jW1 extends tv.WriteableStreamMessageWriter {
        constructor(A, q) {
            super((0, XW1.default)().stream.asWritableStream(A), q);
            this.socket = A
        }
        dispose() {
            super.dispose(), this.socket.destroy()
        }
    }
    GY.SocketMessageWriter = jW1;
    class GkA extends tv.ReadableStreamMessageReader {
        constructor(A, q) {
            super((0, XW1.default)().stream.asReadableStream(A), q)
        }
    }
    GY.StreamMessageReader = GkA;
    class ZkA extends tv.WriteableStreamMessageWriter {
        constructor(A, q) {
            super((0, XW1.default)().stream.asWritableStream(A), q)
        }
    }
    GY.StreamMessageWriter = ZkA;
    var Cm4 = process.env.XDG_RUNTIME_DIR,
        lTY = new Map([
            ["linux", 107],
            ["darwin", 103]
        ]);

    function iTY() {
        let A = (0, cTY.randomBytes)(21).toString("hex");
        if (process.platform === "win32") return `\\\\.\\pipe\\vscode-jsonrpc-${A}-sock`;
        let q;
        if (Cm4) q = ym4.join(Cm4, `vscode-ipc-${A}.sock`);
        else q = ym4.join(dTY.tmpdir(), `vscode-${A}.sock`);
        let K = lTY.get(process.platform);
        if (K !== void 0 && q.length > K)(0, XW1.default)().console.warn(`WARNING: IPC handle "${q}" is longer than ${K} characters.`);
        return q
    }
    GY.generateRandomPipeName = iTY;

    function nTY(A, q = "utf-8") {
        let K, Y = new Promise((z, w) => {
            K = z
        });
        return new Promise((z, w) => {
            let H = (0, fP6.createServer)(($) => {
                H.close(), K([new DW1($, q), new jW1($, q)])
            });
            H.on("error", w), H.listen(A, () => {
                H.removeListener("error", w), z({
                    onConnected: () => {
                        return Y
                    }
                })
            })
        })
    }
    GY.createClientPipeTransport = nTY;

    function rTY(A, q = "utf-8") {
        let K = (0, fP6.createConnection)(A);
        return [new DW1(K, q), new jW1(K, q)]
    }
    GY.createServerPipeTransport = rTY;

    function oTY(A, q = "utf-8") {
        let K, Y = new Promise((z, w) => {
            K = z
        });
        return new Promise((z, w) => {
            let H = (0, fP6.createServer)(($) => {
                H.close(), K([new DW1($, q), new jW1($, q)])
            });
            H.on("error", w), H.listen(A, "127.0.0.1", () => {
                H.removeListener("error", w), z({
                    onConnected: () => {
                        return Y
                    }
                })
            })
        })
    }
    GY.createClientSocketTransport = oTY;

    function aTY(A, q = "utf-8") {
        let K = (0, fP6.createConnection)(A, "127.0.0.1");
        return [new DW1(K, q), new jW1(K, q)]
    }
    GY.createServerSocketTransport = aTY;

    function sTY(A) {
        let q = A;
        return q.read !== void 0 && q.addListener !== void 0
    }

    function tTY(A) {
        let q = A;
        return q.write !== void 0 && q.addListener !== void 0
    }

    function eTY(A, q, K, Y) {
        if (!K) K = tv.NullLogger;
        let z = sTY(A) ? new GkA(A) : A,
            w = tTY(q) ? new ZkA(q) : q;
        if (tv.ConnectionStrategy.is(Y)) Y = {
            connectionStrategy: Y
        };
        return (0, tv.createMessageConnection)(z, w, K, Y)
    }
    GY.createMessageConnection = eTY
})
// @from(Ln 333111, Col 0)
function um4(A) {
    let q, K, Y, z = !1,
        w = !1,
        H, $ = !1,
        O = [],
        _ = [];

    function J() {
        if (w) throw H || Error(`LSP server ${A} failed to start`)
    }
    return {
        get capabilities() {
            return Y
        },
        get isInitialized() {
            return z
        },
        async start(X, D, j) {
            try {
                if (q = AvY(X, D, {
                        stdio: ["pipe", "pipe", "pipe"],
                        env: j?.env ? {
                            ...globalThis.process.env,
                            ...j.env
                        } : void 0,
                        cwd: j?.cwd,
                        windowsHide: !0
                    }), !q.stdout || !q.stdin) throw Error("LSP server process stdio not available");
                let M = q;
                if (await new Promise((G, f) => {
                        let Z = () => {
                                T(), G()
                            },
                            N = (k) => {
                                T(), f(k)
                            },
                            T = () => {
                                M.removeListener("spawn", Z), M.removeListener("error", N)
                            };
                        M.once("spawn", Z), M.once("error", N)
                    }), q.stderr) q.stderr.on("data", (G) => {
                    let f = G.toString().trim();
                    if (f) h(`[LSP SERVER ${A}] ${f}`)
                });
                q.on("error", (G) => {
                    if (!$) w = !0, H = G, K1(Error(`LSP server ${A} failed to start: ${G.message}`))
                }), q.on("exit", (G, f) => {
                    if (G !== 0 && G !== null && !$) z = !1, w = !1, H = void 0, K1(Error(`LSP server ${A} crashed with exit code ${G}`))
                }), q.stdin.on("error", (G) => {
                    if (!$) h(`LSP server ${A} stdin error: ${G.message}`)
                });
                let P = new $t.StreamMessageReader(q.stdout),
                    W = new $t.StreamMessageWriter(q.stdin);
                K = $t.createMessageConnection(P, W), K.onError(([G, f, Z]) => {
                    if (!$) w = !0, H = G, K1(Error(`LSP server ${A} connection error: ${G.message}`))
                }), K.onClose(() => {
                    if (!$) z = !1, h(`LSP server ${A} connection closed`)
                }), K.listen(), K.trace($t.Trace.Verbose, {
                    log: (G) => {
                        h(`[LSP PROTOCOL ${A}] ${G}`)
                    }
                }).catch((G) => {
                    h(`Failed to enable tracing for ${A}: ${G.message}`)
                });
                for (let {
                        method: G,
                        handler: f
                    }
                    of O) K.onNotification(G, f), h(`Applied queued notification handler for ${A}.${G}`);
                O.length = 0;
                for (let {
                        method: G,
                        handler: f
                    }
                    of _) K.onRequest(G, f), h(`Applied queued request handler for ${A}.${G}`);
                _.length = 0, h(`LSP client started for ${A}`)
            } catch (M) {
                throw K1(Error(`LSP server ${A} failed to start: ${M.message}`)), M
            }
        },
        async initialize(X) {
            if (!K) throw Error("LSP client not started");
            J();
            try {
                let D = await K.sendRequest("initialize", X);
                return Y = D.capabilities, await K.sendNotification("initialized", {}), z = !0, h(`LSP server ${A} initialized`), D
            } catch (D) {
                throw K1(Error(`LSP server ${A} initialize failed: ${D.message}`)), D
            }
        },
        async sendRequest(X, D) {
            if (!K) throw Error("LSP client not started");
            if (J(), !z) throw Error("LSP server not initialized");
            try {
                return await K.sendRequest(X, D)
            } catch (j) {
                throw K1(Error(`LSP server ${A} request ${X} failed: ${j.message}`)), j
            }
        },
        async sendNotification(X, D) {
            if (!K) throw Error("LSP client not started");
            J();
            try {
                await K.sendNotification(X, D)
            } catch (j) {
                K1(Error(`LSP server ${A} notification ${X} failed: ${j.message}`)), h(`Notification ${X} failed but continuing`)
            }
        },
        onNotification(X, D) {
            if (!K) {
                O.push({
                    method: X,
                    handler: D
                }), h(`Queued notification handler for ${A}.${X} (connection not ready)`);
                return
            }
            J(), K.onNotification(X, D)
        },
        onRequest(X, D) {
            if (!K) {
                _.push({
                    method: X,
                    handler: D
                }), h(`Queued request handler for ${A}.${X} (connection not ready)`);
                return
            }
            J(), K.onRequest(X, D)
        },
        async stop() {
            let X;
            $ = !0;
            try {
                if (K) await K.sendRequest("shutdown", {}), await K.sendNotification("exit", {})
            } catch (D) {
                let j = D;
                K1(Error(`LSP server ${A} stop failed: ${j.message}`)), X = j
            } finally {
                if (K) {
                    try {
                        K.dispose()
                    } catch (D) {
                        h(`Connection disposal failed for ${A}: ${D.message}`)
                    }
                    K = void 0
                }
                if (q) {
                    if (q.removeAllListeners("error"), q.removeAllListeners("exit"), q.stdin) q.stdin.removeAllListeners("error");
                    if (q.stderr) q.stderr.removeAllListeners("data");
                    try {
                        q.kill()
                    } catch (D) {
                        h(`Process kill failed for ${A} (may already be dead): ${D.message}`)
                    }
                    q = void 0
                }
                if (z = !1, Y = void 0, $ = !1, X) w = !0, H = X;
                h(`LSP client stopped for ${A}`)
            }
            if (X) throw X
        }
    }
}
// @from(Ln 333273, Col 4)
$t
// @from(Ln 333274, Col 4)
Bm4 = v(() => {
    y6();
    Z6();
    $t = o(bm4(), 1)
})
// @from(Ln 333281, Col 0)
function Fm4(A, q) {
    if (q.restartOnCrash !== void 0) throw Error(`LSP server '${A}': restartOnCrash is not yet implemented. Remove this field from the configuration.`);
    if (q.startupTimeout !== void 0) throw Error(`LSP server '${A}': startupTimeout is not yet implemented. Remove this field from the configuration.`);
    if (q.shutdownTimeout !== void 0) throw Error(`LSP server '${A}': shutdownTimeout is not yet implemented. Remove this field from the configuration.`);
    let K = um4(A),
        Y = "stopped",
        z, w, H = 0;
    async function $() {
        if (Y === "running" || Y === "starting") return;
        try {
            Y = "starting", h(`Starting LSP server instance: ${A}`), await K.start(q.command, q.args || [], {
                env: q.env,
                cwd: q.workspaceFolder
            });
            let P = q.workspaceFolder || h6(),
                W = `file://${P}`,
                G = {
                    processId: process.pid,
                    initializationOptions: q.initializationOptions ?? {},
                    workspaceFolders: [{
                        uri: W,
                        name: mm4.basename(P)
                    }],
                    rootPath: P,
                    rootUri: W,
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
            await K.initialize(G), Y = "running", z = new Date, h(`LSP server instance started: ${A}`)
        } catch (P) {
            throw Y = "error", w = P, K1(P), P
        }
    }
    async function O() {
        if (Y === "stopped" || Y === "stopping") return;
        try {
            Y = "stopping", await K.stop(), Y = "stopped", h(`LSP server instance stopped: ${A}`)
        } catch (P) {
            throw Y = "error", w = P, K1(P), P
        }
    }
    async function _() {
        try {
            await O()
        } catch (W) {
            let G = Error(`Failed to stop LSP server '${A}' during restart: ${W.message}`);
            throw K1(G), G
        }
        H++;
        let P = q.maxRestarts ?? 3;
        if (H > P) {
            let W = Error(`Max restart attempts (${P}) exceeded for server '${A}'`);
            throw K1(W), W
        }
        try {
            await $()
        } catch (W) {
            let G = Error(`Failed to start LSP server '${A}' during restart (attempt ${H}/${P}): ${W.message}`);
            throw K1(G), G
        }
    }

    function J() {
        return Y === "running" && K.isInitialized
    }
    async function X(P, W) {
        if (!J()) {
            let Z = Error(`Cannot send request to LSP server '${A}': server is ${Y}${w?`, last error: ${w.message}`:""}`);
            throw K1(Z), Z
        }
        let G;
        for (let Z = 0; Z <= fkA; Z++) try {
            return await K.sendRequest(P, W)
        } catch (N) {
            G = N;
            let T = N.code;
            if (typeof T === "number" && T === qvY && Z < fkA) {
                let y = KvY * Math.pow(2, Z);
                h(`LSP request '${P}' to '${A}' got ContentModified error, retrying in ${y}ms (attempt ${Z+1}/${fkA})…`), await new Promise((B) => setTimeout(B, y));
                continue
            }
            break
        }
        let f = Error(`LSP request '${P}' failed for server '${A}': ${G?.message??"unknown error"}`);
        throw K1(f), f
    }
    async function D(P, W) {
        if (!J()) {
            let G = Error(`Cannot send notification to LSP server '${A}': server is ${Y}`);
            throw K1(G), G
        }
        try {
            await K.sendNotification(P, W)
        } catch (G) {
            let f = Error(`LSP notification '${P}' failed for server '${A}': ${G.message}`);
            throw K1(f), f
        }
    }

    function j(P, W) {
        K.onNotification(P, W)
    }

    function M(P, W) {
        K.onRequest(P, W)
    }
    return {
        name: A,
        config: q,
        get state() {
            return Y
        },
        get startTime() {
            return z
        },
        get lastError() {
            return w
        },
        get restartCount() {
            return H
        },
        start: $,
        stop: O,
        restart: _,
        isHealthy: J,
        sendRequest: X,
        sendNotification: D,
        onNotification: j,
        onRequest: M
    }
}
// @from(Ln 333454, Col 4)
qvY = -32801
// @from(Ln 333455, Col 4)
fkA = 3
// @from(Ln 333456, Col 4)
KvY = 500
// @from(Ln 333457, Col 4)
Qm4 = v(() => {
    Bm4();
    y6();
    Z6();
    N7()
})
// @from(Ln 333472, Col 0)
function wvY(A, q) {
    let K = VkA(A),
        Y = VkA(A, q),
        z = zvY(K, Y);
    if (z.startsWith("..") || VkA(z) === z) return null;
    return Y
}
// @from(Ln 333479, Col 0)
async function HvY(A, q = []) {
    let K = {},
        Y = YvY(A.path, ".lsp.json");
    try {
        let z = await gm4(Y, "utf-8"),
            w = _A(z),
            H = u.record(u.string(), ew1).safeParse(w);
        if (H.success) Object.assign(K, H.data);
        else {
            let $ = `LSP config validation failed for .lsp.json in plugin ${A.name}: ${H.error.message}`;
            K1(Error($)), q.push({
                type: "lsp-config-invalid",
                plugin: A.name,
                serverName: ".lsp.json",
                validationError: H.error.message,
                source: "plugin"
            })
        }
    } catch (z) {
        if (z.code !== "ENOENT") {
            let w = z instanceof Error ? `Failed to read/parse .lsp.json in plugin ${A.name}: ${z.message}` : `Failed to read/parse .lsp.json file in plugin ${A.name}`;
            K1(z instanceof Error ? z : Error(w)), q.push({
                type: "lsp-config-invalid",
                plugin: A.name,
                serverName: ".lsp.json",
                validationError: z instanceof Error ? `Failed to parse JSON: ${z.message}` : "Failed to parse JSON file",
                source: "plugin"
            })
        }
    }
    if (A.manifest.lspServers) {
        let z = await $vY(A.manifest.lspServers, A.path, A.name, q);
        if (z) Object.assign(K, z)
    }
    return Object.keys(K).length > 0 ? K : void 0
}
// @from(Ln 333515, Col 0)
async function $vY(A, q, K, Y) {
    let z = {},
        w = Array.isArray(A) ? A : [A];
    for (let H of w)
        if (typeof H === "string") {
            let $ = wvY(q, H);
            if (!$) {
                let O = `Security: Path traversal attempt blocked in plugin ${K}: ${H}`;
                K1(Error(O)), h(O, {
                    level: "warn"
                }), Y.push({
                    type: "lsp-config-invalid",
                    plugin: K,
                    serverName: H,
                    validationError: "Invalid path: must be relative and within plugin directory",
                    source: "plugin"
                });
                continue
            }
            try {
                let O = await gm4($, "utf-8"),
                    _ = _A(O),
                    J = u.record(u.string(), ew1).safeParse(_);
                if (J.success) Object.assign(z, J.data);
                else {
                    let X = `LSP config validation failed for ${H} in plugin ${K}: ${J.error.message}`;
                    K1(Error(X)), Y.push({
                        type: "lsp-config-invalid",
                        plugin: K,
                        serverName: H,
                        validationError: J.error.message,
                        source: "plugin"
                    })
                }
            } catch (O) {
                let _ = O instanceof Error ? `Failed to read/parse LSP config from ${H} in plugin ${K}: ${O.message}` : `Failed to read/parse LSP config file ${H} in plugin ${K}`;
                K1(O instanceof Error ? O : Error(_)), Y.push({
                    type: "lsp-config-invalid",
                    plugin: K,
                    serverName: H,
                    validationError: O instanceof Error ? `Failed to parse JSON: ${O.message}` : "Failed to parse JSON file",
                    source: "plugin"
                })
            }
        } else
            for (let [$, O] of Object.entries(H)) {
                let _ = ew1.safeParse(O);
                if (_.success) z[$] = _.data;
                else {
                    let J = `LSP config validation failed for inline server "${$}" in plugin ${K}: ${_.error.message}`;
                    K1(Error(J)), Y.push({
                        type: "lsp-config-invalid",
                        plugin: K,
                        serverName: $,
                        validationError: _.error.message,
                        source: "plugin"
                    })
                }
            }
    return Object.keys(z).length > 0 ? z : void 0
}
// @from(Ln 333577, Col 0)
function OvY(A, q) {
    return A.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, q)
}
// @from(Ln 333581, Col 0)
function _vY(A, q, K) {
    let Y = [],
        z = ($) => {
            let O = OvY($, q),
                {
                    expanded: _,
                    missingVars: J
                } = i01(O);
            return Y.push(...J), _
        },
        w = {
            ...A
        };
    if (w.command) w.command = z(w.command);
    if (w.args) w.args = w.args.map(($) => z($));
    let H = {
        CLAUDE_PLUGIN_ROOT: q,
        ...w.env || {}
    };
    for (let [$, O] of Object.entries(H))
        if ($ !== "CLAUDE_PLUGIN_ROOT") H[$] = z(O);
    if (w.env = H, w.workspaceFolder) w.workspaceFolder = z(w.workspaceFolder);
    if (Y.length > 0) {
        let O = `Missing environment variables in plugin LSP config: ${[...new Set(Y)].join(", ")}`;
        K1(Error(O)), h(O, {
            level: "warn"
        })
    }
    return w
}
// @from(Ln 333612, Col 0)
function JvY(A, q) {
    let K = {};
    for (let [Y, z] of Object.entries(A)) {
        let w = `plugin:${q}:${Y}`;
        K[w] = {
            ...z,
            scope: "dynamic",
            source: q
        }
    }
    return K
}
// @from(Ln 333624, Col 0)
async function Um4(A, q = []) {
    if (!A.enabled) return;
    let K = A.lspServers || await HvY(A, q);
    if (!K) return;
    let Y = {};
    for (let [z, w] of Object.entries(K)) Y[z] = _vY(w, A.path, q);
    return JvY(Y, A.name)
}
// @from(Ln 333632, Col 4)
pm4 = v(() => {
    N0();
    i7();
    Z6();
    y6();
    m6()
})
// @from(Ln 333639, Col 0)
async function dm4() {
    let A = {};
    try {
        let {
            enabled: q
        } = await iY();
        for (let K of q) {
            let Y = [],
                z = await Um4(K, Y);
            if (z && Object.keys(z).length > 0) Object.assign(A, z), h(`Loaded ${Object.keys(z).length} LSP server(s) from plugin: ${K.name}`);
            if (Y.length > 0) h(`${Y.length} error(s) loading LSP servers from plugin: ${K.name}`)
        }
        h(`Total LSP servers loaded: ${Object.keys(A).length}`)
    } catch (q) {
        K1(q instanceof Error ? q : Error(`Failed to load LSP servers: ${String(q)}`)), h(`Error loading LSP servers: ${q instanceof Error?q.message:String(q)}`)
    }
    return {
        servers: A
    }
}
// @from(Ln 333659, Col 4)
cm4 = v(() => {
    VJ();
    pm4();
    Z6();
    y6()
})
// @from(Ln 333667, Col 0)
function lm4() {
    let A = new Map,
        q = new Map,
        K = new Map;
    async function Y() {
        let M;
        try {
            M = (await dm4()).servers, h(`[LSP SERVER MANAGER] getAllLspServers returned ${Object.keys(M).length} server(s)`)
        } catch (P) {
            throw K1(Error(`Failed to load LSP server configuration: ${P.message}`)), P
        }
        for (let [P, W] of Object.entries(M)) try {
            if (!W.command) throw Error(`Server ${P} missing required 'command' field`);
            if (!W.extensionToLanguage || Object.keys(W.extensionToLanguage).length === 0) throw Error(`Server ${P} missing required 'extensionToLanguage' field`);
            let G = Object.keys(W.extensionToLanguage);
            for (let Z of G) {
                let N = Z.toLowerCase();
                if (!q.has(N)) q.set(N, []);
                let T = q.get(N);
                if (T) T.push(P)
            }
            let f = Fm4(P, W);
            A.set(P, f), f.onRequest("workspace/configuration", (Z) => {
                return h(`LSP: Received workspace/configuration request from ${P}`), Z.items.map(() => null)
            }), f.start().catch((Z) => {
                K1(Error(`Failed to start LSP server ${P}: ${Z.message}`))
            })
        } catch (G) {
            K1(Error(`Failed to initialize LSP server ${P}: ${G.message}`))
        }
        h(`LSP manager initialized with ${A.size} servers`)
    }
    async function z() {
        let M = [];
        for (let [P, W] of A.entries())
            if (W.state === "running") try {
                await W.stop()
            } catch (G) {
                let f = G;
                K1(Error(`Failed to stop LSP server ${P}: ${f.message}`)), M.push(f)
            }
        if (A.clear(), q.clear(), K.clear(), M.length > 0) {
            let P = Error(`Failed to stop ${M.length} LSP server(s): ${M.map((W)=>W.message).join("; ")}`);
            throw K1(P), P
        }
    }

    function w(M) {
        let P = Bd.extname(M).toLowerCase(),
            W = q.get(P);
        if (!W || W.length === 0) return;
        let G = W[0];
        if (!G) return;
        return A.get(G)
    }
    async function H(M) {
        let P = w(M);
        if (!P) return;
        if (P.state === "stopped") try {
            await P.start()
        } catch (W) {
            throw K1(Error(`Failed to start LSP server for file ${M}: ${W.message}`)), W
        }
        return P
    }
    async function $(M, P, W) {
        let G = await H(M);
        if (!G) return;
        try {
            return await G.sendRequest(P, W)
        } catch (f) {
            throw K1(Error(`LSP request failed for file ${M}, method '${P}': ${f.message}`)), f
        }
    }

    function O() {
        return A
    }
    async function _(M, P) {
        let W = await H(M);
        if (!W) return;
        let G = `file://${Bd.resolve(M)}`;
        if (K.get(G) === W.name) {
            h(`LSP: File already open, skipping didOpen for ${M}`);
            return
        }
        let f = Bd.extname(M).toLowerCase(),
            Z = W.config.extensionToLanguage[f] || "plaintext";
        try {
            await W.sendNotification("textDocument/didOpen", {
                textDocument: {
                    uri: G,
                    languageId: Z,
                    version: 1,
                    text: P
                }
            }), K.set(G, W.name), h(`LSP: Sent didOpen for ${M} (languageId: ${Z})`)
        } catch (N) {
            let T = Error(`Failed to sync file open ${M}: ${N.message}`);
            throw K1(T), T
        }
    }
    async function J(M, P) {
        let W = w(M);
        if (!W || W.state !== "running") return _(M, P);
        let G = `file://${Bd.resolve(M)}`;
        if (K.get(G) !== W.name) return _(M, P);
        try {
            await W.sendNotification("textDocument/didChange", {
                textDocument: {
                    uri: G,
                    version: 1
                },
                contentChanges: [{
                    text: P
                }]
            }), h(`LSP: Sent didChange for ${M}`)
        } catch (f) {
            let Z = Error(`Failed to sync file change ${M}: ${f.message}`);
            throw K1(Z), Z
        }
    }
    async function X(M) {
        let P = w(M);
        if (!P || P.state !== "running") return;
        try {
            await P.sendNotification("textDocument/didSave", {
                textDocument: {
                    uri: `file://${Bd.resolve(M)}`
                }
            }), h(`LSP: Sent didSave for ${M}`)
        } catch (W) {
            let G = Error(`Failed to sync file save ${M}: ${W.message}`);
            throw K1(G), G
        }
    }
    async function D(M) {
        let P = w(M);
        if (!P || P.state !== "running") return;
        let W = `file://${Bd.resolve(M)}`;
        try {
            await P.sendNotification("textDocument/didClose", {
                textDocument: {
                    uri: W
                }
            }), K.delete(W), h(`LSP: Sent didClose for ${M}`)
        } catch (G) {
            let f = Error(`Failed to sync file close ${M}: ${G.message}`);
            throw K1(f), f
        }
    }

    function j(M) {
        let P = `file://${Bd.resolve(M)}`;
        return K.has(P)
    }
    return {
        initialize: Y,
        shutdown: z,
        getServerForFile: w,
        ensureServerStarted: H,
        sendRequest: $,
        getAllServers: O,
        openFile: _,
        changeFile: J,
        saveFile: X,
        closeFile: D,
        isFileOpen: j
    }
}
// @from(Ln 333837, Col 4)
im4 = v(() => {
    Qm4();
    cm4();
    Z6();
    y6()
})
// @from(Ln 333847, Col 0)
function om4({
    serverName: A,
    files: q
}) {
    let K = XvY();
    h(`LSP Diagnostics: Registering ${q.length} diagnostic file(s) from ${A} (ID: ${K})`), cQ1.set(K, {
        serverName: A,
        files: q,
        timestamp: Date.now(),
        attachmentSent: !1
    })
}
// @from(Ln 333860, Col 0)
function rm4(A) {
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
// @from(Ln 333875, Col 0)
function am4(A) {
    return Q1({
        message: A.message,
        severity: A.severity,
        range: A.range,
        source: A.source || null,
        code: A.code || null
    })
}
// @from(Ln 333885, Col 0)
function jvY(A) {
    let q = new Map,
        K = [];
    for (let Y of A) {
        if (!q.has(Y.uri)) q.set(Y.uri, new Set), K.push({
            uri: Y.uri,
            diagnostics: []
        });
        let z = q.get(Y.uri),
            w = K.find(($) => $.uri === Y.uri),
            H = MW1.get(Y.uri) || new Set;
        for (let $ of Y.diagnostics) try {
            let O = am4($);
            if (z.has(O) || H.has(O)) continue;
            z.add(O), w.diagnostics.push($)
        } catch (O) {
            let _ = O instanceof Error ? O : Error(String(O)),
                J = $.message?.substring(0, 100) || "<no message>";
            K1(Error(`Failed to deduplicate diagnostic in ${Y.uri}: ${_.message}. Diagnostic message: ${J}`)), w.diagnostics.push($)
        }
    }
    return K.filter((Y) => Y.diagnostics.length > 0)
}
// @from(Ln 333909, Col 0)
function sm4() {
    h(`LSP Diagnostics: Checking registry - ${cQ1.size} pending`);
    let A = [],
        q = new Set,
        K = [];
    for (let _ of cQ1.values())
        if (!_.attachmentSent) A.push(..._.files), q.add(_.serverName), K.push(_);
    if (A.length === 0) return [];
    let Y;
    try {
        Y = jvY(A)
    } catch (_) {
        let J = _ instanceof Error ? _ : Error(String(_));
        K1(Error(`Failed to deduplicate LSP diagnostics: ${J.message}`)), Y = A
    }
    for (let _ of K) _.attachmentSent = !0;
    let z = A.reduce((_, J) => _ + J.diagnostics.length, 0),
        w = Y.reduce((_, J) => _ + J.diagnostics.length, 0);
    if (z > w) h(`LSP Diagnostics: Deduplication removed ${z-w} duplicate diagnostic(s)`);
    let H = 0,
        $ = 0;
    for (let _ of Y) {
        if (_.diagnostics.sort((X, D) => rm4(X.severity) - rm4(D.severity)), _.diagnostics.length > VP6) $ += _.diagnostics.length - VP6, _.diagnostics = _.diagnostics.slice(0, VP6);
        let J = nm4 - H;
        if (_.diagnostics.length > J) $ += _.diagnostics.length - J, _.diagnostics = _.diagnostics.slice(0, J);
        H += _.diagnostics.length
    }
    if (Y = Y.filter((_) => _.diagnostics.length > 0), $ > 0) h(`LSP Diagnostics: Volume limiting removed ${$} diagnostic(s) (max ${VP6}/file, ${nm4} total)`);
    for (let _ of Y) {
        if (!MW1.has(_.uri)) MW1.set(_.uri, new Set);
        let J = MW1.get(_.uri);
        for (let X of _.diagnostics) try {
            J.add(am4(X))
        } catch (D) {
            let j = D instanceof Error ? D : Error(String(D)),
                M = X.message?.substring(0, 100) || "<no message>";
            K1(Error(`Failed to track delivered diagnostic in ${_.uri}: ${j.message}. Diagnostic message: ${M}`))
        }
    }
    let O = Y.reduce((_, J) => _ + J.diagnostics.length, 0);
    if (O === 0) return h("LSP Diagnostics: No new diagnostics to deliver (all filtered by deduplication)"), [];
    return h(`LSP Diagnostics: Delivering ${Y.length} file(s) with ${O} diagnostic(s) from ${q.size} server(s)`), [{
        serverName: Array.from(q).join(", "),
        files: Y
    }]
}
// @from(Ln 333956, Col 0)
function tm4() {
    h(`LSP Diagnostics: Clearing ${cQ1.size} pending diagnostic(s)`), cQ1.clear()
}
// @from(Ln 333960, Col 0)
function NP6(A) {
    if (MW1.has(A)) h(`LSP Diagnostics: Clearing delivered diagnostics for ${A}`), MW1.delete(A)
}
// @from(Ln 333963, Col 4)
VP6 = 10
// @from(Ln 333964, Col 4)
nm4 = 30
// @from(Ln 333965, Col 4)
DvY = 500
// @from(Ln 333966, Col 4)
cQ1
// @from(Ln 333966, Col 9)
MW1
// @from(Ln 333967, Col 4)
lQ1 = v(() => {
    Z6();
    y6();
    kw1();
    m6();
    cQ1 = new Map, MW1 = new ZT({
        max: DvY
    })
})
// @from(Ln 333980, Col 0)
function PvY(A) {
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
// @from(Ln 333995, Col 0)
function WvY(A) {
    let q;
    try {
        q = A.uri.startsWith("file://") ? MvY(A.uri) : A.uri
    } catch (Y) {
        let z = Y instanceof Error ? Y : Error(String(Y));
        K1(z), h(`Failed to convert URI to file path: ${A.uri}. Error: ${z.message}. Using original URI as fallback.`), q = A.uri
    }
    let K = A.diagnostics.map((Y) => ({
        message: Y.message,
        severity: PvY(Y.severity),
        range: {
            start: {
                line: Y.range.start.line,
                character: Y.range.start.character
            },
            end: {
                line: Y.range.end.line,
                character: Y.range.end.character
            }
        },
        source: Y.source,
        code: Y.code !== void 0 && Y.code !== null ? String(Y.code) : void 0
    }));
    return [{
        uri: q,
        diagnostics: K
    }]
}
// @from(Ln 334025, Col 0)
function em4(A) {
    let q = A.getAllServers(),
        K = [],
        Y = 0,
        z = new Map;
    for (let [H, $] of q.entries()) try {
        if (!$ || typeof $.onNotification !== "function") {
            let O = !$ ? "Server instance is null/undefined" : "Server instance has no onNotification method";
            K.push({
                serverName: H,
                error: O
            });
            let _ = Error(`${O} for ${H}`);
            K1(_), h(`Skipping handler registration for ${H}: ${O}`);
            continue
        }
        $.onNotification("textDocument/publishDiagnostics", async (O) => {
            h(`[PASSIVE DIAGNOSTICS] Handler invoked for ${H}! Params type: ${typeof O}`);
            try {
                if (!O || typeof O !== "object" || !("uri" in O) || !("diagnostics" in O)) {
                    let D = Error(`LSP server ${H} sent invalid diagnostic params (missing uri or diagnostics)`);
                    K1(D), h(`Invalid diagnostic params from ${H}: ${Q1(O)}`);
                    return
                }
                let _ = O;
                h(`Received diagnostics from ${H}: ${_.diagnostics.length} diagnostic(s) for ${_.uri}`);
                let J = WvY(_),
                    X = J[0];
                if (!X || J.length === 0 || X.diagnostics.length === 0) {
                    h(`Skipping empty diagnostics from ${H} for ${_.uri}`);
                    return
                }
                try {
                    om4({
                        serverName: H,
                        files: J
                    }), h(`LSP Diagnostics: Registered ${J.length} diagnostic file(s) from ${H} for async delivery`), z.delete(H)
                } catch (D) {
                    let j = D instanceof Error ? D : Error(`Failed to register LSP diagnostics: ${String(D)}`);
                    K1(j), h(`Error registering LSP diagnostics from ${H}: URI: ${_.uri}, Diagnostic count: ${X.diagnostics.length}, Error: ${j.message}`);
                    let M = z.get(H) || {
                        count: 0,
                        lastError: ""
                    };
                    if (M.count++, M.lastError = j.message, z.set(H, M), M.count >= 3) h(`WARNING: LSP diagnostic handler for ${H} has failed ${M.count} times consecutively. Last error: ${M.lastError}. This may indicate a problem with the LSP server or diagnostic processing. Check logs for details.`)
                }
            } catch (_) {
                let J = _ instanceof Error ? _ : Error(`Unexpected error in diagnostic handler: ${String(_)}`);
                K1(J), h(`Unexpected error processing diagnostics from ${H}: ${J.message}`);
                let X = z.get(H) || {
                    count: 0,
                    lastError: ""
                };
                if (X.count++, X.lastError = J.message, z.set(H, X), X.count >= 3) h(`WARNING: LSP diagnostic handler for ${H} has failed ${X.count} times consecutively. Last error: ${X.lastError}. This may indicate a problem with the LSP server or diagnostic processing. Check logs for details.`)
            }
        }), h(`Registered diagnostics handler for ${H}`), Y++
    } catch (O) {
        let _ = O instanceof Error ? O : Error(`Handler registration failed: ${String(O)}`);
        K.push({
            serverName: H,
            error: _.message
        }), K1(_), h(`Failed to register diagnostics handler for ${H}: Error: ${_.message}`)
    }
    let w = q.size;
    if (K.length > 0) {
        let H = K.map(($) => `${$.serverName} (${$.error})`).join(", ");
        K1(Error(`Failed to register diagnostics for ${K.length} LSP server(s): ${H}`)), h(`LSP notification handler registration: ${Y}/${w} succeeded. Failed servers: ${H}. Diagnostics from failed servers will not be delivered.`)
    } else h(`LSP notification handlers registered successfully for all ${w} server(s)`);
    return {
        totalServers: w,
        successCount: Y,
        registrationErrors: K,
        diagnosticFailures: z
    }
}
// @from(Ln 334100, Col 4)
AF4 = v(() => {
    m6();
    lQ1();
    Z6();
    y6()
})
// @from(Ln 334107, Col 0)
function md() {
    if (ev === "failed") return;
    return jI
}
// @from(Ln 334112, Col 0)
function W51() {
    if (ev === "failed") return {
        status: "failed",
        error: vP6 || Error("Initialization failed")
    };
    if (ev === "not-started") return {
        status: "not-started"
    };
    if (ev === "pending") return {
        status: "pending"
    };
    return {
        status: "success"
    }
}
// @from(Ln 334127, Col 0)
async function qF4() {
    if (ev === "success" || ev === "failed") return;
    if (ev === "pending" && EP6) await EP6
}
// @from(Ln 334132, Col 0)
function KF4() {
    if (h("[LSP MANAGER] initializeLspServerManager() called"), jI !== void 0 && ev !== "failed") {
        h("[LSP MANAGER] Already initialized or initializing, skipping");
        return
    }
    if (ev === "failed") jI = void 0, vP6 = void 0;
    jI = lm4(), ev = "pending", h("[LSP MANAGER] Created manager instance, state=pending");
    let A = ++TP6;
    h(`[LSP MANAGER] Starting async initialization (generation ${A})`), EP6 = jI.initialize().then(() => {
        if (A === TP6) {
            if (ev = "success", h("LSP server manager initialized successfully"), jI) em4(jI)
        }
    }).catch((q) => {
        if (A === TP6) ev = "failed", vP6 = q, jI = void 0, K1(q), h(`Failed to initialize LSP server manager: ${q instanceof Error?q.message:String(q)}`)
    })
}
// @from(Ln 334148, Col 0)
async function YF4() {
    if (jI === void 0) return;
    try {
        await jI.shutdown(), h("LSP server manager shut down successfully")
    } catch (A) {
        K1(A), h(`Failed to shutdown LSP server manager: ${A instanceof Error?A.message:String(A)}`)
    } finally {
        jI = void 0, ev = "not-started", vP6 = void 0, EP6 = void 0, TP6++
    }
}
// @from(Ln 334158, Col 4)
jI
// @from(Ln 334158, Col 8)
ev = "not-started"
// @from(Ln 334159, Col 4)
vP6
// @from(Ln 334159, Col 9)
TP6 = 0
// @from(Ln 334160, Col 4)
EP6
// @from(Ln 334161, Col 4)
Ot = v(() => {
    im4();
    AF4();
    Z6();
    y6()
})
// @from(Ln 334168, Col 0)
function zF4(A, q, K) {
    if (!NkA(A)) return null;
    if (!MF6(q).isValid) return null;
    let z = K(),
        w = MF6(z);
    if (!w.isValid) return {
        result: !1,
        message: `Claude Code settings.json validation failed after edit:
${w.error}

Full schema:
${w.fullSchema}
IMPORTANT: Do not update the env unless explicitly instructed to do so.`,
        errorCode: 10
    };
    return null
}
// @from(Ln 334185, Col 4)
wF4 = v(() => {
    PF6();
    E2()
})
// @from(Ln 334190, Col 0)
function _t(A, q, K) {
    return
}
// @from(Ln 334194, Col 0)
function $F4(A) {
    let q = A.find((K) => K.name === "claude-vscode");
    if (q && q.type === "connected") {
        HF4 = q, q.client.setNotificationHandler(GvY, async (Y) => {
            let {
                eventName: z,
                eventData: w
            } = Y.params;
            c(`tengu_vscode_${z}`, w)
        });
        let K = {
            tengu_vscode_review_upsell: i2("tengu_vscode_review_upsell"),
            tengu_vscode_onboarding: i2("tengu_vscode_onboarding"),
            tengu_quiet_fern: x8("tengu_quiet_fern", !1),
            tengu_penguins_enabled: x8("tengu_penguins_enabled", !1)
        };
        q.client.notification({
            method: "experiment_gates",
            params: {
                gates: K
            }
        })
    }
}
// @from(Ln 334218, Col 4)
GvY
// @from(Ln 334218, Col 9)
HF4 = null
// @from(Ln 334219, Col 4)
PW1 = v(() => {
    i7();
    u6();
    U4();
    Z6();
    GvY = u.object({
        method: u.literal("log_event"),
        params: u.object({
            eventName: u.string(),
            eventData: u.object({}).passthrough()
        })
    })
})
// @from(Ln 334248, Col 0)
function z2() {
    if (w4()) return NvY();
    return f6().fileCheckpointingEnabled !== !1 && !J6(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING)
}
// @from(Ln 334253, Col 0)
function NvY() {
    return J6(process.env.CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING) && !J6(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING)
}
// @from(Ln 334256, Col 0)
async function Xt(A, q, K) {
    if (!z2()) return;
    A((Y) => {
        try {
            let z = Y.snapshots.at(-1);
            if (!z) return K1(Error("FileHistory: Missing most recent snapshot")), c("tengu_file_history_track_edit_failed", {}), Y;
            let w = MF4(q);
            if (z.trackedFileBackups[w]) return Y;
            let H = Y.trackedFiles.has(w) ? Y.trackedFiles : new Set(Y.trackedFiles).add(w),
                O = !b1().existsSync(q),
                _ = O ? TkA(null, 1) : TkA(q, 1),
                J = X61(z);
            J.trackedFileBackups[w] = _;
            let X = {
                ...Y,
                snapshots: [...Y.snapshots.slice(0, -1), J],
                trackedFiles: H
            };
            return PF4(X), iQ1(K, J, !0).catch((D) => {
                K1(Error(`FileHistory: Failed to record snapshot: ${D}`))
            }), c("tengu_file_history_track_edit_success", {
                isNewFile: O,
                version: _.version
            }), h(`FileHistory: Tracked file modification for ${q}`), X
        } catch (z) {
            return K1(z), c("tengu_file_history_track_edit_failed", {}), Y
        }
    })
}
// @from(Ln 334285, Col 0)
async function WW1(A, q) {
    if (!z2()) return;
    A((K) => {
        try {
            let Y = b1(),
                z = new Date,
                w = {},
                H = K.snapshots.at(-1);
            if (H) {
                h(`FileHistory: Making snapshot for message ${q}`);
                for (let _ of K.trackedFiles) try {
                    let J = EkA(_);
                    if (!Y.existsSync(J)) {
                        let X = H.trackedFileBackups[_],
                            D = X ? X.version + 1 : 1;
                        w[_] = {
                            backupFileName: null,
                            version: D,
                            backupTime: new Date
                        }, c("tengu_file_history_backup_deleted_file", {
                            version: D
                        }), h(`FileHistory: Missing tracked file: ${_}`)
                    } else {
                        let X = H.trackedFileBackups[_];
                        if (X && X.backupFileName !== null && !jF4(J, X.backupFileName)) {
                            w[_] = X;
                            continue
                        }
                        let D = X ? X.version + 1 : 1,
                            j = TkA(J, D);
                        w[_] = j
                    }
                } catch (J) {
                    K1(J), c("tengu_file_history_backup_file_failed", {})
                }
            }
            let $ = {
                    messageId: q,
                    trackedFileBackups: w,
                    timestamp: z
                },
                O = {
                    ...K,
                    snapshots: [...K.snapshots, $]
                };
            return PF4(O), kvY(K, O), iQ1(q, $, !1).catch((_) => {
                K1(Error(`FileHistory: Failed to record snapshot: ${_}`))
            }), h(`FileHistory: Added snapshot for ${q}, tracking ${K.trackedFiles.size} files`), c("tengu_file_history_snapshot_success", {
                trackedFilesCount: K.trackedFiles.size,
                snapshotCount: O.snapshots.length
            }), O
        } catch (Y) {
            return K1(Y), c("tengu_file_history_snapshot_failed", {}), K
        }
    })
}