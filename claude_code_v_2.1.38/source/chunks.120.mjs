
// @from(Ln 297555, Col 4)
RN4 = R((kN4) => {
    Object.defineProperty(kN4, "__esModule", {
        value: !0
    });
    kN4.ServerDuplexStreamImpl = kN4.ServerWritableStreamImpl = kN4.ServerReadableStreamImpl = kN4.ServerUnaryCallImpl = void 0;
    kN4.serverErrorToStatus = xVA;
    var WOY = h1("events"),
        hVA = h1("stream"),
        IVA = w9(),
        VN4 = Jj();

    function xVA(A, q) {
        var K;
        let Y = {
            code: IVA.Status.UNKNOWN,
            details: "message" in A ? A.message : "Unknown Error",
            metadata: (K = q !== null && q !== void 0 ? q : A.metadata) !== null && K !== void 0 ? K : null
        };
        if ("code" in A && typeof A.code === "number" && Number.isInteger(A.code)) {
            if (Y.code = A.code, "details" in A && typeof A.details === "string") Y.details = A.details
        }
        return Y
    }
    class NN4 extends WOY.EventEmitter {
        constructor(A, q, K, Y) {
            super();
            this.path = A, this.call = q, this.metadata = K, this.request = Y, this.cancelled = !1
        }
        getPeer() {
            return this.call.getPeer()
        }
        sendMetadata(A) {
            this.call.sendMetadata(A)
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
    kN4.ServerUnaryCallImpl = NN4;
    class TN4 extends hVA.Readable {
        constructor(A, q, K) {
            super({
                objectMode: !0
            });
            this.path = A, this.call = q, this.metadata = K, this.cancelled = !1
        }
        _read(A) {
            this.call.startRead()
        }
        getPeer() {
            return this.call.getPeer()
        }
        sendMetadata(A) {
            this.call.sendMetadata(A)
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
    kN4.ServerReadableStreamImpl = TN4;
    class vN4 extends hVA.Writable {
        constructor(A, q, K, Y) {
            super({
                objectMode: !0
            });
            this.path = A, this.call = q, this.metadata = K, this.request = Y, this.pendingStatus = {
                code: IVA.Status.OK,
                details: "OK"
            }, this.cancelled = !1, this.trailingMetadata = new VN4.Metadata, this.on("error", (z) => {
                this.pendingStatus = xVA(z), this.end()
            })
        }
        getPeer() {
            return this.call.getPeer()
        }
        sendMetadata(A) {
            this.call.sendMetadata(A)
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
        _write(A, q, K) {
            this.call.sendMessage(A, K)
        }
        _final(A) {
            var q;
            A(null), this.call.sendStatus(Object.assign(Object.assign({}, this.pendingStatus), {
                metadata: (q = this.pendingStatus.metadata) !== null && q !== void 0 ? q : this.trailingMetadata
            }))
        }
        end(A) {
            if (A) this.trailingMetadata = A;
            return super.end()
        }
    }
    kN4.ServerWritableStreamImpl = vN4;
    class EN4 extends hVA.Duplex {
        constructor(A, q, K) {
            super({
                objectMode: !0
            });
            this.path = A, this.call = q, this.metadata = K, this.pendingStatus = {
                code: IVA.Status.OK,
                details: "OK"
            }, this.cancelled = !1, this.trailingMetadata = new VN4.Metadata, this.on("error", (Y) => {
                this.pendingStatus = xVA(Y), this.end()
            })
        }
        getPeer() {
            return this.call.getPeer()
        }
        sendMetadata(A) {
            this.call.sendMetadata(A)
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
        _read(A) {
            this.call.startRead()
        }
        _write(A, q, K) {
            this.call.sendMessage(A, K)
        }
        _final(A) {
            var q;
            A(null), this.call.sendStatus(Object.assign(Object.assign({}, this.pendingStatus), {
                metadata: (q = this.pendingStatus.metadata) !== null && q !== void 0 ? q : this.trailingMetadata
            }))
        }
        end(A) {
            if (A) this.trailingMetadata = A;
            return super.end()
        }
    }
    kN4.ServerDuplexStreamImpl = EN4
})
// @from(Ln 297739, Col 4)
I06 = R((yN4) => {
    Object.defineProperty(yN4, "__esModule", {
        value: !0
    });
    yN4.ServerCredentials = void 0;
    yN4.createCertificateProviderServerCredentials = NOY;
    yN4.createServerCredentialsWithInterceptors = TOY;
    var bVA = oZA();
    class HP1 {
        constructor(A, q) {
            this.serverConstructorOptions = A, this.watchers = new Set, this.latestContextOptions = null, this.latestContextOptions = q !== null && q !== void 0 ? q : null
        }
        _addWatcher(A) {
            this.watchers.add(A)
        }
        _removeWatcher(A) {
            this.watchers.delete(A)
        }
        getWatcherCount() {
            return this.watchers.size
        }
        updateSecureContextOptions(A) {
            this.latestContextOptions = A;
            for (let q of this.watchers) q(this.latestContextOptions)
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
            return new uVA
        }
        static createSsl(A, q, K = !1) {
            var Y;
            if (A !== null && !Buffer.isBuffer(A)) throw TypeError("rootCerts must be null or a Buffer");
            if (!Array.isArray(q)) throw TypeError("keyCertPairs must be an array");
            if (typeof K !== "boolean") throw TypeError("checkClientCertificate must be a boolean");
            let z = [],
                w = [];
            for (let H = 0; H < q.length; H++) {
                let $ = q[H];
                if ($ === null || typeof $ !== "object") throw TypeError(`keyCertPair[${H}] must be an object`);
                if (!Buffer.isBuffer($.private_key)) throw TypeError(`keyCertPair[${H}].private_key must be a Buffer`);
                if (!Buffer.isBuffer($.cert_chain)) throw TypeError(`keyCertPair[${H}].cert_chain must be a Buffer`);
                z.push($.cert_chain), w.push($.private_key)
            }
            return new BVA({
                requestCert: K,
                ciphers: bVA.CIPHER_SUITES
            }, {
                ca: (Y = A !== null && A !== void 0 ? A : (0, bVA.getDefaultRootsData)()) !== null && Y !== void 0 ? Y : void 0,
                cert: z,
                key: w
            })
        }
    }
    yN4.ServerCredentials = HP1;
    class uVA extends HP1 {
        constructor() {
            super(null)
        }
        _getSettings() {
            return null
        }
        _equals(A) {
            return A instanceof uVA
        }
    }
    class BVA extends HP1 {
        constructor(A, q) {
            super(A, q);
            this.options = Object.assign(Object.assign({}, A), q)
        }
        _equals(A) {
            if (this === A) return !0;
            if (!(A instanceof BVA)) return !1;
            if (Buffer.isBuffer(this.options.ca) && Buffer.isBuffer(A.options.ca)) {
                if (!this.options.ca.equals(A.options.ca)) return !1
            } else if (this.options.ca !== A.options.ca) return !1;
            if (Array.isArray(this.options.cert) && Array.isArray(A.options.cert)) {
                if (this.options.cert.length !== A.options.cert.length) return !1;
                for (let q = 0; q < this.options.cert.length; q++) {
                    let K = this.options.cert[q],
                        Y = A.options.cert[q];
                    if (Buffer.isBuffer(K) && Buffer.isBuffer(Y)) {
                        if (!K.equals(Y)) return !1
                    } else if (K !== Y) return !1
                }
            } else if (this.options.cert !== A.options.cert) return !1;
            if (Array.isArray(this.options.key) && Array.isArray(A.options.key)) {
                if (this.options.key.length !== A.options.key.length) return !1;
                for (let q = 0; q < this.options.key.length; q++) {
                    let K = this.options.key[q],
                        Y = A.options.key[q];
                    if (Buffer.isBuffer(K) && Buffer.isBuffer(Y)) {
                        if (!K.equals(Y)) return !1
                    } else if (K !== Y) return !1
                }
            } else if (this.options.key !== A.options.key) return !1;
            if (this.options.requestCert !== A.options.requestCert) return !1;
            return !0
        }
    }
    class mVA extends HP1 {
        constructor(A, q, K) {
            super({
                requestCert: q !== null,
                rejectUnauthorized: K,
                ciphers: bVA.CIPHER_SUITES
            });
            this.identityCertificateProvider = A, this.caCertificateProvider = q, this.requireClientCertificate = K, this.latestCaUpdate = null, this.latestIdentityUpdate = null, this.caCertificateUpdateListener = this.handleCaCertificateUpdate.bind(this), this.identityCertificateUpdateListener = this.handleIdentityCertitificateUpdate.bind(this)
        }
        _addWatcher(A) {
            var q;
            if (this.getWatcherCount() === 0)(q = this.caCertificateProvider) === null || q === void 0 || q.addCaCertificateListener(this.caCertificateUpdateListener), this.identityCertificateProvider.addIdentityCertificateListener(this.identityCertificateUpdateListener);
            super._addWatcher(A)
        }
        _removeWatcher(A) {
            var q;
            if (super._removeWatcher(A), this.getWatcherCount() === 0)(q = this.caCertificateProvider) === null || q === void 0 || q.removeCaCertificateListener(this.caCertificateUpdateListener), this.identityCertificateProvider.removeIdentityCertificateListener(this.identityCertificateUpdateListener)
        }
        _equals(A) {
            if (this === A) return !0;
            if (!(A instanceof mVA)) return !1;
            return this.caCertificateProvider === A.caCertificateProvider && this.identityCertificateProvider === A.identityCertificateProvider && this.requireClientCertificate === A.requireClientCertificate
        }
        calculateSecureContextOptions() {
            var A;
            if (this.latestIdentityUpdate === null) return null;
            if (this.caCertificateProvider !== null && this.latestCaUpdate === null) return null;
            return {
                ca: (A = this.latestCaUpdate) === null || A === void 0 ? void 0 : A.caCertificate,
                cert: [this.latestIdentityUpdate.certificate],
                key: [this.latestIdentityUpdate.privateKey]
            }
        }
        finalizeUpdate() {
            let A = this.calculateSecureContextOptions();
            this.updateSecureContextOptions(A)
        }
        handleCaCertificateUpdate(A) {
            this.latestCaUpdate = A, this.finalizeUpdate()
        }
        handleIdentityCertitificateUpdate(A) {
            this.latestIdentityUpdate = A, this.finalizeUpdate()
        }
    }

    function NOY(A, q, K) {
        return new mVA(A, q, K)
    }
    class FVA extends HP1 {
        constructor(A, q) {
            super({});
            this.childCredentials = A, this.interceptors = q
        }
        _isSecure() {
            return this.childCredentials._isSecure()
        }
        _equals(A) {
            if (!(A instanceof FVA)) return !1;
            if (!this.childCredentials._equals(A.childCredentials)) return !1;
            if (this.interceptors.length !== A.interceptors.length) return !1;
            for (let q = 0; q < this.interceptors.length; q++)
                if (this.interceptors[q] !== A.interceptors[q]) return !1;
            return !0
        }
        _getInterceptors() {
            return this.interceptors
        }
        _addWatcher(A) {
            this.childCredentials._addWatcher(A)
        }
        _removeWatcher(A) {
            this.childCredentials._removeWatcher(A)
        }
        _getConstructorOptions() {
            return this.childCredentials._getConstructorOptions()
        }
        _getSecureContextOptions() {
            return this.childCredentials._getSecureContextOptions()
        }
    }

    function TOY(A, q) {
        return new FVA(A, q)
    }
})
// @from(Ln 297935, Col 4)
OF1 = R((SN4) => {
    Object.defineProperty(SN4, "__esModule", {
        value: !0
    });
    SN4.durationMessageToDuration = kOY;
    SN4.msToDuration = LOY;
    SN4.durationToMs = ROY;
    SN4.isDuration = yOY;
    SN4.isDurationMessage = COY;
    SN4.parseDuration = hOY;
    SN4.durationToString = IOY;

    function kOY(A) {
        return {
            seconds: Number.parseInt(A.seconds),
            nanos: A.nanos
        }
    }

    function LOY(A) {
        return {
            seconds: A / 1000 | 0,
            nanos: A % 1000 * 1e6 | 0
        }
    }

    function ROY(A) {
        return A.seconds * 1000 + A.nanos / 1e6 | 0
    }

    function yOY(A) {
        return typeof A.seconds === "number" && typeof A.nanos === "number"
    }

    function COY(A) {
        return typeof A.seconds === "string" && typeof A.nanos === "number"
    }
    var SOY = /^(\d+)(?:\.(\d+))?s$/;

    function hOY(A) {
        let q = A.match(SOY);
        if (!q) return null;
        return {
            seconds: Number.parseInt(q[1], 10),
            nanos: q[2] ? Number.parseInt(q[2].padEnd(9, "0"), 10) : 0
        }
    }

    function IOY(A) {
        if (A.nanos === 0) return `${A.seconds}s`;
        let q;
        if (A.nanos % 1e6 === 0) q = 1e6;
        else if (A.nanos % 1000 === 0) q = 1000;
        else q = 1;
        return `${A.seconds}.${A.nanos/q}s`
    }
})
// @from(Ln 297992, Col 4)
b06 = R((UN4) => {
    var __dirname = "/home/runner/code/tmp/claude-cli-external-build-2245/node_modules/@grpc/grpc-js/build/src";
    Object.defineProperty(UN4, "__esModule", {
        value: !0
    });
    UN4.OrcaOobMetricsSubchannelWrapper = UN4.GRPC_METRICS_HEADER = UN4.ServerMetricRecorder = UN4.PerRequestMetricRecorder = void 0;
    UN4.createOrcaClient = BN4;
    UN4.createMetricsReader = iOY;
    var gOY = pD6(),
        QVA = OF1(),
        UOY = gM1(),
        pOY = HF1(),
        hN4 = w9(),
        dOY = UM1(),
        cOY = FZ(),
        IN4 = null;

    function x06() {
        if (IN4) return IN4;
        let A = KVA().loadSync,
            q = A("xds/service/orca/v3/orca.proto", {
                keepCase: !0,
                longs: String,
                enums: String,
                defaults: !0,
                oneofs: !0,
                includeDirs: [`${__dirname}/../../proto/xds`, `${__dirname}/../../proto/protoc-gen-validate`]
            });
        return (0, gOY.loadPackageDefinition)(q)
    }
    class bN4 {
        constructor() {
            this.message = {}
        }
        recordRequestCostMetric(A, q) {
            if (!this.message.request_cost) this.message.request_cost = {};
            this.message.request_cost[A] = q
        }
        recordUtilizationMetric(A, q) {
            if (!this.message.utilization) this.message.utilization = {};
            this.message.utilization[A] = q
        }
        recordNamedMetric(A, q) {
            if (!this.message.named_metrics) this.message.named_metrics = {};
            this.message.named_metrics[A] = q
        }
        recordCPUUtilizationMetric(A) {
            this.message.cpu_utilization = A
        }
        recordMemoryUtilizationMetric(A) {
            this.message.mem_utilization = A
        }
        recordApplicationUtilizationMetric(A) {
            this.message.application_utilization = A
        }
        recordQpsMetric(A) {
            this.message.rps_fractional = A
        }
        recordEpsMetric(A) {
            this.message.eps = A
        }
        serialize() {
            return x06().xds.data.orca.v3.OrcaLoadReport.serialize(this.message)
        }
    }
    UN4.PerRequestMetricRecorder = bN4;
    var lOY = 30000;
    class uN4 {
        constructor() {
            this.message = {}, this.serviceImplementation = {
                StreamCoreMetrics: (A) => {
                    let q = A.request.report_interval ? (0, QVA.durationToMs)((0, QVA.durationMessageToDuration)(A.request.report_interval)) : lOY,
                        K = setInterval(() => {
                            A.write(this.message)
                        }, q);
                    A.on("cancelled", () => {
                        clearInterval(K)
                    })
                }
            }
        }
        putUtilizationMetric(A, q) {
            if (!this.message.utilization) this.message.utilization = {};
            this.message.utilization[A] = q
        }
        setAllUtilizationMetrics(A) {
            this.message.utilization = Object.assign({}, A)
        }
        deleteUtilizationMetric(A) {
            var q;
            (q = this.message.utilization) === null || q === void 0 || delete q[A]
        }
        setCpuUtilizationMetric(A) {
            this.message.cpu_utilization = A
        }
        deleteCpuUtilizationMetric() {
            delete this.message.cpu_utilization
        }
        setApplicationUtilizationMetric(A) {
            this.message.application_utilization = A
        }
        deleteApplicationUtilizationMetric() {
            delete this.message.application_utilization
        }
        setQpsMetric(A) {
            this.message.rps_fractional = A
        }
        deleteQpsMetric() {
            delete this.message.rps_fractional
        }
        setEpsMetric(A) {
            this.message.eps = A
        }
        deleteEpsMetric() {
            delete this.message.eps
        }
        addToServer(A) {
            let q = x06().xds.service.orca.v3.OpenRcaService.service;
            A.addService(q, this.serviceImplementation)
        }
    }
    UN4.ServerMetricRecorder = uN4;

    function BN4(A) {
        return new(x06()).xds.service.orca.v3.OpenRcaService("unused", UOY.ChannelCredentials.createInsecure(), {
            channelOverride: A
        })
    }
    UN4.GRPC_METRICS_HEADER = "endpoint-load-metrics-bin";
    var xN4 = "grpc_orca_load_report";

    function iOY(A, q) {
        return (K, Y, z) => {
            let w = z.getOpaque(xN4);
            if (w) A(w);
            else {
                let H = z.get(UN4.GRPC_METRICS_HEADER);
                if (H.length > 0) w = x06().xds.data.orca.v3.OrcaLoadReport.deserialize(H[0]), A(w), z.setOpaque(xN4, w)
            }
            if (q) q(K, Y, z)
        }
    }
    var mN4 = "orca_oob_metrics";
    class FN4 {
        constructor(A, q) {
            this.metricsListener = A, this.intervalMs = q, this.dataProducer = null
        }
        setSubchannel(A) {
            let q = A.getOrCreateDataProducer(mN4, nOY);
            this.dataProducer = q, q.addDataWatcher(this)
        }
        destroy() {
            var A;
            (A = this.dataProducer) === null || A === void 0 || A.removeDataWatcher(this)
        }
        getInterval() {
            return this.intervalMs
        }
        onMetricsUpdate(A) {
            this.metricsListener(A)
        }
    }
    class QN4 {
        constructor(A) {
            this.subchannel = A, this.dataWatchers = new Set, this.orcaSupported = !0, this.metricsCall = null, this.currentInterval = 1 / 0, this.backoffTimer = new dOY.BackoffTimeout(() => this.updateMetricsSubscription()), this.subchannelStateListener = () => this.updateMetricsSubscription();
            let q = A.getChannel();
            this.client = BN4(q), A.addConnectivityStateListener(this.subchannelStateListener)
        }
        addDataWatcher(A) {
            this.dataWatchers.add(A), this.updateMetricsSubscription()
        }
        removeDataWatcher(A) {
            var q;
            if (this.dataWatchers.delete(A), this.dataWatchers.size === 0) this.subchannel.removeDataProducer(mN4), (q = this.metricsCall) === null || q === void 0 || q.cancel(), this.metricsCall = null, this.client.close(), this.subchannel.removeConnectivityStateListener(this.subchannelStateListener);
            else this.updateMetricsSubscription()
        }
        updateMetricsSubscription() {
            var A;
            if (this.dataWatchers.size === 0 || !this.orcaSupported || this.subchannel.getConnectivityState() !== cOY.ConnectivityState.READY) return;
            let q = Math.min(...Array.from(this.dataWatchers).map((K) => K.getInterval()));
            if (!this.metricsCall || q !== this.currentInterval) {
                (A = this.metricsCall) === null || A === void 0 || A.cancel(), this.currentInterval = q;
                let K = this.client.streamCoreMetrics({
                    report_interval: (0, QVA.msToDuration)(q)
                });
                this.metricsCall = K, K.on("data", (Y) => {
                    this.dataWatchers.forEach((z) => {
                        z.onMetricsUpdate(Y)
                    })
                }), K.on("error", (Y) => {
                    if (this.metricsCall = null, Y.code === hN4.Status.UNIMPLEMENTED) {
                        this.orcaSupported = !1;
                        return
                    }
                    if (Y.code === hN4.Status.CANCELLED) return;
                    this.backoffTimer.runOnce()
                })
            }
        }
    }
    class gN4 extends pOY.BaseSubchannelWrapper {
        constructor(A, q, K) {
            super(A);
            this.addDataWatcher(new FN4(q, K))
        }
        getWrappedSubchannel() {
            return this.child
        }
    }
    UN4.OrcaOobMetricsSubchannelWrapper = gN4;

    function nOY(A) {
        return new QN4(A)
    }
})
// @from(Ln 298207, Col 4)
dVA = R((YT4) => {
    Object.defineProperty(YT4, "__esModule", {
        value: !0
    });
    YT4.BaseServerInterceptingCall = YT4.ServerInterceptingCall = YT4.ResponderBuilder = YT4.ServerListenerBuilder = void 0;
    YT4.isInterceptingServerListener = A_Y;
    YT4.getServerInterceptingCall = w_Y;
    var m06 = Jj(),
        ON = w9(),
        $P1 = h1("http2"),
        cN4 = LD6(),
        lN4 = h1("zlib"),
        tOY = NVA(),
        aN4 = mw(),
        eOY = h1("tls"),
        iN4 = b06(),
        sN4 = "server_call";

    function u31(A) {
        aN4.trace(ON.LogVerbosity.DEBUG, sN4, A)
    }
    class tN4 {
        constructor() {
            this.metadata = void 0, this.message = void 0, this.halfClose = void 0, this.cancel = void 0
        }
        withOnReceiveMetadata(A) {
            return this.metadata = A, this
        }
        withOnReceiveMessage(A) {
            return this.message = A, this
        }
        withOnReceiveHalfClose(A) {
            return this.halfClose = A, this
        }
        withOnCancel(A) {
            return this.cancel = A, this
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
    YT4.ServerListenerBuilder = tN4;

    function A_Y(A) {
        return A.onReceiveMetadata !== void 0 && A.onReceiveMetadata.length === 1
    }
    class eN4 {
        constructor(A, q) {
            this.listener = A, this.nextListener = q, this.cancelled = !1, this.processingMetadata = !1, this.hasPendingMessage = !1, this.pendingMessage = null, this.processingMessage = !1, this.hasPendingHalfClose = !1
        }
        processPendingMessage() {
            if (this.hasPendingMessage) this.nextListener.onReceiveMessage(this.pendingMessage), this.pendingMessage = null, this.hasPendingMessage = !1
        }
        processPendingHalfClose() {
            if (this.hasPendingHalfClose) this.nextListener.onReceiveHalfClose(), this.hasPendingHalfClose = !1
        }
        onReceiveMetadata(A) {
            if (this.cancelled) return;
            this.processingMetadata = !0, this.listener.onReceiveMetadata(A, (q) => {
                if (this.processingMetadata = !1, this.cancelled) return;
                this.nextListener.onReceiveMetadata(q), this.processPendingMessage(), this.processPendingHalfClose()
            })
        }
        onReceiveMessage(A) {
            if (this.cancelled) return;
            this.processingMessage = !0, this.listener.onReceiveMessage(A, (q) => {
                if (this.processingMessage = !1, this.cancelled) return;
                if (this.processingMetadata) this.pendingMessage = q, this.hasPendingMessage = !0;
                else this.nextListener.onReceiveMessage(q), this.processPendingHalfClose()
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
    class AT4 {
        constructor() {
            this.start = void 0, this.metadata = void 0, this.message = void 0, this.status = void 0
        }
        withStart(A) {
            return this.start = A, this
        }
        withSendMetadata(A) {
            return this.metadata = A, this
        }
        withSendMessage(A) {
            return this.message = A, this
        }
        withSendStatus(A) {
            return this.status = A, this
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
    YT4.ResponderBuilder = AT4;
    var u06 = {
            onReceiveMetadata: (A, q) => {
                q(A)
            },
            onReceiveMessage: (A, q) => {
                q(A)
            },
            onReceiveHalfClose: (A) => {
                A()
            },
            onCancel: () => {}
        },
        B06 = {
            start: (A) => {
                A()
            },
            sendMetadata: (A, q) => {
                q(A)
            },
            sendMessage: (A, q) => {
                q(A)
            },
            sendStatus: (A, q) => {
                q(A)
            }
        };
    class qT4 {
        constructor(A, q) {
            var K, Y, z, w;
            this.nextCall = A, this.processingMetadata = !1, this.sentMetadata = !1, this.processingMessage = !1, this.pendingMessage = null, this.pendingMessageCallback = null, this.pendingStatus = null, this.responder = {
                start: (K = q === null || q === void 0 ? void 0 : q.start) !== null && K !== void 0 ? K : B06.start,
                sendMetadata: (Y = q === null || q === void 0 ? void 0 : q.sendMetadata) !== null && Y !== void 0 ? Y : B06.sendMetadata,
                sendMessage: (z = q === null || q === void 0 ? void 0 : q.sendMessage) !== null && z !== void 0 ? z : B06.sendMessage,
                sendStatus: (w = q === null || q === void 0 ? void 0 : q.sendStatus) !== null && w !== void 0 ? w : B06.sendStatus
            }
        }
        processPendingMessage() {
            if (this.pendingMessageCallback) this.nextCall.sendMessage(this.pendingMessage, this.pendingMessageCallback), this.pendingMessage = null, this.pendingMessageCallback = null
        }
        processPendingStatus() {
            if (this.pendingStatus) this.nextCall.sendStatus(this.pendingStatus), this.pendingStatus = null
        }
        start(A) {
            this.responder.start((q) => {
                var K, Y, z, w;
                let H = {
                        onReceiveMetadata: (K = q === null || q === void 0 ? void 0 : q.onReceiveMetadata) !== null && K !== void 0 ? K : u06.onReceiveMetadata,
                        onReceiveMessage: (Y = q === null || q === void 0 ? void 0 : q.onReceiveMessage) !== null && Y !== void 0 ? Y : u06.onReceiveMessage,
                        onReceiveHalfClose: (z = q === null || q === void 0 ? void 0 : q.onReceiveHalfClose) !== null && z !== void 0 ? z : u06.onReceiveHalfClose,
                        onCancel: (w = q === null || q === void 0 ? void 0 : q.onCancel) !== null && w !== void 0 ? w : u06.onCancel
                    },
                    $ = new eN4(H, A);
                this.nextCall.start($)
            })
        }
        sendMetadata(A) {
            this.processingMetadata = !0, this.sentMetadata = !0, this.responder.sendMetadata(A, (q) => {
                this.processingMetadata = !1, this.nextCall.sendMetadata(q), this.processPendingMessage(), this.processPendingStatus()
            })
        }
        sendMessage(A, q) {
            if (this.processingMessage = !0, !this.sentMetadata) this.sendMetadata(new m06.Metadata);
            this.responder.sendMessage(A, (K) => {
                if (this.processingMessage = !1, this.processingMetadata) this.pendingMessage = K, this.pendingMessageCallback = q;
                else this.nextCall.sendMessage(K, q)
            })
        }
        sendStatus(A) {
            this.responder.sendStatus(A, (q) => {
                if (this.processingMetadata || this.processingMessage) this.pendingStatus = q;
                else this.nextCall.sendStatus(q)
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
    YT4.ServerInterceptingCall = qT4;
    var KT4 = "grpc-accept-encoding",
        UVA = "grpc-encoding",
        nN4 = "grpc-message",
        rN4 = "grpc-status",
        gVA = "grpc-timeout",
        q_Y = /(\d{1,8})\s*([HMSmun])/,
        K_Y = {
            H: 3600000,
            M: 60000,
            S: 1000,
            m: 1,
            u: 0.001,
            n: 0.000001
        },
        Y_Y = {
            [KT4]: "identity,deflate,gzip",
            [UVA]: "identity"
        },
        oN4 = {
            [$P1.constants.HTTP2_HEADER_STATUS]: $P1.constants.HTTP_STATUS_OK,
            [$P1.constants.HTTP2_HEADER_CONTENT_TYPE]: "application/grpc+proto"
        },
        z_Y = {
            waitForTrailers: !0
        };
    class pVA {
        constructor(A, q, K, Y, z) {
            var w, H;
            if (this.stream = A, this.callEventTracker = K, this.handler = Y, this.listener = null, this.deadlineTimer = null, this.deadline = 1 / 0, this.maxSendMessageSize = ON.DEFAULT_MAX_SEND_MESSAGE_LENGTH, this.maxReceiveMessageSize = ON.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH, this.cancelled = !1, this.metadataSent = !1, this.wantTrailers = !1, this.cancelNotified = !1, this.incomingEncoding = "identity", this.readQueue = [], this.isReadPending = !1, this.receivedHalfClose = !1, this.streamEnded = !1, this.metricsRecorder = new iN4.PerRequestMetricRecorder, this.stream.once("error", (X) => {}), this.stream.once("close", () => {
                    var X;
                    if (u31("Request to method " + ((X = this.handler) === null || X === void 0 ? void 0 : X.path) + " stream closed with rstCode " + this.stream.rstCode), this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!1), this.callEventTracker.onCallEnd({
                        code: ON.Status.CANCELLED,
                        details: "Stream closed before sending status",
                        metadata: null
                    });
                    this.notifyOnCancel()
                }), this.stream.on("data", (X) => {
                    this.handleDataFrame(X)
                }), this.stream.pause(), this.stream.on("end", () => {
                    this.handleEndEvent()
                }), "grpc.max_send_message_length" in z) this.maxSendMessageSize = z["grpc.max_send_message_length"];
            if ("grpc.max_receive_message_length" in z) this.maxReceiveMessageSize = z["grpc.max_receive_message_length"];
            this.host = (w = q[":authority"]) !== null && w !== void 0 ? w : q.host, this.decoder = new tOY.StreamDecoder(this.maxReceiveMessageSize);
            let $ = m06.Metadata.fromHttp2Headers(q);
            if (aN4.isTracerEnabled(sN4)) u31("Request to " + this.handler.path + " received headers " + JSON.stringify($.toJSON()));
            let O = $.get(gVA);
            if (O.length > 0) this.handleTimeoutHeader(O[0]);
            let _ = $.get(UVA);
            if (_.length > 0) this.incomingEncoding = _[0];
            $.remove(gVA), $.remove(UVA), $.remove(KT4), $.remove($P1.constants.HTTP2_HEADER_ACCEPT_ENCODING), $.remove($P1.constants.HTTP2_HEADER_TE), $.remove($P1.constants.HTTP2_HEADER_CONTENT_TYPE), this.metadata = $;
            let J = (H = A.session) === null || H === void 0 ? void 0 : H.socket;
            this.connectionInfo = {
                localAddress: J === null || J === void 0 ? void 0 : J.localAddress,
                localPort: J === null || J === void 0 ? void 0 : J.localPort,
                remoteAddress: J === null || J === void 0 ? void 0 : J.remoteAddress,
                remotePort: J === null || J === void 0 ? void 0 : J.remotePort
            }, this.shouldSendMetrics = !!z["grpc.server_call_metric_recording"]
        }
        handleTimeoutHeader(A) {
            let q = A.toString().match(q_Y);
            if (q === null) {
                let z = {
                    code: ON.Status.INTERNAL,
                    details: `Invalid ${gVA} value "${A}"`,
                    metadata: null
                };
                process.nextTick(() => {
                    this.sendStatus(z)
                });
                return
            }
            let K = +q[1] * K_Y[q[2]] | 0,
                Y = new Date;
            this.deadline = Y.setMilliseconds(Y.getMilliseconds() + K), this.deadlineTimer = setTimeout(() => {
                let z = {
                    code: ON.Status.DEADLINE_EXCEEDED,
                    details: "Deadline exceeded",
                    metadata: null
                };
                this.sendStatus(z)
            }, K)
        }
        checkCancelled() {
            if (!this.cancelled && (this.stream.destroyed || this.stream.closed)) this.notifyOnCancel(), this.cancelled = !0;
            return this.cancelled
        }
        notifyOnCancel() {
            if (this.cancelNotified) return;
            if (this.cancelNotified = !0, this.cancelled = !0, process.nextTick(() => {
                    var A;
                    (A = this.listener) === null || A === void 0 || A.onCancel()
                }), this.deadlineTimer) clearTimeout(this.deadlineTimer);
            this.stream.resume()
        }
        maybeSendMetadata() {
            if (!this.metadataSent) this.sendMetadata(new m06.Metadata)
        }
        serializeMessage(A) {
            let q = this.handler.serialize(A),
                K = q.byteLength,
                Y = Buffer.allocUnsafe(K + 5);
            return Y.writeUInt8(0, 0), Y.writeUInt32BE(K, 1), q.copy(Y, 5), Y
        }
        decompressMessage(A, q) {
            let K = A.subarray(5);
            if (q === "identity") return K;
            else if (q === "deflate" || q === "gzip") {
                let Y;
                if (q === "deflate") Y = lN4.createInflate();
                else Y = lN4.createGunzip();
                return new Promise((z, w) => {
                    let H = 0,
                        $ = [];
                    Y.on("data", (O) => {
                        if ($.push(O), H += O.byteLength, this.maxReceiveMessageSize !== -1 && H > this.maxReceiveMessageSize) Y.destroy(), w({
                            code: ON.Status.RESOURCE_EXHAUSTED,
                            details: `Received message that decompresses to a size larger than ${this.maxReceiveMessageSize}`
                        })
                    }), Y.on("end", () => {
                        z(Buffer.concat($))
                    }), Y.write(K), Y.end()
                })
            } else return Promise.reject({
                code: ON.Status.UNIMPLEMENTED,
                details: `Received message compressed with unsupported encoding "${q}"`
            })
        }
        async decompressAndMaybePush(A) {
            if (A.type !== "COMPRESSED") throw Error(`Invalid queue entry type: ${A.type}`);
            let K = A.compressedMessage.readUInt8(0) === 1 ? this.incomingEncoding : "identity",
                Y;
            try {
                Y = await this.decompressMessage(A.compressedMessage, K)
            } catch (z) {
                this.sendStatus(z);
                return
            }
            try {
                A.parsedMessage = this.handler.deserialize(Y)
            } catch (z) {
                this.sendStatus({
                    code: ON.Status.INTERNAL,
                    details: `Error deserializing request: ${z.message}`
                });
                return
            }
            A.type = "READABLE", this.maybePushNextMessage()
        }
        maybePushNextMessage() {
            if (this.listener && this.isReadPending && this.readQueue.length > 0 && this.readQueue[0].type !== "COMPRESSED") {
                this.isReadPending = !1;
                let A = this.readQueue.shift();
                if (A.type === "READABLE") this.listener.onReceiveMessage(A.parsedMessage);
                else this.listener.onReceiveHalfClose()
            }
        }
        handleDataFrame(A) {
            var q;
            if (this.checkCancelled()) return;
            u31("Request to " + this.handler.path + " received data frame of size " + A.length);
            let K;
            try {
                K = this.decoder.write(A)
            } catch (Y) {
                this.sendStatus({
                    code: ON.Status.RESOURCE_EXHAUSTED,
                    details: Y.message
                });
                return
            }
            for (let Y of K) {
                this.stream.pause();
                let z = {
                    type: "COMPRESSED",
                    compressedMessage: Y,
                    parsedMessage: null
                };
                this.readQueue.push(z), this.decompressAndMaybePush(z), (q = this.callEventTracker) === null || q === void 0 || q.addMessageReceived()
            }
        }
        handleEndEvent() {
            this.readQueue.push({
                type: "HALF_CLOSE",
                compressedMessage: null,
                parsedMessage: null
            }), this.receivedHalfClose = !0, this.maybePushNextMessage()
        }
        start(A) {
            if (u31("Request to " + this.handler.path + " start called"), this.checkCancelled()) return;
            this.listener = A, A.onReceiveMetadata(this.metadata)
        }
        sendMetadata(A) {
            if (this.checkCancelled()) return;
            if (this.metadataSent) return;
            this.metadataSent = !0;
            let q = A ? A.toHttp2Headers() : null,
                K = Object.assign(Object.assign(Object.assign({}, oN4), Y_Y), q);
            this.stream.respond(K, z_Y)
        }
        sendMessage(A, q) {
            if (this.checkCancelled()) return;
            let K;
            try {
                K = this.serializeMessage(A)
            } catch (Y) {
                this.sendStatus({
                    code: ON.Status.INTERNAL,
                    details: `Error serializing response: ${(0,cN4.getErrorMessage)(Y)}`,
                    metadata: null
                });
                return
            }
            if (this.maxSendMessageSize !== -1 && K.length - 5 > this.maxSendMessageSize) {
                this.sendStatus({
                    code: ON.Status.RESOURCE_EXHAUSTED,
                    details: `Sent message larger than max (${K.length} vs. ${this.maxSendMessageSize})`,
                    metadata: null
                });
                return
            }
            this.maybeSendMetadata(), u31("Request to " + this.handler.path + " sent data frame of size " + K.length), this.stream.write(K, (Y) => {
                var z;
                if (Y) {
                    this.sendStatus({
                        code: ON.Status.INTERNAL,
                        details: `Error writing message: ${(0,cN4.getErrorMessage)(Y)}`,
                        metadata: null
                    });
                    return
                }(z = this.callEventTracker) === null || z === void 0 || z.addMessageSent(), q()
            })
        }
        sendStatus(A) {
            var q, K, Y;
            if (this.checkCancelled()) return;
            u31("Request to method " + ((q = this.handler) === null || q === void 0 ? void 0 : q.path) + " ended with status code: " + ON.Status[A.code] + " details: " + A.details);
            let z = (Y = (K = A.metadata) === null || K === void 0 ? void 0 : K.clone()) !== null && Y !== void 0 ? Y : new m06.Metadata;
            if (this.shouldSendMetrics) z.set(iN4.GRPC_METRICS_HEADER, this.metricsRecorder.serialize());
            if (this.metadataSent)
                if (!this.wantTrailers) this.wantTrailers = !0, this.stream.once("wantTrailers", () => {
                    if (this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!0), this.callEventTracker.onCallEnd(A);
                    let w = Object.assign({
                        [rN4]: A.code,
                        [nN4]: encodeURI(A.details)
                    }, z.toHttp2Headers());
                    this.stream.sendTrailers(w), this.notifyOnCancel()
                }), this.stream.end();
                else this.notifyOnCancel();
            else {
                if (this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!0), this.callEventTracker.onCallEnd(A);
                let w = Object.assign(Object.assign({
                    [rN4]: A.code,
                    [nN4]: encodeURI(A.details)
                }, oN4), z.toHttp2Headers());
                this.stream.respond(w, {
                    endStream: !0
                }), this.notifyOnCancel()
            }
        }
        startRead() {
            if (u31("Request to " + this.handler.path + " startRead called"), this.checkCancelled()) return;
            if (this.isReadPending = !0, this.readQueue.length === 0) {
                if (!this.receivedHalfClose) this.stream.resume()
            } else this.maybePushNextMessage()
        }
        getPeer() {
            var A;
            let q = (A = this.stream.session) === null || A === void 0 ? void 0 : A.socket;
            if (q === null || q === void 0 ? void 0 : q.remoteAddress)
                if (q.remotePort) return `${q.remoteAddress}:${q.remotePort}`;
                else return q.remoteAddress;
            else return "unknown"
        }
        getDeadline() {
            return this.deadline
        }
        getHost() {
            return this.host
        }
        getAuthContext() {
            var A;
            if (((A = this.stream.session) === null || A === void 0 ? void 0 : A.socket) instanceof eOY.TLSSocket) {
                let q = this.stream.session.socket.getPeerCertificate();
                return {
                    transportSecurityType: "ssl",
                    sslPeerCertificate: q.raw ? q : void 0
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
    YT4.BaseServerInterceptingCall = pVA;

    function w_Y(A, q, K, Y, z, w) {
        let H = {
                path: z.path,
                requestStream: z.type === "clientStream" || z.type === "bidi",
                responseStream: z.type === "serverStream" || z.type === "bidi",
                requestDeserialize: z.deserialize,
                responseSerialize: z.serialize
            },
            $ = new pVA(q, K, Y, z, w);
        return A.reduce((O, _) => {
            return _(H, O)
        }, $)
    }
})
// @from(Ln 298729, Col 4)
XT4 = R((us) => {
    var X_Y = us && us.__runInitializers || function(A, q, K) {
            var Y = arguments.length > 2;
            for (var z = 0; z < q.length; z++) K = Y ? q[z].call(A, K) : q[z].call(A);
            return Y ? K : void 0
        },
        D_Y = us && us.__esDecorate || function(A, q, K, Y, z, w) {
            function H(G) {
                if (G !== void 0 && typeof G !== "function") throw TypeError("Function expected");
                return G
            }
            var $ = Y.kind,
                O = $ === "getter" ? "get" : $ === "setter" ? "set" : "value",
                _ = !q && A ? Y.static ? A : A.prototype : null,
                J = q || (_ ? Object.getOwnPropertyDescriptor(_, Y.name) : {}),
                X, D = !1;
            for (var j = K.length - 1; j >= 0; j--) {
                var M = {};
                for (var P in Y) M[P] = P === "access" ? {} : Y[P];
                for (var P in Y.access) M.access[P] = Y.access[P];
                M.addInitializer = function(G) {
                    if (D) throw TypeError("Cannot add initializers after decoration has completed");
                    w.push(H(G || null))
                };
                var W = (0, K[j])($ === "accessor" ? {
                    get: J.get,
                    set: J.set
                } : J[O], M);
                if ($ === "accessor") {
                    if (W === void 0) continue;
                    if (W === null || typeof W !== "object") throw TypeError("Object expected");
                    if (X = H(W.get)) J.get = X;
                    if (X = H(W.set)) J.set = X;
                    if (X = H(W.init)) z.unshift(X)
                } else if (X = H(W))
                    if ($ === "field") z.unshift(X);
                    else J[O] = X
            }
            if (_) Object.defineProperty(_, Y.name, J);
            D = !0
        };
    Object.defineProperty(us, "__esModule", {
        value: !0
    });
    us.Server = void 0;
    var _N = h1("http2"),
        j_Y = h1("util"),
        LJ = w9(),
        JP1 = RN4(),
        cVA = I06(),
        wT4 = lh(),
        _P1 = mw(),
        bs = $N(),
        sh = mZ(),
        rD = hs(),
        HT4 = dVA(),
        OP1 = 2147483647,
        lVA = 2147483647,
        M_Y = 20000,
        $T4 = 2147483647,
        {
            HTTP2_HEADER_PATH: OT4
        } = _N.constants,
        P_Y = "server",
        _T4 = Buffer.from("max_age");

    function JT4(A) {
        _P1.trace(LJ.LogVerbosity.DEBUG, "server_call", A)
    }

    function W_Y() {}

    function G_Y(A) {
        return function(q, K) {
            return j_Y.deprecate(q, A)
        }
    }

    function iVA(A) {
        return {
            code: LJ.Status.UNIMPLEMENTED,
            details: `The server does not implement the method ${A}`
        }
    }

    function Z_Y(A, q) {
        let K = iVA(q);
        switch (A) {
            case "unary":
                return (Y, z) => {
                    z(K, null)
                };
            case "clientStream":
                return (Y, z) => {
                    z(K, null)
                };
            case "serverStream":
                return (Y) => {
                    Y.emit("error", K)
                };
            case "bidi":
                return (Y) => {
                    Y.emit("error", K)
                };
            default:
                throw Error(`Invalid handlerType ${A}`)
        }
    }
    var f_Y = (() => {
        var A;
        let q = [],
            K;
        return A = class {
            constructor(z) {
                var w, H, $, O, _, J;
                if (this.boundPorts = (X_Y(this, q), new Map), this.http2Servers = new Map, this.sessionIdleTimeouts = new Map, this.handlers = new Map, this.sessions = new Map, this.started = !1, this.shutdown = !1, this.serverAddressString = "null", this.channelzEnabled = !0, this.options = z !== null && z !== void 0 ? z : {}, this.options["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.channelzTrace = new rD.ChannelzTraceStub, this.callTracker = new rD.ChannelzCallTrackerStub, this.listenerChildrenTracker = new rD.ChannelzChildrenTrackerStub, this.sessionChildrenTracker = new rD.ChannelzChildrenTrackerStub;
                else this.channelzTrace = new rD.ChannelzTrace, this.callTracker = new rD.ChannelzCallTracker, this.listenerChildrenTracker = new rD.ChannelzChildrenTracker, this.sessionChildrenTracker = new rD.ChannelzChildrenTracker;
                if (this.channelzRef = (0, rD.registerChannelzServer)("server", () => this.getChannelzInfo(), this.channelzEnabled), this.channelzTrace.addTrace("CT_INFO", "Server created"), this.maxConnectionAgeMs = (w = this.options["grpc.max_connection_age_ms"]) !== null && w !== void 0 ? w : OP1, this.maxConnectionAgeGraceMs = (H = this.options["grpc.max_connection_age_grace_ms"]) !== null && H !== void 0 ? H : OP1, this.keepaliveTimeMs = ($ = this.options["grpc.keepalive_time_ms"]) !== null && $ !== void 0 ? $ : lVA, this.keepaliveTimeoutMs = (O = this.options["grpc.keepalive_timeout_ms"]) !== null && O !== void 0 ? O : M_Y, this.sessionIdleTimeout = (_ = this.options["grpc.max_connection_idle_ms"]) !== null && _ !== void 0 ? _ : $T4, this.commonServerOptions = {
                        maxSendHeaderBlockLength: Number.MAX_SAFE_INTEGER
                    }, "grpc-node.max_session_memory" in this.options) this.commonServerOptions.maxSessionMemory = this.options["grpc-node.max_session_memory"];
                else this.commonServerOptions.maxSessionMemory = Number.MAX_SAFE_INTEGER;
                if ("grpc.max_concurrent_streams" in this.options) this.commonServerOptions.settings = {
                    maxConcurrentStreams: this.options["grpc.max_concurrent_streams"]
                };
                this.interceptors = (J = this.options.interceptors) !== null && J !== void 0 ? J : [], this.trace("Server constructed")
            }
            getChannelzInfo() {
                return {
                    trace: this.channelzTrace,
                    callTracker: this.callTracker,
                    listenerChildren: this.listenerChildrenTracker.getChildLists(),
                    sessionChildren: this.sessionChildrenTracker.getChildLists()
                }
            }
            getChannelzSessionInfo(z) {
                var w, H, $;
                let O = this.sessions.get(z),
                    _ = z.socket,
                    J = _.remoteAddress ? (0, bs.stringToSubchannelAddress)(_.remoteAddress, _.remotePort) : null,
                    X = _.localAddress ? (0, bs.stringToSubchannelAddress)(_.localAddress, _.localPort) : null,
                    D;
                if (z.encrypted) {
                    let M = _,
                        P = M.getCipher(),
                        W = M.getCertificate(),
                        G = M.getPeerCertificate();
                    D = {
                        cipherSuiteStandardName: (w = P.standardName) !== null && w !== void 0 ? w : null,
                        cipherSuiteOtherName: P.standardName ? null : P.name,
                        localCertificate: W && "raw" in W ? W.raw : null,
                        remoteCertificate: G && "raw" in G ? G.raw : null
                    }
                } else D = null;
                return {
                    remoteAddress: J,
                    localAddress: X,
                    security: D,
                    remoteName: null,
                    streamsStarted: O.streamTracker.callsStarted,
                    streamsSucceeded: O.streamTracker.callsSucceeded,
                    streamsFailed: O.streamTracker.callsFailed,
                    messagesSent: O.messagesSent,
                    messagesReceived: O.messagesReceived,
                    keepAlivesSent: O.keepAlivesSent,
                    lastLocalStreamCreatedTimestamp: null,
                    lastRemoteStreamCreatedTimestamp: O.streamTracker.lastCallStartedTimestamp,
                    lastMessageSentTimestamp: O.lastMessageSentTimestamp,
                    lastMessageReceivedTimestamp: O.lastMessageReceivedTimestamp,
                    localFlowControlWindow: (H = z.state.localWindowSize) !== null && H !== void 0 ? H : null,
                    remoteFlowControlWindow: ($ = z.state.remoteWindowSize) !== null && $ !== void 0 ? $ : null
                }
            }
            trace(z) {
                _P1.trace(LJ.LogVerbosity.DEBUG, P_Y, "(" + this.channelzRef.id + ") " + z)
            }
            keepaliveTrace(z) {
                _P1.trace(LJ.LogVerbosity.DEBUG, "keepalive", "(" + this.channelzRef.id + ") " + z)
            }
            addProtoService() {
                throw Error("Not implemented. Use addService() instead")
            }
            addService(z, w) {
                if (z === null || typeof z !== "object" || w === null || typeof w !== "object") throw Error("addService() requires two objects as arguments");
                let H = Object.keys(z);
                if (H.length === 0) throw Error("Cannot add an empty service to a server");
                H.forEach(($) => {
                    let O = z[$],
                        _;
                    if (O.requestStream)
                        if (O.responseStream) _ = "bidi";
                        else _ = "clientStream";
                    else if (O.responseStream) _ = "serverStream";
                    else _ = "unary";
                    let J = w[$],
                        X;
                    if (J === void 0 && typeof O.originalName === "string") J = w[O.originalName];
                    if (J !== void 0) X = J.bind(w);
                    else X = Z_Y(_, $);
                    if (this.register(O.path, X, O.responseSerialize, O.requestDeserialize, _) === !1) throw Error(`Method handler for ${O.path} already provided.`)
                })
            }
            removeService(z) {
                if (z === null || typeof z !== "object") throw Error("removeService() requires object as argument");
                Object.keys(z).forEach((H) => {
                    let $ = z[H];
                    this.unregister($.path)
                })
            }
            bind(z, w) {
                throw Error("Not implemented. Use bindAsync() instead")
            }
            experimentalRegisterListenerToChannelz(z) {
                return (0, rD.registerChannelzSocket)((0, bs.subchannelAddressToString)(z), () => {
                    return {
                        localAddress: z,
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
            experimentalUnregisterListenerFromChannelz(z) {
                (0, rD.unregisterChannelzRef)(z)
            }
            createHttp2Server(z) {
                let w;
                if (z._isSecure()) {
                    let H = z._getConstructorOptions(),
                        $ = z._getSecureContextOptions(),
                        O = Object.assign(Object.assign(Object.assign(Object.assign({}, this.commonServerOptions), H), $), {
                            enableTrace: this.options["grpc-node.tls_enable_trace"] === 1
                        }),
                        _ = $ !== null;
                    this.trace("Initial credentials valid: " + _), w = _N.createSecureServer(O), w.prependListener("connection", (X) => {
                        if (!_) this.trace("Dropped connection from " + JSON.stringify(X.address()) + " due to unloaded credentials"), X.destroy()
                    }), w.on("secureConnection", (X) => {
                        X.on("error", (D) => {
                            this.trace("An incoming TLS connection closed with error: " + D.message)
                        })
                    });
                    let J = (X) => {
                        if (X) {
                            let D = w;
                            try {
                                D.setSecureContext(X)
                            } catch (j) {
                                _P1.log(LJ.LogVerbosity.ERROR, "Failed to set secure context with error " + j.message), X = null
                            }
                        }
                        _ = X !== null, this.trace("Post-update credentials valid: " + _)
                    };
                    z._addWatcher(J), w.on("close", () => {
                        z._removeWatcher(J)
                    })
                } else w = _N.createServer(this.commonServerOptions);
                return w.setTimeout(0, W_Y), this._setupHandlers(w, z._getInterceptors()), w
            }
            bindOneAddress(z, w) {
                this.trace("Attempting to bind " + (0, bs.subchannelAddressToString)(z));
                let H = this.createHttp2Server(w.credentials);
                return new Promise(($, O) => {
                    let _ = (J) => {
                        this.trace("Failed to bind " + (0, bs.subchannelAddressToString)(z) + " with error " + J.message), $({
                            port: "port" in z ? z.port : 1,
                            error: J.message
                        })
                    };
                    H.once("error", _), H.listen(z, () => {
                        let J = H.address(),
                            X;
                        if (typeof J === "string") X = {
                            path: J
                        };
                        else X = {
                            host: J.address,
                            port: J.port
                        };
                        let D = this.experimentalRegisterListenerToChannelz(X);
                        this.listenerChildrenTracker.refChild(D), this.http2Servers.set(H, {
                            channelzRef: D,
                            sessions: new Set,
                            ownsChannelzRef: !0
                        }), w.listeningServers.add(H), this.trace("Successfully bound " + (0, bs.subchannelAddressToString)(X)), $({
                            port: "port" in X ? X.port : 1
                        }), H.removeListener("error", _)
                    })
                })
            }
            async bindManyPorts(z, w) {
                if (z.length === 0) return {
                    count: 0,
                    port: 0,
                    errors: []
                };
                if ((0, bs.isTcpSubchannelAddress)(z[0]) && z[0].port === 0) {
                    let H = await this.bindOneAddress(z[0], w);
                    if (H.error) {
                        let $ = await this.bindManyPorts(z.slice(1), w);
                        return Object.assign(Object.assign({}, $), {
                            errors: [H.error, ...$.errors]
                        })
                    } else {
                        let $ = z.slice(1).map((J) => (0, bs.isTcpSubchannelAddress)(J) ? {
                                host: J.host,
                                port: H.port
                            } : J),
                            O = await Promise.all($.map((J) => this.bindOneAddress(J, w))),
                            _ = [H, ...O];
                        return {
                            count: _.filter((J) => J.error === void 0).length,
                            port: H.port,
                            errors: _.filter((J) => J.error).map((J) => J.error)
                        }
                    }
                } else {
                    let H = await Promise.all(z.map(($) => this.bindOneAddress($, w)));
                    return {
                        count: H.filter(($) => $.error === void 0).length,
                        port: H[0].port,
                        errors: H.filter(($) => $.error).map(($) => $.error)
                    }
                }
            }
            async bindAddressList(z, w) {
                let H = await this.bindManyPorts(z, w);
                if (H.count > 0) {
                    if (H.count < z.length) _P1.log(LJ.LogVerbosity.INFO, `WARNING Only ${H.count} addresses added out of total ${z.length} resolved`);
                    return H.port
                } else {
                    let $ = `No address added out of total ${z.length} resolved`;
                    throw _P1.log(LJ.LogVerbosity.ERROR, $), Error(`${$} errors: [${H.errors.join(",")}]`)
                }
            }
            resolvePort(z) {
                return new Promise((w, H) => {
                    let $ = !1,
                        O = (J, X, D, j) => {
                            if ($) return !0;
                            if ($ = !0, !J.ok) return H(Error(J.error.details)), !0;
                            let M = [].concat(...J.value.map((P) => P.addresses));
                            if (M.length === 0) return H(Error(`No addresses resolved for port ${z}`)), !0;
                            return w(M), !0
                        };
                    (0, wT4.createResolver)(z, O, this.options).updateResolution()
                })
            }
            async bindPort(z, w) {
                let H = await this.resolvePort(z);
                if (w.cancelled) throw this.completeUnbind(w), Error("bindAsync operation cancelled by unbind call");
                let $ = await this.bindAddressList(H, w);
                if (w.cancelled) throw this.completeUnbind(w), Error("bindAsync operation cancelled by unbind call");
                return $
            }
            normalizePort(z) {
                let w = (0, sh.parseUri)(z);
                if (w === null) throw Error(`Could not parse port "${z}"`);
                let H = (0, wT4.mapUriDefaultScheme)(w);
                if (H === null) throw Error(`Could not get a default scheme for port "${z}"`);
                return H
            }
            bindAsync(z, w, H) {
                if (this.shutdown) throw Error("bindAsync called after shutdown");
                if (typeof z !== "string") throw TypeError("port must be a string");
                if (w === null || !(w instanceof cVA.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
                if (typeof H !== "function") throw TypeError("callback must be a function");
                this.trace("bindAsync port=" + z);
                let $ = this.normalizePort(z),
                    O = (D, j) => {
                        process.nextTick(() => H(D, j))
                    },
                    _ = this.boundPorts.get((0, sh.uriToString)($));
                if (_) {
                    if (!w._equals(_.credentials)) {
                        O(Error(`${z} already bound with incompatible credentials`), 0);
                        return
                    }
                    if (_.cancelled = !1, _.completionPromise) _.completionPromise.then((D) => H(null, D), (D) => H(D, 0));
                    else O(null, _.portNumber);
                    return
                }
                _ = {
                    mapKey: (0, sh.uriToString)($),
                    originalUri: $,
                    completionPromise: null,
                    cancelled: !1,
                    portNumber: 0,
                    credentials: w,
                    listeningServers: new Set
                };
                let J = (0, sh.splitHostPort)($.path),
                    X = this.bindPort($, _);
                if (_.completionPromise = X, (J === null || J === void 0 ? void 0 : J.port) === 0) X.then((D) => {
                    let j = {
                        scheme: $.scheme,
                        authority: $.authority,
                        path: (0, sh.combineHostPort)({
                            host: J.host,
                            port: D
                        })
                    };
                    _.mapKey = (0, sh.uriToString)(j), _.completionPromise = null, _.portNumber = D, this.boundPorts.set(_.mapKey, _), H(null, D)
                }, (D) => {
                    H(D, 0)
                });
                else this.boundPorts.set(_.mapKey, _), X.then((D) => {
                    _.completionPromise = null, _.portNumber = D, H(null, D)
                }, (D) => {
                    H(D, 0)
                })
            }
            registerInjectorToChannelz() {
                return (0, rD.registerChannelzSocket)("injector", () => {
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
            experimentalCreateConnectionInjectorWithChannelzRef(z, w, H = !1) {
                if (z === null || !(z instanceof cVA.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
                if (this.channelzEnabled) this.listenerChildrenTracker.refChild(w);
                let $ = this.createHttp2Server(z),
                    O = new Set;
                return this.http2Servers.set($, {
                    channelzRef: w,
                    sessions: O,
                    ownsChannelzRef: H
                }), {
                    injectConnection: (_) => {
                        $.emit("connection", _)
                    },
                    drain: (_) => {
                        var J, X;
                        for (let D of O) this.closeSession(D);
                        (X = (J = setTimeout(() => {
                            for (let D of O) D.destroy(_N.constants.NGHTTP2_CANCEL)
                        }, _)).unref) === null || X === void 0 || X.call(J)
                    },
                    destroy: () => {
                        this.closeServer($);
                        for (let _ of O) this.closeSession(_)
                    }
                }
            }
            createConnectionInjector(z) {
                if (z === null || !(z instanceof cVA.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
                let w = this.registerInjectorToChannelz();
                return this.experimentalCreateConnectionInjectorWithChannelzRef(z, w, !0)
            }
            closeServer(z, w) {
                this.trace("Closing server with address " + JSON.stringify(z.address()));
                let H = this.http2Servers.get(z);
                z.close(() => {
                    if (H && H.ownsChannelzRef) this.listenerChildrenTracker.unrefChild(H.channelzRef), (0, rD.unregisterChannelzRef)(H.channelzRef);
                    this.http2Servers.delete(z), w === null || w === void 0 || w()
                })
            }
            closeSession(z, w) {
                var H;
                this.trace("Closing session initiated by " + ((H = z.socket) === null || H === void 0 ? void 0 : H.remoteAddress));
                let $ = this.sessions.get(z),
                    O = () => {
                        if ($) this.sessionChildrenTracker.unrefChild($.ref), (0, rD.unregisterChannelzRef)($.ref);
                        w === null || w === void 0 || w()
                    };
                if (z.closed) queueMicrotask(O);
                else z.close(O)
            }
            completeUnbind(z) {
                for (let w of z.listeningServers) {
                    let H = this.http2Servers.get(w);
                    if (this.closeServer(w, () => {
                            z.listeningServers.delete(w)
                        }), H)
                        for (let $ of H.sessions) this.closeSession($)
                }
                this.boundPorts.delete(z.mapKey)
            }
            unbind(z) {
                this.trace("unbind port=" + z);
                let w = this.normalizePort(z),
                    H = (0, sh.splitHostPort)(w.path);
                if ((H === null || H === void 0 ? void 0 : H.port) === 0) throw Error("Cannot unbind port 0");
                let $ = this.boundPorts.get((0, sh.uriToString)(w));
                if ($)
                    if (this.trace("unbinding " + $.mapKey + " originally bound as " + (0, sh.uriToString)($.originalUri)), $.completionPromise) $.cancelled = !0;
                    else this.completeUnbind($)
            }
            drain(z, w) {
                var H, $;
                this.trace("drain port=" + z + " graceTimeMs=" + w);
                let O = this.normalizePort(z),
                    _ = (0, sh.splitHostPort)(O.path);
                if ((_ === null || _ === void 0 ? void 0 : _.port) === 0) throw Error("Cannot drain port 0");
                let J = this.boundPorts.get((0, sh.uriToString)(O));
                if (!J) return;
                let X = new Set;
                for (let D of J.listeningServers) {
                    let j = this.http2Servers.get(D);
                    if (j)
                        for (let M of j.sessions) X.add(M), this.closeSession(M, () => {
                            X.delete(M)
                        })
                }($ = (H = setTimeout(() => {
                    for (let D of X) D.destroy(_N.constants.NGHTTP2_CANCEL)
                }, w)).unref) === null || $ === void 0 || $.call(H)
            }
            forceShutdown() {
                for (let z of this.boundPorts.values()) z.cancelled = !0;
                this.boundPorts.clear();
                for (let z of this.http2Servers.keys()) this.closeServer(z);
                this.sessions.forEach((z, w) => {
                    this.closeSession(w), w.destroy(_N.constants.NGHTTP2_CANCEL)
                }), this.sessions.clear(), (0, rD.unregisterChannelzRef)(this.channelzRef), this.shutdown = !0
            }
            register(z, w, H, $, O) {
                if (this.handlers.has(z)) return !1;
                return this.handlers.set(z, {
                    func: w,
                    serialize: H,
                    deserialize: $,
                    type: O,
                    path: z
                }), !0
            }
            unregister(z) {
                return this.handlers.delete(z)
            }
            start() {
                if (this.http2Servers.size === 0 || [...this.http2Servers.keys()].every((z) => !z.listening)) throw Error("server must be bound in order to start");
                if (this.started === !0) throw Error("server is already started");
                this.started = !0
            }
            tryShutdown(z) {
                var w;
                let H = (_) => {
                        (0, rD.unregisterChannelzRef)(this.channelzRef), z(_)
                    },
                    $ = 0;

                function O() {
                    if ($--, $ === 0) H()
                }
                this.shutdown = !0;
                for (let [_, J] of this.http2Servers.entries()) {
                    $++;
                    let X = J.channelzRef.name;
                    this.trace("Waiting for server " + X + " to close"), this.closeServer(_, () => {
                        this.trace("Server " + X + " finished closing"), O()
                    });
                    for (let D of J.sessions.keys()) {
                        $++;
                        let j = (w = D.socket) === null || w === void 0 ? void 0 : w.remoteAddress;
                        this.trace("Waiting for session " + j + " to close"), this.closeSession(D, () => {
                            this.trace("Session " + j + " finished closing"), O()
                        })
                    }
                }
                if ($ === 0) H()
            }
            addHttp2Port() {
                throw Error("Not yet implemented")
            }
            getChannelzRef() {
                return this.channelzRef
            }
            _verifyContentType(z, w) {
                let H = w[_N.constants.HTTP2_HEADER_CONTENT_TYPE];
                if (typeof H !== "string" || !H.startsWith("application/grpc")) return z.respond({
                    [_N.constants.HTTP2_HEADER_STATUS]: _N.constants.HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE
                }, {
                    endStream: !0
                }), !1;
                return !0
            }
            _retrieveHandler(z) {
                JT4("Received call to method " + z + " at address " + this.serverAddressString);
                let w = this.handlers.get(z);
                if (w === void 0) return JT4("No handler registered for method " + z + ". Sending UNIMPLEMENTED status."), null;
                return w
            }
            _respondWithError(z, w, H = null) {
                var $, O;
                let _ = Object.assign({
                    "grpc-status": ($ = z.code) !== null && $ !== void 0 ? $ : LJ.Status.INTERNAL,
                    "grpc-message": z.details,
                    [_N.constants.HTTP2_HEADER_STATUS]: _N.constants.HTTP_STATUS_OK,
                    [_N.constants.HTTP2_HEADER_CONTENT_TYPE]: "application/grpc+proto"
                }, (O = z.metadata) === null || O === void 0 ? void 0 : O.toHttp2Headers());
                w.respond(_, {
                    endStream: !0
                }), this.callTracker.addCallFailed(), H === null || H === void 0 || H.streamTracker.addCallFailed()
            }
            _channelzHandler(z, w, H) {
                this.onStreamOpened(w);
                let $ = this.sessions.get(w.session);
                if (this.callTracker.addCallStarted(), $ === null || $ === void 0 || $.streamTracker.addCallStarted(), !this._verifyContentType(w, H)) {
                    this.callTracker.addCallFailed(), $ === null || $ === void 0 || $.streamTracker.addCallFailed();
                    return
                }
                let O = H[OT4],
                    _ = this._retrieveHandler(O);
                if (!_) {
                    this._respondWithError(iVA(O), w, $);
                    return
                }
                let J = {
                        addMessageSent: () => {
                            if ($) $.messagesSent += 1, $.lastMessageSentTimestamp = new Date
                        },
                        addMessageReceived: () => {
                            if ($) $.messagesReceived += 1, $.lastMessageReceivedTimestamp = new Date
                        },
                        onCallEnd: (D) => {
                            if (D.code === LJ.Status.OK) this.callTracker.addCallSucceeded();
                            else this.callTracker.addCallFailed()
                        },
                        onStreamEnd: (D) => {
                            if ($)
                                if (D) $.streamTracker.addCallSucceeded();
                                else $.streamTracker.addCallFailed()
                        }
                    },
                    X = (0, HT4.getServerInterceptingCall)([...z, ...this.interceptors], w, H, J, _, this.options);
                if (!this._runHandlerForCall(X, _)) this.callTracker.addCallFailed(), $ === null || $ === void 0 || $.streamTracker.addCallFailed(), X.sendStatus({
                    code: LJ.Status.INTERNAL,
                    details: `Unknown handler type: ${_.type}`
                })
            }
            _streamHandler(z, w, H) {
                if (this.onStreamOpened(w), this._verifyContentType(w, H) !== !0) return;
                let $ = H[OT4],
                    O = this._retrieveHandler($);
                if (!O) {
                    this._respondWithError(iVA($), w, null);
                    return
                }
                let _ = (0, HT4.getServerInterceptingCall)([...z, ...this.interceptors], w, H, null, O, this.options);
                if (!this._runHandlerForCall(_, O)) _.sendStatus({
                    code: LJ.Status.INTERNAL,
                    details: `Unknown handler type: ${O.type}`
                })
            }
            _runHandlerForCall(z, w) {
                let {
                    type: H
                } = w;
                if (H === "unary") V_Y(z, w);
                else if (H === "clientStream") N_Y(z, w);
                else if (H === "serverStream") T_Y(z, w);
                else if (H === "bidi") v_Y(z, w);
                else return !1;
                return !0
            }
            _setupHandlers(z, w) {
                if (z === null) return;
                let H = z.address(),
                    $ = "null";
                if (H)
                    if (typeof H === "string") $ = H;
                    else $ = H.address + ":" + H.port;
                this.serverAddressString = $;
                let O = this.channelzEnabled ? this._channelzHandler : this._streamHandler,
                    _ = this.channelzEnabled ? this._channelzSessionHandler(z) : this._sessionHandler(z);
                z.on("stream", O.bind(this, w)), z.on("session", _)
            }
            _sessionHandler(z) {
                return (w) => {
                    var H, $;
                    (H = this.http2Servers.get(z)) === null || H === void 0 || H.sessions.add(w);
                    let O = null,
                        _ = null,
                        J = null,
                        X = !1,
                        D = this.enableIdleTimeout(w);
                    if (this.maxConnectionAgeMs !== OP1) {
                        let G = this.maxConnectionAgeMs / 10,
                            f = Math.random() * G * 2 - G;
                        O = setTimeout(() => {
                            var Z, N;
                            X = !0, this.trace("Connection dropped by max connection age: " + ((Z = w.socket) === null || Z === void 0 ? void 0 : Z.remoteAddress));
                            try {
                                w.goaway(_N.constants.NGHTTP2_NO_ERROR, 2147483647, _T4)
                            } catch (T) {
                                w.destroy();
                                return
                            }
                            if (w.close(), this.maxConnectionAgeGraceMs !== OP1) _ = setTimeout(() => {
                                w.destroy()
                            }, this.maxConnectionAgeGraceMs), (N = _.unref) === null || N === void 0 || N.call(_)
                        }, this.maxConnectionAgeMs + f), ($ = O.unref) === null || $ === void 0 || $.call(O)
                    }
                    let j = () => {
                            if (J) clearTimeout(J), J = null
                        },
                        M = () => {
                            return !w.destroyed && this.keepaliveTimeMs < lVA && this.keepaliveTimeMs > 0
                        },
                        P, W = () => {
                            var G;
                            if (!M()) return;
                            this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), J = setTimeout(() => {
                                j(), P()
                            }, this.keepaliveTimeMs), (G = J.unref) === null || G === void 0 || G.call(J)
                        };
                    P = () => {
                        var G;
                        if (!M()) return;
                        this.keepaliveTrace("Sending ping with timeout " + this.keepaliveTimeoutMs + "ms");
                        let f = "";
                        try {
                            if (!w.ping((N, T, k) => {
                                    if (j(), N) this.keepaliveTrace("Ping failed with error: " + N.message), X = !0, w.close();
                                    else this.keepaliveTrace("Received ping response"), W()
                                })) f = "Ping returned false"
                        } catch (Z) {
                            f = (Z instanceof Error ? Z.message : "") || "Unknown error"
                        }
                        if (f) {
                            this.keepaliveTrace("Ping send failed: " + f), this.trace("Connection dropped due to ping send error: " + f), X = !0, w.close();
                            return
                        }
                        J = setTimeout(() => {
                            j(), this.keepaliveTrace("Ping timeout passed without response"), this.trace("Connection dropped by keepalive timeout"), X = !0, w.close()
                        }, this.keepaliveTimeoutMs), (G = J.unref) === null || G === void 0 || G.call(J)
                    }, W(), w.on("close", () => {
                        var G, f;
                        if (!X) this.trace(`Connection dropped by client ${(G=w.socket)===null||G===void 0?void 0:G.remoteAddress}`);
                        if (O) clearTimeout(O);
                        if (_) clearTimeout(_);
                        if (j(), D !== null) clearTimeout(D.timeout), this.sessionIdleTimeouts.delete(w);
                        (f = this.http2Servers.get(z)) === null || f === void 0 || f.sessions.delete(w)
                    })
                }
            }
            _channelzSessionHandler(z) {
                return (w) => {
                    var H, $, O, _;
                    let J = (0, rD.registerChannelzSocket)(($ = (H = w.socket) === null || H === void 0 ? void 0 : H.remoteAddress) !== null && $ !== void 0 ? $ : "unknown", this.getChannelzSessionInfo.bind(this, w), this.channelzEnabled),
                        X = {
                            ref: J,
                            streamTracker: new rD.ChannelzCallTracker,
                            messagesSent: 0,
                            messagesReceived: 0,
                            keepAlivesSent: 0,
                            lastMessageSentTimestamp: null,
                            lastMessageReceivedTimestamp: null
                        };
                    (O = this.http2Servers.get(z)) === null || O === void 0 || O.sessions.add(w), this.sessions.set(w, X);
                    let D = `${w.socket.remoteAddress}:${w.socket.remotePort}`;
                    this.channelzTrace.addTrace("CT_INFO", "Connection established by client " + D), this.trace("Connection established by client " + D), this.sessionChildrenTracker.refChild(J);
                    let j = null,
                        M = null,
                        P = null,
                        W = !1,
                        G = this.enableIdleTimeout(w);
                    if (this.maxConnectionAgeMs !== OP1) {
                        let k = this.maxConnectionAgeMs / 10,
                            y = Math.random() * k * 2 - k;
                        j = setTimeout(() => {
                            var B;
                            W = !0, this.channelzTrace.addTrace("CT_INFO", "Connection dropped by max connection age from " + D);
                            try {
                                w.goaway(_N.constants.NGHTTP2_NO_ERROR, 2147483647, _T4)
                            } catch (S) {
                                w.destroy();
                                return
                            }
                            if (w.close(), this.maxConnectionAgeGraceMs !== OP1) M = setTimeout(() => {
                                w.destroy()
                            }, this.maxConnectionAgeGraceMs), (B = M.unref) === null || B === void 0 || B.call(M)
                        }, this.maxConnectionAgeMs + y), (_ = j.unref) === null || _ === void 0 || _.call(j)
                    }
                    let f = () => {
                            if (P) clearTimeout(P), P = null
                        },
                        Z = () => {
                            return !w.destroyed && this.keepaliveTimeMs < lVA && this.keepaliveTimeMs > 0
                        },
                        N, T = () => {
                            var k;
                            if (!Z()) return;
                            this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), P = setTimeout(() => {
                                f(), N()
                            }, this.keepaliveTimeMs), (k = P.unref) === null || k === void 0 || k.call(P)
                        };
                    N = () => {
                        var k;
                        if (!Z()) return;
                        this.keepaliveTrace("Sending ping with timeout " + this.keepaliveTimeoutMs + "ms");
                        let y = "";
                        try {
                            if (!w.ping((S, m, b) => {
                                    if (f(), S) this.keepaliveTrace("Ping failed with error: " + S.message), this.channelzTrace.addTrace("CT_INFO", "Connection dropped due to error of a ping frame " + S.message + " return in " + m), W = !0, w.close();
                                    else this.keepaliveTrace("Received ping response"), T()
                                })) y = "Ping returned false"
                        } catch (B) {
                            y = (B instanceof Error ? B.message : "") || "Unknown error"
                        }
                        if (y) {
                            this.keepaliveTrace("Ping send failed: " + y), this.channelzTrace.addTrace("CT_INFO", "Connection dropped due to ping send error: " + y), W = !0, w.close();
                            return
                        }
                        X.keepAlivesSent += 1, P = setTimeout(() => {
                            f(), this.keepaliveTrace("Ping timeout passed without response"), this.channelzTrace.addTrace("CT_INFO", "Connection dropped by keepalive timeout from " + D), W = !0, w.close()
                        }, this.keepaliveTimeoutMs), (k = P.unref) === null || k === void 0 || k.call(P)
                    }, T(), w.on("close", () => {
                        var k;
                        if (!W) this.channelzTrace.addTrace("CT_INFO", "Connection dropped by client " + D);
                        if (this.sessionChildrenTracker.unrefChild(J), (0, rD.unregisterChannelzRef)(J), j) clearTimeout(j);
                        if (M) clearTimeout(M);
                        if (f(), G !== null) clearTimeout(G.timeout), this.sessionIdleTimeouts.delete(w);
                        (k = this.http2Servers.get(z)) === null || k === void 0 || k.sessions.delete(w), this.sessions.delete(w)
                    })
                }
            }
            enableIdleTimeout(z) {
                var w, H;
                if (this.sessionIdleTimeout >= $T4) return null;
                let $ = {
                    activeStreams: 0,
                    lastIdle: Date.now(),
                    onClose: this.onStreamClose.bind(this, z),
                    timeout: setTimeout(this.onIdleTimeout, this.sessionIdleTimeout, this, z)
                };
                (H = (w = $.timeout).unref) === null || H === void 0 || H.call(w), this.sessionIdleTimeouts.set(z, $);
                let {
                    socket: O
                } = z;
                return this.trace("Enable idle timeout for " + O.remoteAddress + ":" + O.remotePort), $
            }
            onIdleTimeout(z, w) {
                let {
                    socket: H
                } = w, $ = z.sessionIdleTimeouts.get(w);
                if ($ !== void 0 && $.activeStreams === 0)
                    if (Date.now() - $.lastIdle >= z.sessionIdleTimeout) z.trace("Session idle timeout triggered for " + (H === null || H === void 0 ? void 0 : H.remoteAddress) + ":" + (H === null || H === void 0 ? void 0 : H.remotePort) + " last idle at " + $.lastIdle), z.closeSession(w);
                    else $.timeout.refresh()
            }
            onStreamOpened(z) {
                let w = z.session,
                    H = this.sessionIdleTimeouts.get(w);
                if (H) H.activeStreams += 1, z.once("close", H.onClose)
            }
            onStreamClose(z) {
                var w, H;
                let $ = this.sessionIdleTimeouts.get(z);
                if ($) {
                    if ($.activeStreams -= 1, $.activeStreams === 0) $.lastIdle = Date.now(), $.timeout.refresh(), this.trace("Session onStreamClose" + ((w = z.socket) === null || w === void 0 ? void 0 : w.remoteAddress) + ":" + ((H = z.socket) === null || H === void 0 ? void 0 : H.remotePort) + " at " + $.lastIdle)
                }
            }
        }, (() => {
            let Y = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            if (K = [G_Y("Calling start() is no longer necessary. It can be safely omitted.")], D_Y(A, null, K, {
                    kind: "method",
                    name: "start",
                    static: !1,
                    private: !1,
                    access: {
                        has: (z) => ("start" in z),
                        get: (z) => z.start
                    },
                    metadata: Y
                }, null, q), Y) Object.defineProperty(A, Symbol.metadata, {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: Y
            })
        })(), A
    })();
    us.Server = f_Y;
    async function V_Y(A, q) {
        let K;

        function Y(H, $, O, _) {
            if (H) {
                A.sendStatus((0, JP1.serverErrorToStatus)(H, O));
                return
            }
            A.sendMessage($, () => {
                A.sendStatus({
                    code: LJ.Status.OK,
                    details: "OK",
                    metadata: O !== null && O !== void 0 ? O : null
                })
            })
        }
        let z, w = null;
        A.start({
            onReceiveMetadata(H) {
                z = H, A.startRead()
            },
            onReceiveMessage(H) {
                if (w) {
                    A.sendStatus({
                        code: LJ.Status.UNIMPLEMENTED,
                        details: `Received a second request message for server streaming method ${q.path}`,
                        metadata: null
                    });
                    return
                }
                w = H, A.startRead()
            },
            onReceiveHalfClose() {
                if (!w) {
                    A.sendStatus({
                        code: LJ.Status.UNIMPLEMENTED,
                        details: `Received no request message for server streaming method ${q.path}`,
                        metadata: null
                    });
                    return
                }
                K = new JP1.ServerWritableStreamImpl(q.path, A, z, w);
                try {
                    q.func(K, Y)
                } catch (H) {
                    A.sendStatus({
                        code: LJ.Status.UNKNOWN,
                        details: `Server method handler threw error ${H.message}`,
                        metadata: null
                    })
                }
            },
            onCancel() {
                if (K) K.cancelled = !0, K.emit("cancelled", "cancelled")
            }
        })
    }

    function N_Y(A, q) {
        let K;

        function Y(z, w, H, $) {
            if (z) {
                A.sendStatus((0, JP1.serverErrorToStatus)(z, H));
                return
            }
            A.sendMessage(w, () => {
                A.sendStatus({
                    code: LJ.Status.OK,
                    details: "OK",
                    metadata: H !== null && H !== void 0 ? H : null
                })
            })
        }
        A.start({
            onReceiveMetadata(z) {
                K = new JP1.ServerDuplexStreamImpl(q.path, A, z);
                try {
                    q.func(K, Y)
                } catch (w) {
                    A.sendStatus({
                        code: LJ.Status.UNKNOWN,
                        details: `Server method handler threw error ${w.message}`,
                        metadata: null
                    })
                }
            },
            onReceiveMessage(z) {
                K.push(z)
            },
            onReceiveHalfClose() {
                K.push(null)
            },
            onCancel() {
                if (K) K.cancelled = !0, K.emit("cancelled", "cancelled"), K.destroy()
            }
        })
    }

    function T_Y(A, q) {
        let K, Y, z = null;
        A.start({
            onReceiveMetadata(w) {
                Y = w, A.startRead()
            },
            onReceiveMessage(w) {
                if (z) {
                    A.sendStatus({
                        code: LJ.Status.UNIMPLEMENTED,
                        details: `Received a second request message for server streaming method ${q.path}`,
                        metadata: null
                    });
                    return
                }
                z = w, A.startRead()
            },
            onReceiveHalfClose() {
                if (!z) {
                    A.sendStatus({
                        code: LJ.Status.UNIMPLEMENTED,
                        details: `Received no request message for server streaming method ${q.path}`,
                        metadata: null
                    });
                    return
                }
                K = new JP1.ServerWritableStreamImpl(q.path, A, Y, z);
                try {
                    q.func(K)
                } catch (w) {
                    A.sendStatus({
                        code: LJ.Status.UNKNOWN,
                        details: `Server method handler threw error ${w.message}`,
                        metadata: null
                    })
                }
            },
            onCancel() {
                if (K) K.cancelled = !0, K.emit("cancelled", "cancelled"), K.destroy()
            }
        })
    }

    function v_Y(A, q) {
        let K;
        A.start({
            onReceiveMetadata(Y) {
                K = new JP1.ServerDuplexStreamImpl(q.path, A, Y);
                try {
                    q.func(K)
                } catch (z) {
                    A.sendStatus({
                        code: LJ.Status.UNKNOWN,
                        details: `Server method handler threw error ${z.message}`,
                        metadata: null
                    })
                }
            },
            onReceiveMessage(Y) {
                K.push(Y)
            },
            onReceiveHalfClose() {
                K.push(null)
            },
            onCancel() {
                if (K) K.cancelled = !0, K.emit("cancelled", "cancelled"), K.destroy()
            }
        })
    }
})
// @from(Ln 299796, Col 4)
PT4 = R((jT4) => {
    Object.defineProperty(jT4, "__esModule", {
        value: !0
    });
    jT4.StatusBuilder = void 0;
    class DT4 {
        constructor() {
            this.code = null, this.details = null, this.metadata = null
        }
        withCode(A) {
            return this.code = A, this
        }
        withDetails(A) {
            return this.details = A, this
        }
        withMetadata(A) {
            return this.metadata = A, this
        }
        build() {
            let A = {};
            if (this.code !== null) A.code = this.code;
            if (this.details !== null) A.details = this.details;
            if (this.metadata !== null) A.metadata = this.metadata;
            return A
        }
    }
    jT4.StatusBuilder = DT4
})