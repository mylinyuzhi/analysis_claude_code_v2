
// @from(Ln 286519, Col 4)
QW4 = R((mW4) => {
    Object.defineProperty(mW4, "__esModule", {
        value: !0
    });
    mW4.ResolvingLoadBalancer = void 0;
    var C9Y = Es(),
        S9Y = qfA(),
        HN = FZ(),
        bW4 = lh(),
        Sm1 = zd(),
        h9Y = UM1(),
        KfA = w9(),
        I9Y = Jj(),
        x9Y = mw(),
        b9Y = w9(),
        u9Y = mZ(),
        B9Y = FD6(),
        m9Y = "resolving_load_balancer";

    function uW4(A) {
        x9Y.trace(b9Y.LogVerbosity.DEBUG, m9Y, A)
    }
    var F9Y = ["SERVICE_AND_METHOD", "SERVICE", "EMPTY"];

    function Q9Y(A, q, K, Y) {
        for (let z of K.name) switch (Y) {
            case "EMPTY":
                if (!z.service && !z.method) return !0;
                break;
            case "SERVICE":
                if (z.service === A && !z.method) return !0;
                break;
            case "SERVICE_AND_METHOD":
                if (z.service === A && z.method === q) return !0
        }
        return !1
    }

    function g9Y(A, q, K, Y) {
        for (let z of K)
            if (Q9Y(A, q, z, Y)) return z;
        return null
    }

    function U9Y(A) {
        return {
            invoke(q, K) {
                var Y, z;
                let w = q.split("/").filter((O) => O.length > 0),
                    H = (Y = w[0]) !== null && Y !== void 0 ? Y : "",
                    $ = (z = w[1]) !== null && z !== void 0 ? z : "";
                if (A && A.methodConfig)
                    for (let O of F9Y) {
                        let _ = g9Y(H, $, A.methodConfig, O);
                        if (_) return {
                            methodConfig: _,
                            pickInformation: {},
                            status: KfA.Status.OK,
                            dynamicFilterFactories: []
                        }
                    }
                return {
                    methodConfig: {
                        name: []
                    },
                    pickInformation: {},
                    status: KfA.Status.OK,
                    dynamicFilterFactories: []
                }
            },
            unref() {}
        }
    }
    class BW4 {
        constructor(A, q, K, Y, z) {
            if (this.target = A, this.channelControlHelper = q, this.channelOptions = K, this.onSuccessfulResolution = Y, this.onFailedResolution = z, this.latestChildState = HN.ConnectivityState.IDLE, this.latestChildPicker = new Sm1.QueuePicker(this), this.latestChildErrorMessage = null, this.currentState = HN.ConnectivityState.IDLE, this.previousServiceConfig = null, this.continueResolving = !1, K["grpc.service_config"]) this.defaultServiceConfig = (0, S9Y.validateServiceConfig)(JSON.parse(K["grpc.service_config"]));
            else this.defaultServiceConfig = {
                loadBalancingConfig: [],
                methodConfig: []
            };
            this.updateState(HN.ConnectivityState.IDLE, new Sm1.QueuePicker(this), null), this.childLoadBalancer = new B9Y.ChildLoadBalancerHandler({
                createSubchannel: q.createSubchannel.bind(q),
                requestReresolution: () => {
                    if (this.backoffTimeout.isRunning()) uW4("requestReresolution delayed by backoff timer until " + this.backoffTimeout.getEndTime().toISOString()), this.continueResolving = !0;
                    else this.updateResolution()
                },
                updateState: (H, $, O) => {
                    this.latestChildState = H, this.latestChildPicker = $, this.latestChildErrorMessage = O, this.updateState(H, $, O)
                },
                addChannelzChild: q.addChannelzChild.bind(q),
                removeChannelzChild: q.removeChannelzChild.bind(q)
            }), this.innerResolver = (0, bW4.createResolver)(A, this.handleResolverResult.bind(this), K);
            let w = {
                initialDelay: K["grpc.initial_reconnect_backoff_ms"],
                maxDelay: K["grpc.max_reconnect_backoff_ms"]
            };
            this.backoffTimeout = new h9Y.BackoffTimeout(() => {
                if (this.continueResolving) this.updateResolution(), this.continueResolving = !1;
                else this.updateState(this.latestChildState, this.latestChildPicker, this.latestChildErrorMessage)
            }, w), this.backoffTimeout.unref()
        }
        handleResolverResult(A, q, K, Y) {
            var z, w;
            this.backoffTimeout.stop(), this.backoffTimeout.reset();
            let H = !0,
                $ = null;
            if (K === null) $ = this.defaultServiceConfig;
            else if (K.ok) $ = K.value;
            else if (this.previousServiceConfig !== null) $ = this.previousServiceConfig;
            else H = !1, this.handleResolutionFailure(K.error);
            if ($ !== null) {
                let O = (z = $ === null || $ === void 0 ? void 0 : $.loadBalancingConfig) !== null && z !== void 0 ? z : [],
                    _ = (0, C9Y.selectLbConfigFromList)(O, !0);
                if (_ === null) H = !1, this.handleResolutionFailure({
                    code: KfA.Status.UNAVAILABLE,
                    details: "All load balancer options in service config are not compatible",
                    metadata: new I9Y.Metadata
                });
                else H = this.childLoadBalancer.updateAddressList(A, _, Object.assign(Object.assign({}, this.channelOptions), q), Y)
            }
            if (H) this.onSuccessfulResolution($, (w = q[bW4.CHANNEL_ARGS_CONFIG_SELECTOR_KEY]) !== null && w !== void 0 ? w : U9Y($));
            return H
        }
        updateResolution() {
            if (this.innerResolver.updateResolution(), this.currentState === HN.ConnectivityState.IDLE) this.updateState(HN.ConnectivityState.CONNECTING, this.latestChildPicker, this.latestChildErrorMessage);
            this.backoffTimeout.runOnce()
        }
        updateState(A, q, K) {
            if (uW4((0, u9Y.uriToString)(this.target) + " " + HN.ConnectivityState[this.currentState] + " -> " + HN.ConnectivityState[A]), A === HN.ConnectivityState.IDLE) q = new Sm1.QueuePicker(this, q);
            this.currentState = A, this.channelControlHelper.updateState(A, q, K)
        }
        handleResolutionFailure(A) {
            if (this.latestChildState === HN.ConnectivityState.IDLE) this.updateState(HN.ConnectivityState.TRANSIENT_FAILURE, new Sm1.UnavailablePicker(A), A.details), this.onFailedResolution(A)
        }
        exitIdle() {
            if (this.currentState === HN.ConnectivityState.IDLE || this.currentState === HN.ConnectivityState.TRANSIENT_FAILURE)
                if (this.backoffTimeout.isRunning()) this.continueResolving = !0;
                else this.updateResolution();
            this.childLoadBalancer.exitIdle()
        }
        updateAddressList(A, q) {
            throw Error("updateAddressList not supported on ResolvingLoadBalancer")
        }
        resetBackoff() {
            this.backoffTimeout.reset(), this.childLoadBalancer.resetBackoff()
        }
        destroy() {
            this.childLoadBalancer.destroy(), this.innerResolver.destroy(), this.backoffTimeout.reset(), this.backoffTimeout.stop(), this.latestChildState = HN.ConnectivityState.IDLE, this.latestChildPicker = new Sm1.QueuePicker(this), this.currentState = HN.ConnectivityState.IDLE, this.previousServiceConfig = null, this.continueResolving = !1
        }
        getTypeName() {
            return "resolving_load_balancer"
        }
    }
    mW4.ResolvingLoadBalancer = BW4
})
// @from(Ln 286674, Col 4)
pW4 = R((gW4) => {
    Object.defineProperty(gW4, "__esModule", {
        value: !0
    });
    gW4.recognizedOptions = void 0;
    gW4.channelOptionsEqual = p9Y;
    gW4.recognizedOptions = {
        "grpc.ssl_target_name_override": !0,
        "grpc.primary_user_agent": !0,
        "grpc.secondary_user_agent": !0,
        "grpc.default_authority": !0,
        "grpc.keepalive_time_ms": !0,
        "grpc.keepalive_timeout_ms": !0,
        "grpc.keepalive_permit_without_calls": !0,
        "grpc.service_config": !0,
        "grpc.max_concurrent_streams": !0,
        "grpc.initial_reconnect_backoff_ms": !0,
        "grpc.max_reconnect_backoff_ms": !0,
        "grpc.use_local_subchannel_pool": !0,
        "grpc.max_send_message_length": !0,
        "grpc.max_receive_message_length": !0,
        "grpc.enable_http_proxy": !0,
        "grpc.enable_channelz": !0,
        "grpc.dns_min_time_between_resolutions_ms": !0,
        "grpc.enable_retries": !0,
        "grpc.per_rpc_retry_buffer_size": !0,
        "grpc.retry_buffer_size": !0,
        "grpc.max_connection_age_ms": !0,
        "grpc.max_connection_age_grace_ms": !0,
        "grpc-node.max_session_memory": !0,
        "grpc.service_config_disable_resolution": !0,
        "grpc.client_idle_timeout_ms": !0,
        "grpc-node.tls_enable_trace": !0,
        "grpc.lb.ring_hash.ring_size_cap": !0,
        "grpc-node.retry_max_attempts_limit": !0,
        "grpc-node.flow_control_window": !0,
        "grpc.server_call_metric_recording": !0
    };

    function p9Y(A, q) {
        let K = Object.keys(A).sort(),
            Y = Object.keys(q).sort();
        if (K.length !== Y.length) return !1;
        for (let z = 0; z < K.length; z += 1) {
            if (K[z] !== Y[z]) return !1;
            if (A[K[z]] !== q[Y[z]]) return !1
        }
        return !0
    }
})
// @from(Ln 286724, Col 4)
$N = R((nW4) => {
    Object.defineProperty(nW4, "__esModule", {
        value: !0
    });
    nW4.EndpointMap = void 0;
    nW4.isTcpSubchannelAddress = Im1;
    nW4.subchannelAddressEqual = QD6;
    nW4.subchannelAddressToString = cW4;
    nW4.stringToSubchannelAddress = l9Y;
    nW4.endpointEqual = i9Y;
    nW4.endpointToString = n9Y;
    nW4.endpointHasAddress = lW4;
    var dW4 = h1("net");

    function Im1(A) {
        return "port" in A
    }

    function QD6(A, q) {
        if (!A && !q) return !0;
        if (!A || !q) return !1;
        if (Im1(A)) return Im1(q) && A.host === q.host && A.port === q.port;
        else return !Im1(q) && A.path === q.path
    }

    function cW4(A) {
        if (Im1(A))
            if ((0, dW4.isIPv6)(A.host)) return "[" + A.host + "]:" + A.port;
            else return A.host + ":" + A.port;
        else return A.path
    }
    var c9Y = 443;

    function l9Y(A, q) {
        if ((0, dW4.isIP)(A)) return {
            host: A,
            port: q !== null && q !== void 0 ? q : c9Y
        };
        else return {
            path: A
        }
    }

    function i9Y(A, q) {
        if (A.addresses.length !== q.addresses.length) return !1;
        for (let K = 0; K < A.addresses.length; K++)
            if (!QD6(A.addresses[K], q.addresses[K])) return !1;
        return !0
    }

    function n9Y(A) {
        return "[" + A.addresses.map(cW4).join(", ") + "]"
    }

    function lW4(A, q) {
        for (let K of A.addresses)
            if (QD6(K, q)) return !0;
        return !1
    }

    function hm1(A, q) {
        if (A.addresses.length !== q.addresses.length) return !1;
        for (let K of A.addresses) {
            let Y = !1;
            for (let z of q.addresses)
                if (QD6(K, z)) {
                    Y = !0;
                    break
                } if (!Y) return !1
        }
        return !0
    }
    class iW4 {
        constructor() {
            this.map = new Set
        }
        get size() {
            return this.map.size
        }
        getForSubchannelAddress(A) {
            for (let q of this.map)
                if (lW4(q.key, A)) return q.value;
            return
        }
        deleteMissing(A) {
            let q = [];
            for (let K of this.map) {
                let Y = !1;
                for (let z of A)
                    if (hm1(z, K.key)) Y = !0;
                if (!Y) q.push(K.value), this.map.delete(K)
            }
            return q
        }
        get(A) {
            for (let q of this.map)
                if (hm1(A, q.key)) return q.value;
            return
        }
        set(A, q) {
            for (let K of this.map)
                if (hm1(A, K.key)) {
                    K.value = q;
                    return
                } this.map.add({
                key: A,
                value: q
            })
        }
        delete(A) {
            for (let q of this.map)
                if (hm1(A, q.key)) {
                    this.map.delete(q);
                    return
                }
        }
        has(A) {
            for (let q of this.map)
                if (hm1(A, q.key)) return !0;
            return !1
        }
        clear() {
            this.map.clear()
        }* keys() {
            for (let A of this.map) yield A.key
        }* values() {
            for (let A of this.map) yield A.value
        }* entries() {
            for (let A of this.map) yield [A.key, A.value]
        }
    }
    nW4.EndpointMap = iW4
})
// @from(Ln 286857, Col 4)
YG4 = R((KG4) => {
    Object.defineProperty(KG4, "t", {
        value: !0
    });
    class YfA {
        constructor(A, q, K = 1) {
            this.i = void 0, this.h = void 0, this.o = void 0, this.u = A, this.l = q, this.p = K
        }
        I() {
            let A = this,
                q = A.o.o === A;
            if (q && A.p === 1) A = A.h;
            else if (A.i) {
                A = A.i;
                while (A.h) A = A.h
            } else {
                if (q) return A.o;
                let K = A.o;
                while (K.i === A) A = K, K = A.o;
                A = K
            }
            return A
        }
        B() {
            let A = this;
            if (A.h) {
                A = A.h;
                while (A.i) A = A.i;
                return A
            } else {
                let q = A.o;
                while (q.h === A) A = q, q = A.o;
                if (A.h !== q) return q;
                else return A
            }
        }
        _() {
            let A = this.o,
                q = this.h,
                K = q.i;
            if (A.o === this) A.o = q;
            else if (A.i === this) A.i = q;
            else A.h = q;
            if (q.o = A, q.i = this, this.o = q, this.h = K, K) K.o = this;
            return q
        }
        g() {
            let A = this.o,
                q = this.i,
                K = q.h;
            if (A.o === this) A.o = q;
            else if (A.i === this) A.i = q;
            else A.h = q;
            if (q.o = A, q.h = this, this.o = q, this.i = K, K) K.o = this;
            return q
        }
    }
    class oW4 extends YfA {
        constructor() {
            super(...arguments);
            this.M = 1
        }
        _() {
            let A = super._();
            return this.O(), A.O(), A
        }
        g() {
            let A = super.g();
            return this.O(), A.O(), A
        }
        O() {
            if (this.M = 1, this.i) this.M += this.i.M;
            if (this.h) this.M += this.h.M
        }
    }
    class aW4 {
        constructor(A = 0) {
            this.iteratorType = A
        }
        equals(A) {
            return this.T === A.T
        }
    }
    class sW4 {
        constructor() {
            this.m = 0
        }
        get length() {
            return this.m
        }
        size() {
            return this.m
        }
        empty() {
            return this.m === 0
        }
    }
    class tW4 extends sW4 {}

    function E31() {
        throw RangeError("Iterator access denied!")
    }
    class eW4 extends tW4 {
        constructor(A = function(K, Y) {
            if (K < Y) return -1;
            if (K > Y) return 1;
            return 0
        }, q = !1) {
            super();
            this.v = void 0, this.A = A, this.enableIndex = q, this.N = q ? oW4 : YfA, this.C = new this.N
        }
        R(A, q) {
            let K = this.C;
            while (A) {
                let Y = this.A(A.u, q);
                if (Y < 0) A = A.h;
                else if (Y > 0) K = A, A = A.i;
                else return A
            }
            return K
        }
        K(A, q) {
            let K = this.C;
            while (A)
                if (this.A(A.u, q) <= 0) A = A.h;
                else K = A, A = A.i;
            return K
        }
        L(A, q) {
            let K = this.C;
            while (A) {
                let Y = this.A(A.u, q);
                if (Y < 0) K = A, A = A.h;
                else if (Y > 0) A = A.i;
                else return A
            }
            return K
        }
        k(A, q) {
            let K = this.C;
            while (A)
                if (this.A(A.u, q) < 0) K = A, A = A.h;
                else A = A.i;
            return K
        }
        P(A) {
            while (!0) {
                let q = A.o;
                if (q === this.C) return;
                if (A.p === 1) {
                    A.p = 0;
                    return
                }
                if (A === q.i) {
                    let K = q.h;
                    if (K.p === 1)
                        if (K.p = 0, q.p = 1, q === this.v) this.v = q._();
                        else q._();
                    else if (K.h && K.h.p === 1) {
                        if (K.p = q.p, q.p = 0, K.h.p = 0, q === this.v) this.v = q._();
                        else q._();
                        return
                    } else if (K.i && K.i.p === 1) K.p = 1, K.i.p = 0, K.g();
                    else K.p = 1, A = q
                } else {
                    let K = q.i;
                    if (K.p === 1)
                        if (K.p = 0, q.p = 1, q === this.v) this.v = q.g();
                        else q.g();
                    else if (K.i && K.i.p === 1) {
                        if (K.p = q.p, q.p = 0, K.i.p = 0, q === this.v) this.v = q.g();
                        else q.g();
                        return
                    } else if (K.h && K.h.p === 1) K.p = 1, K.h.p = 0, K._();
                    else K.p = 1, A = q
                }
            }
        }
        S(A) {
            if (this.m === 1) {
                this.clear();
                return
            }
            let q = A;
            while (q.i || q.h) {
                if (q.h) {
                    q = q.h;
                    while (q.i) q = q.i
                } else q = q.i;
                let Y = A.u;
                A.u = q.u, q.u = Y;
                let z = A.l;
                A.l = q.l, q.l = z, A = q
            }
            if (this.C.i === q) this.C.i = q.o;
            else if (this.C.h === q) this.C.h = q.o;
            this.P(q);
            let K = q.o;
            if (q === K.i) K.i = void 0;
            else K.h = void 0;
            if (this.m -= 1, this.v.p = 0, this.enableIndex)
                while (K !== this.C) K.M -= 1, K = K.o
        }
        U(A) {
            let q = typeof A === "number" ? A : void 0,
                K = typeof A === "function" ? A : void 0,
                Y = typeof A > "u" ? [] : void 0,
                z = 0,
                w = this.v,
                H = [];
            while (H.length || w)
                if (w) H.push(w), w = w.i;
                else {
                    if (w = H.pop(), z === q) return w;
                    Y && Y.push(w), K && K(w, z, this), z += 1, w = w.h
                } return Y
        }
        j(A) {
            while (!0) {
                let q = A.o;
                if (q.p === 0) return;
                let K = q.o;
                if (q === K.i) {
                    let Y = K.h;
                    if (Y && Y.p === 1) {
                        if (Y.p = q.p = 0, K === this.v) return;
                        K.p = 1, A = K;
                        continue
                    } else if (A === q.h) {
                        if (A.p = 0, A.i) A.i.o = q;
                        if (A.h) A.h.o = K;
                        if (q.h = A.i, K.i = A.h, A.i = q, A.h = K, K === this.v) this.v = A, this.C.o = A;
                        else {
                            let z = K.o;
                            if (z.i === K) z.i = A;
                            else z.h = A
                        }
                        A.o = K.o, q.o = A, K.o = A, K.p = 1
                    } else {
                        if (q.p = 0, K === this.v) this.v = K.g();
                        else K.g();
                        K.p = 1;
                        return
                    }
                } else {
                    let Y = K.i;
                    if (Y && Y.p === 1) {
                        if (Y.p = q.p = 0, K === this.v) return;
                        K.p = 1, A = K;
                        continue
                    } else if (A === q.i) {
                        if (A.p = 0, A.i) A.i.o = K;
                        if (A.h) A.h.o = q;
                        if (K.h = A.i, q.i = A.h, A.i = K, A.h = q, K === this.v) this.v = A, this.C.o = A;
                        else {
                            let z = K.o;
                            if (z.i === K) z.i = A;
                            else z.h = A
                        }
                        A.o = K.o, q.o = A, K.o = A, K.p = 1
                    } else {
                        if (q.p = 0, K === this.v) this.v = K._();
                        else K._();
                        K.p = 1;
                        return
                    }
                }
                if (this.enableIndex) q.O(), K.O(), A.O();
                return
            }
        }
        q(A, q, K) {
            if (this.v === void 0) return this.m += 1, this.v = new this.N(A, q, 0), this.v.o = this.C, this.C.o = this.C.i = this.C.h = this.v, this.m;
            let Y, z = this.C.i,
                w = this.A(z.u, A);
            if (w === 0) return z.l = q, this.m;
            else if (w > 0) z.i = new this.N(A, q), z.i.o = z, Y = z.i, this.C.i = Y;
            else {
                let H = this.C.h,
                    $ = this.A(H.u, A);
                if ($ === 0) return H.l = q, this.m;
                else if ($ < 0) H.h = new this.N(A, q), H.h.o = H, Y = H.h, this.C.h = Y;
                else {
                    if (K !== void 0) {
                        let O = K.T;
                        if (O !== this.C) {
                            let _ = this.A(O.u, A);
                            if (_ === 0) return O.l = q, this.m;
                            else if (_ > 0) {
                                let J = O.I(),
                                    X = this.A(J.u, A);
                                if (X === 0) return J.l = q, this.m;
                                else if (X < 0)
                                    if (Y = new this.N(A, q), J.h === void 0) J.h = Y, Y.o = J;
                                    else O.i = Y, Y.o = O
                            }
                        }
                    }
                    if (Y === void 0) {
                        Y = this.v;
                        while (!0) {
                            let O = this.A(Y.u, A);
                            if (O > 0) {
                                if (Y.i === void 0) {
                                    Y.i = new this.N(A, q), Y.i.o = Y, Y = Y.i;
                                    break
                                }
                                Y = Y.i
                            } else if (O < 0) {
                                if (Y.h === void 0) {
                                    Y.h = new this.N(A, q), Y.h.o = Y, Y = Y.h;
                                    break
                                }
                                Y = Y.h
                            } else return Y.l = q, this.m
                        }
                    }
                }
            }
            if (this.enableIndex) {
                let H = Y.o;
                while (H !== this.C) H.M += 1, H = H.o
            }
            return this.j(Y), this.m += 1, this.m
        }
        H(A, q) {
            while (A) {
                let K = this.A(A.u, q);
                if (K < 0) A = A.h;
                else if (K > 0) A = A.i;
                else return A
            }
            return A || this.C
        }
        clear() {
            this.m = 0, this.v = void 0, this.C.o = void 0, this.C.i = this.C.h = void 0
        }
        updateKeyByIterator(A, q) {
            let K = A.T;
            if (K === this.C) E31();
            if (this.m === 1) return K.u = q, !0;
            let Y = K.B().u;
            if (K === this.C.i) {
                if (this.A(Y, q) > 0) return K.u = q, !0;
                return !1
            }
            let z = K.I().u;
            if (K === this.C.h) {
                if (this.A(z, q) < 0) return K.u = q, !0;
                return !1
            }
            if (this.A(z, q) >= 0 || this.A(Y, q) <= 0) return !1;
            return K.u = q, !0
        }
        eraseElementByPos(A) {
            if (A < 0 || A > this.m - 1) throw RangeError();
            let q = this.U(A);
            return this.S(q), this.m
        }
        eraseElementByKey(A) {
            if (this.m === 0) return !1;
            let q = this.H(this.v, A);
            if (q === this.C) return !1;
            return this.S(q), !0
        }
        eraseElementByIterator(A) {
            let q = A.T;
            if (q === this.C) E31();
            let K = q.h === void 0;
            if (A.iteratorType === 0) {
                if (K) A.next()
            } else if (!K || q.i === void 0) A.next();
            return this.S(q), A
        }
        getHeight() {
            if (this.m === 0) return 0;

            function A(q) {
                if (!q) return 0;
                return Math.max(A(q.i), A(q.h)) + 1
            }
            return A(this.v)
        }
    }
    class AG4 extends aW4 {
        constructor(A, q, K) {
            super(K);
            if (this.T = A, this.C = q, this.iteratorType === 0) this.pre = function() {
                if (this.T === this.C.i) E31();
                return this.T = this.T.I(), this
            }, this.next = function() {
                if (this.T === this.C) E31();
                return this.T = this.T.B(), this
            };
            else this.pre = function() {
                if (this.T === this.C.h) E31();
                return this.T = this.T.B(), this
            }, this.next = function() {
                if (this.T === this.C) E31();
                return this.T = this.T.I(), this
            }
        }
        get index() {
            let A = this.T,
                q = this.C.o;
            if (A === this.C) {
                if (q) return q.M - 1;
                return 0
            }
            let K = 0;
            if (A.i) K += A.i.M;
            while (A !== q) {
                let Y = A.o;
                if (A === Y.h) {
                    if (K += 1, Y.i) K += Y.i.M
                }
                A = Y
            }
            return K
        }
        isAccessible() {
            return this.T !== this.C
        }
    }
    class ih extends AG4 {
        constructor(A, q, K, Y) {
            super(A, q, Y);
            this.container = K
        }
        get pointer() {
            if (this.T === this.C) E31();
            let A = this;
            return new Proxy([], {
                get(q, K) {
                    if (K === "0") return A.T.u;
                    else if (K === "1") return A.T.l;
                    return q[0] = A.T.u, q[1] = A.T.l, q[K]
                },
                set(q, K, Y) {
                    if (K !== "1") throw TypeError("prop must be 1");
                    return A.T.l = Y, !0
                }
            })
        }
        copy() {
            return new ih(this.T, this.C, this.container, this.iteratorType)
        }
    }
    class qG4 extends eW4 {
        constructor(A = [], q, K) {
            super(q, K);
            let Y = this;
            A.forEach(function(z) {
                Y.setElement(z[0], z[1])
            })
        }
        begin() {
            return new ih(this.C.i || this.C, this.C, this)
        }
        end() {
            return new ih(this.C, this.C, this)
        }
        rBegin() {
            return new ih(this.C.h || this.C, this.C, this, 1)
        }
        rEnd() {
            return new ih(this.C, this.C, this, 1)
        }
        front() {
            if (this.m === 0) return;
            let A = this.C.i;
            return [A.u, A.l]
        }
        back() {
            if (this.m === 0) return;
            let A = this.C.h;
            return [A.u, A.l]
        }
        lowerBound(A) {
            let q = this.R(this.v, A);
            return new ih(q, this.C, this)
        }
        upperBound(A) {
            let q = this.K(this.v, A);
            return new ih(q, this.C, this)
        }
        reverseLowerBound(A) {
            let q = this.L(this.v, A);
            return new ih(q, this.C, this)
        }
        reverseUpperBound(A) {
            let q = this.k(this.v, A);
            return new ih(q, this.C, this)
        }
        forEach(A) {
            this.U(function(q, K, Y) {
                A([q.u, q.l], K, Y)
            })
        }
        setElement(A, q, K) {
            return this.q(A, q, K)
        }
        getElementByPos(A) {
            if (A < 0 || A > this.m - 1) throw RangeError();
            let q = this.U(A);
            return [q.u, q.l]
        }
        find(A) {
            let q = this.H(this.v, A);
            return new ih(q, this.C, this)
        }
        getElementByKey(A) {
            return this.H(this.v, A).l
        }
        union(A) {
            let q = this;
            return A.forEach(function(K) {
                q.setElement(K[0], K[1])
            }), this.m
        }*[Symbol.iterator]() {
            let A = this.m,
                q = this.U();
            for (let K = 0; K < A; ++K) {
                let Y = q[K];
                yield [Y.u, Y.l]
            }
        }
    }
    KG4.OrderedMap = qG4
})
// @from(Ln 287387, Col 4)
gD6 = R((wG4) => {
    Object.defineProperty(wG4, "__esModule", {
        value: !0
    });
    wG4.registerAdminService = KYY;
    wG4.addAdminServicesToServer = YYY;
    var zG4 = [];

    function KYY(A, q) {
        zG4.push({
            getServiceDefinition: A,
            getHandlers: q
        })
    }

    function YYY(A) {
        for (let {
                getServiceDefinition: q,
                getHandlers: K
            }
            of zG4) A.addService(q(), K())
    }
})
// @from(Ln 287410, Col 4)
DG4 = R((JG4) => {
    Object.defineProperty(JG4, "__esModule", {
        value: !0
    });
    JG4.ClientDuplexStreamImpl = JG4.ClientWritableStreamImpl = JG4.ClientReadableStreamImpl = JG4.ClientUnaryCallImpl = void 0;
    JG4.callErrorFromStatus = $YY;
    var HYY = h1("events"),
        zfA = h1("stream"),
        xm1 = w9();

    function $YY(A, q) {
        let K = `${A.code} ${xm1.Status[A.code]}: ${A.details}`,
            z = `${Error(K).stack}
for call at
${q}`;
        return Object.assign(Error(K), A, {
            stack: z
        })
    }
    class HG4 extends HYY.EventEmitter {
        constructor() {
            super()
        }
        cancel() {
            var A;
            (A = this.call) === null || A === void 0 || A.cancelWithStatus(xm1.Status.CANCELLED, "Cancelled on client")
        }
        getPeer() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getPeer()) !== null && q !== void 0 ? q : "unknown"
        }
        getAuthContext() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getAuthContext()) !== null && q !== void 0 ? q : null
        }
    }
    JG4.ClientUnaryCallImpl = HG4;
    class $G4 extends zfA.Readable {
        constructor(A) {
            super({
                objectMode: !0
            });
            this.deserialize = A
        }
        cancel() {
            var A;
            (A = this.call) === null || A === void 0 || A.cancelWithStatus(xm1.Status.CANCELLED, "Cancelled on client")
        }
        getPeer() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getPeer()) !== null && q !== void 0 ? q : "unknown"
        }
        getAuthContext() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getAuthContext()) !== null && q !== void 0 ? q : null
        }
        _read(A) {
            var q;
            (q = this.call) === null || q === void 0 || q.startRead()
        }
    }
    JG4.ClientReadableStreamImpl = $G4;
    class OG4 extends zfA.Writable {
        constructor(A) {
            super({
                objectMode: !0
            });
            this.serialize = A
        }
        cancel() {
            var A;
            (A = this.call) === null || A === void 0 || A.cancelWithStatus(xm1.Status.CANCELLED, "Cancelled on client")
        }
        getPeer() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getPeer()) !== null && q !== void 0 ? q : "unknown"
        }
        getAuthContext() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getAuthContext()) !== null && q !== void 0 ? q : null
        }
        _write(A, q, K) {
            var Y;
            let z = {
                    callback: K
                },
                w = Number(q);
            if (!Number.isNaN(w)) z.flags = w;
            (Y = this.call) === null || Y === void 0 || Y.sendMessageWithContext(z, A)
        }
        _final(A) {
            var q;
            (q = this.call) === null || q === void 0 || q.halfClose(), A()
        }
    }
    JG4.ClientWritableStreamImpl = OG4;
    class _G4 extends zfA.Duplex {
        constructor(A, q) {
            super({
                objectMode: !0
            });
            this.serialize = A, this.deserialize = q
        }
        cancel() {
            var A;
            (A = this.call) === null || A === void 0 || A.cancelWithStatus(xm1.Status.CANCELLED, "Cancelled on client")
        }
        getPeer() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getPeer()) !== null && q !== void 0 ? q : "unknown"
        }
        getAuthContext() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getAuthContext()) !== null && q !== void 0 ? q : null
        }
        _read(A) {
            var q;
            (q = this.call) === null || q === void 0 || q.startRead()
        }
        _write(A, q, K) {
            var Y;
            let z = {
                    callback: K
                },
                w = Number(q);
            if (!Number.isNaN(w)) z.flags = w;
            (Y = this.call) === null || Y === void 0 || Y.sendMessageWithContext(z, A)
        }
        _final(A) {
            var q;
            (q = this.call) === null || q === void 0 || q.halfClose(), A()
        }
    }
    JG4.ClientDuplexStreamImpl = _G4
})
// @from(Ln 287545, Col 4)
k31 = R((MG4) => {
    Object.defineProperty(MG4, "__esModule", {
        value: !0
    });
    MG4.InterceptingListenerImpl = void 0;
    MG4.statusOrFromValue = jYY;
    MG4.statusOrFromError = MYY;
    MG4.isInterceptingListener = PYY;
    var DYY = Jj();

    function jYY(A) {
        return {
            ok: !0,
            value: A
        }
    }

    function MYY(A) {
        var q;
        return {
            ok: !1,
            error: Object.assign(Object.assign({}, A), {
                metadata: (q = A.metadata) !== null && q !== void 0 ? q : new DYY.Metadata
            })
        }
    }

    function PYY(A) {
        return A.onReceiveMetadata !== void 0 && A.onReceiveMetadata.length === 1
    }
    class jG4 {
        constructor(A, q) {
            this.listener = A, this.nextListener = q, this.processingMetadata = !1, this.hasPendingMessage = !1, this.processingMessage = !1, this.pendingStatus = null
        }
        processPendingMessage() {
            if (this.hasPendingMessage) this.nextListener.onReceiveMessage(this.pendingMessage), this.pendingMessage = null, this.hasPendingMessage = !1
        }
        processPendingStatus() {
            if (this.pendingStatus) this.nextListener.onReceiveStatus(this.pendingStatus)
        }
        onReceiveMetadata(A) {
            this.processingMetadata = !0, this.listener.onReceiveMetadata(A, (q) => {
                this.processingMetadata = !1, this.nextListener.onReceiveMetadata(q), this.processPendingMessage(), this.processPendingStatus()
            })
        }
        onReceiveMessage(A) {
            this.processingMessage = !0, this.listener.onReceiveMessage(A, (q) => {
                if (this.processingMessage = !1, this.processingMetadata) this.pendingMessage = q, this.hasPendingMessage = !0;
                else this.nextListener.onReceiveMessage(q), this.processPendingStatus()
            })
        }
        onReceiveStatus(A) {
            this.listener.onReceiveStatus(A, (q) => {
                if (this.processingMetadata || this.processingMessage) this.pendingStatus = q;
                else this.nextListener.onReceiveStatus(q)
            })
        }
    }
    MG4.InterceptingListenerImpl = jG4
})
// @from(Ln 287605, Col 4)
$fA = R((EG4) => {
    Object.defineProperty(EG4, "__esModule", {
        value: !0
    });
    EG4.InterceptingCall = EG4.RequesterBuilder = EG4.ListenerBuilder = EG4.InterceptorConfigurationError = void 0;
    EG4.getInterceptingCall = TYY;
    var fYY = Jj(),
        WG4 = k31(),
        GG4 = w9(),
        ZG4 = LD6();
    class um1 extends Error {
        constructor(A) {
            super(A);
            this.name = "InterceptorConfigurationError", Error.captureStackTrace(this, um1)
        }
    }
    EG4.InterceptorConfigurationError = um1;
    class fG4 {
        constructor() {
            this.metadata = void 0, this.message = void 0, this.status = void 0
        }
        withOnReceiveMetadata(A) {
            return this.metadata = A, this
        }
        withOnReceiveMessage(A) {
            return this.message = A, this
        }
        withOnReceiveStatus(A) {
            return this.status = A, this
        }
        build() {
            return {
                onReceiveMetadata: this.metadata,
                onReceiveMessage: this.message,
                onReceiveStatus: this.status
            }
        }
    }
    EG4.ListenerBuilder = fG4;
    class VG4 {
        constructor() {
            this.start = void 0, this.message = void 0, this.halfClose = void 0, this.cancel = void 0
        }
        withStart(A) {
            return this.start = A, this
        }
        withSendMessage(A) {
            return this.message = A, this
        }
        withHalfClose(A) {
            return this.halfClose = A, this
        }
        withCancel(A) {
            return this.cancel = A, this
        }
        build() {
            return {
                start: this.start,
                sendMessage: this.message,
                halfClose: this.halfClose,
                cancel: this.cancel
            }
        }
    }
    EG4.RequesterBuilder = VG4;
    var wfA = {
            onReceiveMetadata: (A, q) => {
                q(A)
            },
            onReceiveMessage: (A, q) => {
                q(A)
            },
            onReceiveStatus: (A, q) => {
                q(A)
            }
        },
        bm1 = {
            start: (A, q, K) => {
                K(A, q)
            },
            sendMessage: (A, q) => {
                q(A)
            },
            halfClose: (A) => {
                A()
            },
            cancel: (A) => {
                A()
            }
        };
    class NG4 {
        constructor(A, q) {
            var K, Y, z, w;
            if (this.nextCall = A, this.processingMetadata = !1, this.pendingMessageContext = null, this.processingMessage = !1, this.pendingHalfClose = !1, q) this.requester = {
                start: (K = q.start) !== null && K !== void 0 ? K : bm1.start,
                sendMessage: (Y = q.sendMessage) !== null && Y !== void 0 ? Y : bm1.sendMessage,
                halfClose: (z = q.halfClose) !== null && z !== void 0 ? z : bm1.halfClose,
                cancel: (w = q.cancel) !== null && w !== void 0 ? w : bm1.cancel
            };
            else this.requester = bm1
        }
        cancelWithStatus(A, q) {
            this.requester.cancel(() => {
                this.nextCall.cancelWithStatus(A, q)
            })
        }
        getPeer() {
            return this.nextCall.getPeer()
        }
        processPendingMessage() {
            if (this.pendingMessageContext) this.nextCall.sendMessageWithContext(this.pendingMessageContext, this.pendingMessage), this.pendingMessageContext = null, this.pendingMessage = null
        }
        processPendingHalfClose() {
            if (this.pendingHalfClose) this.nextCall.halfClose()
        }
        start(A, q) {
            var K, Y, z, w, H, $;
            let O = {
                onReceiveMetadata: (Y = (K = q === null || q === void 0 ? void 0 : q.onReceiveMetadata) === null || K === void 0 ? void 0 : K.bind(q)) !== null && Y !== void 0 ? Y : (_) => {},
                onReceiveMessage: (w = (z = q === null || q === void 0 ? void 0 : q.onReceiveMessage) === null || z === void 0 ? void 0 : z.bind(q)) !== null && w !== void 0 ? w : (_) => {},
                onReceiveStatus: ($ = (H = q === null || q === void 0 ? void 0 : q.onReceiveStatus) === null || H === void 0 ? void 0 : H.bind(q)) !== null && $ !== void 0 ? $ : (_) => {}
            };
            this.processingMetadata = !0, this.requester.start(A, O, (_, J) => {
                var X, D, j;
                this.processingMetadata = !1;
                let M;
                if ((0, WG4.isInterceptingListener)(J)) M = J;
                else {
                    let P = {
                        onReceiveMetadata: (X = J.onReceiveMetadata) !== null && X !== void 0 ? X : wfA.onReceiveMetadata,
                        onReceiveMessage: (D = J.onReceiveMessage) !== null && D !== void 0 ? D : wfA.onReceiveMessage,
                        onReceiveStatus: (j = J.onReceiveStatus) !== null && j !== void 0 ? j : wfA.onReceiveStatus
                    };
                    M = new WG4.InterceptingListenerImpl(P, O)
                }
                this.nextCall.start(_, M), this.processPendingMessage(), this.processPendingHalfClose()
            })
        }
        sendMessageWithContext(A, q) {
            this.processingMessage = !0, this.requester.sendMessage(q, (K) => {
                if (this.processingMessage = !1, this.processingMetadata) this.pendingMessageContext = A, this.pendingMessage = q;
                else this.nextCall.sendMessageWithContext(A, K), this.processPendingHalfClose()
            })
        }
        sendMessage(A) {
            this.sendMessageWithContext({}, A)
        }
        startRead() {
            this.nextCall.startRead()
        }
        halfClose() {
            this.requester.halfClose(() => {
                if (this.processingMetadata || this.processingMessage) this.pendingHalfClose = !0;
                else this.nextCall.halfClose()
            })
        }
        getAuthContext() {
            return this.nextCall.getAuthContext()
        }
    }
    EG4.InterceptingCall = NG4;

    function VYY(A, q, K) {
        var Y, z;
        let w = (Y = K.deadline) !== null && Y !== void 0 ? Y : 1 / 0,
            H = K.host,
            $ = (z = K.parent) !== null && z !== void 0 ? z : null,
            O = K.propagate_flags,
            _ = K.credentials,
            J = A.createCall(q, w, H, $, O);
        if (_) J.setCredentials(_);
        return J
    }
    class HfA {
        constructor(A, q) {
            this.call = A, this.methodDefinition = q
        }
        cancelWithStatus(A, q) {
            this.call.cancelWithStatus(A, q)
        }
        getPeer() {
            return this.call.getPeer()
        }
        sendMessageWithContext(A, q) {
            let K;
            try {
                K = this.methodDefinition.requestSerialize(q)
            } catch (Y) {
                this.call.cancelWithStatus(GG4.Status.INTERNAL, `Request message serialization failure: ${(0,ZG4.getErrorMessage)(Y)}`);
                return
            }
            this.call.sendMessageWithContext(A, K)
        }
        sendMessage(A) {
            this.sendMessageWithContext({}, A)
        }
        start(A, q) {
            let K = null;
            this.call.start(A, {
                onReceiveMetadata: (Y) => {
                    var z;
                    (z = q === null || q === void 0 ? void 0 : q.onReceiveMetadata) === null || z === void 0 || z.call(q, Y)
                },
                onReceiveMessage: (Y) => {
                    var z;
                    let w;
                    try {
                        w = this.methodDefinition.responseDeserialize(Y)
                    } catch (H) {
                        K = {
                            code: GG4.Status.INTERNAL,
                            details: `Response message parsing error: ${(0,ZG4.getErrorMessage)(H)}`,
                            metadata: new fYY.Metadata
                        }, this.call.cancelWithStatus(K.code, K.details);
                        return
                    }(z = q === null || q === void 0 ? void 0 : q.onReceiveMessage) === null || z === void 0 || z.call(q, w)
                },
                onReceiveStatus: (Y) => {
                    var z, w;
                    if (K)(z = q === null || q === void 0 ? void 0 : q.onReceiveStatus) === null || z === void 0 || z.call(q, K);
                    else(w = q === null || q === void 0 ? void 0 : q.onReceiveStatus) === null || w === void 0 || w.call(q, Y)
                }
            })
        }
        startRead() {
            this.call.startRead()
        }
        halfClose() {
            this.call.halfClose()
        }
        getAuthContext() {
            return this.call.getAuthContext()
        }
    }
    class TG4 extends HfA {
        constructor(A, q) {
            super(A, q)
        }
        start(A, q) {
            var K, Y;
            let z = !1,
                w = {
                    onReceiveMetadata: (Y = (K = q === null || q === void 0 ? void 0 : q.onReceiveMetadata) === null || K === void 0 ? void 0 : K.bind(q)) !== null && Y !== void 0 ? Y : (H) => {},
                    onReceiveMessage: (H) => {
                        var $;
                        z = !0, ($ = q === null || q === void 0 ? void 0 : q.onReceiveMessage) === null || $ === void 0 || $.call(q, H)
                    },
                    onReceiveStatus: (H) => {
                        var $, O;
                        if (!z)($ = q === null || q === void 0 ? void 0 : q.onReceiveMessage) === null || $ === void 0 || $.call(q, null);
                        (O = q === null || q === void 0 ? void 0 : q.onReceiveStatus) === null || O === void 0 || O.call(q, H)
                    }
                };
            super.start(A, w), this.call.startRead()
        }
    }
    class vG4 extends HfA {}

    function NYY(A, q, K) {
        let Y = VYY(A, K.path, q);
        if (K.responseStream) return new vG4(Y, K);
        else return new TG4(Y, K)
    }

    function TYY(A, q, K, Y) {
        if (A.clientInterceptors.length > 0 && A.clientInterceptorProviders.length > 0) throw new um1("Both interceptors and interceptor_providers were passed as options to the client constructor. Only one of these is allowed.");
        if (A.callInterceptors.length > 0 && A.callInterceptorProviders.length > 0) throw new um1("Both interceptors and interceptor_providers were passed as call options. Only one of these is allowed.");
        let z = [];
        if (A.callInterceptors.length > 0 || A.callInterceptorProviders.length > 0) z = [].concat(A.callInterceptors, A.callInterceptorProviders.map(($) => $(q))).filter(($) => $);
        else z = [].concat(A.clientInterceptors, A.clientInterceptorProviders.map(($) => $(q))).filter(($) => $);
        let w = Object.assign({}, K, {
            method_definition: q
        });
        return z.reduceRight(($, O) => {
            return (_) => O(_, $)
        }, ($) => NYY(Y, $, q))(w)
    }
})
// @from(Ln 287883, Col 4)
_fA = R((RG4) => {
    Object.defineProperty(RG4, "__esModule", {
        value: !0
    });
    RG4.Client = void 0;
    var zm = DG4(),
        RYY = JfA(),
        yYY = FZ(),
        ks = w9(),
        pM1 = Jj(),
        UD6 = $fA(),
        nh = Symbol(),
        dM1 = Symbol(),
        cM1 = Symbol(),
        wd = Symbol();

    function OfA(A) {
        return typeof A === "function"
    }

    function lM1(A) {
        var q;
        return ((q = A.stack) === null || q === void 0 ? void 0 : q.split(`
`).slice(1).join(`
`)) || "no stack trace available"
    }
    class LG4 {
        constructor(A, q, K = {}) {
            var Y, z;
            if (K = Object.assign({}, K), this[dM1] = (Y = K.interceptors) !== null && Y !== void 0 ? Y : [], delete K.interceptors, this[cM1] = (z = K.interceptor_providers) !== null && z !== void 0 ? z : [], delete K.interceptor_providers, this[dM1].length > 0 && this[cM1].length > 0) throw Error("Both interceptors and interceptor_providers were passed as options to the client constructor. Only one of these is allowed.");
            if (this[wd] = K.callInvocationTransformer, delete K.callInvocationTransformer, K.channelOverride) this[nh] = K.channelOverride;
            else if (K.channelFactoryOverride) {
                let w = K.channelFactoryOverride;
                delete K.channelFactoryOverride, this[nh] = w(A, q, K)
            } else this[nh] = new RYY.ChannelImplementation(A, q, K)
        }
        close() {
            this[nh].close()
        }
        getChannel() {
            return this[nh]
        }
        waitForReady(A, q) {
            let K = (Y) => {
                if (Y) {
                    q(Error("Failed to connect before the deadline"));
                    return
                }
                let z;
                try {
                    z = this[nh].getConnectivityState(!0)
                } catch (w) {
                    q(Error("The channel has been closed"));
                    return
                }
                if (z === yYY.ConnectivityState.READY) q();
                else try {
                    this[nh].watchConnectivityState(z, A, K)
                } catch (w) {
                    q(Error("The channel has been closed"))
                }
            };
            setImmediate(K)
        }
        checkOptionalUnaryResponseArguments(A, q, K) {
            if (OfA(A)) return {
                metadata: new pM1.Metadata,
                options: {},
                callback: A
            };
            else if (OfA(q))
                if (A instanceof pM1.Metadata) return {
                    metadata: A,
                    options: {},
                    callback: q
                };
                else return {
                    metadata: new pM1.Metadata,
                    options: A,
                    callback: q
                };
            else {
                if (!(A instanceof pM1.Metadata && q instanceof Object && OfA(K))) throw Error("Incorrect arguments passed");
                return {
                    metadata: A,
                    options: q,
                    callback: K
                }
            }
        }
        makeUnaryRequest(A, q, K, Y, z, w, H) {
            var $, O;
            let _ = this.checkOptionalUnaryResponseArguments(z, w, H),
                J = {
                    path: A,
                    requestStream: !1,
                    responseStream: !1,
                    requestSerialize: q,
                    responseDeserialize: K
                },
                X = {
                    argument: Y,
                    metadata: _.metadata,
                    call: new zm.ClientUnaryCallImpl,
                    channel: this[nh],
                    methodDefinition: J,
                    callOptions: _.options,
                    callback: _.callback
                };
            if (this[wd]) X = this[wd](X);
            let D = X.call,
                j = {
                    clientInterceptors: this[dM1],
                    clientInterceptorProviders: this[cM1],
                    callInterceptors: ($ = X.callOptions.interceptors) !== null && $ !== void 0 ? $ : [],
                    callInterceptorProviders: (O = X.callOptions.interceptor_providers) !== null && O !== void 0 ? O : []
                },
                M = (0, UD6.getInterceptingCall)(j, X.methodDefinition, X.callOptions, X.channel);
            D.call = M;
            let P = null,
                W = !1,
                G = Error();
            return M.start(X.metadata, {
                onReceiveMetadata: (f) => {
                    D.emit("metadata", f)
                },
                onReceiveMessage(f) {
                    if (P !== null) M.cancelWithStatus(ks.Status.UNIMPLEMENTED, "Too many responses received");
                    P = f
                },
                onReceiveStatus(f) {
                    if (W) return;
                    if (W = !0, f.code === ks.Status.OK)
                        if (P === null) {
                            let Z = lM1(G);
                            X.callback((0, zm.callErrorFromStatus)({
                                code: ks.Status.UNIMPLEMENTED,
                                details: "No message received",
                                metadata: f.metadata
                            }, Z))
                        } else X.callback(null, P);
                    else {
                        let Z = lM1(G);
                        X.callback((0, zm.callErrorFromStatus)(f, Z))
                    }
                    G = null, D.emit("status", f)
                }
            }), M.sendMessage(Y), M.halfClose(), D
        }
        makeClientStreamRequest(A, q, K, Y, z, w) {
            var H, $;
            let O = this.checkOptionalUnaryResponseArguments(Y, z, w),
                _ = {
                    path: A,
                    requestStream: !0,
                    responseStream: !1,
                    requestSerialize: q,
                    responseDeserialize: K
                },
                J = {
                    metadata: O.metadata,
                    call: new zm.ClientWritableStreamImpl(q),
                    channel: this[nh],
                    methodDefinition: _,
                    callOptions: O.options,
                    callback: O.callback
                };
            if (this[wd]) J = this[wd](J);
            let X = J.call,
                D = {
                    clientInterceptors: this[dM1],
                    clientInterceptorProviders: this[cM1],
                    callInterceptors: (H = J.callOptions.interceptors) !== null && H !== void 0 ? H : [],
                    callInterceptorProviders: ($ = J.callOptions.interceptor_providers) !== null && $ !== void 0 ? $ : []
                },
                j = (0, UD6.getInterceptingCall)(D, J.methodDefinition, J.callOptions, J.channel);
            X.call = j;
            let M = null,
                P = !1,
                W = Error();
            return j.start(J.metadata, {
                onReceiveMetadata: (G) => {
                    X.emit("metadata", G)
                },
                onReceiveMessage(G) {
                    if (M !== null) j.cancelWithStatus(ks.Status.UNIMPLEMENTED, "Too many responses received");
                    M = G, j.startRead()
                },
                onReceiveStatus(G) {
                    if (P) return;
                    if (P = !0, G.code === ks.Status.OK)
                        if (M === null) {
                            let f = lM1(W);
                            J.callback((0, zm.callErrorFromStatus)({
                                code: ks.Status.UNIMPLEMENTED,
                                details: "No message received",
                                metadata: G.metadata
                            }, f))
                        } else J.callback(null, M);
                    else {
                        let f = lM1(W);
                        J.callback((0, zm.callErrorFromStatus)(G, f))
                    }
                    W = null, X.emit("status", G)
                }
            }), X
        }
        checkMetadataAndOptions(A, q) {
            let K, Y;
            if (A instanceof pM1.Metadata)
                if (K = A, q) Y = q;
                else Y = {};
            else {
                if (A) Y = A;
                else Y = {};
                K = new pM1.Metadata
            }
            return {
                metadata: K,
                options: Y
            }
        }
        makeServerStreamRequest(A, q, K, Y, z, w) {
            var H, $;
            let O = this.checkMetadataAndOptions(z, w),
                _ = {
                    path: A,
                    requestStream: !1,
                    responseStream: !0,
                    requestSerialize: q,
                    responseDeserialize: K
                },
                J = {
                    argument: Y,
                    metadata: O.metadata,
                    call: new zm.ClientReadableStreamImpl(K),
                    channel: this[nh],
                    methodDefinition: _,
                    callOptions: O.options
                };
            if (this[wd]) J = this[wd](J);
            let X = J.call,
                D = {
                    clientInterceptors: this[dM1],
                    clientInterceptorProviders: this[cM1],
                    callInterceptors: (H = J.callOptions.interceptors) !== null && H !== void 0 ? H : [],
                    callInterceptorProviders: ($ = J.callOptions.interceptor_providers) !== null && $ !== void 0 ? $ : []
                },
                j = (0, UD6.getInterceptingCall)(D, J.methodDefinition, J.callOptions, J.channel);
            X.call = j;
            let M = !1,
                P = Error();
            return j.start(J.metadata, {
                onReceiveMetadata(W) {
                    X.emit("metadata", W)
                },
                onReceiveMessage(W) {
                    X.push(W)
                },
                onReceiveStatus(W) {
                    if (M) return;
                    if (M = !0, X.push(null), W.code !== ks.Status.OK) {
                        let G = lM1(P);
                        X.emit("error", (0, zm.callErrorFromStatus)(W, G))
                    }
                    P = null, X.emit("status", W)
                }
            }), j.sendMessage(Y), j.halfClose(), X
        }
        makeBidiStreamRequest(A, q, K, Y, z) {
            var w, H;
            let $ = this.checkMetadataAndOptions(Y, z),
                O = {
                    path: A,
                    requestStream: !0,
                    responseStream: !0,
                    requestSerialize: q,
                    responseDeserialize: K
                },
                _ = {
                    metadata: $.metadata,
                    call: new zm.ClientDuplexStreamImpl(q, K),
                    channel: this[nh],
                    methodDefinition: O,
                    callOptions: $.options
                };
            if (this[wd]) _ = this[wd](_);
            let J = _.call,
                X = {
                    clientInterceptors: this[dM1],
                    clientInterceptorProviders: this[cM1],
                    callInterceptors: (w = _.callOptions.interceptors) !== null && w !== void 0 ? w : [],
                    callInterceptorProviders: (H = _.callOptions.interceptor_providers) !== null && H !== void 0 ? H : []
                },
                D = (0, UD6.getInterceptingCall)(X, _.methodDefinition, _.callOptions, _.channel);
            J.call = D;
            let j = !1,
                M = Error();
            return D.start(_.metadata, {
                onReceiveMetadata(P) {
                    J.emit("metadata", P)
                },
                onReceiveMessage(P) {
                    J.push(P)
                },
                onReceiveStatus(P) {
                    if (j) return;
                    if (j = !0, J.push(null), P.code !== ks.Status.OK) {
                        let W = lM1(M);
                        J.emit("error", (0, zm.callErrorFromStatus)(P, W))
                    }
                    M = null, J.emit("status", P)
                }
            }), J
        }
    }
    RG4.Client = LG4
})
// @from(Ln 288201, Col 4)
pD6 = R((SG4) => {
    Object.defineProperty(SG4, "__esModule", {
        value: !0
    });
    SG4.makeClientConstructor = CG4;
    SG4.loadPackageDefinition = IYY;
    var Bm1 = _fA(),
        CYY = {
            unary: Bm1.Client.prototype.makeUnaryRequest,
            server_stream: Bm1.Client.prototype.makeServerStreamRequest,
            client_stream: Bm1.Client.prototype.makeClientStreamRequest,
            bidi: Bm1.Client.prototype.makeBidiStreamRequest
        };

    function XfA(A) {
        return ["__proto__", "prototype", "constructor"].includes(A)
    }

    function CG4(A, q, K) {
        if (!K) K = {};
        class Y extends Bm1.Client {}
        return Object.keys(A).forEach((z) => {
            if (XfA(z)) return;
            let w = A[z],
                H;
            if (typeof z === "string" && z.charAt(0) === "$") throw Error("Method names cannot start with $");
            if (w.requestStream)
                if (w.responseStream) H = "bidi";
                else H = "client_stream";
            else if (w.responseStream) H = "server_stream";
            else H = "unary";
            let {
                requestSerialize: $,
                responseDeserialize: O
            } = w, _ = SYY(CYY[H], w.path, $, O);
            if (Y.prototype[z] = _, Object.assign(Y.prototype[z], w), w.originalName && !XfA(w.originalName)) Y.prototype[w.originalName] = Y.prototype[z]
        }), Y.service = A, Y.serviceName = q, Y
    }

    function SYY(A, q, K, Y) {
        return function(...z) {
            return A.call(this, q, K, Y, ...z)
        }
    }

    function hYY(A) {
        return "format" in A
    }

    function IYY(A) {
        let q = {};
        for (let K in A)
            if (Object.prototype.hasOwnProperty.call(A, K)) {
                let Y = A[K],
                    z = K.split(".");
                if (z.some(($) => XfA($))) continue;
                let w = z[z.length - 1],
                    H = q;
                for (let $ of z.slice(0, -1)) {
                    if (!H[$]) H[$] = {};
                    H = H[$]
                }
                if (hYY(Y)) H[w] = Y;
                else H[w] = CG4(Y, w, {})
            } return q
    }
})
// @from(Ln 288268, Col 4)
qZ4 = R((oBw, AZ4) => {
    var uYY = 1 / 0,
        BYY = "[object Symbol]",
        mYY = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
        FYY = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
        cD6 = "\\ud800-\\udfff",
        FG4 = "\\u0300-\\u036f\\ufe20-\\ufe23",
        QG4 = "\\u20d0-\\u20f0",
        gG4 = "\\u2700-\\u27bf",
        UG4 = "a-z\\xdf-\\xf6\\xf8-\\xff",
        QYY = "\\xac\\xb1\\xd7\\xf7",
        gYY = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",
        UYY = "\\u2000-\\u206f",
        pYY = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
        pG4 = "A-Z\\xc0-\\xd6\\xd8-\\xde",
        dG4 = "\\ufe0e\\ufe0f",
        cG4 = QYY + gYY + UYY + pYY,
        jfA = "['’]",
        dYY = "[" + cD6 + "]",
        hG4 = "[" + cG4 + "]",
        dD6 = "[" + FG4 + QG4 + "]",
        lG4 = "\\d+",
        cYY = "[" + gG4 + "]",
        iG4 = "[" + UG4 + "]",
        nG4 = "[^" + cD6 + cG4 + lG4 + gG4 + UG4 + pG4 + "]",
        DfA = "\\ud83c[\\udffb-\\udfff]",
        lYY = "(?:" + dD6 + "|" + DfA + ")",
        rG4 = "[^" + cD6 + "]",
        MfA = "(?:\\ud83c[\\udde6-\\uddff]){2}",
        PfA = "[\\ud800-\\udbff][\\udc00-\\udfff]",
        iM1 = "[" + pG4 + "]",
        oG4 = "\\u200d",
        IG4 = "(?:" + iG4 + "|" + nG4 + ")",
        iYY = "(?:" + iM1 + "|" + nG4 + ")",
        xG4 = "(?:" + jfA + "(?:d|ll|m|re|s|t|ve))?",
        bG4 = "(?:" + jfA + "(?:D|LL|M|RE|S|T|VE))?",
        aG4 = lYY + "?",
        sG4 = "[" + dG4 + "]?",
        nYY = "(?:" + oG4 + "(?:" + [rG4, MfA, PfA].join("|") + ")" + sG4 + aG4 + ")*",
        tG4 = sG4 + aG4 + nYY,
        rYY = "(?:" + [cYY, MfA, PfA].join("|") + ")" + tG4,
        oYY = "(?:" + [rG4 + dD6 + "?", dD6, MfA, PfA, dYY].join("|") + ")",
        aYY = RegExp(jfA, "g"),
        sYY = RegExp(dD6, "g"),
        tYY = RegExp(DfA + "(?=" + DfA + ")|" + oYY + tG4, "g"),
        eYY = RegExp([iM1 + "?" + iG4 + "+" + xG4 + "(?=" + [hG4, iM1, "$"].join("|") + ")", iYY + "+" + bG4 + "(?=" + [hG4, iM1 + IG4, "$"].join("|") + ")", iM1 + "?" + IG4 + "+" + xG4, iM1 + "+" + bG4, lG4, rYY].join("|"), "g"),
        AzY = RegExp("[" + oG4 + cD6 + FG4 + QG4 + dG4 + "]"),
        qzY = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
        KzY = {
            "À": "A",
            "Á": "A",
            "Â": "A",
            "Ã": "A",
            "Ä": "A",
            "Å": "A",
            "à": "a",
            "á": "a",
            "â": "a",
            "ã": "a",
            "ä": "a",
            "å": "a",
            "Ç": "C",
            "ç": "c",
            "Ð": "D",
            "ð": "d",
            "È": "E",
            "É": "E",
            "Ê": "E",
            "Ë": "E",
            "è": "e",
            "é": "e",
            "ê": "e",
            "ë": "e",
            "Ì": "I",
            "Í": "I",
            "Î": "I",
            "Ï": "I",
            "ì": "i",
            "í": "i",
            "î": "i",
            "ï": "i",
            "Ñ": "N",
            "ñ": "n",
            "Ò": "O",
            "Ó": "O",
            "Ô": "O",
            "Õ": "O",
            "Ö": "O",
            "Ø": "O",
            "ò": "o",
            "ó": "o",
            "ô": "o",
            "õ": "o",
            "ö": "o",
            "ø": "o",
            "Ù": "U",
            "Ú": "U",
            "Û": "U",
            "Ü": "U",
            "ù": "u",
            "ú": "u",
            "û": "u",
            "ü": "u",
            "Ý": "Y",
            "ý": "y",
            "ÿ": "y",
            "Æ": "Ae",
            "æ": "ae",
            "Þ": "Th",
            "þ": "th",
            "ß": "ss",
            "Ā": "A",
            "Ă": "A",
            "Ą": "A",
            "ā": "a",
            "ă": "a",
            "ą": "a",
            "Ć": "C",
            "Ĉ": "C",
            "Ċ": "C",
            "Č": "C",
            "ć": "c",
            "ĉ": "c",
            "ċ": "c",
            "č": "c",
            "Ď": "D",
            "Đ": "D",
            "ď": "d",
            "đ": "d",
            "Ē": "E",
            "Ĕ": "E",
            "Ė": "E",
            "Ę": "E",
            "Ě": "E",
            "ē": "e",
            "ĕ": "e",
            "ė": "e",
            "ę": "e",
            "ě": "e",
            "Ĝ": "G",
            "Ğ": "G",
            "Ġ": "G",
            "Ģ": "G",
            "ĝ": "g",
            "ğ": "g",
            "ġ": "g",
            "ģ": "g",
            "Ĥ": "H",
            "Ħ": "H",
            "ĥ": "h",
            "ħ": "h",
            "Ĩ": "I",
            "Ī": "I",
            "Ĭ": "I",
            "Į": "I",
            "İ": "I",
            "ĩ": "i",
            "ī": "i",
            "ĭ": "i",
            "į": "i",
            "ı": "i",
            "Ĵ": "J",
            "ĵ": "j",
            "Ķ": "K",
            "ķ": "k",
            "ĸ": "k",
            "Ĺ": "L",
            "Ļ": "L",
            "Ľ": "L",
            "Ŀ": "L",
            "Ł": "L",
            "ĺ": "l",
            "ļ": "l",
            "ľ": "l",
            "ŀ": "l",
            "ł": "l",
            "Ń": "N",
            "Ņ": "N",
            "Ň": "N",
            "Ŋ": "N",
            "ń": "n",
            "ņ": "n",
            "ň": "n",
            "ŋ": "n",
            "Ō": "O",
            "Ŏ": "O",
            "Ő": "O",
            "ō": "o",
            "ŏ": "o",
            "ő": "o",
            "Ŕ": "R",
            "Ŗ": "R",
            "Ř": "R",
            "ŕ": "r",
            "ŗ": "r",
            "ř": "r",
            "Ś": "S",
            "Ŝ": "S",
            "Ş": "S",
            "Š": "S",
            "ś": "s",
            "ŝ": "s",
            "ş": "s",
            "š": "s",
            "Ţ": "T",
            "Ť": "T",
            "Ŧ": "T",
            "ţ": "t",
            "ť": "t",
            "ŧ": "t",
            "Ũ": "U",
            "Ū": "U",
            "Ŭ": "U",
            "Ů": "U",
            "Ű": "U",
            "Ų": "U",
            "ũ": "u",
            "ū": "u",
            "ŭ": "u",
            "ů": "u",
            "ű": "u",
            "ų": "u",
            "Ŵ": "W",
            "ŵ": "w",
            "Ŷ": "Y",
            "ŷ": "y",
            "Ÿ": "Y",
            "Ź": "Z",
            "Ż": "Z",
            "Ž": "Z",
            "ź": "z",
            "ż": "z",
            "ž": "z",
            "Ĳ": "IJ",
            "ĳ": "ij",
            "Œ": "Oe",
            "œ": "oe",
            "ŉ": "'n",
            "ſ": "ss"
        },
        YzY = typeof global == "object" && global && global.Object === Object && global,
        zzY = typeof self == "object" && self && self.Object === Object && self,
        wzY = YzY || zzY || Function("return this")();

    function HzY(A, q, K, Y) {
        var z = -1,
            w = A ? A.length : 0;
        if (Y && w) K = A[++z];
        while (++z < w) K = q(K, A[z], z, A);
        return K
    }

    function $zY(A) {
        return A.split("")
    }

    function OzY(A) {
        return A.match(mYY) || []
    }

    function _zY(A) {
        return function(q) {
            return A == null ? void 0 : A[q]
        }
    }
    var JzY = _zY(KzY);

    function eG4(A) {
        return AzY.test(A)
    }

    function XzY(A) {
        return qzY.test(A)
    }

    function DzY(A) {
        return eG4(A) ? jzY(A) : $zY(A)
    }

    function jzY(A) {
        return A.match(tYY) || []
    }

    function MzY(A) {
        return A.match(eYY) || []
    }
    var PzY = Object.prototype,
        WzY = PzY.toString,
        uG4 = wzY.Symbol,
        BG4 = uG4 ? uG4.prototype : void 0,
        mG4 = BG4 ? BG4.toString : void 0;

    function GzY(A, q, K) {
        var Y = -1,
            z = A.length;
        if (q < 0) q = -q > z ? 0 : z + q;
        if (K = K > z ? z : K, K < 0) K += z;
        z = q > K ? 0 : K - q >>> 0, q >>>= 0;
        var w = Array(z);
        while (++Y < z) w[Y] = A[Y + q];
        return w
    }

    function ZzY(A) {
        if (typeof A == "string") return A;
        if (vzY(A)) return mG4 ? mG4.call(A) : "";
        var q = A + "";
        return q == "0" && 1 / A == -uYY ? "-0" : q
    }

    function fzY(A, q, K) {
        var Y = A.length;
        return K = K === void 0 ? Y : K, !q && K >= Y ? A : GzY(A, q, K)
    }

    function VzY(A) {
        return function(q) {
            q = lD6(q);
            var K = eG4(q) ? DzY(q) : void 0,
                Y = K ? K[0] : q.charAt(0),
                z = K ? fzY(K, 1).join("") : q.slice(1);
            return Y[A]() + z
        }
    }

    function NzY(A) {
        return function(q) {
            return HzY(yzY(LzY(q).replace(aYY, "")), A, "")
        }
    }

    function TzY(A) {
        return !!A && typeof A == "object"
    }

    function vzY(A) {
        return typeof A == "symbol" || TzY(A) && WzY.call(A) == BYY
    }

    function lD6(A) {
        return A == null ? "" : ZzY(A)
    }
    var EzY = NzY(function(A, q, K) {
        return q = q.toLowerCase(), A + (K ? kzY(q) : q)
    });

    function kzY(A) {
        return RzY(lD6(A).toLowerCase())
    }

    function LzY(A) {
        return A = lD6(A), A && A.replace(FYY, JzY).replace(sYY, "")
    }
    var RzY = VzY("toUpperCase");

    function yzY(A, q, K) {
        if (A = lD6(A), q = K ? void 0 : q, q === void 0) return XzY(A) ? MzY(A) : OzY(A);
        return A.match(q) || []
    }
    AZ4.exports = EzY
})
// @from(Ln 288629, Col 4)
YZ4 = R((aBw, KZ4) => {
    KZ4.exports = WfA;

    function WfA(A, q) {
        if (typeof A === "string") q = A, A = void 0;
        var K = [];

        function Y(w) {
            if (typeof w !== "string") {
                var H = z();
                if (WfA.verbose) console.log("codegen: " + H);
                if (H = "return " + H, w) {
                    var $ = Object.keys(w),
                        O = Array($.length + 1),
                        _ = Array($.length),
                        J = 0;
                    while (J < $.length) O[J] = $[J], _[J] = w[$[J++]];
                    return O[J] = H, Function.apply(null, O).apply(null, _)
                }
                return Function(H)()
            }
            var X = Array(arguments.length - 1),
                D = 0;
            while (D < X.length) X[D] = arguments[++D];
            if (D = 0, w = w.replace(/%([%dfijs])/g, function(M, P) {
                    var W = X[D++];
                    switch (P) {
                        case "d":
                        case "f":
                            return String(Number(W));
                        case "i":
                            return String(Math.floor(W));
                        case "j":
                            return JSON.stringify(W);
                        case "s":
                            return String(W)
                    }
                    return "%"
                }), D !== X.length) throw Error("parameter count mismatch");
            return K.push(w), Y
        }

        function z(w) {
            return "function " + (w || q || "") + "(" + (A && A.join(",") || "") + `){
  ` + K.join(`
  `) + `
}`
        }
        return Y.toString = z, Y
    }
    WfA.verbose = !1
})
// @from(Ln 288681, Col 4)
wZ4 = R((sBw, zZ4) => {
    zZ4.exports = mm1;
    var CzY = tGA(),
        SzY = qZA(),
        GfA = SzY("fs");

    function mm1(A, q, K) {
        if (typeof q === "function") K = q, q = {};
        else if (!q) q = {};
        if (!K) return CzY(mm1, this, A, q);
        if (!q.xhr && GfA && GfA.readFile) return GfA.readFile(A, function(z, w) {
            return z && typeof XMLHttpRequest < "u" ? mm1.xhr(A, q, K) : z ? K(z) : K(null, q.binary ? w : w.toString("utf8"))
        });
        return mm1.xhr(A, q, K)
    }
    mm1.xhr = function(q, K, Y) {
        var z = new XMLHttpRequest;
        if (z.onreadystatechange = function() {
                if (z.readyState !== 4) return;
                if (z.status !== 0 && z.status !== 200) return Y(Error("status " + z.status));
                if (K.binary) {
                    var H = z.response;
                    if (!H) {
                        H = [];
                        for (var $ = 0; $ < z.responseText.length; ++$) H.push(z.responseText.charCodeAt($) & 255)
                    }
                    return Y(null, typeof Uint8Array < "u" ? new Uint8Array(H) : H)
                }
                return Y(null, z.responseText)
            }, K.binary) {
            if ("overrideMimeType" in z) z.overrideMimeType("text/plain; charset=x-user-defined");
            z.responseType = "arraybuffer"
        }
        z.open("GET", q), z.send()
    }
})
// @from(Ln 288717, Col 4)
OZ4 = R(($Z4) => {
    var ffA = $Z4,
        HZ4 = ffA.isAbsolute = function(q) {
            return /^(?:\/|\w+:)/.test(q)
        },
        ZfA = ffA.normalize = function(q) {
            q = q.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
            var K = q.split("/"),
                Y = HZ4(q),
                z = "";
            if (Y) z = K.shift() + "/";
            for (var w = 0; w < K.length;)
                if (K[w] === "..")
                    if (w > 0 && K[w - 1] !== "..") K.splice(--w, 2);
                    else if (Y) K.splice(w, 1);
            else ++w;
            else if (K[w] === ".") K.splice(w, 1);
            else ++w;
            return z + K.join("/")
        };
    ffA.resolve = function(q, K, Y) {
        if (!Y) K = ZfA(K);
        if (HZ4(K)) return K;
        if (!Y) q = ZfA(q);
        return (q = q.replace(/(?:\/|^)[^/]+$/, "")).length ? ZfA(q + "/" + K) : K
    }
})
// @from(Ln 288744, Col 4)
rM1 = R((eBw, XZ4) => {
    XZ4.exports = IY;
    var iD6 = Rs();
    ((IY.prototype = Object.create(iD6.prototype)).constructor = IY).className = "Namespace";
    var VfA = Ls(),
        nD6 = Xj(),
        hzY = y31(),
        L31, nM1, R31;
    IY.fromJSON = function(q, K) {
        return new IY(q, K.options).addJSON(K.nested)
    };

    function _Z4(A, q) {
        if (!(A && A.length)) return;
        var K = {};
        for (var Y = 0; Y < A.length; ++Y) K[A[Y].name] = A[Y].toJSON(q);
        return K
    }
    IY.arrayToJSON = _Z4;
    IY.isReservedId = function(q, K) {
        if (q) {
            for (var Y = 0; Y < q.length; ++Y)
                if (typeof q[Y] !== "string" && q[Y][0] <= K && q[Y][1] > K) return !0
        }
        return !1
    };
    IY.isReservedName = function(q, K) {
        if (q) {
            for (var Y = 0; Y < q.length; ++Y)
                if (q[Y] === K) return !0
        }
        return !1
    };

    function IY(A, q) {
        iD6.call(this, A, q), this.nested = void 0, this._nestedArray = null, this._lookupCache = {}, this._needsRecursiveFeatureResolution = !0, this._needsRecursiveResolve = !0
    }

    function JZ4(A) {
        A._nestedArray = null, A._lookupCache = {};
        var q = A;
        while (q = q.parent) q._lookupCache = {};
        return A
    }
    Object.defineProperty(IY.prototype, "nestedArray", {
        get: function() {
            return this._nestedArray || (this._nestedArray = nD6.toArray(this.nested))
        }
    });
    IY.prototype.toJSON = function(q) {
        return nD6.toObject(["options", this.options, "nested", _Z4(this.nestedArray, q)])
    };
    IY.prototype.addJSON = function(q) {
        var K = this;
        if (q)
            for (var Y = Object.keys(q), z = 0, w; z < Y.length; ++z) w = q[Y[z]], K.add((w.fields !== void 0 ? L31.fromJSON : w.values !== void 0 ? R31.fromJSON : w.methods !== void 0 ? nM1.fromJSON : w.id !== void 0 ? VfA.fromJSON : IY.fromJSON)(Y[z], w));
        return this
    };
    IY.prototype.get = function(q) {
        return this.nested && this.nested[q] || null
    };
    IY.prototype.getEnum = function(q) {
        if (this.nested && this.nested[q] instanceof R31) return this.nested[q].values;
        throw Error("no such enum: " + q)
    };
    IY.prototype.add = function(q) {
        if (!(q instanceof VfA && q.extend !== void 0 || q instanceof L31 || q instanceof hzY || q instanceof R31 || q instanceof nM1 || q instanceof IY)) throw TypeError("object must be a valid nested object");
        if (!this.nested) this.nested = {};
        else {
            var K = this.get(q.name);
            if (K)
                if (K instanceof IY && q instanceof IY && !(K instanceof L31 || K instanceof nM1)) {
                    var Y = K.nestedArray;
                    for (var z = 0; z < Y.length; ++z) q.add(Y[z]);
                    if (this.remove(K), !this.nested) this.nested = {};
                    q.setOptions(K.options, !0)
                } else throw Error("duplicate name '" + q.name + "' in " + this)
        }
        if (this.nested[q.name] = q, !(this instanceof L31 || this instanceof nM1 || this instanceof R31 || this instanceof VfA)) {
            if (!q._edition) q._edition = q._defaultEdition
        }
        this._needsRecursiveFeatureResolution = !0, this._needsRecursiveResolve = !0;
        var w = this;
        while (w = w.parent) w._needsRecursiveFeatureResolution = !0, w._needsRecursiveResolve = !0;
        return q.onAdd(this), JZ4(this)
    };
    IY.prototype.remove = function(q) {
        if (!(q instanceof iD6)) throw TypeError("object must be a ReflectionObject");
        if (q.parent !== this) throw Error(q + " is not a member of " + this);
        if (delete this.nested[q.name], !Object.keys(this.nested).length) this.nested = void 0;
        return q.onRemove(this), JZ4(this)
    };
    IY.prototype.define = function(q, K) {
        if (nD6.isString(q)) q = q.split(".");
        else if (!Array.isArray(q)) throw TypeError("illegal path");
        if (q && q.length && q[0] === "") throw Error("path must be relative");
        var Y = this;
        while (q.length > 0) {
            var z = q.shift();
            if (Y.nested && Y.nested[z]) {
                if (Y = Y.nested[z], !(Y instanceof IY)) throw Error("path conflicts with non-namespace objects")
            } else Y.add(Y = new IY(z))
        }
        if (K) Y.addJSON(K);
        return Y
    };
    IY.prototype.resolveAll = function() {
        if (!this._needsRecursiveResolve) return this;
        this._resolveFeaturesRecursive(this._edition);
        var q = this.nestedArray,
            K = 0;
        this.resolve();
        while (K < q.length)
            if (q[K] instanceof IY) q[K++].resolveAll();
            else q[K++].resolve();
        return this._needsRecursiveResolve = !1, this
    };
    IY.prototype._resolveFeaturesRecursive = function(q) {
        if (!this._needsRecursiveFeatureResolution) return this;
        return this._needsRecursiveFeatureResolution = !1, q = this._edition || q, iD6.prototype._resolveFeaturesRecursive.call(this, q), this.nestedArray.forEach((K) => {
            K._resolveFeaturesRecursive(q)
        }), this
    };
    IY.prototype.lookup = function(q, K, Y) {
        if (typeof K === "boolean") Y = K, K = void 0;
        else if (K && !Array.isArray(K)) K = [K];
        if (nD6.isString(q) && q.length) {
            if (q === ".") return this.root;
            q = q.split(".")
        } else if (!q.length) return this;
        var z = q.join(".");
        if (q[0] === "") return this.root.lookup(q.slice(1), K);
        var w = this.root._fullyQualifiedObjects && this.root._fullyQualifiedObjects["." + z];
        if (w && (!K || K.indexOf(w.constructor) > -1)) return w;
        if (w = this._lookupImpl(q, z), w && (!K || K.indexOf(w.constructor) > -1)) return w;
        if (Y) return null;
        var H = this;
        while (H.parent) {
            if (w = H.parent._lookupImpl(q, z), w && (!K || K.indexOf(w.constructor) > -1)) return w;
            H = H.parent
        }
        return null
    };
    IY.prototype._lookupImpl = function(q, K) {
        if (Object.prototype.hasOwnProperty.call(this._lookupCache, K)) return this._lookupCache[K];
        var Y = this.get(q[0]),
            z = null;
        if (Y) {
            if (q.length === 1) z = Y;
            else if (Y instanceof IY) q = q.slice(1), z = Y._lookupImpl(q, q.join("."))
        } else
            for (var w = 0; w < this.nestedArray.length; ++w)
                if (this._nestedArray[w] instanceof IY && (Y = this._nestedArray[w]._lookupImpl(q, K))) z = Y;
        return this._lookupCache[K] = z, z
    };
    IY.prototype.lookupType = function(q) {
        var K = this.lookup(q, [L31]);
        if (!K) throw Error("no such type: " + q);
        return K
    };
    IY.prototype.lookupEnum = function(q) {
        var K = this.lookup(q, [R31]);
        if (!K) throw Error("no such Enum '" + q + "' in " + this);
        return K
    };
    IY.prototype.lookupTypeOrEnum = function(q) {
        var K = this.lookup(q, [L31, R31]);
        if (!K) throw Error("no such Type or Enum '" + q + "' in " + this);
        return K
    };
    IY.prototype.lookupService = function(q) {
        var K = this.lookup(q, [nM1]);
        if (!K) throw Error("no such Service '" + q + "' in " + this);
        return K
    };
    IY._configure = function(A, q, K) {
        L31 = A, nM1 = q, R31 = K
    }
})
// @from(Ln 288923, Col 4)
rD6 = R((Amw, DZ4) => {
    DZ4.exports = Hd;
    var NfA = Ls();
    ((Hd.prototype = Object.create(NfA.prototype)).constructor = Hd).className = "MapField";
    var IzY = C31(),
        Fm1 = Xj();

    function Hd(A, q, K, Y, z, w) {
        if (NfA.call(this, A, q, Y, void 0, void 0, z, w), !Fm1.isString(K)) throw TypeError("keyType must be a string");
        this.keyType = K, this.resolvedKeyType = null, this.map = !0
    }
    Hd.fromJSON = function(q, K) {
        return new Hd(q, K.id, K.keyType, K.type, K.options, K.comment)
    };
    Hd.prototype.toJSON = function(q) {
        var K = q ? Boolean(q.keepComments) : !1;
        return Fm1.toObject(["keyType", this.keyType, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", K ? this.comment : void 0])
    };
    Hd.prototype.resolve = function() {
        if (this.resolved) return this;
        if (IzY.mapKey[this.keyType] === void 0) throw Error("invalid key type: " + this.keyType);
        return NfA.prototype.resolve.call(this)
    };
    Hd.d = function(q, K, Y) {
        if (typeof Y === "function") Y = Fm1.decorateType(Y).name;
        else if (Y && typeof Y === "object") Y = Fm1.decorateEnum(Y).name;
        return function(w, H) {
            Fm1.decorateType(w.constructor).add(new Hd(H, q, K, Y))
        }
    }
})
// @from(Ln 288954, Col 4)
oD6 = R((qmw, jZ4) => {
    jZ4.exports = S31;
    var TfA = Rs();
    ((S31.prototype = Object.create(TfA.prototype)).constructor = S31).className = "Method";
    var oM1 = Xj();

    function S31(A, q, K, Y, z, w, H, $, O) {
        if (oM1.isObject(z)) H = z, z = w = void 0;
        else if (oM1.isObject(w)) H = w, w = void 0;
        if (!(q === void 0 || oM1.isString(q))) throw TypeError("type must be a string");
        if (!oM1.isString(K)) throw TypeError("requestType must be a string");
        if (!oM1.isString(Y)) throw TypeError("responseType must be a string");
        TfA.call(this, A, H), this.type = q || "rpc", this.requestType = K, this.requestStream = z ? !0 : void 0, this.responseType = Y, this.responseStream = w ? !0 : void 0, this.resolvedRequestType = null, this.resolvedResponseType = null, this.comment = $, this.parsedOptions = O
    }
    S31.fromJSON = function(q, K) {
        return new S31(q, K.type, K.requestType, K.responseType, K.requestStream, K.responseStream, K.options, K.comment, K.parsedOptions)
    };
    S31.prototype.toJSON = function(q) {
        var K = q ? Boolean(q.keepComments) : !1;
        return oM1.toObject(["type", this.type !== "rpc" && this.type || void 0, "requestType", this.requestType, "requestStream", this.requestStream, "responseType", this.responseType, "responseStream", this.responseStream, "options", this.options, "comment", K ? this.comment : void 0, "parsedOptions", this.parsedOptions])
    };
    S31.prototype.resolve = function() {
        if (this.resolved) return this;
        return this.resolvedRequestType = this.parent.lookupType(this.requestType), this.resolvedResponseType = this.parent.lookupType(this.responseType), TfA.prototype.resolve.call(this)
    }
})
// @from(Ln 288980, Col 4)
aD6 = R((Kmw, PZ4) => {
    PZ4.exports = mv;
    var $d = rM1();
    ((mv.prototype = Object.create($d.prototype)).constructor = mv).className = "Service";
    var vfA = oD6(),
        Qm1 = Xj(),
        xzY = jZA();

    function mv(A, q) {
        $d.call(this, A, q), this.methods = {}, this._methodsArray = null
    }
    mv.fromJSON = function(q, K) {
        var Y = new mv(q, K.options);
        if (K.methods)
            for (var z = Object.keys(K.methods), w = 0; w < z.length; ++w) Y.add(vfA.fromJSON(z[w], K.methods[z[w]]));
        if (K.nested) Y.addJSON(K.nested);
        if (K.edition) Y._edition = K.edition;
        return Y.comment = K.comment, Y._defaultEdition = "proto3", Y
    };
    mv.prototype.toJSON = function(q) {
        var K = $d.prototype.toJSON.call(this, q),
            Y = q ? Boolean(q.keepComments) : !1;
        return Qm1.toObject(["edition", this._editionToJSON(), "options", K && K.options || void 0, "methods", $d.arrayToJSON(this.methodsArray, q) || {}, "nested", K && K.nested || void 0, "comment", Y ? this.comment : void 0])
    };
    Object.defineProperty(mv.prototype, "methodsArray", {
        get: function() {
            return this._methodsArray || (this._methodsArray = Qm1.toArray(this.methods))
        }
    });

    function MZ4(A) {
        return A._methodsArray = null, A
    }
    mv.prototype.get = function(q) {
        return this.methods[q] || $d.prototype.get.call(this, q)
    };
    mv.prototype.resolveAll = function() {
        if (!this._needsRecursiveResolve) return this;
        $d.prototype.resolve.call(this);
        var q = this.methodsArray;
        for (var K = 0; K < q.length; ++K) q[K].resolve();
        return this
    };
    mv.prototype._resolveFeaturesRecursive = function(q) {
        if (!this._needsRecursiveFeatureResolution) return this;
        return q = this._edition || q, $d.prototype._resolveFeaturesRecursive.call(this, q), this.methodsArray.forEach((K) => {
            K._resolveFeaturesRecursive(q)
        }), this
    };
    mv.prototype.add = function(q) {
        if (this.get(q.name)) throw Error("duplicate name '" + q.name + "' in " + this);
        if (q instanceof vfA) return this.methods[q.name] = q, q.parent = this, MZ4(this);
        return $d.prototype.add.call(this, q)
    };
    mv.prototype.remove = function(q) {
        if (q instanceof vfA) {
            if (this.methods[q.name] !== q) throw Error(q + " is not a member of " + this);
            return delete this.methods[q.name], q.parent = null, MZ4(this)
        }
        return $d.prototype.remove.call(this, q)
    };
    mv.prototype.create = function(q, K, Y) {
        var z = new xzY.Service(q, K, Y);
        for (var w = 0, H; w < this.methodsArray.length; ++w) {
            var $ = Qm1.lcFirst((H = this._methodsArray[w]).resolve().name).replace(/[^$\w_]/g, "");
            z[$] = Qm1.codegen(["r", "c"], Qm1.isReserved($) ? $ + "_" : $)("return this.rpcCall(m,q,s,r,c)")({
                m: H,
                q: H.resolvedRequestType.ctor,
                s: H.resolvedResponseType.ctor
            })
        }
        return z
    }
})
// @from(Ln 289054, Col 4)
sD6 = R((Ymw, WZ4) => {
    WZ4.exports = wm;
    var bzY = Am();

    function wm(A) {
        if (A)
            for (var q = Object.keys(A), K = 0; K < q.length; ++K) this[q[K]] = A[q[K]]
    }
    wm.create = function(q) {
        return this.$type.create(q)
    };
    wm.encode = function(q, K) {
        return this.$type.encode(q, K)
    };
    wm.encodeDelimited = function(q, K) {
        return this.$type.encodeDelimited(q, K)
    };
    wm.decode = function(q) {
        return this.$type.decode(q)
    };
    wm.decodeDelimited = function(q) {
        return this.$type.decodeDelimited(q)
    };
    wm.verify = function(q) {
        return this.$type.verify(q)
    };
    wm.fromObject = function(q) {
        return this.$type.fromObject(q)
    };
    wm.toObject = function(q, K) {
        return this.$type.toObject(q, K)
    };
    wm.prototype.toJSON = function() {
        return this.$type.toObject(this, bzY.toJSONOptions)
    }
})
// @from(Ln 289090, Col 4)
EfA = R((zmw, ZZ4) => {
    ZZ4.exports = mzY;
    var uzY = rh(),
        Od = C31(),
        GZ4 = Xj();

    function BzY(A) {
        return "missing required '" + A.name + "'"
    }

    function mzY(A) {
        var q = GZ4.codegen(["r", "l", "e"], A.name + "$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (A.fieldsArray.filter(function($) {
                return $.map
            }).length ? ",k,value" : ""))("while(r.pos<c){")("var t=r.uint32()")("if(t===e)")("break")("switch(t>>>3){"),
            K = 0;
        for (; K < A.fieldsArray.length; ++K) {
            var Y = A._fieldsArray[K].resolve(),
                z = Y.resolvedType instanceof uzY ? "int32" : Y.type,
                w = "m" + GZ4.safeProp(Y.name);
            if (q("case %i: {", Y.id), Y.map) {
                if (q("if(%s===util.emptyObject)", w)("%s={}", w)("var c2 = r.uint32()+r.pos"), Od.defaults[Y.keyType] !== void 0) q("k=%j", Od.defaults[Y.keyType]);
                else q("k=null");
                if (Od.defaults[z] !== void 0) q("value=%j", Od.defaults[z]);
                else q("value=null");
                if (q("while(r.pos<c2){")("var tag2=r.uint32()")("switch(tag2>>>3){")("case 1: k=r.%s(); break", Y.keyType)("case 2:"), Od.basic[z] === void 0) q("value=types[%i].decode(r,r.uint32())", K);
                else q("value=r.%s()", z);
                if (q("break")("default:")("r.skipType(tag2&7)")("break")("}")("}"), Od.long[Y.keyType] !== void 0) q('%s[typeof k==="object"?util.longToHash(k):k]=value', w);
                else q("%s[k]=value", w)
            } else if (Y.repeated) {
                if (q("if(!(%s&&%s.length))", w, w)("%s=[]", w), Od.packed[z] !== void 0) q("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())", w, z)("}else");
                if (Od.basic[z] === void 0) q(Y.delimited ? "%s.push(types[%i].decode(r,undefined,((t&~7)|4)))" : "%s.push(types[%i].decode(r,r.uint32()))", w, K);
                else q("%s.push(r.%s())", w, z)
            } else if (Od.basic[z] === void 0) q(Y.delimited ? "%s=types[%i].decode(r,undefined,((t&~7)|4))" : "%s=types[%i].decode(r,r.uint32())", w, K);
            else q("%s=r.%s()", w, z);
            q("break")("}")
        }
        q("default:")("r.skipType(t&7)")("break")("}")("}");
        for (K = 0; K < A._fieldsArray.length; ++K) {
            var H = A._fieldsArray[K];
            if (H.required) q("if(!m.hasOwnProperty(%j))", H.name)("throw util.ProtocolError(%j,{instance:m})", BzY(H))
        }
        return q("return m")
    }
})
// @from(Ln 289134, Col 4)
RfA = R((wmw, fZ4) => {
    fZ4.exports = gzY;
    var FzY = rh(),
        kfA = Xj();

    function BR(A, q) {
        return A.name + ": " + q + (A.repeated && q !== "array" ? "[]" : A.map && q !== "object" ? "{k:" + A.keyType + "}" : "") + " expected"
    }

    function LfA(A, q, K, Y) {
        if (q.resolvedType)
            if (q.resolvedType instanceof FzY) {
                A("switch(%s){", Y)("default:")("return%j", BR(q, "enum value"));
                for (var z = Object.keys(q.resolvedType.values), w = 0; w < z.length; ++w) A("case %i:", q.resolvedType.values[z[w]]);
                A("break")("}")
            } else A("{")("var e=types[%i].verify(%s);", K, Y)("if(e)")("return%j+e", q.name + ".")("}");
        else switch (q.type) {
            case "int32":
            case "uint32":
            case "sint32":
            case "fixed32":
            case "sfixed32":
                A("if(!util.isInteger(%s))", Y)("return%j", BR(q, "integer"));
                break;
            case "int64":
            case "uint64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
                A("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", Y, Y, Y, Y)("return%j", BR(q, "integer|Long"));
                break;
            case "float":
            case "double":
                A('if(typeof %s!=="number")', Y)("return%j", BR(q, "number"));
                break;
            case "bool":
                A('if(typeof %s!=="boolean")', Y)("return%j", BR(q, "boolean"));
                break;
            case "string":
                A("if(!util.isString(%s))", Y)("return%j", BR(q, "string"));
                break;
            case "bytes":
                A('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))', Y, Y, Y)("return%j", BR(q, "buffer"));
                break
        }
        return A
    }

    function QzY(A, q, K) {
        switch (q.keyType) {
            case "int32":
            case "uint32":
            case "sint32":
            case "fixed32":
            case "sfixed32":
                A("if(!util.key32Re.test(%s))", K)("return%j", BR(q, "integer key"));
                break;
            case "int64":
            case "uint64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
                A("if(!util.key64Re.test(%s))", K)("return%j", BR(q, "integer|Long key"));
                break;
            case "bool":
                A("if(!util.key2Re.test(%s))", K)("return%j", BR(q, "boolean key"));
                break
        }
        return A
    }

    function gzY(A) {
        var q = kfA.codegen(["m"], A.name + "$verify")('if(typeof m!=="object"||m===null)')("return%j", "object expected"),
            K = A.oneofsArray,
            Y = {};
        if (K.length) q("var p={}");
        for (var z = 0; z < A.fieldsArray.length; ++z) {
            var w = A._fieldsArray[z].resolve(),
                H = "m" + kfA.safeProp(w.name);
            if (w.optional) q("if(%s!=null&&m.hasOwnProperty(%j)){", H, w.name);
            if (w.map) q("if(!util.isObject(%s))", H)("return%j", BR(w, "object"))("var k=Object.keys(%s)", H)("for(var i=0;i<k.length;++i){"), QzY(q, w, "k[i]"), LfA(q, w, z, H + "[k[i]]")("}");
            else if (w.repeated) q("if(!Array.isArray(%s))", H)("return%j", BR(w, "array"))("for(var i=0;i<%s.length;++i){", H), LfA(q, w, z, H + "[i]")("}");
            else {
                if (w.partOf) {
                    var $ = kfA.safeProp(w.partOf.name);
                    if (Y[w.partOf.name] === 1) q("if(p%s===1)", $)("return%j", w.partOf.name + ": multiple values");
                    Y[w.partOf.name] = 1, q("p%s=1", $)
                }
                LfA(q, w, z, H)
            }
            if (w.optional) q("}")
        }
        return q("return null")
    }
})