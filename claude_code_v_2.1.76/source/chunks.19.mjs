
// @from(Ln 50083, Col 4)
Y9 = x((Xw_, MRA) => {
    var LR6 = x6("node:assert"),
        {
            kDestroyed: tLA,
            kBodyUsed: HH6,
            kListeners: wr1,
            kBody: sLA
        } = UO(),
        {
            IncomingMessage: GLK
        } = x6("node:http"),
        K71 = x6("node:stream"),
        fLK = x6("node:net"),
        {
            Blob: TLK
        } = x6("node:buffer"),
        vLK = x6("node:util"),
        {
            stringify: NLK
        } = x6("node:querystring"),
        {
            EventEmitter: VLK
        } = x6("node:events"),
        {
            InvalidArgumentError: gD
        } = mz(),
        {
            headerNameLowerCasedRecord: kLK
        } = A71(),
        {
            tree: eLA
        } = aLA(),
        [ELK, yLK] = process.versions.node.split(".").map((A) => Number(A));
    class Or1 {
        constructor(A) {
            this[sLA] = A, this[HH6] = !1
        }
        async * [Symbol.asyncIterator]() {
            LR6(!this[HH6], "disturbed"), this[HH6] = !0, yield* this[sLA]
        }
    }

    function LLK(A) {
        if (Y71(A)) {
            if (zRA(A) === 0) A.on("data", function() {
                LR6(!1)
            });
            if (typeof A.readableDidRead !== "boolean") A[HH6] = !1, VLK.prototype.on.call(A, "data", function() {
                this[HH6] = !0
            });
            return A
        } else if (A && typeof A.pipeTo === "function") return new Or1(A);
        else if (A && typeof A !== "string" && !ArrayBuffer.isView(A) && YRA(A)) return new Or1(A);
        else return A
    }

    function RLK() {}

    function Y71(A) {
        return A && typeof A === "object" && typeof A.pipe === "function" && typeof A.on === "function"
    }

    function ARA(A) {
        if (A === null) return !1;
        else if (A instanceof TLK) return !0;
        else if (typeof A !== "object") return !1;
        else {
            let q = A[Symbol.toStringTag];
            return (q === "Blob" || q === "File") && (("stream" in A) && typeof A.stream === "function" || ("arrayBuffer" in A) && typeof A.arrayBuffer === "function")
        }
    }

    function hLK(A, q) {
        if (A.includes("?") || A.includes("#")) throw Error('Query params cannot be passed when url already contains "?" or "#".');
        let K = NLK(q);
        if (K) A += "?" + K;
        return A
    }

    function qRA(A) {
        let q = parseInt(A, 10);
        return q === Number(A) && q >= 0 && q <= 65535
    }

    function q71(A) {
        return A != null && A[0] === "h" && A[1] === "t" && A[2] === "t" && A[3] === "p" && (A[4] === ":" || A[4] === "s" && A[5] === ":")
    }

    function KRA(A) {
        if (typeof A === "string") {
            if (A = new URL(A), !q71(A.origin || A.protocol)) throw new gD("Invalid URL protocol: the URL must start with `http:` or `https:`.");
            return A
        }
        if (!A || typeof A !== "object") throw new gD("Invalid URL: The URL argument must be a non-null object.");
        if (!(A instanceof URL)) {
            if (A.port != null && A.port !== "" && qRA(A.port) === !1) throw new gD("Invalid URL: port must be a valid integer or a string representation of an integer.");
            if (A.path != null && typeof A.path !== "string") throw new gD("Invalid URL path: the path must be a string or null/undefined.");
            if (A.pathname != null && typeof A.pathname !== "string") throw new gD("Invalid URL pathname: the pathname must be a string or null/undefined.");
            if (A.hostname != null && typeof A.hostname !== "string") throw new gD("Invalid URL hostname: the hostname must be a string or null/undefined.");
            if (A.origin != null && typeof A.origin !== "string") throw new gD("Invalid URL origin: the origin must be a string or null/undefined.");
            if (!q71(A.origin || A.protocol)) throw new gD("Invalid URL protocol: the URL must start with `http:` or `https:`.");
            let q = A.port != null ? A.port : A.protocol === "https:" ? 443 : 80,
                K = A.origin != null ? A.origin : `${A.protocol||""}//${A.hostname||""}:${q}`,
                Y = A.path != null ? A.path : `${A.pathname||""}${A.search||""}`;
            if (K[K.length - 1] === "/") K = K.slice(0, K.length - 1);
            if (Y && Y[0] !== "/") Y = `/${Y}`;
            return new URL(`${K}${Y}`)
        }
        if (!q71(A.origin || A.protocol)) throw new gD("Invalid URL protocol: the URL must start with `http:` or `https:`.");
        return A
    }

    function SLK(A) {
        if (A = KRA(A), A.pathname !== "/" || A.search || A.hash) throw new gD("invalid url");
        return A
    }

    function CLK(A) {
        if (A[0] === "[") {
            let K = A.indexOf("]");
            return LR6(K !== -1), A.substring(1, K)
        }
        let q = A.indexOf(":");
        if (q === -1) return A;
        return A.substring(0, q)
    }

    function ILK(A) {
        if (!A) return null;
        LR6(typeof A === "string");
        let q = CLK(A);
        if (fLK.isIP(q)) return "";
        return q
    }

    function bLK(A) {
        return JSON.parse(JSON.stringify(A))
    }

    function xLK(A) {
        return A != null && typeof A[Symbol.asyncIterator] === "function"
    }

    function YRA(A) {
        return A != null && (typeof A[Symbol.iterator] === "function" || typeof A[Symbol.asyncIterator] === "function")
    }

    function zRA(A) {
        if (A == null) return 0;
        else if (Y71(A)) {
            let q = A._readableState;
            return q && q.objectMode === !1 && q.ended === !0 && Number.isFinite(q.length) ? q.length : null
        } else if (ARA(A)) return A.size != null ? A.size : null;
        else if (ORA(A)) return A.byteLength;
        return null
    }

    function _RA(A) {
        return A && !!(A.destroyed || A[tLA] || K71.isDestroyed?.(A))
    }

    function uLK(A, q) {
        if (A == null || !Y71(A) || _RA(A)) return;
        if (typeof A.destroy === "function") {
            if (Object.getPrototypeOf(A).constructor === GLK) A.socket = null;
            A.destroy(q)
        } else if (q) queueMicrotask(() => {
            A.emit("error", q)
        });
        if (A.destroyed !== !0) A[tLA] = !0
    }
    var mLK = /timeout=(\d+)/;

    function BLK(A) {
        let q = A.toString().match(mLK);
        return q ? parseInt(q[1], 10) * 1000 : null
    }

    function wRA(A) {
        return typeof A === "string" ? kLK[A] ?? A.toLowerCase() : eLA.lookup(A) ?? A.toString("latin1").toLowerCase()
    }

    function gLK(A) {
        return eLA.lookup(A) ?? A.toString("latin1").toLowerCase()
    }

    function FLK(A, q) {
        if (q === void 0) q = {};
        for (let K = 0; K < A.length; K += 2) {
            let Y = wRA(A[K]),
                z = q[Y];
            if (z) {
                if (typeof z === "string") z = [z], q[Y] = z;
                z.push(A[K + 1].toString("utf8"))
            } else {
                let _ = A[K + 1];
                if (typeof _ === "string") q[Y] = _;
                else q[Y] = Array.isArray(_) ? _.map((w) => w.toString("utf8")) : _.toString("utf8")
            }
        }
        if ("content-length" in q && "content-disposition" in q) q["content-disposition"] = Buffer.from(q["content-disposition"]).toString("latin1");
        return q
    }

    function pLK(A) {
        let q = A.length,
            K = Array(q),
            Y = !1,
            z = -1,
            _, w, O = 0;
        for (let $ = 0; $ < A.length; $ += 2) {
            if (_ = A[$], w = A[$ + 1], typeof _ !== "string" && (_ = _.toString()), typeof w !== "string" && (w = w.toString("utf8")), O = _.length, O === 14 && _[7] === "-" && (_ === "content-length" || _.toLowerCase() === "content-length")) Y = !0;
            else if (O === 19 && _[7] === "-" && (_ === "content-disposition" || _.toLowerCase() === "content-disposition")) z = $ + 1;
            K[$] = _, K[$ + 1] = w
        }
        if (Y && z !== -1) K[z] = Buffer.from(K[z]).toString("latin1");
        return K
    }

    function ORA(A) {
        return A instanceof Uint8Array || Buffer.isBuffer(A)
    }

    function QLK(A, q, K) {
        if (!A || typeof A !== "object") throw new gD("handler must be an object");
        if (typeof A.onConnect !== "function") throw new gD("invalid onConnect method");
        if (typeof A.onError !== "function") throw new gD("invalid onError method");
        if (typeof A.onBodySent !== "function" && A.onBodySent !== void 0) throw new gD("invalid onBodySent method");
        if (K || q === "CONNECT") {
            if (typeof A.onUpgrade !== "function") throw new gD("invalid onUpgrade method")
        } else {
            if (typeof A.onHeaders !== "function") throw new gD("invalid onHeaders method");
            if (typeof A.onData !== "function") throw new gD("invalid onData method");
            if (typeof A.onComplete !== "function") throw new gD("invalid onComplete method")
        }
    }

    function ULK(A) {
        return !!(A && (K71.isDisturbed(A) || A[HH6]))
    }

    function dLK(A) {
        return !!(A && K71.isErrored(A))
    }

    function cLK(A) {
        return !!(A && K71.isReadable(A))
    }

    function lLK(A) {
        return {
            localAddress: A.localAddress,
            localPort: A.localPort,
            remoteAddress: A.remoteAddress,
            remotePort: A.remotePort,
            remoteFamily: A.remoteFamily,
            timeout: A.timeout,
            bytesWritten: A.bytesWritten,
            bytesRead: A.bytesRead
        }
    }

    function iLK(A) {
        let q;
        return new ReadableStream({
            async start() {
                q = A[Symbol.asyncIterator]()
            },
            async pull(K) {
                let {
                    done: Y,
                    value: z
                } = await q.next();
                if (Y) queueMicrotask(() => {
                    K.close(), K.byobRequest?.respond(0)
                });
                else {
                    let _ = Buffer.isBuffer(z) ? z : Buffer.from(z);
                    if (_.byteLength) K.enqueue(new Uint8Array(_))
                }
                return K.desiredSize > 0
            },
            async cancel(K) {
                await q.return()
            },
            type: "bytes"
        })
    }

    function nLK(A) {
        return A && typeof A === "object" && typeof A.append === "function" && typeof A.delete === "function" && typeof A.get === "function" && typeof A.getAll === "function" && typeof A.has === "function" && typeof A.set === "function" && A[Symbol.toStringTag] === "FormData"
    }

    function rLK(A, q) {
        if ("addEventListener" in A) return A.addEventListener("abort", q, {
            once: !0
        }), () => A.removeEventListener("abort", q);
        return A.addListener("abort", q), () => A.removeListener("abort", q)
    }
    var oLK = typeof String.prototype.toWellFormed === "function",
        aLK = typeof String.prototype.isWellFormed === "function";

    function $RA(A) {
        return oLK ? `${A}`.toWellFormed() : vLK.toUSVString(A)
    }

    function sLK(A) {
        return aLK ? `${A}`.isWellFormed() : $RA(A) === `${A}`
    }

    function HRA(A) {
        switch (A) {
            case 34:
            case 40:
            case 41:
            case 44:
            case 47:
            case 58:
            case 59:
            case 60:
            case 61:
            case 62:
            case 63:
            case 64:
            case 91:
            case 92:
            case 93:
            case 123:
            case 125:
                return !1;
            default:
                return A >= 33 && A <= 126
        }
    }

    function tLK(A) {
        if (A.length === 0) return !1;
        for (let q = 0; q < A.length; ++q)
            if (!HRA(A.charCodeAt(q))) return !1;
        return !0
    }
    var eLK = /[^\t\x20-\x7e\x80-\xff]/;

    function ARK(A) {
        return !eLK.test(A)
    }

    function qRK(A) {
        if (A == null || A === "") return {
            start: 0,
            end: null,
            size: null
        };
        let q = A ? A.match(/^bytes (\d+)-(\d+)\/(\d+)?$/) : null;
        return q ? {
            start: parseInt(q[1]),
            end: q[2] ? parseInt(q[2]) : null,
            size: q[3] ? parseInt(q[3]) : null
        } : null
    }

    function KRK(A, q, K) {
        return (A[wr1] ??= []).push([q, K]), A.on(q, K), A
    }

    function YRK(A) {
        for (let [q, K] of A[wr1] ?? []) A.removeListener(q, K);
        A[wr1] = null
    }

    function zRK(A, q, K) {
        try {
            q.onError(K), LR6(q.aborted)
        } catch (Y) {
            A.emit("error", Y)
        }
    }
    var jRA = Object.create(null);
    jRA.enumerable = !0;
    var $r1 = {
            delete: "DELETE",
            DELETE: "DELETE",
            get: "GET",
            GET: "GET",
            head: "HEAD",
            HEAD: "HEAD",
            options: "OPTIONS",
            OPTIONS: "OPTIONS",
            post: "POST",
            POST: "POST",
            put: "PUT",
            PUT: "PUT"
        },
        JRA = {
            ...$r1,
            patch: "patch",
            PATCH: "PATCH"
        };
    Object.setPrototypeOf($r1, null);
    Object.setPrototypeOf(JRA, null);
    MRA.exports = {
        kEnumerableProperty: jRA,
        nop: RLK,
        isDisturbed: ULK,
        isErrored: dLK,
        isReadable: cLK,
        toUSVString: $RA,
        isUSVString: sLK,
        isBlobLike: ARA,
        parseOrigin: SLK,
        parseURL: KRA,
        getServerName: ILK,
        isStream: Y71,
        isIterable: YRA,
        isAsyncIterable: xLK,
        isDestroyed: _RA,
        headerNameToString: wRA,
        bufferToLowerCasedHeaderName: gLK,
        addListener: KRK,
        removeAllListeners: YRK,
        errorRequest: zRK,
        parseRawHeaders: pLK,
        parseHeaders: FLK,
        parseKeepAliveTimeout: BLK,
        destroy: uLK,
        bodyLength: zRA,
        deepClone: bLK,
        ReadableStreamFrom: iLK,
        isBuffer: ORA,
        validateHandler: QLK,
        getSocketInfo: lLK,
        isFormDataLike: nLK,
        buildURL: hLK,
        addAbortListener: rLK,
        isValidHTTPToken: tLK,
        isValidHeaderValue: ARK,
        isTokenCharCode: HRA,
        parseRangeHeader: qRK,
        normalizedMethodRecordsBase: $r1,
        normalizedMethodRecords: JRA,
        isValidPort: qRA,
        isHttpOrHttpsPrefixed: q71,
        nodeMajor: ELK,
        nodeMinor: yLK,
        safeHTTPMethods: ["GET", "HEAD", "OPTIONS", "TRACE"],
        wrapRequestBody: LLK
    }
})
// @from(Ln 50531, Col 4)
jH6 = x((Pw_, XRA) => {
    var z_ = x6("node:diagnostics_channel"),
        jr1 = x6("node:util"),
        z71 = jr1.debuglog("undici"),
        Hr1 = jr1.debuglog("fetch"),
        y76 = jr1.debuglog("websocket"),
        DRA = !1,
        _RK = {
            beforeConnect: z_.channel("undici:client:beforeConnect"),
            connected: z_.channel("undici:client:connected"),
            connectError: z_.channel("undici:client:connectError"),
            sendHeaders: z_.channel("undici:client:sendHeaders"),
            create: z_.channel("undici:request:create"),
            bodySent: z_.channel("undici:request:bodySent"),
            headers: z_.channel("undici:request:headers"),
            trailers: z_.channel("undici:request:trailers"),
            error: z_.channel("undici:request:error"),
            open: z_.channel("undici:websocket:open"),
            close: z_.channel("undici:websocket:close"),
            socketError: z_.channel("undici:websocket:socket_error"),
            ping: z_.channel("undici:websocket:ping"),
            pong: z_.channel("undici:websocket:pong")
        };
    if (z71.enabled || Hr1.enabled) {
        let A = Hr1.enabled ? Hr1 : z71;
        z_.channel("undici:client:beforeConnect").subscribe((q) => {
            let {
                connectParams: {
                    version: K,
                    protocol: Y,
                    port: z,
                    host: _
                }
            } = q;
            A("connecting to %s using %s%s", `${_}${z?`:${z}`:""}`, Y, K)
        }), z_.channel("undici:client:connected").subscribe((q) => {
            let {
                connectParams: {
                    version: K,
                    protocol: Y,
                    port: z,
                    host: _
                }
            } = q;
            A("connected to %s using %s%s", `${_}${z?`:${z}`:""}`, Y, K)
        }), z_.channel("undici:client:connectError").subscribe((q) => {
            let {
                connectParams: {
                    version: K,
                    protocol: Y,
                    port: z,
                    host: _
                },
                error: w
            } = q;
            A("connection to %s using %s%s errored - %s", `${_}${z?`:${z}`:""}`, Y, K, w.message)
        }), z_.channel("undici:client:sendHeaders").subscribe((q) => {
            let {
                request: {
                    method: K,
                    path: Y,
                    origin: z
                }
            } = q;
            A("sending request to %s %s/%s", K, z, Y)
        }), z_.channel("undici:request:headers").subscribe((q) => {
            let {
                request: {
                    method: K,
                    path: Y,
                    origin: z
                },
                response: {
                    statusCode: _
                }
            } = q;
            A("received response to %s %s/%s - HTTP %d", K, z, Y, _)
        }), z_.channel("undici:request:trailers").subscribe((q) => {
            let {
                request: {
                    method: K,
                    path: Y,
                    origin: z
                }
            } = q;
            A("trailers received from %s %s/%s", K, z, Y)
        }), z_.channel("undici:request:error").subscribe((q) => {
            let {
                request: {
                    method: K,
                    path: Y,
                    origin: z
                },
                error: _
            } = q;
            A("request to %s %s/%s errored - %s", K, z, Y, _.message)
        }), DRA = !0
    }
    if (y76.enabled) {
        if (!DRA) {
            let A = z71.enabled ? z71 : y76;
            z_.channel("undici:client:beforeConnect").subscribe((q) => {
                let {
                    connectParams: {
                        version: K,
                        protocol: Y,
                        port: z,
                        host: _
                    }
                } = q;
                A("connecting to %s%s using %s%s", _, z ? `:${z}` : "", Y, K)
            }), z_.channel("undici:client:connected").subscribe((q) => {
                let {
                    connectParams: {
                        version: K,
                        protocol: Y,
                        port: z,
                        host: _
                    }
                } = q;
                A("connected to %s%s using %s%s", _, z ? `:${z}` : "", Y, K)
            }), z_.channel("undici:client:connectError").subscribe((q) => {
                let {
                    connectParams: {
                        version: K,
                        protocol: Y,
                        port: z,
                        host: _
                    },
                    error: w
                } = q;
                A("connection to %s%s using %s%s errored - %s", _, z ? `:${z}` : "", Y, K, w.message)
            }), z_.channel("undici:client:sendHeaders").subscribe((q) => {
                let {
                    request: {
                        method: K,
                        path: Y,
                        origin: z
                    }
                } = q;
                A("sending request to %s %s/%s", K, z, Y)
            })
        }
        z_.channel("undici:websocket:open").subscribe((A) => {
            let {
                address: {
                    address: q,
                    port: K
                }
            } = A;
            y76("connection opened %s%s", q, K ? `:${K}` : "")
        }), z_.channel("undici:websocket:close").subscribe((A) => {
            let {
                websocket: q,
                code: K,
                reason: Y
            } = A;
            y76("closed connection to %s - %s %s", q.url, K, Y)
        }), z_.channel("undici:websocket:socket_error").subscribe((A) => {
            y76("connection errored - %s", A.message)
        }), z_.channel("undici:websocket:ping").subscribe((A) => {
            y76("ping received")
        }), z_.channel("undici:websocket:pong").subscribe((A) => {
            y76("pong received")
        })
    }
    XRA.exports = {
        channels: _RK
    }
})
// @from(Ln 50701, Col 4)
TRA = x((Ww_, fRA) => {
    var {
        InvalidArgumentError: u$,
        NotSupportedError: wRK
    } = mz(), tp = x6("node:assert"), {
        isValidHTTPToken: ZRA,
        isValidHeaderValue: PRA,
        isStream: ORK,
        destroy: $RK,
        isBuffer: HRK,
        isFormDataLike: jRK,
        isIterable: JRK,
        isBlobLike: MRK,
        buildURL: DRK,
        validateHandler: XRK,
        getServerName: PRK,
        normalizedMethodRecords: WRK
    } = Y9(), {
        channels: tx
    } = jH6(), {
        headerNameLowerCasedRecord: WRA
    } = A71(), ZRK = /[^\u0021-\u00ff]/, Ty = Symbol("handler");
    class GRA {
        constructor(A, {
            path: q,
            method: K,
            body: Y,
            headers: z,
            query: _,
            idempotent: w,
            blocking: O,
            upgrade: $,
            headersTimeout: H,
            bodyTimeout: j,
            reset: J,
            throwOnError: M,
            expectContinue: D,
            servername: X
        }, P) {
            if (typeof q !== "string") throw new u$("path must be a string");
            else if (q[0] !== "/" && !(q.startsWith("http://") || q.startsWith("https://")) && K !== "CONNECT") throw new u$("path must be an absolute URL or start with a slash");
            else if (ZRK.test(q)) throw new u$("invalid request path");
            if (typeof K !== "string") throw new u$("method must be a string");
            else if (WRK[K] === void 0 && !ZRA(K)) throw new u$("invalid request method");
            if ($ && typeof $ !== "string") throw new u$("upgrade must be a string");
            if (H != null && (!Number.isFinite(H) || H < 0)) throw new u$("invalid headersTimeout");
            if (j != null && (!Number.isFinite(j) || j < 0)) throw new u$("invalid bodyTimeout");
            if (J != null && typeof J !== "boolean") throw new u$("invalid reset");
            if (D != null && typeof D !== "boolean") throw new u$("invalid expectContinue");
            if (this.headersTimeout = H, this.bodyTimeout = j, this.throwOnError = M === !0, this.method = K, this.abort = null, Y == null) this.body = null;
            else if (ORK(Y)) {
                this.body = Y;
                let W = this.body._readableState;
                if (!W || !W.autoDestroy) this.endHandler = function() {
                    $RK(this)
                }, this.body.on("end", this.endHandler);
                this.errorHandler = (Z) => {
                    if (this.abort) this.abort(Z);
                    else this.error = Z
                }, this.body.on("error", this.errorHandler)
            } else if (HRK(Y)) this.body = Y.byteLength ? Y : null;
            else if (ArrayBuffer.isView(Y)) this.body = Y.buffer.byteLength ? Buffer.from(Y.buffer, Y.byteOffset, Y.byteLength) : null;
            else if (Y instanceof ArrayBuffer) this.body = Y.byteLength ? Buffer.from(Y) : null;
            else if (typeof Y === "string") this.body = Y.length ? Buffer.from(Y) : null;
            else if (jRK(Y) || JRK(Y) || MRK(Y)) this.body = Y;
            else throw new u$("body must be a string, a Buffer, a Readable stream, an iterable, or an async iterable");
            if (this.completed = !1, this.aborted = !1, this.upgrade = $ || null, this.path = _ ? DRK(q, _) : q, this.origin = A, this.idempotent = w == null ? K === "HEAD" || K === "GET" : w, this.blocking = O == null ? !1 : O, this.reset = J == null ? null : J, this.host = null, this.contentLength = null, this.contentType = null, this.headers = [], this.expectContinue = D != null ? D : !1, Array.isArray(z)) {
                if (z.length % 2 !== 0) throw new u$("headers array must be even");
                for (let W = 0; W < z.length; W += 2) _71(this, z[W], z[W + 1])
            } else if (z && typeof z === "object")
                if (z[Symbol.iterator])
                    for (let W of z) {
                        if (!Array.isArray(W) || W.length !== 2) throw new u$("headers must be in key-value pair format");
                        _71(this, W[0], W[1])
                    } else {
                        let W = Object.keys(z);
                        for (let Z = 0; Z < W.length; ++Z) _71(this, W[Z], z[W[Z]])
                    } else if (z != null) throw new u$("headers must be an object or an array");
            if (XRK(P, K, $), this.servername = X || PRK(this.host), this[Ty] = P, tx.create.hasSubscribers) tx.create.publish({
                request: this
            })
        }
        onBodySent(A) {
            if (this[Ty].onBodySent) try {
                return this[Ty].onBodySent(A)
            } catch (q) {
                this.abort(q)
            }
        }
        onRequestSent() {
            if (tx.bodySent.hasSubscribers) tx.bodySent.publish({
                request: this
            });
            if (this[Ty].onRequestSent) try {
                return this[Ty].onRequestSent()
            } catch (A) {
                this.abort(A)
            }
        }
        onConnect(A) {
            if (tp(!this.aborted), tp(!this.completed), this.error) A(this.error);
            else return this.abort = A, this[Ty].onConnect(A)
        }
        onResponseStarted() {
            return this[Ty].onResponseStarted?.()
        }
        onHeaders(A, q, K, Y) {
            if (tp(!this.aborted), tp(!this.completed), tx.headers.hasSubscribers) tx.headers.publish({
                request: this,
                response: {
                    statusCode: A,
                    headers: q,
                    statusText: Y
                }
            });
            try {
                return this[Ty].onHeaders(A, q, K, Y)
            } catch (z) {
                this.abort(z)
            }
        }
        onData(A) {
            tp(!this.aborted), tp(!this.completed);
            try {
                return this[Ty].onData(A)
            } catch (q) {
                return this.abort(q), !1
            }
        }
        onUpgrade(A, q, K) {
            return tp(!this.aborted), tp(!this.completed), this[Ty].onUpgrade(A, q, K)
        }
        onComplete(A) {
            if (this.onFinally(), tp(!this.aborted), this.completed = !0, tx.trailers.hasSubscribers) tx.trailers.publish({
                request: this,
                trailers: A
            });
            try {
                return this[Ty].onComplete(A)
            } catch (q) {
                this.onError(q)
            }
        }
        onError(A) {
            if (this.onFinally(), tx.error.hasSubscribers) tx.error.publish({
                request: this,
                error: A
            });
            if (this.aborted) return;
            return this.aborted = !0, this[Ty].onError(A)
        }
        onFinally() {
            if (this.errorHandler) this.body.off("error", this.errorHandler), this.errorHandler = null;
            if (this.endHandler) this.body.off("end", this.endHandler), this.endHandler = null
        }
        addHeader(A, q) {
            return _71(this, A, q), this
        }
    }

    function _71(A, q, K) {
        if (K && (typeof K === "object" && !Array.isArray(K))) throw new u$(`invalid ${q} header`);
        else if (K === void 0) return;
        let Y = WRA[q];
        if (Y === void 0) {
            if (Y = q.toLowerCase(), WRA[Y] === void 0 && !ZRA(Y)) throw new u$("invalid header key")
        }
        if (Array.isArray(K)) {
            let z = [];
            for (let _ = 0; _ < K.length; _++)
                if (typeof K[_] === "string") {
                    if (!PRA(K[_])) throw new u$(`invalid ${q} header`);
                    z.push(K[_])
                } else if (K[_] === null) z.push("");
            else if (typeof K[_] === "object") throw new u$(`invalid ${q} header`);
            else z.push(`${K[_]}`);
            K = z
        } else if (typeof K === "string") {
            if (!PRA(K)) throw new u$(`invalid ${q} header`)
        } else if (K === null) K = "";
        else K = `${K}`;
        if (A.host === null && Y === "host") {
            if (typeof K !== "string") throw new u$("invalid host header");
            A.host = K
        } else if (A.contentLength === null && Y === "content-length") {
            if (A.contentLength = parseInt(K, 10), !Number.isFinite(A.contentLength)) throw new u$("invalid content-length header")
        } else if (A.contentType === null && Y === "content-type") A.contentType = K, A.headers.push(q, K);
        else if (Y === "transfer-encoding" || Y === "keep-alive" || Y === "upgrade") throw new u$(`invalid ${Y} header`);
        else if (Y === "connection") {
            let z = typeof K === "string" ? K.toLowerCase() : null;
            if (z !== "close" && z !== "keep-alive") throw new u$("invalid connection header");
            if (z === "close") A.reset = !0
        } else if (Y === "expect") throw new wRK("expect header not supported");
        else A.headers.push(q, K)
    }
    fRA.exports = GRA
})
// @from(Ln 50898, Col 4)
RR6 = x((Zw_, NRA) => {
    var GRK = x6("node:events");
    class Jr1 extends GRK {
        dispatch() {
            throw Error("not implemented")
        }
        close() {
            throw Error("not implemented")
        }
        destroy() {
            throw Error("not implemented")
        }
        compose(...A) {
            let q = Array.isArray(A[0]) ? A[0] : A,
                K = this.dispatch.bind(this);
            for (let Y of q) {
                if (Y == null) continue;
                if (typeof Y !== "function") throw TypeError(`invalid interceptor, expected function received ${typeof Y}`);
                if (K = Y(K), K == null || typeof K !== "function" || K.length !== 2) throw TypeError("invalid interceptor")
            }
            return new vRA(this, K)
        }
    }
    class vRA extends Jr1 {
        #A = null;
        #q = null;
        constructor(A, q) {
            super();
            this.#A = A, this.#q = q
        }
        dispatch(...A) {
            this.#q(...A)
        }
        close(...A) {
            return this.#A.close(...A)
        }
        destroy(...A) {
            return this.#A.destroy(...A)
        }
    }
    NRA.exports = Jr1
})
// @from(Ln 50940, Col 4)
XH6 = x((Gw_, kRA) => {
    var fRK = RR6(),
        {
            ClientDestroyedError: Mr1,
            ClientClosedError: TRK,
            InvalidArgumentError: JH6
        } = mz(),
        {
            kDestroy: vRK,
            kClose: NRK,
            kClosed: hR6,
            kDestroyed: MH6,
            kDispatch: Dr1,
            kInterceptors: L76
        } = UO(),
        ep = Symbol("onDestroyed"),
        DH6 = Symbol("onClosed"),
        w71 = Symbol("Intercepted Dispatch");
    class VRA extends fRK {
        constructor() {
            super();
            this[MH6] = !1, this[ep] = null, this[hR6] = !1, this[DH6] = []
        }
        get destroyed() {
            return this[MH6]
        }
        get closed() {
            return this[hR6]
        }
        get interceptors() {
            return this[L76]
        }
        set interceptors(A) {
            if (A) {
                for (let q = A.length - 1; q >= 0; q--)
                    if (typeof this[L76][q] !== "function") throw new JH6("interceptor must be an function")
            }
            this[L76] = A
        }
        close(A) {
            if (A === void 0) return new Promise((K, Y) => {
                this.close((z, _) => {
                    return z ? Y(z) : K(_)
                })
            });
            if (typeof A !== "function") throw new JH6("invalid callback");
            if (this[MH6]) {
                queueMicrotask(() => A(new Mr1, null));
                return
            }
            if (this[hR6]) {
                if (this[DH6]) this[DH6].push(A);
                else queueMicrotask(() => A(null, null));
                return
            }
            this[hR6] = !0, this[DH6].push(A);
            let q = () => {
                let K = this[DH6];
                this[DH6] = null;
                for (let Y = 0; Y < K.length; Y++) K[Y](null, null)
            };
            this[NRK]().then(() => this.destroy()).then(() => {
                queueMicrotask(q)
            })
        }
        destroy(A, q) {
            if (typeof A === "function") q = A, A = null;
            if (q === void 0) return new Promise((Y, z) => {
                this.destroy(A, (_, w) => {
                    return _ ? z(_) : Y(w)
                })
            });
            if (typeof q !== "function") throw new JH6("invalid callback");
            if (this[MH6]) {
                if (this[ep]) this[ep].push(q);
                else queueMicrotask(() => q(null, null));
                return
            }
            if (!A) A = new Mr1;
            this[MH6] = !0, this[ep] = this[ep] || [], this[ep].push(q);
            let K = () => {
                let Y = this[ep];
                this[ep] = null;
                for (let z = 0; z < Y.length; z++) Y[z](null, null)
            };
            this[vRK](A).then(() => {
                queueMicrotask(K)
            })
        } [w71](A, q) {
            if (!this[L76] || this[L76].length === 0) return this[w71] = this[Dr1], this[Dr1](A, q);
            let K = this[Dr1].bind(this);
            for (let Y = this[L76].length - 1; Y >= 0; Y--) K = this[L76][Y](K);
            return this[w71] = K, K(A, q)
        }
        dispatch(A, q) {
            if (!q || typeof q !== "object") throw new JH6("handler must be an object");
            try {
                if (!A || typeof A !== "object") throw new JH6("opts must be an object.");
                if (this[MH6] || this[ep]) throw new Mr1;
                if (this[hR6]) throw new TRK;
                return this[w71](A, q)
            } catch (K) {
                if (typeof q.onError !== "function") throw new JH6("invalid onError method");
                return q.onError(K), !1
            }
        }
    }
    kRA.exports = VRA
})
// @from(Ln 51049, Col 4)
vr1 = x((fw_, RRA) => {
    var PH6 = 0,
        Xr1 = 1000,
        Pr1 = (Xr1 >> 1) - 1,
        AQ, Wr1 = Symbol("kFastTimer"),
        qQ = [],
        Zr1 = -2,
        Gr1 = -1,
        yRA = 0,
        ERA = 1;

    function fr1() {
        PH6 += Pr1;
        let A = 0,
            q = qQ.length;
        while (A < q) {
            let K = qQ[A];
            if (K._state === yRA) K._idleStart = PH6 - Pr1, K._state = ERA;
            else if (K._state === ERA && PH6 >= K._idleStart + K._idleTimeout) K._state = Gr1, K._idleStart = -1, K._onTimeout(K._timerArg);
            if (K._state === Gr1) {
                if (K._state = Zr1, --q !== 0) qQ[A] = qQ[q]
            } else ++A
        }
        if (qQ.length = q, qQ.length !== 0) LRA()
    }

    function LRA() {
        if (AQ) AQ.refresh();
        else if (clearTimeout(AQ), AQ = setTimeout(fr1, Pr1), AQ.unref) AQ.unref()
    }
    class Tr1 {
        [Wr1] = !0;
        _state = Zr1;
        _idleTimeout = -1;
        _idleStart = -1;
        _onTimeout;
        _timerArg;
        constructor(A, q, K) {
            this._onTimeout = A, this._idleTimeout = q, this._timerArg = K, this.refresh()
        }
        refresh() {
            if (this._state === Zr1) qQ.push(this);
            if (!AQ || qQ.length === 1) LRA();
            this._state = yRA
        }
        clear() {
            this._state = Gr1, this._idleStart = -1
        }
    }
    RRA.exports = {
        setTimeout(A, q, K) {
            return q <= Xr1 ? setTimeout(A, q, K) : new Tr1(A, q, K)
        },
        clearTimeout(A) {
            if (A[Wr1]) A.clear();
            else clearTimeout(A)
        },
        setFastTimeout(A, q, K) {
            return new Tr1(A, q, K)
        },
        clearFastTimeout(A) {
            A.clear()
        },
        now() {
            return PH6
        },
        tick(A = 0) {
            PH6 += A - Xr1 + 1, fr1(), fr1()
        },
        reset() {
            PH6 = 0, qQ.length = 0, clearTimeout(AQ), AQ = null
        },
        kFastTimer: Wr1
    }
})
// @from(Ln 51124, Col 4)
SR6 = x((Tw_, bRA) => {
    var VRK = x6("node:net"),
        hRA = x6("node:assert"),
        IRA = Y9(),
        {
            InvalidArgumentError: kRK,
            ConnectTimeoutError: ERK
        } = mz(),
        O71 = vr1();

    function SRA() {}
    var Nr1, Vr1;
    if (global.FinalizationRegistry && !(process.env.NODE_V8_COVERAGE || process.env.UNDICI_NO_FG)) Vr1 = class {
        constructor(q) {
            this._maxCachedSessions = q, this._sessionCache = new Map, this._sessionRegistry = new global.FinalizationRegistry((K) => {
                if (this._sessionCache.size < this._maxCachedSessions) return;
                let Y = this._sessionCache.get(K);
                if (Y !== void 0 && Y.deref() === void 0) this._sessionCache.delete(K)
            })
        }
        get(q) {
            let K = this._sessionCache.get(q);
            return K ? K.deref() : null
        }
        set(q, K) {
            if (this._maxCachedSessions === 0) return;
            this._sessionCache.set(q, new WeakRef(K)), this._sessionRegistry.register(K, q)
        }
    };
    else Vr1 = class {
        constructor(q) {
            this._maxCachedSessions = q, this._sessionCache = new Map
        }
        get(q) {
            return this._sessionCache.get(q)
        }
        set(q, K) {
            if (this._maxCachedSessions === 0) return;
            if (this._sessionCache.size >= this._maxCachedSessions) {
                let {
                    value: Y
                } = this._sessionCache.keys().next();
                this._sessionCache.delete(Y)
            }
            this._sessionCache.set(q, K)
        }
    };

    function yRK({
        allowH2: A,
        maxCachedSessions: q,
        socketPath: K,
        timeout: Y,
        session: z,
        ..._
    }) {
        if (q != null && (!Number.isInteger(q) || q < 0)) throw new kRK("maxCachedSessions must be a positive integer or zero");
        let w = {
                path: K,
                ..._
            },
            O = new Vr1(q == null ? 100 : q);
        return Y = Y == null ? 1e4 : Y, A = A != null ? A : !1,
            function({
                hostname: H,
                host: j,
                protocol: J,
                port: M,
                servername: D,
                localAddress: X,
                httpSocket: P
            }, W) {
                let Z;
                if (J === "https:") {
                    if (!Nr1) Nr1 = x6("node:tls");
                    D = D || w.servername || IRA.getServerName(j) || null;
                    let f = D || H;
                    hRA(f);
                    let v = z || O.get(f) || null;
                    M = M || 443, Z = Nr1.connect({
                        highWaterMark: 16384,
                        ...w,
                        servername: D,
                        session: v,
                        localAddress: X,
                        ALPNProtocols: A ? ["http/1.1", "h2"] : ["http/1.1"],
                        socket: P,
                        port: M,
                        host: H
                    }), Z.on("session", function(N) {
                        O.set(f, N)
                    })
                } else hRA(!P, "httpSocket can only be sent on TLS update"), M = M || 80, Z = VRK.connect({
                    highWaterMark: 65536,
                    ...w,
                    localAddress: X,
                    port: M,
                    host: H
                });
                if (w.keepAlive == null || w.keepAlive) {
                    let f = w.keepAliveInitialDelay === void 0 ? 60000 : w.keepAliveInitialDelay;
                    Z.setKeepAlive(!0, f)
                }
                let G = LRK(new WeakRef(Z), {
                    timeout: Y,
                    hostname: H,
                    port: M
                });
                return Z.setNoDelay(!0).once(J === "https:" ? "secureConnect" : "connect", function() {
                    if (queueMicrotask(G), W) {
                        let f = W;
                        W = null, f(null, this)
                    }
                }).on("error", function(f) {
                    if (queueMicrotask(G), W) {
                        let v = W;
                        W = null, v(f)
                    }
                }), Z
            }
    }
    var LRK = process.platform === "win32" ? (A, q) => {
        if (!q.timeout) return SRA;
        let K = null,
            Y = null,
            z = O71.setFastTimeout(() => {
                K = setImmediate(() => {
                    Y = setImmediate(() => CRA(A.deref(), q))
                })
            }, q.timeout);
        return () => {
            O71.clearFastTimeout(z), clearImmediate(K), clearImmediate(Y)
        }
    } : (A, q) => {
        if (!q.timeout) return SRA;
        let K = null,
            Y = O71.setFastTimeout(() => {
                K = setImmediate(() => {
                    CRA(A.deref(), q)
                })
            }, q.timeout);
        return () => {
            O71.clearFastTimeout(Y), clearImmediate(K)
        }
    };

    function CRA(A, q) {
        if (A == null) return;
        let K = "Connect Timeout Error";
        if (Array.isArray(A.autoSelectFamilyAttemptedAddresses)) K += ` (attempted addresses: ${A.autoSelectFamilyAttemptedAddresses.join(", ")},`;
        else K += ` (attempted address: ${q.hostname}:${q.port},`;
        K += ` timeout: ${q.timeout}ms)`, IRA.destroy(A, new ERK(K))
    }
    bRA.exports = yRK
})
// @from(Ln 51279, Col 4)
mRA = x((xRA) => {
    Object.defineProperty(xRA, "__esModule", {
        value: !0
    });
    xRA.enumToMap = void 0;

    function RRK(A) {
        let q = {};
        return Object.keys(A).forEach((K) => {
            let Y = A[K];
            if (typeof Y === "number") q[K] = Y
        }), q
    }
    xRA.enumToMap = RRK
})
// @from(Ln 51294, Col 4)
eRA = x((cRA) => {
    Object.defineProperty(cRA, "__esModule", {
        value: !0
    });
    cRA.SPECIAL_HEADERS = cRA.HEADER_STATE = cRA.MINOR = cRA.MAJOR = cRA.CONNECTION_TOKEN_CHARS = cRA.HEADER_CHARS = cRA.TOKEN = cRA.STRICT_TOKEN = cRA.HEX = cRA.URL_CHAR = cRA.STRICT_URL_CHAR = cRA.USERINFO_CHARS = cRA.MARK = cRA.ALPHANUM = cRA.NUM = cRA.HEX_MAP = cRA.NUM_MAP = cRA.ALPHA = cRA.FINISH = cRA.H_METHOD_MAP = cRA.METHOD_MAP = cRA.METHODS_RTSP = cRA.METHODS_ICE = cRA.METHODS_HTTP = cRA.METHODS = cRA.LENIENT_FLAGS = cRA.FLAGS = cRA.TYPE = cRA.ERROR = void 0;
    var hRK = mRA(),
        SRK;
    (function(A) {
        A[A.OK = 0] = "OK", A[A.INTERNAL = 1] = "INTERNAL", A[A.STRICT = 2] = "STRICT", A[A.LF_EXPECTED = 3] = "LF_EXPECTED", A[A.UNEXPECTED_CONTENT_LENGTH = 4] = "UNEXPECTED_CONTENT_LENGTH", A[A.CLOSED_CONNECTION = 5] = "CLOSED_CONNECTION", A[A.INVALID_METHOD = 6] = "INVALID_METHOD", A[A.INVALID_URL = 7] = "INVALID_URL", A[A.INVALID_CONSTANT = 8] = "INVALID_CONSTANT", A[A.INVALID_VERSION = 9] = "INVALID_VERSION", A[A.INVALID_HEADER_TOKEN = 10] = "INVALID_HEADER_TOKEN", A[A.INVALID_CONTENT_LENGTH = 11] = "INVALID_CONTENT_LENGTH", A[A.INVALID_CHUNK_SIZE = 12] = "INVALID_CHUNK_SIZE", A[A.INVALID_STATUS = 13] = "INVALID_STATUS", A[A.INVALID_EOF_STATE = 14] = "INVALID_EOF_STATE", A[A.INVALID_TRANSFER_ENCODING = 15] = "INVALID_TRANSFER_ENCODING", A[A.CB_MESSAGE_BEGIN = 16] = "CB_MESSAGE_BEGIN", A[A.CB_HEADERS_COMPLETE = 17] = "CB_HEADERS_COMPLETE", A[A.CB_MESSAGE_COMPLETE = 18] = "CB_MESSAGE_COMPLETE", A[A.CB_CHUNK_HEADER = 19] = "CB_CHUNK_HEADER", A[A.CB_CHUNK_COMPLETE = 20] = "CB_CHUNK_COMPLETE", A[A.PAUSED = 21] = "PAUSED", A[A.PAUSED_UPGRADE = 22] = "PAUSED_UPGRADE", A[A.PAUSED_H2_UPGRADE = 23] = "PAUSED_H2_UPGRADE", A[A.USER = 24] = "USER"
    })(SRK = cRA.ERROR || (cRA.ERROR = {}));
    var CRK;
    (function(A) {
        A[A.BOTH = 0] = "BOTH", A[A.REQUEST = 1] = "REQUEST", A[A.RESPONSE = 2] = "RESPONSE"
    })(CRK = cRA.TYPE || (cRA.TYPE = {}));
    var IRK;
    (function(A) {
        A[A.CONNECTION_KEEP_ALIVE = 1] = "CONNECTION_KEEP_ALIVE", A[A.CONNECTION_CLOSE = 2] = "CONNECTION_CLOSE", A[A.CONNECTION_UPGRADE = 4] = "CONNECTION_UPGRADE", A[A.CHUNKED = 8] = "CHUNKED", A[A.UPGRADE = 16] = "UPGRADE", A[A.CONTENT_LENGTH = 32] = "CONTENT_LENGTH", A[A.SKIPBODY = 64] = "SKIPBODY", A[A.TRAILING = 128] = "TRAILING", A[A.TRANSFER_ENCODING = 512] = "TRANSFER_ENCODING"
    })(IRK = cRA.FLAGS || (cRA.FLAGS = {}));
    var bRK;
    (function(A) {
        A[A.HEADERS = 1] = "HEADERS", A[A.CHUNKED_LENGTH = 2] = "CHUNKED_LENGTH", A[A.KEEP_ALIVE = 4] = "KEEP_ALIVE"
    })(bRK = cRA.LENIENT_FLAGS || (cRA.LENIENT_FLAGS = {}));
    var zK;
    (function(A) {
        A[A.DELETE = 0] = "DELETE", A[A.GET = 1] = "GET", A[A.HEAD = 2] = "HEAD", A[A.POST = 3] = "POST", A[A.PUT = 4] = "PUT", A[A.CONNECT = 5] = "CONNECT", A[A.OPTIONS = 6] = "OPTIONS", A[A.TRACE = 7] = "TRACE", A[A.COPY = 8] = "COPY", A[A.LOCK = 9] = "LOCK", A[A.MKCOL = 10] = "MKCOL", A[A.MOVE = 11] = "MOVE", A[A.PROPFIND = 12] = "PROPFIND", A[A.PROPPATCH = 13] = "PROPPATCH", A[A.SEARCH = 14] = "SEARCH", A[A.UNLOCK = 15] = "UNLOCK", A[A.BIND = 16] = "BIND", A[A.REBIND = 17] = "REBIND", A[A.UNBIND = 18] = "UNBIND", A[A.ACL = 19] = "ACL", A[A.REPORT = 20] = "REPORT", A[A.MKACTIVITY = 21] = "MKACTIVITY", A[A.CHECKOUT = 22] = "CHECKOUT", A[A.MERGE = 23] = "MERGE", A[A["M-SEARCH"] = 24] = "M-SEARCH", A[A.NOTIFY = 25] = "NOTIFY", A[A.SUBSCRIBE = 26] = "SUBSCRIBE", A[A.UNSUBSCRIBE = 27] = "UNSUBSCRIBE", A[A.PATCH = 28] = "PATCH", A[A.PURGE = 29] = "PURGE", A[A.MKCALENDAR = 30] = "MKCALENDAR", A[A.LINK = 31] = "LINK", A[A.UNLINK = 32] = "UNLINK", A[A.SOURCE = 33] = "SOURCE", A[A.PRI = 34] = "PRI", A[A.DESCRIBE = 35] = "DESCRIBE", A[A.ANNOUNCE = 36] = "ANNOUNCE", A[A.SETUP = 37] = "SETUP", A[A.PLAY = 38] = "PLAY", A[A.PAUSE = 39] = "PAUSE", A[A.TEARDOWN = 40] = "TEARDOWN", A[A.GET_PARAMETER = 41] = "GET_PARAMETER", A[A.SET_PARAMETER = 42] = "SET_PARAMETER", A[A.REDIRECT = 43] = "REDIRECT", A[A.RECORD = 44] = "RECORD", A[A.FLUSH = 45] = "FLUSH"
    })(zK = cRA.METHODS || (cRA.METHODS = {}));
    cRA.METHODS_HTTP = [zK.DELETE, zK.GET, zK.HEAD, zK.POST, zK.PUT, zK.CONNECT, zK.OPTIONS, zK.TRACE, zK.COPY, zK.LOCK, zK.MKCOL, zK.MOVE, zK.PROPFIND, zK.PROPPATCH, zK.SEARCH, zK.UNLOCK, zK.BIND, zK.REBIND, zK.UNBIND, zK.ACL, zK.REPORT, zK.MKACTIVITY, zK.CHECKOUT, zK.MERGE, zK["M-SEARCH"], zK.NOTIFY, zK.SUBSCRIBE, zK.UNSUBSCRIBE, zK.PATCH, zK.PURGE, zK.MKCALENDAR, zK.LINK, zK.UNLINK, zK.PRI, zK.SOURCE];
    cRA.METHODS_ICE = [zK.SOURCE];
    cRA.METHODS_RTSP = [zK.OPTIONS, zK.DESCRIBE, zK.ANNOUNCE, zK.SETUP, zK.PLAY, zK.PAUSE, zK.TEARDOWN, zK.GET_PARAMETER, zK.SET_PARAMETER, zK.REDIRECT, zK.RECORD, zK.FLUSH, zK.GET, zK.POST];
    cRA.METHOD_MAP = hRK.enumToMap(zK);
    cRA.H_METHOD_MAP = {};
    Object.keys(cRA.METHOD_MAP).forEach((A) => {
        if (/^H/.test(A)) cRA.H_METHOD_MAP[A] = cRA.METHOD_MAP[A]
    });
    var xRK;
    (function(A) {
        A[A.SAFE = 0] = "SAFE", A[A.SAFE_WITH_CB = 1] = "SAFE_WITH_CB", A[A.UNSAFE = 2] = "UNSAFE"
    })(xRK = cRA.FINISH || (cRA.FINISH = {}));
    cRA.ALPHA = [];
    for (let A = 65; A <= 90; A++) cRA.ALPHA.push(String.fromCharCode(A)), cRA.ALPHA.push(String.fromCharCode(A + 32));
    cRA.NUM_MAP = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9
    };
    cRA.HEX_MAP = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        A: 10,
        B: 11,
        C: 12,
        D: 13,
        E: 14,
        F: 15,
        a: 10,
        b: 11,
        c: 12,
        d: 13,
        e: 14,
        f: 15
    };
    cRA.NUM = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    cRA.ALPHANUM = cRA.ALPHA.concat(cRA.NUM);
    cRA.MARK = ["-", "_", ".", "!", "~", "*", "'", "(", ")"];
    cRA.USERINFO_CHARS = cRA.ALPHANUM.concat(cRA.MARK).concat(["%", ";", ":", "&", "=", "+", "$", ","]);
    cRA.STRICT_URL_CHAR = ["!", '"', "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "@", "[", "\\", "]", "^", "_", "`", "{", "|", "}", "~"].concat(cRA.ALPHANUM);
    cRA.URL_CHAR = cRA.STRICT_URL_CHAR.concat(["\t", "\f"]);
    for (let A = 128; A <= 255; A++) cRA.URL_CHAR.push(A);
    cRA.HEX = cRA.NUM.concat(["a", "b", "c", "d", "e", "f", "A", "B", "C", "D", "E", "F"]);
    cRA.STRICT_TOKEN = ["!", "#", "$", "%", "&", "'", "*", "+", "-", ".", "^", "_", "`", "|", "~"].concat(cRA.ALPHANUM);
    cRA.TOKEN = cRA.STRICT_TOKEN.concat([" "]);
    cRA.HEADER_CHARS = ["\t"];
    for (let A = 32; A <= 255; A++)
        if (A !== 127) cRA.HEADER_CHARS.push(A);
    cRA.CONNECTION_TOKEN_CHARS = cRA.HEADER_CHARS.filter((A) => A !== 44);
    cRA.MAJOR = cRA.NUM_MAP;
    cRA.MINOR = cRA.MAJOR;
    var WH6;
    (function(A) {
        A[A.GENERAL = 0] = "GENERAL", A[A.CONNECTION = 1] = "CONNECTION", A[A.CONTENT_LENGTH = 2] = "CONTENT_LENGTH", A[A.TRANSFER_ENCODING = 3] = "TRANSFER_ENCODING", A[A.UPGRADE = 4] = "UPGRADE", A[A.CONNECTION_KEEP_ALIVE = 5] = "CONNECTION_KEEP_ALIVE", A[A.CONNECTION_CLOSE = 6] = "CONNECTION_CLOSE", A[A.CONNECTION_UPGRADE = 7] = "CONNECTION_UPGRADE", A[A.TRANSFER_ENCODING_CHUNKED = 8] = "TRANSFER_ENCODING_CHUNKED"
    })(WH6 = cRA.HEADER_STATE || (cRA.HEADER_STATE = {}));
    cRA.SPECIAL_HEADERS = {
        connection: WH6.CONNECTION,
        "content-length": WH6.CONTENT_LENGTH,
        "proxy-connection": WH6.CONNECTION,
        "transfer-encoding": WH6.TRANSFER_ENCODING,
        upgrade: WH6.UPGRADE
    }
})