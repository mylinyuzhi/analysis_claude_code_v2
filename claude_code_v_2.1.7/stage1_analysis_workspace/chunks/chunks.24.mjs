
// @from(Ln 61608, Col 4)
WKQ = U((DKQ) => {
  var {
    _nullishCoalesce: JKQ
  } = CQ();
  Object.defineProperty(DKQ, "__esModule", {
    value: !0
  });
  var XKQ = NA("http");
  NA("https");
  var Yv = Symbol("AgentBaseInternalState");
  class IKQ extends XKQ.Agent {
    constructor(A) {
      super(A);
      this[Yv] = {}
    }
    isSecureEndpoint(A) {
      if (A) {
        if (typeof A.secureEndpoint === "boolean") return A.secureEndpoint;
        if (typeof A.protocol === "string") return A.protocol === "https:"
      }
      let {
        stack: Q
      } = Error();
      if (typeof Q !== "string") return !1;
      return Q.split(`
`).some((B) => B.indexOf("(https.js:") !== -1 || B.indexOf("node:https:") !== -1)
    }
    createSocket(A, Q, B) {
      let G = {
        ...Q,
        secureEndpoint: this.isSecureEndpoint(Q)
      };
      Promise.resolve().then(() => this.connect(A, G)).then((Z) => {
        if (Z instanceof XKQ.Agent) return Z.addRequest(A, G);
        this[Yv].currentSocket = Z, super.createSocket(A, Q, B)
      }, B)
    }
    createConnection() {
      let A = this[Yv].currentSocket;
      if (this[Yv].currentSocket = void 0, !A) throw Error("No socket was returned in the `connect()` function");
      return A
    }
    get defaultPort() {
      return JKQ(this[Yv].defaultPort, () => this.protocol === "https:" ? 443 : 80)
    }
    set defaultPort(A) {
      if (this[Yv]) this[Yv].defaultPort = A
    }
    get protocol() {
      return JKQ(this[Yv].protocol, () => this.isSecureEndpoint() ? "https:" : "http:")
    }
    set protocol(A) {
      if (this[Yv]) this[Yv].protocol = A
    }
  }
  DKQ.Agent = IKQ
})
// @from(Ln 61665, Col 4)
VKQ = U((KKQ) => {
  Object.defineProperty(KKQ, "__esModule", {
    value: !0
  });
  var sS4 = CQ();

  function FnA(...A) {
    sS4.logger.log("[https-proxy-agent:parse-proxy-response]", ...A)
  }

  function tS4(A) {
    return new Promise((Q, B) => {
      let G = 0,
        Z = [];

      function Y() {
        let W = A.read();
        if (W) D(W);
        else A.once("readable", Y)
      }

      function J() {
        A.removeListener("end", X), A.removeListener("error", I), A.removeListener("readable", Y)
      }

      function X() {
        J(), FnA("onend"), B(Error("Proxy connection ended before receiving CONNECT response"))
      }

      function I(W) {
        J(), FnA("onerror %o", W), B(W)
      }

      function D(W) {
        Z.push(W), G += W.length;
        let K = Buffer.concat(Z, G),
          V = K.indexOf(`\r
\r
`);
        if (V === -1) {
          FnA("have not received end of HTTP headers yet..."), Y();
          return
        }
        let F = K.slice(0, V).toString("ascii").split(`\r
`),
          H = F.shift();
        if (!H) return A.destroy(), B(Error("No header received from proxy CONNECT response"));
        let E = H.split(" "),
          z = +E[1],
          $ = E.slice(2).join(" "),
          O = {};
        for (let L of F) {
          if (!L) continue;
          let M = L.indexOf(":");
          if (M === -1) return A.destroy(), B(Error(`Invalid header from proxy CONNECT response: "${L}"`));
          let _ = L.slice(0, M).toLowerCase(),
            j = L.slice(M + 1).trimStart(),
            x = O[_];
          if (typeof x === "string") O[_] = [x, j];
          else if (Array.isArray(x)) x.push(j);
          else O[_] = j
        }
        FnA("got proxy server response: %o %o", H, O), J(), Q({
          connect: {
            statusCode: z,
            statusText: $,
            headers: O
          },
          buffered: K
        })
      }
      A.on("error", I), A.on("end", X), Y()
    })
  }
  KKQ.parseProxyResponse = tS4
})
// @from(Ln 61741, Col 4)
zKQ = U((EKQ) => {
  var {
    _nullishCoalesce: Ax4,
    _optionalChain: Qx4
  } = CQ();
  Object.defineProperty(EKQ, "__esModule", {
    value: !0
  });
  var pqA = NA("net"),
    FKQ = NA("tls"),
    Bx4 = NA("url"),
    Gx4 = CQ(),
    Zx4 = WKQ(),
    Yx4 = VKQ();

  function lqA(...A) {
    Gx4.logger.log("[https-proxy-agent]", ...A)
  }
  class FT1 extends Zx4.Agent {
    static __initStatic() {
      this.protocols = ["http", "https"]
    }
    constructor(A, Q) {
      super(Q);
      this.options = {}, this.proxy = typeof A === "string" ? new Bx4.URL(A) : A, this.proxyHeaders = Ax4(Qx4([Q, "optionalAccess", (Z) => Z.headers]), () => ({})), lqA("Creating new HttpsProxyAgent instance: %o", this.proxy.href);
      let B = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""),
        G = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
      this.connectOpts = {
        ALPNProtocols: ["http/1.1"],
        ...Q ? HKQ(Q, "headers") : null,
        host: B,
        port: G
      }
    }
    async connect(A, Q) {
      let {
        proxy: B
      } = this;
      if (!Q.host) throw TypeError('No "host" provided');
      let G;
      if (B.protocol === "https:") {
        lqA("Creating `tls.Socket`: %o", this.connectOpts);
        let K = this.connectOpts.servername || this.connectOpts.host;
        G = FKQ.connect({
          ...this.connectOpts,
          servername: K && pqA.isIP(K) ? void 0 : K
        })
      } else lqA("Creating `net.Socket`: %o", this.connectOpts), G = pqA.connect(this.connectOpts);
      let Z = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : {
          ...this.proxyHeaders
        },
        Y = pqA.isIPv6(Q.host) ? `[${Q.host}]` : Q.host,
        J = `CONNECT ${Y}:${Q.port} HTTP/1.1\r
`;
      if (B.username || B.password) {
        let K = `${decodeURIComponent(B.username)}:${decodeURIComponent(B.password)}`;
        Z["Proxy-Authorization"] = `Basic ${Buffer.from(K).toString("base64")}`
      }
      if (Z.Host = `${Y}:${Q.port}`, !Z["Proxy-Connection"]) Z["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
      for (let K of Object.keys(Z)) J += `${K}: ${Z[K]}\r
`;
      let X = Yx4.parseProxyResponse(G);
      G.write(`${J}\r
`);
      let {
        connect: I,
        buffered: D
      } = await X;
      if (A.emit("proxyConnect", I), this.emit("proxyConnect", I, A), I.statusCode === 200) {
        if (A.once("socket", Jx4), Q.secureEndpoint) {
          lqA("Upgrading socket connection to TLS");
          let K = Q.servername || Q.host;
          return FKQ.connect({
            ...HKQ(Q, "host", "path", "port"),
            socket: G,
            servername: pqA.isIP(K) ? void 0 : K
          })
        }
        return G
      }
      G.destroy();
      let W = new pqA.Socket({
        writable: !1
      });
      return W.readable = !0, A.once("socket", (K) => {
        lqA("Replaying proxy buffer for failed request"), K.push(D), K.push(null)
      }), W
    }
  }
  FT1.__initStatic();

  function Jx4(A) {
    A.resume()
  }

  function HKQ(A, ...Q) {
    let B = {},
      G;
    for (G in A)
      if (!Q.includes(G)) B[G] = A[G];
    return B
  }
  EKQ.HttpsProxyAgent = FT1
})
// @from(Ln 61845, Col 4)
ET1 = U((UKQ) => {
  var {
    _nullishCoalesce: HT1
  } = CQ();
  Object.defineProperty(UKQ, "__esModule", {
    value: !0
  });
  var Ix4 = NA("http"),
    Dx4 = NA("https"),
    Wx4 = NA("stream"),
    CKQ = NA("url"),
    Kx4 = NA("zlib"),
    $KQ = U6(),
    Vx4 = CQ(),
    Fx4 = zKQ(),
    Hx4 = 32768;

  function Ex4(A) {
    return new Wx4.Readable({
      read() {
        this.push(A), this.push(null)
      }
    })
  }

  function zx4(A) {
    let Q;
    try {
      Q = new CKQ.URL(A.url)
    } catch (I) {
      return Vx4.consoleSandbox(() => {
        console.warn("[@sentry/node]: Invalid dsn or tunnel option, will not send any events. The tunnel option must be a full URL when used.")
      }), $KQ.createTransport(A, () => Promise.resolve({}))
    }
    let B = Q.protocol === "https:",
      G = $x4(Q, A.proxy || (B ? process.env.https_proxy : void 0) || process.env.http_proxy),
      Z = B ? Dx4 : Ix4,
      Y = A.keepAlive === void 0 ? !1 : A.keepAlive,
      J = G ? new Fx4.HttpsProxyAgent(G) : new Z.Agent({
        keepAlive: Y,
        maxSockets: 30,
        timeout: 2000
      }),
      X = Cx4(A, HT1(A.httpModule, () => Z), J);
    return $KQ.createTransport(A, X)
  }

  function $x4(A, Q) {
    let {
      no_proxy: B
    } = process.env;
    if (B && B.split(",").some((Z) => A.host.endsWith(Z) || A.hostname.endsWith(Z))) return;
    else return Q
  }

  function Cx4(A, Q, B) {
    let {
      hostname: G,
      pathname: Z,
      port: Y,
      protocol: J,
      search: X
    } = new CKQ.URL(A.url);
    return function (D) {
      return new Promise((W, K) => {
        let V = Ex4(D.body),
          F = {
            ...A.headers
          };
        if (D.body.length > Hx4) F["content-encoding"] = "gzip", V = V.pipe(Kx4.createGzip());
        let H = Q.request({
          method: "POST",
          agent: B,
          headers: F,
          hostname: G,
          path: `${Z}${X}`,
          port: Y,
          protocol: J,
          ca: A.caCerts
        }, (E) => {
          E.on("data", () => {}), E.on("end", () => {}), E.setEncoding("utf8");
          let z = HT1(E.headers["retry-after"], () => null),
            $ = HT1(E.headers["x-sentry-rate-limits"], () => null);
          W({
            statusCode: E.statusCode,
            headers: {
              "retry-after": z,
              "x-sentry-rate-limits": Array.isArray($) ? $[0] : $
            }
          })
        });
        H.on("error", K), V.pipe(H)
      })
    }
  }
  UKQ.makeNodeTransport = zx4
})
// @from(Ln 61942, Col 4)
g1A = U((qKQ) => {
  Object.defineProperty(qKQ, "__esModule", {
    value: !0
  });
  var qx4 = CQ(),
    Nx4 = qx4.parseSemver(process.versions.node);
  qKQ.NODE_VERSION = Nx4
})
// @from(Ln 61950, Col 4)
OKQ = U((LKQ) => {
  var {
    _optionalChain: Lx4
  } = CQ();
  Object.defineProperty(LKQ, "__esModule", {
    value: !0
  });
  var NKQ = NA("domain"),
    u1A = U6();

  function wKQ() {
    return NKQ.active
  }

  function Ox4() {
    let A = wKQ();
    if (!A) return;
    return u1A.ensureHubOnCarrier(A), u1A.getHubFromCarrier(A)
  }

  function Mx4(A) {
    let Q = {};
    return u1A.ensureHubOnCarrier(Q, A), u1A.getHubFromCarrier(Q)
  }

  function Rx4(A, Q) {
    let B = wKQ();
    if (B && Lx4([Q, "optionalAccess", (J) => J.reuseExisting])) return A();
    let G = NKQ.create(),
      Z = B ? u1A.getHubFromCarrier(B) : void 0,
      Y = Mx4(Z);
    return u1A.setHubOnCarrier(G, Y), G.bind(() => {
      return A()
    })()
  }

  function _x4() {
    u1A.setAsyncContextStrategy({
      getCurrentHub: Ox4,
      runWithAsyncContext: Rx4
    })
  }
  LKQ.setDomainAsyncContextStrategy = _x4
})
// @from(Ln 61994, Col 4)
RKQ = U((MKQ) => {
  var {
    _optionalChain: Tx4
  } = CQ();
  Object.defineProperty(MKQ, "__esModule", {
    value: !0
  });
  var zT1 = U6(),
    Px4 = NA("async_hooks"),
    HnA;

  function Sx4() {
    if (!HnA) HnA = new Px4.AsyncLocalStorage;

    function A() {
      return HnA.getStore()
    }

    function Q(G) {
      let Z = {};
      return zT1.ensureHubOnCarrier(Z, G), zT1.getHubFromCarrier(Z)
    }

    function B(G, Z) {
      let Y = A();
      if (Y && Tx4([Z, "optionalAccess", (X) => X.reuseExisting])) return G();
      let J = Q(Y);
      return HnA.run(J, () => {
        return G()
      })
    }
    zT1.setAsyncContextStrategy({
      getCurrentHub: A,
      runWithAsyncContext: B
    })
  }
  MKQ.setHooksAsyncContextStrategy = Sx4
})
// @from(Ln 62032, Col 4)
jKQ = U((_KQ) => {
  Object.defineProperty(_KQ, "__esModule", {
    value: !0
  });
  var yx4 = g1A(),
    vx4 = OKQ(),
    kx4 = RKQ();

  function bx4() {
    if (yx4.NODE_VERSION.major >= 14) kx4.setHooksAsyncContextStrategy();
    else vx4.setDomainAsyncContextStrategy()
  }
  _KQ.setNodeAsyncContextStrategy = bx4
})
// @from(Ln 62046, Col 4)
znA = U((xKQ) => {
  Object.defineProperty(xKQ, "__esModule", {
    value: !0
  });
  var hx4 = NA("util"),
    EnA = U6(),
    TKQ = CQ(),
    PKQ = "Console",
    gx4 = () => {
      return {
        name: PKQ,
        setupOnce() {},
        setup(A) {
          TKQ.addConsoleInstrumentationHandler(({
            args: Q,
            level: B
          }) => {
            if (EnA.getClient() !== A) return;
            EnA.addBreadcrumb({
              category: "console",
              level: TKQ.severityLevelFromString(B),
              message: hx4.format.apply(void 0, Q)
            }, {
              input: [...Q],
              level: B
            })
          })
        }
      }
    },
    SKQ = EnA.defineIntegration(gx4),
    ux4 = EnA.convertIntegrationFnToClass(PKQ, SKQ);
  xKQ.Console = ux4;
  xKQ.consoleIntegration = SKQ
})
// @from(Ln 62081, Col 4)
$nA = U((dKQ) => {
  var {
    _optionalChain: m1A
  } = CQ();
  Object.defineProperty(dKQ, "__esModule", {
    value: !0
  });
  var cx4 = NA("child_process"),
    vKQ = NA("fs"),
    pM = NA("os"),
    px4 = NA("path"),
    kKQ = NA("util"),
    bKQ = U6(),
    fKQ = kKQ.promisify(vKQ.readFile),
    hKQ = kKQ.promisify(vKQ.readdir),
    gKQ = "Context",
    lx4 = (A = {}) => {
      let Q, B = {
        app: !0,
        os: !0,
        device: !0,
        culture: !0,
        cloudResource: !0,
        ...A
      };
      async function G(Y) {
        if (Q === void 0) Q = Z();
        let J = nx4(await Q);
        return Y.contexts = {
          ...Y.contexts,
          app: {
            ...J.app,
            ...m1A([Y, "access", (X) => X.contexts, "optionalAccess", (X) => X.app])
          },
          os: {
            ...J.os,
            ...m1A([Y, "access", (X) => X.contexts, "optionalAccess", (X) => X.os])
          },
          device: {
            ...J.device,
            ...m1A([Y, "access", (X) => X.contexts, "optionalAccess", (X) => X.device])
          },
          culture: {
            ...J.culture,
            ...m1A([Y, "access", (X) => X.contexts, "optionalAccess", (X) => X.culture])
          },
          cloud_resource: {
            ...J.cloud_resource,
            ...m1A([Y, "access", (X) => X.contexts, "optionalAccess", (X) => X.cloud_resource])
          }
        }, Y
      }
      async function Z() {
        let Y = {};
        if (B.os) Y.os = await ax4();
        if (B.app) Y.app = rx4();
        if (B.device) Y.device = mKQ(B.device);
        if (B.culture) {
          let J = ox4();
          if (J) Y.culture = J
        }
        if (B.cloudResource) Y.cloud_resource = By4();
        return Y
      }
      return {
        name: gKQ,
        setupOnce() {},
        processEvent(Y) {
          return G(Y)
        }
      }
    },
    uKQ = bKQ.defineIntegration(lx4),
    ix4 = bKQ.convertIntegrationFnToClass(gKQ, uKQ);

  function nx4(A) {
    if (m1A([A, "optionalAccess", (Q) => Q.app, "optionalAccess", (Q) => Q.app_memory])) A.app.app_memory = process.memoryUsage().rss;
    if (m1A([A, "optionalAccess", (Q) => Q.device, "optionalAccess", (Q) => Q.free_memory])) A.device.free_memory = pM.freemem();
    return A
  }
  async function ax4() {
    let A = pM.platform();
    switch (A) {
      case "darwin":
        return Ay4();
      case "linux":
        return Qy4();
      default:
        return {
          name: sx4[A] || A, version: pM.release()
        }
    }
  }

  function ox4() {
    try {
      if (typeof process.versions.icu !== "string") return;
      let A = new Date(900000000);
      if (new Intl.DateTimeFormat("es", {
          month: "long"
        }).format(A) === "enero") {
        let B = Intl.DateTimeFormat().resolvedOptions();
        return {
          locale: B.locale,
          timezone: B.timeZone
        }
      }
    } catch (A) {}
    return
  }

  function rx4() {
    let A = process.memoryUsage().rss;
    return {
      app_start_time: new Date(Date.now() - process.uptime() * 1000).toISOString(),
      app_memory: A
    }
  }

  function mKQ(A) {
    let Q = {},
      B;
    try {
      B = pM.uptime && pM.uptime()
    } catch (G) {}
    if (typeof B === "number") Q.boot_time = new Date(Date.now() - B * 1000).toISOString();
    if (Q.arch = pM.arch(), A === !0 || A.memory) Q.memory_size = pM.totalmem(), Q.free_memory = pM.freemem();
    if (A === !0 || A.cpu) {
      let G = pM.cpus();
      if (G && G.length) {
        let Z = G[0];
        Q.processor_count = G.length, Q.cpu_description = Z.model, Q.processor_frequency = Z.speed
      }
    }
    return Q
  }
  var sx4 = {
      aix: "IBM AIX",
      freebsd: "FreeBSD",
      openbsd: "OpenBSD",
      sunos: "SunOS",
      win32: "Windows"
    },
    tx4 = [{
      name: "fedora-release",
      distros: ["Fedora"]
    }, {
      name: "redhat-release",
      distros: ["Red Hat Linux", "Centos"]
    }, {
      name: "redhat_version",
      distros: ["Red Hat Linux"]
    }, {
      name: "SuSE-release",
      distros: ["SUSE Linux"]
    }, {
      name: "lsb-release",
      distros: ["Ubuntu Linux", "Arch Linux"]
    }, {
      name: "debian_version",
      distros: ["Debian"]
    }, {
      name: "debian_release",
      distros: ["Debian"]
    }, {
      name: "arch-release",
      distros: ["Arch Linux"]
    }, {
      name: "gentoo-release",
      distros: ["Gentoo Linux"]
    }, {
      name: "novell-release",
      distros: ["SUSE Linux"]
    }, {
      name: "alpine-release",
      distros: ["Alpine Linux"]
    }],
    ex4 = {
      alpine: (A) => A,
      arch: (A) => Jv(/distrib_release=(.*)/, A),
      centos: (A) => Jv(/release ([^ ]+)/, A),
      debian: (A) => A,
      fedora: (A) => Jv(/release (..)/, A),
      mint: (A) => Jv(/distrib_release=(.*)/, A),
      red: (A) => Jv(/release ([^ ]+)/, A),
      suse: (A) => Jv(/VERSION = (.*)\n/, A),
      ubuntu: (A) => Jv(/distrib_release=(.*)/, A)
    };

  function Jv(A, Q) {
    let B = A.exec(Q);
    return B ? B[1] : void 0
  }
  async function Ay4() {
    let A = {
      kernel_version: pM.release(),
      name: "Mac OS X",
      version: `10.${Number(pM.release().split(".")[0])-4}`
    };
    try {
      let Q = await new Promise((B, G) => {
        cx4.execFile("/usr/bin/sw_vers", (Z, Y) => {
          if (Z) {
            G(Z);
            return
          }
          B(Y)
        })
      });
      A.name = Jv(/^ProductName:\s+(.*)$/m, Q), A.version = Jv(/^ProductVersion:\s+(.*)$/m, Q), A.build = Jv(/^BuildVersion:\s+(.*)$/m, Q)
    } catch (Q) {}
    return A
  }

  function yKQ(A) {
    return A.split(" ")[0].toLowerCase()
  }
  async function Qy4() {
    let A = {
      kernel_version: pM.release(),
      name: "Linux"
    };
    try {
      let Q = await hKQ("/etc"),
        B = tx4.find((X) => Q.includes(X.name));
      if (!B) return A;
      let G = px4.join("/etc", B.name),
        Z = (await fKQ(G, {
          encoding: "utf-8"
        })).toLowerCase(),
        {
          distros: Y
        } = B;
      A.name = Y.find((X) => Z.indexOf(yKQ(X)) >= 0) || Y[0];
      let J = yKQ(A.name);
      A.version = ex4[J](Z)
    } catch (Q) {}
    return A
  }

  function By4() {
    if (process.env.VERCEL) return {
      "cloud.provider": "vercel",
      "cloud.region": process.env.VERCEL_REGION
    };
    else if (process.env.AWS_REGION) return {
      "cloud.provider": "aws",
      "cloud.region": process.env.AWS_REGION,
      "cloud.platform": process.env.AWS_EXECUTION_ENV
    };
    else if (process.env.GCP_PROJECT) return {
      "cloud.provider": "gcp"
    };
    else if (process.env.ALIYUN_REGION_ID) return {
      "cloud.provider": "alibaba_cloud",
      "cloud.region": process.env.ALIYUN_REGION_ID
    };
    else if (process.env.WEBSITE_SITE_NAME && process.env.REGION_NAME) return {
      "cloud.provider": "azure",
      "cloud.region": process.env.REGION_NAME
    };
    else if (process.env.IBM_CLOUD_REGION) return {
      "cloud.provider": "ibm_cloud",
      "cloud.region": process.env.IBM_CLOUD_REGION
    };
    else if (process.env.TENCENTCLOUD_REGION) return {
      "cloud.provider": "tencent_cloud",
      "cloud.region": process.env.TENCENTCLOUD_REGION,
      "cloud.account.id": process.env.TENCENTCLOUD_APPID,
      "cloud.availability_zone": process.env.TENCENTCLOUD_ZONE
    };
    else if (process.env.NETLIFY) return {
      "cloud.provider": "netlify"
    };
    else if (process.env.FLY_REGION) return {
      "cloud.provider": "fly.io",
      "cloud.region": process.env.FLY_REGION
    };
    else if (process.env.DYNO) return {
      "cloud.provider": "heroku"
    };
    else return
  }
  dKQ.Context = ix4;
  dKQ.getDeviceContext = mKQ;
  dKQ.nodeContextIntegration = uKQ;
  dKQ.readDirAsync = hKQ;
  dKQ.readFileAsync = fKQ
})
// @from(Ln 62370, Col 4)
UnA = U((nKQ) => {
  var {
    _optionalChain: $T1
  } = CQ();
  Object.defineProperty(nKQ, "__esModule", {
    value: !0
  });
  var Iy4 = NA("fs"),
    cKQ = U6(),
    pKQ = CQ(),
    CnA = new pKQ.LRUMap(100),
    Dy4 = 7,
    lKQ = "ContextLines";

  function Wy4(A) {
    return new Promise((Q, B) => {
      Iy4.readFile(A, "utf8", (G, Z) => {
        if (G) B(G);
        else Q(Z)
      })
    })
  }
  var Ky4 = (A = {}) => {
      let Q = A.frameContextLines !== void 0 ? A.frameContextLines : Dy4;
      return {
        name: lKQ,
        setupOnce() {},
        processEvent(B) {
          return Fy4(B, Q)
        }
      }
    },
    iKQ = cKQ.defineIntegration(Ky4),
    Vy4 = cKQ.convertIntegrationFnToClass(lKQ, iKQ);
  async function Fy4(A, Q) {
    let B = {},
      G = [];
    if (Q > 0 && $T1([A, "access", (Z) => Z.exception, "optionalAccess", (Z) => Z.values]))
      for (let Z of A.exception.values) {
        if (!$T1([Z, "access", (Y) => Y.stacktrace, "optionalAccess", (Y) => Y.frames])) continue;
        for (let Y = Z.stacktrace.frames.length - 1; Y >= 0; Y--) {
          let J = Z.stacktrace.frames[Y];
          if (J.filename && !B[J.filename] && !CnA.get(J.filename)) G.push(Ey4(J.filename)), B[J.filename] = 1
        }
      }
    if (G.length > 0) await Promise.all(G);
    if (Q > 0 && $T1([A, "access", (Z) => Z.exception, "optionalAccess", (Z) => Z.values])) {
      for (let Z of A.exception.values)
        if (Z.stacktrace && Z.stacktrace.frames) await Hy4(Z.stacktrace.frames, Q)
    }
    return A
  }

  function Hy4(A, Q) {
    for (let B of A)
      if (B.filename && B.context_line === void 0) {
        let G = CnA.get(B.filename);
        if (G) try {
          pKQ.addContextToFrame(G, B, Q)
        } catch (Z) {}
      }
  }
  async function Ey4(A) {
    let Q = CnA.get(A);
    if (Q === null) return null;
    if (Q !== void 0) return Q;
    let B = null;
    try {
      B = (await Wy4(A)).split(`
`)
    } catch (G) {}
    return CnA.set(A, B), B
  }
  nKQ.ContextLines = Vy4;
  nKQ.contextLinesIntegration = iKQ
})
// @from(Ln 62446, Col 4)
iqA = U((aKQ) => {
  Object.defineProperty(aKQ, "__esModule", {
    value: !0
  });
  var Cy4 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
  aKQ.DEBUG_BUILD = Cy4
})
// @from(Ln 62453, Col 4)
tKQ = U((sKQ) => {
  var {
    _optionalChain: Xv
  } = CQ();
  Object.defineProperty(sKQ, "__esModule", {
    value: !0
  });
  var CT1 = NA("url"),
    qy4 = g1A();

  function Ny4(A) {
    let {
      protocol: Q,
      hostname: B,
      port: G
    } = rKQ(A), Z = A.path ? A.path : "/";
    return `${Q}//${B}${G}${Z}`
  }

  function oKQ(A) {
    let {
      protocol: Q,
      hostname: B,
      port: G
    } = rKQ(A), Z = A.pathname || "/", Y = A.auth ? wy4(A.auth) : "";
    return `${Q}//${Y}${B}${G}${Z}`
  }

  function wy4(A) {
    let [Q, B] = A.split(":");
    return `${Q?"[Filtered]":""}:${B?"[Filtered]":""}@`
  }

  function Ly4(A, Q, B) {
    if (!A) return A;
    let [G, Z] = A.split(" ");
    if (Q.host && !Q.protocol) Q.protocol = Xv([B, "optionalAccess", (Y) => Y.agent, "optionalAccess", (Y) => Y.protocol]), Z = oKQ(Q);
    if (Xv([Z, "optionalAccess", (Y) => Y.startsWith, "call", (Y) => Y("///")])) Z = Z.slice(2);
    return `${G} ${Z}`
  }

  function UT1(A) {
    let Q = {
      protocol: A.protocol,
      hostname: typeof A.hostname === "string" && A.hostname.startsWith("[") ? A.hostname.slice(1, -1) : A.hostname,
      hash: A.hash,
      search: A.search,
      pathname: A.pathname,
      path: `${A.pathname||""}${A.search||""}`,
      href: A.href
    };
    if (A.port !== "") Q.port = Number(A.port);
    if (A.username || A.password) Q.auth = `${A.username}:${A.password}`;
    return Q
  }

  function Oy4(A, Q) {
    let B, G;
    if (typeof Q[Q.length - 1] === "function") B = Q.pop();
    if (typeof Q[0] === "string") G = UT1(new CT1.URL(Q[0]));
    else if (Q[0] instanceof CT1.URL) G = UT1(Q[0]);
    else {
      G = Q[0];
      try {
        let Z = new CT1.URL(G.path || "", `${G.protocol||"http:"}//${G.hostname}`);
        G = {
          pathname: Z.pathname,
          search: Z.search,
          hash: Z.hash,
          ...G
        }
      } catch (Z) {}
    }
    if (Q.length === 2) G = {
      ...G,
      ...Q[1]
    };
    if (G.protocol === void 0)
      if (qy4.NODE_VERSION.major > 8) G.protocol = Xv([Xv([A, "optionalAccess", (Z) => Z.globalAgent]), "optionalAccess", (Z) => Z.protocol]) || Xv([G.agent, "optionalAccess", (Z) => Z.protocol]) || Xv([G._defaultAgent, "optionalAccess", (Z) => Z.protocol]);
      else G.protocol = Xv([G.agent, "optionalAccess", (Z) => Z.protocol]) || Xv([G._defaultAgent, "optionalAccess", (Z) => Z.protocol]) || Xv([Xv([A, "optionalAccess", (Z) => Z.globalAgent]), "optionalAccess", (Z) => Z.protocol]);
    if (B) return [G, B];
    else return [G]
  }

  function rKQ(A) {
    let Q = A.protocol || "",
      B = A.hostname || A.host || "",
      G = !A.port || A.port === 80 || A.port === 443 || /^(.*):(\d+)$/.test(B) ? "" : `:${A.port}`;
    return {
      protocol: Q,
      hostname: B,
      port: G
    }
  }
  sKQ.cleanSpanDescription = Ly4;
  sKQ.extractRawUrl = Ny4;
  sKQ.extractUrl = oKQ;
  sKQ.normalizeRequestArgs = Oy4;
  sKQ.urlToOptions = UT1
})
// @from(Ln 62553, Col 4)
qnA = U((BVQ) => {
  var {
    _optionalChain: $ZA
  } = CQ();
  Object.defineProperty(BVQ, "__esModule", {
    value: !0
  });
  var Zz = U6(),
    GL = CQ(),
    qT1 = iqA(),
    Py4 = g1A(),
    nqA = tKQ(),
    Sy4 = (A = {}) => {
      let {
        breadcrumbs: Q,
        tracing: B,
        shouldCreateSpanForRequest: G
      } = A, Z = {
        breadcrumbs: Q,
        tracing: B === !1 ? !1 : GL.dropUndefinedKeys({
          enableIfHasTracingEnabled: B === !0 ? void 0 : !0,
          shouldCreateSpanForRequest: G
        })
      };
      return new d1A(Z)
    },
    xy4 = Zz.defineIntegration(Sy4);
  class d1A {
    static __initStatic() {
      this.id = "Http"
    }
    __init() {
      this.name = d1A.id
    }
    constructor(A = {}) {
      d1A.prototype.__init.call(this), this._breadcrumbs = typeof A.breadcrumbs > "u" ? !0 : A.breadcrumbs, this._tracing = !A.tracing ? void 0 : A.tracing === !0 ? {} : A.tracing
    }
    setupOnce(A, Q) {
      let B = $ZA([Q, "call", (I) => I(), "access", (I) => I.getClient, "call", (I) => I(), "optionalAccess", (I) => I.getOptions, "call", (I) => I()]),
        G = AVQ(this._tracing, B);
      if (!this._breadcrumbs && !G) return;
      if (B && B.instrumenter !== "sentry") {
        qT1.DEBUG_BUILD && GL.logger.log("HTTP Integration is skipped because of instrumenter configuration.");
        return
      }
      let Z = QVQ(G, this._tracing, B),
        Y = $ZA([B, "optionalAccess", (I) => I.tracePropagationTargets]) || $ZA([this, "access", (I) => I._tracing, "optionalAccess", (I) => I.tracePropagationTargets]),
        J = NA("http"),
        X = eKQ(J, this._breadcrumbs, Z, Y);
      if (GL.fill(J, "get", X), GL.fill(J, "request", X), Py4.NODE_VERSION.major > 8) {
        let I = NA("https"),
          D = eKQ(I, this._breadcrumbs, Z, Y);
        GL.fill(I, "get", D), GL.fill(I, "request", D)
      }
    }
  }
  d1A.__initStatic();

  function eKQ(A, Q, B, G) {
    let Z = new GL.LRUMap(100),
      Y = new GL.LRUMap(100),
      J = (D) => {
        if (B === void 0) return !0;
        let W = Z.get(D);
        if (W !== void 0) return W;
        let K = B(D);
        return Z.set(D, K), K
      },
      X = (D) => {
        if (G === void 0) return !0;
        let W = Y.get(D);
        if (W !== void 0) return W;
        let K = GL.stringMatchesSomePattern(D, G);
        return Y.set(D, K), K
      };

    function I(D, W, K, V) {
      if (!Zz.getCurrentHub().getIntegration(d1A)) return;
      Zz.addBreadcrumb({
        category: "http",
        data: {
          status_code: V && V.statusCode,
          ...W
        },
        type: "http"
      }, {
        event: D,
        request: K,
        response: V
      })
    }
    return function (W) {
      return function (...V) {
        let F = nqA.normalizeRequestArgs(A, V),
          H = F[0],
          E = nqA.extractRawUrl(H),
          z = nqA.extractUrl(H),
          $ = Zz.getClient();
        if (Zz.isSentryRequestUrl(z, $)) return W.apply(A, F);
        let O = Zz.getCurrentScope(),
          L = Zz.getIsolationScope(),
          M = Zz.getActiveSpan(),
          _ = vy4(z, H),
          j = J(E) ? $ZA([M, "optionalAccess", (x) => x.startChild, "call", (x) => x({
            op: "http.client",
            origin: "auto.http.node.http",
            description: `${_["http.method"]} ${_.url}`,
            data: _
          })]) : void 0;
        if ($ && X(E)) {
          let {
            traceId: x,
            spanId: b,
            sampled: S,
            dsc: u
          } = {
            ...L.getPropagationContext(),
            ...O.getPropagationContext()
          }, f = j ? Zz.spanToTraceHeader(j) : GL.generateSentryTraceHeader(x, b, S), AA = GL.dynamicSamplingContextToSentryBaggageHeader(u || (j ? Zz.getDynamicSamplingContextFromSpan(j) : Zz.getDynamicSamplingContextFromClient(x, $, O)));
          yy4(H, z, f, AA)
        } else qT1.DEBUG_BUILD && GL.logger.log(`[Tracing] Not adding sentry-trace header to outgoing request (${z}) due to mismatching tracePropagationTargets option.`);
        return W.apply(A, F).once("response", function (x) {
          let b = this;
          if (Q) I("response", _, b, x);
          if (j) {
            if (x.statusCode) Zz.setHttpStatus(j, x.statusCode);
            j.updateName(nqA.cleanSpanDescription(Zz.spanToJSON(j).description || "", H, b) || ""), j.end()
          }
        }).once("error", function () {
          let x = this;
          if (Q) I("error", _, x);
          if (j) Zz.setHttpStatus(j, 500), j.updateName(nqA.cleanSpanDescription(Zz.spanToJSON(j).description || "", H, x) || ""), j.end()
        })
      }
    }
  }

  function yy4(A, Q, B, G) {
    if ((A.headers || {})["sentry-trace"]) return;
    qT1.DEBUG_BUILD && GL.logger.log(`[Tracing] Adding sentry-trace header ${B} to outgoing request to "${Q}": `), A.headers = {
      ...A.headers,
      "sentry-trace": B,
      ...G && G.length > 0 && {
        baggage: ky4(A, G)
      }
    }
  }

  function vy4(A, Q) {
    let B = Q.method || "GET",
      G = {
        url: A,
        "http.method": B
      };
    if (Q.hash) G["http.fragment"] = Q.hash.substring(1);
    if (Q.search) G["http.query"] = Q.search.substring(1);
    return G
  }

  function ky4(A, Q) {
    if (!A.headers || !A.headers.baggage) return Q;
    else if (!Q) return A.headers.baggage;
    else if (Array.isArray(A.headers.baggage)) return [...A.headers.baggage, Q];
    return [A.headers.baggage, Q]
  }

  function AVQ(A, Q) {
    return A === void 0 ? !1 : A.enableIfHasTracingEnabled ? Zz.hasTracingEnabled(Q) : !0
  }

  function QVQ(A, Q, B) {
    return A ? $ZA([Q, "optionalAccess", (Z) => Z.shouldCreateSpanForRequest]) || $ZA([B, "optionalAccess", (Z) => Z.shouldCreateSpanForRequest]) : () => !1
  }
  BVQ.Http = d1A;
  BVQ._getShouldCreateSpanForRequest = QVQ;
  BVQ._shouldCreateSpans = AVQ;
  BVQ.httpIntegration = xy4
})
// @from(Ln 62731, Col 4)
YVQ = U((ZVQ) => {
  Object.defineProperty(ZVQ, "__esModule", {
    value: !0
  });

  function uy4(A, Q, B) {
    let G = 0,
      Z = 5,
      Y = 0;
    return setInterval(() => {
      if (Y === 0) {
        if (G > A) {
          if (Z *= 2, B(Z), Z > 86400) Z = 86400;
          Y = Z
        }
      } else if (Y -= 1, Y === 0) Q();
      G = 0
    }, 1000).unref(), () => {
      G += 1
    }
  }

  function NT1(A) {
    return A !== void 0 && (A.length === 0 || A === "?" || A === "<anonymous>")
  }

  function my4(A, Q) {
    return A === Q || NT1(A) && NT1(Q)
  }

  function GVQ(A) {
    if (A === void 0) return;
    return A.slice(-10).reduce((Q, B) => `${Q},${B.function},${B.lineno},${B.colno}`, "")
  }

  function dy4(A, Q) {
    if (Q === void 0) return;
    return GVQ(A(Q, 1))
  }
  ZVQ.createRateLimiter = uy4;
  ZVQ.functionNamesMatch = my4;
  ZVQ.hashFrames = GVQ;
  ZVQ.hashFromStack = dy4;
  ZVQ.isAnonymous = NT1
})
// @from(Ln 62776, Col 4)
WVQ = U((DVQ) => {
  var {
    _optionalChain: bI
  } = CQ();
  Object.defineProperty(DVQ, "__esModule", {
    value: !0
  });
  var wT1 = U6(),
    NnA = CQ(),
    ay4 = g1A(),
    wnA = YVQ();

  function LT1(A) {
    let Q = [],
      B = !1;

    function G(J) {
      if (Q = [], B) return;
      B = !0, A(J)
    }
    Q.push(G);

    function Z(J) {
      Q.push(J)
    }

    function Y(J) {
      let X = Q.pop() || G;
      try {
        X(J)
      } catch (I) {
        G(J)
      }
    }
    return {
      add: Z,
      next: Y
    }
  }
  class JVQ {
    constructor() {
      let {
        Session: A
      } = NA("inspector");
      this._session = new A
    }
    configureAndConnect(A, Q) {
      this._session.connect(), this._session.on("Debugger.paused", (B) => {
        A(B, () => {
          this._session.post("Debugger.resume")
        })
      }), this._session.post("Debugger.enable"), this._session.post("Debugger.setPauseOnExceptions", {
        state: Q ? "all" : "uncaught"
      })
    }
    setPauseOnExceptions(A) {
      this._session.post("Debugger.setPauseOnExceptions", {
        state: A ? "all" : "uncaught"
      })
    }
    getLocalVariables(A, Q) {
      this._getProperties(A, (B) => {
        let {
          add: G,
          next: Z
        } = LT1(Q);
        for (let Y of B)
          if (bI([Y, "optionalAccess", (J) => J.value, "optionalAccess", (J) => J.objectId]) && bI([Y, "optionalAccess", (J) => J.value, "access", (J) => J.className]) === "Array") {
            let J = Y.value.objectId;
            G((X) => this._unrollArray(J, Y.name, X, Z))
          } else if (bI([Y, "optionalAccess", (J) => J.value, "optionalAccess", (J) => J.objectId]) && bI([Y, "optionalAccess", (J) => J.value, "optionalAccess", (J) => J.className]) === "Object") {
          let J = Y.value.objectId;
          G((X) => this._unrollObject(J, Y.name, X, Z))
        } else if (bI([Y, "optionalAccess", (J) => J.value, "optionalAccess", (J) => J.value]) != null || bI([Y, "optionalAccess", (J) => J.value, "optionalAccess", (J) => J.description]) != null) G((J) => this._unrollOther(Y, J, Z));
        Z({})
      })
    }
    _getProperties(A, Q) {
      this._session.post("Runtime.getProperties", {
        objectId: A,
        ownProperties: !0
      }, (B, G) => {
        if (B) Q([]);
        else Q(G.result)
      })
    }
    _unrollArray(A, Q, B, G) {
      this._getProperties(A, (Z) => {
        B[Q] = Z.filter((Y) => Y.name !== "length" && !isNaN(parseInt(Y.name, 10))).sort((Y, J) => parseInt(Y.name, 10) - parseInt(J.name, 10)).map((Y) => bI([Y, "optionalAccess", (J) => J.value, "optionalAccess", (J) => J.value])), G(B)
      })
    }
    _unrollObject(A, Q, B, G) {
      this._getProperties(A, (Z) => {
        B[Q] = Z.map((Y) => [Y.name, bI([Y, "optionalAccess", (J) => J.value, "optionalAccess", (J) => J.value])]).reduce((Y, [J, X]) => {
          return Y[J] = X, Y
        }, {}), G(B)
      })
    }
    _unrollOther(A, Q, B) {
      if (bI([A, "optionalAccess", (G) => G.value, "optionalAccess", (G) => G.value]) != null) Q[A.name] = A.value.value;
      else if (bI([A, "optionalAccess", (G) => G.value, "optionalAccess", (G) => G.description]) != null && bI([A, "optionalAccess", (G) => G.value, "optionalAccess", (G) => G.type]) !== "function") Q[A.name] = `<${A.value.description}>`;
      B(Q)
    }
  }

  function oy4() {
    try {
      return new JVQ
    } catch (A) {
      return
    }
  }
  var XVQ = "LocalVariables",
    ry4 = (A = {}, Q = oy4()) => {
      let B = new NnA.LRUMap(20),
        G, Z = !1;

      function Y(I, {
        params: {
          reason: D,
          data: W,
          callFrames: K
        }
      }, V) {
        if (D !== "exception" && D !== "promiseRejection") {
          V();
          return
        }
        bI([G, "optionalCall", (z) => z()]);
        let F = wnA.hashFromStack(I, bI([W, "optionalAccess", (z) => z.description]));
        if (F == null) {
          V();
          return
        }
        let {
          add: H,
          next: E
        } = LT1((z) => {
          B.set(F, z), V()
        });
        for (let z = 0; z < Math.min(K.length, 5); z++) {
          let {
            scopeChain: $,
            functionName: O,
            this: L
          } = K[z], M = $.find((j) => j.type === "local"), _ = L.className === "global" || !L.className ? O : `${L.className}.${O}`;
          if (bI([M, "optionalAccess", (j) => j.object, "access", (j) => j.objectId]) === void 0) H((j) => {
            j[z] = {
              function: _
            }, E(j)
          });
          else {
            let j = M.object.objectId;
            H((x) => bI([Q, "optionalAccess", (b) => b.getLocalVariables, "call", (b) => b(j, (S) => {
              x[z] = {
                function: _,
                vars: S
              }, E(x)
            })]))
          }
        }
        E([])
      }

      function J(I) {
        let D = wnA.hashFrames(bI([I, "optionalAccess", (V) => V.stacktrace, "optionalAccess", (V) => V.frames]));
        if (D === void 0) return;
        let W = B.remove(D);
        if (W === void 0) return;
        let K = (bI([I, "access", (V) => V.stacktrace, "optionalAccess", (V) => V.frames]) || []).filter((V) => V.function !== "new Promise");
        for (let V = 0; V < K.length; V++) {
          let F = K.length - V - 1;
          if (!K[F] || !W[V]) break;
          if (W[V].vars === void 0 || K[F].in_app === !1 || !wnA.functionNamesMatch(K[F].function, W[V].function)) continue;
          K[F].vars = W[V].vars
        }
      }

      function X(I) {
        for (let D of bI([I, "optionalAccess", (W) => W.exception, "optionalAccess", (W) => W.values]) || []) J(D);
        return I
      }
      return {
        name: XVQ,
        setupOnce() {
          let I = wT1.getClient(),
            D = bI([I, "optionalAccess", (W) => W.getOptions, "call", (W) => W()]);
          if (Q && bI([D, "optionalAccess", (W) => W.includeLocalVariables])) {
            if (ay4.NODE_VERSION.major < 18) {
              NnA.logger.log("The `LocalVariables` integration is only supported on Node >= v18.");
              return
            }
            let K = A.captureAllExceptions !== !1;
            if (Q.configureAndConnect((V, F) => Y(D.stackParser, V, F), K), K) {
              let V = A.maxExceptionsPerSecond || 50;
              G = wnA.createRateLimiter(V, () => {
                NnA.logger.log("Local variables rate-limit lifted."), bI([Q, "optionalAccess", (F) => F.setPauseOnExceptions, "call", (F) => F(!0)])
              }, (F) => {
                NnA.logger.log(`Local variables rate-limit exceeded. Disabling capturing of caught exceptions for ${F} seconds.`), bI([Q, "optionalAccess", (H) => H.setPauseOnExceptions, "call", (H) => H(!1)])
              })
            }
            Z = !0
          }
        },
        processEvent(I) {
          if (Z) return X(I);
          return I
        },
        _getCachedFramesCount() {
          return B.size
        },
        _getFirstCachedFrame() {
          return B.values()[0]
        }
      }
    },
    IVQ = wT1.defineIntegration(ry4),
    sy4 = wT1.convertIntegrationFnToClass(XVQ, IVQ);
  DVQ.LocalVariablesSync = sy4;
  DVQ.createCallbackList = LT1;
  DVQ.localVariablesSyncIntegration = IVQ
})
// @from(Ln 62998, Col 4)
LnA = U((VVQ) => {
  Object.defineProperty(VVQ, "__esModule", {
    value: !0
  });
  var KVQ = WVQ(),
    Qv4 = KVQ.LocalVariablesSync,
    Bv4 = KVQ.localVariablesSyncIntegration;
  VVQ.LocalVariables = Qv4;
  VVQ.localVariablesIntegration = Bv4
})
// @from(Ln 63008, Col 4)
OnA = U((CVQ) => {
  Object.defineProperty(CVQ, "__esModule", {
    value: !0
  });
  var FVQ = NA("fs"),
    HVQ = NA("path"),
    EVQ = U6(),
    OT1, zVQ = "Modules";

  function Yv4() {
    try {
      return NA.cache ? Object.keys(NA.cache) : []
    } catch (A) {
      return []
    }
  }

  function Jv4() {
    let A = NA.main && NA.main.paths || [],
      Q = Yv4(),
      B = {},
      G = {};
    return Q.forEach((Z) => {
      let Y = Z,
        J = () => {
          let X = Y;
          if (Y = HVQ.dirname(X), !Y || X === Y || G[X]) return;
          if (A.indexOf(Y) < 0) return J();
          let I = HVQ.join(X, "package.json");
          if (G[X] = !0, !FVQ.existsSync(I)) return J();
          try {
            let D = JSON.parse(FVQ.readFileSync(I, "utf8"));
            B[D.name] = D.version
          } catch (D) {}
        };
      J()
    }), B
  }

  function Xv4() {
    if (!OT1) OT1 = Jv4();
    return OT1
  }
  var Iv4 = () => {
      return {
        name: zVQ,
        setupOnce() {},
        processEvent(A) {
          return A.modules = {
            ...A.modules,
            ...Xv4()
          }, A
        }
      }
    },
    $VQ = EVQ.defineIntegration(Iv4),
    Dv4 = EVQ.convertIntegrationFnToClass(zVQ, $VQ);
  CVQ.Modules = Dv4;
  CVQ.modulesIntegration = $VQ
})
// @from(Ln 63068, Col 4)
RT1 = U((UVQ) => {
  Object.defineProperty(UVQ, "__esModule", {
    value: !0
  });
  var Vv4 = U6(),
    MnA = CQ(),
    MT1 = iqA(),
    Fv4 = 2000;

  function Hv4(A) {
    MnA.consoleSandbox(() => {
      console.error(A)
    });
    let Q = Vv4.getClient();
    if (Q === void 0) MT1.DEBUG_BUILD && MnA.logger.warn("No NodeClient was defined, we are exiting the process now."), global.process.exit(1);
    let B = Q.getOptions(),
      G = B && B.shutdownTimeout && B.shutdownTimeout > 0 && B.shutdownTimeout || Fv4;
    Q.close(G).then((Z) => {
      if (!Z) MT1.DEBUG_BUILD && MnA.logger.warn("We reached the timeout for emptying the request buffer, still exiting now!");
      global.process.exit(1)
    }, (Z) => {
      MT1.DEBUG_BUILD && MnA.logger.error(Z)
    })
  }
  UVQ.logAndExitProcess = Hv4
})
// @from(Ln 63094, Col 4)
_nA = U((OVQ) => {
  Object.defineProperty(OVQ, "__esModule", {
    value: !0
  });
  var RnA = U6(),
    zv4 = CQ(),
    $v4 = iqA(),
    qVQ = RT1(),
    NVQ = "OnUncaughtException",
    Cv4 = (A = {}) => {
      let Q = {
        exitEvenIfOtherHandlersAreRegistered: !0,
        ...A
      };
      return {
        name: NVQ,
        setupOnce() {},
        setup(B) {
          global.process.on("uncaughtException", LVQ(B, Q))
        }
      }
    },
    wVQ = RnA.defineIntegration(Cv4),
    Uv4 = RnA.convertIntegrationFnToClass(NVQ, wVQ);

  function LVQ(A, Q) {
    let G = !1,
      Z = !1,
      Y = !1,
      J, X = A.getOptions();
    return Object.assign((I) => {
      let D = qVQ.logAndExitProcess;
      if (Q.onFatalError) D = Q.onFatalError;
      else if (X.onFatalError) D = X.onFatalError;
      let K = global.process.listeners("uncaughtException").reduce((F, H) => {
          if (H.name === "domainUncaughtExceptionClear" || H.tag && H.tag === "sentry_tracingErrorCallback" || H._errorHandler) return F;
          else return F + 1
        }, 0) === 0,
        V = Q.exitEvenIfOtherHandlersAreRegistered || K;
      if (!G) {
        if (J = I, G = !0, RnA.getClient() === A) RnA.captureException(I, {
          originalException: I,
          captureContext: {
            level: "fatal"
          },
          mechanism: {
            handled: !1,
            type: "onuncaughtexception"
          }
        });
        if (!Y && V) Y = !0, D(I)
      } else if (V) {
        if (Y) $v4.DEBUG_BUILD && zv4.logger.warn("uncaught exception after calling fatal error shutdown callback - this is bad! forcing shutdown"), qVQ.logAndExitProcess(I);
        else if (!Z) Z = !0, setTimeout(() => {
          if (!Y) Y = !0, D(J, I)
        }, 2000)
      }
    }, {
      _errorHandler: !0
    })
  }
  OVQ.OnUncaughtException = Uv4;
  OVQ.makeErrorHandler = LVQ;
  OVQ.onUncaughtExceptionIntegration = wVQ
})
// @from(Ln 63159, Col 4)
TnA = U((TVQ) => {
  Object.defineProperty(TVQ, "__esModule", {
    value: !0
  });
  var jnA = U6(),
    MVQ = CQ(),
    Lv4 = RT1(),
    RVQ = "OnUnhandledRejection",
    Ov4 = (A = {}) => {
      let Q = A.mode || "warn";
      return {
        name: RVQ,
        setupOnce() {},
        setup(B) {
          global.process.on("unhandledRejection", jVQ(B, {
            mode: Q
          }))
        }
      }
    },
    _VQ = jnA.defineIntegration(Ov4),
    Mv4 = jnA.convertIntegrationFnToClass(RVQ, _VQ);

  function jVQ(A, Q) {
    return function (G, Z) {
      if (jnA.getClient() !== A) return;
      jnA.captureException(G, {
        originalException: Z,
        captureContext: {
          extra: {
            unhandledPromiseRejection: !0
          }
        },
        mechanism: {
          handled: !1,
          type: "onunhandledrejection"
        }
      }), Rv4(G, Q)
    }
  }

  function Rv4(A, Q) {
    let B = "This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason:";
    if (Q.mode === "warn") MVQ.consoleSandbox(() => {
      console.warn(B), console.error(A && A.stack ? A.stack : A)
    });
    else if (Q.mode === "strict") MVQ.consoleSandbox(() => {
      console.warn(B)
    }), Lv4.logAndExitProcess(A)
  }
  TVQ.OnUnhandledRejection = Mv4;
  TVQ.makeUnhandledPromiseHandler = jVQ;
  TVQ.onUnhandledRejectionIntegration = _VQ
})
// @from(Ln 63213, Col 4)
PnA = U((vVQ) => {
  Object.defineProperty(vVQ, "__esModule", {
    value: !0
  });
  var Pv4 = NA("http"),
    Sv4 = NA("url"),
    PVQ = U6(),
    CZA = CQ(),
    SVQ = "Spotlight",
    xv4 = (A = {}) => {
      let Q = {
        sidecarUrl: A.sidecarUrl || "http://localhost:8969/stream"
      };
      return {
        name: SVQ,
        setupOnce() {},
        setup(B) {
          if (typeof process === "object" && process.env) CZA.logger.warn("[Spotlight] It seems you're not in dev mode. Do you really want to have Spotlight enabled?");
          vv4(B, Q)
        }
      }
    },
    xVQ = PVQ.defineIntegration(xv4),
    yv4 = PVQ.convertIntegrationFnToClass(SVQ, xVQ);

  function vv4(A, Q) {
    let B = kv4(Q.sidecarUrl);
    if (!B) return;
    let G = 0;
    if (typeof A.on !== "function") {
      CZA.logger.warn("[Spotlight] Cannot connect to spotlight due to missing method on SDK client (`client.on`)");
      return
    }
    A.on("beforeEnvelope", (Z) => {
      if (G > 3) {
        CZA.logger.warn("[Spotlight] Disabled Sentry -> Spotlight integration due to too many failed requests");
        return
      }
      let Y = CZA.serializeEnvelope(Z),
        X = yVQ()({
          method: "POST",
          path: B.pathname,
          hostname: B.hostname,
          port: B.port,
          headers: {
            "Content-Type": "application/x-sentry-envelope"
          }
        }, (I) => {
          I.on("data", () => {}), I.on("end", () => {}), I.setEncoding("utf8")
        });
      X.on("error", () => {
        G++, CZA.logger.warn("[Spotlight] Failed to send envelope to Spotlight Sidecar")
      }), X.write(Y), X.end()
    })
  }

  function kv4(A) {
    try {
      return new Sv4.URL(`${A}`)
    } catch (Q) {
      CZA.logger.warn(`[Spotlight] Invalid sidecar URL: ${A}`);
      return
    }
  }

  function yVQ() {
    let {
      request: A
    } = Pv4;
    if (bv4(A)) return A.__sentry_original__;
    return A
  }

  function bv4(A) {
    return "__sentry_original__" in A
  }
  vVQ.Spotlight = yv4;
  vVQ.getNativeHttpRequest = yVQ;
  vVQ.spotlightIntegration = xVQ
})
// @from(Ln 63293, Col 4)
xnA = U((kVQ) => {
  var {
    _optionalChain: SnA
  } = CQ();
  Object.defineProperty(kVQ, "__esModule", {
    value: !0
  });
  var TW = U6(),
    c1A = CQ(),
    uv4 = g1A();
  kVQ.ChannelName = void 0;
  (function (A) {
    A.RequestCreate = "undici:request:create";
    let B = "undici:request:headers";
    A.RequestEnd = B;
    let G = "undici:request:error";
    A.RequestError = G
  })(kVQ.ChannelName || (kVQ.ChannelName = {}));
  var mv4 = (A) => {
      return new qq(A)
    },
    dv4 = TW.defineIntegration(mv4);
  class qq {
    static __initStatic() {
      this.id = "Undici"
    }
    __init() {
      this.name = qq.id
    }
    __init2() {
      this._createSpanUrlMap = new c1A.LRUMap(100)
    }
    __init3() {
      this._headersUrlMap = new c1A.LRUMap(100)
    }
    constructor(A = {}) {
      qq.prototype.__init.call(this), qq.prototype.__init2.call(this), qq.prototype.__init3.call(this), qq.prototype.__init4.call(this), qq.prototype.__init5.call(this), qq.prototype.__init6.call(this), this._options = {
        breadcrumbs: A.breadcrumbs === void 0 ? !0 : A.breadcrumbs,
        tracing: A.tracing,
        shouldCreateSpanForRequest: A.shouldCreateSpanForRequest
      }
    }
    setupOnce(A) {
      if (uv4.NODE_VERSION.major < 16) return;
      let Q;
      try {
        Q = NA("diagnostics_channel")
      } catch (B) {}
      if (!Q || !Q.subscribe) return;
      Q.subscribe(kVQ.ChannelName.RequestCreate, this._onRequestCreate), Q.subscribe(kVQ.ChannelName.RequestEnd, this._onRequestEnd), Q.subscribe(kVQ.ChannelName.RequestError, this._onRequestError)
    }
    _shouldCreateSpan(A) {
      if (this._options.tracing === !1 || this._options.tracing === void 0 && !TW.hasTracingEnabled()) return !1;
      if (this._options.shouldCreateSpanForRequest === void 0) return !0;
      let Q = this._createSpanUrlMap.get(A);
      if (Q !== void 0) return Q;
      let B = this._options.shouldCreateSpanForRequest(A);
      return this._createSpanUrlMap.set(A, B), B
    }
    __init4() {
      this._onRequestCreate = (A) => {
        if (!SnA([TW.getClient, "call", (W) => W(), "optionalAccess", (W) => W.getIntegration, "call", (W) => W(qq)])) return;
        let {
          request: Q
        } = A, B = Q.origin ? Q.origin.toString() + Q.path : Q.path, G = TW.getClient();
        if (!G) return;
        if (TW.isSentryRequestUrl(B, G) || Q.__sentry_span__ !== void 0) return;
        let Z = G.getOptions(),
          Y = TW.getCurrentScope(),
          J = TW.getIsolationScope(),
          X = TW.getActiveSpan(),
          I = this._shouldCreateSpan(B) ? pv4(X, Q, B) : void 0;
        if (I) Q.__sentry_span__ = I;
        if (((W) => {
            if (Z.tracePropagationTargets === void 0) return !0;
            let K = this._headersUrlMap.get(W);
            if (K !== void 0) return K;
            let V = c1A.stringMatchesSomePattern(W, Z.tracePropagationTargets);
            return this._headersUrlMap.set(W, V), V
          })(B)) {
          let {
            traceId: W,
            spanId: K,
            sampled: V,
            dsc: F
          } = {
            ...J.getPropagationContext(),
            ...Y.getPropagationContext()
          }, H = I ? TW.spanToTraceHeader(I) : c1A.generateSentryTraceHeader(W, K, V), E = c1A.dynamicSamplingContextToSentryBaggageHeader(F || (I ? TW.getDynamicSamplingContextFromSpan(I) : TW.getDynamicSamplingContextFromClient(W, G, Y)));
          cv4(Q, H, E)
        }
      }
    }
    __init5() {
      this._onRequestEnd = (A) => {
        if (!SnA([TW.getClient, "call", (Y) => Y(), "optionalAccess", (Y) => Y.getIntegration, "call", (Y) => Y(qq)])) return;
        let {
          request: Q,
          response: B
        } = A, G = Q.origin ? Q.origin.toString() + Q.path : Q.path;
        if (TW.isSentryRequestUrl(G, TW.getClient())) return;
        let Z = Q.__sentry_span__;
        if (Z) TW.setHttpStatus(Z, B.statusCode), Z.end();
        if (this._options.breadcrumbs) TW.addBreadcrumb({
          category: "http",
          data: {
            method: Q.method,
            status_code: B.statusCode,
            url: G
          },
          type: "http"
        }, {
          event: "response",
          request: Q,
          response: B
        })
      }
    }
    __init6() {
      this._onRequestError = (A) => {
        if (!SnA([TW.getClient, "call", (Z) => Z(), "optionalAccess", (Z) => Z.getIntegration, "call", (Z) => Z(qq)])) return;
        let {
          request: Q
        } = A, B = Q.origin ? Q.origin.toString() + Q.path : Q.path;
        if (TW.isSentryRequestUrl(B, TW.getClient())) return;
        let G = Q.__sentry_span__;
        if (G) G.setStatus("internal_error"), G.end();
        if (this._options.breadcrumbs) TW.addBreadcrumb({
          category: "http",
          data: {
            method: Q.method,
            url: B
          },
          level: "error",
          type: "http"
        }, {
          event: "error",
          request: Q
        })
      }
    }
  }
  qq.__initStatic();

  function cv4(A, Q, B) {
    let G;
    if (Array.isArray(A.headers)) G = A.headers.some((Z) => Z === "sentry-trace");
    else G = A.headers.split(`\r
`).some((Y) => Y.startsWith("sentry-trace:"));
    if (G) return;
    if (A.addHeader("sentry-trace", Q), B) A.addHeader("baggage", B)
  }

  function pv4(A, Q, B) {
    let G = c1A.parseUrl(B),
      Z = Q.method || "GET",
      Y = {
        "http.method": Z
      };
    if (G.search) Y["http.query"] = G.search;
    if (G.hash) Y["http.fragment"] = G.hash;
    return SnA([A, "optionalAccess", (J) => J.startChild, "call", (J) => J({
      op: "http.client",
      origin: "auto.http.node.undici",
      description: `${Z} ${c1A.getSanitizedUrlString(G)}`,
      data: Y
    })])
  }
  kVQ.Undici = qq;
  kVQ.nativeNodeFetchintegration = dv4
})
// @from(Ln 63464, Col 4)
_T1 = U((hVQ) => {
  Object.defineProperty(hVQ, "__esModule", {
    value: !0
  });
  var bVQ = NA("path"),
    nv4 = CQ();

  function fVQ(A) {
    return A.replace(/^[A-Z]:/, "").replace(/\\/g, "/")
  }

  function av4(A = process.argv[1] ? nv4.dirname(process.argv[1]) : process.cwd(), Q = bVQ.sep === "\\") {
    let B = Q ? fVQ(A) : A;
    return (G) => {
      if (!G) return;
      let Z = Q ? fVQ(G) : G,
        {
          dir: Y,
          base: J,
          ext: X
        } = bVQ.posix.parse(Z);
      if (X === ".js" || X === ".mjs" || X === ".cjs") J = J.slice(0, X.length * -1);
      if (!Y) Y = ".";
      let I = Y.lastIndexOf("/node_modules");
      if (I > -1) return `${Y.slice(I+14).replace(/\//g,".")}:${J}`;
      if (Y.startsWith(B)) {
        let D = Y.slice(B.length + 1).replace(/\//g, ".");
        if (D) D += ":";
        return D += J, D
      }
      return J
    }
  }
  hVQ.createGetModuleFromFilename = av4
})
// @from(Ln 63499, Col 4)
jT1 = U((cVQ) => {
  var {
    _optionalChain: rv4
  } = CQ();
  Object.defineProperty(cVQ, "__esModule", {
    value: !0
  });
  var lM = U6(),
    p1A = CQ(),
    sv4 = jKQ(),
    tv4 = VT1(),
    ev4 = znA(),
    Ak4 = $nA(),
    Qk4 = UnA(),
    Bk4 = qnA(),
    Gk4 = LnA(),
    Zk4 = OnA(),
    Yk4 = _nA(),
    Jk4 = TnA(),
    Xk4 = PnA(),
    Ik4 = xnA(),
    Dk4 = _T1(),
    Wk4 = ET1(),
    gVQ = [lM.inboundFiltersIntegration(), lM.functionToStringIntegration(), lM.linkedErrorsIntegration(), lM.requestDataIntegration(), ev4.consoleIntegration(), Bk4.httpIntegration(), Ik4.nativeNodeFetchintegration(), Yk4.onUncaughtExceptionIntegration(), Jk4.onUnhandledRejectionIntegration(), Qk4.contextLinesIntegration(), Gk4.localVariablesIntegration(), Ak4.nodeContextIntegration(), Zk4.modulesIntegration()];

  function uVQ(A) {
    let Q = lM.getMainCarrier(),
      B = rv4([Q, "access", (G) => G.__SENTRY__, "optionalAccess", (G) => G.integrations]) || [];
    return [...gVQ, ...B]
  }

  function Kk4(A = {}) {
    if (sv4.setNodeAsyncContextStrategy(), A.defaultIntegrations === void 0) A.defaultIntegrations = uVQ();
    if (A.dsn === void 0 && process.env.SENTRY_DSN) A.dsn = process.env.SENTRY_DSN;
    let Q = process.env.SENTRY_TRACES_SAMPLE_RATE;
    if (A.tracesSampleRate === void 0 && Q) {
      let G = parseFloat(Q);
      if (isFinite(G)) A.tracesSampleRate = G
    }
    if (A.release === void 0) {
      let G = mVQ();
      if (G !== void 0) A.release = G;
      else A.autoSessionTracking = !1
    }
    if (A.environment === void 0 && process.env.SENTRY_ENVIRONMENT) A.environment = process.env.SENTRY_ENVIRONMENT;
    if (A.autoSessionTracking === void 0 && A.dsn !== void 0) A.autoSessionTracking = !0;
    if (A.instrumenter === void 0) A.instrumenter = "sentry";
    let B = {
      ...A,
      stackParser: p1A.stackParserFromStackParserOptions(A.stackParser || dVQ),
      integrations: lM.getIntegrationsToSetup(A),
      transport: A.transport || Wk4.makeNodeTransport
    };
    if (lM.initAndBind(A.clientClass || tv4.NodeClient, B), A.autoSessionTracking) Fk4();
    if (Hk4(), A.spotlight) {
      let G = lM.getClient();
      if (G && G.addIntegration) {
        let Z = G.getOptions().integrations;
        for (let Y of Z) G.addIntegration(Y);
        G.addIntegration(Xk4.spotlightIntegration({
          sidecarUrl: typeof A.spotlight === "string" ? A.spotlight : void 0
        }))
      }
    }
  }

  function Vk4(A) {
    if (A === void 0) return !1;
    let Q = A && A.getOptions();
    if (Q && Q.autoSessionTracking !== void 0) return Q.autoSessionTracking;
    return !1
  }

  function mVQ(A) {
    if (process.env.SENTRY_RELEASE) return process.env.SENTRY_RELEASE;
    if (p1A.GLOBAL_OBJ.SENTRY_RELEASE && p1A.GLOBAL_OBJ.SENTRY_RELEASE.id) return p1A.GLOBAL_OBJ.SENTRY_RELEASE.id;
    return process.env.GITHUB_SHA || process.env.COMMIT_REF || process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GITHUB_COMMIT_SHA || process.env.VERCEL_GITLAB_COMMIT_SHA || process.env.VERCEL_BITBUCKET_COMMIT_SHA || process.env.ZEIT_GITHUB_COMMIT_SHA || process.env.ZEIT_GITLAB_COMMIT_SHA || process.env.ZEIT_BITBUCKET_COMMIT_SHA || process.env.CF_PAGES_COMMIT_SHA || A
  }
  var dVQ = p1A.createStackParser(p1A.nodeStackLineParser(Dk4.createGetModuleFromFilename()));

  function Fk4() {
    lM.startSession(), process.on("beforeExit", () => {
      let A = lM.getIsolationScope().getSession();
      if (A && !["exited", "crashed"].includes(A.status)) lM.endSession()
    })
  }

  function Hk4() {
    let A = (process.env.SENTRY_USE_ENVIRONMENT || "").toLowerCase();
    if (!["false", "n", "no", "off", "0"].includes(A)) {
      let Q = process.env.SENTRY_TRACE,
        B = process.env.SENTRY_BAGGAGE,
        G = p1A.propagationContextFromHeaders(Q, B);
      lM.getCurrentScope().setPropagationContext(G)
    }
  }
  cVQ.defaultIntegrations = gVQ;
  cVQ.defaultStackParser = dVQ;
  cVQ.getDefaultIntegrations = uVQ;
  cVQ.getSentryRelease = mVQ;
  cVQ.init = Kk4;
  cVQ.isAutoSessionTrackingEnabled = Vk4
})
// @from(Ln 63602, Col 4)
lVQ = U((pVQ) => {
  Object.defineProperty(pVQ, "__esModule", {
    value: !0
  });
  var ynA = NA("fs"),
    TT1 = NA("path");

  function Nk4(A) {
    let Q = TT1.resolve(A);
    if (!ynA.existsSync(Q)) throw Error(`Cannot read contents of ${Q}. Directory does not exist.`);
    if (!ynA.statSync(Q).isDirectory()) throw Error(`Cannot read contents of ${Q}, because it is not a directory.`);
    let B = (G) => {
      return ynA.readdirSync(G).reduce((Z, Y) => {
        let J = TT1.join(G, Y);
        if (ynA.statSync(J).isDirectory()) return Z.concat(B(J));
        return Z.push(J), Z
      }, [])
    };
    return B(Q).map((G) => TT1.relative(Q, G))
  }
  pVQ.deepReadDirSync = Nk4
})