
// @from(Ln 148090, Col 4)
zmq = p((yB, _mq) => {
    Object.defineProperty(yB, "__esModule", {
        value: !0
    });

    function aV6(q) {
        return q && typeof q === "object" && "default" in q ? q.default : q
    }
    var EB = aV6(d6("stream")),
        ouq = aV6(d6("http")),
        pT8 = aV6(d6("url")),
        auq = aV6(luq()),
        l3_ = aV6(d6("https")),
        V26 = aV6(d6("zlib")),
        n3_ = EB.Readable,
        to = Symbol("buffer"),
        RL1 = Symbol("type");
    class rV6 {
        constructor() {
            this[RL1] = "";
            let q = arguments[0],
                K = arguments[1],
                _ = [],
                z = 0;
            if (q) {
                let A = q,
                    O = Number(A.length);
                for (let w = 0; w < O; w++) {
                    let $ = A[w],
                        j;
                    if ($ instanceof Buffer) j = $;
                    else if (ArrayBuffer.isView($)) j = Buffer.from($.buffer, $.byteOffset, $.byteLength);
                    else if ($ instanceof ArrayBuffer) j = Buffer.from($);
                    else if ($ instanceof rV6) j = $[to];
                    else j = Buffer.from(typeof $ === "string" ? $ : String($));
                    z += j.length, _.push(j)
                }
            }
            this[to] = Buffer.concat(_);
            let Y = K && K.type !== void 0 && String(K.type).toLowerCase();
            if (Y && !/[^\u0020-\u007E]/.test(Y)) this[RL1] = Y
        }
        get size() {
            return this[to].length
        }
        get type() {
            return this[RL1]
        }
        text() {
            return Promise.resolve(this[to].toString())
        }
        arrayBuffer() {
            let q = this[to],
                K = q.buffer.slice(q.byteOffset, q.byteOffset + q.byteLength);
            return Promise.resolve(K)
        }
        stream() {
            let q = new n3_;
            return q._read = function() {}, q.push(this[to]), q.push(null), q
        }
        toString() {
            return "[object Blob]"
        }
        slice() {
            let q = this.size,
                K = arguments[0],
                _ = arguments[1],
                z, Y;
            if (K === void 0) z = 0;
            else if (K < 0) z = Math.max(q + K, 0);
            else z = Math.min(K, q);
            if (_ === void 0) Y = q;
            else if (_ < 0) Y = Math.max(q + _, 0);
            else Y = Math.min(_, q);
            let A = Math.max(Y - z, 0),
                w = this[to].slice(z, z + A),
                $ = new rV6([], {
                    type: arguments[2]
                });
            return $[to] = w, $
        }
    }
    Object.defineProperties(rV6.prototype, {
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
    Object.defineProperty(rV6.prototype, Symbol.toStringTag, {
        value: "Blob",
        writable: !1,
        enumerable: !1,
        configurable: !0
    });

    function Pf(q, K, _) {
        if (Error.call(this, q), this.message = q, this.type = K, _) this.code = this.errno = _.code;
        Error.captureStackTrace(this, this.constructor)
    }
    Pf.prototype = Object.create(Error.prototype);
    Pf.prototype.constructor = Pf;
    Pf.prototype.name = "FetchError";
    var IL1;
    try {
        IL1 = (() => {
            throw new Error("Cannot require module " + "encoding");
        })().convert
    } catch (q) {}
    var qa = Symbol("Body internals"),
        nuq = EB.PassThrough;

    function HD(q) {
        var K = this,
            _ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
            z = _.size;
        let Y = z === void 0 ? 0 : z;
        var A = _.timeout;
        let O = A === void 0 ? 0 : A;
        if (q == null) q = null;
        else if (suq(q)) q = Buffer.from(q.toString());
        else if (sr6(q));
        else if (Buffer.isBuffer(q));
        else if (Object.prototype.toString.call(q) === "[object ArrayBuffer]") q = Buffer.from(q);
        else if (ArrayBuffer.isView(q)) q = Buffer.from(q.buffer, q.byteOffset, q.byteLength);
        else if (q instanceof EB);
        else q = Buffer.from(String(q));
        if (this[qa] = {
                body: q,
                disturbed: !1,
                error: null
            }, this.size = Y, this.timeout = O, q instanceof EB) q.on("error", function(w) {
            let $ = w.name === "AbortError" ? w : new Pf(`Invalid response body while trying to fetch ${K.url}: ${w.message}`, "system", w);
            K[qa].error = $
        })
    }
    HD.prototype = {
        get body() {
            return this[qa].body
        },
        get bodyUsed() {
            return this[qa].disturbed
        },
        arrayBuffer() {
            return nV6.call(this).then(function(q) {
                return q.buffer.slice(q.byteOffset, q.byteOffset + q.byteLength)
            })
        },
        blob() {
            let q = this.headers && this.headers.get("content-type") || "";
            return nV6.call(this).then(function(K) {
                return Object.assign(new rV6([], {
                    type: q.toLowerCase()
                }), {
                    [to]: K
                })
            })
        },
        json() {
            var q = this;
            return nV6.call(this).then(function(K) {
                try {
                    return JSON.parse(K.toString())
                } catch (_) {
                    return HD.Promise.reject(new Pf(`invalid json response body at ${q.url} reason: ${_.message}`, "invalid-json"))
                }
            })
        },
        text() {
            return nV6.call(this).then(function(q) {
                return q.toString()
            })
        },
        buffer() {
            return nV6.call(this)
        },
        textConverted() {
            var q = this;
            return nV6.call(this).then(function(K) {
                return i3_(K, q.headers)
            })
        }
    };
    Object.defineProperties(HD.prototype, {
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
    HD.mixIn = function(q) {
        for (let K of Object.getOwnPropertyNames(HD.prototype))
            if (!(K in q)) {
                let _ = Object.getOwnPropertyDescriptor(HD.prototype, K);
                Object.defineProperty(q, K, _)
            }
    };

    function nV6() {
        var q = this;
        if (this[qa].disturbed) return HD.Promise.reject(TypeError(`body used already for: ${this.url}`));
        if (this[qa].disturbed = !0, this[qa].error) return HD.Promise.reject(this[qa].error);
        let K = this.body;
        if (K === null) return HD.Promise.resolve(Buffer.alloc(0));
        if (sr6(K)) K = K.stream();
        if (Buffer.isBuffer(K)) return HD.Promise.resolve(K);
        if (!(K instanceof EB)) return HD.Promise.resolve(Buffer.alloc(0));
        let _ = [],
            z = 0,
            Y = !1;
        return new HD.Promise(function(A, O) {
            let w;
            if (q.timeout) w = setTimeout(function() {
                Y = !0, O(new Pf(`Response timeout while trying to fetch ${q.url} (over ${q.timeout}ms)`, "body-timeout"))
            }, q.timeout);
            K.on("error", function($) {
                if ($.name === "AbortError") Y = !0, O($);
                else O(new Pf(`Invalid response body while trying to fetch ${q.url}: ${$.message}`, "system", $))
            }), K.on("data", function($) {
                if (Y || $ === null) return;
                if (q.size && z + $.length > q.size) {
                    Y = !0, O(new Pf(`content size at ${q.url} over limit: ${q.size}`, "max-size"));
                    return
                }
                z += $.length, _.push($)
            }), K.on("end", function() {
                if (Y) return;
                clearTimeout(w);
                try {
                    A(Buffer.concat(_, z))
                } catch ($) {
                    O(new Pf(`Could not create Buffer from response body for ${q.url}: ${$.message}`, "system", $))
                }
            })
        })
    }

    function i3_(q, K) {
        if (typeof IL1 !== "function") throw Error("The package `encoding` must be installed to use the textConverted() function");
        let _ = K.get("content-type"),
            z = "utf-8",
            Y, A;
        if (_) Y = /charset=([^;]*)/i.exec(_);
        if (A = q.slice(0, 1024).toString(), !Y && A) Y = /<meta.+?charset=(['"])(.+?)\1/i.exec(A);
        if (!Y && A) {
            if (Y = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(A), !Y) {
                if (Y = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(A), Y) Y.pop()
            }
            if (Y) Y = /charset=(.*)/i.exec(Y.pop())
        }
        if (!Y && A) Y = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(A);
        if (Y) {
            if (z = Y.pop(), z === "gb2312" || z === "gbk") z = "gb18030"
        }
        return IL1(q, "UTF-8", z).toString()
    }

    function suq(q) {
        if (typeof q !== "object" || typeof q.append !== "function" || typeof q.delete !== "function" || typeof q.get !== "function" || typeof q.getAll !== "function" || typeof q.has !== "function" || typeof q.set !== "function") return !1;
        return q.constructor.name === "URLSearchParams" || Object.prototype.toString.call(q) === "[object URLSearchParams]" || typeof q.sort === "function"
    }

    function sr6(q) {
        return typeof q === "object" && typeof q.arrayBuffer === "function" && typeof q.type === "string" && typeof q.stream === "function" && typeof q.constructor === "function" && typeof q.constructor.name === "string" && /^(Blob|File)$/.test(q.constructor.name) && /^(Blob|File)$/.test(q[Symbol.toStringTag])
    }

    function tuq(q) {
        let K, _, z = q.body;
        if (q.bodyUsed) throw Error("cannot clone body after it is used");
        if (z instanceof EB && typeof z.getBoundary !== "function") K = new nuq, _ = new nuq, z.pipe(K), z.pipe(_), q[qa].body = K, z = _;
        return z
    }

    function euq(q) {
        if (q === null) return null;
        else if (typeof q === "string") return "text/plain;charset=UTF-8";
        else if (suq(q)) return "application/x-www-form-urlencoded;charset=UTF-8";
        else if (sr6(q)) return q.type || null;
        else if (Buffer.isBuffer(q)) return null;
        else if (Object.prototype.toString.call(q) === "[object ArrayBuffer]") return null;
        else if (ArrayBuffer.isView(q)) return null;
        else if (typeof q.getBoundary === "function") return `multipart/form-data;boundary=${q.getBoundary()}`;
        else if (q instanceof EB) return null;
        else return "text/plain;charset=UTF-8"
    }

    function qmq(q) {
        let K = q.body;
        if (K === null) return 0;
        else if (sr6(K)) return K.size;
        else if (Buffer.isBuffer(K)) return K.length;
        else if (K && typeof K.getLengthSync === "function") {
            if (K._lengthRetrievers && K._lengthRetrievers.length == 0 || K.hasKnownLength && K.hasKnownLength()) return K.getLengthSync();
            return null
        } else return null
    }

    function r3_(q, K) {
        let _ = K.body;
        if (_ === null) q.end();
        else if (sr6(_)) _.stream().pipe(q);
        else if (Buffer.isBuffer(_)) q.write(_), q.end();
        else _.pipe(q)
    }
    HD.Promise = global.Promise;
    var Kmq = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/,
        xL1 = /[^\t\x20-\x7e\x80-\xff]/;

    function or6(q) {
        if (q = `${q}`, Kmq.test(q) || q === "") throw TypeError(`${q} is not a legal HTTP header name`)
    }

    function iuq(q) {
        if (q = `${q}`, xL1.test(q)) throw TypeError(`${q} is not a legal HTTP header value`)
    }

    function iV6(q, K) {
        K = K.toLowerCase();
        for (let _ in q)
            if (_.toLowerCase() === K) return _;
        return
    }
    var HM = Symbol("map");
    class _I {
        constructor() {
            let q = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
            if (this[HM] = Object.create(null), q instanceof _I) {
                let K = q.raw(),
                    _ = Object.keys(K);
                for (let z of _)
                    for (let Y of K[z]) this.append(z, Y);
                return
            }
            if (q == null);
            else if (typeof q === "object") {
                let K = q[Symbol.iterator];
                if (K != null) {
                    if (typeof K !== "function") throw TypeError("Header pairs must be iterable");
                    let _ = [];
                    for (let z of q) {
                        if (typeof z !== "object" || typeof z[Symbol.iterator] !== "function") throw TypeError("Each header pair must be iterable");
                        _.push(Array.from(z))
                    }
                    for (let z of _) {
                        if (z.length !== 2) throw TypeError("Each header pair must be a name/value tuple");
                        this.append(z[0], z[1])
                    }
                } else
                    for (let _ of Object.keys(q)) {
                        let z = q[_];
                        this.append(_, z)
                    }
            } else throw TypeError("Provided initializer must be an object")
        }
        get(q) {
            q = `${q}`, or6(q);
            let K = iV6(this[HM], q);
            if (K === void 0) return null;
            return this[HM][K].join(", ")
        }
        forEach(q) {
            let K = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0,
                _ = uL1(this),
                z = 0;
            while (z < _.length) {
                var Y = _[z];
                let A = Y[0],
                    O = Y[1];
                q.call(K, O, A, this), _ = uL1(this), z++
            }
        }
        set(q, K) {
            q = `${q}`, K = `${K}`, or6(q), iuq(K);
            let _ = iV6(this[HM], q);
            this[HM][_ !== void 0 ? _ : q] = [K]
        }
        append(q, K) {
            q = `${q}`, K = `${K}`, or6(q), iuq(K);
            let _ = iV6(this[HM], q);
            if (_ !== void 0) this[HM][_].push(K);
            else this[HM][q] = [K]
        }
        has(q) {
            return q = `${q}`, or6(q), iV6(this[HM], q) !== void 0
        }
        delete(q) {
            q = `${q}`, or6(q);
            let K = iV6(this[HM], q);
            if (K !== void 0) delete this[HM][K]
        }
        raw() {
            return this[HM]
        }
        keys() {
            return SL1(this, "key")
        }
        values() {
            return SL1(this, "value")
        } [Symbol.iterator]() {
            return SL1(this, "key+value")
        }
    }
    _I.prototype.entries = _I.prototype[Symbol.iterator];
    Object.defineProperty(_I.prototype, Symbol.toStringTag, {
        value: "Headers",
        writable: !1,
        enumerable: !1,
        configurable: !0
    });
    Object.defineProperties(_I.prototype, {
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

    function uL1(q) {
        let K = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
        return Object.keys(q[HM]).sort().map(K === "key" ? function(z) {
            return z.toLowerCase()
        } : K === "value" ? function(z) {
            return q[HM][z].join(", ")
        } : function(z) {
            return [z.toLowerCase(), q[HM][z].join(", ")]
        })
    }
    var mL1 = Symbol("internal");

    function SL1(q, K) {
        let _ = Object.create(BL1);
        return _[mL1] = {
            target: q,
            kind: K,
            index: 0
        }, _
    }
    var BL1 = Object.setPrototypeOf({
        next() {
            if (!this || Object.getPrototypeOf(this) !== BL1) throw TypeError("Value of `this` is not a HeadersIterator");
            var q = this[mL1];
            let {
                target: K,
                kind: _,
                index: z
            } = q, Y = uL1(K, _), A = Y.length;
            if (z >= A) return {
                value: void 0,
                done: !0
            };
            return this[mL1].index = z + 1, {
                value: Y[z],
                done: !1
            }
        }
    }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
    Object.defineProperty(BL1, Symbol.toStringTag, {
        value: "HeadersIterator",
        writable: !1,
        enumerable: !1,
        configurable: !0
    });

    function o3_(q) {
        let K = Object.assign({
                __proto__: null
            }, q[HM]),
            _ = iV6(q[HM], "Host");
        if (_ !== void 0) K[_] = K[_][0];
        return K
    }

    function a3_(q) {
        let K = new _I;
        for (let _ of Object.keys(q)) {
            if (Kmq.test(_)) continue;
            if (Array.isArray(q[_]))
                for (let z of q[_]) {
                    if (xL1.test(z)) continue;
                    if (K[HM][_] === void 0) K[HM][_] = [z];
                    else K[HM][_].push(z)
                } else if (!xL1.test(q[_])) K[HM][_] = [q[_]]
        }
        return K
    }
    var dq6 = Symbol("Response internals"),
        s3_ = ouq.STATUS_CODES;
    class KI {
        constructor() {
            let q = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null,
                K = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            HD.call(this, q, K);
            let _ = K.status || 200,
                z = new _I(K.headers);
            if (q != null && !z.has("Content-Type")) {
                let Y = euq(q);
                if (Y) z.append("Content-Type", Y)
            }
            this[dq6] = {
                url: K.url,
                status: _,
                statusText: K.statusText || s3_[_],
                headers: z,
                counter: K.counter
            }
        }
        get url() {
            return this[dq6].url || ""
        }
        get status() {
            return this[dq6].status
        }
        get ok() {
            return this[dq6].status >= 200 && this[dq6].status < 300
        }
        get redirected() {
            return this[dq6].counter > 0
        }
        get statusText() {
            return this[dq6].statusText
        }
        get headers() {
            return this[dq6].headers
        }
        clone() {
            return new KI(tuq(this), {
                url: this.url,
                status: this.status,
                statusText: this.statusText,
                headers: this.headers,
                ok: this.ok,
                redirected: this.redirected
            })
        }
    }
    HD.mixIn(KI.prototype);
    Object.defineProperties(KI.prototype, {
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
    Object.defineProperty(KI.prototype, Symbol.toStringTag, {
        value: "Response",
        writable: !1,
        enumerable: !1,
        configurable: !0
    });
    var eo = Symbol("Request internals"),
        t3_ = pT8.URL || auq.URL,
        e3_ = pT8.parse,
        q9_ = pT8.format;

    function CL1(q) {
        if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.exec(q)) q = new t3_(q).toString();
        return e3_(q)
    }
    var K9_ = "destroy" in EB.Readable.prototype;

    function BT8(q) {
        return typeof q === "object" && typeof q[eo] === "object"
    }

    function _9_(q) {
        let K = q && typeof q === "object" && Object.getPrototypeOf(q);
        return !!(K && K.constructor.name === "AbortSignal")
    }
    class lq6 {
        constructor(q) {
            let K = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
                _;
            if (!BT8(q)) {
                if (q && q.href) _ = CL1(q.href);
                else _ = CL1(`${q}`);
                q = {}
            } else _ = CL1(q.url);
            let z = K.method || q.method || "GET";
            if (z = z.toUpperCase(), (K.body != null || BT8(q) && q.body !== null) && (z === "GET" || z === "HEAD")) throw TypeError("Request with GET/HEAD method cannot have body");
            let Y = K.body != null ? K.body : BT8(q) && q.body !== null ? tuq(q) : null;
            HD.call(this, Y, {
                timeout: K.timeout || q.timeout || 0,
                size: K.size || q.size || 0
            });
            let A = new _I(K.headers || q.headers || {});
            if (Y != null && !A.has("Content-Type")) {
                let w = euq(Y);
                if (w) A.append("Content-Type", w)
            }
            let O = BT8(q) ? q.signal : null;
            if ("signal" in K) O = K.signal;
            if (O != null && !_9_(O)) throw TypeError("Expected signal to be an instanceof AbortSignal");
            this[eo] = {
                method: z,
                redirect: K.redirect || q.redirect || "follow",
                headers: A,
                parsedURL: _,
                signal: O
            }, this.follow = K.follow !== void 0 ? K.follow : q.follow !== void 0 ? q.follow : 20, this.compress = K.compress !== void 0 ? K.compress : q.compress !== void 0 ? q.compress : !0, this.counter = K.counter || q.counter || 0, this.agent = K.agent || q.agent
        }
        get method() {
            return this[eo].method
        }
        get url() {
            return q9_(this[eo].parsedURL)
        }
        get headers() {
            return this[eo].headers
        }
        get redirect() {
            return this[eo].redirect
        }
        get signal() {
            return this[eo].signal
        }
        clone() {
            return new lq6(this)
        }
    }
    HD.mixIn(lq6.prototype);
    Object.defineProperty(lq6.prototype, Symbol.toStringTag, {
        value: "Request",
        writable: !1,
        enumerable: !1,
        configurable: !0
    });
    Object.defineProperties(lq6.prototype, {
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

    function z9_(q) {
        let K = q[eo].parsedURL,
            _ = new _I(q[eo].headers);
        if (!_.has("Accept")) _.set("Accept", "*/*");
        if (!K.protocol || !K.hostname) throw TypeError("Only absolute URLs are supported");
        if (!/^https?:$/.test(K.protocol)) throw TypeError("Only HTTP(S) protocols are supported");
        if (q.signal && q.body instanceof EB.Readable && !K9_) throw Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
        let z = null;
        if (q.body == null && /^(POST|PUT)$/i.test(q.method)) z = "0";
        if (q.body != null) {
            let A = qmq(q);
            if (typeof A === "number") z = String(A)
        }
        if (z) _.set("Content-Length", z);
        if (!_.has("User-Agent")) _.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
        if (q.compress && !_.has("Accept-Encoding")) _.set("Accept-Encoding", "gzip,deflate");
        let Y = q.agent;
        if (typeof Y === "function") Y = Y(K);
        return Object.assign({}, K, {
            method: q.method,
            headers: o3_(_),
            agent: Y
        })
    }

    function oV6(q) {
        Error.call(this, q), this.type = "aborted", this.message = q, Error.captureStackTrace(this, this.constructor)
    }
    oV6.prototype = Object.create(Error.prototype);
    oV6.prototype.constructor = oV6;
    oV6.prototype.name = "AbortError";
    var ar6 = pT8.URL || auq.URL,
        ruq = EB.PassThrough,
        Y9_ = function(K, _) {
            let z = new ar6(_).hostname,
                Y = new ar6(K).hostname;
            return z === Y || z[z.length - Y.length - 1] === "." && z.endsWith(Y)
        },
        A9_ = function(K, _) {
            let z = new ar6(_).protocol,
                Y = new ar6(K).protocol;
            return z === Y
        };

    function cq6(q, K) {
        if (!cq6.Promise) throw Error("native promise missing, set fetch.Promise to your favorite alternative");
        return HD.Promise = cq6.Promise, new cq6.Promise(function(_, z) {
            let Y = new lq6(q, K),
                A = z9_(Y),
                O = (A.protocol === "https:" ? l3_ : ouq).request,
                w = Y.signal,
                $ = null,
                j = function() {
                    let W = new oV6("The user aborted a request.");
                    if (z(W), Y.body && Y.body instanceof EB.Readable) bL1(Y.body, W);
                    if (!$ || !$.body) return;
                    $.body.emit("error", W)
                };
            if (w && w.aborted) {
                j();
                return
            }
            let H = function() {
                    j(), M()
                },
                J = O(A),
                X;
            if (w) w.addEventListener("abort", H);

            function M() {
                if (J.abort(), w) w.removeEventListener("abort", H);
                clearTimeout(X)
            }
            if (Y.timeout) J.once("socket", function(P) {
                X = setTimeout(function() {
                    z(new Pf(`network timeout at: ${Y.url}`, "request-timeout")), M()
                }, Y.timeout)
            });
            if (J.on("error", function(P) {
                    if (z(new Pf(`request to ${Y.url} failed, reason: ${P.message}`, "system", P)), $ && $.body) bL1($.body, P);
                    M()
                }), O9_(J, function(P) {
                    if (w && w.aborted) return;
                    if ($ && $.body) bL1($.body, P)
                }), parseInt(process.version.substring(1)) < 14) J.on("socket", function(P) {
                P.addListener("close", function(W) {
                    let D = P.listenerCount("data") > 0;
                    if ($ && D && !W && !(w && w.aborted)) {
                        let Z = Error("Premature close");
                        Z.code = "ERR_STREAM_PREMATURE_CLOSE", $.body.emit("error", Z)
                    }
                })
            });
            J.on("response", function(P) {
                clearTimeout(X);
                let W = a3_(P.headers);
                if (cq6.isRedirect(P.statusCode)) {
                    let v = W.get("Location"),
                        V = null;
                    try {
                        V = v === null ? null : new ar6(v, Y.url).toString()
                    } catch (k) {
                        if (Y.redirect !== "manual") {
                            z(new Pf(`uri requested responds with an invalid redirect URL: ${v}`, "invalid-redirect")), M();
                            return
                        }
                    }
                    switch (Y.redirect) {
                        case "error":
                            z(new Pf(`uri requested responds with a redirect, redirect mode is set to error: ${Y.url}`, "no-redirect")), M();
                            return;
                        case "manual":
                            if (V !== null) try {
                                W.set("Location", V)
                            } catch (N) {
                                z(N)
                            }
                            break;
                        case "follow":
                            if (V === null) break;
                            if (Y.counter >= Y.follow) {
                                z(new Pf(`maximum redirect reached at: ${Y.url}`, "max-redirect")), M();
                                return
                            }
                            let k = {
                                headers: new _I(Y.headers),
                                follow: Y.follow,
                                counter: Y.counter + 1,
                                agent: Y.agent,
                                compress: Y.compress,
                                method: Y.method,
                                body: Y.body,
                                signal: Y.signal,
                                timeout: Y.timeout,
                                size: Y.size
                            };
                            if (!Y9_(Y.url, V) || !A9_(Y.url, V))
                                for (let N of ["authorization", "www-authenticate", "cookie", "cookie2"]) k.headers.delete(N);
                            if (P.statusCode !== 303 && Y.body && qmq(Y) === null) {
                                z(new Pf("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), M();
                                return
                            }
                            if (P.statusCode === 303 || (P.statusCode === 301 || P.statusCode === 302) && Y.method === "POST") k.method = "GET", k.body = void 0, k.headers.delete("content-length");
                            _(cq6(new lq6(V, k))), M();
                            return
                    }
                }
                P.once("end", function() {
                    if (w) w.removeEventListener("abort", H)
                });
                let D = P.pipe(new ruq),
                    Z = {
                        url: Y.url,
                        status: P.statusCode,
                        statusText: P.statusMessage,
                        headers: W,
                        size: Y.size,
                        timeout: Y.timeout,
                        counter: Y.counter
                    },
                    G = W.get("Content-Encoding");
                if (!Y.compress || Y.method === "HEAD" || G === null || P.statusCode === 204 || P.statusCode === 304) {
                    $ = new KI(D, Z), _($);
                    return
                }
                let f = {
                    flush: V26.Z_SYNC_FLUSH,
                    finishFlush: V26.Z_SYNC_FLUSH
                };
                if (G == "gzip" || G == "x-gzip") {
                    D = D.pipe(V26.createGunzip(f)), $ = new KI(D, Z), _($);
                    return
                }
                if (G == "deflate" || G == "x-deflate") {
                    let v = P.pipe(new ruq);
                    v.once("data", function(V) {
                        if ((V[0] & 15) === 8) D = D.pipe(V26.createInflate());
                        else D = D.pipe(V26.createInflateRaw());
                        $ = new KI(D, Z), _($)
                    }), v.on("end", function() {
                        if (!$) $ = new KI(D, Z), _($)
                    });
                    return
                }
                if (G == "br" && typeof V26.createBrotliDecompress === "function") {
                    D = D.pipe(V26.createBrotliDecompress()), $ = new KI(D, Z), _($);
                    return
                }
                $ = new KI(D, Z), _($)
            }), r3_(J, Y)
        })
    }

    function O9_(q, K) {
        let _;
        q.on("socket", function(z) {
            _ = z
        }), q.on("response", function(z) {
            let Y = z.headers;
            if (Y["transfer-encoding"] === "chunked" && !Y["content-length"]) z.once("close", function(A) {
                if (_ && _.listenerCount("data") > 0 && !A) {
                    let w = Error("Premature close");
                    w.code = "ERR_STREAM_PREMATURE_CLOSE", K(w)
                }
            })
        })
    }

    function bL1(q, K) {
        if (q.destroy) q.destroy(K);
        else q.emit("error", K), q.end()
    }
    cq6.isRedirect = function(q) {
        return q === 301 || q === 302 || q === 303 || q === 307 || q === 308
    };
    cq6.Promise = global.Promise;
    _mq.exports = yB = cq6;
    Object.defineProperty(yB, "__esModule", {
        value: !0
    });
    yB.default = yB;
    yB.Headers = _I;
    yB.Request = lq6;
    yB.Response = KI;
    yB.FetchError = Pf;
    yB.AbortError = oV6
})
// @from(Ln 149019, Col 4)
Amq = p((SFO, Ymq) => {
    var iQ = (q) => q !== null && typeof q === "object" && typeof q.pipe === "function";
    iQ.writable = (q) => iQ(q) && q.writable !== !1 && typeof q._write === "function" && typeof q._writableState === "object";
    iQ.readable = (q) => iQ(q) && q.readable !== !1 && typeof q._read === "function" && typeof q._readableState === "object";
    iQ.duplex = (q) => iQ.writable(q) && iQ.readable(q);
    iQ.transform = (q) => iQ.duplex(q) && typeof q._transform === "function";
    Ymq.exports = iQ
})
// @from(Ln 149027, Col 4)
Omq = p((CFO, w9_) => {
    w9_.exports = {
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
// @from(Ln 149121, Col 4)
jmq = p((wmq) => {
    Object.defineProperty(wmq, "__esModule", {
        value: !0
    });
    wmq.pkg = void 0;
    wmq.pkg = Omq()
})
// @from(Ln 149128, Col 4)
gL1 = p((zI) => {
    var $9_ = zI && zI.__importDefault || function(q) {
            return q && q.__esModule ? q : {
                default: q
            }
        },
        Hmq;
    Object.defineProperty(zI, "__esModule", {
        value: !0
    });
    zI.GaxiosError = zI.GAXIOS_ERROR_SYMBOL = void 0;
    zI.defaultErrorRedactor = Xmq;
    var j9_ = d6("url"),
        pL1 = jmq(),
        Jmq = $9_($L1());
    zI.GAXIOS_ERROR_SYMBOL = Symbol.for(`${pL1.pkg.name}-gaxios-error`);
    class FL1 extends Error {
        static[(Hmq = zI.GAXIOS_ERROR_SYMBOL, Symbol.hasInstance)](q) {
            if (q && typeof q === "object" && zI.GAXIOS_ERROR_SYMBOL in q && q[zI.GAXIOS_ERROR_SYMBOL] === pL1.pkg.version) return !0;
            return Function.prototype[Symbol.hasInstance].call(FL1, q)
        }
        constructor(q, K, _, z) {
            var Y;
            super(q);
            if (this.config = K, this.response = _, this.error = z, this[Hmq] = pL1.pkg.version, this.config = (0, Jmq.default)(!0, {}, K), this.response) this.response.config = (0, Jmq.default)(!0, {}, this.response.config);
            if (this.response) {
                try {
                    this.response.data = H9_(this.config.responseType, (Y = this.response) === null || Y === void 0 ? void 0 : Y.data)
                } catch (A) {}
                this.status = this.response.status
            }
            if (z && "code" in z && z.code) this.code = z.code;
            if (K.errorRedactor) K.errorRedactor({
                config: this.config,
                response: this.response
            })
        }
    }
    zI.GaxiosError = FL1;

    function H9_(q, K) {
        switch (q) {
            case "stream":
                return K;
            case "json":
                return JSON.parse(JSON.stringify(K));
            case "arraybuffer":
                return JSON.parse(Buffer.from(K).toString("utf8"));
            case "blob":
                return JSON.parse(K.text());
            default:
                return K
        }
    }

    function Xmq(q) {
        function _(A) {
            if (!A) return;
            for (let O of Object.keys(A)) {
                if (/^authentication$/i.test(O)) A[O] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
                if (/^authorization$/i.test(O)) A[O] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
                if (/secret/i.test(O)) A[O] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>."
            }
        }

        function z(A, O) {
            if (typeof A === "object" && A !== null && typeof A[O] === "string") {
                let w = A[O];
                if (/grant_type=/i.test(w) || /assertion=/i.test(w) || /secret/i.test(w)) A[O] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>."
            }
        }

        function Y(A) {
            if (typeof A === "object" && A !== null) {
                if ("grant_type" in A) A.grant_type = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
                if ("assertion" in A) A.assertion = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
                if ("client_secret" in A) A.client_secret = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>."
            }
        }
        if (q.config) {
            _(q.config.headers), z(q.config, "data"), Y(q.config.data), z(q.config, "body"), Y(q.config.body);
            try {
                let A = new j9_.URL("", q.config.url);
                if (A.searchParams.has("token")) A.searchParams.set("token", "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.");
                if (A.searchParams.has("client_secret")) A.searchParams.set("client_secret", "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.");
                q.config.url = A.toString()
            } catch (A) {}
        }
        if (q.response) Xmq({
            config: q.response.config
        }), _(q.response.headers), z(q.response, "data"), Y(q.response.data);
        return q
    }
})
// @from(Ln 149222, Col 4)
Wmq = p((Pmq) => {
    Object.defineProperty(Pmq, "__esModule", {
        value: !0
    });
    Pmq.getRetryConfig = J9_;
    async function J9_(q) {
        let K = Mmq(q);
        if (!q || !q.config || !K && !q.config.retry) return {
            shouldRetry: !1
        };
        K = K || {}, K.currentRetryAttempt = K.currentRetryAttempt || 0, K.retry = K.retry === void 0 || K.retry === null ? 3 : K.retry, K.httpMethodsToRetry = K.httpMethodsToRetry || ["GET", "HEAD", "PUT", "OPTIONS", "DELETE"], K.noResponseRetries = K.noResponseRetries === void 0 || K.noResponseRetries === null ? 2 : K.noResponseRetries, K.retryDelayMultiplier = K.retryDelayMultiplier ? K.retryDelayMultiplier : 2, K.timeOfFirstRequest = K.timeOfFirstRequest ? K.timeOfFirstRequest : Date.now(), K.totalTimeout = K.totalTimeout ? K.totalTimeout : Number.MAX_SAFE_INTEGER, K.maxRetryDelay = K.maxRetryDelay ? K.maxRetryDelay : Number.MAX_SAFE_INTEGER;
        let _ = [
            [100, 199],
            [408, 408],
            [429, 429],
            [500, 599]
        ];
        if (K.statusCodesToRetry = K.statusCodesToRetry || _, q.config.retryConfig = K, !await (K.shouldRetry || X9_)(q)) return {
            shouldRetry: !1,
            config: q.config
        };
        let Y = M9_(K);
        q.config.retryConfig.currentRetryAttempt += 1;
        let A = K.retryBackoff ? K.retryBackoff(q, Y) : new Promise((O) => {
            setTimeout(O, Y)
        });
        if (K.onRetryAttempt) K.onRetryAttempt(q);
        return await A, {
            shouldRetry: !0,
            config: q.config
        }
    }

    function X9_(q) {
        var K;
        let _ = Mmq(q);
        if (q.name === "AbortError" || ((K = q.error) === null || K === void 0 ? void 0 : K.name) === "AbortError") return !1;
        if (!_ || _.retry === 0) return !1;
        if (!q.response && (_.currentRetryAttempt || 0) >= _.noResponseRetries) return !1;
        if (!q.config.method || _.httpMethodsToRetry.indexOf(q.config.method.toUpperCase()) < 0) return !1;
        if (q.response && q.response.status) {
            let z = !1;
            for (let [Y, A] of _.statusCodesToRetry) {
                let O = q.response.status;
                if (O >= Y && O <= A) {
                    z = !0;
                    break
                }
            }
            if (!z) return !1
        }
        if (_.currentRetryAttempt = _.currentRetryAttempt || 0, _.currentRetryAttempt >= _.retry) return !1;
        return !0
    }

    function Mmq(q) {
        if (q && q.config && q.config.retryConfig) return q.config.retryConfig;
        return
    }

    function M9_(q) {
        var K;
        let z = (q.currentRetryAttempt ? 0 : (K = q.retryDelay) !== null && K !== void 0 ? K : 100) + (Math.pow(q.retryDelayMultiplier, q.currentRetryAttempt) - 1) / 2 * 1000,
            Y = q.totalTimeout - (Date.now() - q.timeOfFirstRequest);
        return Math.min(z, Y, q.maxRetryDelay)
    }
})
// @from(Ln 149289, Col 4)
UL1 = p((Dmq) => {
    Object.defineProperty(Dmq, "__esModule", {
        value: !0
    });
    Dmq.default = Z9_;
    var W9_ = D9_(d6("crypto"));

    function D9_(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }
    var gT8 = new Uint8Array(256),
        FT8 = gT8.length;

    function Z9_() {
        if (FT8 > gT8.length - 16) W9_.default.randomFillSync(gT8), FT8 = 0;
        return gT8.slice(FT8, FT8 += 16)
    }
})
// @from(Ln 149309, Col 4)
Gmq = p((Zmq) => {
    Object.defineProperty(Zmq, "__esModule", {
        value: !0
    });
    Zmq.default = void 0;
    var G9_ = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    Zmq.default = G9_
})
// @from(Ln 149317, Col 4)
tr6 = p((vmq) => {
    Object.defineProperty(vmq, "__esModule", {
        value: !0
    });
    vmq.default = void 0;
    var v9_ = T9_(Gmq());

    function T9_(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }

    function V9_(q) {
        return typeof q === "string" && v9_.default.test(q)
    }
    var k9_ = V9_;
    vmq.default = k9_
})
// @from(Ln 149336, Col 4)
er6 = p((kmq) => {
    Object.defineProperty(kmq, "__esModule", {
        value: !0
    });
    kmq.default = void 0;
    kmq.unsafeStringify = Vmq;
    var N9_ = E9_(tr6());

    function E9_(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }
    var Wf = [];
    for (let q = 0; q < 256; ++q) Wf.push((q + 256).toString(16).slice(1));

    function Vmq(q, K = 0) {
        return Wf[q[K + 0]] + Wf[q[K + 1]] + Wf[q[K + 2]] + Wf[q[K + 3]] + "-" + Wf[q[K + 4]] + Wf[q[K + 5]] + "-" + Wf[q[K + 6]] + Wf[q[K + 7]] + "-" + Wf[q[K + 8]] + Wf[q[K + 9]] + "-" + Wf[q[K + 10]] + Wf[q[K + 11]] + Wf[q[K + 12]] + Wf[q[K + 13]] + Wf[q[K + 14]] + Wf[q[K + 15]]
    }

    function y9_(q, K = 0) {
        let _ = Vmq(q, K);
        if (!(0, N9_.default)(_)) throw TypeError("Stringified UUID is invalid");
        return _
    }
    var L9_ = y9_;
    kmq.default = L9_
})
// @from(Ln 149364, Col 4)
hmq = p((ymq) => {
    Object.defineProperty(ymq, "__esModule", {
        value: !0
    });
    ymq.default = void 0;
    var R9_ = C9_(UL1()),
        S9_ = er6();

    function C9_(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }
    var Emq, QL1, dL1 = 0,
        cL1 = 0;

    function b9_(q, K, _) {
        let z = K && _ || 0,
            Y = K || Array(16);
        q = q || {};
        let A = q.node || Emq,
            O = q.clockseq !== void 0 ? q.clockseq : QL1;
        if (A == null || O == null) {
            let X = q.random || (q.rng || R9_.default)();
            if (A == null) A = Emq = [X[0] | 1, X[1], X[2], X[3], X[4], X[5]];
            if (O == null) O = QL1 = (X[6] << 8 | X[7]) & 16383
        }
        let w = q.msecs !== void 0 ? q.msecs : Date.now(),
            $ = q.nsecs !== void 0 ? q.nsecs : cL1 + 1,
            j = w - dL1 + ($ - cL1) / 1e4;
        if (j < 0 && q.clockseq === void 0) O = O + 1 & 16383;
        if ((j < 0 || w > dL1) && q.nsecs === void 0) $ = 0;
        if ($ >= 1e4) throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
        dL1 = w, cL1 = $, QL1 = O, w += 12219292800000;
        let H = ((w & 268435455) * 1e4 + $) % 4294967296;
        Y[z++] = H >>> 24 & 255, Y[z++] = H >>> 16 & 255, Y[z++] = H >>> 8 & 255, Y[z++] = H & 255;
        let J = w / 4294967296 * 1e4 & 268435455;
        Y[z++] = J >>> 8 & 255, Y[z++] = J & 255, Y[z++] = J >>> 24 & 15 | 16, Y[z++] = J >>> 16 & 255, Y[z++] = O >>> 8 | 128, Y[z++] = O & 255;
        for (let X = 0; X < 6; ++X) Y[z + X] = A[X];
        return K || (0, S9_.unsafeStringify)(Y)
    }
    var I9_ = b9_;
    ymq.default = I9_
})
// @from(Ln 149408, Col 4)
lL1 = p((Rmq) => {
    Object.defineProperty(Rmq, "__esModule", {
        value: !0
    });
    Rmq.default = void 0;
    var x9_ = u9_(tr6());

    function u9_(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }

    function m9_(q) {
        if (!(0, x9_.default)(q)) throw TypeError("Invalid UUID");
        let K, _ = new Uint8Array(16);
        return _[0] = (K = parseInt(q.slice(0, 8), 16)) >>> 24, _[1] = K >>> 16 & 255, _[2] = K >>> 8 & 255, _[3] = K & 255, _[4] = (K = parseInt(q.slice(9, 13), 16)) >>> 8, _[5] = K & 255, _[6] = (K = parseInt(q.slice(14, 18), 16)) >>> 8, _[7] = K & 255, _[8] = (K = parseInt(q.slice(19, 23), 16)) >>> 8, _[9] = K & 255, _[10] = (K = parseInt(q.slice(24, 36), 16)) / 1099511627776 & 255, _[11] = K / 4294967296 & 255, _[12] = K >>> 24 & 255, _[13] = K >>> 16 & 255, _[14] = K >>> 8 & 255, _[15] = K & 255, _
    }
    var B9_ = m9_;
    Rmq.default = B9_
})
// @from(Ln 149429, Col 4)
nL1 = p((Imq) => {
    Object.defineProperty(Imq, "__esModule", {
        value: !0
    });
    Imq.URL = Imq.DNS = void 0;
    Imq.default = Q9_;
    var p9_ = er6(),
        F9_ = g9_(lL1());

    function g9_(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }

    function U9_(q) {
        q = unescape(encodeURIComponent(q));
        let K = [];
        for (let _ = 0; _ < q.length; ++_) K.push(q.charCodeAt(_));
        return K
    }
    var Cmq = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    Imq.DNS = Cmq;
    var bmq = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
    Imq.URL = bmq;

    function Q9_(q, K, _) {
        function z(Y, A, O, w) {
            var $;
            if (typeof Y === "string") Y = U9_(Y);
            if (typeof A === "string") A = (0, F9_.default)(A);
            if ((($ = A) === null || $ === void 0 ? void 0 : $.length) !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
            let j = new Uint8Array(16 + Y.length);
            if (j.set(A), j.set(Y, A.length), j = _(j), j[6] = j[6] & 15 | K, j[8] = j[8] & 63 | 128, O) {
                w = w || 0;
                for (let H = 0; H < 16; ++H) O[w + H] = j[H];
                return O
            }
            return (0, p9_.unsafeStringify)(j)
        }
        try {
            z.name = q
        } catch (Y) {}
        return z.DNS = Cmq, z.URL = bmq, z
    }
})
// @from(Ln 149475, Col 4)
Bmq = p((umq) => {
    Object.defineProperty(umq, "__esModule", {
        value: !0
    });
    umq.default = void 0;
    var l9_ = n9_(d6("crypto"));

    function n9_(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }

    function i9_(q) {
        if (Array.isArray(q)) q = Buffer.from(q);
        else if (typeof q === "string") q = Buffer.from(q, "utf8");
        return l9_.default.createHash("md5").update(q).digest()
    }
    var r9_ = i9_;
    umq.default = r9_
})
// @from(Ln 149496, Col 4)
Umq = p((Fmq) => {
    Object.defineProperty(Fmq, "__esModule", {
        value: !0
    });
    Fmq.default = void 0;
    var o9_ = pmq(nL1()),
        a9_ = pmq(Bmq());

    function pmq(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }
    var s9_ = (0, o9_.default)("v3", 48, a9_.default),
        t9_ = s9_;
    Fmq.default = t9_
})
// @from(Ln 149513, Col 4)
cmq = p((Qmq) => {
    Object.defineProperty(Qmq, "__esModule", {
        value: !0
    });
    Qmq.default = void 0;
    var e9_ = q__(d6("crypto"));

    function q__(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }
    var K__ = {
        randomUUID: e9_.default.randomUUID
    };
    Qmq.default = K__
})
// @from(Ln 149530, Col 4)
omq = p((imq) => {
    Object.defineProperty(imq, "__esModule", {
        value: !0
    });
    imq.default = void 0;
    var lmq = nmq(cmq()),
        ___ = nmq(UL1()),
        z__ = er6();

    function nmq(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }

    function Y__(q, K, _) {
        if (lmq.default.randomUUID && !K && !q) return lmq.default.randomUUID();
        q = q || {};
        let z = q.random || (q.rng || ___.default)();
        if (z[6] = z[6] & 15 | 64, z[8] = z[8] & 63 | 128, K) {
            _ = _ || 0;
            for (let Y = 0; Y < 16; ++Y) K[_ + Y] = z[Y];
            return K
        }
        return (0, z__.unsafeStringify)(z)
    }
    var A__ = Y__;
    imq.default = A__
})
// @from(Ln 149559, Col 4)
tmq = p((amq) => {
    Object.defineProperty(amq, "__esModule", {
        value: !0
    });
    amq.default = void 0;
    var O__ = w__(d6("crypto"));

    function w__(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }

    function $__(q) {
        if (Array.isArray(q)) q = Buffer.from(q);
        else if (typeof q === "string") q = Buffer.from(q, "utf8");
        return O__.default.createHash("sha1").update(q).digest()
    }
    var j__ = $__;
    amq.default = j__
})
// @from(Ln 149580, Col 4)
_Bq = p((qBq) => {
    Object.defineProperty(qBq, "__esModule", {
        value: !0
    });
    qBq.default = void 0;
    var H__ = emq(nL1()),
        J__ = emq(tmq());

    function emq(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }
    var X__ = (0, H__.default)("v5", 80, J__.default),
        M__ = X__;
    qBq.default = M__
})
// @from(Ln 149597, Col 4)
ABq = p((zBq) => {
    Object.defineProperty(zBq, "__esModule", {
        value: !0
    });
    zBq.default = void 0;
    var P__ = "00000000-0000-0000-0000-000000000000";
    zBq.default = P__
})
// @from(Ln 149605, Col 4)
$Bq = p((OBq) => {
    Object.defineProperty(OBq, "__esModule", {
        value: !0
    });
    OBq.default = void 0;
    var W__ = D__(tr6());

    function D__(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }

    function Z__(q) {
        if (!(0, W__.default)(q)) throw TypeError("Invalid UUID");
        return parseInt(q.slice(14, 15), 16)
    }
    var f__ = Z__;
    OBq.default = f__
})
// @from(Ln 149625, Col 4)
jBq = p((LB) => {
    Object.defineProperty(LB, "__esModule", {
        value: !0
    });
    Object.defineProperty(LB, "NIL", {
        enumerable: !0,
        get: function() {
            return k__.default
        }
    });
    Object.defineProperty(LB, "parse", {
        enumerable: !0,
        get: function() {
            return L__.default
        }
    });
    Object.defineProperty(LB, "stringify", {
        enumerable: !0,
        get: function() {
            return y__.default
        }
    });
    Object.defineProperty(LB, "v1", {
        enumerable: !0,
        get: function() {
            return G__.default
        }
    });
    Object.defineProperty(LB, "v3", {
        enumerable: !0,
        get: function() {
            return v__.default
        }
    });
    Object.defineProperty(LB, "v4", {
        enumerable: !0,
        get: function() {
            return T__.default
        }
    });
    Object.defineProperty(LB, "v5", {
        enumerable: !0,
        get: function() {
            return V__.default
        }
    });
    Object.defineProperty(LB, "validate", {
        enumerable: !0,
        get: function() {
            return E__.default
        }
    });
    Object.defineProperty(LB, "version", {
        enumerable: !0,
        get: function() {
            return N__.default
        }
    });
    var G__ = Ka(hmq()),
        v__ = Ka(Umq()),
        T__ = Ka(omq()),
        V__ = Ka(_Bq()),
        k__ = Ka(ABq()),
        N__ = Ka($Bq()),
        E__ = Ka(tr6()),
        y__ = Ka(er6()),
        L__ = Ka(lL1());

    function Ka(q) {
        return q && q.__esModule ? q : {
            default: q
        }
    }
})
// @from(Ln 149699, Col 4)
iL1 = p((JBq) => {
    Object.defineProperty(JBq, "__esModule", {
        value: !0
    });
    JBq.GaxiosInterceptorManager = void 0;
    class HBq extends Set {}
    JBq.GaxiosInterceptorManager = HBq
})
// @from(Ln 149707, Col 4)
kBq = p((Bv) => {
    var h__ = Bv && Bv.__createBinding || (Object.create ? function(q, K, _, z) {
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
        R__ = Bv && Bv.__setModuleDefault || (Object.create ? function(q, K) {
            Object.defineProperty(q, "default", {
                enumerable: !0,
                value: K
            })
        } : function(q, K) {
            q.default = K
        }),
        S__ = Bv && Bv.__importStar || function(q) {
            if (q && q.__esModule) return q;
            var K = {};
            if (q != null) {
                for (var _ in q)
                    if (_ !== "default" && Object.prototype.hasOwnProperty.call(q, _)) h__(K, q, _)
            }
            return R__(K, q), K
        },
        N26 = Bv && Bv.__classPrivateFieldGet || function(q, K, _, z) {
            if (_ === "a" && !z) throw TypeError("Private accessor was defined without a getter");
            if (typeof K === "function" ? q !== K || !z : !K.has(q)) throw TypeError("Cannot read private member from an object whose class did not declare it");
            return _ === "m" ? z : _ === "a" ? z.call(q) : z ? z.value : K.get(q)
        },
        C__ = Bv && Bv.__classPrivateFieldSet || function(q, K, _, z, Y) {
            if (z === "m") throw TypeError("Private method is not writable");
            if (z === "a" && !Y) throw TypeError("Private accessor was defined without a setter");
            if (typeof K === "function" ? q !== K || !Y : !K.has(q)) throw TypeError("Cannot write private member to an object whose class did not declare it");
            return z === "a" ? Y.call(q, _) : Y ? Y.value = _ : K.set(q, _), _
        },
        dT8 = Bv && Bv.__importDefault || function(q) {
            return q && q.__esModule ? q : {
                default: q
            }
        },
        sV6, k26, MBq, GBq, vBq, TBq, UT8, PBq;
    Object.defineProperty(Bv, "__esModule", {
        value: !0
    });
    Bv.Gaxios = void 0;
    var b__ = dT8($L1()),
        I__ = d6("https"),
        x__ = dT8(zmq()),
        u__ = dT8(d6("querystring")),
        m__ = dT8(Amq()),
        WBq = d6("url"),
        QT8 = gL1(),
        B__ = Wmq(),
        DBq = d6("stream"),
        p__ = jBq(),
        ZBq = iL1(),
        F__ = U__() ? window.fetch : x__.default;

    function g__() {
        return typeof window < "u" && !!window
    }

    function U__() {
        return g__() && !!window.fetch
    }

    function Q__() {
        return typeof Buffer < "u"
    }

    function fBq(q, K) {
        return !!VBq(q, K)
    }

    function VBq(q, K) {
        K = K.toLowerCase();
        for (let _ of Object.keys((q === null || q === void 0 ? void 0 : q.headers) || {}))
            if (K === _.toLowerCase()) return q.headers[_];
        return
    }
    class rL1 {
        constructor(q) {
            sV6.add(this), this.agentCache = new Map, this.defaults = q || {}, this.interceptors = {
                request: new ZBq.GaxiosInterceptorManager,
                response: new ZBq.GaxiosInterceptorManager
            }
        }
        async request(q = {}) {
            return q = await N26(this, sV6, "m", TBq).call(this, q), q = await N26(this, sV6, "m", GBq).call(this, q), N26(this, sV6, "m", vBq).call(this, this._request(q))
        }
        async _defaultAdapter(q) {
            let _ = await (q.fetchImplementation || F__)(q.url, q),
                z = await this.getResponseData(q, _);
            return this.translateResponse(q, _, z)
        }
        async _request(q = {}) {
            var K;
            try {
                let _;
                if (q.adapter) _ = await q.adapter(q, this._defaultAdapter.bind(this));
                else _ = await this._defaultAdapter(q);
                if (!q.validateStatus(_.status)) {
                    if (q.responseType === "stream") {
                        let z = "";
                        await new Promise((Y) => {
                            (_ === null || _ === void 0 ? void 0 : _.data).on("data", (A) => {
                                z += A
                            }), (_ === null || _ === void 0 ? void 0 : _.data).on("end", Y)
                        }), _.data = z
                    }
                    throw new QT8.GaxiosError(`Request failed with status code ${_.status}`, q, _)
                }
                return _
            } catch (_) {
                let z = _ instanceof QT8.GaxiosError ? _ : new QT8.GaxiosError(_.message, q, void 0, _),
                    {
                        shouldRetry: Y,
                        config: A
                    } = await (0, B__.getRetryConfig)(z);
                if (Y && A) return z.config.retryConfig.currentRetryAttempt = A.retryConfig.currentRetryAttempt, q.retryConfig = (K = z.config) === null || K === void 0 ? void 0 : K.retryConfig, this._request(q);
                throw z
            }
        }
        async getResponseData(q, K) {
            switch (q.responseType) {
                case "stream":
                    return K.body;
                case "json": {
                    let _ = await K.text();
                    try {
                        _ = JSON.parse(_)
                    } catch (z) {}
                    return _
                }
                case "arraybuffer":
                    return K.arrayBuffer();
                case "blob":
                    return K.blob();
                case "text":
                    return K.text();
                default:
                    return this.getResponseDataFromContentType(K)
            }
        }
        validateStatus(q) {
            return q >= 200 && q < 300
        }
        paramsSerializer(q) {
            return u__.default.stringify(q)
        }
        translateResponse(q, K, _) {
            let z = {};
            return K.headers.forEach((Y, A) => {
                z[A] = Y
            }), {
                config: q,
                data: _,
                headers: z,
                status: K.status,
                statusText: K.statusText,
                request: {
                    responseURL: K.url
                }
            }
        }
        async getResponseDataFromContentType(q) {
            let K = q.headers.get("Content-Type");
            if (K === null) return q.text();
            if (K = K.toLowerCase(), K.includes("application/json")) {
                let _ = await q.text();
                try {
                    _ = JSON.parse(_)
                } catch (z) {}
                return _
            } else if (K.match(/^text\//)) return q.text();
            else return q.blob()
        }
        async * getMultipartRequest(q, K) {
            let _ = `--${K}--`;
            for (let z of q) {
                let Y = z.headers["Content-Type"] || "application/octet-stream";
                if (yield `--${K}\r
Content-Type: ${Y}\r
\r
`, typeof z.content === "string") yield z.content;
                else yield* z.content;
                yield `\r
`
            }
            yield _
        }
    }
    Bv.Gaxios = rL1;
    k26 = rL1, sV6 = new WeakSet, MBq = function(K, _ = []) {
        var z, Y;
        let A = new WBq.URL(K),
            O = [..._],
            w = ((Y = (z = process.env.NO_PROXY) !== null && z !== void 0 ? z : process.env.no_proxy) === null || Y === void 0 ? void 0 : Y.split(",")) || [];
        for (let $ of w) O.push($.trim());
        for (let $ of O)
            if ($ instanceof RegExp) {
                if ($.test(A.toString())) return !1
            } else if ($ instanceof WBq.URL) {
            if ($.origin === A.origin) return !1
        } else if ($.startsWith("*.") || $.startsWith(".")) {
            let j = $.replace(/^\*\./, ".");
            if (A.hostname.endsWith(j)) return !1
        } else if ($ === A.origin || $ === A.hostname || $ === A.href) return !1;
        return !0
    }, GBq = async function(K) {
        let _ = Promise.resolve(K);
        for (let z of this.interceptors.request.values())
            if (z) _ = _.then(z.resolved, z.rejected);
        return _
    }, vBq = async function(K) {
        let _ = Promise.resolve(K);
        for (let z of this.interceptors.response.values())
            if (z) _ = _.then(z.resolved, z.rejected);
        return _
    }, TBq = async function(K) {
        var _, z, Y, A;
        let O = (0, b__.default)(!0, {}, this.defaults, K);
        if (!O.url) throw Error("URL is required.");
        let w = O.baseUrl || O.baseURL;
        if (w) O.url = w.toString() + O.url;
        if (O.paramsSerializer = O.paramsSerializer || this.paramsSerializer, O.params && Object.keys(O.params).length > 0) {
            let H = O.paramsSerializer(O.params);
            if (H.startsWith("?")) H = H.slice(1);
            let J = O.url.toString().includes("?") ? "&" : "?";
            O.url = O.url + J + H
        }
        if (typeof K.maxContentLength === "number") O.size = K.maxContentLength;
        if (typeof K.maxRedirects === "number") O.follow = K.maxRedirects;
        if (O.headers = O.headers || {}, O.multipart === void 0 && O.data) {
            let H = typeof FormData > "u" ? !1 : (O === null || O === void 0 ? void 0 : O.data) instanceof FormData;
            if (m__.default.readable(O.data)) O.body = O.data;
            else if (Q__() && Buffer.isBuffer(O.data)) {
                if (O.body = O.data, !fBq(O, "Content-Type")) O.headers["Content-Type"] = "application/json"
            } else if (typeof O.data === "object") {
                if (!H)
                    if (VBq(O, "content-type") === "application/x-www-form-urlencoded") O.body = O.paramsSerializer(O.data);
                    else {
                        if (!fBq(O, "Content-Type")) O.headers["Content-Type"] = "application/json";
                        O.body = JSON.stringify(O.data)
                    }
            } else O.body = O.data
        } else if (O.multipart && O.multipart.length > 0) {
            let H = (0, p__.v4)();
            O.headers["Content-Type"] = `multipart/related; boundary=${H}`;
            let J = new DBq.PassThrough;
            O.body = J, (0, DBq.pipeline)(this.getMultipartRequest(O.multipart, H), J, () => {})
        }
        if (O.validateStatus = O.validateStatus || this.validateStatus, O.responseType = O.responseType || "unknown", !O.headers.Accept && O.responseType === "json") O.headers.Accept = "application/json";
        O.method = O.method || "GET";
        let $ = O.proxy || ((_ = process === null || process === void 0 ? void 0 : process.env) === null || _ === void 0 ? void 0 : _.HTTPS_PROXY) || ((z = process === null || process === void 0 ? void 0 : process.env) === null || z === void 0 ? void 0 : z.https_proxy) || ((Y = process === null || process === void 0 ? void 0 : process.env) === null || Y === void 0 ? void 0 : Y.HTTP_PROXY) || ((A = process === null || process === void 0 ? void 0 : process.env) === null || A === void 0 ? void 0 : A.http_proxy),
            j = N26(this, sV6, "m", MBq).call(this, O.url, O.noProxy);
        if (O.agent);
        else if ($ && j) {
            let H = await N26(k26, k26, "m", PBq).call(k26);
            if (this.agentCache.has($)) O.agent = this.agentCache.get($);
            else O.agent = new H($, {
                cert: O.cert,
                key: O.key
            }), this.agentCache.set($, O.agent)
        } else if (O.cert && O.key)
            if (this.agentCache.has(O.key)) O.agent = this.agentCache.get(O.key);
            else O.agent = new I__.Agent({
                cert: O.cert,
                key: O.key
            }), this.agentCache.set(O.key, O.agent);
        if (typeof O.errorRedactor !== "function" && O.errorRedactor !== !1) O.errorRedactor = QT8.defaultErrorRedactor;
        return O
    }, PBq = async function() {
        return C__(this, k26, N26(this, k26, "f", UT8) || (await Promise.resolve().then(() => S__(dQ6()))).HttpsProxyAgent, "f", UT8), N26(this, k26, "f", UT8)
    };
    UT8 = {
        value: void 0
    }
})
// @from(Ln 149994, Col 4)
hB = p((tV) => {
    var d__ = tV && tV.__createBinding || (Object.create ? function(q, K, _, z) {
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
        c__ = tV && tV.__exportStar || function(q, K) {
            for (var _ in q)
                if (_ !== "default" && !Object.prototype.hasOwnProperty.call(K, _)) d__(K, q, _)
        };
    Object.defineProperty(tV, "__esModule", {
        value: !0
    });
    tV.instance = tV.Gaxios = tV.GaxiosError = void 0;
    tV.request = n__;
    var NBq = kBq();
    Object.defineProperty(tV, "Gaxios", {
        enumerable: !0,
        get: function() {
            return NBq.Gaxios
        }
    });
    var l__ = gL1();
    Object.defineProperty(tV, "GaxiosError", {
        enumerable: !0,
        get: function() {
            return l__.GaxiosError
        }
    });
    c__(iL1(), tV);
    tV.instance = new NBq.Gaxios;
    async function n__(q) {
        return tV.instance.request(q)
    }
})