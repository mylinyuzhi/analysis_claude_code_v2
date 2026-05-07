
// @from(Ln 116498, Col 0)
function Qn6(q, K = {
    maxRetries: Un6
}) {
    let _ = K.logger || vi9;
    return {
        name: Ti9,
        async sendRequest(z, Y) {
            var A, O;
            let w, $, j = -1;
            q: while (!0) {
                j += 1, w = void 0, $ = void 0;
                try {
                    _.info(`Retry ${j}: Attempting to send request`, z.requestId), w = await Y(z), _.info(`Retry ${j}: Received a response from request`, z.requestId)
                } catch (H) {
                    if (_.error(`Retry ${j}: Received an error from request`, z.requestId), $ = H, !H || $.name !== "RestError") throw H;
                    w = $.response
                }
                if ((A = z.abortSignal) === null || A === void 0 ? void 0 : A.aborted) throw _.error(`Retry ${j}: Request aborted.`), new Jq6;
                if (j >= ((O = K.maxRetries) !== null && O !== void 0 ? O : Un6))
                    if (_.info(`Retry ${j}: Maximum retries reached. Returning the last received response, or throwing the last received error.`), $) throw $;
                    else if (w) return w;
                else throw Error("Maximum retries reached with no response or error to throw");
                _.info(`Retry ${j}: Processing ${q.length} retry strategies.`);
                K: for (let H of q) {
                    let J = H.logger || _;
                    J.info(`Retry ${j}: Processing retry strategy ${H.name}.`);
                    let X = H.retry({
                        retryCount: j,
                        response: w,
                        responseError: $
                    });
                    if (X.skipStrategy) {
                        J.info(`Retry ${j}: Skipped.`);
                        continue K
                    }
                    let {
                        errorToThrow: M,
                        retryAfterInMs: P,
                        redirectTo: W
                    } = X;
                    if (M) throw J.error(`Retry ${j}: Retry strategy ${H.name} throws error:`, M), M;
                    if (P || P === 0) {
                        J.info(`Retry ${j}: Retry strategy ${H.name} retries after ${P}`), await NNq(P, void 0, {
                            abortSignal: z.abortSignal
                        });
                        continue q
                    }
                    if (W) {
                        J.info(`Retry ${j}: Retry strategy ${H.name} redirects to ${W}`), z.url = W;
                        continue q
                    }
                }
                if ($) throw _.info("None of the retry strategies could work with the received error. Throwing it."), $;
                if (w) return _.info("None of the retry strategies could work with the received response. Returning it."), w
            }
        }
    }
}
// @from(Ln 116556, Col 4)
vi9
// @from(Ln 116556, Col 9)
Ti9 = "retryPolicy"
// @from(Ln 116557, Col 4)
sV1 = L(() => {
    rV1();
    OG8();
    KG8();
    vi9 = qG8("ts-http-runtime retryPolicy")
})
// @from(Ln 116564, Col 0)
function eV1(q = {}) {
    var K;
    return {
        name: tV1,
        sendRequest: Qn6([hNq(), RNq(q)], {
            maxRetries: (K = q.maxRetries) !== null && K !== void 0 ? K : Un6
        }).sendRequest
    }
}
// @from(Ln 116573, Col 4)
tV1 = "defaultRetryPolicy"
// @from(Ln 116574, Col 4)
CNq = L(() => {
    SNq();
    aV1();
    sV1()
})
// @from(Ln 116580, Col 0)
function SQ(q, K) {
    return Buffer.from(q, K)
}
// @from(Ln 116583, Col 4)
qk1
// @from(Ln 116583, Col 9)
Kk1
// @from(Ln 116583, Col 14)
_k1
// @from(Ln 116583, Col 19)
zk1
// @from(Ln 116583, Col 24)
bNq
// @from(Ln 116583, Col 29)
INq
// @from(Ln 116583, Col 34)
xNq
// @from(Ln 116583, Col 39)
uNq
// @from(Ln 116583, Col 44)
tT6
// @from(Ln 116583, Col 49)
mNq
// @from(Ln 116584, Col 4)
Yk1 = L(() => {
    bNq = typeof window < "u" && typeof window.document < "u", INq = typeof self === "object" && typeof(self === null || self === void 0 ? void 0 : self.importScripts) === "function" && (((qk1 = self.constructor) === null || qk1 === void 0 ? void 0 : qk1.name) === "DedicatedWorkerGlobalScope" || ((Kk1 = self.constructor) === null || Kk1 === void 0 ? void 0 : Kk1.name) === "ServiceWorkerGlobalScope" || ((_k1 = self.constructor) === null || _k1 === void 0 ? void 0 : _k1.name) === "SharedWorkerGlobalScope"), xNq = typeof Deno < "u" && typeof Deno.version < "u" && typeof Deno.version.deno < "u", uNq = typeof Bun < "u" && typeof Bun.version < "u", tT6 = typeof globalThis.process < "u" && Boolean(globalThis.process.version) && Boolean((zk1 = globalThis.process.versions) === null || zk1 === void 0 ? void 0 : zk1.node), mNq = typeof navigator < "u" && (navigator === null || navigator === void 0 ? void 0 : navigator.product) === "ReactNative"
})
// @from(Ln 116588, Col 0)
function Vi9(q) {
    var K;
    let _ = {};
    for (let [z, Y] of q.entries())(K = _[z]) !== null && K !== void 0 || (_[z] = []), _[z].push(Y);
    return _
}
// @from(Ln 116595, Col 0)
function Ok1() {
    return {
        name: Ak1,
        async sendRequest(q, K) {
            if (tT6 && typeof FormData < "u" && q.body instanceof FormData) q.formData = Vi9(q.body), q.body = void 0;
            if (q.formData) {
                let _ = q.headers.get("Content-Type");
                if (_ && _.indexOf("application/x-www-form-urlencoded") !== -1) q.body = ki9(q.formData);
                else await Ni9(q.formData, q);
                q.formData = void 0
            }
            return K(q)
        }
    }
}
// @from(Ln 116611, Col 0)
function ki9(q) {
    let K = new URLSearchParams;
    for (let [_, z] of Object.entries(q))
        if (Array.isArray(z))
            for (let Y of z) K.append(_, Y.toString());
        else K.append(_, z.toString());
    return K.toString()
}
// @from(Ln 116619, Col 0)
async function Ni9(q, K) {
    let _ = K.headers.get("Content-Type");
    if (_ && !_.startsWith("multipart/form-data")) return;
    K.headers.set("Content-Type", _ !== null && _ !== void 0 ? _ : "multipart/form-data");
    let z = [];
    for (let [Y, A] of Object.entries(q))
        for (let O of Array.isArray(A) ? A : [A])
            if (typeof O === "string") z.push({
                headers: hQ({
                    "Content-Disposition": `form-data; name="${Y}"`
                }),
                body: SQ(O, "utf-8")
            });
            else if (O === void 0 || O === null || typeof O !== "object") throw Error(`Unexpected value for key ${Y}: ${O}. Value should be serialized to string first.`);
    else {
        let w = O.name || "blob",
            $ = hQ();
        $.set("Content-Disposition", `form-data; name="${Y}"; filename="${w}"`), $.set("Content-Type", O.type || "application/octet-stream"), z.push({
            headers: $,
            body: O
        })
    }
    K.multipartBody = {
        parts: z
    }
}
// @from(Ln 116645, Col 4)
Ak1 = "formDataPolicy"
// @from(Ln 116646, Col 4)
BNq = L(() => {
    Yk1();
    xn6()
})
// @from(Ln 116651, Col 0)
function $k1(q = {}) {
    var K;
    let _ = (K = q.logger) !== null && K !== void 0 ? K : PB.info,
        z = new RQ({
            additionalAllowedHeaderNames: q.additionalAllowedHeaderNames,
            additionalAllowedQueryParameters: q.additionalAllowedQueryParameters
        });
    return {
        name: wk1,
        async sendRequest(Y, A) {
            if (!_.enabled) return A(Y);
            _(`Request: ${z.sanitize(Y)}`);
            let O = await A(Y);
            return _(`Response status code: ${O.status}`), _(`Headers: ${z.sanitize(O.headers)}`), O
        }
    }
}
// @from(Ln 116668, Col 4)
wk1 = "logPolicy"
// @from(Ln 116669, Col 4)
pNq = L(() => {
    wG8();
    Bn6()
})
// @from(Ln 116674, Col 0)
function HG8(q) {
    return typeof q.stream === "function"
}
// @from(Ln 116677, Col 4)
FNq
// @from(Ln 116677, Col 9)
vWO
// @from(Ln 116677, Col 14)
TWO
// @from(Ln 116677, Col 19)
VWO
// @from(Ln 116677, Col 24)
kWO
// @from(Ln 116677, Col 29)
NWO
// @from(Ln 116677, Col 34)
EWO
// @from(Ln 116677, Col 39)
yWO
// @from(Ln 116677, Col 44)
LWO
// @from(Ln 116677, Col 49)
hWO
// @from(Ln 116677, Col 54)
RWO
// @from(Ln 116677, Col 59)
SWO
// @from(Ln 116677, Col 64)
CWO
// @from(Ln 116677, Col 69)
bWO
// @from(Ln 116677, Col 74)
IWO
// @from(Ln 116677, Col 79)
xWO
// @from(Ln 116677, Col 84)
uWO
// @from(Ln 116677, Col 89)
mWO
// @from(Ln 116677, Col 94)
BWO
// @from(Ln 116677, Col 99)
pWO
// @from(Ln 116677, Col 104)
Mw6
// @from(Ln 116677, Col 109)
jk1
// @from(Ln 116677, Col 114)
FWO
// @from(Ln 116677, Col 119)
gNq
// @from(Ln 116677, Col 124)
gWO
// @from(Ln 116677, Col 129)
UWO
// @from(Ln 116677, Col 134)
QWO
// @from(Ln 116677, Col 139)
dWO
// @from(Ln 116677, Col 144)
cWO
// @from(Ln 116677, Col 149)
lWO
// @from(Ln 116677, Col 154)
nWO
// @from(Ln 116677, Col 159)
iWO
// @from(Ln 116677, Col 164)
rWO
// @from(Ln 116678, Col 4)
UNq = L(() => {
    FNq = K6(IV(), 1), {
        __extends: vWO,
        __assign: TWO,
        __rest: VWO,
        __decorate: kWO,
        __param: NWO,
        __esDecorate: EWO,
        __runInitializers: yWO,
        __propKey: LWO,
        __setFunctionName: hWO,
        __metadata: RWO,
        __awaiter: SWO,
        __generator: CWO,
        __exportStar: bWO,
        __createBinding: IWO,
        __values: xWO,
        __read: uWO,
        __spread: mWO,
        __spreadArrays: BWO,
        __spreadArray: pWO,
        __await: Mw6,
        __asyncGenerator: jk1,
        __asyncDelegator: FWO,
        __asyncValues: gNq,
        __makeTemplateObject: gWO,
        __importStar: UWO,
        __importDefault: QWO,
        __classPrivateFieldGet: dWO,
        __classPrivateFieldSet: cWO,
        __classPrivateFieldIn: lWO,
        __addDisposableResource: nWO,
        __disposeResources: iWO,
        __rewriteRelativeImportExtension: rWO
    } = FNq.default
})
// @from(Ln 116718, Col 0)
function QNq() {
    return jk1(this, arguments, function*() {
        let K = this.getReader();
        try {
            while (!0) {
                let {
                    done: _,
                    value: z
                } = yield Mw6(K.read());
                if (_) return yield Mw6(void 0);
                yield yield Mw6(z)
            }
        } finally {
            K.releaseLock()
        }
    })
}
// @from(Ln 116736, Col 0)
function Ei9(q) {
    if (!q[Symbol.asyncIterator]) q[Symbol.asyncIterator] = QNq.bind(q);
    if (!q.values) q.values = QNq.bind(q)
}
// @from(Ln 116741, Col 0)
function dNq(q) {
    if (q instanceof ReadableStream) return Ei9(q), Hk1.fromWeb(q);
    else return q
}
// @from(Ln 116746, Col 0)
function yi9(q) {
    if (q instanceof Uint8Array) return Hk1.from(Buffer.from(q));
    else if (HG8(q)) return dNq(q.stream());
    else return dNq(q)
}
// @from(Ln 116751, Col 0)
async function cNq(q) {
    return function() {
        let K = q.map((_) => typeof _ === "function" ? _() : _).map(yi9);
        return Hk1.from(function() {
            return jk1(this, arguments, function*() {
                var _, z, Y, A;
                for (let j of K) try {
                    for (var O = !0, w = (z = void 0, gNq(j)), $; $ = yield Mw6(w.next()), _ = $.done, !_; O = !0) A = $.value, O = !1, yield yield Mw6(A)
                } catch (H) {
                    z = {
                        error: H
                    }
                } finally {
                    try {
                        if (!O && !_ && (Y = w.return)) yield Mw6(Y.call(w))
                    } finally {
                        if (z) throw z.error
                    }
                }
            })
        }())
    }
}
// @from(Ln 116774, Col 4)
lNq = L(() => {
    UNq()
})
// @from(Ln 116778, Col 0)
function Li9() {
    return `----AzSDKFormBoundary${un6()}`
}
// @from(Ln 116782, Col 0)
function hi9(q) {
    let K = "";
    for (let [_, z] of q) K += `${_}: ${z}\r
`;
    return K
}
// @from(Ln 116789, Col 0)
function Ri9(q) {
    if (q instanceof Uint8Array) return q.byteLength;
    else if (HG8(q)) return q.size === -1 ? void 0 : q.size;
    else return
}
// @from(Ln 116795, Col 0)
function Si9(q) {
    let K = 0;
    for (let _ of q) {
        let z = Ri9(_);
        if (z === void 0) return;
        else K += z
    }
    return K
}
// @from(Ln 116804, Col 0)
async function Ci9(q, K, _) {
    let z = [SQ(`--${_}`, "utf-8"), ...K.flatMap((A) => [SQ(`\r
`, "utf-8"), SQ(hi9(A.headers), "utf-8"), SQ(`\r
`, "utf-8"), A.body, SQ(`\r
--${_}`, "utf-8")]), SQ(`--\r
\r
`, "utf-8")],
        Y = Si9(z);
    if (Y) q.headers.set("Content-Length", Y);
    q.body = await cNq(z)
}
// @from(Ln 116816, Col 0)
function xi9(q) {
    if (q.length > bi9) throw Error(`Multipart boundary "${q}" exceeds maximum length of 70 characters`);
    if (Array.from(q).some((K) => !Ii9.has(K))) throw Error(`Multipart boundary "${q}" contains invalid characters`)
}
// @from(Ln 116821, Col 0)
function Jk1() {
    return {
        name: JG8,
        async sendRequest(q, K) {
            var _;
            if (!q.multipartBody) return K(q);
            if (q.body) throw Error("multipartBody and regular body cannot be set at the same time");
            let z = q.multipartBody.boundary,
                Y = (_ = q.headers.get("Content-Type")) !== null && _ !== void 0 ? _ : "multipart/mixed",
                A = Y.match(/^(multipart\/[^ ;]+)(?:; *boundary=(.+))?$/);
            if (!A) throw Error(`Got multipart request body, but content-type header was not multipart: ${Y}`);
            let [, O, w] = A;
            if (w && z && w !== z) throw Error(`Multipart boundary was specified as ${w} in the header, but got ${z} in the request body`);
            if (z !== null && z !== void 0 || (z = w), z) xi9(z);
            else z = Li9();
            return q.headers.set("Content-Type", `${O}; boundary=${z}`), await Ci9(q, q.multipartBody.parts, z), q.multipartBody = void 0, K(q)
        }
    }
}
// @from(Ln 116840, Col 4)
JG8 = "multipartPolicy"
// @from(Ln 116841, Col 4)
bi9 = 70
// @from(Ln 116842, Col 4)
Ii9
// @from(Ln 116843, Col 4)
nNq = L(() => {
    xV1();
    lNq();
    Ii9 = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'()+,-./:=?")
})
// @from(Ln 116848, Col 4)
oNq = p((cb) => {
    var ui9 = cb && cb.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            var Y = Object.getOwnPropertyDescriptor(K, _);
            if (!Y || ("get" in Y ? !K.__esModule : Y.writable || Y.configurable)) Y = {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            };
            Object.defineProperty(q, z, Y)
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        mi9 = cb && cb.__setModuleDefault || (Object.create ? function(q, K) {
            Object.defineProperty(q, "default", {
                enumerable: !0,
                value: K
            })
        } : function(q, K) {
            q.default = K
        }),
        rNq = cb && cb.__importStar || function(q) {
            if (q && q.__esModule) return q;
            var K = {};
            if (q != null) {
                for (var _ in q)
                    if (_ !== "default" && Object.prototype.hasOwnProperty.call(q, _)) ui9(K, q, _)
            }
            return mi9(K, q), K
        },
        Bi9 = cb && cb.__importDefault || function(q) {
            return q && q.__esModule ? q : {
                default: q
            }
        };
    Object.defineProperty(cb, "__esModule", {
        value: !0
    });
    cb.HttpProxyAgent = void 0;
    var pi9 = rNq(d6("net")),
        Fi9 = rNq(d6("tls")),
        gi9 = Bi9($f6()),
        Ui9 = d6("events"),
        Qi9 = nO1(),
        iNq = d6("url"),
        eT6 = (0, gi9.default)("http-proxy-agent");
    class Xk1 extends Qi9.Agent {
        constructor(q, K) {
            super(K);
            this.proxy = typeof q === "string" ? new iNq.URL(q) : q, this.proxyHeaders = K?.headers ?? {}, eT6("Creating new HttpProxyAgent instance: %o", this.proxy.href);
            let _ = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""),
                z = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
            this.connectOpts = {
                ...K ? di9(K, "headers") : null,
                host: _,
                port: z
            }
        }
        addRequest(q, K) {
            q._header = null, this.setRequestProps(q, K), super.addRequest(q, K)
        }
        setRequestProps(q, K) {
            let {
                proxy: _
            } = this, z = K.secureEndpoint ? "https:" : "http:", Y = q.getHeader("host") || "localhost", A = `${z}//${Y}`, O = new iNq.URL(q.path, A);
            if (K.port !== 80) O.port = String(K.port);
            q.path = String(O);
            let w = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : {
                ...this.proxyHeaders
            };
            if (_.username || _.password) {
                let $ = `${decodeURIComponent(_.username)}:${decodeURIComponent(_.password)}`;
                w["Proxy-Authorization"] = `Basic ${Buffer.from($).toString("base64")}`
            }
            if (!w["Proxy-Connection"]) w["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
            for (let $ of Object.keys(w)) {
                let j = w[$];
                if (j) q.setHeader($, j)
            }
        }
        async connect(q, K) {
            if (q._header = null, !q.path.includes("://")) this.setRequestProps(q, K);
            let _, z;
            if (eT6("Regenerating stored HTTP header string for request"), q._implicitHeader(), q.outputData && q.outputData.length > 0) eT6("Patching connection write() output buffer with updated header"), _ = q.outputData[0].data, z = _.indexOf(`\r
\r
`) + 4, q.outputData[0].data = q._header + _.substring(z), eT6("Output buffer: %o", q.outputData[0].data);
            let Y;
            if (this.proxy.protocol === "https:") eT6("Creating `tls.Socket`: %o", this.connectOpts), Y = Fi9.connect(this.connectOpts);
            else eT6("Creating `net.Socket`: %o", this.connectOpts), Y = pi9.connect(this.connectOpts);
            return await (0, Ui9.once)(Y, "connect"), Y
        }
    }
    Xk1.protocols = ["http", "https"];
    cb.HttpProxyAgent = Xk1;

    function di9(q, ...K) {
        let _ = {},
            z;
        for (z in q)
            if (!K.includes(z)) _[z] = q[z];
        return _
    }
})
// @from(Ln 116954, Col 0)
function XG8(q) {
    if (process.env[q]) return process.env[q];
    else if (process.env[q.toLowerCase()]) return process.env[q.toLowerCase()];
    return
}
// @from(Ln 116960, Col 0)
function oi9() {
    if (!process) return;
    let q = XG8(ci9),
        K = XG8(ni9),
        _ = XG8(li9);
    return q || K || _
}
// @from(Ln 116968, Col 0)
function ai9(q, K, _) {
    if (K.length === 0) return !1;
    let z = new URL(q).hostname;
    if (_ === null || _ === void 0 ? void 0 : _.has(z)) return _.get(z);
    let Y = !1;
    for (let A of K)
        if (A[0] === ".") {
            if (z.endsWith(A)) Y = !0;
            else if (z.length === A.length - 1 && z === A.slice(1)) Y = !0
        } else if (z === A) Y = !0;
    return _ === null || _ === void 0 || _.set(z, Y), Y
}
// @from(Ln 116981, Col 0)
function si9() {
    let q = XG8(ii9);
    if (KEq = !0, q) return q.split(",").map((K) => K.trim()).filter((K) => K.length);
    return []
}
// @from(Ln 116987, Col 0)
function ti9() {
    let q = oi9();
    return q ? new URL(q) : void 0
}
// @from(Ln 116992, Col 0)
function sNq(q) {
    let K;
    try {
        K = new URL(q.host)
    } catch (_) {
        throw Error(`Expecting a valid host string in proxy settings, but found "${q.host}".`)
    }
    if (K.port = String(q.port), q.username) K.username = q.username;
    if (q.password) K.password = q.password;
    return K
}
// @from(Ln 117004, Col 0)
function tNq(q, K, _) {
    if (q.agent) return;
    let Y = new URL(q.url).protocol !== "https:";
    if (q.tlsSettings) PB.warning("TLS settings are not supported in combination with custom Proxy, certificates provided to the client will be ignored.");
    let A = q.headers.toJSON();
    if (Y) {
        if (!K.httpProxyAgent) K.httpProxyAgent = new qEq.HttpProxyAgent(_, {
            headers: A
        });
        q.agent = K.httpProxyAgent
    } else {
        if (!K.httpsProxyAgent) K.httpsProxyAgent = new eNq.HttpsProxyAgent(_, {
            headers: A
        });
        q.agent = K.httpsProxyAgent
    }
}
// @from(Ln 117022, Col 0)
function Pk1(q, K) {
    if (!KEq) aNq.push(...si9());
    let _ = q ? sNq(q) : ti9(),
        z = {};
    return {
        name: Mk1,
        async sendRequest(Y, A) {
            var O;
            if (!Y.proxySettings && _ && !ai9(Y.url, (O = K === null || K === void 0 ? void 0 : K.customNoProxyList) !== null && O !== void 0 ? O : aNq, (K === null || K === void 0 ? void 0 : K.customNoProxyList) ? void 0 : ri9)) tNq(Y, z, _);
            else if (Y.proxySettings) tNq(Y, z, sNq(Y.proxySettings));
            return A(Y)
        }
    }
}
// @from(Ln 117036, Col 4)
eNq
// @from(Ln 117036, Col 9)
qEq
// @from(Ln 117036, Col 14)
ci9 = "HTTPS_PROXY"
// @from(Ln 117037, Col 4)
li9 = "HTTP_PROXY"
// @from(Ln 117038, Col 4)
ni9 = "ALL_PROXY"
// @from(Ln 117039, Col 4)
ii9 = "NO_PROXY"
// @from(Ln 117040, Col 4)
Mk1 = "proxyPolicy"
// @from(Ln 117041, Col 4)
aNq
// @from(Ln 117041, Col 9)
KEq = !1
// @from(Ln 117042, Col 4)
ri9
// @from(Ln 117043, Col 4)
_Eq = L(() => {
    wG8();
    eNq = K6(dQ6(), 1), qEq = K6(oNq(), 1), aNq = [], ri9 = new Map
})
// @from(Ln 117048, Col 0)
function Wk1(q = {}) {
    let {
        maxRetries: K = 20
    } = q;
    return {
        name: "redirectPolicy",
        async sendRequest(_, z) {
            let Y = await z(_);
            return YEq(z, Y, K)
        }
    }
}
// @from(Ln 117060, Col 0)
async function YEq(q, K, _, z = 0) {
    let {
        request: Y,
        status: A,
        headers: O
    } = K, w = O.get("location");
    if (w && (A === 300 || A === 301 && zEq.includes(Y.method) || A === 302 && zEq.includes(Y.method) || A === 303 && Y.method === "POST" || A === 307) && z < _) {
        let $ = new URL(w, Y.url);
        if (Y.url = $.toString(), A === 303) Y.method = "GET", Y.headers.delete("Content-Length"), delete Y.body;
        Y.headers.delete("Authorization");
        let j = await q(Y);
        return YEq(q, j, _, z + 1)
    }
    return K
}
// @from(Ln 117075, Col 4)
zEq
// @from(Ln 117076, Col 4)
AEq = L(() => {
    zEq = ["GET", "HEAD"]
})
// @from(Ln 117080, Col 0)
function Dk1(q) {
    return {
        name: "tlsPolicy",
        sendRequest: async (K, _) => {
            if (!K.tlsSettings) K.tlsSettings = q;
            return _(K)
        }
    }
}
// @from(Ln 117089, Col 4)
WB = L(() => {
    CNq();
    sV1();
    BNq();
    pNq();
    nNq();
    _Eq();
    AEq()
})
// @from(Ln 117099, Col 0)
function OEq(q = {}) {
    return $k1(Object.assign({
        logger: ko.info
    }, q))
}
// @from(Ln 117104, Col 4)
wEq = L(() => {
    jG8();
    WB()
})
// @from(Ln 117109, Col 0)
function $Eq(q = {}) {
    return Wk1(q)
}
// @from(Ln 117112, Col 4)
jEq = L(() => {
    WB()
})
// @from(Ln 117118, Col 0)
function HEq() {
    return "User-Agent"
}
// @from(Ln 117121, Col 0)
async function JEq(q) {
    if (MG8 && MG8.versions) {
        let K = MG8.versions;
        if (K.bun) q.set("Bun", K.bun);
        else if (K.deno) q.set("Deno", K.deno);
        else if (K.node) q.set("Node", K.node)
    }
    q.set("OS", `(${qV6.arch()}-${qV6.type()}-${qV6.release()})`)
}
// @from(Ln 117130, Col 4)
XEq = () => {}
// @from(Ln 117131, Col 4)
PG8 = "1.21.0"
// @from(Ln 117132, Col 4)
MEq = 3
// @from(Ln 117134, Col 0)
function Yr9(q) {
    let K = [];
    for (let [_, z] of q) {
        let Y = z ? `${_}/${z}` : _;
        K.push(Y)
    }
    return K.join(" ")
}
// @from(Ln 117143, Col 0)
function PEq() {
    return HEq()
}
// @from(Ln 117146, Col 0)
async function WG8(q) {
    let K = new Map;
    K.set("core-rest-pipeline", PG8), await JEq(K);
    let _ = Yr9(K);
    return q ? `${q} ${_}` : _
}
// @from(Ln 117152, Col 4)
Zk1 = L(() => {
    XEq()
})
// @from(Ln 117156, Col 0)
function DEq(q = {}) {
    let K = WG8(q.userAgentPrefix);
    return {
        name: Ar9,
        async sendRequest(_, z) {
            if (!_.headers.has(WEq)) _.headers.set(WEq, await K);
            return z(_)
        }
    }
}
// @from(Ln 117166, Col 4)
WEq
// @from(Ln 117166, Col 9)
Ar9 = "userAgentPolicy"
// @from(Ln 117167, Col 4)
ZEq = L(() => {
    Zk1();
    WEq = PEq()
})
// @from(Ln 117171, Col 4)
DG8 = L(() => {
    iV1();
    BV1();
    Yk1();
    Bn6()
})
// @from(Ln 117177, Col 4)
KV6
// @from(Ln 117178, Col 4)
fEq = L(() => {
    KV6 = class KV6 extends Error {
        constructor(q) {
            super(q);
            this.name = "AbortError"
        }
    }
})
// @from(Ln 117186, Col 4)
fk1 = L(() => {
    fEq()
})
// @from(Ln 117190, Col 0)
function GEq(q, K) {
    let {
        cleanupBeforeAbort: _,
        abortSignal: z,
        abortErrorMsg: Y
    } = K !== null && K !== void 0 ? K : {};
    return new Promise((A, O) => {
        function w() {
            O(new KV6(Y !== null && Y !== void 0 ? Y : "The operation was aborted."))
        }

        function $() {
            z === null || z === void 0 || z.removeEventListener("abort", j)
        }

        function j() {
            _ === null || _ === void 0 || _(), $(), w()
        }
        if (z === null || z === void 0 ? void 0 : z.aborted) return w();
        try {
            q((H) => {
                $(), A(H)
            }, (H) => {
                $(), O(H)
            })
        } catch (H) {
            O(H)
        }
        z === null || z === void 0 || z.addEventListener("abort", j)
    })
}
// @from(Ln 117221, Col 4)
vEq = L(() => {
    fk1()
})
// @from(Ln 117225, Col 0)
function Gk1(q, K) {
    let _, {
        abortSignal: z,
        abortErrorMsg: Y
    } = K !== null && K !== void 0 ? K : {};
    return GEq((A) => {
        _ = setTimeout(A, q)
    }, {
        cleanupBeforeAbort: () => clearTimeout(_),
        abortSignal: z,
        abortErrorMsg: Y !== null && Y !== void 0 ? Y : $r9
    })
}
// @from(Ln 117238, Col 4)
$r9 = "The delay was aborted."
// @from(Ln 117239, Col 4)
TEq = L(() => {
    vEq()
})
// @from(Ln 117243, Col 0)
function _V6(q) {
    if (Xw6(q)) return q.message;
    else {
        let K;
        try {
            if (typeof q === "object" && q) K = JSON.stringify(q);
            else K = String(q)
        } catch (_) {
            K = "[unable to stringify input]"
        }
        return `Unknown error ${K}`
    }
}
// @from(Ln 117256, Col 4)
VEq = L(() => {
    DG8()
})
// @from(Ln 117260, Col 0)
function kEq(q, K) {
    return gn6(q, K)
}
// @from(Ln 117264, Col 0)
function ZG8(q) {
    return Xw6(q)
}
// @from(Ln 117267, Col 4)
fG8
// @from(Ln 117267, Col 9)
dn6
// @from(Ln 117268, Col 4)
Xq6 = L(() => {
    DG8();
    TEq();
    VEq();
    fG8 = tT6, dn6 = tT6
})
// @from(Ln 117275, Col 0)
function vk1(q) {
    return typeof q[NEq] === "function"
}
// @from(Ln 117279, Col 0)
function EEq(q) {
    if (vk1(q)) return q[NEq]();
    else return q
}
// @from(Ln 117283, Col 4)
NEq
// @from(Ln 117284, Col 4)
yEq = L(() => {
    NEq = Symbol("rawContent")
})
// @from(Ln 117288, Col 0)
function LEq() {
    let q = Jk1();
    return {
        name: Tk1,
        sendRequest: async (K, _) => {
            if (K.multipartBody) {
                for (let z of K.multipartBody.parts)
                    if (vk1(z.body)) z.body = EEq(z.body)
            }
            return q.sendRequest(K, _)
        }
    }
}
// @from(Ln 117301, Col 4)
Tk1
// @from(Ln 117302, Col 4)
hEq = L(() => {
    WB();
    yEq();
    Tk1 = JG8
})
// @from(Ln 117308, Col 0)
function REq() {
    return lV1()
}
// @from(Ln 117311, Col 4)
SEq = L(() => {
    WB()
})
// @from(Ln 117315, Col 0)
function CEq(q = {}) {
    return eV1(q)
}
// @from(Ln 117318, Col 4)
bEq = L(() => {
    WB()
})
// @from(Ln 117322, Col 0)
function IEq() {
    return Ok1()
}
// @from(Ln 117325, Col 4)
xEq = L(() => {
    WB()
})
// @from(Ln 117329, Col 0)
function uEq(q, K) {
    return Pk1(q, K)
}
// @from(Ln 117332, Col 4)
mEq = L(() => {
    WB()
})
// @from(Ln 117336, Col 0)
function BEq(q = "x-ms-client-request-id") {
    return {
        name: "setClientRequestIdPolicy",
        async sendRequest(K, _) {
            if (!K.headers.has(q)) K.headers.set(q, K.requestId);
            return _(K)
        }
    }
}
// @from(Ln 117346, Col 0)
function pEq(q) {
    return cV1(q)
}
// @from(Ln 117349, Col 4)
FEq = L(() => {
    WB()
})
// @from(Ln 117353, Col 0)
function gEq(q) {
    return Dk1(q)
}
// @from(Ln 117356, Col 4)
UEq = L(() => {
    WB()
})
// @from(Ln 117360, Col 0)
function QEq(q = {}) {
    let K = new cn6(q.parentContext);
    if (q.span) K = K.setValue(zV6.span, q.span);
    if (q.namespace) K = K.setValue(zV6.namespace, q.namespace);
    return K
}
// @from(Ln 117366, Col 0)
class cn6 {
    constructor(q) {
        this._contextMap = q instanceof cn6 ? new Map(q._contextMap) : new Map
    }
    setValue(q, K) {
        let _ = new cn6(this);
        return _._contextMap.set(q, K), _
    }
    getValue(q) {
        return this._contextMap.get(q)
    }
    deleteValue(q) {
        let K = new cn6(this);
        return K._contextMap.delete(q), K
    }
}
// @from(Ln 117382, Col 4)
zV6
// @from(Ln 117383, Col 4)
Vk1 = L(() => {
    zV6 = {
        span: Symbol.for("@azure/core-tracing span"),
        namespace: Symbol.for("@azure/core-tracing namespace")
    }
})
// @from(Ln 117389, Col 4)
lEq = p((dEq) => {
    Object.defineProperty(dEq, "__esModule", {
        value: !0
    });
    dEq.state = void 0;
    dEq.state = {
        instrumenterImplementation: void 0
    }
})
// @from(Ln 117398, Col 4)
nEq
// @from(Ln 117398, Col 9)
GG8
// @from(Ln 117399, Col 4)
iEq = L(() => {
    nEq = K6(lEq(), 1), GG8 = nEq.state
})
// @from(Ln 117403, Col 0)
function jr9() {
    return {
        end: () => {},
        isRecording: () => !1,
        recordException: () => {},
        setAttribute: () => {},
        setStatus: () => {},
        addEvent: () => {}
    }
}
// @from(Ln 117414, Col 0)
function Hr9() {
    return {
        createRequestHeaders: () => {
            return {}
        },
        parseTraceparentHeader: () => {
            return
        },
        startSpan: (q, K) => {
            return {
                span: jr9(),
                tracingContext: QEq({
                    parentContext: K.tracingContext
                })
            }
        },
        withContext(q, K, ..._) {
            return K(..._)
        }
    }
}
// @from(Ln 117436, Col 0)
function ln6() {
    if (!GG8.instrumenterImplementation) GG8.instrumenterImplementation = Hr9();
    return GG8.instrumenterImplementation
}
// @from(Ln 117440, Col 4)
rEq = L(() => {
    Vk1();
    iEq()
})
// @from(Ln 117445, Col 0)
function nn6(q) {
    let {
        namespace: K,
        packageName: _,
        packageVersion: z
    } = q;

    function Y(j, H, J) {
        var X;
        let M = ln6().startSpan(j, Object.assign(Object.assign({}, J), {
                packageName: _,
                packageVersion: z,
                tracingContext: (X = H === null || H === void 0 ? void 0 : H.tracingOptions) === null || X === void 0 ? void 0 : X.tracingContext
            })),
            P = M.tracingContext,
            W = M.span;
        if (!P.getValue(zV6.namespace)) P = P.setValue(zV6.namespace, K);
        W.setAttribute("az.namespace", P.getValue(zV6.namespace));
        let D = Object.assign({}, H, {
            tracingOptions: Object.assign(Object.assign({}, H === null || H === void 0 ? void 0 : H.tracingOptions), {
                tracingContext: P
            })
        });
        return {
            span: W,
            updatedOptions: D
        }
    }
    async function A(j, H, J, X) {
        let {
            span: M,
            updatedOptions: P
        } = Y(j, H, X);
        try {
            let W = await O(P.tracingOptions.tracingContext, () => Promise.resolve(J(P, M)));
            return M.setStatus({
                status: "success"
            }), W
        } catch (W) {
            throw M.setStatus({
                status: "error",
                error: W
            }), W
        } finally {
            M.end()
        }
    }

    function O(j, H, ...J) {
        return ln6().withContext(j, H, ...J)
    }

    function w(j) {
        return ln6().parseTraceparentHeader(j)
    }

    function $(j) {
        return ln6().createRequestHeaders(j)
    }
    return {
        startSpan: Y,
        withSpan: A,
        withContext: O,
        parseTraceparentHeader: w,
        createRequestHeaders: $
    }
}
// @from(Ln 117512, Col 4)
oEq = L(() => {
    rEq();
    Vk1()
})
// @from(Ln 117516, Col 4)
kk1 = L(() => {
    oEq()
})
// @from(Ln 117520, Col 0)
function in6(q) {
    return FV1(q)
}
// @from(Ln 117523, Col 4)
YV6
// @from(Ln 117524, Col 4)
vG8 = L(() => {
    sT6();
    YV6 = SE
})
// @from(Ln 117529, Col 0)
function aEq(q = {}) {
    let K = WG8(q.userAgentPrefix),
        _ = new RQ({
            additionalAllowedQueryParameters: q.additionalAllowedQueryParameters
        }),
        z = Xr9();
    return {
        name: Jr9,
        async sendRequest(Y, A) {
            var O;
            if (!z) return A(Y);
            let w = await K,
                $ = {
                    "http.url": _.sanitizeUrl(Y.url),
                    "http.method": Y.method,
                    "http.user_agent": w,
                    requestId: Y.requestId
                };
            if (w) $["http.user_agent"] = w;
            let {
                span: j,
                tracingContext: H
            } = (O = Mr9(z, Y, $)) !== null && O !== void 0 ? O : {};
            if (!j || !H) return A(Y);
            try {
                let J = await z.withContext(H, A, Y);
                return Wr9(j, J), J
            } catch (J) {
                throw Pr9(j, J), J
            }
        }
    }
}
// @from(Ln 117563, Col 0)
function Xr9() {
    try {
        return nn6({
            namespace: "",
            packageName: "@azure/core-rest-pipeline",
            packageVersion: PG8
        })
    } catch (q) {
        ko.warning(`Error when creating the TracingClient: ${_V6(q)}`);
        return
    }
}
// @from(Ln 117576, Col 0)
function Mr9(q, K, _) {
    try {
        let {
            span: z,
            updatedOptions: Y
        } = q.startSpan(`HTTP ${K.method}`, {
            tracingOptions: K.tracingOptions
        }, {
            spanKind: "client",
            spanAttributes: _
        });
        if (!z.isRecording()) {
            z.end();
            return
        }
        let A = q.createRequestHeaders(Y.tracingOptions.tracingContext);
        for (let [O, w] of Object.entries(A)) K.headers.set(O, w);
        return {
            span: z,
            tracingContext: Y.tracingOptions.tracingContext
        }
    } catch (z) {
        ko.warning(`Skipping creating a tracing span due to an error: ${_V6(z)}`);
        return
    }
}
// @from(Ln 117603, Col 0)
function Pr9(q, K) {
    try {
        if (q.setStatus({
                status: "error",
                error: ZG8(K) ? K : void 0
            }), in6(K) && K.statusCode) q.setAttribute("http.status_code", K.statusCode);
        q.end()
    } catch (_) {
        ko.warning(`Skipping tracing span processing due to an error: ${_V6(_)}`)
    }
}
// @from(Ln 117615, Col 0)
function Wr9(q, K) {
    try {
        q.setAttribute("http.status_code", K.status);
        let _ = K.headers.get("x-ms-request-id");
        if (_) q.setAttribute("serviceRequestId", _);
        if (K.status >= 400) q.setStatus({
            status: "error"
        });
        q.end()
    } catch (_) {
        ko.warning(`Skipping tracing span processing due to an error: ${_V6(_)}`)
    }
}
// @from(Ln 117628, Col 4)
Jr9 = "tracingPolicy"
// @from(Ln 117629, Col 4)
sEq = L(() => {
    kk1();
    Zk1();
    jG8();
    Xq6();
    vG8();
    DG8()
})
// @from(Ln 117638, Col 0)
function TG8(q) {
    if (q instanceof AbortSignal) return {
        abortSignal: q
    };
    if (q.aborted) return {
        abortSignal: AbortSignal.abort(q.reason)
    };
    let K = new AbortController,
        _ = !0;

    function z() {
        if (_) q.removeEventListener("abort", Y), _ = !1
    }

    function Y() {
        K.abort(q.reason), z()
    }
    return q.addEventListener("abort", Y), {
        abortSignal: K.signal,
        cleanup: z
    }
}
// @from(Ln 117661, Col 0)
function tEq() {
    return {
        name: Dr9,
        sendRequest: async (q, K) => {
            if (!q.abortSignal) return K(q);
            let {
                abortSignal: _,
                cleanup: z
            } = TG8(q.abortSignal);
            q.abortSignal = _;
            try {
                return await K(q)
            } finally {
                z === null || z === void 0 || z()
            }
        }
    }
}
// @from(Ln 117679, Col 4)
Dr9 = "wrapAbortSignalLikePolicy"
// @from(Ln 117680, Col 4)
eEq = () => {}
// @from(Ln 117682, Col 0)
function Nk1(q) {
    var K;
    let _ = Fn6();
    if (dn6) {
        if (q.agent) _.addPolicy(pEq(q.agent));
        if (q.tlsOptions) _.addPolicy(gEq(q.tlsOptions));
        _.addPolicy(uEq(q.proxyOptions)), _.addPolicy(REq())
    }
    if (_.addPolicy(tEq()), _.addPolicy(IEq(), {
            beforePolicies: [Tk1]
        }), _.addPolicy(DEq(q.userAgentOptions)), _.addPolicy(BEq((K = q.telemetryOptions) === null || K === void 0 ? void 0 : K.clientRequestIdHeaderName)), _.addPolicy(LEq(), {
            afterPhase: "Deserialize"
        }), _.addPolicy(CEq(q.retryOptions), {
            phase: "Retry"
        }), _.addPolicy(aEq(Object.assign(Object.assign({}, q.userAgentOptions), q.loggingOptions)), {
            afterPhase: "Retry"
        }), dn6) _.addPolicy($Eq(q.redirectOptions), {
        afterPhase: "Retry"
    });
    return _.addPolicy(OEq(q.loggingOptions), {
        afterPhase: "Sign"
    }), _
}
// @from(Ln 117705, Col 4)
qyq = L(() => {
    wEq();
    dV1();
    jEq();
    ZEq();
    hEq();
    SEq();
    bEq();
    xEq();
    Xq6();
    mEq();
    FEq();
    UEq();
    sEq();
    eEq()
})
// @from(Ln 117722, Col 0)
function Ek1() {
    let q = QV1();
    return {
        async sendRequest(K) {
            let {
                abortSignal: _,
                cleanup: z
            } = K.abortSignal ? TG8(K.abortSignal) : {};
            try {
                return K.abortSignal = _, await q.sendRequest(K)
            } finally {
                z === null || z === void 0 || z()
            }
        }
    }
}
// @from(Ln 117738, Col 4)
Kyq = L(() => {
    sT6()
})
// @from(Ln 117742, Col 0)
function No(q) {
    return hQ(q)
}
// @from(Ln 117745, Col 4)
_yq = L(() => {
    sT6()
})
// @from(Ln 117749, Col 0)
function nh(q) {
    return uV1(q)
}
// @from(Ln 117752, Col 4)
zyq = L(() => {
    sT6()
})
// @from(Ln 117756, Col 0)
function yk1(q, K = {
    maxRetries: MEq
}) {
    return Qn6(q, Object.assign({
        logger: Zr9
    }, K))
}
// @from(Ln 117763, Col 4)
Zr9
// @from(Ln 117764, Col 4)
Yyq = L(() => {
    Jw6();
    WB();
    Zr9 = Hq6("core-rest-pipeline retryPolicy")
})
// @from(Ln 117769, Col 0)
async function Gr9(q, K, _) {
    async function z() {
        if (Date.now() < _) try {
            return await q()
        } catch (A) {
            return null
        } else {
            let A = await q();
            if (A === null) throw Error("Failed to refresh access token.");
            return A
        }
    }
    let Y = await z();
    while (Y === null) await Gk1(K), Y = await z();
    return Y
}
// @from(Ln 117786, Col 0)
function Ayq(q, K) {
    let _ = null,
        z = null,
        Y, A = Object.assign(Object.assign({}, fr9), K),
        O = {
            get isRefreshing() {
                return _ !== null
            },
            get shouldRefresh() {
                var $;
                if (O.isRefreshing) return !1;
                if ((z === null || z === void 0 ? void 0 : z.refreshAfterTimestamp) && z.refreshAfterTimestamp < Date.now()) return !0;
                return (($ = z === null || z === void 0 ? void 0 : z.expiresOnTimestamp) !== null && $ !== void 0 ? $ : 0) - A.refreshWindowInMs < Date.now()
            },
            get mustRefresh() {
                return z === null || z.expiresOnTimestamp - A.forcedRefreshWindowInMs < Date.now()
            }
        };

    function w($, j) {
        var H;
        if (!O.isRefreshing) _ = Gr9(() => q.getToken($, j), A.retryIntervalInMs, (H = z === null || z === void 0 ? void 0 : z.expiresOnTimestamp) !== null && H !== void 0 ? H : Date.now()).then((X) => {
            return _ = null, z = X, Y = j.tenantId, z
        }).catch((X) => {
            throw _ = null, z = null, Y = void 0, X
        });
        return _
    }
    return async ($, j) => {
        let H = Boolean(j.claims),
            J = Y !== j.tenantId;
        if (H) z = null;
        if (J || H || O.mustRefresh) return w($, j);
        if (O.shouldRefresh) w($, j);
        return z
    }
}
// @from(Ln 117823, Col 4)
fr9
// @from(Ln 117824, Col 4)
Oyq = L(() => {
    Xq6();
    fr9 = {
        forcedRefreshWindowInMs: 1000,
        retryIntervalInMs: 3000,
        refreshWindowInMs: 120000
    }
})
// @from(Ln 117832, Col 0)
async function VG8(q, K) {
    try {
        return [await K(q), void 0]
    } catch (_) {
        if (in6(_) && _.response) return [_.response, _];
        else throw _
    }
}
// @from(Ln 117840, Col 0)
async function vr9(q) {
    let {
        scopes: K,
        getAccessToken: _,
        request: z
    } = q, Y = {
        abortSignal: z.abortSignal,
        tracingOptions: z.tracingOptions,
        enableCae: !0
    }, A = await _(K, Y);
    if (A) q.request.headers.set("Authorization", `Bearer ${A.token}`)
}
// @from(Ln 117853, Col 0)
function wyq(q) {
    return q.status === 401 && q.headers.has("WWW-Authenticate")
}
// @from(Ln 117856, Col 0)
async function $yq(q, K) {
    var _;
    let {
        scopes: z
    } = q, Y = await q.getAccessToken(z, {
        enableCae: !0,
        claims: K
    });
    if (!Y) return !1;
    return q.request.headers.set("Authorization", `${(_=Y.tokenType)!==null&&_!==void 0?_:"Bearer"} ${Y.token}`), !0
}
// @from(Ln 117868, Col 0)
function rn6(q) {
    var K, _, z;
    let {
        credential: Y,
        scopes: A,
        challengeCallbacks: O
    } = q, w = q.logger || ko, $ = {
        authorizeRequest: (_ = (K = O === null || O === void 0 ? void 0 : O.authorizeRequest) === null || K === void 0 ? void 0 : K.bind(O)) !== null && _ !== void 0 ? _ : vr9,
        authorizeRequestOnChallenge: (z = O === null || O === void 0 ? void 0 : O.authorizeRequestOnChallenge) === null || z === void 0 ? void 0 : z.bind(O)
    }, j = Y ? Ayq(Y) : () => Promise.resolve(null);
    return {
        name: Hyq,
        async sendRequest(H, J) {
            if (!H.url.toLowerCase().startsWith("https://")) throw Error("Bearer token authentication is not permitted for non-TLS protected (non-https) URLs.");
            await $.authorizeRequest({
                scopes: Array.isArray(A) ? A : [A],
                request: H,
                getAccessToken: j,
                logger: w
            });
            let X, M, P;
            if ([X, M] = await VG8(H, J), wyq(X)) {
                let W = jyq(X.headers.get("WWW-Authenticate"));
                if (W) {
                    let D;
                    try {
                        D = atob(W)
                    } catch (Z) {
                        return w.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${W}`), X
                    }
                    if (P = await $yq({
                            scopes: Array.isArray(A) ? A : [A],
                            response: X,
                            request: H,
                            getAccessToken: j,
                            logger: w
                        }, D), P)[X, M] = await VG8(H, J)
                } else if ($.authorizeRequestOnChallenge) {
                    if (P = await $.authorizeRequestOnChallenge({
                            scopes: Array.isArray(A) ? A : [A],
                            request: H,
                            response: X,
                            getAccessToken: j,
                            logger: w
                        }), P)[X, M] = await VG8(H, J);
                    if (wyq(X)) {
                        if (W = jyq(X.headers.get("WWW-Authenticate")), W) {
                            let D;
                            try {
                                D = atob(W)
                            } catch (Z) {
                                return w.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${W}`), X
                            }
                            if (P = await $yq({
                                    scopes: Array.isArray(A) ? A : [A],
                                    response: X,
                                    request: H,
                                    getAccessToken: j,
                                    logger: w
                                }, D), P)[X, M] = await VG8(H, J)
                        }
                    }
                }
            }
            if (M) throw M;
            else return X
        }
    }
}
// @from(Ln 117938, Col 0)
function Tr9(q) {
    let K = /(\w+)\s+((?:\w+=(?:"[^"]*"|[^,]*),?\s*)+)/g,
        _ = /(\w+)="([^"]*)"/g,
        z = [],
        Y;
    while ((Y = K.exec(q)) !== null) {
        let A = Y[1],
            O = Y[2],
            w = {},
            $;
        while (($ = _.exec(O)) !== null) w[$[1]] = $[2];
        z.push({
            scheme: A,
            params: w
        })
    }
    return z
}
// @from(Ln 117957, Col 0)
function jyq(q) {
    var K;
    if (!q) return;
    return (K = Tr9(q).find((z) => z.scheme === "Bearer" && z.params.claims && z.params.error === "insufficient_claims")) === null || K === void 0 ? void 0 : K.params.claims
}
// @from(Ln 117962, Col 4)
Hyq = "bearerTokenAuthenticationPolicy"
// @from(Ln 117963, Col 4)
Jyq = L(() => {
    Oyq();
    jG8();
    vG8()
})
// @from(Ln 117968, Col 4)
CQ = L(() => {
    dV1();
    qyq();
    Kyq();
    _yq();
    zyq();
    vG8();
    Yyq();
    Jyq()
})
// @from(Ln 117978, Col 4)
Lk1 = "$"
// @from(Ln 117979, Col 4)
kG8 = "_"
// @from(Ln 117981, Col 0)
function Vr9(q, K) {
    return K !== "Composite" && K !== "Dictionary" && (typeof q === "string" || typeof q === "number" || typeof q === "boolean" || (K === null || K === void 0 ? void 0 : K.match(/^(Date|DateTime|DateTimeRfc1123|UnixTime|ByteArray|Base64Url)$/i)) !== null || q === void 0 || q === null)
}
// @from(Ln 117985, Col 0)
function kr9(q) {
    let K = Object.assign(Object.assign({}, q.headers), q.body);
    if (q.hasNullableType && Object.getOwnPropertyNames(K).length === 0) return q.shouldWrapBody ? {
        body: null
    } : null;
    else return q.shouldWrapBody ? Object.assign(Object.assign({}, q.headers), {
        body: q.body
    }) : K
}
// @from(Ln 117995, Col 0)
function hk1(q, K) {
    var _, z;
    let Y = q.parsedHeaders;
    if (q.request.method === "HEAD") return Object.assign(Object.assign({}, Y), {
        body: q.parsedBody
    });
    let A = K && K.bodyMapper,
        O = Boolean(A === null || A === void 0 ? void 0 : A.nullable),
        w = A === null || A === void 0 ? void 0 : A.type.name;
    if (w === "Stream") return Object.assign(Object.assign({}, Y), {
        blobBody: q.blobBody,
        readableStreamBody: q.readableStreamBody
    });
    let $ = w === "Composite" && A.type.modelProperties || {},
        j = Object.keys($).some((H) => $[H].serializedName === "");
    if (w === "Sequence" || j) {
        let H = (_ = q.parsedBody) !== null && _ !== void 0 ? _ : [];
        for (let J of Object.keys($))
            if ($[J].serializedName) H[J] = (z = q.parsedBody) === null || z === void 0 ? void 0 : z[J];
        if (Y)
            for (let J of Object.keys(Y)) H[J] = Y[J];
        return O && !q.parsedBody && !Y && Object.getOwnPropertyNames($).length === 0 ? null : H
    }
    return kr9({
        body: q.parsedBody,
        headers: Y,
        hasNullableType: O,
        shouldWrapBody: Vr9(q.parsedBody, w)
    })
}
// @from(Ln 118025, Col 4)
Xyq = () => {}
// @from(Ln 118026, Col 4)
Eo
// @from(Ln 118027, Col 4)
NG8 = L(() => {
    Eo = {
        Base64Url: "Base64Url",
        Boolean: "Boolean",
        ByteArray: "ByteArray",
        Composite: "Composite",
        Date: "Date",
        DateTime: "DateTime",
        DateTimeRfc1123: "DateTimeRfc1123",
        Dictionary: "Dictionary",
        Enum: "Enum",
        Number: "Number",
        Object: "Object",
        Sequence: "Sequence",
        String: "String",
        Stream: "Stream",
        TimeSpan: "TimeSpan",
        UnixTime: "UnixTime"
    }
})
// @from(Ln 118047, Col 4)
Wyq = p((Myq) => {
    Object.defineProperty(Myq, "__esModule", {
        value: !0
    });
    Myq.state = void 0;
    Myq.state = {
        operationRequestMap: new WeakMap
    }
})
// @from(Ln 118056, Col 4)
Dyq
// @from(Ln 118056, Col 9)
Rk1
// @from(Ln 118057, Col 4)
Zyq = L(() => {
    Dyq = K6(Wyq(), 1), Rk1 = Dyq.state
})
// @from(Ln 118061, Col 0)
function Mq6(q, K, _) {
    let {
        parameterPath: z,
        mapper: Y
    } = K, A;
    if (typeof z === "string") z = [z];
    if (Array.isArray(z)) {
        if (z.length > 0)
            if (Y.isConstant) A = Y.defaultValue;
            else {
                let O = fyq(q, z);
                if (!O.propertyFound && _) O = fyq(_, z);
                let w = !1;
                if (!O.propertyFound) w = Y.required || z[0] === "options" && z.length === 2;
                A = w ? Y.defaultValue : O.propertyValue
            }
    } else {
        if (Y.required) A = {};
        for (let O in z) {
            let w = Y.type.modelProperties[O],
                $ = z[O],
                j = Mq6(q, {
                    parameterPath: $,
                    mapper: w
                }, _);
            if (j !== void 0) {
                if (!A) A = {};
                A[O] = j
            }
        }
    }
    return A
}
// @from(Ln 118095, Col 0)
function fyq(q, K) {
    let _ = {
            propertyFound: !1
        },
        z = 0;
    for (; z < K.length; ++z) {
        let Y = K[z];
        if (q && Y in q) q = q[Y];
        else break
    }
    if (z === K.length) _.propertyValue = q, _.propertyFound = !0;
    return _
}
// @from(Ln 118109, Col 0)
function Nr9(q) {
    return Gyq in q
}
// @from(Ln 118113, Col 0)
function yo(q) {
    if (Nr9(q)) return yo(q[Gyq]);
    let K = Rk1.operationRequestMap.get(q);
    if (!K) K = {}, Rk1.operationRequestMap.set(q, K);
    return K
}
// @from(Ln 118119, Col 4)
Gyq
// @from(Ln 118120, Col 4)
on6 = L(() => {
    Zyq();
    Gyq = Symbol.for("@azure/core-client original request")
})
// @from(Ln 118125, Col 0)
function vyq(q = {}) {
    var K, _, z, Y, A, O, w;
    let $ = (_ = (K = q.expectedContentTypes) === null || K === void 0 ? void 0 : K.json) !== null && _ !== void 0 ? _ : Er9,
        j = (Y = (z = q.expectedContentTypes) === null || z === void 0 ? void 0 : z.xml) !== null && Y !== void 0 ? Y : yr9,
        H = q.parseXML,
        J = q.serializerOptions,
        X = {
            xml: {
                rootName: (A = J === null || J === void 0 ? void 0 : J.xml.rootName) !== null && A !== void 0 ? A : "",
                includeRoot: (O = J === null || J === void 0 ? void 0 : J.xml.includeRoot) !== null && O !== void 0 ? O : !1,
                xmlCharKey: (w = J === null || J === void 0 ? void 0 : J.xml.xmlCharKey) !== null && w !== void 0 ? w : kG8
            }
        };
    return {
        name: Lr9,
        async sendRequest(M, P) {
            let W = await P(M);
            return Sr9($, j, W, X, H)
        }
    }
}
// @from(Ln 118147, Col 0)
function hr9(q) {
    let K, _ = q.request,
        z = yo(_),
        Y = z === null || z === void 0 ? void 0 : z.operationSpec;
    if (Y)
        if (!(z === null || z === void 0 ? void 0 : z.operationResponseGetter)) K = Y.responses[q.status];
        else K = z === null || z === void 0 ? void 0 : z.operationResponseGetter(Y, q);
    return K
}
// @from(Ln 118157, Col 0)
function Rr9(q) {
    let K = q.request,
        _ = yo(K),
        z = _ === null || _ === void 0 ? void 0 : _.shouldDeserialize,
        Y;
    if (z === void 0) Y = !0;
    else if (typeof z === "boolean") Y = z;
    else Y = z(q);
    return Y
}
// @from(Ln 118167, Col 0)
async function Sr9(q, K, _, z, Y) {
    let A = await Ir9(q, K, _, z, Y);
    if (!Rr9(A)) return A;
    let O = yo(A.request),
        w = O === null || O === void 0 ? void 0 : O.operationSpec;
    if (!w || !w.responses) return A;
    let $ = hr9(A),
        {
            error: j,
            shouldReturnResponse: H
        } = br9(A, w, $, z);
    if (j) throw j;
    else if (H) return A;
    if ($) {
        if ($.bodyMapper) {
            let J = A.parsedBody;
            if (w.isXML && $.bodyMapper.type.name === Eo.Sequence) J = typeof J === "object" ? J[$.bodyMapper.xmlElementName] : [];
            try {
                A.parsedBody = w.serializer.deserialize($.bodyMapper, J, "operationRes.parsedBody", z)
            } catch (X) {
                throw new YV6(`Error ${X} occurred in deserializing the responseBody - ${A.bodyAsText}`, {
                    statusCode: A.status,
                    request: A.request,
                    response: A
                })
            }
        } else if (w.httpMethod === "HEAD") A.parsedBody = _.status >= 200 && _.status < 300;
        if ($.headersMapper) A.parsedHeaders = w.serializer.deserialize($.headersMapper, A.headers.toJSON(), "operationRes.parsedHeaders", {
            xml: {},
            ignoreUnknownProperties: !0
        })
    }
    return A
}
// @from(Ln 118202, Col 0)
function Cr9(q) {
    let K = Object.keys(q.responses);
    return K.length === 0 || K.length === 1 && K[0] === "default"
}
// @from(Ln 118207, Col 0)
function br9(q, K, _, z) {
    var Y, A, O, w, $;
    let j = 200 <= q.status && q.status < 300;
    if (Cr9(K) ? j : !!_)
        if (_) {
            if (!_.isError) return {
                error: null,
                shouldReturnResponse: !1
            }
        } else return {
            error: null,
            shouldReturnResponse: !1
        };
    let J = _ !== null && _ !== void 0 ? _ : K.responses.default,
        X = ((Y = q.request.streamResponseStatusCodes) === null || Y === void 0 ? void 0 : Y.has(q.status)) ? `Unexpected status code: ${q.status}` : q.bodyAsText,
        M = new YV6(X, {
            statusCode: q.status,
            request: q.request,
            response: q
        });
    if (!J && !(((O = (A = q.parsedBody) === null || A === void 0 ? void 0 : A.error) === null || O === void 0 ? void 0 : O.code) && (($ = (w = q.parsedBody) === null || w === void 0 ? void 0 : w.error) === null || $ === void 0 ? void 0 : $.message))) throw M;
    let P = J === null || J === void 0 ? void 0 : J.bodyMapper,
        W = J === null || J === void 0 ? void 0 : J.headersMapper;
    try {
        if (q.parsedBody) {
            let D = q.parsedBody,
                Z;
            if (P) {
                let f = D;
                if (K.isXML && P.type.name === Eo.Sequence) {
                    f = [];
                    let v = P.xmlElementName;
                    if (typeof D === "object" && v) f = D[v]
                }
                Z = K.serializer.deserialize(P, f, "error.response.parsedBody", z)
            }
            let G = D.error || Z || D;
            if (M.code = G.code, G.message) M.message = G.message;
            if (P) M.response.parsedBody = Z
        }
        if (q.headers && W) M.response.parsedHeaders = K.serializer.deserialize(W, q.headers.toJSON(), "operationRes.parsedHeaders")
    } catch (D) {
        M.message = `Error "${D.message}" occurred in deserializing the responseBody - "${q.bodyAsText}" for the default response.`
    }
    return {
        error: M,
        shouldReturnResponse: !1
    }
}
// @from(Ln 118256, Col 0)
async function Ir9(q, K, _, z, Y) {
    var A;
    if (!((A = _.request.streamResponseStatusCodes) === null || A === void 0 ? void 0 : A.has(_.status)) && _.bodyAsText) {
        let O = _.bodyAsText,
            w = _.headers.get("Content-Type") || "",
            $ = !w ? [] : w.split(";").map((j) => j.toLowerCase());
        try {
            if ($.length === 0 || $.some((j) => q.indexOf(j) !== -1)) return _.parsedBody = JSON.parse(O), _;
            else if ($.some((j) => K.indexOf(j) !== -1)) {
                if (!Y) throw Error("Parsing XML not supported.");
                let j = await Y(O, z.xml);
                return _.parsedBody = j, _
            }
        } catch (j) {
            let H = `Error "${j}" occurred while parsing the response body - ${_.bodyAsText}.`,
                J = j.code || YV6.PARSE_ERROR;
            throw new YV6(H, {
                code: J,
                statusCode: _.status,
                request: _.request,
                response: _
            })
        }
    }
    return _
}
// @from(Ln 118282, Col 4)
Er9
// @from(Ln 118282, Col 9)
yr9
// @from(Ln 118282, Col 14)
Lr9 = "deserializationPolicy"
// @from(Ln 118283, Col 4)
Tyq = L(() => {
    CQ();
    NG8();
    on6();
    Er9 = ["application/json", "text/json"], yr9 = ["application/xml", "application/atom+xml"]
})
// @from(Ln 118290, Col 0)
function Vyq(q) {
    let K = new Set;
    for (let _ in q.responses) {
        let z = q.responses[_];
        if (z.bodyMapper && z.bodyMapper.type.name === Eo.Stream) K.add(Number(_))
    }
    return K
}
// @from(Ln 118299, Col 0)
function bQ(q) {
    let {
        parameterPath: K,
        mapper: _
    } = q, z;
    if (typeof K === "string") z = K;
    else if (Array.isArray(K)) z = K.join(".");
    else z = _.serializedName;
    return z
}
// @from(Ln 118309, Col 4)
EG8 = L(() => {
    NG8()
})
// @from(Ln 118313, Col 0)
function kyq(q = {}) {
    let K = q.stringifyXML;
    return {
        name: xr9,
        async sendRequest(_, z) {
            let Y = yo(_),
                A = Y === null || Y === void 0 ? void 0 : Y.operationSpec,
                O = Y === null || Y === void 0 ? void 0 : Y.operationArguments;
            if (A && O) ur9(_, O, A), mr9(_, O, A, K);
            return z(_)
        }
    }
}
// @from(Ln 118327, Col 0)
function ur9(q, K, _) {
    var z, Y;
    if (_.headerParameters)
        for (let O of _.headerParameters) {
            let w = Mq6(K, O);
            if (w !== null && w !== void 0 || O.mapper.required) {
                w = _.serializer.serialize(O.mapper, w, bQ(O));
                let $ = O.mapper.headerCollectionPrefix;
                if ($)
                    for (let j of Object.keys(w)) q.headers.set($ + j, w[j]);
                else q.headers.set(O.mapper.serializedName || bQ(O), w)
            }
        }
    let A = (Y = (z = K.options) === null || z === void 0 ? void 0 : z.requestOptions) === null || Y === void 0 ? void 0 : Y.customHeaders;
    if (A)
        for (let O of Object.keys(A)) q.headers.set(O, A[O])
}
// @from(Ln 118345, Col 0)
function mr9(q, K, _, z = function() {
    throw Error("XML serialization unsupported!")
}) {
    var Y, A, O, w, $;
    let j = (Y = K.options) === null || Y === void 0 ? void 0 : Y.serializerOptions,
        H = {
            xml: {
                rootName: (A = j === null || j === void 0 ? void 0 : j.xml.rootName) !== null && A !== void 0 ? A : "",
                includeRoot: (O = j === null || j === void 0 ? void 0 : j.xml.includeRoot) !== null && O !== void 0 ? O : !1,
                xmlCharKey: (w = j === null || j === void 0 ? void 0 : j.xml.xmlCharKey) !== null && w !== void 0 ? w : kG8
            }
        },
        J = H.xml.xmlCharKey;
    if (_.requestBody && _.requestBody.mapper) {
        q.body = Mq6(K, _.requestBody);
        let X = _.requestBody.mapper,
            {
                required: M,
                serializedName: P,
                xmlName: W,
                xmlElementName: D,
                xmlNamespace: Z,
                xmlNamespacePrefix: G,
                nullable: f
            } = X,
            v = X.type.name;
        try {
            if (q.body !== void 0 && q.body !== null || f && q.body === null || M) {
                let V = bQ(_.requestBody);
                q.body = _.serializer.serialize(X, q.body, V, H);
                let k = v === Eo.Stream;
                if (_.isXML) {
                    let N = G ? `xmlns:${G}` : "xmlns",
                        R = Br9(Z, N, v, q.body, H);
                    if (v === Eo.Sequence) q.body = z(pr9(R, D || W || P, N, Z), {
                        rootName: W || P,
                        xmlCharKey: J
                    });
                    else if (!k) q.body = z(R, {
                        rootName: W || P,
                        xmlCharKey: J
                    })
                } else if (v === Eo.String && ((($ = _.contentType) === null || $ === void 0 ? void 0 : $.match("text/plain")) || _.mediaType === "text")) return;
                else if (!k) q.body = JSON.stringify(q.body)
            }
        } catch (V) {
            throw Error(`Error "${V.message}" occurred in serializing the payload - ${JSON.stringify(P,void 0,"  ")}.`)
        }
    } else if (_.formDataParameters && _.formDataParameters.length > 0) {
        q.formData = {};
        for (let X of _.formDataParameters) {
            let M = Mq6(K, X);
            if (M !== void 0 && M !== null) {
                let P = X.mapper.serializedName || bQ(X);
                q.formData[P] = _.serializer.serialize(X.mapper, M, bQ(X), H)
            }
        }
    }
}
// @from(Ln 118405, Col 0)
function Br9(q, K, _, z, Y) {
    if (q && !["Composite", "Sequence", "Dictionary"].includes(_)) {
        let A = {};
        return A[Y.xml.xmlCharKey] = z, A[Lk1] = {
            [K]: q
        }, A
    }
    return z
}
// @from(Ln 118415, Col 0)
function pr9(q, K, _, z) {
    if (!Array.isArray(q)) q = [q];
    if (!_ || !z) return {
        [K]: q
    };
    let Y = {
        [K]: q
    };
    return Y[Lk1] = {
        [_]: z
    }, Y
}
// @from(Ln 118427, Col 4)
xr9 = "serializationPolicy"
// @from(Ln 118428, Col 4)
Nyq = L(() => {
    on6();
    NG8();
    EG8()
})
// @from(Ln 118434, Col 0)
function Eyq(q = {}) {
    let K = Nk1(q !== null && q !== void 0 ? q : {});
    if (q.credentialOptions) K.addPolicy(rn6({
        credential: q.credentialOptions.credential,
        scopes: q.credentialOptions.credentialScopes
    }));
    return K.addPolicy(kyq(q.serializationOptions), {
        phase: "Serialize"
    }), K.addPolicy(vyq(q.deserializationOptions), {
        phase: "Deserialize"
    }), K
}
// @from(Ln 118446, Col 4)
yyq = L(() => {
    Tyq();
    CQ();
    Nyq()
})
// @from(Ln 118452, Col 0)
function Lyq() {
    if (!Sk1) Sk1 = Ek1();
    return Sk1
}
// @from(Ln 118456, Col 4)
Sk1
// @from(Ln 118457, Col 4)
hyq = L(() => {
    CQ()
})
// @from(Ln 118461, Col 0)
function Syq(q, K, _, z) {
    let Y = gr9(K, _, z),
        A = !1,
        O = Ryq(q, Y);
    if (K.path) {
        let j = Ryq(K.path, Y);
        if (K.path === "/{nextLink}" && j.startsWith("/")) j = j.substring(1);
        if (Ur9(j)) O = j, A = !0;
        else O = Qr9(O, j)
    }
    let {
        queryParams: w,
        sequenceParams: $
    } = dr9(K, _, z);
    return O = lr9(O, w, $, A), O
}
// @from(Ln 118478, Col 0)
function Ryq(q, K) {
    let _ = q;
    for (let [z, Y] of K) _ = _.split(z).join(Y);
    return _
}
// @from(Ln 118484, Col 0)
function gr9(q, K, _) {
    var z;
    let Y = new Map;
    if ((z = q.urlParameters) === null || z === void 0 ? void 0 : z.length)
        for (let A of q.urlParameters) {
            let O = Mq6(K, A, _),
                w = bQ(A);
            if (O = q.serializer.serialize(A.mapper, O, w), !A.skipEncoding) O = encodeURIComponent(O);
            Y.set(`{${A.mapper.serializedName||w}}`, O)
        }
    return Y
}
// @from(Ln 118497, Col 0)
function Ur9(q) {
    return q.includes("://")
}
// @from(Ln 118501, Col 0)
function Qr9(q, K) {
    if (!K) return q;
    let _ = new URL(q),
        z = _.pathname;
    if (!z.endsWith("/")) z = `${z}/`;
    if (K.startsWith("/")) K = K.substring(1);
    let Y = K.indexOf("?");
    if (Y !== -1) {
        let A = K.substring(0, Y),
            O = K.substring(Y + 1);
        if (z = z + A, O) _.search = _.search ? `${_.search}&${O}` : O
    } else z = z + K;
    return _.pathname = z, _.toString()
}
// @from(Ln 118516, Col 0)
function dr9(q, K, _) {
    var z;
    let Y = new Map,
        A = new Set;
    if ((z = q.queryParameters) === null || z === void 0 ? void 0 : z.length)
        for (let O of q.queryParameters) {
            if (O.mapper.type.name === "Sequence" && O.mapper.serializedName) A.add(O.mapper.serializedName);
            let w = Mq6(K, O, _);
            if (w !== void 0 && w !== null || O.mapper.required) {
                w = q.serializer.serialize(O.mapper, w, bQ(O));
                let $ = O.collectionFormat ? Fr9[O.collectionFormat] : "";
                if (Array.isArray(w)) w = w.map((j) => {
                    if (j === null || j === void 0) return "";
                    return j
                });
                if (O.collectionFormat === "Multi" && w.length === 0) continue;
                else if (Array.isArray(w) && (O.collectionFormat === "SSV" || O.collectionFormat === "TSV")) w = w.join($);
                if (!O.skipEncoding)
                    if (Array.isArray(w)) w = w.map((j) => {
                        return encodeURIComponent(j)
                    });
                    else w = encodeURIComponent(w);
                if (Array.isArray(w) && (O.collectionFormat === "CSV" || O.collectionFormat === "Pipes")) w = w.join($);
                Y.set(O.mapper.serializedName || bQ(O), w)
            }
        }
    return {
        queryParams: Y,
        sequenceParams: A
    }
}
// @from(Ln 118548, Col 0)
function cr9(q) {
    let K = new Map;
    if (!q || q[0] !== "?") return K;
    q = q.slice(1);
    let _ = q.split("&");
    for (let z of _) {
        let [Y, A] = z.split("=", 2), O = K.get(Y);
        if (O)
            if (Array.isArray(O)) O.push(A);
            else K.set(Y, [O, A]);
        else K.set(Y, A)
    }
    return K
}
// @from(Ln 118563, Col 0)
function lr9(q, K, _, z = !1) {
    if (K.size === 0) return q;
    let Y = new URL(q),
        A = cr9(Y.search);
    for (let [w, $] of K) {
        let j = A.get(w);
        if (Array.isArray(j))
            if (Array.isArray($)) {
                j.push(...$);
                let H = new Set(j);
                A.set(w, Array.from(H))
            } else j.push($);
        else if (j) {
            if (Array.isArray($)) $.unshift(j);
            else if (_.has(w)) A.set(w, [j, $]);
            if (!z) A.set(w, $)
        } else A.set(w, $)
    }
    let O = [];
    for (let [w, $] of A)
        if (typeof $ === "string") O.push(`${w}=${$}`);
        else if (Array.isArray($))
        for (let j of $) O.push(`${w}=${j}`);
    else O.push(`${w}=${$}`);
    return Y.search = O.length ? `?${O.join("&")}` : "", Y.toString()
}
// @from(Ln 118589, Col 4)
Fr9
// @from(Ln 118590, Col 4)
Cyq = L(() => {
    on6();
    EG8();
    Fr9 = {
        CSV: ",",
        SSV: " ",
        Multi: "Multi",
        TSV: "\t",
        Pipes: "|"
    }
})
// @from(Ln 118601, Col 4)
byq
// @from(Ln 118602, Col 4)
Iyq = L(() => {
    Jw6();
    byq = Hq6("core-client")
})
// @from(Ln 118606, Col 0)
class yG8 {
    constructor(q = {}) {
        var K, _;
        if (this._requestContentType = q.requestContentType, this._endpoint = (K = q.endpoint) !== null && K !== void 0 ? K : q.baseUri, q.baseUri) byq.warning("The baseUri option for SDK Clients has been deprecated, please use endpoint instead.");
        if (this._allowInsecureConnection = q.allowInsecureConnection, this._httpClient = q.httpClient || Lyq(), this.pipeline = q.pipeline || nr9(q), (_ = q.additionalPolicies) === null || _ === void 0 ? void 0 : _.length)
            for (let {
                    policy: z,
                    position: Y
                }
                of q.additionalPolicies) {
                let A = Y === "perRetry" ? "Sign" : void 0;
                this.pipeline.addPolicy(z, {
                    afterPhase: A
                })
            }
    }
    async sendRequest(q) {
        return this.pipeline.sendRequest(this._httpClient, q)
    }
    async sendOperationRequest(q, K) {
        let _ = K.baseUrl || this._endpoint;
        if (!_) throw Error("If operationSpec.baseUrl is not specified, then the ServiceClient must have a endpoint string property that contains the base URL to use.");
        let z = Syq(_, K, q, this),
            Y = nh({
                url: z
            });
        Y.method = K.httpMethod;
        let A = yo(Y);
        A.operationSpec = K, A.operationArguments = q;
        let O = K.contentType || this._requestContentType;
        if (O && K.requestBody) Y.headers.set("Content-Type", O);
        let w = q.options;
        if (w) {
            let $ = w.requestOptions;
            if ($) {
                if ($.timeout) Y.timeout = $.timeout;
                if ($.onUploadProgress) Y.onUploadProgress = $.onUploadProgress;
                if ($.onDownloadProgress) Y.onDownloadProgress = $.onDownloadProgress;
                if ($.shouldDeserialize !== void 0) A.shouldDeserialize = $.shouldDeserialize;
                if ($.allowInsecureConnection) Y.allowInsecureConnection = !0
            }
            if (w.abortSignal) Y.abortSignal = w.abortSignal;
            if (w.tracingOptions) Y.tracingOptions = w.tracingOptions
        }
        if (this._allowInsecureConnection) Y.allowInsecureConnection = !0;
        if (Y.streamResponseStatusCodes === void 0) Y.streamResponseStatusCodes = Vyq(K);
        try {
            let $ = await this.sendRequest(Y),
                j = hk1($, K.responses[$.status]);
            if (w === null || w === void 0 ? void 0 : w.onResponse) w.onResponse($, j);
            return j
        } catch ($) {
            if (typeof $ === "object" && ($ === null || $ === void 0 ? void 0 : $.response)) {
                let j = $.response,
                    H = hk1(j, K.responses[$.statusCode] || K.responses.default);
                if ($.details = H, w === null || w === void 0 ? void 0 : w.onResponse) w.onResponse(j, H, $)
            }
            throw $
        }
    }
}
// @from(Ln 118668, Col 0)
function nr9(q) {
    let K = ir9(q),
        _ = q.credential && K ? {
            credentialScopes: K,
            credential: q.credential
        } : void 0;
    return Eyq(Object.assign(Object.assign({}, q), {
        credentialOptions: _
    }))
}
// @from(Ln 118679, Col 0)
function ir9(q) {
    if (q.credentialScopes) return q.credentialScopes;
    if (q.endpoint) return `${q.endpoint}/.default`;
    if (q.baseUri) return `${q.baseUri}/.default`;
    if (q.credential && !q.credentialScopes) throw Error("When using credentials, the ServiceClientOptions must contain either a endpoint or a credentialScopes. Unable to create a bearerTokenAuthenticationPolicy");
    return
}
// @from(Ln 118686, Col 4)
xyq = L(() => {
    CQ();
    yyq();
    Xyq();
    hyq();
    on6();
    Cyq();
    EG8();
    Iyq()
})
// @from(Ln 118696, Col 4)
uyq = L(() => {
    xyq()
})
// @from(Ln 118700, Col 0)
function myq(q) {
    if (q === "adfs") return "oauth2/token";
    else return "oauth2/v2.0/token"
}
// @from(Ln 118704, Col 4)
_A
// @from(Ln 118705, Col 4)
$f = L(() => {
    LQ();
    kk1();
    _A = nn6({
        namespace: "Microsoft.AAD",
        packageName: "@azure/identity",
        packageVersion: af8
    })
})
// @from(Ln 118715, Col 0)
function an6(q) {
    let K = "";
    if (Array.isArray(q)) {
        if (q.length !== 1) return;
        K = q[0]
    } else if (typeof q === "string") K = q;
    if (!K.endsWith("/.default")) return K;
    return K.substr(0, K.lastIndexOf("/.default"))
}
// @from(Ln 118725, Col 0)
function pyq(q) {
    if (typeof q.expires_on === "number") return q.expires_on * 1000;
    if (typeof q.expires_on === "string") {
        let K = +q.expires_on;
        if (!isNaN(K)) return K * 1000;
        let _ = Date.parse(q.expires_on);
        if (!isNaN(_)) return _
    }
    if (typeof q.expires_in === "number") return Date.now() + q.expires_in * 1000;
    throw Error(`Failed to parse token expiration from body. expires_in="${q.expires_in}", expires_on="${q.expires_on}"`)
}
// @from(Ln 118737, Col 0)
function Fyq(q) {
    if (q.refresh_on) {
        if (typeof q.refresh_on === "number") return q.refresh_on * 1000;
        if (typeof q.refresh_on === "string") {
            let K = +q.refresh_on;
            if (!isNaN(K)) return K * 1000;
            let _ = Date.parse(q.refresh_on);
            if (!isNaN(_)) return _
        }
        throw Error(`Failed to parse refresh_on from body. refresh_on="${q.refresh_on}"`)
    } else return
}
// @from(Ln 118749, Col 4)
Byq = "Specifying a `clientId` or `resourceId` is not supported by the Service Fabric managed identity environment. The managed identity configuration is determined by the Service Fabric cluster resource configuration. See https://aka.ms/servicefabricmi for more information"
// @from(Ln 118751, Col 0)
function rr9(q) {
    let K = q === null || q === void 0 ? void 0 : q.authorityHost;
    if (fG8) K = K !== null && K !== void 0 ? K : process.env.AZURE_AUTHORITY_HOST;
    return K !== null && K !== void 0 ? K : Cn6
}
// @from(Ln 118756, Col 4)
sn6 = "noCorrelationId"
// @from(Ln 118757, Col 4)
IQ
// @from(Ln 118758, Col 4)
tn6 = L(() => {
    uyq();
    Xq6();
    CQ();
    BW();
    LQ();
    $f();
    rw();
    IQ = class IQ extends yG8 {
        constructor(q) {
            var K, _;
            let z = `azsdk-js-identity/${af8}`,
                Y = ((K = q === null || q === void 0 ? void 0 : q.userAgentOptions) === null || K === void 0 ? void 0 : K.userAgentPrefix) ? `${q.userAgentOptions.userAgentPrefix} ${z}` : `${z}`,
                A = rr9(q);
            if (!A.startsWith("https:")) throw Error("The authorityHost address must use the 'https' protocol.");
            super(Object.assign(Object.assign({
                requestContentType: "application/json; charset=utf-8",
                retryOptions: {
                    maxRetries: 3
                }
            }, q), {
                userAgentOptions: {
                    userAgentPrefix: Y
                },
                baseUri: A
            }));
            if (this.allowInsecureConnection = !1, this.authorityHost = A, this.abortControllers = new Map, this.allowLoggingAccountIdentifiers = (_ = q === null || q === void 0 ? void 0 : q.loggingOptions) === null || _ === void 0 ? void 0 : _.allowLoggingAccountIdentifiers, this.tokenCredentialOptions = Object.assign({}, q), q === null || q === void 0 ? void 0 : q.allowInsecureConnection) this.allowInsecureConnection = q.allowInsecureConnection
        }
        async sendTokenRequest(q) {
            RE.info(`IdentityClient: sending token request to [${q.url}]`);
            let K = await this.sendRequest(q);
            if (K.bodyAsText && (K.status === 200 || K.status === 201)) {
                let _ = JSON.parse(K.bodyAsText);
                if (!_.access_token) return null;
                this.logIdentifiers(K);
                let z = {
                    accessToken: {
                        token: _.access_token,
                        expiresOnTimestamp: pyq(_),
                        refreshAfterTimestamp: Fyq(_),
                        tokenType: "Bearer"
                    },
                    refreshToken: _.refresh_token
                };
                return RE.info(`IdentityClient: [${q.url}] token acquired, expires on ${z.accessToken.expiresOnTimestamp}`), z
            } else {
                let _ = new XB(K.status, K.bodyAsText);
                throw RE.warning(`IdentityClient: authentication error. HTTP status: ${K.status}, ${_.errorResponse.errorDescription}`), _
            }
        }
        async refreshAccessToken(q, K, _, z, Y, A = {}) {
            if (z === void 0) return null;
            RE.info(`IdentityClient: refreshing access token with client ID: ${K}, scopes: ${_} started`);
            let O = {
                grant_type: "refresh_token",
                client_id: K,
                refresh_token: z,
                scope: _
            };
            if (Y !== void 0) O.client_secret = Y;
            let w = new URLSearchParams(O);
            return _A.withSpan("IdentityClient.refreshAccessToken", A, async ($) => {
                try {
                    let j = myq(q),
                        H = nh({
                            url: `${this.authorityHost}/${q}/${j}`,
                            method: "POST",
                            body: w.toString(),
                            abortSignal: A.abortSignal,
                            headers: No({
                                Accept: "application/json",
                                "Content-Type": "application/x-www-form-urlencoded"
                            }),
                            tracingOptions: $.tracingOptions
                        }),
                        J = await this.sendTokenRequest(H);
                    return RE.info(`IdentityClient: refreshed token for client ID: ${K}`), J
                } catch (j) {
                    if (j.name === bn6 && j.errorResponse.error === "interaction_required") return RE.info(`IdentityClient: interaction required for client ID: ${K}`), null;
                    else throw RE.warning(`IdentityClient: failed refreshing token for client ID: ${K}: ${j}`), j
                }
            })
        }
        generateAbortSignal(q) {
            let K = new AbortController,
                _ = this.abortControllers.get(q) || [];
            _.push(K), this.abortControllers.set(q, _);
            let z = K.signal.onabort;
            return K.signal.onabort = (...Y) => {
                if (this.abortControllers.set(q, void 0), z) z.apply(K.signal, Y)
            }, K.signal
        }
        abortRequests(q) {
            let K = q || sn6,
                _ = [...this.abortControllers.get(K) || [], ...this.abortControllers.get(sn6) || []];
            if (!_.length) return;
            for (let z of _) z.abort();
            this.abortControllers.set(K, void 0)
        }
        getCorrelationId(q) {
            var K;
            let _ = (K = q === null || q === void 0 ? void 0 : q.body) === null || K === void 0 ? void 0 : K.split("&").map((z) => z.split("=")).find(([z]) => z === "client-request-id");
            return _ && _.length ? _[1] || sn6 : sn6
        }
        async sendGetRequestAsync(q, K) {
            let _ = nh({
                    url: q,
                    method: "GET",
                    body: K === null || K === void 0 ? void 0 : K.body,
                    allowInsecureConnection: this.allowInsecureConnection,
                    headers: No(K === null || K === void 0 ? void 0 : K.headers),
                    abortSignal: this.generateAbortSignal(sn6)
                }),
                z = await this.sendRequest(_);
            return this.logIdentifiers(z), {
                body: z.bodyAsText ? JSON.parse(z.bodyAsText) : void 0,
                headers: z.headers.toJSON(),
                status: z.status
            }
        }
        async sendPostRequestAsync(q, K) {
            let _ = nh({
                    url: q,
                    method: "POST",
                    body: K === null || K === void 0 ? void 0 : K.body,
                    headers: No(K === null || K === void 0 ? void 0 : K.headers),
                    allowInsecureConnection: this.allowInsecureConnection,
                    abortSignal: this.generateAbortSignal(this.getCorrelationId(K))
                }),
                z = await this.sendRequest(_);
            return this.logIdentifiers(z), {
                body: z.bodyAsText ? JSON.parse(z.bodyAsText) : void 0,
                headers: z.headers.toJSON(),
                status: z.status
            }
        }
        getTokenCredentialOptions() {
            return this.tokenCredentialOptions
        }
        logIdentifiers(q) {
            if (!this.allowLoggingAccountIdentifiers || !q.bodyAsText) return;
            let K = "No User Principal Name available";
            try {
                let z = (q.parsedBody || JSON.parse(q.bodyAsText)).access_token;
                if (!z) return;
                let Y = z.split(".")[1],
                    {
                        appid: A,
                        upn: O,
                        tid: w,
                        oid: $
                    } = JSON.parse(Buffer.from(Y, "base64").toString("utf8"));
                RE.info(`[Authenticated account] Client ID: ${A}. Tenant ID: ${w}. User Principal Name: ${O||K}. Object ID (user): ${$}`)
            } catch (_) {
                RE.warning("allowLoggingAccountIdentifiers was set, but we couldn't log the account information. Error:", _.message)
            }
        }
    }
})
// @from(Ln 118921, Col 0)
function gyq(q) {
    let K = qo9[q];
    if (K) throw new c4(K)
}
// @from(Ln 118926, Col 0)
function Uyq(q) {
    let K = ["User", "settings.json"],
        _ = "Code",
        z = ar9.homedir();

    function Y(...A) {
        let O = sr9.join(...A, "Code", ...K);
        return JSON.parse(or9.readFileSync(O, {
            encoding: "utf8"
        }))[q]
    }
    try {
        let A;
        switch (process.platform) {
            case "win32":
                return A = process.env.APPDATA, A ? Y(A) : void 0;
            case "darwin":
                return Y(z, "Library", "Application Support");
            case "linux":
                return Y(z, ".config");
            default:
                return
        }
    } catch (A) {
        Pw6.info(`Failed to load the Visual Studio Code configuration file. Error: ${A.message}`);
        return
    }
}
// @from(Ln 118954, Col 0)
class bk1 {
    constructor(q) {
        this.cloudName = Uyq("azure.cloud") || "AzureCloud";
        let K = Ko9[this.cloudName];
        if (this.identityClient = new IQ(Object.assign({
                authorityHost: K
            }, q)), q && q.tenantId) vP(Pw6, q.tenantId), this.tenantId = q.tenantId;
        else this.tenantId = tr9;
        this.additionallyAllowedTenantIds = _H(q === null || q === void 0 ? void 0 : q.additionallyAllowedTenants), gyq(this.tenantId)
    }
    async prepare() {
        let q = Uyq("azure.tenant");
        if (q) this.tenantId = q;
        gyq(this.tenantId)
    }
    prepareOnce() {
        if (!this.preparePromise) this.preparePromise = this.prepare();
        return this.preparePromise
    }
    async getToken(q, K) {
        var _, z;
        await this.prepareOnce();
        let Y = Oj(this.tenantId, K, this.additionallyAllowedTenantIds, Pw6) || this.tenantId;
        if (Ck1 === void 0) throw new c4(["No implementation of `VisualStudioCodeCredential` is available.", "You must install the identity-vscode plugin package (`npm install --save-dev @azure/identity-vscode`)", "and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling", "`useIdentityPlugin(vsCodePlugin)` before creating a `VisualStudioCodeCredential`.", "To troubleshoot, visit https://aka.ms/azsdk/js/identity/vscodecredential/troubleshoot."].join(" "));
        let A = typeof q === "string" ? q : q.join(" ");
        if (!A.match(/^[0-9a-zA-Z-.:/]+$/)) {
            let $ = Error("Invalid scope was specified by the user or calling client");
            throw Pw6.getToken.info(YY(q, $)), $
        }
        if (A.indexOf("offline_access") < 0) A += " offline_access";
        let O = await Ck1(),
            {
                password: w
            } = (z = (_ = O.find(({
                account: $
            }) => $ === this.cloudName)) !== null && _ !== void 0 ? _ : O[0]) !== null && z !== void 0 ? z : {};
        if (w) {
            let $ = await this.identityClient.refreshAccessToken(Y, er9, A, w, void 0);
            if ($) return Pw6.getToken.info(GP(q)), $.accessToken;
            else {
                let j = new c4("Could not retrieve the token associated with Visual Studio Code. Have you connected using the 'Azure Account' extension recently? To troubleshoot, visit https://aka.ms/azsdk/js/identity/vscodecredential/troubleshoot.");
                throw Pw6.getToken.info(YY(q, j)), j
            }
        } else {
            let $ = new c4("Could not retrieve the token associated with Visual Studio Code. Did you connect using the 'Azure Account' extension? To troubleshoot, visit https://aka.ms/azsdk/js/identity/vscodecredential/troubleshoot.");
            throw Pw6.getToken.info(YY(q, $)), $
        }
    }
}
// @from(Ln 119003, Col 4)
tr9 = "common"
// @from(Ln 119004, Col 4)
er9 = "aebc6443-996d-45c2-90f0-388ff96faa56"
// @from(Ln 119005, Col 4)
Pw6
// @from(Ln 119005, Col 9)
Ck1 = void 0
// @from(Ln 119006, Col 4)
Qyq
// @from(Ln 119006, Col 9)
qo9
// @from(Ln 119006, Col 14)
Ko9
// @from(Ln 119007, Col 4)
Ik1 = L(() => {
    rw();
    pW();
    LQ();
    BW();
    tn6();
    pW();
    Pw6 = u9("VisualStudioCodeCredential"), Qyq = {
        setVsCodeCredentialFinder(q) {
            Ck1 = q
        }
    }, qo9 = {
        adfs: "The VisualStudioCodeCredential does not support authentication with ADFS tenants."
    };
    Ko9 = {
        AzureCloud: yQ.AzurePublicCloud,
        AzureChina: yQ.AzureChina,
        AzureGermanCloud: yQ.AzureGermany,
        AzureUSGovernment: yQ.AzureGovernment
    }
})
// @from(Ln 119029, Col 0)
function zo9(q) {
    q(_o9)
}
// @from(Ln 119032, Col 4)
_o9
// @from(Ln 119033, Col 4)
dyq = L(() => {
    NV1();
    Ik1();
    _o9 = {
        cachePluginControl: ckq,
        nativeBrokerPluginControl: lkq,
        vsCodeCredentialControl: Qyq
    }
})
// @from(Ln 119042, Col 0)
class Ww6 {
    static serializeJSONBlob(q) {
        return JSON.stringify(q)
    }
    static serializeAccounts(q) {
        let K = {};
        return Object.keys(q).map(function(_) {
            let z = q[_];
            K[_] = {
                home_account_id: z.homeAccountId,
                environment: z.environment,
                realm: z.realm,
                local_account_id: z.localAccountId,
                username: z.username,
                authority_type: z.authorityType,
                name: z.name,
                client_info: z.clientInfo,
                last_modification_time: z.lastModificationTime,
                last_modification_app: z.lastModificationApp,
                tenantProfiles: z.tenantProfiles?.map((Y) => {
                    return JSON.stringify(Y)
                })
            }
        }), K
    }
    static serializeIdTokens(q) {
        let K = {};
        return Object.keys(q).map(function(_) {
            let z = q[_];
            K[_] = {
                home_account_id: z.homeAccountId,
                environment: z.environment,
                credential_type: z.credentialType,
                client_id: z.clientId,
                secret: z.secret,
                realm: z.realm
            }
        }), K
    }
    static serializeAccessTokens(q) {
        let K = {};
        return Object.keys(q).map(function(_) {
            let z = q[_];
            K[_] = {
                home_account_id: z.homeAccountId,
                environment: z.environment,
                credential_type: z.credentialType,
                client_id: z.clientId,
                secret: z.secret,
                realm: z.realm,
                target: z.target,
                cached_at: z.cachedAt,
                expires_on: z.expiresOn,
                extended_expires_on: z.extendedExpiresOn,
                refresh_on: z.refreshOn,
                key_id: z.keyId,
                token_type: z.tokenType,
                requestedClaims: z.requestedClaims,
                requestedClaimsHash: z.requestedClaimsHash,
                userAssertionHash: z.userAssertionHash
            }
        }), K
    }
    static serializeRefreshTokens(q) {
        let K = {};
        return Object.keys(q).map(function(_) {
            let z = q[_];
            K[_] = {
                home_account_id: z.homeAccountId,
                environment: z.environment,
                credential_type: z.credentialType,
                client_id: z.clientId,
                secret: z.secret,
                family_id: z.familyId,
                target: z.target,
                realm: z.realm
            }
        }), K
    }
    static serializeAppMetadata(q) {
        let K = {};
        return Object.keys(q).map(function(_) {
            let z = q[_];
            K[_] = {
                client_id: z.clientId,
                environment: z.environment,
                family_id: z.familyId
            }
        }), K
    }
    static serializeAllCache(q) {
        return {
            Account: this.serializeAccounts(q.accounts),
            IdToken: this.serializeIdTokens(q.idTokens),
            AccessToken: this.serializeAccessTokens(q.accessTokens),
            RefreshToken: this.serializeRefreshTokens(q.refreshTokens),
            AppMetadata: this.serializeAppMetadata(q.appMetadata)
        }
    }
}
// @from(Ln 119142, Col 4)
LG8 = L(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 119144, Col 4)
q7
// @from(Ln 119144, Col 8)
f9
// @from(Ln 119144, Col 12)
Cv
// @from(Ln 119144, Col 16)
xk1
// @from(Ln 119144, Col 21)
y$
// @from(Ln 119144, Col 25)
CE
// @from(Ln 119144, Col 29)
Dw6
// @from(Ln 119144, Col 34)
Pq6
// @from(Ln 119144, Col 39)
hG8
// @from(Ln 119144, Col 44)
AV6
// @from(Ln 119144, Col 49)
xQ
// @from(Ln 119144, Col 53)
bE
// @from(Ln 119144, Col 57)
Zw6
// @from(Ln 119144, Col 62)
Lo
// @from(Ln 119144, Col 66)
dO
// @from(Ln 119144, Col 70)
en6 = "appmetadata"
// @from(Ln 119145, Col 4)
cyq = "client_info"
// @from(Ln 119146, Col 4)
Wq6 = "1"
// @from(Ln 119147, Col 4)
OV6
// @from(Ln 119147, Col 9)
UV
// @from(Ln 119147, Col 13)
FW
// @from(Ln 119147, Col 17)
hz
// @from(Ln 119147, Col 21)
uQ
// @from(Ln 119147, Col 25)
qi6
// @from(Ln 119147, Col 30)
Ki6
// @from(Ln 119147, Col 35)
fw6
// @from(Ln 119147, Col 40)
RG8
// @from(Ln 119147, Col 45)
C2
// @from(Ln 119147, Col 49)
wV6 = 300
// @from(Ln 119148, Col 4)
jf
// @from(Ln 119149, Col 4)
L$ = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */
    q7 = {
        LIBRARY_NAME: "MSAL.JS",
        SKU: "msal.js.common",
        DEFAULT_AUTHORITY: "https://login.microsoftonline.com/common/",
        DEFAULT_AUTHORITY_HOST: "login.microsoftonline.com",
        DEFAULT_COMMON_TENANT: "common",
        ADFS: "adfs",
        DSTS: "dstsv2",
        AAD_INSTANCE_DISCOVERY_ENDPT: "https://login.microsoftonline.com/common/discovery/instance?api-version=1.1&authorization_endpoint=",
        CIAM_AUTH_URL: ".ciamlogin.com",
        AAD_TENANT_DOMAIN_SUFFIX: ".onmicrosoft.com",
        RESOURCE_DELIM: "|",
        NO_ACCOUNT: "NO_ACCOUNT",
        CLAIMS: "claims",
        CONSUMER_UTID: "9188040d-6c67-4c5b-b112-36a304b66dad",
        OPENID_SCOPE: "openid",
        PROFILE_SCOPE: "profile",
        OFFLINE_ACCESS_SCOPE: "offline_access",
        EMAIL_SCOPE: "email",
        CODE_GRANT_TYPE: "authorization_code",
        RT_GRANT_TYPE: "refresh_token",
        S256_CODE_CHALLENGE_METHOD: "S256",
        URL_FORM_CONTENT_TYPE: "application/x-www-form-urlencoded;charset=utf-8",
        AUTHORIZATION_PENDING: "authorization_pending",
        NOT_DEFINED: "not_defined",
        EMPTY_STRING: "",
        NOT_APPLICABLE: "N/A",
        NOT_AVAILABLE: "Not Available",
        FORWARD_SLASH: "/",
        IMDS_ENDPOINT: "http://169.254.169.254/metadata/instance/compute/location",
        IMDS_VERSION: "2020-06-01",
        IMDS_TIMEOUT: 2000,
        AZURE_REGION_AUTO_DISCOVER_FLAG: "TryAutoDetect",
        REGIONAL_AUTH_PUBLIC_CLOUD_SUFFIX: "login.microsoft.com",
        KNOWN_PUBLIC_CLOUDS: ["login.microsoftonline.com", "login.windows.net", "login.microsoft.com", "sts.windows.net"],
        SHR_NONCE_VALIDITY: 240,
        INVALID_INSTANCE: "invalid_instance"
    }, f9 = {
        SUCCESS: 200,
        SUCCESS_RANGE_START: 200,
        SUCCESS_RANGE_END: 299,
        REDIRECT: 302,
        CLIENT_ERROR: 400,
        CLIENT_ERROR_RANGE_START: 400,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
        REQUEST_TIMEOUT: 408,
        GONE: 410,
        TOO_MANY_REQUESTS: 429,
        CLIENT_ERROR_RANGE_END: 499,
        SERVER_ERROR: 500,
        SERVER_ERROR_RANGE_START: 500,
        SERVICE_UNAVAILABLE: 503,
        GATEWAY_TIMEOUT: 504,
        SERVER_ERROR_RANGE_END: 599,
        MULTI_SIDED_ERROR: 600
    }, Cv = [q7.OPENID_SCOPE, q7.PROFILE_SCOPE, q7.OFFLINE_ACCESS_SCOPE], xk1 = [...Cv, q7.EMAIL_SCOPE], y$ = {
        CONTENT_TYPE: "Content-Type",
        CONTENT_LENGTH: "Content-Length",
        RETRY_AFTER: "Retry-After",
        CCS_HEADER: "X-AnchorMailbox",
        WWWAuthenticate: "WWW-Authenticate",
        AuthenticationInfo: "Authentication-Info",
        X_MS_REQUEST_ID: "x-ms-request-id",
        X_MS_HTTP_VERSION: "x-ms-httpver"
    }, CE = {
        COMMON: "common",
        ORGANIZATIONS: "organizations",
        CONSUMERS: "consumers"
    }, Dw6 = {
        ACCESS_TOKEN: "access_token",
        XMS_CC: "xms_cc"
    }, Pq6 = {
        LOGIN: "login",
        SELECT_ACCOUNT: "select_account",
        CONSENT: "consent",
        NONE: "none",
        CREATE: "create",
        NO_SESSION: "no_session"
    }, hG8 = {
        PLAIN: "plain",
        S256: "S256"
    }, AV6 = {
        CODE: "code",
        IDTOKEN_TOKEN: "id_token token",
        IDTOKEN_TOKEN_REFRESHTOKEN: "id_token token refresh_token"
    }, xQ = {
        QUERY: "query",
        FRAGMENT: "fragment",
        FORM_POST: "form_post"
    }, bE = {
        IMPLICIT_GRANT: "implicit",
        AUTHORIZATION_CODE_GRANT: "authorization_code",
        CLIENT_CREDENTIALS_GRANT: "client_credentials",
        RESOURCE_OWNER_PASSWORD_GRANT: "password",
        REFRESH_TOKEN_GRANT: "refresh_token",
        DEVICE_CODE_GRANT: "device_code",
        JWT_BEARER: "urn:ietf:params:oauth:grant-type:jwt-bearer"
    }, Zw6 = {
        MSSTS_ACCOUNT_TYPE: "MSSTS",
        ADFS_ACCOUNT_TYPE: "ADFS",
        MSAV1_ACCOUNT_TYPE: "MSA",
        GENERIC_ACCOUNT_TYPE: "Generic"
    }, Lo = {
        CACHE_KEY_SEPARATOR: "-",
        CLIENT_INFO_SEPARATOR: "."
    }, dO = {
        ID_TOKEN: "IdToken",
        ACCESS_TOKEN: "AccessToken",
        ACCESS_TOKEN_WITH_AUTH_SCHEME: "AccessToken_With_AuthScheme",
        REFRESH_TOKEN: "RefreshToken"
    }, OV6 = {
        CACHE_KEY: "authority-metadata",
        REFRESH_TIME_SECONDS: 86400
    }, UV = {
        CONFIG: "config",
        CACHE: "cache",
        NETWORK: "network",
        HARDCODED_VALUES: "hardcoded_values"
    }, FW = {
        SCHEMA_VERSION: 5,
        MAX_LAST_HEADER_BYTES: 330,
        MAX_CACHED_ERRORS: 50,
        CACHE_KEY: "server-telemetry",
        CATEGORY_SEPARATOR: "|",
        VALUE_SEPARATOR: ",",
        OVERFLOW_TRUE: "1",
        OVERFLOW_FALSE: "0",
        UNKNOWN_ERROR: "unknown_error"
    }, hz = {
        BEARER: "Bearer",
        POP: "pop",
        SSH: "ssh-cert"
    }, uQ = {
        DEFAULT_THROTTLE_TIME_SECONDS: 60,
        DEFAULT_MAX_THROTTLE_TIME_SECONDS: 3600,
        THROTTLING_PREFIX: "throttling",
        X_MS_LIB_CAPABILITY_VALUE: "retry-after, h429"
    }, qi6 = {
        INVALID_GRANT_ERROR: "invalid_grant",
        CLIENT_MISMATCH_ERROR: "client_mismatch"
    }, Ki6 = {
        username: "username",
        password: "password"
    }, fw6 = {
        FAILED_AUTO_DETECTION: "1",
        INTERNAL_CACHE: "2",
        ENVIRONMENT_VARIABLE: "3",
        IMDS: "4"
    }, RG8 = {
        CONFIGURED_NO_AUTO_DETECTION: "2",
        AUTO_DETECTION_REQUESTED_SUCCESSFUL: "4",
        AUTO_DETECTION_REQUESTED_FAILED: "5"
    }, C2 = {
        NOT_APPLICABLE: "0",
        FORCE_REFRESH_OR_CLAIMS: "1",
        NO_CACHED_ACCESS_TOKEN: "2",
        CACHED_ACCESS_TOKEN_EXPIRED: "3",
        PROACTIVELY_REFRESHED: "4"
    }, jf = {
        BASE64: "base64",
        HEX: "hex",
        UTF8: "utf-8"
    }
})
// @from(Ln 119317, Col 4)
$V6 = {}
// @from(Ln 119322, Col 4)
_i6 = "unexpected_error"
// @from(Ln 119323, Col 4)
zi6 = "post_request_failed"
// @from(Ln 119324, Col 4)
uk1 = L(() => {
    /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Ln 119327, Col 0)
function Bk1(q, K) {
    return new G9(q, K ? `${SG8[q]} ${K}` : SG8[q])
}
// @from(Ln 119330, Col 4)
SG8
// @from(Ln 119330, Col 9)
mk1
// @from(Ln 119330, Col 14)
G9
// @from(Ln 119331, Col 4)
lb = L(() => {
    L$();
    uk1(); /*! @azure/msal-common v15.13.1 2025-10-29 */
    SG8 = {
        [_i6]: "Unexpected error in authentication.",
        [zi6]: "Post request failed from the network, could be a 4xx/5xx or a network unavailability. Please check the exact error code for details."
    }, mk1 = {
        unexpectedError: {
            code: _i6,
            desc: SG8[_i6]
        },
        postRequestFailed: {
            code: zi6,
            desc: SG8[zi6]
        }
    };
    G9 = class G9 extends Error {
        constructor(q, K, _) {
            let z = K ? `${q}: ${K}` : q;
            super(z);
            Object.setPrototypeOf(this, G9.prototype), this.errorCode = q || q7.EMPTY_STRING, this.errorMessage = K || q7.EMPTY_STRING, this.subError = _ || q7.EMPTY_STRING, this.name = "AuthError"
        }
        setCorrelationId(q) {
            this.correlationId = q
        }
    }
})
// @from(Ln 119358, Col 4)
ow = {}
// @from(Ln 119405, Col 4)
Dq6 = "client_info_decoding_error"
// @from(Ln 119406, Col 4)
Gw6 = "client_info_empty_error"
// @from(Ln 119407, Col 4)
Zq6 = "token_parsing_error"
// @from(Ln 119408, Col 4)
vw6 = "null_or_empty_token"
// @from(Ln 119409, Col 4)
QV = "endpoints_resolution_error"
// @from(Ln 119410, Col 4)
Tw6 = "network_error"
// @from(Ln 119411, Col 4)
Vw6 = "openid_config_error"
// @from(Ln 119412, Col 4)
kw6 = "hash_not_deserialized"
// @from(Ln 119413, Col 4)
DB = "invalid_state"
// @from(Ln 119414, Col 4)
Nw6 = "state_mismatch"
// @from(Ln 119415, Col 4)
fq6 = "state_not_found"
// @from(Ln 119416, Col 4)
Ew6 = "nonce_mismatch"
// @from(Ln 119417, Col 4)
ho = "auth_time_not_found"
// @from(Ln 119418, Col 4)
yw6 = "max_age_transpired"
// @from(Ln 119419, Col 4)
Yi6 = "multiple_matching_tokens"
// @from(Ln 119420, Col 4)
Ai6 = "multiple_matching_accounts"
// @from(Ln 119421, Col 4)
Lw6 = "multiple_matching_appMetadata"
// @from(Ln 119422, Col 4)
hw6 = "request_cannot_be_made"
// @from(Ln 119423, Col 4)
Rw6 = "cannot_remove_empty_scope"
// @from(Ln 119424, Col 4)
Sw6 = "cannot_append_scopeset"