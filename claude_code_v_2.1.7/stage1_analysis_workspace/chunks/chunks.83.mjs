
// @from(Ln 241378, Col 0)
function Wn8(A, Q) {
  let B = A.resetsAt,
    G = B ? iJA(B, !0) : void 0,
    Z = A.overageResetsAt ? iJA(A.overageResetsAt, !0) : void 0,
    Y = G ? ` · resets ${G}` : "";
  if (A.overageStatus === "rejected") {
    let J = "";
    if (B && A.overageResetsAt)
      if (B < A.overageResetsAt) J = ` · resets ${G}`;
      else J = ` · resets ${Z}`;
    else if (G) J = ` · resets ${G}`;
    else if (Z) J = ` · resets ${Z}`;
    if (A.overageDisabledReason === "out_of_credits") return `You're out of extra usage${J}`;
    return AKA("limit", J, Q)
  }
  if (A.rateLimitType === "seven_day_sonnet") {
    let J = N6();
    return AKA(J === "pro" || J === "enterprise" ? "weekly limit" : "Sonnet limit", Y, Q)
  }
  if (A.rateLimitType === "seven_day_opus") return AKA("Opus limit", Y, Q);
  if (A.rateLimitType === "seven_day") return AKA("weekly limit", Y, Q);
  if (A.rateLimitType === "five_hour") return AKA("session limit", Y, Q);
  return AKA("usage limit", Y, Q)
}
// @from(Ln 241403, Col 0)
function Kn8(A) {
  let Q = null;
  switch (A.rateLimitType) {
    case "seven_day":
      Q = "weekly limit";
      break;
    case "five_hour":
      Q = "session limit";
      break;
    case "seven_day_opus":
      Q = "Opus limit";
      break;
    case "seven_day_sonnet":
      Q = "Sonnet limit";
      break;
    case "overage":
      Q = "extra usage";
      break;
    case void 0:
      return null
  }
  let B = A.utilization ? Math.floor(A.utilization * 100) : void 0,
    G = A.resetsAt ? iJA(A.resetsAt, !0) : void 0,
    Z = Vn8(A.rateLimitType);
  if (B && G) {
    let J = `You've used ${B}% of your ${Q} · resets ${G}`;
    return Z ? `${J} · ${Z}` : J
  }
  if (B) {
    let J = `You've used ${B}% of your ${Q}`;
    return Z ? `${J} · ${Z}` : J
  }
  if (A.rateLimitType === "overage") Q += " limit";
  if (G) {
    let J = `Approaching ${Q} · resets ${G}`;
    return Z ? `${J} · ${Z}` : J
  }
  let Y = `Approaching ${Q}`;
  return Z ? `${Y} · ${Z}` : Y
}
// @from(Ln 241444, Col 0)
function Vn8(A) {
  let Q = N6(),
    B = v3()?.hasExtraUsageEnabled === !0;
  if (A === "five_hour") {
    if (Q === "team" || Q === "enterprise") {
      if (!B && ju()) return "/extra-usage to request more";
      return null
    }
    if (Q === "pro" || Q === "max") return "/upgrade to keep using Claude Code"
  }
  if (A === "overage") {
    if (Q === "team" || Q === "enterprise") {
      if (!B && ju()) return "/extra-usage to request more"
    }
  }
  return null
}
// @from(Ln 241462, Col 0)
function mG0(A) {
  let Q = A.resetsAt ? iJA(A.resetsAt, !0) : "",
    B = "";
  if (A.rateLimitType === "five_hour") B = "session limit";
  else if (A.rateLimitType === "seven_day") B = "weekly limit";
  else if (A.rateLimitType === "seven_day_opus") B = "Opus limit";
  else if (A.rateLimitType === "seven_day_sonnet") {
    let Z = N6();
    B = Z === "pro" || Z === "enterprise" ? "weekly limit" : "Sonnet limit"
  }
  if (!B) return "Now using extra usage";
  return `You're now using extra usage${Q?` · Your ${B} resets ${Q}`:""}`
}
// @from(Ln 241476, Col 0)
function AKA(A, Q, B) {
  return `You've hit your ${A}${Q}`
}
// @from(Ln 241479, Col 4)
Dn8
// @from(Ln 241480, Col 4)
dG0 = w(() => {
  Q2();
  GQ();
  Dn8 = ["You've hit your", "You've used", "You're now using extra usage", "You're close to", "You're out of extra usage"]
})
// @from(Ln 241486, Col 0)
function En8(A, Q) {
  let B = Date.now() / 1000,
    G = A - Q,
    Z = B - G;
  return Math.max(0, Math.min(1, Z / Q))
}
// @from(Ln 241493, Col 0)
function G51(A) {
  __ = A, cG0.forEach((B) => B(A));
  let Q = Math.round((A.resetsAt ? A.resetsAt - Date.now() / 1000 : 0) / 3600);
  l("tengu_claudeai_limits_status_changed", {
    status: A.status,
    unifiedRateLimitFallbackAvailable: A.unifiedRateLimitFallbackAvailable,
    hoursTillReset: Q
  })
}
// @from(Ln 241502, Col 0)
async function zn8() {
  let A = SD(),
    Q = await XS({
      maxRetries: 0,
      model: A
    }),
    B = [{
      role: "user",
      content: "quota"
    }],
    G = OL(A);
  return Q.beta.messages.create({
    model: A,
    max_tokens: 1,
    messages: B,
    metadata: ao(),
    ...G.length > 0 ? {
      betas: G
    } : {}
  }).asResponse()
}
// @from(Ln 241523, Col 0)
async function prB() {
  if (!eWA(qB())) return;
  try {
    let A = await zn8();
    pG0(A.headers)
  } catch (A) {
    if (A instanceof D9) lG0(A)
  }
}
// @from(Ln 241533, Col 0)
function no() {
  let [A, Q] = Z51.useState({
    ...__
  });
  return Z51.useEffect(() => {
    let B = (G) => {
      Q({
        ...G
      })
    };
    return cG0.add(B), () => {
      cG0.delete(B)
    }
  }, []), A
}
// @from(Ln 241549, Col 0)
function $n8(A, Q) {
  for (let [B, G] of Object.entries(Hn8)) {
    let Z = A.get(`anthropic-ratelimit-unified-${B}-surpassed-threshold`);
    if (Z !== null) {
      let Y = A.get(`anthropic-ratelimit-unified-${B}-utilization`),
        J = A.get(`anthropic-ratelimit-unified-${B}-reset`),
        X = Y ? Number(Y) : void 0;
      return {
        status: "allowed_warning",
        resetsAt: J ? Number(J) : void 0,
        rateLimitType: G,
        utilization: X,
        unifiedRateLimitFallbackAvailable: Q,
        isUsingOverage: !1,
        surpassedThreshold: Number(Z)
      }
    }
  }
  return null
}
// @from(Ln 241570, Col 0)
function Cn8(A, Q, B) {
  let {
    rateLimitType: G,
    claimAbbrev: Z,
    windowSeconds: Y,
    thresholds: J
  } = Q, X = A.get(`anthropic-ratelimit-unified-${Z}-utilization`), I = A.get(`anthropic-ratelimit-unified-${Z}-reset`);
  if (X === null || I === null) return null;
  let D = Number(X),
    W = Number(I),
    K = En8(W, Y);
  if (!J.some((F) => D >= F.utilization && K <= F.timePct)) return null;
  return {
    status: "allowed_warning",
    resetsAt: W,
    rateLimitType: G,
    utilization: D,
    unifiedRateLimitFallbackAvailable: B,
    isUsingOverage: !1
  }
}
// @from(Ln 241592, Col 0)
function Un8(A, Q) {
  let B = $n8(A, Q);
  if (B) return B;
  for (let G of Fn8) {
    let Z = Cn8(A, G, Q);
    if (Z) return Z
  }
  return null
}
// @from(Ln 241602, Col 0)
function lrB(A) {
  let Q = A.get("anthropic-ratelimit-unified-status") || "allowed",
    B = A.get("anthropic-ratelimit-unified-reset"),
    G = B ? Number(B) : void 0,
    Z = A.get("anthropic-ratelimit-unified-fallback") === "available",
    Y = A.get("anthropic-ratelimit-unified-representative-claim"),
    J = A.get("anthropic-ratelimit-unified-overage-status"),
    X = A.get("anthropic-ratelimit-unified-overage-reset"),
    I = X ? Number(X) : void 0,
    D = A.get("anthropic-ratelimit-unified-overage-disabled-reason"),
    W = Q === "rejected" && (J === "allowed" || J === "allowed_warning"),
    K = Q;
  if (Q === "allowed" || Q === "allowed_warning") {
    let V = Un8(A, Z);
    if (V) return V;
    K = "allowed"
  }
  return {
    status: K,
    resetsAt: G,
    unifiedRateLimitFallbackAvailable: Z,
    ...Y && {
      rateLimitType: Y
    },
    ...J && {
      overageStatus: J
    },
    ...I && {
      overageResetsAt: I
    },
    ...D && {
      overageDisabledReason: D
    },
    isUsingOverage: W
  }
}
// @from(Ln 241639, Col 0)
function pG0(A) {
  let Q = qB();
  if (!eWA(Q)) {
    if (__.status !== "allowed" || __.resetsAt) G51({
      status: "allowed",
      unifiedRateLimitFallbackAvailable: !1,
      isUsingOverage: !1
    });
    return
  }
  let B = hG0(A),
    G = lrB(B);
  if (!X1A(__, G)) G51(G)
}
// @from(Ln 241654, Col 0)
function lG0(A) {
  if (!eWA(qB()) || A.status !== 429) return;
  try {
    let Q = {
      ...__
    };
    if (A.headers) {
      let B = hG0(A.headers);
      Q = lrB(B)
    }
    if (Q.status = "rejected", !X1A(__, Q)) G51(Q)
  } catch (Q) {
    e(Q)
  }
}
// @from(Ln 241669, Col 4)
Z51
// @from(Ln 241669, Col 9)
Fn8
// @from(Ln 241669, Col 14)
Hn8
// @from(Ln 241669, Col 19)
__
// @from(Ln 241669, Col 23)
cG0
// @from(Ln 241670, Col 4)
IS = w(() => {
  OSA();
  v1();
  l2();
  Z0();
  Q2();
  RR();
  vk();
  nY();
  uO1();
  MSA();
  dG0();
  Z51 = c(QA(), 1), Fn8 = [{
    rateLimitType: "five_hour",
    claimAbbrev: "5h",
    windowSeconds: 18000,
    thresholds: [{
      utilization: 0.9,
      timePct: 0.72
    }]
  }, {
    rateLimitType: "seven_day",
    claimAbbrev: "7d",
    windowSeconds: 604800,
    thresholds: [{
      utilization: 0.75,
      timePct: 0.6
    }, {
      utilization: 0.5,
      timePct: 0.35
    }, {
      utilization: 0.25,
      timePct: 0.15
    }]
  }], Hn8 = {
    "5h": "five_hour",
    "7d": "seven_day",
    overage: "overage"
  };
  __ = {
    status: "allowed",
    unifiedRateLimitFallbackAvailable: !1,
    isUsingOverage: !1
  }, cG0 = new Set
})
// @from(Ln 241716, Col 0)
function RSA(A) {
  if (!A || typeof A !== "object") return null;
  let Q = A,
    B = 5,
    G = 0;
  while (Q && G < B) {
    if (Q instanceof Error && "code" in Q && typeof Q.code === "string") {
      let Z = Q.code,
        Y = qn8.has(Z);
      return {
        code: Z,
        message: Q.message,
        isSSLError: Y
      }
    }
    if (Q instanceof Error && "cause" in Q && Q.cause !== Q) Q = Q.cause, G++;
    else break
  }
  return null
}
// @from(Ln 241737, Col 0)
function Nn8(A) {
  let Q = A.message;
  if (!Q) return "";
  if (Q.includes("<!DOCTYPE html") || Q.includes("<html")) {
    let B = Q.match(/<title>([^<]+)<\/title>/);
    if (B && B[1]) return B[1].trim();
    return ""
  }
  return A.message
}
// @from(Ln 241748, Col 0)
function irB(A) {
  let Q = RSA(A);
  if (Q) {
    let {
      code: G,
      isSSLError: Z
    } = Q;
    if (G === "ETIMEDOUT") return "Request timed out. Check your internet connection and proxy settings";
    if (Z) switch (G) {
      case "UNABLE_TO_VERIFY_LEAF_SIGNATURE":
      case "UNABLE_TO_GET_ISSUER_CERT":
      case "UNABLE_TO_GET_ISSUER_CERT_LOCALLY":
        return "Unable to connect to API: SSL certificate verification failed. Check your proxy or corporate SSL certificates";
      case "CERT_HAS_EXPIRED":
        return "Unable to connect to API: SSL certificate has expired";
      case "CERT_REVOKED":
        return "Unable to connect to API: SSL certificate has been revoked";
      case "DEPTH_ZERO_SELF_SIGNED_CERT":
      case "SELF_SIGNED_CERT_IN_CHAIN":
        return "Unable to connect to API: Self-signed certificate detected. Check your proxy or corporate SSL certificates";
      case "ERR_TLS_CERT_ALTNAME_INVALID":
      case "HOSTNAME_MISMATCH":
        return "Unable to connect to API: SSL certificate hostname mismatch";
      case "CERT_NOT_YET_VALID":
        return "Unable to connect to API: SSL certificate is not yet valid";
      default:
        return `Unable to connect to API: SSL error (${G})`
    }
  }
  if (A.message === "Connection error.") {
    if (Q?.code) return `Unable to connect to API (${Q.code})`;
    return "Unable to connect to API. Check your internet connection"
  }
  let B = Nn8(A);
  return B !== A.message && B.length > 0 ? B : A.message
}
// @from(Ln 241784, Col 0)
async function QKA(A, Q) {
  await new Promise((B, G) => {
    let Z = setTimeout(B, A);
    if (Q) {
      let Y = () => {
        clearTimeout(Z), G(new II)
      };
      if (Q.aborted) {
        Y();
        return
      }
      Q.addEventListener("abort", Y, {
        once: !0
      }), setTimeout(() => {
        Q?.removeEventListener("abort", Y)
      }, A)
    }
  })
}
// @from(Ln 241803, Col 4)
qn8
// @from(Ln 241804, Col 4)
_9A = w(() => {
  vk();
  qn8 = new Set(["UNABLE_TO_VERIFY_LEAF_SIGNATURE", "UNABLE_TO_GET_ISSUER_CERT", "UNABLE_TO_GET_ISSUER_CERT_LOCALLY", "CERT_SIGNATURE_FAILURE", "CERT_NOT_YET_VALID", "CERT_HAS_EXPIRED", "CERT_REVOKED", "CERT_REJECTED", "CERT_UNTRUSTED", "DEPTH_ZERO_SELF_SIGNED_CERT", "SELF_SIGNED_CERT_IN_CHAIN", "CERT_CHAIN_TOO_LONG", "PATH_LENGTH_EXCEEDED", "ERR_TLS_CERT_ALTNAME_INVALID", "HOSTNAME_MISMATCH", "ERR_TLS_HANDSHAKE_TIMEOUT", "ERR_SSL_WRONG_VERSION_NUMBER", "ERR_SSL_DECRYPTION_FAILED_OR_BAD_RECORD_MAC"])
})
// @from(Ln 241808, Col 4)
arB = {}
// @from(Ln 241814, Col 0)
function nrB(A) {
  let Q = null,
    B = [],
    G = 0;
  async function Z() {
    if (!Q) Q = (async () => {
      if (!Y51) throw Error("Native image processor module not available");
      let {
        processImage: X
      } = Y51;
      return X(A)
    })();
    return Q
  }

  function Y(X) {
    for (let I = G; I < B.length; I++) {
      let D = B[I];
      if (D) D(X)
    }
    G = B.length
  }
  let J = {
    async metadata() {
      return (await Z()).metadata()
    },
    resize(X, I, D) {
      return B.push((W) => {
        W.resize(X, I, D)
      }), J
    },
    jpeg(X) {
      return B.push((I) => {
        I.jpeg(X?.quality)
      }), J
    },
    png(X) {
      return B.push((I) => {
        I.png(X)
      }), J
    },
    webp(X) {
      return B.push((I) => {
        I.webp(X?.quality)
      }), J
    },
    async toBuffer() {
      let X = await Z();
      return Y(X), X.toBuffer()
    }
  };
  return J
}
// @from(Ln 241867, Col 4)
Y51
// @from(Ln 241867, Col 9)
wn8
// @from(Ln 241868, Col 4)
orB = w(() => {
  try {
    Y51 = (() => {
      throw new Error("Cannot require module " + "../../image-processor.node");
    })()
  } catch (A) {
    Y51 = null
  }
  wn8 = nrB
})
// @from(Ln 241878, Col 4)
Gb = U((c7Z, srB) => {
  var rrB = function (A) {
      return typeof A < "u" && A !== null
    },
    Ln8 = function (A) {
      return typeof A === "object"
    },
    On8 = function (A) {
      return Object.prototype.toString.call(A) === "[object Object]"
    },
    Mn8 = function (A) {
      return typeof A === "function"
    },
    Rn8 = function (A) {
      return typeof A === "boolean"
    },
    _n8 = function (A) {
      return A instanceof Buffer
    },
    jn8 = function (A) {
      if (rrB(A)) switch (A.constructor) {
        case Uint8Array:
        case Uint8ClampedArray:
        case Int8Array:
        case Uint16Array:
        case Int16Array:
        case Uint32Array:
        case Int32Array:
        case Float32Array:
        case Float64Array:
          return !0
      }
      return !1
    },
    Tn8 = function (A) {
      return A instanceof ArrayBuffer
    },
    Pn8 = function (A) {
      return typeof A === "string" && A.length > 0
    },
    Sn8 = function (A) {
      return typeof A === "number" && !Number.isNaN(A)
    },
    xn8 = function (A) {
      return Number.isInteger(A)
    },
    yn8 = function (A, Q, B) {
      return A >= Q && A <= B
    },
    vn8 = function (A, Q) {
      return Q.includes(A)
    },
    kn8 = function (A, Q, B) {
      return Error(`Expected ${Q} for ${A} but received ${B} of type ${typeof B}`)
    },
    bn8 = function (A, Q) {
      return Q.message = A.message, Q
    };
  srB.exports = {
    defined: rrB,
    object: Ln8,
    plainObject: On8,
    fn: Mn8,
    bool: Rn8,
    buffer: _n8,
    typedArray: jn8,
    arrayBuffer: Tn8,
    string: Pn8,
    number: Sn8,
    integer: xn8,
    inRange: yn8,
    inArray: vn8,
    invalidParameterError: kn8,
    nativeError: bn8
  }
})
// @from(Ln 241954, Col 4)
AsB = U((p7Z, erB) => {
  var trB = () => process.platform === "linux",
    J51 = null,
    fn8 = () => {
      if (!J51)
        if (trB() && process.report) {
          let A = process.report.excludeNetwork;
          process.report.excludeNetwork = !0, J51 = process.report.getReport(), process.report.excludeNetwork = A
        } else J51 = {};
      return J51
    };
  erB.exports = {
    isLinux: trB,
    getReport: fn8
  }
})
// @from(Ln 241970, Col 4)
GsB = U((l7Z, BsB) => {
  var QsB = NA("fs"),
    hn8 = (A) => QsB.readFileSync(A, "utf-8"),
    gn8 = (A) => new Promise((Q, B) => {
      QsB.readFile(A, "utf-8", (G, Z) => {
        if (G) B(G);
        else Q(Z)
      })
    });
  BsB.exports = {
    LDD_PATH: "/usr/bin/ldd",
    readFileSync: hn8,
    readFile: gn8
  }
})
// @from(Ln 241985, Col 4)
I51 = U((i7Z, UsB) => {
  var YsB = NA("child_process"),
    {
      isLinux: GKA,
      getReport: JsB
    } = AsB(),
    {
      LDD_PATH: X51,
      readFile: XsB,
      readFileSync: IsB
    } = GsB(),
    Zb, Yb, oo = "",
    DsB = () => {
      if (!oo) return new Promise((A) => {
        YsB.exec("getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true", (Q, B) => {
          oo = Q ? " " : B, A(oo)
        })
      });
      return oo
    },
    WsB = () => {
      if (!oo) try {
        oo = YsB.execSync("getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true", {
          encoding: "utf8"
        })
      } catch (A) {
        oo = " "
      }
      return oo
    },
    ro = "glibc",
    KsB = /LIBC[a-z0-9 \-).]*?(\d+\.\d+)/i,
    BKA = "musl",
    un8 = (A) => A.includes("libc.musl-") || A.includes("ld-musl-"),
    VsB = () => {
      let A = JsB();
      if (A.header && A.header.glibcVersionRuntime) return ro;
      if (Array.isArray(A.sharedObjects)) {
        if (A.sharedObjects.some(un8)) return BKA
      }
      return null
    },
    FsB = (A) => {
      let [Q, B] = A.split(/[\r\n]+/);
      if (Q && Q.includes(ro)) return ro;
      if (B && B.includes(BKA)) return BKA;
      return null
    },
    HsB = (A) => {
      if (A.includes("musl")) return BKA;
      if (A.includes("GNU C Library")) return ro;
      return null
    },
    mn8 = async () => {
      if (Zb !== void 0) return Zb;
      Zb = null;
      try {
        let A = await XsB(X51);
        Zb = HsB(A)
      } catch (A) {}
      return Zb
    }, dn8 = () => {
      if (Zb !== void 0) return Zb;
      Zb = null;
      try {
        let A = IsB(X51);
        Zb = HsB(A)
      } catch (A) {}
      return Zb
    }, EsB = async () => {
      let A = null;
      if (GKA()) {
        if (A = await mn8(), !A) A = VsB();
        if (!A) {
          let Q = await DsB();
          A = FsB(Q)
        }
      }
      return A
    }, zsB = () => {
      let A = null;
      if (GKA()) {
        if (A = dn8(), !A) A = VsB();
        if (!A) {
          let Q = WsB();
          A = FsB(Q)
        }
      }
      return A
    }, cn8 = async () => GKA() && await EsB() !== ro, pn8 = () => GKA() && zsB() !== ro, ln8 = async () => {
      if (Yb !== void 0) return Yb;
      Yb = null;
      try {
        let Q = (await XsB(X51)).match(KsB);
        if (Q) Yb = Q[1]
      } catch (A) {}
      return Yb
    }, in8 = () => {
      if (Yb !== void 0) return Yb;
      Yb = null;
      try {
        let Q = IsB(X51).match(KsB);
        if (Q) Yb = Q[1]
      } catch (A) {}
      return Yb
    }, $sB = () => {
      let A = JsB();
      if (A.header && A.header.glibcVersionRuntime) return A.header.glibcVersionRuntime;
      return null
    }, ZsB = (A) => A.trim().split(/\s+/)[1], CsB = (A) => {
      let [Q, B, G] = A.split(/[\r\n]+/);
      if (Q && Q.includes(ro)) return ZsB(Q);
      if (B && G && B.includes(BKA)) return ZsB(G);
      return null
    }, nn8 = async () => {
      let A = null;
      if (GKA()) {
        if (A = await ln8(), !A) A = $sB();
        if (!A) {
          let Q = await DsB();
          A = CsB(Q)
        }
      }
      return A
    }, an8 = () => {
      let A = null;
      if (GKA()) {
        if (A = in8(), !A) A = $sB();
        if (!A) {
          let Q = WsB();
          A = CsB(Q)
        }
      }
      return A
    };
  UsB.exports = {
    GLIBC: ro,
    MUSL: BKA,
    family: EsB,
    familySync: zsB,
    isNonGlibcLinux: cn8,
    isNonGlibcLinuxSync: pn8,
    version: nn8,
    versionSync: an8
  }
})
// @from(Ln 242131, Col 4)
_SA = U((n7Z, qsB) => {
  var on8 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...A) => console.error("SEMVER", ...A) : () => {};
  qsB.exports = on8
})
// @from(Ln 242135, Col 4)
D51 = U((a7Z, NsB) => {
  var rn8 = Number.MAX_SAFE_INTEGER || 9007199254740991,
    sn8 = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];
  NsB.exports = {
    MAX_LENGTH: 256,
    MAX_SAFE_COMPONENT_LENGTH: 16,
    MAX_SAFE_BUILD_LENGTH: 250,
    MAX_SAFE_INTEGER: rn8,
    RELEASE_TYPES: sn8,
    SEMVER_SPEC_VERSION: "2.0.0",
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }
})
// @from(Ln 242149, Col 4)
jSA = U((Jb, wsB) => {
  var {
    MAX_SAFE_COMPONENT_LENGTH: iG0,
    MAX_SAFE_BUILD_LENGTH: tn8,
    MAX_LENGTH: en8
  } = D51(), Aa8 = _SA();
  Jb = wsB.exports = {};
  var Qa8 = Jb.re = [],
    Ba8 = Jb.safeRe = [],
    u2 = Jb.src = [],
    Ga8 = Jb.safeSrc = [],
    m2 = Jb.t = {},
    Za8 = 0,
    nG0 = "[a-zA-Z0-9-]",
    Ya8 = [
      ["\\s", 1],
      ["\\d", en8],
      [nG0, tn8]
    ],
    Ja8 = (A) => {
      for (let [Q, B] of Ya8) A = A.split(`${Q}*`).join(`${Q}{0,${B}}`).split(`${Q}+`).join(`${Q}{1,${B}}`);
      return A
    },
    N3 = (A, Q, B) => {
      let G = Ja8(Q),
        Z = Za8++;
      Aa8(A, Z, Q), m2[A] = Z, u2[Z] = Q, Ga8[Z] = G, Qa8[Z] = new RegExp(Q, B ? "g" : void 0), Ba8[Z] = new RegExp(G, B ? "g" : void 0)
    };
  N3("NUMERICIDENTIFIER", "0|[1-9]\\d*");
  N3("NUMERICIDENTIFIERLOOSE", "\\d+");
  N3("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${nG0}*`);
  N3("MAINVERSION", `(${u2[m2.NUMERICIDENTIFIER]})\\.(${u2[m2.NUMERICIDENTIFIER]})\\.(${u2[m2.NUMERICIDENTIFIER]})`);
  N3("MAINVERSIONLOOSE", `(${u2[m2.NUMERICIDENTIFIERLOOSE]})\\.(${u2[m2.NUMERICIDENTIFIERLOOSE]})\\.(${u2[m2.NUMERICIDENTIFIERLOOSE]})`);
  N3("PRERELEASEIDENTIFIER", `(?:${u2[m2.NUMERICIDENTIFIER]}|${u2[m2.NONNUMERICIDENTIFIER]})`);
  N3("PRERELEASEIDENTIFIERLOOSE", `(?:${u2[m2.NUMERICIDENTIFIERLOOSE]}|${u2[m2.NONNUMERICIDENTIFIER]})`);
  N3("PRERELEASE", `(?:-(${u2[m2.PRERELEASEIDENTIFIER]}(?:\\.${u2[m2.PRERELEASEIDENTIFIER]})*))`);
  N3("PRERELEASELOOSE", `(?:-?(${u2[m2.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${u2[m2.PRERELEASEIDENTIFIERLOOSE]})*))`);
  N3("BUILDIDENTIFIER", `${nG0}+`);
  N3("BUILD", `(?:\\+(${u2[m2.BUILDIDENTIFIER]}(?:\\.${u2[m2.BUILDIDENTIFIER]})*))`);
  N3("FULLPLAIN", `v?${u2[m2.MAINVERSION]}${u2[m2.PRERELEASE]}?${u2[m2.BUILD]}?`);
  N3("FULL", `^${u2[m2.FULLPLAIN]}$`);
  N3("LOOSEPLAIN", `[v=\\s]*${u2[m2.MAINVERSIONLOOSE]}${u2[m2.PRERELEASELOOSE]}?${u2[m2.BUILD]}?`);
  N3("LOOSE", `^${u2[m2.LOOSEPLAIN]}$`);
  N3("GTLT", "((?:<|>)?=?)");
  N3("XRANGEIDENTIFIERLOOSE", `${u2[m2.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
  N3("XRANGEIDENTIFIER", `${u2[m2.NUMERICIDENTIFIER]}|x|X|\\*`);
  N3("XRANGEPLAIN", `[v=\\s]*(${u2[m2.XRANGEIDENTIFIER]})(?:\\.(${u2[m2.XRANGEIDENTIFIER]})(?:\\.(${u2[m2.XRANGEIDENTIFIER]})(?:${u2[m2.PRERELEASE]})?${u2[m2.BUILD]}?)?)?`);
  N3("XRANGEPLAINLOOSE", `[v=\\s]*(${u2[m2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${u2[m2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${u2[m2.XRANGEIDENTIFIERLOOSE]})(?:${u2[m2.PRERELEASELOOSE]})?${u2[m2.BUILD]}?)?)?`);
  N3("XRANGE", `^${u2[m2.GTLT]}\\s*${u2[m2.XRANGEPLAIN]}$`);
  N3("XRANGELOOSE", `^${u2[m2.GTLT]}\\s*${u2[m2.XRANGEPLAINLOOSE]}$`);
  N3("COERCEPLAIN", `(^|[^\\d])(\\d{1,${iG0}})(?:\\.(\\d{1,${iG0}}))?(?:\\.(\\d{1,${iG0}}))?`);
  N3("COERCE", `${u2[m2.COERCEPLAIN]}(?:$|[^\\d])`);
  N3("COERCEFULL", u2[m2.COERCEPLAIN] + `(?:${u2[m2.PRERELEASE]})?(?:${u2[m2.BUILD]})?(?:$|[^\\d])`);
  N3("COERCERTL", u2[m2.COERCE], !0);
  N3("COERCERTLFULL", u2[m2.COERCEFULL], !0);
  N3("LONETILDE", "(?:~>?)");
  N3("TILDETRIM", `(\\s*)${u2[m2.LONETILDE]}\\s+`, !0);
  Jb.tildeTrimReplace = "$1~";
  N3("TILDE", `^${u2[m2.LONETILDE]}${u2[m2.XRANGEPLAIN]}$`);
  N3("TILDELOOSE", `^${u2[m2.LONETILDE]}${u2[m2.XRANGEPLAINLOOSE]}$`);
  N3("LONECARET", "(?:\\^)");
  N3("CARETTRIM", `(\\s*)${u2[m2.LONECARET]}\\s+`, !0);
  Jb.caretTrimReplace = "$1^";
  N3("CARET", `^${u2[m2.LONECARET]}${u2[m2.XRANGEPLAIN]}$`);
  N3("CARETLOOSE", `^${u2[m2.LONECARET]}${u2[m2.XRANGEPLAINLOOSE]}$`);
  N3("COMPARATORLOOSE", `^${u2[m2.GTLT]}\\s*(${u2[m2.LOOSEPLAIN]})$|^$`);
  N3("COMPARATOR", `^${u2[m2.GTLT]}\\s*(${u2[m2.FULLPLAIN]})$|^$`);
  N3("COMPARATORTRIM", `(\\s*)${u2[m2.GTLT]}\\s*(${u2[m2.LOOSEPLAIN]}|${u2[m2.XRANGEPLAIN]})`, !0);
  Jb.comparatorTrimReplace = "$1$2$3";
  N3("HYPHENRANGE", `^\\s*(${u2[m2.XRANGEPLAIN]})\\s+-\\s+(${u2[m2.XRANGEPLAIN]})\\s*$`);
  N3("HYPHENRANGELOOSE", `^\\s*(${u2[m2.XRANGEPLAINLOOSE]})\\s+-\\s+(${u2[m2.XRANGEPLAINLOOSE]})\\s*$`);
  N3("STAR", "(<|>)?=?\\s*\\*");
  N3("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
  N3("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$")
})
// @from(Ln 242224, Col 4)
W51 = U((o7Z, LsB) => {
  var Xa8 = Object.freeze({
      loose: !0
    }),
    Ia8 = Object.freeze({}),
    Da8 = (A) => {
      if (!A) return Ia8;
      if (typeof A !== "object") return Xa8;
      return A
    };
  LsB.exports = Da8
})
// @from(Ln 242236, Col 4)
_sB = U((r7Z, RsB) => {
  var OsB = /^[0-9]+$/,
    MsB = (A, Q) => {
      let B = OsB.test(A),
        G = OsB.test(Q);
      if (B && G) A = +A, Q = +Q;
      return A === Q ? 0 : B && !G ? -1 : G && !B ? 1 : A < Q ? -1 : 1
    },
    Wa8 = (A, Q) => MsB(Q, A);
  RsB.exports = {
    compareIdentifiers: MsB,
    rcompareIdentifiers: Wa8
  }
})
// @from(Ln 242250, Col 4)
YKA = U((s7Z, SsB) => {
  var K51 = _SA(),
    {
      MAX_LENGTH: jsB,
      MAX_SAFE_INTEGER: V51
    } = D51(),
    {
      safeRe: TsB,
      safeSrc: PsB,
      t: F51
    } = jSA(),
    Ka8 = W51(),
    {
      compareIdentifiers: ZKA
    } = _sB();
  class DS {
    constructor(A, Q) {
      if (Q = Ka8(Q), A instanceof DS)
        if (A.loose === !!Q.loose && A.includePrerelease === !!Q.includePrerelease) return A;
        else A = A.version;
      else if (typeof A !== "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof A}".`);
      if (A.length > jsB) throw TypeError(`version is longer than ${jsB} characters`);
      K51("SemVer", A, Q), this.options = Q, this.loose = !!Q.loose, this.includePrerelease = !!Q.includePrerelease;
      let B = A.trim().match(Q.loose ? TsB[F51.LOOSE] : TsB[F51.FULL]);
      if (!B) throw TypeError(`Invalid Version: ${A}`);
      if (this.raw = A, this.major = +B[1], this.minor = +B[2], this.patch = +B[3], this.major > V51 || this.major < 0) throw TypeError("Invalid major version");
      if (this.minor > V51 || this.minor < 0) throw TypeError("Invalid minor version");
      if (this.patch > V51 || this.patch < 0) throw TypeError("Invalid patch version");
      if (!B[4]) this.prerelease = [];
      else this.prerelease = B[4].split(".").map((G) => {
        if (/^[0-9]+$/.test(G)) {
          let Z = +G;
          if (Z >= 0 && Z < V51) return Z
        }
        return G
      });
      this.build = B[5] ? B[5].split(".") : [], this.format()
    }
    format() {
      if (this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
      return this.version
    }
    toString() {
      return this.version
    }
    compare(A) {
      if (K51("SemVer.compare", this.version, this.options, A), !(A instanceof DS)) {
        if (typeof A === "string" && A === this.version) return 0;
        A = new DS(A, this.options)
      }
      if (A.version === this.version) return 0;
      return this.compareMain(A) || this.comparePre(A)
    }
    compareMain(A) {
      if (!(A instanceof DS)) A = new DS(A, this.options);
      return ZKA(this.major, A.major) || ZKA(this.minor, A.minor) || ZKA(this.patch, A.patch)
    }
    comparePre(A) {
      if (!(A instanceof DS)) A = new DS(A, this.options);
      if (this.prerelease.length && !A.prerelease.length) return -1;
      else if (!this.prerelease.length && A.prerelease.length) return 1;
      else if (!this.prerelease.length && !A.prerelease.length) return 0;
      let Q = 0;
      do {
        let B = this.prerelease[Q],
          G = A.prerelease[Q];
        if (K51("prerelease compare", Q, B, G), B === void 0 && G === void 0) return 0;
        else if (G === void 0) return 1;
        else if (B === void 0) return -1;
        else if (B === G) continue;
        else return ZKA(B, G)
      } while (++Q)
    }
    compareBuild(A) {
      if (!(A instanceof DS)) A = new DS(A, this.options);
      let Q = 0;
      do {
        let B = this.build[Q],
          G = A.build[Q];
        if (K51("build compare", Q, B, G), B === void 0 && G === void 0) return 0;
        else if (G === void 0) return 1;
        else if (B === void 0) return -1;
        else if (B === G) continue;
        else return ZKA(B, G)
      } while (++Q)
    }
    inc(A, Q, B) {
      if (A.startsWith("pre")) {
        if (!Q && B === !1) throw Error("invalid increment argument: identifier is empty");
        if (Q) {
          let G = new RegExp(`^${this.options.loose?PsB[F51.PRERELEASELOOSE]:PsB[F51.PRERELEASE]}$`),
            Z = `-${Q}`.match(G);
          if (!Z || Z[1] !== Q) throw Error(`invalid identifier: ${Q}`)
        }
      }
      switch (A) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", Q, B);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", Q, B);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", Q, B), this.inc("pre", Q, B);
          break;
        case "prerelease":
          if (this.prerelease.length === 0) this.inc("patch", Q, B);
          this.inc("pre", Q, B);
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
          let G = Number(B) ? 1 : 0;
          if (this.prerelease.length === 0) this.prerelease = [G];
          else {
            let Z = this.prerelease.length;
            while (--Z >= 0)
              if (typeof this.prerelease[Z] === "number") this.prerelease[Z]++, Z = -2;
            if (Z === -1) {
              if (Q === this.prerelease.join(".") && B === !1) throw Error("invalid increment argument: identifier already exists");
              this.prerelease.push(G)
            }
          }
          if (Q) {
            let Z = [Q, G];
            if (B === !1) Z = [Q];
            if (ZKA(this.prerelease[0], Q) === 0) {
              if (isNaN(this.prerelease[1])) this.prerelease = Z
            } else this.prerelease = Z
          }
          break
        }
        default:
          throw Error(`invalid increment argument: ${A}`)
      }
      if (this.raw = this.format(), this.build.length) this.raw += `+${this.build.join(".")}`;
      return this
    }
  }
  SsB.exports = DS
})
// @from(Ln 242405, Col 4)
vsB = U((t7Z, ysB) => {
  var xsB = YKA(),
    Va8 = (A, Q, B = !1) => {
      if (A instanceof xsB) return A;
      try {
        return new xsB(A, Q)
      } catch (G) {
        if (!B) return null;
        throw G
      }
    };
  ysB.exports = Va8
})
// @from(Ln 242418, Col 4)
bsB = U((e7Z, ksB) => {
  var Fa8 = YKA(),
    Ha8 = vsB(),
    {
      safeRe: H51,
      t: E51
    } = jSA(),
    Ea8 = (A, Q) => {
      if (A instanceof Fa8) return A;
      if (typeof A === "number") A = String(A);
      if (typeof A !== "string") return null;
      Q = Q || {};
      let B = null;
      if (!Q.rtl) B = A.match(Q.includePrerelease ? H51[E51.COERCEFULL] : H51[E51.COERCE]);
      else {
        let I = Q.includePrerelease ? H51[E51.COERCERTLFULL] : H51[E51.COERCERTL],
          D;
        while ((D = I.exec(A)) && (!B || B.index + B[0].length !== A.length)) {
          if (!B || D.index + D[0].length !== B.index + B[0].length) B = D;
          I.lastIndex = D.index + D[1].length + D[2].length
        }
        I.lastIndex = -1
      }
      if (B === null) return null;
      let G = B[2],
        Z = B[3] || "0",
        Y = B[4] || "0",
        J = Q.includePrerelease && B[5] ? `-${B[5]}` : "",
        X = Q.includePrerelease && B[6] ? `+${B[6]}` : "";
      return Ha8(`${G}.${Z}.${Y}${J}${X}`, Q)
    };
  ksB.exports = Ea8
})
// @from(Ln 242451, Col 4)
j9A = U((AGZ, hsB) => {
  var fsB = YKA(),
    za8 = (A, Q, B) => new fsB(A, B).compare(new fsB(Q, B));
  hsB.exports = za8
})
// @from(Ln 242456, Col 4)
aG0 = U((QGZ, gsB) => {
  var $a8 = j9A(),
    Ca8 = (A, Q, B) => $a8(A, Q, B) >= 0;
  gsB.exports = Ca8
})
// @from(Ln 242461, Col 4)
dsB = U((BGZ, msB) => {
  class usB {
    constructor() {
      this.max = 1000, this.map = new Map
    }
    get(A) {
      let Q = this.map.get(A);
      if (Q === void 0) return;
      else return this.map.delete(A), this.map.set(A, Q), Q
    }
    delete(A) {
      return this.map.delete(A)
    }
    set(A, Q) {
      if (!this.delete(A) && Q !== void 0) {
        if (this.map.size >= this.max) {
          let G = this.map.keys().next().value;
          this.delete(G)
        }
        this.map.set(A, Q)
      }
      return this
    }
  }
  msB.exports = usB
})
// @from(Ln 242487, Col 4)
psB = U((GGZ, csB) => {
  var Ua8 = j9A(),
    qa8 = (A, Q, B) => Ua8(A, Q, B) === 0;
  csB.exports = qa8
})
// @from(Ln 242492, Col 4)
isB = U((ZGZ, lsB) => {
  var Na8 = j9A(),
    wa8 = (A, Q, B) => Na8(A, Q, B) !== 0;
  lsB.exports = wa8
})
// @from(Ln 242497, Col 4)
asB = U((YGZ, nsB) => {
  var La8 = j9A(),
    Oa8 = (A, Q, B) => La8(A, Q, B) > 0;
  nsB.exports = Oa8
})
// @from(Ln 242502, Col 4)
rsB = U((JGZ, osB) => {
  var Ma8 = j9A(),
    Ra8 = (A, Q, B) => Ma8(A, Q, B) < 0;
  osB.exports = Ra8
})
// @from(Ln 242507, Col 4)
tsB = U((XGZ, ssB) => {
  var _a8 = j9A(),
    ja8 = (A, Q, B) => _a8(A, Q, B) <= 0;
  ssB.exports = ja8
})
// @from(Ln 242512, Col 4)
AtB = U((IGZ, esB) => {
  var Ta8 = psB(),
    Pa8 = isB(),
    Sa8 = asB(),
    xa8 = aG0(),
    ya8 = rsB(),
    va8 = tsB(),
    ka8 = (A, Q, B, G) => {
      switch (Q) {
        case "===":
          if (typeof A === "object") A = A.version;
          if (typeof B === "object") B = B.version;
          return A === B;
        case "!==":
          if (typeof A === "object") A = A.version;
          if (typeof B === "object") B = B.version;
          return A !== B;
        case "":
        case "=":
        case "==":
          return Ta8(A, B, G);
        case "!=":
          return Pa8(A, B, G);
        case ">":
          return Sa8(A, B, G);
        case ">=":
          return xa8(A, B, G);
        case "<":
          return ya8(A, B, G);
        case "<=":
          return va8(A, B, G);
        default:
          throw TypeError(`Invalid operator: ${Q}`)
      }
    };
  esB.exports = ka8
})
// @from(Ln 242549, Col 4)
XtB = U((DGZ, JtB) => {
  var TSA = Symbol("SemVer ANY");
  class z51 {
    static get ANY() {
      return TSA
    }
    constructor(A, Q) {
      if (Q = QtB(Q), A instanceof z51)
        if (A.loose === !!Q.loose) return A;
        else A = A.value;
      if (A = A.trim().split(/\s+/).join(" "), rG0("comparator", A, Q), this.options = Q, this.loose = !!Q.loose, this.parse(A), this.semver === TSA) this.value = "";
      else this.value = this.operator + this.semver.version;
      rG0("comp", this)
    }
    parse(A) {
      let Q = this.options.loose ? BtB[GtB.COMPARATORLOOSE] : BtB[GtB.COMPARATOR],
        B = A.match(Q);
      if (!B) throw TypeError(`Invalid comparator: ${A}`);
      if (this.operator = B[1] !== void 0 ? B[1] : "", this.operator === "=") this.operator = "";
      if (!B[2]) this.semver = TSA;
      else this.semver = new ZtB(B[2], this.options.loose)
    }
    toString() {
      return this.value
    }
    test(A) {
      if (rG0("Comparator.test", A, this.options.loose), this.semver === TSA || A === TSA) return !0;
      if (typeof A === "string") try {
        A = new ZtB(A, this.options)
      } catch (Q) {
        return !1
      }
      return oG0(A, this.operator, this.semver, this.options)
    }
    intersects(A, Q) {
      if (!(A instanceof z51)) throw TypeError("a Comparator is required");
      if (this.operator === "") {
        if (this.value === "") return !0;
        return new YtB(A.value, Q).test(this.value)
      } else if (A.operator === "") {
        if (A.value === "") return !0;
        return new YtB(this.value, Q).test(A.semver)
      }
      if (Q = QtB(Q), Q.includePrerelease && (this.value === "<0.0.0-0" || A.value === "<0.0.0-0")) return !1;
      if (!Q.includePrerelease && (this.value.startsWith("<0.0.0") || A.value.startsWith("<0.0.0"))) return !1;
      if (this.operator.startsWith(">") && A.operator.startsWith(">")) return !0;
      if (this.operator.startsWith("<") && A.operator.startsWith("<")) return !0;
      if (this.semver.version === A.semver.version && this.operator.includes("=") && A.operator.includes("=")) return !0;
      if (oG0(this.semver, "<", A.semver, Q) && this.operator.startsWith(">") && A.operator.startsWith("<")) return !0;
      if (oG0(this.semver, ">", A.semver, Q) && this.operator.startsWith("<") && A.operator.startsWith(">")) return !0;
      return !1
    }
  }
  JtB.exports = z51;
  var QtB = W51(),
    {
      safeRe: BtB,
      t: GtB
    } = jSA(),
    oG0 = AtB(),
    rG0 = _SA(),
    ZtB = YKA(),
    YtB = sG0()
})
// @from(Ln 242613, Col 4)
sG0 = U((WGZ, KtB) => {
  var ba8 = /\s+/g;
  class PSA {
    constructor(A, Q) {
      if (Q = ha8(Q), A instanceof PSA)
        if (A.loose === !!Q.loose && A.includePrerelease === !!Q.includePrerelease) return A;
        else return new PSA(A.raw, Q);
      if (A instanceof tG0) return this.raw = A.value, this.set = [
        [A]
      ], this.formatted = void 0, this;
      if (this.options = Q, this.loose = !!Q.loose, this.includePrerelease = !!Q.includePrerelease, this.raw = A.trim().replace(ba8, " "), this.set = this.raw.split("||").map((B) => this.parseRange(B.trim())).filter((B) => B.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        let B = this.set[0];
        if (this.set = this.set.filter((G) => !DtB(G[0])), this.set.length === 0) this.set = [B];
        else if (this.set.length > 1) {
          for (let G of this.set)
            if (G.length === 1 && la8(G[0])) {
              this.set = [G];
              break
            }
        }
      }
      this.formatted = void 0
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let A = 0; A < this.set.length; A++) {
          if (A > 0) this.formatted += "||";
          let Q = this.set[A];
          for (let B = 0; B < Q.length; B++) {
            if (B > 0) this.formatted += " ";
            this.formatted += Q[B].toString().trim()
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
    parseRange(A) {
      let B = ((this.options.includePrerelease && ca8) | (this.options.loose && pa8)) + ":" + A,
        G = ItB.get(B);
      if (G) return G;
      let Z = this.options.loose,
        Y = Z ? UN[fC.HYPHENRANGELOOSE] : UN[fC.HYPHENRANGE];
      A = A.replace(Y, Qo8(this.options.includePrerelease)), _J("hyphen replace", A), A = A.replace(UN[fC.COMPARATORTRIM], ua8), _J("comparator trim", A), A = A.replace(UN[fC.TILDETRIM], ma8), _J("tilde trim", A), A = A.replace(UN[fC.CARETTRIM], da8), _J("caret trim", A);
      let J = A.split(" ").map((W) => ia8(W, this.options)).join(" ").split(/\s+/).map((W) => Ao8(W, this.options));
      if (Z) J = J.filter((W) => {
        return _J("loose invalid filter", W, this.options), !!W.match(UN[fC.COMPARATORLOOSE])
      });
      _J("range list", J);
      let X = new Map,
        I = J.map((W) => new tG0(W, this.options));
      for (let W of I) {
        if (DtB(W)) return [W];
        X.set(W.value, W)
      }
      if (X.size > 1 && X.has("")) X.delete("");
      let D = [...X.values()];
      return ItB.set(B, D), D
    }
    intersects(A, Q) {
      if (!(A instanceof PSA)) throw TypeError("a Range is required");
      return this.set.some((B) => {
        return WtB(B, Q) && A.set.some((G) => {
          return WtB(G, Q) && B.every((Z) => {
            return G.every((Y) => {
              return Z.intersects(Y, Q)
            })
          })
        })
      })
    }
    test(A) {
      if (!A) return !1;
      if (typeof A === "string") try {
        A = new ga8(A, this.options)
      } catch (Q) {
        return !1
      }
      for (let Q = 0; Q < this.set.length; Q++)
        if (Bo8(this.set[Q], A, this.options)) return !0;
      return !1
    }
  }
  KtB.exports = PSA;
  var fa8 = dsB(),
    ItB = new fa8,
    ha8 = W51(),
    tG0 = XtB(),
    _J = _SA(),
    ga8 = YKA(),
    {
      safeRe: UN,
      t: fC,
      comparatorTrimReplace: ua8,
      tildeTrimReplace: ma8,
      caretTrimReplace: da8
    } = jSA(),
    {
      FLAG_INCLUDE_PRERELEASE: ca8,
      FLAG_LOOSE: pa8
    } = D51(),
    DtB = (A) => A.value === "<0.0.0-0",
    la8 = (A) => A.value === "",
    WtB = (A, Q) => {
      let B = !0,
        G = A.slice(),
        Z = G.pop();
      while (B && G.length) B = G.every((Y) => {
        return Z.intersects(Y, Q)
      }), Z = G.pop();
      return B
    },
    ia8 = (A, Q) => {
      return _J("comp", A, Q), A = oa8(A, Q), _J("caret", A), A = na8(A, Q), _J("tildes", A), A = sa8(A, Q), _J("xrange", A), A = ea8(A, Q), _J("stars", A), A
    },
    hC = (A) => !A || A.toLowerCase() === "x" || A === "*",
    na8 = (A, Q) => {
      return A.trim().split(/\s+/).map((B) => aa8(B, Q)).join(" ")
    },
    aa8 = (A, Q) => {
      let B = Q.loose ? UN[fC.TILDELOOSE] : UN[fC.TILDE];
      return A.replace(B, (G, Z, Y, J, X) => {
        _J("tilde", A, G, Z, Y, J, X);
        let I;
        if (hC(Z)) I = "";
        else if (hC(Y)) I = `>=${Z}.0.0 <${+Z+1}.0.0-0`;
        else if (hC(J)) I = `>=${Z}.${Y}.0 <${Z}.${+Y+1}.0-0`;
        else if (X) _J("replaceTilde pr", X), I = `>=${Z}.${Y}.${J}-${X} <${Z}.${+Y+1}.0-0`;
        else I = `>=${Z}.${Y}.${J} <${Z}.${+Y+1}.0-0`;
        return _J("tilde return", I), I
      })
    },
    oa8 = (A, Q) => {
      return A.trim().split(/\s+/).map((B) => ra8(B, Q)).join(" ")
    },
    ra8 = (A, Q) => {
      _J("caret", A, Q);
      let B = Q.loose ? UN[fC.CARETLOOSE] : UN[fC.CARET],
        G = Q.includePrerelease ? "-0" : "";
      return A.replace(B, (Z, Y, J, X, I) => {
        _J("caret", A, Z, Y, J, X, I);
        let D;
        if (hC(Y)) D = "";
        else if (hC(J)) D = `>=${Y}.0.0${G} <${+Y+1}.0.0-0`;
        else if (hC(X))
          if (Y === "0") D = `>=${Y}.${J}.0${G} <${Y}.${+J+1}.0-0`;
          else D = `>=${Y}.${J}.0${G} <${+Y+1}.0.0-0`;
        else if (I)
          if (_J("replaceCaret pr", I), Y === "0")
            if (J === "0") D = `>=${Y}.${J}.${X}-${I} <${Y}.${J}.${+X+1}-0`;
            else D = `>=${Y}.${J}.${X}-${I} <${Y}.${+J+1}.0-0`;
        else D = `>=${Y}.${J}.${X}-${I} <${+Y+1}.0.0-0`;
        else if (_J("no pr"), Y === "0")
          if (J === "0") D = `>=${Y}.${J}.${X}${G} <${Y}.${J}.${+X+1}-0`;
          else D = `>=${Y}.${J}.${X}${G} <${Y}.${+J+1}.0-0`;
        else D = `>=${Y}.${J}.${X} <${+Y+1}.0.0-0`;
        return _J("caret return", D), D
      })
    },
    sa8 = (A, Q) => {
      return _J("replaceXRanges", A, Q), A.split(/\s+/).map((B) => ta8(B, Q)).join(" ")
    },
    ta8 = (A, Q) => {
      A = A.trim();
      let B = Q.loose ? UN[fC.XRANGELOOSE] : UN[fC.XRANGE];
      return A.replace(B, (G, Z, Y, J, X, I) => {
        _J("xRange", A, G, Z, Y, J, X, I);
        let D = hC(Y),
          W = D || hC(J),
          K = W || hC(X),
          V = K;
        if (Z === "=" && V) Z = "";
        if (I = Q.includePrerelease ? "-0" : "", D)
          if (Z === ">" || Z === "<") G = "<0.0.0-0";
          else G = "*";
        else if (Z && V) {
          if (W) J = 0;
          if (X = 0, Z === ">")
            if (Z = ">=", W) Y = +Y + 1, J = 0, X = 0;
            else J = +J + 1, X = 0;
          else if (Z === "<=")
            if (Z = "<", W) Y = +Y + 1;
            else J = +J + 1;
          if (Z === "<") I = "-0";
          G = `${Z+Y}.${J}.${X}${I}`
        } else if (W) G = `>=${Y}.0.0${I} <${+Y+1}.0.0-0`;
        else if (K) G = `>=${Y}.${J}.0${I} <${Y}.${+J+1}.0-0`;
        return _J("xRange return", G), G
      })
    },
    ea8 = (A, Q) => {
      return _J("replaceStars", A, Q), A.trim().replace(UN[fC.STAR], "")
    },
    Ao8 = (A, Q) => {
      return _J("replaceGTE0", A, Q), A.trim().replace(UN[Q.includePrerelease ? fC.GTE0PRE : fC.GTE0], "")
    },
    Qo8 = (A) => (Q, B, G, Z, Y, J, X, I, D, W, K, V) => {
      if (hC(G)) B = "";
      else if (hC(Z)) B = `>=${G}.0.0${A?"-0":""}`;
      else if (hC(Y)) B = `>=${G}.${Z}.0${A?"-0":""}`;
      else if (J) B = `>=${B}`;
      else B = `>=${B}${A?"-0":""}`;
      if (hC(D)) I = "";
      else if (hC(W)) I = `<${+D+1}.0.0-0`;
      else if (hC(K)) I = `<${D}.${+W+1}.0-0`;
      else if (V) I = `<=${D}.${W}.${K}-${V}`;
      else if (A) I = `<${D}.${W}.${+K+1}-0`;
      else I = `<=${I}`;
      return `${B} ${I}`.trim()
    },
    Bo8 = (A, Q, B) => {
      for (let G = 0; G < A.length; G++)
        if (!A[G].test(Q)) return !1;
      if (Q.prerelease.length && !B.includePrerelease) {
        for (let G = 0; G < A.length; G++) {
          if (_J(A[G].semver), A[G].semver === tG0.ANY) continue;
          if (A[G].semver.prerelease.length > 0) {
            let Z = A[G].semver;
            if (Z.major === Q.major && Z.minor === Q.minor && Z.patch === Q.patch) return !0
          }
        }
        return !1
      }
      return !0
    }
})
// @from(Ln 242846, Col 4)
FtB = U((KGZ, VtB) => {
  var Go8 = sG0(),
    Zo8 = (A, Q, B) => {
      try {
        Q = new Go8(Q, B)
      } catch (G) {
        return !1
      }
      return Q.test(A)
    };
  VtB.exports = Zo8
})
// @from(Ln 242858, Col 4)
eG0 = U((VGZ, Yo8) => {
  Yo8.exports = {
    name: "sharp",
    description: "High performance Node.js image processing, the fastest module to resize JPEG, PNG, WebP, GIF, AVIF and TIFF images",
    version: "0.33.5",
    author: "Lovell Fuller <npm@lovell.info>",
    homepage: "https://sharp.pixelplumbing.com",
    contributors: ["Pierre Inglebert <pierre.inglebert@gmail.com>", "Jonathan Ong <jonathanrichardong@gmail.com>", "Chanon Sajjamanochai <chanon.s@gmail.com>", "Juliano Julio <julianojulio@gmail.com>", "Daniel Gasienica <daniel@gasienica.ch>", "Julian Walker <julian@fiftythree.com>", "Amit Pitaru <pitaru.amit@gmail.com>", "Brandon Aaron <hello.brandon@aaron.sh>", "Andreas Lind <andreas@one.com>", "Maurus Cuelenaere <mcuelenaere@gmail.com>", "Linus Unnebäck <linus@folkdatorn.se>", "Victor Mateevitsi <mvictoras@gmail.com>", "Alaric Holloway <alaric.holloway@gmail.com>", "Bernhard K. Weisshuhn <bkw@codingforce.com>", "Chris Riley <criley@primedia.com>", "David Carley <dacarley@gmail.com>", "John Tobin <john@limelightmobileinc.com>", "Kenton Gray <kentongray@gmail.com>", "Felix Bünemann <Felix.Buenemann@gmail.com>", "Samy Al Zahrani <samyalzahrany@gmail.com>", "Chintan Thakkar <lemnisk8@gmail.com>", "F. Orlando Galashan <frulo@gmx.de>", "Kleis Auke Wolthuizen <info@kleisauke.nl>", "Matt Hirsch <mhirsch@media.mit.edu>", "Matthias Thoemmes <thoemmes@gmail.com>", "Patrick Paskaris <patrick@paskaris.gr>", "Jérémy Lal <kapouer@melix.org>", "Rahul Nanwani <r.nanwani@gmail.com>", "Alice Monday <alice0meta@gmail.com>", "Kristo Jorgenson <kristo.jorgenson@gmail.com>", "YvesBos <yves_bos@outlook.com>", "Guy Maliar <guy@tailorbrands.com>", "Nicolas Coden <nicolas@ncoden.fr>", "Matt Parrish <matt.r.parrish@gmail.com>", "Marcel Bretschneider <marcel.bretschneider@gmail.com>", "Matthew McEachen <matthew+github@mceachen.org>", "Jarda Kotěšovec <jarda.kotesovec@gmail.com>", "Kenric D'Souza <kenric.dsouza@gmail.com>", "Oleh Aleinyk <oleg.aleynik@gmail.com>", "Marcel Bretschneider <marcel.bretschneider@gmail.com>", "Andrea Bianco <andrea.bianco@unibas.ch>", "Rik Heywood <rik@rik.org>", "Thomas Parisot <hi@oncletom.io>", "Nathan Graves <nathanrgraves+github@gmail.com>", "Tom Lokhorst <tom@lokhorst.eu>", "Espen Hovlandsdal <espen@hovlandsdal.com>", "Sylvain Dumont <sylvain.dumont35@gmail.com>", "Alun Davies <alun.owain.davies@googlemail.com>", "Aidan Hoolachan <ajhoolachan21@gmail.com>", "Axel Eirola <axel.eirola@iki.fi>", "Freezy <freezy@xbmc.org>", "Daiz <taneli.vatanen@gmail.com>", "Julian Aubourg <j@ubourg.net>", "Keith Belovay <keith@picthrive.com>", "Michael B. Klein <mbklein@gmail.com>", "Jordan Prudhomme <jordan@raboland.fr>", "Ilya Ovdin <iovdin@gmail.com>", "Andargor <andargor@yahoo.com>", "Paul Neave <paul.neave@gmail.com>", "Brendan Kennedy <brenwken@gmail.com>", "Brychan Bennett-Odlum <git@brychan.io>", "Edward Silverton <e.silverton@gmail.com>", "Roman Malieiev <aromaleev@gmail.com>", "Tomas Szabo <tomas.szabo@deftomat.com>", "Robert O'Rourke <robert@o-rourke.org>", "Guillermo Alfonso Varela Chouciño <guillevch@gmail.com>", "Christian Flintrup <chr@gigahost.dk>", "Manan Jadhav <manan@motionden.com>", "Leon Radley <leon@radley.se>", "alza54 <alza54@thiocod.in>", "Jacob Smith <jacob@frende.me>", "Michael Nutt <michael@nutt.im>", "Brad Parham <baparham@gmail.com>", "Taneli Vatanen <taneli.vatanen@gmail.com>", "Joris Dugué <zaruike10@gmail.com>", "Chris Banks <christopher.bradley.banks@gmail.com>", "Ompal Singh <ompal.hitm09@gmail.com>", "Brodan <christopher.hranj@gmail.com>", "Ankur Parihar <ankur.github@gmail.com>", "Brahim Ait elhaj <brahima@gmail.com>", "Mart Jansink <m.jansink@gmail.com>", "Lachlan Newman <lachnewman007@gmail.com>", "Dennis Beatty <dennis@dcbeatty.com>", "Ingvar Stepanyan <me@rreverser.com>", "Don Denton <don@happycollision.com>"],
    scripts: {
      install: "node install/check",
      clean: "rm -rf src/build/ .nyc_output/ coverage/ test/fixtures/output.*",
      test: "npm run test-lint && npm run test-unit && npm run test-licensing && npm run test-types",
      "test-lint": "semistandard && cpplint",
      "test-unit": "nyc --reporter=lcov --reporter=text --check-coverage --branches=100 mocha",
      "test-licensing": 'license-checker --production --summary --onlyAllow="Apache-2.0;BSD;ISC;LGPL-3.0-or-later;MIT"',
      "test-leak": "./test/leak/leak.sh",
      "test-types": "tsd",
      "package-from-local-build": "node npm/from-local-build",
      "package-from-github-release": "node npm/from-github-release",
      "docs-build": "node docs/build && node docs/search-index/build",
      "docs-serve": "cd docs && npx serve",
      "docs-publish": "cd docs && npx firebase-tools deploy --project pixelplumbing --only hosting:pixelplumbing-sharp"
    },
    type: "commonjs",
    main: "lib/index.js",
    types: "lib/index.d.ts",
    files: ["install", "lib", "src/*.{cc,h,gyp}"],
    repository: {
      type: "git",
      url: "git://github.com/lovell/sharp.git"
    },
    keywords: ["jpeg", "png", "webp", "avif", "tiff", "gif", "svg", "jp2", "dzi", "image", "resize", "thumbnail", "crop", "embed", "libvips", "vips"],
    dependencies: {
      color: "^4.2.3",
      "detect-libc": "^2.0.3",
      semver: "^7.6.3"
    },
    optionalDependencies: {
      "@img/sharp-darwin-arm64": "0.33.5",
      "@img/sharp-darwin-x64": "0.33.5",
      "@img/sharp-libvips-darwin-arm64": "1.0.4",
      "@img/sharp-libvips-darwin-x64": "1.0.4",
      "@img/sharp-libvips-linux-arm": "1.0.5",
      "@img/sharp-libvips-linux-arm64": "1.0.4",
      "@img/sharp-libvips-linux-s390x": "1.0.4",
      "@img/sharp-libvips-linux-x64": "1.0.4",
      "@img/sharp-libvips-linuxmusl-arm64": "1.0.4",
      "@img/sharp-libvips-linuxmusl-x64": "1.0.4",
      "@img/sharp-linux-arm": "0.33.5",
      "@img/sharp-linux-arm64": "0.33.5",
      "@img/sharp-linux-s390x": "0.33.5",
      "@img/sharp-linux-x64": "0.33.5",
      "@img/sharp-linuxmusl-arm64": "0.33.5",
      "@img/sharp-linuxmusl-x64": "0.33.5",
      "@img/sharp-wasm32": "0.33.5",
      "@img/sharp-win32-ia32": "0.33.5",
      "@img/sharp-win32-x64": "0.33.5"
    },
    devDependencies: {
      "@emnapi/runtime": "^1.2.0",
      "@img/sharp-libvips-dev": "1.0.4",
      "@img/sharp-libvips-dev-wasm32": "1.0.5",
      "@img/sharp-libvips-win32-ia32": "1.0.4",
      "@img/sharp-libvips-win32-x64": "1.0.4",
      "@types/node": "*",
      async: "^3.2.5",
      cc: "^3.0.1",
      emnapi: "^1.2.0",
      "exif-reader": "^2.0.1",
      "extract-zip": "^2.0.1",
      icc: "^3.0.0",
      "jsdoc-to-markdown": "^8.0.3",
      "license-checker": "^25.0.1",
      mocha: "^10.7.3",
      "node-addon-api": "^8.1.0",
      nyc: "^17.0.0",
      prebuild: "^13.0.1",
      semistandard: "^17.0.0",
      "tar-fs": "^3.0.6",
      tsd: "^0.31.1"
    },
    license: "Apache-2.0",
    engines: {
      node: "^18.17.0 || ^20.3.0 || >=21.0.0"
    },
    config: {
      libvips: ">=8.15.3"
    },
    funding: {
      url: "https://opencollective.com/libvips"
    },
    binary: {
      napi_versions: [9]
    },
    semistandard: {
      env: ["mocha"]
    },
    cc: {
      linelength: "120",
      filter: ["build/include"]
    },
    nyc: {
      include: ["lib"]
    },
    tsd: {
      directory: "test/types/"
    }
  }
})
// @from(Ln 242967, Col 4)
QZ0 = U((FGZ, LtB) => {
  var {
    spawnSync: $51
  } = NA("node:child_process"), {
    createHash: Jo8
  } = NA("node:crypto"), $tB = bsB(), Xo8 = aG0(), Io8 = FtB(), HtB = I51(), {
    config: Do8,
    engines: EtB,
    optionalDependencies: Wo8
  } = eG0(), Ko8 = process.env.npm_package_config_libvips || Do8.libvips, CtB = $tB(Ko8).version, Vo8 = ["darwin-arm64", "darwin-x64", "linux-arm", "linux-arm64", "linux-s390x", "linux-x64", "linuxmusl-arm64", "linuxmusl-x64", "win32-ia32", "win32-x64"], C51 = {
    encoding: "utf8",
    shell: !0
  }, Fo8 = (A) => {
    if (A instanceof Error) console.error(`sharp: Installation error: ${A.message}`);
    else console.log(`sharp: ${A}`)
  }, UtB = () => HtB.isNonGlibcLinuxSync() ? HtB.familySync() : "", Ho8 = () => `${process.platform}${UtB()}-${process.arch}`, JKA = () => {
    if (qtB()) return "wasm32";
    let {
      npm_config_arch: A,
      npm_config_platform: Q,
      npm_config_libc: B
    } = process.env, G = typeof B === "string" ? B : UtB();
    return `${Q||process.platform}${G}-${A||process.arch}`
  }, Eo8 = () => {
    try {
      return NA(`@img/sharp-libvips-dev-${JKA()}/include`)
    } catch {
      try {
        return (() => {
          throw new Error("Cannot require module " + "@img/sharp-libvips-dev/include");
        })()
      } catch {}
    }
    return ""
  }, zo8 = () => {
    try {
      return (() => {
        throw new Error("Cannot require module " + "@img/sharp-libvips-dev/cplusplus");
      })()
    } catch {}
    return ""
  }, $o8 = () => {
    try {
      return NA(`@img/sharp-libvips-dev-${JKA()}/lib`)
    } catch {
      try {
        return NA(`@img/sharp-libvips-${JKA()}/lib`)
      } catch {}
    }
    return ""
  }, Co8 = () => {
    if (process.release?.name === "node" && process.versions) {
      if (!Io8(process.versions.node, EtB.node)) return {
        found: process.versions.node,
        expected: EtB.node
      }
    }
  }, qtB = () => {
    let {
      CC: A
    } = process.env;
    return Boolean(A && A.endsWith("/emcc"))
  }, Uo8 = () => {
    if (process.platform === "darwin" && process.arch === "x64") return ($51("sysctl sysctl.proc_translated", C51).stdout || "").trim() === "sysctl.proc_translated: 1";
    return !1
  }, ztB = (A) => Jo8("sha512").update(A).digest("hex"), qo8 = () => {
    try {
      let A = ztB(`imgsharp-libvips-${JKA()}`),
        Q = $tB(Wo8[`@img/sharp-libvips-${JKA()}`]).version;
      return ztB(`${A}npm:${Q}`).slice(0, 10)
    } catch {}
    return ""
  }, No8 = () => $51(`node-gyp rebuild --directory=src ${qtB()?"--nodedir=emscripten":""}`, {
    ...C51,
    stdio: "inherit"
  }).status, NtB = () => {
    if (process.platform !== "win32") return ($51("pkg-config --modversion vips-cpp", {
      ...C51,
      env: {
        ...process.env,
        PKG_CONFIG_PATH: wtB()
      }
    }).stdout || "").trim();
    else return ""
  }, wtB = () => {
    if (process.platform !== "win32") return [($51('which brew >/dev/null 2>&1 && brew environment --plain | grep PKG_CONFIG_LIBDIR | cut -d" " -f2', C51).stdout || "").trim(), process.env.PKG_CONFIG_PATH, "/usr/local/lib/pkgconfig", "/usr/lib/pkgconfig", "/usr/local/libdata/pkgconfig", "/usr/libdata/pkgconfig"].filter(Boolean).join(":");
    else return ""
  }, AZ0 = (A, Q, B) => {
    if (B) B(`Detected ${Q}, skipping search for globally-installed libvips`);
    return A
  }, wo8 = (A) => {
    if (Boolean(process.env.SHARP_IGNORE_GLOBAL_LIBVIPS) === !0) return AZ0(!1, "SHARP_IGNORE_GLOBAL_LIBVIPS", A);
    if (Boolean(process.env.SHARP_FORCE_GLOBAL_LIBVIPS) === !0) return AZ0(!0, "SHARP_FORCE_GLOBAL_LIBVIPS", A);
    if (Uo8()) return AZ0(!1, "Rosetta", A);
    let Q = NtB();
    return !!Q && Xo8(Q, CtB)
  };
  LtB.exports = {
    minimumLibvipsVersion: CtB,
    prebuiltPlatforms: Vo8,
    buildPlatformArch: JKA,
    buildSharpLibvipsIncludeDir: Eo8,
    buildSharpLibvipsCPlusPlusDir: zo8,
    buildSharpLibvipsLibDir: $o8,
    isUnsupportedNodeRuntime: Co8,
    runtimePlatformArch: Ho8,
    log: Fo8,
    yarnLocator: qo8,
    spawnRebuild: No8,
    globalLibvipsVersion: NtB,
    pkgConfigPath: wtB,
    useGlobalLibvips: wo8
  }
})
// @from(Ln 243081, Col 4)
SSA = U((EGZ, MtB) => {
  var {
    familySync: Lo8,
    versionSync: Oo8
  } = I51(), {
    runtimePlatformArch: Mo8,
    isUnsupportedNodeRuntime: OtB,
    prebuiltPlatforms: Ro8,
    minimumLibvipsVersion: _o8
  } = QZ0(), T9A = Mo8(), jo8 = [`../src/build/Release/sharp-${T9A}.node`, "../src/build/Release/sharp-wasm32.node", `@img/sharp-${T9A}/sharp.node`, "@img/sharp-wasm32/sharp.node"], BZ0, U51 = [];
  for (let A of jo8) try {
    BZ0 = NA(A);
    break
  } catch (Q) {
    U51.push(Q)
  }
  if (BZ0) MtB.exports = BZ0;
  else {
    let [A, Q, B] = ["linux", "darwin", "win32"].map((Y) => T9A.startsWith(Y)), G = [`Could not load the "sharp" module using the ${T9A} runtime`];
    U51.forEach((Y) => {
      if (Y.code !== "MODULE_NOT_FOUND") G.push(`${Y.code}: ${Y.message}`)
    });
    let Z = U51.map((Y) => Y.message).join(" ");
    if (G.push("Possible solutions:"), OtB()) {
      let {
        found: Y,
        expected: J
      } = OtB();
      G.push("- Please upgrade Node.js:", `    Found ${Y}`, `    Requires ${J}`)
    } else if (Ro8.includes(T9A)) {
      let [Y, J] = T9A.split("-"), X = Y.endsWith("musl") ? " --libc=musl" : "";
      G.push("- Ensure optional dependencies can be installed:", "    npm install --include=optional sharp", "- Ensure your package manager supports multi-platform installation:", "    See https://sharp.pixelplumbing.com/install#cross-platform", "- Add platform-specific dependencies:", `    npm install --os=${Y.replace("musl","")}${X} --cpu=${J} sharp`)
    } else G.push(`- Manually install libvips >= ${_o8}`, "- Add experimental WebAssembly-based dependencies:", "    npm install --cpu=wasm32 sharp", "    npm install @img/sharp-wasm32");
    if (A && /(symbol not found|CXXABI_)/i.test(Z)) try {
      let {
        config: Y
      } = NA(`@img/sharp-libvips-${T9A}/package`), J = `${Lo8()} ${Oo8()}`, X = `${Y.musl?"musl":"glibc"} ${Y.musl||Y.glibc}`;
      G.push("- Update your OS:", `    Found ${J}`, `    Requires ${X}`)
    } catch (Y) {}
    if (A && /\/snap\/core[0-9]{2}/.test(Z)) G.push("- Remove the Node.js Snap, which does not support native modules", "    snap remove node");
    if (Q && /Incompatible library version/.test(Z)) G.push("- Update Homebrew:", "    brew update && brew upgrade vips");
    if (U51.some((Y) => Y.code === "ERR_DLOPEN_DISABLED")) G.push("- Run Node.js without using the --no-addons flag");
    if (B && /The specified procedure could not be found/.test(Z)) G.push("- Using the canvas package on Windows?", "    See https://sharp.pixelplumbing.com/install#canvas-and-windows", "- Check for outdated versions of sharp in the dependency tree:", "    npm ls sharp");
    throw G.push("- Consult the installation documentation:", "    See https://sharp.pixelplumbing.com/install"), Error(G.join(`
`))
  }
})
// @from(Ln 243128, Col 4)
_tB = U(($GZ, RtB) => {
  var To8 = NA("node:util"),
    GZ0 = NA("node:stream"),
    Po8 = Gb();
  SSA();
  var So8 = To8.debuglog("sharp"),
    P9A = function (A, Q) {
      if (arguments.length === 1 && !Po8.defined(A)) throw Error("Invalid input");
      if (!(this instanceof P9A)) return new P9A(A, Q);
      return GZ0.Duplex.call(this), this.options = {
        topOffsetPre: -1,
        leftOffsetPre: -1,
        widthPre: -1,
        heightPre: -1,
        topOffsetPost: -1,
        leftOffsetPost: -1,
        widthPost: -1,
        heightPost: -1,
        width: -1,
        height: -1,
        canvas: "crop",
        position: 0,
        resizeBackground: [0, 0, 0, 255],
        useExifOrientation: !1,
        angle: 0,
        rotationAngle: 0,
        rotationBackground: [0, 0, 0, 255],
        rotateBeforePreExtract: !1,
        flip: !1,
        flop: !1,
        extendTop: 0,
        extendBottom: 0,
        extendLeft: 0,
        extendRight: 0,
        extendBackground: [0, 0, 0, 255],
        extendWith: "background",
        withoutEnlargement: !1,
        withoutReduction: !1,
        affineMatrix: [],
        affineBackground: [0, 0, 0, 255],
        affineIdx: 0,
        affineIdy: 0,
        affineOdx: 0,
        affineOdy: 0,
        affineInterpolator: this.constructor.interpolators.bilinear,
        kernel: "lanczos3",
        fastShrinkOnLoad: !0,
        tint: [-1, 0, 0, 0],
        flatten: !1,
        flattenBackground: [0, 0, 0],
        unflatten: !1,
        negate: !1,
        negateAlpha: !0,
        medianSize: 0,
        blurSigma: 0,
        precision: "integer",
        minAmpl: 0.2,
        sharpenSigma: 0,
        sharpenM1: 1,
        sharpenM2: 2,
        sharpenX1: 2,
        sharpenY2: 10,
        sharpenY3: 20,
        threshold: 0,
        thresholdGrayscale: !0,
        trimBackground: [],
        trimThreshold: -1,
        trimLineArt: !1,
        gamma: 0,
        gammaOut: 0,
        greyscale: !1,
        normalise: !1,
        normaliseLower: 1,
        normaliseUpper: 99,
        claheWidth: 0,
        claheHeight: 0,
        claheMaxSlope: 3,
        brightness: 1,
        saturation: 1,
        hue: 0,
        lightness: 0,
        booleanBufferIn: null,
        booleanFileIn: "",
        joinChannelIn: [],
        extractChannel: -1,
        removeAlpha: !1,
        ensureAlpha: -1,
        colourspace: "srgb",
        colourspacePipeline: "last",
        composite: [],
        fileOut: "",
        formatOut: "input",
        streamOut: !1,
        keepMetadata: 0,
        withMetadataOrientation: -1,
        withMetadataDensity: 0,
        withIccProfile: "",
        withExif: {},
        withExifMerge: !0,
        resolveWithObject: !1,
        jpegQuality: 80,
        jpegProgressive: !1,
        jpegChromaSubsampling: "4:2:0",
        jpegTrellisQuantisation: !1,
        jpegOvershootDeringing: !1,
        jpegOptimiseScans: !1,
        jpegOptimiseCoding: !0,
        jpegQuantisationTable: 0,
        pngProgressive: !1,
        pngCompressionLevel: 6,
        pngAdaptiveFiltering: !1,
        pngPalette: !1,
        pngQuality: 100,
        pngEffort: 7,
        pngBitdepth: 8,
        pngDither: 1,
        jp2Quality: 80,
        jp2TileHeight: 512,
        jp2TileWidth: 512,
        jp2Lossless: !1,
        jp2ChromaSubsampling: "4:4:4",
        webpQuality: 80,
        webpAlphaQuality: 100,
        webpLossless: !1,
        webpNearLossless: !1,
        webpSmartSubsample: !1,
        webpPreset: "default",
        webpEffort: 4,
        webpMinSize: !1,
        webpMixed: !1,
        gifBitdepth: 8,
        gifEffort: 7,
        gifDither: 1,
        gifInterFrameMaxError: 0,
        gifInterPaletteMaxError: 3,
        gifReuse: !0,
        gifProgressive: !1,
        tiffQuality: 80,
        tiffCompression: "jpeg",
        tiffPredictor: "horizontal",
        tiffPyramid: !1,
        tiffMiniswhite: !1,
        tiffBitdepth: 8,
        tiffTile: !1,
        tiffTileHeight: 256,
        tiffTileWidth: 256,
        tiffXres: 1,
        tiffYres: 1,
        tiffResolutionUnit: "inch",
        heifQuality: 50,
        heifLossless: !1,
        heifCompression: "av1",
        heifEffort: 4,
        heifChromaSubsampling: "4:4:4",
        heifBitdepth: 8,
        jxlDistance: 1,
        jxlDecodingTier: 0,
        jxlEffort: 7,
        jxlLossless: !1,
        rawDepth: "uchar",
        tileSize: 256,
        tileOverlap: 0,
        tileContainer: "fs",
        tileLayout: "dz",
        tileFormat: "last",
        tileDepth: "last",
        tileAngle: 0,
        tileSkipBlanks: -1,
        tileBackground: [255, 255, 255, 255],
        tileCentre: !1,
        tileId: "https://example.com/iiif",
        tileBasename: "",
        timeoutSeconds: 0,
        linearA: [],
        linearB: [],
        debuglog: (B) => {
          this.emit("warning", B), So8(B)
        },
        queueListener: function (B) {
          P9A.queue.emit("change", B)
        }
      }, this.options.input = this._createInputDescriptor(A, Q, {
        allowStream: !0
      }), this
    };
  Object.setPrototypeOf(P9A.prototype, GZ0.Duplex.prototype);
  Object.setPrototypeOf(P9A, GZ0.Duplex);

  function xo8() {
    let A = this.constructor.call(),
      {
        debuglog: Q,
        queueListener: B,
        ...G
      } = this.options;
    if (A.options = structuredClone(G), A.options.debuglog = Q, A.options.queueListener = B, this._isStreamInput()) this.on("finish", () => {
      this._flattenBufferIn(), A.options.input.buffer = this.options.input.buffer, A.emit("finish")
    });
    return A
  }
  Object.assign(P9A.prototype, {
    clone: xo8
  });
  RtB.exports = P9A
})
// @from(Ln 243333, Col 4)
ZZ0 = U((CGZ, jtB) => {
  jtB.exports = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50]
  }
})
// @from(Ln 243485, Col 4)
PtB = U((UGZ, TtB) => {
  TtB.exports = function (Q) {
    if (!Q || typeof Q === "string") return !1;
    return Q instanceof Array || Array.isArray(Q) || Q.length >= 0 && (Q.splice instanceof Function || Object.getOwnPropertyDescriptor(Q, Q.length - 1) && Q.constructor.name !== "String")
  }
})
// @from(Ln 243491, Col 4)
ytB = U((qGZ, xtB) => {
  var yo8 = PtB(),
    vo8 = Array.prototype.concat,
    ko8 = Array.prototype.slice,
    StB = xtB.exports = function (Q) {
      var B = [];
      for (var G = 0, Z = Q.length; G < Z; G++) {
        var Y = Q[G];
        if (yo8(Y)) B = vo8.call(B, ko8.call(Y));
        else B.push(Y)
      }
      return B
    };
  StB.wrap = function (A) {
    return function () {
      return A(StB(arguments))
    }
  }
})
// @from(Ln 243510, Col 4)
ftB = U((NGZ, btB) => {
  var ySA = ZZ0(),
    vSA = ytB(),
    vtB = Object.hasOwnProperty,
    ktB = Object.create(null);
  for (xSA in ySA)
    if (vtB.call(ySA, xSA)) ktB[ySA[xSA]] = xSA;
  var xSA, ZO = btB.exports = {
    to: {},
    get: {}
  };
  ZO.get = function (A) {
    var Q = A.substring(0, 3).toLowerCase(),
      B, G;
    switch (Q) {
      case "hsl":
        B = ZO.get.hsl(A), G = "hsl";
        break;
      case "hwb":
        B = ZO.get.hwb(A), G = "hwb";
        break;
      default:
        B = ZO.get.rgb(A), G = "rgb";
        break
    }
    if (!B) return null;
    return {
      model: G,
      value: B
    }
  };
  ZO.get.rgb = function (A) {
    if (!A) return null;
    var Q = /^#([a-f0-9]{3,4})$/i,
      B = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i,
      G = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/,
      Z = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/,
      Y = /^(\w+)$/,
      J = [0, 0, 0, 1],
      X, I, D;
    if (X = A.match(B)) {
      D = X[2], X = X[1];
      for (I = 0; I < 3; I++) {
        var W = I * 2;
        J[I] = parseInt(X.slice(W, W + 2), 16)
      }
      if (D) J[3] = parseInt(D, 16) / 255
    } else if (X = A.match(Q)) {
      X = X[1], D = X[3];
      for (I = 0; I < 3; I++) J[I] = parseInt(X[I] + X[I], 16);
      if (D) J[3] = parseInt(D + D, 16) / 255
    } else if (X = A.match(G)) {
      for (I = 0; I < 3; I++) J[I] = parseInt(X[I + 1], 0);
      if (X[4])
        if (X[5]) J[3] = parseFloat(X[4]) * 0.01;
        else J[3] = parseFloat(X[4])
    } else if (X = A.match(Z)) {
      for (I = 0; I < 3; I++) J[I] = Math.round(parseFloat(X[I + 1]) * 2.55);
      if (X[4])
        if (X[5]) J[3] = parseFloat(X[4]) * 0.01;
        else J[3] = parseFloat(X[4])
    } else if (X = A.match(Y)) {
      if (X[1] === "transparent") return [0, 0, 0, 0];
      if (!vtB.call(ySA, X[1])) return null;
      return J = ySA[X[1]], J[3] = 1, J
    } else return null;
    for (I = 0; I < 3; I++) J[I] = so(J[I], 0, 255);
    return J[3] = so(J[3], 0, 1), J
  };
  ZO.get.hsl = function (A) {
    if (!A) return null;
    var Q = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/,
      B = A.match(Q);
    if (B) {
      var G = parseFloat(B[4]),
        Z = (parseFloat(B[1]) % 360 + 360) % 360,
        Y = so(parseFloat(B[2]), 0, 100),
        J = so(parseFloat(B[3]), 0, 100),
        X = so(isNaN(G) ? 1 : G, 0, 1);
      return [Z, Y, J, X]
    }
    return null
  };
  ZO.get.hwb = function (A) {
    if (!A) return null;
    var Q = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/,
      B = A.match(Q);
    if (B) {
      var G = parseFloat(B[4]),
        Z = (parseFloat(B[1]) % 360 + 360) % 360,
        Y = so(parseFloat(B[2]), 0, 100),
        J = so(parseFloat(B[3]), 0, 100),
        X = so(isNaN(G) ? 1 : G, 0, 1);
      return [Z, Y, J, X]
    }
    return null
  };
  ZO.to.hex = function () {
    var A = vSA(arguments);
    return "#" + q51(A[0]) + q51(A[1]) + q51(A[2]) + (A[3] < 1 ? q51(Math.round(A[3] * 255)) : "")
  };
  ZO.to.rgb = function () {
    var A = vSA(arguments);
    return A.length < 4 || A[3] === 1 ? "rgb(" + Math.round(A[0]) + ", " + Math.round(A[1]) + ", " + Math.round(A[2]) + ")" : "rgba(" + Math.round(A[0]) + ", " + Math.round(A[1]) + ", " + Math.round(A[2]) + ", " + A[3] + ")"
  };
  ZO.to.rgb.percent = function () {
    var A = vSA(arguments),
      Q = Math.round(A[0] / 255 * 100),
      B = Math.round(A[1] / 255 * 100),
      G = Math.round(A[2] / 255 * 100);
    return A.length < 4 || A[3] === 1 ? "rgb(" + Q + "%, " + B + "%, " + G + "%)" : "rgba(" + Q + "%, " + B + "%, " + G + "%, " + A[3] + ")"
  };
  ZO.to.hsl = function () {
    var A = vSA(arguments);
    return A.length < 4 || A[3] === 1 ? "hsl(" + A[0] + ", " + A[1] + "%, " + A[2] + "%)" : "hsla(" + A[0] + ", " + A[1] + "%, " + A[2] + "%, " + A[3] + ")"
  };
  ZO.to.hwb = function () {
    var A = vSA(arguments),
      Q = "";
    if (A.length >= 4 && A[3] !== 1) Q = ", " + A[3];
    return "hwb(" + A[0] + ", " + A[1] + "%, " + A[2] + "%" + Q + ")"
  };
  ZO.to.keyword = function (A) {
    return ktB[A.slice(0, 3)]
  };

  function so(A, Q, B) {
    return Math.min(Math.max(Q, A), B)
  }

  function q51(A) {
    var Q = Math.round(A).toString(16).toUpperCase();
    return Q.length < 2 ? "0" + Q : Q
  }
})
// @from(Ln 243645, Col 4)
YZ0 = U((wGZ, gtB) => {
  var kSA = ZZ0(),
    htB = {};
  for (let A of Object.keys(kSA)) htB[kSA[A]] = A;
  var z9 = {
    rgb: {
      channels: 3,
      labels: "rgb"
    },
    hsl: {
      channels: 3,
      labels: "hsl"
    },
    hsv: {
      channels: 3,
      labels: "hsv"
    },
    hwb: {
      channels: 3,
      labels: "hwb"
    },
    cmyk: {
      channels: 4,
      labels: "cmyk"
    },
    xyz: {
      channels: 3,
      labels: "xyz"
    },
    lab: {
      channels: 3,
      labels: "lab"
    },
    lch: {
      channels: 3,
      labels: "lch"
    },
    hex: {
      channels: 1,
      labels: ["hex"]
    },
    keyword: {
      channels: 1,
      labels: ["keyword"]
    },
    ansi16: {
      channels: 1,
      labels: ["ansi16"]
    },
    ansi256: {
      channels: 1,
      labels: ["ansi256"]
    },
    hcg: {
      channels: 3,
      labels: ["h", "c", "g"]
    },
    apple: {
      channels: 3,
      labels: ["r16", "g16", "b16"]
    },
    gray: {
      channels: 1,
      labels: ["gray"]
    }
  };
  gtB.exports = z9;
  for (let A of Object.keys(z9)) {
    if (!("channels" in z9[A])) throw Error("missing channels property: " + A);
    if (!("labels" in z9[A])) throw Error("missing channel labels property: " + A);
    if (z9[A].labels.length !== z9[A].channels) throw Error("channel and label counts mismatch: " + A);
    let {
      channels: Q,
      labels: B
    } = z9[A];
    delete z9[A].channels, delete z9[A].labels, Object.defineProperty(z9[A], "channels", {
      value: Q
    }), Object.defineProperty(z9[A], "labels", {
      value: B
    })
  }
  z9.rgb.hsl = function (A) {
    let Q = A[0] / 255,
      B = A[1] / 255,
      G = A[2] / 255,
      Z = Math.min(Q, B, G),
      Y = Math.max(Q, B, G),
      J = Y - Z,
      X, I;
    if (Y === Z) X = 0;
    else if (Q === Y) X = (B - G) / J;
    else if (B === Y) X = 2 + (G - Q) / J;
    else if (G === Y) X = 4 + (Q - B) / J;
    if (X = Math.min(X * 60, 360), X < 0) X += 360;
    let D = (Z + Y) / 2;
    if (Y === Z) I = 0;
    else if (D <= 0.5) I = J / (Y + Z);
    else I = J / (2 - Y - Z);
    return [X, I * 100, D * 100]
  };
  z9.rgb.hsv = function (A) {
    let Q, B, G, Z, Y, J = A[0] / 255,
      X = A[1] / 255,
      I = A[2] / 255,
      D = Math.max(J, X, I),
      W = D - Math.min(J, X, I),
      K = function (V) {
        return (D - V) / 6 / W + 0.5
      };
    if (W === 0) Z = 0, Y = 0;
    else {
      if (Y = W / D, Q = K(J), B = K(X), G = K(I), J === D) Z = G - B;
      else if (X === D) Z = 0.3333333333333333 + Q - G;
      else if (I === D) Z = 0.6666666666666666 + B - Q;
      if (Z < 0) Z += 1;
      else if (Z > 1) Z -= 1
    }
    return [Z * 360, Y * 100, D * 100]
  };
  z9.rgb.hwb = function (A) {
    let Q = A[0],
      B = A[1],
      G = A[2],
      Z = z9.rgb.hsl(A)[0],
      Y = 0.00392156862745098 * Math.min(Q, Math.min(B, G));
    return G = 1 - 0.00392156862745098 * Math.max(Q, Math.max(B, G)), [Z, Y * 100, G * 100]
  };
  z9.rgb.cmyk = function (A) {
    let Q = A[0] / 255,
      B = A[1] / 255,
      G = A[2] / 255,
      Z = Math.min(1 - Q, 1 - B, 1 - G),
      Y = (1 - Q - Z) / (1 - Z) || 0,
      J = (1 - B - Z) / (1 - Z) || 0,
      X = (1 - G - Z) / (1 - Z) || 0;
    return [Y * 100, J * 100, X * 100, Z * 100]
  };

  function bo8(A, Q) {
    return (A[0] - Q[0]) ** 2 + (A[1] - Q[1]) ** 2 + (A[2] - Q[2]) ** 2
  }
  z9.rgb.keyword = function (A) {
    let Q = htB[A];
    if (Q) return Q;
    let B = 1 / 0,
      G;
    for (let Z of Object.keys(kSA)) {
      let Y = kSA[Z],
        J = bo8(A, Y);
      if (J < B) B = J, G = Z
    }
    return G
  };
  z9.keyword.rgb = function (A) {
    return kSA[A]
  };
  z9.rgb.xyz = function (A) {
    let Q = A[0] / 255,
      B = A[1] / 255,
      G = A[2] / 255;
    Q = Q > 0.04045 ? ((Q + 0.055) / 1.055) ** 2.4 : Q / 12.92, B = B > 0.04045 ? ((B + 0.055) / 1.055) ** 2.4 : B / 12.92, G = G > 0.04045 ? ((G + 0.055) / 1.055) ** 2.4 : G / 12.92;
    let Z = Q * 0.4124 + B * 0.3576 + G * 0.1805,
      Y = Q * 0.2126 + B * 0.7152 + G * 0.0722,
      J = Q * 0.0193 + B * 0.1192 + G * 0.9505;
    return [Z * 100, Y * 100, J * 100]
  };
  z9.rgb.lab = function (A) {
    let Q = z9.rgb.xyz(A),
      B = Q[0],
      G = Q[1],
      Z = Q[2];
    B /= 95.047, G /= 100, Z /= 108.883, B = B > 0.008856 ? B ** 0.3333333333333333 : 7.787 * B + 0.13793103448275862, G = G > 0.008856 ? G ** 0.3333333333333333 : 7.787 * G + 0.13793103448275862, Z = Z > 0.008856 ? Z ** 0.3333333333333333 : 7.787 * Z + 0.13793103448275862;
    let Y = 116 * G - 16,
      J = 500 * (B - G),
      X = 200 * (G - Z);
    return [Y, J, X]
  };
  z9.hsl.rgb = function (A) {
    let Q = A[0] / 360,
      B = A[1] / 100,
      G = A[2] / 100,
      Z, Y, J;
    if (B === 0) return J = G * 255, [J, J, J];
    if (G < 0.5) Z = G * (1 + B);
    else Z = G + B - G * B;
    let X = 2 * G - Z,
      I = [0, 0, 0];
    for (let D = 0; D < 3; D++) {
      if (Y = Q + 0.3333333333333333 * -(D - 1), Y < 0) Y++;
      if (Y > 1) Y--;
      if (6 * Y < 1) J = X + (Z - X) * 6 * Y;
      else if (2 * Y < 1) J = Z;
      else if (3 * Y < 2) J = X + (Z - X) * (0.6666666666666666 - Y) * 6;
      else J = X;
      I[D] = J * 255
    }
    return I
  };
  z9.hsl.hsv = function (A) {
    let Q = A[0],
      B = A[1] / 100,
      G = A[2] / 100,
      Z = B,
      Y = Math.max(G, 0.01);
    G *= 2, B *= G <= 1 ? G : 2 - G, Z *= Y <= 1 ? Y : 2 - Y;
    let J = (G + B) / 2,
      X = G === 0 ? 2 * Z / (Y + Z) : 2 * B / (G + B);
    return [Q, X * 100, J * 100]
  };
  z9.hsv.rgb = function (A) {
    let Q = A[0] / 60,
      B = A[1] / 100,
      G = A[2] / 100,
      Z = Math.floor(Q) % 6,
      Y = Q - Math.floor(Q),
      J = 255 * G * (1 - B),
      X = 255 * G * (1 - B * Y),
      I = 255 * G * (1 - B * (1 - Y));
    switch (G *= 255, Z) {
      case 0:
        return [G, I, J];
      case 1:
        return [X, G, J];
      case 2:
        return [J, G, I];
      case 3:
        return [J, X, G];
      case 4:
        return [I, J, G];
      case 5:
        return [G, J, X]
    }
  };
  z9.hsv.hsl = function (A) {
    let Q = A[0],
      B = A[1] / 100,
      G = A[2] / 100,
      Z = Math.max(G, 0.01),
      Y, J;
    J = (2 - B) * G;
    let X = (2 - B) * Z;
    return Y = B * Z, Y /= X <= 1 ? X : 2 - X, Y = Y || 0, J /= 2, [Q, Y * 100, J * 100]
  };
  z9.hwb.rgb = function (A) {
    let Q = A[0] / 360,
      B = A[1] / 100,
      G = A[2] / 100,
      Z = B + G,
      Y;
    if (Z > 1) B /= Z, G /= Z;
    let J = Math.floor(6 * Q),
      X = 1 - G;
    if (Y = 6 * Q - J, (J & 1) !== 0) Y = 1 - Y;
    let I = B + Y * (X - B),
      D, W, K;
    switch (J) {
      default:
      case 6:
      case 0:
        D = X, W = I, K = B;
        break;
      case 1:
        D = I, W = X, K = B;
        break;
      case 2:
        D = B, W = X, K = I;
        break;
      case 3:
        D = B, W = I, K = X;
        break;
      case 4:
        D = I, W = B, K = X;
        break;
      case 5:
        D = X, W = B, K = I;
        break
    }
    return [D * 255, W * 255, K * 255]
  };
  z9.cmyk.rgb = function (A) {
    let Q = A[0] / 100,
      B = A[1] / 100,
      G = A[2] / 100,
      Z = A[3] / 100,
      Y = 1 - Math.min(1, Q * (1 - Z) + Z),
      J = 1 - Math.min(1, B * (1 - Z) + Z),
      X = 1 - Math.min(1, G * (1 - Z) + Z);
    return [Y * 255, J * 255, X * 255]
  };
  z9.xyz.rgb = function (A) {
    let Q = A[0] / 100,
      B = A[1] / 100,
      G = A[2] / 100,
      Z, Y, J;
    return Z = Q * 3.2406 + B * -1.5372 + G * -0.4986, Y = Q * -0.9689 + B * 1.8758 + G * 0.0415, J = Q * 0.0557 + B * -0.204 + G * 1.057, Z = Z > 0.0031308 ? 1.055 * Z ** 0.4166666666666667 - 0.055 : Z * 12.92, Y = Y > 0.0031308 ? 1.055 * Y ** 0.4166666666666667 - 0.055 : Y * 12.92, J = J > 0.0031308 ? 1.055 * J ** 0.4166666666666667 - 0.055 : J * 12.92, Z = Math.min(Math.max(0, Z), 1), Y = Math.min(Math.max(0, Y), 1), J = Math.min(Math.max(0, J), 1), [Z * 255, Y * 255, J * 255]
  };
  z9.xyz.lab = function (A) {
    let Q = A[0],
      B = A[1],
      G = A[2];
    Q /= 95.047, B /= 100, G /= 108.883, Q = Q > 0.008856 ? Q ** 0.3333333333333333 : 7.787 * Q + 0.13793103448275862, B = B > 0.008856 ? B ** 0.3333333333333333 : 7.787 * B + 0.13793103448275862, G = G > 0.008856 ? G ** 0.3333333333333333 : 7.787 * G + 0.13793103448275862;
    let Z = 116 * B - 16,
      Y = 500 * (Q - B),
      J = 200 * (B - G);
    return [Z, Y, J]
  };
  z9.lab.xyz = function (A) {
    let Q = A[0],
      B = A[1],
      G = A[2],
      Z, Y, J;
    Y = (Q + 16) / 116, Z = B / 500 + Y, J = Y - G / 200;
    let X = Y ** 3,
      I = Z ** 3,
      D = J ** 3;
    return Y = X > 0.008856 ? X : (Y - 0.13793103448275862) / 7.787, Z = I > 0.008856 ? I : (Z - 0.13793103448275862) / 7.787, J = D > 0.008856 ? D : (J - 0.13793103448275862) / 7.787, Z *= 95.047, Y *= 100, J *= 108.883, [Z, Y, J]
  };
  z9.lab.lch = function (A) {
    let Q = A[0],
      B = A[1],
      G = A[2],
      Z;
    if (Z = Math.atan2(G, B) * 360 / 2 / Math.PI, Z < 0) Z += 360;
    let J = Math.sqrt(B * B + G * G);
    return [Q, J, Z]
  };
  z9.lch.lab = function (A) {
    let Q = A[0],
      B = A[1],
      Z = A[2] / 360 * 2 * Math.PI,
      Y = B * Math.cos(Z),
      J = B * Math.sin(Z);
    return [Q, Y, J]
  };
  z9.rgb.ansi16 = function (A, Q = null) {
    let [B, G, Z] = A, Y = Q === null ? z9.rgb.hsv(A)[2] : Q;
    if (Y = Math.round(Y / 50), Y === 0) return 30;
    let J = 30 + (Math.round(Z / 255) << 2 | Math.round(G / 255) << 1 | Math.round(B / 255));
    if (Y === 2) J += 60;
    return J
  };
  z9.hsv.ansi16 = function (A) {
    return z9.rgb.ansi16(z9.hsv.rgb(A), A[2])
  };
  z9.rgb.ansi256 = function (A) {
    let Q = A[0],
      B = A[1],
      G = A[2];
    if (Q === B && B === G) {
      if (Q < 8) return 16;
      if (Q > 248) return 231;
      return Math.round((Q - 8) / 247 * 24) + 232
    }
    return 16 + 36 * Math.round(Q / 255 * 5) + 6 * Math.round(B / 255 * 5) + Math.round(G / 255 * 5)
  };
  z9.ansi16.rgb = function (A) {
    let Q = A % 10;
    if (Q === 0 || Q === 7) {
      if (A > 50) Q += 3.5;
      return Q = Q / 10.5 * 255, [Q, Q, Q]
    }
    let B = (~~(A > 50) + 1) * 0.5,
      G = (Q & 1) * B * 255,
      Z = (Q >> 1 & 1) * B * 255,
      Y = (Q >> 2 & 1) * B * 255;
    return [G, Z, Y]
  };
  z9.ansi256.rgb = function (A) {
    if (A >= 232) {
      let Y = (A - 232) * 10 + 8;
      return [Y, Y, Y]
    }
    A -= 16;
    let Q, B = Math.floor(A / 36) / 5 * 255,
      G = Math.floor((Q = A % 36) / 6) / 5 * 255,
      Z = Q % 6 / 5 * 255;
    return [B, G, Z]
  };
  z9.rgb.hex = function (A) {
    let B = (((Math.round(A[0]) & 255) << 16) + ((Math.round(A[1]) & 255) << 8) + (Math.round(A[2]) & 255)).toString(16).toUpperCase();
    return "000000".substring(B.length) + B
  };
  z9.hex.rgb = function (A) {
    let Q = A.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!Q) return [0, 0, 0];
    let B = Q[0];
    if (Q[0].length === 3) B = B.split("").map((X) => {
      return X + X
    }).join("");
    let G = parseInt(B, 16),
      Z = G >> 16 & 255,
      Y = G >> 8 & 255,
      J = G & 255;
    return [Z, Y, J]
  };
  z9.rgb.hcg = function (A) {
    let Q = A[0] / 255,
      B = A[1] / 255,
      G = A[2] / 255,
      Z = Math.max(Math.max(Q, B), G),
      Y = Math.min(Math.min(Q, B), G),
      J = Z - Y,
      X, I;
    if (J < 1) X = Y / (1 - J);
    else X = 0;
    if (J <= 0) I = 0;
    else if (Z === Q) I = (B - G) / J % 6;
    else if (Z === B) I = 2 + (G - Q) / J;
    else I = 4 + (Q - B) / J;
    return I /= 6, I %= 1, [I * 360, J * 100, X * 100]
  };
  z9.hsl.hcg = function (A) {
    let Q = A[1] / 100,
      B = A[2] / 100,
      G = B < 0.5 ? 2 * Q * B : 2 * Q * (1 - B),
      Z = 0;
    if (G < 1) Z = (B - 0.5 * G) / (1 - G);
    return [A[0], G * 100, Z * 100]
  };
  z9.hsv.hcg = function (A) {
    let Q = A[1] / 100,
      B = A[2] / 100,
      G = Q * B,
      Z = 0;
    if (G < 1) Z = (B - G) / (1 - G);
    return [A[0], G * 100, Z * 100]
  };
  z9.hcg.rgb = function (A) {
    let Q = A[0] / 360,
      B = A[1] / 100,
      G = A[2] / 100;
    if (B === 0) return [G * 255, G * 255, G * 255];
    let Z = [0, 0, 0],
      Y = Q % 1 * 6,
      J = Y % 1,
      X = 1 - J,
      I = 0;
    switch (Math.floor(Y)) {
      case 0:
        Z[0] = 1, Z[1] = J, Z[2] = 0;
        break;
      case 1:
        Z[0] = X, Z[1] = 1, Z[2] = 0;
        break;
      case 2:
        Z[0] = 0, Z[1] = 1, Z[2] = J;
        break;
      case 3:
        Z[0] = 0, Z[1] = X, Z[2] = 1;
        break;
      case 4:
        Z[0] = J, Z[1] = 0, Z[2] = 1;
        break;
      default:
        Z[0] = 1, Z[1] = 0, Z[2] = X
    }
    return I = (1 - B) * G, [(B * Z[0] + I) * 255, (B * Z[1] + I) * 255, (B * Z[2] + I) * 255]
  };
  z9.hcg.hsv = function (A) {
    let Q = A[1] / 100,
      B = A[2] / 100,
      G = Q + B * (1 - Q),
      Z = 0;
    if (G > 0) Z = Q / G;
    return [A[0], Z * 100, G * 100]
  };
  z9.hcg.hsl = function (A) {
    let Q = A[1] / 100,
      G = A[2] / 100 * (1 - Q) + 0.5 * Q,
      Z = 0;
    if (G > 0 && G < 0.5) Z = Q / (2 * G);
    else if (G >= 0.5 && G < 1) Z = Q / (2 * (1 - G));
    return [A[0], Z * 100, G * 100]
  };
  z9.hcg.hwb = function (A) {
    let Q = A[1] / 100,
      B = A[2] / 100,
      G = Q + B * (1 - Q);
    return [A[0], (G - Q) * 100, (1 - G) * 100]
  };
  z9.hwb.hcg = function (A) {
    let Q = A[1] / 100,
      G = 1 - A[2] / 100,
      Z = G - Q,
      Y = 0;
    if (Z < 1) Y = (G - Z) / (1 - Z);
    return [A[0], Z * 100, Y * 100]
  };
  z9.apple.rgb = function (A) {
    return [A[0] / 65535 * 255, A[1] / 65535 * 255, A[2] / 65535 * 255]
  };
  z9.rgb.apple = function (A) {
    return [A[0] / 255 * 65535, A[1] / 255 * 65535, A[2] / 255 * 65535]
  };
  z9.gray.rgb = function (A) {
    return [A[0] / 100 * 255, A[0] / 100 * 255, A[0] / 100 * 255]
  };
  z9.gray.hsl = function (A) {
    return [0, 0, A[0]]
  };
  z9.gray.hsv = z9.gray.hsl;
  z9.gray.hwb = function (A) {
    return [0, 100, A[0]]
  };
  z9.gray.cmyk = function (A) {
    return [0, 0, 0, A[0]]
  };
  z9.gray.lab = function (A) {
    return [A[0], 0, 0]
  };
  z9.gray.hex = function (A) {
    let Q = Math.round(A[0] / 100 * 255) & 255,
      G = ((Q << 16) + (Q << 8) + Q).toString(16).toUpperCase();
    return "000000".substring(G.length) + G
  };
  z9.rgb.gray = function (A) {
    return [(A[0] + A[1] + A[2]) / 3 / 255 * 100]
  }
})
// @from(Ln 244164, Col 4)
mtB = U((LGZ, utB) => {
  var N51 = YZ0();

  function fo8() {
    let A = {},
      Q = Object.keys(N51);
    for (let B = Q.length, G = 0; G < B; G++) A[Q[G]] = {
      distance: -1,
      parent: null
    };
    return A
  }

  function ho8(A) {
    let Q = fo8(),
      B = [A];
    Q[A].distance = 0;
    while (B.length) {
      let G = B.pop(),
        Z = Object.keys(N51[G]);
      for (let Y = Z.length, J = 0; J < Y; J++) {
        let X = Z[J],
          I = Q[X];
        if (I.distance === -1) I.distance = Q[G].distance + 1, I.parent = G, B.unshift(X)
      }
    }
    return Q
  }

  function go8(A, Q) {
    return function (B) {
      return Q(A(B))
    }
  }

  function uo8(A, Q) {
    let B = [Q[A].parent, A],
      G = N51[Q[A].parent][A],
      Z = Q[A].parent;
    while (Q[Z].parent) B.unshift(Q[Z].parent), G = go8(N51[Q[Z].parent][Z], G), Z = Q[Z].parent;
    return G.conversion = B, G
  }
  utB.exports = function (A) {
    let Q = ho8(A),
      B = {},
      G = Object.keys(Q);
    for (let Z = G.length, Y = 0; Y < Z; Y++) {
      let J = G[Y];
      if (Q[J].parent === null) continue;
      B[J] = uo8(J, Q)
    }
    return B
  }
})
// @from(Ln 244218, Col 4)
XZ0 = U((OGZ, dtB) => {
  var JZ0 = YZ0(),
    mo8 = mtB(),
    XKA = {},
    do8 = Object.keys(JZ0);

  function co8(A) {
    let Q = function (...B) {
      let G = B[0];
      if (G === void 0 || G === null) return G;
      if (G.length > 1) B = G;
      return A(B)
    };
    if ("conversion" in A) Q.conversion = A.conversion;
    return Q
  }

  function po8(A) {
    let Q = function (...B) {
      let G = B[0];
      if (G === void 0 || G === null) return G;
      if (G.length > 1) B = G;
      let Z = A(B);
      if (typeof Z === "object")
        for (let Y = Z.length, J = 0; J < Y; J++) Z[J] = Math.round(Z[J]);
      return Z
    };
    if ("conversion" in A) Q.conversion = A.conversion;
    return Q
  }
  do8.forEach((A) => {
    XKA[A] = {}, Object.defineProperty(XKA[A], "channels", {
      value: JZ0[A].channels
    }), Object.defineProperty(XKA[A], "labels", {
      value: JZ0[A].labels
    });
    let Q = mo8(A);
    Object.keys(Q).forEach((G) => {
      let Z = Q[G];
      XKA[A][G] = po8(Z), XKA[A][G].raw = co8(Z)
    })
  });
  dtB.exports = XKA
})