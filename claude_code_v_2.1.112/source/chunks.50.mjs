
// @from(Ln 124628, Col 4)
Yhq = p((_hq) => {
    Object.defineProperty(_hq, "__esModule", {
        value: !0
    });
    _hq.default = void 0;
    var Ra9 = Khq(PE1()),
        Sa9 = Khq(jr6());

    function Khq(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }
    var qhq, WE1, DE1 = 0,
        ZE1 = 0;

    function Ca9(q, K, _) {
        let z = K && _ || 0,
            Y = K || Array(16);
        q = q || {};
        let A = q.node || qhq,
            O = q.clockseq !== void 0 ? q.clockseq : WE1;
        if (A == null || O == null) {
            let X = q.random || (q.rng || Ra9.default)();
            if (A == null) A = qhq = [X[0] | 1, X[1], X[2], X[3], X[4], X[5]];
            if (O == null) O = WE1 = (X[6] << 8 | X[7]) & 16383
        }
        let w = q.msecs !== void 0 ? q.msecs : Date.now(),
            $ = q.nsecs !== void 0 ? q.nsecs : ZE1 + 1,
            j = w - DE1 + ($ - ZE1) / 1e4;
        if (j < 0 && q.clockseq === void 0) O = O + 1 & 16383;
        if ((j < 0 || w > DE1) && q.nsecs === void 0) $ = 0;
        if ($ >= 1e4) throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
        DE1 = w, ZE1 = $, WE1 = O, w += 12219292800000;
        let H = ((w & 268435455) * 1e4 + $) % 4294967296;
        Y[z++] = H >>> 24 & 255, Y[z++] = H >>> 16 & 255, Y[z++] = H >>> 8 & 255, Y[z++] = H & 255;
        let J = w / 4294967296 * 1e4 & 268435455;
        Y[z++] = J >>> 8 & 255, Y[z++] = J & 255, Y[z++] = J >>> 24 & 15 | 16, Y[z++] = J >>> 16 & 255, Y[z++] = O >>> 8 | 128, Y[z++] = O & 255;
        for (let X = 0; X < 6; ++X) Y[z + X] = A[X];
        return K || (0, Sa9.default)(Y)
    }
    var ba9 = Ca9;
    _hq.default = ba9
})
// @from(Ln 124672, Col 4)
fE1 = p((Ahq) => {
    Object.defineProperty(Ahq, "__esModule", {
        value: !0
    });
    Ahq.default = void 0;
    var Ia9 = xa9($r6());

    function xa9(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }

    function ua9(q) {
        if (!(0, Ia9.default)(q)) throw TypeError("Invalid UUID");
        let K, _ = new Uint8Array(16);
        return _[0] = (K = parseInt(q.slice(0, 8), 16)) >>> 24, _[1] = K >>> 16 & 255, _[2] = K >>> 8 & 255, _[3] = K & 255, _[4] = (K = parseInt(q.slice(9, 13), 16)) >>> 8, _[5] = K & 255, _[6] = (K = parseInt(q.slice(14, 18), 16)) >>> 8, _[7] = K & 255, _[8] = (K = parseInt(q.slice(19, 23), 16)) >>> 8, _[9] = K & 255, _[10] = (K = parseInt(q.slice(24, 36), 16)) / 1099511627776 & 255, _[11] = K / 4294967296 & 255, _[12] = K >>> 24 & 255, _[13] = K >>> 16 & 255, _[14] = K >>> 8 & 255, _[15] = K & 255, _
    }
    var ma9 = ua9;
    Ahq.default = ma9
})
// @from(Ln 124693, Col 4)
GE1 = p((Hhq) => {
    Object.defineProperty(Hhq, "__esModule", {
        value: !0
    });
    Hhq.default = ga9;
    Hhq.URL = Hhq.DNS = void 0;
    var Ba9 = whq(jr6()),
        pa9 = whq(fE1());

    function whq(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }

    function Fa9(q) {
        q = unescape(encodeURIComponent(q));
        let K = [];
        for (let _ = 0; _ < q.length; ++_) K.push(q.charCodeAt(_));
        return K
    }
    var $hq = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    Hhq.DNS = $hq;
    var jhq = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
    Hhq.URL = jhq;

    function ga9(q, K, _) {
        function z(Y, A, O, w) {
            if (typeof Y === "string") Y = Fa9(Y);
            if (typeof A === "string") A = (0, pa9.default)(A);
            if (A.length !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
            let $ = new Uint8Array(16 + Y.length);
            if ($.set(A), $.set(Y, A.length), $ = _($), $[6] = $[6] & 15 | K, $[8] = $[8] & 63 | 128, O) {
                w = w || 0;
                for (let j = 0; j < 16; ++j) O[w + j] = $[j];
                return O
            }
            return (0, Ba9.default)($)
        }
        try {
            z.name = q
        } catch (Y) {}
        return z.DNS = $hq, z.URL = jhq, z
    }
})
// @from(Ln 124738, Col 4)
Phq = p((Xhq) => {
    Object.defineProperty(Xhq, "__esModule", {
        value: !0
    });
    Xhq.default = void 0;
    var da9 = ca9(d6("crypto"));

    function ca9(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }

    function la9(q) {
        if (Array.isArray(q)) q = Buffer.from(q);
        else if (typeof q === "string") q = Buffer.from(q, "utf8");
        return da9.default.createHash("md5").update(q).digest()
    }
    var na9 = la9;
    Xhq.default = na9
})
// @from(Ln 124759, Col 4)
fhq = p((Dhq) => {
    Object.defineProperty(Dhq, "__esModule", {
        value: !0
    });
    Dhq.default = void 0;
    var ia9 = Whq(GE1()),
        ra9 = Whq(Phq());

    function Whq(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }
    var oa9 = (0, ia9.default)("v3", 48, ra9.default),
        aa9 = oa9;
    Dhq.default = aa9
})
// @from(Ln 124776, Col 4)
Vhq = p((vhq) => {
    Object.defineProperty(vhq, "__esModule", {
        value: !0
    });
    vhq.default = void 0;
    var sa9 = Ghq(PE1()),
        ta9 = Ghq(jr6());

    function Ghq(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }

    function ea9(q, K, _) {
        q = q || {};
        let z = q.random || (q.rng || sa9.default)();
        if (z[6] = z[6] & 15 | 64, z[8] = z[8] & 63 | 128, K) {
            _ = _ || 0;
            for (let Y = 0; Y < 16; ++Y) K[_ + Y] = z[Y];
            return K
        }
        return (0, ta9.default)(z)
    }
    var qs9 = ea9;
    vhq.default = qs9
})
// @from(Ln 124803, Col 4)
Ehq = p((khq) => {
    Object.defineProperty(khq, "__esModule", {
        value: !0
    });
    khq.default = void 0;
    var Ks9 = _s9(d6("crypto"));

    function _s9(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }

    function zs9(q) {
        if (Array.isArray(q)) q = Buffer.from(q);
        else if (typeof q === "string") q = Buffer.from(q, "utf8");
        return Ks9.default.createHash("sha1").update(q).digest()
    }
    var Ys9 = zs9;
    khq.default = Ys9
})
// @from(Ln 124824, Col 4)
Rhq = p((Lhq) => {
    Object.defineProperty(Lhq, "__esModule", {
        value: !0
    });
    Lhq.default = void 0;
    var As9 = yhq(GE1()),
        Os9 = yhq(Ehq());

    function yhq(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }
    var ws9 = (0, As9.default)("v5", 80, Os9.default),
        $s9 = ws9;
    Lhq.default = $s9
})
// @from(Ln 124841, Col 4)
bhq = p((Shq) => {
    Object.defineProperty(Shq, "__esModule", {
        value: !0
    });
    Shq.default = void 0;
    var js9 = "00000000-0000-0000-0000-000000000000";
    Shq.default = js9
})
// @from(Ln 124849, Col 4)
uhq = p((Ihq) => {
    Object.defineProperty(Ihq, "__esModule", {
        value: !0
    });
    Ihq.default = void 0;
    var Hs9 = Js9($r6());

    function Js9(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }

    function Xs9(q) {
        if (!(0, Hs9.default)(q)) throw TypeError("Invalid UUID");
        return parseInt(q.substr(14, 1), 16)
    }
    var Ms9 = Xs9;
    Ihq.default = Ms9
})
// @from(Ln 124869, Col 4)
mhq = p((fB) => {
    Object.defineProperty(fB, "__esModule", {
        value: !0
    });
    Object.defineProperty(fB, "v1", {
        enumerable: !0,
        get: function() {
            return Ps9.default
        }
    });
    Object.defineProperty(fB, "v3", {
        enumerable: !0,
        get: function() {
            return Ws9.default
        }
    });
    Object.defineProperty(fB, "v4", {
        enumerable: !0,
        get: function() {
            return Ds9.default
        }
    });
    Object.defineProperty(fB, "v5", {
        enumerable: !0,
        get: function() {
            return Zs9.default
        }
    });
    Object.defineProperty(fB, "NIL", {
        enumerable: !0,
        get: function() {
            return fs9.default
        }
    });
    Object.defineProperty(fB, "version", {
        enumerable: !0,
        get: function() {
            return Gs9.default
        }
    });
    Object.defineProperty(fB, "validate", {
        enumerable: !0,
        get: function() {
            return vs9.default
        }
    });
    Object.defineProperty(fB, "stringify", {
        enumerable: !0,
        get: function() {
            return Ts9.default
        }
    });
    Object.defineProperty(fB, "parse", {
        enumerable: !0,
        get: function() {
            return Vs9.default
        }
    });
    var Ps9 = Qo(Yhq()),
        Ws9 = Qo(fhq()),
        Ds9 = Qo(Vhq()),
        Zs9 = Qo(Rhq()),
        fs9 = Qo(bhq()),
        Gs9 = Qo(uhq()),
        vs9 = Qo($r6()),
        Ts9 = Qo(jr6()),
        Vs9 = Qo(fE1());

    function Qo(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }
})
// @from(Ln 124943, Col 4)
gQ
// @from(Ln 124943, Col 8)
HLO
// @from(Ln 124943, Col 13)
JLO
// @from(Ln 124943, Col 18)
Bhq
// @from(Ln 124943, Col 23)
XLO
// @from(Ln 124943, Col 28)
MLO
// @from(Ln 124943, Col 33)
PLO
// @from(Ln 124943, Col 38)
WLO
// @from(Ln 124943, Col 43)
DLO
// @from(Ln 124943, Col 48)
ZLO
// @from(Ln 124944, Col 4)
phq = L(() => {
    gQ = K6(mhq(), 1), HLO = gQ.default.v1, JLO = gQ.default.v3, Bhq = gQ.default.v4, XLO = gQ.default.v5, MLO = gQ.default.NIL, PLO = gQ.default.version, WLO = gQ.default.validate, DLO = gQ.default.stringify, ZLO = gQ.default.parse
})
// @from(Ln 124947, Col 0)
class Hr6 {
    generateGuid() {
        return Bhq()
    }
    isGuid(q) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(q)
    }
}
// @from(Ln 124955, Col 4)
vE1 = L(() => {
    phq(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 124958, Col 0)
class uE {
    static base64Encode(q, K) {
        return Buffer.from(q, K).toString(jf.BASE64)
    }
    static base64EncodeUrl(q, K) {
        return uE.base64Encode(q, K).replace(/=/g, q7.EMPTY_STRING).replace(/\+/g, "-").replace(/\//g, "_")
    }
    static base64Decode(q) {
        return Buffer.from(q, jf.BASE64).toString("utf8")
    }
    static base64DecodeUrl(q) {
        let K = q.replace(/-/g, "+").replace(/_/g, "/");
        while (K.length % 4) K += "=";
        return uE.base64Decode(K)
    }
}
// @from(Ln 124974, Col 4)
Jr6 = L(() => {
    cO(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 124978, Col 0)
class Y26 {
    sha256(q) {
        return ks9.createHash(bLq.SHA256).update(q).digest()
    }
}
// @from(Ln 124983, Col 4)
Cv8 = L(() => {
    jj(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 124987, Col 0)
class TE1 {
    constructor() {
        this.hashUtils = new Y26
    }
    async generatePkceCodes() {
        let q = this.generateCodeVerifier(),
            K = this.generateCodeChallengeFromVerifier(q);
        return {
            verifier: q,
            challenge: K
        }
    }
    generateCodeVerifier() {
        let q = [],
            K = 256 - 256 % fv8.CV_CHARSET.length;
        while (q.length <= CLq) {
            let z = Ns9.randomBytes(1)[0];
            if (z >= K) continue;
            let Y = z % fv8.CV_CHARSET.length;
            q.push(fv8.CV_CHARSET[Y])
        }
        let _ = q.join(q7.EMPTY_STRING);
        return uE.base64EncodeUrl(_)
    }
    generateCodeChallengeFromVerifier(q) {
        return uE.base64EncodeUrl(this.hashUtils.sha256(q).toString(jf.BASE64), jf.BASE64)
    }
}
// @from(Ln 125015, Col 4)
Fhq = L(() => {
    cO();
    jj();
    Jr6();
    Cv8(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 125021, Col 0)
class co {
    constructor() {
        this.pkceGenerator = new TE1, this.guidGenerator = new Hr6, this.hashUtils = new Y26
    }
    base64UrlEncode() {
        throw Error("Method not implemented.")
    }
    encodeKid() {
        throw Error("Method not implemented.")
    }
    createNewGuid() {
        return this.guidGenerator.generateGuid()
    }
    base64Encode(q) {
        return uE.base64Encode(q)
    }
    base64Decode(q) {
        return uE.base64Decode(q)
    }
    generatePkceCodes() {
        return this.pkceGenerator.generatePkceCodes()
    }
    getPublicKeyThumbprint() {
        throw Error("Method not implemented.")
    }
    removeTokenBindingKey() {
        throw Error("Method not implemented.")
    }
    clearKeystore() {
        throw Error("Method not implemented.")
    }
    signJwt() {
        throw Error("Method not implemented.")
    }
    async hashString(q) {
        return uE.base64EncodeUrl(this.hashUtils.sha256(q).toString(jf.BASE64), jf.BASE64)
    }
}
// @from(Ln 125059, Col 4)
Xr6 = L(() => {
    cO();
    vE1();
    Jr6();
    Fhq();
    Cv8(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 125066, Col 4)
bv8 = L(() => {
    L$();
    ek1(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Ln 125071, Col 0)
function ghq(q) {
    let K = q.credentialType === dO.REFRESH_TOKEN && q.familyId || q.clientId,
        _ = q.tokenType && q.tokenType.toLowerCase() !== hz.BEARER.toLowerCase() ? q.tokenType.toLowerCase() : "";
    return [q.homeAccountId, q.environment, q.credentialType, K, q.realm || "", q.target || "", q.requestedClaimsHash || "", _].join($E1.KEY_SEPARATOR).toLowerCase()
}
// @from(Ln 125077, Col 0)
function Uhq(q) {
    let K = q.homeAccountId.split(".")[1];
    return [q.homeAccountId, q.environment, K || q.tenantId || ""].join($E1.KEY_SEPARATOR).toLowerCase()
}
// @from(Ln 125081, Col 4)
Qhq = L(() => {
    cO();
    jj(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 125085, Col 4)
A26
// @from(Ln 125086, Col 4)
Iv8 = L(() => {
    cO();
    Dv8();
    LG8();
    bv8();
    Qhq(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    A26 = class A26 extends nw6 {
        constructor(q, K, _, z) {
            super(K, _, q, new DV6, z);
            this.cache = {}, this.changeEmitters = [], this.logger = q
        }
        registerChangeEmitter(q) {
            this.changeEmitters.push(q)
        }
        emitChange() {
            this.changeEmitters.forEach((q) => q.call(null))
        }
        cacheToInMemoryCache(q) {
            let K = {
                accounts: {},
                idTokens: {},
                accessTokens: {},
                refreshTokens: {},
                appMetadata: {}
            };
            for (let _ in q) {
                let z = q[_];
                if (typeof z !== "object") continue;
                if (z instanceof VP) K.accounts[_] = z;
                else if (cV.isIdTokenEntity(z)) K.idTokens[_] = z;
                else if (cV.isAccessTokenEntity(z)) K.accessTokens[_] = z;
                else if (cV.isRefreshTokenEntity(z)) K.refreshTokens[_] = z;
                else if (cV.isAppMetadataEntity(_, z)) K.appMetadata[_] = z;
                else continue
            }
            return K
        }
        inMemoryCacheToCache(q) {
            let K = this.getCache();
            return K = {
                ...K,
                ...q.accounts,
                ...q.idTokens,
                ...q.accessTokens,
                ...q.refreshTokens,
                ...q.appMetadata
            }, K
        }
        getInMemoryCache() {
            return this.logger.trace("Getting in-memory cache"), this.cacheToInMemoryCache(this.getCache())
        }
        setInMemoryCache(q) {
            this.logger.trace("Setting in-memory cache");
            let K = this.inMemoryCacheToCache(q);
            this.setCache(K), this.emitChange()
        }
        getCache() {
            return this.logger.trace("Getting cache key-value store"), this.cache
        }
        setCache(q) {
            this.logger.trace("Setting cache key value store"), this.cache = q, this.emitChange()
        }
        getItem(q) {
            return this.logger.tracePii(`Item key: ${q}`), this.getCache()[q]
        }
        setItem(q, K) {
            this.logger.tracePii(`Item key: ${q}`);
            let _ = this.getCache();
            _[q] = K, this.setCache(_)
        }
        generateCredentialKey(q) {
            return ghq(q)
        }
        generateAccountKey(q) {
            return Uhq(q)
        }
        getAccountKeys() {
            let q = this.getInMemoryCache();
            return Object.keys(q.accounts)
        }
        getTokenKeys() {
            let q = this.getInMemoryCache();
            return {
                idToken: Object.keys(q.idTokens),
                accessToken: Object.keys(q.accessTokens),
                refreshToken: Object.keys(q.refreshTokens)
            }
        }
        getAccount(q) {
            return this.getItem(q) ? Object.assign(new VP, this.getItem(q)) : null
        }
        async setAccount(q) {
            let K = this.generateAccountKey(VP.getAccountInfo(q));
            this.setItem(K, q)
        }
        getIdTokenCredential(q) {
            let K = this.getItem(q);
            if (cV.isIdTokenEntity(K)) return K;
            return null
        }
        async setIdTokenCredential(q) {
            let K = this.generateCredentialKey(q);
            this.setItem(K, q)
        }
        getAccessTokenCredential(q) {
            let K = this.getItem(q);
            if (cV.isAccessTokenEntity(K)) return K;
            return null
        }
        async setAccessTokenCredential(q) {
            let K = this.generateCredentialKey(q);
            this.setItem(K, q)
        }
        getRefreshTokenCredential(q) {
            let K = this.getItem(q);
            if (cV.isRefreshTokenEntity(K)) return K;
            return null
        }
        async setRefreshTokenCredential(q) {
            let K = this.generateCredentialKey(q);
            this.setItem(K, q)
        }
        getAppMetadata(q) {
            let K = this.getItem(q);
            if (cV.isAppMetadataEntity(q, K)) return K;
            return null
        }
        setAppMetadata(q) {
            let K = cV.generateAppMetadataKey(q);
            this.setItem(K, q)
        }
        getServerTelemetry(q) {
            let K = this.getItem(q);
            if (K && cV.isServerTelemetryEntity(q, K)) return K;
            return null
        }
        setServerTelemetry(q, K) {
            this.setItem(q, K)
        }
        getAuthorityMetadata(q) {
            let K = this.getItem(q);
            if (K && cV.isAuthorityMetadataEntity(q, K)) return K;
            return null
        }
        getAuthorityMetadataKeys() {
            return this.getKeys().filter((q) => {
                return this.isAuthorityMetadata(q)
            })
        }
        setAuthorityMetadata(q, K) {
            this.setItem(q, K)
        }
        getThrottlingCache(q) {
            let K = this.getItem(q);
            if (K && cV.isThrottlingEntity(q, K)) return K;
            return null
        }
        setThrottlingCache(q, K) {
            this.setItem(q, K)
        }
        removeItem(q) {
            this.logger.tracePii(`Item key: ${q}`);
            let K = !1,
                _ = this.getCache();
            if (_[q]) delete _[q], K = !0;
            if (K) this.setCache(_), this.emitChange();
            return K
        }
        removeOutdatedAccount(q) {
            this.removeItem(q)
        }
        containsKey(q) {
            return this.getKeys().includes(q)
        }
        getKeys() {
            this.logger.trace("Retrieving all cache keys");
            let q = this.getCache();
            return [...Object.keys(q)]
        }
        clear() {
            this.logger.trace("Clearing cache entries created by MSAL"), this.getKeys().forEach((K) => {
                this.removeItem(K)
            }), this.emitChange()
        }
        static generateInMemoryCache(q) {
            return bq6.deserializeAllCache(bq6.deserializeJSONBlob(q))
        }
        static generateJsonCache(q) {
            return Ww6.serializeAllCache(q)
        }
        updateCredentialCacheKey(q, K) {
            let _ = this.generateCredentialKey(K);
            if (q !== _) {
                let z = this.getItem(q);
                if (z) return this.removeItem(q), this.setItem(_, z), this.logger.verbose(`Updated an outdated ${K.credentialType} cache key`), _;
                else this.logger.error(`Attempted to update an outdated ${K.credentialType} cache key but no item matching the outdated key was found in storage`)
            }
            return q
        }
    }
})
// @from(Ln 125287, Col 0)
class Pr6 {
    constructor(q, K, _) {
        if (this.cacheHasChanged = !1, this.storage = q, this.storage.registerChangeEmitter(this.handleChangeEvent.bind(this)), _) this.persistence = _;
        this.logger = K
    }
    hasChanged() {
        return this.cacheHasChanged
    }
    serialize() {
        this.logger.trace("Serializing in-memory cache");
        let q = Ww6.serializeAllCache(this.storage.getInMemoryCache());
        if (this.cacheSnapshot) this.logger.trace("Reading cache snapshot from disk"), q = this.mergeState(JSON.parse(this.cacheSnapshot), q);
        else this.logger.trace("No cache snapshot to merge");
        return this.cacheHasChanged = !1, JSON.stringify(q)
    }
    deserialize(q) {
        if (this.logger.trace("Deserializing JSON to in-memory cache"), this.cacheSnapshot = q, this.cacheSnapshot) {
            this.logger.trace("Reading cache snapshot from disk");
            let K = bq6.deserializeAllCache(this.overlayDefaults(JSON.parse(this.cacheSnapshot)));
            this.storage.setInMemoryCache(K)
        } else this.logger.trace("No cache snapshot to deserialize")
    }
    getKVStore() {
        return this.storage.getCache()
    }
    getCacheSnapshot() {
        let q = A26.generateInMemoryCache(this.cacheSnapshot);
        return this.storage.inMemoryCacheToCache(q)
    }
    async getAllAccounts(q = new co().createNewGuid()) {
        this.logger.trace("getAllAccounts called");
        let K;
        try {
            if (this.persistence) K = new ib(this, !1), await this.persistence.beforeCacheAccess(K);
            return this.storage.getAllAccounts({}, q)
        } finally {
            if (this.persistence && K) await this.persistence.afterCacheAccess(K)
        }
    }
    async getAccountByHomeId(q) {
        let K = await this.getAllAccounts();
        if (q && K && K.length) return K.filter((_) => _.homeAccountId === q)[0] || null;
        else return null
    }
    async getAccountByLocalId(q) {
        let K = await this.getAllAccounts();
        if (q && K && K.length) return K.filter((_) => _.localAccountId === q)[0] || null;
        else return null
    }
    async removeAccount(q, K) {
        this.logger.trace("removeAccount called");
        let _;
        try {
            if (this.persistence) _ = new ib(this, !0), await this.persistence.beforeCacheAccess(_);
            this.storage.removeAccount(q, K || new Hr6().generateGuid())
        } finally {
            if (this.persistence && _) await this.persistence.afterCacheAccess(_)
        }
    }
    async overwriteCache() {
        if (!this.persistence) {
            this.logger.info("No persistence layer specified, cache cannot be overwritten");
            return
        }
        this.logger.info("Overwriting in-memory cache with persistent cache"), this.storage.clear();
        let q = new ib(this, !1);
        await this.persistence.beforeCacheAccess(q);
        let K = this.getCacheSnapshot();
        this.storage.setCache(K), await this.persistence.afterCacheAccess(q)
    }
    handleChangeEvent() {
        this.cacheHasChanged = !0
    }
    mergeState(q, K) {
        this.logger.trace("Merging in-memory cache with cache snapshot");
        let _ = this.mergeRemovals(q, K);
        return this.mergeUpdates(_, K)
    }
    mergeUpdates(q, K) {
        return Object.keys(K).forEach((_) => {
            let z = K[_];
            if (!q.hasOwnProperty(_)) {
                if (z !== null) q[_] = z
            } else {
                let Y = z !== null,
                    A = typeof z === "object",
                    O = !Array.isArray(z),
                    w = typeof q[_] < "u" && q[_] !== null;
                if (Y && A && O && w) this.mergeUpdates(q[_], z);
                else q[_] = z
            }
        }), q
    }
    mergeRemovals(q, K) {
        this.logger.trace("Remove updated entries in cache");
        let _ = q.Account ? this.mergeRemovalsDict(q.Account, K.Account) : q.Account,
            z = q.AccessToken ? this.mergeRemovalsDict(q.AccessToken, K.AccessToken) : q.AccessToken,
            Y = q.RefreshToken ? this.mergeRemovalsDict(q.RefreshToken, K.RefreshToken) : q.RefreshToken,
            A = q.IdToken ? this.mergeRemovalsDict(q.IdToken, K.IdToken) : q.IdToken,
            O = q.AppMetadata ? this.mergeRemovalsDict(q.AppMetadata, K.AppMetadata) : q.AppMetadata;
        return {
            ...q,
            Account: _,
            AccessToken: z,
            RefreshToken: Y,
            IdToken: A,
            AppMetadata: O
        }
    }
    mergeRemovalsDict(q, K) {
        let _ = {
            ...q
        };
        return Object.keys(q).forEach((z) => {
            if (!K || !K.hasOwnProperty(z)) delete _[z]
        }), _
    }
    overlayDefaults(q) {
        return this.logger.trace("Overlaying input cache with the default cache"), {
            Account: {
                ...Mr6.Account,
                ...q.Account
            },
            IdToken: {
                ...Mr6.IdToken,
                ...q.IdToken
            },
            AccessToken: {
                ...Mr6.AccessToken,
                ...q.AccessToken
            },
            RefreshToken: {
                ...Mr6.RefreshToken,
                ...q.RefreshToken
            },
            AppMetadata: {
                ...Mr6.AppMetadata,
                ...q.AppMetadata
            }
        }
    }
}
// @from(Ln 125429, Col 4)
Mr6
// @from(Ln 125430, Col 4)
VE1 = L(() => {
    Iv8();
    cO();
    Dv8();
    LG8();
    Xr6();
    vE1(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    Mr6 = {
        Account: {},
        IdToken: {},
        AccessToken: {},
        RefreshToken: {},
        AppMetadata: {}
    }
})
// @from(Ln 125445, Col 4)
LV6 = p((kE1, chq) => {
    /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
    var xv8 = d6("buffer"),
        UQ = xv8.Buffer;

    function dhq(q, K) {
        for (var _ in q) K[_] = q[_]
    }
    if (UQ.from && UQ.alloc && UQ.allocUnsafe && UQ.allocUnsafeSlow) chq.exports = xv8;
    else dhq(xv8, kE1), kE1.Buffer = O26;

    function O26(q, K, _) {
        return UQ(q, K, _)
    }
    O26.prototype = Object.create(UQ.prototype);
    dhq(UQ, O26);
    O26.from = function(q, K, _) {
        if (typeof q === "number") throw TypeError("Argument must not be a number");
        return UQ(q, K, _)
    };
    O26.alloc = function(q, K, _) {
        if (typeof q !== "number") throw TypeError("Argument must be a number");
        var z = UQ(q);
        if (K !== void 0)
            if (typeof _ === "string") z.fill(K, _);
            else z.fill(K);
        else z.fill(0);
        return z
    };
    O26.allocUnsafe = function(q) {
        if (typeof q !== "number") throw TypeError("Argument must be a number");
        return UQ(q)
    };
    O26.allocUnsafeSlow = function(q) {
        if (typeof q !== "number") throw TypeError("Argument must be a number");
        return xv8.SlowBuffer(q)
    }
})
// @from(Ln 125483, Col 4)
NE1 = p((PSO, lhq) => {
    var uv8 = LV6().Buffer,
        Es9 = d6("stream"),
        ys9 = d6("util");

    function mv8(q) {
        if (this.buffer = null, this.writable = !0, this.readable = !0, !q) return this.buffer = uv8.alloc(0), this;
        if (typeof q.pipe === "function") return this.buffer = uv8.alloc(0), q.pipe(this), this;
        if (q.length || typeof q === "object") return this.buffer = q, this.writable = !1, process.nextTick(function() {
            this.emit("end", q), this.readable = !1, this.emit("close")
        }.bind(this)), this;
        throw TypeError("Unexpected data type (" + typeof q + ")")
    }
    ys9.inherits(mv8, Es9);
    mv8.prototype.write = function(K) {
        this.buffer = uv8.concat([this.buffer, uv8.from(K)]), this.emit("data", K)
    };
    mv8.prototype.end = function(K) {
        if (K) this.write(K);
        this.emit("end", K), this.emit("close"), this.writable = !1, this.readable = !1
    };
    lhq.exports = mv8
})
// @from(Ln 125506, Col 4)
ihq = p((WSO, nhq) => {
    function EE1(q) {
        var K = (q / 8 | 0) + (q % 8 === 0 ? 0 : 1);
        return K
    }
    var Ls9 = {
        ES256: EE1(256),
        ES384: EE1(384),
        ES512: EE1(521)
    };

    function hs9(q) {
        var K = Ls9[q];
        if (K) return K;
        throw Error('Unknown algorithm "' + q + '"')
    }
    nhq.exports = hs9
})
// @from(Ln 125524, Col 4)
yE1 = p((DSO, ehq) => {
    var Bv8 = LV6().Buffer,
        ohq = ihq(),
        pv8 = 128,
        ahq = 0,
        Rs9 = 32,
        Ss9 = 16,
        Cs9 = 2,
        shq = Ss9 | Rs9 | ahq << 6,
        Fv8 = Cs9 | ahq << 6;

    function bs9(q) {
        return q.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
    }

    function thq(q) {
        if (Bv8.isBuffer(q)) return q;
        else if (typeof q === "string") return Bv8.from(q, "base64");
        throw TypeError("ECDSA signature must be a Base64 string or a Buffer")
    }

    function Is9(q, K) {
        q = thq(q);
        var _ = ohq(K),
            z = _ + 1,
            Y = q.length,
            A = 0;
        if (q[A++] !== shq) throw Error('Could not find expected "seq"');
        var O = q[A++];
        if (O === (pv8 | 1)) O = q[A++];
        if (Y - A < O) throw Error('"seq" specified length of "' + O + '", only "' + (Y - A) + '" remaining');
        if (q[A++] !== Fv8) throw Error('Could not find expected "int" for "r"');
        var w = q[A++];
        if (Y - A - 2 < w) throw Error('"r" specified length of "' + w + '", only "' + (Y - A - 2) + '" available');
        if (z < w) throw Error('"r" specified length of "' + w + '", max of "' + z + '" is acceptable');
        var $ = A;
        if (A += w, q[A++] !== Fv8) throw Error('Could not find expected "int" for "s"');
        var j = q[A++];
        if (Y - A !== j) throw Error('"s" specified length of "' + j + '", expected "' + (Y - A) + '"');
        if (z < j) throw Error('"s" specified length of "' + j + '", max of "' + z + '" is acceptable');
        var H = A;
        if (A += j, A !== Y) throw Error('Expected to consume entire buffer, but "' + (Y - A) + '" bytes remain');
        var J = _ - w,
            X = _ - j,
            M = Bv8.allocUnsafe(J + w + X + j);
        for (A = 0; A < J; ++A) M[A] = 0;
        q.copy(M, A, $ + Math.max(-J, 0), $ + w), A = _;
        for (var P = A; A < P + X; ++A) M[A] = 0;
        return q.copy(M, A, H + Math.max(-X, 0), H + j), M = M.toString("base64"), M = bs9(M), M
    }

    function rhq(q, K, _) {
        var z = 0;
        while (K + z < _ && q[K + z] === 0) ++z;
        var Y = q[K + z] >= pv8;
        if (Y) --z;
        return z
    }

    function xs9(q, K) {
        q = thq(q);
        var _ = ohq(K),
            z = q.length;
        if (z !== _ * 2) throw TypeError('"' + K + '" signatures must be "' + _ * 2 + '" bytes, saw "' + z + '"');
        var Y = rhq(q, 0, _),
            A = rhq(q, _, q.length),
            O = _ - Y,
            w = _ - A,
            $ = 2 + O + 1 + 1 + w,
            j = $ < pv8,
            H = Bv8.allocUnsafe((j ? 2 : 3) + $),
            J = 0;
        if (H[J++] = shq, j) H[J++] = $;
        else H[J++] = pv8 | 1, H[J++] = $ & 255;
        if (H[J++] = Fv8, H[J++] = O, Y < 0) H[J++] = 0, J += q.copy(H, J, 0, _);
        else J += q.copy(H, J, Y, _);
        if (H[J++] = Fv8, H[J++] = w, A < 0) H[J++] = 0, q.copy(H, J, _);
        else q.copy(H, J, _ + A);
        return H
    }
    ehq.exports = {
        derToJose: Is9,
        joseToDer: xs9
    }
})
// @from(Ln 125609, Col 4)
KRq = p((ZSO, qRq) => {
    var Wr6 = d6("buffer").Buffer,
        LE1 = d6("buffer").SlowBuffer;
    qRq.exports = gv8;

    function gv8(q, K) {
        if (!Wr6.isBuffer(q) || !Wr6.isBuffer(K)) return !1;
        if (q.length !== K.length) return !1;
        var _ = 0;
        for (var z = 0; z < q.length; z++) _ |= q[z] ^ K[z];
        return _ === 0
    }
    gv8.install = function() {
        Wr6.prototype.equal = LE1.prototype.equal = function(K) {
            return gv8(this, K)
        }
    };
    var us9 = Wr6.prototype.equal,
        ms9 = LE1.prototype.equal;
    gv8.restore = function() {
        Wr6.prototype.equal = us9, LE1.prototype.equal = ms9
    }
})
// @from(Ln 125632, Col 4)
CE1 = p((fSO, HRq) => {
    var RV6 = LV6().Buffer,
        ob = d6("crypto"),
        zRq = yE1(),
        _Rq = d6("util"),
        Bs9 = `"%s" is not a valid algorithm.
  Supported algorithms are:
  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".`,
        Dr6 = "secret must be a string or buffer",
        hV6 = "key must be a string or a buffer",
        ps9 = "key must be a string, a buffer or an object",
        RE1 = typeof ob.createPublicKey === "function";
    if (RE1) hV6 += " or a KeyObject", Dr6 += "or a KeyObject";

    function YRq(q) {
        if (RV6.isBuffer(q)) return;
        if (typeof q === "string") return;
        if (!RE1) throw GB(hV6);
        if (typeof q !== "object") throw GB(hV6);
        if (typeof q.type !== "string") throw GB(hV6);
        if (typeof q.asymmetricKeyType !== "string") throw GB(hV6);
        if (typeof q.export !== "function") throw GB(hV6)
    }

    function ARq(q) {
        if (RV6.isBuffer(q)) return;
        if (typeof q === "string") return;
        if (typeof q === "object") return;
        throw GB(ps9)
    }

    function Fs9(q) {
        if (RV6.isBuffer(q)) return;
        if (typeof q === "string") return q;
        if (!RE1) throw GB(Dr6);
        if (typeof q !== "object") throw GB(Dr6);
        if (q.type !== "secret") throw GB(Dr6);
        if (typeof q.export !== "function") throw GB(Dr6)
    }

    function SE1(q) {
        return q.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
    }

    function ORq(q) {
        q = q.toString();
        var K = 4 - q.length % 4;
        if (K !== 4)
            for (var _ = 0; _ < K; ++_) q += "=";
        return q.replace(/\-/g, "+").replace(/_/g, "/")
    }

    function GB(q) {
        var K = [].slice.call(arguments, 1),
            _ = _Rq.format.bind(_Rq, q).apply(null, K);
        return TypeError(_)
    }

    function gs9(q) {
        return RV6.isBuffer(q) || typeof q === "string"
    }

    function Zr6(q) {
        if (!gs9(q)) q = JSON.stringify(q);
        return q
    }

    function wRq(q) {
        return function(_, z) {
            Fs9(z), _ = Zr6(_);
            var Y = ob.createHmac("sha" + q, z),
                A = (Y.update(_), Y.digest("base64"));
            return SE1(A)
        }
    }
    var hE1, Us9 = "timingSafeEqual" in ob ? function(K, _) {
        if (K.byteLength !== _.byteLength) return !1;
        return ob.timingSafeEqual(K, _)
    } : function(K, _) {
        if (!hE1) hE1 = KRq();
        return hE1(K, _)
    };

    function Qs9(q) {
        return function(_, z, Y) {
            var A = wRq(q)(_, Y);
            return Us9(RV6.from(z), RV6.from(A))
        }
    }

    function $Rq(q) {
        return function(_, z) {
            ARq(z), _ = Zr6(_);
            var Y = ob.createSign("RSA-SHA" + q),
                A = (Y.update(_), Y.sign(z, "base64"));
            return SE1(A)
        }
    }

    function jRq(q) {
        return function(_, z, Y) {
            YRq(Y), _ = Zr6(_), z = ORq(z);
            var A = ob.createVerify("RSA-SHA" + q);
            return A.update(_), A.verify(Y, z, "base64")
        }
    }

    function ds9(q) {
        return function(_, z) {
            ARq(z), _ = Zr6(_);
            var Y = ob.createSign("RSA-SHA" + q),
                A = (Y.update(_), Y.sign({
                    key: z,
                    padding: ob.constants.RSA_PKCS1_PSS_PADDING,
                    saltLength: ob.constants.RSA_PSS_SALTLEN_DIGEST
                }, "base64"));
            return SE1(A)
        }
    }

    function cs9(q) {
        return function(_, z, Y) {
            YRq(Y), _ = Zr6(_), z = ORq(z);
            var A = ob.createVerify("RSA-SHA" + q);
            return A.update(_), A.verify({
                key: Y,
                padding: ob.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: ob.constants.RSA_PSS_SALTLEN_DIGEST
            }, z, "base64")
        }
    }

    function ls9(q) {
        var K = $Rq(q);
        return function() {
            var z = K.apply(null, arguments);
            return z = zRq.derToJose(z, "ES" + q), z
        }
    }

    function ns9(q) {
        var K = jRq(q);
        return function(z, Y, A) {
            Y = zRq.joseToDer(Y, "ES" + q).toString("base64");
            var O = K(z, Y, A);
            return O
        }
    }

    function is9() {
        return function() {
            return ""
        }
    }

    function rs9() {
        return function(K, _) {
            return _ === ""
        }
    }
    HRq.exports = function(K) {
        var _ = {
                hs: wRq,
                rs: $Rq,
                ps: ds9,
                es: ls9,
                none: is9
            },
            z = {
                hs: Qs9,
                rs: jRq,
                ps: cs9,
                es: ns9,
                none: rs9
            },
            Y = K.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/);
        if (!Y) throw GB(Bs9, K);
        var A = (Y[1] || Y[3]).toLowerCase(),
            O = Y[2];
        return {
            sign: _[A](O),
            verify: z[A](O)
        }
    }
})
// @from(Ln 125817, Col 4)
bE1 = p((GSO, JRq) => {
    var os9 = d6("buffer").Buffer;
    JRq.exports = function(K) {
        if (typeof K === "string") return K;
        if (typeof K === "number" || os9.isBuffer(K)) return K.toString();
        return JSON.stringify(K)
    }
})
// @from(Ln 125825, Col 4)
ZRq = p((vSO, DRq) => {
    var as9 = LV6().Buffer,
        XRq = NE1(),
        ss9 = CE1(),
        ts9 = d6("stream"),
        MRq = bE1(),
        IE1 = d6("util");

    function PRq(q, K) {
        return as9.from(q, K).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
    }

    function es9(q, K, _) {
        _ = _ || "utf8";
        var z = PRq(MRq(q), "binary"),
            Y = PRq(MRq(K), _);
        return IE1.format("%s.%s", z, Y)
    }

    function WRq(q) {
        var {
            header: K,
            payload: _
        } = q, z = q.secret || q.privateKey, Y = q.encoding, A = ss9(K.alg), O = es9(K, _, Y), w = A.sign(O, z);
        return IE1.format("%s.%s", O, w)
    }

    function Uv8(q) {
        var K = q.secret;
        if (K = K == null ? q.privateKey : K, K = K == null ? q.key : K, /^hs/i.test(q.header.alg) === !0 && K == null) throw TypeError("secret must be a string or buffer or a KeyObject");
        var _ = new XRq(K);
        this.readable = !0, this.header = q.header, this.encoding = q.encoding, this.secret = this.privateKey = this.key = _, this.payload = new XRq(q.payload), this.secret.once("close", function() {
            if (!this.payload.writable && this.readable) this.sign()
        }.bind(this)), this.payload.once("close", function() {
            if (!this.secret.writable && this.readable) this.sign()
        }.bind(this))
    }
    IE1.inherits(Uv8, ts9);
    Uv8.prototype.sign = function() {
        try {
            var K = WRq({
                header: this.header,
                payload: this.payload.buffer,
                secret: this.secret.buffer,
                encoding: this.encoding
            });
            return this.emit("done", K), this.emit("data", K), this.emit("end"), this.readable = !1, K
        } catch (_) {
            this.readable = !1, this.emit("error", _), this.emit("close")
        }
    };
    Uv8.sign = WRq;
    DRq.exports = Uv8
})
// @from(Ln 125879, Col 4)
LRq = p((TSO, yRq) => {
    var GRq = LV6().Buffer,
        fRq = NE1(),
        qt9 = CE1(),
        Kt9 = d6("stream"),
        vRq = bE1(),
        _t9 = d6("util"),
        zt9 = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

    function Yt9(q) {
        return Object.prototype.toString.call(q) === "[object Object]"
    }

    function At9(q) {
        if (Yt9(q)) return q;
        try {
            return JSON.parse(q)
        } catch (K) {
            return
        }
    }

    function TRq(q) {
        var K = q.split(".", 1)[0];
        return At9(GRq.from(K, "base64").toString("binary"))
    }

    function Ot9(q) {
        return q.split(".", 2).join(".")
    }

    function VRq(q) {
        return q.split(".")[2]
    }

    function wt9(q, K) {
        K = K || "utf8";
        var _ = q.split(".")[1];
        return GRq.from(_, "base64").toString(K)
    }

    function kRq(q) {
        return zt9.test(q) && !!TRq(q)
    }

    function NRq(q, K, _) {
        if (!K) {
            var z = Error("Missing algorithm parameter for jws.verify");
            throw z.code = "MISSING_ALGORITHM", z
        }
        q = vRq(q);
        var Y = VRq(q),
            A = Ot9(q),
            O = qt9(K);
        return O.verify(A, Y, _)
    }

    function ERq(q, K) {
        if (K = K || {}, q = vRq(q), !kRq(q)) return null;
        var _ = TRq(q);
        if (!_) return null;
        var z = wt9(q);
        if (_.typ === "JWT" || K.json) z = JSON.parse(z, K.encoding);
        return {
            header: _,
            payload: z,
            signature: VRq(q)
        }
    }

    function SV6(q) {
        q = q || {};
        var K = q.secret;
        if (K = K == null ? q.publicKey : K, K = K == null ? q.key : K, /^hs/i.test(q.algorithm) === !0 && K == null) throw TypeError("secret must be a string or buffer or a KeyObject");
        var _ = new fRq(K);
        this.readable = !0, this.algorithm = q.algorithm, this.encoding = q.encoding, this.secret = this.publicKey = this.key = _, this.signature = new fRq(q.signature), this.secret.once("close", function() {
            if (!this.signature.writable && this.readable) this.verify()
        }.bind(this)), this.signature.once("close", function() {
            if (!this.secret.writable && this.readable) this.verify()
        }.bind(this))
    }
    _t9.inherits(SV6, Kt9);
    SV6.prototype.verify = function() {
        try {
            var K = NRq(this.signature.buffer, this.algorithm, this.key.buffer),
                _ = ERq(this.signature.buffer, this.encoding);
            return this.emit("done", K, _), this.emit("data", K), this.emit("end"), this.readable = !1, K
        } catch (z) {
            this.readable = !1, this.emit("error", z), this.emit("close")
        }
    };
    SV6.decode = ERq;
    SV6.isValid = kRq;
    SV6.verify = NRq;
    yRq.exports = SV6
})
// @from(Ln 125975, Col 4)
CV6 = p((jt9) => {
    var hRq = ZRq(),
        Qv8 = LRq(),
        $t9 = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512"];
    jt9.ALGORITHMS = $t9;
    jt9.sign = hRq.sign;
    jt9.verify = Qv8.verify;
    jt9.decode = Qv8.decode;
    jt9.isValid = Qv8.isValid;
    jt9.createSign = function(K) {
        return new hRq(K)
    };
    jt9.createVerify = function(K) {
        return new Qv8(K)
    }
})
// @from(Ln 125991, Col 4)
xE1 = p((kSO, RRq) => {
    var Zt9 = CV6();
    RRq.exports = function(q, K) {
        K = K || {};
        var _ = Zt9.decode(q, K);
        if (!_) return null;
        var z = _.payload;
        if (typeof z === "string") try {
            var Y = JSON.parse(z);
            if (Y !== null && typeof Y === "object") z = Y
        } catch (A) {}
        if (K.complete === !0) return {
            header: _.header,
            payload: z,
            signature: _.signature
        };
        return z
    }
})
// @from(Ln 126010, Col 4)
fr6 = p((NSO, SRq) => {
    var dv8 = function(q, K) {
        if (Error.call(this, q), Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
        if (this.name = "JsonWebTokenError", this.message = q, K) this.inner = K
    };
    dv8.prototype = Object.create(Error.prototype);
    dv8.prototype.constructor = dv8;
    SRq.exports = dv8
})
// @from(Ln 126019, Col 4)
uE1 = p((ESO, bRq) => {
    var CRq = fr6(),
        cv8 = function(q, K) {
            CRq.call(this, q), this.name = "NotBeforeError", this.date = K
        };
    cv8.prototype = Object.create(CRq.prototype);
    cv8.prototype.constructor = cv8;
    bRq.exports = cv8
})
// @from(Ln 126028, Col 4)
mE1 = p((ySO, xRq) => {
    var IRq = fr6(),
        lv8 = function(q, K) {
            IRq.call(this, q), this.name = "TokenExpiredError", this.expiredAt = K
        };
    lv8.prototype = Object.create(IRq.prototype);
    lv8.prototype.constructor = lv8;
    xRq.exports = lv8
})
// @from(Ln 126037, Col 4)
BE1 = p((LSO, uRq) => {
    var ft9 = jz1();
    uRq.exports = function(q, K) {
        var _ = K || Math.floor(Date.now() / 1000);
        if (typeof q === "string") {
            var z = ft9(q);
            if (typeof z > "u") return;
            return Math.floor(_ + z / 1000)
        } else if (typeof q === "number") return _ + q;
        else return
    }
})
// @from(Ln 126049, Col 4)
Gr6 = p((hSO, mRq) => {
    var Gt9 = Number.MAX_SAFE_INTEGER || 9007199254740991,
        vt9 = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];
    mRq.exports = {
        MAX_LENGTH: 256,
        MAX_SAFE_COMPONENT_LENGTH: 16,
        MAX_SAFE_BUILD_LENGTH: 250,
        MAX_SAFE_INTEGER: Gt9,
        RELEASE_TYPES: vt9,
        SEMVER_SPEC_VERSION: "2.0.0",
        FLAG_INCLUDE_PRERELEASE: 1,
        FLAG_LOOSE: 2
    }
})
// @from(Ln 126063, Col 4)
vr6 = p((RSO, BRq) => {
    var Tt9 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...q) => console.error("SEMVER", ...q) : () => {};
    BRq.exports = Tt9
})
// @from(Ln 126067, Col 4)
bV6 = p((QQ, pRq) => {
    var {
        MAX_SAFE_COMPONENT_LENGTH: pE1,
        MAX_SAFE_BUILD_LENGTH: Vt9,
        MAX_LENGTH: kt9
    } = Gr6(), Nt9 = vr6();
    QQ = pRq.exports = {};
    var Et9 = QQ.re = [],
        yt9 = QQ.safeRe = [],
        YK = QQ.src = [],
        Lt9 = QQ.safeSrc = [],
        AK = QQ.t = {},
        ht9 = 0,
        FE1 = "[a-zA-Z0-9-]",
        Rt9 = [
            ["\\s", 1],
            ["\\d", kt9],
            [FE1, Vt9]
        ],
        St9 = (q) => {
            for (let [K, _] of Rt9) q = q.split(`${K}*`).join(`${K}{0,${_}}`).split(`${K}+`).join(`${K}{1,${_}}`);
            return q
        },
        n9 = (q, K, _) => {
            let z = St9(K),
                Y = ht9++;
            Nt9(q, Y, K), AK[q] = Y, YK[Y] = K, Lt9[Y] = z, Et9[Y] = new RegExp(K, _ ? "g" : void 0), yt9[Y] = new RegExp(z, _ ? "g" : void 0)
        };
    n9("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    n9("NUMERICIDENTIFIERLOOSE", "\\d+");
    n9("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${FE1}*`);
    n9("MAINVERSION", `(${YK[AK.NUMERICIDENTIFIER]})\\.(${YK[AK.NUMERICIDENTIFIER]})\\.(${YK[AK.NUMERICIDENTIFIER]})`);
    n9("MAINVERSIONLOOSE", `(${YK[AK.NUMERICIDENTIFIERLOOSE]})\\.(${YK[AK.NUMERICIDENTIFIERLOOSE]})\\.(${YK[AK.NUMERICIDENTIFIERLOOSE]})`);
    n9("PRERELEASEIDENTIFIER", `(?:${YK[AK.NUMERICIDENTIFIER]}|${YK[AK.NONNUMERICIDENTIFIER]})`);
    n9("PRERELEASEIDENTIFIERLOOSE", `(?:${YK[AK.NUMERICIDENTIFIERLOOSE]}|${YK[AK.NONNUMERICIDENTIFIER]})`);
    n9("PRERELEASE", `(?:-(${YK[AK.PRERELEASEIDENTIFIER]}(?:\\.${YK[AK.PRERELEASEIDENTIFIER]})*))`);
    n9("PRERELEASELOOSE", `(?:-?(${YK[AK.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${YK[AK.PRERELEASEIDENTIFIERLOOSE]})*))`);
    n9("BUILDIDENTIFIER", `${FE1}+`);
    n9("BUILD", `(?:\\+(${YK[AK.BUILDIDENTIFIER]}(?:\\.${YK[AK.BUILDIDENTIFIER]})*))`);
    n9("FULLPLAIN", `v?${YK[AK.MAINVERSION]}${YK[AK.PRERELEASE]}?${YK[AK.BUILD]}?`);
    n9("FULL", `^${YK[AK.FULLPLAIN]}$`);
    n9("LOOSEPLAIN", `[v=\\s]*${YK[AK.MAINVERSIONLOOSE]}${YK[AK.PRERELEASELOOSE]}?${YK[AK.BUILD]}?`);
    n9("LOOSE", `^${YK[AK.LOOSEPLAIN]}$`);
    n9("GTLT", "((?:<|>)?=?)");
    n9("XRANGEIDENTIFIERLOOSE", `${YK[AK.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    n9("XRANGEIDENTIFIER", `${YK[AK.NUMERICIDENTIFIER]}|x|X|\\*`);
    n9("XRANGEPLAIN", `[v=\\s]*(${YK[AK.XRANGEIDENTIFIER]})(?:\\.(${YK[AK.XRANGEIDENTIFIER]})(?:\\.(${YK[AK.XRANGEIDENTIFIER]})(?:${YK[AK.PRERELEASE]})?${YK[AK.BUILD]}?)?)?`);
    n9("XRANGEPLAINLOOSE", `[v=\\s]*(${YK[AK.XRANGEIDENTIFIERLOOSE]})(?:\\.(${YK[AK.XRANGEIDENTIFIERLOOSE]})(?:\\.(${YK[AK.XRANGEIDENTIFIERLOOSE]})(?:${YK[AK.PRERELEASELOOSE]})?${YK[AK.BUILD]}?)?)?`);
    n9("XRANGE", `^${YK[AK.GTLT]}\\s*${YK[AK.XRANGEPLAIN]}$`);
    n9("XRANGELOOSE", `^${YK[AK.GTLT]}\\s*${YK[AK.XRANGEPLAINLOOSE]}$`);
    n9("COERCEPLAIN", `(^|[^\\d])(\\d{1,${pE1}})(?:\\.(\\d{1,${pE1}}))?(?:\\.(\\d{1,${pE1}}))?`);
    n9("COERCE", `${YK[AK.COERCEPLAIN]}(?:$|[^\\d])`);
    n9("COERCEFULL", YK[AK.COERCEPLAIN] + `(?:${YK[AK.PRERELEASE]})?(?:${YK[AK.BUILD]})?(?:$|[^\\d])`);
    n9("COERCERTL", YK[AK.COERCE], !0);
    n9("COERCERTLFULL", YK[AK.COERCEFULL], !0);
    n9("LONETILDE", "(?:~>?)");
    n9("TILDETRIM", `(\\s*)${YK[AK.LONETILDE]}\\s+`, !0);
    QQ.tildeTrimReplace = "$1~";
    n9("TILDE", `^${YK[AK.LONETILDE]}${YK[AK.XRANGEPLAIN]}$`);
    n9("TILDELOOSE", `^${YK[AK.LONETILDE]}${YK[AK.XRANGEPLAINLOOSE]}$`);
    n9("LONECARET", "(?:\\^)");
    n9("CARETTRIM", `(\\s*)${YK[AK.LONECARET]}\\s+`, !0);
    QQ.caretTrimReplace = "$1^";
    n9("CARET", `^${YK[AK.LONECARET]}${YK[AK.XRANGEPLAIN]}$`);
    n9("CARETLOOSE", `^${YK[AK.LONECARET]}${YK[AK.XRANGEPLAINLOOSE]}$`);
    n9("COMPARATORLOOSE", `^${YK[AK.GTLT]}\\s*(${YK[AK.LOOSEPLAIN]})$|^$`);
    n9("COMPARATOR", `^${YK[AK.GTLT]}\\s*(${YK[AK.FULLPLAIN]})$|^$`);
    n9("COMPARATORTRIM", `(\\s*)${YK[AK.GTLT]}\\s*(${YK[AK.LOOSEPLAIN]}|${YK[AK.XRANGEPLAIN]})`, !0);
    QQ.comparatorTrimReplace = "$1$2$3";
    n9("HYPHENRANGE", `^\\s*(${YK[AK.XRANGEPLAIN]})\\s+-\\s+(${YK[AK.XRANGEPLAIN]})\\s*$`);
    n9("HYPHENRANGELOOSE", `^\\s*(${YK[AK.XRANGEPLAINLOOSE]})\\s+-\\s+(${YK[AK.XRANGEPLAINLOOSE]})\\s*$`);
    n9("STAR", "(<|>)?=?\\s*\\*");
    n9("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    n9("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$")
})
// @from(Ln 126142, Col 4)
nv8 = p((SSO, FRq) => {
    var Ct9 = Object.freeze({
            loose: !0
        }),
        bt9 = Object.freeze({}),
        It9 = (q) => {
            if (!q) return bt9;
            if (typeof q !== "object") return Ct9;
            return q
        };
    FRq.exports = It9
})
// @from(Ln 126154, Col 4)
gE1 = p((CSO, QRq) => {
    var gRq = /^[0-9]+$/,
        URq = (q, K) => {
            let _ = gRq.test(q),
                z = gRq.test(K);
            if (_ && z) q = +q, K = +K;
            return q === K ? 0 : _ && !z ? -1 : z && !_ ? 1 : q < K ? -1 : 1
        },
        xt9 = (q, K) => URq(K, q);
    QRq.exports = {
        compareIdentifiers: URq,
        rcompareIdentifiers: xt9
    }
})
// @from(Ln 126168, Col 4)
xv = p((bSO, nRq) => {
    var iv8 = vr6(),
        {
            MAX_LENGTH: dRq,
            MAX_SAFE_INTEGER: rv8
        } = Gr6(),
        {
            safeRe: cRq,
            safeSrc: lRq,
            t: ov8
        } = bV6(),
        ut9 = nv8(),
        {
            compareIdentifiers: IV6
        } = gE1();
    class vB {
        constructor(q, K) {
            if (K = ut9(K), q instanceof vB)
                if (q.loose === !!K.loose && q.includePrerelease === !!K.includePrerelease) return q;
                else q = q.version;
            else if (typeof q !== "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof q}".`);
            if (q.length > dRq) throw TypeError(`version is longer than ${dRq} characters`);
            iv8("SemVer", q, K), this.options = K, this.loose = !!K.loose, this.includePrerelease = !!K.includePrerelease;
            let _ = q.trim().match(K.loose ? cRq[ov8.LOOSE] : cRq[ov8.FULL]);
            if (!_) throw TypeError(`Invalid Version: ${q}`);
            if (this.raw = q, this.major = +_[1], this.minor = +_[2], this.patch = +_[3], this.major > rv8 || this.major < 0) throw TypeError("Invalid major version");
            if (this.minor > rv8 || this.minor < 0) throw TypeError("Invalid minor version");
            if (this.patch > rv8 || this.patch < 0) throw TypeError("Invalid patch version");
            if (!_[4]) this.prerelease = [];
            else this.prerelease = _[4].split(".").map((z) => {
                if (/^[0-9]+$/.test(z)) {
                    let Y = +z;
                    if (Y >= 0 && Y < rv8) return Y
                }
                return z
            });
            this.build = _[5] ? _[5].split(".") : [], this.format()
        }
        format() {
            if (this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
            return this.version
        }
        toString() {
            return this.version
        }
        compare(q) {
            if (iv8("SemVer.compare", this.version, this.options, q), !(q instanceof vB)) {
                if (typeof q === "string" && q === this.version) return 0;
                q = new vB(q, this.options)
            }
            if (q.version === this.version) return 0;
            return this.compareMain(q) || this.comparePre(q)
        }
        compareMain(q) {
            if (!(q instanceof vB)) q = new vB(q, this.options);
            return IV6(this.major, q.major) || IV6(this.minor, q.minor) || IV6(this.patch, q.patch)
        }
        comparePre(q) {
            if (!(q instanceof vB)) q = new vB(q, this.options);
            if (this.prerelease.length && !q.prerelease.length) return -1;
            else if (!this.prerelease.length && q.prerelease.length) return 1;
            else if (!this.prerelease.length && !q.prerelease.length) return 0;
            let K = 0;
            do {
                let _ = this.prerelease[K],
                    z = q.prerelease[K];
                if (iv8("prerelease compare", K, _, z), _ === void 0 && z === void 0) return 0;
                else if (z === void 0) return 1;
                else if (_ === void 0) return -1;
                else if (_ === z) continue;
                else return IV6(_, z)
            } while (++K)
        }
        compareBuild(q) {
            if (!(q instanceof vB)) q = new vB(q, this.options);
            let K = 0;
            do {
                let _ = this.build[K],
                    z = q.build[K];
                if (iv8("build compare", K, _, z), _ === void 0 && z === void 0) return 0;
                else if (z === void 0) return 1;
                else if (_ === void 0) return -1;
                else if (_ === z) continue;
                else return IV6(_, z)
            } while (++K)
        }
        inc(q, K, _) {
            if (q.startsWith("pre")) {
                if (!K && _ === !1) throw Error("invalid increment argument: identifier is empty");
                if (K) {
                    let z = new RegExp(`^${this.options.loose?lRq[ov8.PRERELEASELOOSE]:lRq[ov8.PRERELEASE]}$`),
                        Y = `-${K}`.match(z);
                    if (!Y || Y[1] !== K) throw Error(`invalid identifier: ${K}`)
                }
            }
            switch (q) {
                case "premajor":
                    this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", K, _);
                    break;
                case "preminor":
                    this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", K, _);
                    break;
                case "prepatch":
                    this.prerelease.length = 0, this.inc("patch", K, _), this.inc("pre", K, _);
                    break;
                case "prerelease":
                    if (this.prerelease.length === 0) this.inc("patch", K, _);
                    this.inc("pre", K, _);
                    break;
                case "release":
                    if (this.prerelease.length === 0) throw Error(`version ${this.raw} is not a prerelease`);
                    this.prerelease.length = 0;
                    break;
                case "major":
                    if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
                    this.minor = 0, this.patch = 0, this.prerelease = [];
                    break;
                case "minor":
                    if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
                    this.patch = 0, this.prerelease = [];
                    break;
                case "patch":
                    if (this.prerelease.length === 0) this.patch++;
                    this.prerelease = [];
                    break;
                case "pre": {
                    let z = Number(_) ? 1 : 0;
                    if (this.prerelease.length === 0) this.prerelease = [z];
                    else {
                        let Y = this.prerelease.length;
                        while (--Y >= 0)
                            if (typeof this.prerelease[Y] === "number") this.prerelease[Y]++, Y = -2;
                        if (Y === -1) {
                            if (K === this.prerelease.join(".") && _ === !1) throw Error("invalid increment argument: identifier already exists");
                            this.prerelease.push(z)
                        }
                    }
                    if (K) {
                        let Y = [K, z];
                        if (_ === !1) Y = [K];
                        if (IV6(this.prerelease[0], K) === 0) {
                            if (isNaN(this.prerelease[1])) this.prerelease = Y
                        } else this.prerelease = Y
                    }
                    break
                }
                default:
                    throw Error(`invalid increment argument: ${q}`)
            }
            if (this.raw = this.format(), this.build.length) this.raw += `+${this.build.join(".")}`;
            return this
        }
    }
    nRq.exports = vB
})
// @from(Ln 126323, Col 4)
w26 = p((ISO, rRq) => {
    var iRq = xv(),
        mt9 = (q, K, _ = !1) => {
            if (q instanceof iRq) return q;
            try {
                return new iRq(q, K)
            } catch (z) {
                if (!_) return null;
                throw z
            }
        };
    rRq.exports = mt9
})
// @from(Ln 126336, Col 4)
aRq = p((xSO, oRq) => {
    var Bt9 = w26(),
        pt9 = (q, K) => {
            let _ = Bt9(q, K);
            return _ ? _.version : null
        };
    oRq.exports = pt9
})
// @from(Ln 126344, Col 4)
tRq = p((uSO, sRq) => {
    var Ft9 = w26(),
        gt9 = (q, K) => {
            let _ = Ft9(q.trim().replace(/^[=v]+/, ""), K);
            return _ ? _.version : null
        };
    sRq.exports = gt9
})
// @from(Ln 126352, Col 4)
KSq = p((mSO, qSq) => {
    var eRq = xv(),
        Ut9 = (q, K, _, z, Y) => {
            if (typeof _ === "string") Y = z, z = _, _ = void 0;
            try {
                return new eRq(q instanceof eRq ? q.version : q, _).inc(K, z, Y).version
            } catch (A) {
                return null
            }
        };
    qSq.exports = Ut9
})
// @from(Ln 126364, Col 4)
YSq = p((BSO, zSq) => {
    var _Sq = w26(),
        Qt9 = (q, K) => {
            let _ = _Sq(q, null, !0),
                z = _Sq(K, null, !0),
                Y = _.compare(z);
            if (Y === 0) return null;
            let A = Y > 0,
                O = A ? _ : z,
                w = A ? z : _,
                $ = !!O.prerelease.length;
            if (!!w.prerelease.length && !$) {
                if (!w.patch && !w.minor) return "major";
                if (w.compareMain(O) === 0) {
                    if (w.minor && !w.patch) return "minor";
                    return "patch"
                }
            }
            let H = $ ? "pre" : "";
            if (_.major !== z.major) return H + "major";
            if (_.minor !== z.minor) return H + "minor";
            if (_.patch !== z.patch) return H + "patch";
            return "prerelease"
        };
    zSq.exports = Qt9
})
// @from(Ln 126390, Col 4)
OSq = p((pSO, ASq) => {
    var dt9 = xv(),
        ct9 = (q, K) => new dt9(q, K).major;
    ASq.exports = ct9
})
// @from(Ln 126395, Col 4)
$Sq = p((FSO, wSq) => {
    var lt9 = xv(),
        nt9 = (q, K) => new lt9(q, K).minor;
    wSq.exports = nt9
})
// @from(Ln 126400, Col 4)
HSq = p((gSO, jSq) => {
    var it9 = xv(),
        rt9 = (q, K) => new it9(q, K).patch;
    jSq.exports = rt9
})
// @from(Ln 126405, Col 4)
XSq = p((USO, JSq) => {
    var ot9 = w26(),
        at9 = (q, K) => {
            let _ = ot9(q, K);
            return _ && _.prerelease.length ? _.prerelease : null
        };
    JSq.exports = at9
})
// @from(Ln 126413, Col 4)
ab = p((QSO, PSq) => {
    var MSq = xv(),
        st9 = (q, K, _) => new MSq(q, _).compare(new MSq(K, _));
    PSq.exports = st9
})
// @from(Ln 126418, Col 4)
DSq = p((dSO, WSq) => {
    var tt9 = ab(),
        et9 = (q, K, _) => tt9(K, q, _);
    WSq.exports = et9
})
// @from(Ln 126423, Col 4)
fSq = p((cSO, ZSq) => {
    var qe9 = ab(),
        Ke9 = (q, K) => qe9(q, K, !0);
    ZSq.exports = Ke9
})
// @from(Ln 126428, Col 4)
av8 = p((lSO, vSq) => {
    var GSq = xv(),
        _e9 = (q, K, _) => {
            let z = new GSq(q, _),
                Y = new GSq(K, _);
            return z.compare(Y) || z.compareBuild(Y)
        };
    vSq.exports = _e9
})
// @from(Ln 126437, Col 4)
VSq = p((nSO, TSq) => {
    var ze9 = av8(),
        Ye9 = (q, K) => q.sort((_, z) => ze9(_, z, K));
    TSq.exports = Ye9
})
// @from(Ln 126442, Col 4)
NSq = p((iSO, kSq) => {
    var Ae9 = av8(),
        Oe9 = (q, K) => q.sort((_, z) => Ae9(z, _, K));
    kSq.exports = Oe9
})
// @from(Ln 126447, Col 4)
Tr6 = p((rSO, ESq) => {
    var we9 = ab(),
        $e9 = (q, K, _) => we9(q, K, _) > 0;
    ESq.exports = $e9
})
// @from(Ln 126452, Col 4)
sv8 = p((oSO, ySq) => {
    var je9 = ab(),
        He9 = (q, K, _) => je9(q, K, _) < 0;
    ySq.exports = He9
})
// @from(Ln 126457, Col 4)
UE1 = p((aSO, LSq) => {
    var Je9 = ab(),
        Xe9 = (q, K, _) => Je9(q, K, _) === 0;
    LSq.exports = Xe9
})
// @from(Ln 126462, Col 4)
QE1 = p((sSO, hSq) => {
    var Me9 = ab(),
        Pe9 = (q, K, _) => Me9(q, K, _) !== 0;
    hSq.exports = Pe9
})
// @from(Ln 126467, Col 4)
tv8 = p((tSO, RSq) => {
    var We9 = ab(),
        De9 = (q, K, _) => We9(q, K, _) >= 0;
    RSq.exports = De9
})
// @from(Ln 126472, Col 4)
ev8 = p((eSO, SSq) => {
    var Ze9 = ab(),
        fe9 = (q, K, _) => Ze9(q, K, _) <= 0;
    SSq.exports = fe9
})
// @from(Ln 126477, Col 4)
dE1 = p((qCO, CSq) => {
    var Ge9 = UE1(),
        ve9 = QE1(),
        Te9 = Tr6(),
        Ve9 = tv8(),
        ke9 = sv8(),
        Ne9 = ev8(),
        Ee9 = (q, K, _, z) => {
            switch (K) {
                case "===":
                    if (typeof q === "object") q = q.version;
                    if (typeof _ === "object") _ = _.version;
                    return q === _;
                case "!==":
                    if (typeof q === "object") q = q.version;
                    if (typeof _ === "object") _ = _.version;
                    return q !== _;
                case "":
                case "=":
                case "==":
                    return Ge9(q, _, z);
                case "!=":
                    return ve9(q, _, z);
                case ">":
                    return Te9(q, _, z);
                case ">=":
                    return Ve9(q, _, z);
                case "<":
                    return ke9(q, _, z);
                case "<=":
                    return Ne9(q, _, z);
                default:
                    throw TypeError(`Invalid operator: ${K}`)
            }
        };
    CSq.exports = Ee9
})
// @from(Ln 126514, Col 4)
ISq = p((KCO, bSq) => {
    var ye9 = xv(),
        Le9 = w26(),
        {
            safeRe: qT8,
            t: KT8
        } = bV6(),
        he9 = (q, K) => {
            if (q instanceof ye9) return q;
            if (typeof q === "number") q = String(q);
            if (typeof q !== "string") return null;
            K = K || {};
            let _ = null;
            if (!K.rtl) _ = q.match(K.includePrerelease ? qT8[KT8.COERCEFULL] : qT8[KT8.COERCE]);
            else {
                let $ = K.includePrerelease ? qT8[KT8.COERCERTLFULL] : qT8[KT8.COERCERTL],
                    j;
                while ((j = $.exec(q)) && (!_ || _.index + _[0].length !== q.length)) {
                    if (!_ || j.index + j[0].length !== _.index + _[0].length) _ = j;
                    $.lastIndex = j.index + j[1].length + j[2].length
                }
                $.lastIndex = -1
            }
            if (_ === null) return null;
            let z = _[2],
                Y = _[3] || "0",
                A = _[4] || "0",
                O = K.includePrerelease && _[5] ? `-${_[5]}` : "",
                w = K.includePrerelease && _[6] ? `+${_[6]}` : "";
            return Le9(`${z}.${Y}.${A}${O}${w}`, K)
        };
    bSq.exports = he9
})
// @from(Ln 126547, Col 4)
mSq = p((_CO, uSq) => {
    class xSq {
        constructor() {
            this.max = 1000, this.map = new Map
        }
        get(q) {
            let K = this.map.get(q);
            if (K === void 0) return;
            else return this.map.delete(q), this.map.set(q, K), K
        }
        delete(q) {
            return this.map.delete(q)
        }
        set(q, K) {
            if (!this.delete(q) && K !== void 0) {
                if (this.map.size >= this.max) {
                    let z = this.map.keys().next().value;
                    this.delete(z)
                }
                this.map.set(q, K)
            }
            return this
        }
    }
    uSq.exports = xSq
})
// @from(Ln 126573, Col 4)
sb = p((zCO, gSq) => {
    var Re9 = /\s+/g;
    class Vr6 {
        constructor(q, K) {
            if (K = Ce9(K), q instanceof Vr6)
                if (q.loose === !!K.loose && q.includePrerelease === !!K.includePrerelease) return q;
                else return new Vr6(q.raw, K);
            if (q instanceof cE1) return this.raw = q.value, this.set = [
                [q]
            ], this.formatted = void 0, this;
            if (this.options = K, this.loose = !!K.loose, this.includePrerelease = !!K.includePrerelease, this.raw = q.trim().replace(Re9, " "), this.set = this.raw.split("||").map((_) => this.parseRange(_.trim())).filter((_) => _.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
            if (this.set.length > 1) {
                let _ = this.set[0];
                if (this.set = this.set.filter((z) => !pSq(z[0])), this.set.length === 0) this.set = [_];
                else if (this.set.length > 1) {
                    for (let z of this.set)
                        if (z.length === 1 && pe9(z[0])) {
                            this.set = [z];
                            break
                        }
                }
            }
            this.formatted = void 0
        }
        get range() {
            if (this.formatted === void 0) {
                this.formatted = "";
                for (let q = 0; q < this.set.length; q++) {
                    if (q > 0) this.formatted += "||";
                    let K = this.set[q];
                    for (let _ = 0; _ < K.length; _++) {
                        if (_ > 0) this.formatted += " ";
                        this.formatted += K[_].toString().trim()
                    }
                }
            }
            return this.formatted
        }
        format() {
            return this.range
        }
        toString() {
            return this.range
        }
        parseRange(q) {
            let _ = ((this.options.includePrerelease && me9) | (this.options.loose && Be9)) + ":" + q,
                z = BSq.get(_);
            if (z) return z;
            let Y = this.options.loose,
                A = Y ? mE[rV.HYPHENRANGELOOSE] : mE[rV.HYPHENRANGE];
            q = q.replace(A, re9(this.options.includePrerelease)), Hj("hyphen replace", q), q = q.replace(mE[rV.COMPARATORTRIM], Ie9), Hj("comparator trim", q), q = q.replace(mE[rV.TILDETRIM], xe9), Hj("tilde trim", q), q = q.replace(mE[rV.CARETTRIM], ue9), Hj("caret trim", q);
            let O = q.split(" ").map((H) => Fe9(H, this.options)).join(" ").split(/\s+/).map((H) => ie9(H, this.options));
            if (Y) O = O.filter((H) => {
                return Hj("loose invalid filter", H, this.options), !!H.match(mE[rV.COMPARATORLOOSE])
            });
            Hj("range list", O);
            let w = new Map,
                $ = O.map((H) => new cE1(H, this.options));
            for (let H of $) {
                if (pSq(H)) return [H];
                w.set(H.value, H)
            }
            if (w.size > 1 && w.has("")) w.delete("");
            let j = [...w.values()];
            return BSq.set(_, j), j
        }
        intersects(q, K) {
            if (!(q instanceof Vr6)) throw TypeError("a Range is required");
            return this.set.some((_) => {
                return FSq(_, K) && q.set.some((z) => {
                    return FSq(z, K) && _.every((Y) => {
                        return z.every((A) => {
                            return Y.intersects(A, K)
                        })
                    })
                })
            })
        }
        test(q) {
            if (!q) return !1;
            if (typeof q === "string") try {
                q = new be9(q, this.options)
            } catch (K) {
                return !1
            }
            for (let K = 0; K < this.set.length; K++)
                if (oe9(this.set[K], q, this.options)) return !0;
            return !1
        }
    }
    gSq.exports = Vr6;
    var Se9 = mSq(),
        BSq = new Se9,
        Ce9 = nv8(),
        cE1 = kr6(),
        Hj = vr6(),
        be9 = xv(),
        {
            safeRe: mE,
            t: rV,
            comparatorTrimReplace: Ie9,
            tildeTrimReplace: xe9,
            caretTrimReplace: ue9
        } = bV6(),
        {
            FLAG_INCLUDE_PRERELEASE: me9,
            FLAG_LOOSE: Be9
        } = Gr6(),
        pSq = (q) => q.value === "<0.0.0-0",
        pe9 = (q) => q.value === "",
        FSq = (q, K) => {
            let _ = !0,
                z = q.slice(),
                Y = z.pop();
            while (_ && z.length) _ = z.every((A) => {
                return Y.intersects(A, K)
            }), Y = z.pop();
            return _
        },
        Fe9 = (q, K) => {
            return Hj("comp", q, K), q = Qe9(q, K), Hj("caret", q), q = ge9(q, K), Hj("tildes", q), q = ce9(q, K), Hj("xrange", q), q = ne9(q, K), Hj("stars", q), q
        },
        oV = (q) => !q || q.toLowerCase() === "x" || q === "*",
        ge9 = (q, K) => {
            return q.trim().split(/\s+/).map((_) => Ue9(_, K)).join(" ")
        },
        Ue9 = (q, K) => {
            let _ = K.loose ? mE[rV.TILDELOOSE] : mE[rV.TILDE];
            return q.replace(_, (z, Y, A, O, w) => {
                Hj("tilde", q, z, Y, A, O, w);
                let $;
                if (oV(Y)) $ = "";
                else if (oV(A)) $ = `>=${Y}.0.0 <${+Y+1}.0.0-0`;
                else if (oV(O)) $ = `>=${Y}.${A}.0 <${Y}.${+A+1}.0-0`;
                else if (w) Hj("replaceTilde pr", w), $ = `>=${Y}.${A}.${O}-${w} <${Y}.${+A+1}.0-0`;
                else $ = `>=${Y}.${A}.${O} <${Y}.${+A+1}.0-0`;
                return Hj("tilde return", $), $
            })
        },
        Qe9 = (q, K) => {
            return q.trim().split(/\s+/).map((_) => de9(_, K)).join(" ")
        },
        de9 = (q, K) => {
            Hj("caret", q, K);
            let _ = K.loose ? mE[rV.CARETLOOSE] : mE[rV.CARET],
                z = K.includePrerelease ? "-0" : "";
            return q.replace(_, (Y, A, O, w, $) => {
                Hj("caret", q, Y, A, O, w, $);
                let j;
                if (oV(A)) j = "";
                else if (oV(O)) j = `>=${A}.0.0${z} <${+A+1}.0.0-0`;
                else if (oV(w))
                    if (A === "0") j = `>=${A}.${O}.0${z} <${A}.${+O+1}.0-0`;
                    else j = `>=${A}.${O}.0${z} <${+A+1}.0.0-0`;
                else if ($)
                    if (Hj("replaceCaret pr", $), A === "0")
                        if (O === "0") j = `>=${A}.${O}.${w}-${$} <${A}.${O}.${+w+1}-0`;
                        else j = `>=${A}.${O}.${w}-${$} <${A}.${+O+1}.0-0`;
                else j = `>=${A}.${O}.${w}-${$} <${+A+1}.0.0-0`;
                else if (Hj("no pr"), A === "0")
                    if (O === "0") j = `>=${A}.${O}.${w}${z} <${A}.${O}.${+w+1}-0`;
                    else j = `>=${A}.${O}.${w}${z} <${A}.${+O+1}.0-0`;
                else j = `>=${A}.${O}.${w} <${+A+1}.0.0-0`;
                return Hj("caret return", j), j
            })
        },
        ce9 = (q, K) => {
            return Hj("replaceXRanges", q, K), q.split(/\s+/).map((_) => le9(_, K)).join(" ")
        },
        le9 = (q, K) => {
            q = q.trim();
            let _ = K.loose ? mE[rV.XRANGELOOSE] : mE[rV.XRANGE];
            return q.replace(_, (z, Y, A, O, w, $) => {
                Hj("xRange", q, z, Y, A, O, w, $);
                let j = oV(A),
                    H = j || oV(O),
                    J = H || oV(w),
                    X = J;
                if (Y === "=" && X) Y = "";
                if ($ = K.includePrerelease ? "-0" : "", j)
                    if (Y === ">" || Y === "<") z = "<0.0.0-0";
                    else z = "*";
                else if (Y && X) {
                    if (H) O = 0;
                    if (w = 0, Y === ">")
                        if (Y = ">=", H) A = +A + 1, O = 0, w = 0;
                        else O = +O + 1, w = 0;
                    else if (Y === "<=")
                        if (Y = "<", H) A = +A + 1;
                        else O = +O + 1;
                    if (Y === "<") $ = "-0";
                    z = `${Y+A}.${O}.${w}${$}`
                } else if (H) z = `>=${A}.0.0${$} <${+A+1}.0.0-0`;
                else if (J) z = `>=${A}.${O}.0${$} <${A}.${+O+1}.0-0`;
                return Hj("xRange return", z), z
            })
        },
        ne9 = (q, K) => {
            return Hj("replaceStars", q, K), q.trim().replace(mE[rV.STAR], "")
        },
        ie9 = (q, K) => {
            return Hj("replaceGTE0", q, K), q.trim().replace(mE[K.includePrerelease ? rV.GTE0PRE : rV.GTE0], "")
        },
        re9 = (q) => (K, _, z, Y, A, O, w, $, j, H, J, X) => {
            if (oV(z)) _ = "";
            else if (oV(Y)) _ = `>=${z}.0.0${q?"-0":""}`;
            else if (oV(A)) _ = `>=${z}.${Y}.0${q?"-0":""}`;
            else if (O) _ = `>=${_}`;
            else _ = `>=${_}${q?"-0":""}`;
            if (oV(j)) $ = "";
            else if (oV(H)) $ = `<${+j+1}.0.0-0`;
            else if (oV(J)) $ = `<${j}.${+H+1}.0-0`;
            else if (X) $ = `<=${j}.${H}.${J}-${X}`;
            else if (q) $ = `<${j}.${H}.${+J+1}-0`;
            else $ = `<=${$}`;
            return `${_} ${$}`.trim()
        },
        oe9 = (q, K, _) => {
            for (let z = 0; z < q.length; z++)
                if (!q[z].test(K)) return !1;
            if (K.prerelease.length && !_.includePrerelease) {
                for (let z = 0; z < q.length; z++) {
                    if (Hj(q[z].semver), q[z].semver === cE1.ANY) continue;
                    if (q[z].semver.prerelease.length > 0) {
                        let Y = q[z].semver;
                        if (Y.major === K.major && Y.minor === K.minor && Y.patch === K.patch) return !0
                    }
                }
                return !1
            }
            return !0
        }
})
// @from(Ln 126806, Col 4)
kr6 = p((YCO, nSq) => {
    var Nr6 = Symbol("SemVer ANY");
    class _T8 {
        static get ANY() {
            return Nr6
        }
        constructor(q, K) {
            if (K = USq(K), q instanceof _T8)
                if (q.loose === !!K.loose) return q;
                else q = q.value;
            if (q = q.trim().split(/\s+/).join(" "), nE1("comparator", q, K), this.options = K, this.loose = !!K.loose, this.parse(q), this.semver === Nr6) this.value = "";
            else this.value = this.operator + this.semver.version;
            nE1("comp", this)
        }
        parse(q) {
            let K = this.options.loose ? QSq[dSq.COMPARATORLOOSE] : QSq[dSq.COMPARATOR],
                _ = q.match(K);
            if (!_) throw TypeError(`Invalid comparator: ${q}`);
            if (this.operator = _[1] !== void 0 ? _[1] : "", this.operator === "=") this.operator = "";
            if (!_[2]) this.semver = Nr6;
            else this.semver = new cSq(_[2], this.options.loose)
        }
        toString() {
            return this.value
        }
        test(q) {
            if (nE1("Comparator.test", q, this.options.loose), this.semver === Nr6 || q === Nr6) return !0;
            if (typeof q === "string") try {
                q = new cSq(q, this.options)
            } catch (K) {
                return !1
            }
            return lE1(q, this.operator, this.semver, this.options)
        }
        intersects(q, K) {
            if (!(q instanceof _T8)) throw TypeError("a Comparator is required");
            if (this.operator === "") {
                if (this.value === "") return !0;
                return new lSq(q.value, K).test(this.value)
            } else if (q.operator === "") {
                if (q.value === "") return !0;
                return new lSq(this.value, K).test(q.semver)
            }
            if (K = USq(K), K.includePrerelease && (this.value === "<0.0.0-0" || q.value === "<0.0.0-0")) return !1;
            if (!K.includePrerelease && (this.value.startsWith("<0.0.0") || q.value.startsWith("<0.0.0"))) return !1;
            if (this.operator.startsWith(">") && q.operator.startsWith(">")) return !0;
            if (this.operator.startsWith("<") && q.operator.startsWith("<")) return !0;
            if (this.semver.version === q.semver.version && this.operator.includes("=") && q.operator.includes("=")) return !0;
            if (lE1(this.semver, "<", q.semver, K) && this.operator.startsWith(">") && q.operator.startsWith("<")) return !0;
            if (lE1(this.semver, ">", q.semver, K) && this.operator.startsWith("<") && q.operator.startsWith(">")) return !0;
            return !1
        }
    }
    nSq.exports = _T8;
    var USq = nv8(),
        {
            safeRe: QSq,
            t: dSq
        } = bV6(),
        lE1 = dE1(),
        nE1 = vr6(),
        cSq = xv(),
        lSq = sb()
})
// @from(Ln 126870, Col 4)
Er6 = p((ACO, iSq) => {
    var ae9 = sb(),
        se9 = (q, K, _) => {
            try {
                K = new ae9(K, _)
            } catch (z) {
                return !1
            }
            return K.test(q)
        };
    iSq.exports = se9
})
// @from(Ln 126882, Col 4)
oSq = p((OCO, rSq) => {
    var te9 = sb(),
        ee9 = (q, K) => new te9(q, K).set.map((_) => _.map((z) => z.value).join(" ").trim().split(" "));
    rSq.exports = ee9
})
// @from(Ln 126887, Col 4)
sSq = p((wCO, aSq) => {
    var q6_ = xv(),
        K6_ = sb(),
        _6_ = (q, K, _) => {
            let z = null,
                Y = null,
                A = null;
            try {
                A = new K6_(K, _)
            } catch (O) {
                return null
            }
            return q.forEach((O) => {
                if (A.test(O)) {
                    if (!z || Y.compare(O) === -1) z = O, Y = new q6_(z, _)
                }
            }), z
        };
    aSq.exports = _6_
})
// @from(Ln 126907, Col 4)
eSq = p(($CO, tSq) => {
    var z6_ = xv(),
        Y6_ = sb(),
        A6_ = (q, K, _) => {
            let z = null,
                Y = null,
                A = null;
            try {
                A = new Y6_(K, _)
            } catch (O) {
                return null
            }
            return q.forEach((O) => {
                if (A.test(O)) {
                    if (!z || Y.compare(O) === 1) z = O, Y = new z6_(z, _)
                }
            }), z
        };
    tSq.exports = A6_
})
// @from(Ln 126927, Col 4)
_Cq = p((jCO, KCq) => {
    var iE1 = xv(),
        O6_ = sb(),
        qCq = Tr6(),
        w6_ = (q, K) => {
            q = new O6_(q, K);
            let _ = new iE1("0.0.0");
            if (q.test(_)) return _;
            if (_ = new iE1("0.0.0-0"), q.test(_)) return _;
            _ = null;
            for (let z = 0; z < q.set.length; ++z) {
                let Y = q.set[z],
                    A = null;
                if (Y.forEach((O) => {
                        let w = new iE1(O.semver.version);
                        switch (O.operator) {
                            case ">":
                                if (w.prerelease.length === 0) w.patch++;
                                else w.prerelease.push(0);
                                w.raw = w.format();
                            case "":
                            case ">=":
                                if (!A || qCq(w, A)) A = w;
                                break;
                            case "<":
                            case "<=":
                                break;
                            default:
                                throw Error(`Unexpected operation: ${O.operator}`)
                        }
                    }), A && (!_ || qCq(_, A))) _ = A
            }
            if (_ && q.test(_)) return _;
            return null
        };
    KCq.exports = w6_
})
// @from(Ln 126964, Col 4)
YCq = p((HCO, zCq) => {
    var $6_ = sb(),
        j6_ = (q, K) => {
            try {
                return new $6_(q, K).range || "*"
            } catch (_) {
                return null
            }
        };
    zCq.exports = j6_
})
// @from(Ln 126975, Col 4)
zT8 = p((JCO, $Cq) => {
    var H6_ = xv(),
        wCq = kr6(),
        {
            ANY: J6_
        } = wCq,
        X6_ = sb(),
        M6_ = Er6(),
        ACq = Tr6(),
        OCq = sv8(),
        P6_ = ev8(),
        W6_ = tv8(),
        D6_ = (q, K, _, z) => {
            q = new H6_(q, z), K = new X6_(K, z);
            let Y, A, O, w, $;
            switch (_) {
                case ">":
                    Y = ACq, A = P6_, O = OCq, w = ">", $ = ">=";
                    break;
                case "<":
                    Y = OCq, A = W6_, O = ACq, w = "<", $ = "<=";
                    break;
                default:
                    throw TypeError('Must provide a hilo val of "<" or ">"')
            }
            if (M6_(q, K, z)) return !1;
            for (let j = 0; j < K.set.length; ++j) {
                let H = K.set[j],
                    J = null,
                    X = null;
                if (H.forEach((M) => {
                        if (M.semver === J6_) M = new wCq(">=0.0.0");
                        if (J = J || M, X = X || M, Y(M.semver, J.semver, z)) J = M;
                        else if (O(M.semver, X.semver, z)) X = M
                    }), J.operator === w || J.operator === $) return !1;
                if ((!X.operator || X.operator === w) && A(q, X.semver)) return !1;
                else if (X.operator === $ && O(q, X.semver)) return !1
            }
            return !0
        };
    $Cq.exports = D6_
})
// @from(Ln 127017, Col 4)
HCq = p((XCO, jCq) => {
    var Z6_ = zT8(),
        f6_ = (q, K, _) => Z6_(q, K, ">", _);
    jCq.exports = f6_
})
// @from(Ln 127022, Col 4)
XCq = p((MCO, JCq) => {
    var G6_ = zT8(),
        v6_ = (q, K, _) => G6_(q, K, "<", _);
    JCq.exports = v6_
})
// @from(Ln 127027, Col 4)
WCq = p((PCO, PCq) => {
    var MCq = sb(),
        T6_ = (q, K, _) => {
            return q = new MCq(q, _), K = new MCq(K, _), q.intersects(K, _)
        };
    PCq.exports = T6_
})
// @from(Ln 127034, Col 4)
ZCq = p((WCO, DCq) => {
    var V6_ = Er6(),
        k6_ = ab();
    DCq.exports = (q, K, _) => {
        let z = [],
            Y = null,
            A = null,
            O = q.sort((H, J) => k6_(H, J, _));
        for (let H of O)
            if (V6_(H, K, _)) {
                if (A = H, !Y) Y = H
            } else {
                if (A) z.push([Y, A]);
                A = null, Y = null
            } if (Y) z.push([Y, null]);
        let w = [];
        for (let [H, J] of z)
            if (H === J) w.push(H);
            else if (!J && H === O[0]) w.push("*");
        else if (!J) w.push(`>=${H}`);
        else if (H === O[0]) w.push(`<=${J}`);
        else w.push(`${H} - ${J}`);
        let $ = w.join(" || "),
            j = typeof K.raw === "string" ? K.raw : String(K);
        return $.length < j.length ? $ : K
    }
})
// @from(Ln 127061, Col 4)
kCq = p((DCO, VCq) => {
    var fCq = sb(),
        oE1 = kr6(),
        {
            ANY: rE1
        } = oE1,
        yr6 = Er6(),
        aE1 = ab(),
        N6_ = (q, K, _ = {}) => {
            if (q === K) return !0;
            q = new fCq(q, _), K = new fCq(K, _);
            let z = !1;
            q: for (let Y of q.set) {
                for (let A of K.set) {
                    let O = y6_(Y, A, _);
                    if (z = z || O !== null, O) continue q
                }
                if (z) return !1
            }
            return !0
        },
        E6_ = [new oE1(">=0.0.0-0")],
        GCq = [new oE1(">=0.0.0")],
        y6_ = (q, K, _) => {
            if (q === K) return !0;
            if (q.length === 1 && q[0].semver === rE1)
                if (K.length === 1 && K[0].semver === rE1) return !0;
                else if (_.includePrerelease) q = E6_;
            else q = GCq;
            if (K.length === 1 && K[0].semver === rE1)
                if (_.includePrerelease) return !0;
                else K = GCq;
            let z = new Set,
                Y, A;
            for (let M of q)
                if (M.operator === ">" || M.operator === ">=") Y = vCq(Y, M, _);
                else if (M.operator === "<" || M.operator === "<=") A = TCq(A, M, _);
            else z.add(M.semver);
            if (z.size > 1) return null;
            let O;
            if (Y && A) {
                if (O = aE1(Y.semver, A.semver, _), O > 0) return null;
                else if (O === 0 && (Y.operator !== ">=" || A.operator !== "<=")) return null
            }
            for (let M of z) {
                if (Y && !yr6(M, String(Y), _)) return null;
                if (A && !yr6(M, String(A), _)) return null;
                for (let P of K)
                    if (!yr6(M, String(P), _)) return !1;
                return !0
            }
            let w, $, j, H, J = A && !_.includePrerelease && A.semver.prerelease.length ? A.semver : !1,
                X = Y && !_.includePrerelease && Y.semver.prerelease.length ? Y.semver : !1;
            if (J && J.prerelease.length === 1 && A.operator === "<" && J.prerelease[0] === 0) J = !1;
            for (let M of K) {
                if (H = H || M.operator === ">" || M.operator === ">=", j = j || M.operator === "<" || M.operator === "<=", Y) {
                    if (X) {
                        if (M.semver.prerelease && M.semver.prerelease.length && M.semver.major === X.major && M.semver.minor === X.minor && M.semver.patch === X.patch) X = !1
                    }
                    if (M.operator === ">" || M.operator === ">=") {
                        if (w = vCq(Y, M, _), w === M && w !== Y) return !1
                    } else if (Y.operator === ">=" && !yr6(Y.semver, String(M), _)) return !1
                }
                if (A) {
                    if (J) {
                        if (M.semver.prerelease && M.semver.prerelease.length && M.semver.major === J.major && M.semver.minor === J.minor && M.semver.patch === J.patch) J = !1
                    }
                    if (M.operator === "<" || M.operator === "<=") {
                        if ($ = TCq(A, M, _), $ === M && $ !== A) return !1
                    } else if (A.operator === "<=" && !yr6(A.semver, String(M), _)) return !1
                }
                if (!M.operator && (A || Y) && O !== 0) return !1
            }
            if (Y && j && !A && O !== 0) return !1;
            if (A && H && !Y && O !== 0) return !1;
            if (X || J) return !1;
            return !0
        },
        vCq = (q, K, _) => {
            if (!q) return K;
            let z = aE1(q.semver, K.semver, _);
            return z > 0 ? q : z < 0 ? K : K.operator === ">" && q.operator === ">=" ? K : q
        },
        TCq = (q, K, _) => {
            if (!q) return K;
            let z = aE1(q.semver, K.semver, _);
            return z < 0 ? q : z > 0 ? K : K.operator === "<" && q.operator === "<=" ? K : q
        };
    VCq.exports = N6_
})
// @from(Ln 127151, Col 4)
YT8 = p((ZCO, yCq) => {
    var sE1 = bV6(),
        NCq = Gr6(),
        L6_ = xv(),
        ECq = gE1(),
        h6_ = w26(),
        R6_ = aRq(),
        S6_ = tRq(),
        C6_ = KSq(),
        b6_ = YSq(),
        I6_ = OSq(),
        x6_ = $Sq(),
        u6_ = HSq(),
        m6_ = XSq(),
        B6_ = ab(),
        p6_ = DSq(),
        F6_ = fSq(),
        g6_ = av8(),
        U6_ = VSq(),
        Q6_ = NSq(),
        d6_ = Tr6(),
        c6_ = sv8(),
        l6_ = UE1(),
        n6_ = QE1(),
        i6_ = tv8(),
        r6_ = ev8(),
        o6_ = dE1(),
        a6_ = ISq(),
        s6_ = kr6(),
        t6_ = sb(),
        e6_ = Er6(),
        q8_ = oSq(),
        K8_ = sSq(),
        _8_ = eSq(),
        z8_ = _Cq(),
        Y8_ = YCq(),
        A8_ = zT8(),
        O8_ = HCq(),
        w8_ = XCq(),
        $8_ = WCq(),
        j8_ = ZCq(),
        H8_ = kCq();
    yCq.exports = {
        parse: h6_,
        valid: R6_,
        clean: S6_,
        inc: C6_,
        diff: b6_,
        major: I6_,
        minor: x6_,
        patch: u6_,
        prerelease: m6_,
        compare: B6_,
        rcompare: p6_,
        compareLoose: F6_,
        compareBuild: g6_,
        sort: U6_,
        rsort: Q6_,
        gt: d6_,
        lt: c6_,
        eq: l6_,
        neq: n6_,
        gte: i6_,
        lte: r6_,
        cmp: o6_,
        coerce: a6_,
        Comparator: s6_,
        Range: t6_,
        satisfies: e6_,
        toComparators: q8_,
        maxSatisfying: K8_,
        minSatisfying: _8_,
        minVersion: z8_,
        validRange: Y8_,
        outside: A8_,
        gtr: O8_,
        ltr: w8_,
        intersects: $8_,
        simplifyRange: j8_,
        subset: H8_,
        SemVer: L6_,
        re: sE1.re,
        src: sE1.src,
        tokens: sE1.t,
        SEMVER_SPEC_VERSION: NCq.SEMVER_SPEC_VERSION,
        RELEASE_TYPES: NCq.RELEASE_TYPES,
        compareIdentifiers: ECq.compareIdentifiers,
        rcompareIdentifiers: ECq.rcompareIdentifiers
    }
})
// @from(Ln 127241, Col 4)
hCq = p((fCO, LCq) => {
    var J8_ = YT8();
    LCq.exports = J8_.satisfies(process.version, ">=15.7.0")
})
// @from(Ln 127245, Col 4)
SCq = p((GCO, RCq) => {
    var X8_ = YT8();
    RCq.exports = X8_.satisfies(process.version, ">=16.9.0")
})
// @from(Ln 127249, Col 4)
tE1 = p((vCO, CCq) => {
    var M8_ = hCq(),
        P8_ = SCq(),
        W8_ = {
            ec: ["ES256", "ES384", "ES512"],
            rsa: ["RS256", "PS256", "RS384", "PS384", "RS512", "PS512"],
            "rsa-pss": ["PS256", "PS384", "PS512"]
        },
        D8_ = {
            ES256: "prime256v1",
            ES384: "secp384r1",
            ES512: "secp521r1"
        };
    CCq.exports = function(q, K) {
        if (!q || !K) return;
        let _ = K.asymmetricKeyType;
        if (!_) return;
        let z = W8_[_];
        if (!z) throw Error(`Unknown key type "${_}".`);
        if (!z.includes(q)) throw Error(`"alg" parameter for "${_}" key type must be one of: ${z.join(", ")}.`);
        if (M8_) switch (_) {
            case "ec":
                let Y = K.asymmetricKeyDetails.namedCurve,
                    A = D8_[q];
                if (Y !== A) throw Error(`"alg" parameter "${q}" requires curve "${A}".`);
                break;
            case "rsa-pss":
                if (P8_) {
                    let O = parseInt(q.slice(-3), 10),
                        {
                            hashAlgorithm: w,
                            mgf1HashAlgorithm: $,
                            saltLength: j
                        } = K.asymmetricKeyDetails;
                    if (w !== `sha${O}` || $ !== w) throw Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${q}.`);
                    if (j !== void 0 && j > O >> 3) throw Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${q}.`)
                }
                break
        }
    }
})
// @from(Ln 127290, Col 4)
eE1 = p((TCO, bCq) => {
    var Z8_ = YT8();
    bCq.exports = Z8_.satisfies(process.version, "^6.12.0 || >=8.0.0")
})