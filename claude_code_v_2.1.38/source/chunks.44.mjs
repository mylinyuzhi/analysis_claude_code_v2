
// @from(Ln 116588, Col 4)
xg = v(() => {
    Rg();
    u81();
    e6A();
    _W();
    qu();
    DAA();
    yy1();
    a76();
    xAA();
    cAA();
    IAA();
    dAA();
    e6A();
    rT();
    r76();
    u81();
    iAA = _z, V46 = new WeakMap, lAA = new WeakSet, To8 = function() {
        return this.baseURL !== "https://api.anthropic.com"
    };
    _z.Anthropic = iAA;
    _z.HUMAN_PROMPT = vo8;
    _z.AI_PROMPT = Eo8;
    _z.DEFAULT_TIMEOUT = 600000;
    _z.AnthropicError = r7;
    _z.APIError = k4;
    _z.APIConnectionError = OW;
    _z.APIConnectionTimeoutError = Au;
    _z.APIUserAbortError = Oz;
    _z.NotFoundError = b81;
    _z.ConflictError = iR1;
    _z.RateLimitError = rR1;
    _z.BadRequestError = cR1;
    _z.AuthenticationError = x81;
    _z.InternalServerError = oR1;
    _z.PermissionDeniedError = lR1;
    _z.UnprocessableEntityError = nR1;
    _z.toFile = e76;
    oC = class oC extends _z {
        constructor() {
            super(...arguments);
            this.completions = new rn(this), this.messages = new aT(this), this.models = new oO1(this), this.beta = new JW(this)
        }
    };
    oC.Completions = rn;
    oC.Messages = aT;
    oC.Models = oO1;
    oC.Beta = JW
})
// @from(Ln 116637, Col 4)
GV = v(() => {
    xg();
    DAA();
    a76();
    xg();
    qu();
    _W()
})
// @from(Ln 116645, Col 4)
h4 = "Bash"
// @from(Ln 116647, Col 0)
function L8(A, q) {
    if (!process.env.SRT_DEBUG) return;
    let K = q?.level || "info",
        Y = "[SandboxDebug]";
    switch (K) {
        case "error":
            console.error(`${Y} ${A}`);
            break;
        case "warn":
            console.warn(`${Y} ${A}`);
            break;
        default:
            console.error(`${Y} ${A}`)
    }
}
// @from(Ln 116679, Col 0)
function Ro8(A) {
    let q = QX5();
    return q.on("connect", async (K, Y) => {
        Y.on("error", (z) => {
            L8(`Client socket error: ${z.message}`, {
                level: "error"
            })
        });
        try {
            let [z, w] = K.url.split(":"), H = w === void 0 ? void 0 : parseInt(w, 10);
            if (!z || !H) {
                L8(`Invalid CONNECT request: ${K.url}`, {
                    level: "error"
                }), Y.end(`HTTP/1.1 400 Bad Request\r
\r
`);
                return
            }
            if (!await A.filter(H, z, Y)) {
                L8(`Connection blocked to ${z}:${H}`, {
                    level: "error"
                }), Y.end(`HTTP/1.1 403 Forbidden\r
Content-Type: text/plain\r
X-Proxy-Error: blocked-by-allowlist\r
\r
Connection blocked by network allowlist`);
                return
            }
            let O = A.getMitmSocketPath?.(z);
            if (O) {
                L8(`Routing CONNECT ${z}:${H} through MITM proxy at ${O}`);
                let _ = Lo8({
                        path: O
                    }, () => {
                        _.write(`CONNECT ${z}:${H} HTTP/1.1\r
Host: ${z}:${H}\r
\r
`)
                    }),
                    J = "",
                    X = (D) => {
                        J += D.toString();
                        let j = J.indexOf(`\r
\r
`);
                        if (j !== -1) {
                            _.removeListener("data", X);
                            let M = J.substring(0, J.indexOf(`\r
`));
                            if (M.includes(" 200 ")) {
                                Y.write(`HTTP/1.1 200 Connection Established\r
\r
`);
                                let P = J.substring(j + 4);
                                if (P.length > 0) Y.write(P);
                                _.pipe(Y), Y.pipe(_)
                            } else L8(`MITM proxy rejected CONNECT: ${M}`, {
                                level: "error"
                            }), Y.end(`HTTP/1.1 502 Bad Gateway\r
\r
`), _.destroy()
                        }
                    };
                _.on("data", X), _.on("error", (D) => {
                    L8(`MITM proxy connection failed: ${D.message}`, {
                        level: "error"
                    }), Y.end(`HTTP/1.1 502 Bad Gateway\r
\r
`)
                }), Y.on("error", (D) => {
                    L8(`Client socket error: ${D.message}`, {
                        level: "error"
                    }), _.destroy()
                }), Y.on("end", () => _.end()), _.on("end", () => Y.end())
            } else {
                let _ = Lo8(H, z, () => {
                    Y.write(`HTTP/1.1 200 Connection Established\r
\r
`), _.pipe(Y), Y.pipe(_)
                });
                _.on("error", (J) => {
                    L8(`CONNECT tunnel failed: ${J.message}`, {
                        level: "error"
                    }), Y.end(`HTTP/1.1 502 Bad Gateway\r
\r
`)
                }), Y.on("error", (J) => {
                    L8(`Client socket error: ${J.message}`, {
                        level: "error"
                    }), _.destroy()
                }), Y.on("end", () => _.end()), _.on("end", () => Y.end())
            }
        } catch (z) {
            L8(`Error handling CONNECT: ${z}`, {
                level: "error"
            }), Y.end(`HTTP/1.1 500 Internal Server Error\r
\r
`)
        }
    }), q.on("request", async (K, Y) => {
        try {
            let z = new UX5(K.url),
                w = z.hostname,
                H = z.port ? parseInt(z.port, 10) : z.protocol === "https:" ? 443 : 80;
            if (!await A.filter(H, w, K.socket)) {
                L8(`HTTP request blocked to ${w}:${H}`, {
                    level: "error"
                }), Y.writeHead(403, {
                    "Content-Type": "text/plain",
                    "X-Proxy-Error": "blocked-by-allowlist"
                }), Y.end("Connection blocked by network allowlist");
                return
            }
            let O = A.getMitmSocketPath?.(w);
            if (O) {
                L8(`Routing HTTP ${K.method} ${w}:${H} through MITM proxy at ${O}`);
                let _ = new FX5({
                        socketPath: O
                    }),
                    J = ko8({
                        agent: _,
                        path: K.url,
                        method: K.method,
                        headers: {
                            ...K.headers,
                            host: z.host
                        }
                    }, (X) => {
                        Y.writeHead(X.statusCode, X.headers), X.pipe(Y)
                    });
                J.on("error", (X) => {
                    if (L8(`MITM proxy request failed: ${X.message}`, {
                            level: "error"
                        }), !Y.headersSent) Y.writeHead(502, {
                        "Content-Type": "text/plain"
                    }), Y.end("Bad Gateway")
                }), K.pipe(J)
            } else {
                let J = (z.protocol === "https:" ? gX5 : ko8)({
                    hostname: w,
                    port: H,
                    path: z.pathname + z.search,
                    method: K.method,
                    headers: {
                        ...K.headers,
                        host: z.host
                    }
                }, (X) => {
                    Y.writeHead(X.statusCode, X.headers), X.pipe(Y)
                });
                J.on("error", (X) => {
                    if (L8(`Proxy request failed: ${X.message}`, {
                            level: "error"
                        }), !Y.headersSent) Y.writeHead(502, {
                        "Content-Type": "text/plain"
                    }), Y.end("Bad Gateway")
                }), K.pipe(J)
            }
        } catch (z) {
            L8(`Error handling HTTP request: ${z}`, {
                level: "error"
            }), Y.writeHead(500, {
                "Content-Type": "text/plain"
            }), Y.end("Internal Server Error")
        }
    }), q
}
// @from(Ln 116846, Col 4)
yo8 = () => {}
// @from(Ln 116847, Col 4)
uo8 = R((t22, bo8) => {
    var {
        create: pX5,
        defineProperty: N46,
        getOwnPropertyDescriptor: dX5,
        getOwnPropertyNames: cX5,
        getPrototypeOf: lX5
    } = Object, iX5 = Object.prototype.hasOwnProperty, nX5 = (A, q) => {
        for (var K in q) N46(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, Co8 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of cX5(q))
                if (!iX5.call(A, z) && z !== K) N46(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = dX5(q, z)) || Y.enumerable
                })
        }
        return A
    }, So8 = (A, q, K) => (K = A != null ? pX5(lX5(A)) : {}, Co8(q || !A || !A.__esModule ? N46(K, "default", {
        value: A,
        enumerable: !0
    }) : K, A)), rX5 = (A) => Co8(N46({}, "__esModule", {
        value: !0
    }), A), ho8 = {};
    nX5(ho8, {
        Socks5Server: () => xo8,
        createServer: () => tX5,
        defaultConnectionHandler: () => rAA
    });
    bo8.exports = rX5(ho8);
    var oX5 = So8(h1("net")),
        Io8 = ((A) => {
            return A[A.connect = 1] = "connect", A[A.bind = 2] = "bind", A[A.udp = 3] = "udp", A
        })(Io8 || {}),
        nAA = ((A) => {
            return A[A.REQUEST_GRANTED = 0] = "REQUEST_GRANTED", A[A.GENERAL_FAILURE = 1] = "GENERAL_FAILURE", A[A.CONNECTION_NOT_ALLOWED = 2] = "CONNECTION_NOT_ALLOWED", A[A.NETWORK_UNREACHABLE = 3] = "NETWORK_UNREACHABLE", A[A.HOST_UNREACHABLE = 4] = "HOST_UNREACHABLE", A[A.CONNECTION_REFUSED = 5] = "CONNECTION_REFUSED", A[A.TTL_EXPIRED = 6] = "TTL_EXPIRED", A[A.COMMAND_NOT_SUPPORTED = 7] = "COMMAND_NOT_SUPPORTED", A[A.ADDRESS_TYPE_NOT_SUPPORTED = 8] = "ADDRESS_TYPE_NOT_SUPPORTED", A
        })(nAA || {}),
        aX5 = class {
            constructor(A, q) {
                this.errorHandler = () => {}, this.metadata = {}, this.socket = q, this.server = A, q.on("error", this.errorHandler), q.pause(), this.handleGreeting()
            }
            readBytes(A) {
                return new Promise((q) => {
                    let K = Buffer.allocUnsafe(A),
                        Y = 0,
                        z = (w) => {
                            let H = Math.min(w.length, A - Y);
                            if (w.copy(K, Y, 0, H), Y += H, Y < A) return;
                            this.socket.removeListener("data", z), this.socket.push(w.subarray(H)), q(K), this.socket.pause()
                        };
                    this.socket.on("data", z), this.socket.resume()
                })
            }
            async handleGreeting() {
                if ((await this.readBytes(1)).readUInt8() !== 5) return this.socket.destroy();
                let q = (await this.readBytes(1)).readUInt8();
                if (q > 128 || q === 0) return this.socket.destroy();
                let K = await this.readBytes(q),
                    Y = this.server.authHandler ? 2 : 0;
                if (!K.includes(Y)) return this.socket.write(Buffer.from([5, 255])), this.socket.destroy();
                if (this.socket.write(Buffer.from([5, Y])), this.server.authHandler) this.handleUserPassword();
                else this.handleConnectionRequest()
            }
            async handleUserPassword() {
                await this.readBytes(1);
                let A = (await this.readBytes(1)).readUint8(),
                    q = (await this.readBytes(A)).toString(),
                    K = (await this.readBytes(1)).readUint8(),
                    Y = (await this.readBytes(K)).toString();
                this.username = q, this.password = Y;
                let z = !1,
                    w = () => {
                        if (z) return;
                        z = !0, this.socket.write(Buffer.from([1, 0])), this.handleConnectionRequest()
                    },
                    H = () => {
                        if (z) return;
                        z = !0, this.socket.write(Buffer.from([1, 1])), this.socket.destroy()
                    },
                    $ = await this.server.authHandler(this, w, H);
                if ($ === !0) w();
                else if ($ === !1) H()
            }
            async handleConnectionRequest() {
                await this.readBytes(1);
                let A = (await this.readBytes(1))[0],
                    q = Io8[A];
                if (!q) return this.socket.destroy();
                this.command = q, await this.readBytes(1);
                let K = (await this.readBytes(1)).readUInt8(),
                    Y = "";
                switch (K) {
                    case 1:
                        Y = (await this.readBytes(4)).join(".");
                        break;
                    case 3:
                        let _ = (await this.readBytes(1)).readUInt8();
                        Y = (await this.readBytes(_)).toString();
                        break;
                    case 4:
                        let J = await this.readBytes(16);
                        for (let X = 0; X < 16; X++) {
                            if (X % 2 === 0 && X > 0) Y += ":";
                            Y += `${J[X]<16?"0":""}${J[X].toString(16)}`
                        }
                        break;
                    default:
                        this.socket.destroy();
                        return
                }
                let z = (await this.readBytes(2)).readUInt16BE();
                if (!this.server.supportedCommands.has(q)) return this.socket.write(Buffer.from([5, 7])), this.socket.destroy();
                this.destAddress = Y, this.destPort = z;
                let w = !1,
                    H = () => {
                        if (w) return;
                        w = !0, this.connect()
                    };
                if (!this.server.rulesetValidator) return H();
                let $ = () => {
                        if (w) return;
                        w = !0, this.socket.write(Buffer.from([5, 2, 0, 1, 0, 0, 0, 0, 0, 0])), this.socket.destroy()
                    },
                    O = await this.server.rulesetValidator(this, H, $);
                if (O === !0) H();
                else if (O === !1) $()
            }
            connect() {
                this.socket.removeListener("error", this.errorHandler), this.server.connectionHandler(this, (A) => {
                    if (nAA[A] === void 0) throw Error(`"${A}" is not a valid status.`);
                    if (this.socket.write(Buffer.from([5, nAA[A], 0, 1, 0, 0, 0, 0, 0, 0])), A !== "REQUEST_GRANTED") this.socket.destroy()
                }), this.socket.resume()
            }
        },
        sX5 = So8(h1("net"));

    function rAA(A, q) {
        if (A.command !== "connect") return q("COMMAND_NOT_SUPPORTED");
        A.socket.on("error", () => {});
        let K = sX5.default.createConnection({
            host: A.destAddress,
            port: A.destPort
        });
        K.setNoDelay();
        let Y = !1;
        return K.on("error", (z) => {
            if (!Y) switch (z.code) {
                case "EINVAL":
                case "ENOENT":
                case "ENOTFOUND":
                case "ETIMEDOUT":
                case "EADDRNOTAVAIL":
                case "EHOSTUNREACH":
                    q("HOST_UNREACHABLE");
                    break;
                case "ENETUNREACH":
                    q("NETWORK_UNREACHABLE");
                    break;
                case "ECONNREFUSED":
                    q("CONNECTION_REFUSED");
                    break;
                default:
                    q("GENERAL_FAILURE")
            }
        }), K.on("ready", () => {
            Y = !0, q("REQUEST_GRANTED"), A.socket.pipe(K).pipe(A.socket)
        }), A.socket.on("close", () => K.destroy()), K
    }
    var xo8 = class {
        constructor() {
            this.supportedCommands = new Set(["connect"]), this.connectionHandler = rAA, this.server = oX5.default.createServer((A) => {
                A.setNoDelay(), this._handleConnection(A)
            })
        }
        listen(...A) {
            return this.server.listen(...A), this
        }
        close(A) {
            return this.server.close(A), this
        }
        setAuthHandler(A) {
            return this.authHandler = A, this
        }
        disableAuthHandler() {
            return this.authHandler = void 0, this
        }
        setRulesetValidator(A) {
            return this.rulesetValidator = A, this
        }
        disableRulesetValidator() {
            return this.rulesetValidator = void 0, this
        }
        setConnectionHandler(A) {
            return this.connectionHandler = A, this
        }
        useDefaultConnectionHandler() {
            return this.connectionHandler = rAA, this
        }
        _handleConnection(A) {
            return new aX5(this, A), this
        }
    };

    function tX5(A) {
        let q = new xo8;
        if (A?.auth) q.setAuthHandler((K) => {
            return K.username === A.auth.username && K.password === A.auth.password
        });
        if (A?.port) q.listen(A.port, A.hostname);
        return q
    }
})
// @from(Ln 117063, Col 0)
function mo8(A) {
    let q = Bo8.createServer();
    return q.setRulesetValidator(async (K) => {
        try {
            let {
                destAddress: Y,
                destPort: z
            } = K;
            if (L8(`Connection request to ${Y}:${z}`), !await A.filter(z, Y)) return L8(`Connection blocked to ${Y}:${z}`, {
                level: "error"
            }), !1;
            return L8(`Connection allowed to ${Y}:${z}`), !0
        } catch (Y) {
            return L8(`Error validating connection: ${Y}`, {
                level: "error"
            }), !1
        }
    }), {
        server: q,
        getPort() {
            try {
                let K = q?.server;
                if (K && typeof K?.address === "function") {
                    let Y = K.address();
                    if (Y && typeof Y === "object" && "port" in Y) return Y.port
                }
            } catch (K) {
                L8(`Error getting port: ${K}`, {
                    level: "error"
                })
            }
            return
        },
        listen(K, Y) {
            return new Promise((z, w) => {
                let H = () => {
                    let $ = this.getPort();
                    if ($) L8(`SOCKS proxy listening on ${Y}:${$}`), z($);
                    else w(Error("Failed to get SOCKS proxy server port"))
                };
                q.listen(K, Y, H)
            })
        },
        async close() {
            return new Promise((K, Y) => {
                q.close((z) => {
                    if (z) {
                        let w = z.message?.toLowerCase() || "";
                        if (!(w.includes("not running") || w.includes("already closed") || w.includes("not listening"))) {
                            Y(z);
                            return
                        }
                    }
                    K()
                })
            })
        },
        unref() {
            try {
                let K = q?.server;
                if (K && typeof K?.unref === "function") K.unref()
            } catch (K) {
                L8(`Error calling unref: ${K}`, {
                    level: "error"
                })
            }
        }
    }
}
// @from(Ln 117132, Col 4)
Bo8
// @from(Ln 117133, Col 4)
Fo8 = v(() => {
    Bo8 = o(uo8(), 1)
})
// @from(Ln 117136, Col 4)
eX5
// @from(Ln 117136, Col 9)
T46
// @from(Ln 117137, Col 4)
oAA = v(() => {
    eX5 = typeof global == "object" && global && global.Object === Object && global, T46 = eX5
})
// @from(Ln 117140, Col 4)
AD5
// @from(Ln 117140, Col 9)
qD5
// @from(Ln 117140, Col 14)
PX
// @from(Ln 117141, Col 4)
aC = v(() => {
    oAA();
    AD5 = typeof self == "object" && self && self.Object === Object && self, qD5 = T46 || AD5 || Function("return this")(), PX = qD5
})
// @from(Ln 117145, Col 4)
KD5
// @from(Ln 117145, Col 9)
bg
// @from(Ln 117146, Col 4)
v46 = v(() => {
    aC();
    KD5 = PX.Symbol, bg = KD5
})
// @from(Ln 117151, Col 0)
function wD5(A) {
    var q = YD5.call(A, Sy1),
        K = A[Sy1];
    try {
        A[Sy1] = void 0;
        var Y = !0
    } catch (w) {}
    var z = zD5.call(A);
    if (Y)
        if (q) A[Sy1] = K;
        else delete A[Sy1];
    return z
}
// @from(Ln 117164, Col 4)
Qo8
// @from(Ln 117164, Col 9)
YD5
// @from(Ln 117164, Col 14)
zD5
// @from(Ln 117164, Col 19)
Sy1
// @from(Ln 117164, Col 24)
go8
// @from(Ln 117165, Col 4)
Uo8 = v(() => {
    v46();
    Qo8 = Object.prototype, YD5 = Qo8.hasOwnProperty, zD5 = Qo8.toString, Sy1 = bg ? bg.toStringTag : void 0;
    go8 = wD5
})
// @from(Ln 117171, Col 0)
function OD5(A) {
    return $D5.call(A)
}
// @from(Ln 117174, Col 4)
HD5
// @from(Ln 117174, Col 9)
$D5
// @from(Ln 117174, Col 14)
po8
// @from(Ln 117175, Col 4)
do8 = v(() => {
    HD5 = Object.prototype, $D5 = HD5.toString;
    po8 = OD5
})
// @from(Ln 117180, Col 0)
function XD5(A) {
    if (A == null) return A === void 0 ? JD5 : _D5;
    return co8 && co8 in Object(A) ? go8(A) : po8(A)
}
// @from(Ln 117184, Col 4)
_D5 = "[object Null]"
// @from(Ln 117185, Col 4)
JD5 = "[object Undefined]"
// @from(Ln 117186, Col 4)
co8
// @from(Ln 117186, Col 9)
ug
// @from(Ln 117187, Col 4)
hy1 = v(() => {
    v46();
    Uo8();
    do8();
    co8 = bg ? bg.toStringTag : void 0;
    ug = XD5
})
// @from(Ln 117195, Col 0)
function DD5(A) {
    return A != null && typeof A == "object"
}
// @from(Ln 117198, Col 4)
Ku
// @from(Ln 117199, Col 4)
aO1 = v(() => {
    Ku = DD5
})
// @from(Ln 117202, Col 4)
jD5
// @from(Ln 117202, Col 9)
sO1
// @from(Ln 117203, Col 4)
E46 = v(() => {
    jD5 = Array.isArray, sO1 = jD5
})
// @from(Ln 117207, Col 0)
function MD5(A) {
    var q = typeof A;
    return A != null && (q == "object" || q == "function")
}
// @from(Ln 117211, Col 4)
Yu
// @from(Ln 117212, Col 4)
tO1 = v(() => {
    Yu = MD5
})
// @from(Ln 117216, Col 0)
function fD5(A) {
    if (!Yu(A)) return !1;
    var q = ug(A);
    return q == WD5 || q == GD5 || q == PD5 || q == ZD5
}
// @from(Ln 117221, Col 4)
PD5 = "[object AsyncFunction]"
// @from(Ln 117222, Col 4)
WD5 = "[object Function]"
// @from(Ln 117223, Col 4)
GD5 = "[object GeneratorFunction]"
// @from(Ln 117224, Col 4)
ZD5 = "[object Proxy]"
// @from(Ln 117225, Col 4)
k46
// @from(Ln 117226, Col 4)
aAA = v(() => {
    hy1();
    tO1();
    k46 = fD5
})
// @from(Ln 117231, Col 4)
VD5
// @from(Ln 117231, Col 9)
L46
// @from(Ln 117232, Col 4)
lo8 = v(() => {
    aC();
    VD5 = PX["__core-js_shared__"], L46 = VD5
})
// @from(Ln 117237, Col 0)
function ND5(A) {
    return !!io8 && io8 in A
}
// @from(Ln 117240, Col 4)
io8
// @from(Ln 117240, Col 9)
no8
// @from(Ln 117241, Col 4)
ro8 = v(() => {
    lo8();
    io8 = function() {
        var A = /[^.]+$/.exec(L46 && L46.keys && L46.keys.IE_PROTO || "");
        return A ? "Symbol(src)_1." + A : ""
    }();
    no8 = ND5
})
// @from(Ln 117250, Col 0)
function ED5(A) {
    if (A != null) {
        try {
            return vD5.call(A)
        } catch (q) {}
        try {
            return A + ""
        } catch (q) {}
    }
    return ""
}
// @from(Ln 117261, Col 4)
TD5
// @from(Ln 117261, Col 9)
vD5
// @from(Ln 117261, Col 14)
Bg
// @from(Ln 117262, Col 4)
sAA = v(() => {
    TD5 = Function.prototype, vD5 = TD5.toString;
    Bg = ED5
})
// @from(Ln 117267, Col 0)
function ID5(A) {
    if (!Yu(A) || no8(A)) return !1;
    var q = k46(A) ? hD5 : LD5;
    return q.test(Bg(A))
}
// @from(Ln 117272, Col 4)
kD5
// @from(Ln 117272, Col 9)
LD5
// @from(Ln 117272, Col 14)
RD5
// @from(Ln 117272, Col 19)
yD5
// @from(Ln 117272, Col 24)
CD5
// @from(Ln 117272, Col 29)
SD5
// @from(Ln 117272, Col 34)
hD5
// @from(Ln 117272, Col 39)
oo8
// @from(Ln 117273, Col 4)
ao8 = v(() => {
    aAA();
    ro8();
    tO1();
    sAA();
    kD5 = /[\\^$.*+?()[\]{}|]/g, LD5 = /^\[object .+?Constructor\]$/, RD5 = Function.prototype, yD5 = Object.prototype, CD5 = RD5.toString, SD5 = yD5.hasOwnProperty, hD5 = RegExp("^" + CD5.call(SD5).replace(kD5, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
    oo8 = ID5
})
// @from(Ln 117282, Col 0)
function xD5(A, q) {
    return A == null ? void 0 : A[q]
}
// @from(Ln 117285, Col 4)
so8
// @from(Ln 117286, Col 4)
to8 = v(() => {
    so8 = xD5
})
// @from(Ln 117290, Col 0)
function bD5(A, q) {
    var K = so8(A, q);
    return oo8(K) ? K : void 0
}
// @from(Ln 117294, Col 4)
ZV
// @from(Ln 117295, Col 4)
an = v(() => {
    ao8();
    to8();
    ZV = bD5
})
// @from(Ln 117300, Col 4)
uD5
// @from(Ln 117300, Col 9)
R46
// @from(Ln 117301, Col 4)
eo8 = v(() => {
    an();
    aC();
    uD5 = ZV(PX, "WeakMap"), R46 = uD5
})
// @from(Ln 117306, Col 4)
Aa8
// @from(Ln 117306, Col 9)
BD5
// @from(Ln 117306, Col 14)
qa8
// @from(Ln 117307, Col 4)
Ka8 = v(() => {
    tO1();
    Aa8 = Object.create, BD5 = function() {
        function A() {}
        return function(q) {
            if (!Yu(q)) return {};
            if (Aa8) return Aa8(q);
            A.prototype = q;
            var K = new A;
            return A.prototype = void 0, K
        }
    }(), qa8 = BD5
})
// @from(Ln 117321, Col 0)
function mD5(A, q) {
    var K = -1,
        Y = A.length;
    q || (q = Array(Y));
    while (++K < Y) q[K] = A[K];
    return q
}
// @from(Ln 117328, Col 4)
Ya8
// @from(Ln 117329, Col 4)
za8 = v(() => {
    Ya8 = mD5
})
// @from(Ln 117332, Col 4)
FD5
// @from(Ln 117332, Col 9)
tAA
// @from(Ln 117333, Col 4)
wa8 = v(() => {
    an();
    FD5 = function() {
        try {
            var A = ZV(Object, "defineProperty");
            return A({}, "", {}), A
        } catch (q) {}
    }(), tAA = FD5
})
// @from(Ln 117343, Col 0)
function QD5(A, q) {
    var K = -1,
        Y = A == null ? 0 : A.length;
    while (++K < Y)
        if (q(A[K], K, A) === !1) break;
    return A
}
// @from(Ln 117350, Col 4)
Ha8
// @from(Ln 117351, Col 4)
$a8 = v(() => {
    Ha8 = QD5
})
// @from(Ln 117355, Col 0)
function pD5(A, q) {
    var K = typeof A;
    return q = q == null ? gD5 : q, !!q && (K == "number" || K != "symbol" && UD5.test(A)) && (A > -1 && A % 1 == 0 && A < q)
}
// @from(Ln 117359, Col 4)
gD5 = 9007199254740991
// @from(Ln 117360, Col 4)
UD5
// @from(Ln 117360, Col 9)
Oa8
// @from(Ln 117361, Col 4)
_a8 = v(() => {
    UD5 = /^(?:0|[1-9]\d*)$/;
    Oa8 = pD5
})
// @from(Ln 117366, Col 0)
function dD5(A, q, K) {
    if (q == "__proto__" && tAA) tAA(A, q, {
        configurable: !0,
        enumerable: !0,
        value: K,
        writable: !0
    });
    else A[q] = K
}
// @from(Ln 117375, Col 4)
y46
// @from(Ln 117376, Col 4)
eAA = v(() => {
    wa8();
    y46 = dD5
})
// @from(Ln 117381, Col 0)
function cD5(A, q) {
    return A === q || A !== A && q !== q
}
// @from(Ln 117384, Col 4)
C46
// @from(Ln 117385, Col 4)
A8A = v(() => {
    C46 = cD5
})
// @from(Ln 117389, Col 0)
function nD5(A, q, K) {
    var Y = A[q];
    if (!(iD5.call(A, q) && C46(Y, K)) || K === void 0 && !(q in A)) y46(A, q, K)
}
// @from(Ln 117393, Col 4)
lD5
// @from(Ln 117393, Col 9)
iD5
// @from(Ln 117393, Col 14)
S46
// @from(Ln 117394, Col 4)
q8A = v(() => {
    eAA();
    A8A();
    lD5 = Object.prototype, iD5 = lD5.hasOwnProperty;
    S46 = nD5
})
// @from(Ln 117401, Col 0)
function rD5(A, q, K, Y) {
    var z = !K;
    K || (K = {});
    var w = -1,
        H = q.length;
    while (++w < H) {
        var $ = q[w],
            O = Y ? Y(K[$], A[$], $, K, A) : void 0;
        if (O === void 0) O = A[$];
        if (z) y46(K, $, O);
        else S46(K, $, O)
    }
    return K
}
// @from(Ln 117415, Col 4)
sn
// @from(Ln 117416, Col 4)
Iy1 = v(() => {
    q8A();
    eAA();
    sn = rD5
})
// @from(Ln 117422, Col 0)
function aD5(A) {
    return typeof A == "number" && A > -1 && A % 1 == 0 && A <= oD5
}
// @from(Ln 117425, Col 4)
oD5 = 9007199254740991
// @from(Ln 117426, Col 4)
h46
// @from(Ln 117427, Col 4)
K8A = v(() => {
    h46 = aD5
})
// @from(Ln 117431, Col 0)
function sD5(A) {
    return A != null && h46(A.length) && !k46(A)
}
// @from(Ln 117434, Col 4)
I46
// @from(Ln 117435, Col 4)
Y8A = v(() => {
    aAA();
    K8A();
    I46 = sD5
})
// @from(Ln 117441, Col 0)
function eD5(A) {
    var q = A && A.constructor,
        K = typeof q == "function" && q.prototype || tD5;
    return A === K
}
// @from(Ln 117446, Col 4)
tD5
// @from(Ln 117446, Col 9)
eO1
// @from(Ln 117447, Col 4)
x46 = v(() => {
    tD5 = Object.prototype;
    eO1 = eD5
})
// @from(Ln 117452, Col 0)
function A05(A, q) {
    var K = -1,
        Y = Array(A);
    while (++K < A) Y[K] = q(K);
    return Y
}
// @from(Ln 117458, Col 4)
Ja8
// @from(Ln 117459, Col 4)
Xa8 = v(() => {
    Ja8 = A05
})
// @from(Ln 117463, Col 0)
function K05(A) {
    return Ku(A) && ug(A) == q05
}
// @from(Ln 117466, Col 4)
q05 = "[object Arguments]"
// @from(Ln 117467, Col 4)
z8A
// @from(Ln 117468, Col 4)
Da8 = v(() => {
    hy1();
    aO1();
    z8A = K05
})
// @from(Ln 117473, Col 4)
ja8
// @from(Ln 117473, Col 9)
Y05
// @from(Ln 117473, Col 14)
z05
// @from(Ln 117473, Col 19)
w05
// @from(Ln 117473, Col 24)
Ma8
// @from(Ln 117474, Col 4)
Pa8 = v(() => {
    Da8();
    aO1();
    ja8 = Object.prototype, Y05 = ja8.hasOwnProperty, z05 = ja8.propertyIsEnumerable, w05 = z8A(function() {
        return arguments
    }()) ? z8A : function(A) {
        return Ku(A) && Y05.call(A, "callee") && !z05.call(A, "callee")
    }, Ma8 = w05
})
// @from(Ln 117484, Col 0)
function H05() {
    return !1
}
// @from(Ln 117487, Col 4)
Wa8
// @from(Ln 117488, Col 4)
Ga8 = v(() => {
    Wa8 = H05
})
// @from(Ln 117491, Col 4)
u46 = {}
// @from(Ln 117495, Col 4)
Va8
// @from(Ln 117495, Col 9)
Za8
// @from(Ln 117495, Col 14)
$05
// @from(Ln 117495, Col 19)
fa8
// @from(Ln 117495, Col 24)
O05
// @from(Ln 117495, Col 29)
_05
// @from(Ln 117495, Col 34)
xy1
// @from(Ln 117496, Col 4)
w8A = v(() => {
    aC();
    Ga8();
    Va8 = typeof u46 == "object" && u46 && !u46.nodeType && u46, Za8 = Va8 && typeof b46 == "object" && b46 && !b46.nodeType && b46, $05 = Za8 && Za8.exports === Va8, fa8 = $05 ? PX.Buffer : void 0, O05 = fa8 ? fa8.isBuffer : void 0, _05 = O05 || Wa8, xy1 = _05
})
// @from(Ln 117502, Col 0)
function b05(A) {
    return Ku(A) && h46(A.length) && !!dH[ug(A)]
}
// @from(Ln 117505, Col 4)
J05 = "[object Arguments]"
// @from(Ln 117506, Col 4)
X05 = "[object Array]"
// @from(Ln 117507, Col 4)
D05 = "[object Boolean]"
// @from(Ln 117508, Col 4)
j05 = "[object Date]"
// @from(Ln 117509, Col 4)
M05 = "[object Error]"
// @from(Ln 117510, Col 4)
P05 = "[object Function]"
// @from(Ln 117511, Col 4)
W05 = "[object Map]"
// @from(Ln 117512, Col 4)
G05 = "[object Number]"
// @from(Ln 117513, Col 4)
Z05 = "[object Object]"
// @from(Ln 117514, Col 4)
f05 = "[object RegExp]"
// @from(Ln 117515, Col 4)
V05 = "[object Set]"
// @from(Ln 117516, Col 4)
N05 = "[object String]"
// @from(Ln 117517, Col 4)
T05 = "[object WeakMap]"
// @from(Ln 117518, Col 4)
v05 = "[object ArrayBuffer]"
// @from(Ln 117519, Col 4)
E05 = "[object DataView]"
// @from(Ln 117520, Col 4)
k05 = "[object Float32Array]"
// @from(Ln 117521, Col 4)
L05 = "[object Float64Array]"
// @from(Ln 117522, Col 4)
R05 = "[object Int8Array]"
// @from(Ln 117523, Col 4)
y05 = "[object Int16Array]"
// @from(Ln 117524, Col 4)
C05 = "[object Int32Array]"
// @from(Ln 117525, Col 4)
S05 = "[object Uint8Array]"
// @from(Ln 117526, Col 4)
h05 = "[object Uint8ClampedArray]"
// @from(Ln 117527, Col 4)
I05 = "[object Uint16Array]"
// @from(Ln 117528, Col 4)
x05 = "[object Uint32Array]"
// @from(Ln 117529, Col 4)
dH
// @from(Ln 117529, Col 8)
Na8
// @from(Ln 117530, Col 4)
Ta8 = v(() => {
    hy1();
    K8A();
    aO1();
    dH = {};
    dH[k05] = dH[L05] = dH[R05] = dH[y05] = dH[C05] = dH[S05] = dH[h05] = dH[I05] = dH[x05] = !0;
    dH[J05] = dH[X05] = dH[v05] = dH[D05] = dH[E05] = dH[j05] = dH[M05] = dH[P05] = dH[W05] = dH[G05] = dH[Z05] = dH[f05] = dH[V05] = dH[N05] = dH[T05] = !1;
    Na8 = b05
})
// @from(Ln 117540, Col 0)
function u05(A) {
    return function(q) {
        return A(q)
    }
}
// @from(Ln 117545, Col 4)
A_1
// @from(Ln 117546, Col 4)
B46 = v(() => {
    A_1 = u05
})
// @from(Ln 117549, Col 4)
F46 = {}
// @from(Ln 117553, Col 4)
va8
// @from(Ln 117553, Col 9)
by1
// @from(Ln 117553, Col 14)
B05
// @from(Ln 117553, Col 19)
H8A
// @from(Ln 117553, Col 24)
m05
// @from(Ln 117553, Col 29)
zu
// @from(Ln 117554, Col 4)
Q46 = v(() => {
    oAA();
    va8 = typeof F46 == "object" && F46 && !F46.nodeType && F46, by1 = va8 && typeof m46 == "object" && m46 && !m46.nodeType && m46, B05 = by1 && by1.exports === va8, H8A = B05 && T46.process, m05 = function() {
        try {
            var A = by1 && by1.require && by1.require("util").types;
            if (A) return A;
            return H8A && H8A.binding && H8A.binding("util")
        } catch (q) {}
    }(), zu = m05
})
// @from(Ln 117564, Col 4)
Ea8
// @from(Ln 117564, Col 9)
F05
// @from(Ln 117564, Col 14)
ka8
// @from(Ln 117565, Col 4)
La8 = v(() => {
    Ta8();
    B46();
    Q46();
    Ea8 = zu && zu.isTypedArray, F05 = Ea8 ? A_1(Ea8) : Na8, ka8 = F05
})
// @from(Ln 117572, Col 0)
function U05(A, q) {
    var K = sO1(A),
        Y = !K && Ma8(A),
        z = !K && !Y && xy1(A),
        w = !K && !Y && !z && ka8(A),
        H = K || Y || z || w,
        $ = H ? Ja8(A.length, String) : [],
        O = $.length;
    for (var _ in A)
        if ((q || g05.call(A, _)) && !(H && (_ == "length" || z && (_ == "offset" || _ == "parent") || w && (_ == "buffer" || _ == "byteLength" || _ == "byteOffset") || Oa8(_, O)))) $.push(_);
    return $
}
// @from(Ln 117584, Col 4)
Q05
// @from(Ln 117584, Col 9)
g05
// @from(Ln 117584, Col 14)
g46
// @from(Ln 117585, Col 4)
$8A = v(() => {
    Xa8();
    Pa8();
    E46();
    w8A();
    _a8();
    La8();
    Q05 = Object.prototype, g05 = Q05.hasOwnProperty;
    g46 = U05
})
// @from(Ln 117596, Col 0)
function p05(A, q) {
    return function(K) {
        return A(q(K))
    }
}
// @from(Ln 117601, Col 4)
U46
// @from(Ln 117602, Col 4)
O8A = v(() => {
    U46 = p05
})
// @from(Ln 117605, Col 4)
d05
// @from(Ln 117605, Col 9)
Ra8
// @from(Ln 117606, Col 4)
ya8 = v(() => {
    O8A();
    d05 = U46(Object.keys, Object), Ra8 = d05
})
// @from(Ln 117611, Col 0)
function i05(A) {
    if (!eO1(A)) return Ra8(A);
    var q = [];
    for (var K in Object(A))
        if (l05.call(A, K) && K != "constructor") q.push(K);
    return q
}
// @from(Ln 117618, Col 4)
c05
// @from(Ln 117618, Col 9)
l05
// @from(Ln 117618, Col 14)
Ca8
// @from(Ln 117619, Col 4)
Sa8 = v(() => {
    x46();
    ya8();
    c05 = Object.prototype, l05 = c05.hasOwnProperty;
    Ca8 = i05
})
// @from(Ln 117626, Col 0)
function n05(A) {
    return I46(A) ? g46(A) : Ca8(A)
}
// @from(Ln 117629, Col 4)
q_1
// @from(Ln 117630, Col 4)
p46 = v(() => {
    $8A();
    Sa8();
    Y8A();
    q_1 = n05
})
// @from(Ln 117637, Col 0)
function r05(A) {
    var q = [];
    if (A != null)
        for (var K in Object(A)) q.push(K);
    return q
}
// @from(Ln 117643, Col 4)
ha8
// @from(Ln 117644, Col 4)
Ia8 = v(() => {
    ha8 = r05
})
// @from(Ln 117648, Col 0)
function s05(A) {
    if (!Yu(A)) return ha8(A);
    var q = eO1(A),
        K = [];
    for (var Y in A)
        if (!(Y == "constructor" && (q || !a05.call(A, Y)))) K.push(Y);
    return K
}
// @from(Ln 117656, Col 4)
o05
// @from(Ln 117656, Col 9)
a05
// @from(Ln 117656, Col 14)
xa8
// @from(Ln 117657, Col 4)
ba8 = v(() => {
    tO1();
    x46();
    Ia8();
    o05 = Object.prototype, a05 = o05.hasOwnProperty;
    xa8 = s05
})
// @from(Ln 117665, Col 0)
function t05(A) {
    return I46(A) ? g46(A, !0) : xa8(A)
}
// @from(Ln 117668, Col 4)
K_1
// @from(Ln 117669, Col 4)
d46 = v(() => {
    $8A();
    ba8();
    Y8A();
    K_1 = t05
})
// @from(Ln 117675, Col 4)
e05
// @from(Ln 117675, Col 9)
mg
// @from(Ln 117676, Col 4)
uy1 = v(() => {
    an();
    e05 = ZV(Object, "create"), mg = e05
})
// @from(Ln 117681, Col 0)
function Aj5() {
    this.__data__ = mg ? mg(null) : {}, this.size = 0
}
// @from(Ln 117684, Col 4)
ua8
// @from(Ln 117685, Col 4)
Ba8 = v(() => {
    uy1();
    ua8 = Aj5
})
// @from(Ln 117690, Col 0)
function qj5(A) {
    var q = this.has(A) && delete this.__data__[A];
    return this.size -= q ? 1 : 0, q
}
// @from(Ln 117694, Col 4)
ma8
// @from(Ln 117695, Col 4)
Fa8 = v(() => {
    ma8 = qj5
})
// @from(Ln 117699, Col 0)
function wj5(A) {
    var q = this.__data__;
    if (mg) {
        var K = q[A];
        return K === Kj5 ? void 0 : K
    }
    return zj5.call(q, A) ? q[A] : void 0
}
// @from(Ln 117707, Col 4)
Kj5 = "__lodash_hash_undefined__"
// @from(Ln 117708, Col 4)
Yj5
// @from(Ln 117708, Col 9)
zj5
// @from(Ln 117708, Col 14)
Qa8
// @from(Ln 117709, Col 4)
ga8 = v(() => {
    uy1();
    Yj5 = Object.prototype, zj5 = Yj5.hasOwnProperty;
    Qa8 = wj5
})
// @from(Ln 117715, Col 0)
function Oj5(A) {
    var q = this.__data__;
    return mg ? q[A] !== void 0 : $j5.call(q, A)
}
// @from(Ln 117719, Col 4)
Hj5
// @from(Ln 117719, Col 9)
$j5
// @from(Ln 117719, Col 14)
Ua8
// @from(Ln 117720, Col 4)
pa8 = v(() => {
    uy1();
    Hj5 = Object.prototype, $j5 = Hj5.hasOwnProperty;
    Ua8 = Oj5
})
// @from(Ln 117726, Col 0)
function Jj5(A, q) {
    var K = this.__data__;
    return this.size += this.has(A) ? 0 : 1, K[A] = mg && q === void 0 ? _j5 : q, this
}
// @from(Ln 117730, Col 4)
_j5 = "__lodash_hash_undefined__"
// @from(Ln 117731, Col 4)
da8
// @from(Ln 117732, Col 4)
ca8 = v(() => {
    uy1();
    da8 = Jj5
})
// @from(Ln 117737, Col 0)
function Y_1(A) {
    var q = -1,
        K = A == null ? 0 : A.length;
    this.clear();
    while (++q < K) {
        var Y = A[q];
        this.set(Y[0], Y[1])
    }
}
// @from(Ln 117746, Col 4)
_8A
// @from(Ln 117747, Col 4)
la8 = v(() => {
    Ba8();
    Fa8();
    ga8();
    pa8();
    ca8();
    Y_1.prototype.clear = ua8;
    Y_1.prototype.delete = ma8;
    Y_1.prototype.get = Qa8;
    Y_1.prototype.has = Ua8;
    Y_1.prototype.set = da8;
    _8A = Y_1
})
// @from(Ln 117761, Col 0)
function Xj5() {
    this.__data__ = [], this.size = 0
}
// @from(Ln 117764, Col 4)
ia8
// @from(Ln 117765, Col 4)
na8 = v(() => {
    ia8 = Xj5
})
// @from(Ln 117769, Col 0)
function Dj5(A, q) {
    var K = A.length;
    while (K--)
        if (C46(A[K][0], q)) return K;
    return -1
}
// @from(Ln 117775, Col 4)
tn
// @from(Ln 117776, Col 4)
By1 = v(() => {
    A8A();
    tn = Dj5
})
// @from(Ln 117781, Col 0)
function Pj5(A) {
    var q = this.__data__,
        K = tn(q, A);
    if (K < 0) return !1;
    var Y = q.length - 1;
    if (K == Y) q.pop();
    else Mj5.call(q, K, 1);
    return --this.size, !0
}
// @from(Ln 117790, Col 4)
jj5
// @from(Ln 117790, Col 9)
Mj5
// @from(Ln 117790, Col 14)
ra8
// @from(Ln 117791, Col 4)
oa8 = v(() => {
    By1();
    jj5 = Array.prototype, Mj5 = jj5.splice;
    ra8 = Pj5
})
// @from(Ln 117797, Col 0)
function Wj5(A) {
    var q = this.__data__,
        K = tn(q, A);
    return K < 0 ? void 0 : q[K][1]
}
// @from(Ln 117802, Col 4)
aa8
// @from(Ln 117803, Col 4)
sa8 = v(() => {
    By1();
    aa8 = Wj5
})
// @from(Ln 117808, Col 0)
function Gj5(A) {
    return tn(this.__data__, A) > -1
}
// @from(Ln 117811, Col 4)
ta8
// @from(Ln 117812, Col 4)
ea8 = v(() => {
    By1();
    ta8 = Gj5
})
// @from(Ln 117817, Col 0)
function Zj5(A, q) {
    var K = this.__data__,
        Y = tn(K, A);
    if (Y < 0) ++this.size, K.push([A, q]);
    else K[Y][1] = q;
    return this
}
// @from(Ln 117824, Col 4)
As8
// @from(Ln 117825, Col 4)
qs8 = v(() => {
    By1();
    As8 = Zj5
})
// @from(Ln 117830, Col 0)
function z_1(A) {
    var q = -1,
        K = A == null ? 0 : A.length;
    this.clear();
    while (++q < K) {
        var Y = A[q];
        this.set(Y[0], Y[1])
    }
}
// @from(Ln 117839, Col 4)
en
// @from(Ln 117840, Col 4)
my1 = v(() => {
    na8();
    oa8();
    sa8();
    ea8();
    qs8();
    z_1.prototype.clear = ia8;
    z_1.prototype.delete = ra8;
    z_1.prototype.get = aa8;
    z_1.prototype.has = ta8;
    z_1.prototype.set = As8;
    en = z_1
})
// @from(Ln 117853, Col 4)
fj5
// @from(Ln 117853, Col 9)
Ar
// @from(Ln 117854, Col 4)
c46 = v(() => {
    an();
    aC();
    fj5 = ZV(PX, "Map"), Ar = fj5
})
// @from(Ln 117860, Col 0)
function Vj5() {
    this.size = 0, this.__data__ = {
        hash: new _8A,
        map: new(Ar || en),
        string: new _8A
    }
}
// @from(Ln 117867, Col 4)
Ks8
// @from(Ln 117868, Col 4)
Ys8 = v(() => {
    la8();
    my1();
    c46();
    Ks8 = Vj5
})
// @from(Ln 117875, Col 0)
function Nj5(A) {
    var q = typeof A;
    return q == "string" || q == "number" || q == "symbol" || q == "boolean" ? A !== "__proto__" : A === null
}
// @from(Ln 117879, Col 4)
zs8
// @from(Ln 117880, Col 4)
ws8 = v(() => {
    zs8 = Nj5
})
// @from(Ln 117884, Col 0)
function Tj5(A, q) {
    var K = A.__data__;
    return zs8(q) ? K[typeof q == "string" ? "string" : "hash"] : K.map
}
// @from(Ln 117888, Col 4)
qr
// @from(Ln 117889, Col 4)
Fy1 = v(() => {
    ws8();
    qr = Tj5
})
// @from(Ln 117894, Col 0)
function vj5(A) {
    var q = qr(this, A).delete(A);
    return this.size -= q ? 1 : 0, q
}
// @from(Ln 117898, Col 4)
Hs8
// @from(Ln 117899, Col 4)
$s8 = v(() => {
    Fy1();
    Hs8 = vj5
})
// @from(Ln 117904, Col 0)
function Ej5(A) {
    return qr(this, A).get(A)
}
// @from(Ln 117907, Col 4)
Os8
// @from(Ln 117908, Col 4)
_s8 = v(() => {
    Fy1();
    Os8 = Ej5
})
// @from(Ln 117913, Col 0)
function kj5(A) {
    return qr(this, A).has(A)
}
// @from(Ln 117916, Col 4)
Js8
// @from(Ln 117917, Col 4)
Xs8 = v(() => {
    Fy1();
    Js8 = kj5
})
// @from(Ln 117922, Col 0)
function Lj5(A, q) {
    var K = qr(this, A),
        Y = K.size;
    return K.set(A, q), this.size += K.size == Y ? 0 : 1, this
}
// @from(Ln 117927, Col 4)
Ds8
// @from(Ln 117928, Col 4)
js8 = v(() => {
    Fy1();
    Ds8 = Lj5
})
// @from(Ln 117933, Col 0)
function w_1(A) {
    var q = -1,
        K = A == null ? 0 : A.length;
    this.clear();
    while (++q < K) {
        var Y = A[q];
        this.set(Y[0], Y[1])
    }
}
// @from(Ln 117942, Col 4)
Ms8
// @from(Ln 117943, Col 4)
Ps8 = v(() => {
    Ys8();
    $s8();
    _s8();
    Xs8();
    js8();
    w_1.prototype.clear = Ks8;
    w_1.prototype.delete = Hs8;
    w_1.prototype.get = Os8;
    w_1.prototype.has = Js8;
    w_1.prototype.set = Ds8;
    Ms8 = w_1
})
// @from(Ln 117957, Col 0)
function Rj5(A, q) {
    var K = -1,
        Y = q.length,
        z = A.length;
    while (++K < Y) A[z + K] = q[K];
    return A
}
// @from(Ln 117964, Col 4)
l46
// @from(Ln 117965, Col 4)
J8A = v(() => {
    l46 = Rj5
})
// @from(Ln 117968, Col 4)
yj5
// @from(Ln 117968, Col 9)
i46
// @from(Ln 117969, Col 4)
X8A = v(() => {
    O8A();
    yj5 = U46(Object.getPrototypeOf, Object), i46 = yj5
})
// @from(Ln 117974, Col 0)
function Cj5() {
    this.__data__ = new en, this.size = 0
}
// @from(Ln 117977, Col 4)
Ws8
// @from(Ln 117978, Col 4)
Gs8 = v(() => {
    my1();
    Ws8 = Cj5
})
// @from(Ln 117983, Col 0)
function Sj5(A) {
    var q = this.__data__,
        K = q.delete(A);
    return this.size = q.size, K
}
// @from(Ln 117988, Col 4)
Zs8
// @from(Ln 117989, Col 4)
fs8 = v(() => {
    Zs8 = Sj5
})
// @from(Ln 117993, Col 0)
function hj5(A) {
    return this.__data__.get(A)
}
// @from(Ln 117996, Col 4)
Vs8
// @from(Ln 117997, Col 4)
Ns8 = v(() => {
    Vs8 = hj5
})
// @from(Ln 118001, Col 0)
function Ij5(A) {
    return this.__data__.has(A)
}
// @from(Ln 118004, Col 4)
Ts8
// @from(Ln 118005, Col 4)
vs8 = v(() => {
    Ts8 = Ij5
})
// @from(Ln 118009, Col 0)
function bj5(A, q) {
    var K = this.__data__;
    if (K instanceof en) {
        var Y = K.__data__;
        if (!Ar || Y.length < xj5 - 1) return Y.push([A, q]), this.size = ++K.size, this;
        K = this.__data__ = new Ms8(Y)
    }
    return K.set(A, q), this.size = K.size, this
}
// @from(Ln 118018, Col 4)
xj5 = 200
// @from(Ln 118019, Col 4)
Es8
// @from(Ln 118020, Col 4)
ks8 = v(() => {
    my1();
    c46();
    Ps8();
    Es8 = bj5
})
// @from(Ln 118027, Col 0)
function H_1(A) {
    var q = this.__data__ = new en(A);
    this.size = q.size
}
// @from(Ln 118031, Col 4)
Ls8
// @from(Ln 118032, Col 4)
Rs8 = v(() => {
    my1();
    Gs8();
    fs8();
    Ns8();
    vs8();
    ks8();
    H_1.prototype.clear = Ws8;
    H_1.prototype.delete = Zs8;
    H_1.prototype.get = Vs8;
    H_1.prototype.has = Ts8;
    H_1.prototype.set = Es8;
    Ls8 = H_1
})
// @from(Ln 118047, Col 0)
function uj5(A, q) {
    return A && sn(q, q_1(q), A)
}
// @from(Ln 118050, Col 4)
ys8
// @from(Ln 118051, Col 4)
Cs8 = v(() => {
    Iy1();
    p46();
    ys8 = uj5
})
// @from(Ln 118057, Col 0)
function Bj5(A, q) {
    return A && sn(q, K_1(q), A)
}
// @from(Ln 118060, Col 4)
Ss8
// @from(Ln 118061, Col 4)
hs8 = v(() => {
    Iy1();
    d46();
    Ss8 = Bj5
})
// @from(Ln 118066, Col 4)
r46 = {}
// @from(Ln 118071, Col 0)
function Fj5(A, q) {
    if (q) return A.slice();
    var K = A.length,
        Y = bs8 ? bs8(K) : new A.constructor(K);
    return A.copy(Y), Y
}
// @from(Ln 118077, Col 4)
us8
// @from(Ln 118077, Col 9)
Is8
// @from(Ln 118077, Col 14)
mj5
// @from(Ln 118077, Col 19)
xs8
// @from(Ln 118077, Col 24)
bs8
// @from(Ln 118077, Col 29)
D8A
// @from(Ln 118078, Col 4)
Bs8 = v(() => {
    aC();
    us8 = typeof r46 == "object" && r46 && !r46.nodeType && r46, Is8 = us8 && typeof n46 == "object" && n46 && !n46.nodeType && n46, mj5 = Is8 && Is8.exports === us8, xs8 = mj5 ? PX.Buffer : void 0, bs8 = xs8 ? xs8.allocUnsafe : void 0;
    D8A = Fj5
})
// @from(Ln 118084, Col 0)
function Qj5(A, q) {
    var K = -1,
        Y = A == null ? 0 : A.length,
        z = 0,
        w = [];
    while (++K < Y) {
        var H = A[K];
        if (q(H, K, A)) w[z++] = H
    }
    return w
}
// @from(Ln 118095, Col 4)
ms8
// @from(Ln 118096, Col 4)
Fs8 = v(() => {
    ms8 = Qj5
})
// @from(Ln 118100, Col 0)
function gj5() {
    return []
}
// @from(Ln 118103, Col 4)
o46
// @from(Ln 118104, Col 4)
j8A = v(() => {
    o46 = gj5
})
// @from(Ln 118107, Col 4)
Uj5
// @from(Ln 118107, Col 9)
pj5
// @from(Ln 118107, Col 14)
Qs8
// @from(Ln 118107, Col 19)
dj5
// @from(Ln 118107, Col 24)
$_1
// @from(Ln 118108, Col 4)
a46 = v(() => {
    Fs8();
    j8A();
    Uj5 = Object.prototype, pj5 = Uj5.propertyIsEnumerable, Qs8 = Object.getOwnPropertySymbols, dj5 = !Qs8 ? o46 : function(A) {
        if (A == null) return [];
        return A = Object(A), ms8(Qs8(A), function(q) {
            return pj5.call(A, q)
        })
    }, $_1 = dj5
})
// @from(Ln 118119, Col 0)
function cj5(A, q) {
    return sn(A, $_1(A), q)
}
// @from(Ln 118122, Col 4)
gs8
// @from(Ln 118123, Col 4)
Us8 = v(() => {
    Iy1();
    a46();
    gs8 = cj5
})
// @from(Ln 118128, Col 4)
lj5
// @from(Ln 118128, Col 9)
ij5
// @from(Ln 118128, Col 14)
s46
// @from(Ln 118129, Col 4)
M8A = v(() => {
    J8A();
    X8A();
    a46();
    j8A();
    lj5 = Object.getOwnPropertySymbols, ij5 = !lj5 ? o46 : function(A) {
        var q = [];
        while (A) l46(q, $_1(A)), A = i46(A);
        return q
    }, s46 = ij5
})
// @from(Ln 118141, Col 0)
function nj5(A, q) {
    return sn(A, s46(A), q)
}
// @from(Ln 118144, Col 4)
ps8
// @from(Ln 118145, Col 4)
ds8 = v(() => {
    Iy1();
    M8A();
    ps8 = nj5
})
// @from(Ln 118151, Col 0)
function rj5(A, q, K) {
    var Y = q(A);
    return sO1(A) ? Y : l46(Y, K(A))
}
// @from(Ln 118155, Col 4)
t46
// @from(Ln 118156, Col 4)
P8A = v(() => {
    J8A();
    E46();
    t46 = rj5
})
// @from(Ln 118162, Col 0)
function oj5(A) {
    return t46(A, q_1, $_1)
}
// @from(Ln 118165, Col 4)
cs8
// @from(Ln 118166, Col 4)
ls8 = v(() => {
    P8A();
    a46();
    p46();
    cs8 = oj5
})
// @from(Ln 118173, Col 0)
function aj5(A) {
    return t46(A, K_1, s46)
}
// @from(Ln 118176, Col 4)
is8
// @from(Ln 118177, Col 4)
ns8 = v(() => {
    P8A();
    M8A();
    d46();
    is8 = aj5
})
// @from(Ln 118183, Col 4)
sj5
// @from(Ln 118183, Col 9)
e46
// @from(Ln 118184, Col 4)
rs8 = v(() => {
    an();
    aC();
    sj5 = ZV(PX, "DataView"), e46 = sj5
})
// @from(Ln 118189, Col 4)
tj5
// @from(Ln 118189, Col 9)
Aq6
// @from(Ln 118190, Col 4)
os8 = v(() => {
    an();
    aC();
    tj5 = ZV(PX, "Promise"), Aq6 = tj5
})
// @from(Ln 118195, Col 4)
ej5
// @from(Ln 118195, Col 9)
qq6
// @from(Ln 118196, Col 4)
as8 = v(() => {
    an();
    aC();
    ej5 = ZV(PX, "Set"), qq6 = ej5
})
// @from(Ln 118201, Col 4)
ss8 = "[object Map]"
// @from(Ln 118202, Col 4)
AM5 = "[object Object]"
// @from(Ln 118203, Col 4)
ts8 = "[object Promise]"
// @from(Ln 118204, Col 4)
es8 = "[object Set]"
// @from(Ln 118205, Col 4)
At8 = "[object WeakMap]"
// @from(Ln 118206, Col 4)
qt8 = "[object DataView]"
// @from(Ln 118207, Col 4)
qM5
// @from(Ln 118207, Col 9)
KM5
// @from(Ln 118207, Col 14)
YM5
// @from(Ln 118207, Col 19)
zM5
// @from(Ln 118207, Col 24)
wM5
// @from(Ln 118207, Col 29)
U81
// @from(Ln 118207, Col 34)
O_1
// @from(Ln 118208, Col 4)
Kq6 = v(() => {
    rs8();
    c46();
    os8();
    as8();
    eo8();
    hy1();
    sAA();
    qM5 = Bg(e46), KM5 = Bg(Ar), YM5 = Bg(Aq6), zM5 = Bg(qq6), wM5 = Bg(R46), U81 = ug;
    if (e46 && U81(new e46(new ArrayBuffer(1))) != qt8 || Ar && U81(new Ar) != ss8 || Aq6 && U81(Aq6.resolve()) != ts8 || qq6 && U81(new qq6) != es8 || R46 && U81(new R46) != At8) U81 = function(A) {
        var q = ug(A),
            K = q == AM5 ? A.constructor : void 0,
            Y = K ? Bg(K) : "";
        if (Y) switch (Y) {
            case qM5:
                return qt8;
            case KM5:
                return ss8;
            case YM5:
                return ts8;
            case zM5:
                return es8;
            case wM5:
                return At8
        }
        return q
    };
    O_1 = U81
})
// @from(Ln 118238, Col 0)
function OM5(A) {
    var q = A.length,
        K = new A.constructor(q);
    if (q && typeof A[0] == "string" && $M5.call(A, "index")) K.index = A.index, K.input = A.input;
    return K
}
// @from(Ln 118244, Col 4)
HM5
// @from(Ln 118244, Col 9)
$M5
// @from(Ln 118244, Col 14)
Kt8
// @from(Ln 118245, Col 4)
Yt8 = v(() => {
    HM5 = Object.prototype, $M5 = HM5.hasOwnProperty;
    Kt8 = OM5
})
// @from(Ln 118249, Col 4)
_M5
// @from(Ln 118249, Col 9)
W8A
// @from(Ln 118250, Col 4)
zt8 = v(() => {
    aC();
    _M5 = PX.Uint8Array, W8A = _M5
})
// @from(Ln 118255, Col 0)
function JM5(A) {
    var q = new A.constructor(A.byteLength);
    return new W8A(q).set(new W8A(A)), q
}
// @from(Ln 118259, Col 4)
__1
// @from(Ln 118260, Col 4)
Yq6 = v(() => {
    zt8();
    __1 = JM5
})
// @from(Ln 118265, Col 0)
function XM5(A, q) {
    var K = q ? __1(A.buffer) : A.buffer;
    return new A.constructor(K, A.byteOffset, A.byteLength)
}
// @from(Ln 118269, Col 4)
wt8
// @from(Ln 118270, Col 4)
Ht8 = v(() => {
    Yq6();
    wt8 = XM5
})
// @from(Ln 118275, Col 0)
function jM5(A) {
    var q = new A.constructor(A.source, DM5.exec(A));
    return q.lastIndex = A.lastIndex, q
}
// @from(Ln 118279, Col 4)
DM5
// @from(Ln 118279, Col 9)
$t8
// @from(Ln 118280, Col 4)
Ot8 = v(() => {
    DM5 = /\w*$/;
    $t8 = jM5
})
// @from(Ln 118285, Col 0)
function MM5(A) {
    return Jt8 ? Object(Jt8.call(A)) : {}
}
// @from(Ln 118288, Col 4)
_t8
// @from(Ln 118288, Col 9)
Jt8
// @from(Ln 118288, Col 14)
Xt8
// @from(Ln 118289, Col 4)
Dt8 = v(() => {
    v46();
    _t8 = bg ? bg.prototype : void 0, Jt8 = _t8 ? _t8.valueOf : void 0;
    Xt8 = MM5
})
// @from(Ln 118295, Col 0)
function PM5(A, q) {
    var K = q ? __1(A.buffer) : A.buffer;
    return new A.constructor(K, A.byteOffset, A.length)
}
// @from(Ln 118299, Col 4)
jt8
// @from(Ln 118300, Col 4)
Mt8 = v(() => {
    Yq6();
    jt8 = PM5
})
// @from(Ln 118305, Col 0)
function uM5(A, q, K) {
    var Y = A.constructor;
    switch (q) {
        case EM5:
            return __1(A);
        case WM5:
        case GM5:
            return new Y(+A);
        case kM5:
            return wt8(A, K);
        case LM5:
        case RM5:
        case yM5:
        case CM5:
        case SM5:
        case hM5:
        case IM5:
        case xM5:
        case bM5:
            return jt8(A, K);
        case ZM5:
            return new Y;
        case fM5:
        case TM5:
            return new Y(A);
        case VM5:
            return $t8(A);
        case NM5:
            return new Y;
        case vM5:
            return Xt8(A)
    }
}
// @from(Ln 118338, Col 4)
WM5 = "[object Boolean]"
// @from(Ln 118339, Col 4)
GM5 = "[object Date]"
// @from(Ln 118340, Col 4)
ZM5 = "[object Map]"
// @from(Ln 118341, Col 4)
fM5 = "[object Number]"
// @from(Ln 118342, Col 4)
VM5 = "[object RegExp]"
// @from(Ln 118343, Col 4)
NM5 = "[object Set]"
// @from(Ln 118344, Col 4)
TM5 = "[object String]"
// @from(Ln 118345, Col 4)
vM5 = "[object Symbol]"
// @from(Ln 118346, Col 4)
EM5 = "[object ArrayBuffer]"
// @from(Ln 118347, Col 4)
kM5 = "[object DataView]"
// @from(Ln 118348, Col 4)
LM5 = "[object Float32Array]"
// @from(Ln 118349, Col 4)
RM5 = "[object Float64Array]"
// @from(Ln 118350, Col 4)
yM5 = "[object Int8Array]"
// @from(Ln 118351, Col 4)
CM5 = "[object Int16Array]"
// @from(Ln 118352, Col 4)
SM5 = "[object Int32Array]"
// @from(Ln 118353, Col 4)
hM5 = "[object Uint8Array]"
// @from(Ln 118354, Col 4)
IM5 = "[object Uint8ClampedArray]"
// @from(Ln 118355, Col 4)
xM5 = "[object Uint16Array]"
// @from(Ln 118356, Col 4)
bM5 = "[object Uint32Array]"
// @from(Ln 118357, Col 4)
Pt8
// @from(Ln 118358, Col 4)
Wt8 = v(() => {
    Yq6();
    Ht8();
    Ot8();
    Dt8();
    Mt8();
    Pt8 = uM5
})
// @from(Ln 118367, Col 0)
function BM5(A) {
    return typeof A.constructor == "function" && !eO1(A) ? qa8(i46(A)) : {}
}
// @from(Ln 118370, Col 4)
Gt8
// @from(Ln 118371, Col 4)
Zt8 = v(() => {
    Ka8();
    X8A();
    x46();
    Gt8 = BM5
})
// @from(Ln 118378, Col 0)
function FM5(A) {
    return Ku(A) && O_1(A) == mM5
}
// @from(Ln 118381, Col 4)
mM5 = "[object Map]"
// @from(Ln 118382, Col 4)
ft8
// @from(Ln 118383, Col 4)
Vt8 = v(() => {
    Kq6();
    aO1();
    ft8 = FM5
})
// @from(Ln 118388, Col 4)
Nt8
// @from(Ln 118388, Col 9)
QM5
// @from(Ln 118388, Col 14)
Tt8
// @from(Ln 118389, Col 4)
vt8 = v(() => {
    Vt8();
    B46();
    Q46();
    Nt8 = zu && zu.isMap, QM5 = Nt8 ? A_1(Nt8) : ft8, Tt8 = QM5
})
// @from(Ln 118396, Col 0)
function UM5(A) {
    return Ku(A) && O_1(A) == gM5
}
// @from(Ln 118399, Col 4)
gM5 = "[object Set]"
// @from(Ln 118400, Col 4)
Et8
// @from(Ln 118401, Col 4)
kt8 = v(() => {
    Kq6();
    aO1();
    Et8 = UM5
})
// @from(Ln 118406, Col 4)
Lt8
// @from(Ln 118406, Col 9)
pM5
// @from(Ln 118406, Col 14)
Rt8
// @from(Ln 118407, Col 4)
yt8 = v(() => {
    kt8();
    B46();
    Q46();
    Lt8 = zu && zu.isSet, pM5 = Lt8 ? A_1(Lt8) : Et8, Rt8 = pM5
})
// @from(Ln 118414, Col 0)
function zq6(A, q, K, Y, z, w) {
    var H, $ = q & dM5,
        O = q & cM5,
        _ = q & lM5;
    if (K) H = z ? K(A, Y, z, w) : K(A);
    if (H !== void 0) return H;
    if (!Yu(A)) return A;
    var J = sO1(A);
    if (J) {
        if (H = Kt8(A), !$) return Ya8(A, H)
    } else {
        var X = O_1(A),
            D = X == St8 || X == aM5;
        if (xy1(A)) return D8A(A, $);
        if (X == ht8 || X == Ct8 || D && !z) {
            if (H = O || D ? {} : Gt8(A), !$) return O ? ps8(A, Ss8(H, A)) : gs8(A, ys8(H, A))
        } else {
            if (!OH[X]) return z ? A : {};
            H = Pt8(A, X, $)
        }
    }
    w || (w = new Ls8);
    var j = w.get(A);
    if (j) return j;
    if (w.set(A, H), Rt8(A)) A.forEach(function(W) {
        H.add(zq6(W, q, K, W, A, w))
    });
    else if (Tt8(A)) A.forEach(function(W, G) {
        H.set(G, zq6(W, q, K, G, A, w))
    });
    var M = _ ? O ? is8 : cs8 : O ? K_1 : q_1,
        P = J ? void 0 : M(A);
    return Ha8(P || A, function(W, G) {
        if (P) G = W, W = A[G];
        S46(H, G, zq6(W, q, K, G, A, w))
    }), H
}
// @from(Ln 118451, Col 4)
dM5 = 1
// @from(Ln 118452, Col 4)
cM5 = 2
// @from(Ln 118453, Col 4)
lM5 = 4
// @from(Ln 118454, Col 4)
Ct8 = "[object Arguments]"
// @from(Ln 118455, Col 4)
iM5 = "[object Array]"
// @from(Ln 118456, Col 4)
nM5 = "[object Boolean]"
// @from(Ln 118457, Col 4)
rM5 = "[object Date]"
// @from(Ln 118458, Col 4)
oM5 = "[object Error]"
// @from(Ln 118459, Col 4)
St8 = "[object Function]"
// @from(Ln 118460, Col 4)
aM5 = "[object GeneratorFunction]"
// @from(Ln 118461, Col 4)
sM5 = "[object Map]"
// @from(Ln 118462, Col 4)
tM5 = "[object Number]"
// @from(Ln 118463, Col 4)
ht8 = "[object Object]"
// @from(Ln 118464, Col 4)
eM5 = "[object RegExp]"
// @from(Ln 118465, Col 4)
AP5 = "[object Set]"
// @from(Ln 118466, Col 4)
qP5 = "[object String]"
// @from(Ln 118467, Col 4)
KP5 = "[object Symbol]"
// @from(Ln 118468, Col 4)
YP5 = "[object WeakMap]"
// @from(Ln 118469, Col 4)
zP5 = "[object ArrayBuffer]"
// @from(Ln 118470, Col 4)
wP5 = "[object DataView]"
// @from(Ln 118471, Col 4)
HP5 = "[object Float32Array]"
// @from(Ln 118472, Col 4)
$P5 = "[object Float64Array]"
// @from(Ln 118473, Col 4)
OP5 = "[object Int8Array]"
// @from(Ln 118474, Col 4)
_P5 = "[object Int16Array]"
// @from(Ln 118475, Col 4)
JP5 = "[object Int32Array]"
// @from(Ln 118476, Col 4)
XP5 = "[object Uint8Array]"
// @from(Ln 118477, Col 4)
DP5 = "[object Uint8ClampedArray]"
// @from(Ln 118478, Col 4)
jP5 = "[object Uint16Array]"
// @from(Ln 118479, Col 4)
MP5 = "[object Uint32Array]"
// @from(Ln 118480, Col 4)
OH
// @from(Ln 118480, Col 8)
It8
// @from(Ln 118481, Col 4)
xt8 = v(() => {
    Rs8();
    $a8();
    q8A();
    Cs8();
    hs8();
    Bs8();
    za8();
    Us8();
    ds8();
    ls8();
    ns8();
    Kq6();
    Yt8();
    Wt8();
    Zt8();
    E46();
    w8A();
    vt8();
    tO1();
    yt8();
    p46();
    d46();
    OH = {};
    OH[Ct8] = OH[iM5] = OH[zP5] = OH[wP5] = OH[nM5] = OH[rM5] = OH[HP5] = OH[$P5] = OH[OP5] = OH[_P5] = OH[JP5] = OH[sM5] = OH[tM5] = OH[ht8] = OH[eM5] = OH[AP5] = OH[qP5] = OH[KP5] = OH[XP5] = OH[DP5] = OH[jP5] = OH[MP5] = !0;
    OH[oM5] = OH[St8] = OH[YP5] = !1;
    It8 = zq6
})
// @from(Ln 118510, Col 0)
function GP5(A) {
    return It8(A, PP5 | WP5)
}
// @from(Ln 118513, Col 4)
PP5 = 1
// @from(Ln 118514, Col 4)
WP5 = 4
// @from(Ln 118515, Col 4)
G8A
// @from(Ln 118516, Col 4)
bt8 = v(() => {
    xt8();
    G8A = GP5
})
// @from(Ln 118520, Col 4)
ut8 = v(() => {
    bt8()
})
// @from(Ln 118525, Col 0)
function Z8A() {
    if (process.platform !== "linux") return;
    try {
        let A = Bt8.readFileSync("/proc/version", {
                encoding: "utf8"
            }),
            q = A.match(/WSL(\d+)/i);
        if (q && q[1]) return q[1];
        if (A.toLowerCase().includes("microsoft")) return "1";
        return
    } catch {
        return
    }
}
// @from(Ln 118540, Col 0)
function wL() {
    switch (process.platform) {
        case "darwin":
            return "macos";
        case "linux":
            return "linux";
        case "win32":
            return "windows";
        default:
            return "unknown"
    }
}
// @from(Ln 118552, Col 4)
wq6 = () => {}
// @from(Ln 118556, Col 0)
async function mt8(A, q, K, Y = {
    command: "rg"
}) {
    let {
        command: z,
        args: w = []
    } = Y;
    return new Promise((H, $) => {
        ZP5(z, [...w, ...A, q], {
            maxBuffer: 20000000,
            signal: K,
            timeout: 1e4
        }, (O, _, J) => {
            if (!O) {
                H(_.trim().split(`
`).filter(Boolean));
                return
            }
            if (O.code === 1) {
                H([]);
                return
            }
            $(Error(`ripgrep failed with exit code ${O.code}: ${J||O.message}`))
        })
    })
}
// @from(Ln 118582, Col 4)
Ft8 = () => {}
// @from(Ln 118589, Col 0)
function Hq6() {
    return [...fP5.filter((A) => A !== ".git"), ".claude/commands", ".claude/agents"]
}
// @from(Ln 118593, Col 0)
function N8A(A) {
    return A.toLowerCase()
}
// @from(Ln 118597, Col 0)
function sC(A) {
    return A.includes("*") || A.includes("?") || A.includes("[") || A.includes("]")
}
// @from(Ln 118601, Col 0)
function gy1(A) {
    return A.replace(/\/\*\*$/, "")
}
// @from(Ln 118605, Col 0)
function Qt8(A, q) {
    let K = sT.normalize(A),
        Y = sT.normalize(q);
    if (Y === K) return !1;
    if (K.startsWith("/tmp/") && Y === "/private" + K) return !1;
    if (K.startsWith("/var/") && Y === "/private" + K) return !1;
    if (K.startsWith("/private/tmp/") && Y === K) return !1;
    if (K.startsWith("/private/var/") && Y === K) return !1;
    if (Y === "/") return !0;
    if (Y.split("/").filter(Boolean).length <= 1) return !0;
    if (K.startsWith(Y + "/")) return !0;
    let w = K;
    if (K.startsWith("/tmp/")) w = "/private" + K;
    else if (K.startsWith("/var/")) w = "/private" + K;
    if (w !== K && w.startsWith(Y + "/")) return !0;
    let H = Y.startsWith(K + "/"),
        $ = w !== K && Y.startsWith(w + "/");
    if (Y !== K && !(w !== K && Y === w) && !H && !$) return !0;
    return !1
}
// @from(Ln 118626, Col 0)
function tC(A) {
    let q = process.cwd(),
        K = A;
    if (A === "~") K = f8A();
    else if (A.startsWith("~/")) K = f8A() + A.slice(1);
    else if (A.startsWith("./") || A.startsWith("../")) K = sT.resolve(q, A);
    else if (!sT.isAbsolute(A)) K = sT.resolve(q, A);
    if (sC(K)) {
        let Y = K.split(/[*?[\]]/)[0];
        if (Y && Y !== "/") {
            let z = Y.endsWith("/") ? Y.slice(0, -1) : sT.dirname(Y);
            try {
                let w = V8A.realpathSync(z);
                if (!Qt8(z, w)) {
                    let H = K.slice(z.length);
                    return w + H
                }
            } catch {}
        }
        return K
    }
    try {
        let Y = V8A.realpathSync(K);
        if (Qt8(K, Y));
        else K = Y
    } catch {}
    return K
}
// @from(Ln 118655, Col 0)
function Uy1() {
    let A = f8A();
    return ["/dev/stdout", "/dev/stderr", "/dev/null", "/dev/tty", "/dev/dtracehelper", "/dev/autofs_nowait", "/tmp/claude", "/private/tmp/claude", sT.join(A, ".npm/_logs"), sT.join(A, ".claude/debug")]
}
// @from(Ln 118660, Col 0)
function $q6(A, q) {
    let Y = ["SANDBOX_RUNTIME=1", `TMPDIR=${process.env.CLAUDE_TMPDIR||"/tmp/claude"}`];
    if (!A && !q) return Y;
    let z = ["localhost", "127.0.0.1", "::1", "*.local", ".local", "169.254.0.0/16", "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"].join(",");
    if (Y.push(`NO_PROXY=${z}`), Y.push(`no_proxy=${z}`), A) Y.push(`HTTP_PROXY=http://localhost:${A}`), Y.push(`HTTPS_PROXY=http://localhost:${A}`), Y.push(`http_proxy=http://localhost:${A}`), Y.push(`https_proxy=http://localhost:${A}`);
    if (q) {
        if (Y.push(`ALL_PROXY=socks5h://localhost:${q}`), Y.push(`all_proxy=socks5h://localhost:${q}`), wL() === "macos") Y.push(`GIT_SSH_COMMAND=ssh -o ProxyCommand='nc -X 5 -x localhost:${q} %h %p'`);
        if (Y.push(`FTP_PROXY=socks5h://localhost:${q}`), Y.push(`ftp_proxy=socks5h://localhost:${q}`), Y.push(`RSYNC_PROXY=localhost:${q}`), Y.push(`DOCKER_HTTP_PROXY=http://localhost:${A||q}`), Y.push(`DOCKER_HTTPS_PROXY=http://localhost:${A||q}`), A) Y.push("CLOUDSDK_PROXY_TYPE=https"), Y.push("CLOUDSDK_PROXY_ADDRESS=localhost"), Y.push(`CLOUDSDK_PROXY_PORT=${A}`);
        Y.push(`GRPC_PROXY=socks5h://localhost:${q}`), Y.push(`grpc_proxy=socks5h://localhost:${q}`)
    }
    return Y
}
// @from(Ln 118673, Col 0)
function Oq6(A) {
    let q = A.slice(0, 100);
    return Buffer.from(q).toString("base64")
}
// @from(Ln 118678, Col 0)
function gt8(A) {
    return Buffer.from(A, "base64").toString("utf8")
}
// @from(Ln 118681, Col 4)
Qy1
// @from(Ln 118681, Col 9)
fP5
// @from(Ln 118682, Col 4)
J_1 = v(() => {
    wq6();
    Qy1 = [".gitconfig", ".gitmodules", ".bashrc", ".bash_profile", ".zshrc", ".zprofile", ".profile", ".ripgreprc", ".mcp.json"], fP5 = [".git", ".vscode", ".idea"]
})
// @from(Ln 118701, Col 0)
function Ut8() {
    if (E8A) return E8A;
    let A = [];
    try {
        let K = TP5("npm root -g", {
            encoding: "utf8",
            timeout: 5000,
            stdio: ["pipe", "pipe", "ignore"]
        }).trim();
        if (K) A.push(HL(K, "@anthropic-ai", "sandbox-runtime"))
    } catch {}
    let q = vP5();
    return A.push(HL("/usr", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), HL("/usr", "local", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), HL("/opt", "homebrew", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), HL(q, ".npm", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), HL(q, ".npm-global", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime")), E8A = A, A
}
// @from(Ln 118716, Col 0)
function k8A() {
    let A = process.arch;
    switch (A) {
        case "x64":
        case "x86_64":
            return "x64";
        case "arm64":
        case "aarch64":
            return "arm64";
        case "ia32":
        case "x86":
            return L8("[SeccompFilter] 32-bit x86 (ia32) is not currently supported due to missing socketcall() syscall blocking. The current seccomp filter only blocks socket(AF_UNIX, ...), but on 32-bit x86, socketcall() can be used to bypass this.", {
                level: "error"
            }), null;
        default:
            return L8(`[SeccompFilter] Unsupported architecture: ${A}. Only x64 and arm64 are supported.`), null
    }
}
// @from(Ln 118735, Col 0)
function pt8(A) {
    let q = k8A();
    if (!q) return [];
    let K = VP5(NP5(import.meta.url)),
        Y = HL("vendor", "seccomp", q, A);
    return [HL(K, Y), HL(K, "..", "..", Y), HL(K, "..", Y)]
}
// @from(Ln 118743, Col 0)
function L8A(A) {
    let q = A ?? "";
    if (T8A.has(q)) return T8A.get(q);
    let K = EP5(A);
    return T8A.set(q, K), K
}
// @from(Ln 118750, Col 0)
function EP5(A) {
    if (A) {
        if (p81.existsSync(A)) return L8(`[SeccompFilter] Using BPF filter from explicit path: ${A}`), A;
        L8(`[SeccompFilter] Explicit path provided but file not found: ${A}`)
    }
    let q = k8A();
    if (!q) return L8(`[SeccompFilter] Cannot find pre-generated BPF filter: unsupported architecture ${process.arch}`), null;
    L8(`[SeccompFilter] Detected architecture: ${q}`);
    for (let K of pt8("unix-block.bpf"))
        if (p81.existsSync(K)) return L8(`[SeccompFilter] Found pre-generated BPF filter: ${K} (${q})`), K;
    for (let K of Ut8()) {
        let Y = HL(K, "vendor", "seccomp", q, "unix-block.bpf");
        if (p81.existsSync(Y)) return L8(`[SeccompFilter] Found pre-generated BPF filter in global install: ${Y} (${q})`), Y
    }
    return L8(`[SeccompFilter] Pre-generated BPF filter not found in any expected location (${q})`), null
}
// @from(Ln 118767, Col 0)
function py1(A) {
    let q = A ?? "";
    if (v8A.has(q)) return v8A.get(q);
    let K = kP5(A);
    return v8A.set(q, K), K
}
// @from(Ln 118774, Col 0)
function kP5(A) {
    if (A) {
        if (p81.existsSync(A)) return L8(`[SeccompFilter] Using apply-seccomp binary from explicit path: ${A}`), A;
        L8(`[SeccompFilter] Explicit path provided but file not found: ${A}`)
    }
    let q = k8A();
    if (!q) return L8(`[SeccompFilter] Cannot find apply-seccomp binary: unsupported architecture ${process.arch}`), null;
    L8(`[SeccompFilter] Looking for apply-seccomp binary for architecture: ${q}`);
    for (let K of pt8("apply-seccomp"))
        if (p81.existsSync(K)) return L8(`[SeccompFilter] Found apply-seccomp binary: ${K} (${q})`), K;
    for (let K of Ut8()) {
        let Y = HL(K, "vendor", "seccomp", q, "apply-seccomp");
        if (p81.existsSync(Y)) return L8(`[SeccompFilter] Found apply-seccomp binary in global install: ${Y} (${q})`), Y
    }
    return L8(`[SeccompFilter] apply-seccomp binary not found in any expected location (${q})`), null
}
// @from(Ln 118791, Col 0)
function dt8(A) {
    let q = L8A(A);
    if (q) return L8("[SeccompFilter] Using pre-generated BPF filter"), q;
    return L8("[SeccompFilter] Pre-generated BPF filter not available for this architecture. Only x64 and arm64 are supported.", {
        level: "error"
    }), null
}
// @from(Ln 118799, Col 0)
function R8A(A) {}
// @from(Ln 118800, Col 4)
T8A
// @from(Ln 118800, Col 9)
v8A
// @from(Ln 118800, Col 14)
E8A = null
// @from(Ln 118801, Col 4)
ct8 = v(() => {
    T8A = new Map, v8A = new Map
})
// @from(Ln 118819, Col 0)
function RP5(A, q) {
    let K = A.split($L.sep),
        Y = "";
    for (let z of K) {
        if (!z) continue;
        let w = Y + $L.sep + z;
        try {
            if (tT.lstatSync(w).isSymbolicLink()) {
                if (q.some((O) => w.startsWith(O + "/") || w === O)) return w
            }
        } catch {
            break
        }
        Y = w
    }
    return null
}
// @from(Ln 118836, Col 0)
async function yP5(A = {
    command: "rg"
}, q = S8A, K = !1, Y) {
    let z = process.cwd(),
        w = new AbortController,
        H = Y ?? w.signal,
        $ = Hq6(),
        O = [...Qy1.map((X) => $L.resolve(z, X)), ...$.map((X) => $L.resolve(z, X)), $L.resolve(z, ".git/hooks")];
    if (!K) O.push($L.resolve(z, ".git/config"));
    let _ = [];
    for (let X of Qy1) _.push("--iglob", X);
    for (let X of $) _.push("--iglob", `**/${X}/**`);
    if (_.push("--iglob", "**/.git/hooks/**"), !K) _.push("--iglob", "**/.git/config");
    let J = [];
    try {
        J = await mt8(["--files", "--hidden", "--max-depth", String(q), ..._, "-g", "!**/node_modules/**"], z, H, A)
    } catch (X) {
        L8(`[Sandbox] ripgrep scan failed: ${X}`)
    }
    for (let X of J) {
        let D = $L.resolve(z, X),
            j = !1;
        for (let M of [...$, ".git"]) {
            let P = N8A(M),
                W = D.split($L.sep),
                G = W.findIndex((f) => N8A(f) === P);
            if (G !== -1) {
                if (M === ".git") {
                    let f = W.slice(0, G + 1).join($L.sep);
                    if (X.includes(".git/hooks")) O.push($L.join(f, "hooks"));
                    else if (X.includes(".git/config")) O.push($L.join(f, "config"))
                } else O.push(W.slice(0, G + 1).join($L.sep));
                j = !0;
                break
            }
        }
        if (!j) O.push(D)
    }
    return [...new Set(O)]
}
// @from(Ln 118877, Col 0)
function CP5() {
    if (rt8) return;
    process.on("exit", () => {
        for (let A of C8A) try {
            R8A(A)
        } catch {}
    }), rt8 = !0
}
// @from(Ln 118886, Col 0)
function ot8(A) {
    let q = [],
        K = [],
        Y = y8A("which", ["bwrap"], {
            stdio: "ignore",
            timeout: 1000
        }),
        z = y8A("which", ["socat"], {
            stdio: "ignore",
            timeout: 1000
        });
    if (Y.status !== 0) q.push("bubblewrap (bwrap) not installed");
    if (z.status !== 0) q.push("socat not installed");
    let w = L8A(A?.bpfPath) !== null,
        H = py1(A?.applyPath) !== null;
    if (!w || !H) K.push("seccomp not available - unix socket access not restricted");
    return {
        warnings: K,
        errors: q
    }
}
// @from(Ln 118907, Col 0)
async function at8(A, q) {
    let K = LP5(8).toString("hex"),
        Y = nt8(it8(), `claude-http-${K}.sock`),
        z = nt8(it8(), `claude-socks-${K}.sock`),
        w = [`UNIX-LISTEN:${Y},fork,reuseaddr`, `TCP:localhost:${A},keepalive,keepidle=10,keepintvl=5,keepcnt=3`];
    L8(`Starting HTTP bridge: socat ${w.join(" ")}`);
    let H = lt8("socat", w, {
        stdio: "ignore"
    });
    if (!H.pid) throw Error("Failed to start HTTP bridge process");
    H.on("error", (J) => {
        L8(`HTTP bridge process error: ${J}`, {
            level: "error"
        })
    }), H.on("exit", (J, X) => {
        L8(`HTTP bridge process exited with code ${J}, signal ${X}`, {
            level: J === 0 ? "info" : "error"
        })
    });
    let $ = [`UNIX-LISTEN:${z},fork,reuseaddr`, `TCP:localhost:${q},keepalive,keepidle=10,keepintvl=5,keepcnt=3`];
    L8(`Starting SOCKS bridge: socat ${$.join(" ")}`);
    let O = lt8("socat", $, {
        stdio: "ignore"
    });
    if (!O.pid) {
        if (H.pid) try {
            process.kill(H.pid, "SIGTERM")
        } catch {}
        throw Error("Failed to start SOCKS bridge process")
    }
    O.on("error", (J) => {
        L8(`SOCKS bridge process error: ${J}`, {
            level: "error"
        })
    }), O.on("exit", (J, X) => {
        L8(`SOCKS bridge process exited with code ${J}, signal ${X}`, {
            level: J === 0 ? "info" : "error"
        })
    });
    let _ = 5;
    for (let J = 0; J < _; J++) {
        if (!H.pid || H.killed || !O.pid || O.killed) throw Error("Linux bridge process died unexpectedly");
        try {
            if (tT.existsSync(Y) && tT.existsSync(z)) {
                L8(`Linux bridges ready after ${J+1} attempts`);
                break
            }
        } catch (X) {
            L8(`Error checking sockets (attempt ${J+1}): ${X}`, {
                level: "error"
            })
        }
        if (J === _ - 1) {
            if (H.pid) try {
                process.kill(H.pid, "SIGTERM")
            } catch {}
            if (O.pid) try {
                process.kill(O.pid, "SIGTERM")
            } catch {}
            throw Error(`Failed to create bridge sockets after ${_} attempts`)
        }
        await new Promise((X) => setTimeout(X, J * 100))
    }
    return {
        httpSocketPath: Y,
        socksSocketPath: z,
        httpBridgeProcess: H,
        socksBridgeProcess: O,
        httpProxyPort: A,
        socksProxyPort: q
    }
}
// @from(Ln 118980, Col 0)
function SP5(A, q, K, Y, z, w) {
    let H = z || "bash",
        $ = [`socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:${A} >/dev/null 2>&1 &`, `socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:${q} >/dev/null 2>&1 &`, 'trap "kill %1 %2 2>/dev/null; exit" EXIT'];
    if (Y) {
        let O = py1(w);
        if (!O) throw Error("apply-seccomp binary not found. This should have been caught earlier. Ensure vendor/seccomp/{x64,arm64}/apply-seccomp binaries are included in the package.");
        let _ = d81.default.quote([O, Y, H, "-c", K]),
            J = [...$, _].join(`
`);
        return `${H} -c ${d81.default.quote([J])}`
    } else {
        let O = [...$, `eval ${d81.default.quote([K])}`].join(`
`);
        return `${H} -c ${d81.default.quote([O])}`
    }
}
// @from(Ln 118996, Col 0)
async function hP5(A, q, K = {
    command: "rg"
}, Y = S8A, z = !1, w) {
    let H = [];
    if (q) {
        H.push("--ro-bind", "/", "/");
        let O = [];
        for (let J of q.allowOnly || []) {
            let X = tC(J);
            if (L8(`[Sandbox Linux] Processing write path: ${J} -> ${X}`), X.startsWith("/dev/")) {
                L8(`[Sandbox Linux] Skipping /dev path: ${X}`);
                continue
            }
            if (!tT.existsSync(X)) {
                L8(`[Sandbox Linux] Skipping non-existent write path: ${X}`);
                continue
            }
            H.push("--bind", X, X), O.push(X)
        }
        let _ = [...q.denyWithinAllow || [], ...await yP5(K, Y, z, w)];
        for (let J of _) {
            let X = tC(J);
            if (X.startsWith("/dev/")) continue;
            let D = RP5(X, O);
            if (D) {
                H.push("--ro-bind", "/dev/null", D), L8(`[Sandbox Linux] Mounted /dev/null at symlink ${D} to prevent symlink replacement attack`);
                continue
            }
            if (!tT.existsSync(X)) {
                L8(`[Sandbox Linux] Skipping non-existent deny path: ${X}`);
                continue
            }
            if (O.some((M) => X.startsWith(M + "/") || X === M)) H.push("--ro-bind", X, X);
            else L8(`[Sandbox Linux] Skipping deny path not within allowed paths: ${X}`)
        }
    } else H.push("--bind", "/", "/");
    let $ = [...A?.denyOnly || []];
    if (tT.existsSync("/etc/ssh/ssh_config.d")) $.push("/etc/ssh/ssh_config.d");
    for (let O of $) {
        let _ = tC(O);
        if (!tT.existsSync(_)) {
            L8(`[Sandbox Linux] Skipping non-existent read deny path: ${_}`);
            continue
        }
        if (tT.statSync(_).isDirectory()) H.push("--tmpfs", _);
        else H.push("--ro-bind", "/dev/null", _)
    }
    return H
}
// @from(Ln 119045, Col 0)
async function st8(A) {
    let {
        command: q,
        needsNetworkRestriction: K,
        httpSocketPath: Y,
        socksSocketPath: z,
        httpProxyPort: w,
        socksProxyPort: H,
        readConfig: $,
        writeConfig: O,
        enableWeakerNestedSandbox: _,
        allowAllUnixSockets: J,
        binShell: X,
        ripgrepConfig: D = {
            command: "rg"
        },
        mandatoryDenySearchDepth: j = S8A,
        allowGitConfig: M = !1,
        seccompConfig: P,
        abortSignal: W
    } = A, G = $ && $.denyOnly.length > 0, f = O !== void 0;
    if (!K && !G && !f) return q;
    let Z = ["--new-session", "--die-with-parent"],
        N = void 0;
    try {
        if (!J) {
            N = dt8(P?.bpfPath) ?? void 0;
            let b = py1(P?.applyPath);
            if (!N || !b) L8("[Sandbox Linux] Seccomp binaries not available - unix socket blocking disabled. Install @anthropic-ai/sandbox-runtime globally for full protection.", {
                level: "warn"
            }), N = void 0;
            else {
                if (!N.includes("/vendor/seccomp/")) C8A.add(N), CP5();
                L8("[Sandbox Linux] Generated seccomp BPF filter for Unix socket blocking")
            }
        } else L8("[Sandbox Linux] Skipping seccomp filter - allowAllUnixSockets is enabled");
        if (K) {
            if (Z.push("--unshare-net"), Y && z) {
                if (!tT.existsSync(Y)) throw Error(`Linux HTTP bridge socket does not exist: ${Y}. The bridge process may have died. Try reinitializing the sandbox.`);
                if (!tT.existsSync(z)) throw Error(`Linux SOCKS bridge socket does not exist: ${z}. The bridge process may have died. Try reinitializing the sandbox.`);
                Z.push("--bind", Y, Y), Z.push("--bind", z, z);
                let b = $q6(3128, 1080);
                if (Z.push(...b.flatMap((g) => {
                        let U = g.indexOf("="),
                            x = g.slice(0, U),
                            p = g.slice(U + 1);
                        return ["--setenv", x, p]
                    })), w !== void 0) Z.push("--setenv", "CLAUDE_CODE_HOST_HTTP_PROXY_PORT", String(w));
                if (H !== void 0) Z.push("--setenv", "CLAUDE_CODE_HOST_SOCKS_PROXY_PORT", String(H))
            }
        }
        let T = await hP5($, O, D, j, M, W);
        if (Z.push(...T), Z.push("--dev", "/dev"), Z.push("--unshare-pid"), !_) Z.push("--proc", "/proc");
        let k = X || "bash",
            y = y8A("which", [k], {
                encoding: "utf8"
            });
        if (y.status !== 0) throw Error(`Shell '${k}' not found in PATH`);
        let B = y.stdout.trim();
        if (Z.push("--", B, "-c"), K && Y && z) {
            let b = SP5(Y, z, q, N, B, P?.applyPath);
            Z.push(b)
        } else if (N) {
            let b = py1(P?.applyPath);
            if (!b) throw Error("apply-seccomp binary not found. This should have been caught earlier. Ensure vendor/seccomp/{x64,arm64}/apply-seccomp binaries are included in the package.");
            let g = d81.default.quote([b, N, B, "-c", q]);
            Z.push(g)
        } else Z.push(q);
        let S = d81.default.quote(["bwrap", ...Z]),
            m = [];
        if (K) m.push("network");
        if (G || f) m.push("filesystem");
        if (N) m.push("seccomp(unix-block)");
        return L8(`[Sandbox Linux] Wrapped command with bwrap (${m.join(", ")} restrictions)`), S
    } catch (T) {
        if (N && !N.includes("/vendor/seccomp/")) {
            C8A.delete(N);
            try {
                R8A(N)
            } catch (k) {
                L8(`[Sandbox Linux] Failed to clean up seccomp filter on error: ${k}`, {
                    level: "error"
                })
            }
        }
        throw T
    }
}
// @from(Ln 119133, Col 4)
d81
// @from(Ln 119133, Col 9)
S8A = 3
// @from(Ln 119134, Col 4)
C8A
// @from(Ln 119134, Col 9)
rt8 = !1
// @from(Ln 119135, Col 4)
tt8 = v(() => {
    Ft8();
    J_1();
    ct8();
    d81 = o(Ha1(), 1);
    C8A = new Set
})
// @from(Ln 119148, Col 0)
function bP5(A = !1) {
    let q = process.cwd(),
        K = [];
    for (let Y of Qy1) K.push(Fg.resolve(q, Y)), K.push(`**/${Y}`);
    for (let Y of Hq6()) K.push(Fg.resolve(q, Y)), K.push(`**/${Y}/**`);
    if (K.push(Fg.resolve(q, ".git/hooks")), K.push("**/.git/hooks/**"), !A) K.push(Fg.resolve(q, ".git/config")), K.push("**/.git/config");
    return [...new Set(K)]
}
// @from(Ln 119157, Col 0)
function _q6(A) {
    return "^" + A.replace(/[.^$+{}()|\\]/g, "\\$&").replace(/\[([^\]]*?)$/g, "\\[$1").replace(/\*\*\//g, "__GLOBSTAR_SLASH__").replace(/\*\*/g, "__GLOBSTAR__").replace(/\*/g, "[^/]*").replace(/\?/g, "[^/]").replace(/__GLOBSTAR_SLASH__/g, "(.*/)?").replace(/__GLOBSTAR__/g, ".*") + "$"
}
// @from(Ln 119161, Col 0)
function uP5(A) {
    return `CMD64_${Oq6(A)}_END_${qe8}`
}
// @from(Ln 119165, Col 0)
function et8(A) {
    let q = [],
        K = Fg.dirname(A);
    while (K !== "/" && K !== ".") {
        q.push(K);
        let Y = Fg.dirname(K);
        if (Y === K) break;
        K = Y
    }
    return q
}
// @from(Ln 119177, Col 0)
function Ke8(A, q) {
    let K = [];
    for (let Y of A) {
        let z = tC(Y);
        if (sC(z)) {
            let w = _q6(z);
            K.push("(deny file-write-unlink", `  (regex ${eT(w)})`, `  (with message "${q}"))`);
            let H = z.split(/[*?[\]]/)[0];
            if (H && H !== "/") {
                let $ = H.endsWith("/") ? H.slice(0, -1) : Fg.dirname(H);
                K.push("(deny file-write-unlink", `  (literal ${eT($)})`, `  (with message "${q}"))`);
                for (let O of et8($)) K.push("(deny file-write-unlink", `  (literal ${eT(O)})`, `  (with message "${q}"))`)
            }
        } else {
            K.push("(deny file-write-unlink", `  (subpath ${eT(z)})`, `  (with message "${q}"))`);
            for (let w of et8(z)) K.push("(deny file-write-unlink", `  (literal ${eT(w)})`, `  (with message "${q}"))`)
        }
    }
    return K
}
// @from(Ln 119198, Col 0)
function BP5(A, q) {
    if (!A) return ["(allow file-read*)"];
    let K = [];
    K.push("(allow file-read*)");
    for (let Y of A.denyOnly || []) {
        let z = tC(Y);
        if (sC(z)) {
            let w = _q6(z);
            K.push("(deny file-read*", `  (regex ${eT(w)})`, `  (with message "${q}"))`)
        } else K.push("(deny file-read*", `  (subpath ${eT(z)})`, `  (with message "${q}"))`)
    }
    return K.push(...Ke8(A.denyOnly || [], q)), K
}
// @from(Ln 119212, Col 0)
function mP5(A, q, K = !1) {
    if (!A) return ["(allow file-write*)"];
    let Y = [],
        z = QP5();
    for (let H of z) {
        let $ = tC(H);
        Y.push("(allow file-write*", `  (subpath ${eT($)})`, `  (with message "${q}"))`)
    }
    for (let H of A.allowOnly || []) {
        let $ = tC(H);
        if (sC($)) {
            let O = _q6($);
            Y.push("(allow file-write*", `  (regex ${eT(O)})`, `  (with message "${q}"))`)
        } else Y.push("(allow file-write*", `  (subpath ${eT($)})`, `  (with message "${q}"))`)
    }
    let w = [...A.denyWithinAllow || [], ...bP5(K)];
    for (let H of w) {
        let $ = tC(H);
        if (sC($)) {
            let O = _q6($);
            Y.push("(deny file-write*", `  (regex ${eT(O)})`, `  (with message "${q}"))`)
        } else Y.push("(deny file-write*", `  (subpath ${eT($)})`, `  (with message "${q}"))`)
    }
    return Y.push(...Ke8(w, q)), Y
}
// @from(Ln 119238, Col 0)
function FP5({
    readConfig: A,
    writeConfig: q,
    httpProxyPort: K,
    socksProxyPort: Y,
    needsNetworkRestriction: z,
    allowUnixSockets: w,
    allowAllUnixSockets: H,
    allowLocalBinding: $,
    allowPty: O,
    allowGitConfig: _ = !1,
    logTag: J
}) {
    let X = ["(version 1)", `(deny default (with message "${J}"))`, "", `; LogTag: ${J}`, "", "; Essential permissions - based on Chrome sandbox policy", "; Process permissions", "(allow process-exec)", "(allow process-fork)", "(allow process-info* (target same-sandbox))", "(allow signal (target same-sandbox))", "(allow mach-priv-task-port (target same-sandbox))", "", "; User preferences", "(allow user-preference-read)", "", "; Mach IPC - specific services only (no wildcard)", "(allow mach-lookup", '  (global-name "com.apple.audio.systemsoundserver")', '  (global-name "com.apple.distributed_notifications@Uv3")', '  (global-name "com.apple.FontObjectsServer")', '  (global-name "com.apple.fonts")', '  (global-name "com.apple.logd")', '  (global-name "com.apple.lsd.mapdb")', '  (global-name "com.apple.PowerManagement.control")', '  (global-name "com.apple.system.logger")', '  (global-name "com.apple.system.notification_center")', '  (global-name "com.apple.system.opendirectoryd.libinfo")', '  (global-name "com.apple.system.opendirectoryd.membership")', '  (global-name "com.apple.bsd.dirhelper")', '  (global-name "com.apple.securityd.xpc")', '  (global-name "com.apple.coreservices.launchservicesd")', ")", "", "; POSIX IPC - shared memory", "(allow ipc-posix-shm)", "", "; POSIX IPC - semaphores for Python multiprocessing", "(allow ipc-posix-sem)", "", "; IOKit - specific operations only", "(allow iokit-open", '  (iokit-registry-entry-class "IOSurfaceRootUserClient")', '  (iokit-registry-entry-class "RootDomainUserClient")', '  (iokit-user-client-class "IOSurfaceSendRight")', ")", "", "; IOKit properties", "(allow iokit-get-properties)", "", "; Specific safe system-sockets, doesn't allow network access", "(allow system-socket (require-all (socket-domain AF_SYSTEM) (socket-protocol 2)))", "", "; sysctl - specific sysctls only", "(allow sysctl-read", '  (sysctl-name "hw.activecpu")', '  (sysctl-name "hw.busfrequency_compat")', '  (sysctl-name "hw.byteorder")', '  (sysctl-name "hw.cacheconfig")', '  (sysctl-name "hw.cachelinesize_compat")', '  (sysctl-name "hw.cpufamily")', '  (sysctl-name "hw.cpufrequency")', '  (sysctl-name "hw.cpufrequency_compat")', '  (sysctl-name "hw.cputype")', '  (sysctl-name "hw.l1dcachesize_compat")', '  (sysctl-name "hw.l1icachesize_compat")', '  (sysctl-name "hw.l2cachesize_compat")', '  (sysctl-name "hw.l3cachesize_compat")', '  (sysctl-name "hw.logicalcpu")', '  (sysctl-name "hw.logicalcpu_max")', '  (sysctl-name "hw.machine")', '  (sysctl-name "hw.memsize")', '  (sysctl-name "hw.ncpu")', '  (sysctl-name "hw.nperflevels")', '  (sysctl-name "hw.packages")', '  (sysctl-name "hw.pagesize_compat")', '  (sysctl-name "hw.pagesize")', '  (sysctl-name "hw.physicalcpu")', '  (sysctl-name "hw.physicalcpu_max")', '  (sysctl-name "hw.tbfrequency_compat")', '  (sysctl-name "hw.vectorunit")', '  (sysctl-name "kern.argmax")', '  (sysctl-name "kern.bootargs")', '  (sysctl-name "kern.hostname")', '  (sysctl-name "kern.maxfiles")', '  (sysctl-name "kern.maxfilesperproc")', '  (sysctl-name "kern.maxproc")', '  (sysctl-name "kern.ngroups")', '  (sysctl-name "kern.osproductversion")', '  (sysctl-name "kern.osrelease")', '  (sysctl-name "kern.ostype")', '  (sysctl-name "kern.osvariant_status")', '  (sysctl-name "kern.osversion")', '  (sysctl-name "kern.secure_kernel")', '  (sysctl-name "kern.tcsm_available")', '  (sysctl-name "kern.tcsm_enable")', '  (sysctl-name "kern.usrstack64")', '  (sysctl-name "kern.version")', '  (sysctl-name "kern.willshutdown")', '  (sysctl-name "machdep.cpu.brand_string")', '  (sysctl-name "machdep.ptrauth_enabled")', '  (sysctl-name "security.mac.lockdown_mode_state")', '  (sysctl-name "sysctl.proc_cputype")', '  (sysctl-name "vm.loadavg")', '  (sysctl-name-prefix "hw.optional.arm")', '  (sysctl-name-prefix "hw.optional.arm.")', '  (sysctl-name-prefix "hw.optional.armv8_")', '  (sysctl-name-prefix "hw.perflevel")', '  (sysctl-name-prefix "kern.proc.all")', '  (sysctl-name-prefix "kern.proc.pgrp.")', '  (sysctl-name-prefix "kern.proc.pid.")', '  (sysctl-name-prefix "machdep.cpu.")', '  (sysctl-name-prefix "net.routetable.")', ")", "", "; V8 thread calculations", "(allow sysctl-write", '  (sysctl-name "kern.tcsm_enable")', ")", "", "; Distributed notifications", "(allow distributed-notification-post)", "", "; Specific mach-lookup permissions for security operations", '(allow mach-lookup (global-name "com.apple.SecurityServer"))', "", "; File I/O on device files", '(allow file-ioctl (literal "/dev/null"))', '(allow file-ioctl (literal "/dev/zero"))', '(allow file-ioctl (literal "/dev/random"))', '(allow file-ioctl (literal "/dev/urandom"))', '(allow file-ioctl (literal "/dev/dtracehelper"))', '(allow file-ioctl (literal "/dev/tty"))', "", "(allow file-ioctl file-read-data file-write-data", "  (require-all", '    (literal "/dev/null")', "    (vnode-type CHARACTER-DEVICE)", "  )", ")", ""];
    if (X.push("; Network"), !z) X.push("(allow network*)");
    else {
        if ($) X.push('(allow network-bind (local ip "localhost:*"))'), X.push('(allow network-inbound (local ip "localhost:*"))'), X.push('(allow network-outbound (local ip "localhost:*"))');
        if (H) X.push('(allow network* (subpath "/"))');
        else if (w && w.length > 0)
            for (let D of w) {
                let j = tC(D);
                X.push(`(allow network* (subpath ${eT(j)}))`)
            }
        if (K !== void 0) X.push(`(allow network-bind (local ip "localhost:${K}"))`), X.push(`(allow network-inbound (local ip "localhost:${K}"))`), X.push(`(allow network-outbound (remote ip "localhost:${K}"))`);
        if (Y !== void 0) X.push(`(allow network-bind (local ip "localhost:${Y}"))`), X.push(`(allow network-inbound (local ip "localhost:${Y}"))`), X.push(`(allow network-outbound (remote ip "localhost:${Y}"))`)
    }
    if (X.push(""), X.push("; File read"), X.push(...BP5(A, J)), X.push(""), X.push("; File write"), X.push(...mP5(q, J, _)), O) X.push(""), X.push("; Pseudo-terminal (pty) support"), X.push("(allow pseudo-tty)"), X.push("(allow file-ioctl"), X.push('  (literal "/dev/ptmx")'), X.push('  (regex #"^/dev/ttys")'), X.push(")"), X.push("(allow file-read* file-write*"), X.push('  (literal "/dev/ptmx")'), X.push('  (regex #"^/dev/ttys")'), X.push(")");
    return X.join(`
`)
}
// @from(Ln 119269, Col 0)
function eT(A) {
    return JSON.stringify(A)
}
// @from(Ln 119273, Col 0)
function QP5() {
    let A = process.env.TMPDIR;
    if (!A) return [];
    if (!A.match(/^\/(private\/)?var\/folders\/[^/]{2}\/[^/]+\/T\/?$/)) return [];
    let K = A.replace(/\/T\/?$/, "");
    if (K.startsWith("/private/var/")) return [K, K.replace("/private", "")];
    else if (K.startsWith("/var/")) return [K, "/private" + K];
    return [K]
}
// @from(Ln 119283, Col 0)
function Ye8(A) {
    let {
        command: q,
        needsNetworkRestriction: K,
        httpProxyPort: Y,
        socksProxyPort: z,
        allowUnixSockets: w,
        allowAllUnixSockets: H,
        allowLocalBinding: $,
        readConfig: O,
        writeConfig: _,
        allowPty: J,
        allowGitConfig: X = !1,
        binShell: D
    } = A, j = O && O.denyOnly.length > 0;
    if (!K && !j && _ === void 0) return q;
    let P = uP5(q),
        W = FP5({
            readConfig: O,
            writeConfig: _,
            httpProxyPort: Y,
            socksProxyPort: z,
            needsNetworkRestriction: K,
            allowUnixSockets: w,
            allowAllUnixSockets: H,
            allowLocalBinding: $,
            allowPty: J,
            allowGitConfig: X,
            logTag: P
        }),
        G = $q6(Y, z),
        f = D || "bash",
        Z = xP5("which", [f], {
            encoding: "utf8"
        });
    if (Z.status !== 0) throw Error(`Shell '${f}' not found in PATH`);
    let N = Z.stdout.trim(),
        T = Ae8.default.quote(["env", ...G, "sandbox-exec", "-p", W, N, "-c", q]);
    return L8(`[Sandbox macOS] Applied restrictions - network: ${!!(Y||z)}, read: ${O?"allowAllExcept"in O?"allowAllExcept":"denyAllExcept":"none"}, write: ${_?"allowAllExcept"in _?"allowAllExcept":"denyAllExcept":"none"}`), T
}
// @from(Ln 119324, Col 0)
function ze8(A, q) {
    let K = /CMD64_(.+?)_END/,
        Y = /Sandbox:\s+(.+)$/,
        z = q?.["*"] || [],
        w = q ? Object.entries(q).filter(([$]) => $ !== "*") : [],
        H = IP5("log", ["stream", "--predicate", `(eventMessage ENDSWITH "${qe8}")`, "--style", "compact"]);
    return H.stdout?.on("data", ($) => {
        let O = $.toString().split(`
`),
            _ = O.find((P) => P.includes("Sandbox:") && P.includes("deny")),
            J = O.find((P) => P.startsWith("CMD64_"));
        if (!_) return;
        let X = _.match(Y);
        if (!X?.[1]) return;
        let D = X[1],
            j, M;
        if (J) {
            if (M = J.match(K)?.[1], M) try {
                j = gt8(M)
            } catch {}
        }
        if (D.includes("mDNSResponder") || D.includes("mach-lookup com.apple.diagnosticd") || D.includes("mach-lookup com.apple.analyticsd")) return;
        if (q && j) {
            if (z.length > 0) {
                if (z.some((W) => D.includes(W))) return
            }
            for (let [P, W] of w)
                if (j.includes(P)) {
                    if (W.some((f) => D.includes(f))) return
                }
        }
        A({
            line: D,
            command: j,
            encodedCommand: M,
            timestamp: new Date
        })
    }), H.stderr?.on("data", ($) => {
        L8(`[Sandbox Monitor] Log stream stderr: ${$.toString()}`)
    }), H.on("error", ($) => {
        L8(`[Sandbox Monitor] Failed to start log stream: ${$.message}`)
    }), H.on("exit", ($) => {
        L8(`[Sandbox Monitor] Log stream exited with code: ${$}`)
    }), () => {
        L8("[Sandbox Monitor] Stopping log monitor"), H.kill("SIGTERM")
    }
}
// @from(Ln 119371, Col 4)
Ae8
// @from(Ln 119371, Col 9)
qe8
// @from(Ln 119372, Col 4)
we8 = v(() => {
    J_1();
    Ae8 = o(Ha1(), 1);
    qe8 = `_${Math.random().toString(36).slice(2,11)}_SBX`
})
// @from(Ln 119377, Col 0)
class dy1 {
    constructor() {
        this.violations = [], this.totalCount = 0, this.maxSize = 100, this.listeners = new Set
    }
    addViolation(A) {
        if (this.violations.push(A), this.totalCount++, this.violations.length > this.maxSize) this.violations = this.violations.slice(-this.maxSize);
        this.notifyListeners()
    }
    getViolations(A) {
        if (A === void 0) return [...this.violations];
        return this.violations.slice(-A)
    }
    getCount() {
        return this.violations.length
    }
    getTotalCount() {
        return this.totalCount
    }
    getViolationsForCommand(A) {
        let q = Oq6(A);
        return this.violations.filter((K) => K.encodedCommand === q)
    }
    clear() {
        this.violations = [], this.notifyListeners()
    }
    subscribe(A) {
        return this.listeners.add(A), A(this.getViolations()), () => {
            this.listeners.delete(A)
        }
    }
    notifyListeners() {
        let A = this.getViolations();
        this.listeners.forEach((q) => q(A))
    }
}
// @from(Ln 119412, Col 4)
h8A = v(() => {
    J_1()
})
// @from(Ln 119423, Col 0)
function UP5() {
    if (He8) return;
    let A = () => u8A().catch((q) => {
        L8(`Cleanup failed in registerCleanup ${q}`, {
            level: "error"
        })
    });
    process.once("exit", A), process.once("SIGINT", A), process.once("SIGTERM", A), He8 = !0
}
// @from(Ln 119433, Col 0)
function b8A(A, q) {
    if (q.startsWith("*.")) {
        let K = q.substring(2);
        return A.toLowerCase().endsWith("." + K.toLowerCase())
    }
    return A.toLowerCase() === q.toLowerCase()
}
// @from(Ln 119440, Col 0)
async function _e8(A, q, K) {
    if (!c3) return L8("No config available, denying network request"), !1;
    for (let Y of c3.network.deniedDomains)
        if (b8A(q, Y)) return L8(`Denied by config rule: ${q}:${A}`), !1;
    for (let Y of c3.network.allowedDomains)
        if (b8A(q, Y)) return L8(`Allowed by config rule: ${q}:${A}`), !0;
    if (!K) return L8(`No matching config rule, denying: ${q}:${A}`), !1;
    L8(`No matching config rule, asking user: ${q}:${A}`);
    try {
        if (await K({
                host: q,
                port: A
            })) return L8(`User allowed: ${q}:${A}`), !0;
        else return L8(`User denied: ${q}:${A}`), !1
    } catch (Y) {
        return L8(`Error in permission callback: ${Y}`, {
            level: "error"
        }), !1
    }
}
// @from(Ln 119461, Col 0)
function pP5(A) {
    if (!c3?.network.mitmProxy) return;
    let {
        socketPath: q,
        domains: K
    } = c3.network.mitmProxy;
    for (let Y of K)
        if (b8A(A, Y)) return L8(`Host ${A} matches MITM pattern ${Y}`), q;
    return
}
// @from(Ln 119471, Col 0)
async function dP5(A) {
    return X_1 = Ro8({
        filter: (q, K) => _e8(q, K, A),
        getMitmSocketPath: pP5
    }), new Promise((q, K) => {
        if (!X_1) {
            K(Error("HTTP proxy server undefined before listen"));
            return
        }
        let Y = X_1;
        Y.once("error", K), Y.once("listening", () => {
            let z = Y.address();
            if (z && typeof z === "object") Y.unref(), L8(`HTTP proxy listening on localhost:${z.port}`), q(z.port);
            else K(Error("Failed to get proxy server address"))
        }), Y.listen(0, "127.0.0.1")
    })
}
// @from(Ln 119488, Col 0)
async function cP5(A) {
    return c81 = mo8({
        filter: (q, K) => _e8(q, K, A)
    }), new Promise((q, K) => {
        if (!c81) {
            K(Error("SOCKS proxy server undefined before listen"));
            return
        }
        c81.listen(0, "127.0.0.1").then((Y) => {
            c81?.unref(), q(Y)
        }).catch(K)
    })
}
// @from(Ln 119501, Col 0)
async function lP5(A, q, K = !1) {
    if (Kr) {
        await Kr;
        return
    }
    c3 = A;
    let Y = Xe8();
    if (Y.errors.length > 0) throw Error(`Sandbox dependencies not available: ${Y.errors.join(", ")}`);
    if (K && wL() === "macos") Jq6 = ze8(Xq6.addViolation.bind(Xq6), c3.ignoreViolations), L8("Started macOS sandbox log monitor");
    UP5(), Kr = (async () => {
        try {
            let z;
            if (c3.network.httpProxyPort !== void 0) z = c3.network.httpProxyPort, L8(`Using external HTTP proxy on port ${z}`);
            else z = await dP5(q);
            let w;
            if (c3.network.socksProxyPort !== void 0) w = c3.network.socksProxyPort, L8(`Using external SOCKS proxy on port ${w}`);
            else w = await cP5(q);
            let H;
            if (wL() === "linux") H = await at8(z, w);
            let $ = {
                httpProxyPort: z,
                socksProxyPort: w,
                linuxBridge: H
            };
            return OL = $, L8("Network infrastructure initialized"), $
        } catch (z) {
            throw Kr = void 0, OL = void 0, u8A().catch((w) => {
                L8(`Cleanup failed in initializationPromise ${w}`, {
                    level: "error"
                })
            }), z
        }
    })(), await Kr
}
// @from(Ln 119536, Col 0)
function Je8() {
    let A = wL();
    if (A === "linux") return Z8A() !== "1";
    return A === "macos"
}
// @from(Ln 119542, Col 0)
function iP5() {
    return c3 !== void 0
}