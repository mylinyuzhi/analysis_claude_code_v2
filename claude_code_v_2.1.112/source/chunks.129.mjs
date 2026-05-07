
// @from(Ln 321502, Col 4)
yq8 = p((hKK) => {
    Object.defineProperty(hKK, "__esModule", {
        value: !0
    });
    hKK.LeafLoadBalancer = hKK.PickFirstLoadBalancer = hKK.PickFirstLoadBalancingConfig = void 0;
    hKK.shuffled = EKK;
    hKK.setup = hcz;
    var f67 = y36(),
        EM = ik(),
        p36 = Mt(),
        TKK = by(),
        Tcz = o2(),
        Vcz = e_(),
        VKK = by(),
        kKK = d6("net"),
        kcz = nJ6(),
        Ncz = "pick_first";

    function Nq8(q) {
        Tcz.trace(Vcz.LogVerbosity.DEBUG, Ncz, q)
    }
    var Eq8 = "pick_first",
        Ecz = 250;
    class US6 {
        constructor(q) {
            this.shuffleAddressList = q
        }
        getLoadBalancerName() {
            return Eq8
        }
        toJsonObject() {
            return {
                [Eq8]: {
                    shuffleAddressList: this.shuffleAddressList
                }
            }
        }
        getShuffleAddressList() {
            return this.shuffleAddressList
        }
        static createFromJson(q) {
            if ("shuffleAddressList" in q && typeof q.shuffleAddressList !== "boolean") throw Error("pick_first config field shuffleAddressList must be a boolean if provided");
            return new US6(q.shuffleAddressList === !0)
        }
    }
    hKK.PickFirstLoadBalancingConfig = US6;
    class NKK {
        constructor(q) {
            this.subchannel = q
        }
        pick(q) {
            return {
                pickResultType: p36.PickResultType.COMPLETE,
                subchannel: this.subchannel,
                status: null,
                onCallStarted: null,
                onCallEnded: null
            }
        }
    }

    function EKK(q) {
        let K = q.slice();
        for (let _ = K.length - 1; _ > 1; _--) {
            let z = Math.floor(Math.random() * (_ + 1)),
                Y = K[_];
            K[_] = K[z], K[z] = Y
        }
        return K
    }

    function ycz(q) {
        if (q.length === 0) return [];
        let K = [],
            _ = [],
            z = [],
            Y = (0, VKK.isTcpSubchannelAddress)(q[0]) && (0, kKK.isIPv6)(q[0].host);
        for (let w of q)
            if ((0, VKK.isTcpSubchannelAddress)(w) && (0, kKK.isIPv6)(w.host)) _.push(w);
            else z.push(w);
        let A = Y ? _ : z,
            O = Y ? z : _;
        for (let w = 0; w < Math.max(A.length, O.length); w++) {
            if (w < A.length) K.push(A[w]);
            if (w < O.length) K.push(O[w])
        }
        return K
    }
    var yKK = "grpc-node.internal.pick-first.report_health_status";
    class dB8 {
        constructor(q) {
            this.channelControlHelper = q, this.children = [], this.currentState = EM.ConnectivityState.IDLE, this.currentSubchannelIndex = 0, this.currentPick = null, this.subchannelStateListener = (K, _, z, Y, A) => {
                this.onSubchannelStateUpdate(K, _, z, A)
            }, this.pickedSubchannelHealthListener = () => this.calculateAndReportNewState(), this.stickyTransientFailureMode = !1, this.reportHealthStatus = !1, this.lastError = null, this.latestAddressList = null, this.latestOptions = {}, this.latestResolutionNote = "", this.connectionDelayTimeout = setTimeout(() => {}, 0), clearTimeout(this.connectionDelayTimeout)
        }
        allChildrenHaveReportedTF() {
            return this.children.every((q) => q.hasReportedTransientFailure)
        }
        resetChildrenReportedTF() {
            this.children.every((q) => q.hasReportedTransientFailure = !1)
        }
        calculateAndReportNewState() {
            var q;
            if (this.currentPick)
                if (this.reportHealthStatus && !this.currentPick.isHealthy()) {
                    let K = `Picked subchannel ${this.currentPick.getAddress()} is unhealthy`;
                    this.updateState(EM.ConnectivityState.TRANSIENT_FAILURE, new p36.UnavailablePicker({
                        details: K
                    }), K)
                } else this.updateState(EM.ConnectivityState.READY, new NKK(this.currentPick), null);
            else if (((q = this.latestAddressList) === null || q === void 0 ? void 0 : q.length) === 0) {
                let K = `No connection established. Last error: ${this.lastError}. Resolution note: ${this.latestResolutionNote}`;
                this.updateState(EM.ConnectivityState.TRANSIENT_FAILURE, new p36.UnavailablePicker({
                    details: K
                }), K)
            } else if (this.children.length === 0) this.updateState(EM.ConnectivityState.IDLE, new p36.QueuePicker(this), null);
            else if (this.stickyTransientFailureMode) {
                let K = `No connection established. Last error: ${this.lastError}. Resolution note: ${this.latestResolutionNote}`;
                this.updateState(EM.ConnectivityState.TRANSIENT_FAILURE, new p36.UnavailablePicker({
                    details: K
                }), K)
            } else this.updateState(EM.ConnectivityState.CONNECTING, new p36.QueuePicker(this), null)
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
                    subchannel: q
                }
                of this.children) q.startConnecting();
            this.calculateAndReportNewState()
        }
        removeCurrentPick() {
            if (this.currentPick !== null) this.currentPick.removeConnectivityStateListener(this.subchannelStateListener), this.channelControlHelper.removeChannelzChild(this.currentPick.getChannelzRef()), this.currentPick.removeHealthStateWatcher(this.pickedSubchannelHealthListener), this.currentPick.unref(), this.currentPick = null
        }
        onSubchannelStateUpdate(q, K, _, z) {
            var Y;
            if ((Y = this.currentPick) === null || Y === void 0 ? void 0 : Y.realSubchannelEquals(q)) {
                if (_ !== EM.ConnectivityState.READY) this.removeCurrentPick(), this.calculateAndReportNewState();
                return
            }
            for (let [A, O] of this.children.entries())
                if (q.realSubchannelEquals(O.subchannel)) {
                    if (_ === EM.ConnectivityState.READY) this.pickSubchannel(O.subchannel);
                    if (_ === EM.ConnectivityState.TRANSIENT_FAILURE) {
                        if (O.hasReportedTransientFailure = !0, z) this.lastError = z;
                        if (this.maybeEnterStickyTransientFailureMode(), A === this.currentSubchannelIndex) this.startNextSubchannelConnecting(A + 1)
                    }
                    O.subchannel.startConnecting();
                    return
                }
        }
        startNextSubchannelConnecting(q) {
            clearTimeout(this.connectionDelayTimeout);
            for (let [K, _] of this.children.entries())
                if (K >= q) {
                    let z = _.subchannel.getConnectivityState();
                    if (z === EM.ConnectivityState.IDLE || z === EM.ConnectivityState.CONNECTING) {
                        this.startConnecting(K);
                        return
                    }
                } this.maybeEnterStickyTransientFailureMode()
        }
        startConnecting(q) {
            var K, _;
            if (clearTimeout(this.connectionDelayTimeout), this.currentSubchannelIndex = q, this.children[q].subchannel.getConnectivityState() === EM.ConnectivityState.IDLE) Nq8("Start connecting to subchannel with address " + this.children[q].subchannel.getAddress()), process.nextTick(() => {
                var z;
                (z = this.children[q]) === null || z === void 0 || z.subchannel.startConnecting()
            });
            this.connectionDelayTimeout = setTimeout(() => {
                this.startNextSubchannelConnecting(q + 1)
            }, Ecz), (_ = (K = this.connectionDelayTimeout).unref) === null || _ === void 0 || _.call(K)
        }
        pickSubchannel(q) {
            Nq8("Pick subchannel with address " + q.getAddress()), this.stickyTransientFailureMode = !1, q.ref(), this.channelControlHelper.addChannelzChild(q.getChannelzRef()), this.removeCurrentPick(), this.resetSubchannelList(), q.addConnectivityStateListener(this.subchannelStateListener), q.addHealthStateWatcher(this.pickedSubchannelHealthListener), this.currentPick = q, clearTimeout(this.connectionDelayTimeout), this.calculateAndReportNewState()
        }
        updateState(q, K, _) {
            Nq8(EM.ConnectivityState[this.currentState] + " -> " + EM.ConnectivityState[q]), this.currentState = q, this.channelControlHelper.updateState(q, K, _)
        }
        resetSubchannelList() {
            for (let q of this.children) q.subchannel.removeConnectivityStateListener(this.subchannelStateListener), q.subchannel.unref(), this.channelControlHelper.removeChannelzChild(q.subchannel.getChannelzRef());
            this.currentSubchannelIndex = 0, this.children = []
        }
        connectToAddressList(q, K) {
            Nq8("connectToAddressList([" + q.map((z) => (0, TKK.subchannelAddressToString)(z)) + "])");
            let _ = q.map((z) => ({
                subchannel: this.channelControlHelper.createSubchannel(z, K),
                hasReportedTransientFailure: !1
            }));
            for (let {
                    subchannel: z
                }
                of _)
                if (z.getConnectivityState() === EM.ConnectivityState.READY) {
                    this.pickSubchannel(z);
                    return
                } for (let {
                    subchannel: z
                }
                of _) z.ref(), this.channelControlHelper.addChannelzChild(z.getChannelzRef());
            this.resetSubchannelList(), this.children = _;
            for (let {
                    subchannel: z
                }
                of this.children) z.addConnectivityStateListener(this.subchannelStateListener);
            for (let z of this.children)
                if (z.subchannel.getConnectivityState() === EM.ConnectivityState.TRANSIENT_FAILURE) z.hasReportedTransientFailure = !0;
            this.startNextSubchannelConnecting(0), this.calculateAndReportNewState()
        }
        updateAddressList(q, K, _, z) {
            if (!(K instanceof US6)) return !1;
            if (!q.ok) {
                if (this.children.length === 0 && this.currentPick === null) this.channelControlHelper.updateState(EM.ConnectivityState.TRANSIENT_FAILURE, new p36.UnavailablePicker(q.error), q.error.details);
                return !0
            }
            let Y = q.value;
            if (this.reportHealthStatus = _[yKK], K.getShuffleAddressList()) Y = EKK(Y);
            let A = [].concat(...Y.map((w) => w.addresses));
            Nq8("updateAddressList([" + A.map((w) => (0, TKK.subchannelAddressToString)(w)) + "])");
            let O = ycz(A);
            if (this.latestAddressList = O, this.latestOptions = _, this.connectToAddressList(O, _), this.latestResolutionNote = z, A.length > 0) return !0;
            else return this.lastError = "No addresses resolved", !1
        }
        exitIdle() {
            if (this.currentState === EM.ConnectivityState.IDLE && this.latestAddressList) this.connectToAddressList(this.latestAddressList, this.latestOptions)
        }
        resetBackoff() {}
        destroy() {
            this.resetSubchannelList(), this.removeCurrentPick()
        }
        getTypeName() {
            return Eq8
        }
    }
    hKK.PickFirstLoadBalancer = dB8;
    var Lcz = new US6(!1);
    class LKK {
        constructor(q, K, _, z) {
            this.endpoint = q, this.options = _, this.resolutionNote = z, this.latestState = EM.ConnectivityState.IDLE;
            let Y = (0, f67.createChildChannelControlHelper)(K, {
                updateState: (A, O, w) => {
                    this.latestState = A, this.latestPicker = O, K.updateState(A, O, w)
                }
            });
            this.pickFirstBalancer = new dB8(Y), this.latestPicker = new p36.QueuePicker(this.pickFirstBalancer)
        }
        startConnecting() {
            this.pickFirstBalancer.updateAddressList((0, kcz.statusOrFromValue)([this.endpoint]), Lcz, Object.assign(Object.assign({}, this.options), {
                [yKK]: !0
            }), this.resolutionNote)
        }
        updateEndpoint(q, K) {
            if (this.options = K, this.endpoint = q, this.latestState !== EM.ConnectivityState.IDLE) this.startConnecting()
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
    hKK.LeafLoadBalancer = LKK;

    function hcz() {
        (0, f67.registerLoadBalancerType)(Eq8, dB8, US6), (0, f67.registerDefaultLoadBalancerType)(Eq8)
    }
})
// @from(Ln 321785, Col 4)
IKK = p((CKK) => {
    Object.defineProperty(CKK, "__esModule", {
        value: !0
    });
    CKK.FileWatcherCertificateProvider = void 0;
    var Icz = d6("fs"),
        xcz = o2(),
        ucz = e_(),
        mcz = d6("util"),
        Bcz = "certificate_provider";

    function cB8(q) {
        xcz.trace(ucz.LogVerbosity.DEBUG, Bcz, q)
    }
    var G67 = (0, mcz.promisify)(Icz.readFile);
    class SKK {
        constructor(q) {
            if (this.config = q, this.refreshTimer = null, this.fileResultPromise = null, this.latestCaUpdate = void 0, this.caListeners = new Set, this.latestIdentityUpdate = void 0, this.identityListeners = new Set, this.lastUpdateTime = null, q.certificateFile === void 0 !== (q.privateKeyFile === void 0)) throw Error("certificateFile and privateKeyFile must be set or unset together");
            if (q.certificateFile === void 0 && q.caCertificateFile === void 0) throw Error("At least one of certificateFile and caCertificateFile must be set");
            cB8("File watcher constructed with config " + JSON.stringify(q))
        }
        updateCertificates() {
            if (this.fileResultPromise) return;
            this.fileResultPromise = Promise.allSettled([this.config.certificateFile ? G67(this.config.certificateFile) : Promise.reject(), this.config.privateKeyFile ? G67(this.config.privateKeyFile) : Promise.reject(), this.config.caCertificateFile ? G67(this.config.caCertificateFile) : Promise.reject()]), this.fileResultPromise.then(([q, K, _]) => {
                if (!this.refreshTimer) return;
                if (cB8("File watcher read certificates certificate " + q.status + ", privateKey " + K.status + ", CA certificate " + _.status), this.lastUpdateTime = new Date, this.fileResultPromise = null, q.status === "fulfilled" && K.status === "fulfilled") this.latestIdentityUpdate = {
                    certificate: q.value,
                    privateKey: K.value
                };
                else this.latestIdentityUpdate = null;
                if (_.status === "fulfilled") this.latestCaUpdate = {
                    caCertificate: _.value
                };
                else this.latestCaUpdate = null;
                for (let z of this.identityListeners) z(this.latestIdentityUpdate);
                for (let z of this.caListeners) z(this.latestCaUpdate)
            }), cB8("File watcher initiated certificate update")
        }
        maybeStartWatchingFiles() {
            if (!this.refreshTimer) {
                let q = this.lastUpdateTime ? new Date().getTime() - this.lastUpdateTime.getTime() : 1 / 0;
                if (q > this.config.refreshIntervalMs) this.updateCertificates();
                if (q > this.config.refreshIntervalMs * 2) this.latestCaUpdate = void 0, this.latestIdentityUpdate = void 0;
                this.refreshTimer = setInterval(() => this.updateCertificates(), this.config.refreshIntervalMs), cB8("File watcher started watching")
            }
        }
        maybeStopWatchingFiles() {
            if (this.caListeners.size === 0 && this.identityListeners.size === 0) {
                if (this.fileResultPromise = null, this.refreshTimer) clearInterval(this.refreshTimer), this.refreshTimer = null
            }
        }
        addCaCertificateListener(q) {
            if (this.caListeners.add(q), this.maybeStartWatchingFiles(), this.latestCaUpdate !== void 0) process.nextTick(q, this.latestCaUpdate)
        }
        removeCaCertificateListener(q) {
            this.caListeners.delete(q), this.maybeStopWatchingFiles()
        }
        addIdentityCertificateListener(q) {
            if (this.identityListeners.add(q), this.maybeStartWatchingFiles(), this.latestIdentityUpdate !== void 0) process.nextTick(q, this.latestIdentityUpdate)
        }
        removeIdentityCertificateListener(q) {
            this.identityListeners.delete(q), this.maybeStopWatchingFiles()
        }
    }
    CKK.FileWatcherCertificateProvider = SKK
})
// @from(Ln 321851, Col 4)
V67 = p((Fz) => {
    Object.defineProperty(Fz, "__esModule", {
        value: !0
    });
    Fz.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = Fz.createCertificateProviderChannelCredentials = Fz.FileWatcherCertificateProvider = Fz.createCertificateProviderServerCredentials = Fz.createServerCredentialsWithInterceptors = Fz.BaseSubchannelWrapper = Fz.registerAdminService = Fz.FilterStackFactory = Fz.BaseFilter = Fz.statusOrFromError = Fz.statusOrFromValue = Fz.PickResultType = Fz.QueuePicker = Fz.UnavailablePicker = Fz.ChildLoadBalancerHandler = Fz.EndpointMap = Fz.endpointHasAddress = Fz.endpointToString = Fz.subchannelAddressToString = Fz.LeafLoadBalancer = Fz.isLoadBalancerNameRegistered = Fz.parseLoadBalancingConfig = Fz.selectLbConfigFromList = Fz.registerLoadBalancerType = Fz.createChildChannelControlHelper = Fz.BackoffTimeout = Fz.parseDuration = Fz.durationToMs = Fz.splitHostPort = Fz.uriToString = Fz.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = Fz.createResolver = Fz.registerResolver = Fz.log = Fz.trace = void 0;
    var xKK = o2();
    Object.defineProperty(Fz, "trace", {
        enumerable: !0,
        get: function() {
            return xKK.trace
        }
    });
    Object.defineProperty(Fz, "log", {
        enumerable: !0,
        get: function() {
            return xKK.log
        }
    });
    var v67 = GF();
    Object.defineProperty(Fz, "registerResolver", {
        enumerable: !0,
        get: function() {
            return v67.registerResolver
        }
    });
    Object.defineProperty(Fz, "createResolver", {
        enumerable: !0,
        get: function() {
            return v67.createResolver
        }
    });
    Object.defineProperty(Fz, "CHANNEL_ARGS_CONFIG_SELECTOR_KEY", {
        enumerable: !0,
        get: function() {
            return v67.CHANNEL_ARGS_CONFIG_SELECTOR_KEY
        }
    });
    var uKK = nk();
    Object.defineProperty(Fz, "uriToString", {
        enumerable: !0,
        get: function() {
            return uKK.uriToString
        }
    });
    Object.defineProperty(Fz, "splitHostPort", {
        enumerable: !0,
        get: function() {
            return uKK.splitHostPort
        }
    });
    var mKK = kq8();
    Object.defineProperty(Fz, "durationToMs", {
        enumerable: !0,
        get: function() {
            return mKK.durationToMs
        }
    });
    Object.defineProperty(Fz, "parseDuration", {
        enumerable: !0,
        get: function() {
            return mKK.parseDuration
        }
    });
    var pcz = ZS6();
    Object.defineProperty(Fz, "BackoffTimeout", {
        enumerable: !0,
        get: function() {
            return pcz.BackoffTimeout
        }
    });
    var Lq8 = y36();
    Object.defineProperty(Fz, "createChildChannelControlHelper", {
        enumerable: !0,
        get: function() {
            return Lq8.createChildChannelControlHelper
        }
    });
    Object.defineProperty(Fz, "registerLoadBalancerType", {
        enumerable: !0,
        get: function() {
            return Lq8.registerLoadBalancerType
        }
    });
    Object.defineProperty(Fz, "selectLbConfigFromList", {
        enumerable: !0,
        get: function() {
            return Lq8.selectLbConfigFromList
        }
    });
    Object.defineProperty(Fz, "parseLoadBalancingConfig", {
        enumerable: !0,
        get: function() {
            return Lq8.parseLoadBalancingConfig
        }
    });
    Object.defineProperty(Fz, "isLoadBalancerNameRegistered", {
        enumerable: !0,
        get: function() {
            return Lq8.isLoadBalancerNameRegistered
        }
    });
    var Fcz = yq8();
    Object.defineProperty(Fz, "LeafLoadBalancer", {
        enumerable: !0,
        get: function() {
            return Fcz.LeafLoadBalancer
        }
    });
    var lB8 = by();
    Object.defineProperty(Fz, "subchannelAddressToString", {
        enumerable: !0,
        get: function() {
            return lB8.subchannelAddressToString
        }
    });
    Object.defineProperty(Fz, "endpointToString", {
        enumerable: !0,
        get: function() {
            return lB8.endpointToString
        }
    });
    Object.defineProperty(Fz, "endpointHasAddress", {
        enumerable: !0,
        get: function() {
            return lB8.endpointHasAddress
        }
    });
    Object.defineProperty(Fz, "EndpointMap", {
        enumerable: !0,
        get: function() {
            return lB8.EndpointMap
        }
    });
    var gcz = dm8();
    Object.defineProperty(Fz, "ChildLoadBalancerHandler", {
        enumerable: !0,
        get: function() {
            return gcz.ChildLoadBalancerHandler
        }
    });
    var T67 = Mt();
    Object.defineProperty(Fz, "UnavailablePicker", {
        enumerable: !0,
        get: function() {
            return T67.UnavailablePicker
        }
    });
    Object.defineProperty(Fz, "QueuePicker", {
        enumerable: !0,
        get: function() {
            return T67.QueuePicker
        }
    });
    Object.defineProperty(Fz, "PickResultType", {
        enumerable: !0,
        get: function() {
            return T67.PickResultType
        }
    });
    var BKK = nJ6();
    Object.defineProperty(Fz, "statusOrFromValue", {
        enumerable: !0,
        get: function() {
            return BKK.statusOrFromValue
        }
    });
    Object.defineProperty(Fz, "statusOrFromError", {
        enumerable: !0,
        get: function() {
            return BKK.statusOrFromError
        }
    });
    var Ucz = xe1();
    Object.defineProperty(Fz, "BaseFilter", {
        enumerable: !0,
        get: function() {
            return Ucz.BaseFilter
        }
    });
    var Qcz = NB8();
    Object.defineProperty(Fz, "FilterStackFactory", {
        enumerable: !0,
        get: function() {
            return Qcz.FilterStackFactory
        }
    });
    var dcz = lm8();
    Object.defineProperty(Fz, "registerAdminService", {
        enumerable: !0,
        get: function() {
            return dcz.registerAdminService
        }
    });
    var ccz = Tq8();
    Object.defineProperty(Fz, "BaseSubchannelWrapper", {
        enumerable: !0,
        get: function() {
            return ccz.BaseSubchannelWrapper
        }
    });
    var pKK = BB8();
    Object.defineProperty(Fz, "createServerCredentialsWithInterceptors", {
        enumerable: !0,
        get: function() {
            return pKK.createServerCredentialsWithInterceptors
        }
    });
    Object.defineProperty(Fz, "createCertificateProviderServerCredentials", {
        enumerable: !0,
        get: function() {
            return pKK.createCertificateProviderServerCredentials
        }
    });
    var lcz = IKK();
    Object.defineProperty(Fz, "FileWatcherCertificateProvider", {
        enumerable: !0,
        get: function() {
            return lcz.FileWatcherCertificateProvider
        }
    });
    var ncz = DS6();
    Object.defineProperty(Fz, "createCertificateProviderChannelCredentials", {
        enumerable: !0,
        get: function() {
            return ncz.createCertificateProviderChannelCredentials
        }
    });
    var icz = K67();
    Object.defineProperty(Fz, "SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX", {
        enumerable: !0,
        get: function() {
            return icz.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX
        }
    })
})
// @from(Ln 322086, Col 4)
UKK = p((gKK) => {
    Object.defineProperty(gKK, "__esModule", {
        value: !0
    });
    gKK.setup = scz;
    var ocz = GF(),
        acz = nJ6();
    class FKK {
        constructor(q, K, _) {
            this.listener = K, this.hasReturnedResult = !1, this.endpoints = [];
            let z;
            if (q.authority === "") z = "/" + q.path;
            else z = q.path;
            this.endpoints = [{
                addresses: [{
                    path: z
                }]
            }]
        }
        updateResolution() {
            if (!this.hasReturnedResult) this.hasReturnedResult = !0, process.nextTick(this.listener, (0, acz.statusOrFromValue)(this.endpoints), {}, null, "")
        }
        destroy() {
            this.hasReturnedResult = !1
        }
        static getDefaultAuthority(q) {
            return "localhost"
        }
    }

    function scz() {
        (0, ocz.registerResolver)("unix", FKK)
    }
})
// @from(Ln 322120, Col 4)
rKK = p((iKK) => {
    Object.defineProperty(iKK, "__esModule", {
        value: !0
    });
    iKK.setup = zlz;
    var QKK = d6("net"),
        dKK = nJ6(),
        nB8 = e_(),
        k67 = QD(),
        cKK = GF(),
        ecz = by(),
        lKK = nk(),
        qlz = o2(),
        Klz = "ip_resolver";

    function nKK(q) {
        qlz.trace(nB8.LogVerbosity.DEBUG, Klz, q)
    }
    var N67 = "ipv4",
        E67 = "ipv6",
        _lz = 443;
    class y67 {
        constructor(q, K, _) {
            var z;
            this.listener = K, this.endpoints = [], this.error = null, this.hasReturnedResult = !1, nKK("Resolver constructed for target " + (0, lKK.uriToString)(q));
            let Y = [];
            if (!(q.scheme === N67 || q.scheme === E67)) {
                this.error = {
                    code: nB8.Status.UNAVAILABLE,
                    details: `Unrecognized scheme ${q.scheme} in IP resolver`,
                    metadata: new k67.Metadata
                };
                return
            }
            let A = q.path.split(",");
            for (let O of A) {
                let w = (0, lKK.splitHostPort)(O);
                if (w === null) {
                    this.error = {
                        code: nB8.Status.UNAVAILABLE,
                        details: `Failed to parse ${q.scheme} address ${O}`,
                        metadata: new k67.Metadata
                    };
                    return
                }
                if (q.scheme === N67 && !(0, QKK.isIPv4)(w.host) || q.scheme === E67 && !(0, QKK.isIPv6)(w.host)) {
                    this.error = {
                        code: nB8.Status.UNAVAILABLE,
                        details: `Failed to parse ${q.scheme} address ${O}`,
                        metadata: new k67.Metadata
                    };
                    return
                }
                Y.push({
                    host: w.host,
                    port: (z = w.port) !== null && z !== void 0 ? z : _lz
                })
            }
            this.endpoints = Y.map((O) => ({
                addresses: [O]
            })), nKK("Parsed " + q.scheme + " address list " + Y.map(ecz.subchannelAddressToString))
        }
        updateResolution() {
            if (!this.hasReturnedResult) this.hasReturnedResult = !0, process.nextTick(() => {
                if (this.error) this.listener((0, dKK.statusOrFromError)(this.error), {}, null, "");
                else this.listener((0, dKK.statusOrFromValue)(this.endpoints), {}, null, "")
            })
        }
        destroy() {
            this.hasReturnedResult = !1
        }
        static getDefaultAuthority(q) {
            return q.path.split(",")[0]
        }
    }

    function zlz() {
        (0, cKK.registerResolver)(N67, y67), (0, cKK.registerResolver)(E67, y67)
    }
})
// @from(Ln 322200, Col 4)
K5K = p((eKK) => {
    Object.defineProperty(eKK, "__esModule", {
        value: !0
    });
    eKK.RoundRobinLoadBalancer = void 0;
    eKK.setup = Hlz;
    var sKK = y36(),
        ef = ik(),
        hq8 = Mt(),
        Alz = o2(),
        Olz = e_(),
        oKK = by(),
        wlz = yq8(),
        $lz = "round_robin";

    function aKK(q) {
        Alz.trace(Olz.LogVerbosity.DEBUG, $lz, q)
    }
    var iB8 = "round_robin";
    class rB8 {
        getLoadBalancerName() {
            return iB8
        }
        constructor() {}
        toJsonObject() {
            return {
                [iB8]: {}
            }
        }
        static createFromJson(q) {
            return new rB8
        }
    }
    class tKK {
        constructor(q, K = 0) {
            this.children = q, this.nextIndex = K
        }
        pick(q) {
            let K = this.children[this.nextIndex].picker;
            return this.nextIndex = (this.nextIndex + 1) % this.children.length, K.pick(q)
        }
        peekNextEndpoint() {
            return this.children[this.nextIndex].endpoint
        }
    }

    function jlz(q, K) {
        return [...q.slice(K), ...q.slice(0, K)]
    }
    class L67 {
        constructor(q) {
            this.channelControlHelper = q, this.children = [], this.currentState = ef.ConnectivityState.IDLE, this.currentReadyPicker = null, this.updatesPaused = !1, this.lastError = null, this.childChannelControlHelper = (0, sKK.createChildChannelControlHelper)(q, {
                updateState: (K, _, z) => {
                    if (this.currentState === ef.ConnectivityState.READY && K !== ef.ConnectivityState.READY) this.channelControlHelper.requestReresolution();
                    if (z) this.lastError = z;
                    this.calculateAndUpdateState()
                }
            })
        }
        countChildrenWithState(q) {
            return this.children.filter((K) => K.getConnectivityState() === q).length
        }
        calculateAndUpdateState() {
            if (this.updatesPaused) return;
            if (this.countChildrenWithState(ef.ConnectivityState.READY) > 0) {
                let q = this.children.filter((_) => _.getConnectivityState() === ef.ConnectivityState.READY),
                    K = 0;
                if (this.currentReadyPicker !== null) {
                    let _ = this.currentReadyPicker.peekNextEndpoint();
                    if (K = q.findIndex((z) => (0, oKK.endpointEqual)(z.getEndpoint(), _)), K < 0) K = 0
                }
                this.updateState(ef.ConnectivityState.READY, new tKK(q.map((_) => ({
                    endpoint: _.getEndpoint(),
                    picker: _.getPicker()
                })), K), null)
            } else if (this.countChildrenWithState(ef.ConnectivityState.CONNECTING) > 0) this.updateState(ef.ConnectivityState.CONNECTING, new hq8.QueuePicker(this), null);
            else if (this.countChildrenWithState(ef.ConnectivityState.TRANSIENT_FAILURE) > 0) {
                let q = `round_robin: No connection established. Last error: ${this.lastError}`;
                this.updateState(ef.ConnectivityState.TRANSIENT_FAILURE, new hq8.UnavailablePicker({
                    details: q
                }), q)
            } else this.updateState(ef.ConnectivityState.IDLE, new hq8.QueuePicker(this), null);
            for (let q of this.children)
                if (q.getConnectivityState() === ef.ConnectivityState.IDLE) q.exitIdle()
        }
        updateState(q, K, _) {
            if (aKK(ef.ConnectivityState[this.currentState] + " -> " + ef.ConnectivityState[q]), q === ef.ConnectivityState.READY) this.currentReadyPicker = K;
            else this.currentReadyPicker = null;
            this.currentState = q, this.channelControlHelper.updateState(q, K, _)
        }
        resetSubchannelList() {
            for (let q of this.children) q.destroy();
            this.children = []
        }
        updateAddressList(q, K, _, z) {
            if (!(K instanceof rB8)) return !1;
            if (!q.ok) {
                if (this.children.length === 0) this.updateState(ef.ConnectivityState.TRANSIENT_FAILURE, new hq8.UnavailablePicker(q.error), q.error.details);
                return !0
            }
            let Y = Math.random() * q.value.length | 0,
                A = jlz(q.value, Y);
            if (this.resetSubchannelList(), A.length === 0) {
                let O = `No addresses resolved. Resolution note: ${z}`;
                this.updateState(ef.ConnectivityState.TRANSIENT_FAILURE, new hq8.UnavailablePicker({
                    details: O
                }), O)
            }
            aKK("Connect to endpoint list " + A.map(oKK.endpointToString)), this.updatesPaused = !0, this.children = A.map((O) => new wlz.LeafLoadBalancer(O, this.childChannelControlHelper, _, z));
            for (let O of this.children) O.startConnecting();
            return this.updatesPaused = !1, this.calculateAndUpdateState(), !0
        }
        exitIdle() {}
        resetBackoff() {}
        destroy() {
            this.resetSubchannelList()
        }
        getTypeName() {
            return iB8
        }
    }
    eKK.RoundRobinLoadBalancer = L67;

    function Hlz() {
        (0, sKK.registerLoadBalancerType)(iB8, L67, rB8)
    }
})
// @from(Ln 322327, Col 4)
j5K = p((w5K) => {
    var h67;
    Object.defineProperty(w5K, "__esModule", {
        value: !0
    });
    w5K.OutlierDetectionLoadBalancer = w5K.OutlierDetectionLoadBalancingConfig = void 0;
    w5K.setup = Vlz;
    var Xlz = ik(),
        _5K = e_(),
        zX6 = kq8(),
        z5K = V67(),
        Mlz = y36(),
        Plz = dm8(),
        Wlz = Mt(),
        R67 = by(),
        Dlz = Tq8(),
        Zlz = o2(),
        flz = "outlier_detection";

    function lD(q) {
        Zlz.trace(_5K.LogVerbosity.DEBUG, flz, q)
    }
    var b67 = "outlier_detection",
        Glz = ((h67 = process.env.GRPC_EXPERIMENTAL_ENABLE_OUTLIER_DETECTION) !== null && h67 !== void 0 ? h67 : "true") === "true",
        vlz = {
            stdev_factor: 1900,
            enforcement_percentage: 100,
            minimum_hosts: 5,
            request_volume: 100
        },
        Tlz = {
            threshold: 85,
            enforcement_percentage: 100,
            minimum_hosts: 5,
            request_volume: 50
        };

    function QS6(q, K, _, z) {
        if (K in q && q[K] !== void 0 && typeof q[K] !== _) {
            let Y = z ? `${z}.${K}` : K;
            throw Error(`outlier detection config ${Y} parse error: expected ${_}, got ${typeof q[K]}`)
        }
    }

    function S67(q, K, _) {
        let z = _ ? `${_}.${K}` : K;
        if (K in q && q[K] !== void 0) {
            if (!(0, zX6.isDuration)(q[K])) throw Error(`outlier detection config ${z} parse error: expected Duration, got ${typeof q[K]}`);
            if (!(q[K].seconds >= 0 && q[K].seconds <= 315576000000 && q[K].nanos >= 0 && q[K].nanos <= 999999999)) throw Error(`outlier detection config ${z} parse error: values out of range for non-negative Duaration`)
        }
    }

    function oB8(q, K, _) {
        let z = _ ? `${_}.${K}` : K;
        if (QS6(q, K, "number", _), K in q && q[K] !== void 0 && !(q[K] >= 0 && q[K] <= 100)) throw Error(`outlier detection config ${z} parse error: value out of range for percentage (0-100)`)
    }
    class Rq8 {
        constructor(q, K, _, z, Y, A, O) {
            if (this.childPolicy = O, O.getLoadBalancerName() === "pick_first") throw Error("outlier_detection LB policy cannot have a pick_first child policy");
            this.intervalMs = q !== null && q !== void 0 ? q : 1e4, this.baseEjectionTimeMs = K !== null && K !== void 0 ? K : 30000, this.maxEjectionTimeMs = _ !== null && _ !== void 0 ? _ : 300000, this.maxEjectionPercent = z !== null && z !== void 0 ? z : 10, this.successRateEjection = Y ? Object.assign(Object.assign({}, vlz), Y) : null, this.failurePercentageEjection = A ? Object.assign(Object.assign({}, Tlz), A) : null
        }
        getLoadBalancerName() {
            return b67
        }
        toJsonObject() {
            var q, K;
            return {
                outlier_detection: {
                    interval: (0, zX6.msToDuration)(this.intervalMs),
                    base_ejection_time: (0, zX6.msToDuration)(this.baseEjectionTimeMs),
                    max_ejection_time: (0, zX6.msToDuration)(this.maxEjectionTimeMs),
                    max_ejection_percent: this.maxEjectionPercent,
                    success_rate_ejection: (q = this.successRateEjection) !== null && q !== void 0 ? q : void 0,
                    failure_percentage_ejection: (K = this.failurePercentageEjection) !== null && K !== void 0 ? K : void 0,
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
        static createFromJson(q) {
            var K;
            if (S67(q, "interval"), S67(q, "base_ejection_time"), S67(q, "max_ejection_time"), oB8(q, "max_ejection_percent"), "success_rate_ejection" in q && q.success_rate_ejection !== void 0) {
                if (typeof q.success_rate_ejection !== "object") throw Error("outlier detection config success_rate_ejection must be an object");
                QS6(q.success_rate_ejection, "stdev_factor", "number", "success_rate_ejection"), oB8(q.success_rate_ejection, "enforcement_percentage", "success_rate_ejection"), QS6(q.success_rate_ejection, "minimum_hosts", "number", "success_rate_ejection"), QS6(q.success_rate_ejection, "request_volume", "number", "success_rate_ejection")
            }
            if ("failure_percentage_ejection" in q && q.failure_percentage_ejection !== void 0) {
                if (typeof q.failure_percentage_ejection !== "object") throw Error("outlier detection config failure_percentage_ejection must be an object");
                oB8(q.failure_percentage_ejection, "threshold", "failure_percentage_ejection"), oB8(q.failure_percentage_ejection, "enforcement_percentage", "failure_percentage_ejection"), QS6(q.failure_percentage_ejection, "minimum_hosts", "number", "failure_percentage_ejection"), QS6(q.failure_percentage_ejection, "request_volume", "number", "failure_percentage_ejection")
            }
            if (!("child_policy" in q) || !Array.isArray(q.child_policy)) throw Error("outlier detection config child_policy must be an array");
            let _ = (0, Mlz.selectLbConfigFromList)(q.child_policy);
            if (!_) throw Error("outlier detection config child_policy: no valid recognized policy found");
            return new Rq8(q.interval ? (0, zX6.durationToMs)(q.interval) : null, q.base_ejection_time ? (0, zX6.durationToMs)(q.base_ejection_time) : null, q.max_ejection_time ? (0, zX6.durationToMs)(q.max_ejection_time) : null, (K = q.max_ejection_percent) !== null && K !== void 0 ? K : null, q.success_rate_ejection, q.failure_percentage_ejection, _)
        }
    }
    w5K.OutlierDetectionLoadBalancingConfig = Rq8;
    class Y5K extends Dlz.BaseSubchannelWrapper {
        constructor(q, K) {
            super(q);
            this.mapEntry = K, this.refCount = 0
        }
        ref() {
            this.child.ref(), this.refCount += 1
        }
        unref() {
            if (this.child.unref(), this.refCount -= 1, this.refCount <= 0) {
                if (this.mapEntry) {
                    let q = this.mapEntry.subchannelWrappers.indexOf(this);
                    if (q >= 0) this.mapEntry.subchannelWrappers.splice(q, 1)
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

    function C67() {
        return {
            success: 0,
            failure: 0
        }
    }
    class A5K {
        constructor() {
            this.activeBucket = C67(), this.inactiveBucket = C67()
        }
        addSuccess() {
            this.activeBucket.success += 1
        }
        addFailure() {
            this.activeBucket.failure += 1
        }
        switchBuckets() {
            this.inactiveBucket = this.activeBucket, this.activeBucket = C67()
        }
        getLastSuccesses() {
            return this.inactiveBucket.success
        }
        getLastFailures() {
            return this.inactiveBucket.failure
        }
    }
    class O5K {
        constructor(q, K) {
            this.wrappedPicker = q, this.countCalls = K
        }
        pick(q) {
            let K = this.wrappedPicker.pick(q);
            if (K.pickResultType === Wlz.PickResultType.COMPLETE) {
                let _ = K.subchannel,
                    z = _.getMapEntry();
                if (z) {
                    let Y = K.onCallEnded;
                    if (this.countCalls) Y = (A, O, w) => {
                        var $;
                        if (A === _5K.Status.OK) z.counter.addSuccess();
                        else z.counter.addFailure();
                        ($ = K.onCallEnded) === null || $ === void 0 || $.call(K, A, O, w)
                    };
                    return Object.assign(Object.assign({}, K), {
                        subchannel: _.getWrappedSubchannel(),
                        onCallEnded: Y
                    })
                } else return Object.assign(Object.assign({}, K), {
                    subchannel: _.getWrappedSubchannel()
                })
            } else return K
        }
    }
    class I67 {
        constructor(q) {
            this.entryMap = new R67.EndpointMap, this.latestConfig = null, this.timerStartTime = null, this.childBalancer = new Plz.ChildLoadBalancerHandler((0, z5K.createChildChannelControlHelper)(q, {
                createSubchannel: (K, _) => {
                    let z = q.createSubchannel(K, _),
                        Y = this.entryMap.getForSubchannelAddress(K),
                        A = new Y5K(z, Y);
                    if ((Y === null || Y === void 0 ? void 0 : Y.currentEjectionTimestamp) !== null) A.eject();
                    return Y === null || Y === void 0 || Y.subchannelWrappers.push(A), A
                },
                updateState: (K, _, z) => {
                    if (K === Xlz.ConnectivityState.READY) q.updateState(K, new O5K(_, this.isCountingEnabled()), z);
                    else q.updateState(K, _, z)
                }
            })), this.ejectionTimer = setInterval(() => {}, 0), clearInterval(this.ejectionTimer)
        }
        isCountingEnabled() {
            return this.latestConfig !== null && (this.latestConfig.getSuccessRateEjectionConfig() !== null || this.latestConfig.getFailurePercentageEjectionConfig() !== null)
        }
        getCurrentEjectionPercent() {
            let q = 0;
            for (let K of this.entryMap.values())
                if (K.currentEjectionTimestamp !== null) q += 1;
            return q * 100 / this.entryMap.size
        }
        runSuccessRateCheck(q) {
            if (!this.latestConfig) return;
            let K = this.latestConfig.getSuccessRateEjectionConfig();
            if (!K) return;
            lD("Running success rate check");
            let _ = K.request_volume,
                z = 0,
                Y = [];
            for (let [H, J] of this.entryMap.entries()) {
                let X = J.counter.getLastSuccesses(),
                    M = J.counter.getLastFailures();
                if (lD("Stats for " + (0, R67.endpointToString)(H) + ": successes=" + X + " failures=" + M + " targetRequestVolume=" + _), X + M >= _) z += 1, Y.push(X / (X + M))
            }
            if (lD("Found " + z + " success rate candidates; currentEjectionPercent=" + this.getCurrentEjectionPercent() + " successRates=[" + Y + "]"), z < K.minimum_hosts) return;
            let A = Y.reduce((H, J) => H + J) / Y.length,
                O = 0;
            for (let H of Y) {
                let J = H - A;
                O += J * J
            }
            let w = O / Y.length,
                $ = Math.sqrt(w),
                j = A - $ * (K.stdev_factor / 1000);
            lD("stdev=" + $ + " ejectionThreshold=" + j);
            for (let [H, J] of this.entryMap.entries()) {
                if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) break;
                let X = J.counter.getLastSuccesses(),
                    M = J.counter.getLastFailures();
                if (X + M < _) continue;
                let P = X / (X + M);
                if (lD("Checking candidate " + H + " successRate=" + P), P < j) {
                    let W = Math.random() * 100;
                    if (lD("Candidate " + H + " randomNumber=" + W + " enforcement_percentage=" + K.enforcement_percentage), W < K.enforcement_percentage) lD("Ejecting candidate " + H), this.eject(J, q)
                }
            }
        }
        runFailurePercentageCheck(q) {
            if (!this.latestConfig) return;
            let K = this.latestConfig.getFailurePercentageEjectionConfig();
            if (!K) return;
            lD("Running failure percentage check. threshold=" + K.threshold + " request volume threshold=" + K.request_volume);
            let _ = 0;
            for (let z of this.entryMap.values()) {
                let Y = z.counter.getLastSuccesses(),
                    A = z.counter.getLastFailures();
                if (Y + A >= K.request_volume) _ += 1
            }
            if (_ < K.minimum_hosts) return;
            for (let [z, Y] of this.entryMap.entries()) {
                if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) break;
                let A = Y.counter.getLastSuccesses(),
                    O = Y.counter.getLastFailures();
                if (lD("Candidate successes=" + A + " failures=" + O), A + O < K.request_volume) continue;
                if (O * 100 / (O + A) > K.threshold) {
                    let $ = Math.random() * 100;
                    if (lD("Candidate " + z + " randomNumber=" + $ + " enforcement_percentage=" + K.enforcement_percentage), $ < K.enforcement_percentage) lD("Ejecting candidate " + z), this.eject(Y, q)
                }
            }
        }
        eject(q, K) {
            q.currentEjectionTimestamp = new Date, q.ejectionTimeMultiplier += 1;
            for (let _ of q.subchannelWrappers) _.eject()
        }
        uneject(q) {
            q.currentEjectionTimestamp = null;
            for (let K of q.subchannelWrappers) K.uneject()
        }
        switchAllBuckets() {
            for (let q of this.entryMap.values()) q.counter.switchBuckets()
        }
        startTimer(q) {
            var K, _;
            this.ejectionTimer = setTimeout(() => this.runChecks(), q), (_ = (K = this.ejectionTimer).unref) === null || _ === void 0 || _.call(K)
        }
        runChecks() {
            let q = new Date;
            if (lD("Ejection timer running"), this.switchAllBuckets(), !this.latestConfig) return;
            this.timerStartTime = q, this.startTimer(this.latestConfig.getIntervalMs()), this.runSuccessRateCheck(q), this.runFailurePercentageCheck(q);
            for (let [K, _] of this.entryMap.entries())
                if (_.currentEjectionTimestamp === null) {
                    if (_.ejectionTimeMultiplier > 0) _.ejectionTimeMultiplier -= 1
                } else {
                    let z = this.latestConfig.getBaseEjectionTimeMs(),
                        Y = this.latestConfig.getMaxEjectionTimeMs(),
                        A = new Date(_.currentEjectionTimestamp.getTime());
                    if (A.setMilliseconds(A.getMilliseconds() + Math.min(z * _.ejectionTimeMultiplier, Math.max(z, Y))), A < new Date) lD("Unejecting " + K), this.uneject(_)
                }
        }
        updateAddressList(q, K, _, z) {
            if (!(K instanceof Rq8)) return !1;
            if (lD("Received update with config: " + JSON.stringify(K.toJsonObject(), void 0, 2)), q.ok) {
                for (let A of q.value)
                    if (!this.entryMap.has(A)) lD("Adding map entry for " + (0, R67.endpointToString)(A)), this.entryMap.set(A, {
                        counter: new A5K,
                        currentEjectionTimestamp: null,
                        ejectionTimeMultiplier: 0,
                        subchannelWrappers: []
                    });
                this.entryMap.deleteMissing(q.value)
            }
            let Y = K.getChildPolicy();
            if (this.childBalancer.updateAddressList(q, Y, _, z), K.getSuccessRateEjectionConfig() || K.getFailurePercentageEjectionConfig())
                if (this.timerStartTime) {
                    lD("Previous timer existed. Replacing timer"), clearTimeout(this.ejectionTimer);
                    let A = K.getIntervalMs() - (new Date().getTime() - this.timerStartTime.getTime());
                    this.startTimer(A)
                } else lD("Starting new timer"), this.timerStartTime = new Date, this.startTimer(K.getIntervalMs()), this.switchAllBuckets();
            else {
                lD("Counting disabled. Cancelling timer."), this.timerStartTime = null, clearTimeout(this.ejectionTimer);
                for (let A of this.entryMap.values()) this.uneject(A), A.ejectionTimeMultiplier = 0
            }
            return this.latestConfig = K, !0
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
            return b67
        }
    }
    w5K.OutlierDetectionLoadBalancer = I67;

    function Vlz() {
        if (Glz)(0, z5K.registerLoadBalancerType)(b67, I67, Rq8)
    }
})
// @from(Ln 322683, Col 4)
M5K = p((J5K) => {
    Object.defineProperty(J5K, "__esModule", {
        value: !0
    });
    J5K.PriorityQueue = void 0;
    var dS6 = 0,
        x67 = (q) => Math.floor(q / 2),
        aB8 = (q) => q * 2 + 1,
        Sq8 = (q) => q * 2 + 2;
    class H5K {
        constructor(q = (K, _) => K > _) {
            this.comparator = q, this.heap = []
        }
        size() {
            return this.heap.length
        }
        isEmpty() {
            return this.size() == 0
        }
        peek() {
            return this.heap[dS6]
        }
        push(...q) {
            return q.forEach((K) => {
                this.heap.push(K), this.siftUp()
            }), this.size()
        }
        pop() {
            let q = this.peek(),
                K = this.size() - 1;
            if (K > dS6) this.swap(dS6, K);
            return this.heap.pop(), this.siftDown(), q
        }
        replace(q) {
            let K = this.peek();
            return this.heap[dS6] = q, this.siftDown(), K
        }
        greater(q, K) {
            return this.comparator(this.heap[q], this.heap[K])
        }
        swap(q, K) {
            [this.heap[q], this.heap[K]] = [this.heap[K], this.heap[q]]
        }
        siftUp() {
            let q = this.size() - 1;
            while (q > dS6 && this.greater(q, x67(q))) this.swap(q, x67(q)), q = x67(q)
        }
        siftDown() {
            let q = dS6;
            while (aB8(q) < this.size() && this.greater(aB8(q), q) || Sq8(q) < this.size() && this.greater(Sq8(q), q)) {
                let K = Sq8(q) < this.size() && this.greater(Sq8(q), aB8(q)) ? Sq8(q) : aB8(q);
                this.swap(q, K), q = K
            }
        }
    }
    J5K.PriorityQueue = H5K
})
// @from(Ln 322740, Col 4)
V5K = p((v5K) => {
    Object.defineProperty(v5K, "__esModule", {
        value: !0
    });
    v5K.WeightedRoundRobinLoadBalancingConfig = void 0;
    v5K.setup = ulz;
    var nD = ik(),
        Elz = e_(),
        zS = kq8(),
        D5K = y36(),
        ylz = yq8(),
        Llz = o2(),
        Z5K = FB8(),
        cS6 = Mt(),
        hlz = M5K(),
        P5K = by(),
        Rlz = "weighted_round_robin";

    function u67(q) {
        Llz.trace(Elz.LogVerbosity.DEBUG, Rlz, q)
    }
    var m67 = "weighted_round_robin",
        Slz = 1e4,
        Clz = 1e4,
        blz = 180000,
        Ilz = 1000,
        xlz = 1;

    function W5K(q, K, _) {
        if (K in q && q[K] !== void 0 && typeof q[K] !== _) throw Error(`weighted round robin config ${K} parse error: expected ${_}, got ${typeof q[K]}`)
    }

    function sB8(q, K) {
        if (K in q && q[K] !== void 0 && q[K] !== null) {
            let _;
            if ((0, zS.isDuration)(q[K])) _ = q[K];
            else if ((0, zS.isDurationMessage)(q[K])) _ = (0, zS.durationMessageToDuration)(q[K]);
            else if (typeof q[K] === "string") {
                let z = (0, zS.parseDuration)(q[K]);
                if (!z) throw Error(`weighted round robin config ${K}: failed to parse duration string ${q[K]}`);
                _ = z
            } else throw Error(`weighted round robin config ${K}: expected duration, got ${typeof q[K]}`);
            return (0, zS.durationToMs)(_)
        }
        return null
    }
    class Cq8 {
        constructor(q, K, _, z, Y, A) {
            this.enableOobLoadReport = q !== null && q !== void 0 ? q : !1, this.oobLoadReportingPeriodMs = K !== null && K !== void 0 ? K : Slz, this.blackoutPeriodMs = _ !== null && _ !== void 0 ? _ : Clz, this.weightExpirationPeriodMs = z !== null && z !== void 0 ? z : blz, this.weightUpdatePeriodMs = Math.max(Y !== null && Y !== void 0 ? Y : Ilz, 100), this.errorUtilizationPenalty = A !== null && A !== void 0 ? A : xlz
        }
        getLoadBalancerName() {
            return m67
        }
        toJsonObject() {
            return {
                enable_oob_load_report: this.enableOobLoadReport,
                oob_load_reporting_period: (0, zS.durationToString)((0, zS.msToDuration)(this.oobLoadReportingPeriodMs)),
                blackout_period: (0, zS.durationToString)((0, zS.msToDuration)(this.blackoutPeriodMs)),
                weight_expiration_period: (0, zS.durationToString)((0, zS.msToDuration)(this.weightExpirationPeriodMs)),
                weight_update_period: (0, zS.durationToString)((0, zS.msToDuration)(this.weightUpdatePeriodMs)),
                error_utilization_penalty: this.errorUtilizationPenalty
            }
        }
        static createFromJson(q) {
            if (W5K(q, "enable_oob_load_report", "boolean"), W5K(q, "error_utilization_penalty", "number"), q.error_utilization_penalty < 0) throw Error("weighted round robin config error_utilization_penalty < 0");
            return new Cq8(q.enable_oob_load_report, sB8(q, "oob_load_reporting_period"), sB8(q, "blackout_period"), sB8(q, "weight_expiration_period"), sB8(q, "weight_update_period"), q.error_utilization_penalty)
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
    v5K.WeightedRoundRobinLoadBalancingConfig = Cq8;
    class f5K {
        constructor(q, K) {
            this.metricsHandler = K, this.queue = new hlz.PriorityQueue((Y, A) => Y.deadline < A.deadline);
            let _ = q.filter((Y) => Y.weight > 0),
                z;
            if (_.length < 2) z = 1;
            else {
                let Y = 0;
                for (let {
                        weight: A
                    }
                    of _) Y += A;
                z = Y / _.length
            }
            for (let Y of q) {
                let A = Y.weight > 0 ? 1 / Y.weight : z;
                this.queue.push({
                    endpointName: Y.endpointName,
                    picker: Y.picker,
                    period: A,
                    deadline: Math.random() * A
                })
            }
        }
        pick(q) {
            let K = this.queue.pop();
            this.queue.push(Object.assign(Object.assign({}, K), {
                deadline: K.deadline + K.period
            }));
            let _ = K.picker.pick(q);
            if (_.pickResultType === cS6.PickResultType.COMPLETE)
                if (this.metricsHandler) return Object.assign(Object.assign({}, _), {
                    onCallEnded: (0, Z5K.createMetricsReader)((z) => this.metricsHandler(z, K.endpointName), _.onCallEnded)
                });
                else {
                    let z = _.subchannel;
                    return Object.assign(Object.assign({}, _), {
                        subchannel: z.getWrappedSubchannel()
                    })
                }
            else return _
        }
    }
    class G5K {
        constructor(q) {
            this.channelControlHelper = q, this.latestConfig = null, this.children = new Map, this.currentState = nD.ConnectivityState.IDLE, this.updatesPaused = !1, this.lastError = null, this.weightUpdateTimer = null
        }
        countChildrenWithState(q) {
            let K = 0;
            for (let _ of this.children.values())
                if (_.child.getConnectivityState() === q) K += 1;
            return K
        }
        updateWeight(q, K) {
            var _, z;
            let {
                rps_fractional: Y,
                application_utilization: A
            } = K;
            if (A > 0 && Y > 0) A += K.eps / Y * ((z = (_ = this.latestConfig) === null || _ === void 0 ? void 0 : _.getErrorUtilizationPenalty()) !== null && z !== void 0 ? z : 0);
            let O = A === 0 ? 0 : Y / A;
            if (O === 0) return;
            let w = new Date;
            if (q.nonEmptySince === null) q.nonEmptySince = w;
            q.lastUpdated = w, q.weight = O
        }
        getWeight(q) {
            if (!this.latestConfig) return 0;
            let K = new Date().getTime();
            if (K - q.lastUpdated.getTime() >= this.latestConfig.getWeightExpirationPeriodMs()) return q.nonEmptySince = null, 0;
            let _ = this.latestConfig.getBlackoutPeriodMs();
            if (_ > 0 && (q.nonEmptySince === null || K - q.nonEmptySince.getTime() < _)) return 0;
            return q.weight
        }
        calculateAndUpdateState() {
            if (this.updatesPaused || !this.latestConfig) return;
            if (this.countChildrenWithState(nD.ConnectivityState.READY) > 0) {
                let q = [];
                for (let [_, z] of this.children) {
                    if (z.child.getConnectivityState() !== nD.ConnectivityState.READY) continue;
                    q.push({
                        endpointName: _,
                        picker: z.child.getPicker(),
                        weight: this.getWeight(z)
                    })
                }
                u67("Created picker with weights: " + q.map((_) => _.endpointName + ":" + _.weight).join(","));
                let K;
                if (!this.latestConfig.getEnableOobLoadReport()) K = (_, z) => {
                    let Y = this.children.get(z);
                    if (Y) this.updateWeight(Y, _)
                };
                else K = null;
                this.updateState(nD.ConnectivityState.READY, new f5K(q, K), null)
            } else if (this.countChildrenWithState(nD.ConnectivityState.CONNECTING) > 0) this.updateState(nD.ConnectivityState.CONNECTING, new cS6.QueuePicker(this), null);
            else if (this.countChildrenWithState(nD.ConnectivityState.TRANSIENT_FAILURE) > 0) {
                let q = `weighted_round_robin: No connection established. Last error: ${this.lastError}`;
                this.updateState(nD.ConnectivityState.TRANSIENT_FAILURE, new cS6.UnavailablePicker({
                    details: q
                }), q)
            } else this.updateState(nD.ConnectivityState.IDLE, new cS6.QueuePicker(this), null);
            for (let {
                    child: q
                }
                of this.children.values())
                if (q.getConnectivityState() === nD.ConnectivityState.IDLE) q.exitIdle()
        }
        updateState(q, K, _) {
            u67(nD.ConnectivityState[this.currentState] + " -> " + nD.ConnectivityState[q]), this.currentState = q, this.channelControlHelper.updateState(q, K, _)
        }
        updateAddressList(q, K, _, z) {
            var Y, A;
            if (!(K instanceof Cq8)) return !1;
            if (!q.ok) {
                if (this.children.size === 0) this.updateState(nD.ConnectivityState.TRANSIENT_FAILURE, new cS6.UnavailablePicker(q.error), q.error.details);
                return !0
            }
            if (q.value.length === 0) {
                let $ = `No addresses resolved. Resolution note: ${z}`;
                return this.updateState(nD.ConnectivityState.TRANSIENT_FAILURE, new cS6.UnavailablePicker({
                    details: $
                }), $), !1
            }
            u67("Connect to endpoint list " + q.value.map(P5K.endpointToString));
            let O = new Date,
                w = new Set;
            this.updatesPaused = !0, this.latestConfig = K;
            for (let $ of q.value) {
                let j = (0, P5K.endpointToString)($);
                w.add(j);
                let H = this.children.get(j);
                if (!H) H = {
                    child: new ylz.LeafLoadBalancer($, (0, D5K.createChildChannelControlHelper)(this.channelControlHelper, {
                        updateState: (J, X, M) => {
                            if (this.currentState === nD.ConnectivityState.READY && J !== nD.ConnectivityState.READY) this.channelControlHelper.requestReresolution();
                            if (J === nD.ConnectivityState.READY) H.nonEmptySince = null;
                            if (M) this.lastError = M;
                            this.calculateAndUpdateState()
                        },
                        createSubchannel: (J, X) => {
                            let M = this.channelControlHelper.createSubchannel(J, X);
                            if (H === null || H === void 0 ? void 0 : H.oobMetricsListener) return new Z5K.OrcaOobMetricsSubchannelWrapper(M, H.oobMetricsListener, this.latestConfig.getOobLoadReportingPeriodMs());
                            else return M
                        }
                    }), _, z),
                    lastUpdated: O,
                    nonEmptySince: null,
                    weight: 0,
                    oobMetricsListener: null
                }, this.children.set(j, H);
                if (K.getEnableOobLoadReport()) H.oobMetricsListener = (J) => {
                    this.updateWeight(H, J)
                };
                else H.oobMetricsListener = null
            }
            for (let [$, j] of this.children)
                if (w.has($)) j.child.startConnecting();
                else j.child.destroy(), this.children.delete($);
            if (this.updatesPaused = !1, this.calculateAndUpdateState(), this.weightUpdateTimer) clearInterval(this.weightUpdateTimer);
            return this.weightUpdateTimer = (A = (Y = setInterval(() => {
                if (this.currentState === nD.ConnectivityState.READY) this.calculateAndUpdateState()
            }, K.getWeightUpdatePeriodMs())).unref) === null || A === void 0 ? void 0 : A.call(Y), !0
        }
        exitIdle() {}
        resetBackoff() {}
        destroy() {
            for (let q of this.children.values()) q.child.destroy();
            if (this.children.clear(), this.weightUpdateTimer) clearInterval(this.weightUpdateTimer)
        }
        getTypeName() {
            return m67
        }
    }

    function ulz() {
        (0, D5K.registerLoadBalancerType)(m67, G5K, Cq8)
    }
})
// @from(Ln 323005, Col 4)
bq8 = p((Cw) => {
    Object.defineProperty(Cw, "__esModule", {
        value: !0
    });
    Cw.experimental = Cw.ServerMetricRecorder = Cw.ServerInterceptingCall = Cw.ResponderBuilder = Cw.ServerListenerBuilder = Cw.addAdminServicesToServer = Cw.getChannelzHandlers = Cw.getChannelzServiceDefinition = Cw.InterceptorConfigurationError = Cw.InterceptingCall = Cw.RequesterBuilder = Cw.ListenerBuilder = Cw.StatusBuilder = Cw.getClientChannel = Cw.ServerCredentials = Cw.Server = Cw.setLogVerbosity = Cw.setLogger = Cw.load = Cw.loadObject = Cw.CallCredentials = Cw.ChannelCredentials = Cw.waitForClientReady = Cw.closeClient = Cw.Channel = Cw.makeGenericClientConstructor = Cw.makeClientConstructor = Cw.loadPackageDefinition = Cw.Client = Cw.compressionAlgorithms = Cw.propagate = Cw.connectivityState = Cw.status = Cw.logVerbosity = Cw.Metadata = Cw.credentials = void 0;
    var tB8 = um8();
    Object.defineProperty(Cw, "CallCredentials", {
        enumerable: !0,
        get: function() {
            return tB8.CallCredentials
        }
    });
    var Blz = ut1();
    Object.defineProperty(Cw, "Channel", {
        enumerable: !0,
        get: function() {
            return Blz.ChannelImplementation
        }
    });
    var plz = Ie1();
    Object.defineProperty(Cw, "compressionAlgorithms", {
        enumerable: !0,
        get: function() {
            return plz.CompressionAlgorithms
        }
    });
    var Flz = ik();
    Object.defineProperty(Cw, "connectivityState", {
        enumerable: !0,
        get: function() {
            return Flz.ConnectivityState
        }
    });
    var eB8 = DS6();
    Object.defineProperty(Cw, "ChannelCredentials", {
        enumerable: !0,
        get: function() {
            return eB8.ChannelCredentials
        }
    });
    var k5K = xt1();
    Object.defineProperty(Cw, "Client", {
        enumerable: !0,
        get: function() {
            return k5K.Client
        }
    });
    var B67 = e_();
    Object.defineProperty(Cw, "logVerbosity", {
        enumerable: !0,
        get: function() {
            return B67.LogVerbosity
        }
    });
    Object.defineProperty(Cw, "status", {
        enumerable: !0,
        get: function() {
            return B67.Status
        }
    });
    Object.defineProperty(Cw, "propagate", {
        enumerable: !0,
        get: function() {
            return B67.Propagate
        }
    });
    var N5K = o2(),
        p67 = im8();
    Object.defineProperty(Cw, "loadPackageDefinition", {
        enumerable: !0,
        get: function() {
            return p67.loadPackageDefinition
        }
    });
    Object.defineProperty(Cw, "makeClientConstructor", {
        enumerable: !0,
        get: function() {
            return p67.makeClientConstructor
        }
    });
    Object.defineProperty(Cw, "makeGenericClientConstructor", {
        enumerable: !0,
        get: function() {
            return p67.makeClientConstructor
        }
    });
    var glz = QD();
    Object.defineProperty(Cw, "Metadata", {
        enumerable: !0,
        get: function() {
            return glz.Metadata
        }
    });
    var Ulz = DKK();
    Object.defineProperty(Cw, "Server", {
        enumerable: !0,
        get: function() {
            return Ulz.Server
        }
    });
    var Qlz = BB8();
    Object.defineProperty(Cw, "ServerCredentials", {
        enumerable: !0,
        get: function() {
            return Qlz.ServerCredentials
        }
    });
    var dlz = vKK();
    Object.defineProperty(Cw, "StatusBuilder", {
        enumerable: !0,
        get: function() {
            return dlz.StatusBuilder
        }
    });
    Cw.credentials = {
        combineChannelCredentials: (q, ...K) => {
            return K.reduce((_, z) => _.compose(z), q)
        },
        combineCallCredentials: (q, ...K) => {
            return K.reduce((_, z) => _.compose(z), q)
        },
        createInsecure: eB8.ChannelCredentials.createInsecure,
        createSsl: eB8.ChannelCredentials.createSsl,
        createFromSecureContext: eB8.ChannelCredentials.createFromSecureContext,
        createFromMetadataGenerator: tB8.CallCredentials.createFromMetadataGenerator,
        createFromGoogleCredential: tB8.CallCredentials.createFromGoogleCredential,
        createEmpty: tB8.CallCredentials.createEmpty
    };
    var clz = (q) => q.close();
    Cw.closeClient = clz;
    var llz = (q, K, _) => q.waitForReady(K, _);
    Cw.waitForClientReady = llz;
    var nlz = (q, K) => {
        throw Error("Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead")
    };
    Cw.loadObject = nlz;
    var ilz = (q, K, _) => {
        throw Error("Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead")
    };
    Cw.load = ilz;
    var rlz = (q) => {
        N5K.setLogger(q)
    };
    Cw.setLogger = rlz;
    var olz = (q) => {
        N5K.setLoggerVerbosity(q)
    };
    Cw.setLogVerbosity = olz;
    var alz = (q) => {
        return k5K.Client.prototype.getChannel.call(q)
    };
    Cw.getClientChannel = alz;
    var qp8 = bt1();
    Object.defineProperty(Cw, "ListenerBuilder", {
        enumerable: !0,
        get: function() {
            return qp8.ListenerBuilder
        }
    });
    Object.defineProperty(Cw, "RequesterBuilder", {
        enumerable: !0,
        get: function() {
            return qp8.RequesterBuilder
        }
    });
    Object.defineProperty(Cw, "InterceptingCall", {
        enumerable: !0,
        get: function() {
            return qp8.InterceptingCall
        }
    });
    Object.defineProperty(Cw, "InterceptorConfigurationError", {
        enumerable: !0,
        get: function() {
            return qp8.InterceptorConfigurationError
        }
    });
    var E5K = I36();
    Object.defineProperty(Cw, "getChannelzServiceDefinition", {
        enumerable: !0,
        get: function() {
            return E5K.getChannelzServiceDefinition
        }
    });
    Object.defineProperty(Cw, "getChannelzHandlers", {
        enumerable: !0,
        get: function() {
            return E5K.getChannelzHandlers
        }
    });
    var slz = lm8();
    Object.defineProperty(Cw, "addAdminServicesToServer", {
        enumerable: !0,
        get: function() {
            return slz.addAdminServicesToServer
        }
    });
    var F67 = P67();
    Object.defineProperty(Cw, "ServerListenerBuilder", {
        enumerable: !0,
        get: function() {
            return F67.ServerListenerBuilder
        }
    });
    Object.defineProperty(Cw, "ResponderBuilder", {
        enumerable: !0,
        get: function() {
            return F67.ResponderBuilder
        }
    });
    Object.defineProperty(Cw, "ServerInterceptingCall", {
        enumerable: !0,
        get: function() {
            return F67.ServerInterceptingCall
        }
    });
    var tlz = FB8();
    Object.defineProperty(Cw, "ServerMetricRecorder", {
        enumerable: !0,
        get: function() {
            return tlz.ServerMetricRecorder
        }
    });
    var elz = V67();
    Cw.experimental = elz;
    var qnz = ce1(),
        Knz = UKK(),
        _nz = rKK(),
        znz = yq8(),
        Ynz = K5K(),
        Anz = j5K(),
        Onz = V5K(),
        wnz = I36();
    (() => {
        qnz.setup(), Knz.setup(), _nz.setup(), znz.setup(), Ynz.setup(), Anz.setup(), Onz.setup(), wnz.setup()
    })()
})
// @from(Ln 323242, Col 4)
R5K = p((L5K) => {
    Object.defineProperty(L5K, "__esModule", {
        value: !0
    });
    L5K.createServiceClientConstructor = void 0;
    var Dnz = bq8();

    function Znz(q, K) {
        let _ = {
            export: {
                path: q,
                requestStream: !1,
                responseStream: !1,
                requestSerialize: (z) => {
                    return z
                },
                requestDeserialize: (z) => {
                    return z
                },
                responseSerialize: (z) => {
                    return z
                },
                responseDeserialize: (z) => {
                    return z
                }
            }
        };
        return Dnz.makeGenericClientConstructor(_, K)
    }
    L5K.createServiceClientConstructor = Znz
})
// @from(Ln 323273, Col 4)
Iq8 = p((C5K) => {
    Object.defineProperty(C5K, "__esModule", {
        value: !0
    });
    C5K.createOtlpGrpcExporterTransport = C5K.GrpcExporterTransport = C5K.createEmptyMetadata = C5K.createSslCredentials = C5K.createInsecureCredentials = void 0;
    var fnz = re4(),
        S5K = `OTel-OTLP-Exporter-JavaScript/${fnz.VERSION}`;

    function Gnz(q) {
        if (q) return `${q} ${S5K}`;
        return S5K
    }
    var vnz = 0,
        Tnz = 2;

    function Vnz(q) {
        return q === "gzip" ? Tnz : vnz
    }

    function knz() {
        let {
            credentials: q
        } = bq8();
        return q.createInsecure()
    }
    C5K.createInsecureCredentials = knz;

    function Nnz(q, K, _) {
        let {
            credentials: z
        } = bq8();
        return z.createSsl(q, K, _)
    }
    C5K.createSslCredentials = Nnz;

    function Enz() {
        let {
            Metadata: q
        } = bq8();
        return new q
    }
    C5K.createEmptyMetadata = Enz;
    class g67 {
        _parameters;
        _client;
        _metadata;
        constructor(q) {
            this._parameters = q
        }
        shutdown() {
            this._client?.close()
        }
        send(q, K) {
            let _ = Buffer.from(q);
            if (this._client == null) {
                let {
                    createServiceClientConstructor: z
                } = R5K();
                try {
                    this._metadata = this._parameters.metadata()
                } catch (A) {
                    return Promise.resolve({
                        status: "failure",
                        error: A
                    })
                }
                let Y = z(this._parameters.grpcPath, this._parameters.grpcName);
                try {
                    this._client = new Y(this._parameters.address, this._parameters.credentials(), {
                        "grpc.default_compression_algorithm": Vnz(this._parameters.compression),
                        "grpc.primary_user_agent": Gnz(this._parameters.userAgent)
                    })
                } catch (A) {
                    return Promise.resolve({
                        status: "failure",
                        error: A
                    })
                }
            }
            return new Promise((z) => {
                let Y = Date.now() + K;
                if (this._metadata == null) return z({
                    error: Error("metadata was null"),
                    status: "failure"
                });
                this._client.export(_, this._metadata, {
                    deadline: Y
                }, (A, O) => {
                    if (A) z({
                        status: "failure",
                        error: A
                    });
                    else z({
                        data: O,
                        status: "success"
                    })
                })
            })
        }
    }
    C5K.GrpcExporterTransport = g67;

    function ynz(q) {
        return new g67(q)
    }
    C5K.createOtlpGrpcExporterTransport = ynz
})
// @from(Ln 323380, Col 4)
F5K = p((B5K) => {
    Object.defineProperty(B5K, "__esModule", {
        value: !0
    });
    B5K.getOtlpGrpcDefaultConfiguration = B5K.mergeOtlpGrpcConfigurationWithDefaults = B5K.validateAndNormalizeUrl = void 0;
    var u5K = Al(),
        xq8 = Iq8(),
        Cnz = d6("url"),
        I5K = $5();

    function m5K(q) {
        if (q = q.trim(), !q.match(/^([\w]{1,8}):\/\//)) q = `https://${q}`;
        let _ = new Cnz.URL(q);
        if (_.protocol === "unix:") return q;
        if (_.pathname && _.pathname !== "/") I5K.diag.warn("URL path should not be set when using grpc, the path part of the URL will be ignored.");
        if (_.protocol !== "" && !_.protocol?.match(/^(http)s?:$/)) I5K.diag.warn("URL protocol should be http(s)://. Using http://.");
        return _.host
    }
    B5K.validateAndNormalizeUrl = m5K;

    function x5K(q, K) {
        for (let [_, z] of Object.entries(K.getMap()))
            if (q.get(_).length < 1) q.set(_, z)
    }

    function bnz(q, K, _) {
        let z = q.url ?? K.url ?? _.url;
        return {
            ...(0, u5K.mergeOtlpSharedConfigurationWithDefaults)(q, K, _),
            metadata: () => {
                let Y = _.metadata();
                return x5K(Y, q.metadata?.().clone() ?? (0, xq8.createEmptyMetadata)()), x5K(Y, K.metadata?.() ?? (0, xq8.createEmptyMetadata)()), Y
            },
            url: m5K(z),
            credentials: q.credentials ?? K.credentials?.(z) ?? _.credentials(z),
            userAgent: q.userAgent
        }
    }
    B5K.mergeOtlpGrpcConfigurationWithDefaults = bnz;

    function Inz() {
        return {
            ...(0, u5K.getSharedConfigurationDefaults)(),
            metadata: () => (0, xq8.createEmptyMetadata)(),
            url: "http://localhost:4317",
            credentials: (q) => {
                if (q.startsWith("http://")) return () => (0, xq8.createInsecureCredentials)();
                else return () => (0, xq8.createSslCredentials)()
            }
        }
    }
    B5K.getOtlpGrpcDefaultConfiguration = Inz
})
// @from(Ln 323433, Col 4)
n5K = p((c5K) => {
    Object.defineProperty(c5K, "__esModule", {
        value: !0
    });
    c5K.getOtlpGrpcConfigurationFromEnv = void 0;
    var g5K = t_(),
        uq8 = Iq8(),
        mnz = Xt(),
        Bnz = d6("fs"),
        pnz = d6("path"),
        Q5K = $5();

    function U67(q, K) {
        if (q != null && q !== "") return q;
        if (K != null && K !== "") return K;
        return
    }

    function Fnz(q) {
        let K = process.env[`OTEL_EXPORTER_OTLP_${q}_HEADERS`]?.trim(),
            _ = process.env.OTEL_EXPORTER_OTLP_HEADERS?.trim(),
            z = (0, g5K.parseKeyPairsIntoRecord)(K),
            Y = (0, g5K.parseKeyPairsIntoRecord)(_);
        if (Object.keys(z).length === 0 && Object.keys(Y).length === 0) return;
        let A = Object.assign({}, Y, z),
            O = (0, uq8.createEmptyMetadata)();
        for (let [w, $] of Object.entries(A)) O.set(w, $);
        return O
    }

    function gnz(q) {
        let K = Fnz(q);
        if (K == null) return;
        return () => K
    }

    function Unz(q) {
        let K = process.env[`OTEL_EXPORTER_OTLP_${q}_ENDPOINT`]?.trim(),
            _ = process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.trim();
        return U67(K, _)
    }

    function Qnz(q) {
        let K = process.env[`OTEL_EXPORTER_OTLP_${q}_INSECURE`]?.toLowerCase().trim(),
            _ = process.env.OTEL_EXPORTER_OTLP_INSECURE?.toLowerCase().trim();
        return U67(K, _) === "true"
    }

    function Q67(q, K, _) {
        let z = process.env[q]?.trim(),
            Y = process.env[K]?.trim(),
            A = U67(z, Y);
        if (A != null) try {
            return Bnz.readFileSync(pnz.resolve(process.cwd(), A))
        } catch {
            Q5K.diag.warn(_);
            return
        } else return
    }

    function dnz(q) {
        return Q67(`OTEL_EXPORTER_OTLP_${q}_CLIENT_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE", "Failed to read client certificate chain file")
    }

    function cnz(q) {
        return Q67(`OTEL_EXPORTER_OTLP_${q}_CLIENT_KEY`, "OTEL_EXPORTER_OTLP_CLIENT_KEY", "Failed to read client certificate private key file")
    }

    function U5K(q) {
        return Q67(`OTEL_EXPORTER_OTLP_${q}_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CERTIFICATE", "Failed to read root certificate file")
    }

    function d5K(q) {
        let K = cnz(q),
            _ = dnz(q),
            z = U5K(q),
            Y = K != null && _ != null;
        if (z != null && !Y) return Q5K.diag.warn("Client key and certificate must both be provided, but one was missing - attempting to create credentials from just the root certificate"), (0, uq8.createSslCredentials)(U5K(q));
        return (0, uq8.createSslCredentials)(z, K, _)
    }

    function lnz(q) {
        if (Qnz(q)) return (0, uq8.createInsecureCredentials)();
        return d5K(q)
    }

    function nnz(q) {
        return {
            ...(0, mnz.getSharedConfigurationFromEnvironment)(q),
            metadata: gnz(q),
            url: Unz(q),
            credentials: (K) => {
                if (K.startsWith("http://")) return () => {
                    return (0, uq8.createInsecureCredentials)()
                };
                else if (K.startsWith("https://")) return () => {
                    return d5K(q)
                };
                return () => {
                    return lnz(q)
                }
            }
        }
    }
    c5K.getOtlpGrpcConfigurationFromEnv = nnz
})
// @from(Ln 323539, Col 4)
a5K = p((r5K) => {
    Object.defineProperty(r5K, "__esModule", {
        value: !0
    });
    r5K.convertLegacyOtlpGrpcOptions = void 0;
    var inz = $5(),
        i5K = F5K(),
        rnz = Iq8(),
        onz = n5K();

    function anz(q, K) {
        if (q.headers) inz.diag.warn("Headers cannot be set when using grpc");
        let _ = q.credentials;
        return (0, i5K.mergeOtlpGrpcConfigurationWithDefaults)({
            url: q.url,
            metadata: () => {
                return q.metadata ?? (0, rnz.createEmptyMetadata)()
            },
            compression: q.compression,
            timeoutMillis: q.timeoutMillis,
            concurrencyLimit: q.concurrencyLimit,
            credentials: _ != null ? () => _ : void 0,
            userAgent: q.userAgent
        }, (0, onz.getOtlpGrpcConfigurationFromEnv)(K), (0, i5K.getOtlpGrpcDefaultConfiguration)())
    }
    r5K.convertLegacyOtlpGrpcOptions = anz
})
// @from(Ln 323566, Col 4)
e5K = p((s5K) => {
    Object.defineProperty(s5K, "__esModule", {
        value: !0
    });
    s5K.createOtlpGrpcExportDelegate = void 0;
    var snz = Al(),
        tnz = Iq8();

    function enz(q, K, _, z) {
        return (0, snz.createOtlpNetworkExportDelegate)(q, K, (0, tnz.createOtlpGrpcExporterTransport)({
            address: q.url,
            compression: q.compression,
            credentials: q.credentials,
            metadata: q.metadata,
            userAgent: q.userAgent,
            grpcName: _,
            grpcPath: z
        }))
    }
    s5K.createOtlpGrpcExportDelegate = enz
})
// @from(Ln 323587, Col 4)
_p8 = p((Kp8) => {
    Object.defineProperty(Kp8, "__esModule", {
        value: !0
    });
    Kp8.createOtlpGrpcExportDelegate = Kp8.convertLegacyOtlpGrpcOptions = void 0;
    var qiz = a5K();
    Object.defineProperty(Kp8, "convertLegacyOtlpGrpcOptions", {
        enumerable: !0,
        get: function() {
            return qiz.convertLegacyOtlpGrpcOptions
        }
    });
    var Kiz = e5K();
    Object.defineProperty(Kp8, "createOtlpGrpcExportDelegate", {
        enumerable: !0,
        get: function() {
            return Kiz.createOtlpGrpcExportDelegate
        }
    })
})
// @from(Ln 323607, Col 4)
Y3K = p((_3K) => {
    Object.defineProperty(_3K, "__esModule", {
        value: !0
    });
    _3K.OTLPMetricExporter = void 0;
    var ziz = Sm8(),
        q3K = _p8(),
        Yiz = $l();
    class K3K extends ziz.OTLPMetricExporterBase {
        constructor(q) {
            super((0, q3K.createOtlpGrpcExportDelegate)((0, q3K.convertLegacyOtlpGrpcOptions)(q ?? {}, "METRICS"), Yiz.ProtobufMetricsSerializer, "MetricsExportService", "/opentelemetry.proto.collector.metrics.v1.MetricsService/Export"), q)
        }
    }
    _3K.OTLPMetricExporter = K3K
})
// @from(Ln 323622, Col 4)
A3K = p((d67) => {
    Object.defineProperty(d67, "__esModule", {
        value: !0
    });
    d67.OTLPMetricExporter = void 0;
    var Aiz = Y3K();
    Object.defineProperty(d67, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return Aiz.OTLPMetricExporter
        }
    })
})
// @from(Ln 323635, Col 4)
H3K = p(($3K) => {
    Object.defineProperty($3K, "__esModule", {
        value: !0
    });
    $3K.OTLPMetricExporter = void 0;
    var wiz = Sm8(),
        $iz = $l(),
        O3K = Xt();
    class w3K extends wiz.OTLPMetricExporterBase {
        constructor(q) {
            super((0, O3K.createOtlpHttpExportDelegate)((0, O3K.convertLegacyHttpOptions)(q ?? {}, "METRICS", "v1/metrics", {
                "Content-Type": "application/x-protobuf"
            }), $iz.ProtobufMetricsSerializer), q)
        }
    }
    $3K.OTLPMetricExporter = w3K
})
// @from(Ln 323652, Col 4)
J3K = p((c67) => {
    Object.defineProperty(c67, "__esModule", {
        value: !0
    });
    c67.OTLPMetricExporter = void 0;
    var jiz = H3K();
    Object.defineProperty(c67, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return jiz.OTLPMetricExporter
        }
    })
})
// @from(Ln 323665, Col 4)
X3K = p((l67) => {
    Object.defineProperty(l67, "__esModule", {
        value: !0
    });
    l67.OTLPMetricExporter = void 0;
    var Jiz = J3K();
    Object.defineProperty(l67, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return Jiz.OTLPMetricExporter
        }
    })
})
// @from(Ln 323678, Col 4)
M3K = p((n67) => {
    Object.defineProperty(n67, "__esModule", {
        value: !0
    });
    n67.OTLPMetricExporter = void 0;
    var Miz = X3K();
    Object.defineProperty(n67, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return Miz.OTLPMetricExporter
        }
    })
})
// @from(Ln 323691, Col 4)
o67 = p((Z3K) => {
    Object.defineProperty(Z3K, "__esModule", {
        value: !0
    });
    Z3K.PrometheusSerializer = void 0;
    var Wiz = $5(),
        YX6 = pJ6(),
        P3K = t_();

    function Yp8(q) {
        return q.replace(/\\/g, "\\\\").replace(/\n/g, "\\n")
    }

    function W3K(q = "") {
        if (typeof q !== "string") q = JSON.stringify(q);
        return Yp8(q).replace(/"/g, "\\\"")
    }
    var Diz = /[^a-z0-9_]/gi,
        Ziz = /_{2,}/g;

    function r67(q) {
        return q.replace(Diz, "_").replace(Ziz, "_")
    }

    function i67(q, K) {
        if (!q.endsWith("_total") && K.dataPointType === YX6.DataPointType.SUM && K.isMonotonic) q = q + "_total";
        return q
    }

    function fiz(q) {
        if (q === 1 / 0) return "+Inf";
        else if (q === -1 / 0) return "-Inf";
        else return `${q}`
    }

    function Giz(q) {
        switch (q.dataPointType) {
            case YX6.DataPointType.SUM:
                if (q.isMonotonic) return "counter";
                return "gauge";
            case YX6.DataPointType.GAUGE:
                return "gauge";
            case YX6.DataPointType.HISTOGRAM:
                return "histogram";
            default:
                return "untyped"
        }
    }

    function zp8(q, K, _, z, Y) {
        let A = !1,
            O = "";
        for (let [w, $] of Object.entries(K)) {
            let j = r67(w);
            A = !0, O += `${O.length>0?",":""}${j}="${W3K($)}"`
        }
        if (Y)
            for (let [w, $] of Object.entries(Y)) {
                let j = r67(w);
                A = !0, O += `${O.length>0?",":""}${j}="${W3K($)}"`
            }
        if (A) q += `{${O}}`;
        return `${q} ${fiz(_)}${z!==void 0?" "+String(z):""}
`
    }
    var viz = "# no registered metrics";
    class D3K {
        _prefix;
        _appendTimestamp;
        _additionalAttributes;
        _withResourceConstantLabels;
        _withoutTargetInfo;
        constructor(q, K = !1, _, z) {
            if (q) this._prefix = q + "_";
            this._appendTimestamp = K, this._withResourceConstantLabels = _, this._withoutTargetInfo = !!z
        }
        serialize(q) {
            let K = "";
            this._additionalAttributes = this._filterResourceConstantLabels(q.resource.attributes, this._withResourceConstantLabels);
            for (let _ of q.scopeMetrics) K += this._serializeScopeMetrics(_);
            if (K === "") K += viz;
            return this._serializeResource(q.resource) + K
        }
        _filterResourceConstantLabels(q, K) {
            if (K) {
                let _ = {};
                for (let [z, Y] of Object.entries(q))
                    if (z.match(K)) _[z] = Y;
                return _
            }
            return
        }
        _serializeScopeMetrics(q) {
            let K = "";
            for (let _ of q.metrics) K += this._serializeMetricData(_) + `
`;
            return K
        }
        _serializeMetricData(q) {
            let K = r67(Yp8(q.descriptor.name));
            if (this._prefix) K = `${this._prefix}${K}`;
            let _ = q.dataPointType;
            K = i67(K, q);
            let z = `# HELP ${K} ${Yp8(q.descriptor.description||"description missing")}`,
                Y = q.descriptor.unit ? `
# UNIT ${K} ${Yp8(q.descriptor.unit)}` : "",
                A = `# TYPE ${K} ${Giz(q)}`,
                O = "";
            switch (_) {
                case YX6.DataPointType.SUM:
                case YX6.DataPointType.GAUGE: {
                    O = q.dataPoints.map((w) => this._serializeSingularDataPoint(K, q, w)).join("");
                    break
                }
                case YX6.DataPointType.HISTOGRAM: {
                    O = q.dataPoints.map((w) => this._serializeHistogramDataPoint(K, q, w)).join("");
                    break
                }
                default:
                    Wiz.diag.error(`Unrecognizable DataPointType: ${_} for metric "${K}"`)
            }
            return `${z}${Y}
${A}
${O}`.trim()
        }
        _serializeSingularDataPoint(q, K, _) {
            let z = "";
            q = i67(q, K);
            let {
                value: Y,
                attributes: A
            } = _, O = (0, P3K.hrTimeToMilliseconds)(_.endTime);
            return z += zp8(q, A, Y, this._appendTimestamp ? O : void 0, this._additionalAttributes), z
        }
        _serializeHistogramDataPoint(q, K, _) {
            let z = "";
            q = i67(q, K);
            let {
                attributes: Y,
                value: A
            } = _, O = (0, P3K.hrTimeToMilliseconds)(_.endTime);
            for (let H of ["count", "sum"]) {
                let J = A[H];
                if (J != null) z += zp8(q + "_" + H, Y, J, this._appendTimestamp ? O : void 0, this._additionalAttributes)
            }
            let w = 0,
                $ = A.buckets.counts.entries(),
                j = !1;
            for (let [H, J] of $) {
                w += J;
                let X = A.buckets.boundaries[H];
                if (X === void 0 && j) break;
                if (X === 1 / 0) j = !0;
                z += zp8(q + "_bucket", Y, w, this._appendTimestamp ? O : void 0, Object.assign({}, this._additionalAttributes ?? {}, {
                    le: X === void 0 || X === 1 / 0 ? "+Inf" : String(X)
                }))
            }
            return z
        }
        _serializeResource(q) {
            if (this._withoutTargetInfo === !0) return "";
            let K = "target_info",
                _ = `# HELP ${K} Target metadata`,
                z = `# TYPE ${K} gauge`,
                Y = zp8(K, q.attributes, 1).trim();
            return `${_}
${z}
${Y}
`
        }
    }
    Z3K.PrometheusSerializer = D3K
})
// @from(Ln 323864, Col 4)
T3K = p((G3K) => {
    Object.defineProperty(G3K, "__esModule", {
        value: !0
    });
    G3K.PrometheusExporter = void 0;
    var mq8 = $5(),
        Tiz = t_(),
        a67 = pJ6(),
        Viz = d6("http"),
        kiz = o67(),
        Niz = d6("url");
    class kt extends a67.MetricReader {
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
        constructor(q = {}, K = () => {}) {
            super({
                aggregationSelector: (Y) => {
                    return {
                        type: a67.AggregationType.DEFAULT
                    }
                },
                aggregationTemporalitySelector: (Y) => a67.AggregationTemporality.CUMULATIVE,
                metricProducers: q.metricProducers
            });
            this._host = q.host || process.env.OTEL_EXPORTER_PROMETHEUS_HOST || kt.DEFAULT_OPTIONS.host, this._port = q.port || Number(process.env.OTEL_EXPORTER_PROMETHEUS_PORT) || kt.DEFAULT_OPTIONS.port, this._prefix = q.prefix || kt.DEFAULT_OPTIONS.prefix, this._appendTimestamp = typeof q.appendTimestamp === "boolean" ? q.appendTimestamp : kt.DEFAULT_OPTIONS.appendTimestamp;
            let _ = q.withResourceConstantLabels || kt.DEFAULT_OPTIONS.withResourceConstantLabels,
                z = q.withoutTargetInfo || kt.DEFAULT_OPTIONS.withoutTargetInfo;
            if (this._server = (0, Viz.createServer)(this._requestHandler).unref(), this._serializer = new kiz.PrometheusSerializer(this._prefix, this._appendTimestamp, _, z), this._baseUrl = `http://${this._host}:${this._port}/`, this._endpoint = (q.endpoint || kt.DEFAULT_OPTIONS.endpoint).replace(/^([^/])/, "/$1"), q.preventServerStart !== !0) this.startServer().then(K, (Y) => {
                mq8.diag.error(Y), K(Y)
            });
            else if (K) queueMicrotask(K)
        }
        async onForceFlush() {}
        onShutdown() {
            return this.stopServer()
        }
        stopServer() {
            if (!this._server) return mq8.diag.debug("Prometheus stopServer() was called but server was never started."), Promise.resolve();
            else return new Promise((q) => {
                this._server.close((K) => {
                    if (!K) mq8.diag.debug("Prometheus exporter was stopped");
                    else if (K.code !== "ERR_SERVER_NOT_RUNNING")(0, Tiz.globalErrorHandler)(K);
                    q()
                })
            })
        }
        startServer() {
            return this._startServerPromise ??= new Promise((q, K) => {
                this._server.once("error", K), this._server.listen({
                    port: this._port,
                    host: this._host
                }, () => {
                    mq8.diag.debug(`Prometheus exporter server started: ${this._host}:${this._port}/${this._endpoint}`), q()
                })
            }), this._startServerPromise
        }
        getMetricsRequestHandler(q, K) {
            this._exportMetrics(K)
        }
        _requestHandler = (q, K) => {
            if (q.url != null && new Niz.URL(q.url, this._baseUrl).pathname === this._endpoint) this._exportMetrics(K);
            else this._notFound(K)
        };
        _exportMetrics = (q) => {
            q.statusCode = 200, q.setHeader("content-type", "text/plain"), this.collect().then((K) => {
                let {
                    resourceMetrics: _,
                    errors: z
                } = K;
                if (z.length) mq8.diag.error("PrometheusExporter: metrics collection errors", ...z);
                q.end(this._serializer.serialize(_))
            }, (K) => {
                q.end(`# failed to export metrics: ${K}`)
            })
        };
        _notFound = (q) => {
            q.statusCode = 404, q.end()
        }
    }
    G3K.PrometheusExporter = kt
})
// @from(Ln 323961, Col 4)
V3K = p((Ap8) => {
    Object.defineProperty(Ap8, "__esModule", {
        value: !0
    });
    Ap8.PrometheusSerializer = Ap8.PrometheusExporter = void 0;
    var Eiz = T3K();
    Object.defineProperty(Ap8, "PrometheusExporter", {
        enumerable: !0,
        get: function() {
            return Eiz.PrometheusExporter
        }
    });
    var yiz = o67();
    Object.defineProperty(Ap8, "PrometheusSerializer", {
        enumerable: !0,
        get: function() {
            return yiz.PrometheusSerializer
        }
    })
})
// @from(Ln 323981, Col 4)
L3K = p((E3K) => {
    Object.defineProperty(E3K, "__esModule", {
        value: !0
    });
    E3K.OTLPLogExporter = void 0;
    var k3K = _p8(),
        hiz = $l(),
        Riz = Al();
    class N3K extends Riz.OTLPExporterBase {
        constructor(q = {}) {
            super((0, k3K.createOtlpGrpcExportDelegate)((0, k3K.convertLegacyOtlpGrpcOptions)(q, "LOGS"), hiz.ProtobufLogsSerializer, "LogsExportService", "/opentelemetry.proto.collector.logs.v1.LogsService/Export"))
        }
    }
    E3K.OTLPLogExporter = N3K
})
// @from(Ln 323996, Col 4)
h3K = p((s67) => {
    Object.defineProperty(s67, "__esModule", {
        value: !0
    });
    s67.OTLPLogExporter = void 0;
    var Siz = L3K();
    Object.defineProperty(s67, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return Siz.OTLPLogExporter
        }
    })
})
// @from(Ln 324009, Col 4)
I3K = p((C3K) => {
    Object.defineProperty(C3K, "__esModule", {
        value: !0
    });
    C3K.OTLPLogExporter = void 0;
    var biz = Al(),
        Iiz = $l(),
        R3K = Xt();
    class S3K extends biz.OTLPExporterBase {
        constructor(q = {}) {
            super((0, R3K.createOtlpHttpExportDelegate)((0, R3K.convertLegacyHttpOptions)(q, "LOGS", "v1/logs", {
                "Content-Type": "application/json"
            }), Iiz.JsonLogsSerializer))
        }
    }
    C3K.OTLPLogExporter = S3K
})
// @from(Ln 324026, Col 4)
x3K = p((t67) => {
    Object.defineProperty(t67, "__esModule", {
        value: !0
    });
    t67.OTLPLogExporter = void 0;
    var xiz = I3K();
    Object.defineProperty(t67, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return xiz.OTLPLogExporter
        }
    })
})
// @from(Ln 324039, Col 4)
u3K = p((e67) => {
    Object.defineProperty(e67, "__esModule", {
        value: !0
    });
    e67.OTLPLogExporter = void 0;
    var miz = x3K();
    Object.defineProperty(e67, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return miz.OTLPLogExporter
        }
    })
})