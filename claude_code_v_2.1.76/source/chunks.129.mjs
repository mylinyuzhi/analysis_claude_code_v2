
// @from(Ln 317133, Col 4)
Cd6 = x((lF4) => {
    Object.defineProperty(lF4, "__esModule", {
        value: !0
    });
    lF4.LeafLoadBalancer = lF4.PickFirstLoadBalancer = lF4.PickFirstLoadBalancingConfig = void 0;
    lF4.shuffled = UF4;
    lF4.setup = fPY;
    var mI8 = de(),
        AJ = Vf(),
        q66 = pc(),
        gF4 = _N(),
        MPY = zw(),
        DPY = a3(),
        FF4 = _N(),
        pF4 = x6("net"),
        XPY = MY6(),
        PPY = "pick_first";

    function hd6(A) {
        MPY.trace(DPY.LogVerbosity.DEBUG, PPY, A)
    }
    var Sd6 = "pick_first",
        WPY = 250;
    class tG6 {
        constructor(A) {
            this.shuffleAddressList = A
        }
        getLoadBalancerName() {
            return Sd6
        }
        toJsonObject() {
            return {
                [Sd6]: {
                    shuffleAddressList: this.shuffleAddressList
                }
            }
        }
        getShuffleAddressList() {
            return this.shuffleAddressList
        }
        static createFromJson(A) {
            if ("shuffleAddressList" in A && typeof A.shuffleAddressList !== "boolean") throw Error("pick_first config field shuffleAddressList must be a boolean if provided");
            return new tG6(A.shuffleAddressList === !0)
        }
    }
    lF4.PickFirstLoadBalancingConfig = tG6;
    class QF4 {
        constructor(A) {
            this.subchannel = A
        }
        pick(A) {
            return {
                pickResultType: q66.PickResultType.COMPLETE,
                subchannel: this.subchannel,
                status: null,
                onCallStarted: null,
                onCallEnded: null
            }
        }
    }

    function UF4(A) {
        let q = A.slice();
        for (let K = q.length - 1; K > 1; K--) {
            let Y = Math.floor(Math.random() * (K + 1)),
                z = q[K];
            q[K] = q[Y], q[Y] = z
        }
        return q
    }

    function ZPY(A) {
        if (A.length === 0) return [];
        let q = [],
            K = [],
            Y = [],
            z = (0, FF4.isTcpSubchannelAddress)(A[0]) && (0, pF4.isIPv6)(A[0].host);
        for (let O of A)
            if ((0, FF4.isTcpSubchannelAddress)(O) && (0, pF4.isIPv6)(O.host)) K.push(O);
            else Y.push(O);
        let _ = z ? K : Y,
            w = z ? Y : K;
        for (let O = 0; O < Math.max(_.length, w.length); O++) {
            if (O < _.length) q.push(_[O]);
            if (O < w.length) q.push(w[O])
        }
        return q
    }
    var dF4 = "grpc-node.internal.pick-first.report_health_status";
    class iT1 {
        constructor(A) {
            this.channelControlHelper = A, this.children = [], this.currentState = AJ.ConnectivityState.IDLE, this.currentSubchannelIndex = 0, this.currentPick = null, this.subchannelStateListener = (q, K, Y, z, _) => {
                this.onSubchannelStateUpdate(q, K, Y, _)
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
                    this.updateState(AJ.ConnectivityState.TRANSIENT_FAILURE, new q66.UnavailablePicker({
                        details: q
                    }), q)
                } else this.updateState(AJ.ConnectivityState.READY, new QF4(this.currentPick), null);
            else if (((A = this.latestAddressList) === null || A === void 0 ? void 0 : A.length) === 0) {
                let q = `No connection established. Last error: ${this.lastError}. Resolution note: ${this.latestResolutionNote}`;
                this.updateState(AJ.ConnectivityState.TRANSIENT_FAILURE, new q66.UnavailablePicker({
                    details: q
                }), q)
            } else if (this.children.length === 0) this.updateState(AJ.ConnectivityState.IDLE, new q66.QueuePicker(this), null);
            else if (this.stickyTransientFailureMode) {
                let q = `No connection established. Last error: ${this.lastError}. Resolution note: ${this.latestResolutionNote}`;
                this.updateState(AJ.ConnectivityState.TRANSIENT_FAILURE, new q66.UnavailablePicker({
                    details: q
                }), q)
            } else this.updateState(AJ.ConnectivityState.CONNECTING, new q66.QueuePicker(this), null)
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
                if (K !== AJ.ConnectivityState.READY) this.removeCurrentPick(), this.calculateAndReportNewState();
                return
            }
            for (let [_, w] of this.children.entries())
                if (A.realSubchannelEquals(w.subchannel)) {
                    if (K === AJ.ConnectivityState.READY) this.pickSubchannel(w.subchannel);
                    if (K === AJ.ConnectivityState.TRANSIENT_FAILURE) {
                        if (w.hasReportedTransientFailure = !0, Y) this.lastError = Y;
                        if (this.maybeEnterStickyTransientFailureMode(), _ === this.currentSubchannelIndex) this.startNextSubchannelConnecting(_ + 1)
                    }
                    w.subchannel.startConnecting();
                    return
                }
        }
        startNextSubchannelConnecting(A) {
            clearTimeout(this.connectionDelayTimeout);
            for (let [q, K] of this.children.entries())
                if (q >= A) {
                    let Y = K.subchannel.getConnectivityState();
                    if (Y === AJ.ConnectivityState.IDLE || Y === AJ.ConnectivityState.CONNECTING) {
                        this.startConnecting(q);
                        return
                    }
                } this.maybeEnterStickyTransientFailureMode()
        }
        startConnecting(A) {
            var q, K;
            if (clearTimeout(this.connectionDelayTimeout), this.currentSubchannelIndex = A, this.children[A].subchannel.getConnectivityState() === AJ.ConnectivityState.IDLE) hd6("Start connecting to subchannel with address " + this.children[A].subchannel.getAddress()), process.nextTick(() => {
                var Y;
                (Y = this.children[A]) === null || Y === void 0 || Y.subchannel.startConnecting()
            });
            this.connectionDelayTimeout = setTimeout(() => {
                this.startNextSubchannelConnecting(A + 1)
            }, WPY), (K = (q = this.connectionDelayTimeout).unref) === null || K === void 0 || K.call(q)
        }
        pickSubchannel(A) {
            hd6("Pick subchannel with address " + A.getAddress()), this.stickyTransientFailureMode = !1, A.ref(), this.channelControlHelper.addChannelzChild(A.getChannelzRef()), this.removeCurrentPick(), this.resetSubchannelList(), A.addConnectivityStateListener(this.subchannelStateListener), A.addHealthStateWatcher(this.pickedSubchannelHealthListener), this.currentPick = A, clearTimeout(this.connectionDelayTimeout), this.calculateAndReportNewState()
        }
        updateState(A, q, K) {
            hd6(AJ.ConnectivityState[this.currentState] + " -> " + AJ.ConnectivityState[A]), this.currentState = A, this.channelControlHelper.updateState(A, q, K)
        }
        resetSubchannelList() {
            for (let A of this.children) A.subchannel.removeConnectivityStateListener(this.subchannelStateListener), A.subchannel.unref(), this.channelControlHelper.removeChannelzChild(A.subchannel.getChannelzRef());
            this.currentSubchannelIndex = 0, this.children = []
        }
        connectToAddressList(A, q) {
            hd6("connectToAddressList([" + A.map((Y) => (0, gF4.subchannelAddressToString)(Y)) + "])");
            let K = A.map((Y) => ({
                subchannel: this.channelControlHelper.createSubchannel(Y, q),
                hasReportedTransientFailure: !1
            }));
            for (let {
                    subchannel: Y
                }
                of K)
                if (Y.getConnectivityState() === AJ.ConnectivityState.READY) {
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
                if (Y.subchannel.getConnectivityState() === AJ.ConnectivityState.TRANSIENT_FAILURE) Y.hasReportedTransientFailure = !0;
            this.startNextSubchannelConnecting(0), this.calculateAndReportNewState()
        }
        updateAddressList(A, q, K, Y) {
            if (!(q instanceof tG6)) return !1;
            if (!A.ok) {
                if (this.children.length === 0 && this.currentPick === null) this.channelControlHelper.updateState(AJ.ConnectivityState.TRANSIENT_FAILURE, new q66.UnavailablePicker(A.error), A.error.details);
                return !0
            }
            let z = A.value;
            if (this.reportHealthStatus = K[dF4], q.getShuffleAddressList()) z = UF4(z);
            let _ = [].concat(...z.map((O) => O.addresses));
            hd6("updateAddressList([" + _.map((O) => (0, gF4.subchannelAddressToString)(O)) + "])");
            let w = ZPY(_);
            if (this.latestAddressList = w, this.latestOptions = K, this.connectToAddressList(w, K), this.latestResolutionNote = Y, _.length > 0) return !0;
            else return this.lastError = "No addresses resolved", !1
        }
        exitIdle() {
            if (this.currentState === AJ.ConnectivityState.IDLE && this.latestAddressList) this.connectToAddressList(this.latestAddressList, this.latestOptions)
        }
        resetBackoff() {}
        destroy() {
            this.resetSubchannelList(), this.removeCurrentPick()
        }
        getTypeName() {
            return Sd6
        }
    }
    lF4.PickFirstLoadBalancer = iT1;
    var GPY = new tG6(!1);
    class cF4 {
        constructor(A, q, K, Y) {
            this.endpoint = A, this.options = K, this.resolutionNote = Y, this.latestState = AJ.ConnectivityState.IDLE;
            let z = (0, mI8.createChildChannelControlHelper)(q, {
                updateState: (_, w, O) => {
                    this.latestState = _, this.latestPicker = w, q.updateState(_, w, O)
                }
            });
            this.pickFirstBalancer = new iT1(z), this.latestPicker = new q66.QueuePicker(this.pickFirstBalancer)
        }
        startConnecting() {
            this.pickFirstBalancer.updateAddressList((0, XPY.statusOrFromValue)([this.endpoint]), GPY, Object.assign(Object.assign({}, this.options), {
                [dF4]: !0
            }), this.resolutionNote)
        }
        updateEndpoint(A, q) {
            if (this.options = q, this.endpoint = A, this.latestState !== AJ.ConnectivityState.IDLE) this.startConnecting()
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
    lF4.LeafLoadBalancer = cF4;

    function fPY() {
        (0, mI8.registerLoadBalancerType)(Sd6, iT1, tG6), (0, mI8.registerDefaultLoadBalancerType)(Sd6)
    }
})
// @from(Ln 317416, Col 4)
aF4 = x((rF4) => {
    Object.defineProperty(rF4, "__esModule", {
        value: !0
    });
    rF4.FileWatcherCertificateProvider = void 0;
    var kPY = x6("fs"),
        EPY = zw(),
        yPY = a3(),
        LPY = x6("util"),
        RPY = "certificate_provider";

    function nT1(A) {
        EPY.trace(yPY.LogVerbosity.DEBUG, RPY, A)
    }
    var BI8 = (0, LPY.promisify)(kPY.readFile);
    class nF4 {
        constructor(A) {
            if (this.config = A, this.refreshTimer = null, this.fileResultPromise = null, this.latestCaUpdate = void 0, this.caListeners = new Set, this.latestIdentityUpdate = void 0, this.identityListeners = new Set, this.lastUpdateTime = null, A.certificateFile === void 0 !== (A.privateKeyFile === void 0)) throw Error("certificateFile and privateKeyFile must be set or unset together");
            if (A.certificateFile === void 0 && A.caCertificateFile === void 0) throw Error("At least one of certificateFile and caCertificateFile must be set");
            nT1("File watcher constructed with config " + JSON.stringify(A))
        }
        updateCertificates() {
            if (this.fileResultPromise) return;
            this.fileResultPromise = Promise.allSettled([this.config.certificateFile ? BI8(this.config.certificateFile) : Promise.reject(), this.config.privateKeyFile ? BI8(this.config.privateKeyFile) : Promise.reject(), this.config.caCertificateFile ? BI8(this.config.caCertificateFile) : Promise.reject()]), this.fileResultPromise.then(([A, q, K]) => {
                if (!this.refreshTimer) return;
                if (nT1("File watcher read certificates certificate " + A.status + ", privateKey " + q.status + ", CA certificate " + K.status), this.lastUpdateTime = new Date, this.fileResultPromise = null, A.status === "fulfilled" && q.status === "fulfilled") this.latestIdentityUpdate = {
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
            }), nT1("File watcher initiated certificate update")
        }
        maybeStartWatchingFiles() {
            if (!this.refreshTimer) {
                let A = this.lastUpdateTime ? new Date().getTime() - this.lastUpdateTime.getTime() : 1 / 0;
                if (A > this.config.refreshIntervalMs) this.updateCertificates();
                if (A > this.config.refreshIntervalMs * 2) this.latestCaUpdate = void 0, this.latestIdentityUpdate = void 0;
                this.refreshTimer = setInterval(() => this.updateCertificates(), this.config.refreshIntervalMs), nT1("File watcher started watching")
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
    rF4.FileWatcherCertificateProvider = nF4
})
// @from(Ln 317482, Col 4)
pI8 = x((S9) => {
    Object.defineProperty(S9, "__esModule", {
        value: !0
    });
    S9.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = S9.createCertificateProviderChannelCredentials = S9.FileWatcherCertificateProvider = S9.createCertificateProviderServerCredentials = S9.createServerCredentialsWithInterceptors = S9.BaseSubchannelWrapper = S9.registerAdminService = S9.FilterStackFactory = S9.BaseFilter = S9.statusOrFromError = S9.statusOrFromValue = S9.PickResultType = S9.QueuePicker = S9.UnavailablePicker = S9.ChildLoadBalancerHandler = S9.EndpointMap = S9.endpointHasAddress = S9.endpointToString = S9.subchannelAddressToString = S9.LeafLoadBalancer = S9.isLoadBalancerNameRegistered = S9.parseLoadBalancingConfig = S9.selectLbConfigFromList = S9.registerLoadBalancerType = S9.createChildChannelControlHelper = S9.BackoffTimeout = S9.parseDuration = S9.durationToMs = S9.splitHostPort = S9.uriToString = S9.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = S9.createResolver = S9.registerResolver = S9.log = S9.trace = void 0;
    var sF4 = zw();
    Object.defineProperty(S9, "trace", {
        enumerable: !0,
        get: function() {
            return sF4.trace
        }
    });
    Object.defineProperty(S9, "log", {
        enumerable: !0,
        get: function() {
            return sF4.log
        }
    });
    var gI8 = Ob();
    Object.defineProperty(S9, "registerResolver", {
        enumerable: !0,
        get: function() {
            return gI8.registerResolver
        }
    });
    Object.defineProperty(S9, "createResolver", {
        enumerable: !0,
        get: function() {
            return gI8.createResolver
        }
    });
    Object.defineProperty(S9, "CHANNEL_ARGS_CONFIG_SELECTOR_KEY", {
        enumerable: !0,
        get: function() {
            return gI8.CHANNEL_ARGS_CONFIG_SELECTOR_KEY
        }
    });
    var tF4 = Nf();
    Object.defineProperty(S9, "uriToString", {
        enumerable: !0,
        get: function() {
            return tF4.uriToString
        }
    });
    Object.defineProperty(S9, "splitHostPort", {
        enumerable: !0,
        get: function() {
            return tF4.splitHostPort
        }
    });
    var eF4 = Rd6();
    Object.defineProperty(S9, "durationToMs", {
        enumerable: !0,
        get: function() {
            return eF4.durationToMs
        }
    });
    Object.defineProperty(S9, "parseDuration", {
        enumerable: !0,
        get: function() {
            return eF4.parseDuration
        }
    });
    var hPY = RG6();
    Object.defineProperty(S9, "BackoffTimeout", {
        enumerable: !0,
        get: function() {
            return hPY.BackoffTimeout
        }
    });
    var Id6 = de();
    Object.defineProperty(S9, "createChildChannelControlHelper", {
        enumerable: !0,
        get: function() {
            return Id6.createChildChannelControlHelper
        }
    });
    Object.defineProperty(S9, "registerLoadBalancerType", {
        enumerable: !0,
        get: function() {
            return Id6.registerLoadBalancerType
        }
    });
    Object.defineProperty(S9, "selectLbConfigFromList", {
        enumerable: !0,
        get: function() {
            return Id6.selectLbConfigFromList
        }
    });
    Object.defineProperty(S9, "parseLoadBalancingConfig", {
        enumerable: !0,
        get: function() {
            return Id6.parseLoadBalancingConfig
        }
    });
    Object.defineProperty(S9, "isLoadBalancerNameRegistered", {
        enumerable: !0,
        get: function() {
            return Id6.isLoadBalancerNameRegistered
        }
    });
    var SPY = Cd6();
    Object.defineProperty(S9, "LeafLoadBalancer", {
        enumerable: !0,
        get: function() {
            return SPY.LeafLoadBalancer
        }
    });
    var rT1 = _N();
    Object.defineProperty(S9, "subchannelAddressToString", {
        enumerable: !0,
        get: function() {
            return rT1.subchannelAddressToString
        }
    });
    Object.defineProperty(S9, "endpointToString", {
        enumerable: !0,
        get: function() {
            return rT1.endpointToString
        }
    });
    Object.defineProperty(S9, "endpointHasAddress", {
        enumerable: !0,
        get: function() {
            return rT1.endpointHasAddress
        }
    });
    Object.defineProperty(S9, "EndpointMap", {
        enumerable: !0,
        get: function() {
            return rT1.EndpointMap
        }
    });
    var CPY = if1();
    Object.defineProperty(S9, "ChildLoadBalancerHandler", {
        enumerable: !0,
        get: function() {
            return CPY.ChildLoadBalancerHandler
        }
    });
    var FI8 = pc();
    Object.defineProperty(S9, "UnavailablePicker", {
        enumerable: !0,
        get: function() {
            return FI8.UnavailablePicker
        }
    });
    Object.defineProperty(S9, "QueuePicker", {
        enumerable: !0,
        get: function() {
            return FI8.QueuePicker
        }
    });
    Object.defineProperty(S9, "PickResultType", {
        enumerable: !0,
        get: function() {
            return FI8.PickResultType
        }
    });
    var Ap4 = MY6();
    Object.defineProperty(S9, "statusOrFromValue", {
        enumerable: !0,
        get: function() {
            return Ap4.statusOrFromValue
        }
    });
    Object.defineProperty(S9, "statusOrFromError", {
        enumerable: !0,
        get: function() {
            return Ap4.statusOrFromError
        }
    });
    var IPY = tC8();
    Object.defineProperty(S9, "BaseFilter", {
        enumerable: !0,
        get: function() {
            return IPY.BaseFilter
        }
    });
    var bPY = LT1();
    Object.defineProperty(S9, "FilterStackFactory", {
        enumerable: !0,
        get: function() {
            return bPY.FilterStackFactory
        }
    });
    var xPY = rf1();
    Object.defineProperty(S9, "registerAdminService", {
        enumerable: !0,
        get: function() {
            return xPY.registerAdminService
        }
    });
    var uPY = yd6();
    Object.defineProperty(S9, "BaseSubchannelWrapper", {
        enumerable: !0,
        get: function() {
            return uPY.BaseSubchannelWrapper
        }
    });
    var qp4 = pT1();
    Object.defineProperty(S9, "createServerCredentialsWithInterceptors", {
        enumerable: !0,
        get: function() {
            return qp4.createServerCredentialsWithInterceptors
        }
    });
    Object.defineProperty(S9, "createCertificateProviderServerCredentials", {
        enumerable: !0,
        get: function() {
            return qp4.createCertificateProviderServerCredentials
        }
    });
    var mPY = aF4();
    Object.defineProperty(S9, "FileWatcherCertificateProvider", {
        enumerable: !0,
        get: function() {
            return mPY.FileWatcherCertificateProvider
        }
    });
    var BPY = LG6();
    Object.defineProperty(S9, "createCertificateProviderChannelCredentials", {
        enumerable: !0,
        get: function() {
            return BPY.createCertificateProviderChannelCredentials
        }
    });
    var gPY = fI8();
    Object.defineProperty(S9, "SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX", {
        enumerable: !0,
        get: function() {
            return gPY.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX
        }
    })
})
// @from(Ln 317717, Col 4)
zp4 = x((Yp4) => {
    Object.defineProperty(Yp4, "__esModule", {
        value: !0
    });
    Yp4.setup = UPY;
    var pPY = Ob(),
        QPY = MY6();
    class Kp4 {
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
            if (!this.hasReturnedResult) this.hasReturnedResult = !0, process.nextTick(this.listener, (0, QPY.statusOrFromValue)(this.endpoints), {}, null, "")
        }
        destroy() {
            this.hasReturnedResult = !1
        }
        static getDefaultAuthority(A) {
            return "localhost"
        }
    }

    function UPY() {
        (0, pPY.registerResolver)("unix", Kp4)
    }
})
// @from(Ln 317751, Col 4)
Jp4 = x((jp4) => {
    Object.defineProperty(jp4, "__esModule", {
        value: !0
    });
    jp4.setup = rPY;
    var _p4 = x6("net"),
        wp4 = MY6(),
        oT1 = a3(),
        QI8 = LX(),
        Op4 = Ob(),
        cPY = _N(),
        $p4 = Nf(),
        lPY = zw(),
        iPY = "ip_resolver";

    function Hp4(A) {
        lPY.trace(oT1.LogVerbosity.DEBUG, iPY, A)
    }
    var UI8 = "ipv4",
        dI8 = "ipv6",
        nPY = 443;
    class cI8 {
        constructor(A, q, K) {
            var Y;
            this.listener = q, this.endpoints = [], this.error = null, this.hasReturnedResult = !1, Hp4("Resolver constructed for target " + (0, $p4.uriToString)(A));
            let z = [];
            if (!(A.scheme === UI8 || A.scheme === dI8)) {
                this.error = {
                    code: oT1.Status.UNAVAILABLE,
                    details: `Unrecognized scheme ${A.scheme} in IP resolver`,
                    metadata: new QI8.Metadata
                };
                return
            }
            let _ = A.path.split(",");
            for (let w of _) {
                let O = (0, $p4.splitHostPort)(w);
                if (O === null) {
                    this.error = {
                        code: oT1.Status.UNAVAILABLE,
                        details: `Failed to parse ${A.scheme} address ${w}`,
                        metadata: new QI8.Metadata
                    };
                    return
                }
                if (A.scheme === UI8 && !(0, _p4.isIPv4)(O.host) || A.scheme === dI8 && !(0, _p4.isIPv6)(O.host)) {
                    this.error = {
                        code: oT1.Status.UNAVAILABLE,
                        details: `Failed to parse ${A.scheme} address ${w}`,
                        metadata: new QI8.Metadata
                    };
                    return
                }
                z.push({
                    host: O.host,
                    port: (Y = O.port) !== null && Y !== void 0 ? Y : nPY
                })
            }
            this.endpoints = z.map((w) => ({
                addresses: [w]
            })), Hp4("Parsed " + A.scheme + " address list " + z.map(cPY.subchannelAddressToString))
        }
        updateResolution() {
            if (!this.hasReturnedResult) this.hasReturnedResult = !0, process.nextTick(() => {
                if (this.error) this.listener((0, wp4.statusOrFromError)(this.error), {}, null, "");
                else this.listener((0, wp4.statusOrFromValue)(this.endpoints), {}, null, "")
            })
        }
        destroy() {
            this.hasReturnedResult = !1
        }
        static getDefaultAuthority(A) {
            return A.path.split(",")[0]
        }
    }

    function rPY() {
        (0, Op4.registerResolver)(UI8, cI8), (0, Op4.registerResolver)(dI8, cI8)
    }
})
// @from(Ln 317831, Col 4)
Gp4 = x((Wp4) => {
    Object.defineProperty(Wp4, "__esModule", {
        value: !0
    });
    Wp4.RoundRobinLoadBalancer = void 0;
    Wp4.setup = q0Y;
    var Xp4 = de(),
        V0 = Vf(),
        bd6 = pc(),
        aPY = zw(),
        sPY = a3(),
        Mp4 = _N(),
        tPY = Cd6(),
        ePY = "round_robin";

    function Dp4(A) {
        aPY.trace(sPY.LogVerbosity.DEBUG, ePY, A)
    }
    var aT1 = "round_robin";
    class sT1 {
        getLoadBalancerName() {
            return aT1
        }
        constructor() {}
        toJsonObject() {
            return {
                [aT1]: {}
            }
        }
        static createFromJson(A) {
            return new sT1
        }
    }
    class Pp4 {
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

    function A0Y(A, q) {
        return [...A.slice(q), ...A.slice(0, q)]
    }
    class lI8 {
        constructor(A) {
            this.channelControlHelper = A, this.children = [], this.currentState = V0.ConnectivityState.IDLE, this.currentReadyPicker = null, this.updatesPaused = !1, this.lastError = null, this.childChannelControlHelper = (0, Xp4.createChildChannelControlHelper)(A, {
                updateState: (q, K, Y) => {
                    if (this.currentState === V0.ConnectivityState.READY && q !== V0.ConnectivityState.READY) this.channelControlHelper.requestReresolution();
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
            if (this.countChildrenWithState(V0.ConnectivityState.READY) > 0) {
                let A = this.children.filter((K) => K.getConnectivityState() === V0.ConnectivityState.READY),
                    q = 0;
                if (this.currentReadyPicker !== null) {
                    let K = this.currentReadyPicker.peekNextEndpoint();
                    if (q = A.findIndex((Y) => (0, Mp4.endpointEqual)(Y.getEndpoint(), K)), q < 0) q = 0
                }
                this.updateState(V0.ConnectivityState.READY, new Pp4(A.map((K) => ({
                    endpoint: K.getEndpoint(),
                    picker: K.getPicker()
                })), q), null)
            } else if (this.countChildrenWithState(V0.ConnectivityState.CONNECTING) > 0) this.updateState(V0.ConnectivityState.CONNECTING, new bd6.QueuePicker(this), null);
            else if (this.countChildrenWithState(V0.ConnectivityState.TRANSIENT_FAILURE) > 0) {
                let A = `round_robin: No connection established. Last error: ${this.lastError}`;
                this.updateState(V0.ConnectivityState.TRANSIENT_FAILURE, new bd6.UnavailablePicker({
                    details: A
                }), A)
            } else this.updateState(V0.ConnectivityState.IDLE, new bd6.QueuePicker(this), null);
            for (let A of this.children)
                if (A.getConnectivityState() === V0.ConnectivityState.IDLE) A.exitIdle()
        }
        updateState(A, q, K) {
            if (Dp4(V0.ConnectivityState[this.currentState] + " -> " + V0.ConnectivityState[A]), A === V0.ConnectivityState.READY) this.currentReadyPicker = q;
            else this.currentReadyPicker = null;
            this.currentState = A, this.channelControlHelper.updateState(A, q, K)
        }
        resetSubchannelList() {
            for (let A of this.children) A.destroy();
            this.children = []
        }
        updateAddressList(A, q, K, Y) {
            if (!(q instanceof sT1)) return !1;
            if (!A.ok) {
                if (this.children.length === 0) this.updateState(V0.ConnectivityState.TRANSIENT_FAILURE, new bd6.UnavailablePicker(A.error), A.error.details);
                return !0
            }
            let z = Math.random() * A.value.length | 0,
                _ = A0Y(A.value, z);
            if (this.resetSubchannelList(), _.length === 0) {
                let w = `No addresses resolved. Resolution note: ${Y}`;
                this.updateState(V0.ConnectivityState.TRANSIENT_FAILURE, new bd6.UnavailablePicker({
                    details: w
                }), w)
            }
            Dp4("Connect to endpoint list " + _.map(Mp4.endpointToString)), this.updatesPaused = !0, this.children = _.map((w) => new tPY.LeafLoadBalancer(w, this.childChannelControlHelper, K, Y));
            for (let w of this.children) w.startConnecting();
            return this.updatesPaused = !1, this.calculateAndUpdateState(), !0
        }
        exitIdle() {}
        resetBackoff() {}
        destroy() {
            this.resetSubchannelList()
        }
        getTypeName() {
            return aT1
        }
    }
    Wp4.RoundRobinLoadBalancer = lI8;

    function q0Y() {
        (0, Xp4.registerLoadBalancerType)(aT1, lI8, sT1)
    }
})
// @from(Ln 317958, Col 4)
yp4 = x((kp4) => {
    var iI8;
    Object.defineProperty(kp4, "__esModule", {
        value: !0
    });
    kp4.OutlierDetectionLoadBalancer = kp4.OutlierDetectionLoadBalancingConfig = void 0;
    kp4.setup = D0Y;
    var Y0Y = Vf(),
        fp4 = a3(),
        VY6 = Rd6(),
        Tp4 = pI8(),
        z0Y = de(),
        _0Y = if1(),
        w0Y = pc(),
        nI8 = _N(),
        O0Y = yd6(),
        $0Y = zw(),
        H0Y = "outlier_detection";

    function SX(A) {
        $0Y.trace(fp4.LogVerbosity.DEBUG, H0Y, A)
    }
    var aI8 = "outlier_detection",
        j0Y = ((iI8 = process.env.GRPC_EXPERIMENTAL_ENABLE_OUTLIER_DETECTION) !== null && iI8 !== void 0 ? iI8 : "true") === "true",
        J0Y = {
            stdev_factor: 1900,
            enforcement_percentage: 100,
            minimum_hosts: 5,
            request_volume: 100
        },
        M0Y = {
            threshold: 85,
            enforcement_percentage: 100,
            minimum_hosts: 5,
            request_volume: 50
        };

    function eG6(A, q, K, Y) {
        if (q in A && A[q] !== void 0 && typeof A[q] !== K) {
            let z = Y ? `${Y}.${q}` : q;
            throw Error(`outlier detection config ${z} parse error: expected ${K}, got ${typeof A[q]}`)
        }
    }

    function rI8(A, q, K) {
        let Y = K ? `${K}.${q}` : q;
        if (q in A && A[q] !== void 0) {
            if (!(0, VY6.isDuration)(A[q])) throw Error(`outlier detection config ${Y} parse error: expected Duration, got ${typeof A[q]}`);
            if (!(A[q].seconds >= 0 && A[q].seconds <= 315576000000 && A[q].nanos >= 0 && A[q].nanos <= 999999999)) throw Error(`outlier detection config ${Y} parse error: values out of range for non-negative Duaration`)
        }
    }

    function tT1(A, q, K) {
        let Y = K ? `${K}.${q}` : q;
        if (eG6(A, q, "number", K), q in A && A[q] !== void 0 && !(A[q] >= 0 && A[q] <= 100)) throw Error(`outlier detection config ${Y} parse error: value out of range for percentage (0-100)`)
    }
    class xd6 {
        constructor(A, q, K, Y, z, _, w) {
            if (this.childPolicy = w, w.getLoadBalancerName() === "pick_first") throw Error("outlier_detection LB policy cannot have a pick_first child policy");
            this.intervalMs = A !== null && A !== void 0 ? A : 1e4, this.baseEjectionTimeMs = q !== null && q !== void 0 ? q : 30000, this.maxEjectionTimeMs = K !== null && K !== void 0 ? K : 300000, this.maxEjectionPercent = Y !== null && Y !== void 0 ? Y : 10, this.successRateEjection = z ? Object.assign(Object.assign({}, J0Y), z) : null, this.failurePercentageEjection = _ ? Object.assign(Object.assign({}, M0Y), _) : null
        }
        getLoadBalancerName() {
            return aI8
        }
        toJsonObject() {
            var A, q;
            return {
                outlier_detection: {
                    interval: (0, VY6.msToDuration)(this.intervalMs),
                    base_ejection_time: (0, VY6.msToDuration)(this.baseEjectionTimeMs),
                    max_ejection_time: (0, VY6.msToDuration)(this.maxEjectionTimeMs),
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
            if (rI8(A, "interval"), rI8(A, "base_ejection_time"), rI8(A, "max_ejection_time"), tT1(A, "max_ejection_percent"), "success_rate_ejection" in A && A.success_rate_ejection !== void 0) {
                if (typeof A.success_rate_ejection !== "object") throw Error("outlier detection config success_rate_ejection must be an object");
                eG6(A.success_rate_ejection, "stdev_factor", "number", "success_rate_ejection"), tT1(A.success_rate_ejection, "enforcement_percentage", "success_rate_ejection"), eG6(A.success_rate_ejection, "minimum_hosts", "number", "success_rate_ejection"), eG6(A.success_rate_ejection, "request_volume", "number", "success_rate_ejection")
            }
            if ("failure_percentage_ejection" in A && A.failure_percentage_ejection !== void 0) {
                if (typeof A.failure_percentage_ejection !== "object") throw Error("outlier detection config failure_percentage_ejection must be an object");
                tT1(A.failure_percentage_ejection, "threshold", "failure_percentage_ejection"), tT1(A.failure_percentage_ejection, "enforcement_percentage", "failure_percentage_ejection"), eG6(A.failure_percentage_ejection, "minimum_hosts", "number", "failure_percentage_ejection"), eG6(A.failure_percentage_ejection, "request_volume", "number", "failure_percentage_ejection")
            }
            if (!("child_policy" in A) || !Array.isArray(A.child_policy)) throw Error("outlier detection config child_policy must be an array");
            let K = (0, z0Y.selectLbConfigFromList)(A.child_policy);
            if (!K) throw Error("outlier detection config child_policy: no valid recognized policy found");
            return new xd6(A.interval ? (0, VY6.durationToMs)(A.interval) : null, A.base_ejection_time ? (0, VY6.durationToMs)(A.base_ejection_time) : null, A.max_ejection_time ? (0, VY6.durationToMs)(A.max_ejection_time) : null, (q = A.max_ejection_percent) !== null && q !== void 0 ? q : null, A.success_rate_ejection, A.failure_percentage_ejection, K)
        }
    }
    kp4.OutlierDetectionLoadBalancingConfig = xd6;
    class vp4 extends O0Y.BaseSubchannelWrapper {
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

    function oI8() {
        return {
            success: 0,
            failure: 0
        }
    }
    class Np4 {
        constructor() {
            this.activeBucket = oI8(), this.inactiveBucket = oI8()
        }
        addSuccess() {
            this.activeBucket.success += 1
        }
        addFailure() {
            this.activeBucket.failure += 1
        }
        switchBuckets() {
            this.inactiveBucket = this.activeBucket, this.activeBucket = oI8()
        }
        getLastSuccesses() {
            return this.inactiveBucket.success
        }
        getLastFailures() {
            return this.inactiveBucket.failure
        }
    }
    class Vp4 {
        constructor(A, q) {
            this.wrappedPicker = A, this.countCalls = q
        }
        pick(A) {
            let q = this.wrappedPicker.pick(A);
            if (q.pickResultType === w0Y.PickResultType.COMPLETE) {
                let K = q.subchannel,
                    Y = K.getMapEntry();
                if (Y) {
                    let z = q.onCallEnded;
                    if (this.countCalls) z = (_, w, O) => {
                        var $;
                        if (_ === fp4.Status.OK) Y.counter.addSuccess();
                        else Y.counter.addFailure();
                        ($ = q.onCallEnded) === null || $ === void 0 || $.call(q, _, w, O)
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
    class sI8 {
        constructor(A) {
            this.entryMap = new nI8.EndpointMap, this.latestConfig = null, this.timerStartTime = null, this.childBalancer = new _0Y.ChildLoadBalancerHandler((0, Tp4.createChildChannelControlHelper)(A, {
                createSubchannel: (q, K) => {
                    let Y = A.createSubchannel(q, K),
                        z = this.entryMap.getForSubchannelAddress(q),
                        _ = new vp4(Y, z);
                    if ((z === null || z === void 0 ? void 0 : z.currentEjectionTimestamp) !== null) _.eject();
                    return z === null || z === void 0 || z.subchannelWrappers.push(_), _
                },
                updateState: (q, K, Y) => {
                    if (q === Y0Y.ConnectivityState.READY) A.updateState(q, new Vp4(K, this.isCountingEnabled()), Y);
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
            SX("Running success rate check");
            let K = q.request_volume,
                Y = 0,
                z = [];
            for (let [j, J] of this.entryMap.entries()) {
                let M = J.counter.getLastSuccesses(),
                    D = J.counter.getLastFailures();
                if (SX("Stats for " + (0, nI8.endpointToString)(j) + ": successes=" + M + " failures=" + D + " targetRequestVolume=" + K), M + D >= K) Y += 1, z.push(M / (M + D))
            }
            if (SX("Found " + Y + " success rate candidates; currentEjectionPercent=" + this.getCurrentEjectionPercent() + " successRates=[" + z + "]"), Y < q.minimum_hosts) return;
            let _ = z.reduce((j, J) => j + J) / z.length,
                w = 0;
            for (let j of z) {
                let J = j - _;
                w += J * J
            }
            let O = w / z.length,
                $ = Math.sqrt(O),
                H = _ - $ * (q.stdev_factor / 1000);
            SX("stdev=" + $ + " ejectionThreshold=" + H);
            for (let [j, J] of this.entryMap.entries()) {
                if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) break;
                let M = J.counter.getLastSuccesses(),
                    D = J.counter.getLastFailures();
                if (M + D < K) continue;
                let X = M / (M + D);
                if (SX("Checking candidate " + j + " successRate=" + X), X < H) {
                    let P = Math.random() * 100;
                    if (SX("Candidate " + j + " randomNumber=" + P + " enforcement_percentage=" + q.enforcement_percentage), P < q.enforcement_percentage) SX("Ejecting candidate " + j), this.eject(J, A)
                }
            }
        }
        runFailurePercentageCheck(A) {
            if (!this.latestConfig) return;
            let q = this.latestConfig.getFailurePercentageEjectionConfig();
            if (!q) return;
            SX("Running failure percentage check. threshold=" + q.threshold + " request volume threshold=" + q.request_volume);
            let K = 0;
            for (let Y of this.entryMap.values()) {
                let z = Y.counter.getLastSuccesses(),
                    _ = Y.counter.getLastFailures();
                if (z + _ >= q.request_volume) K += 1
            }
            if (K < q.minimum_hosts) return;
            for (let [Y, z] of this.entryMap.entries()) {
                if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) break;
                let _ = z.counter.getLastSuccesses(),
                    w = z.counter.getLastFailures();
                if (SX("Candidate successes=" + _ + " failures=" + w), _ + w < q.request_volume) continue;
                if (w * 100 / (w + _) > q.threshold) {
                    let $ = Math.random() * 100;
                    if (SX("Candidate " + Y + " randomNumber=" + $ + " enforcement_percentage=" + q.enforcement_percentage), $ < q.enforcement_percentage) SX("Ejecting candidate " + Y), this.eject(z, A)
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
            if (SX("Ejection timer running"), this.switchAllBuckets(), !this.latestConfig) return;
            this.timerStartTime = A, this.startTimer(this.latestConfig.getIntervalMs()), this.runSuccessRateCheck(A), this.runFailurePercentageCheck(A);
            for (let [q, K] of this.entryMap.entries())
                if (K.currentEjectionTimestamp === null) {
                    if (K.ejectionTimeMultiplier > 0) K.ejectionTimeMultiplier -= 1
                } else {
                    let Y = this.latestConfig.getBaseEjectionTimeMs(),
                        z = this.latestConfig.getMaxEjectionTimeMs(),
                        _ = new Date(K.currentEjectionTimestamp.getTime());
                    if (_.setMilliseconds(_.getMilliseconds() + Math.min(Y * K.ejectionTimeMultiplier, Math.max(Y, z))), _ < new Date) SX("Unejecting " + q), this.uneject(K)
                }
        }
        updateAddressList(A, q, K, Y) {
            if (!(q instanceof xd6)) return !1;
            if (SX("Received update with config: " + JSON.stringify(q.toJsonObject(), void 0, 2)), A.ok) {
                for (let _ of A.value)
                    if (!this.entryMap.has(_)) SX("Adding map entry for " + (0, nI8.endpointToString)(_)), this.entryMap.set(_, {
                        counter: new Np4,
                        currentEjectionTimestamp: null,
                        ejectionTimeMultiplier: 0,
                        subchannelWrappers: []
                    });
                this.entryMap.deleteMissing(A.value)
            }
            let z = q.getChildPolicy();
            if (this.childBalancer.updateAddressList(A, z, K, Y), q.getSuccessRateEjectionConfig() || q.getFailurePercentageEjectionConfig())
                if (this.timerStartTime) {
                    SX("Previous timer existed. Replacing timer"), clearTimeout(this.ejectionTimer);
                    let _ = q.getIntervalMs() - (new Date().getTime() - this.timerStartTime.getTime());
                    this.startTimer(_)
                } else SX("Starting new timer"), this.timerStartTime = new Date, this.startTimer(q.getIntervalMs()), this.switchAllBuckets();
            else {
                SX("Counting disabled. Cancelling timer."), this.timerStartTime = null, clearTimeout(this.ejectionTimer);
                for (let _ of this.entryMap.values()) this.uneject(_), _.ejectionTimeMultiplier = 0
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
            return aI8
        }
    }
    kp4.OutlierDetectionLoadBalancer = sI8;

    function D0Y() {
        if (j0Y)(0, Tp4.registerLoadBalancerType)(aI8, sI8, xd6)
    }
})
// @from(Ln 318314, Col 4)
Sp4 = x((Rp4) => {
    Object.defineProperty(Rp4, "__esModule", {
        value: !0
    });
    Rp4.PriorityQueue = void 0;
    var Af6 = 0,
        tI8 = (A) => Math.floor(A / 2),
        eT1 = (A) => A * 2 + 1,
        ud6 = (A) => A * 2 + 2;
    class Lp4 {
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
            return this.heap[Af6]
        }
        push(...A) {
            return A.forEach((q) => {
                this.heap.push(q), this.siftUp()
            }), this.size()
        }
        pop() {
            let A = this.peek(),
                q = this.size() - 1;
            if (q > Af6) this.swap(Af6, q);
            return this.heap.pop(), this.siftDown(), A
        }
        replace(A) {
            let q = this.peek();
            return this.heap[Af6] = A, this.siftDown(), q
        }
        greater(A, q) {
            return this.comparator(this.heap[A], this.heap[q])
        }
        swap(A, q) {
            [this.heap[A], this.heap[q]] = [this.heap[q], this.heap[A]]
        }
        siftUp() {
            let A = this.size() - 1;
            while (A > Af6 && this.greater(A, tI8(A))) this.swap(A, tI8(A)), A = tI8(A)
        }
        siftDown() {
            let A = Af6;
            while (eT1(A) < this.size() && this.greater(eT1(A), A) || ud6(A) < this.size() && this.greater(ud6(A), A)) {
                let q = ud6(A) < this.size() && this.greater(ud6(A), eT1(A)) ? ud6(A) : eT1(A);
                this.swap(A, q), A = q
            }
        }
    }
    Rp4.PriorityQueue = Lp4
})
// @from(Ln 318371, Col 4)
Fp4 = x((Bp4) => {
    Object.defineProperty(Bp4, "__esModule", {
        value: !0
    });
    Bp4.WeightedRoundRobinLoadBalancingConfig = void 0;
    Bp4.setup = y0Y;
    var CX = Vf(),
        W0Y = a3(),
        _E = Rd6(),
        bp4 = de(),
        Z0Y = Cd6(),
        G0Y = zw(),
        xp4 = UT1(),
        qf6 = pc(),
        f0Y = Sp4(),
        Cp4 = _N(),
        T0Y = "weighted_round_robin";

    function eI8(A) {
        G0Y.trace(W0Y.LogVerbosity.DEBUG, T0Y, A)
    }
    var Ab8 = "weighted_round_robin",
        v0Y = 1e4,
        N0Y = 1e4,
        V0Y = 180000,
        k0Y = 1000,
        E0Y = 1;

    function Ip4(A, q, K) {
        if (q in A && A[q] !== void 0 && typeof A[q] !== K) throw Error(`weighted round robin config ${q} parse error: expected ${K}, got ${typeof A[q]}`)
    }

    function Av1(A, q) {
        if (q in A && A[q] !== void 0 && A[q] !== null) {
            let K;
            if ((0, _E.isDuration)(A[q])) K = A[q];
            else if ((0, _E.isDurationMessage)(A[q])) K = (0, _E.durationMessageToDuration)(A[q]);
            else if (typeof A[q] === "string") {
                let Y = (0, _E.parseDuration)(A[q]);
                if (!Y) throw Error(`weighted round robin config ${q}: failed to parse duration string ${A[q]}`);
                K = Y
            } else throw Error(`weighted round robin config ${q}: expected duration, got ${typeof A[q]}`);
            return (0, _E.durationToMs)(K)
        }
        return null
    }
    class md6 {
        constructor(A, q, K, Y, z, _) {
            this.enableOobLoadReport = A !== null && A !== void 0 ? A : !1, this.oobLoadReportingPeriodMs = q !== null && q !== void 0 ? q : v0Y, this.blackoutPeriodMs = K !== null && K !== void 0 ? K : N0Y, this.weightExpirationPeriodMs = Y !== null && Y !== void 0 ? Y : V0Y, this.weightUpdatePeriodMs = Math.max(z !== null && z !== void 0 ? z : k0Y, 100), this.errorUtilizationPenalty = _ !== null && _ !== void 0 ? _ : E0Y
        }
        getLoadBalancerName() {
            return Ab8
        }
        toJsonObject() {
            return {
                enable_oob_load_report: this.enableOobLoadReport,
                oob_load_reporting_period: (0, _E.durationToString)((0, _E.msToDuration)(this.oobLoadReportingPeriodMs)),
                blackout_period: (0, _E.durationToString)((0, _E.msToDuration)(this.blackoutPeriodMs)),
                weight_expiration_period: (0, _E.durationToString)((0, _E.msToDuration)(this.weightExpirationPeriodMs)),
                weight_update_period: (0, _E.durationToString)((0, _E.msToDuration)(this.weightUpdatePeriodMs)),
                error_utilization_penalty: this.errorUtilizationPenalty
            }
        }
        static createFromJson(A) {
            if (Ip4(A, "enable_oob_load_report", "boolean"), Ip4(A, "error_utilization_penalty", "number"), A.error_utilization_penalty < 0) throw Error("weighted round robin config error_utilization_penalty < 0");
            return new md6(A.enable_oob_load_report, Av1(A, "oob_load_reporting_period"), Av1(A, "blackout_period"), Av1(A, "weight_expiration_period"), Av1(A, "weight_update_period"), A.error_utilization_penalty)
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
    Bp4.WeightedRoundRobinLoadBalancingConfig = md6;
    class up4 {
        constructor(A, q) {
            this.metricsHandler = q, this.queue = new f0Y.PriorityQueue((z, _) => z.deadline < _.deadline);
            let K = A.filter((z) => z.weight > 0),
                Y;
            if (K.length < 2) Y = 1;
            else {
                let z = 0;
                for (let {
                        weight: _
                    }
                    of K) z += _;
                Y = z / K.length
            }
            for (let z of A) {
                let _ = z.weight > 0 ? 1 / z.weight : Y;
                this.queue.push({
                    endpointName: z.endpointName,
                    picker: z.picker,
                    period: _,
                    deadline: Math.random() * _
                })
            }
        }
        pick(A) {
            let q = this.queue.pop();
            this.queue.push(Object.assign(Object.assign({}, q), {
                deadline: q.deadline + q.period
            }));
            let K = q.picker.pick(A);
            if (K.pickResultType === qf6.PickResultType.COMPLETE)
                if (this.metricsHandler) return Object.assign(Object.assign({}, K), {
                    onCallEnded: (0, xp4.createMetricsReader)((Y) => this.metricsHandler(Y, q.endpointName), K.onCallEnded)
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
    class mp4 {
        constructor(A) {
            this.channelControlHelper = A, this.latestConfig = null, this.children = new Map, this.currentState = CX.ConnectivityState.IDLE, this.updatesPaused = !1, this.lastError = null, this.weightUpdateTimer = null
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
                application_utilization: _
            } = q;
            if (_ > 0 && z > 0) _ += q.eps / z * ((Y = (K = this.latestConfig) === null || K === void 0 ? void 0 : K.getErrorUtilizationPenalty()) !== null && Y !== void 0 ? Y : 0);
            let w = _ === 0 ? 0 : z / _;
            if (w === 0) return;
            let O = new Date;
            if (A.nonEmptySince === null) A.nonEmptySince = O;
            A.lastUpdated = O, A.weight = w
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
            if (this.countChildrenWithState(CX.ConnectivityState.READY) > 0) {
                let A = [];
                for (let [K, Y] of this.children) {
                    if (Y.child.getConnectivityState() !== CX.ConnectivityState.READY) continue;
                    A.push({
                        endpointName: K,
                        picker: Y.child.getPicker(),
                        weight: this.getWeight(Y)
                    })
                }
                eI8("Created picker with weights: " + A.map((K) => K.endpointName + ":" + K.weight).join(","));
                let q;
                if (!this.latestConfig.getEnableOobLoadReport()) q = (K, Y) => {
                    let z = this.children.get(Y);
                    if (z) this.updateWeight(z, K)
                };
                else q = null;
                this.updateState(CX.ConnectivityState.READY, new up4(A, q), null)
            } else if (this.countChildrenWithState(CX.ConnectivityState.CONNECTING) > 0) this.updateState(CX.ConnectivityState.CONNECTING, new qf6.QueuePicker(this), null);
            else if (this.countChildrenWithState(CX.ConnectivityState.TRANSIENT_FAILURE) > 0) {
                let A = `weighted_round_robin: No connection established. Last error: ${this.lastError}`;
                this.updateState(CX.ConnectivityState.TRANSIENT_FAILURE, new qf6.UnavailablePicker({
                    details: A
                }), A)
            } else this.updateState(CX.ConnectivityState.IDLE, new qf6.QueuePicker(this), null);
            for (let {
                    child: A
                }
                of this.children.values())
                if (A.getConnectivityState() === CX.ConnectivityState.IDLE) A.exitIdle()
        }
        updateState(A, q, K) {
            eI8(CX.ConnectivityState[this.currentState] + " -> " + CX.ConnectivityState[A]), this.currentState = A, this.channelControlHelper.updateState(A, q, K)
        }
        updateAddressList(A, q, K, Y) {
            var z, _;
            if (!(q instanceof md6)) return !1;
            if (!A.ok) {
                if (this.children.size === 0) this.updateState(CX.ConnectivityState.TRANSIENT_FAILURE, new qf6.UnavailablePicker(A.error), A.error.details);
                return !0
            }
            if (A.value.length === 0) {
                let $ = `No addresses resolved. Resolution note: ${Y}`;
                return this.updateState(CX.ConnectivityState.TRANSIENT_FAILURE, new qf6.UnavailablePicker({
                    details: $
                }), $), !1
            }
            eI8("Connect to endpoint list " + A.value.map(Cp4.endpointToString));
            let w = new Date,
                O = new Set;
            this.updatesPaused = !0, this.latestConfig = q;
            for (let $ of A.value) {
                let H = (0, Cp4.endpointToString)($);
                O.add(H);
                let j = this.children.get(H);
                if (!j) j = {
                    child: new Z0Y.LeafLoadBalancer($, (0, bp4.createChildChannelControlHelper)(this.channelControlHelper, {
                        updateState: (J, M, D) => {
                            if (this.currentState === CX.ConnectivityState.READY && J !== CX.ConnectivityState.READY) this.channelControlHelper.requestReresolution();
                            if (J === CX.ConnectivityState.READY) j.nonEmptySince = null;
                            if (D) this.lastError = D;
                            this.calculateAndUpdateState()
                        },
                        createSubchannel: (J, M) => {
                            let D = this.channelControlHelper.createSubchannel(J, M);
                            if (j === null || j === void 0 ? void 0 : j.oobMetricsListener) return new xp4.OrcaOobMetricsSubchannelWrapper(D, j.oobMetricsListener, this.latestConfig.getOobLoadReportingPeriodMs());
                            else return D
                        }
                    }), K, Y),
                    lastUpdated: w,
                    nonEmptySince: null,
                    weight: 0,
                    oobMetricsListener: null
                }, this.children.set(H, j);
                if (q.getEnableOobLoadReport()) j.oobMetricsListener = (J) => {
                    this.updateWeight(j, J)
                };
                else j.oobMetricsListener = null
            }
            for (let [$, H] of this.children)
                if (O.has($)) H.child.startConnecting();
                else H.child.destroy(), this.children.delete($);
            if (this.updatesPaused = !1, this.calculateAndUpdateState(), this.weightUpdateTimer) clearInterval(this.weightUpdateTimer);
            return this.weightUpdateTimer = (_ = (z = setInterval(() => {
                if (this.currentState === CX.ConnectivityState.READY) this.calculateAndUpdateState()
            }, q.getWeightUpdatePeriodMs())).unref) === null || _ === void 0 ? void 0 : _.call(z), !0
        }
        exitIdle() {}
        resetBackoff() {}
        destroy() {
            for (let A of this.children.values()) A.child.destroy();
            if (this.children.clear(), this.weightUpdateTimer) clearInterval(this.weightUpdateTimer)
        }
        getTypeName() {
            return Ab8
        }
    }

    function y0Y() {
        (0, bp4.registerLoadBalancerType)(Ab8, mp4, md6)
    }
})
// @from(Ln 318636, Col 4)
Bd6 = x((i_) => {
    Object.defineProperty(i_, "__esModule", {
        value: !0
    });
    i_.experimental = i_.ServerMetricRecorder = i_.ServerInterceptingCall = i_.ResponderBuilder = i_.ServerListenerBuilder = i_.addAdminServicesToServer = i_.getChannelzHandlers = i_.getChannelzServiceDefinition = i_.InterceptorConfigurationError = i_.InterceptingCall = i_.RequesterBuilder = i_.ListenerBuilder = i_.StatusBuilder = i_.getClientChannel = i_.ServerCredentials = i_.Server = i_.setLogVerbosity = i_.setLogger = i_.load = i_.loadObject = i_.CallCredentials = i_.ChannelCredentials = i_.waitForClientReady = i_.closeClient = i_.Channel = i_.makeGenericClientConstructor = i_.makeClientConstructor = i_.loadPackageDefinition = i_.Client = i_.compressionAlgorithms = i_.propagate = i_.connectivityState = i_.status = i_.logVerbosity = i_.Metadata = i_.credentials = void 0;
    var qv1 = gf1();
    Object.defineProperty(i_, "CallCredentials", {
        enumerable: !0,
        get: function() {
            return qv1.CallCredentials
        }
    });
    var R0Y = eS8();
    Object.defineProperty(i_, "Channel", {
        enumerable: !0,
        get: function() {
            return R0Y.ChannelImplementation
        }
    });
    var h0Y = sC8();
    Object.defineProperty(i_, "compressionAlgorithms", {
        enumerable: !0,
        get: function() {
            return h0Y.CompressionAlgorithms
        }
    });
    var S0Y = Vf();
    Object.defineProperty(i_, "connectivityState", {
        enumerable: !0,
        get: function() {
            return S0Y.ConnectivityState
        }
    });
    var Kv1 = LG6();
    Object.defineProperty(i_, "ChannelCredentials", {
        enumerable: !0,
        get: function() {
            return Kv1.ChannelCredentials
        }
    });
    var pp4 = tS8();
    Object.defineProperty(i_, "Client", {
        enumerable: !0,
        get: function() {
            return pp4.Client
        }
    });
    var qb8 = a3();
    Object.defineProperty(i_, "logVerbosity", {
        enumerable: !0,
        get: function() {
            return qb8.LogVerbosity
        }
    });
    Object.defineProperty(i_, "status", {
        enumerable: !0,
        get: function() {
            return qb8.Status
        }
    });
    Object.defineProperty(i_, "propagate", {
        enumerable: !0,
        get: function() {
            return qb8.Propagate
        }
    });
    var Qp4 = zw(),
        Kb8 = af1();
    Object.defineProperty(i_, "loadPackageDefinition", {
        enumerable: !0,
        get: function() {
            return Kb8.loadPackageDefinition
        }
    });
    Object.defineProperty(i_, "makeClientConstructor", {
        enumerable: !0,
        get: function() {
            return Kb8.makeClientConstructor
        }
    });
    Object.defineProperty(i_, "makeGenericClientConstructor", {
        enumerable: !0,
        get: function() {
            return Kb8.makeClientConstructor
        }
    });
    var C0Y = LX();
    Object.defineProperty(i_, "Metadata", {
        enumerable: !0,
        get: function() {
            return C0Y.Metadata
        }
    });
    var I0Y = bF4();
    Object.defineProperty(i_, "Server", {
        enumerable: !0,
        get: function() {
            return I0Y.Server
        }
    });
    var b0Y = pT1();
    Object.defineProperty(i_, "ServerCredentials", {
        enumerable: !0,
        get: function() {
            return b0Y.ServerCredentials
        }
    });
    var x0Y = BF4();
    Object.defineProperty(i_, "StatusBuilder", {
        enumerable: !0,
        get: function() {
            return x0Y.StatusBuilder
        }
    });
    i_.credentials = {
        combineChannelCredentials: (A, ...q) => {
            return q.reduce((K, Y) => K.compose(Y), A)
        },
        combineCallCredentials: (A, ...q) => {
            return q.reduce((K, Y) => K.compose(Y), A)
        },
        createInsecure: Kv1.ChannelCredentials.createInsecure,
        createSsl: Kv1.ChannelCredentials.createSsl,
        createFromSecureContext: Kv1.ChannelCredentials.createFromSecureContext,
        createFromMetadataGenerator: qv1.CallCredentials.createFromMetadataGenerator,
        createFromGoogleCredential: qv1.CallCredentials.createFromGoogleCredential,
        createEmpty: qv1.CallCredentials.createEmpty
    };
    var u0Y = (A) => A.close();
    i_.closeClient = u0Y;
    var m0Y = (A, q, K) => A.waitForReady(q, K);
    i_.waitForClientReady = m0Y;
    var B0Y = (A, q) => {
        throw Error("Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead")
    };
    i_.loadObject = B0Y;
    var g0Y = (A, q, K) => {
        throw Error("Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead")
    };
    i_.load = g0Y;
    var F0Y = (A) => {
        Qp4.setLogger(A)
    };
    i_.setLogger = F0Y;
    var p0Y = (A) => {
        Qp4.setLoggerVerbosity(A)
    };
    i_.setLogVerbosity = p0Y;
    var Q0Y = (A) => {
        return pp4.Client.prototype.getChannel.call(A)
    };
    i_.getClientChannel = Q0Y;
    var Yv1 = aS8();
    Object.defineProperty(i_, "ListenerBuilder", {
        enumerable: !0,
        get: function() {
            return Yv1.ListenerBuilder
        }
    });
    Object.defineProperty(i_, "RequesterBuilder", {
        enumerable: !0,
        get: function() {
            return Yv1.RequesterBuilder
        }
    });
    Object.defineProperty(i_, "InterceptingCall", {
        enumerable: !0,
        get: function() {
            return Yv1.InterceptingCall
        }
    });
    Object.defineProperty(i_, "InterceptorConfigurationError", {
        enumerable: !0,
        get: function() {
            return Yv1.InterceptorConfigurationError
        }
    });
    var Up4 = ae();
    Object.defineProperty(i_, "getChannelzServiceDefinition", {
        enumerable: !0,
        get: function() {
            return Up4.getChannelzServiceDefinition
        }
    });
    Object.defineProperty(i_, "getChannelzHandlers", {
        enumerable: !0,
        get: function() {
            return Up4.getChannelzHandlers
        }
    });
    var U0Y = rf1();
    Object.defineProperty(i_, "addAdminServicesToServer", {
        enumerable: !0,
        get: function() {
            return U0Y.addAdminServicesToServer
        }
    });
    var Yb8 = II8();
    Object.defineProperty(i_, "ServerListenerBuilder", {
        enumerable: !0,
        get: function() {
            return Yb8.ServerListenerBuilder
        }
    });
    Object.defineProperty(i_, "ResponderBuilder", {
        enumerable: !0,
        get: function() {
            return Yb8.ResponderBuilder
        }
    });
    Object.defineProperty(i_, "ServerInterceptingCall", {
        enumerable: !0,
        get: function() {
            return Yb8.ServerInterceptingCall
        }
    });
    var d0Y = UT1();
    Object.defineProperty(i_, "ServerMetricRecorder", {
        enumerable: !0,
        get: function() {
            return d0Y.ServerMetricRecorder
        }
    });
    var c0Y = pI8();
    i_.experimental = c0Y;
    var l0Y = $I8(),
        i0Y = zp4(),
        n0Y = Jp4(),
        r0Y = Cd6(),
        o0Y = Gp4(),
        a0Y = yp4(),
        s0Y = Fp4(),
        t0Y = ae();
    (() => {
        l0Y.setup(), i0Y.setup(), n0Y.setup(), r0Y.setup(), o0Y.setup(), a0Y.setup(), s0Y.setup(), t0Y.setup()
    })()
})
// @from(Ln 318873, Col 4)
ip4 = x((cp4) => {
    Object.defineProperty(cp4, "__esModule", {
        value: !0
    });
    cp4.createServiceClientConstructor = void 0;
    var OWY = Bd6();

    function $WY(A, q) {
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
        return OWY.makeGenericClientConstructor(K, q)
    }
    cp4.createServiceClientConstructor = $WY
})
// @from(Ln 318904, Col 4)
gd6 = x((rp4) => {
    Object.defineProperty(rp4, "__esModule", {
        value: !0
    });
    rp4.createOtlpGrpcExporterTransport = rp4.GrpcExporterTransport = rp4.createEmptyMetadata = rp4.createSslCredentials = rp4.createInsecureCredentials = void 0;
    var HWY = Jb4(),
        np4 = `OTel-OTLP-Exporter-JavaScript/${HWY.VERSION}`;

    function jWY(A) {
        if (A) return `${A} ${np4}`;
        return np4
    }
    var JWY = 0,
        MWY = 2;

    function DWY(A) {
        return A === "gzip" ? MWY : JWY
    }

    function XWY() {
        let {
            credentials: A
        } = Bd6();
        return A.createInsecure()
    }
    rp4.createInsecureCredentials = XWY;

    function PWY(A, q, K) {
        let {
            credentials: Y
        } = Bd6();
        return Y.createSsl(A, q, K)
    }
    rp4.createSslCredentials = PWY;

    function WWY() {
        let {
            Metadata: A
        } = Bd6();
        return new A
    }
    rp4.createEmptyMetadata = WWY;
    class zb8 {
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
                } = ip4();
                try {
                    this._metadata = this._parameters.metadata()
                } catch (_) {
                    return Promise.resolve({
                        status: "failure",
                        error: _
                    })
                }
                let z = Y(this._parameters.grpcPath, this._parameters.grpcName);
                try {
                    this._client = new z(this._parameters.address, this._parameters.credentials(), {
                        "grpc.default_compression_algorithm": DWY(this._parameters.compression),
                        "grpc.primary_user_agent": jWY(this._parameters.userAgent)
                    })
                } catch (_) {
                    return Promise.resolve({
                        status: "failure",
                        error: _
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
                }, (_, w) => {
                    if (_) Y({
                        status: "failure",
                        error: _
                    });
                    else Y({
                        data: w,
                        status: "success"
                    })
                })
            })
        }
    }
    rp4.GrpcExporterTransport = zb8;

    function ZWY(A) {
        return new zb8(A)
    }
    rp4.createOtlpGrpcExporterTransport = ZWY
})
// @from(Ln 319011, Col 4)
KQ4 = x((AQ4) => {
    Object.defineProperty(AQ4, "__esModule", {
        value: !0
    });
    AQ4.getOtlpGrpcDefaultConfiguration = AQ4.mergeOtlpGrpcConfigurationWithDefaults = AQ4.validateAndNormalizeUrl = void 0;
    var tp4 = Pg(),
        Fd6 = gd6(),
        NWY = x6("url"),
        ap4 = yq();

    function ep4(A) {
        if (A = A.trim(), !A.match(/^([\w]{1,8}):\/\//)) A = `https://${A}`;
        let K = new NWY.URL(A);
        if (K.protocol === "unix:") return A;
        if (K.pathname && K.pathname !== "/") ap4.diag.warn("URL path should not be set when using grpc, the path part of the URL will be ignored.");
        if (K.protocol !== "" && !K.protocol?.match(/^(http)s?:$/)) ap4.diag.warn("URL protocol should be http(s)://. Using http://.");
        return K.host
    }
    AQ4.validateAndNormalizeUrl = ep4;

    function sp4(A, q) {
        for (let [K, Y] of Object.entries(q.getMap()))
            if (A.get(K).length < 1) A.set(K, Y)
    }

    function VWY(A, q, K) {
        let Y = A.url ?? q.url ?? K.url;
        return {
            ...(0, tp4.mergeOtlpSharedConfigurationWithDefaults)(A, q, K),
            metadata: () => {
                let z = K.metadata();
                return sp4(z, A.metadata?.().clone() ?? (0, Fd6.createEmptyMetadata)()), sp4(z, q.metadata?.() ?? (0, Fd6.createEmptyMetadata)()), z
            },
            url: ep4(Y),
            credentials: A.credentials ?? q.credentials?.(Y) ?? K.credentials(Y),
            userAgent: A.userAgent
        }
    }
    AQ4.mergeOtlpGrpcConfigurationWithDefaults = VWY;

    function kWY() {
        return {
            ...(0, tp4.getSharedConfigurationDefaults)(),
            metadata: () => (0, Fd6.createEmptyMetadata)(),
            url: "http://localhost:4317",
            credentials: (A) => {
                if (A.startsWith("http://")) return () => (0, Fd6.createInsecureCredentials)();
                else return () => (0, Fd6.createSslCredentials)()
            }
        }
    }
    AQ4.getOtlpGrpcDefaultConfiguration = kWY
})
// @from(Ln 319064, Col 4)
HQ4 = x((OQ4) => {
    Object.defineProperty(OQ4, "__esModule", {
        value: !0
    });
    OQ4.getOtlpGrpcConfigurationFromEnv = void 0;
    var YQ4 = K9(),
        pd6 = gd6(),
        LWY = Bc(),
        RWY = x6("fs"),
        hWY = x6("path"),
        _Q4 = yq();

    function _b8(A, q) {
        if (A != null && A !== "") return A;
        if (q != null && q !== "") return q;
        return
    }

    function SWY(A) {
        let q = process.env[`OTEL_EXPORTER_OTLP_${A}_HEADERS`]?.trim(),
            K = process.env.OTEL_EXPORTER_OTLP_HEADERS?.trim(),
            Y = (0, YQ4.parseKeyPairsIntoRecord)(q),
            z = (0, YQ4.parseKeyPairsIntoRecord)(K);
        if (Object.keys(Y).length === 0 && Object.keys(z).length === 0) return;
        let _ = Object.assign({}, z, Y),
            w = (0, pd6.createEmptyMetadata)();
        for (let [O, $] of Object.entries(_)) w.set(O, $);
        return w
    }

    function CWY(A) {
        let q = SWY(A);
        if (q == null) return;
        return () => q
    }

    function IWY(A) {
        let q = process.env[`OTEL_EXPORTER_OTLP_${A}_ENDPOINT`]?.trim(),
            K = process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.trim();
        return _b8(q, K)
    }

    function bWY(A) {
        let q = process.env[`OTEL_EXPORTER_OTLP_${A}_INSECURE`]?.toLowerCase().trim(),
            K = process.env.OTEL_EXPORTER_OTLP_INSECURE?.toLowerCase().trim();
        return _b8(q, K) === "true"
    }

    function wb8(A, q, K) {
        let Y = process.env[A]?.trim(),
            z = process.env[q]?.trim(),
            _ = _b8(Y, z);
        if (_ != null) try {
            return RWY.readFileSync(hWY.resolve(process.cwd(), _))
        } catch {
            _Q4.diag.warn(K);
            return
        } else return
    }

    function xWY(A) {
        return wb8(`OTEL_EXPORTER_OTLP_${A}_CLIENT_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE", "Failed to read client certificate chain file")
    }

    function uWY(A) {
        return wb8(`OTEL_EXPORTER_OTLP_${A}_CLIENT_KEY`, "OTEL_EXPORTER_OTLP_CLIENT_KEY", "Failed to read client certificate private key file")
    }

    function zQ4(A) {
        return wb8(`OTEL_EXPORTER_OTLP_${A}_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CERTIFICATE", "Failed to read root certificate file")
    }

    function wQ4(A) {
        let q = uWY(A),
            K = xWY(A),
            Y = zQ4(A),
            z = q != null && K != null;
        if (Y != null && !z) return _Q4.diag.warn("Client key and certificate must both be provided, but one was missing - attempting to create credentials from just the root certificate"), (0, pd6.createSslCredentials)(zQ4(A));
        return (0, pd6.createSslCredentials)(Y, q, K)
    }

    function mWY(A) {
        if (bWY(A)) return (0, pd6.createInsecureCredentials)();
        return wQ4(A)
    }

    function BWY(A) {
        return {
            ...(0, LWY.getSharedConfigurationFromEnvironment)(A),
            metadata: CWY(A),
            url: IWY(A),
            credentials: (q) => {
                if (q.startsWith("http://")) return () => {
                    return (0, pd6.createInsecureCredentials)()
                };
                else if (q.startsWith("https://")) return () => {
                    return wQ4(A)
                };
                return () => {
                    return mWY(A)
                }
            }
        }
    }
    OQ4.getOtlpGrpcConfigurationFromEnv = BWY
})
// @from(Ln 319170, Col 4)
DQ4 = x((JQ4) => {
    Object.defineProperty(JQ4, "__esModule", {
        value: !0
    });
    JQ4.convertLegacyOtlpGrpcOptions = void 0;
    var gWY = yq(),
        jQ4 = KQ4(),
        FWY = gd6(),
        pWY = HQ4();

    function QWY(A, q) {
        if (A.headers) gWY.diag.warn("Headers cannot be set when using grpc");
        let K = A.credentials;
        return (0, jQ4.mergeOtlpGrpcConfigurationWithDefaults)({
            url: A.url,
            metadata: () => {
                return A.metadata ?? (0, FWY.createEmptyMetadata)()
            },
            compression: A.compression,
            timeoutMillis: A.timeoutMillis,
            concurrencyLimit: A.concurrencyLimit,
            credentials: K != null ? () => K : void 0,
            userAgent: A.userAgent
        }, (0, pWY.getOtlpGrpcConfigurationFromEnv)(q), (0, jQ4.getOtlpGrpcDefaultConfiguration)())
    }
    JQ4.convertLegacyOtlpGrpcOptions = QWY
})
// @from(Ln 319197, Col 4)
WQ4 = x((XQ4) => {
    Object.defineProperty(XQ4, "__esModule", {
        value: !0
    });
    XQ4.createOtlpGrpcExportDelegate = void 0;
    var UWY = Pg(),
        dWY = gd6();

    function cWY(A, q, K, Y) {
        return (0, UWY.createOtlpNetworkExportDelegate)(A, q, (0, dWY.createOtlpGrpcExporterTransport)({
            address: A.url,
            compression: A.compression,
            credentials: A.credentials,
            metadata: A.metadata,
            userAgent: A.userAgent,
            grpcName: K,
            grpcPath: Y
        }))
    }
    XQ4.createOtlpGrpcExportDelegate = cWY
})
// @from(Ln 319218, Col 4)
_v1 = x((zv1) => {
    Object.defineProperty(zv1, "__esModule", {
        value: !0
    });
    zv1.createOtlpGrpcExportDelegate = zv1.convertLegacyOtlpGrpcOptions = void 0;
    var lWY = DQ4();
    Object.defineProperty(zv1, "convertLegacyOtlpGrpcOptions", {
        enumerable: !0,
        get: function() {
            return lWY.convertLegacyOtlpGrpcOptions
        }
    });
    var iWY = WQ4();
    Object.defineProperty(zv1, "createOtlpGrpcExportDelegate", {
        enumerable: !0,
        get: function() {
            return iWY.createOtlpGrpcExportDelegate
        }
    })
})
// @from(Ln 319238, Col 4)
vQ4 = x((fQ4) => {
    Object.defineProperty(fQ4, "__esModule", {
        value: !0
    });
    fQ4.OTLPMetricExporter = void 0;
    var rWY = ff1(),
        ZQ4 = _v1(),
        oWY = Gg();
    class GQ4 extends rWY.OTLPMetricExporterBase {
        constructor(A) {
            super((0, ZQ4.createOtlpGrpcExportDelegate)((0, ZQ4.convertLegacyOtlpGrpcOptions)(A ?? {}, "METRICS"), oWY.ProtobufMetricsSerializer, "MetricsExportService", "/opentelemetry.proto.collector.metrics.v1.MetricsService/Export"), A)
        }
    }
    fQ4.OTLPMetricExporter = GQ4
})
// @from(Ln 319253, Col 4)
NQ4 = x((Ob8) => {
    Object.defineProperty(Ob8, "__esModule", {
        value: !0
    });
    Ob8.OTLPMetricExporter = void 0;
    var aWY = vQ4();
    Object.defineProperty(Ob8, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return aWY.OTLPMetricExporter
        }
    })
})
// @from(Ln 319266, Col 4)
LQ4 = x((EQ4) => {
    Object.defineProperty(EQ4, "__esModule", {
        value: !0
    });
    EQ4.OTLPLogExporter = void 0;
    var VQ4 = _v1(),
        tWY = Gg(),
        eWY = Pg();
    class kQ4 extends eWY.OTLPExporterBase {
        constructor(A = {}) {
            super((0, VQ4.createOtlpGrpcExportDelegate)((0, VQ4.convertLegacyOtlpGrpcOptions)(A, "LOGS"), tWY.ProtobufLogsSerializer, "LogsExportService", "/opentelemetry.proto.collector.logs.v1.LogsService/Export"))
        }
    }
    EQ4.OTLPLogExporter = kQ4
})
// @from(Ln 319281, Col 4)
RQ4 = x(($b8) => {
    Object.defineProperty($b8, "__esModule", {
        value: !0
    });
    $b8.OTLPLogExporter = void 0;
    var AZY = LQ4();
    Object.defineProperty($b8, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return AZY.OTLPLogExporter
        }
    })
})
// @from(Ln 319294, Col 4)
bQ4 = x((CQ4) => {
    Object.defineProperty(CQ4, "__esModule", {
        value: !0
    });
    CQ4.OTLPTraceExporter = void 0;
    var hQ4 = _v1(),
        KZY = Gg(),
        YZY = Pg();
    class SQ4 extends YZY.OTLPExporterBase {
        constructor(A = {}) {
            super((0, hQ4.createOtlpGrpcExportDelegate)((0, hQ4.convertLegacyOtlpGrpcOptions)(A, "TRACES"), KZY.ProtobufTraceSerializer, "TraceExportService", "/opentelemetry.proto.collector.trace.v1.TraceService/Export"))
        }
    }
    CQ4.OTLPTraceExporter = SQ4
})
// @from(Ln 319309, Col 4)
xQ4 = x((Hb8) => {
    Object.defineProperty(Hb8, "__esModule", {
        value: !0
    });
    Hb8.OTLPTraceExporter = void 0;
    var zZY = bQ4();
    Object.defineProperty(Hb8, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return zZY.OTLPTraceExporter
        }
    })
})
// @from(Ln 319322, Col 4)
Zb8 = {}
// @from(Ln 319330, Col 0)
function Jb8(A, q) {
    A(new Pb8(q))
}
// @from(Ln 319334, Col 0)
function UQ4() {
    if (!process.env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE) process.env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE = "delta"
}
// @from(Ln 319337, Col 0)
async function OZY() {
    let A = (process.env.OTEL_METRICS_EXPORTER || "").trim().split(",").filter(Boolean),
        q = parseInt(process.env.OTEL_METRIC_EXPORT_INTERVAL || wZY.toString()),
        K = [];
    for (let Y of A)
        if (Y === "console") {
            let z = new Ud6.ConsoleMetricExporter,
                _ = z.export.bind(z);
            z.export = (w, O) => {
                if (w.resource && w.resource.attributes) k(`
=== Resource Attributes ===`), k(B6(w.resource.attributes)), k(`===========================
`);
                return _(w, O)
            }, K.push(z)
        } else if (Y === "otlp") {
        let z = process.env.OTEL_EXPORTER_OTLP_METRICS_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
            _ = Wb8();
        switch (z) {
            case "grpc": {
                let {
                    OTLPMetricExporter: w
                } = await Promise.resolve().then(() => t(NQ4(), 1));
                K.push(new w);
                break
            }
            case "http/json":
                K.push(new mQ4.OTLPMetricExporter(_));
                break;
            case "http/protobuf":
                K.push(new uQ4.OTLPMetricExporter(_));
                break;
            default:
                throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_METRICS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${z}`)
        }
    } else if (Y === "prometheus") K.push(new BQ4.PrometheusExporter);
    else throw Error(`Unknown exporter type set in OTEL_EXPORTER_OTLP_METRICS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${Y}`);
    return K.map((Y) => {
        if ("export" in Y) return new Mb8.PeriodicExportingMetricReader({
            exporter: Y,
            exportIntervalMillis: q
        });
        return Y
    })
}
// @from(Ln 319381, Col 0)
async function $ZY() {
    let A = (process.env.OTEL_LOGS_EXPORTER || "").trim().split(",").filter(Boolean),
        q = process.env.OTEL_EXPORTER_OTLP_LOGS_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
        K = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    k(`[3P telemetry] getOtlpLogExporters: types=${B6(A)}, protocol=${q}, endpoint=${K}`);
    let Y = [];
    for (let z of A)
        if (z === "console") Y.push(new Y66.ConsoleLogRecordExporter);
        else if (z === "otlp") {
        let _ = Wb8();
        switch (q) {
            case "grpc": {
                let {
                    OTLPLogExporter: w
                } = await Promise.resolve().then(() => t(RQ4(), 1));
                Y.push(new w);
                break
            }
            case "http/json":
                Y.push(new Db8.OTLPLogExporter(_));
                break;
            case "http/protobuf":
                Y.push(new gQ4.OTLPLogExporter(_));
                break;
            default:
                throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_LOGS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${q}`)
        }
    } else throw Error(`Unknown exporter type set in OTEL_LOGS_EXPORTER env var: ${z}`);
    return Y
}
// @from(Ln 319411, Col 0)
async function HZY() {
    let A = (process.env.OTEL_TRACES_EXPORTER || "").trim().split(",").filter(Boolean),
        q = [];
    for (let K of A)
        if (K === "console") q.push(new z66.ConsoleSpanExporter);
        else if (K === "otlp") {
        let Y = process.env.OTEL_EXPORTER_OTLP_TRACES_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
            z = Wb8();
        switch (Y) {
            case "grpc": {
                let {
                    OTLPTraceExporter: _
                } = await Promise.resolve().then(() => t(xQ4(), 1));
                q.push(new _);
                break
            }
            case "http/json":
                q.push(new Xb8.OTLPTraceExporter(z));
                break;
            case "http/protobuf":
                q.push(new FQ4.OTLPTraceExporter(z));
                break;
            default:
                throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_TRACES_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${Y}`)
        }
    } else throw Error(`Unknown exporter type set in OTEL_TRACES_EXPORTER env var: ${K}`);
    return q
}
// @from(Ln 319440, Col 0)
function dQ4() {
    return t6(process.env.CLAUDE_CODE_ENABLE_TELEMETRY)
}
// @from(Ln 319444, Col 0)
function jZY() {
    let A = new yS8;
    return new Mb8.PeriodicExportingMetricReader({
        exporter: A,
        exportIntervalMillis: 300000
    })
}
// @from(Ln 319452, Col 0)
function JZY() {
    let A = CK(),
        q = iA() && (A === "enterprise" || A === "team");
    return fb8() || q
}
// @from(Ln 319458, Col 0)
function MZY(A) {
    let q = process.env.BETA_TRACING_ENDPOINT;
    if (!q) return;
    let K = {
            url: `${q}/v1/traces`
        },
        Y = {
            url: `${q}/v1/logs`
        },
        z = new Xb8.OTLPTraceExporter(K),
        _ = new z66.BatchSpanProcessor(z, {
            scheduledDelayMillis: QQ4
        }),
        w = new z66.BasicTracerProvider({
            resource: A,
            spanProcessors: [_]
        });
    kY6.trace.setGlobalTracerProvider(w), Vt6(w);
    let O = new Db8.OTLPLogExporter(Y),
        $ = new Y66.LoggerProvider({
            resource: A,
            processors: [new Y66.BatchLogRecordProcessor(O, {
                scheduledDelayMillis: pQ4
            })]
        });
    Qd6.logs.setGlobalLoggerProvider($), Tt6($);
    let H = Qd6.logs.getLogger("com.anthropic.claude_code.events", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.VERSION);
    vt6(H), process.on("beforeExit", async () => {
        await $?.forceFlush(), await w?.forceFlush()
    }), process.on("exit", () => {
        $?.forceFlush(), w?.forceFlush()
    })
}
// @from(Ln 319498, Col 0)
async function DZY() {
    Zq("telemetry_init_start"), UQ4(), kY6.diag.setLogger(new kS8, kY6.DiagLogLevel.ERROR), mz4();
    let A = [],
        q = dQ4();
    if (k(`[3P telemetry] isTelemetryEnabled=${q} (CLAUDE_CODE_ENABLE_TELEMETRY=${process.env.CLAUDE_CODE_ENABLE_TELEMETRY})`), q) A.push(...await OZY());
    if (JZY()) A.push(jZY());
    let K = y8(),
        Y = {
            [K66.ATTR_SERVICE_NAME]: "claude-code",
            [K66.ATTR_SERVICE_VERSION]: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.VERSION
        };
    if (K === "wsl") {
        let D = sA6();
        if (D) Y["wsl.version"] = D
    }
    let z = Xb.resourceFromAttributes(Y),
        _ = Xb.resourceFromAttributes(Xb.osDetector.detect().attributes || {}),
        w = Xb.hostDetector.detect(),
        O = w.attributes?.[K66.SEMRESATTRS_HOST_ARCH] ? {
            [K66.SEMRESATTRS_HOST_ARCH]: w.attributes[K66.SEMRESATTRS_HOST_ARCH]
        } : {},
        $ = Xb.resourceFromAttributes(O),
        H = Xb.resourceFromAttributes(Xb.envDetector.detect().attributes || {}),
        j = z.merge(_).merge($).merge(H);
    if (a$()) {
        MZY(j);
        let D = new Ud6.MeterProvider({
            resource: j,
            views: [],
            readers: A
        });
        return Nt6(D), E4(async () => {
            let P = parseInt(process.env.CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS || "2000");
            try {
                mp6();
                let W = gk6(),
                    Z = a86(),
                    G = [D.shutdown()];
                if (W) G.push(W.forceFlush().then(() => W.shutdown()));
                if (Z) G.push(Z.forceFlush().then(() => Z.shutdown()));
                await Promise.race([Promise.all(G), new Promise((f, v) => setTimeout(Jb8, P, v, "OpenTelemetry shutdown timeout").unref())])
            } catch {}
        }), D.getMeter("com.anthropic.claude_code", {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.76",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-03-14T00:12:49Z"
        }.VERSION)
    }
    let J = new Ud6.MeterProvider({
        resource: j,
        views: [],
        readers: A
    });
    if (Nt6(J), q) {
        let D = await $ZY();
        if (k(`[3P telemetry] Created ${D.length} log exporter(s)`), D.length > 0) {
            let X = new Y66.LoggerProvider({
                resource: j,
                processors: D.map((W) => new Y66.BatchLogRecordProcessor(W, {
                    scheduledDelayMillis: parseInt(process.env.OTEL_LOGS_EXPORT_INTERVAL || pQ4.toString())
                }))
            });
            Qd6.logs.setGlobalLoggerProvider(X), Tt6(X);
            let P = Qd6.logs.getLogger("com.anthropic.claude_code.events", {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.VERSION);
            vt6(P), k("[3P telemetry] Event logger set successfully"), process.on("beforeExit", async () => {
                await X?.forceFlush(), await a86()?.forceFlush()
            }), process.on("exit", () => {
                X?.forceFlush(), a86()?.forceFlush()
            })
        }
    }
    if (q && $k8()) {
        let D = await HZY();
        if (D.length > 0) {
            let X = D.map((W) => new z66.BatchSpanProcessor(W, {
                    scheduledDelayMillis: parseInt(process.env.OTEL_TRACES_EXPORT_INTERVAL || QQ4.toString())
                })),
                P = new z66.BasicTracerProvider({
                    resource: j,
                    spanProcessors: X
                });
            kY6.trace.setGlobalTracerProvider(P), Vt6(P)
        }
    }
    return E4(async () => {
        let D = parseInt(process.env.CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS || "2000");
        try {
            mp6();
            let X = [J.shutdown()],
                P = gk6();
            if (P) X.push(P.shutdown());
            let W = a86();
            if (W) X.push(W.shutdown());
            await Promise.race([Promise.all(X), new Promise((Z, G) => setTimeout(Jb8, D, G, "OpenTelemetry shutdown timeout"))])
        } catch (X) {
            if (X instanceof Error && X.message.includes("timeout")) k(`
OpenTelemetry telemetry flush timed out after ${D}ms

To resolve this issue, you can:
1. Increase the timeout by setting CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS env var (e.g., 5000 for 5 seconds)
2. Check if your OpenTelemetry backend is experiencing scalability issues
3. Disable OpenTelemetry by unsetting CLAUDE_CODE_ENABLE_TELEMETRY env var

Current timeout: ${D}ms
`, {
                level: "error"
            });
            throw X
        }
    }), J.getMeter("com.anthropic.claude_code", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.VERSION)
}