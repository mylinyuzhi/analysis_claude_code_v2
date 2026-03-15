
// @from(Ln 314864, Col 4)
og4 = x((ng4) => {
    Object.defineProperty(ng4, "__esModule", {
        value: !0
    });
    ng4.ServerDuplexStreamImpl = ng4.ServerWritableStreamImpl = ng4.ServerReadableStreamImpl = ng4.ServerUnaryCallImpl = void 0;
    ng4.serverErrorToStatus = NI8;
    var zXY = x6("events"),
        TI8 = x6("stream"),
        vI8 = a3(),
        Ug4 = LX();

    function NI8(A, q) {
        var K;
        let Y = {
            code: vI8.Status.UNKNOWN,
            details: "message" in A ? A.message : "Unknown Error",
            metadata: (K = q !== null && q !== void 0 ? q : A.metadata) !== null && K !== void 0 ? K : null
        };
        if ("code" in A && typeof A.code === "number" && Number.isInteger(A.code)) {
            if (Y.code = A.code, "details" in A && typeof A.details === "string") Y.details = A.details
        }
        return Y
    }
    class dg4 extends zXY.EventEmitter {
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
    ng4.ServerUnaryCallImpl = dg4;
    class cg4 extends TI8.Readable {
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
    ng4.ServerReadableStreamImpl = cg4;
    class lg4 extends TI8.Writable {
        constructor(A, q, K, Y) {
            super({
                objectMode: !0
            });
            this.path = A, this.call = q, this.metadata = K, this.request = Y, this.pendingStatus = {
                code: vI8.Status.OK,
                details: "OK"
            }, this.cancelled = !1, this.trailingMetadata = new Ug4.Metadata, this.on("error", (z) => {
                this.pendingStatus = NI8(z), this.end()
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
    ng4.ServerWritableStreamImpl = lg4;
    class ig4 extends TI8.Duplex {
        constructor(A, q, K) {
            super({
                objectMode: !0
            });
            this.path = A, this.call = q, this.metadata = K, this.pendingStatus = {
                code: vI8.Status.OK,
                details: "OK"
            }, this.cancelled = !1, this.trailingMetadata = new Ug4.Metadata, this.on("error", (Y) => {
                this.pendingStatus = NI8(Y), this.end()
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
    ng4.ServerDuplexStreamImpl = ig4
})
// @from(Ln 315048, Col 4)
pT1 = x((ag4) => {
    Object.defineProperty(ag4, "__esModule", {
        value: !0
    });
    ag4.ServerCredentials = void 0;
    ag4.createCertificateProviderServerCredentials = HXY;
    ag4.createServerCredentialsWithInterceptors = jXY;
    var VI8 = gS8();
    class nG6 {
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
            return new kI8
        }
        static createSsl(A, q, K = !1) {
            var Y;
            if (A !== null && !Buffer.isBuffer(A)) throw TypeError("rootCerts must be null or a Buffer");
            if (!Array.isArray(q)) throw TypeError("keyCertPairs must be an array");
            if (typeof K !== "boolean") throw TypeError("checkClientCertificate must be a boolean");
            let z = [],
                _ = [];
            for (let w = 0; w < q.length; w++) {
                let O = q[w];
                if (O === null || typeof O !== "object") throw TypeError(`keyCertPair[${w}] must be an object`);
                if (!Buffer.isBuffer(O.private_key)) throw TypeError(`keyCertPair[${w}].private_key must be a Buffer`);
                if (!Buffer.isBuffer(O.cert_chain)) throw TypeError(`keyCertPair[${w}].cert_chain must be a Buffer`);
                z.push(O.cert_chain), _.push(O.private_key)
            }
            return new EI8({
                requestCert: K,
                ciphers: VI8.CIPHER_SUITES
            }, {
                ca: (Y = A !== null && A !== void 0 ? A : (0, VI8.getDefaultRootsData)()) !== null && Y !== void 0 ? Y : void 0,
                cert: z,
                key: _
            })
        }
    }
    ag4.ServerCredentials = nG6;
    class kI8 extends nG6 {
        constructor() {
            super(null)
        }
        _getSettings() {
            return null
        }
        _equals(A) {
            return A instanceof kI8
        }
    }
    class EI8 extends nG6 {
        constructor(A, q) {
            super(A, q);
            this.options = Object.assign(Object.assign({}, A), q)
        }
        _equals(A) {
            if (this === A) return !0;
            if (!(A instanceof EI8)) return !1;
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
    class yI8 extends nG6 {
        constructor(A, q, K) {
            super({
                requestCert: q !== null,
                rejectUnauthorized: K,
                ciphers: VI8.CIPHER_SUITES
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
            if (!(A instanceof yI8)) return !1;
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

    function HXY(A, q, K) {
        return new yI8(A, q, K)
    }
    class LI8 extends nG6 {
        constructor(A, q) {
            super({});
            this.childCredentials = A, this.interceptors = q
        }
        _isSecure() {
            return this.childCredentials._isSecure()
        }
        _equals(A) {
            if (!(A instanceof LI8)) return !1;
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

    function jXY(A, q) {
        return new LI8(A, q)
    }
})
// @from(Ln 315244, Col 4)
Rd6 = x((tg4) => {
    Object.defineProperty(tg4, "__esModule", {
        value: !0
    });
    tg4.durationMessageToDuration = DXY;
    tg4.msToDuration = XXY;
    tg4.durationToMs = PXY;
    tg4.isDuration = WXY;
    tg4.isDurationMessage = ZXY;
    tg4.parseDuration = fXY;
    tg4.durationToString = TXY;

    function DXY(A) {
        return {
            seconds: Number.parseInt(A.seconds),
            nanos: A.nanos
        }
    }

    function XXY(A) {
        return {
            seconds: A / 1000 | 0,
            nanos: A % 1000 * 1e6 | 0
        }
    }

    function PXY(A) {
        return A.seconds * 1000 + A.nanos / 1e6 | 0
    }

    function WXY(A) {
        return typeof A.seconds === "number" && typeof A.nanos === "number"
    }

    function ZXY(A) {
        return typeof A.seconds === "string" && typeof A.nanos === "number"
    }
    var GXY = /^(\d+)(?:\.(\d+))?s$/;

    function fXY(A) {
        let q = A.match(GXY);
        if (!q) return null;
        return {
            seconds: Number.parseInt(q[1], 10),
            nanos: q[2] ? Number.parseInt(q[2].padEnd(9, "0"), 10) : 0
        }
    }

    function TXY(A) {
        if (A.nanos === 0) return `${A.seconds}s`;
        let q;
        if (A.nanos % 1e6 === 0) q = 1e6;
        else if (A.nanos % 1000 === 0) q = 1000;
        else q = 1;
        return `${A.seconds}.${A.nanos/q}s`
    }
})
// @from(Ln 315301, Col 4)
UT1 = x((HF4) => {
    var __dirname = "/home/runner/code/tmp/claude-cli-external-build-2217/node_modules/@grpc/grpc-js/build/src";
    Object.defineProperty(HF4, "__esModule", {
        value: !0
    });
    HF4.OrcaOobMetricsSubchannelWrapper = HF4.GRPC_METRICS_HEADER = HF4.ServerMetricRecorder = HF4.PerRequestMetricRecorder = void 0;
    HF4.createOrcaClient = zF4;
    HF4.createMetricsReader = xXY;
    var RXY = af1(),
        RI8 = Rd6(),
        hXY = LG6(),
        SXY = yd6(),
        eg4 = a3(),
        CXY = RG6(),
        IXY = Vf(),
        AF4 = null;

    function QT1() {
        if (AF4) return AF4;
        let A = lC8().loadSync,
            q = A("xds/service/orca/v3/orca.proto", {
                keepCase: !0,
                longs: String,
                enums: String,
                defaults: !0,
                oneofs: !0,
                includeDirs: [`${__dirname}/../../proto/xds`, `${__dirname}/../../proto/protoc-gen-validate`]
            });
        return (0, RXY.loadPackageDefinition)(q)
    }
    class KF4 {
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
            return QT1().xds.data.orca.v3.OrcaLoadReport.serialize(this.message)
        }
    }
    HF4.PerRequestMetricRecorder = KF4;
    var bXY = 30000;
    class YF4 {
        constructor() {
            this.message = {}, this.serviceImplementation = {
                StreamCoreMetrics: (A) => {
                    let q = A.request.report_interval ? (0, RI8.durationToMs)((0, RI8.durationMessageToDuration)(A.request.report_interval)) : bXY,
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
            let q = QT1().xds.service.orca.v3.OpenRcaService.service;
            A.addService(q, this.serviceImplementation)
        }
    }
    HF4.ServerMetricRecorder = YF4;

    function zF4(A) {
        return new(QT1()).xds.service.orca.v3.OpenRcaService("unused", hXY.ChannelCredentials.createInsecure(), {
            channelOverride: A
        })
    }
    HF4.GRPC_METRICS_HEADER = "endpoint-load-metrics-bin";
    var qF4 = "grpc_orca_load_report";

    function xXY(A, q) {
        return (K, Y, z) => {
            let _ = z.getOpaque(qF4);
            if (_) A(_);
            else {
                let w = z.get(HF4.GRPC_METRICS_HEADER);
                if (w.length > 0) _ = QT1().xds.data.orca.v3.OrcaLoadReport.deserialize(w[0]), A(_), z.setOpaque(qF4, _)
            }
            if (q) q(K, Y, z)
        }
    }
    var _F4 = "orca_oob_metrics";
    class wF4 {
        constructor(A, q) {
            this.metricsListener = A, this.intervalMs = q, this.dataProducer = null
        }
        setSubchannel(A) {
            let q = A.getOrCreateDataProducer(_F4, uXY);
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
    class OF4 {
        constructor(A) {
            this.subchannel = A, this.dataWatchers = new Set, this.orcaSupported = !0, this.metricsCall = null, this.currentInterval = 1 / 0, this.backoffTimer = new CXY.BackoffTimeout(() => this.updateMetricsSubscription()), this.subchannelStateListener = () => this.updateMetricsSubscription();
            let q = A.getChannel();
            this.client = zF4(q), A.addConnectivityStateListener(this.subchannelStateListener)
        }
        addDataWatcher(A) {
            this.dataWatchers.add(A), this.updateMetricsSubscription()
        }
        removeDataWatcher(A) {
            var q;
            if (this.dataWatchers.delete(A), this.dataWatchers.size === 0) this.subchannel.removeDataProducer(_F4), (q = this.metricsCall) === null || q === void 0 || q.cancel(), this.metricsCall = null, this.client.close(), this.subchannel.removeConnectivityStateListener(this.subchannelStateListener);
            else this.updateMetricsSubscription()
        }
        updateMetricsSubscription() {
            var A;
            if (this.dataWatchers.size === 0 || !this.orcaSupported || this.subchannel.getConnectivityState() !== IXY.ConnectivityState.READY) return;
            let q = Math.min(...Array.from(this.dataWatchers).map((K) => K.getInterval()));
            if (!this.metricsCall || q !== this.currentInterval) {
                (A = this.metricsCall) === null || A === void 0 || A.cancel(), this.currentInterval = q;
                let K = this.client.streamCoreMetrics({
                    report_interval: (0, RI8.msToDuration)(q)
                });
                this.metricsCall = K, K.on("data", (Y) => {
                    this.dataWatchers.forEach((z) => {
                        z.onMetricsUpdate(Y)
                    })
                }), K.on("error", (Y) => {
                    if (this.metricsCall = null, Y.code === eg4.Status.UNIMPLEMENTED) {
                        this.orcaSupported = !1;
                        return
                    }
                    if (Y.code === eg4.Status.CANCELLED) return;
                    this.backoffTimer.runOnce()
                })
            }
        }
    }
    class $F4 extends SXY.BaseSubchannelWrapper {
        constructor(A, q, K) {
            super(A);
            this.addDataWatcher(new wF4(q, K))
        }
        getWrappedSubchannel() {
            return this.child
        }
    }
    HF4.OrcaOobMetricsSubchannelWrapper = $F4;

    function uXY(A) {
        return new OF4(A)
    }
})
// @from(Ln 315516, Col 4)
II8 = x((EF4) => {
    Object.defineProperty(EF4, "__esModule", {
        value: !0
    });
    EF4.BaseServerInterceptingCall = EF4.ServerInterceptingCall = EF4.ResponderBuilder = EF4.ServerListenerBuilder = void 0;
    EF4.isInterceptingServerListener = UXY;
    EF4.getServerInterceptingCall = nXY;
    var lT1 = LX(),
        wN = a3(),
        rG6 = x6("http2"),
        MF4 = xf1(),
        DF4 = x6("zlib"),
        pXY = jI8(),
        GF4 = zw(),
        QXY = x6("tls"),
        XF4 = UT1(),
        fF4 = "server_call";

    function NY6(A) {
        GF4.trace(wN.LogVerbosity.DEBUG, fF4, A)
    }
    class TF4 {
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
    EF4.ServerListenerBuilder = TF4;

    function UXY(A) {
        return A.onReceiveMetadata !== void 0 && A.onReceiveMetadata.length === 1
    }
    class vF4 {
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
    class NF4 {
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
    EF4.ResponderBuilder = NF4;
    var dT1 = {
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
        cT1 = {
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
    class VF4 {
        constructor(A, q) {
            var K, Y, z, _;
            this.nextCall = A, this.processingMetadata = !1, this.sentMetadata = !1, this.processingMessage = !1, this.pendingMessage = null, this.pendingMessageCallback = null, this.pendingStatus = null, this.responder = {
                start: (K = q === null || q === void 0 ? void 0 : q.start) !== null && K !== void 0 ? K : cT1.start,
                sendMetadata: (Y = q === null || q === void 0 ? void 0 : q.sendMetadata) !== null && Y !== void 0 ? Y : cT1.sendMetadata,
                sendMessage: (z = q === null || q === void 0 ? void 0 : q.sendMessage) !== null && z !== void 0 ? z : cT1.sendMessage,
                sendStatus: (_ = q === null || q === void 0 ? void 0 : q.sendStatus) !== null && _ !== void 0 ? _ : cT1.sendStatus
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
                var K, Y, z, _;
                let w = {
                        onReceiveMetadata: (K = q === null || q === void 0 ? void 0 : q.onReceiveMetadata) !== null && K !== void 0 ? K : dT1.onReceiveMetadata,
                        onReceiveMessage: (Y = q === null || q === void 0 ? void 0 : q.onReceiveMessage) !== null && Y !== void 0 ? Y : dT1.onReceiveMessage,
                        onReceiveHalfClose: (z = q === null || q === void 0 ? void 0 : q.onReceiveHalfClose) !== null && z !== void 0 ? z : dT1.onReceiveHalfClose,
                        onCancel: (_ = q === null || q === void 0 ? void 0 : q.onCancel) !== null && _ !== void 0 ? _ : dT1.onCancel
                    },
                    O = new vF4(w, A);
                this.nextCall.start(O)
            })
        }
        sendMetadata(A) {
            this.processingMetadata = !0, this.sentMetadata = !0, this.responder.sendMetadata(A, (q) => {
                this.processingMetadata = !1, this.nextCall.sendMetadata(q), this.processPendingMessage(), this.processPendingStatus()
            })
        }
        sendMessage(A, q) {
            if (this.processingMessage = !0, !this.sentMetadata) this.sendMetadata(new lT1.Metadata);
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
    EF4.ServerInterceptingCall = VF4;
    var kF4 = "grpc-accept-encoding",
        SI8 = "grpc-encoding",
        PF4 = "grpc-message",
        WF4 = "grpc-status",
        hI8 = "grpc-timeout",
        dXY = /(\d{1,8})\s*([HMSmun])/,
        cXY = {
            H: 3600000,
            M: 60000,
            S: 1000,
            m: 1,
            u: 0.001,
            n: 0.000001
        },
        lXY = {
            [kF4]: "identity,deflate,gzip",
            [SI8]: "identity"
        },
        ZF4 = {
            [rG6.constants.HTTP2_HEADER_STATUS]: rG6.constants.HTTP_STATUS_OK,
            [rG6.constants.HTTP2_HEADER_CONTENT_TYPE]: "application/grpc+proto"
        },
        iXY = {
            waitForTrailers: !0
        };
    class CI8 {
        constructor(A, q, K, Y, z) {
            var _, w;
            if (this.stream = A, this.callEventTracker = K, this.handler = Y, this.listener = null, this.deadlineTimer = null, this.deadline = 1 / 0, this.maxSendMessageSize = wN.DEFAULT_MAX_SEND_MESSAGE_LENGTH, this.maxReceiveMessageSize = wN.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH, this.cancelled = !1, this.metadataSent = !1, this.wantTrailers = !1, this.cancelNotified = !1, this.incomingEncoding = "identity", this.readQueue = [], this.isReadPending = !1, this.receivedHalfClose = !1, this.streamEnded = !1, this.metricsRecorder = new XF4.PerRequestMetricRecorder, this.stream.once("error", (J) => {}), this.stream.once("close", () => {
                    var J;
                    if (NY6("Request to method " + ((J = this.handler) === null || J === void 0 ? void 0 : J.path) + " stream closed with rstCode " + this.stream.rstCode), this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!1), this.callEventTracker.onCallEnd({
                        code: wN.Status.CANCELLED,
                        details: "Stream closed before sending status",
                        metadata: null
                    });
                    this.notifyOnCancel()
                }), this.stream.on("data", (J) => {
                    this.handleDataFrame(J)
                }), this.stream.pause(), this.stream.on("end", () => {
                    this.handleEndEvent()
                }), "grpc.max_send_message_length" in z) this.maxSendMessageSize = z["grpc.max_send_message_length"];
            if ("grpc.max_receive_message_length" in z) this.maxReceiveMessageSize = z["grpc.max_receive_message_length"];
            this.host = (_ = q[":authority"]) !== null && _ !== void 0 ? _ : q.host, this.decoder = new pXY.StreamDecoder(this.maxReceiveMessageSize);
            let O = lT1.Metadata.fromHttp2Headers(q);
            if (GF4.isTracerEnabled(fF4)) NY6("Request to " + this.handler.path + " received headers " + JSON.stringify(O.toJSON()));
            let $ = O.get(hI8);
            if ($.length > 0) this.handleTimeoutHeader($[0]);
            let H = O.get(SI8);
            if (H.length > 0) this.incomingEncoding = H[0];
            O.remove(hI8), O.remove(SI8), O.remove(kF4), O.remove(rG6.constants.HTTP2_HEADER_ACCEPT_ENCODING), O.remove(rG6.constants.HTTP2_HEADER_TE), O.remove(rG6.constants.HTTP2_HEADER_CONTENT_TYPE), this.metadata = O;
            let j = (w = A.session) === null || w === void 0 ? void 0 : w.socket;
            this.connectionInfo = {
                localAddress: j === null || j === void 0 ? void 0 : j.localAddress,
                localPort: j === null || j === void 0 ? void 0 : j.localPort,
                remoteAddress: j === null || j === void 0 ? void 0 : j.remoteAddress,
                remotePort: j === null || j === void 0 ? void 0 : j.remotePort
            }, this.shouldSendMetrics = !!z["grpc.server_call_metric_recording"]
        }
        handleTimeoutHeader(A) {
            let q = A.toString().match(dXY);
            if (q === null) {
                let z = {
                    code: wN.Status.INTERNAL,
                    details: `Invalid ${hI8} value "${A}"`,
                    metadata: null
                };
                process.nextTick(() => {
                    this.sendStatus(z)
                });
                return
            }
            let K = +q[1] * cXY[q[2]] | 0,
                Y = new Date;
            this.deadline = Y.setMilliseconds(Y.getMilliseconds() + K), this.deadlineTimer = setTimeout(() => {
                let z = {
                    code: wN.Status.DEADLINE_EXCEEDED,
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
            if (!this.metadataSent) this.sendMetadata(new lT1.Metadata)
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
                if (q === "deflate") Y = DF4.createInflate();
                else Y = DF4.createGunzip();
                return new Promise((z, _) => {
                    let w = 0,
                        O = [];
                    Y.on("data", ($) => {
                        if (O.push($), w += $.byteLength, this.maxReceiveMessageSize !== -1 && w > this.maxReceiveMessageSize) Y.destroy(), _({
                            code: wN.Status.RESOURCE_EXHAUSTED,
                            details: `Received message that decompresses to a size larger than ${this.maxReceiveMessageSize}`
                        })
                    }), Y.on("end", () => {
                        z(Buffer.concat(O))
                    }), Y.write(K), Y.end()
                })
            } else return Promise.reject({
                code: wN.Status.UNIMPLEMENTED,
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
                    code: wN.Status.INTERNAL,
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
            NY6("Request to " + this.handler.path + " received data frame of size " + A.length);
            let K;
            try {
                K = this.decoder.write(A)
            } catch (Y) {
                this.sendStatus({
                    code: wN.Status.RESOURCE_EXHAUSTED,
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
            if (NY6("Request to " + this.handler.path + " start called"), this.checkCancelled()) return;
            this.listener = A, A.onReceiveMetadata(this.metadata)
        }
        sendMetadata(A) {
            if (this.checkCancelled()) return;
            if (this.metadataSent) return;
            this.metadataSent = !0;
            let q = A ? A.toHttp2Headers() : null,
                K = Object.assign(Object.assign(Object.assign({}, ZF4), lXY), q);
            this.stream.respond(K, iXY)
        }
        sendMessage(A, q) {
            if (this.checkCancelled()) return;
            let K;
            try {
                K = this.serializeMessage(A)
            } catch (Y) {
                this.sendStatus({
                    code: wN.Status.INTERNAL,
                    details: `Error serializing response: ${(0,MF4.getErrorMessage)(Y)}`,
                    metadata: null
                });
                return
            }
            if (this.maxSendMessageSize !== -1 && K.length - 5 > this.maxSendMessageSize) {
                this.sendStatus({
                    code: wN.Status.RESOURCE_EXHAUSTED,
                    details: `Sent message larger than max (${K.length} vs. ${this.maxSendMessageSize})`,
                    metadata: null
                });
                return
            }
            this.maybeSendMetadata(), NY6("Request to " + this.handler.path + " sent data frame of size " + K.length), this.stream.write(K, (Y) => {
                var z;
                if (Y) {
                    this.sendStatus({
                        code: wN.Status.INTERNAL,
                        details: `Error writing message: ${(0,MF4.getErrorMessage)(Y)}`,
                        metadata: null
                    });
                    return
                }(z = this.callEventTracker) === null || z === void 0 || z.addMessageSent(), q()
            })
        }
        sendStatus(A) {
            var q, K, Y;
            if (this.checkCancelled()) return;
            NY6("Request to method " + ((q = this.handler) === null || q === void 0 ? void 0 : q.path) + " ended with status code: " + wN.Status[A.code] + " details: " + A.details);
            let z = (Y = (K = A.metadata) === null || K === void 0 ? void 0 : K.clone()) !== null && Y !== void 0 ? Y : new lT1.Metadata;
            if (this.shouldSendMetrics) z.set(XF4.GRPC_METRICS_HEADER, this.metricsRecorder.serialize());
            if (this.metadataSent)
                if (!this.wantTrailers) this.wantTrailers = !0, this.stream.once("wantTrailers", () => {
                    if (this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!0), this.callEventTracker.onCallEnd(A);
                    let _ = Object.assign({
                        [WF4]: A.code,
                        [PF4]: encodeURI(A.details)
                    }, z.toHttp2Headers());
                    this.stream.sendTrailers(_), this.notifyOnCancel()
                }), this.stream.end();
                else this.notifyOnCancel();
            else {
                if (this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!0), this.callEventTracker.onCallEnd(A);
                let _ = Object.assign(Object.assign({
                    [WF4]: A.code,
                    [PF4]: encodeURI(A.details)
                }, ZF4), z.toHttp2Headers());
                this.stream.respond(_, {
                    endStream: !0
                }), this.notifyOnCancel()
            }
        }
        startRead() {
            if (NY6("Request to " + this.handler.path + " startRead called"), this.checkCancelled()) return;
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
            if (((A = this.stream.session) === null || A === void 0 ? void 0 : A.socket) instanceof QXY.TLSSocket) {
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
    EF4.BaseServerInterceptingCall = CI8;

    function nXY(A, q, K, Y, z, _) {
        let w = {
                path: z.path,
                requestStream: z.type === "clientStream" || z.type === "bidi",
                responseStream: z.type === "serverStream" || z.type === "bidi",
                requestDeserialize: z.deserialize,
                responseSerialize: z.serialize
            },
            O = new CI8(q, K, Y, z, _);
        return A.reduce(($, H) => {
            return H(w, $)
        }, O)
    }
})
// @from(Ln 316038, Col 4)
bF4 = x((A66) => {
    var eXY = A66 && A66.__runInitializers || function(A, q, K) {
            var Y = arguments.length > 2;
            for (var z = 0; z < q.length; z++) K = Y ? q[z].call(A, K) : q[z].call(A);
            return Y ? K : void 0
        },
        APY = A66 && A66.__esDecorate || function(A, q, K, Y, z, _) {
            function w(Z) {
                if (Z !== void 0 && typeof Z !== "function") throw TypeError("Function expected");
                return Z
            }
            var O = Y.kind,
                $ = O === "getter" ? "get" : O === "setter" ? "set" : "value",
                H = !q && A ? Y.static ? A : A.prototype : null,
                j = q || (H ? Object.getOwnPropertyDescriptor(H, Y.name) : {}),
                J, M = !1;
            for (var D = K.length - 1; D >= 0; D--) {
                var X = {};
                for (var P in Y) X[P] = P === "access" ? {} : Y[P];
                for (var P in Y.access) X.access[P] = Y.access[P];
                X.addInitializer = function(Z) {
                    if (M) throw TypeError("Cannot add initializers after decoration has completed");
                    _.push(w(Z || null))
                };
                var W = (0, K[D])(O === "accessor" ? {
                    get: j.get,
                    set: j.set
                } : j[$], X);
                if (O === "accessor") {
                    if (W === void 0) continue;
                    if (W === null || typeof W !== "object") throw TypeError("Object expected");
                    if (J = w(W.get)) j.get = J;
                    if (J = w(W.set)) j.set = J;
                    if (J = w(W.init)) z.unshift(J)
                } else if (J = w(W))
                    if (O === "field") z.unshift(J);
                    else j[$] = J
            }
            if (H) Object.defineProperty(H, Y.name, j);
            M = !0
        };
    Object.defineProperty(A66, "__esModule", {
        value: !0
    });
    A66.Server = void 0;
    var ON = x6("http2"),
        qPY = x6("util"),
        ej = a3(),
        sG6 = og4(),
        bI8 = pT1(),
        LF4 = Ob(),
        aG6 = zw(),
        ee = _N(),
        Db = Nf(),
        KD = ae(),
        RF4 = II8(),
        oG6 = 2147483647,
        xI8 = 2147483647,
        KPY = 20000,
        hF4 = 2147483647,
        {
            HTTP2_HEADER_PATH: SF4
        } = ON.constants,
        YPY = "server",
        CF4 = Buffer.from("max_age");

    function IF4(A) {
        aG6.trace(ej.LogVerbosity.DEBUG, "server_call", A)
    }

    function zPY() {}

    function _PY(A) {
        return function(q, K) {
            return qPY.deprecate(q, A)
        }
    }

    function uI8(A) {
        return {
            code: ej.Status.UNIMPLEMENTED,
            details: `The server does not implement the method ${A}`
        }
    }

    function wPY(A, q) {
        let K = uI8(q);
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
    var OPY = (() => {
        var A;
        let q = [],
            K;
        return A = class {
            constructor(z) {
                var _, w, O, $, H, j;
                if (this.boundPorts = (eXY(this, q), new Map), this.http2Servers = new Map, this.sessionIdleTimeouts = new Map, this.handlers = new Map, this.sessions = new Map, this.started = !1, this.shutdown = !1, this.serverAddressString = "null", this.channelzEnabled = !0, this.options = z !== null && z !== void 0 ? z : {}, this.options["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.channelzTrace = new KD.ChannelzTraceStub, this.callTracker = new KD.ChannelzCallTrackerStub, this.listenerChildrenTracker = new KD.ChannelzChildrenTrackerStub, this.sessionChildrenTracker = new KD.ChannelzChildrenTrackerStub;
                else this.channelzTrace = new KD.ChannelzTrace, this.callTracker = new KD.ChannelzCallTracker, this.listenerChildrenTracker = new KD.ChannelzChildrenTracker, this.sessionChildrenTracker = new KD.ChannelzChildrenTracker;
                if (this.channelzRef = (0, KD.registerChannelzServer)("server", () => this.getChannelzInfo(), this.channelzEnabled), this.channelzTrace.addTrace("CT_INFO", "Server created"), this.maxConnectionAgeMs = (_ = this.options["grpc.max_connection_age_ms"]) !== null && _ !== void 0 ? _ : oG6, this.maxConnectionAgeGraceMs = (w = this.options["grpc.max_connection_age_grace_ms"]) !== null && w !== void 0 ? w : oG6, this.keepaliveTimeMs = (O = this.options["grpc.keepalive_time_ms"]) !== null && O !== void 0 ? O : xI8, this.keepaliveTimeoutMs = ($ = this.options["grpc.keepalive_timeout_ms"]) !== null && $ !== void 0 ? $ : KPY, this.sessionIdleTimeout = (H = this.options["grpc.max_connection_idle_ms"]) !== null && H !== void 0 ? H : hF4, this.commonServerOptions = {
                        maxSendHeaderBlockLength: Number.MAX_SAFE_INTEGER
                    }, "grpc-node.max_session_memory" in this.options) this.commonServerOptions.maxSessionMemory = this.options["grpc-node.max_session_memory"];
                else this.commonServerOptions.maxSessionMemory = Number.MAX_SAFE_INTEGER;
                if ("grpc.max_concurrent_streams" in this.options) this.commonServerOptions.settings = {
                    maxConcurrentStreams: this.options["grpc.max_concurrent_streams"]
                };
                this.interceptors = (j = this.options.interceptors) !== null && j !== void 0 ? j : [], this.trace("Server constructed")
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
                var _, w, O;
                let $ = this.sessions.get(z),
                    H = z.socket,
                    j = H.remoteAddress ? (0, ee.stringToSubchannelAddress)(H.remoteAddress, H.remotePort) : null,
                    J = H.localAddress ? (0, ee.stringToSubchannelAddress)(H.localAddress, H.localPort) : null,
                    M;
                if (z.encrypted) {
                    let X = H,
                        P = X.getCipher(),
                        W = X.getCertificate(),
                        Z = X.getPeerCertificate();
                    M = {
                        cipherSuiteStandardName: (_ = P.standardName) !== null && _ !== void 0 ? _ : null,
                        cipherSuiteOtherName: P.standardName ? null : P.name,
                        localCertificate: W && "raw" in W ? W.raw : null,
                        remoteCertificate: Z && "raw" in Z ? Z.raw : null
                    }
                } else M = null;
                return {
                    remoteAddress: j,
                    localAddress: J,
                    security: M,
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
                    localFlowControlWindow: (w = z.state.localWindowSize) !== null && w !== void 0 ? w : null,
                    remoteFlowControlWindow: (O = z.state.remoteWindowSize) !== null && O !== void 0 ? O : null
                }
            }
            trace(z) {
                aG6.trace(ej.LogVerbosity.DEBUG, YPY, "(" + this.channelzRef.id + ") " + z)
            }
            keepaliveTrace(z) {
                aG6.trace(ej.LogVerbosity.DEBUG, "keepalive", "(" + this.channelzRef.id + ") " + z)
            }
            addProtoService() {
                throw Error("Not implemented. Use addService() instead")
            }
            addService(z, _) {
                if (z === null || typeof z !== "object" || _ === null || typeof _ !== "object") throw Error("addService() requires two objects as arguments");
                let w = Object.keys(z);
                if (w.length === 0) throw Error("Cannot add an empty service to a server");
                w.forEach((O) => {
                    let $ = z[O],
                        H;
                    if ($.requestStream)
                        if ($.responseStream) H = "bidi";
                        else H = "clientStream";
                    else if ($.responseStream) H = "serverStream";
                    else H = "unary";
                    let j = _[O],
                        J;
                    if (j === void 0 && typeof $.originalName === "string") j = _[$.originalName];
                    if (j !== void 0) J = j.bind(_);
                    else J = wPY(H, O);
                    if (this.register($.path, J, $.responseSerialize, $.requestDeserialize, H) === !1) throw Error(`Method handler for ${$.path} already provided.`)
                })
            }
            removeService(z) {
                if (z === null || typeof z !== "object") throw Error("removeService() requires object as argument");
                Object.keys(z).forEach((w) => {
                    let O = z[w];
                    this.unregister(O.path)
                })
            }
            bind(z, _) {
                throw Error("Not implemented. Use bindAsync() instead")
            }
            experimentalRegisterListenerToChannelz(z) {
                return (0, KD.registerChannelzSocket)((0, ee.subchannelAddressToString)(z), () => {
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
                (0, KD.unregisterChannelzRef)(z)
            }
            createHttp2Server(z) {
                let _;
                if (z._isSecure()) {
                    let w = z._getConstructorOptions(),
                        O = z._getSecureContextOptions(),
                        $ = Object.assign(Object.assign(Object.assign(Object.assign({}, this.commonServerOptions), w), O), {
                            enableTrace: this.options["grpc-node.tls_enable_trace"] === 1
                        }),
                        H = O !== null;
                    this.trace("Initial credentials valid: " + H), _ = ON.createSecureServer($), _.prependListener("connection", (J) => {
                        if (!H) this.trace("Dropped connection from " + JSON.stringify(J.address()) + " due to unloaded credentials"), J.destroy()
                    }), _.on("secureConnection", (J) => {
                        J.on("error", (M) => {
                            this.trace("An incoming TLS connection closed with error: " + M.message)
                        })
                    });
                    let j = (J) => {
                        if (J) {
                            let M = _;
                            try {
                                M.setSecureContext(J)
                            } catch (D) {
                                aG6.log(ej.LogVerbosity.ERROR, "Failed to set secure context with error " + D.message), J = null
                            }
                        }
                        H = J !== null, this.trace("Post-update credentials valid: " + H)
                    };
                    z._addWatcher(j), _.on("close", () => {
                        z._removeWatcher(j)
                    })
                } else _ = ON.createServer(this.commonServerOptions);
                return _.setTimeout(0, zPY), this._setupHandlers(_, z._getInterceptors()), _
            }
            bindOneAddress(z, _) {
                this.trace("Attempting to bind " + (0, ee.subchannelAddressToString)(z));
                let w = this.createHttp2Server(_.credentials);
                return new Promise((O, $) => {
                    let H = (j) => {
                        this.trace("Failed to bind " + (0, ee.subchannelAddressToString)(z) + " with error " + j.message), O({
                            port: "port" in z ? z.port : 1,
                            error: j.message
                        })
                    };
                    w.once("error", H), w.listen(z, () => {
                        let j = w.address(),
                            J;
                        if (typeof j === "string") J = {
                            path: j
                        };
                        else J = {
                            host: j.address,
                            port: j.port
                        };
                        let M = this.experimentalRegisterListenerToChannelz(J);
                        this.listenerChildrenTracker.refChild(M), this.http2Servers.set(w, {
                            channelzRef: M,
                            sessions: new Set,
                            ownsChannelzRef: !0
                        }), _.listeningServers.add(w), this.trace("Successfully bound " + (0, ee.subchannelAddressToString)(J)), O({
                            port: "port" in J ? J.port : 1
                        }), w.removeListener("error", H)
                    })
                })
            }
            async bindManyPorts(z, _) {
                if (z.length === 0) return {
                    count: 0,
                    port: 0,
                    errors: []
                };
                if ((0, ee.isTcpSubchannelAddress)(z[0]) && z[0].port === 0) {
                    let w = await this.bindOneAddress(z[0], _);
                    if (w.error) {
                        let O = await this.bindManyPorts(z.slice(1), _);
                        return Object.assign(Object.assign({}, O), {
                            errors: [w.error, ...O.errors]
                        })
                    } else {
                        let O = z.slice(1).map((j) => (0, ee.isTcpSubchannelAddress)(j) ? {
                                host: j.host,
                                port: w.port
                            } : j),
                            $ = await Promise.all(O.map((j) => this.bindOneAddress(j, _))),
                            H = [w, ...$];
                        return {
                            count: H.filter((j) => j.error === void 0).length,
                            port: w.port,
                            errors: H.filter((j) => j.error).map((j) => j.error)
                        }
                    }
                } else {
                    let w = await Promise.all(z.map((O) => this.bindOneAddress(O, _)));
                    return {
                        count: w.filter((O) => O.error === void 0).length,
                        port: w[0].port,
                        errors: w.filter((O) => O.error).map((O) => O.error)
                    }
                }
            }
            async bindAddressList(z, _) {
                let w = await this.bindManyPorts(z, _);
                if (w.count > 0) {
                    if (w.count < z.length) aG6.log(ej.LogVerbosity.INFO, `WARNING Only ${w.count} addresses added out of total ${z.length} resolved`);
                    return w.port
                } else {
                    let O = `No address added out of total ${z.length} resolved`;
                    throw aG6.log(ej.LogVerbosity.ERROR, O), Error(`${O} errors: [${w.errors.join(",")}]`)
                }
            }
            resolvePort(z) {
                return new Promise((_, w) => {
                    let O = !1,
                        $ = (j, J, M, D) => {
                            if (O) return !0;
                            if (O = !0, !j.ok) return w(Error(j.error.details)), !0;
                            let X = [].concat(...j.value.map((P) => P.addresses));
                            if (X.length === 0) return w(Error(`No addresses resolved for port ${z}`)), !0;
                            return _(X), !0
                        };
                    (0, LF4.createResolver)(z, $, this.options).updateResolution()
                })
            }
            async bindPort(z, _) {
                let w = await this.resolvePort(z);
                if (_.cancelled) throw this.completeUnbind(_), Error("bindAsync operation cancelled by unbind call");
                let O = await this.bindAddressList(w, _);
                if (_.cancelled) throw this.completeUnbind(_), Error("bindAsync operation cancelled by unbind call");
                return O
            }
            normalizePort(z) {
                let _ = (0, Db.parseUri)(z);
                if (_ === null) throw Error(`Could not parse port "${z}"`);
                let w = (0, LF4.mapUriDefaultScheme)(_);
                if (w === null) throw Error(`Could not get a default scheme for port "${z}"`);
                return w
            }
            bindAsync(z, _, w) {
                if (this.shutdown) throw Error("bindAsync called after shutdown");
                if (typeof z !== "string") throw TypeError("port must be a string");
                if (_ === null || !(_ instanceof bI8.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
                if (typeof w !== "function") throw TypeError("callback must be a function");
                this.trace("bindAsync port=" + z);
                let O = this.normalizePort(z),
                    $ = (M, D) => {
                        process.nextTick(() => w(M, D))
                    },
                    H = this.boundPorts.get((0, Db.uriToString)(O));
                if (H) {
                    if (!_._equals(H.credentials)) {
                        $(Error(`${z} already bound with incompatible credentials`), 0);
                        return
                    }
                    if (H.cancelled = !1, H.completionPromise) H.completionPromise.then((M) => w(null, M), (M) => w(M, 0));
                    else $(null, H.portNumber);
                    return
                }
                H = {
                    mapKey: (0, Db.uriToString)(O),
                    originalUri: O,
                    completionPromise: null,
                    cancelled: !1,
                    portNumber: 0,
                    credentials: _,
                    listeningServers: new Set
                };
                let j = (0, Db.splitHostPort)(O.path),
                    J = this.bindPort(O, H);
                if (H.completionPromise = J, (j === null || j === void 0 ? void 0 : j.port) === 0) J.then((M) => {
                    let D = {
                        scheme: O.scheme,
                        authority: O.authority,
                        path: (0, Db.combineHostPort)({
                            host: j.host,
                            port: M
                        })
                    };
                    H.mapKey = (0, Db.uriToString)(D), H.completionPromise = null, H.portNumber = M, this.boundPorts.set(H.mapKey, H), w(null, M)
                }, (M) => {
                    w(M, 0)
                });
                else this.boundPorts.set(H.mapKey, H), J.then((M) => {
                    H.completionPromise = null, H.portNumber = M, w(null, M)
                }, (M) => {
                    w(M, 0)
                })
            }
            registerInjectorToChannelz() {
                return (0, KD.registerChannelzSocket)("injector", () => {
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
            experimentalCreateConnectionInjectorWithChannelzRef(z, _, w = !1) {
                if (z === null || !(z instanceof bI8.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
                if (this.channelzEnabled) this.listenerChildrenTracker.refChild(_);
                let O = this.createHttp2Server(z),
                    $ = new Set;
                return this.http2Servers.set(O, {
                    channelzRef: _,
                    sessions: $,
                    ownsChannelzRef: w
                }), {
                    injectConnection: (H) => {
                        O.emit("connection", H)
                    },
                    drain: (H) => {
                        var j, J;
                        for (let M of $) this.closeSession(M);
                        (J = (j = setTimeout(() => {
                            for (let M of $) M.destroy(ON.constants.NGHTTP2_CANCEL)
                        }, H)).unref) === null || J === void 0 || J.call(j)
                    },
                    destroy: () => {
                        this.closeServer(O);
                        for (let H of $) this.closeSession(H)
                    }
                }
            }
            createConnectionInjector(z) {
                if (z === null || !(z instanceof bI8.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
                let _ = this.registerInjectorToChannelz();
                return this.experimentalCreateConnectionInjectorWithChannelzRef(z, _, !0)
            }
            closeServer(z, _) {
                this.trace("Closing server with address " + JSON.stringify(z.address()));
                let w = this.http2Servers.get(z);
                z.close(() => {
                    if (w && w.ownsChannelzRef) this.listenerChildrenTracker.unrefChild(w.channelzRef), (0, KD.unregisterChannelzRef)(w.channelzRef);
                    this.http2Servers.delete(z), _ === null || _ === void 0 || _()
                })
            }
            closeSession(z, _) {
                var w;
                this.trace("Closing session initiated by " + ((w = z.socket) === null || w === void 0 ? void 0 : w.remoteAddress));
                let O = this.sessions.get(z),
                    $ = () => {
                        if (O) this.sessionChildrenTracker.unrefChild(O.ref), (0, KD.unregisterChannelzRef)(O.ref);
                        _ === null || _ === void 0 || _()
                    };
                if (z.closed) queueMicrotask($);
                else z.close($)
            }
            completeUnbind(z) {
                for (let _ of z.listeningServers) {
                    let w = this.http2Servers.get(_);
                    if (this.closeServer(_, () => {
                            z.listeningServers.delete(_)
                        }), w)
                        for (let O of w.sessions) this.closeSession(O)
                }
                this.boundPorts.delete(z.mapKey)
            }
            unbind(z) {
                this.trace("unbind port=" + z);
                let _ = this.normalizePort(z),
                    w = (0, Db.splitHostPort)(_.path);
                if ((w === null || w === void 0 ? void 0 : w.port) === 0) throw Error("Cannot unbind port 0");
                let O = this.boundPorts.get((0, Db.uriToString)(_));
                if (O)
                    if (this.trace("unbinding " + O.mapKey + " originally bound as " + (0, Db.uriToString)(O.originalUri)), O.completionPromise) O.cancelled = !0;
                    else this.completeUnbind(O)
            }
            drain(z, _) {
                var w, O;
                this.trace("drain port=" + z + " graceTimeMs=" + _);
                let $ = this.normalizePort(z),
                    H = (0, Db.splitHostPort)($.path);
                if ((H === null || H === void 0 ? void 0 : H.port) === 0) throw Error("Cannot drain port 0");
                let j = this.boundPorts.get((0, Db.uriToString)($));
                if (!j) return;
                let J = new Set;
                for (let M of j.listeningServers) {
                    let D = this.http2Servers.get(M);
                    if (D)
                        for (let X of D.sessions) J.add(X), this.closeSession(X, () => {
                            J.delete(X)
                        })
                }(O = (w = setTimeout(() => {
                    for (let M of J) M.destroy(ON.constants.NGHTTP2_CANCEL)
                }, _)).unref) === null || O === void 0 || O.call(w)
            }
            forceShutdown() {
                for (let z of this.boundPorts.values()) z.cancelled = !0;
                this.boundPorts.clear();
                for (let z of this.http2Servers.keys()) this.closeServer(z);
                this.sessions.forEach((z, _) => {
                    this.closeSession(_), _.destroy(ON.constants.NGHTTP2_CANCEL)
                }), this.sessions.clear(), (0, KD.unregisterChannelzRef)(this.channelzRef), this.shutdown = !0
            }
            register(z, _, w, O, $) {
                if (this.handlers.has(z)) return !1;
                return this.handlers.set(z, {
                    func: _,
                    serialize: w,
                    deserialize: O,
                    type: $,
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
                var _;
                let w = (H) => {
                        (0, KD.unregisterChannelzRef)(this.channelzRef), z(H)
                    },
                    O = 0;

                function $() {
                    if (O--, O === 0) w()
                }
                this.shutdown = !0;
                for (let [H, j] of this.http2Servers.entries()) {
                    O++;
                    let J = j.channelzRef.name;
                    this.trace("Waiting for server " + J + " to close"), this.closeServer(H, () => {
                        this.trace("Server " + J + " finished closing"), $()
                    });
                    for (let M of j.sessions.keys()) {
                        O++;
                        let D = (_ = M.socket) === null || _ === void 0 ? void 0 : _.remoteAddress;
                        this.trace("Waiting for session " + D + " to close"), this.closeSession(M, () => {
                            this.trace("Session " + D + " finished closing"), $()
                        })
                    }
                }
                if (O === 0) w()
            }
            addHttp2Port() {
                throw Error("Not yet implemented")
            }
            getChannelzRef() {
                return this.channelzRef
            }
            _verifyContentType(z, _) {
                let w = _[ON.constants.HTTP2_HEADER_CONTENT_TYPE];
                if (typeof w !== "string" || !w.startsWith("application/grpc")) return z.respond({
                    [ON.constants.HTTP2_HEADER_STATUS]: ON.constants.HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE
                }, {
                    endStream: !0
                }), !1;
                return !0
            }
            _retrieveHandler(z) {
                IF4("Received call to method " + z + " at address " + this.serverAddressString);
                let _ = this.handlers.get(z);
                if (_ === void 0) return IF4("No handler registered for method " + z + ". Sending UNIMPLEMENTED status."), null;
                return _
            }
            _respondWithError(z, _, w = null) {
                var O, $;
                let H = Object.assign({
                    "grpc-status": (O = z.code) !== null && O !== void 0 ? O : ej.Status.INTERNAL,
                    "grpc-message": z.details,
                    [ON.constants.HTTP2_HEADER_STATUS]: ON.constants.HTTP_STATUS_OK,
                    [ON.constants.HTTP2_HEADER_CONTENT_TYPE]: "application/grpc+proto"
                }, ($ = z.metadata) === null || $ === void 0 ? void 0 : $.toHttp2Headers());
                _.respond(H, {
                    endStream: !0
                }), this.callTracker.addCallFailed(), w === null || w === void 0 || w.streamTracker.addCallFailed()
            }
            _channelzHandler(z, _, w) {
                this.onStreamOpened(_);
                let O = this.sessions.get(_.session);
                if (this.callTracker.addCallStarted(), O === null || O === void 0 || O.streamTracker.addCallStarted(), !this._verifyContentType(_, w)) {
                    this.callTracker.addCallFailed(), O === null || O === void 0 || O.streamTracker.addCallFailed();
                    return
                }
                let $ = w[SF4],
                    H = this._retrieveHandler($);
                if (!H) {
                    this._respondWithError(uI8($), _, O);
                    return
                }
                let j = {
                        addMessageSent: () => {
                            if (O) O.messagesSent += 1, O.lastMessageSentTimestamp = new Date
                        },
                        addMessageReceived: () => {
                            if (O) O.messagesReceived += 1, O.lastMessageReceivedTimestamp = new Date
                        },
                        onCallEnd: (M) => {
                            if (M.code === ej.Status.OK) this.callTracker.addCallSucceeded();
                            else this.callTracker.addCallFailed()
                        },
                        onStreamEnd: (M) => {
                            if (O)
                                if (M) O.streamTracker.addCallSucceeded();
                                else O.streamTracker.addCallFailed()
                        }
                    },
                    J = (0, RF4.getServerInterceptingCall)([...z, ...this.interceptors], _, w, j, H, this.options);
                if (!this._runHandlerForCall(J, H)) this.callTracker.addCallFailed(), O === null || O === void 0 || O.streamTracker.addCallFailed(), J.sendStatus({
                    code: ej.Status.INTERNAL,
                    details: `Unknown handler type: ${H.type}`
                })
            }
            _streamHandler(z, _, w) {
                if (this.onStreamOpened(_), this._verifyContentType(_, w) !== !0) return;
                let O = w[SF4],
                    $ = this._retrieveHandler(O);
                if (!$) {
                    this._respondWithError(uI8(O), _, null);
                    return
                }
                let H = (0, RF4.getServerInterceptingCall)([...z, ...this.interceptors], _, w, null, $, this.options);
                if (!this._runHandlerForCall(H, $)) H.sendStatus({
                    code: ej.Status.INTERNAL,
                    details: `Unknown handler type: ${$.type}`
                })
            }
            _runHandlerForCall(z, _) {
                let {
                    type: w
                } = _;
                if (w === "unary") $PY(z, _);
                else if (w === "clientStream") HPY(z, _);
                else if (w === "serverStream") jPY(z, _);
                else if (w === "bidi") JPY(z, _);
                else return !1;
                return !0
            }
            _setupHandlers(z, _) {
                if (z === null) return;
                let w = z.address(),
                    O = "null";
                if (w)
                    if (typeof w === "string") O = w;
                    else O = w.address + ":" + w.port;
                this.serverAddressString = O;
                let $ = this.channelzEnabled ? this._channelzHandler : this._streamHandler,
                    H = this.channelzEnabled ? this._channelzSessionHandler(z) : this._sessionHandler(z);
                z.on("stream", $.bind(this, _)), z.on("session", H)
            }
            _sessionHandler(z) {
                return (_) => {
                    var w, O;
                    (w = this.http2Servers.get(z)) === null || w === void 0 || w.sessions.add(_);
                    let $ = null,
                        H = null,
                        j = null,
                        J = !1,
                        M = this.enableIdleTimeout(_);
                    if (this.maxConnectionAgeMs !== oG6) {
                        let Z = this.maxConnectionAgeMs / 10,
                            G = Math.random() * Z * 2 - Z;
                        $ = setTimeout(() => {
                            var f, v;
                            J = !0, this.trace("Connection dropped by max connection age: " + ((f = _.socket) === null || f === void 0 ? void 0 : f.remoteAddress));
                            try {
                                _.goaway(ON.constants.NGHTTP2_NO_ERROR, 2147483647, CF4)
                            } catch (N) {
                                _.destroy();
                                return
                            }
                            if (_.close(), this.maxConnectionAgeGraceMs !== oG6) H = setTimeout(() => {
                                _.destroy()
                            }, this.maxConnectionAgeGraceMs), (v = H.unref) === null || v === void 0 || v.call(H)
                        }, this.maxConnectionAgeMs + G), (O = $.unref) === null || O === void 0 || O.call($)
                    }
                    let D = () => {
                            if (j) clearTimeout(j), j = null
                        },
                        X = () => {
                            return !_.destroyed && this.keepaliveTimeMs < xI8 && this.keepaliveTimeMs > 0
                        },
                        P, W = () => {
                            var Z;
                            if (!X()) return;
                            this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), j = setTimeout(() => {
                                D(), P()
                            }, this.keepaliveTimeMs), (Z = j.unref) === null || Z === void 0 || Z.call(j)
                        };
                    P = () => {
                        var Z;
                        if (!X()) return;
                        this.keepaliveTrace("Sending ping with timeout " + this.keepaliveTimeoutMs + "ms");
                        let G = "";
                        try {
                            if (!_.ping((v, N, V) => {
                                    if (D(), v) this.keepaliveTrace("Ping failed with error: " + v.message), J = !0, _.close();
                                    else this.keepaliveTrace("Received ping response"), W()
                                })) G = "Ping returned false"
                        } catch (f) {
                            G = (f instanceof Error ? f.message : "") || "Unknown error"
                        }
                        if (G) {
                            this.keepaliveTrace("Ping send failed: " + G), this.trace("Connection dropped due to ping send error: " + G), J = !0, _.close();
                            return
                        }
                        j = setTimeout(() => {
                            D(), this.keepaliveTrace("Ping timeout passed without response"), this.trace("Connection dropped by keepalive timeout"), J = !0, _.close()
                        }, this.keepaliveTimeoutMs), (Z = j.unref) === null || Z === void 0 || Z.call(j)
                    }, W(), _.on("close", () => {
                        var Z, G;
                        if (!J) this.trace(`Connection dropped by client ${(Z=_.socket)===null||Z===void 0?void 0:Z.remoteAddress}`);
                        if ($) clearTimeout($);
                        if (H) clearTimeout(H);
                        if (D(), M !== null) clearTimeout(M.timeout), this.sessionIdleTimeouts.delete(_);
                        (G = this.http2Servers.get(z)) === null || G === void 0 || G.sessions.delete(_)
                    })
                }
            }
            _channelzSessionHandler(z) {
                return (_) => {
                    var w, O, $, H;
                    let j = (0, KD.registerChannelzSocket)((O = (w = _.socket) === null || w === void 0 ? void 0 : w.remoteAddress) !== null && O !== void 0 ? O : "unknown", this.getChannelzSessionInfo.bind(this, _), this.channelzEnabled),
                        J = {
                            ref: j,
                            streamTracker: new KD.ChannelzCallTracker,
                            messagesSent: 0,
                            messagesReceived: 0,
                            keepAlivesSent: 0,
                            lastMessageSentTimestamp: null,
                            lastMessageReceivedTimestamp: null
                        };
                    ($ = this.http2Servers.get(z)) === null || $ === void 0 || $.sessions.add(_), this.sessions.set(_, J);
                    let M = `${_.socket.remoteAddress}:${_.socket.remotePort}`;
                    this.channelzTrace.addTrace("CT_INFO", "Connection established by client " + M), this.trace("Connection established by client " + M), this.sessionChildrenTracker.refChild(j);
                    let D = null,
                        X = null,
                        P = null,
                        W = !1,
                        Z = this.enableIdleTimeout(_);
                    if (this.maxConnectionAgeMs !== oG6) {
                        let V = this.maxConnectionAgeMs / 10,
                            L = Math.random() * V * 2 - V;
                        D = setTimeout(() => {
                            var h;
                            W = !0, this.channelzTrace.addTrace("CT_INFO", "Connection dropped by max connection age from " + M);
                            try {
                                _.goaway(ON.constants.NGHTTP2_NO_ERROR, 2147483647, CF4)
                            } catch (R) {
                                _.destroy();
                                return
                            }
                            if (_.close(), this.maxConnectionAgeGraceMs !== oG6) X = setTimeout(() => {
                                _.destroy()
                            }, this.maxConnectionAgeGraceMs), (h = X.unref) === null || h === void 0 || h.call(X)
                        }, this.maxConnectionAgeMs + L), (H = D.unref) === null || H === void 0 || H.call(D)
                    }
                    let G = () => {
                            if (P) clearTimeout(P), P = null
                        },
                        f = () => {
                            return !_.destroyed && this.keepaliveTimeMs < xI8 && this.keepaliveTimeMs > 0
                        },
                        v, N = () => {
                            var V;
                            if (!f()) return;
                            this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), P = setTimeout(() => {
                                G(), v()
                            }, this.keepaliveTimeMs), (V = P.unref) === null || V === void 0 || V.call(P)
                        };
                    v = () => {
                        var V;
                        if (!f()) return;
                        this.keepaliveTrace("Sending ping with timeout " + this.keepaliveTimeoutMs + "ms");
                        let L = "";
                        try {
                            if (!_.ping((R, u, I) => {
                                    if (G(), R) this.keepaliveTrace("Ping failed with error: " + R.message), this.channelzTrace.addTrace("CT_INFO", "Connection dropped due to error of a ping frame " + R.message + " return in " + u), W = !0, _.close();
                                    else this.keepaliveTrace("Received ping response"), N()
                                })) L = "Ping returned false"
                        } catch (h) {
                            L = (h instanceof Error ? h.message : "") || "Unknown error"
                        }
                        if (L) {
                            this.keepaliveTrace("Ping send failed: " + L), this.channelzTrace.addTrace("CT_INFO", "Connection dropped due to ping send error: " + L), W = !0, _.close();
                            return
                        }
                        J.keepAlivesSent += 1, P = setTimeout(() => {
                            G(), this.keepaliveTrace("Ping timeout passed without response"), this.channelzTrace.addTrace("CT_INFO", "Connection dropped by keepalive timeout from " + M), W = !0, _.close()
                        }, this.keepaliveTimeoutMs), (V = P.unref) === null || V === void 0 || V.call(P)
                    }, N(), _.on("close", () => {
                        var V;
                        if (!W) this.channelzTrace.addTrace("CT_INFO", "Connection dropped by client " + M);
                        if (this.sessionChildrenTracker.unrefChild(j), (0, KD.unregisterChannelzRef)(j), D) clearTimeout(D);
                        if (X) clearTimeout(X);
                        if (G(), Z !== null) clearTimeout(Z.timeout), this.sessionIdleTimeouts.delete(_);
                        (V = this.http2Servers.get(z)) === null || V === void 0 || V.sessions.delete(_), this.sessions.delete(_)
                    })
                }
            }
            enableIdleTimeout(z) {
                var _, w;
                if (this.sessionIdleTimeout >= hF4) return null;
                let O = {
                    activeStreams: 0,
                    lastIdle: Date.now(),
                    onClose: this.onStreamClose.bind(this, z),
                    timeout: setTimeout(this.onIdleTimeout, this.sessionIdleTimeout, this, z)
                };
                (w = (_ = O.timeout).unref) === null || w === void 0 || w.call(_), this.sessionIdleTimeouts.set(z, O);
                let {
                    socket: $
                } = z;
                return this.trace("Enable idle timeout for " + $.remoteAddress + ":" + $.remotePort), O
            }
            onIdleTimeout(z, _) {
                let {
                    socket: w
                } = _, O = z.sessionIdleTimeouts.get(_);
                if (O !== void 0 && O.activeStreams === 0)
                    if (Date.now() - O.lastIdle >= z.sessionIdleTimeout) z.trace("Session idle timeout triggered for " + (w === null || w === void 0 ? void 0 : w.remoteAddress) + ":" + (w === null || w === void 0 ? void 0 : w.remotePort) + " last idle at " + O.lastIdle), z.closeSession(_);
                    else O.timeout.refresh()
            }
            onStreamOpened(z) {
                let _ = z.session,
                    w = this.sessionIdleTimeouts.get(_);
                if (w) w.activeStreams += 1, z.once("close", w.onClose)
            }
            onStreamClose(z) {
                var _, w;
                let O = this.sessionIdleTimeouts.get(z);
                if (O) {
                    if (O.activeStreams -= 1, O.activeStreams === 0) O.lastIdle = Date.now(), O.timeout.refresh(), this.trace("Session onStreamClose" + ((_ = z.socket) === null || _ === void 0 ? void 0 : _.remoteAddress) + ":" + ((w = z.socket) === null || w === void 0 ? void 0 : w.remotePort) + " at " + O.lastIdle)
                }
            }
        }, (() => {
            let Y = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            if (K = [_PY("Calling start() is no longer necessary. It can be safely omitted.")], APY(A, null, K, {
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
    A66.Server = OPY;
    async function $PY(A, q) {
        let K;

        function Y(w, O, $, H) {
            if (w) {
                A.sendStatus((0, sG6.serverErrorToStatus)(w, $));
                return
            }
            A.sendMessage(O, () => {
                A.sendStatus({
                    code: ej.Status.OK,
                    details: "OK",
                    metadata: $ !== null && $ !== void 0 ? $ : null
                })
            })
        }
        let z, _ = null;
        A.start({
            onReceiveMetadata(w) {
                z = w, A.startRead()
            },
            onReceiveMessage(w) {
                if (_) {
                    A.sendStatus({
                        code: ej.Status.UNIMPLEMENTED,
                        details: `Received a second request message for server streaming method ${q.path}`,
                        metadata: null
                    });
                    return
                }
                _ = w, A.startRead()
            },
            onReceiveHalfClose() {
                if (!_) {
                    A.sendStatus({
                        code: ej.Status.UNIMPLEMENTED,
                        details: `Received no request message for server streaming method ${q.path}`,
                        metadata: null
                    });
                    return
                }
                K = new sG6.ServerWritableStreamImpl(q.path, A, z, _);
                try {
                    q.func(K, Y)
                } catch (w) {
                    A.sendStatus({
                        code: ej.Status.UNKNOWN,
                        details: `Server method handler threw error ${w.message}`,
                        metadata: null
                    })
                }
            },
            onCancel() {
                if (K) K.cancelled = !0, K.emit("cancelled", "cancelled")
            }
        })
    }

    function HPY(A, q) {
        let K;

        function Y(z, _, w, O) {
            if (z) {
                A.sendStatus((0, sG6.serverErrorToStatus)(z, w));
                return
            }
            A.sendMessage(_, () => {
                A.sendStatus({
                    code: ej.Status.OK,
                    details: "OK",
                    metadata: w !== null && w !== void 0 ? w : null
                })
            })
        }
        A.start({
            onReceiveMetadata(z) {
                K = new sG6.ServerDuplexStreamImpl(q.path, A, z);
                try {
                    q.func(K, Y)
                } catch (_) {
                    A.sendStatus({
                        code: ej.Status.UNKNOWN,
                        details: `Server method handler threw error ${_.message}`,
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

    function jPY(A, q) {
        let K, Y, z = null;
        A.start({
            onReceiveMetadata(_) {
                Y = _, A.startRead()
            },
            onReceiveMessage(_) {
                if (z) {
                    A.sendStatus({
                        code: ej.Status.UNIMPLEMENTED,
                        details: `Received a second request message for server streaming method ${q.path}`,
                        metadata: null
                    });
                    return
                }
                z = _, A.startRead()
            },
            onReceiveHalfClose() {
                if (!z) {
                    A.sendStatus({
                        code: ej.Status.UNIMPLEMENTED,
                        details: `Received no request message for server streaming method ${q.path}`,
                        metadata: null
                    });
                    return
                }
                K = new sG6.ServerWritableStreamImpl(q.path, A, Y, z);
                try {
                    q.func(K)
                } catch (_) {
                    A.sendStatus({
                        code: ej.Status.UNKNOWN,
                        details: `Server method handler threw error ${_.message}`,
                        metadata: null
                    })
                }
            },
            onCancel() {
                if (K) K.cancelled = !0, K.emit("cancelled", "cancelled"), K.destroy()
            }
        })
    }

    function JPY(A, q) {
        let K;
        A.start({
            onReceiveMetadata(Y) {
                K = new sG6.ServerDuplexStreamImpl(q.path, A, Y);
                try {
                    q.func(K)
                } catch (z) {
                    A.sendStatus({
                        code: ej.Status.UNKNOWN,
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
// @from(Ln 317105, Col 4)
BF4 = x((uF4) => {
    Object.defineProperty(uF4, "__esModule", {
        value: !0
    });
    uF4.StatusBuilder = void 0;
    class xF4 {
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
    uF4.StatusBuilder = xF4
})