
// @from(Ln 181684, Col 4)
I2A = R((IS, DP7) => {
    Object.defineProperty(IS, "__esModule", {
        value: !0
    });

    function uX1(A) {
        return A && typeof A === "object" && "default" in A ? A.default : A
    }
    var hS = uX1(h1("stream")),
        wP7 = uX1(h1("http")),
        Jz6 = uX1(h1("url")),
        HP7 = uX1(qP7()),
        Eo5 = uX1(h1("https")),
        d41 = uX1(h1("zlib")),
        ko5 = hS.Readable,
        SU = Symbol("buffer"),
        v2A = Symbol("type");
    class xX1 {
        constructor() {
            this[v2A] = "";
            let A = arguments[0],
                q = arguments[1],
                K = [],
                Y = 0;
            if (A) {
                let w = A,
                    H = Number(w.length);
                for (let $ = 0; $ < H; $++) {
                    let O = w[$],
                        _;
                    if (O instanceof Buffer) _ = O;
                    else if (ArrayBuffer.isView(O)) _ = Buffer.from(O.buffer, O.byteOffset, O.byteLength);
                    else if (O instanceof ArrayBuffer) _ = Buffer.from(O);
                    else if (O instanceof xX1) _ = O[SU];
                    else _ = Buffer.from(typeof O === "string" ? O : String(O));
                    Y += _.length, K.push(_)
                }
            }
            this[SU] = Buffer.concat(K);
            let z = q && q.type !== void 0 && String(q.type).toLowerCase();
            if (z && !/[^\u0020-\u007E]/.test(z)) this[v2A] = z
        }
        get size() {
            return this[SU].length
        }
        get type() {
            return this[v2A]
        }
        text() {
            return Promise.resolve(this[SU].toString())
        }
        arrayBuffer() {
            let A = this[SU],
                q = A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength);
            return Promise.resolve(q)
        }
        stream() {
            let A = new ko5;
            return A._read = function() {}, A.push(this[SU]), A.push(null), A
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
            let w = Math.max(z - Y, 0),
                $ = this[SU].slice(Y, Y + w),
                O = new xX1([], {
                    type: arguments[2]
                });
            return O[SU] = $, O
        }
    }
    Object.defineProperties(xX1.prototype, {
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
    Object.defineProperty(xX1.prototype, Symbol.toStringTag, {
        value: "Blob",
        writable: !1,
        enumerable: !1,
        configurable: !0
    });

    function kM(A, q, K) {
        if (Error.call(this, A), this.message = A, this.type = q, K) this.code = this.errno = K.code;
        Error.captureStackTrace(this, this.constructor)
    }
    kM.prototype = Object.create(Error.prototype);
    kM.prototype.constructor = kM;
    kM.prototype.name = "FetchError";
    var R2A;
    try {
        R2A = (() => {
            throw new Error("Cannot require module " + "encoding");
        })().convert
    } catch (A) {}
    var IU = Symbol("Body internals"),
        KP7 = hS.PassThrough;

    function Q0(A) {
        var q = this,
            K = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
            Y = K.size;
        let z = Y === void 0 ? 0 : Y;
        var w = K.timeout;
        let H = w === void 0 ? 0 : w;
        if (A == null) A = null;
        else if ($P7(A)) A = Buffer.from(A.toString());
        else if (uI1(A));
        else if (Buffer.isBuffer(A));
        else if (Object.prototype.toString.call(A) === "[object ArrayBuffer]") A = Buffer.from(A);
        else if (ArrayBuffer.isView(A)) A = Buffer.from(A.buffer, A.byteOffset, A.byteLength);
        else if (A instanceof hS);
        else A = Buffer.from(String(A));
        if (this[IU] = {
                body: A,
                disturbed: !1,
                error: null
            }, this.size = z, this.timeout = H, A instanceof hS) A.on("error", function($) {
            let O = $.name === "AbortError" ? $ : new kM(`Invalid response body while trying to fetch ${q.url}: ${$.message}`, "system", $);
            q[IU].error = O
        })
    }
    Q0.prototype = {
        get body() {
            return this[IU].body
        },
        get bodyUsed() {
            return this[IU].disturbed
        },
        arrayBuffer() {
            return hX1.call(this).then(function(A) {
                return A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength)
            })
        },
        blob() {
            let A = this.headers && this.headers.get("content-type") || "";
            return hX1.call(this).then(function(q) {
                return Object.assign(new xX1([], {
                    type: A.toLowerCase()
                }), {
                    [SU]: q
                })
            })
        },
        json() {
            var A = this;
            return hX1.call(this).then(function(q) {
                try {
                    return JSON.parse(q.toString())
                } catch (K) {
                    return Q0.Promise.reject(new kM(`invalid json response body at ${A.url} reason: ${K.message}`, "invalid-json"))
                }
            })
        },
        text() {
            return hX1.call(this).then(function(A) {
                return A.toString()
            })
        },
        buffer() {
            return hX1.call(this)
        },
        textConverted() {
            var A = this;
            return hX1.call(this).then(function(q) {
                return Lo5(q, A.headers)
            })
        }
    };
    Object.defineProperties(Q0.prototype, {
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
    Q0.mixIn = function(A) {
        for (let q of Object.getOwnPropertyNames(Q0.prototype))
            if (!(q in A)) {
                let K = Object.getOwnPropertyDescriptor(Q0.prototype, q);
                Object.defineProperty(A, q, K)
            }
    };

    function hX1() {
        var A = this;
        if (this[IU].disturbed) return Q0.Promise.reject(TypeError(`body used already for: ${this.url}`));
        if (this[IU].disturbed = !0, this[IU].error) return Q0.Promise.reject(this[IU].error);
        let q = this.body;
        if (q === null) return Q0.Promise.resolve(Buffer.alloc(0));
        if (uI1(q)) q = q.stream();
        if (Buffer.isBuffer(q)) return Q0.Promise.resolve(q);
        if (!(q instanceof hS)) return Q0.Promise.resolve(Buffer.alloc(0));
        let K = [],
            Y = 0,
            z = !1;
        return new Q0.Promise(function(w, H) {
            let $;
            if (A.timeout) $ = setTimeout(function() {
                z = !0, H(new kM(`Response timeout while trying to fetch ${A.url} (over ${A.timeout}ms)`, "body-timeout"))
            }, A.timeout);
            q.on("error", function(O) {
                if (O.name === "AbortError") z = !0, H(O);
                else H(new kM(`Invalid response body while trying to fetch ${A.url}: ${O.message}`, "system", O))
            }), q.on("data", function(O) {
                if (z || O === null) return;
                if (A.size && Y + O.length > A.size) {
                    z = !0, H(new kM(`content size at ${A.url} over limit: ${A.size}`, "max-size"));
                    return
                }
                Y += O.length, K.push(O)
            }), q.on("end", function() {
                if (z) return;
                clearTimeout($);
                try {
                    w(Buffer.concat(K, Y))
                } catch (O) {
                    H(new kM(`Could not create Buffer from response body for ${A.url}: ${O.message}`, "system", O))
                }
            })
        })
    }

    function Lo5(A, q) {
        if (typeof R2A !== "function") throw Error("The package `encoding` must be installed to use the textConverted() function");
        let K = q.get("content-type"),
            Y = "utf-8",
            z, w;
        if (K) z = /charset=([^;]*)/i.exec(K);
        if (w = A.slice(0, 1024).toString(), !z && w) z = /<meta.+?charset=(['"])(.+?)\1/i.exec(w);
        if (!z && w) {
            if (z = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(w), !z) {
                if (z = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(w), z) z.pop()
            }
            if (z) z = /charset=(.*)/i.exec(z.pop())
        }
        if (!z && w) z = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(w);
        if (z) {
            if (Y = z.pop(), Y === "gb2312" || Y === "gbk") Y = "gb18030"
        }
        return R2A(A, "UTF-8", Y).toString()
    }

    function $P7(A) {
        if (typeof A !== "object" || typeof A.append !== "function" || typeof A.delete !== "function" || typeof A.get !== "function" || typeof A.getAll !== "function" || typeof A.has !== "function" || typeof A.set !== "function") return !1;
        return A.constructor.name === "URLSearchParams" || Object.prototype.toString.call(A) === "[object URLSearchParams]" || typeof A.sort === "function"
    }

    function uI1(A) {
        return typeof A === "object" && typeof A.arrayBuffer === "function" && typeof A.type === "string" && typeof A.stream === "function" && typeof A.constructor === "function" && typeof A.constructor.name === "string" && /^(Blob|File)$/.test(A.constructor.name) && /^(Blob|File)$/.test(A[Symbol.toStringTag])
    }

    function OP7(A) {
        let q, K, Y = A.body;
        if (A.bodyUsed) throw Error("cannot clone body after it is used");
        if (Y instanceof hS && typeof Y.getBoundary !== "function") q = new KP7, K = new KP7, Y.pipe(q), Y.pipe(K), A[IU].body = q, Y = K;
        return Y
    }

    function _P7(A) {
        if (A === null) return null;
        else if (typeof A === "string") return "text/plain;charset=UTF-8";
        else if ($P7(A)) return "application/x-www-form-urlencoded;charset=UTF-8";
        else if (uI1(A)) return A.type || null;
        else if (Buffer.isBuffer(A)) return null;
        else if (Object.prototype.toString.call(A) === "[object ArrayBuffer]") return null;
        else if (ArrayBuffer.isView(A)) return null;
        else if (typeof A.getBoundary === "function") return `multipart/form-data;boundary=${A.getBoundary()}`;
        else if (A instanceof hS) return null;
        else return "text/plain;charset=UTF-8"
    }

    function JP7(A) {
        let q = A.body;
        if (q === null) return 0;
        else if (uI1(q)) return q.size;
        else if (Buffer.isBuffer(q)) return q.length;
        else if (q && typeof q.getLengthSync === "function") {
            if (q._lengthRetrievers && q._lengthRetrievers.length == 0 || q.hasKnownLength && q.hasKnownLength()) return q.getLengthSync();
            return null
        } else return null
    }

    function Ro5(A, q) {
        let K = q.body;
        if (K === null) A.end();
        else if (uI1(K)) K.stream().pipe(A);
        else if (Buffer.isBuffer(K)) A.write(K), A.end();
        else K.pipe(A)
    }
    Q0.Promise = global.Promise;
    var XP7 = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/,
        y2A = /[^\t\x20-\x7e\x80-\xff]/;

    function xI1(A) {
        if (A = `${A}`, XP7.test(A) || A === "") throw TypeError(`${A} is not a legal HTTP header name`)
    }

    function YP7(A) {
        if (A = `${A}`, y2A.test(A)) throw TypeError(`${A} is not a legal HTTP header value`)
    }

    function IX1(A, q) {
        q = q.toLowerCase();
        for (let K in A)
            if (K.toLowerCase() === q) return K;
        return
    }
    var MJ = Symbol("map");
    class mL {
        constructor() {
            let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
            if (this[MJ] = Object.create(null), A instanceof mL) {
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
            A = `${A}`, xI1(A);
            let q = IX1(this[MJ], A);
            if (q === void 0) return null;
            return this[MJ][q].join(", ")
        }
        forEach(A) {
            let q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0,
                K = C2A(this),
                Y = 0;
            while (Y < K.length) {
                var z = K[Y];
                let w = z[0],
                    H = z[1];
                A.call(q, H, w, this), K = C2A(this), Y++
            }
        }
        set(A, q) {
            A = `${A}`, q = `${q}`, xI1(A), YP7(q);
            let K = IX1(this[MJ], A);
            this[MJ][K !== void 0 ? K : A] = [q]
        }
        append(A, q) {
            A = `${A}`, q = `${q}`, xI1(A), YP7(q);
            let K = IX1(this[MJ], A);
            if (K !== void 0) this[MJ][K].push(q);
            else this[MJ][A] = [q]
        }
        has(A) {
            return A = `${A}`, xI1(A), IX1(this[MJ], A) !== void 0
        }
        delete(A) {
            A = `${A}`, xI1(A);
            let q = IX1(this[MJ], A);
            if (q !== void 0) delete this[MJ][q]
        }
        raw() {
            return this[MJ]
        }
        keys() {
            return E2A(this, "key")
        }
        values() {
            return E2A(this, "value")
        } [Symbol.iterator]() {
            return E2A(this, "key+value")
        }
    }
    mL.prototype.entries = mL.prototype[Symbol.iterator];
    Object.defineProperty(mL.prototype, Symbol.toStringTag, {
        value: "Headers",
        writable: !1,
        enumerable: !1,
        configurable: !0
    });
    Object.defineProperties(mL.prototype, {
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

    function C2A(A) {
        let q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
        return Object.keys(A[MJ]).sort().map(q === "key" ? function(Y) {
            return Y.toLowerCase()
        } : q === "value" ? function(Y) {
            return A[MJ][Y].join(", ")
        } : function(Y) {
            return [Y.toLowerCase(), A[MJ][Y].join(", ")]
        })
    }
    var S2A = Symbol("internal");

    function E2A(A, q) {
        let K = Object.create(h2A);
        return K[S2A] = {
            target: A,
            kind: q,
            index: 0
        }, K
    }
    var h2A = Object.setPrototypeOf({
        next() {
            if (!this || Object.getPrototypeOf(this) !== h2A) throw TypeError("Value of `this` is not a HeadersIterator");
            var A = this[S2A];
            let {
                target: q,
                kind: K,
                index: Y
            } = A, z = C2A(q, K), w = z.length;
            if (Y >= w) return {
                value: void 0,
                done: !0
            };
            return this[S2A].index = Y + 1, {
                value: z[Y],
                done: !1
            }
        }
    }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
    Object.defineProperty(h2A, Symbol.toStringTag, {
        value: "HeadersIterator",
        writable: !1,
        enumerable: !1,
        configurable: !0
    });

    function yo5(A) {
        let q = Object.assign({
                __proto__: null
            }, A[MJ]),
            K = IX1(A[MJ], "Host");
        if (K !== void 0) q[K] = q[K][0];
        return q
    }

    function Co5(A) {
        let q = new mL;
        for (let K of Object.keys(A)) {
            if (XP7.test(K)) continue;
            if (Array.isArray(A[K]))
                for (let Y of A[K]) {
                    if (y2A.test(Y)) continue;
                    if (q[MJ][K] === void 0) q[MJ][K] = [Y];
                    else q[MJ][K].push(Y)
                } else if (!y2A.test(A[K])) q[MJ][K] = [A[K]]
        }
        return q
    }
    var Mo = Symbol("Response internals"),
        So5 = wP7.STATUS_CODES;
    class BL {
        constructor() {
            let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null,
                q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            Q0.call(this, A, q);
            let K = q.status || 200,
                Y = new mL(q.headers);
            if (A != null && !Y.has("Content-Type")) {
                let z = _P7(A);
                if (z) Y.append("Content-Type", z)
            }
            this[Mo] = {
                url: q.url,
                status: K,
                statusText: q.statusText || So5[K],
                headers: Y,
                counter: q.counter
            }
        }
        get url() {
            return this[Mo].url || ""
        }
        get status() {
            return this[Mo].status
        }
        get ok() {
            return this[Mo].status >= 200 && this[Mo].status < 300
        }
        get redirected() {
            return this[Mo].counter > 0
        }
        get statusText() {
            return this[Mo].statusText
        }
        get headers() {
            return this[Mo].headers
        }
        clone() {
            return new BL(OP7(this), {
                url: this.url,
                status: this.status,
                statusText: this.statusText,
                headers: this.headers,
                ok: this.ok,
                redirected: this.redirected
            })
        }
    }
    Q0.mixIn(BL.prototype);
    Object.defineProperties(BL.prototype, {
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
    Object.defineProperty(BL.prototype, Symbol.toStringTag, {
        value: "Response",
        writable: !1,
        enumerable: !1,
        configurable: !0
    });
    var hU = Symbol("Request internals"),
        ho5 = Jz6.URL || HP7.URL,
        Io5 = Jz6.parse,
        xo5 = Jz6.format;

    function k2A(A) {
        if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.exec(A)) A = new ho5(A).toString();
        return Io5(A)
    }
    var bo5 = "destroy" in hS.Readable.prototype;

    function _z6(A) {
        return typeof A === "object" && typeof A[hU] === "object"
    }

    function uo5(A) {
        let q = A && typeof A === "object" && Object.getPrototypeOf(A);
        return !!(q && q.constructor.name === "AbortSignal")
    }
    class Wo {
        constructor(A) {
            let q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
                K;
            if (!_z6(A)) {
                if (A && A.href) K = k2A(A.href);
                else K = k2A(`${A}`);
                A = {}
            } else K = k2A(A.url);
            let Y = q.method || A.method || "GET";
            if (Y = Y.toUpperCase(), (q.body != null || _z6(A) && A.body !== null) && (Y === "GET" || Y === "HEAD")) throw TypeError("Request with GET/HEAD method cannot have body");
            let z = q.body != null ? q.body : _z6(A) && A.body !== null ? OP7(A) : null;
            Q0.call(this, z, {
                timeout: q.timeout || A.timeout || 0,
                size: q.size || A.size || 0
            });
            let w = new mL(q.headers || A.headers || {});
            if (z != null && !w.has("Content-Type")) {
                let $ = _P7(z);
                if ($) w.append("Content-Type", $)
            }
            let H = _z6(A) ? A.signal : null;
            if ("signal" in q) H = q.signal;
            if (H != null && !uo5(H)) throw TypeError("Expected signal to be an instanceof AbortSignal");
            this[hU] = {
                method: Y,
                redirect: q.redirect || A.redirect || "follow",
                headers: w,
                parsedURL: K,
                signal: H
            }, this.follow = q.follow !== void 0 ? q.follow : A.follow !== void 0 ? A.follow : 20, this.compress = q.compress !== void 0 ? q.compress : A.compress !== void 0 ? A.compress : !0, this.counter = q.counter || A.counter || 0, this.agent = q.agent || A.agent
        }
        get method() {
            return this[hU].method
        }
        get url() {
            return xo5(this[hU].parsedURL)
        }
        get headers() {
            return this[hU].headers
        }
        get redirect() {
            return this[hU].redirect
        }
        get signal() {
            return this[hU].signal
        }
        clone() {
            return new Wo(this)
        }
    }
    Q0.mixIn(Wo.prototype);
    Object.defineProperty(Wo.prototype, Symbol.toStringTag, {
        value: "Request",
        writable: !1,
        enumerable: !1,
        configurable: !0
    });
    Object.defineProperties(Wo.prototype, {
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

    function Bo5(A) {
        let q = A[hU].parsedURL,
            K = new mL(A[hU].headers);
        if (!K.has("Accept")) K.set("Accept", "*/*");
        if (!q.protocol || !q.hostname) throw TypeError("Only absolute URLs are supported");
        if (!/^https?:$/.test(q.protocol)) throw TypeError("Only HTTP(S) protocols are supported");
        if (A.signal && A.body instanceof hS.Readable && !bo5) throw Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
        let Y = null;
        if (A.body == null && /^(POST|PUT)$/i.test(A.method)) Y = "0";
        if (A.body != null) {
            let w = JP7(A);
            if (typeof w === "number") Y = String(w)
        }
        if (Y) K.set("Content-Length", Y);
        if (!K.has("User-Agent")) K.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
        if (A.compress && !K.has("Accept-Encoding")) K.set("Accept-Encoding", "gzip,deflate");
        let z = A.agent;
        if (typeof z === "function") z = z(q);
        return Object.assign({}, q, {
            method: A.method,
            headers: yo5(K),
            agent: z
        })
    }

    function bX1(A) {
        Error.call(this, A), this.type = "aborted", this.message = A, Error.captureStackTrace(this, this.constructor)
    }
    bX1.prototype = Object.create(Error.prototype);
    bX1.prototype.constructor = bX1;
    bX1.prototype.name = "AbortError";
    var bI1 = Jz6.URL || HP7.URL,
        zP7 = hS.PassThrough,
        mo5 = function(q, K) {
            let Y = new bI1(K).hostname,
                z = new bI1(q).hostname;
            return Y === z || Y[Y.length - z.length - 1] === "." && Y.endsWith(z)
        },
        Fo5 = function(q, K) {
            let Y = new bI1(K).protocol,
                z = new bI1(q).protocol;
            return Y === z
        };

    function Po(A, q) {
        if (!Po.Promise) throw Error("native promise missing, set fetch.Promise to your favorite alternative");
        return Q0.Promise = Po.Promise, new Po.Promise(function(K, Y) {
            let z = new Wo(A, q),
                w = Bo5(z),
                H = (w.protocol === "https:" ? Eo5 : wP7).request,
                $ = z.signal,
                O = null,
                _ = function() {
                    let P = new bX1("The user aborted a request.");
                    if (Y(P), z.body && z.body instanceof hS.Readable) L2A(z.body, P);
                    if (!O || !O.body) return;
                    O.body.emit("error", P)
                };
            if ($ && $.aborted) {
                _();
                return
            }
            let J = function() {
                    _(), j()
                },
                X = H(w),
                D;
            if ($) $.addEventListener("abort", J);

            function j() {
                if (X.abort(), $) $.removeEventListener("abort", J);
                clearTimeout(D)
            }
            if (z.timeout) X.once("socket", function(M) {
                D = setTimeout(function() {
                    Y(new kM(`network timeout at: ${z.url}`, "request-timeout")), j()
                }, z.timeout)
            });
            if (X.on("error", function(M) {
                    if (Y(new kM(`request to ${z.url} failed, reason: ${M.message}`, "system", M)), O && O.body) L2A(O.body, M);
                    j()
                }), Qo5(X, function(M) {
                    if ($ && $.aborted) return;
                    if (O && O.body) L2A(O.body, M)
                }), parseInt(process.version.substring(1)) < 14) X.on("socket", function(M) {
                M.addListener("close", function(P) {
                    let W = M.listenerCount("data") > 0;
                    if (O && W && !P && !($ && $.aborted)) {
                        let G = Error("Premature close");
                        G.code = "ERR_STREAM_PREMATURE_CLOSE", O.body.emit("error", G)
                    }
                })
            });
            X.on("response", function(M) {
                clearTimeout(D);
                let P = Co5(M.headers);
                if (Po.isRedirect(M.statusCode)) {
                    let N = P.get("Location"),
                        T = null;
                    try {
                        T = N === null ? null : new bI1(N, z.url).toString()
                    } catch (k) {
                        if (z.redirect !== "manual") {
                            Y(new kM(`uri requested responds with an invalid redirect URL: ${N}`, "invalid-redirect")), j();
                            return
                        }
                    }
                    switch (z.redirect) {
                        case "error":
                            Y(new kM(`uri requested responds with a redirect, redirect mode is set to error: ${z.url}`, "no-redirect")), j();
                            return;
                        case "manual":
                            if (T !== null) try {
                                P.set("Location", T)
                            } catch (y) {
                                Y(y)
                            }
                            break;
                        case "follow":
                            if (T === null) break;
                            if (z.counter >= z.follow) {
                                Y(new kM(`maximum redirect reached at: ${z.url}`, "max-redirect")), j();
                                return
                            }
                            let k = {
                                headers: new mL(z.headers),
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
                            if (!mo5(z.url, T) || !Fo5(z.url, T))
                                for (let y of ["authorization", "www-authenticate", "cookie", "cookie2"]) k.headers.delete(y);
                            if (M.statusCode !== 303 && z.body && JP7(z) === null) {
                                Y(new kM("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), j();
                                return
                            }
                            if (M.statusCode === 303 || (M.statusCode === 301 || M.statusCode === 302) && z.method === "POST") k.method = "GET", k.body = void 0, k.headers.delete("content-length");
                            K(Po(new Wo(T, k))), j();
                            return
                    }
                }
                M.once("end", function() {
                    if ($) $.removeEventListener("abort", J)
                });
                let W = M.pipe(new zP7),
                    G = {
                        url: z.url,
                        status: M.statusCode,
                        statusText: M.statusMessage,
                        headers: P,
                        size: z.size,
                        timeout: z.timeout,
                        counter: z.counter
                    },
                    f = P.get("Content-Encoding");
                if (!z.compress || z.method === "HEAD" || f === null || M.statusCode === 204 || M.statusCode === 304) {
                    O = new BL(W, G), K(O);
                    return
                }
                let Z = {
                    flush: d41.Z_SYNC_FLUSH,
                    finishFlush: d41.Z_SYNC_FLUSH
                };
                if (f == "gzip" || f == "x-gzip") {
                    W = W.pipe(d41.createGunzip(Z)), O = new BL(W, G), K(O);
                    return
                }
                if (f == "deflate" || f == "x-deflate") {
                    let N = M.pipe(new zP7);
                    N.once("data", function(T) {
                        if ((T[0] & 15) === 8) W = W.pipe(d41.createInflate());
                        else W = W.pipe(d41.createInflateRaw());
                        O = new BL(W, G), K(O)
                    }), N.on("end", function() {
                        if (!O) O = new BL(W, G), K(O)
                    });
                    return
                }
                if (f == "br" && typeof d41.createBrotliDecompress === "function") {
                    W = W.pipe(d41.createBrotliDecompress()), O = new BL(W, G), K(O);
                    return
                }
                O = new BL(W, G), K(O)
            }), Ro5(X, z)
        })
    }

    function Qo5(A, q) {
        let K;
        A.on("socket", function(Y) {
            K = Y
        }), A.on("response", function(Y) {
            let z = Y.headers;
            if (z["transfer-encoding"] === "chunked" && !z["content-length"]) Y.once("close", function(w) {
                if (K && K.listenerCount("data") > 0 && !w) {
                    let $ = Error("Premature close");
                    $.code = "ERR_STREAM_PREMATURE_CLOSE", q($)
                }
            })
        })
    }

    function L2A(A, q) {
        if (A.destroy) A.destroy(q);
        else A.emit("error", q), A.end()
    }
    Po.isRedirect = function(A) {
        return A === 301 || A === 302 || A === 303 || A === 307 || A === 308
    };
    Po.Promise = global.Promise;
    DP7.exports = IS = Po;
    Object.defineProperty(IS, "__esModule", {
        value: !0
    });
    IS.default = IS;
    IS.Headers = mL;
    IS.Request = Wo;
    IS.Response = BL;
    IS.FetchError = kM;
    IS.AbortError = bX1
})
// @from(Ln 182613, Col 4)
MP7 = R((Pc2, jP7) => {
    var du = (A) => A !== null && typeof A === "object" && typeof A.pipe === "function";
    du.writable = (A) => du(A) && A.writable !== !1 && typeof A._write === "function" && typeof A._writableState === "object";
    du.readable = (A) => du(A) && A.readable !== !1 && typeof A._read === "function" && typeof A._readableState === "object";
    du.duplex = (A) => du.writable(A) && du.readable(A);
    du.transform = (A) => du.duplex(A) && typeof A._transform === "function";
    jP7.exports = du
})
// @from(Ln 182621, Col 4)
PP7 = R((Wc2, go5) => {
    go5.exports = {
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
// @from(Ln 182715, Col 4)
ZP7 = R((WP7) => {
    Object.defineProperty(WP7, "__esModule", {
        value: !0
    });
    WP7.pkg = void 0;
    WP7.pkg = PP7()
})
// @from(Ln 182722, Col 4)
u2A = R((FL) => {
    var Uo5 = FL && FL.__importDefault || function(A) {
            return A && A.__esModule ? A : {
                default: A
            }
        },
        fP7;
    Object.defineProperty(FL, "__esModule", {
        value: !0
    });
    FL.GaxiosError = FL.GAXIOS_ERROR_SYMBOL = void 0;
    FL.defaultErrorRedactor = NP7;
    var po5 = h1("url"),
        x2A = ZP7(),
        VP7 = Uo5(K2A());
    FL.GAXIOS_ERROR_SYMBOL = Symbol.for(`${x2A.pkg.name}-gaxios-error`);
    class b2A extends Error {
        static[(fP7 = FL.GAXIOS_ERROR_SYMBOL, Symbol.hasInstance)](A) {
            if (A && typeof A === "object" && FL.GAXIOS_ERROR_SYMBOL in A && A[FL.GAXIOS_ERROR_SYMBOL] === x2A.pkg.version) return !0;
            return Function.prototype[Symbol.hasInstance].call(b2A, A)
        }
        constructor(A, q, K, Y) {
            var z;
            super(A);
            if (this.config = q, this.response = K, this.error = Y, this[fP7] = x2A.pkg.version, this.config = (0, VP7.default)(!0, {}, q), this.response) this.response.config = (0, VP7.default)(!0, {}, this.response.config);
            if (this.response) {
                try {
                    this.response.data = do5(this.config.responseType, (z = this.response) === null || z === void 0 ? void 0 : z.data)
                } catch (w) {}
                this.status = this.response.status
            }
            if (Y && "code" in Y && Y.code) this.code = Y.code;
            if (q.errorRedactor) q.errorRedactor({
                config: this.config,
                response: this.response
            })
        }
    }
    FL.GaxiosError = b2A;

    function do5(A, q) {
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

    function NP7(A) {
        function K(w) {
            if (!w) return;
            for (let H of Object.keys(w)) {
                if (/^authentication$/i.test(H)) w[H] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
                if (/^authorization$/i.test(H)) w[H] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
                if (/secret/i.test(H)) w[H] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>."
            }
        }

        function Y(w, H) {
            if (typeof w === "object" && w !== null && typeof w[H] === "string") {
                let $ = w[H];
                if (/grant_type=/i.test($) || /assertion=/i.test($) || /secret/i.test($)) w[H] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>."
            }
        }

        function z(w) {
            if (typeof w === "object" && w !== null) {
                if ("grant_type" in w) w.grant_type = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
                if ("assertion" in w) w.assertion = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
                if ("client_secret" in w) w.client_secret = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>."
            }
        }
        if (A.config) {
            K(A.config.headers), Y(A.config, "data"), z(A.config.data), Y(A.config, "body"), z(A.config.body);
            try {
                let w = new po5.URL("", A.config.url);
                if (w.searchParams.has("token")) w.searchParams.set("token", "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.");
                if (w.searchParams.has("client_secret")) w.searchParams.set("client_secret", "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.");
                A.config.url = w.toString()
            } catch (w) {}
        }
        if (A.response) NP7({
            config: A.response.config
        }), K(A.response.headers), Y(A.response, "data"), z(A.response.data);
        return A
    }
})
// @from(Ln 182816, Col 4)
EP7 = R((vP7) => {
    Object.defineProperty(vP7, "__esModule", {
        value: !0
    });
    vP7.getRetryConfig = co5;
    async function co5(A) {
        let q = TP7(A);
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
        if (q.statusCodesToRetry = q.statusCodesToRetry || K, A.config.retryConfig = q, !await (q.shouldRetry || lo5)(A)) return {
            shouldRetry: !1,
            config: A.config
        };
        let z = io5(q);
        A.config.retryConfig.currentRetryAttempt += 1;
        let w = q.retryBackoff ? q.retryBackoff(A, z) : new Promise((H) => {
            setTimeout(H, z)
        });
        if (q.onRetryAttempt) q.onRetryAttempt(A);
        return await w, {
            shouldRetry: !0,
            config: A.config
        }
    }

    function lo5(A) {
        var q;
        let K = TP7(A);
        if (A.name === "AbortError" || ((q = A.error) === null || q === void 0 ? void 0 : q.name) === "AbortError") return !1;
        if (!K || K.retry === 0) return !1;
        if (!A.response && (K.currentRetryAttempt || 0) >= K.noResponseRetries) return !1;
        if (!A.config.method || K.httpMethodsToRetry.indexOf(A.config.method.toUpperCase()) < 0) return !1;
        if (A.response && A.response.status) {
            let Y = !1;
            for (let [z, w] of K.statusCodesToRetry) {
                let H = A.response.status;
                if (H >= z && H <= w) {
                    Y = !0;
                    break
                }
            }
            if (!Y) return !1
        }
        if (K.currentRetryAttempt = K.currentRetryAttempt || 0, K.currentRetryAttempt >= K.retry) return !1;
        return !0
    }

    function TP7(A) {
        if (A && A.config && A.config.retryConfig) return A.config.retryConfig;
        return
    }

    function io5(A) {
        var q;
        let Y = (A.currentRetryAttempt ? 0 : (q = A.retryDelay) !== null && q !== void 0 ? q : 100) + (Math.pow(A.retryDelayMultiplier, A.currentRetryAttempt) - 1) / 2 * 1000,
            z = A.totalTimeout - (Date.now() - A.timeOfFirstRequest);
        return Math.min(Y, z, A.maxRetryDelay)
    }
})
// @from(Ln 182883, Col 4)
B2A = R((kP7) => {
    Object.defineProperty(kP7, "__esModule", {
        value: !0
    });
    kP7.default = ao5;
    var ro5 = oo5(h1("crypto"));

    function oo5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var Dz6 = new Uint8Array(256),
        Xz6 = Dz6.length;

    function ao5() {
        if (Xz6 > Dz6.length - 16) ro5.default.randomFillSync(Dz6), Xz6 = 0;
        return Dz6.slice(Xz6, Xz6 += 16)
    }
})
// @from(Ln 182903, Col 4)
yP7 = R((LP7) => {
    Object.defineProperty(LP7, "__esModule", {
        value: !0
    });
    LP7.default = void 0;
    var to5 = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    LP7.default = to5
})
// @from(Ln 182911, Col 4)
BI1 = R((CP7) => {
    Object.defineProperty(CP7, "__esModule", {
        value: !0
    });
    CP7.default = void 0;
    var eo5 = Aa5(yP7());

    function Aa5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function qa5(A) {
        return typeof A === "string" && eo5.default.test(A)
    }
    var Ka5 = qa5;
    CP7.default = Ka5
})
// @from(Ln 182930, Col 4)
mI1 = R((IP7) => {
    Object.defineProperty(IP7, "__esModule", {
        value: !0
    });
    IP7.default = void 0;
    IP7.unsafeStringify = hP7;
    var Ya5 = za5(BI1());

    function za5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var LM = [];
    for (let A = 0; A < 256; ++A) LM.push((A + 256).toString(16).slice(1));

    function hP7(A, q = 0) {
        return LM[A[q + 0]] + LM[A[q + 1]] + LM[A[q + 2]] + LM[A[q + 3]] + "-" + LM[A[q + 4]] + LM[A[q + 5]] + "-" + LM[A[q + 6]] + LM[A[q + 7]] + "-" + LM[A[q + 8]] + LM[A[q + 9]] + "-" + LM[A[q + 10]] + LM[A[q + 11]] + LM[A[q + 12]] + LM[A[q + 13]] + LM[A[q + 14]] + LM[A[q + 15]]
    }

    function wa5(A, q = 0) {
        let K = hP7(A, q);
        if (!(0, Ya5.default)(K)) throw TypeError("Stringified UUID is invalid");
        return K
    }
    var Ha5 = wa5;
    IP7.default = Ha5
})
// @from(Ln 182958, Col 4)
mP7 = R((uP7) => {
    Object.defineProperty(uP7, "__esModule", {
        value: !0
    });
    uP7.default = void 0;
    var Oa5 = Ja5(B2A()),
        _a5 = mI1();

    function Ja5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var bP7, m2A, F2A = 0,
        Q2A = 0;

    function Xa5(A, q, K) {
        let Y = q && K || 0,
            z = q || Array(16);
        A = A || {};
        let w = A.node || bP7,
            H = A.clockseq !== void 0 ? A.clockseq : m2A;
        if (w == null || H == null) {
            let D = A.random || (A.rng || Oa5.default)();
            if (w == null) w = bP7 = [D[0] | 1, D[1], D[2], D[3], D[4], D[5]];
            if (H == null) H = m2A = (D[6] << 8 | D[7]) & 16383
        }
        let $ = A.msecs !== void 0 ? A.msecs : Date.now(),
            O = A.nsecs !== void 0 ? A.nsecs : Q2A + 1,
            _ = $ - F2A + (O - Q2A) / 1e4;
        if (_ < 0 && A.clockseq === void 0) H = H + 1 & 16383;
        if ((_ < 0 || $ > F2A) && A.nsecs === void 0) O = 0;
        if (O >= 1e4) throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
        F2A = $, Q2A = O, m2A = H, $ += 12219292800000;
        let J = (($ & 268435455) * 1e4 + O) % 4294967296;
        z[Y++] = J >>> 24 & 255, z[Y++] = J >>> 16 & 255, z[Y++] = J >>> 8 & 255, z[Y++] = J & 255;
        let X = $ / 4294967296 * 1e4 & 268435455;
        z[Y++] = X >>> 8 & 255, z[Y++] = X & 255, z[Y++] = X >>> 24 & 15 | 16, z[Y++] = X >>> 16 & 255, z[Y++] = H >>> 8 | 128, z[Y++] = H & 255;
        for (let D = 0; D < 6; ++D) z[Y + D] = w[D];
        return q || (0, _a5.unsafeStringify)(z)
    }
    var Da5 = Xa5;
    uP7.default = Da5
})
// @from(Ln 183002, Col 4)
g2A = R((FP7) => {
    Object.defineProperty(FP7, "__esModule", {
        value: !0
    });
    FP7.default = void 0;
    var ja5 = Ma5(BI1());

    function Ma5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function Pa5(A) {
        if (!(0, ja5.default)(A)) throw TypeError("Invalid UUID");
        let q, K = new Uint8Array(16);
        return K[0] = (q = parseInt(A.slice(0, 8), 16)) >>> 24, K[1] = q >>> 16 & 255, K[2] = q >>> 8 & 255, K[3] = q & 255, K[4] = (q = parseInt(A.slice(9, 13), 16)) >>> 8, K[5] = q & 255, K[6] = (q = parseInt(A.slice(14, 18), 16)) >>> 8, K[7] = q & 255, K[8] = (q = parseInt(A.slice(19, 23), 16)) >>> 8, K[9] = q & 255, K[10] = (q = parseInt(A.slice(24, 36), 16)) / 1099511627776 & 255, K[11] = q / 4294967296 & 255, K[12] = q >>> 24 & 255, K[13] = q >>> 16 & 255, K[14] = q >>> 8 & 255, K[15] = q & 255, K
    }
    var Wa5 = Pa5;
    FP7.default = Wa5
})
// @from(Ln 183023, Col 4)
U2A = R((pP7) => {
    Object.defineProperty(pP7, "__esModule", {
        value: !0
    });
    pP7.URL = pP7.DNS = void 0;
    pP7.default = Na5;
    var Ga5 = mI1(),
        Za5 = fa5(g2A());

    function fa5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function Va5(A) {
        A = unescape(encodeURIComponent(A));
        let q = [];
        for (let K = 0; K < A.length; ++K) q.push(A.charCodeAt(K));
        return q
    }
    var gP7 = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    pP7.DNS = gP7;
    var UP7 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
    pP7.URL = UP7;

    function Na5(A, q, K) {
        function Y(z, w, H, $) {
            var O;
            if (typeof z === "string") z = Va5(z);
            if (typeof w === "string") w = (0, Za5.default)(w);
            if (((O = w) === null || O === void 0 ? void 0 : O.length) !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
            let _ = new Uint8Array(16 + z.length);
            if (_.set(w), _.set(z, w.length), _ = K(_), _[6] = _[6] & 15 | q, _[8] = _[8] & 63 | 128, H) {
                $ = $ || 0;
                for (let J = 0; J < 16; ++J) H[$ + J] = _[J];
                return H
            }
            return (0, Ga5.unsafeStringify)(_)
        }
        try {
            Y.name = A
        } catch (z) {}
        return Y.DNS = gP7, Y.URL = UP7, Y
    }
})
// @from(Ln 183069, Col 4)
iP7 = R((cP7) => {
    Object.defineProperty(cP7, "__esModule", {
        value: !0
    });
    cP7.default = void 0;
    var Ea5 = ka5(h1("crypto"));

    function ka5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function La5(A) {
        if (Array.isArray(A)) A = Buffer.from(A);
        else if (typeof A === "string") A = Buffer.from(A, "utf8");
        return Ea5.default.createHash("md5").update(A).digest()
    }
    var Ra5 = La5;
    cP7.default = Ra5
})
// @from(Ln 183090, Col 4)
aP7 = R((rP7) => {
    Object.defineProperty(rP7, "__esModule", {
        value: !0
    });
    rP7.default = void 0;
    var ya5 = nP7(U2A()),
        Ca5 = nP7(iP7());

    function nP7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var Sa5 = (0, ya5.default)("v3", 48, Ca5.default),
        ha5 = Sa5;
    rP7.default = ha5
})
// @from(Ln 183107, Col 4)
eP7 = R((sP7) => {
    Object.defineProperty(sP7, "__esModule", {
        value: !0
    });
    sP7.default = void 0;
    var Ia5 = xa5(h1("crypto"));

    function xa5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var ba5 = {
        randomUUID: Ia5.default.randomUUID
    };
    sP7.default = ba5
})
// @from(Ln 183124, Col 4)
zW7 = R((KW7) => {
    Object.defineProperty(KW7, "__esModule", {
        value: !0
    });
    KW7.default = void 0;
    var AW7 = qW7(eP7()),
        ua5 = qW7(B2A()),
        Ba5 = mI1();

    function qW7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function ma5(A, q, K) {
        if (AW7.default.randomUUID && !q && !A) return AW7.default.randomUUID();
        A = A || {};
        let Y = A.random || (A.rng || ua5.default)();
        if (Y[6] = Y[6] & 15 | 64, Y[8] = Y[8] & 63 | 128, q) {
            K = K || 0;
            for (let z = 0; z < 16; ++z) q[K + z] = Y[z];
            return q
        }
        return (0, Ba5.unsafeStringify)(Y)
    }
    var Fa5 = ma5;
    KW7.default = Fa5
})
// @from(Ln 183153, Col 4)
$W7 = R((wW7) => {
    Object.defineProperty(wW7, "__esModule", {
        value: !0
    });
    wW7.default = void 0;
    var Qa5 = ga5(h1("crypto"));

    function ga5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function Ua5(A) {
        if (Array.isArray(A)) A = Buffer.from(A);
        else if (typeof A === "string") A = Buffer.from(A, "utf8");
        return Qa5.default.createHash("sha1").update(A).digest()
    }
    var pa5 = Ua5;
    wW7.default = pa5
})
// @from(Ln 183174, Col 4)
XW7 = R((_W7) => {
    Object.defineProperty(_W7, "__esModule", {
        value: !0
    });
    _W7.default = void 0;
    var da5 = OW7(U2A()),
        ca5 = OW7($W7());

    function OW7(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
    var la5 = (0, da5.default)("v5", 80, ca5.default),
        ia5 = la5;
    _W7.default = ia5
})
// @from(Ln 183191, Col 4)
MW7 = R((DW7) => {
    Object.defineProperty(DW7, "__esModule", {
        value: !0
    });
    DW7.default = void 0;
    var na5 = "00000000-0000-0000-0000-000000000000";
    DW7.default = na5
})
// @from(Ln 183199, Col 4)
GW7 = R((PW7) => {
    Object.defineProperty(PW7, "__esModule", {
        value: !0
    });
    PW7.default = void 0;
    var ra5 = oa5(BI1());

    function oa5(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }

    function aa5(A) {
        if (!(0, ra5.default)(A)) throw TypeError("Invalid UUID");
        return parseInt(A.slice(14, 15), 16)
    }
    var sa5 = aa5;
    PW7.default = sa5
})
// @from(Ln 183219, Col 4)
ZW7 = R((xS) => {
    Object.defineProperty(xS, "__esModule", {
        value: !0
    });
    Object.defineProperty(xS, "NIL", {
        enumerable: !0,
        get: function() {
            return Ks5.default
        }
    });
    Object.defineProperty(xS, "parse", {
        enumerable: !0,
        get: function() {
            return Hs5.default
        }
    });
    Object.defineProperty(xS, "stringify", {
        enumerable: !0,
        get: function() {
            return ws5.default
        }
    });
    Object.defineProperty(xS, "v1", {
        enumerable: !0,
        get: function() {
            return ta5.default
        }
    });
    Object.defineProperty(xS, "v3", {
        enumerable: !0,
        get: function() {
            return ea5.default
        }
    });
    Object.defineProperty(xS, "v4", {
        enumerable: !0,
        get: function() {
            return As5.default
        }
    });
    Object.defineProperty(xS, "v5", {
        enumerable: !0,
        get: function() {
            return qs5.default
        }
    });
    Object.defineProperty(xS, "validate", {
        enumerable: !0,
        get: function() {
            return zs5.default
        }
    });
    Object.defineProperty(xS, "version", {
        enumerable: !0,
        get: function() {
            return Ys5.default
        }
    });
    var ta5 = xU(mP7()),
        ea5 = xU(aP7()),
        As5 = xU(zW7()),
        qs5 = xU(XW7()),
        Ks5 = xU(MW7()),
        Ys5 = xU(GW7()),
        zs5 = xU(BI1()),
        ws5 = xU(mI1()),
        Hs5 = xU(g2A());

    function xU(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    }
})
// @from(Ln 183293, Col 4)
p2A = R((VW7) => {
    Object.defineProperty(VW7, "__esModule", {
        value: !0
    });
    VW7.GaxiosInterceptorManager = void 0;
    class fW7 extends Set {}
    VW7.GaxiosInterceptorManager = fW7
})
// @from(Ln 183301, Col 4)
IW7 = R((EW) => {
    var $s5 = EW && EW.__createBinding || (Object.create ? function(A, q, K, Y) {
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
        Os5 = EW && EW.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        _s5 = EW && EW.__importStar || function(A) {
            if (A && A.__esModule) return A;
            var q = {};
            if (A != null) {
                for (var K in A)
                    if (K !== "default" && Object.prototype.hasOwnProperty.call(A, K)) $s5(q, A, K)
            }
            return Os5(q, A), q
        },
        l41 = EW && EW.__classPrivateFieldGet || function(A, q, K, Y) {
            if (K === "a" && !Y) throw TypeError("Private accessor was defined without a getter");
            if (typeof q === "function" ? A !== q || !Y : !q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return K === "m" ? Y : K === "a" ? Y.call(A) : Y ? Y.value : q.get(A)
        },
        Js5 = EW && EW.__classPrivateFieldSet || function(A, q, K, Y, z) {
            if (Y === "m") throw TypeError("Private method is not writable");
            if (Y === "a" && !z) throw TypeError("Private accessor was defined without a setter");
            if (typeof q === "function" ? A !== q || !z : !q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
            return Y === "a" ? z.call(A, K) : z ? z.value = K : q.set(A, K), K
        },
        Pz6 = EW && EW.__importDefault || function(A) {
            return A && A.__esModule ? A : {
                default: A
            }
        },
        BX1, c41, TW7, yW7, CW7, SW7, jz6, vW7;
    Object.defineProperty(EW, "__esModule", {
        value: !0
    });
    EW.Gaxios = void 0;
    var Xs5 = Pz6(K2A()),
        Ds5 = h1("https"),
        js5 = Pz6(I2A()),
        Ms5 = Pz6(h1("querystring")),
        Ps5 = Pz6(MP7()),
        EW7 = h1("url"),
        Mz6 = u2A(),
        Ws5 = EP7(),
        kW7 = h1("stream"),
        Gs5 = ZW7(),
        LW7 = p2A(),
        Zs5 = Vs5() ? window.fetch : js5.default;

    function fs5() {
        return typeof window < "u" && !!window
    }

    function Vs5() {
        return fs5() && !!window.fetch
    }

    function Ns5() {
        return typeof Buffer < "u"
    }

    function RW7(A, q) {
        return !!hW7(A, q)
    }

    function hW7(A, q) {
        q = q.toLowerCase();
        for (let K of Object.keys((A === null || A === void 0 ? void 0 : A.headers) || {}))
            if (q === K.toLowerCase()) return A.headers[K];
        return
    }
    class d2A {
        constructor(A) {
            BX1.add(this), this.agentCache = new Map, this.defaults = A || {}, this.interceptors = {
                request: new LW7.GaxiosInterceptorManager,
                response: new LW7.GaxiosInterceptorManager
            }
        }
        async request(A = {}) {
            return A = await l41(this, BX1, "m", SW7).call(this, A), A = await l41(this, BX1, "m", yW7).call(this, A), l41(this, BX1, "m", CW7).call(this, this._request(A))
        }
        async _defaultAdapter(A) {
            let K = await (A.fetchImplementation || Zs5)(A.url, A),
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
                            (K === null || K === void 0 ? void 0 : K.data).on("data", (w) => {
                                Y += w
                            }), (K === null || K === void 0 ? void 0 : K.data).on("end", z)
                        }), K.data = Y
                    }
                    throw new Mz6.GaxiosError(`Request failed with status code ${K.status}`, A, K)
                }
                return K
            } catch (K) {
                let Y = K instanceof Mz6.GaxiosError ? K : new Mz6.GaxiosError(K.message, A, void 0, K),
                    {
                        shouldRetry: z,
                        config: w
                    } = await (0, Ws5.getRetryConfig)(Y);
                if (z && w) return Y.config.retryConfig.currentRetryAttempt = w.retryConfig.currentRetryAttempt, A.retryConfig = (q = Y.config) === null || q === void 0 ? void 0 : q.retryConfig, this._request(A);
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
            return Ms5.default.stringify(A)
        }
        translateResponse(A, q, K) {
            let Y = {};
            return q.headers.forEach((z, w) => {
                Y[w] = z
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
    EW.Gaxios = d2A;
    c41 = d2A, BX1 = new WeakSet, TW7 = function(q, K = []) {
        var Y, z;
        let w = new EW7.URL(q),
            H = [...K],
            $ = ((z = (Y = process.env.NO_PROXY) !== null && Y !== void 0 ? Y : process.env.no_proxy) === null || z === void 0 ? void 0 : z.split(",")) || [];
        for (let O of $) H.push(O.trim());
        for (let O of H)
            if (O instanceof RegExp) {
                if (O.test(w.toString())) return !1
            } else if (O instanceof EW7.URL) {
            if (O.origin === w.origin) return !1
        } else if (O.startsWith("*.") || O.startsWith(".")) {
            let _ = O.replace(/^\*\./, ".");
            if (w.hostname.endsWith(_)) return !1
        } else if (O === w.origin || O === w.hostname || O === w.href) return !1;
        return !0
    }, yW7 = async function(q) {
        let K = Promise.resolve(q);
        for (let Y of this.interceptors.request.values())
            if (Y) K = K.then(Y.resolved, Y.rejected);
        return K
    }, CW7 = async function(q) {
        let K = Promise.resolve(q);
        for (let Y of this.interceptors.response.values())
            if (Y) K = K.then(Y.resolved, Y.rejected);
        return K
    }, SW7 = async function(q) {
        var K, Y, z, w;
        let H = (0, Xs5.default)(!0, {}, this.defaults, q);
        if (!H.url) throw Error("URL is required.");
        let $ = H.baseUrl || H.baseURL;
        if ($) H.url = $.toString() + H.url;
        if (H.paramsSerializer = H.paramsSerializer || this.paramsSerializer, H.params && Object.keys(H.params).length > 0) {
            let J = H.paramsSerializer(H.params);
            if (J.startsWith("?")) J = J.slice(1);
            let X = H.url.toString().includes("?") ? "&" : "?";
            H.url = H.url + X + J
        }
        if (typeof q.maxContentLength === "number") H.size = q.maxContentLength;
        if (typeof q.maxRedirects === "number") H.follow = q.maxRedirects;
        if (H.headers = H.headers || {}, H.multipart === void 0 && H.data) {
            let J = typeof FormData > "u" ? !1 : (H === null || H === void 0 ? void 0 : H.data) instanceof FormData;
            if (Ps5.default.readable(H.data)) H.body = H.data;
            else if (Ns5() && Buffer.isBuffer(H.data)) {
                if (H.body = H.data, !RW7(H, "Content-Type")) H.headers["Content-Type"] = "application/json"
            } else if (typeof H.data === "object") {
                if (!J)
                    if (hW7(H, "content-type") === "application/x-www-form-urlencoded") H.body = H.paramsSerializer(H.data);
                    else {
                        if (!RW7(H, "Content-Type")) H.headers["Content-Type"] = "application/json";
                        H.body = JSON.stringify(H.data)
                    }
            } else H.body = H.data
        } else if (H.multipart && H.multipart.length > 0) {
            let J = (0, Gs5.v4)();
            H.headers["Content-Type"] = `multipart/related; boundary=${J}`;
            let X = new kW7.PassThrough;
            H.body = X, (0, kW7.pipeline)(this.getMultipartRequest(H.multipart, J), X, () => {})
        }
        if (H.validateStatus = H.validateStatus || this.validateStatus, H.responseType = H.responseType || "unknown", !H.headers.Accept && H.responseType === "json") H.headers.Accept = "application/json";
        H.method = H.method || "GET";
        let O = H.proxy || ((K = process === null || process === void 0 ? void 0 : process.env) === null || K === void 0 ? void 0 : K.HTTPS_PROXY) || ((Y = process === null || process === void 0 ? void 0 : process.env) === null || Y === void 0 ? void 0 : Y.https_proxy) || ((z = process === null || process === void 0 ? void 0 : process.env) === null || z === void 0 ? void 0 : z.HTTP_PROXY) || ((w = process === null || process === void 0 ? void 0 : process.env) === null || w === void 0 ? void 0 : w.http_proxy),
            _ = l41(this, BX1, "m", TW7).call(this, H.url, H.noProxy);
        if (H.agent);
        else if (O && _) {
            let J = await l41(c41, c41, "m", vW7).call(c41);
            if (this.agentCache.has(O)) H.agent = this.agentCache.get(O);
            else H.agent = new J(O, {
                cert: H.cert,
                key: H.key
            }), this.agentCache.set(O, H.agent)
        } else if (H.cert && H.key)
            if (this.agentCache.has(H.key)) H.agent = this.agentCache.get(H.key);
            else H.agent = new Ds5.Agent({
                cert: H.cert,
                key: H.key
            }), this.agentCache.set(H.key, H.agent);
        if (typeof H.errorRedactor !== "function" && H.errorRedactor !== !1) H.errorRedactor = Mz6.defaultErrorRedactor;
        return H
    }, vW7 = async function() {
        return Js5(this, c41, l41(this, c41, "f", jz6) || (await Promise.resolve().then(() => _s5(Dk1()))).HttpsProxyAgent, "f", jz6), l41(this, c41, "f", jz6)
    };
    jz6 = {
        value: void 0
    }
})
// @from(Ln 183588, Col 4)
bS = R((zZ) => {
    var Ts5 = zZ && zZ.__createBinding || (Object.create ? function(A, q, K, Y) {
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
        vs5 = zZ && zZ.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) Ts5(q, A, K)
        };
    Object.defineProperty(zZ, "__esModule", {
        value: !0
    });
    zZ.instance = zZ.Gaxios = zZ.GaxiosError = void 0;
    zZ.request = ks5;
    var xW7 = IW7();
    Object.defineProperty(zZ, "Gaxios", {
        enumerable: !0,
        get: function() {
            return xW7.Gaxios
        }
    });
    var Es5 = u2A();
    Object.defineProperty(zZ, "GaxiosError", {
        enumerable: !0,
        get: function() {
            return Es5.GaxiosError
        }
    });
    vs5(p2A(), zZ);
    zZ.instance = new xW7.Gaxios;
    async function ks5(A) {
        return zZ.instance.request(A)
    }
})