
// @from(Ln 42596, Col 0)
function WA1(A, q, K) {
    let Y = A.key,
        z = A.variations.length;
    if (z < 2) return {
        result: FO(K, A, -1, !1, q)
    };
    if (K.global.enabled === !1 || K.user.enabled === !1) return {
        result: FO(K, A, -1, !1, q)
    };
    if (A = THK(A, K), A.urlPatterns && !HA1(K.user.url || "", A.urlPatterns)) return {
        result: FO(K, A, -1, !1, q)
    };
    let _ = CJA(Y, K.user.url || "", z);
    if (_ !== null) return {
        result: FO(K, A, _, !1, q)
    };
    let w = ZHK(K);
    if (Y in w) {
        let W = w[Y];
        return {
            result: FO(K, A, W, !1, q)
        }
    }
    if (A.status === "draft" || A.active === !1) return {
        result: FO(K, A, -1, !1, q)
    };
    let {
        hashAttribute: O,
        hashValue: $
    } = z76(K, A.hashAttribute, K.user.saveStickyBucketAssignmentDoc && !A.disableStickyBucketing ? A.fallbackAttribute : void 0);
    if (!$) return {
        result: FO(K, A, -1, !1, q)
    };
    let H = -1,
        j = !1,
        J = !1;
    if (K.user.saveStickyBucketAssignmentDoc && !A.disableStickyBucketing) {
        let {
            variation: W,
            versionIsBlocked: Z
        } = VHK({
            ctx: K,
            expKey: A.key,
            expBucketVersion: A.bucketVersion,
            expHashAttribute: A.hashAttribute,
            expFallbackAttribute: A.fallbackAttribute,
            expMinBucketVersion: A.minBucketVersion,
            expMeta: A.meta
        });
        j = W >= 0, H = W, J = !!Z
    }
    if (!j) {
        if (A.filters) {
            if (aJA(A.filters, K)) return {
                result: FO(K, A, -1, !1, q)
            }
        } else if (A.namespace && !RJA($, A.namespace)) return {
            result: FO(K, A, -1, !1, q)
        };
        if (A.include && !IJA(A.include)) return {
            result: FO(K, A, -1, !1, q)
        };
        if (A.condition && !oJA(A.condition, K)) return {
            result: FO(K, A, -1, !1, q)
        };
        if (A.parentConditions) {
            let W = new Set(K.stack.evaluatedFeatures);
            for (let Z of A.parentConditions) {
                K.stack.evaluatedFeatures = new Set(W);
                let G = PA1(Z.id, K);
                if (G.source === "cyclicPrerequisite") return {
                    result: FO(K, A, -1, !1, q)
                };
                let f = {
                    value: G.value
                };
                if (!Dr(f, Z.condition || {})) return {
                    result: FO(K, A, -1, !1, q)
                }
            }
        }
        if (A.groups && !NHK(A.groups, K)) return {
            result: FO(K, A, -1, !1, q)
        }
    }
    if (A.url && !vHK(A.url, K)) return {
        result: FO(K, A, -1, !1, q)
    };
    let M = KR6(A.seed || Y, $, A.hashVersion || 1);
    if (M === null) return {
        result: FO(K, A, -1, !1, q)
    };
    if (!j) {
        let W = A.ranges || SJA(z, A.coverage === void 0 ? 1 : A.coverage, A.weights);
        H = hJA(M, W)
    }
    if (J) return {
        result: FO(K, A, -1, !1, q, void 0, !0)
    };
    if (H < 0) return {
        result: FO(K, A, -1, !1, q)
    };
    if ("force" in A) return {
        result: FO(K, A, A.force === void 0 ? -1 : A.force, !1, q)
    };
    if (K.global.qaMode || K.user.qaMode) return {
        result: FO(K, A, -1, !1, q)
    };
    if (A.status === "stopped") return {
        result: FO(K, A, -1, !1, q)
    };
    let D = FO(K, A, H, !0, q, M, j);
    if (K.user.saveStickyBucketAssignmentDoc && !A.disableStickyBucketing) {
        let {
            changed: W,
            key: Z,
            doc: G
        } = EHK(K, O, YR6($), {
            [Ji1(A.key, A.bucketVersion)]: D.key
        });
        if (W) K.user.stickyBucketAssignmentDocs = K.user.stickyBucketAssignmentDocs || {}, K.user.stickyBucketAssignmentDocs[Z] = G, K.user.saveStickyBucketAssignmentDoc(G)
    }
    let X = nJA(K, A, D);
    if (X.length === 0 && K.global.saveDeferredTrack) K.global.saveDeferredTrack({
        experiment: A,
        result: D
    });
    let P = !X.length ? void 0 : X.length === 1 ? X[0] : Promise.all(X).then(() => {});
    return "changeId" in A && A.changeId && K.global.recordChangeId && K.global.recordChangeId(A.changeId), {
        result: D,
        trackingCall: P
    }
}
// @from(Ln 42730, Col 0)
function Xr(A, q, K, Y, z, _, w) {
    let O = {
        value: K,
        on: !!K,
        off: !K,
        source: Y,
        ruleId: z || ""
    };
    if (_) O.experiment = _;
    if (w) O.experimentResult = w;
    if (Y !== "override") GHK(A, q, O);
    return O
}
// @from(Ln 42744, Col 0)
function rJA(A) {
    return {
        ...A.user.attributes,
        ...A.user.attributeOverrides
    }
}
// @from(Ln 42751, Col 0)
function oJA(A, q) {
    return Dr(rJA(q), A, q.global.savedGroups || {})
}
// @from(Ln 42755, Col 0)
function aJA(A, q) {
    return A.some((K) => {
        let {
            hashValue: Y
        } = z76(q, K.attribute);
        if (!Y) return !0;
        let z = KR6(K.seed, Y, K.hashVersion || 2);
        if (z === null) return !0;
        return !K.ranges.some((_) => $A1(z, _))
    })
}
// @from(Ln 42767, Col 0)
function fHK(A, q, K, Y, z, _, w) {
    if (!z && _ === void 0) return !0;
    if (!z && _ === 0) return !1;
    let {
        hashValue: O
    } = z76(A, K, Y);
    if (!O) return !1;
    let $ = KR6(q, O, w || 1);
    if ($ === null) return !1;
    return z ? $A1($, z) : _ !== void 0 ? $ <= _ : !0
}
// @from(Ln 42779, Col 0)
function FO(A, q, K, Y, z, _, w) {
    let O = !0;
    if (K < 0 || K >= q.variations.length) K = 0, O = !1;
    let {
        hashAttribute: $,
        hashValue: H
    } = z76(A, q.hashAttribute, A.user.saveStickyBucketAssignmentDoc && !q.disableStickyBucketing ? q.fallbackAttribute : void 0), j = q.meta ? q.meta[K] : {}, J = {
        key: j.key || "" + K,
        featureId: z,
        inExperiment: O,
        hashUsed: Y,
        variationId: K,
        value: q.variations[K],
        hashAttribute: $,
        hashValue: H,
        stickyBucketUsed: !!w
    };
    if (j.name) J.name = j.name;
    if (_ !== void 0) J.bucket = _;
    if (j.passthrough) J.passthrough = j.passthrough;
    return J
}
// @from(Ln 42802, Col 0)
function THK(A, q) {
    let K = A.key,
        Y = q.global.overrides;
    if (Y && Y[K]) {
        if (A = Object.assign({}, A, Y[K]), typeof A.url === "string") A.url = zi1(A.url)
    }
    return A
}
// @from(Ln 42811, Col 0)
function z76(A, q, K) {
    let Y = q || "id",
        z = "",
        _ = rJA(A);
    if (_[Y]) z = _[Y];
    if (!z && K) {
        if (_[K]) z = _[K];
        if (z) Y = K
    }
    return {
        hashAttribute: Y,
        hashValue: z
    }
}
// @from(Ln 42826, Col 0)
function vHK(A, q) {
    let K = q.user.url;
    if (!K) return !1;
    let Y = K.replace(/^https?:\/\//, "").replace(/^[^/]*\//, "/");
    if (A.test(K)) return !0;
    if (A.test(Y)) return !0;
    return !1
}
// @from(Ln 42835, Col 0)
function NHK(A, q) {
    let K = q.global.groups || {};
    for (let Y = 0; Y < A.length; Y++)
        if (K[A[Y]]) return !0;
    return !1
}
// @from(Ln 42842, Col 0)
function VHK(A) {
    let {
        ctx: q,
        expKey: K,
        expBucketVersion: Y,
        expHashAttribute: z,
        expFallbackAttribute: _,
        expMinBucketVersion: w,
        expMeta: O
    } = A;
    Y = Y || 0, w = w || 0, z = z || "id", O = O || [];
    let $ = Ji1(K, Y),
        H = kHK(q, z, _);
    if (w > 0)
        for (let M = 0; M <= w; M++) {
            let D = Ji1(K, M);
            if (H[D] !== void 0) return {
                variation: -1,
                versionIsBlocked: !0
            }
        }
    let j = H[$];
    if (j === void 0) return {
        variation: -1
    };
    let J = O.findIndex((M) => M.key === j);
    if (J < 0) return {
        variation: -1
    };
    return {
        variation: J
    }
}
// @from(Ln 42876, Col 0)
function Ji1(A, q) {
    return q = q || 0, `${A}__${q}`
}
// @from(Ln 42880, Col 0)
function Mi1(A, q) {
    return `${A}||${q}`
}
// @from(Ln 42884, Col 0)
function kHK(A, q, K) {
    if (!A.user.stickyBucketAssignmentDocs) return {};
    let {
        hashAttribute: Y,
        hashValue: z
    } = z76(A, q), _ = Mi1(Y, YR6(z)), {
        hashAttribute: w,
        hashValue: O
    } = z76(A, K), $ = O ? Mi1(w, YR6(O)) : null, H = {};
    if ($ && A.user.stickyBucketAssignmentDocs[$]) Object.assign(H, A.user.stickyBucketAssignmentDocs[$].assignments || {});
    if (A.user.stickyBucketAssignmentDocs[_]) Object.assign(H, A.user.stickyBucketAssignmentDocs[_].assignments || {});
    return H
}
// @from(Ln 42898, Col 0)
function EHK(A, q, K, Y) {
    let z = Mi1(q, K),
        _ = A.user.stickyBucketAssignmentDocs && A.user.stickyBucketAssignmentDocs[z] ? A.user.stickyBucketAssignmentDocs[z].assignments || {} : {},
        w = {
            ..._,
            ...Y
        },
        O = JSON.stringify(_) !== JSON.stringify(w);
    return {
        key: z,
        doc: {
            attributeName: q,
            attributeValue: K,
            assignments: w
        },
        changed: O
    }
}
// @from(Ln 42917, Col 0)
function yHK(A, q) {
    let K = new Set,
        Y = q && q.features ? q.features : A.global.features || {},
        z = q && q.experiments ? q.experiments : A.global.experiments || [];
    return Object.keys(Y).forEach((_) => {
        let w = Y[_];
        if (w.rules) {
            for (let O of w.rules)
                if (O.variations) {
                    if (K.add(O.hashAttribute || "id"), O.fallbackAttribute) K.add(O.fallbackAttribute)
                }
        }
    }), z.map((_) => {
        if (K.add(_.hashAttribute || "id"), _.fallbackAttribute) K.add(_.fallbackAttribute)
    }), Array.from(K)
}
// @from(Ln 42933, Col 0)
async function sJA(A, q, K) {
    let Y = Di1(A, K);
    return q.getAllAssignments(Y)
}
// @from(Ln 42938, Col 0)
function Di1(A, q) {
    let K = {};
    return yHK(A, q).forEach((z) => {
        let {
            hashValue: _
        } = z76(A, z);
        K[z] = YR6(_)
    }), K
}
// @from(Ln 42947, Col 0)
async function tJA(A, q, K) {
    if (A = {
            ...A
        }, A.encryptedFeatures) {
        try {
            A.features = JSON.parse(await Y76(A.encryptedFeatures, q, K))
        } catch (Y) {
            console.error(Y)
        }
        delete A.encryptedFeatures
    }
    if (A.encryptedExperiments) {
        try {
            A.experiments = JSON.parse(await Y76(A.encryptedExperiments, q, K))
        } catch (Y) {
            console.error(Y)
        }
        delete A.encryptedExperiments
    }
    if (A.encryptedSavedGroups) {
        try {
            A.savedGroups = JSON.parse(await Y76(A.encryptedSavedGroups, q, K))
        } catch (Y) {
            console.error(Y)
        }
        delete A.encryptedSavedGroups
    }
    return A
}
// @from(Ln 42977, Col 0)
function eJA(A) {
    let q = A.apiHost || "https://cdn.growthbook.io";
    return {
        apiHost: q.replace(/\/*$/, ""),
        streamingHost: (A.streamingHost || q).replace(/\/*$/, ""),
        apiRequestHeaders: A.apiHostRequestHeaders,
        streamingHostRequestHeaders: A.streamingHostRequestHeaders
    }
}
// @from(Ln 42987, Col 0)
function ZA1(A, q) {
    return q.hashAttribute + q.hashValue + A.key + q.variationId
}
// @from(Ln 42990, Col 4)
XHK = "Feature Evaluated"
// @from(Ln 42991, Col 4)
PHK = "Experiment Viewed"
// @from(Ln 42992, Col 4)
AMA = E(() => {
    iJA();
    zR6()
})
// @from(Ln 42996, Col 0)
class GA1 {
    constructor(A) {
        if (A = A || {}, this.version = LHK, this._options = this.context = A, this._renderer = A.renderer || null, this._trackedExperiments = new Set, this._completedChangeIds = new Set, this._trackedFeatures = {}, this.debug = !!A.debug, this._subscriptions = new Set, this.ready = !1, this._assigned = new Map, this._activeAutoExperiments = new Map, this._triggeredExpKeys = new Set, this._initialized = !1, this._redirectedUrl = "", this._deferredTrackingCalls = new Map, this._autoExperimentsAllowed = !A.disableExperimentsOnLoad, this._destroyCallbacks = [], this.logs = [], this.log = this.log.bind(this), this._saveDeferredTrack = this._saveDeferredTrack.bind(this), this._fireSubscriptions = this._fireSubscriptions.bind(this), this._recordChangedId = this._recordChangedId.bind(this), A.remoteEval) {
            if (A.decryptionKey) throw Error("Encryption is not available for remoteEval");
            if (!A.clientKey) throw Error("Missing clientKey");
            let q = !1;
            try {
                q = !!new URL(A.apiHost || "").hostname.match(/growthbook\.io$/i)
            } catch (K) {}
            if (q) throw Error("Cannot use remoteEval on GrowthBook Cloud")
        } else if (A.cacheKeyAttributes) throw Error("cacheKeyAttributes are only used for remoteEval");
        if (A.stickyBucketService) {
            let q = A.stickyBucketService;
            this._saveStickyBucketAssignmentDoc = (K) => {
                return q.saveAssignments(K)
            }
        }
        if (A.plugins)
            for (let q of A.plugins) q(this);
        if (A.features) this.ready = !0;
        if (n$6 && A.enableDevMode) window._growthbook = this, document.dispatchEvent(new Event("gbloaded"));
        if (A.experiments) this.ready = !0, this._updateAllAutoExperiments();
        if (this._options.stickyBucketService && this._options.stickyBucketAssignmentDocs)
            for (let q in this._options.stickyBucketAssignmentDocs) {
                let K = this._options.stickyBucketAssignmentDocs[q];
                if (K) this._options.stickyBucketService.saveAssignments(K).catch(() => {})
            }
        if (this.ready) this.refreshStickyBuckets(this.getPayload())
    }
    async setPayload(A) {
        this._payload = A;
        let q = await tJA(A, this._options.decryptionKey);
        if (this._decryptedPayload = q, await this.refreshStickyBuckets(q), q.features) this._options.features = q.features;
        if (q.savedGroups) this._options.savedGroups = q.savedGroups;
        if (q.experiments) this._options.experiments = q.experiments, this._updateAllAutoExperiments();
        this.ready = !0, this._render()
    }
    initSync(A) {
        this._initialized = !0;
        let q = A.payload;
        if (q.encryptedExperiments || q.encryptedFeatures) throw Error("initSync does not support encrypted payloads");
        if (this._options.stickyBucketService && !this._options.stickyBucketAssignmentDocs) this._options.stickyBucketAssignmentDocs = this.generateStickyBucketAssignmentDocsSync(this._options.stickyBucketService, q);
        if (this._payload = q, this._decryptedPayload = q, q.features) this._options.features = q.features;
        if (q.experiments) this._options.experiments = q.experiments, this._updateAllAutoExperiments();
        return this.ready = !0, DA1(this, A), this
    }
    async init(A) {
        if (this._initialized = !0, A = A || {}, A.cacheSettings) BJA(A.cacheSettings);
        if (A.payload) return await this.setPayload(A.payload), DA1(this, A), {
            success: !0,
            source: "init"
        };
        else {
            let {
                data: q,
                ...K
            } = await this._refresh({
                ...A,
                allowStale: !0
            });
            return DA1(this, A), await this.setPayload(q || {}), K
        }
    }
    async loadFeatures(A) {
        A = A || {}, await this.init({
            skipCache: A.skipCache,
            timeout: A.timeout,
            streaming: (this._options.backgroundSync ?? !0) && (A.autoRefresh || this._options.subscribeToChanges)
        })
    }
    async refreshFeatures(A) {
        let q = await this._refresh({
            ...A || {},
            allowStale: !1
        });
        if (q.data) await this.setPayload(q.data)
    }
    getApiInfo() {
        return [this.getApiHosts().apiHost, this.getClientKey()]
    }
    getApiHosts() {
        return eJA(this._options)
    }
    getClientKey() {
        return this._options.clientKey || ""
    }
    getPayload() {
        return this._payload || {
            features: this.getFeatures(),
            experiments: this.getExperiments()
        }
    }
    getDecryptedPayload() {
        return this._decryptedPayload || this.getPayload()
    }
    isRemoteEval() {
        return this._options.remoteEval || !1
    }
    getCacheKeyAttributes() {
        return this._options.cacheKeyAttributes
    }
    async _refresh(A) {
        let {
            timeout: q,
            skipCache: K,
            allowStale: Y,
            streaming: z
        } = A;
        if (!this._options.clientKey) throw Error("Missing clientKey");
        return gJA({
            instance: this,
            timeout: q,
            skipCache: K || this._options.disableCache,
            allowStale: Y,
            backgroundSync: z ?? this._options.backgroundSync ?? !0
        })
    }
    _render() {
        if (this._renderer) try {
            this._renderer()
        } catch (A) {
            console.error("Failed to render", A)
        }
    }
    setFeatures(A) {
        this._options.features = A, this.ready = !0, this._render()
    }
    async setEncryptedFeatures(A, q, K) {
        let Y = await Y76(A, q || this._options.decryptionKey, K);
        this.setFeatures(JSON.parse(Y))
    }
    setExperiments(A) {
        this._options.experiments = A, this.ready = !0, this._updateAllAutoExperiments()
    }
    async setEncryptedExperiments(A, q, K) {
        let Y = await Y76(A, q || this._options.decryptionKey, K);
        this.setExperiments(JSON.parse(Y))
    }
    async setAttributes(A) {
        if (this._options.attributes = A, this._options.stickyBucketService) await this.refreshStickyBuckets();
        if (this._options.remoteEval) {
            await this._refreshForRemoteEval();
            return
        }
        this._render(), this._updateAllAutoExperiments()
    }
    async updateAttributes(A) {
        return this.setAttributes({
            ...this._options.attributes,
            ...A
        })
    }
    async setAttributeOverrides(A) {
        if (this._options.attributeOverrides = A, this._options.stickyBucketService) await this.refreshStickyBuckets();
        if (this._options.remoteEval) {
            await this._refreshForRemoteEval();
            return
        }
        this._render(), this._updateAllAutoExperiments()
    }
    async setForcedVariations(A) {
        if (this._options.forcedVariations = A || {}, this._options.remoteEval) {
            await this._refreshForRemoteEval();
            return
        }
        this._render(), this._updateAllAutoExperiments()
    }
    setForcedFeatures(A) {
        this._options.forcedFeatureValues = A, this._render()
    }
    async setURL(A) {
        if (A === this._options.url) return;
        if (this._options.url = A, this._redirectedUrl = "", this._options.remoteEval) {
            await this._refreshForRemoteEval(), this._updateAllAutoExperiments(!0);
            return
        }
        this._updateAllAutoExperiments(!0)
    }
    getAttributes() {
        return {
            ...this._options.attributes,
            ...this._options.attributeOverrides
        }
    }
    getForcedVariations() {
        return this._options.forcedVariations || {}
    }
    getForcedFeatures() {
        return this._options.forcedFeatureValues || new Map
    }
    getStickyBucketAssignmentDocs() {
        return this._options.stickyBucketAssignmentDocs || {}
    }
    getUrl() {
        return this._options.url || ""
    }
    getFeatures() {
        return this._options.features || {}
    }
    getExperiments() {
        return this._options.experiments || []
    }
    getCompletedChangeIds() {
        return Array.from(this._completedChangeIds)
    }
    subscribe(A) {
        return this._subscriptions.add(A), () => {
            this._subscriptions.delete(A)
        }
    }
    async _refreshForRemoteEval() {
        if (!this._options.remoteEval) return;
        if (!this._initialized) return;
        let A = await this._refresh({
            allowStale: !1
        });
        if (A.data) await this.setPayload(A.data)
    }
    getAllResults() {
        return new Map(this._assigned)
    }
    onDestroy(A) {
        this._destroyCallbacks.push(A)
    }
    isDestroyed() {
        return !!this._destroyed
    }
    destroy() {
        if (this._destroyed = !0, this._destroyCallbacks.forEach((A) => {
                try {
                    A()
                } catch (q) {
                    console.error(q)
                }
            }), this._subscriptions.clear(), this._assigned.clear(), this._trackedExperiments.clear(), this._completedChangeIds.clear(), this._deferredTrackingCalls.clear(), this._trackedFeatures = {}, this._destroyCallbacks = [], this._payload = void 0, this._saveStickyBucketAssignmentDoc = void 0, FJA(this), this.logs = [], n$6 && window._growthbook === this) delete window._growthbook;
        this._activeAutoExperiments.forEach((A) => {
            A.undo()
        }), this._activeAutoExperiments.clear(), this._triggeredExpKeys.clear()
    }
    setRenderer(A) {
        this._renderer = A
    }
    forceVariation(A, q) {
        if (this._options.forcedVariations = this._options.forcedVariations || {}, this._options.forcedVariations[A] = q, this._options.remoteEval) {
            this._refreshForRemoteEval();
            return
        }
        this._updateAllAutoExperiments(), this._render()
    }
    run(A) {
        let {
            result: q
        } = WA1(A, null, this._getEvalContext());
        return this._fireSubscriptions(A, q), q
    }
    triggerExperiment(A) {
        if (this._triggeredExpKeys.add(A), !this._options.experiments) return null;
        return this._options.experiments.filter((K) => K.key === A).map((K) => {
            return this._runAutoExperiment(K)
        }).filter((K) => K !== null)
    }
    triggerAutoExperiments() {
        this._autoExperimentsAllowed = !0, this._updateAllAutoExperiments(!0)
    }
    _getEvalContext() {
        return {
            user: this._getUserContext(),
            global: this._getGlobalContext(),
            stack: {
                evaluatedFeatures: new Set
            }
        }
    }
    _getUserContext() {
        return {
            attributes: this._options.user ? {
                ...this._options.user,
                ...this._options.attributes
            } : this._options.attributes,
            enableDevMode: this._options.enableDevMode,
            blockedChangeIds: this._options.blockedChangeIds,
            stickyBucketAssignmentDocs: this._options.stickyBucketAssignmentDocs,
            url: this._getContextUrl(),
            forcedVariations: this._options.forcedVariations,
            forcedFeatureValues: this._options.forcedFeatureValues,
            attributeOverrides: this._options.attributeOverrides,
            saveStickyBucketAssignmentDoc: this._saveStickyBucketAssignmentDoc,
            trackingCallback: this._options.trackingCallback,
            onFeatureUsage: this._options.onFeatureUsage,
            devLogs: this.logs,
            trackedExperiments: this._trackedExperiments,
            trackedFeatureUsage: this._trackedFeatures
        }
    }
    _getGlobalContext() {
        return {
            features: this._options.features,
            experiments: this._options.experiments,
            log: this.log,
            enabled: this._options.enabled,
            qaMode: this._options.qaMode,
            savedGroups: this._options.savedGroups,
            groups: this._options.groups,
            overrides: this._options.overrides,
            onExperimentEval: this._subscriptions.size > 0 ? this._fireSubscriptions : void 0,
            recordChangeId: this._recordChangedId,
            saveDeferredTrack: this._saveDeferredTrack,
            eventLogger: this._options.eventLogger
        }
    }
    _runAutoExperiment(A, q) {
        let K = this._activeAutoExperiments.get(A);
        if (A.manual && !this._triggeredExpKeys.has(A.key) && !K) return null;
        let Y = this._isAutoExperimentBlockedByContext(A),
            z, _;
        if (Y) z = FO(this._getEvalContext(), A, -1, !1, "");
        else({
            result: z,
            trackingCall: _
        } = WA1(A, null, this._getEvalContext())), this._fireSubscriptions(A, z);
        let w = JSON.stringify(z.value);
        if (!q && z.inExperiment && K && K.valueHash === w) return z;
        if (K) this._undoActiveAutoExperiment(A);
        if (z.inExperiment) {
            let O = jA1(A);
            if (O === "redirect" && z.value.urlRedirect && A.urlPatterns) {
                let $ = A.persistQueryString ? xJA(this._getContextUrl(), z.value.urlRedirect) : z.value.urlRedirect;
                if (HA1($, A.urlPatterns)) return this.log("Skipping redirect because original URL matches redirect URL", {
                    id: A.key
                }), z;
                this._redirectedUrl = $;
                let {
                    navigate: H,
                    delay: j
                } = this._getNavigateFunction();
                if (H)
                    if (n$6) Promise.all([..._ ? [JA1(_, this._options.maxNavigateDelay ?? 1000)] : [], new Promise((J) => window.setTimeout(J, this._options.navigateDelay ?? j))]).then(() => {
                        try {
                            H($)
                        } catch (J) {
                            console.error(J)
                        }
                    });
                    else try {
                        H($)
                    } catch (J) {
                        console.error(J)
                    }
            } else if (O === "visual") {
                let $ = this._options.applyDomChangesCallback ? this._options.applyDomChangesCallback(z.value) : this._applyDOMChanges(z.value);
                if ($) this._activeAutoExperiments.set(A, {
                    undo: $,
                    valueHash: w
                })
            }
        }
        return z
    }
    _undoActiveAutoExperiment(A) {
        let q = this._activeAutoExperiments.get(A);
        if (q) q.undo(), this._activeAutoExperiments.delete(A)
    }
    _updateAllAutoExperiments(A) {
        if (!this._autoExperimentsAllowed) return;
        let q = this._options.experiments || [],
            K = new Set(q);
        this._activeAutoExperiments.forEach((Y, z) => {
            if (!K.has(z)) Y.undo(), this._activeAutoExperiments.delete(z)
        });
        for (let Y of q) {
            let z = this._runAutoExperiment(Y, A);
            if (z !== null && z !== void 0 && z.inExperiment && jA1(Y) === "redirect") break
        }
    }
    _fireSubscriptions(A, q) {
        let K = A.key,
            Y = this._assigned.get(K);
        if (!Y || Y.result.inExperiment !== q.inExperiment || Y.result.variationId !== q.variationId) this._assigned.set(K, {
            experiment: A,
            result: q
        }), this._subscriptions.forEach((z) => {
            try {
                z(A, q)
            } catch (_) {
                console.error(_)
            }
        })
    }
    _recordChangedId(A) {
        this._completedChangeIds.add(A)
    }
    isOn(A) {
        return this.evalFeature(A).on
    }
    isOff(A) {
        return this.evalFeature(A).off
    }
    getFeatureValue(A, q) {
        let K = this.evalFeature(A).value;
        return K === null ? q : K
    }
    feature(A) {
        return this.evalFeature(A)
    }
    evalFeature(A) {
        return PA1(A, this._getEvalContext())
    }
    log(A, q) {
        if (!this.debug) return;
        if (this._options.log) this._options.log(A, q);
        else console.log(A, q)
    }
    getDeferredTrackingCalls() {
        return Array.from(this._deferredTrackingCalls.values())
    }
    setDeferredTrackingCalls(A) {
        this._deferredTrackingCalls = new Map(A.filter((q) => q && q.experiment && q.result).map((q) => {
            return [ZA1(q.experiment, q.result), q]
        }))
    }
    async fireDeferredTrackingCalls() {
        if (!this._options.trackingCallback) return;
        let A = [];
        this._deferredTrackingCalls.forEach((q) => {
            if (!q || !q.experiment || !q.result) console.error("Invalid deferred tracking call", {
                call: q
            });
            else A.push(this._options.trackingCallback(q.experiment, q.result))
        }), this._deferredTrackingCalls.clear(), await Promise.all(A)
    }
    setTrackingCallback(A) {
        this._options.trackingCallback = A, this.fireDeferredTrackingCalls()
    }
    setEventLogger(A) {
        this._options.eventLogger = A
    }
    async logEvent(A, q) {
        if (this._destroyed) {
            console.error("Cannot log event to destroyed GrowthBook instance");
            return
        }
        if (this._options.enableDevMode) this.logs.push({
            eventName: A,
            properties: q,
            timestamp: Date.now().toString(),
            logType: "event"
        });
        if (this._options.eventLogger) try {
            await this._options.eventLogger(A, q || {}, this._getUserContext())
        } catch (K) {
            console.error(K)
        } else console.error("No event logger configured")
    }
    _saveDeferredTrack(A) {
        this._deferredTrackingCalls.set(ZA1(A.experiment, A.result), A)
    }
    _getContextUrl() {
        return this._options.url || (n$6 ? window.location.href : "")
    }
    _isAutoExperimentBlockedByContext(A) {
        let q = jA1(A);
        if (q === "visual") {
            if (this._options.disableVisualExperiments) return !0;
            if (this._options.disableJsInjection) {
                if (A.variations.some((K) => K.js)) return !0
            }
        } else if (q === "redirect") {
            if (this._options.disableUrlRedirectExperiments) return !0;
            try {
                let K = new URL(this._getContextUrl());
                for (let Y of A.variations) {
                    if (!Y || !Y.urlRedirect) continue;
                    let z = new URL(Y.urlRedirect);
                    if (this._options.disableCrossOriginUrlRedirectExperiments) {
                        if (z.protocol !== K.protocol) return !0;
                        if (z.host !== K.host) return !0
                    }
                }
            } catch (K) {
                return this.log("Error parsing current or redirect URL", {
                    id: A.key,
                    error: K
                }), !0
            }
        } else return !0;
        if (A.changeId && (this._options.blockedChangeIds || []).includes(A.changeId)) return !0;
        return !1
    }
    getRedirectUrl() {
        return this._redirectedUrl
    }
    _getNavigateFunction() {
        if (this._options.navigate) return {
            navigate: this._options.navigate,
            delay: 0
        };
        else if (n$6) return {
            navigate: (A) => {
                window.location.replace(A)
            },
            delay: 100
        };
        return {
            navigate: null,
            delay: 0
        }
    }
    _applyDOMChanges(A) {
        if (!n$6) return;
        let q = [];
        if (A.css) {
            let K = document.createElement("style");
            K.innerHTML = A.css, document.head.appendChild(K), q.push(() => K.remove())
        }
        if (A.js) {
            let K = document.createElement("script");
            if (K.innerHTML = A.js, this._options.jsInjectionNonce) K.nonce = this._options.jsInjectionNonce;
            document.head.appendChild(K), q.push(() => K.remove())
        }
        if (A.domMutations) A.domMutations.forEach((K) => {
            q.push(qMA.default.declarative(K).revert)
        });
        return () => {
            q.forEach((K) => K())
        }
    }
    async refreshStickyBuckets(A) {
        if (this._options.stickyBucketService) {
            let q = this._getEvalContext(),
                K = await sJA(q, this._options.stickyBucketService, A);
            this._options.stickyBucketAssignmentDocs = K
        }
    }
    generateStickyBucketAssignmentDocsSync(A, q) {
        if (!("getAllAssignmentsSync" in A)) {
            console.error("generating StickyBucketAssignmentDocs docs requires StickyBucketServiceSync");
            return
        }
        let K = this._getEvalContext(),
            Y = Di1(K, q);
        return A.getAllAssignmentsSync(Y)
    }
    inDevMode() {
        return !!this._options.enableDevMode
    }
}
// @from(Ln 43542, Col 4)
qMA
// @from(Ln 43542, Col 9)
n$6
// @from(Ln 43542, Col 14)
LHK
// @from(Ln 43543, Col 4)
KMA = E(() => {
    zR6();
    dJA();
    AMA();
    qMA = t(kJA(), 1), n$6 = typeof window < "u" && typeof document < "u", LHK = bJA()
})
// @from(Ln 43549, Col 4)
YMA = E(() => {
    KMA()
})
// @from(Ln 43552, Col 4)
zMA = "sdk-zAZezfDKGoZuXXKe"
// @from(Ln 43553, Col 4)
_MA = E(() => {
    A8()
})
// @from(Ln 43556, Col 0)
async function wMA() {
    if ($R6 === null && !OR6) OR6 = hHK(), $R6 = await OR6, OR6 = null, Pr.cache.clear?.()
}
// @from(Ln 43560, Col 0)
function r$6() {
    $R6 = null, OR6 = null, Pr.cache.clear?.()
}
// @from(Ln 43564, Col 0)
function OMA() {
    return Pr(!0)
}
// @from(Ln 43568, Col 0)
function RHK() {
    if ($R6 !== null) return $R6;
    let A = L3();
    if (A?.emailAddress) return A.emailAddress;
    return
}
// @from(Ln 43574, Col 0)
async function hHK() {
    let A = L3();
    if (A?.emailAddress) return A.emailAddress;
    return
}
// @from(Ln 43579, Col 4)
$R6 = null
// @from(Ln 43580, Col 4)
OR6 = null
// @from(Ln 43581, Col 4)
Pr
// @from(Ln 43582, Col 4)
_76 = E(() => {
    k8();
    U4();
    T1();
    fA();
    WW();
    d3();
    A8();
    Pr = e1((A) => {
        let q = Jy(),
            K = X1(),
            Y, z, _;
        if (A) {
            if (Y = CK() ?? void 0, z = ox() ?? void 0, Y && K.claudeCodeFirstTokenDate) {
                let H = new Date(K.claudeCodeFirstTokenDate).getTime();
                if (!isNaN(H)) _ = H
            }
        }
        let w = L3(),
            O = w?.organizationUuid,
            $ = w?.accountUuid;
        return {
            deviceId: q,
            sessionId: R1(),
            email: RHK(),
            appVersion: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.76",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-03-14T00:12:49Z"
            }.VERSION,
            platform: T$6(),
            organizationUuid: O,
            accountUuid: $,
            userType: "external",
            subscriptionType: Y,
            rateLimitTier: z,
            firstTokenTime: _,
            ...t6(process.env.GITHUB_ACTIONS) && {
                githubActionsMetadata: {
                    actor: process.env.GITHUB_ACTOR,
                    actorId: process.env.GITHUB_ACTOR_ID,
                    repository: process.env.GITHUB_REPOSITORY,
                    repositoryId: process.env.GITHUB_REPOSITORY_ID,
                    repositoryOwner: process.env.GITHUB_REPOSITORY_OWNER,
                    repositoryOwnerId: process.env.GITHUB_REPOSITORY_OWNER_ID
                }
            }
        }
    })
})
// @from(Ln 43636, Col 0)
function My() {
    return t6(process.env.CLAUDE_CODE_USE_BEDROCK) || t6(process.env.CLAUDE_CODE_USE_VERTEX) || t6(process.env.CLAUDE_CODE_USE_FOUNDRY) || !!process.env.DISABLE_TELEMETRY || !!process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC
}
// @from(Ln 43640, Col 0)
function fA1() {
    return !!process.env.DISABLE_TELEMETRY || !!process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC
}
// @from(Ln 43643, Col 4)
ip = E(() => {
    A8()
})
// @from(Ln 43646, Col 4)
jMA = x(($MA) => {
    Object.defineProperty($MA, "__esModule", {
        value: !0
    });
    $MA._globalThis = void 0;
    $MA._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Ln 43653, Col 4)
JMA = x((w76) => {
    var SHK = w76 && w76.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            Object.defineProperty(A, Y, {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            })
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        CHK = w76 && w76.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) SHK(q, A, K)
        };
    Object.defineProperty(w76, "__esModule", {
        value: !0
    });
    CHK(jMA(), w76)
})
// @from(Ln 43675, Col 4)
MMA = x((O76) => {
    var IHK = O76 && O76.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            Object.defineProperty(A, Y, {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            })
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        bHK = O76 && O76.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) IHK(q, A, K)
        };
    Object.defineProperty(O76, "__esModule", {
        value: !0
    });
    bHK(JMA(), O76)
})
// @from(Ln 43697, Col 4)
Xi1 = x((DMA) => {
    Object.defineProperty(DMA, "__esModule", {
        value: !0
    });
    DMA.VERSION = void 0;
    DMA.VERSION = "1.9.0"
})
// @from(Ln 43704, Col 4)
fMA = x((ZMA) => {
    Object.defineProperty(ZMA, "__esModule", {
        value: !0
    });
    ZMA.isCompatible = ZMA._makeCompatibilityCheck = void 0;
    var xHK = Xi1(),
        PMA = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;

    function WMA(A) {
        let q = new Set([A]),
            K = new Set,
            Y = A.match(PMA);
        if (!Y) return () => !1;
        let z = {
            major: +Y[1],
            minor: +Y[2],
            patch: +Y[3],
            prerelease: Y[4]
        };
        if (z.prerelease != null) return function($) {
            return $ === A
        };

        function _(O) {
            return K.add(O), !1
        }

        function w(O) {
            return q.add(O), !0
        }
        return function($) {
            if (q.has($)) return !0;
            if (K.has($)) return !1;
            let H = $.match(PMA);
            if (!H) return _($);
            let j = {
                major: +H[1],
                minor: +H[2],
                patch: +H[3],
                prerelease: H[4]
            };
            if (j.prerelease != null) return _($);
            if (z.major !== j.major) return _($);
            if (z.major === 0) {
                if (z.minor === j.minor && z.patch <= j.patch) return w($);
                return _($)
            }
            if (z.minor <= j.minor) return w($);
            return _($)
        }
    }
    ZMA._makeCompatibilityCheck = WMA;
    ZMA.isCompatible = WMA(xHK.VERSION)
})
// @from(Ln 43758, Col 4)
$76 = x((TMA) => {
    Object.defineProperty(TMA, "__esModule", {
        value: !0
    });
    TMA.unregisterGlobal = TMA.getGlobal = TMA.registerGlobal = void 0;
    var mHK = MMA(),
        o$6 = Xi1(),
        BHK = fMA(),
        gHK = o$6.VERSION.split(".")[0],
        HR6 = Symbol.for(`opentelemetry.js.api.${gHK}`),
        jR6 = mHK._globalThis;

    function FHK(A, q, K, Y = !1) {
        var z;
        let _ = jR6[HR6] = (z = jR6[HR6]) !== null && z !== void 0 ? z : {
            version: o$6.VERSION
        };
        if (!Y && _[A]) {
            let w = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${A}`);
            return K.error(w.stack || w.message), !1
        }
        if (_.version !== o$6.VERSION) {
            let w = Error(`@opentelemetry/api: Registration of version v${_.version} for ${A} does not match previously registered API v${o$6.VERSION}`);
            return K.error(w.stack || w.message), !1
        }
        return _[A] = q, K.debug(`@opentelemetry/api: Registered a global for ${A} v${o$6.VERSION}.`), !0
    }
    TMA.registerGlobal = FHK;

    function pHK(A) {
        var q, K;
        let Y = (q = jR6[HR6]) === null || q === void 0 ? void 0 : q.version;
        if (!Y || !(0, BHK.isCompatible)(Y)) return;
        return (K = jR6[HR6]) === null || K === void 0 ? void 0 : K[A]
    }
    TMA.getGlobal = pHK;

    function QHK(A, q) {
        q.debug(`@opentelemetry/api: Unregistering a global for ${A} v${o$6.VERSION}.`);
        let K = jR6[HR6];
        if (K) delete K[A]
    }
    TMA.unregisterGlobal = QHK
})
// @from(Ln 43802, Col 4)
EMA = x((VMA) => {
    Object.defineProperty(VMA, "__esModule", {
        value: !0
    });
    VMA.DiagComponentLogger = void 0;
    var cHK = $76();
    class NMA {
        constructor(A) {
            this._namespace = A.namespace || "DiagComponentLogger"
        }
        debug(...A) {
            return JR6("debug", this._namespace, A)
        }
        error(...A) {
            return JR6("error", this._namespace, A)
        }
        info(...A) {
            return JR6("info", this._namespace, A)
        }
        warn(...A) {
            return JR6("warn", this._namespace, A)
        }
        verbose(...A) {
            return JR6("verbose", this._namespace, A)
        }
    }
    VMA.DiagComponentLogger = NMA;

    function JR6(A, q, K) {
        let Y = (0, cHK.getGlobal)("diag");
        if (!Y) return;
        return K.unshift(q), Y[A](...K)
    }
})
// @from(Ln 43836, Col 4)
TA1 = x((yMA) => {
    Object.defineProperty(yMA, "__esModule", {
        value: !0
    });
    yMA.DiagLogLevel = void 0;
    var lHK;
    (function(A) {
        A[A.NONE = 0] = "NONE", A[A.ERROR = 30] = "ERROR", A[A.WARN = 50] = "WARN", A[A.INFO = 60] = "INFO", A[A.DEBUG = 70] = "DEBUG", A[A.VERBOSE = 80] = "VERBOSE", A[A.ALL = 9999] = "ALL"
    })(lHK = yMA.DiagLogLevel || (yMA.DiagLogLevel = {}))
})
// @from(Ln 43846, Col 4)
hMA = x((LMA) => {
    Object.defineProperty(LMA, "__esModule", {
        value: !0
    });
    LMA.createLogLevelDiagLogger = void 0;
    var np = TA1();

    function iHK(A, q) {
        if (A < np.DiagLogLevel.NONE) A = np.DiagLogLevel.NONE;
        else if (A > np.DiagLogLevel.ALL) A = np.DiagLogLevel.ALL;
        q = q || {};

        function K(Y, z) {
            let _ = q[Y];
            if (typeof _ === "function" && A >= z) return _.bind(q);
            return function() {}
        }
        return {
            error: K("error", np.DiagLogLevel.ERROR),
            warn: K("warn", np.DiagLogLevel.WARN),
            info: K("info", np.DiagLogLevel.INFO),
            debug: K("debug", np.DiagLogLevel.DEBUG),
            verbose: K("verbose", np.DiagLogLevel.VERBOSE)
        }
    }
    LMA.createLogLevelDiagLogger = iHK
})
// @from(Ln 43873, Col 4)
H76 = x((CMA) => {
    Object.defineProperty(CMA, "__esModule", {
        value: !0
    });
    CMA.DiagAPI = void 0;
    var nHK = EMA(),
        rHK = hMA(),
        SMA = TA1(),
        vA1 = $76(),
        oHK = "diag";
    class Wi1 {
        constructor() {
            function A(Y) {
                return function(...z) {
                    let _ = (0, vA1.getGlobal)("diag");
                    if (!_) return;
                    return _[Y](...z)
                }
            }
            let q = this,
                K = (Y, z = {
                    logLevel: SMA.DiagLogLevel.INFO
                }) => {
                    var _, w, O;
                    if (Y === q) {
                        let j = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                        return q.error((_ = j.stack) !== null && _ !== void 0 ? _ : j.message), !1
                    }
                    if (typeof z === "number") z = {
                        logLevel: z
                    };
                    let $ = (0, vA1.getGlobal)("diag"),
                        H = (0, rHK.createLogLevelDiagLogger)((w = z.logLevel) !== null && w !== void 0 ? w : SMA.DiagLogLevel.INFO, Y);
                    if ($ && !z.suppressOverrideMessage) {
                        let j = (O = Error().stack) !== null && O !== void 0 ? O : "<failed to generate stacktrace>";
                        $.warn(`Current logger will be overwritten from ${j}`), H.warn(`Current logger will overwrite one already registered from ${j}`)
                    }
                    return (0, vA1.registerGlobal)("diag", H, q, !0)
                };
            q.setLogger = K, q.disable = () => {
                (0, vA1.unregisterGlobal)(oHK, q)
            }, q.createComponentLogger = (Y) => {
                return new nHK.DiagComponentLogger(Y)
            }, q.verbose = A("verbose"), q.debug = A("debug"), q.info = A("info"), q.warn = A("warn"), q.error = A("error")
        }
        static instance() {
            if (!this._instance) this._instance = new Wi1;
            return this._instance
        }
    }
    CMA.DiagAPI = Wi1
})
// @from(Ln 43925, Col 4)
uMA = x((bMA) => {
    Object.defineProperty(bMA, "__esModule", {
        value: !0
    });
    bMA.BaggageImpl = void 0;
    class a$6 {
        constructor(A) {
            this._entries = A ? new Map(A) : new Map
        }
        getEntry(A) {
            let q = this._entries.get(A);
            if (!q) return;
            return Object.assign({}, q)
        }
        getAllEntries() {
            return Array.from(this._entries.entries()).map(([A, q]) => [A, q])
        }
        setEntry(A, q) {
            let K = new a$6(this._entries);
            return K._entries.set(A, q), K
        }
        removeEntry(A) {
            let q = new a$6(this._entries);
            return q._entries.delete(A), q
        }
        removeEntries(...A) {
            let q = new a$6(this._entries);
            for (let K of A) q._entries.delete(K);
            return q
        }
        clear() {
            return new a$6
        }
    }
    bMA.BaggageImpl = a$6
})
// @from(Ln 43961, Col 4)
gMA = x((mMA) => {
    Object.defineProperty(mMA, "__esModule", {
        value: !0
    });
    mMA.baggageEntryMetadataSymbol = void 0;
    mMA.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata")
})
// @from(Ln 43968, Col 4)
Zi1 = x((FMA) => {
    Object.defineProperty(FMA, "__esModule", {
        value: !0
    });
    FMA.baggageEntryMetadataFromString = FMA.createBaggage = void 0;
    var aHK = H76(),
        sHK = uMA(),
        tHK = gMA(),
        eHK = aHK.DiagAPI.instance();

    function AjK(A = {}) {
        return new sHK.BaggageImpl(new Map(Object.entries(A)))
    }
    FMA.createBaggage = AjK;

    function qjK(A) {
        if (typeof A !== "string") eHK.error(`Cannot create baggage metadata from unknown type: ${typeof A}`), A = "";
        return {
            __TYPE__: tHK.baggageEntryMetadataSymbol,
            toString() {
                return A
            }
        }
    }
    FMA.baggageEntryMetadataFromString = qjK
})
// @from(Ln 43994, Col 4)
MR6 = x((QMA) => {
    Object.defineProperty(QMA, "__esModule", {
        value: !0
    });
    QMA.ROOT_CONTEXT = QMA.createContextKey = void 0;

    function YjK(A) {
        return Symbol.for(A)
    }
    QMA.createContextKey = YjK;
    class NA1 {
        constructor(A) {
            let q = this;
            q._currentContext = A ? new Map(A) : new Map, q.getValue = (K) => q._currentContext.get(K), q.setValue = (K, Y) => {
                let z = new NA1(q._currentContext);
                return z._currentContext.set(K, Y), z
            }, q.deleteValue = (K) => {
                let Y = new NA1(q._currentContext);
                return Y._currentContext.delete(K), Y
            }
        }
    }
    QMA.ROOT_CONTEXT = new NA1
})
// @from(Ln 44018, Col 4)
iMA = x((cMA) => {
    Object.defineProperty(cMA, "__esModule", {
        value: !0
    });
    cMA.DiagConsoleLogger = void 0;
    var Gi1 = [{
        n: "error",
        c: "error"
    }, {
        n: "warn",
        c: "warn"
    }, {
        n: "info",
        c: "info"
    }, {
        n: "debug",
        c: "debug"
    }, {
        n: "verbose",
        c: "trace"
    }];
    class dMA {
        constructor() {
            function A(q) {
                return function(...K) {
                    if (console) {
                        let Y = console[q];
                        if (typeof Y !== "function") Y = console.log;
                        if (typeof Y === "function") return Y.apply(console, K)
                    }
                }
            }
            for (let q = 0; q < Gi1.length; q++) this[Gi1[q].n] = A(Gi1[q].c)
        }
    }
    cMA.DiagConsoleLogger = dMA
})
// @from(Ln 44055, Col 4)
Li1 = x((nMA) => {
    Object.defineProperty(nMA, "__esModule", {
        value: !0
    });
    nMA.createNoopMeter = nMA.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = nMA.NOOP_OBSERVABLE_GAUGE_METRIC = nMA.NOOP_OBSERVABLE_COUNTER_METRIC = nMA.NOOP_UP_DOWN_COUNTER_METRIC = nMA.NOOP_HISTOGRAM_METRIC = nMA.NOOP_GAUGE_METRIC = nMA.NOOP_COUNTER_METRIC = nMA.NOOP_METER = nMA.NoopObservableUpDownCounterMetric = nMA.NoopObservableGaugeMetric = nMA.NoopObservableCounterMetric = nMA.NoopObservableMetric = nMA.NoopHistogramMetric = nMA.NoopGaugeMetric = nMA.NoopUpDownCounterMetric = nMA.NoopCounterMetric = nMA.NoopMetric = nMA.NoopMeter = void 0;
    class fi1 {
        constructor() {}
        createGauge(A, q) {
            return nMA.NOOP_GAUGE_METRIC
        }
        createHistogram(A, q) {
            return nMA.NOOP_HISTOGRAM_METRIC
        }
        createCounter(A, q) {
            return nMA.NOOP_COUNTER_METRIC
        }
        createUpDownCounter(A, q) {
            return nMA.NOOP_UP_DOWN_COUNTER_METRIC
        }
        createObservableGauge(A, q) {
            return nMA.NOOP_OBSERVABLE_GAUGE_METRIC
        }
        createObservableCounter(A, q) {
            return nMA.NOOP_OBSERVABLE_COUNTER_METRIC
        }
        createObservableUpDownCounter(A, q) {
            return nMA.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC
        }
        addBatchObservableCallback(A, q) {}
        removeBatchObservableCallback(A) {}
    }
    nMA.NoopMeter = fi1;
    class s$6 {}
    nMA.NoopMetric = s$6;
    class Ti1 extends s$6 {
        add(A, q) {}
    }
    nMA.NoopCounterMetric = Ti1;
    class vi1 extends s$6 {
        add(A, q) {}
    }
    nMA.NoopUpDownCounterMetric = vi1;
    class Ni1 extends s$6 {
        record(A, q) {}
    }
    nMA.NoopGaugeMetric = Ni1;
    class Vi1 extends s$6 {
        record(A, q) {}
    }
    nMA.NoopHistogramMetric = Vi1;
    class DR6 {
        addCallback(A) {}
        removeCallback(A) {}
    }
    nMA.NoopObservableMetric = DR6;
    class ki1 extends DR6 {}
    nMA.NoopObservableCounterMetric = ki1;
    class Ei1 extends DR6 {}
    nMA.NoopObservableGaugeMetric = Ei1;
    class yi1 extends DR6 {}
    nMA.NoopObservableUpDownCounterMetric = yi1;
    nMA.NOOP_METER = new fi1;
    nMA.NOOP_COUNTER_METRIC = new Ti1;
    nMA.NOOP_GAUGE_METRIC = new Ni1;
    nMA.NOOP_HISTOGRAM_METRIC = new Vi1;
    nMA.NOOP_UP_DOWN_COUNTER_METRIC = new vi1;
    nMA.NOOP_OBSERVABLE_COUNTER_METRIC = new ki1;
    nMA.NOOP_OBSERVABLE_GAUGE_METRIC = new Ei1;
    nMA.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new yi1;

    function _jK() {
        return nMA.NOOP_METER
    }
    nMA.createNoopMeter = _jK
})
// @from(Ln 44130, Col 4)
zDA = x((YDA) => {
    Object.defineProperty(YDA, "__esModule", {
        value: !0
    });
    YDA.ValueType = void 0;
    var WjK;
    (function(A) {
        A[A.INT = 0] = "INT", A[A.DOUBLE = 1] = "DOUBLE"
    })(WjK = YDA.ValueType || (YDA.ValueType = {}))
})
// @from(Ln 44140, Col 4)
hi1 = x((_DA) => {
    Object.defineProperty(_DA, "__esModule", {
        value: !0
    });
    _DA.defaultTextMapSetter = _DA.defaultTextMapGetter = void 0;
    _DA.defaultTextMapGetter = {
        get(A, q) {
            if (A == null) return;
            return A[q]
        },
        keys(A) {
            if (A == null) return [];
            return Object.keys(A)
        }
    };
    _DA.defaultTextMapSetter = {
        set(A, q, K) {
            if (A == null) return;
            A[q] = K
        }
    }
})
// @from(Ln 44162, Col 4)
jDA = x(($DA) => {
    Object.defineProperty($DA, "__esModule", {
        value: !0
    });
    $DA.NoopContextManager = void 0;
    var GjK = MR6();
    class ODA {
        active() {
            return GjK.ROOT_CONTEXT
        }
        with(A, q, K, ...Y) {
            return q.call(K, ...Y)
        }
        bind(A, q) {
            return q
        }
        enable() {
            return this
        }
        disable() {
            return this
        }
    }
    $DA.NoopContextManager = ODA
})
// @from(Ln 44187, Col 4)
XR6 = x((MDA) => {
    Object.defineProperty(MDA, "__esModule", {
        value: !0
    });
    MDA.ContextAPI = void 0;
    var fjK = jDA(),
        Si1 = $76(),
        JDA = H76(),
        Ci1 = "context",
        TjK = new fjK.NoopContextManager;
    class Ii1 {
        constructor() {}
        static getInstance() {
            if (!this._instance) this._instance = new Ii1;
            return this._instance
        }
        setGlobalContextManager(A) {
            return (0, Si1.registerGlobal)(Ci1, A, JDA.DiagAPI.instance())
        }
        active() {
            return this._getContextManager().active()
        }
        with(A, q, K, ...Y) {
            return this._getContextManager().with(A, q, K, ...Y)
        }
        bind(A, q) {
            return this._getContextManager().bind(A, q)
        }
        _getContextManager() {
            return (0, Si1.getGlobal)(Ci1) || TjK
        }
        disable() {
            this._getContextManager().disable(), (0, Si1.unregisterGlobal)(Ci1, JDA.DiagAPI.instance())
        }
    }
    MDA.ContextAPI = Ii1
})
// @from(Ln 44224, Col 4)
xi1 = x((XDA) => {
    Object.defineProperty(XDA, "__esModule", {
        value: !0
    });
    XDA.TraceFlags = void 0;
    var vjK;
    (function(A) {
        A[A.NONE = 0] = "NONE", A[A.SAMPLED = 1] = "SAMPLED"
    })(vjK = XDA.TraceFlags || (XDA.TraceFlags = {}))
})
// @from(Ln 44234, Col 4)
VA1 = x((PDA) => {
    Object.defineProperty(PDA, "__esModule", {
        value: !0
    });
    PDA.INVALID_SPAN_CONTEXT = PDA.INVALID_TRACEID = PDA.INVALID_SPANID = void 0;
    var NjK = xi1();
    PDA.INVALID_SPANID = "0000000000000000";
    PDA.INVALID_TRACEID = "00000000000000000000000000000000";
    PDA.INVALID_SPAN_CONTEXT = {
        traceId: PDA.INVALID_TRACEID,
        spanId: PDA.INVALID_SPANID,
        traceFlags: NjK.TraceFlags.NONE
    }
})
// @from(Ln 44248, Col 4)
kA1 = x((TDA) => {
    Object.defineProperty(TDA, "__esModule", {
        value: !0
    });
    TDA.NonRecordingSpan = void 0;
    var VjK = VA1();
    class fDA {
        constructor(A = VjK.INVALID_SPAN_CONTEXT) {
            this._spanContext = A
        }
        spanContext() {
            return this._spanContext
        }
        setAttribute(A, q) {
            return this
        }
        setAttributes(A) {
            return this
        }
        addEvent(A, q) {
            return this
        }
        addLink(A) {
            return this
        }
        addLinks(A) {
            return this
        }
        setStatus(A) {
            return this
        }
        updateName(A) {
            return this
        }
        end(A) {}
        isRecording() {
            return !1
        }
        recordException(A, q) {}
    }
    TDA.NonRecordingSpan = fDA
})
// @from(Ln 44290, Col 4)
Bi1 = x((VDA) => {
    Object.defineProperty(VDA, "__esModule", {
        value: !0
    });
    VDA.getSpanContext = VDA.setSpanContext = VDA.deleteSpan = VDA.setSpan = VDA.getActiveSpan = VDA.getSpan = void 0;
    var kjK = MR6(),
        EjK = kA1(),
        yjK = XR6(),
        ui1 = (0, kjK.createContextKey)("OpenTelemetry Context Key SPAN");

    function mi1(A) {
        return A.getValue(ui1) || void 0
    }
    VDA.getSpan = mi1;

    function LjK() {
        return mi1(yjK.ContextAPI.getInstance().active())
    }
    VDA.getActiveSpan = LjK;

    function NDA(A, q) {
        return A.setValue(ui1, q)
    }
    VDA.setSpan = NDA;

    function RjK(A) {
        return A.deleteValue(ui1)
    }
    VDA.deleteSpan = RjK;

    function hjK(A, q) {
        return NDA(A, new EjK.NonRecordingSpan(q))
    }
    VDA.setSpanContext = hjK;

    function SjK(A) {
        var q;
        return (q = mi1(A)) === null || q === void 0 ? void 0 : q.spanContext()
    }
    VDA.getSpanContext = SjK
})
// @from(Ln 44331, Col 4)
EA1 = x((RDA) => {
    Object.defineProperty(RDA, "__esModule", {
        value: !0
    });
    RDA.wrapSpanContext = RDA.isSpanContextValid = RDA.isValidSpanId = RDA.isValidTraceId = void 0;
    var EDA = VA1(),
        mjK = kA1(),
        BjK = /^([0-9a-f]{32})$/i,
        gjK = /^[0-9a-f]{16}$/i;

    function yDA(A) {
        return BjK.test(A) && A !== EDA.INVALID_TRACEID
    }
    RDA.isValidTraceId = yDA;

    function LDA(A) {
        return gjK.test(A) && A !== EDA.INVALID_SPANID
    }
    RDA.isValidSpanId = LDA;

    function FjK(A) {
        return yDA(A.traceId) && LDA(A.spanId)
    }
    RDA.isSpanContextValid = FjK;

    function pjK(A) {
        return new mjK.NonRecordingSpan(A)
    }
    RDA.wrapSpanContext = pjK
})
// @from(Ln 44361, Col 4)
pi1 = x((IDA) => {
    Object.defineProperty(IDA, "__esModule", {
        value: !0
    });
    IDA.NoopTracer = void 0;
    var cjK = XR6(),
        SDA = Bi1(),
        gi1 = kA1(),
        ljK = EA1(),
        Fi1 = cjK.ContextAPI.getInstance();
    class CDA {
        startSpan(A, q, K = Fi1.active()) {
            if (Boolean(q === null || q === void 0 ? void 0 : q.root)) return new gi1.NonRecordingSpan;
            let z = K && (0, SDA.getSpanContext)(K);
            if (ijK(z) && (0, ljK.isSpanContextValid)(z)) return new gi1.NonRecordingSpan(z);
            else return new gi1.NonRecordingSpan
        }
        startActiveSpan(A, q, K, Y) {
            let z, _, w;
            if (arguments.length < 2) return;
            else if (arguments.length === 2) w = q;
            else if (arguments.length === 3) z = q, w = K;
            else z = q, _ = K, w = Y;
            let O = _ !== null && _ !== void 0 ? _ : Fi1.active(),
                $ = this.startSpan(A, z, O),
                H = (0, SDA.setSpan)(O, $);
            return Fi1.with(H, w, void 0, $)
        }
    }
    IDA.NoopTracer = CDA;

    function ijK(A) {
        return typeof A === "object" && typeof A.spanId === "string" && typeof A.traceId === "string" && typeof A.traceFlags === "number"
    }
})
// @from(Ln 44396, Col 4)
Qi1 = x((uDA) => {
    Object.defineProperty(uDA, "__esModule", {
        value: !0
    });
    uDA.ProxyTracer = void 0;
    var njK = pi1(),
        rjK = new njK.NoopTracer;
    class xDA {
        constructor(A, q, K, Y) {
            this._provider = A, this.name = q, this.version = K, this.options = Y
        }
        startSpan(A, q, K) {
            return this._getTracer().startSpan(A, q, K)
        }
        startActiveSpan(A, q, K, Y) {
            let z = this._getTracer();
            return Reflect.apply(z.startActiveSpan, z, arguments)
        }
        _getTracer() {
            if (this._delegate) return this._delegate;
            let A = this._provider.getDelegateTracer(this.name, this.version, this.options);
            if (!A) return rjK;
            return this._delegate = A, this._delegate
        }
    }
    uDA.ProxyTracer = xDA
})
// @from(Ln 44423, Col 4)
pDA = x((gDA) => {
    Object.defineProperty(gDA, "__esModule", {
        value: !0
    });
    gDA.NoopTracerProvider = void 0;
    var ojK = pi1();
    class BDA {
        getTracer(A, q, K) {
            return new ojK.NoopTracer
        }
    }
    gDA.NoopTracerProvider = BDA
})
// @from(Ln 44436, Col 4)
Ui1 = x((UDA) => {
    Object.defineProperty(UDA, "__esModule", {
        value: !0
    });
    UDA.ProxyTracerProvider = void 0;
    var ajK = Qi1(),
        sjK = pDA(),
        tjK = new sjK.NoopTracerProvider;
    class QDA {
        getTracer(A, q, K) {
            var Y;
            return (Y = this.getDelegateTracer(A, q, K)) !== null && Y !== void 0 ? Y : new ajK.ProxyTracer(this, A, q, K)
        }
        getDelegate() {
            var A;
            return (A = this._delegate) !== null && A !== void 0 ? A : tjK
        }
        setDelegate(A) {
            this._delegate = A
        }
        getDelegateTracer(A, q, K) {
            var Y;
            return (Y = this._delegate) === null || Y === void 0 ? void 0 : Y.getTracer(A, q, K)
        }
    }
    UDA.ProxyTracerProvider = QDA
})
// @from(Ln 44463, Col 4)
lDA = x((cDA) => {
    Object.defineProperty(cDA, "__esModule", {
        value: !0
    });
    cDA.SamplingDecision = void 0;
    var ejK;
    (function(A) {
        A[A.NOT_RECORD = 0] = "NOT_RECORD", A[A.RECORD = 1] = "RECORD", A[A.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED"
    })(ejK = cDA.SamplingDecision || (cDA.SamplingDecision = {}))
})
// @from(Ln 44473, Col 4)
nDA = x((iDA) => {
    Object.defineProperty(iDA, "__esModule", {
        value: !0
    });
    iDA.SpanKind = void 0;
    var AJK;
    (function(A) {
        A[A.INTERNAL = 0] = "INTERNAL", A[A.SERVER = 1] = "SERVER", A[A.CLIENT = 2] = "CLIENT", A[A.PRODUCER = 3] = "PRODUCER", A[A.CONSUMER = 4] = "CONSUMER"
    })(AJK = iDA.SpanKind || (iDA.SpanKind = {}))
})
// @from(Ln 44483, Col 4)
oDA = x((rDA) => {
    Object.defineProperty(rDA, "__esModule", {
        value: !0
    });
    rDA.SpanStatusCode = void 0;
    var qJK;
    (function(A) {
        A[A.UNSET = 0] = "UNSET", A[A.OK = 1] = "OK", A[A.ERROR = 2] = "ERROR"
    })(qJK = rDA.SpanStatusCode || (rDA.SpanStatusCode = {}))
})
// @from(Ln 44493, Col 4)
tDA = x((aDA) => {
    Object.defineProperty(aDA, "__esModule", {
        value: !0
    });
    aDA.validateValue = aDA.validateKey = void 0;
    var ii1 = "[_0-9a-z-*/]",
        KJK = `[a-z]${ii1}{0,255}`,
        YJK = `[a-z0-9]${ii1}{0,240}@[a-z]${ii1}{0,13}`,
        zJK = new RegExp(`^(?:${KJK}|${YJK})$`),
        _JK = /^[ -~]{0,255}[!-~]$/,
        wJK = /,|=/;

    function OJK(A) {
        return zJK.test(A)
    }
    aDA.validateKey = OJK;

    function $JK(A) {
        return _JK.test(A) && !wJK.test(A)
    }
    aDA.validateValue = $JK
})
// @from(Ln 44515, Col 4)
_XA = x((YXA) => {
    Object.defineProperty(YXA, "__esModule", {
        value: !0
    });
    YXA.TraceStateImpl = void 0;
    var eDA = tDA(),
        AXA = 32,
        jJK = 512,
        qXA = ",",
        KXA = "=";
    class ni1 {
        constructor(A) {
            if (this._internalState = new Map, A) this._parse(A)
        }
        set(A, q) {
            let K = this._clone();
            if (K._internalState.has(A)) K._internalState.delete(A);
            return K._internalState.set(A, q), K
        }
        unset(A) {
            let q = this._clone();
            return q._internalState.delete(A), q
        }
        get(A) {
            return this._internalState.get(A)
        }
        serialize() {
            return this._keys().reduce((A, q) => {
                return A.push(q + KXA + this.get(q)), A
            }, []).join(qXA)
        }
        _parse(A) {
            if (A.length > jJK) return;
            if (this._internalState = A.split(qXA).reverse().reduce((q, K) => {
                    let Y = K.trim(),
                        z = Y.indexOf(KXA);
                    if (z !== -1) {
                        let _ = Y.slice(0, z),
                            w = Y.slice(z + 1, K.length);
                        if ((0, eDA.validateKey)(_) && (0, eDA.validateValue)(w)) q.set(_, w)
                    }
                    return q
                }, new Map), this._internalState.size > AXA) this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, AXA))
        }
        _keys() {
            return Array.from(this._internalState.keys()).reverse()
        }
        _clone() {
            let A = new ni1;
            return A._internalState = new Map(this._internalState), A
        }
    }
    YXA.TraceStateImpl = ni1
})
// @from(Ln 44569, Col 4)
$XA = x((wXA) => {
    Object.defineProperty(wXA, "__esModule", {
        value: !0
    });
    wXA.createTraceState = void 0;
    var JJK = _XA();

    function MJK(A) {
        return new JJK.TraceStateImpl(A)
    }
    wXA.createTraceState = MJK
})
// @from(Ln 44581, Col 4)
JXA = x((HXA) => {
    Object.defineProperty(HXA, "__esModule", {
        value: !0
    });
    HXA.context = void 0;
    var DJK = XR6();
    HXA.context = DJK.ContextAPI.getInstance()
})
// @from(Ln 44589, Col 4)
XXA = x((MXA) => {
    Object.defineProperty(MXA, "__esModule", {
        value: !0
    });
    MXA.diag = void 0;
    var XJK = H76();
    MXA.diag = XJK.DiagAPI.instance()
})
// @from(Ln 44597, Col 4)
ZXA = x((PXA) => {
    Object.defineProperty(PXA, "__esModule", {
        value: !0
    });
    PXA.NOOP_METER_PROVIDER = PXA.NoopMeterProvider = void 0;
    var PJK = Li1();
    class ri1 {
        getMeter(A, q, K) {
            return PJK.NOOP_METER
        }
    }
    PXA.NoopMeterProvider = ri1;
    PXA.NOOP_METER_PROVIDER = new ri1
})
// @from(Ln 44611, Col 4)
vXA = x((fXA) => {
    Object.defineProperty(fXA, "__esModule", {
        value: !0
    });
    fXA.MetricsAPI = void 0;
    var ZJK = ZXA(),
        oi1 = $76(),
        GXA = H76(),
        ai1 = "metrics";
    class si1 {
        constructor() {}
        static getInstance() {
            if (!this._instance) this._instance = new si1;
            return this._instance
        }
        setGlobalMeterProvider(A) {
            return (0, oi1.registerGlobal)(ai1, A, GXA.DiagAPI.instance())
        }
        getMeterProvider() {
            return (0, oi1.getGlobal)(ai1) || ZJK.NOOP_METER_PROVIDER
        }
        getMeter(A, q, K) {
            return this.getMeterProvider().getMeter(A, q, K)
        }
        disable() {
            (0, oi1.unregisterGlobal)(ai1, GXA.DiagAPI.instance())
        }
    }
    fXA.MetricsAPI = si1
})
// @from(Ln 44641, Col 4)
kXA = x((NXA) => {
    Object.defineProperty(NXA, "__esModule", {
        value: !0
    });
    NXA.metrics = void 0;
    var GJK = vXA();
    NXA.metrics = GJK.MetricsAPI.getInstance()
})
// @from(Ln 44649, Col 4)
RXA = x((yXA) => {
    Object.defineProperty(yXA, "__esModule", {
        value: !0
    });
    yXA.NoopTextMapPropagator = void 0;
    class EXA {
        inject(A, q) {}
        extract(A, q) {
            return A
        }
        fields() {
            return []
        }
    }
    yXA.NoopTextMapPropagator = EXA
})
// @from(Ln 44665, Col 4)
IXA = x((SXA) => {
    Object.defineProperty(SXA, "__esModule", {
        value: !0
    });
    SXA.deleteBaggage = SXA.setBaggage = SXA.getActiveBaggage = SXA.getBaggage = void 0;
    var fJK = XR6(),
        TJK = MR6(),
        ti1 = (0, TJK.createContextKey)("OpenTelemetry Baggage Key");

    function hXA(A) {
        return A.getValue(ti1) || void 0
    }
    SXA.getBaggage = hXA;

    function vJK() {
        return hXA(fJK.ContextAPI.getInstance().active())
    }
    SXA.getActiveBaggage = vJK;

    function NJK(A, q) {
        return A.setValue(ti1, q)
    }
    SXA.setBaggage = NJK;

    function VJK(A) {
        return A.deleteValue(ti1)
    }
    SXA.deleteBaggage = VJK
})
// @from(Ln 44694, Col 4)
BXA = x((uXA) => {
    Object.defineProperty(uXA, "__esModule", {
        value: !0
    });
    uXA.PropagationAPI = void 0;
    var ei1 = $76(),
        LJK = RXA(),
        bXA = hi1(),
        yA1 = IXA(),
        RJK = Zi1(),
        xXA = H76(),
        An1 = "propagation",
        hJK = new LJK.NoopTextMapPropagator;
    class qn1 {
        constructor() {
            this.createBaggage = RJK.createBaggage, this.getBaggage = yA1.getBaggage, this.getActiveBaggage = yA1.getActiveBaggage, this.setBaggage = yA1.setBaggage, this.deleteBaggage = yA1.deleteBaggage
        }
        static getInstance() {
            if (!this._instance) this._instance = new qn1;
            return this._instance
        }
        setGlobalPropagator(A) {
            return (0, ei1.registerGlobal)(An1, A, xXA.DiagAPI.instance())
        }
        inject(A, q, K = bXA.defaultTextMapSetter) {
            return this._getGlobalPropagator().inject(A, q, K)
        }
        extract(A, q, K = bXA.defaultTextMapGetter) {
            return this._getGlobalPropagator().extract(A, q, K)
        }
        fields() {
            return this._getGlobalPropagator().fields()
        }
        disable() {
            (0, ei1.unregisterGlobal)(An1, xXA.DiagAPI.instance())
        }
        _getGlobalPropagator() {
            return (0, ei1.getGlobal)(An1) || hJK
        }
    }
    uXA.PropagationAPI = qn1
})
// @from(Ln 44736, Col 4)
pXA = x((gXA) => {
    Object.defineProperty(gXA, "__esModule", {
        value: !0
    });
    gXA.propagation = void 0;
    var SJK = BXA();
    gXA.propagation = SJK.PropagationAPI.getInstance()
})
// @from(Ln 44744, Col 4)
iXA = x((cXA) => {
    Object.defineProperty(cXA, "__esModule", {
        value: !0
    });
    cXA.TraceAPI = void 0;
    var Kn1 = $76(),
        QXA = Ui1(),
        UXA = EA1(),
        t$6 = Bi1(),
        dXA = H76(),
        Yn1 = "trace";
    class zn1 {
        constructor() {
            this._proxyTracerProvider = new QXA.ProxyTracerProvider, this.wrapSpanContext = UXA.wrapSpanContext, this.isSpanContextValid = UXA.isSpanContextValid, this.deleteSpan = t$6.deleteSpan, this.getSpan = t$6.getSpan, this.getActiveSpan = t$6.getActiveSpan, this.getSpanContext = t$6.getSpanContext, this.setSpan = t$6.setSpan, this.setSpanContext = t$6.setSpanContext
        }
        static getInstance() {
            if (!this._instance) this._instance = new zn1;
            return this._instance
        }
        setGlobalTracerProvider(A) {
            let q = (0, Kn1.registerGlobal)(Yn1, this._proxyTracerProvider, dXA.DiagAPI.instance());
            if (q) this._proxyTracerProvider.setDelegate(A);
            return q
        }
        getTracerProvider() {
            return (0, Kn1.getGlobal)(Yn1) || this._proxyTracerProvider
        }
        getTracer(A, q) {
            return this.getTracerProvider().getTracer(A, q)
        }
        disable() {
            (0, Kn1.unregisterGlobal)(Yn1, dXA.DiagAPI.instance()), this._proxyTracerProvider = new QXA.ProxyTracerProvider
        }
    }
    cXA.TraceAPI = zn1
})
// @from(Ln 44780, Col 4)
oXA = x((nXA) => {
    Object.defineProperty(nXA, "__esModule", {
        value: !0
    });
    nXA.trace = void 0;
    var CJK = iXA();
    nXA.trace = CJK.TraceAPI.getInstance()
})
// @from(Ln 44788, Col 4)
yq = x((R_) => {
    Object.defineProperty(R_, "__esModule", {
        value: !0
    });
    R_.trace = R_.propagation = R_.metrics = R_.diag = R_.context = R_.INVALID_SPAN_CONTEXT = R_.INVALID_TRACEID = R_.INVALID_SPANID = R_.isValidSpanId = R_.isValidTraceId = R_.isSpanContextValid = R_.createTraceState = R_.TraceFlags = R_.SpanStatusCode = R_.SpanKind = R_.SamplingDecision = R_.ProxyTracerProvider = R_.ProxyTracer = R_.defaultTextMapSetter = R_.defaultTextMapGetter = R_.ValueType = R_.createNoopMeter = R_.DiagLogLevel = R_.DiagConsoleLogger = R_.ROOT_CONTEXT = R_.createContextKey = R_.baggageEntryMetadataFromString = void 0;
    var IJK = Zi1();
    Object.defineProperty(R_, "baggageEntryMetadataFromString", {
        enumerable: !0,
        get: function() {
            return IJK.baggageEntryMetadataFromString
        }
    });
    var aXA = MR6();
    Object.defineProperty(R_, "createContextKey", {
        enumerable: !0,
        get: function() {
            return aXA.createContextKey
        }
    });
    Object.defineProperty(R_, "ROOT_CONTEXT", {
        enumerable: !0,
        get: function() {
            return aXA.ROOT_CONTEXT
        }
    });
    var bJK = iMA();
    Object.defineProperty(R_, "DiagConsoleLogger", {
        enumerable: !0,
        get: function() {
            return bJK.DiagConsoleLogger
        }
    });
    var xJK = TA1();
    Object.defineProperty(R_, "DiagLogLevel", {
        enumerable: !0,
        get: function() {
            return xJK.DiagLogLevel
        }
    });
    var uJK = Li1();
    Object.defineProperty(R_, "createNoopMeter", {
        enumerable: !0,
        get: function() {
            return uJK.createNoopMeter
        }
    });
    var mJK = zDA();
    Object.defineProperty(R_, "ValueType", {
        enumerable: !0,
        get: function() {
            return mJK.ValueType
        }
    });
    var sXA = hi1();
    Object.defineProperty(R_, "defaultTextMapGetter", {
        enumerable: !0,
        get: function() {
            return sXA.defaultTextMapGetter
        }
    });
    Object.defineProperty(R_, "defaultTextMapSetter", {
        enumerable: !0,
        get: function() {
            return sXA.defaultTextMapSetter
        }
    });
    var BJK = Qi1();
    Object.defineProperty(R_, "ProxyTracer", {
        enumerable: !0,
        get: function() {
            return BJK.ProxyTracer
        }
    });
    var gJK = Ui1();
    Object.defineProperty(R_, "ProxyTracerProvider", {
        enumerable: !0,
        get: function() {
            return gJK.ProxyTracerProvider
        }
    });
    var FJK = lDA();
    Object.defineProperty(R_, "SamplingDecision", {
        enumerable: !0,
        get: function() {
            return FJK.SamplingDecision
        }
    });
    var pJK = nDA();
    Object.defineProperty(R_, "SpanKind", {
        enumerable: !0,
        get: function() {
            return pJK.SpanKind
        }
    });
    var QJK = oDA();
    Object.defineProperty(R_, "SpanStatusCode", {
        enumerable: !0,
        get: function() {
            return QJK.SpanStatusCode
        }
    });
    var UJK = xi1();
    Object.defineProperty(R_, "TraceFlags", {
        enumerable: !0,
        get: function() {
            return UJK.TraceFlags
        }
    });
    var dJK = $XA();
    Object.defineProperty(R_, "createTraceState", {
        enumerable: !0,
        get: function() {
            return dJK.createTraceState
        }
    });
    var _n1 = EA1();
    Object.defineProperty(R_, "isSpanContextValid", {
        enumerable: !0,
        get: function() {
            return _n1.isSpanContextValid
        }
    });
    Object.defineProperty(R_, "isValidTraceId", {
        enumerable: !0,
        get: function() {
            return _n1.isValidTraceId
        }
    });
    Object.defineProperty(R_, "isValidSpanId", {
        enumerable: !0,
        get: function() {
            return _n1.isValidSpanId
        }
    });
    var wn1 = VA1();
    Object.defineProperty(R_, "INVALID_SPANID", {
        enumerable: !0,
        get: function() {
            return wn1.INVALID_SPANID
        }
    });
    Object.defineProperty(R_, "INVALID_TRACEID", {
        enumerable: !0,
        get: function() {
            return wn1.INVALID_TRACEID
        }
    });
    Object.defineProperty(R_, "INVALID_SPAN_CONTEXT", {
        enumerable: !0,
        get: function() {
            return wn1.INVALID_SPAN_CONTEXT
        }
    });
    var tXA = JXA();
    Object.defineProperty(R_, "context", {
        enumerable: !0,
        get: function() {
            return tXA.context
        }
    });
    var eXA = XXA();
    Object.defineProperty(R_, "diag", {
        enumerable: !0,
        get: function() {
            return eXA.diag
        }
    });
    var APA = kXA();
    Object.defineProperty(R_, "metrics", {
        enumerable: !0,
        get: function() {
            return APA.metrics
        }
    });
    var qPA = pXA();
    Object.defineProperty(R_, "propagation", {
        enumerable: !0,
        get: function() {
            return qPA.propagation
        }
    });
    var KPA = oXA();
    Object.defineProperty(R_, "trace", {
        enumerable: !0,
        get: function() {
            return KPA.trace
        }
    });
    R_.default = {
        context: tXA.context,
        diag: eXA.diag,
        metrics: APA.metrics,
        propagation: qPA.propagation,
        trace: KPA.trace
    }
})
// @from(Ln 44984, Col 4)
zPA = x((YPA) => {
    Object.defineProperty(YPA, "__esModule", {
        value: !0
    });
    YPA.SeverityNumber = void 0;
    var iJK;
    (function(A) {
        A[A.UNSPECIFIED = 0] = "UNSPECIFIED", A[A.TRACE = 1] = "TRACE", A[A.TRACE2 = 2] = "TRACE2", A[A.TRACE3 = 3] = "TRACE3", A[A.TRACE4 = 4] = "TRACE4", A[A.DEBUG = 5] = "DEBUG", A[A.DEBUG2 = 6] = "DEBUG2", A[A.DEBUG3 = 7] = "DEBUG3", A[A.DEBUG4 = 8] = "DEBUG4", A[A.INFO = 9] = "INFO", A[A.INFO2 = 10] = "INFO2", A[A.INFO3 = 11] = "INFO3", A[A.INFO4 = 12] = "INFO4", A[A.WARN = 13] = "WARN", A[A.WARN2 = 14] = "WARN2", A[A.WARN3 = 15] = "WARN3", A[A.WARN4 = 16] = "WARN4", A[A.ERROR = 17] = "ERROR", A[A.ERROR2 = 18] = "ERROR2", A[A.ERROR3 = 19] = "ERROR3", A[A.ERROR4 = 20] = "ERROR4", A[A.FATAL = 21] = "FATAL", A[A.FATAL2 = 22] = "FATAL2", A[A.FATAL3 = 23] = "FATAL3", A[A.FATAL4 = 24] = "FATAL4"
    })(iJK = YPA.SeverityNumber || (YPA.SeverityNumber = {}))
})
// @from(Ln 44994, Col 4)
LA1 = x((_PA) => {
    Object.defineProperty(_PA, "__esModule", {
        value: !0
    });
    _PA.NOOP_LOGGER = _PA.NoopLogger = void 0;
    class $n1 {
        emit(A) {}
    }
    _PA.NoopLogger = $n1;
    _PA.NOOP_LOGGER = new $n1
})
// @from(Ln 45005, Col 4)
jn1 = x((OPA) => {
    Object.defineProperty(OPA, "__esModule", {
        value: !0
    });
    OPA.NOOP_LOGGER_PROVIDER = OPA.NoopLoggerProvider = void 0;
    var rJK = LA1();
    class Hn1 {
        getLogger(A, q, K) {
            return new rJK.NoopLogger
        }
    }
    OPA.NoopLoggerProvider = Hn1;
    OPA.NOOP_LOGGER_PROVIDER = new Hn1
})
// @from(Ln 45019, Col 4)
MPA = x((jPA) => {
    Object.defineProperty(jPA, "__esModule", {
        value: !0
    });
    jPA.ProxyLogger = void 0;
    var aJK = LA1();
    class HPA {
        constructor(A, q, K, Y) {
            this._provider = A, this.name = q, this.version = K, this.options = Y
        }
        emit(A) {
            this._getLogger().emit(A)
        }
        _getLogger() {
            if (this._delegate) return this._delegate;
            let A = this._provider._getDelegateLogger(this.name, this.version, this.options);
            if (!A) return aJK.NOOP_LOGGER;
            return this._delegate = A, this._delegate
        }
    }
    jPA.ProxyLogger = HPA
})
// @from(Ln 45041, Col 4)
Jn1 = x((XPA) => {
    Object.defineProperty(XPA, "__esModule", {
        value: !0
    });
    XPA.ProxyLoggerProvider = void 0;
    var sJK = jn1(),
        tJK = MPA();
    class DPA {
        getLogger(A, q, K) {
            var Y;
            return (Y = this._getDelegateLogger(A, q, K)) !== null && Y !== void 0 ? Y : new tJK.ProxyLogger(this, A, q, K)
        }
        _getDelegate() {
            var A;
            return (A = this._delegate) !== null && A !== void 0 ? A : sJK.NOOP_LOGGER_PROVIDER
        }
        _setDelegate(A) {
            this._delegate = A
        }
        _getDelegateLogger(A, q, K) {
            var Y;
            return (Y = this._delegate) === null || Y === void 0 ? void 0 : Y.getLogger(A, q, K)
        }
    }
    XPA.ProxyLoggerProvider = DPA
})
// @from(Ln 45067, Col 4)
GPA = x((WPA) => {
    Object.defineProperty(WPA, "__esModule", {
        value: !0
    });
    WPA._globalThis = void 0;
    WPA._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Ln 45074, Col 4)
fPA = x((Mn1) => {
    Object.defineProperty(Mn1, "__esModule", {
        value: !0
    });
    Mn1._globalThis = void 0;
    var eJK = GPA();
    Object.defineProperty(Mn1, "_globalThis", {
        enumerable: !0,
        get: function() {
            return eJK._globalThis
        }
    })
})
// @from(Ln 45087, Col 4)
TPA = x((Dn1) => {
    Object.defineProperty(Dn1, "__esModule", {
        value: !0
    });
    Dn1._globalThis = void 0;
    var qMK = fPA();
    Object.defineProperty(Dn1, "_globalThis", {
        enumerable: !0,
        get: function() {
            return qMK._globalThis
        }
    })
})
// @from(Ln 45100, Col 4)
VPA = x((vPA) => {
    Object.defineProperty(vPA, "__esModule", {
        value: !0
    });
    vPA.API_BACKWARDS_COMPATIBILITY_VERSION = vPA.makeGetter = vPA._global = vPA.GLOBAL_LOGS_API_KEY = void 0;
    var YMK = TPA();
    vPA.GLOBAL_LOGS_API_KEY = Symbol.for("io.opentelemetry.js.api.logs");
    vPA._global = YMK._globalThis;

    function zMK(A, q, K) {
        return (Y) => Y === A ? q : K
    }
    vPA.makeGetter = zMK;
    vPA.API_BACKWARDS_COMPATIBILITY_VERSION = 1
})
// @from(Ln 45115, Col 4)
LPA = x((EPA) => {
    Object.defineProperty(EPA, "__esModule", {
        value: !0
    });
    EPA.LogsAPI = void 0;
    var Dy = VPA(),
        $MK = jn1(),
        kPA = Jn1();
    class Xn1 {
        constructor() {
            this._proxyLoggerProvider = new kPA.ProxyLoggerProvider
        }
        static getInstance() {
            if (!this._instance) this._instance = new Xn1;
            return this._instance
        }
        setGlobalLoggerProvider(A) {
            if (Dy._global[Dy.GLOBAL_LOGS_API_KEY]) return this.getLoggerProvider();
            return Dy._global[Dy.GLOBAL_LOGS_API_KEY] = (0, Dy.makeGetter)(Dy.API_BACKWARDS_COMPATIBILITY_VERSION, A, $MK.NOOP_LOGGER_PROVIDER), this._proxyLoggerProvider._setDelegate(A), A
        }
        getLoggerProvider() {
            var A, q;
            return (q = (A = Dy._global[Dy.GLOBAL_LOGS_API_KEY]) === null || A === void 0 ? void 0 : A.call(Dy._global, Dy.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && q !== void 0 ? q : this._proxyLoggerProvider
        }
        getLogger(A, q, K) {
            return this.getLoggerProvider().getLogger(A, q, K)
        }
        disable() {
            delete Dy._global[Dy.GLOBAL_LOGS_API_KEY], this._proxyLoggerProvider = new kPA.ProxyLoggerProvider
        }
    }
    EPA.LogsAPI = Xn1
})
// @from(Ln 45148, Col 4)
Pn1 = x((e$6) => {
    Object.defineProperty(e$6, "__esModule", {
        value: !0
    });
    e$6.logs = e$6.ProxyLoggerProvider = e$6.NoopLogger = e$6.NOOP_LOGGER = e$6.SeverityNumber = void 0;
    var HMK = zPA();
    Object.defineProperty(e$6, "SeverityNumber", {
        enumerable: !0,
        get: function() {
            return HMK.SeverityNumber
        }
    });
    var RPA = LA1();
    Object.defineProperty(e$6, "NOOP_LOGGER", {
        enumerable: !0,
        get: function() {
            return RPA.NOOP_LOGGER
        }
    });
    Object.defineProperty(e$6, "NoopLogger", {
        enumerable: !0,
        get: function() {
            return RPA.NoopLogger
        }
    });
    var jMK = Jn1();
    Object.defineProperty(e$6, "ProxyLoggerProvider", {
        enumerable: !0,
        get: function() {
            return jMK.ProxyLoggerProvider
        }
    });
    var JMK = LPA();
    e$6.logs = JMK.LogsAPI.getInstance()
})
// @from(Ln 45183, Col 4)
PR6 = x((SPA) => {
    Object.defineProperty(SPA, "__esModule", {
        value: !0
    });
    SPA.isTracingSuppressed = SPA.unsuppressTracing = SPA.suppressTracing = void 0;
    var MMK = yq(),
        Wn1 = (0, MMK.createContextKey)("OpenTelemetry SDK Context Key SUPPRESS_TRACING");

    function DMK(A) {
        return A.setValue(Wn1, !0)
    }
    SPA.suppressTracing = DMK;

    function XMK(A) {
        return A.deleteValue(Wn1)
    }
    SPA.unsuppressTracing = XMK;

    function PMK(A) {
        return A.getValue(Wn1) === !0
    }
    SPA.isTracingSuppressed = PMK
})
// @from(Ln 45206, Col 4)
Zn1 = x((IPA) => {
    Object.defineProperty(IPA, "__esModule", {
        value: !0
    });
    IPA.BAGGAGE_MAX_TOTAL_LENGTH = IPA.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = IPA.BAGGAGE_MAX_NAME_VALUE_PAIRS = IPA.BAGGAGE_HEADER = IPA.BAGGAGE_ITEMS_SEPARATOR = IPA.BAGGAGE_PROPERTIES_SEPARATOR = IPA.BAGGAGE_KEY_PAIR_SEPARATOR = void 0;
    IPA.BAGGAGE_KEY_PAIR_SEPARATOR = "=";
    IPA.BAGGAGE_PROPERTIES_SEPARATOR = ";";
    IPA.BAGGAGE_ITEMS_SEPARATOR = ",";
    IPA.BAGGAGE_HEADER = "baggage";
    IPA.BAGGAGE_MAX_NAME_VALUE_PAIRS = 180;
    IPA.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096;
    IPA.BAGGAGE_MAX_TOTAL_LENGTH = 8192
})
// @from(Ln 45219, Col 4)
Gn1 = x((uPA) => {
    Object.defineProperty(uPA, "__esModule", {
        value: !0
    });
    uPA.parseKeyPairsIntoRecord = uPA.parsePairKeyValue = uPA.getKeyPairs = uPA.serializeKeyPairs = void 0;
    var kMK = yq(),
        j76 = Zn1();

    function EMK(A) {
        return A.reduce((q, K) => {
            let Y = `${q}${q!==""?j76.BAGGAGE_ITEMS_SEPARATOR:""}${K}`;
            return Y.length > j76.BAGGAGE_MAX_TOTAL_LENGTH ? q : Y
        }, "")
    }
    uPA.serializeKeyPairs = EMK;

    function yMK(A) {
        return A.getAllEntries().map(([q, K]) => {
            let Y = `${encodeURIComponent(q)}=${encodeURIComponent(K.value)}`;
            if (K.metadata !== void 0) Y += j76.BAGGAGE_PROPERTIES_SEPARATOR + K.metadata.toString();
            return Y
        })
    }
    uPA.getKeyPairs = yMK;

    function xPA(A) {
        let q = A.split(j76.BAGGAGE_PROPERTIES_SEPARATOR);
        if (q.length <= 0) return;
        let K = q.shift();
        if (!K) return;
        let Y = K.indexOf(j76.BAGGAGE_KEY_PAIR_SEPARATOR);
        if (Y <= 0) return;
        let z = decodeURIComponent(K.substring(0, Y).trim()),
            _ = decodeURIComponent(K.substring(Y + 1).trim()),
            w;
        if (q.length > 0) w = (0, kMK.baggageEntryMetadataFromString)(q.join(j76.BAGGAGE_PROPERTIES_SEPARATOR));
        return {
            key: z,
            value: _,
            metadata: w
        }
    }
    uPA.parsePairKeyValue = xPA;

    function LMK(A) {
        let q = {};
        if (typeof A === "string" && A.length > 0) A.split(j76.BAGGAGE_ITEMS_SEPARATOR).forEach((K) => {
            let Y = xPA(K);
            if (Y !== void 0 && Y.value.length > 0) q[Y.key] = Y.value
        });
        return q
    }
    uPA.parseKeyPairsIntoRecord = LMK
})
// @from(Ln 45273, Col 4)
pPA = x((gPA) => {
    Object.defineProperty(gPA, "__esModule", {
        value: !0
    });
    gPA.W3CBaggagePropagator = void 0;
    var fn1 = yq(),
        CMK = PR6(),
        J76 = Zn1(),
        Tn1 = Gn1();
    class BPA {
        inject(A, q, K) {
            let Y = fn1.propagation.getBaggage(A);
            if (!Y || (0, CMK.isTracingSuppressed)(A)) return;
            let z = (0, Tn1.getKeyPairs)(Y).filter((w) => {
                    return w.length <= J76.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS
                }).slice(0, J76.BAGGAGE_MAX_NAME_VALUE_PAIRS),
                _ = (0, Tn1.serializeKeyPairs)(z);
            if (_.length > 0) K.set(q, J76.BAGGAGE_HEADER, _)
        }
        extract(A, q, K) {
            let Y = K.get(q, J76.BAGGAGE_HEADER),
                z = Array.isArray(Y) ? Y.join(J76.BAGGAGE_ITEMS_SEPARATOR) : Y;
            if (!z) return A;
            let _ = {};
            if (z.length === 0) return A;
            if (z.split(J76.BAGGAGE_ITEMS_SEPARATOR).forEach((O) => {
                    let $ = (0, Tn1.parsePairKeyValue)(O);
                    if ($) {
                        let H = {
                            value: $.value
                        };
                        if ($.metadata) H.metadata = $.metadata;
                        _[$.key] = H
                    }
                }), Object.entries(_).length === 0) return A;
            return fn1.propagation.setBaggage(A, fn1.propagation.createBaggage(_))
        }
        fields() {
            return [J76.BAGGAGE_HEADER]
        }
    }
    gPA.W3CBaggagePropagator = BPA
})
// @from(Ln 45316, Col 4)
cPA = x((UPA) => {
    Object.defineProperty(UPA, "__esModule", {
        value: !0
    });
    UPA.AnchoredClock = void 0;
    class QPA {
        _monotonicClock;
        _epochMillis;
        _performanceMillis;
        constructor(A, q) {
            this._monotonicClock = q, this._epochMillis = A.now(), this._performanceMillis = q.now()
        }
        now() {
            let A = this._monotonicClock.now() - this._performanceMillis;
            return this._epochMillis + A
        }
    }
    UPA.AnchoredClock = QPA
})
// @from(Ln 45335, Col 4)
sPA = x((oPA) => {
    Object.defineProperty(oPA, "__esModule", {
        value: !0
    });
    oPA.isAttributeValue = oPA.isAttributeKey = oPA.sanitizeAttributes = void 0;
    var lPA = yq();

    function IMK(A) {
        let q = {};
        if (typeof A !== "object" || A == null) return q;
        for (let K in A) {
            if (!Object.prototype.hasOwnProperty.call(A, K)) continue;
            if (!iPA(K)) {
                lPA.diag.warn(`Invalid attribute key: ${K}`);
                continue
            }
            let Y = A[K];
            if (!nPA(Y)) {
                lPA.diag.warn(`Invalid attribute value set for key: ${K}`);
                continue
            }
            if (Array.isArray(Y)) q[K] = Y.slice();
            else q[K] = Y
        }
        return q
    }
    oPA.sanitizeAttributes = IMK;

    function iPA(A) {
        return typeof A === "string" && A !== ""
    }
    oPA.isAttributeKey = iPA;

    function nPA(A) {
        if (A == null) return !0;
        if (Array.isArray(A)) return bMK(A);
        return rPA(typeof A)
    }
    oPA.isAttributeValue = nPA;

    function bMK(A) {
        let q;
        for (let K of A) {
            if (K == null) continue;
            let Y = typeof K;
            if (Y === q) continue;
            if (!q) {
                if (rPA(Y)) {
                    q = Y;
                    continue
                }
                return !1
            }
            return !1
        }
        return !0
    }

    function rPA(A) {
        switch (A) {
            case "number":
            case "boolean":
            case "string":
                return !0
        }
        return !1
    }
})
// @from(Ln 45403, Col 4)
vn1 = x((tPA) => {
    Object.defineProperty(tPA, "__esModule", {
        value: !0
    });
    tPA.loggingErrorHandler = void 0;
    var mMK = yq();

    function BMK() {
        return (A) => {
            mMK.diag.error(gMK(A))
        }
    }
    tPA.loggingErrorHandler = BMK;

    function gMK(A) {
        if (typeof A === "string") return A;
        else return JSON.stringify(FMK(A))
    }

    function FMK(A) {
        let q = {},
            K = A;
        while (K !== null) Object.getOwnPropertyNames(K).forEach((Y) => {
            if (q[Y]) return;
            let z = K[Y];
            if (z) q[Y] = String(z)
        }), K = Object.getPrototypeOf(K);
        return q
    }
})
// @from(Ln 45433, Col 4)
Y0A = x((q0A) => {
    Object.defineProperty(q0A, "__esModule", {
        value: !0
    });
    q0A.globalErrorHandler = q0A.setGlobalErrorHandler = void 0;
    var pMK = vn1(),
        A0A = (0, pMK.loggingErrorHandler)();

    function QMK(A) {
        A0A = A
    }
    q0A.setGlobalErrorHandler = QMK;

    function UMK(A) {
        try {
            A0A(A)
        } catch {}
    }
    q0A.globalErrorHandler = UMK
})
// @from(Ln 45453, Col 4)
H0A = x((O0A) => {
    Object.defineProperty(O0A, "__esModule", {
        value: !0
    });
    O0A.getStringListFromEnv = O0A.getBooleanFromEnv = O0A.getStringFromEnv = O0A.getNumberFromEnv = void 0;
    var z0A = yq(),
        _0A = x6("util");

    function cMK(A) {
        let q = process.env[A];
        if (q == null || q.trim() === "") return;
        let K = Number(q);
        if (isNaN(K)) {
            z0A.diag.warn(`Unknown value ${(0,_0A.inspect)(q)} for ${A}, expected a number, using defaults`);
            return
        }
        return K
    }
    O0A.getNumberFromEnv = cMK;

    function w0A(A) {
        let q = process.env[A];
        if (q == null || q.trim() === "") return;
        return q
    }
    O0A.getStringFromEnv = w0A;

    function lMK(A) {
        let q = process.env[A]?.trim().toLowerCase();
        if (q == null || q === "") return !1;
        if (q === "true") return !0;
        else if (q === "false") return !1;
        else return z0A.diag.warn(`Unknown value ${(0,_0A.inspect)(q)} for ${A}, expected 'true' or 'false', falling back to 'false' (default)`), !1
    }
    O0A.getBooleanFromEnv = lMK;

    function iMK(A) {
        return w0A(A)?.split(",").map((q) => q.trim()).filter((q) => q !== "")
    }
    O0A.getStringListFromEnv = iMK
})
// @from(Ln 45494, Col 4)
M0A = x((j0A) => {
    Object.defineProperty(j0A, "__esModule", {
        value: !0
    });
    j0A._globalThis = void 0;
    j0A._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Ln 45501, Col 4)
P0A = x((D0A) => {
    Object.defineProperty(D0A, "__esModule", {
        value: !0
    });
    D0A.otperformance = void 0;
    var aMK = x6("perf_hooks");
    D0A.otperformance = aMK.performance
})
// @from(Ln 45509, Col 4)
G0A = x((W0A) => {
    Object.defineProperty(W0A, "__esModule", {
        value: !0
    });
    W0A.VERSION = void 0;
    W0A.VERSION = "2.2.0"
})
// @from(Ln 45516, Col 4)
Nn1 = x((f0A) => {
    Object.defineProperty(f0A, "__esModule", {
        value: !0
    });
    f0A.createConstMap = void 0;

    function sMK(A) {
        let q = {},
            K = A.length;
        for (let Y = 0; Y < K; Y++) {
            let z = A[Y];
            if (z) q[String(z).toUpperCase().replace(/[-.]/g, "_")] = z
        }
        return q
    }
    f0A.createConstMap = sMK
})