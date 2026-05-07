
// @from(Ln 308197, Col 4)
c6K = p((Q6K) => {
    Object.defineProperty(Q6K, "__esModule", {
        value: !0
    });
    Q6K.ResolvingLoadBalancer = void 0;
    var ymz = y36(),
        Lmz = yt1(),
        Cy = ik(),
        F6K = GF(),
        l78 = Mt(),
        hmz = ZS6(),
        Lt1 = e_(),
        Rmz = QD(),
        Smz = o2(),
        Cmz = e_(),
        bmz = nk(),
        Imz = dm8(),
        xmz = "resolving_load_balancer";

    function g6K(q) {
        Smz.trace(Cmz.LogVerbosity.DEBUG, xmz, q)
    }
    var umz = ["SERVICE_AND_METHOD", "SERVICE", "EMPTY"];

    function mmz(q, K, _, z) {
        for (let Y of _.name) switch (z) {
            case "EMPTY":
                if (!Y.service && !Y.method) return !0;
                break;
            case "SERVICE":
                if (Y.service === q && !Y.method) return !0;
                break;
            case "SERVICE_AND_METHOD":
                if (Y.service === q && Y.method === K) return !0
        }
        return !1
    }

    function Bmz(q, K, _, z) {
        for (let Y of _)
            if (mmz(q, K, Y, z)) return Y;
        return null
    }

    function pmz(q) {
        return {
            invoke(K, _) {
                var z, Y;
                let A = K.split("/").filter(($) => $.length > 0),
                    O = (z = A[0]) !== null && z !== void 0 ? z : "",
                    w = (Y = A[1]) !== null && Y !== void 0 ? Y : "";
                if (q && q.methodConfig)
                    for (let $ of umz) {
                        let j = Bmz(O, w, q.methodConfig, $);
                        if (j) return {
                            methodConfig: j,
                            pickInformation: {},
                            status: Lt1.Status.OK,
                            dynamicFilterFactories: []
                        }
                    }
                return {
                    methodConfig: {
                        name: []
                    },
                    pickInformation: {},
                    status: Lt1.Status.OK,
                    dynamicFilterFactories: []
                }
            },
            unref() {}
        }
    }
    class U6K {
        constructor(q, K, _, z, Y) {
            if (this.target = q, this.channelControlHelper = K, this.channelOptions = _, this.onSuccessfulResolution = z, this.onFailedResolution = Y, this.latestChildState = Cy.ConnectivityState.IDLE, this.latestChildPicker = new l78.QueuePicker(this), this.latestChildErrorMessage = null, this.currentState = Cy.ConnectivityState.IDLE, this.previousServiceConfig = null, this.continueResolving = !1, _["grpc.service_config"]) this.defaultServiceConfig = (0, Lmz.validateServiceConfig)(JSON.parse(_["grpc.service_config"]));
            else this.defaultServiceConfig = {
                loadBalancingConfig: [],
                methodConfig: []
            };
            this.updateState(Cy.ConnectivityState.IDLE, new l78.QueuePicker(this), null), this.childLoadBalancer = new Imz.ChildLoadBalancerHandler({
                createSubchannel: K.createSubchannel.bind(K),
                requestReresolution: () => {
                    if (this.backoffTimeout.isRunning()) g6K("requestReresolution delayed by backoff timer until " + this.backoffTimeout.getEndTime().toISOString()), this.continueResolving = !0;
                    else this.updateResolution()
                },
                updateState: (O, w, $) => {
                    this.latestChildState = O, this.latestChildPicker = w, this.latestChildErrorMessage = $, this.updateState(O, w, $)
                },
                addChannelzChild: K.addChannelzChild.bind(K),
                removeChannelzChild: K.removeChannelzChild.bind(K)
            }), this.innerResolver = (0, F6K.createResolver)(q, this.handleResolverResult.bind(this), _);
            let A = {
                initialDelay: _["grpc.initial_reconnect_backoff_ms"],
                maxDelay: _["grpc.max_reconnect_backoff_ms"]
            };
            this.backoffTimeout = new hmz.BackoffTimeout(() => {
                if (this.continueResolving) this.updateResolution(), this.continueResolving = !1;
                else this.updateState(this.latestChildState, this.latestChildPicker, this.latestChildErrorMessage)
            }, A), this.backoffTimeout.unref()
        }
        handleResolverResult(q, K, _, z) {
            var Y, A;
            this.backoffTimeout.stop(), this.backoffTimeout.reset();
            let O = !0,
                w = null;
            if (_ === null) w = this.defaultServiceConfig;
            else if (_.ok) w = _.value;
            else if (this.previousServiceConfig !== null) w = this.previousServiceConfig;
            else O = !1, this.handleResolutionFailure(_.error);
            if (w !== null) {
                let $ = (Y = w === null || w === void 0 ? void 0 : w.loadBalancingConfig) !== null && Y !== void 0 ? Y : [],
                    j = (0, ymz.selectLbConfigFromList)($, !0);
                if (j === null) O = !1, this.handleResolutionFailure({
                    code: Lt1.Status.UNAVAILABLE,
                    details: "All load balancer options in service config are not compatible",
                    metadata: new Rmz.Metadata
                });
                else O = this.childLoadBalancer.updateAddressList(q, j, Object.assign(Object.assign({}, this.channelOptions), K), z)
            }
            if (O) this.onSuccessfulResolution(w, (A = K[F6K.CHANNEL_ARGS_CONFIG_SELECTOR_KEY]) !== null && A !== void 0 ? A : pmz(w));
            return O
        }
        updateResolution() {
            if (this.innerResolver.updateResolution(), this.currentState === Cy.ConnectivityState.IDLE) this.updateState(Cy.ConnectivityState.CONNECTING, this.latestChildPicker, this.latestChildErrorMessage);
            this.backoffTimeout.runOnce()
        }
        updateState(q, K, _) {
            if (g6K((0, bmz.uriToString)(this.target) + " " + Cy.ConnectivityState[this.currentState] + " -> " + Cy.ConnectivityState[q]), q === Cy.ConnectivityState.IDLE) K = new l78.QueuePicker(this, K);
            this.currentState = q, this.channelControlHelper.updateState(q, K, _)
        }
        handleResolutionFailure(q) {
            if (this.latestChildState === Cy.ConnectivityState.IDLE) this.updateState(Cy.ConnectivityState.TRANSIENT_FAILURE, new l78.UnavailablePicker(q), q.details), this.onFailedResolution(q)
        }
        exitIdle() {
            if (this.currentState === Cy.ConnectivityState.IDLE || this.currentState === Cy.ConnectivityState.TRANSIENT_FAILURE)
                if (this.backoffTimeout.isRunning()) this.continueResolving = !0;
                else this.updateResolution();
            this.childLoadBalancer.exitIdle()
        }
        updateAddressList(q, K) {
            throw Error("updateAddressList not supported on ResolvingLoadBalancer")
        }
        resetBackoff() {
            this.backoffTimeout.reset(), this.childLoadBalancer.resetBackoff()
        }
        destroy() {
            this.childLoadBalancer.destroy(), this.innerResolver.destroy(), this.backoffTimeout.reset(), this.backoffTimeout.stop(), this.latestChildState = Cy.ConnectivityState.IDLE, this.latestChildPicker = new l78.QueuePicker(this), this.currentState = Cy.ConnectivityState.IDLE, this.previousServiceConfig = null, this.continueResolving = !1
        }
        getTypeName() {
            return "resolving_load_balancer"
        }
    }
    Q6K.ResolvingLoadBalancer = U6K
})
// @from(Ln 308352, Col 4)
i6K = p((l6K) => {
    Object.defineProperty(l6K, "__esModule", {
        value: !0
    });
    l6K.recognizedOptions = void 0;
    l6K.channelOptionsEqual = Fmz;
    l6K.recognizedOptions = {
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

    function Fmz(q, K) {
        let _ = Object.keys(q).sort(),
            z = Object.keys(K).sort();
        if (_.length !== z.length) return !1;
        for (let Y = 0; Y < _.length; Y += 1) {
            if (_[Y] !== z[Y]) return !1;
            if (q[_[Y]] !== K[z[Y]]) return !1
        }
        return !0
    }
})
// @from(Ln 308402, Col 4)
by = p((t6K) => {
    Object.defineProperty(t6K, "__esModule", {
        value: !0
    });
    t6K.EndpointMap = void 0;
    t6K.isTcpSubchannelAddress = i78;
    t6K.subchannelAddressEqual = cm8;
    t6K.subchannelAddressToString = o6K;
    t6K.stringToSubchannelAddress = Qmz;
    t6K.endpointEqual = dmz;
    t6K.endpointToString = cmz;
    t6K.endpointHasAddress = a6K;
    var r6K = d6("net");

    function i78(q) {
        return "port" in q
    }

    function cm8(q, K) {
        if (!q && !K) return !0;
        if (!q || !K) return !1;
        if (i78(q)) return i78(K) && q.host === K.host && q.port === K.port;
        else return !i78(K) && q.path === K.path
    }

    function o6K(q) {
        if (i78(q))
            if ((0, r6K.isIPv6)(q.host)) return "[" + q.host + "]:" + q.port;
            else return q.host + ":" + q.port;
        else return q.path
    }
    var Umz = 443;

    function Qmz(q, K) {
        if ((0, r6K.isIP)(q)) return {
            host: q,
            port: K !== null && K !== void 0 ? K : Umz
        };
        else return {
            path: q
        }
    }

    function dmz(q, K) {
        if (q.addresses.length !== K.addresses.length) return !1;
        for (let _ = 0; _ < q.addresses.length; _++)
            if (!cm8(q.addresses[_], K.addresses[_])) return !1;
        return !0
    }

    function cmz(q) {
        return "[" + q.addresses.map(o6K).join(", ") + "]"
    }

    function a6K(q, K) {
        for (let _ of q.addresses)
            if (cm8(_, K)) return !0;
        return !1
    }

    function n78(q, K) {
        if (q.addresses.length !== K.addresses.length) return !1;
        for (let _ of q.addresses) {
            let z = !1;
            for (let Y of K.addresses)
                if (cm8(_, Y)) {
                    z = !0;
                    break
                } if (!z) return !1
        }
        return !0
    }
    class s6K {
        constructor() {
            this.map = new Set
        }
        get size() {
            return this.map.size
        }
        getForSubchannelAddress(q) {
            for (let K of this.map)
                if (a6K(K.key, q)) return K.value;
            return
        }
        deleteMissing(q) {
            let K = [];
            for (let _ of this.map) {
                let z = !1;
                for (let Y of q)
                    if (n78(Y, _.key)) z = !0;
                if (!z) K.push(_.value), this.map.delete(_)
            }
            return K
        }
        get(q) {
            for (let K of this.map)
                if (n78(q, K.key)) return K.value;
            return
        }
        set(q, K) {
            for (let _ of this.map)
                if (n78(q, _.key)) {
                    _.value = K;
                    return
                } this.map.add({
                key: q,
                value: K
            })
        }
        delete(q) {
            for (let K of this.map)
                if (n78(q, K.key)) {
                    this.map.delete(K);
                    return
                }
        }
        has(q) {
            for (let K of this.map)
                if (n78(q, K.key)) return !0;
            return !1
        }
        clear() {
            this.map.clear()
        }* keys() {
            for (let q of this.map) yield q.key
        }* values() {
            for (let q of this.map) yield q.value
        }* entries() {
            for (let q of this.map) yield [q.key, q.value]
        }
    }
    t6K.EndpointMap = s6K
})
// @from(Ln 308535, Col 4)
$8K = p((w8K) => {
    Object.defineProperty(w8K, "t", {
        value: !0
    });
    class ht1 {
        constructor(q, K, _ = 1) {
            this.i = void 0, this.h = void 0, this.o = void 0, this.u = q, this.l = K, this.p = _
        }
        I() {
            let q = this,
                K = q.o.o === q;
            if (K && q.p === 1) q = q.h;
            else if (q.i) {
                q = q.i;
                while (q.h) q = q.h
            } else {
                if (K) return q.o;
                let _ = q.o;
                while (_.i === q) q = _, _ = q.o;
                q = _
            }
            return q
        }
        B() {
            let q = this;
            if (q.h) {
                q = q.h;
                while (q.i) q = q.i;
                return q
            } else {
                let K = q.o;
                while (K.h === q) q = K, K = q.o;
                if (q.h !== K) return K;
                else return q
            }
        }
        _() {
            let q = this.o,
                K = this.h,
                _ = K.i;
            if (q.o === this) q.o = K;
            else if (q.i === this) q.i = K;
            else q.h = K;
            if (K.o = q, K.i = this, this.o = K, this.h = _, _) _.o = this;
            return K
        }
        g() {
            let q = this.o,
                K = this.i,
                _ = K.h;
            if (q.o === this) q.o = K;
            else if (q.i === this) q.i = K;
            else q.h = K;
            if (K.o = q, K.h = this, this.o = K, this.i = _, _) _.o = this;
            return K
        }
    }
    class q8K extends ht1 {
        constructor() {
            super(...arguments);
            this.M = 1
        }
        _() {
            let q = super._();
            return this.O(), q.O(), q
        }
        g() {
            let q = super.g();
            return this.O(), q.O(), q
        }
        O() {
            if (this.M = 1, this.i) this.M += this.i.M;
            if (this.h) this.M += this.h.M
        }
    }
    class K8K {
        constructor(q = 0) {
            this.iteratorType = q
        }
        equals(q) {
            return this.T === q.T
        }
    }
    class _8K {
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
    class z8K extends _8K {}

    function lJ6() {
        throw RangeError("Iterator access denied!")
    }
    class Y8K extends z8K {
        constructor(q = function(_, z) {
            if (_ < z) return -1;
            if (_ > z) return 1;
            return 0
        }, K = !1) {
            super();
            this.v = void 0, this.A = q, this.enableIndex = K, this.N = K ? q8K : ht1, this.C = new this.N
        }
        R(q, K) {
            let _ = this.C;
            while (q) {
                let z = this.A(q.u, K);
                if (z < 0) q = q.h;
                else if (z > 0) _ = q, q = q.i;
                else return q
            }
            return _
        }
        K(q, K) {
            let _ = this.C;
            while (q)
                if (this.A(q.u, K) <= 0) q = q.h;
                else _ = q, q = q.i;
            return _
        }
        L(q, K) {
            let _ = this.C;
            while (q) {
                let z = this.A(q.u, K);
                if (z < 0) _ = q, q = q.h;
                else if (z > 0) q = q.i;
                else return q
            }
            return _
        }
        k(q, K) {
            let _ = this.C;
            while (q)
                if (this.A(q.u, K) < 0) _ = q, q = q.h;
                else q = q.i;
            return _
        }
        P(q) {
            while (!0) {
                let K = q.o;
                if (K === this.C) return;
                if (q.p === 1) {
                    q.p = 0;
                    return
                }
                if (q === K.i) {
                    let _ = K.h;
                    if (_.p === 1)
                        if (_.p = 0, K.p = 1, K === this.v) this.v = K._();
                        else K._();
                    else if (_.h && _.h.p === 1) {
                        if (_.p = K.p, K.p = 0, _.h.p = 0, K === this.v) this.v = K._();
                        else K._();
                        return
                    } else if (_.i && _.i.p === 1) _.p = 1, _.i.p = 0, _.g();
                    else _.p = 1, q = K
                } else {
                    let _ = K.i;
                    if (_.p === 1)
                        if (_.p = 0, K.p = 1, K === this.v) this.v = K.g();
                        else K.g();
                    else if (_.i && _.i.p === 1) {
                        if (_.p = K.p, K.p = 0, _.i.p = 0, K === this.v) this.v = K.g();
                        else K.g();
                        return
                    } else if (_.h && _.h.p === 1) _.p = 1, _.h.p = 0, _._();
                    else _.p = 1, q = K
                }
            }
        }
        S(q) {
            if (this.m === 1) {
                this.clear();
                return
            }
            let K = q;
            while (K.i || K.h) {
                if (K.h) {
                    K = K.h;
                    while (K.i) K = K.i
                } else K = K.i;
                let z = q.u;
                q.u = K.u, K.u = z;
                let Y = q.l;
                q.l = K.l, K.l = Y, q = K
            }
            if (this.C.i === K) this.C.i = K.o;
            else if (this.C.h === K) this.C.h = K.o;
            this.P(K);
            let _ = K.o;
            if (K === _.i) _.i = void 0;
            else _.h = void 0;
            if (this.m -= 1, this.v.p = 0, this.enableIndex)
                while (_ !== this.C) _.M -= 1, _ = _.o
        }
        U(q) {
            let K = typeof q === "number" ? q : void 0,
                _ = typeof q === "function" ? q : void 0,
                z = typeof q > "u" ? [] : void 0,
                Y = 0,
                A = this.v,
                O = [];
            while (O.length || A)
                if (A) O.push(A), A = A.i;
                else {
                    if (A = O.pop(), Y === K) return A;
                    z && z.push(A), _ && _(A, Y, this), Y += 1, A = A.h
                } return z
        }
        j(q) {
            while (!0) {
                let K = q.o;
                if (K.p === 0) return;
                let _ = K.o;
                if (K === _.i) {
                    let z = _.h;
                    if (z && z.p === 1) {
                        if (z.p = K.p = 0, _ === this.v) return;
                        _.p = 1, q = _;
                        continue
                    } else if (q === K.h) {
                        if (q.p = 0, q.i) q.i.o = K;
                        if (q.h) q.h.o = _;
                        if (K.h = q.i, _.i = q.h, q.i = K, q.h = _, _ === this.v) this.v = q, this.C.o = q;
                        else {
                            let Y = _.o;
                            if (Y.i === _) Y.i = q;
                            else Y.h = q
                        }
                        q.o = _.o, K.o = q, _.o = q, _.p = 1
                    } else {
                        if (K.p = 0, _ === this.v) this.v = _.g();
                        else _.g();
                        _.p = 1;
                        return
                    }
                } else {
                    let z = _.i;
                    if (z && z.p === 1) {
                        if (z.p = K.p = 0, _ === this.v) return;
                        _.p = 1, q = _;
                        continue
                    } else if (q === K.i) {
                        if (q.p = 0, q.i) q.i.o = _;
                        if (q.h) q.h.o = K;
                        if (_.h = q.i, K.i = q.h, q.i = _, q.h = K, _ === this.v) this.v = q, this.C.o = q;
                        else {
                            let Y = _.o;
                            if (Y.i === _) Y.i = q;
                            else Y.h = q
                        }
                        q.o = _.o, K.o = q, _.o = q, _.p = 1
                    } else {
                        if (K.p = 0, _ === this.v) this.v = _._();
                        else _._();
                        _.p = 1;
                        return
                    }
                }
                if (this.enableIndex) K.O(), _.O(), q.O();
                return
            }
        }
        q(q, K, _) {
            if (this.v === void 0) return this.m += 1, this.v = new this.N(q, K, 0), this.v.o = this.C, this.C.o = this.C.i = this.C.h = this.v, this.m;
            let z, Y = this.C.i,
                A = this.A(Y.u, q);
            if (A === 0) return Y.l = K, this.m;
            else if (A > 0) Y.i = new this.N(q, K), Y.i.o = Y, z = Y.i, this.C.i = z;
            else {
                let O = this.C.h,
                    w = this.A(O.u, q);
                if (w === 0) return O.l = K, this.m;
                else if (w < 0) O.h = new this.N(q, K), O.h.o = O, z = O.h, this.C.h = z;
                else {
                    if (_ !== void 0) {
                        let $ = _.T;
                        if ($ !== this.C) {
                            let j = this.A($.u, q);
                            if (j === 0) return $.l = K, this.m;
                            else if (j > 0) {
                                let H = $.I(),
                                    J = this.A(H.u, q);
                                if (J === 0) return H.l = K, this.m;
                                else if (J < 0)
                                    if (z = new this.N(q, K), H.h === void 0) H.h = z, z.o = H;
                                    else $.i = z, z.o = $
                            }
                        }
                    }
                    if (z === void 0) {
                        z = this.v;
                        while (!0) {
                            let $ = this.A(z.u, q);
                            if ($ > 0) {
                                if (z.i === void 0) {
                                    z.i = new this.N(q, K), z.i.o = z, z = z.i;
                                    break
                                }
                                z = z.i
                            } else if ($ < 0) {
                                if (z.h === void 0) {
                                    z.h = new this.N(q, K), z.h.o = z, z = z.h;
                                    break
                                }
                                z = z.h
                            } else return z.l = K, this.m
                        }
                    }
                }
            }
            if (this.enableIndex) {
                let O = z.o;
                while (O !== this.C) O.M += 1, O = O.o
            }
            return this.j(z), this.m += 1, this.m
        }
        H(q, K) {
            while (q) {
                let _ = this.A(q.u, K);
                if (_ < 0) q = q.h;
                else if (_ > 0) q = q.i;
                else return q
            }
            return q || this.C
        }
        clear() {
            this.m = 0, this.v = void 0, this.C.o = void 0, this.C.i = this.C.h = void 0
        }
        updateKeyByIterator(q, K) {
            let _ = q.T;
            if (_ === this.C) lJ6();
            if (this.m === 1) return _.u = K, !0;
            let z = _.B().u;
            if (_ === this.C.i) {
                if (this.A(z, K) > 0) return _.u = K, !0;
                return !1
            }
            let Y = _.I().u;
            if (_ === this.C.h) {
                if (this.A(Y, K) < 0) return _.u = K, !0;
                return !1
            }
            if (this.A(Y, K) >= 0 || this.A(z, K) <= 0) return !1;
            return _.u = K, !0
        }
        eraseElementByPos(q) {
            if (q < 0 || q > this.m - 1) throw RangeError();
            let K = this.U(q);
            return this.S(K), this.m
        }
        eraseElementByKey(q) {
            if (this.m === 0) return !1;
            let K = this.H(this.v, q);
            if (K === this.C) return !1;
            return this.S(K), !0
        }
        eraseElementByIterator(q) {
            let K = q.T;
            if (K === this.C) lJ6();
            let _ = K.h === void 0;
            if (q.iteratorType === 0) {
                if (_) q.next()
            } else if (!_ || K.i === void 0) q.next();
            return this.S(K), q
        }
        getHeight() {
            if (this.m === 0) return 0;

            function q(K) {
                if (!K) return 0;
                return Math.max(q(K.i), q(K.h)) + 1
            }
            return q(this.v)
        }
    }
    class A8K extends K8K {
        constructor(q, K, _) {
            super(_);
            if (this.T = q, this.C = K, this.iteratorType === 0) this.pre = function() {
                if (this.T === this.C.i) lJ6();
                return this.T = this.T.I(), this
            }, this.next = function() {
                if (this.T === this.C) lJ6();
                return this.T = this.T.B(), this
            };
            else this.pre = function() {
                if (this.T === this.C.h) lJ6();
                return this.T = this.T.B(), this
            }, this.next = function() {
                if (this.T === this.C) lJ6();
                return this.T = this.T.I(), this
            }
        }
        get index() {
            let q = this.T,
                K = this.C.o;
            if (q === this.C) {
                if (K) return K.M - 1;
                return 0
            }
            let _ = 0;
            if (q.i) _ += q.i.M;
            while (q !== K) {
                let z = q.o;
                if (q === z.h) {
                    if (_ += 1, z.i) _ += z.i.M
                }
                q = z
            }
            return _
        }
        isAccessible() {
            return this.T !== this.C
        }
    }
    class vF extends A8K {
        constructor(q, K, _, z) {
            super(q, K, z);
            this.container = _
        }
        get pointer() {
            if (this.T === this.C) lJ6();
            let q = this;
            return new Proxy([], {
                get(K, _) {
                    if (_ === "0") return q.T.u;
                    else if (_ === "1") return q.T.l;
                    return K[0] = q.T.u, K[1] = q.T.l, K[_]
                },
                set(K, _, z) {
                    if (_ !== "1") throw TypeError("prop must be 1");
                    return q.T.l = z, !0
                }
            })
        }
        copy() {
            return new vF(this.T, this.C, this.container, this.iteratorType)
        }
    }
    class O8K extends Y8K {
        constructor(q = [], K, _) {
            super(K, _);
            let z = this;
            q.forEach(function(Y) {
                z.setElement(Y[0], Y[1])
            })
        }
        begin() {
            return new vF(this.C.i || this.C, this.C, this)
        }
        end() {
            return new vF(this.C, this.C, this)
        }
        rBegin() {
            return new vF(this.C.h || this.C, this.C, this, 1)
        }
        rEnd() {
            return new vF(this.C, this.C, this, 1)
        }
        front() {
            if (this.m === 0) return;
            let q = this.C.i;
            return [q.u, q.l]
        }
        back() {
            if (this.m === 0) return;
            let q = this.C.h;
            return [q.u, q.l]
        }
        lowerBound(q) {
            let K = this.R(this.v, q);
            return new vF(K, this.C, this)
        }
        upperBound(q) {
            let K = this.K(this.v, q);
            return new vF(K, this.C, this)
        }
        reverseLowerBound(q) {
            let K = this.L(this.v, q);
            return new vF(K, this.C, this)
        }
        reverseUpperBound(q) {
            let K = this.k(this.v, q);
            return new vF(K, this.C, this)
        }
        forEach(q) {
            this.U(function(K, _, z) {
                q([K.u, K.l], _, z)
            })
        }
        setElement(q, K, _) {
            return this.q(q, K, _)
        }
        getElementByPos(q) {
            if (q < 0 || q > this.m - 1) throw RangeError();
            let K = this.U(q);
            return [K.u, K.l]
        }
        find(q) {
            let K = this.H(this.v, q);
            return new vF(K, this.C, this)
        }
        getElementByKey(q) {
            return this.H(this.v, q).l
        }
        union(q) {
            let K = this;
            return q.forEach(function(_) {
                K.setElement(_[0], _[1])
            }), this.m
        }*[Symbol.iterator]() {
            let q = this.m,
                K = this.U();
            for (let _ = 0; _ < q; ++_) {
                let z = K[_];
                yield [z.u, z.l]
            }
        }
    }
    w8K.OrderedMap = O8K
})
// @from(Ln 309065, Col 4)
lm8 = p((H8K) => {
    Object.defineProperty(H8K, "__esModule", {
        value: !0
    });
    H8K.registerAdminService = emz;
    H8K.addAdminServicesToServer = qBz;
    var j8K = [];

    function emz(q, K) {
        j8K.push({
            getServiceDefinition: q,
            getHandlers: K
        })
    }

    function qBz(q) {
        for (let {
                getServiceDefinition: K,
                getHandlers: _
            }
            of j8K) q.addService(K(), _())
    }
})
// @from(Ln 309088, Col 4)
Z8K = p((W8K) => {
    Object.defineProperty(W8K, "__esModule", {
        value: !0
    });
    W8K.ClientDuplexStreamImpl = W8K.ClientWritableStreamImpl = W8K.ClientReadableStreamImpl = W8K.ClientUnaryCallImpl = void 0;
    W8K.callErrorFromStatus = YBz;
    var zBz = d6("events"),
        Rt1 = d6("stream"),
        r78 = e_();

    function YBz(q, K) {
        let _ = `${q.code} ${r78.Status[q.code]}: ${q.details}`,
            Y = `${Error(_).stack}
for call at
${K}`;
        return Object.assign(Error(_), q, {
            stack: Y
        })
    }
    class J8K extends zBz.EventEmitter {
        constructor() {
            super()
        }
        cancel() {
            var q;
            (q = this.call) === null || q === void 0 || q.cancelWithStatus(r78.Status.CANCELLED, "Cancelled on client")
        }
        getPeer() {
            var q, K;
            return (K = (q = this.call) === null || q === void 0 ? void 0 : q.getPeer()) !== null && K !== void 0 ? K : "unknown"
        }
        getAuthContext() {
            var q, K;
            return (K = (q = this.call) === null || q === void 0 ? void 0 : q.getAuthContext()) !== null && K !== void 0 ? K : null
        }
    }
    W8K.ClientUnaryCallImpl = J8K;
    class X8K extends Rt1.Readable {
        constructor(q) {
            super({
                objectMode: !0
            });
            this.deserialize = q
        }
        cancel() {
            var q;
            (q = this.call) === null || q === void 0 || q.cancelWithStatus(r78.Status.CANCELLED, "Cancelled on client")
        }
        getPeer() {
            var q, K;
            return (K = (q = this.call) === null || q === void 0 ? void 0 : q.getPeer()) !== null && K !== void 0 ? K : "unknown"
        }
        getAuthContext() {
            var q, K;
            return (K = (q = this.call) === null || q === void 0 ? void 0 : q.getAuthContext()) !== null && K !== void 0 ? K : null
        }
        _read(q) {
            var K;
            (K = this.call) === null || K === void 0 || K.startRead()
        }
    }
    W8K.ClientReadableStreamImpl = X8K;
    class M8K extends Rt1.Writable {
        constructor(q) {
            super({
                objectMode: !0
            });
            this.serialize = q
        }
        cancel() {
            var q;
            (q = this.call) === null || q === void 0 || q.cancelWithStatus(r78.Status.CANCELLED, "Cancelled on client")
        }
        getPeer() {
            var q, K;
            return (K = (q = this.call) === null || q === void 0 ? void 0 : q.getPeer()) !== null && K !== void 0 ? K : "unknown"
        }
        getAuthContext() {
            var q, K;
            return (K = (q = this.call) === null || q === void 0 ? void 0 : q.getAuthContext()) !== null && K !== void 0 ? K : null
        }
        _write(q, K, _) {
            var z;
            let Y = {
                    callback: _
                },
                A = Number(K);
            if (!Number.isNaN(A)) Y.flags = A;
            (z = this.call) === null || z === void 0 || z.sendMessageWithContext(Y, q)
        }
        _final(q) {
            var K;
            (K = this.call) === null || K === void 0 || K.halfClose(), q()
        }
    }
    W8K.ClientWritableStreamImpl = M8K;
    class P8K extends Rt1.Duplex {
        constructor(q, K) {
            super({
                objectMode: !0
            });
            this.serialize = q, this.deserialize = K
        }
        cancel() {
            var q;
            (q = this.call) === null || q === void 0 || q.cancelWithStatus(r78.Status.CANCELLED, "Cancelled on client")
        }
        getPeer() {
            var q, K;
            return (K = (q = this.call) === null || q === void 0 ? void 0 : q.getPeer()) !== null && K !== void 0 ? K : "unknown"
        }
        getAuthContext() {
            var q, K;
            return (K = (q = this.call) === null || q === void 0 ? void 0 : q.getAuthContext()) !== null && K !== void 0 ? K : null
        }
        _read(q) {
            var K;
            (K = this.call) === null || K === void 0 || K.startRead()
        }
        _write(q, K, _) {
            var z;
            let Y = {
                    callback: _
                },
                A = Number(K);
            if (!Number.isNaN(A)) Y.flags = A;
            (z = this.call) === null || z === void 0 || z.sendMessageWithContext(Y, q)
        }
        _final(q) {
            var K;
            (K = this.call) === null || K === void 0 || K.halfClose(), q()
        }
    }
    W8K.ClientDuplexStreamImpl = P8K
})
// @from(Ln 309223, Col 4)
nJ6 = p((G8K) => {
    Object.defineProperty(G8K, "__esModule", {
        value: !0
    });
    G8K.InterceptingListenerImpl = void 0;
    G8K.statusOrFromValue = HBz;
    G8K.statusOrFromError = JBz;
    G8K.isInterceptingListener = XBz;
    var jBz = QD();

    function HBz(q) {
        return {
            ok: !0,
            value: q
        }
    }

    function JBz(q) {
        var K;
        return {
            ok: !1,
            error: Object.assign(Object.assign({}, q), {
                metadata: (K = q.metadata) !== null && K !== void 0 ? K : new jBz.Metadata
            })
        }
    }

    function XBz(q) {
        return q.onReceiveMetadata !== void 0 && q.onReceiveMetadata.length === 1
    }
    class f8K {
        constructor(q, K) {
            this.listener = q, this.nextListener = K, this.processingMetadata = !1, this.hasPendingMessage = !1, this.processingMessage = !1, this.pendingStatus = null
        }
        processPendingMessage() {
            if (this.hasPendingMessage) this.nextListener.onReceiveMessage(this.pendingMessage), this.pendingMessage = null, this.hasPendingMessage = !1
        }
        processPendingStatus() {
            if (this.pendingStatus) this.nextListener.onReceiveStatus(this.pendingStatus)
        }
        onReceiveMetadata(q) {
            this.processingMetadata = !0, this.listener.onReceiveMetadata(q, (K) => {
                this.processingMetadata = !1, this.nextListener.onReceiveMetadata(K), this.processPendingMessage(), this.processPendingStatus()
            })
        }
        onReceiveMessage(q) {
            this.processingMessage = !0, this.listener.onReceiveMessage(q, (K) => {
                if (this.processingMessage = !1, this.processingMetadata) this.pendingMessage = K, this.hasPendingMessage = !0;
                else this.nextListener.onReceiveMessage(K), this.processPendingStatus()
            })
        }
        onReceiveStatus(q) {
            this.listener.onReceiveStatus(q, (K) => {
                if (this.processingMetadata || this.processingMessage) this.pendingStatus = K;
                else this.nextListener.onReceiveStatus(K)
            })
        }
    }
    G8K.InterceptingListenerImpl = f8K
})
// @from(Ln 309283, Col 4)
bt1 = p((R8K) => {
    Object.defineProperty(R8K, "__esModule", {
        value: !0
    });
    R8K.InterceptingCall = R8K.RequesterBuilder = R8K.ListenerBuilder = R8K.InterceptorConfigurationError = void 0;
    R8K.getInterceptingCall = GBz;
    var DBz = QD(),
        T8K = nJ6(),
        V8K = e_(),
        k8K = Cm8();
    class a78 extends Error {
        constructor(q) {
            super(q);
            this.name = "InterceptorConfigurationError", Error.captureStackTrace(this, a78)
        }
    }
    R8K.InterceptorConfigurationError = a78;
    class N8K {
        constructor() {
            this.metadata = void 0, this.message = void 0, this.status = void 0
        }
        withOnReceiveMetadata(q) {
            return this.metadata = q, this
        }
        withOnReceiveMessage(q) {
            return this.message = q, this
        }
        withOnReceiveStatus(q) {
            return this.status = q, this
        }
        build() {
            return {
                onReceiveMetadata: this.metadata,
                onReceiveMessage: this.message,
                onReceiveStatus: this.status
            }
        }
    }
    R8K.ListenerBuilder = N8K;
    class E8K {
        constructor() {
            this.start = void 0, this.message = void 0, this.halfClose = void 0, this.cancel = void 0
        }
        withStart(q) {
            return this.start = q, this
        }
        withSendMessage(q) {
            return this.message = q, this
        }
        withHalfClose(q) {
            return this.halfClose = q, this
        }
        withCancel(q) {
            return this.cancel = q, this
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
    R8K.RequesterBuilder = E8K;
    var St1 = {
            onReceiveMetadata: (q, K) => {
                K(q)
            },
            onReceiveMessage: (q, K) => {
                K(q)
            },
            onReceiveStatus: (q, K) => {
                K(q)
            }
        },
        o78 = {
            start: (q, K, _) => {
                _(q, K)
            },
            sendMessage: (q, K) => {
                K(q)
            },
            halfClose: (q) => {
                q()
            },
            cancel: (q) => {
                q()
            }
        };
    class y8K {
        constructor(q, K) {
            var _, z, Y, A;
            if (this.nextCall = q, this.processingMetadata = !1, this.pendingMessageContext = null, this.processingMessage = !1, this.pendingHalfClose = !1, K) this.requester = {
                start: (_ = K.start) !== null && _ !== void 0 ? _ : o78.start,
                sendMessage: (z = K.sendMessage) !== null && z !== void 0 ? z : o78.sendMessage,
                halfClose: (Y = K.halfClose) !== null && Y !== void 0 ? Y : o78.halfClose,
                cancel: (A = K.cancel) !== null && A !== void 0 ? A : o78.cancel
            };
            else this.requester = o78
        }
        cancelWithStatus(q, K) {
            this.requester.cancel(() => {
                this.nextCall.cancelWithStatus(q, K)
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
        start(q, K) {
            var _, z, Y, A, O, w;
            let $ = {
                onReceiveMetadata: (z = (_ = K === null || K === void 0 ? void 0 : K.onReceiveMetadata) === null || _ === void 0 ? void 0 : _.bind(K)) !== null && z !== void 0 ? z : (j) => {},
                onReceiveMessage: (A = (Y = K === null || K === void 0 ? void 0 : K.onReceiveMessage) === null || Y === void 0 ? void 0 : Y.bind(K)) !== null && A !== void 0 ? A : (j) => {},
                onReceiveStatus: (w = (O = K === null || K === void 0 ? void 0 : K.onReceiveStatus) === null || O === void 0 ? void 0 : O.bind(K)) !== null && w !== void 0 ? w : (j) => {}
            };
            this.processingMetadata = !0, this.requester.start(q, $, (j, H) => {
                var J, X, M;
                this.processingMetadata = !1;
                let P;
                if ((0, T8K.isInterceptingListener)(H)) P = H;
                else {
                    let W = {
                        onReceiveMetadata: (J = H.onReceiveMetadata) !== null && J !== void 0 ? J : St1.onReceiveMetadata,
                        onReceiveMessage: (X = H.onReceiveMessage) !== null && X !== void 0 ? X : St1.onReceiveMessage,
                        onReceiveStatus: (M = H.onReceiveStatus) !== null && M !== void 0 ? M : St1.onReceiveStatus
                    };
                    P = new T8K.InterceptingListenerImpl(W, $)
                }
                this.nextCall.start(j, P), this.processPendingMessage(), this.processPendingHalfClose()
            })
        }
        sendMessageWithContext(q, K) {
            this.processingMessage = !0, this.requester.sendMessage(K, (_) => {
                if (this.processingMessage = !1, this.processingMetadata) this.pendingMessageContext = q, this.pendingMessage = K;
                else this.nextCall.sendMessageWithContext(q, _), this.processPendingHalfClose()
            })
        }
        sendMessage(q) {
            this.sendMessageWithContext({}, q)
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
    R8K.InterceptingCall = y8K;

    function ZBz(q, K, _) {
        var z, Y;
        let A = (z = _.deadline) !== null && z !== void 0 ? z : 1 / 0,
            O = _.host,
            w = (Y = _.parent) !== null && Y !== void 0 ? Y : null,
            $ = _.propagate_flags,
            j = _.credentials,
            H = q.createCall(K, A, O, w, $);
        if (j) H.setCredentials(j);
        return H
    }
    class Ct1 {
        constructor(q, K) {
            this.call = q, this.methodDefinition = K
        }
        cancelWithStatus(q, K) {
            this.call.cancelWithStatus(q, K)
        }
        getPeer() {
            return this.call.getPeer()
        }
        sendMessageWithContext(q, K) {
            let _;
            try {
                _ = this.methodDefinition.requestSerialize(K)
            } catch (z) {
                this.call.cancelWithStatus(V8K.Status.INTERNAL, `Request message serialization failure: ${(0,k8K.getErrorMessage)(z)}`);
                return
            }
            this.call.sendMessageWithContext(q, _)
        }
        sendMessage(q) {
            this.sendMessageWithContext({}, q)
        }
        start(q, K) {
            let _ = null;
            this.call.start(q, {
                onReceiveMetadata: (z) => {
                    var Y;
                    (Y = K === null || K === void 0 ? void 0 : K.onReceiveMetadata) === null || Y === void 0 || Y.call(K, z)
                },
                onReceiveMessage: (z) => {
                    var Y;
                    let A;
                    try {
                        A = this.methodDefinition.responseDeserialize(z)
                    } catch (O) {
                        _ = {
                            code: V8K.Status.INTERNAL,
                            details: `Response message parsing error: ${(0,k8K.getErrorMessage)(O)}`,
                            metadata: new DBz.Metadata
                        }, this.call.cancelWithStatus(_.code, _.details);
                        return
                    }(Y = K === null || K === void 0 ? void 0 : K.onReceiveMessage) === null || Y === void 0 || Y.call(K, A)
                },
                onReceiveStatus: (z) => {
                    var Y, A;
                    if (_)(Y = K === null || K === void 0 ? void 0 : K.onReceiveStatus) === null || Y === void 0 || Y.call(K, _);
                    else(A = K === null || K === void 0 ? void 0 : K.onReceiveStatus) === null || A === void 0 || A.call(K, z)
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
    class L8K extends Ct1 {
        constructor(q, K) {
            super(q, K)
        }
        start(q, K) {
            var _, z;
            let Y = !1,
                A = {
                    onReceiveMetadata: (z = (_ = K === null || K === void 0 ? void 0 : K.onReceiveMetadata) === null || _ === void 0 ? void 0 : _.bind(K)) !== null && z !== void 0 ? z : (O) => {},
                    onReceiveMessage: (O) => {
                        var w;
                        Y = !0, (w = K === null || K === void 0 ? void 0 : K.onReceiveMessage) === null || w === void 0 || w.call(K, O)
                    },
                    onReceiveStatus: (O) => {
                        var w, $;
                        if (!Y)(w = K === null || K === void 0 ? void 0 : K.onReceiveMessage) === null || w === void 0 || w.call(K, null);
                        ($ = K === null || K === void 0 ? void 0 : K.onReceiveStatus) === null || $ === void 0 || $.call(K, O)
                    }
                };
            super.start(q, A), this.call.startRead()
        }
    }
    class h8K extends Ct1 {}

    function fBz(q, K, _) {
        let z = ZBz(q, _.path, K);
        if (_.responseStream) return new h8K(z, _);
        else return new L8K(z, _)
    }

    function GBz(q, K, _, z) {
        if (q.clientInterceptors.length > 0 && q.clientInterceptorProviders.length > 0) throw new a78("Both interceptors and interceptor_providers were passed as options to the client constructor. Only one of these is allowed.");
        if (q.callInterceptors.length > 0 && q.callInterceptorProviders.length > 0) throw new a78("Both interceptors and interceptor_providers were passed as call options. Only one of these is allowed.");
        let Y = [];
        if (q.callInterceptors.length > 0 || q.callInterceptorProviders.length > 0) Y = [].concat(q.callInterceptors, q.callInterceptorProviders.map((w) => w(K))).filter((w) => w);
        else Y = [].concat(q.clientInterceptors, q.clientInterceptorProviders.map((w) => w(K))).filter((w) => w);
        let A = Object.assign({}, _, {
            method_definition: K
        });
        return Y.reduceRight((w, $) => {
            return (j) => $(j, w)
        }, (w) => fBz(z, w, K))(A)
    }
})
// @from(Ln 309561, Col 4)
xt1 = p((b8K) => {
    Object.defineProperty(b8K, "__esModule", {
        value: !0
    });
    b8K.Client = void 0;
    var Hl = Z8K(),
        NBz = ut1(),
        EBz = ik(),
        L36 = e_(),
        fS6 = QD(),
        nm8 = bt1(),
        TF = Symbol(),
        GS6 = Symbol(),
        vS6 = Symbol(),
        Pt = Symbol();

    function It1(q) {
        return typeof q === "function"
    }

    function TS6(q) {
        var K;
        return ((K = q.stack) === null || K === void 0 ? void 0 : K.split(`
`).slice(1).join(`
`)) || "no stack trace available"
    }
    class C8K {
        constructor(q, K, _ = {}) {
            var z, Y;
            if (_ = Object.assign({}, _), this[GS6] = (z = _.interceptors) !== null && z !== void 0 ? z : [], delete _.interceptors, this[vS6] = (Y = _.interceptor_providers) !== null && Y !== void 0 ? Y : [], delete _.interceptor_providers, this[GS6].length > 0 && this[vS6].length > 0) throw Error("Both interceptors and interceptor_providers were passed as options to the client constructor. Only one of these is allowed.");
            if (this[Pt] = _.callInvocationTransformer, delete _.callInvocationTransformer, _.channelOverride) this[TF] = _.channelOverride;
            else if (_.channelFactoryOverride) {
                let A = _.channelFactoryOverride;
                delete _.channelFactoryOverride, this[TF] = A(q, K, _)
            } else this[TF] = new NBz.ChannelImplementation(q, K, _)
        }
        close() {
            this[TF].close()
        }
        getChannel() {
            return this[TF]
        }
        waitForReady(q, K) {
            let _ = (z) => {
                if (z) {
                    K(Error("Failed to connect before the deadline"));
                    return
                }
                let Y;
                try {
                    Y = this[TF].getConnectivityState(!0)
                } catch (A) {
                    K(Error("The channel has been closed"));
                    return
                }
                if (Y === EBz.ConnectivityState.READY) K();
                else try {
                    this[TF].watchConnectivityState(Y, q, _)
                } catch (A) {
                    K(Error("The channel has been closed"))
                }
            };
            setImmediate(_)
        }
        checkOptionalUnaryResponseArguments(q, K, _) {
            if (It1(q)) return {
                metadata: new fS6.Metadata,
                options: {},
                callback: q
            };
            else if (It1(K))
                if (q instanceof fS6.Metadata) return {
                    metadata: q,
                    options: {},
                    callback: K
                };
                else return {
                    metadata: new fS6.Metadata,
                    options: q,
                    callback: K
                };
            else {
                if (!(q instanceof fS6.Metadata && K instanceof Object && It1(_))) throw Error("Incorrect arguments passed");
                return {
                    metadata: q,
                    options: K,
                    callback: _
                }
            }
        }
        makeUnaryRequest(q, K, _, z, Y, A, O) {
            var w, $;
            let j = this.checkOptionalUnaryResponseArguments(Y, A, O),
                H = {
                    path: q,
                    requestStream: !1,
                    responseStream: !1,
                    requestSerialize: K,
                    responseDeserialize: _
                },
                J = {
                    argument: z,
                    metadata: j.metadata,
                    call: new Hl.ClientUnaryCallImpl,
                    channel: this[TF],
                    methodDefinition: H,
                    callOptions: j.options,
                    callback: j.callback
                };
            if (this[Pt]) J = this[Pt](J);
            let X = J.call,
                M = {
                    clientInterceptors: this[GS6],
                    clientInterceptorProviders: this[vS6],
                    callInterceptors: (w = J.callOptions.interceptors) !== null && w !== void 0 ? w : [],
                    callInterceptorProviders: ($ = J.callOptions.interceptor_providers) !== null && $ !== void 0 ? $ : []
                },
                P = (0, nm8.getInterceptingCall)(M, J.methodDefinition, J.callOptions, J.channel);
            X.call = P;
            let W = null,
                D = !1,
                Z = Error();
            return P.start(J.metadata, {
                onReceiveMetadata: (G) => {
                    X.emit("metadata", G)
                },
                onReceiveMessage(G) {
                    if (W !== null) P.cancelWithStatus(L36.Status.UNIMPLEMENTED, "Too many responses received");
                    W = G
                },
                onReceiveStatus(G) {
                    if (D) return;
                    if (D = !0, G.code === L36.Status.OK)
                        if (W === null) {
                            let f = TS6(Z);
                            J.callback((0, Hl.callErrorFromStatus)({
                                code: L36.Status.UNIMPLEMENTED,
                                details: "No message received",
                                metadata: G.metadata
                            }, f))
                        } else J.callback(null, W);
                    else {
                        let f = TS6(Z);
                        J.callback((0, Hl.callErrorFromStatus)(G, f))
                    }
                    Z = null, X.emit("status", G)
                }
            }), P.sendMessage(z), P.halfClose(), X
        }
        makeClientStreamRequest(q, K, _, z, Y, A) {
            var O, w;
            let $ = this.checkOptionalUnaryResponseArguments(z, Y, A),
                j = {
                    path: q,
                    requestStream: !0,
                    responseStream: !1,
                    requestSerialize: K,
                    responseDeserialize: _
                },
                H = {
                    metadata: $.metadata,
                    call: new Hl.ClientWritableStreamImpl(K),
                    channel: this[TF],
                    methodDefinition: j,
                    callOptions: $.options,
                    callback: $.callback
                };
            if (this[Pt]) H = this[Pt](H);
            let J = H.call,
                X = {
                    clientInterceptors: this[GS6],
                    clientInterceptorProviders: this[vS6],
                    callInterceptors: (O = H.callOptions.interceptors) !== null && O !== void 0 ? O : [],
                    callInterceptorProviders: (w = H.callOptions.interceptor_providers) !== null && w !== void 0 ? w : []
                },
                M = (0, nm8.getInterceptingCall)(X, H.methodDefinition, H.callOptions, H.channel);
            J.call = M;
            let P = null,
                W = !1,
                D = Error();
            return M.start(H.metadata, {
                onReceiveMetadata: (Z) => {
                    J.emit("metadata", Z)
                },
                onReceiveMessage(Z) {
                    if (P !== null) M.cancelWithStatus(L36.Status.UNIMPLEMENTED, "Too many responses received");
                    P = Z, M.startRead()
                },
                onReceiveStatus(Z) {
                    if (W) return;
                    if (W = !0, Z.code === L36.Status.OK)
                        if (P === null) {
                            let G = TS6(D);
                            H.callback((0, Hl.callErrorFromStatus)({
                                code: L36.Status.UNIMPLEMENTED,
                                details: "No message received",
                                metadata: Z.metadata
                            }, G))
                        } else H.callback(null, P);
                    else {
                        let G = TS6(D);
                        H.callback((0, Hl.callErrorFromStatus)(Z, G))
                    }
                    D = null, J.emit("status", Z)
                }
            }), J
        }
        checkMetadataAndOptions(q, K) {
            let _, z;
            if (q instanceof fS6.Metadata)
                if (_ = q, K) z = K;
                else z = {};
            else {
                if (q) z = q;
                else z = {};
                _ = new fS6.Metadata
            }
            return {
                metadata: _,
                options: z
            }
        }
        makeServerStreamRequest(q, K, _, z, Y, A) {
            var O, w;
            let $ = this.checkMetadataAndOptions(Y, A),
                j = {
                    path: q,
                    requestStream: !1,
                    responseStream: !0,
                    requestSerialize: K,
                    responseDeserialize: _
                },
                H = {
                    argument: z,
                    metadata: $.metadata,
                    call: new Hl.ClientReadableStreamImpl(_),
                    channel: this[TF],
                    methodDefinition: j,
                    callOptions: $.options
                };
            if (this[Pt]) H = this[Pt](H);
            let J = H.call,
                X = {
                    clientInterceptors: this[GS6],
                    clientInterceptorProviders: this[vS6],
                    callInterceptors: (O = H.callOptions.interceptors) !== null && O !== void 0 ? O : [],
                    callInterceptorProviders: (w = H.callOptions.interceptor_providers) !== null && w !== void 0 ? w : []
                },
                M = (0, nm8.getInterceptingCall)(X, H.methodDefinition, H.callOptions, H.channel);
            J.call = M;
            let P = !1,
                W = Error();
            return M.start(H.metadata, {
                onReceiveMetadata(D) {
                    J.emit("metadata", D)
                },
                onReceiveMessage(D) {
                    J.push(D)
                },
                onReceiveStatus(D) {
                    if (P) return;
                    if (P = !0, J.push(null), D.code !== L36.Status.OK) {
                        let Z = TS6(W);
                        J.emit("error", (0, Hl.callErrorFromStatus)(D, Z))
                    }
                    W = null, J.emit("status", D)
                }
            }), M.sendMessage(z), M.halfClose(), J
        }
        makeBidiStreamRequest(q, K, _, z, Y) {
            var A, O;
            let w = this.checkMetadataAndOptions(z, Y),
                $ = {
                    path: q,
                    requestStream: !0,
                    responseStream: !0,
                    requestSerialize: K,
                    responseDeserialize: _
                },
                j = {
                    metadata: w.metadata,
                    call: new Hl.ClientDuplexStreamImpl(K, _),
                    channel: this[TF],
                    methodDefinition: $,
                    callOptions: w.options
                };
            if (this[Pt]) j = this[Pt](j);
            let H = j.call,
                J = {
                    clientInterceptors: this[GS6],
                    clientInterceptorProviders: this[vS6],
                    callInterceptors: (A = j.callOptions.interceptors) !== null && A !== void 0 ? A : [],
                    callInterceptorProviders: (O = j.callOptions.interceptor_providers) !== null && O !== void 0 ? O : []
                },
                X = (0, nm8.getInterceptingCall)(J, j.methodDefinition, j.callOptions, j.channel);
            H.call = X;
            let M = !1,
                P = Error();
            return X.start(j.metadata, {
                onReceiveMetadata(W) {
                    H.emit("metadata", W)
                },
                onReceiveMessage(W) {
                    H.push(W)
                },
                onReceiveStatus(W) {
                    if (M) return;
                    if (M = !0, H.push(null), W.code !== L36.Status.OK) {
                        let D = TS6(P);
                        H.emit("error", (0, Hl.callErrorFromStatus)(W, D))
                    }
                    P = null, H.emit("status", W)
                }
            }), H
        }
    }
    b8K.Client = C8K
})
// @from(Ln 309879, Col 4)
im8 = p((u8K) => {
    Object.defineProperty(u8K, "__esModule", {
        value: !0
    });
    u8K.makeClientConstructor = x8K;
    u8K.loadPackageDefinition = RBz;
    var s78 = xt1(),
        yBz = {
            unary: s78.Client.prototype.makeUnaryRequest,
            server_stream: s78.Client.prototype.makeServerStreamRequest,
            client_stream: s78.Client.prototype.makeClientStreamRequest,
            bidi: s78.Client.prototype.makeBidiStreamRequest
        };

    function mt1(q) {
        return ["__proto__", "prototype", "constructor"].includes(q)
    }

    function x8K(q, K, _) {
        if (!_) _ = {};
        class z extends s78.Client {}
        return Object.keys(q).forEach((Y) => {
            if (mt1(Y)) return;
            let A = q[Y],
                O;
            if (typeof Y === "string" && Y.charAt(0) === "$") throw Error("Method names cannot start with $");
            if (A.requestStream)
                if (A.responseStream) O = "bidi";
                else O = "client_stream";
            else if (A.responseStream) O = "server_stream";
            else O = "unary";
            let {
                requestSerialize: w,
                responseDeserialize: $
            } = A, j = LBz(yBz[O], A.path, w, $);
            if (z.prototype[Y] = j, Object.assign(z.prototype[Y], A), A.originalName && !mt1(A.originalName)) z.prototype[A.originalName] = z.prototype[Y]
        }), z.service = q, z.serviceName = K, z
    }

    function LBz(q, K, _, z) {
        return function(...Y) {
            return q.call(this, K, _, z, ...Y)
        }
    }

    function hBz(q) {
        return "format" in q
    }

    function RBz(q) {
        let K = {};
        for (let _ in q)
            if (Object.prototype.hasOwnProperty.call(q, _)) {
                let z = q[_],
                    Y = _.split(".");
                if (Y.some((w) => mt1(w))) continue;
                let A = Y[Y.length - 1],
                    O = K;
                for (let w of Y.slice(0, -1)) {
                    if (!O[w]) O[w] = {};
                    O = O[w]
                }
                if (hBz(z)) O[A] = z;
                else O[A] = x8K(z, A, {})
            } return K
    }
})
// @from(Ln 309946, Col 4)
O1K = p((i52, A1K) => {
    var bBz = 1 / 0,
        IBz = "[object Symbol]",
        xBz = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
        uBz = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
        om8 = "\\ud800-\\udfff",
        d8K = "\\u0300-\\u036f\\ufe20-\\ufe23",
        c8K = "\\u20d0-\\u20f0",
        l8K = "\\u2700-\\u27bf",
        n8K = "a-z\\xdf-\\xf6\\xf8-\\xff",
        mBz = "\\xac\\xb1\\xd7\\xf7",
        BBz = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",
        pBz = "\\u2000-\\u206f",
        FBz = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
        i8K = "A-Z\\xc0-\\xd6\\xd8-\\xde",
        r8K = "\\ufe0e\\ufe0f",
        o8K = mBz + BBz + pBz + FBz,
        pt1 = "['’]",
        gBz = "[" + om8 + "]",
        m8K = "[" + o8K + "]",
        rm8 = "[" + d8K + c8K + "]",
        a8K = "\\d+",
        UBz = "[" + l8K + "]",
        s8K = "[" + n8K + "]",
        t8K = "[^" + om8 + o8K + a8K + l8K + n8K + i8K + "]",
        Bt1 = "\\ud83c[\\udffb-\\udfff]",
        QBz = "(?:" + rm8 + "|" + Bt1 + ")",
        e8K = "[^" + om8 + "]",
        Ft1 = "(?:\\ud83c[\\udde6-\\uddff]){2}",
        gt1 = "[\\ud800-\\udbff][\\udc00-\\udfff]",
        VS6 = "[" + i8K + "]",
        q1K = "\\u200d",
        B8K = "(?:" + s8K + "|" + t8K + ")",
        dBz = "(?:" + VS6 + "|" + t8K + ")",
        p8K = "(?:" + pt1 + "(?:d|ll|m|re|s|t|ve))?",
        F8K = "(?:" + pt1 + "(?:D|LL|M|RE|S|T|VE))?",
        K1K = QBz + "?",
        _1K = "[" + r8K + "]?",
        cBz = "(?:" + q1K + "(?:" + [e8K, Ft1, gt1].join("|") + ")" + _1K + K1K + ")*",
        z1K = _1K + K1K + cBz,
        lBz = "(?:" + [UBz, Ft1, gt1].join("|") + ")" + z1K,
        nBz = "(?:" + [e8K + rm8 + "?", rm8, Ft1, gt1, gBz].join("|") + ")",
        iBz = RegExp(pt1, "g"),
        rBz = RegExp(rm8, "g"),
        oBz = RegExp(Bt1 + "(?=" + Bt1 + ")|" + nBz + z1K, "g"),
        aBz = RegExp([VS6 + "?" + s8K + "+" + p8K + "(?=" + [m8K, VS6, "$"].join("|") + ")", dBz + "+" + F8K + "(?=" + [m8K, VS6 + B8K, "$"].join("|") + ")", VS6 + "?" + B8K + "+" + p8K, VS6 + "+" + F8K, a8K, lBz].join("|"), "g"),
        sBz = RegExp("[" + q1K + om8 + d8K + c8K + r8K + "]"),
        tBz = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
        eBz = {
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
        qpz = typeof global == "object" && global && global.Object === Object && global,
        Kpz = typeof self == "object" && self && self.Object === Object && self,
        _pz = qpz || Kpz || Function("return this")();

    function zpz(q, K, _, z) {
        var Y = -1,
            A = q ? q.length : 0;
        if (z && A) _ = q[++Y];
        while (++Y < A) _ = K(_, q[Y], Y, q);
        return _
    }

    function Ypz(q) {
        return q.split("")
    }

    function Apz(q) {
        return q.match(xBz) || []
    }

    function Opz(q) {
        return function(K) {
            return q == null ? void 0 : q[K]
        }
    }
    var wpz = Opz(eBz);

    function Y1K(q) {
        return sBz.test(q)
    }

    function $pz(q) {
        return tBz.test(q)
    }

    function jpz(q) {
        return Y1K(q) ? Hpz(q) : Ypz(q)
    }

    function Hpz(q) {
        return q.match(oBz) || []
    }

    function Jpz(q) {
        return q.match(aBz) || []
    }
    var Xpz = Object.prototype,
        Mpz = Xpz.toString,
        g8K = _pz.Symbol,
        U8K = g8K ? g8K.prototype : void 0,
        Q8K = U8K ? U8K.toString : void 0;

    function Ppz(q, K, _) {
        var z = -1,
            Y = q.length;
        if (K < 0) K = -K > Y ? 0 : Y + K;
        if (_ = _ > Y ? Y : _, _ < 0) _ += Y;
        Y = K > _ ? 0 : _ - K >>> 0, K >>>= 0;
        var A = Array(Y);
        while (++z < Y) A[z] = q[z + K];
        return A
    }

    function Wpz(q) {
        if (typeof q == "string") return q;
        if (vpz(q)) return Q8K ? Q8K.call(q) : "";
        var K = q + "";
        return K == "0" && 1 / q == -bBz ? "-0" : K
    }

    function Dpz(q, K, _) {
        var z = q.length;
        return _ = _ === void 0 ? z : _, !K && _ >= z ? q : Ppz(q, K, _)
    }

    function Zpz(q) {
        return function(K) {
            K = am8(K);
            var _ = Y1K(K) ? jpz(K) : void 0,
                z = _ ? _[0] : K.charAt(0),
                Y = _ ? Dpz(_, 1).join("") : K.slice(1);
            return z[q]() + Y
        }
    }

    function fpz(q) {
        return function(K) {
            return zpz(Epz(kpz(K).replace(iBz, "")), q, "")
        }
    }

    function Gpz(q) {
        return !!q && typeof q == "object"
    }

    function vpz(q) {
        return typeof q == "symbol" || Gpz(q) && Mpz.call(q) == IBz
    }

    function am8(q) {
        return q == null ? "" : Wpz(q)
    }
    var Tpz = fpz(function(q, K, _) {
        return K = K.toLowerCase(), q + (_ ? Vpz(K) : K)
    });

    function Vpz(q) {
        return Npz(am8(q).toLowerCase())
    }

    function kpz(q) {
        return q = am8(q), q && q.replace(uBz, wpz).replace(rBz, "")
    }
    var Npz = Zpz("toUpperCase");

    function Epz(q, K, _) {
        if (q = am8(q), K = _ ? void 0 : K, K === void 0) return $pz(q) ? Jpz(q) : Apz(q);
        return q.match(K) || []
    }
    A1K.exports = Tpz
})
// @from(Ln 310307, Col 4)
$1K = p((r52, w1K) => {
    w1K.exports = Ut1;

    function Ut1(q, K) {
        if (typeof q === "string") K = q, q = void 0;
        var _ = [];

        function z(A) {
            if (typeof A !== "string") {
                var O = Y();
                if (Ut1.verbose) console.log("codegen: " + O);
                if (O = "return " + O, A) {
                    var w = Object.keys(A),
                        $ = Array(w.length + 1),
                        j = Array(w.length),
                        H = 0;
                    while (H < w.length) $[H] = w[H], j[H] = A[w[H++]];
                    return $[H] = O, Function.apply(null, $).apply(null, j)
                }
                return Function(O)()
            }
            var J = Array(arguments.length - 1),
                X = 0;
            while (X < J.length) J[X] = arguments[++X];
            if (X = 0, A = A.replace(/%([%dfijs])/g, function(P, W) {
                    var D = J[X++];
                    switch (W) {
                        case "d":
                        case "f":
                            return String(Number(D));
                        case "i":
                            return String(Math.floor(D));
                        case "j":
                            return JSON.stringify(D);
                        case "s":
                            return String(D)
                    }
                    return "%"
                }), X !== J.length) throw Error("parameter count mismatch");
            return _.push(A), z
        }

        function Y(A) {
            return "function " + (A || K || "") + "(" + (q && q.join(",") || "") + `){
  ` + _.join(`
  `) + `
}`
        }
        return z.toString = Y, z
    }
    Ut1.verbose = !1
})
// @from(Ln 310359, Col 4)
H1K = p((o52, j1K) => {
    j1K.exports = t78;
    var ypz = ys1(),
        Lpz = Rs1(),
        Qt1 = Lpz("fs");

    function t78(q, K, _) {
        if (typeof K === "function") _ = K, K = {};
        else if (!K) K = {};
        if (!_) return ypz(t78, this, q, K);
        if (!K.xhr && Qt1 && Qt1.readFile) return Qt1.readFile(q, function(Y, A) {
            return Y && typeof XMLHttpRequest < "u" ? t78.xhr(q, K, _) : Y ? _(Y) : _(null, K.binary ? A : A.toString("utf8"))
        });
        return t78.xhr(q, K, _)
    }
    t78.xhr = function(K, _, z) {
        var Y = new XMLHttpRequest;
        if (Y.onreadystatechange = function() {
                if (Y.readyState !== 4) return;
                if (Y.status !== 0 && Y.status !== 200) return z(Error("status " + Y.status));
                if (_.binary) {
                    var O = Y.response;
                    if (!O) {
                        O = [];
                        for (var w = 0; w < Y.responseText.length; ++w) O.push(Y.responseText.charCodeAt(w) & 255)
                    }
                    return z(null, typeof Uint8Array < "u" ? new Uint8Array(O) : O)
                }
                return z(null, Y.responseText)
            }, _.binary) {
            if ("overrideMimeType" in Y) Y.overrideMimeType("text/plain; charset=x-user-defined");
            Y.responseType = "arraybuffer"
        }
        Y.open("GET", K), Y.send()
    }
})
// @from(Ln 310395, Col 4)
M1K = p((X1K) => {
    var ct1 = X1K,
        J1K = ct1.isAbsolute = function(K) {
            return /^(?:\/|\w+:)/.test(K)
        },
        dt1 = ct1.normalize = function(K) {
            K = K.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
            var _ = K.split("/"),
                z = J1K(K),
                Y = "";
            if (z) Y = _.shift() + "/";
            for (var A = 0; A < _.length;)
                if (_[A] === "..")
                    if (A > 0 && _[A - 1] !== "..") _.splice(--A, 2);
                    else if (z) _.splice(A, 1);
            else ++A;
            else if (_[A] === ".") _.splice(A, 1);
            else ++A;
            return Y + _.join("/")
        };
    ct1.resolve = function(K, _, z) {
        if (!z) _ = dt1(_);
        if (J1K(_)) return _;
        if (!z) K = dt1(K);
        return (K = K.replace(/(?:\/|^)[^/]+$/, "")).length ? dt1(K + "/" + _) : _
    }
})
// @from(Ln 310422, Col 4)
NS6 = p((s52, D1K) => {
    D1K.exports = HA;
    var sm8 = R36();
    ((HA.prototype = Object.create(sm8.prototype)).constructor = HA).className = "Namespace";
    var lt1 = h36(),
        tm8 = dD(),
        hpz = oJ6(),
        iJ6, kS6, rJ6;
    HA.fromJSON = function(K, _) {
        return new HA(K, _.options).addJSON(_.nested)
    };

    function P1K(q, K) {
        if (!(q && q.length)) return;
        var _ = {};
        for (var z = 0; z < q.length; ++z) _[q[z].name] = q[z].toJSON(K);
        return _
    }
    HA.arrayToJSON = P1K;
    HA.isReservedId = function(K, _) {
        if (K) {
            for (var z = 0; z < K.length; ++z)
                if (typeof K[z] !== "string" && K[z][0] <= _ && K[z][1] > _) return !0
        }
        return !1
    };
    HA.isReservedName = function(K, _) {
        if (K) {
            for (var z = 0; z < K.length; ++z)
                if (K[z] === _) return !0
        }
        return !1
    };

    function HA(q, K) {
        sm8.call(this, q, K), this.nested = void 0, this._nestedArray = null, this._lookupCache = {}, this._needsRecursiveFeatureResolution = !0, this._needsRecursiveResolve = !0
    }

    function W1K(q) {
        q._nestedArray = null, q._lookupCache = {};
        var K = q;
        while (K = K.parent) K._lookupCache = {};
        return q
    }
    Object.defineProperty(HA.prototype, "nestedArray", {
        get: function() {
            return this._nestedArray || (this._nestedArray = tm8.toArray(this.nested))
        }
    });
    HA.prototype.toJSON = function(K) {
        return tm8.toObject(["options", this.options, "nested", P1K(this.nestedArray, K)])
    };
    HA.prototype.addJSON = function(K) {
        var _ = this;
        if (K)
            for (var z = Object.keys(K), Y = 0, A; Y < z.length; ++Y) A = K[z[Y]], _.add((A.fields !== void 0 ? iJ6.fromJSON : A.values !== void 0 ? rJ6.fromJSON : A.methods !== void 0 ? kS6.fromJSON : A.id !== void 0 ? lt1.fromJSON : HA.fromJSON)(z[Y], A));
        return this
    };
    HA.prototype.get = function(K) {
        return this.nested && this.nested[K] || null
    };
    HA.prototype.getEnum = function(K) {
        if (this.nested && this.nested[K] instanceof rJ6) return this.nested[K].values;
        throw Error("no such enum: " + K)
    };
    HA.prototype.add = function(K) {
        if (!(K instanceof lt1 && K.extend !== void 0 || K instanceof iJ6 || K instanceof hpz || K instanceof rJ6 || K instanceof kS6 || K instanceof HA)) throw TypeError("object must be a valid nested object");
        if (!this.nested) this.nested = {};
        else {
            var _ = this.get(K.name);
            if (_)
                if (_ instanceof HA && K instanceof HA && !(_ instanceof iJ6 || _ instanceof kS6)) {
                    var z = _.nestedArray;
                    for (var Y = 0; Y < z.length; ++Y) K.add(z[Y]);
                    if (this.remove(_), !this.nested) this.nested = {};
                    K.setOptions(_.options, !0)
                } else throw Error("duplicate name '" + K.name + "' in " + this)
        }
        if (this.nested[K.name] = K, !(this instanceof iJ6 || this instanceof kS6 || this instanceof rJ6 || this instanceof lt1)) {
            if (!K._edition) K._edition = K._defaultEdition
        }
        this._needsRecursiveFeatureResolution = !0, this._needsRecursiveResolve = !0;
        var A = this;
        while (A = A.parent) A._needsRecursiveFeatureResolution = !0, A._needsRecursiveResolve = !0;
        return K.onAdd(this), W1K(this)
    };
    HA.prototype.remove = function(K) {
        if (!(K instanceof sm8)) throw TypeError("object must be a ReflectionObject");
        if (K.parent !== this) throw Error(K + " is not a member of " + this);
        if (delete this.nested[K.name], !Object.keys(this.nested).length) this.nested = void 0;
        return K.onRemove(this), W1K(this)
    };
    HA.prototype.define = function(K, _) {
        if (tm8.isString(K)) K = K.split(".");
        else if (!Array.isArray(K)) throw TypeError("illegal path");
        if (K && K.length && K[0] === "") throw Error("path must be relative");
        var z = this;
        while (K.length > 0) {
            var Y = K.shift();
            if (z.nested && z.nested[Y]) {
                if (z = z.nested[Y], !(z instanceof HA)) throw Error("path conflicts with non-namespace objects")
            } else z.add(z = new HA(Y))
        }
        if (_) z.addJSON(_);
        return z
    };
    HA.prototype.resolveAll = function() {
        if (!this._needsRecursiveResolve) return this;
        this._resolveFeaturesRecursive(this._edition);
        var K = this.nestedArray,
            _ = 0;
        this.resolve();
        while (_ < K.length)
            if (K[_] instanceof HA) K[_++].resolveAll();
            else K[_++].resolve();
        return this._needsRecursiveResolve = !1, this
    };
    HA.prototype._resolveFeaturesRecursive = function(K) {
        if (!this._needsRecursiveFeatureResolution) return this;
        return this._needsRecursiveFeatureResolution = !1, K = this._edition || K, sm8.prototype._resolveFeaturesRecursive.call(this, K), this.nestedArray.forEach((_) => {
            _._resolveFeaturesRecursive(K)
        }), this
    };
    HA.prototype.lookup = function(K, _, z) {
        if (typeof _ === "boolean") z = _, _ = void 0;
        else if (_ && !Array.isArray(_)) _ = [_];
        if (tm8.isString(K) && K.length) {
            if (K === ".") return this.root;
            K = K.split(".")
        } else if (!K.length) return this;
        var Y = K.join(".");
        if (K[0] === "") return this.root.lookup(K.slice(1), _);
        var A = this.root._fullyQualifiedObjects && this.root._fullyQualifiedObjects["." + Y];
        if (A && (!_ || _.indexOf(A.constructor) > -1)) return A;
        if (A = this._lookupImpl(K, Y), A && (!_ || _.indexOf(A.constructor) > -1)) return A;
        if (z) return null;
        var O = this;
        while (O.parent) {
            if (A = O.parent._lookupImpl(K, Y), A && (!_ || _.indexOf(A.constructor) > -1)) return A;
            O = O.parent
        }
        return null
    };
    HA.prototype._lookupImpl = function(K, _) {
        if (Object.prototype.hasOwnProperty.call(this._lookupCache, _)) return this._lookupCache[_];
        var z = this.get(K[0]),
            Y = null;
        if (z) {
            if (K.length === 1) Y = z;
            else if (z instanceof HA) K = K.slice(1), Y = z._lookupImpl(K, K.join("."))
        } else
            for (var A = 0; A < this.nestedArray.length; ++A)
                if (this._nestedArray[A] instanceof HA && (z = this._nestedArray[A]._lookupImpl(K, _))) Y = z;
        return this._lookupCache[_] = Y, Y
    };
    HA.prototype.lookupType = function(K) {
        var _ = this.lookup(K, [iJ6]);
        if (!_) throw Error("no such type: " + K);
        return _
    };
    HA.prototype.lookupEnum = function(K) {
        var _ = this.lookup(K, [rJ6]);
        if (!_) throw Error("no such Enum '" + K + "' in " + this);
        return _
    };
    HA.prototype.lookupTypeOrEnum = function(K) {
        var _ = this.lookup(K, [iJ6, rJ6]);
        if (!_) throw Error("no such Type or Enum '" + K + "' in " + this);
        return _
    };
    HA.prototype.lookupService = function(K) {
        var _ = this.lookup(K, [kS6]);
        if (!_) throw Error("no such Service '" + K + "' in " + this);
        return _
    };
    HA._configure = function(q, K, _) {
        iJ6 = q, kS6 = K, rJ6 = _
    }
})
// @from(Ln 310601, Col 4)
em8 = p((t52, Z1K) => {
    Z1K.exports = Wt;
    var nt1 = h36();
    ((Wt.prototype = Object.create(nt1.prototype)).constructor = Wt).className = "MapField";
    var Rpz = aJ6(),
        e78 = dD();

    function Wt(q, K, _, z, Y, A) {
        if (nt1.call(this, q, K, z, void 0, void 0, Y, A), !e78.isString(_)) throw TypeError("keyType must be a string");
        this.keyType = _, this.resolvedKeyType = null, this.map = !0
    }
    Wt.fromJSON = function(K, _) {
        return new Wt(K, _.id, _.keyType, _.type, _.options, _.comment)
    };
    Wt.prototype.toJSON = function(K) {
        var _ = K ? Boolean(K.keepComments) : !1;
        return e78.toObject(["keyType", this.keyType, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", _ ? this.comment : void 0])
    };
    Wt.prototype.resolve = function() {
        if (this.resolved) return this;
        if (Rpz.mapKey[this.keyType] === void 0) throw Error("invalid key type: " + this.keyType);
        return nt1.prototype.resolve.call(this)
    };
    Wt.d = function(K, _, z) {
        if (typeof z === "function") z = e78.decorateType(z).name;
        else if (z && typeof z === "object") z = e78.decorateEnum(z).name;
        return function(A, O) {
            e78.decorateType(A.constructor).add(new Wt(O, K, _, z))
        }
    }
})
// @from(Ln 310632, Col 4)
qB8 = p((e52, f1K) => {
    f1K.exports = sJ6;
    var it1 = R36();
    ((sJ6.prototype = Object.create(it1.prototype)).constructor = sJ6).className = "Method";
    var ES6 = dD();

    function sJ6(q, K, _, z, Y, A, O, w, $) {
        if (ES6.isObject(Y)) O = Y, Y = A = void 0;
        else if (ES6.isObject(A)) O = A, A = void 0;
        if (!(K === void 0 || ES6.isString(K))) throw TypeError("type must be a string");
        if (!ES6.isString(_)) throw TypeError("requestType must be a string");
        if (!ES6.isString(z)) throw TypeError("responseType must be a string");
        it1.call(this, q, O), this.type = K || "rpc", this.requestType = _, this.requestStream = Y ? !0 : void 0, this.responseType = z, this.responseStream = A ? !0 : void 0, this.resolvedRequestType = null, this.resolvedResponseType = null, this.comment = w, this.parsedOptions = $
    }
    sJ6.fromJSON = function(K, _) {
        return new sJ6(K, _.type, _.requestType, _.responseType, _.requestStream, _.responseStream, _.options, _.comment, _.parsedOptions)
    };
    sJ6.prototype.toJSON = function(K) {
        var _ = K ? Boolean(K.keepComments) : !1;
        return ES6.toObject(["type", this.type !== "rpc" && this.type || void 0, "requestType", this.requestType, "requestStream", this.requestStream, "responseType", this.responseType, "responseStream", this.responseStream, "options", this.options, "comment", _ ? this.comment : void 0, "parsedOptions", this.parsedOptions])
    };
    sJ6.prototype.resolve = function() {
        if (this.resolved) return this;
        return this.resolvedRequestType = this.parent.lookupType(this.requestType), this.resolvedResponseType = this.parent.lookupType(this.responseType), it1.prototype.resolve.call(this)
    }
})
// @from(Ln 310658, Col 4)
KB8 = p((q32, v1K) => {
    v1K.exports = eR;
    var Dt = NS6();
    ((eR.prototype = Object.create(Dt.prototype)).constructor = eR).className = "Service";
    var rt1 = qB8(),
        qq8 = dD(),
        Spz = Us1();

    function eR(q, K) {
        Dt.call(this, q, K), this.methods = {}, this._methodsArray = null
    }
    eR.fromJSON = function(K, _) {
        var z = new eR(K, _.options);
        if (_.methods)
            for (var Y = Object.keys(_.methods), A = 0; A < Y.length; ++A) z.add(rt1.fromJSON(Y[A], _.methods[Y[A]]));
        if (_.nested) z.addJSON(_.nested);
        if (_.edition) z._edition = _.edition;
        return z.comment = _.comment, z._defaultEdition = "proto3", z
    };
    eR.prototype.toJSON = function(K) {
        var _ = Dt.prototype.toJSON.call(this, K),
            z = K ? Boolean(K.keepComments) : !1;
        return qq8.toObject(["edition", this._editionToJSON(), "options", _ && _.options || void 0, "methods", Dt.arrayToJSON(this.methodsArray, K) || {}, "nested", _ && _.nested || void 0, "comment", z ? this.comment : void 0])
    };
    Object.defineProperty(eR.prototype, "methodsArray", {
        get: function() {
            return this._methodsArray || (this._methodsArray = qq8.toArray(this.methods))
        }
    });

    function G1K(q) {
        return q._methodsArray = null, q
    }
    eR.prototype.get = function(K) {
        return this.methods[K] || Dt.prototype.get.call(this, K)
    };
    eR.prototype.resolveAll = function() {
        if (!this._needsRecursiveResolve) return this;
        Dt.prototype.resolve.call(this);
        var K = this.methodsArray;
        for (var _ = 0; _ < K.length; ++_) K[_].resolve();
        return this
    };
    eR.prototype._resolveFeaturesRecursive = function(K) {
        if (!this._needsRecursiveFeatureResolution) return this;
        return K = this._edition || K, Dt.prototype._resolveFeaturesRecursive.call(this, K), this.methodsArray.forEach((_) => {
            _._resolveFeaturesRecursive(K)
        }), this
    };
    eR.prototype.add = function(K) {
        if (this.get(K.name)) throw Error("duplicate name '" + K.name + "' in " + this);
        if (K instanceof rt1) return this.methods[K.name] = K, K.parent = this, G1K(this);
        return Dt.prototype.add.call(this, K)
    };
    eR.prototype.remove = function(K) {
        if (K instanceof rt1) {
            if (this.methods[K.name] !== K) throw Error(K + " is not a member of " + this);
            return delete this.methods[K.name], K.parent = null, G1K(this)
        }
        return Dt.prototype.remove.call(this, K)
    };
    eR.prototype.create = function(K, _, z) {
        var Y = new Spz.Service(K, _, z);
        for (var A = 0, O; A < this.methodsArray.length; ++A) {
            var w = qq8.lcFirst((O = this._methodsArray[A]).resolve().name).replace(/[^$\w_]/g, "");
            Y[w] = qq8.codegen(["r", "c"], qq8.isReserved(w) ? w + "_" : w)("return this.rpcCall(m,q,s,r,c)")({
                m: O,
                q: O.resolvedRequestType.ctor,
                s: O.resolvedResponseType.ctor
            })
        }
        return Y
    }
})
// @from(Ln 310732, Col 4)
_B8 = p((K32, T1K) => {
    T1K.exports = Jl;
    var Cpz = Ol();

    function Jl(q) {
        if (q)
            for (var K = Object.keys(q), _ = 0; _ < K.length; ++_) this[K[_]] = q[K[_]]
    }
    Jl.create = function(K) {
        return this.$type.create(K)
    };
    Jl.encode = function(K, _) {
        return this.$type.encode(K, _)
    };
    Jl.encodeDelimited = function(K, _) {
        return this.$type.encodeDelimited(K, _)
    };
    Jl.decode = function(K) {
        return this.$type.decode(K)
    };
    Jl.decodeDelimited = function(K) {
        return this.$type.decodeDelimited(K)
    };
    Jl.verify = function(K) {
        return this.$type.verify(K)
    };
    Jl.fromObject = function(K) {
        return this.$type.fromObject(K)
    };
    Jl.toObject = function(K, _) {
        return this.$type.toObject(K, _)
    };
    Jl.prototype.toJSON = function() {
        return this.$type.toObject(this, Cpz.toJSONOptions)
    }
})
// @from(Ln 310768, Col 4)
ot1 = p((_32, k1K) => {
    k1K.exports = xpz;
    var bpz = VF(),
        Zt = aJ6(),
        V1K = dD();

    function Ipz(q) {
        return "missing required '" + q.name + "'"
    }

    function xpz(q) {
        var K = V1K.codegen(["r", "l", "e"], q.name + "$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (q.fieldsArray.filter(function(w) {
                return w.map
            }).length ? ",k,value" : ""))("while(r.pos<c){")("var t=r.uint32()")("if(t===e)")("break")("switch(t>>>3){"),
            _ = 0;
        for (; _ < q.fieldsArray.length; ++_) {
            var z = q._fieldsArray[_].resolve(),
                Y = z.resolvedType instanceof bpz ? "int32" : z.type,
                A = "m" + V1K.safeProp(z.name);
            if (K("case %i: {", z.id), z.map) {
                if (K("if(%s===util.emptyObject)", A)("%s={}", A)("var c2 = r.uint32()+r.pos"), Zt.defaults[z.keyType] !== void 0) K("k=%j", Zt.defaults[z.keyType]);
                else K("k=null");
                if (Zt.defaults[Y] !== void 0) K("value=%j", Zt.defaults[Y]);
                else K("value=null");
                if (K("while(r.pos<c2){")("var tag2=r.uint32()")("switch(tag2>>>3){")("case 1: k=r.%s(); break", z.keyType)("case 2:"), Zt.basic[Y] === void 0) K("value=types[%i].decode(r,r.uint32())", _);
                else K("value=r.%s()", Y);
                if (K("break")("default:")("r.skipType(tag2&7)")("break")("}")("}"), Zt.long[z.keyType] !== void 0) K('%s[typeof k==="object"?util.longToHash(k):k]=value', A);
                else K("%s[k]=value", A)
            } else if (z.repeated) {
                if (K("if(!(%s&&%s.length))", A, A)("%s=[]", A), Zt.packed[Y] !== void 0) K("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())", A, Y)("}else");
                if (Zt.basic[Y] === void 0) K(z.delimited ? "%s.push(types[%i].decode(r,undefined,((t&~7)|4)))" : "%s.push(types[%i].decode(r,r.uint32()))", A, _);
                else K("%s.push(r.%s())", A, Y)
            } else if (Zt.basic[Y] === void 0) K(z.delimited ? "%s=types[%i].decode(r,undefined,((t&~7)|4))" : "%s=types[%i].decode(r,r.uint32())", A, _);
            else K("%s=r.%s()", A, Y);
            K("break")("}")
        }
        K("default:")("r.skipType(t&7)")("break")("}")("}");
        for (_ = 0; _ < q._fieldsArray.length; ++_) {
            var O = q._fieldsArray[_];
            if (O.required) K("if(!m.hasOwnProperty(%j))", O.name)("throw util.ProtocolError(%j,{instance:m})", Ipz(O))
        }
        return K("return m")
    }
})
// @from(Ln 310812, Col 4)
tt1 = p((z32, N1K) => {
    N1K.exports = Bpz;
    var upz = VF(),
        at1 = dD();

    function gx(q, K) {
        return q.name + ": " + K + (q.repeated && K !== "array" ? "[]" : q.map && K !== "object" ? "{k:" + q.keyType + "}" : "") + " expected"
    }

    function st1(q, K, _, z) {
        if (K.resolvedType)
            if (K.resolvedType instanceof upz) {
                q("switch(%s){", z)("default:")("return%j", gx(K, "enum value"));
                for (var Y = Object.keys(K.resolvedType.values), A = 0; A < Y.length; ++A) q("case %i:", K.resolvedType.values[Y[A]]);
                q("break")("}")
            } else q("{")("var e=types[%i].verify(%s);", _, z)("if(e)")("return%j+e", K.name + ".")("}");
        else switch (K.type) {
            case "int32":
            case "uint32":
            case "sint32":
            case "fixed32":
            case "sfixed32":
                q("if(!util.isInteger(%s))", z)("return%j", gx(K, "integer"));
                break;
            case "int64":
            case "uint64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
                q("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", z, z, z, z)("return%j", gx(K, "integer|Long"));
                break;
            case "float":
            case "double":
                q('if(typeof %s!=="number")', z)("return%j", gx(K, "number"));
                break;
            case "bool":
                q('if(typeof %s!=="boolean")', z)("return%j", gx(K, "boolean"));
                break;
            case "string":
                q("if(!util.isString(%s))", z)("return%j", gx(K, "string"));
                break;
            case "bytes":
                q('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))', z, z, z)("return%j", gx(K, "buffer"));
                break
        }
        return q
    }

    function mpz(q, K, _) {
        switch (K.keyType) {
            case "int32":
            case "uint32":
            case "sint32":
            case "fixed32":
            case "sfixed32":
                q("if(!util.key32Re.test(%s))", _)("return%j", gx(K, "integer key"));
                break;
            case "int64":
            case "uint64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
                q("if(!util.key64Re.test(%s))", _)("return%j", gx(K, "integer|Long key"));
                break;
            case "bool":
                q("if(!util.key2Re.test(%s))", _)("return%j", gx(K, "boolean key"));
                break
        }
        return q
    }

    function Bpz(q) {
        var K = at1.codegen(["m"], q.name + "$verify")('if(typeof m!=="object"||m===null)')("return%j", "object expected"),
            _ = q.oneofsArray,
            z = {};
        if (_.length) K("var p={}");
        for (var Y = 0; Y < q.fieldsArray.length; ++Y) {
            var A = q._fieldsArray[Y].resolve(),
                O = "m" + at1.safeProp(A.name);
            if (A.optional) K("if(%s!=null&&m.hasOwnProperty(%j)){", O, A.name);
            if (A.map) K("if(!util.isObject(%s))", O)("return%j", gx(A, "object"))("var k=Object.keys(%s)", O)("for(var i=0;i<k.length;++i){"), mpz(K, A, "k[i]"), st1(K, A, Y, O + "[k[i]]")("}");
            else if (A.repeated) K("if(!Array.isArray(%s))", O)("return%j", gx(A, "array"))("for(var i=0;i<%s.length;++i){", O), st1(K, A, Y, O + "[i]")("}");
            else {
                if (A.partOf) {
                    var w = at1.safeProp(A.partOf.name);
                    if (z[A.partOf.name] === 1) K("if(p%s===1)", w)("return%j", A.partOf.name + ": multiple values");
                    z[A.partOf.name] = 1, K("p%s=1", w)
                }
                st1(K, A, Y, O)
            }
            if (A.optional) K("}")
        }
        return K("return null")
    }
})