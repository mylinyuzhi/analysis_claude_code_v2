
// @from(Ln 299824, Col 4)
XF1 = R((vT4) => {
    Object.defineProperty(vT4, "__esModule", {
        value: !0
    });
    vT4.LeafLoadBalancer = vT4.PickFirstLoadBalancer = vT4.PickFirstLoadBalancingConfig = void 0;
    vT4.shuffled = VT4;
    vT4.setup = h_Y;
    var nVA = Es(),
        RJ = FZ(),
        Bs = zd(),
        WT4 = $N(),
        E_Y = mw(),
        k_Y = w9(),
        GT4 = $N(),
        ZT4 = h1("net"),
        L_Y = k31(),
        R_Y = "pick_first";

    function _F1(A) {
        E_Y.trace(k_Y.LogVerbosity.DEBUG, R_Y, A)
    }
    var JF1 = "pick_first",
        y_Y = 250;
    class XP1 {
        constructor(A) {
            this.shuffleAddressList = A
        }
        getLoadBalancerName() {
            return JF1
        }
        toJsonObject() {
            return {
                [JF1]: {
                    shuffleAddressList: this.shuffleAddressList
                }
            }
        }
        getShuffleAddressList() {
            return this.shuffleAddressList
        }
        static createFromJson(A) {
            if ("shuffleAddressList" in A && typeof A.shuffleAddressList !== "boolean") throw Error("pick_first config field shuffleAddressList must be a boolean if provided");
            return new XP1(A.shuffleAddressList === !0)
        }
    }
    vT4.PickFirstLoadBalancingConfig = XP1;
    class fT4 {
        constructor(A) {
            this.subchannel = A
        }
        pick(A) {
            return {
                pickResultType: Bs.PickResultType.COMPLETE,
                subchannel: this.subchannel,
                status: null,
                onCallStarted: null,
                onCallEnded: null
            }
        }
    }

    function VT4(A) {
        let q = A.slice();
        for (let K = q.length - 1; K > 1; K--) {
            let Y = Math.floor(Math.random() * (K + 1)),
                z = q[K];
            q[K] = q[Y], q[Y] = z
        }
        return q
    }

    function C_Y(A) {
        if (A.length === 0) return [];
        let q = [],
            K = [],
            Y = [],
            z = (0, GT4.isTcpSubchannelAddress)(A[0]) && (0, ZT4.isIPv6)(A[0].host);
        for (let $ of A)
            if ((0, GT4.isTcpSubchannelAddress)($) && (0, ZT4.isIPv6)($.host)) K.push($);
            else Y.push($);
        let w = z ? K : Y,
            H = z ? Y : K;
        for (let $ = 0; $ < Math.max(w.length, H.length); $++) {
            if ($ < w.length) q.push(w[$]);
            if ($ < H.length) q.push(H[$])
        }
        return q
    }
    var NT4 = "grpc-node.internal.pick-first.report_health_status";
    class F06 {
        constructor(A) {
            this.channelControlHelper = A, this.children = [], this.currentState = RJ.ConnectivityState.IDLE, this.currentSubchannelIndex = 0, this.currentPick = null, this.subchannelStateListener = (q, K, Y, z, w) => {
                this.onSubchannelStateUpdate(q, K, Y, w)
            }, this.pickedSubchannelHealthListener = () => this.calculateAndReportNewState(), this.stickyTransientFailureMode = !1, this.reportHealthStatus = !1, this.lastError = null, this.latestAddressList = null, this.latestOptions = {}, this.latestResolutionNote = "", this.connectionDelayTimeout = setTimeout(() => {}, 0), clearTimeout(this.connectionDelayTimeout)
        }
        allChildrenHaveReportedTF() {
            return this.children.every((A) => A.hasReportedTransientFailure)
        }
        resetChildrenReportedTF() {
            this.children.every((A) => A.hasReportedTransientFailure = !1)
        }
        calculateAndReportNewState() {
            var A;
            if (this.currentPick)
                if (this.reportHealthStatus && !this.currentPick.isHealthy()) {
                    let q = `Picked subchannel ${this.currentPick.getAddress()} is unhealthy`;
                    this.updateState(RJ.ConnectivityState.TRANSIENT_FAILURE, new Bs.UnavailablePicker({
                        details: q
                    }), q)
                } else this.updateState(RJ.ConnectivityState.READY, new fT4(this.currentPick), null);
            else if (((A = this.latestAddressList) === null || A === void 0 ? void 0 : A.length) === 0) {
                let q = `No connection established. Last error: ${this.lastError}. Resolution note: ${this.latestResolutionNote}`;
                this.updateState(RJ.ConnectivityState.TRANSIENT_FAILURE, new Bs.UnavailablePicker({
                    details: q
                }), q)
            } else if (this.children.length === 0) this.updateState(RJ.ConnectivityState.IDLE, new Bs.QueuePicker(this), null);
            else if (this.stickyTransientFailureMode) {
                let q = `No connection established. Last error: ${this.lastError}. Resolution note: ${this.latestResolutionNote}`;
                this.updateState(RJ.ConnectivityState.TRANSIENT_FAILURE, new Bs.UnavailablePicker({
                    details: q
                }), q)
            } else this.updateState(RJ.ConnectivityState.CONNECTING, new Bs.QueuePicker(this), null)
        }
        requestReresolution() {
            this.channelControlHelper.requestReresolution()
        }
        maybeEnterStickyTransientFailureMode() {
            if (!this.allChildrenHaveReportedTF()) return;
            if (this.requestReresolution(), this.resetChildrenReportedTF(), this.stickyTransientFailureMode) {
                this.calculateAndReportNewState();
                return
            }
            this.stickyTransientFailureMode = !0;
            for (let {
                    subchannel: A
                }
                of this.children) A.startConnecting();
            this.calculateAndReportNewState()
        }
        removeCurrentPick() {
            if (this.currentPick !== null) this.currentPick.removeConnectivityStateListener(this.subchannelStateListener), this.channelControlHelper.removeChannelzChild(this.currentPick.getChannelzRef()), this.currentPick.removeHealthStateWatcher(this.pickedSubchannelHealthListener), this.currentPick.unref(), this.currentPick = null
        }
        onSubchannelStateUpdate(A, q, K, Y) {
            var z;
            if ((z = this.currentPick) === null || z === void 0 ? void 0 : z.realSubchannelEquals(A)) {
                if (K !== RJ.ConnectivityState.READY) this.removeCurrentPick(), this.calculateAndReportNewState();
                return
            }
            for (let [w, H] of this.children.entries())
                if (A.realSubchannelEquals(H.subchannel)) {
                    if (K === RJ.ConnectivityState.READY) this.pickSubchannel(H.subchannel);
                    if (K === RJ.ConnectivityState.TRANSIENT_FAILURE) {
                        if (H.hasReportedTransientFailure = !0, Y) this.lastError = Y;
                        if (this.maybeEnterStickyTransientFailureMode(), w === this.currentSubchannelIndex) this.startNextSubchannelConnecting(w + 1)
                    }
                    H.subchannel.startConnecting();
                    return
                }
        }
        startNextSubchannelConnecting(A) {
            clearTimeout(this.connectionDelayTimeout);
            for (let [q, K] of this.children.entries())
                if (q >= A) {
                    let Y = K.subchannel.getConnectivityState();
                    if (Y === RJ.ConnectivityState.IDLE || Y === RJ.ConnectivityState.CONNECTING) {
                        this.startConnecting(q);
                        return
                    }
                } this.maybeEnterStickyTransientFailureMode()
        }
        startConnecting(A) {
            var q, K;
            if (clearTimeout(this.connectionDelayTimeout), this.currentSubchannelIndex = A, this.children[A].subchannel.getConnectivityState() === RJ.ConnectivityState.IDLE) _F1("Start connecting to subchannel with address " + this.children[A].subchannel.getAddress()), process.nextTick(() => {
                var Y;
                (Y = this.children[A]) === null || Y === void 0 || Y.subchannel.startConnecting()
            });
            this.connectionDelayTimeout = setTimeout(() => {
                this.startNextSubchannelConnecting(A + 1)
            }, y_Y), (K = (q = this.connectionDelayTimeout).unref) === null || K === void 0 || K.call(q)
        }
        pickSubchannel(A) {
            _F1("Pick subchannel with address " + A.getAddress()), this.stickyTransientFailureMode = !1, A.ref(), this.channelControlHelper.addChannelzChild(A.getChannelzRef()), this.removeCurrentPick(), this.resetSubchannelList(), A.addConnectivityStateListener(this.subchannelStateListener), A.addHealthStateWatcher(this.pickedSubchannelHealthListener), this.currentPick = A, clearTimeout(this.connectionDelayTimeout), this.calculateAndReportNewState()
        }
        updateState(A, q, K) {
            _F1(RJ.ConnectivityState[this.currentState] + " -> " + RJ.ConnectivityState[A]), this.currentState = A, this.channelControlHelper.updateState(A, q, K)
        }
        resetSubchannelList() {
            for (let A of this.children) A.subchannel.removeConnectivityStateListener(this.subchannelStateListener), A.subchannel.unref(), this.channelControlHelper.removeChannelzChild(A.subchannel.getChannelzRef());
            this.currentSubchannelIndex = 0, this.children = []
        }
        connectToAddressList(A, q) {
            _F1("connectToAddressList([" + A.map((Y) => (0, WT4.subchannelAddressToString)(Y)) + "])");
            let K = A.map((Y) => ({
                subchannel: this.channelControlHelper.createSubchannel(Y, q),
                hasReportedTransientFailure: !1
            }));
            for (let {
                    subchannel: Y
                }
                of K)
                if (Y.getConnectivityState() === RJ.ConnectivityState.READY) {
                    this.pickSubchannel(Y);
                    return
                } for (let {
                    subchannel: Y
                }
                of K) Y.ref(), this.channelControlHelper.addChannelzChild(Y.getChannelzRef());
            this.resetSubchannelList(), this.children = K;
            for (let {
                    subchannel: Y
                }
                of this.children) Y.addConnectivityStateListener(this.subchannelStateListener);
            for (let Y of this.children)
                if (Y.subchannel.getConnectivityState() === RJ.ConnectivityState.TRANSIENT_FAILURE) Y.hasReportedTransientFailure = !0;
            this.startNextSubchannelConnecting(0), this.calculateAndReportNewState()
        }
        updateAddressList(A, q, K, Y) {
            if (!(q instanceof XP1)) return !1;
            if (!A.ok) {
                if (this.children.length === 0 && this.currentPick === null) this.channelControlHelper.updateState(RJ.ConnectivityState.TRANSIENT_FAILURE, new Bs.UnavailablePicker(A.error), A.error.details);
                return !0
            }
            let z = A.value;
            if (this.reportHealthStatus = K[NT4], q.getShuffleAddressList()) z = VT4(z);
            let w = [].concat(...z.map(($) => $.addresses));
            _F1("updateAddressList([" + w.map(($) => (0, WT4.subchannelAddressToString)($)) + "])");
            let H = C_Y(w);
            if (this.latestAddressList = H, this.latestOptions = K, this.connectToAddressList(H, K), this.latestResolutionNote = Y, w.length > 0) return !0;
            else return this.lastError = "No addresses resolved", !1
        }
        exitIdle() {
            if (this.currentState === RJ.ConnectivityState.IDLE && this.latestAddressList) this.connectToAddressList(this.latestAddressList, this.latestOptions)
        }
        resetBackoff() {}
        destroy() {
            this.resetSubchannelList(), this.removeCurrentPick()
        }
        getTypeName() {
            return JF1
        }
    }
    vT4.PickFirstLoadBalancer = F06;
    var S_Y = new XP1(!1);
    class TT4 {
        constructor(A, q, K, Y) {
            this.endpoint = A, this.options = K, this.resolutionNote = Y, this.latestState = RJ.ConnectivityState.IDLE;
            let z = (0, nVA.createChildChannelControlHelper)(q, {
                updateState: (w, H, $) => {
                    this.latestState = w, this.latestPicker = H, q.updateState(w, H, $)
                }
            });
            this.pickFirstBalancer = new F06(z), this.latestPicker = new Bs.QueuePicker(this.pickFirstBalancer)
        }
        startConnecting() {
            this.pickFirstBalancer.updateAddressList((0, L_Y.statusOrFromValue)([this.endpoint]), S_Y, Object.assign(Object.assign({}, this.options), {
                [NT4]: !0
            }), this.resolutionNote)
        }
        updateEndpoint(A, q) {
            if (this.options = q, this.endpoint = A, this.latestState !== RJ.ConnectivityState.IDLE) this.startConnecting()
        }
        getConnectivityState() {
            return this.latestState
        }
        getPicker() {
            return this.latestPicker
        }
        getEndpoint() {
            return this.endpoint
        }
        exitIdle() {
            this.pickFirstBalancer.exitIdle()
        }
        destroy() {
            this.pickFirstBalancer.destroy()
        }
    }
    vT4.LeafLoadBalancer = TT4;

    function h_Y() {
        (0, nVA.registerLoadBalancerType)(JF1, F06, XP1), (0, nVA.registerDefaultLoadBalancerType)(JF1)
    }
})
// @from(Ln 300107, Col 4)
yT4 = R((LT4) => {
    Object.defineProperty(LT4, "__esModule", {
        value: !0
    });
    LT4.FileWatcherCertificateProvider = void 0;
    var B_Y = h1("fs"),
        m_Y = mw(),
        F_Y = w9(),
        Q_Y = h1("util"),
        g_Y = "certificate_provider";

    function Q06(A) {
        m_Y.trace(F_Y.LogVerbosity.DEBUG, g_Y, A)
    }
    var rVA = (0, Q_Y.promisify)(B_Y.readFile);
    class kT4 {
        constructor(A) {
            if (this.config = A, this.refreshTimer = null, this.fileResultPromise = null, this.latestCaUpdate = void 0, this.caListeners = new Set, this.latestIdentityUpdate = void 0, this.identityListeners = new Set, this.lastUpdateTime = null, A.certificateFile === void 0 !== (A.privateKeyFile === void 0)) throw Error("certificateFile and privateKeyFile must be set or unset together");
            if (A.certificateFile === void 0 && A.caCertificateFile === void 0) throw Error("At least one of certificateFile and caCertificateFile must be set");
            Q06("File watcher constructed with config " + JSON.stringify(A))
        }
        updateCertificates() {
            if (this.fileResultPromise) return;
            this.fileResultPromise = Promise.allSettled([this.config.certificateFile ? rVA(this.config.certificateFile) : Promise.reject(), this.config.privateKeyFile ? rVA(this.config.privateKeyFile) : Promise.reject(), this.config.caCertificateFile ? rVA(this.config.caCertificateFile) : Promise.reject()]), this.fileResultPromise.then(([A, q, K]) => {
                if (!this.refreshTimer) return;
                if (Q06("File watcher read certificates certificate " + A.status + ", privateKey " + q.status + ", CA certificate " + K.status), this.lastUpdateTime = new Date, this.fileResultPromise = null, A.status === "fulfilled" && q.status === "fulfilled") this.latestIdentityUpdate = {
                    certificate: A.value,
                    privateKey: q.value
                };
                else this.latestIdentityUpdate = null;
                if (K.status === "fulfilled") this.latestCaUpdate = {
                    caCertificate: K.value
                };
                else this.latestCaUpdate = null;
                for (let Y of this.identityListeners) Y(this.latestIdentityUpdate);
                for (let Y of this.caListeners) Y(this.latestCaUpdate)
            }), Q06("File watcher initiated certificate update")
        }
        maybeStartWatchingFiles() {
            if (!this.refreshTimer) {
                let A = this.lastUpdateTime ? new Date().getTime() - this.lastUpdateTime.getTime() : 1 / 0;
                if (A > this.config.refreshIntervalMs) this.updateCertificates();
                if (A > this.config.refreshIntervalMs * 2) this.latestCaUpdate = void 0, this.latestIdentityUpdate = void 0;
                this.refreshTimer = setInterval(() => this.updateCertificates(), this.config.refreshIntervalMs), Q06("File watcher started watching")
            }
        }
        maybeStopWatchingFiles() {
            if (this.caListeners.size === 0 && this.identityListeners.size === 0) {
                if (this.fileResultPromise = null, this.refreshTimer) clearInterval(this.refreshTimer), this.refreshTimer = null
            }
        }
        addCaCertificateListener(A) {
            if (this.caListeners.add(A), this.maybeStartWatchingFiles(), this.latestCaUpdate !== void 0) process.nextTick(A, this.latestCaUpdate)
        }
        removeCaCertificateListener(A) {
            this.caListeners.delete(A), this.maybeStopWatchingFiles()
        }
        addIdentityCertificateListener(A) {
            if (this.identityListeners.add(A), this.maybeStartWatchingFiles(), this.latestIdentityUpdate !== void 0) process.nextTick(A, this.latestIdentityUpdate)
        }
        removeIdentityCertificateListener(A) {
            this.identityListeners.delete(A), this.maybeStopWatchingFiles()
        }
    }
    LT4.FileWatcherCertificateProvider = kT4
})
// @from(Ln 300173, Col 4)
sVA = R((g9) => {
    Object.defineProperty(g9, "__esModule", {
        value: !0
    });
    g9.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = g9.createCertificateProviderChannelCredentials = g9.FileWatcherCertificateProvider = g9.createCertificateProviderServerCredentials = g9.createServerCredentialsWithInterceptors = g9.BaseSubchannelWrapper = g9.registerAdminService = g9.FilterStackFactory = g9.BaseFilter = g9.statusOrFromError = g9.statusOrFromValue = g9.PickResultType = g9.QueuePicker = g9.UnavailablePicker = g9.ChildLoadBalancerHandler = g9.EndpointMap = g9.endpointHasAddress = g9.endpointToString = g9.subchannelAddressToString = g9.LeafLoadBalancer = g9.isLoadBalancerNameRegistered = g9.parseLoadBalancingConfig = g9.selectLbConfigFromList = g9.registerLoadBalancerType = g9.createChildChannelControlHelper = g9.BackoffTimeout = g9.parseDuration = g9.durationToMs = g9.splitHostPort = g9.uriToString = g9.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = g9.createResolver = g9.registerResolver = g9.log = g9.trace = void 0;
    var CT4 = mw();
    Object.defineProperty(g9, "trace", {
        enumerable: !0,
        get: function() {
            return CT4.trace
        }
    });
    Object.defineProperty(g9, "log", {
        enumerable: !0,
        get: function() {
            return CT4.log
        }
    });
    var oVA = lh();
    Object.defineProperty(g9, "registerResolver", {
        enumerable: !0,
        get: function() {
            return oVA.registerResolver
        }
    });
    Object.defineProperty(g9, "createResolver", {
        enumerable: !0,
        get: function() {
            return oVA.createResolver
        }
    });
    Object.defineProperty(g9, "CHANNEL_ARGS_CONFIG_SELECTOR_KEY", {
        enumerable: !0,
        get: function() {
            return oVA.CHANNEL_ARGS_CONFIG_SELECTOR_KEY
        }
    });
    var ST4 = mZ();
    Object.defineProperty(g9, "uriToString", {
        enumerable: !0,
        get: function() {
            return ST4.uriToString
        }
    });
    Object.defineProperty(g9, "splitHostPort", {
        enumerable: !0,
        get: function() {
            return ST4.splitHostPort
        }
    });
    var hT4 = OF1();
    Object.defineProperty(g9, "durationToMs", {
        enumerable: !0,
        get: function() {
            return hT4.durationToMs
        }
    });
    Object.defineProperty(g9, "parseDuration", {
        enumerable: !0,
        get: function() {
            return hT4.parseDuration
        }
    });
    var U_Y = UM1();
    Object.defineProperty(g9, "BackoffTimeout", {
        enumerable: !0,
        get: function() {
            return U_Y.BackoffTimeout
        }
    });
    var DF1 = Es();
    Object.defineProperty(g9, "createChildChannelControlHelper", {
        enumerable: !0,
        get: function() {
            return DF1.createChildChannelControlHelper
        }
    });
    Object.defineProperty(g9, "registerLoadBalancerType", {
        enumerable: !0,
        get: function() {
            return DF1.registerLoadBalancerType
        }
    });
    Object.defineProperty(g9, "selectLbConfigFromList", {
        enumerable: !0,
        get: function() {
            return DF1.selectLbConfigFromList
        }
    });
    Object.defineProperty(g9, "parseLoadBalancingConfig", {
        enumerable: !0,
        get: function() {
            return DF1.parseLoadBalancingConfig
        }
    });
    Object.defineProperty(g9, "isLoadBalancerNameRegistered", {
        enumerable: !0,
        get: function() {
            return DF1.isLoadBalancerNameRegistered
        }
    });
    var p_Y = XF1();
    Object.defineProperty(g9, "LeafLoadBalancer", {
        enumerable: !0,
        get: function() {
            return p_Y.LeafLoadBalancer
        }
    });
    var g06 = $N();
    Object.defineProperty(g9, "subchannelAddressToString", {
        enumerable: !0,
        get: function() {
            return g06.subchannelAddressToString
        }
    });
    Object.defineProperty(g9, "endpointToString", {
        enumerable: !0,
        get: function() {
            return g06.endpointToString
        }
    });
    Object.defineProperty(g9, "endpointHasAddress", {
        enumerable: !0,
        get: function() {
            return g06.endpointHasAddress
        }
    });
    Object.defineProperty(g9, "EndpointMap", {
        enumerable: !0,
        get: function() {
            return g06.EndpointMap
        }
    });
    var d_Y = FD6();
    Object.defineProperty(g9, "ChildLoadBalancerHandler", {
        enumerable: !0,
        get: function() {
            return d_Y.ChildLoadBalancerHandler
        }
    });
    var aVA = zd();
    Object.defineProperty(g9, "UnavailablePicker", {
        enumerable: !0,
        get: function() {
            return aVA.UnavailablePicker
        }
    });
    Object.defineProperty(g9, "QueuePicker", {
        enumerable: !0,
        get: function() {
            return aVA.QueuePicker
        }
    });
    Object.defineProperty(g9, "PickResultType", {
        enumerable: !0,
        get: function() {
            return aVA.PickResultType
        }
    });
    var IT4 = k31();
    Object.defineProperty(g9, "statusOrFromValue", {
        enumerable: !0,
        get: function() {
            return IT4.statusOrFromValue
        }
    });
    Object.defineProperty(g9, "statusOrFromError", {
        enumerable: !0,
        get: function() {
            return IT4.statusOrFromError
        }
    });
    var c_Y = _VA();
    Object.defineProperty(g9, "BaseFilter", {
        enumerable: !0,
        get: function() {
            return c_Y.BaseFilter
        }
    });
    var l_Y = f06();
    Object.defineProperty(g9, "FilterStackFactory", {
        enumerable: !0,
        get: function() {
            return l_Y.FilterStackFactory
        }
    });
    var i_Y = gD6();
    Object.defineProperty(g9, "registerAdminService", {
        enumerable: !0,
        get: function() {
            return i_Y.registerAdminService
        }
    });
    var n_Y = HF1();
    Object.defineProperty(g9, "BaseSubchannelWrapper", {
        enumerable: !0,
        get: function() {
            return n_Y.BaseSubchannelWrapper
        }
    });
    var xT4 = I06();
    Object.defineProperty(g9, "createServerCredentialsWithInterceptors", {
        enumerable: !0,
        get: function() {
            return xT4.createServerCredentialsWithInterceptors
        }
    });
    Object.defineProperty(g9, "createCertificateProviderServerCredentials", {
        enumerable: !0,
        get: function() {
            return xT4.createCertificateProviderServerCredentials
        }
    });
    var r_Y = yT4();
    Object.defineProperty(g9, "FileWatcherCertificateProvider", {
        enumerable: !0,
        get: function() {
            return r_Y.FileWatcherCertificateProvider
        }
    });
    var o_Y = gM1();
    Object.defineProperty(g9, "createCertificateProviderChannelCredentials", {
        enumerable: !0,
        get: function() {
            return o_Y.createCertificateProviderChannelCredentials
        }
    });
    var a_Y = SVA();
    Object.defineProperty(g9, "SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX", {
        enumerable: !0,
        get: function() {
            return a_Y.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX
        }
    })
})
// @from(Ln 300408, Col 4)
BT4 = R((uT4) => {
    Object.defineProperty(uT4, "__esModule", {
        value: !0
    });
    uT4.setup = AJY;
    var t_Y = lh(),
        e_Y = k31();
    class bT4 {
        constructor(A, q, K) {
            this.listener = q, this.hasReturnedResult = !1, this.endpoints = [];
            let Y;
            if (A.authority === "") Y = "/" + A.path;
            else Y = A.path;
            this.endpoints = [{
                addresses: [{
                    path: Y
                }]
            }]
        }
        updateResolution() {
            if (!this.hasReturnedResult) this.hasReturnedResult = !0, process.nextTick(this.listener, (0, e_Y.statusOrFromValue)(this.endpoints), {}, null, "")
        }
        destroy() {
            this.hasReturnedResult = !1
        }
        static getDefaultAuthority(A) {
            return "localhost"
        }
    }

    function AJY() {
        (0, t_Y.registerResolver)("unix", bT4)
    }
})
// @from(Ln 300442, Col 4)
dT4 = R((pT4) => {
    Object.defineProperty(pT4, "__esModule", {
        value: !0
    });
    pT4.setup = HJY;
    var mT4 = h1("net"),
        FT4 = k31(),
        U06 = w9(),
        tVA = Jj(),
        QT4 = lh(),
        KJY = $N(),
        gT4 = mZ(),
        YJY = mw(),
        zJY = "ip_resolver";

    function UT4(A) {
        YJY.trace(U06.LogVerbosity.DEBUG, zJY, A)
    }
    var eVA = "ipv4",
        ANA = "ipv6",
        wJY = 443;
    class qNA {
        constructor(A, q, K) {
            var Y;
            this.listener = q, this.endpoints = [], this.error = null, this.hasReturnedResult = !1, UT4("Resolver constructed for target " + (0, gT4.uriToString)(A));
            let z = [];
            if (!(A.scheme === eVA || A.scheme === ANA)) {
                this.error = {
                    code: U06.Status.UNAVAILABLE,
                    details: `Unrecognized scheme ${A.scheme} in IP resolver`,
                    metadata: new tVA.Metadata
                };
                return
            }
            let w = A.path.split(",");
            for (let H of w) {
                let $ = (0, gT4.splitHostPort)(H);
                if ($ === null) {
                    this.error = {
                        code: U06.Status.UNAVAILABLE,
                        details: `Failed to parse ${A.scheme} address ${H}`,
                        metadata: new tVA.Metadata
                    };
                    return
                }
                if (A.scheme === eVA && !(0, mT4.isIPv4)($.host) || A.scheme === ANA && !(0, mT4.isIPv6)($.host)) {
                    this.error = {
                        code: U06.Status.UNAVAILABLE,
                        details: `Failed to parse ${A.scheme} address ${H}`,
                        metadata: new tVA.Metadata
                    };
                    return
                }
                z.push({
                    host: $.host,
                    port: (Y = $.port) !== null && Y !== void 0 ? Y : wJY
                })
            }
            this.endpoints = z.map((H) => ({
                addresses: [H]
            })), UT4("Parsed " + A.scheme + " address list " + z.map(KJY.subchannelAddressToString))
        }
        updateResolution() {
            if (!this.hasReturnedResult) this.hasReturnedResult = !0, process.nextTick(() => {
                if (this.error) this.listener((0, FT4.statusOrFromError)(this.error), {}, null, "");
                else this.listener((0, FT4.statusOrFromValue)(this.endpoints), {}, null, "")
            })
        }
        destroy() {
            this.hasReturnedResult = !1
        }
        static getDefaultAuthority(A) {
            return A.path.split(",")[0]
        }
    }

    function HJY() {
        (0, QT4.registerResolver)(eVA, qNA), (0, QT4.registerResolver)(ANA, qNA)
    }
})
// @from(Ln 300522, Col 4)
aT4 = R((rT4) => {
    Object.defineProperty(rT4, "__esModule", {
        value: !0
    });
    rT4.RoundRobinLoadBalancer = void 0;
    rT4.setup = jJY;
    var iT4 = Es(),
        eM = FZ(),
        jF1 = zd(),
        OJY = mw(),
        _JY = w9(),
        cT4 = $N(),
        JJY = XF1(),
        XJY = "round_robin";

    function lT4(A) {
        OJY.trace(_JY.LogVerbosity.DEBUG, XJY, A)
    }
    var p06 = "round_robin";
    class d06 {
        getLoadBalancerName() {
            return p06
        }
        constructor() {}
        toJsonObject() {
            return {
                [p06]: {}
            }
        }
        static createFromJson(A) {
            return new d06
        }
    }
    class nT4 {
        constructor(A, q = 0) {
            this.children = A, this.nextIndex = q
        }
        pick(A) {
            let q = this.children[this.nextIndex].picker;
            return this.nextIndex = (this.nextIndex + 1) % this.children.length, q.pick(A)
        }
        peekNextEndpoint() {
            return this.children[this.nextIndex].endpoint
        }
    }

    function DJY(A, q) {
        return [...A.slice(q), ...A.slice(0, q)]
    }
    class KNA {
        constructor(A) {
            this.channelControlHelper = A, this.children = [], this.currentState = eM.ConnectivityState.IDLE, this.currentReadyPicker = null, this.updatesPaused = !1, this.lastError = null, this.childChannelControlHelper = (0, iT4.createChildChannelControlHelper)(A, {
                updateState: (q, K, Y) => {
                    if (this.currentState === eM.ConnectivityState.READY && q !== eM.ConnectivityState.READY) this.channelControlHelper.requestReresolution();
                    if (Y) this.lastError = Y;
                    this.calculateAndUpdateState()
                }
            })
        }
        countChildrenWithState(A) {
            return this.children.filter((q) => q.getConnectivityState() === A).length
        }
        calculateAndUpdateState() {
            if (this.updatesPaused) return;
            if (this.countChildrenWithState(eM.ConnectivityState.READY) > 0) {
                let A = this.children.filter((K) => K.getConnectivityState() === eM.ConnectivityState.READY),
                    q = 0;
                if (this.currentReadyPicker !== null) {
                    let K = this.currentReadyPicker.peekNextEndpoint();
                    if (q = A.findIndex((Y) => (0, cT4.endpointEqual)(Y.getEndpoint(), K)), q < 0) q = 0
                }
                this.updateState(eM.ConnectivityState.READY, new nT4(A.map((K) => ({
                    endpoint: K.getEndpoint(),
                    picker: K.getPicker()
                })), q), null)
            } else if (this.countChildrenWithState(eM.ConnectivityState.CONNECTING) > 0) this.updateState(eM.ConnectivityState.CONNECTING, new jF1.QueuePicker(this), null);
            else if (this.countChildrenWithState(eM.ConnectivityState.TRANSIENT_FAILURE) > 0) {
                let A = `round_robin: No connection established. Last error: ${this.lastError}`;
                this.updateState(eM.ConnectivityState.TRANSIENT_FAILURE, new jF1.UnavailablePicker({
                    details: A
                }), A)
            } else this.updateState(eM.ConnectivityState.IDLE, new jF1.QueuePicker(this), null);
            for (let A of this.children)
                if (A.getConnectivityState() === eM.ConnectivityState.IDLE) A.exitIdle()
        }
        updateState(A, q, K) {
            if (lT4(eM.ConnectivityState[this.currentState] + " -> " + eM.ConnectivityState[A]), A === eM.ConnectivityState.READY) this.currentReadyPicker = q;
            else this.currentReadyPicker = null;
            this.currentState = A, this.channelControlHelper.updateState(A, q, K)
        }
        resetSubchannelList() {
            for (let A of this.children) A.destroy();
            this.children = []
        }
        updateAddressList(A, q, K, Y) {
            if (!(q instanceof d06)) return !1;
            if (!A.ok) {
                if (this.children.length === 0) this.updateState(eM.ConnectivityState.TRANSIENT_FAILURE, new jF1.UnavailablePicker(A.error), A.error.details);
                return !0
            }
            let z = Math.random() * A.value.length | 0,
                w = DJY(A.value, z);
            if (this.resetSubchannelList(), w.length === 0) {
                let H = `No addresses resolved. Resolution note: ${Y}`;
                this.updateState(eM.ConnectivityState.TRANSIENT_FAILURE, new jF1.UnavailablePicker({
                    details: H
                }), H)
            }
            lT4("Connect to endpoint list " + w.map(cT4.endpointToString)), this.updatesPaused = !0, this.children = w.map((H) => new JJY.LeafLoadBalancer(H, this.childChannelControlHelper, K, Y));
            for (let H of this.children) H.startConnecting();
            return this.updatesPaused = !1, this.calculateAndUpdateState(), !0
        }
        exitIdle() {}
        resetBackoff() {}
        destroy() {
            this.resetSubchannelList()
        }
        getTypeName() {
            return p06
        }
    }
    rT4.RoundRobinLoadBalancer = KNA;

    function jJY() {
        (0, iT4.registerLoadBalancerType)(p06, KNA, d06)
    }
})
// @from(Ln 300649, Col 4)
zv4 = R((Kv4) => {
    var YNA;
    Object.defineProperty(Kv4, "__esModule", {
        value: !0
    });
    Kv4.OutlierDetectionLoadBalancer = Kv4.OutlierDetectionLoadBalancingConfig = void 0;
    Kv4.setup = kJY;
    var PJY = FZ(),
        sT4 = w9(),
        B31 = OF1(),
        tT4 = sVA(),
        WJY = Es(),
        GJY = FD6(),
        ZJY = zd(),
        zNA = $N(),
        fJY = HF1(),
        VJY = mw(),
        NJY = "outlier_detection";

    function jj(A) {
        VJY.trace(sT4.LogVerbosity.DEBUG, NJY, A)
    }
    var $NA = "outlier_detection",
        TJY = ((YNA = process.env.GRPC_EXPERIMENTAL_ENABLE_OUTLIER_DETECTION) !== null && YNA !== void 0 ? YNA : "true") === "true",
        vJY = {
            stdev_factor: 1900,
            enforcement_percentage: 100,
            minimum_hosts: 5,
            request_volume: 100
        },
        EJY = {
            threshold: 85,
            enforcement_percentage: 100,
            minimum_hosts: 5,
            request_volume: 50
        };

    function DP1(A, q, K, Y) {
        if (q in A && A[q] !== void 0 && typeof A[q] !== K) {
            let z = Y ? `${Y}.${q}` : q;
            throw Error(`outlier detection config ${z} parse error: expected ${K}, got ${typeof A[q]}`)
        }
    }

    function wNA(A, q, K) {
        let Y = K ? `${K}.${q}` : q;
        if (q in A && A[q] !== void 0) {
            if (!(0, B31.isDuration)(A[q])) throw Error(`outlier detection config ${Y} parse error: expected Duration, got ${typeof A[q]}`);
            if (!(A[q].seconds >= 0 && A[q].seconds <= 315576000000 && A[q].nanos >= 0 && A[q].nanos <= 999999999)) throw Error(`outlier detection config ${Y} parse error: values out of range for non-negative Duaration`)
        }
    }

    function c06(A, q, K) {
        let Y = K ? `${K}.${q}` : q;
        if (DP1(A, q, "number", K), q in A && A[q] !== void 0 && !(A[q] >= 0 && A[q] <= 100)) throw Error(`outlier detection config ${Y} parse error: value out of range for percentage (0-100)`)
    }
    class MF1 {
        constructor(A, q, K, Y, z, w, H) {
            if (this.childPolicy = H, H.getLoadBalancerName() === "pick_first") throw Error("outlier_detection LB policy cannot have a pick_first child policy");
            this.intervalMs = A !== null && A !== void 0 ? A : 1e4, this.baseEjectionTimeMs = q !== null && q !== void 0 ? q : 30000, this.maxEjectionTimeMs = K !== null && K !== void 0 ? K : 300000, this.maxEjectionPercent = Y !== null && Y !== void 0 ? Y : 10, this.successRateEjection = z ? Object.assign(Object.assign({}, vJY), z) : null, this.failurePercentageEjection = w ? Object.assign(Object.assign({}, EJY), w) : null
        }
        getLoadBalancerName() {
            return $NA
        }
        toJsonObject() {
            var A, q;
            return {
                outlier_detection: {
                    interval: (0, B31.msToDuration)(this.intervalMs),
                    base_ejection_time: (0, B31.msToDuration)(this.baseEjectionTimeMs),
                    max_ejection_time: (0, B31.msToDuration)(this.maxEjectionTimeMs),
                    max_ejection_percent: this.maxEjectionPercent,
                    success_rate_ejection: (A = this.successRateEjection) !== null && A !== void 0 ? A : void 0,
                    failure_percentage_ejection: (q = this.failurePercentageEjection) !== null && q !== void 0 ? q : void 0,
                    child_policy: [this.childPolicy.toJsonObject()]
                }
            }
        }
        getIntervalMs() {
            return this.intervalMs
        }
        getBaseEjectionTimeMs() {
            return this.baseEjectionTimeMs
        }
        getMaxEjectionTimeMs() {
            return this.maxEjectionTimeMs
        }
        getMaxEjectionPercent() {
            return this.maxEjectionPercent
        }
        getSuccessRateEjectionConfig() {
            return this.successRateEjection
        }
        getFailurePercentageEjectionConfig() {
            return this.failurePercentageEjection
        }
        getChildPolicy() {
            return this.childPolicy
        }
        static createFromJson(A) {
            var q;
            if (wNA(A, "interval"), wNA(A, "base_ejection_time"), wNA(A, "max_ejection_time"), c06(A, "max_ejection_percent"), "success_rate_ejection" in A && A.success_rate_ejection !== void 0) {
                if (typeof A.success_rate_ejection !== "object") throw Error("outlier detection config success_rate_ejection must be an object");
                DP1(A.success_rate_ejection, "stdev_factor", "number", "success_rate_ejection"), c06(A.success_rate_ejection, "enforcement_percentage", "success_rate_ejection"), DP1(A.success_rate_ejection, "minimum_hosts", "number", "success_rate_ejection"), DP1(A.success_rate_ejection, "request_volume", "number", "success_rate_ejection")
            }
            if ("failure_percentage_ejection" in A && A.failure_percentage_ejection !== void 0) {
                if (typeof A.failure_percentage_ejection !== "object") throw Error("outlier detection config failure_percentage_ejection must be an object");
                c06(A.failure_percentage_ejection, "threshold", "failure_percentage_ejection"), c06(A.failure_percentage_ejection, "enforcement_percentage", "failure_percentage_ejection"), DP1(A.failure_percentage_ejection, "minimum_hosts", "number", "failure_percentage_ejection"), DP1(A.failure_percentage_ejection, "request_volume", "number", "failure_percentage_ejection")
            }
            if (!("child_policy" in A) || !Array.isArray(A.child_policy)) throw Error("outlier detection config child_policy must be an array");
            let K = (0, WJY.selectLbConfigFromList)(A.child_policy);
            if (!K) throw Error("outlier detection config child_policy: no valid recognized policy found");
            return new MF1(A.interval ? (0, B31.durationToMs)(A.interval) : null, A.base_ejection_time ? (0, B31.durationToMs)(A.base_ejection_time) : null, A.max_ejection_time ? (0, B31.durationToMs)(A.max_ejection_time) : null, (q = A.max_ejection_percent) !== null && q !== void 0 ? q : null, A.success_rate_ejection, A.failure_percentage_ejection, K)
        }
    }
    Kv4.OutlierDetectionLoadBalancingConfig = MF1;
    class eT4 extends fJY.BaseSubchannelWrapper {
        constructor(A, q) {
            super(A);
            this.mapEntry = q, this.refCount = 0
        }
        ref() {
            this.child.ref(), this.refCount += 1
        }
        unref() {
            if (this.child.unref(), this.refCount -= 1, this.refCount <= 0) {
                if (this.mapEntry) {
                    let A = this.mapEntry.subchannelWrappers.indexOf(this);
                    if (A >= 0) this.mapEntry.subchannelWrappers.splice(A, 1)
                }
            }
        }
        eject() {
            this.setHealthy(!1)
        }
        uneject() {
            this.setHealthy(!0)
        }
        getMapEntry() {
            return this.mapEntry
        }
        getWrappedSubchannel() {
            return this.child
        }
    }

    function HNA() {
        return {
            success: 0,
            failure: 0
        }
    }
    class Av4 {
        constructor() {
            this.activeBucket = HNA(), this.inactiveBucket = HNA()
        }
        addSuccess() {
            this.activeBucket.success += 1
        }
        addFailure() {
            this.activeBucket.failure += 1
        }
        switchBuckets() {
            this.inactiveBucket = this.activeBucket, this.activeBucket = HNA()
        }
        getLastSuccesses() {
            return this.inactiveBucket.success
        }
        getLastFailures() {
            return this.inactiveBucket.failure
        }
    }
    class qv4 {
        constructor(A, q) {
            this.wrappedPicker = A, this.countCalls = q
        }
        pick(A) {
            let q = this.wrappedPicker.pick(A);
            if (q.pickResultType === ZJY.PickResultType.COMPLETE) {
                let K = q.subchannel,
                    Y = K.getMapEntry();
                if (Y) {
                    let z = q.onCallEnded;
                    if (this.countCalls) z = (w, H, $) => {
                        var O;
                        if (w === sT4.Status.OK) Y.counter.addSuccess();
                        else Y.counter.addFailure();
                        (O = q.onCallEnded) === null || O === void 0 || O.call(q, w, H, $)
                    };
                    return Object.assign(Object.assign({}, q), {
                        subchannel: K.getWrappedSubchannel(),
                        onCallEnded: z
                    })
                } else return Object.assign(Object.assign({}, q), {
                    subchannel: K.getWrappedSubchannel()
                })
            } else return q
        }
    }
    class ONA {
        constructor(A) {
            this.entryMap = new zNA.EndpointMap, this.latestConfig = null, this.timerStartTime = null, this.childBalancer = new GJY.ChildLoadBalancerHandler((0, tT4.createChildChannelControlHelper)(A, {
                createSubchannel: (q, K) => {
                    let Y = A.createSubchannel(q, K),
                        z = this.entryMap.getForSubchannelAddress(q),
                        w = new eT4(Y, z);
                    if ((z === null || z === void 0 ? void 0 : z.currentEjectionTimestamp) !== null) w.eject();
                    return z === null || z === void 0 || z.subchannelWrappers.push(w), w
                },
                updateState: (q, K, Y) => {
                    if (q === PJY.ConnectivityState.READY) A.updateState(q, new qv4(K, this.isCountingEnabled()), Y);
                    else A.updateState(q, K, Y)
                }
            })), this.ejectionTimer = setInterval(() => {}, 0), clearInterval(this.ejectionTimer)
        }
        isCountingEnabled() {
            return this.latestConfig !== null && (this.latestConfig.getSuccessRateEjectionConfig() !== null || this.latestConfig.getFailurePercentageEjectionConfig() !== null)
        }
        getCurrentEjectionPercent() {
            let A = 0;
            for (let q of this.entryMap.values())
                if (q.currentEjectionTimestamp !== null) A += 1;
            return A * 100 / this.entryMap.size
        }
        runSuccessRateCheck(A) {
            if (!this.latestConfig) return;
            let q = this.latestConfig.getSuccessRateEjectionConfig();
            if (!q) return;
            jj("Running success rate check");
            let K = q.request_volume,
                Y = 0,
                z = [];
            for (let [J, X] of this.entryMap.entries()) {
                let D = X.counter.getLastSuccesses(),
                    j = X.counter.getLastFailures();
                if (jj("Stats for " + (0, zNA.endpointToString)(J) + ": successes=" + D + " failures=" + j + " targetRequestVolume=" + K), D + j >= K) Y += 1, z.push(D / (D + j))
            }
            if (jj("Found " + Y + " success rate candidates; currentEjectionPercent=" + this.getCurrentEjectionPercent() + " successRates=[" + z + "]"), Y < q.minimum_hosts) return;
            let w = z.reduce((J, X) => J + X) / z.length,
                H = 0;
            for (let J of z) {
                let X = J - w;
                H += X * X
            }
            let $ = H / z.length,
                O = Math.sqrt($),
                _ = w - O * (q.stdev_factor / 1000);
            jj("stdev=" + O + " ejectionThreshold=" + _);
            for (let [J, X] of this.entryMap.entries()) {
                if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) break;
                let D = X.counter.getLastSuccesses(),
                    j = X.counter.getLastFailures();
                if (D + j < K) continue;
                let M = D / (D + j);
                if (jj("Checking candidate " + J + " successRate=" + M), M < _) {
                    let P = Math.random() * 100;
                    if (jj("Candidate " + J + " randomNumber=" + P + " enforcement_percentage=" + q.enforcement_percentage), P < q.enforcement_percentage) jj("Ejecting candidate " + J), this.eject(X, A)
                }
            }
        }
        runFailurePercentageCheck(A) {
            if (!this.latestConfig) return;
            let q = this.latestConfig.getFailurePercentageEjectionConfig();
            if (!q) return;
            jj("Running failure percentage check. threshold=" + q.threshold + " request volume threshold=" + q.request_volume);
            let K = 0;
            for (let Y of this.entryMap.values()) {
                let z = Y.counter.getLastSuccesses(),
                    w = Y.counter.getLastFailures();
                if (z + w >= q.request_volume) K += 1
            }
            if (K < q.minimum_hosts) return;
            for (let [Y, z] of this.entryMap.entries()) {
                if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) break;
                let w = z.counter.getLastSuccesses(),
                    H = z.counter.getLastFailures();
                if (jj("Candidate successes=" + w + " failures=" + H), w + H < q.request_volume) continue;
                if (H * 100 / (H + w) > q.threshold) {
                    let O = Math.random() * 100;
                    if (jj("Candidate " + Y + " randomNumber=" + O + " enforcement_percentage=" + q.enforcement_percentage), O < q.enforcement_percentage) jj("Ejecting candidate " + Y), this.eject(z, A)
                }
            }
        }
        eject(A, q) {
            A.currentEjectionTimestamp = new Date, A.ejectionTimeMultiplier += 1;
            for (let K of A.subchannelWrappers) K.eject()
        }
        uneject(A) {
            A.currentEjectionTimestamp = null;
            for (let q of A.subchannelWrappers) q.uneject()
        }
        switchAllBuckets() {
            for (let A of this.entryMap.values()) A.counter.switchBuckets()
        }
        startTimer(A) {
            var q, K;
            this.ejectionTimer = setTimeout(() => this.runChecks(), A), (K = (q = this.ejectionTimer).unref) === null || K === void 0 || K.call(q)
        }
        runChecks() {
            let A = new Date;
            if (jj("Ejection timer running"), this.switchAllBuckets(), !this.latestConfig) return;
            this.timerStartTime = A, this.startTimer(this.latestConfig.getIntervalMs()), this.runSuccessRateCheck(A), this.runFailurePercentageCheck(A);
            for (let [q, K] of this.entryMap.entries())
                if (K.currentEjectionTimestamp === null) {
                    if (K.ejectionTimeMultiplier > 0) K.ejectionTimeMultiplier -= 1
                } else {
                    let Y = this.latestConfig.getBaseEjectionTimeMs(),
                        z = this.latestConfig.getMaxEjectionTimeMs(),
                        w = new Date(K.currentEjectionTimestamp.getTime());
                    if (w.setMilliseconds(w.getMilliseconds() + Math.min(Y * K.ejectionTimeMultiplier, Math.max(Y, z))), w < new Date) jj("Unejecting " + q), this.uneject(K)
                }
        }
        updateAddressList(A, q, K, Y) {
            if (!(q instanceof MF1)) return !1;
            if (jj("Received update with config: " + JSON.stringify(q.toJsonObject(), void 0, 2)), A.ok) {
                for (let w of A.value)
                    if (!this.entryMap.has(w)) jj("Adding map entry for " + (0, zNA.endpointToString)(w)), this.entryMap.set(w, {
                        counter: new Av4,
                        currentEjectionTimestamp: null,
                        ejectionTimeMultiplier: 0,
                        subchannelWrappers: []
                    });
                this.entryMap.deleteMissing(A.value)
            }
            let z = q.getChildPolicy();
            if (this.childBalancer.updateAddressList(A, z, K, Y), q.getSuccessRateEjectionConfig() || q.getFailurePercentageEjectionConfig())
                if (this.timerStartTime) {
                    jj("Previous timer existed. Replacing timer"), clearTimeout(this.ejectionTimer);
                    let w = q.getIntervalMs() - (new Date().getTime() - this.timerStartTime.getTime());
                    this.startTimer(w)
                } else jj("Starting new timer"), this.timerStartTime = new Date, this.startTimer(q.getIntervalMs()), this.switchAllBuckets();
            else {
                jj("Counting disabled. Cancelling timer."), this.timerStartTime = null, clearTimeout(this.ejectionTimer);
                for (let w of this.entryMap.values()) this.uneject(w), w.ejectionTimeMultiplier = 0
            }
            return this.latestConfig = q, !0
        }
        exitIdle() {
            this.childBalancer.exitIdle()
        }
        resetBackoff() {
            this.childBalancer.resetBackoff()
        }
        destroy() {
            clearTimeout(this.ejectionTimer), this.childBalancer.destroy()
        }
        getTypeName() {
            return $NA
        }
    }
    Kv4.OutlierDetectionLoadBalancer = ONA;

    function kJY() {
        if (TJY)(0, tT4.registerLoadBalancerType)($NA, ONA, MF1)
    }
})
// @from(Ln 301005, Col 4)
Ov4 = R((Hv4) => {
    Object.defineProperty(Hv4, "__esModule", {
        value: !0
    });
    Hv4.PriorityQueue = void 0;
    var jP1 = 0,
        _NA = (A) => Math.floor(A / 2),
        l06 = (A) => A * 2 + 1,
        PF1 = (A) => A * 2 + 2;
    class wv4 {
        constructor(A = (q, K) => q > K) {
            this.comparator = A, this.heap = []
        }
        size() {
            return this.heap.length
        }
        isEmpty() {
            return this.size() == 0
        }
        peek() {
            return this.heap[jP1]
        }
        push(...A) {
            return A.forEach((q) => {
                this.heap.push(q), this.siftUp()
            }), this.size()
        }
        pop() {
            let A = this.peek(),
                q = this.size() - 1;
            if (q > jP1) this.swap(jP1, q);
            return this.heap.pop(), this.siftDown(), A
        }
        replace(A) {
            let q = this.peek();
            return this.heap[jP1] = A, this.siftDown(), q
        }
        greater(A, q) {
            return this.comparator(this.heap[A], this.heap[q])
        }
        swap(A, q) {
            [this.heap[A], this.heap[q]] = [this.heap[q], this.heap[A]]
        }
        siftUp() {
            let A = this.size() - 1;
            while (A > jP1 && this.greater(A, _NA(A))) this.swap(A, _NA(A)), A = _NA(A)
        }
        siftDown() {
            let A = jP1;
            while (l06(A) < this.size() && this.greater(l06(A), A) || PF1(A) < this.size() && this.greater(PF1(A), A)) {
                let q = PF1(A) < this.size() && this.greater(PF1(A), l06(A)) ? PF1(A) : l06(A);
                this.swap(A, q), A = q
            }
        }
    }
    Hv4.PriorityQueue = wv4
})
// @from(Ln 301062, Col 4)
Gv4 = R((Pv4) => {
    Object.defineProperty(Pv4, "__esModule", {
        value: !0
    });
    Pv4.WeightedRoundRobinLoadBalancingConfig = void 0;
    Pv4.setup = FJY;
    var Mj = FZ(),
        yJY = w9(),
        Uv = OF1(),
        Xv4 = Es(),
        CJY = XF1(),
        SJY = mw(),
        Dv4 = b06(),
        MP1 = zd(),
        hJY = Ov4(),
        _v4 = $N(),
        IJY = "weighted_round_robin";

    function JNA(A) {
        SJY.trace(yJY.LogVerbosity.DEBUG, IJY, A)
    }
    var XNA = "weighted_round_robin",
        xJY = 1e4,
        bJY = 1e4,
        uJY = 180000,
        BJY = 1000,
        mJY = 1;

    function Jv4(A, q, K) {
        if (q in A && A[q] !== void 0 && typeof A[q] !== K) throw Error(`weighted round robin config ${q} parse error: expected ${K}, got ${typeof A[q]}`)
    }

    function i06(A, q) {
        if (q in A && A[q] !== void 0 && A[q] !== null) {
            let K;
            if ((0, Uv.isDuration)(A[q])) K = A[q];
            else if ((0, Uv.isDurationMessage)(A[q])) K = (0, Uv.durationMessageToDuration)(A[q]);
            else if (typeof A[q] === "string") {
                let Y = (0, Uv.parseDuration)(A[q]);
                if (!Y) throw Error(`weighted round robin config ${q}: failed to parse duration string ${A[q]}`);
                K = Y
            } else throw Error(`weighted round robin config ${q}: expected duration, got ${typeof A[q]}`);
            return (0, Uv.durationToMs)(K)
        }
        return null
    }
    class WF1 {
        constructor(A, q, K, Y, z, w) {
            this.enableOobLoadReport = A !== null && A !== void 0 ? A : !1, this.oobLoadReportingPeriodMs = q !== null && q !== void 0 ? q : xJY, this.blackoutPeriodMs = K !== null && K !== void 0 ? K : bJY, this.weightExpirationPeriodMs = Y !== null && Y !== void 0 ? Y : uJY, this.weightUpdatePeriodMs = Math.max(z !== null && z !== void 0 ? z : BJY, 100), this.errorUtilizationPenalty = w !== null && w !== void 0 ? w : mJY
        }
        getLoadBalancerName() {
            return XNA
        }
        toJsonObject() {
            return {
                enable_oob_load_report: this.enableOobLoadReport,
                oob_load_reporting_period: (0, Uv.durationToString)((0, Uv.msToDuration)(this.oobLoadReportingPeriodMs)),
                blackout_period: (0, Uv.durationToString)((0, Uv.msToDuration)(this.blackoutPeriodMs)),
                weight_expiration_period: (0, Uv.durationToString)((0, Uv.msToDuration)(this.weightExpirationPeriodMs)),
                weight_update_period: (0, Uv.durationToString)((0, Uv.msToDuration)(this.weightUpdatePeriodMs)),
                error_utilization_penalty: this.errorUtilizationPenalty
            }
        }
        static createFromJson(A) {
            if (Jv4(A, "enable_oob_load_report", "boolean"), Jv4(A, "error_utilization_penalty", "number"), A.error_utilization_penalty < 0) throw Error("weighted round robin config error_utilization_penalty < 0");
            return new WF1(A.enable_oob_load_report, i06(A, "oob_load_reporting_period"), i06(A, "blackout_period"), i06(A, "weight_expiration_period"), i06(A, "weight_update_period"), A.error_utilization_penalty)
        }
        getEnableOobLoadReport() {
            return this.enableOobLoadReport
        }
        getOobLoadReportingPeriodMs() {
            return this.oobLoadReportingPeriodMs
        }
        getBlackoutPeriodMs() {
            return this.blackoutPeriodMs
        }
        getWeightExpirationPeriodMs() {
            return this.weightExpirationPeriodMs
        }
        getWeightUpdatePeriodMs() {
            return this.weightUpdatePeriodMs
        }
        getErrorUtilizationPenalty() {
            return this.errorUtilizationPenalty
        }
    }
    Pv4.WeightedRoundRobinLoadBalancingConfig = WF1;
    class jv4 {
        constructor(A, q) {
            this.metricsHandler = q, this.queue = new hJY.PriorityQueue((z, w) => z.deadline < w.deadline);
            let K = A.filter((z) => z.weight > 0),
                Y;
            if (K.length < 2) Y = 1;
            else {
                let z = 0;
                for (let {
                        weight: w
                    }
                    of K) z += w;
                Y = z / K.length
            }
            for (let z of A) {
                let w = z.weight > 0 ? 1 / z.weight : Y;
                this.queue.push({
                    endpointName: z.endpointName,
                    picker: z.picker,
                    period: w,
                    deadline: Math.random() * w
                })
            }
        }
        pick(A) {
            let q = this.queue.pop();
            this.queue.push(Object.assign(Object.assign({}, q), {
                deadline: q.deadline + q.period
            }));
            let K = q.picker.pick(A);
            if (K.pickResultType === MP1.PickResultType.COMPLETE)
                if (this.metricsHandler) return Object.assign(Object.assign({}, K), {
                    onCallEnded: (0, Dv4.createMetricsReader)((Y) => this.metricsHandler(Y, q.endpointName), K.onCallEnded)
                });
                else {
                    let Y = K.subchannel;
                    return Object.assign(Object.assign({}, K), {
                        subchannel: Y.getWrappedSubchannel()
                    })
                }
            else return K
        }
    }
    class Mv4 {
        constructor(A) {
            this.channelControlHelper = A, this.latestConfig = null, this.children = new Map, this.currentState = Mj.ConnectivityState.IDLE, this.updatesPaused = !1, this.lastError = null, this.weightUpdateTimer = null
        }
        countChildrenWithState(A) {
            let q = 0;
            for (let K of this.children.values())
                if (K.child.getConnectivityState() === A) q += 1;
            return q
        }
        updateWeight(A, q) {
            var K, Y;
            let {
                rps_fractional: z,
                application_utilization: w
            } = q;
            if (w > 0 && z > 0) w += q.eps / z * ((Y = (K = this.latestConfig) === null || K === void 0 ? void 0 : K.getErrorUtilizationPenalty()) !== null && Y !== void 0 ? Y : 0);
            let H = w === 0 ? 0 : z / w;
            if (H === 0) return;
            let $ = new Date;
            if (A.nonEmptySince === null) A.nonEmptySince = $;
            A.lastUpdated = $, A.weight = H
        }
        getWeight(A) {
            if (!this.latestConfig) return 0;
            let q = new Date().getTime();
            if (q - A.lastUpdated.getTime() >= this.latestConfig.getWeightExpirationPeriodMs()) return A.nonEmptySince = null, 0;
            let K = this.latestConfig.getBlackoutPeriodMs();
            if (K > 0 && (A.nonEmptySince === null || q - A.nonEmptySince.getTime() < K)) return 0;
            return A.weight
        }
        calculateAndUpdateState() {
            if (this.updatesPaused || !this.latestConfig) return;
            if (this.countChildrenWithState(Mj.ConnectivityState.READY) > 0) {
                let A = [];
                for (let [K, Y] of this.children) {
                    if (Y.child.getConnectivityState() !== Mj.ConnectivityState.READY) continue;
                    A.push({
                        endpointName: K,
                        picker: Y.child.getPicker(),
                        weight: this.getWeight(Y)
                    })
                }
                JNA("Created picker with weights: " + A.map((K) => K.endpointName + ":" + K.weight).join(","));
                let q;
                if (!this.latestConfig.getEnableOobLoadReport()) q = (K, Y) => {
                    let z = this.children.get(Y);
                    if (z) this.updateWeight(z, K)
                };
                else q = null;
                this.updateState(Mj.ConnectivityState.READY, new jv4(A, q), null)
            } else if (this.countChildrenWithState(Mj.ConnectivityState.CONNECTING) > 0) this.updateState(Mj.ConnectivityState.CONNECTING, new MP1.QueuePicker(this), null);
            else if (this.countChildrenWithState(Mj.ConnectivityState.TRANSIENT_FAILURE) > 0) {
                let A = `weighted_round_robin: No connection established. Last error: ${this.lastError}`;
                this.updateState(Mj.ConnectivityState.TRANSIENT_FAILURE, new MP1.UnavailablePicker({
                    details: A
                }), A)
            } else this.updateState(Mj.ConnectivityState.IDLE, new MP1.QueuePicker(this), null);
            for (let {
                    child: A
                }
                of this.children.values())
                if (A.getConnectivityState() === Mj.ConnectivityState.IDLE) A.exitIdle()
        }
        updateState(A, q, K) {
            JNA(Mj.ConnectivityState[this.currentState] + " -> " + Mj.ConnectivityState[A]), this.currentState = A, this.channelControlHelper.updateState(A, q, K)
        }
        updateAddressList(A, q, K, Y) {
            var z, w;
            if (!(q instanceof WF1)) return !1;
            if (!A.ok) {
                if (this.children.size === 0) this.updateState(Mj.ConnectivityState.TRANSIENT_FAILURE, new MP1.UnavailablePicker(A.error), A.error.details);
                return !0
            }
            if (A.value.length === 0) {
                let O = `No addresses resolved. Resolution note: ${Y}`;
                return this.updateState(Mj.ConnectivityState.TRANSIENT_FAILURE, new MP1.UnavailablePicker({
                    details: O
                }), O), !1
            }
            JNA("Connect to endpoint list " + A.value.map(_v4.endpointToString));
            let H = new Date,
                $ = new Set;
            this.updatesPaused = !0, this.latestConfig = q;
            for (let O of A.value) {
                let _ = (0, _v4.endpointToString)(O);
                $.add(_);
                let J = this.children.get(_);
                if (!J) J = {
                    child: new CJY.LeafLoadBalancer(O, (0, Xv4.createChildChannelControlHelper)(this.channelControlHelper, {
                        updateState: (X, D, j) => {
                            if (this.currentState === Mj.ConnectivityState.READY && X !== Mj.ConnectivityState.READY) this.channelControlHelper.requestReresolution();
                            if (X === Mj.ConnectivityState.READY) J.nonEmptySince = null;
                            if (j) this.lastError = j;
                            this.calculateAndUpdateState()
                        },
                        createSubchannel: (X, D) => {
                            let j = this.channelControlHelper.createSubchannel(X, D);
                            if (J === null || J === void 0 ? void 0 : J.oobMetricsListener) return new Dv4.OrcaOobMetricsSubchannelWrapper(j, J.oobMetricsListener, this.latestConfig.getOobLoadReportingPeriodMs());
                            else return j
                        }
                    }), K, Y),
                    lastUpdated: H,
                    nonEmptySince: null,
                    weight: 0,
                    oobMetricsListener: null
                }, this.children.set(_, J);
                if (q.getEnableOobLoadReport()) J.oobMetricsListener = (X) => {
                    this.updateWeight(J, X)
                };
                else J.oobMetricsListener = null
            }
            for (let [O, _] of this.children)
                if ($.has(O)) _.child.startConnecting();
                else _.child.destroy(), this.children.delete(O);
            if (this.updatesPaused = !1, this.calculateAndUpdateState(), this.weightUpdateTimer) clearInterval(this.weightUpdateTimer);
            return this.weightUpdateTimer = (w = (z = setInterval(() => {
                if (this.currentState === Mj.ConnectivityState.READY) this.calculateAndUpdateState()
            }, q.getWeightUpdatePeriodMs())).unref) === null || w === void 0 ? void 0 : w.call(z), !0
        }
        exitIdle() {}
        resetBackoff() {}
        destroy() {
            for (let A of this.children.values()) A.child.destroy();
            if (this.children.clear(), this.weightUpdateTimer) clearInterval(this.weightUpdateTimer)
        }
        getTypeName() {
            return XNA
        }
    }

    function FJY() {
        (0, Xv4.registerLoadBalancerType)(XNA, Mv4, WF1)
    }
})
// @from(Ln 301327, Col 4)
GF1 = R((I2) => {
    Object.defineProperty(I2, "__esModule", {
        value: !0
    });
    I2.experimental = I2.ServerMetricRecorder = I2.ServerInterceptingCall = I2.ResponderBuilder = I2.ServerListenerBuilder = I2.addAdminServicesToServer = I2.getChannelzHandlers = I2.getChannelzServiceDefinition = I2.InterceptorConfigurationError = I2.InterceptingCall = I2.RequesterBuilder = I2.ListenerBuilder = I2.StatusBuilder = I2.getClientChannel = I2.ServerCredentials = I2.Server = I2.setLogVerbosity = I2.setLogger = I2.load = I2.loadObject = I2.CallCredentials = I2.ChannelCredentials = I2.waitForClientReady = I2.closeClient = I2.Channel = I2.makeGenericClientConstructor = I2.makeClientConstructor = I2.loadPackageDefinition = I2.Client = I2.compressionAlgorithms = I2.propagate = I2.connectivityState = I2.status = I2.logVerbosity = I2.Metadata = I2.credentials = void 0;
    var n06 = SD6();
    Object.defineProperty(I2, "CallCredentials", {
        enumerable: !0,
        get: function() {
            return n06.CallCredentials
        }
    });
    var gJY = JfA();
    Object.defineProperty(I2, "Channel", {
        enumerable: !0,
        get: function() {
            return gJY.ChannelImplementation
        }
    });
    var UJY = OVA();
    Object.defineProperty(I2, "compressionAlgorithms", {
        enumerable: !0,
        get: function() {
            return UJY.CompressionAlgorithms
        }
    });
    var pJY = FZ();
    Object.defineProperty(I2, "connectivityState", {
        enumerable: !0,
        get: function() {
            return pJY.ConnectivityState
        }
    });
    var r06 = gM1();
    Object.defineProperty(I2, "ChannelCredentials", {
        enumerable: !0,
        get: function() {
            return r06.ChannelCredentials
        }
    });
    var Zv4 = _fA();
    Object.defineProperty(I2, "Client", {
        enumerable: !0,
        get: function() {
            return Zv4.Client
        }
    });
    var DNA = w9();
    Object.defineProperty(I2, "logVerbosity", {
        enumerable: !0,
        get: function() {
            return DNA.LogVerbosity
        }
    });
    Object.defineProperty(I2, "status", {
        enumerable: !0,
        get: function() {
            return DNA.Status
        }
    });
    Object.defineProperty(I2, "propagate", {
        enumerable: !0,
        get: function() {
            return DNA.Propagate
        }
    });
    var fv4 = mw(),
        jNA = pD6();
    Object.defineProperty(I2, "loadPackageDefinition", {
        enumerable: !0,
        get: function() {
            return jNA.loadPackageDefinition
        }
    });
    Object.defineProperty(I2, "makeClientConstructor", {
        enumerable: !0,
        get: function() {
            return jNA.makeClientConstructor
        }
    });
    Object.defineProperty(I2, "makeGenericClientConstructor", {
        enumerable: !0,
        get: function() {
            return jNA.makeClientConstructor
        }
    });
    var dJY = Jj();
    Object.defineProperty(I2, "Metadata", {
        enumerable: !0,
        get: function() {
            return dJY.Metadata
        }
    });
    var cJY = XT4();
    Object.defineProperty(I2, "Server", {
        enumerable: !0,
        get: function() {
            return cJY.Server
        }
    });
    var lJY = I06();
    Object.defineProperty(I2, "ServerCredentials", {
        enumerable: !0,
        get: function() {
            return lJY.ServerCredentials
        }
    });
    var iJY = PT4();
    Object.defineProperty(I2, "StatusBuilder", {
        enumerable: !0,
        get: function() {
            return iJY.StatusBuilder
        }
    });
    I2.credentials = {
        combineChannelCredentials: (A, ...q) => {
            return q.reduce((K, Y) => K.compose(Y), A)
        },
        combineCallCredentials: (A, ...q) => {
            return q.reduce((K, Y) => K.compose(Y), A)
        },
        createInsecure: r06.ChannelCredentials.createInsecure,
        createSsl: r06.ChannelCredentials.createSsl,
        createFromSecureContext: r06.ChannelCredentials.createFromSecureContext,
        createFromMetadataGenerator: n06.CallCredentials.createFromMetadataGenerator,
        createFromGoogleCredential: n06.CallCredentials.createFromGoogleCredential,
        createEmpty: n06.CallCredentials.createEmpty
    };
    var nJY = (A) => A.close();
    I2.closeClient = nJY;
    var rJY = (A, q, K) => A.waitForReady(q, K);
    I2.waitForClientReady = rJY;
    var oJY = (A, q) => {
        throw Error("Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead")
    };
    I2.loadObject = oJY;
    var aJY = (A, q, K) => {
        throw Error("Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead")
    };
    I2.load = aJY;
    var sJY = (A) => {
        fv4.setLogger(A)
    };
    I2.setLogger = sJY;
    var tJY = (A) => {
        fv4.setLoggerVerbosity(A)
    };
    I2.setLogVerbosity = tJY;
    var eJY = (A) => {
        return Zv4.Client.prototype.getChannel.call(A)
    };
    I2.getClientChannel = eJY;
    var o06 = $fA();
    Object.defineProperty(I2, "ListenerBuilder", {
        enumerable: !0,
        get: function() {
            return o06.ListenerBuilder
        }
    });
    Object.defineProperty(I2, "RequesterBuilder", {
        enumerable: !0,
        get: function() {
            return o06.RequesterBuilder
        }
    });
    Object.defineProperty(I2, "InterceptingCall", {
        enumerable: !0,
        get: function() {
            return o06.InterceptingCall
        }
    });
    Object.defineProperty(I2, "InterceptorConfigurationError", {
        enumerable: !0,
        get: function() {
            return o06.InterceptorConfigurationError
        }
    });
    var Vv4 = hs();
    Object.defineProperty(I2, "getChannelzServiceDefinition", {
        enumerable: !0,
        get: function() {
            return Vv4.getChannelzServiceDefinition
        }
    });
    Object.defineProperty(I2, "getChannelzHandlers", {
        enumerable: !0,
        get: function() {
            return Vv4.getChannelzHandlers
        }
    });
    var AXY = gD6();
    Object.defineProperty(I2, "addAdminServicesToServer", {
        enumerable: !0,
        get: function() {
            return AXY.addAdminServicesToServer
        }
    });
    var MNA = dVA();
    Object.defineProperty(I2, "ServerListenerBuilder", {
        enumerable: !0,
        get: function() {
            return MNA.ServerListenerBuilder
        }
    });
    Object.defineProperty(I2, "ResponderBuilder", {
        enumerable: !0,
        get: function() {
            return MNA.ResponderBuilder
        }
    });
    Object.defineProperty(I2, "ServerInterceptingCall", {
        enumerable: !0,
        get: function() {
            return MNA.ServerInterceptingCall
        }
    });
    var qXY = b06();
    Object.defineProperty(I2, "ServerMetricRecorder", {
        enumerable: !0,
        get: function() {
            return qXY.ServerMetricRecorder
        }
    });
    var KXY = sVA();
    I2.experimental = KXY;
    var YXY = fVA(),
        zXY = BT4(),
        wXY = dT4(),
        HXY = XF1(),
        $XY = aT4(),
        OXY = zv4(),
        _XY = Gv4(),
        JXY = hs();
    (() => {
        YXY.setup(), zXY.setup(), wXY.setup(), HXY.setup(), $XY.setup(), OXY.setup(), _XY.setup(), JXY.setup()
    })()
})
// @from(Ln 301564, Col 4)
Ev4 = R((Tv4) => {
    Object.defineProperty(Tv4, "__esModule", {
        value: !0
    });
    Tv4.createServiceClientConstructor = void 0;
    var fXY = GF1();

    function VXY(A, q) {
        let K = {
            export: {
                path: A,
                requestStream: !1,
                responseStream: !1,
                requestSerialize: (Y) => {
                    return Y
                },
                requestDeserialize: (Y) => {
                    return Y
                },
                responseSerialize: (Y) => {
                    return Y
                },
                responseDeserialize: (Y) => {
                    return Y
                }
            }
        };
        return fXY.makeGenericClientConstructor(K, q)
    }
    Tv4.createServiceClientConstructor = VXY
})
// @from(Ln 301595, Col 4)
ZF1 = R((Lv4) => {
    Object.defineProperty(Lv4, "__esModule", {
        value: !0
    });
    Lv4.createOtlpGrpcExporterTransport = Lv4.GrpcExporterTransport = Lv4.createEmptyMetadata = Lv4.createSslCredentials = Lv4.createInsecureCredentials = void 0;
    var NXY = dP4(),
        kv4 = `OTel-OTLP-Exporter-JavaScript/${NXY.VERSION}`;

    function TXY(A) {
        if (A) return `${A} ${kv4}`;
        return kv4
    }
    var vXY = 0,
        EXY = 2;

    function kXY(A) {
        return A === "gzip" ? EXY : vXY
    }

    function LXY() {
        let {
            credentials: A
        } = GF1();
        return A.createInsecure()
    }
    Lv4.createInsecureCredentials = LXY;

    function RXY(A, q, K) {
        let {
            credentials: Y
        } = GF1();
        return Y.createSsl(A, q, K)
    }
    Lv4.createSslCredentials = RXY;

    function yXY() {
        let {
            Metadata: A
        } = GF1();
        return new A
    }
    Lv4.createEmptyMetadata = yXY;
    class PNA {
        _parameters;
        _client;
        _metadata;
        constructor(A) {
            this._parameters = A
        }
        shutdown() {
            this._client?.close()
        }
        send(A, q) {
            let K = Buffer.from(A);
            if (this._client == null) {
                let {
                    createServiceClientConstructor: Y
                } = Ev4();
                try {
                    this._metadata = this._parameters.metadata()
                } catch (w) {
                    return Promise.resolve({
                        status: "failure",
                        error: w
                    })
                }
                let z = Y(this._parameters.grpcPath, this._parameters.grpcName);
                try {
                    this._client = new z(this._parameters.address, this._parameters.credentials(), {
                        "grpc.default_compression_algorithm": kXY(this._parameters.compression),
                        "grpc.primary_user_agent": TXY(this._parameters.userAgent)
                    })
                } catch (w) {
                    return Promise.resolve({
                        status: "failure",
                        error: w
                    })
                }
            }
            return new Promise((Y) => {
                let z = Date.now() + q;
                if (this._metadata == null) return Y({
                    error: Error("metadata was null"),
                    status: "failure"
                });
                this._client.export(K, this._metadata, {
                    deadline: z
                }, (w, H) => {
                    if (w) Y({
                        status: "failure",
                        error: w
                    });
                    else Y({
                        data: H,
                        status: "success"
                    })
                })
            })
        }
    }
    Lv4.GrpcExporterTransport = PNA;

    function CXY(A) {
        return new PNA(A)
    }
    Lv4.createOtlpGrpcExporterTransport = CXY
})
// @from(Ln 301702, Col 4)
bv4 = R((Iv4) => {
    Object.defineProperty(Iv4, "__esModule", {
        value: !0
    });
    Iv4.getOtlpGrpcDefaultConfiguration = Iv4.mergeOtlpGrpcConfigurationWithDefaults = Iv4.validateAndNormalizeUrl = void 0;
    var Sv4 = eB(),
        fF1 = ZF1(),
        bXY = h1("url"),
        yv4 = Fq();

    function hv4(A) {
        if (A = A.trim(), !A.match(/^([\w]{1,8}):\/\//)) A = `https://${A}`;
        let K = new bXY.URL(A);
        if (K.protocol === "unix:") return A;
        if (K.pathname && K.pathname !== "/") yv4.diag.warn("URL path should not be set when using grpc, the path part of the URL will be ignored.");
        if (K.protocol !== "" && !K.protocol?.match(/^(http)s?:$/)) yv4.diag.warn("URL protocol should be http(s)://. Using http://.");
        return K.host
    }
    Iv4.validateAndNormalizeUrl = hv4;

    function Cv4(A, q) {
        for (let [K, Y] of Object.entries(q.getMap()))
            if (A.get(K).length < 1) A.set(K, Y)
    }

    function uXY(A, q, K) {
        let Y = A.url ?? q.url ?? K.url;
        return {
            ...(0, Sv4.mergeOtlpSharedConfigurationWithDefaults)(A, q, K),
            metadata: () => {
                let z = K.metadata();
                return Cv4(z, A.metadata?.().clone() ?? (0, fF1.createEmptyMetadata)()), Cv4(z, q.metadata?.() ?? (0, fF1.createEmptyMetadata)()), z
            },
            url: hv4(Y),
            credentials: A.credentials ?? q.credentials?.(Y) ?? K.credentials(Y),
            userAgent: A.userAgent
        }
    }
    Iv4.mergeOtlpGrpcConfigurationWithDefaults = uXY;

    function BXY() {
        return {
            ...(0, Sv4.getSharedConfigurationDefaults)(),
            metadata: () => (0, fF1.createEmptyMetadata)(),
            url: "http://localhost:4317",
            credentials: (A) => {
                if (A.startsWith("http://")) return () => (0, fF1.createInsecureCredentials)();
                else return () => (0, fF1.createSslCredentials)()
            }
        }
    }
    Iv4.getOtlpGrpcDefaultConfiguration = BXY
})
// @from(Ln 301755, Col 4)
Uv4 = R((Qv4) => {
    Object.defineProperty(Qv4, "__esModule", {
        value: !0
    });
    Qv4.getOtlpGrpcConfigurationFromEnv = void 0;
    var uv4 = G9(),
        VF1 = ZF1(),
        QXY = Yd(),
        gXY = h1("fs"),
        UXY = h1("path"),
        mv4 = Fq();

    function WNA(A, q) {
        if (A != null && A !== "") return A;
        if (q != null && q !== "") return q;
        return
    }

    function pXY(A) {
        let q = process.env[`OTEL_EXPORTER_OTLP_${A}_HEADERS`]?.trim(),
            K = process.env.OTEL_EXPORTER_OTLP_HEADERS?.trim(),
            Y = (0, uv4.parseKeyPairsIntoRecord)(q),
            z = (0, uv4.parseKeyPairsIntoRecord)(K);
        if (Object.keys(Y).length === 0 && Object.keys(z).length === 0) return;
        let w = Object.assign({}, z, Y),
            H = (0, VF1.createEmptyMetadata)();
        for (let [$, O] of Object.entries(w)) H.set($, O);
        return H
    }

    function dXY(A) {
        let q = pXY(A);
        if (q == null) return;
        return () => q
    }

    function cXY(A) {
        let q = process.env[`OTEL_EXPORTER_OTLP_${A}_ENDPOINT`]?.trim(),
            K = process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.trim();
        return WNA(q, K)
    }

    function lXY(A) {
        let q = process.env[`OTEL_EXPORTER_OTLP_${A}_INSECURE`]?.toLowerCase().trim(),
            K = process.env.OTEL_EXPORTER_OTLP_INSECURE?.toLowerCase().trim();
        return WNA(q, K) === "true"
    }

    function GNA(A, q, K) {
        let Y = process.env[A]?.trim(),
            z = process.env[q]?.trim(),
            w = WNA(Y, z);
        if (w != null) try {
            return gXY.readFileSync(UXY.resolve(process.cwd(), w))
        } catch {
            mv4.diag.warn(K);
            return
        } else return
    }

    function iXY(A) {
        return GNA(`OTEL_EXPORTER_OTLP_${A}_CLIENT_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE", "Failed to read client certificate chain file")
    }

    function nXY(A) {
        return GNA(`OTEL_EXPORTER_OTLP_${A}_CLIENT_KEY`, "OTEL_EXPORTER_OTLP_CLIENT_KEY", "Failed to read client certificate private key file")
    }

    function Bv4(A) {
        return GNA(`OTEL_EXPORTER_OTLP_${A}_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CERTIFICATE", "Failed to read root certificate file")
    }

    function Fv4(A) {
        let q = nXY(A),
            K = iXY(A),
            Y = Bv4(A),
            z = q != null && K != null;
        if (Y != null && !z) return mv4.diag.warn("Client key and certificate must both be provided, but one was missing - attempting to create credentials from just the root certificate"), (0, VF1.createSslCredentials)(Bv4(A));
        return (0, VF1.createSslCredentials)(Y, q, K)
    }

    function rXY(A) {
        if (lXY(A)) return (0, VF1.createInsecureCredentials)();
        return Fv4(A)
    }

    function oXY(A) {
        return {
            ...(0, QXY.getSharedConfigurationFromEnvironment)(A),
            metadata: dXY(A),
            url: cXY(A),
            credentials: (q) => {
                if (q.startsWith("http://")) return () => {
                    return (0, VF1.createInsecureCredentials)()
                };
                else if (q.startsWith("https://")) return () => {
                    return Fv4(A)
                };
                return () => {
                    return rXY(A)
                }
            }
        }
    }
    Qv4.getOtlpGrpcConfigurationFromEnv = oXY
})
// @from(Ln 301861, Col 4)
lv4 = R((dv4) => {
    Object.defineProperty(dv4, "__esModule", {
        value: !0
    });
    dv4.convertLegacyOtlpGrpcOptions = void 0;
    var aXY = Fq(),
        pv4 = bv4(),
        sXY = ZF1(),
        tXY = Uv4();

    function eXY(A, q) {
        if (A.headers) aXY.diag.warn("Headers cannot be set when using grpc");
        let K = A.credentials;
        return (0, pv4.mergeOtlpGrpcConfigurationWithDefaults)({
            url: A.url,
            metadata: () => {
                return A.metadata ?? (0, sXY.createEmptyMetadata)()
            },
            compression: A.compression,
            timeoutMillis: A.timeoutMillis,
            concurrencyLimit: A.concurrencyLimit,
            credentials: K != null ? () => K : void 0,
            userAgent: A.userAgent
        }, (0, tXY.getOtlpGrpcConfigurationFromEnv)(q), (0, pv4.getOtlpGrpcDefaultConfiguration)())
    }
    dv4.convertLegacyOtlpGrpcOptions = eXY
})
// @from(Ln 301888, Col 4)
rv4 = R((iv4) => {
    Object.defineProperty(iv4, "__esModule", {
        value: !0
    });
    iv4.createOtlpGrpcExportDelegate = void 0;
    var ADY = eB(),
        qDY = ZF1();

    function KDY(A, q, K, Y) {
        return (0, ADY.createOtlpNetworkExportDelegate)(A, q, (0, qDY.createOtlpGrpcExporterTransport)({
            address: A.url,
            compression: A.compression,
            credentials: A.credentials,
            metadata: A.metadata,
            userAgent: A.userAgent,
            grpcName: K,
            grpcPath: Y
        }))
    }
    iv4.createOtlpGrpcExportDelegate = KDY
})
// @from(Ln 301909, Col 4)
s06 = R((a06) => {
    Object.defineProperty(a06, "__esModule", {
        value: !0
    });
    a06.createOtlpGrpcExportDelegate = a06.convertLegacyOtlpGrpcOptions = void 0;
    var YDY = lv4();
    Object.defineProperty(a06, "convertLegacyOtlpGrpcOptions", {
        enumerable: !0,
        get: function() {
            return YDY.convertLegacyOtlpGrpcOptions
        }
    });
    var zDY = rv4();
    Object.defineProperty(a06, "createOtlpGrpcExportDelegate", {
        enumerable: !0,
        get: function() {
            return zDY.createOtlpGrpcExportDelegate
        }
    })
})
// @from(Ln 301929, Col 4)
ev4 = R((sv4) => {
    Object.defineProperty(sv4, "__esModule", {
        value: !0
    });
    sv4.OTLPMetricExporter = void 0;
    var HDY = kD6(),
        ov4 = s06(),
        $DY = Km();
    class av4 extends HDY.OTLPMetricExporterBase {
        constructor(A) {
            super((0, ov4.createOtlpGrpcExportDelegate)((0, ov4.convertLegacyOtlpGrpcOptions)(A ?? {}, "METRICS"), $DY.ProtobufMetricsSerializer, "MetricsExportService", "/opentelemetry.proto.collector.metrics.v1.MetricsService/Export"), A)
        }
    }
    sv4.OTLPMetricExporter = av4
})
// @from(Ln 301944, Col 4)
AE4 = R((ZNA) => {
    Object.defineProperty(ZNA, "__esModule", {
        value: !0
    });
    ZNA.OTLPMetricExporter = void 0;
    var ODY = ev4();
    Object.defineProperty(ZNA, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return ODY.OTLPMetricExporter
        }
    })
})
// @from(Ln 301957, Col 4)
NNA = R((zE4) => {
    Object.defineProperty(zE4, "__esModule", {
        value: !0
    });
    zE4.PrometheusSerializer = void 0;
    var JDY = Fq(),
        m31 = Ps(),
        qE4 = G9();

    function e06(A) {
        return A.replace(/\\/g, "\\\\").replace(/\n/g, "\\n")
    }

    function KE4(A = "") {
        if (typeof A !== "string") A = JSON.stringify(A);
        return e06(A).replace(/"/g, "\\\"")
    }
    var XDY = /[^a-z0-9_]/gi,
        DDY = /_{2,}/g;

    function VNA(A) {
        return A.replace(XDY, "_").replace(DDY, "_")
    }

    function fNA(A, q) {
        if (!A.endsWith("_total") && q.dataPointType === m31.DataPointType.SUM && q.isMonotonic) A = A + "_total";
        return A
    }

    function jDY(A) {
        if (A === 1 / 0) return "+Inf";
        else if (A === -1 / 0) return "-Inf";
        else return `${A}`
    }

    function MDY(A) {
        switch (A.dataPointType) {
            case m31.DataPointType.SUM:
                if (A.isMonotonic) return "counter";
                return "gauge";
            case m31.DataPointType.GAUGE:
                return "gauge";
            case m31.DataPointType.HISTOGRAM:
                return "histogram";
            default:
                return "untyped"
        }
    }

    function t06(A, q, K, Y, z) {
        let w = !1,
            H = "";
        for (let [$, O] of Object.entries(q)) {
            let _ = VNA($);
            w = !0, H += `${H.length>0?",":""}${_}="${KE4(O)}"`
        }
        if (z)
            for (let [$, O] of Object.entries(z)) {
                let _ = VNA($);
                w = !0, H += `${H.length>0?",":""}${_}="${KE4(O)}"`
            }
        if (w) A += `{${H}}`;
        return `${A} ${jDY(K)}${Y!==void 0?" "+String(Y):""}
`
    }
    var PDY = "# no registered metrics";
    class YE4 {
        _prefix;
        _appendTimestamp;
        _additionalAttributes;
        _withResourceConstantLabels;
        _withoutTargetInfo;
        constructor(A, q = !1, K, Y) {
            if (A) this._prefix = A + "_";
            this._appendTimestamp = q, this._withResourceConstantLabels = K, this._withoutTargetInfo = !!Y
        }
        serialize(A) {
            let q = "";
            this._additionalAttributes = this._filterResourceConstantLabels(A.resource.attributes, this._withResourceConstantLabels);
            for (let K of A.scopeMetrics) q += this._serializeScopeMetrics(K);
            if (q === "") q += PDY;
            return this._serializeResource(A.resource) + q
        }
        _filterResourceConstantLabels(A, q) {
            if (q) {
                let K = {};
                for (let [Y, z] of Object.entries(A))
                    if (Y.match(q)) K[Y] = z;
                return K
            }
            return
        }
        _serializeScopeMetrics(A) {
            let q = "";
            for (let K of A.metrics) q += this._serializeMetricData(K) + `
`;
            return q
        }
        _serializeMetricData(A) {
            let q = VNA(e06(A.descriptor.name));
            if (this._prefix) q = `${this._prefix}${q}`;
            let K = A.dataPointType;
            q = fNA(q, A);
            let Y = `# HELP ${q} ${e06(A.descriptor.description||"description missing")}`,
                z = A.descriptor.unit ? `
# UNIT ${q} ${e06(A.descriptor.unit)}` : "",
                w = `# TYPE ${q} ${MDY(A)}`,
                H = "";
            switch (K) {
                case m31.DataPointType.SUM:
                case m31.DataPointType.GAUGE: {
                    H = A.dataPoints.map(($) => this._serializeSingularDataPoint(q, A, $)).join("");
                    break
                }
                case m31.DataPointType.HISTOGRAM: {
                    H = A.dataPoints.map(($) => this._serializeHistogramDataPoint(q, A, $)).join("");
                    break
                }
                default:
                    JDY.diag.error(`Unrecognizable DataPointType: ${K} for metric "${q}"`)
            }
            return `${Y}${z}
${w}
${H}`.trim()
        }
        _serializeSingularDataPoint(A, q, K) {
            let Y = "";
            A = fNA(A, q);
            let {
                value: z,
                attributes: w
            } = K, H = (0, qE4.hrTimeToMilliseconds)(K.endTime);
            return Y += t06(A, w, z, this._appendTimestamp ? H : void 0, this._additionalAttributes), Y
        }
        _serializeHistogramDataPoint(A, q, K) {
            let Y = "";
            A = fNA(A, q);
            let {
                attributes: z,
                value: w
            } = K, H = (0, qE4.hrTimeToMilliseconds)(K.endTime);
            for (let J of ["count", "sum"]) {
                let X = w[J];
                if (X != null) Y += t06(A + "_" + J, z, X, this._appendTimestamp ? H : void 0, this._additionalAttributes)
            }
            let $ = 0,
                O = w.buckets.counts.entries(),
                _ = !1;
            for (let [J, X] of O) {
                $ += X;
                let D = w.buckets.boundaries[J];
                if (D === void 0 && _) break;
                if (D === 1 / 0) _ = !0;
                Y += t06(A + "_bucket", z, $, this._appendTimestamp ? H : void 0, Object.assign({}, this._additionalAttributes ?? {}, {
                    le: D === void 0 || D === 1 / 0 ? "+Inf" : String(D)
                }))
            }
            return Y
        }
        _serializeResource(A) {
            if (this._withoutTargetInfo === !0) return "";
            let q = "target_info",
                K = `# HELP ${q} Target metadata`,
                Y = `# TYPE ${q} gauge`,
                z = t06(q, A.attributes, 1).trim();
            return `${K}
${Y}
${z}
`
        }
    }
    zE4.PrometheusSerializer = YE4
})
// @from(Ln 302130, Col 4)
OE4 = R((HE4) => {
    Object.defineProperty(HE4, "__esModule", {
        value: !0
    });
    HE4.PrometheusExporter = void 0;
    var NF1 = Fq(),
        WDY = G9(),
        TNA = Ps(),
        GDY = h1("http"),
        ZDY = NNA(),
        fDY = h1("url");
    class Md extends TNA.MetricReader {
        static DEFAULT_OPTIONS = {
            host: void 0,
            port: 9464,
            endpoint: "/metrics",
            prefix: "",
            appendTimestamp: !1,
            withResourceConstantLabels: void 0,
            withoutTargetInfo: !1
        };
        _host;
        _port;
        _baseUrl;
        _endpoint;
        _server;
        _prefix;
        _appendTimestamp;
        _serializer;
        _startServerPromise;
        constructor(A = {}, q = () => {}) {
            super({
                aggregationSelector: (z) => {
                    return {
                        type: TNA.AggregationType.DEFAULT
                    }
                },
                aggregationTemporalitySelector: (z) => TNA.AggregationTemporality.CUMULATIVE,
                metricProducers: A.metricProducers
            });
            this._host = A.host || process.env.OTEL_EXPORTER_PROMETHEUS_HOST || Md.DEFAULT_OPTIONS.host, this._port = A.port || Number(process.env.OTEL_EXPORTER_PROMETHEUS_PORT) || Md.DEFAULT_OPTIONS.port, this._prefix = A.prefix || Md.DEFAULT_OPTIONS.prefix, this._appendTimestamp = typeof A.appendTimestamp === "boolean" ? A.appendTimestamp : Md.DEFAULT_OPTIONS.appendTimestamp;
            let K = A.withResourceConstantLabels || Md.DEFAULT_OPTIONS.withResourceConstantLabels,
                Y = A.withoutTargetInfo || Md.DEFAULT_OPTIONS.withoutTargetInfo;
            if (this._server = (0, GDY.createServer)(this._requestHandler).unref(), this._serializer = new ZDY.PrometheusSerializer(this._prefix, this._appendTimestamp, K, Y), this._baseUrl = `http://${this._host}:${this._port}/`, this._endpoint = (A.endpoint || Md.DEFAULT_OPTIONS.endpoint).replace(/^([^/])/, "/$1"), A.preventServerStart !== !0) this.startServer().then(q, (z) => {
                NF1.diag.error(z), q(z)
            });
            else if (q) queueMicrotask(q)
        }
        async onForceFlush() {}
        onShutdown() {
            return this.stopServer()
        }
        stopServer() {
            if (!this._server) return NF1.diag.debug("Prometheus stopServer() was called but server was never started."), Promise.resolve();
            else return new Promise((A) => {
                this._server.close((q) => {
                    if (!q) NF1.diag.debug("Prometheus exporter was stopped");
                    else if (q.code !== "ERR_SERVER_NOT_RUNNING")(0, WDY.globalErrorHandler)(q);
                    A()
                })
            })
        }
        startServer() {
            return this._startServerPromise ??= new Promise((A, q) => {
                this._server.once("error", q), this._server.listen({
                    port: this._port,
                    host: this._host
                }, () => {
                    NF1.diag.debug(`Prometheus exporter server started: ${this._host}:${this._port}/${this._endpoint}`), A()
                })
            }), this._startServerPromise
        }
        getMetricsRequestHandler(A, q) {
            this._exportMetrics(q)
        }
        _requestHandler = (A, q) => {
            if (A.url != null && new fDY.URL(A.url, this._baseUrl).pathname === this._endpoint) this._exportMetrics(q);
            else this._notFound(q)
        };
        _exportMetrics = (A) => {
            A.statusCode = 200, A.setHeader("content-type", "text/plain"), this.collect().then((q) => {
                let {
                    resourceMetrics: K,
                    errors: Y
                } = q;
                if (Y.length) NF1.diag.error("PrometheusExporter: metrics collection errors", ...Y);
                A.end(this._serializer.serialize(K))
            }, (q) => {
                A.end(`# failed to export metrics: ${q}`)
            })
        };
        _notFound = (A) => {
            A.statusCode = 404, A.end()
        }
    }
    HE4.PrometheusExporter = Md
})
// @from(Ln 302227, Col 4)
_E4 = R((Aj6) => {
    Object.defineProperty(Aj6, "__esModule", {
        value: !0
    });
    Aj6.PrometheusSerializer = Aj6.PrometheusExporter = void 0;
    var VDY = OE4();
    Object.defineProperty(Aj6, "PrometheusExporter", {
        enumerable: !0,
        get: function() {
            return VDY.PrometheusExporter
        }
    });
    var NDY = NNA();
    Object.defineProperty(Aj6, "PrometheusSerializer", {
        enumerable: !0,
        get: function() {
            return NDY.PrometheusSerializer
        }
    })
})
// @from(Ln 302247, Col 4)
ME4 = R((DE4) => {
    Object.defineProperty(DE4, "__esModule", {
        value: !0
    });
    DE4.OTLPLogExporter = void 0;
    var vDY = eB(),
        EDY = Km(),
        JE4 = Yd();
    class XE4 extends vDY.OTLPExporterBase {
        constructor(A = {}) {
            super((0, JE4.createOtlpHttpExportDelegate)((0, JE4.convertLegacyHttpOptions)(A, "LOGS", "v1/logs", {
                "Content-Type": "application/x-protobuf"
            }), EDY.ProtobufLogsSerializer))
        }
    }
    DE4.OTLPLogExporter = XE4
})
// @from(Ln 302264, Col 4)
PE4 = R((vNA) => {
    Object.defineProperty(vNA, "__esModule", {
        value: !0
    });
    vNA.OTLPLogExporter = void 0;
    var kDY = ME4();
    Object.defineProperty(vNA, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return kDY.OTLPLogExporter
        }
    })
})
// @from(Ln 302277, Col 4)
WE4 = R((ENA) => {
    Object.defineProperty(ENA, "__esModule", {
        value: !0
    });
    ENA.OTLPLogExporter = void 0;
    var RDY = PE4();
    Object.defineProperty(ENA, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return RDY.OTLPLogExporter
        }
    })
})
// @from(Ln 302290, Col 4)
GE4 = R((kNA) => {
    Object.defineProperty(kNA, "__esModule", {
        value: !0
    });
    kNA.OTLPLogExporter = void 0;
    var CDY = WE4();
    Object.defineProperty(kNA, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return CDY.OTLPLogExporter
        }
    })
})
// @from(Ln 302303, Col 4)
TE4 = R((VE4) => {
    Object.defineProperty(VE4, "__esModule", {
        value: !0
    });
    VE4.OTLPLogExporter = void 0;
    var ZE4 = s06(),
        hDY = Km(),
        IDY = eB();
    class fE4 extends IDY.OTLPExporterBase {
        constructor(A = {}) {
            super((0, ZE4.createOtlpGrpcExportDelegate)((0, ZE4.convertLegacyOtlpGrpcOptions)(A, "LOGS"), hDY.ProtobufLogsSerializer, "LogsExportService", "/opentelemetry.proto.collector.logs.v1.LogsService/Export"))
        }
    }
    VE4.OTLPLogExporter = fE4
})
// @from(Ln 302318, Col 4)
vE4 = R((LNA) => {
    Object.defineProperty(LNA, "__esModule", {
        value: !0
    });
    LNA.OTLPLogExporter = void 0;
    var xDY = TE4();
    Object.defineProperty(LNA, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return xDY.OTLPLogExporter
        }
    })
})
// @from(Ln 302331, Col 4)
yE4 = R((LE4) => {
    Object.defineProperty(LE4, "__esModule", {
        value: !0
    });
    LE4.OTLPLogExporter = void 0;
    var uDY = eB(),
        BDY = Km(),
        EE4 = Yd();
    class kE4 extends uDY.OTLPExporterBase {
        constructor(A = {}) {
            super((0, EE4.createOtlpHttpExportDelegate)((0, EE4.convertLegacyHttpOptions)(A, "LOGS", "v1/logs", {
                "Content-Type": "application/json"
            }), BDY.JsonLogsSerializer))
        }
    }
    LE4.OTLPLogExporter = kE4
})
// @from(Ln 302348, Col 4)
CE4 = R((RNA) => {
    Object.defineProperty(RNA, "__esModule", {
        value: !0
    });
    RNA.OTLPLogExporter = void 0;
    var mDY = yE4();
    Object.defineProperty(RNA, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return mDY.OTLPLogExporter
        }
    })
})
// @from(Ln 302361, Col 4)
SE4 = R((yNA) => {
    Object.defineProperty(yNA, "__esModule", {
        value: !0
    });
    yNA.OTLPLogExporter = void 0;
    var QDY = CE4();
    Object.defineProperty(yNA, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return QDY.OTLPLogExporter
        }
    })
})