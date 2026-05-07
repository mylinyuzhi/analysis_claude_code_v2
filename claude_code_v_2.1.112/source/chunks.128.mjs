
// @from(Ln 319233, Col 4)
b4K = p((S4K) => {
    Object.defineProperty(S4K, "__esModule", {
        value: !0
    });
    S4K.ServerDuplexStreamImpl = S4K.ServerWritableStreamImpl = S4K.ServerReadableStreamImpl = S4K.ServerUnaryCallImpl = void 0;
    S4K.serverErrorToStatus = Y67;
    var Mdz = d6("events"),
        _67 = d6("stream"),
        z67 = e_(),
        E4K = QD();

    function Y67(q, K) {
        var _;
        let z = {
            code: z67.Status.UNKNOWN,
            details: "message" in q ? q.message : "Unknown Error",
            metadata: (_ = K !== null && K !== void 0 ? K : q.metadata) !== null && _ !== void 0 ? _ : null
        };
        if ("code" in q && typeof q.code === "number" && Number.isInteger(q.code)) {
            if (z.code = q.code, "details" in q && typeof q.details === "string") z.details = q.details
        }
        return z
    }
    class y4K extends Mdz.EventEmitter {
        constructor(q, K, _, z) {
            super();
            this.path = q, this.call = K, this.metadata = _, this.request = z, this.cancelled = !1
        }
        getPeer() {
            return this.call.getPeer()
        }
        sendMetadata(q) {
            this.call.sendMetadata(q)
        }
        getDeadline() {
            return this.call.getDeadline()
        }
        getPath() {
            return this.path
        }
        getHost() {
            return this.call.getHost()
        }
        getAuthContext() {
            return this.call.getAuthContext()
        }
        getMetricsRecorder() {
            return this.call.getMetricsRecorder()
        }
    }
    S4K.ServerUnaryCallImpl = y4K;
    class L4K extends _67.Readable {
        constructor(q, K, _) {
            super({
                objectMode: !0
            });
            this.path = q, this.call = K, this.metadata = _, this.cancelled = !1
        }
        _read(q) {
            this.call.startRead()
        }
        getPeer() {
            return this.call.getPeer()
        }
        sendMetadata(q) {
            this.call.sendMetadata(q)
        }
        getDeadline() {
            return this.call.getDeadline()
        }
        getPath() {
            return this.path
        }
        getHost() {
            return this.call.getHost()
        }
        getAuthContext() {
            return this.call.getAuthContext()
        }
        getMetricsRecorder() {
            return this.call.getMetricsRecorder()
        }
    }
    S4K.ServerReadableStreamImpl = L4K;
    class h4K extends _67.Writable {
        constructor(q, K, _, z) {
            super({
                objectMode: !0
            });
            this.path = q, this.call = K, this.metadata = _, this.request = z, this.pendingStatus = {
                code: z67.Status.OK,
                details: "OK"
            }, this.cancelled = !1, this.trailingMetadata = new E4K.Metadata, this.on("error", (Y) => {
                this.pendingStatus = Y67(Y), this.end()
            })
        }
        getPeer() {
            return this.call.getPeer()
        }
        sendMetadata(q) {
            this.call.sendMetadata(q)
        }
        getDeadline() {
            return this.call.getDeadline()
        }
        getPath() {
            return this.path
        }
        getHost() {
            return this.call.getHost()
        }
        getAuthContext() {
            return this.call.getAuthContext()
        }
        getMetricsRecorder() {
            return this.call.getMetricsRecorder()
        }
        _write(q, K, _) {
            this.call.sendMessage(q, _)
        }
        _final(q) {
            var K;
            q(null), this.call.sendStatus(Object.assign(Object.assign({}, this.pendingStatus), {
                metadata: (K = this.pendingStatus.metadata) !== null && K !== void 0 ? K : this.trailingMetadata
            }))
        }
        end(q) {
            if (q) this.trailingMetadata = q;
            return super.end()
        }
    }
    S4K.ServerWritableStreamImpl = h4K;
    class R4K extends _67.Duplex {
        constructor(q, K, _) {
            super({
                objectMode: !0
            });
            this.path = q, this.call = K, this.metadata = _, this.pendingStatus = {
                code: z67.Status.OK,
                details: "OK"
            }, this.cancelled = !1, this.trailingMetadata = new E4K.Metadata, this.on("error", (z) => {
                this.pendingStatus = Y67(z), this.end()
            })
        }
        getPeer() {
            return this.call.getPeer()
        }
        sendMetadata(q) {
            this.call.sendMetadata(q)
        }
        getDeadline() {
            return this.call.getDeadline()
        }
        getPath() {
            return this.path
        }
        getHost() {
            return this.call.getHost()
        }
        getAuthContext() {
            return this.call.getAuthContext()
        }
        getMetricsRecorder() {
            return this.call.getMetricsRecorder()
        }
        _read(q) {
            this.call.startRead()
        }
        _write(q, K, _) {
            this.call.sendMessage(q, _)
        }
        _final(q) {
            var K;
            q(null), this.call.sendStatus(Object.assign(Object.assign({}, this.pendingStatus), {
                metadata: (K = this.pendingStatus.metadata) !== null && K !== void 0 ? K : this.trailingMetadata
            }))
        }
        end(q) {
            if (q) this.trailingMetadata = q;
            return super.end()
        }
    }
    S4K.ServerDuplexStreamImpl = R4K
})
// @from(Ln 319417, Col 4)
BB8 = p((I4K) => {
    Object.defineProperty(I4K, "__esModule", {
        value: !0
    });
    I4K.ServerCredentials = void 0;
    I4K.createCertificateProviderServerCredentials = fdz;
    I4K.createServerCredentialsWithInterceptors = Gdz;
    var A67 = vt1();
    class mS6 {
        constructor(q, K) {
            this.serverConstructorOptions = q, this.watchers = new Set, this.latestContextOptions = null, this.latestContextOptions = K !== null && K !== void 0 ? K : null
        }
        _addWatcher(q) {
            this.watchers.add(q)
        }
        _removeWatcher(q) {
            this.watchers.delete(q)
        }
        getWatcherCount() {
            return this.watchers.size
        }
        updateSecureContextOptions(q) {
            this.latestContextOptions = q;
            for (let K of this.watchers) K(this.latestContextOptions)
        }
        _isSecure() {
            return this.serverConstructorOptions !== null
        }
        _getSecureContextOptions() {
            return this.latestContextOptions
        }
        _getConstructorOptions() {
            return this.serverConstructorOptions
        }
        _getInterceptors() {
            return []
        }
        static createInsecure() {
            return new O67
        }
        static createSsl(q, K, _ = !1) {
            var z;
            if (q !== null && !Buffer.isBuffer(q)) throw TypeError("rootCerts must be null or a Buffer");
            if (!Array.isArray(K)) throw TypeError("keyCertPairs must be an array");
            if (typeof _ !== "boolean") throw TypeError("checkClientCertificate must be a boolean");
            let Y = [],
                A = [];
            for (let O = 0; O < K.length; O++) {
                let w = K[O];
                if (w === null || typeof w !== "object") throw TypeError(`keyCertPair[${O}] must be an object`);
                if (!Buffer.isBuffer(w.private_key)) throw TypeError(`keyCertPair[${O}].private_key must be a Buffer`);
                if (!Buffer.isBuffer(w.cert_chain)) throw TypeError(`keyCertPair[${O}].cert_chain must be a Buffer`);
                Y.push(w.cert_chain), A.push(w.private_key)
            }
            return new w67({
                requestCert: _,
                ciphers: A67.CIPHER_SUITES
            }, {
                ca: (z = q !== null && q !== void 0 ? q : (0, A67.getDefaultRootsData)()) !== null && z !== void 0 ? z : void 0,
                cert: Y,
                key: A
            })
        }
    }
    I4K.ServerCredentials = mS6;
    class O67 extends mS6 {
        constructor() {
            super(null)
        }
        _getSettings() {
            return null
        }
        _equals(q) {
            return q instanceof O67
        }
    }
    class w67 extends mS6 {
        constructor(q, K) {
            super(q, K);
            this.options = Object.assign(Object.assign({}, q), K)
        }
        _equals(q) {
            if (this === q) return !0;
            if (!(q instanceof w67)) return !1;
            if (Buffer.isBuffer(this.options.ca) && Buffer.isBuffer(q.options.ca)) {
                if (!this.options.ca.equals(q.options.ca)) return !1
            } else if (this.options.ca !== q.options.ca) return !1;
            if (Array.isArray(this.options.cert) && Array.isArray(q.options.cert)) {
                if (this.options.cert.length !== q.options.cert.length) return !1;
                for (let K = 0; K < this.options.cert.length; K++) {
                    let _ = this.options.cert[K],
                        z = q.options.cert[K];
                    if (Buffer.isBuffer(_) && Buffer.isBuffer(z)) {
                        if (!_.equals(z)) return !1
                    } else if (_ !== z) return !1
                }
            } else if (this.options.cert !== q.options.cert) return !1;
            if (Array.isArray(this.options.key) && Array.isArray(q.options.key)) {
                if (this.options.key.length !== q.options.key.length) return !1;
                for (let K = 0; K < this.options.key.length; K++) {
                    let _ = this.options.key[K],
                        z = q.options.key[K];
                    if (Buffer.isBuffer(_) && Buffer.isBuffer(z)) {
                        if (!_.equals(z)) return !1
                    } else if (_ !== z) return !1
                }
            } else if (this.options.key !== q.options.key) return !1;
            if (this.options.requestCert !== q.options.requestCert) return !1;
            return !0
        }
    }
    class $67 extends mS6 {
        constructor(q, K, _) {
            super({
                requestCert: K !== null,
                rejectUnauthorized: _,
                ciphers: A67.CIPHER_SUITES
            });
            this.identityCertificateProvider = q, this.caCertificateProvider = K, this.requireClientCertificate = _, this.latestCaUpdate = null, this.latestIdentityUpdate = null, this.caCertificateUpdateListener = this.handleCaCertificateUpdate.bind(this), this.identityCertificateUpdateListener = this.handleIdentityCertitificateUpdate.bind(this)
        }
        _addWatcher(q) {
            var K;
            if (this.getWatcherCount() === 0)(K = this.caCertificateProvider) === null || K === void 0 || K.addCaCertificateListener(this.caCertificateUpdateListener), this.identityCertificateProvider.addIdentityCertificateListener(this.identityCertificateUpdateListener);
            super._addWatcher(q)
        }
        _removeWatcher(q) {
            var K;
            if (super._removeWatcher(q), this.getWatcherCount() === 0)(K = this.caCertificateProvider) === null || K === void 0 || K.removeCaCertificateListener(this.caCertificateUpdateListener), this.identityCertificateProvider.removeIdentityCertificateListener(this.identityCertificateUpdateListener)
        }
        _equals(q) {
            if (this === q) return !0;
            if (!(q instanceof $67)) return !1;
            return this.caCertificateProvider === q.caCertificateProvider && this.identityCertificateProvider === q.identityCertificateProvider && this.requireClientCertificate === q.requireClientCertificate
        }
        calculateSecureContextOptions() {
            var q;
            if (this.latestIdentityUpdate === null) return null;
            if (this.caCertificateProvider !== null && this.latestCaUpdate === null) return null;
            return {
                ca: (q = this.latestCaUpdate) === null || q === void 0 ? void 0 : q.caCertificate,
                cert: [this.latestIdentityUpdate.certificate],
                key: [this.latestIdentityUpdate.privateKey]
            }
        }
        finalizeUpdate() {
            let q = this.calculateSecureContextOptions();
            this.updateSecureContextOptions(q)
        }
        handleCaCertificateUpdate(q) {
            this.latestCaUpdate = q, this.finalizeUpdate()
        }
        handleIdentityCertitificateUpdate(q) {
            this.latestIdentityUpdate = q, this.finalizeUpdate()
        }
    }

    function fdz(q, K, _) {
        return new $67(q, K, _)
    }
    class j67 extends mS6 {
        constructor(q, K) {
            super({});
            this.childCredentials = q, this.interceptors = K
        }
        _isSecure() {
            return this.childCredentials._isSecure()
        }
        _equals(q) {
            if (!(q instanceof j67)) return !1;
            if (!this.childCredentials._equals(q.childCredentials)) return !1;
            if (this.interceptors.length !== q.interceptors.length) return !1;
            for (let K = 0; K < this.interceptors.length; K++)
                if (this.interceptors[K] !== q.interceptors[K]) return !1;
            return !0
        }
        _getInterceptors() {
            return this.interceptors
        }
        _addWatcher(q) {
            this.childCredentials._addWatcher(q)
        }
        _removeWatcher(q) {
            this.childCredentials._removeWatcher(q)
        }
        _getConstructorOptions() {
            return this.childCredentials._getConstructorOptions()
        }
        _getSecureContextOptions() {
            return this.childCredentials._getSecureContextOptions()
        }
    }

    function Gdz(q, K) {
        return new j67(q, K)
    }
})
// @from(Ln 319613, Col 4)
kq8 = p((u4K) => {
    Object.defineProperty(u4K, "__esModule", {
        value: !0
    });
    u4K.durationMessageToDuration = Vdz;
    u4K.msToDuration = kdz;
    u4K.durationToMs = Ndz;
    u4K.isDuration = Edz;
    u4K.isDurationMessage = ydz;
    u4K.parseDuration = hdz;
    u4K.durationToString = Rdz;

    function Vdz(q) {
        return {
            seconds: Number.parseInt(q.seconds),
            nanos: q.nanos
        }
    }

    function kdz(q) {
        return {
            seconds: q / 1000 | 0,
            nanos: q % 1000 * 1e6 | 0
        }
    }

    function Ndz(q) {
        return q.seconds * 1000 + q.nanos / 1e6 | 0
    }

    function Edz(q) {
        return typeof q.seconds === "number" && typeof q.nanos === "number"
    }

    function ydz(q) {
        return typeof q.seconds === "string" && typeof q.nanos === "number"
    }
    var Ldz = /^(\d+)(?:\.(\d+))?s$/;

    function hdz(q) {
        let K = q.match(Ldz);
        if (!K) return null;
        return {
            seconds: Number.parseInt(K[1], 10),
            nanos: K[2] ? Number.parseInt(K[2].padEnd(9, "0"), 10) : 0
        }
    }

    function Rdz(q) {
        if (q.nanos === 0) return `${q.seconds}s`;
        let K;
        if (q.nanos % 1e6 === 0) K = 1e6;
        else if (q.nanos % 1000 === 0) K = 1000;
        else K = 1;
        return `${q.seconds}.${q.nanos/K}s`
    }
})
// @from(Ln 319670, Col 4)
FB8 = p((n4K) => {
    var __dirname = "/home/runner/code/tmp/claude-cli-external-build-2239/node_modules/@grpc/grpc-js/build/src";
    Object.defineProperty(n4K, "__esModule", {
        value: !0
    });
    n4K.OrcaOobMetricsSubchannelWrapper = n4K.GRPC_METRICS_HEADER = n4K.ServerMetricRecorder = n4K.PerRequestMetricRecorder = void 0;
    n4K.createOrcaClient = U4K;
    n4K.createMetricsReader = ddz;
    var Bdz = im8(),
        H67 = kq8(),
        pdz = DS6(),
        Fdz = Tq8(),
        m4K = e_(),
        gdz = ZS6(),
        Udz = ik(),
        B4K = null;

    function pB8() {
        if (B4K) return B4K;
        let q = Le1().loadSync,
            K = q("xds/service/orca/v3/orca.proto", {
                keepCase: !0,
                longs: String,
                enums: String,
                defaults: !0,
                oneofs: !0,
                includeDirs: [`${__dirname}/../../proto/xds`, `${__dirname}/../../proto/protoc-gen-validate`]
            });
        return (0, Bdz.loadPackageDefinition)(K)
    }
    class F4K {
        constructor() {
            this.message = {}
        }
        recordRequestCostMetric(q, K) {
            if (!this.message.request_cost) this.message.request_cost = {};
            this.message.request_cost[q] = K
        }
        recordUtilizationMetric(q, K) {
            if (!this.message.utilization) this.message.utilization = {};
            this.message.utilization[q] = K
        }
        recordNamedMetric(q, K) {
            if (!this.message.named_metrics) this.message.named_metrics = {};
            this.message.named_metrics[q] = K
        }
        recordCPUUtilizationMetric(q) {
            this.message.cpu_utilization = q
        }
        recordMemoryUtilizationMetric(q) {
            this.message.mem_utilization = q
        }
        recordApplicationUtilizationMetric(q) {
            this.message.application_utilization = q
        }
        recordQpsMetric(q) {
            this.message.rps_fractional = q
        }
        recordEpsMetric(q) {
            this.message.eps = q
        }
        serialize() {
            return pB8().xds.data.orca.v3.OrcaLoadReport.serialize(this.message)
        }
    }
    n4K.PerRequestMetricRecorder = F4K;
    var Qdz = 30000;
    class g4K {
        constructor() {
            this.message = {}, this.serviceImplementation = {
                StreamCoreMetrics: (q) => {
                    let K = q.request.report_interval ? (0, H67.durationToMs)((0, H67.durationMessageToDuration)(q.request.report_interval)) : Qdz,
                        _ = setInterval(() => {
                            q.write(this.message)
                        }, K);
                    q.on("cancelled", () => {
                        clearInterval(_)
                    })
                }
            }
        }
        putUtilizationMetric(q, K) {
            if (!this.message.utilization) this.message.utilization = {};
            this.message.utilization[q] = K
        }
        setAllUtilizationMetrics(q) {
            this.message.utilization = Object.assign({}, q)
        }
        deleteUtilizationMetric(q) {
            var K;
            (K = this.message.utilization) === null || K === void 0 || delete K[q]
        }
        setCpuUtilizationMetric(q) {
            this.message.cpu_utilization = q
        }
        deleteCpuUtilizationMetric() {
            delete this.message.cpu_utilization
        }
        setApplicationUtilizationMetric(q) {
            this.message.application_utilization = q
        }
        deleteApplicationUtilizationMetric() {
            delete this.message.application_utilization
        }
        setQpsMetric(q) {
            this.message.rps_fractional = q
        }
        deleteQpsMetric() {
            delete this.message.rps_fractional
        }
        setEpsMetric(q) {
            this.message.eps = q
        }
        deleteEpsMetric() {
            delete this.message.eps
        }
        addToServer(q) {
            let K = pB8().xds.service.orca.v3.OpenRcaService.service;
            q.addService(K, this.serviceImplementation)
        }
    }
    n4K.ServerMetricRecorder = g4K;

    function U4K(q) {
        return new(pB8()).xds.service.orca.v3.OpenRcaService("unused", pdz.ChannelCredentials.createInsecure(), {
            channelOverride: q
        })
    }
    n4K.GRPC_METRICS_HEADER = "endpoint-load-metrics-bin";
    var p4K = "grpc_orca_load_report";

    function ddz(q, K) {
        return (_, z, Y) => {
            let A = Y.getOpaque(p4K);
            if (A) q(A);
            else {
                let O = Y.get(n4K.GRPC_METRICS_HEADER);
                if (O.length > 0) A = pB8().xds.data.orca.v3.OrcaLoadReport.deserialize(O[0]), q(A), Y.setOpaque(p4K, A)
            }
            if (K) K(_, z, Y)
        }
    }
    var Q4K = "orca_oob_metrics";
    class d4K {
        constructor(q, K) {
            this.metricsListener = q, this.intervalMs = K, this.dataProducer = null
        }
        setSubchannel(q) {
            let K = q.getOrCreateDataProducer(Q4K, cdz);
            this.dataProducer = K, K.addDataWatcher(this)
        }
        destroy() {
            var q;
            (q = this.dataProducer) === null || q === void 0 || q.removeDataWatcher(this)
        }
        getInterval() {
            return this.intervalMs
        }
        onMetricsUpdate(q) {
            this.metricsListener(q)
        }
    }
    class c4K {
        constructor(q) {
            this.subchannel = q, this.dataWatchers = new Set, this.orcaSupported = !0, this.metricsCall = null, this.currentInterval = 1 / 0, this.backoffTimer = new gdz.BackoffTimeout(() => this.updateMetricsSubscription()), this.subchannelStateListener = () => this.updateMetricsSubscription();
            let K = q.getChannel();
            this.client = U4K(K), q.addConnectivityStateListener(this.subchannelStateListener)
        }
        addDataWatcher(q) {
            this.dataWatchers.add(q), this.updateMetricsSubscription()
        }
        removeDataWatcher(q) {
            var K;
            if (this.dataWatchers.delete(q), this.dataWatchers.size === 0) this.subchannel.removeDataProducer(Q4K), (K = this.metricsCall) === null || K === void 0 || K.cancel(), this.metricsCall = null, this.client.close(), this.subchannel.removeConnectivityStateListener(this.subchannelStateListener);
            else this.updateMetricsSubscription()
        }
        updateMetricsSubscription() {
            var q;
            if (this.dataWatchers.size === 0 || !this.orcaSupported || this.subchannel.getConnectivityState() !== Udz.ConnectivityState.READY) return;
            let K = Math.min(...Array.from(this.dataWatchers).map((_) => _.getInterval()));
            if (!this.metricsCall || K !== this.currentInterval) {
                (q = this.metricsCall) === null || q === void 0 || q.cancel(), this.currentInterval = K;
                let _ = this.client.streamCoreMetrics({
                    report_interval: (0, H67.msToDuration)(K)
                });
                this.metricsCall = _, _.on("data", (z) => {
                    this.dataWatchers.forEach((Y) => {
                        Y.onMetricsUpdate(z)
                    })
                }), _.on("error", (z) => {
                    if (this.metricsCall = null, z.code === m4K.Status.UNIMPLEMENTED) {
                        this.orcaSupported = !1;
                        return
                    }
                    if (z.code === m4K.Status.CANCELLED) return;
                    this.backoffTimer.runOnce()
                })
            }
        }
    }
    class l4K extends Fdz.BaseSubchannelWrapper {
        constructor(q, K, _) {
            super(q);
            this.addDataWatcher(new d4K(K, _))
        }
        getWrappedSubchannel() {
            return this.child
        }
    }
    n4K.OrcaOobMetricsSubchannelWrapper = l4K;

    function cdz(q) {
        return new c4K(q)
    }
})
// @from(Ln 319885, Col 4)
P67 = p(($KK) => {
    Object.defineProperty($KK, "__esModule", {
        value: !0
    });
    $KK.BaseServerInterceptingCall = $KK.ServerInterceptingCall = $KK.ResponderBuilder = $KK.ServerListenerBuilder = void 0;
    $KK.isInterceptingServerListener = sdz;
    $KK.getServerInterceptingCall = _cz;
    var QB8 = QD(),
        Iy = e_(),
        BS6 = d6("http2"),
        o4K = Cm8(),
        a4K = d6("zlib"),
        odz = ne1(),
        KKK = o2(),
        adz = d6("tls"),
        s4K = FB8(),
        _KK = "server_call";

    function _X6(q) {
        KKK.trace(Iy.LogVerbosity.DEBUG, _KK, q)
    }
    class zKK {
        constructor() {
            this.metadata = void 0, this.message = void 0, this.halfClose = void 0, this.cancel = void 0
        }
        withOnReceiveMetadata(q) {
            return this.metadata = q, this
        }
        withOnReceiveMessage(q) {
            return this.message = q, this
        }
        withOnReceiveHalfClose(q) {
            return this.halfClose = q, this
        }
        withOnCancel(q) {
            return this.cancel = q, this
        }
        build() {
            return {
                onReceiveMetadata: this.metadata,
                onReceiveMessage: this.message,
                onReceiveHalfClose: this.halfClose,
                onCancel: this.cancel
            }
        }
    }
    $KK.ServerListenerBuilder = zKK;

    function sdz(q) {
        return q.onReceiveMetadata !== void 0 && q.onReceiveMetadata.length === 1
    }
    class YKK {
        constructor(q, K) {
            this.listener = q, this.nextListener = K, this.cancelled = !1, this.processingMetadata = !1, this.hasPendingMessage = !1, this.pendingMessage = null, this.processingMessage = !1, this.hasPendingHalfClose = !1
        }
        processPendingMessage() {
            if (this.hasPendingMessage) this.nextListener.onReceiveMessage(this.pendingMessage), this.pendingMessage = null, this.hasPendingMessage = !1
        }
        processPendingHalfClose() {
            if (this.hasPendingHalfClose) this.nextListener.onReceiveHalfClose(), this.hasPendingHalfClose = !1
        }
        onReceiveMetadata(q) {
            if (this.cancelled) return;
            this.processingMetadata = !0, this.listener.onReceiveMetadata(q, (K) => {
                if (this.processingMetadata = !1, this.cancelled) return;
                this.nextListener.onReceiveMetadata(K), this.processPendingMessage(), this.processPendingHalfClose()
            })
        }
        onReceiveMessage(q) {
            if (this.cancelled) return;
            this.processingMessage = !0, this.listener.onReceiveMessage(q, (K) => {
                if (this.processingMessage = !1, this.cancelled) return;
                if (this.processingMetadata) this.pendingMessage = K, this.hasPendingMessage = !0;
                else this.nextListener.onReceiveMessage(K), this.processPendingHalfClose()
            })
        }
        onReceiveHalfClose() {
            if (this.cancelled) return;
            this.listener.onReceiveHalfClose(() => {
                if (this.cancelled) return;
                if (this.processingMetadata || this.processingMessage) this.hasPendingHalfClose = !0;
                else this.nextListener.onReceiveHalfClose()
            })
        }
        onCancel() {
            this.cancelled = !0, this.listener.onCancel(), this.nextListener.onCancel()
        }
    }
    class AKK {
        constructor() {
            this.start = void 0, this.metadata = void 0, this.message = void 0, this.status = void 0
        }
        withStart(q) {
            return this.start = q, this
        }
        withSendMetadata(q) {
            return this.metadata = q, this
        }
        withSendMessage(q) {
            return this.message = q, this
        }
        withSendStatus(q) {
            return this.status = q, this
        }
        build() {
            return {
                start: this.start,
                sendMetadata: this.metadata,
                sendMessage: this.message,
                sendStatus: this.status
            }
        }
    }
    $KK.ResponderBuilder = AKK;
    var gB8 = {
            onReceiveMetadata: (q, K) => {
                K(q)
            },
            onReceiveMessage: (q, K) => {
                K(q)
            },
            onReceiveHalfClose: (q) => {
                q()
            },
            onCancel: () => {}
        },
        UB8 = {
            start: (q) => {
                q()
            },
            sendMetadata: (q, K) => {
                K(q)
            },
            sendMessage: (q, K) => {
                K(q)
            },
            sendStatus: (q, K) => {
                K(q)
            }
        };
    class OKK {
        constructor(q, K) {
            var _, z, Y, A;
            this.nextCall = q, this.processingMetadata = !1, this.sentMetadata = !1, this.processingMessage = !1, this.pendingMessage = null, this.pendingMessageCallback = null, this.pendingStatus = null, this.responder = {
                start: (_ = K === null || K === void 0 ? void 0 : K.start) !== null && _ !== void 0 ? _ : UB8.start,
                sendMetadata: (z = K === null || K === void 0 ? void 0 : K.sendMetadata) !== null && z !== void 0 ? z : UB8.sendMetadata,
                sendMessage: (Y = K === null || K === void 0 ? void 0 : K.sendMessage) !== null && Y !== void 0 ? Y : UB8.sendMessage,
                sendStatus: (A = K === null || K === void 0 ? void 0 : K.sendStatus) !== null && A !== void 0 ? A : UB8.sendStatus
            }
        }
        processPendingMessage() {
            if (this.pendingMessageCallback) this.nextCall.sendMessage(this.pendingMessage, this.pendingMessageCallback), this.pendingMessage = null, this.pendingMessageCallback = null
        }
        processPendingStatus() {
            if (this.pendingStatus) this.nextCall.sendStatus(this.pendingStatus), this.pendingStatus = null
        }
        start(q) {
            this.responder.start((K) => {
                var _, z, Y, A;
                let O = {
                        onReceiveMetadata: (_ = K === null || K === void 0 ? void 0 : K.onReceiveMetadata) !== null && _ !== void 0 ? _ : gB8.onReceiveMetadata,
                        onReceiveMessage: (z = K === null || K === void 0 ? void 0 : K.onReceiveMessage) !== null && z !== void 0 ? z : gB8.onReceiveMessage,
                        onReceiveHalfClose: (Y = K === null || K === void 0 ? void 0 : K.onReceiveHalfClose) !== null && Y !== void 0 ? Y : gB8.onReceiveHalfClose,
                        onCancel: (A = K === null || K === void 0 ? void 0 : K.onCancel) !== null && A !== void 0 ? A : gB8.onCancel
                    },
                    w = new YKK(O, q);
                this.nextCall.start(w)
            })
        }
        sendMetadata(q) {
            this.processingMetadata = !0, this.sentMetadata = !0, this.responder.sendMetadata(q, (K) => {
                this.processingMetadata = !1, this.nextCall.sendMetadata(K), this.processPendingMessage(), this.processPendingStatus()
            })
        }
        sendMessage(q, K) {
            if (this.processingMessage = !0, !this.sentMetadata) this.sendMetadata(new QB8.Metadata);
            this.responder.sendMessage(q, (_) => {
                if (this.processingMessage = !1, this.processingMetadata) this.pendingMessage = _, this.pendingMessageCallback = K;
                else this.nextCall.sendMessage(_, K)
            })
        }
        sendStatus(q) {
            this.responder.sendStatus(q, (K) => {
                if (this.processingMetadata || this.processingMessage) this.pendingStatus = K;
                else this.nextCall.sendStatus(K)
            })
        }
        startRead() {
            this.nextCall.startRead()
        }
        getPeer() {
            return this.nextCall.getPeer()
        }
        getDeadline() {
            return this.nextCall.getDeadline()
        }
        getHost() {
            return this.nextCall.getHost()
        }
        getAuthContext() {
            return this.nextCall.getAuthContext()
        }
        getConnectionInfo() {
            return this.nextCall.getConnectionInfo()
        }
        getMetricsRecorder() {
            return this.nextCall.getMetricsRecorder()
        }
    }
    $KK.ServerInterceptingCall = OKK;
    var wKK = "grpc-accept-encoding",
        X67 = "grpc-encoding",
        t4K = "grpc-message",
        e4K = "grpc-status",
        J67 = "grpc-timeout",
        tdz = /(\d{1,8})\s*([HMSmun])/,
        edz = {
            H: 3600000,
            M: 60000,
            S: 1000,
            m: 1,
            u: 0.001,
            n: 0.000001
        },
        qcz = {
            [wKK]: "identity,deflate,gzip",
            [X67]: "identity"
        },
        qKK = {
            [BS6.constants.HTTP2_HEADER_STATUS]: BS6.constants.HTTP_STATUS_OK,
            [BS6.constants.HTTP2_HEADER_CONTENT_TYPE]: "application/grpc+proto"
        },
        Kcz = {
            waitForTrailers: !0
        };
    class M67 {
        constructor(q, K, _, z, Y) {
            var A, O;
            if (this.stream = q, this.callEventTracker = _, this.handler = z, this.listener = null, this.deadlineTimer = null, this.deadline = 1 / 0, this.maxSendMessageSize = Iy.DEFAULT_MAX_SEND_MESSAGE_LENGTH, this.maxReceiveMessageSize = Iy.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH, this.cancelled = !1, this.metadataSent = !1, this.wantTrailers = !1, this.cancelNotified = !1, this.incomingEncoding = "identity", this.readQueue = [], this.isReadPending = !1, this.receivedHalfClose = !1, this.streamEnded = !1, this.metricsRecorder = new s4K.PerRequestMetricRecorder, this.stream.once("error", (J) => {}), this.stream.once("close", () => {
                    var J;
                    if (_X6("Request to method " + ((J = this.handler) === null || J === void 0 ? void 0 : J.path) + " stream closed with rstCode " + this.stream.rstCode), this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!1), this.callEventTracker.onCallEnd({
                        code: Iy.Status.CANCELLED,
                        details: "Stream closed before sending status",
                        metadata: null
                    });
                    this.notifyOnCancel()
                }), this.stream.on("data", (J) => {
                    this.handleDataFrame(J)
                }), this.stream.pause(), this.stream.on("end", () => {
                    this.handleEndEvent()
                }), "grpc.max_send_message_length" in Y) this.maxSendMessageSize = Y["grpc.max_send_message_length"];
            if ("grpc.max_receive_message_length" in Y) this.maxReceiveMessageSize = Y["grpc.max_receive_message_length"];
            this.host = (A = K[":authority"]) !== null && A !== void 0 ? A : K.host, this.decoder = new odz.StreamDecoder(this.maxReceiveMessageSize);
            let w = QB8.Metadata.fromHttp2Headers(K);
            if (KKK.isTracerEnabled(_KK)) _X6("Request to " + this.handler.path + " received headers " + JSON.stringify(w.toJSON()));
            let $ = w.get(J67);
            if ($.length > 0) this.handleTimeoutHeader($[0]);
            let j = w.get(X67);
            if (j.length > 0) this.incomingEncoding = j[0];
            w.remove(J67), w.remove(X67), w.remove(wKK), w.remove(BS6.constants.HTTP2_HEADER_ACCEPT_ENCODING), w.remove(BS6.constants.HTTP2_HEADER_TE), w.remove(BS6.constants.HTTP2_HEADER_CONTENT_TYPE), this.metadata = w;
            let H = (O = q.session) === null || O === void 0 ? void 0 : O.socket;
            this.connectionInfo = {
                localAddress: H === null || H === void 0 ? void 0 : H.localAddress,
                localPort: H === null || H === void 0 ? void 0 : H.localPort,
                remoteAddress: H === null || H === void 0 ? void 0 : H.remoteAddress,
                remotePort: H === null || H === void 0 ? void 0 : H.remotePort
            }, this.shouldSendMetrics = !!Y["grpc.server_call_metric_recording"]
        }
        handleTimeoutHeader(q) {
            let K = q.toString().match(tdz);
            if (K === null) {
                let Y = {
                    code: Iy.Status.INTERNAL,
                    details: `Invalid ${J67} value "${q}"`,
                    metadata: null
                };
                process.nextTick(() => {
                    this.sendStatus(Y)
                });
                return
            }
            let _ = +K[1] * edz[K[2]] | 0,
                z = new Date;
            this.deadline = z.setMilliseconds(z.getMilliseconds() + _), this.deadlineTimer = setTimeout(() => {
                let Y = {
                    code: Iy.Status.DEADLINE_EXCEEDED,
                    details: "Deadline exceeded",
                    metadata: null
                };
                this.sendStatus(Y)
            }, _)
        }
        checkCancelled() {
            if (!this.cancelled && (this.stream.destroyed || this.stream.closed)) this.notifyOnCancel(), this.cancelled = !0;
            return this.cancelled
        }
        notifyOnCancel() {
            if (this.cancelNotified) return;
            if (this.cancelNotified = !0, this.cancelled = !0, process.nextTick(() => {
                    var q;
                    (q = this.listener) === null || q === void 0 || q.onCancel()
                }), this.deadlineTimer) clearTimeout(this.deadlineTimer);
            this.stream.resume()
        }
        maybeSendMetadata() {
            if (!this.metadataSent) this.sendMetadata(new QB8.Metadata)
        }
        serializeMessage(q) {
            let K = this.handler.serialize(q),
                _ = K.byteLength,
                z = Buffer.allocUnsafe(_ + 5);
            return z.writeUInt8(0, 0), z.writeUInt32BE(_, 1), K.copy(z, 5), z
        }
        decompressMessage(q, K) {
            let _ = q.subarray(5);
            if (K === "identity") return _;
            else if (K === "deflate" || K === "gzip") {
                let z;
                if (K === "deflate") z = a4K.createInflate();
                else z = a4K.createGunzip();
                return new Promise((Y, A) => {
                    let O = 0,
                        w = [];
                    z.on("data", ($) => {
                        if (w.push($), O += $.byteLength, this.maxReceiveMessageSize !== -1 && O > this.maxReceiveMessageSize) z.destroy(), A({
                            code: Iy.Status.RESOURCE_EXHAUSTED,
                            details: `Received message that decompresses to a size larger than ${this.maxReceiveMessageSize}`
                        })
                    }), z.on("end", () => {
                        Y(Buffer.concat(w))
                    }), z.write(_), z.end()
                })
            } else return Promise.reject({
                code: Iy.Status.UNIMPLEMENTED,
                details: `Received message compressed with unsupported encoding "${K}"`
            })
        }
        async decompressAndMaybePush(q) {
            if (q.type !== "COMPRESSED") throw Error(`Invalid queue entry type: ${q.type}`);
            let _ = q.compressedMessage.readUInt8(0) === 1 ? this.incomingEncoding : "identity",
                z;
            try {
                z = await this.decompressMessage(q.compressedMessage, _)
            } catch (Y) {
                this.sendStatus(Y);
                return
            }
            try {
                q.parsedMessage = this.handler.deserialize(z)
            } catch (Y) {
                this.sendStatus({
                    code: Iy.Status.INTERNAL,
                    details: `Error deserializing request: ${Y.message}`
                });
                return
            }
            q.type = "READABLE", this.maybePushNextMessage()
        }
        maybePushNextMessage() {
            if (this.listener && this.isReadPending && this.readQueue.length > 0 && this.readQueue[0].type !== "COMPRESSED") {
                this.isReadPending = !1;
                let q = this.readQueue.shift();
                if (q.type === "READABLE") this.listener.onReceiveMessage(q.parsedMessage);
                else this.listener.onReceiveHalfClose()
            }
        }
        handleDataFrame(q) {
            var K;
            if (this.checkCancelled()) return;
            _X6("Request to " + this.handler.path + " received data frame of size " + q.length);
            let _;
            try {
                _ = this.decoder.write(q)
            } catch (z) {
                this.sendStatus({
                    code: Iy.Status.RESOURCE_EXHAUSTED,
                    details: z.message
                });
                return
            }
            for (let z of _) {
                this.stream.pause();
                let Y = {
                    type: "COMPRESSED",
                    compressedMessage: z,
                    parsedMessage: null
                };
                this.readQueue.push(Y), this.decompressAndMaybePush(Y), (K = this.callEventTracker) === null || K === void 0 || K.addMessageReceived()
            }
        }
        handleEndEvent() {
            this.readQueue.push({
                type: "HALF_CLOSE",
                compressedMessage: null,
                parsedMessage: null
            }), this.receivedHalfClose = !0, this.maybePushNextMessage()
        }
        start(q) {
            if (_X6("Request to " + this.handler.path + " start called"), this.checkCancelled()) return;
            this.listener = q, q.onReceiveMetadata(this.metadata)
        }
        sendMetadata(q) {
            if (this.checkCancelled()) return;
            if (this.metadataSent) return;
            this.metadataSent = !0;
            let K = q ? q.toHttp2Headers() : null,
                _ = Object.assign(Object.assign(Object.assign({}, qKK), qcz), K);
            this.stream.respond(_, Kcz)
        }
        sendMessage(q, K) {
            if (this.checkCancelled()) return;
            let _;
            try {
                _ = this.serializeMessage(q)
            } catch (z) {
                this.sendStatus({
                    code: Iy.Status.INTERNAL,
                    details: `Error serializing response: ${(0,o4K.getErrorMessage)(z)}`,
                    metadata: null
                });
                return
            }
            if (this.maxSendMessageSize !== -1 && _.length - 5 > this.maxSendMessageSize) {
                this.sendStatus({
                    code: Iy.Status.RESOURCE_EXHAUSTED,
                    details: `Sent message larger than max (${_.length} vs. ${this.maxSendMessageSize})`,
                    metadata: null
                });
                return
            }
            this.maybeSendMetadata(), _X6("Request to " + this.handler.path + " sent data frame of size " + _.length), this.stream.write(_, (z) => {
                var Y;
                if (z) {
                    this.sendStatus({
                        code: Iy.Status.INTERNAL,
                        details: `Error writing message: ${(0,o4K.getErrorMessage)(z)}`,
                        metadata: null
                    });
                    return
                }(Y = this.callEventTracker) === null || Y === void 0 || Y.addMessageSent(), K()
            })
        }
        sendStatus(q) {
            var K, _, z;
            if (this.checkCancelled()) return;
            _X6("Request to method " + ((K = this.handler) === null || K === void 0 ? void 0 : K.path) + " ended with status code: " + Iy.Status[q.code] + " details: " + q.details);
            let Y = (z = (_ = q.metadata) === null || _ === void 0 ? void 0 : _.clone()) !== null && z !== void 0 ? z : new QB8.Metadata;
            if (this.shouldSendMetrics) Y.set(s4K.GRPC_METRICS_HEADER, this.metricsRecorder.serialize());
            if (this.metadataSent)
                if (!this.wantTrailers) this.wantTrailers = !0, this.stream.once("wantTrailers", () => {
                    if (this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!0), this.callEventTracker.onCallEnd(q);
                    let A = Object.assign({
                        [e4K]: q.code,
                        [t4K]: encodeURI(q.details)
                    }, Y.toHttp2Headers());
                    this.stream.sendTrailers(A), this.notifyOnCancel()
                }), this.stream.end();
                else this.notifyOnCancel();
            else {
                if (this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!0), this.callEventTracker.onCallEnd(q);
                let A = Object.assign(Object.assign({
                    [e4K]: q.code,
                    [t4K]: encodeURI(q.details)
                }, qKK), Y.toHttp2Headers());
                this.stream.respond(A, {
                    endStream: !0
                }), this.notifyOnCancel()
            }
        }
        startRead() {
            if (_X6("Request to " + this.handler.path + " startRead called"), this.checkCancelled()) return;
            if (this.isReadPending = !0, this.readQueue.length === 0) {
                if (!this.receivedHalfClose) this.stream.resume()
            } else this.maybePushNextMessage()
        }
        getPeer() {
            var q;
            let K = (q = this.stream.session) === null || q === void 0 ? void 0 : q.socket;
            if (K === null || K === void 0 ? void 0 : K.remoteAddress)
                if (K.remotePort) return `${K.remoteAddress}:${K.remotePort}`;
                else return K.remoteAddress;
            else return "unknown"
        }
        getDeadline() {
            return this.deadline
        }
        getHost() {
            return this.host
        }
        getAuthContext() {
            var q;
            if (((q = this.stream.session) === null || q === void 0 ? void 0 : q.socket) instanceof adz.TLSSocket) {
                let K = this.stream.session.socket.getPeerCertificate();
                return {
                    transportSecurityType: "ssl",
                    sslPeerCertificate: K.raw ? K : void 0
                }
            } else return {}
        }
        getConnectionInfo() {
            return this.connectionInfo
        }
        getMetricsRecorder() {
            return this.metricsRecorder
        }
    }
    $KK.BaseServerInterceptingCall = M67;

    function _cz(q, K, _, z, Y, A) {
        let O = {
                path: Y.path,
                requestStream: Y.type === "clientStream" || Y.type === "bidi",
                responseStream: Y.type === "serverStream" || Y.type === "bidi",
                requestDeserialize: Y.deserialize,
                responseSerialize: Y.serialize
            },
            w = new M67(K, _, z, Y, A);
        return q.reduce(($, j) => {
            return j(O, $)
        }, w)
    }
})
// @from(Ln 320407, Col 4)
DKK = p((B36) => {
    var $cz = B36 && B36.__runInitializers || function(q, K, _) {
            var z = arguments.length > 2;
            for (var Y = 0; Y < K.length; Y++) _ = z ? K[Y].call(q, _) : K[Y].call(q);
            return z ? _ : void 0
        },
        jcz = B36 && B36.__esDecorate || function(q, K, _, z, Y, A) {
            function O(Z) {
                if (Z !== void 0 && typeof Z !== "function") throw TypeError("Function expected");
                return Z
            }
            var w = z.kind,
                $ = w === "getter" ? "get" : w === "setter" ? "set" : "value",
                j = !K && q ? z.static ? q : q.prototype : null,
                H = K || (j ? Object.getOwnPropertyDescriptor(j, z.name) : {}),
                J, X = !1;
            for (var M = _.length - 1; M >= 0; M--) {
                var P = {};
                for (var W in z) P[W] = W === "access" ? {} : z[W];
                for (var W in z.access) P.access[W] = z.access[W];
                P.addInitializer = function(Z) {
                    if (X) throw TypeError("Cannot add initializers after decoration has completed");
                    A.push(O(Z || null))
                };
                var D = (0, _[M])(w === "accessor" ? {
                    get: H.get,
                    set: H.set
                } : H[$], P);
                if (w === "accessor") {
                    if (D === void 0) continue;
                    if (D === null || typeof D !== "object") throw TypeError("Object expected");
                    if (J = O(D.get)) H.get = J;
                    if (J = O(D.set)) H.set = J;
                    if (J = O(D.init)) Y.unshift(J)
                } else if (J = O(D))
                    if (w === "field") Y.unshift(J);
                    else H[$] = J
            }
            if (j) Object.defineProperty(j, z.name, H);
            X = !0
        };
    Object.defineProperty(B36, "__esModule", {
        value: !0
    });
    B36.Server = void 0;
    var xy = d6("http2"),
        Hcz = d6("util"),
        NM = e_(),
        gS6 = b4K(),
        W67 = BB8(),
        HKK = GF(),
        FS6 = o2(),
        m36 = by(),
        EF = nk(),
        Y0 = I36(),
        JKK = P67(),
        pS6 = 2147483647,
        D67 = 2147483647,
        Jcz = 20000,
        XKK = 2147483647,
        {
            HTTP2_HEADER_PATH: MKK
        } = xy.constants,
        Xcz = "server",
        PKK = Buffer.from("max_age");

    function WKK(q) {
        FS6.trace(NM.LogVerbosity.DEBUG, "server_call", q)
    }

    function Mcz() {}

    function Pcz(q) {
        return function(K, _) {
            return Hcz.deprecate(K, q)
        }
    }

    function Z67(q) {
        return {
            code: NM.Status.UNIMPLEMENTED,
            details: `The server does not implement the method ${q}`
        }
    }

    function Wcz(q, K) {
        let _ = Z67(K);
        switch (q) {
            case "unary":
                return (z, Y) => {
                    Y(_, null)
                };
            case "clientStream":
                return (z, Y) => {
                    Y(_, null)
                };
            case "serverStream":
                return (z) => {
                    z.emit("error", _)
                };
            case "bidi":
                return (z) => {
                    z.emit("error", _)
                };
            default:
                throw Error(`Invalid handlerType ${q}`)
        }
    }
    var Dcz = (() => {
        var q;
        let K = [],
            _;
        return q = class {
            constructor(Y) {
                var A, O, w, $, j, H;
                if (this.boundPorts = ($cz(this, K), new Map), this.http2Servers = new Map, this.sessionIdleTimeouts = new Map, this.handlers = new Map, this.sessions = new Map, this.started = !1, this.shutdown = !1, this.serverAddressString = "null", this.channelzEnabled = !0, this.options = Y !== null && Y !== void 0 ? Y : {}, this.options["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.channelzTrace = new Y0.ChannelzTraceStub, this.callTracker = new Y0.ChannelzCallTrackerStub, this.listenerChildrenTracker = new Y0.ChannelzChildrenTrackerStub, this.sessionChildrenTracker = new Y0.ChannelzChildrenTrackerStub;
                else this.channelzTrace = new Y0.ChannelzTrace, this.callTracker = new Y0.ChannelzCallTracker, this.listenerChildrenTracker = new Y0.ChannelzChildrenTracker, this.sessionChildrenTracker = new Y0.ChannelzChildrenTracker;
                if (this.channelzRef = (0, Y0.registerChannelzServer)("server", () => this.getChannelzInfo(), this.channelzEnabled), this.channelzTrace.addTrace("CT_INFO", "Server created"), this.maxConnectionAgeMs = (A = this.options["grpc.max_connection_age_ms"]) !== null && A !== void 0 ? A : pS6, this.maxConnectionAgeGraceMs = (O = this.options["grpc.max_connection_age_grace_ms"]) !== null && O !== void 0 ? O : pS6, this.keepaliveTimeMs = (w = this.options["grpc.keepalive_time_ms"]) !== null && w !== void 0 ? w : D67, this.keepaliveTimeoutMs = ($ = this.options["grpc.keepalive_timeout_ms"]) !== null && $ !== void 0 ? $ : Jcz, this.sessionIdleTimeout = (j = this.options["grpc.max_connection_idle_ms"]) !== null && j !== void 0 ? j : XKK, this.commonServerOptions = {
                        maxSendHeaderBlockLength: Number.MAX_SAFE_INTEGER
                    }, "grpc-node.max_session_memory" in this.options) this.commonServerOptions.maxSessionMemory = this.options["grpc-node.max_session_memory"];
                else this.commonServerOptions.maxSessionMemory = Number.MAX_SAFE_INTEGER;
                if ("grpc.max_concurrent_streams" in this.options) this.commonServerOptions.settings = {
                    maxConcurrentStreams: this.options["grpc.max_concurrent_streams"]
                };
                this.interceptors = (H = this.options.interceptors) !== null && H !== void 0 ? H : [], this.trace("Server constructed")
            }
            getChannelzInfo() {
                return {
                    trace: this.channelzTrace,
                    callTracker: this.callTracker,
                    listenerChildren: this.listenerChildrenTracker.getChildLists(),
                    sessionChildren: this.sessionChildrenTracker.getChildLists()
                }
            }
            getChannelzSessionInfo(Y) {
                var A, O, w;
                let $ = this.sessions.get(Y),
                    j = Y.socket,
                    H = j.remoteAddress ? (0, m36.stringToSubchannelAddress)(j.remoteAddress, j.remotePort) : null,
                    J = j.localAddress ? (0, m36.stringToSubchannelAddress)(j.localAddress, j.localPort) : null,
                    X;
                if (Y.encrypted) {
                    let P = j,
                        W = P.getCipher(),
                        D = P.getCertificate(),
                        Z = P.getPeerCertificate();
                    X = {
                        cipherSuiteStandardName: (A = W.standardName) !== null && A !== void 0 ? A : null,
                        cipherSuiteOtherName: W.standardName ? null : W.name,
                        localCertificate: D && "raw" in D ? D.raw : null,
                        remoteCertificate: Z && "raw" in Z ? Z.raw : null
                    }
                } else X = null;
                return {
                    remoteAddress: H,
                    localAddress: J,
                    security: X,
                    remoteName: null,
                    streamsStarted: $.streamTracker.callsStarted,
                    streamsSucceeded: $.streamTracker.callsSucceeded,
                    streamsFailed: $.streamTracker.callsFailed,
                    messagesSent: $.messagesSent,
                    messagesReceived: $.messagesReceived,
                    keepAlivesSent: $.keepAlivesSent,
                    lastLocalStreamCreatedTimestamp: null,
                    lastRemoteStreamCreatedTimestamp: $.streamTracker.lastCallStartedTimestamp,
                    lastMessageSentTimestamp: $.lastMessageSentTimestamp,
                    lastMessageReceivedTimestamp: $.lastMessageReceivedTimestamp,
                    localFlowControlWindow: (O = Y.state.localWindowSize) !== null && O !== void 0 ? O : null,
                    remoteFlowControlWindow: (w = Y.state.remoteWindowSize) !== null && w !== void 0 ? w : null
                }
            }
            trace(Y) {
                FS6.trace(NM.LogVerbosity.DEBUG, Xcz, "(" + this.channelzRef.id + ") " + Y)
            }
            keepaliveTrace(Y) {
                FS6.trace(NM.LogVerbosity.DEBUG, "keepalive", "(" + this.channelzRef.id + ") " + Y)
            }
            addProtoService() {
                throw Error("Not implemented. Use addService() instead")
            }
            addService(Y, A) {
                if (Y === null || typeof Y !== "object" || A === null || typeof A !== "object") throw Error("addService() requires two objects as arguments");
                let O = Object.keys(Y);
                if (O.length === 0) throw Error("Cannot add an empty service to a server");
                O.forEach((w) => {
                    let $ = Y[w],
                        j;
                    if ($.requestStream)
                        if ($.responseStream) j = "bidi";
                        else j = "clientStream";
                    else if ($.responseStream) j = "serverStream";
                    else j = "unary";
                    let H = A[w],
                        J;
                    if (H === void 0 && typeof $.originalName === "string") H = A[$.originalName];
                    if (H !== void 0) J = H.bind(A);
                    else J = Wcz(j, w);
                    if (this.register($.path, J, $.responseSerialize, $.requestDeserialize, j) === !1) throw Error(`Method handler for ${$.path} already provided.`)
                })
            }
            removeService(Y) {
                if (Y === null || typeof Y !== "object") throw Error("removeService() requires object as argument");
                Object.keys(Y).forEach((O) => {
                    let w = Y[O];
                    this.unregister(w.path)
                })
            }
            bind(Y, A) {
                throw Error("Not implemented. Use bindAsync() instead")
            }
            experimentalRegisterListenerToChannelz(Y) {
                return (0, Y0.registerChannelzSocket)((0, m36.subchannelAddressToString)(Y), () => {
                    return {
                        localAddress: Y,
                        remoteAddress: null,
                        security: null,
                        remoteName: null,
                        streamsStarted: 0,
                        streamsSucceeded: 0,
                        streamsFailed: 0,
                        messagesSent: 0,
                        messagesReceived: 0,
                        keepAlivesSent: 0,
                        lastLocalStreamCreatedTimestamp: null,
                        lastRemoteStreamCreatedTimestamp: null,
                        lastMessageSentTimestamp: null,
                        lastMessageReceivedTimestamp: null,
                        localFlowControlWindow: null,
                        remoteFlowControlWindow: null
                    }
                }, this.channelzEnabled)
            }
            experimentalUnregisterListenerFromChannelz(Y) {
                (0, Y0.unregisterChannelzRef)(Y)
            }
            createHttp2Server(Y) {
                let A;
                if (Y._isSecure()) {
                    let O = Y._getConstructorOptions(),
                        w = Y._getSecureContextOptions(),
                        $ = Object.assign(Object.assign(Object.assign(Object.assign({}, this.commonServerOptions), O), w), {
                            enableTrace: this.options["grpc-node.tls_enable_trace"] === 1
                        }),
                        j = w !== null;
                    this.trace("Initial credentials valid: " + j), A = xy.createSecureServer($), A.prependListener("connection", (J) => {
                        if (!j) this.trace("Dropped connection from " + JSON.stringify(J.address()) + " due to unloaded credentials"), J.destroy()
                    }), A.on("secureConnection", (J) => {
                        J.on("error", (X) => {
                            this.trace("An incoming TLS connection closed with error: " + X.message)
                        })
                    });
                    let H = (J) => {
                        if (J) {
                            let X = A;
                            try {
                                X.setSecureContext(J)
                            } catch (M) {
                                FS6.log(NM.LogVerbosity.ERROR, "Failed to set secure context with error " + M.message), J = null
                            }
                        }
                        j = J !== null, this.trace("Post-update credentials valid: " + j)
                    };
                    Y._addWatcher(H), A.on("close", () => {
                        Y._removeWatcher(H)
                    })
                } else A = xy.createServer(this.commonServerOptions);
                return A.setTimeout(0, Mcz), this._setupHandlers(A, Y._getInterceptors()), A
            }
            bindOneAddress(Y, A) {
                this.trace("Attempting to bind " + (0, m36.subchannelAddressToString)(Y));
                let O = this.createHttp2Server(A.credentials);
                return new Promise((w, $) => {
                    let j = (H) => {
                        this.trace("Failed to bind " + (0, m36.subchannelAddressToString)(Y) + " with error " + H.message), w({
                            port: "port" in Y ? Y.port : 1,
                            error: H.message
                        })
                    };
                    O.once("error", j), O.listen(Y, () => {
                        let H = O.address(),
                            J;
                        if (typeof H === "string") J = {
                            path: H
                        };
                        else J = {
                            host: H.address,
                            port: H.port
                        };
                        let X = this.experimentalRegisterListenerToChannelz(J);
                        this.listenerChildrenTracker.refChild(X), this.http2Servers.set(O, {
                            channelzRef: X,
                            sessions: new Set,
                            ownsChannelzRef: !0
                        }), A.listeningServers.add(O), this.trace("Successfully bound " + (0, m36.subchannelAddressToString)(J)), w({
                            port: "port" in J ? J.port : 1
                        }), O.removeListener("error", j)
                    })
                })
            }
            async bindManyPorts(Y, A) {
                if (Y.length === 0) return {
                    count: 0,
                    port: 0,
                    errors: []
                };
                if ((0, m36.isTcpSubchannelAddress)(Y[0]) && Y[0].port === 0) {
                    let O = await this.bindOneAddress(Y[0], A);
                    if (O.error) {
                        let w = await this.bindManyPorts(Y.slice(1), A);
                        return Object.assign(Object.assign({}, w), {
                            errors: [O.error, ...w.errors]
                        })
                    } else {
                        let w = Y.slice(1).map((H) => (0, m36.isTcpSubchannelAddress)(H) ? {
                                host: H.host,
                                port: O.port
                            } : H),
                            $ = await Promise.all(w.map((H) => this.bindOneAddress(H, A))),
                            j = [O, ...$];
                        return {
                            count: j.filter((H) => H.error === void 0).length,
                            port: O.port,
                            errors: j.filter((H) => H.error).map((H) => H.error)
                        }
                    }
                } else {
                    let O = await Promise.all(Y.map((w) => this.bindOneAddress(w, A)));
                    return {
                        count: O.filter((w) => w.error === void 0).length,
                        port: O[0].port,
                        errors: O.filter((w) => w.error).map((w) => w.error)
                    }
                }
            }
            async bindAddressList(Y, A) {
                let O = await this.bindManyPorts(Y, A);
                if (O.count > 0) {
                    if (O.count < Y.length) FS6.log(NM.LogVerbosity.INFO, `WARNING Only ${O.count} addresses added out of total ${Y.length} resolved`);
                    return O.port
                } else {
                    let w = `No address added out of total ${Y.length} resolved`;
                    throw FS6.log(NM.LogVerbosity.ERROR, w), Error(`${w} errors: [${O.errors.join(",")}]`)
                }
            }
            resolvePort(Y) {
                return new Promise((A, O) => {
                    let w = !1,
                        $ = (H, J, X, M) => {
                            if (w) return !0;
                            if (w = !0, !H.ok) return O(Error(H.error.details)), !0;
                            let P = [].concat(...H.value.map((W) => W.addresses));
                            if (P.length === 0) return O(Error(`No addresses resolved for port ${Y}`)), !0;
                            return A(P), !0
                        };
                    (0, HKK.createResolver)(Y, $, this.options).updateResolution()
                })
            }
            async bindPort(Y, A) {
                let O = await this.resolvePort(Y);
                if (A.cancelled) throw this.completeUnbind(A), Error("bindAsync operation cancelled by unbind call");
                let w = await this.bindAddressList(O, A);
                if (A.cancelled) throw this.completeUnbind(A), Error("bindAsync operation cancelled by unbind call");
                return w
            }
            normalizePort(Y) {
                let A = (0, EF.parseUri)(Y);
                if (A === null) throw Error(`Could not parse port "${Y}"`);
                let O = (0, HKK.mapUriDefaultScheme)(A);
                if (O === null) throw Error(`Could not get a default scheme for port "${Y}"`);
                return O
            }
            bindAsync(Y, A, O) {
                if (this.shutdown) throw Error("bindAsync called after shutdown");
                if (typeof Y !== "string") throw TypeError("port must be a string");
                if (A === null || !(A instanceof W67.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
                if (typeof O !== "function") throw TypeError("callback must be a function");
                this.trace("bindAsync port=" + Y);
                let w = this.normalizePort(Y),
                    $ = (X, M) => {
                        process.nextTick(() => O(X, M))
                    },
                    j = this.boundPorts.get((0, EF.uriToString)(w));
                if (j) {
                    if (!A._equals(j.credentials)) {
                        $(Error(`${Y} already bound with incompatible credentials`), 0);
                        return
                    }
                    if (j.cancelled = !1, j.completionPromise) j.completionPromise.then((X) => O(null, X), (X) => O(X, 0));
                    else $(null, j.portNumber);
                    return
                }
                j = {
                    mapKey: (0, EF.uriToString)(w),
                    originalUri: w,
                    completionPromise: null,
                    cancelled: !1,
                    portNumber: 0,
                    credentials: A,
                    listeningServers: new Set
                };
                let H = (0, EF.splitHostPort)(w.path),
                    J = this.bindPort(w, j);
                if (j.completionPromise = J, (H === null || H === void 0 ? void 0 : H.port) === 0) J.then((X) => {
                    let M = {
                        scheme: w.scheme,
                        authority: w.authority,
                        path: (0, EF.combineHostPort)({
                            host: H.host,
                            port: X
                        })
                    };
                    j.mapKey = (0, EF.uriToString)(M), j.completionPromise = null, j.portNumber = X, this.boundPorts.set(j.mapKey, j), O(null, X)
                }, (X) => {
                    O(X, 0)
                });
                else this.boundPorts.set(j.mapKey, j), J.then((X) => {
                    j.completionPromise = null, j.portNumber = X, O(null, X)
                }, (X) => {
                    O(X, 0)
                })
            }
            registerInjectorToChannelz() {
                return (0, Y0.registerChannelzSocket)("injector", () => {
                    return {
                        localAddress: null,
                        remoteAddress: null,
                        security: null,
                        remoteName: null,
                        streamsStarted: 0,
                        streamsSucceeded: 0,
                        streamsFailed: 0,
                        messagesSent: 0,
                        messagesReceived: 0,
                        keepAlivesSent: 0,
                        lastLocalStreamCreatedTimestamp: null,
                        lastRemoteStreamCreatedTimestamp: null,
                        lastMessageSentTimestamp: null,
                        lastMessageReceivedTimestamp: null,
                        localFlowControlWindow: null,
                        remoteFlowControlWindow: null
                    }
                }, this.channelzEnabled)
            }
            experimentalCreateConnectionInjectorWithChannelzRef(Y, A, O = !1) {
                if (Y === null || !(Y instanceof W67.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
                if (this.channelzEnabled) this.listenerChildrenTracker.refChild(A);
                let w = this.createHttp2Server(Y),
                    $ = new Set;
                return this.http2Servers.set(w, {
                    channelzRef: A,
                    sessions: $,
                    ownsChannelzRef: O
                }), {
                    injectConnection: (j) => {
                        w.emit("connection", j)
                    },
                    drain: (j) => {
                        var H, J;
                        for (let X of $) this.closeSession(X);
                        (J = (H = setTimeout(() => {
                            for (let X of $) X.destroy(xy.constants.NGHTTP2_CANCEL)
                        }, j)).unref) === null || J === void 0 || J.call(H)
                    },
                    destroy: () => {
                        this.closeServer(w);
                        for (let j of $) this.closeSession(j)
                    }
                }
            }
            createConnectionInjector(Y) {
                if (Y === null || !(Y instanceof W67.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
                let A = this.registerInjectorToChannelz();
                return this.experimentalCreateConnectionInjectorWithChannelzRef(Y, A, !0)
            }
            closeServer(Y, A) {
                this.trace("Closing server with address " + JSON.stringify(Y.address()));
                let O = this.http2Servers.get(Y);
                Y.close(() => {
                    if (O && O.ownsChannelzRef) this.listenerChildrenTracker.unrefChild(O.channelzRef), (0, Y0.unregisterChannelzRef)(O.channelzRef);
                    this.http2Servers.delete(Y), A === null || A === void 0 || A()
                })
            }
            closeSession(Y, A) {
                var O;
                this.trace("Closing session initiated by " + ((O = Y.socket) === null || O === void 0 ? void 0 : O.remoteAddress));
                let w = this.sessions.get(Y),
                    $ = () => {
                        if (w) this.sessionChildrenTracker.unrefChild(w.ref), (0, Y0.unregisterChannelzRef)(w.ref);
                        A === null || A === void 0 || A()
                    };
                if (Y.closed) queueMicrotask($);
                else Y.close($)
            }
            completeUnbind(Y) {
                for (let A of Y.listeningServers) {
                    let O = this.http2Servers.get(A);
                    if (this.closeServer(A, () => {
                            Y.listeningServers.delete(A)
                        }), O)
                        for (let w of O.sessions) this.closeSession(w)
                }
                this.boundPorts.delete(Y.mapKey)
            }
            unbind(Y) {
                this.trace("unbind port=" + Y);
                let A = this.normalizePort(Y),
                    O = (0, EF.splitHostPort)(A.path);
                if ((O === null || O === void 0 ? void 0 : O.port) === 0) throw Error("Cannot unbind port 0");
                let w = this.boundPorts.get((0, EF.uriToString)(A));
                if (w)
                    if (this.trace("unbinding " + w.mapKey + " originally bound as " + (0, EF.uriToString)(w.originalUri)), w.completionPromise) w.cancelled = !0;
                    else this.completeUnbind(w)
            }
            drain(Y, A) {
                var O, w;
                this.trace("drain port=" + Y + " graceTimeMs=" + A);
                let $ = this.normalizePort(Y),
                    j = (0, EF.splitHostPort)($.path);
                if ((j === null || j === void 0 ? void 0 : j.port) === 0) throw Error("Cannot drain port 0");
                let H = this.boundPorts.get((0, EF.uriToString)($));
                if (!H) return;
                let J = new Set;
                for (let X of H.listeningServers) {
                    let M = this.http2Servers.get(X);
                    if (M)
                        for (let P of M.sessions) J.add(P), this.closeSession(P, () => {
                            J.delete(P)
                        })
                }(w = (O = setTimeout(() => {
                    for (let X of J) X.destroy(xy.constants.NGHTTP2_CANCEL)
                }, A)).unref) === null || w === void 0 || w.call(O)
            }
            forceShutdown() {
                for (let Y of this.boundPorts.values()) Y.cancelled = !0;
                this.boundPorts.clear();
                for (let Y of this.http2Servers.keys()) this.closeServer(Y);
                this.sessions.forEach((Y, A) => {
                    this.closeSession(A), A.destroy(xy.constants.NGHTTP2_CANCEL)
                }), this.sessions.clear(), (0, Y0.unregisterChannelzRef)(this.channelzRef), this.shutdown = !0
            }
            register(Y, A, O, w, $) {
                if (this.handlers.has(Y)) return !1;
                return this.handlers.set(Y, {
                    func: A,
                    serialize: O,
                    deserialize: w,
                    type: $,
                    path: Y
                }), !0
            }
            unregister(Y) {
                return this.handlers.delete(Y)
            }
            start() {
                if (this.http2Servers.size === 0 || [...this.http2Servers.keys()].every((Y) => !Y.listening)) throw Error("server must be bound in order to start");
                if (this.started === !0) throw Error("server is already started");
                this.started = !0
            }
            tryShutdown(Y) {
                var A;
                let O = (j) => {
                        (0, Y0.unregisterChannelzRef)(this.channelzRef), Y(j)
                    },
                    w = 0;

                function $() {
                    if (w--, w === 0) O()
                }
                this.shutdown = !0;
                for (let [j, H] of this.http2Servers.entries()) {
                    w++;
                    let J = H.channelzRef.name;
                    this.trace("Waiting for server " + J + " to close"), this.closeServer(j, () => {
                        this.trace("Server " + J + " finished closing"), $()
                    });
                    for (let X of H.sessions.keys()) {
                        w++;
                        let M = (A = X.socket) === null || A === void 0 ? void 0 : A.remoteAddress;
                        this.trace("Waiting for session " + M + " to close"), this.closeSession(X, () => {
                            this.trace("Session " + M + " finished closing"), $()
                        })
                    }
                }
                if (w === 0) O()
            }
            addHttp2Port() {
                throw Error("Not yet implemented")
            }
            getChannelzRef() {
                return this.channelzRef
            }
            _verifyContentType(Y, A) {
                let O = A[xy.constants.HTTP2_HEADER_CONTENT_TYPE];
                if (typeof O !== "string" || !O.startsWith("application/grpc")) return Y.respond({
                    [xy.constants.HTTP2_HEADER_STATUS]: xy.constants.HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE
                }, {
                    endStream: !0
                }), !1;
                return !0
            }
            _retrieveHandler(Y) {
                WKK("Received call to method " + Y + " at address " + this.serverAddressString);
                let A = this.handlers.get(Y);
                if (A === void 0) return WKK("No handler registered for method " + Y + ". Sending UNIMPLEMENTED status."), null;
                return A
            }
            _respondWithError(Y, A, O = null) {
                var w, $;
                let j = Object.assign({
                    "grpc-status": (w = Y.code) !== null && w !== void 0 ? w : NM.Status.INTERNAL,
                    "grpc-message": Y.details,
                    [xy.constants.HTTP2_HEADER_STATUS]: xy.constants.HTTP_STATUS_OK,
                    [xy.constants.HTTP2_HEADER_CONTENT_TYPE]: "application/grpc+proto"
                }, ($ = Y.metadata) === null || $ === void 0 ? void 0 : $.toHttp2Headers());
                A.respond(j, {
                    endStream: !0
                }), this.callTracker.addCallFailed(), O === null || O === void 0 || O.streamTracker.addCallFailed()
            }
            _channelzHandler(Y, A, O) {
                this.onStreamOpened(A);
                let w = this.sessions.get(A.session);
                if (this.callTracker.addCallStarted(), w === null || w === void 0 || w.streamTracker.addCallStarted(), !this._verifyContentType(A, O)) {
                    this.callTracker.addCallFailed(), w === null || w === void 0 || w.streamTracker.addCallFailed();
                    return
                }
                let $ = O[MKK],
                    j = this._retrieveHandler($);
                if (!j) {
                    this._respondWithError(Z67($), A, w);
                    return
                }
                let H = {
                        addMessageSent: () => {
                            if (w) w.messagesSent += 1, w.lastMessageSentTimestamp = new Date
                        },
                        addMessageReceived: () => {
                            if (w) w.messagesReceived += 1, w.lastMessageReceivedTimestamp = new Date
                        },
                        onCallEnd: (X) => {
                            if (X.code === NM.Status.OK) this.callTracker.addCallSucceeded();
                            else this.callTracker.addCallFailed()
                        },
                        onStreamEnd: (X) => {
                            if (w)
                                if (X) w.streamTracker.addCallSucceeded();
                                else w.streamTracker.addCallFailed()
                        }
                    },
                    J = (0, JKK.getServerInterceptingCall)([...Y, ...this.interceptors], A, O, H, j, this.options);
                if (!this._runHandlerForCall(J, j)) this.callTracker.addCallFailed(), w === null || w === void 0 || w.streamTracker.addCallFailed(), J.sendStatus({
                    code: NM.Status.INTERNAL,
                    details: `Unknown handler type: ${j.type}`
                })
            }
            _streamHandler(Y, A, O) {
                if (this.onStreamOpened(A), this._verifyContentType(A, O) !== !0) return;
                let w = O[MKK],
                    $ = this._retrieveHandler(w);
                if (!$) {
                    this._respondWithError(Z67(w), A, null);
                    return
                }
                let j = (0, JKK.getServerInterceptingCall)([...Y, ...this.interceptors], A, O, null, $, this.options);
                if (!this._runHandlerForCall(j, $)) j.sendStatus({
                    code: NM.Status.INTERNAL,
                    details: `Unknown handler type: ${$.type}`
                })
            }
            _runHandlerForCall(Y, A) {
                let {
                    type: O
                } = A;
                if (O === "unary") Zcz(Y, A);
                else if (O === "clientStream") fcz(Y, A);
                else if (O === "serverStream") Gcz(Y, A);
                else if (O === "bidi") vcz(Y, A);
                else return !1;
                return !0
            }
            _setupHandlers(Y, A) {
                if (Y === null) return;
                let O = Y.address(),
                    w = "null";
                if (O)
                    if (typeof O === "string") w = O;
                    else w = O.address + ":" + O.port;
                this.serverAddressString = w;
                let $ = this.channelzEnabled ? this._channelzHandler : this._streamHandler,
                    j = this.channelzEnabled ? this._channelzSessionHandler(Y) : this._sessionHandler(Y);
                Y.on("stream", $.bind(this, A)), Y.on("session", j)
            }
            _sessionHandler(Y) {
                return (A) => {
                    var O, w;
                    (O = this.http2Servers.get(Y)) === null || O === void 0 || O.sessions.add(A);
                    let $ = null,
                        j = null,
                        H = null,
                        J = !1,
                        X = this.enableIdleTimeout(A);
                    if (this.maxConnectionAgeMs !== pS6) {
                        let Z = this.maxConnectionAgeMs / 10,
                            G = Math.random() * Z * 2 - Z;
                        $ = setTimeout(() => {
                            var f, v;
                            J = !0, this.trace("Connection dropped by max connection age: " + ((f = A.socket) === null || f === void 0 ? void 0 : f.remoteAddress));
                            try {
                                A.goaway(xy.constants.NGHTTP2_NO_ERROR, 2147483647, PKK)
                            } catch (V) {
                                A.destroy();
                                return
                            }
                            if (A.close(), this.maxConnectionAgeGraceMs !== pS6) j = setTimeout(() => {
                                A.destroy()
                            }, this.maxConnectionAgeGraceMs), (v = j.unref) === null || v === void 0 || v.call(j)
                        }, this.maxConnectionAgeMs + G), (w = $.unref) === null || w === void 0 || w.call($)
                    }
                    let M = () => {
                            if (H) clearTimeout(H), H = null
                        },
                        P = () => {
                            return !A.destroyed && this.keepaliveTimeMs < D67 && this.keepaliveTimeMs > 0
                        },
                        W, D = () => {
                            var Z;
                            if (!P()) return;
                            this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), H = setTimeout(() => {
                                M(), W()
                            }, this.keepaliveTimeMs), (Z = H.unref) === null || Z === void 0 || Z.call(H)
                        };
                    W = () => {
                        var Z;
                        if (!P()) return;
                        this.keepaliveTrace("Sending ping with timeout " + this.keepaliveTimeoutMs + "ms");
                        let G = "";
                        try {
                            if (!A.ping((v, V, k) => {
                                    if (M(), v) this.keepaliveTrace("Ping failed with error: " + v.message), J = !0, A.close();
                                    else this.keepaliveTrace("Received ping response"), D()
                                })) G = "Ping returned false"
                        } catch (f) {
                            G = (f instanceof Error ? f.message : "") || "Unknown error"
                        }
                        if (G) {
                            this.keepaliveTrace("Ping send failed: " + G), this.trace("Connection dropped due to ping send error: " + G), J = !0, A.close();
                            return
                        }
                        H = setTimeout(() => {
                            M(), this.keepaliveTrace("Ping timeout passed without response"), this.trace("Connection dropped by keepalive timeout"), J = !0, A.close()
                        }, this.keepaliveTimeoutMs), (Z = H.unref) === null || Z === void 0 || Z.call(H)
                    }, D(), A.on("close", () => {
                        var Z, G;
                        if (!J) this.trace(`Connection dropped by client ${(Z=A.socket)===null||Z===void 0?void 0:Z.remoteAddress}`);
                        if ($) clearTimeout($);
                        if (j) clearTimeout(j);
                        if (M(), X !== null) clearTimeout(X.timeout), this.sessionIdleTimeouts.delete(A);
                        (G = this.http2Servers.get(Y)) === null || G === void 0 || G.sessions.delete(A)
                    })
                }
            }
            _channelzSessionHandler(Y) {
                return (A) => {
                    var O, w, $, j;
                    let H = (0, Y0.registerChannelzSocket)((w = (O = A.socket) === null || O === void 0 ? void 0 : O.remoteAddress) !== null && w !== void 0 ? w : "unknown", this.getChannelzSessionInfo.bind(this, A), this.channelzEnabled),
                        J = {
                            ref: H,
                            streamTracker: new Y0.ChannelzCallTracker,
                            messagesSent: 0,
                            messagesReceived: 0,
                            keepAlivesSent: 0,
                            lastMessageSentTimestamp: null,
                            lastMessageReceivedTimestamp: null
                        };
                    ($ = this.http2Servers.get(Y)) === null || $ === void 0 || $.sessions.add(A), this.sessions.set(A, J);
                    let X = `${A.socket.remoteAddress}:${A.socket.remotePort}`;
                    this.channelzTrace.addTrace("CT_INFO", "Connection established by client " + X), this.trace("Connection established by client " + X), this.sessionChildrenTracker.refChild(H);
                    let M = null,
                        P = null,
                        W = null,
                        D = !1,
                        Z = this.enableIdleTimeout(A);
                    if (this.maxConnectionAgeMs !== pS6) {
                        let k = this.maxConnectionAgeMs / 10,
                            N = Math.random() * k * 2 - k;
                        M = setTimeout(() => {
                            var R;
                            D = !0, this.channelzTrace.addTrace("CT_INFO", "Connection dropped by max connection age from " + X);
                            try {
                                A.goaway(xy.constants.NGHTTP2_NO_ERROR, 2147483647, PKK)
                            } catch (h) {
                                A.destroy();
                                return
                            }
                            if (A.close(), this.maxConnectionAgeGraceMs !== pS6) P = setTimeout(() => {
                                A.destroy()
                            }, this.maxConnectionAgeGraceMs), (R = P.unref) === null || R === void 0 || R.call(P)
                        }, this.maxConnectionAgeMs + N), (j = M.unref) === null || j === void 0 || j.call(M)
                    }
                    let G = () => {
                            if (W) clearTimeout(W), W = null
                        },
                        f = () => {
                            return !A.destroyed && this.keepaliveTimeMs < D67 && this.keepaliveTimeMs > 0
                        },
                        v, V = () => {
                            var k;
                            if (!f()) return;
                            this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), W = setTimeout(() => {
                                G(), v()
                            }, this.keepaliveTimeMs), (k = W.unref) === null || k === void 0 || k.call(W)
                        };
                    v = () => {
                        var k;
                        if (!f()) return;
                        this.keepaliveTrace("Sending ping with timeout " + this.keepaliveTimeoutMs + "ms");
                        let N = "";
                        try {
                            if (!A.ping((h, C, x) => {
                                    if (G(), h) this.keepaliveTrace("Ping failed with error: " + h.message), this.channelzTrace.addTrace("CT_INFO", "Connection dropped due to error of a ping frame " + h.message + " return in " + C), D = !0, A.close();
                                    else this.keepaliveTrace("Received ping response"), V()
                                })) N = "Ping returned false"
                        } catch (R) {
                            N = (R instanceof Error ? R.message : "") || "Unknown error"
                        }
                        if (N) {
                            this.keepaliveTrace("Ping send failed: " + N), this.channelzTrace.addTrace("CT_INFO", "Connection dropped due to ping send error: " + N), D = !0, A.close();
                            return
                        }
                        J.keepAlivesSent += 1, W = setTimeout(() => {
                            G(), this.keepaliveTrace("Ping timeout passed without response"), this.channelzTrace.addTrace("CT_INFO", "Connection dropped by keepalive timeout from " + X), D = !0, A.close()
                        }, this.keepaliveTimeoutMs), (k = W.unref) === null || k === void 0 || k.call(W)
                    }, V(), A.on("close", () => {
                        var k;
                        if (!D) this.channelzTrace.addTrace("CT_INFO", "Connection dropped by client " + X);
                        if (this.sessionChildrenTracker.unrefChild(H), (0, Y0.unregisterChannelzRef)(H), M) clearTimeout(M);
                        if (P) clearTimeout(P);
                        if (G(), Z !== null) clearTimeout(Z.timeout), this.sessionIdleTimeouts.delete(A);
                        (k = this.http2Servers.get(Y)) === null || k === void 0 || k.sessions.delete(A), this.sessions.delete(A)
                    })
                }
            }
            enableIdleTimeout(Y) {
                var A, O;
                if (this.sessionIdleTimeout >= XKK) return null;
                let w = {
                    activeStreams: 0,
                    lastIdle: Date.now(),
                    onClose: this.onStreamClose.bind(this, Y),
                    timeout: setTimeout(this.onIdleTimeout, this.sessionIdleTimeout, this, Y)
                };
                (O = (A = w.timeout).unref) === null || O === void 0 || O.call(A), this.sessionIdleTimeouts.set(Y, w);
                let {
                    socket: $
                } = Y;
                return this.trace("Enable idle timeout for " + $.remoteAddress + ":" + $.remotePort), w
            }
            onIdleTimeout(Y, A) {
                let {
                    socket: O
                } = A, w = Y.sessionIdleTimeouts.get(A);
                if (w !== void 0 && w.activeStreams === 0)
                    if (Date.now() - w.lastIdle >= Y.sessionIdleTimeout) Y.trace("Session idle timeout triggered for " + (O === null || O === void 0 ? void 0 : O.remoteAddress) + ":" + (O === null || O === void 0 ? void 0 : O.remotePort) + " last idle at " + w.lastIdle), Y.closeSession(A);
                    else w.timeout.refresh()
            }
            onStreamOpened(Y) {
                let A = Y.session,
                    O = this.sessionIdleTimeouts.get(A);
                if (O) O.activeStreams += 1, Y.once("close", O.onClose)
            }
            onStreamClose(Y) {
                var A, O;
                let w = this.sessionIdleTimeouts.get(Y);
                if (w) {
                    if (w.activeStreams -= 1, w.activeStreams === 0) w.lastIdle = Date.now(), w.timeout.refresh(), this.trace("Session onStreamClose" + ((A = Y.socket) === null || A === void 0 ? void 0 : A.remoteAddress) + ":" + ((O = Y.socket) === null || O === void 0 ? void 0 : O.remotePort) + " at " + w.lastIdle)
                }
            }
        }, (() => {
            let z = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            if (_ = [Pcz("Calling start() is no longer necessary. It can be safely omitted.")], jcz(q, null, _, {
                    kind: "method",
                    name: "start",
                    static: !1,
                    private: !1,
                    access: {
                        has: (Y) => ("start" in Y),
                        get: (Y) => Y.start
                    },
                    metadata: z
                }, null, K), z) Object.defineProperty(q, Symbol.metadata, {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: z
            })
        })(), q
    })();
    B36.Server = Dcz;
    async function Zcz(q, K) {
        let _;

        function z(O, w, $, j) {
            if (O) {
                q.sendStatus((0, gS6.serverErrorToStatus)(O, $));
                return
            }
            q.sendMessage(w, () => {
                q.sendStatus({
                    code: NM.Status.OK,
                    details: "OK",
                    metadata: $ !== null && $ !== void 0 ? $ : null
                })
            })
        }
        let Y, A = null;
        q.start({
            onReceiveMetadata(O) {
                Y = O, q.startRead()
            },
            onReceiveMessage(O) {
                if (A) {
                    q.sendStatus({
                        code: NM.Status.UNIMPLEMENTED,
                        details: `Received a second request message for server streaming method ${K.path}`,
                        metadata: null
                    });
                    return
                }
                A = O, q.startRead()
            },
            onReceiveHalfClose() {
                if (!A) {
                    q.sendStatus({
                        code: NM.Status.UNIMPLEMENTED,
                        details: `Received no request message for server streaming method ${K.path}`,
                        metadata: null
                    });
                    return
                }
                _ = new gS6.ServerWritableStreamImpl(K.path, q, Y, A);
                try {
                    K.func(_, z)
                } catch (O) {
                    q.sendStatus({
                        code: NM.Status.UNKNOWN,
                        details: `Server method handler threw error ${O.message}`,
                        metadata: null
                    })
                }
            },
            onCancel() {
                if (_) _.cancelled = !0, _.emit("cancelled", "cancelled")
            }
        })
    }

    function fcz(q, K) {
        let _;

        function z(Y, A, O, w) {
            if (Y) {
                q.sendStatus((0, gS6.serverErrorToStatus)(Y, O));
                return
            }
            q.sendMessage(A, () => {
                q.sendStatus({
                    code: NM.Status.OK,
                    details: "OK",
                    metadata: O !== null && O !== void 0 ? O : null
                })
            })
        }
        q.start({
            onReceiveMetadata(Y) {
                _ = new gS6.ServerDuplexStreamImpl(K.path, q, Y);
                try {
                    K.func(_, z)
                } catch (A) {
                    q.sendStatus({
                        code: NM.Status.UNKNOWN,
                        details: `Server method handler threw error ${A.message}`,
                        metadata: null
                    })
                }
            },
            onReceiveMessage(Y) {
                _.push(Y)
            },
            onReceiveHalfClose() {
                _.push(null)
            },
            onCancel() {
                if (_) _.cancelled = !0, _.emit("cancelled", "cancelled"), _.destroy()
            }
        })
    }

    function Gcz(q, K) {
        let _, z, Y = null;
        q.start({
            onReceiveMetadata(A) {
                z = A, q.startRead()
            },
            onReceiveMessage(A) {
                if (Y) {
                    q.sendStatus({
                        code: NM.Status.UNIMPLEMENTED,
                        details: `Received a second request message for server streaming method ${K.path}`,
                        metadata: null
                    });
                    return
                }
                Y = A, q.startRead()
            },
            onReceiveHalfClose() {
                if (!Y) {
                    q.sendStatus({
                        code: NM.Status.UNIMPLEMENTED,
                        details: `Received no request message for server streaming method ${K.path}`,
                        metadata: null
                    });
                    return
                }
                _ = new gS6.ServerWritableStreamImpl(K.path, q, z, Y);
                try {
                    K.func(_)
                } catch (A) {
                    q.sendStatus({
                        code: NM.Status.UNKNOWN,
                        details: `Server method handler threw error ${A.message}`,
                        metadata: null
                    })
                }
            },
            onCancel() {
                if (_) _.cancelled = !0, _.emit("cancelled", "cancelled"), _.destroy()
            }
        })
    }

    function vcz(q, K) {
        let _;
        q.start({
            onReceiveMetadata(z) {
                _ = new gS6.ServerDuplexStreamImpl(K.path, q, z);
                try {
                    K.func(_)
                } catch (Y) {
                    q.sendStatus({
                        code: NM.Status.UNKNOWN,
                        details: `Server method handler threw error ${Y.message}`,
                        metadata: null
                    })
                }
            },
            onReceiveMessage(z) {
                _.push(z)
            },
            onReceiveHalfClose() {
                _.push(null)
            },
            onCancel() {
                if (_) _.cancelled = !0, _.emit("cancelled", "cancelled"), _.destroy()
            }
        })
    }
})
// @from(Ln 321474, Col 4)
vKK = p((fKK) => {
    Object.defineProperty(fKK, "__esModule", {
        value: !0
    });
    fKK.StatusBuilder = void 0;
    class ZKK {
        constructor() {
            this.code = null, this.details = null, this.metadata = null
        }
        withCode(q) {
            return this.code = q, this
        }
        withDetails(q) {
            return this.details = q, this
        }
        withMetadata(q) {
            return this.metadata = q, this
        }
        build() {
            let q = {};
            if (this.code !== null) q.code = this.code;
            if (this.details !== null) q.details = this.details;
            if (this.metadata !== null) q.metadata = this.metadata;
            return q
        }
    }
    fKK.StatusBuilder = ZKK
})