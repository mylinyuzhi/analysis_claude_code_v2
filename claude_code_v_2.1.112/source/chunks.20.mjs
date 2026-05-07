
// @from(Ln 52969, Col 4)
aA = p((g9O, GQ7) => {
    var LU7 = Symbol.for("undici.error.UND_ERR");
    class qJ extends Error {
        constructor(q) {
            super(q);
            this.name = "UndiciError", this.code = "UND_ERR"
        }
        static[Symbol.hasInstance](q) {
            return q && q[LU7] === !0
        } [LU7] = !0
    }
    var hU7 = Symbol.for("undici.error.UND_ERR_CONNECT_TIMEOUT");
    class sU7 extends qJ {
        constructor(q) {
            super(q);
            this.name = "ConnectTimeoutError", this.message = q || "Connect Timeout Error", this.code = "UND_ERR_CONNECT_TIMEOUT"
        }
        static[Symbol.hasInstance](q) {
            return q && q[hU7] === !0
        } [hU7] = !0
    }
    var RU7 = Symbol.for("undici.error.UND_ERR_HEADERS_TIMEOUT");
    class tU7 extends qJ {
        constructor(q) {
            super(q);
            this.name = "HeadersTimeoutError", this.message = q || "Headers Timeout Error", this.code = "UND_ERR_HEADERS_TIMEOUT"
        }
        static[Symbol.hasInstance](q) {
            return q && q[RU7] === !0
        } [RU7] = !0
    }
    var SU7 = Symbol.for("undici.error.UND_ERR_HEADERS_OVERFLOW");
    class eU7 extends qJ {
        constructor(q) {
            super(q);
            this.name = "HeadersOverflowError", this.message = q || "Headers Overflow Error", this.code = "UND_ERR_HEADERS_OVERFLOW"
        }
        static[Symbol.hasInstance](q) {
            return q && q[SU7] === !0
        } [SU7] = !0
    }
    var CU7 = Symbol.for("undici.error.UND_ERR_BODY_TIMEOUT");
    class qQ7 extends qJ {
        constructor(q) {
            super(q);
            this.name = "BodyTimeoutError", this.message = q || "Body Timeout Error", this.code = "UND_ERR_BODY_TIMEOUT"
        }
        static[Symbol.hasInstance](q) {
            return q && q[CU7] === !0
        } [CU7] = !0
    }
    var bU7 = Symbol.for("undici.error.UND_ERR_RESPONSE_STATUS_CODE");
    class KQ7 extends qJ {
        constructor(q, K, _, z) {
            super(q);
            this.name = "ResponseStatusCodeError", this.message = q || "Response Status Code Error", this.code = "UND_ERR_RESPONSE_STATUS_CODE", this.body = z, this.status = K, this.statusCode = K, this.headers = _
        }
        static[Symbol.hasInstance](q) {
            return q && q[bU7] === !0
        } [bU7] = !0
    }
    var IU7 = Symbol.for("undici.error.UND_ERR_INVALID_ARG");
    class _Q7 extends qJ {
        constructor(q) {
            super(q);
            this.name = "InvalidArgumentError", this.message = q || "Invalid Argument Error", this.code = "UND_ERR_INVALID_ARG"
        }
        static[Symbol.hasInstance](q) {
            return q && q[IU7] === !0
        } [IU7] = !0
    }
    var xU7 = Symbol.for("undici.error.UND_ERR_INVALID_RETURN_VALUE");
    class zQ7 extends qJ {
        constructor(q) {
            super(q);
            this.name = "InvalidReturnValueError", this.message = q || "Invalid Return Value Error", this.code = "UND_ERR_INVALID_RETURN_VALUE"
        }
        static[Symbol.hasInstance](q) {
            return q && q[xU7] === !0
        } [xU7] = !0
    }
    var uU7 = Symbol.for("undici.error.UND_ERR_ABORT");
    class rO1 extends qJ {
        constructor(q) {
            super(q);
            this.name = "AbortError", this.message = q || "The operation was aborted", this.code = "UND_ERR_ABORT"
        }
        static[Symbol.hasInstance](q) {
            return q && q[uU7] === !0
        } [uU7] = !0
    }
    var mU7 = Symbol.for("undici.error.UND_ERR_ABORTED");
    class YQ7 extends rO1 {
        constructor(q) {
            super(q);
            this.name = "AbortError", this.message = q || "Request aborted", this.code = "UND_ERR_ABORTED"
        }
        static[Symbol.hasInstance](q) {
            return q && q[mU7] === !0
        } [mU7] = !0
    }
    var BU7 = Symbol.for("undici.error.UND_ERR_INFO");
    class AQ7 extends qJ {
        constructor(q) {
            super(q);
            this.name = "InformationalError", this.message = q || "Request information", this.code = "UND_ERR_INFO"
        }
        static[Symbol.hasInstance](q) {
            return q && q[BU7] === !0
        } [BU7] = !0
    }
    var pU7 = Symbol.for("undici.error.UND_ERR_REQ_CONTENT_LENGTH_MISMATCH");
    class OQ7 extends qJ {
        constructor(q) {
            super(q);
            this.name = "RequestContentLengthMismatchError", this.message = q || "Request body length does not match content-length header", this.code = "UND_ERR_REQ_CONTENT_LENGTH_MISMATCH"
        }
        static[Symbol.hasInstance](q) {
            return q && q[pU7] === !0
        } [pU7] = !0
    }
    var FU7 = Symbol.for("undici.error.UND_ERR_RES_CONTENT_LENGTH_MISMATCH");
    class wQ7 extends qJ {
        constructor(q) {
            super(q);
            this.name = "ResponseContentLengthMismatchError", this.message = q || "Response body length does not match content-length header", this.code = "UND_ERR_RES_CONTENT_LENGTH_MISMATCH"
        }
        static[Symbol.hasInstance](q) {
            return q && q[FU7] === !0
        } [FU7] = !0
    }
    var gU7 = Symbol.for("undici.error.UND_ERR_DESTROYED");
    class $Q7 extends qJ {
        constructor(q) {
            super(q);
            this.name = "ClientDestroyedError", this.message = q || "The client is destroyed", this.code = "UND_ERR_DESTROYED"
        }
        static[Symbol.hasInstance](q) {
            return q && q[gU7] === !0
        } [gU7] = !0
    }
    var UU7 = Symbol.for("undici.error.UND_ERR_CLOSED");
    class jQ7 extends qJ {
        constructor(q) {
            super(q);
            this.name = "ClientClosedError", this.message = q || "The client is closed", this.code = "UND_ERR_CLOSED"
        }
        static[Symbol.hasInstance](q) {
            return q && q[UU7] === !0
        } [UU7] = !0
    }
    var QU7 = Symbol.for("undici.error.UND_ERR_SOCKET");
    class HQ7 extends qJ {
        constructor(q, K) {
            super(q);
            this.name = "SocketError", this.message = q || "Socket error", this.code = "UND_ERR_SOCKET", this.socket = K
        }
        static[Symbol.hasInstance](q) {
            return q && q[QU7] === !0
        } [QU7] = !0
    }
    var dU7 = Symbol.for("undici.error.UND_ERR_NOT_SUPPORTED");
    class JQ7 extends qJ {
        constructor(q) {
            super(q);
            this.name = "NotSupportedError", this.message = q || "Not supported error", this.code = "UND_ERR_NOT_SUPPORTED"
        }
        static[Symbol.hasInstance](q) {
            return q && q[dU7] === !0
        } [dU7] = !0
    }
    var cU7 = Symbol.for("undici.error.UND_ERR_BPL_MISSING_UPSTREAM");
    class XQ7 extends qJ {
        constructor(q) {
            super(q);
            this.name = "MissingUpstreamError", this.message = q || "No upstream has been added to the BalancedPool", this.code = "UND_ERR_BPL_MISSING_UPSTREAM"
        }
        static[Symbol.hasInstance](q) {
            return q && q[cU7] === !0
        } [cU7] = !0
    }
    var lU7 = Symbol.for("undici.error.UND_ERR_HTTP_PARSER");
    class MQ7 extends Error {
        constructor(q, K, _) {
            super(q);
            this.name = "HTTPParserError", this.code = K ? `HPE_${K}` : void 0, this.data = _ ? _.toString() : void 0
        }
        static[Symbol.hasInstance](q) {
            return q && q[lU7] === !0
        } [lU7] = !0
    }
    var nU7 = Symbol.for("undici.error.UND_ERR_RES_EXCEEDED_MAX_SIZE");
    class PQ7 extends qJ {
        constructor(q) {
            super(q);
            this.name = "ResponseExceededMaxSizeError", this.message = q || "Response content exceeded max size", this.code = "UND_ERR_RES_EXCEEDED_MAX_SIZE"
        }
        static[Symbol.hasInstance](q) {
            return q && q[nU7] === !0
        } [nU7] = !0
    }
    var iU7 = Symbol.for("undici.error.UND_ERR_REQ_RETRY");
    class WQ7 extends qJ {
        constructor(q, K, {
            headers: _,
            data: z
        }) {
            super(q);
            this.name = "RequestRetryError", this.message = q || "Request retry error", this.code = "UND_ERR_REQ_RETRY", this.statusCode = K, this.data = z, this.headers = _
        }
        static[Symbol.hasInstance](q) {
            return q && q[iU7] === !0
        } [iU7] = !0
    }
    var rU7 = Symbol.for("undici.error.UND_ERR_RESPONSE");
    class DQ7 extends qJ {
        constructor(q, K, {
            headers: _,
            data: z
        }) {
            super(q);
            this.name = "ResponseError", this.message = q || "Response error", this.code = "UND_ERR_RESPONSE", this.statusCode = K, this.data = z, this.headers = _
        }
        static[Symbol.hasInstance](q) {
            return q && q[rU7] === !0
        } [rU7] = !0
    }
    var oU7 = Symbol.for("undici.error.UND_ERR_PRX_TLS");
    class ZQ7 extends qJ {
        constructor(q, K, _) {
            super(K, {
                cause: q,
                ..._ ?? {}
            });
            this.name = "SecureProxyConnectionError", this.message = K || "Secure Proxy Connection failed", this.code = "UND_ERR_PRX_TLS", this.cause = q
        }
        static[Symbol.hasInstance](q) {
            return q && q[oU7] === !0
        } [oU7] = !0
    }
    var aU7 = Symbol.for("undici.error.UND_ERR_WS_MESSAGE_SIZE_EXCEEDED");
    class fQ7 extends qJ {
        constructor(q) {
            super(q);
            this.name = "MessageSizeExceededError", this.message = q || "Max decompressed message size exceeded", this.code = "UND_ERR_WS_MESSAGE_SIZE_EXCEEDED"
        }
        static[Symbol.hasInstance](q) {
            return q && q[aU7] === !0
        }
        get[aU7]() {
            return !0
        }
    }
    GQ7.exports = {
        AbortError: rO1,
        HTTPParserError: MQ7,
        UndiciError: qJ,
        HeadersTimeoutError: tU7,
        HeadersOverflowError: eU7,
        BodyTimeoutError: qQ7,
        RequestContentLengthMismatchError: OQ7,
        ConnectTimeoutError: sU7,
        ResponseStatusCodeError: KQ7,
        InvalidArgumentError: _Q7,
        InvalidReturnValueError: zQ7,
        RequestAbortedError: YQ7,
        ClientDestroyedError: $Q7,
        ClientClosedError: jQ7,
        InformationalError: AQ7,
        SocketError: HQ7,
        NotSupportedError: JQ7,
        ResponseContentLengthMismatchError: wQ7,
        BalancedPoolMissingUpstreamError: XQ7,
        ResponseExceededMaxSizeError: PQ7,
        RequestRetryError: WQ7,
        ResponseError: DQ7,
        SecureProxyConnectionError: ZQ7,
        MessageSizeExceededError: fQ7
    }
})
// @from(Ln 53249, Col 4)
xX8 = p((U9O, vQ7) => {
    var IX8 = {},
        oO1 = ["Accept", "Accept-Encoding", "Accept-Language", "Accept-Ranges", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Origin", "Access-Control-Expose-Headers", "Access-Control-Max-Age", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Age", "Allow", "Alt-Svc", "Alt-Used", "Authorization", "Cache-Control", "Clear-Site-Data", "Connection", "Content-Disposition", "Content-Encoding", "Content-Language", "Content-Length", "Content-Location", "Content-Range", "Content-Security-Policy", "Content-Security-Policy-Report-Only", "Content-Type", "Cookie", "Cross-Origin-Embedder-Policy", "Cross-Origin-Opener-Policy", "Cross-Origin-Resource-Policy", "Date", "Device-Memory", "Downlink", "ECT", "ETag", "Expect", "Expect-CT", "Expires", "Forwarded", "From", "Host", "If-Match", "If-Modified-Since", "If-None-Match", "If-Range", "If-Unmodified-Since", "Keep-Alive", "Last-Modified", "Link", "Location", "Max-Forwards", "Origin", "Permissions-Policy", "Pragma", "Proxy-Authenticate", "Proxy-Authorization", "RTT", "Range", "Referer", "Referrer-Policy", "Refresh", "Retry-After", "Sec-WebSocket-Accept", "Sec-WebSocket-Extensions", "Sec-WebSocket-Key", "Sec-WebSocket-Protocol", "Sec-WebSocket-Version", "Server", "Server-Timing", "Service-Worker-Allowed", "Service-Worker-Navigation-Preload", "Set-Cookie", "SourceMap", "Strict-Transport-Security", "Supports-Loading-Mode", "TE", "Timing-Allow-Origin", "Trailer", "Transfer-Encoding", "Upgrade", "Upgrade-Insecure-Requests", "User-Agent", "Vary", "Via", "WWW-Authenticate", "X-Content-Type-Options", "X-DNS-Prefetch-Control", "X-Frame-Options", "X-Permitted-Cross-Domain-Policies", "X-Powered-By", "X-Requested-With", "X-XSS-Protection"];
    for (let q = 0; q < oO1.length; ++q) {
        let K = oO1[q],
            _ = K.toLowerCase();
        IX8[K] = IX8[_] = _
    }
    Object.setPrototypeOf(IX8, null);
    vQ7.exports = {
        wellknownHeaderNames: oO1,
        headerNameLowerCasedRecord: IX8
    }
})
// @from(Ln 53263, Col 4)
NQ7 = p((Q9O, kQ7) => {
    var {
        wellknownHeaderNames: TQ7,
        headerNameLowerCasedRecord: Pr5
    } = xX8();
    class XG6 {
        value = null;
        left = null;
        middle = null;
        right = null;
        code;
        constructor(q, K, _) {
            if (_ === void 0 || _ >= q.length) throw TypeError("Unreachable");
            if ((this.code = q.charCodeAt(_)) > 127) throw TypeError("key must be ascii string");
            if (q.length !== ++_) this.middle = new XG6(q, K, _);
            else this.value = K
        }
        add(q, K) {
            let _ = q.length;
            if (_ === 0) throw TypeError("Unreachable");
            let z = 0,
                Y = this;
            while (!0) {
                let A = q.charCodeAt(z);
                if (A > 127) throw TypeError("key must be ascii string");
                if (Y.code === A)
                    if (_ === ++z) {
                        Y.value = K;
                        break
                    } else if (Y.middle !== null) Y = Y.middle;
                else {
                    Y.middle = new XG6(q, K, z);
                    break
                } else if (Y.code < A)
                    if (Y.left !== null) Y = Y.left;
                    else {
                        Y.left = new XG6(q, K, z);
                        break
                    }
                else if (Y.right !== null) Y = Y.right;
                else {
                    Y.right = new XG6(q, K, z);
                    break
                }
            }
        }
        search(q) {
            let K = q.length,
                _ = 0,
                z = this;
            while (z !== null && _ < K) {
                let Y = q[_];
                if (Y <= 90 && Y >= 65) Y |= 32;
                while (z !== null) {
                    if (Y === z.code) {
                        if (K === ++_) return z;
                        z = z.middle;
                        break
                    }
                    z = z.code < Y ? z.left : z.right
                }
            }
            return null
        }
    }
    class aO1 {
        node = null;
        insert(q, K) {
            if (this.node === null) this.node = new XG6(q, K, 0);
            else this.node.add(q, K)
        }
        lookup(q) {
            return this.node?.search(q)?.value ?? null
        }
    }
    var VQ7 = new aO1;
    for (let q = 0; q < TQ7.length; ++q) {
        let K = Pr5[TQ7[q]];
        VQ7.insert(K, K)
    }
    kQ7.exports = {
        TernarySearchTree: aO1,
        tree: VQ7
    }
})
// @from(Ln 53348, Col 4)
Hz = p((d9O, gQ7) => {
    var lQ6 = d6("node:assert"),
        {
            kDestroyed: yQ7,
            kBodyUsed: MG6,
            kListeners: sO1,
            kBody: EQ7
        } = oj(),
        {
            IncomingMessage: Wr5
        } = d6("node:http"),
        mX8 = d6("node:stream"),
        Dr5 = d6("node:net"),
        {
            Blob: Zr5
        } = d6("node:buffer"),
        fr5 = d6("node:util"),
        {
            stringify: Gr5
        } = d6("node:querystring"),
        {
            EventEmitter: vr5
        } = d6("node:events"),
        {
            InvalidArgumentError: r0
        } = aA(),
        {
            headerNameLowerCasedRecord: Tr5
        } = xX8(),
        {
            tree: LQ7
        } = NQ7(),
        [Vr5, kr5] = process.versions.node.split(".").map((q) => Number(q));
    class tO1 {
        constructor(q) {
            this[EQ7] = q, this[MG6] = !1
        }
        async * [Symbol.asyncIterator]() {
            lQ6(!this[MG6], "disturbed"), this[MG6] = !0, yield* this[EQ7]
        }
    }

    function Nr5(q) {
        if (BX8(q)) {
            if (bQ7(q) === 0) q.on("data", function() {
                lQ6(!1)
            });
            if (typeof q.readableDidRead !== "boolean") q[MG6] = !1, vr5.prototype.on.call(q, "data", function() {
                this[MG6] = !0
            });
            return q
        } else if (q && typeof q.pipeTo === "function") return new tO1(q);
        else if (q && typeof q !== "string" && !ArrayBuffer.isView(q) && CQ7(q)) return new tO1(q);
        else return q
    }

    function Er5() {}

    function BX8(q) {
        return q && typeof q === "object" && typeof q.pipe === "function" && typeof q.on === "function"
    }

    function hQ7(q) {
        if (q === null) return !1;
        else if (q instanceof Zr5) return !0;
        else if (typeof q !== "object") return !1;
        else {
            let K = q[Symbol.toStringTag];
            return (K === "Blob" || K === "File") && (("stream" in q) && typeof q.stream === "function" || ("arrayBuffer" in q) && typeof q.arrayBuffer === "function")
        }
    }

    function yr5(q, K) {
        if (q.includes("?") || q.includes("#")) throw Error('Query params cannot be passed when url already contains "?" or "#".');
        let _ = Gr5(K);
        if (_) q += "?" + _;
        return q
    }

    function RQ7(q) {
        let K = parseInt(q, 10);
        return K === Number(q) && K >= 0 && K <= 65535
    }

    function uX8(q) {
        return q != null && q[0] === "h" && q[1] === "t" && q[2] === "t" && q[3] === "p" && (q[4] === ":" || q[4] === "s" && q[5] === ":")
    }

    function SQ7(q) {
        if (typeof q === "string") {
            if (q = new URL(q), !uX8(q.origin || q.protocol)) throw new r0("Invalid URL protocol: the URL must start with `http:` or `https:`.");
            return q
        }
        if (!q || typeof q !== "object") throw new r0("Invalid URL: The URL argument must be a non-null object.");
        if (!(q instanceof URL)) {
            if (q.port != null && q.port !== "" && RQ7(q.port) === !1) throw new r0("Invalid URL: port must be a valid integer or a string representation of an integer.");
            if (q.path != null && typeof q.path !== "string") throw new r0("Invalid URL path: the path must be a string or null/undefined.");
            if (q.pathname != null && typeof q.pathname !== "string") throw new r0("Invalid URL pathname: the pathname must be a string or null/undefined.");
            if (q.hostname != null && typeof q.hostname !== "string") throw new r0("Invalid URL hostname: the hostname must be a string or null/undefined.");
            if (q.origin != null && typeof q.origin !== "string") throw new r0("Invalid URL origin: the origin must be a string or null/undefined.");
            if (!uX8(q.origin || q.protocol)) throw new r0("Invalid URL protocol: the URL must start with `http:` or `https:`.");
            let K = q.port != null ? q.port : q.protocol === "https:" ? 443 : 80,
                _ = q.origin != null ? q.origin : `${q.protocol||""}//${q.hostname||""}:${K}`,
                z = q.path != null ? q.path : `${q.pathname||""}${q.search||""}`;
            if (_[_.length - 1] === "/") _ = _.slice(0, _.length - 1);
            if (z && z[0] !== "/") z = `/${z}`;
            return new URL(`${_}${z}`)
        }
        if (!uX8(q.origin || q.protocol)) throw new r0("Invalid URL protocol: the URL must start with `http:` or `https:`.");
        return q
    }

    function Lr5(q) {
        if (q = SQ7(q), q.pathname !== "/" || q.search || q.hash) throw new r0("invalid url");
        return q
    }

    function hr5(q) {
        if (q[0] === "[") {
            let _ = q.indexOf("]");
            return lQ6(_ !== -1), q.substring(1, _)
        }
        let K = q.indexOf(":");
        if (K === -1) return q;
        return q.substring(0, K)
    }

    function Rr5(q) {
        if (!q) return null;
        lQ6(typeof q === "string");
        let K = hr5(q);
        if (Dr5.isIP(K)) return "";
        return K
    }

    function Sr5(q) {
        return JSON.parse(JSON.stringify(q))
    }

    function Cr5(q) {
        return q != null && typeof q[Symbol.asyncIterator] === "function"
    }

    function CQ7(q) {
        return q != null && (typeof q[Symbol.iterator] === "function" || typeof q[Symbol.asyncIterator] === "function")
    }

    function bQ7(q) {
        if (q == null) return 0;
        else if (BX8(q)) {
            let K = q._readableState;
            return K && K.objectMode === !1 && K.ended === !0 && Number.isFinite(K.length) ? K.length : null
        } else if (hQ7(q)) return q.size != null ? q.size : null;
        else if (uQ7(q)) return q.byteLength;
        return null
    }

    function IQ7(q) {
        return q && !!(q.destroyed || q[yQ7] || mX8.isDestroyed?.(q))
    }

    function br5(q, K) {
        if (q == null || !BX8(q) || IQ7(q)) return;
        if (typeof q.destroy === "function") {
            if (Object.getPrototypeOf(q).constructor === Wr5) q.socket = null;
            q.destroy(K)
        } else if (K) queueMicrotask(() => {
            q.emit("error", K)
        });
        if (q.destroyed !== !0) q[yQ7] = !0
    }
    var Ir5 = /timeout=(\d+)/;

    function xr5(q) {
        let K = q.toString().match(Ir5);
        return K ? parseInt(K[1], 10) * 1000 : null
    }

    function xQ7(q) {
        return typeof q === "string" ? Tr5[q] ?? q.toLowerCase() : LQ7.lookup(q) ?? q.toString("latin1").toLowerCase()
    }

    function ur5(q) {
        return LQ7.lookup(q) ?? q.toString("latin1").toLowerCase()
    }

    function mr5(q, K) {
        if (K === void 0) K = {};
        for (let _ = 0; _ < q.length; _ += 2) {
            let z = xQ7(q[_]),
                Y = K[z];
            if (Y) {
                if (typeof Y === "string") Y = [Y], K[z] = Y;
                Y.push(q[_ + 1].toString("utf8"))
            } else {
                let A = q[_ + 1];
                if (typeof A === "string") K[z] = A;
                else K[z] = Array.isArray(A) ? A.map((O) => O.toString("utf8")) : A.toString("utf8")
            }
        }
        if ("content-length" in K && "content-disposition" in K) K["content-disposition"] = Buffer.from(K["content-disposition"]).toString("latin1");
        return K
    }

    function Br5(q) {
        let K = q.length,
            _ = Array(K),
            z = !1,
            Y = -1,
            A, O, w = 0;
        for (let $ = 0; $ < q.length; $ += 2) {
            if (A = q[$], O = q[$ + 1], typeof A !== "string" && (A = A.toString()), typeof O !== "string" && (O = O.toString("utf8")), w = A.length, w === 14 && A[7] === "-" && (A === "content-length" || A.toLowerCase() === "content-length")) z = !0;
            else if (w === 19 && A[7] === "-" && (A === "content-disposition" || A.toLowerCase() === "content-disposition")) Y = $ + 1;
            _[$] = A, _[$ + 1] = O
        }
        if (z && Y !== -1) _[Y] = Buffer.from(_[Y]).toString("latin1");
        return _
    }

    function uQ7(q) {
        return q instanceof Uint8Array || Buffer.isBuffer(q)
    }

    function pr5(q, K, _) {
        if (!q || typeof q !== "object") throw new r0("handler must be an object");
        if (typeof q.onConnect !== "function") throw new r0("invalid onConnect method");
        if (typeof q.onError !== "function") throw new r0("invalid onError method");
        if (typeof q.onBodySent !== "function" && q.onBodySent !== void 0) throw new r0("invalid onBodySent method");
        if (_ || K === "CONNECT") {
            if (typeof q.onUpgrade !== "function") throw new r0("invalid onUpgrade method")
        } else {
            if (typeof q.onHeaders !== "function") throw new r0("invalid onHeaders method");
            if (typeof q.onData !== "function") throw new r0("invalid onData method");
            if (typeof q.onComplete !== "function") throw new r0("invalid onComplete method")
        }
    }

    function Fr5(q) {
        return !!(q && (mX8.isDisturbed(q) || q[MG6]))
    }

    function gr5(q) {
        return !!(q && mX8.isErrored(q))
    }

    function Ur5(q) {
        return !!(q && mX8.isReadable(q))
    }

    function Qr5(q) {
        return {
            localAddress: q.localAddress,
            localPort: q.localPort,
            remoteAddress: q.remoteAddress,
            remotePort: q.remotePort,
            remoteFamily: q.remoteFamily,
            timeout: q.timeout,
            bytesWritten: q.bytesWritten,
            bytesRead: q.bytesRead
        }
    }

    function dr5(q) {
        let K;
        return new ReadableStream({
            async start() {
                K = q[Symbol.asyncIterator]()
            },
            async pull(_) {
                let {
                    done: z,
                    value: Y
                } = await K.next();
                if (z) queueMicrotask(() => {
                    _.close(), _.byobRequest?.respond(0)
                });
                else {
                    let A = Buffer.isBuffer(Y) ? Y : Buffer.from(Y);
                    if (A.byteLength) _.enqueue(new Uint8Array(A))
                }
                return _.desiredSize > 0
            },
            async cancel(_) {
                await K.return()
            },
            type: "bytes"
        })
    }

    function cr5(q) {
        return q && typeof q === "object" && typeof q.append === "function" && typeof q.delete === "function" && typeof q.get === "function" && typeof q.getAll === "function" && typeof q.has === "function" && typeof q.set === "function" && q[Symbol.toStringTag] === "FormData"
    }

    function lr5(q, K) {
        if ("addEventListener" in q) return q.addEventListener("abort", K, {
            once: !0
        }), () => q.removeEventListener("abort", K);
        return q.addListener("abort", K), () => q.removeListener("abort", K)
    }
    var nr5 = typeof String.prototype.toWellFormed === "function",
        ir5 = typeof String.prototype.isWellFormed === "function";

    function mQ7(q) {
        return nr5 ? `${q}`.toWellFormed() : fr5.toUSVString(q)
    }

    function rr5(q) {
        return ir5 ? `${q}`.isWellFormed() : mQ7(q) === `${q}`
    }

    function BQ7(q) {
        switch (q) {
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
                return q >= 33 && q <= 126
        }
    }

    function or5(q) {
        if (q.length === 0) return !1;
        for (let K = 0; K < q.length; ++K)
            if (!BQ7(q.charCodeAt(K))) return !1;
        return !0
    }
    var ar5 = /[^\t\x20-\x7e\x80-\xff]/;

    function sr5(q) {
        return !ar5.test(q)
    }

    function tr5(q) {
        if (q == null || q === "") return {
            start: 0,
            end: null,
            size: null
        };
        let K = q ? q.match(/^bytes (\d+)-(\d+)\/(\d+)?$/) : null;
        return K ? {
            start: parseInt(K[1]),
            end: K[2] ? parseInt(K[2]) : null,
            size: K[3] ? parseInt(K[3]) : null
        } : null
    }

    function er5(q, K, _) {
        return (q[sO1] ??= []).push([K, _]), q.on(K, _), q
    }

    function qo5(q) {
        for (let [K, _] of q[sO1] ?? []) q.removeListener(K, _);
        q[sO1] = null
    }

    function Ko5(q, K, _) {
        try {
            K.onError(_), lQ6(K.aborted)
        } catch (z) {
            q.emit("error", z)
        }
    }
    var pQ7 = Object.create(null);
    pQ7.enumerable = !0;
    var eO1 = {
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
        FQ7 = {
            ...eO1,
            patch: "patch",
            PATCH: "PATCH"
        };
    Object.setPrototypeOf(eO1, null);
    Object.setPrototypeOf(FQ7, null);
    gQ7.exports = {
        kEnumerableProperty: pQ7,
        nop: Er5,
        isDisturbed: Fr5,
        isErrored: gr5,
        isReadable: Ur5,
        toUSVString: mQ7,
        isUSVString: rr5,
        isBlobLike: hQ7,
        parseOrigin: Lr5,
        parseURL: SQ7,
        getServerName: Rr5,
        isStream: BX8,
        isIterable: CQ7,
        isAsyncIterable: Cr5,
        isDestroyed: IQ7,
        headerNameToString: xQ7,
        bufferToLowerCasedHeaderName: ur5,
        addListener: er5,
        removeAllListeners: qo5,
        errorRequest: Ko5,
        parseRawHeaders: Br5,
        parseHeaders: mr5,
        parseKeepAliveTimeout: xr5,
        destroy: br5,
        bodyLength: bQ7,
        deepClone: Sr5,
        ReadableStreamFrom: dr5,
        isBuffer: uQ7,
        validateHandler: pr5,
        getSocketInfo: Qr5,
        isFormDataLike: cr5,
        buildURL: yr5,
        addAbortListener: lr5,
        isValidHTTPToken: or5,
        isValidHeaderValue: sr5,
        isTokenCharCode: BQ7,
        parseRangeHeader: tr5,
        normalizedMethodRecordsBase: eO1,
        normalizedMethodRecords: FQ7,
        isValidPort: RQ7,
        isHttpOrHttpsPrefixed: uX8,
        nodeMajor: Vr5,
        nodeMinor: kr5,
        safeHTTPMethods: ["GET", "HEAD", "OPTIONS", "TRACE"],
        wrapRequestBody: Nr5
    }
})
// @from(Ln 53796, Col 4)
PG6 = p((c9O, QQ7) => {
    var BO = d6("node:diagnostics_channel"),
        Kw1 = d6("node:util"),
        pX8 = Kw1.debuglog("undici"),
        qw1 = Kw1.debuglog("fetch"),
        cA6 = Kw1.debuglog("websocket"),
        UQ7 = !1,
        _o5 = {
            beforeConnect: BO.channel("undici:client:beforeConnect"),
            connected: BO.channel("undici:client:connected"),
            connectError: BO.channel("undici:client:connectError"),
            sendHeaders: BO.channel("undici:client:sendHeaders"),
            create: BO.channel("undici:request:create"),
            bodySent: BO.channel("undici:request:bodySent"),
            headers: BO.channel("undici:request:headers"),
            trailers: BO.channel("undici:request:trailers"),
            error: BO.channel("undici:request:error"),
            open: BO.channel("undici:websocket:open"),
            close: BO.channel("undici:websocket:close"),
            socketError: BO.channel("undici:websocket:socket_error"),
            ping: BO.channel("undici:websocket:ping"),
            pong: BO.channel("undici:websocket:pong")
        };
    if (pX8.enabled || qw1.enabled) {
        let q = qw1.enabled ? qw1 : pX8;
        BO.channel("undici:client:beforeConnect").subscribe((K) => {
            let {
                connectParams: {
                    version: _,
                    protocol: z,
                    port: Y,
                    host: A
                }
            } = K;
            q("connecting to %s using %s%s", `${A}${Y?`:${Y}`:""}`, z, _)
        }), BO.channel("undici:client:connected").subscribe((K) => {
            let {
                connectParams: {
                    version: _,
                    protocol: z,
                    port: Y,
                    host: A
                }
            } = K;
            q("connected to %s using %s%s", `${A}${Y?`:${Y}`:""}`, z, _)
        }), BO.channel("undici:client:connectError").subscribe((K) => {
            let {
                connectParams: {
                    version: _,
                    protocol: z,
                    port: Y,
                    host: A
                },
                error: O
            } = K;
            q("connection to %s using %s%s errored - %s", `${A}${Y?`:${Y}`:""}`, z, _, O.message)
        }), BO.channel("undici:client:sendHeaders").subscribe((K) => {
            let {
                request: {
                    method: _,
                    path: z,
                    origin: Y
                }
            } = K;
            q("sending request to %s %s/%s", _, Y, z)
        }), BO.channel("undici:request:headers").subscribe((K) => {
            let {
                request: {
                    method: _,
                    path: z,
                    origin: Y
                },
                response: {
                    statusCode: A
                }
            } = K;
            q("received response to %s %s/%s - HTTP %d", _, Y, z, A)
        }), BO.channel("undici:request:trailers").subscribe((K) => {
            let {
                request: {
                    method: _,
                    path: z,
                    origin: Y
                }
            } = K;
            q("trailers received from %s %s/%s", _, Y, z)
        }), BO.channel("undici:request:error").subscribe((K) => {
            let {
                request: {
                    method: _,
                    path: z,
                    origin: Y
                },
                error: A
            } = K;
            q("request to %s %s/%s errored - %s", _, Y, z, A.message)
        }), UQ7 = !0
    }
    if (cA6.enabled) {
        if (!UQ7) {
            let q = pX8.enabled ? pX8 : cA6;
            BO.channel("undici:client:beforeConnect").subscribe((K) => {
                let {
                    connectParams: {
                        version: _,
                        protocol: z,
                        port: Y,
                        host: A
                    }
                } = K;
                q("connecting to %s%s using %s%s", A, Y ? `:${Y}` : "", z, _)
            }), BO.channel("undici:client:connected").subscribe((K) => {
                let {
                    connectParams: {
                        version: _,
                        protocol: z,
                        port: Y,
                        host: A
                    }
                } = K;
                q("connected to %s%s using %s%s", A, Y ? `:${Y}` : "", z, _)
            }), BO.channel("undici:client:connectError").subscribe((K) => {
                let {
                    connectParams: {
                        version: _,
                        protocol: z,
                        port: Y,
                        host: A
                    },
                    error: O
                } = K;
                q("connection to %s%s using %s%s errored - %s", A, Y ? `:${Y}` : "", z, _, O.message)
            }), BO.channel("undici:client:sendHeaders").subscribe((K) => {
                let {
                    request: {
                        method: _,
                        path: z,
                        origin: Y
                    }
                } = K;
                q("sending request to %s %s/%s", _, Y, z)
            })
        }
        BO.channel("undici:websocket:open").subscribe((q) => {
            let {
                address: {
                    address: K,
                    port: _
                }
            } = q;
            cA6("connection opened %s%s", K, _ ? `:${_}` : "")
        }), BO.channel("undici:websocket:close").subscribe((q) => {
            let {
                websocket: K,
                code: _,
                reason: z
            } = q;
            cA6("closed connection to %s - %s %s", K.url, _, z)
        }), BO.channel("undici:websocket:socket_error").subscribe((q) => {
            cA6("connection errored - %s", q.message)
        }), BO.channel("undici:websocket:ping").subscribe((q) => {
            cA6("ping received")
        }), BO.channel("undici:websocket:pong").subscribe((q) => {
            cA6("pong received")
        })
    }
    QQ7.exports = {
        channels: _o5
    }
})
// @from(Ln 53966, Col 4)
iQ7 = p((l9O, nQ7) => {
    var {
        InvalidArgumentError: T$,
        NotSupportedError: zo5
    } = aA(), Rr = d6("node:assert"), {
        isValidHTTPToken: cQ7,
        isValidHeaderValue: _w1,
        isStream: Yo5,
        destroy: Ao5,
        isBuffer: Oo5,
        isFormDataLike: wo5,
        isIterable: $o5,
        isBlobLike: jo5,
        buildURL: Ho5,
        validateHandler: Jo5,
        getServerName: Xo5,
        normalizedMethodRecords: Mo5
    } = Hz(), {
        channels: NU
    } = PG6(), {
        headerNameLowerCasedRecord: dQ7
    } = xX8(), Po5 = /[^\u0021-\u00ff]/, Kb = Symbol("handler");
    class lQ7 {
        constructor(q, {
            path: K,
            method: _,
            body: z,
            headers: Y,
            query: A,
            idempotent: O,
            blocking: w,
            upgrade: $,
            headersTimeout: j,
            bodyTimeout: H,
            reset: J,
            throwOnError: X,
            expectContinue: M,
            servername: P
        }, W) {
            if (typeof K !== "string") throw new T$("path must be a string");
            else if (K[0] !== "/" && !(K.startsWith("http://") || K.startsWith("https://")) && _ !== "CONNECT") throw new T$("path must be an absolute URL or start with a slash");
            else if (Po5.test(K)) throw new T$("invalid request path");
            if (typeof _ !== "string") throw new T$("method must be a string");
            else if (Mo5[_] === void 0 && !cQ7(_)) throw new T$("invalid request method");
            if ($ && typeof $ !== "string") throw new T$("upgrade must be a string");
            if ($ && !_w1($)) throw new T$("invalid upgrade header");
            if (j != null && (!Number.isFinite(j) || j < 0)) throw new T$("invalid headersTimeout");
            if (H != null && (!Number.isFinite(H) || H < 0)) throw new T$("invalid bodyTimeout");
            if (J != null && typeof J !== "boolean") throw new T$("invalid reset");
            if (M != null && typeof M !== "boolean") throw new T$("invalid expectContinue");
            if (this.headersTimeout = j, this.bodyTimeout = H, this.throwOnError = X === !0, this.method = _, this.abort = null, z == null) this.body = null;
            else if (Yo5(z)) {
                this.body = z;
                let D = this.body._readableState;
                if (!D || !D.autoDestroy) this.endHandler = function() {
                    Ao5(this)
                }, this.body.on("end", this.endHandler);
                this.errorHandler = (Z) => {
                    if (this.abort) this.abort(Z);
                    else this.error = Z
                }, this.body.on("error", this.errorHandler)
            } else if (Oo5(z)) this.body = z.byteLength ? z : null;
            else if (ArrayBuffer.isView(z)) this.body = z.buffer.byteLength ? Buffer.from(z.buffer, z.byteOffset, z.byteLength) : null;
            else if (z instanceof ArrayBuffer) this.body = z.byteLength ? Buffer.from(z) : null;
            else if (typeof z === "string") this.body = z.length ? Buffer.from(z) : null;
            else if (wo5(z) || $o5(z) || jo5(z)) this.body = z;
            else throw new T$("body must be a string, a Buffer, a Readable stream, an iterable, or an async iterable");
            if (this.completed = !1, this.aborted = !1, this.upgrade = $ || null, this.path = A ? Ho5(K, A) : K, this.origin = q, this.idempotent = O == null ? _ === "HEAD" || _ === "GET" : O, this.blocking = w == null ? !1 : w, this.reset = J == null ? null : J, this.host = null, this.contentLength = null, this.contentType = null, this.headers = [], this.expectContinue = M != null ? M : !1, Array.isArray(Y)) {
                if (Y.length % 2 !== 0) throw new T$("headers array must be even");
                for (let D = 0; D < Y.length; D += 2) FX8(this, Y[D], Y[D + 1])
            } else if (Y && typeof Y === "object")
                if (Y[Symbol.iterator])
                    for (let D of Y) {
                        if (!Array.isArray(D) || D.length !== 2) throw new T$("headers must be in key-value pair format");
                        FX8(this, D[0], D[1])
                    } else {
                        let D = Object.keys(Y);
                        for (let Z = 0; Z < D.length; ++Z) FX8(this, D[Z], Y[D[Z]])
                    } else if (Y != null) throw new T$("headers must be an object or an array");
            if (Jo5(W, _, $), this.servername = P || Xo5(this.host), this[Kb] = W, NU.create.hasSubscribers) NU.create.publish({
                request: this
            })
        }
        onBodySent(q) {
            if (this[Kb].onBodySent) try {
                return this[Kb].onBodySent(q)
            } catch (K) {
                this.abort(K)
            }
        }
        onRequestSent() {
            if (NU.bodySent.hasSubscribers) NU.bodySent.publish({
                request: this
            });
            if (this[Kb].onRequestSent) try {
                return this[Kb].onRequestSent()
            } catch (q) {
                this.abort(q)
            }
        }
        onConnect(q) {
            if (Rr(!this.aborted), Rr(!this.completed), this.error) q(this.error);
            else return this.abort = q, this[Kb].onConnect(q)
        }
        onResponseStarted() {
            return this[Kb].onResponseStarted?.()
        }
        onHeaders(q, K, _, z) {
            if (Rr(!this.aborted), Rr(!this.completed), NU.headers.hasSubscribers) NU.headers.publish({
                request: this,
                response: {
                    statusCode: q,
                    headers: K,
                    statusText: z
                }
            });
            try {
                return this[Kb].onHeaders(q, K, _, z)
            } catch (Y) {
                this.abort(Y)
            }
        }
        onData(q) {
            Rr(!this.aborted), Rr(!this.completed);
            try {
                return this[Kb].onData(q)
            } catch (K) {
                return this.abort(K), !1
            }
        }
        onUpgrade(q, K, _) {
            return Rr(!this.aborted), Rr(!this.completed), this[Kb].onUpgrade(q, K, _)
        }
        onComplete(q) {
            if (this.onFinally(), Rr(!this.aborted), this.completed = !0, NU.trailers.hasSubscribers) NU.trailers.publish({
                request: this,
                trailers: q
            });
            try {
                return this[Kb].onComplete(q)
            } catch (K) {
                this.onError(K)
            }
        }
        onError(q) {
            if (this.onFinally(), NU.error.hasSubscribers) NU.error.publish({
                request: this,
                error: q
            });
            if (this.aborted) return;
            return this.aborted = !0, this[Kb].onError(q)
        }
        onFinally() {
            if (this.errorHandler) this.body.off("error", this.errorHandler), this.errorHandler = null;
            if (this.endHandler) this.body.off("end", this.endHandler), this.endHandler = null
        }
        addHeader(q, K) {
            return FX8(this, q, K), this
        }
    }

    function FX8(q, K, _) {
        if (_ && (typeof _ === "object" && !Array.isArray(_))) throw new T$(`invalid ${K} header`);
        else if (_ === void 0) return;
        let z = dQ7[K];
        if (z === void 0) {
            if (z = K.toLowerCase(), dQ7[z] === void 0 && !cQ7(z)) throw new T$("invalid header key")
        }
        if (Array.isArray(_)) {
            let Y = [];
            for (let A = 0; A < _.length; A++)
                if (typeof _[A] === "string") {
                    if (!_w1(_[A])) throw new T$(`invalid ${K} header`);
                    Y.push(_[A])
                } else if (_[A] === null) Y.push("");
            else if (typeof _[A] === "object") throw new T$(`invalid ${K} header`);
            else Y.push(`${_[A]}`);
            _ = Y
        } else if (typeof _ === "string") {
            if (!_w1(_)) throw new T$(`invalid ${K} header`)
        } else if (_ === null) _ = "";
        else _ = `${_}`;
        if (z === "host") {
            if (q.host !== null) throw new T$("duplicate host header");
            if (typeof _ !== "string") throw new T$("invalid host header");
            q.host = _
        } else if (z === "content-length") {
            if (q.contentLength !== null) throw new T$("duplicate content-length header");
            if (q.contentLength = parseInt(_, 10), !Number.isFinite(q.contentLength)) throw new T$("invalid content-length header")
        } else if (q.contentType === null && z === "content-type") q.contentType = _, q.headers.push(K, _);
        else if (z === "transfer-encoding" || z === "keep-alive" || z === "upgrade") throw new T$(`invalid ${z} header`);
        else if (z === "connection") {
            let Y = typeof _ === "string" ? _.toLowerCase() : null;
            if (Y !== "close" && Y !== "keep-alive") throw new T$("invalid connection header");
            if (Y === "close") q.reset = !0
        } else if (z === "expect") throw new zo5("expect header not supported");
        else q.headers.push(K, _)
    }
    nQ7.exports = lQ7
})
// @from(Ln 54166, Col 4)
nQ6 = p((n9O, oQ7) => {
    var Wo5 = d6("node:events");
    class zw1 extends Wo5 {
        dispatch() {
            throw Error("not implemented")
        }
        close() {
            throw Error("not implemented")
        }
        destroy() {
            throw Error("not implemented")
        }
        compose(...q) {
            let K = Array.isArray(q[0]) ? q[0] : q,
                _ = this.dispatch.bind(this);
            for (let z of K) {
                if (z == null) continue;
                if (typeof z !== "function") throw TypeError(`invalid interceptor, expected function received ${typeof z}`);
                if (_ = z(_), _ == null || typeof _ !== "function" || _.length !== 2) throw TypeError("invalid interceptor")
            }
            return new rQ7(this, _)
        }
    }
    class rQ7 extends zw1 {
        #q = null;
        #K = null;
        constructor(q, K) {
            super();
            this.#q = q, this.#K = K
        }
        dispatch(...q) {
            this.#K(...q)
        }
        close(...q) {
            return this.#q.close(...q)
        }
        destroy(...q) {
            return this.#q.destroy(...q)
        }
    }
    oQ7.exports = zw1
})
// @from(Ln 54208, Col 4)
fG6 = p((i9O, sQ7) => {
    var Do5 = nQ6(),
        {
            ClientDestroyedError: Yw1,
            ClientClosedError: Zo5,
            InvalidArgumentError: WG6
        } = aA(),
        {
            kDestroy: fo5,
            kClose: Go5,
            kClosed: iQ6,
            kDestroyed: DG6,
            kDispatch: Aw1,
            kInterceptors: lA6
        } = oj(),
        Sr = Symbol("onDestroyed"),
        ZG6 = Symbol("onClosed"),
        gX8 = Symbol("Intercepted Dispatch");
    class aQ7 extends Do5 {
        constructor() {
            super();
            this[DG6] = !1, this[Sr] = null, this[iQ6] = !1, this[ZG6] = []
        }
        get destroyed() {
            return this[DG6]
        }
        get closed() {
            return this[iQ6]
        }
        get interceptors() {
            return this[lA6]
        }
        set interceptors(q) {
            if (q) {
                for (let K = q.length - 1; K >= 0; K--)
                    if (typeof this[lA6][K] !== "function") throw new WG6("interceptor must be an function")
            }
            this[lA6] = q
        }
        close(q) {
            if (q === void 0) return new Promise((_, z) => {
                this.close((Y, A) => {
                    return Y ? z(Y) : _(A)
                })
            });
            if (typeof q !== "function") throw new WG6("invalid callback");
            if (this[DG6]) {
                queueMicrotask(() => q(new Yw1, null));
                return
            }
            if (this[iQ6]) {
                if (this[ZG6]) this[ZG6].push(q);
                else queueMicrotask(() => q(null, null));
                return
            }
            this[iQ6] = !0, this[ZG6].push(q);
            let K = () => {
                let _ = this[ZG6];
                this[ZG6] = null;
                for (let z = 0; z < _.length; z++) _[z](null, null)
            };
            this[Go5]().then(() => this.destroy()).then(() => {
                queueMicrotask(K)
            })
        }
        destroy(q, K) {
            if (typeof q === "function") K = q, q = null;
            if (K === void 0) return new Promise((z, Y) => {
                this.destroy(q, (A, O) => {
                    return A ? Y(A) : z(O)
                })
            });
            if (typeof K !== "function") throw new WG6("invalid callback");
            if (this[DG6]) {
                if (this[Sr]) this[Sr].push(K);
                else queueMicrotask(() => K(null, null));
                return
            }
            if (!q) q = new Yw1;
            this[DG6] = !0, this[Sr] = this[Sr] || [], this[Sr].push(K);
            let _ = () => {
                let z = this[Sr];
                this[Sr] = null;
                for (let Y = 0; Y < z.length; Y++) z[Y](null, null)
            };
            this[fo5](q).then(() => {
                queueMicrotask(_)
            })
        } [gX8](q, K) {
            if (!this[lA6] || this[lA6].length === 0) return this[gX8] = this[Aw1], this[Aw1](q, K);
            let _ = this[Aw1].bind(this);
            for (let z = this[lA6].length - 1; z >= 0; z--) _ = this[lA6][z](_);
            return this[gX8] = _, _(q, K)
        }
        dispatch(q, K) {
            if (!K || typeof K !== "object") throw new WG6("handler must be an object");
            try {
                if (!q || typeof q !== "object") throw new WG6("opts must be an object.");
                if (this[DG6] || this[Sr]) throw new Yw1;
                if (this[iQ6]) throw new Zo5;
                return this[gX8](q, K)
            } catch (_) {
                if (typeof K.onError !== "function") throw new WG6("invalid onError method");
                return K.onError(_), !1
            }
        }
    }
    sQ7.exports = aQ7
})
// @from(Ln 54317, Col 4)
Mw1 = p((r9O, Kd7) => {
    var GG6 = 0,
        Ow1 = 1000,
        ww1 = (Ow1 >> 1) - 1,
        Cr, $w1 = Symbol("kFastTimer"),
        br = [],
        jw1 = -2,
        Hw1 = -1,
        eQ7 = 0,
        tQ7 = 1;

    function Jw1() {
        GG6 += ww1;
        let q = 0,
            K = br.length;
        while (q < K) {
            let _ = br[q];
            if (_._state === eQ7) _._idleStart = GG6 - ww1, _._state = tQ7;
            else if (_._state === tQ7 && GG6 >= _._idleStart + _._idleTimeout) _._state = Hw1, _._idleStart = -1, _._onTimeout(_._timerArg);
            if (_._state === Hw1) {
                if (_._state = jw1, --K !== 0) br[q] = br[K]
            } else ++q
        }
        if (br.length = K, br.length !== 0) qd7()
    }

    function qd7() {
        if (Cr) Cr.refresh();
        else if (clearTimeout(Cr), Cr = setTimeout(Jw1, ww1), Cr.unref) Cr.unref()
    }
    class Xw1 {
        [$w1] = !0;
        _state = jw1;
        _idleTimeout = -1;
        _idleStart = -1;
        _onTimeout;
        _timerArg;
        constructor(q, K, _) {
            this._onTimeout = q, this._idleTimeout = K, this._timerArg = _, this.refresh()
        }
        refresh() {
            if (this._state === jw1) br.push(this);
            if (!Cr || br.length === 1) qd7();
            this._state = eQ7
        }
        clear() {
            this._state = Hw1, this._idleStart = -1
        }
    }
    Kd7.exports = {
        setTimeout(q, K, _) {
            return K <= Ow1 ? setTimeout(q, K, _) : new Xw1(q, K, _)
        },
        clearTimeout(q) {
            if (q[$w1]) q.clear();
            else clearTimeout(q)
        },
        setFastTimeout(q, K, _) {
            return new Xw1(q, K, _)
        },
        clearFastTimeout(q) {
            q.clear()
        },
        now() {
            return GG6
        },
        tick(q = 0) {
            GG6 += q - Ow1 + 1, Jw1(), Jw1()
        },
        reset() {
            GG6 = 0, br.length = 0, clearTimeout(Cr), Cr = null
        },
        kFastTimer: $w1
    }
})
// @from(Ln 54392, Col 4)
rQ6 = p((o9O, Od7) => {
    var vo5 = d6("node:net"),
        _d7 = d6("node:assert"),
        Ad7 = Hz(),
        {
            InvalidArgumentError: To5,
            ConnectTimeoutError: Vo5
        } = aA(),
        UX8 = Mw1();

    function zd7() {}
    var Pw1, Ww1;
    if (global.FinalizationRegistry && !(process.env.NODE_V8_COVERAGE || process.env.UNDICI_NO_FG)) Ww1 = class {
        constructor(K) {
            this._maxCachedSessions = K, this._sessionCache = new Map, this._sessionRegistry = new global.FinalizationRegistry((_) => {
                if (this._sessionCache.size < this._maxCachedSessions) return;
                let z = this._sessionCache.get(_);
                if (z !== void 0 && z.deref() === void 0) this._sessionCache.delete(_)
            })
        }
        get(K) {
            let _ = this._sessionCache.get(K);
            return _ ? _.deref() : null
        }
        set(K, _) {
            if (this._maxCachedSessions === 0) return;
            this._sessionCache.set(K, new WeakRef(_)), this._sessionRegistry.register(_, K)
        }
    };
    else Ww1 = class {
        constructor(K) {
            this._maxCachedSessions = K, this._sessionCache = new Map
        }
        get(K) {
            return this._sessionCache.get(K)
        }
        set(K, _) {
            if (this._maxCachedSessions === 0) return;
            if (this._sessionCache.size >= this._maxCachedSessions) {
                let {
                    value: z
                } = this._sessionCache.keys().next();
                this._sessionCache.delete(z)
            }
            this._sessionCache.set(K, _)
        }
    };

    function ko5({
        allowH2: q,
        maxCachedSessions: K,
        socketPath: _,
        timeout: z,
        session: Y,
        ...A
    }) {
        if (K != null && (!Number.isInteger(K) || K < 0)) throw new To5("maxCachedSessions must be a positive integer or zero");
        let O = {
                path: _,
                ...A
            },
            w = new Ww1(K == null ? 100 : K);
        return z = z == null ? 1e4 : z, q = q != null ? q : !1,
            function({
                hostname: j,
                host: H,
                protocol: J,
                port: X,
                servername: M,
                localAddress: P,
                httpSocket: W
            }, D) {
                let Z;
                if (J === "https:") {
                    if (!Pw1) Pw1 = d6("node:tls");
                    M = M || O.servername || Ad7.getServerName(H) || null;
                    let f = M || j;
                    _d7(f);
                    let v = Y || w.get(f) || null;
                    X = X || 443, Z = Pw1.connect({
                        highWaterMark: 16384,
                        ...O,
                        servername: M,
                        session: v,
                        localAddress: P,
                        ALPNProtocols: q ? ["http/1.1", "h2"] : ["http/1.1"],
                        socket: W,
                        port: X,
                        host: j
                    }), Z.on("session", function(V) {
                        w.set(f, V)
                    })
                } else _d7(!W, "httpSocket can only be sent on TLS update"), X = X || 80, Z = vo5.connect({
                    highWaterMark: 65536,
                    ...O,
                    localAddress: P,
                    port: X,
                    host: j
                });
                if (O.keepAlive == null || O.keepAlive) {
                    let f = O.keepAliveInitialDelay === void 0 ? 60000 : O.keepAliveInitialDelay;
                    Z.setKeepAlive(!0, f)
                }
                let G = No5(new WeakRef(Z), {
                    timeout: z,
                    hostname: j,
                    port: X
                });
                return Z.setNoDelay(!0).once(J === "https:" ? "secureConnect" : "connect", function() {
                    if (queueMicrotask(G), D) {
                        let f = D;
                        D = null, f(null, this)
                    }
                }).on("error", function(f) {
                    if (queueMicrotask(G), D) {
                        let v = D;
                        D = null, v(f)
                    }
                }), Z
            }
    }
    var No5 = process.platform === "win32" ? (q, K) => {
        if (!K.timeout) return zd7;
        let _ = null,
            z = null,
            Y = UX8.setFastTimeout(() => {
                _ = setImmediate(() => {
                    z = setImmediate(() => Yd7(q.deref(), K))
                })
            }, K.timeout);
        return () => {
            UX8.clearFastTimeout(Y), clearImmediate(_), clearImmediate(z)
        }
    } : (q, K) => {
        if (!K.timeout) return zd7;
        let _ = null,
            z = UX8.setFastTimeout(() => {
                _ = setImmediate(() => {
                    Yd7(q.deref(), K)
                })
            }, K.timeout);
        return () => {
            UX8.clearFastTimeout(z), clearImmediate(_)
        }
    };

    function Yd7(q, K) {
        if (q == null) return;
        let _ = "Connect Timeout Error";
        if (Array.isArray(q.autoSelectFamilyAttemptedAddresses)) _ += ` (attempted addresses: ${q.autoSelectFamilyAttemptedAddresses.join(", ")},`;
        else _ += ` (attempted address: ${K.hostname}:${K.port},`;
        _ += ` timeout: ${K.timeout}ms)`, Ad7.destroy(q, new Vo5(_))
    }
    Od7.exports = ko5
})
// @from(Ln 54547, Col 4)
jd7 = p((wd7) => {
    Object.defineProperty(wd7, "__esModule", {
        value: !0
    });
    wd7.enumToMap = void 0;

    function Eo5(q) {
        let K = {};
        return Object.keys(q).forEach((_) => {
            let z = q[_];
            if (typeof z === "number") K[_] = z
        }), K
    }
    wd7.enumToMap = Eo5
})
// @from(Ln 54562, Col 4)
yd7 = p((Zd7) => {
    Object.defineProperty(Zd7, "__esModule", {
        value: !0
    });
    Zd7.SPECIAL_HEADERS = Zd7.HEADER_STATE = Zd7.MINOR = Zd7.MAJOR = Zd7.CONNECTION_TOKEN_CHARS = Zd7.HEADER_CHARS = Zd7.TOKEN = Zd7.STRICT_TOKEN = Zd7.HEX = Zd7.URL_CHAR = Zd7.STRICT_URL_CHAR = Zd7.USERINFO_CHARS = Zd7.MARK = Zd7.ALPHANUM = Zd7.NUM = Zd7.HEX_MAP = Zd7.NUM_MAP = Zd7.ALPHA = Zd7.FINISH = Zd7.H_METHOD_MAP = Zd7.METHOD_MAP = Zd7.METHODS_RTSP = Zd7.METHODS_ICE = Zd7.METHODS_HTTP = Zd7.METHODS = Zd7.LENIENT_FLAGS = Zd7.FLAGS = Zd7.TYPE = Zd7.ERROR = void 0;
    var yo5 = jd7(),
        Lo5;
    (function(q) {
        q[q.OK = 0] = "OK", q[q.INTERNAL = 1] = "INTERNAL", q[q.STRICT = 2] = "STRICT", q[q.LF_EXPECTED = 3] = "LF_EXPECTED", q[q.UNEXPECTED_CONTENT_LENGTH = 4] = "UNEXPECTED_CONTENT_LENGTH", q[q.CLOSED_CONNECTION = 5] = "CLOSED_CONNECTION", q[q.INVALID_METHOD = 6] = "INVALID_METHOD", q[q.INVALID_URL = 7] = "INVALID_URL", q[q.INVALID_CONSTANT = 8] = "INVALID_CONSTANT", q[q.INVALID_VERSION = 9] = "INVALID_VERSION", q[q.INVALID_HEADER_TOKEN = 10] = "INVALID_HEADER_TOKEN", q[q.INVALID_CONTENT_LENGTH = 11] = "INVALID_CONTENT_LENGTH", q[q.INVALID_CHUNK_SIZE = 12] = "INVALID_CHUNK_SIZE", q[q.INVALID_STATUS = 13] = "INVALID_STATUS", q[q.INVALID_EOF_STATE = 14] = "INVALID_EOF_STATE", q[q.INVALID_TRANSFER_ENCODING = 15] = "INVALID_TRANSFER_ENCODING", q[q.CB_MESSAGE_BEGIN = 16] = "CB_MESSAGE_BEGIN", q[q.CB_HEADERS_COMPLETE = 17] = "CB_HEADERS_COMPLETE", q[q.CB_MESSAGE_COMPLETE = 18] = "CB_MESSAGE_COMPLETE", q[q.CB_CHUNK_HEADER = 19] = "CB_CHUNK_HEADER", q[q.CB_CHUNK_COMPLETE = 20] = "CB_CHUNK_COMPLETE", q[q.PAUSED = 21] = "PAUSED", q[q.PAUSED_UPGRADE = 22] = "PAUSED_UPGRADE", q[q.PAUSED_H2_UPGRADE = 23] = "PAUSED_H2_UPGRADE", q[q.USER = 24] = "USER"
    })(Lo5 = Zd7.ERROR || (Zd7.ERROR = {}));
    var ho5;
    (function(q) {
        q[q.BOTH = 0] = "BOTH", q[q.REQUEST = 1] = "REQUEST", q[q.RESPONSE = 2] = "RESPONSE"
    })(ho5 = Zd7.TYPE || (Zd7.TYPE = {}));
    var Ro5;
    (function(q) {
        q[q.CONNECTION_KEEP_ALIVE = 1] = "CONNECTION_KEEP_ALIVE", q[q.CONNECTION_CLOSE = 2] = "CONNECTION_CLOSE", q[q.CONNECTION_UPGRADE = 4] = "CONNECTION_UPGRADE", q[q.CHUNKED = 8] = "CHUNKED", q[q.UPGRADE = 16] = "UPGRADE", q[q.CONTENT_LENGTH = 32] = "CONTENT_LENGTH", q[q.SKIPBODY = 64] = "SKIPBODY", q[q.TRAILING = 128] = "TRAILING", q[q.TRANSFER_ENCODING = 512] = "TRANSFER_ENCODING"
    })(Ro5 = Zd7.FLAGS || (Zd7.FLAGS = {}));
    var So5;
    (function(q) {
        q[q.HEADERS = 1] = "HEADERS", q[q.CHUNKED_LENGTH = 2] = "CHUNKED_LENGTH", q[q.KEEP_ALIVE = 4] = "KEEP_ALIVE"
    })(So5 = Zd7.LENIENT_FLAGS || (Zd7.LENIENT_FLAGS = {}));
    var r5;
    (function(q) {
        q[q.DELETE = 0] = "DELETE", q[q.GET = 1] = "GET", q[q.HEAD = 2] = "HEAD", q[q.POST = 3] = "POST", q[q.PUT = 4] = "PUT", q[q.CONNECT = 5] = "CONNECT", q[q.OPTIONS = 6] = "OPTIONS", q[q.TRACE = 7] = "TRACE", q[q.COPY = 8] = "COPY", q[q.LOCK = 9] = "LOCK", q[q.MKCOL = 10] = "MKCOL", q[q.MOVE = 11] = "MOVE", q[q.PROPFIND = 12] = "PROPFIND", q[q.PROPPATCH = 13] = "PROPPATCH", q[q.SEARCH = 14] = "SEARCH", q[q.UNLOCK = 15] = "UNLOCK", q[q.BIND = 16] = "BIND", q[q.REBIND = 17] = "REBIND", q[q.UNBIND = 18] = "UNBIND", q[q.ACL = 19] = "ACL", q[q.REPORT = 20] = "REPORT", q[q.MKACTIVITY = 21] = "MKACTIVITY", q[q.CHECKOUT = 22] = "CHECKOUT", q[q.MERGE = 23] = "MERGE", q[q["M-SEARCH"] = 24] = "M-SEARCH", q[q.NOTIFY = 25] = "NOTIFY", q[q.SUBSCRIBE = 26] = "SUBSCRIBE", q[q.UNSUBSCRIBE = 27] = "UNSUBSCRIBE", q[q.PATCH = 28] = "PATCH", q[q.PURGE = 29] = "PURGE", q[q.MKCALENDAR = 30] = "MKCALENDAR", q[q.LINK = 31] = "LINK", q[q.UNLINK = 32] = "UNLINK", q[q.SOURCE = 33] = "SOURCE", q[q.PRI = 34] = "PRI", q[q.DESCRIBE = 35] = "DESCRIBE", q[q.ANNOUNCE = 36] = "ANNOUNCE", q[q.SETUP = 37] = "SETUP", q[q.PLAY = 38] = "PLAY", q[q.PAUSE = 39] = "PAUSE", q[q.TEARDOWN = 40] = "TEARDOWN", q[q.GET_PARAMETER = 41] = "GET_PARAMETER", q[q.SET_PARAMETER = 42] = "SET_PARAMETER", q[q.REDIRECT = 43] = "REDIRECT", q[q.RECORD = 44] = "RECORD", q[q.FLUSH = 45] = "FLUSH"
    })(r5 = Zd7.METHODS || (Zd7.METHODS = {}));
    Zd7.METHODS_HTTP = [r5.DELETE, r5.GET, r5.HEAD, r5.POST, r5.PUT, r5.CONNECT, r5.OPTIONS, r5.TRACE, r5.COPY, r5.LOCK, r5.MKCOL, r5.MOVE, r5.PROPFIND, r5.PROPPATCH, r5.SEARCH, r5.UNLOCK, r5.BIND, r5.REBIND, r5.UNBIND, r5.ACL, r5.REPORT, r5.MKACTIVITY, r5.CHECKOUT, r5.MERGE, r5["M-SEARCH"], r5.NOTIFY, r5.SUBSCRIBE, r5.UNSUBSCRIBE, r5.PATCH, r5.PURGE, r5.MKCALENDAR, r5.LINK, r5.UNLINK, r5.PRI, r5.SOURCE];
    Zd7.METHODS_ICE = [r5.SOURCE];
    Zd7.METHODS_RTSP = [r5.OPTIONS, r5.DESCRIBE, r5.ANNOUNCE, r5.SETUP, r5.PLAY, r5.PAUSE, r5.TEARDOWN, r5.GET_PARAMETER, r5.SET_PARAMETER, r5.REDIRECT, r5.RECORD, r5.FLUSH, r5.GET, r5.POST];
    Zd7.METHOD_MAP = yo5.enumToMap(r5);
    Zd7.H_METHOD_MAP = {};
    Object.keys(Zd7.METHOD_MAP).forEach((q) => {
        if (/^H/.test(q)) Zd7.H_METHOD_MAP[q] = Zd7.METHOD_MAP[q]
    });
    var Co5;
    (function(q) {
        q[q.SAFE = 0] = "SAFE", q[q.SAFE_WITH_CB = 1] = "SAFE_WITH_CB", q[q.UNSAFE = 2] = "UNSAFE"
    })(Co5 = Zd7.FINISH || (Zd7.FINISH = {}));
    Zd7.ALPHA = [];
    for (let q = 65; q <= 90; q++) Zd7.ALPHA.push(String.fromCharCode(q)), Zd7.ALPHA.push(String.fromCharCode(q + 32));
    Zd7.NUM_MAP = {
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
    Zd7.HEX_MAP = {
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
    Zd7.NUM = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    Zd7.ALPHANUM = Zd7.ALPHA.concat(Zd7.NUM);
    Zd7.MARK = ["-", "_", ".", "!", "~", "*", "'", "(", ")"];
    Zd7.USERINFO_CHARS = Zd7.ALPHANUM.concat(Zd7.MARK).concat(["%", ";", ":", "&", "=", "+", "$", ","]);
    Zd7.STRICT_URL_CHAR = ["!", '"', "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "@", "[", "\\", "]", "^", "_", "`", "{", "|", "}", "~"].concat(Zd7.ALPHANUM);
    Zd7.URL_CHAR = Zd7.STRICT_URL_CHAR.concat(["\t", "\f"]);
    for (let q = 128; q <= 255; q++) Zd7.URL_CHAR.push(q);
    Zd7.HEX = Zd7.NUM.concat(["a", "b", "c", "d", "e", "f", "A", "B", "C", "D", "E", "F"]);
    Zd7.STRICT_TOKEN = ["!", "#", "$", "%", "&", "'", "*", "+", "-", ".", "^", "_", "`", "|", "~"].concat(Zd7.ALPHANUM);
    Zd7.TOKEN = Zd7.STRICT_TOKEN.concat([" "]);
    Zd7.HEADER_CHARS = ["\t"];
    for (let q = 32; q <= 255; q++)
        if (q !== 127) Zd7.HEADER_CHARS.push(q);
    Zd7.CONNECTION_TOKEN_CHARS = Zd7.HEADER_CHARS.filter((q) => q !== 44);
    Zd7.MAJOR = Zd7.NUM_MAP;
    Zd7.MINOR = Zd7.MAJOR;
    var vG6;
    (function(q) {
        q[q.GENERAL = 0] = "GENERAL", q[q.CONNECTION = 1] = "CONNECTION", q[q.CONTENT_LENGTH = 2] = "CONTENT_LENGTH", q[q.TRANSFER_ENCODING = 3] = "TRANSFER_ENCODING", q[q.UPGRADE = 4] = "UPGRADE", q[q.CONNECTION_KEEP_ALIVE = 5] = "CONNECTION_KEEP_ALIVE", q[q.CONNECTION_CLOSE = 6] = "CONNECTION_CLOSE", q[q.CONNECTION_UPGRADE = 7] = "CONNECTION_UPGRADE", q[q.TRANSFER_ENCODING_CHUNKED = 8] = "TRANSFER_ENCODING_CHUNKED"
    })(vG6 = Zd7.HEADER_STATE || (Zd7.HEADER_STATE = {}));
    Zd7.SPECIAL_HEADERS = {
        connection: vG6.CONNECTION,
        "content-length": vG6.CONTENT_LENGTH,
        "proxy-connection": vG6.CONNECTION,
        "transfer-encoding": vG6.TRANSFER_ENCODING,
        upgrade: vG6.UPGRADE
    }
})