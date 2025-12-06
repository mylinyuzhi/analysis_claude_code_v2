
// @from(Start 8135385, End 8135552)
class zNA {
  generateGuid() {
    return IrB()
  }
  isGuid(A) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(A)
  }
}
// @from(Start 8135557, End 8135626)
gs1 = L(() => {
  YrB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8135628, End 8136101)
class PU {
  static base64Encode(A, Q) {
    return Buffer.from(A, Q).toString(MD.BASE64)
  }
  static base64EncodeUrl(A, Q) {
    return PU.base64Encode(A, Q).replace(/=/g, L0.EMPTY_STRING).replace(/\+/g, "-").replace(/\//g, "_")
  }
  static base64Decode(A) {
    return Buffer.from(A, MD.BASE64).toString("utf8")
  }
  static base64DecodeUrl(A) {
    let Q = A.replace(/-/g, "+").replace(/_/g, "/");
    while (Q.length % 4) Q += "=";
    return PU.base64Decode(Q)
  }
}
// @from(Start 8136106, End 8136174)
UNA = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8136202, End 8136290)
class HAA {
  sha256(A) {
    return is6.createHash(AsB.SHA256).update(A).digest()
  }
}
// @from(Start 8136295, End 8136363)
w11 = L(() => {
  UI(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8136391, End 8137108)
class us1 {
  constructor() {
    this.hashUtils = new HAA
  }
  async generatePkceCodes() {
    let A = this.generateCodeVerifier(),
      Q = this.generateCodeChallengeFromVerifier(A);
    return {
      verifier: A,
      challenge: Q
    }
  }
  generateCodeVerifier() {
    let A = [],
      Q = 256 - 256 % J11.CV_CHARSET.length;
    while (A.length <= eaB) {
      let G = ns6.randomBytes(1)[0];
      if (G >= Q) continue;
      let Z = G % J11.CV_CHARSET.length;
      A.push(J11.CV_CHARSET[Z])
    }
    let B = A.join(L0.EMPTY_STRING);
    return PU.base64EncodeUrl(B)
  }
  generateCodeChallengeFromVerifier(A) {
    return PU.base64EncodeUrl(this.hashUtils.sha256(A).toString(MD.BASE64), MD.BASE64)
  }
}
// @from(Start 8137113, End 8137207)
JrB = L(() => {
  p7();
  UI();
  UNA();
  w11(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8137209, End 8138113)
class rf {
  constructor() {
    this.pkceGenerator = new us1, this.guidGenerator = new zNA, this.hashUtils = new HAA
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
  base64Encode(A) {
    return PU.base64Encode(A)
  }
  base64Decode(A) {
    return PU.base64Decode(A)
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
  async hashString(A) {
    return PU.base64EncodeUrl(this.hashUtils.sha256(A).toString(MD.BASE64), MD.BASE64)
  }
}
// @from(Start 8138118, End 8138222)
$NA = L(() => {
  p7();
  gs1();
  UNA();
  JrB();
  w11(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8138228, End 8138309)
q11 = L(() => {
  mZ();
  Ua1(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8138312, End 8138683)
function WrB(A) {
  let Q = A.credentialType === c7.REFRESH_TOKEN && A.familyId || A.clientId,
    B = A.tokenType && A.tokenType.toLowerCase() !== A5.BEARER.toLowerCase() ? A.tokenType.toLowerCase() : "";
  return [A.homeAccountId, A.environment, A.credentialType, Q, A.realm || "", A.target || "", A.requestedClaimsHash || "", B].join(Ts1.KEY_SEPARATOR).toLowerCase()
}
// @from(Start 8138685, End 8138848)
function XrB(A) {
  let Q = A.homeAccountId.split(".")[1];
  return [A.homeAccountId, A.environment, Q || A.tenantId || ""].join(Ts1.KEY_SEPARATOR).toLowerCase()
}
// @from(Start 8138853, End 8138929)
VrB = L(() => {
  p7();
  UI(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8138935, End 8138938)
CAA
// @from(Start 8138944, End 8144686)
N11 = L(() => {
  p7();
  I11();
  EA1();
  q11();
  VrB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  CAA = class CAA extends BAA {
    constructor(A, Q, B, G) {
      super(Q, B, A, new SZA, G);
      this.cache = {}, this.changeEmitters = [], this.logger = A
    }
    registerChangeEmitter(A) {
      this.changeEmitters.push(A)
    }
    emitChange() {
      this.changeEmitters.forEach((A) => A.call(null))
    }
    cacheToInMemoryCache(A) {
      let Q = {
        accounts: {},
        idTokens: {},
        accessTokens: {},
        refreshTokens: {},
        appMetadata: {}
      };
      for (let B in A) {
        let G = A[B];
        if (typeof G !== "object") continue;
        if (G instanceof cX) Q.accounts[B] = G;
        else if (UE.isIdTokenEntity(G)) Q.idTokens[B] = G;
        else if (UE.isAccessTokenEntity(G)) Q.accessTokens[B] = G;
        else if (UE.isRefreshTokenEntity(G)) Q.refreshTokens[B] = G;
        else if (UE.isAppMetadataEntity(B, G)) Q.appMetadata[B] = G;
        else continue
      }
      return Q
    }
    inMemoryCacheToCache(A) {
      let Q = this.getCache();
      return Q = {
        ...Q,
        ...A.accounts,
        ...A.idTokens,
        ...A.accessTokens,
        ...A.refreshTokens,
        ...A.appMetadata
      }, Q
    }
    getInMemoryCache() {
      return this.logger.trace("Getting in-memory cache"), this.cacheToInMemoryCache(this.getCache())
    }
    setInMemoryCache(A) {
      this.logger.trace("Setting in-memory cache");
      let Q = this.inMemoryCacheToCache(A);
      this.setCache(Q), this.emitChange()
    }
    getCache() {
      return this.logger.trace("Getting cache key-value store"), this.cache
    }
    setCache(A) {
      this.logger.trace("Setting cache key value store"), this.cache = A, this.emitChange()
    }
    getItem(A) {
      return this.logger.tracePii(`Item key: ${A}`), this.getCache()[A]
    }
    setItem(A, Q) {
      this.logger.tracePii(`Item key: ${A}`);
      let B = this.getCache();
      B[A] = Q, this.setCache(B)
    }
    generateCredentialKey(A) {
      return WrB(A)
    }
    generateAccountKey(A) {
      return XrB(A)
    }
    getAccountKeys() {
      let A = this.getInMemoryCache();
      return Object.keys(A.accounts)
    }
    getTokenKeys() {
      let A = this.getInMemoryCache();
      return {
        idToken: Object.keys(A.idTokens),
        accessToken: Object.keys(A.accessTokens),
        refreshToken: Object.keys(A.refreshTokens)
      }
    }
    getAccount(A) {
      return this.getItem(A) ? Object.assign(new cX, this.getItem(A)) : null
    }
    async setAccount(A) {
      let Q = this.generateAccountKey(cX.getAccountInfo(A));
      this.setItem(Q, A)
    }
    getIdTokenCredential(A) {
      let Q = this.getItem(A);
      if (UE.isIdTokenEntity(Q)) return Q;
      return null
    }
    async setIdTokenCredential(A) {
      let Q = this.generateCredentialKey(A);
      this.setItem(Q, A)
    }
    getAccessTokenCredential(A) {
      let Q = this.getItem(A);
      if (UE.isAccessTokenEntity(Q)) return Q;
      return null
    }
    async setAccessTokenCredential(A) {
      let Q = this.generateCredentialKey(A);
      this.setItem(Q, A)
    }
    getRefreshTokenCredential(A) {
      let Q = this.getItem(A);
      if (UE.isRefreshTokenEntity(Q)) return Q;
      return null
    }
    async setRefreshTokenCredential(A) {
      let Q = this.generateCredentialKey(A);
      this.setItem(Q, A)
    }
    getAppMetadata(A) {
      let Q = this.getItem(A);
      if (UE.isAppMetadataEntity(A, Q)) return Q;
      return null
    }
    setAppMetadata(A) {
      let Q = UE.generateAppMetadataKey(A);
      this.setItem(Q, A)
    }
    getServerTelemetry(A) {
      let Q = this.getItem(A);
      if (Q && UE.isServerTelemetryEntity(A, Q)) return Q;
      return null
    }
    setServerTelemetry(A, Q) {
      this.setItem(A, Q)
    }
    getAuthorityMetadata(A) {
      let Q = this.getItem(A);
      if (Q && UE.isAuthorityMetadataEntity(A, Q)) return Q;
      return null
    }
    getAuthorityMetadataKeys() {
      return this.getKeys().filter((A) => {
        return this.isAuthorityMetadata(A)
      })
    }
    setAuthorityMetadata(A, Q) {
      this.setItem(A, Q)
    }
    getThrottlingCache(A) {
      let Q = this.getItem(A);
      if (Q && UE.isThrottlingEntity(A, Q)) return Q;
      return null
    }
    setThrottlingCache(A, Q) {
      this.setItem(A, Q)
    }
    removeItem(A) {
      this.logger.tracePii(`Item key: ${A}`);
      let Q = !1,
        B = this.getCache();
      if (B[A]) delete B[A], Q = !0;
      if (Q) this.setCache(B), this.emitChange();
      return Q
    }
    removeOutdatedAccount(A) {
      this.removeItem(A)
    }
    containsKey(A) {
      return this.getKeys().includes(A)
    }
    getKeys() {
      this.logger.trace("Retrieving all cache keys");
      let A = this.getCache();
      return [...Object.keys(A)]
    }
    clear() {
      this.logger.trace("Clearing cache entries created by MSAL"), this.getKeys().forEach((Q) => {
        this.removeItem(Q)
      }), this.emitChange()
    }
    static generateInMemoryCache(A) {
      return Ul.deserializeAllCache(Ul.deserializeJSONBlob(A))
    }
    static generateJsonCache(A) {
      return Oe.serializeAllCache(A)
    }
    updateCredentialCacheKey(A, Q) {
      let B = this.generateCredentialKey(Q);
      if (A !== B) {
        let G = this.getItem(A);
        if (G) return this.removeItem(A), this.setItem(B, G), this.logger.verbose(`Updated an outdated ${Q.credentialType} cache key`), B;
        else this.logger.error(`Attempted to update an outdated ${Q.credentialType} cache key but no item matching the outdated key was found in storage`)
      }
      return A
    }
  }
})
// @from(Start 8144688, End 8149474)
class qNA {
  constructor(A, Q, B) {
    if (this.cacheHasChanged = !1, this.storage = A, this.storage.registerChangeEmitter(this.handleChangeEvent.bind(this)), B) this.persistence = B;
    this.logger = Q
  }
  hasChanged() {
    return this.cacheHasChanged
  }
  serialize() {
    this.logger.trace("Serializing in-memory cache");
    let A = Oe.serializeAllCache(this.storage.getInMemoryCache());
    if (this.cacheSnapshot) this.logger.trace("Reading cache snapshot from disk"), A = this.mergeState(JSON.parse(this.cacheSnapshot), A);
    else this.logger.trace("No cache snapshot to merge");
    return this.cacheHasChanged = !1, JSON.stringify(A)
  }
  deserialize(A) {
    if (this.logger.trace("Deserializing JSON to in-memory cache"), this.cacheSnapshot = A, this.cacheSnapshot) {
      this.logger.trace("Reading cache snapshot from disk");
      let Q = Ul.deserializeAllCache(this.overlayDefaults(JSON.parse(this.cacheSnapshot)));
      this.storage.setInMemoryCache(Q)
    } else this.logger.trace("No cache snapshot to deserialize")
  }
  getKVStore() {
    return this.storage.getCache()
  }
  getCacheSnapshot() {
    let A = CAA.generateInMemoryCache(this.cacheSnapshot);
    return this.storage.inMemoryCacheToCache(A)
  }
  async getAllAccounts(A = new rf().createNewGuid()) {
    this.logger.trace("getAllAccounts called");
    let Q;
    try {
      if (this.persistence) Q = new SM(this, !1), await this.persistence.beforeCacheAccess(Q);
      return this.storage.getAllAccounts({}, A)
    } finally {
      if (this.persistence && Q) await this.persistence.afterCacheAccess(Q)
    }
  }
  async getAccountByHomeId(A) {
    let Q = await this.getAllAccounts();
    if (A && Q && Q.length) return Q.filter((B) => B.homeAccountId === A)[0] || null;
    else return null
  }
  async getAccountByLocalId(A) {
    let Q = await this.getAllAccounts();
    if (A && Q && Q.length) return Q.filter((B) => B.localAccountId === A)[0] || null;
    else return null
  }
  async removeAccount(A, Q) {
    this.logger.trace("removeAccount called");
    let B;
    try {
      if (this.persistence) B = new SM(this, !0), await this.persistence.beforeCacheAccess(B);
      this.storage.removeAccount(A, Q || new zNA().generateGuid())
    } finally {
      if (this.persistence && B) await this.persistence.afterCacheAccess(B)
    }
  }
  async overwriteCache() {
    if (!this.persistence) {
      this.logger.info("No persistence layer specified, cache cannot be overwritten");
      return
    }
    this.logger.info("Overwriting in-memory cache with persistent cache"), this.storage.clear();
    let A = new SM(this, !1);
    await this.persistence.beforeCacheAccess(A);
    let Q = this.getCacheSnapshot();
    this.storage.setCache(Q), await this.persistence.afterCacheAccess(A)
  }
  handleChangeEvent() {
    this.cacheHasChanged = !0
  }
  mergeState(A, Q) {
    this.logger.trace("Merging in-memory cache with cache snapshot");
    let B = this.mergeRemovals(A, Q);
    return this.mergeUpdates(B, Q)
  }
  mergeUpdates(A, Q) {
    return Object.keys(Q).forEach((B) => {
      let G = Q[B];
      if (!A.hasOwnProperty(B)) {
        if (G !== null) A[B] = G
      } else {
        let Z = G !== null,
          I = typeof G === "object",
          Y = !Array.isArray(G),
          J = typeof A[B] < "u" && A[B] !== null;
        if (Z && I && Y && J) this.mergeUpdates(A[B], G);
        else A[B] = G
      }
    }), A
  }
  mergeRemovals(A, Q) {
    this.logger.trace("Remove updated entries in cache");
    let B = A.Account ? this.mergeRemovalsDict(A.Account, Q.Account) : A.Account,
      G = A.AccessToken ? this.mergeRemovalsDict(A.AccessToken, Q.AccessToken) : A.AccessToken,
      Z = A.RefreshToken ? this.mergeRemovalsDict(A.RefreshToken, Q.RefreshToken) : A.RefreshToken,
      I = A.IdToken ? this.mergeRemovalsDict(A.IdToken, Q.IdToken) : A.IdToken,
      Y = A.AppMetadata ? this.mergeRemovalsDict(A.AppMetadata, Q.AppMetadata) : A.AppMetadata;
    return {
      ...A,
      Account: B,
      AccessToken: G,
      RefreshToken: Z,
      IdToken: I,
      AppMetadata: Y
    }
  }
  mergeRemovalsDict(A, Q) {
    let B = {
      ...A
    };
    return Object.keys(A).forEach((G) => {
      if (!Q || !Q.hasOwnProperty(G)) delete B[G]
    }), B
  }
  overlayDefaults(A) {
    return this.logger.trace("Overlaying input cache with the default cache"), {
      Account: {
        ...wNA.Account,
        ...A.Account
      },
      IdToken: {
        ...wNA.IdToken,
        ...A.IdToken
      },
      AccessToken: {
        ...wNA.AccessToken,
        ...A.AccessToken
      },
      RefreshToken: {
        ...wNA.RefreshToken,
        ...A.RefreshToken
      },
      AppMetadata: {
        ...wNA.AppMetadata,
        ...A.AppMetadata
      }
    }
  }
}
// @from(Start 8149479, End 8149482)
wNA
// @from(Start 8149488, End 8149712)
ms1 = L(() => {
  N11();
  p7();
  I11();
  EA1();
  $NA();
  gs1(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  wNA = {
    Account: {},
    IdToken: {},
    AccessToken: {},
    RefreshToken: {},
    AppMetadata: {}
  }
})
// @from(Start 8149718, End 8150636)
ds1 = z((FKG, FrB) => {
  var L11 = Bk().Buffer,
    as6 = UA("stream"),
    ss6 = UA("util");

  function M11(A) {
    if (this.buffer = null, this.writable = !0, this.readable = !0, !A) return this.buffer = L11.alloc(0), this;
    if (typeof A.pipe === "function") return this.buffer = L11.alloc(0), A.pipe(this), this;
    if (A.length || typeof A === "object") return this.buffer = A, this.writable = !1, process.nextTick(function() {
      this.emit("end", A), this.readable = !1, this.emit("close")
    }.bind(this)), this;
    throw TypeError("Unexpected data type (" + typeof A + ")")
  }
  ss6.inherits(M11, as6);
  M11.prototype.write = function(Q) {
    this.buffer = L11.concat([this.buffer, L11.from(Q)]), this.emit("data", Q)
  };
  M11.prototype.end = function(Q) {
    if (Q) this.write(Q);
    this.emit("end", Q), this.emit("close"), this.writable = !1, this.readable = !1
  };
  FrB.exports = M11
})
// @from(Start 8150642, End 8155124)
is1 = z((KKG, wrB) => {
  var dZA = Bk().Buffer,
    kM = UA("crypto"),
    DrB = weA(),
    KrB = UA("util"),
    rs6 = `"%s" is not a valid algorithm.
  Supported algorithms are:
  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".`,
    NNA = "secret must be a string or buffer",
    mZA = "key must be a string or a buffer",
    os6 = "key must be a string, a buffer or an object",
    ps1 = typeof kM.createPublicKey === "function";
  if (ps1) mZA += " or a KeyObject", NNA += "or a KeyObject";

  function HrB(A) {
    if (dZA.isBuffer(A)) return;
    if (typeof A === "string") return;
    if (!ps1) throw dT(mZA);
    if (typeof A !== "object") throw dT(mZA);
    if (typeof A.type !== "string") throw dT(mZA);
    if (typeof A.asymmetricKeyType !== "string") throw dT(mZA);
    if (typeof A.export !== "function") throw dT(mZA)
  }

  function CrB(A) {
    if (dZA.isBuffer(A)) return;
    if (typeof A === "string") return;
    if (typeof A === "object") return;
    throw dT(os6)
  }

  function ts6(A) {
    if (dZA.isBuffer(A)) return;
    if (typeof A === "string") return A;
    if (!ps1) throw dT(NNA);
    if (typeof A !== "object") throw dT(NNA);
    if (A.type !== "secret") throw dT(NNA);
    if (typeof A.export !== "function") throw dT(NNA)
  }

  function ls1(A) {
    return A.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
  }

  function ErB(A) {
    A = A.toString();
    var Q = 4 - A.length % 4;
    if (Q !== 4)
      for (var B = 0; B < Q; ++B) A += "=";
    return A.replace(/\-/g, "+").replace(/_/g, "/")
  }

  function dT(A) {
    var Q = [].slice.call(arguments, 1),
      B = KrB.format.bind(KrB, A).apply(null, Q);
    return TypeError(B)
  }

  function es6(A) {
    return dZA.isBuffer(A) || typeof A === "string"
  }

  function LNA(A) {
    if (!es6(A)) A = JSON.stringify(A);
    return A
  }

  function zrB(A) {
    return function(B, G) {
      ts6(G), B = LNA(B);
      var Z = kM.createHmac("sha" + A, G),
        I = (Z.update(B), Z.digest("base64"));
      return ls1(I)
    }
  }
  var cs1, Ar6 = "timingSafeEqual" in kM ? function(Q, B) {
    if (Q.byteLength !== B.byteLength) return !1;
    return kM.timingSafeEqual(Q, B)
  } : function(Q, B) {
    if (!cs1) cs1 = fl1();
    return cs1(Q, B)
  };

  function Qr6(A) {
    return function(B, G, Z) {
      var I = zrB(A)(B, Z);
      return Ar6(dZA.from(G), dZA.from(I))
    }
  }

  function UrB(A) {
    return function(B, G) {
      CrB(G), B = LNA(B);
      var Z = kM.createSign("RSA-SHA" + A),
        I = (Z.update(B), Z.sign(G, "base64"));
      return ls1(I)
    }
  }

  function $rB(A) {
    return function(B, G, Z) {
      HrB(Z), B = LNA(B), G = ErB(G);
      var I = kM.createVerify("RSA-SHA" + A);
      return I.update(B), I.verify(Z, G, "base64")
    }
  }

  function Br6(A) {
    return function(B, G) {
      CrB(G), B = LNA(B);
      var Z = kM.createSign("RSA-SHA" + A),
        I = (Z.update(B), Z.sign({
          key: G,
          padding: kM.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: kM.constants.RSA_PSS_SALTLEN_DIGEST
        }, "base64"));
      return ls1(I)
    }
  }

  function Gr6(A) {
    return function(B, G, Z) {
      HrB(Z), B = LNA(B), G = ErB(G);
      var I = kM.createVerify("RSA-SHA" + A);
      return I.update(B), I.verify({
        key: Z,
        padding: kM.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: kM.constants.RSA_PSS_SALTLEN_DIGEST
      }, G, "base64")
    }
  }

  function Zr6(A) {
    var Q = UrB(A);
    return function() {
      var G = Q.apply(null, arguments);
      return G = DrB.derToJose(G, "ES" + A), G
    }
  }

  function Ir6(A) {
    var Q = $rB(A);
    return function(G, Z, I) {
      Z = DrB.joseToDer(Z, "ES" + A).toString("base64");
      var Y = Q(G, Z, I);
      return Y
    }
  }

  function Yr6() {
    return function() {
      return ""
    }
  }

  function Jr6() {
    return function(Q, B) {
      return B === ""
    }
  }
  wrB.exports = function(Q) {
    var B = {
        hs: zrB,
        rs: UrB,
        ps: Br6,
        es: Zr6,
        none: Yr6
      },
      G = {
        hs: Qr6,
        rs: $rB,
        ps: Gr6,
        es: Ir6,
        none: Jr6
      },
      Z = Q.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/i);
    if (!Z) throw dT(rs6, Q);
    var I = (Z[1] || Z[3]).toLowerCase(),
      Y = Z[2];
    return {
      sign: B[I](Y),
      verify: G[I](Y)
    }
  }
})
// @from(Start 8155130, End 8155364)
ns1 = z((DKG, qrB) => {
  var Wr6 = UA("buffer").Buffer;
  qrB.exports = function(Q) {
    if (typeof Q === "string") return Q;
    if (typeof Q === "number" || Wr6.isBuffer(Q)) return Q.toString();
    return JSON.stringify(Q)
  }
})
// @from(Start 8155370, End 8156975)
TrB = z((HKG, RrB) => {
  var Xr6 = Bk().Buffer,
    NrB = ds1(),
    Vr6 = is1(),
    Fr6 = UA("stream"),
    LrB = ns1(),
    as1 = UA("util");

  function MrB(A, Q) {
    return Xr6.from(A, Q).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
  }

  function Kr6(A, Q, B) {
    B = B || "utf8";
    var G = MrB(LrB(A), "binary"),
      Z = MrB(LrB(Q), B);
    return as1.format("%s.%s", G, Z)
  }

  function OrB(A) {
    var {
      header: Q,
      payload: B
    } = A, G = A.secret || A.privateKey, Z = A.encoding, I = Vr6(Q.alg), Y = Kr6(Q, B, Z), J = I.sign(Y, G);
    return as1.format("%s.%s", Y, J)
  }

  function O11(A) {
    var Q = A.secret || A.privateKey || A.key,
      B = new NrB(Q);
    this.readable = !0, this.header = A.header, this.encoding = A.encoding, this.secret = this.privateKey = this.key = B, this.payload = new NrB(A.payload), this.secret.once("close", function() {
      if (!this.payload.writable && this.readable) this.sign()
    }.bind(this)), this.payload.once("close", function() {
      if (!this.secret.writable && this.readable) this.sign()
    }.bind(this))
  }
  as1.inherits(O11, Fr6);
  O11.prototype.sign = function() {
    try {
      var Q = OrB({
        header: this.header,
        payload: this.payload.buffer,
        secret: this.secret.buffer,
        encoding: this.encoding
      });
      return this.emit("done", Q), this.emit("data", Q), this.emit("end"), this.readable = !1, Q
    } catch (B) {
      this.readable = !1, this.emit("error", B), this.emit("close")
    }
  };
  O11.sign = OrB;
  RrB.exports = O11
})
// @from(Start 8156981, End 8159389)
frB = z((CKG, brB) => {
  var jrB = Bk().Buffer,
    PrB = ds1(),
    Dr6 = is1(),
    Hr6 = UA("stream"),
    SrB = ns1(),
    Cr6 = UA("util"),
    Er6 = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

  function zr6(A) {
    return Object.prototype.toString.call(A) === "[object Object]"
  }

  function Ur6(A) {
    if (zr6(A)) return A;
    try {
      return JSON.parse(A)
    } catch (Q) {
      return
    }
  }

  function _rB(A) {
    var Q = A.split(".", 1)[0];
    return Ur6(jrB.from(Q, "base64").toString("binary"))
  }

  function $r6(A) {
    return A.split(".", 2).join(".")
  }

  function krB(A) {
    return A.split(".")[2]
  }

  function wr6(A, Q) {
    Q = Q || "utf8";
    var B = A.split(".")[1];
    return jrB.from(B, "base64").toString(Q)
  }

  function yrB(A) {
    return Er6.test(A) && !!_rB(A)
  }

  function xrB(A, Q, B) {
    if (!Q) {
      var G = Error("Missing algorithm parameter for jws.verify");
      throw G.code = "MISSING_ALGORITHM", G
    }
    A = SrB(A);
    var Z = krB(A),
      I = $r6(A),
      Y = Dr6(Q);
    return Y.verify(I, Z, B)
  }

  function vrB(A, Q) {
    if (Q = Q || {}, A = SrB(A), !yrB(A)) return null;
    var B = _rB(A);
    if (!B) return null;
    var G = wr6(A);
    if (B.typ === "JWT" || Q.json) G = JSON.parse(G, Q.encoding);
    return {
      header: B,
      payload: G,
      signature: krB(A)
    }
  }

  function cZA(A) {
    A = A || {};
    var Q = A.secret || A.publicKey || A.key,
      B = new PrB(Q);
    this.readable = !0, this.algorithm = A.algorithm, this.encoding = A.encoding, this.secret = this.publicKey = this.key = B, this.signature = new PrB(A.signature), this.secret.once("close", function() {
      if (!this.signature.writable && this.readable) this.verify()
    }.bind(this)), this.signature.once("close", function() {
      if (!this.secret.writable && this.readable) this.verify()
    }.bind(this))
  }
  Cr6.inherits(cZA, Hr6);
  cZA.prototype.verify = function() {
    try {
      var Q = xrB(this.signature.buffer, this.algorithm, this.key.buffer),
        B = vrB(this.signature.buffer, this.encoding);
      return this.emit("done", Q, B), this.emit("data", Q), this.emit("end"), this.readable = !1, Q
    } catch (G) {
      this.readable = !1, this.emit("error", G), this.emit("close")
    }
  };
  cZA.decode = vrB;
  cZA.isValid = yrB;
  cZA.verify = xrB;
  brB.exports = cZA
})
// @from(Start 8159395, End 8159823)
T11 = z((Nr6) => {
  var hrB = TrB(),
    R11 = frB(),
    qr6 = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512"];
  Nr6.ALGORITHMS = qr6;
  Nr6.sign = hrB.sign;
  Nr6.verify = R11.verify;
  Nr6.decode = R11.decode;
  Nr6.isValid = R11.isValid;
  Nr6.createSign = function(Q) {
    return new hrB(Q)
  };
  Nr6.createVerify = function(Q) {
    return new R11(Q)
  }
})
// @from(Start 8159829, End 8160271)
ss1 = z((zKG, grB) => {
  var Sr6 = T11();
  grB.exports = function(A, Q) {
    Q = Q || {};
    var B = Sr6.decode(A, Q);
    if (!B) return null;
    var G = B.payload;
    if (typeof G === "string") try {
      var Z = JSON.parse(G);
      if (Z !== null && typeof Z === "object") G = Z
    } catch (I) {}
    if (Q.complete === !0) return {
      header: B.header,
      payload: G,
      signature: B.signature
    };
    return G
  }
})
// @from(Start 8160277, End 8160622)
MNA = z((UKG, urB) => {
  var P11 = function(A, Q) {
    if (Error.call(this, A), Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    if (this.name = "JsonWebTokenError", this.message = A, Q) this.inner = Q
  };
  P11.prototype = Object.create(Error.prototype);
  P11.prototype.constructor = P11;
  urB.exports = P11
})
// @from(Start 8160628, End 8160879)
rs1 = z(($KG, drB) => {
  var mrB = MNA(),
    j11 = function(A, Q) {
      mrB.call(this, A), this.name = "NotBeforeError", this.date = Q
    };
  j11.prototype = Object.create(mrB.prototype);
  j11.prototype.constructor = j11;
  drB.exports = j11
})
// @from(Start 8160885, End 8161144)
os1 = z((wKG, prB) => {
  var crB = MNA(),
    S11 = function(A, Q) {
      crB.call(this, A), this.name = "TokenExpiredError", this.expiredAt = Q
    };
  S11.prototype = Object.create(crB.prototype);
  S11.prototype.constructor = S11;
  prB.exports = S11
})
// @from(Start 8161150, End 8161475)
ts1 = z((qKG, lrB) => {
  var _r6 = SK1();
  lrB.exports = function(A, Q) {
    var B = Q || Math.floor(Date.now() / 1000);
    if (typeof A === "string") {
      var G = _r6(A);
      if (typeof G > "u") return;
      return Math.floor(B + G / 1000)
    } else if (typeof A === "number") return B + A;
    else return
  }
})
// @from(Start 8161481, End 8161584)
nrB = z((NKG, irB) => {
  var kr6 = KU();
  irB.exports = kr6.satisfies(process.version, ">=15.7.0")
})
// @from(Start 8161590, End 8161693)
srB = z((LKG, arB) => {
  var yr6 = KU();
  arB.exports = yr6.satisfies(process.version, ">=16.9.0")
})
// @from(Start 8161699, End 8163131)
es1 = z((MKG, rrB) => {
  var xr6 = nrB(),
    vr6 = srB(),
    br6 = {
      ec: ["ES256", "ES384", "ES512"],
      rsa: ["RS256", "PS256", "RS384", "PS384", "RS512", "PS512"],
      "rsa-pss": ["PS256", "PS384", "PS512"]
    },
    fr6 = {
      ES256: "prime256v1",
      ES384: "secp384r1",
      ES512: "secp521r1"
    };
  rrB.exports = function(A, Q) {
    if (!A || !Q) return;
    let B = Q.asymmetricKeyType;
    if (!B) return;
    let G = br6[B];
    if (!G) throw Error(`Unknown key type "${B}".`);
    if (!G.includes(A)) throw Error(`"alg" parameter for "${B}" key type must be one of: ${G.join(", ")}.`);
    if (xr6) switch (B) {
      case "ec":
        let Z = Q.asymmetricKeyDetails.namedCurve,
          I = fr6[A];
        if (Z !== I) throw Error(`"alg" parameter "${A}" requires curve "${I}".`);
        break;
      case "rsa-pss":
        if (vr6) {
          let Y = parseInt(A.slice(-3), 10),
            {
              hashAlgorithm: J,
              mgf1HashAlgorithm: W,
              saltLength: X
            } = Q.asymmetricKeyDetails;
          if (J !== `sha${Y}` || W !== J) throw Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${A}.`);
          if (X !== void 0 && X > Y >> 3) throw Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${A}.`)
        }
        break
    }
  }
})
// @from(Start 8163137, End 8163250)
Ar1 = z((OKG, orB) => {
  var hr6 = KU();
  orB.exports = hr6.satisfies(process.version, "^6.12.0 || >=8.0.0")
})
// @from(Start 8163256, End 8168910)
AoB = z((RKG, erB) => {
  var dZ = MNA(),
    gr6 = rs1(),
    trB = os1(),
    ur6 = ss1(),
    mr6 = ts1(),
    dr6 = es1(),
    cr6 = Ar1(),
    pr6 = T11(),
    {
      KeyObject: lr6,
      createSecretKey: ir6,
      createPublicKey: nr6
    } = UA("crypto"),
    Qr1 = ["RS256", "RS384", "RS512"],
    ar6 = ["ES256", "ES384", "ES512"],
    Br1 = ["RS256", "RS384", "RS512"],
    sr6 = ["HS256", "HS384", "HS512"];
  if (cr6) Qr1.splice(Qr1.length, 0, "PS256", "PS384", "PS512"), Br1.splice(Br1.length, 0, "PS256", "PS384", "PS512");
  erB.exports = function(A, Q, B, G) {
    if (typeof B === "function" && !G) G = B, B = {};
    if (!B) B = {};
    B = Object.assign({}, B);
    let Z;
    if (G) Z = G;
    else Z = function(V, F) {
      if (V) throw V;
      return F
    };
    if (B.clockTimestamp && typeof B.clockTimestamp !== "number") return Z(new dZ("clockTimestamp must be a number"));
    if (B.nonce !== void 0 && (typeof B.nonce !== "string" || B.nonce.trim() === "")) return Z(new dZ("nonce must be a non-empty string"));
    if (B.allowInvalidAsymmetricKeyTypes !== void 0 && typeof B.allowInvalidAsymmetricKeyTypes !== "boolean") return Z(new dZ("allowInvalidAsymmetricKeyTypes must be a boolean"));
    let I = B.clockTimestamp || Math.floor(Date.now() / 1000);
    if (!A) return Z(new dZ("jwt must be provided"));
    if (typeof A !== "string") return Z(new dZ("jwt must be a string"));
    let Y = A.split(".");
    if (Y.length !== 3) return Z(new dZ("jwt malformed"));
    let J;
    try {
      J = ur6(A, {
        complete: !0
      })
    } catch (V) {
      return Z(V)
    }
    if (!J) return Z(new dZ("invalid token"));
    let W = J.header,
      X;
    if (typeof Q === "function") {
      if (!G) return Z(new dZ("verify must be called asynchronous if secret or public key is provided as a callback"));
      X = Q
    } else X = function(V, F) {
      return F(null, Q)
    };
    return X(W, function(V, F) {
      if (V) return Z(new dZ("error in secret or public key callback: " + V.message));
      let K = Y[2].trim() !== "";
      if (!K && F) return Z(new dZ("jwt signature is required"));
      if (K && !F) return Z(new dZ("secret or public key must be provided"));
      if (!K && !B.algorithms) return Z(new dZ('please specify "none" in "algorithms" to verify unsigned tokens'));
      if (F != null && !(F instanceof lr6)) try {
        F = nr6(F)
      } catch (C) {
        try {
          F = ir6(typeof F === "string" ? Buffer.from(F) : F)
        } catch (E) {
          return Z(new dZ("secretOrPublicKey is not valid key material"))
        }
      }
      if (!B.algorithms)
        if (F.type === "secret") B.algorithms = sr6;
        else if (["rsa", "rsa-pss"].includes(F.asymmetricKeyType)) B.algorithms = Br1;
      else if (F.asymmetricKeyType === "ec") B.algorithms = ar6;
      else B.algorithms = Qr1;
      if (B.algorithms.indexOf(J.header.alg) === -1) return Z(new dZ("invalid algorithm"));
      if (W.alg.startsWith("HS") && F.type !== "secret") return Z(new dZ(`secretOrPublicKey must be a symmetric key when using ${W.alg}`));
      else if (/^(?:RS|PS|ES)/.test(W.alg) && F.type !== "public") return Z(new dZ(`secretOrPublicKey must be an asymmetric key when using ${W.alg}`));
      if (!B.allowInvalidAsymmetricKeyTypes) try {
        dr6(W.alg, F)
      } catch (C) {
        return Z(C)
      }
      let D;
      try {
        D = pr6.verify(A, J.header.alg, F)
      } catch (C) {
        return Z(C)
      }
      if (!D) return Z(new dZ("invalid signature"));
      let H = J.payload;
      if (typeof H.nbf < "u" && !B.ignoreNotBefore) {
        if (typeof H.nbf !== "number") return Z(new dZ("invalid nbf value"));
        if (H.nbf > I + (B.clockTolerance || 0)) return Z(new gr6("jwt not active", new Date(H.nbf * 1000)))
      }
      if (typeof H.exp < "u" && !B.ignoreExpiration) {
        if (typeof H.exp !== "number") return Z(new dZ("invalid exp value"));
        if (I >= H.exp + (B.clockTolerance || 0)) return Z(new trB("jwt expired", new Date(H.exp * 1000)))
      }
      if (B.audience) {
        let C = Array.isArray(B.audience) ? B.audience : [B.audience];
        if (!(Array.isArray(H.aud) ? H.aud : [H.aud]).some(function(q) {
            return C.some(function(w) {
              return w instanceof RegExp ? w.test(q) : w === q
            })
          })) return Z(new dZ("jwt audience invalid. expected: " + C.join(" or ")))
      }
      if (B.issuer) {
        if (typeof B.issuer === "string" && H.iss !== B.issuer || Array.isArray(B.issuer) && B.issuer.indexOf(H.iss) === -1) return Z(new dZ("jwt issuer invalid. expected: " + B.issuer))
      }
      if (B.subject) {
        if (H.sub !== B.subject) return Z(new dZ("jwt subject invalid. expected: " + B.subject))
      }
      if (B.jwtid) {
        if (H.jti !== B.jwtid) return Z(new dZ("jwt jwtid invalid. expected: " + B.jwtid))
      }
      if (B.nonce) {
        if (H.nonce !== B.nonce) return Z(new dZ("jwt nonce invalid. expected: " + B.nonce))
      }
      if (B.maxAge) {
        if (typeof H.iat !== "number") return Z(new dZ("iat required when maxAge is specified"));
        let C = mr6(B.maxAge, H.iat);
        if (typeof C > "u") return Z(new dZ('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        if (I >= C + (B.clockTolerance || 0)) return Z(new trB("maxAge exceeded", new Date(C * 1000)))
      }
      if (B.complete === !0) {
        let C = J.signature;
        return Z(null, {
          header: W,
          payload: H,
          signature: C
        })
      }
      return Z(null, H)
    })
  }
})
// @from(Start 8168916, End 8173184)
YoB = z((TKG, IoB) => {
  var QoB = 1 / 0,
    GoB = 9007199254740991,
    rr6 = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
    BoB = NaN,
    or6 = "[object Arguments]",
    tr6 = "[object Function]",
    er6 = "[object GeneratorFunction]",
    Ao6 = "[object String]",
    Qo6 = "[object Symbol]",
    Bo6 = /^\s+|\s+$/g,
    Go6 = /^[-+]0x[0-9a-f]+$/i,
    Zo6 = /^0b[01]+$/i,
    Io6 = /^0o[0-7]+$/i,
    Yo6 = /^(?:0|[1-9]\d*)$/,
    Jo6 = parseInt;

  function Wo6(A, Q) {
    var B = -1,
      G = A ? A.length : 0,
      Z = Array(G);
    while (++B < G) Z[B] = Q(A[B], B, A);
    return Z
  }

  function Xo6(A, Q, B, G) {
    var Z = A.length,
      I = B + (G ? 1 : -1);
    while (G ? I-- : ++I < Z)
      if (Q(A[I], I, A)) return I;
    return -1
  }

  function Vo6(A, Q, B) {
    if (Q !== Q) return Xo6(A, Fo6, B);
    var G = B - 1,
      Z = A.length;
    while (++G < Z)
      if (A[G] === Q) return G;
    return -1
  }

  function Fo6(A) {
    return A !== A
  }

  function Ko6(A, Q) {
    var B = -1,
      G = Array(A);
    while (++B < A) G[B] = Q(B);
    return G
  }

  function Do6(A, Q) {
    return Wo6(Q, function(B) {
      return A[B]
    })
  }

  function Ho6(A, Q) {
    return function(B) {
      return A(Q(B))
    }
  }
  var _11 = Object.prototype,
    Zr1 = _11.hasOwnProperty,
    k11 = _11.toString,
    Co6 = _11.propertyIsEnumerable,
    Eo6 = Ho6(Object.keys, Object),
    zo6 = Math.max;

  function Uo6(A, Q) {
    var B = ZoB(A) || Lo6(A) ? Ko6(A.length, String) : [],
      G = B.length,
      Z = !!G;
    for (var I in A)
      if ((Q || Zr1.call(A, I)) && !(Z && (I == "length" || wo6(I, G)))) B.push(I);
    return B
  }

  function $o6(A) {
    if (!qo6(A)) return Eo6(A);
    var Q = [];
    for (var B in Object(A))
      if (Zr1.call(A, B) && B != "constructor") Q.push(B);
    return Q
  }

  function wo6(A, Q) {
    return Q = Q == null ? GoB : Q, !!Q && (typeof A == "number" || Yo6.test(A)) && (A > -1 && A % 1 == 0 && A < Q)
  }

  function qo6(A) {
    var Q = A && A.constructor,
      B = typeof Q == "function" && Q.prototype || _11;
    return A === B
  }

  function No6(A, Q, B, G) {
    A = Ir1(A) ? A : yo6(A), B = B && !G ? So6(B) : 0;
    var Z = A.length;
    if (B < 0) B = zo6(Z + B, 0);
    return To6(A) ? B <= Z && A.indexOf(Q, B) > -1 : !!Z && Vo6(A, Q, B) > -1
  }

  function Lo6(A) {
    return Mo6(A) && Zr1.call(A, "callee") && (!Co6.call(A, "callee") || k11.call(A) == or6)
  }
  var ZoB = Array.isArray;

  function Ir1(A) {
    return A != null && Ro6(A.length) && !Oo6(A)
  }

  function Mo6(A) {
    return Yr1(A) && Ir1(A)
  }

  function Oo6(A) {
    var Q = Gr1(A) ? k11.call(A) : "";
    return Q == tr6 || Q == er6
  }

  function Ro6(A) {
    return typeof A == "number" && A > -1 && A % 1 == 0 && A <= GoB
  }

  function Gr1(A) {
    var Q = typeof A;
    return !!A && (Q == "object" || Q == "function")
  }

  function Yr1(A) {
    return !!A && typeof A == "object"
  }

  function To6(A) {
    return typeof A == "string" || !ZoB(A) && Yr1(A) && k11.call(A) == Ao6
  }

  function Po6(A) {
    return typeof A == "symbol" || Yr1(A) && k11.call(A) == Qo6
  }

  function jo6(A) {
    if (!A) return A === 0 ? A : 0;
    if (A = _o6(A), A === QoB || A === -QoB) {
      var Q = A < 0 ? -1 : 1;
      return Q * rr6
    }
    return A === A ? A : 0
  }

  function So6(A) {
    var Q = jo6(A),
      B = Q % 1;
    return Q === Q ? B ? Q - B : Q : 0
  }

  function _o6(A) {
    if (typeof A == "number") return A;
    if (Po6(A)) return BoB;
    if (Gr1(A)) {
      var Q = typeof A.valueOf == "function" ? A.valueOf() : A;
      A = Gr1(Q) ? Q + "" : Q
    }
    if (typeof A != "string") return A === 0 ? A : +A;
    A = A.replace(Bo6, "");
    var B = Zo6.test(A);
    return B || Io6.test(A) ? Jo6(A.slice(2), B ? 2 : 8) : Go6.test(A) ? BoB : +A
  }

  function ko6(A) {
    return Ir1(A) ? Uo6(A) : $o6(A)
  }

  function yo6(A) {
    return A ? Do6(A, ko6(A)) : []
  }
  IoB.exports = No6
})
// @from(Start 8173190, End 8173473)
WoB = z((PKG, JoB) => {
  var xo6 = "[object Boolean]",
    vo6 = Object.prototype,
    bo6 = vo6.toString;

  function fo6(A) {
    return A === !0 || A === !1 || ho6(A) && bo6.call(A) == xo6
  }

  function ho6(A) {
    return !!A && typeof A == "object"
  }
  JoB.exports = fo6
})
// @from(Start 8173479, End 8175105)
DoB = z((jKG, KoB) => {
  var XoB = 1 / 0,
    go6 = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
    VoB = NaN,
    uo6 = "[object Symbol]",
    mo6 = /^\s+|\s+$/g,
    do6 = /^[-+]0x[0-9a-f]+$/i,
    co6 = /^0b[01]+$/i,
    po6 = /^0o[0-7]+$/i,
    lo6 = parseInt,
    io6 = Object.prototype,
    no6 = io6.toString;

  function ao6(A) {
    return typeof A == "number" && A == to6(A)
  }

  function FoB(A) {
    var Q = typeof A;
    return !!A && (Q == "object" || Q == "function")
  }

  function so6(A) {
    return !!A && typeof A == "object"
  }

  function ro6(A) {
    return typeof A == "symbol" || so6(A) && no6.call(A) == uo6
  }

  function oo6(A) {
    if (!A) return A === 0 ? A : 0;
    if (A = eo6(A), A === XoB || A === -XoB) {
      var Q = A < 0 ? -1 : 1;
      return Q * go6
    }
    return A === A ? A : 0
  }

  function to6(A) {
    var Q = oo6(A),
      B = Q % 1;
    return Q === Q ? B ? Q - B : Q : 0
  }

  function eo6(A) {
    if (typeof A == "number") return A;
    if (ro6(A)) return VoB;
    if (FoB(A)) {
      var Q = typeof A.valueOf == "function" ? A.valueOf() : A;
      A = FoB(Q) ? Q + "" : Q
    }
    if (typeof A != "string") return A === 0 ? A : +A;
    A = A.replace(mo6, "");
    var B = co6.test(A);
    return B || po6.test(A) ? lo6(A.slice(2), B ? 2 : 8) : do6.test(A) ? VoB : +A
  }
  KoB.exports = ao6
})
// @from(Start 8175111, End 8175393)
CoB = z((SKG, HoB) => {
  var At6 = "[object Number]",
    Qt6 = Object.prototype,
    Bt6 = Qt6.toString;

  function Gt6(A) {
    return !!A && typeof A == "object"
  }

  function Zt6(A) {
    return typeof A == "number" || Gt6(A) && Bt6.call(A) == At6
  }
  HoB.exports = Zt6
})
// @from(Start 8175399, End 8176253)
$oB = z((_KG, UoB) => {
  var It6 = "[object Object]";

  function Yt6(A) {
    var Q = !1;
    if (A != null && typeof A.toString != "function") try {
      Q = !!(A + "")
    } catch (B) {}
    return Q
  }

  function Jt6(A, Q) {
    return function(B) {
      return A(Q(B))
    }
  }
  var Wt6 = Function.prototype,
    EoB = Object.prototype,
    zoB = Wt6.toString,
    Xt6 = EoB.hasOwnProperty,
    Vt6 = zoB.call(Object),
    Ft6 = EoB.toString,
    Kt6 = Jt6(Object.getPrototypeOf, Object);

  function Dt6(A) {
    return !!A && typeof A == "object"
  }

  function Ht6(A) {
    if (!Dt6(A) || Ft6.call(A) != It6 || Yt6(A)) return !1;
    var Q = Kt6(A);
    if (Q === null) return !0;
    var B = Xt6.call(Q, "constructor") && Q.constructor;
    return typeof B == "function" && B instanceof B && zoB.call(B) == Vt6
  }
  UoB.exports = Ht6
})
// @from(Start 8176259, End 8176577)
qoB = z((kKG, woB) => {
  var Ct6 = "[object String]",
    Et6 = Object.prototype,
    zt6 = Et6.toString,
    Ut6 = Array.isArray;

  function $t6(A) {
    return !!A && typeof A == "object"
  }

  function wt6(A) {
    return typeof A == "string" || !Ut6(A) && $t6(A) && zt6.call(A) == Ct6
  }
  woB.exports = wt6
})
// @from(Start 8176583, End 8178459)
RoB = z((yKG, OoB) => {
  var qt6 = "Expected a function",
    NoB = 1 / 0,
    Nt6 = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
    LoB = NaN,
    Lt6 = "[object Symbol]",
    Mt6 = /^\s+|\s+$/g,
    Ot6 = /^[-+]0x[0-9a-f]+$/i,
    Rt6 = /^0b[01]+$/i,
    Tt6 = /^0o[0-7]+$/i,
    Pt6 = parseInt,
    jt6 = Object.prototype,
    St6 = jt6.toString;

  function _t6(A, Q) {
    var B;
    if (typeof Q != "function") throw TypeError(qt6);
    return A = bt6(A),
      function() {
        if (--A > 0) B = Q.apply(this, arguments);
        if (A <= 1) Q = void 0;
        return B
      }
  }

  function kt6(A) {
    return _t6(2, A)
  }

  function MoB(A) {
    var Q = typeof A;
    return !!A && (Q == "object" || Q == "function")
  }

  function yt6(A) {
    return !!A && typeof A == "object"
  }

  function xt6(A) {
    return typeof A == "symbol" || yt6(A) && St6.call(A) == Lt6
  }

  function vt6(A) {
    if (!A) return A === 0 ? A : 0;
    if (A = ft6(A), A === NoB || A === -NoB) {
      var Q = A < 0 ? -1 : 1;
      return Q * Nt6
    }
    return A === A ? A : 0
  }

  function bt6(A) {
    var Q = vt6(A),
      B = Q % 1;
    return Q === Q ? B ? Q - B : Q : 0
  }

  function ft6(A) {
    if (typeof A == "number") return A;
    if (xt6(A)) return LoB;
    if (MoB(A)) {
      var Q = typeof A.valueOf == "function" ? A.valueOf() : A;
      A = MoB(Q) ? Q + "" : Q
    }
    if (typeof A != "string") return A === 0 ? A : +A;
    A = A.replace(Mt6, "");
    var B = Rt6.test(A);
    return B || Tt6.test(A) ? Pt6(A.slice(2), B ? 2 : 8) : Ot6.test(A) ? LoB : +A
  }
  OoB.exports = kt6
})
// @from(Start 8178465, End 8185542)
voB = z((xKG, xoB) => {
  var ToB = ts1(),
    ht6 = Ar1(),
    gt6 = es1(),
    PoB = T11(),
    ut6 = YoB(),
    y11 = WoB(),
    joB = DoB(),
    Jr1 = CoB(),
    _oB = $oB(),
    wl = qoB(),
    mt6 = RoB(),
    {
      KeyObject: dt6,
      createSecretKey: ct6,
      createPrivateKey: pt6
    } = UA("crypto"),
    koB = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "HS256", "HS384", "HS512", "none"];
  if (ht6) koB.splice(3, 0, "PS256", "PS384", "PS512");
  var lt6 = {
      expiresIn: {
        isValid: function(A) {
          return joB(A) || wl(A) && A
        },
        message: '"expiresIn" should be a number of seconds or string representing a timespan'
      },
      notBefore: {
        isValid: function(A) {
          return joB(A) || wl(A) && A
        },
        message: '"notBefore" should be a number of seconds or string representing a timespan'
      },
      audience: {
        isValid: function(A) {
          return wl(A) || Array.isArray(A)
        },
        message: '"audience" must be a string or array'
      },
      algorithm: {
        isValid: ut6.bind(null, koB),
        message: '"algorithm" must be a valid string enum value'
      },
      header: {
        isValid: _oB,
        message: '"header" must be an object'
      },
      encoding: {
        isValid: wl,
        message: '"encoding" must be a string'
      },
      issuer: {
        isValid: wl,
        message: '"issuer" must be a string'
      },
      subject: {
        isValid: wl,
        message: '"subject" must be a string'
      },
      jwtid: {
        isValid: wl,
        message: '"jwtid" must be a string'
      },
      noTimestamp: {
        isValid: y11,
        message: '"noTimestamp" must be a boolean'
      },
      keyid: {
        isValid: wl,
        message: '"keyid" must be a string'
      },
      mutatePayload: {
        isValid: y11,
        message: '"mutatePayload" must be a boolean'
      },
      allowInsecureKeySizes: {
        isValid: y11,
        message: '"allowInsecureKeySizes" must be a boolean'
      },
      allowInvalidAsymmetricKeyTypes: {
        isValid: y11,
        message: '"allowInvalidAsymmetricKeyTypes" must be a boolean'
      }
    },
    it6 = {
      iat: {
        isValid: Jr1,
        message: '"iat" should be a number of seconds'
      },
      exp: {
        isValid: Jr1,
        message: '"exp" should be a number of seconds'
      },
      nbf: {
        isValid: Jr1,
        message: '"nbf" should be a number of seconds'
      }
    };

  function yoB(A, Q, B, G) {
    if (!_oB(B)) throw Error('Expected "' + G + '" to be a plain object.');
    Object.keys(B).forEach(function(Z) {
      let I = A[Z];
      if (!I) {
        if (!Q) throw Error('"' + Z + '" is not allowed in "' + G + '"');
        return
      }
      if (!I.isValid(B[Z])) throw Error(I.message)
    })
  }

  function nt6(A) {
    return yoB(lt6, !1, A, "options")
  }

  function at6(A) {
    return yoB(it6, !0, A, "payload")
  }
  var SoB = {
      audience: "aud",
      issuer: "iss",
      subject: "sub",
      jwtid: "jti"
    },
    st6 = ["expiresIn", "notBefore", "noTimestamp", "audience", "issuer", "subject", "jwtid"];
  xoB.exports = function(A, Q, B, G) {
    if (typeof B === "function") G = B, B = {};
    else B = B || {};
    let Z = typeof A === "object" && !Buffer.isBuffer(A),
      I = Object.assign({
        alg: B.algorithm || "HS256",
        typ: Z ? "JWT" : void 0,
        kid: B.keyid
      }, B.header);

    function Y(X) {
      if (G) return G(X);
      throw X
    }
    if (!Q && B.algorithm !== "none") return Y(Error("secretOrPrivateKey must have a value"));
    if (Q != null && !(Q instanceof dt6)) try {
      Q = pt6(Q)
    } catch (X) {
      try {
        Q = ct6(typeof Q === "string" ? Buffer.from(Q) : Q)
      } catch (V) {
        return Y(Error("secretOrPrivateKey is not valid key material"))
      }
    }
    if (I.alg.startsWith("HS") && Q.type !== "secret") return Y(Error(`secretOrPrivateKey must be a symmetric key when using ${I.alg}`));
    else if (/^(?:RS|PS|ES)/.test(I.alg)) {
      if (Q.type !== "private") return Y(Error(`secretOrPrivateKey must be an asymmetric key when using ${I.alg}`));
      if (!B.allowInsecureKeySizes && !I.alg.startsWith("ES") && Q.asymmetricKeyDetails !== void 0 && Q.asymmetricKeyDetails.modulusLength < 2048) return Y(Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${I.alg}`))
    }
    if (typeof A > "u") return Y(Error("payload is required"));
    else if (Z) {
      try {
        at6(A)
      } catch (X) {
        return Y(X)
      }
      if (!B.mutatePayload) A = Object.assign({}, A)
    } else {
      let X = st6.filter(function(V) {
        return typeof B[V] < "u"
      });
      if (X.length > 0) return Y(Error("invalid " + X.join(",") + " option for " + typeof A + " payload"))
    }
    if (typeof A.exp < "u" && typeof B.expiresIn < "u") return Y(Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
    if (typeof A.nbf < "u" && typeof B.notBefore < "u") return Y(Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
    try {
      nt6(B)
    } catch (X) {
      return Y(X)
    }
    if (!B.allowInvalidAsymmetricKeyTypes) try {
      gt6(I.alg, Q)
    } catch (X) {
      return Y(X)
    }
    let J = A.iat || Math.floor(Date.now() / 1000);
    if (B.noTimestamp) delete A.iat;
    else if (Z) A.iat = J;
    if (typeof B.notBefore < "u") {
      try {
        A.nbf = ToB(B.notBefore, J)
      } catch (X) {
        return Y(X)
      }
      if (typeof A.nbf > "u") return Y(Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'))
    }
    if (typeof B.expiresIn < "u" && typeof A === "object") {
      try {
        A.exp = ToB(B.expiresIn, J)
      } catch (X) {
        return Y(X)
      }
      if (typeof A.exp > "u") return Y(Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'))
    }
    Object.keys(SoB).forEach(function(X) {
      let V = SoB[X];
      if (typeof B[X] < "u") {
        if (typeof A[V] < "u") return Y(Error('Bad "options.' + X + '" option. The payload already has an "' + V + '" property.'));
        A[V] = B[X]
      }
    });
    let W = B.encoding || "utf8";
    if (typeof G === "function") G = G && mt6(G), PoB.createSign({
      header: I,
      privateKey: Q,
      payload: A,
      encoding: W
    }).once("error", G).once("done", function(X) {
      if (!B.allowInsecureKeySizes && /^(?:RS|PS)/.test(I.alg) && X.length < 256) return G(Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${I.alg}`));
      G(null, X)
    });
    else {
      let X = PoB.sign({
        header: I,
        payload: A,
        secret: Q,
        encoding: W
      });
      if (!B.allowInsecureKeySizes && /^(?:RS|PS)/.test(I.alg) && X.length < 256) throw Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${I.alg}`);
      return X
    }
  }
})
// @from(Start 8185548, End 8185737)
foB = z((vKG, boB) => {
  boB.exports = {
    decode: ss1(),
    verify: AoB(),
    sign: voB(),
    JsonWebTokenError: MNA(),
    NotBeforeError: rs1(),
    TokenExpiredError: os1()
  }
})
// @from(Start 8185739, End 8187591)
class cT {
  static fromAssertion(A) {
    let Q = new cT;
    return Q.jwt = A, Q
  }
  static fromCertificate(A, Q, B) {
    let G = new cT;
    if (G.privateKey = Q, G.thumbprint = A, G.useSha256 = !1, B) G.publicCertificate = this.parseCertificate(B);
    return G
  }
  static fromCertificateWithSha256Thumbprint(A, Q, B) {
    let G = new cT;
    if (G.privateKey = Q, G.thumbprint = A, G.useSha256 = !0, B) G.publicCertificate = this.parseCertificate(B);
    return G
  }
  getJwt(A, Q, B) {
    if (this.privateKey && this.thumbprint) {
      if (this.jwt && !this.isExpired() && Q === this.issuer && B === this.jwtAudience) return this.jwt;
      return this.createJwt(A, Q, B)
    }
    if (this.jwt) return this.jwt;
    throw b0(fG.invalidAssertion)
  }
  createJwt(A, Q, B) {
    this.issuer = Q, this.jwtAudience = B;
    let G = EI.nowSeconds();
    this.expirationTime = G + 600;
    let I = {
        alg: this.useSha256 ? _M.PSS_256 : _M.RSA_256
      },
      Y = this.useSha256 ? _M.X5T_256 : _M.X5T;
    if (Object.assign(I, {
        [Y]: PU.base64EncodeUrl(this.thumbprint, MD.HEX)
      }), this.publicCertificate) Object.assign(I, {
      [_M.X5C]: this.publicCertificate
    });
    let J = {
      [_M.AUDIENCE]: this.jwtAudience,
      [_M.EXPIRATION_TIME]: this.expirationTime,
      [_M.ISSUER]: this.issuer,
      [_M.SUBJECT]: this.issuer,
      [_M.NOT_BEFORE]: G,
      [_M.JWT_ID]: A.createNewGuid()
    };
    return this.jwt = hoB.default.sign(J, this.privateKey, {
      header: I
    }), this.jwt
  }
  isExpired() {
    return this.expirationTime < EI.nowSeconds()
  }
  static parseCertificate(A) {
    let Q = /-----BEGIN CERTIFICATE-----\r*\n(.+?)\r*\n-----END CERTIFICATE-----/gs,
      B = [],
      G;
    while ((G = Q.exec(A)) !== null) B.push(G[1].replace(/\r*\n/g, L0.EMPTY_STRING));
    return B
  }
}
// @from(Start 8187596, End 8187599)
hoB
// @from(Start 8187605, End 8187712)
x11 = L(() => {
  p7();
  UNA();
  UI();
  hoB = BA(foB(), 1); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8187718, End 8187742)
v11 = "@azure/msal-node"
// @from(Start 8187746, End 8187758)
pT = "3.8.1"
// @from(Start 8187764, End 8187826)
pZA = L(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Start 8187832, End 8187835)
ONA
// @from(Start 8187841, End 8190604)
Wr1 = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  ONA = class ONA extends sH {
    constructor(A) {
      super(A)
    }
    async acquireToken(A) {
      this.logger.info("in acquireToken call in username-password client");
      let Q = EI.nowSeconds(),
        B = await this.executeTokenRequest(this.authority, A),
        G = new _J(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
      return G.validateTokenResponse(B.body), G.handleServerTokenResponse(B.body, this.authority, Q, A)
    }
    async executeTokenRequest(A, Q) {
      let B = this.createTokenQueryParameters(Q),
        G = w8.appendQueryString(A.tokenEndpoint, B),
        Z = await this.createTokenRequestBody(Q),
        I = this.createTokenRequestHeaders({
          credential: Q.username,
          type: zE.UPN
        }),
        Y = {
          clientId: this.config.authOptions.clientId,
          authority: A.canonicalAuthority,
          scopes: Q.scopes,
          claims: Q.claims,
          authenticationScheme: Q.authenticationScheme,
          resourceRequestMethod: Q.resourceRequestMethod,
          resourceRequestUri: Q.resourceRequestUri,
          shrClaims: Q.shrClaims,
          sshKid: Q.sshKid
        };
      return this.executePostToTokenEndpoint(G, Z, I, Y, Q.correlationId)
    }
    async createTokenRequestBody(A) {
      let Q = new Map;
      if (PB.addClientId(Q, this.config.authOptions.clientId), PB.addUsername(Q, A.username), PB.addPassword(Q, A.password), PB.addScopes(Q, A.scopes), PB.addResponseType(Q, $ZA.IDTOKEN_TOKEN), PB.addGrantType(Q, OU.RESOURCE_OWNER_PASSWORD_GRANT), PB.addClientInfo(Q), PB.addLibraryInfo(Q, this.config.libraryInfo), PB.addApplicationTelemetry(Q, this.config.telemetry.application), PB.addThrottling(Q), this.serverTelemetryManager) PB.addServerTelemetry(Q, this.serverTelemetryManager);
      let B = A.correlationId || this.config.cryptoInterface.createNewGuid();
      if (PB.addCorrelationId(Q, B), this.config.clientCredentials.clientSecret) PB.addClientSecret(Q, this.config.clientCredentials.clientSecret);
      let G = this.config.clientCredentials.clientAssertion;
      if (G) PB.addClientAssertion(Q, await wE(G.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), PB.addClientAssertionType(Q, G.assertionType);
      if (!KZ.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) PB.addClaims(Q, A.claims, this.config.authOptions.clientCapabilities);
      if (this.config.systemOptions.preventCorsPreflight && A.username) PB.addCcsUpn(Q, A.username);
      return OD.mapToQueryString(Q)
    }
  }
})
// @from(Start 8190607, End 8191306)
function goB(A, Q, B, G) {
  let Z = VNA.getStandardAuthorizeRequestParameters({
    ...A.auth,
    authority: Q,
    redirectUri: B.redirectUri || ""
  }, B, G);
  if (PB.addLibraryInfo(Z, {
      sku: qE.MSAL_SKU,
      version: pT,
      cpu: process.arch || "",
      os: process.platform || ""
    }), A.auth.protocolMode !== aH.OIDC) PB.addApplicationTelemetry(Z, A.telemetry.application);
  if (PB.addResponseType(Z, $ZA.CODE), B.codeChallenge && B.codeChallengeMethod) PB.addCodeChallengeParams(Z, B.codeChallenge, B.codeChallengeMethod);
  return PB.addExtraQueryParameters(Z, B.extraQueryParameters || {}), VNA.getAuthorizeUrl(Q, Z, A.auth.encodeExtraQueryParams, B.extraQueryParameters)
}
// @from(Start 8191311, End 8191396)
uoB = L(() => {
  p7();
  UI();
  pZA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8191398, End 8200096)
class EAA {
  constructor(A) {
    this.config = KsB(A), this.cryptoProvider = new rf, this.logger = new RU(this.config.system.loggerOptions, v11, pT), this.storage = new CAA(this.logger, this.config.auth.clientId, this.cryptoProvider, zs1(this.config.auth)), this.tokenCache = new qNA(this.storage, this.logger, this.config.cache.cachePlugin)
  }
  async getAuthCodeUrl(A) {
    this.logger.info("getAuthCodeUrl called", A.correlationId);
    let Q = {
        ...A,
        ...await this.initializeBaseRequest(A),
        responseMode: A.responseMode || Wk.QUERY,
        authenticationScheme: A5.BEARER,
        state: A.state || "",
        nonce: A.nonce || ""
      },
      B = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions);
    return goB(this.config, B, Q, this.logger)
  }
  async acquireTokenByCode(A, Q) {
    if (this.logger.info("acquireTokenByCode called"), A.state && Q) this.logger.info("acquireTokenByCode - validating state"), this.validateState(A.state, Q.state || ""), Q = {
      ...Q,
      state: ""
    };
    let B = {
        ...A,
        ...await this.initializeBaseRequest(A),
        authenticationScheme: A5.BEARER
      },
      G = this.initializeServerTelemetryManager(af.acquireTokenByCode, B.correlationId);
    try {
      let Z = await this.createAuthority(B.authority, B.correlationId, void 0, A.azureCloudOptions),
        I = await this.buildOauthClientConfiguration(Z, B.correlationId, B.redirectUri, G),
        Y = new G11(I);
      return this.logger.verbose("Auth code client created", B.correlationId), await Y.acquireToken(B, Q)
    } catch (Z) {
      if (Z instanceof t4) Z.setCorrelationId(B.correlationId);
      throw G.cacheFailedRequest(Z), Z
    }
  }
  async acquireTokenByRefreshToken(A) {
    this.logger.info("acquireTokenByRefreshToken called", A.correlationId);
    let Q = {
        ...A,
        ...await this.initializeBaseRequest(A),
        authenticationScheme: A5.BEARER
      },
      B = this.initializeServerTelemetryManager(af.acquireTokenByRefreshToken, Q.correlationId);
    try {
      let G = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions),
        Z = await this.buildOauthClientConfiguration(G, Q.correlationId, Q.redirectUri || "", B),
        I = new gZA(Z);
      return this.logger.verbose("Refresh token client created", Q.correlationId), await I.acquireToken(Q)
    } catch (G) {
      if (G instanceof t4) G.setCorrelationId(Q.correlationId);
      throw B.cacheFailedRequest(G), G
    }
  }
  async acquireTokenSilent(A) {
    let Q = {
        ...A,
        ...await this.initializeBaseRequest(A),
        forceRefresh: A.forceRefresh || !1
      },
      B = this.initializeServerTelemetryManager(af.acquireTokenSilent, Q.correlationId, Q.forceRefresh);
    try {
      let G = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions),
        Z = await this.buildOauthClientConfiguration(G, Q.correlationId, Q.redirectUri || "", B),
        I = new Z11(Z);
      this.logger.verbose("Silent flow client created", Q.correlationId);
      try {
        return await this.tokenCache.overwriteCache(), await this.acquireCachedTokenSilent(Q, I, Z)
      } catch (Y) {
        if (Y instanceof Jl && Y.errorCode === fG.tokenRefreshRequired) return new gZA(Z).acquireTokenByRefreshToken(Q);
        throw Y
      }
    } catch (G) {
      if (G instanceof t4) G.setCorrelationId(Q.correlationId);
      throw B.cacheFailedRequest(G), G
    }
  }
  async acquireCachedTokenSilent(A, Q, B) {
    let [G, Z] = await Q.acquireCachedToken({
      ...A,
      scopes: A.scopes?.length ? A.scopes : [...nH]
    });
    if (Z === FZ.PROACTIVELY_REFRESHED) {
      this.logger.info("ClientApplication:acquireCachedTokenSilent - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
      let I = new gZA(B);
      try {
        await I.acquireTokenByRefreshToken(A)
      } catch {}
    }
    return G
  }
  async acquireTokenByUsernamePassword(A) {
    this.logger.info("acquireTokenByUsernamePassword called", A.correlationId);
    let Q = {
        ...A,
        ...await this.initializeBaseRequest(A)
      },
      B = this.initializeServerTelemetryManager(af.acquireTokenByUsernamePassword, Q.correlationId);
    try {
      let G = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions),
        Z = await this.buildOauthClientConfiguration(G, Q.correlationId, "", B),
        I = new ONA(Z);
      return this.logger.verbose("Username password client created", Q.correlationId), await I.acquireToken(Q)
    } catch (G) {
      if (G instanceof t4) G.setCorrelationId(Q.correlationId);
      throw B.cacheFailedRequest(G), G
    }
  }
  getTokenCache() {
    return this.logger.info("getTokenCache called"), this.tokenCache
  }
  validateState(A, Q) {
    if (!A) throw WY.createStateNotFoundError();
    if (A !== Q) throw b0(fG.stateMismatch)
  }
  getLogger() {
    return this.logger
  }
  setLogger(A) {
    this.logger = A
  }
  async buildOauthClientConfiguration(A, Q, B, G) {
    return this.logger.verbose("buildOauthClientConfiguration called", Q), this.logger.info(`Building oauth client configuration with the following authority: ${A.tokenEndpoint}.`, Q), G?.updateRegionDiscoveryMetadata(A.regionDiscoveryMetadata), {
      authOptions: {
        clientId: this.config.auth.clientId,
        authority: A,
        clientCapabilities: this.config.auth.clientCapabilities,
        redirectUri: B
      },
      loggerOptions: {
        logLevel: this.config.system.loggerOptions.logLevel,
        loggerCallback: this.config.system.loggerOptions.loggerCallback,
        piiLoggingEnabled: this.config.system.loggerOptions.piiLoggingEnabled,
        correlationId: Q
      },
      cacheOptions: {
        claimsBasedCachingEnabled: this.config.cache.claimsBasedCachingEnabled
      },
      cryptoInterface: this.cryptoProvider,
      networkInterface: this.config.system.networkClient,
      storageInterface: this.storage,
      serverTelemetryManager: G,
      clientCredentials: {
        clientSecret: this.clientSecret,
        clientAssertion: await this.getClientAssertion(A)
      },
      libraryInfo: {
        sku: qE.MSAL_SKU,
        version: pT,
        cpu: process.arch || L0.EMPTY_STRING,
        os: process.platform || L0.EMPTY_STRING
      },
      telemetry: this.config.telemetry,
      persistencePlugin: this.config.cache.cachePlugin,
      serializableCache: this.tokenCache
    }
  }
  async getClientAssertion(A) {
    if (this.developerProvidedClientAssertion) this.clientAssertion = cT.fromAssertion(await wE(this.developerProvidedClientAssertion, this.config.auth.clientId, A.tokenEndpoint));
    return this.clientAssertion && {
      assertion: this.clientAssertion.getJwt(this.cryptoProvider, this.config.auth.clientId, A.tokenEndpoint),
      assertionType: qE.JWT_BEARER_ASSERTION_TYPE
    }
  }
  async initializeBaseRequest(A) {
    if (this.logger.verbose("initializeRequestScopes called", A.correlationId), A.authenticationScheme && A.authenticationScheme === A5.POP) this.logger.verbose("Authentication Scheme 'pop' is not supported yet, setting Authentication Scheme to 'Bearer' for request", A.correlationId);
    if (A.authenticationScheme = A5.BEARER, this.config.cache.claimsBasedCachingEnabled && A.claims && !KZ.isEmptyObj(A.claims)) A.requestedClaimsHash = await this.cryptoProvider.hashString(A.claims);
    return {
      ...A,
      scopes: [...A && A.scopes || [], ...nH],
      correlationId: A && A.correlationId || this.cryptoProvider.createNewGuid(),
      authority: A.authority || this.config.auth.authority
    }
  }
  initializeServerTelemetryManager(A, Q, B) {
    let G = {
      clientId: this.config.auth.clientId,
      correlationId: Q,
      apiId: A,
      forceRefresh: B || !1
    };
    return new zl(G, this.storage)
  }
  async createAuthority(A, Q, B, G) {
    this.logger.verbose("createAuthority called", Q);
    let Z = kV.generateAuthority(A, G || this.config.auth.azureCloudOptions),
      I = {
        protocolMode: this.config.auth.protocolMode,
        knownAuthorities: this.config.auth.knownAuthorities,
        cloudDiscoveryMetadata: this.config.auth.cloudDiscoveryMetadata,
        authorityMetadata: this.config.auth.authorityMetadata,
        azureRegionConfiguration: B,
        skipAuthorityMetadataCache: this.config.auth.skipAuthorityMetadataCache
      };
    return lA1.createDiscoveredInstance(Z, this.config.system.networkClient, this.storage, I, this.logger, Q)
  }
  clearCache() {
    this.storage.clear()
  }
}
// @from(Start 8200101, End 8200258)
b11 = L(() => {
  p7();
  ks1();
  $NA();
  N11();
  UI();
  ms1();
  x11();
  pZA();
  HNA();
  Wr1();
  uoB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8200284, End 8201732)
class Xr1 {
  async listenForAuthCode(A, Q) {
    if (this.server) throw WY.createLoopbackServerAlreadyExistsError();
    return new Promise((B, G) => {
      this.server = rt6.createServer((Z, I) => {
        let Y = Z.url;
        if (!Y) {
          I.end(Q || "Error occurred loading redirectUrl"), G(WY.createUnableToLoadRedirectUrlError());
          return
        } else if (Y === L0.FORWARD_SLASH) {
          I.end(A || "Auth code was successfully acquired. You can close this window now.");
          return
        }
        let J = this.getRedirectUri(),
          W = new URL(Y, J),
          X = OD.getDeserializedResponse(W.search) || {};
        if (X.code) I.writeHead(o4.REDIRECT, {
          location: J
        }), I.end();
        if (X.error) I.end(Q || `Error occurred: ${X.error}`);
        B(X)
      }), this.server.listen(0, "127.0.0.1")
    })
  }
  getRedirectUri() {
    if (!this.server || !this.server.listening) throw WY.createNoLoopbackServerExistsError();
    let A = this.server.address();
    if (!A || typeof A === "string" || !A.port) throw this.closeServer(), WY.createInvalidLoopbackAddressTypeError();
    let Q = A && A.port;
    return `${qE.HTTP_PROTOCOL}${qE.LOCALHOST}:${Q}`
  }
  closeServer() {
    if (this.server) {
      if (this.server.close(), typeof this.server.closeAllConnections === "function") this.server.closeAllConnections();
      this.server.unref(), this.server = void 0
    }
  }
}
// @from(Start 8201737, End 8201822)
moB = L(() => {
  p7();
  HNA();
  UI(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8201828, End 8201831)
RNA
// @from(Start 8201837, End 8207339)
Vr1 = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  RNA = class RNA extends sH {
    constructor(A) {
      super(A)
    }
    async acquireToken(A) {
      let Q = await this.getDeviceCode(A);
      A.deviceCodeCallback(Q);
      let B = EI.nowSeconds(),
        G = await this.acquireTokenWithDeviceCode(A, Q),
        Z = new _J(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
      return Z.validateTokenResponse(G), Z.handleServerTokenResponse(G, this.authority, B, A)
    }
    async getDeviceCode(A) {
      let Q = this.createExtraQueryParameters(A),
        B = w8.appendQueryString(this.authority.deviceCodeEndpoint, Q),
        G = this.createQueryString(A),
        Z = this.createTokenRequestHeaders(),
        I = {
          clientId: this.config.authOptions.clientId,
          authority: A.authority,
          scopes: A.scopes,
          claims: A.claims,
          authenticationScheme: A.authenticationScheme,
          resourceRequestMethod: A.resourceRequestMethod,
          resourceRequestUri: A.resourceRequestUri,
          shrClaims: A.shrClaims,
          sshKid: A.sshKid
        };
      return this.executePostRequestToDeviceCodeEndpoint(B, G, Z, I, A.correlationId)
    }
    createExtraQueryParameters(A) {
      let Q = new Map;
      if (A.extraQueryParameters) PB.addExtraQueryParameters(Q, A.extraQueryParameters);
      return OD.mapToQueryString(Q)
    }
    async executePostRequestToDeviceCodeEndpoint(A, Q, B, G, Z) {
      let {
        body: {
          user_code: I,
          device_code: Y,
          verification_uri: J,
          expires_in: W,
          interval: X,
          message: V
        }
      } = await this.sendPostRequest(G, A, {
        body: Q,
        headers: B
      }, Z);
      return {
        userCode: I,
        deviceCode: Y,
        verificationUri: J,
        expiresIn: W,
        interval: X,
        message: V
      }
    }
    createQueryString(A) {
      let Q = new Map;
      if (PB.addScopes(Q, A.scopes), PB.addClientId(Q, this.config.authOptions.clientId), A.extraQueryParameters) PB.addExtraQueryParameters(Q, A.extraQueryParameters);
      if (A.claims || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) PB.addClaims(Q, A.claims, this.config.authOptions.clientCapabilities);
      return OD.mapToQueryString(Q)
    }
    continuePolling(A, Q, B) {
      if (B) throw this.logger.error("Token request cancelled by setting DeviceCodeRequest.cancel = true"), b0(fG.deviceCodePollingCancelled);
      else if (Q && Q < A && EI.nowSeconds() > Q) throw this.logger.error(`User defined timeout for device code polling reached. The timeout was set for ${Q}`), b0(fG.userTimeoutReached);
      else if (EI.nowSeconds() > A) {
        if (Q) this.logger.verbose(`User specified timeout ignored as the device code has expired before the timeout elapsed. The user specified timeout was set for ${Q}`);
        throw this.logger.error(`Device code expired. Expiration time of device code was ${A}`), b0(fG.deviceCodeExpired)
      }
      return !0
    }
    async acquireTokenWithDeviceCode(A, Q) {
      let B = this.createTokenQueryParameters(A),
        G = w8.appendQueryString(this.authority.tokenEndpoint, B),
        Z = this.createTokenRequestBody(A, Q),
        I = this.createTokenRequestHeaders(),
        Y = A.timeout ? EI.nowSeconds() + A.timeout : void 0,
        J = EI.nowSeconds() + Q.expiresIn,
        W = Q.interval * 1000;
      while (this.continuePolling(J, Y, A.cancel)) {
        let X = {
            clientId: this.config.authOptions.clientId,
            authority: A.authority,
            scopes: A.scopes,
            claims: A.claims,
            authenticationScheme: A.authenticationScheme,
            resourceRequestMethod: A.resourceRequestMethod,
            resourceRequestUri: A.resourceRequestUri,
            shrClaims: A.shrClaims,
            sshKid: A.sshKid
          },
          V = await this.executePostToTokenEndpoint(G, Z, I, X, A.correlationId);
        if (V.body && V.body.error)
          if (V.body.error === L0.AUTHORIZATION_PENDING) this.logger.info("Authorization pending. Continue polling."), await EI.delay(W);
          else throw this.logger.info("Unexpected error in polling from the server"), Ba1(NZA.postRequestFailed, V.body.error);
        else return this.logger.verbose("Authorization completed successfully. Polling stopped."), V.body
      }
      throw this.logger.error("Polling stopped for unknown reasons."), b0(fG.deviceCodeUnknownError)
    }
    createTokenRequestBody(A, Q) {
      let B = new Map;
      PB.addScopes(B, A.scopes), PB.addClientId(B, this.config.authOptions.clientId), PB.addGrantType(B, OU.DEVICE_CODE_GRANT), PB.addDeviceCode(B, Q.deviceCode);
      let G = A.correlationId || this.config.cryptoInterface.createNewGuid();
      if (PB.addCorrelationId(B, G), PB.addClientInfo(B), PB.addLibraryInfo(B, this.config.libraryInfo), PB.addApplicationTelemetry(B, this.config.telemetry.application), PB.addThrottling(B), this.serverTelemetryManager) PB.addServerTelemetry(B, this.serverTelemetryManager);
      if (!KZ.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) PB.addClaims(B, A.claims, this.config.authOptions.clientCapabilities);
      return OD.mapToQueryString(B)
    }
  }
})
// @from(Start 8207345, End 8207348)
TNA
// @from(Start 8207354, End 8213332)
doB = L(() => {
  UI();
  p7();
  b11();
  HNA();
  moB();
  Vr1();
  pZA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  TNA = class TNA extends EAA {
    constructor(A) {
      super(A);
      if (this.config.broker.nativeBrokerPlugin)
        if (this.config.broker.nativeBrokerPlugin.isBrokerAvailable) this.nativeBrokerPlugin = this.config.broker.nativeBrokerPlugin, this.nativeBrokerPlugin.setLogger(this.config.system.loggerOptions);
        else this.logger.warning("NativeBroker implementation was provided but the broker is unavailable.");
      this.skus = zl.makeExtraSkuString({
        libraryName: qE.MSAL_SKU,
        libraryVersion: pT
      })
    }
    async acquireTokenByDeviceCode(A) {
      this.logger.info("acquireTokenByDeviceCode called", A.correlationId);
      let Q = Object.assign(A, await this.initializeBaseRequest(A)),
        B = this.initializeServerTelemetryManager(af.acquireTokenByDeviceCode, Q.correlationId);
      try {
        let G = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions),
          Z = await this.buildOauthClientConfiguration(G, Q.correlationId, "", B),
          I = new RNA(Z);
        return this.logger.verbose("Device code client created", Q.correlationId), await I.acquireToken(Q)
      } catch (G) {
        if (G instanceof t4) G.setCorrelationId(Q.correlationId);
        throw B.cacheFailedRequest(G), G
      }
    }
    async acquireTokenInteractive(A) {
      let Q = A.correlationId || this.cryptoProvider.createNewGuid();
      this.logger.trace("acquireTokenInteractive called", Q);
      let {
        openBrowser: B,
        successTemplate: G,
        errorTemplate: Z,
        windowHandle: I,
        loopbackClient: Y,
        ...J
      } = A;
      if (this.nativeBrokerPlugin) {
        let D = {
          ...J,
          clientId: this.config.auth.clientId,
          scopes: A.scopes || nH,
          redirectUri: A.redirectUri || "",
          authority: A.authority || this.config.auth.authority,
          correlationId: Q,
          extraParameters: {
            ...J.extraQueryParameters,
            ...J.tokenQueryParameters,
            [GAA.X_CLIENT_EXTRA_SKU]: this.skus
          },
          accountId: J.account?.nativeAccountId
        };
        return this.nativeBrokerPlugin.acquireTokenInteractive(D, I)
      }
      if (A.redirectUri) {
        if (!this.config.broker.nativeBrokerPlugin) throw WY.createRedirectUriNotSupportedError();
        A.redirectUri = ""
      }
      let {
        verifier: W,
        challenge: X
      } = await this.cryptoProvider.generatePkceCodes(), V = Y || new Xr1, F = {}, K = null;
      try {
        let D = V.listenForAuthCode(G, Z).then((w) => {
            F = w
          }).catch((w) => {
            K = w
          }),
          H = await this.waitForRedirectUri(V),
          C = {
            ...J,
            correlationId: Q,
            scopes: A.scopes || nH,
            redirectUri: H,
            responseMode: Wk.QUERY,
            codeChallenge: X,
            codeChallengeMethod: zA1.S256
          },
          E = await this.getAuthCodeUrl(C);
        if (await B(E), await D, K) throw K;
        if (F.error) throw new $E(F.error, F.error_description, F.suberror);
        else if (!F.code) throw WY.createNoAuthCodeInResponseError();
        let U = F.client_info,
          q = {
            code: F.code,
            codeVerifier: W,
            clientInfo: U || L0.EMPTY_STRING,
            ...C
          };
        return await this.acquireTokenByCode(q)
      } finally {
        V.closeServer()
      }
    }
    async acquireTokenSilent(A) {
      let Q = A.correlationId || this.cryptoProvider.createNewGuid();
      if (this.logger.trace("acquireTokenSilent called", Q), this.nativeBrokerPlugin) {
        let B = {
          ...A,
          clientId: this.config.auth.clientId,
          scopes: A.scopes || nH,
          redirectUri: A.redirectUri || "",
          authority: A.authority || this.config.auth.authority,
          correlationId: Q,
          extraParameters: {
            ...A.tokenQueryParameters,
            [GAA.X_CLIENT_EXTRA_SKU]: this.skus
          },
          accountId: A.account.nativeAccountId,
          forceRefresh: A.forceRefresh || !1
        };
        return this.nativeBrokerPlugin.acquireTokenSilent(B)
      }
      if (A.redirectUri) {
        if (!this.config.broker.nativeBrokerPlugin) throw WY.createRedirectUriNotSupportedError();
        A.redirectUri = ""
      }
      return super.acquireTokenSilent(A)
    }
    async signOut(A) {
      if (this.nativeBrokerPlugin && A.account.nativeAccountId) {
        let Q = {
          clientId: this.config.auth.clientId,
          accountId: A.account.nativeAccountId,
          correlationId: A.correlationId || this.cryptoProvider.createNewGuid()
        };
        await this.nativeBrokerPlugin.signOut(Q)
      }
      await this.getTokenCache().removeAccount(A.account, A.correlationId)
    }
    async getAllAccounts() {
      if (this.nativeBrokerPlugin) {
        let A = this.cryptoProvider.createNewGuid();
        return this.nativeBrokerPlugin.getAllAccounts(this.config.auth.clientId, A)
      }
      return this.getTokenCache().getAllAccounts()
    }
    async waitForRedirectUri(A) {
      return new Promise((Q, B) => {
        let G = 0,
          Z = setInterval(() => {
            if (W11.TIMEOUT_MS / W11.INTERVAL_MS < G) {
              clearInterval(Z), B(WY.createLoopbackServerTimeoutError());
              return
            }
            try {
              let I = A.getRedirectUri();
              clearInterval(Z), Q(I);
              return
            } catch (I) {
              if (I instanceof t4 && I.errorCode === lX.noLoopbackServerExists.code) {
                G++;
                return
              }
              clearInterval(Z), B(I);
              return
            }
          }, W11.INTERVAL_MS)
      })
    }
  }
})
// @from(Start 8213338, End 8213341)
zAA
// @from(Start 8213347, End 8218818)
f11 = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  zAA = class zAA extends sH {
    constructor(A, Q) {
      super(A);
      this.appTokenProvider = Q
    }
    async acquireToken(A) {
      if (A.skipCache || A.claims) return this.executeTokenRequest(A, this.authority);
      let [Q, B] = await this.getCachedAuthenticationResult(A, this.config, this.cryptoUtils, this.authority, this.cacheManager, this.serverTelemetryManager);
      if (Q) {
        if (B === FZ.PROACTIVELY_REFRESHED) {
          this.logger.info("ClientCredentialClient:getCachedAuthenticationResult - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
          let G = !0;
          await this.executeTokenRequest(A, this.authority, G)
        }
        return Q
      } else return this.executeTokenRequest(A, this.authority)
    }
    async getCachedAuthenticationResult(A, Q, B, G, Z, I) {
      let Y = Q,
        J = Q,
        W = FZ.NOT_APPLICABLE,
        X;
      if (Y.serializableCache && Y.persistencePlugin) X = new SM(Y.serializableCache, !1), await Y.persistencePlugin.beforeCacheAccess(X);
      let V = this.readAccessTokenFromCache(G, J.managedIdentityId?.id || Y.authOptions.clientId, new SJ(A.scopes || []), Z, A.correlationId);
      if (Y.serializableCache && Y.persistencePlugin && X) await Y.persistencePlugin.afterCacheAccess(X);
      if (!V) return I?.setCacheOutcome(FZ.NO_CACHED_ACCESS_TOKEN), [null, FZ.NO_CACHED_ACCESS_TOKEN];
      if (EI.isTokenExpired(V.expiresOn, Y.systemOptions?.tokenRenewalOffsetSeconds || qZA)) return I?.setCacheOutcome(FZ.CACHED_ACCESS_TOKEN_EXPIRED), [null, FZ.CACHED_ACCESS_TOKEN_EXPIRED];
      if (V.refreshOn && EI.isTokenExpired(V.refreshOn.toString(), 0)) W = FZ.PROACTIVELY_REFRESHED, I?.setCacheOutcome(FZ.PROACTIVELY_REFRESHED);
      return [await _J.generateAuthenticationResult(B, G, {
        account: null,
        idToken: null,
        accessToken: V,
        refreshToken: null,
        appMetadata: null
      }, !0, A), W]
    }
    readAccessTokenFromCache(A, Q, B, G, Z) {
      let I = {
          homeAccountId: L0.EMPTY_STRING,
          environment: A.canonicalAuthorityUrlComponents.HostNameAndPort,
          credentialType: c7.ACCESS_TOKEN,
          clientId: Q,
          realm: A.tenant,
          target: SJ.createSearchScopes(B.asArray())
        },
        Y = G.getAccessTokensByFilter(I, Z);
      if (Y.length < 1) return null;
      else if (Y.length > 1) throw b0(fG.multipleMatchingTokens);
      return Y[0]
    }
    async executeTokenRequest(A, Q, B) {
      let G, Z;
      if (this.appTokenProvider) {
        this.logger.info("Using appTokenProvider extensibility.");
        let J = {
          correlationId: A.correlationId,
          tenantId: this.config.authOptions.authority.tenant,
          scopes: A.scopes,
          claims: A.claims
        };
        Z = EI.nowSeconds();
        let W = await this.appTokenProvider(J);
        G = {
          access_token: W.accessToken,
          expires_in: W.expiresInSeconds,
          refresh_in: W.refreshInSeconds,
          token_type: A5.BEARER
        }
      } else {
        let J = this.createTokenQueryParameters(A),
          W = w8.appendQueryString(Q.tokenEndpoint, J),
          X = await this.createTokenRequestBody(A),
          V = this.createTokenRequestHeaders(),
          F = {
            clientId: this.config.authOptions.clientId,
            authority: A.authority,
            scopes: A.scopes,
            claims: A.claims,
            authenticationScheme: A.authenticationScheme,
            resourceRequestMethod: A.resourceRequestMethod,
            resourceRequestUri: A.resourceRequestUri,
            shrClaims: A.shrClaims,
            sshKid: A.sshKid
          };
        this.logger.info("Sending token request to endpoint: " + Q.tokenEndpoint), Z = EI.nowSeconds();
        let K = await this.executePostToTokenEndpoint(W, X, V, F, A.correlationId);
        G = K.body, G.status = K.status
      }
      let I = new _J(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
      return I.validateTokenResponse(G, B), await I.handleServerTokenResponse(G, this.authority, Z, A)
    }
    async createTokenRequestBody(A) {
      let Q = new Map;
      if (PB.addClientId(Q, this.config.authOptions.clientId), PB.addScopes(Q, A.scopes, !1), PB.addGrantType(Q, OU.CLIENT_CREDENTIALS_GRANT), PB.addLibraryInfo(Q, this.config.libraryInfo), PB.addApplicationTelemetry(Q, this.config.telemetry.application), PB.addThrottling(Q), this.serverTelemetryManager) PB.addServerTelemetry(Q, this.serverTelemetryManager);
      let B = A.correlationId || this.config.cryptoInterface.createNewGuid();
      if (PB.addCorrelationId(Q, B), this.config.clientCredentials.clientSecret) PB.addClientSecret(Q, this.config.clientCredentials.clientSecret);
      let G = A.clientAssertion || this.config.clientCredentials.clientAssertion;
      if (G) PB.addClientAssertion(Q, await wE(G.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), PB.addClientAssertionType(Q, G.assertionType);
      if (!KZ.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) PB.addClaims(Q, A.claims, this.config.authOptions.clientCapabilities);
      return OD.mapToQueryString(Q)
    }
  }
})
// @from(Start 8218824, End 8218827)
PNA
// @from(Start 8218833, End 8224483)
Fr1 = L(() => {
  p7();
  UNA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  PNA = class PNA extends sH {
    constructor(A) {
      super(A)
    }
    async acquireToken(A) {
      if (this.scopeSet = new SJ(A.scopes || []), this.userAssertionHash = await this.cryptoUtils.hashString(A.oboAssertion), A.skipCache || A.claims) return this.executeTokenRequest(A, this.authority, this.userAssertionHash);
      try {
        return await this.getCachedAuthenticationResult(A)
      } catch (Q) {
        return await this.executeTokenRequest(A, this.authority, this.userAssertionHash)
      }
    }
    async getCachedAuthenticationResult(A) {
      let Q = this.readAccessTokenFromCacheForOBO(this.config.authOptions.clientId, A);
      if (!Q) throw this.serverTelemetryManager?.setCacheOutcome(FZ.NO_CACHED_ACCESS_TOKEN), this.logger.info("SilentFlowClient:acquireCachedToken - No access token found in cache for the given properties."), b0(fG.tokenRefreshRequired);
      else if (EI.isTokenExpired(Q.expiresOn, this.config.systemOptions.tokenRenewalOffsetSeconds)) throw this.serverTelemetryManager?.setCacheOutcome(FZ.CACHED_ACCESS_TOKEN_EXPIRED), this.logger.info(`OnbehalfofFlow:getCachedAuthenticationResult - Cached access token is expired or will expire within ${this.config.systemOptions.tokenRenewalOffsetSeconds} seconds.`), b0(fG.tokenRefreshRequired);
      let B = this.readIdTokenFromCacheForOBO(Q.homeAccountId, A.correlationId),
        G, Z = null;
      if (B) {
        G = PA1.extractTokenClaims(B.secret, PU.base64Decode);
        let I = G.oid || G.sub,
          Y = {
            homeAccountId: B.homeAccountId,
            environment: B.environment,
            tenantId: B.realm,
            username: L0.EMPTY_STRING,
            localAccountId: I || L0.EMPTY_STRING
          };
        Z = this.cacheManager.getAccount(this.cacheManager.generateAccountKey(Y), A.correlationId)
      }
      if (this.config.serverTelemetryManager) this.config.serverTelemetryManager.incrementCacheHits();
      return _J.generateAuthenticationResult(this.cryptoUtils, this.authority, {
        account: Z,
        accessToken: Q,
        idToken: B,
        refreshToken: null,
        appMetadata: null
      }, !0, A, G)
    }
    readIdTokenFromCacheForOBO(A, Q) {
      let B = {
          homeAccountId: A,
          environment: this.authority.canonicalAuthorityUrlComponents.HostNameAndPort,
          credentialType: c7.ID_TOKEN,
          clientId: this.config.authOptions.clientId,
          realm: this.authority.tenant
        },
        G = this.cacheManager.getIdTokensByFilter(B, Q);
      if (Object.values(G).length < 1) return null;
      return Object.values(G)[0]
    }
    readAccessTokenFromCacheForOBO(A, Q) {
      let B = Q.authenticationScheme || A5.BEARER,
        Z = {
          credentialType: B && B.toLowerCase() !== A5.BEARER.toLowerCase() ? c7.ACCESS_TOKEN_WITH_AUTH_SCHEME : c7.ACCESS_TOKEN,
          clientId: A,
          target: SJ.createSearchScopes(this.scopeSet.asArray()),
          tokenType: B,
          keyId: Q.sshKid,
          requestedClaimsHash: Q.requestedClaimsHash,
          userAssertionHash: this.userAssertionHash
        },
        I = this.cacheManager.getAccessTokensByFilter(Z, Q.correlationId),
        Y = I.length;
      if (Y < 1) return null;
      else if (Y > 1) throw b0(fG.multipleMatchingTokens);
      return I[0]
    }
    async executeTokenRequest(A, Q, B) {
      let G = this.createTokenQueryParameters(A),
        Z = w8.appendQueryString(Q.tokenEndpoint, G),
        I = await this.createTokenRequestBody(A),
        Y = this.createTokenRequestHeaders(),
        J = {
          clientId: this.config.authOptions.clientId,
          authority: A.authority,
          scopes: A.scopes,
          claims: A.claims,
          authenticationScheme: A.authenticationScheme,
          resourceRequestMethod: A.resourceRequestMethod,
          resourceRequestUri: A.resourceRequestUri,
          shrClaims: A.shrClaims,
          sshKid: A.sshKid
        },
        W = EI.nowSeconds(),
        X = await this.executePostToTokenEndpoint(Z, I, Y, J, A.correlationId),
        V = new _J(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
      return V.validateTokenResponse(X.body), await V.handleServerTokenResponse(X.body, this.authority, W, A, void 0, B)
    }
    async createTokenRequestBody(A) {
      let Q = new Map;
      if (PB.addClientId(Q, this.config.authOptions.clientId), PB.addScopes(Q, A.scopes), PB.addGrantType(Q, OU.JWT_BEARER), PB.addClientInfo(Q), PB.addLibraryInfo(Q, this.config.libraryInfo), PB.addApplicationTelemetry(Q, this.config.telemetry.application), PB.addThrottling(Q), this.serverTelemetryManager) PB.addServerTelemetry(Q, this.serverTelemetryManager);
      let B = A.correlationId || this.config.cryptoInterface.createNewGuid();
      if (PB.addCorrelationId(Q, B), PB.addRequestTokenUse(Q, GAA.ON_BEHALF_OF), PB.addOboAssertion(Q, A.oboAssertion), this.config.clientCredentials.clientSecret) PB.addClientSecret(Q, this.config.clientCredentials.clientSecret);
      let G = this.config.clientCredentials.clientAssertion;
      if (G) PB.addClientAssertion(Q, await wE(G.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), PB.addClientAssertionType(Q, G.assertionType);
      if (A.claims || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) PB.addClaims(Q, A.claims, this.config.authOptions.clientCapabilities);
      return OD.mapToQueryString(Q)
    }
  }
})
// @from(Start 8224489, End 8224492)
jNA
// @from(Start 8224498, End 8228153)
coB = L(() => {
  b11();
  x11();
  UI();
  p7();
  f11();
  Fr1(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  jNA = class jNA extends EAA {
    constructor(A) {
      super(A);
      let Q = !!this.config.auth.clientSecret,
        B = !!this.config.auth.clientAssertion,
        G = (!!this.config.auth.clientCertificate?.thumbprint || !!this.config.auth.clientCertificate?.thumbprintSha256) && !!this.config.auth.clientCertificate?.privateKey;
      if (this.appTokenProvider) return;
      if (Q && B || B && G || Q && G) throw b0(fG.invalidClientCredential);
      if (this.config.auth.clientSecret) {
        this.clientSecret = this.config.auth.clientSecret;
        return
      }
      if (this.config.auth.clientAssertion) {
        this.developerProvidedClientAssertion = this.config.auth.clientAssertion;
        return
      }
      if (!G) throw b0(fG.invalidClientCredential);
      else this.clientAssertion = this.config.auth.clientCertificate.thumbprintSha256 ? cT.fromCertificateWithSha256Thumbprint(this.config.auth.clientCertificate.thumbprintSha256, this.config.auth.clientCertificate.privateKey, this.config.auth.clientCertificate.x5c) : cT.fromCertificate(this.config.auth.clientCertificate.thumbprint, this.config.auth.clientCertificate.privateKey, this.config.auth.clientCertificate.x5c);
      this.appTokenProvider = void 0
    }
    SetAppTokenProvider(A) {
      this.appTokenProvider = A
    }
    async acquireTokenByClientCredential(A) {
      this.logger.info("acquireTokenByClientCredential called", A.correlationId);
      let Q;
      if (A.clientAssertion) Q = {
        assertion: await wE(A.clientAssertion, this.config.auth.clientId),
        assertionType: qE.JWT_BEARER_ASSERTION_TYPE
      };
      let B = await this.initializeBaseRequest(A),
        G = {
          ...B,
          scopes: B.scopes.filter((F) => !nH.includes(F))
        },
        Z = {
          ...A,
          ...G,
          clientAssertion: Q
        },
        Y = new w8(Z.authority).getUrlComponents().PathSegments[0];
      if (Object.values(MU).includes(Y)) throw b0(fG.missingTenantIdError);
      let J = process.env[taB],
        W;
      if (Z.azureRegion !== "DisableMsalForceRegion")
        if (!Z.azureRegion && J) W = J;
        else W = Z.azureRegion;
      let X = {
          azureRegion: W,
          environmentRegion: process.env[oaB]
        },
        V = this.initializeServerTelemetryManager(af.acquireTokenByClientCredential, Z.correlationId, Z.skipCache);
      try {
        let F = await this.createAuthority(Z.authority, Z.correlationId, X, A.azureCloudOptions),
          K = await this.buildOauthClientConfiguration(F, Z.correlationId, "", V),
          D = new zAA(K, this.appTokenProvider);
        return this.logger.verbose("Client credential client created", Z.correlationId), await D.acquireToken(Z)
      } catch (F) {
        if (F instanceof t4) F.setCorrelationId(Z.correlationId);
        throw V.cacheFailedRequest(F), F
      }
    }
    async acquireTokenOnBehalfOf(A) {
      this.logger.info("acquireTokenOnBehalfOf called", A.correlationId);
      let Q = {
        ...A,
        ...await this.initializeBaseRequest(A)
      };
      try {
        let B = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions),
          G = await this.buildOauthClientConfiguration(B, Q.correlationId, "", void 0),
          Z = new PNA(G);
        return this.logger.verbose("On behalf of client created", Q.correlationId), await Z.acquireToken(Q)
      } catch (B) {
        if (B instanceof t4) B.setCorrelationId(Q.correlationId);
        throw B
      }
    }
  }
})
// @from(Start 8228156, End 8228292)
function poB(A) {
  if (typeof A !== "string") return !1;
  let Q = new Date(A);
  return !isNaN(Q.getTime()) && Q.toISOString() === A
}
// @from(Start 8228297, End 8228359)
loB = L(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Start 8228361, End 8229247)
class Kr1 {
  constructor(A, Q, B) {
    this.httpClientNoRetries = A, this.retryPolicy = Q, this.logger = B
  }
  async sendNetworkRequestAsyncHelper(A, Q, B) {
    if (A === zI.GET) return this.httpClientNoRetries.sendGetRequestAsync(Q, B);
    else return this.httpClientNoRetries.sendPostRequestAsync(Q, B)
  }
  async sendNetworkRequestAsync(A, Q, B) {
    let G = await this.sendNetworkRequestAsyncHelper(A, Q, B);
    if ("isNewRequest" in this.retryPolicy) this.retryPolicy.isNewRequest = !0;
    let Z = 0;
    while (await this.retryPolicy.pauseForRetry(G.status, Z, this.logger, G.headers[uZ.RETRY_AFTER])) G = await this.sendNetworkRequestAsyncHelper(A, Q, B), Z++;
    return G
  }
  async sendGetRequestAsync(A, Q) {
    return this.sendNetworkRequestAsync(zI.GET, A, Q)
  }
  async sendPostRequestAsync(A, Q) {
    return this.sendNetworkRequestAsync(zI.POST, A, Q)
  }
}
// @from(Start 8229252, End 8229328)
ioB = L(() => {
  p7();
  UI(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8229330, End 8232614)
class jU {
  constructor(A, Q, B, G, Z) {
    this.logger = A, this.nodeStorage = Q, this.networkClient = B, this.cryptoProvider = G, this.disableInternalRetries = Z
  }
  async getServerTokenResponseAsync(A, Q, B, G) {
    return this.getServerTokenResponse(A)
  }
  getServerTokenResponse(A) {
    let Q, B;
    if (A.body.expires_on) {
      if (poB(A.body.expires_on)) A.body.expires_on = new Date(A.body.expires_on).getTime() / 1000;
      if (B = A.body.expires_on - EI.nowSeconds(), B > 7200) Q = B / 2
    }
    return {
      status: A.status,
      access_token: A.body.access_token,
      expires_in: B,
      scope: A.body.resource,
      token_type: A.body.token_type,
      refresh_in: Q,
      correlation_id: A.body.correlation_id || A.body.correlationId,
      error: typeof A.body.error === "string" ? A.body.error : A.body.error?.code,
      error_description: A.body.message || (typeof A.body.error === "string" ? A.body.error_description : A.body.error?.message),
      error_codes: A.body.error_codes,
      timestamp: A.body.timestamp,
      trace_id: A.body.trace_id
    }
  }
  async acquireTokenWithManagedIdentity(A, Q, B, G) {
    let Z = this.createRequest(A.resource, Q);
    if (A.revokedTokenSha256Hash) this.logger.info(`[Managed Identity] The following claims are present in the request: ${A.claims}`), Z.queryParameters[pX.SHA256_TOKEN_TO_REFRESH] = A.revokedTokenSha256Hash;
    if (A.clientCapabilities?.length) {
      let K = A.clientCapabilities.toString();
      this.logger.info(`[Managed Identity] The following client capabilities are present in the request: ${K}`), Z.queryParameters[pX.XMS_CC] = K
    }
    let I = Z.headers;
    I[uZ.CONTENT_TYPE] = L0.URL_FORM_CONTENT_TYPE;
    let Y = {
      headers: I
    };
    if (Object.keys(Z.bodyParameters).length) Y.body = Z.computeParametersBodyString();
    let J = this.disableInternalRetries ? this.networkClient : new Kr1(this.networkClient, Z.retryPolicy, this.logger),
      W = EI.nowSeconds(),
      X;
    try {
      if (Z.httpMethod === zI.POST) X = await J.sendPostRequestAsync(Z.computeUri(), Y);
      else X = await J.sendGetRequestAsync(Z.computeUri(), Y)
    } catch (K) {
      if (K instanceof t4) throw K;
      else throw b0(fG.networkError)
    }
    let V = new _J(Q.id, this.nodeStorage, this.cryptoProvider, this.logger, null, null),
      F = await this.getServerTokenResponseAsync(X, J, Z, Y);
    return V.validateTokenResponse(F, G), V.handleServerTokenResponse(F, B, W, A)
  }
  getManagedIdentityUserAssignedIdQueryParameterKey(A, Q, B) {
    switch (A) {
      case iY.USER_ASSIGNED_CLIENT_ID:
        return this.logger.info(`[Managed Identity] [API version ${B?"2017+":"2019+"}] Adding user assigned client id to the request.`), B ? UAA.MANAGED_IDENTITY_CLIENT_ID_2017 : UAA.MANAGED_IDENTITY_CLIENT_ID;
      case iY.USER_ASSIGNED_RESOURCE_ID:
        return this.logger.info("[Managed Identity] Adding user assigned resource id to the request."), Q ? UAA.MANAGED_IDENTITY_RESOURCE_ID_IMDS : UAA.MANAGED_IDENTITY_RESOURCE_ID_NON_IMDS;
      case iY.USER_ASSIGNED_OBJECT_ID:
        return this.logger.info("[Managed Identity] Adding user assigned object id to the request."), UAA.MANAGED_IDENTITY_OBJECT_ID;
      default:
        throw _W($l)
    }
  }
}
// @from(Start 8232619, End 8232622)
UAA