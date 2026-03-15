
// @from(Ln 206887, Col 4)
CZ8 = x((YI, So7) => {
    Object.defineProperty(YI, "__esModule", {
        value: !0
    });

    function Y06(A) {
        return A && typeof A === "object" && "default" in A ? A.default : A
    }
    var KI = Y06(x6("stream")),
        Vo7 = Y06(x6("http")),
        mM1 = Y06(x6("url")),
        ko7 = Y06(fo7()),
        bX9 = Y06(x6("https")),
        a56 = Y06(x6("zlib")),
        xX9 = KI.Readable,
        Wd = Symbol("buffer"),
        NZ8 = Symbol("type");
    class q06 {
        constructor() {
            this[NZ8] = "";
            let A = arguments[0],
                q = arguments[1],
                K = [],
                Y = 0;
            if (A) {
                let _ = A,
                    w = Number(_.length);
                for (let O = 0; O < w; O++) {
                    let $ = _[O],
                        H;
                    if ($ instanceof Buffer) H = $;
                    else if (ArrayBuffer.isView($)) H = Buffer.from($.buffer, $.byteOffset, $.byteLength);
                    else if ($ instanceof ArrayBuffer) H = Buffer.from($);
                    else if ($ instanceof q06) H = $[Wd];
                    else H = Buffer.from(typeof $ === "string" ? $ : String($));
                    Y += H.length, K.push(H)
                }
            }
            this[Wd] = Buffer.concat(K);
            let z = q && q.type !== void 0 && String(q.type).toLowerCase();
            if (z && !/[^\u0020-\u007E]/.test(z)) this[NZ8] = z
        }
        get size() {
            return this[Wd].length
        }
        get type() {
            return this[NZ8]
        }
        text() {
            return Promise.resolve(this[Wd].toString())
        }
        arrayBuffer() {
            let A = this[Wd],
                q = A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength);
            return Promise.resolve(q)
        }
        stream() {
            let A = new xX9;
            return A._read = function() {}, A.push(this[Wd]), A.push(null), A
        }
        toString() {
            return "[object Blob]"
        }
        slice() {
            let A = this.size,
                q = arguments[0],
                K = arguments[1],
                Y, z;
            if (q === void 0) Y = 0;
            else if (q < 0) Y = Math.max(A + q, 0);
            else Y = Math.min(q, A);
            if (K === void 0) z = A;
            else if (K < 0) z = Math.max(A + K, 0);
            else z = Math.min(K, A);
            let _ = Math.max(z - Y, 0),
                O = this[Wd].slice(Y, Y + _),
                $ = new q06([], {
                    type: arguments[2]
                });
            return $[Wd] = O, $
        }
    }
    Object.defineProperties(q06.prototype, {
        size: {
            enumerable: !0
        },
        type: {
            enumerable: !0
        },
        slice: {
            enumerable: !0
        }
    });
    Object.defineProperty(q06.prototype, Symbol.toStringTag, {
        value: "Blob",
        writable: !1,
        enumerable: !1,
        configurable: !0
    });

    function oP(A, q, K) {
        if (Error.call(this, A), this.message = A, this.type = q, K) this.code = this.errno = K.code;
        Error.captureStackTrace(this, this.constructor)
    }
    oP.prototype = Object.create(Error.prototype);
    oP.prototype.constructor = oP;
    oP.prototype.name = "FetchError";
    var yZ8;
    try {
        yZ8 = (() => {
            throw new Error("Cannot require module " + "encoding");
        })().convert
    } catch (A) {}
    var Gd = Symbol("Body internals"),
        To7 = KI.PassThrough;

    function jX(A) {
        var q = this,
            K = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
            Y = K.size;
        let z = Y === void 0 ? 0 : Y;
        var _ = K.timeout;
        let w = _ === void 0 ? 0 : _;
        if (A == null) A = null;
        else if (Eo7(A)) A = Buffer.from(A.toString());
        else if (Cg6(A));
        else if (Buffer.isBuffer(A));
        else if (Object.prototype.toString.call(A) === "[object ArrayBuffer]") A = Buffer.from(A);
        else if (ArrayBuffer.isView(A)) A = Buffer.from(A.buffer, A.byteOffset, A.byteLength);
        else if (A instanceof KI);
        else A = Buffer.from(String(A));
        if (this[Gd] = {
                body: A,
                disturbed: !1,
                error: null
            }, this.size = z, this.timeout = w, A instanceof KI) A.on("error", function(O) {
            let $ = O.name === "AbortError" ? O : new oP(`Invalid response body while trying to fetch ${q.url}: ${O.message}`, "system", O);
            q[Gd].error = $
        })
    }
    jX.prototype = {
        get body() {
            return this[Gd].body
        },
        get bodyUsed() {
            return this[Gd].disturbed
        },
        arrayBuffer() {
            return eP6.call(this).then(function(A) {
                return A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength)
            })
        },
        blob() {
            let A = this.headers && this.headers.get("content-type") || "";
            return eP6.call(this).then(function(q) {
                return Object.assign(new q06([], {
                    type: A.toLowerCase()
                }), {
                    [Wd]: q
                })
            })
        },
        json() {
            var A = this;
            return eP6.call(this).then(function(q) {
                try {
                    return JSON.parse(q.toString())
                } catch (K) {
                    return jX.Promise.reject(new oP(`invalid json response body at ${A.url} reason: ${K.message}`, "invalid-json"))
                }
            })
        },
        text() {
            return eP6.call(this).then(function(A) {
                return A.toString()
            })
        },
        buffer() {
            return eP6.call(this)
        },
        textConverted() {
            var A = this;
            return eP6.call(this).then(function(q) {
                return uX9(q, A.headers)
            })
        }
    };
    Object.defineProperties(jX.prototype, {
        body: {
            enumerable: !0
        },
        bodyUsed: {
            enumerable: !0
        },
        arrayBuffer: {
            enumerable: !0
        },
        blob: {
            enumerable: !0
        },
        json: {
            enumerable: !0
        },
        text: {
            enumerable: !0
        }
    });
    jX.mixIn = function(A) {
        for (let q of Object.getOwnPropertyNames(jX.prototype))
            if (!(q in A)) {
                let K = Object.getOwnPropertyDescriptor(jX.prototype, q);
                Object.defineProperty(A, q, K)
            }
    };

    function eP6() {
        var A = this;
        if (this[Gd].disturbed) return jX.Promise.reject(TypeError(`body used already for: ${this.url}`));
        if (this[Gd].disturbed = !0, this[Gd].error) return jX.Promise.reject(this[Gd].error);
        let q = this.body;
        if (q === null) return jX.Promise.resolve(Buffer.alloc(0));
        if (Cg6(q)) q = q.stream();
        if (Buffer.isBuffer(q)) return jX.Promise.resolve(q);
        if (!(q instanceof KI)) return jX.Promise.resolve(Buffer.alloc(0));
        let K = [],
            Y = 0,
            z = !1;
        return new jX.Promise(function(_, w) {
            let O;
            if (A.timeout) O = setTimeout(function() {
                z = !0, w(new oP(`Response timeout while trying to fetch ${A.url} (over ${A.timeout}ms)`, "body-timeout"))
            }, A.timeout);
            q.on("error", function($) {
                if ($.name === "AbortError") z = !0, w($);
                else w(new oP(`Invalid response body while trying to fetch ${A.url}: ${$.message}`, "system", $))
            }), q.on("data", function($) {
                if (z || $ === null) return;
                if (A.size && Y + $.length > A.size) {
                    z = !0, w(new oP(`content size at ${A.url} over limit: ${A.size}`, "max-size"));
                    return
                }
                Y += $.length, K.push($)
            }), q.on("end", function() {
                if (z) return;
                clearTimeout(O);
                try {
                    _(Buffer.concat(K, Y))
                } catch ($) {
                    w(new oP(`Could not create Buffer from response body for ${A.url}: ${$.message}`, "system", $))
                }
            })
        })
    }

    function uX9(A, q) {
        if (typeof yZ8 !== "function") throw Error("The package `encoding` must be installed to use the textConverted() function");
        let K = q.get("content-type"),
            Y = "utf-8",
            z, _;
        if (K) z = /charset=([^;]*)/i.exec(K);
        if (_ = A.slice(0, 1024).toString(), !z && _) z = /<meta.+?charset=(['"])(.+?)\1/i.exec(_);
        if (!z && _) {
            if (z = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(_), !z) {
                if (z = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(_), z) z.pop()
            }
            if (z) z = /charset=(.*)/i.exec(z.pop())
        }
        if (!z && _) z = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(_);
        if (z) {
            if (Y = z.pop(), Y === "gb2312" || Y === "gbk") Y = "gb18030"
        }
        return yZ8(A, "UTF-8", Y).toString()
    }

    function Eo7(A) {
        if (typeof A !== "object" || typeof A.append !== "function" || typeof A.delete !== "function" || typeof A.get !== "function" || typeof A.getAll !== "function" || typeof A.has !== "function" || typeof A.set !== "function") return !1;
        return A.constructor.name === "URLSearchParams" || Object.prototype.toString.call(A) === "[object URLSearchParams]" || typeof A.sort === "function"
    }

    function Cg6(A) {
        return typeof A === "object" && typeof A.arrayBuffer === "function" && typeof A.type === "string" && typeof A.stream === "function" && typeof A.constructor === "function" && typeof A.constructor.name === "string" && /^(Blob|File)$/.test(A.constructor.name) && /^(Blob|File)$/.test(A[Symbol.toStringTag])
    }

    function yo7(A) {
        let q, K, Y = A.body;
        if (A.bodyUsed) throw Error("cannot clone body after it is used");
        if (Y instanceof KI && typeof Y.getBoundary !== "function") q = new To7, K = new To7, Y.pipe(q), Y.pipe(K), A[Gd].body = q, Y = K;
        return Y
    }

    function Lo7(A) {
        if (A === null) return null;
        else if (typeof A === "string") return "text/plain;charset=UTF-8";
        else if (Eo7(A)) return "application/x-www-form-urlencoded;charset=UTF-8";
        else if (Cg6(A)) return A.type || null;
        else if (Buffer.isBuffer(A)) return null;
        else if (Object.prototype.toString.call(A) === "[object ArrayBuffer]") return null;
        else if (ArrayBuffer.isView(A)) return null;
        else if (typeof A.getBoundary === "function") return `multipart/form-data;boundary=${A.getBoundary()}`;
        else if (A instanceof KI) return null;
        else return "text/plain;charset=UTF-8"
    }

    function Ro7(A) {
        let q = A.body;
        if (q === null) return 0;
        else if (Cg6(q)) return q.size;
        else if (Buffer.isBuffer(q)) return q.length;
        else if (q && typeof q.getLengthSync === "function") {
            if (q._lengthRetrievers && q._lengthRetrievers.length == 0 || q.hasKnownLength && q.hasKnownLength()) return q.getLengthSync();
            return null
        } else return null
    }

    function mX9(A, q) {
        let K = q.body;
        if (K === null) A.end();
        else if (Cg6(K)) K.stream().pipe(A);
        else if (Buffer.isBuffer(K)) A.write(K), A.end();
        else K.pipe(A)
    }
    jX.Promise = global.Promise;
    var ho7 = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/,
        LZ8 = /[^\t\x20-\x7e\x80-\xff]/;

    function hg6(A) {
        if (A = `${A}`, ho7.test(A) || A === "") throw TypeError(`${A} is not a legal HTTP header name`)
    }

    function vo7(A) {
        if (A = `${A}`, LZ8.test(A)) throw TypeError(`${A} is not a legal HTTP header value`)
    }

    function A06(A, q) {
        q = q.toLowerCase();
        for (let K in A)
            if (K.toLowerCase() === q) return K;
        return
    }
    var bj = Symbol("map");
    class eL {
        constructor() {
            let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
            if (this[bj] = Object.create(null), A instanceof eL) {
                let q = A.raw(),
                    K = Object.keys(q);
                for (let Y of K)
                    for (let z of q[Y]) this.append(Y, z);
                return
            }
            if (A == null);
            else if (typeof A === "object") {
                let q = A[Symbol.iterator];
                if (q != null) {
                    if (typeof q !== "function") throw TypeError("Header pairs must be iterable");
                    let K = [];
                    for (let Y of A) {
                        if (typeof Y !== "object" || typeof Y[Symbol.iterator] !== "function") throw TypeError("Each header pair must be iterable");
                        K.push(Array.from(Y))
                    }
                    for (let Y of K) {
                        if (Y.length !== 2) throw TypeError("Each header pair must be a name/value tuple");
                        this.append(Y[0], Y[1])
                    }
                } else
                    for (let K of Object.keys(A)) {
                        let Y = A[K];
                        this.append(K, Y)
                    }
            } else throw TypeError("Provided initializer must be an object")
        }
        get(A) {
            A = `${A}`, hg6(A);
            let q = A06(this[bj], A);
            if (q === void 0) return null;
            return this[bj][q].join(", ")
        }
        forEach(A) {
            let q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0,
                K = RZ8(this),
                Y = 0;
            while (Y < K.length) {
                var z = K[Y];
                let _ = z[0],
                    w = z[1];
                A.call(q, w, _, this), K = RZ8(this), Y++
            }
        }
        set(A, q) {
            A = `${A}`, q = `${q}`, hg6(A), vo7(q);
            let K = A06(this[bj], A);
            this[bj][K !== void 0 ? K : A] = [q]
        }
        append(A, q) {
            A = `${A}`, q = `${q}`, hg6(A), vo7(q);
            let K = A06(this[bj], A);
            if (K !== void 0) this[bj][K].push(q);
            else this[bj][A] = [q]
        }
        has(A) {
            return A = `${A}`, hg6(A), A06(this[bj], A) !== void 0
        }
        delete(A) {
            A = `${A}`, hg6(A);
            let q = A06(this[bj], A);
            if (q !== void 0) delete this[bj][q]
        }
        raw() {
            return this[bj]
        }
        keys() {
            return VZ8(this, "key")
        }
        values() {
            return VZ8(this, "value")
        } [Symbol.iterator]() {
            return VZ8(this, "key+value")
        }
    }
    eL.prototype.entries = eL.prototype[Symbol.iterator];
    Object.defineProperty(eL.prototype, Symbol.toStringTag, {
        value: "Headers",
        writable: !1,
        enumerable: !1,
        configurable: !0
    });
    Object.defineProperties(eL.prototype, {
        get: {
            enumerable: !0
        },
        forEach: {
            enumerable: !0
        },
        set: {
            enumerable: !0
        },
        append: {
            enumerable: !0
        },
        has: {
            enumerable: !0
        },
        delete: {
            enumerable: !0
        },
        keys: {
            enumerable: !0
        },
        values: {
            enumerable: !0
        },
        entries: {
            enumerable: !0
        }
    });

    function RZ8(A) {
        let q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
        return Object.keys(A[bj]).sort().map(q === "key" ? function(Y) {
            return Y.toLowerCase()
        } : q === "value" ? function(Y) {
            return A[bj][Y].join(", ")
        } : function(Y) {
            return [Y.toLowerCase(), A[bj][Y].join(", ")]
        })
    }
    var hZ8 = Symbol("internal");

    function VZ8(A, q) {
        let K = Object.create(SZ8);
        return K[hZ8] = {
            target: A,
            kind: q,
            index: 0
        }, K
    }
    var SZ8 = Object.setPrototypeOf({
        next() {
            if (!this || Object.getPrototypeOf(this) !== SZ8) throw TypeError("Value of `this` is not a HeadersIterator");
            var A = this[hZ8];
            let {
                target: q,
                kind: K,
                index: Y
            } = A, z = RZ8(q, K), _ = z.length;
            if (Y >= _) return {
                value: void 0,
                done: !0
            };
            return this[hZ8].index = Y + 1, {
                value: z[Y],
                done: !1
            }
        }
    }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
    Object.defineProperty(SZ8, Symbol.toStringTag, {
        value: "HeadersIterator",
        writable: !1,
        enumerable: !1,
        configurable: !0
    });

    function BX9(A) {
        let q = Object.assign({
                __proto__: null
            }, A[bj]),
            K = A06(A[bj], "Host");
        if (K !== void 0) q[K] = q[K][0];
        return q
    }

    function gX9(A) {
        let q = new eL;
        for (let K of Object.keys(A)) {
            if (ho7.test(K)) continue;
            if (Array.isArray(A[K]))
                for (let Y of A[K]) {
                    if (LZ8.test(Y)) continue;
                    if (q[bj][K] === void 0) q[bj][K] = [Y];
                    else q[bj][K].push(Y)
                } else if (!LZ8.test(A[K])) q[bj][K] = [A[K]]
        }
        return q
    }
    var Kt = Symbol("Response internals"),
        FX9 = Vo7.STATUS_CODES;
    class tL {
        constructor() {
            let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null,
                q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            jX.call(this, A, q);
            let K = q.status || 200,
                Y = new eL(q.headers);
            if (A != null && !Y.has("Content-Type")) {
                let z = Lo7(A);
                if (z) Y.append("Content-Type", z)
            }
            this[Kt] = {
                url: q.url,
                status: K,
                statusText: q.statusText || FX9[K],
                headers: Y,
                counter: q.counter
            }
        }
        get url() {
            return this[Kt].url || ""
        }
        get status() {
            return this[Kt].status
        }
        get ok() {
            return this[Kt].status >= 200 && this[Kt].status < 300
        }
        get redirected() {
            return this[Kt].counter > 0
        }
        get statusText() {
            return this[Kt].statusText
        }
        get headers() {
            return this[Kt].headers
        }
        clone() {
            return new tL(yo7(this), {
                url: this.url,
                status: this.status,
                statusText: this.statusText,
                headers: this.headers,
                ok: this.ok,
                redirected: this.redirected
            })
        }
    }
    jX.mixIn(tL.prototype);
    Object.defineProperties(tL.prototype, {
        url: {
            enumerable: !0
        },
        status: {
            enumerable: !0
        },
        ok: {
            enumerable: !0
        },
        redirected: {
            enumerable: !0
        },
        statusText: {
            enumerable: !0
        },
        headers: {
            enumerable: !0
        },
        clone: {
            enumerable: !0
        }
    });
    Object.defineProperty(tL.prototype, Symbol.toStringTag, {
        value: "Response",
        writable: !1,
        enumerable: !1,
        configurable: !0
    });
    var Zd = Symbol("Request internals"),
        pX9 = mM1.URL || ko7.URL,
        QX9 = mM1.parse,
        UX9 = mM1.format;

    function kZ8(A) {
        if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.exec(A)) A = new pX9(A).toString();
        return QX9(A)
    }
    var dX9 = "destroy" in KI.Readable.prototype;

    function uM1(A) {
        return typeof A === "object" && typeof A[Zd] === "object"
    }

    function cX9(A) {
        let q = A && typeof A === "object" && Object.getPrototypeOf(A);
        return !!(q && q.constructor.name === "AbortSignal")
    }
    class zt {
        constructor(A) {
            let q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
                K;
            if (!uM1(A)) {
                if (A && A.href) K = kZ8(A.href);
                else K = kZ8(`${A}`);
                A = {}
            } else K = kZ8(A.url);
            let Y = q.method || A.method || "GET";
            if (Y = Y.toUpperCase(), (q.body != null || uM1(A) && A.body !== null) && (Y === "GET" || Y === "HEAD")) throw TypeError("Request with GET/HEAD method cannot have body");
            let z = q.body != null ? q.body : uM1(A) && A.body !== null ? yo7(A) : null;
            jX.call(this, z, {
                timeout: q.timeout || A.timeout || 0,
                size: q.size || A.size || 0
            });
            let _ = new eL(q.headers || A.headers || {});
            if (z != null && !_.has("Content-Type")) {
                let O = Lo7(z);
                if (O) _.append("Content-Type", O)
            }
            let w = uM1(A) ? A.signal : null;
            if ("signal" in q) w = q.signal;
            if (w != null && !cX9(w)) throw TypeError("Expected signal to be an instanceof AbortSignal");
            this[Zd] = {
                method: Y,
                redirect: q.redirect || A.redirect || "follow",
                headers: _,
                parsedURL: K,
                signal: w
            }, this.follow = q.follow !== void 0 ? q.follow : A.follow !== void 0 ? A.follow : 20, this.compress = q.compress !== void 0 ? q.compress : A.compress !== void 0 ? A.compress : !0, this.counter = q.counter || A.counter || 0, this.agent = q.agent || A.agent
        }
        get method() {
            return this[Zd].method
        }
        get url() {
            return UX9(this[Zd].parsedURL)
        }
        get headers() {
            return this[Zd].headers
        }
        get redirect() {
            return this[Zd].redirect
        }
        get signal() {
            return this[Zd].signal
        }
        clone() {
            return new zt(this)
        }
    }
    jX.mixIn(zt.prototype);
    Object.defineProperty(zt.prototype, Symbol.toStringTag, {
        value: "Request",
        writable: !1,
        enumerable: !1,
        configurable: !0
    });
    Object.defineProperties(zt.prototype, {
        method: {
            enumerable: !0
        },
        url: {
            enumerable: !0
        },
        headers: {
            enumerable: !0
        },
        redirect: {
            enumerable: !0
        },
        clone: {
            enumerable: !0
        },
        signal: {
            enumerable: !0
        }
    });

    function lX9(A) {
        let q = A[Zd].parsedURL,
            K = new eL(A[Zd].headers);
        if (!K.has("Accept")) K.set("Accept", "*/*");
        if (!q.protocol || !q.hostname) throw TypeError("Only absolute URLs are supported");
        if (!/^https?:$/.test(q.protocol)) throw TypeError("Only HTTP(S) protocols are supported");
        if (A.signal && A.body instanceof KI.Readable && !dX9) throw Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
        let Y = null;
        if (A.body == null && /^(POST|PUT)$/i.test(A.method)) Y = "0";
        if (A.body != null) {
            let _ = Ro7(A);
            if (typeof _ === "number") Y = String(_)
        }
        if (Y) K.set("Content-Length", Y);
        if (!K.has("User-Agent")) K.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
        if (A.compress && !K.has("Accept-Encoding")) K.set("Accept-Encoding", "gzip,deflate");
        let z = A.agent;
        if (typeof z === "function") z = z(q);
        return Object.assign({}, q, {
            method: A.method,
            headers: BX9(K),
            agent: z
        })
    }

    function K06(A) {
        Error.call(this, A), this.type = "aborted", this.message = A, Error.captureStackTrace(this, this.constructor)
    }
    K06.prototype = Object.create(Error.prototype);
    K06.prototype.constructor = K06;
    K06.prototype.name = "AbortError";
    var Sg6 = mM1.URL || ko7.URL,
        No7 = KI.PassThrough,
        iX9 = function(q, K) {
            let Y = new Sg6(K).hostname,
                z = new Sg6(q).hostname;
            return Y === z || Y[Y.length - z.length - 1] === "." && Y.endsWith(z)
        },
        nX9 = function(q, K) {
            let Y = new Sg6(K).protocol,
                z = new Sg6(q).protocol;
            return Y === z
        };

    function Yt(A, q) {
        if (!Yt.Promise) throw Error("native promise missing, set fetch.Promise to your favorite alternative");
        return jX.Promise = Yt.Promise, new Yt.Promise(function(K, Y) {
            let z = new zt(A, q),
                _ = lX9(z),
                w = (_.protocol === "https:" ? bX9 : Vo7).request,
                O = z.signal,
                $ = null,
                H = function() {
                    let P = new K06("The user aborted a request.");
                    if (Y(P), z.body && z.body instanceof KI.Readable) EZ8(z.body, P);
                    if (!$ || !$.body) return;
                    $.body.emit("error", P)
                };
            if (O && O.aborted) {
                H();
                return
            }
            let j = function() {
                    H(), D()
                },
                J = w(_),
                M;
            if (O) O.addEventListener("abort", j);

            function D() {
                if (J.abort(), O) O.removeEventListener("abort", j);
                clearTimeout(M)
            }
            if (z.timeout) J.once("socket", function(X) {
                M = setTimeout(function() {
                    Y(new oP(`network timeout at: ${z.url}`, "request-timeout")), D()
                }, z.timeout)
            });
            if (J.on("error", function(X) {
                    if (Y(new oP(`request to ${z.url} failed, reason: ${X.message}`, "system", X)), $ && $.body) EZ8($.body, X);
                    D()
                }), rX9(J, function(X) {
                    if (O && O.aborted) return;
                    if ($ && $.body) EZ8($.body, X)
                }), parseInt(process.version.substring(1)) < 14) J.on("socket", function(X) {
                X.addListener("close", function(P) {
                    let W = X.listenerCount("data") > 0;
                    if ($ && W && !P && !(O && O.aborted)) {
                        let Z = Error("Premature close");
                        Z.code = "ERR_STREAM_PREMATURE_CLOSE", $.body.emit("error", Z)
                    }
                })
            });
            J.on("response", function(X) {
                clearTimeout(M);
                let P = gX9(X.headers);
                if (Yt.isRedirect(X.statusCode)) {
                    let v = P.get("Location"),
                        N = null;
                    try {
                        N = v === null ? null : new Sg6(v, z.url).toString()
                    } catch (V) {
                        if (z.redirect !== "manual") {
                            Y(new oP(`uri requested responds with an invalid redirect URL: ${v}`, "invalid-redirect")), D();
                            return
                        }
                    }
                    switch (z.redirect) {
                        case "error":
                            Y(new oP(`uri requested responds with a redirect, redirect mode is set to error: ${z.url}`, "no-redirect")), D();
                            return;
                        case "manual":
                            if (N !== null) try {
                                P.set("Location", N)
                            } catch (L) {
                                Y(L)
                            }
                            break;
                        case "follow":
                            if (N === null) break;
                            if (z.counter >= z.follow) {
                                Y(new oP(`maximum redirect reached at: ${z.url}`, "max-redirect")), D();
                                return
                            }
                            let V = {
                                headers: new eL(z.headers),
                                follow: z.follow,
                                counter: z.counter + 1,
                                agent: z.agent,
                                compress: z.compress,
                                method: z.method,
                                body: z.body,
                                signal: z.signal,
                                timeout: z.timeout,
                                size: z.size
                            };
                            if (!iX9(z.url, N) || !nX9(z.url, N))
                                for (let L of ["authorization", "www-authenticate", "cookie", "cookie2"]) V.headers.delete(L);
                            if (X.statusCode !== 303 && z.body && Ro7(z) === null) {
                                Y(new oP("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), D();
                                return
                            }
                            if (X.statusCode === 303 || (X.statusCode === 301 || X.statusCode === 302) && z.method === "POST") V.method = "GET", V.body = void 0, V.headers.delete("content-length");
                            K(Yt(new zt(N, V))), D();
                            return
                    }
                }
                X.once("end", function() {
                    if (O) O.removeEventListener("abort", j)
                });
                let W = X.pipe(new No7),
                    Z = {
                        url: z.url,
                        status: X.statusCode,
                        statusText: X.statusMessage,
                        headers: P,
                        size: z.size,
                        timeout: z.timeout,
                        counter: z.counter
                    },
                    G = P.get("Content-Encoding");
                if (!z.compress || z.method === "HEAD" || G === null || X.statusCode === 204 || X.statusCode === 304) {
                    $ = new tL(W, Z), K($);
                    return
                }
                let f = {
                    flush: a56.Z_SYNC_FLUSH,
                    finishFlush: a56.Z_SYNC_FLUSH
                };
                if (G == "gzip" || G == "x-gzip") {
                    W = W.pipe(a56.createGunzip(f)), $ = new tL(W, Z), K($);
                    return
                }
                if (G == "deflate" || G == "x-deflate") {
                    let v = X.pipe(new No7);
                    v.once("data", function(N) {
                        if ((N[0] & 15) === 8) W = W.pipe(a56.createInflate());
                        else W = W.pipe(a56.createInflateRaw());
                        $ = new tL(W, Z), K($)
                    }), v.on("end", function() {
                        if (!$) $ = new tL(W, Z), K($)
                    });
                    return
                }
                if (G == "br" && typeof a56.createBrotliDecompress === "function") {
                    W = W.pipe(a56.createBrotliDecompress()), $ = new tL(W, Z), K($);
                    return
                }
                $ = new tL(W, Z), K($)
            }), mX9(J, z)
        })
    }

    function rX9(A, q) {
        let K;
        A.on("socket", function(Y) {
            K = Y
        }), A.on("response", function(Y) {
            let z = Y.headers;
            if (z["transfer-encoding"] === "chunked" && !z["content-length"]) Y.once("close", function(_) {
                if (K && K.listenerCount("data") > 0 && !_) {
                    let O = Error("Premature close");
                    O.code = "ERR_STREAM_PREMATURE_CLOSE", q(O)
                }
            })
        })
    }

    function EZ8(A, q) {
        if (A.destroy) A.destroy(q);
        else A.emit("error", q), A.end()
    }
    Yt.isRedirect = function(A) {
        return A === 301 || A === 302 || A === 303 || A === 307 || A === 308
    };
    Yt.Promise = global.Promise;
    So7.exports = YI = Yt;
    Object.defineProperty(YI, "__esModule", {
        value: !0
    });
    YI.default = YI;
    YI.Headers = eL;
    YI.Request = zt;
    YI.Response = tL;
    YI.FetchError = oP;
    YI.AbortError = K06
})
// @from(Ln 207816, Col 4)
Io7 = x((jS2, Co7) => {
    var zB = (A) => A !== null && typeof A === "object" && typeof A.pipe === "function";
    zB.writable = (A) => zB(A) && A.writable !== !1 && typeof A._write === "function" && typeof A._writableState === "object";
    zB.readable = (A) => zB(A) && A.readable !== !1 && typeof A._read === "function" && typeof A._readableState === "object";
    zB.duplex = (A) => zB.writable(A) && zB.readable(A);
    zB.transform = (A) => zB.duplex(A) && typeof A._transform === "function";
    Co7.exports = zB
})
// @from(Ln 207824, Col 4)
bo7 = x((JS2, oX9) => {
    oX9.exports = {
        name: "gaxios",
        version: "6.7.1",
        description: "A simple common HTTP client specifically for Google APIs and services.",
        main: "build/src/index.js",
        types: "build/src/index.d.ts",
        files: ["build/src"],
        scripts: {
            lint: "gts check",
            test: "c8 mocha build/test",
            "presystem-test": "npm run compile",
            "system-test": "mocha build/system-test --timeout 80000",
            compile: "tsc -p .",
            fix: "gts fix",
            prepare: "npm run compile",
            pretest: "npm run compile",
            webpack: "webpack",
            "prebrowser-test": "npm run compile",
            "browser-test": "node build/browser-test/browser-test-runner.js",
            docs: "compodoc src/",
            "docs-test": "linkinator docs",
            "predocs-test": "npm run docs",
            "samples-test": "cd samples/ && npm link ../ && npm test && cd ../",
            prelint: "cd samples; npm link ../; npm install",
            clean: "gts clean",
            precompile: "gts clean"
        },
        repository: "googleapis/gaxios",
        keywords: ["google"],
        engines: {
            node: ">=14"
        },
        author: "Google, LLC",
        license: "Apache-2.0",
        devDependencies: {
            "@babel/plugin-proposal-private-methods": "^7.18.6",
            "@compodoc/compodoc": "1.1.19",
            "@types/cors": "^2.8.6",
            "@types/express": "^4.16.1",
            "@types/extend": "^3.0.1",
            "@types/mocha": "^9.0.0",
            "@types/multiparty": "0.0.36",
            "@types/mv": "^2.1.0",
            "@types/ncp": "^2.0.1",
            "@types/node": "^20.0.0",
            "@types/node-fetch": "^2.5.7",
            "@types/sinon": "^17.0.0",
            "@types/tmp": "0.2.6",
            "@types/uuid": "^10.0.0",
            "abort-controller": "^3.0.0",
            assert: "^2.0.0",
            browserify: "^17.0.0",
            c8: "^8.0.0",
            cheerio: "1.0.0-rc.10",
            cors: "^2.8.5",
            execa: "^5.0.0",
            express: "^4.16.4",
            "form-data": "^4.0.0",
            gts: "^5.0.0",
            "is-docker": "^2.0.0",
            karma: "^6.0.0",
            "karma-chrome-launcher": "^3.0.0",
            "karma-coverage": "^2.0.0",
            "karma-firefox-launcher": "^2.0.0",
            "karma-mocha": "^2.0.0",
            "karma-remap-coverage": "^0.1.5",
            "karma-sourcemap-loader": "^0.4.0",
            "karma-webpack": "5.0.0",
            linkinator: "^3.0.0",
            mocha: "^8.0.0",
            multiparty: "^4.2.1",
            mv: "^2.1.1",
            ncp: "^2.0.0",
            nock: "^13.0.0",
            "null-loader": "^4.0.0",
            puppeteer: "^19.0.0",
            sinon: "^18.0.0",
            "stream-browserify": "^3.0.0",
            tmp: "0.2.3",
            "ts-loader": "^8.0.0",
            typescript: "^5.1.6",
            webpack: "^5.35.0",
            "webpack-cli": "^4.0.0"
        },
        dependencies: {
            extend: "^3.0.2",
            "https-proxy-agent": "^7.0.1",
            "is-stream": "^2.0.0",
            "node-fetch": "^2.6.9",
            uuid: "^9.0.1"
        }
    }
})
// @from(Ln 207918, Col 4)
mo7 = x((xo7) => {
    Object.defineProperty(xo7, "__esModule", {
        value: !0
    });
    xo7.pkg = void 0;
    xo7.pkg = bo7()
})
// @from(Ln 207925, Col 4)
xZ8 = x((AR) => {
    var aX9 = AR && AR.__importDefault || function(A) {
            return A && A.__esModule ? A : {
                default: A
            }
        },
        Bo7;
    Object.defineProperty(AR, "__esModule", {
        value: !0
    });
    AR.GaxiosError = AR.GAXIOS_ERROR_SYMBOL = void 0;
    AR.defaultErrorRedactor = Fo7;
    var sX9 = x6("url"),
        IZ8 = mo7(),
        go7 = aX9(qZ8());
    AR.GAXIOS_ERROR_SYMBOL = Symbol.for(`${IZ8.pkg.name}-gaxios-error`);
    class bZ8 extends Error {
        static[(Bo7 = AR.GAXIOS_ERROR_SYMBOL, Symbol.hasInstance)](A) {
            if (A && typeof A === "object" && AR.GAXIOS_ERROR_SYMBOL in A && A[AR.GAXIOS_ERROR_SYMBOL] === IZ8.pkg.version) return !0;
            return Function.prototype[Symbol.hasInstance].call(bZ8, A)
        }
        constructor(A, q, K, Y) {
            var z;
            super(A);
            if (this.config = q, this.response = K, this.error = Y, this[Bo7] = IZ8.pkg.version, this.config = (0, go7.default)(!0, {}, q), this.response) this.response.config = (0, go7.default)(!0, {}, this.response.config);
            if (this.response) {
                try {
                    this.response.data = tX9(this.config.responseType, (z = this.response) === null || z === void 0 ? void 0 : z.data)
                } catch (_) {}
                this.status = this.response.status
            }
            if (Y && "code" in Y && Y.code) this.code = Y.code;
            if (q.errorRedactor) q.errorRedactor({
                config: this.config,
                response: this.response
            })
        }
    }
    AR.GaxiosError = bZ8;

    function tX9(A, q) {
        switch (A) {
            case "stream":
                return q;
            case "json":
                return JSON.parse(JSON.stringify(q));
            case "arraybuffer":
                return JSON.parse(Buffer.from(q).toString("utf8"));
            case "blob":
                return JSON.parse(q.text());
            default:
                return q
        }
    }

    function Fo7(A) {
        function K(_) {
            if (!_) return;
            for (let w of Object.keys(_)) {
                if (/^authentication$/i.test(w)) _[w] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
                if (/^authorization$/i.test(w)) _[w] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
                if (/secret/i.test(w)) _[w] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>."
            }
        }

        function Y(_, w) {
            if (typeof _ === "object" && _ !== null && typeof _[w] === "string") {
                let O = _[w];
                if (/grant_type=/i.test(O) || /assertion=/i.test(O) || /secret/i.test(O)) _[w] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>."
            }
        }

        function z(_) {
            if (typeof _ === "object" && _ !== null) {
                if ("grant_type" in _) _.grant_type = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
                if ("assertion" in _) _.assertion = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
                if ("client_secret" in _) _.client_secret = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>."
            }
        }
        if (A.config) {
            K(A.config.headers), Y(A.config, "data"), z(A.config.data), Y(A.config, "body"), z(A.config.body);
            try {
                let _ = new sX9.URL("", A.config.url);
                if (_.searchParams.has("token")) _.searchParams.set("token", "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.");
                if (_.searchParams.has("client_secret")) _.searchParams.set("client_secret", "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.");
                A.config.url = _.toString()
            } catch (_) {}
        }
        if (A.response) Fo7({
            config: A.response.config
        }), K(A.response.headers), Y(A.response, "data"), z(A.response.data);
        return A
    }
})
// @from(Ln 208019, Col 4)
Uo7 = x((Qo7) => {
    Object.defineProperty(Qo7, "__esModule", {
        value: !0
    });
    Qo7.getRetryConfig = eX9;
    async function eX9(A) {
        let q = po7(A);
        if (!A || !A.config || !q && !A.config.retry) return {
            shouldRetry: !1
        };
        q = q || {}, q.currentRetryAttempt = q.currentRetryAttempt || 0, q.retry = q.retry === void 0 || q.retry === null ? 3 : q.retry, q.httpMethodsToRetry = q.httpMethodsToRetry || ["GET", "HEAD", "PUT", "OPTIONS", "DELETE"], q.noResponseRetries = q.noResponseRetries === void 0 || q.noResponseRetries === null ? 2 : q.noResponseRetries, q.retryDelayMultiplier = q.retryDelayMultiplier ? q.retryDelayMultiplier : 2, q.timeOfFirstRequest = q.timeOfFirstRequest ? q.timeOfFirstRequest : Date.now(), q.totalTimeout = q.totalTimeout ? q.totalTimeout : Number.MAX_SAFE_INTEGER, q.maxRetryDelay = q.maxRetryDelay ? q.maxRetryDelay : Number.MAX_SAFE_INTEGER;
        let K = [
            [100, 199],
            [408, 408],
            [429, 429],
            [500, 599]
        ];
        if (q.statusCodesToRetry = q.statusCodesToRetry || K, A.config.retryConfig = q, !await (q.shouldRetry || AP9)(A)) return {
            shouldRetry: !1,
            config: A.config
        };
        let z = qP9(q);
        A.config.retryConfig.currentRetryAttempt += 1;
        let _ = q.retryBackoff ? q.retryBackoff(A, z) : new Promise((w) => {
            setTimeout(w, z)
        });
        if (q.onRetryAttempt) q.onRetryAttempt(A);
        return await _, {
            shouldRetry: !0,
            config: A.config
        }
    }

    function AP9(A) {
        var q;
        let K = po7(A);
        if (A.name === "AbortError" || ((q = A.error) === null || q === void 0 ? void 0 : q.name) === "AbortError") return !1;
        if (!K || K.retry === 0) return !1;
        if (!A.response && (K.currentRetryAttempt || 0) >= K.noResponseRetries) return !1;
        if (!A.config.method || K.httpMethodsToRetry.indexOf(A.config.method.toUpperCase()) < 0) return !1;
        if (A.response && A.response.status) {
            let Y = !1;
            for (let [z, _] of K.statusCodesToRetry) {
                let w = A.response.status;
                if (w >= z && w <= _) {
                    Y = !0;
                    break
                }
            }
            if (!Y) return !1
        }
        if (K.currentRetryAttempt = K.currentRetryAttempt || 0, K.currentRetryAttempt >= K.retry) return !1;
        return !0
    }

    function po7(A) {
        if (A && A.config && A.config.retryConfig) return A.config.retryConfig;
        return
    }

    function qP9(A) {
        var q;
        let Y = (A.currentRetryAttempt ? 0 : (q = A.retryDelay) !== null && q !== void 0 ? q : 100) + (Math.pow(A.retryDelayMultiplier, A.currentRetryAttempt) - 1) / 2 * 1000,
            z = A.totalTimeout - (Date.now() - A.timeOfFirstRequest);
        return Math.min(Y, z, A.maxRetryDelay)
    }
})
// @from(Ln 208086, Col 4)
uZ8 = x((do7) => {
    Object.defineProperty(do7, "__esModule", {
        value: !0
    });
    do7.default = _P9;
    var YP9 = zP9(x6("crypto"));

    function zP9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var gM1 = new Uint8Array(256),
        BM1 = gM1.length;

    function _P9() {
        if (BM1 > gM1.length - 16) YP9.default.randomFillSync(gM1), BM1 = 0;
        return gM1.slice(BM1, BM1 += 16)
    }
})
// @from(Ln 208106, Col 4)
io7 = x((co7) => {
    Object.defineProperty(co7, "__esModule", {
        value: !0
    });
    co7.default = void 0;
    var OP9 = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    co7.default = OP9
})
// @from(Ln 208114, Col 4)
Ig6 = x((no7) => {
    Object.defineProperty(no7, "__esModule", {
        value: !0
    });
    no7.default = void 0;
    var $P9 = HP9(io7());

    function HP9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function jP9(A) {
        return typeof A === "string" && $P9.default.test(A)
    }
    var JP9 = jP9;
    no7.default = JP9
})
// @from(Ln 208133, Col 4)
bg6 = x((ao7) => {
    Object.defineProperty(ao7, "__esModule", {
        value: !0
    });
    ao7.default = void 0;
    ao7.unsafeStringify = oo7;
    var MP9 = DP9(Ig6());

    function DP9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var aP = [];
    for (let A = 0; A < 256; ++A) aP.push((A + 256).toString(16).slice(1));

    function oo7(A, q = 0) {
        return aP[A[q + 0]] + aP[A[q + 1]] + aP[A[q + 2]] + aP[A[q + 3]] + "-" + aP[A[q + 4]] + aP[A[q + 5]] + "-" + aP[A[q + 6]] + aP[A[q + 7]] + "-" + aP[A[q + 8]] + aP[A[q + 9]] + "-" + aP[A[q + 10]] + aP[A[q + 11]] + aP[A[q + 12]] + aP[A[q + 13]] + aP[A[q + 14]] + aP[A[q + 15]]
    }

    function XP9(A, q = 0) {
        let K = oo7(A, q);
        if (!(0, MP9.default)(K)) throw TypeError("Stringified UUID is invalid");
        return K
    }
    var PP9 = XP9;
    ao7.default = PP9
})
// @from(Ln 208161, Col 4)
qa7 = x((eo7) => {
    Object.defineProperty(eo7, "__esModule", {
        value: !0
    });
    eo7.default = void 0;
    var ZP9 = fP9(uZ8()),
        GP9 = bg6();

    function fP9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var to7, mZ8, BZ8 = 0,
        gZ8 = 0;

    function TP9(A, q, K) {
        let Y = q && K || 0,
            z = q || Array(16);
        A = A || {};
        let _ = A.node || to7,
            w = A.clockseq !== void 0 ? A.clockseq : mZ8;
        if (_ == null || w == null) {
            let M = A.random || (A.rng || ZP9.default)();
            if (_ == null) _ = to7 = [M[0] | 1, M[1], M[2], M[3], M[4], M[5]];
            if (w == null) w = mZ8 = (M[6] << 8 | M[7]) & 16383
        }
        let O = A.msecs !== void 0 ? A.msecs : Date.now(),
            $ = A.nsecs !== void 0 ? A.nsecs : gZ8 + 1,
            H = O - BZ8 + ($ - gZ8) / 1e4;
        if (H < 0 && A.clockseq === void 0) w = w + 1 & 16383;
        if ((H < 0 || O > BZ8) && A.nsecs === void 0) $ = 0;
        if ($ >= 1e4) throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
        BZ8 = O, gZ8 = $, mZ8 = w, O += 12219292800000;
        let j = ((O & 268435455) * 1e4 + $) % 4294967296;
        z[Y++] = j >>> 24 & 255, z[Y++] = j >>> 16 & 255, z[Y++] = j >>> 8 & 255, z[Y++] = j & 255;
        let J = O / 4294967296 * 1e4 & 268435455;
        z[Y++] = J >>> 8 & 255, z[Y++] = J & 255, z[Y++] = J >>> 24 & 15 | 16, z[Y++] = J >>> 16 & 255, z[Y++] = w >>> 8 | 128, z[Y++] = w & 255;
        for (let M = 0; M < 6; ++M) z[Y + M] = _[M];
        return q || (0, GP9.unsafeStringify)(z)
    }
    var vP9 = TP9;
    eo7.default = vP9
})
// @from(Ln 208205, Col 4)
FZ8 = x((Ka7) => {
    Object.defineProperty(Ka7, "__esModule", {
        value: !0
    });
    Ka7.default = void 0;
    var NP9 = VP9(Ig6());

    function VP9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function kP9(A) {
        if (!(0, NP9.default)(A)) throw TypeError("Invalid UUID");
        let q, K = new Uint8Array(16);
        return K[0] = (q = parseInt(A.slice(0, 8), 16)) >>> 24, K[1] = q >>> 16 & 255, K[2] = q >>> 8 & 255, K[3] = q & 255, K[4] = (q = parseInt(A.slice(9, 13), 16)) >>> 8, K[5] = q & 255, K[6] = (q = parseInt(A.slice(14, 18), 16)) >>> 8, K[7] = q & 255, K[8] = (q = parseInt(A.slice(19, 23), 16)) >>> 8, K[9] = q & 255, K[10] = (q = parseInt(A.slice(24, 36), 16)) / 1099511627776 & 255, K[11] = q / 4294967296 & 255, K[12] = q >>> 24 & 255, K[13] = q >>> 16 & 255, K[14] = q >>> 8 & 255, K[15] = q & 255, K
    }
    var EP9 = kP9;
    Ka7.default = EP9
})
// @from(Ln 208226, Col 4)
pZ8 = x((wa7) => {
    Object.defineProperty(wa7, "__esModule", {
        value: !0
    });
    wa7.URL = wa7.DNS = void 0;
    wa7.default = SP9;
    var yP9 = bg6(),
        LP9 = RP9(FZ8());

    function RP9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function hP9(A) {
        A = unescape(encodeURIComponent(A));
        let q = [];
        for (let K = 0; K < A.length; ++K) q.push(A.charCodeAt(K));
        return q
    }
    var za7 = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    wa7.DNS = za7;
    var _a7 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
    wa7.URL = _a7;

    function SP9(A, q, K) {
        function Y(z, _, w, O) {
            var $;
            if (typeof z === "string") z = hP9(z);
            if (typeof _ === "string") _ = (0, LP9.default)(_);
            if ((($ = _) === null || $ === void 0 ? void 0 : $.length) !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
            let H = new Uint8Array(16 + z.length);
            if (H.set(_), H.set(z, _.length), H = K(H), H[6] = H[6] & 15 | q, H[8] = H[8] & 63 | 128, w) {
                O = O || 0;
                for (let j = 0; j < 16; ++j) w[O + j] = H[j];
                return w
            }
            return (0, yP9.unsafeStringify)(H)
        }
        try {
            Y.name = A
        } catch (z) {}
        return Y.DNS = za7, Y.URL = _a7, Y
    }
})
// @from(Ln 208272, Col 4)
ja7 = x(($a7) => {
    Object.defineProperty($a7, "__esModule", {
        value: !0
    });
    $a7.default = void 0;
    var bP9 = xP9(x6("crypto"));

    function xP9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function uP9(A) {
        if (Array.isArray(A)) A = Buffer.from(A);
        else if (typeof A === "string") A = Buffer.from(A, "utf8");
        return bP9.default.createHash("md5").update(A).digest()
    }
    var mP9 = uP9;
    $a7.default = mP9
})
// @from(Ln 208293, Col 4)
Xa7 = x((Ma7) => {
    Object.defineProperty(Ma7, "__esModule", {
        value: !0
    });
    Ma7.default = void 0;
    var BP9 = Ja7(pZ8()),
        gP9 = Ja7(ja7());

    function Ja7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var FP9 = (0, BP9.default)("v3", 48, gP9.default),
        pP9 = FP9;
    Ma7.default = pP9
})
// @from(Ln 208310, Col 4)
Za7 = x((Pa7) => {
    Object.defineProperty(Pa7, "__esModule", {
        value: !0
    });
    Pa7.default = void 0;
    var QP9 = UP9(x6("crypto"));

    function UP9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var dP9 = {
        randomUUID: QP9.default.randomUUID
    };
    Pa7.default = dP9
})
// @from(Ln 208327, Col 4)
Na7 = x((Ta7) => {
    Object.defineProperty(Ta7, "__esModule", {
        value: !0
    });
    Ta7.default = void 0;
    var Ga7 = fa7(Za7()),
        cP9 = fa7(uZ8()),
        lP9 = bg6();

    function fa7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function iP9(A, q, K) {
        if (Ga7.default.randomUUID && !q && !A) return Ga7.default.randomUUID();
        A = A || {};
        let Y = A.random || (A.rng || cP9.default)();
        if (Y[6] = Y[6] & 15 | 64, Y[8] = Y[8] & 63 | 128, q) {
            K = K || 0;
            for (let z = 0; z < 16; ++z) q[K + z] = Y[z];
            return q
        }
        return (0, lP9.unsafeStringify)(Y)
    }
    var nP9 = iP9;
    Ta7.default = nP9
})
// @from(Ln 208356, Col 4)
Ea7 = x((Va7) => {
    Object.defineProperty(Va7, "__esModule", {
        value: !0
    });
    Va7.default = void 0;
    var rP9 = oP9(x6("crypto"));

    function oP9(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function aP9(A) {
        if (Array.isArray(A)) A = Buffer.from(A);
        else if (typeof A === "string") A = Buffer.from(A, "utf8");
        return rP9.default.createHash("sha1").update(A).digest()
    }
    var sP9 = aP9;
    Va7.default = sP9
})
// @from(Ln 208377, Col 4)
ha7 = x((La7) => {
    Object.defineProperty(La7, "__esModule", {
        value: !0
    });
    La7.default = void 0;
    var tP9 = ya7(pZ8()),
        eP9 = ya7(Ea7());

    function ya7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var A09 = (0, tP9.default)("v5", 80, eP9.default),
        q09 = A09;
    La7.default = q09
})
// @from(Ln 208394, Col 4)
Ia7 = x((Sa7) => {
    Object.defineProperty(Sa7, "__esModule", {
        value: !0
    });
    Sa7.default = void 0;
    var K09 = "00000000-0000-0000-0000-000000000000";
    Sa7.default = K09
})
// @from(Ln 208402, Col 4)
ua7 = x((ba7) => {
    Object.defineProperty(ba7, "__esModule", {
        value: !0
    });
    ba7.default = void 0;
    var Y09 = z09(Ig6());

    function z09(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function _09(A) {
        if (!(0, Y09.default)(A)) throw TypeError("Invalid UUID");
        return parseInt(A.slice(14, 15), 16)
    }
    var w09 = _09;
    ba7.default = w09
})
// @from(Ln 208422, Col 4)
ma7 = x((zI) => {
    Object.defineProperty(zI, "__esModule", {
        value: !0
    });
    Object.defineProperty(zI, "NIL", {
        enumerable: !0,
        get: function() {
            return J09.default
        }
    });
    Object.defineProperty(zI, "parse", {
        enumerable: !0,
        get: function() {
            return P09.default
        }
    });
    Object.defineProperty(zI, "stringify", {
        enumerable: !0,
        get: function() {
            return X09.default
        }
    });
    Object.defineProperty(zI, "v1", {
        enumerable: !0,
        get: function() {
            return O09.default
        }
    });
    Object.defineProperty(zI, "v3", {
        enumerable: !0,
        get: function() {
            return $09.default
        }
    });
    Object.defineProperty(zI, "v4", {
        enumerable: !0,
        get: function() {
            return H09.default
        }
    });
    Object.defineProperty(zI, "v5", {
        enumerable: !0,
        get: function() {
            return j09.default
        }
    });
    Object.defineProperty(zI, "validate", {
        enumerable: !0,
        get: function() {
            return D09.default
        }
    });
    Object.defineProperty(zI, "version", {
        enumerable: !0,
        get: function() {
            return M09.default
        }
    });
    var O09 = fd(qa7()),
        $09 = fd(Xa7()),
        H09 = fd(Na7()),
        j09 = fd(ha7()),
        J09 = fd(Ia7()),
        M09 = fd(ua7()),
        D09 = fd(Ig6()),
        X09 = fd(bg6()),
        P09 = fd(FZ8());

    function fd(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
})
// @from(Ln 208496, Col 4)
QZ8 = x((ga7) => {
    Object.defineProperty(ga7, "__esModule", {
        value: !0
    });
    ga7.GaxiosInterceptorManager = void 0;
    class Ba7 extends Set {}
    ga7.GaxiosInterceptorManager = Ba7
})
// @from(Ln 208504, Col 4)
aa7 = x((sW) => {
    var W09 = sW && sW.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            var z = Object.getOwnPropertyDescriptor(q, K);
            if (!z || ("get" in z ? !q.__esModule : z.writable || z.configurable)) z = {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            };
            Object.defineProperty(A, Y, z)
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        Z09 = sW && sW.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        G09 = sW && sW.__importStar || function(A) {
            if (A && A.__esModule) return A;
            var q = {};
            if (A != null) {
                for (var K in A)
                    if (K !== "default" && Object.prototype.hasOwnProperty.call(A, K)) W09(q, A, K)
            }
            return Z09(q, A), q
        },
        t56 = sW && sW.__classPrivateFieldGet || function(A, q, K, Y) {
            if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
            if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
        },
        f09 = sW && sW.__classPrivateFieldSet || function(A, q, K, Y, z) {
            if (Y === "m") throw TypeError("Private method is not writable");
            if (Y === "a" && !z) throw TypeError("Private accessor was defined without a setter");
            if (typeof q === "function" ? A !== q || !z : !q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
            return Y === "a" ? z.call(A, K) : z ? z.value = K : q.set(A, K), K
        },
        QM1 = sW && sW.__importDefault || function(A) {
            return A && A.__esModule ? A : {
                default: A
            }
        },
        z06, s56, pa7, ia7, na7, ra7, FM1, Qa7;
    Object.defineProperty(sW, "__esModule", {
        value: !0
    });
    sW.Gaxios = void 0;
    var T09 = QM1(qZ8()),
        v09 = x6("https"),
        N09 = QM1(CZ8()),
        V09 = QM1(x6("querystring")),
        k09 = QM1(Io7()),
        Ua7 = x6("url"),
        pM1 = xZ8(),
        E09 = Uo7(),
        da7 = x6("stream"),
        y09 = ma7(),
        ca7 = QZ8(),
        L09 = h09() ? window.fetch : N09.default;

    function R09() {
        return typeof window < "u" && !!window
    }

    function h09() {
        return R09() && !!window.fetch
    }

    function S09() {
        return typeof Buffer < "u"
    }

    function la7(A, q) {
        return !!oa7(A, q)
    }

    function oa7(A, q) {
        q = q.toLowerCase();
        for (let K of Object.keys((A === null || A === void 0 ? void 0 : A.headers) || {}))
            if (q === K.toLowerCase()) return A.headers[K];
        return
    }
    class UZ8 {
        constructor(A) {
            z06.add(this), this.agentCache = new Map, this.defaults = A || {}, this.interceptors = {
                request: new ca7.GaxiosInterceptorManager,
                response: new ca7.GaxiosInterceptorManager
            }
        }
        async request(A = {}) {
            return A = await t56(this, z06, "m", ra7).call(this, A), A = await t56(this, z06, "m", ia7).call(this, A), t56(this, z06, "m", na7).call(this, this._request(A))
        }
        async _defaultAdapter(A) {
            let K = await (A.fetchImplementation || L09)(A.url, A),
                Y = await this.getResponseData(A, K);
            return this.translateResponse(A, K, Y)
        }
        async _request(A = {}) {
            var q;
            try {
                let K;
                if (A.adapter) K = await A.adapter(A, this._defaultAdapter.bind(this));
                else K = await this._defaultAdapter(A);
                if (!A.validateStatus(K.status)) {
                    if (A.responseType === "stream") {
                        let Y = "";
                        await new Promise((z) => {
                            (K === null || K === void 0 ? void 0 : K.data).on("data", (_) => {
                                Y += _
                            }), (K === null || K === void 0 ? void 0 : K.data).on("end", z)
                        }), K.data = Y
                    }
                    throw new pM1.GaxiosError(`Request failed with status code ${K.status}`, A, K)
                }
                return K
            } catch (K) {
                let Y = K instanceof pM1.GaxiosError ? K : new pM1.GaxiosError(K.message, A, void 0, K),
                    {
                        shouldRetry: z,
                        config: _
                    } = await (0, E09.getRetryConfig)(Y);
                if (z && _) return Y.config.retryConfig.currentRetryAttempt = _.retryConfig.currentRetryAttempt, A.retryConfig = (q = Y.config) === null || q === void 0 ? void 0 : q.retryConfig, this._request(A);
                throw Y
            }
        }
        async getResponseData(A, q) {
            switch (A.responseType) {
                case "stream":
                    return q.body;
                case "json": {
                    let K = await q.text();
                    try {
                        K = JSON.parse(K)
                    } catch (Y) {}
                    return K
                }
                case "arraybuffer":
                    return q.arrayBuffer();
                case "blob":
                    return q.blob();
                case "text":
                    return q.text();
                default:
                    return this.getResponseDataFromContentType(q)
            }
        }
        validateStatus(A) {
            return A >= 200 && A < 300
        }
        paramsSerializer(A) {
            return V09.default.stringify(A)
        }
        translateResponse(A, q, K) {
            let Y = {};
            return q.headers.forEach((z, _) => {
                Y[_] = z
            }), {
                config: A,
                data: K,
                headers: Y,
                status: q.status,
                statusText: q.statusText,
                request: {
                    responseURL: q.url
                }
            }
        }
        async getResponseDataFromContentType(A) {
            let q = A.headers.get("Content-Type");
            if (q === null) return A.text();
            if (q = q.toLowerCase(), q.includes("application/json")) {
                let K = await A.text();
                try {
                    K = JSON.parse(K)
                } catch (Y) {}
                return K
            } else if (q.match(/^text\//)) return A.text();
            else return A.blob()
        }
        async * getMultipartRequest(A, q) {
            let K = `--${q}--`;
            for (let Y of A) {
                let z = Y.headers["Content-Type"] || "application/octet-stream";
                if (yield `--${q}\r
Content-Type: ${z}\r
\r
`, typeof Y.content === "string") yield Y.content;
                else yield* Y.content;
                yield `\r
`
            }
            yield K
        }
    }
    sW.Gaxios = UZ8;
    s56 = UZ8, z06 = new WeakSet, pa7 = function(q, K = []) {
        var Y, z;
        let _ = new Ua7.URL(q),
            w = [...K],
            O = ((z = (Y = process.env.NO_PROXY) !== null && Y !== void 0 ? Y : process.env.no_proxy) === null || z === void 0 ? void 0 : z.split(",")) || [];
        for (let $ of O) w.push($.trim());
        for (let $ of w)
            if ($ instanceof RegExp) {
                if ($.test(_.toString())) return !1
            } else if ($ instanceof Ua7.URL) {
            if ($.origin === _.origin) return !1
        } else if ($.startsWith("*.") || $.startsWith(".")) {
            let H = $.replace(/^\*\./, ".");
            if (_.hostname.endsWith(H)) return !1
        } else if ($ === _.origin || $ === _.hostname || $ === _.href) return !1;
        return !0
    }, ia7 = async function(q) {
        let K = Promise.resolve(q);
        for (let Y of this.interceptors.request.values())
            if (Y) K = K.then(Y.resolved, Y.rejected);
        return K
    }, na7 = async function(q) {
        let K = Promise.resolve(q);
        for (let Y of this.interceptors.response.values())
            if (Y) K = K.then(Y.resolved, Y.rejected);
        return K
    }, ra7 = async function(q) {
        var K, Y, z, _;
        let w = (0, T09.default)(!0, {}, this.defaults, q);
        if (!w.url) throw Error("URL is required.");
        let O = w.baseUrl || w.baseURL;
        if (O) w.url = O.toString() + w.url;
        if (w.paramsSerializer = w.paramsSerializer || this.paramsSerializer, w.params && Object.keys(w.params).length > 0) {
            let j = w.paramsSerializer(w.params);
            if (j.startsWith("?")) j = j.slice(1);
            let J = w.url.toString().includes("?") ? "&" : "?";
            w.url = w.url + J + j
        }
        if (typeof q.maxContentLength === "number") w.size = q.maxContentLength;
        if (typeof q.maxRedirects === "number") w.follow = q.maxRedirects;
        if (w.headers = w.headers || {}, w.multipart === void 0 && w.data) {
            let j = typeof FormData > "u" ? !1 : (w === null || w === void 0 ? void 0 : w.data) instanceof FormData;
            if (k09.default.readable(w.data)) w.body = w.data;
            else if (S09() && Buffer.isBuffer(w.data)) {
                if (w.body = w.data, !la7(w, "Content-Type")) w.headers["Content-Type"] = "application/json"
            } else if (typeof w.data === "object") {
                if (!j)
                    if (oa7(w, "content-type") === "application/x-www-form-urlencoded") w.body = w.paramsSerializer(w.data);
                    else {
                        if (!la7(w, "Content-Type")) w.headers["Content-Type"] = "application/json";
                        w.body = JSON.stringify(w.data)
                    }
            } else w.body = w.data
        } else if (w.multipart && w.multipart.length > 0) {
            let j = (0, y09.v4)();
            w.headers["Content-Type"] = `multipart/related; boundary=${j}`;
            let J = new da7.PassThrough;
            w.body = J, (0, da7.pipeline)(this.getMultipartRequest(w.multipart, j), J, () => {})
        }
        if (w.validateStatus = w.validateStatus || this.validateStatus, w.responseType = w.responseType || "unknown", !w.headers.Accept && w.responseType === "json") w.headers.Accept = "application/json";
        w.method = w.method || "GET";
        let $ = w.proxy || ((K = process === null || process === void 0 ? void 0 : process.env) === null || K === void 0 ? void 0 : K.HTTPS_PROXY) || ((Y = process === null || process === void 0 ? void 0 : process.env) === null || Y === void 0 ? void 0 : Y.https_proxy) || ((z = process === null || process === void 0 ? void 0 : process.env) === null || z === void 0 ? void 0 : z.HTTP_PROXY) || ((_ = process === null || process === void 0 ? void 0 : process.env) === null || _ === void 0 ? void 0 : _.http_proxy),
            H = t56(this, z06, "m", pa7).call(this, w.url, w.noProxy);
        if (w.agent);
        else if ($ && H) {
            let j = await t56(s56, s56, "m", Qa7).call(s56);
            if (this.agentCache.has($)) w.agent = this.agentCache.get($);
            else w.agent = new j($, {
                cert: w.cert,
                key: w.key
            }), this.agentCache.set($, w.agent)
        } else if (w.cert && w.key)
            if (this.agentCache.has(w.key)) w.agent = this.agentCache.get(w.key);
            else w.agent = new v09.Agent({
                cert: w.cert,
                key: w.key
            }), this.agentCache.set(w.key, w.agent);
        if (typeof w.errorRedactor !== "function" && w.errorRedactor !== !1) w.errorRedactor = pM1.defaultErrorRedactor;
        return w
    }, Qa7 = async function() {
        return f09(this, s56, t56(this, s56, "f", FM1) || (await Promise.resolve().then(() => G09(yR6()))).HttpsProxyAgent, "f", FM1), t56(this, s56, "f", FM1)
    };
    FM1 = {
        value: void 0
    }
})
// @from(Ln 208791, Col 4)
_I = x((_f) => {
    var C09 = _f && _f.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            var z = Object.getOwnPropertyDescriptor(q, K);
            if (!z || ("get" in z ? !q.__esModule : z.writable || z.configurable)) z = {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            };
            Object.defineProperty(A, Y, z)
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        I09 = _f && _f.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) C09(q, A, K)
        };
    Object.defineProperty(_f, "__esModule", {
        value: !0
    });
    _f.instance = _f.Gaxios = _f.GaxiosError = void 0;
    _f.request = x09;
    var sa7 = aa7();
    Object.defineProperty(_f, "Gaxios", {
        enumerable: !0,
        get: function() {
            return sa7.Gaxios
        }
    });
    var b09 = xZ8();
    Object.defineProperty(_f, "GaxiosError", {
        enumerable: !0,
        get: function() {
            return b09.GaxiosError
        }
    });
    I09(QZ8(), _f);
    _f.instance = new sa7.Gaxios;
    async function x09(A) {
        return _f.instance.request(A)
    }
})